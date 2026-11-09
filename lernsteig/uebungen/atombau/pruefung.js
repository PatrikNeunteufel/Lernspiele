/* Prüfansicht der Liste „Elemente 1 bis 20“ (LK1 a, LERN_Session24; Aufbau in kern/listenpruefung.js). */
"use strict";
LST.listenPruefung("atombau", {
  pse: {
    beschreibung: "Elemente mit Ordnungszahl, Symbol, Name, Massenzahl des häufigsten Isotops und Art; dazu die weiteren Halbmetalle der Challenge und die Isotope der Stufe c. Abgleichen mit dem Periodensystem des Lehrmittels.",
    abschnitte: [
      { id: "elemente", titel: "Elemente 1 bis 20", spalten: ["OZ", "Symbol", "Name", "Massenzahl", "Art"], eintraege: () => PSE.elemente,
        zeile: e => [e.oz, e.symbol, e.name, e.masse, e.art] },
      { id: "weitere", titel: "Weitere Halbmetalle (nur Challenge)", spalten: ["OZ", "Symbol", "Name", "Art"], eintraege: () => PSE.weitere,
        zeile: e => [e.oz, e.symbol, e.name, e.art] },
      { id: "isotope", titel: "Isotope (Stufe c)", spalten: ["Element", "Massenzahl"], eintraege: () => PSE.isotope,
        zeile: i => [(PSE.elemente.find(e => e.oz === i.oz) || {}).name || i.oz, i.masse] },
    ],
  },
});
