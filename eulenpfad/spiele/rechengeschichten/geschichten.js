// Rechengeschichten (Lehrplan SG MA.3.C.2, MA.3.C.3). Platzhalter {a}, {b}, {c} … werden durch
// Zahlen ersetzt: 'zahlen' gibt Bereiche [min, max], 'abgeleitet' berechnet weitere Zahlen.
// 'richtig' ist die passende Rechnung, 'falsch' sind Ablenker; „_“ steht für die gesuchte Zahl.
// 'ergebnis' ist die Lösung. 'unwichtig' nennt eine Zahl, die zum Rechnen nicht gebraucht wird.
// Kann eine gezeigte Zahl 1 sein, braucht der Satz die Einzahl: {b:wird|werden} wählt nach b.
// 'stufe' 1–6 nach der Skala mit Basisklasse 2: 1 Bilder bis 10 (1. Klasse), 2 Text bis 20, 3 bis 100
// auch mit mal, 4 Platzhalter, 5 geteilt und Platzhalter (3. Klasse), 6 Ausrechnen mit unwichtiger Angabe.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a): Die Geschichten einer Stufe bilden eine Liste, die die Aufsicht
// einzeln freigibt (Zuordnung in GESCHICHTEN_LISTEN). Der Prüfstand steht in
// spiele/gemeinsam/pruefstand.js (Schlüssel rechengeschichten/<liste>). Jede Spielstufe braucht
// die Liste ihrer Stufe.

const GESCHICHTEN_LISTEN = { 1: "bilder-bis-10", 2: "text-bis-20", 3: "bis-100", 4: "platzhalter", 5: "verteilen", 6: "unwichtige-angabe" };

const GESCHICHTEN = [
  // Stufe 1: mit Bildern, bis 10
  { stufe: 1, bild: "🍎", art: "dazu", text: "Im Korb {a:liegt|liegen} {a} {a:Apfel|Äpfel}. Es {b:kommt|kommen} {b} dazu.", zahlen: { a: [1, 6], b: [1, 4] }, richtig: "a + b", falsch: ["a − b", "a + a"], ergebnis: "a + b" },
  { stufe: 1, bild: "🐟", art: "dazu", text: "Im Teich schwimmen {a} Fische. {b} {b:Fisch kommt|Fische kommen} dazu.", zahlen: { a: [2, 6], b: [1, 4] }, richtig: "a + b", falsch: ["a − b", "b + b"], ergebnis: "a + b" },
  { stufe: 1, bild: "🎈", art: "weg", text: "Es sind {a} Ballone. {b} {b:fliegt|fliegen} weg.", zahlen: { b: [1, 4], d: [1, 5] }, abgeleitet: { a: "b + d" }, richtig: "a − b", falsch: ["a + b", "b − b"], ergebnis: "a − b" },
  { stufe: 1, bild: "🍪", art: "weg", text: "Auf dem Teller liegen {a} Guetsli. {b} {b:wird|werden} gegessen.", zahlen: { b: [1, 4], d: [1, 5] }, abgeleitet: { a: "b + d" }, richtig: "a − b", falsch: ["a + b", "a + a"], ergebnis: "a − b" },
  // Stufe 2: Text, bis 20
  { stufe: 2, text: "{a} Kinder spielen Fangen, {b} Kinder spielen Ball. Wie viele Kinder spielen?", zahlen: { a: [4, 12], b: [3, 8] }, richtig: "a + b", falsch: ["a − b", "a + a"], ergebnis: "a + b" },
  { stufe: 2, text: "Im Bus sitzen {a} Leute. An der Haltestelle steigen {b} aus. Wie viele sind noch im Bus?", zahlen: { b: [2, 8], d: [3, 10] }, abgeleitet: { a: "b + d" }, richtig: "a − b", falsch: ["a + b", "b − a"], ergebnis: "a − b" },
  { stufe: 2, text: "Im Bus sitzen {a} Leute. An der Haltestelle steigen {b} ein. Wie viele sind jetzt im Bus?", zahlen: { a: [5, 12], b: [2, 8] }, richtig: "a + b", falsch: ["a − b", "b + b"], ergebnis: "a + b" },
  { stufe: 2, text: "Ein Eichhörnchen versteckt {a} Nüsse. {b} findet es nicht mehr. Wie viele findet es wieder?", zahlen: { b: [2, 7], d: [3, 10] }, abgeleitet: { a: "b + d" }, richtig: "a − b", falsch: ["a + b", "a + a"], ergebnis: "a − b" },
  // Stufe 3: bis 100, auch mal
  { stufe: 3, text: "Ein Kind baut {a} Türme mit je {b} Klötzen. Wie viele Klötze braucht es?", zahlen: { a: [2, 9], b: [3, 10] }, richtig: "a · b", falsch: ["a + b", "b − a"], ergebnis: "a · b" },
  { stufe: 3, text: "Die Bäckerei kauft {a} Schachteln mit je {b} Eiern. Wie viele Eier sind es?", zahlen: { a: [2, 10], b: [6, 10] }, richtig: "a · b", falsch: ["a + b", "b − a"], ergebnis: "a · b" },
  { stufe: 3, text: "Ein Buch hat {a} Seiten. Du hast schon {b} gelesen. Wie viele Seiten fehlen noch?", zahlen: { b: [12, 45], d: [10, 50] }, abgeleitet: { a: "b + d" }, richtig: "a − b", falsch: ["a + b", "b − b"], ergebnis: "a − b" },
  { stufe: 3, text: "Im Kässeli sind {a} Fr. Zum Geburtstag kommen {b} Fr. dazu. Wie viel Geld ist jetzt drin?", zahlen: { a: [12, 50], b: [10, 40] }, richtig: "a + b", falsch: ["a − b", "a · b"], ergebnis: "a + b" },
  // Stufe 4: mit Platzhalter (bis 100)
  { stufe: 4, text: "Ein Bus hat {c} Sitzplätze. {a} sind besetzt. Wie viele sind noch frei?", zahlen: { a: [12, 40], b: [5, 30] }, abgeleitet: { c: "a + b" }, richtig: "a + _ = c", falsch: ["c + a = _", "a · _ = c"], ergebnis: "b" },
  { stufe: 4, text: "Ein Geschenk kostet {c} Fr. {a} Fr. sind schon gespart. Wie viel fehlt noch?", zahlen: { a: [10, 40], b: [5, 35] }, abgeleitet: { c: "a + b" }, richtig: "a + _ = c", falsch: ["c + a = _", "a − c = _"], ergebnis: "b" },
  // UNGEPRÜFT (LERN, 2026-10-31): die nächsten zwei
  { stufe: 4, text: "Ein Kind hat {a} Sticker. Zum Geburtstag bekommt es noch welche. Jetzt hat es {c} Sticker. Wie viele hat es bekommen?", zahlen: { a: [12, 45], b: [5, 30] }, abgeleitet: { c: "a + b" }, richtig: "a + _ = c", falsch: ["c + a = _", "a − c = _"], ergebnis: "b" },
  { stufe: 4, text: "Auf dem Spielplatz sind {c} Kinder. {a} spielen im Sand, die anderen schaukeln. Wie viele schaukeln?", zahlen: { a: [10, 40], b: [6, 35] }, abgeleitet: { c: "a + b" }, richtig: "a + _ = c", falsch: ["c + a = _", "a · _ = c"], ergebnis: "b" },
  // Stufe 5: geteilt und Platzhalter (auch mit mal und minus)
  { stufe: 5, text: "{c} Kinder werden in Gruppen zu {b} eingeteilt. Wie viele Gruppen gibt es?", zahlen: { a: [2, 9], b: [2, 6] }, abgeleitet: { c: "a · b" }, richtig: "c : b", falsch: ["c · b", "c − b"], ergebnis: "a" },
  { stufe: 5, text: "{c} Guetsli werden gerecht auf {b} Teller verteilt. Wie viele kommen auf jeden Teller?", zahlen: { a: [2, 9], b: [2, 5] }, abgeleitet: { c: "a · b" }, richtig: "c : b", falsch: ["c + b", "c · b"], ergebnis: "a" },
  // UNGEPRÜFT (LERN, 2026-10-31): die nächsten drei
  { stufe: 5, text: "{c} Kinder fahren mit Autos an den Ausflug. In jedes Auto passen {b} Kinder. Wie viele Autos braucht es?", zahlen: { a: [2, 8], b: [3, 5] }, abgeleitet: { c: "a · b" }, richtig: "c : b", falsch: ["c · b", "c − b"], ergebnis: "a" },
  { stufe: 5, text: "In jede Schachtel kommen {b} Eier. Es sind {c} Eier. Wie viele Schachteln werden voll?", zahlen: { a: [3, 10], b: [6, 10] }, abgeleitet: { c: "a · b" }, richtig: "_ · b = c", falsch: ["c · b = _", "b + _ = c"], ergebnis: "a" },
  { stufe: 5, text: "Im Schulzimmer waren {a} Farbstifte. Einige sind verloren gegangen. Jetzt sind es noch {c}. Wie viele sind verloren gegangen?", zahlen: { c: [20, 60], b: [5, 25] }, abgeleitet: { a: "c + b" }, richtig: "a − _ = c", falsch: ["a + c = _", "c − a = _"], ergebnis: "b" },
  // Stufe 6: Ergebnis ausrechnen; eine Zahl wird nicht gebraucht
  { stufe: 6, text: "Ein Zug hat {a} Wagen. In jedem Wagen sitzen {b} Leute. Der Zug fährt um {d} Uhr ab. Wie viele Leute sitzen im Zug?", zahlen: { a: [3, 9], b: [12, 40], d: [7, 11] }, ergebnis: "a · b", rechnung: "a · b", unwichtig: "d" },
  { stufe: 6, text: "Im Garten stehen {a} Apfelbäume und {d} Birnbäume. An jedem Apfelbaum hängen {b} Äpfel. Wie viele Äpfel sind es?", zahlen: { a: [3, 8], b: [15, 30], d: [2, 6] }, ergebnis: "a · b", rechnung: "a · b", unwichtig: "d" },
  { stufe: 6, text: "Ein Velo kostet {a} Fr., ein Helm {b} Fr. Das Kind ist {d} Jahre alt. Wie viel kosten Velo und Helm zusammen?", zahlen: { a: [180, 450], b: [35, 90], d: [7, 10] }, ergebnis: "a + b", rechnung: "a + b", unwichtig: "d" },
  { stufe: 6, text: "Eine Klasse sammelt {a} Fr. für einen Ausflug. Die Reise kostet {b} Fr. Es fahren {d} Kinder mit. Wie viel Geld bleibt übrig?", zahlen: { b: [120, 300], e: [20, 150], d: [18, 24] }, abgeleitet: { a: "b + e" }, ergebnis: "a − b", rechnung: "a − b", unwichtig: "d" },
];
