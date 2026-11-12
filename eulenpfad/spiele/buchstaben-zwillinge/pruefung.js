/* Prüfansicht der Buchstaben-Zwillinge (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Zwei eigene Listen, je ein Abschnitt: leicht verwechselbare Buchstaben (das Spiel zeigt einen davon gross, das Kind
   wählt ihn klein aus der Gruppe) und ähnliche Wörter zum Bild (das erste Wort passt, die anderen lenken ab; Blitzlesen
   nimmt dieselbe Liste als „aehnliche-woerter“). Der Buchstabensalat nimmt die Wörter der Anlaut-Angel und wird dort
   geprüft. Zu prüfen: Gehört jeder Grossbuchstabe eindeutig zu genau einem Kleinbuchstaben der Gruppe? Passt das Bild
   nur zum ersten Wort, unterscheiden sich die Wörter wenig, und sind es Wörter, die ein Kind kennt? */
"use strict";
{
  LS.listenPruefung("buchstaben-zwillinge", {
    verwechsler: {
      beschreibung: "Gruppen von Buchstaben, die man leicht verwechselt (Stufen 2, 3): Das Kind sieht einen Grossbuchstaben und wählt aus der Gruppe den passenden Kleinbuchstaben.",
      abschnitte: [{
        id: "verwechsler", titel: "Verwechselbare Buchstaben", spalten: ["Kleinbuchstaben (zur Wahl)", "gezeigt als"],
        hinweis: "Jeder Buchstabe der Gruppe kann der gesuchte sein; gezeigt wird er gross. Die Buchstaben der Gruppe müssen sich klein ähnlich sehen, gross aber eindeutig sein.",
        eintraege: () => VERWECHSLER,
        zeile: g => [g.join(" "), g.map(b => b.toUpperCase()).join(" ")],
      }],
    },
    wortpaare: {
      beschreibung: "Ähnliche Wörter mit Bild (Buchstaben-Zwillinge Stufen 3, 4, 6: Das Kind sieht das Bild und wählt das passende Wort). Blitzlesen nutzt dieselbe Liste als „Ähnliche Wörter“ (Stufen 4, 5, 6): Eines der Wörter blitzt auf, das Kind wählt es unter den anderen.",
      abschnitte: [{
        id: "wortpaar", titel: "Ähnliche Wörter", spalten: ["Bild", "Wort zum Bild", "Ablenker"],
        hinweis: "Das Bild passt nur zum ersten Wort. Die Ablenker sollen sich in einem Buchstaben unterscheiden und richtig geschrieben sein (auch die Gross- und Kleinschreibung) — Blitzlesen zeigt auch sie als Wort.",
        eintraege: () => WORTPAARE,
        zeile: ([[wort, bild], ...andere]) => [bild, wort, andere.join(", ")],
      }],
    },
  });
}
