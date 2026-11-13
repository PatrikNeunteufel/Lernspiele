/* Prüfansicht des Tier-Sortierers (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Die drei Listen sind Spalten derselben Tabelle TIERE (tiere.js): tierklassen (Klasse), saeugetier-gruppen (Gruppe),
   haltung (Haltung). Jede Liste zeigt die Tiere, die das Spiel kennt (ohne Pflanzen und Pilze, die nur die
   Lebensraum-Zuordnung braucht), je Korb eine Gruppe mit Bild und Namen wie im Spiel (KOERBE). Getrennt abzuhaken sind
   die kniffligen Tiere mit ihrer Falle (KNIFFLIG) und die Körbe mit ihren Erklärungen, die das Kind nach einem Fehler
   liest. Die Spalte „Stufen“ liest die Stufentabelle des Spiels (STUFE_ARTEN) mit seiner Auswahl je Art (NIMMT,
   KNIFFLIG): Ein Tier ohne Stufe kommt mit dieser Eigenschaft nie vor. */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Tier des Spiels (TIER, ohne Pflanzen und Pilze) zur Zeile aus tiere.js. */
  const tierVon = z => tier(z[0]);
  const tierZeilen = () => TIERE.filter(tierVon);
  const korb = k => (KOERBE[k] ? `${KOERBE[k].bild} ${k}` : k);

  /** Aufgabenarten des Spiels (STUFE_ARTEN, erstes Feld) in Worten; zusatz = zweites Feld. */
  const ART = {
    haltung: () => "Wildtier, Nutztier oder Heimtier? (Tier mit Bild)",
    wirbeltier: mitBild => `Säugetier, Vogel, Fisch, Reptil oder Amphibie?${mitBild ? " (Tier mit Bild)" : ""}`,
    klasse: () => "Klasse mit Insekten",
    gruppe: () => "Gruppe der Säugetiere",
    merkmal: mitBild => `Welches Tier gehört zu den …? (Tiere ${mitBild ? "mit" : "ohne"} Bild)`,
    knifflig: koerbe => `knifflige Tiere mit Falle (${koerbe} Körbe)`,
  };
  /** Fragt die Art (mit Zusatz) die Eigenschaft 'merkmal' ab? Die knifflige Art je Eintrag in KNIFFLIG. */
  const fragt = (art, merkmal) => (art === "knifflig" ? KNIFFLIG.some(([, m]) => m === merkmal) : NIMMT[art].merkmal === merkmal);
  /** „Stufe 1: … · Stufe 2: …“ für die Arten, die 'merkmal' abfragen; mehrfach genannte Arten nur einmal. */
  const stufenText = merkmal => Object.entries(STUFE_ARTEN)
    .map(([s, arten]) => [s, [...new Set(arten.filter(([art]) => fragt(art, merkmal)).map(([art, zusatz]) => ART[art](zusatz)))]])
    .filter(([, texte]) => texte.length).map(([s, texte]) => `Stufe ${nummer(s)}: ${texte.join("; ")}`).join(" · ");
  /** Stufen, in denen das Tier mit der Eigenschaft 'merkmal' vorkommt (NIMMT, KNIFFLIG; ohne Freigabe). */
  const stufenVon = (t, merkmal) => Object.keys(STUFE_ARTEN).filter(s => STUFE_ARTEN[s].some(([art, zusatz]) =>
    (art === "knifflig" ? KNIFFLIG.some(([name, m]) => name === t.name && m === merkmal)
      : NIMMT[art].merkmal === merkmal && NIMMT[art].nimmt(t, zusatz)))).map(nummer).join(", ") || "—";

  /** Tiere mit ihrem Korb für 'merkmal'; ohne Wert eine eigene Gruppe. */
  const tiere = (merkmal, titel, hinweis, nimmt = () => true) => ({
    id: "tier", titel, hinweis, spalten: ["Bild", "Tier", "Stufen"],
    eintraege: () => tierZeilen().filter(z => nimmt(tierVon(z))),
    gruppe: z => (tierVon(z)[merkmal] ? korb(tierVon(z)[merkmal]) : "nicht eindeutig (kommt nicht vor)"),
    zeile: z => [z[1] || "—", z[0], stufenVon(tierVon(z), merkmal)],
  });
  /** Knifflige Tiere für 'merkmal' (KNIFFLIG): richtiger Korb aus tiere.js, Falle aus dem Spiel. */
  const knifflig = merkmal => ({
    id: "knifflig", titel: "Knifflige Tiere mit Falle",
    hinweis: "Die Falle ist der Korb, den viele wählen; tippt das Kind ihn an, sagt das Spiel „Das denken viele! Aber: …“ "
      + "mit der Erklärung des richtigen Korbs. Ist der richtige Korb sicher richtig und die Falle sicher falsch — und "
      + "passt die Erklärung des richtigen Korbs zu genau diesem Tier?",
    spalten: ["Bild", "Tier", "richtig", "Falle"],
    eintraege: () => KNIFFLIG.filter(([, m]) => m === merkmal),
    zeile: ([name, m, falle]) => [tier(name)?.bild || "—", name, korb(tier(name)?.[m] ?? "—"), korb(falle)],
  });
  /** Körbe einer Liste mit dem Zusatz im Korb und der Erklärung nach einem Fehler. */
  const koerbe = namen => ({
    id: "korb", titel: "Körbe und Erklärungen", spalten: ["Bild", "Korb", "im Korb", "Erklärung"],
    hinweis: "Der kurze Zusatz steht im Korb, die Erklärung erscheint nach einem Fehler und in der Lösung. Stimmt sie "
      + "biologisch, passt sie zu allen Tieren im Korb (auch zu den Ausnahmen), und verrät der Zusatz nichts Falsches?",
    eintraege: () => Object.entries(KOERBE).filter(([k]) => namen().includes(k)),
    zeile: ([k, b]) => [b.bild, k, b.zusatz, b.erklaerung],
  });

  LS.listenPruefung("tier-sortierer", {
    tierklassen: {
      beschreibung: "Tierklassen: Das Kind legt ein Tier in den Korb seiner Klasse oder wählt zu einer Klasse das passende "
        + `Tier. ${stufenText("klasse")}. Die Spalte „Stufen“ zeigt je Tier, wo es mit seiner Klasse vorkommt.`,
      abschnitte: [
        tiere("klasse", "Tiere und ihre Klasse",
          "Je Korb eine Gruppe. Gehört das Tier biologisch sicher in diese Klasse? Zeigt das Bild eindeutig dieses Tier "
          + "(gleiches Emoji für zwei Tiere, ein allgemeines Bild für eine bestimmte Art)? Ist es für die 3. Klasse bekannt?"),
        knifflig("klasse"),
        koerbe(() => KNIFFLIG_KOERBE.klasse),
      ],
    },
    "saeugetier-gruppen": {
      beschreibung: "Gruppen der Säugetiere: Das Kind legt ein Säugetier in den Korb seiner Gruppe (Nagetier, Hasenartige, "
        + `Raubtier …). ${stufenText("gruppe")}. Die Spalte „Stufen“ zeigt je Tier, wo es mit seiner Gruppe vorkommt.`,
      abschnitte: [
        tiere("gruppe", "Säugetiere und ihre Gruppe",
          "Je Korb eine Gruppe. Stimmt die Gruppe nach den Zähnen und Füssen, wie die Erklärungen sie beschreiben "
          + "(Hasenartige keine Nagetiere, Igel, Maulwurf und Spitzmaus Insektenfresser, Hund und Katze Raubtiere)?",
          t => t.klasse === "Säugetier" || t.gruppe),
        knifflig("gruppe"),
        koerbe(() => KNIFFLIG_KOERBE.gruppe),
      ],
    },
    haltung: {
      beschreibung: "Wildtier, Nutztier oder Heimtier: Das Kind legt ein Tier mit Bild in einen der drei Körbe. "
        + `${stufenText("haltung")}. Tiere ohne eindeutige Haltung (Pferd, Kaninchen …) kommen nicht vor.`,
      abschnitte: [
        tiere("haltung", "Tiere und ihre Haltung",
          "Je Korb eine Gruppe. Ist die Haltung für ein Kind der 2. Klasse eindeutig — auch mit dem Zusatz im Korb "
          + "(„lebt frei“, „gibt uns etwas“, „lebt bei uns“)? Gehört ein Tier mit zwei möglichen Haltungen in die Gruppe "
          + "„nicht eindeutig“? Zeigt das Bild dieses Tier und nicht ein ähnliches mit anderer Haltung?"),
        koerbe(() => HALTUNGEN),
      ],
    },
  });
}
