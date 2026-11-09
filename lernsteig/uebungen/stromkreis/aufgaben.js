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
  einleitung: "Stromkreise: Regeln für Serie und Parallel, Ohmsches Gesetz U = R · I. Die Batterie liefert immer dieselbe Spannung.",
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
// Lehrplan NT.5.2.b: „Veränderungen in Stromkreisen mit Messgeräten untersuchen, einfache Regeln aufstellen (mehr/weniger
// Lämpchen, Serie-/Parallelschaltung)“. Darum nur Lämpchen und Schaltungsart, keine weiteren Batterien. Vorrat nach VF1 a
// (E 9, LERN_Session21): statt acht fester Fragen je Aufbau (1 bis 4 gleiche Lämpchen, Serie oder parallel) eine
// Veränderung — eines dazu, eines durch ein Kabel ersetzt, eines herausgeschraubt — und die Frage nach der Helligkeit
// oder nach der Anzeige des Strommessers; dazu der Vergleich Zweig- und Batteriestrom. 37 verschiedene Aufgaben.
const HELL = ["heller", "gleich hell", "dunkler", "gar nicht mehr"];
const STROM = ["grösser", "gleich", "kleiner", "zeigt 0"];
// Vergleich zweier Anzeigen (Zweig gegen Batterie): ohne „zeigt 0“, das eine Veränderung beschreibt (Durchsicht LERN_Session22)
const VERGLEICH = ["grösser", "gleich", "kleiner"];
const ZAHLWORT = { 2: "Zwei", 3: "Drei", 4: "Vier" };
/** Aufbau als Satz: n gleiche Lämpchen in Serie oder parallel an einer Batterie (eines: ohne Schaltungsart). */
const aufbauText = (art, n) => (n === 1 ? "Ein Lämpchen hängt an einer Batterie."
  : `${ZAHLWORT[n]} gleiche Lämpchen sind ${art === "serie" ? "in Serie" : "parallel"} an eine Batterie geschaltet.`);
// Veränderungen: Satz, Aufbau nachher, erlaubte Anzahl vorher
const VERAENDERUNG = {
  "serie-dazu": { art: "serie", satz: "Ein gleiches Lämpchen kommt in Serie dazu.", nachher: n => ["serie", n + 1], von: 1, bis: 4 },
  "serie-kabel": { art: "serie", satz: "Eines wird durch ein Kabel ersetzt.", nachher: n => ["serie", n - 1], von: 2, bis: 4 },
  "serie-weg": { art: "serie", satz: "Eines wird herausgeschraubt.", nachher: n => ["serie-offen", n - 1], von: 2, bis: 4 },
  "parallel-dazu": { art: "parallel", satz: "Ein gleiches Lämpchen kommt parallel dazu.", nachher: n => ["parallel", n + 1], von: 1, bis: 4 },
  "parallel-weg": { art: "parallel", satz: "Eines wird herausgeschraubt.", nachher: n => ["parallel", n - 1], von: 2, bis: 4 },
};
// Die einfachen Regeln (Antworten des Erzeugers); die Prüfung rechnet sie unabhängig mit dem Schaltungsmodell nach
const REGEL = {
  "serie-dazu": { hell: "dunkler", strom: "kleiner" }, "serie-kabel": { hell: "heller", strom: "grösser" },
  "serie-weg": { hell: "gar nicht mehr", strom: "zeigt 0" }, "parallel-dazu": { hell: "gleich hell", strom: "grösser" },
  "parallel-weg": { hell: "gleich hell", strom: "kleiner" }, "parallel-zweig": { strom: "kleiner" },
};
// Helligkeit: kommt eines dazu, nach denen, die schon da waren; fällt eines weg, nach dem oder den übrigen
const FRAGE_HELL = (n, dazu) => (dazu ? (n === 1 ? "Wie leuchtet das erste Lämpchen jetzt?" : "Wie leuchten die Lämpchen, die schon da waren?")
  : n - 1 === 1 ? "Wie leuchtet das übrige Lämpchen jetzt?" : "Wie leuchten die übrigen Lämpchen jetzt?");
const FRAGE_STROM = "Ein Strommesser ist direkt hinter der Batterie eingebaut. Wie ändert sich seine Anzeige?";
const FRAGE_ZWEIG = "Ein Strommesser misst den Strom durch ein Lämpchen, ein zweiter den Strom aus der Batterie. Was zeigt der erste im Vergleich zum zweiten?";
const WEG_B = {
  "serie-dazu": { hell: "In Serie teilen sich die Lämpchen die Spannung; jedes bekommt weniger Spannung und weniger Strom, darum leuchtet jedes dunkler (es fliesst weiter Strom, auch wenn man das Leuchten kaum noch sieht)",
    strom: "Mehr Lämpchen in Serie heisst mehr Widerstand, also weniger Strom" },
  "serie-kabel": { hell: "Weniger Lämpchen in Serie: mehr Spannung je Lämpchen und mehr Strom, heller",
    strom: "Weniger Widerstand in Serie, also mehr Strom" },
  "serie-weg": { hell: "In Serie gibt es nur einen Weg; ist er unterbrochen, fliesst kein Strom",
    strom: "In Serie gibt es nur einen Weg; ist er unterbrochen, fliesst kein Strom" },
  "parallel-dazu": { hell: "Parallel liegt an jedem Lämpchen die ganze Spannung der Batterie; darum leuchten die Lämpchen gleich hell wie vorher",
    strom: "Jeder Zweig braucht Strom; aus der Batterie fliesst die Summe, sie wird grösser" },
  "parallel-weg": { hell: "Jeder Zweig hat die ganze Spannung der Batterie. Die übrigen Zweige sind weiter mit der Batterie verbunden, darum leuchten ihre Lämpchen gleich hell",
    strom: "Ein Zweig weniger: Die Summe der Zweigströme aus der Batterie wird kleiner" },
  "parallel-zweig": { strom: "Knotenregel: Der Strom aus der Batterie teilt sich auf die Zweige auf; durch ein Lämpchen fliesst nur ein Teil, bei n gleichen Lämpchen ein n-tel" },
};
/** Alle Aufgaben der Stufe b als Liste (für die Auswahl und fürs Testskript). */
function alleB() {
  const liste = [];
  for (const [id, v] of Object.entries(VERAENDERUNG)) {
    for (let n = v.von; n <= v.bis; n++) {
      for (const was of ["hell", "strom"]) {
        liste.push({ id, text: `${aufbauText(v.art, n)} ${v.satz} ${was === "hell" ? FRAGE_HELL(n, id.endsWith("-dazu")) : FRAGE_STROM}`,
          optionen: was === "hell" ? HELL : STROM, richtig: REGEL[id][was], modell: { vorher: [v.art, n], nachher: v.nachher(n), was }, weg: WEG_B[id][was] });
      }
    }
  }
  for (let n = 2; n <= 4; n++) liste.push({ id: "parallel-zweig", text: `${aufbauText("parallel", n)} ${FRAGE_ZWEIG}`, optionen: VERGLEICH, richtig: REGEL["parallel-zweig"].strom,
    modell: { vorher: ["parallel", n], nachher: ["parallel-zweig", n], was: "strom" }, weg: WEG_B["parallel-zweig"].strom });
  return liste;
}
const FRAGEN_B = alleB();
function stufeB() {
  const f = LST.waehle(FRAGEN_B);
  const optionen = f.optionen.slice();
  return { art: "auswahl", stufe: "b", typ: f.id, text: f.text, optionen, richtig: optionen.indexOf(f.richtig), loesung: f.richtig, weg: f.weg,
    kennung: f.text + optionen.join("|"), daten: f.modell };
}

// ---------- c: Ohmsches Gesetz ----------
// E7-3 a (Plan E 7): zwei Zusammenhänge mit passenden Grössen — Schulversuch mit Kleinspannung (1.5 bis 24 V) und
// Haushaltgerät am Netz (230 V, Heizgeräte und Glühlampe als ohmsche Widerstände; Ströme Annahme nach üblicher Leistung)
const NETZ = 230;
const GERAETE = [["Eine Glühlampe", [0.25, 0.5]], ["Ein Bügeleisen", [4, 5, 8]], ["Ein Toaster", [4, 5]], ["Ein Föhn", [5, 8]],
  ["Ein Wasserkocher", [8, 10]], ["Ein Heizlüfter", [5, 8, 10]]];
function stufeC() {
  if (LST.zufall(0, 1)) {
    const [geraet, stroeme] = LST.waehle(GERAETE), I = LST.waehle(stroeme), R = rund(NETZ / I);
    if (LST.zufall(0, 1)) return zahl("c", "netz-R", `${geraet} am Netz (230 V) nimmt ${dez(I)} A auf. Wie gross ist der Widerstand?`, R, "Ω", `R = U : I = 230 : ${dez(I)}`, { U: NETZ, R, I, gesucht: "R", netz: geraet });
    return zahl("c", "netz-I", `${geraet} mit ${dez(R)} Ω ist am Netz (230 V) angeschlossen. Wie gross ist die Stromstärke in Ampere?`, I, "A", `I = U : R = 230 : ${dez(R)}`, { U: NETZ, R, I, gesucht: "I", netz: geraet });
  }
  const gesucht = LST.waehle(["U", "U", "I", "I", "R", "R"]);
  const R = LST.waehle([5, 10, 12, 20, 25, 40, 50, 100, 200, 220, 470, 500, 1000]);
  let I; do { I = LST.waehle([0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1, 1.5, 2]); } while (R * I > 24 || R * I < 1.5);
  const U = rund(R * I);
  const mA = I < 0.1 && LST.zufall(0, 1) === 1;
  const It = mA ? `${dez(I * 1000)} mA` : `${dez(I)} A`;
  const Rt = `${LST.zahlText(R)} Ω`, Ut = `${dez(U)} V`;
  if (gesucht === "U") return zahl("c", "ohm-U", `Im Versuch wird ein Widerstand von ${Rt} von ${It} durchflossen. Welche Spannung liegt an?`, U, "V", `U = R${MAL}I = ${LST.zahlText(R)}${MAL}${dez(I)}`, { U, R, I, gesucht, mA });
  if (gesucht === "I") return zahl("c", "ohm-I", `Im Versuch liegen an einem Widerstand von ${Rt} ${Ut}. Wie gross ist die Stromstärke in Ampere?`, I, "A", `I = U : R = ${dez(U)} : ${LST.zahlText(R)}`, { U, R, I, gesucht });
  return zahl("c", "ohm-R", `Im Versuch liegen an einem Bauteil ${Ut}, es fliessen ${It}. Wie gross ist sein Widerstand?`, R, "Ω", `R = U : I = ${dez(U)} : ${dez(I)}`, { U, R, I, gesucht, mA });
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
    "netz-R": "Am Netz liegen immer 230 Volt. Widerstand ist Spannung geteilt durch Stromstärke.",
    "netz-I": "Am Netz liegen immer 230 Volt. Stromstärke ist Spannung geteilt durch Widerstand.",
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
// serie-offen: der Kreis ist unterbrochen; parallel-zweig: Strom durch einen von n Zweigen.
function modell([art, n]) {
  if (art === "serie") return { hell: 1 / (n * n), strom: 1 / n };
  if (art === "serie-offen") return { hell: 0, strom: 0 };
  if (art === "parallel") return { hell: 1, strom: n };
  if (art === "parallel-zweig") return { hell: 1, strom: 1 };
  throw new Error(art);
}
// Gezeigten Satz lesen (Wortlaute hier im Prüfteil eigens festgehalten, wie bei TD1 a): Aufbau, Veränderung, Frage
// → Daten im Format des Modells, oder null, wenn der Satz keinem Muster folgt.
const ZAHL_LESEN = { Ein: 1, Zwei: 2, Drei: 3, Vier: 4 };
function liesB(text) {
  const auf = /^(?:Ein Lämpchen hängt an einer Batterie\.|(Zwei|Drei|Vier) gleiche Lämpchen sind (in Serie|parallel) an eine Batterie geschaltet\.) /.exec(text);
  if (!auf) return null;
  const n = auf[1] ? ZAHL_LESEN[auf[1]] : 1, rest = text.slice(auf[0].length);
  const artAuf = auf[2] === "in Serie" ? "serie" : auf[2] === "parallel" ? "parallel" : null;
  if (rest === "Ein Strommesser misst den Strom durch ein Lämpchen, ein zweiter den Strom aus der Batterie. Was zeigt der erste im Vergleich zum zweiten?")
    return artAuf === "parallel" ? { vorher: ["parallel", n], nachher: ["parallel-zweig", n], was: "strom" } : null;
  const ver = /^(Ein gleiches Lämpchen kommt (in Serie|parallel) dazu|Eines wird durch ein Kabel ersetzt|Eines wird herausgeschraubt)\. (.*)$/.exec(rest);
  if (!ver) return null;
  const dazu = !!ver[2];
  const frageHell = dazu ? (n === 1 ? "Wie leuchtet das erste Lämpchen jetzt?" : "Wie leuchten die Lämpchen, die schon da waren?")
    : n === 2 ? "Wie leuchtet das übrige Lämpchen jetzt?" : "Wie leuchten die übrigen Lämpchen jetzt?";
  const was = ver[3] === "Ein Strommesser ist direkt hinter der Batterie eingebaut. Wie ändert sich seine Anzeige?" ? "strom" : ver[3] === frageHell ? "hell" : null;
  if (!was) return null;
  // ein einzelnes Lämpchen hat keine Schaltungsart; sie kommt mit dem dazugeschalteten
  const art = artAuf || (ver[2] === "in Serie" ? "serie" : ver[2] === "parallel" ? "parallel" : null);
  if (!art || (artAuf && ver[2] && (ver[2] === "in Serie") !== (artAuf === "serie"))) return null;
  if (ver[2]) return { vorher: [art, n], nachher: [art, n + 1], was };
  if (n < 2) return null;
  if (ver[1] === "Eines wird durch ein Kabel ersetzt") return art === "serie" ? { vorher: [art, n], nachher: [art, n - 1], was } : null;
  return { vorher: [art, n], nachher: art === "serie" ? ["serie-offen", n - 1] : ["parallel", n - 1], was };
}
function vergleich(vorher, nachher, ist) {
  if (nachher === 0 && vorher > 0) return ist === HELL ? "gar nicht mehr" : "zeigt 0";
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
    // aus dem gezeigten Satz, nicht aus den Daten des Erzeugers; beide müssen übereinstimmen
    const t = liesB(a.text);
    if (!t) { m.push(`Satz folgt keinem Muster: ${a.text}`); return m; }
    if (JSON.stringify(t) !== JSON.stringify(d)) m.push(`Text sagt ${JSON.stringify(t)}, Daten ${JSON.stringify(d)}: ${a.text}`);
    const v = modell(t.vorher)[t.was], n = modell(t.nachher)[t.was];
    const soll = vergleich(v, n, t.was === "hell" ? HELL : STROM);
    if (a.optionen[a.richtig] !== soll) m.push(`Auswahl „${a.optionen[a.richtig]}“, Modell sagt „${soll}“: ${a.text}`);
    const sollOpt = t.was === "hell" ? HELL : t.nachher[0] === "parallel-zweig" ? VERGLEICH : STROM;
    if (JSON.stringify(a.optionen) !== JSON.stringify(sollOpt)) m.push(`Optionen passen nicht zur Frage: ${a.text}`);
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
  // E7-3 a: Grössen passend zum Zusammenhang — am Netz 230 V und ein Gerät mit üblichem Strom, im Versuch 1.5 bis 24 V
  if (stufe === "c") {
    if (d.netz) {
      const g = GERAETE.find(x => x[0] === d.netz);
      if (d.U !== NETZ || !a.text.includes("am Netz (230 V)") || !a.text.startsWith(d.netz)) m.push(`Netz-Aufgabe ohne 230 V oder Gerät: ${a.text}`);
      if (!g || !g[1].includes(d.I)) m.push(`Strom ${d.I} A passt nicht zum Gerät ${d.netz}`);
    } else {
      if (d.U < 1.5 || d.U > 24) m.push(`Spannung ${d.U} V im Versuch (erlaubt 1.5 bis 24 V): ${a.text}`);
      if (!a.text.startsWith("Im Versuch")) m.push(`Zusammenhang fehlt: ${a.text}`);
    }
  }
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis, FRAGEN_B };
