/* Prüfansicht des Hör-Reporters (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „berichte“ mit zwei Inhalten, je für sich abzuhaken: die Berichte, die die Eule vorliest, und die Fragen
   zu jedem Bericht. Ein Bericht hat fünf oder sechs Fragen; stünde er in jeder Fragezeile, wäre die Ansicht kaum
   lesbar. Darum steht er einmal im Abschnitt „Berichte“, die Fragen stehen je Bericht in einer Gruppe mit seinem
   Titel. Der Fingerabdruck einer Frage nimmt den Bericht mit: Ändert sich der Text, ist auch der Haken seiner Fragen
   weg — ob eine Antwort aus dem Gehörten folgt, hängt am Text.
   Das Spiel mischt nur die Antworten und wählt je Stufe einige Fragen nach ihrer Art aus (STUFE.plaetze in
   index.html); die Spalte „gestellt in“ rechnet daraus, in welchen Stufen eine Frage dieser Art drankommen kann.
   Zu prüfen: Stimmen die Sachangaben (Vortrag, Wetter), steht die Antwort bei wer/wo/wann/was/warum hörbar im Bericht,
   folgt sie bei „Schluss“ eindeutig aus dem Gehörten, stimmt die Rechnung bei „Zahl“, fasst „Kern“ den ganzen Bericht
   zusammen — und ist kein Ablenker auch richtig? */
"use strict";
{
  const ART = { wer: "Wer?", wo: "Wo?", wann: "Wann?", was: "Was?", warum: "Warum?", schluss: "Schluss (steht nicht wörtlich da)",
    zahl: "Zahl (auch gerechnet)", kern: "Kern (das Wichtigste)" };
  const GRUPPE = { 1: "kurze Berichte", 2: "mittlere Berichte, etwas steht nur zwischen den Zeilen", 3: "lange Berichte, Vorträge und Durchsagen mit Zahlen" };
  const nr = stufen => (stufen.length ? `${stufen.length > 1 ? "Stufen" : "Stufe"} ${stufen.map(s => s.slice(1)).join(", ")}` : "keine Stufe");
  /** Stufen, die Berichte einer Gruppe ziehen — aus STUFE des Spiels. */
  const stufenDerGruppe = g => Object.keys(STUFE).filter(s => STUFE[s].gruppe === g);
  /** Stufen, in denen eine Frage dieser Art zu einem Bericht der Gruppe drankommen kann. */
  const stufenDerArt = (g, art) => stufenDerGruppe(g).filter(s => STUFE[s].plaetze.some(arten => arten.includes(art)));
  const gruppeText = g => `Gruppe ${g}: ${GRUPPE[g] || ""} (${nr(stufenDerGruppe(g))})`;
  const bericht = titel => HOER_BERICHTE.find(b => b.titel === titel);
  const beschreibungStufen = Object.entries(STUFE).map(([s, p]) => `Stufe ${s.slice(1)}: Gruppe ${p.gruppe}, ${p.plaetze.length} Fragen`
    + `${p.vorher ? ", die Fragen stehen schon vor dem Hören da" : ""}`).join("; ");
  LS.listenPruefung("hoer-reporter", {
    berichte: {
      beschreibung: "Kurze Berichte, Durchsagen und Vorträge zum Vorlesen. Die Eule liest einen Bericht vor (ohne deutsche Stimme "
        + "oder mit Ton aus liest das Kind ihn selbst), danach beantwortet das Kind einige Fragen dazu, je drei Antworten. "
        + `${beschreibungStufen}. Stufe 2 fragt dazu Warum?, Stufen 3 und 4 auch nach dem, was man erschliessen muss, `
        + "Stufen 5 und 6 nach Zahlen, Stufe 6 nach dem Wichtigsten.",
      abschnitte: [{
        id: "berichte", titel: "Berichte", spalten: ["Titel", "Bericht"],
        hinweis: "Je Gruppe des Spiels (Länge, Stufen) eine Gruppe. Ist der Bericht gut zu verstehen, wenn man ihn nur hört (Uhrzeiten so geschrieben, wie "
          + "man sie spricht: „9 Uhr 22“)? Stimmen die Sachangaben? Namen sind erfunden, Orte allgemein, keine echten Fahrpläne.",
        eintraege: () => HOER_BERICHTE, gruppe: b => gruppeText(b.gruppe),
        zeile: b => [b.titel, b.text],
      }, {
        id: "fragen", titel: "Fragen zu den Berichten", spalten: ["Art", "Frage", "richtig", "Ablenker", "gestellt in"],
        hinweis: "Je Bericht eine Gruppe; den Text dazu im Abschnitt „Berichte“ nachlesen. Wer/Wo/Wann/Was/Warum: Die Antwort "
          + "kommt im Bericht vor. Schluss: steht nicht wörtlich da, folgt aber eindeutig aus dem Gehörten. Zahl: Zahl oder Zeit "
          + "stimmt, auch wenn man rechnen muss. Kern: fasst den ganzen Bericht zusammen, die Ablenker sind nur Einzelheiten oder "
          + "falsch. Kein Ablenker darf auch richtig sein.",
        eintraege: () => HOER_BERICHTE.flatMap(b => b.fragen.map(frage => ({ titel: b.titel, text: b.text, frage }))),
        gruppe: e => `Gruppe ${bericht(e.titel).gruppe} · ${e.titel}`,
        zeile: ({ titel, frage: [art, frage, richtig, ...falsch] }) =>
          [ART[art] || art, frage, richtig, falsch.join(" · "), nr(stufenDerArt(bericht(titel).gruppe, art))],
      }],
    },
  });
}
