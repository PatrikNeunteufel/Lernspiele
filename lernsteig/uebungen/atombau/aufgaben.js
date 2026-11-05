/* Übung „Atombau und Periodensystem“ — NT.3.2, Stufen a, c, d. Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/nt_zyklus3.md, NT.3.2:
   a  Informationen zu den Elementen aus dem PSE herauslesen. VI: Metalle, Nichtmetalle, Edelgase
   c  Atome mit dem Kern-Hülle-Modell darstellen, Protonen und Neutronen als Kernbausteine. VI: Ordnungszahl, Atommasse,
      Hauptgruppen; Isotop
   d  Zusammenhänge zwischen Schalenmodell und PSE. VI: Schalenmodell, Wertigkeit, Edelgasregel
   Stufe b (GA, OP: Reaktion im Teilchenmodell, Energiediagramme) braucht Bilder und folgt später; e (Bindungsarten)
   ebenso. Elementdaten in pse.js (ungeprüft). Annahmen, mit dem Lehrmittel abzugleichen: Massenzahl statt Atommasse
   (ganzzahlig); Schalen für die Elemente 1 bis 20 mit 2, 8, 8, 2 Plätzen; Ionen nach der Edelgasregel für die
   Hauptgruppen I bis III und V bis VII. */
"use strict";

const UEBUNG = {
  id: "atombau",
  einleitung: "Lies aus dem Periodensystem: Elemente 1 bis 20.",
  stufen: {
    a: "Metall, Nichtmetall oder Edelgas?",
    c: "Protonen, Neutronen, Elektronen; Isotope",
    d: "Schalenmodell, Aussenelektronen, Edelgasregel",
    challenge: "Ionen: Ladung und Elektronen nach der Edelgasregel",
  },
};

const ARTEN = ["Metall", "Nichtmetall", "Edelgas"];
const ARTID = { Metall: "metall", Nichtmetall: "nichtmetall", Edelgas: "edelgas" };
const el = () => LST.waehle(PSE.elemente);
const nenn = e => `${e.name} (${e.symbol}, Ordnungszahl ${e.oz})`;

function zahl(stufe, typ, text, antwort, weg, daten) {
  const t = (typ === "ladung" && antwort > 0 ? "+" : "") + LST.zahlText(antwort); // Minus als „−“ (MZ1 a), Ladung mit Vorzeichen
  return { art: "zahl", stufe, typ, text, antwort, loesung: t, weg: `${weg} = ${t}`, kennung: text, daten };
}

function stufeA() {
  const e = el();
  const optionen = ARTEN.slice();
  const richtig = optionen.findIndex(o => ARTID[o] === e.art);
  return { art: "auswahl", stufe: "a", typ: "art", text: `Ist ${e.name} (${e.symbol}) ein Metall, ein Nichtmetall oder ein Edelgas?`, optionen, richtig,
    loesung: optionen[richtig], weg: `${e.name}: ${optionen[richtig]}`, kennung: e.symbol, daten: { oz: e.oz } };
}

function stufeC() {
  const typ = LST.waehle(["protonen", "elektronen", "neutronen", "neutronen", "isotop"]);
  if (typ === "isotop") {
    const i = LST.waehle(PSE.isotope), e = PSE.elemente.find(x => x.oz === i.oz);
    return zahl("c", typ, `Das Isotop ${e.name}-${i.masse} hat die Massenzahl ${i.masse}. Wie viele Neutronen hat es im Kern?`, i.masse - e.oz, `${i.masse} − ${e.oz}`, { oz: e.oz, masse: i.masse });
  }
  const e = el();
  if (typ === "protonen") return zahl("c", typ, `Wie viele Protonen hat ein Atom ${nenn(e).replace(/, Ordnungszahl \d+/, "")}?`, e.oz, `Ordnungszahl von ${e.symbol}`, { oz: e.oz });
  if (typ === "elektronen") return zahl("c", typ, `Wie viele Elektronen hat ein ungeladenes Atom ${e.name} (${e.symbol})?`, e.oz, `so viele wie Protonen: Ordnungszahl`, { oz: e.oz });
  return zahl("c", typ, `${nenn(e)} hat die Massenzahl ${e.masse}. Wie viele Neutronen hat der Kern?`, e.masse - e.oz, `${e.masse} − ${e.oz}`, { oz: e.oz, masse: e.masse });
}

// Schalen nach Regel (2, 8, 8, …) — Generator; die Prüfung rechnet unabhängig über Perioden nach
function schalen(oz) { const plaetze = [2, 8, 8, 2]; const s = []; let rest = oz; for (const p of plaetze) { if (rest <= 0) break; s.push(Math.min(p, rest)); rest -= p; } return s; }

function stufeD() {
  const typ = LST.waehle(["aussen", "aussen", "schalen", "gruppe"]);
  const e = el();
  const s = schalen(e.oz);
  if (typ === "aussen") return zahl("d", typ, `Wie viele Aussenelektronen hat ein Atom ${e.name} (${e.symbol}, Ordnungszahl ${e.oz})?`, s[s.length - 1], `Besetzung ${s.join(", ")}, auf der äussersten Schale`, { oz: e.oz, was: "aussen" });
  if (typ === "schalen") return zahl("d", typ, `Auf wie viele Schalen verteilen sich die Elektronen von ${e.name} (${e.symbol}, Ordnungszahl ${e.oz})?`, s.length, `Besetzung ${s.join(", ")}, Anzahl Schalen`, { oz: e.oz, was: "anzahl" });
  const hg = e.art === "edelgas" ? 8 : s[s.length - 1];
  return zahl("d", typ, `In welcher Hauptgruppe steht ${e.name} (${e.symbol}, Ordnungszahl ${e.oz})? Gib die Nummer an.`, hg, e.art === "edelgas" ? "Edelgase: Hauptgruppe VIII" : `${s[s.length - 1]} Aussenelektronen, Hauptgruppe`, { oz: e.oz, was: "gruppe" });
}

function challenge() {
  for (;;) {
    const e = el(), s = schalen(e.oz), a = s[s.length - 1];
    if (e.art === "edelgas" || e.oz === 1 || e.oz === 2 || a === 4) continue; // H, Edelgase und Hauptgruppe IV ohne einfaches Ion
    const ladung = a <= 3 ? a : a - 8;
    const typ = LST.zufall(0, 1) ? "ladung" : "ionen-elektronen";
    if (typ === "ladung") return zahl("challenge", typ, `Welche Ladung hat das Ion von ${e.name} (${e.symbol}, Ordnungszahl ${e.oz}) nach der Edelgasregel? Gib die Zahl mit Vorzeichen an.`,
      ladung, `${a} Aussenelektronen: ${ladung > 0 ? `${a} abgeben` : `${8 - a} aufnehmen`}, Ladung`, { oz: e.oz, was: "ladung" });
    return zahl("challenge", typ, `Wie viele Elektronen hat das Ion von ${e.name} (${e.symbol}, Ordnungszahl ${e.oz}) nach der Edelgasregel?`,
      e.oz - ladung, `${e.oz} ${ladung > 0 ? "−" : "+"} ${Math.abs(ladung)}`, { oz: e.oz, was: "ionen-e" });
  }
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "a") return stufeA();
  if (stufe === "c") return stufeC();
  if (stufe === "d") return stufeD();
  if (stufe === "challenge") return challenge();
  throw new Error(`atombau: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    art: "Metalle stehen links und in der Mitte, Nichtmetalle rechts oben, Edelgase ganz rechts.",
    protonen: "Die Ordnungszahl sagt, wie viele Protonen im Kern sind.",
    elektronen: "Ein ungeladenes Atom hat gleich viele Elektronen wie Protonen.",
    neutronen: "Massenzahl minus Ordnungszahl gibt die Neutronen.",
    isotop: "Isotope haben gleich viele Protonen, aber verschieden viele Neutronen: Massenzahl minus Ordnungszahl.",
    aussen: "Verteile die Elektronen: erste Schale höchstens zwei, dann je acht. Zähle die auf der äussersten.",
    schalen: "Erste Schale höchstens zwei, die nächsten je acht. Wie viele Schalen werden gebraucht?",
    gruppe: "Die Hauptgruppe entspricht der Zahl der Aussenelektronen; Edelgase stehen in der letzten.",
    ladung: "Wenige Aussenelektronen werden abgegeben (positiv), fast volle Schalen nehmen auf (negativ).",
    "ionen-elektronen": "Zuerst die Ladung nach der Edelgasregel; abgegebene Elektronen fehlen, aufgenommene kommen dazu.",
  };
  return h[a.typ] || "Schau im Periodensystem nach.";
}

// Prüfung: Periode und Stellung unabhängig vom Generator (Periodenlängen 2, 8, 8, …)
function lage(oz) { const laengen = [2, 8, 8, 18]; let start = 0; for (let p = 0; p < laengen.length; p++) { if (oz <= start + laengen[p]) return { periode: p + 1, stelle: oz - start, laenge: laengen[p] }; start += laengen[p]; } }
function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten, e = PSE.elemente.find(x => x.oz === d.oz);
  if (!e) return ["Element fehlt in pse.js"];
  const l = lage(d.oz);
  // Aussenelektronen = Stellung in der Periode (Hauptgruppenelemente 1 bis 20; K und Ca am Anfang von Periode 4)
  const aussen = l.stelle;
  if (a.art === "auswahl") {
    const edel = (l.periode === 1 && l.stelle === 2) || (l.periode > 1 && l.stelle === 8);
    if (edel !== (e.art === "edelgas")) m.push(`Edelgas-Kennzeichnung passt nicht zur Stellung: ${e.name}`);
    if (ARTID[a.optionen[a.richtig]] !== e.art) m.push(`Auswahl passt nicht zur Liste: ${e.name}`);
    return m;
  }
  const soll = {
    protonen: () => d.oz, elektronen: () => d.oz, neutronen: () => d.masse - d.oz, isotop: () => d.masse - d.oz,
    aussen: () => aussen, schalen: () => l.periode, gruppe: () => (e.art === "edelgas" ? 8 : aussen),
    ladung: () => (aussen <= 3 ? aussen : aussen - 8), "ionen-elektronen": () => d.oz - (aussen <= 3 ? aussen : aussen - 8),
  }[a.typ];
  if (!soll) return [`unbekannter Typ ${a.typ}`];
  if (soll() !== a.antwort) m.push(`Antwort ${a.antwort}, nachgerechnet ${soll()}: ${a.text}`);
  if (a.typ === "isotop" && d.masse === e.masse) m.push("Isotop gleich dem häufigsten");
  if (d.masse !== undefined && d.masse <= d.oz && d.oz > 1) m.push("Massenzahl zu klein");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
