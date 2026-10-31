// Dinge für die Wortgruppen in Stufe 5 von Blitzlesen („drei Birnen“): [Einzahl, Mehrzahl, ein/eine, Bild]
// Die Einzelwörter kommen aus anlaut-angel/woerter.js, die ähnlichen Wörter aus buchstaben-zwillinge/woerter.js.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten von Blitzlesen (Entscheid L4 a), Prüfstand im Katalog (spiele/gemeinsam/katalog.js,
// Eintrag „blitzlesen“, Feld listen):
//   „einzelwoerter“      = ANLAUT_WOERTER in anlaut-angel/woerter.js
//   „aehnliche-woerter“  = WORTPAARE in buchstaben-zwillinge/woerter.js
//   „wortgruppen“        = ZAEHLDINGE hier (ZAHLWOERTER sind keine Liste, nur die Zahlwörter 1–5)

const ZAEHLDINGE = [
  ["Apfel", "Äpfel", "ein", "🍎"],
  ["Birne", "Birnen", "eine", "🍐"],
  ["Stern", "Sterne", "ein", "⭐"],
  ["Ball", "Bälle", "ein", "⚽"],
  ["Fisch", "Fische", "ein", "🐟"],
  ["Herz", "Herzen", "ein", "❤️"],
  ["Blume", "Blumen", "eine", "🌸"],
];
const ZAHLWOERTER = ["", "eins", "zwei", "drei", "vier", "fünf"];
