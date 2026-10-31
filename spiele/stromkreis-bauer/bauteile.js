// Inhalte für „Stromkreis-Bauer“ (Lehrplan SG NMG.5.2.1).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
// Ob eine Lampe brennt, steht hier nicht: das Spiel rechnet es aus dem Schaltbild aus (Knoten und
// Leitungen, Lampen als gleiche Widerstände). Hier steht nur, wie die Schaltung aufgebaut ist.
//
// Inhaltslisten (Entscheid L4 a), einzeln freizugeben. Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Spiel „stromkreis-bauer“, Feld listen).
//   einfach         SCHALTUNGEN, Liste „einfach“      Batterie, Lampe und Drähte: geschlossen, Draht lose, beide Drähte am selben Pol
//   schalter        SCHALTUNGEN, Liste „schalter“     mit Schalter (offen oder geschlossen)
//   leiter          GEGENSTAENDE und SCHALTUNGEN, Liste „leiter“   Gegenstand in der Lücke: leitet er den Strom?
//   kurzschluss     SCHALTUNGEN, Liste „kurzschluss“  zusätzlicher Draht: über die Batterie, die Lampe, den Schalter
//   serie-parallel  SCHALTUNGEN, Liste „serie-parallel“  zwei oder drei Lampen in Serie und parallel
const STROM_LISTEN = ["einfach", "schalter", "leiter", "kurzschluss", "serie-parallel"];

// Gegenstände für die Lücke: [Bild, Name, leitet Strom?, knifflig?] — Liste leiter.
// Knifflig (erst ab Stufe 4): Graphit leitet, obwohl es kein Metall ist; der Kunststofflöffel sieht
// aus wie der Metalllöffel. Weggelassen, weil es vom Ding abhängt: Wasser, Schere (Griff), Dose (Lack).
const GEGENSTAENDE = [
  ["📎", "Büroklammer", true, false],
  ["🔑", "Schlüssel", true, false],
  ["🪙", "Münze", true, false],
  ["🔩", "Schraube", true, false],
  ["🥄", "Löffel aus Metall", true, false],
  ["⛓️", "Eisenkette", true, false],
  ["🪡", "Nähnadel", true, false],
  ["🧷", "Sicherheitsnadel", true, false],
  ["✏️", "Bleistiftmine (Graphit)", true, true],
  ["🪵", "Holzstück", false, false],
  ["🧶", "Wollfaden", false, false],
  ["📄", "Blatt Papier", false, false],
  ["🪨", "Kieselstein", false, false],
  ["🎈", "Luftballon", false, false],
  ["🥢", "Essstäbchen aus Holz", false, false],
  ["🪥", "Zahnbürste", false, false],
  ["🧦", "Socke", false, false],
  ["🖍️", "Wachsmalstift", false, false],
  ["🧽", "trockener Schwamm", false, false],
  ["🥄", "Löffel aus Kunststoff", false, true],
];

// Schaltungen: [Liste, Aufbau, Zusatz]
// Aufbau in Serie: drei Plätze im Kreis „oben rechts unten“ (die Batterie steht links). Bauteile:
//   D Draht · L Lampe · S1 Schalter geschlossen · S0 Schalter offen · X Draht lose · G Lücke mit Gegenstand
//   Mehrere Lampen heissen LA, LB, LC; LA0 = Fassung, aus der die Lampe A herausgedreht ist.
// Aufbau mit Parallelschaltung: „oben [Zweig 1 / Zweig 2] unten“, je Zweig zwei Plätze (oben unten).
// Zusatz: „pol“ = beide Drähte am Pluspol · „umgekehrt“ = Batterie andersherum (Minuspol oben) ·
//   „kurz:batterie“ = zusätzlicher Draht direkt von + nach − · „kurz:oben“, „kurz:rechts“, „kurz:unten“ =
//   zusätzlicher Draht über diesen Platz · „kurz:zweig1“, „kurz:zweig2“ = über den oberen Platz des Zweigs
const SCHALTUNGEN = [
  // einfach — Stufe 1: geschlossen oder Draht lose; ab Stufe 2 auch „pol“ und „umgekehrt“
  ["einfach", "L D D", ""], ["einfach", "D L D", ""], ["einfach", "D D L", ""],
  ["einfach", "L X D", ""], ["einfach", "L D X", ""], ["einfach", "X L D", ""],
  ["einfach", "D L X", ""], ["einfach", "X D L", ""], ["einfach", "D X L", ""],
  ["einfach", "L D D", "pol"], ["einfach", "D L D", "pol"], ["einfach", "D D L", "pol"],
  ["einfach", "L D D", "umgekehrt"], ["einfach", "D L D", "umgekehrt"], ["einfach", "D D L", "umgekehrt"],
  ["einfach", "L X D", "umgekehrt"],

  // schalter
  ["schalter", "L S1 D", ""], ["schalter", "L D S1", ""], ["schalter", "S1 L D", ""],
  ["schalter", "D L S1", ""], ["schalter", "S1 D L", ""], ["schalter", "D S1 L", ""],
  ["schalter", "L S0 D", ""], ["schalter", "L D S0", ""], ["schalter", "S0 L D", ""],
  ["schalter", "D L S0", ""], ["schalter", "S0 D L", ""], ["schalter", "D S0 L", ""],
  ["schalter", "L S1 X", ""], ["schalter", "X S1 L", ""], ["schalter", "S1 L X", ""],

  // leiter — in die Lücke G kommt ein Gegenstand aus GEGENSTAENDE
  ["leiter", "L G D", ""], ["leiter", "L D G", ""], ["leiter", "G L D", ""],
  ["leiter", "D L G", ""], ["leiter", "G D L", ""], ["leiter", "D G L", ""],

  // kurzschluss
  ["kurzschluss", "L D D", "kurz:batterie"], ["kurzschluss", "D L D", "kurz:batterie"], ["kurzschluss", "D D L", "kurz:batterie"],
  ["kurzschluss", "L S1 D", "kurz:batterie"], ["kurzschluss", "L S0 D", "kurz:batterie"],
  ["kurzschluss", "L D D", "kurz:oben"], ["kurzschluss", "D L D", "kurz:rechts"], ["kurzschluss", "D D L", "kurz:unten"],
  ["kurzschluss", "L S0 D", "kurz:rechts"], ["kurzschluss", "S0 L D", "kurz:oben"], ["kurzschluss", "D L S0", "kurz:unten"],
  ["kurzschluss", "L D D", "kurz:rechts"], ["kurzschluss", "D L D", "kurz:oben"], ["kurzschluss", "L S1 D", "kurz:rechts"],

  // serie-parallel — zwei Lampen in Serie
  ["serie-parallel", "LA LB D", ""], ["serie-parallel", "LA D LB", ""], ["serie-parallel", "D LA LB", ""],
  ["serie-parallel", "LA0 LB D", ""], ["serie-parallel", "LA LB0 D", ""], ["serie-parallel", "LA D LB0", ""],
  ["serie-parallel", "LA LB S0", ""], ["serie-parallel", "LA LB S1", ""], ["serie-parallel", "LA X LB", ""],
  // zwei Lampen parallel
  ["serie-parallel", "D [LA D / LB D] D", ""], ["serie-parallel", "D [LA0 D / LB D] D", ""], ["serie-parallel", "D [LA D / LB0 D] D", ""],
  ["serie-parallel", "D [LA S0 / LB D] D", ""], ["serie-parallel", "D [LA D / LB S0] D", ""], ["serie-parallel", "D [LA S1 / LB S0] D", ""],
  ["serie-parallel", "D [LA D / LB D] S0", ""], ["serie-parallel", "S1 [LA D / LB D] D", ""], ["serie-parallel", "D [LA D / LB D] X", ""],
  ["serie-parallel", "D [LA X / LB D] D", ""], ["serie-parallel", "S0 [LA D / LB D] D", ""],
  // Königsstufe: Kurzschluss über eine Lampe, drei Lampen
  ["serie-parallel", "LA LB D", "kurz:oben"], ["serie-parallel", "LA LB D", "kurz:rechts"], ["serie-parallel", "LA D LB", "kurz:unten"],
  ["serie-parallel", "LA LB LC", ""], ["serie-parallel", "LA LB0 LC", ""],
  ["serie-parallel", "LA [LB D / LC D] D", ""], ["serie-parallel", "LA [LB0 D / LC D] D", ""], ["serie-parallel", "LA [LB S0 / LC D] D", ""],
  ["serie-parallel", "LA0 [LB D / LC D] D", ""], ["serie-parallel", "D [LB D / LC D] LA", ""], ["serie-parallel", "D [LB D / LC S0] LA", ""],
  ["serie-parallel", "D [LA D / LB D] D", "kurz:zweig1"], ["serie-parallel", "LA [LB D / LC D] D", "kurz:zweig2"],
  ["serie-parallel", "D [LA D / LB D] D", "kurz:batterie"],
];
