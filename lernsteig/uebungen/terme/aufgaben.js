/* Übung „Terme vereinfachen“ — MA.1.A.4, Stufen i, j, k (Entscheid UE1 a). Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.1.A.4:
   i  Produkt gleicher Faktoren als Potenz (15 · 15 · 15 = 15³); Distributivgesetz (a(b + c) = ab + ac)
   j  (nur Erweiterungen) Polynome addieren und subtrahieren (3(a² + 2b) − 2(a² + b) = a² + 4b); ausmultiplizieren und
      ausklammern; Terme vereinfachen mit Vorzeichenregeln
   k  (GA) Terme mit Variablen addieren und subtrahieren (a + 2a + b + 3b + ¼ + ⅜ = 3a + 4b + ⅝)
   Antwort ist ein Term (art: "term"), geprüft mit lernsteig/gemeinsam/terme.js auf Gleichwertigkeit und Form.
   Annahmen, mit Patrik abzustimmen: Brüche als „5/8“ eingeben; Potenzen als „a^2“ oder mit den Hilfstasten „²“;
   „und umgekehrt“ (Potenz als Produkt schreiben) und die Notation abc = a · b · c (Erweiterung i) folgen. */
"use strict";

const UEBUNG = {
  id: "terme",
  einleitung: "Schreibe den Term so einfach wie möglich.",
  stufen: {
    i: "Als Potenz schreiben, ausmultiplizieren mit dem Distributivgesetz",
    j: "Polynome addieren und subtrahieren, ausklammern, Vorzeichen vor Klammern",
    k: "Gleichartige Glieder zusammenfassen, auch mit Brüchen",
    challenge: "Ausmultiplizieren und zusammenfassen in mehreren Schritten",
  },
};

const M = "−";
const T = LST_TERME, B = KERN.bruch;
const nichtNull = (min, max) => { let x = 0; while (x === 0) x = LST.zufall(min, max); return x; };
const VAR = ["a", "b", "x", "y"];
const zwei = () => { const v = LST.mische(VAR); return [v[0], v[1]].sort(); };
const k = n => T.konst(B.bruch(BigInt(n)));
const v = name => T.variable(name);
const glied = (c, name) => T.mal(k(c), name ? v(name) : k(1));
// Koeffizient vor Variable/Klammer: 1 → "", −1 → "−"
const koeff = c => (c === 1 ? "" : c === -1 ? M : LST.zahlText(c));
// Summe von Gliedern [c, "a"] als Text in der gegebenen Reihenfolge (nicht vereinfacht)
function summe(teile) {
  return teile.map(([c, name], i) => {
    const t = name ? `${koeff(Math.abs(c)) }${name}` : LST.zahlText(Math.abs(c));
    return i === 0 ? (c < 0 ? M : "") + t : ` ${c < 0 ? M : "+"} ${t}`;
  }).join("");
}

function fertig(stufe, typ, auftrag, ausdruck, poly, form, weg, tasten) {
  const antwortTerm = T.text(poly);
  return {
    art: "term", stufe, typ, text: `${auftrag}: ${ausdruck}`, ausdruck, antwortTerm, form, loesung: antwortTerm,
    weg: weg ? `${ausdruck} = ${weg}${weg === antwortTerm ? "" : " = " + antwortTerm}` : `${ausdruck} = ${antwortTerm}`,
    kennung: `${auftrag}: ${ausdruck}`, tasten: tasten || ["a", "b", "x", "y", "²", "(", ")"],
  };
}

// ---------- Stufe i ----------
function stufeI() {
  const typ = LST.waehle(["potenz", "potenz", "distributiv", "distributiv"]);
  if (typ === "potenz") {
    const n = LST.zufall(2, 6);
    const basis = LST.zufall(0, 2) ? String(LST.zufall(2, 20)) : LST.waehle(VAR);
    const ausdruck = Array(n).fill(basis).join(" · ");
    const poly = T.hoch(/[a-z]/.test(basis) ? v(basis) : k(Number(basis)), n);
    const a = fertig("i", typ, "Schreibe als Potenz", ausdruck, poly, "potenz", null, ["^", "²", "³"]);
    a.antwortTerm = `${basis}^${n}`;
    a.loesung = `${basis}${"⁰¹²³⁴⁵⁶"[n]}`;
    a.weg = `${ausdruck} = ${a.loesung}`;
    return a;
  }
  const c = nichtNull(-9, 9), [p, q] = zwei(), d = nichtNull(-9, 9);
  const mitVariable = LST.zufall(0, 2) === 0;
  // c(p + d) oder p(q + d) (dann ist das Produkt pq)
  if (mitVariable) {
    const aussen = p, ausdruck = `${aussen}(${summe([[1, q], [d, ""]])})`;
    const poly = T.mal(v(aussen), T.plus(v(q), k(d)));
    return fertig("i", typ, "Multipliziere aus", ausdruck, poly, "vereinfacht");
  }
  if (c === 1) return stufeI();
  const ausdruck = `${koeff(c)}(${summe([[1, p], [d, ""]])})`;
  const poly = T.mal(k(c), T.plus(v(p), k(d)));
  return fertig("i", typ, "Multipliziere aus", ausdruck, poly, "vereinfacht");
}

// ---------- Stufe j ----------
function stufeJ() {
  const typ = LST.waehle(["polynome", "ausklammern", "vorzeichen"]);
  if (typ === "polynome") {
    const [p, q] = zwei();
    const c1 = nichtNull(2, 5), c2 = nichtNull(2, 5), a1 = nichtNull(-4, 4), b1 = nichtNull(-4, 4), a2 = nichtNull(-4, 4), b2 = nichtNull(-4, 4);
    const op = LST.waehle(["+", M]);
    const innen1 = summe([[a1, `${p}²`], [b1, q]]), innen2 = summe([[a2, `${p}²`], [b2, q]]);
    const ausdruck = `${c1}(${innen1}) ${op} ${c2}(${innen2})`;
    const t1 = T.mal(k(c1), T.plus(glied(a1, p + p), glied(b1, q))); // p+p → später ersetzt
    const pp = T.mal(v(p), v(p));
    const P1 = T.mal(k(c1), T.plus(T.mal(k(a1), pp), glied(b1, q)));
    const P2 = T.mal(k(c2), T.plus(T.mal(k(a2), pp), glied(b2, q)));
    void t1;
    const poly = op === "+" ? T.plus(P1, P2) : T.plus(P1, T.neg(P2));
    if (poly.size === 0) return stufeJ();
    return fertig("j", typ, "Vereinfache", ausdruck, poly, "vereinfacht", `${T.text(P1)} ${op} (${T.text(P2)})`);
  }
  if (typ === "ausklammern") {
    const g = LST.zufall(2, 9), [p] = zwei();
    let a = nichtNull(-9, 9), b = nichtNull(-9, 9);
    const ggt = (x, y) => (y ? ggt(y, x % y) : Math.abs(x));
    if (ggt(a, b) !== 1) return stufeJ();
    if (a < 0) { a = -a; b = -b; }
    const ausdruck = summe([[g * a, p], [g * b, ""]]);
    const poly = T.plus(glied(g * a, p), k(g * b));
    const r = fertig("j", typ, "Klammere aus", ausdruck, poly, "ausgeklammert", null, ["a", "b", "x", "y", "(", ")"]);
    r.loesung = `${g}(${summe([[a, p], [b, ""]])})`;
    r.antwortTerm = r.loesung;
    r.weg = `${ausdruck} = ${r.loesung}`;
    return r;
  }
  const [p] = zwei();
  const a = nichtNull(-9, 9), b = nichtNull(-9, 9), c = nichtNull(-9, 9), d = LST.zufall(-9, 9);
  const vor = LST.waehle([-1, nichtNull(-4, -2)]);
  const ausdruck = `${koeff(vor)}(${summe([[a, p], [b, ""]])}) ${c < 0 ? M : "+"} ${koeff(Math.abs(c))}${p}${d ? ` ${d < 0 ? M : "+"} ${Math.abs(d)}` : ""}`;
  const poly = T.plus(T.plus(T.mal(k(vor), T.plus(glied(a, p), k(b))), glied(c, p)), k(d));
  if (poly.size === 0) return stufeJ();
  return fertig("j", "vorzeichen", "Vereinfache", ausdruck, poly, "vereinfacht");
}

// ---------- Stufe k ----------
function stufeK() {
  const [p, q] = zwei();
  const mitBruch = LST.zufall(0, 1);
  const teile = [];
  for (let n = 0; n < LST.zufall(2, 3); n++) teile.push([nichtNull(-9, 9), p]);
  for (let n = 0; n < LST.zufall(1, 3); n++) teile.push([nichtNull(-9, 9), q]);
  let bruchTeile = [];
  if (mitBruch) {
    const nenner = LST.waehle([[2, 4], [4, 8], [2, 8], [3, 6], [2, 3]]);
    bruchTeile = nenner.map(n => [LST.zufall(1, n - 1), n]);
  } else teile.push([nichtNull(-20, 20), ""]);
  const gemischt = LST.mische(teile);
  let ausdruck = summe(gemischt);
  let poly = gemischt.reduce((s, [c, name]) => T.plus(s, glied(c, name)), k(0));
  for (const [z, n] of bruchTeile) { ausdruck += ` + ${z}/${n}`; poly = T.plus(poly, T.konst(B.bruch(BigInt(z), BigInt(n)))); }
  if (poly.size < 2) return stufeK();
  return fertig("k", mitBruch ? "zusammenfassen-bruch" : "zusammenfassen", "Fasse zusammen", ausdruck, poly, "vereinfacht");
}

// ---------- Challenge ----------
function challenge() {
  const [p] = zwei();
  const a = nichtNull(2, 5), b = nichtNull(-6, 6), c = nichtNull(2, 5) * LST.waehle([1, -1]), d = nichtNull(-6, 6);
  // a·p(p + b) − c(p² + d·p)
  const ausdruck = `${a}${p}(${summe([[1, p], [b, ""]])}) ${c < 0 ? "+" : M} ${Math.abs(c)}(${summe([[1, `${p}²`], [d, p]])})`;
  const pp = T.mal(v(p), v(p));
  const P1 = T.mal(T.mal(k(a), v(p)), T.plus(v(p), k(b)));
  const P2 = T.mal(k(c), T.plus(pp, glied(d, p)));
  const poly = T.plus(P1, T.neg(P2));
  if (poly.size === 0) return challenge();
  return fertig("challenge", "ausmultiplizieren-zusammenfassen", "Vereinfache", ausdruck, poly, "vereinfacht", `${T.text(P1)} ${M} (${T.text(P2)})`);
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "i") return stufeI();
  if (stufe === "j") return stufeJ();
  if (stufe === "k") return stufeK();
  if (stufe === "challenge") return challenge();
  throw new Error(`terme: keine Stufe ${stufe}`);
}

/** Hinweis zu einer falschen Eingabe (Text) — nennt die Lösung nie. */
function hinweis(a, eingabe) {
  const h = {
    potenz: "Zähle, wie oft der gleiche Faktor vorkommt. Diese Zahl ist der Exponent.",
    distributiv: "Multipliziere den Faktor vor der Klammer mit jedem Glied in der Klammer. Achte auf das Vorzeichen.",
    polynome: "Zuerst beide Klammern ausmultiplizieren, dann gleichartige Glieder (gleiche Variable, gleiche Potenz) zusammenfassen.",
    ausklammern: "Suche den grössten Faktor, der in beiden Gliedern steckt, und schreibe ihn vor die Klammer.",
    vorzeichen: "Ein Minus vor der Klammer ändert jedes Vorzeichen in der Klammer.",
    zusammenfassen: "Fasse nur Glieder mit der gleichen Variable zusammen, Zahlen ohne Variable für sich.",
    "zusammenfassen-bruch": "Gleichnamig machen: Brüche auf den gleichen Nenner bringen, dann addieren.",
    "ausmultiplizieren-zusammenfassen": "Beide Produkte ausmultiplizieren, dann nach Potenzen ordnen und zusammenfassen.",
  };
  return h[a.typ] || "Vereinfache Schritt für Schritt.";
}

/** Prüfung: Aufgabe unabhängig lesen und mit der Lösung vergleichen; Formen prüfen. */
function pruefeAufgabe(a, stufe, niveau) {
  const maengel = [];
  if (a.stufe !== stufe) maengel.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  let aus, ziel;
  try { aus = T.lies(a.ausdruck.replace(/·/g, "*")); ziel = T.lies(a.antwortTerm); } catch (e) { return [`nicht lesbar: ${e.message} in „${a.text}“`]; }
  if (!T.gleich(aus.poly, ziel.poly)) maengel.push(`Lösung ${a.antwortTerm} passt nicht zu ${a.ausdruck}`);
  if (!T.bewerte(a.antwortTerm, a).ok) maengel.push(`Lösung hat nicht die Form ${a.form}: ${a.antwortTerm}`);
  if (a.form !== "frei" && T.bewerte(a.ausdruck, a).ok) maengel.push(`Aufgabe ist schon in der Form ${a.form}: ${a.ausdruck}`);
  if (/\+ −|− −|\b1[a-z]/.test(a.ausdruck + " " + a.loesung)) maengel.push(`Schreibweise: ${a.ausdruck} / ${a.loesung}`);
  if (a.loesung !== a.antwortTerm && a.form !== "potenz") {
    try { if (!T.gleich(T.lies(a.loesung).poly, ziel.poly)) maengel.push(`angezeigte Lösung ${a.loesung} falsch`); } catch (e) { maengel.push(`angezeigte Lösung unlesbar: ${a.loesung}`); }
  }
  // Lösungsweg: jeder Teil muss gleichwertig sein
  for (const t of a.weg.split(" = ")) {
    try { if (!T.gleich(T.lies(t.replace(/·/g, "*")).poly, ziel.poly)) maengel.push(`Schritt „${t}“ nicht gleichwertig`); } catch (e) { maengel.push(`Schritt unlesbar: ${t}`); }
  }
  return maengel;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
