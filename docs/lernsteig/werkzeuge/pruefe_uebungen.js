// Prüft die Übungen des Lernsteigs (Vertrag: docs/lernsteig/rahmen.md 7). Abgeschaut von tools/pruefe_spiele.js
// (Eulenpfad), eigene Kopie: kein Laden aus eulenpfad/ oder tools/.
//
// Ohne Browser: je Übung, Niveau und Stufe viele Zufallsaufgaben gegen pruefeAufgabe, sichtbarer Text ohne NaN,
// undefined, null; Hinweise verraten die Lösung nicht; Endlos-Stufen haben mindestens ENDLOS_MIN verschiedene
// Aufgaben; Katalog und Seite passen zusammen; Kompetenz-Codes stehen in der Lehrplan-Recherche.
// Mit --browser (Playwright, Chromium): Startseite und jede Stufe laden ohne Konsolenfehler, eine Runde lässt sich
// durchspielen (mit einem Fehlversuch), das Protokoll stimmt, eine Serie speichert ihren Rekord vor „Zum Ergebnis“.
//
// Aufruf: node docs/lernsteig/werkzeuge/pruefe_uebungen.js [übung …] [--aufgaben=3000] [--seed=1] [--browser]
// Ende mit Code 1, sobald ein Fehler gefunden wurde.
"use strict";
const fs = require("fs");
const path = require("path");

const WURZEL = path.join(__dirname, "..", "..", "..");
const APP = path.join(WURZEL, "lernsteig");
const LEHRPLAN_MA = path.join(WURZEL, "docs", "lernsteig", "lehrplan", "mathematik_zyklus3.md");
const ENDLOS_MIN = 100;
const VERDAECHTIG = /\bNaN\b|\bundefined\b|\bnull\b|\bInfinity\b|\[object /;

const opt = { aufgaben: 3000, seed: 1, browser: false };
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
// Eingaben fürs Durchspielen: Zahl oder Term (art: "term")
const klar = x => Number(x.toPrecision(15)).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 });
const richtigeEingabe = a => (a.art === "term" ? a.antwortTerm : klar(a.antwort));
const falscheEingabe = a => (a.art === "term" ? a.antwortTerm + " + 1" : klar(a.antwort + 1));
// Eine Antwort geben: tippen und prüfen oder (art: "auswahl") die richtige bzw. eine falsche Wahl antippen
async function antworte(s, a, richtig) {
  if (a.art === "auswahl") { const i = richtig ? a.richtig : (a.richtig + 1) % a.optionen.length; return s.click(`.knopf.wahl[data-taste="${i + 1}"]`); }
  await s.fill(".eingabe", richtig ? richtigeEingabe(a) : falscheEingabe(a));
  return s.click(".knopf.haupt:not(.rechner-knopf)");
}

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
  if (fehler) return;

  const uebersicht = [];
  const vorrat = {};
  // Die Aufgaben einer Stufe hängen nicht am Niveau (ST1 a); geprüft wird je Lehrplan-Stufe und Challenge mit jedem Niveau.
  for (const niveau of eintrag.niveaus) {
    for (const stufe of eintrag.stufen.concat("challenge")) {
      const ort = `${wo} ${niveau}/${stufe}`;
      if (!U.UEBUNG.stufen[stufe]) { fehlerMelden(ort, "Stufenbeschreibung fehlt"); continue; }
      const kennungen = new Set();
      let maengel = 0;
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
      const endlos = eintrag.endlos === true || (eintrag.endlos || []).includes(stufe);
      if (endlos && kennungen.size < ENDLOS_MIN) fehlerMelden(ort, `Endlos-Stufe mit nur ${kennungen.size} verschiedenen Aufgaben`);
      if (!endlos && kennungen.size >= ENDLOS_MIN) hinweisMelden(ort, `${kennungen.size} verschiedene Aufgaben, Endlos wäre möglich`);
      vorrat[stufe] = kennungen.size;
      if (niveau === eintrag.niveaus[0]) uebersicht.push(`${stufe}:${kennungen.size}`);
    }
  }
  console.log(`  verschiedene Aufgaben: ${uebersicht.join(" ")}`);
}

async function pruefeImBrowser(uebungen) {
  let chromium;
  try { ({ chromium } = require("playwright")); } catch (e) { fehlerMelden("Browser", "Playwright nicht gefunden"); return; }
  const browser = await chromium.launch();
  const url = p => "file://" + path.join(APP, p);
  async function seite(adresse, tun) {
    const kontext = await browser.newContext({ viewport: { width: 375, height: 800 } });
    const s = await kontext.newPage();
    const meldungen = [];
    s.on("pageerror", e => meldungen.push(e.message));
    s.on("console", m => { if (m.type() === "error") meldungen.push(m.text()); });
    await s.goto(adresse);
    try { await tun(s); } catch (e) { meldungen.push(e.message.split("\n")[0]); }
    await kontext.close();
    return meldungen;
  }
  const start = await seite(url("index.html"), async s => { await s.waitForSelector("main"); });
  // Konten (AU1 a, GE1 b, EL1 a): anlegen mit PIN, Code einmal, Runde im Konto, PIN in neuem Tab, PIN vergessen, Einladung
  {
    const kontext = await browser.newContext({ viewport: { width: 375, height: 900 } });
    const meldungen = [];
    const neu = async () => { const s = await kontext.newPage(); s.on("pageerror", e => meldungen.push(e.message)); s.on("console", m => { if (m.type() === "error") meldungen.push(m.text()); }); return s; };
    try {
      const s = await neu();
      await s.goto(url("index.html"));
      await s.click("text=Neues Konto"); await s.fill("input[name=vorname]", "Test"); await s.fill("input[name=geboren]", "2012-03-15"); await s.fill("input[name=pin]", "4711");
      await s.click("[data-aktion=anlegen]");
      const code = await s.getAttribute(".code-anzeige", "data-code");
      if (!/^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(code || "")) throw new Error(`Wiederherstellungscode fehlt: ${code}`);
      const k = await s.evaluate(() => JSON.parse(localStorage.getItem("lernsteig:personen")).find(p => p.rolle === "lernend"));
      if (!k.pin || k.pin.hash.length !== 64 || JSON.stringify(k).includes("4711") || JSON.stringify(k).includes(code)) throw new Error("PIN oder Code im Klartext gespeichert");
      await s.click("text=Aufgeschrieben");
      const s2 = await neu(); await s2.goto(url("index.html"));
      await s2.click(".konto-knopf"); await s2.fill("input[name=pin]", "0000"); await s2.click("[data-aktion=anmelden]");
      if (!/stimmt nicht/.test(await s2.textContent(".fehlertext"))) throw new Error("falsche PIN angenommen");
      await s2.click("text=PIN vergessen?"); await s2.fill("input[name=code]", code.toLowerCase()); await s2.fill("input[name=neuepin]", "1234"); await s2.click("[data-aktion=zuruecksetzen]");
      if ((await s2.getAttribute(".code-anzeige", "data-code")) === code) throw new Error("nach dem Zurücksetzen kein neuer Code");
      const ein = await s2.evaluate(() => LST_KONTEN.einladungErstellen({ name: "Noah", geboren: "2013-01-02", klasse: 7, lehrplan: { land: "CH", kanton: "SG" } }));
      const s3 = await neu(); await s3.goto(url("index.html") + ein);
      if ((await s3.inputValue("input[name=vorname]")) !== "Noah" || (await s3.evaluate(() => location.hash))) throw new Error("Einladung nicht übernommen oder Fragment nicht gelöscht");
    } catch (e) { meldungen.push(e.message.split("\n")[0]); }
    await kontext.close();
    meldungen.forEach(t => fehlerMelden("Konten (Browser)", t));
  }
  // Rechner je Modell: Modell wählen, Beispiel aus der Anleitung tippen, Bedienhilfe und Markenvermerk vorhanden
  const mitRechner = (e, lp) => !!e.rechner && !!e.rechner[lp] && e.rechner[lp] !== "ohne";
  const ersteMitRechner = uebungen.find(e => e.stufen.some(lp => mitRechner(e, lp)));
  if (ersteMitRechner) {
    const lp = ersteMitRechner.stufen.find(x => mitRechner(ersteMitRechner, x));
    const m = await seite(url(`uebungen/${ersteMitRechner.id}/index.html?niveau=n1&stufe=${lp}`), async s => {
      await s.click(".rechner-knopf");
      await s.selectOption(".rechner-modell", "ti30-eco");
      for (const t of ["8"]) await s.click(`.rechner .rt[aria-label="${t}"]`);
      await s.click('.rechner .rt[aria-label="n-te Wurzel: zuerst die Zahl, dann diese Taste, dann n"]');
      await s.click('.rechner .rt[aria-label="3"]'); await s.click('.rechner .rt[aria-label="gleich"]');
      const erg = (await s.textContent(".rechner-ergebnis")).trim();
      if (erg !== "= 2") throw new Error(`eco RS 8 ˣ√y 3 ergab „${erg}“`);
      if (await s.$('.rechner .rt[aria-label="letztes Ergebnis"]')) throw new Error("eco RS mit Ans-Taste");
      await s.click('.rechner .rt[aria-label="Bedienhilfe"]');
      const hilfe = await s.textContent(".rechner-hilfe");
      if (!/TI-30 eco RS/.test(hilfe) || !/S\. 4/.test(hilfe)) throw new Error("Bedienhilfe eco RS fehlt");
      const vermerk = await s.textContent(".rechner-vermerk");
      if (!/nicht mit Texas Instruments verbunden/.test(vermerk)) throw new Error("Markenvermerk fehlt");
      const k = await s.evaluate(() => JSON.parse(localStorage.getItem("lernsteig:gast") || "{}"));
      if (k.rechnerModell !== "ti30-eco") throw new Error("Modellwahl nicht im Konto gespeichert");
    });
    m.forEach(t => fehlerMelden("Rechner-Modell (Browser)", t));
  }
  start.forEach(m => fehlerMelden("Startseite", m));
  // Aufsicht (AU1 a): anlegen, anfragen, Jugendlicher stimmt in seinem Tab zu, Stand ansehen, Geräte-Einstellung,
  // Konto anlegen, Sicherung ohne Verbindungen, Lösen durch den Jugendlichen
  {
    const kontext = await browser.newContext({ viewport: { width: 375, height: 900 } });
    const meldungen = [];
    const neu = async () => { const s = await kontext.newPage(); s.on("pageerror", e => meldungen.push(e.message)); s.on("console", m => { if (m.type() === "error") meldungen.push(m.text()); }); return s; };
    try {
      const j = await neu(); // Tab des Jugendlichen
      await j.goto(url("index.html"));
      await j.click("text=Neues Konto"); await j.fill("input[name=vorname]", "Test"); await j.fill("input[name=pin]", "4711");
      await j.click("[data-aktion=anlegen]"); await j.click("text=Aufgeschrieben");
      const id = await j.evaluate(() => LST_KONTEN.aktiv().id);
      const b = await neu(); // Tab der Aufsicht
      await b.goto(url("aufsicht.html"));
      await b.click("text=Neue Aufsicht"); await b.fill("input[name=name]", "Frau Muster"); await b.selectOption("select[name=rolle]", "lehrperson"); await b.fill("input[name=pin]", "2580");
      await b.click("[data-aktion=anlegen]");
      if (!/^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(await b.getAttribute(".code-anzeige", "data-code") || "")) throw new Error("Aufsicht: Code fehlt");
      await b.click("text=Aufgeschrieben");
      const auf = await b.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem("lernsteig:personen") || "[]").filter(p => p.rolle === "aufsicht")));
      if (auf.includes("2580") || !/"hash":"[0-9a-f]{64}"/.test(auf)) throw new Error("Aufsicht-PIN im Klartext");
      if (await b.$(`[data-konto="${id}"]`)) throw new Error("Konto ohne Zustimmung verbunden");
      await b.goto(url(`statistik.html?konto=${id}`));
      if (!/nicht mit der angemeldeten Aufsicht verbunden/.test(await b.textContent("main"))) throw new Error("Statistik ohne Verbindung sichtbar");
      await b.goto(url("aufsicht.html")); await b.click(`[data-anfrage="${id}"]`);
      if (await j.evaluate(() => { try { LST_KONTEN.setzeGeraeteEinstellung("rechner", "ohne"); return true; } catch (e) { return false; } })) throw new Error("Einstellung ohne Aufsicht gesetzt");
      await j.goto(url("index.html")); await j.click("[data-aktion=zulassen]");
      if (!(await j.$("[data-mitleser]"))) throw new Error("Jugendlicher sieht nicht, wer mitliest");
      await b.goto(url("aufsicht.html"));
      if (!(await b.$(`[data-konto="${id}"]`))) throw new Error("nach Zustimmung nicht verbunden");
      await b.goto(url(`statistik.html?konto=${id}`));
      if (!/Ansicht der Aufsicht Frau Muster/.test(await b.textContent("main")) || await b.$("input[type=file]")) throw new Error("Statistik der Aufsicht falsch");
      if (await b.evaluate(i => LST_DATEN.sichern([i]).konten[0].aufsicht !== undefined, id)) throw new Error("Verbindung reist in der Sicherung mit");
      await b.goto(url("aufsicht.html")); await b.selectOption("select[name=rechner]", "ohne");
      const e = uebungen.find(x => x.rechner && x.stufen.some(lp => x.rechner[lp] && x.rechner[lp] !== "ohne"));
      if (e) {
        const lp = e.stufen.find(x => e.rechner[x] && e.rechner[x] !== "ohne");
        await j.goto(url(`uebungen/${e.id}/index.html?niveau=${e.niveaus[0]}&stufe=${lp}`));
        if (await j.$(".rechner-knopf")) throw new Error("Rechner trotz Sperre der Aufsicht");
      }
      await j.goto(url("index.html"));
      if (!(await j.$("[data-geraet=ohne]"))) throw new Error("Sperre des Rechners auf der Startseite nicht sichtbar");
      await b.selectOption("select[name=rechner]", "uebung");
      await b.fill("input[name=vorname]", "Lea"); await b.click("[data-aktion=konto-anlegen]");
      if ((await b.$$(".stand-liste [data-konto]")).length !== 2) throw new Error("von der Aufsicht angelegtes Konto nicht verbunden");
      await j.click("[data-mitleser] button");
      await b.goto(url("aufsicht.html"));
      if (await b.$(`[data-konto="${id}"]`)) throw new Error("Lösen durch den Jugendlichen wirkt nicht");
      const ohnePin = await j.evaluate(async () => { const r = await LST_KONTEN.anlegen({ name: "Ohne" }); await LST_KONTEN.anmelden(r.konto.id);
        try { LST_KONTEN.antworten(r.konto.id, "a-x", true); return "angenommen"; } catch (e) { return "abgewiesen"; } });
      if (ohnePin !== "abgewiesen") throw new Error("Zustimmung ohne PIN angenommen");
    } catch (x) { meldungen.push(x.message.split("\n")[0]); }
    await kontext.close();
    meldungen.forEach(t => fehlerMelden("Aufsicht (Browser)", t));
  }
  // Statistik, Sichern und Einlesen: Runde spielen, Stand sehen, Datei sichern, in frischem Browser einlesen (zweimal: zählt einmal)
  {
    const e = uebungen[0];
    const meldungen = [];
    const k1 = await browser.newContext({ viewport: { width: 375, height: 900 }, acceptDownloads: true });
    const k2 = await browser.newContext({ viewport: { width: 375, height: 900 } });
    const beobachte = s => { s.on("pageerror", x => meldungen.push(x.message)); s.on("console", m => { if (m.type() === "error") meldungen.push(m.text()); }); return s; };
    try {
      const s = beobachte(await k1.newPage());
      await s.goto(url(`uebungen/${e.id}/index.html?niveau=${e.niveaus[0]}&stufe=${e.stufen[0]}`));
      for (let i = 0; i < e.anzahl; i++) { const a = await s.evaluate(() => LST.pruefung.aufgabe()); await antworte(s, a, true); await s.click(".weiter"); }
      await s.goto(url("statistik.html"));
      const text = await s.textContent("main");
      if (VERDAECHTIG.test(text)) throw new Error(`verdächtiger Text: ${text.slice(0, 120)}`);
      if (!(await s.$(`[data-uebung="${e.id}"] .stand`))) throw new Error("Stand je Übung fehlt");
      if ((await s.$$(".runden-tabelle tbody tr")).length !== 1) throw new Error("letzte Runden: nicht genau eine Zeile");
      await s.selectOption("select[name=wochenziel]", "1");
      if (!/diese Woche 1 von 1 Tagen · 1 Woche in Folge erreicht/.test(await s.textContent(".serie"))) throw new Error(`Wochenziel: ${await s.textContent(".serie")}`);
      const [dl] = await Promise.all([s.waitForEvent("download"), s.click("button:text-is('Sichern')")]);
      if (!/^lernsteig-gast-\d{4}-\d{2}-\d{2}\.json$/.test(dl.suggestedFilename())) throw new Error(`Dateiname: ${dl.suggestedFilename()}`);
      const pfad = await dl.path();
      const inhalt = JSON.parse(fs.readFileSync(pfad, "utf8"));
      if (inhalt.format !== "lernsteig-sicherung" || inhalt.runden.length !== 1) throw new Error("Sicherung unvollständig");
      const t = beobachte(await k2.newPage());
      await t.goto(url("statistik.html"));
      for (let i = 0; i < 2; i++) { await t.setInputFiles("input[type=file]", pfad); await t.waitForSelector(".meldung"); }
      const r = await t.evaluate(() => JSON.parse(localStorage.getItem("lernsteig:runden") || "[]"));
      if (r.length !== 1 || r[0].id !== inhalt.runden[0].id) throw new Error(`nach dem Einlesen ${r.length} Runden statt 1`);
      if (!/0 Runden/.test(await t.textContent(".meldung"))) throw new Error("zweites Einlesen hat Runden doppelt gezählt");
      await t.setInputFiles("input[type=file]", { name: "x.json", mimeType: "application/json", buffer: Buffer.from('{"format":"anderes"}') });
      await t.waitForFunction(() => /keine Sicherung/.test(document.querySelector(".meldung").textContent));
    } catch (x) { meldungen.push(x.message.split("\n")[0]); }
    await k1.close(); await k2.close();
    meldungen.forEach(t => fehlerMelden("Statistik (Browser)", t));
  }

  for (const e of uebungen) {
    for (const niveau of e.niveaus) {
      for (const stufe of LST.stufenListe(e).map(s => s.id)) {
        const ort = `${e.id} ${niveau}/${stufe} (Browser)`;
        const m = await seite(url(`uebungen/${e.id}/index.html?niveau=${niveau}&stufe=${stufe}`), async s => {
          for (let i = 0; i < e.anzahl; i++) {
            const a = await s.evaluate(() => LST.pruefung.aufgabe());
            if (!a) throw new Error(`keine Aufgabe bei Nummer ${i + 1}`);
            const text = await s.textContent(".buehne");
            if (VERDAECHTIG.test(text)) throw new Error(`verdächtiger Text: ${text.slice(0, 120)}`);
            if (i === 0) await antworte(s, a, false);
            await antworte(s, a, true);
            await s.click(".weiter");
          }
          const r = await s.evaluate(() => JSON.parse(localStorage.getItem("lernsteig:runden") || "[]"));
          if (r.length !== 1) throw new Error(`${r.length} Protokolleinträge statt 1`);
          const x = r[0];
          if (x.aufgaben !== e.anzahl || x.aufAnhieb !== e.anzahl - 1 || x.fehler !== 1 || x.niveau !== niveau || x.stufe !== stufe) {
            throw new Error(`Protokoll unplausibel: ${JSON.stringify(x).slice(0, 200)}`);
          }
        });
        m.forEach(t => fehlerMelden(ort, t));
      }
      // Rechner: bei „ohne“ kein Knopf, sonst bedienbar, Ergebnis übernehmen, Nutzung im Protokoll
      for (const lp of e.stufen) {
        const art = e.rechner ? (e.rechner[lp] || "frei") : "ohne"; // ohne Angabe im Katalog: kein Rechner
        const ortR = `${e.id} ${niveau}/${lp} Rechner (Browser)`;
        const mR = await seite(url(`uebungen/${e.id}/index.html?niveau=${niveau}&stufe=${lp}`), async s => {
          const knopf = await s.$(".rechner-knopf");
          if (art === "ohne") { if (knopf) throw new Error("Rechner-Knopf trotz „ohne“"); return; }
          if (!knopf) throw new Error(`kein Rechner-Knopf bei „${art}“`);
          await knopf.click();
          for (const t of ["1", "2", "\u00B7", "3"]) await s.click(`.rechner .rt[aria-label="${t === "\u00B7" ? "mal" : t}"]`);
          await s.click('.rechner .rt[aria-label="gleich"]');
          await s.click('.rechner .rt.uebernehmen');
          const wert = await s.inputValue(".eingabe");
          if (wert !== "36") throw new Error(`Übernahme ergab „${wert}“ statt 36`);
          const a = await s.evaluate(() => LST.pruefung.aufgabe());
          await antworte(s, a, true);
          for (let i = 1; i < e.anzahl; i++) {
            await s.click(".weiter");
            const b = await s.evaluate(() => LST.pruefung.aufgabe());
            await antworte(s, b, true);
          }
          await s.click(".weiter");
          const r = await s.evaluate(() => JSON.parse(localStorage.getItem("lernsteig:runden") || "[]"));
          if (!r[0] || r[0].mitRechner !== true || !r[0].liste[0].rechner) throw new Error(`Rechner nicht im Protokoll: ${JSON.stringify(r[0] || {}).slice(0, 160)}`);
        });
        mR.forEach(t => fehlerMelden(ortR, t));
      }
      const st = e.endlos === true ? e.stufen[0] : (e.endlos || [])[0];
      if (!st) continue;
      const ort = `${e.id} ${niveau}/${st} Serie (Browser)`;
      const m = await seite(url(`uebungen/${e.id}/index.html?niveau=${niveau}&stufe=${st}&endlos=1`), async s => {
        for (let i = 0; i < 3; i++) {
          const a = await s.evaluate(() => LST.pruefung.aufgabe());
          await antworte(s, a, true); await s.click(".weiter");
        }
        const a = await s.evaluate(() => LST.pruefung.aufgabe());
        await antworte(s, a, false);
        const rek = await s.evaluate(() => JSON.parse(localStorage.getItem("lernsteig:rekorde") || "[]"));
        if (rek.length !== 1 || rek[0].punkte !== 3) throw new Error(`Rekord vor „Zum Ergebnis“: ${JSON.stringify(rek)}`);
      });
      m.forEach(t => fehlerMelden(ort, t));
    }
  }
  await browser.close();
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
  if (opt.browser) { console.log("Browser"); await pruefeImBrowser(uebungen); }
  console.log(`\n${fehler} Fehler, ${hinweise} Hinweise.`);
  process.exit(fehler ? 1 : 0);
})();
