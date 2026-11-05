/* Übung „Stoffwechsel: Organe und Vorgänge“ — NT.7.2, Stufe a (OP). Aufgaben als Daten, ohne DOM.
   Inhalt nach docs/lernsteig/lehrplan/nt_zyklus3.md, NT.7.2 a, Verbindliche Inhalte (wörtlich auf der Lehrplanseite):
   „Aufnahme: Lunge, Verdauungsorgane; Transport: Blut, Blutkreislauf, Herz; Umwandlung: Leber, Fettgewebe, Knochen,
   Muskeln, Hirn; Abgabe: Niere, Lunge[,] Verdauungsorgane, Haut“ (Quelle: quellen_nt/NT7.2.html).
   Lunge und Verdauungsorgane stehen bei Aufnahme und Abgabe; dafür gibt es die Antwort „Aufnahme und Abgabe“.
   Stufen b und c (Phänomene erklären, Experimente) sind ohne kurze eindeutige Aufgabe. */
"use strict";

const UEBUNG = {
  id: "stoffwechsel",
  einleitung: "Die vier Stoffwechselvorgänge: Aufnahme, Transport, Umwandlung, Abgabe. Welche Organe und Teile des Körpers gehören dazu?",
  stufen: {
    a: "Organ und Stoffwechselvorgang zuordnen",
    challenge: "Was nicht dazugehört; Organe mit zwei Vorgängen",
  },
};

// Wörtlich aus den Verbindlichen Inhalten (Lehrplan Volksschule SG, NT.7.2 a)
const VI = {
  Aufnahme: ["Lunge", "Verdauungsorgane"],
  Transport: ["Blut", "Blutkreislauf", "Herz"],
  Umwandlung: ["Leber", "Fettgewebe", "Knochen", "Muskeln", "Hirn"],
  Abgabe: ["Niere", "Lunge", "Verdauungsorgane", "Haut"],
};
const VORGAENGE = Object.keys(VI);
const ORGANE = [...new Set(Object.values(VI).flat())];
const vorgaengeVon = o => VORGAENGE.filter(v => VI[v].includes(o));
const VORGANG_OPTIONEN = ["Aufnahme", "Transport", "Umwandlung", "Abgabe", "Aufnahme und Abgabe"];
const antwortFuer = o => { const v = vorgaengeVon(o); return v.length === 2 ? "Aufnahme und Abgabe" : v[0]; };

function auswahl(stufe, typ, text, optionen, richtigText, weg, daten) {
  return { art: "auswahl", stufe, typ, text, optionen, richtig: optionen.indexOf(richtigText), loesung: richtigText, weg, kennung: text + optionen.join("|"), daten };
}
function andere(ausschluss, n) { return LST.mische(ORGANE.filter(o => !ausschluss.includes(o))).slice(0, n); }

function stufeA() {
  if (LST.zufall(0, 1)) {
    const o = LST.waehle(ORGANE);
    return auswahl("a", "organ", `Zu welchem Stoffwechselvorgang gehört: ${o}?`, VORGANG_OPTIONEN.slice(), antwortFuer(o), `${o}: ${antwortFuer(o)}`, { organ: o });
  }
  const v = LST.waehle(VORGAENGE), richtig = LST.waehle(VI[v]);
  const optionen = LST.mische([richtig, ...andere(VI[v], 3)]);
  return auswahl("a", "vorgang", `Was gehört zum Vorgang ${v}?`, optionen, richtig, `${v}: ${VI[v].join(", ")}`, { vorgang: v, organ: richtig });
}

function challenge() {
  if (LST.zufall(0, 1)) {
    const v = LST.waehle(VORGAENGE), falsch = LST.waehle(ORGANE.filter(o => !VI[v].includes(o)));
    const drin = LST.mische(VI[v]).slice(0, 3);
    const optionen = LST.mische([falsch, ...drin]);
    return auswahl("challenge", "nicht", `Was gehört NICHT zum Vorgang ${v}?`, optionen, falsch, `${v}: ${VI[v].join(", ")}; ${falsch} nicht`, { vorgang: v, organ: falsch, nicht: true });
  }
  const zwei = LST.waehle(ORGANE.filter(o => vorgaengeVon(o).length === 2));
  const optionen = LST.mische([zwei, ...andere(ORGANE.filter(o => vorgaengeVon(o).length === 2), 3)]);
  return auswahl("challenge", "zwei", "Was gehört zu zwei Stoffwechselvorgängen?", optionen, zwei, `${zwei}: ${vorgaengeVon(zwei).join(" und ")}`, { organ: zwei, zwei: true });
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "a") return stufeA();
  if (stufe === "challenge") return challenge();
  throw new Error(`stoffwechsel: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  return {
    organ: "Nimmt das Organ etwas in den Körper auf, bringt es Stoffe an einen anderen Ort, baut es Stoffe um oder gibt es Stoffe ab?",
    vorgang: "Überlege, welches Organ genau diese Aufgabe im Körper übernimmt.",
    nicht: "Drei der Organe übernehmen diese Aufgabe. Welches macht etwas anderes?",
    zwei: "Ein Organ nimmt Stoffe auf und gibt auch Stoffe ab.",
  }[a.typ];
}

// Prüfung direkt gegen die Liste des Lehrplans
function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten, r = a.optionen[a.richtig];
  if (new Set(a.optionen).size !== a.optionen.length) m.push("doppelte Optionen");
  if (a.typ === "organ") {
    const v = VORGAENGE.filter(x => VI[x].includes(d.organ));
    const soll = v.length === 2 ? "Aufnahme und Abgabe" : v[0];
    if (r !== soll) m.push(`${d.organ}: ${r} statt ${soll}`);
  } else if (a.typ === "vorgang") {
    const passend = a.optionen.filter(o => VI[d.vorgang].includes(o));
    if (passend.length !== 1 || passend[0] !== r) m.push(`nicht genau eine passende Option: ${a.optionen.join(", ")}`);
  } else if (a.typ === "nicht") {
    const fremd = a.optionen.filter(o => !VI[d.vorgang].includes(o));
    if (fremd.length !== 1 || fremd[0] !== r) m.push(`nicht genau eine fremde Option: ${a.optionen.join(", ")}`);
  } else {
    const doppelt = a.optionen.filter(o => VORGAENGE.filter(x => VI[x].includes(o)).length === 2);
    if (doppelt.length !== 1 || doppelt[0] !== r) m.push(`nicht genau ein Organ mit zwei Vorgängen: ${a.optionen.join(", ")}`);
  }
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
