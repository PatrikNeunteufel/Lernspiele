/* Prüfansicht des Kompass-Spiels (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „orte“ mit einem Inhalt: die Orte auf dem Dorfplan, je mit Bild, Beschriftung auf dem Plan und dem Namen
   mit Artikel im Wer-Fall und im Wem-Fall, so wie das Spiel sie in seine Sätze setzt. Die Stufen liest die Ansicht aus
   der Stufentabelle des Spiels (STUFE: Arten je Stufe, MIT_PLAN: Arten auf dem Plan). Die Himmelsrichtungen selbst sind
   keine Liste, sondern Spielcode (RICHTUNGEN, geprüft durch pruefeAufgabe). Zu prüfen: Zeigt das Bild eindeutig den Ort,
   stimmen Artikel und Fall in den Sätzen des Spiels? */
"use strict";
{
  /** Nummern der Stufen mit einer Aufgabenart auf dem Plan — aus STUFE und MIT_PLAN des Spiels. */
  const planStufen = () => Object.entries(STUFE)
    .filter(([, p]) => p.arten.some(art => MIT_PLAN.includes(art))).map(([s]) => s.slice(1));

  LS.listenPruefung("kompass", {
    orte: {
      beschreibung: `Orte auf dem Dorfplan (Stufen ${planStufen().join(", ")}): Der Plan zeigt sieben bis neun Orte mit Bild `
        + "und Beschriftung. Das Kind sagt, in welcher Richtung ein Ort von einem anderen aus liegt, tippt den direkten "
        + "Nachbarn oder das Ziel eines Wegs an oder wählt die richtige Wegbeschreibung. Der Name mit Artikel steht in den "
        + "Fragen, Tipps und Lösungen.",
      abschnitte: [{
        id: "ort", titel: "Orte", spalten: ["Bild", "Beschriftung", "Wer-Fall", "Wem-Fall"],
        hinweis: "Zeigt das Bild eindeutig den Ort, auch ohne die Beschriftung, und ist es mit keinem anderen Ort der Liste "
          + "zu verwechseln? Die Sätze des Spiels lauten etwa „In welcher Richtung liegt der See von der Schule aus?“, "
          + "„Wie kommst du von dem Wald zu der Burg?“, „Starte bei dem Brunnen.“, „Direkt nördlich neben dem Haus liegt "
          + "die Kirche.“ — stimmen Artikel und Fall (Wer-Fall nach „liegt“, Wem-Fall nach „von“, „zu“, „bei“, „neben“)?",
        eintraege: () => ORTE,
        zeile: ([bild, name, nom, dat]) => [bild, name, nom, dat],
      }],
    },
  });
}
