/* Lernsteig — Lehrplan-Profile (Konzept der Reihe, Abschnitt 3; Entscheide NV2 a, KT1 a).
   Je Land und Kanton: wie die Niveaus n1, n2 heissen, welche Schulniveaus es gibt und welche Prüfungsziele.
   Intern rechnet alles mit n1 (bis Grundanspruch Z3, Real) und n2 (GA plus Auftrag Z3, Sek).
   Quellen: docs/lernsteig/lehrplan/ (Recherche Patrik, 2026-11-04). */
"use strict";

var LST_LEHRPLAENE = (function () {
  const NAMEN = {
    ch:      { n1: "Real",        n2: "Sek" },          // Realschule / Sekundarschule (ERL 2.2.1)
    neutral: { n1: "Grundlegend", n2: "Erweitert" },
  };

  const KANTONE = [
    ["AG", "Aargau"], ["AI", "Appenzell Innerrhoden"], ["AR", "Appenzell Ausserrhoden"], ["BE", "Bern"],
    ["BL", "Basel-Landschaft"], ["BS", "Basel-Stadt"], ["FR", "Freiburg"], ["GE", "Genf"], ["GL", "Glarus"],
    ["GR", "Graubünden"], ["JU", "Jura"], ["LU", "Luzern"], ["NE", "Neuenburg"], ["NW", "Nidwalden"],
    ["OW", "Obwalden"], ["SG", "St. Gallen"], ["SH", "Schaffhausen"], ["SO", "Solothurn"], ["SZ", "Schwyz"],
    ["TG", "Thurgau"], ["TI", "Tessin"], ["UR", "Uri"], ["VD", "Waadt"], ["VS", "Wallis"], ["ZG", "Zug"],
    ["ZH", "Zürich"],
  ].map(([id, name]) => ({ id, name }));

  /**
   * Kantonale Angaben, nur mit Beleg. SG: Typen Real/Sek; Niveauunterricht in höchstens drei Fächern mit
   * g/m/e (RGL Art. 8–10). Zuordnung g → n1, e → n2 (NV2 a); m ist nicht belegt (R5), der Jugendliche wählt.
   */
  const KANTON = {
    SG: {
      quelle: "docs/lernsteig/lehrplan/lehrplan_sg_sek1.md 1",
      schulniveaus: [
        { id: "g", name: "Niveau g (grundlegend)", niveau: "n1" },
        { id: "m", name: "Niveau m (mittel)", niveau: null },
        { id: "e", name: "Niveau e (erhöht)", niveau: "n2" },
      ],
      niveauFaecher: ["deutsch", "franzoesisch", "englisch", "mathematik", "nt"], // RGL Art. 9
      pruefungsziele: ["stellwerk8", "gymnasium", "eap"],
    },
  };

  /** Prüfungsziele (NV2 a). Die geprüften Stufen je Kompetenz stehen in PRUEFUNG_STUFEN. */
  const PRUEFUNGSZIELE = [
    { id: "keins", name: "kein Prüfungsziel" },
    { id: "stellwerk8", name: "Stellwerk 8", text: "2. Oberstufe, Februar bis Juni" },
    { id: "gymnasium", name: "Aufnahmeprüfung Gymnasium", text: "März der 2. oder 3. Oberstufe" },
    { id: "eap", name: "Einheitsaufnahmeprüfung WMS, IMS, FMS", text: "März der 2. oder 3. Oberstufe" },
  ];

  /**
   * Geprüfte Mathe-Stufen nach den Prüfungsanforderungen (PA), abgeschrieben aus
   * docs/lernsteig/lehrplan/sg_oberstufe_praxis.md 3. „ohneE“: Stufen, bei denen PA die Erweiterungen ausschliesst.
   * Stellwerk 8: keine Stufenliste bekannt.
   */
  const PRUEFUNG_STUFEN = {
    SG: {
      gymnasium: {
        "MA.1.A.1": ["h", "i", "j"], "MA.1.A.2": ["h", "i", "j"], "MA.1.A.3": ["g", "h", "i"],
        "MA.1.A.4": ["h", "i", "j", "k"], "MA.1.B.1": ["j"], "MA.1.B.2": ["h", "j"], "MA.1.C.1": ["g", "h"],
        "MA.1.C.2": ["h", "i", "j"], "MA.2.A.1": ["h", "i", "j"], "MA.2.A.2": ["g", "h", "i"], "MA.2.A.3": ["f", "g", "h"],
        "MA.2.C.2": ["g", "h", "i"], "MA.2.C.3": ["f"], "MA.2.C.4": ["g"], "MA.3.A.1": ["i", "j", "k"],
        "MA.3.A.2": ["i", "j"], "MA.3.A.3": ["f", "g", "h"], "MA.3.B.1": ["i"], "MA.3.C.2": ["f", "g", "h"],
        ohneE: ["MA.1.A.3.h", "MA.1.A.3.i", "MA.1.A.4.h", "MA.1.C.2.i"],
      },
      eap: {
        "MA.1.A.1": ["h", "i", "j"], "MA.1.A.2": ["h", "i", "j"], "MA.1.A.3": ["g", "h", "i"],
        "MA.1.A.4": ["h", "i", "j", "k", "l", "m"], "MA.1.B.1": ["j"], "MA.1.B.2": ["h", "j"], "MA.1.C.1": ["g", "h"],
        "MA.1.C.2": ["h", "i", "j"], "MA.2.A.1": ["h", "i", "j", "k"], "MA.2.A.2": ["g", "h", "i"],
        "MA.2.A.3": ["f", "g", "h", "i"], "MA.2.C.2": ["g", "h", "i"], "MA.2.C.3": ["f"], "MA.2.C.4": ["g"],
        "MA.3.A.1": ["i", "j", "k", "l"], "MA.3.A.2": ["i", "j", "k"], "MA.3.A.3": ["f", "g", "h", "k"],
        "MA.3.B.1": ["i"], "MA.3.C.2": ["f", "g", "h"], "MA.3.C.3": ["g"],
        ohneE: ["MA.1.A.3.h", "MA.1.A.4.h", "MA.1.C.2.i"],
      },
    },
  };

  /**
   * Marken der Kompetenzstufen Mathematik Zyklus 3, abgeschrieben aus der Übersicht in
   * docs/lernsteig/lehrplan/mathematik_zyklus3.md. Je Kompetenz: "GA Z2 | Stufen Z3 | OP Z3 | GA Z3 | Stufen mit E",
   * „-“ = keine. Das Testskript gleicht die Stufen mit den Tabellen der Recherche ab.
   */
  const MARKEN_ROH = {
    "MA.1.A.1": "g|h-l|i|j|i",   "MA.1.A.2": "g|h-j|j|j|i",   "MA.1.A.3": "f|g-j|i|-|h,i", "MA.1.A.4": "g|h-m|j|k|h,i,j",
    "MA.1.B.1": "h|i-l|j|k|i,j", "MA.1.B.2": "g|h-k|i|j|i",   "MA.1.B.3": "-|e-h|g|g|-",   "MA.1.C.1": "f|g-i|-|h|-",
    "MA.1.C.2": "g|h-k|-|j|i",   "MA.2.A.1": "g|h-l|j|k|-",   "MA.2.A.2": "f|g-j|h|i|-",   "MA.2.A.3": "e|f-k|h|i|-",
    "MA.2.B.1": "g|h-l|i|j|-",   "MA.2.B.2": "c|d-h|e|f|-",   "MA.2.C.1": "g|h-l|j|k|j",   "MA.2.C.2": "f|g-j|i|i|-",
    "MA.2.C.3": "e|f-g|-|f|-",   "MA.2.C.4": "f|g-j|h|h|-",   "MA.3.A.1": "h|i-n|k|l|j",   "MA.3.A.2": "h|i-k|i|j|-",
    "MA.3.A.3": "e|f-k|h|i|-",   "MA.3.B.1": "e|f-j|h|i|h",   "MA.3.B.2": "c|d-g|e|f|-",   "MA.3.C.1": "f|g-j|i|j|i",
    "MA.3.C.2": "e|f-i|g|h|f,g", "MA.3.C.3": "f|g-g|-|-|g",
    // Deutsch, aus docs/lernsteig/lehrplan/sprachen_zyklus3.md (Abschnitt 3, „Für Übungen besonders geeignet“)
    "D.5.D.1": "c|d-g|e|e|-", "D.5.E.1": "d|e-g|f|f|-",
    // Englisch (Abschnitt 4): GA Z2 b, Stufen Z3 c–d, GA und OP c
    "FS1E.5.D.1": "b|c-d|c|c|-", "FS2F.5.D.1": "a|b-d|c|c|-",
    // Natur und Technik (nt_zyklus3.md): nur Zyklus 3, kein GA Z2, keine Erweiterungen
    "NT.3.2": "-|a-e|b|b|-", "NT.7.2": "-|a-c|a|b|-", "NT.5.1": "-|a-f|a|d|-", "NT.5.2": "-|a-e|c|c|-",
  };
  const MARKEN = {};
  for (const [k, roh] of Object.entries(MARKEN_ROH)) {
    const [gaZ2, bereich, op, ga, e] = roh.split("|");
    const [von, bis] = bereich.split("-");
    const stufen = [];
    for (let c = von.charCodeAt(0); c <= bis.charCodeAt(0); c++) stufen.push(String.fromCharCode(c));
    MARKEN[k] = { gaZ2: gaZ2 === "-" ? null : gaZ2, stufen, op: op === "-" ? null : op, ga: ga === "-" ? null : ga, e: e === "-" ? [] : e.split(",") };
  }

  /** Marken einer Stufe, etwa ("MA.1.A.3", "i") → { op: true, ga: false, gaZ2: false, e: true, z3: true } */
  function marken(kompetenz, stufe) {
    const m = MARKEN[kompetenz];
    if (!m) return null;
    return { op: m.op === stufe, ga: m.ga === stufe, gaZ2: m.gaZ2 === stufe, e: m.e.includes(stufe), z3: m.stufen.includes(stufe) };
  }

  const LAENDER = [
    { id: "CH", name: "Schweiz" },
    { id: "LI", name: "Liechtenstein" },
    { id: "AT", name: "Österreich" },
    { id: "DE", name: "Deutschland" },
    { id: "XX", name: "anderes Land" },
  ];

  /** Name eines Niveaus für ein Lehrplan-Profil { land, kanton }. */
  function niveauName(niveau, lehrplan) {
    const lp = lehrplan || { land: "CH" };
    return (lp.land === "CH" ? NAMEN.ch : NAMEN.neutral)[niveau] || niveau;
  }

  /** Prüfungsziele, die für ein Lehrplan-Profil wählbar sind (immer mit „keins“). */
  function pruefungszieleFuer(lehrplan) {
    const k = lehrplan && lehrplan.land === "CH" && KANTON[lehrplan.kanton];
    const ids = k ? k.pruefungsziele : [];
    return PRUEFUNGSZIELE.filter(z => z.id === "keins" || ids.includes(z.id));
  }

  /** Wird die Stufe (etwa "MA.1.A.4.j") im Prüfungsziel geprüft? Liefert { geprueft, ohneE }. */
  function geprueft(stufenCode, ziel, lehrplan) {
    const tab = lehrplan && PRUEFUNG_STUFEN[lehrplan.kanton] && PRUEFUNG_STUFEN[lehrplan.kanton][ziel];
    if (!tab) return { geprueft: false, ohneE: false };
    const i = stufenCode.lastIndexOf(".");
    const liste = tab[stufenCode.slice(0, i)] || [];
    return { geprueft: liste.includes(stufenCode.slice(i + 1)), ohneE: tab.ohneE.includes(stufenCode) };
  }

  return { NAMEN, KANTONE, KANTON, LAENDER, PRUEFUNGSZIELE, PRUEFUNG_STUFEN, MARKEN, marken, niveauName, pruefungszieleFuer, geprueft };
})();

if (typeof module !== "undefined") module.exports = LST_LEHRPLAENE;
