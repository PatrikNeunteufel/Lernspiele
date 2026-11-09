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
   Reibung und ohne Gewicht der Rollen. Stufen b (Wirkungen) und f (beschleunigt) folgen später.
   Plan E 7 (LERN_Session24): a erkennt gleichförmige Bewegungen unter mehreren Linien (E7-1 a: Pause, schneller,
   langsamer werdend), vergleicht und ordnet Geschwindigkeiten einer Linie zu; c mit Messbereich des Kraftmessers
   (Annahme: 1, 2, 5, 10, 20, 50 N, mit dem Lehrmittel abzugleichen) und dem Diagramm Gewichtskraft–Masse (E7-2 a). */
"use strict";

const UEBUNG = {
  id: "kraefte",
  einleitung: "Bewegung, Gewichtskraft und einfache Maschinen. Rechne mit g = 10 N/kg und ohne Reibung.",
  stufen: {
    a: "Gleichförmige Bewegung im Weg-Zeit-Diagramm: erkennen, vergleichen, ablesen",
    c: "Gewichtskraft und Masse, Kraftmesser und Diagramm",
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
// Mehrere Linien (E7-1 a): Weg-Zeit-Diagramm bis 10 s, jede Linie startet im Ursprung und endet bei 10 s auf einem
// anderen Weg (die Namen A–D stehen am Ende und überdecken sich nicht)
const T_A = 10, NAMEN = ["A", "B", "C", "D"];
// Streckenzug einer Bewegungsart, die bei T_A den Weg E erreicht
function linie(art, E) {
  if (art === "gleich") return [[0, 0], [T_A, E]];
  if (art === "pause") return [[0, 0], [3, rund(3 * E / 7)], [6, rund(3 * E / 7)], [T_A, E]]; // steht von 3 bis 6 s still
  if (art === "schneller") return [[0, 0], [5, rund(E / 4)], [T_A, E]];
  return [[0, 0], [5, rund(3 * E / 4)], [T_A, E]]; // langsamer werdend
}
function linienAufgabe(typ) {
  const schritt = LST.waehle([2, 5, 10]), n = typ === "schneller" ? 3 : 4;
  const k = LST.mische([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, n); // Endwege in Gitterschritten, verschieden
  const arten = typ === "gleichfoermig" ? LST.mische(["gleich", "pause", "schneller", "langsamer"]) : Array(n).fill("gleich");
  const linien = k.map((ki, i) => ({ name: NAMEN[i], art: arten[i], E: ki * schritt, punkte: linie(arten[i], ki * schritt) }));
  const darstellung = { art: "graph", x: [0, T_A], y: [0, 10 * schritt], schritt: 1, schrittY: schritt, beschrY: 2 * schritt, xName: "t in s", yName: "s in m",
    linien: linien.map(l => ({ name: l.name, punkte: l.punkte })) };
  const optionen = linien.map(l => l.name);
  const daten = { linien: linien.map(l => ({ name: l.name, punkte: l.punkte })) };
  if (typ === "gleichfoermig") {
    const r = linien.find(l => l.art === "gleich");
    return { art: "auswahl", stufe: "a", typ, text: "Welche Linie zeigt eine gleichförmige Bewegung?", optionen, richtig: optionen.indexOf(r.name), loesung: r.name,
      weg: `${r.name} ist eine Gerade ohne Knick: in gleichen Zeiten gleiche Wege.`, kennung: `g:${linien.map(l => `${l.art}${l.E}`).join(",")}`, daten, darstellung };
  }
  if (typ === "schneller") {
    const r = linien.reduce((x, y) => (y.E > x.E ? y : x));
    return { art: "auswahl", stufe: "a", typ, text: "Drei Körper bewegen sich gleichförmig. Welcher ist am schnellsten?", optionen, richtig: optionen.indexOf(r.name), loesung: r.name,
      weg: `${r.name} ist am steilsten: nach ${T_A} s ${LST.zahlText(r.E)} m, v = ${dez(r.E / T_A)} m/s`, kennung: `s:${linien.map(l => l.E).join(",")}`, daten, darstellung };
  }
  const r = LST.waehle(linien), v = r.E / T_A;
  return { art: "auswahl", stufe: "a", typ, text: `Ein Körper bewegt sich gleichförmig mit ${dez(v)} m/s. Welche Linie zeigt seine Bewegung?`, optionen, richtig: optionen.indexOf(r.name), loesung: r.name,
    weg: `Nach ${T_A} s: ${dez(v)}${MAL}${T_A} = ${LST.zahlText(r.E)} m, also ${r.name}`, kennung: `d:${dez(v)}:${linien.map(l => l.E).join(",")}`, daten: Object.assign(daten, { v }), darstellung };
}
function stufeA() {
  const typ = LST.waehle(["v-diagramm", "weg-nach", "gleichfoermig", "schneller", "darstellen"]);
  if (typ === "gleichfoermig" || typ === "schneller" || typ === "darstellen") return linienAufgabe(typ);
  const v = LST.waehle([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]);
  const T = 10, ymax = v * T;
  const schritt = ymax <= 10 ? 1 : ymax <= 20 ? 2 : ymax <= 50 ? 5 : 10;
  const darstellung = { art: "graph", m: v, b: 0, x: [0, T], y: [0, ymax], schrittY: schritt, beschrY: schritt, xName: "t in s", yName: "s in m" };
  if (typ === "v-diagramm") {
    return zahl("a", typ, "Das Diagramm zeigt eine gleichförmige Bewegung. Wie gross ist die Geschwindigkeit in m/s?", v, "m/s", `v = s : t = ${dez(ymax)} m : ${T} s`, { v }, { darstellung, kennung: `v${v}` });
  }
  const t = z(11, 30);
  return zahl("a", typ, `Die Bewegung im Diagramm geht gleichförmig weiter. Welchen Weg hat der Körper nach ${t} s zurückgelegt?`, v * t, "m", `v = ${dez(ymax)} : ${T} = ${dez(v)} m/s, s = ${dez(v)}${MAL}${t}`, { v, t }, { darstellung, kennung: `s${v}-${t}` });
}

// ---------- c ----------
// Messbereiche von Federkraftmessern (E7-2 a; Annahme, mit dem Lehrmittel abzugleichen)
const BEREICHE = [1, 2, 5, 10, 20, 50];
function stufeC() {
  const typ = LST.waehle(["kraft-kg", "kraft-g", "masse", "fm-kraft", "fm-masse"]);
  // ohne Kraftmesser: Gewichtskraft von Alltagsmassen bis 100 kg
  if (typ === "kraft-kg") { const m = z(1, 200) / 2; return zahl("c", typ, `Welche Gewichtskraft wirkt auf einen Körper mit der Masse ${dez(m)} kg?`, m * G, "N", `F = m${MAL}g = ${dez(m)}${MAL}10`, { m }); }
  if (typ === "kraft-g") {
    const g = z(1, 99) * 10, F = g / 1000 * G, b = LST.waehle(BEREICHE.filter(x => x >= F).slice(0, 2));
    return zahl("c", typ, `Ein Kraftmesser mit Messbereich bis ${b} N trägt einen Körper mit der Masse ${g} g. Welche Kraft zeigt er an?`, F, "N", `${g} g = ${dez(g / 1000)} kg, F = ${dez(g / 1000)}${MAL}10`, { m: g / 1000, bereich: b });
  }
  if (typ === "masse") {
    const b = LST.waehle(BEREICHE), F = z(1, b * 10) / 10, inG = F < G; // unter 1 kg in Gramm
    const einheit = inG ? "g" : "kg", m = inG ? F / G * 1000 : F / G;
    return zahl("c", typ, `Ein Kraftmesser mit Messbereich bis ${b} N zeigt ${dez(F)} N an. Welche Masse hat der Körper in ${einheit}?`, m, einheit,
      inG ? `m = ${dez(F)} : 10 = ${dez(F / G)} kg, in Gramm ${dez(F / G)}${MAL}1'000` : `m = F : g = ${dez(F)} : 10`, { F, bereich: b, einheit });
  }
  // Diagramm Gewichtskraft–Masse (Lehrplan NT.5.1.c: in Diagrammen darstellen, proportional), Messpunkte bis 5 kg und 50 N
  const darstellung = { art: "graph", m: G, b: 0, x: [0, 5], y: [0, 50], schritt: 1, schrittY: 5, beschrY: 10, xName: "m in kg", yName: "F in N",
    punkte: [1, 2, 3, 4, 5].map(x => ({ x, y: x * G })) };
  const m0 = z(1, 10) / 2;
  if (typ === "fm-kraft") return zahl("c", typ, `Das Diagramm zeigt Messungen mit einem Kraftmesser. Wie gross ist die Gewichtskraft bei ${dez(m0)} kg?`, m0 * G, "N", `${dez(m0)} kg${MAL}10 N/kg`, { m: m0 }, { darstellung, kennung: `fk${m0}` });
  return zahl("c", typ, `Das Diagramm zeigt Messungen mit einem Kraftmesser. Bei welcher Masse zeigt er ${LST.zahlText(m0 * G)} N an? Antworte in kg.`, m0, "kg", `${LST.zahlText(m0 * G)} N : 10 N/kg`, { F: m0 * G }, { darstellung, kennung: `fm${m0}` });
}

// ---------- d ----------
// Woran man die Maschine erkennt (Lösungsweg, Durchsicht LERN_Session22)
const BEGRUENDUNG = {
  Hebel: "Eine Stange oder ein Griff dreht sich um einen Drehpunkt.",
  "schiefe Ebene": "Die Last wird auf einem längeren, schrägen Weg nach oben gebracht.",
  Flaschenzug: "Ein Seil läuft über mehrere Rollen.",
  "Ketten-/Zahnradgetriebe": "Zahnräder oder eine Kette übertragen eine Drehung.",
};
function stufeD() {
  const e = LST.waehle(MASCHINEN.beispiele);
  const optionen = MASCHINEN.namen.slice();
  return { art: "auswahl", stufe: "d", typ: "maschine", text: `${e.beispiel} Welche einfache Maschine ist das?`, optionen, richtig: optionen.indexOf(e.maschine), loesung: e.maschine,
    weg: `${BEGRUENDUNG[e.maschine]} Das ist ein Beispiel für: ${e.maschine}`, kennung: e.beispiel, daten: { beispiel: e.beispiel } };
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
    gleichfoermig: "Gleichförmig heisst: in gleichen Zeiten gleiche Wege. Im Diagramm ist das eine Gerade ohne Knick.",
    schneller: "Je steiler die Linie, desto mehr Weg in derselben Zeit.",
    darstellen: "Rechne den Weg nach 10 s aus und suche die Linie, die dort endet.",
    "kraft-kg": "Gewichtskraft ist Masse mal zehn Newton pro Kilogramm.",
    "kraft-g": "Gramm zuerst in Kilogramm umrechnen, dann mal zehn Newton pro Kilogramm.",
    masse: "Masse ist Gewichtskraft geteilt durch zehn Newton pro Kilogramm. Ein Kilogramm sind tausend Gramm.",
    "fm-kraft": "Gehe bei der Masse senkrecht hoch bis zur Geraden und lies links die Kraft ab.",
    "fm-masse": "Gehe bei der Kraft waagrecht bis zur Geraden und lies unten die Masse ab.",
    maschine: "Wird etwas wie eine Wippe um einen Drehpunkt gekippt, über eine Rampe bewegt, mit Seil und Rollen gehoben oder über Zahnräder oder eine Kette angetrieben?",
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
  if (["gleichfoermig", "schneller", "darstellen"].includes(a.typ)) {
    // Linien unabhängig nachrechnen (E7-1 a): Steigungen je Abschnitt; gleichförmig = alle gleich und positiv
    const L = d.linien, steig = l => l.punkte.slice(1).map((p, i) => (p[1] - l.punkte[i][1]) / (p[0] - l.punkte[i][0]));
    const gleich = l => { const s = steig(l); return s.every(x => x > 0 && Math.abs(x - s[0]) < 1e-9); };
    const ende = l => l.punkte[l.punkte.length - 1];
    if (JSON.stringify(a.optionen) !== JSON.stringify(L.map(l => l.name))) m.push(`Antworten passen nicht zu den Linien: ${a.optionen.join(", ")}`);
    if (JSON.stringify(a.darstellung.linien) !== JSON.stringify(L)) m.push("Bild zeigt andere Linien als die Daten");
    for (const l of L) {
      if (l.punkte[0][0] !== 0 || l.punkte[0][1] !== 0) m.push(`Linie ${l.name} beginnt nicht im Ursprung`);
      const [xe, ye] = ende(l);
      if (xe !== a.darstellung.x[1] || ye > a.darstellung.y[1] || ye <= 0) m.push(`Linie ${l.name} endet ausserhalb des Gitters`);
    }
    const enden = L.map(l => ende(l)[1]);
    if (new Set(enden).size !== enden.length || Math.min(...enden.slice(1).map((y, i) => Math.abs(y - enden[i]))) <= 0) m.push("zwei Linien enden am selben Ort");
    if (enden.some((y, i) => enden.some((z2, j) => j !== i && Math.abs(y - z2) < a.darstellung.schrittY - 1e-9))) m.push("Namen zweier Linien überdecken sich (weniger als ein Gitterschritt)");
    let soll;
    if (a.typ === "gleichfoermig") { const g = L.filter(gleich); if (g.length !== 1) m.push(`${g.length} gleichförmige Linien`); soll = g[0] && g[0].name; }
    else {
      if (!L.every(gleich)) m.push("nicht alle Linien gleichförmig");
      const v = L.map(l => steig(l)[0]);
      if (a.typ === "schneller") { const mx = Math.max(...v); if (v.filter(x => Math.abs(x - mx) < 1e-9).length !== 1) m.push("zwei gleich schnelle"); soll = L[v.indexOf(mx)].name; }
      else {
        if (!a.text.includes(`${LST.dezimalText(d.v)} m/s`)) m.push(`Text nennt nicht ${d.v} m/s: ${a.text}`);
        const t = L.filter((l, i) => Math.abs(v[i] - d.v) < 1e-9); if (t.length !== 1) m.push(`${t.length} Linien mit ${d.v} m/s`); soll = t[0] && t[0].name;
      }
    }
    if (a.optionen[a.richtig] !== soll || a.loesung !== soll) m.push(`richtig wäre ${soll}: ${a.text}`);
    return m;
  }
  if (a.art === "auswahl") {
    const e = MASCHINEN.beispiele.find(x => x.beispiel === d.beispiel);
    if (!e || a.optionen[a.richtig] !== e.maschine) m.push(`Zuordnung falsch: ${a.text}`);
    if (!MASCHINEN.namen.includes(e && e.maschine)) m.push(`unbekannte Maschine: ${e && e.maschine}`);
    if (e && !BEGRUENDUNG[e.maschine]) m.push(`keine Begründung für ${e.maschine}`);
    if (e && /Kurbel|Winde|Keil/.test(e.beispiel)) m.push(`Wellrad oder Keil im Beispiel (KR1 a): ${e.beispiel}`);
    return m;
  }
  const soll = {
    "v-diagramm": () => a.darstellung.y[1] / a.darstellung.x[1], "weg-nach": () => (a.darstellung.y[1] / a.darstellung.x[1]) * d.t,
    "kraft-kg": () => d.m * 10, "kraft-g": () => d.m * 10, masse: () => (d.einheit === "g" ? d.F * 100 : d.F / 10),
    "fm-kraft": () => d.m * 10, "fm-masse": () => d.F / 10,
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
  // Kraftmesser (E7-2 a): Messbereich aus der Liste, Anzeige darin; Diagramm: Messpunkte auf der Geraden, Wert im Gitter
  if (d.bereich !== undefined) {
    const F = a.typ === "masse" ? d.F : d.m * 10;
    if (!BEREICHE.includes(d.bereich) || F > d.bereich || !a.text.includes(`bis ${d.bereich} N`)) m.push(`Kraftmesser bis ${d.bereich} N passt nicht zu ${F} N: ${a.text}`);
    if (a.typ === "masse" && a.einheit !== (d.F < 10 ? "g" : "kg")) m.push(`Einheit ${a.einheit} bei ${d.F} N`);
  } else if (a.typ === "kraft-g" || a.typ === "masse") m.push(`Kraftmesser ohne Messbereich: ${a.text}`);
  if (a.typ === "fm-kraft" || a.typ === "fm-masse") {
    const D = a.darstellung, w = a.typ === "fm-kraft" ? d.m : d.F / 10;
    if (D.m !== 10 || D.b !== 0 || !D.punkte.every(p => p.y === p.x * 10)) m.push("Diagramm nicht proportional mit 10 N/kg");
    if (w <= 0 || w > D.x[1] || w * 10 > D.y[1]) m.push(`Wert ausserhalb des Diagramms: ${a.text}`);
  }
  if (a.typ === "kraft-kg" && /Kraftmesser/.test(a.text)) m.push("Kraftmesser bei Alltagsmasse");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
