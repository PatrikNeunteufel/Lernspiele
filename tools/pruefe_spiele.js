// Prüft alle Spiele ohne Browser: je Spiel und Stufe wird die Seite mit dem echten Rahmen
// (spiel.js) in einem Ersatz-DOM (tools/pruef_dom.js) geladen und per Zufallsklicks gespielt.
//
// Gemeldet wird: Ausnahmen, Endlosschleifen (Zeitlimit), sichtbarer Text mit NaN, undefined,
// null, Infinity oder [object …], unplausible Protokolleinträge. Bietet ein Spiel die Funktionen
// aufgabeErzeugen(stufe) und pruefeAufgabe(aufgabe, stufe) an, werden zusätzlich viele
// Zufallsaufgaben fachlich geprüft (pruefeAufgabe liefert eine Liste von Mängeln).
//
// Aufruf: node tools/pruefe_spiele.js [spiel-id …] [--runden=3] [--aufgaben=3000] [--seed=1] [--maxKlicks=8000]
// Ende mit Code 1, sobald ein Fehler gefunden wurde.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WURZEL = path.join(__dirname, "..");
const SPIELE_DIR = path.join(WURZEL, "spiele");
const DOM = fs.readFileSync(path.join(__dirname, "pruef_dom.js"), "utf8");
const STUFEN = ["s1", "s2", "s3", "s4", "s5", "s6"];
const VERDAECHTIG = /NaN|undefined|\bnull\b|Infinity|\[object /;

const opt = { runden: 3, aufgaben: 3000, seed: 1, maxKlicks: 8000 };
const nurSpiele = [];
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--(\w+)=(\d+)$/);
  if (m) opt[m[1]] = Number(m[2]); else nurSpiele.push(a);
}

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

// Treiber im Kontext: Runden spielen, bis opt.runden protokolliert sind oder die Klicks ausgehen.
const TREIBER = `
(function treiber(runden, maxKlicks) {
  const buehne = document.querySelector(".buehne");
  const funde = [];
  // Je Fund nur einmal melden (Schlüssel: der gefundene Ausschnitt, nicht der Klick davor).
  const gemeldet = new Set();
  const melde = (art, text, schluessel = text) => {
    if (funde.length < 20 && !gemeldet.has(schluessel)) { gemeldet.add(schluessel); funde.push({ art, text }); }
  };
  const pruefeText = (wo) => {
    const t = buehne.textContent;
    const m = t.match(${VERDAECHTIG});
    if (!m) return;
    const stelle = t.slice(Math.max(0, m.index - 60), m.index + 40).replace(/\\s+/g, " ");
    melde("Text", wo + ": «" + stelle + "»", stelle);
  };
  const protokoll = () => JSON.parse(localStorage.getItem("lernspiele:protokoll") || "[]");
  let klicks = 0;
  let ohneFortschritt = 0;
  let letzterText = "";
  __uhr.weiter(50);
  // ?stufe=… startet direkt eine Runde; sonst bietet das Spiel diese Stufe nicht an.
  if (!buehne.querySelector(".fortschritt")) return { runden: 0, klicks: 0, funde: [{ art: "Stufe", text: "Stufe wird nicht angeboten (fehlt in def.stufen)" }] };
  pruefeText("Start");
  while (protokoll().length < runden && klicks < maxKlicks) {
    // Knöpfe und alles andere, das auf Tippen hört (SVG-Felder, Zahlenstrahl).
    const knoepfe = buehne.querySelectorAll("*").filter(b => (b.localName === "button" || b.__hoerer.click || b.__hoerer.pointerdown)
      && !b.disabled && !b.classList.contains("link") && !b.classList.contains("timer-schalter") && !/Andere Stufe/.test(b.textContent));
    if (!knoepfe.length) { __uhr.weiter(2000); if (++ohneFortschritt > 50) { melde("Hänger", "keine Knöpfe mehr"); break; } continue; }
    // Weiter- und Nochmal-Knöpfe bevorzugen, damit die Runde vorankommt.
    const vor = knoepfe.filter(b => /Weiter|Nochmal|Prüfen|OK/.test(b.textContent));
    const k = vor.length && Math.random() < 0.4 ? vor[Math.floor(Math.random() * vor.length)] : knoepfe[Math.floor(Math.random() * knoepfe.length)];
    if (k.__hoerer.pointerdown) k.dispatchEvent(Object.assign(new Event("pointerdown", { bubbles: true }), { clientX: Math.random() * 600 }));
    k.click();
    klicks++;
    __uhr.weiter(2000);
    pruefeText("nach Klick auf «" + k.textContent.trim().slice(0, 20) + "»");
    const jetzt = buehne.textContent;
    ohneFortschritt = jetzt === letzterText ? ohneFortschritt + 1 : 0;
    letzterText = jetzt;
  }
  for (const e of protokoll()) {
    if (!(e.sterne >= 1 && e.sterne <= 3) || !Number.isFinite(e.fehler) || !Number.isFinite(e.dauer)) melde("Protokoll", JSON.stringify(e).slice(0, 160));
    for (const f of e.fehlerAufgaben || []) if (${VERDAECHTIG}.test(f.text + " " + f.loesung)) melde("Protokoll", "Fehleraufgabe: " + (f.text + " → " + f.loesung).slice(0, 160));
  }
  return { runden: protokoll().length, klicks, funde };
})`;

// Generatoren im Kontext: aufgabeErzeugen + pruefeAufgabe, falls vorhanden.
const GENERATOR = `
(function generator(stufe, anzahl) {
  if (typeof aufgabeErzeugen !== "function") return null;
  const funde = [];
  const melde = (text) => { if (funde.length < 10 && !funde.includes(text)) funde.push(text); };
  const faul = (x, tiefe = 0) => {
    if (tiefe > 6 || x == null) return x === undefined;
    if (typeof x === "number") return !Number.isFinite(x);
    if (typeof x !== "object" || x.nodeType) return false;
    return Object.values(x).some(v => faul(v, tiefe + 1));
  };
  const mitPruefung = typeof pruefeAufgabe === "function";
  for (let i = 0; i < anzahl; i++) {
    const a = aufgabeErzeugen(stufe);
    if (a === undefined || faul(a)) melde("unvollständige Aufgabe: " + JSON.stringify(a).slice(0, 160));
    if (mitPruefung) for (const m of pruefeAufgabe(a, stufe) || []) melde(m + " — " + JSON.stringify(a).slice(0, 160));
  }
  return { anzahl, mitPruefung, funde };
})`;

function pruefe(id, stufe) {
  const seitenPfad = path.join(SPIELE_DIR, id, "index.html");
  const html = fs.readFileSync(seitenPfad, "utf8");
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1].replace(/<script[\s\S]*?<\/script>/g, "");
  const kontext = vm.createContext({ __seite: { html: body, search: "?stufe=" + stufe, seed: opt.seed }, console, URL, URLSearchParams, structuredClone });
  const ergebnis = { id, stufe, fehler: [], hinweise: [] };
  const lauf = (code, name, ms) => vm.runInContext(code, kontext, { filename: name, timeout: ms });
  try {
    lauf(DOM, "pruef_dom.js", 5000);
    // Testspieler anlegen, damit das Spiel ohne Namenswahl startet.
    lauf(`localStorage.setItem("lernspiele:profile", JSON.stringify({ Testlauf: {} }));
          localStorage.setItem("lernspiele:spieler", JSON.stringify("Testlauf"));`, "vorbereitung", 1000);
    for (const s of skripte(seitenPfad, html)) lauf(s.code, s.name, 5000);
    const gen = lauf(GENERATOR, "generator", 60000)(stufe, opt.aufgaben);
    if (gen) {
      ergebnis.generator = gen;
      for (const f of gen.funde) ergebnis.fehler.push("Generator: " + f);
    }
    const t = lauf(TREIBER, "treiber", 60000)(opt.runden, opt.maxKlicks);
    ergebnis.runden = t.runden;
    ergebnis.klicks = t.klicks;
    for (const f of t.funde) (f.art === "Hänger" ? ergebnis.hinweise : ergebnis.fehler).push(`${f.art}: ${f.text}`);
    if (t.runden < opt.runden) ergebnis.hinweise.push(`nur ${t.runden} von ${opt.runden} Runden mit ${t.klicks} Zufallsklicks geschafft`);
  } catch (e) {
    ergebnis.fehler.push(/timed out/.test(e.message) ? "Zeitlimit überschritten — Endlosschleife?" : `Abbruch: ${String(e.stack || e).split("\n").slice(0, 3).join(" | ")}`);
  }
  const laufFehler = vm.runInContext("typeof __fehler === 'undefined' ? [] : __fehler", kontext);
  for (const f of new Set(laufFehler)) ergebnis.fehler.push("Ausnahme: " + f);
  return ergebnis;
}

const ids = fs.readdirSync(SPIELE_DIR)
  .filter(d => d !== "gemeinsam" && fs.existsSync(path.join(SPIELE_DIR, d, "index.html")))
  .filter(d => !nurSpiele.length || nurSpiele.includes(d));

let fehlerZahl = 0;
console.log(`Prüfe ${ids.length} Spiele × ${STUFEN.length} Stufen (je ${opt.runden} Runden, ${opt.aufgaben} Generator-Aufgaben, Startwert ${opt.seed})\n`);
for (const id of ids) {
  for (const stufe of STUFEN) {
    const e = pruefe(id, stufe);
    const gen = e.generator ? ` · Generator ${e.generator.anzahl}${e.generator.mitPruefung ? " fachlich" : ""}` : "";
    const zeichen = e.fehler.length ? "✗" : e.hinweise.length ? "~" : "✓";
    console.log(`${zeichen} ${id.padEnd(22)} ${stufe}  Runden ${e.runden ?? "-"} · Klicks ${e.klicks ?? "-"}${gen}`);
    for (const f of e.fehler) console.log(`    FEHLER  ${f}`);
    for (const h of e.hinweise) console.log(`    hinweis ${h}`);
    fehlerZahl += e.fehler.length;
  }
}
console.log(`\n${fehlerZahl ? fehlerZahl + " Fehler" : "Keine Fehler"}.`);
process.exitCode = fehlerZahl ? 1 : 0;
