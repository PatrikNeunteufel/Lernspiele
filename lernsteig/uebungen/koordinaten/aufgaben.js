/* Übung „Koordinaten“ — MA.2.C.4, Stufen h, i, j (Gymnasium und EAP prüfen g; h–j sind Lehrplan Z3). Ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.2.C.4:
   h  (GA, OP) Lagebeziehungen massstabgetreu im Koordinatensystem (Pausenplatz)
   i  Figuren im kartesischen Koordinatensystem, auch negativ; Abstände und Flächen berechnen
   j  geometrische Abbildungen im Koordinatensystem (Spiegelung an x = 2)
   Annahmen, mit Patrik abzustimmen: Punkte geschrieben als „A(2|3)“; nicht ganzzahlige Koordinaten (i) folgen;
   je Aufgabe wird eine Zahl verlangt (Abstand, Fläche oder eine Koordinate). */
"use strict";

const UEBUNG = {
  id: "koordinaten",
  einleitung: "Lies die Punkte im Koordinatensystem und rechne.",
  stufen: {
    h: "Abstände auf einem Plan mit Massstab",
    i: "Abstände und Flächen, auch mit negativen Koordinaten",
    j: "Spiegelungen an Geraden x = a, y = b und am Ursprung",
    challenge: "Fläche eines beliebigen Dreiecks, Mittelpunkt einer Strecke",
  },
};

const M = "−";
const z = (a, b) => LST.zufall(a, b);
const dez = x => LST.dezimalText(Math.round(x * 1e9) / 1e9);
// Wortverbinder (U+2060), damit ein Punkt nie umbricht („C(−1|−1)“ bleibt zusammen)
const WJ = "⁠";
const pt = (n, x, y) => `${n}(${WJ}${dez(x)}${WJ}|${WJ}${dez(y)}${WJ})`;
const kl = v => (v < 0 ? `(${dez(v)})` : dez(v));
const TRIPEL = [[3, 4, 5], [6, 8, 10]];

function fertig(stufe, typ, text, antwort, einheit, weg, daten, punkte, extra) {
  return Object.assign({ art: "zahl", stufe, typ, text, einheit, antwort, loesung: `${dez(antwort)}${einheit ? " " + einheit : ""}`, weg,
    kennung: text, daten, darstellung: Object.assign({ art: "graph", x: daten.xb || [-6, 6], y: daten.yb || [-6, 6], punkte }, extra || {}) });
}

// ---------- h ----------
function stufeH() {
  const k = LST.waehle([2, 5, 10]), waag = LST.zufall(0, 1);
  const ax = z(0, 8), ay = z(0, 8), l = z(2, 8);
  const bx = waag ? ax + l : ax, by = waag ? ay : ay + l;
  if (bx > 10 || by > 10) return stufeH();
  return fertig("h", "massstab", `Plan des Pausenplatzes: 1 Häuschen = ${k} m. Abstand von ${pt("A", ax, ay)} nach ${pt("B", bx, by)} in Metern =`, l * k, "m",
    `${l} Häuschen · ${k} m = ${l * k} m`, { ax, ay, bx, by, k, xb: [0, 10], yb: [0, 10] }, [{ x: ax, y: ay, name: "A" }, { x: bx, y: by, name: "B" }], { hoehe: 300 });
}

// ---------- i ----------
function stufeI() {
  const typ = LST.waehle(["abstand", "abstand-schraeg", "rechteck", "dreieck"]);
  if (typ === "abstand") {
    const waag = LST.zufall(0, 1), a = z(-6, 6), c = z(-6, 6), d = z(-6, 6);
    if (c === d) return stufeI();
    const [A, Bp] = waag ? [[c, a], [d, a]] : [[a, c], [a, d]];
    return fertig("i", typ, `Abstand von ${pt("A", ...A)} und ${pt("B", ...Bp)} (in Einheiten) =`, Math.abs(d - c), "",
      `${waag ? "gleiche y-Koordinate" : "gleiche x-Koordinate"}: ${dez(Math.max(c, d))} ${M} ${Math.min(c, d) < 0 ? `(${dez(Math.min(c, d))})` : dez(Math.min(c, d))} = ${Math.abs(d - c)}`,
      { A, B: Bp }, [{ x: A[0], y: A[1], name: "A" }, { x: Bp[0], y: Bp[1], name: "B" }]);
  }
  if (typ === "abstand-schraeg") {
    const [p, q, r] = LST.waehle(TRIPEL), sx = LST.waehle([1, -1]), sy = LST.waehle([1, -1]);
    const ax = z(-6, 6), ay = z(-6, 6), bx = ax + sx * p, by = ay + sy * q;
    if (Math.abs(bx) > 6 || Math.abs(by) > 6) return stufeI();
    return fertig("i", typ, `Abstand von ${pt("A", ax, ay)} und ${pt("B", bx, by)} (in Einheiten) =`, r, "",
      `Pythagoras: √(${p}² + ${q}²) = ${r}`, { A: [ax, ay], B: [bx, by] }, [{ x: ax, y: ay, name: "A" }, { x: bx, y: by, name: "B" }]);
  }
  if (typ === "rechteck") {
    const x1 = z(-6, 3), y1 = z(-6, 3), x2 = z(x1 + 1, 6), y2 = z(y1 + 1, 6);
    const P = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
    return fertig("i", typ, `Rechteck ${pt("A", ...P[0])}, ${pt("B", ...P[1])}, ${pt("C", ...P[2])}, ${pt("D", ...P[3])}. Fläche =`, (x2 - x1) * (y2 - y1), "",
      `${x2 - x1} · ${y2 - y1} = ${(x2 - x1) * (y2 - y1)}`, { P }, P.map((p, i) => ({ x: p[0], y: p[1], name: "ABCD"[i] })), { vieleck: true });
  }
  const x1 = z(-6, 4), y1 = z(-6, 4), x2 = z(x1 + 1, 6), y3 = z(y1 + 1, 6);
  const P = [[x1, y1], [x2, y1], [x1, y3]];
  const f = (x2 - x1) * (y3 - y1) / 2;
  return fertig("i", typ, `Dreieck ${pt("A", ...P[0])}, ${pt("B", ...P[1])}, ${pt("C", ...P[2])}. Fläche =`, f, "",
    `rechter Winkel bei A: ${x2 - x1} · ${y3 - y1} : 2 = ${dez(f)}`, { P }, P.map((p, i) => ({ x: p[0], y: p[1], name: "ABC"[i] })), { vieleck: true });
}

// ---------- j ----------
function stufeJ() {
  const typ = LST.waehle(["spiegel-x", "spiegel-y", "ursprung"]);
  const px = z(-5, 5), py = z(-5, 5), a = z(-3, 3);
  if (typ === "spiegel-x") {
    const bx = 2 * a - px;
    if (Math.abs(bx) > 6 || bx === px) return stufeJ();
    return fertig("j", typ, `Spiegle ${pt("P", px, py)} an der Geraden x = ${dez(a)}. x-Koordinate des Bildpunkts P' =`, bx, "",
      `Abstand zur Geraden ${dez(Math.abs(px - a))}, auf die andere Seite: ${dez(a)} ${px > a ? M : "+"} ${dez(Math.abs(px - a))} = ${dez(bx)}`, { px, py, a }, [{ x: px, y: py, name: "P" }]);
  }
  if (typ === "spiegel-y") {
    const by = 2 * a - py;
    if (Math.abs(by) > 6 || by === py) return stufeJ();
    return fertig("j", typ, `Spiegle ${pt("P", px, py)} an der Geraden y = ${dez(a)}. y-Koordinate des Bildpunkts P' =`, by, "",
      `Abstand zur Geraden ${dez(Math.abs(py - a))}, auf die andere Seite: ${dez(a)} ${py > a ? M : "+"} ${dez(Math.abs(py - a))} = ${dez(by)}`, { px, py, a }, [{ x: px, y: py, name: "P" }]);
  }
  if (px === 0) return stufeJ();
  const frageX = LST.zufall(0, 1);
  return fertig("j", typ, `Spiegle ${pt("P", px, py)} am Ursprung O(0|0). ${frageX ? "x" : "y"}-Koordinate des Bildpunkts P' =`, frageX ? -px : -py, "",
    `Punktspiegelung am Ursprung: beide Vorzeichen wechseln, P'(${dez(-px)}|${dez(-py)})`, { px, py, frageX }, [{ x: px, y: py, name: "P" }, { x: 0, y: 0, name: "O" }]);
}

// ---------- Challenge ----------
function challenge() {
  if (LST.zufall(0, 1)) {
    const P = [[z(-6, 6), z(-6, 6)], [z(-6, 6), z(-6, 6)], [z(-6, 6), z(-6, 6)]];
    const f = Math.abs(P[0][0] * (P[1][1] - P[2][1]) + P[1][0] * (P[2][1] - P[0][1]) + P[2][0] * (P[0][1] - P[1][1])) / 2;
    if (f < 2) return challenge();
    return fertig("challenge", "dreieck-allgemein", `Dreieck ${pt("A", ...P[0])}, ${pt("B", ...P[1])}, ${pt("C", ...P[2])}. Fläche =`, f, "",
      `Umschliessendes Rechteck minus drei rechtwinklige Dreiecke = ${dez(f)}`, { P }, P.map((p, i) => ({ x: p[0], y: p[1], name: "ABC"[i] })), { vieleck: true });
  }
  const ax = z(-6, 6), ay = z(-6, 6), bx = ax + 2 * z(-3, 3), by = ay + 2 * z(-3, 3);
  if (Math.abs(bx) > 6 || Math.abs(by) > 6 || (ax === bx && ay === by)) return challenge();
  const frageX = LST.zufall(0, 1);
  return fertig("challenge", "mittelpunkt", `Mittelpunkt M der Strecke von ${pt("A", ax, ay)} nach ${pt("B", bx, by)}. ${frageX ? "x" : "y"}-Koordinate von M =`, frageX ? (ax + bx) / 2 : (ay + by) / 2, "",
    `M((${dez(ax)} + ${kl(bx)}) : 2 | (${dez(ay)} + ${kl(by)}) : 2) = M(${dez((ax + bx) / 2)}|${dez((ay + by) / 2)})`, { ax, ay, bx, by, frageX }, [{ x: ax, y: ay, name: "A" }, { x: bx, y: by, name: "B" }]);
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "h") return stufeH();
  if (stufe === "i") return stufeI();
  if (stufe === "j") return stufeJ();
  if (stufe === "challenge") return challenge();
  throw new Error(`koordinaten: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    massstab: "Zähle die Häuschen zwischen den Punkten und rechne mit dem Massstab um.",
    abstand: "Gleiche x- oder y-Koordinate: Der Abstand ist die Differenz der anderen Koordinate. Achte auf negative Zahlen.",
    "abstand-schraeg": "Zeichne ein rechtwinkliges Dreieck: waagrecht und senkrecht zählen, dann Pythagoras.",
    rechteck: "Seitenlängen aus den Koordinaten: Differenz der x-Werte und der y-Werte.",
    dreieck: "Die beiden Katheten liegen auf Gitterlinien. Grundseite mal Höhe, dann die Hälfte.",
    "spiegel-x": "Der Bildpunkt liegt gleich weit von der Geraden entfernt, auf der anderen Seite. Die y-Koordinate bleibt.",
    "spiegel-y": "Der Bildpunkt liegt gleich weit von der Geraden entfernt, auf der anderen Seite. Die x-Koordinate bleibt.",
    ursprung: "Bei der Spiegelung am Ursprung wechseln beide Koordinaten das Vorzeichen.",
    "dreieck-allgemein": "Lege ein Rechteck um das Dreieck und ziehe die drei Randdreiecke ab.",
    mittelpunkt: "Der Mittelpunkt hat den Mittelwert der x-Werte und den Mittelwert der y-Werte.",
  };
  return h[a.typ] || "Lies die Koordinaten genau ab.";
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  // Koordinaten aus dem Text lesen und gegen die gezeichneten Punkte prüfen
  const gelesen = [...a.text.replace(/\u2060/g, "").matchAll(/([A-Z])\((−?\d+)\|(−?\d+)\)/g)].map(x => ({ n: x[1], x: Number(x[2].replace(M, "-")), y: Number(x[3].replace(M, "-")) }));
  for (const g of gelesen) {
    const p = a.darstellung.punkte.find(q => q.name === g.n);
    if (p && (p.x !== g.x || p.y !== g.y)) m.push(`Punkt ${g.n} im Text anders als im Bild`);
  }
  const [x0, x1] = a.darstellung.x, [y0, y1] = a.darstellung.y;
  for (const p of a.darstellung.punkte) if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) m.push(`Punkt ${p.name} ausserhalb des Gitters`);
  const G = n => gelesen.find(g => g.n === n);
  let soll;
  switch (a.typ) {
    case "massstab": soll = Math.hypot(G("B").x - G("A").x, G("B").y - G("A").y) * d.k; break;
    case "abstand": case "abstand-schraeg": soll = Math.hypot(G("B").x - G("A").x, G("B").y - G("A").y); break;
    case "rechteck": { const xs = gelesen.map(g => g.x), ys = gelesen.map(g => g.y); soll = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys)); break; }
    case "dreieck": case "dreieck-allgemein": { const [A, Bb, C] = ["A", "B", "C"].map(G); soll = Math.abs((Bb.x - A.x) * (C.y - A.y) - (C.x - A.x) * (Bb.y - A.y)) / 2; break; }
    case "spiegel-x": soll = 2 * d.a - G("P").x; break;
    case "spiegel-y": soll = 2 * d.a - G("P").y; break;
    case "ursprung": soll = d.frageX ? -G("P").x : -G("P").y; break;
    case "mittelpunkt": soll = d.frageX ? (G("A").x + G("B").x) / 2 : (G("A").y + G("B").y) / 2; break;
    default: return [`unbekannter Typ ${a.typ}`];
  }
  if (Math.abs(soll - a.antwort) > 1e-9) m.push(`Lösung ${a.antwort}, nachgerechnet ${soll}: ${a.text}`);
  if (!Number.isInteger(a.antwort * 2)) m.push("Lösung nicht ganz oder halb");
  if (a.typ === "rechteck" && soll <= 0) m.push("Rechteck ohne Fläche");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
