/* Prüfansicht der Liste „Sätze“ der Grammatik (LK1 a, LERN_Session24; Aufbau in kern/listenpruefung.js). */
"use strict";
LST.listenPruefung("grammatik", {
  grammatik: {
    beschreibung: "Sätze je Stufe mit dem markierten Wort, der Frage und der Lösung (Schweizer Schulgrammatik: fünf Wortarten; Artikel als Pronomen, Präpositionen, Konjunktionen und Adverbien als Partikel).",
    abschnitte: Object.keys(GRAMMATIK).map(s => ({
      id: `stufe-${s}`, titel: `Stufe ${s}: ${UEBUNG.stufen[s] || ""}`, spalten: ["Satz", "Wort", "Lösung"],
      eintraege: () => GRAMMATIK[s], zeile: e => [e.satz, e.wort, e.loesung], gruppe: e => e.frage,
    })),
  },
});
