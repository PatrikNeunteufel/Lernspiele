// Inhalte für „Schwimmt oder sinkt?“ (Lehrplan SG NMG.3.3).
// Bewusst weggelassen, weil es vom einzelnen Ding abhängt: Ei (frisch sinkt, alt schwimmt),
// Orange (mit Schale schwimmt, geschält sinkt), Schwamm, Büroklammer (kann auf dem Wasser liegen bleiben).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a), einzeln freizugeben. Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Spiel „schwimmt-sinkt“, Feld listen); Kinder sehen nur Inhalte aus
// freien Listen.
//   wasser            WASSER_DINGE und WASSER_EINFACH   Schwimmt es oder sinkt es?
//   material          MATERIAL_DINGE                    Aus welchem Material ist das?
//   eigenschaften     STOFF_FRAGEN, Liste im letzten Feld: durchsichtig, Wärme, biegsam, Papier
//   schwimmen-sinken  STOFF_FRAGEN, Liste im letzten Feld: Warum schwimmt ein Schiff aus Stahl? …
const STOFF_LISTEN = ["wasser", "material", "eigenschaften", "schwimmen-sinken"];

// [Bild, Ding, schwimmt?] — Liste wasser
const WASSER_DINGE = [
  ["🪵", "Holzklotz", true], ["🍎", "Apfel", true], ["🍃", "Blatt", true], ["🕯️", "Kerze", true],
  ["🏓", "Tischtennisball", true], ["🪶", "Feder", true], ["🧊", "Eiswürfel", true], ["🍌", "Banane", true],
  ["🪨", "Stein", false], ["🔩", "Schraube", false], ["🔑", "Schlüssel", false], ["🪙", "Münze", false],
  ["🥄", "Löffel aus Metall", false], ["🥔", "Kartoffel", false], ["💍", "Ring", false], ["🔨", "Hammer", false],
];

// Stufe 1 nimmt nur diese ganz eindeutigen Dinge, ab Stufe 2 alle — Liste wasser
const WASSER_EINFACH = ["Holzklotz", "Apfel", "Blatt", "Feder", "Tischtennisball", "Stein", "Schraube", "Hammer", "Münze"];

// Material (Stufe 3): [Bild, Ding, Material] — Liste material
const MATERIAL_DINGE = [
  ["🪵", "Holzklotz", "Holz"], ["🛶", "Holzkanu", "Holz"], ["🔩", "Schraube", "Metall"], ["🔑", "Schlüssel", "Metall"],
  ["🪙", "Münze", "Metall"], ["🫙", "Konfiglas", "Glas"], ["🥛", "Trinkglas", "Glas"], ["🪟", "Fensterscheibe", "Glas"],
  ["🧴", "Shampooflasche", "Kunststoff"], ["🪣", "Kessel aus Plastik", "Kunststoff"], ["📄", "Blatt", "Papier"], ["📦", "Karton", "Papier"], ["📰", "Zeitung", "Papier"],
];

// Fragen: [ab Stufe, Frage, richtig, falsch, falsch, Liste] — Stufe = Spielstufe; Stufe 6 mischt alle
const STOFF_FRAGEN = [
  [4, "Welches Material ist durchsichtig?", "Glas", "Holz", "Metall", "eigenschaften"],
  [4, "Welcher Löffel wird im heissen Tee schnell warm?", "ein Löffel aus Metall", "ein Löffel aus Holz", "ein Löffel aus Kunststoff", "eigenschaften"],
  [4, "Woraus macht man Papier?", "aus Holz", "aus Glas", "aus Metall", "eigenschaften"],
  [4, "Was kann man gut biegen und wieder loslassen?", "ein Gummiband", "eine Glasscheibe", "einen Stein", "eigenschaften"],
  [5, "Ein grosser Holzklotz und ein kleiner Nagel: Was sinkt?", "der kleine Nagel", "der grosse Holzklotz", "beide schwimmen", "schwimmen-sinken"],
  [5, "Warum schwimmt ein grosses Schiff aus Stahl?", "Es hat innen viel Luft.", "Stahl ist leichter als Wasser.", "Weil es so gross ist, sinkt es nie.", "schwimmen-sinken"],
  [5, "Ein Klumpen Knete sinkt. Wie kann er schwimmen?", "Wenn man ein Boot daraus formt.", "Wenn man ihn kleiner macht.", "Wenn man ihn rot anmalt.", "schwimmen-sinken"],
  [5, "Was passiert mit Eis im Wasser?", "Es schwimmt oben.", "Es sinkt auf den Boden.", "Es fliegt davon.", "schwimmen-sinken"],
];
