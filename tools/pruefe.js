// Einstieg in die Prüfungen der Reihe (Plan docs/plan_angleich_reihe.md B2): ein Aufruf für alle Apps, je App ein Treiber.
//
// Aufruf: node tools/pruefe.js [kern] [lernsteig] [gratwanderung] [eulenpfad] [-- weitere Angaben]
//   ohne App   die kurzen Prüfungen: Kern, Lernsteig, Gratwanderung (je Sekunden bis wenige Minuten)
//   eulenpfad  nur, wenn genannt: ohne Spielnamen läuft er über alle Spiele (rund 25 min, der volle Lauf — ob er
//              läuft, entscheidet Patrik); mit Namen nur diese: node tools/pruefe.js eulenpfad zahlenhaus anlaut-angel
//   Was nach einer App steht und keine App ist, geht an deren Treiber (Spiel- oder Übungsnamen, --seed=…, --aufgaben=…).
// Ende mit Code 1, wenn ein Treiber einen Fehler meldet. Jeder Treiber prüft dazu die Kern-Kopie seiner App.
"use strict";
const path = require("path");
const fs = require("fs");
const { spawnSync } = require("child_process");

const WURZEL = path.join(__dirname, "..");
const node = (skript, args) => [process.execPath, [path.join(__dirname, skript), ...args]];

/** Je App: was geprüft wird und wie. */
const TREIBER = {
  kern: { was: "gemeinsamer Kern (kern/) und alle Kopien", befehl: args => node("pruefe_kern.js", args) },
  lernsteig: { was: "Übungen, Konten, Sichern und Einlesen", befehl: args => node("pruefe_uebungen.js", args) },
  gratwanderung: { was: "Grundgerüst: Kern-Kopie und Startseite", befehl: () => null, selbst: pruefeGratwanderung },
  eulenpfad: { was: "Spiele im Ersatz-DOM", befehl: args => node("pruefe_spiele.js", args) },
};
const KURZ = ["kern", "lernsteig", "gratwanderung"];

/** Gratwanderung hat noch kein Gerüst (Plan C8): die Kopie des Kerns stimmt, die Startseite ist da. Mit C8 ein eigener Treiber. */
function pruefeGratwanderung() {
  const fehler = [];
  const r = spawnSync("python", [path.join(__dirname, "kern_verteilen.py"), "--pruefe", "gratwanderung"], { encoding: "utf8" });
  if (r.status !== 0) fehler.push(`Kern-Kopie: ${(r.stdout || r.stderr || "").trim()}`);
  const seite = path.join(WURZEL, "gratwanderung", "index.html");
  if (!fs.existsSync(seite)) fehler.push("gratwanderung/index.html fehlt");
  for (const f of fehler) console.log(`    FEHLER  ${f}`);
  if (!fehler.length) console.log("Keine Fehler.");
  return fehler.length ? 1 : 0;
}

// Angaben zerlegen: App-Namen, dahinter die Angaben für diese App
const auftraege = [];
for (const a of process.argv.slice(2)) {
  if (a === "--") continue;
  if (TREIBER[a]) auftraege.push({ app: a, args: [] });
  else if (auftraege.length) auftraege[auftraege.length - 1].args.push(a);
  else { console.log(`Unbekannte App „${a}“. Bekannt: ${Object.keys(TREIBER).join(", ")}`); process.exit(2); }
}
if (!auftraege.length) for (const app of KURZ) auftraege.push({ app, args: [] });

const ergebnis = [];
for (const { app, args } of auftraege) {
  const t = TREIBER[app];
  console.log(`\n========== ${app}: ${t.was}${args.length ? ` (${args.join(" ")})` : ""} ==========`);
  const start = Date.now();
  let code;
  if (t.selbst) code = t.selbst(args);
  else {
    const [prog, argv] = t.befehl(args);
    code = spawnSync(prog, argv, { stdio: "inherit", cwd: WURZEL }).status;
  }
  ergebnis.push({ app, code, sekunden: Math.round((Date.now() - start) / 1000) });
}
console.log("\n========== Übersicht ==========");
for (const e of ergebnis) console.log(`${e.code === 0 ? "✓" : "✗"} ${e.app.padEnd(14)} ${e.sekunden} s${e.code === 0 ? "" : "  — Fehler"}`);
process.exit(ergebnis.some(e => e.code !== 0) ? 1 : 0);
