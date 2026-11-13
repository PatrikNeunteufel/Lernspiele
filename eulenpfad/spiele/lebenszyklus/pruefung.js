/* Prüfansicht des Lebenszyklus-Puzzles (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Die drei Zyklus-Listen (Tiere, Pflanzen, Mensch) stehen zusammen in ZYKLEN (zyklen.js, Liste im letzten Feld); je
   Liste ein Abschnitt mit ihren Zeilen, gruppiert nach dem Namen wie im Spiel (Mensch und Apfelbaum kommen in mehreren
   Fassungen vor). Die Stadien stehen in der Reihenfolge, die das Spiel verlangt; ein Stadium ohne Bild steht nur als
   Wort da wie im Spiel. Die Spalten „Ordnen“ und „Was kommt nach?“ lesen die Stufentabelle des Spiels (STUFE_ARTEN, aus
   der es auch seine Aufgaben baut) mit seiner Auswahl (zyklusInStufe, NIMMT). Geburt: je Korb eine Gruppe mit Bild und
   Text des Korbs wie im Spiel (GEBURT_TEXT). Zu prüfen vor allem: Stimmen die Stadien und ihre Reihenfolge biologisch,
   gehört jedes Tier eindeutig in seinen Korb, ist kein Ablenker ebenso richtig? */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Stufen, in denen eine Art vorkommt (STUFE_ARTEN des Spiels). */
  const stufenMit = art => Object.keys(STUFE_ARTEN).filter(s => STUFE_ARTEN[s].some(([a]) => a === art)).map(nummer);
  const liste = nr => (nr.length > 1 ? `Stufen ${nr.slice(0, -1).join(", ")} und ${nr.at(-1)}` : `Stufe ${nr[0]}`);
  /** Stufen, in denen eine Art den Zyklus ziehen kann (zyklusInStufe und NIMMT des Spiels, ohne Freigabe). */
  const stufenVon = (z, art) => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([a, n, mindestens]) => a === art && zyklusInStufe(z, n) && NIMMT[art](z[2], mindestens)))
    .map(nummer).join(", ") || "—";
  const stadium = ([bild, text]) => (bild ? `${bild} ${text}` : `(ohne Bild) ${text}`);

  const zyklus = (id, titel, beschreibung) => ({
    beschreibung: `${beschreibung} Ordnen: das Kind tippt die Stadien der Reihe nach an (${liste(stufenMit("ordnen"))}; `
      + "in Stufe 6 nur Zyklen mit fünf Stadien). „Was kommt nach …?“: zu einem Stadium das nächste wählen, die falschen "
      + `Antworten sind andere Stadien desselben Zyklus (${liste(stufenMit("naechstes"))}, nur Zyklen mit mindestens vier `
      + "Stadien). Je Stufe die Zyklen ab dieser und den zwei Stufen davor.",
    abschnitte: [{
      id, titel, spalten: ["Stadien in Reihenfolge", "ab Stufe", "Ordnen", "Was kommt nach?"],
      hinweis: "Je Name eine Gruppe. Stimmen die Stadien und ihre Reihenfolge biologisch, fehlt keins, das ein Kind "
        + "erwartet, und folgt jedes eindeutig auf das davor (auch als Frage „Was kommt nach …?“)? Zeigt jedes Bild "
        + "eindeutig sein Stadium? In Stufe 1 und 2 muss jedes Stadium ein Bild haben.",
      eintraege: () => ZYKLEN.filter(z => z[3] === id),
      gruppe: ([, name]) => name,
      zeile: z => [z[2].map(stadium).join(" → "), String(z[0]), stufenVon(z, "ordnen"), stufenVon(z, "naechstes")],
    }],
  });

  LS.listenPruefung("lebenszyklus", {
    "zyklen-tiere": zyklus("zyklen-tiere", "Lebenszyklen der Tiere",
      "Lebenszyklen von Tieren (Huhn, Schmetterling, Frosch, Marienkäfer, Honigbiene)."),
    "zyklen-pflanzen": zyklus("zyklen-pflanzen", "Lebenszyklen der Pflanzen",
      "Lebenszyklen von Pflanzen (Sonnenblume, Apfelbaum)."),
    "zyklus-mensch": zyklus("zyklus-mensch", "Lebenszyklus des Menschen",
      "Lebensabschnitte des Menschen, mit drei, vier oder fünf Stadien."),
    geburt: {
      beschreibung: `Wie kommen die Jungen zur Welt? (${liste(stufenMit("geburt"))}): Das Kind legt das Tier in einen `
        + `von drei Körben: ${Object.values(GEBURT_TEXT).map(k => `${k.bild} ${k.text}`).join(", ")}.`,
      abschnitte: [{
        id: "tier", titel: "Tiere", spalten: ["Bild", "Tier"],
        hinweis: "Je Korb eine Gruppe (wie im Spiel). Gehört das Tier eindeutig in diesen Korb und in keinen anderen? "
          + "Zeigt das Bild eindeutig dieses Tier?",
        eintraege: () => GEBURT,
        gruppe: ([, , art]) => `${GEBURT_TEXT[art].bild} ${GEBURT_TEXT[art].text}`,
        zeile: ([bild, tier]) => [bild, tier],
      }],
    },
    fragen: {
      beschreibung: `Wissensfragen zu Atmung, Verwandlung, Keimung und Bestäubung (${liste(stufenMit("frage"))}): `
        + "eine richtige und zwei falsche Antworten.",
      abschnitte: [{
        id: "frage", titel: "Fragen", spalten: ["Frage", "Richtig", "Falsch", "Falsch"],
        hinweis: "Ist die Antwort biologisch richtig und sind die beiden anderen eindeutig falsch?",
        eintraege: () => ZYKLUS_FRAGEN,
        zeile: ([frage, richtig, f1, f2]) => [frage, richtig, f1, f2],
      }],
    },
  });
}
