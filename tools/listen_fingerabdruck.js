// Fingerabdruck der Inhaltslisten gegen den Prüfstand (Entscheid LP3-H a, LERN_Session12; rahmen.md 17).
// Eine Liste ist nur frei, solange sie so ist, wie sie ganz geprüft wurde (LP3 a). Die Prüfansicht schreibt dafür
// den Fingerabdruck der ganzen Liste als hash in pruefstand.js; hier wird er für jede Liste mit pruefung.js neu
// gerechnet — mit denselben Funktionen wie die Prüfansicht (LISTENPRUEFUNG.eintraegeVon, .listenHash).
// Genutzt von tools/pruefe_spiele.js (Fehler) und tools/checkliste.js (Liste wieder zu prüfen).
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WURZEL = path.join(__dirname, "..");
const SPIELE_DIR = path.join(WURZEL, "eulenpfad", "spiele");
const DOM = fs.readFileSync(path.join(__dirname, "pruef_dom.js"), "utf8");

/** Skripte einer Seite in Reihenfolge: { name, code }. */
function skripte(seitenPfad, html) {
  const liste = [];
  const re = /<script(?:\s+src="([^"]+)")?[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[1]) {
      const datei = path.join(path.dirname(seitenPfad), m[1]);
      liste.push({ name: path.relative(WURZEL, datei), code: fs.readFileSync(datei, "utf8") });
    } else {
      liste.push({ name: path.relative(WURZEL, seitenPfad) + " (inline)", code: m[2] });
    }
  }
  return liste;
}

/** Fingerabdrücke der Listen eines Spiels mit pruefung.js: { <liste>: hash }; null ohne pruefung.js. */
function fingerabdrueckeVon(spielId) {
  const pruefung = path.join(SPIELE_DIR, spielId, "pruefung.js");
  if (!fs.existsSync(pruefung)) return null;
  // Die Spielseite als Aufsicht laden: pruefung.js liest die Inhalte und Zeichenfunktionen des Spiels.
  const seitenPfad = path.join(SPIELE_DIR, spielId, "index.html");
  const html = fs.readFileSync(seitenPfad, "utf8");
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1].replace(/<script[\s\S]*?<\/script>/g, "");
  const kontext = vm.createContext({ __seite: { html: body, search: "?stufe=s1", seed: 1 }, console, URL, URLSearchParams, structuredClone });
  const lauf = (code, name) => vm.runInContext(code, kontext, { filename: name, timeout: 5000 });
  lauf(DOM, "pruef_dom.js");
  lauf(`localStorage.setItem("lernspiele:profile", JSON.stringify({ Testlauf: { rolle: "aufsicht" } }));
        localStorage.setItem("lernspiele:spieler", JSON.stringify("Testlauf"));
        sessionStorage.setItem("lernspiele:aufsicht", "Testlauf");`, "vorbereitung");
  for (const s of skripte(seitenPfad, html)) lauf(s.code, s.name);
  lauf(fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", "listenpruefung.js"), "utf8"), "listenpruefung.js");
  lauf(fs.readFileSync(pruefung, "utf8"), path.relative(WURZEL, pruefung));
  return lauf(`Object.fromEntries(Object.entries(LS.pruefungDefinition(${JSON.stringify(spielId)}) || {})
    .map(([liste, def]) => [liste, LISTENPRUEFUNG.listenHash(LISTENPRUEFUNG.eintraegeVon(def))]))`, "fingerabdruck");
}

/**
 * Listen mit pruefung.js, die im Prüfstand als geprüft stehen, gegen ihren Fingerabdruck:
 * [{ schluessel: "<spiel>/<liste>", stand, ist }] — stand null = geprüft vor der Prüfung je Eintrag (ohne hash).
 * Nur Abweichungen; spielIds begrenzt die Suche (Standard: alle Spiele im Prüfstand).
 */
function abweichungen(pruefstand, spielIds = null) {
  const funde = [];
  const cache = new Map();
  for (const [schluessel, eintrag] of Object.entries(pruefstand.listen || {})) {
    const [spiel, liste] = schluessel.split("/");
    if (spielIds && !spielIds.includes(spiel)) continue;
    if (!cache.has(spiel)) cache.set(spiel, fingerabdrueckeVon(spiel));
    const ist = cache.get(spiel)?.[liste];
    if (ist === undefined) continue; // noch ohne Prüfansicht je Eintrag
    const stand = eintrag.hash || null;
    if (stand !== ist) funde.push({ schluessel, stand, ist });
  }
  return funde;
}

module.exports = { skripte, fingerabdrueckeVon, abweichungen };
