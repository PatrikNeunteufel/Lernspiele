/* Übung „English grammar“ — FS1E.5.D.1 (Grammatik), Stufen b, c, d. Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/sprachen_zyklus3.md, Abschnitt 4 (Grammatik 5.D.1):
   b  (GA Z2 in Englisch) Konjugation wichtiger Verben, Personalpronomen als Subjekt, Frage mit Fragewort
   c  (GA, OP) Wortfolge in Aussage und Frage, Verben mit zwei Objekten, unregelmässiger Plural, häufige Präpositionen
   d  Hilfs- und Modalverben, Negation, Demonstrativ- und Reflexivpronomen; im Text: Zeitformen, Possessivpronomen,
      begründende Konjunktionen
   Die Sätze stehen in englisch.js (Inhaltsliste, ungeprüft). Anweisungen auf Deutsch, Sätze auf Englisch. */
"use strict";

const UEBUNG = {
  id: "englisch-grammatik",
  einleitung: "Choose the correct answer. Wähle die richtige Antwort.",
  stufen: {
    b: "to be, to have, Subjektpronomen, Fragewörter",
    c: "Wortstellung, zwei Objekte, unregelmässige Mehrzahl, Präpositionen",
    d: "Modalverben, Verneinung, Pronomen, Zeitformen, because und so",
    challenge: "Alles gemischt",
  },
};

const REGEL = {
  be: "to be: I am, you/we/they are, he/she/it is.",
  have: "to have: he/she/it has, sonst have.",
  "pronomen-subjekt": "Subjektpronomen: I, you, he, she, it, we, they.",
  fragewort: "Fragewörter: who (wer), what (was), where (wo), when (wann), why (warum), how (wie).",
  "wortfolge-frage": "Frage mit do/does: Fragewort + do/does + Subjekt + Verb.",
  "wortfolge-aussage": "Aussage: Subjekt + Verb + Objekt; often steht vor dem Verb, Zeitangaben meist am Ende.",
  "zwei-objekte": "Zwei Objekte ohne «to»: Person zuerst, dann die Sache (give someone something).",
  plural: "Unregelmässige Mehrzahl: child → children, foot → feet, woman → women, mouse → mice.",
  praeposition: "on mit Tagen, in mit Monaten, at mit Uhrzeiten; on = auf.",
  modal: "Modalverben (must, can) haben kein -s und stehen ohne «to» vor dem Verb.",
  negation: "Verneinung: doesn't (he/she/it), didn't (Vergangenheit), aren't/isn't bei -ing-Formen.",
  reflexiv: "Reflexivpronomen: myself, yourself, himself, herself, itself, ourselves, themselves.",
  demonstrativ: "this/these = hier (nah), that/those = dort (fern); these/those in der Mehrzahl.",
  possessiv: "my, your, their vor dem Nomen; mine, yours, theirs allein.",
  konjunktion: "because = weil (Grund), so = deshalb (Folge).",
  zeitform: "am/is/are + -ing = present progressive; Grundform (he/she/it mit -s) = simple present; has/have + 3. Form = present perfect; was/were + -ing = past progressive; 2. Form = simple past.",
};

function aufgabe(stufe, e) {
  const opt = LST.mische(e.optionen);
  const richtig = e.optionen[0];
  const istSatz = e.art === "satz";
  return { art: "auswahl", stufe, typ: e.thema, text: istSatz ? "Which sentence is correct? Welcher Satz ist richtig?" : e.satz, optionen: opt, richtig: opt.indexOf(richtig),
    loesung: richtig, weg: `${istSatz ? richtig : e.satz.replace("___", richtig)} — ${REGEL[e.thema]}`,
    kennung: istSatz ? `satz ${richtig}` : `${e.satz} ${richtig}`, daten: { eintrag: e } };
}

function aufgabeErzeugen(stufe, niveau) {
  const L = ENGLISCH;
  if (stufe === "challenge") return aufgabe("challenge", LST.waehle(L.b.concat(L.c, L.d)));
  if (!L[stufe]) throw new Error(`englisch-grammatik: keine Stufe ${stufe}`);
  return aufgabe(stufe, LST.waehle(L[stufe]));
}

function hinweis(a, gewaehlt) {
  const frage = {
    be: "Wer ist das Subjekt: ich, eine Person oder mehrere?", have: "Ist das Subjekt he, she oder it?",
    "pronomen-subjekt": "Wer tut etwas? Ein Mädchen, ein Junge oder mehrere?", fragewort: "Was wird gefragt: eine Person, ein Ort, eine Zeit, ein Alter?",
    "wortfolge-frage": "Braucht die Frage do oder does? Wo steht dann das Subjekt?", "wortfolge-aussage": "Subjekt, Verb, Objekt — wo stehen Häufigkeit und Zeit?",
    "zwei-objekte": "Wer bekommt etwas, und was? Was kommt zuerst, wenn kein «to» steht?", plural: "Diese Mehrzahl ist unregelmässig: kein -s.",
    praeposition: "Tag, Monat oder Uhrzeit? Oder ein Ort?", modal: "Bekommt ein Modalverb ein -s? Braucht es «to»?",
    negation: "Welche Zeit, welche Person, welche Verbform folgt?", reflexiv: "Wer ist gemeint? Die Person tut es sich selbst.",
    demonstrativ: "Nah oder fern? Eins oder mehrere?", possessiv: "Steht danach ein Nomen oder nicht?",
    konjunktion: "Folgt ein Grund oder eine Folge?", zeitform: "Welche Hilfsverben und welche Verbform stehen da?",
  };
  return frage[a.typ] || "Look at the sentence again.";
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const e = a.daten.eintrag;
  if (!REGEL[e.thema]) m.push(`unbekanntes Thema ${e.thema}`);
  if (new Set(e.optionen).size !== e.optionen.length) m.push(`doppelte Antworten: ${e.optionen.join(" | ")}`);
  if (a.optionen[a.richtig] !== e.optionen[0]) m.push("richtige Antwort falsch markiert");
  if (e.art !== "satz" && (e.satz.match(/___/g) || []).length !== 1) m.push(`nicht genau eine Lücke: ${e.satz}`);
  if (e.art === "satz") {
    // Satzvarianten: dieselben Wörter (bis auf Hilfswörter to, do/does und die Endung -s/-es), damit nur Form und
    // Stellung geprüft werden. Bis LERN_Session22 genügte eine ähnliche Länge, das liess ein anderes Wort durch.
    const stamm = w => w.replace(/s$/, "").replace(/e$/, "");
    const woerter = s => s.toLowerCase().replace(/[?.!,]/g, "").split(" ").map(stamm).filter(w => !["to", "do"].includes(w)).sort().join(" ");
    const basis = woerter(e.optionen[0]);
    if (e.optionen.some(o => woerter(o) !== basis)) m.push(`Satzvarianten mit anderen Wörtern: ${e.optionen.join(" | ")}`);
  }
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
