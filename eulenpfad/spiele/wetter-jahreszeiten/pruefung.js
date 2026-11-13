/* Prüfansicht von „Wetter und Jahreszeiten“ (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Vier Listen aus wetter.js, je ein Abschnitt: Beobachtungen zur Jahreszeit (WJ_JAHRESZEITEN, je Korb eine Gruppe mit
   Bild und Namen wie im Spiel, ZEIT_KORB), Kleidung zum Wetter (WJ_KLEIDUNG, mit der Frage des Spiels, kleidungFrage),
   Wettersymbole (WJ_SYMBOLE, dazu die Temperaturen und Fragen, mit denen das Spiel das Symbol im Wetterbericht zeigt:
   BERICHT, BERICHT_FRAGEN, grad) und Wetterwissen (WJ_FRAGEN, je Stufengruppe). Die Stufen liest die Ansicht aus der
   Stufentabelle des Spiels (STUFE_ARTEN, aus der es auch seine Aufgaben baut) mit seiner Auswahl je Art (NIMMT).
   Zu prüfen: Passt jede Beobachtung im Schweizer Mittelland eindeutig zu einer Jahreszeit, ist bei Kleidung und Fragen
   kein Ablenker ebenso richtig, stimmen Sachangaben und Daten, zeigt das Bild eindeutig das Gemeinte. */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Arten des Spiels (STUFE_ARTEN, erstes Feld) in Worten; die weiteren Felder sind ihre Angaben. */
  const ART = {
    zeit: n => `Karte in einen von vier Jahreszeiten-Körben legen (Karten mit „ab Stufe“ bis ${n})`,
    kleidung: () => "zum Wetter aus drei Antworten wählen, was passt",
    symbol: () => "zum Wettersymbol aus drei Namen den richtigen wählen",
    thermo: s => `Thermometer ablesen (${grad(THERMO[s].von)} bis ${grad(THERMO[s].bis)})`,
    bericht: () => "Wetterbericht über vier Tage lesen (Symbol und Temperatur je Tag)",
    differenz: ueberNull => `Temperaturunterschied rechnen${ueberNull ? " (von Minus- zu Plusgraden)" : ""}`,
    frage: (n, nurAb) => `Wissensfrage mit drei Antworten (${nurAb ? `nur Fragen mit „ab Stufe“ ${n}` : `Fragen mit „ab Stufe“ bis ${n}`})`,
  };
  /** „Stufe 1: … · Stufe 3: …“ für die Arten 'arten' aus STUFE_ARTEN; mehrfach genannte (häufiger) nur einmal. */
  const stufenText = arten => Object.entries(STUFE_ARTEN)
    .map(([s, liste]) => [s, [...new Set(liste.filter(([art]) => arten.includes(art)).map(([art, ...angaben]) => ART[art](...angaben)))]])
    .filter(([, texte]) => texte.length)
    .map(([s, texte]) => `Stufe ${nummer(s)}: ${texte.join("; ")}`)
    .join(" · ");
  /** Stufen, in denen eine der Arten 'arten' den Eintrag nimmt (ohne Freigabe); nimmt(art, angaben) prüft je Art. */
  const stufenVon = (arten, nimmt = () => true) => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([art, ...angaben]) => arten.includes(art) && nimmt(art, angaben)))
    .map(nummer).join(", ") || "—";
  const stufenWort = text => (text.includes(",") ? `Stufen ${text}` : `Stufe ${text}`);

  /** Temperaturen, mit denen der Wetterbericht das Symbol zeigt (BERICHT des Spiels), je Jahreszeit. */
  const berichtGrade = symbol => Object.entries(BERICHT).filter(([, b]) => b[symbol])
    .map(([zeit, b]) => `${zeit === "sommer" ? "Sommer" : "Winter"} ${grad(b[symbol][0])} bis ${grad(b[symbol][1])}`).join("; ") || "— (nicht im Wetterbericht)";
  /** Fragen des Wetterberichts zum Symbol (BERICHT_FRAGEN): gesucht, oder an den anderen Tagen ausgeschlossen. */
  const berichtFragen = symbol => Object.values(BERICHT_FRAGEN).flatMap(f => [
    ...(f.symbole.includes(symbol) ? [`gesucht: ${f.frage}${f.ohne.length ? ` (dann an keinem anderen Tag ${f.ohne.join(" ")})` : ""}`] : []),
    ...(f.ohne.includes(symbol) ? [`nie neben dem gesuchten Tag bei „${f.frage}“`] : []),
  ]).join(" · ") || "—";
  const imBericht = symbol => Object.values(BERICHT).some(b => b[symbol]);

  LS.listenPruefung("wetter-jahreszeiten", {
    jahreszeiten: {
      beschreibung: "Beobachtungen aus Natur, Wetter und Alltag: Das Kind legt die Karte (Bild und Satz) in den Korb der "
        + `Jahreszeit, zu der sie am besten passt. ${stufenText(["zeit"])}. Gemeint ist das Schweizer Mittelland. `
        + "Die Körbe zeigen eigene Bilder (🌼, 🌞, 🍁, 🧊), die auf keiner Karte vorkommen.",
      abschnitte: [{
        id: "beobachtung", titel: "Beobachtungen", spalten: ["Bild", "Beobachtung", "Stufen"],
        hinweis: "Je Korb eine Gruppe (Name wie im Spiel). Passt die Beobachtung im Mittelland eindeutig zu dieser einen "
          + "Jahreszeit — und nicht ebenso gut zu einer anderen (Gewitter, Kirschen, Kürbisse, Kastanien, Frösche, Trauben "
          + "liegen oft an der Grenze zweier Jahreszeiten)? Stimmt die Sachangabe (Winterschlaf, Zugvögel, längste "
          + "Tage/Nächte)? Zeigt das Bild eindeutig das Gemeinte und verrät es keinen anderen Korb?",
        eintraege: () => WJ_JAHRESZEITEN,
        gruppe: ([, , , zeit]) => `${ZEIT_KORB[zeit]?.bild || ""} ${ZEIT_KORB[zeit]?.text || zeit}`.trim(),
        zeile: z => [z[1], z[2], stufenVon(["zeit"], (art, [n]) => NIMMT.zeit(z, n))],
      }],
    },
    kleidung: {
      beschreibung: "Kleidung und Schutz zum Wetter: Das Kind sieht das Wetterbild und den Satz und wählt aus drei "
        + `Antworten (Bild und Name), was jetzt passt. ${stufenText(["kleidung"])}.`,
      abschnitte: [{
        id: "kleidung", titel: "Was passt zum Wetter?", spalten: ["Bild", "Frage", "richtig", "falsch", "falsch", "Stufen"],
        hinweis: "Die Frage so, wie das Spiel sie stellt. Passt die richtige Antwort klar zum Wetter, und ist keiner der "
          + "beiden Ablenker ebenso vernünftig (etwa eine Jacke bei Regen, wenn der Regenschirm gesucht ist)? Zeigt das "
          + "Bild vor dem Namen eindeutig das Kleidungsstück?",
        eintraege: () => WJ_KLEIDUNG,
        zeile: ([bild, text, richtig, f1, f2]) => [bild, kleidungFrage(text), richtig, f1, f2, stufenVon(["kleidung"])],
      }],
    },
    symbole: {
      beschreibung: "Wettersymbole: Das Kind wählt zum Symbol aus drei Namen den richtigen; im Wetterbericht stehen sie "
        + `über vier Tage mit einer Temperatur, die das Spiel je Jahreszeit und Symbol zieht. ${stufenText(["symbol", "bericht"])}.`,
      abschnitte: [{
        id: "symbol", titel: "Symbole", spalten: ["Bild", "Name", "Stufen", "im Wetterbericht", "Fragen im Wetterbericht"],
        hinweis: "Zeigt das Symbol eindeutig dieses Wetter, und ist es mit keinem anderen der Liste zu verwechseln (drei "
          + "Namen stehen zur Wahl)? Ist der Name der übliche im Wetterbericht (Schweizer Schreibweise)? Passen die "
          + "Temperaturen zum Mittelland in dieser Jahreszeit (Tageshöchstwert)? Ist bei der Frage im Wetterbericht nur "
          + "der Tag mit diesem Symbol richtig?",
        eintraege: () => WJ_SYMBOLE,
        zeile: ([bild, name]) => [bild, name,
          stufenVon(["symbol", "bericht"], art => art === "symbol" || imBericht(bild)), berichtGrade(bild), berichtFragen(bild)],
      }],
    },
    fragen: {
      beschreibung: "Wetterwissen: Das Kind beantwortet eine Frage mit drei Antworten; nach der richtigen Antwort "
        + `erscheint die Erklärung. ${stufenText(["frage"])}.`,
      abschnitte: [{
        id: "frage", titel: "Fragen", spalten: ["Bild", "Frage", "richtig", "falsch (beide)", "Erklärung"],
        hinweis: "Je Stufengruppe eine Gruppe. Stimmen Antwort und Erklärung sachlich (Daten, Temperaturen, Föhn), und ist "
          + "keiner der Ablenker ebenso richtig? Ist die Frage für die 4.–6. Klasse verständlich? Passt das Bild zur Frage, "
          + "ohne die Antwort zu verraten?",
        eintraege: () => WJ_FRAGEN,
        gruppe: f => `in ${stufenWort(stufenVon(["frage"], (art, [n, nurAb]) => NIMMT.frage(f, n, nurAb)))}`,
        zeile: ([, bild, frage, richtig, f1, f2, erklaerung]) => [bild, frage, richtig, `${f1} · ${f2}`, erklaerung],
      }],
    },
  });
}
