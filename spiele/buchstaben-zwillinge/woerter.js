// Wortpaare für die Buchstaben-Zwillinge: Die Wörter einer Gruppe unterscheiden sich in einem
// Buchstaben. Das erste Wort ist das gesuchte (mit Bild); die anderen sind Ablenker.
// Der Buchstabensalat nimmt die Wörter der Anlaut-Angel (anlaut-angel/woerter.js).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten der Buchstaben-Zwillinge (Entscheid L4 a), Prüfstand im Katalog
// (spiele/gemeinsam/katalog.js, Eintrag „buchstaben-zwillinge“, Feld listen):
//   „wortpaare“     = WORTPAARE hier (Blitzlesen nimmt sie mit eigener Liste „aehnliche-woerter“)
//   „verwechsler“   = VERWECHSLER hier
//   „salat-woerter“ = ANLAUT_WOERTER in anlaut-angel/woerter.js
// Gross- und Kleinbuchstaben des ABC (Stufe 1) brauchen keine Liste.

const WORTPAARE = [
  [["Hund", "🐕"], "Hand", "Mund"],
  [["Maus", "🐭"], "Haus", "Mais"],
  [["Fisch", "🐟"], "Tisch", "Frisch"],
  [["Hose", "👖"], "Hase", "Rose"],
  [["Nase", "👃"], "Vase", "Hase"],
  [["Bein", "🦵"], "Wein", "Stein"],
  [["Ball", "⚽"], "Wall", "Fall"],
  [["Mond", "🌙"], "Mund", "Hund"],
  [["Kuh", "🐄"], "Schuh", "Kur"],
  [["Hut", "🎩"], "Mut", "Gut"],
  [["Bus", "🚌"], "Bis", "Mus"],
  [["Zahn", "🦷"], "Hahn", "Kahn"],
];

// Buchstaben, die man leicht verwechselt (Stufe 2)
const VERWECHSLER = [["b", "d", "p", "q"], ["m", "n", "u"], ["i", "j", "l"], ["f", "t"], ["h", "n"], ["a", "o", "e"]];
