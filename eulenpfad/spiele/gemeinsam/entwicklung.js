/* Entwickler-Modus (Entscheide E1 a, E2 a, E3 a, LERN_Session6).
   Die Aufsicht schaltet ihn mit dem Entwickler-Schlüssel frei (Verwaltung → Entwicklung); danach blendet
   ein eigener Schalter die Zusätze ein: in den Spielen eine Leiste mit „Spiel angesehen“ und „Bemerkung“,
   in der Freigabe „geprüft“ je Spiel und Liste und die Prüfliste je Liste.
   Dauerhaft geschrieben wird nur über den Entwickler-Server (tools/entwickler_server.py) im lokalen Repo:
   Prüfstand nach pruefstand.js, Bemerkungen nach docs/eulenpfad/bemerkungen.json. Ohne Server bleiben die
   Knöpfe sichtbar, melden aber, dass er fehlt.
   Der Schlüssel steht im Klartext nur in entwickler.key (von Git ausgeschlossen); hier steht sein Hash. */
"use strict";

LS.entwicklung = (() => {
  // SHA-256 von SALZ + Schlüssel; neu gesetzt von: python tools/entwickler_server.py --neuer-schluessel
  const SCHLUESSEL_HASH = "a1fb5dbb5d54c6de3acc1d372cdef564fedf87e2e349aa1bc4bbddf3be702035";
  const SALZ = "eulenpfad-entwickler:";
  const SERVER_FEHLT = "Entwickler-Server nicht gefunden.\n\nDer Entwickler-Modus funktioniert nur im lokalen Repo mit laufendem Server:\n"
    + "python tools/entwickler_server.py\ndanach http://localhost:8765/eulenpfad/ öffnen.";
  const FREMDER_SERVER = "Hier antwortet ein anderer Server ohne Entwickler-Funktionen (z. B. ein noch laufendes "
    + "python -m http.server auf demselben Port).\n\nDiesen beenden, dann python tools/entwickler_server.py starten "
    + "und die Seite mit Strg+F5 neu laden.";
  let fremd = false; // Auf der Adresse läuft ein Server, aber nicht der Entwickler-Server
  const serverMeldung = () => (fremd ? FREMDER_SERVER : SERVER_FEHLT);

  // lernspiele:entwickler = { schluessel, an, name } — nur auf diesem Gerät, wird nicht abgeglichen.
  const zustand = () => ({ schluessel: null, an: false, name: "", ...(LS.lies("entwickler", null) || {}) });
  const speichere = daten => LS.schreibe("entwickler", { ...zustand(), ...daten });
  const freigeschaltet = () => !!zustand().schluessel;
  /** Sind die Entwickler-Zusätze sichtbar? Nur für die angemeldete Aufsicht, freigeschaltet und eingeschaltet. */
  const aktiv = () => LS.aufsichtAngemeldet() && freigeschaltet() && zustand().an;
  const name = () => zustand().name || LS.aktuellerSpieler() || "";

  async function hash(text) {
    const roh = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(roh)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  /** Schlüssel prüfen (gegen den Hash) und auf diesem Gerät merken; true bei Erfolg. */
  async function freischalten(schluessel) {
    const s = String(schluessel).trim();
    if (!s || !SCHLUESSEL_HASH || (await hash(SALZ + s)) !== SCHLUESSEL_HASH) return false;
    speichere({ schluessel: s, an: true });
    return true;
  }
  const sperren = () => LS.schreibe("entwickler", null);
  const setzeAn = an => speichere({ an: !!an });
  const benenne = n => speichere({ name: String(n).trim().slice(0, 40) });

  // ----- Entwickler-Server -----
  let serverDa = null;
  /** Läuft die Seite über den Entwickler-Server? { ok, schluessel } oder null. Erfolg wird gemerkt. */
  async function server() {
    if (serverDa) return serverDa;
    try {
      const r = await fetch("/entwicklung/status", { cache: "no-store" });
      fremd = !r.ok && location.protocol.startsWith("http") && ["localhost", "127.0.0.1"].includes(location.hostname);
      if (r.ok) serverDa = await r.json();
    } catch { /* kein Server */ }
    return serverDa;
  }
  /** An den Server schicken; meldet selbst, was schiefging, und gibt dann null zurück. */
  async function sende(pfad, daten) {
    if (!(await server())) { alert(serverMeldung()); return null; }
    try {
      const r = await fetch(pfad, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...daten, schluessel: zustand().schluessel }) });
      const antwort = await r.json();
      if (!r.ok) { alert(`Entwickler-Server: ${antwort.fehler || r.status}`); return null; }
      return antwort;
    } catch {
      serverDa = null;
      alert(serverMeldung());
      return null;
    }
  }

  /** Spiel als angesehen bzw. Liste als geprüft setzen (geprueft false: aufheben). art "spiele" | "listen". */
  async function setzeGeprueft(art, id, geprueft) {
    const stand = await sende("/entwicklung/pruefstand", { art, id, geprueft, von: name() });
    if (!stand) return false;
    if (typeof PRUEFSTAND !== "undefined") { PRUEFSTAND.spiele = stand.spiele || {}; PRUEFSTAND.listen = stand.listen || {}; }
    return true;
  }
  /**
   * Haken je Eintrag einer Liste (Prüfansicht, LP2 a): { liste, setzen: [schlüssel], entfernen: [schlüssel], komplett, hash }.
   * Der Server schreibt pruefstand-eintraege.json und bei komplett die Liste in pruefstand.js (mit hash), sonst entfernt
   * er sie dort.
   */
  async function setzeEintraege(daten) {
    const stand = await sende("/entwicklung/eintraege", { ...daten, von: name() });
    if (!stand) return false;
    if (typeof PRUEFSTAND !== "undefined") PRUEFSTAND.listen = stand.listen || {};
    return true;
  }
  /** Status einer Bemerkung setzen (Prüfansicht: „✕ entfernen“ → erledigt). */
  const bemerkungStatus = async (nr, status) => !!(await sende("/entwicklung/bemerkung-status", { nr, status }));
  /** Bemerkung für die Entwicklung: { text, spiel?, stufe?, liste?, eintrag?, schluessel?, aufgabe? }. */
  const bemerkung = daten => sende("/entwicklung/bemerkung", { von: name(), seite: location.pathname, ...daten });
  /** Alle Bemerkungen (über den Server) oder null. */
  async function bemerkungen() {
    if (!(await server())) return null;
    try { return await (await fetch("/entwicklung/bemerkungen", { cache: "no-store" })).json(); } catch { return null; }
  }

  // ----- Inhaltsliste ansehen (Entscheid E3 a): Einträge aus der Prüfliste, über den Entwickler-Server -----
  let listenDaten = null;
  /**
   * Dialog mit allen Einträgen einer Inhaltsliste, „✓ Liste geprüft“ und Bemerkung je Eintrag.
   * spiel: Katalog-Eintrag; liste: aus LS.spielListen; nachher(): nach dem Prüfen (neu zeichnen).
   */
  async function zeigeListe(spiel, liste, nachher) {
    const { el } = LS;
    if (!(await server())) return alert(serverMeldung());
    try { listenDaten ||= await (await fetch("/docs/eulenpfad/pruefung/listen.json", { cache: "no-store" })).json(); }
    catch { return alert("Die Prüfliste je Liste fehlt: node tools/pruefliste_wortlisten.js"); }
    const teil = listenDaten[liste.quelle];
    const knopf = (text, onclick, art = "hell") => el("button", { type: "button", class: `knopf ${art} klein`, text, onclick });
    const dialog = el("dialog", { class: "listen-dialog" });
    const schliessen = () => { dialog.close(); dialog.remove(); };
    const feld = el("div");
    const bemerken = kontext => {
      feld.innerHTML = "";
      feld.append(bemerkungsFeld(() => ({ spiel: spiel.id, liste: liste.quelle, ...kontext }), () => (feld.innerHTML = "")));
      feld.scrollIntoView({ block: "nearest" });
    };
    const kopf = el("div", { class: "knopfzeile" },
      knopf(liste.geprueft ? "Prüfung aufheben" : "✓ Liste geprüft", async () => {
        if (await setzeGeprueft("listen", liste.quelle, !liste.geprueft)) { schliessen(); nachher?.(); }
      }, liste.geprueft ? "hell" : "gruen"),
      knopf("📝 Bemerkung zur Liste", () => bemerken({})),
      knopf("Schliessen", schliessen));
    const inhalt = !teil
      ? [el("p", { text: "Für diese Liste gibt es in der Prüfliste noch keinen Abschnitt." })]
      : teil.tabellen.map(t => el("div", {},
          t.titel ? el("h3", { text: t.titel }) : null,
          t.hinweis ? el("p", { class: "leise", text: t.hinweis }) : null,
          el("table", {},
            el("thead", {}, el("tr", {}, ...t.kopf.map(k => el("th", { text: k })), el("th"))),
            // Eine Zelle „svg:<name>“ zeigt die Zeichnung aus der Bildersammlung (B1 a; Bemerkungen 12, 13)
            el("tbody", {}, ...t.zeilen.map(z => el("tr", {}, ...z.map(w => LS.zelleMitBildern(w)),
              el("td", {}, el("button", { type: "button", class: "knopf hell klein", text: "📝", title: "Bemerkung zu diesem Eintrag",
                onclick: () => bemerken({ eintrag: z.join(" | ") }) }))))))));
    dialog.append(el("h2", { text: `${spiel.bild} ${spiel.name} — ${liste.name}` }), kopf, feld, ...inhalt);
    dialog.addEventListener("close", () => dialog.remove());
    document.body.append(dialog);
    dialog.showModal();
  }

  // ----- Leiste in den Spielen -----
  /** Formular für eine Bemerkung; kontext() liefert Spiel, Stufe, Aufgabe … beim Absenden. */
  function bemerkungsFeld(kontext, fertig) {
    const { el } = LS;
    const text = el("textarea", { rows: "3", placeholder: "Was stimmt nicht oder soll anders werden?", "aria-label": "Bemerkung" });
    const meldung = el("span", { class: "leise" });
    const feld = el("div", { class: "entwickler-feld" }, text,
      el("div", { class: "knopfzeile" },
        el("button", { type: "button", class: "knopf gruen klein", text: "Senden", onclick: async () => {
          if (!text.value.trim()) return (meldung.textContent = "Bitte etwas eintragen.");
          const b = await bemerkung({ text: text.value, ...kontext() });
          if (b) { meldung.textContent = `✓ Bemerkung Nr. ${b.nr} gespeichert.`; text.value = ""; setTimeout(fertig, 900); }
        } }),
        el("button", { type: "button", class: "knopf hell klein", text: "Abbrechen", onclick: fertig }),
        meldung));
    setTimeout(() => text.focus(), 0);
    return feld;
  }

  let listenOffen = false; // Inhaltslisten in der Leiste aufgeklappt (bleibt beim Neuzeichnen)
  let leisteDa = false;
  function spielLeiste() {
    const { el } = LS;
    const stand = LS.spielStand();
    if (leisteDa || !stand || !aktiv() || window.parent !== window) return;
    leisteDa = true;
    const leiste = el("div", { class: "entwickler-leiste" });
    document.body.append(leiste);
    const zeichne = async () => {
      leiste.innerHTML = "";
      const g = LS.spielGeprueft(stand.spiel);
      const da = await server();
      // Eigene Inhaltslisten (ohne Verweise): erst wenn eine geprüft ist, sehen Kinder das Spiel.
      const listen = LS.spielListen(stand.spiel).filter(l => !l.von && !l.zusatz);
      const geprueft = listen.filter(l => l.geprueft).length;
      const grund = LS.sperrGrund(stand.spiel);
      leiste.append(
        el("b", { text: "🛠 Entwickler" }),
        el("span", { class: "leise", text: da ? "Server verbunden" : fremd ? "⚠ falscher Server auf diesem Port" : "⚠ Server nicht gefunden" }),
        el("span", { text: g ? `✓ angesehen ${g.am}${g.von ? " · " + g.von : ""}` : "noch nicht angesehen" }),
        el("span", { class: "leise", text: grund ? `Kinder sehen es nicht: ${grund}` : "für Kinder sichtbar" }),
        el("button", { type: "button", class: "knopf hell klein", text: g ? "Markierung aufheben" : "✓ Spiel angesehen",
          onclick: async () => { if (await setzeGeprueft("spiele", stand.spiel, !g)) zeichne(); } }),
        el("button", { type: "button", class: "knopf hell klein", text: "📝 Bemerkung", onclick: () => {
          leiste.querySelector(".entwickler-feld")?.remove();
          leiste.append(bemerkungsFeld(() => {
            const s = LS.spielStand() || {};
            return { spiel: s.spiel, stufe: s.stufe, aufgabe: s.aufgabe ? `Aufgabe ${s.nr + 1}: ${s.aufgabe()}` : undefined }; // nr zählt ab 0
          }, zeichne));
        } }));
      // Inhaltslisten direkt hier prüfen (Wunsch Patrik, LERN_Session6): Der Name öffnet die Liste; geprüft
      // wird erst dort, nach dem Ansehen. Geprüfte Listen grün.
      if (listen.length) {
        const eintrag = SPIELE.find(x => x.id === stand.spiel);
        const auf = el("details", { class: "entwickler-listen" },
          el("summary", { text: `Inhaltslisten: ${geprueft} von ${listen.length} geprüft — Liste ansehen:` }),
          el("ul", {}, ...listen.map(l => el("li", {},
            el("button", { type: "button", class: "liste-link" + (l.geprueft ? " geprueft" : ""),
              title: l.geprueft ? `geprüft ${l.geprueft.am}${l.geprueft.von ? " · " + l.geprueft.von : ""}` : "noch nicht geprüft",
              text: `${l.geprueft ? "✓" : "○"} ${l.name}`,
              // Neue Prüfansicht je Eintrag, wo das Spiel eine pruefung.js hat (LP1 a); sonst die alte Tabelle.
              onclick: async () => { if (!(await LS.listenPruefen(stand.spiel, l.id))) zeigeListe(eintrag, l, zeichne); } })))));
        auf.open = listenOffen;
        auf.addEventListener("toggle", () => { listenOffen = auf.open; });
        leiste.append(auf);
      }
    };
    zeichne();
  }
  // Beim Laden der Seite und, für Spiele, die auf eine Stimme warten (spielMitStimme), wenn das Spiel startet.
  if (typeof document !== "undefined") {
    addEventListener("DOMContentLoaded", spielLeiste);
    document.addEventListener("lernspiele:spiel", () => { if (document.readyState !== "loading") spielLeiste(); });
  }

  return { freigeschaltet, aktiv, freischalten, sperren, setzeAn, benenne, name, server, setzeGeprueft, setzeEintraege,
    bemerkung, bemerkungen, bemerkungStatus, bemerkungsFeld, zeigeListe, zustand, serverMeldung };
})();
