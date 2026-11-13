/* Tätigkeiten im Tageslauf — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG MA.3.A.2.a „Tagesverlauf in Morgen, Mittag, Nachmittag, Abend und Nacht einteilen,
   Aktivitäten zuordnen“; NMG.9.1.a „morgen, heute, gestern; zeitliche Reihen bilden“.

   Schreibweise: Schweizer Wörter (Zmorge, Znüni, Zmittag, Zvieri, Znacht, Gipfeli, Guetzli, Schoggi),
   ss statt ß. Jede Zeile: [Bild, Satz zum Vorlesen, Tageszeit]. Tageszeiten: morgen, mittag,
   nachmittag, abend, nacht. Nur Tätigkeiten, die eindeutig zu einer Tageszeit gehören (Zähne putzen
   gehört zum Morgen und zum Abend und fehlt deshalb). Das Bild kommt in der Liste nur einmal vor.

   Inhaltsliste „taetigkeiten“ (Entscheid L4 a); der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag „tageslauf-sonne“, Feld listen). */

const TAETIGKEITEN = [
  ["⏰", "Der Wecker klingelt, und du stehst auf.", "morgen"],
  ["🥣", "Du isst das Zmorge.", "morgen"],
  ["🥐", "Zum Zmorge gibt es ein Gipfeli.", "morgen"],
  ["🍞", "Zum Zmorge isst du ein Konfibrot.", "morgen"],
  ["🥛", "Zum Zmorge trinkst du ein Glas Milch.", "morgen"],
  ["👕", "Nach dem Aufstehen ziehst du dich an.", "morgen"],
  ["🍎", "In der Pause am Morgen isst du das Znüni.", "morgen"],
  ["🐓", "Der Hahn kräht, die Nacht ist vorbei.", "morgen"],

  ["🍝", "Zum Zmittag gibt es Spaghetti.", "mittag"],
  ["🍲", "Zum Zmittag gibt es eine heisse Suppe.", "mittag"],
  ["🥗", "Zum Zmittag gibt es Salat.", "mittag"],
  ["🍟", "Zum Zmittag gibt es Schnitzel mit Pommes frites.", "mittag"],
  ["🍽️", "Du deckst den Tisch für das Zmittag.", "mittag"],
  ["🧼", "Vor dem Zmittag wäschst du die Hände.", "mittag"],

  ["🍪", "Zum Zvieri gibt es Guetzli.", "nachmittag"],
  ["🧃", "Zum Zvieri trinkst du Sirup.", "nachmittag"],
  ["🍫", "Zum Zvieri gibt es Brot und Schoggi.", "nachmittag"],
  ["🍉", "Zum Zvieri gibt es Wassermelone.", "nachmittag"],
  ["🥨", "Zum Zvieri isst du eine Brezel.", "nachmittag"],

  ["🥖", "Die Familie isst zusammen das Znacht.", "abend"],
  ["🧀", "Zum Znacht gibt es Brot und Käse.", "abend"],
  ["🛁", "Vor dem Schlafengehen badest du.", "abend"],
  ["📖", "Vor dem Einschlafen hörst du eine Gutenachtgeschichte.", "abend"],
  ["🧸", "Du bringst den Teddy ins Bett.", "abend"],
  ["😘", "Du sagst Gute Nacht und bekommst einen Kuss.", "abend"],

  ["🛌", "Du schläfst tief in deinem Bett.", "nacht"],
  ["💭", "Du schläfst und träumst.", "nacht"],
  ["🦇", "Die Fledermaus fliegt herum und fängt Insekten.", "nacht"],
  ["🦉", "Die Eule ist wach und ruft im Wald.", "nacht"],
  ["🦔", "Der Igel sucht im Garten nach Futter.", "nacht"],
  ["✨", "Die Sterne leuchten, und alle Kinder schlafen.", "nacht"],
];

/* Wochenplan für „gestern, heute, morgen“ (Stufe 5): Was man an einem Tag Besonderes macht.
   Feste Bilder ohne Wochentagswörter; die Wörter liest die Eule beim langen Drücken vor.
   [Bild, Tätigkeit] */
const WOCHENPLAN = [
  ["🤸", "Turnen"], ["🏊", "Schwimmen"], ["🌲", "Waldtag"], ["✂️", "Basteln"], ["🎵", "Singen"],
  ["🚲", "Velo fahren"], ["🦁", "in den Zoo gehen"], ["👵", "das Grosi besuchen"], ["🧁", "Muffins backen"],
  ["📚", "in die Bibliothek gehen"], ["⚽", "Fussball spielen"], ["🎨", "Malen"],
];
