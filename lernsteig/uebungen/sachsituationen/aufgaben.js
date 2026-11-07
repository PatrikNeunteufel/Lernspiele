/* Übung „Sachsituationen“ — MA.3.C.2, Stufen f, g, h (Gymnasium und EAP prüfen f, g, h; PA). Ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.3.C.2:
   f  proportionale und lineare Zusammenhänge erkennen (Taxipreis); Alltagssituationen in mathematische Sprache
      übersetzen (ohne die Erweiterung indirekt proportional)
   g  (OP) Abhängigkeit zweier Grössen als Graph, Graphen deuten (Weg-Zeit-Diagramm); (Erweiterung: lineare
      Zusammenhänge als Term, Wechselkurse — hier nur in der Challenge)
   h  (GA) Wertetabellen, Texte, Terme, Graphen einander zuordnen
   Annahmen, mit Patrik abzustimmen: Preise erfunden, auf 5 Rappen; Weg-Zeit-Graph mit ganzzahligen Ablesewerten. */
"use strict";

const UEBUNG = {
  id: "sachsituationen",
  einleitung: "Übersetze die Situation in eine Rechnung.",
  stufen: {
    f: "Dreisatz und Tarif mit Grundgebühr",
    g: "Weg-Zeit-Graph lesen, Tarif rückwärts",
    h: "Tabelle, Text und Term einander zuordnen",
    challenge: "Zwei Tarife vergleichen",
  },
};

const z = (a, b) => LST.zufall(a, b);
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
const fr = x => (Number.isInteger(rund(x)) ? dez(x) : LST.dezimalText(rund(x), 2));
const auf5 = x => Math.abs(Math.round(x * 20) - x * 20) < 1e-6;
const MAL = " · ";

function fertig(stufe, typ, text, antwort, einheit, weg, daten, extra) {
  return Object.assign({ art: "zahl", stufe, typ, text, einheit, antwort: rund(antwort), loesung: `${einheit === "Fr." ? fr(antwort) : dez(antwort)}${einheit ? " " + einheit : ""}`, weg, kennung: text, daten }, extra || {});
}

// ---------- f ----------
function stufeF() {
  if (LST.zufall(0, 1)) {
    for (;;) {
      const ware = LST.waehle([["kg Äpfel", "kg"], ["l Apfelsaft", "l"], ["m Stoff", "m"]]);
      const preisJe = z(10, 120) * 0.05, a = z(2, 9), b = z(2, 15);
      if (a === b || !auf5(preisJe * a) || !auf5(preisJe * b)) continue;
      return fertig("f", "dreisatz", `${a} ${ware[0]} kosten ${fr(preisJe * a)} Fr. Was kosten ${b} ${ware[1]}?`, preisJe * b, "Fr.",
        `${fr(preisJe * a)} : ${a} = ${fr(preisJe)} je ${ware[1]}; ${fr(preisJe)}${MAL}${b} = ${fr(preisJe * b)}`, { a, b, pa: preisJe * a });
    }
  }
  const grund = z(4, 8), proKm = z(20, 50) / 10, km = z(2, 25);
  return fertig("f", "taxi", `Taxi: Grundtaxe ${fr(grund)} Fr., dazu ${fr(proKm)} Fr. pro km. Preis für ${km} km =`, grund + proKm * km, "Fr.",
    `${fr(grund)} + ${fr(proKm)}${MAL}${km} = ${fr(grund + proKm * km)}`, { grund, proKm, km });
}

// ---------- g ----------
function stufeG() {
  if (LST.zufall(0, 1)) {
    const v = LST.waehle([3, 4, 5, 6]), t = z(1, 6);
    return fertig("g", "weg-zeit", `Weg-Zeit-Diagramm einer Wanderung (Zeit in h, Weg in km). Wie weit ist sie nach ${t} h?`, v * t, "km",
      `Ablesen: über ${t} h liegt die Gerade bei ${v * t} km`, { v, t },
      { darstellung: { art: "graph", m: v, b: 0, x: [0, 6], y: [0, 36], schrittY: 2, beschrY: 6, hoehe: 260, xName: "h", yName: "km" } });
  }
  for (;;) {
    const grund = z(4, 8), proKm = z(20, 50) / 10, km = z(2, 30);
    const preis = grund + proKm * km;
    return fertig("g", "taxi-rueckwaerts", `Taxi: Grundtaxe ${fr(grund)} Fr., dazu ${fr(proKm)} Fr. pro km. Die Fahrt kostete ${fr(preis)} Fr. Wie viele km?`, km, "km",
      `(${fr(preis)} − ${fr(grund)}) : ${fr(proKm)} = ${km}`, { grund, proKm, preis });
  }
}

// ---------- h: zuordnen (Auswahl) ----------
const term = (m, b) => `y = ${m === 1 ? "" : m}x${b ? ` ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : ""}`;
function stufeH() {
  const m = z(2, 6), b = z(-5, 9);
  const kand = [[m, b], [b === 0 ? m + 1 : b, m], [m, b + 1], [m + 1, b - 1], [m - 1, b + m]];
  const passt = ([mm, bb]) => [0, 1, 2, 3].every(x => mm * x + bb === m * x + b);
  const andere = [];
  for (const k of LST.mische(kand.slice(1))) if (!passt(k) && !andere.some(x => term(...x) === term(...k)) && term(...k) !== term(m, b) && k[0] !== 0) andere.push(k);
  if (andere.length < 3) return stufeH();
  const opt = LST.mische([[m, b], ...andere.slice(0, 3)]);
  const texte = opt.map(k => term(...k));
  const richtig = opt.findIndex(k => k[0] === m && k[1] === b);
  if (LST.zufall(0, 1)) {
    return { art: "auswahl", stufe: "h", typ: "tabelle-term", text: "Welcher Term passt zur Tabelle?", optionen: texte, richtig, loesung: texte[richtig],
      weg: `Je Schritt +${m}, bei x = 0 ist y = ${b}: ${term(m, b)}`, kennung: `T ${m} ${b} ${texte.slice().sort().join("|")}`, daten: { m, b, opt },
      darstellung: { art: "tabelle", kopf: ["x", "y"], zeilen: [0, 1, 2, 3].map(x => [x, m * x + b]) } };
  }
  const grund = Math.abs(b) + 1 === m ? Math.abs(b) + 2 : Math.abs(b) + 1; // Grundgebühr ≠ Stundenpreis
  const opt2 = LST.mische([[m, grund], [grund, m], [m + grund, 0], [m, 0]]);
  const t2 = opt2.map(k => term(...k));
  return { art: "auswahl", stufe: "h", typ: "text-term", text: `Ein Velo mieten kostet ${grund} Fr. Grundgebühr und ${m} Fr. pro Stunde. Welcher Term gibt den Preis y für x Stunden?`,
    optionen: t2, richtig: opt2.findIndex(k => k[0] === m && k[1] === grund), loesung: term(m, grund),
    weg: `${m} Fr. pro Stunde: ${m}x, dazu ${grund} Fr.: ${term(m, grund)}`, kennung: `V ${m} ${grund} ${t2.slice().sort().join("|")}`, daten: { m, b: grund, opt: opt2 } };
}

// ---------- Challenge ----------
function challenge() {
  for (;;) {
    const gA = z(2, 6), pA = z(25, 40) / 10, gB = z(gA + 2, 15), pB = z(15, Math.round(pA * 10) - 3) / 10;
    // A billiger als B, solange gA + pA·x < gB + pB·x; gesucht: ab wie vielen ganzen km B billiger ist
    // ganzzahlig in Zehnteln rechnen (sonst wird aus 10 km Gleichstand 9.999… km)
    const zaehler = (gB - gA) * 10, nenner = Math.round(pA * 10) - Math.round(pB * 10);
    const grenze = zaehler / nenner;
    if (!(grenze > 1 && grenze < 60)) continue;
    const km = Math.floor(zaehler / nenner) + 1; // B echt billiger: erste ganze Zahl über dem Gleichstand
    if (zaehler % nenner !== 0 && Math.floor(zaehler / nenner) !== Math.floor(grenze)) continue;
    return fertig("challenge", "tarifvergleich", `Taxi A: ${fr(gA)} Fr. + ${fr(pA)} Fr. pro km. Taxi B: ${fr(gB)} Fr. + ${fr(pB)} Fr. pro km. Ab wie vielen ganzen km ist Taxi B billiger?`, km, "km",
      `${fr(gA)} + ${fr(pA)}x = ${fr(gB)} + ${fr(pB)}x → x = ${dez(Math.round(grenze * 100) / 100)}; ab ${km} km ist B billiger`, { gA, pA, gB, pB });
  }
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "f") return stufeF();
  if (stufe === "g") return stufeG();
  if (stufe === "h") return stufeH();
  if (stufe === "challenge") return challenge();
  throw new Error(`sachsituationen: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    dreisatz: "Rechne zuerst, was eine Einheit kostet, dann mal die gesuchte Menge.",
    taxi: "Grundtaxe einmal, dazu der Preis pro km mal die Anzahl km.",
    "weg-zeit": "Geh auf der Zeitachse zum Wert, senkrecht zur Geraden, waagrecht zur Wegachse. Beachte den Massstab der Achse.",
    "taxi-rueckwaerts": "Zuerst die Grundtaxe abziehen, dann durch den Preis pro km teilen.",
    "tabelle-term": "Um wie viel wächst y je Schritt? Was ist y bei x = 0? Prüfe den Term mit einer Zeile der Tabelle.",
    "text-term": "Was hängt von den Stunden ab (steht beim x), was kommt einmal dazu?",
    tarifvergleich: "Stelle beide Preise als Term auf und setze sie gleich. Danach die nächste ganze Zahl prüfen.",
  };
  return h[a.typ] || "Übersetze Schritt für Schritt.";
}

const B = KERN.bruch, Z = x => B.vonZahl(x);
/** Exakt nachrechnen aus Werten in der Form von a.daten (aus den Daten oder aus dem Text); null bei unbekanntem Typ. */
function sollAus(typ, d) {
  switch (typ) {
    case "dreisatz": return B.mal(B.durch(Z(d.pa), Z(d.a)), Z(d.b));
    case "taxi": return B.plus(Z(d.grund), B.mal(Z(d.proKm), Z(d.km)));
    case "weg-zeit": return B.mal(Z(d.v), Z(d.t));
    case "taxi-rueckwaerts": return B.durch(B.minus(Z(d.preis), Z(d.grund)), Z(d.proKm));
    case "tarifvergleich": {
      // kleinste ganze Zahl km, bei der B echt billiger ist
      const preis = (g, p, x) => B.plus(Z(g), B.mal(Z(p), Z(x)));
      for (let x = 0; x < 200; x++) if (B.minus(preis(d.gB, d.pB, x), preis(d.gA, d.pA, x)).z < 0n) return Z(x);
      return Z(0);
    }
    default: return null;
  }
}
/** Welche der Antworten (Paare [m, b]) trifft y = m·x + b in den Zeilen x = 0 … 3? Indizes. */
const treffer = (opt, mm, bb) => opt.map(([p, q], i) => ([0, 1, 2, 3].every(x => p * x + q === mm * x + bb) ? i : -1)).filter(i => i >= 0);

/**
 * Den angezeigten Text lesen (Plan B2 Schritt 3, TD1 a), unabhängig vom Erzeuger: je Typ der Satz als Muster
 * (LST.zahlenImText) und, wo der Jugendliche mehr sieht, die Darstellung (Weg-Zeit: die gezeichnete Gerade; Tabelle:
 * Zuwachs und y bei x = 0) und die Antworten der Auswahl („y = 3x − 2“). Liefert die Werte in der Form von a.daten oder null.
 */
const muster = (text, mu) => LST.zahlenImText(text, mu);
/** „y = 3x − 2“, „y = x + 4“, „y = -2x“ → [m, b] oder null. */
function liesTerm(s) {
  const r = String(s).match(/^y = ([−-]?\d*)x(?: ([+−-]) (\d+))?$/);
  if (!r) return null;
  const m = r[1] === "" ? 1 : r[1] === "-" || r[1] === "−" ? -1 : LST.leseZahl(r[1]);
  return [m, r[2] ? (r[2] === "+" ? 1 : -1) * Number(r[3]) : 0];
}
const liesOptionen = a => { const o = (a.optionen || []).map(liesTerm); return o.length && o.every(Boolean) ? o : null; };
const LESER = {
  dreisatz: a => { const z = muster(a.text, "# ~ ~ kosten # Fr. Was kosten # ~?"); return z && { a: z[0], b: z[2], pa: z[1] }; },
  taxi: a => { const z = muster(a.text, "Taxi: Grundtaxe # Fr., dazu # Fr. pro km. Preis für # km ="); return z && { grund: z[0], proKm: z[1], km: z[2] }; },
  "weg-zeit": a => {
    const z = muster(a.text, "Weg-Zeit-Diagramm einer Wanderung (Zeit in h, Weg in km). Wie weit ist sie nach # h?");
    return z && a.darstellung && a.darstellung.b === 0 ? { v: a.darstellung.m, t: z[0] } : null;
  },
  "taxi-rueckwaerts": a => { const z = muster(a.text, "Taxi: Grundtaxe # Fr., dazu # Fr. pro km. Die Fahrt kostete # Fr. Wie viele km?"); return z && { grund: z[0], proKm: z[1], preis: z[2] }; },
  "tabelle-term": a => {
    const zeilen = a.text === "Welcher Term passt zur Tabelle?" && a.darstellung && a.darstellung.zeilen, opt = liesOptionen(a);
    const y = x => (zeilen.find(r => r[0] === x) || [])[1];
    return zeilen && opt && y(0) !== undefined && y(1) !== undefined ? { m: y(1) - y(0), b: y(0), opt } : null;
  },
  "text-term": a => {
    const z = muster(a.text, "Ein Velo mieten kostet # Fr. Grundgebühr und # Fr. pro Stunde. Welcher Term gibt den Preis y für x Stunden?"), opt = liesOptionen(a);
    return z && opt ? { m: z[1], b: z[0], opt } : null;
  },
  tarifvergleich: a => {
    const z = muster(a.text, "Taxi A: # Fr. + # Fr. pro km. Taxi B: # Fr. + # Fr. pro km. Ab wie vielen ganzen km ist Taxi B billiger?");
    return z && { gA: z[0], pA: z[1], gB: z[2], pB: z[3] };
  },
};
function liesText(a) {
  const l = LESER[a.typ];
  return (l && l(a)) || null;
}
const gleichWert = (x, y) => (Array.isArray(x) ? Array.isArray(y) && x.length === y.length && x.every((v, i) => gleichWert(v, y[i]))
  : typeof x === "number" && typeof y === "number" ? Math.abs(x - y) < 1e-9 : x === y);

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  // Text gegen Prüfdaten (TD1 a): was der Jugendliche sieht, sind dieselben Werte
  const t = liesText(a);
  if (!t) m.push(`Text folgt keinem Muster des Typs ${a.typ}: ${a.text}`);
  else {
    const anders = Object.keys(d).filter(k => !gleichWert(t[k], d[k]));
    if (anders.length) m.push(`Angezeigt ${anders.map(k => `${k} = ${JSON.stringify(t[k])}`).join(", ")}, Prüfdaten ${anders.map(k => `${k} = ${JSON.stringify(d[k])}`).join(", ")}: ${a.text}`);
  }
  if (a.art === "auswahl") {
    const zeilen = [0, 1, 2, 3].map(x => d.m * x + d.b);
    const passt = d.opt.map(([mm, bb]) => [0, 1, 2, 3].every(x => mm * x + bb === zeilen[x]));
    if (passt.filter(Boolean).length !== 1) m.push(`${passt.filter(Boolean).length} passende Terme: ${a.optionen.join(" | ")}`);
    if (!passt[a.richtig]) m.push("falsche Antwort als richtig markiert");
    if (new Set(a.optionen).size !== 4) m.push("doppelte Terme");
    // aus dem Gezeigten: genau die markierte Antwort passt
    if (t && treffer(t.opt, t.m, t.b).join() !== String(a.richtig)) m.push(`aus dem Text passt Antwort ${treffer(t.opt, t.m, t.b).map(i => i + 1).join(", ") || "keine"}, markiert ${a.richtig + 1}: ${a.optionen.join(" | ")}`);
    return m;
  }
  const soll = sollAus(a.typ, d);
  if (!soll) return [`unbekannter Typ ${a.typ}`];
  if (!B.gleich(soll, Z(a.antwort))) m.push(`Lösung ${a.antwort}, nachgerechnet ${B.text(soll)}: ${a.text}`);
  if (t && !B.gleich(sollAus(a.typ, t), Z(a.antwort))) m.push(`aus dem Text nachgerechnet ${B.text(sollAus(a.typ, t))}, Lösung ${a.antwort}: ${a.text}`);
  if (a.einheit === "Fr." && !auf5(a.antwort)) m.push(`Franken nicht auf 5 Rp.: ${a.loesung}`);
  if (a.darstellung && a.darstellung.art === "graph") {
    const g = a.darstellung;
    if (g.m * d.t > g.y[1] || d.t > g.x[1]) m.push("Ablesepunkt ausserhalb des Graphen");
    if (Math.abs(g.m - d.v) > 1e-9) m.push("Gerade passt nicht zur Geschwindigkeit");
  }
  if (["taxi-rueckwaerts"].includes(a.typ) && !Number.isInteger(a.antwort)) m.push("km nicht ganzzahlig");
  if (/\d{4}/.test(a.text.replace(/\.\d+/g, ""))) m.push(`Tausender ohne Apostroph: ${a.text}`);
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis, liesText };
