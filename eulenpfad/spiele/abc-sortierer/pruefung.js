/* Prüfansicht des ABC-Sortierers (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „nomen-bild“ mit einem Inhalt, gruppiert nach dem Anfangsbuchstaben (Wörter mit gleichem Anfang
   entscheiden ab Stufe 3 über den zweiten und dritten Buchstaben). Der Tipp-Trainer leiht die Liste; die Spalte
   „Buchstaben“ zeigt, ob er das Wort kurz (bis 4, Stufe 2) oder lang (ab 5, Stufe 3) nimmt. Zu prüfen: Ist jedes Wort
   ein Nomen in der Schreibweise des Lehrmittels, passt das Bild eindeutig, und denkt kein Kind beim Bild an ein anderes
   Wort mit anderem Anfang? */
"use strict";
{
  const laenge = w => `${w.length}${w.length <= 4 ? " (Tipp-Trainer Stufe 2)" : " (Tipp-Trainer Stufe 3)"}`;
  LS.listenPruefung("abc-sortierer", {
    "nomen-bild": {
      beschreibung: "Nomen mit Bild zum Ordnen nach dem ABC (ABC-Sortierer Stufen 2–6: drei bis sechs Wörter ordnen, ab Stufe 5 Wörterbuch-Seite mit Leitwörtern; Stufe 1 braucht keine Liste). Der Tipp-Trainer leiht die Liste: Das Kind tippt die Wörter mit Grossbuchstaben ab (Stufe 2 kurze, Stufe 3 längere Nomen).",
      abschnitte: [{
        id: "nomen", titel: "Nomen mit Bild", spalten: ["Bild", "Wort", "Buchstaben"],
        hinweis: "Je Anfangsbuchstabe eine Gruppe. Gross geschrieben, ohne Umlaut-Zweifel beim Ordnen; das Bild zeigt genau dieses Ding.",
        eintraege: () => ABC_WOERTER,
        gruppe: ([wort]) => wort[0].toUpperCase(),
        zeile: ([wort, bild]) => [bild, wort, laenge(wort)],
      }],
    },
  });
}
