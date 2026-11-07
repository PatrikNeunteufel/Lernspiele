/* Übung „Rationale Zahlen rechnen“ — MA.1.A.3, Stufen g, h, i (Entscheid UE1 a; Grenzen nach PA: h und i ohne
   Erweiterung). Aufgaben als Daten, ohne DOM (Vertrag: docs/lernsteig/rahmen.md 4).
   Inhalte je Stufe sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.1.A.3:
   g  Dezimalzahlen bis 5 Wertziffern multiplizieren (308 · 52; 12 · 0.3; Faktoren zusammen, RZ2 a); Brüche mit den
      Nennern 2, 4, 5, 8, 10, 20, 50, 100, 1000 als Dezimalzahlen (RZ1 a; 3 und 6 des Lehrplans folgen mit periodischen
      Dezimalzahlen); wie oft ein Stammbruch in einer ganzen Zahl steckt (2 : ⅕)
   h  Prozentrechnungen mit dem Rechner (ohne die Erweiterung Primfaktoren)
   i  Grundoperationen mit rationalen Zahlen; Wurzeln und Potenzen mit dem Rechner (4³ · 4³; 4³ + 4³; ³√8000)
      (ohne die Erweiterung Bruchterme mit Variablen); dazu Klammerregeln aus MA.1.A.4.h
   Annahmen, mit Patrik abzustimmen: negative Zahlen in Termen immer in Klammern; Brüche als „3/8“ geschrieben;
   Brüche im Teil „Stammbruch“ (Rechteckmodell) folgen mit einer Bruch-Eingabe. */
"use strict";

const UEBUNG = {
  id: "rationale-zahlen",
  einleitung: "Rechne genau. Negative Zahlen stehen in Klammern.",
  stufen: {
    g: "Dezimalzahlen multiplizieren, Brüche als Dezimalzahl, Stammbrüche",
    h: "Prozentwert, Prozentsatz und Grundwert",
    i: "Mit negativen Zahlen rechnen, Potenzen und Wurzeln",
    challenge: "Mehrere Schritte: Klammern, Vorzeichen, Potenzen, Prozent nacheinander",
  },
};

const M = "−"; // Minus
const MAL = " · ";
const HOCH = { 2: "²", 3: "³", 4: "⁴" };
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
const inKlammer = x => (x < 0 ? `(${dez(x)})` : dez(x));
const zufallDez = (min, max, stellen) => { const f = 10 ** stellen; return LST.zufall(min * f, max * f) / f; };
const nichtNull = (min, max) => { let x = 0; while (x === 0) x = LST.zufall(min, max); return x; };

function fertig(stufe, typ, text, antwort, weg, daten) {
  return { art: "zahl", stufe, typ, text, antwort: rund(antwort), loesung: dez(antwort), weg, kennung: text.replace(/ =$/, ""), daten };
}

// ---------- Stufe g ----------
// Lehrplan MA.1.A.3.g (Wortlaut sg.lehrplan.ch, Stand August 2025): „können Dezimalzahlen bis 5 Wertziffern
// multiplizieren … (z.B. 308 · 52; 12 · 0,3)“ und „können Brüche mit den Nennern 2, 3, 4, 5, 6, 8, 10, 20, 50, 100, 1'000
// als Dezimalzahlen schreiben“. RZ2 a: die Faktoren zusammen höchstens 5 Wertziffern, wie beide Beispiele. RZ1 a: genau
// die Nenner des Lehrplans; 3 und 6 (periodisch) erst, wenn die Übung periodische Dezimalzahlen annehmen kann.
// Bis LERN_Session19: je Faktor bis 5 Wertziffern (23.56 · 4.4) und alle Teiler von 1000 dazu 16 (bis 0.4375).
const WERTZIFFERN_MAX = 5;
const NENNER_G = [2, 4, 5, 8, 10, 20, 50, 100, 1000];
/** Wertziffern einer Zahl: alle Ziffern ohne Komma und ohne führende Nullen (0.3 → 1, 308 → 3, 23.56 → 4). */
const wertziffern = z => String(z).replace(".", "").replace(/^0+/, "").length;

function stufeG() {
  const typ = LST.waehle(["mal-ganz", "mal-dezimal", "bruch-dezimal", "stammbruch"]);
  if (typ === "mal-ganz") {
    const a = LST.zufall(101, 999), b = LST.zufall(11, 99);
    return fertig("g", typ, `${dez(a)}${MAL}${dez(b)} =`, a * b, `${dez(a)}${MAL}${dez(b)} = ${dez(a * b)}`, { a, b });
  }
  if (typ === "mal-dezimal") {
    // neu ziehen, bis die Faktoren zusammen höchstens 5 Wertziffern haben (RZ2 a)
    let a, b;
    do { a = zufallDez(0.1, 99, LST.waehle([1, 2])); b = LST.waehle([LST.zufall(2, 19), zufallDez(0.1, 9.9, 1)]); }
    while (wertziffern(a) + wertziffern(b) > WERTZIFFERN_MAX);
    return fertig("g", typ, `${dez(a)}${MAL}${dez(b)} =`, a * b, `${dez(a)}${MAL}${dez(b)} = ${dez(a * b)}`, { a, b });
  }
  if (typ === "bruch-dezimal") {
    const n = LST.waehle(NENNER_G);
    const z = LST.zufall(1, n - 1);
    return fertig("g", typ, `${z}/${dez(n)} als Dezimalzahl =`, z / n, `${z}/${dez(n)} = ${z} : ${dez(n)} = ${dez(z / n)}`, { z, n });
  }
  const n = LST.zufall(2, 10), g = LST.zufall(1, 12);
  return fertig("g", typ, `${g} : 1/${n} =`, g * n, `1/${n} steckt ${n}-mal in 1, also ${n}${MAL}${g} = ${g * n}`, { g, n });
}

// ---------- Stufe h (mit Rechner) ----------
function stufeH() {
  const typ = LST.waehle(["prozentwert", "prozentsatz", "grundwert"]);
  if (typ === "prozentwert") {
    const p = LST.zufall(1, 99), G = LST.zufall(20, 2000);
    return fertig("h", typ, `${p} % von ${dez(G)} =`, p * G / 100, `${dez(G)} : 100${MAL}${p} = ${dez(p * G / 100)}`, { p, G });
  }
  // Prozentsatz und Grundwert mit ganzzahligem Prozentwert: G Vielfaches von 100/ggT(p, 100)
  const p = LST.zufall(1, 99);
  const ggt = (a, b) => (b ? ggt(b, a % b) : a);
  const schritt = 100 / ggt(p, 100);
  const G = schritt * LST.zufall(Math.ceil(20 / schritt), Math.floor(2000 / schritt));
  const W = p * G / 100;
  if (typ === "prozentsatz") return fertig("h", typ, `Wie viel % sind ${dez(W)} von ${dez(G)}?`, p, `${dez(W)} : ${dez(G)}${MAL}100 = ${p}`, { W, G });
  return fertig("h", typ, `${p} % sind ${dez(W)}. Wie gross ist das Ganze?`, G, `${dez(W)} : ${p}${MAL}100 = ${dez(G)}`, { p, W });
}

// ---------- Stufe i ----------
function stufeI() {
  const typ = LST.waehle(["plus-minus", "mal-geteilt", "dezimal-negativ", "potenz-wurzel"]);
  if (typ === "plus-minus") {
    const z = [nichtNull(-100, 100), nichtNull(-100, 100), nichtNull(-100, 100)];
    const op = [LST.waehle(["+", M]), LST.waehle(["+", M])];
    const text = `${inKlammer(z[0])} ${op[0]} ${inKlammer(z[1])} ${op[1]} ${inKlammer(z[2])}`;
    const zw = op[0] === "+" ? z[0] + z[1] : z[0] - z[1];
    const w = op[1] === "+" ? zw + z[2] : zw - z[2];
    return fertig("i", typ, text + " =", w, `${text} = ${inKlammer(zw)} ${op[1]} ${inKlammer(z[2])} = ${dez(w)}`, {});
  }
  if (typ === "mal-geteilt") {
    const a = nichtNull(-12, 12), b = nichtNull(-12, 12);
    if (LST.zufall(0, 1)) return fertig("i", typ, `${inKlammer(a)}${MAL}${inKlammer(b)} =`, a * b, `${inKlammer(a)}${MAL}${inKlammer(b)} = ${dez(a * b)}`, {});
    return fertig("i", typ, `${inKlammer(a * b)} : ${inKlammer(b)} =`, a, `${inKlammer(a * b)} : ${inKlammer(b)} = ${dez(a)}`, {});
  }
  if (typ === "dezimal-negativ") {
    const a = zufallDez(-20, 20, 2), b = zufallDez(-20, 20, LST.waehle([1, 2]));
    if (a === 0 || b === 0) return stufeI();
    const op = LST.waehle(["+", M]);
    const w = op === "+" ? a + b : a - b;
    return fertig("i", typ, `${inKlammer(a)} ${op} ${inKlammer(b)} =`, w, `${inKlammer(a)} ${op} ${inKlammer(b)} = ${dez(w)}`, {});
  }
  // Potenzen und Wurzeln (mit dem Rechner), Beispiele des Lehrplans: 4³ · 4³; 4³ + 4³; ³√8000
  const art = LST.waehle(["produkt", "summe", "quadratwurzel", "kubikwurzel"]);
  if (art === "produkt" || art === "summe") {
    const b = LST.zufall(2, 9), e = LST.zufall(2, 4), f = LST.zufall(2, 3);
    const t = `${b}${HOCH[e]}${art === "produkt" ? MAL : " + "}${b}${HOCH[f]}`;
    const w = art === "produkt" ? b ** (e + f) : b ** e + b ** f;
    return fertig("i", typ, t + " =", w, `${t} = ${dez(b ** e)}${art === "produkt" ? MAL : " + "}${dez(b ** f)} = ${dez(w)}`, {});
  }
  if (art === "quadratwurzel") {
    const r = LST.waehle([LST.zufall(11, 30), LST.zufall(2, 9) * 10]);
    return fertig("i", typ, `√${dez(r * r)} =`, r, `${dez(r)}${MAL}${dez(r)} = ${dez(r * r)}, also √${dez(r * r)} = ${dez(r)}`, {});
  }
  const r = LST.waehle([LST.zufall(2, 12), LST.zufall(2, 9) * 10]);
  return fertig("i", typ, `³√${dez(r ** 3)} =`, r, `${dez(r)}${MAL}${dez(r)}${MAL}${dez(r)} = ${dez(r ** 3)}, also ³√${dez(r ** 3)} = ${dez(r)}`, {});
}

// ---------- Challenge (alle Stufen, mehrere Schritte) ----------
function challenge() {
  const typ = LST.waehle(["klammer-dezimal", "prozent-zweimal", "potenz-term"]);
  if (typ === "klammer-dezimal") {
    const a = zufallDez(-9.5, 9.5, 1) || 1.5, b = LST.zufall(1, 9), c = zufallDez(0.5, 9.5, 1);
    const innen = b - c;
    if (innen === 0) return challenge();
    const t = `${inKlammer(a)}${MAL}(${dez(b)} ${M} ${dez(c)})`;
    return fertig("challenge", typ, t + " =", a * innen, `${t} = ${inKlammer(a)}${MAL}${inKlammer(innen)} = ${dez(a * innen)}`, {});
  }
  if (typ === "prozent-zweimal") {
    const preis = LST.zufall(2, 40) * 10, auf = LST.waehle([5, 10, 15, 20, 25]), ab = LST.waehle([5, 10, 20, 25]);
    const zw = preis * (100 + auf) / 100, w = zw * (100 - ab) / 100;
    const t = `Ein Preis von ${dez(preis)} Fr. steigt um ${auf} % und sinkt danach um ${ab} %. Neuer Preis in Fr.?`;
    return fertig("challenge", typ, t, w, `${dez(preis)}${MAL}1.${String(auf).padStart(2, "0")} = ${dez(zw)}; ${dez(zw)}${MAL}${dez((100 - ab) / 100)} = ${dez(w)}`, { preis, auf, ab });
  }
  const a = nichtNull(-6, 6), b = LST.zufall(2, 4), c = LST.zufall(2, 3), d = nichtNull(-9, 9);
  const t = `${inKlammer(a)}${HOCH[2]} ${M} ${b}${HOCH[c]}${MAL}${inKlammer(d)}`;
  const w = a * a - b ** c * d;
  return fertig("challenge", typ, t + " =", w, `${t} = ${dez(a * a)} ${M} ${dez(b ** c)}${MAL}${inKlammer(d)} = ${dez(a * a)} ${M} ${inKlammer(b ** c * d)} = ${dez(w)}`, {});
}

/** Aufgabe als Daten; stufe ist eine Lehrplan-Stufe der Übung oder „challenge“. */
function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "g") return stufeG();
  if (stufe === "h") return stufeH();
  if (stufe === "i") return stufeI();
  if (stufe === "challenge") return challenge();
  throw new Error(`rationale-zahlen: keine Stufe ${stufe}`);
}

/** Hinweis zu einer falschen Eingabe — nennt die Lösung nie. */
function hinweis(a, eingabe) {
  if (eingabe !== null && eingabe !== 0 && Math.abs(eingabe) === Math.abs(a.antwort)) return "Prüfe das Vorzeichen.";
  if (eingabe !== null && a.antwort !== 0 && [10, 100, 1000, 0.1, 0.01, 0.001].some(f => Math.abs(rund(eingabe * f) - a.antwort) < 1e-9)) return "Die Ziffern stimmen. Prüfe, wo das Komma hingehört.";
  const h = {
    "mal-ganz": "Zerlege einen Faktor, zum Beispiel in Zehner und Einer, und addiere die Teilprodukte.",
    "mal-dezimal": "Rechne zuerst ohne Komma. Das Ergebnis hat so viele Nachkommastellen wie beide Faktoren zusammen.",
    "bruch-dezimal": "Ein Bruch ist eine Division: Zähler geteilt durch Nenner. Oder erweitere auf 10, 100 oder 1000.",
    "stammbruch": "Wie oft passt der Stammbruch in 1? Dann mal die ganze Zahl.",
    "prozentwert": "Ein Prozent ist der hundertste Teil. Rechne zuerst ein Prozent.",
    "prozentsatz": "Teil durch Ganzes, dann mal 100.",
    "grundwert": "Rechne zuerst, wie viel 1 % ist.",
    "plus-minus": "Rechne von links nach rechts. Minus eine negative Zahl ist plus ihre Gegenzahl.",
    "mal-geteilt": "Gleiche Vorzeichen geben ein positives Ergebnis, verschiedene ein negatives.",
    "dezimal-negativ": "Schreib beide Zahlen mit gleich vielen Nachkommastellen untereinander. Achte auf das Vorzeichen.",
    "potenz-wurzel": "Potenz heisst: die Basis so oft mit sich selbst malnehmen, wie der Exponent sagt.",
    "klammer-dezimal": "Zuerst die Klammer, dann malnehmen. Achte auf das Vorzeichen.",
    "prozent-zweimal": "Die zweite Änderung rechnet vom neuen Preis aus, nicht vom alten.",
    "potenz-term": "Potenz vor Punkt vor Strich. (−a)² ist positiv.",
  };
  return h[a.typ] || "Rechne Schritt für Schritt.";
}

// ---------- Prüfung: exakt mit Brüchen (BigInt), unabhängig vom Generator ----------
// Gemeinsame Bruchrechnung: kern/bruch.js (im Lernsteig über lernsteig/kern/kern.js)
const { bruch, plus: plusB, minus: minusB, mal: malB, durch: durchB, hoch: hochB, wurzel: wurzelB, zahl: zahlB, gleich: gleichB, vonZahl } = KERN.bruch;

/** Wertet einen angezeigten Term exakt aus: + − · : ( ) √ ³√ ² ³ ⁴, Zahlen „1'234.5“, negative Zahlen „(−3)“. */
function werteAus(text) {
  const s = text.replace(/\s+/g, "");
  let i = 0;
  const hoch = { "²": 2, "³": 3, "⁴": 4 };
  function ausdruck() {
    let w = glied();
    while (s[i] === "+" || s[i] === M) { const op = s[i++]; const g = glied(); w = op === "+" ? plusB(w, g) : minusB(w, g); }
    return w;
  }
  function glied() {
    let w = potenz();
    while (s[i] === "·" || s[i] === ":") { const op = s[i++]; const p = potenz(); w = op === ":" ? durchB(w, p) : malB(w, p); }
    return w;
  }
  function potenz() {
    let w = einfach();
    while (hoch[s[i]]) w = hochB(w, hoch[s[i++]]);
    return w;
  }
  function einfach() {
    if (s[i] === "³" && s[i + 1] === "√") { i += 2; return wurzelB(einfach(), 3); }
    if (s[i] === "√") { i++; return wurzelB(einfach(), 2); }
    if (s[i] === "(") {
      i++;
      let w;
      if (s[i] === M) { i++; w = minusB(bruch(0n), ausdruck()); } else w = ausdruck();
      if (s[i] !== ")") throw new Error(`„)“ erwartet bei ${i}`);
      i++;
      return w;
    }
    const m = s.slice(i).match(/^\d+(?:'\d{3})*(?:\.\d+)?/);
    if (!m) throw new Error(`Zahl erwartet bei ${i}: „${s.slice(i, i + 8)}“`);
    i += m[0].length;
    return zahlB(m[0]);
  }
  const w = ausdruck();
  if (i !== s.length) throw new Error(`Rest „${s.slice(i)}“`);
  return w;
}

/** Prüft eine Aufgabe; liefert eine Liste von Mängeln. */
function pruefeAufgabe(a, stufe, niveau) {
  const maengel = [];
  if (!["g", "h", "i", "challenge"].includes(a.stufe)) return [`unbekannte Stufe ${a.stufe}`];
  if (a.stufe !== stufe) maengel.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  let soll;
  try {
    const d = a.daten;
    if (a.typ === "bruch-dezimal") soll = bruch(BigInt(d.z), BigInt(d.n));
    else if (a.typ === "stammbruch") soll = durchB(bruch(BigInt(d.g)), bruch(1n, BigInt(d.n)));
    else if (a.typ === "prozentwert") soll = malB(vonZahl(d.G), bruch(BigInt(d.p), 100n));
    else if (a.typ === "prozentsatz") soll = malB(durchB(vonZahl(d.W), vonZahl(d.G)), bruch(100n));
    else if (a.typ === "grundwert") soll = durchB(malB(vonZahl(d.W), bruch(100n)), bruch(BigInt(d.p)));
    else if (a.typ === "prozent-zweimal") soll = malB(malB(vonZahl(d.preis), bruch(BigInt(100 + d.auf), 100n)), bruch(BigInt(100 - d.ab), 100n));
    else soll = werteAus(a.kennung);
  } catch (e) { return [`nicht auswertbar: ${e.message} in „${a.kennung}“`]; }
  if (!gleichB(soll, vonZahl(a.antwort))) maengel.push(`Lösung ${a.antwort}, nachgerechnet ${soll.z}/${soll.n}: ${a.kennung}`);
  // Ergebnis muss als endliche Dezimalzahl mit höchstens 4 Nachkommastellen aufgehen
  let n = soll.n; for (const p of [2n, 5n]) while (n % p === 0n) n /= p;
  if (n !== 1n) maengel.push(`Ergebnis keine endliche Dezimalzahl: ${a.kennung}`);
  if ((a.loesung.split(".")[1] || "").length > 4) maengel.push(`mehr als 4 Nachkommastellen: ${a.loesung}`);
  // Schreibweise: negative Zahlen nur in Klammern, Tausender mit Apostroph ab vier Stellen
  if (/(^|[+−·:] )−\d/.test(a.kennung)) maengel.push(`negative Zahl ohne Klammer: ${a.kennung}`);
  if (/\d{4}/.test(a.kennung.replace(/\.\d+/g, ""))) maengel.push(`Tausender ohne Apostroph: ${a.kennung}`);
  // Grenzen der Stufen nach Lehrplan
  // RZ2 a: beide Faktoren zusammen höchstens 5 Wertziffern (wie 308 · 52 und 12 · 0,3)
  if (a.typ === "mal-ganz" || a.typ === "mal-dezimal") {
    if (wertziffern(a.daten.a) + wertziffern(a.daten.b) > WERTZIFFERN_MAX) maengel.push(`Faktoren zusammen mehr als ${WERTZIFFERN_MAX} Wertziffern: ${a.kennung}`);
  }
  // RZ1 a: nur die Nenner, die der Lehrplan nennt
  if (a.typ === "bruch-dezimal" && !NENNER_G.includes(a.daten.n)) maengel.push(`Nenner ${a.daten.n} nicht in der Liste des Lehrplans: ${a.kennung}`);
  if (a.stufe === "i" && a.typ === "plus-minus" && /\d\.\d/.test(a.kennung)) maengel.push("Stufe i plus/minus mit Dezimalzahl");
  if (a.weg && a.weg.split(" = ").pop() !== a.loesung) maengel.push(`Lösungsweg endet nicht bei der Lösung: ${a.weg}`);
  return maengel;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis, werteAus };
