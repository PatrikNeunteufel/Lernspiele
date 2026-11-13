// Inhalte für den Instrumenten-Kenner (Lehrplan SG MU.4.C.1).
// [Bild (Emoji oder svg:<name>), Name, Gruppe, Spielweise, genauere Gruppe oder null, auch, auchGruppe]
// auch: weitere Spielweisen, die ebenso richtig sind; das Spiel stellt sie nie als falsche Antwort daneben
// (Geige und Cello zupft man auch, Pizzicato; die Handglocke schwingt oder schüttelt man; im Klavier schlagen Hämmer).
// auchGruppe: weitere Gruppen, die ebenso richtig sind (Stufe 3); nie als falscher Korb daneben (IK2 a: das Klavier
// hat Saiten und Hämmer, gespielt wird es über die Tasten).
// Gruppe: Schlaginstrument, Saiteninstrument, Blasinstrument, Tasteninstrument
// Saxofon und Querflöte sind aus Metall, zählen aber zu den Holzblasinstrumenten (Ton mit Rohrblatt
// bzw. Anblaskante, nicht mit den Lippen wie bei Blechblasinstrumenten).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a), einzeln freizugeben. Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Spiel „instrumente“, Feld listen); Kinder sehen nur Inhalte aus
// freien Listen.
//   schlag     Instrumente der Gruppe Schlaginstrument   } die Liste eines Instruments ergibt
//   saiten     Instrumente der Gruppe Saiteninstrument   } sich aus seiner Gruppe (Spalte 3,
//   blas       Instrumente der Gruppe Blasinstrument     } INSTRUMENT_LISTE_JE_GRUPPE)
//   tasten     Instrumente der Gruppe Tasteninstrument   }
//   ensembles  Fragen zu Duo, Trio … Orchester  } letztes Feld jeder Frage
//   klang      Fragen zur Klangerzeugung         }
const INSTRUMENT_LISTEN = ["schlag", "saiten", "blas", "tasten", "ensembles", "klang"];
const INSTRUMENT_LISTE_JE_GRUPPE = { Schlaginstrument: "schlag", Saiteninstrument: "saiten", Blasinstrument: "blas", Tasteninstrument: "tasten" };

const INSTRUMENTE = [
  ["🥁", "Trommel", "Schlaginstrument", "schlagen", null],
  ["🪇", "Rasseln", "Schlaginstrument", "schütteln", null],
  ["🔔", "Glocke", "Schlaginstrument", "schlagen", null, ["schütteln"]],
  ["svg:triangel", "Triangel", "Schlaginstrument", "schlagen", null],
  ["svg:klangstab", "Klangstab", "Schlaginstrument", "schlagen", null],
  ["svg:schlagholz", "Schlaghölzer", "Schlaginstrument", "schlagen", null],
  ["🎸", "Gitarre", "Saiteninstrument", "zupfen", "Zupfinstrument"],
  ["🎻", "Geige", "Saiteninstrument", "streichen", "Streichinstrument", ["zupfen"]],
  [null, "Cello", "Saiteninstrument", "streichen", "Streichinstrument", ["zupfen"]],
  [null, "Harfe", "Saiteninstrument", "zupfen", "Zupfinstrument"],
  ["🎹", "Klavier", "Tasteninstrument", "Tasten drücken", null, ["schlagen"], ["Saiteninstrument", "Schlaginstrument"]],
  ["🎺", "Trompete", "Blasinstrument", "blasen", "Blechblasinstrument"],
  [null, "Posaune", "Blasinstrument", "blasen", "Blechblasinstrument"],
  ["🎷", "Saxofon", "Blasinstrument", "blasen", "Holzblasinstrument"],
  ["🪈", "Blockflöte", "Blasinstrument", "blasen", "Holzblasinstrument"],
  [null, "Querflöte", "Blasinstrument", "blasen", "Holzblasinstrument"],
  [null, "Klarinette", "Blasinstrument", "blasen", "Holzblasinstrument"],
];

// Fragen (Stufe 5 und 6): [Frage, richtig, falsch, falsch, Liste]
const INSTRUMENT_FRAGEN = [
  // Liste ensembles
  ["Wie viele Musikerinnen und Musiker spielen in einem Duo?", "zwei", "drei", "vier", "ensembles"],
  ["Wie viele spielen in einem Trio?", "drei", "zwei", "fünf", "ensembles"],
  ["Wie viele spielen in einem Quartett?", "vier", "drei", "acht", "ensembles"],
  ["Wie viele spielen in einem Quintett?", "fünf", "vier", "sechs", "ensembles"], // NEU in LERN_Session2, UNGEPRÜFT
  ["Wer leitet ein Orchester?", "die Dirigentin oder der Dirigent", "die Pianistin oder der Pianist", "das Publikum", "ensembles"],
  ["Welche Instrumente spielen in einem Streichquartett?", "zwei Geigen, Bratsche und Cello", "vier Trompeten", "Klavier und drei Trommeln", "ensembles"],
  // Liste klang
  ["Was schwingt bei der Gitarre, wenn ein Ton erklingt?", "die Saite", "der Gurt", "das Plektrum", "klang"],
  ["Eine Saite wird kürzer gegriffen. Wie klingt der Ton?", "höher", "tiefer", "gleich", "klang"],
  ["Was schwingt bei der Trommel?", "das Fell", "der Stuhl", "der Notenständer", "klang"],
  // NEU in LERN_Session2 (Klangerzeugung, auch für die Königsstufe), UNGEPRÜFT
  ["Wie entsteht der Ton bei der Trompete?", "Die Lippen schwingen im Mundstück.", "Ein Rohrblatt schwingt.", "Eine Saite schwingt.", "klang"],
  ["Wie entsteht der Ton bei der Klarinette?", "Ein Rohrblatt schwingt am Mundstück.", "Die Lippen schwingen wie bei der Trompete.", "Man zupft eine Saite.", "klang"],
  ["Wie entsteht der Ton beim Klavier?", "Kleine Hämmer schlagen auf Saiten.", "Luft strömt durch Pfeifen.", "Man zupft die Saiten mit den Fingern.", "klang"],
];
