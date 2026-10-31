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
const SATZ = lade("spiele/satz-reparatur/saetze.js", ["SAETZE"]).SAETZE;
const { THEMEN_EN, WENDUNGEN_EN } = lade("spiele/word-match/woerter.js", ["THEMEN_EN", "WENDUNGEN_EN"]);

const ART = { N: "Nomen", V: "Verb", A: "Adjektiv" };
const STUFE = { s3: "Stufe 3 — einfache Sätze", s4: "Stufe 4 — Vergangenheit, Steigerung", s5: "Stufe 5 — gleiche Wörter, andere Wortart" };
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
  const alle = [...r.woerter.map(w => [...w, ""]), ...(r.ausnahmen || []).map(w => [...w, " (Ausnahme, nur Stufe 5)"])];
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
for (const [getrennt, bild] of SILBEN_WOERTER) z(`| ${getrennt.replace(/-/g, "")} | ${getrennt} | ${getrennt.split("-").length} | ${bild} | ☐ |`);
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
process.stdout.write(zeilen.join("\n"));
