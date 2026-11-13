/* Prüfansicht der Sachtext-Spurensuche (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „texte“ mit zwei Inhalten, je für sich abzuhaken: die Sachtexte selbst (Text, Abschnitte, Tabelle) und
   die Fragen zu jedem Text. Ein Text hat fünf bis acht Fragen; stünde der Text in jeder Fragezeile, wäre die Ansicht
   kaum lesbar. Darum steht er einmal im Abschnitt „Sachtexte“, die Fragen stehen je Text in einer Gruppe mit seinem
   Titel. Der Fingerabdruck einer Frage nimmt den Text (und die Tabelle) mit: Ändert sich der Text, ist auch der Haken
   seiner Fragen weg — ob eine Antwort aus dem Text folgt, hängt am Text.
   Die Fragen baut das Spiel mit fragenVon (index.html): „Stimmt das?“ mit den Antworten der Stufe (STIMMT, STUFE.fehlt),
   je Abschnitt „Welcher Titel passt am besten zu Abschnitt n?“ mit allen Abschnitts-Titeln und dem Ablenker-Titel.
   Welche Fragearten eine Stufe stellt, steht in STUFE des Spiels.
   Zu prüfen: Stimmen die Sachangaben, folgt die richtige Antwort aus dem Text (bei „folgern“: eindeutig, auch wenn
   sie nicht wörtlich dasteht), ist kein Ablenker auch richtig, und steht bei „steht nicht im Text“ wirklich nichts
   dazu im Text? */
"use strict";
{
  const ART = { angabe: "Angabe im Text", stimmt: "Stimmt das?", titel: "Titel zum ganzen Text", abschnitt: "Titel zu einem Abschnitt",
    folgern: "Folgern", tabelle: "Angabe aus der Tabelle" };
  const stufeVon = t => `s${t.stufe}`;
  const textVon = t => t.text ?? t.abschnitte;
  const textAusVon = t => (t.abschnitte ? t.abschnitte.map(([, text], i) => `Abschnitt ${i + 1}: ${text}`).join(" ") : t.text);
  const tabelleText = tab => (tab ? `${tab.titel ? `${tab.titel} ` : ""}(nach Abschnitt ${tab.nach}): ${[tab.kopf, ...tab.zeilen].map(z => z.join(" | ")).join("; ")}` : "—");
  const gruppeStufe = t => {
    const p = STUFE[stufeVon(t)];
    return `Stufe ${t.stufe} (Fragen: ${p.arten.map(a => ART[a]).join(", ")}${p.fehlt ? "; dazu „steht nicht im Text“" : ""})`;
  };
  /** Die Frage, wie das Spiel sie aus dem Text baut (fragenVon), zum Eintrag. */
  const gebaut = e => {
    const t = SPUREN_TEXTE.find(x => x.titel === e.titel);
    return { t, f: fragenVon(t)[e.frage ? t.fragen.indexOf(e.frage) : t.fragen.length + e.abschnitt - 1] };
  };
  const SPALTEN_FRAGEN = ["Art", "Frage oder Aussage", "richtig", "andere Antworten"];
  const zeileFrage = e => {
    const { t, f } = gebaut(e);
    const gestellt = STUFE[stufeVon(t)].arten.includes(f.art) ? "" : " (in dieser Stufe nie gestellt)";
    if (f.art === "stimmt") {
      const optionen = STUFE[stufeVon(t)].fehlt ? ["ja", "nein", "fehlt"] : ["ja", "nein"];
      return [ART.stimmt + gestellt, f.aussage, STIMMT[f.richtig].text, optionen.filter(o => o !== f.richtig).map(o => STIMMT[o].text).join(" · ")];
    }
    const andere = f.optionen.filter(o => o !== f.richtig).map(o => (f.art !== "abschnitt" ? o
      : o === t.ablenker ? `${o} (passt zu keinem Abschnitt)` : `${o} (Abschnitt ${t.abschnitte.findIndex(a => a[0] === o) + 1})`));
    return [(f.art === "abschnitt" ? `Titel zu Abschnitt ${f.nr}` : ART[f.art]) + gestellt, f.frage, f.richtig, andere.join(" · ")];
  };
  const stufenText = Object.entries(STUFE).map(([s, p]) => `Stufe ${s.slice(1)}: ${p.arten.map(a => ART[a]).join(", ")}${p.fehlt ? " (mit „steht nicht im Text“)" : ""}`).join("; ");
  LS.listenPruefung("sachtext-spurensuche", {
    texte: {
      beschreibung: "Kurze Sachtexte mit Fragen, je Text eine Stufe (Stufe 1 etwa vier Sätze, Stufe 2 fünf bis sechs, ab Stufe 3 "
        + "zwei Abschnitte, ab Stufe 4 oft mit Tabelle). Das Kind liest den Text und beantwortet eine Frage: eine Angabe "
        + "finden, „Stimmt das laut Text?“, den passenden Titel wählen, folgern oder in der Tabelle nachschauen. Fragearten je "
        + `Stufe: ${stufenText}. In Stufe 6 gibt es nur knappe Hinweise.`,
      abschnitte: [{
        id: "sachtexte", titel: "Sachtexte", spalten: ["Titel", "Text", "Tabelle"],
        hinweis: "Je Stufe eine Gruppe. Stimmen die Sachangaben (Zahlen, Namen, Orte)? Sind erfundene Daten (Umfrage, Messung "
          + "einer Klasse) als solche erkennbar? Ist der Text für die Stufe verständlich, und passt die Tabelle zum Text? Die "
          + "Abschnitte stehen im Spiel als „Abschnitt 1“, „Abschnitt 2“ ohne ihre Titel; der Titel des Texts steht darüber "
          + "(ausser bei der Frage nach dem Titel).",
        eintraege: () => SPUREN_TEXTE, gruppe: gruppeStufe,
        zeile: t => [t.titel, textAusVon(t), tabelleText(t.tabelle)],
      }, {
        id: "fragen", titel: "Fragen zu den Texten", spalten: SPALTEN_FRAGEN,
        hinweis: "Je Text eine Gruppe; den Text dazu im Abschnitt „Sachtexte“ nachlesen. Angabe und Tabelle: Die Antwort steht "
          + "so im Text oder in der Tabelle. Folgern: steht nicht wörtlich da, folgt aber eindeutig daraus. Stimmt das: „steht "
          + "nicht im Text“ nur, wenn der Text gar nichts dazu sagt (auch wenn es in Wirklichkeit stimmt). Titel: Der richtige "
          + "Titel passt zum ganzen Text oder Abschnitt, kein anderer passt ebenso. Kein Ablenker darf auch richtig sein.",
        eintraege: () => SPUREN_TEXTE.flatMap(t => [
          ...t.fragen.map(frage => ({ titel: t.titel, text: textVon(t), tabelle: t.tabelle, frage })),
          ...(t.abschnitte || []).map((a, i) => ({ titel: t.titel, text: textVon(t), ablenker: t.ablenker, abschnitt: i + 1 })),
        ]),
        gruppe: e => `Stufe ${gebaut(e).t.stufe} · ${e.titel}`,
        zeile: zeileFrage,
      }],
    },
  });
}
