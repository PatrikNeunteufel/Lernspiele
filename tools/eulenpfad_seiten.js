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
    pruefe(s.gibt("details.filter-klapp") === 1, ort, "kein Filter-Block");
    // Gruppen des Filters (LERN_Session32): je für sich einklappbar, vorgegeben zu, Aufklappen merkt das Profil
    pruefe(s.gibt("details.filter-gruppe") >= 3 && s.lauf(`[...document.querySelectorAll("details.filter-gruppe")].every(d => !d.open)`), ort, "Gruppen des Filters fehlen oder sind nicht zu");
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
      // Stil „wie von Hand gezeichnet“ (Einstellung stil, start/stil.js, LERN_Session32): umschaltbar, Pfad geschlossen
      // und je Element gleich, Raster je Spiel verschoben, ab und zu eine Lücke; glatt ohne Klasse, ohne Lücke
      pruefe(s.lauf(`document.body.classList.contains("stil-hand")`) === false && s.gibt(".raster-luecke") === 0, ort, "Stil „hand“ ohne Einstellung an");
      s.lauf(`LS.setzeEinstellung("stil", "hand"); zeichneStart()`); ruhe(s);
      pruefe(s.lauf(`document.body.classList.contains("stil-hand")`) === true, ort, "Einstellung „hand“ schaltet den Stil nicht ein");
      pruefe(s.gibt(".raster-luecke") > 0, ort, "Stil „hand“ ohne Lücke im Raster");
      pruefe(s.lauf(`(() => { const k = document.querySelector('${k}'); return k.dataset.stil === "1" && /px$/.test(k.style.getPropertyValue("--rx")); })()`), ort, "Spielkarte im Stil „hand“ nicht eingebunden (Raster)");
      const pfad = s.lauf(`[STIL.pfad(300, 420, "${id}", "oben"), STIL.pfad(300, 420, "${id}", "oben"), STIL.pfad(300, 420, "anders", null)]`);
      pruefe(/^M[\d.,\s L-]+Z M[\d.,\s L-]+Z$/.test(pfad[0]) && pfad[0] === pfad[1] && pfad[0] !== pfad[2], ort, "Handrahmen: Pfad ungültig oder nicht je Element gleich");
      s.lauf(`LS.setzeEinstellung("stil", null); zeichneStart()`); ruhe(s);
      pruefe(s.lauf(`document.body.classList.contains("stil-hand")`) === false && s.gibt(".raster-luecke") === 0, ort, "Stil „hand“ bleibt nach dem Zurückstellen");
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
    // Filter-Block: Zuklappen im Profil (filterZu)
    s.klappe("details.filter-klapp", false);
    pruefe(s.profil("Mia").filterZu === true, ort, "Filter zugeklappt, aber filterZu nicht gemerkt");
    s.klappe("details.filter-klapp", true);
    pruefe(s.profil("Mia").filterZu === false, ort, "Filter aufgeklappt, aber filterZu nicht gemerkt");
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
  return schritte;
}

module.exports = { pruefeTabSpiele, pruefeSpeicher };
