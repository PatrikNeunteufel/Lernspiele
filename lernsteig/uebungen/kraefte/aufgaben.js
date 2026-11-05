/* Übung „Kräfte und einfache Maschinen“ — NT.5.1, Stufen a, c, d, e. Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/nt_zyklus3.md, NT.5.1:
   a  (OP) gleichförmige Bewegungen in Diagrammen erkennen und darstellen
   c  Gewichtskraft proportional zur Masse (VI: Umgang mit einem Kraftmesser)
   d  (GA) Kräfte einordnen; einfache Maschinen (Hebel, schiefe Ebene, Flaschenzug, Ketten-/Zahnradgetriebe)
   e  Goldene Regel der Mechanik: weniger Kraft, längere Strecke
   Die Lehrplanseite nennt keine Formeln. Annahmen, mit Patrik und dem Lehrmittel abzugleichen: Geschwindigkeit
   v = s : t in m/s; Gewichtskraft F = m · g mit g = 10 N/kg (gerundet, wie in vielen Lehrmitteln; 9.81 N/kg wäre
   genauer); Goldene Regel als Kraft · Weg bleibt gleich (Hebel: Kraft · Kraftarm = Last · Lastarm; Flaschenzug mit n
   tragenden Seilstücken: Kraft = Last : n, Seilweg = n · Hubhöhe; schiefe Ebene: Kraft · Länge = Last · Höhe), ohne
   Reibung und ohne Gewicht der Rollen. Stufen b (Wirkungen) und f (beschleunigt) folgen später. */
"use strict";

const UEBUNG = {
  id: "kraefte",
  einleitung: "Bewegung, Gewichtskraft und einfache Maschinen. Rechne mit g = 10 N/kg und ohne Reibung.",
  stufen: {
    a: "Gleichförmige Bewegung: Geschwindigkeit aus dem Weg-Zeit-Diagramm",
    c: "Gewichtskraft und Masse",
    d: "Einfache Maschinen erkennen",
    e: "Goldene Regel: Hebel, Flaschenzug, schiefe Ebene",
    challenge: "Mehrere Schritte: Masse, Flaschenzug, Seilweg",
  },
};

const MAL = " · ";
const G = 10; // N/kg (Annahme)
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
const z = (a, b) => LST.zufall(a, b);

function zahl(stufe, typ, text, antwort, einheit, weg, daten, extra) {
  return Object.assign({ art: "zahl", stufe, typ, text, antwort: rund(antwort), einheit, loesung: `${dez(antwort)} ${einheit}`, weg: `${weg} = ${dez(antwort)} ${einheit}`, kennung: text, daten }, extra || {});
}

// ---------- a ----------
function stufeA() {
  const v = LST.waehle([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]);
  const T = 10, ymax = v * T;
  const schritt = ymax <= 10 ? 1 : ymax <= 20 ? 2 : ymax <= 50 ? 5 : 10;
  const typ = LST.waehle(["v-diagramm", "v-diagramm", "weg-nach"]);
  const darstellung = { art: "graph", m: v, b: 0, x: [0, T], y: [0, ymax], schrittY: schritt, beschrY: schritt, xName: "t in s", yName: "s in m" };
  if (typ === "v-diagramm") {
    return zahl("a", typ, "Das Diagramm zeigt eine gleichförmige Bewegung. Wie gross ist die Geschwindigkeit in m/s?", v, "m/s", `v = s : t = ${dez(ymax)} m : ${T} s`, { v }, { darstellung, kennung: `v${v}` });
  }
  const t = z(11, 30);
  return zahl("a", typ, `Die Bewegung im Diagramm geht gleichförmig weiter. Welchen Weg hat der Körper nach ${t} s zurückgelegt?`, v * t, "m", `v = ${dez(ymax)} : ${T} = ${dez(v)} m/s, s = ${dez(v)}${MAL}${t}`, { v, t }, { darstellung, kennung: `s${v}-${t}` });
}

// ---------- c ----------
function stufeC() {
  const typ = LST.waehle(["kraft-kg", "kraft-g", "masse"]);
  if (typ === "kraft-kg") { const m = z(1, 200) / 2; return zahl("c", typ, `Welche Gewichtskraft wirkt auf einen Körper mit der Masse ${dez(m)} kg?`, m * G, "N", `F = m${MAL}g = ${dez(m)}${MAL}10`, { m }); }
  if (typ === "kraft-g") { const g = z(1, 99) * 10; return zahl("c", typ, `Ein Kraftmesser trägt einen Körper mit der Masse ${g} g. Welche Kraft zeigt er an?`, g / 1000 * G, "N", `${g} g = ${dez(g / 1000)} kg, F = ${dez(g / 1000)}${MAL}10`, { m: g / 1000 }); }
  const F = z(1, 300) * 5;
  return zahl("c", typ, `Ein Kraftmesser zeigt ${LST.zahlText(F)} N an. Welche Masse hat der Körper?`, F / G, "kg", `m = F : g = ${LST.zahlText(F)} : 10`, { F });
}

// ---------- d ----------
function stufeD() {
  const e = LST.waehle(MASCHINEN.beispiele);
  const optionen = MASCHINEN.namen.slice();
  return { art: "auswahl", stufe: "d", typ: "maschine", text: `${e.beispiel} Welche einfache Maschine ist das?`, optionen, richtig: optionen.indexOf(e.maschine), loesung: e.maschine,
    weg: `Das ist ein Beispiel für: ${e.maschine}`, kennung: e.beispiel, daten: { beispiel: e.beispiel } };
}

// ---------- e ----------
function stufeE() {
  const typ = LST.waehle(["hebel", "flaschenzug-kraft", "flaschenzug-weg", "schiefe-ebene"]);
  if (typ === "hebel") {
    const k = LST.waehle([2, 3, 4, 5]), last = z(1, 20) * k * 10, lastarm = z(1, 10) * 10, kraftarm = k * lastarm; // Kraft geht auf
    return zahl("e", typ, `Ein Hebel: Die Last von ${last} N greift ${lastarm} cm vom Drehpunkt an, du drückst ${kraftarm} cm vom Drehpunkt. Welche Kraft brauchst du?`,
      last * lastarm / kraftarm, "N", `${last}${MAL}${lastarm} : ${kraftarm}`, { last, lastarm, kraftarm });
  }
  const n = z(2, 6);
  if (typ === "flaschenzug-kraft") {
    const last = z(2, 60) * n * 5;
    return zahl("e", typ, `Ein Flaschenzug hat ${n} tragende Seilstücke. Die Last wiegt ${LST.zahlText(last)} N. Mit welcher Kraft musst du ziehen?`, last / n, "N", `${LST.zahlText(last)} : ${n}`, { last, n });
  }
  if (typ === "flaschenzug-weg") {
    const h = z(1, 20) / 2;
    return zahl("e", typ, `Ein Flaschenzug hat ${n} tragende Seilstücke. Die Last soll ${dez(h)} m gehoben werden. Wie viel Seil musst du ziehen?`, n * h, "m", `${n}${MAL}${dez(h)}`, { h, n });
  }
  const last = z(2, 50) * 20, hoehe = z(1, 5), laenge = hoehe * LST.waehle([2, 4, 5]);
  return zahl("e", typ, `Eine Last von ${LST.zahlText(last)} N wird über eine schiefe Ebene ${laenge} m lang auf ${hoehe} m Höhe geschoben. Welche Kraft braucht es ohne Reibung?`,
    last * hoehe / laenge, "N", `${LST.zahlText(last)}${MAL}${hoehe} : ${laenge}`, { last, hoehe, laenge });
}

// ---------- Challenge ----------
function challenge() {
  const typ = LST.waehle(["masse-flaschenzug", "hebel-arm", "arbeit-gleich"]);
  if (typ === "masse-flaschenzug") {
    const n = z(2, 6), m = z(1, 30) * n;
    return zahl("challenge", typ, `Mit einem Flaschenzug mit ${n} tragenden Seilstücken wird ein Sack mit ${m} kg Masse gehoben. Mit welcher Kraft musst du ziehen?`,
      m * G / n, "N", `F = ${m}${MAL}10 : ${n} = ${m * G} : ${n}`, { m, n });
  }
  if (typ === "hebel-arm") {
    const k = LST.waehle([2, 4, 5]), last = z(1, 15) * k * 10, lastarm = z(1, 6) * 10, kraft = last / k;
    return zahl("challenge", typ, `Ein Hebel trägt ${last} N im Abstand ${lastarm} cm vom Drehpunkt. Du willst nur ${dez(kraft)} N aufwenden. Wie weit vom Drehpunkt musst du drücken?`,
      last * lastarm / kraft, "cm", `${last}${MAL}${lastarm} : ${dez(kraft)}`, { last, lastarm, kraft });
  }
  const k = LST.waehle([2, 4, 5]), F1 = z(1, 20) * k * 10, s1 = z(1, 10);
  return zahl("challenge", typ, `Nach der Goldenen Regel: Eine Last braucht ohne Maschine ${F1} N auf ${s1} m. Mit einer Maschine ist die Kraft ${k}-mal kleiner. Wie lang wird der Weg?`,
    s1 * k, "m", `${F1}${MAL}${s1} = ${dez(F1 / k)}${MAL}s, s = ${s1}${MAL}${k}`, { F1, s1, k });
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "a") return stufeA();
  if (stufe === "c") return stufeC();
  if (stufe === "d") return stufeD();
  if (stufe === "e") return stufeE();
  if (stufe === "challenge") return challenge();
  throw new Error(`kraefte: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    "v-diagramm": "Lies an einem Punkt der Geraden Weg und Zeit ab. Geschwindigkeit ist Weg geteilt durch Zeit.",
    "weg-nach": "Zuerst die Geschwindigkeit aus dem Diagramm, dann mal die Zeit.",
    "kraft-kg": "Gewichtskraft ist Masse mal zehn Newton pro Kilogramm.",
    "kraft-g": "Gramm zuerst in Kilogramm umrechnen, dann mal zehn Newton pro Kilogramm.",
    masse: "Masse ist Gewichtskraft geteilt durch zehn Newton pro Kilogramm.",
    maschine: "Wird etwas um einen Drehpunkt bewegt, über eine Rampe, mit Seil und Rollen oder mit Zahnrädern?",
    hebel: "Hebelgesetz: Kraft mal Kraftarm ist gleich Last mal Lastarm.",
    "flaschenzug-kraft": "Die Last verteilt sich auf alle tragenden Seilstücke.",
    "flaschenzug-weg": "Jedes tragende Seilstück wird um die Hubhöhe kürzer. Diese Länge ziehst du.",
    "schiefe-ebene": "Kraft mal Länge der Ebene ist gleich Last mal Höhe.",
    "masse-flaschenzug": "Zuerst die Gewichtskraft der Masse, dann auf die tragenden Seilstücke verteilen.",
    "hebel-arm": "Hebelgesetz nach dem Kraftarm umstellen: Last mal Lastarm geteilt durch die Kraft.",
    "arbeit-gleich": "Kraft mal Weg bleibt gleich: Wird die Kraft kleiner, wird der Weg im gleichen Mass länger.",
  };
  return h[a.typ] || "Schreibe auf, was gegeben und was gesucht ist.";
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  if (a.art === "auswahl") {
    const e = MASCHINEN.beispiele.find(x => x.beispiel === d.beispiel);
    if (!e || a.optionen[a.richtig] !== e.maschine) m.push(`Zuordnung falsch: ${a.text}`);
    if (!MASCHINEN.namen.includes(e && e.maschine)) m.push(`unbekannte Maschine: ${e && e.maschine}`);
    return m;
  }
  const soll = {
    "v-diagramm": () => a.darstellung.y[1] / a.darstellung.x[1], "weg-nach": () => (a.darstellung.y[1] / a.darstellung.x[1]) * d.t,
    "kraft-kg": () => d.m * 10, "kraft-g": () => d.m * 10, masse: () => d.F / 10,
    hebel: () => d.last * d.lastarm / d.kraftarm, "flaschenzug-kraft": () => d.last / d.n, "flaschenzug-weg": () => d.n * d.h,
    "schiefe-ebene": () => d.last * d.hoehe / d.laenge, "masse-flaschenzug": () => d.m * 10 / d.n,
    "hebel-arm": () => d.last * d.lastarm / d.kraft, "arbeit-gleich": () => (d.F1 * d.s1) / (d.F1 / d.k),
  }[a.typ];
  if (!soll) return [`unbekannter Typ ${a.typ}`];
  const w = soll();
  if (Math.abs(w - a.antwort) > 1e-9) m.push(`Antwort ${a.antwort}, nachgerechnet ${w}: ${a.text}`);
  if (a.antwort <= 0) m.push(`nicht positiv: ${a.text}`);
  if (!Number.isInteger(rund(a.antwort * 100))) m.push(`mehr als zwei Nachkommastellen: ${a.text}`);
  if (a.darstellung && Math.abs(a.darstellung.m - a.darstellung.y[1] / a.darstellung.x[1]) > 1e-9) m.push("Gerade passt nicht zur Achse");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
