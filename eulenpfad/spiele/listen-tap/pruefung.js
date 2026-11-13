/* Prüfansicht von Listen & Tap (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Nur die zwei eigenen Listen aus hoeren.js: „anweisungen“ und „wo-ist“. Die sechs übrigen Listen (Farben, Tiere,
   Zahlen, Essen, Familie und Körper, Schule) leiht das Spiel von Word-Match (Verweis im Katalog); sie werden dort in
   word-match/pruefung.js geprüft.
   „anweisungen“ hat drei Inhalte, je für sich abzuhaken: die Farben (mit ihren drei Bildern), die Formen und die Anfänge
   der Anweisung. „wo-ist“ hat zwei: die Tiere und die Orte; das Bild eines Orts zeichnet das Spiel selbst (bildInhalt in
   index.html, hier mit der Katze). Die gesprochenen Sätze bauen dieselben Funktionen wie die Aufgabe (anweisungSatz,
   woSatz); welche Anfänge eine Stufe nimmt, sagt VERBEN_JE_STUFE des Spiels.
   Zu prüfen: Ist die Anweisung korrektes, natürliches britisches Englisch, zeigt das Bild eindeutig das Gemeinte, und ist
   keine andere Figur unter den Antworten ebenso richtig? */
"use strict";
{
  const FORM_DE = { circle: "Kreis", square: "Quadrat", heart: "Herz" };
  const DING_DE = { table: "Tisch", box: "Kiste" };
  /** Szene, wie das Spiel sie auf den Antwortknopf zeichnet (bildInhalt, index.html). */
  const szene = (tier, ding, praep) => bildInhalt({ art: "wo" }, ort(tier, ding, praep));
  LS.listenPruefung("listen-tap", {
    anweisungen: {
      beschreibung: "Englische Anweisungen mit Farbe und Form („Touch the red heart.“). Die Eule spricht die Anweisung, das "
        + "Kind tippt auf das passende Bild; unter den Bildern sind immer dieselbe Farbe in anderer Form und dieselbe Form in "
        + "anderer Farbe. Stufen 3 und 4: vier Bilder, nur „Touch the …“ (in Stufe 3 neben Einzelwörtern, in Stufe 4 neben "
        + "„Wo ist das Tier?“). Stufen 5 und 6: sechs Bilder, alle Anfänge („Point to the …“, „Find the …“).",
      abschnitte: [{
        id: "farben", titel: "Farben mit ihren Bildern", spalten: ["Farbe", "circle · square · heart", "Anweisungen"],
        hinweis: "Hat jedes Bild klar diese Farbe und diese Form — auch neben den anderen Farben (orange, brown, red; purple, "
          + "blue)? Sonst wäre ein Ablenker in derselben Form ebenso richtig. Weiss fehlt mit Absicht (auf weissen Knöpfen "
          + "schlecht zu sehen). Britische Schreibweise der Farbwörter.",
        eintraege: () => Object.entries(ANWEISUNG_FARBEN),
        zeile: ([farbe, bilder]) => [farbe, bilder.join(" "),
          ANWEISUNG_FORMEN.map((form, i) => `${bilder[i]} „${anweisungSatz(ANWEISUNG_VERBEN[0], farbe, form)}“`).join(" · ")],
      }, {
        id: "formen", titel: "Formen", spalten: ["Form", "deutsch", "Bilder in allen Farben"],
        hinweis: "Ist die Form in jeder Farbe klar zu erkennen (Kreis rund, Quadrat eckig, Herz)? Die Bilder einer Form stehen "
          + "an derselben Stelle in jeder Farbe.",
        eintraege: () => ANWEISUNG_FORMEN,
        zeile: form => [form, FORM_DE[form] || "—",
          Object.values(ANWEISUNG_FARBEN).map(b => b[ANWEISUNG_FORMEN.indexOf(form)]).join(" ")],
      }, {
        id: "anfaenge", titel: "Anfänge der Anweisung", spalten: ["Anfang", "Beispiel", "Stufen"],
        hinweis: "Ist jeder Anfang mit Farbe und Form ein natürlicher britischer Auftrag an ein Kind? Der erste gilt ab "
          + "Stufe 3, die übrigen erst ab Stufe 5.",
        eintraege: () => ANWEISUNG_VERBEN,
        zeile: verb => [verb, anweisungSatz(verb, "red", "heart"),
          Object.keys(VERBEN_JE_STUFE).filter(s => ANWEISUNG_VERBEN.indexOf(verb) < VERBEN_JE_STUFE[s]).map(s => s.slice(1)).join(", ")],
      }],
    },
    "wo-ist": {
      beschreibung: "Sätze wie „The cat is under the table.“: Die Eule spricht den Satz, das Kind tippt auf das Bild, auf dem "
        + "das Tier an diesem Ort ist (on, under, next to the table; in, on, next to the box). Stufe 4: vier Bilder mit "
        + "demselben Tier, nur der Ort ändert sich. Stufe 5: vier Bilder, Tier und Ort ändern sich (mindestens dasselbe Tier "
        + "an einem anderen Ort und ein anderes Tier am selben Ort). Stufe 6: sechs Bilder.",
      abschnitte: [{
        id: "tiere", titel: "Tiere", spalten: ["Bild", "Tier", "Satz"],
        hinweis: "Ist das Tier am Bild eindeutig zu erkennen und von den anderen Tieren zu unterscheiden (duck und bird)?",
        eintraege: () => WO_TIERE,
        zeile: ([tier, bild]) => [bild, tier, woSatz(tier, "on", "table")],
      }, {
        id: "orte", titel: "Orte (vom Spiel gezeichnet)", spalten: ["Ort", "Satz"], bild: ([ding, praep]) => szene(WO_TIERE[0][0], ding, praep),
        hinweis: "Je Ding eine Gruppe; das Bild zeigt den Ort mit der Katze, wie das Spiel ihn zeichnet. Zeigt jedes Bild "
          + "eindeutig diese Lage — und lässt es sich von den anderen Lagen desselben Dings unterscheiden (in und on the "
          + "box)? Die Bilder stehen im Spiel nebeneinander.",
        eintraege: () => WO_ORTE,
        gruppe: ([ding]) => `${ding} (${DING_DE[ding] || ding})`,
        zeile: ([ding, praep]) => [`${praep} the ${ding}`, woSatz(WO_TIERE[0][0], praep, ding)],
      }],
    },
  });
}
