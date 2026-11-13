/* Prüfansicht des Hello-Dialogs (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „dialoge“ für alle Tabellen in dialoge.js — gemischter Inhalt, deshalb ein Abschnitt je Tabelle, jeder für
   sich abzuhaken: Antwortknöpfe und Szenen der Stufe 1, Paare der Stufe 2, Fragen und Antworten der Stufen 4 und 5,
   Dialoge der Stufen 3 bis 6, höfliche Antworten der Stufe 6. Zeile und passende Antwort stehen je in einem Eintrag
   (wie beim Lese-Detektiv), denn ob eine Antwort passt und kein Ablenker ebenso, lässt sich nur zusammen prüfen.
   Welche Stufen eine Gruppe nimmt, liest die Ansicht aus der Stufentabelle STUFE des Spiels; die Sprecher eines Zugs
   rechnet sie mit wer aus dem Spiel. Den zweiten Knopf der Stufe 1 zieht das Spiel nur im Aufgabenbau zufällig
   (ARTEN.situation); die Ansicht zeigt alle, die gezogen werden können (nachgebaut: alle anderen Antwortknöpfe).
   Zu prüfen: Passt die richtige Antwort zur Zeile, ist kein Ablenker ebenso eine höfliche, passende Antwort, und ist
   das Englisch alltagsnah und britisch? */
"use strict";
{
  const NR = { s1: 1, s2: 2, s3: 3, s4: 4, s5: 5, s6: 6 };
  const liste = stufen => (stufen.length > 1 ? `Stufen ${stufen.join(", ")}` : `Stufe ${stufen[0]}`);
  /** Stufen, die Dialoge bzw. Fragen dieser Gruppe nehmen — aus STUFE (Felder gruppen und fragen). */
  const stufenMit = (feld, gruppe) => Object.keys(STUFE).filter(s => (STUFE[s][feld] || []).includes(gruppe)).map(s => NR[s]);
  const knopf = k => `${DIALOG_S1_ANTWORTEN[k][1]} ${DIALOG_S1_ANTWORTEN[k][0]}`;
  /** Die anderen Knöpfe, aus denen das Spiel in Stufe 1 einen zieht (wie ARTEN.situation, ohne Zufall). */
  const andereKnoepfe = richtig => Object.keys(DIALOG_S1_ANTWORTEN).filter(k => k !== richtig).map(knopf).join(" · ");
  const dialogGruppe = d => {
    const stufen = stufenMit("gruppen", d.gruppe);
    const tut = { 3: "drei Züge", 5: "vier Züge: Datum, Zeit, Farbe, Befinden, Wetter", 6: "vier bis fünf Züge: Shop, School, Playground" }[d.gruppe];
    return `Gruppe ${d.gruppe} (${liste(stufen)}${tut ? `, ${tut}` : ""})`;
  };
  const fragenGruppe = f => `Gruppe ${f[0]} (${liste(stufenMit("fragen", f[0]))}, ${f[0] === 4 ? "3. Klasse" : "4. Klasse"})`;
  const zuege = d => d.zuege.map((z, i) => `${i + 1}. ${wer(d, i)} ${z}`).join("  ");
  LS.listenPruefung("hello-dialog", {
    dialoge: {
      beschreibung: "Alle englischen Zeilen des Spiels. Stufe 1: Das Kind sieht eine Szene, hört eine Zeile und tippt einen von zwei Bildknöpfen (Hello!, Goodbye!, Thank you! …). Stufe 2: die passende Antwort auf eine Zeile aus drei Sätzen. Stufe 3: Dialog mit drei Zügen, der nächste Zug wird gewählt. Stufe 4: die Frage zur Antwort (Fragen der Gruppe 4) und „Welcher Satz passt nicht in den Dialog?“ (Dialoge der Gruppe 3). Stufe 5: Frage zur Antwort oder Antwort zur Frage (Gruppe 5) und eine Lücke mitten im Dialog füllen. Stufe 6: ganze Dialoge ordnen und „Was antwortest du?“ mit einer unhöflichen und einer unpassenden Antwort.",
      abschnitte: [
        { id: "antworten-s1", titel: "Antwortknöpfe (Stufe 1)", spalten: ["Bild", "Knopf"],
          hinweis: "Passt das Bild zum Satz, so dass ein Kind ohne Lesen den richtigen Knopf findet?",
          eintraege: () => Object.entries(DIALOG_S1_ANTWORTEN), zeile: ([, [satz, bild]]) => [bild, satz] },
        { id: "situationen", titel: "Szenen mit gesprochener Zeile (Stufe 1)", spalten: ["Bild", "Szene", "Gegenüber sagt", "richtiger Knopf", "zweiter Knopf (einer davon)", "Tipp"],
          hinweis: "Je Szene eine Gruppe. Neben dem richtigen Knopf steht zufällig einer der anderen vier — keiner davon darf ebenso passen (etwa Hello! auf Good morning, … oder Thank you! auf Welcome …).",
          eintraege: () => DIALOG_SITUATIONEN, gruppe: e => e[1],
          zeile: ([bild, wort, zeile, richtig, tipp]) => [bild, wort, zeile, knopf(richtig), andereKnoepfe(richtig), tipp] },
        { id: "paare", titel: "Zeile und Antwort (Stufe 2)", spalten: ["Zeile", "passende Antwort", "Ablenker", "Tipp"],
          hinweis: "Die Antwort passt zur Zeile, keiner der beiden Ablenker ebenso; die Ablenker sind richtige englische Sätze. Der Tipp verrät den Satz nicht.",
          eintraege: () => DIALOG_PAARE, zeile: ([zeile, antwort, falsche, tipp]) => [zeile, antwort, falsche.join(" · "), tipp] },
        { id: "fragen", titel: "Fragen und Antworten (Stufen 4, 5)", spalten: ["Thema", "Frage", "Antwort"],
          hinweis: "Eine Gruppe je Fragengruppe des Spiels. Die falschen Möglichkeiten nimmt das Spiel aus den anderen Themen derselben Gruppe: Keine Antwort darf zu einer Frage eines anderen Themas passen (und keine Frage zu einer Antwort eines anderen Themas).",
          eintraege: () => DIALOG_FRAGEN, gruppe: fragenGruppe, zeile: ([, thema, frage, antwort]) => [thema, frage, antwort] },
        { id: "dialoge", titel: "Dialoge (Stufen 3–6)", spalten: ["Ort", "Züge (Sprecher abwechselnd)", "fremde Zeilen", "Tipp"],
          hinweis: "Eine Gruppe je Dialoggruppe des Spiels. Jeder Zug antwortet auf den vorigen, damit die Reihenfolge eindeutig ist; die Sprecherbilder passen zu den Namen und Rollen. Die zwei fremden Zeilen passen an keiner Stelle in den Dialog — sie sind die falschen Möglichkeiten (nächster Zug, Lücke) und der Satz, der nicht passt.",
          eintraege: () => DIALOG_DIALOGE, gruppe: dialogGruppe,
          zeile: d => [`${d.bild} ${d.ort}`, zuege(d), d.falsch.join(" · "), d.tipp] },
        { id: "hoeflich", titel: "Höflich antworten (Stufe 6)", spalten: ["Bild", "Zeile", "höflich und passend", "unhöflich", "passt nicht", "Tipp"],
          hinweis: "Nur die höfliche Antwort passt und ist freundlich; die unhöfliche ist deutlich unhöflich, aber nicht grob verletzend; die dritte passt nicht zur Zeile.",
          eintraege: () => DIALOG_HOEFLICH, zeile: ([bild, zeile, richtig, unhoeflich, fremd, tipp]) => [bild, zeile, richtig, unhoeflich, fremd, tipp] },
      ],
    },
  });
}
