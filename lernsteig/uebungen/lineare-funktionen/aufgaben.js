/* Übung „Lineare Funktionen“ — MA.3.A.3, Stufen j, k (Einheitsaufnahmeprüfung prüft k; PA). Ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.3.A.3:
   j  Schnittpunkt zweier Geraden algebraisch und graphisch
   k  lineare Funktionen: Graph zeichnen, Steigung, y-Achsenabschnitt, Nullstelle
   Die Stufen g–i derselben Kompetenz übt „Prozent und Funktionswerte“. Annahmen, mit Patrik abzustimmen: Gleichungen
   in der Form „y = 2x + 1“; je Aufgabe eine Zahl (Koordinate, Steigung, Abschnitt oder Nullstelle); Zeichnen folgt. */
"use strict";

const UEBUNG = {
  id: "lineare-funktionen",
  einleitung: "Lies Steigung, Achsenabschnitt und Nullstelle ab oder berechne sie.",
  stufen: {
    j: "Schnittpunkt zweier Geraden",
    k: "Steigung, y-Achsenabschnitt und Nullstelle aus Graph, Punkten oder Gleichung",
    challenge: "Gerade durch zwei Punkte, Schnittpunkte mit Brüchen",
  },
};

const M = "−";
const z = (a, b) => LST.zufall(a, b);
const nn = (a, b) => { let x = 0; while (x === 0) x = z(a, b); return x; };
const dez = x => LST.dezimalText(Math.round(x * 1e9) / 1e9);
const WJ = "⁠";
const pt = (n, x, y) => `${n}(${WJ}${dez(x)}${WJ}|${WJ}${dez(y)}${WJ})`;
function gl(m, b) {
  const mx = m === 1 ? "x" : m === -1 ? `${M}x` : `${dez(m)}x`;
  return `y = ${m === 0 ? dez(b) : b === 0 ? mx : `${mx} ${b > 0 ? "+" : M} ${dez(Math.abs(b))}`}`;
}
const glatt = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;

function fertig(stufe, typ, text, antwort, weg, daten, extra) {
  return Object.assign({ art: "zahl", stufe, typ, text, antwort: Math.round(antwort * 1e9) / 1e9, loesung: dez(antwort), weg, kennung: text + (extra && extra.darstellung ? `[${extra.darstellung.m},${extra.darstellung.b}]` : ""), daten }, extra || {});
}

// ---------- j: Schnittpunkt ----------
function stufeJ() {
  for (;;) {
    const m1 = nn(-4, 4), m2 = nn(-4, 4), x = z(-5, 5), y0 = z(-6, 6);
    if (m1 === m2) continue;
    const b1 = y0 - m1 * x, b2 = y0 - m2 * x;
    if (Math.abs(b1) > 15 || Math.abs(b2) > 15) continue;
    const frageX = LST.zufall(0, 1);
    return fertig("j", "schnittpunkt", `Schnittpunkt von ${gl(m1, b1)} und ${gl(m2, b2)}. ${frageX ? "x" : "y"}-Koordinate =`, frageX ? x : y0,
      `${gl(m1, b1).slice(4)} = ${gl(m2, b2).slice(4)} → x = ${dez(x)}, y = ${dez(y0)}`, { m1, b1, m2, b2, frageX });
  }
}

// ---------- k ----------
function stufeK() {
  const typ = LST.waehle(["steigung-graph", "abschnitt-graph", "steigung-punkte", "nullstelle"]);
  if (typ === "steigung-graph" || typ === "abschnitt-graph") {
    const m = LST.waehle([-2, -1, -0.5, 0.5, 1, 2, 3]), b = z(-4, 4);
    const steigung = typ === "steigung-graph";
    return fertig("k", typ, steigung ? "Steigung der Geraden im Graphen =" : "y-Achsenabschnitt der Geraden im Graphen =", steigung ? m : b,
      steigung ? `Steigungsdreieck: ${m === 0.5 || m === -0.5 ? "2 nach rechts" : "1 nach rechts"}, ${m === 0.5 || m === -0.5 ? `${dez(m * 2)}` : dez(m)} nach oben: m = ${dez(m)}` : `Die Gerade schneidet die y-Achse bei ${dez(b)}`,
      { m, b }, { darstellung: { art: "graph", m, b, x: [-6, 6], y: [-6, 6] } });
  }
  if (typ === "steigung-punkte") {
    for (;;) {
      const x1 = z(-6, 5), x2 = z(x1 + 1, 6), y1 = z(-8, 8), y2 = z(-8, 8);
      const m = (y2 - y1) / (x2 - x1);
      if (!glatt(m)) continue;
      return fertig("k", typ, `Steigung der Geraden durch ${pt("A", x1, y1)} und ${pt("B", x2, y2)} =`, m,
        `(${dez(y2)} ${M} ${y1 < 0 ? `(${dez(y1)})` : dez(y1)}) : (${dez(x2)} ${M} ${x1 < 0 ? `(${dez(x1)})` : dez(x1)}) = ${dez(y2 - y1)} : ${dez(x2 - x1)} = ${dez(m)}`, { x1, y1, x2, y2 });
    }
  }
  for (;;) {
    const m = nn(-6, 6), b = z(-20, 20), x0 = -b / m;
    if (!glatt(x0) || b === 0) continue;
    return fertig("k", "nullstelle", `Nullstelle von ${gl(m, b)}. x =`, x0, `y = 0 setzen: 0 = ${gl(m, b).slice(4)} → x = ${dez(x0)}`, { m, b });
  }
}

// ---------- Challenge ----------
function challenge() {
  if (LST.zufall(0, 1)) {
    for (;;) {
      const x1 = z(-6, 5), x2 = z(x1 + 1, 6), y1 = z(-8, 8), y2 = z(-8, 8);
      const m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
      if (!glatt(m) || !glatt(b)) continue;
      return fertig("challenge", "gerade-punkte", `Gerade durch ${pt("A", x1, y1)} und ${pt("B", x2, y2)}: y-Achsenabschnitt b =`, b,
        `m = ${dez(m)}; b = ${dez(y1)} ${M} ${m < 0 ? `(${dez(m)})` : dez(m)} · ${x1 < 0 ? `(${dez(x1)})` : dez(x1)} = ${dez(b)}`, { x1, y1, x2, y2 });
    }
  }
  for (;;) {
    const m1 = nn(-5, 5), m2 = nn(-5, 5), b1 = z(-10, 10), b2 = z(-10, 10);
    if (m1 === m2) continue;
    const x = (b2 - b1) / (m1 - m2);
    if (!glatt(x) || Number.isInteger(x)) continue;
    return fertig("challenge", "schnitt-bruch", `Schnittpunkt von ${gl(m1, b1)} und ${gl(m2, b2)}. x-Koordinate =`, x, `${dez(m1 - m2)}x = ${dez(b2 - b1)} → x = ${dez(x)}`, { m1, b1, m2, b2, frageX: true });
  }
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "j") return stufeJ();
  if (stufe === "k") return stufeK();
  if (stufe === "challenge") return challenge();
  throw new Error(`lineare-funktionen: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    schnittpunkt: "Setze beide Terme gleich und löse nach x. Für y setzt du x in eine Gleichung ein.",
    "schnitt-bruch": "Beide Terme gleichsetzen, x auf eine Seite, Zahlen auf die andere.",
    "steigung-graph": "Geh eine Einheit nach rechts: Wie viel steigt oder fällt die Gerade?",
    "abschnitt-graph": "Wo schneidet die Gerade die senkrechte Achse?",
    "steigung-punkte": "Steigung = Unterschied der y-Werte geteilt durch Unterschied der x-Werte.",
    nullstelle: "Setze y = 0 und löse die Gleichung nach x.",
    "gerade-punkte": "Zuerst die Steigung aus den beiden Punkten, dann einen Punkt einsetzen und b ausrechnen.",
  };
  return h[a.typ] || "Denk an y = mx + b.";
}

function pruefeAufgabe(a, stufe, niveau) {
  const mg = [];
  if (a.stufe !== stufe) mg.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const B = LST_BRUCH, Z = x => B.vonZahl(x), d = a.daten;
  // Gleichungen aus dem Text lesen (unabhängig von den Daten)
  const gls = [...a.text.matchAll(/y = ([^.]+?)(?= und|\.| \(|$)/g)].map(x => { const p = LST_TERME.lies(x[1].replace(/−/g, "-")).poly; return { m: p.get("x1") || B.bruch(0n), b: p.get("") || B.bruch(0n) }; });
  const pts = [...a.text.replace(/⁠/g, "").matchAll(/([A-Z])\((−?\d+)\|(−?\d+)\)/g)].map(x => [Z(Number(x[2].replace(M, "-"))), Z(Number(x[3].replace(M, "-")))]);
  let soll;
  try {
    switch (a.typ) {
      case "schnittpunkt": case "schnitt-bruch": {
        const [g1, g2] = gls; const x = B.durch(B.minus(g2.b, g1.b), B.minus(g1.m, g2.m));
        soll = d.frageX ? x : B.plus(B.mal(g1.m, x), g1.b); break;
      }
      case "steigung-graph": soll = Z(a.darstellung.m); break;
      case "abschnitt-graph": soll = Z(a.darstellung.b); break;
      case "steigung-punkte": soll = B.durch(B.minus(pts[1][1], pts[0][1]), B.minus(pts[1][0], pts[0][0])); break;
      case "nullstelle": soll = B.durch(B.neg(gls[0].b), gls[0].m); break;
      case "gerade-punkte": { const m = B.durch(B.minus(pts[1][1], pts[0][1]), B.minus(pts[1][0], pts[0][0])); soll = B.minus(pts[0][1], B.mal(m, pts[0][0])); break; }
      default: return [`unbekannter Typ ${a.typ}`];
    }
  } catch (e) { return [`nicht prüfbar: ${e.message} in „${a.text}“`]; }
  if (!B.gleich(soll, Z(a.antwort))) mg.push(`Lösung ${a.antwort}, nachgerechnet ${B.text(soll)}: ${a.text}`);
  if (!B.endlich(soll) || (a.loesung.split(".")[1] || "").length > 2) mg.push(`Lösung mit mehr als zwei Nachkommastellen: ${a.text}`);
  if (a.darstellung) {
    const { m, b } = a.darstellung;
    // die Gerade muss im Bild ablesbar sein: Achsenabschnitt im Gitter, Steigungsdreieck ganzzahlig
    if (Math.abs(b) > 6) mg.push("Achsenabschnitt ausserhalb des Gitters");
    if (!Number.isInteger(m * 2)) mg.push("Steigung nicht ablesbar");
  }
  return mg;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
