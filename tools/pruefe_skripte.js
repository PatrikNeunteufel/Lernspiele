// Prüft jedes Skript der Reihe ohne es auszuführen (Entscheid PK1 a, LERN_Session25; Anlass: die Prüfansicht des
// Eulenpfads lud von LERN_Session20 bis 24 mit einem Syntaxfehler, und kein Test merkte es, weil sie erst beim Öffnen
// nachgeladen wird). Über eulenpfad/, lernsteig/, gratwanderung/, portal/ und kern/:
//   1. jede .js-Datei und jedes Inline-Skript einer HTML-Seite ist lesbar (vm.Script: nur Syntax, nichts läuft);
//   2. jede <script src="…"> zeigt auf eine vorhandene Datei;
//   3. kein Skript kommt von aussen (http, https, //) — die Reihe läuft ohne externe Abhängigkeiten (Entscheid LERN-1);
//      ebenso kein <link href>, @import oder url() von aussen (Stile, Schriften; seit LERN_Session32);
//   4. jede Seite, die <app>/kern/kern.js lädt, lädt davor <app>/version.js (Plan C12, NS3 a: Version der App);
//   5. jede Grösse nach der Bildhöhe (`100vh - …`, auch dvh, svh, lvh) in .css-Dateien und <style>-Blöcken steht in
//      einem max() oder clamp() mit Untergrenze (Entscheid H1 a, LERN_Session28: unter 480 px Bildhöhe wurde die Breite
//      der Hände im Finger-Zähler null, Stufe 6 blitzte ein leeres Feld; acht weitere Spiele ebenso). Ausnahme nur mit
//      dem Kommentar „ohne Untergrenze: <Grund>“ im selben Regelblock (feste Fenster, die nie grösser als das Bild sein
//      sollen).
//   6. jede Seite, die den Stil ihrer App lädt (<app>/spiele/gemeinsam/stil.css, <app>/gemeinsam/stil.css), lädt davor
//      <app>/kern/kern.css (Farben der Reihe, Entscheid DM1 a, docs/konzept_darkmode.md): ohne sie zeigen die Namen
//      der App (--text: var(--k-text)) ins Leere, und die Seite verliert still ihre Farben. In den Apps aus KOPF_APPS
//      steht davor <script src="…/kern/kern-kopf.js" data-speicher="<Präfix>"> (Darkmode Schritt 3b): ohne es blitzt eine
//      dunkle Seite hell auf, mit falschem Präfix bleibt sie hell.
//   7. feste Farben in Stilen (DM4 a): #…, rgb(), rgba(), hsl(), white, black ausserhalb von Variablen in :root. Nicht
//      gezählt: ein Regelblock mit dem Kommentar „Bildfarben: <Grund>“ (Zeichnung auf heller Bildkachel, DM3 a) oder
//      „Gleich in beiden Modi: <Grund>“ (Gegenstand mit eigenen Farben: Banknote, Klaviertaste, Nachthimmel). In
//      Spielseiten (eulenpfad/spiele/<spiel>/*.html) ein Fehler seit Darkmode Schritt 5 (LERN_Session35), sonst ein
//      Hinweis, bis Schritt 6 die übrigen Stile umgebaut hat. Mit --farben je Datei die Zahl.
// Fehler im Verhalten fängt sie nicht; dafür sind die Seitentests da.
// Aufruf: node tools/pruefe_skripte.js — läuft mit den kurzen Prüfungen (node tools/pruefe.js); Ende mit Code 1 bei Fehlern.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WURZEL = path.join(__dirname, "..");
const ORDNER = ["eulenpfad", "lernsteig", "gratwanderung", "portal", "kern"];
// Inline-Blöcke, die kein JavaScript sind (Daten), und solche ohne Inhalt werden übersprungen
const KEIN_SKRIPT = /\btype="(?!text\/javascript|module)[^"]*"/;

/** Alle Dateien mit der Endung unter ordner (rekursiv). */
const dateien = (ordner, endung) => fs.readdirSync(ordner, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? dateien(path.join(ordner, e.name), endung) : e.name.endsWith(endung) ? [path.join(ordner, e.name)] : []);

// 5. Grösse nach der Bildhöhe: Zahl mit vh (dvh, svh, lvh), dann ein Minus
const VH_MINUS = /\b\d+(?:\.\d+)?[dsl]?vh\s*-/g;
const AUSNAHME = "ohne Untergrenze:";

/**
 * Mängel einer CSS-Quelle nach Punkt 5: jede Stelle `100vh - …` ohne Untergrenze. Eine Untergrenze ist (1) ein
 * umschliessendes max() oder ein clamp(), in dem die Stelle nicht im ersten Glied steht, oder (2) im selben Regelblock
 * min-width beziehungsweise min-height derselben Achse mit einem Wert über 0. text: CSS (Datei oder Inhalt eines
 * <style>), wo: Name für die Meldung, zeile0: Zeile, auf der text in der Datei beginnt. Gibt [Text] zurück.
 */
function pruefeCss(text, wo, zeile0 = 1) {
  const m = [];
  // Kommentare durch gleich viele Leerzeichen ersetzen: Stellen bleiben gleich, im Kommentar zählt nichts
  const leer = text.replace(/\/\*[\s\S]*?\*\//g, k => k.replace(/[^\n]/g, " "));
  for (const t of leer.matchAll(VH_MINUS)) {
    const { geschuetzt, eigenschaft } = umgebung(leer, t.index);
    if (geschuetzt) continue;
    const auf = leer.lastIndexOf("{", t.index), zu = leer.indexOf("}", t.index);
    const block = leer.slice(auf + 1, zu < 0 ? undefined : zu);
    if (text.slice(auf + 1, zu < 0 ? undefined : zu).includes(AUSNAHME)) continue;
    const achse = (eigenschaft.match(/(?:^|-)(width|height)$/) || [])[1];
    const mindest = achse && block.match(new RegExp(`(?:^|[;\\s{])min-${achse}\\s*:\\s*([^;]+)`));
    if (mindest && !/^\s*(0(px)?|auto|none|initial|unset)\s*(!important)?\s*$/.test(mindest[1])) continue;
    const zeile = zeile0 + (text.slice(0, t.index).match(/\n/g) || []).length;
    const anfang = leer.lastIndexOf("\n", t.index) + 1;
    m.push(`${wo} (Zeile ${zeile}): Grösse nach der Bildhöhe ohne Untergrenze — ${leer.slice(anfang, leer.indexOf("\n", t.index) >>> 0).trim().slice(0, 110)} (H1 a: max(Mindestmass, …) oder „${AUSNAHME} <Grund>“)`);
  }
  // 3. auch Stile nichts von aussen: @import und url() mit http, https oder // (eine Schrift von einem Schriftdienst,
  // LERN-1; Lücke gefunden in LERN_Session32 bei der Vorarbeit zum Konzept Gestaltung)
  for (const t of leer.matchAll(/@import\s+(?:url\(\s*)?["']?((?:https?:)?\/\/[^"')\s]+)|url\(\s*["']?((?:https?:)?\/\/[^"')\s]+)/gi)) {
    const zeile = zeile0 + (text.slice(0, t.index).match(/\n/g) || []).length;
    m.push(`${wo} (Zeile ${zeile}): Stil oder Schrift von aussen ${t[1] || t[2]} (LERN-1)`);
  }
  return m;
}

// Gegenproben zu Punkt 5: [CSS, erwartete Zahl Meldungen, Name]; laufen bei jedem Aufruf mit
const GEGENPROBEN_CSS = [
  [".a { width: min(300px, calc(100vh - 400px)); }", 1, "ohne Untergrenze"],
  [".a { width: max(200px, min(300px, calc(100vh - 400px))); }", 0, "max aussen"],
  [".a { width: clamp(190px, 100vh - 620px, 300px); }", 0, "clamp, mittleres Glied"],
  [".a { width: clamp(100vh - 620px, 10px, 300px); }", 1, "clamp, erstes Glied"],
  [".a { max-height: calc(100vh - 600px); min-height: 200px; }", 0, "min-height derselben Achse"],
  [".a { max-width: min(400px, 100vh - 565px); min-width: 0; }", 1, "min-width 0"],
  [".a { max-width: min(400px, 100vh - 565px); min-height: 240px; }", 1, "min- der anderen Achse"],
  [`.a { /* ${AUSNAHME} Fenster */ max-height: calc(100vh - 24px); }`, 0, "Ausnahme im Block"],
  [`/* ${AUSNAHME} */ .a { max-height: calc(100vh - 24px); }`, 1, "Ausnahme vor dem Block"],
  ["/* .a { width: calc(100vh - 9px); } */ .b {}", 0, "nur im Kommentar"],
  ["@media (x) { .a { height: calc(100dvh - 50px); } }", 1, "dvh in @media"],
  ["@import url('https://fonts.example/css?family=X');", 1, "Schrift von aussen per @import"],
  ["@font-face { font-family: X; src: url(//cdn.example/x.woff2); }", 1, "Schriftdatei von aussen"],
  ["@font-face { font-family: X; src: url('schriften/x.woff2'); }", 0, "Schriftdatei im App-Ordner"],
  [".a { background: url(data:image/svg+xml,%3Csvg%3E); }", 0, "Bild als data-URL"],
];

// 7. Feste Farben (DM4 a)
const FESTE_FARBE = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)|\b(?:white|black)\b(?!-)/gi; // nicht white-space
const BILDFARBEN = "Bildfarben:";
const GLEICH = "Gleich in beiden Modi:"; // Teile, die in beiden Modi gleich aussehen (Leiste der Entwicklung, Gegenstände)
const SPIELSEITE = /^eulenpfad\/spiele\/(?!gemeinsam\/)[^/]+\/[^/]+\.html$/; // Punkt 7 dort ein Fehler (Schritt 5)
/** Dunkle, halb durchsichtige Farbe (Schatten, Abdunklung): wirkt in beiden Modi und zählt nicht. */
const DUNKEL_DURCHSICHTIG = f => {
  const m = f.replace(/\s+/g, "").match(/^rgba\((\d+),(\d+),(\d+),([\d.]+)\)$/i);
  return !!m && Number(m[4]) < 1 && (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255 < 0.45;
};

/** Zahl der festen Farben einer CSS-Quelle nach Punkt 7 (ohne Kommentare, ohne Variablen in :root, ohne Bildfarben). */
function festeFarben(text) {
  let n = 0;
  // Kommentare vor dem Zerlegen weg (sie dürfen Klammern enthalten); der Vermerk „Bildfarben:“ bleibt als Marke stehen
  const ohne = text.replace(/\/\*[\s\S]*?\*\//g, k => (k.includes(BILDFARBEN) ? ` ${BILDFARBEN} ` : k.includes(GLEICH) ? ` ${BILDFARBEN} ` : " "));
  for (const b of ohne.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    const [wahl, rumpf] = [b[1].trim(), b[2]];
    if (rumpf.includes(BILDFARBEN)) continue;
    const leer = rumpf;
    const rootBlock = /^:root\b/.test(wahl.split(/\s+/).pop() || "") && /^:root(\[[^\]]*\])?$/.test(wahl.split(/[\s,]+/).pop());
    for (const d of leer.split(";")) {
      if (rootBlock && /^\s*--/.test(d)) continue;
      // color-mix mit einer Variablen ist keine feste Farbe (der Ton kommt aus der Variablen)
      const d2 = d.replace(/color-mix\([^;]*var\(--[^;]*\)/g, "");
      n += (d2.match(FESTE_FARBE) || []).filter(f => !DUNKEL_DURCHSICHTIG(f)).length;
    }
  }
  return n;
}

// Gegenproben zu Punkt 7: [CSS, erwartete Zahl]
const GEGENPROBEN_FARBE = [
  [":root { --a: #fff; --b: rgb(1, 2, 3); }", 0, "Variablen in :root"],
  [".a { color: #fff; background: rgba(255, 240, 200, .9); }", 2, "zwei feste Farben"],
  [".a { --f: #abc; }", 1, "Variable ausserhalb von :root"],
  [".a { /* Bildfarben: Zeichnung */ fill: #123456; }", 0, "Bildfarben im Block"],
  ["/* .a { color: #fff } */ .b { color: var(--text); }", 0, "nur im Kommentar"],
  [".a { color: white; border: 1px solid black; }", 2, "Farbnamen"],
  ["@media (x) { .a { color: #000; } }", 1, "in @media"],
  [".a { white-space: nowrap; }", 0, "white-space ist keine Farbe"],
  [".a { box-shadow: 0 2px 4px rgba(0, 0, 0, .2); }", 0, "dunkler halb durchsichtiger Schatten"],
  [".a { box-shadow: 0 2px 0 rgba(255, 255, 255, .7); }", 1, "heller halb durchsichtiger Schatten zählt"],
  [".a { background: color-mix(in srgb, var(--k-feld) 70%, transparent); }", 0, "color-mix mit Variable"],
  [".a { /* Gleich in beiden Modi: Leiste */ color: #fff; }", 0, "Gleich in beiden Modi"],
];

// 6. Stil der App und Farben des Kerns davor; Apps mit Kopf-Skript und ihr Speicher-Präfix (der Lernsteig folgt, Schritt 6)
const APP_STIL = /^([a-z]+)\/(?:spiele\/)?gemeinsam\/stil\.css$/;
const KOPF_APPS = { eulenpfad: "lernspiele:" };

/**
 * Mängel einer Seite nach Punkt 6. html: Inhalt ohne HTML-Kommentare, wo: Pfad der Seite relativ zur Wurzel (mit /),
 * gibt: Datei vorhanden? (Pfad relativ zur Wurzel). Gibt [Text] zurück.
 */
function pruefeKernStil(html, wo, gibt) {
  const m = [];
  const stile = [...html.matchAll(/<link\s[^>]*href\s*=\s*["']([^"']+\.css)(?:[?#][^"']*)?["'][^>]*>/gi)]
    .filter(l => /rel\s*=\s*["']?stylesheet/i.test(l[0]) && !/^(https?:)?\/\//i.test(l[1]))
    .map(l => path.posix.normalize(path.posix.join(path.posix.dirname(wo), decodeURI(l[1]))));
  const i = stile.findIndex(s => APP_STIL.test(s));
  if (i < 0) return m;
  const soll = `${stile[i].match(APP_STIL)[1]}/kern/kern.css`;
  const k = stile.indexOf(soll);
  if (k < 0 || k > i) m.push(`${wo}: lädt ${stile[i]} ohne ${soll} davor (DM1 a)`);
  else if (!gibt(soll)) m.push(`${wo}: ${soll} fehlt — python tools/kern_verteilen.py`);
  const app = stile[i].match(APP_STIL)[1];
  if (KOPF_APPS[app]) {
    const kopfSoll = `${app}/kern/kern-kopf.js`;
    const kopf = [...html.matchAll(/<script\s[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi)]
      .map(s => ({ pfad: path.posix.normalize(path.posix.join(path.posix.dirname(wo), decodeURI(s[1].split(/[?#]/)[0]))), tag: s[0], stelle: s.index }))
      .find(s => s.pfad === kopfSoll);
    const kernStelle = html.search(/<link\s[^>]*kern\/kern\.css/i);
    if (!kopf) m.push(`${wo}: ohne ${kopfSoll} im Kopf (Darkmode, DM1 a)`);
    else if (kernStelle >= 0 && kopf.stelle > kernStelle) m.push(`${wo}: ${kopfSoll} steht nach kern.css — es muss vor dem ersten Bild laufen`);
    else if (!kopf.tag.includes(`data-speicher="${KOPF_APPS[app]}"`)) m.push(`${wo}: ${kopfSoll} ohne data-speicher="${KOPF_APPS[app]}"`);
  }
  return m;
}

// Gegenproben zu Punkt 6: [HTML, Pfad der Seite, erwartete Zahl Meldungen, Name]
const KOPF = '<script src="../../kern/kern-kopf.js" data-speicher="lernspiele:"></script>';
const GEGENPROBEN_STIL = [
  [KOPF + '<link rel="stylesheet" href="../../kern/kern.css"><link rel="stylesheet" href="../gemeinsam/stil.css">', "eulenpfad/spiele/x/index.html", 0, "Spielseite richtig"],
  [KOPF + '<link rel="stylesheet" href="../gemeinsam/stil.css">', "eulenpfad/spiele/x/index.html", 1, "Spielseite ohne Kern"],
  [KOPF + '<link rel="stylesheet" href="../gemeinsam/stil.css"><link rel="stylesheet" href="../../kern/kern.css">', "eulenpfad/spiele/x/index.html", 1, "Kern nach dem Stil"],
  ['<link rel="stylesheet" href="../../kern/kern.css"><link rel="stylesheet" href="../gemeinsam/stil.css">', "eulenpfad/spiele/x/index.html", 1, "ohne Kopf-Skript"],
  ['<link rel="stylesheet" href="../../kern/kern.css">' + KOPF + '<link rel="stylesheet" href="../gemeinsam/stil.css">', "eulenpfad/spiele/x/index.html", 1, "Kopf-Skript nach kern.css"],
  [KOPF.replace("lernspiele:", "lernsteig:") + '<link rel="stylesheet" href="../../kern/kern.css"><link rel="stylesheet" href="../gemeinsam/stil.css">', "eulenpfad/spiele/x/index.html", 1, "falsches Präfix"],
  ['<link rel="stylesheet" href="kern/kern.css"><link rel="stylesheet" href="gemeinsam/stil.css">', "lernsteig/index.html", 0, "Lernsteig richtig"],
  ['<link rel="stylesheet" href="../eulenpfad/kern/kern.css"><link rel="stylesheet" href="gemeinsam/stil.css">', "lernsteig/index.html", 1, "Kern der falschen App"],
  ['<link rel="stylesheet" href="anleitung.css">', "eulenpfad/anleitung/kinder.html", 0, "ohne Stil der App"],
];

/**
 * Umgebung der Stelle bei i bis zum Anfang ihrer Deklaration: geschuetzt = steht in einem max() oder als zweites oder
 * drittes Glied eines clamp(); eigenschaft = Name der Eigenschaft (klein, "" wenn nicht gefunden).
 */
function umgebung(css, i) {
  let tiefe = 0, komma = 0, geschuetzt = false;
  for (let j = i - 1; j >= 0; j--) {
    const c = css[j];
    if (c === ")") tiefe++;
    else if (c === "," && tiefe === 0) komma++;
    else if (c === "(") {
      if (tiefe > 0) { tiefe--; continue; }
      const name = ((css.slice(Math.max(0, j - 12), j).match(/([a-z-]+)\s*$/i) || [])[1] || "").toLowerCase();
      if (name === "max" || (name === "clamp" && komma >= 1)) geschuetzt = true;
      komma = 0; // eine Klammer weiter aussen: Glieder neu zählen
    } else if (tiefe === 0 && c === ":") {
      return { geschuetzt, eigenschaft: ((css.slice(Math.max(0, j - 40), j).match(/([a-z-]+)\s*$/i) || [])[1] || "").toLowerCase() };
    } else if (tiefe === 0 && (c === ";" || c === "{" || c === "}")) break;
  }
  return { geschuetzt, eigenschaft: "" };
}

/** Prüft alles; gibt { fehler: [Text], zahlen: { js, inline, verweise, css } } zurück. ordner: zum Prüfen mit anderen Ordnern. */
function pruefe(wurzel = WURZEL, ordner = ORDNER) {
  const fehler = [];
  const zahlen = { js: 0, inline: 0, verweise: 0, css: 0, farben: {} }; // farben: Datei → Zahl fester Farben (Punkt 7)
  for (const [css, soll, name] of GEGENPROBEN_CSS) {
    const ist = pruefeCss(css, "Gegenprobe").length;
    if (ist !== soll) fehler.push(`Gegenprobe Punkt 5 „${name}“: ${ist} statt ${soll} Meldungen`);
  }
  for (const [css, soll, name] of GEGENPROBEN_FARBE) {
    const ist = festeFarben(css);
    if (ist !== soll) fehler.push(`Gegenprobe Punkt 7 „${name}“: ${ist} statt ${soll} feste Farben`);
  }
  for (const [wo, soll] of [["eulenpfad/spiele/zahlenhaus/index.html", true], ["eulenpfad/spiele/koenig-falle/regeln.html", true],
    ["eulenpfad/spiele/gemeinsam/pruefen.html", false], ["eulenpfad/index.html", false], ["lernsteig/uebungen/x/index.html", false]]) {
    if (SPIELSEITE.test(wo) !== soll) fehler.push(`Gegenprobe Punkt 7: ${wo} ${soll ? "nicht" : "fälschlich"} als Spielseite erkannt`);
  }
  for (const [html, wo, soll, name] of GEGENPROBEN_STIL) {
    const ist = pruefeKernStil(html, wo, () => true).length;
    if (ist !== soll) fehler.push(`Gegenprobe Punkt 6 „${name}“: ${ist} statt ${soll} Meldungen`);
  }
  const lies = (code, wo) => {
    try { new vm.Script(code, { filename: wo }); } catch (e) { fehler.push(`${wo}: ${e.message}${zeileVon(e)}`); }
  };
  for (const o of ordner) {
    const start = path.join(wurzel, o);
    if (!fs.existsSync(start)) { fehler.push(`Ordner ${o}/ fehlt`); continue; }
    for (const f of dateien(start, ".js")) { zahlen.js++; lies(fs.readFileSync(f, "utf8"), path.relative(wurzel, f).replace(/\\/g, "/")); }
    for (const f of dateien(start, ".css")) {
      zahlen.css++;
      const wo = path.relative(wurzel, f).replace(/\\/g, "/"), text = fs.readFileSync(f, "utf8");
      fehler.push(...pruefeCss(text, wo));
      const n = festeFarben(text);
      if (n && !/\/kern\/kern\.css$/.test(wo)) zahlen.farben[wo] = n;
    }
    for (const f of dateien(start, ".html")) {
      const wo = path.relative(wurzel, f).replace(/\\/g, "/");
      // 5. Stil in der Seite (Zeilen aus dem Original, vor dem Entfernen der HTML-Kommentare)
      for (const s of fs.readFileSync(f, "utf8").matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
        zahlen.css++;
        const nf = festeFarben(s[1]);
        if (nf) zahlen.farben[wo] = (zahlen.farben[wo] || 0) + nf;
        const start = s.index + s[0].indexOf(">") + 1;
        fehler.push(...pruefeCss(s[1], wo, 1 + (s.input.slice(0, start).match(/\n/g) || []).length));
      }
      const html = fs.readFileSync(f, "utf8").replace(/<!--[\s\S]*?-->/g, "");
      // 3. auch kein <link href> von aussen (Stile, Schriften, Vorladen; LERN-1)
      for (const l of html.matchAll(/<link\s[^>]*href\s*=\s*["']((?:https?:)?\/\/[^"']+)["']/gi)) fehler.push(`${wo}: Verweis von aussen ${l[1]} (LERN-1)`);
      // 6. Farben des Kerns vor dem Stil der App (DM1 a)
      fehler.push(...pruefeKernStil(html, wo, p => fs.existsSync(path.join(wurzel, p))));
      const geladen = []; // aufgelöste Pfade der <script src> in Reihenfolge (für Punkt 4)
      for (const m of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi)) {
        const attr = m[1] || "";
        const src = attr.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
        if (src) {
          zahlen.verweise++;
          geladen.push(path.relative(wurzel, path.join(path.dirname(f), decodeURI(src[1].split(/[?#]/)[0]))).replace(/\\/g, "/"));
          if (/^(https?:)?\/\//i.test(src[1])) { fehler.push(`${wo}: Skript von aussen ${src[1]} (LERN-1)`); continue; }
          const ziel = path.join(path.dirname(f), decodeURI(src[1].split(/[?#]/)[0]));
          if (!fs.existsSync(ziel)) fehler.push(`${wo}: Skript fehlt ${src[1]}`);
        } else if (m[2].trim() && !KEIN_SKRIPT.test(attr)) {
          zahlen.inline++;
          lies(m[2], `${wo} (Skript in der Seite)`);
        }
      }
      // 4. Version der App vor dem Kern (NS3 a)
      const kern = geladen.findIndex(p => /^[a-z]+\/kern\/kern\.js$/.test(p));
      if (kern >= 0) {
        const soll = geladen[kern].replace(/kern\/kern\.js$/, "version.js");
        const v = geladen.indexOf(soll);
        if (v < 0 || v > kern) fehler.push(`${wo}: lädt ${geladen[kern]} ohne ${soll} davor (NS3 a)`);
      }
    }
  }
  // 7. in Spielseiten ein Fehler (Darkmode Schritt 5): eine feste Farbe bleibt im dunklen Modus hell und still unlesbar
  for (const [wo, n] of Object.entries(zahlen.farben)) {
    if (SPIELSEITE.test(wo)) fehler.push(`${wo}: ${n} feste Farbe(n) im Stil — Variable nehmen oder Block mit „Bildfarben:“ / „Gleich in beiden Modi:“ (DM4 a)`);
  }
  return { fehler, zahlen };
}

/** Zeile und Spalte aus dem Stapel eines SyntaxError (vm nennt sie dort, nicht in der Meldung). */
function zeileVon(e) {
  const m = String(e.stack || "").match(/:(\d+)\s*\n/);
  return m ? ` (Zeile ${m[1]})` : "";
}

if (require.main === module) {
  const { fehler, zahlen } = pruefe();
  console.log(`${zahlen.js} Skriptdateien, ${zahlen.inline} Skripte in Seiten, ${zahlen.verweise} Verweise, ${zahlen.css} Stile geprüft.`);
  // 7. feste Farben ausserhalb der Spielseiten: ein Hinweis (DM4 a, Schritt 6), je Datei mit --farben
  const farben = Object.entries(zahlen.farben);
  const uebrige = farben.filter(([d]) => !SPIELSEITE.test(d));
  if (uebrige.length) console.log(`    HINWEIS feste Farben (DM4 a): ${uebrige.reduce((s, [, n]) => s + n, 0)} in ${uebrige.length} Stilen ` +
    `ausserhalb der Spielseiten — Liste mit --farben`);
  if (process.argv.includes("--farben")) for (const [d, n] of farben.sort((a, b) => b[1] - a[1])) console.log(`      ${String(n).padStart(4)}  ${d}`);
  for (const f of fehler) console.log(`    FEHLER  ${f}`);
  const schluss = fehler.length ? `${fehler.length} Fehler.` : "Keine Fehler.";
  console.log(schluss);
  require("./testausgabe.js").merke("pruefe_skripte", schluss); // HK1 a
  process.exit(fehler.length ? 1 : 0);
}

module.exports = { pruefe, pruefeCss, festeFarben };
