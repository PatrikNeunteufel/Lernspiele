/* Verben und Sätze für Zeitreise-Verben — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG D.5.D.1.b (Orientierungspunkt 4. Klasse): „erste Erfahrung mit Präsens,
   Präteritum, Perfekt“; D.5.D.1.c (5./6. Klasse): Zeitformen benennen und bilden.

   Je Verb eine Zeile:
     [Grundform, Präsens (er/sie/es), Präteritum (er/sie/es), Partizip (ge-Form), Hilfsverb im Perfekt,
      Satzgegenstand, Rest des Satzes]
   Daraus baut das Spiel die drei Sätze:
     Präsens:    <Satzgegenstand> <Präsens> <Rest>.             Lina spielt im Garten.
     Präteritum: <Satzgegenstand> <Präteritum> <Rest>.          Lina spielte im Garten.
     Perfekt:    <Satzgegenstand> <Hilfsverb> <Rest> <Partizip>. Lina hat im Garten gespielt.

   Bewusst weggelassen: trennbare Verben (aufstehen — der Teil „auf“ wandert ans Satzende), Verben,
   bei denen im Perfekt „hat“ und „ist“ beide üblich sind (schwimmen, reiten; liegen, sitzen,
   stehen — in der Schweiz mit „ist“), und Verben, deren falsch gebildete Form ein echtes Wort wäre
   (wachsen → „wachste“ gibt es bei „Ski wachsen“). Die Namen sind erfunden.
   Schweizer Schreibweise (ss statt ß: er ass).

   Inhaltslisten (Entscheid L4 a): Die Aufsicht gibt die zwei Listen einzeln frei. Der Prüfstand
   steht im Katalog (spiele/gemeinsam/katalog.js, Eintrag zeitreise-verben, Feld listen).
     regelmaessig    VERBEN_REGELMAESSIG
     unregelmaessig  VERBEN_UNREGELMAESSIG */

// Regelmässig: Präteritum mit -te, Partizip ge-…-t. Das Spiel prüft diese Formen nach der Regel nach.
const VERBEN_REGELMAESSIG = [
  ["spielen",  "spielt",   "spielte",    "gespielt",   "hat", "Lina",        "im Garten"],
  ["malen",    "malt",     "malte",      "gemalt",     "hat", "Tim",         "ein Bild"],
  ["kochen",   "kocht",    "kochte",     "gekocht",    "hat", "Papa",        "eine Suppe"],
  ["lachen",   "lacht",    "lachte",     "gelacht",    "hat", "Opa",         "laut"],
  ["bauen",    "baut",     "baute",      "gebaut",     "hat", "Noah",        "eine Sandburg"],
  ["kaufen",   "kauft",    "kaufte",     "gekauft",    "hat", "Mama",        "Brot"],
  ["hören",    "hört",     "hörte",      "gehört",     "hat", "Mia",         "Musik"],
  ["lernen",   "lernt",    "lernte",     "gelernt",    "hat", "Ben",         "das Einmaleins"],
  ["tanzen",   "tanzt",    "tanzte",     "getanzt",    "hat", "Sara",        "auf der Bühne"],
  ["sagen",    "sagt",     "sagte",      "gesagt",     "hat", "Lea",         "nichts"],
  ["wohnen",   "wohnt",    "wohnte",     "gewohnt",    "hat", "Oma",         "in Bern"],
  ["zeichnen", "zeichnet", "zeichnete",  "gezeichnet", "hat", "Elias",       "einen Drachen"],
  ["putzen",   "putzt",    "putzte",     "geputzt",    "hat", "Nina",        "das Fenster"],
  ["regnen",   "regnet",   "regnete",    "geregnet",   "hat", "Es",          "den ganzen Tag"],
  ["fragen",   "fragt",    "fragte",     "gefragt",    "hat", "Luca",        "die Lehrerin"],
  ["warten",   "wartet",   "wartete",    "gewartet",   "hat", "Der Hund",    "vor der Tür"],
  ["wandern",  "wandert",  "wanderte",   "gewandert",  "ist", "Die Klasse",  "auf den Berg"],
  ["reisen",   "reist",    "reiste",     "gereist",    "ist", "Onkel Paul",  "nach Italien"],
  ["landen",   "landet",   "landete",    "gelandet",   "ist", "Das Flugzeug", "in Zürich"],
  ["klettern", "klettert", "kletterte",  "geklettert", "ist", "Die Katze",   "auf den Baum"],
  ["hüpfen",   "hüpft",    "hüpfte",     "gehüpft",    "ist", "Der Frosch",  "ins Wasser"],
];

// Unregelmässig: Präteritum und Partizip muss man sich merken.
const VERBEN_UNREGELMAESSIG = [
  ["singen",    "singt",    "sang",    "gesungen",    "hat", "Der Chor",    "ein Lied"],
  ["lesen",     "liest",    "las",     "gelesen",     "hat", "Lina",        "ein Buch"],
  ["schreiben", "schreibt", "schrieb", "geschrieben", "hat", "Tim",         "einen Brief"],
  ["trinken",   "trinkt",   "trank",   "getrunken",   "hat", "Mia",         "Tee"],
  ["essen",     "isst",     "ass",     "gegessen",    "hat", "Ben",         "einen Apfel"],
  ["finden",    "findet",   "fand",    "gefunden",    "hat", "Noah",        "einen Stein"],
  ["sehen",     "sieht",    "sah",     "gesehen",     "hat", "Sara",        "einen Regenbogen"],
  ["schlafen",  "schläft",  "schlief", "geschlafen",  "hat", "Das Baby",    "lange"],
  ["nehmen",    "nimmt",    "nahm",    "genommen",    "hat", "Luca",        "den Bus"],
  ["helfen",    "hilft",    "half",    "geholfen",    "hat", "Elias",       "seiner Oma"],
  ["werfen",    "wirft",    "warf",    "geworfen",    "hat", "Nina",        "den Ball"],
  ["bringen",   "bringt",   "brachte", "gebracht",    "hat", "Der Pöstler", "ein Paket"],
  ["tragen",    "trägt",    "trug",    "getragen",    "hat", "Papa",        "den Koffer"],
  ["rufen",     "ruft",     "rief",    "gerufen",     "hat", "Mama",        "die Kinder"],
  ["geben",     "gibt",     "gab",     "gegeben",     "hat", "Lea",         "dem Hund Futter"],
  ["gehen",     "geht",     "ging",    "gegangen",    "ist", "Tim",         "nach Hause"],
  ["fahren",    "fährt",    "fuhr",    "gefahren",    "ist", "Oma",         "mit dem Zug"],
  ["fliegen",   "fliegt",   "flog",    "geflogen",    "ist", "Der Vogel",   "über das Feld"],
  ["laufen",    "läuft",    "lief",    "gelaufen",    "ist", "Ben",         "zur Schule"],
  ["kommen",    "kommt",    "kam",     "gekommen",    "ist", "Der Zug",     "zu spät"],
  ["springen",  "springt",  "sprang",  "gesprungen",  "ist", "Der Hund",    "über den Zaun"],
  ["fallen",    "fällt",    "fiel",    "gefallen",    "ist", "Das Glas",    "auf den Boden"],
  ["rennen",    "rennt",    "rannte",  "gerannt",     "ist", "Mia",         "zum Bus"],
  ["steigen",   "steigt",   "stieg",   "gestiegen",   "ist", "Noah",        "auf die Leiter"],
  ["bleiben",   "bleibt",   "blieb",   "geblieben",   "ist", "Luca",        "zu Hause"],
];
