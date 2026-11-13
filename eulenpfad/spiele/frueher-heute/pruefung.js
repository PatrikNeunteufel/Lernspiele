/* Prüfansicht von „Früher und heute“ (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Drei Listen aus dinge.js, je ein Abschnitt: Paare (FH_PAARE), Reihen (FH_REIHEN) und „Gab es das schon?“
   (FH_GROSSELTERN). Paare und Reihen sind nach ihrer Gruppe gruppiert (Schlüssel wie in dinge.js), denn Ablenker kommen
   nur aus anderen Gruppen. Was das Spiel aus den Rohdaten rechnet, zeigt die Ansicht mit seinen Funktionen: die Körbe
   in Stufe 1 (korbDinge), die Ablenker (paarAblenker, dazwischenAblenker), die Antwort ja/nein (gabEs, GAB_ES) und die
   Stufen (STUFE_ARTEN). Zu prüfen: zeitliche Einordnung (was kam zuerst, gab es das um 1966 bzw. 1926 schon), ist
   kein Ablenker ebenso richtig, zeigt das Bild eindeutig das Ding. Bilder „svg:…“ zeichnet die Ansicht selbst. */
"use strict";
{
  /** Aufgabenarten des Spiels (STUFE_ARTEN: Art und Angaben) in Worten, mit der Liste, aus der sie schöpfen. */
  const ART = {
    korb: { liste: "paare", text: () => "Ding in den Korb „früher“ oder „heute“ legen" },
    paar: { liste: "paare", text: (vor, n) => `${vor ? "zum Ding von früher das heutige" : "zum Ding von heute das frühere"} wählen (${n} Knöpfe)` },
    ordnen: { liste: "reihen", text: ganz => (ganz ? "eine ganze Reihe ordnen" : "drei Dinge einer Reihe ordnen (aus einer Reihe mit vier fällt eins weg)") },
    dazwischen: { liste: "reihen", text: () => "Was kam dazwischen? (eins aus drei)" },
    gross: { liste: "grosseltern", text: jahre => `„Gab es das vor etwa ${jahre} Jahren schon?“` },
  };
  /** „Stufe 1: …; Stufe 3: …“ für die Arten einer Liste; mehrfach genannte Arten nur einmal. */
  const stufenText = liste => Object.entries(STUFE_ARTEN)
    .map(([s, arten]) => [s, [...new Set(arten.filter(([art]) => ART[art].liste === liste).map(([art, ...angaben]) => ART[art].text(...angaben)))]])
    .filter(([, texte]) => texte.length).map(([s, texte]) => `Stufe ${s.slice(1)}: ${texte.join("; ")}`).join(" · ");
  /** Jahre, nach denen „Gab es das schon?“ fragt (aus STUFE_ARTEN). */
  const JAHRE = [...new Set(Object.values(STUFE_ARTEN).flat().filter(([art]) => art === "gross").map(([, j]) => j))].sort((a, b) => a - b);
  const mitBild = ([bild, name]) => `${bild} ${name}`;
  const gruppe = e => `Gruppe ${e[0]}`;

  LS.listenPruefung("frueher-heute", {
    paare: {
      beschreibung: "Ein Ding von früher und eins von heute, die dieselbe Arbeit machen. " + stufenText("paare") + ". "
        + "In Stufe 1 kommt das Ding von früher nur in den Korb, wenn es eindeutig von früher ist (Spalte „Stufe 1“).",
      abschnitte: [{
        id: "paar", titel: "Paare",
        spalten: ["Bild früher", "früher", "Bild heute", "heute", "Stufe 1: Körbe", "Ablenker zu „heute“", "Ablenker zu „früher“"],
        hinweis: "Je Gruppe ein Block; die Ablenker kommen aus den anderen Gruppen. Macht das Ding von heute wirklich "
          + "dieselbe Arbeit wie das von früher? Ist das Ding von früher wirklich alt (und nicht heute noch üblich — sonst "
          + "darf es nicht in den Korb „früher“)? Passt keiner der Ablenker ebenso? Zeigt jedes Bild eindeutig das Ding?",
        eintraege: () => FH_PAARE, gruppe,
        zeile: e => [e[1], e[2], e[3], e[4],
          korbDinge([e]).map(([, name, korb]) => `${name}: ${KORB[korb].text}`).join(" · "),
          paarAblenker(FH_PAARE, e, true).join(", "), paarAblenker(FH_PAARE, e, false).join(", ")],
      }],
    },
    reihen: {
      beschreibung: "Drei oder vier Dinge zum selben Thema, vom ältesten zum neusten. " + stufenText("reihen") + ".",
      abschnitte: [{
        id: "reihe", titel: "Reihen", spalten: ["Thema", "vom ältesten zum neusten", "Ablenker bei „Was kam dazwischen?“"],
        hinweis: "Je Gruppe ein Block; die Ablenker kommen aus Reihen anderer Gruppen. Stimmt die Reihenfolge sicher (auch "
          + "wenn aus einer Reihe mit vier ein Ding wegfällt)? Kam jedes Ding wirklich nach dem vorherigen auf? Passt kein "
          + "Ablenker ebenso zwischen zwei Nachbarn der Reihe? Zeigt jedes Bild eindeutig das Ding?",
        eintraege: () => FH_REIHEN, gruppe,
        zeile: e => [e[1], e[2].map(mitBild).join(" → "),
          [...new Map(dazwischenAblenker(FH_REIHEN, e).map(d => [d[1], d])).values()].map(mitBild).join(", ")],
      }],
    },
    grosseltern: {
      beschreibung: `Gab es das schon vor etwa ${JAHRE.join(" bzw. ")} Jahren, als die Grosseltern bzw. Urgrosseltern Kinder `
        + "waren? " + stufenText("grosseltern") + `. Das Kind legt das Ding in den Korb „${GAB_ES.ja.text}“ oder „${GAB_ES.nein.text}“.`,
      abschnitte: [{
        id: "ding", titel: "Dinge", spalten: ["Bild", "Ding", ...JAHRE.map(j => `vor etwa ${j} Jahren`)],
        hinweis: "Gruppiert nach den Antworten. Stimmt die Antwort für jedes Jahr? Ist sie eindeutig — auch wenn man "
          + "fragt, ob es das Ding damals nur schon erfunden oder schon in vielen Familien gab, und unabhängig vom genauen "
          + "Geburtsjahr der Grosseltern? Zeigt das Bild eindeutig das Ding?",
        eintraege: () => FH_GROSSELTERN,
        gruppe: e => JAHRE.map(j => `vor ${j} Jahren ${GAB_ES[gabEs(e, j)].text}`).join(" · "),
        zeile: e => [e[0], e[1], ...JAHRE.map(j => GAB_ES[gabEs(e, j)].text)],
      }],
    },
  });
}
