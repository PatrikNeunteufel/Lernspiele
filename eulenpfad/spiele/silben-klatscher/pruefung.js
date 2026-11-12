/* Prüfansicht des Silben-Klatschers (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Silbenzahl eine Liste (SILBEN_WOERTER), je Liste ein Abschnitt; die Spalten zeigen das Wort, wie das Kind es sieht,
   die Silben, wie das Spiel sie anzeigt (silbenText), und ihre Zahl. Zu prüfen: Sind es Sprechsilben, wie man sie klatscht
   (E-le-fant, nicht Ele-fant), stimmt die Silbenzahl, und passt das Bild eindeutig zum Wort? */
"use strict";
{
  const zeile = ([getrennt, bild]) => [bild, getrennt.replace(/-/g, ""), silbenText(getrennt.split("-")), getrennt.split("-").length];
  const HINWEIS = "Sprechsilben, wie man sie klatscht — nicht die Trennung am Zeilenende. Das Bild muss ohne Lesen zum Wort führen.";
  const abschnitt = (liste, titel, hinweis = "") => ({
    id: liste, titel, spalten: ["Bild", "Wort", "Silben", "Anzahl"], hinweis: HINWEIS + hinweis,
    eintraege: () => SILBEN_WOERTER[liste], zeile,
  });
  const TRENNUNG = " Ab Stufe 4 bietet das Spiel daneben falsche Silbenbögen an (eine Grenze um einen Buchstaben verschoben): Die richtige Trennung muss klar die einzige sein.";
  LS.listenPruefung("silben-klatscher", {
    "eine-silbe": {
      beschreibung: "Wörter mit einer Silbe: Das Kind klatscht und zählt (Stufen 1–3); in Stufe 3 auch als Bild mit anderer Silbenzahl bei „Welches Wort hat … Silben?“.",
      abschnitte: [abschnitt("eine-silbe", "Eine Silbe", " Genau ein Klatscher — kein Wort, das man zweisilbig sprechen kann.")],
    },
    "zwei-silben": {
      beschreibung: "Wörter mit zwei Sprechsilben: klatschen und zählen (Stufen 1–4), „Welches Wort hat zwei Silben?“ (3), die richtigen Silbenbögen finden (4, 5).",
      abschnitte: [abschnitt("zwei-silben", "Zwei Silben", TRENNUNG)],
    },
    "drei-silben": {
      beschreibung: "Wörter mit drei Sprechsilben: klatschen und zählen (Stufen 2–4), „Welches Wort hat drei Silben?“ (3), Silbenbögen finden (4, 5) und Silben der Reihe nach antippen (5).",
      abschnitte: [abschnitt("drei-silben", "Drei Silben", TRENNUNG)],
    },
    "vier-silben": {
      beschreibung: "Wörter mit vier Sprechsilben: klatschen und zählen (Stufen 3, 4), „Welches Wort hat vier Silben?“ (3), Silbenbögen finden (4–6) und Silben der Reihe nach antippen (5, Königsstufe 6).",
      abschnitte: [abschnitt("vier-silben", "Vier Silben", TRENNUNG)],
    },
    "fuenf-silben": {
      beschreibung: "Wörter mit fünf Sprechsilben: klatschen und zählen (Stufe 4), Silbenbögen finden (4–6) und Silben der Reihe nach antippen (5, Königsstufe 6); in Stufe 3 auch als Bild mit anderer Silbenzahl.",
      abschnitte: [abschnitt("fuenf-silben", "Fünf Silben", TRENNUNG)],
    },
  });
}
