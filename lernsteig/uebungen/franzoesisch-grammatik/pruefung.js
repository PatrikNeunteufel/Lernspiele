/* Prüfansicht der Liste „Sätze“ (Französisch, LK1 a, LERN_Session24; Aufbau in kern/listenpruefung.js).
   Lücke oder ganzer Satz: die richtige Antwort steht in der Liste zuerst, die falschen danach. */
"use strict";
LST.listenPruefung("franzoesisch-grammatik", {
  franzoesisch: {
    beschreibung: "Sätze je Stufe, gruppiert nach Thema: richtige Antwort und Ablenker. Genau eine Antwort darf richtig sein.",
    abschnitte: Object.keys(FRANZOESISCH).map(s => ({
      id: `stufe-${s}`, titel: `Stufe ${s}: ${UEBUNG.stufen[s] || ""}`, spalten: ["Satz", "richtig", "falsch"],
      eintraege: () => FRANZOESISCH[s],
      zeile: e => [e.art === "satz" ? "(ganzer Satz)" : e.satz, e.optionen[0], e.optionen.slice(1).join(" / ")], gruppe: e => e.thema,
    })),
  },
});
