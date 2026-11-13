// Nimmt die Bilder für die Anleitungen auf: eulenpfad/anleitung/bilder/<name>-<fassung>.webp (LERN_Session7,
// neu aufgebaut LERN_Session37 nach docs/eulenpfad/konzept_anleitungen.md, AL3 a, AL4 a, AL7 a).
// Aufruf: node tools/anleitung_bilder.js [Basis-URL, Vorgabe http://localhost:8765] [--fassung=breit|schmal]
// Der Server muss das Repo ausliefern (python tools/entwickler_server.py oder python -m http.server 8765).
//
// Chrome läuft ohne Fenster mit einem eigenen, leeren Profil in einem temporären Ordner: Daten im
// eigenen Browser bleiben unberührt, und auf den Bildern stehen nur die Musterkonten „Muster Admin“
// (PIN 1111) und „Muster Kind“ mit erfundenen Beispielrunden. Gesteuert wird Chrome über das DevTools-Protokoll.
//
// Jedes Bild gibt es in zwei Fassungen (AL7 a): breit (816 px, so breit wie die Karte der Anleitung, also 1 : 1; der
// Aufbau der App über 560 px wie auf dem Tablet) und schmal (390 px, Handy, Faktor 2). Rahmen mit Nummer markieren, was
// die Legende neben dem Bild beschreibt: Jedes Ziel hat einen Schlüssel, die Nummer folgt der Lage (Lesereihenfolge,
// AL4 a). Das Bild ist der Ausschnitt um die Rahmen (AL3 a). Je Bild und Fassung stehen Schlüssel, Grösse und
// Fingerabdruck in docs/eulenpfad/anleitung_rahmen.json; tools/pruefe_skripte.js prüft damit die Legenden (AL5 a).
"use strict";
const { spawn } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");

const argumente = process.argv.slice(2);
const BASIS = (argumente.find(a => !a.startsWith("--")) || "http://localhost:8765").replace(/\/$/, "");
const NUR_FASSUNG = argumente.find(a => a.startsWith("--fassung="))?.split("=")[1] || null;
const ZIEL = path.join(__dirname, "..", "eulenpfad", "anleitung", "bilder");
const RAHMEN_DATEI = path.join(__dirname, "..", "docs", "eulenpfad", "anleitung_rahmen.json");
const PORT = 9333;
const BROWSER = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(p => fs.existsSync(p));

/** Fassungen (AL7 a): Fensterbreite und -höhe in CSS-px, Faktor der Bildpunkte, Handy-Gerät. */
const FASSUNGEN = {
  breit: { breite: 816, hoehe: 1000, faktor: 1, mobil: false },
  schmal: { breite: 390, hoehe: 844, faktor: 2, mobil: true },
};
/** Ausschnitt um die Rahmen: Rand oben und unten, Höhe höchstens (CSS-px; AL3 a). */
const AUSSCHNITT_RAND = 28, AUSSCHNITT_MAX = 900;

const warte = ms => new Promise(r => setTimeout(r, ms));
let ws, naechsteId = 1;
const offen = new Map();
const hoerer = [];
let fassung = "breit";
/** Schlüssel und Lage der Rahmen, die gerade auf der Seite stehen (für bild()). */
let rahmenJetzt = null;
/** Liste der Rahmen: { <bild>: { <fassung>: { schluessel, breite, hoehe, fingerabdruck } } } */
const liste = fs.existsSync(RAHMEN_DATEI) ? JSON.parse(fs.readFileSync(RAHMEN_DATEI, "utf8")).bilder : {};
const aufgenommen = new Set();

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

/** Fenster auf die Grösse der aktuellen Fassung setzen; hoehe weicht davon ab, wo ein Bild mehr Fenster braucht. */
async function groesse(hoehe = FASSUNGEN[fassung].hoehe) {
  const f = FASSUNGEN[fassung];
  await send("Emulation.setDeviceMetricsOverride", { width: f.breite, height: hoehe, deviceScaleFactor: f.faktor, mobile: f.mobil });
}

/** Seite laden. Immer über about:blank, damit auch ein Wechsel nur des #Teils neu lädt (sonst kein Ladeereignis). */
async function gehe(adresse, pause = 700) {
  // Erst about:blank fertig laden: sonst beendet sein Ladeereignis das Warten auf die Seite, und der nächste Befehl
  // läuft noch auf der leeren Seite (kein localStorage, LERN_Session36)
  const leer = ereignis("Page.loadEventFired");
  await send("Page.navigate", { url: "about:blank" });
  await Promise.race([leer, warte(3000)]);
  const geladen = ereignis("Page.loadEventFired");
  await send("Page.navigate", { url: BASIS + adresse });
  await Promise.race([geladen, warte(15000).then(() => { throw new Error(`Laden dauert zu lange: ${adresse}`); })]);
  if (!(await js(`return location.href.startsWith(${JSON.stringify(BASIS)});`))) throw new Error(`Seite nicht geladen: ${adresse}`);
  rahmenJetzt = null;
  await warte(pause);
}

/** Text anklicken: erster Knopf oder Link, dessen Text 'text' enthält. */
const klick = text => js(`const k = [...document.querySelectorAll("button, a, summary")].find(e => e.textContent.includes(${JSON.stringify(text)}));
  if (!k) throw new Error("nicht gefunden: " + ${JSON.stringify(text)}); k.click(); await new Promise(r => setTimeout(r, 400));`);

/**
 * Rahmen mit Nummer um Elemente: ziele = [{ id, text } | { id, css }], je Ziel ein Rahmen. Ein Ziel mit text sucht
 * das kleinste Element, dessen Text ihn enthält; wennDa: fehlt das Element, entfällt der Rahmen. Die Nummer folgt der
 * Lage (AL4 a): Zeilen von oben nach unten — zwei Rahmen stehen in einer Zeile, wenn sie sich in der Höhe mindestens zur
 * Hälfte des kleineren überdecken —, in der Zeile von links nach rechts. Ergebnis: die Schlüssel in dieser Reihenfolge.
 */
async function rahmen(ziele) {
  const ids = ziele.map(z => z.id);
  if (ids.some(id => !id) || new Set(ids).size !== ids.length) throw new Error("Rahmen ohne oder mit doppeltem Schlüssel: " + JSON.stringify(ids));
  rahmenJetzt = await js(`
    document.querySelectorAll(".anl-rahmen").forEach(e => e.remove());
    const ziele = ${JSON.stringify(ziele)};
    const funde = [];
    for (const z of ziele) {
      // nur sichtbare Elemente: ein zugeklapptes Element hätte keine Fläche, der Rahmen stünde im Leeren
      let e = z.css ? [...document.querySelectorAll(z.css)].find(x => x.offsetParent !== null && x.getBoundingClientRect().width > 0) : null;
      if (z.text) {
        const kandidaten = [...document.querySelectorAll("body *")].filter(x => x.offsetParent !== null && x.textContent.includes(z.text) && !x.classList.contains("anl-rahmen"));
        e = kandidaten.filter(x => ![...x.children].some(c => c.textContent.includes(z.text) && c.offsetParent !== null)).sort((a, b) => a.textContent.length - b.textContent.length)[0];
        e = e?.closest("button") || e; // ein Knopf ganz, nicht nur seine Schrift
      }
      // Nur der sichtbare Teil: ein Element in einem Scrollbereich (Notizblock auf dem Handy) kann darunter verdeckt
      // liegen; dann stünde der Rahmen über etwas anderem (LERN_Session37)
      let r = e?.getBoundingClientRect();
      for (let a = e?.parentElement; r && a && a !== document.body; a = a.parentElement) {
        if (!/(auto|scroll|hidden)/.test(getComputedStyle(a).overflowY)) continue;
        const k = a.getBoundingClientRect();
        const top = Math.max(r.top, k.top), bottom = Math.min(r.bottom, k.bottom);
        r = bottom - top > 4 ? new DOMRect(r.left, top, r.width, bottom - top) : null;
      }
      if (!r && z.wennDa) continue; // z. B. 🗣️ nur mit deutscher Stimme
      if (!r) throw new Error("Rahmen-Ziel fehlt oder ist verdeckt: " + JSON.stringify(z));
      funde.push({ id: z.id, e, r });
    }
    // Lesereihenfolge
    const nachOben = [...funde].sort((a, b) => a.r.top - b.r.top);
    const zeilen = [];
    for (const f of nachOben) {
      const zeile = zeilen.find(z => z.some(g => Math.min(g.r.bottom, f.r.bottom) - Math.max(g.r.top, f.r.top) >= 0.5 * Math.min(g.r.height, f.r.height)));
      if (zeile) zeile.push(f); else zeilen.push([f]);
    }
    const reihe = zeilen.flatMap(z => z.sort((a, b) => a.r.left - b.r.left));
    const rand = 6;
    reihe.forEach(({ e, r }, i) => {
      // Ein offener Dialog liegt über allem (top layer): Rahmen gehören dann in den Dialog, sonst lägen sie dahinter
      // (Prüfansicht, LERN_Session36). Lage relativ zum Dialog und seinem Scrollstand.
      const wurzel = e.closest("dialog[open]") || document.body;
      const d = wurzel === document.body ? null : wurzel.getBoundingClientRect();
      const bx = d ? -d.left + wurzel.scrollLeft - wurzel.clientLeft : scrollX, by = d ? -d.top + wurzel.scrollTop - wurzel.clientTop : scrollY;
      const box = document.createElement("div");
      box.className = "anl-rahmen";
      Object.assign(box.style, { position: "absolute", left: (r.left + bx - rand) + "px", top: (r.top + by - rand) + "px",
        width: (r.width + 2 * rand) + "px", height: (r.height + 2 * rand) + "px", border: "4px solid #e11d48", borderRadius: "12px",
        boxShadow: "0 0 0 3px rgba(255,255,255,.85)", zIndex: 99999, pointerEvents: "none", boxSizing: "border-box" });
      const nr = document.createElement("div");
      nr.textContent = String(i + 1);
      Object.assign(nr.style, { position: "absolute", left: "-16px", top: "-16px", width: "30px", height: "30px", borderRadius: "50%",
        background: "#e11d48", color: "#fff", font: "800 17px/30px system-ui, sans-serif", textAlign: "center", boxShadow: "0 0 0 3px #fff" });
      box.append(nr);
      wurzel.append(box);
    });
    return { ids: reihe.map(f => f.id), oben: Math.min(...reihe.map(f => f.r.top + scrollY)) - rand - 16,
      unten: Math.max(...reihe.map(f => f.r.bottom + scrollY)) + rand };`);
  return rahmenJetzt.ids;
}

/**
 * Bild aufnehmen (AL3 a). Bereich: das Element css; ab dem Element mit dem Text 'ab' bis ans Ende seiner Karte; sonst
 * mit Rahmen die ganze Breite vom obersten bis zum untersten Rahmen mit Rand (höchstens AUSSCHNITT_MAX hoch, ist der
 * Bereich der Rahmen höher, wird er ganz genommen und gemeldet); ohne Rahmen die Seite von oben bis maxHoehe.
 */
async function bild(name, { css = null, ab = null, maxHoehe = AUSSCHNITT_MAX, rand = 16, imFenster = false,
  randOben = AUSSCHNITT_RAND, randUnten = AUSSCHNITT_RAND } = {}) {
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
  const um = rahmenJetzt && rahmenJetzt.ids.length && !css ? rahmenJetzt : null;
  const b = await js(`
    const css = ${JSON.stringify(css)}, um = ${JSON.stringify(um)};
    const e = css ? document.querySelector(css) : null;
    if (css && !e) throw new Error("Bildbereich fehlt: " + css);
    const breite = document.documentElement.clientWidth, hoch = document.documentElement.scrollHeight;
    if (e) { const r = e.getBoundingClientRect(); return { x: Math.max(0, r.left + scrollX - ${rand}), y: Math.max(0, r.top + scrollY - ${rand}), w: Math.min(r.width + 2 * ${rand}, breite), h: r.height + 2 * ${rand} }; }
    if (um) {
      // Kanten nie mitten durch eine Textzeile: liegt eine Zeile auf der Kante, rückt die Kante über sie hinaus
      // (oben nach oben, unten nach unten), bis keine mehr darauf liegt
      const zeilen = [];
      const gang = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = gang.nextNode(); n; n = gang.nextNode()) {
        // Text in Auswahlfeldern zählt nicht: <option> meldet Flächen der ganzen aufgeklappten Liste
        if (!n.textContent.trim() || !n.parentElement || n.parentElement.offsetParent === null || n.parentElement.closest(".anl-rahmen, select, option, script, style")) continue;
        const r = document.createRange(); r.selectNodeContents(n);
        for (const z of r.getClientRects()) if (z.height > 0 && z.width > 0) zeilen.push([z.top + scrollY, z.bottom + scrollY]);
      }
      // Bilder, Knöpfe und Felder ebenso nie anschneiden
      for (const el of document.querySelectorAll("img, svg, button, input, select, textarea")) {
        if (el.offsetParent === null || el.closest(".anl-rahmen")) continue;
        const z = el.getBoundingClientRect();
        if (z.height > 0 && z.width > 0) zeilen.push([z.top + scrollY, z.bottom + scrollY]);
      }
      // die nächste Lücke zwischen Zeilen, höchstens 120 px weit (oben nach oben, unten nach unten); ohne Lücke bleibt
      // die Kante, wo sie ist
      const frei = p => !zeilen.some(([o, u]) => o - 2 < p && p < u + 2 && u - o < 80);
      // Ohne Lücke dort (langer Absatz) in die andere Richtung, aber nie über den Rahmen hinaus
      const schiebe = (start, richtung, grenze) => {
        for (let d = 0; d <= 120; d += 2) if (frei(start + richtung * d)) return start + richtung * d;
        for (let p = start; richtung < 0 ? p < grenze : p > grenze; p -= richtung * 2) if (frei(p)) return p;
        return start;
      };
      let y = Math.max(0, schiebe(um.oben - ${randOben}, -1, um.oben)), unten = Math.min(hoch, schiebe(um.unten + ${randUnten}, 1, um.unten));
      return { x: 0, y, w: breite, h: unten - y, zuHoch: unten - y > ${maxHoehe} };
    }
    return { x: 0, y: 0, w: breite, h: Math.min(hoch, ${maxHoehe}) };`);
  if (b.zuHoch) console.log(`  Hinweis: Rahmen von ${name} (${fassung}) reichen über ${Math.round(b.h)} px, mehr als ${maxHoehe}`);
  // imFenster: nur das Fenster aufnehmen — sonst vergrössert Chrome es auf die ganze Seite, und was unten am Fenster
  // festsitzt (Notizblock), rutscht ans Seitenende (LERN_Session15)
  // Über das Fenster hinaus: das Fenster bis ans Ende des Ausschnitts verlängern, ohne zu scrollen — der Himmel im
  // Hintergrund ist fest (background-attachment: fixed) und endete sonst nach einer Fensterhöhe mitten im Bild; nach
  // einem Scrollen läge die festsitzende Kopfzeile oben über dem Ausschnitt
  const bisUnten = Math.ceil(b.y + b.h), laenger = !imFenster && bisUnten > FASSUNGEN[fassung].hoehe;
  if (laenger) { await groesse(bisUnten); await js(`scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));`); }
  const r = await send("Page.captureScreenshot", { format: "webp", quality: 82, captureBeyondViewport: !imFenster,
    clip: { x: b.x, y: b.y, width: b.w, height: b.h, scale: 1 } });
  if (laenger) await groesse();
  const daten = Buffer.from(r.data, "base64");
  fs.writeFileSync(path.join(ZIEL, `${name}-${fassung}.webp`), daten);
  liste[name] ??= {};
  // Schlüssel auch bei einem Ausschnitt nach Element (css): die Rahmen stehen dann darin
  const ids = rahmenJetzt?.ids || [];
  liste[name][fassung] = { schluessel: ids, breite: Math.round(b.w), hoehe: Math.round(b.h),
    fingerabdruck: crypto.createHash("sha256").update(daten).digest("hex").slice(0, 16) };
  aufgenommen.add(`${name}-${fassung}`);
  console.log(`✓ ${name}-${fassung}.webp  ${Math.round(b.w)} × ${Math.round(b.h)}${ids.length ? "  " + ids.join(", ") : ""}`);
  await js(`document.querySelectorAll(".anl-rahmen, #anl-ab").forEach(e => e.remove());`);
  rahmenJetzt = null;
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
    // je Aufgabe ein Eintrag wie von KERN.runde.lauf (RA4 a): mit Fehlversuch dazu text, loesung, eingaben
    const liste = Array.from({ length: 8 }, (_, k) => ({ ms: 6000 + z(9000) + k * 300, versuche: k < fehler ? 1 : 0, geloest: true,
      ...(k < fehler ? { text: "Beispielaufgabe", loesung: "", eingaben: [] } : {}),
      ...(spiel === "glace-kombinator" ? { vorgehen: { systematik: ["durcheinander", "geordnet", "streng", "streng"][Math.min(3, Math.floor(i / 6) + z(2))] } } : {}) }));
    LS.protokolliere({ name: "Muster Kind", zeit, inhalt: spiel, stufe, sterne: LS.sterneFuer(fehler), fehler, aufgaben: 8, gezeigt: 0, dauer: 90 + z(120), geordnet: true, timer: null, liste });
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
    LS.neuerSpieler("Muster Kind", { rolle: "kind", geboren: "2016-05", klasse: 4 });
    LS.neuerSpieler("Muster Kind 2", { rolle: "kind", geboren: "2017-02", klasse: 4 });
    LS.neuerSpieler("Muster Kind 3", { rolle: "kind", geboren: "2015-09", klasse: 5 });
    LS.speichereProfil("Muster Kind", { lernplan: { tage: 3, minuten: 10 }, avatar: "fuchs-tuerkis" });
    LS.speichereProfil("Muster Kind 2", { avatar: "panda-gelb" });
    LS.speichereProfil("Muster Kind 3", { avatar: "frosch-lila" });
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

/**
 * Hebel-Wippe Stufe 4 mit offenem Notizblock (LERN_Session15): 24 × 3 untereinander, das Kind hat 72 geschrieben,
 * darunter „Weiterrechnen“ mit Plus — die 72 steht schon oben, dazu 45. Das Spiel ist für das Musterkind freigegeben.
 */
async function notizblockZeigen() {
  await js(`const f = LS.lies("freigabe", {}); f.spiele = { ...(f.spiele || {}), "hebel-wippe": true }; LS.schreibe("freigabe", f);`);
  await gehe("/eulenpfad/spiele/hebel-wippe/index.html?stufe=s4");
  await js(`document.querySelector(".nb-knopf").click();
    const p = document.querySelector(".notizblock"), k = t => [...p.querySelectorAll("button")].find(b => b.textContent.trim() === t);
    p.querySelector('[data-vorlage="×"]').click();
    let z = p.querySelectorAll(".nb-zahl"); z[0].value = "24"; z[1].value = "3"; k("Untereinander schreiben ➜").click();
    const erg = [...p.querySelectorAll(".nb-feld.erg")], ue = [...p.querySelectorAll(".nb-feld.uebertrag")];
    erg.at(-1).value = "2"; ue.at(-2).value = "1"; erg.at(-2).value = "7";
    p.querySelector('[data-vorlage="+"]').click();
    z = p.querySelectorAll(".nb-zahl"); z[1].value = "45"; k("Untereinander schreiben ➜").click();
    document.activeElement.blur(); scrollTo(0, 0);
    const inhalt = p.querySelector(".nb-inhalt"), neu = p.querySelector(".nb-schritt + .nb-schritt");
    inhalt.scrollTop = neu.getBoundingClientRect().top - inhalt.getBoundingClientRect().top + inhalt.scrollTop - 8; /* die neue Rechnung oben im Block */
    // Reicht der Block nicht bis „Weiterrechnen“ (Handy), so weit hinunter, dass es unten ganz zu sehen ist
    const wahl = p.querySelector(".nb-wahl"), unten = wahl.getBoundingClientRect().bottom - inhalt.getBoundingClientRect().bottom;
    if (unten > 0) inhalt.scrollTop += unten + 8;`);
}

// ---------- Aufnahmen ----------
// Je Bild: Ziele mit Schlüssel (die Legende in der Anleitung nennt dieselben, data-ziel), dann bild().

async function aufsicht() {
  await groesse();
  // Ganz am Anfang: noch niemand da
  await js(`localStorage.clear(); sessionStorage.clear();`);
  await gehe("/eulenpfad/index.html");
  // „🐣 Ich bin neu“ fragt Kind oder erwachsen (KR1 a, KR2 a, LERN_Session13)
  await klick("Ich bin neu");
  await rahmen([{ id: "erwachsen", text: "Ich bin erwachsen" }, { id: "kind", text: "Ich bin ein Kind" }]);
  await bild("a01-einrichten");

  await einrichten();
  await gehe("/eulenpfad/index.html");
  await rahmen([{ id: "kind", css: ".name-knopf:not(.aufsicht)" }, { id: "aufsicht", css: ".name-knopf.aufsicht" }]);
  await bild("a02-wer-bist-du");

  await klick("Muster Admin");
  await js(`document.querySelector(".anmeldung input").value = "1111";`);
  await rahmen([{ id: "pin", css: ".anmeldung input" }]);
  await bild("a03-pin");

  await alsAufsicht();
  await gehe("/eulenpfad/index.html#spiele");
  await rahmen([{ id: "tabs", css: "nav.tabs" }, { id: "person", css: ".kopf-person, .person-menue, .spieler-knopf", wennDa: true }]);
  await bild("a04-tabs");

  // Tab Spiele (LERN_Session36): Fach-Reiter, Suche, Knopf „Filter“ klappt Klasse, Nur, Stufe und Sortieren auf
  await js(`document.querySelector(".filter-knopf").click(); await new Promise(r => setTimeout(r, 400));`);
  await rahmen([{ id: "fach", css: "nav.fach-reiter-zeile" }, { id: "suche", css: "input.suche" }, { id: "filter", css: ".filter-klapp" }]);
  await bild("a16-spiele");
  await umfasse(".spielkarte.zufall");
  await bild("a23-zufall", { css: "#anl-ab" });

  await gehe("/eulenpfad/index.html#verwaltung/konten");
  await rahmen([{ id: "untertabs", css: "nav.untertabs" }, { id: "lernplan", css: "td:nth-child(3) .zeile-knoepfe" }]);
  await bild("a05-konten");

  await gehe("/eulenpfad/index.html#verwaltung/freigabe");
  await js(`const d = document.querySelector(".verwaltung details"); if (d) { d.open = true; const i = d.querySelector("details"); if (i) i.open = true; }`);
  await rahmen([{ id: "alle", text: "Alles freigeben" }, { id: "schalter", css: ".verwaltung .schalter" }]);
  await bild("a06-freigabe");

  await gehe("/eulenpfad/index.html#verwaltung/abgleich");
  await rahmen([{ id: "geraet", text: "Gerät benennen" }, { id: "ordner", text: "Ordner wählen" }, { id: "datei", text: "Abgleich-Datei sichern" }]);
  await bild("a07-abgleich");

  await gehe("/eulenpfad/index.html#verwaltung/einstellungen");
  // Einstellungen in Gruppen (Aussehen, In den Spielen, Kinder, Ton; LERN_Session36): die erste Gruppe, dann das
  // Dezimalzeichen für alle Spiele und je Spiel
  await js(`const h = [...document.querySelectorAll(".verwaltung h3")].find(x => x.textContent.trim() === "Dezimalzeichen").parentElement;
    h.querySelector(".zeile-knoepfe").id = "anl-dez"; const s = h.querySelector("details") || h.nextElementSibling; s.id = "anl-dez-spiel";`);
  // zwei Bilder: auf dem Handy liegen Aussehen und Dezimalzeichen über 1500 px auseinander
  await rahmen([{ id: "aussehen", css: ".einstellung-block" }]);
  await bild("a08-einstellungen");
  await rahmen([{ id: "dezimal", css: "#anl-dez" }, { id: "dezimal-spiel", css: "#anl-dez-spiel" }]);
  await bild("a25-dezimalzeichen");

  // Profil eines Kindes: Vorgaben mit „fest“ (VR1 a, LERN_Session12); das Kind hat beim Timer selbst gewählt
  await js(`LS.waehleTimer("Muster Kind", "runden-rutsche", true);`);
  await gehe("/eulenpfad/index.html#profil");
  await js(`const s = document.querySelector('select[aria-label="Profil von"]'); s.value = "Muster Kind"; s.dispatchEvent(new Event("change")); await new Promise(r => setTimeout(r, 400));`);
  // Profil (LERN_Session14): Bild, Klasse mit Aufstieg, Speichern, darunter der ganze Abschnitt „Was … selbst umstellen
  // darf“ (je Vorgabe eine Wahl, LERN_Session36)
  await js(`document.querySelector(".kind-wahl").parentElement.id = "anl-kindwahl";`);
  await rahmen([{ id: "bild", css: ".profil-bild" }, { id: "klasse", css: ".klasse-wahl" }, { id: "speichern", css: ".profil-speichern" }]);
  await bild("a19-profil");
  await rahmen([{ id: "kindwahl", css: "#anl-kindwahl" }]);
  await bild("a24-selbst-umstellen", { maxHoehe: 1400 });

  await js(`LS.setzeSpieler?.("Muster Kind");`);
  await alsAufsicht();
  await gehe("/eulenpfad/index.html#statistik");
  await js(`[...document.querySelectorAll(".statistik .chip")].find(b => b.textContent.trim() === "Muster Kind").click(); await new Promise(r => setTimeout(r, 400));`);
  await rahmen([{ id: "kind", css: ".statistik .chips" }, { id: "fazit", css: ".fazit-kopf" }]);
  await bild("a09-statistik");
  await karteMit("📅 Lernplan");
  await bild("a17-lernplan", { css: "#anl-karte" });
  await js(`const k = [...document.querySelectorAll(".statistik .karte")].find(x => x.querySelector("h2")?.textContent === "Vorgehen"); k.id = "anl-vorgehen";`);
  await bild("a10-vorgehen", { css: "#anl-vorgehen" });
  await js(`const k = [...document.querySelectorAll(".statistik .karte")].find(x => x.querySelector("h2")?.textContent === "Daten"); k.id = "anl-daten";`);
  await rahmen([{ id: "alle", text: "Alle sichern" }, { id: "eins", text: "Nur Muster Kind sichern" }, { id: "einlesen", text: "Einlesen" }, { id: "zuruecksetzen", text: "Zurücksetzen" }]);
  await bild("a11-daten");
  await js(`const k = [...document.querySelectorAll(".statistik .karte")].find(x => x.querySelector("h2")?.textContent.includes("Endlos")); k.id = "anl-rekorde";`);
  await bild("a15-rekorde", { css: "#anl-rekorde" });
  // Empfehlungen ans Kind (KS4 a, LERN_Session33): 📌 oben, 🚫 ausblenden, ➕ eigene (LERN_Session36)
  // zwei Bilder: „Eigene Empfehlung“ steht unter allen Vorschlägen, auf dem Handy über 1000 px tiefer
  await rahmen([{ id: "oben", text: "📌 Fürs Kind oben" }, { id: "ausblenden", text: "🚫 Fürs Kind ausblenden" }]);
  await bild("a22-empfehlungen", { randOben: 150 }); // mit dem Vorschlag darüber, zu dem die Knöpfe gehören
  await rahmen([{ id: "eigene", text: "➕ Eigene Empfehlung" }]);
  await bild("a26-eigene-empfehlung");

  await gehe("/eulenpfad/index.html#erfolge");
  await js(`[...document.querySelectorAll(".chip")].find(b => b.textContent.trim() === "Muster Kind")?.click(); await new Promise(r => setTimeout(r, 400));`);
  await rahmen([{ id: "woche", css: ".woche" }, { id: "abzeichen", css: ".abzeichen" }]);
  await bild("a18-erfolge");

  // Stufenwahl (RS1 a, LERN_Session35): Schalterzeile Timer · Endlos · Favorit, die Stufen, 🗣️ neben der Eule
  await gehe("/eulenpfad/spiele/runden-rutsche/index.html");
  await rahmen([{ id: "timer", css: ".schalter-zeile > .schalter-teil:nth-child(1)" }, { id: "endlos", css: ".schalter-zeile > .schalter-teil:nth-child(2)" },
    { id: "favorit", css: ".schalter-zeile > .schalter-teil:nth-child(3)" }, { id: "stufe", css: ".stufe" }, { id: "vorlesen", css: "button.vorlesen", wennDa: true }]);
  await bild("a12-stufenwahl");
  await rahmen([{ id: "ranglisten", css: ".endlos-wahl .ranglisten" }]);
  await bild("a14-endlos-rangliste");
  await gehe("/eulenpfad/spiele/runden-rutsche/index.html?stufe=s3");
  await rahmen([{ id: "test", css: ".testhilfe" }]);
  await bild("a13-testhilfe", { css: ".testhilfe", rand: 28 }); // nur die Leiste, ohne die halbe Zahl der Aufgabe darunter

  // Prüfansicht einer Wortliste (LP1 a, LP4 a; LERN_Session36): als Aufsicht, Anlaut-Angel, Liste „Anlaut“
  await gehe("/eulenpfad/spiele/anlaut-angel/index.html");
  await js(`await LS.listenPruefen("anlaut-angel", "anlaut"); await new Promise(r => setTimeout(r, 800));`);
  await rahmen([{ id: "ganz", text: "Ganze Liste geprüft" }, { id: "gruppe", css: "dialog[open] .pruef-gruppe > summary" }, { id: "haken", css: "dialog[open] .pruef-haken input" },
    { id: "korrektur", css: "dialog[open] .pruef-tabelle td:last-child button" }]);
  await bild("a21-pruefansicht", { imFenster: true });
}

async function kind() {
  await groesse();
  await js(`sessionStorage.clear(); localStorage.removeItem("lernspiele:spieler");`);
  await gehe("/eulenpfad/index.html");
  await rahmen([{ id: "name", css: ".name-knopf:not(.aufsicht)" }, { id: "neu", text: "Ich bin neu" }]);
  await bild("k01-anmelden");

  await alsKind();
  // Mein Bild (AV1 a, LERN_Session12)
  await gehe("/eulenpfad/index.html#profil");
  await rahmen([{ id: "bilder", css: ".avatar-tiere" }, { id: "farben", css: ".avatar-farben" }]);
  await bild("k13-bild");

  // Erfolge vor dem Tab Spiele: hier stehen die Abzeichen noch mit 🆕; danach gelten sie als gesehen, und der Hinweis
  // „n neue Abzeichen“ steht nicht mehr über den Fach-Reitern von k02
  await gehe("/eulenpfad/index.html#erfolge");
  await rahmen([{ id: "woche", css: ".woche" }, { id: "abzeichen", css: ".abzeichen" }]);
  await bild("k12-erfolge");

  // Tab Spiele (LERN_Session36): Fach-Reiter, Suche, Filter, Weiterspielen
  await gehe("/eulenpfad/index.html#spiele");
  await rahmen([{ id: "fach", css: "nav.fach-reiter-zeile" }, { id: "suche", css: "input.suche" }, { id: "filter", css: ".filter-knopf" }]);
  await bild("k02-spiele");
  await rahmen([{ id: "weiter", css: ".weiter-zeile" }]);
  await bild("k15-weiterspielen");
  await umfasse(".spielkarte.zufall");
  await bild("k10-zufall", { css: "#anl-ab" });

  // Stufenwahl: Schalterzeile, eine Stufe, ⓘ
  await gehe("/eulenpfad/spiele/runden-rutsche/index.html");
  await rahmen([{ id: "schalter", css: ".schalter-zeile" }, { id: "stufe", css: ".stufe" }, { id: "info", css: ".stufe-info" }]);
  await bild("k03-stufen");

  await gehe("/eulenpfad/spiele/runden-rutsche/index.html?stufe=s1");
  await rahmen([{ id: "aufgabe", css: ".zahl-gross" }, { id: "antworten", css: ".ziele" }]);
  await bild("k04-aufgabe");
  await rahmen([{ id: "hilfe", css: ".hilfe-knopf" }, { id: "tipp", css: ".tipp-knopf" }, { id: "melden", css: ".melden" }, { id: "vorlesen", css: ".vorlesen", wennDa: true }]);
  await bild("k11-hilfe-tipp");
  // Hinweis der Eule nach einer falschen Antwort
  await js(`${RUTSCHE_RICHTIG.replace("k.click();", "")} [...document.querySelectorAll(".ziel")].find(b => b !== k).click(); await new Promise(r => setTimeout(r, 400));`);
  await rahmen([{ id: "tipp", css: ".blase" }]);
  await bild("k05-hinweis");

  // Runde fertig spielen bis zu den Sternen
  for (let i = 0; i < 40; i++) {
    const stand = await js(`return document.querySelector(".schluss") ? "fertig" : document.querySelector(".ziel:not(.richtig)") && !document.querySelector(".ziel.richtig") ? "aufgabe" : "warten";`);
    if (stand === "fertig") break;
    if (stand === "aufgabe") await js(RUTSCHE_RICHTIG);
    await warte(800);
  }
  await warte(1500);
  await bild("k06-sterne", { maxHoehe: 560 });

  await gehe("/eulenpfad/index.html#statistik");
  await bild("k07-statistik");

  await notizblockZeigen();
  // Beide Anleitungen zeigen dieses Bild (früher a20 für die Aufsicht): Knopf, Wahl der Rechnung, angehängte Rechnung
  await rahmen([{ id: "knopf", css: ".nb-knopf" }, { id: "wahl", css: ".nb-wahl" }, { id: "weiter", css: ".nb-schritt + .nb-schritt" }]);
  await bild("k14-notizblock", { imFenster: true });

  await gehe("/eulenpfad/spiele/runden-rutsche/index.html?stufe=s1&endlos=1");
  for (let geloest = 0; geloest < 3;) {
    const bereit = await js(`return !!document.querySelector(".ziel") && !document.querySelector(".ziel.richtig");`);
    if (bereit) { await js(RUTSCHE_RICHTIG); geloest++; }
    await warte(1300);
  }
  await rahmen([{ id: "zahl", css: ".endlos-stand, .endlos-zaehler, .zaehler", wennDa: true }]);
  await bild("k08-endlos", { maxHoehe: 640 });
  await js(`${RUTSCHE_RICHTIG.replace("k.click();", "")} [...document.querySelectorAll(".ziel")].find(b => b !== k).click(); await new Promise(r => setTimeout(r, 600));`);
  await klick("Zum Ergebnis");
  await warte(1200);
  await rahmen([{ id: "rangliste", css: ".rangliste" }]);
  await bild("k09-endlos-ende");
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
    for (const f of Object.keys(FASSUNGEN).filter(f => !NUR_FASSUNG || f === NUR_FASSUNG)) {
      fassung = f;
      console.log(`\n— Fassung ${f} (${FASSUNGEN[f].breite} px)`);
      await aufsicht();
      await kind();
    }
    // Nach einem vollen Lauf: Bilder, die keine Aufnahme mehr haben, und ihre Einträge entfernen
    if (!NUR_FASSUNG) {
      for (const datei of fs.readdirSync(ZIEL).filter(d => d.endsWith(".webp") && !aufgenommen.has(d.replace(/\.webp$/, "")))) {
        fs.rmSync(path.join(ZIEL, datei)); console.log(`– ${datei} (keine Aufnahme mehr)`);
      }
      for (const name of Object.keys(liste)) if (!Object.keys(liste[name]).some(f => aufgenommen.has(`${name}-${f}`))) delete liste[name];
    }
    const geordnet = Object.fromEntries(Object.keys(liste).sort().map(n => [n, liste[n]]));
    fs.writeFileSync(RAHMEN_DATEI, JSON.stringify({ hinweis: "Erzeugt von tools/anleitung_bilder.js — nicht von Hand ändern (docs/eulenpfad/konzept_anleitungen.md, AL4 a, AL5 a).", bilder: geordnet }, null, 1) + "\n");
    console.log(`\nBilder in ${path.relative(process.cwd(), ZIEL)}, Rahmen in ${path.relative(process.cwd(), RAHMEN_DATEI)}`);
  } finally {
    try { ws?.close(); } catch { /* egal */ }
    browser.kill();
    await warte(500);
    try { fs.rmSync(profil, { recursive: true, force: true }); } catch { /* Chrome hält Dateien manchmal noch kurz */ }
  }
}

main().catch(e => { console.error("FEHLER", e.message); process.exitCode = 1; });
