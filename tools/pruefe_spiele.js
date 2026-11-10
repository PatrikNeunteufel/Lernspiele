// Prüft alle Spiele ohne Browser: je Spiel und Stufe wird die Seite mit dem echten Rahmen
// (spiel.js) in einem Ersatz-DOM (tools/pruef_dom.js) geladen und per Zufallsklicks gespielt.
//
// Gemeldet wird: Ausnahmen, Endlosschleifen (Zeitlimit), sichtbarer Text mit NaN, undefined,
// null, Infinity oder [object …], unplausible Protokolleinträge, Hinweise, die die Lösung verraten
// (über LS.pruefung.haken, LERN-19). Bietet ein Spiel die Funktionen
// aufgabeErzeugen(stufe) und pruefeAufgabe(aufgabe, stufe) an, werden zusätzlich viele
// Zufallsaufgaben fachlich geprüft (pruefeAufgabe liefert eine Liste von Mängeln).
//
// Danach als Kind: je Spiel mit Inhaltslisten im Katalog jede Liste einzeln freigegeben (--kind=0 schaltet ab).
//
// Aufruf: node tools/pruefe_spiele.js [spiel-id …] [--runden=3] [--aufgaben=3000] [--seed=1] [--maxKlicks=8000] [--kind=0]
// Ende mit Code 1, sobald ein Fehler gefunden wurde.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WURZEL = path.join(__dirname, "..");
const SPIELE_DIR = path.join(WURZEL, "eulenpfad", "spiele"); // App-Ordner (Entscheid P1 a)
const DOM = fs.readFileSync(path.join(__dirname, "pruef_dom.js"), "utf8");
const STUFEN = ["s1", "s2", "s3", "s4", "s5", "s6"];
// Nur ganze Wörter: „Na“ + „se“ im Buchstabensalat ergibt im Text „NaNse“ und ist kein Fehler.
const VERDAECHTIG = /\bNaN\b|\bundefined\b|\bnull\b|\bInfinity\b|\[object /;
// Einzahl verpasst (LERN_Session6, „1 werden gegessen“): die Zahl 1 vor einem Verb in der Mehrzahl oder
// danach („es kommen 1 dazu“). Nur ein Hinweis zum Nachsehen, kein Fehler: der Text ist zusammengesetzt.
// Auch mit einem Nomen dazwischen („1 Stück kosten“). „100 Rp. sind 1 Fr.“ ist richtig (Subjekt in der
// Mehrzahl), darum steht „sind“ hinter der 1 nicht in der Liste.
// Nicht gemeldet: „für 1 Stück herausfinden“ (Infinitiv) und „liegen 1 Fr. 50 Rp.“ (mehr als 1 Fr.).
const EINZAHL = /(?<![\d.,'’])(?<!für )\b1 (?:[A-ZÄÖÜ][\wäöüß]* )?(?:sind|haben|[a-zäöü]+en)\b|\b(?:haben|liegen|kommen|stehen|sitzen|fliegen|schwimmen|werden|gehen|laufen|wohnen|spielen|fahren|bleiben|fehlen|hängen|wachsen|passen|kosten)\s1\b(?![\d.,'’])(?! Fr\. \d)/;

const opt = { runden: 3, aufgaben: 3000, seed: 1, maxKlicks: 8000 };
const nurSpiele = [];
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--(\w+)=(\d+)$/);
  if (m) opt[m[1]] = Number(m[2]); else nurSpiele.push(a);
}

const { skripte, abweichungen, fingerabdrueckeVon } = require("./listen_fingerabdruck");

// Treiber im Kontext: Runden spielen, bis opt.runden protokolliert sind oder die Klicks ausgehen.
const TREIBER = `
(function treiber(runden, maxKlicks, endlos) {
  const buehne = document.querySelector(".buehne");
  const versteckt = e => !!e && (e.hidden === true || versteckt(e.parentNode));
  const funde = [];
  // Je Fund nur einmal melden (Schlüssel: der gefundene Ausschnitt, nicht der Klick davor).
  const gemeldet = new Set();
  const melde = (art, text, schluessel = text) => {
    if (funde.length < 20 && !gemeldet.has(schluessel)) { gemeldet.add(schluessel); funde.push({ art, text }); }
  };
  const pruefeText = (wo) => {
    const t = buehne.textContent;
    const e = t.match(${EINZAHL});
    if (e) {
      const stelle = t.slice(Math.max(0, e.index - 50), e.index + 30).replace(/\\s+/g, " ");
      melde("Hinweis Einzahl?", "«" + stelle + "»", "einzahl:" + e[0]);
    }
    // Mit Leerzeichen zwischen den Knoten: textContent hängt Nachbarn aneinander („undefinedAls“), \\bundefined\\b
    // fände es dort nicht (LERN_Session17, Gegenprobe der Lernsteig-Seiten).
    const tA = __textMitAbstand(buehne);
    const m = tA.match(${VERDAECHTIG});
    if (!m) return;
    const stelle = tA.slice(Math.max(0, m.index - 60), m.index + 40).replace(/\\s+/g, " ");
    melde("Text", wo + ": «" + stelle + "»", stelle);
  };
  // Endlos-Runden landen als Rekord, nicht im Protokoll.
  const protokoll = () => JSON.parse(localStorage.getItem(endlos ? "lernspiele:rekorde" : "lernspiele:protokoll") || "[]");
  // Verrät ein Hinweis die Lösung? Die Lösung ist der Text des Knopfs, dessen Klick die Aufgabe
  // löst (bei Zifferntastaturen das Ergebnis hinter dem letzten „=“ des Lösungstexts); geprüft
  // werden alle Hinweise davor in derselben Aufgabe. Kein Verrat ist es, wenn die Lösung schon in
  // der Aufgabe steht, wenn der Hinweis die falsche Wahl des Kindes nennt oder alle Möglichkeiten
  // aufzählt (er nennt dann auch eine andere Antwort).
  let geklickt = null;
  const hinweise = new Map();
  const wort = (t) => new RegExp("(?<![\\\\p{L}\\\\p{N}])" + t.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&") + "(?![\\\\p{L}\\\\p{N}])", "iu");
  // Ohne Bild-Zeichen am Rand: „🌘 abnehmend“ zählt als „abnehmend“.
  const text = (e) => e.textContent.replace(/\\s+/g, " ").replace(/^[^\\p{L}\\p{N}]+|[^\\p{L}\\p{N}]+$/gu, "");
  const KEIN_WERT = /^(Weiter|Prüfen|OK|Nochmal|⌫|←|✓)/;
  const klickbar = (e) => e.localName === "button" || e.__hoerer.click || e.__hoerer.pointerdown;
  /** Text der Aufgabe ohne die Antwortknöpfe. */
  const aufgabenText = (e) => e.nodeType === 3 ? e.data : klickbar(e) ? " " : e.childNodes.map(aufgabenText).join(" ");
  const optionen = (flaeche) => flaeche.querySelectorAll("*").filter(klickbar).map(text).filter(t => t && t.length <= 40 && !KEIN_WERT.test(t));
  let ohneVorab = 0; // Aufgaben, deren Lösung das Spiel nicht mit ctx.loesung() nennt
  let mitTipp = false; // gab irgendeine Aufgabe einen Tipp mit (ctx.tipp)?
  // Wiederholungen je Runde: höchstens eine Aufgabe ein zweites Mal, nie direkt hintereinander.
  let gestellt = new Map();
  let letzte = null;
  // Endlos: Jede Aufgabe nennt ihre Handgriffe (ctx.schritte). Sie sind eine Untergrenze — wer die
  // Aufgabe mit weniger Klicks löst, zeigt, dass das Spiel zu viele angibt.
  let schritte = 0;
  let klicks = 0;
  let klicksBeiStart = 0;
  const handgriffe = []; // Endlos: Handgriffe je gestellte Aufgabe, für die Übersicht
  // Serienbremse: je Merkmal aus ctx.serie höchstens LS.SERIE_MAX gleiche hintereinander in einer Runde.
  let serien = {};
  LS.pruefung.haken = (art, a) => {
    if (art === "gestellt") {
      if (a.nr === 0) serien = {};
      for (const [name, wert] of Object.entries(a.serien || {})) {
        const s = serien[name] ||= { wert: null, lauf: 0 };
        s.lauf = s.wert === wert ? s.lauf + 1 : 1;
        s.wert = wert;
        if (a.serieErzwungen) melde("Hinweis Serie", "Merkmal «" + name + "» kam trotz Serienbremse " + s.lauf + "-mal hintereinander («" + wert + "») — hat die Stufe nur diesen Wert? Dann ctx.serie hier weglassen.", "erzwungen " + name);
        else if (s.lauf > LS.SERIE_MAX) melde("Serie", "Merkmal «" + name + "» " + s.lauf + "-mal hintereinander («" + wert + "»)", "serie " + name);
      }
    }
    if (art === "gestellt" && endlos) {
      schritte = a.schritte;
      klicksBeiStart = klicks;
      handgriffe.push(schritte);
      if (!(schritte > 0)) melde("Handgriffe", "Endlos-Aufgabe ohne ctx.schritte: «" + (a.kennung || "").slice(0, 80) + "»", "ohne");
    }
    // HG1 a: Nach dem Stellen gilt die Zahl; ein späteres ctx.schritte des Spiels zählt nicht mehr.
    if (art === "schritteSpaet") { melde("Handgriffe", "ctx.schritte(" + a.n + ") erst nach dem Stellen der Aufgabe — zählt nicht; beim Stellen einrechnen", "spaet"); return; }
    // Der Klick, der löst, ist noch nicht gezählt (er läuft gerade).
    if (art === "richtig" && endlos && klicks - klicksBeiStart + 1 < schritte)
      melde("Handgriffe", "mit " + (klicks - klicksBeiStart + 1) + " Klicks gelöst, das Spiel nennt " + schritte, "zu viele");
    // LB1 a (LERN_Session18): Auf Anhieb richtig steht in der Blase nur ein Lob aus der Liste des Rahmens — keine
    // Rechnung, keine Begründung (die kommen nur nach einem Fehlversuch).
    if (art === "gelobt") {
      // Liste des Spiels (def.lob, LB2 a; der Rahmen nimmt sie nur mit Lobs bis 20 Zeichen) oder die des Rahmens
      const liste = a.liste || LS.LOB;
      if (a.aufAnhieb && !liste.includes(a.text.trim())) melde("Lob", "auf Anhieb richtig, in der Blase steht mehr als das Lob: «" + a.text.slice(0, 100) + "»", "lob");
      return;
    }
    // Neue Aufgabe: Hinweise einer übersprungenen Aufgabe mit derselben Nummer vergessen.
    if (art === "aufgabe") { hinweise.delete(a.nr); return; }
    if (art === "gestellt" && a.tipps) mitTipp = true;
    // Abschluss-Animation (feier.js, Entscheide AN1–AN3 a, LERN_Session27): im Schlussbild gezeigt; je Stufe ein Bild,
    // Schmuck der Stufe 2 ab 2 Sternen, der Stufe 3 bei 3 Sternen; mit „Bewegung reduzieren“ keine Bewegung, sonst Bewegung.
    if (art === "schluss") {
      if (!a.feierDef) return;
      if (typeof LS_FEIER === "undefined") { melde("Feier", "feier in LS.spiel, aber feier.js nicht geladen", "feier-js"); return; }
      if (!a.feier) melde("Feier", "keine Abschluss-Animation im Schlussbild (Stufe " + a.stufe + ")", "feier-fehlt");
      const alle = e => [e, ...e.querySelectorAll("*")];
      for (const st of a.stufen) for (const n of [1, 2, 3]) for (const ruhig of [false, true]) {
        const f = LS_FEIER.zeige(a.feierDef, { stufe: st, sterne: n, ruhig });
        const teile = f ? alle(f) : [];
        if (!teile.some(t => t.localName === "svg")) { melde("Feier", "Stufe " + st + ": keine Animation", "feier-" + st); continue; }
        // localName ohne Gross/klein: der Ersatz-DOM schreibt klein, der Browser behält „animateMotion“
        const bewegt = teile.filter(t => /^(animate|animatemotion|animatetransform|set)$/i.test(t.localName || "")).length;
        if (ruhig && bewegt) melde("Feier", "Stufe " + st + ": Bewegung trotz Bewegung reduzieren", "feier-ruhig");
        if (!ruhig && !bewegt) melde("Feier", "Stufe " + st + ": keine Bewegung", "feier-still");
        // Schmuck der Stufe 2 (Fähnchen, Funkeln …) ab 2 Sternen, der Stufe 3 (Funken, Sternschnuppe …) bei 3 Sternen
        const schmuck = w => teile.filter(t => t.getAttribute && t.getAttribute("data-schmuck") === w).length;
        if ((n >= 2) !== (schmuck("2") > 0) || (n >= 3) !== (schmuck("3") > 0))
          melde("Feier", "Stufe " + st + ", " + n + " Stern(e): Schmuck passt nicht zu den Sternen", "feier-sterne");
      }
      return;
    }
    // Ein Tipp (ctx.tipp, LERN_Session9) darf die Lösung so wenig verraten wie ein Hinweis nach einem Fehler.
    if (art === "tipp") {
      const liste = hinweise.get(a.nr) || [];
      liste.push({ ...a, loesung: a.vorab || "", gewaehlt: "", aufgabe: aufgabenText(a.flaeche), optionen: optionen(a.flaeche) });
      hinweise.set(a.nr, liste);
      return;
    }
    // Ab hier nur Aufgaben und Antworten; andere Haken (etwa „uhr“, ctx.uhrWarten) sind keine Antwort.
    if (art !== "gestellt" && art !== "falsch" && art !== "richtig") return;
    if (art === "gestellt" && endlos) {
      // Endlos (RA5 a, LERN_Session19): in einer Serie keine Aufgabe zweimal (bis LERN_Session18: keine der letzten 30)
      if (a.nr === 0) gestellt = new Map();
      if (a.kennung && gestellt.has(a.kennung)) melde("Wiederholung", "«" + a.kennung.slice(0, 80) + "» zweimal in einer Serie", a.kennung);
      if (a.kennung) gestellt.set(a.kennung, 1);
      return;
    }
    if (art === "gestellt") {
      if (a.nr === 0) { gestellt = new Map(); letzte = null; }
      if (!a.kennung) return;
      const n = (gestellt.get(a.kennung) || 0) + 1;
      gestellt.set(a.kennung, n);
      const doppelt = [...gestellt.values()].filter(x => x > 1).length;
      if (n > 2 || doppelt > 1 || a.kennung === letzte) melde("Wiederholung", "«" + a.kennung.slice(0, 80) + "» " + (a.kennung === letzte ? "direkt hintereinander" : n > 2 ? n + "-mal in einer Runde" : "zweite Wiederholung in einer Runde"), a.kennung);
      letzte = a.kennung;
      return;
    }
    // Bildersammlung (B1 a, LERN_Session16): „svg:<name>“ ist ein Bildname und darf nie als Text erscheinen
    if (/svg:/.test((a.flaeche?.textContent || "") + " " + (a.vorab || "")))
      melde("Bildname als Text", "«svg:…» steht als Text auf der Fläche oder in der Lösung — LS.bild oder LS.mitBildText benutzen", "svg-text");
    if (!a.vorab) ohneVorab++;
    if (art === "falsch") {
      if (a.aufgeloest) { hinweise.delete(a.nr); return; }
      const liste = hinweise.get(a.nr) || [];
      liste.push({ ...a, gewaehlt: geklickt ? text(geklickt) : "", aufgabe: aufgabenText(a.flaeche), optionen: optionen(a.flaeche) });
      hinweise.set(a.nr, liste);
      return;
    }
    const tastatur = !geklickt || geklickt.closest(".tastatur");
    for (const h of hinweise.get(a.nr) || []) {
      const ergebnis = h.loesung.includes("=") ? h.loesung.split("=").pop().trim().replace(/[.!]$/, "") : "";
      const loesung = tastatur ? ergebnis : text(geklickt);
      if (!loesung || loesung.length > 40 || KEIN_WERT.test(loesung) || !wort(loesung).test(h.hinweis)) continue;
      if (wort(loesung).test(h.aufgabe)) continue;
      if (h.gewaehlt && wort(h.gewaehlt).test(h.hinweis)) continue;
      if (h.optionen.some(o => o !== loesung && o !== h.gewaehlt && wort(o).test(h.hinweis))) continue;
      melde("Hinweis verrät", "«" + h.hinweis.slice(0, 100) + "» enthält die Lösung «" + loesung + "»", h.hinweis);
    }
    hinweise.delete(a.nr);
  };
  let letztesErgebnis = null;
  let verlassenGeprueft = false;
  let endeGesehen = 0;
  let ohneFortschritt = 0;
  let letzterText = "";
  __uhr.weiter(50);
  // ?stufe=… startet direkt eine Runde; sonst bietet das Spiel diese Stufe nicht an.
  if (!buehne.querySelector(".fortschritt")) return { runden: 0, klicks: 0, funde: [{ art: "Stufe", text: "Stufe wird nicht angeboten (fehlt in def.stufen)" }] };
  pruefeText("Start");
  while (protokoll().length < runden && klicks < maxKlicks) {
    // Knöpfe und alles andere, das auf Tippen hört (SVG-Felder, Zahlenstrahl).
    const knoepfe = buehne.querySelectorAll("*").filter(b => (b.localName === "button" || b.__hoerer.click || b.__hoerer.pointerdown)
      && !b.disabled && !b.classList.contains("link") && !b.classList.contains("timer-schalter") && !b.classList.contains("option-schalter") && !/Andere Stufe/.test(b.textContent)
      && !b.classList.contains("vorlesen") && !b.classList.contains("melden") && !b.classList.contains("blase") // 🗣️, 🙋 und die Blase (aufklappbar, BH2 a) gehören zum Rahmen, nicht zur Aufgabe
      && !versteckt(b) // ausgeblendet (hidden, etwa „💡 Tipp“ ohne Tipps) kann niemand antippen
      && !b.closest(".testhilfe"));
    if (!knoepfe.length) { __uhr.weiter(2000); if (++ohneFortschritt > 50) { melde("Hänger", "keine Knöpfe mehr"); break; } continue; }
    // Weiter- und Nochmal-Knöpfe bevorzugen, damit die Runde vorankommt; selten eine Testhilfe.
    const vor = knoepfe.filter(b => /Weiter|Nochmal|Prüfen|OK|Ergebnis/.test(b.textContent));
    const hilfe = buehne.querySelectorAll(".testhilfe button");
    const k = hilfe.length && Math.random() < 0.03 ? hilfe[Math.floor(Math.random() * hilfe.length)]
      : vor.length && Math.random() < 0.4 ? vor[Math.floor(Math.random() * vor.length)] : knoepfe[Math.floor(Math.random() * knoepfe.length)];
    geklickt = k;
    if (k.__hoerer.pointerdown) k.dispatchEvent(Object.assign(new Event("pointerdown", { bubbles: true }), { clientX: Math.random() * 600 }));
    k.click();
    klicks++;
    __uhr.weiter(2000);
    pruefeText("nach Klick auf «" + k.textContent.trim().slice(0, 20) + "»");
    // Endlos: Ist die Runde vorbei („Zum Ergebnis“), muss der Rekord schon gespeichert sein — auch wenn
    // das Kind den Knopf nie antippt.
    const zumErgebnis = endlos && buehne.querySelectorAll("button").find(b => /Zum Ergebnis/.test(b.textContent));
    if (zumErgebnis && zumErgebnis !== letztesErgebnis) {
      letztesErgebnis = zumErgebnis;
      endeGesehen++;
      if (protokoll().length < endeGesehen) melde("Rekord", "Endlos-Runde vorbei, aber erst beim Antippen von «Zum Ergebnis» gespeichert", "zum Ergebnis");
      if (protokoll().at(-1)?.abgebrochen) melde("Rekord", "Zwischenstand vom Verlassen bleibt stehen, obwohl die Runde zu Ende gespielt wurde", "zwischenstand");
    }
    // Endlos (Entscheid E1 a): Verlässt das Kind die Seite mitten in der Serie, zählt sie bis dahin.
    // Einmal je Spiel und Stufe das Verlassen nachstellen; danach geht die Runde weiter.
    const serie = endlos && !zumErgebnis && Number((buehne.querySelector(".fortschritt.endlos")?.textContent.match(/♾ (\\d+)/) || [])[1]);
    if (serie > 0 && !verlassenGeprueft && Math.random() < 0.2) {
      verlassenGeprueft = true;
      const vorher = protokoll().length;
      document.dispatchEvent(new Event("pagehide"));
      const r = protokoll();
      if (r.length !== vorher + 1 || !r.at(-1).abgebrochen || r.at(-1).punkte !== serie)
        melde("Rekord", "Verlassen mitten in der Serie (" + serie + ") speichert keinen passenden Zwischenstand: " + JSON.stringify(r.at(-1) || null).slice(0, 120), "verlassen");
    }
    const jetzt = buehne.textContent;
    ohneFortschritt = jetzt === letzterText ? ohneFortschritt + 1 : 0;
    letzterText = jetzt;
  }
  for (const e of protokoll()) {
    // gemeinsames Format der Reihe (R1 a, kern/runden.js): Kennung, Person, Zeit, Inhalt, Stufe …
    const formatMaengel = KERN.runden.maengel(e, endlos ? "rekord" : "runde");
    if (formatMaengel.length) melde("Format", formatMaengel.join(", ") + ": " + JSON.stringify(e).slice(0, 120));
    if (endlos) {
      if (!Number.isInteger(e.punkte) || e.punkte < 0 || !Number.isFinite(e.dauer)) melde("Rekord", JSON.stringify(e).slice(0, 160));
      // RA3 a: die Serie steht auch im Protokoll, mit derselben Kennung; richtig gelöst so viele wie Punkte
      const r = JSON.parse(localStorage.getItem("lernspiele:protokoll") || "[]").find(x => x.id === e.id);
      if (!r || !r.endlos || r.sterne !== null || (r.liste || []).filter(a => a.geloest).length !== e.punkte || !!r.abgebrochen !== !!e.abgebrochen)
        melde("Protokoll", "Serie nicht passend im Protokoll: Rekord " + JSON.stringify(e).slice(0, 80) + " · Runde " + JSON.stringify(r || null).slice(0, 80), "serie-protokoll");
      continue;
    }
    if (!(e.sterne >= 1 && e.sterne <= 3) || !Number.isFinite(e.fehler) || !Number.isFinite(e.dauer)) melde("Protokoll", JSON.stringify(e).slice(0, 160));
    // RA4 a: je Aufgabe ein Eintrag in liste; Fehler und gezeigte Lösungen stimmen mit der Zählung der Runde
    const liste = Array.isArray(e.liste) ? e.liste : [];
    const fehlerJe = liste.reduce((s, a) => s + (a.versuche || 0) + (a.zeitUm ? 1 : 0), 0);
    if (liste.length !== e.aufgaben || fehlerJe !== e.fehler || liste.filter(a => a.gezeigt).length !== e.gezeigt
      || liste.some(a => !Number.isFinite(a.ms) || typeof a.geloest !== "boolean" || !Number.isInteger(a.versuche)))
      melde("Protokoll", "Liste je Aufgabe passt nicht zur Runde: " + JSON.stringify({ aufgaben: e.aufgaben, fehler: e.fehler, gezeigt: e.gezeigt, liste: liste.slice(0, 3) }).slice(0, 200), "liste");
    if ("aufgabenZeiten" in e || "fehlerAufgaben" in e) melde("Protokoll", "Felder bis LERN_Session18 (aufgabenZeiten, fehlerAufgaben) in einer neuen Runde", "alt");
    for (const f of KERN.runde.mitFehler(e)) if (${VERDAECHTIG}.test(f.text + " " + f.loesung)) melde("Protokoll", "Fehleraufgabe: " + (f.text + " → " + f.loesung).slice(0, 160));
  }
  const gekuerzt = protokoll().filter(e => e.gekuerzt).map(e => e.aufgaben + "/" + e.gekuerzt);
  return { runden: protokoll().length, klicks, funde, ohneVorab, gekuerzt, handgriffe, mitTipp };
})`;

// Zufallsmix (Entscheid M1 a): Der Treiber spielt die Mix-Seite. Das Spiel meldet „bereit“, zeichnet erst
// auf „aufgabe“ hin und meldet jedes Ergebnis; Protokoll und Rekord schreibt es selbst nicht.
const MIX_TREIBER = `
(function mixTreiber(aufgaben, maxKlicks, endlos) {
  const buehne = document.querySelector(".buehne");
  const versteckt = e => !!e && (e.hidden === true || versteckt(e.parentNode));
  const funde = [];
  const melde = (art, text) => { if (funde.length < 10 && !funde.some(f => f.text === text)) funde.push({ art, text }); };
  const neue = () => __nachrichten.splice(0);
  const sende = d => document.dispatchEvent(Object.assign(new Event("message"), { data: { lern: "mix", ...d }, source: parent }));
  const knoepfe = () => buehne.querySelectorAll("*").filter(b => (b.localName === "button" || b.__hoerer.click || b.__hoerer.pointerdown)
    && !b.disabled && !b.classList.contains("link") && !b.classList.contains("vorlesen") && !b.classList.contains("melden") && !b.classList.contains("blase") && !versteckt(b) && !b.closest(".testhilfe"));
  __uhr.weiter(50);
  let n = neue();
  if (n.some(m => m.typ === "geht-nicht")) return { geht: false, funde, ergebnisse: 0, klicks: 0 };
  if (n.length !== 1 || n[0].typ !== "bereit") melde("Mix", "statt «bereit» kam: " + JSON.stringify(n).slice(0, 120));
  if (knoepfe().length) melde("Mix", "zeichnet eine Aufgabe, bevor der Mix sie verlangt");
  let klicks = 0, ergebnisse = 0, warten = 0;
  for (let i = 0; i < aufgaben && klicks < maxKlicks; i++) {
    sende({ typ: "aufgabe", geschafft: i });
    n = [];
    while (!n.length && klicks < maxKlicks) {
      const liste = knoepfe();
      // Hänger erst nach 50 Wartezeiten am Stück (100 s ohne Knöpfe); kurze Pausen wie beim Einprägen sind erlaubt.
      if (!liste.length) { __uhr.weiter(2000); n = neue(); klicks++; if (!n.length && ++warten === 50) melde("Hänger", "keine Knöpfe und keine Meldung"); continue; }
      warten = 0;
      const vor = liste.filter(b => /Weiter|Prüfen|OK/.test(b.textContent));
      const k = vor.length && Math.random() < 0.4 ? vor[Math.floor(Math.random() * vor.length)] : liste[Math.floor(Math.random() * liste.length)];
      if (k.__hoerer.pointerdown) k.dispatchEvent(Object.assign(new Event("pointerdown", { bubbles: true }), { clientX: Math.random() * 600 }));
      k.click();
      klicks++;
      __uhr.weiter(2000);
      n = neue();
    }
    if (!n.length) break;
    if (n.length > 1) melde("Mix", "mehrere Meldungen auf eine Aufgabe: " + n.map(m => m.typ).join(", "));
    const m = n[0];
    if (m.typ === "erschoepft") break;
    if (m.typ !== "ergebnis") { melde("Mix", "unerwartete Meldung «" + m.typ + "»"); break; }
    ergebnisse++;
    const z = m.zeit || {};
    if (!Number.isFinite(z.ms) || typeof z.geloest !== "boolean" || !(m.fehler >= 0) || !(m.hilfen >= 0))
      melde("Mix", "Ergebnis unvollständig: " + JSON.stringify(m).slice(0, 160));
    // RA4 a: der Eintrag der Aufgabe trägt ihre Fehler selbst (Fehlversuche, Zeit um) und dann auch ihren Text
    if (m.fehler !== (z.versuche || 0) + (z.zeitUm ? 1 : 0) || ((z.versuche > 0 || z.zeitUm) && typeof z.text !== "string"))
      melde("Mix", "Fehler und Eintrag der Aufgabe passen nicht: " + JSON.stringify(m).slice(0, 160));
    // Bis zur nächsten Verlangung bleibt das Spiel still.
    __uhr.weiter(3000);
    if (neue().length) melde("Mix", "meldet ohne neue Aufgabe weiter");
    if (endlos && !z.geloest) break;
  }
  const protokoll = JSON.parse(localStorage.getItem("lernspiele:protokoll") || "[]");
  const rekorde = JSON.parse(localStorage.getItem("lernspiele:rekorde") || "[]");
  if (protokoll.length || rekorde.length) melde("Mix", "Spiel schreibt selbst ins Protokoll oder die Rekorde");
  return { geht: true, funde, ergebnisse, klicks };
})`;

// Generatoren im Kontext: aufgabeErzeugen + pruefeAufgabe, falls vorhanden.
const GENERATOR = `
(function generator(stufe, anzahl) {
  if (typeof aufgabeErzeugen !== "function") return null;
  const funde = [];
  const melde = (text) => { if (funde.length < 10 && !funde.includes(text)) funde.push(text); };
  const faul = (x, tiefe = 0) => {
    if (tiefe > 6 || x == null) return x === undefined;
    if (typeof x === "number") return !Number.isFinite(x);
    if (typeof x !== "object" || x.nodeType) return false;
    return Object.values(x).some(v => faul(v, tiefe + 1));
  };
  const mitPruefung = typeof pruefeAufgabe === "function";
  for (let i = 0; i < anzahl; i++) {
    const a = aufgabeErzeugen(stufe);
    if (a === undefined || faul(a)) melde("unvollständige Aufgabe: " + JSON.stringify(a).slice(0, 160));
    if (mitPruefung) for (const m of pruefeAufgabe(a, stufe) || []) melde(m + " — " + JSON.stringify(a).slice(0, 160));
  }
  return { anzahl, mitPruefung, funde };
})`;

/**
 * Reservierte Rahmen-Klassen (LS.RAHMEN_KLASSEN.reserviert, docs/eulenpfad/rahmen.md), mit denen ein Selektor im
 * eigenen <style> beginnt. Eingeschachtelt wie „.uhr .mitte“ ist harmlos.
 */
function rahmenKlassenImStil(html, reserviert) {
  const stil = (html.match(/<style>([\s\S]*?)<\/style>/) || [, ""])[1].replace(/\/\*[\s\S]*?\*\//g, "");
  const selektoren = stil.split("}").map(r => r.split("{")[0]).flatMap(s => s.split(",")).map(s => s.trim());
  return reserviert.filter(k => selektoren.some(s => new RegExp(`^\\.${k}(?![\\w-])`).test(s)));
}

/**
 * Ein Spiel in einer Stufe prüfen. Ohne 'liste' als angemeldete Aufsicht: das Spiel startet ohne
 * Anmeldung, ist unabhängig von der Freigabe sichtbar, alle Inhaltslisten sind frei, und die
 * Testhilfen (🔑, ⏭) werden mitgeprüft. Mit 'liste' (Schlüssel "<spiel>/<liste>" der Quellen) als
 * Kind, für das nur dieses Spiel und nur diese Listen freigegeben sind (Entscheid L4 a); bietet das
 * Spiel die Stufe dann nicht an, ist das kein Fehler (ergebnis.angeboten = false).
 */
function pruefe(id, stufe, liste = null, endlos = false, mix = false) {
  const seitenPfad = path.join(SPIELE_DIR, id, "index.html");
  const html = fs.readFileSync(seitenPfad, "utf8");
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1].replace(/<script[\s\S]*?<\/script>/g, "");
  const search = "?stufe=" + stufe + (endlos ? "&endlos=1" : "") + (mix ? "&mix=1&timer=1" : "");
  const ergebnis = { id, stufe, fehler: [], hinweise: [], angeboten: true };
  // Fehlt ein Bild der Bildersammlung (LS.bild meldet es auf der Konsole), ist das ein Fehler des Spiels
  const bildFehlt = new Set();
  const konsole = { ...console, error(...a) {
    const t = a.join(" ");
    if (/^Bild svg:/.test(t)) { if (!bildFehlt.has(t)) { bildFehlt.add(t); ergebnis.fehler.push(t); } } else console.error(...a);
  } };
  const kontext = vm.createContext({ __seite: { html: body, search, seed: opt.seed }, console: konsole, URL, URLSearchParams, structuredClone });
  const lauf = (code, name, ms) => vm.runInContext(code, kontext, { filename: name, timeout: ms });
  /** Ausnahmen, die im Spiel aufgefangen wurden (pruef_dom sammelt sie in __fehler), als Fehler dazunehmen. */
  const mitAusnahmen = () => {
    const laufFehler = vm.runInContext("typeof __fehler === 'undefined' ? [] : __fehler", kontext);
    for (const f of new Set(laufFehler)) ergebnis.fehler.push("Ausnahme: " + f);
    return ergebnis;
  };
  try {
    lauf(DOM, "pruef_dom.js", 5000);
    lauf(liste
      ? `localStorage.setItem("lernspiele:profile", JSON.stringify({ Kind: { rolle: "kind" } }));
         localStorage.setItem("lernspiele:spieler", JSON.stringify("Kind"));
         localStorage.setItem("lernspiele:freigabe", JSON.stringify({ spiele: { ${JSON.stringify(id)}: true }, listen: ${JSON.stringify(Object.fromEntries(liste.map(k => [k, true])))} }));`
      // Endlos mit Timer: prüft die knapper werdende Zeit und das Ende bei „Zeit um“ mit.
      : `localStorage.setItem("lernspiele:profile", JSON.stringify({ Testlauf: { rolle: "aufsicht"${endlos ? ', timer: { an: true, faktor: 1, spiele: {} }' : ""} } }));
         localStorage.setItem("lernspiele:spieler", JSON.stringify("Testlauf"));
         sessionStorage.setItem("lernspiele:aufsicht", "Testlauf");`, "vorbereitung", 1000);
    for (const s of skripte(seitenPfad, html)) lauf(s.code, s.name, 5000);
    if (mix) {
      // Mehr Aufgaben als eine gewöhnliche Runde: Spiele, die über ctx.nr eine feste Folge lesen, fallen so auf.
      const t = lauf(MIX_TREIBER, "mix-treiber", 60000)(12, opt.maxKlicks, endlos);
      Object.assign(ergebnis, { angeboten: t.geht, runden: t.ergebnisse, klicks: t.klicks });
      for (const f of t.funde) (/^Hänger/.test(f.art) ? ergebnis.hinweise : ergebnis.fehler).push(`${f.art}: ${f.text}`);
      return mitAusnahmen();
    }
    if (!liste && stufe === STUFEN[0]) for (const k of rahmenKlassenImStil(html, lauf("LS.RAHMEN_KLASSEN.reserviert", "klassen", 1000)))
      ergebnis.fehler.push(`Stil: definiert die Rahmen-Klasse .${k} neu (docs/eulenpfad/rahmen.md)`);
    // Bietet das Spiel die Stufe an? (Als Kind fehlen Stufen ohne freie Inhalte; dann keinen Generator aufrufen.)
    if (liste && !lauf(`!!document.querySelector(".buehne .fortschritt")`, "angeboten", 1000)) {
      ergebnis.angeboten = false;
      return ergebnis;
    }
    const gen = lauf(GENERATOR, "generator", 60000)(stufe, opt.aufgaben);
    if (gen) {
      ergebnis.generator = gen;
      for (const f of gen.funde) ergebnis.fehler.push("Generator: " + f);
    }
    const t = lauf(TREIBER, "treiber", 60000)(opt.runden, opt.maxKlicks, endlos);
    ergebnis.runden = t.runden;
    ergebnis.klicks = t.klicks;
    ergebnis.handgriffe = t.handgriffe;
    ergebnis.mitTipp = t.mitTipp;
    for (const f of t.funde) (/^(Hänger|Hinweis)/.test(f.art) ? ergebnis.hinweise : ergebnis.fehler).push(`${f.art}: ${f.text}`);
    if (t.gekuerzt.length) ergebnis.hinweise.push(`zu wenig verschiedene Aufgaben: ${t.gekuerzt.length} von ${t.runden} Runden früher beendet (Aufgaben ${[...new Set(t.gekuerzt)].join(", ")})`);
    if (t.ohneVorab) ergebnis.fehler.push(`Testhilfe: ${t.ohneVorab} Antworten auf Aufgaben ohne ctx.loesung() — 🔑 kennt dort keine Lösung`);
    if (t.runden < opt.runden) ergebnis.hinweise.push(`nur ${t.runden} von ${opt.runden} Runden mit ${t.klicks} Zufallsklicks geschafft`);
  } catch (e) {
    ergebnis.fehler.push(/timed out/.test(e.message) ? "Zeitlimit überschritten — Endlosschleife?" : `Abbruch: ${String(e.stack || e).split("\n").slice(0, 3).join(" | ")}`);
  }
  return mitAusnahmen();
}

const ids = fs.readdirSync(SPIELE_DIR)
  .filter(d => d !== "gemeinsam" && fs.existsSync(path.join(SPIELE_DIR, d, "index.html")))
  .filter(d => !nurSpiele.length || nurSpiele.includes(d));

let fehlerZahl = 0;
// Kopie des gemeinsamen Kerns (docs/kern/rahmen.md 6): eulenpfad/kern/kern.js muss mit kern/ übereinstimmen.
try {
  require("child_process").execFileSync("python", [path.join(__dirname, "kern_verteilen.py"), "--pruefe", "eulenpfad"], { encoding: "utf8" });
} catch (e) { console.log(`    FEHLER  Kern: ${(e.stdout || e.message).trim()}`); fehlerZahl++; }
// Prüfliste (docs/eulenpfad/pruefung/listen.json und die Markdown-Fassung) muss zu den Inhaltslisten passen, sonst zeigt
// die Prüfansicht des Entwickler-Modus alte Einträge und Bilder (LERN_Session17).
try {
  require("child_process").execFileSync(process.execPath, [path.join(__dirname, "pruefliste_wortlisten.js"), "--pruefe"], { encoding: "utf8" });
} catch (e) { console.log(`    FEHLER  ${(e.stdout || e.message).trim()}`); fehlerZahl++; }
// Doppelte Namen im Rahmen (LERN_Session12): eine zweite Funktion waehle(name, art, …) verdeckte still die zufällige
// Auswahl waehle(liste) — jedes LS.waehle in 167 Dateien lief in die falsche Funktion, das Konfetti legte die
// Farbliste als Spieler an. Zwei Deklarationen gleichen Namens auf der obersten Ebene der IIFE oder zweimal derselbe
// Schlüssel in der Exportliste sind ein Fehler.
{
  const code = fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", "spiel.js"), "utf8");
  const zaehle = namen => [...namen.reduce((m, n) => m.set(n, (m.get(n) || 0) + 1), new Map())].filter(([, n]) => n > 1).map(([k]) => k);
  const deklariert = [...code.matchAll(/^ {2}(?:async )?(?:function|const|let) ([A-Za-z_$][\w$]*)/gm)].map(m => m[1]);
  const exportBlock = (code.match(/^ {2}return \{\n([\s\S]*?)^ {2}\};/m) || [, ""])[1];
  const exportiert = exportBlock.split(/[,\n]/).map(s => s.trim()).filter(s => /^[A-Za-z_$][\w$]*$/.test(s));
  for (const n of zaehle(deklariert)) { console.log(`    FEHLER  spiel.js: ${n} ist auf oberster Ebene doppelt deklariert (die spätere verdeckt die frühere)`); fehlerZahl++; }
  for (const n of zaehle(exportiert)) { console.log(`    FEHLER  spiel.js: ${n} steht doppelt in der Exportliste`); fehlerZahl++; }
}
const ohneTipp = new Map(); // Spiel → Stufen ohne ctx.tipp (Übersicht am Ende, LERN_Session9)
console.log(`Prüfe ${ids.length} Spiele × ${STUFEN.length} Stufen (je ${opt.runden} Runden, ${opt.aufgaben} Generator-Aufgaben, Startwert ${opt.seed})\n`);
for (const id of ids) {
  for (const stufe of STUFEN) {
    const e = pruefe(id, stufe);
    if (e.runden && !e.mitTipp) ohneTipp.set(id, [...(ohneTipp.get(id) || []), stufe]);
    const gen = e.generator ? ` · Generator ${e.generator.anzahl}${e.generator.mitPruefung ? " fachlich" : ""}` : "";
    const zeichen = e.fehler.length ? "✗" : e.hinweise.length ? "~" : "✓";
    console.log(`${zeichen} ${id.padEnd(22)} ${stufe}  Runden ${e.runden ?? "-"} · Klicks ${e.klicks ?? "-"}${gen}`);
    for (const f of e.fehler) console.log(`    FEHLER  ${f}`);
    for (const h of e.hinweise) console.log(`    hinweis ${h}`);
    fehlerZahl += e.fehler.length;
  }
}
// Regelseiten (LERN_Session11, rahmen.md 16): Katalog regeln: true verlangt regeln.html mit regeln.css und Weg zurück.
{
  const kat = vm.createContext({ LS: { SKALA: [] } });
  vm.runInContext(fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", "katalog.js"), "utf8") + ";this.SPIELE = SPIELE; this.SPIELWEISEN = SPIELWEISEN;", kat);
  for (const s of kat.SPIELE.filter(x => ids.includes(x.id))) {
    // Spielweise (Entscheid SP1 a, LERN_Session11): jedes Spiel trägt art mit Schlüsseln aus SPIELWEISEN.
    const ohneArt = !Array.isArray(s.art) || !s.art.length;
    const fremd = ohneArt ? [] : s.art.filter(a => !(a in kat.SPIELWEISEN));
    if (ohneArt) { console.log(`    FEHLER  ${s.id} Katalog: Feld art fehlt (Spielweise, SPIELWEISEN in katalog.js)`); fehlerZahl++; }
    if (fremd.length) { console.log(`    FEHLER  ${s.id} Katalog: art kennt ${fremd.join(", ")} nicht (SPIELWEISEN)`); fehlerZahl++; }
    const datei = path.join(SPIELE_DIR, s.id, "regeln.html");
    const da = fs.existsSync(datei);
    const m = [];
    if (s.regeln && !da) m.push("Katalog regeln: true, aber regeln.html fehlt");
    if (!s.regeln && da) m.push("regeln.html vorhanden, aber im Katalog nicht regeln: true (kein Knopf führt hin)");
    if (s.regeln && da) {
      const h = fs.readFileSync(datei, "utf8");
      if (!h.includes("../gemeinsam/regeln.css")) m.push("regeln.html lädt ../gemeinsam/regeln.css nicht");
      if (!/href="index\.html"/.test(h)) m.push("regeln.html führt nicht zurück zum Spiel (href=\"index.html\")");
    }
    for (const f of m) console.log(`    FEHLER  ${s.id} Regeln: ${f}`);
    fehlerZahl += m.length;
  }
}
// Endlos-Stufen (Entscheide EN1 a, EN2 a, LERN_Session12): Endlos gibt es in jeder Stufe mit mindestens ENDLOS_MIN
// verschiedenen Aufgaben, mit Inhaltsliste oder ohne. Gezählt wird mit der Kennung des Rahmens (wie gegen
// Wiederholungen, LS.pruefung.zaehle), als Aufsicht mit allen Listen. Weicht der Katalog ab, ist das ein Hinweis.
const ENDLOS_MIN = 100;
const ENDLOS_ZUEGE = 3000;
/** Verschiedene Aufgaben einer Stufe (höchstens ENDLOS_MIN, dann bricht die Messung ab); null, wenn nichts gezogen wurde. */
function messeStufe(id, stufe) {
  const seitenPfad = path.join(SPIELE_DIR, id, "index.html");
  const html = fs.readFileSync(seitenPfad, "utf8");
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1].replace(/<script[\s\S]*?<\/script>/g, "");
  const kontext = vm.createContext({ __seite: { html: body, search: "?stufe=" + stufe, seed: opt.seed }, console: { log() {}, warn() {}, error() {} }, URL, URLSearchParams, structuredClone });
  const lauf = (code, name) => vm.runInContext(code, kontext, { filename: name, timeout: 60000 });
  lauf(DOM, "pruef_dom.js");
  lauf(`localStorage.setItem("lernspiele:profile", JSON.stringify({ Testlauf: { rolle: "aufsicht" } }));
     localStorage.setItem("lernspiele:spieler", JSON.stringify("Testlauf")); sessionStorage.setItem("lernspiele:aufsicht", "Testlauf");
     var __messung = { verschieden: new Set(), zuege: 0 };`, "vorbereitung");
  for (const s of skripte(seitenPfad, html)) {
    lauf(s.code, s.name);
    if (/gemeinsam[\\/]spiel\.js$/.test(s.name)) lauf(`LS.pruefung.zaehle = k => { if (k) __messung.verschieden.add(k); __messung.zuege++;
      return __messung.verschieden.size < ${ENDLOS_MIN} && __messung.zuege < ${ENDLOS_ZUEGE}; };`, "messung");
  }
  for (let i = 0; i < 20 && !lauf("__messung.zuege", "stand"); i++) lauf("__uhr.weiter(1000)", "uhr");
  return lauf("__messung.zuege", "stand") ? lauf("__messung.verschieden.size", "ergebnis") : null;
}
if (opt.endlosMessen !== 0) {
  const kat = vm.createContext({ LS: { SKALA: [] } });
  vm.runInContext(fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", "katalog.js"), "utf8") + ";this.SPIELE = SPIELE;", kat);
  console.log(`\nEndlos-Stufen (ab ${ENDLOS_MIN} verschiedenen Aufgaben):\n`);
  let abweichend = 0;
  for (const s of kat.SPIELE.filter(x => ids.includes(x.id))) {
    const passt = [], fehlt = [], zuViel = [], ungemessen = [];
    for (const st of s.stufen) {
      let n;
      try { n = messeStufe(s.id, st); } catch { n = null; }
      const hat = (s.endlos || []).includes(st);
      if (n == null) ungemessen.push(st);
      else if (n >= ENDLOS_MIN) (hat ? passt : fehlt).push(st);
      else if (hat) zuViel.push(`${st}:${n}`);
    }
    if (fehlt.length || zuViel.length) {
      abweichend++;
      console.log(`    hinweis ${s.id}: Katalog endlos` + (fehlt.length ? ` — fehlt ${fehlt.join(" ")}` : "") + (zuViel.length ? ` — unter ${ENDLOS_MIN}: ${zuViel.join(" ")}` : "")
        + ` → endlos: [${[...passt, ...fehlt].sort().map(x => `"${x}"`).join(", ")}]`);
    }
    if (ungemessen.length) console.log(`    hinweis ${s.id}: nicht messbar in ${ungemessen.join(" ")} (keine Aufgabe gezogen)`);
  }
  if (!abweichend) console.log("✓ Katalog endlos stimmt mit der Messung überein");
}
// Geprüfte Listen unverändert? (LP3-H a, LERN_Session12): Wer eine Liste mit pruefung.js nach der Prüfung ändert,
// muss die geänderten Einträge in der Prüfansicht neu abhaken — sonst wäre sie mit Ungeprüftem für Kinder frei.
{
  const kat = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", "pruefstand.js"), "utf8") + ";this.PRUEFSTAND = PRUEFSTAND;", kat);
  for (const a of abweichungen(kat.PRUEFSTAND, ids)) {
    if (a.stand) { console.log(`    FEHLER  ${a.schluessel}: Liste nach der Prüfung geändert — in der Prüfansicht die neuen Einträge abhaken`); fehlerZahl++; }
    else console.log(`    hinweis ${a.schluessel}: geprüft vor der Prüfung je Eintrag (ohne Fingerabdruck) — einmal in der Prüfansicht bestätigen`);
  }
  // Jede Prüfansicht lädt (LERN_Session24): Die Prüfansicht lud seit LERN_Session20 nicht mehr (ein Kommentar verschluckte
  // eine Klammer), und niemand merkte es, weil oben nur Listen mit Eintrag im Prüfstand gerechnet werden.
  for (const id of ids.filter(i => fs.existsSync(path.join(SPIELE_DIR, i, "pruefung.js")))) {
    try {
      const fp = fingerabdrueckeVon(id);
      if (!fp || !Object.keys(fp).length) { console.log(`    FEHLER  ${id}: pruefung.js meldet keine Liste`); fehlerZahl++; }
    } catch (e) { console.log(`    FEHLER  ${id}: Prüfansicht lädt nicht — ${String(e.message).split("\n")[0]}`); fehlerZahl++; }
  }
}
// Freiwillige Beiträge (LERN-50): Kinder sollen nie um Geld gebeten werden. Im App-Ordner darf die Beitragsseite nur
// aus der Verwaltung (nur Aufsicht) und der Anleitung für Erwachsene verlinkt sein (docs/anleitung_freiwillige_beitraege.md).
{
  const APP = path.join(WURZEL, "eulenpfad");
  const ERLAUBT = [path.join("start", "verwaltung.js"), path.join("anleitung", "aufsicht.html")];
  const dateien = [];
  const sammle = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) sammle(p); else if (/\.(html|js)$/.test(e.name)) dateien.push(p);
  } };
  sammle(APP);
  for (const p of dateien) {
    const rel = path.relative(APP, p);
    if (ERLAUBT.includes(rel)) continue;
    if (fs.readFileSync(p, "utf8").includes("unterstuetzen.html")) {
      console.log(`    FEHLER  ${rel}: verlinkt die Beitragsseite — nur Verwaltung und Anleitung für Erwachsene dürfen das`);
      fehlerZahl++;
    }
  }
  // Impressum und Datenschutz (Plan C12, IM1 a): verlinkt im Portal und in der Verwaltung beider Apps, die Seite gibt es
  const verweise = [["portal/index.html", 'href="impressum.html"'], ["eulenpfad/start/verwaltung.js", "../portal/impressum.html"],
    ["lernsteig/start/aufsicht.js", "../portal/impressum.html"]];
  if (!fs.existsSync(path.join(WURZEL, "portal", "impressum.html"))) { console.log("    FEHLER  portal/impressum.html fehlt"); fehlerZahl++; }
  for (const [datei, link] of verweise) {
    if (!fs.readFileSync(path.join(WURZEL, datei), "utf8").includes(link)) { console.log(`    FEHLER  ${datei}: kein Link auf Impressum und Datenschutz`); fehlerZahl++; }
  }
}
// Endlos-Modus: je Spiel und Stufe mit endlos im Katalog einige Endlos-Runden (--endlos=0 schaltet ab).
if (opt.endlos !== 0) {
  const kat = vm.createContext({ LS: { SKALA: [] } });
  vm.runInContext(fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", "katalog.js"), "utf8") + ";this.SPIELE = SPIELE;", kat);
  const mitEndlos = kat.SPIELE.filter(s => s.endlos && ids.includes(s.id));
  if (mitEndlos.length) console.log(`\nEndlos-Modus (${mitEndlos.length} Spiele):\n`);
  for (const s of mitEndlos) {
    const zeile = [];
    for (const stufe of s.endlos) {
      const e = pruefe(s.id, stufe, null, true);
      for (const f of e.fehler) console.log(`    FEHLER  ${s.id} ${stufe} endlos: ${f}`);
      for (const h of e.hinweise) if (!/^nur \d+ von/.test(h)) console.log(`    hinweis ${s.id} ${stufe} endlos: ${h}`);
      fehlerZahl += e.fehler.length;
      // Dahinter die Handgriffe der gestellten Aufgaben (kleinste–grösste), aus denen der Boden der Zeit folgt.
      const h = e.handgriffe || [];
      zeile.push(`${stufe}:${e.runden ?? "-"}` + (h.length ? ` [${Math.min(...h)}–${Math.max(...h)}]` : ""));
    }
    console.log(`♾ ${s.id.padEnd(24)} ${zeile.join(" ")}`);
  }
}

// Zufallsmix: jedes Spiel einmal in Stufe 3 im Mix (mit Timer), Endlos-Spiele zusätzlich im Endlos-Mix
// in ihrer ersten Endlos-Stufe (--mix=0 schaltet ab).
if (opt.mix !== 0) {
  const kat = vm.createContext({ LS: { SKALA: [] } });
  vm.runInContext(fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", "katalog.js"), "utf8") + ";this.SPIELE = SPIELE;", kat);
  console.log(`\nZufallsmix (${ids.length} Spiele):\n`);
  for (const id of ids) {
    const s = kat.SPIELE.find(x => x.id === id);
    const faelle = [["s3", false], ...(s?.endlos?.length ? [[s.endlos[0], true]] : [])];
    const zeile = [];
    for (const [stufe, endlos] of faelle) {
      const e = pruefe(id, stufe, null, endlos, true);
      for (const f of e.fehler) console.log(`    FEHLER  ${id} ${stufe}${endlos ? " endlos" : ""} mix: ${f}`);
      for (const h of e.hinweise) console.log(`    hinweis ${id} ${stufe}${endlos ? " endlos" : ""} mix: ${h}`);
      fehlerZahl += e.fehler.length;
      zeile.push(`${stufe}${endlos ? "♾" : ""}:${e.angeboten ? e.runden : "geht nicht"}`);
    }
    console.log(`🎲 ${id.padEnd(24)} ${zeile.join(" ")}`);
  }
}

// Als Kind: je Spiel mit Inhaltslisten (Katalog) jede Liste einzeln freigegeben.
if (opt.kind !== 0) {
  const katalog = vm.createContext({ LS: { SKALA: [] } });
  vm.runInContext(fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", "katalog.js"), "utf8") + ";this.SPIELE = SPIELE;", katalog);
  const mitListen = katalog.SPIELE.filter(s => s.listen && ids.includes(s.id));
  if (mitListen.length) console.log(`\nAls Kind mit je einer freien Liste (${mitListen.length} Spiele):\n`);
  for (const s of mitListen) {
    // Freigegeben wird an der Quelle (von); eine Zusatzliste ergibt allein keine Aufgabe und
    // wird zusammen mit der ersten gewöhnlichen Liste geprüft.
    const schluessel = l => s.listen[l].von || `${s.id}/${l}`;
    const erste = Object.keys(s.listen).find(l => !s.listen[l].zusatz);
    for (const liste of Object.keys(s.listen)) {
      const angeboten = [];
      const frei = s.listen[liste].zusatz ? [schluessel(erste), schluessel(liste)] : [schluessel(liste)];
      for (const stufe of STUFEN) {
        const e = pruefe(s.id, stufe, frei);
        if (!e.angeboten) continue;
        angeboten.push(stufe);
        for (const f of e.fehler) console.log(`    FEHLER  ${s.id}/${liste} ${stufe}: ${f}`);
        fehlerZahl += e.fehler.length;
      }
      if (!angeboten.length) { console.log(`    FEHLER  ${s.id}/${liste}: keine Stufe angeboten`); fehlerZahl++; }
      console.log(`${angeboten.length ? "✓" : "✗"} ${(s.id + "/" + liste).padEnd(40)} Stufen ${angeboten.join(" ") || "—"}`);
    }
  }
}
// Suche (Entscheid SU1 a): feste Beispielsuchen mit erwarteten Treffern (--suche=0 schaltet ab;
// nur die Suche: node tools/pruefe_spiele.js suche).
// zuerst: diese Spiele in dieser Reihenfolge ganz oben; ohne: darf nicht vorkommen; grund: Spiel, das einen Grund nennen muss.
const SUCHFAELLE = [
  { q: "schatz", zuerst: ["koordinaten-schatz", "schaetz-waage"], grund: "wort-zwillinge" },
  { q: "schätzen", enthaelt: ["schaetz-waage", "uhr-werkstatt"] },
  { q: "uhr", zuerst: ["uhr-werkstatt"] },
  { q: "stellen", zuerst: ["stellen-detektiv"], enthaelt: ["zahlen-baukasten", "ziffernkarten"] },
  { q: "zahlenstral", zuerst: ["zahlenstrahl-pfeil"], anzahl: 1 },
  { q: "wortschatz", enthaelt: ["word-match", "wort-zwillinge"], grund: "word-match" },
  { q: "MA.3.A.2", zuerst: ["uhr-werkstatt", "kiosk-kasse", "masse-umwandler"], enthaelt: ["fahrplan-rechner", "komma-messband"], anzahl: 9 },
  { q: "englisch wörter", enthaelt: ["word-match", "wort-zwillinge", "listen-tap", "sound-sorter"], anzahl: 4 },
  { q: "gipfeli", zuerst: ["preis-tabelle"], anzahl: 1, grund: "preis-tabelle" },
  { q: "xyzqw", anzahl: 0 },
];
if (opt.suche !== 0 && (!nurSpiele.length || nurSpiele.includes("suche"))) {
  const k = vm.createContext({ __seite: { html: "", search: "", seed: opt.seed }, console, URL, URLSearchParams, structuredClone });
  vm.runInContext(DOM, k, { filename: "pruef_dom.js" });
  vm.runInContext(fs.readFileSync(path.join(WURZEL, "eulenpfad", "kern", "kern.js"), "utf8"), k, { filename: "kern.js" });
  for (const d of ["spiel.js", "katalog.js", "pruefstand.js"]) vm.runInContext(fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", d), "utf8"), k, { filename: d });
  const suche = q => vm.runInContext(`LS.suche(${JSON.stringify(q)})`, k) || [];
  console.log("\nSuche (feste Beispiele):\n");
  for (const f of SUCHFAELLE) {
    const r = suche(f.q);
    const ids = r.map(t => t.id);
    const maengel = [];
    if (f.zuerst && f.zuerst.some((id, i) => ids[i] !== id)) maengel.push(`zuerst erwartet ${f.zuerst.join(", ")}`);
    for (const id of f.enthaelt || []) if (!ids.includes(id)) maengel.push(`${id} fehlt`);
    if (f.anzahl !== undefined && ids.length !== f.anzahl) maengel.push(`${ids.length} statt ${f.anzahl} Treffer`);
    if (f.grund && !r.find(t => t.id === f.grund)?.grund) maengel.push(`${f.grund} ohne Grund`);
    for (const m of maengel) console.log(`    FEHLER  Suche „${f.q}“: ${m}`);
    fehlerZahl += maengel.length;
    console.log(`${maengel.length ? "✗" : "✓"} „${f.q}“`.padEnd(22) + ` ${ids.slice(0, 5).join(", ")}${ids.length > 5 ? ` … (${ids.length})` : ""}`);
  }
}

// Tab Spiele der Startseite (KT1 a, LERN_Session23): Favoriten, Zuklappen, Alle auf/zu, Filter-Block, Suche, Ähnliche,
// Sortierung im Ersatz-DOM (tools/eulenpfad_seiten.js); --tab=0 schaltet ab; nur dieser Teil: node tools/pruefe_spiele.js tab.
if (opt.tab !== 0 && (!nurSpiele.length || nurSpiele.includes("tab"))) {
  console.log("\nTab Spiele (Startseite):\n");
  let gemeldet = 0;
  let schritte = 0;
  try {
    schritte = require("./eulenpfad_seiten.js").pruefeTabSpiele((ort, text) => { console.log(`    FEHLER  ${ort}: ${text}`); gemeldet++; });
  } catch (e) { console.log(`    FEHLER  Tab Spiele: Abbruch: ${String(e.stack || e).split("\n").slice(0, 3).join(" | ")}`); gemeldet++; }
  fehlerZahl += gemeldet;
  console.log(`${gemeldet ? "✗" : "✓"} Tab Spiele: ${schritte} Prüfschritte${gemeldet ? `, ${gemeldet} Fehler` : ""}`);
}

// Speicherschicht (docs/konzept_gruppen.md 5a, Plan D11, Kern 1.34.0; LERN_Session26): Umzug nach IndexedDB, Start der
// Seiten nach dem Laden, voller Speicher, Erinnerung ans Sichern — im Ersatz-DOM mit tools/ersatz_idb.js
// (tools/eulenpfad_seiten.js); --speicher=0 schaltet ab; nur dieser Teil: node tools/pruefe_spiele.js speicher.
const spaeterSpeicher = [];
if (opt.speicher !== 0 && (!nurSpiele.length || nurSpiele.includes("speicher"))) {
  spaeterSpeicher.push((async () => {
    let gemeldet = 0, schritte = 0;
    try {
      schritte = await require("./eulenpfad_seiten.js").pruefeSpeicher((ort, text) => { console.log(`    FEHLER  ${ort}: ${text}`); gemeldet++; });
    } catch (e) { console.log(`    FEHLER  Speicher: Abbruch: ${String(e.stack || e).split("\n").slice(0, 3).join(" | ")}`); gemeldet++; }
    fehlerZahl += gemeldet;
    console.log(`\nSpeicherschicht (IndexedDB):\n${gemeldet ? "✗" : "✓"} Speicher: ${schritte} Prüfschritte${gemeldet ? `, ${gemeldet} Fehler` : ""}`);
  })());
}

// Sichern und Einlesen (LERN_Session18): Eine Datei eines Geräts muss sich auf einem anderen einlesen lassen. Bis dahin
// wies LS.abgleich.dateiEinlesen jede Datei der Version 3 ab (prüfte das Feld profile, das sie seit LERN_Session15 nicht
// mehr trägt), und kein Test merkte es. Seit Kern 1.15.0 über KERN.daten (Format reihe-daten). Je Fall ein frisches Gerät
// (eigener Kontext, leerer Speicher); --daten=0 schaltet ab; nur dieser Teil: node tools/pruefe_spiele.js daten.
// Asynchrone Fälle (PIN, Freischalten) hängen sich an spaeter; die Zusammenfassung am Ende wartet auf sie.
const spaeter = [];
if (opt.daten !== 0 && (!nurSpiele.length || nurSpiele.includes("daten"))) {
  const geraet = () => {
    const k = vm.createContext({ __seite: { html: "", search: "", seed: opt.seed }, console, URL, URLSearchParams, structuredClone, crypto: globalThis.crypto, TextEncoder });
    vm.runInContext(DOM, k, { filename: "pruef_dom.js" });
    vm.runInContext(fs.readFileSync(path.join(WURZEL, "eulenpfad", "kern", "kern.js"), "utf8"), k, { filename: "kern.js" });
    for (const d of ["spiel.js", "katalog.js", "pruefstand.js", "abgleich.js"]) vm.runInContext(fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", d), "utf8"), k, { filename: d });
    return k;
  };
  const runde = (name, zeit) => ({ name, zeit, inhalt: "zahlenhaus", stufe: "s3", aufgaben: 5, fehler: 1, dauer: 90, sterne: 2 });
  // Gerät A: zwei Kinder mit je einer Runde; die Datei wie beim Abgleich-Knopf (LS.abgleichDaten)
  const a = geraet();
  a.__runden = [runde("Mia", "2026-11-01T10:00:00.000Z"), runde("Leo", "2026-11-01T11:00:00.000Z")];
  vm.runInContext(`LS.neuerSpieler("Mia"); LS.neuerSpieler("Leo"); for (const r of __runden) LS.protokolliere(r);`, a);
  const heute = JSON.parse(vm.runInContext("JSON.stringify(LS.abgleichDaten())", a));
  const sicherung = JSON.parse(vm.runInContext(`JSON.stringify(LS.sicherung(["Mia"]))`, a));
  const v3 = { format: "eulenpfad-daten", version: 3, gesichert: "2026-11-02T09:00:00.000Z",
    personen: [{ id: "p-v3-ana", name: "Ana", rolle: "lernend", angelegt: "2026-11-01T09:00:00.000Z", geaendert: { name: "2026-11-01T09:00:00.000Z" } }],
    protokoll: [{ id: "r-v3-1", person: "p-v3-ana", name: "Ana", zeit: "2026-11-02T08:00:00.000Z", inhalt: "zahlenhaus", stufe: "s3", aufgaben: 5, fehler: 0, dauer: 60, sterne: 3 }], rekorde: [] };
  const faelle = [
    { was: "Abgleich-Datei von heute (reihe-daten)", daten: heute, runden: 2, kinder: 2 },
    { was: `Sicherung einer Person (${sicherung.dateiname})`, daten: sicherung.daten, runden: 1, kinder: 1 },
    { was: "Datei der Version 3 (eulenpfad-daten)", daten: v3, runden: 1, kinder: 1 },
    { was: "Datei der Version 2 (profile nach Namen)", runden: 1, kinder: 1,
      daten: { version: 2, gesichert: "2026-10-30T09:00:00.000Z", profile: { Ida: { klasse: 2, geaendert: { klasse: "2026-10-30T09:00:00.000Z" } } },
        protokoll: [{ name: "Ida", zeit: "2026-10-30T08:00:00.000Z", spiel: "zahlenhaus", stufe: "s2", aufgaben: 5, fehler: 0, dauer: 60, sterne: 3 }], rekorde: [] } },
    { was: "Sicherung des Lernsteigs", wirft: true,
      daten: { format: "lernsteig-sicherung", version: 2, erstellt: "2026-11-01T10:00:00.000Z", konten: [], runden: [], rekorde: [] } },
  ];
  console.log("\nSichern und Einlesen:\n");
  for (const f of faelle) {
    const b = geraet();
    b.__daten = f.daten;
    const maengel = [];
    let r = null;
    try { r = vm.runInContext("LS.abgleich.datenEinlesen(__daten)", b); } catch (e) { if (!f.wirft) maengel.push(`abgewiesen: ${e.message}`); }
    if (f.wirft && r) maengel.push("eingelesen, sollte abgewiesen werden");
    if (!f.wirft && r) {
      const da = JSON.parse(vm.runInContext("JSON.stringify({ runden: LS.protokoll().length, kinder: LS.kinderListe().length })", b));
      if (r.runden !== f.runden || da.runden !== f.runden) maengel.push(`${r.runden} neue / ${da.runden} gespeicherte Runden statt ${f.runden}`);
      if (da.kinder !== f.kinder) maengel.push(`${da.kinder} Kinder statt ${f.kinder}`);
    }
    for (const m of maengel) console.log(`    FEHLER  ${f.was}: ${m}`);
    fehlerZahl += maengel.length;
    console.log(`${maengel.length ? "✗" : "✓"} ${f.was}`);
  }
  // Zweites Einlesen derselben Datei bringt nichts Neues; Löschen auf A wirkt beim Abgleich auch auf B
  {
    const b = geraet();
    b.__daten = heute;
    const zweimal = vm.runInContext("LS.zusammenfuehren(__daten); LS.zusammenfuehren(__daten).runden", b);
    vm.runInContext(`LS.loescheSpieler("Leo")`, a);
    b.__daten = JSON.parse(vm.runInContext("JSON.stringify(LS.abgleichDaten())", a));
    vm.runInContext("LS.zusammenfuehren(__daten)", b);
    const bleibt = vm.runInContext("LS.kinderListe().join() + '|' + LS.protokoll().length", b);
    const maengel = [];
    if (zweimal !== 0) maengel.push(`zweites Einlesen: ${zweimal} neue Runden statt 0`);
    if (bleibt !== "Mia|1") maengel.push(`nach dem Löschen von Leo auf A: ${bleibt} statt Mia|1`);
    for (const m of maengel) console.log(`    FEHLER  Löschen und zweites Einlesen: ${m}`);
    fehlerZahl += maengel.length;
    console.log(`${maengel.length ? "✗" : "✓"} Zweites Einlesen ohne Neues, Löschen wirkt auf dem anderen Gerät`);
  }
  // Geschützte Aufsicht (DF4 a): ohne PIN in der Datei, auf dem anderen Gerät gesperrt; Anmelden geht erst nach dem
  // Freischalten mit dem Code (oder der PIN einer anderen Aufsicht dieses Geräts)
  spaeter.push((async () => {
    const c = geraet();
    await vm.runInContext(`(async () => { LS.neuerSpieler("Mama"); await LS.setzePin("Mama", "2468"); await LS.setzeWiederherstellung("Mama", { code: "K7QM-2XRA-9TPL" }); })()`, c);
    const datei = vm.runInContext("JSON.stringify(LS.abgleichDaten())", c);
    const d = geraet();
    d.__datei = datei;
    const r = await vm.runInContext(`(async () => {
      LS.abgleich.datenEinlesen(__datei);
      const vorher = { gesperrt: LS.gesperrt("Mama"), an: await LS.meldeAufsichtAn("Mama", "2468") };
      let falsch = "";
      try { await LS.freischalten("Mama", "1357", { code: "AAAA-AAAA-AAAA" }); } catch (e) { falsch = e.message; }
      await LS.freischalten("Mama", "1357", { code: "k7qm 2xra 9tpl" });
      return { ...vorher, falsch, danach: LS.gesperrt("Mama"), an2: await LS.meldeAufsichtAn("Mama", "1357") };
    })()`, d);
    const maengel = [];
    const mama = JSON.parse(datei).personen.find(p => p.name === "Mama");
    if (!mama || mama.pin !== undefined || !mama.geschuetzt || Object.keys(mama.wiederherstellung || {}).join() !== "code") maengel.push("Mama nicht als geschützt ohne PIN in der Datei");
    if (!r.gesperrt) maengel.push("nicht gesperrt");
    if (r.an) maengel.push("Anmeldung mit der PIN des anderen Geräts ging");
    if (r.falsch !== "Der Code stimmt nicht.") maengel.push(`falscher Code: „${r.falsch}“`);
    if (r.danach || !r.an2) maengel.push("nach dem Freischalten nicht anmeldbar");
    // OA1 a: Auf einem Gerät, auf dem Papa schon Aufsicht mit PIN ist, reicht Mamas richtiger Code nicht; Papa bestätigt
    const e = geraet();
    e.__datei = datei;
    const r2 = await vm.runInContext(`(async () => {
      LS.neuerSpieler("Papa"); await LS.setzePin("Papa", "1122");
      LS.abgleich.datenEinlesen(__datei);
      // KE1 a: die gesperrte Mama lässt sich hier ausblenden (nicht löschen), Papa nicht; sie bleibt in den Daten
      const aus = { darf: [LS.darfAusblenden("Mama"), LS.darfAusblenden("Papa")].join() };
      LS.ausblenden("Mama");
      aus.weg = [LS.angezeigt("Mama"), LS.spielerListe().includes("Mama"), LS.abgleichDaten().personen.some(p => p.name === "Mama"), "ausgeblendet" in LS.abgleichDaten()].join();
      LS.zeigen("Mama");
      aus.wieder = LS.angezeigt("Mama");
      let mitCode = "";
      try { await LS.freischalten("Mama", "1357", { code: "K7QM-2XRA-9TPL" }); } catch (e) { mitCode = e.message; }
      const nachCode = LS.gesperrt("Mama");
      if (nachCode) await LS.freischalten("Mama", "1357", { von: "Papa", vonPin: "1122" });
      return { aus, mitCode, nachCode, danach: LS.gesperrt("Mama"), soll: KERN.person.NUR_BESTAETIGUNG };
    })()`, e);
    if (r2.aus.darf !== "true,false") maengel.push(`ausblenden erlaubt (Mama, Papa): ${r2.aus.darf} statt true,false`);
    if (r2.aus.weg !== "false,true,true,false") maengel.push(`ausgeblendet (angezeigt, in der Liste, im Abgleich, Liste im Abgleich): ${r2.aus.weg} statt false,true,true,false`);
    if (!r2.aus.wieder) maengel.push("nach „wieder zeigen“ nicht angezeigt");
    if (r2.mitCode !== r2.soll || !r2.nachCode) maengel.push(`Gerät mit Aufsicht: Code allein ${r2.mitCode ? "abgewiesen mit „" + r2.mitCode + "“" : "hat freigeschaltet"}`);
    if (r2.danach) maengel.push("Gerät mit Aufsicht: mit Bestätigung nicht freigeschaltet");
    for (const m of maengel) console.log(`    FEHLER  Geschützte Aufsicht: ${m}`);
    fehlerZahl += maengel.length;
    console.log(`${maengel.length ? "✗" : "✓"} Geschützte Aufsicht: gesperrt, mit dem Code freigeschaltet`);
  })().catch(e => { console.log(`    FEHLER  Geschützte Aufsicht: ${e.stack || e}`); fehlerZahl++; }));
}

// Namen der Spiele (Hinweis Patrik, LERN_Session7): kein Name doppelt (Fehler); dasselbe Grundwort
// am Ende („…-Werkstatt“, „…-Detektiv“) in mehr als NAMEN_GRUNDWORT_MAX Spielen ist ein Hinweis.
const NAMEN_GRUNDWORT_MAX = 2;
if (opt.namen !== 0 && !nurSpiele.length) {
  const kat = vm.createContext({ LS: { SKALA: [] } });
  vm.runInContext(fs.readFileSync(path.join(SPIELE_DIR, "gemeinsam", "katalog.js"), "utf8") + ";this.SPIELE = SPIELE;", kat);
  console.log("\nNamen der Spiele:\n");
  const namen = new Map();
  const grundwoerter = new Map();
  for (const s of kat.SPIELE) {
    const n = s.name.trim().toLowerCase();
    namen.set(n, [...(namen.get(n) || []), s.id]);
    const teile = s.name.split(/[-\s]+/);
    if (teile.length > 1) { const g = teile[teile.length - 1]; grundwoerter.set(g, [...(grundwoerter.get(g) || []), s.name]); }
  }
  let gemeldet = 0;
  for (const [n, ids] of namen) if (ids.length > 1) { console.log(`    FEHLER  Name „${n}“ doppelt: ${ids.join(", ")}`); fehlerZahl++; gemeldet++; }
  for (const [g, liste] of grundwoerter) if (liste.length > NAMEN_GRUNDWORT_MAX) { console.log(`    hinweis Grundwort „${g}“ in ${liste.length} Namen: ${liste.join(", ")}`); gemeldet++; }
  if (!gemeldet) console.log(`✓ ${kat.SPIELE.length} Namen, keiner doppelt, kein Grundwort öfter als ${NAMEN_GRUNDWORT_MAX}-mal`);
}

// Tipps (ctx.tipp, Entscheid T2 a): welche Spiele in welchen Stufen noch keine haben — eine Übersicht, kein Fehler.
if (ohneTipp.size) {
  console.log(`\nOhne Tipps (ctx.tipp): ${ohneTipp.size} Spiel${ohneTipp.size === 1 ? "" : "e"}`);
  for (const [id, st] of ohneTipp) console.log(`    ${id.padEnd(22)} ${st.length === STUFEN.length ? "alle Stufen" : st.join(" ")}`);
}
Promise.all([...spaeter, ...spaeterSpeicher]).then(() => {
  console.log(`\n${fehlerZahl ? fehlerZahl + " Fehler" : "Keine Fehler"}.`);
  require("./testausgabe.js").merke("pruefe_spiele", `${fehlerZahl ? fehlerZahl + " Fehler" : "Keine Fehler"}.`); // HK1 a
  process.exitCode = fehlerZahl ? 1 : 0;
});
