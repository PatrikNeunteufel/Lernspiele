/* Übung „Binome und Gleichungen“ — MA.1.A.4, Stufen l, m (Einheitsaufnahmeprüfung prüft l und m; PA). Ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.1.A.4:
   l  quadratische Gleichungen durch Faktorzerlegung (x² − 4 = 0); binomische Formeln; Potenzregel aˣ · aʸ = aˣ⁺ʸ
   m  Rechengesetze für Potenzen; Bruchgleichungen mit der Unbekannten im Nenner (3/x + 2 = 4/x + 3); lineare
      Gleichungssysteme mit zwei Unbekannten
   Nicht in dieser Übung: Bruchterme mit Binomen umformen, Gleichungen mit Parameter (m).
   Annahmen, mit Patrik abzustimmen: bei zwei Lösungen wird nach der grösseren oder kleineren gefragt; Binome als
   Term-Antwort („x² + 6x + 9“). */
"use strict";

const UEBUNG = {
  id: "binome-gleichungen",
  einleitung: "Binomische Formeln, Potenzen und Gleichungen.",
  stufen: {
    l: "Binomische Formeln, Potenzregel, quadratische Gleichungen durch Faktorzerlegung",
    m: "Gleichungssysteme mit zwei Unbekannten, Bruchgleichungen, Potenzgesetze",
    challenge: "Quadratische Gleichungen faktorisieren, Systeme mit Brüchen",
  },
};

const M = "−", MAL = " · ";
const z = (a, b) => LST.zufall(a, b);
const nn = (a, b) => { let x = 0; while (x === 0) x = z(a, b); return x; };
const dez = x => LST.dezimalText(Math.round(x * 1e9) / 1e9);
const HOCH = n => String(n).replace(/[-0-9]/g, c => ({ "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" }[c]));
const vz = (b, x = "") => `${b < 0 ? M : "+"} ${Math.abs(b) === 1 && x ? "" : dez(Math.abs(b))}${x}`;

function zahl(stufe, typ, text, antwort, weg, daten, extra) {
  return Object.assign({ art: "zahl", stufe, typ, text, antwort, loesung: dez(antwort), weg, kennung: text, daten }, extra || {});
}

// ---------- l ----------
function stufeL() {
  const typ = LST.waehle(["binom", "binom", "potenzregel", "quadratisch-differenz", "quadratisch-faktoren"]);
  if (typ === "binom") {
    const v = LST.waehle(["x", "a"]), b = nn(-9, 9), art = LST.zufall(0, 2);
    const T = LST_TERME, B = KERN.bruch;
    const lin = (k) => T.plus(T.variable(v), T.konst(B.bruch(BigInt(k))));
    const poly = art === 2 ? T.mal(lin(Math.abs(b)), lin(-Math.abs(b))) : T.mal(lin(b), lin(b));
    const ausdruck = art === 2 ? `(${v} + ${Math.abs(b)})(${v} ${M} ${Math.abs(b)})` : `(${v} ${vz(b)})²`;
    const term = T.text(poly);
    return { art: "term", stufe: "l", typ, text: `Multipliziere aus: ${ausdruck}`, ausdruck, antwortTerm: term, form: "vereinfacht", loesung: term,
      tasten: [v, "²", "(", ")"], weg: `${ausdruck} = ${term}`, kennung: `binom ${ausdruck}` };
  }
  if (typ === "potenzregel") {
    const a = z(2, 9), x = z(2, 9), y = z(2, 9);
    return zahl("l", typ, `${a}${HOCH(x)}${MAL}${a}${HOCH(y)} = ${a} hoch`, x + y, `Gleiche Basis: Exponenten addieren, ${x} + ${y} = ${x + y}`, { a, x, y });
  }
  if (typ === "quadratisch-differenz") {
    const r = z(2, 15), groesser = LST.zufall(0, 1);
    return zahl("l", typ, `x² ${M} ${dez(r * r)} = 0. ${groesser ? "Positive" : "Negative"} Lösung x =`, groesser ? r : -r, `x² ${M} ${dez(r * r)} = (x ${M} ${r})(x + ${r}) = 0 → x = ${r} oder x = ${M}${r}`, { r, groesser });
  }
  const p = nn(-9, 9), q = nn(-9, 9);
  if (p === q) return stufeL();
  const groesser = LST.zufall(0, 1);
  const l1 = -p, l2 = -q;
  return zahl("l", typ, `(x ${vz(p)})(x ${vz(q)}) = 0. ${groesser ? "Grössere" : "Kleinere"} Lösung x =`, groesser ? Math.max(l1, l2) : Math.min(l1, l2),
    `Ein Produkt ist 0, wenn ein Faktor 0 ist: x = ${dez(l1)} oder x = ${dez(l2)}`, { p, q, groesser });
}

// ---------- m ----------
function stufeM() {
  const typ = LST.waehle(["system", "system", "bruchgleichung", "potenzgesetz"]);
  if (typ === "system") {
    for (;;) {
      const x = z(-8, 8), y = z(-8, 8), a1 = nn(-4, 4), b1 = nn(-4, 4), a2 = nn(-4, 4), b2 = nn(-4, 4);
      if (a1 * b2 - a2 * b1 === 0) continue;
      const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y, frageX = LST.zufall(0, 1);
      const g = (a, b, c) => `${a === 1 ? "" : a === -1 ? M : dez(a)}x ${vz(b, "y")} = ${dez(c)}`;
      return zahl("m", typ, `${g(a1, b1, c1)} und ${g(a2, b2, c2)}. ${frageX ? "x" : "y"} =`, frageX ? x : y, `Lösung x = ${dez(x)}, y = ${dez(y)} (Additions- oder Einsetzungsverfahren)`, { a1, b1, c1, a2, b2, c2, frageX });
    }
  }
  if (typ === "bruchgleichung") {
    for (;;) {
      // a/x + b = c/x + d  →  (a − c)/x = d − b  →  x = (a − c)/(d − b)
      const a = nn(1, 20), c = nn(1, 20), b = z(-5, 5), d = z(-5, 5);
      if (d === b || a === c) continue;
      const x = (a - c) / (d - b);
      if (!Number.isInteger(x) || x === 0) continue;
      const t = `${a}/x ${vz(b)} = ${c}/x ${vz(d)}`.replace(/ \+ 0| − 0/g, "");
      return zahl("m", typ, `${t}. x =`, x, `(${a} ${M} ${c})/x = ${dez(d - b)} → x = ${dez(a - c)} : ${d - b < 0 ? `(${dez(d - b)})` : dez(d - b)} = ${dez(x)}`, { a, b, c, d });
    }
  }
  const a = z(2, 9), x = z(2, 6), y = z(2, 4), art = LST.zufall(0, 1);
  if (art) return zahl("m", typ, `(${a}${HOCH(x)})${HOCH(y)} = ${a} hoch`, x * y, `Potenz einer Potenz: Exponenten multiplizieren, ${x} · ${y} = ${x * y}`, { a, x, y, art });
  const g = x + y;
  return zahl("m", typ, `${a}${HOCH(g)} : ${a}${HOCH(y)} = ${a} hoch`, x, `Gleiche Basis teilen: Exponenten subtrahieren, ${g} ${M} ${y} = ${x}`, { a, x, y, art });
}

// ---------- Challenge ----------
function challenge() {
  if (LST.zufall(0, 1)) {
    const r1 = nn(-9, 9), r2 = nn(-9, 9);
    if (r1 === r2) return challenge();
    const p = -(r1 + r2), q = r1 * r2, groesser = LST.zufall(0, 1);
    const t = `x² ${p ? `${vz(p, "x")} ` : ""}${vz(q)} = 0`;
    return zahl("challenge", "quadratisch-faktorisieren", `${t}. ${groesser ? "Grössere" : "Kleinere"} Lösung x =`, groesser ? Math.max(r1, r2) : Math.min(r1, r2),
      `Zwei Zahlen mit Produkt ${dez(q)} und Summe ${dez(-p)}: (x ${vz(-r1)})(x ${vz(-r2)}) = 0 → x = ${dez(r1)} oder ${dez(r2)}`, { p, q, groesser });
  }
  for (;;) {
    const x = z(-10, 10) / 2, y = z(-10, 10) / 2, a1 = nn(-5, 5), b1 = nn(-5, 5), a2 = nn(-5, 5), b2 = nn(-5, 5);
    if (a1 * b2 - a2 * b1 === 0 || Number.isInteger(x) && Number.isInteger(y)) continue;
    const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
    if (!Number.isInteger(c1) || !Number.isInteger(c2)) continue;
    const g = (a, b, c) => `${a === 1 ? "" : a === -1 ? M : dez(a)}x ${vz(b, "y")} = ${dez(c)}`;
    return zahl("challenge", "system-bruch", `${g(a1, b1, c1)} und ${g(a2, b2, c2)}. x =`, x, `Lösung x = ${dez(x)}, y = ${dez(y)}`, { a1, b1, c1, a2, b2, c2, frageX: true });
  }
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "l") return stufeL();
  if (stufe === "m") return stufeM();
  if (stufe === "challenge") return challenge();
  throw new Error(`binome-gleichungen: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    binom: "Jedes Glied der ersten Klammer mal jedes Glied der zweiten. Beim Quadrat: das doppelte Produkt nicht vergessen.",
    potenzregel: "Gleiche Basis malnehmen: Die Exponenten werden addiert.",
    "quadratisch-differenz": "Schreibe als Produkt von zwei Klammern (dritte binomische Formel).",
    "quadratisch-faktoren": "Ein Produkt ist 0, wenn einer der Faktoren 0 ist.",
    system: "Multipliziere eine Gleichung so, dass beim Addieren eine Variable wegfällt. Oder löse eine nach x auf und setze ein.",
    bruchgleichung: "Bring alle Brüche auf eine Seite, die Zahlen auf die andere. Mit x multiplizieren hilft.",
    potenzgesetz: "Potenz einer Potenz: Exponenten multiplizieren. Teilen mit gleicher Basis: Exponenten subtrahieren.",
    "quadratisch-faktorisieren": "Suche zwei Zahlen, deren Produkt die Zahl ohne x und deren Summe der Gegenwert vor x ist.",
    "system-bruch": "Eine Variable eliminieren; das Ergebnis darf ein halbes sein.",
  };
  return h[a.typ] || "Schritt für Schritt.";
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const T = LST_TERME, B = KERN.bruch, Z = x => B.vonZahl(x);
  if (a.art === "term") {
    if (!T.gleich(T.lies(a.ausdruck).poly, T.lies(a.antwortTerm).poly)) m.push(`Binom falsch: ${a.ausdruck} ≠ ${a.antwortTerm}`);
    if (!T.bewerte(a.antwortTerm, a).ok) m.push("Lösungsterm nicht vereinfacht");
    return m;
  }
  const d = a.daten;
  // Gleichungen aus dem Text: einsetzen und prüfen
  const setzeEin = (gleichung, werte) => {
    let s = gleichung;
    for (const [v, w] of Object.entries(werte)) s = s.replace(new RegExp(v, "g"), `(${w})`);
    const [l, r] = s.split(" = ");
    return T.gleich(T.lies(l.replace(/−/g, "-")).poly, T.lies(r.replace(/−/g, "-")).poly);
  };
  const text = a.text.replace(/\. [^.]*$/, "");
  switch (a.typ) {
    case "potenzregel": if (d.x + d.y !== a.antwort) m.push("Potenzregel falsch"); break;
    case "potenzgesetz": if ((d.art ? d.x * d.y : d.x) !== a.antwort) m.push("Potenzgesetz falsch"); break;
    case "quadratisch-differenz": case "quadratisch-faktoren": case "quadratisch-faktorisieren": {
      const g = text.replace(/x²/g, "x^2");
      if (!setzeEin(g, { x: a.antwort })) m.push(`Lösung ${a.antwort} erfüllt ${text} nicht`);
      // die andere Lösung finden: alle ganzen Zahlen −20..20 probieren
      const loes = []; for (let x = -20; x <= 20; x++) if (setzeEin(g, { x })) loes.push(x);
      if (loes.length !== 2) m.push(`nicht genau zwei ganzzahlige Lösungen: ${loes.join(", ")}`);
      const soll = /Grössere|Positive/.test(a.text) ? Math.max(...loes) : Math.min(...loes);
      if (soll !== a.antwort) m.push(`gefragte Lösung wäre ${soll}`);
      break;
    }
    case "system": case "system-bruch": {
      const [g1, g2] = text.split(" und ");
      const det = d.a1 * d.b2 - d.a2 * d.b1;
      const x = B.durch(Z(d.c1 * d.b2 - d.c2 * d.b1), Z(det)), y = B.durch(Z(d.a1 * d.c2 - d.a2 * d.c1), Z(det));
      const xs = B.text(x), ys = B.text(y);
      if (!setzeEin(g1, { x: xs, y: ys }) || !setzeEin(g2, { x: xs, y: ys })) m.push("Lösung erfüllt das System nicht");
      if (!B.gleich(d.frageX ? x : y, Z(a.antwort))) m.push(`Lösung ${a.antwort}, nachgerechnet ${d.frageX ? xs : ys}`);
      break;
    }
    case "bruchgleichung": {
      const [l, r] = text.split(" = ");
      const wert = s => { const t = s.replace(/−/g, "-").replace(/(\d+)\/x/g, (_, k) => `${k} : (${a.antwort})`); return T.lies(t).poly; };
      if (!T.gleich(wert(l), wert(r))) m.push(`x = ${a.antwort} erfüllt ${text} nicht`);
      if (a.antwort === 0) m.push("x = 0 nicht erlaubt");
      break;
    }
    default: m.push(`unbekannter Typ ${a.typ}`);
  }
  if (/\+ −|− −|\b1x\b|\b1y\b/.test(a.text)) m.push(`Schreibweise: ${a.text}`);
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
