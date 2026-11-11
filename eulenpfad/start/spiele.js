/* Tab „Spiele“: Favoriten, dann je Fach und Thema auf- und zuklappbar; Kacheln oder kompakt.
   Kinder sehen nur freigegebene Spiele (Entscheid L4 a); die Aufsicht sieht alle mit Prüfstand. */
"use strict";

// Bausteine der Übersicht aus dem Kern (KT1 a, kern/uebersicht.js): Gruppen, Filter-Block, Suche, Ähnliche,
// Sortierwahl, Favoriten — gleich wie im Tab Übungen des Lernsteigs; Speichern und Aussehen hier.
const UE = KERN.uebersicht;

// Symbole der Karten-Schalter: aus = grauer Umriss, an = gold mit Verlauf wie der Favoriten-Stern.
// Der Verlauf steht einmal im Dokument (#gold-verlauf). Die Form des Sterns kommt aus dem Kern.
const SCHALTER_SYMBOL = {
  stern: UE.STERN,
  endlos: '<path class="linie" d="M7.6 8.2C5.3 8.2 3.5 9.9 3.5 12s1.8 3.8 4.1 3.8c3.6 0 5.2-7.6 8.8-7.6 2.3 0 4.1 1.7 4.1 3.8s-1.8 3.8-4.1 3.8c-3.6 0-5.2-7.6-8.8-7.6z"/>',
  uhr: '<rect x="10.2" y="1.8" width="3.6" height="2.6" rx="1"/><circle cx="12" cy="13.6" r="7.6"/><path class="zeiger" d="M12 13.6V9.2M12 13.6l3 2"/>',
  // Reihenfolge der Teile (RF1 a, Satz B): drei absteigende Balken (grösste Stelle links), gemischt ein Mischpfeil
  balken: '<rect x="3.4" y="4.5" width="4.4" height="15.5" rx="1"/><rect x="9.8" y="8.8" width="4.4" height="11.2" rx="1"/><rect x="16.2" y="13.2" width="4.4" height="6.8" rx="1"/>',
  mischen: '<path d="M3 7h3.5c4.5 0 6.5 10 11 10H20M3 17h3.5c4.5 0 6.5-10 11-10H20M17.5 4.5 20.5 7l-3 2.5M17.5 14.5l3 2.5-3 2.5"/>',
};
// Reihenfolge auf der Karte: Antippen schaltet weiter (nach Stufe → geordnet → gemischt → nach Stufe).
const REIHENFOLGE_KARTE = {
  stufe: { symbol: "balken", an: false, naechste: "geordnet", text: "Teile nach Stufe (1–3 geordnet, ab 4 gemischt)" },
  geordnet: { symbol: "balken", an: true, naechste: "gemischt", text: "Teile geordnet: grösste Stelle links" },
  gemischt: { symbol: "mischen", an: true, naechste: "stufe", text: "Teile gemischt" },
};
function schalterSymbol(art, an) {
  if (!document.getElementById("gold-verlauf")) {
    const defs = document.createElement("div");
    defs.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="gold-verlauf" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#ffe27a"/><stop offset=".55" stop-color="#ffc107"/><stop offset="1" stop-color="#f29a00"/></linearGradient></defs></svg>';
    document.body.append(defs.firstChild);
  }
  const box = document.createElement("span");
  box.innerHTML = `<svg class="symbol ${art}${an ? " an" : ""}" viewBox="0 0 24 24" aria-hidden="true">${SCHALTER_SYMBOL[art]}</svg>`;
  return box.firstChild;
}

// Suche im Tab Spiele (Wunsch Patrik, LERN_Session6): bleibt beim Neuzeichnen erhalten, nicht gespeichert.
const SPIEL_SUCHE = UE.suche();

// ----- Kartenbild (Entscheid GS1 a, LERN_Session32; docs/eulenpfad/konzept_gestaltung.md) -----
// Das ruhige Endbild der Abschluss-Animation (Stufe 3, 3 Sterne) aus der Angabe feier im Katalog — dieselbe Quelle wie
// im Spiel. Gezeichnet erst, wenn die Karte ins Bild kommt; Daten eines Spiels (feier.daten, Schweiz-Karte) lädt es
// einmal nach. Ohne feier.js oder ohne Bild bleibt die Fläche leer und klappt zu.
const KARTENBILD_STUFEN = ["s3", "s2", "s4", "s1", "s5", "s6"];
const KARTEN_DATEN_GELADEN = {};
/** Dateien eines Spiels (feier.daten) einmal laden; → Promise. */
function ladeKartenDaten(s) {
  const ordner = s.pfad.replace(/[^/]*$/, "");
  return Promise.all((s.feier?.daten || []).map(datei => (KARTEN_DATEN_GELADEN[ordner + datei] ||= new Promise((fertig, fehler) => {
    const sk = document.createElement("script");
    sk.async = false; // in der Reihenfolge von feier.daten: orte.js braucht KARTE aus karte.js
    sk.src = ordner + datei;
    sk.onload = fertig;
    sk.onerror = () => fehler(new Error(`${ordner + datei} lädt nicht`));
    document.head.appendChild(sk);
  }))));
}
/** Das Bild in die Fläche zeichnen (erste Stufe mit Bild aus KARTENBILD_STUFEN). */
function zeichneKartenBild(flaeche, s) {
  const zeichne = () => {
    for (const stufe of KARTENBILD_STUFEN) {
      const bild = LS_FEIER.zeige(s.feier, { stufe, sterne: 3, ruhig: true });
      if (bild) { flaeche.replaceChildren(bild); flaeche.dataset.stufe = stufe; return; }
    }
    ohneBild(flaeche);
  };
  // ohne Daten des Spiels sofort, sonst nach dem Nachladen
  if (!s.feier.daten?.length) return zeichne();
  ladeKartenDaten(s).then(zeichne).catch(e => { console.error(e.message); ohneBild(flaeche); });
}
/** Kein Bild: Fläche weg, das Emoji im Kopf kommt zurück. */
function ohneBild(flaeche) {
  flaeche.closest(".spielkarte")?.classList.remove("mit-bild");
  flaeche.remove();
}
const KARTENBILD_BEOBACHTER = typeof IntersectionObserver === "function" ? new IntersectionObserver(eintraege => {
  for (const e of eintraege) if (e.isIntersecting) { KARTENBILD_BEOBACHTER.unobserve(e.target); zeichneKartenBild(e.target, e.target.spiel); }
}, { rootMargin: "300px 0px" }) : null;
/** Fläche für das Kartenbild einer Spielkarte; null, wenn das Spiel keine Animation hat. */
function kartenBild(s) {
  if (!s.feier || typeof LS_FEIER === "undefined") return null;
  const flaeche = LS.el("div", { class: "karten-bild", "aria-hidden": "true" });
  flaeche.spiel = s;
  if (KARTENBILD_BEOBACHTER) KARTENBILD_BEOBACHTER.observe(flaeche); else zeichneKartenBild(flaeche, s);
  return flaeche;
}
/** Suchfeld im Aussehen des Eulenpfads (auch die Freigabe in der Verwaltung). */
const suchAttr = platzhalter => ({ class: "feld suche", placeholder: platzhalter, "aria-label": platzhalter });
// Spiel-Id aus „?aehnlich=<id>“ (Knopf „🔗 Ähnliche Spiele“ im Spiel): UE.aehnlich.id(); verlassen UE.aehnlich.schliessen()

function zeichneSpiele(box, neu) {
  const { el } = LS;
  const name = LS.aktuellerSpieler();
  const p = LS.profil(name);
  const aufsicht = LS.aufsichtAngemeldet();
  const fokus = p.fokus;
  // Filter merkt sich der Browser (nur Bequemlichkeit); Ansicht, Favoriten und Zuklappen das Profil.
  // Thema und Stufe sind Mehrfachwahl (Wunsch Patrik, LERN_Session10): Listen von Ids, leer = keine Einschränkung.
  // Ältere Speicherungen hielten einen Wert oder "alle".
  const gespeichert = LS.lies("filter", {});
  const liste = v => (Array.isArray(v) ? v : !v || v === "alle" ? [] : [v]);
  const filter = { fach: "alle", fokus: false, ...gespeichert, thema: liste(gespeichert.thema), stufe: liste(gespeichert.stufe), klasse: liste(gespeichert.klasse) };
  const setze = (k, v) => () => { filter[k] = v; if (k === "fach") filter.thema = []; LS.schreibe("filter", filter); neu(); };
  /** Einen Chip der Mehrfachwahl an- oder abwählen. */
  const schalte = (k, id) => () => { const s = new Set(filter[k]); if (s.has(id)) s.delete(id); else s.add(id); setze(k, [...s])(); };
  const speichere = daten => { LS.speichereProfil(name, daten); neu(); };
  const spielSuche = SPIEL_SUCHE.text;
  const chip = (text, aktiv, onclick, tipp, klasse = "") =>
    el("button", { type: "button", class: "chip " + klasse, "aria-pressed": String(aktiv), onclick }, text, tipp ? el("span", { class: "tipp", text: tipp }) : null);
  /** „Alle“ der Mehrfachwahl: wählt alle an; sind schon alle an, wählt es alle ab. */
  const alleChip = (k, ids, klasse) => {
    const alle = ids.length > 0 && ids.every(id => filter[k].includes(id));
    return chip("Alle", alle, setze(k, alle ? [] : ids), null, klasse);
  };

  // ----- Filter: Fach, dann die Themen dieses Fachs; Stufe -----
  const empfohlen = LS.empfohleneStufe(name);
  const faecher = el("div", { class: "filter-zeile" }, el("span", { text: "Fach" }),
    chip("Alle", filter.fach === "alle", setze("fach", "alle")),
    ...FAECHER.map(f => chip(f, filter.fach === f, setze("fach", f))));
  // Eigene Zeile „Nur“ für Fokus, Meine Klasse und Zu prüfen — das sind keine Fächer (Hinweis Patrik, LERN_Session10).
  const nur = el("div", { class: "filter-zeile" }, el("span", { text: "Nur" }));
  if (fokus.length) nur.append(chip("⭐ Mein Fokus", filter.fokus, setze("fokus", !filter.fokus)));
  // Meine Klasse (Entscheide K1 a, K2 a, LERN_Session6): nur Spiele mit einer Stufe genau für die Klasse
  // des Kindes, also Basisklasse ±1. Für Kinder mit Klasse im Profil, vorgegeben an; das Kind darf ihn
  // ausschalten (Profil-Feld meineKlasse, je Kind statt je Browser).
  const klasse = LS.klasseVon(p); // 0 = Kindergarten
  // Persönliche Passung für Suche und Ähnliche Spiele (Wunsch Patrik, LERN_Session10): Klasse und Bedarf aus dem
  // Protokoll (AUSWERTUNG.bedarf in der empfohlenen Stufe); die Aufsicht sucht neutral.
  const protokoll = LS.protokoll().filter(e => e.name === name);
  const person = aufsicht ? null : { klasse, bedarf: id => AUSWERTUNG.bedarf(id, LS.empfohleneStufe(name, id) || "s3", protokoll, fokus) };
  // Neue Abzeichen (LERN_Session10): ein Hinweis ganz oben, bis das Kind den Tab Erfolge öffnet.
  if (!aufsicht) {
    const neue = abzeichenVon(name).filter(a => a.neu);
    if (neue.length) box.append(el("a", { class: "abzeichen-hinweis", href: "#erfolge" },
      el("span", { class: "abzeichen-hinweis-bild" }, abzeichenBild(neue[0], 40)),
      el("span", {}, el("b", { text: (neue.length === 1 ? `Neues Abzeichen: ${ERFOLGE.titelMitRang(neue[0])}` : `${neue.length} neue Abzeichen: ${neue.map(ERFOLGE.titelMitRang).join(", ")}`) + (ERFOLGE.titelMitRang(neue[neue.length - 1]).endsWith("!") ? "" : "!") }),
        el("span", { class: "leise-text", text: " Antippen zum Ansehen." }))));
    // Neu freigeschaltet (Wunsch Patrik, LERN_Session12): Bilder ab Gold eines Abzeichens, Rahmen ab dem ersten Gold,
    // Platin, Diamant — bis das Kind das Profil öffnet.
    const frei = neueFreischaltungen(name);
    if (frei.length) {
      const bilder = frei.filter(x => x.art === "motiv"), rahmen = frei.filter(x => x.art === "rahmen");
      const teile = [bilder.length ? `${bilder.length === 1 ? "neues Bild" : `${bilder.length} neue Bilder`}: ${bilder.map(x => x.titel).join(", ")}` : null,
        rahmen.length ? `${rahmen.length === 1 ? "neuer Rahmen" : `${rahmen.length} neue Rahmen`}: ${rahmen.map(x => x.titel).join(", ")}` : null].filter(Boolean);
      const vorschau = bilder.length ? AVATARE.svg(AVATARE.kennung(bilder[0].id, "gelb", rahmen.at(-1)?.id), 40)
        : AVATARE.svg(AVATARE.kennung(AVATARE.zerlege(p.avatar)?.motiv.id || "eule", AVATARE.zerlege(p.avatar)?.farbe.id || "gelb", rahmen.at(-1).id), 40);
      const bild = el("span", { class: "abzeichen-hinweis-bild" });
      bild.innerHTML = vorschau;
      box.append(el("a", { class: "abzeichen-hinweis", href: "#profil" }, bild,
        el("span", {}, el("b", { text: `Freigeschaltet — ${teile.join(" · ")}!` }), el("span", { class: "leise-text", text: " Im Profil wählbar." }))));
    }
  }
  // Wochenziel des Lernplans (Entscheid L1 a, LERN_Session10): kompakt ganz oben, nur wenn die Aufsicht eines gesetzt hat.
  if (!aufsicht && p.lernplan?.tage > 0) {
    const w = wochenKarte(ERFOLGE.lernplan(p, protokoll.filter(e => !e.test)), true);
    w.addEventListener("click", () => { location.hash = "#erfolge"; });
    w.title = "Antippen: zu den Erfolgen";
    box.append(w);
  }
  const nurKlasse = !aufsicht && klasse !== null && p.meineKlasse !== false;
  if (!aufsicht && klasse !== null) nur.append(chip("🎒 Meine Klasse", nurKlasse, () => speichere({ meineKlasse: !nurKlasse }), LS.klasseText(klasse)));
  // Für die Aufsicht: nur, was noch zu prüfen ist — Spiel nicht angesehen oder eine eigene Inhaltsliste ungeprüft.
  const zuPruefen = s => LS.spielZuPruefen(s.id) || LS.spielListen(s.id).some(l => !l.von && !l.geprueft);
  const nurZuPruefen = aufsicht && filter.zuPruefen;
  if (aufsicht) nur.append(chip("🔍 Zu prüfen", nurZuPruefen, setze("zuPruefen", !filter.zuPruefen), `${SPIELE.filter(zuPruefen).length}`));
  // Klasse (Wunsch Patrik, LERN_Session10): Basisklasse des Spiels, Mehrfachwahl wie Thema und Stufe; für alle sichtbar,
  // gedacht vor allem für die Aufsicht. „🎒 Meine Klasse“ bleibt die Abkürzung des Kindes (Basisklasse ±1).
  const basisklassen = [...new Set(SPIELE.map(s => s.klasse))].sort((a, b) => a - b);
  const klassen = el("div", { class: "filter-zeile" }, el("span", { text: "Klasse" }),
    alleChip("klasse", basisklassen),
    ...basisklassen.map(k => chip(LS.klasseText(k), filter.klasse.includes(k), schalte("klasse", k))));
  const zeilen = [faecher, klassen];
  if (nur.childElementCount > 1) zeilen.push(nur);
  if (filter.fach !== "alle") {
    const themen = THEMEN.filter(t => t.fach === filter.fach);
    zeilen.push(el("div", { class: "filter-zeile" }, el("span", { text: "Thema" }),
      alleChip("thema", themen.map(t => t.id), "klein"),
      ...themen.map(t => chip(t.name, filter.thema.includes(t.id), schalte("thema", t.id), null, "klein"))));
  }
  zeilen.push(el("div", { class: "filter-zeile" }, el("span", { text: "Stufe" }),
    alleChip("stufe", LS.SKALA.map(s => s.id)),
    ...LS.SKALA.map(s => chip(`${s.icon} ${s.nr} ${s.name}`, filter.stufe.includes(s.id), schalte("stufe", s.id), s.id === empfohlen ? "👍" : ""))));
  // Einklappbar (Wunsch Patrik, LERN_Session14: auf dem Handy wird der Filter schnell unübersichtlich). Zugeklappt nennt
  // die Kopfzeile, was gerade gilt. Gemerkt je Person im Profil (filterZu); ohne Wahl auf dem Handy zu, sonst offen.
  const aktiv = [
    filter.fach !== "alle" ? filter.fach : null,
    filter.thema.length ? `${filter.thema.length} Thema${filter.thema.length === 1 ? "" : "en"}` : null,
    filter.klasse.length ? filter.klasse.map(LS.klasseText).join(", ") : null,
    filter.stufe.length ? `Stufe ${filter.stufe.map(id => LS.SKALA.find(s => s.id === id)?.nr).join(", ")}` : null,
    nurKlasse ? "🎒 Meine Klasse" : null, filter.fokus && fokus.length ? "⭐ Fokus" : null, nurZuPruefen ? "🔍 Zu prüfen" : null,
  ].filter(Boolean);
  box.append(UE.filterBlock({ titel: "🔎 Filter", aktiv, leer: "alle Spiele", zeilen, zu: p.filterZu,
    merke: filterZu => LS.speichereProfil(name, { filterZu }) }));

  // ----- Spiele auswählen -----
  // Ruhezeit (Zusatz Patrik zu AN3-K): Spiele mit Ton fehlen, wenn die Aufsicht sie dann ausblendet
  const passt = s => LS.spielSichtbar(s.id) && !LS.ruheAusgeblendet(s.id)
    && (filter.fach === "alle" || THEMEN.find(t => t.id === s.thema)?.fach === filter.fach)
    && (!filter.thema.length || filter.thema.includes(s.thema))
    && (!filter.stufe.length || s.stufen.some(st => filter.stufe.includes(st)))
    && (!filter.fokus || s.lernziele.some(l => fokus.includes(l.lz)))
    && (!nurKlasse || Math.abs(s.klasse - klasse) <= 1)
    && (!filter.klasse.length || filter.klasse.includes(s.klasse))
    && (!nurZuPruefen || zuPruefen(s))
    && (!treffer || treffer.has(s.id));
  // Suche (Entscheid SU1 a): Treffer nach Relevanz, sonst Fokus-Spiele zuerst und Katalog-Reihenfolge.
  // Ohne Suche, aber mit „?aehnlich=<id>“: die ähnlichen Spiele als Liste, ähnlichste zuerst (LERN_Session10).
  const aehnlichZu = !spielSuche.trim() && UE.aehnlich.id() ? SPIELE.find(s => s.id === UE.aehnlich.id()) : null;
  const treffer = spielSuche.trim() ? new Map((LS.suche(spielSuche, person) || []).map((t, i) => [t.id, { ...t, i }]))
    : aehnlichZu ? new Map(LS.aehnlich(aehnlichZu.id, person).map((t, i) => [t.id, { ...t, i }])) : null;
  const imFokus = s => s.lernziele.some(l => fokus.includes(l.lz));
  const auswahl = SPIELE.filter(passt).sort(treffer
    ? (a, b) => treffer.get(a.id).i - treffer.get(b.id).i
    : (a, b) => Number(imFokus(b)) - Number(imFokus(a)));

  // ----- Sortierung (Wunsch Patrik, Entscheide SO1 a, SO2 a, LERN_Session11) -----
  // Vorgabe „nach Fach und Thema“ wie bisher; sonst eine Liste ohne Gruppen. Wählen darf die Aufsicht immer, ein Kind
  // nach Einstellung und Klasse (LS.sortierungFuer). Eine Suche ordnet weiter nach Relevanz.
  const sort = LS.sortierungFuer(name);
  const nachName = (a, b) => a.name.localeCompare(b.name, "de");
  const SORTIERER = {
    passung: (a, b) => (LS.passung(b.id, person) ?? 0) - (LS.passung(a.id, person) ?? 0) || nachName(a, b),
    name: nachName,
    klasse: (a, b) => a.klasse - b.klasse || nachName(a, b),
  };
  const flach = !treffer && sort.art !== "thema";
  if (flach) {
    auswahl.sort(SORTIERER[sort.art]);
    if (sort.ab) auswahl.reverse();
  }
  const SORT_PFEIL = { thema: ["Katalog", "rückwärts"], passung: ["beste zuerst", "beste zuletzt"], name: ["A → Z", "Z → A"], klasse: ["tiefe zuerst", "hohe zuerst"] };
  const sortWahl = sort.waehlbar ? UE.sortWahl({
    arten: Object.entries(LS.EINSTELLUNGEN.sortierung.werte).map(([wert, text]) => ({ wert, text })), wahl: sort, pfeile: SORT_PFEIL,
    setze: sortierung => speichere({ sortierung }), knopf: (text, an, onclick) => chip(text, an, onclick, null, "klein"),
    beschriftung: el("span", { text: "Sortieren:" }), feld: { class: "feld klein", "aria-label": "Spiele sortieren" },
  }) : null;

  // ----- Werkzeuge: Ansicht und alle auf/zu (nur mit Gruppen: nicht bei Suche, Ähnlichen oder flacher Liste) -----
  const gruppenIds = ["favoriten", ...FAECHER.map(f => "fach:" + f), ...THEMEN.map(t => "thema:" + t.id)];
  const gegliedert = !treffer && !flach;
  box.append(el("div", { class: "werkzeuge" },
    SPIEL_SUCHE.feld({ neu, beiEingabe: UE.aehnlich.schliessen, attr: suchAttr("🔍 Spiel suchen") }),
    sortWahl,
    chip("▦ Kacheln", p.ansicht !== "kompakt", () => speichere({ ansicht: "kacheln" }), null, "klein"),
    chip("☰ Kompakt", p.ansicht === "kompakt", () => speichere({ ansicht: "kompakt" }), null, "klein"),
    gegliedert ? chip("Alle auf", false, () => speichere({ zu: [] }), null, "klein") : null,
    gegliedert ? chip("Alle zu", false, () => speichere({ zu: gruppenIds }), null, "klein") : null));

  // ----- Zufallsmix und Zufälliges Spiel: Karten wie die Spiele, ohne Thema (Wunsch Patrik, LERN_Session10) -----
  // Zufallsmix (Entscheid M1 a): Aufgaben aus mehreren Spielen, Einstellungen auf der Mix-Seite.
  // Zufälliges Spiel: die Eule zieht ein Spiel aus der gefilterten Auswahl; je Stufe ein Knopf.
  const gross = filter.stufe.length === 1;
  /** Karte ohne Thema; freie Stellen lösen `beiTipp` aus (wie bei den Spielkarten das Startbild). */
  function zufallsKarte({ bild, name: titel, ziel, farbe, knoepfe, beiTipp, titelText, schalter = null }) {
    const k = el("div", { class: "spielkarte zufall" + (schalter?.an ? " endlos-an" : ""), title: titelText, "data-vorlesen": `${titel}. ${ziel}` });
    k.style.setProperty("--f", farbe);
    k.addEventListener("click", e => { if (!e.target.closest("a, button")) beiTipp(); });
    if (schalter) k.append(el("div", { class: "karten-schalter-zeile" }, el("button", { type: "button", class: "karten-schalter" + (schalter.an ? " an" : ""),
      "aria-pressed": String(schalter.an), "aria-label": schalter.text, title: schalter.text, onclick: schalter.onclick }, schalterSymbol("endlos", schalter.an))));
    // ein Kind sieht nur den Titel (GS2 a); den Satz liest langes Drücken vor, die Aufsicht sieht ihn
    k.append(el("div", { class: "kopfzeile" }, el("div", { class: "spiel-bild", text: bild }), el("b", { class: "name", text: titel })),
      aufsicht ? el("div", { class: "ziel", text: ziel }) : "", el("div", { class: "stufenknoepfe" }, ...knoepfe));
    return k;
  }
  // Bedarf (Wunsch Patrik, LERN_Session10): der Zufall wählt, wo die Statistik Bedarf zeigt — AUSWERTUNG.bedarf,
  // dieselbe Gewichtung wie im Zufallsmix.
  const bedarf = (s, stufeId) => AUSWERTUNG.bedarf(s.id, stufeId, protokoll, fokus);
  const ziehe = AUSWERTUNG.ziehe;
  // ♾ auf der Karte (Wunsch Patrik, LERN_Session12): dann nur Spiele, die in dieser Stufe Endlos anbieten, endlos gestartet.
  const zufallEndlos = p.endlosAn.includes("zufall");
  // Zufall nimmt in der Ruhezeit keine Spiele, die Ton brauchen: niemand könnte dort den Ton für die Runde einschalten
  const zufallAuswahl = auswahl.filter(s => !LS.tonSpielRuht(s.id));
  const stufenZufall = st => zufallAuswahl.filter(s => s.stufen.includes(st.id) && (!zufallEndlos || (s.endlos || []).includes(st.id)));
  const zufallsSpiel = st => { const s = ziehe(stufenZufall(st), x => bedarf(x, st.id)); location.href = `${s.pfad}?stufe=${st.id}${zufallEndlos ? "&endlos=1" : ""}`; };
  const zufallsKnoepfe = LS.SKALA.filter(st => (!filter.stufe.length || filter.stufe.includes(st.id)) && stufenZufall(st).length).map(st => {
    const b = el("button", { type: "button", class: "stufenknopf" + (gross ? " gross" : "") + (st.id === empfohlen && !gross ? " empfohlen" : ""),
      "data-vorlesen": `Zufälliges Spiel, Stufe ${st.nr}, ${st.name}${zufallEndlos ? ", endlos" : ""}.`,
      title: `${zufallEndlos ? "♾ Endlos · " : ""}Stufe ${st.nr} · ${st.name}: ein zufälliges Spiel aus deiner Auswahl`,
      onclick: () => zufallsSpiel(st) }, el("span", { class: "stufen-text" }, zufallEndlos ? schalterSymbol("endlos", true) : st.icon, gross ? ` Stufe ${st.nr} spielen` : `${st.nr}`), el("span", { class: "s" }));
    b.style.setProperty("--sf", st.farbe);
    return b;
  });
  // Weiterspielen (Entscheid ZG1 a, LERN_Session12): die letzten fünf Spiele, Antippen startet die zuletzt gespielte
  // Stufe (nach einer Endlos-Runde wieder endlos). Runden im Zufallsmix zählen nicht — dort hat der Mix gewählt.
  if (!spielSuche.trim()) {
    const zuletzt = [
      // Serien stehen seit LERN_Session19 auch im Protokoll (RA3 a); ältere nur als Rekord
      ...protokoll.filter(e => !e.mix).map(e => ({ spiel: e.inhalt, stufe: e.stufe, zeit: e.zeit, endlos: !!e.endlos })),
      ...LS.rekorde().filter(e => e.name === name && !e.mix).map(e => ({ spiel: e.inhalt, stufe: e.stufe, zeit: e.zeit, endlos: true })),
    ].sort((a, b) => (a.zeit < b.zeit ? 1 : -1));
    const gesehen = new Set();
    const weiter = [];
    for (const r of zuletzt) {
      const s = SPIELE.find(x => x.id === r.spiel);
      if (!s || gesehen.has(s.id) || !(aufsicht ? LS.spielSichtbar(s.id) : LS.fuerKinderSichtbar(s.id))) continue;
      gesehen.add(s.id);
      weiter.push({ s, ...r });
      if (weiter.length === 5) break;
    }
    if (weiter.length) box.append(el("div", { class: "weiter-zeile" }, el("b", { class: "weiter-titel", text: "▶️ Weiterspielen" }),
      ...weiter.map(({ s, stufe, endlos }) => {
        const st = LS.SKALA.find(x => x.id === stufe) || LS.SKALA[0];
        const a = el("a", { class: "weiter-karte", href: `${s.pfad}?stufe=${st.id}${endlos ? "&endlos=1" : ""}`,
          "data-vorlesen": `${s.name}, Stufe ${st.nr}${endlos ? ", endlos" : ""}. Weiterspielen.`, title: `${s.name} · Stufe ${st.nr}${endlos ? " · ♾ Endlos" : ""}` },
          el("span", { class: "weiter-bild", text: s.bild }), el("span", { class: "weiter-name", text: s.name }),
          el("span", { class: "weiter-stufe" }, endlos ? schalterSymbol("endlos", true) : st.icon, ` ${st.nr}`));
        a.style.setProperty("--f", s.farbe);
        return a;
      })));
  }
  const zufallsKarten = [];
  if (SPIELE.some(s => LS.spielSichtbar(s.id))) zufallsKarten.push(zufallsKarte({ bild: "🎲", name: "Zufallsmix", farbe: "var(--deko-2)",
    ziel: "Aufgaben aus vielen Spielen gemischt — du stellst ein, wie schwer, wie lang und ob mit Timer.",
    titelText: "Antippen: zur Mix-Seite", beiTipp: () => { location.href = "mix.html"; },
    knoepfe: [el("a", { class: "stufenknopf gross", href: "mix.html", "data-vorlesen": "Zufallsmix einstellen und los." }, el("span", { class: "stufen-text", text: "🎲 Einstellen und los" }))] }));
  // Die Karte bleibt auch mit ♾ ohne passendes Spiel stehen, damit der Schalter erreichbar ist.
  if (zufallsKnoepfe.length || (zufallEndlos && zufallAuswahl.length)) zufallsKarten.push(zufallsKarte({ bild: "🎯", name: aufsicht ? "Zufälliges Spiel" : "Überrasch mich", farbe: "var(--deko-6)",
    ziel: zufallEndlos ? "Die Eule zieht ein Endlos-Spiel aus deiner Auswahl: so viele Aufgaben wie möglich ohne Fehler."
      : "Die Eule zieht ein Spiel aus deiner Auswahl — eher eines, das du noch üben solltest.",
    titelText: "Antippen: Startbild eines zufälligen Spiels",
    knoepfe: zufallsKnoepfe.length ? zufallsKnoepfe : [el("span", { class: "leise-text", text: "Kein Endlos-Spiel in dieser Auswahl." })],
    schalter: { an: zufallEndlos, text: zufallEndlos ? "Endlos aus" : "Endlos ein: ein zufälliges Spiel im Endlos-Modus",
      onclick: () => speichere({ endlosAn: zufallEndlos ? p.endlosAn.filter(x => x !== "zufall") : [...p.endlosAn, "zufall"] }) },
    beiTipp: () => {
      const st = LS.SKALA.find(x => x.id === (gross ? filter.stufe[0] : empfohlen)) || LS.SKALA[2];
      const s = ziehe(zufallEndlos ? stufenZufall(st) : zufallAuswahl, x => bedarf(x, st.id));
      if (s) location.href = s.pfad;
    } }));
  if (zufallsKarten.length) box.append(el("div", { class: "spiele" + (p.ansicht === "kompakt" ? " kompakt" : "") }, ...zufallsKarten));
  const ruhend = SPIELE.filter(s => LS.spielSichtbar(s.id) && LS.ruheAusgeblendet(s.id)).length;
  if (ruhend) box.append(el("p", { class: "leise-text", "data-hinweis": "ruhezeit",
    text: `🤫 Ruhezeit: ${ruhend} ${ruhend === 1 ? "Spiel mit Ton ist" : "Spiele mit Ton sind"} ausgeblendet, bis sie vorbei ist.` }));

  // Auf- und zuklappbare Gruppen; der Zustand landet im Profil. Gruppen gibt es nur ohne Suche (dann eine Liste).
  const G = UE.gruppen({ zu: p.zu, merke: zu => LS.speichereProfil(name, { zu }) });
  const gruppe = (id, titel, anzahl, ...inhalt) => G.gruppe({ id, kopf: titel, anzahl }, ...inhalt);

  const gitter = spiele => el("div", { class: "spiele" + (p.ansicht === "kompakt" ? " kompakt" : "") }, ...spiele.map(karte));

  // Klassen-Rand (Entscheid G1 a, LERN_Session14): Ohne „🎒 Meine Klasse“ zeigt ein farbiger Rand mit Zeichen, wie die
  // Basisklasse des Spiels zur Klasse des Kindes steht. Farben aus --deko-*, nicht aus den Stellenfarben; das Zeichen
  // trägt die Bedeutung auch ohne Farbsehen. Welche Stufe genau passt, zeigt weiter 👍 auf dem Stufenknopf.
  const KLASSEN_LAGE = {
    tiefer: { zeichen: "✓", text: k => `Leichter als deine Klasse (Spiel für die ${LS.klasseText(k)}) — schaffst du!` },
    gleich: { zeichen: "●", text: () => "Deine Klasse — da bist du gerade dran." },
    hoeher: { zeichen: "▲", text: k => `Herausforderung: Spiel für die ${LS.klasseText(k)}.` },
  };
  const klassenRand = !aufsicht && klasse !== null && !nurKlasse;
  const lageVon = s => (s.klasse < klasse ? "tiefer" : s.klasse === klasse ? "gleich" : "hoeher");
  if (klassenRand && auswahl.length) box.append(el("div", { class: "klassen-legende", "aria-label": "Rand der Spielkarten" },
    el("span", { text: "Rand:" }),
    ...Object.entries({ tiefer: "leichter", gleich: "meine Klasse", hoeher: "Herausforderung" }).map(([lage, wort]) =>
      el("span", { class: `klassen-legende-teil klasse-${lage}` }, el("span", { class: "klassen-marke", text: KLASSEN_LAGE[lage].zeichen }), ` ${wort}`))));

  // Text der Karte (Entscheid GS2 a, LERN_Session32): Ein Kind sieht Kartenbild, Name und Stufenknöpfe; die Beschreibung
  // zeigt ⓘ und liest langes Drücken vor. Lernziel-Kürzel und Sperrmarken sieht nur die Aufsicht; der Grund eines
  // Suchtreffers bleibt, damit klar ist, warum das Spiel dasteht.
  const kompakt = p.ansicht === "kompakt";
  function karte(s) {
    const favorit = p.favoriten.includes(s.id);
    const frei = LS.fuerKinderSichtbar(s.id);
    // Schalter je Spiel (Wunsch Patrik 2026-10-31): ⏱ Timer und ♾ Endlos leuchten wie der Favoriten-Stern;
    // die Stufenknöpfe starten dann mit Timer bzw. im Endlos-Modus. Der Timer ist dieselbe Einstellung wie im Spiel.
    const timerAn = s.stufen.some(st => LS.timerFuer(name, s.id, st).an);
    const endlosAn = !!s.endlos?.length && p.endlosAn.includes(s.id);
    // data-vorlesen: langes Drücken liest Name und Beschreibung vor (Kindergarten, 1. Klasse; LERN_Session8)
    const lage = klassenRand ? lageVon(s) : null;
    const k = el("div", { class: "spielkarte" + (frei ? "" : " gesperrt") + (endlosAn ? " endlos-an" : "") + (lage ? ` klasse-${lage}` : ""), "data-spiel": s.id,
      title: "Antippen: Startbild des Spiels",
      "data-vorlesen": `${s.name}. ${s.beschreibung}${lage ? ` ${KLASSEN_LAGE[lage].text(s.klasse)}` : ""}` });
    k.style.setProperty("--f", s.farbe);
    // Freie Stellen der Karte öffnen das Startbild des Spiels (dort Stufen, Endlos und Timer mit Erklärung).
    k.addEventListener("click", e => { if (!e.target.closest("a, button")) location.href = s.pfad; });
    const ziel = lz => LERNZIELE.find(x => x.lz === lz)?.text || "";
    // Lernziel-Kürzel: Antippen oder Zeigen blendet den Klartext ein (auch auf dem Tablet, wo es kein title gibt).
    const marken = s.lernziele.map(l => el("button", { type: "button", class: "marke tipp" + (fokus.includes(l.lz) ? " fokus" : ""),
      "data-tipp": `${l.lz}: ${ziel(l.lz)}`, "aria-label": `Lernziel ${l.lz}: ${ziel(l.lz)}`, text: (fokus.includes(l.lz) ? "⭐ " : "") + l.lz }));
    if (aufsicht && !frei) marken.unshift(el("span", { class: "marke warnung", text: `🔒 für Kinder nicht sichtbar: ${LS.sperrGrund(s.id)}` }));
    // Treffer über ein Feld, das nicht auf der Karte steht: sagen, wo (Entscheid SU1 a).
    const grund = treffer?.get(s.id)?.grund;
    if (grund) marken.push(el("span", { class: "marke such-grund", text: aehnlichZu ? `🔗 ${grund}` : `🔍 gefunden ${grund}` }));
    const schalter = (an, art, text, onclick, attr = {}) => el("button", { type: "button", class: "karten-schalter" + (an ? " an" : ""), "aria-pressed": String(an),
      "aria-label": text, title: text, onclick, ...attr }, schalterSymbol(art, an));
    // Von der Aufsicht festgelegt (VR1 a): Symbol mit 🔒, Antippen ändert nichts.
    const festSchalter = (an, art, text) => el("span", { class: "karten-schalter fest", role: "img", "aria-label": `${text} — ${LS.FEST_TEXT}`,
      title: `${text} — ${LS.FEST_TEXT}` }, schalterSymbol(art, an), el("span", { class: "schloss", text: "🔒" }));
    const reihenfolge = s.reihenfolge ? REIHENFOLGE_KARTE[LS.reihenfolgeFuer(name, s.id)] || REIHENFOLGE_KARTE.stufe : null;
    // Schalter in einer eigenen schmalen Leiste oben rechts; darunter hat der Name die volle Breite.
    const schalterZeile = el("div", { class: "karten-schalter-zeile" },
        lage ? el("span", { class: "klassen-marke", role: "img", "aria-label": KLASSEN_LAGE[lage].text(s.klasse), title: KLASSEN_LAGE[lage].text(s.klasse),
          text: KLASSEN_LAGE[lage].zeichen }) : null,
        reihenfolge && (LS.istFest(name, "reihenfolge") ? festSchalter(reihenfolge.an, reihenfolge.symbol, reihenfolge.text)
          : schalter(reihenfolge.an, reihenfolge.symbol, `${reihenfolge.text} — antippen wechselt`,
            () => { LS.setzeWahl(name, "reihenfolge", s.id, reihenfolge.naechste); neu(); })),
        LS.istFest(name, "timer") ? festSchalter(timerAn, "uhr", timerAn ? "Timer an" : "Timer aus")
          : schalter(timerAn, "uhr", timerAn ? "Timer aus" : "Timer ein: jede Aufgabe hat eine Zeit", () => { LS.waehleTimer(name, s.id, !timerAn); neu(); }),
        s.endlos?.length ? schalter(endlosAn, "endlos", endlosAn ? "Endlos aus" : "Endlos ein: so viele wie möglich ohne Fehler",
          () => speichere({ endlosAn: endlosAn ? p.endlosAn.filter(x => x !== s.id) : [...p.endlosAn, s.id] })) : null,
        schalter(favorit, "stern", favorit ? "Aus den Favoriten nehmen" : "Zu den Favoriten",
          () => speichere({ favoriten: UE.umschalten(p.favoriten, s.id) }), { "data-favorit": s.id }));
    const beschreibung = el("div", { class: "ziel", text: s.beschreibung, ...(aufsicht ? {} : { hidden: true }) });
    const info = aufsicht ? null : el("button", { type: "button", class: "karten-info", "aria-expanded": "false", "aria-label": `Worum geht es bei ${s.name}?`,
      title: "Worum geht es?", text: "ⓘ", onclick: () => {
        beschreibung.hidden = !beschreibung.hidden;
        info.setAttribute("aria-expanded", String(!beschreibung.hidden));
      } });
    const sichtbareMarken = aufsicht ? marken : marken.filter(m => m.classList.contains("such-grund"));
    // mit Kartenbild ohne das Emoji im Kopf: das Bild trägt die Erkennung, der Name hat Platz
    const bild = kompakt ? null : kartenBild(s);
    if (bild) k.classList.add("mit-bild");
    k.append(...[
      schalterZeile,
      bild,
      el("div", { class: "kopfzeile" }, el("div", { class: "spiel-bild", text: s.bild }), el("b", { class: "name", text: s.name }), info),
      beschreibung,
      sichtbareMarken.length ? el("div", { class: "marken" }, ...sichtbareMarken) : null].filter(Boolean));
    const knoepfe = el("div", { class: "stufenknoepfe" });
    const empf = LS.empfohleneStufe(name, s.id);
    // Endlos an: nur die Endlos-Stufen, mit dem Rekord statt der Sterne. Stufenfilter: nur die gewählten.
    const stufen = LS.SKALA.filter(st => s.stufen.includes(st.id) && (!filter.stufe.length || filter.stufe.includes(st.id)) && (!endlosAn || s.endlos.includes(st.id)));
    for (const st of stufen) {
      const timer = LS.timerFuer(name, s.id, st.id);
      const rekord = endlosAn ? LS.besterRekord(name, s.id, st.id, timer.an) : 0;
      const sterne = endlosAn ? "" : "★".repeat(LS.besteSterne(name, s.id, st.id));
      const a = el("a", {
        class: "stufenknopf" + (gross ? " gross" : "") + (st.id === empf && !gross ? " empfohlen" : ""),
        href: `${s.pfad}?stufe=${st.id}${endlosAn ? "&endlos=1" : ""}`,
        "data-vorlesen": `${s.name}, Stufe ${st.nr}, ${st.name}. ${LS.stufeFuer(s.id, st.id)}${st.id === empf ? ", für dich empfohlen" : ""}.`,
        title: `${endlosAn ? "♾ Endlos · " : ""}Stufe ${st.nr} · ${st.name} (${LS.stufeFuer(s.id, st.id)})${timer.an ? " · ⏱ mit Timer" : ""}`,
      }, el("span", { class: "stufen-text" }, endlosAn ? schalterSymbol("endlos", true) : st.icon, gross ? ` Stufe ${st.nr} spielen` : `${st.nr}`),
         el("span", { class: "s", text: endlosAn ? (rekord ? `🏆${rekord}` : "") : sterne }));
      a.style.setProperty("--sf", st.farbe);
      knoepfe.append(a);
    }
    k.append(knoepfe);
    return k;
  }

  // ----- Bei einer Suche: eine Liste, beste Treffer zuerst; sonst Favoriten, dann Fach → Thema -----
  if (treffer && aehnlichZu) box.append(el("h2", { class: "treffer-titel" },
    el("span", { text: `🔗 Ähnlich wie ${aehnlichZu.name}: ${auswahl.length} Spiel${auswahl.length === 1 ? "" : "e"} ` }),
    chip("✕ Alle Spiele", false, () => { UE.aehnlich.schliessen(); neu(); }, null, "klein")));
  if (treffer && auswahl.length) box.append(aehnlichZu ? gitter(auswahl) : el("h2", { class: "treffer-titel", text: `🔍 ${auswahl.length} Treffer, beste zuerst` }), aehnlichZu ? "" : gitter(auswahl));
  const favoriten = treffer ? [] : auswahl.filter(s => p.favoriten.includes(s.id));
  if (favoriten.length) box.append(gruppe("favoriten", "⭐ Favoriten", favoriten.length, gitter(favoriten)));
  // Flache Sortierung: alle Spiele in einer Liste (Favoriten bleiben oben in ihrer Gruppe).
  if (flach && auswahl.length) box.append(el("h2", { class: "treffer-titel", text: `${auswahl.length} Spiele · ${LS.EINSTELLUNGEN.sortierung.werte[sort.art]}` }), gitter(auswahl));
  const faecherReihe = sort.ab ? [...FAECHER].reverse() : FAECHER;
  for (const fach of treffer || flach ? [] : faecherReihe) {
    const themen = (sort.ab ? [...THEMEN].reverse() : THEMEN).filter(t => t.fach === fach)
      .map(t => ({ t, spiele: auswahl.filter(s => s.thema === t.id) }))
      .filter(x => x.spiele.length);
    if (!themen.length) continue;
    const anzahl = themen.reduce((n, x) => n + x.spiele.length, 0);
    box.append(gruppe("fach:" + fach, fach, anzahl,
      ...themen.map(({ t, spiele }) => gruppe("thema:" + t.id, t.titel, spiele.length, gitter(spiele)))));
  }
  // Langes Drücken auf eine Karte oder einen Stufenknopf liest vor (Kindergarten, 1. Klasse; LERN_Session8).
  LS.langDruecken(box);
  if (!auswahl.length) {
    box.append(el("div", { class: "karte leer-hinweis",
      text: SPIELE.some(s => LS.spielSichtbar(s.id)) ? "Für diese Auswahl gibt es noch kein Spiel. 🌱"
        : "Noch ist kein Spiel freigegeben. Die Aufsicht kann Spiele in der Verwaltung freigeben. 🌱" }));
  }
}
