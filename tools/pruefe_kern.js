// Prüft den gemeinsamen Kern (kern/, Plan docs/plan_angleich_reihe.md B2): jede Funktion gegen feste Beispiele und
// gegen unabhängige Nachrechnungen, dazu die Kopien in den Apps (tools/kern_verteilen.py --pruefe).
// Aufruf: node tools/pruefe_kern.js   — Ende mit Code 1 bei einem Fehler.
"use strict";
const path = require("path");
const { execFileSync } = require("child_process");

const WURZEL = path.join(__dirname, "..");
const KERN = require(path.join(WURZEL, "kern", "zahl.js"));
require(path.join(WURZEL, "kern", "bruch.js"));

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

// ---------- Kopien in den Apps ----------
console.log("Kopien (tools/kern_verteilen.py --pruefe)");
faelle++;
try {
  process.stdout.write(execFileSync("python", [path.join(__dirname, "kern_verteilen.py"), "--pruefe"], { encoding: "utf8" }));
} catch (e) {
  process.stdout.write(e.stdout || ""); fehler++;
}

console.log(`\n${faelle} Fälle, ${fehler} Fehler.`);
process.exit(fehler ? 1 : 0);
