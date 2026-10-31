// Erzeugt aus den Wortlisten der Deutsch-Spiele eine lesbare Prüfliste (Markdown) für Eltern
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
process.stdout.write(zeilen.join("\n"));
