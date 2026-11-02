/* Bilder zu Gegensätzen für die Gegenteil-Wippe — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG MA.3.A.1: a (Kindergarten) Grössen beschreiben und vergleichen: lang/kurz,
   schnell/langsam, vorher/nachher, breit/schmal, dick/dünn, gross/klein, schwer/leicht;
   b Steigerungsformen („am grössten“, der Grösse nach ordnen).

   Schreibweise: Schweizer Schreibweise (ss statt ß). Namen mit Artikel, so wie die Eule sie
   vorliest („das Nilpferd“). Nur eindeutige Paare: Jedes Kind soll ohne Zweifel sagen können,
   welches Ding grösser, schwerer … ist. Bewusst andere Paare als die Schätz-Waage (Elefant/Maus,
   Auto/Velo, Kuh/Huhn, Giraffe/Katze, Baum/Blume …).

   Merkmale: "gross" (gross – klein), "schwer" (schwer – leicht), "lang" (lang – kurz),
   "schnell" (schnell – langsam), "dick" (dick – dünn), "breit" (breit – schmal),
   "vorher" (vorher – nachher).

   Inhaltsliste (Entscheid L4 a): eine Liste, Id „gegenteile“. Der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag „gegenteil-wippe“, Feld listen). */

const GEGENTEIL_LISTEN = {
  gegenteile: {
    // [Merkmal, [Bild, Name] mit MEHR davon (grösser, schwerer, länger, schneller; bei vorher: zuerst),
    //  [Bild, Name] mit WENIGER davon (kleiner, leichter, kürzer, langsamer; bei vorher: danach)]
    paare: [
      ["gross", ["🦛", "das Nilpferd"], ["🐸", "der Frosch"]],
      ["gross", ["🐻", "der Bär"], ["🐞", "der Marienkäfer"]],
      ["gross", ["🏰", "das Schloss"], ["🛖", "die Hütte"]],
      ["gross", ["⛰️", "der Berg"], ["🪨", "der Stein"]],
      ["gross", ["🐳", "der Wal"], ["🐟", "der Fisch"]],
      ["gross", ["🌳", "der Baum"], ["🍄", "der Pilz"]],
      ["schwer", ["🪨", "der Stein"], ["🪶", "die Feder"]],
      ["schwer", ["🚚", "der Lastwagen"], ["🛴", "das Trottinett"]],
      ["schwer", ["🦏", "das Nashorn"], ["🐦", "der Vogel"]],
      ["schwer", ["📚", "der Bücherstapel"], ["📄", "das Blatt Papier"]],
      ["schwer", ["🧱", "der Backstein"], ["🎈", "der Ballon"]],
      ["schwer", ["🛋️", "das Sofa"], ["🧦", "die Socke"]],
      ["lang", ["🐍", "die Schlange"], ["🐛", "die Raupe"]],
      ["lang", ["🥖", "das Baguette"], ["🥐", "das Gipfeli"]],
      ["schnell", ["🐇", "der Hase"], ["🐢", "die Schildkröte"]],
      ["schnell", ["🚀", "die Rakete"], ["🐌", "die Schnecke"]],
      ["schnell", ["🏎️", "das Rennauto"], ["🚜", "der Traktor"]],
      ["vorher", ["🥚", "das Ei"], ["🐥", "das Küken"]],
      ["vorher", ["🐛", "die Raupe"], ["🦋", "der Schmetterling"]],
      ["vorher", ["🌱", "der Keimling"], ["🌻", "die Sonnenblume"]],
      ["vorher", ["👶", "das Baby"], ["🧓", "der Grossvater"]],
      ["vorher", ["🌽", "der Mais"], ["🍿", "das Popcorn"]],
      ["vorher", ["🥔", "die Kartoffel"], ["🍟", "die Pommes frites"]],
      ["vorher", ["🐑", "das Schaf"], ["🧶", "die Wolle"]],
      ["vorher", ["🌾", "das Korn"], ["🍞", "das Brot"]],
    ],
    // Gleiches Ding verschieden gezeichnet (SVG im Spiel, vier Stufen): [Merkmal, Zeichnung, Name].
    // Ein Paar nimmt eine dicke und eine dünne Fassung; Reihen nehmen drei oder vier Stufen.
    gezeichnet: [
      ["lang", "stift", "der Stift"],
      ["lang", "leiter", "die Leiter"],
      ["dick", "stift", "der Stift"],
      ["dick", "baum", "der Baum"],
      ["dick", "buch", "das Buch"],
      ["breit", "tuer", "die Tür"],
      ["breit", "weg", "der Weg"],
      ["breit", "band", "das Band"],
    ],
    // Reihen vom WENIGSTEN zum MEISTEN (klein → gross, leicht → schwer …): [Merkmal, [[Bild, Name], …]]
    reihen: [
      ["gross", [["🐞", "der Marienkäfer"], ["🐸", "der Frosch"], ["🐕", "der Hund"], ["🦛", "das Nilpferd"]]],
      ["gross", [["🐜", "die Ameise"], ["🐭", "die Maus"], ["🐈", "die Katze"], ["🐻", "der Bär"]]],
      ["gross", [["🪨", "der Stein"], ["🏠", "das Haus"], ["⛰️", "der Berg"]]],
      ["gross", [["🐟", "der Fisch"], ["🐬", "der Delfin"], ["🐳", "der Wal"]]],
      ["schwer", [["🎈", "der Ballon"], ["📚", "der Bücherstapel"], ["🛋️", "das Sofa"], ["🚚", "der Lastwagen"]]],
      ["schwer", [["🐦", "der Vogel"], ["🐕", "der Hund"], ["🦏", "das Nashorn"]]],
      ["lang", [["🛴", "das Trottinett"], ["🚗", "das Auto"], ["🚌", "der Bus"], ["🚆", "der Zug"]]],
      ["schnell", [["🐌", "die Schnecke"], ["🚲", "das Velo"], ["🚗", "das Auto"], ["✈️", "das Flugzeug"]]],
    ],
  },
};
