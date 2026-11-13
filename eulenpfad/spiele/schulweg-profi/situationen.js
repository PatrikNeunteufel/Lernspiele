// Inhalte für „Schulweg-Profi“ (Lehrplan SG NMG.1.2.b: sich vor Gefahren schützen, im Strassenverkehr).
// Schweizer Regeln: Fussgängerstreifen gelb; Merksatz „Warte, luege, lose, laufe“; „Rad steht, Kind
// geht“; ohne Trottoir am linken Strassenrand gehen (SVG Art. 49 Abs. 1); Velo: zwei Bremsen, Glocke,
// Licht vorne weiss und hinten rot (VTS). Bewusst weggelassen, weil es von Alter oder Ort abhängt:
// Velofahren auf dem Trottoir (bis 12 Jahre erlaubt, wenn kein Radweg da ist), Velofahren ohne
// Begleitung, Trottinett.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a), einzeln freizugeben. Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Spiel „schulweg-profi“, Feld listen); Kinder sehen nur Inhalte aus
// freien Listen.
//   sicher-gefaehrlich  SW_SICHER                Ist das sicher oder gefährlich?
//   queren              SW_FRAGEN (Liste queren) und SW_MERKSATZ   über die Strasse gehen
//   signale             SW_SIGNALE               Was bedeutet das Signal?
//   velo                SW_FRAGEN (Liste velo)   Velo fahren
const SW_LISTEN = ["sicher-gefaehrlich", "queren", "signale", "velo"];

// [Bild, Situation, sicher?] — Liste sicher-gefaehrlich
const SW_SICHER = [
  ["✋", "Am Strassenrand stehen bleiben und warten", true],
  ["👀", "Nach links und rechts schauen, bevor du gehst", true],
  ["🚶", "Auf dem Trottoir gehen", true],
  ["🦺", "Im Dunkeln Leuchtstreifen tragen", true],
  ["🚴", "Mit Helm Velo fahren", true],
  ["🧑‍🧒", "Mit einem Erwachsenen an der Hand über die Strasse gehen", true],
  ["⚽", "Dem Ball auf die Strasse nachrennen", false],
  ["🏃", "Ohne zu schauen über die Strasse rennen", false],
  ["🚗", "Zwischen parkierten Autos auf die Strasse gehen", false],
  ["📱", "Beim Überqueren der Strasse aufs Handy schauen", false],
  ["🌑", "Im Dunkeln mit dunklen Kleidern unterwegs sein", false],
  ["🚦", "Bei Rot über die Strasse gehen", false],
];

// Merksatz in der Reihenfolge, [Bild, Mundart, Hochdeutsch] — Liste queren
const SW_MERKSATZ = [["✋", "warte", "warten"], ["👀", "luege", "schauen"], ["👂", "lose", "hören"], ["🚶", "laufe", "gehen"]];

// [ab Stufe, Liste, Bild, Frage, richtig, falsch, falsch, Erklärung] — Stufe = Spielstufe.
// Bild: Emoji oder „ampel:rot“, „ampel:gruen“ (zeichnet das Spiel).
const SW_FRAGEN = [
  [2, "queren", "ampel:rot", "Das Männchen ist rot. Was machst du?", "warten", "gehen", "rennen", "Bei Rot wartest du am Strassenrand."],
  [2, "queren", "ampel:gruen", "Das Männchen ist grün. Was machst du?", "schauen, dann gehen", "rennen, ohne zu schauen", "stehen bleiben, bis es rot ist", "Bei Grün darfst du gehen. Schau trotzdem, ob alle Autos anhalten."],
  [2, "queren", "🎨", "Welche Farbe hat der Fussgängerstreifen in der Schweiz?", "gelb", "weiss", "rot", "In der Schweiz sind die Fussgängerstreifen gelb."],
  [2, "queren", "🚦", "Wo wartest du, bis du über die Strasse gehen kannst?", "auf dem Trottoir am Rand", "auf der Strasse", "mitten auf dem Fussgängerstreifen", "Auf dem Trottoir bist du sicher, bis du gehen kannst."],
  [2, "queren", "👂", "Warum hörst du gut hin, bevor du über die Strasse gehst?", "Manchmal hört man ein Auto, bevor man es sieht.", "Damit es nicht langweilig ist.", "Weil die Strasse spricht.", "Ohren helfen den Augen: Ein Motor ist oft schon zu hören, bevor das Auto um die Ecke kommt."],
  [2, "queren", "🚑", "Ein Krankenwagen kommt mit Blaulicht und Sirene. Was machst du?", "am Rand warten, bis er vorbei ist", "schnell über die Strasse rennen", "auf die Strasse gehen und winken", "Fahrzeuge mit Blaulicht und Sirene haben immer Vortritt."],
  [2, "queren", "🚸", "Wo gehst du am sichersten über die Strasse?", "auf dem Fussgängerstreifen", "zwischen parkierten Autos", "in einer Kurve", "Auf dem Fussgängerstreifen rechnen die Autofahrer mit dir."],
  [2, "queren", "🦶", "Du stehst am Fussgängerstreifen. Was machst du zuerst?", "warten", "laufen", "rennen", "Zuerst wartest du am Rand, dann schaust und hörst du."],
  [3, "queren", "🚗", "Ein Auto hält vor dem Fussgängerstreifen. Wann gehst du los?", "wenn die Räder stillstehen", "wenn es langsamer wird", "sofort, ohne zu schauen", "Rad steht, Kind geht: Erst wenn das Auto ganz steht, gehst du."],
  [3, "queren", "↔️", "Von welcher Seite kommen die Autos auf der Strassenseite nahe bei dir?", "von links", "von rechts", null, "In der Schweiz fahren die Autos rechts. Auf der nahen Seite kommen sie von links."],
  [3, "queren", "🚌", "Du steigst aus dem Bus und willst über die Strasse. Was machst du?", "warten, bis der Bus weggefahren ist", "vorne am Bus vorbei rennen", "hinten am Bus vorbei rennen", "Wenn der Bus weg ist, siehst du die Autos — und sie sehen dich."],
  [3, "queren", "🚙", "Warum ist es gefährlich, zwischen parkierten Autos über die Strasse zu gehen?", "Die Autofahrer sehen dich nicht.", "Dort ist der Weg länger.", "Dort ist es zu laut.", "Hinter einem parkierten Auto bist du versteckt. Die Autofahrer sehen dich erst spät."],
  [3, "queren", "⚽", "Dein Ball rollt auf die Strasse. Was machst du?", "am Rand stehen bleiben", "sofort nachrennen", "rufen und hinterherrennen", "Bleib stehen. Erst wenn kein Auto kommt, holst du den Ball — oder du fragst einen Erwachsenen."],
  [3, "queren", "🌙", "Es ist dunkel. Wie sehen dich die Autofahrer schon von weitem?", "mit hellen Kleidern und Leuchtstreifen", "mit dunklen Kleidern", "mit einer Mütze", "Helle Kleider und Leuchtstreifen sieht man im Scheinwerferlicht schon von weitem."],
  [6, "queren", "🛣️", "Es gibt kein Trottoir. Wo gehst du?", "am linken Strassenrand, den Autos entgegen", "am rechten Strassenrand", "in der Mitte der Strasse", "So siehst du die Autos kommen. Das verlangen die Verkehrsregeln."],
  [6, "queren", "🚗", "Warum kann ein Auto nicht sofort anhalten?", "Es braucht einen Bremsweg.", "Es fährt zu leise.", "Autos halten nur bei Rot.", "Auch mit voller Bremse rollt ein Auto noch ein Stück weiter, bis es steht."],
  [6, "queren", "🛣️", "Ein Auto hält, aber auf der zweiten Spur kommt noch eines. Was machst du?", "warten und schauen, ob auch das zweite hält", "losgehen, weil das erste hält", "schnell rennen", "Jede Spur zählt: Erst wenn auch das zweite Auto steht, gehst du."],
  [5, "velo", "🚲", "Auf welcher Seite der Strasse fährst du Velo?", "rechts", "links", "in der Mitte", "In der Schweiz fahren alle Fahrzeuge rechts."],
  [5, "velo", "↩️", "Du willst mit dem Velo links abbiegen. Was machst du vorher?", "zurückschauen und den linken Arm ausstrecken", "einfach abbiegen", "klingeln und sofort abbiegen", "Mit dem Handzeichen zeigst du den anderen, wohin du fährst."],
  [5, "velo", "🚲", "Welche Farbe hat das Licht hinten am Velo?", "rot", "weiss", "grün", "Vorne leuchtet das Velolicht weiss, hinten rot."],
  [5, "velo", "🔦", "Welche Farbe hat das Licht vorne am Velo?", "weiss", "rot", "blau", "Vorne leuchtet das Velolicht weiss, hinten rot."],
  [5, "velo", "🔔", "Was braucht ein Velo, damit andere dich hören?", "eine Glocke", "einen Korb", "einen Gepäckträger", "Eine Glocke gehört an jedes Velo."],
  [5, "velo", "🚴", "Was schützt beim Velofahren deinen Kopf?", "ein Velohelm", "eine Mütze", "eine Sonnenbrille", "Der Helm schützt den Kopf, wenn du stürzt."],
  [5, "velo", "🚲", "Wie viele Bremsen braucht ein Velo?", "zwei", "eine", "keine", "Ein Velo braucht zwei Bremsen: eine vorne und eine hinten."],
  [5, "velo", "🚚", "Ein Lastwagen will rechts abbiegen. Wo ist es für dich gefährlich?", "rechts neben dem Lastwagen", "weit hinter dem Lastwagen", "auf dem anderen Trottoir", "Rechts neben dem Lastwagen sieht dich der Fahrer nicht. Das ist der tote Winkel."],
  [6, "velo", "🌙", "Du fährst im Dunkeln Velo. Was muss am Velo leuchten?", "Licht vorne und hinten", "nur das Licht hinten", "nichts, die Strassenlampen reichen", "Im Dunkeln brauchst du Licht vorne und hinten, damit man dich sieht."],
];

// [Schlüssel, Bedeutung, Bedeutungen, die auch passen würden (nie als Ablenker)] — Liste signale.
// Gezeichnet nach der Signalisationsverordnung (SSV): Verbote weiss mit rotem Rand ohne Schrägstrich,
// Vorschriften blau, Hinweis Fussgängerstreifen blaues Quadrat.
const SW_SIGNALE = [
  ["stop", "Ganz anhalten und den anderen den Vortritt lassen", []],
  ["einfahrt-verboten", "Hier darf kein Fahrzeug hineinfahren", ["Hier dürfen keine Velos fahren"]],
  ["fussgaengerstreifen", "Hier ist ein Fussgängerstreifen", []],
  ["fussweg", "Weg nur für Fussgänger", ["Hier dürfen keine Velos fahren"]],
  ["radweg", "Weg für Velos", ["Hier dürfen keine Fussgänger gehen"]],
  ["verbot-fussgaenger", "Hier dürfen keine Fussgänger gehen", []],
  ["verbot-velo", "Hier dürfen keine Velos fahren", []],
];
