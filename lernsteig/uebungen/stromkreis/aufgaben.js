/* Übung „Stromkreis und Ohmsches Gesetz“ — NT.5.2, Stufen b, c, d. Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/nt_zyklus3.md, NT.5.2:
   b  Veränderungen in Stromkreisen untersuchen, einfache Regeln (mehr/weniger Lämpchen, Serie-/Parallelschaltung)
   c  (GA, OP) Grössen eines einfachen Stromkreises in Beziehung setzen. VI: Stromstärke, Spannung, Widerstand,
      Ohm'sches Gesetz
   d  Grössen eines verzweigten Stromkreises in Beziehung setzen. VI: Knoten- und Maschenregel
   Die Lehrplanseite nennt keine Formel und keine Einheiten. Annahmen, mit Patrik und dem Lehrmittel abzugleichen:
   Schreibweise U = R · I mit U in Volt (V), I in Ampere (A), R in Ohm (Ω), Milliampere (mA) nur in c und d;
   Lämpchen als gleiche, feste Widerstände an einer idealen Quelle (Helligkeit = Leistung des Lämpchens).
   Stufe a (Wirkungen des Stroms) und e (Motor, Generator) sind beschreibend und fehlen hier. */
"use strict";

const UEBUNG = {
  id: "stromkreis",
  einleitung: "Stromkreise: Regeln für Serie und Parallel, Ohmsches Gesetz U = R · I.",
  stufen: {
    b: "Serie- und Parallelschaltung: Was passiert mit den Lämpchen?",
    c: "Ohmsches Gesetz: Spannung, Stromstärke, Widerstand",
    d: "Verzweigte Stromkreise: Knoten- und Maschenregel",
    challenge: "Zwei Widerstände: Teilspannungen, Ströme, fehlender Widerstand",
  },
};

const MAL = " · ";
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
const z = (a, b) => LST.zufall(a, b);

function zahl(stufe, typ, text, antwort, einheit, weg, daten) {
  return { art: "zahl", stufe, typ, text, antwort: rund(antwort), einheit, loesung: `${dez(antwort)} ${einheit}`, weg: `${weg} = ${dez(antwort)} ${einheit}`, kennung: text, daten };
}

// ---------- b: Regeln, als Auswahl ----------
// Jede Frage: Aufbau vorher/nachher; die Antwort wählt die Prüfung über ein Schaltungsmodell nach.
const HELL = ["heller", "gleich hell", "dunkler", "gar nicht mehr"];
const STROM = ["grösser", "gleich", "kleiner", "kein Strom mehr"];
const FRAGEN = [
  { id: "serie-dazu", text: "Zu einem Lämpchen an einer Batterie wird ein gleiches Lämpchen in Serie geschaltet. Wie leuchtet das erste Lämpchen jetzt?", optionen: HELL, richtig: "dunkler", modell: { vorher: ["serie", 1], nachher: ["serie", 2], was: "hell" } },
  { id: "parallel-dazu", text: "Zu einem Lämpchen an einer Batterie wird ein gleiches Lämpchen parallel geschaltet. Wie leuchtet das erste Lämpchen jetzt?", optionen: HELL, richtig: "gleich hell", modell: { vorher: ["parallel", 1], nachher: ["parallel", 2], was: "hell" } },
  { id: "serie-weg", text: "Drei gleiche Lämpchen sind in Serie geschaltet. Eines wird herausgeschraubt. Wie leuchten die anderen?", optionen: HELL, richtig: "gar nicht mehr", modell: { vorher: ["serie", 3], nachher: ["serie-offen", 3], was: "hell" } },
  { id: "parallel-weg", text: "Drei gleiche Lämpchen sind parallel geschaltet. Eines wird herausgeschraubt. Wie leuchten die anderen?", optionen: HELL, richtig: "gleich hell", modell: { vorher: ["parallel", 3], nachher: ["parallel", 2], was: "hell" } },
  { id: "serie-strom", text: "Zu zwei gleichen Lämpchen in Serie kommt ein drittes in Serie dazu. Wie ändert sich die Stromstärke im Stromkreis?", optionen: STROM, richtig: "kleiner", modell: { vorher: ["serie", 2], nachher: ["serie", 3], was: "strom" } },
  { id: "parallel-strom", text: "Zu zwei gleichen Lämpchen parallel kommt ein drittes parallel dazu. Wie ändert sich die Stromstärke, die aus der Batterie fliesst?", optionen: STROM, richtig: "grösser", modell: { vorher: ["parallel", 2], nachher: ["parallel", 3], was: "strom" } },
  { id: "serie-weniger", text: "Von drei gleichen Lämpchen in Serie wird eines durch ein Kabel ersetzt. Wie leuchten die beiden anderen?", optionen: HELL, richtig: "heller", modell: { vorher: ["serie", 3], nachher: ["serie", 2], was: "hell" } },
  { id: "parallel-zweig", text: "Zwei gleiche Lämpchen sind parallel geschaltet. Wie gross ist die Stromstärke durch ein Lämpchen im Vergleich zur Stromstärke aus der Batterie?", optionen: STROM, richtig: "kleiner", modell: { vorher: ["parallel", 2], nachher: ["parallel-zweig", 2], was: "strom" } },
];
function stufeB() {
  const f = LST.waehle(FRAGEN);
  const optionen = f.optionen.slice();
  return { art: "auswahl", stufe: "b", typ: f.id, text: f.text, optionen, richtig: optionen.indexOf(f.richtig), loesung: f.richtig, weg: WEG_B[f.id], kennung: f.text + optionen.join("|"), daten: f.modell };
}
const WEG_B = {
  "serie-dazu": "In Serie teilen sich die Lämpchen die Spannung; der Strom wird kleiner, jedes leuchtet dunkler",
  "parallel-dazu": "Parallel liegt an jedem Lämpchen die ganze Spannung; es leuchtet gleich hell",
  "serie-weg": "In Serie gibt es nur einen Weg; ist er unterbrochen, fliesst kein Strom",
  "parallel-weg": "Jeder Zweig hat die ganze Spannung; die anderen Zweige bleiben geschlossen",
  "serie-strom": "Mehr Lämpchen in Serie heisst mehr Widerstand, also weniger Strom",
  "parallel-strom": "Jeder Zweig braucht Strom; aus der Batterie fliesst die Summe",
  "serie-weniger": "Weniger Widerstand in Serie, mehr Spannung je Lämpchen: heller",
  "parallel-zweig": "Knotenregel: Der Strom aus der Batterie teilt sich auf die Zweige auf",
};

// ---------- c: Ohmsches Gesetz ----------
function stufeC() {
  const gesucht = LST.waehle(["U", "U", "I", "I", "R", "R"]);
  const R = LST.waehle([5, 10, 12, 20, 25, 40, 50, 100, 200, 220, 470, 500, 1000]);
  let I; do { I = LST.waehle([0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1, 1.5, 2]); } while (R * I > 400 || R * I < 0.5);
  const U = rund(R * I);
  const mA = I < 0.1 && LST.zufall(0, 1) === 1;
  const It = mA ? `${dez(I * 1000)} mA` : `${dez(I)} A`;
  const Rt = `${LST.zahlText(R)} Ω`, Ut = `${dez(U)} V`;
  if (gesucht === "U") return zahl("c", "ohm-U", `Ein Widerstand von ${Rt} wird von ${It} durchflossen. Welche Spannung liegt an?`, U, "V", `U = R${MAL}I = ${LST.zahlText(R)}${MAL}${dez(I)}`, { U, R, I, gesucht, mA });
  if (gesucht === "I") return zahl("c", "ohm-I", `An einem Widerstand von ${Rt} liegen ${Ut}. Wie gross ist die Stromstärke in Ampere?`, I, "A", `I = U : R = ${dez(U)} : ${LST.zahlText(R)}`, { U, R, I, gesucht });
  return zahl("c", "ohm-R", `An einem Bauteil liegen ${Ut}, es fliessen ${It}. Wie gross ist sein Widerstand?`, R, "Ω", `R = U : I = ${dez(U)} : ${dez(I)}`, { U, R, I, gesucht, mA });
}

// ---------- d: verzweigt ----------
function stufeD() {
  const typ = LST.waehle(["knoten", "knoten", "masche", "parallel-ohm", "serie-ohm"]);
  if (typ === "knoten") {
    const n = z(2, 3), teil = Array.from({ length: n }, () => z(1, 30) / 10);
    if (LST.zufall(0, 1)) {
      const s = rund(teil.reduce((a, b) => a + b, 0));
      return zahl("d", typ, `In ${n} parallelen Zweigen fliessen ${teil.map(x => `${dez(x)} A`).join(", ").replace(/, ([^,]*)$/, " und $1")}. Wie gross ist die Stromstärke vor der Verzweigung?`, s, "A", teil.map(dez).join(" + "), { teil, summe: s, fehlt: null });
    }
    const s = rund(teil.reduce((a, b) => a + b, 0)), fehlt = teil.pop();
    return zahl("d", "knoten-fehlt", `Vor einer Verzweigung fliessen ${dez(s)} A. In ${teil.length === 1 ? "einem Zweig fliessen" : "den Zweigen fliessen"} ${teil.map(x => `${dez(x)} A`).join(" und ")}. Wie gross ist die Stromstärke im letzten Zweig?`,
      fehlt, "A", `${dez(s)} − ${teil.map(dez).join(" − ")}`, { teil, summe: s, fehlt });
  }
  if (typ === "masche") {
    const Uq = LST.waehle([4.5, 6, 9, 12, 24]);
    let u1; do { u1 = z(1, Uq * 10 - 1) / 10; } while (!(u1 > 0 && u1 < Uq));
    return zahl("d", typ, `Zwei Widerstände sind in Serie an ${dez(Uq)} V angeschlossen. Am ersten liegen ${dez(u1)} V. Welche Spannung liegt am zweiten?`, rund(Uq - u1), "V", `${dez(Uq)} − ${dez(u1)}`, { Uq, u1 });
  }
  if (typ === "parallel-ohm") {
    const U = LST.waehle([6, 9, 12, 24]), R1 = LST.waehle([4, 6, 12, 24, 30, 60]), R2 = LST.waehle([3, 8, 12, 20, 40, 48]);
    const I = rund(U / R1 + U / R2);
    if (!Number.isInteger(rund(I * 100))) return stufeD();
    return zahl("d", typ, `Zwei Widerstände, ${R1} Ω und ${R2} Ω, sind parallel an ${U} V angeschlossen. Wie gross ist die Stromstärke vor der Verzweigung?`, I, "A", `${U} : ${R1} + ${U} : ${R2} = ${dez(U / R1)} + ${dez(U / R2)}`, { U, R: [R1, R2], art: "parallel" });
  }
  const R1 = LST.waehle([10, 20, 30, 40, 50, 100]), R2 = LST.waehle([10, 20, 50, 60, 80, 100]), U = LST.waehle([3, 6, 9, 12, 24]);
  const I = rund(U / (R1 + R2));
  if (!Number.isInteger(rund(I * 1000))) return stufeD();
  return zahl("d", "serie-ohm", `Zwei Widerstände, ${R1} Ω und ${R2} Ω, sind in Serie an ${U} V angeschlossen. Wie gross ist die Stromstärke in Ampere?`, I, "A", `I = ${U} : (${R1} + ${R2}) = ${U} : ${R1 + R2}`, { U, R: [R1, R2], art: "serie" });
}

// ---------- Challenge ----------
function challenge() {
  const typ = LST.waehle(["teilspannung", "fehlender-r", "zweigstrom"]);
  if (typ === "teilspannung") {
    const R1 = LST.waehle([10, 20, 30, 40, 60]), R2 = LST.waehle([10, 20, 40, 50, 60]), U = LST.waehle([6, 9, 12, 24]);
    const u1 = rund(U * R1 / (R1 + R2));
    if (!Number.isInteger(rund(u1 * 100))) return challenge();
    return zahl("challenge", typ, `${R1} Ω und ${R2} Ω sind in Serie an ${U} V angeschlossen. Welche Spannung liegt am Widerstand mit ${R1} Ω?`, u1, "V",
      `I = ${U} : ${R1 + R2} = ${dez(U / (R1 + R2))} A, U = ${R1}${MAL}${dez(U / (R1 + R2))}`, { U, R: [R1, R2], art: "teil" });
  }
  if (typ === "fehlender-r") {
    const U = LST.waehle([6, 12, 24]), R1 = LST.waehle([6, 12, 24, 48]), R2 = LST.waehle([4, 8, 12, 16, 24, 48]);
    const I = rund(U / R1 + U / R2);
    if (!Number.isInteger(rund(I * 100))) return challenge();
    return zahl("challenge", typ, `Zwei Widerstände sind parallel an ${U} V angeschlossen. Der eine hat ${R1} Ω, vor der Verzweigung fliessen ${dez(I)} A. Wie gross ist der andere Widerstand?`,
      R2, "Ω", `I₁ = ${U} : ${R1} = ${dez(U / R1)} A, I₂ = ${dez(I)} − ${dez(U / R1)} = ${dez(U / R2)} A, R₂ = ${U} : ${dez(U / R2)}`, { U, R1, I, art: "fehlend" });
  }
  const U = LST.waehle([6, 12, 24]), R1 = LST.waehle([4, 6, 12, 24]), R2 = LST.waehle([3, 8, 12, 48]), I = rund(U / R1 + U / R2);
  if (!Number.isInteger(rund(I * 100))) return challenge();
  return zahl("challenge", "zweigstrom", `Vor einer Verzweigung fliessen ${dez(I)} A. Im einen Zweig liegt ein Widerstand von ${R1} Ω an ${U} V. Wie gross ist die Stromstärke im anderen Zweig?`,
    rund(I - U / R1), "A", `I₁ = ${U} : ${R1} = ${dez(U / R1)} A, ${dez(I)} − ${dez(U / R1)}`, { U, R1, I, art: "zweig" });
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "b") return stufeB();
  if (stufe === "c") return stufeC();
  if (stufe === "d") return stufeD();
  if (stufe === "challenge") return challenge();
  throw new Error(`stromkreis: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    "ohm-U": "Spannung ist Widerstand mal Stromstärke. Milliampere zuerst in Ampere umrechnen: durch tausend.",
    "ohm-I": "Stromstärke ist Spannung geteilt durch Widerstand.",
    "ohm-R": "Widerstand ist Spannung geteilt durch Stromstärke. Milliampere zuerst in Ampere umrechnen.",
    knoten: "Knotenregel: Was in eine Verzweigung hineinfliesst, fliesst auch wieder hinaus. Addiere die Zweigströme.",
    "knoten-fehlt": "Knotenregel: Der Strom vor der Verzweigung ist die Summe aller Zweigströme. Subtrahiere die bekannten.",
    masche: "Maschenregel: In Serie ergeben die Teilspannungen zusammen die Spannung der Quelle.",
    "parallel-ohm": "Rechne für jeden Zweig die Stromstärke mit dem Ohmschen Gesetz, dann addiere.",
    "serie-ohm": "In Serie addieren sich die Widerstände. Dann Spannung durch Gesamtwiderstand.",
    teilspannung: "Zuerst die Stromstärke mit dem Gesamtwiderstand, dann Widerstand mal Stromstärke.",
    "fehlender-r": "Stromstärke im bekannten Zweig ausrechnen, mit der Knotenregel den anderen Zweig, dann R = U : I.",
    zweigstrom: "Stromstärke im bekannten Zweig mit dem Ohmschen Gesetz, dann Knotenregel.",
  };
  if (a.art === "auswahl") return "Überlege: Wie viele Wege hat der Strom, und welche Spannung liegt an jedem Lämpchen?";
  return h[a.typ] || "Schreibe auf, was gegeben und was gesucht ist.";
}

// ---------- Prüfung ----------
// Schaltungsmodell für b: n gleiche Lämpchen (Widerstand 1) an der Spannung 1. Helligkeit = Leistung eines Lämpchens.
function modell([art, n]) {
  if (art === "serie") return { hell: 1 / (n * n), strom: 1 / n };
  if (art === "serie-offen") return { hell: 0, strom: 0 };
  if (art === "parallel") return { hell: 1, strom: n };
  if (art === "parallel-zweig") return { hell: 1, strom: 1 };
  throw new Error(art);
}
function vergleich(vorher, nachher, ist) {
  if (nachher === 0 && vorher > 0) return ist === HELL ? "gar nicht mehr" : "kein Strom mehr";
  const d = nachher - vorher;
  if (Math.abs(d) < 1e-12) return ist === HELL ? "gleich hell" : "gleich";
  if (ist === HELL) return d > 0 ? "heller" : "dunkler";
  return d > 0 ? "grösser" : "kleiner";
}
function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  if (a.art === "auswahl") {
    const v = modell(d.vorher)[d.was], n = modell(d.nachher)[d.was];
    const soll = vergleich(v, n, d.was === "hell" ? HELL : STROM);
    if (a.optionen[a.richtig] !== soll) m.push(`Auswahl „${a.optionen[a.richtig]}“, Modell sagt „${soll}“: ${a.text}`);
    if (new Set(a.optionen).size !== a.optionen.length) m.push("doppelte Optionen");
    return m;
  }
  let soll;
  if (d.gesucht) soll = { U: d.R * d.I, I: d.U / d.R, R: d.U / d.I }[d.gesucht];
  else if (d.teil && d.fehlt === null) soll = d.teil.reduce((x, y) => x + y, 0);
  else if (d.teil) soll = d.summe - d.teil.reduce((x, y) => x + y, 0);
  else if (d.Uq) soll = d.Uq - d.u1;
  else if (d.art === "parallel") soll = d.R.reduce((s, r) => s + d.U / r, 0);
  else if (d.art === "serie") soll = d.U / (d.R[0] + d.R[1]);
  else if (d.art === "teil") soll = d.R[0] * d.U / (d.R[0] + d.R[1]);
  else if (d.art === "fehlend") soll = d.U / (d.I - d.U / d.R1);
  else if (d.art === "zweig") soll = d.I - d.U / d.R1;
  if (Math.abs(soll - a.antwort) > 1e-9) m.push(`Antwort ${a.antwort}, nachgerechnet ${soll}: ${a.text}`);
  if (a.antwort <= 0) m.push(`nicht positiv: ${a.text}`);
  if (!Number.isInteger(rund(a.antwort * 1000))) m.push(`mehr als drei Nachkommastellen: ${a.text}`);
  if (d.mA && !/mA/.test(a.text)) m.push("mA nicht im Text");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
