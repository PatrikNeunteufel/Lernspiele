// Abschluss-Animationen aller Spiele prüfen, ohne Runden zu spielen (LERN_Session31): jede Spielseite im Ersatz-DOM im
// Vorschau-Modus (?feier=s1) laden, die Angabe feier aus LS.spiel abfangen und mit den Prüfungen aus
// tools/feier_geometrie.js prüfen — je Stufe, 1–3 Sterne, bewegt und ruhig: Bild da, Schmuck zu den Sternen, Bewegung,
// gültige Animationen, Mengen, Lage, Schrift, Schmuck über Text, bewegtes Endbild gleich dem ruhigen. Dieselbe Prüfung
// läuft in tools/pruefe_spiele.js am Ende jeder Runde; hier dauert sie für alle 169 Spiele Sekunden statt 25 Minuten.
//
// Aufruf: node tools/pruefe_feier.js [spiel …]   (ohne Angabe alle Spiele mit „feier“ im Katalog)
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { skripte } = require("./listen_fingerabdruck");
const G = require("./feier_geometrie");

const WURZEL = path.join(__dirname, "..");
const SPIELE_DIR = path.join(WURZEL, "eulenpfad", "spiele");
const DOM = fs.readFileSync(path.join(__dirname, "pruef_dom.js"), "utf8");
const PRUEFUNG = `const { pruefeFeier: __pruefeFeier } = (${G.feierPruefungen.toString()})();`;
let fehler = 0;
const melde = (ort, text) => { console.log(`    FEHLER  ${ort}: ${text}`); fehler++; };

// ----- Gegenproben: jede Prüfung meldet, was sie melden soll, und bleibt sonst still -----
{
  const el = (localName, attr = {}, kinder = [], text = "") => {
    const e = { localName, children: kinder, attr: { ...attr },
      getAttribute: n => (n in e.attr ? String(e.attr[n]) : null), setAttribute: (n, v) => { e.attr[n] = String(v); },
      get textContent() { return text || kinder.map(k => k.textContent).join(""); } };
    return e;
  };
  const bild = (...k) => el("svg", { viewBox: "0 0 320 150" }, k);
  const arten = f => f.map(x => x.art);
  const FAELLE = [
    ["Funken auf einer Zahl", () => arten(G.pruefeFeierBild(bild(el("text", { x: 100, y: 54, "font-size": 12 }, [], "12"),
      el("g", { "data-schmuck": "3" }, [el("circle", { cx: 100, cy: 50, r: 12 })])))), "schmuck"],
    ["Funkenring um ein Bildzeichen", () => arten(G.pruefeFeierBild(bild(el("text", { x: 100, y: 59, "font-size": 24, "text-anchor": "middle" }, [], "🏆"),
      el("g", { "data-schmuck": "3" }, [0, 1, 2, 3, 4, 5, 6, 7].map(i => el("circle", { cx: 100 + Math.cos(i * Math.PI / 4) * 16, cy: 50 + Math.sin(i * Math.PI / 4) * 16, r: 2 })))))), null],
    ["Ring ohne Füllung um einen Buchstaben", () => arten(G.pruefeFeierBild(bild(el("text", { x: 100, y: 54, "font-size": 10, "text-anchor": "middle" }, [], "D"),
      el("g", { "data-schmuck": "2" }, [el("ellipse", { cx: 100, cy: 50, rx: 14, ry: 10, fill: "none" })])))), null],
    ["Scheinwerfer über einer Figur", () => arten(G.pruefeFeierBild(bild(el("text", { x: 160, y: 99, "font-size": 26, "text-anchor": "middle" }, [], "😊"),
      el("g", { "data-schmuck": "2", opacity: 0.16 }, [el("path", { d: "M100,22 L114,22 L180,116 L110,116 Z" })])))), null],
    ["umgedrehte Karte ist unsichtbar", () => G.pruefeFeierBild(bild(el("g", { transform: "scale(0.01 1)" }, [el("text", { x: 50, y: 50, "font-size": 12 }, [], "?")]))).texte.map(t => t.inhalt), null],
    ["Funken daneben", () => arten(G.pruefeFeierBild(bild(el("text", { x: 100, y: 54, "font-size": 12 }, [], "12"),
      el("g", { "data-schmuck": "3" }, [el("circle", { cx: 220, cy: 100, r: 12 })])))), null],
    ["Bildzeichen mit Verbinder als ein Zeichen", () => arten(G.pruefeFeierBild(bild(el("text", { x: 20, y: 80, "font-size": 30, "text-anchor": "middle" }, [], "👩‍🏫")))), null],
    ["Bildzeichen mit Variantenzeichen als eines", () => arten(G.pruefeFeierBild(bild(el("text", { x: 12, y: 80, "font-size": 20, "text-anchor": "middle" }, [], "☀️")))), null],
    ["animate r an einem Rechteck", () => arten(G.pruefeAnimationen(bild(el("rect", {}, [el("animate", { attributeName: "r" })])))), "attribut"],
    ["animateTransform ohne transform", () => arten(G.pruefeAnimationen(bild(el("g", {}, [el("animateTransform", { attributeName: "opacity", type: "scale" })])))), "attribut"],
    ["animate opacity an einem Kreis", () => arten(G.pruefeAnimationen(bild(el("circle", {}, [el("animate", { attributeName: "opacity" })])))), null],
    ["spline ohne keySplines", () => arten(G.pruefeAnimationen(bild(el("g", {}, [el("animateTransform", { attributeName: "transform", type: "translate", calcMode: "spline", keyTimes: "0;1" })])))), "zeiten"],
    ["spline stimmig", () => arten(G.pruefeAnimationen(bild(el("g", {}, [el("animateTransform", { attributeName: "transform", type: "translate", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" })])))), null],
    ["drei values, zwei keyTimes", () => arten(G.pruefeAnimationen(bild(el("g", {}, [el("animate", { attributeName: "opacity", values: "0;1;0", keyTimes: "0;1" })])))), "zeiten"],
    ["keyTimes nicht bis 1", () => arten(G.pruefeAnimationen(bild(el("g", {}, [el("animate", { attributeName: "opacity", values: "0;1", keyTimes: "0;0.5" })])))), "zeiten"],
    ["herein: Ende an Ort und Stelle", () => {
      const t = G.pruefeFeierBild(G.endZustand(bild(el("g", { transform: "translate(50 0)" }, [el("animateTransform", { attributeName: "transform", type: "translate", from: "50 0", to: "0 0", fill: "freeze" }),
        el("text", { x: 10, y: 20, "font-size": 10 }, [], "1")])))).texte[0];
      return Math.abs(t.x - 12.9) < 1 ? [] : [`bei ${t.x}`]; // Mitte des Texts „1“ (Breite 5.8) ab x = 10
    }, null],
    ["animateMotion: Ende des Wegs", () => {
      const t = G.pruefeFeierBild(G.endZustand(bild(el("g", {}, [el("animateMotion", { path: "M0,0 L100,50", fill: "freeze" }), el("text", { x: 0, y: 4, "font-size": 10 }, [], "1")])))).texte[0];
      return Math.hypot(t.x - 101, t.y - 50) < 3 ? [] : [`bei ${t.x}, ${t.y}`];
    }, null],
    ["kurz: am Ende unsichtbar", () => G.pruefeFeierBild(G.endZustand(bild(el("text", { x: 50, y: 50, "font-size": 10, opacity: 0 }, [el("set", { attributeName: "opacity", to: 1 }),
      el("animate", { attributeName: "opacity", from: 1, to: 0, fill: "freeze" })], "x")))).texte.map(t => t.inhalt), null],
  ];
  for (const [name, f, art] of FAELLE) {
    const r = f();
    if (art ? !r.includes(art) : r.length) melde(`Gegenprobe „${name}“`, `erwartet ${art || "keine Meldung"}, ergab ${JSON.stringify(r)}`);
  }
}

/** Eine Spielseite im Vorschau-Modus laden; → { feier, stufen } oder null (kein feier), wirft bei Ausnahmen. */
function lade(id) {
  const seitenPfad = path.join(SPIELE_DIR, id, "index.html");
  const html = fs.readFileSync(seitenPfad, "utf8");
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1].replace(/<script[\s\S]*?<\/script>/g, "");
  const ruhig = { log() {}, warn() {}, info() {}, error() {} };
  const kontext = vm.createContext({ __seite: { html: body, search: "?feier=s1&sterne=3", seed: 1 }, console: ruhig, URL, URLSearchParams, structuredClone });
  const lauf = (code, name) => vm.runInContext(code, kontext, { filename: name, timeout: 10000 });
  lauf(DOM, "pruef_dom.js");
  for (const s of skripte(seitenPfad, html)) {
    lauf(s.code, s.name);
    // nach spiel.js: die Angabe des Spiels abfangen (LS.spiel und LS.spielMitStimme geben sie weiter)
    if (/gemeinsam[\\/]spiel\.js$/.test(s.name)) lauf(`for (const k of ["spiel", "spielMitStimme"]) { const alt = LS[k]; LS[k] = (d, ...r) => { globalThis.__def ||= d; return alt(d, ...r); }; }`, "abfangen");
  }
  lauf("__uhr.weiter(5000)", "warten"); // Spiele, die auf eine Stimme warten
  const def = vm.runInContext("typeof __def === 'undefined' ? null : __def", kontext);
  // die Angabe steht im Katalog (GS1 a), bei Seiten, die Daten der Seite brauchen, in LS.spiel
  if (!def || !(def.feier || kat.SPIELE.find(x => x.id === id)?.feier)) return null;
  // alle Stufen des Katalogs, nicht nur die angebotenen (die hängen an freien Inhaltslisten)
  const eintrag = kat.SPIELE.find(x => x.id === id);
  return { kontext, stufen: [...(eintrag && eintrag.stufen) || Object.keys(def.stufen || {})] };
}

const kat = vm.createContext({ LS: { SKALA: [] } });
vm.runInContext(fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", "katalog.js"), "utf8") + ";this.SPIELE = SPIELE;", kat);
const mitFeier = kat.SPIELE.filter(s => (s.einstellungen || []).includes("feier")).map(s => s.id);
const ids = process.argv.slice(2).filter(a => !a.startsWith("--"));
for (const id of ids) if (!kat.SPIELE.some(s => s.id === id)) { console.log(`Unbekanntes Spiel „${id}“.`); process.exit(2); }
const liste = ids.length ? ids : mitFeier;
let geprueft = 0, bilder = 0;
for (const id of liste) {
  let s;
  try { s = lade(id); } catch (e) { melde(id, `Seite lädt nicht: ${e.message}`); continue; }
  if (!s) { if (mitFeier.includes(id)) melde(id, "im Katalog mit „feier“, aber ohne feier in LS.spiel"); continue; }
  if (!mitFeier.includes(id)) melde(id, "feier in LS.spiel, aber im Katalog ohne „feier“ in einstellungen");
  let m;
  try { m = vm.runInContext(`${PRUEFUNG}; typeof LS_FEIER === "undefined" ? null : __pruefeFeier(LS_FEIER, __def.feier || SPIELE.find(x => x.id === __def.id)?.feier,${JSON.stringify(s.stufen)})`, s.kontext, { timeout: 30000 }); }
  catch (e) { melde(id, `Prüfung bricht ab: ${e.message}`); continue; }
  if (m === null) { melde(id, "feier in LS.spiel, aber feier.js nicht geladen"); continue; }
  geprueft++;
  bilder += s.stufen.length * 6;
  const schon = new Set();
  for (const x of m) if (!schon.has(x.schluessel)) { schon.add(x.schluessel); melde(id, x.text); }
}
const zeile = fehler ? `${fehler} Fehler.` : `${geprueft} Spiele, ${bilder} Bilder, keine Fehler.`;
console.log(`\n${zeile}`);
require("./testausgabe.js").merke("pruefe_feier", zeile); // HK1 a
process.exit(fehler ? 1 : 0);
