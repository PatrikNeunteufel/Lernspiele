// Startseite des Eulenpfads im Ersatz-DOM (Entscheid KT1 a, LERN_Session23): Tab Spiele mit den Bausteinen aus
// KERN.uebersicht — Favoriten, Zuklappen, Alle auf/zu, Filter-Block, Suche, Ähnliche, Sortierung, Ansicht. Bis dahin
// prüfte kein Test den Tab. Gemeldet wird: Ausnahmen und Konsolenfehler, sichtbarer Text mit NaN, undefined, null,
// Infinity oder [object …], falsches Verhalten. Läuft über tools/pruef_dom.js; aufgerufen von tools/pruefe_spiele.js
// (Teil „tab“: node tools/pruefe_spiele.js tab; --tab=0 schaltet ab).
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WURZEL = path.join(__dirname, "..");
const APP = path.join(WURZEL, "eulenpfad");
const DOM = fs.readFileSync(path.join(__dirname, "pruef_dom.js"), "utf8");
const VERDAECHTIG = /\bNaN\b|\bundefined\b|\bnull\b|\bInfinity\b|\[object /;

const HILFEN = `
globalThis.__alle = (sel, text) => [...document.querySelectorAll(sel)].filter(e => !text || e.textContent.includes(text));
globalThis.__finde = (sel, text) => { const e = __alle(sel, text)[0]; if (!e) throw new Error("nicht gefunden: " + sel + (text ? " „" + text + "“" : "")); return e; };
globalThis.__klick = (sel, text) => __finde(sel, text).click();
globalThis.__fuelle = (sel, wert) => { const e = __finde(sel); e.value = String(wert); e.dispatchEvent(new Event("input", { bubbles: true })); };
globalThis.__klappe = (sel, offen) => { const d = __finde(sel); d.open = offen; d.dispatchEvent(new Event("toggle")); };
globalThis.__text = () => __textMitAbstand(document.body);
`;

/**
 * Eine Seite öffnen (Standard die Startseite); speicher (Map) = derselbe Browser wie eine frühere Seite. Mit idb (Map, über
 * Seiten teilbar) liegt ein IndexedDB-Ersatz vor den Skripten (tools/ersatz_idb.js; idbOpt: { voll, kaputt }) — dann laden
 * die grossen Schlüssel asynchron, und die Seite zeichnet erst nach ruheAsync. vorher läuft vor dem Skript, das die Seite
 * startet (start.js oder das erste Skript ohne src).
 */
function oeffne({ rel = "index.html", search = "", hash = "#spiele", speicher = new Map(), seed = 1, vorher = "", idb = null, idbOpt = null } = {}) {
  const datei = path.join(APP, rel);
  const html = fs.readFileSync(datei, "utf8");
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1].replace(/<script[\s\S]*?<\/script>/g, "");
  const meldungen = [];
  const konsole = { log() {}, info() {}, warn() {}, debug() {}, error: (...a) => meldungen.push(a.map(String).join(" ")) };
  const k = vm.createContext({ __seite: { html: body, search, hash, pfad: "/eulenpfad/" + rel, seed, speicher }, console: konsole,
    URL, URLSearchParams, structuredClone, crypto: globalThis.crypto, TextEncoder, TextDecoder, Blob, atob, btoa });
  const lauf = (code, name = "prüfung") => vm.runInContext(code, k, { filename: name, timeout: 20000 });
  lauf(DOM, "pruef_dom.js");
  lauf(HILFEN, "hilfen");
  if (idb) { k.__idbDaten = idb; k.__idbOpt = idbOpt || {}; lauf(require("./ersatz_idb.js").ERSATZ_IDB_CODE, "ersatz_idb.js"); }
  const skripte = [...html.matchAll(/<script(?:\s+src="([^"]+)")?[^>]*>([\s\S]*?)<\/script>/g)];
  let vorherGelaufen = false;
  for (const m of skripte) {
    // Vor dem Skript, das die Seite startet, die Person anlegen und anmelden
    if (vorher && !vorherGelaufen && (m[1] === "start/start.js" || !m[1])) { lauf(vorher, "vorher"); vorherGelaufen = true; }
    if (!m[1]) { lauf(m[2], "index.html (inline)"); continue; }
    lauf(fs.readFileSync(path.join(path.dirname(datei), m[1]), "utf8"), m[1]);
  }
  return {
    lauf, speicher,
    fehler: () => [...lauf("__fehler"), ...meldungen],
    text: () => lauf("__text()"),
    klick: (sel, text) => lauf(`__klick(${JSON.stringify(sel)}, ${JSON.stringify(text || "")})`),
    fuelle: (sel, wert) => lauf(`__fuelle(${JSON.stringify(sel)}, ${JSON.stringify(wert)})`),
    klappe: (sel, offen) => lauf(`__klappe(${JSON.stringify(sel)}, ${offen})`),
    gibt: (sel, text) => lauf(`__alle(${JSON.stringify(sel)}, ${JSON.stringify(text || "")}).length`),
    profil: name => JSON.parse(lauf(`JSON.stringify(LS.profil(${JSON.stringify(name)}))`)),
  };
}

/** Kurze Timer (requestAnimationFrame, hashchange) erledigen. */
function ruhe(s, ms = 50, runden = 6) { for (let i = 0; i < runden; i++) s.lauf(`__uhr.weiter(${ms})`); }
/** Wie ruhe, aber dazwischen die Versprechen laufen lassen (IndexedDB-Ersatz, PIN). */
async function ruheAsync(s, ms = 50, runden = 12) {
  for (let i = 0; i < runden; i++) { await new Promise(r => setImmediate(r)); s.lauf(`__uhr.weiter(${ms})`); }
}

/**
 * Speicherschicht (docs/konzept_gruppen.md 5a, Plan D11, Kern 1.34.0; LERN_Session26): Runden aus localStorage ziehen beim
 * ersten Start mit IndexedDB um, neue Runden landen dort, Spielseite und Startseite zeichnen erst nach dem Laden, voller
 * Speicher zeigt das Band, kaputte IndexedDB fällt auf localStorage zurück, Erinnerung ans Sichern und Speicheranzeige in
 * der Verwaltung. Asynchron; gibt die Zahl der Prüfschritte zurück.
 */
async function pruefeSpeicher(melde) {
  let schritte = 0;
  const pruefe = (ok, ort, text) => { schritte++; if (!ok) melde(ort, text); };
  const fehlerVon = (ort, s) => { for (const f of new Set(s.fehler())) melde(ort, f); };
  const runde = zeit => JSON.stringify({ name: "Mia", zeit, inhalt: "zahlenhaus", stufe: "s3", aufgaben: 5, fehler: 1, dauer: 90, sterne: 2 });
  const vorTagen = t => new Date(Date.now() - t * 864e5).toISOString();
  const browser = new Map(), idb = new Map();
  const inIdb = k => { const w = idb.get("lernspiele-ablage")?.get("werte")?.get(k); return w ? JSON.parse(w) : null; };
  const lokal = (k, b = browser) => (b.has("lernspiele:" + k) ? JSON.parse(b.get("lernspiele:" + k)) : null);
  const anzahl = l => (Array.isArray(l) ? l.length : 0);

  // 1. wie bis Kern 1.33: ohne IndexedDB in localStorage (eine Runde vor 30 Tagen)
  {
    const ort = "Speicher ohne IndexedDB";
    const s = oeffne({ speicher: browser, vorher: `LS.neuerSpieler("Mia"); LS.setzeSpieler("Mia"); LS.protokolliere(${runde(vorTagen(30))});` });
    ruhe(s);
    pruefe(anzahl(lokal("protokoll")) === 1 && s.lauf("LS.SPEICHER.modus()") === "lokal", ort, "Runde nicht in localStorage");
    pruefe(s.gibt(".spielkarte[data-spiel]") > 0, ort, "Startseite ohne IndexedDB nicht sofort gezeichnet");
    fehlerVon(ort, s);
  }
  // 2. Startseite mit IndexedDB: zeichnet erst nach dem Laden, zieht um, neue Runden landen in IndexedDB
  {
    const ort = "Speicher mit IndexedDB, Startseite";
    const s = oeffne({ speicher: browser, idb });
    pruefe(s.gibt(".spielkarte[data-spiel]") === 0, ort, "Startseite vor dem Laden der grossen Schlüssel gezeichnet");
    await ruheAsync(s);
    pruefe(s.lauf("LS.SPEICHER.modus()") === "idb", ort, `Modus ${s.lauf("LS.SPEICHER.modus()")} statt idb`);
    pruefe(lokal("protokoll") === null, ort, "Runden nach dem Umzug noch in localStorage");
    pruefe(anzahl(inIdb("protokoll")) === 1 && s.lauf("LS.protokoll().length") === 1, ort, `nach dem Umzug ${anzahl(inIdb("protokoll"))} Runden in IndexedDB statt 1`);
    pruefe(s.gibt(".spielkarte[data-spiel]") > 0, ort, "Startseite nach dem Laden nicht gezeichnet");
    s.lauf(`LS.protokolliere(${runde(vorTagen(1))})`);
    await ruheAsync(s, 50, 4);
    pruefe(anzahl(inIdb("protokoll")) === 2 && lokal("protokoll") === null, ort, "neue Runde nicht in IndexedDB");
    pruefe(s.gibt(".speicher-voll") === 0, ort, "Band „Speicher voll“ ohne Grund");
    fehlerVon(ort, s);
  }
  // 3. Spielseite mit IndexedDB: Stufenwahl erst nach dem Laden, mit den Sternen der Runden aus IndexedDB
  {
    const ort = "Speicher mit IndexedDB, Spielseite";
    const s = oeffne({ rel: "spiele/zahlenhaus/index.html", hash: "", speicher: browser, idb });
    pruefe(s.gibt(".stufen") === 0, ort, "Stufenwahl vor dem Laden der grossen Schlüssel");
    await ruheAsync(s);
    pruefe(s.gibt(".stufen") === 1, ort, "keine Stufenwahl nach dem Laden");
    pruefe(s.lauf(`LS.besteSterne("Mia", "zahlenhaus", "s3")`) === 2, ort, "Sterne der Runden aus IndexedDB fehlen in der Stufenwahl");
    fehlerVon(ort, s);
  }
  // 4. Verwaltung: Erinnerung ans Sichern (älteste Runde vor 30 Tagen, nie gesichert), Speicheranzeige; nach dem Sichern weg
  {
    const ort = "Speicher, Verwaltung";
    const s = oeffne({ speicher: browser, idb });
    await ruheAsync(s);
    const an = await s.lauf(`(async () => { LS.neuerSpieler("Mama", { rolle: "aufsicht" }); await LS.setzePin("Mama", "2468"); return LS.meldeAufsichtAn("Mama", "2468"); })()`);
    pruefe(!!an, ort, "Aufsicht nicht angemeldet");
    s.lauf(`location.hash = "#verwaltung/einstellungen"`);
    await ruheAsync(s);
    pruefe(s.gibt("[data-erinnerung]") === 1, ort, "keine Erinnerung ans Sichern nach 30 Tagen ohne Sicherung");
    pruefe(s.gibt("[data-speicher]") === 1, ort, "keine Speicheranzeige unter Einstellungen");
    // Blöcke (LERN_Session32): je Block eine Karte, der Stil für sich im Block Aussehen, Meldeweg und Speicher je eigene
    pruefe(s.lauf(`LS.EINSTELLUNG_BLOECKE.every(b => document.querySelector('section[data-block="' + b.id + '"]'))`) === true
      && s.gibt('section[data-block="meldeweg"]') === 1 && s.gibt('section[data-block="speicher"] [data-speicher]') === 1, ort, "Einstellungen nicht in Blöcken");
    pruefe(s.lauf(`document.querySelector('section[data-block="aussehen"]').querySelectorAll(".einstellung").length`) === 1
      && /Stil/.test(s.lauf(`document.querySelector('section[data-block="aussehen"] h3').textContent`)), ort, "Block Aussehen trägt nicht nur den Stil");
    pruefe(/Runden und Rekorde liegen in der Ablage/.test(s.text()), ort, "Speicheranzeige nennt die Ablage nicht");
    s.lauf(`LS.schreibe("letzteSicherung", new Date().toISOString()); zeichneStart()`);
    await ruheAsync(s, 50, 4);
    pruefe(s.gibt("[data-erinnerung]") === 0, ort, "Erinnerung bleibt nach dem Sichern");
    fehlerVon(ort, s);
  }
  // 5. voller Speicher: das Band erscheint (bis LERN_Session26 ging die Runde still verloren)
  {
    const ort = "Speicher voll";
    const b = new Map();
    const s = oeffne({ speicher: b, idb: new Map(), idbOpt: { voll: true }, vorher: `LS.neuerSpieler("Mia"); LS.setzeSpieler("Mia");` });
    await ruheAsync(s);
    s.lauf(`LS.protokolliere(${runde(vorTagen(0))})`);
    await ruheAsync(s, 50, 4);
    pruefe(s.gibt(".speicher-voll") === 1, ort, "kein Band „Speicher voll“, die Runde ginge still verloren");
    // ein Band genügt, auch bei einem zweiten Fehler
    s.lauf(`LS.protokolliere(${runde(vorTagen(0))})`);
    await ruheAsync(s, 50, 4);
    pruefe(s.gibt(".speicher-voll") <= 1, ort, "Band „Speicher voll“ doppelt");
  }
  // 6. IndexedDB lässt sich nicht öffnen: wie bis Kern 1.33 in localStorage
  {
    const ort = "Speicher, IndexedDB kaputt";
    const b = new Map();
    const s = oeffne({ speicher: b, idb: new Map(), idbOpt: { kaputt: true }, vorher: `LS.neuerSpieler("Mia"); LS.setzeSpieler("Mia");` });
    await ruheAsync(s);
    s.lauf(`LS.protokolliere(${runde(vorTagen(0))})`);
    pruefe(s.lauf("LS.SPEICHER.modus()") === "lokal" && anzahl(lokal("protokoll", b)) === 1, ort, "Runde nicht in localStorage, obwohl IndexedDB fehlt");
    pruefe(s.gibt(".spielkarte[data-spiel]") > 0, ort, "Startseite nicht gezeichnet");
    fehlerVon(ort, s);
  }
  return schritte;
}

/** Prüft den Tab Spiele; melde(ort, text) meldet einen Fehler. Gibt die Zahl der Prüfschritte zurück. */
function pruefeTabSpiele(melde) {
  let schritte = 0;
  const pruefe = (ok, ort, text) => { schritte++; if (!ok) melde(ort, text); };
  const fehlerVon = (ort, s) => { for (const f of new Set(s.fehler())) melde(ort, f); };
  const textPruefen = (ort, s) => { const t = s.text(); const i = t.search(VERDAECHTIG); pruefe(i < 0, ort, `verdächtiger Text: …${t.slice(Math.max(0, i - 60), i + 40)}…`); };
  // Ein Kind ohne Klasse (kein „Meine Klasse“), das die Sortierung wählen darf
  const VORHER = `LS.neuerSpieler("Mia", { sortierungWahl: true }); LS.setzeSpieler("Mia");`;
  const browser = new Map();

  // ----- Gruppen, Favoriten, Zuklappen, Ansicht -----
  {
    const ort = "Tab Spiele";
    const s = oeffne({ speicher: browser, vorher: VORHER });
    ruhe(s);
    const karten = s.gibt(".spielkarte[data-spiel]");
    pruefe(karten > 0, ort, "keine Spielkarte");
    pruefe(s.gibt('details.gruppe[data-gruppe^="fach:"]') > 0 && s.gibt('details.gruppe[data-gruppe^="thema:"]') > 0, ort, "keine Gruppen nach Fach und Thema");
    // Wochenziel: auch mit Lernplan weder eine Marke in der Kopfzeile (WO1 a zurückgenommen, LERN_Session33) noch die
    // Karte im Tab Spiele — sie steht in Erfolge und Statistik
    s.lauf(`LS.speichereProfil("Mia", { lernplan: { tage: 2, minuten: 10 } }); zeichneStart()`); ruhe(s);
    pruefe(s.gibt("#leiste .woche-tage") === 0 && !/📅/.test(s.lauf(`document.getElementById("leiste").textContent`))
      && s.gibt("#inhalt .woche-tage") === 0, ort, "Wochenziel steht in der Kopfzeile oder im Tab Spiele");
    s.lauf(`LS.speichereProfil("Mia", { lernplan: null }); zeichneStart()`); ruhe(s);
    // Über den Spielen nur Fach-Reiter, Suche und „Filter“ (FB1 a, LERN_Session32); das Feld des Filters vorgegeben zu
    pruefe(s.gibt("button.fach-reiter") >= 3 && s.gibt(".filter-knopf") === 1 && s.lauf(`document.getElementById("filter-feld").hidden`) === true,
      ort, "Fach-Reiter oder Knopf „Filter“ fehlen, oder der Filter ist offen");
    // Fach und Thema als Blöcke mit Bild (GR1 a, LERN_Session32): jedes Thema mit Bild und kurzem Namen; ⓘ zeigt den
    // langen Titel, ohne den Block zuzuklappen
    {
      const ohneBild = s.lauf(`[...document.querySelectorAll("details.thema-block")].filter(d => !d.querySelector("summary .gruppe-bild")?.textContent.trim()).length`);
      pruefe(s.gibt("details.fach-block") > 0 && s.gibt("details.thema-block") > 0 && ohneBild === 0, ort, "Fach- oder Themenblöcke fehlen oder ein Thema ohne Bild");
      s.klick("details.thema-block .thema-info"); ruhe(s);
      pruefe(s.lauf(`(() => { const d = document.querySelector("details.thema-block"); return d.open && !d.querySelector(".thema-titel").hidden; })()`), ort, "ⓘ im Thema zeigt den Titel nicht oder klappt den Block zu");
      s.klick("details.thema-block .thema-info"); ruhe(s);
    }
    // Gruppen des Filters (LERN_Session32): je für sich einklappbar, vorgegeben zu, Aufklappen merkt das Profil
    pruefe(s.gibt("details.filter-gruppe") >= 2 && s.lauf(`[...document.querySelectorAll("details.filter-gruppe")].every(d => !d.open)`), ort, "Gruppen des Filters fehlen oder sind nicht zu");
    s.klappe('details.filter-gruppe[data-gruppe="stufe"]', true);
    pruefe((s.profil("Mia").filterOffen || []).includes("stufe"), ort, "aufgeklappte Gruppe Stufe nicht im Profil");
    s.lauf("zeichneStart()"); ruhe(s);
    pruefe(s.lauf(`document.querySelector('details.filter-gruppe[data-gruppe="stufe"]').open`) === true, ort, "Gruppe Stufe nach dem Neuzeichnen wieder zu");
    s.klappe('details.filter-gruppe[data-gruppe="stufe"]', false);
    pruefe(s.gibt("button", "Alle auf") === 1 && s.gibt("button", "Alle zu") === 1, ort, "„Alle auf“ / „Alle zu“ fehlen bei Gruppen");
    textPruefen(ort, s);
    // Kinderkarte (GS2 a) und Kartenbild (GS1 a, LERN_Session32): Bild aus feier im Katalog, keine Lernziel-Kürzel,
    // Beschreibung verborgen, bis ⓘ sie zeigt; mit Bild ohne Emoji im Kopf
    {
      const id = s.lauf(`document.querySelector(".spielkarte[data-spiel]").dataset.spiel`), k = `.spielkarte[data-spiel="${id}"]`;
      ruhe(s);
      pruefe(s.gibt(`${k} .karten-bild .feier svg`) === 1 && s.gibt(`${k}.mit-bild`) === 1, ort, `kein Kartenbild auf der Karte ${id}`);
      pruefe(s.gibt(".spielkarte[data-spiel] .karten-bild") === karten, ort, "nicht jede Spielkarte hat eine Fläche fürs Kartenbild");
      pruefe(s.gibt(".spielkarte[data-spiel] .marke.tipp") === 0, ort, "Lernziel-Kürzel auf der Karte eines Kindes");
      pruefe(s.lauf(`document.querySelector('${k} .ziel').hidden`) === true, ort, "Beschreibung auf der Karte eines Kindes sichtbar");
      s.klick(`${k} .karten-info`); ruhe(s);
      pruefe(s.lauf(`document.querySelector('${k} .ziel').hidden`) === false && s.lauf(`location.hash`) === "#spiele", ort, "ⓘ zeigt die Beschreibung nicht (oder öffnet das Spiel)");
      s.klick(`${k} .karten-info`); ruhe(s);
      // Stil „wie von Hand gezeichnet“ (Einstellung stil, Standard hand; STIL in spiel.js, LERN_Session32): Pfad
      // geschlossen und je Element gleich, Raster je Spiel verschoben, ab und zu eine Lücke; glatt ohne Klasse, ohne Lücke
      pruefe(s.lauf(`document.body.classList.contains("stil-hand")`) === true, ort, "Stil „hand“ ist nicht der Standard");
      pruefe(s.gibt(".raster-luecke") > 0, ort, "Stil „hand“ ohne Lücke im Raster");
      // Blöcke der Einstellungen (LERN_Session32): jede Einstellung in genau einem Block, kein Block mit Unbekanntem
      {
        const fehlt = s.lauf(`(() => { const n = LS.EINSTELLUNG_BLOECKE.flatMap(b => b.einstellungen);
          return [...Object.keys(LS.EINSTELLUNGEN).filter(e => n.filter(x => x === e).length !== 1), ...n.filter(e => !LS.EINSTELLUNGEN[e])]; })()`);
        pruefe(fehlt.length === 0, ort, `Einstellungen nicht in genau einem Block: ${fehlt.join(", ")}`);
      }
      pruefe(s.lauf(`(() => { const k = document.querySelector('${k}'); return k.dataset.stil === "1" && /px$/.test(k.style.getPropertyValue("--rx")); })()`), ort, "Spielkarte im Stil „hand“ nicht eingebunden (Raster)");
      const pfad = s.lauf(`[STIL.pfad(300, 420, "${id}", "oben"), STIL.pfad(300, 420, "${id}", "oben"), STIL.pfad(300, 420, "anders", null)]`);
      pruefe(/^M[\d.,\s L-]+Z M[\d.,\s L-]+Z$/.test(pfad[0]) && pfad[0] === pfad[1] && pfad[0] !== pfad[2], ort, "Handrahmen: Pfad ungültig oder nicht je Element gleich");
      s.lauf(`LS.setzeEinstellung("stil", "glatt"); zeichneStart()`); ruhe(s);
      pruefe(s.lauf(`document.body.classList.contains("stil-hand")`) === false && s.gibt(".raster-luecke") === 0, ort, "Stil „glatt“ schaltet den Stil nicht aus");
      s.lauf(`LS.setzeEinstellung("stil", null); zeichneStart()`); ruhe(s);
    }
    const erste = s.lauf(`document.querySelector(".spielkarte[data-spiel]").dataset.spiel`);
    // Favorit: Stern antippen → im Profil, Karte in der Gruppe Favoriten (doppelt), Stern an
    s.klick(`.spielkarte[data-spiel="${erste}"] [data-favorit]`); ruhe(s);
    pruefe((s.profil("Mia").favoriten || []).includes(erste), ort, `Favorit ${erste} nicht im Profil`);
    pruefe(s.gibt(`[data-gruppe="favoriten"] .spielkarte[data-spiel="${erste}"]`) === 1 && s.gibt(".spielkarte[data-spiel]") === karten + 1,
      ort, "Favorit fehlt in der Gruppe Favoriten");
    pruefe(s.gibt(`[data-gruppe="favoriten"] .spielkarte[data-spiel="${erste}"] .karten-schalter.an svg.stern.an`) === 1, ort, "Stern des Favoriten nicht an");
    // Zuklappen: im Profil, bleibt nach dem Neuzeichnen zu; ein toggle ohne Änderung speichert nicht
    const fach = s.lauf(`document.querySelector('details.gruppe[data-gruppe^="fach:"]').dataset.gruppe`);
    s.klappe(`[data-gruppe="${fach}"]`, false);
    pruefe((s.profil("Mia").zu || []).includes(fach), ort, `Zuklappen von ${fach} nicht im Profil`);
    s.lauf("zeichneStart()"); ruhe(s);
    pruefe(s.lauf(`document.querySelector('[data-gruppe="${fach}"]').open`) === false, ort, "zugeklappte Gruppe nach dem Neuzeichnen offen");
    s.lauf(`(() => { const d = document.querySelector('[data-gruppe="favoriten"]'); d.dispatchEvent(new Event("toggle")); })()`);
    pruefe(JSON.stringify(s.profil("Mia").zu) === JSON.stringify([fach]), ort, "toggle ohne Änderung hat das Zuklappen verändert");
    // Alle zu / Alle auf
    // offen als Eigenschaft (der Ersatz-DOM setzt dafür kein Attribut)
    const offene = () => s.lauf(`[...document.querySelectorAll("details.gruppe")].map(d => d.open)`);
    s.klick("button", "Alle zu"); ruhe(s);
    pruefe(offene().length > 0 && offene().every(o => o === false), ort, "nach „Alle zu“ eine Gruppe offen");
    s.klick("button", "Alle auf"); ruhe(s);
    pruefe((s.profil("Mia").zu || []).length === 0 && offene().every(o => o === true), ort, "nach „Alle auf“ eine Gruppe zu");
    // Ansicht kompakt
    s.klick("button", "Kompakt"); ruhe(s);
    pruefe(s.profil("Mia").ansicht === "kompakt" && s.gibt(".spiele.kompakt") > 0, ort, "Ansicht kompakt nicht gemerkt");
    s.klick("button", "Kacheln"); ruhe(s);
    // Knopf „Filter“ (FB1 a): Aufklappen im Profil (filterZu false), Zuklappen wieder true
    s.klick(".filter-knopf"); ruhe(s);
    pruefe(s.profil("Mia").filterZu === false && s.lauf(`document.getElementById("filter-feld").hidden`) === false, ort, "Filter aufgeklappt, aber nicht gemerkt");
    s.klick(".filter-knopf"); ruhe(s);
    pruefe(s.profil("Mia").filterZu === true && s.lauf(`document.getElementById("filter-feld").hidden`) === true, ort, "Filter zugeklappt, aber nicht gemerkt");
    // Fach-Reiter: „Mathe“ wählt das Fach, „Alle“ hebt es auf
    s.klick("button.fach-reiter", "Mathe"); ruhe(s);
    const fachGruppen = () => s.lauf(`[...document.querySelectorAll("details.gruppe")].map(d => d.dataset.gruppe).filter(g => g && g.startsWith("fach:"))`);
    pruefe(s.lauf(`LS.lies("filter", {}).fach`) === "Mathe" && JSON.stringify(fachGruppen()) === '["fach:Mathe"]', ort,
      `Fach-Reiter Mathe filtert nicht (Fach ${s.lauf(`LS.lies("filter", {}).fach`)}, Gruppen ${fachGruppen().join(", ")})`);
    s.klick("button.fach-reiter", "Alle"); ruhe(s);
    // Favorit wieder weg (sonst steht die Karte zweimal in der Liste)
    s.klick(`[data-gruppe="favoriten"] .spielkarte[data-spiel="${erste}"] [data-favorit]`); ruhe(s);
    pruefe((s.profil("Mia").favoriten || []).length === 0 && s.gibt('[data-gruppe="favoriten"]') === 0, ort, "Favorit nicht zurückgenommen");
    // Sortierung: nach Name, dann die Richtung umkehren
    s.lauf(`(() => { const e = document.querySelector('.sortier-wahl select'); e.value = "name"; e.dispatchEvent(new Event("change")); })()`); ruhe(s);
    const sortiert = () => s.lauf(`JSON.stringify([...document.querySelectorAll(".spielkarte[data-spiel] .name")].map(n => n.textContent))`);
    const vor = JSON.parse(sortiert());
    pruefe(JSON.stringify(s.profil("Mia").sortierung) === '{"art":"name","ab":false}' && s.gibt('details.gruppe[data-gruppe^="fach:"]') === 0,
      ort, "Sortierung nach Name nicht gemerkt oder noch Gruppen");
    pruefe(s.gibt("button", "Alle auf") === 0, ort, "„Alle auf“ in der flachen Liste");
    s.klick(".sortier-wahl button"); ruhe(s);
    const nach = JSON.parse(sortiert());
    pruefe(vor.length > 1 && vor.join("|") === [...vor].sort((a, b) => a.localeCompare(b, "de")).join("|"), ort, "Liste nicht nach Name sortiert");
    pruefe(s.profil("Mia").sortierung.ab === true && nach.join("|") === [...vor].reverse().join("|"), ort, "Richtung der Sortierung nicht umgekehrt");
    s.lauf(`(() => { const e = document.querySelector('.sortier-wahl select'); e.value = "thema"; e.dispatchEvent(new Event("change")); })()`); ruhe(s);
    fehlerVon(ort, s);
  }

  // ----- Suche: eine Liste ohne Gruppen und ohne „Alle auf/zu“; Fokus zurück; nur Leerzeichen = wie ohne Suche -----
  {
    const ort = "Tab Spiele, Suche";
    const s = oeffne({ speicher: browser, vorher: `LS.setzeSpieler("Mia");` });
    ruhe(s);
    s.fuelle("input.suche", "uhr"); ruhe(s);
    pruefe(s.gibt(".treffer-titel", "Treffer") === 1 && s.gibt(".spielkarte[data-spiel]") > 0, ort, "keine Trefferliste zu „uhr“");
    pruefe(s.gibt("details.gruppe") === 0, ort, "Gruppen während der Suche");
    pruefe(s.gibt("button", "Alle auf") === 0 && s.gibt("button", "Alle zu") === 0, ort, "„Alle auf“ / „Alle zu“ während der Suche");
    pruefe(s.lauf(`document.activeElement === document.querySelector("input.suche") && document.activeElement.selectionStart === 3`), ort, "Suchfeld ohne Fokus nach dem Neuzeichnen");
    textPruefen(ort, s);
    // Nur Leerzeichen: Gruppen wie ohne Suche, Zuklappen wird gemerkt
    s.fuelle("input.suche", "   "); ruhe(s);
    const fach = s.lauf(`(document.querySelector('details.gruppe[data-gruppe^="fach:"]') || {}).dataset?.gruppe || ""`);
    pruefe(!!fach, ort, "mit Leerzeichen im Suchfeld keine Gruppen");
    if (fach) {
      s.klappe(`[data-gruppe="${fach}"]`, false);
      pruefe((s.profil("Mia").zu || []).includes(fach), ort, "mit Leerzeichen im Suchfeld wird Zuklappen nicht gemerkt");
      s.klappe(`[data-gruppe="${fach}"]`, true);
    }
    s.fuelle("input.suche", ""); ruhe(s);
    fehlerVon(ort, s);
  }

  // ----- Ähnliche: Liste zum Spiel, „✕ Alle Spiele“ nimmt den Parameter weg, Tippen auch -----
  {
    const ort = "Tab Spiele, Ähnliche";
    const s = oeffne({ speicher: browser, search: "?aehnlich=uhr-werkstatt", vorher: `LS.setzeSpieler("Mia");` });
    ruhe(s);
    pruefe(s.gibt(".treffer-titel", "Ähnlich wie") === 1, ort, "keine Liste der ähnlichen Spiele");
    pruefe(s.gibt("details.gruppe") === 0 && s.gibt("button", "Alle auf") === 0, ort, "Gruppen oder „Alle auf“ bei den Ähnlichen");
    textPruefen(ort, s);
    s.klick("button", "Alle Spiele"); ruhe(s);
    pruefe(s.lauf("location.search") === "" && s.gibt('details.gruppe[data-gruppe^="fach:"]') > 0, ort, "„✕ Alle Spiele“ lässt den Parameter stehen");
    const t = oeffne({ speicher: browser, search: "?aehnlich=uhr-werkstatt", vorher: `LS.setzeSpieler("Mia");` });
    ruhe(t);
    t.fuelle("input.suche", "zahl"); ruhe(t);
    pruefe(t.lauf("location.search") === "", ort, "Tippen in der Suche lässt den Parameter stehen");
    fehlerVon(ort, s); fehlerVon(ort, t);
  }

  // ----- Statistik und Erfolge des Kindes (KS1 a, KS2 a, KS3 a; Konzept Gestaltung) -----
  {
    const ort = "Statistik des Kindes";
    // Runden: zweimal Zahlenhaus s3 mit drei Sternen (→ „weiter“), zweimal Zahlenhaus s1 mit vielen Fehlern (→ „wiederholen“)
    const RUNDEN = `
      const vor = t => new Date(Date.now() - t * 864e5).toISOString();
      const liste = falsch => Array.from({ length: 6 }, (_, i) => i < falsch ? { text: "3 + 4", versuche: 2, geloest: false, gezeigt: true, loesung: "7" } : { text: "1 + 1", versuche: 0, geloest: true });
      for (const [stufe, sterne, falsch, t] of [["s3", 3, 0, 2], ["s3", 3, 0, 0], ["s1", 1, 4, 1], ["s1", 1, 4, 0]])
        LS.protokolliere({ name: "Mia", zeit: vor(t), inhalt: "zahlenhaus", stufe, aufgaben: 6, fehler: falsch, dauer: 90, sterne, liste: liste(falsch) });
      LS.speichereProfil("Mia", { lernplan: { tage: 1, minuten: 1 } });`;
    const s = oeffne({ hash: "#statistik", vorher: `LS.neuerSpieler("Mia", { klasse: 2 }); LS.setzeSpieler("Mia");` + RUNDEN });
    ruhe(s);
    // KS1: Karten mit Satz aus KIND, ohne Zahlen; so viele, wie es Vorschläge mit Satz für sichtbare Spiele gibt (höchstens 3)
    const erwartet = s.lauf(`AUSWERTUNG.vorschlaege("Mia", LS.protokoll().filter(e => e.name === "Mia"), LS.profil("Mia"))
      .filter(v => v.kind && LS.fuerKinderSichtbar(v.spiel)).length`);
    pruefe(erwartet > 0, ort, "Gegenprobe: keine Vorschläge mit Satz fürs Kind aus den Testrunden");
    pruefe(s.gibt(".vorschlag-karte") === Math.min(3, erwartet), ort, `Vorschlagskarten: ${s.gibt(".vorschlag-karte")} statt ${Math.min(3, erwartet)}`);
    const saetze = s.lauf(`JSON.stringify([...document.querySelectorAll(".vorschlag-satz")].map(x => x.textContent))`);
    pruefe(JSON.parse(saetze).every(t => t && !/\d|%/.test(t)), ort, `Satz fürs Kind mit Zahlen: ${saetze}`);
    pruefe(s.gibt(".vorschlag-karte a.knopf", "Los") === s.gibt(".vorschlag-karte"), ort, "Vorschlagskarte ohne „▶ Los“");
    // Die Aufsicht behält Titel und Text mit Zahlen
    pruefe(s.lauf(`AUSWERTUNG.vorschlaege("Mia", LS.protokoll().filter(e => e.name === "Mia"), LS.profil("Mia")).some(v => v.art === "wiederholen" && /%/.test(v.text))`),
      ort, "Text der Aufsicht zum Wiederholen ohne Prozent");
    // KS2: je Runde eine Kachel, nach Tagen gruppiert, ohne Uhrzeit und ohne Fehlerzahl
    pruefe(s.gibt(".runden-kachel") === 4 && s.gibt(".runden-gruppe", "Heute") === 1, ort, "Runden nicht als vier Kacheln mit der Gruppe „Heute“");
    const inhalt = s.lauf(`document.getElementById("inhalt").textContent`);
    pruefe(!/%|\d\d:\d\d|Fehler\b/.test(inhalt), ort, "Statistik des Kindes zeigt Prozent, Uhrzeit oder Fehlerzahl");
    s.klappe(".runden-klapp", true);
    pruefe(s.gibt(".runden-kachel.offen") === 1 && s.gibt(".runden-kachel.offen a.knopf", "Nochmal") === 1, ort, "aufgeklappte Kachel ohne „▶ Nochmal“ oder nicht über die Zeile");
    // KS3: eine Wochenkarte ohne Karte in der Karte, mit Wochensternen, ohne Datumsreihe
    pruefe(s.gibt(".woche.flach") === 1 && s.gibt(".woche:not(.flach)") === 0 && s.gibt(".wochen-reihe") === 0 && s.gibt(".wochen-sterne") === 1,
      ort, "Woche doppelt, mit Datumsreihe oder ohne Wochensterne");
    textPruefen(ort, s);
    fehlerVon(ort, s);
    const e = oeffne({ hash: "#erfolge", speicher: s.speicher, vorher: `LS.setzeSpieler("Mia");` });
    ruhe(e);
    pruefe(e.gibt("#inhalt .karte h2", "Meine Woche") === 1 && e.gibt(".woche.flach") === 1 && e.gibt(".woche:not(.flach)") === 0
      && e.gibt(".wochen-sterne") === 1 && e.gibt("#inhalt .karte:first-child .kacheln") === 0, "Erfolge des Kindes", "Wochenkarte in Erfolge nicht wie in der Statistik");
    // Datum der Wochen-Abzeichen: die Runde, mit der das Wochenziel erreicht war, nicht der Sonntag der Woche (der in der
    // laufenden Woche noch kommt; LERN_Session33). Ziel 1 Tag × 1 Minute: die erste Runde der Woche (vor zwei Tagen) reicht.
    const wann = JSON.parse(e.lauf(`JSON.stringify((() => {
      const runden = LS.protokoll().filter(x => x.name === "Mia" && !x.test).sort((a, b) => (a.zeit < b.zeit ? -1 : 1));
      const a = ERFOLGE.abzeichen("Mia", LS.profil("Mia"), runden, LS.rekorde(), 0, null).find(x => x.id === "wochenstern");
      return { erreicht: a.erreicht, runden: runden.map(x => x.zeit), jetzt: new Date().toISOString() };
    })())`));
    pruefe(!!wann.erreicht && wann.erreicht <= wann.jetzt && wann.erreicht === wann.runden[0], "Erfolge des Kindes",
      `Wochenstern mit Datum ${wann.erreicht} statt der ersten Runde der Woche ${wann.runden[0]}`);
    fehlerVon("Erfolge des Kindes", e);
  }
  return schritte;
}

/**
 * Vorgaben der Aufsicht zu den Empfehlungen ans Kind (KS4 a): anheften, ausblenden, eigene Empfehlung, Rangfolge hinter
 * ⓘ, und was das Kind danach sieht. Async (Anmeldung der Aufsicht mit PIN). Gibt die Zahl der Prüfschritte zurück.
 */
async function pruefeEmpfehlungen(melde) {
  let schritte = 0;
  const pruefe = (ok, ort, text) => { schritte++; if (!ok) melde(ort, text); };
  const fehlerVon = (ort, s) => { for (const f of new Set(s.fehler())) melde(ort, f); };
  const ort = "Empfehlungen der Aufsicht";
  // Runden wie in „Statistik des Kindes“: Zahlenhaus s3 zweimal drei Sterne (→ weiter), s1 mit vielen Fehlern (→ wiederholen)
  const vorher = `LS.neuerSpieler("Mia", { klasse: 2 }); LS.setzeSpieler("Mia");
    const vor = t => new Date(Date.now() - t * 864e5).toISOString();
    const liste = falsch => Array.from({ length: 6 }, (_, i) => i < falsch ? { text: "3 + 4", versuche: 2, geloest: false, gezeigt: true, loesung: "7" } : { text: "1 + 1", versuche: 0, geloest: true });
    for (const [stufe, sterne, falsch, t] of [["s3", 3, 0, 2], ["s3", 3, 0, 0], ["s1", 1, 4, 1], ["s1", 1, 4, 0]])
      LS.protokolliere({ name: "Mia", zeit: vor(t), inhalt: "zahlenhaus", stufe, aufgaben: 6, fehler: falsch, dauer: 90, sterne, liste: liste(falsch) });`;
  const browser = new Map();
  const s = oeffne({ hash: "#statistik", speicher: browser, vorher });
  await ruheAsync(s);
  const an = await s.lauf(`(async () => { LS.neuerSpieler("Mama", { rolle: "aufsicht" }); await LS.setzePin("Mama", "2468"); return LS.meldeAufsichtAn("Mama", "2468"); })()`);
  pruefe(!!an, ort, "Aufsicht nicht angemeldet");
  // gleiche Adresse, darum kein hashchange: neu zeichnen
  s.lauf(`statistikVon = "Mia"; zeichneStart()`);
  await ruheAsync(s);
  pruefe(s.lauf("LS.aufsichtAngemeldet()") === true && s.gibt("h2", "Das empfehle ich für Mia") === 1, ort, "Statistik der Aufsicht für Mia nicht gezeichnet");
  const fuerKind = () => JSON.parse(s.lauf(`JSON.stringify(AUSWERTUNG.fuerKind("Mia", LS.protokoll().filter(e => e.name === "Mia"), LS.profil("Mia")))`));
  const vorgaben = () => s.profil("Mia").empfehlungen || { oben: [], aus: [] };
  // Rangfolge hinter ⓘ, was das Kind sieht
  pruefe(s.gibt(".rangfolge li") === s.lauf("AUSWERTUNG.RANGFOLGE.length") && s.lauf(`document.querySelector(".rangfolge").hidden`) === true,
    ort, "Rangfolge fehlt oder ist nicht hinter ⓘ");
  s.klick("button.karten-info", "ⓘ");
  pruefe(s.lauf(`document.querySelector(".rangfolge").hidden`) === false, ort, "ⓘ zeigt die Rangfolge nicht");
  pruefe(s.gibt(".fuer-kind-sieht", "sieht jetzt") === 1, ort, "keine Zeile, was das Kind sieht");
  // Ausblenden: der Vorschlag „wiederholen“ fehlt danach beim Kind, die Aufsicht sieht ihn grau mit „Wieder zeigen“
  pruefe(fuerKind().some(v => v.art === "wiederholen"), ort, "Gegenprobe: „wiederholen“ steht vor dem Ausblenden nicht beim Kind");
  s.klick('.vorschlag[data-art="wiederholen"] button', "ausblenden");
  await ruheAsync(s);
  pruefe(vorgaben().aus.length === 1 && vorgaben().aus[0].von === "Mama" && !fuerKind().some(v => v.art === "wiederholen"), ort, "Ausblenden wirkt nicht");
  pruefe(s.gibt('.vorschlag.fuer-kind-aus[data-art="wiederholen"]') === 1 && s.gibt('.vorschlag[data-art="wiederholen"] button', "Wieder zeigen") === 1,
    ort, "ausgeblendeter Vorschlag nicht grau mit „Wieder zeigen“");
  // Anheften: „weiter“ steht beim Kind zuerst, von Mama
  s.klick('.vorschlag[data-art="weiter"] button', "Fürs Kind oben");
  await ruheAsync(s);
  pruefe(vorgaben().oben.length === 1 && fuerKind()[0]?.art === "aufsicht" && fuerKind()[0]?.von === "Mama", ort, "Anheften: nicht zuerst beim Kind");
  // Eigene Empfehlung: Spiel und Stufe wählen
  const anderes = s.lauf(`SPIELE.find(x => x.id !== "zahlenhaus" && LS.fuerKinderSichtbar(x.id))?.id || ""`);
  pruefe(!!anderes, ort, "Gegenprobe: kein zweites Spiel für Kinder sichtbar");
  if (anderes) {
    s.lauf(`(() => { const w = document.querySelector(".eigene-empfehlung select"); w.value = ${JSON.stringify(anderes)}; w.dispatchEvent(new Event("change")); })()`);
    s.klick(".eigene-empfehlung button", "Empfehlen");
    await ruheAsync(s);
    pruefe(vorgaben().oben.length === 2 && vorgaben().oben[1].spiel === anderes && fuerKind()[1]?.spiel === anderes, ort, "eigene Empfehlung nicht an zweiter Stelle beim Kind");
  }
  fehlerVon(ort, s);
  // Das Kind sieht die Vorgaben zuerst, mit „⭐ Von Mama“, ohne den ausgeblendeten Vorschlag
  // eigener Browser (Kopie): setzeSpieler würde sonst die Aufsicht auf der ersten Seite abmelden
  const k = oeffne({ hash: "#statistik", speicher: new Map(browser), vorher: `LS.setzeSpieler("Mia");` });
  await ruheAsync(k);
  pruefe(k.lauf(`document.querySelector(".vorschlag-karte")?.dataset.art`) === "aufsicht" && k.gibt(".vorschlag-karte .vorschlag-satz", "Von Mama") >= 1
    && k.gibt('.vorschlag-karte[data-art="wiederholen"]') === 0, "Empfehlungen beim Kind", "Vorgaben nicht zuerst, ohne „⭐ Von Mama“ oder mit dem ausgeblendeten");
  fehlerVon("Empfehlungen beim Kind", k);
  // Zurücknehmen
  s.klick(".fuer-kind-oben button", "Zurücknehmen");
  await ruheAsync(s);
  pruefe(vorgaben().oben.length === (anderes ? 1 : 0), ort, "Zurücknehmen wirkt nicht");
  s.klick('.vorschlag[data-art="wiederholen"] button', "Wieder zeigen");
  await ruheAsync(s);
  pruefe(vorgaben().aus.length === 0 && fuerKind().some(v => v.art === "wiederholen"), ort, "„Wieder zeigen“ wirkt nicht");
  return schritte;
}

module.exports = { pruefeTabSpiele, pruefeSpeicher, pruefeEmpfehlungen };
