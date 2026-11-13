/* Geräusche, Schutzmassnahmen, Ohr und Schall für den Lärm-Wächter — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG NMG.4.2 (Hören und Schall), Wortlaut von sg.lehrplan.ch (gelesen 2026-11-03):
     a (1. Zyklus, Grundanspruch): „Schallquellen und akustische Phänomene erkunden und beschreiben (Rauschen des
        Waldes, Singen, Küchengeräusche, Bau- oder Verkehrslärm, Stille)“
     b (2. Zyklus): „Ideen für Schutzmassnahmen gegen laute und anhaltende Geräusche entwickeln und deren Wirkung
        einschätzen (z.B. Kopfhörer, Ohrstöpsel, Lärmschutzwände)“
     c (Orientierungspunkt): „Zusammenhang zwischen Schwingungen und Tönen … Merkmale des Ohrs benennen:
        Ohrmuschel, Gehörgang, Trommelfell“
     d (Grundanspruch): „akustische Phänomene erforschen (Schallausbreitung: Echo benötigt Zeit; Verstärkung:
        Schalltrichter; Dämmung: Vorhang, Teppich)“

   Inhaltsliste (Entscheid L4 a): eine Liste, Id „geraeusche“ (Katalog, Eintrag „laerm-waechter“, Feld listen).
   Dazu gehören alle Sammlungen in dieser Datei: LAERM_GERAEUSCHE, LAERM_ORTE, LAERM_SCHUTZ, LAERM_SITUATIONEN,
   LAERM_SCHADET, LAERM_OHR_TEILE, LAERM_SCHWINGT, LAERM_PHAENOMENE, LAERM_DAEMPFER.
   Schweizer Schreibweise (ss statt ß), Sätze für die 3. Klasse. Keine Dezibel: Die Lautstärke ist eine
   Lärm-Skala von 1 (ganz leise) bis 5 (sehr laut), eine grobe Einschätzung für Kinder — keine Messung.

   Schreibweise LAERM_GERAEUSCHE (je Geräusch ein Objekt):
     id     Schlüssel
     bild   Bildzeichen auf der Karte; name  Name, wie er auf der Karte steht
     laut   Lärm-Skala 1–5: 1–2 leise (Stufe 1: Korb „leise“), 3 mittel, 4–5 laut (Korb „laut“)
     dauer  kurz (ein Knall, ein Bellen) oder lang (dauert an)
     ort    wo man es hört — für den Tipp („Du hörst es …“)
     knall  true: ein Knall nah am Ohr, der sofort schaden kann (Knallkörper in 1 m rund 142–148 dB Spitzenpegel,
            Schadensschwelle bei Einzelereignissen 135 dB, DAGA 2012); bei „Was ist schlimmer?“ nie das harmlosere
            Geräusch neben einem langen Lärm
   LAERM_ORTE: { bild, name, laut } — Stufe 2 „Wo ist es still?“: laut 1 = still, 4–5 = laut.
   LAERM_SCHUTZ (je Massnahme):
     id, name (so steht es auf dem Korb), bild
     wirkung  0 hilft nicht (Ablenker) · 1 hilft ein wenig · 2 hilft gut — gilt, wenn die Massnahme zur
              Situation passt (Feld schutz bzw. wenig der Situation); Ablenker (0) sind nie ein passender Schutz
     umschreibung  was man tut, ohne den Namen (Tipp 2)
     hinweis  nach einem falschen Korb: was die Massnahme wirklich tut (darf den eigenen Namen nennen)
   LAERM_SITUATIONEN (laute und anhaltende Geräusche, NMG.4.2.b):
     bild, text (Satz auf der Karte), laut 4–5, dauer
     schutz  Massnahmen, die hier gut helfen (wirkung 2) — in Stufe 3 ist genau eine davon im Korb
     wenig   Massnahmen, die hier nur ein wenig helfen (wirkung 1) — nur in Stufe 4 gefragt
     tipp    dritter Tipp: konkret (Dauer, Abstand), ohne die Lösung zu nennen
   LAERM_SCHADET: [Satz, schadet ja/nein, Tipp ohne Lösung] — „Was schadet den Ohren?“
   LAERM_OHR_TEILE: { id, name, artikel, lage, aufgabe, aussehen } — Ohr im Bild (data-teil); lage und
     aussehen ohne den eigenen Namen (Tipps und Hinweise)
   LAERM_SCHWINGT: [Satz, stimmt ja/nein, Tipp] — „Was schwingt?“
   LAERM_PHAENOMENE: { art: echo | verstaerkung | daemmung, bild, frage, richtig, falsch: [zwei], tipp }
   LAERM_DAEMPFER: { bild, name, daempft } — „Was dämpft den Schall am besten?“: ein dämpfendes gegen zwei harte.

   ZU PRÜFEN (kindgerecht vereinfacht, nicht aus einem Lehrmittel abgeschrieben):
   - Lärm-Skala je Geräusch: grobe Reihung (Flüstern 1 … Presslufthammer, Düsenflugzeug 5). In Stufe 1 kommen
     nur 1–2 gegen 4–5, in Stufe 2 nur Dreier mit Abstand 2 (1-3-5).
   - „Laut und lang ist am schlimmsten; laut und kurz schadet mehr als leise und lang“: Leise Geräusche schaden
     dem Gehör nicht, auch wenn sie lange dauern; ein sehr lauter Knall kann sofort schaden. Vereinfachung.
   - Wirkung: Ohrstöpsel, Gehörschutz, Abstand, Kopfhörer leiser, Fenster zu (drinnen gegen Lärm von draussen)
     und Lärmschutzwand = hilft gut; Hände auf die Ohren und eine Pause in der Stille = ein wenig (nur kurz,
     nicht dicht); Sonnenbrille, Augen schliessen, Handschuhe, lauter singen = hilft nicht.
   - Schnee dämpft den Schall (frischer, lockerer Schnee schluckt ihn); Teppich und Vorhang dämpfen, Fliesen,
     Glas und Beton werfen ihn zurück.
   - Echo: Schall prallt ab und braucht Zeit für den Weg; im kleinen Zimmer kommt er so schnell zurück, dass man
     ihn nicht getrennt hört. */

const LAERM_GERAEUSCHE = [
  // ---------- 1: ganz leise ----------
  { id: "fluestern", bild: "🤫", name: "Flüstern", laut: 1, dauer: "lang", ort: "im Klassenzimmer, wenn alle still sind" },
  { id: "blaetter", bild: "🍃", name: "Blätter rascheln", laut: 1, dauer: "lang", ort: "im Wald, wenn der Wind weht" },
  { id: "uhr", bild: "⏰", name: "Eine Uhr tickt", laut: 1, dauer: "lang", ort: "im stillen Zimmer" },
  { id: "katze", bild: "🐱", name: "Eine Katze schnurrt", laut: 1, dauer: "lang", ort: "auf dem Sofa" },
  { id: "schnee", bild: "❄️", name: "Schnee fällt", laut: 1, dauer: "lang", ort: "draussen im Winter" },
  { id: "seite", bild: "📖", name: "Eine Seite wird umgeblättert", laut: 1, dauer: "kurz", ort: "in der Bibliothek" },
  // ---------- 2: leise ----------
  { id: "regen", bild: "🌧️", name: "Regen auf dem Dach", laut: 2, dauer: "lang", ort: "im Haus, wenn es regnet" },
  { id: "gespraech", bild: "🗣️", name: "Ein normales Gespräch", laut: 2, dauer: "lang", ort: "am Tisch" },
  { id: "vogel", bild: "🐦", name: "Ein Vogel zwitschert", laut: 2, dauer: "lang", ort: "im Garten am Morgen" },
  { id: "wasserhahn", bild: "🚰", name: "Wasser aus dem Hahn", laut: 2, dauer: "lang", ort: "in der Küche" },
  { id: "radio", bild: "📻", name: "Leise Musik aus dem Radio", laut: 2, dauer: "lang", ort: "in der Küche" },
  // ---------- 3: mittel ----------
  { id: "staubsauger", bild: "svg:staubsauger", name: "Staubsauger", laut: 3, dauer: "lang", ort: "zu Hause beim Putzen" },
  { id: "glocke", bild: "🔔", name: "Die Schulglocke", laut: 3, dauer: "kurz", ort: "im Schulhaus" },
  { id: "hund", bild: "🐕", name: "Ein Hund bellt", laut: 3, dauer: "kurz", ort: "auf der Strasse" },
  { id: "foehn", bild: "svg:foehn", name: "Haarföhn", laut: 3, dauer: "lang", ort: "im Badezimmer" },
  { id: "pausenplatz", bild: "🏫", name: "Die Pause auf dem Schulhof", laut: 3, dauer: "lang", ort: "auf dem Pausenplatz" },
  { id: "velo", bild: "🚲", name: "Eine Velo-Klingel", laut: 3, dauer: "kurz", ort: "auf dem Schulweg" },
  // ---------- 4: laut ----------
  { id: "rasenmaeher", bild: "🚜", name: "Rasenmäher", laut: 4, dauer: "lang", ort: "im Garten" },
  { id: "motorrad", bild: "🏍️", name: "Motorrad", laut: 4, dauer: "lang", ort: "auf der Strasse" },
  { id: "baustelle", bild: "🏗️", name: "Baustelle", laut: 4, dauer: "lang", ort: "neben dem Haus, den ganzen Tag" },
  { id: "mixer", bild: "🥤", name: "Mixer in der Küche", laut: 4, dauer: "lang", ort: "in der Küche" },
  { id: "zug", bild: "🚆", name: "Ein Zug rattert vorbei", laut: 4, dauer: "lang", ort: "am Bahnhof" },
  { id: "donner", bild: "⛈️", name: "Donner", laut: 4, dauer: "kurz", ort: "beim Gewitter" },
  { id: "tuere", bild: "🚪", name: "Eine Türe knallt zu", laut: 4, dauer: "kurz", ort: "im Haus" },
  { id: "ballon", bild: "🎈", name: "Ein Ballon platzt", laut: 4, dauer: "kurz", ort: "am Geburtstagsfest", knall: true },
  // ---------- 5: sehr laut ----------
  { id: "flugzeug", bild: "✈️", name: "Düsenflugzeug beim Start", laut: 5, dauer: "lang", ort: "am Flughafen" },
  { id: "helikopter", bild: "🚁", name: "Helikopter", laut: 5, dauer: "lang", ort: "ganz nah über dir" },
  { id: "feuerwerk", bild: "🎆", name: "Feuerwerk", laut: 5, dauer: "lang", ort: "am 1. August" },
  { id: "knallkoerper", bild: "🧨", name: "Knallkörper", laut: 5, dauer: "kurz", ort: "direkt neben dir", knall: true },
  { id: "startpistole", bild: "🏁", name: "Startpistole beim Wettlauf", laut: 5, dauer: "kurz", ort: "am Sporttag", knall: true },
  { id: "sirene", bild: "🚨", name: "Sirene", laut: 5, dauer: "lang", ort: "wenn die Feuerwehr vorbeifährt" },
  { id: "presslufthammer", bild: "🚧", name: "Presslufthammer", laut: 5, dauer: "lang", ort: "auf der Strassenbaustelle" },
  { id: "konzert", bild: "🎸", name: "Rockkonzert", laut: 5, dauer: "lang", ort: "direkt vor der Bühne" },
];

const LAERM_ORTE = [
  { bild: "📚", name: "Bibliothek", laut: 1 },
  { bild: "🌲", name: "Wald in der Nacht", laut: 1 },
  { bild: "🛏️", name: "Schlafzimmer in der Nacht", laut: 1 },
  { bild: "🖼️", name: "Museum", laut: 1 },
  { bild: "🏔️", name: "Verschneite Berge", laut: 1 },
  { bild: "⛪", name: "Leere Kirche", laut: 1 },
  { bild: "🏗️", name: "Baustelle", laut: 5 },
  { bild: "✈️", name: "Flughafen", laut: 5 },
  { bild: "🏟️", name: "Fussballstadion", laut: 5 },
  { bild: "🎉", name: "Party mit lauter Musik", laut: 5 },
  { bild: "🚗", name: "Strasse mit viel Verkehr", laut: 4 },
  { bild: "🎡", name: "Jahrmarkt", laut: 4 },
  { bild: "🚉", name: "Bahnhof", laut: 4 },
  { bild: "🏭", name: "Fabrik mit Maschinen", laut: 5 },
];

const LAERM_SCHUTZ = [
  { id: "ohrstoepsel", name: "Ohrstöpsel", bild: "svg:ohrstoepsel", wirkung: 2,
    umschreibung: "etwas Kleines, Weiches, das du dir in beide Ohren steckst",
    hinweis: "Ohrstöpsel steckt man in die Ohren, wenn man weiss, dass es lange laut wird." },
  { id: "gehoerschutz", name: "Gehörschutz", bild: "svg:gehoerschutz", wirkung: 2,
    umschreibung: "grosse Kapseln, die du über beide Ohren setzt — wie dicke Kopfhörer ohne Musik",
    hinweis: "Ein Gehörschutz sind dicke Kapseln über den Ohren, für Maschinen und Motoren." },
  { id: "leiser", name: "Kopfhörer leiser stellen", bild: "🔉", wirkung: 2,
    umschreibung: "am Regler drehen, bis die Musik angenehm ist",
    hinweis: "Leiser stellen hilft nur, wenn der Lärm aus deinen eigenen Kopfhörern kommt." },
  { id: "abstand", name: "Abstand nehmen", bild: "🚶", wirkung: 2,
    umschreibung: "ein Stück weiter weg gehen — je weiter weg, desto ruhiger",
    hinweis: "Abstand nehmen hilft, wenn du selbst weggehen kannst: Weiter weg ist es ruhiger." },
  { id: "fenster", name: "Fenster schliessen", bild: "🪟", wirkung: 2,
    umschreibung: "den Lärm von draussen aussperren, damit er nicht ins Zimmer kommt",
    hinweis: "Das Fenster zu schliessen hilft nur drinnen, wenn der Lärm von draussen kommt." },
  { id: "wand", name: "Lärmschutzwand", bild: "🧱", wirkung: 2,
    umschreibung: "eine hohe Mauer zwischen der Strasse oder den Gleisen und den Häusern",
    hinweis: "Eine Lärmschutzwand ist eine hohe Mauer an einer Strasse oder Bahnlinie. Die baut man nicht an ein Fest." },
  { id: "haende", name: "Hände auf die Ohren", bild: "🙉", wirkung: 1,
    umschreibung: "schnell die Ohren zuhalten — hilft nur kurz und nicht ganz dicht",
    hinweis: "Die Hände auf den Ohren helfen nur kurz und nicht dicht. Für langen Lärm gibt es Besseres." },
  { id: "pause", name: "Pause in der Stille", bild: "🧘", wirkung: 1,
    umschreibung: "zwischendurch an einen ruhigen Ort gehen und die Ohren ausruhen lassen",
    hinweis: "Eine Pause in der Stille tut den Ohren gut, aber der Lärm ist danach noch da." },
  // Ablenker: hilft nicht
  { id: "sonnenbrille", name: "Sonnenbrille aufsetzen", bild: "🕶️", wirkung: 0,
    umschreibung: "", hinweis: "Eine Sonnenbrille schützt die Augen vor Licht. Deine Ohren merken davon nichts." },
  { id: "augen", name: "Augen schliessen", bild: "🙈", wirkung: 0,
    umschreibung: "", hinweis: "Mit geschlossenen Augen hörst du genau gleich viel." },
  { id: "handschuhe", name: "Handschuhe anziehen", bild: "🧤", wirkung: 0,
    umschreibung: "", hinweis: "Handschuhe wärmen die Hände. Mit den Ohren haben sie nichts zu tun." },
  { id: "singen", name: "Lauter singen", bild: "🎤", wirkung: 0,
    umschreibung: "", hinweis: "Lauter singen macht es für deine Ohren noch lauter, nicht leiser." },
];

const LAERM_SITUATIONEN = [
  { bild: "🎸", text: "Du gehst mit deiner Familie an ein lautes Konzert.", laut: 5, dauer: "lang",
    schutz: ["ohrstoepsel", "gehoerschutz", "abstand"], wenig: ["haende", "pause"],
    tipp: "Das Konzert dauert den ganzen Abend. Etwas, das du die ganze Zeit tragen kannst, oder ein Platz weiter hinten." },
  { bild: "🏗️", text: "Neben eurem Haus ist eine Baustelle. Du machst drinnen Hausaufgaben.", laut: 4, dauer: "lang",
    schutz: ["fenster", "ohrstoepsel", "gehoerschutz"], wenig: ["pause", "abstand", "haende"],
    tipp: "Du bist drinnen, der Lärm kommt von draussen. Wo kommt er herein?" },
  { bild: "🚜", text: "Papa mäht im Garten den Rasen. Du spielst daneben.", laut: 4, dauer: "lang",
    schutz: ["gehoerschutz", "ohrstoepsel", "abstand"], wenig: ["haende"],
    tipp: "Das Mähen dauert eine halbe Stunde. Du könntest auch einfach woanders spielen." },
  { bild: "🎆", text: "Am 1. August schaut ihr das grosse Feuerwerk an.", laut: 5, dauer: "lang",
    schutz: ["abstand", "ohrstoepsel", "gehoerschutz"], wenig: ["haende"],
    tipp: "Ganz vorn ist es am lautesten. Von weiter hinten sieht man es genauso gut." },
  { bild: "🎧", text: "Du hörst mit Kopfhörern Musik. Sie ist so laut, dass Mama dich nicht rufen kann.", laut: 5, dauer: "lang",
    schutz: ["leiser"], wenig: ["pause"],
    tipp: "Der Lärm kommt direkt aus den Kopfhörern. Du selbst bestimmst, wie stark er ist." },
  { bild: "🔨", text: "Dein Onkel bohrt mit der Bohrmaschine Löcher in die Wand. Du hilfst ihm.", laut: 4, dauer: "lang",
    schutz: ["gehoerschutz", "ohrstoepsel", "abstand"], wenig: ["haende"],
    tipp: "Das Bohren dauert eine Weile. Handwerker tragen bei Maschinen immer etwas über oder in den Ohren." },
  { bild: "🏍️", text: "Vor dem Fenster knattern laute Motorräder vorbei. Du willst schlafen.", laut: 4, dauer: "lang",
    schutz: ["fenster", "ohrstoepsel"], wenig: ["abstand", "haende"],
    tipp: "Du liegst drinnen im Bett, der Lärm kommt von der Strasse. Wo kommt er herein?" },
  { bild: "🎉", text: "An der Party ist die Musik so laut, dass du dein eigenes Wort nicht verstehst.", laut: 5, dauer: "lang",
    schutz: ["abstand", "ohrstoepsel", "gehoerschutz"], wenig: ["pause", "haende"],
    tipp: "Direkt beim Lautsprecher ist es am lautesten. Weiter weg hört man die Musik immer noch." },
  { bild: "🚆", text: "Eure Schule liegt direkt an der Bahnlinie. Alle paar Minuten rattert ein Zug vorbei.", laut: 4, dauer: "lang",
    schutz: ["wand", "fenster"], wenig: ["ohrstoepsel", "haende"],
    tipp: "Die Züge fahren jeden Tag. Zwischen Gleise und Schulhaus kann man etwas bauen." },
  { bild: "🚧", text: "Auf der Strasse vor dem Haus arbeitet jemand mit dem Presslufthammer.", laut: 5, dauer: "lang",
    schutz: ["fenster", "ohrstoepsel", "abstand", "gehoerschutz"], wenig: ["haende"],
    tipp: "Der Lärm kommt von draussen und dauert Stunden. Entweder aussperren, oder weg davon." },
  { bild: "🏎️", text: "Ihr schaut ein Autorennen an. Die Motoren heulen die ganze Zeit.", laut: 5, dauer: "lang",
    schutz: ["gehoerschutz", "ohrstoepsel", "abstand"], wenig: ["haende"],
    tipp: "Das Rennen dauert Stunden. Die Leute am Rennen tragen fast alle etwas über den Ohren." },
  { bild: "🧨", text: "Ein Kollege will direkt neben dir einen Knallkörper zünden.", laut: 5, dauer: "kurz",
    schutz: ["abstand"], wenig: ["haende", "ohrstoepsel", "gehoerschutz"],
    tipp: "Ein Knall ganz nah ist am gefährlichsten. Was kannst du schnell tun, bevor es knallt?" },
  { bild: "🛣️", text: "Neben dem Dorf führt die Autobahn vorbei. Tag und Nacht rauschen die Autos.", laut: 4, dauer: "lang",
    schutz: ["wand", "fenster"], wenig: ["ohrstoepsel", "haende"],
    tipp: "Der Lärm hört nie auf. Zwischen Autobahn und Häuser kann man etwas Hohes bauen." },
  { bild: "🎺", text: "Du spielst in der Blasmusik mit — direkt neben der grossen Trommel.", laut: 4, dauer: "lang",
    schutz: ["ohrstoepsel", "abstand"], wenig: ["pause", "haende"],
    tipp: "Die Probe dauert eine Stunde. Musiker stecken sich dafür etwas in die Ohren, oder sie stellen sich anders hin." },
  { bild: "🏭", text: "Mama arbeitet in einer Fabrik mit lauten Maschinen.", laut: 4, dauer: "lang",
    schutz: ["gehoerschutz", "ohrstoepsel"], wenig: ["pause", "haende"],
    tipp: "Die Maschinen laufen den ganzen Tag. In der Fabrik tragen alle etwas über oder in den Ohren." },
  { bild: "🚁", text: "Ein Helikopter landet auf der Wiese nebenan.", laut: 5, dauer: "lang",
    schutz: ["abstand", "gehoerschutz", "ohrstoepsel"], wenig: ["haende"],
    tipp: "Je näher du stehst, desto lauter. Du kannst selbst weggehen." },
];

const LAERM_SCHADET = [
  ["Jeden Tag stundenlang sehr laute Musik über Kopfhörer hören.", true, "Sehr laut und sehr lange — das ist die schlimmste Mischung für die Ohren."],
  ["Jemand flüstert dir etwas ins Ohr.", false, "Flüstern ist das leiseste Geräusch, das es gibt."],
  ["Ein Knallkörper explodiert direkt neben deinem Ohr.", true, "Ein Knall ganz nah ist so laut, dass er sofort schaden kann."],
  ["Am Morgen zwitschern die Vögel vor dem Fenster.", false, "Vogelgezwitscher ist leise und tut niemandem weh."],
  ["Am Konzert stehst du den ganzen Abend direkt vor dem Lautsprecher.", true, "Direkt am Lautsprecher ist es am lautesten — und das stundenlang."],
  ["Leise Musik läuft aus dem Radio in der Küche.", false, "Leise Musik ist so leise wie ein Gespräch."],
  ["Regen trommelt auf das Dach.", false, "Regen rauscht leise, auch wenn er lange dauert."],
  ["Du arbeitest eine Stunde mit dem Presslufthammer ohne Gehörschutz.", true, "Der Presslufthammer ist eine der lautesten Maschinen, die es gibt."],
  ["Eine Katze schnurrt auf deinem Schoss.", false, "Schnurren ist ganz leise. Man spürt es fast mehr, als man es hört."],
  ["Jemand schreit dir aus nächster Nähe ins Ohr.", true, "Schreien direkt am Ohr ist viel lauter, als du denkst."],
  ["Du gehst im Wald spazieren und hörst den Wind in den Bäumen.", false, "Der Wind in den Blättern rauscht leise."],
  ["Du stehst jeden Tag neben einem startenden Düsenflugzeug ohne Schutz.", true, "Ein Düsenflugzeug beim Start gehört zu den lautesten Dingen überhaupt."],
  ["Du redest mit deiner Freundin in normaler Lautstärke.", false, "Ein Gespräch ist das Geräusch, für das die Ohren gemacht sind."],
  ["Du hörst ein Hörbuch in angenehmer Lautstärke.", false, "Angenehm heisst: Du könntest nebenbei noch reden."],
  ["Du mähst jede Woche stundenlang ohne Gehörschutz den Rasen.", true, "Der Rasenmäher ist laut, und das jede Woche lange."],
  ["Du stehst am Feuerwerk ganz hinten, weit weg von den Raketen.", false, "Mit viel Abstand kommt bei den Ohren viel weniger an."],
];

const LAERM_OHR_TEILE = [
  { id: "ohrmuschel", name: "Ohrmuschel", artikel: "die",
    lage: "Sie ist aussen am Kopf — der Teil, den du sehen und anfassen kannst.",
    aufgabe: "fängt den Schall von aussen auf — wie ein Trichter",
    aussehen: "wie ein gebogener Trichter aus Haut" },
  { id: "gehoergang", name: "Gehörgang", artikel: "der",
    lage: "Er führt von aussen wie ein Tunnel in den Kopf hinein.",
    aufgabe: "führt den Schall wie ein Tunnel tief in den Kopf hinein",
    aussehen: "eine Röhre, etwa so dick wie dein kleiner Finger" },
  { id: "trommelfell", name: "Trommelfell", artikel: "das",
    lage: "Es sitzt ganz am Ende des Tunnels, tief im Kopf.",
    aufgabe: "schwingt, wenn Schall ankommt — wie das Fell einer Trommel",
    aussehen: "ein dünnes, gespanntes Häutchen" },
];

const LAERM_SCHWINGT = [
  ["Wenn du eine Gitarrensaite zupfst, schwingt sie — und du hörst einen Ton.", true, "Schau einer Saite zu, wenn sie klingt: Sie zittert ganz schnell."],
  ["Das Trommelfell im Ohr schwingt, wenn Schall ankommt.", true, "Es heisst so, weil es sich wie das Fell einer Trommel verhält."],
  ["Die Luft trägt den Schall von der Glocke bis zu deinem Ohr.", true, "Zwischen Glocke und Ohr ist nichts als Luft — und trotzdem hörst du sie."],
  ["Ein Ton entsteht auch, wenn gar nichts schwingt.", false, "Überleg: Was tut die Saite, die Trommel oder deine Stimme, wenn ein Ton kommt?"],
  ["Hältst du die klingende Saite mit dem Finger fest, hörst du den Ton weiter.", false, "Probier es aus: Was passiert mit dem Ton, wenn die Saite nicht mehr schwingen kann?"],
  ["Legst du beim Summen die Hand an den Hals, spürst du ein Zittern.", true, "Deine Stimme entsteht im Hals. Probier es aus!"],
  ["Eine Trommel klingt, weil ihr Fell schwingt.", true, "Streu Reiskörner auf eine Trommel und schlag daneben: Sie hüpfen."],
  ["Schall kann man mit den Augen sehen.", false, "Überleg: Siehst du, was von der Glocke zu deinem Ohr fliegt?"],
  ["Je stärker die Saite schwingt, desto lauter ist der Ton.", true, "Zupf einmal sanft und einmal kräftig: Was ist anders am Ton?"],
  ["Wenn die Lautsprecher-Membran stillsteht, kommt trotzdem Musik heraus.", false, "Leg die Hand auf einen Lautsprecher, wenn Musik läuft: Was spürst du?"],
  ["Wenn du sprichst, bringt deine Stimme die Luft zum Schwingen.", true, "Halte ein dünnes Blatt Papier vor den Mund und summe laut: Was macht das Blatt?"],
  ["Eine Stimmgabel klingt erst, wenn sie schwingt.", true, "Schlag sie an und halte sie dann fest: Was passiert mit dem Ton?"],
];

const LAERM_PHAENOMENE = [
  // ---------- Echo: der Schall braucht Zeit ----------
  { art: "echo", bild: "🏔️", frage: "Du rufst in den Bergen „Hallo!“ — und kurz danach hörst du es noch einmal. Warum?",
    richtig: "Der Schall prallt am Berg ab und kommt zurück. Für den Weg braucht er Zeit.",
    falsch: ["Ein anderes Kind auf dem Berg ruft zurück.", "Deine Stimme wird in den Bergen von selbst lauter."],
    tipp: "Stell dir den Schall wie einen Ball vor, den du gegen eine Wand wirfst." },
  { art: "echo", bild: "🏟️", frage: "In der grossen, leeren Halle hörst du dein Klatschen nachhallen. Warum?",
    richtig: "Der Schall prallt an den Wänden ab und kommt zu dir zurück.",
    falsch: ["Die Halle macht den Schall leiser.", "In der grossen Halle ist zu wenig Luft."],
    tipp: "Die Wände sind weit weg. Was macht der Schall, wenn er auf eine harte Wand trifft?" },
  { art: "echo", bild: "⏱️", frage: "Warum hörst du das Echo erst eine kurze Zeit nach dem Rufen?",
    richtig: "Der Schall muss erst bis zum Berg und wieder zurück — das dauert.",
    falsch: ["Der Berg wartet kurz, bevor er antwortet.", "Das Echo ist langsamer, weil es leiser ist."],
    tipp: "Der Schall legt einen Weg zurück — hin und wieder her. Jeder Weg braucht Zeit." },
  { art: "echo", bild: "🛏️", frage: "In deinem Zimmer hörst du kein Echo, in den Bergen schon. Warum?",
    richtig: "Die Wand ist so nah, dass der Schall sofort zurück ist — zu schnell, um es getrennt zu hören.",
    falsch: ["Im Zimmer gibt es keinen Schall.", "Zimmerwände lassen den Schall durch."],
    tipp: "Je weiter die Wand weg ist, desto länger dauert es, bis der Schall zurück ist." },
  { art: "echo", bild: "🚢", frage: "Ein Schiff hupt im Nebel und hört die Hupe von der Felswand zurück. Was verrät das dem Kapitän?",
    richtig: "Dass eine Felswand in der Nähe ist — je schneller das Echo kommt, desto näher.",
    falsch: ["Dass ein anderes Schiff antwortet.", "Dass der Nebel den Schall zurückwirft."],
    tipp: "Das Echo kommt vom Felsen. Wie lange der Schall hin und zurück braucht, sagt etwas über den Abstand." },
  // ---------- Verstärkung: Schalltrichter ----------
  { art: "verstaerkung", bild: "🖐️", frage: "Du hältst die Hand hinter das Ohr. Was passiert?",
    richtig: "Die Hand fängt mehr Schall auf und leitet ihn ins Ohr — du hörst besser.",
    falsch: ["Die Hand hält den Schall vom Ohr fern.", "Es ändert sich nichts."],
    tipp: "Die Hand wird zu einem grösseren Trichter vor dem Ohr. Was macht ein Trichter?" },
  { art: "verstaerkung", bild: "📣", frage: "Wozu rufen Leute durch einen Schalltrichter (ein Megafon)?",
    richtig: "Der Trichter bündelt den Schall in eine Richtung — so hört man die Stimme weiter weg.",
    falsch: ["Der Trichter macht die Stimme höher.", "Der Trichter macht die Stimme leiser, damit sie nicht schadet."],
    tipp: "Ohne Trichter geht der Schall in alle Richtungen. Mit Trichter geht er fast nur noch nach vorn." },
  { art: "verstaerkung", bild: "👂", frage: "Warum ist die Ohrmuschel wie ein Trichter geformt?",
    richtig: "Sie fängt den Schall auf und leitet ihn in den Gehörgang.",
    falsch: ["Damit das Ohr schöner aussieht.", "Damit kein Schall ins Ohr kommt."],
    tipp: "Ein Trichter sammelt, was von aussen kommt, und leitet es nach innen weiter." },
  { art: "verstaerkung", bild: "🧻", frage: "Du rollst ein Blatt Papier zum Trichter und hältst das dünne Ende ans Ohr. Was passiert?",
    richtig: "Du hörst leise Geräusche besser, weil der Trichter mehr Schall einfängt.",
    falsch: ["Du hörst gar nichts mehr.", "Alle Geräusche werden höher."],
    tipp: "Die grosse Öffnung sammelt den Schall, die kleine leitet ihn ins Ohr." },
  // ---------- Dämmung: Vorhang, Teppich, Schnee ----------
  { art: "daemmung", bild: "🛋️", frage: "Im Zimmer mit Teppich und Vorhängen klingt es leiser als im leeren Zimmer mit Fliesen. Warum?",
    richtig: "Weiche Stoffe schlucken den Schall, statt ihn zurückzuwerfen.",
    falsch: ["Der Teppich macht den Schall schneller.", "Im leeren Zimmer ist mehr Luft für den Schall."],
    tipp: "Was passiert mit einem Ball, der auf ein Kissen fällt — und was auf Fliesen?" },
  { art: "daemmung", bild: "❄️", frage: "Nach dem Schneefall ist es draussen ganz still. Warum?",
    richtig: "Der weiche, lockere Schnee schluckt den Schall.",
    falsch: ["Im Winter gibt es keine Geräusche.", "Die Kälte lässt den Schall einfrieren."],
    tipp: "Frischer Schnee ist weich und voller Luft — wie ein dicker Teppich." },
  { art: "daemmung", bild: "🎬", frage: "Warum hängen im Kino dicke Vorhänge und weiche Stoffe an den Wänden?",
    richtig: "Sie schlucken den Schall, damit es im Saal nicht hallt.",
    falsch: ["Damit es im Kino wärmer ist.", "Damit der Ton lauter wird."],
    tipp: "Harte Wände werfen den Schall zurück. Was tun weiche Stoffe?" },
  // Weiche Stoffe schlucken den Hall im eigenen Raum; gegen Lärm durch eine Wand helfen sie kaum (dafür braucht es
  // Masse) — darum fragt die Aufgabe nach dem Hall im Übungsraum, nicht nach dem Lärm der Nachbarn (LERN_Session38).
  { art: "daemmung", bild: "🥁", frage: "Im Übungsraum hallt das Schlagzeug laut von den kahlen Wänden. Was hilft?",
    richtig: "Dicke, weiche Stoffe an der Wand oder ein Teppich, die den Schall schlucken.",
    falsch: ["Die Wand mit glatten Fliesen bekleben.", "Das Fenster öffnen, damit der Schall hinaus kann."],
    tipp: "Du willst, dass der Schall geschluckt wird — mit etwas Weichem, nicht mit etwas Hartem." },
];

const LAERM_DAEMPFER = [
  { bild: "svg:teppich", name: "Dicker Teppich", daempft: true },
  { bild: "svg:vorhang", name: "Schwerer Vorhang", daempft: true },
  { bild: "❄️", name: "Frischer Schnee", daempft: true },
  { bild: "svg:kissen", name: "Kissen", daempft: true },
  { bild: "🧣", name: "Wolldecke", daempft: true },
  { bild: "svg:fliesen", name: "Glatte Fliesen", daempft: false },
  { bild: "🪞", name: "Glasscheibe", daempft: false },
  { bild: "🏢", name: "Betonwand", daempft: false },
  { bild: "🔩", name: "Metallplatte", daempft: false },
  { bild: "🪨", name: "Felswand", daempft: false },
];
