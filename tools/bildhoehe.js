// Misst, ob die ganze Aufgabe ohne Scrollen ins Bild passt (Entscheid BH1 a, LERN_Session13).
// Aufruf: node tools/bildhoehe.js [Basis-URL, Vorgabe http://localhost:8765] [spiel-id …]
//         [--stufen=s1,s3,s6] [--geraete=handy,tablet,quer,desktop] [--css=datei.css] [--json=datei.json] [--port=9334]
// Der Server muss das Repo ausliefern (server_starten.bat oder python tools/server.py 8765).
//
// Chrome läuft ohne Fenster mit einem eigenen, leeren Profil (wie tools/anleitung_bilder.js): Ein Messkind wird
// angelegt, alle Spiele und Listen sind für es freigegeben. Je Spiel × Stufe × Gerät lädt ein iframe in der
// Startseite die Stufe; 1,5 s nach dem Laden zählt scrollHeight − Fensterhöhe der ersten Aufgabe. Die Aufgaben
// sind zufällig, die Zahlen schwanken darum um einige Dutzend Pixel. --css setzt zusätzliches CSS in jede Seite
// (zum Ausprobieren, ohne den Code zu ändern). Ende mit Code 1, wenn eine Seite seitlich überläuft.
"use strict";
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const GERAETE = {
  handy: { w: 375, h: 812 },
  tablet: { w: 768, h: 1024 },
  quer: { w: 1024, h: 768 },   // Tablet quer
  desktop: { w: 1366, h: 768 }, // verbreiteter Laptop
  // Sichtbare Fläche im Browser (Adressleiste, Lesezeichen, Taskleiste abgezogen; Hinweis Patrik, LERN_Session13):
  "handy-sicht": { w: 375, h: 660 },    // Handy mit Safari-/Chrome-Leisten
  "tablet-sicht": { w: 768, h: 950 },   // Tablet hoch mit Leisten
  "quer-sicht": { w: 1024, h: 690 },    // Tablet quer mit Leisten
  "laptop-sicht": { w: 1366, h: 650 },  // Laptop 1366 × 768 mit Browserleisten
  "klein-sicht": { w: 1000, h: 500 },   // Laptop mit 200 % Skalierung (Gerät Patrik)
  "klein-voll": { w: 1000, h: 600 },    // dasselbe im Vollbild (ohne Browserleisten)
  // Niedrige Fenster (Entscheid H1 a, LERN_Session28): hier muss nicht alles ins Bild passen, aber keine Grafik darf
  // zusammenschrumpfen (dort wurde sie null, wo die Untergrenze fehlte).
  mix: { w: 1024, h: 460 },             // Spielfenster im Zufallsmix, kleinste Höhe (mix.css)
  "handy-quer": { w: 800, h: 450 },     // Handy quer mit Leisten
};
// Geschrumpfte Grafik (H1 a). Grafik = svg, canvas oder img mit eigener Klasse in der Spielfläche, nicht in Knöpfen, Eule
// mit Sprechblase, Legende, Tipp-Zeile oder Kopf. Gemeldet wird sie, wenn ihre kürzere Seite unter KLEINSTE_GRAFIK liegt
// und ihr Massstab (gezeichnete Breite je Einheit der viewBox, bei img je Pixel des Bildes) unter der Hälfte des kleinsten
// Massstabs derselben Klasse im selben Spiel und derselben Stufe auf dem Vergleichsgerät. Der Massstab hängt nicht vom
// Inhalt ab (eine lange Notenzeile ist flach, aber nicht geschrumpft); Grafiken, die schon dort klein sind (Nordpfeil),
// bleiben ruhig. Fehlt der Vergleich (Zufallsaufgabe, Grafik ohne viewBox), zählt nur ZUSAMMENGEFALLEN. Das
// Vergleichsgerät wird bei jedem Lauf mitgemessen.
const KLEINSTE_GRAFIK = 100;
const ZUSAMMENGEFALLEN = 40;
const VERGLEICH = "quer";
const opt = { stufen: "s1,s3,s6", geraete: "handy,tablet,quer,desktop", css: null, json: null, port: "9334" }; // --port: eigener Chrome je Lauf, wenn mehrere zugleich messen
const nurSpiele = [];
let BASIS = "http://localhost:8765";
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--(\w+)=(.*)$/);
  if (m) opt[m[1]] = m[2];
  else if (/^https?:/.test(a)) BASIS = a.replace(/\/$/, "");
  else nurSpiele.push(a);
}
const CSS = opt.css ? fs.readFileSync(opt.css, "utf8") : "";
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

/** Läuft in der Startseite: misst alle Aufträge mit 8 iframes zugleich, schreibt den Stand nach window.__bh. */
const MESSEN = (auftraege, css) => `
  window.__bh = { fertig: 0, erg: [] };
  const halter = document.createElement("div");
  halter.style.cssText = "position:absolute;left:-20000px;top:0";
  document.body.append(halter);
  const eins = a => new Promise(fertig => {
    const f = document.createElement("iframe");
    f.style.cssText = "width:" + a.w + "px;height:" + a.h + "px;border:0";
    f.onload = () => {
      if (${JSON.stringify(css)}) { const s = f.contentDocument.createElement("style"); s.textContent = ${JSON.stringify(css)}; f.contentDocument.head.append(s); }
      setTimeout(() => {
        try {
          const d = f.contentDocument, se = d.scrollingElement, t = d.querySelector(".tastatur");
          __bh.erg.push({ ...a, ueber: se.scrollHeight - a.h, seitlich: se.scrollWidth - a.w,
            gesperrt: /noch nicht freigegeben|erst anmelden/i.test(d.body.innerText), tastatur: !!t,
            // Liegt die Zifferntastatur ganz im Bild (ohne zu scrollen)?
            tastaturImBild: t ? t.getBoundingClientRect().bottom <= a.h + 1 : null,
            // Grafiken der Aufgabe (H1 a): je [Breite, Höhe, Klasse, Massstab oder null]
            grafiken: (() => {
              const k = d.querySelector(".karte");
              if (!k) return [];
              return [...k.querySelectorAll("svg[class], canvas[class], img[class]")]
                .filter(x => !x.closest("button, .blase, .eule-zeile, .legende, .tipp-zeile, .kopf, .wahl, label") && !x.parentElement.closest("svg"))
                .filter(x => f.contentWindow.getComputedStyle(x).display !== "none")
                .map(x => {
                  const r = x.getBoundingClientRect();
                  const eigen = x.viewBox?.baseVal?.width || x.naturalWidth || 0;
                  // Schlüssel aus allen Klassen: .rose.klein ist bewusst klein, .rose nicht (Kompass)
                  return [Math.round(r.width), Math.round(r.height), x.tagName.toLowerCase() + "." + x.getAttribute("class").trim().split(/\s+/).sort().join("."),
                    eigen ? Math.round(r.width / eigen * 1000) / 1000 : null];
                });
            })(),
            // Die Aufgabe selbst: unterer Rand der Spielfläche ohne die Tipp-Zeile darunter
            aufgabe: (() => {
              const k = d.querySelector(".karte");
              if (!k) return 0;
              const teile = [...k.querySelectorAll(":scope > *")].filter(x => !x.classList.contains("tipp-zeile"));
              return Math.round(Math.max(0, ...teile.map(x => x.getBoundingClientRect().bottom)) - a.h);
            })() });
        } catch (e) { __bh.erg.push({ ...a, fehler: String(e) }); }
        f.remove(); __bh.fertig++; fertig();
      }, 1500);
    };
    f.src = a.pfad + "?stufe=" + a.stufe;
    halter.append(f);
  });
  const auftraege = ${JSON.stringify(auftraege)};
  let i = 0;
  Promise.all(Array.from({ length: 8 }, async () => { while (i < auftraege.length) await eins(auftraege[i++]); }));
  return auftraege.length;`;

async function main() {
  if (!BROWSER) throw new Error("Weder Chrome noch Edge gefunden.");
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), "eulenpfad-bildhoehe-"));
  const browser = spawn(BROWSER, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profil}`,
    "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
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
    // Messkind anlegen und alles freigeben (nur in diesem leeren Profil)
    const spiele = await js(`
      const n = LS.neuerSpieler("Messkind") || "Messkind"; LS.setzeSpieler(n);
      for (const s of SPIELE) { LS.setzeSpielFrei(s.id, true); for (const l of LS.spielListen(s.id)) LS.setzeListeFrei(s.id, l.id, true); }
      return SPIELE.map(s => ({ id: s.id, pfad: s.pfad, stufen: s.stufen }));`);
    const stufen = opt.stufen.split(",");
    const geraete = opt.geraete.split(",").filter(g => GERAETE[g]);
    if (!geraete.includes(VERGLEICH)) geraete.push(VERGLEICH); // Vergleich für geschrumpfte Grafiken (H1 a)
    const auftraege = [];
    for (const s of spiele.filter(s => !nurSpiele.length || nurSpiele.includes(s.id)))
      for (const stufe of stufen.filter(st => s.stufen.includes(st)))
        for (const g of geraete) auftraege.push({ id: s.id, pfad: s.pfad, stufe, geraet: g, ...GERAETE[g] });
    console.log(`Miss ${auftraege.length} Seiten (${geraete.join(", ")}; Stufen ${stufen.join(" ")})${CSS ? " mit " + opt.css : ""} …`);
    await js(MESSEN(auftraege, CSS));
    let stand = 0;
    while (stand < auftraege.length) {
      await warte(3000);
      stand = await js("return __bh.fertig");
      process.stdout.write(`\r  ${stand} / ${auftraege.length}`);
    }
    const erg = await js("return __bh.erg");
    console.log("\n");
    auswerten(erg, geraete, stufen);
    if (opt.json) fs.writeFileSync(opt.json, JSON.stringify(erg, null, 1));
    if (erg.some(e => e.seitlich > 2)) process.exitCode = 1;
  } finally {
    try { ws?.close(); } catch { /* egal */ }
    browser.kill();
    await warte(500);
    try { fs.rmSync(profil, { recursive: true, force: true }); } catch { /* Chrome hält Dateien manchmal noch kurz */ }
  }
}

/** Die geschrumpfte Grafik einer Seite (H1 a) oder null; vergleich: Map "id/stufe/klasse" → kleinster Massstab auf VERGLEICH. */
function geschrumpft(e, vergleich) {
  for (const [w, h, klasse, mass] of e.grafiken || []) {
    if (Math.min(w, h) >= KLEINSTE_GRAFIK) continue;
    const soll = vergleich.get(`${e.id}/${e.stufe}/${klasse}`);
    if (soll === undefined || mass === null ? Math.min(w, h) < ZUSAMMENGEFALLEN : mass < soll / 2) return { w, h, klasse, mass, soll };
  }
  return null;
}

function auswerten(erg, geraete, stufen) {
  const vergleich = new Map();
  for (const e of erg.filter(e => e.geraet === VERGLEICH))
    for (const [, , klasse, mass] of e.grafiken || []) {
      if (!mass) continue;
      const k = `${e.id}/${e.stufe}/${klasse}`;
      vergleich.set(k, Math.min(vergleich.get(k) ?? Infinity, mass));
    }
  const zuKlein = e => geschrumpft(e, vergleich);
  const gesperrt = erg.filter(e => e.gesperrt || e.fehler);
  if (gesperrt.length) console.log(`Nicht gemessen (gesperrt oder Fehler): ${[...new Set(gesperrt.map(e => e.id))].join(", ")}\n`);
  const zaehlbar = erg.filter(e => !e.gesperrt && !e.fehler);
  for (const g of geraete) {
    const alle = zaehlbar.filter(e => e.geraet === g);
    const ueber = alle.filter(e => e.ueber > 2);
    const max = Math.max(0, ...alle.map(e => e.ueber));
    console.log(`${g.padEnd(12)} ${GERAETE[g].w}×${GERAETE[g].h}: ${ueber.length} von ${alle.length} Seiten laufen unten über, ` +
      `${new Set(ueber.map(e => e.id)).size} Spiele, höchstens ${max} px; seitlich: ${alle.filter(e => e.seitlich > 2).length}; ` +
      `Zifferntastatur nicht ganz im Bild: ${alle.filter(e => e.tastaturImBild === false).length} von ${alle.filter(e => e.tastatur).length}; ` +
      `Aufgabe selbst (ohne Tipp-Zeile) über: ${alle.filter(e => e.aufgabe > 2).length} Seiten, ${new Set(alle.filter(e => e.aufgabe > 2).map(e => e.id)).size} Spiele; ` +
      `Grafik geschrumpft: ${alle.filter(zuKlein).length} Seiten`);
  }
  // H1 a: Grafiken, die nach der Bildhöhe zusammenschrumpfen — je Seite mit Grösse, Klasse und Vergleich; Code 1
  const klein = zaehlbar.filter(zuKlein);
  if (klein.length) {
    console.log(`\nGrafik geschrumpft (H1 a: unter ${KLEINSTE_GRAFIK} px und Massstab unter der Hälfte von ${VERGLEICH}, ohne Vergleich unter ${ZUSAMMENGEFALLEN} px):`);
    for (const e of klein) {
      const g = zuKlein(e);
      console.log(`  ${e.id.padEnd(24)} ${e.stufe} ${e.geraet.padEnd(12)} ${g.klasse} ${g.w} × ${g.h}` +
        (g.soll === undefined || g.mass === null ? " (ohne Vergleich)" : ` (Massstab ${g.mass}, ${VERGLEICH}: ${g.soll})`));
    }
    process.exitCode = 1;
  }
  const je = new Map();
  for (const e of zaehlbar.filter(e => e.ueber > 2 || e.seitlich > 2)) {
    const z = je.get(e.id) || { id: e.id, tastatur: false };
    z[e.geraet + "/" + e.stufe] = e.ueber;
    z.tastatur ||= e.tastatur;
    je.set(e.id, z);
  }
  if (!je.size) return console.log("\nAlle Aufgaben passen ins Bild.");
  if (geraete.length > 4) return console.log("\n(Mehr als vier Geräte: Tabelle je Spiel weggelassen, die Zahlen stehen in --json.)");
  const zeilen = [...je.values()].sort((a, b) => Math.max(...geraete.flatMap(g => stufen.map(s => b[g + "/" + s] || 0)))
    - Math.max(...geraete.flatMap(g => stufen.map(s => a[g + "/" + s] || 0))));
  console.log("\nÜberlauf in px je Gerät (Stufen " + stufen.join("/") + "; — passt):\n");
  console.log("Spiel".padEnd(24) + geraete.map(g => g.padEnd(18)).join("") + "Tastatur");
  for (const z of zeilen) {
    console.log(z.id.padEnd(24) + geraete.map(g => stufen.map(s => (z[g + "/" + s] > 2 ? String(z[g + "/" + s]) : "—")).join("/").padEnd(18)).join("")
      + (z.tastatur ? "ja" : ""));
  }
}

main().catch(e => { console.error("FEHLER", e.message); process.exitCode = 1; });
