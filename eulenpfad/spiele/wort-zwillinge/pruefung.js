/* Prüfansicht der Wort-Zwillinge (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Drei eigene Listen, je ein Abschnitt: Parallelwörter fast gleich geschrieben und ähnlich geschrieben (beide aus
   ZWILLINGE, getrennt nach dem Feld Liste; gruppiert danach, ob das Paar ein Bild hat — nur dann kommt es in „Welches
   Bild passt?“) und falsche Freunde (FALSCHE_FREUNDE). Die Spalte „Stufen“ liest die Stufentabelle des Spiels
   (STUFE_ARTEN, aus der es auch seine Aufgaben baut). Zu prüfen: Ist das
   Paar wirklich ein Parallelwort (gleiche Herkunft, gleiche Bedeutung) bzw. ein echter falscher Freund, stimmen beide
   Bedeutungen, britische Schreibweise, Deutsch in Schweizer Schreibweise, passt das Bild eindeutig? */
"use strict";
{
  /** Stufen, die ein Zwillingspaar ziehen können — aus STUFE_ARTEN des Spiels: bild nur mit Bild, entscheid nimmt alle Zwillinge. */
  const stufenVon = z => Object.entries(STUFE_ARTEN)
    .filter(([, arten]) => arten.some(([art, listen]) => (art === "entscheid")
      || (listen && listen.includes(z[3]) && (art !== "bild" || !!z[2]))))
    .map(([s]) => s.slice(1)).join(", ");
  const bildZelle = b => b || "— (kein Bild)";
  const zwilling = (liste, titel, beschreibung) => ({
    beschreibung,
    abschnitte: [{
      id: liste, titel, spalten: ["Bild", "Englisch", "Deutsch", "Stufen"],
      hinweis: "Ist das Paar ein echtes Parallelwort — verwandt und mit derselben Bedeutung, nicht nur ähnlich im Klang? Englisch in britischer Schreibweise, Deutsch in Schweizer Schreibweise (ss). Das Bild muss eindeutig zum Wort passen und darf mit keinem anderen Bild der Liste zu verwechseln sein (in „Welches Bild passt?“ stehen drei oder vier Bilder nebeneinander).",
      eintraege: () => ZWILLINGE.filter(z => z[3] === liste),
      gruppe: z => (z[2] ? "mit Bild (auch „Welches Bild passt?“)" : "ohne Bild (nur Wort zu Wort)"),
      zeile: z => [bildZelle(z[2]), z[0], z[1], stufenVon(z)],
    }],
  });
  LS.listenPruefung("wort-zwillinge", {
    gleich: zwilling("gleich", "Parallelwörter, fast gleich geschrieben",
      "Englische Wörter, die fast gleich geschrieben werden wie ihr deutscher Zwilling. Stufe 1 nur diese Liste: englisches Wort lesen, aus drei Bildern das passende wählen; Stufe 2 dasselbe mit vier Bildern (zusammen mit der Liste „ähnlich“); Stufe 3 zum englischen Wort den deutschen Zwilling wählen; Stufe 4 und 6 zum deutschen Wort den englischen Zwilling unter ähnlich aussehenden finden; Stufe 6 auch „echte Zwillinge oder falsche Freunde?“."),
    aehnlich: zwilling("aehnlich", "Parallelwörter, ähnlich geschrieben",
      "Englische Wörter, die anders geschrieben, aber mit dem deutschen Wort verwandt sind (house – Haus, water – Wasser). Stufe 2 und 3: englisches Wort lesen, aus vier Bildern das passende wählen; Stufe 3 und 4: zum englischen Wort den deutschen Zwilling wählen; Stufe 4 und 6: zum deutschen Wort den englischen Zwilling unter ähnlich aussehenden finden; Stufe 6 auch „echte Zwillinge oder falsche Freunde?“."),
    "falsche-freunde": {
      beschreibung: "Englische Wörter, die wie ein deutsches Wort aussehen, aber etwas anderes bedeuten (gift = Geschenk, nicht Gift). Stufe 5 und 6: Das Kind sieht das englische Wort und wählt die richtige Bedeutung; unter den Antworten stehen das gleich aussehende deutsche Wort und Bedeutungen anderer falscher Freunde. Stufe 6 zeigt das Paar auch als Karte (gift – Gift): echte Zwillinge oder falsche Freunde?",
      abschnitte: [{
        id: "freund", titel: "Falsche Freunde", spalten: ["Bild", "Englisch", "heisst", "nicht (sieht gleich aus)", "Karte in Stufe 6"],
        hinweis: "Bedeutet das englische Wort (britisch) wirklich das unter „heisst“ — und nicht das deutsche Wort daneben? Sieht oder klingt das deutsche Wort dem englischen wirklich ähnlich? Keine Bedeutung darf auch zu einem anderen falschen Freund passen, denn deren Bedeutungen stehen als Ablenker daneben.",
        eintraege: () => FALSCHE_FREUNDE,
        zeile: ([en, bedeutung, falsch, bild]) => [bildZelle(bild), en, bedeutung, falsch, `${en} – ${falsch}`],
      }],
    },
  });
}
