// Abdeckung der Lehrplan-Stufen im Lernsteig (Plan E 1, Entscheid AT1 a, LERN_Session23).
//
// Daten: docs/lernsteig/abdeckung.json — je Übung und Lehrplan-Stufe die Inhaltsteile des Lehrplans, jeder mit genau
// einer Zuordnung: typen (Aufgabentypen `typ` der Übung), in (eine andere Übung), bewusst (nicht geübt, mit Grund)
// oder offen (true). Dazu optional fehlt (was am Teil noch fehlt), aus (Inhalt einer anderen Kompetenz-Stufe, etwa
// MA.1.A.1.h) und notiz. Je Stufe quelle: "wortlaut" (am Lehrplan nachgelesen) oder "sinngemaess" (aus der
// Zusammenfassung in docs/lernsteig/lehrplan/).
//
// Geprüft von tools/pruefe_uebungen.js gegen die erzeugten Aufgaben: ein Typ ohne Inhaltsteil ist ein Fehler (die Übung
// übt, was nicht in der Stufe steht), ein zugeordneter Typ, der nicht vorkommt, ebenso; offene und teilweise
// abgedeckte Teile sind Hinweise.
//
// Übersicht: docs/lernsteig/abdeckung.md wird aus den Daten und gemessenen Anteilen erzeugt, nie von Hand:
//   node tools/abdeckung.js            schreibt die Übersicht
//   node tools/abdeckung.js --pruefe   meldet nur, ob sie aktuell ist (Code 1, wenn nicht)
"use strict";
const fs = require("fs");
const path = require("path");

const WURZEL = path.join(__dirname, "..");
const APP = path.join(WURZEL, "lernsteig");
const DATEN = path.join(WURZEL, "docs", "lernsteig", "abdeckung.json");
const UEBERSICHT = path.join(WURZEL, "docs", "lernsteig", "abdeckung.md");
const MESSUNG = { aufgaben: 1000, seed: 7 }; // Anteile in der Übersicht: fester Startwert, damit sie gleich bleibt
const QUELLEN = { wortlaut: "am Wortlaut nachgelesen", sinngemaess: "sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)" };
const ZUORDNUNGEN = ["typen", "in", "bewusst", "offen"];

/** Lernsteig für Node laden (wie tools/pruefe_uebungen.js); gibt den Katalog. */
function ladeLernsteig() {
  require(path.join(APP, "kern", "kern.js"));
  if (!global.LST) global.LST = require(path.join(APP, "gemeinsam", "werkzeug.js"));
  if (!global.LST_LEHRPLAENE) global.LST_LEHRPLAENE = require(path.join(APP, "gemeinsam", "lehrplaene.js"));
  if (!global.LST_TERME) global.LST_TERME = require(path.join(APP, "gemeinsam", "terme.js"));
  return require(path.join(APP, "gemeinsam", "katalog.js"));
}

/** Aufgaben-Modul einer Übung, mit ihren Inhaltslisten als Globals (wie die Seite sie lädt). */
function ladeUebung(id) {
  const ordner = path.join(APP, "uebungen", id);
  for (const datei of fs.readdirSync(ordner).filter(d => d.endsWith(".js") && d !== "aufgaben.js"))
    global[path.basename(datei, ".js").toUpperCase().replace(/-/g, "_")] = require(path.join(ordner, datei));
  return require(path.join(ordner, "aufgaben.js"));
}

const lies = () => JSON.parse(fs.readFileSync(DATEN, "utf8"));

/**
 * Anteile der Typen je Lehrplan-Stufe (Map stufe → Map typ → Anzahl), über alle Niveaus, mit festem Startwert. Die
 * Zufallsquelle des Kerns wird danach zurückgesetzt.
 */
function messe(eintrag, U, { aufgaben = MESSUNG.aufgaben, seed = MESSUNG.seed } = {}) {
  const q = KERN.zufall.quelle, vorher = q.zufall;
  q.zufall = KERN.zufall.mitStartwert(seed);
  try {
    const erg = new Map();
    for (const stufe of eintrag.stufen) {
      const z = new Map();
      for (const niveau of eintrag.niveaus) for (let i = 0; i < aufgaben; i++) {
        const t = U.aufgabeErzeugen(stufe, niveau).typ || "(ohne typ)";
        z.set(t, (z.get(t) || 0) + 1);
      }
      erg.set(stufe, z);
    }
    return erg;
  } finally { q.zufall = vorher; }
}

/** Prüft die Daten einer Übung gegen Katalog und gemessene Typen (Set je Stufe). → [{ art: "fehler"|"hinweis", wo, text }] */
function pruefeUebung(daten, eintrag, typenJeStufe, katalog) {
  const m = [];
  const f = (wo, text) => m.push({ art: "fehler", wo, text });
  const h = (wo, text) => m.push({ art: "hinweis", wo, text });
  const d = daten.uebungen[eintrag.id];
  if (!d) return m;
  for (const s of Object.keys(d)) if (!eintrag.stufen.includes(s)) f(`${eintrag.id}/${s}`, "Stufe steht in abdeckung.json, aber nicht im Katalog");
  for (const s of eintrag.stufen) {
    const wo = `${eintrag.id}/${s} Abdeckung`;
    const st = d[s];
    if (!st) { f(wo, "Stufe fehlt in docs/lernsteig/abdeckung.json"); continue; }
    if (!QUELLEN[st.quelle]) f(wo, `quelle „${st.quelle}“ (erlaubt: ${Object.keys(QUELLEN).join(", ")})`);
    if (!Array.isArray(st.teile) || !st.teile.length) { f(wo, "keine Inhaltsteile"); continue; }
    const zugeordnet = new Set();
    st.teile.forEach((t, i) => {
      const ort = `${wo}, Teil ${i + 1}`;
      if (typeof t.text !== "string" || !t.text.trim()) f(ort, "ohne Text");
      const arten = ZUORDNUNGEN.filter(z => t[z] !== undefined);
      if (arten.length !== 1) { f(ort, `braucht genau eine Zuordnung (${ZUORDNUNGEN.join(", ")}), hat ${arten.join(", ") || "keine"}`); return; }
      if (t.typen !== undefined) {
        if (!Array.isArray(t.typen) || !t.typen.length) f(ort, "typen ist keine Liste");
        else for (const ty of t.typen) zugeordnet.add(ty);
      }
      if (t.in !== undefined && !katalog.UEBUNGEN.some(u => u.id === t.in)) f(ort, `Übung „${t.in}“ gibt es nicht`);
      if (t.bewusst !== undefined && (typeof t.bewusst !== "string" || !t.bewusst.trim())) f(ort, "bewusst ohne Grund");
      if (t.offen !== undefined && t.offen !== true) f(ort, "offen ist nicht true");
      if (t.offen) h(wo, `offen: ${t.text}`);
      if (t.fehlt) h(wo, `teilweise — ${t.text}: fehlt ${t.fehlt}`);
    });
    const gemessen = typenJeStufe.get(s) || new Set();
    for (const ty of gemessen) if (!zugeordnet.has(ty)) f(wo, `Typ „${ty}“ ist keinem Inhaltsteil zugeordnet (übt die Stufe etwas, das nicht im Lehrplan steht?)`);
    for (const ty of zugeordnet) if (!gemessen.has(ty)) f(wo, `Typ „${ty}“ zugeordnet, kommt aber in den Aufgaben nicht vor`);
  }
  return m;
}

/** Übersicht als Markdown aus Daten, Katalog und Messung (Map id → Map stufe → Map typ → Anzahl). */
function markdown(daten, katalog, messung) {
  const z = [];
  const erfasst = katalog.UEBUNGEN.filter(u => daten.uebungen[u.id]);
  const fehlend = katalog.UEBUNGEN.filter(u => !daten.uebungen[u.id]);
  const stufen = erfasst.reduce((n, u) => n + u.stufen.length, 0), alle = katalog.UEBUNGEN.reduce((n, u) => n + u.stufen.length, 0);
  z.push("# Abdeckung der Lehrplan-Stufen — Lernsteig", "",
    "Erzeugt von `node tools/abdeckung.js` aus `docs/lernsteig/abdeckung.json` und den Aufgaben der Übungen — **nicht von",
    "Hand ändern** (Plan E 1, Entscheid AT1 a). Geprüft von `tools/pruefe_uebungen.js`. Anteile: " + MESSUNG.aufgaben +
    " Aufgaben je Stufe und Niveau, Startwert " + MESSUNG.seed + ".", "",
    `Erfasst: ${erfasst.length} von ${katalog.UEBUNGEN.length} Übungen, ${stufen} von ${alle} Stufen.`, "");
  for (const u of erfasst) {
    z.push(`## ${u.titel} (\`${u.id}\`, ${u.kompetenz})`, "");
    for (const s of u.stufen) {
      const st = daten.uebungen[u.id][s];
      if (!st) continue;
      const anteile = messung.get(u.id)?.get(s) || new Map();
      const summe = [...anteile.values()].reduce((a, b) => a + b, 0) || 1;
      const prozent = ty => `${Math.round(100 * (anteile.get(ty) || 0) / summe)} %`;
      z.push(`### ${u.kompetenz}.${s} — ${QUELLEN[st.quelle] || st.quelle}`, "");
      if (st.notiz) z.push(st.notiz, "");
      z.push("| Inhalt des Lehrplans | Abdeckung | Was fehlt |", "|---|---|---|");
      for (const t of st.teile) {
        const text = (t.aus ? `(${t.aus}) ` : "") + t.text + (t.notiz ? ` — *${t.notiz}*` : "");
        const abd = t.typen ? t.typen.map(ty => `\`${ty}\` ${prozent(ty)}`).join(", ")
          : t.in ? `in \`${t.in}\`` : t.bewusst ? `bewusst nicht: ${t.bewusst}` : "**offen**";
        z.push(`| ${text} | ${abd} | ${t.fehlt || (t.offen ? "alles" : "—")} |`);
      }
      z.push("");
    }
  }
  if (fehlend.length) z.push("## Noch nicht erfasst", "", fehlend.map(u => `\`${u.id}\``).join(", "), "");
  return z.join("\n");
}

/** Übersicht für alle Übungen erzeugen (lädt und misst jede erfasste Übung). */
function erzeuge() {
  const katalog = ladeLernsteig();
  const daten = lies();
  const messung = new Map();
  for (const u of katalog.UEBUNGEN) if (daten.uebungen[u.id]) messung.set(u.id, messe(u, ladeUebung(u.id)));
  return markdown(daten, katalog, messung);
}

/** Ist die Übersicht aktuell? → null oder Grund. */
function veraltet() {
  const soll = erzeuge();
  const ist = fs.existsSync(UEBERSICHT) ? fs.readFileSync(UEBERSICHT, "utf8").replace(/\r\n/g, "\n") : "";
  return ist === soll ? null : "docs/lernsteig/abdeckung.md ist nicht aktuell — neu erzeugen mit: node tools/abdeckung.js";
}

module.exports = { lies, messe, pruefeUebung, markdown, erzeuge, veraltet, ladeUebung, DATEN, UEBERSICHT };

if (require.main === module) {
  if (process.argv.includes("--pruefe")) {
    const grund = veraltet();
    console.log(grund || "docs/lernsteig/abdeckung.md ist aktuell.");
    process.exit(grund ? 1 : 0);
  }
  fs.writeFileSync(UEBERSICHT, erzeuge());
  console.log("geschrieben: docs/lernsteig/abdeckung.md");
}
