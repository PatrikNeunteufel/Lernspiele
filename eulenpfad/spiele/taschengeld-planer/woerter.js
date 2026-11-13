/* Waren und Ausgaben für den Taschengeld-Planer — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG NMG.6.5.g: Konsumentscheide begründen, Bedürfnis und Wunsch unterscheiden, mit einem
   Budget planen; MA.3.A.2.h: mit Geld rechnen.

   Schreibweise je Eintrag: [Bild, Name, Preis in Rappen, Art, Pack]
   - Preis: ANNAHME — gerundet und so, wie es Kinder in der Schweiz 2026 ungefähr erleben (Kiosk,
     Papeterie, Kino, Bus). Keine Preisliste eines Geschäfts; bitte an die eigene Umgebung anpassen.
   - Art: "bedarf" (brauche ich: Schule, Gesundheit, Sicherheit, Weg zur Schule), "wunsch" (hätte ich
     gern: Süsses, Spiel, Freizeit) oder "" (je nach Lage beides; im Spiel dann nie zum Sortieren).
   - Pack: Packgrössen, in denen es die Ware im Laden gibt (Königsstufe: Angebote vergleichen, einzeln oder Pack);
     ANNAHME wie die Preise, ZU PRÜFEN (Entscheid TG3 a, LERN_Session39: vorher für alle Waren 5, 6 oder 10 Stück).
   Schweizer Schreibweise (ss statt ß, Glace, Velo, Billett, Schoggi).

   Inhaltsliste (Entscheid L4 a): eine Liste „waren“; der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag taschengeld-planer, Feld listen). */

const TASCHEN_WAREN = [
  // Bedarf: Schule
  ["📓", "Schulheft", 200, "bedarf", [5, 10]],
  ["✏️", "Bleistift", 150, "bedarf", [5, 10]],
  ["svg:radiergummi", "Radiergummi", 150, "bedarf"],
  ["📏", "Lineal", 250, "bedarf"],
  ["🖍️", "Farbstifte-Schachtel", 1200, "bedarf"],
  ["📐", "Geodreieck", 400, "bedarf"],
  ["🖋️", "Füllerpatronen", 350, "bedarf"],
  ["🎒", "Turnsack", 1500, "bedarf"],
  // Bedarf: Gesundheit, Sicherheit, Weg zur Schule, Essen
  ["🪥", "Zahnbürste", 300, "bedarf", [2, 4]],
  ["svg:sonnenhut", "Sonnenhut", 1500, "bedarf"],
  ["🧴", "Sonnencreme", 1200, "bedarf"],
  ["🧤", "Winterhandschuhe", 1500, "bedarf"],
  ["svg:velolicht", "Velolicht", 1500, "bedarf"],
  ["🪖", "Velohelm", 5000, "bedarf"],
  ["👟", "Turnschuhe", 6000, "bedarf"],
  ["svg:busbillett", "Busbillett", 250, ""],
  ["🍎", "Apfel zum Znüni", 80, "bedarf", [6]],
  ["🥖", "Brötli zum Znüni", 100, "bedarf", [4, 6]],
  // Wunsch: Süsses und Snacks
  ["🍦", "Glace-Cornet", 400, "wunsch"],
  ["🍫", "Schoggi-Tafel", 200, "wunsch", [3, 5]],
  ["🍬", "Gummibärli-Säckli", 250, "wunsch", [3, 5]],
  ["🍭", "Lutscher", 100, "wunsch", [10]],
  ["🥤", "Limonade (Dose)", 200, "wunsch", [6]],
  ["🍿", "Popcorn im Kino", 600, "wunsch"],
  ["svg:kaugummi", "Kaugummi", 150, "wunsch", [5, 10]],
  // Wunsch: Lesen, Spielen, Sammeln
  ["svg:comicheft", "Comic-Heft", 700, "wunsch"],
  ["svg:sammelbilder", "Sammelbilder (1 Päckli)", 150, "wunsch", [5, 10]],
  ["📰", "Kinder-Zeitschrift", 800, "wunsch"],
  ["📚", "Jugendbuch", 1800, "wunsch"],
  ["🃏", "Kartenspiel", 1500, "wunsch"],
  ["⚽", "Fussball", 2500, "wunsch"],
  ["🎮", "Videospiel", 6000, "wunsch"],
  ["🎧", "Kopfhörer", 3000, "wunsch"],
  ["🧸", "Plüschtier", 2000, "wunsch"],
  ["🪢", "Freundschaftsbändeli", 500, "wunsch", [3, 5]],
  // Wunsch: Freizeit
  ["🎬", "Kinoeintritt", 1500, "wunsch"],
  ["🏊", "Eintritt Schwimmbad", 400, "wunsch"],
  ["⛳", "Minigolf", 800, "wunsch"],
  ["🎢", "Bahn auf dem Jahrmarkt", 500, "wunsch"],
  // Je nach Lage
  ["🎁", "Geburtstagsgeschenk", 2000, ""],
  ["💐", "Blumen als Geschenk", 1000, ""],
  ["🔋", "Batterien", 600, "", [4, 8]],
  ["💧", "Wasserflasche", 150, "", [6]],
  ["☂️", "Regenschirm", 1500, ""],
  ["🥐", "Gipfeli", 150, "", [4, 6]],
];
