// Prüft den gemeinsamen Kern (kern/, Plan docs/plan_angleich_reihe.md B2): jede Funktion gegen feste Beispiele und
// gegen unabhängige Nachrechnungen, dazu die Kopien in den Apps (tools/kern_verteilen.py --pruefe).
// Aufruf: node tools/pruefe_kern.js   — Ende mit Code 1 bei einem Fehler.
"use strict";
const path = require("path");
const { execFileSync } = require("child_process");

const WURZEL = path.join(__dirname, "..");
const KERN = require(path.join(WURZEL, "kern", "zahl.js"));
require(path.join(WURZEL, "kern", "bruch.js"));
require(path.join(WURZEL, "kern", "terme.js"));
require(path.join(WURZEL, "kern", "rechner.js"));
require(path.join(WURZEL, "kern", "speicher.js"));
require(path.join(WURZEL, "kern", "zufall.js"));
require(path.join(WURZEL, "kern", "el.js"));
require(path.join(WURZEL, "kern", "geheimnis.js"));
require(path.join(WURZEL, "kern", "person.js"));
require(path.join(WURZEL, "kern", "rollen.js"));
require(path.join(WURZEL, "kern", "freigabe.js"));
require(path.join(WURZEL, "kern", "suche.js"));
require(path.join(WURZEL, "kern", "runden.js"));
require(path.join(WURZEL, "kern", "runde.js"));
require(path.join(WURZEL, "kern", "daten.js"));
require(path.join(WURZEL, "kern", "abgleich.js"));
require(path.join(WURZEL, "kern", "anmeldung.js"));
require(path.join(WURZEL, "kern", "entwicklung.js"));
require(path.join(WURZEL, "kern", "einladung.js"));
require(path.join(WURZEL, "kern", "auswertung.js"));
require(path.join(WURZEL, "kern", "rolleiste.js"));
require(path.join(WURZEL, "kern", "personenmenue.js"));
require(path.join(WURZEL, "kern", "tastenfeld.js"));
require(path.join(WURZEL, "kern", "notizblock.js"));
// Alle Teile aus kern/TEILE müssen hier geladen und geprüft sein.
{
  const fs = require("fs");
  const teile = fs.readFileSync(path.join(WURZEL, "kern", "TEILE"), "utf8").split(/\r?\n/).map(z => z.trim()).filter(z => z && !z.startsWith("#"));
  const geladen = Object.keys(require.cache).map(p => path.basename(p));
  for (const t of teile) if (!geladen.includes(t)) { console.log(`    FEHLER  kern/${t} wird in pruefe_kern.js nicht geprüft`); process.exitCode = 1; }
}

let fehler = 0, faelle = 0;
function gleich(ist, soll, was) {
  faelle++;
  if (ist !== soll) { fehler++; console.log(`    FEHLER  ${was}: ${JSON.stringify(ist)} statt ${JSON.stringify(soll)}`); }
}
function wirft(f, was) {
  faelle++;
  try { f(); fehler++; console.log(`    FEHLER  ${was}: kein Fehler gemeldet`); } catch (e) { /* erwartet */ }
}

// ---------- Zahlschreibung ----------
const SCHMAL = " ", M = "−";
const EP = { tausender: SCHMAL, abStellen: 5, minus: M, dezimal: "." };
const LST = { tausender: "'", abStellen: 4, minus: M, dezimal: "." };
const Z = KERN.zahl;
console.log("zahl.js");
for (const [n, ep, lst] of [
  [0, "0", "0"], [7, "7", "7"], [999, "999", "999"], [4500, "4500", "4'500"], [30400, `30${SCHMAL}400`, "30'400"],
  [-1000, `${M}1000`, `${M}1'000`], [1234567, `1${SCHMAL}234${SCHMAL}567`, "1'234'567"],
  [9007199254740991, `9${SCHMAL}007${SCHMAL}199${SCHMAL}254${SCHMAL}740${SCHMAL}991`, "9'007'199'254'740'991"],
  [1234.5678, "1234.5678", "1'234.5678"], [12345.5, `12${SCHMAL}345.5`, "12'345.5"], [0.1 + 0.2, "0.3", "0.3"],
  [4.485e-8, "0.00000004485", "0.00000004485"], [-0, "0", "0"], [-0.5, `${M}0.5`, `${M}0.5`],
]) {
  gleich(Z.text(n, EP), ep, `text(${n}) Eulenpfad`);
  gleich(Z.text(n, LST), lst, `text(${n}) Lernsteig`);
}
gleich(Z.dezimalText(2.5, 2, EP), "2.50", "dezimalText(2.5, 2)");
gleich(Z.dezimalText(-0.001, 2, LST), "0.00", "dezimalText(−0.001, 2) ohne −0");
gleich(Z.dezimalText(12345.678, 1, { ...EP, dezimal: "," }), `12${SCHMAL}345,7`, "dezimalText mit Komma");
gleich(Z.text(NaN, EP), "NaN", "text(NaN)");
gleich(Z.text(Infinity, LST), "Infinity", "text(Infinity)");
// Rücklesen: lies(text(x)) === x für viele Zufallszahlen in beiden Schreibweisen
for (let i = 0; i < 20000; i++) {
  const stellen = Math.floor(Math.random() * 4);
  const x = Math.round((Math.random() - 0.5) * 10 ** (1 + Math.floor(Math.random() * 9)) * 10 ** stellen) / 10 ** stellen;
  for (const [sw, name] of [[EP, "Eulenpfad"], [LST, "Lernsteig"], [{ ...LST, dezimal: "," }, "Komma"]]) {
    const t = Z.text(x, sw);
    if (Z.lies(t) !== x) { gleich(Z.lies(t), x, `lies(text(${x})) ${name}`); break; }
  }
}
faelle++;
for (const [e, soll] of [["−12.5", -12.5], ["-3", -3], ["–4", -4], ["1'000", 1000], ["30 400", 30400], ["0,75", 0.75],
  [".5", 0.5], ["abc", null], ["1.2.3", null], ["", null], ["--1", null]]) gleich(Z.lies(e), soll, `lies(${JSON.stringify(e)})`);

// ---------- Brüche ----------
const B = KERN.bruch;
console.log("bruch.js");
const t = b => B.text(b);
gleich(t(B.bruch(6, -8)), "-3/4", "bruch(6, −8)");
gleich(t(B.plus(B.bruch(1, 3), B.bruch(1, 6))), "1/2", "1/3 + 1/6");
gleich(t(B.minus(B.bruch(1, 2), B.bruch(3, 4))), "-1/4", "1/2 − 3/4");
gleich(t(B.mal(B.bruch(2, 3), B.bruch(9, 4))), "3/2", "2/3 · 9/4");
gleich(t(B.durch(B.bruch(2, 3), B.bruch(4, 9))), "3/2", "2/3 : 4/9");
gleich(t(B.hoch(B.bruch(-2, 3), 3)), "-8/27", "(−2/3)³");
gleich(t(B.wurzel(B.bruch(9, 16), 2)), "3/4", "√(9/16)");
gleich(B.wurzelGanz(10n ** 40n, 2), 10n ** 20n, "√10^40 exakt");
gleich(B.wurzelGanz(10n ** 40n + 1n, 2), null, "√(10^40 + 1) nicht ganz");
gleich(B.wurzelGanz(8000n, 3), 20n, "³√8000");
wirft(() => B.wurzel(B.bruch(2), 2), "√2 nicht exakt");
wirft(() => B.bruch(1, 0), "Division durch 0");
gleich(t(B.zahl("1'234.5")), "2469/2", "zahl(1'234.5)");
gleich(t(B.zahl("-0.25")), "-1/4", "zahl(−0.25)");
gleich(t(B.zahl("0,5")), "1/2", "zahl(0,5)");
gleich(t(B.zahl(`30${SCHMAL}400`)), "30400", "zahl(30 400)");
wirft(() => B.zahl("abc"), "zahl(abc)");
wirft(() => B.zahl("."), "zahl(.)");
gleich(t(B.vonZahl(0.1)), "1/10", "vonZahl(0.1)");
gleich(t(B.vonZahl(4.485e-8)), "897/20000000000", "vonZahl(4.485e−8)");
gleich(t(B.vonZahl(9007199254740991)), "9007199254740991", "vonZahl(2^53 − 1)");
wirft(() => B.vonZahl(NaN), "vonZahl(NaN)");
gleich(B.vergleich(B.bruch(1, 3), B.bruch(1, 2)), -1, "1/3 < 1/2");
gleich(B.endlich(B.bruch(3, 8)), true, "3/8 endlich");
gleich(B.endlich(B.bruch(1, 3)), false, "1/3 nicht endlich");
// Körperregeln an Zufallsbrüchen gegen Gleitkomma nachgerechnet
for (let i = 0; i < 5000; i++) {
  const r = () => B.bruch(Math.floor(Math.random() * 41) - 20, 1 + Math.floor(Math.random() * 30));
  const a = r(), b = r(), c = r();
  faelle++;
  const links = B.mal(a, B.plus(b, c)), rechts = B.plus(B.mal(a, b), B.mal(a, c));
  if (!B.gleich(links, rechts) || Math.abs(B.alsZahl(B.plus(a, b)) - (B.alsZahl(a) + B.alsZahl(b))) > 1e-9) {
    fehler++; console.log(`    FEHLER  Rechenregeln mit ${t(a)}, ${t(b)}, ${t(c)}`); break;
  }
}

// ---------- Speicher ----------
console.log("speicher.js");
{
  const S = KERN.speicher;
  // ohne localStorage (Node): lesen gibt den Ersatz, schreiben false
  gleich(S("lernspiele:").lies("x", 7), 7, "lies ohne Speicher");
  gleich(S("lernspiele:").schreibe("x", 1), false, "schreibe ohne Speicher");
  // mit einem Ersatz-Speicher
  const daten = new Map();
  let voll = false;
  global.localStorage = {
    getItem: k => (daten.has(k) ? daten.get(k) : null),
    setItem: (k, v) => { if (voll) throw new Error("QuotaExceededError"); daten.set(k, String(v)); },
    removeItem: k => daten.delete(k),
    key: i => [...daten.keys()][i] ?? null,
    get length() { return daten.size; },
  };
  const ep = S("lernspiele:"), lst = S("lernsteig:");
  gleich(ep.schreibe("profile", { a: 1 }), true, "schreibe");
  gleich(JSON.stringify(ep.lies("profile", null)), '{"a":1}', "lies");
  gleich(lst.lies("profile", "leer"), "leer", "anderes Präfix liest nichts Fremdes");
  lst.schreibe("konten", []);
  gleich(JSON.stringify(ep.schluessel()), '["profile"]', "schluessel je Präfix");
  daten.set("lernspiele:kaputt", "{nicht json");
  gleich(ep.lies("kaputt", "ersatz"), "ersatz", "kaputtes JSON → Ersatz");
  voll = true;
  gleich(ep.schreibe("neu", 1), false, "voller Speicher → false");
  voll = false;
  ep.entferne("profile");
  gleich(ep.lies("profile", null), null, "entferne");
  wirft(() => S("lernspiele"), "Präfix ohne Doppelpunkt");
  wirft(() => S(""), "leeres Präfix");
  delete global.localStorage;
}

// ---------- Zufall ----------
console.log("zufall.js");
{
  const Zf = KERN.zufall;
  const alt = Zf.quelle.zufall;
  Zf.quelle.zufall = Zf.mitStartwert(42);
  const a = Array.from({ length: 50 }, () => Zf.zufall(1, 6));
  Zf.quelle.zufall = Zf.mitStartwert(42);
  const b = Array.from({ length: 50 }, () => Zf.zufall(1, 6));
  gleich(a.join(), b.join(), "gleicher Startwert, gleiche Folge");
  Zf.quelle.zufall = alt;
  const zaehl = new Map();
  for (let i = 0; i < 60000; i++) { const w = Zf.zufall(1, 6); zaehl.set(w, (zaehl.get(w) || 0) + 1); }
  gleich([...zaehl.keys()].sort().join(), "1,2,3,4,5,6", "zufall(1, 6) trifft genau 1 bis 6");
  faelle++;
  if ([...zaehl.values()].some(n => Math.abs(n - 10000) > 600)) { fehler++; console.log("    FEHLER  zufall(1, 6) ungleich verteilt"); }
  const liste = [1, 2, 3, 4, 5, 6, 7, 8];
  const m = Zf.mische(liste);
  gleich(m.slice().sort().join(), liste.join(), "mische behält alle Elemente");
  gleich(liste.join(), "1,2,3,4,5,6,7,8", "mische ändert die Vorlage nicht");
  // Math.random wird erst beim Aufruf gelesen (Ersatz-DOM des Eulenpfads ersetzt es)
  const mr = Math.random;
  Math.random = () => 0;
  gleich(Zf.zufall(3, 9), 3, "Quelle liest Math.random beim Aufruf");
  gleich(Zf.waehle(["a", "b"]), "a", "waehle über Math.random");
  Math.random = mr;
}

// ---------- el ----------
console.log("el.js");
{
  // kleiner Ersatz für document: genug für Attribute, Text und Kinder
  const knoten = tag => ({
    tag, attribute: {}, kinder: [], hoerer: {}, className: "", textContent: "", innerHTML: "",
    setAttribute(k, v) { this.attribute[k] = String(v); },
    addEventListener(t, f) { this.hoerer[t] = f; },
    append(...k) { this.kinder.push(...k); },
  });
  global.document = { createElement: knoten };
  const klick = () => {};
  const e = KERN.el("button", { class: "knopf", text: "OK", onclick: klick, disabled: true, hidden: false, title: null,
    "aria-pressed": "false", "data-n": 0 }, "a", null, false, ["b", ["c"]], undefined);
  gleich(e.className, "knopf", "class");
  gleich(e.textContent, "OK", "text");
  gleich(e.hoerer.click, klick, "onclick");
  gleich(e.attribute.disabled, "", "true → leeres Attribut");
  gleich("hidden" in e.attribute || "title" in e.attribute, false, "false/null → kein Attribut");
  gleich(e.attribute["aria-pressed"], "false", "Text „false“ bleibt");
  gleich(e.attribute["data-n"], "0", "0 bleibt");
  gleich(e.kinder.join(), "a,b,c", "Kinder flach, ohne null/false/undefined");
  gleich(KERN.el("p", { html: "<b>x</b>" }).innerHTML, "<b>x</b>", "html");
  delete global.document;
}

// ---------- terme ----------
console.log("terme.js");
{
  const T = KERN.terme, B = KERN.bruch;
  const SW = { tausender: "'", abStellen: 4, minus: "\u2212", dezimal: "." }; // Schreibweise des Lernsteigs
  const tx = s => T.text(T.lies(s).poly, SW);
  gleich(tx("2(x+1)"), "2x + 2", "Klammer auflösen");
  // Ordnung wie im Lehrmittel (TO1 a): Grad, dann je Variable im Alphabet der höhere Exponent zuerst
  gleich(tx("(a+b)^2"), "a\u00B2 + 2ab + b\u00B2", "Binom");
  gleich(tx("(a-b)^2"), "a\u00B2 \u2212 2ab + b\u00B2", "Binom mit Minus");
  gleich(tx("(x+y)(x-y)"), "x\u00B2 \u2212 y\u00B2", "dritte binomische Formel");
  gleich(tx("ab^2+a^2b"), "a\u00B2b + ab\u00B2", "Grad 3: a²b vor ab²");
  gleich(tx("ac+ab+b+a+1"), "ab + ac + a + b + 1", "gleicher Grad ohne Quadrat, dann Grad 1, Konstante");
  gleich(tx("y+x^2+x"), "x\u00B2 + x + y", "höherer Grad zuerst, auch bei späterer Variable");
  gleich(tx("3a\u00B74a"), "12a\u00B2", "Produkt");
  gleich(tx("-3+a"), "a \u2212 3", "Konstante zuletzt, Minus der Schreibweise");
  gleich(tx("1000a"), "1'000a", "Zahl in der Schreibweise der App");
  gleich(tx("x^10"), "x\u00B9\u2070", "Exponent 10 hochgestellt (war „x1⁰“)");
  gleich(tx("x:2"), "1/2x", "Bruch als Faktor");
  gleich(tx("a-a"), "0", "null");
  gleich(T.text(T.lies("-5").poly), "\u22125", "ohne Schreibweise: Standard des Kerns");
  gleich(T.gleich(T.lies("2(x+3)").poly, T.lies("2x+6").poly), true, "gleichwertig");
  gleich(T.gleich(T.lies("(x+1)\u00B2").poly, T.lies("x^2+2x+1").poly), true, "hochgestellte Potenz");
  gleich(T.gleich(T.lies("2x").poly, T.lies("2y").poly), false, "verschiedene Variablen");
  gleich(T.gleich(T.lies("x\u00B2\u00B3").poly, T.lies("x^23").poly), true, "x²³ ist x^23 (war (x²)³)");
  gleich(T.gleich(T.lies("x\u00B9\u2070").poly, T.lies("x^10").poly), true, "x¹⁰ wird gelesen (⁰ und ¹ fehlten)");
  gleich(T.gleich(T.lies("1'000,5a").poly, T.lies("1000.5a").poly), true, "Apostroph und Komma");
  wirft(() => T.lies("2x+"), "unvollständig wirft");
  wirft(() => T.lies("x:y"), "durch Variable wirft");
  wirft(() => T.lies(""), "leer wirft");
  // D10: grosse Exponenten und Termriesen werfen sofort, statt den Tab einzufrieren
  const t0 = Date.now();
  wirft(() => T.lies("x^99999999"), "Exponent über der Grenze");
  wirft(() => T.lies("(a+b+c+d+e)^60"), "Term zu gross");
  gleich(Date.now() - t0 < 2000, true, "Grenzen greifen schnell");
  gleich(T.text(T.lies("x^100").poly), "x\u00B9\u2070\u2070", "Exponent an der Grenze geht");

  const bw = (e, ziel, form) => { const r = T.bewerte(e, { antwortTerm: ziel, form }); return r.ok ? "ok" : !r.lesbar ? "unlesbar" : !r.gleichwertig ? "falsch" : "form"; };
  gleich(bw("2x+6", "2(x+3)", "vereinfacht"), "ok", "vereinfacht richtig");
  gleich(bw("2(x+3)", "2x+6", "vereinfacht"), "form", "vereinfacht mit Klammer");
  gleich(bw("x+x+6", "2x+6", "vereinfacht"), "form", "vereinfacht nicht zusammengefasst");
  gleich(bw("2\u00B73x", "6x", "vereinfacht"), "form", "vereinfacht nicht ausgerechnet");
  gleich(bw("2x+7", "2x+6", "vereinfacht"), "falsch", "falscher Wert");
  gleich(bw("5^3", "125", "potenz"), "ok", "Potenz");
  gleich(bw("125", "5^3", "potenz"), "form", "Potenz verlangt");
  gleich(bw("3(2x+1)", "6x+3", "ausgeklammert"), "ok", "ausgeklammert");
  gleich(bw("(3)(2x+1)", "6x+3", "ausgeklammert"), "form", "D3: (3)(2x+1) ohne Absturz");
  gleich(bw("(3)(2x+3)", "6x+9", "ausgeklammert"), "form", "D3: Beispiel aus dem Befund");
  gleich(bw("6(x+0.5)", "6x+3", "ausgeklammert"), "form", "ausgeklammert mit Bruch in der Klammer");
  gleich(bw("1(6x+3)", "6x+3", "ausgeklammert"), "form", "ggT nicht ausgeklammert");
  gleich(bw("3/4", "0.75", "bruch"), "ok", "Bruch");
  gleich(bw("6/8", "3/4", "bruch"), "form", "Bruch nicht gekürzt");
  gleich(bw("0.75", "3/4", "bruch"), "form", "Dezimalbruch statt Bruch");
  gleich(bw("4/1", "4", "bruch"), "form", "ganze Zahl mit Nenner");
  gleich(bw("2x+", "2x", "frei"), "unlesbar", "unlesbar");
  gleich(bw("x^99999999", "x", "frei"), "unlesbar", "D10: zu gross ist unlesbar, ohne Hänger");
  gleich(/zu gross/.test(T.bewerte("x^99999999", { antwortTerm: "x" }).meldung), true, "D10: Meldung nennt die Grenze");
  wirft(() => T.bewerte("x", { antwortTerm: "x+" }), "unlesbarer antwortTerm ist ein Fehler der Aufgabe");

  // Nachrechnung: zufällige Terme als Polynom gelesen und an zufälligen Stellen mit JavaScript-Zahlen ausgewertet
  const zuf = (() => { let s = 5; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; })();
  const ganz = n => Math.floor(zuf() * n);
  function erzeuge(tiefe) {
    if (tiefe <= 0 || zuf() < 0.3) {
      const r = ganz(4);
      if (r === 0) { const k = String(1 + ganz(9)); return { t: k, j: k }; }
      const v = "xy"[ganz(2)];
      return { t: v, j: v };
    }
    const a = erzeuge(tiefe - 1), b = erzeuge(tiefe - 1), op = ganz(5);
    if (op === 0) return { t: `${a.t}+${b.t}`, j: `${a.j}+${b.j}` };
    if (op === 1) return { t: `${a.t}-(${b.t})`, j: `${a.j}-(${b.j})` };
    if (op === 2) return { t: `(${a.t})(${b.t})`, j: `(${a.j})*(${b.j})` };
    if (op === 3) return { t: `(${a.t})^2`, j: `(${a.j})**2` };
    const k = 2 + ganz(5);
    return { t: `(${a.t}):${k}`, j: `(${a.j})/${k}` };
  }
  const wert = (p, x, y) => [...p].reduce((s, [k, w]) => {
    let f = Number(w.z) / Number(w.n);
    for (const [, v, n] of k.matchAll(/([a-z])(\d+)/g)) f *= (v === "x" ? x : y) ** Number(n);
    return s + f;
  }, 0);
  let abw = 0, rund = 0;
  for (let fall = 0; fall < 2000; fall++) {
    const e = erzeuge(4), p = T.lies(e.t).poly;
    const x = ganz(7) - 3, y = ganz(7) - 3;
    const soll = Function("x", "y", `return ${e.j};`)(x, y), ist = wert(p, x, y);
    if (Math.abs(soll - ist) > 1e-9 * Math.max(1, Math.abs(soll))) abw++;
    // text → lies ergibt dasselbe Polynom (Schreibweise des Lernsteigs mit Apostroph und Minuszeichen)
    if (!T.gleich(T.lies(T.text(p, SW)).poly, p)) rund++;
  }
  gleich(abw, 0, "Polynom = Zahlwert (2000 Zufallsterme)");
  gleich(rund, 0, "text und lies umkehrbar (2000 Zufallsterme)");
}

// ---------- rechner ----------
console.log("rechner.js");
{
  const RK = KERN.rechner;
  const SW = { tausender: "'", abStellen: 4, minus: "\u2212", dezimal: "." };
  const M = RK.MINUS, V = RK.VORZ, W = "\u221A", N = RK.NTE_INDEX, Q = "x\u00B2", P = "\u00B7";
  const z = s => s.split("");
  const zeig = e => { const r = RK.rechne(e); return r.fehler ? "Fehler: " + r.fehler : RK.anzeige(r.wert, SW); };
  // Beispiele aus dem Lehrplan (MA.1.A.3.i) und aus den Anleitungen (R11 Abschnitt 2), wie im Testskript des Lernsteigs
  const faelle = [
    [[...z("4"), "^", "3", P, "4", "^", "3"], "4'096"], [[...z("4"), "^", "3", "+", "4", "^", "3"], "128"],
    [["3", N, ...z("8000")], "20"], [[W, ...z("196")], "14"], [[V, "2", Q], M + "4"], [["(", V, "2", ")", Q], "4"],
    [[...z("4+8"), M, "2", P, "3"], "6"], [["1", ":", "3"], "0.3333333333"], [[...z("1.32"), P, "1", "0", "^", "8"], "132'000'000"],
    [["2", N, ...z("16")], "4"], [["(", "2", "+", "3"], "5"],
    [[...z("256"), RK.WURZEL_NACH, "+", "4", RK.WURZEL_NACH], "18"], [["8", RK.NTE_RADIKAND, "3"], "2"],
    [["5", "^", "3"], "125"], [["6", N, "6", "4"], "2"], [["3", RK.VORZ_NACH], M + "3"],
    [["1", ":", "0"], "Fehler: Division durch 0"], [[W, V, "4"], "Fehler: gerade Wurzel aus negativer Zahl"],
    [["+"], "Fehler: Eingabe unvollständig"], [[], "Fehler: Eingabe fehlt"], [["Ans"], "Fehler: noch kein Ergebnis"],
    // D9: NaN heisst „nicht definiert“, nicht „zu gross“; unendlich bleibt „zu gross“
    [["(", V, "8", ")", "^", "0", ".", "5"], "Fehler: nicht definiert"], [["1", "0", "^", "4", "0", "0"], "Fehler: Ergebnis zu gross"],
  ];
  for (const [e, soll] of faelle) gleich(zeig(e), soll, `rechne ${e.join(" ")}`);
  gleich(RK.rechne(["Ans", "+", "1"], 2).wert, 3, "Ans");
  // D9: höchstens 10 gültige Ziffern, erst gerundet, dann über wissenschaftlich entschieden
  gleich(RK.anzeige(9999999999.6, SW), "1 \u00B7 10\u00B9\u2070", "9999999999.6 → 1 · 10¹⁰ (war elfstellig)");
  gleich(RK.anzeige(1234567890.4, SW), "1'234'567'890", "zehn Stellen bleiben ausgeschrieben");
  gleich(RK.anzeige(0.0000001234, SW), "1.234 \u00B7 10\u207B\u2077", "klein wissenschaftlich");
  gleich(RK.anzeige(-2.5e12, SW), "\u22122.5 \u00B7 10\u00B9\u00B2", "negativ gross");
  gleich(RK.anzeige(0, SW), "0", "null");
  gleich(RK.anzeige(1234.5), "1234.5", "ohne Schreibweise: Standard des Kerns");
  // Nachrechnung: zufällige Rechnungen gegen JavaScript, Anzeige nie mit mehr als 10 Ziffern
  let abw = 0, lang = 0;
  const zuf = (() => { let s = 9; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; })();
  const zahlText = () => String(Math.floor(zuf() * 100000) / (zuf() < 0.5 ? 1 : 100));
  const OPS = [["+", (a, b) => a + b], [M, (a, b) => a - b], [P, (a, b) => a * b], [":", (a, b) => a / b], ["^", (a, b) => a ** (b % 4)]];
  for (let fall = 0; fall < 2000; fall++) {
    const a = zahlText(), b = zahlText(), [op, f] = OPS[Math.floor(zuf() * OPS.length)];
    const bb = op === "^" ? String(Number(b) % 4) : b;
    const r = RK.rechne([...z(a), op, ...z(bb)]);
    const soll = f(Number(a), Number(bb));
    if (op === ":" && Number(bb) === 0) { if (!r.fehler) abw++; continue; }
    if (r.fehler || Math.abs(r.wert - soll) > 1e-12 * Math.max(1, Math.abs(soll))) abw++;
    else if (RK.anzeige(r.wert, SW).split(" ")[0].replace(/\D/g, "").replace(/^0+/, "").length > 10) lang++;
  }
  gleich(abw, 0, "rechne = JavaScript (2000 Zufallsrechnungen)");
  gleich(lang, 0, "Anzeige höchstens 10 Ziffern (2000 Zufallsrechnungen)");
}

// ---------- rolleiste ----------
console.log("rolleiste.js");
{
  const z = KERN.rolleiste.zustand;
  const txt = o => (o.links ? "L" : "-") + (o.rechts ? "R" : "-");
  gleich(txt(z(0, 300, 300)), "--", "passt ganz: keine Pfeile");
  gleich(txt(z(0, 300, 400)), "--", "breiter als nötig: keine Pfeile");
  gleich(txt(z(0, 600, 300)), "-R", "am Anfang: nur rechts");
  gleich(txt(z(150, 600, 300)), "LR", "in der Mitte: beide");
  gleich(txt(z(300, 600, 300)), "L-", "am Ende: nur links");
  gleich(txt(z(299.5, 600, 300)), "L-", "gebrochener Rollwert am Ende (Zoom) zählt als Ende");
  gleich(txt(z(0.5, 600, 300)), "-R", "gebrochener Rollwert am Anfang zählt als Anfang");
  // Nachrechnung: rechts genau dann, wenn links + sichtbar das Ende um mehr als 1 px verfehlt
  let abw = 0;
  for (let i = 0; i < 2000; i++) {
    const breite = Math.floor(Math.random() * 1000), sichtbar = Math.floor(Math.random() * 1000);
    const links = Math.random() * Math.max(0, breite - sichtbar);
    const o = z(links, breite, sichtbar);
    if (o.links !== links > 1 || o.rechts !== breite - (links + sichtbar) > 1) abw++;
  }
  gleich(abw, 0, "Zufallsfälle (2000)");
}

// ---------- personenmenue ----------
console.log("personenmenue.js");
{
  const nx = KERN.personenMenue.naechster;
  gleich(nx(-1, 3, "ArrowDown"), 0, "ab ohne Fokus: erster");
  gleich(nx(-1, 3, "ArrowUp"), 2, "auf ohne Fokus: letzter");
  gleich(nx(2, 3, "ArrowDown"), 0, "ab am Ende: zurück zum ersten");
  gleich(nx(0, 3, "ArrowUp"), 2, "auf am Anfang: zum letzten");
  gleich(nx(1, 3, "Home"), 0, "Pos1");
  gleich(nx(1, 3, "End"), 2, "Ende");
  gleich(nx(1, 3, "a"), 1, "andere Taste: unverändert");
  gleich(nx(-1, 0, "ArrowDown"), -1, "leeres Menü");
  gleich(nx(0, 1, "ArrowDown"), 0, "ein Eintrag bleibt");
  // Nachrechnung: n-mal ab führt zum Ausgang zurück, ab und auf heben sich auf
  let abw = 0;
  for (let n = 1; n <= 12; n++) for (let i = 0; i < n; i++) {
    let j = i;
    for (let k = 0; k < n; k++) j = nx(j, n, "ArrowDown");
    if (j !== i || nx(nx(i, n, "ArrowDown"), n, "ArrowUp") !== i) abw++;
  }
  gleich(abw, 0, "Umläufe für 1–12 Einträge");
}

// ---------- notizblock (NB1 a, NB3 a; ohne DOM: Rechnen, Zahlen lesen, Kommaregel) ----------
console.log("notizblock.js");
{
  const NB = KERN.notizblock;
  // Nachrechnung: die Ziffern und Überträge ergeben das Ergebnis, wie auf dem Blatt
  const zz = KERN.zufall.mitStartwert(77);
  let abw = 0;
  for (let i = 0; i < 3000; i++) {
    const art = ["+", "−", "×"][i % 3];
    const a = Math.floor(zz() * 99999), b = art === "×" ? 1 + Math.floor(zz() * 9) : Math.floor(zz() * (art === "−" ? a + 1 : 99999));
    const zahlen = art === "+" ? [a, b, Math.floor(zz() * 999)] : [a, b];
    const r = NB.rechne(art, zahlen);
    const soll = art === "+" ? zahlen.reduce((s, z) => s + z, 0) : art === "−" ? a - b : a * b;
    const ausZiffern = Number(r.r.slice().reverse().join("") || "0");
    if (r.ergebnis !== soll || ausZiffern !== soll || r.ueber[0] !== 0) abw++;
  }
  gleich(abw, 0, "rechne: Ziffern und Ergebnis wie nachgerechnet (3000 Fälle +, −, × einstellig)");
  gleich(JSON.stringify(NB.rechne("−", [503, 178])), JSON.stringify({ ergebnis: 325, r: [5, 2, 3], ueber: [0, 1, 1, 0] }), "Minus mit Übertrag wie beim Ergänzen");
  gleich(JSON.stringify([NB.zahlAus("0,47"), NB.zahlAus(" 1 234.5"), NB.zahlAus("12345678"), NB.zahlAus("1.2345"), NB.zahlAus("−3")]),
    JSON.stringify([{ ganz: "0", nach: "47" }, { ganz: "1234", nach: "5" }, null, null, null]), "zahlAus: Komma oder Punkt, Grenzen 7 und 3");
  gleich([NB.kommaregel(2, 1), NB.kommaregel(1, 0), NB.kommaregel(0, 1)].join(" | "), "2 + 1 = 3 Stellen nach dem Komma | 1 + 0 = 1 Stelle nach dem Komma | 0 + 1 = 1 Stelle nach dem Komma", "Kommaregel als Satz");
  gleich(NB.STELLEN.map(s => s.k).join(), "M,HT,ZT,T,H,Z,E", "Stellen von gross nach klein");
  const a = NB({ dezimal: () => "," });
  gleich(["oeffne", "schliessen", "knopf", "raster", "rechne"].every(f => typeof a[f] === "function") && a.istOffen() === false, true, "Notizblock einer App: Teile da, ohne DOM ladbar und zu");
  // Gleichung (GL1 a): nicht unter den Standard-Vorlagen (der Eulenpfad bietet sie nicht an), Lösung zum Weiterrechnen
  gleich(NB.VORLAGEN.map(v => v.id).join(" "), "+ − × : frei", "Standard-Vorlagen ohne Gleichung");
  gleich(NB.GLEICHUNG.id, "=", "Vorlage Gleichung");
  gleich(JSON.stringify(["x = 2.5", "x=12", " y = 1 234 ", "x = −3", "2x = 6", "x = 3 + 1", "x = 0,25", ""].map(NB.loesungAus)),
    JSON.stringify(["2.5", "12", "1234", "", "", "", "0,25", ""]), "loesungAus: nur „Variable = Zahl“ (nicht negativ, wie zahlAus)");
}

// ---------- tastenfeld (TF1 a; ohne DOM: die Regel des Einfügens) ----------
console.log("tastenfeld.js");
{
  const E = KERN.tastenfeld.einfuegen, L = KERN.tastenfeld.LOESCHEN;
  const f = r => (r ? `${r.wert}@${r.pos}` : "null");
  for (const [args, soll, text] of [
    [["12", 2, 2, "3"], "123@3", "hinten anfügen"],
    [["12", 1, 1, "x"], "1x2@2", "an der Schreibmarke einfügen"],
    [["12345", 1, 4, "0"], "105@2", "Auswahl ersetzen"],
    [["12", 2, 2, L], "1@1", "⌫ vor der Schreibmarke"],
    [["12", 0, 0, L], "null", "⌫ am Anfang: nichts"],
    [["", 0, 0, L], "null", "⌫ im leeren Feld: nichts (der Notizblock geht dann ein Häuschen zurück)"],
    [["12345", 1, 4, L], "15@1", "⌫ löscht die Auswahl"],
    [["5", 1, 1, "7", 1], "7@1", "Häuschen (maxlength 1): ersetzen"],
    [["1234", 4, 4, "5", 4], "null", "maxlength erreicht: nichts"],
    [["123", undefined, undefined, "4"], "1234@4", "ohne Schreibmarke: hinten"],
    [["123", 9, 9, "4"], "1234@4", "Schreibmarke hinter dem Ende: hinten"],
  ]) gleich(f(E(...args)), soll, `einfuegen: ${text}`);
  gleich(typeof KERN.tastenfeld, "function", "KERN.tastenfeld ohne DOM ladbar");
}

// ---------- Geheimnisse und Personen (asynchron) ----------
(async () => {
  console.log("geheimnis.js");
  const G = KERN.geheimnis;
  gleich(G.verfuegbar(), true, "crypto.subtle in Node vorhanden");
  const p = await G.pin("4711");
  gleich(await G.pinStimmt("4711", p), true, "PIN stimmt");
  gleich(await G.pinStimmt("4712", p), false, "falsche PIN");
  gleich(await G.pinStimmt("4711", null), false, "ohne Prüfwert");
  for (const falsch of ["123", "1234567", "12a4", "", null]) {
    faelle++;
    try { await G.pin(falsch); fehler++; console.log(`    FEHLER  PIN ${falsch} angenommen`); } catch (e) { /* erwartet */ }
  }
  // gleiche Rechnung wie die bisherigen Apps: SHA-256 von „salz:wert“ (übernommene PINs gelten weiter)
  const sha = require("crypto").createHash("sha256").update("abc:4711").digest("hex");
  gleich(await G.hash("4711", "abc"), sha, "hash = SHA-256(salz:wert)");
  const { wiederherstellung: w, code } = await G.wiederherstellung({ frage: "Erstes Kuscheltier?", antwort: "  Grosser  Bär " });
  gleich(/^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/.test(code), true, "Code ohne 0/O/1/I in drei Gruppen");
  gleich(await G.codeStimmt(code.toLowerCase().replace(/-/g, " "), w), true, "Code ohne Gliederung, klein");
  gleich(await G.codeStimmt("AAAA-AAAA-AAAA", w), false, "falscher Code");
  gleich(await G.antwortStimmt("grosser bär", w), true, "Antwort ohne Gross/Klein und Leerzeichen");
  gleich(await G.antwortStimmt("Großer Bär", w), true, "ß wie ss");
  gleich(await G.antwortStimmt("", w), false, "leere Antwort");
  gleich(w.frage, "Erstes Kuscheltier?", "Frage im Klartext");
  // ohne crypto.subtle: verständliche Meldung statt Laufzeitfehler (D6)
  {
    const echt = globalThis.crypto;
    Object.defineProperty(globalThis, "crypto", { value: {}, configurable: true, writable: true });
    faelle++;
    try { await G.pin("4711"); fehler++; console.log("    FEHLER  ohne crypto keine Meldung"); }
    catch (e) { if (e.message !== G.OHNE_KRYPTO) { fehler++; console.log(`    FEHLER  ohne crypto: ${e.message}`); } }
    gleich(G.verfuegbar(), false, "verfuegbar ohne crypto");
    Object.defineProperty(globalThis, "crypto", { value: echt, configurable: true, writable: true });
  }

  console.log("person.js");
  const P = KERN.person;
  // Geburtsdatum (B3)
  for (const [ein, soll, text] of [["07.03.2014", "2014-03-07", "07.03.2014"], ["7.3.2014", "2014-03-07", "07.03.2014"],
    ["2014-03-07", "2014-03-07", "07.03.2014"], ["03.2014", "2014-03", "März 2014"], ["2014-03", "2014-03", "März 2014"],
    ["30.02.2014", null, ""], ["2014-13", null, ""], ["gestern", null, ""], [null, null, ""]]) {
    gleich(P.geburtsdatumLies(ein), soll, `geburtsdatumLies(${ein})`);
    gleich(P.geburtsdatumText(ein), text, `geburtsdatumText(${ein})`);
  }
  const am = (j, m, t) => new Date(j, m - 1, t);
  gleich(P.alter("2014-03-07", am(2026, 3, 6)), 11, "Alter am Tag vor dem Geburtstag");
  gleich(P.alter("2014-03-07", am(2026, 3, 7)), 12, "Alter am Geburtstag");
  gleich(P.alter("2014-03", am(2026, 3, 1)), 12, "ohne Tag: ab dem Ersten des Monats");
  gleich(P.alter("2014-03", am(2026, 2, 28)), 11, "ohne Tag: im Vormonat noch nicht");
  gleich(P.alter("2030-01-01", am(2026, 1, 1)), null, "Geburt in der Zukunft");
  gleich(P.tagFehlt("2014-03"), true, "tagFehlt");
  gleich(P.tagFehlt("2014-03-07"), false, "Tag vorhanden");
  // Namen
  gleich(P.nameGleich(" Mia ", "mia"), true, "Name ohne Gross/Klein und Rand");
  gleich(P.nameGleich("", ""), false, "leere Namen sind nie gleich");
  gleich(P.nameRein("  Lea   Sophie "), "Lea Sophie", "nameRein");
  // Prüfen
  gleich(P.maengel({ id: "p-1a", name: "Mia", rolle: "lernend" }).length, 0, "gültige Person");
  gleich(P.maengel({ id: "p-1a", name: "Mia", rolle: "chef" }).length, 1, "unbekannte Rolle");
  gleich(P.maengel({ id: 5, name: "", rolle: "lernend", geboren: "irgendwann" }).length, 3, "drei Mängel");
  gleich(P.maengel("Mia").length, 1, "keine Person");
  gleich(JSON.stringify(Object.keys(P.ohneGeheimnis({ id: "p-x", name: "A", pin: 1, wiederherstellung: 2, aufsicht: [] }, ["aufsicht"]))), '["id","name"]', "ohneGeheimnis");

  // Liste in einem Ersatz-Speicher
  const daten = new Map();
  global.localStorage = { getItem: k => (daten.has(k) ? daten.get(k) : null), setItem: (k, v) => daten.set(k, String(v)),
    removeItem: k => daten.delete(k), key: i => [...daten.keys()][i] ?? null, get length() { return daten.size; } };
  const L = P.liste(KERN.speicher("lernsteig:"), { felder: { klasse: null } });
  const mia = L.anlegen({ name: "Mia", geboren: "07.03.2012", klasse: 7 });
  gleich(/^p-[a-z0-9]+-[0-9a-f]{10}$/.test(mia.id), true, "Kennung „p-…“");
  gleich(mia.geboren, "2012-03-07", "Geburtsdatum gespeichert als JJJJ-MM-TT");
  gleich(mia.rolle, "lernend", "Rolle Standard lernend");
  gleich(typeof mia.geaendert.klasse, "string", "geaendert je Feld");
  gleich(L.anlegen({ name: "Vorgabe" }).geaendert.klasse, undefined, "Vorgaben der App bekommen keine Zeit");
  faelle++; try { L.anlegen({ name: " mia " }); fehler++; console.log("    FEHLER  doppelter Name angenommen"); } catch (e) { /* erwartet */ }
  const leo = L.anlegen({ name: "Leo", rolle: "aufsicht", art: "eltern" });
  faelle++; try { L.aendere(leo.id, { name: "MIA" }); fehler++; console.log("    FEHLER  Umbenennen auf vergebenen Namen"); } catch (e) { /* erwartet */ }
  const mia2 = L.aendere(mia.id, { name: "Mia Sophie", klasse: 8 });
  gleich(mia2.id, mia.id, "Umbenennen behält die Kennung");
  gleich(L.findeName("mia sophie").id, mia.id, "findeName");
  gleich(L.alle().length, 3, "drei Personen");
  daten.set("lernsteig:personen", JSON.stringify(L.alle().concat([{ id: 7, name: "kaputt" }])));
  gleich(L.alle().length, 3, "ungültige Einträge im Speicher werden nicht geliefert");
  delete global.localStorage;

  // Übernahme einer Aufsicht in eine andere App (C9, Ü1 a, Ü2 b)
  {
    const d2 = new Map();
    global.localStorage = { getItem: k => (d2.has(k) ? d2.get(k) : null), setItem: (k, v) => d2.set(k, String(v)),
      removeItem: k => d2.delete(k), key: i => [...d2.keys()][i] ?? null, get length() { return d2.size; } };
    const EP = P.liste(KERN.speicher("lernspiele:")), LSZ = P.liste(KERN.speicher("lernsteig:"));
    const w0 = await G.wiederherstellung({ frage: "Erstes Velo?", antwort: "Rot" });
    const mama = EP.anlegen({ name: "Mama", rolle: "aufsicht", pin: await G.pin("2468"), wiederherstellung: w0.wiederherstellung });
    const u = await P.uebernehmen(mama, LSZ, { art: "eltern" });
    const dort = LSZ.finde(mama.id);
    gleich([u.status, dort?.id, dort?.rolle, dort?.art].join(), `neu,${mama.id},aufsicht,eltern`, "Übernahme: gleiche Kennung, Rolle, Art der Ziel-App");
    gleich(await G.pinStimmt("2468", dort.pin), true, "gleiche PIN in der Ziel-App");
    gleich(await G.antwortStimmt("rot", dort.wiederherstellung), true, "gleiche Sicherheitsantwort");
    gleich(dort.wiederherstellung.frage, "Erstes Velo?", "Frage reist mit");
    gleich([await G.codeStimmt(u.code, dort.wiederherstellung), await G.codeStimmt(w0.code, dort.wiederherstellung)].join(), "true,false", "neuer Code je App, der alte gilt dort nicht");
    gleich(d2.has("lernspiele:personen") && JSON.parse(d2.get("lernsteig:personen")).length, 1, "unter dem Präfix der Ziel-App gespeichert");
    gleich((await P.uebernehmen(mama, LSZ, { art: "eltern" })).status, "schon", "zweite Übernahme: schon da");
    LSZ.anlegen({ name: "Papa", rolle: "lernend" });
    const papa = EP.anlegen({ name: "Papa", rolle: "aufsicht", pin: await G.pin("1357") });
    const n = await P.uebernehmen(papa, LSZ, { art: "eltern" });
    gleich([n.status, LSZ.finde(papa.id)].join(), "name,", "Name vergeben: nichts überschrieben");
    const ohnePin = EP.anlegen({ name: "Oma", rolle: "aufsicht" });
    faelle++; try { await P.uebernehmen(ohnePin, LSZ, { art: "eltern" }); fehler++; console.log("    FEHLER  Aufsicht ohne PIN übernommen"); } catch (e) { /* erwartet */ }
    const kind = EP.anlegen({ name: "Mia" });
    faelle++; try { await P.uebernehmen(kind, LSZ, {}); fehler++; console.log("    FEHLER  Kind übernommen"); } catch (e) { /* erwartet */ }
    const ohneFrage = await P.uebernehmen(papa, P.liste(KERN.speicher("gratwanderung:")), {});
    gleich([ohneFrage.status, "frage" in ohneFrage.person.wiederherstellung].join(), "neu,false", "ohne Sicherheitsfrage: nur ein neuer Code");
    const lehrer = LSZ.anlegen({ name: "Herr K", rolle: "aufsicht", art: "lehrperson", pin: await G.pin("9999") });
    gleich((await P.uebernehmen(lehrer, EP)).person.art, "lehrperson", "Art der Quelle reist mit");
    delete global.localStorage;
  }

  // Zusammenführen (P1 a)
  const t0 = "2026-01-01T00:00:00.000Z", t1 = "2026-02-01T00:00:00.000Z", t2 = "2026-03-01T00:00:00.000Z";
  const hier = [
    { id: "p-hier-mia", name: "Mia", rolle: "lernend", klasse: 4, angelegt: t1, geaendert: { klasse: t1 }, pin: { salz: "s", hash: "h" } },
    { id: "p-hier-ben", name: "Ben", rolle: "lernend", klasse: 3, angelegt: t0, geaendert: { klasse: t0 } },
  ];
  const dort = [
    { id: "p-dort-mia", name: "mia", rolle: "lernend", klasse: 5, fokus: ["x"], angelegt: t0, geaendert: { klasse: t2, fokus: t2 }, pin: { salz: "fremd", hash: "fremd" } },
    { id: "p-hier-ben", name: "Benjamin", rolle: "lernend", klasse: 3, angelegt: t0, geaendert: { name: t2 } },
    { id: "p-neu-ida", name: "Ida", rolle: "lernend", angelegt: t2, geaendert: {} },
    { id: "x", name: "", rolle: "lernend" },
  ];
  const z = P.zusammenfuehren(hier, dort);
  const zm = z.personen.find(p => P.nameGleich(p.name, "mia"));
  gleich(zm.id, "p-dort-mia", "gleicher Name: ältere Kennung bleibt");
  gleich(JSON.stringify(zm.frueher), '["p-hier-mia"]', "andere Kennung als frühere");
  gleich(z.kennungen["p-hier-mia"], "p-dort-mia", "Kennungen zum Umbiegen");
  gleich(zm.klasse, 5, "je Feld der jüngere Stand");
  gleich(zm.pin.salz, "s", "PIN bleibt die eigene, fremde reist nicht mit");
  gleich(z.personen.find(p => p.id === "p-hier-ben").name, "Benjamin", "gleiche Kennung: jüngerer Name");
  gleich(z.neu, 1, "eine neue Person");
  gleich(z.abgewiesen, 1, "eine ungültige abgewiesen");
  gleich(z.personen.length, 3, "drei Personen");
  // frühere Kennung findet wieder dieselbe Person; Name, den hier jemand anders trägt, gilt nicht
  const z2 = P.zusammenfuehren(z.personen, [{ id: "p-hier-mia", name: "Ida", rolle: "lernend", angelegt: t1, geaendert: { name: "2026-04-01T00:00:00.000Z" } }]);
  gleich(z2.personen.length, 3, "frühere Kennung trifft dieselbe Person");
  gleich(zm.name, "Mia", "Name ohne Zeit auf beiden Seiten: der eigene bleibt");
  gleich(z2.personen.find(p => p.id === "p-dort-mia").name, "Mia", "vergebener Name wird nicht übernommen");
  gleich(new Set(z2.personen.map(p => p.name.toLowerCase())).size, 3, "Namen bleiben eindeutig");
  // nochmals dieselben Daten einlesen ändert nichts
  const z3 = P.zusammenfuehren(z.personen, dort);
  gleich(z3.neu + z3.geaendert, 0, "zweites Einlesen ändert nichts");

  // ---------- Freigabe ----------
  console.log("freigabe.js");
  {
    const katalog = {
      alt: { id: "alt" },                                                    // ohne neu, ohne Listen: frei
      neu: { id: "neu", neu: "S1" },                                         // neu: gesperrt bis Prüfstand
      wort: { id: "wort", listen: { a: { name: "A" }, z: { name: "Z", zusatz: true } } },
      leih: { id: "leih", listen: { a: { von: "wort/a" } } },                // Verweis auf die Liste von wort
      nurz: { id: "nurz", listen: { z: { name: "nur Zusatz", zusatz: true } } },
    };
    const daten = {};
    const sp = { lies: (k, e) => (k in daten ? JSON.parse(daten[k]) : e), schreibe: (k, v) => { daten[k] = JSON.stringify(v); return true; } };
    let pruef = { uebungen: {}, listen: {} }, aufsichtDa = false;
    const F = KERN.freigabe({ art: "uebungen", eintrag: id => katalog[id] || null, speicher: sp, pruefstand: () => pruef, aufsicht: () => aufsichtDa });
    gleich(F.fuerLernendeSichtbar("alt"), true, "ohne neu und Listen frei");
    gleich(F.sperrGrund("neu"), "noch nicht angesehen", "neu gesperrt");
    gleich(F.sperrGrund("wort"), "Inhaltsliste noch nicht geprüft", "Liste ungeprüft (Zusatz zählt nicht)");
    gleich(F.sperrGrund("unbekannt"), "unbekannt", "unbekannter Inhalt");
    gleich(F.sichtbar("neu"), false, "Lernende sehen Gesperrtes nicht");
    aufsichtDa = true; gleich(F.sichtbar("neu"), true, "Aufsicht sieht alles"); gleich(F.freieListen("wort").join(), "a,z", "Aufsicht: alle Listen"); aufsichtDa = false;
    pruef = { uebungen: { neu: { am: "2026-11-05", von: "P" } }, listen: { "wort/a": { am: "2026-11-05", von: "P" } } };
    gleich(F.fuerLernendeSichtbar("neu"), true, "nach Prüfstand frei");
    gleich(F.fuerLernendeSichtbar("wort"), true, "Liste geprüft → frei");
    gleich(F.fuerLernendeSichtbar("leih"), true, "Verweis: geprüft an der Quelle");
    gleich(F.listen("leih")[0].name, "A", "Verweis: Name der Quelle");
    gleich(F.fuerLernendeSichtbar("nurz"), false, "nur Zusatzliste ergibt keine Aufgabe");
    F.setzeFrei("neu", false);
    gleich(F.sperrGrund("neu"), "auf diesem Gerät gesperrt", "Aufsicht sperrt auf dem Gerät");
    gleich(typeof daten.freigabeStand, "string", "freigabeStand geschrieben");
    F.setzeListeFrei("leih", "a", false);
    gleich(F.listeFrei("wort", "a"), false, "Sperre über den Verweis gilt an der Quelle");
    gleich(F.sperrGrund("wort"), "Inhaltslisten gesperrt", "gesperrte Liste");
    F.setzeFrei("neu", null); F.setzeListeFrei("wort", "a", null);
    gleich([F.frei("neu"), F.listeFrei("wort", "a")].join(), "true,true", "null: zurück auf den Prüfstand");
    gleich(JSON.stringify(F.geraet()), '{"uebungen":{},"listen":{}}', "Gerätefreigabe leer");
  }

  // ---------- Suche ----------
  console.log("suche.js");
  {
    const S = KERN.suche;
    gleich(S.woerter("Brüche: MA.1.A.3, Prozent!").join("|"), "brüche|ma.1.a.3|prozent", "Wörter, Kürzel mit Punkten ganz");
    gleich([S.wortWert("bruch", "bruch"), S.wortWert("bru", "bruch"), S.wortWert("bruche", "brüche"), S.wortWert("bruc", "brüche"),
      S.wortWert("rech", "kopfrechnen"), S.wortWert("ruch", "brüche"), S.wortWert("bruxhe", "bruche", true), S.wortWert("bruxhe", "bruche"),
      S.wortWert("bruhce", "bruche", true)].join(),
      "1,0.8,0.7,0.6,0.4,0.3,0.25,0,0", "Stufen der Wortpassung (Dreher = zwei Fehler)");
    gleich(S.wortWert("ma.1a", "ma.1b", true), 0, "kein Tippfehler bei Kürzeln mit Ziffern");
    gleich([S.einTippfehler("haus", "maus"), S.einTippfehler("haus", "hauss"), S.einTippfehler("haus", "hund")].join(), "true,true,false", "einTippfehler");
    gleich([S.naehe(4, 4), S.naehe(4, 5), S.naehe(4, 2), S.naehe(4, 7), S.naehe(null, 4)].join(), "1,0.6,0.2,0,0.5", "Nähe");
    const E = [{ id: "a", name: "Bruchrechnen", thema: "Zahlen" }, { id: "b", name: "Kopfrechnen", thema: "Brüche und mehr" }, { id: "c", name: "Uhr", thema: "Zeit" }];
    const opt = { felder: e => ({ name: [e.name], thema: [e.thema] }), gewicht: { name: 6, thema: 1 }, sichtbar: ["name"], tippfehler: ["name"],
      grund: (f, t) => `im Thema ${t}` };
    const r = S.suche("bruch", E, opt);
    gleich(r.map(x => x.id).join(), "a,b", "Name vor Thema, Uhr fällt weg");
    gleich(r[1].grund, "im Thema Brüche und mehr", "Grund bei Treffer ausserhalb der Karte");
    gleich(r[0].grund, null, "kein Grund bei Treffer auf der Karte");
    gleich(S.suche("bruch uhr", E, opt).length, 0, "jedes Suchwort muss passen");
    gleich(S.suche("  ", E, opt), null, "leere Suche");
    const mitP = S.suche("rechnen", E, { ...opt, passung: e => (e.id === "b" ? 1 : 0), faktor: 0.5 });
    gleich(mitP.map(x => x.id).join(), "b,a", "Passung entscheidet bei gleichem Text");
    gleich(mitP[0].wert, mitP[1].wert * 1.5, "Faktor 1 + 0.5 · Passung");
    const ae = S.aehnlich("a", E, { vergleich: (e, x) => (x.id === "c" ? null : { wert: x.id === "b" ? 2 : 0, grund: "gleich" }) });
    gleich(ae.map(x => `${x.id}:${x.wert}`).join(), "b:2", "aehnlich ohne sich selbst, ohne Unähnliche");
  }

  // ---------- Runden und Rekorde ----------
  console.log("runden.js");
  {
    const RU = KERN.runden;
    gleich(RU.fingerabdruck("abc"), RU.fingerabdruck("abc"), "Fingerabdruck fest");
    gleich(RU.fingerabdruck({ a: 1 }) === RU.fingerabdruck({ a: 2 }), false, "Fingerabdruck verschieden");
    gleich(/^r-[a-z0-9]+-[0-9a-f]{10}$/.test(RU.neueId()), true, "neue Kennung r-…");
    const gut = { id: "r-1", person: "p-1", zeit: "2026-11-05T08:00:00.000Z", inhalt: "zahlenhaus", stufe: "s3", aufgaben: 8, fehler: 1, dauer: 60 };
    gleich(RU.maengel(gut).length, 0, "gültige Runde");
    gleich(RU.maengel({ ...gut, id: "", zeit: 5, inhalt: "" }).length, 3, "drei Mängel");
    gleich(RU.maengel({ ...gut, aufgaben: -1 }).length, 1, "negative Zahl");
    gleich(RU.maengel({ ...gut }, "rekord").join(), "Punkte fehlen", "Rekord braucht Punkte");
    gleich(RU.maengel({ ...gut, fehlerAufgaben: "x" }, "runde", { zusatz: { fehlerAufgaben: "liste" } }).length, 1, "Schema der App");
    gleich(RU.maengel({ ...gut, dauer: undefined }, "runde", { pflicht: ["dauer"] }).join(), "dauer fehlt", "Pflichtfeld der App");
    gleich(RU.maengel({ ...gut, inhalt: "weg" }, "runde", { inhaltBekannt: id => id !== "weg" }).length, 1, "unbekannter Inhalt");
    // Umdeuten älterer Einträge: gleiche alte Runde → gleiche Kennung, über den Namen (auf allen Geräten gleich)
    const alt = { name: "Mia", person: "p-geraet-a", zeit: "2026-11-01T08:00:00.000Z", spiel: "zahlenhaus", stufe: "s1" };
    const u1 = RU.umdeuten(alt, { spiel: "inhalt" }), u2 = RU.umdeuten({ ...alt, person: "p-geraet-b" }, { spiel: "inhalt" });
    gleich([u1.inhalt, "spiel" in u1, u1.id === u2.id, /^r-alt-/.test(u1.id)].join(), "zahlenhaus,false,true,true", "umdeuten: Feld, feste Kennung");
    gleich(alt.spiel, "zahlenhaus", "umdeuten ändert die Vorlage nicht");
    gleich(RU.umdeuten({ ...gut, inhalt: "a", spiel: "b" }, { spiel: "inhalt" }).inhalt, "a", "vorhandenes Feld bleibt");
    // Zusammenführen
    const eig = [gut, { ...gut, id: "r-2", zeit: "2026-11-05T09:00:00.000Z" }, { kaputt: true }];
    const fr = [{ ...gut }, { ...gut, id: "r-3", zeit: "2026-11-04T08:00:00.000Z" }, { ...gut, id: "r-4", zeit: "x" }];
    const z = RU.zusammenfuehren(eig, fr);
    gleich([z.neu, z.abgewiesen, z.eintraege.length, z.eintraege.filter(e => e.id).map(e => e.id).join(" ")].join(), "1,1,4,r-3 r-1 r-2", "Runden: nach Kennung, eigene bleiben (auch kaputte), nach Zeit");
    const rek = { ...gut, id: "k-1", punkte: 5 };
    const zk = RU.zusammenfuehren([rek], [{ ...rek, punkte: 9, abgebrochen: false }, { ...rek, punkte: 3 }], { art: "rekord" });
    gleich([zk.ersetzt, zk.eintraege.length, zk.eintraege[0].punkte].join(), "1,1,9", "Rekord: höherer Stand gewinnt");
    const zb = RU.zusammenfuehren([gut], [{ ...gut, id: "r-9" }], { behalten: e => e.id !== "r-9", umbiegen: p => (p === "p-1" ? "p-neu" : p) });
    gleich([zb.eintraege.length, zb.eintraege[0].person].join(), "1,p-neu", "behalten und umbiegen");
  }

  // ---------- Ablauf einer Runde: reine Hilfen (AR1 a, RA5 a, RA6 a) ----------
  console.log("runde.js");
  {
    const R = KERN.runde, RU = KERN.runden, FP = KERN.runden.fingerabdruck;
    const ersatzSpeicher = () => { const d = {}; return { d, lies: (k, s) => (k in d ? JSON.parse(d[k]) : s), schreibe: (k, v) => { d[k] = JSON.stringify(v); } }; };
    // Gedächtnis: merken, Höchstzahl, alte Schlüssel übernehmen und entfernen
    {
      const sp = ersatzSpeicher();
      sp.schreibe("gestellt", { "Mia|zahlenhaus/s1": ["a", "b"], anderes: ["x"] });
      const g = R.gedaechtnis({ speicher: sp, schluessel: "p-1|zahlenhaus/s1", alt: ["Mia|zahlenhaus/s1"], max: 3 });
      gleich([g.hat("a"), g.hat("x"), g.groesse].join(), "true,false,2", "Gedächtnis: alter Schlüssel gelesen");
      g.merke("c"); g.merke("d");
      const s = sp.lies("gestellt", {});
      gleich([Object.keys(s).sort().join(" "), s["p-1|zahlenhaus/s1"].join("")].join(), "anderes p-1|zahlenhaus/s1,bcd", "Gedächtnis: neuer Schlüssel, alter weg, höchstens max");
      g.beginneNeu(["z"]);
      gleich([g.hat("b"), g.hat("z")].join(), "false,true", "Gedächtnis: neuer Durchgang");
      wirft(() => R.gedaechtnis({ schluessel: "x" }), "Gedächtnis ohne Speicher");
    }
    // Nachrechnung: die Auswahl des Kerns wählt in normalen Runden genau wie die bisherige Schleife des Eulenpfads
    // (spiel.js bis LERN_Session18, unabhängig hier nachgebaut) — gleiche Züge, gleiche Aufgaben, gleiche Kürzung.
    function alteRunde(zuege, anzahl, gd, verlaufSerie) {
      const gestellt = new Map(); let wiederholt = false, letzte = null; const serienVerlauf = {}; const erg = [];
      const V = R.VERSUCHE;
      for (let nr = 0, z = 0; nr < anzahl; nr++) {
        let sahUngestellt = false, gewaehlt = null;
        for (let versuch = 0; ; versuch++) {
          const { k, serien } = zuege(z++);
          const n = k ? gestellt.get(k) || 0 : 0;
          const zuLang = Object.entries(serien).some(([name, wert]) => { const b = serienVerlauf[name] || []; return b.length >= R.SERIE_MAX && b.slice(-R.SERIE_MAX).every(w => w === wert); });
          const fp = k ? FP(k) : null;
          const ungestellt = n === 0 && (!fp || !gd.has(fp));
          if (ungestellt) sahUngestellt = true;
          const st = versuch < V.serie ? 1 : versuch < V.gedaechtnis ? 2 : versuch < V.erzwingen ? 3 : versuch < V.durchgang ? 4 : 5;
          const passt = st === 1 ? ungestellt && !zuLang : st === 2 ? n === 0 && !zuLang : st === 3 ? ungestellt : st === 4 ? n === 0 : n === 1 && !wiederholt && k !== letzte;
          if (passt) {
            if (fp) { if (gd.has(fp) && (st === 4 || (st === 2 && !sahUngestellt))) { gd.clear(); for (const x of gestellt.keys()) gd.add(FP(x)); } gd.add(fp); }
            if (n) wiederholt = true;
            if (k) gestellt.set(k, n + 1);
            letzte = k;
            for (const [name, wert] of Object.entries(serien)) (serienVerlauf[name] ||= []).push(wert);
            gewaehlt = `${k}@${z}`;
            break;
          }
          if (versuch >= V.ende) return { erg, gekuerzt: nr };
        }
        erg.push(gewaehlt);
      }
      return { erg, gekuerzt: null };
    }
    function neueRunde(zuege, anzahl, gd, endlos = false) {
      const w = R.auswahl({ gedaechtnis: gd, endlos }); const erg = [];
      for (let nr = 0, z = 0; nr < anzahl; nr++) {
        w.neueSuche();
        for (let versuch = 0; ; versuch++) {
          const { k, serien } = zuege(z++);
          const r = w.pruefe(k, serien, versuch);
          if (r.nehmen) { erg.push(`${k}@${z}`); break; }
          if (r.erschoepft) return { erg, gekuerzt: nr };
        }
      }
      return { erg, gekuerzt: null };
    }
    let abweichung = 0, gekuerzt = 0, faelleN = 0;
    for (let fall = 0; fall < 300; fall++) {
      const zz = KERN.zufall.mitStartwert(1000 + fall);
      const N = 1 + Math.floor(zz() * 25), anzahl = 4 + Math.floor(zz() * 10), merkmale = zz() < 0.5;
      const folge = Array.from({ length: 6000 }, () => { const i = Math.floor(zz() * N); return { k: i === 0 && zz() < 0.1 ? null : `a${i}`, serien: merkmale ? { art: String(i % 2) } : {} }; });
      const altG = new Set(), sp = ersatzSpeicher(), neuG = R.gedaechtnis({ speicher: sp, schluessel: "x" });
      let pos = 0, posN = 0;
      for (let runde = 0; runde < 4; runde++) {
        const start = pos;
        const a = alteRunde(i => folge[(start + i) % folge.length], anzahl, altG);
        const b = neueRunde(i => folge[(start + i) % folge.length], anzahl, neuG);
        faelleN++;
        if (a.erg.join() !== b.erg.join() || a.gekuerzt !== b.gekuerzt) abweichung++;
        if (a.gekuerzt !== null) gekuerzt++;
        pos = start + 997; posN = posN + 1;
      }
    }
    gleich(abweichung, 0, `Auswahl wie bisher im Eulenpfad (${faelleN} Runden aus 300 Zufallsfällen, davon ${gekuerzt} gekürzt)`);
    gleich(gekuerzt > 0, true, "Nachrechnung trifft auch gekürzte Runden");
    // Durchgang (RA5 a): bei 20 verschiedenen und Runden zu 8 kommt in den ersten 20 Aufgaben keine doppelt
    {
      const zz = KERN.zufall.mitStartwert(7), sp = ersatzSpeicher(), g = R.gedaechtnis({ speicher: sp, schluessel: "s" });
      const alle = [];
      for (let runde = 0; runde < 3; runde++) alle.push(...neueRunde(() => ({ k: `a${Math.floor(zz() * 20)}`, serien: {} }), runde < 2 ? 8 : 4, g).erg.map(x => x.split("@")[0]));
      gleich(new Set(alle).size, 20, "Durchgang: 20 verschiedene in drei Runden (8 + 8 + 4)");
    }
    // Serie (RA5 a): keine Aufgabe zweimal; ist die Stufe erschöpft, endet sie (alles geschafft), ohne Wiederholung
    {
      const zz = KERN.zufall.mitStartwert(11), sp = ersatzSpeicher(), g = R.gedaechtnis({ speicher: sp, schluessel: "s" });
      const s = neueRunde(() => ({ k: `a${Math.floor(zz() * 12)}`, serien: {} }), Infinity, g, true);
      const ks = s.erg.map(x => x.split("@")[0]);
      gleich([new Set(ks).size === ks.length, ks.length, s.gekuerzt].join(), "true,12,12", "Serie: 12 verschiedene, dann erschöpft");
    }
    // Serienbremse: höchstens SERIE_MAX gleiche Merkmale hintereinander, wenn die Stufe andere hergibt
    {
      const zz = KERN.zufall.mitStartwert(3), w = R.auswahl({});
      let lauf = 0, max = 0, vorher = null;
      for (let nr = 0; nr < 40; nr++) {
        w.neueSuche();
        for (let v = 0; ; v++) {
          const i = Math.floor(zz() * 1000), wert = zz() < 0.9 ? "a" : "b";
          if (w.pruefe(`k${i}`, { art: wert }, v).nehmen) { lauf = wert === vorher ? lauf + 1 : 1; vorher = wert; max = Math.max(max, lauf); break; }
        }
      }
      gleich(max, R.SERIE_MAX, "Serienbremse: höchstens 3 gleiche hintereinander");
    }
    // Rekord, Bestwert, Bestzeit, Dauer
    const rk = R.rekordEintragen([{ id: "k1", punkte: 3 }, { id: "k2", punkte: 5 }], { id: "k1", punkte: 7 });
    gleich(rk.map(r => `${r.id}:${r.punkte}`).join(), "k2:5,k1:7", "Rekord: gleiche Kennung ersetzt");
    gleich(R.bestwert(rk, r => r.id === "k2"), 5, "Bestwert gefiltert");
    gleich(R.bestwert([], () => true), 0, "Bestwert ohne Rekord");
    const ru = [{ dauer: 40 }, { dauer: 30, gezeigt: 1 }, { dauer: 20, endlos: true }, { dauer: 25, gekuerzt: 8 }, { dauer: 35.5 }];
    gleich(R.bestzeit(ru), 35.5, "Bestzeit: nur volle Runden ohne gezeigte Lösung, keine Serie");
    gleich(R.bestzeit([]), null, "Bestzeit ohne Runde");
    gleich([R.sekunden(12345), R.sekunden(49), R.sekunden(-5)].join(), "12.3,0,0", "Dauer auf 0,1 s");
    // Wächter
    {
      const h = {}, f = { addEventListener: (t, fn) => { h[t] = fn; }, removeEventListener: t => { delete h[t]; } };
      const d = { visibilityState: "visible", addEventListener: (t, fn) => { h[t] = fn; }, removeEventListener: t => { delete h[t]; } };
      let n = 0;
      const w = R.waechter(() => n++, { fenster: f, dokument: d });
      h.pagehide(); h.visibilitychange(); d.visibilityState = "hidden"; h.visibilitychange();
      w.aus();
      gleich([n, Object.keys(h).length, w.an].join(), "2,0,false", "Wächter: Verlassen und Verstecken, dann aus");
    }

    // ---------- Ablauf (RA1–RA4 a, RA7 a) ----------
    {
      let t = 0; const messuhr = () => t, uhr = () => new Date(Date.UTC(2026, 10, 6, 10, 0, 0) + t);
      const l = R.lauf({ anzahl: 3, messuhr, uhr, id: "r-test" });
      // 1: ab bereit gemessen, Pause zählt nicht, auf Anhieb
      l.gestellt({ text: "3 + 4", loesung: "7" }); t += 2000; l.bereit(); t += 1000; l.pause(); t += 5000; l.weiter(); t += 500;
      gleich(l.richtig().aufAnhieb, true, "Ablauf: auf Anhieb");
      // 2: zwei Fehlversuche, Zeit um, dann richtig (Zeit um ist ein Fehler, die Aufgabe bleibt offen)
      l.gestellt({ text: "5 · 6" }); t += 700;
      l.falsch({ eingabe: "35", loesung: "30" }); l.falsch({ eingabe: "36" }); gleich(l.zeitUm().vorbei, false, "Zeit um: Aufgabe bleibt offen");
      gleich(l.richtig({ eingabe: "30" }).aufAnhieb, false, "nach Fehlversuch nicht auf Anhieb");
      // 3: dreimal falsch mit Lösung → zeigen
      l.gestellt({ text: "9 − 2", loesung: "7" }); t += 300;
      const f3 = [l.falsch(), l.falsch(), l.falsch()];
      gleich(f3.map(f => f.loesungZeigen).join(), "false,false,true", "Lösung nach dem dritten Fehlversuch");
      gleich([l.vorbei, l.offen].join(), "true,false", "Runde nach anzahl Aufgaben vorbei");
      wirft(() => l.gestellt(), "nach dem Ende keine Aufgabe mehr");
      const e = l.eintrag({ person: "p-1", inhalt: "x", stufe: "s3" });
      gleich([e.id, e.zeit, e.dauer, e.aufgaben, e.fehler, e.gezeigt, "endlos" in e, "gekuerzt" in e].join(),
        "r-test,2026-11-06T10:00:09.500Z,9.5,3,6,1,false,false", "Eintrag: Ende als zeit, Dauer auf 0,1 s, Zähler");
      gleich(JSON.stringify(e.liste[0]), '{"ms":1500,"versuche":0,"geloest":true}', "Aufgabe 1: ab bereit, ohne Pause");
      gleich(JSON.stringify(e.liste[1]), '{"ms":700,"versuche":2,"geloest":true,"zeitUm":true,"text":"5 · 6","loesung":"30","eingaben":["35","36","30"]}', "Aufgabe 2: mit Angaben, ohne bereit ab gestellt");
      gleich([e.liste[2].gezeigt, e.liste[2].geloest, e.liste[2].loesung].join(), "true,false,7", "Aufgabe 3: gezeigt");
      gleich(R.mitFehler(e).length, 2, "mitFehler");
      gleich(e.liste.filter(R.aufAnhieb).length, 1, "aufAnhieb");
      gleich(RU.maengel(e).length, 0, "Eintrag erfüllt das Format der Runden");
      // ohne Lösung bleibt die Aufgabe offen; Zusatz der App; übersprungen
      const l2 = R.lauf({ anzahl: 5, messuhr, uhr });
      l2.gestellt(); l2.falsch(); l2.falsch(); l2.falsch();
      gleich([l2.falsch().loesungZeigen, l2.offen].join(), "false,true", "ohne Lösung kein Zeigen, Aufgabe offen");
      l2.zusatz({ tipps: 1, lp: "h" }); l2.richtig();
      l2.gestellt(); l2.uebersprungen(); l2.erschoepft();
      const e2 = l2.eintrag({}, { abgebrochen: true });
      gleich([e2.liste[0].tipps, e2.liste[0].lp, e2.liste[1].uebersprungen, e2.gekuerzt, e2.abgebrochen, l2.vorbei].join(), "1,h,true,5,true,true", "Zusatz, übersprungen, gekürzt, abgebrochen");
      // Serie: erste falsche Antwort beendet sie; Rekord mit gleicher Kennung
      const s = R.lauf({ endlos: true, messuhr, uhr, id: "r-s" });
      for (let i = 0; i < 3; i++) { s.gestellt(); s.richtig(); }
      s.gestellt(); gleich(s.falsch().vorbei, true, "Serie: falsch beendet sie");
      const rk = s.rekord({ person: "p-1", inhalt: "x", stufe: "s3" }), es = s.eintrag({ person: "p-1", inhalt: "x", stufe: "s3", sterne: null });
      gleich([rk.id, rk.punkte, "alles" in rk, es.endlos, es.aufgaben, es.fehler, s.vorbei].join(), "r-s,3,false,true,4,1,true", "Serie: Rekord und Eintrag");
      const s2 = R.lauf({ endlos: true, messuhr, uhr }); s2.gestellt(); gleich(s2.zeitUm().vorbei, true, "Serie: Zeit um beendet sie");
      // Zusammenführen (RA3 a): der spätere Stand ersetzt den Zwischenstand
      const zw = { ...es, abgebrochen: true, aufgaben: 2 };
      const z1 = RU.zusammenfuehren([zw], [es]), z2 = RU.zusammenfuehren([es], [zw]);
      gleich([z1.ersetzt, z1.eintraege[0].aufgaben, z2.ersetzt, z2.eintraege[0].aufgaben].join(), "1,4,0,4", "Runde: Zwischenstand weicht dem späteren Stand");
      gleich(R.eintragen([zw], es).length, 1, "eintragen: gleiche Kennung ersetzt");
    }

    // ---------- Umdeuten älterer Einträge: Nachrechnung gegen die bisherige Aufzeichnung (RA4 a, RA1 a) ----------
    {
      // Zufällige Runden: je Aufgabe eine Folge aus f (falsch), z (Zeit um), r (richtig), u (übersprungen); dieselbe
      // Folge einmal durch die alte Aufzeichnung (unabhängig nachgebaut) und einmal durch KERN.runde.lauf.
      const vergleiche = (x, felder) => JSON.stringify(felder.map(f => [f, x[f] === undefined || x[f] === false ? null : x[f]]));
      const FELDER = ["ms", "versuche", "geloest", "gezeigt", "uebersprungen", "zeitUm", "text", "loesung"];
      let abw = 0, abwL = 0, n = 0;
      for (let fall = 0; fall < 300; fall++) {
        const zz = KERN.zufall.mitStartwert(5000 + fall);
        const aufg = 1 + Math.floor(zz() * 8);
        // --- Eulenpfad ---
        let t = 0; const l = R.lauf({ anzahl: aufg, messuhr: () => t });
        const aufgabenZeiten = [], fehlerAufgaben = [];
        for (let i = 0; i < aufg; i++) {
          const text = `A${i}`, loesung = zz() < 0.8 ? `L${i}` : "";
          l.gestellt({ text }); t += 1;
          let versuche = 0, zeitUm = false, eintrag = null, ende = null;
          const fe = lt => { if (!eintrag) { eintrag = { text, loesung: lt || "", versuche: 0, geloest: false, zeitUm: false }; fehlerAufgaben.push(eintrag); } if (lt && !eintrag.loesung) eintrag.loesung = lt; return eintrag; };
          while (!ende) {
            const w = zz(), ms = 100 + Math.floor(zz() * 900);
            if (w < 0.35) { versuche++; fe(loesung).versuche = versuche; t += ms; const r = l.falsch({ loesung }); if (versuche >= 3 && loesung) { ende = { geloest: false }; if (!r.loesungZeigen) abw++; } }
            else if (w < 0.45 && !zeitUm) { zeitUm = true; fe("").zeitUm = true; t += ms; l.zeitUm(); }
            else if (w < 0.5) { t += ms; ende = { geloest: false, uebersprungen: true }; l.uebersprungen(); }
            else { t += ms; ende = { geloest: true }; if (eintrag) eintrag.geloest = true; l.richtig(); }
          }
          aufgabenZeiten.push({ ms: l.liste.at(-1).ms, versuche, zeitUm, geloest: ende.geloest, ...(ende.uebersprungen ? { uebersprungen: true } : {}) });
        }
        const alt = R.ausEulenpfad({ id: "r", aufgaben: aufg, aufgabenZeiten, fehlerAufgaben });
        const neu = l.liste;
        n++;
        if (alt.liste.length !== neu.length || alt.liste.some((x, i) => vergleiche(x, FELDER) !== vergleiche(neu[i], FELDER))) abw++;
        if ("aufgabenZeiten" in alt || "fehlerAufgaben" in alt || alt.gezeigt !== l.gezeigt) abw++;
        // --- Lernsteig (bis LERN_Session18: zeit = Beginn; ohne Zeit um) ---
        const endlos = zz() < 0.3;
        let u = 0; const ls = R.lauf({ endlos, anzahl: endlos ? Infinity : aufg, messuhr: () => u });
        const alteListe = [], zeiten = [], falsch = [];
        for (let i = 0; i < (endlos ? 20 : aufg) && !ls.vorbei; i++) {
          const text = `T${i}`, loesung = `${i}`;
          ls.gestellt({ text, loesung }); const t0 = u;
          let versuche = 0, fertig = false;
          while (!fertig) {
            u += 50 + Math.floor(zz() * 500);
            if (zz() < (endlos ? 0.15 : 0.4)) {
              versuche++;
              const eing = `E${versuche}`;
              const f = falsch.find(x => x.text === text) || (falsch.push({ text, eingaben: [] }), falsch.at(-1)); f.eingaben.push(eing);
              const r = ls.falsch({ eingabe: eing });
              if (endlos) { alteListe.push({ lp: "h", versuche, gezeigt: false, rechner: false }); fertig = true; }
              else if (versuche >= 3) { zeiten.push(u - t0); alteListe.push({ lp: "h", versuche, gezeigt: true, rechner: false }); fertig = true; if (!r.loesungZeigen) abwL++; }
            } else { zeiten.push(u - t0); alteListe.push({ lp: "h", versuche, gezeigt: false, rechner: false }); ls.richtig(); fertig = true; }
            if (fertig && ls.offen) abwL++;
          }
        }
        const beginn = "2026-11-06T09:00:00.000Z";
        const altL = R.ausLernsteig({ id: "r", zeit: beginn, dauer: 61.25, endlos, liste: alteListe, zeiten, falsch });
        const neuL = ls.liste;
        // ms nur, wo die alte Aufzeichnung eine Zeit hatte: die letzte, falsch beantwortete Aufgabe einer Serie bekam keine
        const FL = ["versuche", "geloest", "gezeigt", "text"];
        if (altL.liste.length !== neuL.length || altL.liste.some((x, i) => vergleiche(x, FL) !== vergleiche(neuL[i], FL) || x.lp !== "h"
          || ("ms" in x ? x.ms !== neuL[i].ms : !(endlos && i === altL.liste.length - 1))
          || (x.versuche > 0 && JSON.stringify(x.eingaben) !== JSON.stringify(neuL[i].eingaben)))) abwL++;
        if (altL.zeit !== "2026-11-06T09:01:01.250Z" || "zeiten" in altL || "falsch" in altL) abwL++;
      }
      gleich(abw, 0, `Umdeuten Eulenpfad: alte Aufzeichnung = Liste des Kerns (${n} Runden)`);
      gleich(abwL, 0, `Umdeuten Lernsteig: alte Aufzeichnung = Liste des Kerns, zeit am Ende (${n} Runden)`);
      // Gegenprobe: eine vertauschte Fehlerliste fällt auf
      const za = [{ ms: 1, versuche: 1, zeitUm: false, geloest: true }, { ms: 2, versuche: 2, zeitUm: false, geloest: true }];
      const umg = R.ausEulenpfad({ aufgaben: 2, aufgabenZeiten: za, fehlerAufgaben: [{ text: "B" }, { text: "A" }] });
      gleich(umg.liste.map(x => x.text).join(), "B,A", "Zuordnung nach Reihenfolge (Gegenprobe: vertauscht bleibt vertauscht)");
      // Runden der ersten Sitzungen ohne aufgabenZeiten
      const fr = R.ausEulenpfad({ aufgaben: 4, fehlerAufgaben: [{ text: "X", loesung: "1", versuche: 3, geloest: false }] });
      gleich([fr.liste.length, fr.liste[0].gezeigt, fr.liste[1].geloest, "ms" in fr.liste[1], fr.gezeigt].join(), "4,true,true,false,1", "ohne aufgabenZeiten: Rest ohne Zeit");
      const neuer = { id: "r", liste: [], zeit: "2026-11-06T09:00:00.000Z", dauer: 3 };
      gleich([R.ausEulenpfad(neuer) === neuer, R.ausLernsteig(neuer) === neuer].join(), "true,true", "heutige Einträge bleiben");
    }
  }

  // ---------- Anmeldung und Sitzung im Tab ----------
  {
    console.log("anmeldung.js");
    const A = KERN.anmeldung, G = KERN.geheimnis;
    const lokal = new Map(), tab = new Map();
    const ablage = m => ({ getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)),
      removeItem: k => m.delete(k), key: i => [...m.keys()][i] ?? null, get length() { return m.size; } });
    global.localStorage = ablage(lokal);
    global.sessionStorage = ablage(tab);
    const pin = await G.pin("4711");
    const leute = [
      { id: "p-kind", name: "Mia", rolle: "lernend" },
      { id: "p-auf", name: "Mama", rolle: "aufsicht", pin },
      { id: "p-ohne", name: "Papa", rolle: "aufsicht" },
      { id: "p-jug", name: "Lea", rolle: "lernend", pin },
    ];
    const finde = w => leute.find(p => p.id === w) || leute.find(p => p.name === w) || null;
    const S = KERN.speicher("lernspiele:");
    const ep = A.platz({ speicher: S, gewaehlt: "spieler", tab: "aufsicht", finde });
    const wer = () => ep.aktiv()?.id ?? null;
    gleich(wer(), null, "anfangs niemand");
    gleich(ep.waehle("p-kind"), true, "Kind ohne PIN wählen");
    gleich(wer(), "p-kind", "Kind angemeldet");
    gleich(lokal.get("lernspiele:spieler"), '"p-kind"', "Kennung gemerkt (mit Präfix)");
    gleich(ep.waehle("p-auf"), false, "Aufsicht nicht ohne PIN wählbar");
    gleich(ep.waehle("niemand"), false, "Unbekannte nicht wählbar");
    gleich(await ep.anmelden("p-auf", "1234"), null, "falsche PIN");
    gleich(wer(), "p-kind", "nach falscher PIN bleibt das Kind");
    gleich((await ep.anmelden("Mama", "4711"))?.id, "p-auf", "Aufsicht mit PIN (über den Namen gefunden)");
    gleich([wer(), tab.get("lernspiele:aufsicht")].join(), "p-auf,p-auf", "Aufsicht im Tab angemeldet");
    tab.clear(); // neuer Tab
    gleich(wer(), null, "neuer Tab: Aufsicht abgemeldet, niemand erbt ihre Rechte");
    tab.set("lernspiele:aufsicht", "Mama"); // älterer Stand mit dem Namen
    gleich(wer(), "p-auf", "älterer Stand mit Namen im Tab gilt");
    tab.set("lernspiele:aufsicht", "p-kind");
    gleich(wer(), null, "anderer Eintrag im Tab gilt nicht");
    gleich(await ep.anmelden("p-ohne", ""), null, "Aufsicht ohne gesetzte PIN kann sich nicht anmelden");
    ep.waehle("p-kind");
    gleich([wer(), tab.has("lernspiele:aufsicht")].join(), "p-kind,false", "Kind wählen leert den Tab");
    ep.abmelden();
    gleich([wer(), lokal.get("lernspiele:spieler")].join(), ",null", "abmelden");
    // Jugendliche mit PIN (Lernsteig): gilt nur im Tab
    const ls = A.platz({ speicher: KERN.speicher("lernsteig:"), gewaehlt: "aktiv", tab: "angemeldet", finde });
    gleich(ls.waehle("p-jug"), false, "mit PIN nicht nur wählen");
    gleich((await ls.anmelden("p-jug", "4711"))?.id, "p-jug", "Jugendliche mit PIN");
    gleich(ls.aktiv()?.id, "p-jug", "im Tab angemeldet");
    tab.delete("lernsteig:angemeldet");
    gleich(ls.aktiv(), null, "neuer Tab: mit PIN abgemeldet");
    // Zwei Tabs (kern 1.14.1): Lea im Tab A, dann meldet sich in Tab B eine Aufsicht an — Tab A bleibt bei Lea
    await ls.anmelden("p-jug", "4711");
    const tabA = new Map(tab);
    tab.clear();
    gleich((await ls.anmelden("p-auf", "4711"))?.id, "p-auf", "Tab B: Aufsicht angemeldet");
    tab.clear(); for (const [k, v] of tabA) tab.set(k, v);
    gleich(ls.aktiv()?.id, "p-jug", "Tab A: bleibt beim Jugendlichen, obwohl das Gerät die Aufsicht gewählt hat");
    tab.clear();
    gleich(ls.aktiv(), null, "neuer Tab C: niemand (die Aufsicht gilt nur in Tab B)");
    ls.abmelden();
    gleich((await ls.anmelden("p-kind"))?.id, "p-kind", "ohne PIN anmelden geht ohne PIN");
    gleich(tab.has("lernsteig:angemeldet"), false, "ohne PIN nichts im Tab");
    // Platz nur im Tab (Aufsicht im Lernsteig bis zum Grundgerüst C)
    const nurTab = A.platz({ speicher: KERN.speicher("lernsteig:"), tab: "aufsicht", finde: w => { const p = finde(w); return p?.rolle === "aufsicht" ? p : null; } });
    gleich(nurTab.aktiv(), null, "nur Tab: anfangs niemand");
    gleich(nurTab.waehle("p-auf"), false, "nur Tab: wählen geht nicht");
    gleich((await nurTab.anmelden("p-auf", "4711"))?.id, "p-auf", "nur Tab: anmelden");
    gleich(nurTab.aktiv()?.id, "p-auf", "nur Tab: aktiv");
    gleich(await nurTab.anmelden("p-jug", "4711"), null, "nur Tab: finde der App entscheidet, wer hierher gehört");
    nurTab.abmelden();
    gleich(nurTab.aktiv(), null, "nur Tab: abgemeldet");
    gleich(lokal.has("lernsteig:aufsicht"), false, "nur Tab: nichts im Speicher gemerkt");
    // Ohne sessionStorage (gesperrt): niemand mit PIN gilt als angemeldet, nichts wirft
    delete global.sessionStorage;
    await ep.anmelden("p-auf", "4711");
    gleich(ep.aktiv(), null, "ohne sessionStorage keine Aufsicht");
    ep.waehle("p-kind");
    gleich(ep.aktiv()?.id, "p-kind", "ohne sessionStorage: Kind geht");
    // Gast (C2 a): nur im Tab, ohne Person, je Gerät abschaltbar
    global.sessionStorage = ablage(tab);
    tab.clear();
    let gastErlaubt = true;
    const mitGast = A.platz({ speicher: KERN.speicher("lernsteig:"), gewaehlt: "aktiv", tab: "angemeldet", finde,
      gast: { tab: "gast", erlaubt: () => gastErlaubt } });
    gleich(mitGast.istGast(), false, "Gast: anfangs nicht");
    gleich(ep.alsGast(), false, "ohne opt.gast kein Gast");
    await mitGast.anmelden("p-jug", "4711");
    gleich([mitGast.alsGast(), mitGast.istGast(), mitGast.aktiv()].join(), "true,true,", "als Gast: Person abgemeldet");
    gleich([lokal.get("lernsteig:aktiv"), tab.get("lernsteig:gast")].join(), "null,ja", "Gast nur im Tab, nichts gewählt");
    gleich(await mitGast.anmelden("p-jug", "0000"), null, "falsche PIN als Gast");
    gleich(mitGast.istGast(), true, "falsche PIN: Gast bleibt");
    mitGast.waehle("p-kind");
    gleich([mitGast.istGast(), mitGast.aktiv()?.id].join(), "false,p-kind", "wählen beendet den Gast");
    mitGast.alsGast(); tab.clear();
    gleich(mitGast.istGast(), false, "neuer Tab: kein Gast mehr");
    mitGast.alsGast(); gastErlaubt = false;
    gleich([mitGast.istGast(), mitGast.alsGast()].join(), "false,false", "abgeschaltet: kein Gast, auch nicht mehr laufend");
    gastErlaubt = true; mitGast.alsGast(); mitGast.abmelden();
    gleich(mitGast.istGast(), false, "abmelden beendet den Gast");
    wirft(() => A.platz({ speicher: S, tab: "a", finde, gast: { tab: "a" } }), "Gast im selben Tab-Schlüssel wie die Person");
    // eigene Regel der App
    const eigen = A.platz({ speicher: S, gewaehlt: "x", tab: "y", finde, imTab: () => true });
    gleich(eigen.waehle("p-kind"), false, "imTab der App: alle nur im Tab");
    gleich(A.standardImTab({ rolle: "lernend" }), false, "Standard: lernend ohne PIN nicht im Tab");
    wirft(() => A.platz({ speicher: S, tab: "", finde }), "Tab-Schlüssel fehlt");
    wirft(() => A.platz({ tab: "a", finde }), "Speicher fehlt");
    wirft(() => A.platz({ speicher: S, tab: "a" }), "finde fehlt");
    delete global.localStorage;
    delete global.sessionStorage;
  }

  // ---------- Entwickler-Modus ----------
  {
    console.log("entwicklung.js");
    const E = KERN.entwicklung;
    // dieselbe Rechnung wie bisher im Eulenpfad: SHA-256 von „eulenpfad-entwickler:<Schlüssel>“
    const sha = require("crypto").createHash("sha256").update("eulenpfad-entwickler:probe").digest("hex");
    gleich(await KERN.geheimnis.hash("probe", E.SALZ), sha, "Hash wie bisher (bestehender Schlüssel gilt)");
    gleich(/^[0-9a-f]{64}$/.test(E.SCHLUESSEL_HASH), true, "Hash des Schlüssels eingetragen");
    const lokal = new Map();
    global.localStorage = { getItem: k => (lokal.has(k) ? lokal.get(k) : null), setItem: (k, v) => lokal.set(k, String(v)),
      removeItem: k => lokal.delete(k), key: i => [...lokal.keys()][i] ?? null, get length() { return lokal.size; } };
    let aufsicht = true;
    const meldungen = [], anfragen = [];
    const PS = { uebungen: { alt: { am: "x" } }, listen: {} };
    const D = E({ app: "lernsteig", speicher: KERN.speicher("lernsteig:"), aufsicht: () => aufsicht, name: () => "Mama",
      pruefstand: PS, arten: ["uebungen", "listen"], melde: t => meldungen.push(t), start: "lernsteig/" });
    gleich([D.freigeschaltet(), D.aktiv()].join(), "false,false", "anfangs gesperrt");
    gleich(await D.freischalten("falsch"), false, "falscher Schlüssel");
    gleich(await D.freischalten(""), false, "leerer Schlüssel");
    // freigeschaltet wie nach einem richtigen Schlüssel (der Klartext steht nur in entwickler.key)
    lokal.set("lernsteig:entwickler", JSON.stringify({ schluessel: "s", an: true }));
    gleich(D.aktiv(), true, "freigeschaltet, an, Aufsicht");
    aufsicht = false; gleich(D.aktiv(), false, "nur für die angemeldete Aufsicht"); aufsicht = true;
    D.setzeAn(false); gleich(D.aktiv(), false, "Schalter aus"); D.setzeAn(true);
    gleich(D.name(), "Mama", "Name: die Aufsicht"); D.benenne("  Patrik  "); gleich(D.name(), "Patrik", "eigener Name");
    // ohne Server: Meldung statt Ausnahme
    global.fetch = async () => { throw new Error("kein Netz"); };
    gleich(await D.setzeGeprueft("uebungen", "brueche", true), false, "ohne Server: false");
    gleich(/nicht gefunden[\s\S]*lernsteig\//.test(meldungen.pop() || ""), true, "Meldung nennt den Server und die App");
    faelle++; try { await D.setzeGeprueft("spiele", "x", true); fehler++; console.log("    FEHLER  fremde Art angenommen"); } catch (e) { /* erwartet */ }
    // mit Server: App und Schlüssel gehen mit, der Prüfstand übernimmt den Stand des Servers
    const D2 = E({ app: "lernsteig", speicher: KERN.speicher("lernsteig:"), aufsicht: () => true, pruefstand: PS, arten: ["uebungen", "listen"], melde: t => meldungen.push(t) });
    global.fetch = async (url, o2) => {
      anfragen.push({ url, body: o2 && o2.body ? JSON.parse(o2.body) : null });
      if (url === "/entwicklung/status") return { ok: true, json: async () => ({ ok: true, schluessel: true }) };
      if (url.startsWith("/entwicklung/bemerkungen")) return { ok: true, json: async () => [{ nr: 1 }] };
      if (url === "/entwicklung/pruefstand") return { ok: true, json: async () => ({ uebungen: { brueche: { am: "2026-11-06", von: "Patrik" } }, listen: {} }) };
      return { ok: false, status: 403, json: async () => ({ fehler: "Schlüssel passt nicht" }) };
    };
    gleich(await D2.setzeGeprueft("uebungen", "brueche", true), true, "mit Server: gesetzt");
    const b = anfragen.find(a => a.url === "/entwicklung/pruefstand").body;
    gleich([b.app, b.schluessel, b.art, b.id, b.geprueft, b.von].join(), "lernsteig,s,uebungen,brueche,true,Patrik", "Anfrage mit App, Schlüssel, von");
    gleich([Object.keys(PS.uebungen).join(), "alt" in PS.uebungen].join(), "brueche,false", "Prüfstand vom Server übernommen (dasselbe Objekt)");
    gleich((await D2.bemerkungen()).length, 1, "Bemerkungen gelesen");
    gleich(anfragen.some(a => a.url === "/entwicklung/bemerkungen?app=lernsteig"), true, "Bemerkungen je App");
    gleich(await D2.bemerkungStatus(1, "erledigt"), false, "Fehler des Servers: false");
    gleich(meldungen.pop(), "Entwickler-Server: Schlüssel passt nicht", "Fehler des Servers gemeldet");
    D.sperren(); gleich(D.freigeschaltet(), false, "sperren");
    wirft(() => E({ speicher: KERN.speicher("lernsteig:"), aufsicht: () => true }), "app fehlt");
    wirft(() => E({ app: "x", aufsicht: () => true }), "speicher fehlt");
    delete global.fetch; delete global.localStorage;
  }

  // ---------- Einladung ----------
  {
    console.log("einladung.js");
    const EI = KERN.einladung;
    const pruefung = { ziel: "lernsteig", klasse: k => (["7", "8", "9"].includes(String(k)) ? String(k) : null),
      niveau: n => (n && typeof n === "object" ? n : null), lehrplan: l => (l && l.land === "CH" ? { land: "CH", kanton: typeof l.kanton === "string" ? l.kanton : null } : null) };
    const e = EI.erstellen({ name: " Zoë  Müller ", geboren: "2013-06", klasse: 7, niveau: { mathematik: "n2" }, lehrplan: { land: "CH", kanton: "SG" }, leer: "" }, { ziel: "lernsteig", von: "eulenpfad" });
    gleich([e.format, e.v, e.ziel, e.von, "leer" in e].join(), "einladung,1,lernsteig,eulenpfad,false", "erstellen: Format, Ziel, Herkunft, nur bekannte Felder");
    const f = EI.fragment(e);
    gleich(/^#einladung=[A-Za-z0-9_-]+$/.test(f), true, "Fragment base64url");
    gleich(JSON.stringify(EI.lesen("https://x/lernsteig/index.html" + f, pruefung)),
      JSON.stringify({ name: "Zoë Müller", geboren: "2013-06", klasse: "7", niveau: { mathematik: "n2" }, lehrplan: { land: "CH", kanton: "SG" }, von: "eulenpfad" }), "Link lesen mit Umlauten");
    gleich(EI.lesen(JSON.parse(JSON.stringify(e)), pruefung)?.name, "Zoë Müller", "Datei (Objekt) lesen");
    // ältere Einladung des Lernsteigs: { v: 1 } ohne format, kodiert mit unescape(encodeURIComponent(…))
    const alt = "#einladung=" + Buffer.from(JSON.stringify({ v: 1, name: "Jürg", klasse: "8" }), "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    gleich(JSON.stringify(EI.lesen(alt, pruefung)), JSON.stringify({ name: "Jürg", klasse: "8" }), "ältere Einladung ohne format");
    gleich(EI.lesen(EI.fragment(EI.erstellen({ name: "A" }, { ziel: "gratwanderung" })), pruefung), null, "Einladung für eine andere App");
    gleich(EI.lesen({ format: "etwas", v: 1, name: "A" }, pruefung), null, "fremdes Format");
    gleich(EI.lesen({ v: 2, name: "A" }, pruefung), null, "andere Version");
    gleich(EI.lesen({ v: 1, name: "   " }, pruefung), null, "ohne Vornamen");
    gleich(EI.lesen("#einladung=%%%", pruefung), null, "kaputter Link");
    gleich(EI.lesen("#einladung=" + Buffer.from([0xff, 0xfe]).toString("base64"), pruefung), null, "kein UTF-8");
    gleich(EI.lesen("#nichts", pruefung), null, "ohne Einladung");
    gleich(JSON.stringify(EI.lesen({ v: 1, name: "B", klasse: 12, geboren: "gestern", lehrplan: { land: "XX" } }, pruefung)), JSON.stringify({ name: "B" }), "ungültige Felder fallen weg");
    wirft(() => EI.erstellen({ klasse: 7 }), "erstellen ohne Vornamen");
    gleich(EI.dateiname("lernsteig"), "lernsteig-einladung.json", "Dateiname");
  }

  // ---------- Auswertung ----------
  {
    console.log("auswertung.js");
    const AW = KERN.auswertung;
    // fester Startwert für die Nachrechnungen (mulberry32)
    const zufallMit = s => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    gleich([AW.mittel([1, 2, 3]), AW.mittel([]), AW.median([5, 1, 3]), AW.median([])].join(), "2,,3,", "mittel, median");
    gleich(AW.korrelation([1, 2, 3, 4], [2, 4, 6, 8]), 1, "Korrelation 1");
    gleich(AW.korrelation([1, 2], [1, 2]), null, "zu wenig Werte");
    gleich(AW.korrelation([1, 1, 1], [1, 2, 3]), null, "ohne Streuung");
    // Sitzungen: 20 Minuten Pause plus Dauer
    const r = (iso, dauer = 60) => ({ zeit: iso, dauer });
    const s = AW.sitzungen([r("2026-11-02T10:00:00Z"), r("2026-11-02T10:15:00Z"), r("2026-11-02T11:00:00Z")]);
    gleich(s.map(x => x.length).join(), "2,1", "Sitzungen getrennt nach Pause");
    // Stand: Fenster, Schwelle, gezeigte Lösung
    const a = (n, ja) => Array.from({ length: n }, (_, i) => ({ anhieb: i < ja }));
    const st = AW.stand([...a(5, 0), ...a(10, 9)], { fenster: 10, mindestens: 10, schwelle: 0.85 });
    gleich([st.n, st.imFenster, st.anhieb, st.quote, st.sicher].join(), "15,10,9,0.9,true", "Stand: nur das Fenster zählt");
    gleich(AW.stand([...a(9, 9), { anhieb: true, gezeigt: true }], { fenster: 10, mindestens: 10, schwelle: 0.85 }).sicher, false, "gezeigte Lösung im Fenster: nicht sicher");
    gleich(AW.stand(a(9, 9), { fenster: 10, mindestens: 10, schwelle: 0.85 }).sicher, false, "zu wenig Aufgaben");
    gleich(AW.stand([]).quote, null, "ohne Aufgaben: keine Quote");
    // Nachrechnung AW2 a: bei gleich langen Runden (8 Aufgaben) ist die Quote der letzten 24 Aufgaben genau das Mittel der
    // Quoten der letzten drei Runden (die bisherige Regel im Eulenpfad)
    {
      let abweichung = 0;
      const zuf = zufallMit(7);
      for (let fall = 0; fall < 2000; fall++) {
        const runden = Array.from({ length: 1 + Math.floor(zuf() * 6) }, () => Array.from({ length: 8 }, () => ({ anhieb: zuf() < 0.7 })));
        const alt = AW.mittel(runden.slice(-3).map(rr => rr.filter(x => x.anhieb).length / 8));
        const neu = AW.stand(runden.flat(), { fenster: 24 }).quote;
        if (Math.abs(alt - neu) > 1e-12) abweichung++;
      }
      gleich(abweichung, 0, "Fenster 24 = Mittel der letzten drei Runden zu 8 Aufgaben (2000 Fälle)");
    }
    // Bedarf wie bisher im Eulenpfad
    gleich([AW.bedarf(null, 0), AW.bedarf(0.5, 1), AW.bedarf(0.8, 1), AW.bedarf(0.8, 7)].join(), "2,3,0.5,2", "Bedarf: neu, wackelt, frisch, verteilt");
    // Ziehen nach Gewicht
    let z = 0; const folge = [0.1, 0.9]; const quelle = () => folge[z++ % 2];
    gleich(AW.ziehe(["a", "b"], x => (x === "a" ? 1 : 1), undefined, quelle), "a", "ziehen: kleine Zufallszahl → erstes");
    gleich(AW.ziehe(["a", "b", "c"], () => 1, 5).length, 3, "ziehen ohne Zurücklegen, höchstens alle");
    gleich(AW.ziehe(["a", "b"], x => (x === "a" ? 0 : 1)), "b", "Gewicht 0 wird nie gezogen");
    // Wochen: Ziel mit Minuten (Eulenpfad), Tage ohne Minuten (Lernsteig)
    const heute = new Date(2026, 10, 6, 12); // Donnerstag
    const runde = (tag, min) => ({ zeit: new Date(2026, 10, tag, 10).toISOString(), dauer: min * 60 });
    const w = AW.wochen([runde(2, 12), runde(3, 5), runde(3, 6), runde(4, 3), runde(6, 15)], { tage: 3, minuten: 10 }, heute.getTime());
    gleich([w.wochen.length, w.aktuelle.erfuellteTage, w.aktuelle.erfuellt, w.serie, w.aktuelle.laufend].join(), "1,3,true,1,true", "Wochenziel mit Minuten");
    const ohne = AW.wochen([runde(4, 1)], null, heute.getTime());
    gleich([ohne.aktuelle.erfuellteTage, ohne.aktuelle.erfuellt, ohne.serie].join(), "1,false,0", "ohne Ziel: Tage gezählt, keine Woche erfüllt");
    gleich(AW.wochenStart(heute).getDay(), 1, "Woche beginnt am Montag");
    // Nachrechnung: wochen ohne Minuten = die bisherige Wochenserie des Lernsteigs (werkzeug.js bis LERN_Session16)
    {
      const tagText = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const wb = d => { const m = new Date(d.getFullYear(), d.getMonth(), d.getDate()); m.setDate(m.getDate() - ((m.getDay() + 6) % 7)); return m; };
      function serieAlt(tage, ziel, h) {
        const zaehle = b => { let n = 0; for (let i = 0; i < 7; i++) { const d = new Date(b); d.setDate(d.getDate() + i); if (tage.has(tagText(d))) n++; } return n; };
        const j = wb(h); const diese = zaehle(j); let f = 0; const x = new Date(j);
        for (let i = 0; i < 520; i++) { x.setDate(x.getDate() - 7); if (zaehle(x) >= ziel) f++; else break; }
        return { dieseWoche: diese, erreicht: diese >= ziel, wochenInFolge: f + (diese >= ziel ? 1 : 0) };
      }
      let abw = 0;
      const zuf = zufallMit(11);
      for (let fall = 0; fall < 500; fall++) {
        const rs = Array.from({ length: Math.floor(zuf() * 40) }, () => ({ zeit: new Date(2026, 9, 1 + Math.floor(zuf() * 37), Math.floor(zuf() * 22)).toISOString(), dauer: 60 }));
        const ziel = 1 + Math.floor(zuf() * 4);
        const alt = serieAlt(new Set(rs.map(e => tagText(new Date(e.zeit)))), ziel, heute);
        const neu = AW.wochen(rs, { tage: ziel }, heute.getTime());
        if (alt.dieseWoche !== neu.aktuelle.erfuellteTage || alt.erreicht !== neu.aktuelle.erfuellt || alt.wochenInFolge !== neu.serie) abw++;
      }
      gleich(abw, 0, "wochen = bisherige Wochenserie des Lernsteigs (500 Fälle)");
    }
  }

  // ---------- daten (Sichern, Einlesen, Abgleich; DF1 a, DF2 a, DF4 a) ----------
  console.log("daten.js");
  {
    const D = KERN.daten;
    // zwei Geräte = zwei Präfixe in einem Ersatz-Speicher; voll: nach so vielen Schreibvorgängen scheitert der nächste
    const ablage = new Map();
    let schreibeZaehler = 0, vollNach = Infinity;
    global.localStorage = {
      getItem: k => (ablage.has(k) ? ablage.get(k) : null),
      setItem: (k, v) => { if (schreibeZaehler >= vollNach) throw new Error("QuotaExceededError"); schreibeZaehler++; ablage.set(k, String(v)); },
      removeItem: k => ablage.delete(k),
      key: i => [...ablage.keys()][i] ?? null,
      get length() { return ablage.size; },
    };
    let nr = 0;
    const PRUEF = { runde: { pflicht: ["aufgaben", "dauer"] }, rekord: { pflicht: ["dauer"] } };
    const geraet = (app = "eulenpfad", extra = {}) => {
      const sp = KERN.speicher(`geraet-${++nr}:`);
      return { sp, P: P.liste(sp), D: D({ app, speicher: sp, pruefung: PRUEF, dateiPraefix: app === "eulenpfad" ? "lernspiele" : app, ...extra }) };
    };
    const runde = (person, zeit, inhalt = "zahlenhaus", extra = {}) => ({ id: KERN.runden.neueId(), person, zeit, inhalt, stufe: "s3", aufgaben: 5, fehler: 0, dauer: 60, ...extra });
    const t = tag => `2026-11-${String(tag).padStart(2, "0")}T10:00:00.000Z`;

    // 1. Sichern auf A, Einlesen auf B (leer)
    const A = geraet(), B = geraet();
    const mia = A.P.anlegen({ name: "Mia", klasse: 2 }), leo = A.P.anlegen({ name: "Leo" });
    A.sp.schreibe("runden", [runde(mia.id, t(1)), runde(leo.id, t(2))]);
    A.sp.schreibe("rekorde", [{ id: "r-rek-1", person: mia.id, zeit: t(1), inhalt: "zahlenhaus", stufe: "s6", punkte: 4, dauer: 30 }]);
    const datei = JSON.stringify(A.D.sichern());
    const s = JSON.parse(datei);
    gleich([s.format, s.version, s.app, s.art, s.personen.length, s.runden.length].join(), "reihe-daten,1,eulenpfad,sicherung,2,2", "Sicherung: Kopf und Inhalt");
    gleich(s.geloescht, undefined, "Sicherung ohne Löschvermerke");
    const e1 = B.D.einlesen(datei);
    gleich([e1.personen.neu, e1.runden, e1.rekorde, e1.abgewiesen, e1.neueIds.length].join(), "2,2,1,0,2", "Einlesen auf leerem Gerät");
    gleich(B.sp.lies("runden", []).length, 2, "Runden gespeichert");
    // zweites Mal: nichts neu, nichts geschrieben
    const vorSchreiben = schreibeZaehler;
    const e2 = B.D.einlesen(datei);
    gleich([e2.personen.neu, e2.personen.geaendert, e2.runden, e2.rekorde, e2.geschrieben.length, schreibeZaehler - vorSchreiben].join(), "0,0,0,0,0,0", "zweites Einlesen ändert nichts");
    // nur eine Person sichern
    const nurMia = A.D.sichern({ ids: [mia.id] });
    gleich([nurMia.personen.length, nurMia.runden.length, nurMia.rekorde.length].join(), "1,1,1", "Sicherung einer Person");
    gleich(A.D.sichern({ filter: e => e.inhalt !== "zahlenhaus" }).runden.length, 0, "Filter der Runden");

    // 2. Kopf: fremde App, neuere Fassung, kaputt
    const meldung = f => { try { f(); return "kein Fehler"; } catch (e) { return e.message; } };
    const L = geraet("lernsteig");
    gleich(meldung(() => L.D.einlesen(datei)), "Das ist eine Datei des Eulenpfads; hier lässt sie sich nicht einlesen.", "Datei einer anderen App");
    gleich(meldung(() => B.D.einlesen({ format: "lernsteig-sicherung", version: 2, konten: [] })), "Das ist eine Datei des Lernsteigs; hier lässt sie sich nicht einlesen.", "alte Sicherung des Lernsteigs im Eulenpfad");
    gleich(/neueren Fassung/.test(meldung(() => B.D.einlesen({ ...s, version: 2 }))), true, "neuere Fassung");
    gleich(meldung(() => B.D.einlesen("{kaputt")), "Diese Datei kann ich nicht lesen.", "kein JSON");
    gleich(meldung(() => B.D.einlesen({ ...s, personen: {} })), "Die Datei ist beschädigt.", "personen keine Liste");
    gleich(meldung(() => B.D.einlesen({ hallo: 1 })), "Das ist keine Sicherung und keine Abgleich-Datei.", "fremde JSON-Datei");

    // 3. Prüfung je Eintrag: ungültige und solche ohne Person abgewiesen, gültige eingelesen
    {
      const C = geraet();
      const kaputt = { ...s, runden: [...s.runden, { ...runde(mia.id, t(3)), zeit: "gestern" }, runde("p-unbekannt-1", t(3)), { ...runde(mia.id, t(4)), dauer: undefined }] };
      const e = C.D.einlesen(kaputt);
      gleich([e.runden, e.abgewiesen].join(), "2,3", "ungültige Runden und Runden ohne Person abgewiesen");
      const mitGast = geraet("lernsteig", { ohnePerson: ["gast"] });
      const e3 = mitGast.D.einlesen({ ...s, app: "lernsteig", runden: [runde("gast", t(3))] });
      gleich(e3.runden, 1, "Runde ohne Person bei ohnePerson");
    }

    // 4. Alles oder nichts: Speicher voll beim dritten Schreiben
    {
      const C = geraet();
      vollNach = schreibeZaehler + 2;
      gleich(meldung(() => C.D.einlesen(datei)), "Der Speicher des Browsers ist voll oder gesperrt; nichts wurde eingelesen.", "voller Speicher: Meldung");
      vollNach = Infinity;
      gleich(C.sp.schluessel().length, 0, "voller Speicher: nichts geblieben");
    }

    // 5. Gleicher Name, andere Kennung: verbunden, Verweise umgebogen
    {
      const C = geraet();
      const mia2 = C.P.anlegen({ name: "mia" });
      C.sp.schreibe("runden", [runde(mia2.id, t(5))]);
      const e = C.D.einlesen(datei);
      const ps = C.P.alle();
      const bleibt = ps.find(p => P.nameGleich(p.name, "Mia"));
      gleich([ps.length, e.personen.neu].join(), "2,1", "gleicher Name: eine Person, Leo neu");
      gleich(C.sp.lies("runden", []).filter(r => r.person === bleibt.id).length, 2, "alle Runden von Mia auf der bleibenden Kennung");
      gleich(Object.keys(e.kennungen).length, 1, "eine umgebogene Kennung");
    }

    // 6. Rekord: höherer Stand ersetzt, niedrigerer nicht
    {
      const r = B.D.einlesen({ ...s, rekorde: [{ ...s.rekorde[0], punkte: 9 }] });
      gleich([r.rekorde, B.sp.lies("rekorde", [])[0].punkte].join(), "1,9", "höherer Rekord ersetzt");
      gleich(B.D.einlesen({ ...s, rekorde: [{ ...s.rekorde[0], punkte: 2 }] }).rekorde, 0, "niedrigerer Rekord nicht");
    }

    // 7. Löschvermerke (DF2 a): auf A gelöscht → beim Abgleich auch auf B weg; eine alte Datei holt nichts zurück;
    //    später neu Angelegtes bleibt
    {
      const A2 = geraet(), B2 = geraet();
      const ida = A2.P.anlegen({ name: "Ida" });
      A2.sp.schreibe("runden", [runde(ida.id, t(1)), runde(ida.id, t(2), "uhr-werkstatt")]);
      const alt = A2.D.sichern({ art: "abgleich" });
      B2.D.einlesen(alt);
      gleich(B2.P.alle().length, 1, "Vermerk: Ida auf B");
      gleich(A2.D.loeschePerson(ida.id), true, "Person löschen");
      gleich([A2.P.alle().length, A2.sp.lies("runden", []).length].join(), "0,0", "Person und Runden weg");
      A2.D.einlesen(alt);
      gleich(A2.P.alle().length, 0, "alte Datei holt die Gelöschte nicht zurück");
      const e = B2.D.einlesen(A2.D.sichern({ art: "abgleich" }));
      gleich([B2.P.alle().length, B2.sp.lies("runden", []).length, e.geschrieben.includes("geloescht")].join(), "0,0,true", "Abgleich löscht auf B");
      // danach neu angelegt mit demselben Namen: bleibt (erst in der nächsten Millisekunde, sonst gleich alt wie der Vermerk)
      for (const bis = Date.now() + 2; Date.now() < bis;);
      const ida2 = B2.P.anlegen({ name: "Ida" });
      B2.sp.schreibe("runden", [runde(ida2.id, new Date(Date.now() + 1000).toISOString())]);
      A2.D.einlesen(B2.D.sichern({ art: "abgleich" }));
      gleich([A2.P.alle().length, A2.sp.lies("runden", []).length].join(), "1,1", "später neu Angelegte bleibt");
      // Runden eines Inhalts zurücksetzen
      const ben = A2.P.anlegen({ name: "Ben" });
      A2.sp.schreibe("runden", [...A2.sp.lies("runden", []), runde(ben.id, t(1)), runde(ben.id, t(2), "uhr-werkstatt")]);
      B2.D.einlesen(A2.D.sichern({ art: "abgleich" }));
      A2.D.loescheRunden(ben.id, "uhr-werkstatt");
      B2.D.einlesen(A2.D.sichern({ art: "abgleich" }));
      gleich(B2.sp.lies("runden", []).filter(r => r.person === ben.id).map(r => r.inhalt).join(), "zahlenhaus", "Runden eines Inhalts zurückgesetzt, auch auf B");
      // Vermerke des Eulenpfads bis LERN_Session18 (spieler, spiel) werden gelesen
      const v = D.vermerkeRein({ spieler: { Mia: t(3) }, runden: [{ name: "Mia", spiel: "uhr", bis: t(4) }] });
      gleich([v.namen.Mia, v.runden[0].inhalt].join(), `${t(3)},uhr`, "alte Vermerke umgedeutet");
    }

    // 8. Freigabe (nur mit opt.freigabe, im Abgleich): jüngster Stand gewinnt
    {
      const F1 = geraet("eulenpfad", { freigabe: true }), F2 = geraet("eulenpfad", { freigabe: true });
      F1.sp.schreibe("freigabe", { spiele: { a: true } }); F1.sp.schreibe("freigabeStand", t(5));
      F2.sp.schreibe("freigabe", { spiele: { a: false } }); F2.sp.schreibe("freigabeStand", t(3));
      gleich(F2.D.einlesen(F1.D.sichern({ art: "abgleich" })).freigabe, true, "jüngere Freigabe übernommen");
      gleich(F1.D.einlesen(F2.D.sichern({ art: "abgleich" })).freigabe, false, "gleiche Freigabe: nichts");
      gleich(JSON.stringify(F2.sp.lies("freigabe", null)), '{"spiele":{"a":true}}', "Freigabe von F1 auf F2");
      gleich(B.D.sichern({ art: "abgleich" }).freigabe, undefined, "ohne opt.freigabe keine Freigabe in der Datei");
    }

    // 9. Teile der App (Meldungen): sichern je Person, zusammenführen, beim Löschen entfernt
    {
      const teil = { schluessel: "meldungen",
        sichern: (ids, eigene) => (eigene || []).filter(m => !ids || ids.includes(m.person)),
        zusammenfuehren: (eigene, fremde, h) => {
          const l = (eigene || []).slice(); let neu = 0;
          for (const m of fremde || []) if (!l.some(x => x.id === m.id)) { l.push({ ...m, person: h.umbiegen(m.person) }); neu++; }
          return { wert: l, neu };
        },
        entferne: (eigene, ids) => (eigene || []).filter(m => !ids.includes(m.person)) };
      const M1 = geraet("eulenpfad", { teile: { meldungen: teil } }), M2 = geraet("eulenpfad", { teile: { meldungen: teil } });
      const ana = M1.P.anlegen({ name: "Ana" });
      M1.sp.schreibe("meldungen", [{ id: "m-1", person: ana.id }]);
      gleich(M2.D.einlesen(M1.D.sichern()).teile.meldungen, 1, "Teil der App eingelesen");
      M2.D.loeschePerson(M2.P.alle()[0].id);
      gleich(M2.sp.lies("meldungen", []).length, 0, "Teil beim Löschen entfernt");
      wirft(() => D({ app: "eulenpfad", speicher: M1.sp, teile: { runden: teil } }), "Teil mit dem Namen eines Kernfelds");
    }

    // 10. Ältere Dateien
    {
      const E = geraet();
      const v2 = { version: 2, gesichert: t(1), profile: { Ida: { klasse: 2, geaendert: { klasse: t(1) } } },
        protokoll: [{ name: "Ida", zeit: t(1), spiel: "zahlenhaus", stufe: "s2", aufgaben: 5, fehler: 0, dauer: 60 },
          { name: "Tom", zeit: t(2), spiel: "zahlenhaus", stufe: "s2", aufgaben: 5, fehler: 0, dauer: 60 }], rekorde: [],
        geloescht: { spieler: { Alt: t(1) } }, meldungen: [] };
      const e = E.D.einlesen(v2);
      gleich([e.personen.neu, e.runden, E.P.alle().map(p => p.name).sort().join("+")].join(), "2,2,Ida+Tom", "Eulenpfad Version 2: Profile nach Namen, Kind nur in Runden");
      gleich(E.sp.lies("runden", []).every(r => r.inhalt === "zahlenhaus" && /^r-alt-/.test(r.id)), true, "spiel → inhalt, feste Kennung");
      gleich(E.D.einlesen(v2).runden, 0, "dieselbe alte Datei zählt beim zweiten Mal nicht");
      gleich(E.D.vermerke().namen.Alt, t(1), "alte Löschvermerke nach Namen übernommen");
      const v3 = { format: "eulenpfad-daten", version: 3, gesichert: t(3), personen: [{ id: "p-v3-ana", name: "Ana", rolle: "lernend", angelegt: t(1), geaendert: { name: t(1) } }],
        protokoll: [{ id: "r-v3-1", person: "p-v3-ana", name: "Ana", zeit: t(3), inhalt: "zahlenhaus", stufe: "s3", aufgaben: 5, fehler: 1, dauer: 60 }], rekorde: [] };
      gleich(E.D.einlesen(v3).runden, 1, "Eulenpfad Version 3");
      gleich(meldung(() => E.D.einlesen({ ...v3, version: 7 })), "Die Datei ist beschädigt.", "Eulenpfad unbekannte Version");
      const L2 = geraet("lernsteig");
      const lv1 = { format: "lernsteig-sicherung", version: 1, erstellt: t(1),
        konten: [{ id: "k-alt-1", name: "Noa", erstellt: t(1), geaendert: t(2), klasse: "7" }],
        runden: [{ konto: "k-alt-1", zeit: t(2), uebung: "terme", stufe: "s1", aufgaben: 4, dauer: 50 }] };
      const el = L2.D.einlesen(lv1);
      gleich([el.personen.neu, el.runden, L2.P.alle()[0].rolle, L2.sp.lies("runden", [])[0].inhalt].join(), "1,1,lernend,terme", "Lernsteig Version 1");
    }

    // 11. Geschützte Personen (DF4 a)
    {
      const G1 = geraet("lernsteig", { geraetFelder: ["aufsicht", "anfragen"] }), G2 = geraet("lernsteig", { geraetFelder: ["aufsicht", "anfragen"] });
      const w = await G.wiederherstellung({ frage: "Haustier?", antwort: "Bello" });
      const noa = G1.P.anlegen({ name: "Noa", pin: await G.pin("2468"), wiederherstellung: w.wiederherstellung, aufsicht: ["a-1"] });
      const d = G1.D.sichern();
      const pd = d.personen[0];
      gleich([pd.pin, pd.geschuetzt, Object.keys(pd.wiederherstellung).join(), pd.aufsicht].join("|"), "|true|code|", "Datei: ohne PIN, Frage und Gerätefelder, mit Vermerk und Code");
      gleich(JSON.stringify(d).includes(noa.pin.hash), false, "PIN-Prüfwert nicht in der Datei");
      G2.D.einlesen(d);
      const da = G2.P.finde(noa.id);
      gleich([P.gesperrt(da), !!da.pin].join(), "true,false", "auf dem anderen Gerät gesperrt");
      const platz = KERN.anmeldung.platz({ speicher: G2.sp, gewaehlt: "aktiv", tab: "angemeldet", finde: id => G2.P.finde(id) });
      gleich(await platz.anmelden(noa.id, ""), null, "gesperrt: keine Anmeldung ohne PIN");
      gleich(platz.waehle(noa.id), false, "gesperrt: nicht wählbar");
      G2.sp.schreibe("aktiv", noa.id);
      gleich(platz.aktiv(), null, "gesperrt: frühere Wahl gilt nicht");
      faelle++;
      try { await P.freischalten(G2.P, noa.id, "1357", { code: "AAAA-AAAA-AAAA" }); fehler++; console.log("    FEHLER  falscher Code schaltet frei"); } catch (e) { /* erwartet */ }
      await P.freischalten(G2.P, noa.id, "1357", { code: w.code });
      const frei = G2.P.finde(noa.id);
      gleich([P.gesperrt(frei), frei.gesperrt, await G.pinStimmt("1357", frei.pin)].join(), "false,,true", "mit dem Code freigeschaltet, neue PIN");
      gleich((await platz.anmelden(noa.id, "1357"))?.id, noa.id, "danach Anmeldung mit der neuen PIN");
      gleich(await G.codeStimmt(w.code, frei.wiederherstellung), true, "Code bleibt derselbe");
      // eine lokale PIN bleibt, ein Schutz wird nie weggenommen
      G2.D.einlesen(G1.D.sichern());
      gleich(await G.pinStimmt("1357", G2.P.finde(noa.id).pin), true, "eigene PIN bleibt beim nächsten Einlesen");
      const G3 = geraet("lernsteig");
      G3.D.einlesen(d);
      G3.D.einlesen({ ...d, personen: [{ ...pd, geschuetzt: false, gesperrt: false, geaendert: { ...pd.geaendert, gesperrt: t(30), pin: t(30) } }] });
      gleich(P.gesperrt(G3.P.finde(noa.id)), true, "eine Datei hebt die Sperre nicht auf");
      // hier bewusst ohne PIN (später geändert als dort): nicht wieder gesperrt
      const G4 = geraet("lernsteig");
      const noa4 = G4.P.anlegen({ id: noa.id, name: "Noa" });
      G4.P.aendere(noa4.id, { pin: null });
      G4.D.einlesen({ ...d, personen: [{ ...pd, geaendert: { ...pd.geaendert, pin: t(1) } }] });
      gleich(P.gesperrt(G4.P.finde(noa.id)), false, "hier später ohne PIN: nicht gesperrt");
      // eine Aufsicht ohne Vermerk ist trotzdem geschützt; ohne Code nur mit Bestätigung freizuschalten
      const G5 = geraet();
      G5.D.einlesen({ format: "reihe-daten", version: 1, app: "eulenpfad", art: "abgleich", personen: [{ id: "p-auf-1", name: "Mama", rolle: "aufsicht", angelegt: t(1), geaendert: { name: t(1) } }], runden: [], rekorde: [] });
      gleich(P.gesperrt(G5.P.finde("p-auf-1")), true, "Aufsicht aus einer Datei gesperrt");
      faelle++;
      try { await P.freischalten(G5.P, "p-auf-1", "1111", { code: "X" }); fehler++; console.log("    FEHLER  ohne Code freigeschaltet"); } catch (e) { /* erwartet */ }
      await P.freischalten(G5.P, "p-auf-1", "1111", { bestaetigt: true });
      gleich(P.gesperrt(G5.P.finde("p-auf-1")), false, "Aufsicht mit Bestätigung freigeschaltet");
      // OA1 a: Auf einem Gerät mit einer Aufsicht mit PIN (Mama) reicht der richtige Code einer weiteren Aufsicht nicht —
      // sonst brächte eine selbst gebaute Datei mit bekanntem Code eine Aufsicht ohne Bestätigung aufs Gerät
      {
        const w = await G.wiederherstellung({});
        const papa = { id: "p-auf-2", name: "Papa", rolle: "aufsicht", geschuetzt: true, wiederherstellung: { code: w.wiederherstellung.code }, angelegt: t(1), geaendert: { name: t(1), wiederherstellung: t(1) } };
        const datei = { format: "reihe-daten", version: 1, app: "eulenpfad", art: "abgleich", personen: [papa], runden: [], rekorde: [] };
        G5.D.einlesen(datei);
        gleich([P.gesperrt(G5.P.finde("p-auf-2")), P.codeReicht(G5.P, "p-auf-2")].join(), "true,false", "weitere Aufsicht aus der Datei: gesperrt, Code reicht nicht");
        let meldung = "";
        try { await P.freischalten(G5.P, "p-auf-2", "2222", { code: w.code }); } catch (e) { meldung = e.message; }
        gleich([meldung, P.gesperrt(G5.P.finde("p-auf-2"))].join("|"), `${P.NUR_BESTAETIGUNG}|true`, "richtiger Code allein schaltet keine weitere Aufsicht frei");
        // ohne Aufsicht mit PIN auf dem Gerät reicht derselbe Code (die erste Aufsicht braucht keine Bestätigung, D5)
        const G7 = geraet();
        G7.D.einlesen(datei);
        gleich(P.codeReicht(G7.P, "p-auf-2"), true, "Gerät ohne Aufsicht mit PIN: Code reicht");
        await P.freischalten(G7.P, "p-auf-2", "2222", { code: w.code });
        gleich(P.gesperrt(G7.P.finde("p-auf-2")), false, "dort mit dem Code freigeschaltet");
        gleich(P.codeReicht(G5.P, "p-gibt-es-nicht"), false, "unbekannte Person: kein Code");
      }
      // fuerDatei einer gesperrten Person: weiter geschützt (über ein drittes Gerät)
      gleich(P.fuerDatei(G3.P.finde(noa.id)).geschuetzt, true, "gesperrte Person reist geschützt weiter");
      gleich(JSON.stringify(P.ohneGeheimnis({ id: "p-x", gesperrt: true, geschuetzt: true, pin: 1 })), '{"id":"p-x"}', "ohneGeheimnis nimmt den Schutz mit weg");
      // eine eigene PIN nimmt den Vermerk weg: später ohne PIN nicht wieder gesperrt
      const G6 = geraet("lernsteig");
      G6.D.einlesen(d);
      G6.P.aendere(noa.id, { pin: await G.pin("1212") });
      G6.P.aendere(noa.id, { pin: null });
      gleich([P.gesperrt(G6.P.finde(noa.id)), G6.P.finde(noa.id).gesperrt].join(), "false,", "eigene PIN gesetzt und entfernt: nicht wieder gesperrt");
      // Rollen beim Einlesen: ohne „aufsicht“ werden Aufsichten abgewiesen
      const G7 = geraet();
      const nurLernende = G7.D.einlesen({ format: "reihe-daten", version: 1, app: "eulenpfad", personen: [{ id: "p-auf-3", name: "Oma", rolle: "aufsicht", angelegt: t(1), geaendert: {} }, { id: "p-kind-3", name: "Kim", rolle: "lernend", angelegt: t(1), geaendert: {} }], runden: [], rekorde: [] }, { rollen: ["lernend"] });
      gleich([nurLernende.personen.neu, nurLernende.abgewiesen, G7.P.alle().map(p => p.name).join()].join(), "1,1,Kim", "rollen: Aufsicht abgewiesen");
      // weitere Prüfung der App (gueltig)
      const G8 = D({ app: "lernsteig", speicher: KERN.speicher("geraet-g8:"), pruefung: PRUEF, gueltig: { runde: e => (e.liste || []).every(x => x && typeof x === "object") } });
      const gk = G8.einlesen({ format: "reihe-daten", version: 1, app: "lernsteig", personen: [pd], runden: [runde(noa.id, t(2), "terme", { liste: [1] }), runde(noa.id, t(3), "terme", { liste: [{}] })], rekorde: [] });
      gleich([gk.runden, gk.abgewiesen].join(), "1,1", "gueltig der App: Runde mit falscher Liste abgewiesen");
      // ohne die Option schutz (Umzug am selben Gerät) sperrt zusammenfuehren nichts
      const ohne = P.zusammenfuehren([], [{ id: "p-auf-2", name: "Papa", rolle: "aufsicht", geschuetzt: true }]);
      gleich(ohne.personen[0].gesperrt, undefined, "zusammenfuehren ohne schutz: nicht gesperrt");
    }

    // 12. Nachrechnung: zwei Geräte mit zufälligen Runden und Löschungen gleichen in beide Richtungen ab →
    //     danach dieselben Personen und Runden, und keine gelöschte Runde ist zurück
    {
      const zufallMit = s => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let u = Math.imul(s ^ (s >>> 15), 1 | s); u = (u + Math.imul(u ^ (u >>> 7), 61 | u)) ^ u; return ((u ^ (u >>> 14)) >>> 0) / 4294967296; };
      const zuf = zufallMit(23);
      let abw = 0;
      for (let fall = 0; fall < 150; fall++) {
        const X = geraet(), Y = geraet();
        const namen = ["Ada", "Bo", "Cem"];
        const pers = { X: {}, Y: {} };
        for (const n of namen) { if (zuf() < 0.8) pers.X[n] = X.P.anlegen({ name: n }); if (zuf() < 0.8) pers.Y[n] = Y.P.anlegen({ name: n }); }
        for (const [g, k] of [[X, "X"], [Y, "Y"]]) {
          const l = [];
          for (let i = 0; i < 6; i++) { const n = namen[Math.floor(zuf() * 3)]; if (pers[k][n]) l.push(runde(pers[k][n].id, t(1 + Math.floor(zuf() * 20)))); }
          g.sp.schreibe("runden", l);
        }
        if (zuf() < 0.5) { const n = namen[Math.floor(zuf() * 3)]; if (pers.X[n]) X.D.loeschePerson(pers.X[n].id); }
        if (zuf() < 0.5) { const n = namen[Math.floor(zuf() * 3)]; if (pers.Y[n]) Y.D.loescheRunden(pers.Y[n].id); }
        Y.D.einlesen(X.D.sichern({ art: "abgleich" }));
        X.D.einlesen(Y.D.sichern({ art: "abgleich" }));
        Y.D.einlesen(X.D.sichern({ art: "abgleich" }));
        const bild = g => [g.P.alle().map(p => p.name).sort().join(), g.sp.lies("runden", []).map(r => r.id).sort().join()].join("|");
        const vg = X.D.vermerke();
        const zurueck = X.sp.lies("runden", []).some(r => D.eintragWeg(r, X.P.finde(r.person), vg));
        if (bild(X) !== bild(Y) || zurueck) abw++;
      }
      gleich(abw, 0, "Abgleich in beide Richtungen: gleicher Stand, nichts Gelöschtes zurück (150 Fälle)");
    }

    // ---------- abgleich (Ordner zwischen Geräten, DF3 a) ----------
    console.log("abgleich.js");
    {
      // Ersatz-Ordner mit File-System-Access-Schnittstelle: entries, getFileHandle, Erlaubnis
      const ordnerErsatz = (name, erlaubnis = "granted") => {
        const dateien = new Map();
        return { name, dateien, erlaubnis,
          async queryPermission() { return this.erlaubnis; },
          async requestPermission() { return this.erlaubnis === "prompt" ? (this.erlaubnis = "granted") : this.erlaubnis; },
          async *entries() { for (const [n, inhalt] of [...dateien]) yield [n, { kind: "file", getFile: async () => ({ text: async () => inhalt }) }]; },
          async getFileHandle(n, { create } = {}) {
            if (!dateien.has(n) && !create) throw new Error("nicht gefunden");
            return { createWritable: async () => { let puffer = ""; return { write: async s => { puffer += s; }, close: async () => { dateien.set(n, puffer); } }; } };
          } };
      };
      const ablageErsatz = () => { let h = null; return { lies: async () => h, schreibe: async x => { h = x; }, loesche: async () => { h = null; } }; };
      const AB = KERN.abgleich;
      const geraetMitOrdner = (h, extra = {}) => {
        const g = geraet();
        const ab = AB({ speicher: g.sp, dateiPraefix: "lernspiele-sync-", kannOrdner: true, ablage: ablageErsatz(), ordnerWahl: async () => h,
          sichern: geraetInfo => g.D.sichern({ art: "abgleich", geraet: geraetInfo }),
          einlesen: text => { const r = g.D.einlesen(text); return { runden: r.runden, personen: r.personen.neu, abgewiesen: r.abgewiesen }; }, ...extra });
        return { ...g, ab };
      };
      const h = ordnerErsatz("Familie");
      const X = geraetMitOrdner(h), Y = geraetMitOrdner(h), Z = geraetMitOrdner(h);
      const ada = X.P.anlegen({ name: "Ada" });
      X.sp.schreibe("runden", [runde(ada.id, t(1)), runde(ada.id, t(2))]);
      const bo = Y.P.anlegen({ name: "Bo" });
      Y.sp.schreibe("runden", [runde(bo.id, t(3))]);
      X.ab.benenne("Laptop");
      gleich((await X.ab.jetzt()).status, "kein-ordner", "ohne gewählten Ordner");
      const rx = await X.ab.waehlen();
      gleich([rx.status, rx.geraete.length, h.dateien.size].join(), "ok,0,1", "erstes Gerät: nur die eigene Datei");
      gleich(JSON.parse(h.dateien.get(X.ab.eigeneDatei())).geraet.name, "Laptop", "Gerät mit Namen in der Datei");
      const ry = await Y.ab.waehlen();
      gleich([ry.status, ry.neu.runden, ry.neu.personen, ry.geraete[0].name].join(), "ok,2,1,Laptop", "zweites Gerät liest das erste");
      const rx2 = await X.ab.jetzt();
      gleich([rx2.neu.runden, rx2.neu.personen].join(), "1,1", "erstes Gerät liest das zweite");
      gleich((await X.ab.jetzt()).neu.runden || 0, 0, "nochmals: nichts neu");
      // ein drittes Gerät mit einer kaputten Datei im Ordner: die anderen werden trotzdem gelesen
      h.dateien.set("lernspiele-sync-kaputt.json", "{kaputt");
      h.dateien.set("lernsteig-sync-fremd.json", "{}");
      const rz = await Z.ab.waehlen();
      gleich([rz.neu.runden, rz.geraete.length, rz.geraete.filter(g => g.fehler).length].join(), "3,3,1", "kaputte Datei gemeldet, fremdes Präfix übergangen");
      gleich(Z.ab.stand().ordner, "Familie", "Stand mit Ordnername");
      const bild = g => [g.P.alle().map(p => p.name).sort().join(), g.sp.lies("runden", []).map(r => r.id).sort().join()].join("|");
      await Y.ab.jetzt();
      gleich(bild(X) === bild(Y) && bild(Y) === bild(Z), true, "drei Geräte mit demselben Stand");
      // Erlaubnis: ohne Tippen darf der Browser nicht fragen
      h.erlaubnis = "prompt";
      gleich((await X.ab.jetzt(false)).status, "keine-erlaubnis", "ohne Erlaubnis und ohne Tippen");
      gleich((await X.ab.jetzt(true)).status, "ok", "mit Tippen: der Browser fragt");
      // Summe: Zahlen addiert, Ja/Nein verbunden
      gleich(JSON.stringify(AB.summe({ a: 1, f: false }, { a: 2, f: true, x: "text" })), '{"a":3,"f":true}', "summe");
      await X.ab.vergessen();
      gleich([(await X.ab.jetzt()).status, X.ab.stand()].join(), "kein-ordner,", "Ordner vergessen");
      wirft(() => AB({ speicher: X.sp, dateiPraefix: "x", sichern() {}, einlesen() {} }), "Präfix ohne Bindestrich");
      gleich(AB({ speicher: X.sp, dateiPraefix: "lernspiele-sync-", kannOrdner: false, sichern() {}, einlesen() {} }).starte(), false, "ohne Ordner-Fähigkeit kein Selbststart");
    }

    // ---------- rollen (Bestätigung, PIN vergessen, Frist; KR2 a, PIN1 a, RL2 a) ----------
    console.log("rollen.js");
    {
      const RO = KERN.rollen;
      const g = geraet();
      gleich(RO.brauchtBestaetigung(g.P), false, "ohne Aufsicht keine Bestätigung nötig");
      const w = await G.wiederherstellung({ code: "K7QM-2XRA-9TPL", frage: "Haustier?", antwort: "Bello" });
      const mama = g.P.anlegen({ name: "Mama", rolle: "aufsicht", pin: await G.pin("1111"), wiederherstellung: w.wiederherstellung });
      const papa = g.P.anlegen({ name: "Papa", rolle: "aufsicht", pin: await G.pin("2222") });
      const kind = g.P.anlegen({ name: "Kim", aufsicht: [mama.id, papa.id], anfragen: [papa.id] });
      gleich(RO.brauchtBestaetigung(g.P), true, "mit Aufsicht: Bestätigung nötig");
      gleich((await RO.bestaetige(g.P, { id: papa.id, pin: "2222" })).id, papa.id, "Bestätigung mit richtiger PIN");
      const fehlt = async (f, was, text) => { faelle++; try { await f(); fehler++; console.log(`    FEHLER  ${was}: kein Fehler`); } catch (e) { if (text && !e.message.includes(text)) { fehler++; console.log(`    FEHLER  ${was}: ${e.message}`); } } };
      await fehlt(() => RO.bestaetige(g.P, { id: papa.id, pin: "0000" }), "Bestätigung mit falscher PIN", "bestätigen");
      await fehlt(() => RO.bestaetige(g.P, { id: kind.id, pin: "" }), "Bestätigung durch ein Kind", "bestätigen");
      await fehlt(() => RO.neuePin(g.P, mama.id, "3333", { bestaetigung: { id: mama.id, pin: "1111" } }), "sich selbst bestätigen", "bestätigen");
      // Stufe 1: andere Aufsicht; Stufe 2: Code; Stufe 3: Frage — jedes Mal ein neuer Code, Frage bleibt
      const s1 = await RO.neuePin(g.P, mama.id, "3333", { bestaetigung: { id: papa.id, pin: "2222" } });
      gleich([await G.pinStimmt("3333", s1.person.pin), /^[A-Z0-9]{4}-/.test(s1.code), s1.person.wiederherstellung.frage].join(), "true,true,Haustier?", "Stufe 1: andere Aufsicht, neuer Code, Frage bleibt");
      await fehlt(() => RO.neuePin(g.P, mama.id, "4444", { code: "K7QM-2XRA-9TPL" }), "alter Code gilt nicht mehr", "Code stimmt nicht");
      const s2 = await RO.neuePin(g.P, mama.id, "4444", { code: s1.code });
      gleich(await G.pinStimmt("4444", s2.person.pin), true, "Stufe 2: Code");
      await fehlt(() => RO.neuePin(g.P, mama.id, "5555", { antwort: "Katze" }), "falsche Antwort", "Antwort stimmt nicht");
      const s3 = await RO.neuePin(g.P, mama.id, "5555", { antwort: " bello " });
      gleich(await G.pinStimmt("5555", s3.person.pin), true, "Stufe 3: Sicherheitsfrage (Gross/Klein, Leerzeichen egal)");
      await fehlt(() => RO.neuePin(g.P, papa.id, "5555", { antwort: "x" }), "ohne Sicherheitsfrage", "Antwort stimmt nicht");
      // Stufe 4: Frist
      let uhr = new Date("2026-11-06T10:00:00Z");
      const F = RO.frist({ speicher: g.sp, jetzt: () => uhr });
      gleich([F.stand(), F.abgelaufen()].join(), ",false", "ohne Frist nichts");
      gleich(F.anfordern().ab, "2026-11-09T10:00:00.000Z", "Frist 3 Tage");
      uhr = new Date("2026-11-09T09:59:00Z");
      gleich(F.abgelaufen(), false, "vor Ablauf nicht");
      gleich([await RO.abbrechbarMit(g.P, "0000"), await RO.abbrechbarMit(g.P, "5555"), await RO.abbrechbarMit(g.P, s3.code.toLowerCase())].join(), "false,true,true", "abbrechen mit PIN oder Code einer Aufsicht");
      uhr = new Date("2026-11-09T10:00:00Z");
      gleich([F.abgelaufen(), F.stand()].join(), "true,", "nach Ablauf: erledigt");
      // Zurücksetzen: Eulenpfad (Konto ohne PIN) und Lernsteig (entfernt, Verweise gestrichen)
      const g2 = geraet();
      for (const p of g.P.alle()) g2.P.speichere([...g2.P.alle(), p]);
      gleich(RO.zuruecksetzen(g.P, { art: "lernend" }).length, 2, "zwei Aufsichten zurückgesetzt");
      gleich(g.P.alle().map(p => `${p.name}:${p.rolle}:${!!p.pin}`).join(), "Mama:lernend:false,Papa:lernend:false,Kim:lernend:false", "Eulenpfad: Konten ohne PIN");
      RO.zuruecksetzen(g2.P, { art: "entfernen", verweise: ["aufsicht", "anfragen"] });
      const k2 = g2.P.alle();
      gleich([k2.length, k2[0].name, "aufsicht" in k2[0], "anfragen" in k2[0]].join(), "1,Kim,false,false", "Lernsteig: Aufsichten entfernt, Verbindungen gestrichen");
      gleich(RO.zuruecksetzen(g2.P, { art: "entfernen" }).length, 0, "ohne Aufsicht nichts");
    }

    gleich(A.D.dateiname("Mia Lena", new Date("2026-11-06T12:00:00Z")), "lernspiele-Mia-Lena-2026-11-06.json", "Dateiname");
    gleich(L.D.dateiname("", new Date("2026-11-06T12:00:00Z")), "lernsteig-2026-11-06.json", "Dateiname ohne Teil");
    wirft(() => D({ speicher: A.sp }), "daten ohne app");
    delete global.localStorage;
  }

  // ---------- Kopien in den Apps ----------
console.log("Kopien (tools/kern_verteilen.py --pruefe)");
faelle++;
try {
  process.stdout.write(execFileSync("python", [path.join(__dirname, "kern_verteilen.py"), "--pruefe"], { encoding: "utf8" }));
} catch (e) {
  process.stdout.write(e.stdout || ""); fehler++;
}

console.log(`\n${faelle} Fälle, ${fehler} Fehler.`);
process.exit(fehler || process.exitCode ? 1 : 0);
})().catch(e => { console.log(`    FEHLER  ${e.stack}`); process.exit(1); });
