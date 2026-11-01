// Inhalte für „Gedicht-Baukasten“ (Lehrplan SG D.6.C.1.e). Alle Verse sind selbst verfasst (keine
// fremden Gedichte). Schweizer Schreibweise.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Regeln für die Vierzeiler (das Spiel prüft sie): Nur der letzte Vers endet mit Punkt oder
// Ausrufezeichen, damit die Reihenfolge beim Ordnen eindeutig ist; beim umarmenden Reim beginnt der
// dritte Vers mit „und“ (Vers 2 und 3 reimen sich nicht mit Vers 1 und haben beide ein Komma).
//
// Inhaltslisten (Entscheid L4 a), einzeln freizugeben. Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Spiel „gedicht-baukasten“, Feld listen).
//   reimpaare  REIMPAARE                Zweizeiler: das Reimwort ergänzen
//   paarreim   VIERZEILER.paarreim      Vierzeiler aabb
//   kreuzreim  VIERZEILER.kreuzreim     Vierzeiler abab
//   umarmend   VIERZEILER.umarmend      Vierzeiler abba
//   strophen   STROPHEN_GEDICHTE        Gedichte mit zwei oder drei Strophen
const GEDICHT_LISTEN = ["reimpaare", "paarreim", "kreuzreim", "umarmend", "strophen"];

// [erster Vers, zweiter Vers mit Lücke {}, Reimwort, passt aber reimt nicht, passt aber reimt nicht,
//  reimt aber passt nicht (erst ab Stufe 2)] — Liste reimpaare
const REIMPAARE = [
  ["Im Garten steht ein grosser Baum,", "darunter träum ich einen {}.", "Traum", "Tag", "Film", "Schaum"],
  ["Die Sonne lacht, der Himmel blau,", "im Park spaziert die alte {}.", "Frau", "Dame", "Katze", "Bau"],
  ["Der Hase hoppelt übers Feld,", "er rennt so schnell wie ein {}.", "Held", "Pferd", "Auto", "Zelt"],
  ["Die Maus sitzt still in ihrem Loch,", "der Kater wartet draussen {}.", "noch", "lange", "dort", "Koch"],
  ["Im Winter fällt der weisse Schnee,", "ich trinke heissen {}.", "Tee", "Kakao", "Saft", "See"],
  ["Der Frosch sitzt quakend auf dem Stein", "und fängt sich eine Fliege {}.", "ein", "schnell", "weg", "Bein"],
  ["Der Wind, der bläst mir ins Gesicht,", "den Drachen halten kann ich {}.", "nicht", "kaum", "gut", "Licht"],
  ["Die Schnecke kriecht ganz langsam fort,", "bald ist sie an dem nächsten {}.", "Ort", "Platz", "Baum", "Wort"],
  ["Ich habe Hunger, grosse Not,", "da backt mir Opa frisches {}.", "Brot", "Gipfeli", "Zopf", "Boot"],
  ["Am Himmel fliegt ein Flugzeug hin,", "ich frage mich, wo ich morgen {}.", "bin", "wohne", "schlafe", "Kinn"],
  ["Die Katze schleicht durchs hohe Gras,", "die Mäusejagd macht ihr viel {}.", "Spass", "Freude", "Mühe", "Glas"],
  ["Im Herbst wird es schon früher Nacht,", "wir haben uns ein Feuer {}.", "gemacht", "angezündet", "gebaut", "gelacht"],
  ["Ich habe einen kleinen Hund,", "sein Fell ist weich, sein Bauch ist {}.", "rund", "dick", "warm", "Mund"],
  ["Die Glocke läutet: bim, bam, bum,", "die Pause ist schon wieder {}.", "um", "vorbei", "fertig", "dumm"],
  ["Ein Vogel singt ein frohes Lied,", "weil er die erste Sonne {}.", "sieht", "spürt", "mag", "zieht"],
  ["Wir spielen Fussball auf dem Platz,", "der Ball fliegt hoch mit einem {}.", "Satz", "Sprung", "Knall", "Schatz"],
];

// Vierzeiler: je vier Verse — Listen paarreim (aabb), kreuzreim (abab), umarmend (abba)
const VIERZEILER = {
  paarreim: [
    ["Die Sonne scheint, der Tag ist warm,", "die Bienen fliegen aus im Schwarm,", "sie summen laut von Blatt zu Blatt", "und trinken sich am Nektar satt."],
    ["Am Morgen kräht der Hahn so laut,", "dass jeder aus dem Fenster schaut,", "die Katze springt erschreckt vom Tisch,", "und Mama bringt den Zopf ganz frisch."],
    ["Der Schnee fällt leise auf das Haus,", "die Kinder rennen schnell hinaus,", "sie rollen Kugeln, Stück für Stück,", "und kommen nass und froh zurück."],
    ["Ich fahre mit dem Velo weit,", "denn heute habe ich viel Zeit,", "ich fahre bis zum See hinunter", "und werde froh und immer munter."],
    ["Die Katze liegt auf meinem Bett,", "sie schnurrt und findet es so nett,", "die Maus schleicht leise nun vorbei", "und pfeift ein Liedchen, eins, zwei, drei."],
    ["Im Herbst, da tanzt das bunte Laub,", "es wirbelt mit im Strassenstaub,", "der Igel sucht sich Laub zum Nest", "und schläft den ganzen Winter fest."],
    ["Wir gehen heute in den Zoo,", "die Kinder sind darüber froh,", "der Löwe gähnt, der Affe lacht,", "das Nilpferd schläft bei Tag und Nacht."],
    ["Der Regen klopft ans Fensterglas,", "ich weiss, das macht den Blumen Spass,", "ich zieh die gelben Stiefel an", "und springe in die Pfützen dann."],
  ],
  kreuzreim: [
    ["Der Mond steht hoch am Himmelszelt,", "die Sterne leuchten fein,", "es schläft die ganze weite Welt,", "nur der Uhu wacht allein."],
    ["Im Frühling summt die erste Biene,", "der Schnee ist längst vorbei,", "sie fliegt zur Blüte der Lupine,", "das Huhn legt froh ein Ei."],
    ["Ich hab ein kleines Boot gebaut", "aus Holz und einem Tuch,", "es schwimmt davon, ich ruf ganz laut,", "jetzt such ich es und such."],
    ["Am Sonntag gehen wir zum See,", "die Enten schwimmen dort,", "ich werfe Brot und trinke Tee,", "dann fliegen alle fort."],
    ["Die Schule ist für heute aus,", "wir packen schnell die Sachen,", "dann rennen alle froh nach Haus", "und spielen, toben, lachen."],
    ["Der Bauer fährt aufs grosse Feld,", "die Sonne brennt so heiss,", "er hat den Acker gut bestellt", "und wischt sich ab den Schweiss."],
    ["Der Fuchs schleicht leise durch den Wald,", "er sucht nach einer Maus,", "die Nacht ist dunkel, still und kalt,", "die Maus bleibt schlau im Haus."],
    ["Wenn draussen leise Flocken fallen,", "dann wird die Stube warm,", "man hört die frohen Stimmen schallen,", "die Katze schnurrt im Arm."],
  ],
  umarmend: [
    ["Im Sommer sind die Tage lang,", "wir baden in dem kühlen Rhein", "und essen Glace im Sonnenschein,", "bis abends tönt der Amselsang."],
    ["Die Wolken ziehen übers Land,", "der Wind bläst kalt und laut,", "und jeder, der nach oben schaut,", "sieht Schiffe, Burgen, Elefant."],
    ["Der Igel schläft im Blätterhaus,", "er hat sich eingerollt", "und träumt von Käfern, ganz aus Gold,", "und schläft bis in den März hinaus."],
    ["Mein Grossvater erzählt so gern", "von Zeiten, lang vorbei,", "und wie er einst als Bub so frei", "geschaut hat in den hellsten Stern."],
    ["Am Bach, da steht ein alter Steg,", "die Fische schwimmen schnell", "und glitzern silberhell,", "dann geh ich still auf meinem Weg."],
    ["Die Glocke läutet laut im Turm,", "es ist schon Mittagszeit,", "und bis nach Haus ist es nicht weit,", "drum renn ich heim im Sturm."],
  ],
};

// Gedichte mit Strophen: [Titel, [[Reimschema der Strophe, Verse …], …]] — Liste strophen.
// Reimschema: paarreim, kreuzreim, umarmend (bei zwei Versen: paarreim).
const STROPHEN_GEDICHTE = [
  ["Die Schwalbe", [
    ["paarreim", "Im Frühling kommt die Schwalbe her,", "sie fliegt hoch übers Land und Meer,", "sie baut ein Nest aus Lehm am Haus,", "und bald schaun kleine Köpfe raus."],
    ["paarreim", "Im Herbst wird es ihr hier zu kalt,", "sie sammelt sich mit andern bald,", "dann zieht sie fort mit ihrem Schwarm", "nach Afrika, dort ist es warm."],
  ]],
  ["Die Ente", [
    ["paarreim", "Die Ente schwimmt im kühlen Teich,", "ihr Federkleid ist warm und weich."],
    ["paarreim", "Sie taucht hinab bis auf den Grund", "und schnappt sich einen Wurm, ganz rund."],
    ["paarreim", "Dann schüttelt sie sich, plitsch und platsch,", "und watschelt heim durch Schlamm und Matsch."],
  ]],
  ["Winter", [
    ["kreuzreim", "Der Winter kommt mit Eis und Schnee,", "die Bäume stehen kahl,", "es friert der kleine Gartensee,", "die Sonne scheint nur schmal."],
    ["kreuzreim", "Wir fahren Schlitten auf dem Hang,", "die Wangen werden rot,", "und abends trinken wir noch lang", "den Tee mit Honigbrot."],
  ]],
  ["Der Käfer", [
    ["paarreim", "Ein Käfer krabbelt übers Blatt,", "er ist vom vielen Laufen matt."],
    ["paarreim", "Er ruht sich aus im Sonnenlicht", "und rührt sich eine Weile nicht."],
    ["paarreim", "Dann fliegt er summend in die Höh", "und landet sanft im grünen Klee."],
  ]],
  ["Gute Nacht", [
    ["umarmend", "Am Abend wird es still im Haus,", "die Lampe leuchtet warm,", "die Katze schläft in meinem Arm,", "dann geht auch bald das Licht aus."],
    ["umarmend", "Ich mache meine Augen zu,", "der Mond schaut still herein,", "ich träume von dem Sonnenschein,", "und alles kommt zur Ruh."],
  ]],
];
