// Inhalte für „Plan-Leser“ (Lehrplan SG NMG.8.5).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
// Die Pläne setzt das Spiel jedes Mal neu zusammen; hier stehen die Dinge und Orte mit ihrem Zeichen
// für die Legende. Ein Zeichen kommt in einer Liste nur einmal vor. Himmelsrichtungen übt das
// Kompass-Spiel; hier geht es um Legende, Lage („rechts neben“, „zwischen“), Massstab und Wege.
//
// Inhaltslisten (Entscheid L4 a), einzeln freizugeben. Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Spiel „plan-leser“, Feld listen).
//   schulzimmer   PLAN_DINGE.schulzimmer   Plan eines Schulzimmers (Massstab 1 Feld = 1 m oder 2 m)
//   quartier      PLAN_DINGE.quartier      Plan eines Quartiers (Massstab 1 Feld = 10 m bis 100 m)
const PLAN_LISTEN = ["schulzimmer", "quartier"];

// [Name mit Artikel, im Dativ („neben …“), Mehrzahl (nur bei Dingen, die mehrmals vorkommen), Zeichen, Farbe 1–7]
// Zeichen: kreis, ring, quadrat, rechteck, dreieck, raute, stern, kreuz, x, balken, welle, sechseck,
// halbkreis, haus, baum, haken, H (Buchstabe). Farbe = Dekorationsfarbe --deko-1 … --deko-7.
// Ein Zeichen bedeutet in allen Plänen dasselbe oder kommt nur in einem vor (Befund LERN_Session38: das Kreuz war
// Garderobe und Kirche; das H, das Kinder vom Spital kennen, war die Bushaltestelle).
const PLAN_DINGE = {
  schulzimmer: [
    ["die Wandtafel", "der Wandtafel", "", "balken", 7],
    ["das Lehrerpult", "dem Lehrerpult", "", "quadrat", 3],
    ["der Schrank", "dem Schrank", "", "sechseck", 1],
    ["das Lavabo", "dem Lavabo", "", "ring", 6],
    ["die Türe", "der Türe", "", "dreieck", 2],
    ["das Bücherregal", "dem Bücherregal", "", "x", 5],
    ["der Computer", "dem Computer", "", "raute", 6],
    ["die Leseecke", "der Leseecke", "", "halbkreis", 4],
    ["der Abfalleimer", "dem Abfalleimer", "", "kreis", 7],
    ["die Garderobe", "der Garderobe", "", "haken", 1],
    ["das Schülerpult", "dem Schülerpult", "Schülerpulte", "rechteck", 4],
    ["die Pflanze", "der Pflanze", "Pflanzen", "baum", 5],
  ],
  quartier: [
    ["die Schule", "der Schule", "", "quadrat", 6],
    ["die Kirche", "der Kirche", "", "kreuz", 1],
    ["die Bäckerei", "der Bäckerei", "", "kreis", 3],
    ["die Post", "der Post", "", "stern", 4],
    ["der Spielplatz", "dem Spielplatz", "", "dreieck", 5],
    ["der Brunnen", "dem Brunnen", "", "ring", 6],
    ["die Bushaltestelle", "der Bushaltestelle", "", "rechteck", 4],
    ["das Feuerwehrdepot", "dem Feuerwehrdepot", "", "raute", 2],
    ["der Bahnhof", "dem Bahnhof", "", "balken", 7],
    ["der Weiher", "dem Weiher", "", "welle", 6],
    ["die Turnhalle", "der Turnhalle", "", "sechseck", 3],
    ["das Spital", "dem Spital", "", "H", 2],
    ["der Baum", "dem Baum", "Bäume", "baum", 5],
    ["das Wohnhaus", "dem Wohnhaus", "Wohnhäuser", "haus", 7],
  ],
};

// Massstab je Stufe: wie viele Meter ein Feld zeigt (zufällig einer der Werte)
const PLAN_MASSSTAB = {
  schulzimmer: { s3: [1], s4: [1, 2], s5: [2], s6: [1, 2] },
  quartier: { s3: [10], s4: [10, 20], s5: [50, 100], s6: [25, 50] },
};
