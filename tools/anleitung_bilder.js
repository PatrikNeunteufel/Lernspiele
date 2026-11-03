// Nimmt die Bilder für die Anleitungen auf: eulenpfad/anleitung/bilder/*.webp (LERN_Session7).
// Aufruf: node tools/anleitung_bilder.js [Basis-URL, Vorgabe http://localhost:8765]
// Der Server muss das Repo ausliefern (python tools/entwickler_server.py oder python -m http.server 8765).
//
// Chrome läuft ohne Fenster mit einem eigenen, leeren Profil in einem temporären Ordner: Daten im
// eigenen Browser bleiben unberührt, und auf den Bildern stehen nur die Musterkonten „Muster Admin“
// (PIN 1111) und „Muster Kind“ mit erfundenen Beispielrunden. Rahmen mit Nummer markieren, was der
// Text der Anleitung erklärt (rahmen()); gesteuert wird Chrome über das DevTools-Protokoll.
"use strict";
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const BASIS = (process.argv[2] || "http://localhost:8765").replace(/\/$/, "");
const ZIEL = path.join(__dirname, "..", "eulenpfad", "anleitung", "bilder");
const PORT = 9333;
const BROWSER = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(p => fs.existsSync(p));

const warte = ms => new Promise(r => setTimeout(r, ms));
let ws, naechsteId = 1;
const offen = new Map();
const hoerer = [];

function send(method, params = {}) {
  const id = naechsteId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((ok, fehler) => offen.set(id, { ok, fehler, method }));
}

function ereignis(name) {
  return new Promise(ok => hoerer.push({ name, ok }));
}

async function js(code) {
  const r = await send("Runtime.evaluate", { expression: `(async () => { ${code} })()`, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.exception?.description || r.exceptionDetails.text}\n  in: ${code.slice(0, 200)}`);
  return r.result.value;
}

async function groesse(breite, hoehe, mobil = false) {
  await send("Emulation.setDeviceMetricsOverride", { width: breite, height: hoehe, deviceScaleFactor: mobil ? 2 : 1, mobile: mobil });
}

/** Seite laden. Immer über about:blank, damit auch ein Wechsel nur des #Teils neu lädt (sonst kein Ladeereignis). */
async function gehe(adresse, pause = 700) {
  await send("Page.navigate", { url: "about:blank" });
  const geladen = ereignis("Page.loadEventFired");
  await send("Page.navigate", { url: BASIS + adresse });
  await Promise.race([geladen, warte(15000).then(() => { throw new Error(`Laden dauert zu lange: ${adresse}`); })]);
  await warte(pause);
}

/** Text anklicken: erster Knopf oder Link, dessen Text 'text' enthält. */
const klick = text => js(`const k = [...document.querySelectorAll("button, a, summary")].find(e => e.textContent.includes(${JSON.stringify(text)}));
  if (!k) throw new Error("nicht gefunden: " + ${JSON.stringify(text)}); k.click(); await new Promise(r => setTimeout(r, 400));`);

/**
 * Rahmen mit Nummer um Elemente: ziele = [{ text } | { css }], je Ziel ein Rahmen; die Nummer steht
 * oben links. Ein Ziel mit text sucht das kleinste Element, dessen Text ihn enthält.
 */
async function rahmen(ziele) {
  await js(`
    document.querySelectorAll(".anl-rahmen").forEach(e => e.remove());
    const ziele = ${JSON.stringify(ziele)};
    ziele.forEach((z, i) => {
      // nur sichtbare Elemente: ein zugeklapptes Element hätte keine Fläche, der Rahmen stünde im Leeren
      let e = z.css ? [...document.querySelectorAll(z.css)].find(x => x.offsetParent !== null && x.getBoundingClientRect().width > 0) : null;
      if (z.text) {
        const kandidaten = [...document.querySelectorAll("body *")].filter(x => x.offsetParent !== null && x.textContent.includes(z.text) && !x.classList.contains("anl-rahmen"));
        e = kandidaten.filter(x => ![...x.children].some(c => c.textContent.includes(z.text) && c.offsetParent !== null)).sort((a, b) => a.textContent.length - b.textContent.length)[0];
      }
      if (!e && z.wennDa) return; // z. B. 🗣️ nur mit deutscher Stimme; steht darum zuletzt
      if (!e) throw new Error("Rahmen-Ziel fehlt: " + JSON.stringify(z));
      const r = e.getBoundingClientRect();
      const rand = 6;
      const box = document.createElement("div");
      box.className = "anl-rahmen";
      Object.assign(box.style, { position: "absolute", left: (r.left + scrollX - rand) + "px", top: (r.top + scrollY - rand) + "px",
        width: (r.width + 2 * rand) + "px", height: (r.height + 2 * rand) + "px", border: "4px solid #e11d48", borderRadius: "12px",
        boxShadow: "0 0 0 3px rgba(255,255,255,.85)", zIndex: 99999, pointerEvents: "none", boxSizing: "border-box" });
      const nr = document.createElement("div");
      nr.textContent = String(i + 1);
      Object.assign(nr.style, { position: "absolute", left: "-16px", top: "-16px", width: "30px", height: "30px", borderRadius: "50%",
        background: "#e11d48", color: "#fff", font: "800 17px/30px system-ui, sans-serif", textAlign: "center", boxShadow: "0 0 0 3px #fff" });
      box.append(nr);
      document.body.append(box);
    });`);
}

/**
 * Bild aufnehmen: ganze Seite bis maxHoehe, nur der Bereich um ein Element (css), oder ab dem Element
 * mit dem Text 'ab' bis ans Ende seiner Karte.
 */
async function bild(name, { css = null, ab = null, maxHoehe = 1300, rand = 16 } = {}) {
  await warte(250);
  if (ab) {
    await js(`const t = [...document.querySelectorAll("body *")].filter(x => x.offsetParent !== null && x.textContent.includes(${JSON.stringify(ab)}))
        .sort((a, b) => a.textContent.length - b.textContent.length)[0];
      if (!t) throw new Error("Bildbereich fehlt: " + ${JSON.stringify(ab)});
      const k = t.closest(".karte") || document.body;
      const a = document.createElement("div");
      a.id = "anl-ab";
      const rt = t.getBoundingClientRect(), rk = k.getBoundingClientRect();
      Object.assign(a.style, { position: "absolute", left: (rk.left + scrollX) + "px", top: (rt.top + scrollY - 8) + "px", width: rk.width + "px", height: (rk.bottom - rt.top + 8) + "px", pointerEvents: "none" });
      document.body.append(a);`);
    css = "#anl-ab";
  }
  const b = await js(`
    const e = ${JSON.stringify(css)} ? document.querySelector(${JSON.stringify(css)}) : null;
    if (${JSON.stringify(css)} && !e) throw new Error("Bildbereich fehlt: " + ${JSON.stringify(css)});
    if (e) { const r = e.getBoundingClientRect(); return { x: Math.max(0, r.left + scrollX - ${rand}), y: Math.max(0, r.top + scrollY - ${rand}), w: r.width + 2 * ${rand}, h: r.height + 2 * ${rand} }; }
    return { x: 0, y: 0, w: document.documentElement.clientWidth, h: Math.min(document.documentElement.scrollHeight, ${maxHoehe}) };`);
  const r = await send("Page.captureScreenshot", { format: "webp", quality: 82, captureBeyondViewport: true,
    clip: { x: b.x, y: b.y, width: b.w, height: b.h, scale: 1 } });
  fs.writeFileSync(path.join(ZIEL, `${name}.webp`), Buffer.from(r.data, "base64"));
  console.log(`✓ ${name}.webp`);
  await js(`document.querySelectorAll(".anl-rahmen, #anl-ab").forEach(e => e.remove());`);
}

/** Bildbereich #anl-ab über alle sichtbaren Elemente zu css (für bild({ css: "#anl-ab" })). */
const umfasse = css => js(`const es = [...document.querySelectorAll(${JSON.stringify(css)})].filter(x => x.offsetParent !== null);
  if (!es.length) throw new Error("Bildbereich fehlt: " + ${JSON.stringify(css)});
  const rs = es.map(x => x.getBoundingClientRect());
  const l = Math.min(...rs.map(r => r.left)), t = Math.min(...rs.map(r => r.top)), r = Math.max(...rs.map(r => r.right)), b = Math.max(...rs.map(r => r.bottom));
  const a = document.createElement("div");
  a.id = "anl-ab";
  Object.assign(a.style, { position: "absolute", left: (l + scrollX) + "px", top: (t + scrollY) + "px", width: (r - l) + "px", height: (b - t) + "px", pointerEvents: "none" });
  document.body.append(a);`);

/** Karte mit der Überschrift h2 (Anfang des Texts) als #anl-karte markieren. */
const karteMit = h2 => js(`const k = [...document.querySelectorAll(".karte")].find(x => x.querySelector("h2")?.textContent.startsWith(${JSON.stringify(h2)}));
  if (!k) throw new Error("Karte fehlt: " + ${JSON.stringify(h2)}); k.id = "anl-karte";`);

// ---------- Musterdaten ----------

/** Erfundene Runden für Muster Kind über die letzten zwei Wochen (nur für die Bilder der Statistik). */
const BEISPIELRUNDEN = `
  const spiele = [["runden-rutsche", "s3"], ["einmaleins-blitz", "s3"], ["zahlenmauer", "s4"], ["stellen-detektiv", "s3"], ["glace-kombinator", "s2"], ["zahlenstrahl-pfeil", "s2"]];
  const jetzt = Date.now();
  let zufall = 7;
  const z = n => { zufall = (zufall * 9301 + 49297) % 233280; return Math.floor(zufall / 233280 * n); };
  for (let i = 0; i < 26; i++) {
    const [spiel, stufe] = spiele[i % spiele.length];
    const fehler = z(4) === 0 ? 2 : z(3) === 0 ? 1 : 0;
    const tage = 13 - Math.floor(i / 2);
    const zeit = new Date(jetzt - tage * 864e5 - (17 - z(3)) * 36e5 + i * 6e5).toISOString();
    const aufgabenZeiten = Array.from({ length: 8 }, (_, k) => ({ ms: 6000 + z(9000) + k * 300, versuche: k < fehler ? 1 : 0, zeitUm: false, geloest: true,
      ...(spiel === "glace-kombinator" ? { vorgehen: { systematik: ["durcheinander", "geordnet", "streng", "streng"][Math.min(3, Math.floor(i / 6) + z(2))] } } : {}) }));
    const fehlerAufgaben = Array.from({ length: fehler }, () => ({ text: "Beispielaufgabe", loesung: "", versuche: 1, geloest: true }));
    LS.protokolliere({ name: "Muster Kind", zeit, spiel, stufe, sterne: LS.sterneFuer(fehler), fehler, aufgaben: 8, dauer: 90 + z(120), geordnet: true, timer: null, aufgabenZeiten, fehlerAufgaben });
  }`;

/** Erfundene Endlos-Rekorde der drei Musterkinder (Runden-Rutsche), für die Ranglisten. */
const BEISPIELREKORDE = `
  const t = n => new Date(Date.now() - n * 864e5).toISOString();
  const r = (name, stufe, timer, punkte, tage) => LS.speichereRekord({ name, zeit: t(tage), spiel: "runden-rutsche", stufe, timer, punkte, dauer: punkte * 9 });
  r("Muster Kind", "s1", null, 14, 3); r("Muster Kind 2", "s1", null, 21, 2); r("Muster Kind 3", "s1", null, 9, 4);
  r("Muster Kind", "s1", 10, 7, 1); r("Muster Kind 2", "s1", 10, 5, 2); r("Muster Kind 3", "s1", 10, 11, 1);`;

async function einrichten() {
  await js(`localStorage.clear(); sessionStorage.clear();`);
  await gehe("/eulenpfad/index.html");
  await js(`await LS.setzePin("Muster Admin", "1111");
    LS.neuerSpieler("Muster Kind", { rolle: "kind", alter: 10, klasse: 4 });
    LS.neuerSpieler("Muster Kind 2", { rolle: "kind", alter: 9, klasse: 4 });
    LS.neuerSpieler("Muster Kind 3", { rolle: "kind", alter: 11, klasse: 5 });
    LS.speichereProfil("Muster Kind", { lernplan: { tage: 3, minuten: 10 } });
    ${BEISPIELRUNDEN}
    ${BEISPIELREKORDE}
    localStorage.removeItem("lernspiele:spieler");`);
}

const alsAufsicht = () => js(`await LS.meldeAufsichtAn("Muster Admin", "1111");`);
const alsKind = () => js(`LS.abmelden?.(); sessionStorage.clear(); LS.setzeSpieler("Muster Kind");`);

/** Runden-Rutsche Stufe 1 richtig durchspielen (die Lösung rechnet das Skript selbst aus). */
const RUTSCHE_RICHTIG = `
  const STELLE = { Zehner: 10, Hunderter: 100, Tausender: 1000, Zehntausender: 10000, Hunderttausender: 100000, Millionen: 1000000 };
  const zahl = Number(document.querySelector(".zahl-gross").textContent.replace(/\\D/g, ""));
  const auf = STELLE[document.querySelector(".auf b").textContent.trim()];
  const ziel = Math.round(zahl / auf) * auf;
  const k = [...document.querySelectorAll(".ziel")].find(b => Number(b.lastChild.textContent.replace(/\\D/g, "")) === ziel);
  k.click();`;

// ---------- Aufnahmen ----------

async function aufsicht() {
  await groesse(1000, 760);
  // Ganz am Anfang: noch niemand da
  await js(`localStorage.clear(); sessionStorage.clear();`);
  await gehe("/eulenpfad/index.html");
  await klick("Aufsicht einrichten");
  await js(`const f = document.querySelectorAll(".anmeldung input"); f[0].value = "Muster Admin"; f[1].value = "1111";`);
  await rahmen([{ css: ".anmeldung details" }, { text: "Neues Kind" }]);
  await bild("a01-einrichten", { css: ".anmeldung" });

  await einrichten();
  await gehe("/eulenpfad/index.html");
  await rahmen([{ css: ".name-knopf:not(.aufsicht)" }, { css: ".name-knopf.aufsicht" }]);
  await bild("a02-wer-bist-du", { css: ".anmeldung" });

  await klick("Muster Admin");
  await js(`document.querySelector(".anmeldung input").value = "1111";`);
  await rahmen([{ css: ".anmeldung input" }]);
  await bild("a03-pin", { css: ".anmeldung" });

  await alsAufsicht();
  await gehe("/eulenpfad/index.html#spiele");
  await rahmen([{ css: "nav.tabs" }]);
  await bild("a04-tabs", { maxHoehe: 760 });

  await rahmen([{ css: ".filter" }, { css: "input.suche" },{ css: ".spielkarte.zufall" }, { css: ".spielkarte.zufall + .spielkarte.zufall" }]);
  await bild("a16-spiele", { maxHoehe: 1150 });

  await gehe("/eulenpfad/index.html#verwaltung/konten");
  await rahmen([{ css: "nav.untertabs" }, { css: "td:nth-child(3) .zeile-knoepfe" }]);
  await bild("a05-konten", { maxHoehe: 1100 });

  await gehe("/eulenpfad/index.html#verwaltung/freigabe");
  await js(`const d = document.querySelector(".verwaltung details"); if (d) { d.open = true; const i = d.querySelector("details"); if (i) i.open = true; }`);
  await rahmen([{ text: "Alles freigeben" }, { css: ".verwaltung .schalter" }]);
  await bild("a06-freigabe", { maxHoehe: 900 });

  await gehe("/eulenpfad/index.html#verwaltung/abgleich");
  await rahmen([{ text: "Gerät benennen" }, { text: "Ordner wählen" }, { text: "Abgleich-Datei sichern" }]);
  await bild("a07-abgleich", { maxHoehe: 900 });

  await gehe("/eulenpfad/index.html#verwaltung/einstellungen");
  await js(`document.querySelectorAll(".einstellung-spiele").forEach(d => d.open = true);`);
  await rahmen([{ css: ".einstellung .zeile-knoepfe" }, { css: ".einstellung-spiele" }, { text: "Alles auf Standard" }]);
  await bild("a08-einstellungen", { maxHoehe: 1000 });

  await js(`LS.setzeSpieler?.("Muster Kind");`);
  await alsAufsicht();
  await gehe("/eulenpfad/index.html#statistik");
  await js(`[...document.querySelectorAll(".statistik .chip")].find(b => b.textContent.trim() === "Muster Kind").click(); await new Promise(r => setTimeout(r, 400));`);
  await rahmen([{ css: ".statistik .chips" }, { css: ".fazit-kopf" }]);
  await bild("a09-statistik", { maxHoehe: 1300 });
  await karteMit("📅 Lernplan");
  await bild("a17-lernplan", { css: "#anl-karte" });
  await js(`const k = [...document.querySelectorAll(".statistik .karte")].find(x => x.querySelector("h2")?.textContent === "Vorgehen"); k.id = "anl-vorgehen";`);
  await bild("a10-vorgehen", { css: "#anl-vorgehen" });
  await js(`const k = [...document.querySelectorAll(".statistik .karte")].find(x => x.querySelector("h2")?.textContent === "Daten"); k.id = "anl-daten";`);
  await rahmen([{ text: "Alle sichern" }, { text: "Nur Muster Kind sichern" }, { text: "Einlesen" }, { text: "Zurücksetzen" }]);
  await bild("a11-daten", { css: "#anl-daten" });
  await js(`const k = [...document.querySelectorAll(".statistik .karte")].find(x => x.querySelector("h2")?.textContent.includes("Endlos")); k.id = "anl-rekorde";`);
  await bild("a15-rekorde", { css: "#anl-rekorde" });

  await gehe("/eulenpfad/index.html#erfolge");
  await js(`[...document.querySelectorAll(".chip")].find(b => b.textContent.trim() === "Muster Kind")?.click(); await new Promise(r => setTimeout(r, 400));`);
  await rahmen([{ css: ".woche" }, { css: ".abzeichen" }]);
  await bild("a18-erfolge", { maxHoehe: 1000 });

  await gehe("/eulenpfad/spiele/runden-rutsche/index.html");
  await rahmen([{ text: "Timer aus" }, { css: ".stufe" }, { text: "Endlos —" }]);
  await bild("a12-stufenwahl", { maxHoehe: 1100 });
  await rahmen([{ css: ".rangliste" }]);
  await bild("a14-endlos-rangliste", { ab: "Endlos —" });
  await gehe("/eulenpfad/spiele/runden-rutsche/index.html?stufe=s3");
  await rahmen([{ css: ".testhilfe" }]);
  await bild("a13-testhilfe", { maxHoehe: 760 });
}

async function kind() {
  await groesse(390, 844, true);
  await js(`sessionStorage.clear(); localStorage.removeItem("lernspiele:spieler");`);
  await gehe("/eulenpfad/index.html");
  await rahmen([{ css: ".name-knopf:not(.aufsicht)" }]);
  await bild("k01-anmelden", { maxHoehe: 844 });

  await alsKind();
  await gehe("/eulenpfad/index.html#spiele");
  await bild("k02-spiele", { maxHoehe: 1400 });

  await gehe("/eulenpfad/spiele/runden-rutsche/index.html");
  await rahmen([{ css: ".stufe" }]);
  await bild("k03-stufen", { maxHoehe: 1400 });

  await gehe("/eulenpfad/index.html#spiele");
  await umfasse(".spielkarte.zufall");
  await bild("k10-zufall", { css: "#anl-ab" });

  await gehe("/eulenpfad/spiele/runden-rutsche/index.html?stufe=s1");
  await rahmen([{ css: ".zahl-gross" }, { css: ".ziele" }]);
  await bild("k04-aufgabe", { maxHoehe: 480 });
  await rahmen([{ css: ".hilfe-knopf" }, { css: ".tipp-knopf" }, { css: ".melden" }, { css: ".vorlesen", wennDa: true }]);
  await bild("k11-hilfe-tipp", { maxHoehe: 640 });
  // Hinweis der Eule nach einer falschen Antwort
  await js(`${RUTSCHE_RICHTIG.replace("k.click();", "")} [...document.querySelectorAll(".ziel")].find(b => b !== k).click(); await new Promise(r => setTimeout(r, 400));`);
  await rahmen([{ css: ".blase" }]);
  await bild("k05-hinweis", { maxHoehe: 480 });

  // Runde fertig spielen bis zu den Sternen
  for (let i = 0; i < 40; i++) {
    const stand = await js(`return document.querySelector(".schluss") ? "fertig" : document.querySelector(".ziel:not(.richtig)") && !document.querySelector(".ziel.richtig") ? "aufgabe" : "warten";`);
    if (stand === "fertig") break;
    if (stand === "aufgabe") await js(RUTSCHE_RICHTIG);
    await warte(800);
  }
  await warte(1500);
  await bild("k06-sterne", { maxHoehe: 470 });

  await gehe("/eulenpfad/index.html#statistik");
  await bild("k07-statistik", { maxHoehe: 1400 });

  await gehe("/eulenpfad/index.html#erfolge");
  await rahmen([{ css: ".woche" }, { css: ".abzeichen" }]);
  await bild("k12-erfolge", { maxHoehe: 1300 });

  await gehe("/eulenpfad/spiele/runden-rutsche/index.html?stufe=s1&endlos=1");
  for (let geloest = 0; geloest < 3;) {
    const bereit = await js(`return !!document.querySelector(".ziel") && !document.querySelector(".ziel.richtig");`);
    if (bereit) { await js(RUTSCHE_RICHTIG); geloest++; }
    await warte(1300);
  }
  await bild("k08-endlos", { maxHoehe: 480 });
  await js(`${RUTSCHE_RICHTIG.replace("k.click();", "")} [...document.querySelectorAll(".ziel")].find(b => b !== k).click(); await new Promise(r => setTimeout(r, 600));`);
  await klick("Zum Ergebnis");
  await warte(1200);
  await rahmen([{ css: ".rangliste" }]);
  await bild("k09-endlos-ende", { maxHoehe: 480 });
}

async function main() {
  if (!BROWSER) throw new Error("Weder Chrome noch Edge gefunden.");
  fs.mkdirSync(ZIEL, { recursive: true });
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), "eulenpfad-bilder-"));
  const browser = spawn(BROWSER, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profil}`,
    "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--force-color-profile=srgb", "about:blank"], { stdio: "ignore" });
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
      } else if (d.method) {
        for (const h of hoerer.filter(x => x.name === d.method)) { hoerer.splice(hoerer.indexOf(h), 1); h.ok(d.params); }
      }
    };
    await send("Page.enable");
    await send("Runtime.enable");
    await gehe("/eulenpfad/index.html");
    await aufsicht();
    await kind();
    console.log(`\nBilder in ${path.relative(process.cwd(), ZIEL)}`);
  } finally {
    try { ws?.close(); } catch { /* egal */ }
    browser.kill();
    await warte(500);
    try { fs.rmSync(profil, { recursive: true, force: true }); } catch { /* Chrome hält Dateien manchmal noch kurz */ }
  }
}

main().catch(e => { console.error("FEHLER", e.message); process.exitCode = 1; });
