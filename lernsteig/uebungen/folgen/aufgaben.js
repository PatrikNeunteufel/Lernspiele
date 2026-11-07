/* Übung „Folgen und Muster“ — MA.1.C.2, Stufen g, h, i, j (Gymnasium und EAP prüfen h, i ohne Erweiterung, j; PA).
   Ohne DOM. Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.1.C.2:
   g  Gesetzmässigkeiten natürlicher Zahlen an Beispielen (Quadratzahlen haben ungerade viele Teiler); Zahlenfolgen mit
      positiven rationalen Zahlen
   h  Zahlenrätsel mathematisieren; Figurenfolgen numerisch beschreiben (Würfeltürme)
   i  Gesetzmässigkeiten mit Buchstabentermen verallgemeinern (1 + 3 + 5 + 7 = 4 · 4; n(n + 1) als Rechteck)
   j  (GA) lineare Figurenfolgen als Term (n Dreiecke aus Hölzchen: 2n + 1)
   Figurenfolgen erscheinen als Wertetabelle (Bilder folgen). Annahme: in Stufe j wird der Term mit der Variablen n
   verlangt (Term-Antwort, vereinfacht). */
"use strict";

const UEBUNG = {
  id: "folgen",
  einleitung: "Erkenne die Regel und setze sie fort.",
  stufen: {
    g: "Zahlenfolgen mit Dezimalzahlen, Anzahl der Teiler",
    h: "Zahlenrätsel, Figurenfolgen in einer Tabelle",
    i: "Summen von Folgen mit einer Regel berechnen",
    j: "Den Term zu einer linearen Figurenfolge finden",
    challenge: "Quadratische Folgen, ferne Glieder",
  },
};

const z = (a, b) => LST.zufall(a, b);
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
const MAL = " · ";

function fertig(stufe, typ, text, antwort, weg, daten, extra) {
  return Object.assign({ art: "zahl", stufe, typ, text, antwort: rund(antwort), loesung: dez(antwort), weg: String(weg).replace(/(^|[^\d'.,])(\d{4,})(?![\d.,])/g, (_, p, d) => p + LST.zahlText(Number(d))), kennung: text + (extra && extra.darstellung ? JSON.stringify(extra.darstellung.zeilen) : ""), daten }, extra || {});
}
const teilerAnzahl = n => { let t = 0; for (let d = 1; d <= n; d++) if (n % d === 0) t++; return t; };

// ---------- g ----------
function stufeG() {
  if (LST.zufall(0, 3) === 0) {
    const n = LST.zufall(0, 1) ? z(2, 15) ** 2 : z(6, 100);
    return fertig("g", "teiler", `Wie viele Teiler hat ${n}?`, teilerAnzahl(n), `Teiler von ${n}: ${Array.from({ length: n }, (_, i) => i + 1).filter(d => n % d === 0).join(", ")}`, { n });
  }
  const st = LST.waehle([1, 2]), start = z(1, 50) / 10 ** st, d = z(1, 30) / 10 ** st * (LST.zufall(0, 3) ? 1 : -1);
  const glieder = [0, 1, 2, 3].map(i => rund(start + i * d));
  if (glieder.some(x => x <= 0) || rund(start + 4 * d) <= 0) return stufeG();
  return fertig("g", "folge-dezimal", `${glieder.map(dez).join(", ")}, … Nächste Zahl =`, start + 4 * d, `Jedes Mal ${d > 0 ? "+" : "−"} ${dez(Math.abs(d))}: ${dez(glieder[3])} ${d > 0 ? "+" : "−"} ${dez(Math.abs(d))} = ${dez(start + 4 * d)}`, { start, d, k: 4 });
}

// ---------- h ----------
function stufeH() {
  if (LST.zufall(0, 1)) {
    const x = z(2, 30), m = z(2, 9), p = z(1, 40);
    const op = LST.waehle(["plus", "minus"]);
    const e = op === "plus" ? x * m + p : x * m - p;
    if (e <= 0) return stufeH();
    return fertig("h", "raetsel", `Ich denke mir eine Zahl, nehme sie mal ${m} und ${op === "plus" ? `addiere ${p}` : `subtrahiere ${p}`}. Ich erhalte ${dez(e)}. Meine Zahl =`, x,
      `${m}x ${op === "plus" ? "+" : "−"} ${p} = ${dez(e)} → ${m}x = ${dez(op === "plus" ? e - p : e + p)} → x = ${x}`, { m, p, e, op });
  }
  // Figurenfolge als Tabelle: Turm n hat a·n + b Würfel (linear) oder n² (Quadrat)
  const quadrat = LST.zufall(0, 2) === 0;
  const a = z(2, 6), b = z(-1, 4), N = z(7, 15);
  const f = n => (quadrat ? n * n : a * n + b);
  if ([1, 2, 3, 4].some(n => f(n) <= 0)) return stufeH();
  return fertig("h", quadrat ? "figuren-quadrat" : "figuren-linear", `Figurenfolge: Wie viele Würfel hat Figur ${N}?`, f(N),
    quadrat ? `Figur n hat n · n Würfel: ${N}${MAL}${N} = ${f(N)}` : `Je Figur ${a} Würfel mehr: ${a}${MAL}${N}${b ? ` ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : ""} = ${f(N)}`,
    { a, b, N, quadrat }, { darstellung: { art: "tabelle", kopf: ["Figur", "Würfel"], zeilen: [1, 2, 3, 4].map(n => [n, f(n)]) } });
}

// ---------- i ----------
function stufeI() {
  const typ = LST.waehle(["ungerade-summe", "rechteckzahl", "gerade-summe"]);
  const n = z(4, 60);
  if (typ === "ungerade-summe") return fertig("i", typ, `1 + 3 + 5 + … + ${2 * n - 1} =`, n * n, `Die ersten ${n} ungeraden Zahlen ergeben ${n}${MAL}${n} = ${n * n}`, { n });
  if (typ === "gerade-summe") return fertig("i", typ, `2 + 4 + 6 + … + ${2 * n} =`, n * (n + 1), `${n} gerade Zahlen: ${n}${MAL}(${n} + 1) = ${LST.zahlText(n * (n + 1))}`, { n });
  return fertig("i", typ, `Rechteckzahlen 2, 6, 12, 20, … (n · (n + 1)). Die ${n}. Rechteckzahl =`, n * (n + 1), `${n}${MAL}${n + 1} = ${n * (n + 1)}`, { n });
}

// ---------- j: Term zur Figurenfolge ----------
function stufeJ() {
  const a = z(2, 7), b = z(-2, 6);
  const f = n => a * n + b;
  if (f(1) <= 0) return stufeJ();
  const poly = LST_TERME.plus(LST_TERME.mal(LST_TERME.konst(KERN.bruch.bruch(BigInt(a))), LST_TERME.variable("n")), LST_TERME.konst(KERN.bruch.bruch(BigInt(b))));
  const term = LST_TERME.text(poly);
  return {
    art: "term", stufe: "j", typ: "term-linear", text: "Hölzchen je Figur (Tabelle). Term für die Anzahl Hölzchen bei Figur n:",
    antwortTerm: term, form: "vereinfacht", loesung: term, tasten: ["n", "+", "(", ")"],
    weg: `Je Figur ${a} Hölzchen mehr, Figur 1 hat ${f(1)}: ${term}`, kennung: `term ${a} ${b}`, daten: { a, b },
    darstellung: { art: "tabelle", kopf: ["Figur", "Hölzchen"], zeilen: [1, 2, 3, 4].map(n => [n, f(n)]) },
  };
}

// ---------- Challenge ----------
function challenge() {
  const typ = LST.waehle(["quadratisch-naechste", "linear-fern", "quadratisch-fern"]);
  if (typ === "linear-fern") {
    const a = z(3, 12), b = z(-10, 10), N = z(50, 200);
    return fertig("challenge", typ, `${[1, 2, 3, 4].map(n => dez(a * n + b)).join(", ")}, … Das ${N}. Glied =`, a * N + b, `Regel ${a}n ${b < 0 ? "−" : "+"} ${Math.abs(b)}: ${a}${MAL}${N} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${dez(a * N + b)}`, { a, b, N });
  }
  const c = z(0, 5), N = typ === "quadratisch-fern" ? z(12, 40) : 5;
  const f = n => n * n + c;
  return fertig("challenge", typ, `${[1, 2, 3, 4].map(n => dez(f(n))).join(", ")}, … ${typ === "quadratisch-fern" ? `Das ${N}. Glied` : "Nächstes Glied"} =`, f(N),
    `Die Abstände wachsen um 2 (Quadratzahlen${c ? ` plus ${c}` : ""}): ${N}${MAL}${N}${c ? ` + ${c}` : ""} = ${dez(f(N))}`, { c, N });
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "g") return stufeG();
  if (stufe === "h") return stufeH();
  if (stufe === "i") return stufeI();
  if (stufe === "j") return stufeJ();
  if (stufe === "challenge") return challenge();
  throw new Error(`folgen: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    teiler: "Suche Teiler in Paaren: eins und die Zahl selbst, zwei und …; bei Quadratzahlen ist ein Paar doppelt.",
    "folge-dezimal": "Berechne den Abstand zwischen zwei Nachbarn. Ist er immer gleich?",
    raetsel: "Rückwärts rechnen: Was wurde zuletzt gemacht? Das zuerst rückgängig machen.",
    "figuren-linear": "Um wie viele Würfel wächst die Figur von Schritt zu Schritt?",
    "figuren-quadrat": "Vergleiche die Anzahl mit der Nummer der Figur: Welche Rechnung passt?",
    "ungerade-summe": "Zähle, wie viele ungerade Zahlen es sind. Probiere mit 1 + 3 und 1 + 3 + 5.",
    "gerade-summe": "Zähle, wie viele gerade Zahlen es sind. Probiere mit kleinen Beispielen.",
    rechteckzahl: "Setze die Nummer in die Regel ein.",
    "term-linear": "Der Zuwachs je Figur steht vor dem n. Was muss man bei Figur 1 noch dazu- oder wegzählen?",
    "linear-fern": "Finde die Regel: Zuwachs mal Nummer plus oder minus eine feste Zahl.",
    "quadratisch-naechste": "Schau die Abstände an. Wachsen sie gleichmässig?",
    "quadratisch-fern": "Vergleiche mit den Quadratzahlen 1, 4, 9, 16.",
  };
  return h[a.typ] || "Suche die Regel.";
}

const B = KERN.bruch, Z = x => B.vonZahl(x);
/** Exakt nachrechnen aus Werten in der Form von a.daten (aus den Daten oder aus dem Text); null bei unbekanntem Typ. */
function sollAus(typ, d) {
  switch (typ) {
    case "teiler": { let t = 0; for (let k = 1; k * k <= d.n; k++) if (d.n % k === 0) t += k * k === d.n ? 1 : 2; return Z(t); }
    case "folge-dezimal": return B.plus(Z(d.start), B.mal(Z(d.d), Z(d.k)));
    case "raetsel": return B.durch(d.op === "plus" ? B.minus(Z(d.e), Z(d.p)) : B.plus(Z(d.e), Z(d.p)), Z(d.m));
    case "figuren-linear": case "figuren-quadrat": return Z(d.quadrat ? d.N * d.N : d.a * d.N + d.b);
    case "ungerade-summe": { let s = 0; for (let k = 1; k <= 2 * d.n - 1; k += 2) s += k; return Z(s); }
    case "gerade-summe": { let s = 0; for (let k = 2; k <= 2 * d.n; k += 2) s += k; return Z(s); }
    case "rechteckzahl": return Z(d.n * (d.n + 1));
    case "linear-fern": return Z(d.a * d.N + d.b);
    case "quadratisch-naechste": case "quadratisch-fern": return Z(d.N * d.N + d.c);
    default: return null;
  }
}

/**
 * Den angezeigten Text lesen (Plan B2 Schritt 3, TD1 a), unabhängig vom Erzeuger. Gezeigt werden Glieder (im Satz) oder
 * eine Tabelle, nicht die Regel: liesText liest die Zahlen und leitet die Regel selbst ab — gleicher Abstand (linear:
 * Zuwachs a, b = erstes Glied − a), Quadratzahl plus c, n · n. Folgen die gezeigten Zahlen keiner Regel des Typs, ist das
 * Ergebnis null (die Folge selbst wäre dann falsch). Liefert die Werte in der Form von a.daten.
 */
const muster = (text, mu) => LST.zahlenImText(text, mu);
const fast = (x, y) => Math.abs(x - y) < 1e-9;
/** Glieder 1, 2, 3, … mit gleichem Abstand → { a: Abstand, b: erstes Glied − Abstand } oder null. */
function linear(werte) {
  const a = rund(werte[1] - werte[0]);
  return werte.every((w, i) => fast(w, werte[0] + a * i)) ? { a, b: rund(werte[0] - a) } : null;
}
/** Glieder 1, 2, 3, … = n · n + c → c oder null. */
function quadratPlus(werte) {
  const c = werte[0] - 1;
  return werte.every((w, i) => fast(w, (i + 1) * (i + 1) + c)) ? c : null;
}
const tabellenWerte = a => (a.darstellung && a.darstellung.zeilen || []).map(([n, w], i) => (n === i + 1 ? w : NaN));
const LESER = {
  teiler: a => { const z = muster(a.text, "Wie viele Teiler hat #?"); return z && { n: z[0] }; },
  "folge-dezimal": a => {
    const z = muster(a.text, "#*, … Nächste Zahl =");
    const r = z && z[0].length >= 3 && linear(z[0]);
    return r ? { start: z[0][0], d: r.a, k: z[0].length } : null;
  },
  raetsel: a => {
    for (const [wort, op] of [["addiere", "plus"], ["subtrahiere", "minus"]]) {
      const z = muster(a.text, `Ich denke mir eine Zahl, nehme sie mal # und ${wort} #. Ich erhalte #. Meine Zahl =`);
      if (z) return { m: z[0], p: z[1], e: z[2], op };
    }
    return null;
  },
  "figuren-linear": a => {
    const z = muster(a.text, "Figurenfolge: Wie viele Würfel hat Figur #?"), w = tabellenWerte(a);
    if (!z || w.length < 3) return null;
    if (quadratPlus(w) === 0) return { quadrat: true, N: z[0] };
    const r = linear(w);
    return r && { a: r.a, b: r.b, N: z[0], quadrat: false };
  },
  "figuren-quadrat": a => LESER["figuren-linear"](a),
  "ungerade-summe": a => { const z = muster(a.text, "1 + 3 + 5 + … + # ="); return z && { n: (z[0] + 1) / 2 }; },
  "gerade-summe": a => { const z = muster(a.text, "2 + 4 + 6 + … + # ="); return z && { n: z[0] / 2 }; },
  rechteckzahl: a => { const z = muster(a.text, "Rechteckzahlen 2, 6, 12, 20, … (n · (n + 1)). Die #. Rechteckzahl ="); return z && { n: z[0] }; },
  "term-linear": a => { const w = tabellenWerte(a), r = w.length >= 3 && linear(w); return r || null; },
  "linear-fern": a => { const z = muster(a.text, "#*, … Das #. Glied ="), r = z && z[0].length >= 3 && linear(z[0]); return r ? { a: r.a, b: r.b, N: z[1] } : null; },
  "quadratisch-naechste": a => { const z = muster(a.text, "#*, … Nächstes Glied ="), c = z && z[0].length >= 3 ? quadratPlus(z[0]) : null; return c === null ? null : { c, N: z[0].length + 1 }; },
  "quadratisch-fern": a => { const z = muster(a.text, "#*, … Das #. Glied ="), c = z && z[0].length >= 3 ? quadratPlus(z[0]) : null; return c === null ? null : { c, N: z[1] }; },
};
function liesText(a) {
  const l = LESER[a.typ];
  return (l && l(a)) || null;
}
const gleichWert = (x, y) => (typeof x === "number" && typeof y === "number" ? fast(x, y) : x === y);
/** Text gegen Prüfdaten (TD1 a): jeder gelesene Wert wie in den Daten (die Daten führen bei n · n auch unbenutzte a, b). */
function textMaengel(a, nachrechnen) {
  const t = liesText(a);
  if (!t) return [`Text folgt keiner Regel des Typs ${a.typ}: ${a.text}`];
  const anders = Object.keys(t).filter(k => !gleichWert(t[k], a.daten[k]));
  const m = anders.length ? [`Angezeigt ${anders.map(k => `${k} = ${t[k]}`).join(", ")}, Prüfdaten ${anders.map(k => `${k} = ${a.daten[k]}`).join(", ")}: ${a.text}`] : [];
  if (nachrechnen && !B.gleich(sollAus(a.typ, t), Z(a.antwort))) m.push(`aus dem Text nachgerechnet ${B.text(sollAus(a.typ, t))}, Lösung ${a.antwort}: ${a.text}`);
  return m;
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  if (a.art === "term") {
    // Term muss alle Tabellenwerte treffen
    for (const [n, w] of a.darstellung.zeilen) {
      const p = LST_TERME.lies(a.antwortTerm.replace(/n/g, `(${n})`)).poly;
      if (!(p.size <= 1 && B.gleich(p.get("") || B.bruch(0n), Z(w)))) m.push(`Term ${a.antwortTerm} trifft Figur ${n} nicht`);
    }
    if (!LST_TERME.bewerte(a.antwortTerm, a).ok) m.push("Lösungsterm nicht vereinfacht");
    return m.concat(textMaengel(a, false));
  }
  const soll = sollAus(a.typ, d);
  if (!soll) return [`unbekannter Typ ${a.typ}`];
  m.push(...textMaengel(a, true));
  if (!B.gleich(soll, Z(a.antwort))) m.push(`Lösung ${a.antwort}, nachgerechnet ${B.text(soll)}: ${a.text}`);
  if (a.darstellung) for (const [n, w] of a.darstellung.zeilen) {
    const erwartet = d.quadrat ? n * n : d.a * n + d.b;
    if (w !== erwartet) m.push("Tabelle passt nicht zur Regel");
  }
  if (a.typ === "raetsel" && !(a.antwort > 0 && Number.isInteger(a.antwort))) m.push("Rätselzahl nicht natürlich");
  if (/\d{4}/.test(a.text.replace(/\.\d+/g, ""))) m.push(`Tausender ohne Apostroph: ${a.text}`);
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis, liesText };
