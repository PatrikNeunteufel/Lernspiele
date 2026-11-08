// Schlusszeile eines Testlaufs merken (Entscheid HK1 a, LERN_Session23): je Skript in .temp/pruefung/<skript>.json
// (gitignored) die letzten Läufe mit Tag, Zeit, Aufruf und Schlusszeile. Der Stop-Hook .claude/hooks/testzahlen.py
// vergleicht die Testzahlen in einer Commit-Message im Chat damit — sie werden nicht mehr abgeschrieben, sondern geprüft.
// Fehler beim Schreiben stören den Test nie (die Datei ist nur ein Beleg).
"use strict";
const fs = require("fs");
const path = require("path");

const ORDNER = path.join(__dirname, "..", ".temp", "pruefung");
const BEHALTEN = 50;

/** Kalendertag in Ortszeit „JJJJ-MM-TT“ (wie KERN.zeit.tag). */
function tag(d = new Date()) {
  const z = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

/** skript: Name ohne .js; zeile: die Schlusszeile, wie sie ausgegeben wurde; aufruf: Angaben (Standard: argv). */
function merke(skript, zeile, aufruf = process.argv.slice(2).join(" ")) {
  try {
    fs.mkdirSync(ORDNER, { recursive: true });
    const datei = path.join(ORDNER, `${skript}.json`);
    let laeufe = [];
    try { laeufe = JSON.parse(fs.readFileSync(datei, "utf8")); } catch (e) { laeufe = []; }
    if (!Array.isArray(laeufe)) laeufe = [];
    const jetzt = new Date();
    laeufe.push({ tag: tag(jetzt), zeit: jetzt.toISOString(), aufruf, zeile: String(zeile).trim() });
    fs.writeFileSync(datei, JSON.stringify(laeufe.slice(-BEHALTEN), null, 1) + "\n");
  } catch (e) { /* nur ein Beleg: nie den Test stören */ }
}

module.exports = { merke, ORDNER, tag };
