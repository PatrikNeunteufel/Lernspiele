// Zusammengesetzte Nomen für das Nomen-Puzzle (Lehrplan SG D.5.D.1.b).
// teile: [Artikel, Wort, Bild] in der richtigen Reihenfolge (Bestimmungswort vorne, Grundwort hinten)
// ganz: [Artikel, zusammengesetztes Wort]; falsch: falsch zusammengesetzte Formen (nur bei Fugenlauten)
// Das Grundwort (der letzte Teil) bestimmt den Artikel.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).

const KOMPOSITA = [
  { teile: [["das", "Haus", "🏠"], ["die", "Tür", "🚪"]], ganz: ["die", "Haustür"] },
  { teile: [["der", "Fuss", "🦶"], ["der", "Ball", "⚽"]], ganz: ["der", "Fussball"] },
  { teile: [["der", "Schnee", "❄️"], ["der", "Mann", "🧑"]], ganz: ["der", "Schneemann"] },
  { teile: [["der", "Regen", "🌧️"], ["der", "Schirm", "⛱️"]], ganz: ["der", "Regenschirm"] },
  { teile: [["der", "Apfel", "🍎"], ["der", "Baum", "🌳"]], ganz: ["der", "Apfelbaum"] },
  { teile: [["der", "Zahn", "🦷"], ["die", "Bürste", "🖌️"]], ganz: ["die", "Zahnbürste"] },
  { teile: [["das", "Feuer", "🔥"], ["das", "Holz", "🪵"]], ganz: ["das", "Feuerholz"] },
  { teile: [["der", "Mond", "🌙"], ["das", "Licht", "💡"]], ganz: ["das", "Mondlicht"] },
  { teile: [["die", "Hand", "✋"], ["der", "Schuh", "👟"]], ganz: ["der", "Handschuh"] },
  { teile: [["das", "Eis", "🧊"], ["der", "Bär", "🐻"]], ganz: ["der", "Eisbär"] },
  { teile: [["die", "Nacht", "🌃"], ["das", "Hemd", "👕"]], ganz: ["das", "Nachthemd"] },
  { teile: [["das", "Wasser", "💧"], ["die", "Flasche", "🍾"]], ganz: ["die", "Wasserflasche"] },
  { teile: [["der", "Sand", "🏖️"], ["die", "Burg", "🏰"]], ganz: ["die", "Sandburg"] },
  { teile: [["der", "Vogel", "🐦"], ["das", "Nest", "🪺"]], ganz: ["das", "Vogelnest"] },
  // mit Fugenlaut oder verkürztem ersten Teil (Stufe 5)
  { teile: [["die", "Sonne", "☀️"], ["die", "Blume", "🌸"]], ganz: ["die", "Sonnenblume"], falsch: ["Sonneblume", "Sonnesblume"] },
  { teile: [["der", "Hund", "🐕"], ["die", "Hütte", "🛖"]], ganz: ["die", "Hundehütte"], falsch: ["Hundhütte", "Hundshütte"] },
  { teile: [["der", "Geburtstag", "🎉"], ["der", "Kuchen", "🎂"]], ganz: ["der", "Geburtstagskuchen"], falsch: ["Geburtstagkuchen", "Geburtstagekuchen"] },
  { teile: [["die", "Schule", "🏫"], ["die", "Tasche", "🎒"]], ganz: ["die", "Schultasche"], falsch: ["Schuletasche", "Schulestasche"] },
  // drei Teile (Stufe 5)
  { teile: [["der", "Fuss", "🦶"], ["der", "Ball", "⚽"], ["der", "Schuh", "👟"]], ganz: ["der", "Fussballschuh"] },
  { teile: [["das", "Haus", "🏠"], ["die", "Tür", "🚪"], ["der", "Schlüssel", "🔑"]], ganz: ["der", "Haustürschlüssel"] },
  { teile: [["die", "Sonne", "☀️"], ["die", "Blume", "🌸"], ["der", "Kern", "🌰"]], ganz: ["der", "Sonnenblumenkern"], falsch: ["Sonneblumekern", "Sonnenblumekern"] },
];
