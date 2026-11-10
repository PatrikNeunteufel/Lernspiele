// Prüft jedes Skript der Reihe ohne es auszuführen (Entscheid PK1 a, LERN_Session25; Anlass: die Prüfansicht des
// Eulenpfads lud von LERN_Session20 bis 24 mit einem Syntaxfehler, und kein Test merkte es, weil sie erst beim Öffnen
// nachgeladen wird). Über eulenpfad/, lernsteig/, gratwanderung/, portal/ und kern/:
//   1. jede .js-Datei und jedes Inline-Skript einer HTML-Seite ist lesbar (vm.Script: nur Syntax, nichts läuft);
//   2. jede <script src="…"> zeigt auf eine vorhandene Datei;
//   3. kein Skript kommt von aussen (http, https, //) — die Reihe läuft ohne externe Abhängigkeiten (Entscheid LERN-1);
//   4. jede Seite, die <app>/kern/kern.js lädt, lädt davor <app>/version.js (Plan C12, NS3 a: Version der App).
// Fehler im Verhalten fängt sie nicht; dafür sind die Seitentests da.
// Aufruf: node tools/pruefe_skripte.js — läuft mit den kurzen Prüfungen (node tools/pruefe.js); Ende mit Code 1 bei Fehlern.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WURZEL = path.join(__dirname, "..");
const ORDNER = ["eulenpfad", "lernsteig", "gratwanderung", "portal", "kern"];
// Inline-Blöcke, die kein JavaScript sind (Daten), und solche ohne Inhalt werden übersprungen
const KEIN_SKRIPT = /\btype="(?!text\/javascript|module)[^"]*"/;

/** Alle Dateien mit der Endung unter ordner (rekursiv). */
const dateien = (ordner, endung) => fs.readdirSync(ordner, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? dateien(path.join(ordner, e.name), endung) : e.name.endsWith(endung) ? [path.join(ordner, e.name)] : []);

/** Prüft alles; gibt { fehler: [Text], zahlen: { js, inline, verweise } } zurück. ordner: zum Prüfen mit anderen Ordnern. */
function pruefe(wurzel = WURZEL, ordner = ORDNER) {
  const fehler = [];
  const zahlen = { js: 0, inline: 0, verweise: 0 };
  const lies = (code, wo) => {
    try { new vm.Script(code, { filename: wo }); } catch (e) { fehler.push(`${wo}: ${e.message}${zeileVon(e)}`); }
  };
  for (const o of ordner) {
    const start = path.join(wurzel, o);
    if (!fs.existsSync(start)) { fehler.push(`Ordner ${o}/ fehlt`); continue; }
    for (const f of dateien(start, ".js")) { zahlen.js++; lies(fs.readFileSync(f, "utf8"), path.relative(wurzel, f).replace(/\\/g, "/")); }
    for (const f of dateien(start, ".html")) {
      const wo = path.relative(wurzel, f).replace(/\\/g, "/");
      const html = fs.readFileSync(f, "utf8").replace(/<!--[\s\S]*?-->/g, "");
      const geladen = []; // aufgelöste Pfade der <script src> in Reihenfolge (für Punkt 4)
      for (const m of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi)) {
        const attr = m[1] || "";
        const src = attr.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
        if (src) {
          zahlen.verweise++;
          geladen.push(path.relative(wurzel, path.join(path.dirname(f), decodeURI(src[1].split(/[?#]/)[0]))).replace(/\\/g, "/"));
          if (/^(https?:)?\/\//i.test(src[1])) { fehler.push(`${wo}: Skript von aussen ${src[1]} (LERN-1)`); continue; }
          const ziel = path.join(path.dirname(f), decodeURI(src[1].split(/[?#]/)[0]));
          if (!fs.existsSync(ziel)) fehler.push(`${wo}: Skript fehlt ${src[1]}`);
        } else if (m[2].trim() && !KEIN_SKRIPT.test(attr)) {
          zahlen.inline++;
          lies(m[2], `${wo} (Skript in der Seite)`);
        }
      }
      // 4. Version der App vor dem Kern (NS3 a)
      const kern = geladen.findIndex(p => /^[a-z]+\/kern\/kern\.js$/.test(p));
      if (kern >= 0) {
        const soll = geladen[kern].replace(/kern\/kern\.js$/, "version.js");
        const v = geladen.indexOf(soll);
        if (v < 0 || v > kern) fehler.push(`${wo}: lädt ${geladen[kern]} ohne ${soll} davor (NS3 a)`);
      }
    }
  }
  return { fehler, zahlen };
}

/** Zeile und Spalte aus dem Stapel eines SyntaxError (vm nennt sie dort, nicht in der Meldung). */
function zeileVon(e) {
  const m = String(e.stack || "").match(/:(\d+)\s*\n/);
  return m ? ` (Zeile ${m[1]})` : "";
}

if (require.main === module) {
  const { fehler, zahlen } = pruefe();
  console.log(`${zahlen.js} Skriptdateien, ${zahlen.inline} Skripte in Seiten, ${zahlen.verweise} Verweise geprüft.`);
  for (const f of fehler) console.log(`    FEHLER  ${f}`);
  const schluss = fehler.length ? `${fehler.length} Fehler.` : "Keine Fehler.";
  console.log(schluss);
  require("./testausgabe.js").merke("pruefe_skripte", schluss); // HK1 a
  process.exit(fehler.length ? 1 : 0);
}

module.exports = { pruefe };
