/* Prüfansicht der Wassertropfen-Reise (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „fragen“ (woerter.js, WASSER_FRAGEN), ein Abschnitt: je Frage Bild, Frage, die richtige und die beiden
   falschen Antworten, der Tipp nach einem Fehler und die Erklärung. Je Thema (Feld stufe in woerter.js) eine Gruppe; die
   Stufen, in denen das Spiel die Frage zieht, liest die Ansicht aus seiner Stufentabelle (STUFE_ARTEN, aus der es auch
   seine Aufgaben baut). Grafik, Stationen der Reise, Bodenschichten und Kläranlage gehören zum Spiel, nicht zur Liste.
   Zu prüfen: Stimmen die Sachangaben und Begriffe (verdunsten, kondensieren, Niederschlag, versickern, Grundwasser,
   Quelle), ist kein Ablenker ebenso richtig, verrät der Tipp die Antwort nicht, passt die Sprache zur 4.–6. Klasse. */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Themen der Fragen nach dem Feld stufe (Kopfkommentar von woerter.js). */
  const THEMA = { 1: "Aggregatzustände", 3: "Wasserkreislauf", 4: "Knifflige Fragen", 5: "Boden, Grundwasser, Kläranlage" };
  const thema = n => THEMA[n] || `Feld stufe ${n}`;
  /** Stufen, in denen die Art „frage“ des Spiels die Frage ziehen kann (STUFE_ARTEN, ohne Freigabe). */
  const stufenVon = f => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([art, felder]) => art === "frage" && felder.includes(f.stufe))).map(nummer).join(", ") || "—";
  const stufenWort = text => (text.includes(",") ? `Stufen ${text}` : `Stufe ${text}`);
  /** „Stufe 1: Aggregatzustände · Stufe 3: Wasserkreislauf · …“ aus STUFE_ARTEN. */
  const STUFEN_TEXT = Object.entries(STUFE_ARTEN)
    .map(([s, arten]) => [s, [...new Set(arten.filter(([art]) => art === "frage").flatMap(([, felder]) => felder))]])
    .filter(([, felder]) => felder.length)
    .map(([s, felder]) => `Stufe ${nummer(s)}: ${felder.map(thema).join(" und ")}`)
    .join(" · ");

  LS.listenPruefung("wassertropfen-reise", {
    fragen: {
      beschreibung: "Fragen zum Wasserkreislauf und zu den Aggregatzuständen: Das Kind wählt aus drei Antworten; nach "
        + "einer falschen Wahl erscheint der Tipp, nach der richtigen (oder dem dritten Fehler) die Erklärung. "
        + `Fragen je Stufe: ${STUFEN_TEXT}. Die anderen Aufgaben (Reise ordnen, Pfeile, Bodenschichten, Kläranlage) `
        + "nehmen ihre Inhalte aus dem Spiel, nicht aus dieser Liste.",
      abschnitte: [{
        id: "frage", titel: "Fragen", spalten: ["Bild", "Frage", "richtig", "falsch (beide)", "Tipp", "Erklärung"],
        hinweis: "Je Thema eine Gruppe (mit den Stufen, in denen die Fragen vorkommen). Stimmt die Antwort sachlich, und ist "
          + "keiner der beiden Ablenker ebenso richtig? Werden die Begriffe wie im Lehrmittel gebraucht (verdunsten, "
          + "kondensieren, Niederschlag, versickern, Grundwasser, Quelle; fest, flüssig, gasförmig)? Verrät der Tipp die "
          + "Antwort nicht, und stimmt die Erklärung? Passt die Frage zum Alter (Aggregatzustände 4. Klasse, Kreislauf "
          + "5. Klasse, Boden und Kläranlage 6. Klasse)? Zeigt das Bild das Gemeinte, ohne die Antwort zu verraten?",
        eintraege: () => WASSER_FRAGEN,
        gruppe: f => `${thema(f.stufe)} (${stufenWort(stufenVon(f))})`,
        zeile: f => [f.bild, f.frage, f.richtig, f.falsch.join(" · "), f.tipp, f.erklaerung],
      }],
    },
  });
}
