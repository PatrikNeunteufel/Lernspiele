// Inhalte der Preis-Tabelle (Lehrplan SG MA.3.A.3). Preise in Rappen; die Bereiche sollen ungefähr
// zu Schweizer Kiosk- und Ladenpreisen passen, damit die Tabellen glaubwürdig bleiben.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen.
//
// Inhaltslisten (Entscheid L4 a), einzeln von der Aufsicht freigegeben; der Prüfstand steht im
// Katalog (spiele/gemeinsam/katalog.js, Eintrag preis-tabelle, Feld listen):
//   stueckware    ARTIKEL       (Stufe 2–6)
//   gewichtsware  WARE_GEWICHT  (Stufe 5 und 6)
//   folgen        FOLGEN        (Stufe 1)
// Die Zahlen in den Tabellen erzeugt das Spiel.

// Ware je Stück: [Bild, Einzahl, Mehrzahl, kleinster Stückpreis, grösster Stückpreis] (Rp.)
const ARTIKEL = [
  ["🥐", "Gipfeli", "Gipfeli", 80, 250],
  ["🍎", "Apfel", "Äpfel", 40, 150],
  ["✏️", "Bleistift", "Bleistifte", 50, 250],
  ["📒", "Heft", "Hefte", 100, 450],
  ["🍦", "Glace", "Glaces", 150, 500],
  ["🧃", "Saft", "Säfte", 100, 300],
  ["🥨", "Brezel", "Brezeln", 100, 300],
  ["🖍️", "Farbstift", "Farbstifte", 60, 200],
  ["🎈", "Ballon", "Ballone", 30, 150],
  ["🍌", "Banane", "Bananen", 30, 100],
  ["⚽", "Ball", "Bälle", 500, 900],
  ["📕", "Buch", "Bücher", 800, 2000],
  ["🎟️", "Eintritt in die Badi", "Eintritte in die Badi", 300, 800],
  ["🧦", "Paar Socken", "Paar Socken", 400, 900],
];

// Ware nach Gewicht: [Bild, Name, kleinster Preis für 100 g, grösster Preis für 100 g] (Rp.)
const WARE_GEWICHT = [
  ["🧀", "Käse", 180, 450],
  ["🍬", "Gummibärchen", 120, 300],
  ["🍒", "Kirschen", 80, 250],
  ["🥜", "Nüsse", 150, 400],
  ["🍫", "Schoggi", 150, 350],
  ["🍪", "Guetzli", 120, 300],
];

// Folgen in Tabellen (Stufe 1): [Bild, Spalte links, Spalte rechts, Geld?, Satz zur Frage].
// Bei Geld steht rechts ein Frankenbetrag, sonst eine Zahl.
const FOLGEN = [
  ["🐷", "Woche", "im Sparschwein", true, "Jede Woche kommt gleich viel Geld ins Sparschwein."],
  ["💰", "Monat", "gespart", true, "Jeden Monat wird gleich viel gespart."],
  ["📖", "Tag", "Seiten gelesen", false, "Jeden Tag werden gleich viele Seiten gelesen."],
  ["🌻", "Woche", "Höhe in cm", false, "Die Sonnenblume wächst jede Woche gleich viel."],
  ["🧱", "Stockwerk", "Klötze", false, "Für jedes Stockwerk braucht es gleich viele Klötze."],
];
