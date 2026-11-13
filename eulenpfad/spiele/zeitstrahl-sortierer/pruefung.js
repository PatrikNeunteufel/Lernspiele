/* Prüfansicht des Zeitstrahl-Sortierers (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Vier Listen aus zeitstrahl.js. Gemischte Listen haben je Inhalt einen Abschnitt: Lebensabschnitte (ZS_ABSCHNITTE)
   getrennt von den Ereignissen im Leben mit Alter (ZS_LEBEN), die Zeitalter (ZS_EPOCHEN) getrennt von ihren Merkmalen
   (ZS_MERKMALE). Wo die Reihenfolge die Lösung ist, steht der Platz in der Liste dabei. Die Ereignisse sind nach dem
   Zeitalter gruppiert, das im Spiel gefragt wird (Übergang: nicht gefragt), mit dem Jahrhundert, wie das Spiel es
   rechnet (jahrhundert, jahrhundertText); die Personen nach Generation, mit dem Fürwort der Frage „Wie alt wird …?“
   (pronomen). Beschreibungen und die Spalte „Stufen“ lesen die Stufentabelle des Spiels (STUFE_ARTEN) mit den Listen
   je Art (ART_LISTEN) und seiner Auswahl je Art (NIMMT; bei den Personen die Generationen der Art). */
"use strict";
{
  const nummer = s => s.slice(1);
  const GENERATION = ["Kind", "Eltern", "Grosseltern", "Urgrosseltern"]; // Bedeutung von 0–3 in ZS_GENERATIONEN
  /** Aufgabenarten des Spiels (STUFE_ARTEN) in Worten, mit ihren Angaben. */
  const ART = {
    abschnitte: n => `${n} Lebensabschnitte ordnen`,
    leben: n => `${n} Ereignisse im Leben ordnen`,
    geburtstag: () => "„In welchem Jahr wird ein Kind …?“ (Geburtsjahr plus Alter)",
    generationen: gens => `drei Personen aus ${gens.length} Generationen von der ältesten zur jüngsten ordnen`,
    genStrahl: gens => `Geburtsjahr auf dem Zeitstrahl ablesen (Familie mit ${gens.length} Generationen)`,
    alter: gens => `„Wie alt wird … im Jahr ${JETZT}?“ (${gens.length} Generationen)`,
    unterschied: gens => `„Wie viele Jahre älter ist …?“ (${gens.length} Generationen)`,
    ereignisse: n => `${n} Ereignisse nach der Jahrzahl ordnen`,
    buchstabe: () => "das Ereignis als Buchstabe auf dem Zeitstrahl finden",
    jahrhundert: () => "„In welchem Jahrhundert war das?“",
    epocheJahr: () => "„In welchem Zeitalter war das?“ zum Ereignis",
    epochen: () => "die Zeitalter ordnen",
    merkmal: () => "„In welchem Zeitalter war das?“ zum Merkmal",
    pfeil: () => "Jahr am Pfeil ablesen",
  };
  /** „Stufe 1: … · Stufe 5: …“ für die Arten, die die Liste brauchen (ART_LISTEN). */
  const stufenText = liste => Object.entries(STUFE_ARTEN).map(([s, arten]) => {
    const texte = [...new Set(arten.filter(([art]) => ART_LISTEN[art].includes(liste)).map(([art, ...angaben]) => ART[art](...angaben)))];
    return texte.length ? `Stufe ${nummer(s)}: ${texte.join("; ")}` : null;
  }).filter(Boolean).join(" · ");
  /** Nimmt die Art den Eintrag? Arten mit Generationen: seine Generation ist dabei; sonst NIMMT des Spiels (fehlt: alle). */
  const nimmt = (art, e, angaben, mitAuswahl) => {
    if (!mitAuswahl) return true;
    if (ART_LISTEN[art].includes("generationen")) return angaben[0].includes(e[0]);
    return NIMMT[art] ? NIMMT[art](e) : true;
  };
  /** Stufen, in denen eine der Arten den Eintrag nimmt; mitAuswahl false: die Art zeigt alle Einträge (Antworten). */
  const stufenVon = (arten, e, mitAuswahl = true) => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([art, ...angaben]) => arten.includes(art) && nimmt(art, e, angaben, mitAuswahl)))
    .map(nummer).join(", ") || "—";
  const gross = s => s[0].toUpperCase() + s.slice(1);

  LS.listenPruefung("zeitstrahl-sortierer", {
    lebensabschnitte: {
      beschreibung: "Lebensabschnitte vom Baby bis zu alten Menschen und Ereignisse im Leben eines Kindes (Kanton St. Gallen) "
        + `mit dem Alter, in dem sie geschehen. ${stufenText("lebensabschnitte")}. Die Spalte „Stufen“ zeigt je Eintrag, wo er vorkommt.`,
      abschnitte: [{
        id: "abschnitt", titel: "Lebensabschnitte", spalten: ["Platz", "Bild", "Lebensabschnitt", "Stufen"],
        hinweis: "Der Platz ist die Lösung beim Ordnen: vom jüngsten zum ältesten. Ist die Reihenfolge eindeutig (Kleinkind vor "
          + "Schulkind, Jugendliche vor Erwachsenen)? Zeigt das Bild klar den Lebensabschnitt, auch neben den anderen (das Kind "
          + "ordnet drei davon)?",
        eintraege: () => ZS_ABSCHNITTE,
        zeile: e => [String(ZS_ABSCHNITTE.indexOf(e) + 1), e[0], e[1], stufenVon(["abschnitte"], e)],
      }, {
        id: "leben", titel: "Ereignisse im Leben", spalten: ["Alter", "Bild", "Ereignis", "Stufen"],
        hinweis: "Stimmt das Alter für den Kanton St. Gallen (Kindergarten mit 4, 1. Klasse mit 6, 4. Klasse mit 9, Oberstufe mit 12, "
          + "volljährig mit 18)? Bei „In welchem Jahr wird ein Kind …?“ rechnet das Kind Geburtsjahr plus dieses Alter — die Geburt "
          + "kommt dort nicht vor. Passt der Satz hinter „Mit 4 Jahren: …“? Zeigt das Bild das Ereignis?",
        eintraege: () => ZS_LEBEN,
        zeile: e => [`${e[0]} Jahre`, e[1], e[2], stufenVon(["leben", "geburtstag"], e)],
      }],
    },
    generationen: {
      beschreibung: "Personen einer erfundenen Familie, je Generation. Das Spiel wählt je Generation eine Person und rechnet die "
        + `Geburtsjahre aus (25 bis 35 Jahre Abstand). ${stufenText("generationen")}. Die Spalte „Stufen“ zeigt je Person, wo sie vorkommt.`,
      abschnitte: [{
        id: "person", titel: "Personen", spalten: ["Bild", "Person", "Fürwort", "Stufen"],
        hinweis: "Je Generation eine Gruppe. Gehört die Person in diese Generation? Steht der Artikel richtig, und passt das Fürwort "
          + "in „… ist 1985 geboren. Wie alt wird sie im Jahr 2026?“? Wirkt das Bild so alt wie die Generation — und sind "
          + "Grosseltern und Urgrosseltern auf dem Zeitstrahl nebeneinander auseinanderzuhalten?",
        eintraege: () => ZS_GENERATIONEN,
        gruppe: e => `${e[0]}: ${GENERATION[e[0]] || "?"}`,
        zeile: e => [e[1], gross(e[2]), pronomen(e[2]), stufenVon(["generationen", "genStrahl", "alter", "unterschied"], e)],
      }],
    },
    ereignisse: {
      beschreibung: "Ereignisse mit Jahrzahl aus der Schweiz, St. Gallen und der Welt. Das Spiel zeigt die Jahrzahl, wie sie in der "
        + `Spalte steht, und ordnet nach dem Jahr zum Ordnen. ${stufenText("ereignisse")}. Beim Buchstaben liegen die vier Ereignisse `
        + "mindestens 150 Jahre auseinander. Das Zeitalter wird nur gefragt, wo es eindeutig ist (Gruppe „Übergang“: nicht gefragt). "
        + "Die Spalte „Stufen“ zeigt je Ereignis, wo es vorkommt.",
      abschnitte: [{
        id: "ereignis", titel: "Ereignisse", spalten: ["Bild", "Jahrzahl", "Jahr zum Ordnen", "Ereignis", "Jahrhundert", "Stufen"],
        hinweis: "Je Zeitalter, wie das Spiel es fragt, eine Gruppe. Stimmt die Jahrzahl (gängiger Wert in Schulbüchern), und ist "
          + "der Satz sachlich richtig und eindeutig — gilt er genau für dieses Jahr (etwa „erste Eisenbahn der Schweiz“ 1847)? "
          + "Gehört das Ereignis eindeutig in dieses Zeitalter? Stimmt das Jahrhundert? Liegen zwei Ereignisse so nah, dass das "
          + "Ordnen ohne die Jahrzahl strittig wäre (die Jahrzahl steht beim Ordnen immer dabei)? Zeigt das Bild etwas aus der "
          + "Zeit des Ereignisses, und gleicht es keinem Bild eines Zeitalters, das als Antwort dasteht?",
        eintraege: () => ZS_EREIGNISSE,
        gruppe: e => e[4],
        zeile: e => [e[2], e[1], String(e[0]), e[3], jahrhundertText(jahrhundert(e[0])),
          stufenVon(["ereignisse", "buchstabe", "jahrhundert", "epocheJahr"], e)],
      }],
    },
    epochen: {
      beschreibung: "Die Zeitalter Steinzeit, Römerzeit, Mittelalter und Neuzeit und Merkmale, an denen man sie erkennt. "
        + `${stufenText("epochen")}. Die Zeitalter stehen dabei immer alle vier als Antworten da, mit ihrem Bild.`,
      abschnitte: [{
        id: "zeitalter", titel: "Zeitalter", spalten: ["Platz", "Bild", "Zeitalter", "Stufen"],
        hinweis: "Der Platz ist die Lösung beim Ordnen: vom ältesten zum neusten. Stimmt die Reihenfolge? Zeigt das Bild etwas, das "
          + "für dieses Zeitalter typisch ist — und nicht dasselbe Bild wie ein Ereignis oder Merkmal eines anderen Zeitalters "
          + "(sonst führt das Bild der Frage zur falschen Antwort)?",
        eintraege: () => ZS_EPOCHEN,
        zeile: e => [String(ZS_EPOCHEN.indexOf(e) + 1), e[0], e[1], stufenVon(["epochen", "epocheJahr", "merkmal"], e, false)],
      }, {
        id: "merkmal", titel: "Merkmale der Zeitalter", spalten: ["Bild", "Merkmal", "Stufen"],
        hinweis: "Je Zeitalter eine Gruppe. Gehört das Merkmal eindeutig in dieses Zeitalter und in keines der anderen drei (das "
          + "Kind wählt aus allen vier)? Passt der Satz hinter „… In welchem Zeitalter war das?“? Zeigt das Bild das Merkmal, ohne "
          + "die Antwort zu verraten (gleiches Bild wie das Zeitalter)?",
        eintraege: () => ZS_MERKMALE,
        gruppe: e => e[0],
        zeile: e => [e[1], e[2], stufenVon(["merkmal"], e)],
      }],
    },
  });
}
