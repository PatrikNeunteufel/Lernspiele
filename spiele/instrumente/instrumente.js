// Inhalte für den Instrumenten-Kenner (Lehrplan SG MU.4.C.1).
// [Bild (Emoji oder svg:<name>), Name, Gruppe, Spielweise, genauere Gruppe oder null]
// Gruppe: Schlaginstrument, Saiteninstrument, Blasinstrument, Tasteninstrument
// Saxofon und Querflöte sind aus Metall, zählen aber zu den Holzblasinstrumenten (Ton mit Rohrblatt
// bzw. Anblaskante, nicht mit den Lippen wie bei Blechblasinstrumenten).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).

const INSTRUMENTE = [
  ["🥁", "Trommel", "Schlaginstrument", "schlagen", null],
  ["🪇", "Rasseln", "Schlaginstrument", "schütteln", null],
  ["🔔", "Glocke", "Schlaginstrument", "schlagen", null],
  ["svg:triangel", "Triangel", "Schlaginstrument", "schlagen", null],
  ["svg:klangstab", "Klangstab", "Schlaginstrument", "schlagen", null],
  ["svg:schlagholz", "Schlaghölzer", "Schlaginstrument", "schlagen", null],
  ["🎸", "Gitarre", "Saiteninstrument", "zupfen", "Zupfinstrument"],
  ["🎻", "Geige", "Saiteninstrument", "streichen", "Streichinstrument"],
  [null, "Cello", "Saiteninstrument", "streichen", "Streichinstrument"],
  [null, "Harfe", "Saiteninstrument", "zupfen", "Zupfinstrument"],
  ["🎹", "Klavier", "Tasteninstrument", "Tasten drücken", null],
  ["🎺", "Trompete", "Blasinstrument", "blasen", "Blechblasinstrument"],
  [null, "Posaune", "Blasinstrument", "blasen", "Blechblasinstrument"],
  ["🎷", "Saxofon", "Blasinstrument", "blasen", "Holzblasinstrument"],
  ["🪈", "Blockflöte", "Blasinstrument", "blasen", "Holzblasinstrument"],
  [null, "Querflöte", "Blasinstrument", "blasen", "Holzblasinstrument"],
  [null, "Klarinette", "Blasinstrument", "blasen", "Holzblasinstrument"],
];

// Fragen (Stufe 5 und 6): [Frage, richtig, falsch, falsch]
const INSTRUMENT_FRAGEN = [
  ["Wie viele Musikerinnen und Musiker spielen in einem Duo?", "zwei", "drei", "vier"],
  ["Wie viele spielen in einem Trio?", "drei", "zwei", "fünf"],
  ["Wie viele spielen in einem Quartett?", "vier", "drei", "acht"],
  ["Wer leitet ein Orchester?", "die Dirigentin oder der Dirigent", "der Pianist", "das Publikum"],
  ["Welche Instrumente spielen in einem Streichquartett?", "zwei Geigen, Bratsche und Cello", "vier Trompeten", "Klavier und drei Trommeln"],
  ["Was schwingt bei der Gitarre, wenn ein Ton erklingt?", "die Saite", "der Gurt", "das Plektrum allein"],
  ["Eine Saite wird kürzer gegriffen. Wie klingt der Ton?", "höher", "tiefer", "gleich"],
  ["Was schwingt bei der Trommel?", "das Fell", "der Stuhl", "die Luft im Zimmer allein"],
  // NEU in LERN_Session2 (Klangerzeugung, auch für die Königsstufe), UNGEPRÜFT
  ["Wie viele spielen in einem Quintett?", "fünf", "vier", "sechs"],
  ["Wie entsteht der Ton bei der Trompete?", "Die Lippen schwingen im Mundstück.", "Ein Rohrblatt schwingt.", "Eine Saite schwingt."],
  ["Wie entsteht der Ton bei der Klarinette?", "Ein Rohrblatt schwingt am Mundstück.", "Die Lippen schwingen wie bei der Trompete.", "Man zupft eine Saite."],
  ["Wie entsteht der Ton beim Klavier?", "Kleine Hämmer schlagen auf Saiten.", "Luft strömt durch Pfeifen.", "Man zupft die Saiten mit den Fingern."],
];
