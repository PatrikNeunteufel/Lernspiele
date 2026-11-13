/* Prüfansicht von „Le ou la?“ (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „nomen“ (woerter.js, NOMEN), ein Abschnitt: je Nomen Bild, Deutsch, Einzahl mit bestimmtem und mit
   unbestimmtem Artikel und die Mehrzahl mit les — gerechnet mit den Funktionen des Spiels (ALLE mit vokal, bestimmt,
   unbestimmt, mit), so wie das Kind sie sieht. Gruppiert nach dem bestimmten Artikel (le, la, l’ männlich, l’
   weiblich), so dass das Geschlecht je Gruppe auf einen Blick zu prüfen ist. Die Spalte „Mehrzahl-Regel“ nennt die
   Kennzeichnung aus woerter.js, die Spalte „Stufen“ liest die Stufentabelle des Spiels (STUFE_ARTEN, aus der es
   auch seine Aufgaben baut) mit seiner Auswahl je Art (NIMMT). Zu prüfen: Geschlecht, Mehrzahl, l’ vor Vokal und
   stummem h, Akzente, deutsche Bedeutung, Bild. */
"use strict";
{
  /** Aufgabenarten des Spiels (STUFE_ARTEN, erstes Feld) in Worten; zusatz = zweites Feld. */
  const ART = {
    bestimmt: koerbe => `${koerbe.join(" / ")} wählen (mit Bild)`,
    unbestimmt: () => "un / une wählen (mit Bild)",
    hoerZahl: () => "hören: eins oder mehrere? (le chat / les chats, un chat / des chats)",
    mitLes: mitBild => `le / la / l’ / les wählen (${mitBild ? "mit Bild" : "ohne Bild"})`,
    mitDes: mitBild => `un / une / des wählen (${mitBild ? "mit Bild" : "ohne Bild"})`,
    mehrzahl: mitBild => `Mehrzahl bilden, le gâteau → les gâteaux (${mitBild ? "mit Bild" : "ohne Bild"}, jede zweite Aufgabe eine Ausnahme)`,
    einzahl: () => "zurück zur Einzahl, les chevaux → le cheval (ohne Bild)",
  };
  const nummer = s => s.slice(1);
  /** „Stufe 1: le / la wählen (mit Bild) · Stufe 2: …“; mehrfach genannte Arten (häufiger) nur einmal. */
  const STUFEN_TEXT = Object.entries(STUFE_ARTEN)
    .map(([s, arten]) => `Stufe ${nummer(s)}: ${[...new Set(arten.map(([art, zusatz]) => ART[art](zusatz)))].join("; ")}`)
    .join(" · ");
  /** Stufen, in denen eine Art das Wort nehmen kann (NIMMT des Spiels, ohne Freigabe). */
  const stufenVon = w => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([art, zusatz]) => NIMMT[art](w, zusatz))).map(nummer).join(", ");
  /** Kennzeichnung der Mehrzahl in woerter.js (letztes Feld) in Worten. */
  const REGEL = { "": "+ s", eau: "-eau → -eaux", al: "-al → -aux", eu: "-eu → -eux", gleich: "bleibt gleich", oeil: "unregelmässig" };
  const GESCHLECHT = { m: "männlich", f: "weiblich" };

  /** Wort des Spiels (ALLE: mit vokal) zum Eintrag aus NOMEN. */
  const wortVon = e => ALLE[NOMEN.indexOf(e)];

  LS.listenPruefung("le-ou-la", {
    nomen: {
      beschreibung: "Französische Nomen mit Geschlecht, Mehrzahl, Bild und deutscher Bedeutung. Das Kind wählt den "
        + `Artikel zum Wort, hört Einzahl und Mehrzahl heraus und bildet die Mehrzahl. ${STUFEN_TEXT}. `
        + "Die Spalte „Stufen“ zeigt je Wort, wo es vorkommt: Wörter mit l’ nicht in der Stufe nur mit le / la, "
        + "Wörter mit gleicher Einzahl und Mehrzahl nicht ohne Bild und nicht beim Mehrzahl-Bilden.",
      abschnitte: [{
        id: "nomen", titel: "Nomen",
        spalten: ["Bild", "Deutsch", "bestimmt", "unbestimmt", "Mehrzahl", "Mehrzahl-Regel", "Stufen"],
        hinweis: "Stimmt das Geschlecht (le und un männlich, la und une weiblich — die Gruppe nennt es)? Steht l’ genau vor "
          + "Vokal und stummem h (Wörter mit h aspiré wie le héros gehören nicht in die Liste)? Stimmt die Mehrzahl und ihre "
          + "Regel (-eau → -eaux, -al → -aux, -eu → -eux; Wörter auf -s, -x, -z bleiben gleich)? Stehen die Akzente richtig "
          + "(é, è, ê, â, î, ô, œ)? Stimmt die deutsche Bedeutung (Schweizer Schreibweise: Velo, Spital, Glace), und zeigt "
          + "das Bild eindeutig dieses Wort — auch dreimal nebeneinander für die Mehrzahl?",
        eintraege: () => NOMEN,
        gruppe: e => {
          const w = wortVon(e);
          return `${bestimmt(w)} (${GESCHLECHT[w.genus]})`;
        },
        zeile: e => {
          const w = wortVon(e);
          return [w.bild, w.de, mit(bestimmt(w), w.wort), mit(unbestimmt(w), w.wort), mit("les", w.plural),
            REGEL[w.ausnahme] || w.ausnahme, stufenVon(w)];
        },
      }],
    },
  });
}
