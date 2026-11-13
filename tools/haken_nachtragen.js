// Haken je Eintrag ohne Fingerabdrücke von Zeile und Zellen nachtragen (Entscheid ÜB1 a, Kern 1.45.0, LERN_Session38).
// Haken, die vor Kern 1.45.0 gesetzt wurden, tragen nur { am, von }. Die Prüfansicht erkennt „schon geprüft“ aber nur an
// den Fingerabdrücken — dieses Werkzeug rechnet sie für jeden alten Haken nach, mit derselben Rechnung wie die
// Prüfansicht (KERN.listenpruefung.inhaltVon), und trägt sie in eulenpfad/spiele/gemeinsam/pruefstand-eintraege.json ein.
// Nur Haken, deren Eintrag es heute noch gibt (sonst ist der Haken ohnehin nichts mehr wert); nichts wird entfernt.
// Grenze: Das Bild einer Zeile (abschnitt.bild) rechnet das Ersatz-DOM nach; weicht seine Schreibweise vom Browser ab,
// passt der Fingerabdruck der Zeile nicht, und nur die Zellen gelten als bekannt — nie umgekehrt ein falscher Treffer.
// Aufruf: node tools/haken_nachtragen.js [--pruefe]   (--pruefe: nur zählen, nichts schreiben)
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { skripte } = require("./listen_fingerabdruck.js");

const WURZEL = path.join(__dirname, "..");
const SPIELE = path.join(WURZEL, "eulenpfad", "spiele");
const DATEI = path.join(SPIELE, "gemeinsam", "pruefstand-eintraege.json");
const nurPruefen = process.argv.includes("--pruefe");

/** { "<spiel>/<liste>": { "<schlüssel>": { zeile, zellen } } } für ein Spiel. */
function inhalteVon(spiel) {
  const seite = path.join(SPIELE, spiel, "index.html");
  const html = fs.readFileSync(seite, "utf8");
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1].replace(/<script[\s\S]*?<\/script>/g, "");
  const k = vm.createContext({ __seite: { html: body, search: "?stufe=s1", seed: 1 }, console: { log() {}, warn() {}, error() {} },
    URL, URLSearchParams, structuredClone });
  const lauf = (code, name) => vm.runInContext(code, k, { filename: name, timeout: 10000 });
  lauf(fs.readFileSync(path.join(__dirname, "pruef_dom.js"), "utf8"), "pruef_dom.js");
  lauf(`localStorage.setItem("lernspiele:profile", JSON.stringify({ Testlauf: { rolle: "aufsicht" } }));
    localStorage.setItem("lernspiele:spieler", JSON.stringify("Testlauf")); sessionStorage.setItem("lernspiele:aufsicht", "Testlauf");`, "vorbereitung");
  for (const s of skripte(seite, html)) lauf(s.code, s.name);
  lauf(fs.readFileSync(path.join(SPIELE, "gemeinsam", "listenpruefung.js"), "utf8"), "listenpruefung.js");
  lauf(fs.readFileSync(path.join(SPIELE, spiel, "pruefung.js"), "utf8"), "pruefung.js");
  return JSON.parse(lauf(`(() => {
    const aus = {};
    for (const [liste, def] of Object.entries(LS.pruefungDefinition(${JSON.stringify(spiel)}) || {})) {
      const je = aus[${JSON.stringify(spiel)} + "/" + liste] = {};
      for (const e of LISTENPRUEFUNG.eintraegeVon(def)) { const { zeile, zellen } = LISTENPRUEFUNG.inhaltVon(e); je[e.schluessel] = { zeile, zellen }; }
    }
    return JSON.stringify(aus);
  })()`, "inhalte"));
}

const haken = JSON.parse(fs.readFileSync(DATEI, "utf8"));
const spiele = [...new Set(Object.keys(haken).map(q => q.split("/")[0]))];
let nachgetragen = 0, schon = 0, ohneEintrag = 0;
const fehler = [];
for (const spiel of spiele) {
  if (!fs.existsSync(path.join(SPIELE, spiel, "pruefung.js"))) continue;
  let inhalte;
  try { inhalte = inhalteVon(spiel); } catch (f) { fehler.push(`${spiel}: ${f.message}`); continue; }
  for (const [quelle, je] of Object.entries(haken)) {
    if (!quelle.startsWith(spiel + "/")) continue;
    for (const [s, h] of Object.entries(je)) {
      if (h.zeile) { schon++; continue; }
      const i = inhalte[quelle]?.[s];
      if (!i) { ohneEintrag++; continue; }
      Object.assign(h, { zeile: i.zeile, zellen: i.zellen });
      nachgetragen++;
    }
  }
}
if (!nurPruefen && nachgetragen) fs.writeFileSync(DATEI, JSON.stringify(haken, null, 1) + "\n", "utf8");
for (const f of fehler) console.log(`    FEHLER  ${f}`);
console.log(`${nachgetragen} Haken ${nurPruefen ? "nachzutragen" : "nachgetragen"}, ${schon} hatten es schon, ${ohneEintrag} ohne heutigen Eintrag.`);
process.exitCode = fehler.length ? 1 : 0;
