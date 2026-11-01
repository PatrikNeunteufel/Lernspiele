// Inhalte des Diagramm-Detektivs (Lehrplan SG MA.3.C.1): Umfragen und Zählungen aus dem Schulalltag.
// Je Umfrage:
//   titel      Überschrift über Tabelle und Diagramm
//   einheit    was gezählt wird, in der Mehrzahl („Kinder“) — für „Wie viele … sind es insgesamt?“
//   einzahl    dasselbe in der Einzahl („Kind“) — für „Bei … ist es 1 Kind.“
//   frage      Fragesatz für eine Kategorie; {x} wird durch das dritte Feld der Kategorie ersetzt
//   meist, wenigst   Fragesätze nach der grössten und kleinsten Zahl
//   kategorien [Bild, kurzer Name (Beschriftung, höchstens 8 Zeichen), Wort für {x}, optional: „am Montag“
//              statt „bei 🐕 Hund“ in Vergleichsfragen]
//   gruppen    (nur Umfragen unter Kindern) zwei Klassen für das Doppel-Säulendiagramm der Königsstufe
//   durchschnitt (nur Zählungen über die Wochentage) Fragesatz nach dem Mittelwert pro Tag
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen.
//
// Inhaltsliste (Entscheid L4 a): alle Umfragen bilden die eine Liste „umfragen“; die Aufsicht gibt
// sie frei, der Prüfstand steht im Katalog (spiele/gemeinsam/katalog.js, Eintrag diagramm-detektiv,
// Feld listen). Die Zahlen erzeugt das Spiel.

const UMFRAGEN = [
  { titel: "Haustiere", einheit: "Kinder", einzahl: "Kind",
    frage: "Wie viele Kinder haben {x}?",
    meist: "Welches Haustier haben die meisten Kinder?", wenigst: "Welches Haustier haben die wenigsten Kinder?",
    gruppen: ["4a", "4b"],
    kategorien: [["🐕", "Hund", "einen Hund"], ["🐈", "Katze", "eine Katze"], ["🐇", "Hase", "einen Hasen"],
      ["🐟", "Fisch", "Fische"], ["🐦", "Vogel", "einen Vogel"], ["🐹", "Hamster", "einen Hamster"]] },
  { titel: "Lieblingsfrucht", einheit: "Kinder", einzahl: "Kind",
    frage: "Wie viele Kinder essen am liebsten {x}?",
    meist: "Welche Frucht essen die meisten Kinder am liebsten?", wenigst: "Welche Frucht wählten die wenigsten Kinder?",
    gruppen: ["4a", "4b"],
    kategorien: [["🍎", "Apfel", "Äpfel"], ["🍌", "Banane", "Bananen"], ["🍓", "Erdbeere", "Erdbeeren"],
      ["🍇", "Traube", "Trauben"], ["🍐", "Birne", "Birnen"], ["🍒", "Kirsche", "Kirschen"]] },
  { titel: "Unser Schulweg", einheit: "Kinder", einzahl: "Kind",
    frage: "Wie viele Kinder kommen {x} zur Schule?",
    meist: "Wie kommen die meisten Kinder zur Schule?", wenigst: "Wie kommen die wenigsten Kinder zur Schule?",
    gruppen: ["4a", "4b"],
    kategorien: [["🚶", "zu Fuss", "zu Fuss"], ["🚲", "Velo", "mit dem Velo"], ["🚌", "Bus", "mit dem Bus"],
      ["🛴", "Trotti", "mit dem Trottinett"], ["🚗", "Auto", "mit dem Auto"]] },
  { titel: "Lieblingssport", einheit: "Kinder", einzahl: "Kind",
    frage: "Wie viele Kinder mögen {x} am liebsten?",
    meist: "Welchen Sport mögen die meisten Kinder am liebsten?", wenigst: "Welchen Sport wählten die wenigsten Kinder?",
    gruppen: ["4a", "4b"],
    kategorien: [["⚽", "Fussball", "Fussball"], ["🏊", "Schwimmen", "Schwimmen"], ["⛷️", "Ski", "Skifahren"],
      ["💃", "Tanzen", "Tanzen"], ["🤸", "Turnen", "Turnen"]] },
  { titel: "Vögel am Futterhaus", einheit: "Vögel", einzahl: "Vogel",
    frage: "Wie viele {x} wurden am Futterhaus gezählt?",
    meist: "Welcher Vogel kam am häufigsten ans Futterhaus?", wenigst: "Welcher Vogel kam am seltensten ans Futterhaus?",
    kategorien: [["🐦", "Meise", "Meisen"], ["🐦‍⬛", "Amsel", "Amseln"], ["🐤", "Spatz", "Spatzen"],
      ["🕊️", "Taube", "Tauben"], ["🪶", "Specht", "Spechte"]] },
  { titel: "Glace-Verkauf am Schulfest", einheit: "Kugeln", einzahl: "Kugel",
    frage: "Wie viele Kugeln {x} wurden verkauft?",
    meist: "Welche Sorte wurde am meisten verkauft?", wenigst: "Welche Sorte wurde am wenigsten verkauft?",
    kategorien: [["🍫", "Schoggi", "Schoggi"], ["🍦", "Vanille", "Vanille"], ["🍓", "Erdbeer", "Erdbeer"],
      ["🍋", "Zitrone", "Zitrone"], ["🍒", "Kirsche", "Kirsche"]] },
  // Zählungen über die Wochentage — für den Durchschnitt pro Tag (Stufen 5 und 6)
  { titel: "Velos auf dem Schulhof", einheit: "Velos", einzahl: "Velo",
    frage: "Wie viele Velos standen {x} auf dem Schulhof?",
    meist: "An welchem Tag standen die meisten Velos da?", wenigst: "An welchem Tag standen die wenigsten Velos da?",
    durchschnitt: "Wie viele Velos standen im Durchschnitt pro Tag auf dem Schulhof?",
    kategorien: [["🚲", "Mo", "am Montag", "am Montag"], ["🚲", "Di", "am Dienstag", "am Dienstag"],
      ["🚲", "Mi", "am Mittwoch", "am Mittwoch"], ["🚲", "Do", "am Donnerstag", "am Donnerstag"],
      ["🚲", "Fr", "am Freitag", "am Freitag"]] },
  { titel: "Ausgeliehene Bücher", einheit: "Bücher", einzahl: "Buch",
    frage: "Wie viele Bücher wurden {x} in der Bibliothek ausgeliehen?",
    meist: "An welchem Tag wurden die meisten Bücher ausgeliehen?", wenigst: "An welchem Tag wurden die wenigsten Bücher ausgeliehen?",
    durchschnitt: "Wie viele Bücher wurden im Durchschnitt pro Tag ausgeliehen?",
    kategorien: [["📚", "Mo", "am Montag", "am Montag"], ["📚", "Di", "am Dienstag", "am Dienstag"],
      ["📚", "Mi", "am Mittwoch", "am Mittwoch"], ["📚", "Do", "am Donnerstag", "am Donnerstag"],
      ["📚", "Fr", "am Freitag", "am Freitag"]] },
];
