// Misst den Kontrast jeder sichtbaren Schrift gegen ihren Grund (Entscheid DM4 a, docs/konzept_darkmode.md).
// Aufruf: node tools/kontrast.js [Basis-URL, Vorgabe http://localhost:8765] [spiel-id …]
//         [--modus=hell,dunkel] [--stufen=wahl,s1,s2,s3,s4,s5,s6] [--apps=eulenpfad,lernsteig] [--json=datei]
//         [--port=9335] [--streng]
// Der Server muss das Repo ausliefern (python tools/server.py 8765).
//
// Läuft im Browser, nicht im Prüf-DOM: Erst der Browser rechnet die Kaskade aus (Variablen, Vererbung, Deckkraft,
// Schichten übereinander); das Ersatz-DOM der Seitentests kennt kein CSS. Chrome ohne Fenster mit eigenem, leerem Profil
// (wie tools/bildhoehe.js): Ein Messkind wird angelegt, alle Spiele und Listen sind für es freigegeben. Je Seite lädt
// ein iframe (1024 × 768) die Startseite mit jedem Tab, je Spiel die Stufenwahl („wahl“) und die erste Aufgabe jeder
// Stufe, im Lernsteig die Startseite und jede Übung. Im Modus „dunkel“ setzt es data-farben="dunkel" an <html>.
//
// Je Element mit eigenem Text (Buchstaben oder Ziffern; reine Emoji zählen nicht): Farbe der Schrift mit ihrer
// Deckkraft und der Deckkraft der Vorfahren; Grund = alle Schichten unter der Mitte des Textes (elementsFromPoint:
// Hintergründe von HTML-Elementen, Füllung von SVG-Formen), von unten nach oben gemischt auf Weiss; ein Verlauf zählt
// mit jeder seiner Farben, es gilt die schlechteste. Untergrenze nach WCAG 2.x: 4,5, grosse Schrift (ab 24 px oder ab
// 18,66 px fett) 3. Nicht gezählt: gesperrte Knöpfe und Felder, unsichtbare und durchsichtige Schrift. Ein Bild als
// Hintergrund (url()) kann es nicht lesen — der Text gilt dann als „unbekannt“.
//
// Nur die erste Aufgabe jeder Stufe: Rückmeldung, Lösung und Schlussbild sind nicht dabei.
// Ergebnis: Zusammenfassung je Spiel, alle Funde in .temp/kontrast/<modus>.json (oder --json). Meldet nur (Ende mit 0),
// bis die Spielseiten umgebaut sind (DM4 a); mit --streng Ende mit 1 bei einem Fund.
"use strict";
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const WURZEL = path.join(__dirname, "..");
const opt = { modus: "hell", stufen: "wahl,s1,s2,s3,s4,s5,s6", apps: "eulenpfad,lernsteig", json: null, port: "9335", streng: false };
const nurSpiele = [];
let BASIS = "http://localhost:8765";
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--(\w+)(?:=(.*))?$/);
  if (m) opt[m[1]] = m[2] ?? true;
  else if (/^https?:/.test(a)) BASIS = a.replace(/\/$/, "");
  else nurSpiele.push(a);
}
const PORT = Number(opt.port);
const BREITE = 1024, HOEHE = 768;
const BROWSER = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(p => fs.existsSync(p));

const warte = ms => new Promise(r => setTimeout(r, ms));
let ws, naechsteId = 1;
const offen = new Map();
function send(method, params = {}) {
  const id = naechsteId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((ok, fehler) => offen.set(id, { ok, fehler, method }));
}
async function js(code) {
  const r = await send("Runtime.evaluate", { expression: `(async () => { ${code} })()`, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
  return r.result.value;
}

/**
 * Läuft im iframe der Seite (als Text eingesetzt): gibt [{ sel, text, farbe, grund, verhaeltnis, soll }] aller Texte,
 * dazu die Zahl der gemessenen und der unbekannten. Reine Funktion von doc und win, ohne Bezug auf Node.
 */
function messeSeite(doc, win) {
  const farbe = s => {
    const m = String(s).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const t = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return t.length >= 3 && t.slice(0, 3).every(Number.isFinite) ? [t[0], t[1], t[2], Number.isFinite(t[3]) ? t[3] : 1] : null;
  };
  const mische = (oben, unten) => { // oben mit Deckkraft a über unten (deckend)
    const a = oben[3];
    return [0, 1, 2].map(i => oben[i] * a + unten[i] * (1 - a)).concat(1);
  };
  const lum = c => {
    const k = c.slice(0, 3).map(v => v / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
  };
  const verh = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const deckkraft = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= Number(win.getComputedStyle(e).opacity); return o; };
  const sel = el => {
    const teil = e => e.tagName.toLowerCase() + [...e.classList].slice(0, 3).map(k => "." + k).join("");
    const p = el.parentElement && el.parentElement !== doc.body ? teil(el.parentElement) + " > " : "";
    return p + teil(el);
  };
  const SVG_FORM = new Set(["rect", "circle", "ellipse", "path", "polygon", "polyline"]);
  /** Farben einer Schicht: [] = durchsichtig, null = unbekannt (Bild), sonst Liste möglicher Farben (Verlauf) */
  function schicht(e) {
    const s = win.getComputedStyle(e), o = deckkraft(e);
    // Das äusserste <svg> malt seinen CSS-Hintergrund wie ein HTML-Element (Bildkachel einer Szene, Schritt 5)
    const svgWurzel = e instanceof win.SVGSVGElement && !(e.parentNode instanceof win.SVGElement);
    if (e instanceof win.SVGElement && !svgWurzel) {
      if (!SVG_FORM.has(e.tagName.toLowerCase())) return [];
      const f = farbe(s.fill);
      if (!f || f[3] === 0) return [];
      return [[f[0], f[1], f[2], f[3] * Number(s.fillOpacity || 1) * o]];
    }
    const bild = s.backgroundImage;
    const liste = [];
    if (bild && bild !== "none") {
      if (/url\(/.test(bild)) return null;
      for (const m of bild.matchAll(/rgba?\([^)]+\)/g)) { const f = farbe(m[0]); if (f) liste.push([f[0], f[1], f[2], f[3] * o]); }
    }
    const g = farbe(s.backgroundColor);
    if (g && g[3] > 0) liste.push([g[0], g[1], g[2], g[3] * o]);
    return liste;
  }
  const erg = { funde: [], gemessen: 0, unbekannt: 0 };
  const gesehen = new Set();
  for (const el of doc.body.querySelectorAll("*")) {
    if (["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT", "OPTION"].includes(el.tagName)) continue;
    const knoten = [...el.childNodes].filter(n => n.nodeType === 3 && /[\p{L}\p{N}]/u.test(n.textContent));
    if (!knoten.length) continue;
    if (el.closest("[disabled], [aria-disabled='true'], [hidden], [inert]")) continue;
    const s = win.getComputedStyle(el);
    if (s.visibility !== "visible" || s.display === "none") continue;
    const tf = farbe(el instanceof win.SVGElement ? s.fill : s.color);
    if (!tf) continue;
    const textFarbe = [tf[0], tf[1], tf[2], tf[3] * deckkraft(el)];
    if (textFarbe[3] < 0.05) continue;
    const r = doc.createRange(); r.selectNodeContents(knoten[0]);
    let box = r.getClientRects()[0];
    if (!box || box.width < 1) continue;
    if (box.top < 0 || box.bottom > win.innerHeight || box.left < 0 || box.right > win.innerWidth) {
      el.scrollIntoView({ block: "center", inline: "center" });
      box = r.getClientRects()[0];
      if (!box) continue;
    }
    const x = box.left + box.width / 2, y = box.top + box.height / 2;
    if (x < 0 || y < 0 || x > win.innerWidth || y > win.innerHeight) continue;
    const stapel = doc.elementsFromPoint(x, y);
    // Schichten ab dem Element selbst nach unten; was über dem Text liegt (und ihn verdeckt), zählt nicht
    let ab = stapel.indexOf(el);
    if (ab < 0) ab = stapel.findIndex(e => e.contains(el));
    if (ab < 0) continue;
    let gruende = [[255, 255, 255, 1]];
    let unbekannt = false;
    for (const e of stapel.slice(ab).reverse()) {
      const f = schicht(e);
      if (f === null) { unbekannt = true; break; }
      if (!f.length) continue;
      gruende = gruende.flatMap(g => f.map(c => mische(c, g))).slice(0, 16);
    }
    erg.gemessen++;
    if (unbekannt) { erg.unbekannt++; continue; }
    const px = parseFloat(s.fontSize), fett = Number(s.fontWeight) >= 700;
    const gross = px >= 24 || (px >= 18.66 && fett);
    const soll = gross ? 3 : 4.5;
    let schlimmst = null;
    for (const g of gruende) {
      const v = verh(mische(textFarbe, g), g);
      if (!schlimmst || v < schlimmst.v) schlimmst = { v, g };
    }
    if (schlimmst.v + 1e-9 >= soll) continue;
    const hex = c => "#" + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
    const schluessel = `${sel(el)}|${hex(mische(textFarbe, schlimmst.g))}|${hex(schlimmst.g)}`;
    if (gesehen.has(schluessel)) continue;
    gesehen.add(schluessel);
    erg.funde.push({ sel: sel(el), text: knoten[0].textContent.trim().slice(0, 40), farbe: hex(mische(textFarbe, schlimmst.g)),
      grund: hex(schlimmst.g), verhaeltnis: Math.round(schlimmst.v * 100) / 100, soll, px: Math.round(px * 10) / 10, fett });
  }
  return erg;
}

/**
 * Gegenprobe bei jedem Lauf: Probeseite mit bekannten Paaren; data-soll="fund" muss gemeldet werden, "ok" nicht.
 * Zahlen: #767676 auf Weiss 4,54 (reicht), #777777 4,48 (reicht nicht); #949494 3,08 (reicht nur gross); Weiss auf
 * halb Schwarz über Weiss = Weiss auf #808080, 3,95. Je Zeile eine eigene Klasse (gleiche Paare am gleichen Ort meldet
 * die Messung nur einmal).
 */
const PROBE = `<!doctype html><body style="margin:0;background:#fff;font:16px sans-serif">
  <p data-soll="ok" style="color:#000">schwarz auf weiss</p>
  <p class="a1" data-soll="ok" style="color:#767676">grau 4,54</p>
  <p class="a2" data-soll="fund" style="color:#777777">grau 4,48</p>
  <p class="g1" data-soll="ok" style="color:#949494;font-size:24px">gross 3,08</p>
  <p class="g2" data-soll="fund" style="color:#949494;font-size:18px">klein 3,08</p>
  <p class="g3" data-soll="ok" style="color:#949494;font-size:19px;font-weight:700">fett 3,08</p>
  <div style="background:#2f8fe0"><span data-soll="fund" style="color:#fff">weiss auf blau 3,43</span></div>
  <div style="background:linear-gradient(#000,#fff)"><span data-soll="fund" style="color:#000">schwarz auf Verlauf</span></div>
  <div style="background:rgba(0,0,0,.5)"><span data-soll="fund" style="color:#fff">weiss auf halb schwarz 3,95</span></div>
  <p class="d1" data-soll="fund" style="color:rgba(0,0,0,.3)">schwarz zu 30 Prozent</p>
  <div style="opacity:.3"><p data-soll="fund" style="color:#000">Vorfahr zu 30 Prozent</p></div>
  <button data-soll="ok" disabled style="color:#ccc;background:#fff">gesperrt</button>
  <p data-soll="ok" style="color:#ffff00">🙂🙂</p>
  <svg width="200" height="40"><rect width="200" height="40" fill="#e9b300"/><text data-soll="fund" x="5" y="25" fill="#ffffff">Text in SVG</text></svg>
  <svg width="200" height="40"><rect width="200" height="40" fill="#000000"/><text data-soll="ok" x="5" y="25" fill="#ffffff">hell auf schwarz</text></svg>
</body>`;

/** Läuft in der Startseite: misst die Probeseite und gibt die Abweichungen zurück ([] = alles wie erwartet). */
const GEGENPROBE = `
  ${messeSeite.toString()}
  const f = document.createElement("iframe");
  f.style.cssText = "position:absolute;left:-20000px;width:${BREITE}px;height:${HOEHE}px";
  await new Promise(ok => { f.onload = ok; f.srcdoc = ${JSON.stringify(PROBE)}; document.body.append(f); });
  const erg = messeSeite(f.contentDocument, f.contentWindow);
  const gemeldet = new Set(erg.funde.map(x => x.text));
  const ab = [...f.contentDocument.querySelectorAll("[data-soll]")].map(e => [e.textContent.trim(), e.dataset.soll])
    .filter(([t, s]) => (s === "fund") !== gemeldet.has(t.slice(0, 40))).map(([t, s]) => t + " (erwartet " + s + ")");
  f.remove();
  return ab;`;

/** Läuft in der Startseite: misst alle Aufträge mit 6 iframes zugleich, Stand in window.__ko. */
const MESSEN = (auftraege, modus) => `
  ${messeSeite.toString()}
  window.__ko = { fertig: 0, erg: [] };
  const halter = document.createElement("div");
  halter.style.cssText = "position:absolute;left:-20000px;top:0";
  document.body.append(halter);
  const eins = a => new Promise(fertig => {
    const f = document.createElement("iframe");
    f.style.cssText = "width:${BREITE}px;height:${HOEHE}px;border:0";
    f.onload = () => {
      if (${JSON.stringify(modus)} === "dunkel") f.contentDocument.documentElement.dataset.farben = "dunkel";
      setTimeout(() => {
        try { __ko.erg.push({ ...a, ...messeSeite(f.contentDocument, f.contentWindow) }); }
        catch (e) { __ko.erg.push({ ...a, fehler: String(e) }); }
        f.remove(); __ko.fertig++; fertig();
      }, 1500);
    };
    f.src = a.url;
    halter.append(f);
  });
  const auftraege = ${JSON.stringify(auftraege)};
  let i = 0;
  Promise.all(Array.from({ length: 6 }, async () => { while (i < auftraege.length) await eins(auftraege[i++]); }));
  return auftraege.length;`;

async function main() {
  if (!BROWSER) throw new Error("Weder Chrome noch Edge gefunden.");
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), "lernspiele-kontrast-"));
  const browser = spawn(BROWSER, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profil}`,
    "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
  const modi = String(opt.modus).split(",");
  let funde = 0;
  try {
    let version = null;
    for (let i = 0; i < 50 && !version; i++) {
      try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { await warte(200); }
    }
    if (!version) throw new Error("Browser antwortet nicht.");
    const seite = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
    ws = new WebSocket(seite.webSocketDebuggerUrl);
    await new Promise((ok, fehler) => { ws.onopen = ok; ws.onerror = fehler; });
    ws.onmessage = m => {
      const d = JSON.parse(m.data);
      if (d.id && offen.has(d.id)) {
        const o = offen.get(d.id); offen.delete(d.id);
        if (d.error) o.fehler(new Error(`${o.method}: ${d.error.message}`)); else o.ok(d.result);
      }
    };
    await send("Runtime.enable");
    await send("Page.navigate", { url: BASIS + "/eulenpfad/index.html" });
    await warte(2500);
    const abweichung = await js(GEGENPROBE);
    if (abweichung.length) throw new Error(`Gegenprobe der Messung stimmt nicht: ${abweichung.join("; ")}`);
    console.log("Gegenprobe der Messung: 15 Fälle wie erwartet.");
    // Messkind anlegen und alles freigeben (nur in diesem leeren Profil)
    const spiele = await js(`
      const n = LS.neuerSpieler("Messkind", { rolle: "kind", klasse: 3 }) || "Messkind"; LS.setzeSpieler(n);
      for (const s of SPIELE) { LS.setzeSpielFrei(s.id, true); for (const l of LS.spielListen(s.id)) LS.setzeListeFrei(s.id, l.id, true); }
      return SPIELE.map(s => ({ id: s.id, pfad: s.pfad, stufen: s.stufen }));`);
    const apps = String(opt.apps).split(",");
    const stufen = String(opt.stufen).split(",");
    const auftraege = [];
    if (apps.includes("eulenpfad")) {
      if (!nurSpiele.length) for (const tab of ["spiele", "profil", "statistik", "erfolge"])
        auftraege.push({ app: "eulenpfad", id: "startseite", stufe: tab, url: `${BASIS}/eulenpfad/index.html?k=${tab}#${tab}` });
      for (const s of spiele.filter(s => !nurSpiele.length || nurSpiele.includes(s.id))) {
        const url = `${BASIS}/eulenpfad/${s.pfad}`;
        if (stufen.includes("wahl")) auftraege.push({ app: "eulenpfad", id: s.id, stufe: "wahl", url });
        for (const st of stufen.filter(st => st !== "wahl" && s.stufen.includes(st))) auftraege.push({ app: "eulenpfad", id: s.id, stufe: st, url: `${url}?stufe=${st}` });
      }
    }
    if (apps.includes("lernsteig")) {
      if (!nurSpiele.length) auftraege.push({ app: "lernsteig", id: "startseite", stufe: "-", url: `${BASIS}/lernsteig/index.html` });
      for (const u of fs.readdirSync(path.join(WURZEL, "lernsteig", "uebungen")).filter(u => fs.existsSync(path.join(WURZEL, "lernsteig", "uebungen", u, "index.html"))))
        if (!nurSpiele.length || nurSpiele.includes(u)) auftraege.push({ app: "lernsteig", id: u, stufe: "-", url: `${BASIS}/lernsteig/uebungen/${u}/index.html` });
    }
    for (const modus of modi) {
      console.log(`Modus ${modus}: miss ${auftraege.length} Seiten …`);
      // Die Seite wendet beim Start die Einstellung des Geräts an (LS.farbenAnwenden): sie gilt für jeden Modus mit
      await js(`LS.setzeEinstellung("farben", ${JSON.stringify(modus === "dunkel" ? "dunkel" : "hell")}); return true;`);
      await js(MESSEN(auftraege, modus));
      let stand = 0;
      while (stand < auftraege.length) {
        await warte(3000);
        stand = await js("return __ko.fertig");
        process.stdout.write(`\r  ${stand} / ${auftraege.length}`);
      }
      const erg = await js("return __ko.erg");
      console.log("\n");
      funde += auswerten(erg, modus);
      const datei = opt.json || path.join(WURZEL, ".temp", "kontrast", `${modus}.json`);
      fs.mkdirSync(path.dirname(datei), { recursive: true });
      fs.writeFileSync(datei, JSON.stringify(erg, null, 1));
      console.log(`  alle Funde: ${path.relative(WURZEL, datei)}\n`);
    }
  } finally {
    try { ws?.close(); } catch { /* egal */ }
    browser.kill();
    await warte(500);
    try { fs.rmSync(profil, { recursive: true, force: true }); } catch { /* Chrome hält Dateien manchmal noch kurz */ }
  }
  const schluss = funde ? `${funde} Texte unter der Untergrenze.` : "Kein Text unter der Untergrenze.";
  console.log(schluss);
  require("./testausgabe.js").merke("kontrast", schluss); // HK1 a
  if (opt.streng && funde) process.exitCode = 1;
}

/** Zusammenfassung je Seite, nach Zahl der Funde; gibt die Zahl der Funde zurück. */
function auswerten(erg, modus) {
  const fehlerhaft = erg.filter(e => e.fehler);
  for (const e of fehlerhaft) console.log(`  FEHLER ${e.app}/${e.id} ${e.stufe}: ${e.fehler}`);
  const ok = erg.filter(e => !e.fehler);
  const gemessen = ok.reduce((s, e) => s + e.gemessen, 0), unbekannt = ok.reduce((s, e) => s + e.unbekannt, 0);
  // je Spiel: verschiedene Funde über alle Stufen (gleicher Ort, gleiche Farben einmal)
  const jeSpiel = new Map();
  for (const e of ok) {
    const k = `${e.app}/${e.id}`;
    const m = jeSpiel.get(k) || new Map();
    for (const f of e.funde) { const s = `${f.sel}|${f.farbe}|${f.grund}`; if (!m.has(s)) m.set(s, { ...f, stufen: [] }); m.get(s).stufen.push(e.stufe); }
    jeSpiel.set(k, m);
  }
  const alle = [...jeSpiel.values()].reduce((s, m) => s + m.size, 0);
  const mitFund = [...jeSpiel].filter(([, m]) => m.size);
  console.log(`Modus ${modus}: ${ok.length} Seiten, ${gemessen} Texte gemessen (${unbekannt} auf einem Bild, unbekannt), ` +
    `${alle} verschiedene Funde in ${mitFund.length} von ${jeSpiel.size} Spielen und Seiten.`);
  // Häufigste Paare Schrift/Grund über alle Seiten
  const paare = new Map();
  for (const [, m] of jeSpiel) for (const f of m.values()) { const p = `${f.farbe} auf ${f.grund} (${f.verhaeltnis} < ${f.soll})`; paare.set(p, (paare.get(p) || 0) + 1); }
  console.log("  häufigste Paare:");
  for (const [p, n] of [...paare].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`    ${String(n).padStart(4)} × ${p}`);
  console.log("  je Spiel (Zahl der Funde, schlechtester):");
  for (const [k, m] of mitFund.sort((a, b) => b[1].size - a[1].size)) {
    const s = [...m.values()].sort((a, b) => a.verhaeltnis - b.verhaeltnis)[0];
    console.log(`    ${k.padEnd(38)} ${String(m.size).padStart(3)}   ${s.verhaeltnis} ${s.farbe}/${s.grund} „${s.text}“ (${s.sel})`);
  }
  return alle + fehlerhaft.length;
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });

module.exports = { messeSeite };
