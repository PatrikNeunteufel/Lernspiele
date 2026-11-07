// Seiten des Lernsteigs im Ersatz-DOM (Plan docs/plan_angleich_reihe.md B2, Schritt 2; ersetzt den Browser-Teil mit
// Playwright): Startseite in allen Rollen und Tabs, Konten über die Bedienung (anlegen mit PIN, falsche PIN, PIN
// vergessen, Aufsicht anlegen), jede Übung in jeder Stufe und jedem Niveau mit einer durchgespielten Runde, Rechner und
// Serie. Gemeldet wird: Ausnahmen und Konsolenfehler, sichtbarer Text mit NaN, undefined, null, Infinity oder [object …],
// falsches Verhalten. Läuft wie tools/pruefe_spiele.js über tools/pruef_dom.js; aufgerufen von tools/pruefe_uebungen.js.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WURZEL = path.join(__dirname, "..");
const APP = path.join(WURZEL, "lernsteig");
const DOM = fs.readFileSync(path.join(__dirname, "pruef_dom.js"), "utf8");
const VERDAECHTIG = /\bNaN\b|\bundefined\b|\bnull\b|\bInfinity\b|\[object /;
const CODE = /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

// Hilfen in der Seite: suchen, klicken, ausfüllen (wie ein Mensch: Element per Selektor, wahlweise mit Text)
const HILFEN = `
globalThis.__alle = (sel, text) => [...document.querySelectorAll(sel)].filter(e => !text || e.textContent.includes(text));
globalThis.__finde = (sel, text) => { const e = __alle(sel, text)[0]; if (!e) throw new Error("nicht gefunden: " + sel + (text ? " „" + text + "“" : "")); return e; };
globalThis.__klick = (sel, text) => __finde(sel, text).click();
globalThis.__fuelle = (sel, wert) => { const e = __finde(sel); e.value = String(wert); e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); };
globalThis.__text = () => __textMitAbstand(document.body); // mit Abstand zwischen den Knoten (pruef_dom.js)
`;

/** Eine Seite öffnen. speicher/sitzung (Map): derselbe Browser bzw. derselbe Tab wie eine frühere Seite. */
function oeffne(rel, { search = "", hash = "", speicher = new Map(), sitzung = new Map(), seed = 1, pruefstand = null } = {}) {
  const datei = path.join(APP, rel);
  const html = fs.readFileSync(datei, "utf8");
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1].replace(/<script[\s\S]*?<\/script>/g, "");
  const meldungen = [];
  const konsole = { log() {}, info() {}, warn() {}, debug() {}, error: (...a) => meldungen.push(a.map(String).join(" ")) };
  const pfad = "/lernsteig/" + rel.replace(/\\/g, "/");
  const k = vm.createContext({ __seite: { html: body, search, hash, pfad, seed, speicher, sitzung }, console: konsole,
    URL, URLSearchParams, structuredClone, crypto: globalThis.crypto, TextEncoder, TextDecoder, Blob, atob, btoa });
  const lauf = (code, name = "prüfung") => vm.runInContext(code, k, { filename: name, timeout: 20000 });
  lauf(DOM, "pruef_dom.js");
  lauf(HILFEN, "hilfen");
  for (const m of html.matchAll(/<script(?:\s+src="([^"]+)")?[^>]*>([\s\S]*?)<\/script>/g)) {
    if (!m[1]) { lauf(m[2], rel + " (inline)"); continue; }
    const p = path.join(path.dirname(datei), m[1]);
    // Für die Prüfung gilt jede Übung und Liste als geprüft (die Sperre selbst prüfen tools/pruefe_konten.js und die Startseite)
    const code = pruefstand && /gemeinsam[\\/]pruefstand\.js$/.test(p) ? `const LST_PRUEFSTAND = ${JSON.stringify(pruefstand)};` : fs.readFileSync(p, "utf8");
    lauf(code, m[1]);
  }
  return {
    lauf, speicher, sitzung,
    fehler: () => [...lauf("__fehler"), ...meldungen],
    text: () => lauf("__text()"),
    klick: (sel, text) => lauf(`__klick(${JSON.stringify(sel)}, ${JSON.stringify(text || "")})`),
    fuelle: (sel, wert) => lauf(`__fuelle(${JSON.stringify(sel)}, ${JSON.stringify(wert)})`),
    gibt: (sel, text) => lauf(`__alle(${JSON.stringify(sel)}, ${JSON.stringify(text || "")}).length`),
    attr: (sel, a) => lauf(`__finde(${JSON.stringify(sel)}).getAttribute(${JSON.stringify(a)})`),
    hash: h => lauf(`location.hash = ${JSON.stringify(h)}`),
    json: schluessel => JSON.parse(speicher.get(schluessel) || "null"),
  };
}

/** Warten, bis Versprechen (PIN-Prüfwerte über crypto.subtle) und kurze Timer erledigt sind. */
async function ruhe(s, ms = 50, runden = 12) {
  for (let i = 0; i < runden; i++) {
    await new Promise(r => setImmediate(r));
    s.lauf(`__uhr.weiter(${ms})`);
  }
}

// Eingaben fürs Durchspielen: Zahl oder Term
const klar = x => Number(x.toPrecision(15)).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 });
const richtigeEingabe = a => (a.art === "term" ? a.antwortTerm : klar(a.antwort));
const falscheEingabe = a => (a.art === "term" ? a.antwortTerm + " + 1" : klar(a.antwort + 1));

async function antworte(s, a, richtig) {
  if (a.art === "auswahl") {
    const i = richtig ? a.richtig : (a.richtig + 1) % a.optionen.length;
    s.klick(`.knopf.wahl[data-taste="${i + 1}"]`);
  } else {
    s.fuelle(".eingabe", richtig ? richtigeEingabe(a) : falscheEingabe(a));
    s.klick(".antwort button.knopf.haupt", "Prüfen");
  }
  await ruhe(s, 20, 3);
}

/**
 * Alle Seitenprüfungen. uebungen: Katalog-Einträge; melde(ort, text): Fehler; LST: Werkzeug des Lernsteigs (stufenListe).
 */
async function pruefeSeiten(uebungen, melde, LST) {
  const fehlerVon = (ort, s) => { for (const f of new Set(s.fehler())) melde(ort, f); };
  const textPruefen = (ort, s) => { const t = s.text(); if (VERDAECHTIG.test(t)) melde(ort, `verdächtiger Text: …${t.slice(Math.max(0, t.search(VERDAECHTIG) - 60), t.search(VERDAECHTIG) + 40)}…`); };
  // Für die Prüfung gilt jede Übung und jede Liste als geprüft (die Sperre selbst prüfen pruefe_konten.js und die Startseite)
  const frei = { uebungen: {}, listen: {} };
  for (const e of uebungen) {
    frei.uebungen[e.id] = { am: "2026-01-01", von: "Prüfung" };
    for (const l of Object.keys(e.listen || {})) frei.listen[`${e.id}/${l}`] = { am: "2026-01-01", von: "Prüfung" };
  }
  const TABS = ["uebungen", "profil", "statistik", "erfolge"];
  const tabsPruefen = async (ort, s, mitVerwaltung) => {
    for (const t of TABS.concat(mitVerwaltung ? ["verwaltung"] : [])) {
      s.hash("#" + t);
      await ruhe(s);
      const gewaehlt = s.lauf(`(document.querySelector('.tab[aria-selected="true"]') || {}).getAttribute?.("href") || ""`);
      if (gewaehlt !== "#" + t) melde(`${ort} #${t}`, `gewählter Tab ist „${gewaehlt}“`);
      textPruefen(`${ort} #${t}`, s);
    }
  };

  // ---------- Startseite: niemand, Gast ----------
  {
    const ort = "Start (niemand)";
    const s = oeffne("index.html");
    await ruhe(s);
    if (!/Wer übt\?|Willkommen im Lernsteig/.test(s.text())) melde(ort, "keine Anmeldung zu sehen");
    if (!s.gibt('[data-aktion="neu"]') || !s.gibt('[data-aktion="gast"]')) melde(ort, "„Ich bin neu“ oder „Als Gast weiter“ fehlt");
    textPruefen(ort, s);
    s.klick('[data-aktion="gast"]');
    await ruhe(s);
    if (!s.gibt(".tab")) melde("Start (Gast)", "nach „Als Gast weiter“ keine Tabs");
    await tabsPruefen("Start (Gast)", s, false);
    if (s.gibt('.tab[href="#verwaltung"]')) melde("Start (Gast)", "Gast sieht die Verwaltung");
    fehlerVon("Start (Gast)", s);
  }

  // ---------- Konto anlegen mit PIN, Tabs als Jugendlicher ----------
  const browser = new Map(); // localStorage des „Geräts“
  let konto = null, code = null, jugendTab = null;
  {
    const ort = "Konto (Bedienung)";
    const s = oeffne("index.html", { speicher: browser });
    await ruhe(s);
    try {
      s.klick('[data-aktion="neu"]'); await ruhe(s);
      s.klick('[data-aktion="neu-jugend"]'); await ruhe(s);
      s.fuelle('input[name="vorname"]', "Test"); s.fuelle('input[name="geboren"]', "2012-03-15"); s.fuelle('input[name="pin"]', "4711");
      s.klick('[data-aktion="anlegen"]', "Konto anlegen"); await ruhe(s);
      code = s.attr(".code-anzeige", "data-code");
      if (!CODE.test(code || "")) melde(ort, `Wiederherstellungscode fehlt: ${code}`);
      konto = (s.json("lernsteig:personen") || []).find(p => p.rolle === "lernend");
      if (!konto) melde(ort, "Konto nicht gespeichert");
      else if (!konto.pin || konto.pin.hash.length !== 64 || JSON.stringify(konto).includes('"4711"') || JSON.stringify(konto).includes(code)) melde(ort, "PIN oder Code im Klartext gespeichert");
      if (konto && Number(konto.klasse) !== 7) melde(ort, `Klasse ${JSON.stringify(konto.klasse)} statt 7 (Vorgabe im Formular)`);
      s.klick("button", "Aufgeschrieben"); await ruhe(s);
      if (!s.lauf(`(document.querySelector(".personen-knopf") || {}).textContent || ""`).includes("Test")) melde(ort, "Personen-Knopf zeigt nicht „Test“");
      await tabsPruefen("Start (Jugendlicher)", s, false);
      jugendTab = s.sitzung;
    } catch (e) { melde(ort, e.message); }
    fehlerVon(ort, s);
  }

  // ---------- Neuer Tab: falsche PIN, PIN vergessen ----------
  if (konto) {
    const ort = "Anmelden mit PIN (neuer Tab)";
    const s = oeffne("index.html", { speicher: browser });
    await ruhe(s);
    try {
      s.klick(`[data-konto="${konto.id}"]`); await ruhe(s);
      s.fuelle('input[name="pin"]', "0000"); s.klick('[data-aktion="anmelden"]'); await ruhe(s);
      if (!/stimmt nicht/.test(s.lauf(`(document.querySelector(".fehlertext") || {}).textContent || ""`))) melde(ort, "falsche PIN angenommen");
      s.klick("button", "PIN vergessen?"); await ruhe(s);
      s.fuelle('input[name="code"]', code.toLowerCase()); s.fuelle('input[name="neuepin"]', "1234");
      s.klick('[data-aktion="zuruecksetzen"]'); await ruhe(s);
      const neu = s.attr(".code-anzeige", "data-code");
      if (!CODE.test(neu || "") || neu === code) melde(ort, `nach dem Zurücksetzen kein neuer Code (${neu})`);
    } catch (e) { melde(ort, e.message); }
    fehlerVon(ort, s);
  }

  // ---------- Aufsicht anlegen, Verwaltung, kein Zugriff ohne Verbindung ----------
  {
    const ort = "Aufsicht (Bedienung)";
    const s = oeffne("index.html", { speicher: browser });
    await ruhe(s);
    try {
      s.klick('[data-aktion="neu"]'); await ruhe(s);
      s.klick('[data-aktion="neu-aufsicht"]'); await ruhe(s);
      s.fuelle('input[name="name"]', "Frau Muster"); s.fuelle('select[name="rolle"]', "lehrperson"); s.fuelle('input[name="pin"]', "2580");
      // ohne Sicherheitsfrage nicht (RL2 a)
      s.klick('[data-aktion="anlegen"]', "Aufsicht anlegen"); await ruhe(s);
      if (!/Sicherheitsfrage/.test(s.lauf(`(document.querySelector(".fehlertext") || {}).textContent || ""`))) melde(ort, "Aufsicht ohne Sicherheitsfrage angelegt");
      s.fuelle('input[name="frage"]', "Erstes Haustier?"); s.fuelle('input[name="antwort"]', "Bello");
      s.klick('[data-aktion="anlegen"]', "Aufsicht anlegen"); await ruhe(s);
      if (!CODE.test(s.attr(".code-anzeige", "data-code") || "")) melde(ort, "Code der Aufsicht fehlt");
      const auf = JSON.stringify((s.json("lernsteig:personen") || []).filter(p => p.rolle === "aufsicht"));
      if (auf.includes('"2580"') || !/"hash":"[0-9a-f]{64}"/.test(auf)) melde(ort, "Aufsicht-PIN im Klartext");
      if (!auf.includes('"lehrperson"')) melde(ort, "Rolle „lehrperson“ nicht gespeichert");
      s.klick("button", "Aufgeschrieben"); await ruhe(s);
      await tabsPruefen("Start (Aufsicht)", s, true);
      if (konto) {
        s.hash(`#statistik/${konto.id}`); await ruhe(s);
        if (s.text().includes("4711") || !/nicht (mit (dir|Ihnen|der angemeldeten Aufsicht) )?verbunden|keine Verbindung|nicht verbunden/i.test(s.text())) melde(ort, "Statistik eines nicht verbundenen Kontos ohne Hinweis");
      }
      // Gerät ohne Rechner (Einstellung der Aufsicht): in einer Übung mit Rechner fehlt dann der Knopf
      const mitRechner = uebungen.find(x => x.rechner && x.stufen.some(lp => x.rechner[lp] && x.rechner[lp] !== "ohne"));
      if (mitRechner && konto) {
        s.hash("#verwaltung"); await ruhe(s);
        s.fuelle('select[name="rechner"]', "ohne"); await ruhe(s);
        const lp = mitRechner.stufen.find(x => mitRechner.rechner[x] && mitRechner.rechner[x] !== "ohne");
        const u = oeffne(`uebungen/${mitRechner.id}/index.html`, { search: `?niveau=${mitRechner.niveaus[0]}&stufe=${lp}`, speicher: browser, sitzung: new Map(jugendTab), pruefstand: frei });
        await ruhe(u);
        if (!u.lauf("LST.pruefung.aufgabe()")) melde(ort, "Übung für die Rechner-Sperre nicht gestartet");
        else if (u.gibt(".rechner-knopf")) melde(ort, "Rechner-Knopf trotz Sperre der Aufsicht");
        fehlerVon(ort + " (Übung)", u);
        s.fuelle('select[name="rechner"]', "uebung"); await ruhe(s);
      }
    } catch (e) { melde(ort, e.message); }
    fehlerVon(ort, s);
  }

  // ---------- Einladung über den Link (EL1 a): füllt „Neues Konto“ vor, das Fragment verschwindet ----------
  {
    const ort = "Einladung (Link)";
    const vorlage = oeffne("index.html");
    const fragment = vorlage.lauf(`LST_KONTEN.einladungErstellen({ name: "Noah", geboren: "2013-01-02", klasse: 7, lehrplan: { land: "CH", kanton: "SG" } }, "eulenpfad")`);
    const s = oeffne("index.html", { hash: fragment });
    await ruhe(s);
    try {
      if (s.lauf(`(document.querySelector('input[name="vorname"]') || {}).value`) !== "Noah") melde(ort, "Vorname aus der Einladung nicht eingetragen");
      if (s.lauf("location.hash")) melde(ort, `Fragment nicht gelöscht: ${s.lauf("location.hash").slice(0, 30)}`);
      textPruefen(ort, s);
    } catch (e) { melde(ort, e.message); }
    fehlerVon(ort, s);
  }

  // ---------- Jede Übung: Stufe × Niveau, eine Runde mit einem Fehlversuch ----------
  let gespielt = 0;
  if (!konto) return { gespielt };
  const alsJugendlicher = () => ({ speicher: new Map([...browser].filter(([k]) => !/runden|rekorde/.test(k))), sitzung: new Map(jugendTab), pruefstand: frei });
  for (const e of uebungen) {
    for (const niveau of e.niveaus) {
      for (const stufe of LST.stufenListe(e).map(x => x.id)) {
        const ort = `${e.id} ${niveau}/${stufe} (Seite)`;
        const s = oeffne(`uebungen/${e.id}/index.html`, { search: `?niveau=${niveau}&stufe=${stufe}`, ...alsJugendlicher() });
        await ruhe(s);
        try {
          const kennungen = new Set();
          const arten = []; // Art der Antwort je Aufgabe (zahl, term, auswahl): bei zahl wird der Notizblock angeboten
          const rueck = () => s.lauf(`document.querySelector(".rueckmeldung").textContent`).trim();
          for (let i = 0; i < e.anzahl; i++) {
            const a = s.lauf("LST.pruefung.aufgabe()");
            if (!a) throw new Error(`keine Aufgabe bei Nummer ${i + 1}: ${s.text().replace(/\s+/g, " ").trim().slice(0, 160)}`);
            kennungen.add(a.kennung);
            arten.push(a.art);
            textPruefen(ort, s);
            // TF1 a: bei Zahl- und Term-Antworten ein Tastenfeld, die Tastatur des Geräts bleibt zu; bei Termen mit den
            // Zeichen der Aufgabe
            if (a.art !== "auswahl") {
              const tf = s.lauf(`(() => { const t = document.querySelector(".antwort .antwort-tasten"); return t ? { tasten: [...t.querySelectorAll("button")].map(b => b.textContent), modus: document.querySelector(".eingabe").getAttribute("inputmode") } : null; })()`);
              if (!tf) melde(ort, "kein Tastenfeld bei einer Eingabe");
              else {
                const fehlt = [..."0123456789", "⌫", "Prüfen", ...(a.art === "term" ? a.tasten || [] : ["±"])].filter(t => !tf.tasten.includes(t));
                if (fehlt.length) melde(ort, `Tastenfeld ohne ${fehlt.join(" ")}`);
                // jedes Zeichen der Lösung lässt sich mit den Tasten tippen (Meldung Patrik: „b · b · b“ ohne Taste b)
                if (a.art === "term") {
                  const noetig = [...new Set([...a.antwortTerm.replace(/[\s']/g, "")].map(c => (c === "-" ? "−" : c === "*" ? "·" : c)))];
                  const ohne = noetig.filter(c => !tf.tasten.includes(c));
                  if (ohne.length) melde(ort, `Lösung „${a.antwortTerm}“ nicht tippbar: keine Taste ${ohne.join(" ")} (${a.text})`);
                }
                if (tf.modus !== "none") melde(ort, `Eingabe mit inputmode „${tf.modus}“ statt none`);
              }
            }
            // Grafik im Bild (LERN_Session19): höchstens so hoch wie breit — vorher bis 2900 px (kraefte)
            if (a.darstellung && a.darstellung.art === "graph") {
              const vb = (s.lauf(`(document.querySelector(".aufgabe svg.graph") || { getAttribute: () => "" }).getAttribute("viewBox")`) || "").split(" ").map(Number);
              if (vb.length !== 4 || !(vb[3] <= vb[2])) melde(ort, `Grafik höher als breit (viewBox ${vb.join(" ")})`);
            }
            if (i === 0) await antworte(s, a, false);
            await antworte(s, a, true);
            // RA8 a: auf Anhieb nur „Richtig.“; nach einem Fehlversuch der Weg (falls die Aufgabe einen hat)
            const t = rueck();
            if (i > 0 && t !== "Richtig.") melde(ort, `auf Anhieb richtig steht mehr als „Richtig.“: «${t.slice(0, 100)}»`);
            if (i === 0 && a.weg && !t.includes(a.weg)) melde(ort, "richtig nach einem Fehlversuch: der Weg fehlt");
            s.klick(".knopf.weiter"); await ruhe(s, 20, 3);
          }
          // RA5 a: keine Aufgabe zweimal in der Runde (jede Stufe hat mindestens so viele verschiedene wie eine Runde),
          // das Gedächtnis je Konto, Übung und Stufe (ohne Niveau) kennt alle gestellten (dazu, was frühere Teile dieses
          // Tests im selben Browser gestellt haben)
          if (kennungen.size !== e.anzahl) melde(ort, `${e.anzahl - kennungen.size} Wiederholung(en) in einer Runde`);
          const gd = Object.entries(s.json("lernsteig:gestellt") || {}).find(([k]) => k.endsWith(`|${e.id}/${stufe}`));
          const fps = s.lauf(`${JSON.stringify([...kennungen])}.map(k => KERN.runden.fingerabdruck(k))`);
          const fehlt = fps.filter(f => !(gd && gd[1].includes(f))).length;
          if (fehlt) melde(ort, `Gedächtnis: ${fehlt} von ${fps.length} gestellten Aufgaben fehlen`);
          textPruefen(ort + " Ergebnis", s);
          const r = s.json("lernsteig:runden") || [];
          if (r.length !== 1) throw new Error(`${r.length} Runden im Protokoll statt 1`);
          const x = r[0];
          if (x.aufgaben !== e.anzahl || x.aufAnhieb !== e.anzahl - 1 || x.fehler !== 1 || x.niveau !== niveau || x.stufe !== stufe) throw new Error(`Protokoll unplausibel: ${JSON.stringify(x).slice(0, 200)}`);
          // NB2 a: bei Zahl-Antworten bot die Aufgabe den Notizblock an (hier unbenutzt: „ohne“), sonst nicht
          const notiz = (x.liste || []).map(l => (l.vorgehen || {}).notiz || null);
          const soll = arten.map(art => (art !== "auswahl" && art !== "term" && e.notizblock !== false ? "ohne" : null));
          if (JSON.stringify(notiz) !== JSON.stringify(soll)) melde(ort, `Notizblock im Eintrag je Aufgabe: ${JSON.stringify(notiz)} statt ${JSON.stringify(soll)}`);
          gespielt++;
          // Nach der ersten Runde einer Übung: Statistik und Erfolge zeigen sie (derselbe Browser, derselbe Tab)
          if (niveau === e.niveaus[0] && stufe === e.stufen[0]) {
            const st = oeffne("index.html", { hash: "#statistik", speicher: s.speicher, sitzung: s.sitzung, pruefstand: frei });
            await ruhe(st);
            if (st.gibt(".runden-tabelle tbody tr") !== 1) melde(`${e.id} Statistik`, `letzte Runden: ${st.gibt(".runden-tabelle tbody tr")} Zeilen statt 1`);
            textPruefen(`${e.id} Statistik`, st);
            st.hash("#erfolge"); await ruhe(st);
            // Stand je Übung steht seit C2 im Tab Erfolge (BF1 a)
            if (!st.gibt(`.stand-liste [data-uebung="${e.id}"]`)) melde(`${e.id} Erfolge`, "Stand je Übung fehlt nach einer Runde");
            textPruefen(`${e.id} Erfolge`, st);
            fehlerVon(`${e.id} Statistik`, st);
          }
        } catch (err) { melde(ort, err.message); }
        fehlerVon(ort, s);
      }
    }

    // Rechner je Lehrplan-Stufe: bei „ohne“ kein Knopf, sonst 12 · 3 rechnen, übernehmen, Nutzung im Protokoll
    for (const lp of e.stufen) {
      const art = e.rechner ? (e.rechner[lp] || "frei") : "ohne";
      const ort = `${e.id} ${e.niveaus[0]}/${lp} Rechner (Seite)`;
      const s = oeffne(`uebungen/${e.id}/index.html`, { search: `?niveau=${e.niveaus[0]}&stufe=${lp}`, ...alsJugendlicher() });
      await ruhe(s);
      try {
        const knopf = s.gibt(".rechner-knopf");
        if (art === "ohne") { if (knopf) throw new Error("Rechner-Knopf trotz „ohne“"); }
        else {
          if (!knopf) throw new Error(`kein Rechner-Knopf bei „${art}“`);
          s.klick(".rechner-knopf");
          for (const t of ["1", "2", "mal", "3", "gleich"]) s.klick(`.rechner .rt[aria-label="${t}"]`);
          s.klick(".rechner .rt.uebernehmen");
          const wert = s.lauf(`document.querySelector(".eingabe").value`);
          if (wert !== "36") throw new Error(`Übernahme ergab „${wert}“ statt 36`);
          for (let i = 0; i < e.anzahl; i++) {
            await antworte(s, s.lauf("LST.pruefung.aufgabe()"), true);
            s.klick(".knopf.weiter"); await ruhe(s, 20, 3);
          }
          const r = s.json("lernsteig:runden") || [];
          if (!r[0] || r[0].mitRechner !== true || !r[0].liste[0].rechner) throw new Error(`Rechner nicht im Protokoll: ${JSON.stringify(r[0] || {}).slice(0, 160)}`);
        }
      } catch (err) { melde(ort, err.message); }
      fehlerVon(ort, s);
    }

    // Serie (Endlos): drei richtig, dann falsch — der Rekord steht, bevor „Zum Ergebnis“ getippt ist
    const st = e.endlos === true ? e.stufen[0] : (e.endlos || [])[0];
    if (st) {
      const ort = `${e.id} ${e.niveaus[0]}/${st} Serie (Seite)`;
      const s = oeffne(`uebungen/${e.id}/index.html`, { search: `?niveau=${e.niveaus[0]}&stufe=${st}&endlos=1`, ...alsJugendlicher() });
      await ruhe(s);
      try {
        for (let i = 0; i < 3; i++) { await antworte(s, s.lauf("LST.pruefung.aufgabe()"), true); s.klick(".knopf.weiter"); await ruhe(s, 20, 3); }
        await antworte(s, s.lauf("LST.pruefung.aufgabe()"), false);
        const rek = s.json("lernsteig:rekorde") || [];
        if (rek.length !== 1 || rek[0].punkte !== 3) throw new Error(`Rekord vor „Zum Ergebnis“: ${JSON.stringify(rek).slice(0, 160)}`);
        textPruefen(ort, s);
      } catch (err) { melde(ort, err.message); }
      fehlerVon(ort, s);
    }
  }
  // ---------- Notizblock (NB1–NB4 a, KERN.notizblock): bei Zahl-Antworten, Mal mit Komma in beiden Zahlen ----------
  {
    const ort = "Notizblock (rationale-zahlen g)";
    const s = oeffne("uebungen/rationale-zahlen/index.html", { search: "?niveau=n1&stufe=g", ...alsJugendlicher() });
    await ruhe(s);
    try {
      if (!s.gibt(".nb-knopf")) throw new Error("kein Knopf „Notizblock“ bei einer Zahl-Antwort");
      s.klick(".nb-knopf");
      if (!s.gibt(".notizblock")) throw new Error("Notizblock öffnet nicht");
      // ohne Eintrag im Katalog die Standard-Vorlagen, ohne Gleichung und ohne ihre Zeichen (GL1 a)
      const chips = s.lauf(`[...document.querySelectorAll(".notizblock .chip")].map(c => c.dataset.vorlage).join(" ")`);
      if (chips !== "+ − × : frei" || s.gibt(".notizblock .nb-zeichen")) throw new Error(`Vorlagen „${chips}“, Zeichen ${s.gibt(".notizblock .nb-zeichen")}`);
      s.klick('.notizblock .chip[data-vorlage="×"]');
      const zahlen = s.lauf(`[...document.querySelectorAll(".notizblock .nb-zahl")].length`);
      if (zahlen !== 2) throw new Error(`Mal: ${zahlen} Zahlenfelder statt 2`);
      s.lauf(`(() => { const f = [...document.querySelectorAll(".notizblock .nb-zahl")]; f[0].value = "0.47"; f[1].value = "0.8"; })()`);
      s.klick(".notizblock button", "Untereinander schreiben");
      const regel = s.lauf(`(document.querySelector(".notizblock .nb-kommaregel") || {}).textContent || ""`);
      if (regel !== "2 + 1 = 3 Stellen nach dem Komma") throw new Error(`Kommaregel „${regel}“`);
      const erg = s.lauf(`document.querySelectorAll(".notizblock .nb-feld.erg").length`);
      if (erg !== 4) throw new Error(`Ergebnis mit ${erg} Häuschen statt 4 (0.376)`);
      s.lauf(`[...document.querySelectorAll(".notizblock .nb-feld.erg")].forEach((f, i) => { f.value = "0376"[i]; })`);
      s.klick('.notizblock .chip[data-vorlage="+"]');
      const start = s.lauf(`document.querySelector(".notizblock .nb-zahl").value`);
      if (start !== "0.376") throw new Error(`Weiterrechnen beginnt mit „${start}“ statt 0.376`);
      // Gegenstück: Komma nur in der ersten Zahl bleibt wie im Eulenpfad (Kommalinie, keine Kommaregel). Die neue Wahl
      // ersetzt die angefangene Plus-Rechnung; geprüft wird die letzte Rechnung auf dem Blatt.
      s.klick('.notizblock .chip[data-vorlage="×"]');
      s.lauf(`(() => { const f = [...document.querySelectorAll(".notizblock .nb-zahl")]; f[0].value = "4.7"; f[1].value = "8"; })()`);
      s.klick(".notizblock button", "Untereinander schreiben");
      const letzte = s.lauf(`(() => { const l = [...document.querySelectorAll(".notizblock .nb-schritt")].pop(); return { linie: !!l.querySelector(".nach-komma"), regel: !!l.querySelector(".nb-kommaregel"), schritte: document.querySelectorAll(".notizblock .nb-schritt").length }; })()`);
      if (!letzte.linie || letzte.regel || letzte.schritte !== 2) throw new Error(`Komma nur in der ersten Zahl: ${JSON.stringify(letzte)} (erwartet Kommalinie, keine Kommaregel, 2 Rechnungen)`);
      textPruefen(ort, s);
      // neue Aufgabe: der Block ist zu und leer; Vorgehen „block“ steht im Eintrag der Aufgabe
      await antworte(s, s.lauf("LST.pruefung.aufgabe()"), true);
      if (s.gibt(".notizblock")) { /* noch dieselbe Aufgabe bis „Weiter“ */ }
      s.klick(".knopf.weiter"); await ruhe(s, 20, 3);
      if (s.gibt(".notizblock")) throw new Error("bei der nächsten Aufgabe ist der Block noch offen");
    } catch (err) { melde(ort, err.message); }
    fehlerVon(ort, s);
  }
  // ---------- Tastenfeld der Antwort (TF1 a, KERN.tastenfeld): mit den Tasten tippen und prüfen ----------
  {
    const ort = "Tastenfeld (rationale-zahlen g, terme)";
    const s = oeffne("uebungen/rationale-zahlen/index.html", { search: "?niveau=n1&stufe=g", ...alsJugendlicher() });
    await ruhe(s);
    try {
      // nach der Beschriftung (der Ersatz-DOM liest keine Attributwerte mit Leerzeichen)
      const BESCHRIFTUNG = { Komma: ".", "Vorzeichen wechseln": "±", "Löschen": "⌫" };
      const taste = name => s.klick(".antwort-tasten button", BESCHRIFTUNG[name] || name);
      const wert = () => s.lauf(`document.querySelector(".eingabe").value`);
      for (const t of ["1", "2", "Komma", "5"]) taste(t);
      if (wert() !== "12.5") throw new Error(`1 2 , 5 ergab „${wert()}“`);
      taste("Vorzeichen wechseln");
      if (wert() !== "−12.5") throw new Error(`± ergab „${wert()}“`);
      taste("Vorzeichen wechseln"); taste("Löschen");
      if (wert() !== "12.") throw new Error(`± ⌫ ergab „${wert()}“`);
      for (let i = 0; i < 3; i++) taste("Löschen");
      if (wert() !== "") throw new Error(`nach viermal ⌫ steht „${wert()}“`);
      // die richtige Antwort nur mit den Tasten, dann „Prüfen“ im Tastenfeld
      const a = s.lauf("LST.pruefung.aufgabe()");
      const z = klar(a.antwort);
      for (const c of z.replace("-", "")) taste(c === "." ? "Komma" : c);
      if (z.startsWith("-")) taste("Vorzeichen wechseln");
      s.klick(".antwort-tasten .tf-pruefen");
      await ruhe(s, 20, 3);
      const t = s.lauf(`document.querySelector(".rueckmeldung").textContent`).trim();
      if (t !== "Richtig.") throw new Error(`${z} mit den Tasten getippt: «${t.slice(0, 80)}»`);
    } catch (err) { melde(ort, err.message); }
    fehlerVon(ort, s);
    const st = oeffne("uebungen/terme/index.html", { search: `?niveau=n1&stufe=${uebungen.find(e => e.id === "terme").stufen[0]}`, ...alsJugendlicher() });
    await ruhe(st);
    try {
      const a = st.lauf("LST.pruefung.aufgabe()");
      st.fuelle(".eingabe", "2");
      st.lauf(`document.querySelector(".eingabe").setSelectionRange?.(1, 1)`);
      st.klick(`.antwort-tasten button[aria-label="${a.tasten[0]}"]`);
      const w = st.lauf(`document.querySelector(".eingabe").value`);
      if (w !== "2" + a.tasten[0]) throw new Error(`Term: „2“ und Taste ${a.tasten[0]} ergab „${w}“`);
    } catch (err) { melde(ort, err.message); }
    fehlerVon(ort, st);
  }
  // ---------- Gleichung im Notizblock (GL1 a): Vorlage „=“ mit der Gleichung der Aufgabe, Zeilen, Zeichen ----------
  {
    const ort = "Notizblock Gleichung (gleichungen j)";
    const s = oeffne("uebungen/gleichungen/index.html", { search: "?niveau=n2&stufe=j", ...alsJugendlicher() });
    await ruhe(s);
    try {
      const a = s.lauf("LST.pruefung.aufgabe()");
      s.klick(".nb-knopf");
      const chips = s.lauf(`[...document.querySelectorAll(".notizblock .chip")].map(c => c.dataset.vorlage).join(" ")`);
      if (chips !== "= + − × : frei") throw new Error(`Vorlagen „${chips}“ statt „= + − × : frei“`);
      s.klick('.notizblock .chip[data-vorlage="="]');
      const zeilen = () => s.lauf(`[...document.querySelectorAll(".notizblock .nb-gl")].map(f => f.value)`);
      if (JSON.stringify(zeilen()) !== JSON.stringify([a.text])) throw new Error(`erste Zeile ${JSON.stringify(zeilen())} statt „${a.text}“`);
      if (s.lauf(`document.querySelector(".notizblock .nb-zeichen").hidden`)) throw new Error("Zeichen der Gleichung nicht sichtbar");
      // die Umformung neben der ersten Zeile ist gewählt: „−3“ mit den Tasten
      s.klick('.notizblock .nb-zeichen button[aria-label="Minus"]');
      s.klick('.notizblock .nb-tasten button[aria-label="3"]');
      const umf = s.lauf(`document.querySelector(".notizblock .nb-umf").value`);
      if (umf !== "−3") throw new Error(`Umformung „${umf}“ statt −3`);
      s.klick(".notizblock button", "＋ Zeile");
      if (JSON.stringify(zeilen()) !== JSON.stringify([a.text, a.text])) throw new Error(`＋ Zeile: ${JSON.stringify(zeilen())}`);
      s.lauf(`(() => { const f = [...document.querySelectorAll(".notizblock .nb-gl")].pop(); f.value = ""; f.focus(); })()`);
      for (const t of ["x", "=", "5"]) s.klick(`.notizblock .nb-tasten button[aria-label="${t}"]`);
      if (zeilen()[1] !== "x=5") throw new Error(`zweite Zeile „${zeilen()[1]}“ statt x=5`);
      // Weiterrechnen: die Lösung der letzten Zeile ist die erste Zahl der nächsten Rechnung
      s.klick('.notizblock .chip[data-vorlage="+"]');
      const start = s.lauf(`document.querySelector(".notizblock .nb-zahl").value`);
      if (start !== "5") throw new Error(`Weiterrechnen nach x=5 beginnt mit „${start}“`);
      textPruefen(ort, s);
    } catch (err) { melde(ort, err.message); }
    fehlerVon(ort, s);
  }
  return { gespielt };
}

module.exports = { pruefeSeiten, oeffne, ruhe };
