/* Prüfansicht von Blitzlesen (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine eigene Liste „wortgruppen“, ein Abschnitt: Dinge zum Zählen mit Einzahl, Mehrzahl und Begleiter. Die Spalten
   „Einzahl“ und „Beispiele“ setzen die Wortgruppen so zusammen wie das Spiel (eins mit ein/eine und Einzahl, zwei bis fünf mit dem
   Zahlwort und der Mehrzahl). Die Einzelwörter (Anlaut-Angel) und die ähnlichen Wörter (Buchstaben-Zwillinge) sind
   geliehen und werden dort geprüft. Zu prüfen: Stimmen Mehrzahl und ein/eine, und erkennt man das Bild eindeutig? */
"use strict";
{
  /** Wortgruppe wie im Spiel (ARTEN.gruppe): n = 1 mit ein/eine und Einzahl, sonst Zahlwort und Mehrzahl. */
  const gruppe = ([einz, mehr, ein], n) => (n === 1 ? `${ein} ${einz}` : `${ZAHLWOERTER[n]} ${mehr}`);
  LS.listenPruefung("blitzlesen", {
    wortgruppen: {
      beschreibung: "Dinge zum Zählen für Wortgruppen mit Zahlwort (Stufen 5, 6): Eine Wortgruppe wie „drei Birnen“ blitzt auf, das Kind wählt das Bild mit der richtigen Zahl der richtigen Dinge.",
      abschnitte: [{
        id: "wortgruppe", titel: "Dinge zum Zählen", spalten: ["Bild", "Einzahl", "Mehrzahl", "Beispiele"],
        hinweis: "Das Spiel zeigt eins bis fünf Dinge. Stimmen ein/eine und die Mehrzahl, und ist das Bild auch mehrfach nebeneinander gut zu zählen?",
        eintraege: () => ZAEHLDINGE,
        zeile: e => [e[3], gruppe(e, 1), e[1], `${gruppe(e, 2)} · ${gruppe(e, 5)}`],
      }],
    },
  });
}
