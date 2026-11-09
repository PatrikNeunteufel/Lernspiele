/* Prüfansicht der Liste „Sätze“ (Englisch, LK1 a, LERN_Session24; Aufbau in kern/listenpruefung.js).
   Lücke oder ganzer Satz: die richtige Antwort steht in der Liste zuerst, die falschen danach. */
"use strict";
LST.listenPruefung("englisch-grammatik", {
  englisch: {
    beschreibung: "Sätze je Stufe, gruppiert nach Thema: richtige Antwort und Ablenker. Britisches Englisch; genau eine Antwort darf richtig sein.",
    abschnitte: Object.keys(ENGLISCH).map(s => ({
      id: `stufe-${s}`, titel: `Stufe ${s}: ${UEBUNG.stufen[s] || ""}`, spalten: ["Satz", "richtig", "falsch"],
      eintraege: () => ENGLISCH[s],
      zeile: e => [e.art === "satz" ? "(ganzer Satz)" : e.satz, e.optionen[0], e.optionen.slice(1).join(" / ")], gruppe: e => e.thema,
    })),
  },
});
