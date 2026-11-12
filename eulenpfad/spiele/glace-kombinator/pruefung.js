/* Prüfansicht des Möglichkeiten-Finders (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Liste ein Abschnitt. Die Sorten zeigen die Kugel, wie das Spiel sie zeichnet (kugel: Farbe, Buchstabe, Schrift
   hell oder dunkel nach der Farbe); die Kleider sind nach ihrer Gruppe geordnet, aus der ein Set genau ein Stück nimmt. */
"use strict";
LS.listenPruefung("glace-kombinator", {
  sorten: {
    beschreibung: "Glacesorten (Stufen 2–6): Das Kind legt oder zählt alle Glaces aus zwei oder drei Kugeln. Der Buchstabe hilft, ähnliche Farben zu unterscheiden.",
    abschnitte: [{
      id: "sorte", titel: "Sorten", spalten: ["Sorte", "Farbe", "Buchstabe"], bild: ([name]) => kugel(name),
      hinweis: "Sieht die Kugel nach der Sorte aus? Jeder Buchstabe kommt nur einmal vor und ist auf der Kugel gut zu lesen.",
      eintraege: () => GLACE_SORTEN, zeile: s => s,
    }],
  },
  kleider: {
    beschreibung: "Kleidungsstücke (Stufen 1 und 2): Das Kind findet alle Sets aus je einem Stück jeder Gruppe.",
    abschnitte: [{
      id: "kleid", titel: "Kleider", spalten: ["Bild", "Name"],
      hinweis: "Je Gruppe eine Gruppe. Passt das Bild zum Namen, und gehört das Stück eindeutig in seine Gruppe?",
      eintraege: () => KLEIDER, gruppe: ([g]) => KLEIDER_GRUPPEN[g]?.name || g, zeile: ([, bild, name]) => [bild, name],
    }],
  },
});
