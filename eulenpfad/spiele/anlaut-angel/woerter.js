// Wörter für die Anlaut-Angel, mit Bild. Nur Wörter, bei denen man den Buchstaben auch hört:
// keine Anlaute V (Vogel = F-Laut), Sch, St, Sp, Pf, Ch, Au/Ei/Eu; keine Endlaute b, d, g (Hund
// klingt am Ende wie t), -er (Tiger klingt am Ende wie a), -h (Kuh) und -e (Hase).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a) — je Konstante eine Liste, der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Eintrag „anlaut-angel“, Feld listen):
//   ANLAUT_WOERTER = Liste „anlaut“, ENDLAUT_WOERTER = „endlaut“, MITTE_WOERTER = „mitte“,
//   LUECKEN_WOERTER = „luecke“.
// ANLAUT_WOERTER brauchen auch Blitzlesen (Liste „einzelwoerter“) und Buchstaben-Zwillinge
// (Liste „salat-woerter“); dort wird die Liste je Spiel freigegeben.

// Anfangslaut = erster Buchstabe
const ANLAUT_WOERTER = [
  ["Affe", "🐒"], ["Apfel", "🍎"], ["Ameise", "🐜"], ["Ananas", "🍍"],
  ["Ball", "⚽"], ["Banane", "🍌"], ["Biene", "🐝"], ["Baum", "🌳"], ["Bus", "🚌"], ["Brot", "🍞"],
  ["Dose", "🥫"], ["Delfin", "🐬"], ["Drache", "🐉"],
  ["Ente", "🦆"], ["Esel", "🫏"], ["Elefant", "🐘"],
  ["Fisch", "🐟"], ["Fuchs", "🦊"], ["Feder", "🪶"], ["Frosch", "🐸"],
  ["Gabel", "🍴"], ["Giraffe", "🦒"], ["Gurke", "🥒"], ["Geschenk", "🎁"],
  ["Hund", "🐕"], ["Haus", "🏠"], ["Hut", "🎩"], ["Hase", "🐇"], ["Herz", "❤️"],
  ["Igel", "🦔"], ["Insel", "🏝️"],
  ["Katze", "🐈"], ["Kuh", "🐄"], ["Kerze", "🕯️"], ["Krone", "👑"], ["Kamel", "🐫"],
  ["Löwe", "🦁"], ["Leiter", "🪜"], ["Lama", "🦙"], ["Löffel", "🥄"],
  ["Maus", "🐭"], ["Mond", "🌙"], ["Melone", "🍈"],
  ["Nase", "👃"], ["Nuss", "🥜"], ["Nest", "🪺"],
  ["Ohr", "👂"], ["Orange", "🍊"], ["Oktopus", "🐙"],
  ["Pilz", "🍄"], ["Pinguin", "🐧"], ["Pizza", "🍕"], ["Palme", "🌴"],
  ["Rose", "🌹"], ["Ring", "💍"], ["Rakete", "🚀"],
  ["Sonne", "☀️"], ["Sofa", "🛋️"], ["Socke", "🧦"], ["Salat", "🥗"],
  ["Tomate", "🍅"], ["Tiger", "🐅"], ["Tasse", "☕"], ["Torte", "🎂"],
  ["Uhr", "⌚"], ["Ufo", "🛸"],
  ["Wal", "🐋"], ["Wolke", "☁️"], ["Wurm", "🪱"],
  ["Zebra", "🦓"], ["Zahn", "🦷"], ["Zug", "🚆"], ["Zitrone", "🍋"],
];

// Endlaut = letzter Buchstabe, und man hört ihn auch so
const ENDLAUT_WOERTER = [
  ["Ball", "⚽"], ["Igel", "🦔"], ["Esel", "🫏"], ["Apfel", "🍎"], ["Kamel", "🐫"], ["Wal", "🐋"],
  ["Baum", "🌳"], ["Wurm", "🪱"], ["Zahn", "🦷"], ["Kran", "🏗️"],
  ["Maus", "🐭"], ["Bus", "🚌"], ["Eis", "🍦"], ["Haus", "🏠"], ["Nuss", "🥜"],
  ["Brot", "🍞"], ["Hut", "🎩"], ["Nest", "🪺"], ["Salat", "🥗"], ["Boot", "⛵"],
  ["Schaf", "🐑"], ["Auto", "🚗"], ["Ufo", "🛸"], ["Sofa", "🛋️"], ["Zebra", "🦓"], ["Lama", "🦙"], ["Pizza", "🍕"],
  ["Kiwi", "🥝"], ["Taxi", "🚕"], ["Känguru", "🦘"], ["Herz", "❤️"], ["Pilz", "🍄"],
];

// Einsilbige Wörter mit einem Selbstlaut in der Mitte
const MITTE_WOERTER = [
  ["Hut", "🎩"], ["Bus", "🚌"], ["Nuss", "🥜"], ["Wurm", "🪱"], ["Zug", "🚆"],
  ["Mond", "🌙"], ["Topf", "🍲"], ["Boot", "⛵"],
  ["Ball", "⚽"], ["Wal", "🐋"], ["Zahn", "🦷"], ["Schaf", "🐑"], ["Hand", "✋"],
  ["Fisch", "🐟"], ["Pilz", "🍄"], ["Ring", "💍"],
  ["Bett", "🛏️"], ["Nest", "🪺"], ["Herz", "❤️"], ["Stern", "⭐"],
];

// Lautgetreue Wörter für „Welcher Buchstabe fehlt?“
const LUECKEN_WOERTER = [
  ["Nase", "👃"], ["Hose", "👖"], ["Rose", "🌹"], ["Dose", "🥫"], ["Sofa", "🛋️"], ["Lama", "🦙"],
  ["Hut", "🎩"], ["Wal", "🐋"], ["Igel", "🦔"], ["Banane", "🍌"], ["Tomate", "🍅"], ["Kamel", "🐫"],
  ["Rakete", "🚀"], ["Esel", "🫏"], ["Salat", "🥗"], ["Melone", "🍈"], ["Zebra", "🦓"], ["Pilz", "🍄"],
];
