// Inhalte für das Lebenszyklus-Puzzle (Lehrplan SG NMG.2.3).
// Zyklen: [ab Stufe, Name, [[Bild oder null, Stadium], …] in der richtigen Reihenfolge]
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).

const ZYKLEN = [
  [1, "Huhn", [["🥚", "Ei"], ["🐣", "Küken schlüpft"], ["🐔", "Huhn"]]],
  [1, "Mensch", [["👶", "Baby"], ["🧒", "Kind"], ["🧑", "Erwachsener"]]],
  [2, "Mensch", [["👶", "Baby"], ["🧒", "Kind"], ["🧑", "Erwachsener"], ["🧓", "alter Mensch"]]],
  [2, "Sonnenblume", [["🟤", "Samen"], ["🌱", "Keimling"], ["🌿", "junge Pflanze"], ["🌻", "Blüte"]]],
  // ab Stufe 3: für die Puppe gibt es kein Bild, sie steht nur als Wort da
  [3, "Schmetterling", [["⚪", "Ei"], ["🐛", "Raupe"], [null, "Puppe"], ["🦋", "Schmetterling"]]],
  [4, "Frosch", [["⚪", "Laich (Eier)"], [null, "Kaulquappe"], [null, "Kaulquappe mit Beinen"], [null, "junger Frosch mit Schwanz"], ["🐸", "Frosch"]]],
  [4, "Marienkäfer", [["⚪", "Ei"], [null, "Larve"], [null, "Puppe"], ["🐞", "Marienkäfer"]]],
  [4, "Honigbiene", [["⚪", "Ei"], [null, "Larve"], [null, "Puppe"], ["🐝", "Biene"]]],
  [4, "Apfelbaum", [["🌸", "Blüte"], [null, "kleiner grüner Apfel"], ["🍎", "reifer Apfel"], ["🟤", "Kerne (Samen)"]]],
  // ab Stufe 6 (Königsstufe): fünf Stadien — NEU in LERN_Session2, UNGEPRÜFT
  [6, "Mensch", [["👶", "Baby"], ["🧒", "Kind"], [null, "Jugendlicher"], ["🧑", "Erwachsener"], ["🧓", "alter Mensch"]]],
  [6, "Apfelbaum", [["🟤", "Kern (Samen)"], ["🌱", "Keimling"], [null, "junger Baum"], ["🌸", "Blüte"], ["🍎", "Apfel"]]],
];

// Wie kommen die Jungen zur Welt? (NMG.2.3.c) [Bild, Tier, Art]
const GEBURT = [
  ["🐔", "Huhn", "Ei"], ["🦆", "Ente", "Ei"], ["🐊", "Krokodil", "Ei"], ["🐢", "Schildkröte", "Ei"],
  ["🐧", "Pinguin", "Ei"], ["🐸", "Frosch", "Ei"], ["🐟", "Forelle", "Ei"], ["🐍", "Ringelnatter", "Ei"],
  ["🦘", "Känguru", "Beutel"], ["🐨", "Koala", "Beutel"],
  ["🐄", "Kuh", "lebend"], ["🐕", "Hund", "lebend"], ["🐈", "Katze", "lebend"], ["🐎", "Pferd", "lebend"],
  ["🐋", "Wal", "lebend"], ["🐬", "Delfin", "lebend"], ["🦇", "Fledermaus", "lebend"], ["🦔", "Igel", "lebend"],
];

// Wissensfragen (Stufe 5 und 6): [Frage, richtig, falsch, falsch]
const ZYKLUS_FRAGEN = [
  ["Womit atmet eine Kaulquappe im Wasser?", "mit Kiemen", "mit einer Nase", "mit Federn"],
  ["Womit atmet ein erwachsener Frosch an Land?", "mit Lungen", "mit Kiemen", "mit Blättern"],
  ["Was frisst eine Raupe?", "Blätter", "Fleisch", "Steine"],
  ["Was schlüpft aus der Puppe?", "der Schmetterling", "die Raupe", "das Ei"],
  ["Was braucht ein Samen, damit er keimt?", "Wasser und Wärme", "Salz", "Trockenheit und Kälte"],
  ["Was tragen Bienen von Blüte zu Blüte?", "Blütenstaub (Pollen)", "Wasser", "Sand"],
  ["Was wächst aus einer bestäubten Blüte?", "eine Frucht mit Samen", "eine Raupe", "ein Ei"],
  // NEU in LERN_Session2 für die Königsstufe, UNGEPRÜFT
  ["Was verliert die Kaulquappe, wenn sie zum Frosch wird?", "den Schwanz", "die Beine", "die Augen"],
  ["Wie nennt man es, wenn aus der Raupe ein Schmetterling wird?", "Verwandlung (Metamorphose)", "Winterschlaf", "Keimung"],
  ["Warum fliegen Bienen von Blüte zu Blüte?", "Sie sammeln Nektar und Pollen als Futter.", "Sie schlafen in den Blüten.", "Sie legen ihre Eier in die Blüten."],
];
