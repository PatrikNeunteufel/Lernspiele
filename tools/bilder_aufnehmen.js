// Nimmt Seiten als Bild auf, je Modus (hell, dunkel) und Breite — zum Ansehen im Darkmode-Umbau (docs/konzept_darkmode.md,
// Schritte 3c bis 6: „je Block im Browser in beiden Modi ansehen“). Ersetzt die Skripte, die in LERN_Session33 dreimal von
// Hand im Scratchpad entstanden (Prüfer-Kandidat im Report).
//
// Aufruf: node tools/bilder_aufnehmen.js <seite …> [Basis-URL, Vorgabe http://localhost:8765]
//         [--modus=hell,dunkel] [--breite=1024,375] [--hoehe=768] [--voll] [--vorher="<js>"] [--warte=1500]
//         [--ziel=.temp/bilder] [--klasse=3] [--port=9336]
// Der Server muss das Repo ausliefern (python tools/server.py 8765).
//
// <seite> ist eine Spiel-Id aus dem Katalog (auch mit „?stufe=s3“), ein Tab der Startseite („start#statistik“) oder ein
// Pfad im Repo („lernsteig/index.html“, „.temp/farbmuster.html“). Chrome ohne Fenster mit eigenem, leerem Profil (wie
// tools/kontrast.js): ein Kind „Bildkind“ mit der Klasse aus --klasse, alle Spiele freigegeben. Der Modus wird dreifach
// gesetzt: Einstellung „farben“ im Eulenpfad, prefers-color-scheme des Geräts (Lernsteig folgt ihm) und — für Seiten ohne
// eigene Einstellung — data-farben an <html> nach dem Laden. Breite unter 768 gilt als Handy (Berührung, Faktor 2).
// --vorher führt nach dem Laden Code in der Seite aus (etwa einen Klick), --voll nimmt die ganze Seite statt des Fensters.
// Bilder: <ziel>/<name>_<modus>_<breite>.png; am Ende die Liste der Dateien.
"use strict";
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const WURZEL = path.join(__dirname, "..");
const opt = { modus: "hell,dunkel", breite: "1024", hoehe: "768", voll: false, vorher: "", warte: "1500", ziel: ".temp/bilder", klasse: "3", port: "9336" };
const seiten = [];
let BASIS = "http://localhost:8765";
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--(\w+)(?:=([\s\S]*))?$/);
  if (m) opt[m[1]] = m[2] ?? true;
  else if (/^https?:/.test(a)) BASIS = a.replace(/\/$/, "");
  else seiten.push(a);
}
const PORT = Number(opt.port);
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
async function lade(url) {
  await send("Page.navigate", { url });
  for (let i = 0; i < 60; i++) {
    await warte(150);
    try { if (await js("return document.readyState") === "complete") return; } catch { /* Seite wechselt noch */ }
  }
}

/** Seite → { name, url }. Spiel-Ids löst der Katalog auf (spiele: [{ id, pfad }]). */
function aufloesen(s, spiele) {
  const [kopf, rest = ""] = s.split(/(?=[?#])/);
  const spiel = spiele.find(x => x.id === kopf);
  const name = s.replace(/[^\w-]+/g, "_").replace(/^_+|_+$/g, "");
  if (spiel) return { name, url: `${BASIS}/eulenpfad/${spiel.pfad}${rest}` };
  if (kopf === "start") { const tab = rest.replace(/^#/, ""); return { name, url: `${BASIS}/eulenpfad/index.html${tab ? `?k=${tab}#${tab}` : ""}` }; }
  if (fs.existsSync(path.join(WURZEL, kopf))) return { name, url: `${BASIS}/${kopf.replace(/\\/g, "/")}${rest}` };
  throw new Error(`Seite unbekannt: ${s} (weder Spiel-Id noch „start“ noch Pfad im Repo)`);
}

async function main() {
  if (!seiten.length) throw new Error("Keine Seite angegeben (Spiel-Id, start#<tab> oder Pfad im Repo).");
  if (!BROWSER) throw new Error("Weder Chrome noch Edge gefunden.");
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), "lernspiele-bilder-"));
  const browser = spawn(BROWSER, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profil}`,
    "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
  const ziel = path.resolve(WURZEL, opt.ziel);
  fs.mkdirSync(ziel, { recursive: true });
  const dateien = [];
  try {
    let version = null;
    for (let i = 0; i < 50 && !version; i++) {
      try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { await warte(200); }
    }
    if (!version) throw new Error("Browser antwortet nicht.");
    const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
    ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((ok, fehler) => { ws.onopen = ok; ws.onerror = fehler; });
    ws.onmessage = m => {
      const d = JSON.parse(m.data);
      if (d.id && offen.has(d.id)) {
        const o = offen.get(d.id); offen.delete(d.id);
        if (d.error) o.fehler(new Error(`${o.method}: ${d.error.message}`)); else o.ok(d.result);
      }
    };
    await send("Runtime.enable");
    await send("Page.enable");
    await lade(BASIS + "/eulenpfad/index.html");
    await warte(800);
    const spiele = await js(`
      const n = LS.neuerSpieler("Bildkind", { rolle: "kind", klasse: ${Number(opt.klasse)} }) || "Bildkind"; LS.setzeSpieler(n);
      for (const s of SPIELE) { LS.setzeSpielFrei(s.id, true); for (const l of LS.spielListen(s.id)) LS.setzeListeFrei(s.id, l.id, true); }
      return SPIELE.map(s => ({ id: s.id, pfad: s.pfad }));`);
    const auftraege = seiten.map(s => aufloesen(s, spiele));
    for (const modus of String(opt.modus).split(",")) {
      await lade(BASIS + "/eulenpfad/index.html");
      await js(`LS.setzeEinstellung("farben", ${JSON.stringify(modus)}); return true;`);
      await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: modus === "dunkel" ? "dark" : "light" }] });
      for (const breite of String(opt.breite).split(",").map(Number)) {
        const handy = breite < 768;
        await send("Emulation.setDeviceMetricsOverride", { width: breite, height: Number(opt.hoehe), deviceScaleFactor: handy ? 2 : 1, mobile: handy });
        await send("Emulation.setTouchEmulationEnabled", handy ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
        for (const a of auftraege) {
          await lade(a.url);
          await js(`const h = document.documentElement; if (!h.dataset.farben || h.dataset.farben !== ${JSON.stringify(modus)}) h.dataset.farben = ${JSON.stringify(modus)}; return true;`);
          if (opt.vorher) await js(String(opt.vorher));
          await warte(Number(opt.warte));
          const aufnahme = { format: "png" };
          if (opt.voll) {
            const { cssContentSize: g } = await send("Page.getLayoutMetrics");
            Object.assign(aufnahme, { captureBeyondViewport: true, clip: { x: 0, y: 0, width: breite, height: Math.ceil(g.height), scale: 1 } });
          }
          const bild = await send("Page.captureScreenshot", aufnahme);
          const datei = path.join(ziel, `${a.name}_${modus}_${breite}.png`);
          fs.writeFileSync(datei, Buffer.from(bild.data, "base64"));
          dateien.push(datei);
          console.log(`  ${path.relative(WURZEL, datei)}`);
        }
      }
    }
  } finally {
    try { ws?.close(); } catch { /* egal */ }
    browser.kill();
    await warte(500);
    try { fs.rmSync(profil, { recursive: true, force: true }); } catch { /* Chrome hält Dateien manchmal noch kurz */ }
  }
  console.log(`${dateien.length} Bilder in ${path.relative(WURZEL, ziel)}.`);
}

if (require.main === module) main().catch(e => { console.error(e.message || e); process.exit(1); });
