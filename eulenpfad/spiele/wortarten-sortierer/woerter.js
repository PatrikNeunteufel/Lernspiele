/* Wortlisten für den Wortarten-Sortierer — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG D.5.D.1: a Nomen, Verb, Adjektiv (erste Erfahrungen), b mit inhaltlichen Proben,
   c mit formalen Proben. Wortarten: N = Nomen, V = Verb, A = Adjektiv.
   Schweizer Schreibweise (ss). Adjektive, die beim Verb stehen („Der Hund bellt laut“), gelten
   nach Schweizer Schulgrammatik als Adjektiv. Wörter ohne Markierung werden nicht abgefragt.

   Sätze: Wörter in [Wort|Art] werden abgefragt, alles andere ist nur Text.

   Inhaltslisten (Entscheid L4 a): WOERTER (alle drei Wortarten) ist die Liste „einzelwoerter“;
   in SAETZE ist der Schlüssel die Liste-Id — „saetze-einfach“, „saetze-zeiten“, „saetze-nominal“.
   Der Prüfstand steht im Katalog (spiele/gemeinsam/katalog.js, Eintrag „wortarten-sortierer“,
   Feld listen). */

const WOERTER = {
  // Stufe 1–2: einzelne Wörter, eindeutige Wortart
  N: ["Hund", "Katze", "Haus", "Baum", "Ball", "Schule", "Apfel", "Blume", "Auto", "Tisch",
      "Buch", "Sonne", "Vogel", "Fisch", "Mutter", "Garten", "Stuhl", "Brot", "Hose", "Wald"],
  V: ["spielen", "laufen", "lesen", "schreiben", "singen", "malen", "springen", "trinken", "schlafen", "lachen",
      "rennen", "kochen", "tanzen", "schwimmen", "bauen", "rufen", "fragen", "helfen", "werfen", "weinen"],
  A: ["gross", "klein", "rot", "schnell", "langsam", "leise", "warm", "kalt", "lustig", "müde",
      "nass", "hell", "dunkel", "weich", "hart", "süss", "sauer", "alt", "neu", "stark"],
};

const SAETZE = {
  // Stufe 3: einfache Sätze, Grundformen und Präsens
  "saetze-einfach": [
    "Der [Hund|N] [bellt|V] [laut|A].",
    "Die [Katze|N] [schläft|V] auf dem [Sofa|N].",
    "[Lina|N] [malt|V] ein [rotes|A] [Haus|N].",
    "Der [Ball|N] [ist|V] [rund|A].",
    "Wir [spielen|V] im [Garten|N].",
    "Das [Wasser|N] [ist|V] [kalt|A].",
    "Mein [Bruder|N] [liest|V] ein [Buch|N].",
    "Die [Sonne|N] [scheint|V] [hell|A].",
    "Der [kleine|A] [Vogel|N] [singt|V].",
    "Die [Kinder|N] [lachen|V] [fröhlich|A].",
    "Im [Wald|N] [wohnt|V] ein [Fuchs|N].",
    "Der [Kuchen|N] [schmeckt|V] [süss|A].",
    "[Tim|N] [trinkt|V] [warme|A] [Milch|N].",
    "Die [alte|A] [Brücke|N] [ist|V] [lang|A].",
    "Der [Bus|N] [fährt|V] [schnell|A].",
  ],
  // Stufe 4: Vergangenheit, Steigerung, zusammengesetzte Zeiten
  "saetze-zeiten": [
    "Gestern [sprang|V] der [Hase|N] über den [Zaun|N].",
    "Der [Turm|N] [ist|V] [höher|A] als das [Haus|N].",
    "Meine [Schwester|N] [rannte|V] am [schnellsten|A].",
    "Wir [haben|V] einen [grossen|A] [Schneemann|N] [gebaut|V].",
    "Die [Blumen|N] [blühen|V] im [Frühling|N].",
    "Ihr [findet|V] den [Schlüssel|N] nicht.",
    "Der [Pullover|N] [ist|V] [weicher|A] als die [Jacke|N].",
    "Die [Lehrerin|N] [erzählte|V] eine [lustige|A] [Geschichte|N].",
    "Am [Abend|N] [leuchten|V] die [Sterne|N].",
    "Der [Zug|N] [fuhr|V] [langsamer|A] als das [Auto|N].",
  ],
  // Stufe 5: formale Proben — gleiche Wörter, andere Wortart (Nominalisierung)
  "saetze-nominal": [
    "Das [Lachen|N] der [Kinder|N] [ist|V] [laut|A].",
    "Beim [Essen|N] [spricht|V] niemand.",
    "Wir [essen|V] [frisches|A] [Brot|N].",
    "Das [Schwimmen|N] [macht|V] [Spass|N].",
    "Sie [spielt|V] ein [Spiel|N].",
    "Das [Blau|N] des [Himmels|N] [ist|V] [schön|A].",
    "Im [Dunkeln|N] [sieht|V] man wenig.",
    "Das [Gute|N] am [Regen|N]: Die [Pflanzen|N] [wachsen|V].",
    "Nach dem [Turnen|N] [sind|V] alle [müde|A].",
    "Nach dem [Rennen|N] [trinken|V] wir [kaltes|A] [Wasser|N].",
  ],
};
