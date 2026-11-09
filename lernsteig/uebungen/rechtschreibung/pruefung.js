/* Prüfansicht der Liste „Sätze“ der Rechtschreibung (LK1 a, LERN_Session24; Aufbau in kern/listenpruefung.js).
   Lücke oder ganzer Satz: die richtige Antwort steht in der Liste zuerst, die falschen danach. */
"use strict";
LST.listenPruefung("rechtschreibung", {
  rechtschreibung: {
    beschreibung: "Sätze je Stufe, gruppiert nach Regel: richtige Antwort und Ablenker. Schweizer Rechtschreibung (kein ß); genau eine Antwort darf richtig sein.",
    abschnitte: Object.keys(RECHTSCHREIBUNG).map(s => ({
      id: `stufe-${s}`, titel: `Stufe ${s}: ${UEBUNG.stufen[s] || ""}`, spalten: ["Satz", "richtig", "falsch"],
      eintraege: () => RECHTSCHREIBUNG[s],
      zeile: e => [e.art === "satz" ? "(ganzer Satz)" : e.satz, e.optionen[0], e.optionen.slice(1).join(" / ")], gruppe: e => e.regel,
    })),
  },
});
