/* Prüfansicht der Tageslauf-Sonne (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „taetigkeiten“ mit zwei Inhalten, je für sich abzuhaken: die Tätigkeiten (woerter.js, TAETIGKEITEN) je
   Tageszeit eine Gruppe mit dem Namen wie im Spiel (ZEIT), mit Bild und dem Satz, den die Eule vorliest; und der
   Wochenplan (WOCHENPLAN) für gestern, heute, morgen, den die Liste mitführt. Die Spalte „Stufen“ liest die Stufentabelle
   des Spiels (STUFE): beim Zuordnen mit seiner Bedingung (zuordnenIn) und in Stufe 1 mit Tag oder Nacht, wie das Spiel
   die Tageszeit dort rechnet (zeitIn); Ordnen und „Welches passt nicht?“ nehmen jede Tätigkeit. Die Tätigkeit so, wie
   das Spiel sie aus den Rohdaten baut (taetigkeitVon). */
"use strict";
{
  const nummer = s => s.slice(1);
  const zeitName = z => ZEIT[z]?.name || z;
  /** „Morgen, Mittag oder Nacht“. */
  const oder = w => (w.length > 1 ? `${w.slice(0, -1).join(", ")} oder ${w.at(-1)}` : w.join(""));
  /** Aufgabenarten des Spiels (STUFE[s].arten) in Worten. */
  const ART = {
    zuordnen: s => `${oder(STUFE[s].zeiten.map(zeitName))} am Sonnenbogen zuordnen`,
    ordnen: s => `${STUFE[s].teile} Bilder in die Reihenfolge des Tages bringen`,
    passtNicht: () => "welches von vier Bildern passt nicht (drei mit gleicher Tageszeit)",
    tage: () => "gestern, heute, morgen im Wochenplan",
  };
  const stufenText = nurArten => Object.entries(STUFE)
    .map(([s, { arten }]) => [s, arten.filter(a => nurArten.includes(a)).map(a => ART[a](s))])
    .filter(([, texte]) => texte.length)
    .map(([s, texte]) => `Stufe ${nummer(s)}: ${texte.join("; ")}`).join(" · ");
  /** Stufen der Tätigkeit; in Stufe 1 mit Tag oder Nacht (zeitIn des Spiels). */
  const stufenVon = t => Object.keys(STUFE).filter(s => STUFE[s].arten.some(a => (a === "zuordnen" ? zuordnenIn(t, s) : a !== "tage")))
    .map(s => (s === "s1" ? `1 (${zeitName(zeitIn(t, s))})` : nummer(s))).join(", ") || "—";

  LS.listenPruefung("tageslauf-sonne", {
    taetigkeiten: {
      beschreibung: "Tätigkeiten mit Bild und Satz zum Vorlesen, je mit einer Tageszeit — "
        + `${stufenText(["zuordnen", "ordnen", "passtNicht"])}. Beim Ordnen und bei „Welches passt nicht?“ sieht das Kind nur `
        + "die Bilder; den Satz hört es beim langen Drücken. Dazu der Wochenplan — "
        + `${stufenText(["tage"])}: fünf Kalenderblätter mit Bildern, die Sonne zeigt heute.`,
      abschnitte: [{
        id: "taetigkeiten", titel: "Tätigkeiten",
        spalten: ["Bild", "Satz", "Stufen"],
        hinweis: "Je Tageszeit eine Gruppe. Gehört die Tätigkeit eindeutig zu dieser Tageszeit und zu keiner anderen (am Morgen, "
          + "am Mittag, am Nachmittag, am Abend, in der Nacht)? In Stufe 1 ist der Abend weggelassen: Ist „Tag“ oder „Nacht“ "
          + "eindeutig? Zeigt das Bild allein (beim Ordnen ohne Satz) die Tätigkeit so, dass ein Kind im Kindergarten oder in "
          + "der 1. Klasse die Tageszeit erkennt? Schweizer Wörter (Zmorge, Znüni, Zmittag, Zvieri, Znacht) richtig?",
        eintraege: () => TAETIGKEITEN,
        gruppe: e => zeitName(taetigkeitVon(e).zeit),
        zeile: e => {
          const t = taetigkeitVon(e);
          return [t.bild, t.satz, stufenVon(t)];
        },
      }, {
        id: "wochenplan", titel: "Wochenplan (gestern, heute, morgen)",
        spalten: ["Bild", "Tätigkeit"],
        hinweis: "Fünf Blätter in einer Reihe, das Kind tippt den gefragten Tag. Zeigt das Bild die Tätigkeit eindeutig, und ist "
          + "sie etwas, das ein Kind an einem bestimmten Tag macht? Die Eule sagt etwa „Morgen: Turnen 🤸.“ — passt die "
          + "Tätigkeit in diesen Satz? Keine Wochentagswörter.",
        eintraege: () => WOCHENPLAN, zeile: ([bild, was]) => [bild, was],
      }],
    },
  });
}
