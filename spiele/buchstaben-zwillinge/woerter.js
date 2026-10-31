// Wortpaare für die Buchstaben-Zwillinge: Die Wörter einer Gruppe unterscheiden sich in einem
// Buchstaben. Das erste Wort ist das gesuchte (mit Bild); die anderen sind Ablenker.
// Der Buchstabensalat nimmt die Wörter der Anlaut-Angel (anlaut-angel/woerter.js).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).

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
