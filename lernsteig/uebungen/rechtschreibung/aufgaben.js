/* Übung „Rechtschreibung“ — D.5.E.1 (Rechtschreibregeln in konstruierten Übungen), Stufen d, e, f, g. Ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/sprachen_zyklus3.md, D.5.E.1:
   d  (GA Z2) ie-Regel, f/v, e/ä (Stammregel), Doppelkonsonanten (ck, tz), Grossschreibung, Komma bei Aufzählungen
   e  Morpheme für die Gross- und Kleinschreibung nutzen (Frei-heit)
   f  (GA, OP) nominalisierte Verben nach Präposition + Artikel (beim Essen); Höflichkeitspronomen „Sie“ in Briefen
   g  nominalisierte Adjektive nach Pronomen (alles Gute); Komma bei Infinitivgruppen, Einschüben, Relativsätzen
   Nicht in dieser Übung: Trennregel, Wörterbuch (d, g). Die Sätze stehen in rechtschreibung.js (ungeprüft). */
"use strict";

const UEBUNG = {
  id: "rechtschreibung",
  einleitung: "Wähle die richtige Schreibweise.",
  stufen: {
    d: "ie, f/v, e/ä, ck/tz, Nomen gross, Komma bei Aufzählungen",
    e: "Gross oder klein? Die Nachsilbe hilft (-heit, -ung, -keit, -nis, -schaft, -ig, -lich, -isch)",
    f: "Verben als Nomen (beim Essen), Höflichkeitsform Sie/Ihnen",
    g: "Adjektive als Nomen (alles Gute), Komma bei Relativsatz, Einschub und Infinitivgruppe",
    challenge: "Alles gemischt",
  },
};

const REGEL = {
  ie: "Lang gesprochenes i schreibt man meist ie.",
  fv: "v steht in wenigen Wörtern (Vogel, voll, viel, vor, von …); sonst f.",
  eae: "Stammregel: ä, wenn es ein verwandtes Wort mit a gibt (Blatt → Blätter).",
  cktz: "ck und tz nur nach kurzem Selbstlaut; nach l, n, r nie ck oder tz.",
  gross: "Nomen schreibt man gross — auch abstrakte wie Glück oder Freude.",
  "komma-aufzaehlung": "Bei Aufzählungen steht ein Komma, aber nicht vor «und».",
  "nachmorphem-gross": "Wörter mit -heit, -keit, -ung, -nis, -schaft sind Nomen und werden gross geschrieben.",
  "nachmorphem-klein": "Wörter mit -ig, -lich, -isch sind Adjektive und werden klein geschrieben.",
  "verb-nominalisiert": "Nach Präposition mit Artikel (beim, zum, aufs, vom, nach dem) wird das Verb zum Nomen: gross.",
  "verb-klein": "Ohne Artikel oder Präposition bleibt das Verb ein Verb: klein.",
  hoeflich: "Die Höflichkeitsform Sie, Ihnen, Ihr schreibt man gross.",
  "nicht-hoeflich": "Sie ist hier nicht die Anrede, sondern meint andere Personen: klein.",
  "adjektiv-nominalisiert": "Nach alles, etwas, nichts, viel, das wird das Adjektiv zum Nomen: gross.",
  "komma-relativ": "Ein Relativsatz wird vorne und hinten mit Komma abgetrennt.",
  "komma-einschub": "Ein Einschub (Beisatz) wird vorne und hinten mit Komma abgetrennt.",
  "komma-infinitiv": "Vor einer Infinitivgruppe mit um, ohne, statt oder anstatt steht ein Komma (oder nach ihr, wenn sie vorne steht).",
};

function aufgabe(stufe, e) {
  const opt = LST.mische(e.optionen);
  const richtig = e.optionen[0];
  const istSatz = e.art === "satz";
  const text = istSatz ? "Welcher Satz ist richtig geschrieben?" : e.satz;
  return { art: "auswahl", stufe, typ: e.regel, text, optionen: opt, richtig: opt.indexOf(richtig), loesung: richtig,
    weg: `${istSatz ? richtig : e.satz.replace("___", richtig)} — ${REGEL[e.regel]}`,
    kennung: istSatz ? `satz ${richtig}` : `${e.satz} ${richtig}`, daten: { eintrag: e } };
}

function aufgabeErzeugen(stufe, niveau) {
  const L = RECHTSCHREIBUNG;
  if (stufe === "challenge") return aufgabe("challenge", LST.waehle(L.d.concat(L.e, L.f, L.g)));
  if (!L[stufe]) throw new Error(`rechtschreibung: keine Stufe ${stufe}`);
  return aufgabe(stufe, LST.waehle(L[stufe]));
}

// Hinweis: die Regel als Frage, ohne die Lösung
function hinweis(a, gewaehlt) {
  const frage = {
    ie: "Wird das i lang gesprochen?", fv: "Gehört das Wort zu den wenigen mit v?", eae: "Gibt es ein verwandtes Wort mit a?",
    cktz: "Ist der Selbstlaut davor kurz? Steht davor l, n oder r?", gross: "Kann man einen Artikel davorsetzen?",
    "komma-aufzaehlung": "Wo stehen die Glieder der Aufzählung, und was gilt vor «und»?",
    "nachmorphem-gross": "Welche Nachsilbe hat das Wort, und welche Wortart macht sie daraus?",
    "nachmorphem-klein": "Welche Nachsilbe hat das Wort, und welche Wortart macht sie daraus?",
    "verb-nominalisiert": "Steht davor eine Präposition mit Artikel (beim, zum, aufs, vom, nach dem)?",
    "verb-klein": "Steht davor ein Artikel oder eine Präposition mit Artikel?",
    hoeflich: "Wird hier jemand höflich angesprochen?", "nicht-hoeflich": "Wird hier jemand höflich angesprochen?",
    "adjektiv-nominalisiert": "Steht davor ein Wort wie alles, etwas, nichts oder viel?",
    "komma-relativ": "Wo beginnt und wo endet der Nebensatz?", "komma-einschub": "Wo beginnt und wo endet der Einschub?",
    "komma-infinitiv": "Wo beginnt die Gruppe mit um, ohne oder anstatt … zu?",
  };
  return frage[a.typ] || "Welche Regel passt?";
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const e = a.daten.eintrag;
  if (!REGEL[e.regel]) m.push(`unbekannte Regel ${e.regel}`);
  if (new Set(e.optionen).size !== e.optionen.length) m.push(`doppelte Antworten: ${e.optionen.join(" | ")}`);
  if (a.optionen[a.richtig] !== e.optionen[0]) m.push("richtige Antwort falsch markiert");
  if (/ß/.test(JSON.stringify(e))) m.push("ß in der Liste");
  if (e.art === "satz") {
    const ohne = s => s.replace(/,/g, "");
    if (new Set(e.optionen.map(ohne)).size !== 1) m.push(`Satzvarianten unterscheiden sich nicht nur in den Kommas: ${e.optionen.join(" | ")}`);
  } else {
    if ((e.satz.match(/___/g) || []).length !== 1) m.push(`nicht genau eine Lücke: ${e.satz}`);
    if (/gross|klein|nominalisiert|hoeflich/.test(e.regel) && new Set(e.optionen.map(o => o.toLowerCase())).size !== 1) m.push(`Gross/klein-Varianten verschieden: ${e.optionen.join(" | ")}`);
    if (e.regel === "verb-nominalisiert" && !/\b(beim|zum|aufs|vom|im|ins|am|dem|vielen)\s+___/i.test(e.satz)) m.push(`kein Artikel vor der Lücke: ${e.satz}`);
    if (e.regel === "adjektiv-nominalisiert" && !/\b(alles|etwas|nichts|viel|das)\s+___/i.test(e.satz)) m.push(`kein Pronomen vor der Lücke: ${e.satz}`);
  }
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
