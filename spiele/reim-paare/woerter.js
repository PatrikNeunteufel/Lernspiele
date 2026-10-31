// Reimgruppen für Reim-Paare: Wörter einer Gruppe reimen sich (gleich klingend ab dem betonten
// Selbstlaut). Bild = Emoji oder null (dann nur in der Königsstufe, Stufe 6, mit Lesetext).
// Bewusst weggelassen: Paare, die nur in manchen Aussprachen reimen (Bär – Meer).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).

const REIMGRUPPEN = [
  [["Maus", "🐭"], ["Haus", "🏠"]],
  [["Hund", "🐕"], ["Mund", "👄"]],
  [["Kuh", "🐄"], ["Schuh", "👟"]],
  [["Hose", "👖"], ["Rose", "🌹"], ["Dose", "🥫"]],
  [["Nase", "👃"], ["Hase", "🐇"], ["Vase", "🏺"]],
  [["Bein", "🦵"], ["Schwein", "🐖"], ["Stein", "🪨"]],
  [["Sonne", "☀️"], ["Tonne", "🛢️"]],
  [["Brille", "👓"], ["Grille", "🦗"]],
  [["Wal", "🐋"], ["Schal", "🧣"]],
  [["Fliege", "🪰"], ["Ziege", "🐐"], ["Wiege", null]],
  [["Tanne", "🌲"], ["Pfanne", "🍳"], ["Kanne", null]],
  [["Igel", "🦔"], ["Spiegel", "🪞"], ["Ziegel", "🧱"]],
  [["Biene", "🐝"], ["Schiene", "🛤️"]],
  [["Nuss", "🥜"], ["Bus", "🚌"], ["Kuss", "💋"]],
  [["Zahn", "🦷"], ["Hahn", "🐓"], ["Kran", "🏗️"]],
  [["Hand", "✋"], ["Sand", "🏖️"]],
  [["Flasche", "🍾"], ["Tasche", "👜"]],
  [["Fee", "🧚"], ["Tee", "🍵"], ["Schnee", "❄️"], ["Klee", "🍀"]],
  [["Ei", "🥚"], ["Hai", "🦈"]],
  [["Licht", "💡"], ["Gesicht", "🙂"]],
  [["Kamm", null], ["Schwamm", "🧽"], ["Lamm", "🐑"]],
  [["Wurm", "🪱"], ["Turm", "🗼"], ["Sturm", "🌪️"]],
  [["Leiter", "🪜"], ["Reiter", "🏇"]],
  [["Topf", "🍲"], ["Kopf", null], ["Zopf", null]],
  [["Mücke", "🦟"], ["Brücke", "🌉"], ["Lücke", null]],
];

// Verse für Stufe 5 und 6: Das fehlende Wort reimt sich auf ein Wort im Vers
// (Stufe 5 nur Verse, deren Lösung ein Bild hat).
const REIMVERSE = [
  ["Die kleine Maus wohnt in einem ___.", "Haus"],
  ["Die Kuh sucht ihren ___.", "Schuh"],
  ["Der Hase hat eine lange ___.", "Nase"],
  ["Die Ziege fängt eine ___.", "Fliege"],
  ["Der Hahn sitzt auf dem ___.", "Kran"],
  ["Der Wal trägt einen warmen ___.", "Schal"],
  ["Die Biene fliegt über die ___.", "Schiene"],
  ["Der Igel schaut in den ___.", "Spiegel"],
  ["Im Winter fällt der Schnee, die Fee trinkt heissen ___.", "Tee"],
  ["Der Wurm kriecht auf den ___.", "Turm"],
  ["In der Tasche ist eine ___.", "Flasche"],
  ["Das Lamm sucht den ___.", "Kamm"],
  ["Der Hund hat einen grossen ___.", "Mund"],
  ["Ich sehe die Grille durch meine ___.", "Brille"],
];
