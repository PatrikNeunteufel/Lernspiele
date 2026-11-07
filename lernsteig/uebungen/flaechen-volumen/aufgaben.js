/* Übung „Längen, Flächen, Volumen berechnen“ — MA.2.A.3, Stufen f, g, h, i. Aufgaben als Daten, ohne DOM.
   Geprüft an der Aufnahmeprüfung Gymnasium (f, g, h) und an der Einheitsaufnahmeprüfung (f, g, h, i), PA.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.2.A.3:
   f  Volumen von Quadern
   g  Flächeninhalt von Drei- und Vierecken; Kanten, Flächen, Volumen von Quadern
   h  (OP) Satz des Pythagoras für Längen und Flächen
   i  (GA) Umfang und Fläche des Kreises; Kanten, Flächen, Volumen von geraden Prismen und Zylindern
   Nicht in dieser Übung: Flächen im Raster annähern (f), Volumen schätzen (i), Tabellenkalkulation (h).
   Annahmen, mit Patrik abzustimmen: Kreis und Zylinder mit der π-Taste, auf eine Nachkommastelle gerundet (Toleranz
   0.05 + Rundung); Pythagoras mit ganzzahligen Seiten (pythagoreische Tripel) oder auf eine Nachkommastelle. */
"use strict";

const UEBUNG = {
  id: "flaechen-volumen",
  einleitung: "Berechne. Einheiten stehen hinter dem Feld.",
  stufen: {
    f: "Volumen von Quadern",
    g: "Dreieck, Parallelogramm, Trapez; Oberfläche und Kanten von Quadern",
    h: "Satz des Pythagoras",
    i: "Kreis, Prisma und Zylinder (mit π, auf eine Nachkommastelle)",
    challenge: "Zusammengesetzte Figuren und Körper",
  },
};

const MAL = " · ";
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
const auf1 = x => Math.round(x * 10) / 10;
const z = (a, b) => LST.zufall(a, b);
const TOL = 0.05 + 1e-6; // eine Nachkommastelle: Abweichung bis 0.05

function fertig(stufe, typ, text, antwort, einheit, weg, daten, extra) {
  return Object.assign({ art: "zahl", stufe, typ, text, einheit, antwort: rund(antwort), loesung: `${dez(antwort)} ${einheit}`, weg, kennung: text, daten }, extra || {});
}

// ---------- f ----------
function stufeF() {
  const e = LST.waehle(["cm", "m", "dm"]);
  const a = z(2, 20), b = z(2, 15), c = z(2, 12);
  if (LST.zufall(0, 2)) return fertig("f", "quader-volumen", `Quader ${a} ${e} × ${b} ${e} × ${c} ${e}. Volumen =`, a * b * c, `${e}³`, `${a}${MAL}${b}${MAL}${c} = ${dez(a * b * c)}`, { a, b, c });
  return fertig("f", "quader-hoehe", `Quader mit Volumen ${dez(a * b * c)} ${e}³, Länge ${a} ${e}, Breite ${b} ${e}. Höhe =`, c, e, `${dez(a * b * c)} : (${a}${MAL}${b}) = ${c}`, { a, b, v: a * b * c });
}

// ---------- g ----------
function stufeG() {
  const typ = LST.waehle(["dreieck", "parallelogramm", "trapez", "quader-oberflaeche", "quader-kanten"]);
  const e = LST.waehle(["cm", "m"]);
  if (typ === "dreieck") { const g = z(2, 30), h = z(2, 20); return fertig("g", typ, `Dreieck: Grundseite ${g} ${e}, Höhe ${h} ${e}. Fläche =`, g * h / 2, `${e}²`, `${g}${MAL}${h} : 2 = ${dez(g * h / 2)}`, { g, h }); }
  if (typ === "parallelogramm") { const g = z(2, 30), h = z(2, 20); return fertig("g", typ, `Parallelogramm: Grundseite ${g} ${e}, Höhe ${h} ${e}. Fläche =`, g * h, `${e}²`, `${g}${MAL}${h} = ${dez(g * h)}`, { g, h }); }
  if (typ === "trapez") { const a = z(4, 30), c = z(2, a - 1), h = z(2, 20); return fertig("g", typ, `Trapez: parallele Seiten ${a} ${e} und ${c} ${e}, Höhe ${h} ${e}. Fläche =`, (a + c) * h / 2, `${e}²`, `(${a} + ${c}) : 2${MAL}${h} = ${dez((a + c) * h / 2)}`, { a, c, h }); }
  const a = z(2, 15), b = z(2, 12), c = z(2, 10);
  if (typ === "quader-oberflaeche") return fertig("g", typ, `Quader ${a} ${e} × ${b} ${e} × ${c} ${e}. Oberfläche =`, 2 * (a * b + a * c + b * c), `${e}²`, `2${MAL}(${a * b} + ${a * c} + ${b * c}) = ${dez(2 * (a * b + a * c + b * c))}`, { a, b, c });
  return fertig("g", typ, `Quader ${a} ${e} × ${b} ${e} × ${c} ${e}. Länge aller Kanten zusammen =`, 4 * (a + b + c), e, `4${MAL}(${a} + ${b} + ${c}) = ${dez(4 * (a + b + c))}`, { a, b, c });
}

// ---------- h: Pythagoras ----------
const TRIPEL = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
function stufeH() {
  const typ = LST.waehle(["hypotenuse", "kathete", "diagonale", "hypotenuse-gerundet"]);
  const e = LST.waehle(["cm", "m"]);
  if (typ === "hypotenuse-gerundet") {
    const a = z(2, 20), b = z(2, 20), c = Math.sqrt(a * a + b * b);
    if (Number.isInteger(c)) return stufeH();
    return fertig("h", typ, `Rechtwinkliges Dreieck: Katheten ${a} ${e} und ${b} ${e}. Hypotenuse (auf eine Nachkommastelle) =`, auf1(c), e, `√(${a * a} + ${b * b}) = √${a * a + b * b} ≈ ${dez(auf1(c))}`, { a, b }, { toleranz: TOL });
  }
  const [p, q, r] = LST.waehle(TRIPEL), k = z(1, 4);
  const a = p * k, b = q * k, c = r * k;
  if (typ === "hypotenuse") return fertig("h", typ, `Rechtwinkliges Dreieck: Katheten ${a} ${e} und ${b} ${e}. Hypotenuse =`, c, e, `√(${dez(a * a)} + ${dez(b * b)}) = √${dez(c * c)} = ${c}`, { a, b });
  if (typ === "kathete") return fertig("h", typ, `Rechtwinkliges Dreieck: Hypotenuse ${c} ${e}, eine Kathete ${a} ${e}. Andere Kathete =`, b, e, `√(${dez(c * c)} − ${dez(a * a)}) = √${dez(b * b)} = ${b}`, { c, a });
  return fertig("h", typ, `Rechteck ${a} ${e} × ${b} ${e}. Länge der Diagonale =`, c, e, `√(${dez(a * a)} + ${dez(b * b)}) = ${c}`, { a, b });
}

// ---------- i: Kreis, Prisma, Zylinder ----------
function stufeI() {
  const typ = LST.waehle(["kreis-umfang", "kreis-flaeche", "prisma-volumen", "zylinder-volumen"]);
  const e = LST.waehle(["cm", "m"]);
  if (typ === "kreis-umfang") {
    const mitD = LST.zufall(0, 1), r = z(1, 30);
    return fertig("i", typ, `Kreis mit ${mitD ? `Durchmesser ${2 * r}` : `Radius ${r}`} ${e}. Umfang (auf eine Nachkommastelle) =`, auf1(2 * Math.PI * r), e, `${mitD ? `${2 * r}${MAL}π` : `2${MAL}${r}${MAL}π`} ≈ ${dez(auf1(2 * Math.PI * r))}`, { r }, { toleranz: TOL });
  }
  if (typ === "kreis-flaeche") {
    const r = z(1, 30);
    return fertig("i", typ, `Kreis mit Radius ${r} ${e}. Fläche (auf eine Nachkommastelle) =`, auf1(Math.PI * r * r), `${e}²`, `${r}²${MAL}π = ${r * r}${MAL}π ≈ ${dez(auf1(Math.PI * r * r))}`, { r }, { toleranz: TOL });
  }
  if (typ === "prisma-volumen") {
    const g = z(2, 20), h = z(2, 16) * 1, l = z(2, 30);
    return fertig("i", typ, `Prisma mit dreieckiger Grundfläche (Grundseite ${g} ${e}, Höhe ${h} ${e}), Körperhöhe ${l} ${e}. Volumen =`, g * h / 2 * l, `${e}³`, `${g}${MAL}${h} : 2 = ${dez(g * h / 2)}; ${dez(g * h / 2)}${MAL}${l} = ${dez(g * h / 2 * l)}`, { g, h, l });
  }
  const r = z(1, 15), h = z(1, 30);
  return fertig("i", typ, `Zylinder mit Radius ${r} ${e} und Höhe ${h} ${e}. Volumen (auf eine Nachkommastelle) =`, auf1(Math.PI * r * r * h), `${e}³`, `${r}²${MAL}π${MAL}${h} ≈ ${dez(auf1(Math.PI * r * r * h))}`, { r, h }, { toleranz: TOL });
}

// ---------- Challenge ----------
function challenge() {
  const typ = LST.waehle(["rechteck-ohne-kreis", "gleichschenklig", "zylinder-oberflaeche"]);
  const e = "cm";
  if (typ === "rechteck-ohne-kreis") {
    const r = z(2, 10), a = 2 * r + z(2, 10), b = 2 * r + z(0, 10);
    const w = auf1(a * b - Math.PI * r * r);
    return fertig("challenge", typ, `Aus einem Rechteck ${a} cm × ${b} cm wird ein Kreis mit Radius ${r} cm ausgeschnitten. Restfläche (auf eine Nachkommastelle) =`, w, "cm²", `${a}${MAL}${b} − ${r}²${MAL}π ≈ ${dez(w)}`, { a, b, r }, { toleranz: TOL });
  }
  if (typ === "gleichschenklig") {
    const [p, q, rr] = LST.waehle(TRIPEL), k = z(1, 3);
    const halb = p * k, h = q * k, s = rr * k;
    return fertig("challenge", typ, `Gleichschenkliges Dreieck: Basis ${2 * halb} ${e}, Schenkel je ${s} ${e}. Fläche =`, halb * h, `${e}²`, `Höhe = √(${dez(s * s)} − ${dez(halb * halb)}) = ${h}; ${2 * halb}${MAL}${h} : 2 = ${dez(halb * h)}`, { halb, s });
  }
  const r = z(1, 12), h = z(1, 25);
  const o = auf1(2 * Math.PI * r * r + 2 * Math.PI * r * h);
  return fertig("challenge", typ, `Zylinder mit Radius ${r} cm und Höhe ${h} cm. Oberfläche (auf eine Nachkommastelle) =`, o, "cm²", `2${MAL}${r}²${MAL}π + 2${MAL}${r}${MAL}π${MAL}${h} ≈ ${dez(o)}`, { r, h }, { toleranz: TOL });
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "f") return stufeF();
  if (stufe === "g") return stufeG();
  if (stufe === "h") return stufeH();
  if (stufe === "i") return stufeI();
  if (stufe === "challenge") return challenge();
  throw new Error(`flaechen-volumen: keine Stufe ${stufe}`);
}

/** Hinweis zu einer falschen Eingabe — nennt die Lösung nie. */
function hinweis(a, eingabe) {
  const h = {
    "quader-volumen": "Volumen des Quaders: Länge mal Breite mal Höhe.",
    "quader-hoehe": "Teile das Volumen durch die Grundfläche (Länge mal Breite).",
    dreieck: "Dreieck: Grundseite mal Höhe, dann die Hälfte davon.",
    parallelogramm: "Parallelogramm: Grundseite mal Höhe (nicht die schräge Seite).",
    trapez: "Trapez: Mittelwert der parallelen Seiten mal Höhe.",
    "quader-oberflaeche": "Ein Quader hat sechs Flächen, je zwei gleich grosse.",
    "quader-kanten": "Ein Quader hat zwölf Kanten: je vier gleich lange.",
    hypotenuse: "Pythagoras: Die Quadrate der Katheten zusammen ergeben das Quadrat der Hypotenuse.",
    "hypotenuse-gerundet": "Pythagoras: Quadrate der Katheten addieren, dann die Wurzel ziehen und runden.",
    kathete: "Pythagoras rückwärts: Quadrat der Hypotenuse minus Quadrat der bekannten Kathete, dann die Wurzel.",
    diagonale: "Die Diagonale teilt das Rechteck in zwei rechtwinklige Dreiecke.",
    "kreis-umfang": "Umfang: Durchmesser mal π. Rechne mit der π-Taste, runde erst am Schluss.",
    "kreis-flaeche": "Fläche: Radius mal Radius mal π. Rechne mit der π-Taste.",
    "prisma-volumen": "Volumen eines Prismas: Grundfläche mal Körperhöhe.",
    "zylinder-volumen": "Volumen des Zylinders: Kreisfläche mal Höhe.",
    "rechteck-ohne-kreis": "Rechteckfläche minus Kreisfläche.",
    gleichschenklig: "Die Höhe halbiert die Basis. Berechne sie mit Pythagoras.",
    "zylinder-oberflaeche": "Zwei Kreise und ein Mantel (Umfang mal Höhe).",
  };
  return h[a.typ] || "Welche Formel passt zur Figur?";
}

/**
 * Den angezeigten Text lesen (Plan B2 Schritt 3, TD1 a): je Typ der Satz als Muster (LST.zahlenImText, „#“ Zahl,
 * „~“ Einheit), unabhängig vom Erzeuger geschrieben. Liefert die Werte in der Form von a.daten oder null, wenn der Text
 * keinem Muster des Typs folgt. Der Kreis mit Durchmesser liefert den Radius.
 */
const LESER = {
  "quader-volumen": [["Quader # ~ × # ~ × # ~. Volumen =", ([a, b, c]) => ({ a, b, c })]],
  "quader-hoehe": [["Quader mit Volumen # ~³, Länge # ~, Breite # ~. Höhe =", ([v, a, b]) => ({ a, b, v })]],
  dreieck: [["Dreieck: Grundseite # ~, Höhe # ~. Fläche =", ([g, h]) => ({ g, h })]],
  parallelogramm: [["Parallelogramm: Grundseite # ~, Höhe # ~. Fläche =", ([g, h]) => ({ g, h })]],
  trapez: [["Trapez: parallele Seiten # ~ und # ~, Höhe # ~. Fläche =", ([a, c, h]) => ({ a, c, h })]],
  "quader-oberflaeche": [["Quader # ~ × # ~ × # ~. Oberfläche =", ([a, b, c]) => ({ a, b, c })]],
  "quader-kanten": [["Quader # ~ × # ~ × # ~. Länge aller Kanten zusammen =", ([a, b, c]) => ({ a, b, c })]],
  hypotenuse: [["Rechtwinkliges Dreieck: Katheten # ~ und # ~. Hypotenuse =", ([a, b]) => ({ a, b })]],
  "hypotenuse-gerundet": [["Rechtwinkliges Dreieck: Katheten # ~ und # ~. Hypotenuse (auf eine Nachkommastelle) =", ([a, b]) => ({ a, b })]],
  kathete: [["Rechtwinkliges Dreieck: Hypotenuse # ~, eine Kathete # ~. Andere Kathete =", ([c, a]) => ({ c, a })]],
  diagonale: [["Rechteck # ~ × # ~. Länge der Diagonale =", ([a, b]) => ({ a, b })]],
  "kreis-umfang": [["Kreis mit Radius # ~. Umfang (auf eine Nachkommastelle) =", ([r]) => ({ r })],
    ["Kreis mit Durchmesser # ~. Umfang (auf eine Nachkommastelle) =", ([d]) => ({ r: d / 2 })]],
  "kreis-flaeche": [["Kreis mit Radius # ~. Fläche (auf eine Nachkommastelle) =", ([r]) => ({ r })]],
  "prisma-volumen": [["Prisma mit dreieckiger Grundfläche (Grundseite # ~, Höhe # ~), Körperhöhe # ~. Volumen =", ([g, h, l]) => ({ g, h, l })]],
  "zylinder-volumen": [["Zylinder mit Radius # ~ und Höhe # ~. Volumen (auf eine Nachkommastelle) =", ([r, h]) => ({ r, h })]],
  "rechteck-ohne-kreis": [["Aus einem Rechteck # cm × # cm wird ein Kreis mit Radius # cm ausgeschnitten. Restfläche (auf eine Nachkommastelle) =", ([a, b, r]) => ({ a, b, r })]],
  gleichschenklig: [["Gleichschenkliges Dreieck: Basis # ~, Schenkel je # ~. Fläche =", ([basis, s]) => ({ halb: basis / 2, s })]],
  "zylinder-oberflaeche": [["Zylinder mit Radius # cm und Höhe # cm. Oberfläche (auf eine Nachkommastelle) =", ([r, h]) => ({ r, h })]],
};
function liesText(a) {
  for (const [muster, werte] of LESER[a.typ] || []) {
    const z = LST.zahlenImText(a.text, muster);
    if (z) return werte(z);
  }
  return null;
}

/** Nachrechnen aus Werten in der Form von a.daten (aus den Daten oder aus dem Text); mit π über Math.PI, sonst exakt. */
const P = Math.PI;
const SOLL = {
  "quader-volumen": d => d.a * d.b * d.c, "quader-hoehe": d => d.v / (d.a * d.b),
  dreieck: d => d.g * d.h / 2, parallelogramm: d => d.g * d.h, trapez: d => (d.a + d.c) / 2 * d.h,
  "quader-oberflaeche": d => 2 * (d.a * d.b + d.b * d.c + d.a * d.c), "quader-kanten": d => 4 * (d.a + d.b + d.c),
  hypotenuse: d => Math.hypot(d.a, d.b), "hypotenuse-gerundet": d => Math.hypot(d.a, d.b), kathete: d => Math.sqrt(d.c * d.c - d.a * d.a),
  diagonale: d => Math.hypot(d.a, d.b), "kreis-umfang": d => 2 * P * d.r, "kreis-flaeche": d => P * d.r * d.r,
  "prisma-volumen": d => d.g * d.h / 2 * d.l, "zylinder-volumen": d => P * d.r * d.r * d.h,
  "rechteck-ohne-kreis": d => d.a * d.b - P * d.r * d.r, gleichschenklig: d => d.halb * Math.sqrt(d.s * d.s - d.halb * d.halb),
  "zylinder-oberflaeche": d => 2 * P * d.r * d.r + 2 * P * d.r * d.h,
};

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  const soll = SOLL[a.typ];
  if (!soll) return [`unbekannter Typ ${a.typ}`];
  const w = soll(d);
  const tol = a.toleranz || 0;
  const passt = x => Math.abs(x - a.antwort) <= (tol ? 0.05 + 1e-9 : 1e-9);
  if (!passt(w)) m.push(`Lösung ${a.antwort}, nachgerechnet ${w}: ${a.text}`);
  // Text gegen Prüfdaten (TD1 a): was das Kind liest, sind dieselben Werte, und aus ihnen folgt dieselbe Lösung
  const t = liesText(a);
  if (!t) m.push(`Text folgt keinem Muster des Typs ${a.typ}: ${a.text}`);
  else {
    const anders = Object.keys(d).filter(k => !(Math.abs(t[k] - d[k]) < 1e-9));
    if (anders.length) m.push(`Text zeigt ${anders.map(k => `${k} = ${t[k]}`).join(", ")}, Prüfdaten ${anders.map(k => `${k} = ${d[k]}`).join(", ")}: ${a.text}`);
    if (!passt(soll(t))) m.push(`aus dem Text nachgerechnet ${soll(t)}, Lösung ${a.antwort}: ${a.text}`);
  }
  if (!tol && !Number.isInteger(rund(a.antwort * 10))) m.push(`exakte Lösung mit mehr als einer Nachkommastelle: ${a.text}`);
  if (tol && !/Nachkommastelle/.test(a.text)) m.push(`gerundete Lösung ohne Angabe im Text: ${a.text}`);
  if (/\d{4}/.test(a.text.replace(/\.\d+/g, ""))) m.push(`Tausender ohne Apostroph: ${a.text}`);
  if (a.typ === "kathete" && !(d.c > d.a)) m.push("Hypotenuse nicht die längste Seite");
  if (a.antwort <= 0) m.push(`Ergebnis nicht positiv: ${a.text}`);
  if (a.stufe === "f" && !/^quader/.test(a.typ)) m.push("Stufe f nur Quader");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis, liesText };
