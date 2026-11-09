/* Prüfansicht der Liste „Einfache Maschinen“ (LK1 a, LERN_Session24; Aufbau in kern/listenpruefung.js). */
"use strict";
LST.listenPruefung("kraefte", {
  maschinen: {
    beschreibung: "Beispiele der Stufe d mit der einfachen Maschine, die sie zeigen. Je Beispiel muss genau eine Maschine passen (ohne Wellrad und Keil, KR1 a).",
    abschnitte: [
      { id: "namen", titel: "Maschinen (Antworten)", spalten: ["Maschine"], eintraege: () => MASCHINEN.namen, zeile: n => [n] },
      { id: "beispiele", titel: "Beispiele", spalten: ["Beispiel", "Maschine"], eintraege: () => MASCHINEN.beispiele,
        zeile: b => [b.beispiel, b.maschine], gruppe: b => b.maschine },
    ],
  },
});
