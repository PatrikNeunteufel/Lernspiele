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

/** Die Startseite öffnen; speicher (Map) = derselbe Browser wie eine frühere Seite. */
function oeffne({ search = "", hash = "#spiele", speicher = new Map(), seed = 1, vorher = "" } = {}) {
  const datei = path.join(APP, "index.html");
  const html = fs.readFileSync(datei, "utf8");
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1].replace(/<script[\s\S]*?<\/script>/g, "");
  const meldungen = [];
  const konsole = { log() {}, info() {}, warn() {}, debug() {}, error: (...a) => meldungen.push(a.map(String).join(" ")) };
  const k = vm.createContext({ __seite: { html: body, search, hash, pfad: "/eulenpfad/index.html", seed, speicher }, console: konsole,
    URL, URLSearchParams, structuredClone, crypto: globalThis.crypto, TextEncoder, TextDecoder, Blob, atob, btoa });
  const lauf = (code, name = "prüfung") => vm.runInContext(code, k, { filename: name, timeout: 20000 });
  lauf(DOM, "pruef_dom.js");
  lauf(HILFEN, "hilfen");
  const skripte = [...html.matchAll(/<script(?:\s+src="([^"]+)")?[^>]*>([\s\S]*?)<\/script>/g)];
  for (const m of skripte) {
    // Vor dem letzten Skript (start.js zeichnet die Seite) die Person anlegen und anmelden
    if (m[1] === "start/start.js" && vorher) lauf(vorher, "vorher");
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
    pruefe(s.gibt("button", "Alle auf") === 1 && s.gibt("button", "Alle zu") === 1, ort, "„Alle auf“ / „Alle zu“ fehlen bei Gruppen");
    textPruefen(ort, s);
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

module.exports = { pruefeTabSpiele };
