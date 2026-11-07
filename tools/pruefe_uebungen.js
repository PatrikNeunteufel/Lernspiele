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

// ---------- Text gegen Prüfdaten (Plan B2 Schritt 3, TD1 a) ----------
// Übungen, deren Prüfung nur auf a.daten rechnete: Sie lesen den angezeigten Text (liesText) und prüfen ihn in
// pruefeAufgabe gegen die Daten. Fertige stehen in TEXT_GELESEN (dann ist liesText Pflicht), die übrigen in TEXT_OFFEN.
const TEXT_GELESEN = ["flaechen-volumen"];
const TEXT_OFFEN = ["koerper-winkel", "prozent-funktionen", "daten-rabatt", "folgen", "sachsituationen", "zehnerpotenzen",
  "binome-gleichungen", "kombinatorik", "zufall"];

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

function pruefeOhneBrowser(eintrag) {
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
  for (const s of eintrag.stufen.concat("challenge")) {
    if (eintrag.rechner && !["ohne", "mit", "frei"].includes(eintrag.rechner[s])) fehlerMelden(wo, `rechner für Stufe ${s} fehlt oder falsch`);
  }
  // Inhaltslisten im Übungsordner (etwa aussagen.js → global AUSSAGEN): vor aufgaben.js laden, Seite muss sie laden
  for (const datei of fs.readdirSync(ordner).filter(d => d.endsWith(".js") && d !== "aufgaben.js")) {
    global[path.basename(datei, ".js").toUpperCase().replace(/-/g, "_")] = require(path.join(ordner, datei));
    if (!html.includes(`src="${datei}"`)) fehlerMelden(wo, `Seite lädt die Inhaltsliste ${datei} nicht`);
  }
  const U = require(path.join(ordner, "aufgaben.js"));
  if (!U.UEBUNG || U.UEBUNG.id !== eintrag.id) fehlerMelden(wo, "UEBUNG.id passt nicht zum Katalog");
  for (const f of ["aufgabeErzeugen", "pruefeAufgabe", "hinweis"]) if (typeof U[f] !== "function") fehlerMelden(wo, `${f} fehlt`);
  if (TEXT_GELESEN.includes(eintrag.id) && typeof U.liesText !== "function") fehlerMelden(wo, "liesText fehlt (Text gegen Prüfdaten, TD1 a)");
  if (fehler) return;

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
        if (a.stufe !== stufe) { fehlerMelden(ort, `Aufgabe trägt Stufe ${a.stufe}`); break; }
        for (const feld of ["text", "loesung", "kennung"]) if (typeof a[feld] !== "string" || !a[feld]) { fehlerMelden(ort, `Feld ${feld} fehlt`); break; }
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
      vorrat[stufe] = kennungen.size;
      if (niveau === eintrag.niveaus[0]) uebersicht.push(`${stufe}:${kennungen.size}`);
    }
  }
  console.log(`  verschiedene Aufgaben: ${uebersicht.join(" ")}`);
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
  for (const e of uebungen) { console.log(`${e.id}`); pruefeOhneBrowser(e); }
  if (opt.seiten) {
    const t0 = Date.now();
    const { gespielt } = await require(path.join(__dirname, "lernsteig_seiten.js")).pruefeSeiten(uebungen, fehlerMelden, LST);
    console.log(`Seiten im Ersatz-DOM: ${gespielt} Runden durchgespielt (${Math.round((Date.now() - t0) / 1000)} s)`);
  }
  if (TEXT_OFFEN.length) console.log(`Text gegen Prüfdaten (TD1 a) noch offen: ${TEXT_OFFEN.join(", ")}`);
  console.log(`\n${fehler} Fehler, ${hinweise} Hinweise.`);
  process.exit(fehler ? 1 : 0);
})();
