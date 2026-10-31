// Erzeugt aus den Inhaltslisten der Spiele (Wörter, Sätze, Tiere, Fakten) eine lesbare Prüfliste (Markdown) für Eltern
// oder Lehrperson. Aufruf: node tools/pruefliste_wortlisten.js > docs/pruefung/wortlisten_zur_pruefung.md
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const wurzel = path.join(__dirname, "..");
const lade = (datei, namen) => {
  const kontext = {};
  vm.runInNewContext(`${fs.readFileSync(path.join(wurzel, datei), "utf8")}\n;this.ergebnis = { ${namen.join(", ")} };`, kontext);
  return kontext.ergebnis;
};

const { WOERTER, SAETZE } = lade("spiele/wortarten-sortierer/woerter.js", ["WOERTER", "SAETZE"]);
const { REGELN } = lade("spiele/regel-luecke/woerter.js", ["REGELN"]);
const { SAETZE: SATZ, AUCH_PUNKT } = lade("spiele/satz-reparatur/saetze.js", ["SAETZE", "AUCH_PUNKT"]);
const { THEMEN_EN, WENDUNGEN_EN } = lade("spiele/word-match/woerter.js", ["THEMEN_EN", "WENDUNGEN_EN"]);

const ART = { N: "Nomen", V: "Verb", A: "Adjektiv" };
const STUFE = { "saetze-einfach": "Stufe 3 — einfache Sätze", "saetze-zeiten": "Stufe 4 — Vergangenheit, Steigerung", "saetze-nominal": "Stufe 5 — gleiche Wörter, andere Wortart" };
const zeilen = [];
const z = s => zeilen.push(s);

z("# Wortlisten zur Prüfung");
z("");
z("Bitte jede Zeile ansehen und im Kästchen ✔ (stimmt) oder eine Korrektur eintragen.");
z("Massgebend ist, wie es die Klasse im Lehrmittel lernt. Erzeugt aus den Dateien `woerter.js`");
z("der Spiele — nach Korrekturen wird diese Liste neu erzeugt.");
z("");
z("## 1. Wortarten-Sortierer (Lehrplan SG D.5.D.1)");
z("");
z("### Einzelwörter (Stufe 1 und 2; in Stufe 2 alles klein geschrieben)");
z("");
z("| Nomen | ☐ | Verb | ☐ | Adjektiv | ☐ |");
z("|---|---|---|---|---|---|");
const n = Math.max(WOERTER.N.length, WOERTER.V.length, WOERTER.A.length);
for (let i = 0; i < n; i++) z(`| ${WOERTER.N[i] ?? ""} | ☐ | ${WOERTER.V[i] ?? ""} | ☐ | ${WOERTER.A[i] ?? ""} | ☐ |`);
z("");
z("### Sätze — abgefragt werden nur die **fett** markierten Wörter");
z("");
z("Hinweis: Adjektive beim Verb („bellt **laut**“) sind nach Schweizer Schulgrammatik als Adjektiv");
z("eingetragen; Hilfsverben („ist“, „haben“) und Partizipien im Perfekt („gebaut“) als Verb.");
for (const [stufe, liste] of Object.entries(SAETZE)) {
  z("");
  z(`#### ${STUFE[stufe]}`);
  z("");
  z("| Satz | Wortarten | ☐ |");
  z("|---|---|---|");
  for (const satz of liste) {
    const markiert = [...satz.matchAll(/\[([^|]+)\|([NVA])\]/g)];
    const lesbar = satz.replace(/\[([^|]+)\|[NVA]\]/g, "**$1**");
    z(`| ${lesbar} | ${markiert.map(m => `${m[1]} = ${ART[m[2]]}`).join("; ")} | ☐ |`);
  }
}
z("");
z("## 2. Regel-Lücke (Lehrplan SG D.5.E.1)");
z("");
z("Je Wort: die richtige Schreibweise und die falsche Auswahl, die im Spiel angeboten wird.");
for (const [, r] of Object.entries(REGELN)) {
  z("");
  z(`### ${r.name}`);
  z("");
  z(`Regel im Spiel: ${r.regel}`);
  z("");
  z("| Wort | richtig | falsche Auswahl | Bild | ☐ |");
  z("|---|---|---|---|---|");
  const alle = [...r.woerter.map(w => [...w, ""]), ...(r.ausnahmen || []).map(w => [...w, " (Ausnahme, Stufe 5–6)"])];
  for (const [text, bild, zusatz] of alle) {
    const m = text.match(/^(.*)\{([^|]+)\|([^}]+)\}(.*)$/);
    z(`| ${m[1]}${m[2]}${m[4]}${zusatz} | ${m[2]} | ${m[1]}${m[3]}${m[4]} | ${bild || ""} | ☐ |`);
  }
}
z("");
z("## 3. Satz-Reparatur und Wörter-Trenner (Lehrplan SG D.4.F.1)");
z("");
z("Die Sätze stehen hier richtig geschrieben. Das Spiel zeigt sie klein und ohne Schlusszeichen;");
z("der Wörter-Trenner zeigt sie in Grossbuchstaben ohne Lücken.");
z("");
z(`Auch ein Punkt gilt als richtig (Aussage mit Nachdruck) bei: ${AUCH_PUNKT.map(s => `„${s}“`).join(", ")} ☐`);
const SATZ_STUFE = { s1: "Stufe 1 — nur Satzanfang und Punkt (keine Nomen)", s2: "Stufe 2 — dazu Namen und konkrete Nomen",
  s3: "Stufe 3 — dazu abstrakte Nomen, ? und !", s4: "Stufe 4 — längere Sätze", s5: "Stufe 5 — zwei Sätze" };
for (const [stufe, liste] of Object.entries(SATZ)) {
  z("");
  z(`### ${SATZ_STUFE[stufe]}`);
  z("");
  z("| Satz | ☐ |");
  z("|---|---|");
  for (const s of liste) z(`| ${s} | ☐ |`);
}
z("");
z("## 4. English Word-Match (Lehrplan SG FS1E.5.B.1)");
for (const [, t] of Object.entries(THEMEN_EN)) {
  z("");
  z(`### ${t.name}`);
  z("");
  z("| Englisch | Deutsch | Bild | ☐ |");
  z("|---|---|---|---|");
  for (const [en, de, bild] of t.woerter) z(`| ${en} | ${de} | ${bild} | ☐ |`);
}
z("");
z("### Phrases");
z("");
z("| Englisch | Deutsch | ☐ |");
z("|---|---|---|");
for (const [en, de] of WENDUNGEN_EN) z(`| ${en} | ${de} | ☐ |`);
z("");

// ---------- LERN_Session2: Silben, Reime, ABC, Tiere, Fledermäuse ----------

const { SILBEN_WOERTER } = lade("spiele/silben-klatscher/woerter.js", ["SILBEN_WOERTER"]);
const { REIMGRUPPEN, REIMVERSE } = lade("spiele/reim-paare/woerter.js", ["REIMGRUPPEN", "REIMVERSE"]);
const { ABC_WOERTER } = lade("spiele/abc-sortierer/woerter.js", ["ABC_WOERTER"]);
const { TIERE } = lade("spiele/tier-sortierer/tiere.js", ["TIERE"]);
const { NAHRUNGSKETTEN, ARTIKEL } = lade("spiele/lebensraum/nahrung.js", ["NAHRUNGSKETTEN", "ARTIKEL"]);
const FLEDER = lade("spiele/fledermaus-forscher/fakten.js", ["FLEDERMAUS_AUSSAGEN", "FLEDERMAUS_FRAGEN", "FLEDERMAUS_JAHR", "FLEDERMAUS_ANPASSUNGEN"]);

z("## 5. Silben-Klatscher (Lehrplan SG D.5.C.1)");
z("");
z("Sprechsilben, wie man sie klatscht — nicht die Trennung am Zeilenende (E-le-fant, nicht Ele-fant).");
z("");
z("| Wort | Silben | Anzahl | Bild | ☐ |");
z("|---|---|---|---|---|");
for (const [getrennt, bild] of Object.values(SILBEN_WOERTER).flat()) z(`| ${getrennt.replace(/-/g, "")} | ${getrennt} | ${getrennt.split("-").length} | ${bild} | ☐ |`);
z("");
z("## 6. Reim-Paare (Lehrplan SG D.5.C.1)");
z("");
z("Alle Wörter einer Zeile müssen sich reimen; Wörter aus verschiedenen Zeilen dürfen sich **nicht** reimen.");
z("Wörter ohne Bild kommen erst ab Stufe 4 vor.");
z("");
z("| Reimgruppe | ☐ |");
z("|---|---|");
for (const g of REIMGRUPPEN) z(`| ${g.map(([w, b]) => (b ? `${b} ${w}` : w)).join(" – ")} | ☐ |`);
z("");
z("### Verse (Stufe 5)");
z("");
z("| Vers | ☐ |");
z("|---|---|");
for (const [vers, wort] of REIMVERSE) z(`| ${vers.replace("___", `**${wort}**`)} | ☐ |`);
z("");
z("## 7. ABC-Sortierer (Lehrplan SG D.5.E.1)");
z("");
z("| Wort | Bild | ☐ |");
z("|---|---|---|");
for (const [w, b] of ABC_WOERTER) z(`| ${w} | ${b} | ☐ |`);
z("");
z("## 8. Tier-Sortierer und Lebensraum-Zuordnung (Lehrplan SG NMG.2.1, NMG.2.4)");
z("");
z("Leer = bewusst nicht zugeordnet, weil nicht eindeutig (Haltung) oder in mehreren Lebensräumen typisch.");
z("Ohne Bild = kein passendes Emoji; das Tier kommt erst ab Stufe 3 vor.");
z("");
z("| Name | Bild | Klasse | Gruppe (Säugetiere) | Haltung | Lebensraum | ☐ |");
z("|---|---|---|---|---|---|---|");
for (const [name, bild, klasse, gruppe, haltung, raum] of TIERE) z(`| ${name} | ${bild || ""} | ${klasse} | ${gruppe || ""} | ${haltung || ""} | ${raum || ""} | ☐ |`);
z("");
z("### Nahrungsketten (Stufe 4–5) — lies: … wird gefressen von …");
z("");
z("| Kette | ☐ |");
z("|---|---|");
for (const k of NAHRUNGSKETTEN) z(`| ${k.map(([n]) => n).join(" → ")} | ☐ |`);
z("");
z(`Artikel für „Was frisst …?“: ${Object.entries(ARTIKEL).map(([n, a]) => `${a} ${n}`).join(", ")} ☐`);
z("");
z("## 9. Fledermaus-Forscher (Lehrplan SG NMG.2.3, NMG.2.4)");
z("");
z("### Aussagen „Stimmt das?“");
z("");
z("| ab Stufe | Aussage | stimmt? | Erklärung im Spiel | ☐ |");
z("|---|---|---|---|---|");
for (const [ab, text, stimmt, erkl] of FLEDER.FLEDERMAUS_AUSSAGEN) z(`| ${ab} | ${text} | ${stimmt ? "ja" : "nein"} | ${erkl} | ☐ |`);
z("");
z("### Fragen mit Auswahl");
z("");
z("| ab Stufe | Frage | richtig | falsch | Erklärung | ☐ |");
z("|---|---|---|---|---|---|");
for (const [ab, frage, richtig, f1, f2, erkl] of FLEDER.FLEDERMAUS_FRAGEN) z(`| ${ab} | ${frage} | ${richtig} | ${f1}; ${f2} | ${erkl} | ☐ |`);
z("");
z(`### Jahr der Fledermaus: ${FLEDER.FLEDERMAUS_JAHR.map(([zeit, was]) => `${zeit} ${was}`).join(" → ")} ☐`);
z("");
z("### Merkmal und Nutzen (jeder Nutzen darf nur zu einem Merkmal passen)");
z("");
z("| Merkmal | Nutzen | ☐ |");
z("|---|---|---|");
for (const [m, n] of FLEDER.FLEDERMAUS_ANPASSUNGEN) z(`| ${m} | ${n} | ☐ |`);
z("");

// ---------- LERN_Session2, zweite Gruppe (Stufe 1 = 1. Klasse) ----------

/** Abschnitt mit Tabelle: Kopfzeilen und Zeilen (Arrays), am Ende je ein Prüfkästchen. */
function tabelle(titel, hinweis, kopf, zeilenListe) {
  z(titel);
  z("");
  if (hinweis) { z(hinweis); z(""); }
  z(`| ${kopf.join(" | ")} | ☐ |`);
  z(`|${kopf.map(() => "---").join("|")}|---|`);
  for (const zeile of zeilenListe) z(`| ${zeile.map(x => (x === null || x === undefined ? "" : String(x).replace(/\|/g, "/"))).join(" | ")} | ☐ |`);
  z("");
}

const ANLAUT = lade("spiele/anlaut-angel/woerter.js", ["ANLAUT_WOERTER", "ENDLAUT_WOERTER", "MITTE_WOERTER", "LUECKEN_WOERTER"]);
const ZWILLINGE = lade("spiele/buchstaben-zwillinge/woerter.js", ["WORTPAARE", "VERWECHSLER"]);
const BLITZ = lade("spiele/blitzlesen/woerter.js", ["ZAEHLDINGE"]);
const { KOMPOSITA } = lade("spiele/nomen-puzzle/woerter.js", ["KOMPOSITA"]);
const { LESETEXTE } = lade("spiele/lese-detektiv/texte.js", ["LESETEXTE"]);
const { GESCHICHTEN } = lade("spiele/rechengeschichten/geschichten.js", ["GESCHICHTEN"]);
const SCHAETZ = lade("spiele/schaetz-waage/groessen.js", ["VERGLEICHE", "REIHEN", "SCHAETZFRAGEN"]);
const ZYKLUS = lade("spiele/lebenszyklus/zyklen.js", ["ZYKLEN", "GEBURT", "ZYKLUS_FRAGEN"]);
const KOERPER = lade("spiele/koerper-puzzle/koerper.js", ["KOERPERTEILE", "SINNE", "KOERPER_FRAGEN", "WEGE"]);
const ZNUENI = lade("spiele/znueni-teller/lebensmittel.js", ["LEBENSMITTEL", "ZNUENIS", "ZNUENI_FRAGEN"]);
const MAGNET = lade("spiele/magnet-labor/versuche.js", ["MAGNET_DINGE", "MAGNET_FRAGEN"]);
const STOFFE = lade("spiele/schwimmt-sinkt/stoffe.js", ["WASSER_DINGE", "WASSER_EINFACH", "MATERIAL_DINGE", "STOFF_FRAGEN"]);
const INSTR = lade("spiele/instrumente/instrumente.js", ["INSTRUMENTE", "INSTRUMENT_FRAGEN"]);
const frage3 = l => l.map(([ab, f, r, a, b]) => [ab, f, r, `${a}; ${b}`]);

z("## 10. Anlaut-Angel (Lehrplan SG D.1.A.1, D.4.A.1)");
z("");
z("Nur Wörter, bei denen man den Buchstaben auch hört (kein V wie in Vogel, keine Endlaute b/d/g, kein -er).");
z("");
tabelle("### Anlaut = erster Buchstabe", null, ["Wort", "Bild"], ANLAUT.ANLAUT_WOERTER);
tabelle("### Endlaut = letzter Buchstabe", null, ["Wort", "Bild", "Endlaut"], ANLAUT.ENDLAUT_WOERTER.map(([w, b]) => [w, b, w.slice(-1)]));
tabelle("### Selbstlaut in der Mitte", null, ["Wort", "Bild"], ANLAUT.MITTE_WOERTER);
tabelle("### Lautgetreue Wörter (fehlender Buchstabe)", null, ["Wort", "Bild"], ANLAUT.LUECKEN_WOERTER);
z("## 11. Buchstaben-Zwillinge und Blitzlesen (Lehrplan SG D.2.A.1)");
z("");
tabelle("### Ähnliche Wörter (das erste passt zum Bild)", null, ["Wort mit Bild", "Ablenker"], ZWILLINGE.WORTPAARE.map(([[w, b], ...a]) => [`${b} ${w}`, a.join(", ")]));
tabelle("### Leicht verwechselbare Buchstaben", null, ["Gruppe"], ZWILLINGE.VERWECHSLER.map(g => [g.join(" ")]));
tabelle("### Wortgruppen in Blitzlesen Stufe 5", null, ["Einzahl", "Mehrzahl", "ein/eine", "Bild"], BLITZ.ZAEHLDINGE);
tabelle("## 12. Nomen-Puzzle (Lehrplan SG D.5.D.1)", "Das Grundwort (letzter Teil) bestimmt den Artikel.", ["Teile", "zusammengesetzt", "falsche Formen"],
  Object.values(KOMPOSITA).flat().map(k => [k.teile.map(t => `${t[0]} ${t[1]}`).join(" + "), `${k.ganz[0]} ${k.ganz[1]}`, (k.falsch || []).join(", ")]));
tabelle("## 13. Lese-Detektiv (Lehrplan SG D.2.B.1)", "Die Namen in den Texten sind erfunden.", ["Stufe", "Titel", "Text", "Frage", "richtig", "falsch"],
  LESETEXTE.map(([s, t, text, f, r, a, b]) => [s, t, text, f, r, `${a}; ${b}`]));
tabelle("## 14. Rechengeschichten (Lehrplan SG MA.3.C.2, MA.3.C.3)", "Platzhalter {a}, {b} … werden im Spiel durch Zahlen aus den Bereichen ersetzt.", ["Stufe", "Geschichte", "Zahlen", "richtige Rechnung", "Ablenker"],
  GESCHICHTEN.map(g => [g.stufe, g.text, Object.entries(g.zahlen).map(([k, [a, b]]) => `${k}: ${a}–${b}`).concat(Object.entries(g.abgeleitet || {}).map(([k, v]) => `${k} = ${v}`)).join(", "), g.richtig || g.rechnung, (g.falsch || []).join("; ") || `(nicht gebraucht: ${g.unwichtig})`]));
z("## 15. Schätz-Waage (Lehrplan SG MA.3.A.1)");
z("");
tabelle("### Vergleichen", null, ["Eigenschaft", "grösser", "kleiner"], SCHAETZ.VERGLEICHE.map(([e, a, b]) => [e, `${a[0]} ${a[1]}`, `${b[0]} ${b[1]}`]));
tabelle("### Ordnen", null, ["Richtung", "Reihe"], SCHAETZ.REIHEN.map(([r, d]) => [r, d.map(x => `${x[0]} ${x[1]}`).join(" → ")]));
tabelle("### Referenzgrössen", null, ["Stufe", "Frage", "richtig", "falsch"], frage3(SCHAETZ.SCHAETZFRAGEN));
z("## 16. Lebenszyklus-Puzzle (Lehrplan SG NMG.2.3)");
z("");
tabelle("### Zyklen", null, ["ab Stufe", "Lebewesen", "Stadien"], ZYKLUS.ZYKLEN.map(([s, n, st]) => [s, n, st.map(x => x[1]).join(" → ")]));
tabelle("### Wie kommen die Jungen zur Welt?", null, ["Tier", "Bild", "Art"], ZYKLUS.GEBURT.map(([b, t, a]) => [t, b, a]));
tabelle("### Fragen", null, ["Frage", "richtig", "falsch"], ZYKLUS.ZYKLUS_FRAGEN.map(([f, r, a, b]) => [f, r, `${a}; ${b}`]));
z("## 17. Körper-Puzzle (Lehrplan SG NMG.1.4)");
z("");
tabelle("### Körperteile", null, ["Bild", "Name", "Artikel"], KOERPER.KOERPERTEILE);
tabelle("### Sinne", null, ["Frage", "Bild", "Sinnesorgan"], KOERPER.SINNE);
tabelle("### Fragen", null, ["Stufe", "Frage", "richtig", "falsch"], frage3(KOERPER.KOERPER_FRAGEN));
tabelle("### Wege durch den Körper", null, ["Weg", "Stationen"], KOERPER.WEGE.map(([n, s]) => [n, s.join(" → ")]));
z("## 18. Znüni-Teller (Lehrplan SG NMG.1.3)");
z("");
tabelle("### Lebensmittel und Gruppen", "Gruppe „Getreide“ heisst im Spiel „Brot, Teigwaren, Kartoffeln“; „Süsses“ heisst „Süsses und Salziges“.", ["Bild", "Name", "Gruppe"], ZNUENI.LEBENSMITTEL);
tabelle("### Znüni zur Wahl", null, ["ausgewogen", "nicht ausgewogen"], ZNUENI.ZNUENIS.map(([g, ...s]) => [g.join(""), s.map(x => x.join("")).join("; ")]));
tabelle("### Fragen", null, ["Frage", "richtig", "falsch"], ZNUENI.ZNUENI_FRAGEN.map(([f, r, a, b]) => [f, r, `${a}; ${b}`]));
z("## 19. Magnet-Labor (Lehrplan SG NMG.5.2)");
z("");
tabelle("### Zieht der Magnet es an?", null, ["Bild", "Ding", "zieht an?"], MAGNET.MAGNET_DINGE.map(([b, d, j]) => [b, d, j ? "ja" : "nein"]));
tabelle("### Fragen", null, ["Stufe", "Frage", "richtig", "falsch"], frage3(MAGNET.MAGNET_FRAGEN));
z("## 20. Schwimmt oder sinkt? (Lehrplan SG NMG.3.3)");
z("");
tabelle("### Im Wasser", "„Stufe 1“ = ganz eindeutige Dinge, die schon in der Einstiegsstufe vorkommen.", ["Bild", "Ding", "schwimmt?", "Stufe 1"],
  STOFFE.WASSER_DINGE.map(([b, d, j]) => [b, d, j ? "schwimmt" : "sinkt", STOFFE.WASSER_EINFACH.includes(d) ? "ja" : ""]));
tabelle("### Material", null, ["Bild", "Ding", "Material"], STOFFE.MATERIAL_DINGE);
tabelle("### Fragen", null, ["Stufe", "Frage", "richtig", "falsch"], frage3(STOFFE.STOFF_FRAGEN));
z("## 21. Instrumenten-Kenner (Lehrplan SG MU.4.C.1)");
z("");
tabelle("### Instrumente", "Bild „svg:…“ = im Spiel gezeichnet; leer = kein Bild, nur ab Stufe 3.", ["Bild", "Name", "Gruppe", "Spielweise", "genauer"], INSTR.INSTRUMENTE);
tabelle("### Fragen", null, ["Frage", "richtig", "falsch"], INSTR.INSTRUMENT_FRAGEN.map(([f, r, a, b]) => [f, r, `${a}; ${b}`]));
// LERN_Session3
const { WORTFAMILIEN } = lade("spiele/wortfamilien-baum/woerter.js", ["WORTFAMILIEN"]);
const ZR = lade("spiele/zeitreise-verben/woerter.js", ["VERBEN_REGELMAESSIG", "VERBEN_UNREGELMAESSIG"]);
const FL = lade("spiele/fehler-lupe/woerter.js", ["FEHLER_REGELN", "FEHLERFREIE_SAETZE"]);
tabelle("## 22. Wortfamilien-Baum (Lehrplan SG D.5.D.1)", "Ähnliche Wörter gehören NICHT zur Familie.", ["Familie", "Stamm", "abgeleitet", "mit Umlaut", "zusammengesetzt", "nur ähnlich (Bedeutung)"],
  WORTFAMILIEN.map(f => [f.wort, f.stamm, f.einfach.join(", "), f.umlaut.join(", "), f.zusammen.join(", "), f.falsch.map(([w, b]) => `${w} (${b})`).join("; ")]));
const satz3 = ([inf, pr, pt, pa, h, s, r]) => [inf, `${s} ${pr} ${r}.`, `${s} ${pt} ${r}.`, `${s} ${h} ${r} ${pa}.`];
tabelle("## 23. Zeitreise-Verben (Lehrplan SG D.5.D.1) — regelmässig", null, ["Verb", "Präsens", "Präteritum", "Perfekt"], ZR.VERBEN_REGELMAESSIG.map(satz3));
tabelle("### Unregelmässig", null, ["Verb", "Präsens", "Präteritum", "Perfekt"], ZR.VERBEN_UNREGELMAESSIG.map(satz3));
z("## 24. Fehler-Lupe (Lehrplan SG D.4.F.1) — gezeigt wird die falsche Schreibweise");
z("");
for (const r of Object.values(FL.FEHLER_REGELN)) tabelle(`### ${r.name}`, `Regel im Spiel: ${r.regel}`, ["Satz richtig", "gezeigter Fehler", "weitere Wahl"],
  [...r.kurz, ...r.lang].map(s => { const m = s.match(/\{([^}]+)\}/)[1].split("|"); return [s.replace(/\{([^|}]+)[^}]*\}/, "**$1**"), m[1], m.slice(2).join(", ")]; }));
tabelle("### Fehlerfreie Sätze (Königsstufe)", null, ["Satz"], FL.FEHLERFREIE_SAETZE.map(s => [s]));
const { UMFRAGEN } = lade("spiele/diagramm-detektiv/umfragen.js", ["UMFRAGEN"]);
tabelle("## 25. Diagramm-Detektiv (Lehrplan SG MA.3.C.1) — Umfragen", "Die Zahlen erzeugt das Spiel; zu prüfen sind Fragen und Kategorien.", ["Titel", "Frage", "Kategorien"],
  UMFRAGEN.map(u => [u.titel, u.frage, u.kategorien.map(([b, n, f]) => `${b} ${n} (${f})`).join(", ")]));
const { ARTIKEL: PREIS_ARTIKEL } = lade("spiele/preis-tabelle/artikel.js", ["ARTIKEL"]);
tabelle("## 26. Preis-Tabelle (Lehrplan SG MA.3.A.3) — Artikel", "Preis je Stück in Rappen: kleinster bis grösster Wert, den das Spiel wählt.", ["Bild", "Einzahl", "Mehrzahl", "von Rp.", "bis Rp."], PREIS_ARTIKEL);
const { ORTE } = lade("spiele/kompass/orte.js", ["ORTE"]);
tabelle("## 27. Kompass-Spiel (Lehrplan SG NMG.8.4) — Orte auf dem Plan", null, ["Bild", "Name", "Nominativ", "Dativ"], ORTE);

// LERN_Session3, zweites Paket (Entscheid G1 a). Zellen mit Listen werden mit „ · “ verbunden,
// verschachtelte Listen mit „ / “; true/false als ja/nein.
const zelle = x => Array.isArray(x) ? x.map(y => (Array.isArray(y) ? y.map(zelle).join(" / ") : zelle(y))).join(" · ")
  : x === true ? "ja" : x === false ? "nein" : x && typeof x === "object" ? Object.entries(x).map(([k, v]) => `${k}: ${zelle(v)}`).join("; ") : x;
const zeilenVon = daten => (Array.isArray(daten) ? daten : Object.entries(daten).map(([k, v]) => [k, v])).map(e => (Array.isArray(e) ? e.map(zelle) : [zelle(e)]));
/** Tabelle mit Kopf; ein Objekt { gruppe: [...] } wird je Gruppe zu einer eigenen Tabelle. */
const teil = (titel, hinweis, kopf, daten) => {
  if (!Array.isArray(daten) && Object.values(daten).every(Array.isArray) && Object.values(daten).every(v => v.every(Array.isArray))) {
    for (const [gruppe, liste] of Object.entries(daten)) tabelle(`${titel} — ${gruppe}`, hinweis, kopf, zeilenVon(liste));
  } else tabelle(titel, hinweis, kopf, zeilenVon(daten));
};

const WZ = lade("spiele/wort-zwillinge/woerter.js", ["ZWILLINGE", "FALSCHE_FREUNDE"]);
teil("## 28. Wort-Zwillinge (Lehrplan SG FS1E.2.B.1) — Parallelwörter", null, ["Englisch", "Deutsch", "Bild", "Liste"], WZ.ZWILLINGE);
teil("### Falsche Freunde", null, ["Englisch", "Bedeutung", "sieht aus wie", "Bild"], WZ.FALSCHE_FREUNDE);
const SB = lade("spiele/sentence-builder/saetze.js", ["SAETZE", "VERWECHSLER"]);
teil("## 29. Sentence-Builder (Lehrplan SG FS1E.5.D.1)", "Britisches Englisch (have got).", ["Englisch", "Deutsch", "Liste"], SB.SAETZE);
teil("### Verwechsler (falsche Form als zusätzliche Karte)", null, ["richtig", "falsch"], SB.VERWECHSLER);
const LT = lade("spiele/listen-tap/hoeren.js", ["ANWEISUNG_FORMEN", "ANWEISUNG_FARBEN", "ANWEISUNG_VERBEN", "WO_TIERE", "WO_ORTE"]);
teil("## 30. Listen & Tap (Lehrplan SG FS1E.1.A.1) — Formen", "Die Einzelwörter kommen aus Word-Match (Teil 9).", ["Form", "Angabe"], LT.ANWEISUNG_FORMEN);
teil("### Farben", null, ["Farbe", "Bilder"], LT.ANWEISUNG_FARBEN);
teil("### Anweisungen", null, ["Anweisung"], LT.ANWEISUNG_VERBEN);
teil("### Wo ist das Tier? — Tiere", null, ["Englisch", "Bild"], LT.WO_TIERE);
teil("### Wo ist das Tier? — Orte", null, ["Ding", "Präposition"], LT.WO_ORTE);
const GK = lade("spiele/glace-kombinator/inhalte.js", ["GLACE_SORTEN", "KLEIDER"]);
teil("## 31. Glace-Kombinator (Lehrplan SG MA.3.B.2) — Sorten", null, ["Sorte", "Farbe", "Buchstabe"], GK.GLACE_SORTEN);
teil("### Kleider", null, ["Gruppe", "Bild", "Name"], GK.KLEIDER);
const FH = lade("spiele/frueher-heute/dinge.js", ["FH_PAARE", "FH_REIHEN", "FH_GROSSELTERN"]);
teil("## 32. Früher und heute (Lehrplan SG NMG.9.2) — Paare", "„svg:…“ = im Spiel gezeichnet.", ["Gruppe", "Bild früher", "früher", "Bild heute", "heute", "früher eindeutig"], FH.FH_PAARE);
teil("### Reihen vom ältesten zum neusten", null, ["Gruppe", "Thema", "Reihe (Bild / Ding)"], FH.FH_REIHEN);
teil("### Gab es das schon?", null, ["Bild", "Ding", "vor 60 Jahren", "vor 100 Jahren"], FH.FH_GROSSELTERN);
const SW = lade("spiele/schulweg-profi/situationen.js", ["SW_SICHER", "SW_MERKSATZ", "SW_FRAGEN", "SW_SIGNALE"]);
teil("## 33. Schulweg-Profi (Lehrplan SG NMG.1.2) — sicher oder gefährlich", "Verkehrsregeln aus dem Gedächtnis belegt (SVG, VTS) — bitte besonders prüfen.", ["Bild", "Situation", "sicher"], SW.SW_SICHER);
teil("### Merksatz", null, ["Bild", "Mundart", "Hochdeutsch"], SW.SW_MERKSATZ);
teil("### Fragen", null, ["ab Stufe", "Liste", "Bild", "Frage", "richtig", "falsch", "falsch", "Erklärung"], SW.SW_FRAGEN);
teil("### Signale", null, ["Signal", "Bedeutung", "auch richtig"], SW.SW_SIGNALE);
const WJ = lade("spiele/wetter-jahreszeiten/wetter.js", ["WJ_JAHRESZEITEN", "WJ_KLEIDUNG", "WJ_SYMBOLE", "WJ_FRAGEN"]);
teil("## 34. Wetter und Jahreszeiten (Lehrplan SG NMG.4.4) — Jahreszeiten", null, ["ab Stufe", "Bild", "Beobachtung", "Jahreszeit"], WJ.WJ_JAHRESZEITEN);
teil("### Kleidung", null, ["Bild", "Wetter", "richtig", "falsch", "falsch"], WJ.WJ_KLEIDUNG);
teil("### Wettersymbole", null, ["Bild", "Name"], WJ.WJ_SYMBOLE);
teil("### Fragen", null, ["ab Stufe", "Bild", "Frage", "richtig", "falsch", "falsch", "Erklärung"], WJ.WJ_FRAGEN);
const ZS = lade("spiele/zeitstrahl-sortierer/zeitstrahl.js", ["ZS_ABSCHNITTE", "ZS_LEBEN", "ZS_GENERATIONEN", "ZS_EREIGNISSE", "ZS_EPOCHEN", "ZS_MERKMALE"]);
teil("## 35. Zeitstrahl-Sortierer (Lehrplan SG NMG.9.1) — Lebensabschnitte", null, ["Bild", "Abschnitt"], ZS.ZS_ABSCHNITTE);
teil("### Ereignisse im Leben", "Eintrittsalter für den Kanton St. Gallen.", ["Alter", "Bild", "Ereignis"], ZS.ZS_LEBEN);
teil("### Generationen", null, ["Generation", "Bild", "Person"], ZS.ZS_GENERATIONEN);
teil("### Ereignisse mit Jahrzahl", "Jahrzahlen bitte nachprüfen.", ["Jahr", "Jahrzahl", "Bild", "Ereignis", "Zeitalter"], ZS.ZS_EREIGNISSE);
teil("### Zeitalter", null, ["Bild", "Zeitalter"], ZS.ZS_EPOCHEN);
teil("### Merkmale der Zeitalter", null, ["Zeitalter", "Bild", "Merkmal"], ZS.ZS_MERKMALE);
const ST = lade("spiele/stromkreis-bauer/bauteile.js", ["GEGENSTAENDE", "SCHALTUNGEN"]);
teil("## 36. Stromkreis-Bauer (Lehrplan SG NMG.5.2) — Leiter und Nichtleiter", null, ["Bild", "Gegenstand", "leitet", "knifflig"], ST.GEGENSTAENDE);
teil("### Schaltungen", "Kurzschrift im Kopf von bauteile.js; ob die Lampe brennt, rechnet das Spiel aus.", ["Liste", "Aufbau", "Zusatz"], ST.SCHALTUNGEN);
const PL = lade("spiele/plan-leser/plaene.js", ["PLAN_DINGE"]);
teil("## 37. Plan-Leser (Lehrplan SG NMG.8.5) — Dinge auf dem Plan", "Zeichen frei erfunden.", ["Name", "Dativ", "Mehrzahl", "Zeichen", "Farbe"], PL.PLAN_DINGE);
const EE = lade("spiele/echt-oder-erfunden/texte.js", ["AUSSAGEN", "MERKMALE", "GESCHICHTEN", "STAUNEN", "TEXTSORTEN", "TEXTSORTEN_TEXTE"]);
teil("## 38. Echt oder erfunden? (Lehrplan SG NMG.9.4) — Sätze", null, ["Bild", "Satz", "kann es geben", "Stufe 1"], EE.AUSSAGEN);
teil("### Merkmale", null, ["Schlüssel", "Merkmal"], EE.MERKMALE);
teil("### Geschichten", "Nummer des erfundenen Satzes, −1 = alles echt.", ["Sätze", "erfundener Satz", "Merkmal"], EE.GESCHICHTEN);
teil("### Erstaunlich, aber wahr?", "Fakten bitte nachprüfen.", ["Satz", "stimmt"], EE.STAUNEN);
teil("### Textsorten", null, ["Sorte", "Angaben"], EE.TEXTSORTEN);
teil("### Texte zu den Textsorten", "Selbst geschrieben; die Sagen spielen an echten Orten.", ["Sorte", "Text"], EE.TEXTSORTEN_TEXTE);
const GB = lade("spiele/gedicht-baukasten/gedichte.js", ["REIMPAARE", "VIERZEILER", "STROPHEN_GEDICHTE"]);
teil("## 39. Gedicht-Baukasten (Lehrplan SG D.6.C.1) — Zweizeiler", "Alle Verse selbst verfasst.", ["Vers 1", "Vers 2", "Reimwort", "Wahl", "Wahl", "Wahl"], GB.REIMPAARE);
teil("### Vierzeiler", null, ["Verse"], Object.fromEntries(Object.entries(GB.VIERZEILER).map(([k, v]) => [k, v.map(g => [g])])));
teil("### Gedichte mit Strophen", null, ["Titel", "Strophen (Reimschema / Verse)"], GB.STROPHEN_GEDICHTE);
process.stdout.write(zeilen.join("\n"));
