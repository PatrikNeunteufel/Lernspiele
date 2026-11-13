/* Prüfansicht des Gattungs-Kenners (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „texte“ aus texte.js mit drei Inhalten, je ein Abschnitt für sich abzuhaken:
   – die reinen Textauszüge (GATTUNG_TEXTE ohne fremd), je Gattung eine Gruppe mit Bild und Namen wie im Spiel; dazu die
     Stelle, die das gefragte Merkmal zeigt (Wortlaut wie die Lösung im Spiel, mit zeilenWort), und die Zusatzaufgabe
     des Texts: gut oder böse (Märchen, Stufe 1), Lehre (Fabel, Stufe 4), Typisches (Sage, Stufe 4);
   – die Mischtexte der Königsstufe (ein Satz mit dem Merkmal einer anderen Gattung), je eigene Gattung eine Gruppe;
   – der Merkmalskatalog je Gattung (GATTUNGEN): Name, Erklärung und Tipps, wie sie Kinder in Körben, Tipps und beim
     Raten aus drei Merkmalen sehen.
   Die Stufen je Text rechnet die Ansicht aus den Konstanten des Spiels (STUFE, NEIN, korbMerkmale), nicht von Hand.
   Zu prüfen: Ist die Gattung am Auszug eindeutig, zeigt die genannte Stelle das Merkmal wirklich (und keine andere
   Stelle ebenso), ist kein Ablenker auch richtig, und passt der Text zum Alter (5. bis 7. Klasse)? */
"use strict";
{
  const gattungName = g => `${G[g].bild} ${G[g].name}`;
  const liste = zahlen => (zahlen.length > 1 ? `Stufen ${zahlen.slice(0, -1).join(", ")} und ${zahlen.at(-1)}` : `Stufe ${zahlen[0]}`);
  /** Text mit nummerierten Sätzen oder Zeilen, damit sich die Stelle finden lässt; Strophen mit „‖“ getrennt. */
  const textMitNummern = t => t.zeilen.map((z, i) => `${t.strophe && i > 0 && i % t.strophe === 0 ? "‖ " : ""}${i + 1}) ${z}`).join(" ");
  /** In welchen Stufen das Spiel diesen Text zeigt — aus STUFE, NEIN und S4_GATTUNG des Spiels. */
  const stufenVon = t => {
    const s = [];
    if (t.gattung === "maerchen" || NEIN.includes(t.gattung)) s.push(1);
    for (const n of [2, 3, 5]) if (STUFE[`s${n}`].gattungen.includes(t.gattung)) s.push(n);
    if (STUFE.s4.arten.some(art => S4_GATTUNG[art] === t.gattung)) s.push(4);
    return s.sort((a, b) => a - b);
  };
  /** Stelle des gefragten Merkmals, im Wortlaut der Lösung von zeichneMerkmal; beim Reim mit der markierten Zeile. */
  const stelle = t => {
    const s = `${zeilenWort(t)} ${t.merkmal + 1} „${t.zeilen[t.merkmal]}“`;
    return t.art === "reim" ? `${s} — reimt auf die markierte ${zeilenWort(t)} ${t.partner + 1} „${t.zeilen[t.partner]}“` : s;
  };
  const figuren = (t, art) => t.figuren.filter(f => f[1] === art).map(f => f[0]).join(", ");
  /** Zusatzaufgabe je Gattung: [Aufgabe, richtig, Ablenker]. */
  const zusatz = t => {
    if (t.gattung === "maerchen") return ["Stufe 1: Wie ist die Figur in diesem Märchen? (gut oder böse)", `gut: ${figuren(t, "gut")} · böse: ${figuren(t, "boese")}`, "—"];
    if (t.gattung === "fabel") return ["Stufe 4: Welche Lehre passt zu dieser Fabel? (letzter Satz ausgeblendet)", t.moral[0], t.moral.slice(1).join(" · ")];
    if (t.gattung === "sage") return ["Stufe 4: Was ist typisch für diese Sage?", t.typisch[0], t.typisch.slice(1).join(" · ")];
    return ["—", "—", "—"];
  };
  const KORB = new Set(FUENF.flatMap(g => korbMerkmale(g).map(id => `${g}/${id}`)));

  LS.listenPruefung("gattungs-kenner", {
    texte: {
      beschreibung: "Kurze Textauszüge und die Merkmale je Gattung. Stufe 1: Ist das ein Märchen? Bei einem Märchen danach: "
        + "Ist die Figur gut oder böse? (Märchen gegen Bericht, Gedicht, Kurzgeschichte). Stufe 2: die Textsorte aus Märchen, "
        + "Gedicht, Bericht wählen. Stufe 3: aus Märchen, Sage, Fabel, Gedicht, Bericht wählen, dann die Stelle antippen, die "
        + "das Merkmal zeigt; Stufe 5 ebenso mit Kurzgeschichte und Theaterszene (sieben). Stufe 4: die Lehre einer Fabel "
        + "wählen, das Typische einer Sage benennen oder eine Merkmal-Karte in einen der fünf Körbe legen. Stufe 6 "
        + "(Königsstufe): in einem Mischtext den Satz finden, der nicht zur Textsorte passt, oder die Textsorte aus drei "
        + "zufälligen Merkmalen ihres Katalogs raten. Die Tipps im Spiel kommen aus dem Merkmalskatalog.",
      abschnitte: [{
        id: "texte", titel: "Textauszüge",
        spalten: ["Titel", "Text", "Stufen", "Merkmal (Stufen 3, 5)", "Stelle im Text", "Zusatzaufgabe", "richtig", "Ablenker"],
        hinweis: "Je Gattung eine Gruppe. Ist die Gattung am Auszug eindeutig (kein Märchen, das auch Sage sein könnte)? Zeigt "
          + "die genannte Stelle das Merkmal wirklich, und zeigt es keine andere Stelle ebenso deutlich (das Kind tippt genau "
          + "eine an)? Bei Märchen: Sind die Figuren eindeutig gut oder böse? Bei Fabel und Sage: Ist nur die erste Antwort "
          + "richtig, und ist kein Ablenker auch richtig? Passt der Text zum Alter (5. bis 7. Klasse)? Selbst geschrieben, "
          + "nicht aus einem bekannten Werk übernommen?",
        eintraege: () => GATTUNG_TEXTE.filter(t => t.fremd == null),
        gruppe: t => gattungName(t.gattung),
        zeile: t => [t.titel, textMitNummern(t), liste(stufenVon(t)), merkmalVon(t.gattung, t.art).name, stelle(t), ...zusatz(t)],
      }, {
        id: "misch", titel: "Mischtexte (Königsstufe)",
        spalten: ["Titel", "Text", "passt nicht", "fremdes Merkmal"],
        hinweis: "Je Gattung des Texts eine Gruppe; das Spiel fragt: „Dieser Text ist … Welcher Satz passt nicht dazu?“ Gehört "
          + "der genannte Satz klar zu einer anderen Textsorte, und passen alle übrigen Sätze zur Gattung des Texts (kein "
          + "zweiter Eindringling)?",
        eintraege: () => GATTUNG_TEXTE.filter(t => t.fremd != null),
        gruppe: t => gattungName(t.gattung),
        zeile: t => [t.titel, textMitNummern(t), `${zeilenWort(t)} ${t.fremd + 1} „${t.zeilen[t.fremd]}“`,
          `${merkmalVon(t.fremdGattung, t.fremdArt).name} (${G[t.fremdGattung].name})`],
      }, {
        id: "merkmale", titel: "Merkmale je Gattung",
        spalten: ["Merkmal", "Erklärung", "Tipp: Frage", "Tipp: wo suchen", "Karte in Stufe 4"],
        hinweis: "Je Gattung eine Gruppe. Stimmt das Merkmal für die Gattung, und nennen Erklärung und Tipps die Gattung nicht "
          + "beim Namen? Eine Karte für die Körbe (Stufe 4) muss unter Märchen, Sage, Fabel, Gedicht und Bericht eindeutig "
          + "sein. In Stufe 6 raten die Kinder die Textsorte aus drei zufälligen Merkmalen: Je drei Merkmale einer Gattung "
          + "dürfen nicht ebenso gut zu einer anderen passen.",
        eintraege: () => Object.entries(GATTUNGEN).flatMap(([g, gat]) => Object.entries(gat.merkmale).map(([id, mk]) => [g, id, mk])),
        gruppe: ([g]) => gattungName(g),
        zeile: ([g, id, mk]) => [mk.name, mk.kurz, mk.frage, mk.such || "—", KORB.has(`${g}/${id}`) ? "ja" : "—"],
      }],
    },
  });
}
