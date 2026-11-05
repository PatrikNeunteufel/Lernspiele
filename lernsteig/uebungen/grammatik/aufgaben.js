/* Übung „Grammatik: Fälle, Wortarten, Formen“ — D.5.D.1, Stufen e, f, g. Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/sprachen_zyklus3.md, D.5.D.1:
   e  (GA, OP) vier Fälle in typischen Fällen mit der Ersatzprobe
   f  Wortarten Nomen, Verb, Adjektiv, Pronomen, Partikel; Präsens, Präteritum, Perfekt, Futur (dazu Plusquamperfekt
      aus Stufe d)
   g  Indikativ, Imperativ, Konjunktiv I und II, Aktiv und Passiv; Subjekt und Objekt unterscheiden
   Die Sätze stehen in grammatik.js (Inhaltsliste, ungeprüft). Antworten zum Auswählen. */
"use strict";

const UEBUNG = {
  id: "grammatik",
  einleitung: "Bestimme das markierte Wort oder die markierte Wortgruppe.",
  stufen: {
    e: "Die vier Fälle (Ersatzprobe)",
    f: "Wortarten und Zeitformen",
    g: "Aktiv und Passiv, Modus, Subjekt und Objekt",
    challenge: "Alles gemischt",
  },
};

const OPTIONEN = {
  fall: ["Nominativ", "Akkusativ", "Dativ", "Genitiv"],
  wortart: ["Nomen", "Verb", "Adjektiv", "Pronomen", "Partikel"],
  zeitform: ["Präsens", "Präteritum", "Perfekt", "Plusquamperfekt", "Futur"],
  genus: ["Aktiv", "Passiv"],
  modus: ["Indikativ", "Imperativ", "Konjunktiv I", "Konjunktiv II"],
  satzglied: ["Subjekt", "Akkusativobjekt", "Dativobjekt", "Genitivobjekt"],
};
const FRAGE = {
  fall: "In welchem Fall steht", wortart: "Welche Wortart ist", zeitform: "In welcher Zeitform steht",
  genus: "Aktiv oder Passiv:", modus: "Welcher Modus:", satzglied: "Welches Satzglied ist",
};

function markiert(e) {
  const w = e.wortImSatz || e.wort;
  return e.satz.replace(w, `«${w}»`);
}

function aufgabe(stufe, e) {
  const opt = OPTIONEN[e.frage];
  const text = `${FRAGE[e.frage]} «${e.wort}»? ${markiert(e)}`;
  return { art: "auswahl", stufe, typ: e.frage, text, optionen: opt.slice(), richtig: opt.indexOf(e.loesung), loesung: e.loesung,
    weg: `«${e.wort}»: ${e.loesung}`, kennung: `${e.satz} | ${e.wort} | ${e.frage}`, daten: { eintrag: e } };
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "challenge") return Object.assign(aufgabe("challenge", LST.waehle(GRAMMATIK.e.concat(GRAMMATIK.f, GRAMMATIK.g))), {});
  if (!GRAMMATIK[stufe]) throw new Error(`grammatik: keine Stufe ${stufe}`);
  return aufgabe(stufe, LST.waehle(GRAMMATIK[stufe]));
}

function hinweis(a, gewaehlt) {
  const h = {
    fall: "Ersatzprobe: Setze «der Mann» ein — der Mann, des Mannes, dem Mann oder den Mann. Welche Form passt in den Satz?",
    wortart: "Proben: Lässt es sich konjugieren? Hat es einen festen Artikel? Lässt es sich steigern? Steht es in der Pronomenliste? Sonst bleibt der Rest.",
    zeitform: "Achte auf die Hilfsverben: Steht haben oder sein dabei, in welcher Form? Steht werden mit dem Infinitiv?",
    genus: "Steht «werden» mit dem Partizip II? Handelt das Subjekt selbst, oder geschieht ihm etwas?",
    modus: "Ist es eine Befehlsform ohne Personalpronomen? Ist es indirekte Rede? Ist es ein Wenn-Satz oder steht «würde»?",
    satzglied: "Frag mit dem Verb: Wer oder was? Wen oder was? Wem? Wessen?",
  };
  return h[a.typ] || "Mach die Probe.";
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const e = a.daten.eintrag;
  const w = e.wortImSatz || e.wort;
  const vorkommen = e.satz.split(w).length - 1;
  if (vorkommen !== 1) m.push(`markiertes Wort „${w}“ kommt ${vorkommen}-mal vor: ${e.satz}`);
  if (!OPTIONEN[e.frage]) m.push(`unbekannte Frage ${e.frage}`);
  else if (!OPTIONEN[e.frage].includes(e.loesung)) m.push(`Lösung „${e.loesung}“ gehört nicht zur Frage ${e.frage}`);
  if (a.optionen[a.richtig] !== e.loesung) m.push("richtige Antwort falsch markiert");
  if (/ß/.test(e.satz)) m.push(`ß im Satz: ${e.satz}`);
  if (e.wortImSatz && !e.wortImSatz.split(" ").every(t => e.wort.split(" ").includes(t) || /\d/.test(t))) m.push("wortImSatz passt nicht zum Wort");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
