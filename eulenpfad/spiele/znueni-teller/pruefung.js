/* Prüfansicht des Znüni-Tellers (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Die Lebensmittel zeigen den Korb mit seinem Namen im Spiel (GRUPPEN_ZNUENI), nicht den Schlüssel der Rohdaten —
   „Süsses“ heisst im Korb „Süsses und Salziges“ (Bemerkung 53). Die Spalte „Stufe 1, 2, 6“ rechnet wie das Spiel:
   Süsses und Salziges nur ab und zu, alles andere jeden Tag; Eiweiss fragt diese Art nicht. */
"use strict";
const ZT_ALLTAG = ["Frucht", "Gemüse", "Getränk", "Stärke", "Süsses"];
const ztKorb = g => `${GRUPPEN_ZNUENI[g]?.bild || ""} ${GRUPPEN_ZNUENI[g]?.name || g}`.trim();
const ztAlltag = g => (!ZT_ALLTAG.includes(g) ? "—" : g === "Süsses" ? "nur ab und zu" : "jeden Tag");
const ztFragen = liste => () => ZNUENI_FRAGEN.filter(f => f[4] === liste);

LS.listenPruefung("znueni-teller", {
  lebensmittel: {
    beschreibung: "Lebensmittel und ihre Körbe (Stufen 1–4 und 6): Das Kind legt ein Lebensmittel in den Korb „jeden Tag“ "
      + "oder „nur ab und zu“ (Stufen 1, 2, 6), ordnet Frucht oder Gemüse (Stufe 2) oder wählt die Gruppe (Stufen 3, 4, 6; "
      + "in Stufe 6 mit allen sechs Körben). Bei einem Fehler zeigt das Spiel die Erklärung des Korbs.",
    abschnitte: [{
      id: "lebensmittel", titel: "Lebensmittel", spalten: ["Bild", "Name", "Jeden Tag?"],
      hinweis: "Je Korb eine Gruppe (Name wie im Spiel). Passt das Bild zum Namen, gehört das Lebensmittel eindeutig in "
        + "diesen Korb, und stimmt „jeden Tag“ oder „nur ab und zu“?",
      eintraege: () => LEBENSMITTEL, gruppe: ([, , g]) => ztKorb(g),
      zeile: ([bild, name, g]) => [bild, name, ztAlltag(g)],
    }, {
      id: "gruppen", titel: "Körbe und Erklärungen", spalten: ["Bild", "Korb", "Erklärung"],
      hinweis: "Die Erklärung erscheint nach einem Fehler. Stimmt sie, und passt sie zu allen Lebensmitteln im Korb?",
      eintraege: () => Object.entries(GRUPPEN_ZNUENI), zeile: ([, g]) => [g.bild, g.name, g.erklaerung],
    }],
  },
  znuenis: {
    beschreibung: "Welches Znüni ist ausgewogen? (Stufen 4–6): Das Kind wählt aus drei Tellern den ausgewogenen.",
    abschnitte: [{
      id: "znueni", titel: "Teller", spalten: ["Ausgewogen", "Nicht ausgewogen", "Nicht ausgewogen"],
      hinweis: "Ist der erste Teller ausgewogen und sind die beiden anderen es klar nicht?",
      eintraege: () => ZNUENIS, zeile: teller => teller.map(t => t.join(" ")),
    }],
  },
  ernaehrung: {
    beschreibung: "Fragen zu Wasser, Vitaminen, Kraft und Wachsen (Stufen 5 und 6): eine richtige und zwei falsche Antworten.",
    abschnitte: [{
      id: "frage", titel: "Fragen", spalten: ["Frage", "Richtig", "Falsch", "Falsch"],
      hinweis: "Ist die Antwort richtig und sind die beiden anderen eindeutig falsch?",
      eintraege: ztFragen("ernaehrung"), zeile: ([frage, r, f1, f2]) => [frage, r, f1, f2],
    }],
  },
  "region-saison": {
    beschreibung: "Fragen zu regionalen und saisonalen Lebensmitteln (Stufen 5 und 6): eine richtige und zwei falsche Antworten.",
    abschnitte: [{
      id: "frage", titel: "Fragen", spalten: ["Frage", "Richtig", "Falsch", "Falsch"],
      hinweis: "Ist die Antwort richtig und sind die beiden anderen eindeutig falsch?",
      eintraege: ztFragen("region-saison"), zeile: ([frage, r, f1, f2]) => [frage, r, f1, f2],
    }],
  },
});
