/* Wort-Zwillinge: Parallelwörter Englisch–Deutsch — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS1E.2.B.1.b: Parallelwörter, Namen und Zahlen beim Lesen erkennen.
   Britische Schreibweise; Deutsch in Schweizer Schreibweise (ss statt ß).

   Inhaltslisten (Entscheid L4 a), einzeln freizugeben; der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Spiel „wort-zwillinge“, Feld listen):
   - „gleich“:   fast gleich geschrieben (hand – Hand, zebra – Zebra)
   - „aehnlich“: ähnlich, mit Lautverschiebung (house – Haus, water – Wasser)
   - „falsche-freunde“: sehen deutsch aus, bedeuten aber etwas anderes (gift = Geschenk, nicht Gift)

   ZWILLINGE: [englisch, deutsch, Bild oder null, Liste] — Bild nur, wo das Emoji eindeutig ist.
   FALSCHE_FREUNDE: [englisch, Bedeutung auf Deutsch, deutsches Wort, das gleich aussieht, Bild oder null]. */

const ZWILLINGE_LISTEN = ["gleich", "aehnlich", "falsche-freunde"];

const ZWILLINGE = [
  // gleich: fast gleich geschrieben
  ["hand", "Hand", "✋", "gleich"], ["ball", "Ball", "⚽", "gleich"], ["baby", "Baby", "👶", "gleich"],
  ["banana", "Banane", "🍌", "gleich"], ["tomato", "Tomate", "🍅", "gleich"], ["zebra", "Zebra", "🦓", "gleich"],
  ["kangaroo", "Känguru", "🦘", "gleich"], ["pizza", "Pizza", "🍕", "gleich"], ["guitar", "Gitarre", "🎸", "gleich"],
  ["hamster", "Hamster", "🐹", "gleich"], ["elephant", "Elefant", "🐘", "gleich"], ["giraffe", "Giraffe", "🦒", "gleich"],
  ["crocodile", "Krokodil", "🐊", "gleich"], ["camel", "Kamel", "🐫", "gleich"], ["tiger", "Tiger", "🐯", "gleich"],
  ["bus", "Bus", "🚌", "gleich"], ["taxi", "Taxi", "🚕", "gleich"], ["butter", "Butter", "🧈", "gleich"],
  ["chocolate", "Schokolade", "🍫", "gleich"], ["rocket", "Rakete", "🚀", "gleich"], ["robot", "Roboter", "🤖", "gleich"],
  ["penguin", "Pinguin", "🐧", "gleich"], ["dolphin", "Delfin", "🐬", "gleich"], ["salad", "Salat", "🥗", "gleich"],
  ["finger", "Finger", null, "gleich"], ["arm", "Arm", null, "gleich"], ["winter", "Winter", null, "gleich"],
  ["name", "Name", null, "gleich"],
  // aehnlich: anders geschrieben, aber verwandt (Lautverschiebung)
  ["house", "Haus", "🏠", "aehnlich"], ["mouse", "Maus", "🐭", "aehnlich"], ["book", "Buch", "📖", "aehnlich"],
  ["water", "Wasser", "💧", "aehnlich"], ["milk", "Milch", "🥛", "aehnlich"], ["bread", "Brot", "🍞", "aehnlich"],
  ["fish", "Fisch", "🐟", "aehnlich"], ["ship", "Schiff", "🚢", "aehnlich"], ["bed", "Bett", "🛏️", "aehnlich"],
  ["foot", "Fuss", "🦶", "aehnlich"], ["cat", "Katze", "🐱", "aehnlich"], ["father", "Vater", "👨", "aehnlich"],
  ["mother", "Mutter", "👩", "aehnlich"], ["brother", "Bruder", "👦", "aehnlich"], ["sister", "Schwester", "👧", "aehnlich"],
  ["sun", "Sonne", "☀️", "aehnlich"], ["moon", "Mond", "🌙", "aehnlich"], ["star", "Stern", "⭐", "aehnlich"],
  ["salt", "Salz", "🧂", "aehnlich"], ["heart", "Herz", "❤️", "aehnlich"], ["fire", "Feuer", "🔥", "aehnlich"],
  ["ice", "Eis", "🧊", "aehnlich"], ["apple", "Apfel", "🍎", "aehnlich"], ["cow", "Kuh", "🐄", "aehnlich"],
  ["sheep", "Schaf", "🐑", "aehnlich"], ["three", "drei", "3️⃣", "aehnlich"], ["eight", "acht", "8️⃣", "aehnlich"],
  ["nine", "neun", "9️⃣", "aehnlich"], ["green", "grün", "🟩", "aehnlich"], ["brown", "braun", "🟫", "aehnlich"],
  ["garden", "Garten", null, "aehnlich"], ["glass", "Glas", null, "aehnlich"], ["grass", "Gras", null, "aehnlich"],
  ["knee", "Knie", null, "aehnlich"], ["hair", "Haar", null, "aehnlich"], ["summer", "Sommer", null, "aehnlich"],
];

const FALSCHE_FREUNDE = [
  ["gift", "Geschenk", "Gift", "🎁"], ["kind", "nett", "Kind", null], ["fast", "schnell", "fast", null],
  ["also", "auch", "also", null], ["where", "wo", "wer", null], ["who", "wer", "wo", null],
  ["chef", "Koch / Köchin", "Chef", "🧑‍🍳"], ["brave", "mutig", "brav", null], ["handy", "praktisch", "Handy", null],
  ["become", "werden", "bekommen", null], ["rat", "Ratte", "Rat", "🐀"], ["hut", "Hütte", "Hut", "🛖"],
  ["bad", "schlecht", "Bad", null], ["chips", "Pommes frites", "Chips", "🍟"], ["art", "Kunst", "Art", "🎨"],
  ["map", "Landkarte", "Mappe", "🗺️"],
];
