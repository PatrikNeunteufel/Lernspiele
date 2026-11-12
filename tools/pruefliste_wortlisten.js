// Erzeugt aus den Inhaltslisten der Spiele (Wörter, Sätze, Tiere, Fakten) eine lesbare Prüfliste (Markdown) für Eltern
// oder Lehrperson. Aufruf: node tools/pruefliste_wortlisten.js > docs/eulenpfad/pruefung/wortlisten_zur_pruefung.md
// Schreibt dazu docs/eulenpfad/pruefung/listen.json (Prüfansicht je Liste im Entwickler-Modus).
//   --pruefe   nichts schreiben, nur vergleichen: Ende mit Code 1, wenn listen.json oder die Markdown-Prüfliste nicht
//              zu den Inhaltslisten passt (LERN_Session17: nach dem Ändern von Listen nicht neu erzeugt, die
//              Prüfansicht zeigte die alten Bilder). Vom Testskript tools/pruefe_spiele.js aufgerufen.
"use strict";
const PRUEFE = process.argv.includes("--pruefe");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const wurzel = path.join(__dirname, "..", "eulenpfad"); // App-Ordner (Entscheid P1 a)
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
z("Bild „svg:…“ = gezeichnet (Bildersammlung spiele/gemeinsam/bilder.js); ohne Bild käme das Tier erst ab Stufe 3 vor.");
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
tabelle("## 14. Rechengeschichten (Lehrplan SG MA.3.C.2, MA.3.C.3)", "Platzhalter {a}, {b} … werden im Spiel durch Zahlen aus den Bereichen ersetzt; {b:wird|werden} heisst: „wird“, wenn b = 1 ist, sonst „werden“.", ["Stufe", "Geschichte", "Zahlen", "richtige Rechnung", "Ablenker"],
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
tabelle("### Lebensmittel und Gruppen", "Gruppe „Stärke“ heisst im Spiel „Brot, Teigwaren, Kartoffeln“; „Süsses“ heisst „Süsses und Salziges“.", ["Bild", "Name", "Gruppe"], ZNUENI.LEBENSMITTEL);
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
tabelle("## 25. Daten-Detektiv (Lehrplan SG MA.3.C.1) — Umfragen", "Die Zahlen erzeugt das Spiel; zu prüfen sind Fragen und Kategorien.", ["Titel", "Frage", "Kategorien"],
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
// Je Form die Bilder aller Farben (Spalte i von ANWEISUNG_FARBEN), damit die Prüfung sie sieht (Bemerkung 51)
const formZeilen = LT.ANWEISUNG_FORMEN.map((f, i) => [f, Object.values(LT.ANWEISUNG_FARBEN).map(b => b[i]).join(" ")]);
teil("## 30. Listen & Tap (Lehrplan SG FS1E.1.A.1) — Formen", "Die Einzelwörter kommen aus Word-Match (Teil 9).", ["Form", "Bilder"], formZeilen);
teil("### Farben", null, ["Farbe", "Bilder"], LT.ANWEISUNG_FARBEN);
teil("### Anweisungen", null, ["Anweisung"], LT.ANWEISUNG_VERBEN);
teil("### Wo ist das Tier? — Tiere", null, ["Englisch", "Bild"], LT.WO_TIERE);
teil("### Wo ist das Tier? — Orte", null, ["Ding", "Präposition"], LT.WO_ORTE);
const GK = lade("spiele/glace-kombinator/inhalte.js", ["GLACE_SORTEN", "KLEIDER"]);
teil("## 31. Möglichkeiten-Finder (Lehrplan SG MA.3.B.2) — Sorten", null, ["Sorte", "Farbe", "Buchstabe"], GK.GLACE_SORTEN);
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
// LERN_Session6: Schweiz-Karten-Suche — Lage aus swisstopo (karte.js), geprüft werden die Namen (orte.js)
const { KARTE } = lade("spiele/schweiz-karte/karte.js", ["KARTE"]);
const KO = lade("spiele/schweiz-karte/orte.js", ["KANTONE_NAMEN", "ORT_NAMEN", "STADT_MIN"]);
const ortName = o => KO.ORT_NAMEN[o.name] || o.name.replace(/ \([A-Z]{2}\)$/, "");
const KARTE_TEILE = {
  "wahlkreise-sg": ["Wahlkreise des Kantons St. Gallen", null, ["Wahlkreis"], KARTE.wahlkreise.map(w => [w.name])],
  "kantone": ["Kantone", null, ["Nr.", "Kürzel", "Name im Spiel", "Name in den swisstopo-Daten"],
    KARTE.kantone.map(k => [k.nr, KO.KANTONE_NAMEN[k.nr][0], KO.KANTONE_NAMEN[k.nr][1], k.name])],
  "hauptorte": ["Kantonshauptorte", "Punkt = Mitte der Gemeindefläche.", ["Kanton", "Name im Spiel", "Gemeinde in den Daten"],
    KARTE.orte.filter(o => o.hauptort).map(o => [KO.KANTONE_NAMEN[o.kanton][0], ortName(o), o.name])],
  "staedte": ["Grosse Städte", `Ab ${KO.STADT_MIN} Einwohnern, ohne Hauptorte.`, ["Kanton", "Name im Spiel", "Einwohner"],
    KARTE.orte.filter(o => !o.hauptort && o.einwohner >= KO.STADT_MIN).map(o => [KO.KANTONE_NAMEN[o.kanton][0], ortName(o), o.einwohner])],
};
z("## 40. Schweiz-Karten-Suche (Lehrplan SG NMG.8.4) — Namen auf der stummen Karte");
z("");
z("Die Lage stammt aus swissBOUNDARIES3D (swisstopo); zu prüfen sind die Namen, wie die Kinder sie lernen.");
z("");
for (const [titel, hinweis, kopf, daten] of Object.values(KARTE_TEILE)) tabelle(`### ${titel}`, hinweis, kopf, daten);

// LERN_Session8: Geheimschrift-Knacker, Komma-Jagd, Morphem-Schere
const { GEHEIM_WOERTER } = lade("spiele/geheimschrift-knacker/woerter.js", ["GEHEIM_WOERTER"]);
const { KOMMA_SAETZE } = lade("spiele/komma-jagd/woerter.js", ["KOMMA_SAETZE"]);
const { MORPHEM_LISTEN } = lade("spiele/morphem-schere/woerter.js", ["MORPHEM_LISTEN"]);
const KOMMA_TITEL = { aufzaehlung: "Sätze mit Aufzählungen", verbgruppen: "Sätze mit zwei Verbgruppen", ohne: "Sätze ohne Komma (nur zusätzlich zu den anderen)" };
const morphemZeile = w => [w.replace(/[|()]/g, ""), w.replace(/[()]/g, "").split("|").join(" | "), (w.match(/\(([^)]+)\)/) || [])[1] || ""];
const eaZeile = ([w, verwandt]) => { const m = w.match(/^(.*)\{([^|]+)\|([^}]+)\}(.*)$/); return [m[1] + m[2] + m[4], m[2], m[1] + m[3] + m[4], verwandt]; };
z("## 41. Geheimschrift-Knacker (Lehrplan SG MI.2.1) — Geheimwörter");
z("");
z("Nur Grossbuchstaben A–Z, ohne Umlaute (sonst geht die Verschiebung nicht auf).");
z("");
tabelle("### Wörter", null, ["Wort"], GEHEIM_WOERTER.map(w => [w]));
z("## 42. Komma-Jagd (Lehrplan SG D.5.E.1, D.4.F.1)");
z("");
z("Die Kommas stehen im Satz; das Spiel nimmt sie heraus, und das Kind setzt sie wieder. Nur Muss-Kommas.");
z("");
for (const [liste, saetze] of Object.entries(KOMMA_SAETZE)) tabelle(`### ${KOMMA_TITEL[liste] || liste}`, null, ["Satz"], saetze.map(s => [s]));
z("## 43. Morphem-Schere (Lehrplan SG D.5.D.1, D.5.E.1)");
z("");
tabelle("### Wörter mit Bausteinen", "Der Stamm ist die dritte Spalte; „Endung“ im Spiel auch für -ung, -lich, -keit.", ["Wort", "Bausteine", "Stamm"], MORPHEM_LISTEN.bausteine.map(morphemZeile));
tabelle("### Stammregel e oder ä", "Ohne verwandtes Wort: e oder eu.", ["Wort", "richtig", "falsche Auswahl", "verwandt mit"], MORPHEM_LISTEN["stamm-ea"].map(eaZeile));

// LERN_Session8, Runde 2: je Liste eine oder mehrere Tabellen [Titel, Hinweis, Kopf, Zeilen]
const R2 = (datei, namen) => lade(datei, namen);
const objZeile = o => (Array.isArray(o) ? o.map(zelle) : [zelle(o)]);
const RE = R2("spiele/rede-zeichen/woerter.js", ["REDE_SAETZE"]).REDE_SAETZE;
const TR = R2("spiele/trenn-schere/woerter.js", ["TRENN_WOERTER"]).TRENN_WOERTER;
const VF = R2("spiele/verben-faecher/woerter.js", ["VERBEN_LISTEN"]).VERBEN_LISTEN;
const WS = R2("spiele/wort-spuernase/woerter.js", ["SPUER_SAETZE"]).SPUER_SAETZE;
const SO = R2("spiele/sound-sorter/woerter.js", ["SOUND_LAUTE", "SOUND_WOERTER"]);
const TG = R2("spiele/taschengeld-planer/woerter.js", ["TASCHEN_WAREN"]).TASCHEN_WAREN;
const WT = R2("spiele/wassertropfen-reise/woerter.js", ["WASSER_FRAGEN"]).WASSER_FRAGEN;
const EZ = R2("spiele/erdzeit-leiter/woerter.js", ["ERDZEIT_EREIGNISSE"]).ERDZEIT_EREIGNISSE;
const PB = R2("spiele/pflanzen-bestimmer/woerter.js", ["PFLANZEN_LISTE"]).PFLANZEN_LISTE;
const KW = R2("spiele/kakao-weg/woerter.js", ["WEGE"]).WEGE;
const BK = R2("spiele/blutkreislauf-lotse/woerter.js", ["KREISLAUF_FRAGEN"]).KREISLAUF_FRAGEN;
const EW = R2("spiele/energie-wandler/woerter.js", ["ENERGIEFORMEN", "ENERGIE_GERAETE", "ENERGIE_KETTEN", "ENERGIE_FRAGEN"]);
const BP = R2("spiele/bionik-paare/woerter.js", ["BIONIK_PAARE"]).BIONIK_PAARE;
const RUNDE2 = [
  ["44. Rede-Zeichen (Lehrplan SG D.4.F.1)", "rede-zeichen/vorne", "Begleitsatz vorne", "Anführungszeichen „…“ nach Schweizer Schulschrift angenommen.", ["Satz"], RE.vorne.map(s => [s])],
  [null, "rede-zeichen/hinten", "Begleitsatz hinten", "„|“ = Stelle für den eingeschobenen Begleitsatz (Königsstufe).", ["Satz"], RE.hinten.map(s => [s])],
  ["45. Trenn-Schere (Lehrplan SG D.5.E.1)", "trenn-schere/woerter", "Wörter mit Trennstellen", "Trennung nach Duden prüfen.", ["Wort"], TR.woerter.map(w => [w])],
  ["46. Verben-Fächer (Lehrplan SG D.5.D.1)", "verben-faecher/verben", "Verben mit Ergänzungen", "[frage:Wörter] = Ergänzung mit ihrer Frage.", ["Infinitiv", "Präsens | Präteritum | Perfekt", "Beispielsatz"], VF.verben.map(objZeile)],
  ["47. Wort-Spürnase (Lehrplan SG D.2.B.1)", "wort-spuernase/saetze", "Sätze mit schwierigem Wort", "{Wort} = gesucht, [Wörter] = Hinweis im Text.", ["Stufe", "Satz", "richtig", "falsch", "falsch"], WS.map(objZeile)],
  ["48. Sound-Sorter (Lehrplan SG FS1E.5.C.2)", "sound-sorter/woerter", "Englische Wörter nach Laut", "Britische Aussprache. Laute: " + Object.entries(SO.SOUND_LAUTE).map(([k, l]) => `${k} ${l.ipa}`).join(", "), ["Wort", "Laut", "Bild"], SO.SOUND_WOERTER.map(objZeile)],
  ["49. Taschengeld-Planer (Lehrplan SG NMG.6.5)", "taschengeld-planer/waren", "Waren mit Preisen", "Preis in Rappen, gerundet für die Schweiz 2026 (geschätzt).", ["Bild", "Ware", "Rappen", "Bedarf / Wunsch", "…"], TG.map(objZeile)],
  ["50. Wassertropfen-Reise (Lehrplan SG NMG.2.2)", "wassertropfen-reise/fragen", "Fragen zum Wasserkreislauf", "Fakten bitte nachprüfen.", ["Frage"], WT.map(objZeile)],
  ["51. Erdzeit-Leiter (Lehrplan SG NMG.2.5)", "erdzeit-leiter/ereignisse", "Ereignisse der Erdgeschichte", "Zeit in Millionen Jahren, gerundet — bitte nachprüfen.", ["Ereignis"], EZ.map(objZeile)],
  ["52. Pflanzen-Bestimmer (Lehrplan SG NMG.2.4)", "pflanzen-bestimmer/pflanzen", "Pflanzen mit Merkmalen", "Merkmale bitte nachprüfen; null = nicht verwendet.", ["Pflanze"], PB.map(objZeile)],
  ["53. Kakao-Weg (Lehrplan SG NMG.6.3)", "kakao-weg/wege", "Wege der Produkte", "Je Produkt die Schritte in Reihenfolge.", ["Produkt", "Nr.", "Schritt", "wer"], KW.flatMap(w => w.schritte.map((s, i) => [w.name, i + 1, zelle(s[0]), zelle(s[1])]))],
  ["54. Blutkreislauf-Lotse (Lehrplan SG NMG.1.4)", "blutkreislauf-lotse/fragen", "Fragen zu Herz, Lunge und Blut", "Fakten bitte nachprüfen.", ["Stufe", "Thema", "Frage", "richtig", "falsch", "falsch", "Erklärung"], BK.map(objZeile)],
  ["55. Energie-Wandler (Lehrplan SG NMG.3.2)", "energie-wandler/geraete", "Geräte", "Energieformen: " + Object.entries(EW.ENERGIEFORMEN).map(([k, v]) => `${k} = ${zelle(v)}`).join("; "), ["Gerät"], EW.ENERGIE_GERAETE.map(objZeile)],
  [null, "energie-wandler/geraete", "Ketten", null, ["Kette"], EW.ENERGIE_KETTEN.map(objZeile)],
  [null, "energie-wandler/geraete", "Fragen", null, ["Frage"], EW.ENERGIE_FRAGEN.map(objZeile)],
  ["56. Bionik-Paare (Lehrplan SG NMG.5.3)", "bionik-paare/paare", "Vorbild und Erfindung", "Beispiele bitte nachprüfen (einige sind in Entwicklung).", ["Paar"], BP.map(objZeile)],
];
for (const [teilTitel, , titel, hinweis, kopf, zeilenListe] of RUNDE2) {
  if (teilTitel) { z(`## ${teilTitel}`); z(""); }
  tabelle(`### ${titel}`, hinweis, kopf, zeilenListe);
}

// LERN_Session8, Runde 3: Französisch, Englisch, Informatik
const MM = lade("spiele/mots-match/woerter.js", ["THEMEN_FR"]).THEMEN_FR;
const PW = lade("spiele/parallelwort-bruecke/woerter.js", ["PARALLEL", "PARALLEL_SAETZE"]);
const LL = lade("spiele/le-ou-la/woerter.js", ["NOMEN"]).NOMEN;
const SL = lade("spiele/son-lauscher/woerter.js", ["SON_LAUTE", "SON_WOERTER"]);
const AC = lade("spiele/au-cafe/woerter.js", ["CAFE_DIALOGE", "CAFE_SITUATIONEN", "CAFE_BEFINDEN", "CAFE_TU_VOUS", "CAFE_PERSONEN", "CAFE_SACHEN"]);
const WR = lade("spiele/weather-report/woerter.js", ["WR_WETTER", "WR_WOERTER", "WR_DURCHSAGEN", "WR_ORTE"]);
const DT = lade("spiele/datei-typen/woerter.js", ["DATEI_PROGRAMME", "DATEI_ENDUNGEN", "DATEI_DINGE", "DATEI_NEUTRAL"]);
const RUNDE3 = [
  ...Object.entries(MM).map(([liste, t], i) => [i ? null : "57. Mots-Match (Lehrplan SG FS2F.5.B.1)", `mots-match/${liste}`, t.name, null, ["Artikel", "Wort", "Deutsch", "Bild"], t.woerter.map(objZeile)]),
  ["58. Wörter-Brücke (Lehrplan SG FS2F.2.B.1)", "parallelwort-bruecke/parallel", "Parallelwörter", "Kennzeichen gleich / aehnlich / falle; bei Fallen das letzte Feld = falsche Bedeutung.", ["Französisch", "Deutsch", "Englisch", "Bild", "Kennzeichen", "falsche Bedeutung"], PW.PARALLEL.map(objZeile)],
  [null, "parallelwort-bruecke/parallel", "Sätze mit einem Parallelwort", null, ["Satz", "Parallelwort", "Deutsch"], PW.PARALLEL_SAETZE.map(objZeile)],
  ["59. Le ou la? (Lehrplan SG FS2F.5.D.2)", "le-ou-la/nomen", "Nomen", "Geschlecht m/f, Mehrzahl, Bild, Deutsch, Ausnahme.", ["Nomen", "m/f", "Mehrzahl", "Bild", "Deutsch", "Ausnahme"], LL.map(objZeile)],
  ["60. Son-Lauscher (Lehrplan SG FS2F.5.C.2)", "son-lauscher/woerter", "Wörter nach Laut", "[…] = Lautgruppe. Laute: " + Object.entries(SL.SON_LAUTE).map(([k, l]) => `${k} ${l.ipa}`).join(", "), ["Wort", "Laut", "Bild"], SL.SON_WOERTER.map(objZeile)],
  ["61. Au café (Lehrplan SG FS2F.3.A.1)", "au-cafe/dialoge", "Dialoge", null, ["Dialog"], AC.CAFE_DIALOGE.map(objZeile)],
  [null, "au-cafe/dialoge", "Situationen zum Bild", null, ["Situation"], AC.CAFE_SITUATIONEN.map(objZeile)],
  [null, "au-cafe/dialoge", "Antworten auf « Ça va ? »", null, ["Antwort"], AC.CAFE_BEFINDEN.map(objZeile)],
  [null, "au-cafe/dialoge", "tu oder vous", null, ["Satzpaar"], AC.CAFE_TU_VOUS.map(objZeile)],
  [null, "au-cafe/dialoge", "Personen und Sachen", null, ["Eintrag"], [...AC.CAFE_PERSONEN, ...Object.entries(AC.CAFE_SACHEN)].map(objZeile)],
  ["62. Weather-Report (Lehrplan SG FS1E.1.A.1)", "weather-report/durchsagen", "Durchsagen", "Britisches Englisch, selbst geschrieben.", ["Durchsage"], WR.WR_DURCHSAGEN.map(objZeile)],
  [null, "weather-report/durchsagen", "Wetterwörter", null, ["Wort", "Bild und Deutsch"], Object.entries(WR.WR_WETTER).map(objZeile)],
  ["63. Datei-Typen (Lehrplan SG MI.2.1)", "datei-typen/endungen", "Endungen", "Grössen wie in der Speicher-Leiter.", ["Endung"], DT.DATEI_ENDUNGEN.map(objZeile)],
  [null, "datei-typen/endungen", "Programme", null, ["Programm"], Object.entries(DT.DATEI_PROGRAMME).map(objZeile)],
  [null, "datei-typen/endungen", "Dinge (Stufe 1) und neutrale Namen", null, ["Eintrag"], [...DT.DATEI_DINGE, ...DT.DATEI_NEUTRAL].map(objZeile)],
];
for (const [teilTitel, , titel, hinweis, kopf, zeilenListe] of RUNDE3) {
  if (teilTitel) { z(`## ${teilTitel}`); z(""); }
  tabelle(`### ${titel}`, hinweis, kopf, zeilenListe);
}

// LERN_Session8, Runde 4: Kindergarten
const GW = lade("spiele/gegenteil-wippe/woerter.js", ["GEGENTEIL_LISTEN"]).GEGENTEIL_LISTEN.gegenteile;
const TS = lade("spiele/tageslauf-sonne/woerter.js", ["TAETIGKEITEN", "WOCHENPLAN"]);
const RUNDE4 = [
  ["64. Gegenteil-Wippe (Lehrplan SG MA.3.A.1)", "gegenteil-wippe/gegenteile", "Bildpaare", "Erstes Bild hat MEHR davon (bei vorher: zuerst).", ["Merkmal", "mehr / zuerst", "weniger / danach"], GW.paare.map(objZeile)],
  [null, "gegenteil-wippe/gegenteile", "Gezeichnete Dinge", null, ["Eintrag"], (GW.gezeichnet || []).map(objZeile)],
  [null, "gegenteil-wippe/gegenteile", "Reihen zum Ordnen", null, ["Reihe"], (GW.reihen || []).map(objZeile)],
  ["65. Tageslauf-Sonne (Lehrplan SG MA.3.A.2, NMG.9.1)", "tageslauf-sonne/taetigkeiten", "Tätigkeiten", null, ["Bild", "Tätigkeit", "Tageszeit"], TS.TAETIGKEITEN.map(objZeile)],
  [null, "tageslauf-sonne/taetigkeiten", "Wochenplan (gestern, heute, morgen)", null, ["Bild", "Tätigkeit"], TS.WOCHENPLAN.map(objZeile)],
];
for (const [teilTitel, , titel, hinweis, kopf, zeilenListe] of RUNDE4) {
  if (teilTitel) { z(`## ${teilTitel}`); z(""); }
  tabelle(`### ${titel}`, hinweis, kopf, zeilenListe);
}

// LERN_Session9, Runde A: 6. Klasse, Übertritt
const SPUR = lade("spiele/sachtext-spurensuche/woerter.js", ["SPUREN_TEXTE"]).SPUREN_TEXTE;
const KORR = lade("spiele/korrektur-stift/woerter.js", ["KORREKTUR_TEXTE"]).KORREKTUR_TEXTE;
const HOER = lade("spiele/hoer-reporter/woerter.js", ["HOER_BERICHTE"]).HOER_BERICHTE;
const PROBE = lade("spiele/wortarten-probe/woerter.js", ["PROBE_SAETZE"]).PROBE_SAETZE;
/** Fragen als Zeilen „Art: Frage → richtig (falsch: …)“; die erste Antwort ist die richtige. */
const fragenText = fragen => fragen.map(([art, frage, richtig, ...falsch]) =>
  `${art}: ${frage} → ${richtig}${falsch.length ? ` (falsch: ${falsch.join("; ")})` : ""}`).join("<br>");
/** Fehlerstellen {richtig|falsch}: der richtige Text und die eingebauten Fehler. */
const korrekturText = t => t.replace(/\{([^|}]*)\|[^}]*\}/g, "$1");
const korrekturFehler = t => [...t.matchAll(/\{([^|}]*)\|([^}]*)\}/g)].map(m => `${m[2]} → ${m[1]}`).join("; ");
const RUNDE5 = [
  ["66. Sachtext-Spurensuche (Lehrplan SG D.2.B.1)", "sachtext-spurensuche/texte", "Sachtexte mit Fragen",
    "Selbst geschrieben. Sachangaben bitte nachprüfen. Bei „stimmt“: ja, nein oder „steht nicht im Text“.",
    ["Stufe", "Titel", "Text", "Fragen"], SPUR.map(t => [t.stufe, t.titel, zelle(t.text), fragenText(t.fragen || [])])],
  ["67. Korrektur-Stift (Lehrplan SG D.4.F.1, D.5.E.1)", "korrektur-stift/texte", "Texte und mögliche Fehlerstellen",
    "Richtiger Text; das Spiel baut je Aufgabe einige der Fehler ein.", ["Text", "Länge", "richtiger Text", "Fehler → richtig"],
    KORR.map(t => [t.id, t.laenge, zelle(korrekturText(t.text)), korrekturFehler(t.text)])],
  ["68. Hör-Reporter (Lehrplan SG D.1.B.1)", "hoer-reporter/berichte", "Berichte zum Vorlesen mit Fragen",
    "Selbst geschrieben; der Text wird vorgelesen, nicht gezeigt. Sachangaben bitte nachprüfen.",
    ["Gruppe", "Titel", "Text", "Fragen"], HOER.map(t => [t.gruppe, t.titel, zelle(t.text), fragenText(t.fragen || [])])],
  ["69. Wortarten-Probe (Lehrplan SG D.5.D.1)", "wortarten-probe/woerter", "Sätze mit markiertem Wort",
    "N Nomen, V Verb, A Adjektiv, P Pronomen, sonst Partikel; letzte Spalte: was die Probe zeigt.",
    ["Gruppe", "Satz", "Wortart", "Probe"], PROBE.map(objZeile)],
];
for (const [teilTitel, , titel, hinweis, kopf, zeilenListe] of RUNDE5) {
  if (teilTitel) { z(`## ${teilTitel}`); z(""); }
  tabelle(`### ${titel}`, hinweis, kopf, zeilenListe);
}

// LERN_Session10, Runde B: 3. Klasse
const PG = lade("spiele/platzhalter-geschichten/geschichten.js", ["PLATZHALTER_GESCHICHTEN"]).PLATZHALTER_GESCHICHTEN;
const ZSCH = lade("spiele/zeit-schaetzer/taetigkeiten.js", ["ZS_TAETIGKEITEN", "ZS_ZEITPUNKTE", "ZS_DAUERN"]);
const AE = lade("spiele/auge-entdecker/teile.js", ["AUGE_TEILE", "AUGE_PUPILLE", "AUGE_AUGEN", "AUGE_AUSSAGEN", "AUGE_WARUM", "AUGE_LICHTWEG"]);
const GH = lade("spiele/gemeinde-helfer/anliegen.js", ["GEMEINDE_EINRICHTUNGEN", "GEMEINDE_ANLIEGEN", "GEMEINDE_NOTRUF", "GEMEINDE_NOTRUF_EUROPA", "GEMEINDE_STELLEN", "GEMEINDE_STELLEN_ANLIEGEN", "GEMEINDE_EBENEN", "GEMEINDE_ABLAEUFE"]);
const GS = lade("spiele/gefuehle-radar/situationen.js", ["GS_GEFUEHLE", "GS_BILDER", "GS_SAETZE", "GS_SITUATIONEN", "GS_KOERPER", "GS_GESPRAECHE", "GS_PAARE", "GS_REAKTIONEN"]);
const GO = lade("spiele/geschichten-ordner/geschichten.js", ["GESCHICHTEN"]).GESCHICHTEN;
const HG = lade("spiele/hoer-geschichte/geschichten.js", ["HOER_GESCHICHTEN"]).HOER_GESCHICHTEN;
/** Fragen „Art: Frage → richtig (falsch: …)“; richtig darf eine Liste sein (Reihenfolge). */
const fragenText6 = fragen => fragen.map(([art, frage, richtig, ...falsch]) =>
  `${art}: ${frage} → ${zelle(richtig)}${falsch.length ? ` (falsch: ${falsch.map(zelle).join("; ")})` : ""}`).join("<br>");
/** Platzhalter-Vorlagen: je Variante eine Zeile. */
const pgZeilen = PG.flatMap(g => (g.varianten || [g]).map(v => [g.g, g.bild || "", v.text, zelle(v.gl), zelle(g.zahlen), g.abgeleitet ? zelle(g.abgeleitet) : ""]));
const gsName = id => GS.GS_GEFUEHLE.find(g => g.id === id)?.wort || id;
const RUNDE6 = [
  ["70. Platzhalter-Geschichten (Lehrplan SG MA.3.C.2, MA.3.C.3)", "platzhalter-geschichten/geschichten", "Vorlagen mit Platzhalter-Gleichungen",
    "Selbst geschrieben. {a}, {b} … werden durch Zahlen aus den Bereichen ersetzt; [x] ist die Lücke. Gruppe 1 bis 20, 2 bis 100, 3 bis 1000, 4 Zweischritt bis 10 000.",
    ["Gruppe", "Bild", "Text", "Gleichung", "Zahlen", "abgeleitet"], pgZeilen],
  ["71. Zeit-Schätzer (Lehrplan SG MA.3.A.1, NMG.9.1)", "zeit-schaetzer/taetigkeiten", "Tätigkeiten mit ungefährer Dauer",
    "Dauer als Zahl und Einheit, dazu die Spanne in Sekunden, innerhalb derer die Dauer als richtig gilt. Bitte prüfen, ob die Dauern für Kinder stimmen.",
    ["Bild", "Tätigkeit", "Dauer", "Einheit", "Spanne (s)"], ZSCH.ZS_TAETIGKEITEN.map(([bild, name, zahl, einheit, von, bis]) => [bild, name, zahl, einheit, `${von}–${bis}`])],
  ["", "zeit-schaetzer/taetigkeiten", "Zeitpunkt-Sätze", "Gruppe 1 klar, 2 knifflig.", ["Gruppe", "Satz"], ZSCH.ZS_ZEITPUNKTE],
  ["", "zeit-schaetzer/taetigkeiten", "Zeitdauer-Sätze", "Gruppe 1 klar, 2 knifflig („In 5 Minuten geht es los.“ zählt als Dauer).", ["Gruppe", "Satz"], ZSCH.ZS_DAUERN],
  ["72. Auge-Entdecker (Lehrplan SG NMG.4.3)", "auge-entdecker/teile", "Teile des Auges",
    "Lage, Aufgaben und Aussehen sind die Tipps im Spiel. Gruppe aussen (NMG.4.3.c), innen (NMG.4.3.e), weg (Weg des Lichts).",
    ["Name", "Gruppe", "Lage", "Aufgaben", "Aussehen"], AE.AUGE_TEILE.map(t => [`${t.artikel} ${t.name}${t.zusatz ? ` (${t.zusatz})` : ""}`, t.gruppe, t.lage, zelle(t.aufgaben), t.aussehen])],
  ["", "auge-entdecker/teile", "Pupille", null, ["Satz", "Antwort"], [...AE.AUGE_PUPILLE, ...AE.AUGE_AUGEN]],
  ["", "auge-entdecker/teile", "Aussagen (stimmt / stimmt nicht)", "Fakten bitte nachprüfen.", ["Aussage", "stimmt", "Erklärung"], AE.AUGE_AUSSAGEN],
  ["", "auge-entdecker/teile", "Warum-Fragen", "Die erste Antwort ist die richtige.", ["Frage", "richtig", "falsch", "falsch", "Tipp"], AE.AUGE_WARUM],
  ["", "auge-entdecker/teile", "Weg des Lichts", null, ["Reihenfolge"], [[AE.AUGE_LICHTWEG.join(" → ")]]],
  ["73. Gemeinde-Helfer (Lehrplan SG NMG.10.3)", "gemeinde-helfer/anliegen", "Einrichtungen",
    "Ebene: Gemeinde, Kanton oder Bund (leer = je nach Ort verschieden). Was je Gemeinde abweicht, bitte markieren.",
    ["Bild", "Name", "tut", "öffentlich", "Ebene"], GH.GEMEINDE_EINRICHTUNGEN.map(e => [e.bild, e.name, e.tut, e.oeffentlich, e.ebene || ""])],
  ["", "gemeinde-helfer/anliegen", "Anliegen", "Kurzform für Stufe 1; Ablenker = der nächstliegende falsche Korb.",
    ["Satz", "Kurzform", "Einrichtung", "Schwierigkeit", "Ablenker"], GH.GEMEINDE_ANLIEGEN.map(a => [a.satz, a.kurz || "", a.ziel, a.schwierigkeit, a.ablenker || ""])],
  ["", "gemeinde-helfer/anliegen", "Notrufnummern", "Bitte prüfen (Schweiz).", ["Nummer", "Stelle", "Situationen"],
    [...GH.GEMEINDE_NOTRUF.map(n => [n.nummer, n.name, zelle(n.situationen)]), [GH.GEMEINDE_NOTRUF_EUROPA.nummer, "Europa", GH.GEMEINDE_NOTRUF_EUROPA.frage]]],
  ["", "gemeinde-helfer/anliegen", "Zuständige Stellen", null, ["Satz", "Stelle", "Ablenker"], GH.GEMEINDE_STELLEN_ANLIEGEN.map(a => [a.satz, a.ziel, a.ablenker || ""])],
  ["", "gemeinde-helfer/anliegen", "Gemeinde, Kanton oder Bund", "Annahme für SG; bitte prüfen.", ["Bild", "Name", "Ebene"], GH.GEMEINDE_EBENEN.map(e => [e.bild, e.name, e.ebene])],
  ["", "gemeinde-helfer/anliegen", "Abläufe (Königsstufe)", "Stark vereinfacht.", ["Titel", "Schritte"], GH.GEMEINDE_ABLAEUFE.map(a => [a.titel, a.schritte.map(s => s.text).join(" → ")])],
  ["74. Gefühle-Radar (Lehrplan SG D.1.C.1)", "gefuehle-radar/situationen", "Gefühle", null,
    ["Wort", "Bild", "Gruppe", "Ablenker"], GS.GS_GEFUEHLE.map(g => [g.wort, g.gesichter ? g.gesichter.join(" ") : g.bild, g.gruppe, g.ablenker.map(gsName).join(", ")])],
  ["", "gefuehle-radar/situationen", "Bild-Situationen (Stufe 1)", null, ["Bild", "Text", "Gefühl"], GS.GS_BILDER.map(b => [b.bild, b.text, gsName(b.gefuehl)])],
  ["", "gefuehle-radar/situationen", "Sätze (Stufe 2)", null, ["Satz", "Gefühl", "Ablenker"], GS.GS_SAETZE.map(s => [s.satz, gsName(s.gefuehl), s.ablenker.map(gsName).join(", ")])],
  ["", "gefuehle-radar/situationen", "Situationen (Stufe 3 und 4)", "Jede Situation muss eindeutig sein.",
    ["Gruppe", "Text", "Wer", "Gefühl", "Ablenker", "Tipp"], GS.GS_SITUATIONEN.map(s => [s.gruppe, s.text, s.wer, gsName(s.gefuehl), s.ablenker.map(gsName).join(", "), s.tipp || ""])],
  ["", "gefuehle-radar/situationen", "Körpersignale", null, ["Satz", "Gefühl", "Ablenker"], GS.GS_KOERPER.map(s => [s.satz, gsName(s.gefuehl), s.ablenker.map(gsName).join(", ")])],
  ["", "gefuehle-radar/situationen", "Gespräche (Stufe 5)", "Die erste Hilfe ist die passende.",
    ["A", "B", "Gefühl von B", "passende Hilfe", "unpassend"], GS.GS_GESPRAECHE.map(g => [g.a.join(": "), g.b.join(": "), gsName(g.gefuehl), g.hilfe.richtig, g.hilfe.falsch.join("; ")])],
  ["", "gefuehle-radar/situationen", "Zwei Gefühle zugleich (Königsstufe)", null, ["Text", "Paar", "Ablenker-Paare", "Tipp"],
    GS.GS_PAARE.map(p => [p.text, p.paar.map(gsName).join(" und "), p.ablenker.map(a => a.map(gsName).join(" und ")).join("; "), p.tipp || ""])],
  ["", "gefuehle-radar/situationen", "Passende Antwort (Königsstufe)", null, ["Situation", "richtig", "falsch"], GS.GS_REAKTIONEN.map(r => [r.text, r.richtig, r.falsch.join("; ")])],
  ["75. Geschichten-Ordner (Lehrplan SG D.4.D.1, D.3.B.1)", "geschichten-ordner/geschichten", "Geschichten in Schritten",
    "Die Reihenfolge muss zwingend sein. Gruppe 1 mit Bild und Wort, 2 mit einem Satz, der nicht dazugehört, 3 fünf bis sechs Schritte.",
    ["Gruppe", "Titel", "Schritte", "gehört nicht dazu", "Tipp"], GO.map(g => [g.gruppe, g.titel, g.schritte.map((s, i) => `${i + 1}. ${s.bild ? s.bild + " " : ""}${s.satz}`).join("<br>"), g.ablenker || "", g.tipp || ""])],
  ["76. Hör-Geschichte (Lehrplan SG D.1.B.1)", "hoer-geschichte/geschichten", "Geschichten zum Vorlesen mit Fragen",
    "Selbst geschrieben; der Text wird vorgelesen, nicht gezeigt.", ["Gruppe", "Titel", "Text", "Fragen"], HG.map(t => [t.gruppe, t.titel, zelle(t.text), fragenText6(t.fragen || [])])],
];
for (const [teilTitel, , titel, hinweis, kopf, zeilenListe] of RUNDE6) {
  if (teilTitel) { z(`## ${teilTitel}`); z(""); }
  tabelle(`### ${titel}`, hinweis, kopf, zeilenListe);
}

// LERN_Session10, Runde C: Rest der Liste (S8, S9, S14, S15, T9–T11)
const DW = lade("spiele/diagramm-wahl/daten.js", ["DIAGRAMM_DATEN"]).DIAGRAMM_DATEN;
const GATT = lade("spiele/gattungs-kenner/texte.js", ["GATTUNGEN", "GATTUNG_TEXTE"]);
const FSZ = lade("spiele/figuren-spiegel/szenen.js", ["SPIEGEL_SZENEN"]).SPIEGEL_SZENEN;
const KK = lade("spiele/kulturen-koffer/dinge.js", ["KK_KULTUREN", "KK_DINGE", "KK_HEUTE", "KK_SAETZE", "KK_AUSSAGEN", "KK_GAB", "KK_QUELLENARTEN", "KK_QUELLEN", "KK_RAETSEL"]);
const HD = lade("spiele/hello-dialog/dialoge.js", ["DIALOG_S1_ANTWORTEN", "DIALOG_SITUATIONEN", "DIALOG_PAARE", "DIALOG_FRAGEN", "DIALOG_DIALOGE", "DIALOG_HOEFLICH"]);
const LW = lade("spiele/laerm-waechter/geraeusche.js", ["LAERM_GERAEUSCHE", "LAERM_ORTE", "LAERM_SCHUTZ", "LAERM_SITUATIONEN", "LAERM_SCHADET", "LAERM_OHR_TEILE", "LAERM_SCHWINGT", "LAERM_PHAENOMENE", "LAERM_DAEMPFER"]);
const gattungName = id => GATT.GATTUNGEN[id]?.name || id;
const kulturName = id => KK.KK_KULTUREN.find(k => k.id === id)?.name || id;
const RUNDE7 = [
  ["77. Diagramm-Wahl (Lehrplan SG MA.3.A.1, MA.3.C.1)", "diagramm-wahl/daten", "Säulendiagramme",
    "Alle Zahlen erfunden. Kategorien: Bild, Name, Wert (bei zwei Gruppen zwei Werte). „offen“: Aussagen, die man aus dem Diagramm nicht beurteilen kann.",
    ["Titel", "Einheit", "Gruppen", "Kategorien", "Frage zur Wahl", "Grund", "offene Aussagen"],
    DW.saeulen.map(d => [d.titel, d.einheit, (d.gruppen || []).join(" / "), d.kategorien.map(k => `${k[0]} ${k[1]}: ${k.slice(2).join(" / ")}`).join("<br>"), d.wahl.frage, d.wahl.grund, (d.offen || []).join("<br>")])],
  ["", "diagramm-wahl/daten", "Kreisdiagramme", "Teile als Zähler zum Nenner (Hälften, Viertel, Achtel, Drittel, Prozent).",
    ["Titel", "Nenner", "Teile", "Frage zur Wahl", "Grund"], DW.kreis.map(d => [d.titel, d.nenner, d.teile.map(t => `${t[0]} ${t[1]}: ${t[2]}`).join("<br>"), d.wahl.frage, d.wahl.grund])],
  ["", "diagramm-wahl/daten", "Liniendiagramme", "x-Beschriftung und Werte; „ungleich“ ist die irreführende Zeitachse der Königsstufe.",
    ["Titel", "Grösse", "Einheit", "x", "Werte", "x ungleich", "Frage zur Wahl", "Grund", "offene Aussagen"],
    DW.linien.map(d => [d.titel, d.groesse, d.einheit, d.x.join(", "), d.werte.join(", "), (d.xUngleich || []).join(", "), d.wahl.frage, d.wahl.grund, (d.offen || []).join("<br>")])],
  ["78. Gattungs-Kenner (Lehrplan SG D.6.C.1)", "gattungs-kenner/texte", "Merkmale je Gattung", "Frage = Tipp 2, Suchhinweis = Tipp 3.",
    ["Gattung", "Merkmal", "Kurz", "Frage", "Suchhinweis"],
    Object.entries(GATT.GATTUNGEN).flatMap(([id, g]) => Object.values(g.merkmale || {}).map(m => [g.name, m.name, m.kurz, m.frage, m.such]))],
  ["", "gattungs-kenner/texte", "Texte", "Alle selbst geschrieben. Merkmalszeile: die Zeile, die das Merkmal zeigt (Nummer ab 1). Bei Mischtexten der fremde Satz und seine Gattung.",
    ["Gattung", "Titel", "Zeilen", "Merkmal (Art, Zeile)", "Lehre / Typisch / Figuren", "fremder Satz"],
    GATT.GATTUNG_TEXTE.map(t => [gattungName(t.gattung), t.titel, t.zeilen.map((zl, i) => `${i + 1}. ${zl}`).join("<br>"),
      t.fremd === undefined ? `${t.art}, Zeile ${(t.merkmal ?? 0) + 1}${t.partner !== undefined ? ` (Partner ${t.partner + 1})` : ""}` : "",
      t.moral ? `Lehre: ${t.moral[0]} (falsch: ${t.moral.slice(1).join("; ")})` : t.typisch ? `Typisch: ${t.typisch[0]} (falsch: ${t.typisch.slice(1).join("; ")})` : t.figuren ? t.figuren.map(f => f.join(" = ")).join("; ") : "",
      t.fremd !== undefined ? `Zeile ${t.fremd + 1} (${gattungName(t.fremdGattung)}, ${t.fremdArt})` : ""])],
  ["79. Figuren-Spiegel (Lehrplan SG D.2.C.1)", "figuren-spiegel/szenen", "Szenen mit Fragen",
    "Alle selbst geschrieben. Arten: gefuehl, stimmung, grund (steht im Text), motiv (erschliessen), sicht, meinen, weiter, ich, lebenswelt. Die erste Antwort ist die richtige.",
    ["Gruppe", "Titel", "Figuren", "Text", "Fragen"], FSZ.map(s => [s.gruppe, s.titel, s.figuren.join(", "), zelle(s.text), fragenText6(s.fragen || [])])],
  ["80. Kulturen-Koffer (Lehrplan SG NMG.9.3)", "kulturen-koffer/dinge", "Kulturen", "Fakten bitte nachprüfen.",
    ["Bild", "Name", "Schweiz", "Kurztext"], KK.KK_KULTUREN.map(k => [k.bild, k.name, k.schweiz, k.kurz])],
  ["", "kulturen-koffer/dinge", "Dinge, Bauten, Berufe", "„auch“: weitere Kulturen, bei denen das Ding vorkam (stehen nie als Korb daneben). „ab“: ab Stufe.",
    ["Bild", "Name", "Kultur", "Art", "ab", "auch", "Umschreibung"], KK.KK_DINGE.map(d => [d.bild, d.name, kulturName(d.kultur), d.art, d.ab, (d.auch || []).map(kulturName).join(", "), d.umschreibung])],
  ["", "kulturen-koffer/dinge", "Dinge von heute (Stufe 1)", null, ["Bild", "Name", "Umschreibung"], KK.KK_HEUTE.map(d => [d.bild, d.name, d.umschreibung])],
  ["", "kulturen-koffer/dinge", "Erzählsätze", null, ["Satz", "Kultur"], KK.KK_SAETZE.map(s => [s.satz, kulturName(s.kultur)])],
  ["", "kulturen-koffer/dinge", "Aussagen (stimmt / stimmt nicht)", "Fakten bitte nachprüfen.", ["Aussage", "stimmt", "Kultur", "Begründung"], KK.KK_AUSSAGEN.map(a => [a.text, a.wahr, kulturName(a.kultur), a.grund])],
  ["", "kulturen-koffer/dinge", "Gab es das damals schon?", "Fakten bitte nachprüfen.", ["Bild", "Ding", "Kultur", "gab es", "Begründung"], KK.KK_GAB.map(g => [g.bild, g.ding, kulturName(g.kultur), g.ja, g.grund])],
  ["", "kulturen-koffer/dinge", "Quellen (Stufe 5)", "Quellenart: Fundstück, Bauwerk, Bild, Text.", ["Bild", "Quelle", "Art", "Kultur"], KK.KK_QUELLEN.map(q => [q.bild, q.text, KK.KK_QUELLENARTEN[q.art]?.name || q.art, kulturName(q.kultur)])],
  ["", "kulturen-koffer/dinge", "Rätsel (Königsstufe)", "Drei Hinweise, vom allgemeinen zum genauen.", ["Kultur", "Hinweise"], KK.KK_RAETSEL.map(r => [kulturName(r.kultur), r.hinweise.join("<br>")])],
  ["81. Hello-Dialog (Lehrplan SG FS1E.3.A.1)", "hello-dialog/dialoge", "Situationen (Stufe 1)", "Britisches Englisch. Die Stimme spricht die Zeile; das Kind wählt den Gruss.",
    ["Bild", "Situation", "Zeile", "richtiger Gruss", "Tipp"], HD.DIALOG_SITUATIONEN.map(s => [s[0], s[1], s[2], HD.DIALOG_S1_ANTWORTEN[s[3]]?.[0] || s[3], s[4]])],
  ["", "hello-dialog/dialoge", "Zeile und Antwort (Stufe 2)", "Falsche Antworten passen zu einer anderen Zeile.", ["Zeile", "Antwort", "falsch", "Tipp"], HD.DIALOG_PAARE.map(p => [p[0], p[1], p[2].join("; "), p[3]])],
  ["", "hello-dialog/dialoge", "Fragen und Antworten (Stufe 4 und 5)", "Gruppe 4: Name, Alter …; Gruppe 5: Datum, Zeit, Farbe, Befinden, Wetter. Thema = Gegenseitig eindeutig.",
    ["Gruppe", "Thema", "Frage", "Antwort"], HD.DIALOG_FRAGEN],
  ["", "hello-dialog/dialoge", "Dialoge (Stufe 3, 5 und 6)", "Züge in der richtigen Reihenfolge; „falsch“ sind fremde Zeilen für „Welcher Satz passt nicht?“.",
    ["Gruppe", "Bild", "Ort", "Züge", "fremde Zeilen", "Tipp"], HD.DIALOG_DIALOGE.map(d => [d.gruppe, d.bild, d.ort, d.zuege.join("<br>"), (d.falsch || []).join("; "), d.tipp || ""])],
  ["", "hello-dialog/dialoge", "Höflich antworten (Königsstufe)", "Die zweite Antwort ist unhöflich, die dritte passt nicht.",
    ["Bild", "Zeile", "richtig", "unhöflich", "passt nicht", "Tipp"], HD.DIALOG_HOEFLICH],
  ["82. Lärm-Wächter (Lehrplan SG NMG.4.2)", "laerm-waechter/geraeusche", "Geräusche", "Lärm-Skala 1 (sehr leise) bis 5 (sehr laut), grobe Reihung.",
    ["Bild", "Geräusch", "laut", "Dauer", "Ort"], LW.LAERM_GERAEUSCHE.map(g => [g.bild, g.name, g.laut, g.dauer, g.ort])],
  ["", "laerm-waechter/geraeusche", "Orte", null, ["Bild", "Ort", "laut"], LW.LAERM_ORTE.map(o => [o.bild, o.name, o.laut])],
  ["", "laerm-waechter/geraeusche", "Schutzmassnahmen", "Wirkung 2 hilft gut, 1 ein wenig, 0 nicht.",
    ["Bild", "Name", "Wirkung", "Umschreibung", "Hinweis"], LW.LAERM_SCHUTZ.map(s => [s.bild, s.name, s.wirkung, s.umschreibung, s.hinweis || ""])],
  ["", "laerm-waechter/geraeusche", "Situationen mit Schutz", "„schutz“ hilft gut, „wenig“ ein wenig; alles andere nicht.",
    ["Bild", "Situation", "laut", "Dauer", "Schutz", "wenig", "Tipp"], LW.LAERM_SITUATIONEN.map(s => [s.bild, s.text, s.laut, s.dauer, s.schutz.join(", "), (s.wenig || []).join(", "), s.tipp || ""])],
  ["", "laerm-waechter/geraeusche", "Schadet das den Ohren?", null, ["Satz", "schadet", "Begründung"], LW.LAERM_SCHADET],
  ["", "laerm-waechter/geraeusche", "Teile des Ohrs", null, ["Name", "Lage", "Aufgabe", "Aussehen"], LW.LAERM_OHR_TEILE.map(t => [`${t.artikel} ${t.name}`, t.lage, t.aufgabe, t.aussehen])],
  ["", "laerm-waechter/geraeusche", "Schwingung und Ton (stimmt / stimmt nicht)", null, ["Aussage", "stimmt", "Erklärung"], LW.LAERM_SCHWINGT],
  ["", "laerm-waechter/geraeusche", "Echo, Verstärkung, Dämmung", "Die erste Antwort ist die richtige.", ["Art", "Bild", "Frage", "richtig", "falsch", "Tipp"], LW.LAERM_PHAENOMENE.map(p => [p.art, p.bild, p.frage, p.richtig, p.falsch.join("; "), p.tipp || ""])],
  ["", "laerm-waechter/geraeusche", "Was dämpft den Schall?", null, ["Bild", "Stoff", "dämpft"], LW.LAERM_DAEMPFER.map(d => [d.bild, d.name, d.daempft])],
];
for (const [teilTitel, , titel, hinweis, kopf, zeilenListe] of RUNDE7) {
  if (teilTitel) { z(`## ${teilTitel}`); z(""); }
  tabelle(`### ${titel}`, hinweis, kopf, zeilenListe);
}

// LERN_Session11: Strategie-Rätsel — nur König in der Falle hat eine Inhaltsliste (Stein-Duell und Steine fangen
// erzeugen ihre Stellungen und prüfen sie mit der eigenen Regel-Maschine).
const KOENIG_FALLE = lade("spiele/koenig-falle/stellungen.js", ["STELLUNGEN"]);
const RUNDE8 = [
  ["83. König in der Falle (Lehrplan SG MI.2.2)", "koenig-falle/stellungen", "Schachstellungen",
    "Selbst gebaut und von der Regel-Maschine geprüft (genau ein Mattzug, s6 Matt in 2). Zu prüfen: wirkt die Stellung natürlich, passt der Hinweis? FEN: Weiss gross, Schwarz klein, von Reihe 8 nach Reihe 1.",
    ["Stufe", "Stellung (FEN)", "Hinweis", "Lösung"], KOENIG_FALLE.STELLUNGEN.map(s => [s.stufe, s.fen.split(" ")[0], s.hinweis, s.loesung])],
];
for (const [teilTitel, , titel, hinweis, kopf, zeilenListe] of RUNDE8) {
  if (teilTitel) { z(`## ${teilTitel}`); z(""); }
  tabelle(`### ${titel}`, hinweis, kopf, zeilenListe);
}

const MARKDOWN = zeilen.join("\n");
if (!PRUEFE) process.stdout.write(MARKDOWN);

// ---------- Inhalte je Liste: docs/eulenpfad/pruefung/listen.json ----------
// Je Quell-Liste des Katalogs („<spiel>/<liste>“) die Einträge, die das Spiel zeigt, wenn nur diese
// Liste frei ist (Zusatzlisten: ihre eigenen Einträge). Zuordnung wie im Code der Spiele.

const katalog = vm.createContext({ LS: { SKALA: [] } });
vm.runInContext(`${fs.readFileSync(path.join(wurzel, "spiele/gemeinsam/katalog.js"), "utf8")};this.SPIELE = SPIELE;`, katalog);
const QUELL_LISTEN = Object.fromEntries(katalog.SPIELE.flatMap(s => Object.entries(s.listen || {})
  .filter(([, l]) => !l.von).map(([id, l]) => [`${s.id}/${id}`, l.name])));

const listen = {};
const text = x => (x === null || x === undefined ? "" : String(x));
/** Eine Tabelle zur Liste „<spiel>/<liste>“; Zellen als Strings. */
function inListe(schluessel, titel, hinweis, kopf, zeilenListe) {
  if (!QUELL_LISTEN[schluessel]) throw new Error(`Liste ${schluessel} steht nicht im Katalog`);
  listen[schluessel] ??= { name: QUELL_LISTEN[schluessel], tabellen: [] };
  listen[schluessel].tabellen.push({ titel, hinweis: hinweis || null, kopf, zeilen: zeilenListe.map(z => z.map(text)) });
}
/** Wie teil(): ein Objekt { gruppe: [...] } wird je Gruppe zu einer Tabelle. */
const inListeTeil = (schluessel, titel, hinweis, kopf, daten) => {
  if (!Array.isArray(daten) && Object.values(daten).every(Array.isArray) && Object.values(daten).every(v => v.every(Array.isArray))) {
    for (const [gruppe, liste] of Object.entries(daten)) inListe(schluessel, `${titel} — ${gruppe}`, hinweis, kopf, zeilenVon(liste));
  } else inListe(schluessel, titel, hinweis, kopf, zeilenVon(daten));
};

// Wortarten-Sortierer: einzelwoerter = WOERTER, sonst SAETZE[liste]
inListe("wortarten-sortierer/einzelwoerter", "Einzelwörter", "In Stufe 2 alles klein geschrieben.", ["Nomen", "Verb", "Adjektiv"],
  Array.from({ length: n }, (_, i) => [WOERTER.N[i], WOERTER.V[i], WOERTER.A[i]]));
for (const [liste, saetze] of Object.entries(SAETZE)) inListe(`wortarten-sortierer/${liste}`, STUFE[liste], "Abgefragt werden nur die Wörter in „…“.", ["Satz", "Wortarten"],
  saetze.map(satz => [satz.replace(/\[([^|]+)\|[NVA]\]/g, "„$1“"), [...satz.matchAll(/\[([^|]+)\|([NVA])\]/g)].map(m => `${m[1]} = ${ART[m[2]]}`).join("; ")]));

// Regel-Lücke: je Regel eine Liste (Schlüssel in REGELN), die Ausnahmen der ie-Regel eigens (AUSNAHMEN_LISTE im Spiel)
const regelZeilen = woerter => woerter.map(([t, bild]) => { const m = t.match(/^(.*)\{([^|]+)\|([^}]+)\}(.*)$/); return [m[1] + m[2] + m[4], m[2], m[1] + m[3] + m[4], bild]; });
for (const [id, r] of Object.entries(REGELN)) inListe(`regel-luecke/${id}`, r.name, `Regel im Spiel: ${r.regel}`, ["Wort", "richtig", "falsche Auswahl", "Bild"], regelZeilen(r.woerter));
inListe("regel-luecke/ie-ausnahmen", `${REGELN["ie-i"].name} — Ausnahmen`, "Nur in Stufe 5–6.", ["Wort", "richtig", "falsche Auswahl", "Bild"], regelZeilen(REGELN["ie-i"].ausnahmen));

// Satz-Reparatur: SAETZE[gruppe] je SAETZE_LISTEN (die Liste des Wörter-Trenners verweist hierher)
const { SAETZE_LISTEN } = lade("spiele/satz-reparatur/saetze.js", ["SAETZE_LISTEN"]);
for (const [gruppe, liste] of Object.entries(SAETZE_LISTEN)) {
  const punkt = AUCH_PUNKT.filter(s => SATZ[gruppe].some(x => x.includes(s)));
  inListe(`satz-reparatur/${liste}`, SATZ_STUFE[gruppe], punkt.length ? `Auch ein Punkt gilt als richtig bei: ${punkt.map(s => `„${s}“`).join(", ")}` : null, ["Satz"], SATZ[gruppe].map(s => [s]));
}

// Word-Match: Themen mit dem Feld „liste“ (Familie und Körper teilen eine Liste), dazu die Wendungen
for (const t of Object.values(THEMEN_EN)) inListe(`word-match/${t.liste}`, t.name, null, ["Englisch", "Deutsch", "Bild"], t.woerter);
inListe("word-match/wendungen", "Phrases", null, ["Englisch", "Deutsch"], WENDUNGEN_EN);

// Silben-Klatscher, Reim-Paare, ABC-Sortierer
for (const [liste, woerter] of Object.entries(SILBEN_WOERTER)) inListe(`silben-klatscher/${liste}`, "Wörter", "Sprechsilben, wie man sie klatscht.", ["Wort", "Silben", "Anzahl", "Bild"],
  woerter.map(([g, bild]) => [g.replace(/-/g, ""), g, g.split("-").length, bild]));
inListe("reim-paare/reimgruppen", "Reimgruppen", "Wörter ohne Bild kommen erst ab Stufe 4 vor.", ["Reimgruppe"], REIMGRUPPEN.map(g => [g.map(([w, b]) => (b ? `${b} ${w}` : w)).join(" – ")]));
inListe("reim-paare/reimverse", "Verse", "Ist nur diese Liste frei, sind die Lösungswörter der anderen Verse die Auswahl.", ["Vers"], REIMVERSE.map(([vers, wort]) => [vers.replace("___", `„${wort}“`)]));
inListe("abc-sortierer/nomen-bild", "Nomen mit Bild", null, ["Wort", "Bild"], ABC_WOERTER);

// Tier-Sortierer: je Spalte von tiere.js eine Liste (TIER_LISTE_JE_MERKMAL), nur Tiere (keine Pflanzen, Pilze)
const NUR_TIERE = TIERE.filter(t => !["Pflanze", "Pilz"].includes(t[2]));
const KNIFFLIG_HINWEIS = "Die knifflige Auswahl (richtige und naheliegende falsche Gruppe) steht im Spielcode (KNIFFLIG).";
inListe("tier-sortierer/tierklassen", "Tierklassen", KNIFFLIG_HINWEIS, ["Name", "Bild", "Klasse"], NUR_TIERE.map(([name, bild, klasse]) => [name, bild, klasse]));
inListe("tier-sortierer/saeugetier-gruppen", "Gruppen der Säugetiere", KNIFFLIG_HINWEIS, ["Name", "Bild", "Gruppe (Säugetiere)"], NUR_TIERE.filter(t => t[3]).map(([name, bild, , gruppe]) => [name, bild, gruppe]));
inListe("tier-sortierer/haltung", "Haltung", "Tiere ohne eindeutige Haltung kommen nicht vor.", ["Name", "Bild", "Haltung"], NUR_TIERE.filter(t => t[4]).map(([name, bild, , , haltung]) => [name, bild, haltung]));

// Lebensraum: je Lebensraum eine Liste (LEBENSRAUM_LISTE_JE_RAUM), Tiere und Pflanzen; dazu die Nahrungsketten
const { LEBENSRAUM_LISTE_JE_RAUM } = lade("spiele/lebensraum/nahrung.js", ["LEBENSRAUM_LISTE_JE_RAUM"]);
for (const [raum, liste] of Object.entries(LEBENSRAUM_LISTE_JE_RAUM)) inListe(`lebensraum/${liste}`, `Lebensraum ${raum}`, null, ["Name", "Bild", "Klasse", "Lebensraum"],
  TIERE.filter(t => t[5] === raum).map(([name, bild, klasse, , , r]) => [name, bild, klasse, r]));
inListe("lebensraum/nahrungsketten", "Nahrungsketten — lies: … wird gefressen von …", null, ["Kette"], NAHRUNGSKETTEN.map(k => [k.map(([name]) => name).join(" → ")]));
inListe("lebensraum/nahrungsketten", "Artikel für „Was frisst …?“", null, ["Name", "Artikel"], Object.entries(ARTIKEL));

// Fledermaus-Forscher: je Konstante eine Liste
inListe("fledermaus-forscher/aussagen", "Aussagen „Stimmt das?“", null, ["ab Stufe", "Aussage", "stimmt?", "Erklärung im Spiel"], FLEDER.FLEDERMAUS_AUSSAGEN.map(([ab, t, s, e]) => [ab, t, s ? "ja" : "nein", e]));
inListe("fledermaus-forscher/fragen", "Fragen mit Auswahl", null, ["ab Stufe", "Frage", "richtig", "falsch", "Erklärung"], FLEDER.FLEDERMAUS_FRAGEN.map(([ab, f, r, f1, f2, e]) => [ab, f, r, `${f1}; ${f2}`, e]));
inListe("fledermaus-forscher/jahr", "Jahr der Fledermaus (Reihenfolge)", null, ["Zeit", "was"], FLEDER.FLEDERMAUS_JAHR);
inListe("fledermaus-forscher/anpassungen", "Merkmal und Nutzen", "Jeder Nutzen darf nur zu einem Merkmal passen.", ["Merkmal", "Nutzen"], FLEDER.FLEDERMAUS_ANPASSUNGEN);

// Schätz-Waage: Vergleiche, Reihen; Schätzfragen je Einheit der richtigen Antwort (SCHAETZ_LISTEN)
const { SCHAETZ_LISTEN } = lade("spiele/schaetz-waage/groessen.js", ["SCHAETZ_LISTEN"]);
inListe("schaetz-waage/vergleiche", "Vergleichen", null, ["Eigenschaft", "grösser", "kleiner"], SCHAETZ.VERGLEICHE.map(([e, a, b]) => [e, `${a[0]} ${a[1]}`, `${b[0]} ${b[1]}`]));
inListe("schaetz-waage/reihen", "Ordnen", null, ["Richtung", "Reihe"], SCHAETZ.REIHEN.map(([r, d]) => [r, d.map(x => `${x[0]} ${x[1]}`).join(" → ")]));
for (const [liste, einheiten] of Object.entries(SCHAETZ_LISTEN)) inListe(`schaetz-waage/${liste}`, "Referenzgrössen", null, ["Stufe", "Frage", "richtig", "falsch"],
  frage3(SCHAETZ.SCHAETZFRAGEN.filter(f => einheiten.includes(f[2].split(" ")[1]))));

// Rechengeschichten und Lese-Detektiv: je Stufe der Daten eine Liste
const { GESCHICHTEN_LISTEN } = lade("spiele/rechengeschichten/geschichten.js", ["GESCHICHTEN_LISTEN"]);
for (const [stufe, liste] of Object.entries(GESCHICHTEN_LISTEN)) inListe(`rechengeschichten/${liste}`, "Geschichten", "Platzhalter {a}, {b} … werden im Spiel durch Zahlen aus den Bereichen ersetzt; {b:wird|werden} heisst: „wird“, wenn b = 1 ist, sonst „werden“.",
  ["Stufe", "Geschichte", "Zahlen", "richtige Rechnung", "Ablenker"],
  GESCHICHTEN.filter(g => g.stufe === Number(stufe)).map(g => [g.stufe, g.text, Object.entries(g.zahlen).map(([k, [a, b]]) => `${k}: ${a}–${b}`).concat(Object.entries(g.abgeleitet || {}).map(([k, v]) => `${k} = ${v}`)).join(", "),
    g.richtig || g.rechnung, (g.falsch || []).join("; ") || `(nicht gebraucht: ${g.unwichtig})`]));
const { LESETEXTE_LISTEN } = lade("spiele/lese-detektiv/texte.js", ["LESETEXTE_LISTEN"]);
for (const [stufe, liste] of Object.entries(LESETEXTE_LISTEN)) inListe(`lese-detektiv/${liste}`, "Texte", "Die Namen in den Texten sind erfunden.", ["Stufe", "Titel", "Text", "Frage", "richtig", "falsch"],
  LESETEXTE.filter(t => t[0] === Number(stufe)).map(([s, t, txt, f, r, a, b]) => [s, t, txt, f, r, `${a}; ${b}`]));

// Anlaut-Angel, Buchstaben-Zwillinge, Blitzlesen, Nomen-Puzzle
inListe("anlaut-angel/anlaut", "Anlaut = erster Buchstabe", null, ["Wort", "Bild"], ANLAUT.ANLAUT_WOERTER);
inListe("anlaut-angel/endlaut", "Endlaut = letzter Buchstabe", null, ["Wort", "Bild", "Endlaut"], ANLAUT.ENDLAUT_WOERTER.map(([w, b]) => [w, b, w.slice(-1)]));
inListe("anlaut-angel/mitte", "Selbstlaut in der Mitte", null, ["Wort", "Bild"], ANLAUT.MITTE_WOERTER);
inListe("anlaut-angel/luecke", "Lautgetreue Wörter (fehlender Buchstabe)", null, ["Wort", "Bild"], ANLAUT.LUECKEN_WOERTER);
inListe("buchstaben-zwillinge/verwechsler", "Leicht verwechselbare Buchstaben", null, ["Gruppe"], ZWILLINGE.VERWECHSLER.map(g => [g.join(" ")]));
inListe("buchstaben-zwillinge/wortpaare", "Ähnliche Wörter (das erste passt zum Bild)", null, ["Wort mit Bild", "Ablenker"], ZWILLINGE.WORTPAARE.map(([[w, b], ...a]) => [`${b} ${w}`, a.join(", ")]));
inListe("blitzlesen/wortgruppen", "Wortgruppen", null, ["Einzahl", "Mehrzahl", "ein/eine", "Bild"], BLITZ.ZAEHLDINGE);
for (const [liste, komposita] of Object.entries(KOMPOSITA)) inListe(`nomen-puzzle/${liste}`, "Zusammengesetzte Nomen", "Das Grundwort (letzter Teil) bestimmt den Artikel.", ["Teile", "zusammengesetzt", "falsche Formen"],
  komposita.map(k => [k.teile.map(t => `${t[0]} ${t[1]}`).join(" + "), `${k.ganz[0]} ${k.ganz[1]}`, (k.falsch || []).join(", ")]));

// Lebenszyklus: Zyklen mit Liste im letzten Feld, dazu Geburt und Fragen
for (const liste of ["zyklen-tiere", "zyklen-pflanzen", "zyklus-mensch"]) inListe(`lebenszyklus/${liste}`, "Zyklen", null, ["ab Stufe", "Lebewesen", "Stadien"],
  ZYKLUS.ZYKLEN.filter(z => z[3] === liste).map(([s, name, st]) => [s, name, st.map(x => x[1]).join(" → ")]));
inListe("lebenszyklus/geburt", "Wie kommen die Jungen zur Welt?", null, ["Tier", "Bild", "Art"], ZYKLUS.GEBURT.map(([b, t, a]) => [t, b, a]));
inListe("lebenszyklus/fragen", "Fragen", null, ["Frage", "richtig", "falsch"], ZYKLUS.ZYKLUS_FRAGEN.map(([f, r, a, b]) => [f, r, `${a}; ${b}`]));

// Körper-Puzzle, Znüni-Teller, Magnet-Labor, Schwimmt oder sinkt: Fragen mit Liste im letzten Feld
const fragenMit = (fragen, liste) => fragen.filter(f => f[f.length - 1] === liste);
inListe("koerper-puzzle/koerperteile", "Körperteile", null, ["Bild", "Name", "Artikel"], KOERPER.KOERPERTEILE);
inListe("koerper-puzzle/sinne", "Sinne", null, ["Frage", "Bild", "Sinnesorgan"], KOERPER.SINNE);
for (const liste of ["gelenke-schutz", "organe", "kreislauf-haut"]) inListe(`koerper-puzzle/${liste}`, "Fragen", null, ["Stufe", "Frage", "richtig", "falsch"], frage3(fragenMit(KOERPER.KOERPER_FRAGEN, liste)));
inListe("koerper-puzzle/wege", "Wege durch den Körper", null, ["Weg", "Stationen"], KOERPER.WEGE.map(([name, s]) => [name, s.join(" → ")]));
const { GRUPPEN_ZNUENI } = lade("spiele/znueni-teller/lebensmittel.js", ["GRUPPEN_ZNUENI"]);
inListe("znueni-teller/lebensmittel", "Lebensmittel und Gruppen", null, ["Bild", "Name", "Gruppe"], ZNUENI.LEBENSMITTEL);
inListe("znueni-teller/lebensmittel", "Gruppen und Erklärungen", null, ["Gruppe", "Bild", "Name im Spiel", "Erklärung"], Object.entries(GRUPPEN_ZNUENI).map(([g, x]) => [g, x.bild, x.name, x.erklaerung]));
inListe("znueni-teller/znuenis", "Znüni zur Wahl", null, ["ausgewogen", "nicht ausgewogen"], ZNUENI.ZNUENIS.map(([g, ...s]) => [g.join(""), s.map(x => x.join("")).join("; ")]));
for (const liste of ["ernaehrung", "region-saison"]) inListe(`znueni-teller/${liste}`, "Fragen", null, ["Frage", "richtig", "falsch"], fragenMit(ZNUENI.ZNUENI_FRAGEN, liste).map(([f, r, a, b]) => [f, r, `${a}; ${b}`]));
inListe("magnet-labor/dinge", "Zieht der Magnet es an?", null, ["Bild", "Ding", "zieht an?"], MAGNET.MAGNET_DINGE.map(([b, d, j]) => [b, d, j ? "ja" : "nein"]));
for (const liste of ["wirkung", "kompass-pole", "strom"]) inListe(`magnet-labor/${liste}`, "Fragen", liste === "kompass-pole" ? "Dazu Aufgaben zu Nord- und Südpol, die das Spiel selbst erzeugt (gleiche Pole stossen sich ab, verschiedene ziehen sich an)." : null,
  ["Stufe", "Frage", "richtig", "falsch"], frage3(fragenMit(MAGNET.MAGNET_FRAGEN, liste)));
inListe("schwimmt-sinkt/wasser", "Im Wasser", "„Stufe 1“ = ganz eindeutige Dinge, die schon in der Einstiegsstufe vorkommen.", ["Bild", "Ding", "schwimmt?", "Stufe 1"],
  STOFFE.WASSER_DINGE.map(([b, d, j]) => [b, d, j ? "schwimmt" : "sinkt", STOFFE.WASSER_EINFACH.includes(d) ? "ja" : ""]));
inListe("schwimmt-sinkt/material", "Material", null, ["Bild", "Ding", "Material"], STOFFE.MATERIAL_DINGE);
for (const liste of ["eigenschaften", "schwimmen-sinken"]) inListe(`schwimmt-sinkt/${liste}`, "Fragen", null, ["Stufe", "Frage", "richtig", "falsch"], frage3(fragenMit(STOFFE.STOFF_FRAGEN, liste)));

// Instrumente: Liste je Gruppe (INSTRUMENT_LISTE_JE_GRUPPE), Fragen mit Liste im letzten Feld
const { INSTRUMENT_LISTE_JE_GRUPPE } = lade("spiele/instrumente/instrumente.js", ["INSTRUMENT_LISTE_JE_GRUPPE"]);
for (const [gruppe, liste] of Object.entries(INSTRUMENT_LISTE_JE_GRUPPE)) inListe(`instrumente/${liste}`, "Instrumente", "Bild „svg:…“ = im Spiel gezeichnet; leer = kein Bild, nur ab Stufe 3.",
  ["Bild", "Name", "Gruppe", "Spielweise", "genauer"], INSTR.INSTRUMENTE.filter(i => i[2] === gruppe));
for (const liste of ["ensembles", "klang"]) inListe(`instrumente/${liste}`, "Fragen", null, ["Frage", "richtig", "falsch"], fragenMit(INSTR.INSTRUMENT_FRAGEN, liste).map(([f, r, a, b]) => [f, r, `${a}; ${b}`]));

// Daten-Detektiv, Preis-Tabelle, Kompass
inListe("diagramm-detektiv/umfragen", "Umfragen", "Die Zahlen erzeugt das Spiel; zu prüfen sind Fragen und Kategorien.", ["Titel", "Frage", "Kategorien"],
  UMFRAGEN.map(u => [u.titel, u.frage, u.kategorien.map(([b, name, f]) => `${b} ${name} (${f})`).join(", ")]));
const PREIS = lade("spiele/preis-tabelle/artikel.js", ["WARE_GEWICHT", "FOLGEN"]);
inListe("preis-tabelle/stueckware", "Artikel", "Preis je Stück in Rappen: kleinster bis grösster Wert, den das Spiel wählt.", ["Bild", "Einzahl", "Mehrzahl", "von Rp.", "bis Rp."], PREIS_ARTIKEL);
inListe("preis-tabelle/gewichtsware", "Ware nach Gewicht", "Preis für 100 g in Rappen: kleinster bis grösster Wert, den das Spiel wählt.", ["Bild", "Name", "von Rp.", "bis Rp."], PREIS.WARE_GEWICHT);
inListe("preis-tabelle/folgen", "Folgen in Tabellen", "Die Zahlen erzeugt das Spiel; bei Geld steht rechts ein Frankenbetrag.", ["Bild", "Spalte links", "Spalte rechts", "Geld", "Satz zur Frage"],
  PREIS.FOLGEN.map(([b, l, r, geld, s]) => [b, l, r, geld ? "ja" : "nein", s]));
inListe("kompass/orte", "Orte auf dem Plan", null, ["Bild", "Name", "Nominativ", "Dativ"], ORTE);

// Wortfamilien-Baum: Spalten je Liste (WORTFAMILIEN_LISTEN); Familienwort und Stamm stehen in jeder Liste mit
const { WORTFAMILIEN_LISTEN } = lade("spiele/wortfamilien-baum/woerter.js", ["WORTFAMILIEN_LISTEN"]);
const SPALTE_KOPF = { einfach: "abgeleitet", umlaut: "mit Umlaut", zusammen: "zusammengesetzt", falsch: "nur ähnlich (Bedeutung)" };
const SPALTE_TEXT = { falsch: w => w.map(([x, b]) => `${x} (${b})`).join("; ") };
for (const liste of [...new Set(Object.values(WORTFAMILIEN_LISTEN))]) {
  const spalten = Object.keys(WORTFAMILIEN_LISTEN).filter(s => WORTFAMILIEN_LISTEN[s] === liste);
  inListe(`wortfamilien-baum/${liste}`, "Wortfamilien", liste === "umlaut-aehnlich" ? "Ähnliche Wörter gehören NICHT zur Familie." : null, ["Familie", "Stamm", ...spalten.map(s => SPALTE_KOPF[s])],
    WORTFAMILIEN.filter(f => spalten.some(s => f[s].length)).map(f => [f.wort, f.stamm, ...spalten.map(s => (SPALTE_TEXT[s] || (w => w.join(", ")))(f[s]))]));
}

// Zeitreise-Verben, Fehler-Lupe (Regeln über das Feld „liste“, Zusatzliste fehlerfrei)
inListe("zeitreise-verben/regelmaessig", "Regelmässige Verben", null, ["Verb", "Präsens", "Präteritum", "Perfekt"], ZR.VERBEN_REGELMAESSIG.map(satz3));
inListe("zeitreise-verben/unregelmaessig", "Unregelmässige Verben", null, ["Verb", "Präsens", "Präteritum", "Perfekt"], ZR.VERBEN_UNREGELMAESSIG.map(satz3));
for (const r of Object.values(FL.FEHLER_REGELN)) inListe(`fehler-lupe/${r.liste}`, r.name, `Regel im Spiel: ${r.regel} — das Wort in „…“ zeigt das Spiel falsch.`, ["Satz richtig", "gezeigter Fehler", "weitere Wahl"],
  [...r.kurz, ...r.lang].map(s => { const m = s.match(/\{([^}]+)\}/)[1].split("|"); return [s.replace(/\{([^|}]+)[^}]*\}/, "„$1“"), m[1], m.slice(2).join(", ")]; }));
inListe("fehler-lupe/fehlerfrei", "Fehlerfreie Sätze (Königsstufe)", "Nur neben einem Satz aus einer freien Regel-Liste.", ["Satz"], FL.FEHLERFREIE_SAETZE.map(s => [s]));

// Englisch: Wort-Zwillinge (Liste im 4. Feld), Sentence-Builder (Liste im 3. Feld), Listen & Tap
for (const liste of ["gleich", "aehnlich"]) inListe(`wort-zwillinge/${liste}`, "Parallelwörter", null, ["Englisch", "Deutsch", "Bild"], WZ.ZWILLINGE.filter(z => z[3] === liste).map(([en, de, b]) => [en, de, b]));
inListeTeil("wort-zwillinge/falsche-freunde", "Falsche Freunde", null, ["Englisch", "Bedeutung", "sieht aus wie", "Bild"], WZ.FALSCHE_FREUNDE);
const nackt = w => w.replace(/[.?!]$/, "");
for (const liste of ["ich-saetze", "er-sie-saetze", "fragen", "verneinung"]) {
  const saetze = SB.SAETZE.filter(s => s[2] === liste);
  inListe(`sentence-builder/${liste}`, "Sätze", "Britisches Englisch (have got).", ["Englisch", "Deutsch"], saetze.map(([en, de]) => [en, de]));
  // Verwechsler wie im Spiel: das erste Wort des Satzes mit einem Eintrag
  const paare = [...new Set(saetze.map(([en]) => en.split(" ").map(nackt).find(w => SB.VERWECHSLER[w])).filter(Boolean))];
  if (paare.length) inListe(`sentence-builder/${liste}`, "Verwechsler (falsche Form als zusätzliche Karte, nur in Stufen mit Verwechsler)", null, ["richtig", "falsch"], paare.map(w => [w, SB.VERWECHSLER[w]]));
}
inListe("listen-tap/anweisungen", "Formen", null, ["Form", "Bilder"], formZeilen);
inListeTeil("listen-tap/anweisungen", "Farben", null, ["Farbe", "Bilder"], LT.ANWEISUNG_FARBEN);
inListeTeil("listen-tap/anweisungen", "Anweisungen", null, ["Anweisung"], LT.ANWEISUNG_VERBEN);
inListeTeil("listen-tap/wo-ist", "Tiere", null, ["Englisch", "Bild"], LT.WO_TIERE);
inListeTeil("listen-tap/wo-ist", "Orte", null, ["Ding", "Präposition"], LT.WO_ORTE);

// Möglichkeiten-Finder, Früher und heute, Wetter: je Konstante eine Liste
inListeTeil("glace-kombinator/sorten", "Sorten", null, ["Sorte", "Farbe", "Buchstabe"], GK.GLACE_SORTEN);
inListeTeil("glace-kombinator/kleider", "Kleider", null, ["Gruppe", "Bild", "Name"], GK.KLEIDER);
inListeTeil("frueher-heute/paare", "Paare", "„svg:…“ = im Spiel gezeichnet.", ["Gruppe", "Bild früher", "früher", "Bild heute", "heute", "früher eindeutig"], FH.FH_PAARE);
inListeTeil("frueher-heute/reihen", "Reihen vom ältesten zum neusten", null, ["Gruppe", "Thema", "Reihe (Bild / Ding)"], FH.FH_REIHEN);
inListeTeil("frueher-heute/grosseltern", "Gab es das schon?", null, ["Bild", "Ding", "vor 60 Jahren", "vor 100 Jahren"], FH.FH_GROSSELTERN);
inListeTeil("wetter-jahreszeiten/jahreszeiten", "Jahreszeiten", null, ["ab Stufe", "Bild", "Beobachtung", "Jahreszeit"], WJ.WJ_JAHRESZEITEN);
inListeTeil("wetter-jahreszeiten/kleidung", "Kleidung", null, ["Bild", "Wetter", "richtig", "falsch", "falsch"], WJ.WJ_KLEIDUNG);
inListeTeil("wetter-jahreszeiten/symbole", "Wettersymbole", null, ["Bild", "Name"], WJ.WJ_SYMBOLE);
inListeTeil("wetter-jahreszeiten/fragen", "Fragen", null, ["ab Stufe", "Bild", "Frage", "richtig", "falsch", "falsch", "Erklärung"], WJ.WJ_FRAGEN);

// Schulweg-Profi: Konstanten je Liste, Fragen mit Liste im 2. Feld
const VERKEHR = "Verkehrsregeln aus dem Gedächtnis belegt (SVG, VTS) — bitte besonders prüfen.";
inListeTeil("schulweg-profi/sicher-gefaehrlich", "Sicher oder gefährlich", VERKEHR, ["Bild", "Situation", "sicher"], SW.SW_SICHER);
inListeTeil("schulweg-profi/queren", "Merksatz", null, ["Bild", "Mundart", "Hochdeutsch"], SW.SW_MERKSATZ);
inListeTeil("schulweg-profi/signale", "Signale", VERKEHR, ["Signal", "Bedeutung", "auch richtig"], SW.SW_SIGNALE);
for (const liste of ["sicher-gefaehrlich", "queren", "signale", "velo"]) {
  const fragen = SW.SW_FRAGEN.filter(f => f[1] === liste);
  if (fragen.length) inListeTeil(`schulweg-profi/${liste}`, "Fragen", VERKEHR, ["ab Stufe", "Liste", "Bild", "Frage", "richtig", "falsch", "falsch", "Erklärung"], fragen);
}

// Zeitstrahl-Sortierer: Konstanten je Liste (Kopf von zeitstrahl.js)
inListeTeil("zeitstrahl-sortierer/lebensabschnitte", "Lebensabschnitte", null, ["Bild", "Abschnitt"], ZS.ZS_ABSCHNITTE);
inListeTeil("zeitstrahl-sortierer/lebensabschnitte", "Ereignisse im Leben", "Eintrittsalter für den Kanton St. Gallen.", ["Alter", "Bild", "Ereignis"], ZS.ZS_LEBEN);
inListeTeil("zeitstrahl-sortierer/generationen", "Generationen", null, ["Generation", "Bild", "Person"], ZS.ZS_GENERATIONEN);
inListeTeil("zeitstrahl-sortierer/ereignisse", "Ereignisse mit Jahrzahl", "Jahrzahlen bitte nachprüfen.", ["Jahr", "Jahrzahl", "Bild", "Ereignis", "Zeitalter"], ZS.ZS_EREIGNISSE);
inListeTeil("zeitstrahl-sortierer/epochen", "Zeitalter", null, ["Bild", "Zeitalter"], ZS.ZS_EPOCHEN);
inListeTeil("zeitstrahl-sortierer/epochen", "Merkmale der Zeitalter", null, ["Zeitalter", "Bild", "Merkmal"], ZS.ZS_MERKMALE);

// Stromkreis-Bauer: Schaltungen mit Liste im 1. Feld, Gegenstände zur Liste leiter
inListeTeil("stromkreis-bauer/leiter", "Leiter und Nichtleiter", null, ["Bild", "Gegenstand", "leitet", "knifflig"], ST.GEGENSTAENDE);
for (const liste of ["einfach", "schalter", "leiter", "kurzschluss", "serie-parallel"]) {
  const schaltungen = ST.SCHALTUNGEN.filter(s => s[0] === liste);
  if (schaltungen.length) inListeTeil(`stromkreis-bauer/${liste}`, "Schaltungen", "Kurzschrift im Kopf von bauteile.js; ob die Lampe brennt, rechnet das Spiel aus.", ["Liste", "Aufbau", "Zusatz"], schaltungen);
}

// Plan-Leser (PLAN_DINGE[liste]), Echt oder erfunden?, Gedicht-Baukasten
for (const [liste, dinge] of Object.entries(PL.PLAN_DINGE)) inListeTeil(`plan-leser/${liste}`, "Dinge auf dem Plan", "Zeichen frei erfunden.", ["Name", "Dativ", "Mehrzahl", "Zeichen", "Farbe"], dinge);
inListeTeil("echt-oder-erfunden/aussagen", "Sätze", null, ["Bild", "Satz", "kann es geben", "Stufe 1"], EE.AUSSAGEN);
inListeTeil("echt-oder-erfunden/geschichten", "Geschichten", "Nummer des erfundenen Satzes, −1 = alles echt.", ["Sätze", "erfundener Satz", "Merkmal"], EE.GESCHICHTEN);
inListeTeil("echt-oder-erfunden/geschichten", "Merkmale", null, ["Schlüssel", "Merkmal"], EE.MERKMALE);
inListeTeil("echt-oder-erfunden/staunen", "Erstaunlich, aber wahr?", "Fakten bitte nachprüfen.", ["Satz", "stimmt"], EE.STAUNEN);
inListeTeil("echt-oder-erfunden/textsorten", "Textsorten", null, ["Sorte", "Angaben"], EE.TEXTSORTEN);
inListeTeil("echt-oder-erfunden/textsorten", "Texte zu den Textsorten", "Selbst geschrieben; die Sagen spielen an echten Orten.", ["Sorte", "Text"], EE.TEXTSORTEN_TEXTE);
inListeTeil("gedicht-baukasten/reimpaare", "Zweizeiler", "Alle Verse selbst verfasst.", ["Vers 1", "Vers 2", "Reimwort", "Wahl", "Wahl", "Wahl"], GB.REIMPAARE);
for (const [liste, gedichte] of Object.entries(GB.VIERZEILER)) inListe(`gedicht-baukasten/${liste}`, "Vierzeiler", null, ["Verse"], gedichte.map(g => [zelle(g)]));
inListeTeil("gedicht-baukasten/strophen", "Gedichte mit Strophen", null, ["Titel", "Strophen (Reimschema / Verse)"], GB.STROPHEN_GEDICHTE);

for (const [liste, [titel, hinweis, kopf, daten]] of Object.entries(KARTE_TEILE)) inListe(`schweiz-karte/${liste}`, titel, hinweis, kopf, daten);

inListe("geheimschrift-knacker/woerter", "Geheimwörter", "Nur A–Z, ohne Umlaute.", ["Wort"], GEHEIM_WOERTER.map(w => [w]));
for (const [liste, saetze] of Object.entries(KOMMA_SAETZE)) inListe(`komma-jagd/${liste}`, KOMMA_TITEL[liste] || liste, null, ["Satz"], saetze.map(s => [s]));
inListe("morphem-schere/bausteine", "Wörter mit Bausteinen", null, ["Wort", "Bausteine", "Stamm"], MORPHEM_LISTEN.bausteine.map(morphemZeile));
inListe("morphem-schere/stamm-ea", "Stammregel e oder ä", "Ohne verwandtes Wort: e oder eu.", ["Wort", "richtig", "falsche Auswahl", "verwandt mit"], MORPHEM_LISTEN["stamm-ea"].map(eaZeile));

for (const [, schluessel, titel, hinweis, kopf, zeilenListe] of RUNDE2) inListe(schluessel, titel, hinweis, kopf, zeilenListe);

for (const [, schluessel, titel, hinweis, kopf, zeilenListe] of RUNDE3) inListe(schluessel, titel, hinweis, kopf, zeilenListe);

for (const [, schluessel, titel, hinweis, kopf, zeilenListe] of RUNDE4) inListe(schluessel, titel, hinweis, kopf, zeilenListe);

for (const [, schluessel, titel, hinweis, kopf, zeilenListe] of RUNDE5) inListe(schluessel, titel, hinweis, kopf, zeilenListe);

for (const [, schluessel, titel, hinweis, kopf, zeilenListe] of RUNDE6) inListe(schluessel, titel, hinweis, kopf, zeilenListe);

for (const [, schluessel, titel, hinweis, kopf, zeilenListe] of RUNDE7) inListe(schluessel, titel, hinweis, kopf, zeilenListe);

for (const [, schluessel, titel, hinweis, kopf, zeilenListe] of RUNDE8) inListe(schluessel, titel, hinweis, kopf, zeilenListe);

// Jede Quell-Liste braucht einen Eintrag — sonst bricht der Lauf ab, statt still eine Lücke zu schreiben.
const fehlend = Object.keys(QUELL_LISTEN).filter(k => !listen[k] || listen[k].tabellen.every(t => !t.zeilen.length));
if (fehlend.length) throw new Error(`Listen ohne Einträge: ${fehlend.join(", ")}`);
const geordnet = Object.fromEntries(Object.keys(QUELL_LISTEN).map(k => [k, listen[k]]));
const PRUEF_ORDNER = path.join(__dirname, "..", "docs", "eulenpfad", "pruefung");
const JSON_TEXT = `${JSON.stringify(geordnet, null, 2)}\n`;
if (PRUEFE) {
  // Zeilenende der Arbeitskopie zählt nicht (Git kann LF als CRLF auschecken)
  const gleich = (datei, soll) => {
    try { return fs.readFileSync(path.join(PRUEF_ORDNER, datei), "utf8").replace(/\r\n/g, "\n") === soll; } catch { return false; }
  };
  const veraltet = [["listen.json", JSON_TEXT], ["wortlisten_zur_pruefung.md", MARKDOWN]].filter(([d, s]) => !gleich(d, s)).map(([d]) => d);
  if (veraltet.length) {
    console.log(`Prüfliste veraltet (${veraltet.join(", ")}): node tools/pruefliste_wortlisten.js > docs/eulenpfad/pruefung/wortlisten_zur_pruefung.md`);
    process.exit(1);
  }
} else fs.writeFileSync(path.join(PRUEF_ORDNER, "listen.json"), JSON_TEXT, "utf8");
