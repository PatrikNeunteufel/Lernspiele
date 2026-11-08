/* Übung „Français : grammaire“ — FS2F.5.D.1 (Grammatik), Stufen b, c, d. Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/sprachen_zyklus3.md, Abschnitt 4 (Grammatik 5.D.1):
   b  (nur FR) einfache Strukturen: Konjugation wichtiger Verben, Personalpronomen als Subjekt, Frage mit Fragewort
   c  (GA, OP) Wortfolge in Aussage und Frage, Verben mit zwei Objekten, unregelmässiger Plural, häufige Präpositionen
   d  Hilfs- und Modalverben, Formen der Negation, Demonstrativ- und Reflexivpronomen; im Text: Zeitformen,
      Possessivpronomen, begründende Konjunktionen
   Die Sätze stehen in franzoesisch.js (Inhaltsliste, ungeprüft). Anweisungen auf Deutsch, Sätze auf Französisch.
   Aufbau wie „English grammar“ (gleiche Mechanik, eigene Regeln). */
"use strict";

const UEBUNG = {
  id: "franzoesisch-grammatik",
  einleitung: "Choisis la bonne réponse. Wähle die richtige Antwort.",
  stufen: {
    b: "être, avoir, aller, faire, Verben auf -er, Subjektpronomen, Fragewörter",
    c: "Wortstellung, zwei Objekte, unregelmässige Mehrzahl, Präpositionen",
    d: "devoir und vouloir, Verneinung, ce/cet/cette/ces, Reflexivverben, Possessiv, Zeitformen, parce que und donc",
    challenge: "Alles gemischt",
  },
};

const REGEL = {
  etre: "être: je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont.",
  avoir: "avoir: j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont.",
  aller: "aller: je vais, tu vas, il/elle va, nous allons, vous allez, ils/elles vont.",
  faire: "faire: je fais, tu fais, il/elle fait, nous faisons, vous faites, ils/elles font.",
  "verbe-er": "Verben auf -er: -e, -es, -e, -ons, -ez, -ent.",
  "pronom-sujet": "Subjektpronomen: je, tu, il, elle, on, nous, vous, ils, elles.",
  interrogatif: "Fragewörter: où (wo), quand (wann), qui (wer), comment (wie), combien (wie viel).",
  "ordre-question": "Frage mit «est-ce que»: (Fragewort) + est-ce que + Subjekt + Verb.",
  "ordre-phrase": "Aussage: Subjekt + Verb + Rest; kurze Adverbien wie souvent, toujours, bien stehen direkt nach dem konjugierten Verb.",
  "deux-objets": "Zwei Objekte: zuerst die Sache, dann «à» + Person (donner quelque chose à quelqu'un).",
  pluriel: "Unregelmässige Mehrzahl: -al → -aux, -eau → -eaux, -eu → -eux, œil → yeux.",
  preposition: "en mit weiblichen Ländern, au mit männlichen, à mit Städten; sur = auf.",
  modal: "devoir: je dois, tu dois, il doit, nous devons, vous devez, ils doivent; vouloir: je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent.",
  negation: "Verneinung umschliesst das konjugierte Verb: ne … pas, ne … jamais (n' vor Vokal).",
  demonstratif: "ce vor männlich, cet vor männlich mit Vokal oder stummem h (cet arbre, cet hôtel), cette vor weiblich, ces in der Mehrzahl.",
  reflexif: "Reflexivpronomen: me, te, se, nous, vous, se.",
  possessif: "Der Besitzer bestimmt die Person (mon – ton – son), der Besitz die Form: männlich mon/ton/son, weiblich ma/ta/sa, Mehrzahl mes/tes/ses.",
  temps: "avoir/être + Partizip = passé composé; aller + Infinitiv = futur proche; -ais, -ait = imparfait; Verb allein in der Gegenwart = présent.",
  conjonction: "parce que = weil (Grund), donc = deshalb (Folge).",
};

function aufgabe(stufe, e) {
  const opt = LST.mische(e.optionen);
  const richtig = e.optionen[0];
  const istSatz = e.art === "satz";
  return { art: "auswahl", stufe, typ: e.thema, text: istSatz ? "Quelle phrase est correcte ? Welcher Satz ist richtig?" : e.satz, optionen: opt, richtig: opt.indexOf(richtig),
    loesung: richtig, weg: `${istSatz ? richtig : e.satz.replace("___", richtig)} — ${REGEL[e.thema]}`,
    kennung: istSatz ? `satz ${richtig}` : `${e.satz} ${richtig}`, daten: { eintrag: e } };
}

function aufgabeErzeugen(stufe, niveau) {
  const L = FRANZOESISCH;
  if (stufe === "challenge") return aufgabe("challenge", LST.waehle(L.b.concat(L.c, L.d)));
  if (!L[stufe]) throw new Error(`franzoesisch-grammatik: keine Stufe ${stufe}`);
  return aufgabe(stufe, LST.waehle(L[stufe]));
}

function hinweis(a, gewaehlt) {
  const frage = {
    etre: "Wer ist das Subjekt? Welche Form hat être dazu?", avoir: "Wer ist das Subjekt? Welche Form hat avoir dazu?",
    aller: "Wer ist das Subjekt? aller ist unregelmässig.", faire: "Wer ist das Subjekt? faire ist unregelmässig.",
    "verbe-er": "Welche Endung gehört zum Subjekt?", "pronom-sujet": "Wer tut etwas? Eine Frau, ein Mann oder mehrere — und gehörst du dazu?",
    interrogatif: "Was wird gefragt: ein Ort, eine Zeit, eine Person, ein Preis?", "ordre-question": "Wo steht «est-ce que», und wo stehen Subjekt und Verb?",
    "ordre-phrase": "Subjekt, Verb, Objekt — wo steht das kurze Adverb?", "deux-objets": "Wem gibt man etwas? Welches Wörtchen steht vor der Person?",
    pluriel: "Diese Mehrzahl ist unregelmässig: Wie endet das Wort?", preposition: "Land oder Stadt? Männlich oder weiblich? Oder ein Ort auf etwas?",
    modal: "Wer ist das Subjekt? Welche Form des Verbs gehört dazu?", negation: "Was umschliesst die Verneinung?",
    demonstratif: "Männlich oder weiblich? Beginnt das Nomen mit einem Vokal oder stummem h? Eins oder mehrere?", reflexif: "Wer ist das Subjekt? Das Pronomen passt dazu.",
    possessif: "Wem gehört es, und ist das Nomen männlich, weiblich oder in der Mehrzahl?", temps: "Welche Hilfsverben und Endungen stehen da?",
    conjonction: "Folgt ein Grund oder eine Folge?",
  };
  return frage[a.typ] || "Relis la phrase.";
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const e = a.daten.eintrag;
  if (!REGEL[e.thema]) m.push(`unbekanntes Thema ${e.thema}`);
  if (new Set(e.optionen).size !== e.optionen.length) m.push(`doppelte Antworten: ${e.optionen.join(" | ")}`);
  if (a.optionen[a.richtig] !== e.optionen[0]) m.push("richtige Antwort falsch markiert");
  if (e.art !== "satz" && (e.satz.match(/___/g) || []).length !== 1) m.push(`nicht genau eine Lücke: ${e.satz}`);
  // Französische Typografie: vor ? ! : ein geschütztes Leerzeichen, nie ein normales oder keines
  for (const t of [e.satz || "", ...e.optionen]) if (/[^ ][?!:]/.test(t.replace(/« | »/g, ""))) m.push(`Leerzeichen vor ? ! : fehlt oder ist nicht geschützt: ${t}`);
  if (/ß/.test(JSON.stringify(e))) m.push("ß in der Liste");
  if (e.art === "satz") {
    // Satzvarianten: dieselben Wörter (bis auf que, à und ne/n'), damit nur die Stellung geprüft wird (LERN_Session22,
    // wie in englisch-grammatik)
    const woerter = s => s.toLowerCase().replace(/[?.!,\u00a0]/g, " ").split(/[\s']+/).filter(Boolean)
      .map(w => (w === "n" ? "ne" : w)).filter(w => !["que", "à", "ne"].includes(w)).sort().join(" ");
    const basis = woerter(e.optionen[0]);
    if (e.optionen.some(o => woerter(o) !== basis)) m.push(`Satzvarianten mit anderen Wörtern: ${e.optionen.join(" | ")}`);
  }
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
