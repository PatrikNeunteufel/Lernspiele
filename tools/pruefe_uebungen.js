// Prüft die Übungen des Lernsteigs (Vertrag: docs/lernsteig/rahmen.md 7). Abgeschaut von tools/pruefe_spiele.js
// (Eulenpfad); seit LERN_Session17 (Plan B2) in tools/ wie alle Werkzeuge, Einstieg für alle Apps: tools/pruefe.js.
//
// Ohne Browser: je Übung, Niveau und Stufe viele Zufallsaufgaben gegen pruefeAufgabe, sichtbarer Text ohne NaN,
// undefined, null; Hinweise verraten die Lösung nicht; Endlos-Stufen haben mindestens ENDLOS_MIN verschiedene
// Aufgaben; Katalog und Seite passen zusammen; Kompetenz-Codes stehen in der Lehrplan-Recherche.
// Seiten im Ersatz-DOM (tools/lernsteig_seiten.js, Plan B2; ersetzt seit LERN_Session17 den Browser-Teil mit Playwright):
// Startseite in allen Rollen und Tabs, Konten über die Bedienung, jede Übung in jeder Stufe und jedem Niveau mit einer
// durchgespielten Runde (ein Fehlversuch, Protokoll, Statistik, Erfolge), Rechner, Serie mit Rekord, Rechner-Sperre der
// Aufsicht, Einladung über den Link. --seiten=0 lässt die Seiten aus.
//
// Aufruf: node tools/pruefe_uebungen.js [übung …] [--aufgaben=3000] [--seed=1] [--seiten=0]
// Ende mit Code 1, sobald ein Fehler gefunden wurde.
"use strict";
const fs = require("fs");
const path = require("path");

const WURZEL = path.join(__dirname, "..");
const APP = path.join(WURZEL, "lernsteig");
const LEHRPLAN_MA = path.join(WURZEL, "docs", "lernsteig", "lehrplan", "mathematik_zyklus3.md");
const ENDLOS_MIN = 100;
const VERDAECHTIG = /\bNaN\b|\bundefined\b|\bnull\b|\bInfinity\b|\[object /;

const opt = { aufgaben: 3000, seed: 1, seiten: 1 };
const nur = [];
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--(\w+)(?:=(\d+))?$/);
  if (m) opt[m[1]] = m[2] === undefined ? true : Number(m[2]); else nur.push(a);
}

// Zufall mit Seed (mulberry32)
function zufallMitSeed(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

let fehler = 0, hinweise = 0;
// Aufgabentypen je Übung und Lehrplan-Stufe (alle Niveaus), für die Abdeckung (Plan E 1, AT1 a, tools/abdeckung.js)
const TYPEN = new Map();
const fehlerMelden = (wo, text) => { fehler++; console.log(`  FEHLER ${wo}: ${text}`); };
const hinweisMelden = (wo, text) => { hinweise++; console.log(`  Hinweis ${wo}: ${text}`); };

// Kern zuerst (kern 1.0.0, docs/plan_angleich_reihe.md B): die Kopie der App muss mit kern/ übereinstimmen.
{
  const { execFileSync } = require("child_process");
  try { execFileSync("python", [path.join(WURZEL, "tools", "kern_verteilen.py"), "--pruefe", "lernsteig"], { encoding: "utf8" }); }
  catch (e) { fehlerMelden("Kern", (e.stdout || e.message).trim()); }
  // Konten, Aufsicht, Sichern und Einlesen ohne Browser (pruefe_konten.js)
  try { process.stdout.write(execFileSync(process.execPath, [path.join(__dirname, "pruefe_konten.js")], { encoding: "utf8" })); }
  catch (e) { process.stdout.write(e.stdout || ""); fehlerMelden("Konten", "pruefe_konten.js meldet Fehler"); }
}
require(path.join(APP, "kern", "kern.js"));
global.LST = require(path.join(APP, "gemeinsam", "werkzeug.js"));
global.LST_LEHRPLAENE = require(path.join(APP, "gemeinsam", "lehrplaene.js"));
const KAT = require(path.join(APP, "gemeinsam", "katalog.js"));
const SYMBOLE = require(path.join(APP, "gemeinsam", "symbole.js"));
const RECHNER = require(path.join(APP, "gemeinsam", "rechner.js"));
global.LST_TERME = require(path.join(APP, "gemeinsam", "terme.js"));
// Rechenkern des eingebauten Rechners (RE1 a): Beispiele aus dem Lehrplan (MA.1.A.3.i) und Grenzfälle.
function pruefeRechner() {
  const M = "\u2212", V = RECHNER.VORZ, W = "\u221A", N = "\u207F\u221A", Q = "x\u00B2", P = "\u00B7";
  const z = s => s.split("");
  const faelle = [
    [[...z("4"), "^", "3", P, "4", "^", "3"], "4'096"], [[...z("4"), "^", "3", "+", "4", "^", "3"], "128"],
    [["3", N, ...z("8000")], "20"], [[W, ...z("196")], "14"], [[V, "2", Q], M + "4"], [["(", V, "2", ")", Q], "4"],
    [[...z("4+8"), M, "2", P, "3"], "6"], [["1", ":", "3"], "0.3333333333"], [[...z("1.32"), P, "1", "0", "^", "8"], "132'000'000"],
    [["1", ":", "0"], null], [[W, V, "4"], null], [["2", N, ...z("16")], "4"], [["(", "2", "+", "3"], "5"], [["+"], null],
    // Beispiele aus den Anleitungen (R11 Abschnitt 2): eco RS „256 √x + 4 √x = 18“, „8 2nd ˣ√y 3 = 2“, „5 yˣ 3 = 125“;
    // TI-30X Plus „6 2nd ˣ√ 64 = 2“; Casio „−2² = −4“, „(−2)² = 4“
    [[...z("256"), RECHNER.WURZEL_NACH, "+", "4", RECHNER.WURZEL_NACH], "18"], [["8", RECHNER.NTE_RADIKAND, "3"], "2"],
    [["5", "^", "3"], "125"], [["6", N, "6", "4"], "2"], [[V, "2", Q], M + "2".replace("2", "4")], [["(", V, "2", ")", Q], "4"],
    [["3", RECHNER.VORZ_NACH], M + "3"],
  ];
  for (const [eingabe, soll] of faelle) {
    const r = RECHNER.rechne(eingabe);
    const ist = r.fehler ? null : RECHNER.anzeige(r.wert);
    if (ist !== soll) fehlerMelden("Rechner", `${RECHNER.zeile(eingabe)}: ${ist === null ? "Fehler " + r.fehler : ist} statt ${soll === null ? "Fehler" : soll}`);
  }
}
LST.quelle.zufall = zufallMitSeed(opt.seed);

// Serie über Tage (BF1 a): Wochen ab Montag, laufende Woche unterbricht nicht
function pruefeWochenSerie() {
  const heute = new Date(2026, 10, 5); // Donnerstag
  const tage = new Set(["2026-11-02", "2026-11-04", "2026-10-27", "2026-10-29", "2026-10-31", "2026-10-20", "2026-10-21", "2026-10-13"]);
  const faelle = [[2, { dieseWoche: 2, erreicht: true, wochenInFolge: 3 }], [3, { dieseWoche: 2, erreicht: false, wochenInFolge: 1 }],
    [1, { dieseWoche: 2, erreicht: true, wochenInFolge: 4 }], [4, { dieseWoche: 2, erreicht: false, wochenInFolge: 0 }]];
  for (const [ziel, soll] of faelle) {
    const ist = LST.wochenSerie(tage, ziel, heute);
    for (const f of Object.keys(soll)) if (ist[f] !== soll[f]) fehlerMelden("Wochenserie", `Ziel ${ziel}: ${f} = ${ist[f]} statt ${soll[f]}`);
  }
  if (LST.wochenSerie(new Set(), 1, heute).wochenInFolge !== 0) fehlerMelden("Wochenserie", "ohne Übungstage nicht 0");
}

// Kompetenzstufen aus der Recherche: "### MA.1.A.3 …" und darunter Tabellenzeilen "| g | …"
function lehrplanStufen() {
  const stufen = new Set();
  if (!fs.existsSync(LEHRPLAN_MA)) return stufen;
  let aktuell = null;
  for (const z of fs.readFileSync(LEHRPLAN_MA, "utf8").split(/\r?\n/)) {
    const k = z.match(/^### (MA\.\d\.[A-C]\.\d)\b/);
    if (k) { aktuell = k[1]; continue; }
    const s = aktuell && z.match(/^\| ([a-n]) \|/);
    if (s) stufen.add(`${aktuell}.${s[1]}`);
  }
  // Natur und Technik: "### NT.5.2 …" und darunter "| c | …" (auch Doppel-Aufbauten "| 1a | …")
  const NT = path.join(WURZEL, "docs", "lernsteig", "lehrplan", "nt_zyklus3.md");
  if (fs.existsSync(NT)) {
    let k = null;
    for (const z of fs.readFileSync(NT, "utf8").split(/\r?\n/)) {
      const kk = z.match(/^### (NT\.\d\.\d)\b/);
      if (kk) { k = kk[1]; continue; }
      if (/^## /.test(z)) k = null;
      const s = k && z.match(/^\| ([12]?[a-n]) \|/);
      if (s) stufen.add(`${k}.${s[1]}`);
    }
  }
  // Sprachen: Kompetenz als fette Zeile „| **D.5.D.1** …“, darunter Zeilen „| e | …“
  const SPRACHEN = path.join(WURZEL, "docs", "lernsteig", "lehrplan", "sprachen_zyklus3.md");
  if (fs.existsSync(SPRACHEN)) {
    let k = null;
    for (const z of fs.readFileSync(SPRACHEN, "utf8").split(/\r?\n/)) {
      const kk = z.match(/^\| \*\*([A-Z0-9]+\.\d\.[A-F]\.\d)\*\*/);
      if (kk) { k = kk[1]; continue; }
      if (/^#/.test(z)) k = null;
      const s = k && z.match(/^\| ([a-n]) \|/);
      if (s) stufen.add(`${k}.${s[1]}`);
      // Fremdsprachen: „| FS1E.5.D.1 | D Grammatik | b | c (GA, OP) · d | …“ — GA Z2 und Stufen Z3 in einer Zeile
      const fs1 = z.match(/^\| (FS\d[A-Z]+\.\d\.[A-F]\.\d) \| [^|]* \| ([a-n—]) [^|]*\| ([^|]*) \|/);
      if (fs1) {
        if (fs1[2] !== "—") stufen.add(`${fs1[1]}.${fs1[2]}`);
        for (const b of fs1[3].matchAll(/(?:^|· )([a-n])\b/g)) stufen.add(`${fs1[1]}.${b[1]}`);
      }
    }
  }
  return stufen;
}
const LP_STUFEN = lehrplanStufen();

// ---------- Vorrat je Stufe (Plan B2 Schritt 3, VF1 a) ----------
// Gemessen in Runden: Hinweis, wenn sich die Aufgaben einer Stufe ohne Endlos vor der sechsten Runde wiederholen.
const VORRAT_RUNDEN = 6;
const begruendet = []; // Stufen mit begründet kleinem Vorrat (Katalog vorrat), am Ende aufgeführt

// ---------- Text gegen Prüfdaten (Plan B2 Schritt 3, TD1 a) ----------
// Übungen, deren Prüfung nur auf a.daten rechnete: Sie lesen den angezeigten Text (liesText) und prüfen ihn in
// pruefeAufgabe gegen die Daten. Fertige stehen in TEXT_GELESEN (dann ist liesText Pflicht), die übrigen in TEXT_OFFEN.
const TEXT_GELESEN = ["flaechen-volumen", "koerper-winkel", "prozent-funktionen", "daten-rabatt", "folgen", "sachsituationen", "zehnerpotenzen", "binome-gleichungen", "kombinatorik", "zufall"];
const TEXT_OFFEN = [];

// ---------- Annahme von Antworten (Plan B2 Schritt 3) ----------
// Je Aufgabe über LST.antwortPruefen (dieselbe Prüfung wie in der Seite): gleichwertige Schreibweisen der Lösung werden
// angenommen, knapp falsche abgewiesen, und keine Eingabe bringt die Prüfung zum Absturz.
const ANNAHME_JE_STUFE = 300;
const klarZahl = x => Number(x.toPrecision(15)).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 });
const KAPUTT = ["", "   ", "abc", "1..2", "--3", "+-1", "1e5", "∞", "NaN", "Infinity", "1/0", "0/0", "(", ")(", "x+", "+", "·", "^2",
  "((((((((((x))))))))))", "2^2^2^2^2^2", "x^999", "x/0", "9".repeat(400), "a".repeat(300), "1'''", "12'34", "1 2 3", "١٢", "=5", "x = 3"];
/** Summanden auf oberster Ebene umdrehen („3a + 4b − 5“ → „−5 + 4b + 3a“); null, wenn es nichts umzudrehen gibt. */
function umgedreht(t) {
  if (/[()]/.test(t)) return null;
  const teile = t.trim().split(/\s+(?=[+−-]\s)/);
  if (teile.length < 2) return null;
  const mitVz = teile.map((s, i) => (i === 0 ? (/^[−-]/.test(s) ? s : "+ " + s) : s)).map(s => s.replace(/^([+−-])\s*/, "$1 "));
  const r = mitVz.reverse().join(" ");
  return r.replace(/^\+ /, "").replace(/^([−-]) /, "−");
}
/** Fundstellen einer Aufgabe: Text je Mangel (leer = alles gut). */
function annahmeMaengel(a) {
  const m = [];
  const pruefe = e => { try { return LST.antwortPruefen(a, e); } catch (err) { m.push(`„${String(e).slice(0, 30)}“ wirft: ${err.message}`); return null; } };
  for (const e of KAPUTT) {
    const r = pruefe(e);
    if (r && r.art === "richtig") m.push(`„${e.slice(0, 30)}“ als richtig angenommen`);
  }
  const soll = (e, arten, was) => { const r = pruefe(e); if (r && !arten.includes(r.art)) m.push(`${was} „${e}“: ${r.art}${r.meldung ? " (" + r.meldung + ")" : ""}`); };
  if (a.art === "term") {
    const t = a.antwortTerm;
    soll(t, ["richtig"], "Lösung");
    soll(` ${t.replace(/\s+/g, "")} `, ["richtig"], "ohne Leerzeichen");
    soll(t.replace(/·/g, "*").replace(/−/g, "-"), ["richtig"], "mit * und -");
    const u = umgedreht(t);
    if (u && ["frei", "vereinfacht", undefined].includes(a.form)) soll(u, ["richtig"], "Summanden vertauscht");
    soll(`${t} + 1`, ["falsch"], "knapp falsch");
    const z = t.match(/\d(?!.*\d)/);
    if (z) soll(t.slice(0, z.index) + ((Number(z[0]) + 1) % 10) + t.slice(z.index + 1), ["falsch", "unlesbar"], "letzte Ziffer verändert");
    return m;
  }
  if (typeof a.antwort !== "number") return m;
  const v = a.antwort, tol = a.toleranz || 0;
  const k = klarZahl(v);
  soll(k, ["richtig"], "Lösung");
  // ZL1 a: falsch gegliedert ist unlesbar (kein Fehlversuch), mit Hinweis auf die Dreiergruppen
  const gl = pruefe("12'34");
  if (gl && (gl.art !== "unlesbar" || !/Dreiergruppen/.test(gl.meldung || ""))) m.push(`„12'34“: ${gl.art} (${gl.meldung || ""})`);
  soll(k.replace(".", ","), ["richtig"], "mit Komma");
  soll(LST.dezimalText(v), ["richtig"], "wie angezeigt");
  soll(` ${k.replace("-", "−")} `, ["richtig"], "mit Leerzeichen und −");
  if (v > 0) soll(`+${k}`, ["richtig"], "mit +");
  if (k.includes(".")) soll(`${k}0`, ["richtig"], "mit Null am Ende");
  // knapp falsch: letzte Stelle ±1, letzte Ziffer weggelassen — wo das mehr als die Toleranz ausmacht
  const stellen = (k.split(".")[1] || "").length;
  const schritt = 10 ** -stellen;
  for (const d of [schritt, -schritt]) if (Math.abs(d) > tol + 1e-9) soll(klarZahl(v + d), ["falsch"], "letzte Stelle ±1");
  const kurz = k.replace(/\.?\d$/, "");
  if (kurz && kurz !== "-" && Math.abs(Number(kurz) - v) > tol + 1e-9) soll(kurz, ["falsch"], "letzte Ziffer weggelassen");
  if (!tol && Math.abs(v) * 1e-6 > 1e-8) soll(klarZahl(v * (1 + 1e-6)), ["falsch"], "um ein Millionstel daneben");
  if (tol) soll(klarZahl(v + tol * 0.9), ["richtig"], "innerhalb der Toleranz");
  return m;
}

// Prüfansicht der Inhaltslisten (LK1 a, LERN_Session24; kern/listenpruefung.js): Jede eigene Liste hat in
// uebungen/<id>/pruefung.js eine Prüfdefinition, die lädt; jeder Eintrag einen Schlüssel im Format des Entwickler-Servers
// und keinen doppelten; eine geprüfte Liste ist seit der Prüfung unverändert (Fingerabdruck im Prüfstand, wie
// tools/pruefe_spiele.js im Eulenpfad). Ein Fehler hier hält die Übung nicht an (die Listen sind Daten, keine Aufgaben).
const PRUEFSTAND = require(path.join(APP, "gemeinsam", "pruefstand.js"));
function pruefeListenPruefung(eintrag, ordner, U) {
  const wo = `${eintrag.id} Prüfansicht`;
  const eigene = Object.entries(eintrag.listen || {}).filter(([, l]) => !l.von).map(([id]) => id);
  const pfad = path.join(ordner, "pruefung.js");
  if (!eigene.length) { if (fs.existsSync(pfad)) fehlerMelden(wo, "pruefung.js ohne eigene Liste im Katalog"); return; }
  if (!fs.existsSync(pfad)) return fehlerMelden(wo, "pruefung.js fehlt");
  const defs = {}, alt = LST.listenPruefung;
  LST.listenPruefung = (id, d) => { if (id !== eintrag.id) fehlerMelden(wo, `meldet die Übung ${id}`); Object.assign(defs, d); };
  for (const [k, v] of Object.entries(U)) global[k] = v; // in der Seite sind UEBUNG und die Funktionen aus aufgaben.js global
  try { delete require.cache[require.resolve(pfad)]; require(pfad); } catch (e) { fehlerMelden(wo, `lädt nicht: ${e.message}`); }
  LST.listenPruefung = alt;
  for (const l of eigene) {
    if (!defs[l]) { fehlerMelden(wo, `keine Prüfdefinition für die Liste ${l}`); continue; }
    let e;
    try { e = KERN.listenpruefung.eintraegeVon(defs[l]); } catch (err) { fehlerMelden(`${wo} ${l}`, `Einträge nicht lesbar: ${err.message}`); continue; }
    if (!e.length) fehlerMelden(`${wo} ${l}`, "keine Einträge");
    const falsch = e.filter(x => !/^[a-z0-9-]+:[a-z0-9]+$/.test(x.schluessel));
    if (falsch.length) fehlerMelden(`${wo} ${l}`, `Schlüssel nicht im Format des Entwickler-Servers: ${falsch[0].schluessel}`);
    const doppelt = e.filter((x, i) => e.findIndex(y => y.schluessel === x.schluessel) !== i);
    if (doppelt.length) fehlerMelden(`${wo} ${l}`, `doppelte Einträge (gleicher Haken): ${doppelt.map(x => x.zellen.join(" | ")).slice(0, 3).join("; ")}`);
    const stand = (PRUEFSTAND.listen || {})[`${eintrag.id}/${l}`];
    if (stand && stand.hash && stand.hash !== KERN.listenpruefung.listenHash(e)) fehlerMelden(`${wo} ${l}`, "Liste nach der Prüfung geändert — in der Prüfansicht die neuen Einträge abhaken");
    else if (stand && !stand.hash) hinweisMelden(`${wo} ${l}`, "geprüft vor der Prüfung je Eintrag (ohne Fingerabdruck) — einmal in der Prüfansicht bestätigen");
  }
}

// Gibt true zurück, wenn die Aufgaben der Übung erzeugt wurden. Mängel im Aufbau zählen je Übung: sie halten nur diese
// Übung an, nicht die folgenden (vorher zählte `if (fehler) return` über alle Übungen und den Kern; LERN_Session23 machte
// so aus 2 echten Fehlern 81 gemeldete).
function pruefeOhneBrowser(eintrag) {
  const vorher = fehler;
  const ordner = path.join(APP, "uebungen", eintrag.id);
  const wo = eintrag.id;
  if (!fs.existsSync(path.join(ordner, "index.html"))) return fehlerMelden(wo, "index.html fehlt");
  const html = fs.readFileSync(path.join(ordner, "index.html"), "utf8");
  if (/eulenpfad\//.test(html)) fehlerMelden(wo, "Seite lädt etwas aus eulenpfad/");
  for (const s of ["kern/kern.js", "werkzeug.js", "lehrplaene.js", "katalog.js", "terme.js", "rechner.js", "pruefstand.js", "rahmen.js", "aufgaben.js"]) {
    if (!html.includes(s)) fehlerMelden(wo, `Seite lädt ${s} nicht`);
  }
  for (const k of eintrag.stufen.map(s => `${eintrag.kompetenz}.${s}`).concat(eintrag.weitere || [])) {
    if (!LP_STUFEN.has(k)) fehlerMelden(wo, `Kompetenzstufe ${k} steht nicht in der Lehrplan-Recherche`);
  }
  if (!LST_LEHRPLAENE.MARKEN[eintrag.kompetenz]) fehlerMelden(wo, `keine Marken für ${eintrag.kompetenz} in lehrplaene.js`);
  // Piktogramm der Kachel im Tab Übungen (SY1 a): Pflicht und in gemeinsam/symbole.js gezeichnet
  if (!SYMBOLE.gibt(eintrag.symbol)) fehlerMelden(wo, eintrag.symbol ? `Piktogramm „${eintrag.symbol}“ fehlt in symbole.js` : "kein Piktogramm (Feld symbol)");
  for (const s of eintrag.stufen.concat("challenge")) {
    if (eintrag.rechner && !["ohne", "mit", "frei"].includes(eintrag.rechner[s])) fehlerMelden(wo, `rechner für Stufe ${s} fehlt oder falsch`);
  }
  // Inhaltslisten im Übungsordner (etwa aussagen.js → global AUSSAGEN): vor aufgaben.js laden, Seite muss sie laden
  // pruefung.js ist die Prüfansicht der Listen (LK1 a), keine Inhaltsliste; die Seite lädt sie erst beim Prüfen
  for (const datei of fs.readdirSync(ordner).filter(d => d.endsWith(".js") && d !== "aufgaben.js" && d !== "pruefung.js")) {
    global[path.basename(datei, ".js").toUpperCase().replace(/-/g, "_")] = require(path.join(ordner, datei));
    if (!html.includes(`src="${datei}"`)) fehlerMelden(wo, `Seite lädt die Inhaltsliste ${datei} nicht`);
  }
  const U = require(path.join(ordner, "aufgaben.js"));
  pruefeListenPruefung(eintrag, ordner, U);
  if (!U.UEBUNG || U.UEBUNG.id !== eintrag.id) fehlerMelden(wo, "UEBUNG.id passt nicht zum Katalog");
  for (const f of ["aufgabeErzeugen", "pruefeAufgabe", "hinweis"]) if (typeof U[f] !== "function") fehlerMelden(wo, `${f} fehlt`);
  if (TEXT_GELESEN.includes(eintrag.id) && typeof U.liesText !== "function") fehlerMelden(wo, "liesText fehlt (Text gegen Prüfdaten, TD1 a)");
  for (const [s, grund] of Object.entries(eintrag.vorrat || {})) {
    if (!eintrag.stufen.concat("challenge").includes(s)) fehlerMelden(wo, `vorrat für unbekannte Stufe ${s}`);
    if (typeof grund !== "string" || !grund.trim()) fehlerMelden(wo, `vorrat.${s} ohne Begründung`);
  }
  if (fehler > vorher) return false;

  const uebersicht = [];
  const vorrat = {};
  // Die Aufgaben einer Stufe hängen nicht am Niveau (ST1 a); geprüft wird je Lehrplan-Stufe und Challenge mit jedem Niveau.
  for (const niveau of eintrag.niveaus) {
    for (const stufe of eintrag.stufen.concat("challenge")) {
      const ort = `${wo} ${niveau}/${stufe}`;
      if (!U.UEBUNG.stufen[stufe]) { fehlerMelden(ort, "Stufenbeschreibung fehlt"); continue; }
      const kennungen = new Set();
      let maengel = 0, annahme = 0;
      for (let i = 0; i < opt.aufgaben; i++) {
        let a;
        try { a = U.aufgabeErzeugen(stufe, niveau); } catch (e) { fehlerMelden(ort, `aufgabeErzeugen: ${e.message}`); break; }
        kennungen.add(a.kennung);
        if (stufe !== "challenge") {
          if (!TYPEN.has(eintrag.id)) TYPEN.set(eintrag.id, new Map());
          const je = TYPEN.get(eintrag.id);
          if (!je.has(stufe)) je.set(stufe, new Set());
          je.get(stufe).add(a.typ || "(ohne typ)");
        }
        if (a.stufe !== stufe) { fehlerMelden(ort, `Aufgabe trägt Stufe ${a.stufe}`); break; }
        for (const feld of ["text", "loesung", "kennung"]) if (typeof a[feld] !== "string" || !a[feld]) { fehlerMelden(ort, `Feld ${feld} fehlt`); break; }
        // Rechner je Aufgabe (E1-4 a): nur "mit" oder "frei", nur in einer Übung mit Rechner-Angabe im Katalog
        if (a.rechner !== undefined && (!["mit", "frei"].includes(a.rechner) || !eintrag.rechner)) { fehlerMelden(ort, `rechner „${a.rechner}“ an der Aufgabe (erlaubt: mit, frei; Übung braucht rechner im Katalog)`); break; }
        const sichtbar = [a.text, a.loesung, a.weg].join(" ");
        if (VERDAECHTIG.test(sichtbar)) { fehlerMelden(ort, `verdächtiger Text: ${sichtbar}`); break; }
        // Zahlschreibung (Z1 a): ab vier Stellen mit Apostroph, auch im Lösungsweg (Jahreszahlen und Codes ausgenommen)
        if (eintrag.fach === "mathematik" && /(^|[^\d'.,])\d{4,}/.test(sichtbar.replace(/[.,]\d+/g, ""))) { fehlerMelden(ort, `Tausender ohne Apostroph: ${sichtbar}`); break; }
        const m = U.pruefeAufgabe(a, stufe, niveau);
        if (m.length && maengel++ < 3) fehlerMelden(ort, m.join("; "));
        if (i < ANNAHME_JE_STUFE && a.art !== "auswahl") {
          const am = annahmeMaengel(a);
          if (am.length && annahme++ < 3) fehlerMelden(ort, `Annahme (${a.text}): ${am.join("; ")}`);
        }
        // TF1 a: jedes Zeichen der Lösung hat eine Taste (die Tastatur des Geräts bleibt zu; Meldung Patrik LERN_Session20)
        if (a.art === "term") {
          const tasten = LST.antwortTasten(a).map(t => (typeof t === "string" ? t : t.text));
          // ohne Tausender-Apostroph („1'080“ gilt auch als „1080“)
          const ohne = [...new Set([...a.antwortTerm.replace(/[\s']/g, "")].map(c => (c === "-" ? "−" : c === "*" ? "·" : c)))].filter(c => !tasten.includes(c));
          if (ohne.length && maengel++ < 3) fehlerMelden(ort, `Lösung „${a.antwortTerm}“ nicht tippbar: keine Taste ${ohne.join(" ")} (${a.text})`);
        }
        // Hinweise zu typischen falschen Eingaben dürfen die Lösung nicht nennen
        for (const falsch of (a.art === "term" ? ["x", "a + 1", a.antwortTerm + " + 1", null] : [a.antwort + 1, a.antwort - 1, -a.antwort, 0, null])) {
          if (falsch === a.antwort) continue;
          const h = U.hinweis(a, falsch);
          // Lösung als eigener Ausdruck, nicht als Teil einer Zahl oder eines Worts („a“ in „Klammer“ zählt nicht)
          const loes = new RegExp(`(^|[^\\d'A-Za-zÄÖÜäöü])${a.loesung.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^\\d'A-Za-zÄÖÜäöü])`);
          if (typeof h !== "string" || !h) { fehlerMelden(ort, "Hinweis leer"); break; }
          if (loes.test(h)) { fehlerMelden(ort, `Hinweis verrät die Lösung: ${h}`); break; }
        }
      }
      if (maengel > 3) fehlerMelden(ort, `… insgesamt ${maengel} Aufgaben mit Mängeln`);
      if (annahme > 3) fehlerMelden(ort, `… insgesamt ${annahme} von ${Math.min(opt.aufgaben, ANNAHME_JE_STUFE)} Aufgaben mit Mängeln bei der Annahme`);
      const endlos = eintrag.endlos === true || (eintrag.endlos || []).includes(stufe);
      if (endlos && kennungen.size < ENDLOS_MIN) fehlerMelden(ort, `Endlos-Stufe mit nur ${kennungen.size} verschiedenen Aufgaben`);
      if (!endlos && kennungen.size >= ENDLOS_MIN) hinweisMelden(ort, `${kennungen.size} verschiedene Aufgaben, Endlos wäre möglich`);
      // Vorrat in Runden (VF1 a): weniger verschiedene Aufgaben als eine Runde lang ist → Wiederholung in der Runde
      // (Fehler); Wiederholung vor der VORRAT_RUNDEN-ten Runde → Hinweis, ausser der Katalog begründet den Vorrat
      // (vorrat: { <stufe>: "<Grund>" }). Die Aufgaben hängen nicht am Niveau: gemeldet einmal je Stufe.
      if (!endlos && niveau === eintrag.niveaus[0]) {
        const runden = kennungen.size / eintrag.anzahl, grund = (eintrag.vorrat || {})[stufe];
        if (kennungen.size < eintrag.anzahl) fehlerMelden(`${wo}/${stufe}`, `nur ${kennungen.size} verschiedene Aufgaben bei ${eintrag.anzahl} je Runde: Wiederholung in derselben Runde`);
        else if (runden < VORRAT_RUNDEN) {
          if (grund) begruendet.push(`${wo}/${stufe}: ${kennungen.size} Aufgaben (${runden.toFixed(1)} Runden) — ${grund}`);
          else hinweisMelden(`${wo}/${stufe}`, `${kennungen.size} verschiedene Aufgaben: Wiederholung nach ${runden.toFixed(1)} Runden (unter ${VORRAT_RUNDEN}; Vorrat vergrössern oder im Katalog begründen, VF1 a)`);
        } else if (grund) hinweisMelden(`${wo}/${stufe}`, `Begründung für kleinen Vorrat, aber ${runden.toFixed(1)} Runden: Eintrag vorrat.${stufe} kann weg`);
      }
      vorrat[stufe] = kennungen.size;
      if (niveau === eintrag.niveaus[0]) uebersicht.push(`${stufe}:${kennungen.size}`);
    }
  }
  console.log(`  verschiedene Aufgaben: ${uebersicht.join(" ")}`);
  return true;
}



(async () => {
  const uebungen = KAT.UEBUNGEN.filter(u => !nur.length || nur.includes(u.id));
  if (!uebungen.length) { console.log("Keine Übung gefunden."); process.exit(1); }
  console.log(`Lehrplan-Stufen aus der Recherche: ${LP_STUFEN.size}`);
  pruefeRechner();
  pruefeWochenSerie();
  // Marken in lehrplaene.js gegen die Tabellen der Recherche
  for (const [k, m] of Object.entries(LST_LEHRPLAENE.MARKEN)) {
    for (const s of m.stufen.concat([m.gaZ2, m.op, m.ga].filter(Boolean), m.e)) {
      if (LP_STUFEN.size && !LP_STUFEN.has(`${k}.${s}`)) fehlerMelden("lehrplaene.js", `Stufe ${k}.${s} nicht in der Recherche`);
    }
  }
  // Stufen nur aus Erweiterung (E5-1 a) gegen den Wortlaut der gesicherten Seiten: genau die Stufen, deren Punkte alle
  // mit „Erweiterung:“ beginnen. Ohne gesicherte Seite nicht prüfbar — Fehler, wenn eine Übung die Kompetenz benutzt.
  {
    const WL = require("./lehrplan_wortlaut.js");
    for (const [k, m] of Object.entries(LST_LEHRPLAENE.MARKEN)) {
      const seite = WL.alle()[k];
      if (!seite) {
        if (KAT.UEBUNGEN.some(u => u.kompetenz === k)) fehlerMelden("lehrplaene.js", `${k}: keine gesicherte Lehrplan-Seite, Stufen nur aus Erweiterung nicht prüfbar`);
        continue;
      }
      for (const s of m.stufen) {
        const st = seite.stufen[s];
        if (!st) continue;
        const nur = st.punkte.length > 0 && st.punkte.every(p => p.startsWith("Erweiterung:"));
        if (nur && !m.nurE.includes(s)) fehlerMelden("lehrplaene.js", `${k}.${s} besteht nur aus Erweiterung, fehlt aber bei den Stufen nur aus E`);
        if (!nur && m.nurE.includes(s)) fehlerMelden("lehrplaene.js", `${k}.${s} steht bei den Stufen nur aus E, hat aber Punkte ohne Erweiterung`);
      }
      for (const s of m.nurE) if (!m.e.includes(s)) fehlerMelden("lehrplaene.js", `${k}.${s}: nur aus Erweiterung, fehlt aber bei den Stufen mit E`);
    }
  }
  // Übungen ohne erzeugte Aufgaben: ihre Abdeckung meldete nur Folgefehler (jeder Teil „nicht erzeugt“), sie fällt aus
  const ohneAufgaben = new Set();
  for (const e of uebungen) {
    console.log(`${e.id}`);
    let erzeugt = false;
    try { erzeugt = pruefeOhneBrowser(e); } catch (err) { fehlerMelden(e.id, `Prüfung abgebrochen: ${err.message}`); }
    if (!erzeugt) { ohneAufgaben.add(e.id); console.log("  keine Aufgaben erzeugt (Fehler oben): Abdeckung dieser Übung ausgelassen"); }
  }
  // Abdeckung der Lehrplan-Stufen (Plan E 1, AT1 a): Daten gegen die erzeugten Typen; Übersicht aktuell?
  {
    const AB = require("./abdeckung.js");
    const daten = AB.lies();
    for (const id of Object.keys(daten.uebungen)) if (!KAT.UEBUNGEN.some(u => u.id === id)) fehlerMelden("abdeckung.json", `Übung „${id}“ gibt es nicht`);
    for (const e of uebungen.filter(u => !ohneAufgaben.has(u.id))) for (const m of AB.pruefeUebung(daten, e, TYPEN.get(e.id) || new Map(), KAT)) (m.art === "fehler" ? fehlerMelden : hinweisMelden)(m.wo, m.text);
    const erfasst = KAT.UEBUNGEN.filter(u => daten.uebungen[u.id]).length;
    console.log(`Abdeckung der Lehrplan-Stufen erfasst: ${erfasst} von ${KAT.UEBUNGEN.length} Übungen (docs/lernsteig/abdeckung.md)`);
    if (!nur.length) { const grund = AB.veraltet(); if (grund) fehlerMelden("Abdeckung", grund); }
  }
  if (opt.seiten) {
    const t0 = Date.now();
    const { gespielt } = await require(path.join(__dirname, "lernsteig_seiten.js")).pruefeSeiten(uebungen, fehlerMelden, LST, KAT.UEBUNGEN);
    console.log(`Seiten im Ersatz-DOM: ${gespielt} Runden durchgespielt (${Math.round((Date.now() - t0) / 1000)} s)`);
  }
  if (TEXT_OFFEN.length) console.log(`Text gegen Prüfdaten (TD1 a) noch offen: ${TEXT_OFFEN.join(", ")}`);
  if (begruendet.length) console.log(`Begründet kleiner Vorrat (Katalog vorrat, VF1 a):\n  ${begruendet.join("\n  ")}`);
  console.log(`\n${fehler} Fehler, ${hinweise} Hinweise.`);
  require("./testausgabe.js").merke("pruefe_uebungen", `${fehler} Fehler, ${hinweise} Hinweise.`); // HK1 a
  process.exit(fehler ? 1 : 0);
})();
