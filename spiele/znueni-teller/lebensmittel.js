// Inhalte für den Znüni-Teller (Lehrplan SG NMG.1.3). Gruppen angelehnt an die übliche
// Einteilung der Ernährungslehre; bewusst ohne Grenzfälle (Tomate, Gurke, Mais, Kartoffel bei
// „Früchte oder Gemüse“).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a), einzeln freizugeben. Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Spiel „znueni-teller“, Feld listen); Kinder sehen nur Inhalte aus
// freien Listen.
//   lebensmittel   LEBENSMITTEL und GRUPPEN_ZNUENI   Lebensmittel, ihre Gruppe und die Erklärungen
//   znuenis        ZNUENIS                           Welches Znüni ist ausgewogen?
//   ernaehrung     ZNUENI_FRAGEN, Liste im letzten Feld: Wasser, Vitamine, Kraft, Wachsen
//   region-saison  ZNUENI_FRAGEN, Liste im letzten Feld: was bei uns wächst, wann, woher
const ZNUENI_LISTEN = ["lebensmittel", "znuenis", "ernaehrung", "region-saison"];

// [Bild, Name, Gruppe]; Gruppe: Getränk, Frucht, Gemüse, Getreide, Eiweiss, Süsses
const LEBENSMITTEL = [
  ["💧", "Wasser", "Getränk"], ["🍵", "Tee ohne Zucker", "Getränk"],
  ["🍎", "Apfel", "Frucht"], ["🍐", "Birne", "Frucht"], ["🍌", "Banane", "Frucht"], ["🍒", "Kirschen", "Frucht"],
  ["🍓", "Erdbeere", "Frucht"], ["🍇", "Trauben", "Frucht"], ["🍊", "Orange", "Frucht"],
  ["🥕", "Karotte", "Gemüse"], ["🥦", "Brokkoli", "Gemüse"], ["🥬", "Salat", "Gemüse"], ["🧅", "Zwiebel", "Gemüse"], ["🧄", "Knoblauch", "Gemüse"],
  ["🍞", "Brot", "Getreide"], ["🍝", "Teigwaren", "Getreide"], ["🍚", "Reis", "Getreide"], ["🥔", "Kartoffel", "Getreide"],
  ["🥛", "Milch", "Eiweiss"], ["🧀", "Käse", "Eiweiss"], ["🥚", "Ei", "Eiweiss"], ["🐟", "Fisch", "Eiweiss"], ["🍗", "Poulet", "Eiweiss"],
  ["🍫", "Schokolade", "Süsses"], ["🍬", "Bonbon", "Süsses"], ["🍩", "Donut", "Süsses"], ["🥤", "Süssgetränk", "Süsses"], ["🍪", "Guetsli", "Süsses"], ["🍟", "Pommes frites", "Süsses"],
];

// Gruppen: Name im Korb und Erklärung
const GRUPPEN_ZNUENI = {
  Getränk: { bild: "💧", name: "Getränke", erklaerung: "Am meisten brauchst du Wasser oder ungesüssten Tee." },
  Frucht: { bild: "🍎", name: "Früchte", erklaerung: "Früchte wachsen an Bäumen und Sträuchern und geben viele Vitamine." },
  Gemüse: { bild: "🥕", name: "Gemüse", erklaerung: "Gemüse sind Blätter, Wurzeln oder Knollen von Pflanzen — voller Vitamine." },
  Getreide: { bild: "🍞", name: "Brot, Teigwaren, Kartoffeln", erklaerung: "Brot, Teigwaren, Reis und Kartoffeln geben Kraft für lange Zeit." },
  Eiweiss: { bild: "🥚", name: "Milch, Ei, Fisch, Fleisch", erklaerung: "Milch, Käse, Eier, Fisch und Fleisch helfen beim Wachsen." },
  Süsses: { bild: "🍬", name: "Süsses und Salziges", erklaerung: "Süsses und Salziges schmeckt gut — aber nur ab und zu und wenig." },
};

// Znüni zur Wahl (Stufe 4): [ausgewogen, nicht ausgewogen, nicht ausgewogen] — je eine Liste von Bildern
const ZNUENIS = [
  [["🍎", "🍞", "💧"], ["🍫", "🥤"], ["🍬", "🍩", "🥤"]],
  [["🥕", "🧀", "🍞"], ["🍟", "🥤"], ["🍪", "🍫"]],
  [["🍌", "🥛"], ["🍩", "🥤"], ["🍬", "🍪", "🍫"]],
  [["🍐", "🥚", "💧"], ["🍫", "🍪"], ["🍟", "🍬"]],
];

// Wissensfragen (Stufe 5): [Frage, richtig, falsch, falsch, Liste]
const ZNUENI_FRAGEN = [
  ["Was trinkst du am besten, wenn du Durst hast?", "Wasser", "Süssgetränk", "Sirup mit viel Zucker", "ernaehrung"],
  ["Was gibt dir viele Vitamine?", "Früchte und Gemüse", "Bonbons", "Pommes frites", "ernaehrung"],
  ["Was gibt dir lange Kraft für die Schule?", "Brot und Teigwaren", "Bonbons", "Süssgetränk", "ernaehrung"],
  ["Was hilft dem Körper beim Wachsen?", "Milch, Käse und Eier", "Schokolade", "Bonbons", "ernaehrung"],
  ["Wovon solltest du am wenigsten essen?", "Süsses und Salziges", "Gemüse", "Früchte", "ernaehrung"],
  ["Welche Frucht wächst auch in der Schweiz?", "Apfel", "Banane", "Ananas", "region-saison"],
  ["Wann gibt es Erdbeeren aus der Schweiz?", "im Frühsommer", "im Winter", "an Weihnachten", "region-saison"],
  ["Woher kommt ein Lebensmittel aus der Region?", "von einem Bauernhof in der Nähe", "aus einem fernen Land", "aus dem Meer weit weg", "region-saison"],
];
