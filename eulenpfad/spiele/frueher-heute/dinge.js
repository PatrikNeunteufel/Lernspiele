// Inhalte für „Früher und heute“ (Lehrplan SG NMG.9.2.b/c/e).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
// Bilder: „svg:…“ steht in der Bildersammlung spiele/gemeinsam/bilder.js (für Waschbrett und Waschmaschine gibt es kein Emoji).
//
// Inhaltslisten (Entscheid L4 a), einzeln freizugeben. Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Spiel „frueher-heute“, Feld listen); Kinder sehen nur Inhalte aus
// freien Listen.
//   paare        FH_PAARE        Ding von früher und Ding von heute, die dieselbe Arbeit machen
//   reihen       FH_REIHEN       drei oder vier Dinge, vom ältesten zum neusten
//   grosseltern  FH_GROSSELTERN  Gab es das schon vor etwa 60 (und 100) Jahren?
const FH_LISTEN = ["paare", "reihen", "grosseltern"];

// [Gruppe, Bild früher, früher, Bild heute, heute, früher eindeutig?] — Liste paare.
// Gruppe: Ablenker kommen nur aus anderen Gruppen (ein Handy ersetzt auch den Brief, ein Flugzeug
// auch das Pferd). „früher eindeutig?“: nur dann in Stufe 1 als Ding von früher (Briefe schreibt man
// auch heute).
const FH_PAARE = [
  ["licht", "🪔", "Öllampe", "💡", "Lampe mit Strom", true],
  ["nachrichten", "☎️", "altes Telefon mit Kabel", "📱", "Handy", true],
  ["nachrichten", "🪶", "mit Feder und Tinte schreiben", "💻", "am Computer schreiben", true],
  ["nachrichten", "✉️", "Brief", "📧", "E-Mail", false],
  ["waschen", "svg:waschbrett", "Waschbrett", "svg:waschmaschine", "Waschmaschine", true],
  ["reisen", "🐎", "mit dem Pferd reisen", "🚗", "mit dem Auto reisen", true],
  ["reisen", "🚂", "Dampflokomotive", "🚄", "Schnellzug", true],
  ["reisen", "⛵", "mit dem Segelschiff übers Meer", "✈️", "mit dem Flugzeug übers Meer", true],
  ["wasser", "🪣", "Wasser am Brunnen holen", "🚰", "Wasser aus dem Hahn", true],
  ["feld", "🐂", "Ochse zieht den Pflug", "🚜", "Traktor", true],
];

// [Gruppe, Thema, [[Bild, Ding], …] vom ältesten zum neusten] — Liste reihen.
// Nur Reihen, deren Reihenfolge sicher ist (Kugelschreiber ab etwa 1940, Computer zu Hause ab etwa
// 1980; Waschbrett ab etwa 1800, Waschmaschine zu Hause ab etwa 1950).
const FH_REIHEN = [
  ["licht", "Licht", [["🔥", "Feuer"], ["🕯️", "Kerze"], ["💡", "Lampe mit Strom"]]],
  ["reisen", "Reisen", [["🚶", "zu Fuss"], ["🐎", "mit dem Pferd"], ["🚂", "mit der Dampflokomotive"], ["✈️", "mit dem Flugzeug"]]],
  ["reisen", "Übers Meer", [["⛵", "Segelschiff"], ["🚢", "Dampfschiff"], ["✈️", "Flugzeug"]]],
  ["nachrichten", "Nachrichten", [["✉️", "Brief"], ["☎️", "Telefon mit Kabel"], ["📱", "Handy"]]],
  ["nachrichten", "Schreiben", [["🪶", "Feder und Tinte"], ["🖊️", "Kugelschreiber"], ["💻", "Computer"]]],
  ["feld", "Feld bearbeiten", [["🧑‍🌾", "von Hand mit der Hacke"], ["🐂", "Ochse mit Pflug"], ["🚜", "Traktor"]]],
  ["waschen", "Wäsche waschen", [["🏞️", "am Bach"], ["svg:waschbrett", "Waschbrett"], ["svg:waschmaschine", "Waschmaschine"]]],
];

// [Bild, Ding, gab es vor etwa 60 Jahren?, gab es vor etwa 100 Jahren?] — Liste grosseltern.
// Vor 60 Jahren (um 1966) waren die Grosseltern der Kinder Kinder, vor 100 Jahren (um 1926) die
// Urgrosseltern. Bewusst weggelassen, weil die Antwort vom Jahr der Geburt abhängt: Computer zu
// Hause, Spielkonsole, Kühlschrank.
const FH_GROSSELTERN = [
  ["🚗", "Auto", true, true], ["🚂", "Eisenbahn", true, true], ["🚲", "Velo", true, true],
  ["✈️", "Flugzeug", true, true], ["☎️", "Telefon mit Kabel", true, true], ["📻", "Radio", true, true],
  ["💡", "Lampe mit Strom", true, true], ["📷", "Fotoapparat", true, true],
  ["📺", "Fernseher", true, false], ["🖊️", "Kugelschreiber", true, false],
  ["📱", "Handy", false, false], ["🌐", "Internet", false, false], ["📧", "E-Mail", false, false],
  ["💻", "Laptop", false, false],
];
