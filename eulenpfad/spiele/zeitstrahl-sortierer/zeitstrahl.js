// Inhalte für den „Zeitstrahl-Sortierer“ (Lehrplan SG NMG.9.1.e/f: Zeitstrahl, drei Generationen;
// Jahrzahlen einordnen). Die Familie ist erfunden; Geburtsjahre rechnet das Spiel aus.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a), einzeln freizugeben. Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Spiel „zeitstrahl-sortierer“, Feld listen); Kinder sehen nur Inhalte
// aus freien Listen. Das Ablesen von Jahrzahlen auf dem Zeitstrahl braucht keine Liste.
//   lebensabschnitte  ZS_ABSCHNITTE, ZS_LEBEN   Baby bis alter Mensch; Geburt, Kindergarten, Schule
//   generationen      ZS_GENERATIONEN           Kind, Eltern, Grosseltern, Urgrosseltern
//   ereignisse        ZS_EREIGNISSE             Ereignisse mit Jahrzahl (Schweiz, St. Gallen, Welt)
//   epochen           ZS_EPOCHEN, ZS_MERKMALE   Steinzeit, Römerzeit, Mittelalter, Neuzeit
const ZS_LISTEN = ["lebensabschnitte", "generationen", "ereignisse", "epochen"];

// [Bild, Lebensabschnitt] vom jüngsten zum ältesten — Liste lebensabschnitte
const ZS_ABSCHNITTE = [["👶", "Baby"], ["🧸", "Kleinkind"], ["🎒", "Schulkind"], ["🛹", "Jugendliche"], ["🧑", "Erwachsene"], ["👵", "alte Menschen"]];

// [Alter in Jahren, Bild, Ereignis] — Liste lebensabschnitte. Kanton St. Gallen: Kindergarten ab 4,
// 1. Klasse ab 6, Oberstufe nach der 6. Klasse; volljährig und stimmberechtigt mit 18.
const ZS_LEBEN = [
  [0, "🍼", "Geburt"],
  [4, "🖍️", "in den Kindergarten kommen"],
  [6, "✏️", "in die 1. Klasse kommen"],
  [9, "📚", "in die 4. Klasse kommen"],
  [12, "🏫", "in die Oberstufe kommen"],
  [18, "🗳️", "volljährig werden"],
];

// [Generation, Bild, Person] — 0 Kind, 1 Eltern, 2 Grosseltern, 3 Urgrosseltern — Liste generationen
const ZS_GENERATIONEN = [
  [0, "🧒", "das Kind"],
  [1, "👩", "die Mutter"], [1, "👨", "der Vater"],
  [2, "👵", "die Grossmutter"], [2, "👴", "der Grossvater"],
  [3, "🧓", "die Urgrossmutter"], [3, "🧓", "der Urgrossvater"],
];

// [Jahr zum Ordnen, Jahrzahl wie angezeigt, Bild, Ereignis, Zeitalter] — Liste ereignisse. Bild aus der Zeit des
// Ereignisses (BZ1 a): Karavelle, Motorwagen und Doppeldecker aus der Bildersammlung statt heutiger Boote, Autos, Flugzeuge;
// die Mondlandung mit der Landefähre (ZS2 a, Bemerkung 43). 1991, 2007 und 2022 als Anker nahe am Leben der Kinder
// (ZS1 a, Bemerkung 42; belegt LERN_Session32 aus Wikipedia „World Wide Web“: „First published 6 August 1991“,
// „iPhone (1st generation)“: 2007, „finger-friendly touchscreen interface that did not need a stylus“ — das IBM Simon
// von 1994 hatte schon einen Touchscreen, aber mit Stift; „ChatGPT“: „Originally released on November 30, 2022“).
// Gefragt wird das Zeitalter nur, wo es eindeutig ist (eines aus ZS_EPOCHEN). Um 1450 und 1492 beginnt je nach
// Buch die Neuzeit („ab 1500“ oder „mit der Entdeckung Amerikas“): dort steht ZS_UEBERGANG, und die Frage nach dem
// Zeitalter lässt das Ereignis aus (Entscheid ZA1 a, Bemerkungen 26 und 27). Ordnen und Jahrhundert gelten weiter.
const ZS_UEBERGANG = "Übergang vom Mittelalter zur Neuzeit — wird nicht gefragt";
const ZS_EREIGNISSE = [
  [612, "612", "⛪", "Der Mönch Gallus lässt sich an der Steinach nieder — so beginnt St. Gallen", "Mittelalter"],
  [1291, "1291", "📜", "Uri, Schwyz und Unterwalden schliessen den Bundesbrief", "Mittelalter"],
  [1450, "um 1450", "📖", "Gutenberg druckt Bücher mit beweglichen Buchstaben", ZS_UEBERGANG],
  [1492, "1492", "svg:karavelle", "Kolumbus erreicht Amerika", ZS_UEBERGANG],
  [1803, "1803", "🏛️", "St. Gallen wird ein Kanton", "Neuzeit"],
  [1847, "1847", "🚂", "Die erste Eisenbahn der Schweiz fährt von Zürich nach Baden", "Neuzeit"],
  [1848, "1848", "svg:schweiz", "Die Schweiz wird ein Bundesstaat", "Neuzeit"],
  [1886, "1886", "svg:motorwagen", "Carl Benz baut das erste Auto mit Benzinmotor", "Neuzeit"],
  [1903, "1903", "svg:wright-flyer", "Die Brüder Wright fliegen mit dem ersten Motorflugzeug", "Neuzeit"],
  [1969, "1969", "svg:mondlandung", "Die ersten Menschen landen auf dem Mond", "Neuzeit"],
  [1971, "1971", "🗳️", "Die Frauen dürfen in der Schweiz eidgenössisch abstimmen und wählen", "Neuzeit"],
  [1991, "1991", "🌐", "Am CERN bei Genf geht die erste Website ins Internet", "Neuzeit"],
  [2007, "2007", "📱", "Ein Smartphone kommt in die Läden, das man ohne Stift mit den Fingern bedient", "Neuzeit"],
  [2016, "2016", "🚄", "Der Gotthard-Basistunnel wird eröffnet", "Neuzeit"],
  [2022, "2022", "💬", "Ein Chatprogramm mit künstlicher Intelligenz (KI) wird veröffentlicht", "Neuzeit"],
];

// [Bild, Zeitalter] vom ältesten zum neusten — Liste epochen
const ZS_EPOCHEN = [["🪨", "Steinzeit"], ["🏛️", "Römerzeit"], ["🏰", "Mittelalter"], ["🏭", "Neuzeit"]];

// [Zeitalter, Bild, Merkmal] — Liste epochen. „svg:…“ aus der Bildersammlung (spiele/gemeinsam/bilder.js, B1 a):
// Faustkeil, Pfahlbau und Römerstrasse statt heutiger Axt, Lehmhütte und Autostrasse (Bemerkungen 23–25).
const ZS_MERKMALE = [
  ["Steinzeit", "🦣", "Menschen jagen Mammuts"],
  ["Steinzeit", "svg:faustkeil", "Werkzeuge aus Feuerstein"],
  ["Steinzeit", "svg:pfahlbau", "Pfahlbauten am Seeufer"],
  ["Römerzeit", "svg:roemerstrasse", "Soldaten bauen Strassen über die Alpenpässe"],
  ["Römerzeit", "🏺", "In Augusta Raurica wohnen Römer"],
  ["Mittelalter", "🏰", "Ritter wohnen auf Burgen"],
  ["Mittelalter", "📜", "Mönche schreiben Bücher von Hand ab"],
  ["Neuzeit", "🏭", "In Fabriken arbeiten Maschinen"],
  ["Neuzeit", "🚂", "Die ersten Eisenbahnen fahren"],
  ["Neuzeit", "💡", "Die Häuser bekommen elektrisches Licht"],
];
