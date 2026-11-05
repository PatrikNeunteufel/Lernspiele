/* Übung „Gleichungen lösen“ — MA.1.A.4, Stufen h und j (Entscheid UE1 a). Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.1.A.4:
   h  Gleichungen mit Variablen durch Einsetzen oder Umkehroperation lösen (natürliche Zahlen, ein oder zwei Schritte)
   j  (nur Erweiterungen) lineare Gleichungen mit einer Variablen durch Äquivalenzumformung lösen (5x + 3 = 7),
      auch mit x auf beiden Seiten und mit Klammern (ausmultiplizieren)
   Annahmen, mit Patrik abzustimmen: in Stufe h das Malzeichen ausgeschrieben („7 · x“), ab j die algebraische
   Schreibweise („5x“, „3(x − 2)“; die Notation abc = a · b · c ist MA.1.A.4.i, Erweiterung); Lösungen in h natürliche
   Zahlen, ab j ganze Zahlen oder endliche Dezimalzahlen mit höchstens zwei Nachkommastellen; Textgleichungen folgen. */
"use strict";

const UEBUNG = {
  id: "gleichungen",
  einleitung: "Bestimme x.",
  stufen: {
    h: "Mit der Umkehroperation: x + 17 = 42, 7 · x = 56, 3 · x + 5 = 26",
    j: "Mit Äquivalenzumformungen: 5x + 3 = 7, x auf beiden Seiten, Klammern",
    challenge: "Klammern auf beiden Seiten, negative und gebrochene Lösungen",
  },
};

const M = "−";
const MAL = " · ";
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
const nichtNull = (min, max) => { let x = 0; while (x === 0) x = LST.zufall(min, max); return x; };

// Algebraische Schreibweise: Glied a·x (1 → x, −1 → −x), Konstante mit Rechenzeichen
const xGlied = a => (a === 1 ? "x" : a === -1 ? `${M}x` : `${dez(a)}x`);
function lin(a, b) { // a·x + b
  if (a === 0) return dez(b);
  const s = xGlied(a);
  if (b === 0) return s;
  return `${s} ${b > 0 ? "+" : M} ${dez(Math.abs(b))}`;
}
const klammer = (a, b) => `${a === 1 ? "" : a === -1 ? M : dez(a)}(x ${b > 0 ? "+" : M} ${dez(Math.abs(b))})`;

function fertig(stufe, typ, gleichung, x, schritte) {
  const loes = `x = ${dez(x)}`;
  if (schritte[schritte.length - 1] === loes) schritte = schritte.slice(0, -1);
  return { art: "zahl", stufe, typ, text: gleichung, vor: "x =", antwort: rund(x), loesung: loes, weg: schritte.concat(loes).join(" → "), kennung: gleichung };
}

// ---------- Stufe h: Umkehroperation ----------
function stufeH() {
  const typ = LST.waehle(["plus", "minus", "mal", "geteilt", "zwei"]);
  if (typ === "plus") {
    const x = LST.zufall(1, 99), a = LST.zufall(1, 99), b = x + a;
    const g = LST.zufall(0, 1) ? `x + ${a} = ${dez(b)}` : `${a} + x = ${dez(b)}`;
    return fertig("h", typ, g, x, [g, `x = ${dez(b)} ${M} ${a}`]);
  }
  if (typ === "minus") {
    if (LST.zufall(0, 1)) { const a = LST.zufall(1, 99), x = a + LST.zufall(1, 99), b = x - a; const g = `x ${M} ${a} = ${b}`; return fertig("h", typ, g, x, [g, `x = ${b} + ${a}`]); }
    const x = LST.zufall(1, 99), a = x + LST.zufall(1, 99), b = a - x; const g = `${a} ${M} x = ${b}`;
    return fertig("h", typ, g, x, [g, `x = ${a} ${M} ${b}`]);
  }
  if (typ === "mal") {
    const a = LST.zufall(2, 12), x = LST.zufall(2, 25), g = `${a}${MAL}x = ${a * x}`;
    return fertig("h", typ, g, x, [g, `x = ${a * x} : ${a}`]);
  }
  if (typ === "geteilt") {
    const a = LST.zufall(2, 12), b = LST.zufall(2, 20), x = a * b, g = `x : ${a} = ${b}`;
    return fertig("h", typ, g, x, [g, `x = ${b}${MAL}${a}`]);
  }
  const a = LST.zufall(2, 9), x = LST.zufall(1, 12), b = LST.zufall(1, 30);
  if (LST.zufall(0, 1) || a * x <= b) { const c = a * x + b, g = `${a}${MAL}x + ${b} = ${c}`; return fertig("h", typ, g, x, [g, `${a}${MAL}x = ${c - b}`]); }
  const c = a * x - b, g = `${a}${MAL}x ${M} ${b} = ${c}`;
  return fertig("h", typ, g, x, [g, `${a}${MAL}x = ${c + b}`]);
}

// Lösung als ganze Zahl oder endliche Dezimalzahl mit höchstens zwei Nachkommastellen?
const glatt = x => Math.abs(rund(x * 100) - Math.round(x * 100)) < 1e-9;

// ---------- Stufe j: Äquivalenzumformung ----------
function stufeJ() {
  const typ = LST.waehle(["einseitig", "beidseitig", "klammer"]);
  if (typ === "einseitig") {
    for (;;) {
      const a = nichtNull(-9, 9), b = nichtNull(-30, 30), c = LST.zufall(-40, 40);
      const x = (c - b) / a;
      if (a === 1 || !glatt(x) || x === 0) continue;
      const g = `${lin(a, b)} = ${dez(c)}`;
      return fertig("j", typ, g, x, [g, `${xGlied(a)} = ${dez(c - b)}`]);
    }
  }
  if (typ === "beidseitig") {
    for (;;) {
      const a = nichtNull(-9, 9), c = nichtNull(-9, 9), x = nichtNull(-10, 10), b = LST.zufall(-20, 20);
      if (a === c) continue;
      const d = a * x + b - c * x;
      const g = `${lin(a, b)} = ${lin(c, d)}`;
      return fertig("j", typ, g, x, [g, `${xGlied(a - c)} = ${dez(d - b)}`]);
    }
  }
  const a = nichtNull(-9, 9) === 1 ? 2 : nichtNull(2, 9) * (LST.zufall(0, 1) ? 1 : -1), b = nichtNull(-9, 9), x = nichtNull(-10, 10);
  const c = a * (x + b);
  const g = `${klammer(a, b)} = ${dez(c)}`;
  return fertig("j", typ, g, x, [g, `${lin(a, a * b)} = ${dez(c)}`, `${xGlied(a)} = ${dez(c - a * b)}`]);
}

// ---------- Challenge ----------
function challenge() {
  const typ = LST.waehle(["klammer-beidseitig", "zwei-klammern"]);
  for (;;) {
    const x = nichtNull(-20, 20) / LST.waehle([1, 2, 4, 5]);
    if (!glatt(x)) continue;
    if (typ === "klammer-beidseitig") {
      const a = nichtNull(-6, 6), b = nichtNull(-9, 9), d = nichtNull(-6, 6), e = nichtNull(-9, 9);
      if (a === d || Math.abs(a) === 1) continue;
      const c = rund(a * (x + b) - d * (x - e));
      if (!Number.isInteger(c) || c === 0) continue;
      const g = `${klammer(a, b)} ${c > 0 ? M : "+"} ${dez(Math.abs(c))} = ${klammer(d, -e)}`;
      const links = lin(a, a * b - c), rechts = lin(d, -d * e);
      return fertig("challenge", typ, g, x, [g, `${links} = ${rechts}`, `${xGlied(a - d)} = ${dez(-d * e - (a * b - c))}`]);
    }
    const a = nichtNull(2, 6), b = nichtNull(1, 9), c = nichtNull(-6, 6), d = nichtNull(1, 9);
    if (a + c === 0 || Math.abs(c) === 1) continue;
    const e = rund(a * (x - b) + c * (x + d));
    if (!Number.isInteger(e)) continue;
    const g = `${klammer(a, -b)} ${c > 0 ? "+" : M} ${klammer(Math.abs(c), d)} = ${dez(e)}`;
    return fertig("challenge", typ, g, x, [g, `${lin(a + c, -a * b + c * d)} = ${dez(e)}`, `${xGlied(a + c)} = ${dez(e + a * b - c * d)}`]);
  }
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "h") return stufeH();
  if (stufe === "j") return stufeJ();
  if (stufe === "challenge") return challenge();
  throw new Error(`gleichungen: keine Stufe ${stufe}`);
}

/** Hinweis zu einer falschen Eingabe — nennt die Lösung nie. */
function hinweis(a, eingabe) {
  if (eingabe !== null && eingabe !== 0 && Math.abs(eingabe) === Math.abs(a.antwort)) return "Prüfe das Vorzeichen. Setze deine Zahl zur Probe ein.";
  const h = {
    plus: "Was mit x passiert ist, machst du rückgängig: Plus wird zu Minus.",
    minus: "Was mit x passiert ist, machst du rückgängig. Bei „Zahl − x“ hilft Einsetzen und Probieren.",
    mal: "Mal wird rückgängig gemacht mit Geteilt.",
    geteilt: "Geteilt wird rückgängig gemacht mit Mal.",
    zwei: "Rückwärts in zwei Schritten: zuerst Plus oder Minus, dann das Mal.",
    einseitig: "Auf beiden Seiten dasselbe tun: zuerst die Zahl ohne x wegbringen, dann durch die Zahl vor x teilen.",
    beidseitig: "Bring alle x auf eine Seite und alle Zahlen auf die andere — auf beiden Seiten dasselbe tun.",
    klammer: "Zuerst ausmultiplizieren oder beide Seiten durch die Zahl vor der Klammer teilen.",
    "klammer-beidseitig": "Zuerst beide Klammern ausmultiplizieren, dann x auf eine Seite bringen.",
    "zwei-klammern": "Beide Klammern ausmultiplizieren, gleichartige Glieder zusammenfassen.",
  };
  return (h[a.typ] || "Setze deine Zahl zur Probe ein.") + (eingabe !== null && a.stufe !== "h" ? " Probe: Setze deine Zahl links und rechts ein." : "");
}

// ---------- Prüfung: beide Seiten als lineare Terme lesen und exakt lösen ----------
const B = KERN.bruch;
/** Liest einen Term mit x als { a, b } (a·x + b), exakt. Unterstützt + − · : ( ), „5x“, „3(x − 2)“, Vorzeichen. */
function leseLinear(text) {
  const s = text.replace(/\s+/g, "");
  let i = 0;
  const null0 = { a: B.bruch(0n), b: B.bruch(0n) };
  const plusL = (p, q) => ({ a: B.plus(p.a, q.a), b: B.plus(p.b, q.b) });
  const negL = p => ({ a: B.neg(p.a), b: B.neg(p.b) });
  function malL(p, q) {
    if (p.a.z !== 0n && q.a.z !== 0n) throw new Error("nicht linear");
    return { a: B.plus(B.mal(p.a, q.b), B.mal(q.a, p.b)), b: B.mal(p.b, q.b) };
  }
  function durchL(p, q) { if (q.a.z !== 0n) throw new Error("x im Nenner"); return { a: B.durch(p.a, q.b), b: B.durch(p.b, q.b) }; }
  function ausdruck() {
    let w = (s[i] === M) ? (i++, negL(glied())) : glied();
    while (s[i] === "+" || s[i] === M) { const op = s[i++]; const g = glied(); w = plusL(w, op === "+" ? g : negL(g)); }
    return w;
  }
  function glied() {
    let w = faktor();
    for (;;) {
      if (s[i] === "·" || s[i] === ":") { const op = s[i++]; const f = faktor(); w = op === ":" ? durchL(w, f) : malL(w, f); continue; }
      if (s[i] === "x" || s[i] === "(") { w = malL(w, faktor()); continue; } // implizites Mal: 5x, 3(x − 2)
      return w;
    }
  }
  function faktor() {
    if (s[i] === "x") { i++; return { a: B.bruch(1n), b: B.bruch(0n) }; }
    if (s[i] === "(") { i++; const w = ausdruck(); if (s[i] !== ")") throw new Error("„)“ fehlt"); i++; return w; }
    const m = s.slice(i).match(/^\d+(?:'\d{3})*(?:\.\d+)?/);
    if (!m) throw new Error(`unerwartet „${s.slice(i, i + 6)}“`);
    i += m[0].length;
    return { a: B.bruch(0n), b: B.zahl(m[0]) };
  }
  const w = ausdruck();
  if (i !== s.length) throw new Error(`Rest „${s.slice(i)}“`);
  return w || null0;
}

function pruefeAufgabe(a, stufe, niveau) {
  const maengel = [];
  if (a.stufe !== stufe) maengel.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const teile = a.kennung.split(" = ");
  if (teile.length !== 2) return [`keine Gleichung: ${a.kennung}`];
  let L, R;
  try { L = leseLinear(teile[0]); R = leseLinear(teile[1]); } catch (e) { return [`nicht lesbar: ${e.message} in „${a.kennung}“`]; }
  const koeff = B.minus(L.a, R.a);
  if (koeff.z === 0n) return [`keine eindeutige Lösung: ${a.kennung}`];
  const x = B.durch(B.minus(R.b, L.b), koeff);
  if (!B.gleich(x, B.vonZahl(a.antwort))) maengel.push(`Lösung ${a.antwort}, nachgerechnet ${B.text(x)}: ${a.kennung}`);
  if (!B.endlich(x) || !B.gleich(B.vonZahl(Math.round(a.antwort * 100) / 100), x)) maengel.push(`Lösung nicht mit höchstens zwei Nachkommastellen: ${a.kennung}`);
  if (a.stufe === "h") {
    if (x.n !== 1n || x.z < 1n) maengel.push(`Stufe h: Lösung keine natürliche Zahl: ${a.kennung}`);
    if (/\dx|\)\(|\d\(/.test(a.kennung.replace(/\s/g, ""))) maengel.push(`Stufe h ohne Malzeichen: ${a.kennung}`);
    if (/−\d/.test(a.kennung.replace(/\s/g, "").replace(/^−/, "")) && /[=(]−/.test(a.kennung.replace(/\s/g, ""))) maengel.push(`Stufe h mit negativer Zahl: ${a.kennung}`);
    if (/\(/.test(a.kennung)) maengel.push(`Stufe h mit Klammer: ${a.kennung}`);
  } else {
    if (/·\s*x/.test(a.kennung)) maengel.push(`ab Stufe j algebraische Schreibweise: ${a.kennung}`);
  }
  if (/(^|[^\d])1x/.test(a.kennung)) maengel.push(`„1x“ statt „x“: ${a.kennung}`);
  if (/\+ −|− −/.test(a.kennung)) maengel.push(`doppeltes Vorzeichen: ${a.kennung}`);
  if (a.weg.split(" → ").pop() !== a.loesung) maengel.push("Lösungsweg endet nicht bei der Lösung");
  // Jeder Zwischenschritt des Lösungswegs muss dieselbe Lösung haben (Äquivalenzumformung)
  for (const schritt of a.weg.split(" → ")) {
    const t = schritt.split(" = ");
    if (t.length !== 2) { maengel.push(`Schritt ohne „=“: ${schritt}`); continue; }
    try {
      const l = leseLinear(t[0]), r = leseLinear(t[1]);
      const lw = B.plus(B.mal(l.a, x), l.b), rw = B.plus(B.mal(r.a, x), r.b);
      if (!B.gleich(lw, rw)) maengel.push(`Schritt „${schritt}“ hat eine andere Lösung`);
    } catch (e) { maengel.push(`Schritt nicht lesbar: ${schritt}`); }
  }
  return maengel;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis, leseLinear };
