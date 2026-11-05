/* Übung „Prozent und Funktionswerte“ — MA.3.A.3, Stufen g, h, i (Entscheid UE1 a). Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.3.A.3:
   g  Funktionswerte aus Graphen; indirekte Proportionalität (72 Karten auf x Personen); Prozent als proportionale
      Zuordnung (7 von 35; 7 % von 35)
   h  (OP) zu einer Funktionsgleichung Wertepaare bestimmen; Massstab (12-km-Wanderung auf der Karte)
   i  (GA) Funktionswert aus Tabelle, Graph und Gleichung (y = 2x + 1, x = 7 → y = 15); Sachaufgaben mit Prozent
      (Steigung, Zins)
   Annahmen, mit Patrik abzustimmen: Massstab als „1 : 25'000“; Zins ein Jahr ohne Steuern; Steigung in Prozent als
   Höhe pro waagrechte Strecke. */
"use strict";

const UEBUNG = {
  id: "prozent-funktionen",
  einleitung: "Bestimme den gesuchten Wert.",
  stufen: {
    g: "Aus dem Graphen ablesen, umgekehrt proportional, Prozent als Zuordnung",
    h: "Wertepaare zu einer Gleichung, Massstab",
    i: "Funktionswert aus Tabelle, Graph und Gleichung; Zins und Steigung",
    challenge: "Zinseszins, Flächen im Massstab, x zu einem gegebenen y",
  },
};

const M = "−";
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
const nichtNull = (min, max) => { let x = 0; while (x === 0) x = LST.zufall(min, max); return x; };
const glatt = (x, st) => Math.abs(rund(x * 10 ** st) - Math.round(x * 10 ** st)) < 1e-9;

// y = m·x + b in Schreibweise „y = 2x + 1“
function gleichung(m, b) {
  const mx = m === 1 ? "x" : m === -1 ? `${M}x` : `${dez(m)}x`;
  return `y = ${b === 0 ? mx : `${mx} ${b > 0 ? "+" : M} ${dez(Math.abs(b))}`}`;
}

// Franken mit zwei Nachkommastellen, ganze Franken ohne („422.50 Fr.“, „36 Fr.“)
const betrag = (x, einheit) => (einheit === "Fr." && !Number.isInteger(rund(x)) ? LST.dezimalText(rund(x), 2) : dez(x));
function fertig(stufe, typ, text, antwort, einheit, weg, daten, extra) {
  return Object.assign({ art: "zahl", stufe, typ, text, einheit, antwort: rund(antwort), loesung: `${betrag(antwort, einheit)}${einheit ? " " + einheit : ""}`, weg, kennung: text + (extra ? JSON.stringify(extra) : ""), daten }, extra || {});
}

// Graph mit ablesbarem Punkt: ganzzahlige x, y im Gitter
function graphAufgabe(stufe, proportional) {
  for (;;) {
    const m = proportional ? LST.waehle([0.5, 1, 2, 3, 1.5]) : LST.waehle([-2, -1, -0.5, 0.5, 1, 2]);
    const b = proportional ? 0 : nichtNull(-4, 4);
    const x = proportional ? LST.zufall(1, 8) : nichtNull(-5, 5);
    const y = m * x + b;
    if (!Number.isInteger(y) || Math.abs(y) > 8) continue;
    const xb = proportional ? [0, 8] : [-6, 6], yb = proportional ? [0, 12] : [-8, 8];
    if (proportional && m * 8 > 12) { xb[1] = Math.floor(12 / m); if (x > xb[1]) continue; }
    return fertig(stufe, proportional ? "graph-proportional" : "graph", `Lies ab: y bei x = ${dez(x)}`, y, "", `Auf der Geraden über x = ${dez(x)}: y = ${dez(y)}`,
      { m, b, x }, { darstellung: { art: "graph", m, b, x: xb, y: yb } });
  }
}

// ---------- Stufe g ----------
function stufeG() {
  const typ = LST.waehle(["graph-proportional", "indirekt", "prozent-von", "prozentsatz"]);
  if (typ === "graph-proportional") return graphAufgabe("g", true);
  if (typ === "indirekt") {
    const n = LST.waehle([24, 36, 48, 60, 72, 84, 96, 120]);
    const teiler = []; for (let d = 2; d < n; d++) if (n % d === 0 && n / d > 1) teiler.push(d);
    const p1 = LST.waehle(teiler); let p2 = LST.waehle(teiler); if (p2 === p1) p2 = teiler[(teiler.indexOf(p1) + 1) % teiler.length];
    return fertig("g", typ, `Karten werden gleichmässig verteilt. Bei ${p1} Personen erhält jede ${n / p1} Karten. Wie viele bei ${p2} Personen?`, n / p2, "Karten",
      `${p1} · ${n / p1} = ${n} Karten, ${n} : ${p2} = ${dez(n / p2)}`, { n, p1, p2 });
  }
  if (typ === "prozent-von") {
    const p = LST.zufall(1, 99), g = LST.zufall(1, 40) * 5;
    return fertig("g", typ, `${p} % von ${dez(g)} =`, p * g / 100, "", `1 % von ${dez(g)} ist ${dez(g / 100)}, · ${p} = ${dez(p * g / 100)}`, { p, g });
  }
  const g = LST.waehle([20, 25, 40, 50, 80, 100, 200, 250, 400, 500]), w = LST.zufall(1, g - 1) ;
  const p = w / g * 100;
  if (!glatt(p, 1)) return stufeG();
  return fertig("g", typ, `${dez(w)} von ${dez(g)} sind wie viel %?`, p, "%", `${dez(w)} : ${dez(g)} = ${dez(w / g)} = ${dez(p)}`, { w, g });
}

// ---------- Stufe h ----------
function stufeH() {
  const typ = LST.waehle(["wertepaar", "massstab-karte", "massstab-wirklich"]);
  if (typ === "wertepaar") {
    const m = nichtNull(-6, 6), b = LST.zufall(-10, 10), x = LST.zufall(-6, 9);
    return fertig("h", typ, `${gleichung(m, b)}. Für x = ${dez(x)} ist y =`, m * x + b, "", `y = ${dez(m)} · ${x < 0 ? `(${dez(x)})` : dez(x)} ${b < 0 ? M : "+"} ${dez(Math.abs(b))} = ${dez(m * x + b)}`, { m, b, x });
  }
  const mass = LST.waehle([10000, 25000, 50000, 100000]);
  if (typ === "massstab-karte") {
    const km = LST.zufall(1, 40) / LST.waehle([1, 2]);
    const cm = km * 100000 / mass;
    if (!glatt(cm, 2) || cm > 50) return stufeH(); // Karte: höchstens 50 cm
    return fertig("h", typ, `Massstab 1 : ${dez(mass)}. ${dez(km)} km in der Wirklichkeit sind auf der Karte`, cm, "cm", `${dez(km)} km = ${dez(km * 100000)} cm, : ${dez(mass)} = ${dez(cm)}`, { mass, km });
  }
  const cm = LST.zufall(1, 30) / LST.waehle([1, 2, 4]);
  const km = cm * mass / 100000;
  if (!glatt(km, 2)) return stufeH();
  return fertig("h", typ, `Massstab 1 : ${dez(mass)}. ${dez(cm)} cm auf der Karte sind in der Wirklichkeit`, km, "km", `${dez(cm)} cm · ${dez(mass)} = ${dez(cm * mass)} cm = ${dez(km)}`, { mass, cm });
}

// ---------- Stufe i ----------
function stufeI() {
  const typ = LST.waehle(["tabelle", "gleichung", "graph", "zins", "steigung"]);
  if (typ === "graph") return graphAufgabe("i", false);
  if (typ === "tabelle") {
    const m = nichtNull(-5, 5), b = LST.zufall(-10, 10), x = LST.zufall(5, 12);
    const zeilen = [0, 1, 2, 3].map(t => [t, m * t + b]);
    return fertig("i", typ, `Die Tabelle gehört zu einer linearen Funktion. y bei x = ${x}?`, m * x + b, "",
      `y wächst je Schritt um ${dez(m)}, bei x = 0 ist y = ${dez(b)}: ${gleichung(m, b)}, also y = ${dez(m * x + b)}`, { m, b, x },
      { darstellung: { art: "tabelle", kopf: ["x", "y"], zeilen } });
  }
  if (typ === "gleichung") {
    const m = LST.waehle([nichtNull(-9, 9), nichtNull(-9, 9) / 2]), b = LST.zufall(-20, 20), x = nichtNull(-10, 10);
    const y = m * x + b;
    return fertig("i", typ, `${gleichung(m, b)}. Für x = ${dez(x)} ist y =`, y, "", `y = ${dez(m)} · ${x < 0 ? `(${dez(x)})` : dez(x)} ${b < 0 ? M : "+"} ${dez(Math.abs(b))} = ${dez(y)}`, { m, b, x });
  }
  if (typ === "zins") {
    const k = LST.zufall(1, 200) * 100, p = LST.waehle([0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3]);
    return fertig("i", typ, `${dez(k)} Fr. zu ${dez(p)} % Zins. Zins nach einem Jahr =`, k * p / 100, "Fr.", `${dez(k)} : 100 · ${dez(p)} = ${dez(k * p / 100)}`, { k, p });
  }
  const p = LST.zufall(2, 15), s = LST.zufall(1, 40) * 25;
  return fertig("i", typ, `Eine Strasse steigt ${p} %. Höhenunterschied auf ${dez(s)} m waagrechter Strecke =`, s * p / 100, "m", `${p} % von ${dez(s)} m = ${dez(s * p / 100)}`, { p, s });
}

// ---------- Challenge ----------
function challenge() {
  const typ = LST.waehle(["zinseszins", "massstab-flaeche", "umkehr"]);
  if (typ === "zinseszins") {
    const k = LST.zufall(1, 20) * 10000, p = LST.waehle([1, 2, 3, 4, 5, 10]);
    const e = k * (1 + p / 100) ** 2;
    return fertig("challenge", typ, `${dez(k)} Fr. zu ${p} % Zins, der Zins bleibt stehen. Betrag nach zwei Jahren =`, e, "Fr.",
      `${dez(k)} · ${dez(1 + p / 100)} = ${dez(k * (1 + p / 100))}; · ${dez(1 + p / 100)} = ${dez(e)}`, { k, p });
  }
  if (typ === "massstab-flaeche") {
    const mass = LST.waehle([100, 200, 500, 1000]), a = LST.zufall(2, 12), b = LST.zufall(2, 12);
    const m2 = (a * mass / 100) * (b * mass / 100);
    return fertig("challenge", typ, `Plan 1 : ${dez(mass)}. Ein Rechteck misst ${a} cm × ${b} cm. Fläche in Wirklichkeit =`, m2, "m²",
      `${a} cm ≙ ${dez(a * mass / 100)} m, ${b} cm ≙ ${dez(b * mass / 100)} m, ${dez(a * mass / 100)} · ${dez(b * mass / 100)} = ${dez(m2)}`, { mass, a, b });
  }
  const m = nichtNull(-6, 6), b = LST.zufall(-15, 15), x = nichtNull(-10, 10) / LST.waehle([1, 2]);
  const y = m * x + b;
  if (!Number.isInteger(y)) return challenge();
  return fertig("challenge", typ, `${gleichung(m, b)}. Für welches x ist y = ${dez(y)}?`, x, "", `${dez(y)} ${b < 0 ? "+" : M} ${dez(Math.abs(b))} = ${dez(y - b)}, : ${m < 0 ? `(${dez(m)})` : dez(m)} = ${dez(x)}`, { m, b, y }, { vor: "x =" });
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "g") return stufeG();
  if (stufe === "h") return stufeH();
  if (stufe === "i") return stufeI();
  if (stufe === "challenge") return challenge();
  throw new Error(`prozent-funktionen: keine Stufe ${stufe}`);
}

/** Hinweis zu einer falschen Eingabe — nennt die Lösung nie. */
function hinweis(a, eingabe) {
  if (eingabe !== null && eingabe !== 0 && Math.abs(eingabe) === Math.abs(a.antwort)) return "Prüfe das Vorzeichen.";
  const h = {
    "graph-proportional": "Geh auf der x-Achse zum Wert, dann senkrecht bis zur Geraden und waagrecht zur y-Achse.",
    graph: "Geh auf der x-Achse zum Wert, dann senkrecht bis zur Geraden und waagrecht zur y-Achse.",
    indirekt: "Mehr Personen, weniger Karten je Person: Rechne zuerst alle Karten zusammen.",
    "prozent-von": "Ein Prozent ist der hundertste Teil. Rechne zuerst ein Prozent.",
    prozentsatz: "Teil durch Ganzes, dann mal 100.",
    wertepaar: "Setze x ein: zuerst malnehmen, dann addieren oder subtrahieren.",
    "massstab-karte": "Wandle die Strecke in cm um und teile durch die Massstabszahl.",
    "massstab-wirklich": "Mal die Massstabszahl, dann von cm in km umwandeln: ein Kilometer hat hunderttausend Zentimeter.",
    tabelle: "Um wie viel wächst y von Spalte zu Spalte? Und welchen Wert hat y in der ersten Spalte?",
    gleichung: "Setze x ein: zuerst malnehmen, dann addieren oder subtrahieren. Achte auf Vorzeichen.",
    zins: "Zins = Kapital : 100 · Zinssatz.",
    steigung: "Steigung in Prozent: so viele Meter Höhe auf hundert Meter waagrecht.",
    zinseszins: "Im zweiten Jahr bekommst du Zins auch auf den Zins des ersten Jahres.",
    "massstab-flaeche": "Zuerst die Seiten in Wirklichkeit, dann die Fläche. Nicht die Fläche mit der Massstabszahl malnehmen.",
    umkehr: "Rückwärts: zuerst die Zahl ohne x wegbringen, dann durch die Zahl vor x teilen.",
  };
  return h[a.typ] || "Rechne Schritt für Schritt.";
}

// ---------- Prüfung: exakt aus den Daten, unabhängig vom Text des Lösungswegs ----------
const B = KERN.bruch;
const Z = x => B.vonZahl(x);
function pruefeAufgabe(a, stufe, niveau) {
  const maengel = [];
  if (a.stufe !== stufe) maengel.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  let soll;
  const lin = () => B.plus(B.mal(Z(d.m), Z(d.x)), Z(d.b));
  switch (a.typ) {
    case "graph-proportional": case "graph": case "wertepaar": case "tabelle": case "gleichung": soll = lin(); break;
    case "indirekt": soll = B.durch(Z(d.n), Z(d.p2)); if (d.n % d.p1 !== 0) maengel.push("Karten gehen nicht auf"); break;
    case "prozent-von": soll = B.durch(B.mal(Z(d.p), Z(d.g)), Z(100)); break;
    case "prozentsatz": soll = B.mal(B.durch(Z(d.w), Z(d.g)), Z(100)); break;
    case "massstab-karte": soll = B.durch(B.mal(Z(d.km), Z(100000)), Z(d.mass)); break;
    case "massstab-wirklich": soll = B.durch(B.mal(Z(d.cm), Z(d.mass)), Z(100000)); break;
    case "zins": soll = B.durch(B.mal(Z(d.k), Z(d.p)), Z(100)); break;
    case "steigung": soll = B.durch(B.mal(Z(d.s), Z(d.p)), Z(100)); break;
    case "zinseszins": { const f = B.plus(Z(1), B.durch(Z(d.p), Z(100))); soll = B.mal(Z(d.k), B.mal(f, f)); break; }
    case "massstab-flaeche": soll = B.mal(B.durch(B.mal(Z(d.a), Z(d.mass)), Z(100)), B.durch(B.mal(Z(d.b), Z(d.mass)), Z(100))); break;
    case "umkehr": soll = B.durch(B.minus(Z(d.y), Z(d.b)), Z(d.m)); break;
    default: return [`unbekannter Typ ${a.typ}`];
  }
  if (!B.gleich(soll, Z(a.antwort))) maengel.push(`Lösung ${a.antwort}, nachgerechnet ${B.text(soll)}: ${a.text}`);
  if (!B.endlich(soll) || (a.loesung.split(" ")[0].split(".")[1] || "").length > 2) maengel.push(`mehr als 2 Nachkommastellen: ${a.text} ${a.loesung}`);
  if (/\d{4}/.test(a.text.replace(/\.\d+/g, ""))) maengel.push(`Tausender ohne Apostroph: ${a.text}`);
  if (a.einheit === "Fr." && !B.gleich(B.vonZahl(Math.round(a.antwort * 20) / 20), soll)) maengel.push(`Franken nicht auf 5 Rp.: ${a.loesung}`);
  if (a.darstellung && a.darstellung.art === "graph") {
    const g = a.darstellung;
    if (d.x < g.x[0] || d.x > g.x[1] || a.antwort < g.y[0] || a.antwort > g.y[1]) maengel.push(`Punkt ausserhalb des Gitters: ${a.text}`);
    if (!Number.isInteger(d.x) || !Number.isInteger(a.antwort)) maengel.push(`Punkt nicht auf dem Gitter: ${a.text}`);
  }
  if (a.darstellung && a.darstellung.art === "tabelle") {
    for (const [x, y] of a.darstellung.zeilen) if (!B.gleich(Z(y), B.plus(B.mal(Z(d.m), Z(x)), Z(d.b)))) maengel.push("Tabelle passt nicht zur Funktion");
  }
  if (a.typ === "indirekt" && d.p1 === d.p2) maengel.push("gleiche Personenzahl");
  return maengel;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
