/* Prüfansicht von „König in der Falle“ (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „stellungen“ (stellungen.js, STELLUNGEN) mit zwei Inhalten, je für sich abzuhaken: Matt in 1 (Stufen 1–5)
   und Matt in 2 (Stufe 6, das Spiel prüft dort wie in index.html mit stufe === "s6"). Die Stufe steht je Stellung in den
   Daten (Feld stufe, das Spiel wählt mit JE_STUFE); die Gruppen nennen sie mit dem Stufentext des Spiels (STUFEN_TEXT).
   Was das Kind sieht und hört, kommt aus dem Spiel: das Brett zeichnet brettEl (Feld von und nach des Lösungszugs,
   bei Matt in 2 des ersten Zugs, markiert wie ein gespielter Zug), „Stellung“ ist stellungText (Vorleser), „Lösung“
   ist loesungText — aus der Regel-Maschine (schach.js über analyse, SCHACH.pruefeRaetsel), nicht aus dem Feld loesung
   der Liste (das Testskript vergleicht beide). „Regel-Maschine“ zeigt, was schach.js prüft: Mängel der Stellung, sonst
   wie viele Züge matt setzen (muss genau einer sein) und wie viele andere Züge Schach geben; bei Matt in 2 jede Antwort
   der Eule auf den ersten Zug mit der Zahl der Mattzüge danach. Zu prüfen: Zeigt das Brett die Stellung eindeutig,
   ist sie ein möglicher Schachaufbau, ist die Lösung die einzige, verrät der Hinweis die Lösung nicht und stimmt er
   (Rand, Ecke, welche Figur ein Feld bewacht), passt die Schwierigkeit zur Stufe. */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Stufe mit Matt in 2 — wie im Spiel (zwei = stufe === "s6"). */
  const ZWEI = "s6";
  const brettVon = e => S.ausFen(e.fen).brett;
  const maengelVon = e => analyse(e.fen, e.stufe).maengel;
  /** Der Zug, den das Brett markiert: der Mattzug, bei Matt in 2 der erste Zug. */
  const zugVon = e => { const l = analyse(e.fen, e.stufe).loesung; return l && (e.stufe === ZWEI ? l.erster : l); };

  /** Brett, wie das Spiel es zeichnet, gross genug, dass man die Figuren erkennt. */
  function bildVon(e) {
    const z = zugVon(e);
    const svg = brettEl({ brett: brettVon(e), marken: z ? { [z.von]: "kf-weg", [z.nach]: "kf-weg" } : null });
    svg.style.width = "220px";
    return svg;
  }
  const loesung = e => (maengelVon(e).length ? "—" : loesungText(e));
  const mangelText = e => `Mangel: ${maengelVon(e).join("; ")}`;
  /** „genau 1 Mattzug; 3 andere Züge geben Schach“ — gezählt mit schach.js. */
  function mattEinsText(e) {
    if (maengelVon(e).length) return mangelText(e);
    const brett = brettVon(e);
    const matt = S.mattZuege(brett).length;
    const schach = S.zuege(brett, "w").filter(z => S.imSchach(S.ziehe(brett, z), "b")).length - matt;
    return `genau ${matt} Mattzug; ${schach} ${schach === 1 ? "anderer Zug gibt" : "andere Züge geben"} Schach`;
  }
  /** Jede Antwort der Eule auf den ersten Zug mit der Zahl der Mattzüge danach. */
  function mattZweiText(e) {
    if (maengelVon(e).length) return mangelText(e);
    const brett = brettVon(e);
    const b1 = S.ziehe(brett, zugVon(e));
    const antworten = S.zuege(b1, "b").map(a => {
      const n = S.mattZuege(S.ziehe(b1, a)).length;
      return `${S.zugText(b1, a)} (${n} ${n === 1 ? "Mattzug" : "Mattzüge"})`;
    });
    return `genau ${S.mattInZwei(brett).length} erster Zug; Antworten der Eule: ${antworten.join(", ")}`;
  }
  const stufeName = s => `Stufe ${nummer(s)} (${LS.stufeFuer(ID, s)}): ${STUFEN_TEXT[s]}`;
  const STUFEN_UEBERSICHT = Object.keys(STUFEN_TEXT)
    .map(s => `Stufe ${nummer(s)}: ${STUFEN_TEXT[s]} (${STELLUNGEN.filter(e => e.stufe === s).length} Stellungen)`).join(" · ");

  LS.listenPruefung(ID, {
    stellungen: {
      beschreibung: "Schachstellungen, Weiss ist am Zug. Das Kind tippt eine weisse Figur und ihr Zielfeld an und sucht den Zug, "
        + "nach dem der schwarze König matt ist; in Stufe 6 zwei Züge, dazwischen verteidigt sich die Eule am zähesten. "
        + `${STUFEN_UEBERSICHT}. Je Aufgabe drei Tipps: zuerst ein allgemeiner („${TIPP_FLUCHT}“ bzw. „${TIPP_ZEIGEN}“), `
        + "dann der Hinweis der Stellung (Spalte „Hinweis“), zuletzt die Figur, die zieht, mit ihrer Zugregel. "
        + "Rochade, en passant und Umwandlung kommen nicht vor (die Regel-Maschine weist solche Stellungen ab).",
      abschnitte: [
        { id: "matt1", titel: "Matt in 1 (Stufen 1–5)", spalten: ["Stellung", "Lösung", "Hinweis", "Regel-Maschine"], bild: bildVon,
          hinweis: "Je Stufe eine Gruppe. Das Brett markiert Feld von und nach der Lösung. Ist die Stellung möglich (je ein König, "
            + "Könige nicht nebeneinander, Schwarz nicht im Schach, keine Bauern auf Reihe 1 oder 8)? Setzt nur dieser eine Zug matt "
            + "(die Regel-Maschine zählt die Mattzüge, es muss genau einer sein)? Stimmt der Hinweis (Rand, Ecke, welche Figur ein Feld "
            + "bewacht), ohne das Zielfeld zu verraten? Passt die Stellung zur Stufe (Figuren der Stufe, König am Rand oder nicht)?",
          eintraege: () => STELLUNGEN.filter(e => e.stufe !== ZWEI), gruppe: e => stufeName(e.stufe),
          zeile: e => [stellungText(brettVon(e)), loesung(e), e.hinweis, mattEinsText(e)] },
        { id: "matt2", titel: "Matt in 2 (Stufe 6)", spalten: ["Stellung", "Lösung", "Hinweis", "Regel-Maschine"], bild: bildVon,
          hinweis: `${stufeName(ZWEI)} Gruppen nach dem ersten Zug: still oder ein Opfer. Das Brett markiert den ersten Zug. `
            + "Die Lösung zeigt den ersten Zug, die zäheste Antwort der Eule und einen Mattzug danach. Gibt es nur diesen einen ersten "
            + "Zug, und setzt Weiss nach jeder Antwort der Eule matt (Spalte „Regel-Maschine“)? Passt der Hinweis (kein Schach oder "
            + "Opfer) zum ersten Zug?",
          eintraege: () => STELLUNGEN.filter(e => e.stufe === ZWEI),
          gruppe: e => (analyse(e.fen, e.stufe).loesung?.opfer ? "Erster Zug ein Opfer: gibt Schach, die Eule kann die Figur schlagen" : "Erster Zug still: gibt kein Schach"),
          zeile: e => [stellungText(brettVon(e)), loesung(e), e.hinweis, mattZweiText(e)] },
      ],
    },
  });
}
