/* Prüfansicht des Plan-Lesers (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Zwei Listen (plaene.js): Dinge im Schulzimmer und Orte im Quartier, je mit zwei Inhalten, jeder für sich abzuhaken:
   die Dinge mit ihrem Zeichen (PLAN_DINGE) und der Massstab je Stufe (PLAN_MASSSTAB). Das Bild zeigt das Zeichen so,
   wie es in der Legende steht (legendeZeichen mit zeichenSvg des Spiels); die Spalten zeigen den Namen in der Frage,
   in der Legende (legendeName) und mit den Kurzformen vom, zum, zur (kurzformen) — so, wie das Kind sie liest.
   Gruppen: Dinge, die einmal auf dem Plan stehen, und solche mit Mehrzahl, die mehrmals vorkommen (einzelne,
   mehrfache des Spiels). Die Stufen in der Beschreibung liest die Stufentabelle des Spiels (STUFE_ARTEN). */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Aufgabenarten des Spiels (STUFE_ARTEN, erstes Feld) in Worten; angaben = die weiteren Felder. */
  const ART = {
    zeichen: () => "Was bedeutet das Zeichen? (Legende lesen)",
    tippen: () => "ein Ding auf dem Plan antippen (daneben stehen Dinge mit Mehrzahl mehrmals)",
    zaehlen: () => "zählen, wie oft ein Ding mit Mehrzahl auf dem Plan steht",
    lage: zwischen => (zwischen ? "Was ist zwischen … und …?" : "Lage: rechts neben, links neben, über, unter"),
    strecke: () => "Strecke in gerader Linie mit dem Massstab",
    weg: (art, teile) => ({ weglaenge: `Länge eines Wegs aus ${teile} Stücken mit dem Massstab`,
      abbiegen: `links oder rechts abbiegen (Weg aus ${teile} Stücken)`, beschreiben: `Weg aus ${teile} Stücken beschreiben` })[art],
  };
  /** „Stufe 1: … · Stufe 2: ….“; mehrfach genannte Arten (häufiger) nur einmal; Punkt nur, wo kein Fragezeichen steht. */
  const STUFEN_WORTE = (t => (/[.?!]$/.test(t) ? t : `${t}.`))(Object.entries(STUFE_ARTEN)
    .map(([s, arten]) => `Stufe ${nummer(s)}: ${[...new Set(arten.map(([art, ...angaben]) => ART[art](...angaben)))].join("; ")}`)
    .join(" · "));
  /** Stufen (Nummern), in denen eine der Arten vorkommt. */
  const stufenMit = (...arten) => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([art]) => arten.includes(art))).map(nummer).join(", ");

  /** Satz zu den Dingen mit Mehrzahl einer Liste (mehrfache des Spiels) und den Stufen, in denen sie vorkommen. */
  const MEHRZAHL = (liste, wort) => "Jede Aufgabe nimmt eine der freien Listen (Schulzimmer oder Quartier). "
    + `${wort} mit Mehrzahl (${mehrfache(liste).map(i => PLAN_DINGE[liste][i][2]).join(", ")}) kommen nur in den Stufen `
    + `${stufenMit("tippen", "zaehlen")} vor (zählen und als weitere Zeichen beim Antippen), alle anderen in jeder Stufe.`;
  /** Zeichen wie in der Legende, etwas grösser. */
  const zeichenBild = e => {
    const svg = legendeZeichen(e);
    svg.style.setProperty("width", "40px");
    svg.style.setProperty("height", "40px");
    return svg;
  };
  /** Abschnitt „Dinge und Zeichen“ einer Liste; wort = „Ding“ oder „Ort“. */
  const dinge = (liste, titel, wort, hinweis) => ({
    id: "ding", titel, hinweis, bild: zeichenBild,
    spalten: [wort, "neben … · vom … · zum …", "Mehrzahl", "in der Legende"],
    eintraege: () => PLAN_DINGE[liste],
    gruppe: e => (e[2] ? "kommt mehrmals vor (mit Mehrzahl)" : "kommt einmal vor"),
    zeile: e => [e[0], `${e[1]} · ${kurzformen(`von ${e[1]}`)} · ${kurzformen(`zu ${e[1]}`)}`, e[2] || "—", legendeName(e)],
  });
  /** Abschnitt „Massstab“ einer Liste: je Stufe die Meter je Feld und die Grösse des ganzen Plans (N × N Felder). */
  const massstab = (liste, hinweis) => ({
    id: "massstab", titel: "Massstab je Stufe", hinweis,
    spalten: ["Stufe", "1 Feld =", `ganzer Plan (${N} × ${N} Felder)`],
    eintraege: () => Object.entries(PLAN_MASSSTAB[liste]),
    zeile: ([s, werte]) => [nummer(s), werte.map(meter).join(" oder "), werte.map(m => `${meter(N * m)} × ${meter(N * m)}`).join(" oder ")],
  });

  const ZEICHEN_HINWEIS = "Unterscheidet sich jedes Zeichen in der Form deutlich von den anderen der Liste (die Farbe allein "
    + "genügt nicht)? Passt es zum Ding, oder lädt es zu einer falschen Deutung ein (ein Kreuz kennen Kinder als Kirche, ein H "
    + "als Haltestelle oder Spital)? Stimmen Artikel, Dativ und die Kurzformen vom, zum, zur? Stimmt die Mehrzahl in "
    + "„Wie viele … hat es auf dem Plan?“, und steht in der Legende der Name ohne Artikel richtig?";
  const MASSSTAB_HINWEIS = `Strecken und Wege messen (Stufen ${stufenMit("strecke", "weg")}): Felder zählen mal Meter je Feld. `
    + "Ist der Massstab glaubhaft — passt die Grösse des ganzen Plans zu dem, was er zeigt?";

  LS.listenPruefung("plan-leser", {
    schulzimmer: {
      beschreibung: "Plan eines Schulzimmers: Dinge mit ihrem Zeichen in der Legende. Das Kind liest die Legende, findet "
        + `Dinge auf dem Plan, beschreibt ihre Lage und misst Strecken und Wege. ${STUFEN_WORTE} ${MEHRZAHL("schulzimmer", "Dinge")}`,
      abschnitte: [
        dinge("schulzimmer", "Dinge und Zeichen", "Ding", "Gehört das Ding in ein Schulzimmer der Primarschule, und ist der "
          + "Name der, den Kinder in der Deutschschweiz kennen (Lavabo, Türe, Wandtafel)? " + ZEICHEN_HINWEIS),
        massstab("schulzimmer", MASSSTAB_HINWEIS + " Ist ein Schulzimmer so gross wie der ganze Plan?"),
      ],
    },
    quartier: {
      beschreibung: "Plan eines Quartiers: Orte mit ihrem Zeichen in der Legende. Das Kind liest die Legende, findet Orte "
        + `auf dem Plan, beschreibt ihre Lage und misst Strecken und Wege. ${STUFEN_WORTE} ${MEHRZAHL("quartier", "Orte")}`,
      abschnitte: [
        dinge("quartier", "Orte und Zeichen", "Ort", "Gibt es den Ort in einem Quartier, und ist der Name der, den Kinder "
          + "in der Deutschschweiz kennen (Spital, Feuerwehrdepot, Weiher)? " + ZEICHEN_HINWEIS),
        massstab("quartier", MASSSTAB_HINWEIS + " Haben Schule, Kirche, Bahnhof, Spital und Weiher auf so viel Platz "
          + "Raum?"),
      ],
    },
  });
}
