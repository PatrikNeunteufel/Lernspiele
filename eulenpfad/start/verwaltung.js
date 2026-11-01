/* Tab „Verwaltung“ (nur Aufsicht): Spiele und Inhaltslisten freigeben oder sperren (Entscheid L4 a),
   Konten anlegen, Rollen und PIN (Entscheid L1 a, L2 a). Alles gilt für dieses Gerät. */
"use strict";

// Suche in der Freigabe (wie im Tab Spiele, suchFeld aus start/spiele.js); bleibt beim Neuzeichnen erhalten.
let freigabeSuche = "";

function zeichneVerwaltung(box, neu) {
  const { el } = LS;
  if (!LS.aufsichtAngemeldet()) return;
  const seite = el("div", { class: "verwaltung" });
  box.append(seite);
  const karte = (...inhalt) => el("section", { class: "karte" }, ...inhalt);
  const knopf = (text, onclick, klasse = "hell") => el("button", { type: "button", class: `knopf ${klasse} klein`, text, onclick });
  const zeile = (...k) => el("div", { class: "knopfzeile", style: "justify-content:flex-start;flex-wrap:wrap" }, ...k);
  const stand = g => g
    ? el("span", { class: "pruefstand ok", text: `✓ geprüft ${g.am}${g.von ? " · " + g.von : ""}` })
    : el("span", { class: "pruefstand offen", text: "ungeprüft" });
  /** Schalter mit drei Zuständen: frei, gesperrt, „nach Prüfstand“ (kein eigener Eintrag). */
  function schalter(frei, eigen, setze) {
    return el("div", { class: "zeile-knoepfe" },
      el("button", { type: "button", class: "schalter " + (frei ? "frei" : "gesperrt"), text: frei ? "✓ frei" : "🔒 gesperrt", onclick: () => { setze(!frei); neu(); } }),
      eigen ? el("button", { type: "button", class: "schalter", text: "↺ wie Prüfstand", title: "Eigene Einstellung entfernen", onclick: () => { setze(null); neu(); } }) : null);
  }

  // Untertabs (Wunsch Patrik, LERN_Session6), in der Adresse #verwaltung/<id>; ohne Angabe Konten.
  const UNTER = [
    { id: "konten", text: "👥 Konten", zeichne: konten },
    { id: "freigabe", text: "✓ Freigabe", zeichne: freigabeTeil },
    { id: "abgleich", text: "🔄 Abgleich", zeichne: abgleich },
    { id: "einstellungen", text: "⚙️ Einstellungen", zeichne: einstellungen },
    { id: "entwicklung", text: "🛠 Entwicklung", zeichne: entwicklung },
  ];
  const dev = LS.entwicklung.aktiv();
  /** Entwickler: Prüfstand setzen oder aufheben, danach neu zeichnen (meldet selbst, wenn der Server fehlt). */
  const pruefKnopf = (art, id, g, text) => el("button", { type: "button", class: "schalter", text: g ? "aufheben" : text,
    onclick: async () => { if (await LS.entwicklung.setzeGeprueft(art, id, !g)) neu(); } });
  const unter = UNTER.find(u => u.id === location.hash.split("/")[1]) || UNTER[0];
  seite.append(el("nav", { class: "tabs untertabs", role: "tablist" }, ...UNTER.map(u =>
    el("a", { class: "tab", role: "tab", href: `#verwaltung/${u.id}`, "aria-selected": String(u === unter), text: u.text }))));
  unter.zeichne();

  // ----- Spiele und Listen -----
  function freigabeTeil() {
    const f = LS.freigabe();
    const sichtbar = SPIELE.filter(s => LS.fuerKinderSichtbar(s.id)).length;
    /** Alle Spiele und ihre Listen (Verweise gelten über ihre Quelle) auf einmal setzen. */
    const alleSetzen = wert => {
      for (const s of SPIELE) {
        LS.setzeSpielFrei(s.id, wert);
        for (const l of LS.spielListen(s.id)) if (!l.von) LS.setzeListeFrei(s.id, l.id, wert);
      }
      neu();
    };
    /** Zeilen eines Spiels: das Spiel, darunter seine Inhaltslisten; grund: warum es zur Suche passt. */
    function spielZeilen(s, grund) {
      const g = LS.spielGeprueft(s.id);
      const zeilen = [el("tr", {},
        el("td", {}, `${s.bild} ${s.name}`, grund ? el("div", { class: "marke such-grund", text: `🔍 gefunden ${grund}` }) : null),
        el("td", {}, el("div", { class: "zeile-knoepfe" },
          g || s.neu ? stand(g) : el("span", { class: "pruefstand ok", text: "nichts zu prüfen" }),
          dev ? pruefKnopf("spiele", s.id, g, "✓ angesehen") : null)),
        el("td", {}, schalter(LS.spielFrei(s.id), s.id in f.spiele, w => LS.setzeSpielFrei(s.id, w))))];
      for (const l of LS.spielListen(s.id)) {
        // Verweis auf die Liste eines anderen Spiels: dort freigeben, hier nur zeigen.
        const quelle = l.von ? SPIELE.find(x => x.id === l.von.split("/")[0]) : null;
        // Entwickler: Der Listenname öffnet die Liste; geprüft wird erst dort, nach dem Ansehen.
        zeilen.push(el("tr", {},
          el("td", { style: "padding-left:36px" }, "↳ ", dev && !quelle
            ? el("button", { type: "button", class: "liste-link" + (l.geprueft ? " geprueft" : ""), text: l.name, title: "Liste ansehen", onclick: () => zeigeListe(s, l) })
            : l.name),
          el("td", {}, stand(l.geprueft)),
          el("td", {}, quelle
            ? el("span", { class: "leise-text", text: `${LS.listeFrei(s.id, l.id) ? "✓ frei" : "🔒 gesperrt"} — wie bei ${quelle.name}` })
            : schalter(LS.listeFrei(s.id, l.id), `${s.id}/${l.id}` in f.listen, w => LS.setzeListeFrei(s.id, l.id, w)))));
      }
      return zeilen;
    }
    const tabelle = zeilen => el("div", { class: "tabelle-rahmen" }, el("table", {},
      el("thead", {}, el("tr", {}, ...["Spiel / Liste", "Prüfstand", "für Kinder"].map(t => el("th", { text: t })))),
      el("tbody", {}, ...zeilen)));
    const gruppen = [];
    const treffer = freigabeSuche.trim() ? LS.suche(freigabeSuche) || [] : null;
    if (treffer) {
      // Suche (Entscheid SU1 a): eine Liste, beste Treffer zuerst, je mit Grund, wenn er nicht sichtbar ist.
      if (treffer.length) gruppen.push(el("div", {}, el("h3", { text: `🔍 ${treffer.length} Treffer, beste zuerst` }),
        tabelle(treffer.flatMap(t => spielZeilen(SPIELE.find(s => s.id === t.id), t.grund)))));
    } else {
      // Je Fach eine zuklappbare Gruppe, zu Beginn zu; welche offen sind, merkt sich das Gerät (nicht abgeglichen).
      const offen = new Set(LS.lies("verwaltungOffen", []));
      for (const fach of [...new Set(THEMEN.map(t => t.fach))]) {
        const spiele = SPIELE.filter(s => THEMEN.find(t => t.id === s.thema)?.fach === fach);
        if (!spiele.length) continue;
        const frei = spiele.filter(s => LS.fuerKinderSichtbar(s.id)).length;
        const zuPruefen = spiele.filter(s => LS.spielZuPruefen(s.id) || LS.spielListen(s.id).some(l => !l.von && !l.geprueft)).length;
        const gruppe = el("details", { class: "gruppe" },
          el("summary", {}, el("span", { text: fach }),
            el("span", { class: "anzahl", text: `${frei} von ${spiele.length} frei${zuPruefen ? ` · ${zuPruefen} zu prüfen` : ""}` })),
          tabelle(spiele.flatMap(s => spielZeilen(s, null))));
        gruppe.open = offen.has(fach);
        gruppe.addEventListener("toggle", () => {
          gruppe.open ? offen.add(fach) : offen.delete(fach);
          LS.schreibe("verwaltungOffen", [...offen]);
        });
        gruppen.push(gruppe);
      }
    }
    seite.append(karte(
      el("h2", { text: "Spiele und Inhalte freigeben" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: `Kinder sehen ${sichtbar} von ${SPIELE.length} Spielen. Frei ist, was nichts mehr zu prüfen hat: Neue Spiele sind gesperrt, bis sie angesehen sind, Inhaltslisten, bis sie geprüft sind (Prüfstand im Repo, gesetzt im Entwickler-Modus). Hier lässt sich das anders setzen; mit Abgleich gilt es für alle Geräte. Ein Spiel mit Inhaltslisten braucht mindestens eine freie Liste; die Kinder üben nur die freien Listen.` }),
      zeile(knopf("✓ Alles freigeben", () => alleSetzen(true)), knopf("🔒 Alles sperren", () => alleSetzen(false)), knopf("↺ Alles wie Prüfstand", () => alleSetzen(null))),
      zeile(suchFeld(freigabeSuche, v => { freigabeSuche = v; }, neu, "🔍 Spiel oder Inhaltsliste suchen")),
      ...gruppen,
      gruppen.length ? null : el("p", { class: "leise-text", text: "Kein Spiel passt zur Suche." })));
  }

  // ----- Konten -----
  function konten() {
    const meldung = el("div", { class: "meldung", style: "text-align:left", "aria-live": "polite" });
    const kontoZeilen = LS.spielerListe().map(n => {
      const p = LS.profil(n);
      const pin = el("input", { class: "feld", type: "password", inputmode: "numeric", maxlength: "6", placeholder: "neue PIN", "aria-label": `Neue PIN für ${n}`, style: "width:120px;font-size:16px" });
      const ich = n === LS.aktuellerSpieler();
      return el("tr", {},
        el("td", {}, el("b", { text: LS.spielerName(n) }), p.klasse ? el("span", { class: "leise-text", text: ` · ${p.klasse}. Klasse` }) : null),
        el("td", { text: p.rolle === "aufsicht" ? (p.pin ? "Aufsicht" : "Aufsicht (ohne PIN)") : "Kind" }),
        el("td", {}, el("div", { class: "zeile-knoepfe" },
          p.rolle === "aufsicht" ? el("span", { class: "zeile-knoepfe" }, pin,
            el("button", { type: "button", class: "schalter", text: "PIN setzen", onclick: async () => {
              meldung.textContent = (await LS.setzePin(n, pin.value)) ? `✓ PIN für ${n} gesetzt.` : "Die PIN hat 4 bis 6 Ziffern.";
            } })) : null,
          ich ? null : el("button", { type: "button", class: "schalter", text: p.rolle === "aufsicht" ? "→ Kind" : "→ Aufsicht", onclick: () => {
            LS.speichereProfil(n, p.rolle === "aufsicht" ? { rolle: "kind", pin: null } : { rolle: "aufsicht" });
            neu();
          } }),
          ich ? null : el("button", { type: "button", class: "schalter gesperrt", text: "🗑 löschen", onclick: () => {
            if (confirm(`${n} mit Profil und allen Runden löschen? Vorher in der Statistik sichern.`)) { LS.loescheSpieler(n); neu(); }
          } }))));
    });
    const neuName = el("input", { class: "feld", type: "text", maxlength: "20", placeholder: "Name", "aria-label": "Name des neuen Kindes" });
    const neuKlasse = el("select", { "aria-label": "Klasse" }, el("option", { value: "", text: "Klasse —" }),
      ...[1, 2, 3, 4, 5, 6].map(k => el("option", { value: String(k), text: `${k}. Klasse` })));
    const anlegen = () => {
      const n = LS.neuerSpieler(neuName.value, { klasse: neuKlasse.value ? Number(neuKlasse.value) : null });
      if (!n) return (meldung.textContent = "Bitte einen neuen, noch nicht vergebenen Namen eingeben.");
      neu();
    };
    seite.append(karte(
      el("h2", { text: "Konten" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Kinder melden sich ohne PIN an. Die Aufsicht braucht ihre PIN, sieht alle Spiele und Statistiken und spielt als Tester (Runden zählen nicht in der Statistik, im Spiel gibt es Testhilfen). Eine neue Aufsicht: als Kind anlegen, „→ Aufsicht“ und PIN setzen." }),
      el("div", { class: "tabelle-rahmen" }, el("table", {},
        el("thead", {}, el("tr", {}, ...["Name", "Rolle", ""].map(t => el("th", { text: t })))),
        el("tbody", {}, ...kontoZeilen))),
      el("h3", { text: "Neues Kind" }),
      el("div", { class: "pin-zeile", style: "justify-content:flex-start" }, neuName, neuKlasse, knopf("＋ Anlegen", anlegen, "gruen")),
      meldung));
  }

  // ----- Abgleich zwischen Geräten (Entscheid S1 a) -----
  function abgleich() {
    const ab = LS.abgleich;
    const abMeldung = el("div", { class: "meldung", style: "text-align:left", "aria-live": "polite" });
    const melde = r => {
      abMeldung.textContent = r.status === "ok" ? `✓ Abgeglichen. ${ab.ergebnisText(r.neu)}`
        : r.status === "keine-erlaubnis" ? "Der Browser hat den Zugriff auf den Ordner nicht erlaubt."
        : r.status === "kein-ordner" ? "Noch kein Ordner gewählt."
        : `Das ging nicht: ${r.fehler}`;
    };
    const geraetName = el("input", { class: "feld", type: "text", maxlength: "30", placeholder: "z. B. Laptop Wohnzimmer", "aria-label": "Name dieses Geräts", value: ab.geraet().name });
    const abDatei = el("input", { type: "file", accept: "application/json", style: "display:none" });
    abDatei.addEventListener("change", async () => {
      const f = abDatei.files[0];
      if (!f) return;
      try { abMeldung.textContent = `✓ Eingelesen. ${ab.ergebnisText(await ab.dateiEinlesen(f))}`; }
      catch { abMeldung.textContent = "Diese Datei kann ich nicht lesen."; }
      finally { abDatei.value = ""; }
    });
    const st = ab.stand();
    const zeit = iso => new Date(iso).toLocaleString("de-CH", { dateStyle: "short", timeStyle: "short" });
    const ordnerTeil = ab.kannOrdner
      ? [st?.ordner
          ? el("p", { style: "margin:0 0 6px" }, "Ordner ", el("b", { text: st.ordner }),
            `, zuletzt abgeglichen ${zeit(st.zuletzt)}. Andere Geräte: ${st.geraete.length
              ? st.geraete.map(g => (g.fehler ? `${g.datei} (unlesbar)` : `${g.name || g.id} (Stand ${zeit(g.gesichert)})`)).join(", ")
              : "noch keine"}.`)
          : el("p", { style: "margin:0 0 6px", text: "Noch kein Ordner gewählt." }),
        zeile(
          knopf(st?.ordner ? "📁 Anderer Ordner" : "📁 Ordner wählen", async () => {
            try { melde(await ab.waehlen()); } catch { abMeldung.textContent = "Kein Ordner gewählt."; return; }
            neu();
          }, st?.ordner ? "hell" : "gruen"),
          st?.ordner ? knopf("🔄 Jetzt abgleichen", async () => { melde(await ab.jetzt(true)); neu(); }) : null,
          st?.ordner ? knopf("Ordner vergessen", async () => { await ab.vergessen(); neu(); }) : null)]
      : [el("p", { class: "leise-text", style: "margin:0 0 6px", text: "Dieser Browser kann keinen Ordner verwenden — das geht heute in Chrome und Edge auf dem Computer. Abgleichen geht hier über eine Datei: unten sichern, auf dem anderen Gerät einlesen, und umgekehrt." })];
    seite.append(karte(
      el("h2", { text: "Abgleich zwischen Geräten" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Haben die Kinder und die Aufsicht eigene Geräte, wählt man auf jedem denselben Ordner — einen Netzwerkordner oder den Ordner eines Cloud-Dienstes. Jedes Gerät schreibt dort seine eigene Datei und liest die der anderen: Runden, Endlos-Rekorde, Kinder, Einstellungen und Freigaben. So sind Ranglisten und Statistik überall vollständig. Die PIN bleibt auf dem Gerät." }),
      el("div", { class: "pin-zeile", style: "justify-content:flex-start" }, geraetName,
        knopf("Gerät benennen", () => { ab.benenne(geraetName.value); abMeldung.textContent = "✓ Name gespeichert."; })),
      ...ordnerTeil,
      zeile(knopf("💾 Abgleich-Datei sichern", () => ab.dateiSichern()), knopf("📂 Abgleich-Datei einlesen", () => abDatei.click())),
      abDatei, abMeldung));
  }

  // ----- Einstellungen für alle auf diesem Gerät (LERN_Session7; später je Klasse durch die Lehrperson) -----
  function einstellungen() {
    /** Ein Knopf je Wahl; gewählt ist, was 'aktuell' gleicht (null = „wie global“). */
    const wahlKnoepfe = (wahlen, aktuell, setze) => el("div", { class: "zeile-knoepfe" }, ...wahlen.map(([wert, text]) =>
      el("button", { type: "button", class: "schalter" + (wert === aktuell ? " frei" : ""), "aria-pressed": String(wert === aktuell),
        text: (wert === aktuell ? "✓ " : "") + text, onclick: () => { setze(wert); neu(); } })));
    const zeilen = Object.entries(LS.EINSTELLUNGEN).map(([name, e]) => {
      const global = LS.einstellung(name, null);
      // Spiele, die die Einstellung nutzen (Katalog, Feld einstellungen): je Spiel „wie global“ oder ein eigener Wert
      const spiele = SPIELE.filter(s => s.einstellungen?.includes(name));
      return el("div", { class: "einstellung" },
        el("h3", { text: e.titel }),
        el("p", { class: "leise-text", style: "margin:0 0 6px", text: e.erklaerung }),
        wahlKnoepfe(Object.entries(e.werte).map(([w, t]) => [w, t + (w === e.standard ? " (Standard)" : "")]), global, w => LS.setzeEinstellung(name, w)),
        spiele.length ? el("details", { class: "einstellung-spiele" },
          el("summary", { text: `Je Spiel (${spiele.length})` }),
          ...spiele.map(s => el("div", { class: "einstellung-spiel" },
            el("span", { text: `${s.bild} ${s.name}` }),
            wahlKnoepfe([[null, `wie global (${e.werte[global].split(":")[0]})`], ...Object.entries(e.werte).map(([w, t]) => [w, t.split(":")[0]])],
              LS.einstellungSpiel(name, s.id), w => LS.setzeEinstellung(name, w, s.id))))) : null);
    });
    seite.append(karte(
      el("h2", { text: "Einstellungen" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Gelten für alle Kinder auf diesem Gerät, je Spiel auch abweichend. „Alles auf Standard“ setzt auch die Spiele zurück." }),
      ...zeilen,
      zeile(knopf("↺ Alles auf Standard", () => { LS.einstellungenZuruecksetzen(); neu(); }))));
  }

  // ----- Entwicklung (Entscheide E1 a, E2 a) -----
  function entwicklung() {
    const en = LS.entwicklung;
    const meldung = el("div", { class: "meldung", style: "text-align:left", "aria-live": "polite" });
    const status = el("p", { style: "margin:0 0 8px", text: "Entwickler-Server: wird gesucht …" });
    en.server().then(s => {
      status.textContent = s ? `Entwickler-Server: verbunden${s.schluessel ? "" : " — aber entwickler.key fehlt (python tools/entwickler_server.py --neuer-schluessel)"}.`
        : `${en.serverMeldung().replace(/\n+/g, " ")} Freischalten geht trotzdem; prüfen und Bemerkungen speichern erst mit laufendem Entwickler-Server.`;
    });
    const teile = [];
    if (!en.freigeschaltet()) {
      const feld = el("input", { class: "feld", type: "password", autocomplete: "off", placeholder: "Entwickler-Schlüssel", "aria-label": "Entwickler-Schlüssel" });
      const los = async () => {
        if (await en.freischalten(feld.value)) return neu();
        meldung.textContent = "Dieser Schlüssel passt nicht.";
        feld.value = "";
      };
      feld.addEventListener("keydown", e => { if (e.key === "Enter") los(); });
      teile.push(el("div", { class: "pin-zeile", style: "justify-content:flex-start" }, feld, knopf("Freischalten", los, "gruen")));
    } else {
      const an = en.zustand().an;
      const name = el("input", { class: "feld", type: "text", maxlength: "40", placeholder: "Name für „geprüft von“", "aria-label": "Name für geprüft von", value: en.zustand().name });
      teile.push(
        zeile(knopf(an ? "🛠 Entwickler-Zusätze an" : "Entwickler-Zusätze aus", () => { en.setzeAn(!an); neu(); }, an ? "gruen" : "hell"),
          knopf("Schlüssel auf diesem Gerät vergessen", () => { en.sperren(); neu(); })),
        el("div", { class: "pin-zeile", style: "justify-content:flex-start" }, name,
          knopf("Name speichern", () => { en.benenne(name.value); meldung.textContent = "✓ Name gespeichert."; })));
      // Bemerkungen: offene zuerst; ich arbeite sie ab und setze sie in bemerkungen.json auf „erledigt“.
      const liste = el("div", { text: "Bemerkungen werden geladen …", class: "leise-text" });
      const neueBemerkung = el("div");
      teile.push(el("h3", { text: "Bemerkungen" }),
        zeile(knopf("📝 Allgemeine Bemerkung", () => {
          neueBemerkung.innerHTML = "";
          neueBemerkung.append(en.bemerkungsFeld(() => ({}), () => neu()));
        })), neueBemerkung, liste);
      en.bemerkungen().then(b => {
        liste.innerHTML = "";
        if (!b) return (liste.textContent = "Nur mit laufendem Entwickler-Server sichtbar.");
        if (!b.length) return (liste.textContent = "Noch keine Bemerkungen.");
        const sortiert = [...b].sort((x, y) => (x.status === y.status ? y.nr - x.nr : x.status === "offen" ? -1 : 1));
        liste.append(el("div", { class: "tabelle-rahmen" }, el("table", {},
          el("thead", {}, el("tr", {}, ...["Nr.", "Stand", "Wo", "Bemerkung"].map(t => el("th", { text: t })))),
          el("tbody", {}, ...sortiert.map(x => el("tr", {},
            el("td", { text: String(x.nr) }),
            el("td", { text: x.status === "offen" ? "offen" : `✓ ${x.status}` }),
            el("td", { text: [x.spiel, x.stufe, x.liste, x.eintrag].filter(Boolean).join(" · ") || "allgemein" }),
            el("td", { text: x.text + (x.aufgabe ? ` (${x.aufgabe})` : "") })))))));
      });
    }
    seite.append(karte(
      el("h2", { text: "Entwicklung" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Der Entwickler-Modus funktioniert nur im lokalen Repo mit laufendem Entwickler-Server: python tools/entwickler_server.py, dann http://localhost:8765/eulenpfad/ öffnen. Freigeschaltet wird er mit dem Schlüssel aus entwickler.key. Dann gibt es in den Spielen eine Leiste mit „Spiel angesehen“ und „Bemerkung“, und in der Freigabe „geprüft“ und „ansehen“ je Spiel und Inhaltsliste. Was hier geprüft wird, gilt nach Commit und Push für alle; eine lokale Sperre der Aufsicht gilt weiter." }),
      status, ...teile, meldung));
  }

  /** Inhaltsliste ansehen (Entscheid E3 a); danach die Seite neu zeichnen. */
  function zeigeListe(s, l) { LS.entwicklung.zeigeListe(s, l, neu); }
}
