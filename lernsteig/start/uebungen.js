/* Tab „Übungen“ des Lernsteigs (Plan C3, wie der Tab Spiele des Eulenpfads): Suche, einklappbarer Filter, Sortierung;
   ohne Suche und nach Fach und Thema sortiert Favoriten, dann je Fach und Thema auf- und zuklappbar; Kacheln oder
   kompakt. Jugendliche sehen gesperrte Übungen ohne Verweis (FG1 a), die Aufsicht öffnet sie zum Prüfen. Favoriten,
   Zuklappen, Ansicht, Sortierung und das Zuklappen des Filters stehen im Konto (Gast und Aufsicht: nur im Tab, rahmen.js
   TAB_FELDER); die Filterwahl merkt sich der Browser (lernsteig:filter, nur Bequemlichkeit, wie im Eulenpfad).
   Schritt 3: Passung aus Niveau, Kompetenzstand und Prüfungsziel (P1 a) für Suche, Ähnliche und „passt zu dir“;
   Wackel-Stufen (W1 a) als Marke und Filter; ähnliche Übungen über „?aehnlich=<id>“. */
"use strict";

var LST_START = typeof LST_START === "object" ? LST_START : {};

(function () {
  const LP = LST_LEHRPLAENE;
  const KAT = LST_KATALOG;
  const el = LST.el;
  /** Kinder anhängen ohne null, undefined und false. */
  const dazu = (knoten, ...kinder) => { knoten.append(...kinder.filter(k => k !== null && k !== undefined && k !== false)); return knoten; };

  // Favoriten-Stern wie im Eulenpfad (Umriss aus, gefüllt an), im sachlichen Aussehen in der Akzentfarbe
  const STERN = '<path d="M12 2.6l2.85 6 6.55.82-4.85 4.55 1.27 6.5L12 17.3l-5.82 3.17 1.27-6.5L2.6 9.42l6.55-.82z"/>';
  function stern(an) {
    const box = document.createElement("span");
    box.innerHTML = `<svg class="symbol stern${an ? " an" : ""}" viewBox="0 0 24 24" aria-hidden="true">${STERN}</svg>`;
    return box.firstChild;
  }

  /** Piktogramm einer Übung (Katalog-Feld `symbol`, gemeinsam/symbole.js, SY1 a); fehlt es, das Kürzel des Fachs. */
  const FACH_KURZ = { mathematik: "M", deutsch: "D", englisch: "E", franzoesisch: "F", nt: "NT" };
  const symbolVon = u => (LST_SYMBOLE.gibt(u.symbol)
    ? el("span", { class: "uebung-symbol", "aria-hidden": "true", html: LST_SYMBOLE.svg(u.symbol, 30) })
    : el("span", { class: "uebung-symbol kuerzel", "aria-hidden": "true", text: FACH_KURZ[u.fach] || "" }));

  // ---------- Suche (Kern kern/suche.js, wie im Eulenpfad SU1 a) ----------
  // Titel zählt am meisten (mit einem Tippfehler), dann der Kompetenz-Code („MA.1.A“ findet alle Übungen darunter),
  // dann das Fach; Thema und Inhaltslisten stehen nicht auf der Kachel, deshalb nennt die Kachel den Grund.
  const SUCH_GEWICHT = { titel: 6, kompetenz: 4, fach: 2, listen: 2, thema: 1 };
  const SUCH_SICHTBAR = ["titel", "kompetenz", "fach"];
  const suchFelder = u => ({
    titel: [u.titel], kompetenz: [u.kompetenz].concat(u.weitere || []), fach: [(KAT.fach(u.fach) || {}).name],
    listen: LST.FREIGABE.listen(u.id).map(l => l.name), thema: [u.thema],
  });
  // ---------- Passung (Entscheid P1 a, LERN_Session21) ----------
  // Mittel aus drei Teilen, je 0 bis 1:
  //   Ziel — Nähe der Lehrplan-Stufen zur Zielstufe des eigenen Niveaus im Fach (LST.zielstufe; gleich 1, eine daneben
  //          0.6, zwei 0.2; die nächste Stufe zählt; ohne Marken 0.5),
  //   Bedarf — der höchste Bedarf der Stufen aus dem Kompetenzstand (Kern-Regel, auf 5 gedeckelt; ohne Runden 0.4),
  //   Prüfung — 1 mit einer geprüften Stufe im Prüfungsziel, 0 ohne; neutral 0.5 ohne Prüfungsziel und in Fächern, für
  //          die keine geprüften Stufen hinterlegt sind (heute alles ausser Mathematik): keine Angabe ist kein Befund.
  // person: { konto, mitRunden } oder null (Aufsicht: neutral wie im Eulenpfad). Faktor wie im Eulenpfad: höchstens das
  // Anderthalbfache der Textrelevanz.
  const PASSUNG_FAKTOR = 0.5;
  const abstand = (a, b) => Math.abs(a.charCodeAt(0) - b.charCodeAt(0));
  function pruefungBekannt(fach, ziel, lehrplan) {
    return KAT.UEBUNGEN.some(x => x.fach === fach && x.stufen.some(s => LP.geprueft(`${x.kompetenz}.${s}`, ziel, lehrplan).geprueft));
  }
  function passungTeile(u, person) {
    const k = person.konto;
    const zs = LST.zielstufe(LP.MARKEN[u.kompetenz], LST.niveauFuer(u.fach, u.niveaus));
    const ziel = zs ? Math.max(...u.stufen.map(s => KERN.suche.naehe(0, abstand(s, zs)))) : 0.5;
    const bedarf = Math.min(1, Math.max(...u.stufen.map(s => (person.mitRunden ? LST.stufenBedarf(k.id, u.id, s) : KERN.auswertung.bedarf(null, 0)))) / 5);
    const bekannt = k.pruefungsziel !== "keins" && pruefungBekannt(u.fach, k.pruefungsziel, k.lehrplan);
    const pruefung = !bekannt ? 0.5 : u.stufen.some(s => LP.geprueft(`${u.kompetenz}.${s}`, k.pruefungsziel, k.lehrplan).geprueft) ? 1 : 0;
    return { ziel, bedarf, pruefung };
  }
  const passung = (u, person) => { if (!person) return null; const t = passungTeile(u, person); return (t.ziel + t.bedarf + t.pruefung) / 3; };

  /** Übungen zur Suche, beste zuerst: [{ id, wert, grund, passung }]; leere Suche null. */
  const sucheUebungen = (text, person = null) => KERN.suche.suche(text, KAT.UEBUNGEN, {
    felder: suchFelder, gewicht: SUCH_GEWICHT, sichtbar: SUCH_SICHTBAR, tippfehler: ["titel"], faktor: PASSUNG_FAKTOR,
    grund: (feld, t) => (feld === "thema" ? `im Thema ${t}` : `in der Liste „${t}“`),
    passung: u => passung(u, person),
  });

  /**
   * Ähnliche Übungen (wie „Ähnliche Spiele“ im Eulenpfad): gleiche Kompetenz 4, gleiches Thema 3, gleiches Fach 1, je
   * Abstand der Stufenlage 0.5 Abzug (höchstens 1); nur das Fach gemeinsam ist nicht ähnlich. Dazu die Passung.
   */
  const aehnlicheUebungen = (id, person = null) => KERN.suche.aehnlich(id, KAT.UEBUNGEN, {
    faktor: PASSUNG_FAKTOR, passung: x => passung(x, person),
    vergleich: (e, x) => {
      const kompetenz = x.kompetenz === e.kompetenz, thema = x.fach === e.fach && x.thema === e.thema;
      if (!kompetenz && !thema) return null;
      const wert = (kompetenz ? 4 : 0) + (thema ? 3 : 0) + 1 - Math.min(2, Math.abs(stufenLage(x) - stufenLage(e))) * 0.5;
      return { wert, grund: [kompetenz ? `gleiche Kompetenz ${x.kompetenz}` : null, thema ? "gleiches Thema" : null].filter(Boolean).join("; ") };
    },
  });
  /** Übungs-Id aus „?aehnlich=<id>“ (Knopf auf der Seite der Übung), oder null; Verlassen nimmt den Parameter weg. */
  const aehnlichId = () => new URLSearchParams(location.search).get("aehnlich");
  function aehnlichSchliessen() { if (aehnlichId()) history.replaceState(null, "", location.pathname + location.hash); }

  // ---------- Sortierung ----------
  // „Stufe“ (Entscheid SS1 a, LERN_Session21; persönlich ordnet erst „passt zu dir“ in Schritt 3): Lage der Übung zum Grundanspruch Zyklus 3 ihrer Kompetenz — Mittel der
  // Abstände ihrer Lehrplan-Stufen zum Grundanspruch in Buchstaben (ohne Grundanspruch der Orientierungspunkt, sonst
  // die mittlere Stufe des Zyklus). Lehrplan-Buchstaben verschiedener Kompetenzen sind sonst nicht vergleichbar.
  function stufenLage(u) {
    const m = LP.MARKEN[u.kompetenz];
    const bezug = m ? (m.ga || m.op || m.stufen[Math.floor(m.stufen.length / 2)]) : null;
    if (!bezug) return 0;
    return u.stufen.reduce((s, x) => s + x.charCodeAt(0) - bezug.charCodeAt(0), 0) / u.stufen.length;
  }
  const nachTitel = (a, b) => a.titel.localeCompare(b.titel, "de");
  const SORTIERUNG = {
    thema: { text: "nach Fach und Thema", pfeil: ["Katalog", "rückwärts"] },
    // nur mit Person (nicht für die Aufsicht); der Vergleich bekommt die Passung von aussen (zeichneUebungen)
    passung: { text: "passt zu dir", pfeil: ["beste zuerst", "beste zuletzt"], mitPerson: true },
    titel: { text: "nach Titel", pfeil: ["A → Z", "Z → A"], vergleich: nachTitel },
    stufe: { text: "nach Stufe", pfeil: ["Anschluss zuerst", "Erweiterung zuerst"], vergleich: (a, b) => stufenLage(a) - stufenLage(b) || nachTitel(a, b) },
  };

  // Suchtext: bleibt beim Neuzeichnen erhalten, nicht gespeichert (wie im Eulenpfad)
  let suchText = "";
  let sucheTippt = false; // nach dem Neuzeichnen das Suchfeld wieder fokussieren

  function zeichneUebungen(box) {
    const k = LST.konto();
    const aufsicht = LST.werUebt() === "aufsicht";
    const neu = () => LST_START.neu();
    const speichere = daten => { LST.speichereKonto(Object.assign(LST.konto(), daten)); neu(); };
    const favoriten = k.favoriten || [];
    const zu = new Set(k.zu || []);
    const kompakt = k.ansicht === "kompakt";
    const chip = (text, aktiv, onclick, attr = {}) => el("button", Object.assign({ type: "button", class: "chip klein" + (aktiv ? " an" : ""), "aria-pressed": String(aktiv), onclick, text }, attr));

    // „wird geprüft“, wenn eine Stufe im gewählten Prüfungsziel vorkommt (NV2 a)
    const geprueft = u => k.pruefungsziel !== "keins" && u.stufen.some(s => LP.geprueft(`${u.kompetenz}.${s}`, k.pruefungsziel, k.lehrplan).geprueft);
    // Gast und Aufsicht haben keine Runden im Konto; ihr Stand bleibt leer
    const mitStand = LST.werUebt() === "lernend";
    const mitSerie = u => u.endlos === true || (Array.isArray(u.endlos) && u.endlos.length > 0);
    // Für die Aufsicht: noch anzusehen — die Übung selbst oder eine eigene Inhaltsliste (wie im Eulenpfad)
    const zuPruefen = u => LST.FREIGABE.zuPruefen(u.id) || LST.FREIGABE.listen(u.id).some(l => !l.von && !l.geprueft);
    // Passung für Jugendliche und Gast (P1 a); die Aufsicht sucht und sortiert neutral (wie im Eulenpfad)
    const person = aufsicht ? null : { konto: k, mitRunden: mitStand };
    // Wackel-Stufen (W1 a) je Übung, einmal je Zeichnen
    const wackelnd = new Map(KAT.UEBUNGEN.map(u => [u.id, mitStand ? u.stufen.filter(s => LST.wackelt(k.id, u.id, s)) : []]));

    // ----- Filter: Fach, Themen des Fachs, Nur (Mehrfachwahl) -----
    const gespeichert = LST.lies("filter", {});
    const liste = v => (Array.isArray(v) ? v : []);
    const filter = { fach: KAT.fach(gespeichert.fach) ? gespeichert.fach : "alle", thema: liste(gespeichert.thema), nur: liste(gespeichert.nur) };
    const setze = (f, v) => () => { filter[f] = v; if (f === "fach") filter.thema = []; LST.schreibe("filter", filter); neu(); };
    const schalte = (f, id) => () => { const s = new Set(filter[f]); s.has(id) ? s.delete(id) : s.add(id); setze(f, [...s])(); };
    const NUR = [
      { id: "favoriten", text: "★ Favoriten", gilt: u => favoriten.includes(u.id), da: favoriten.length > 0 },
      { id: "pruefung", text: "Wird geprüft", gilt: geprueft, da: k.pruefungsziel !== "keins" },
      { id: "serie", text: "Mit Serie", gilt: mitSerie, da: true },
      { id: "wackelt", text: "Wackelt", gilt: u => wackelnd.get(u.id).length > 0, da: mitStand },
      { id: "zuPruefen", text: "🔍 Zu prüfen", gilt: zuPruefen, da: aufsicht },
    ].filter(n => n.da);
    const nurAktiv = NUR.filter(n => filter.nur.includes(n.id));
    const faecherMit = KAT.FAECHER.filter(f => KAT.UEBUNGEN.some(u => u.fach === f.id));
    const faecherMitNiveau = () => faecherMit.map(f => LST.niveauFuer(f.id));
    // Niveau für alle Fächer auf einmal (Wunsch Patrik, LERN_Session21): setzt das Niveau jedes Fachs (NV1 a bleibt, je
    // Fach änderbar in seiner Gruppe); angewählt nur, wenn alle Fächer dasselbe haben. Kein Filter, aber hier erreichbar,
    // auch in der Suche und den Listen ohne Gruppen.
    const niveaus = faecherMitNiveau();
    const gemeinsam = niveaus.every(n => n === niveaus[0]) ? niveaus[0] : null;
    const zeilen = [el("div", { class: "filter-zeile", role: "group", "aria-label": "Niveau für alle Fächer" }, el("span", { text: "Niveau" }),
      ...LST.NIVEAUS.map(n => chip(LST.niveauName(n.id), n.id === gemeinsam,
        () => { for (const f of KAT.FAECHER) LST.setzeNiveau(f.id, n.id); neu(); }, { "data-niveau-alle": n.id, title: `${n.kurz} — in allen Fächern` })),
      gemeinsam ? null : el("small", { class: "leise", text: "je Fach verschieden" })),
    el("div", { class: "filter-zeile" }, el("span", { text: "Fach" }),
      chip("Alle", filter.fach === "alle", setze("fach", "alle"), { "data-filter-fach": "alle" }),
      ...faecherMit.map(f => chip(f.name, filter.fach === f.id, setze("fach", f.id), { "data-filter-fach": f.id })))];
    if (filter.fach !== "alle") {
      const themen = [...new Set(KAT.UEBUNGEN.filter(u => u.fach === filter.fach).map(u => u.thema))];
      zeilen.push(el("div", { class: "filter-zeile" }, el("span", { text: "Thema" }),
        ...themen.map(t => chip(t, filter.thema.includes(t), schalte("thema", t), { "data-filter-thema": t }))));
    }
    zeilen.push(el("div", { class: "filter-zeile" }, el("span", { text: "Nur" }),
      ...NUR.map(n => chip(n.text, filter.nur.includes(n.id), schalte("nur", n.id), { "data-filter-nur": n.id }))));
    // Zugeklappt nennt die Kopfzeile, was gilt; gemerkt im Konto (filterZu), ohne Wahl auf dem Handy zu
    const aktiv = [
      gemeinsam ? LST.niveauName(gemeinsam) : "Niveau je Fach",
      filter.fach !== "alle" ? KAT.fach(filter.fach).name : null,
      filter.thema.length ? `${filter.thema.length} ${filter.thema.length === 1 ? "Thema" : "Themen"}` : null,
      ...nurAktiv.map(n => n.text),
    ].filter(Boolean);
    const schmal = typeof matchMedia === "function" && matchMedia("(max-width: 560px)").matches;
    const filterBox = el("details", { class: "filter-klapp" },
      el("summary", {}, el("span", { class: "filter-titel", text: "Filter" }),
        el("span", { class: "filter-aktiv", text: aktiv.length ? aktiv.join(" · ") : "alle Übungen" })),
      el("div", { class: "filter" }, ...zeilen));
    filterBox.open = typeof k.filterZu === "boolean" ? !k.filterZu : !schmal;
    filterBox.addEventListener("toggle", () => LST.speichereKonto(Object.assign(LST.konto(), { filterZu: !filterBox.open })));

    // ----- Auswahl: Filter und Suche -----
    // Suche mit Passung; ohne Suche, aber mit „?aehnlich=<id>“: die ähnlichen Übungen, ähnlichste zuerst
    const aehnlichZu = !suchText.trim() && aehnlichId() ? KAT.uebung(aehnlichId()) : null;
    const treffer = suchText.trim() ? new Map((sucheUebungen(suchText, person) || []).map((t, i) => [t.id, { ...t, i }]))
      : aehnlichZu ? new Map(aehnlicheUebungen(aehnlichZu.id, person).map((t, i) => [t.id, { ...t, i }])) : null;
    const passt = u => (filter.fach === "alle" || u.fach === filter.fach)
      && (!filter.thema.length || filter.thema.includes(u.thema))
      && nurAktiv.every(n => n.gilt(u))
      && (!treffer || treffer.has(u.id));
    const auswahl = KAT.UEBUNGEN.filter(passt);
    const sortierbar = Object.entries(SORTIERUNG).filter(([, s]) => !s.mitPerson || person);
    const sort = sortierbar.some(([w]) => w === (k.sortierung || {}).art) ? k.sortierung : { art: "thema", ab: false };
    const vergleich = sort.art === "passung"
      ? (() => { const p = new Map(auswahl.map(u => [u.id, passung(u, person)])); return (a, b) => p.get(b.id) - p.get(a.id) || nachTitel(a, b); })()
      : (SORTIERUNG[sort.art] || {}).vergleich;
    const flach = !treffer && sort.art !== "thema";
    if (treffer) auswahl.sort((a, b) => treffer.get(a.id).i - treffer.get(b.id).i);
    else if (flach) { auswahl.sort(vergleich); if (sort.ab) auswahl.reverse(); }

    // ----- Werkzeuge: Suche, Sortierung, Ansicht, alle auf/zu -----
    const feld = el("input", { class: "textfeld suche", type: "search", name: "suche", placeholder: "Übung suchen", "aria-label": "Übung suchen", value: suchText });
    feld.addEventListener("input", () => { suchText = feld.value; sucheTippt = true; aehnlichSchliessen(); neu(); });
    if (sucheTippt) { sucheTippt = false; requestAnimationFrame(() => { feld.focus(); feld.setSelectionRange(feld.value.length, feld.value.length); }); }
    const sortWahl = el("label", { class: "sortier-wahl" }, el("span", { class: "leise klein", text: "Sortieren" }),
      el("select", { class: "klein", name: "sortierung", "aria-label": "Übungen sortieren", onchange: e => speichere({ sortierung: { art: e.target.value, ab: false } }) },
        ...sortierbar.map(([w, s]) => el("option", { value: w, text: s.text, selected: w === sort.art }))),
      chip((sort.ab ? "↓ " : "↑ ") + SORTIERUNG[sort.art].pfeil[sort.ab ? 1 : 0], sort.ab,
        () => speichere({ sortierung: { art: sort.art, ab: !sort.ab } }), { "data-aktion": "sortierung-richtung" }));
    const gruppenIds = ["favoriten", ...KAT.FAECHER.map(f => "fach:" + f.id),
      ...KAT.FAECHER.flatMap(f => [...new Set(KAT.UEBUNGEN.filter(u => u.fach === f.id).map(u => u.thema))].map(t => `thema:${f.id}:${t}`))];
    const gegliedert = !treffer && !flach;
    box.replaceChildren(el("div", { class: "werkzeuge" }, feld, sortWahl),
      filterBox,
      el("div", { class: "werkzeuge" },
        chip("▦ Kacheln", !kompakt, () => speichere({ ansicht: "kacheln" }), { "data-ansicht": "kacheln" }),
        chip("☰ Kompakt", kompakt, () => speichere({ ansicht: "kompakt" }), { "data-ansicht": "kompakt" }),
        gegliedert ? chip("Alle auf", false, () => speichere({ zu: [] }), { "data-aktion": "alle-auf" }) : null,
        gegliedert ? chip("Alle zu", false, () => speichere({ zu: gruppenIds }), { "data-aktion": "alle-zu" }) : null));

    /** Auf- und zuklappbare Gruppe; der Zustand landet im Konto. */
    function gruppe(id, kopf, anzahl, ...inhalt) {
      const d = dazu(el("details", { class: "gruppe", "data-gruppe": id },
        el("summary", {}, ...[].concat(kopf), anzahl === null ? null : el("span", { class: "anzahl", text: `${anzahl}` }))), ...inhalt);
      d.open = !zu.has(id);
      d.addEventListener("toggle", () => {
        d.open ? zu.delete(id) : zu.add(id);
        LST.speichereKonto(Object.assign(LST.konto(), { zu: [...zu] }));
      });
      return d;
    }

    function kachel(u) {
      const f = KAT.fach(u.fach);
      const sichtbar = LST.uebungSichtbar(u.id);
      const favorit = favoriten.includes(u.id);
      const href = `uebungen/${u.id}/index.html?niveau=${LST.niveauFuer(u.fach, u.niveaus)}`;
      // Freie Stellen der Kachel öffnen die Übung (dort Stufen, Serie, Rechner); gesperrt für Jugendliche: kein Verweis
      const karte = el("div", { class: "uebung-karte" + (sichtbar ? "" : " gesperrt"), "data-uebung": u.id,
        title: sichtbar ? `${u.titel} öffnen` : "noch nicht freigegeben" });
      if (sichtbar) karte.addEventListener("click", e => { if (!e.target.closest("a, button")) location.href = href; });
      // Treffer über ein Feld, das nicht auf der Kachel steht: sagen, wo (wie im Eulenpfad)
      const grund = treffer && treffer.get(u.id) ? treffer.get(u.id).grund : null;
      const marken = [
        geprueft(u) ? el("span", { class: "marke pruefung", text: "wird geprüft" }) : null,
        LST.sperrGrund(u.id) ? el("span", { class: "marke gesperrt", text: sichtbar ? "für Jugendliche gesperrt" : "noch nicht freigegeben" }) : null,
        grund ? el("span", { class: "marke such-grund", text: aehnlichZu ? grund : `gefunden ${grund}` }) : null,
      ].filter(Boolean);
      // Kompetenzstand je Lehrplan-Stufe (BF1 a): Buchstabe mit Farbe des Stands, Zahlen im Titel
      const stufen = el("div", { class: "stufen-marken", "aria-label": "Stufen" }, ...u.stufen.map(s => {
        const ks = mitStand ? LST.kompetenzstand(k.id, u.id, s) : { stand: "offen", text: "offen", n: 0 };
        const wackel = wackelnd.get(u.id).includes(s);
        const titel = `Stufe ${s}: ${ks.text}${wackel ? ", wackelt" : ""}` + (ks.n ? ` (${ks.anhieb} von ${ks.fenster} zuletzt auf Anhieb, ${ks.n} Aufgaben)` : "");
        return el("span", { class: `stufe-marke stand-${ks.stand}${wackel ? " wackelt" : ""}`, title: titel, "aria-label": titel, "data-wackelt": wackel ? s : null, text: s });
      }));
      const name = sichtbar ? el("a", { class: "uebung-link name", href, lang: u.sprache || null }, u.titel)
        : el("span", { class: "uebung-link uebung-gesperrt name", lang: u.sprache || null }, u.titel);
      return dazu(karte,
        el("button", { type: "button", class: "karten-schalter" + (favorit ? " an" : ""), "aria-pressed": String(favorit),
          "aria-label": favorit ? `${u.titel} aus den Favoriten nehmen` : `${u.titel} zu den Favoriten`, title: favorit ? "Aus den Favoriten nehmen" : "Zu den Favoriten",
          "data-favorit": u.id, onclick: () => speichere({ favoriten: favorit ? favoriten.filter(x => x !== u.id) : favoriten.concat(u.id) }) }, stern(favorit)),
        el("div", { class: "kopfzeile" }, symbolVon(u), name),
        el("small", { class: "kompetenz", text: `${u.kompetenz} · ${f ? f.name : ""}` }),
        marken.length ? el("div", { class: "marken" }, ...marken) : null,
        stufen);
    }
    const gitter = l => el("div", { class: "uebung-gitter" + (kompakt ? " kompakt" : "") }, ...l.map(kachel));
    const titel = text => el("h2", { class: "treffer-titel", text });

    // ----- Suche: eine Liste, beste zuerst; andere Sortierung: eine Liste; sonst Favoriten, dann Fach → Thema -----
    if (aehnlichZu) {
      box.append(el("h2", { class: "treffer-titel" }, el("span", { text: `Ähnlich wie ${aehnlichZu.titel}: ${auswahl.length} ${auswahl.length === 1 ? "Übung" : "Übungen"} ` }),
        chip("✕ Alle Übungen", false, () => { aehnlichSchliessen(); neu(); }, { "data-aktion": "aehnlich-schliessen" })));
      if (auswahl.length) box.append(gitter(auswahl));
    } else if (treffer) {
      if (auswahl.length) box.append(titel(`${auswahl.length} Treffer, beste zuerst`), gitter(auswahl));
    } else if (flach) {
      if (auswahl.length) box.append(titel(`${auswahl.length} ${auswahl.length === 1 ? "Übung" : "Übungen"} · ${SORTIERUNG[sort.art].text}`), gitter(auswahl));
    } else {
      const favUebungen = auswahl.filter(u => favoriten.includes(u.id));
      if (favUebungen.length) box.append(gruppe("favoriten", "★ Favoriten", favUebungen.length, gitter(favUebungen)));
      for (const f of sort.ab ? [...KAT.FAECHER].reverse() : KAT.FAECHER) {
        const uebungen = auswahl.filter(u => u.fach === f.id);
        if (!KAT.UEBUNGEN.some(u => u.fach === f.id)) {
          if (filter.fach === "alle" && !nurAktiv.length) box.append(el("section", { class: "fach spaeter", "aria-label": f.name }, el("h3", { text: f.name }), el("small", { class: "leise", text: "später" })));
          continue;
        }
        if (!uebungen.length) continue;
        const niveau = LST.niveauFuer(f.id);
        // Niveau je Fach (NV1 a) im Kopf der Gruppe: gilt für alle Übungen des Fachs
        const niveauWahl = el("div", { class: "niveau-wahl", role: "group", "aria-label": `Niveau ${f.name}` },
          el("span", { class: "leise klein", text: "Niveau" }),
          ...LST.NIVEAUS.map(n => el("button", {
            type: "button", class: "chip klein" + (n.id === niveau ? " an" : ""), "aria-pressed": String(n.id === niveau),
            text: LST.niveauName(n.id), title: n.kurz, "data-niveau-fach": `${f.id}:${n.id}`, onclick: () => { LST.setzeNiveau(f.id, n.id); neu(); },
          })));
        const themen = [...new Set(uebungen.map(u => u.thema))];
        if (sort.ab) themen.reverse();
        box.append(gruppe("fach:" + f.id, [el("span", { text: f.name }), el("span", { class: "bereich", text: f.bereich })], uebungen.length,
          niveauWahl,
          ...themen.map(t => { const l = uebungen.filter(u => u.thema === t); return gruppe(`thema:${f.id}:${t}`, el("span", { text: t }), l.length, gitter(l)); })));
      }
    }
    if (!auswahl.length) box.append(el("p", { class: "leer-hinweis", "data-leer": "", text: aehnlichZu ? "Keine ähnliche Übung in dieser Auswahl." : treffer ? "Keine Übung passt zu dieser Suche." : "Keine Übung passt zu diesem Filter." }));
  }

  LST_START.uebungen = zeichneUebungen;
  LST_START.sucheUebungen = sucheUebungen;
  LST_START.aehnlicheUebungen = aehnlicheUebungen;
  LST_START.passung = passung;
  LST_START.passungTeile = passungTeile;
  LST_START.stufenLage = stufenLage;
})();
