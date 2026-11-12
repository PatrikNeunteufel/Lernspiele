/* Prüfansicht des Wortarten-Sortierers (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Vier Listen: die Einzelwörter (WOERTER, je Wortart eine Gruppe) und je Satzgruppe eine Liste (SAETZE[<liste>]). Ein
   Satz wird so zerlegt wie im Spiel (zerlegeSatz); die abgefragten Wörter stehen im Satz in „…“ und daneben je Wortart.
   Zu prüfen: Hat jedes Wort ohne Zweifel diese Wortart (nach Schweizer Schulgrammatik; ein Adjektiv beim Verb bleibt
   Adjektiv), auch so, wie es im Satz gemeint ist — und in Stufe 2 klein geschrieben? */
"use strict";
{
  const ARTNAME = { N: "Nomen", V: "Verb", A: "Adjektiv" };
  /** Abgefragte Wörter eines Satzes, wie das Spiel sie findet. */
  const markiert = satz => zerlegeSatz(satz).filter(t => typeof t === "object");
  const satzText = satz => zerlegeSatz(satz).map(t => (typeof t === "object" ? `„${t.wort}“` : t)).join("");
  const woerterMit = (satz, art) => markiert(satz).filter(t => t.art === art).map(t => t.wort).join(", ") || "—";
  /** Abschnitt für eine Satzliste: Satz mit markierten Wörtern, dann die Wörter je Wortart. */
  const saetze = (liste, titel, hinweis) => ({
    id: liste, titel, hinweis, spalten: ["Satz", "Nomen", "Verben", "Adjektive"],
    eintraege: () => SAETZE[liste],
    zeile: satz => [satzText(satz), woerterMit(satz, "N"), woerterMit(satz, "V"), woerterMit(satz, "A")],
  });
  LS.listenPruefung("wortarten-sortierer", {
    einzelwoerter: {
      beschreibung: "Einzelne Wörter (Stufen 1, 2): Das Kind sieht ein Wort und tippt auf den Korb Nomen, Verb oder Adjektiv. In Stufe 1 wie geschrieben, in Stufe 2 alles klein — dann hilft nur die Probe.",
      abschnitte: [{
        id: "wort", titel: "Einzelwörter", spalten: ["Wort", "Wortart", "in Stufe 2"],
        hinweis: "Je Wortart eine Gruppe. Jedes Wort muss für sich allein eindeutig sein — kein Wort, das auch eine andere Wortart sein kann (laufen → das Laufen geht nur mit Artikel).",
        eintraege: () => Object.entries(WOERTER).flatMap(([art, woerter]) => woerter.map(wort => [art, wort])),
        gruppe: ([art]) => ARTNAME[art],
        zeile: ([art, wort]) => [wort, ARTNAME[art], wort.toLowerCase()],
      }],
    },
    "saetze-einfach": {
      beschreibung: "Einfache Sätze in der Gegenwart (Stufe 3): Im Satz ist ein Wort markiert, das Kind bestimmt seine Wortart.",
      abschnitte: [saetze("saetze-einfach", "Sätze in der Gegenwart",
        "Abgefragt wird eines der Wörter in „…“, zufällig gewählt — jedes muss stimmen. Die übrigen Wörter sind nur Text.")],
    },
    "saetze-zeiten": {
      beschreibung: "Sätze mit Vergangenheit, Steigerung und zusammengesetzten Zeiten (Stufe 4: ein Wort markiert; Stufe 6: bis zu drei Wörter nacheinander, gemischt mit den Sätzen zur Nominalisierung).",
      abschnitte: [saetze("saetze-zeiten", "Sätze mit Vergangenheit und Steigerung",
        "Jedes Wort in „…“ kann abgefragt werden, in Stufe 6 bis zu drei im selben Satz. Hilfsverben (haben) zählen als Verb.")],
    },
    "saetze-nominal": {
      beschreibung: "Sätze mit Nominalisierung (Stufe 5: ein Wort markiert; Stufe 6: bis zu drei Wörter nacheinander, gemischt mit den Sätzen zu Vergangenheit und Steigerung): Aus einem Verb oder Adjektiv wird mit der, das, beim ein Nomen.",
      abschnitte: [saetze("saetze-nominal", "Sätze mit Nominalisierung",
        "Jedes Wort in „…“ kann abgefragt werden. Nominalisierte Wörter (das Lachen, beim Essen, das Blau) sind Nomen; dasselbe Wort ohne Artikel bleibt Verb oder Adjektiv.")],
    },
  });
}
