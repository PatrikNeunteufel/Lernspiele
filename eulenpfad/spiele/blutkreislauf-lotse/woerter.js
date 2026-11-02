/* Fragen für den Blutkreislauf-Lotsen — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG NMG.1.4.e (2. Zyklus, 5./6. Klasse): Skelett, Muskeln, Herz und Blutkreislauf;
   Stufe 1 des Spiels (4. Klasse) sinngemäss NMG.1.4.d: Organe und Körperreaktionen.

   Inhaltsliste (Entscheid L4 a): eine Liste, Id „fragen“ (Katalog, Eintrag „blutkreislauf-lotse“).
   Schreibweise je Frage:
     [Stufe, Thema, Frage, richtige Antwort, falsche Antwort, falsche Antwort, Erklärung]
   Stufe: 1 = Spielstufe 1 (Herz, 4. Klasse), 5 = Spielstufe 5 (Puls und Bewegung, Blut, Lunge).
   Thema: Schlüssel in KREISLAUF_TIPPS (Hinweis nach einer falschen Antwort, verrät die Lösung nicht).
   Die Erklärung erscheint nach der richtigen Antwort. Schweizer Schreibweise (ss statt ß).
   Zahlen ab fünf Stellen mit schmalem Leerzeichen („100 000“).

   Überschneidung: Das Körper-Puzzle (Basisklasse 2, Liste „kreislauf-haut“) fragt schon „Wohin führen
   die Arterien/Venen?“, „Was bringt das Blut …?“ und „Was spürst du am Handgelenk …?“ — diese Fragen
   stehen hier nicht. */

const KREISLAUF_FRAGEN = [
  // Stufe 1 (4. Klasse): das Herz
  [1, "herz", "Wie gross ist dein Herz ungefähr?", "etwa so gross wie deine Faust", "etwa so gross wie ein Fussball", "etwa so gross wie eine Erbse",
    "Ein Herz ist ungefähr so gross wie die Faust seines Besitzers. Es wächst mit dir mit."],
  [1, "herz", "Woraus besteht das Herz vor allem?", "aus Muskeln", "aus Knochen", "aus Fett",
    "Das Herz ist ein starker Muskel. Es zieht sich zusammen und drückt so das Blut hinaus."],
  [1, "herz", "Wann schlägt dein Herz?", "immer, Tag und Nacht, auch im Schlaf", "nur, wenn du dich bewegst", "nur am Tag",
    "Das Herz macht nie Pause. Im Schlaf schlägt es nur etwas langsamer."],
  [1, "herz", "Was schützt Herz und Lunge in der Brust?", "die Rippen", "der Schädel", "die Kniescheibe",
    "Die Rippen bilden zusammen den Brustkorb. Er schützt Herz und Lunge wie ein Käfig."],
  [1, "herz", "Wo kannst du deinen Herzschlag mit der Hand gut spüren?", "links an der Brust", "am Knie", "am Ellbogen",
    "Das Herz liegt in der Brust, etwas nach links. Leg die Hand dorthin, dann spürst du es klopfen."],
  [1, "herz", "Was hört die Ärztin mit dem Stethoskop an deiner Brust?", "den Herzschlag", "wie die Knochen wachsen", "wie die Haare wachsen",
    "Mit dem Stethoskop hört man das Herz schlagen und die Luft in der Lunge."],
  [1, "blut", "Wie kommt das Blut in jeden Teil deines Körpers?", "durch Blutgefässe", "durch die Knochen", "durch die Haut",
    "Blutgefässe sind Röhren, die durch den ganzen Körper gehen. Das Herz pumpt das Blut hindurch."],
  [1, "blut", "Wohin pumpt das Herz das Blut?", "in den ganzen Körper, vom Kopf bis zu den Zehen", "nur in den Kopf", "nur in die Beine",
    "Das Blut kommt überall hin: in den Kopf, in die Arme, in den Bauch und in die Beine."],
  [1, "lunge", "Wie viele Lungenflügel hast du?", "zwei", "einen", "vier",
    "Du hast einen rechten und einen linken Lungenflügel. Das Herz liegt dazwischen."],

  // Stufe 5: Puls und Bewegung
  [5, "puls", "Was zeigt dir der Puls?", "wie oft das Herz in einer Minute schlägt", "wie viel du wiegst", "wie warm du bist",
    "Bei jedem Herzschlag wird Blut in die Arterien gestossen. Diesen Stoss spürst du als Puls."],
  [5, "puls", "Wie oft schlägt das Herz eines Kindes in Ruhe ungefähr in einer Minute?", "etwa 80-mal", "etwa 8-mal", "etwa 800-mal",
    "In Ruhe schlägt das Herz eines Kindes etwa 70- bis 110-mal in der Minute, bei Erwachsenen etwas langsamer."],
  [5, "puls", "Wo am Hals kannst du deinen Puls fühlen?", "seitlich am Hals, neben dem Kehlkopf", "hinten im Nacken", "am Ohrläppchen",
    "Seitlich am Hals liegt eine grosse Arterie, die Halsschlagader. Dort spürst du den Puls gut."],
  [5, "puls", "Warum misst man den Puls nicht mit dem Daumen?", "Im Daumen spürst du deinen eigenen Puls.", "Der Daumen ist zu kurz.", "Der Daumen ist zu kalt.",
    "Im Daumen spürst du deinen eigenen Puls und zählst falsch. Nimm darum Zeige- und Mittelfinger."],
  [5, "puls", "Du zählst in 15 Sekunden 20 Pulsschläge. Wie oft schlägt das Herz in einer Minute?", "80-mal", "35-mal", "20-mal",
    "Eine Minute hat viermal 15 Sekunden: 4 · 20 = 80."],
  [5, "puls", "Du zählst in 30 Sekunden 45 Pulsschläge. Wie oft schlägt das Herz in einer Minute?", "90-mal", "75-mal", "45-mal",
    "Eine Minute hat zweimal 30 Sekunden: 2 · 45 = 90."],
  [5, "bewegung", "Was passiert mit deinem Puls, wenn du drei Minuten lang Seil springst?", "Er wird schneller.", "Er wird langsamer.", "Er bleibt genau gleich.",
    "Beim Springen arbeiten die Muskeln viel. Das Herz schlägt schneller, damit mehr Blut zu ihnen kommt."],
  [5, "bewegung", "Warum schlägt das Herz beim Rennen schneller?", "Die Muskeln brauchen mehr Sauerstoff und Nährstoffe.", "Das Herz will sich ausruhen.", "Das Blut wird beim Rennen dicker.",
    "Arbeitende Muskeln brauchen viel Sauerstoff. Das Herz pumpt darum schneller mehr Blut zu ihnen."],
  [5, "bewegung", "Warum atmest du beim Sport schneller und tiefer?", "Damit mehr Sauerstoff ins Blut kommt.", "Damit die Lunge kleiner wird.", "Damit der Magen schneller verdaut.",
    "Die Muskeln brauchen beim Sport mehr Sauerstoff. Mit schnellerem Atmen kommt mehr davon ins Blut."],
  [5, "bewegung", "Was passiert mit dem Puls, wenn du dich nach dem Rennen hinsetzt?", "Er wird langsam wieder ruhiger.", "Er hört ganz auf.", "Er wird immer schneller.",
    "Nach der Anstrengung beruhigt sich das Herz in ein paar Minuten wieder."],
  [5, "bewegung", "Wer regelmässig Sport treibt, hat in Ruhe oft …", "einen etwas langsameren Puls", "gar keinen Puls", "einen doppelt so schnellen Puls",
    "Ein trainiertes Herz pumpt bei jedem Schlag mehr Blut. Darum muss es in Ruhe weniger oft schlagen."],

  // Stufe 5: Blut
  [5, "blut", "Welche Aufgabe haben die roten Blutkörperchen?", "Sie bringen Sauerstoff zu allen Teilen des Körpers.", "Sie verdauen das Essen.", "Sie bauen die Knochen.",
    "Rote Blutkörperchen nehmen in der Lunge Sauerstoff auf und geben ihn im Körper wieder ab."],
  [5, "blut", "Welche Aufgabe haben die weissen Blutkörperchen?", "Sie wehren Krankheitserreger ab.", "Sie färben das Blut rot.", "Sie bringen das Essen in den Magen.",
    "Weisse Blutkörperchen sind die Polizei des Körpers: Sie bekämpfen Bakterien und Viren."],
  [5, "blut", "Was hilft, dass eine kleine Wunde aufhört zu bluten?", "die Blutplättchen", "die Lungenbläschen", "die Herzklappen",
    "Blutplättchen verkleben an der Wunde. So verschliesst sie sich, und später bildet sich Schorf."],
  [5, "blut", "Was transportiert das Blut ausser Sauerstoff noch?", "Nährstoffe aus dem Essen und Wärme", "Gedanken aus dem Gehirn", "Luft aus dem Magen",
    "Das Blut verteilt Nährstoffe und Wärme im ganzen Körper und holt Abfallstoffe wie Kohlendioxid ab."],
  [5, "blut", "Wie viel Blut hat ein erwachsener Mensch ungefähr?", "etwa 5 Liter", "etwa 5 Deziliter", "etwa 50 Liter",
    "Ein erwachsener Mensch hat ungefähr 5 Liter Blut, ein Kind etwas weniger."],
  [5, "blut", "Welche Farbe hat Blut mit wenig Sauerstoff wirklich?", "dunkelrot", "blau", "grün",
    "Blut ist immer rot, mit wenig Sauerstoff dunkelrot. Venen sehen durch die Haut nur bläulich aus. Auf Bildern malt man sie blau, damit man sie unterscheiden kann."],

  // Stufe 5: Lunge und Gasaustausch
  [5, "lunge", "Was nimmt das Blut in der Lunge auf?", "Sauerstoff", "Kohlendioxid", "Nährstoffe",
    "In der Lunge geht Sauerstoff aus der eingeatmeten Luft ins Blut."],
  [5, "lunge", "Was gibt das Blut in der Lunge ab?", "Kohlendioxid", "Sauerstoff", "rote Blutkörperchen",
    "Kohlendioxid entsteht in den Muskeln und Organen. Das Blut bringt es zur Lunge, und du atmest es aus."],
  [5, "lunge", "Wo genau geht der Sauerstoff in der Lunge ins Blut?", "in den Lungenbläschen", "in der Luftröhre", "im Kehlkopf",
    "Die Lunge hat Millionen winzige Lungenbläschen. Um jedes liegen feine Blutgefässe. Dort wechselt der Sauerstoff ins Blut."],
  [5, "lunge", "Wovon ist in der ausgeatmeten Luft mehr als in der eingeatmeten?", "Kohlendioxid", "Sauerstoff", "Staub",
    "Du atmest Sauerstoff ein und Kohlendioxid aus. In der ausgeatmeten Luft ist darum weniger Sauerstoff und mehr Kohlendioxid."],
  [5, "lunge", "Wofür braucht dein Körper den Sauerstoff?", "um aus der Nahrung Energie zu gewinnen", "um die Haare zu färben", "um das Blut blau zu machen",
    "Muskeln und Organe brauchen Sauerstoff, um aus der Nahrung Energie zu gewinnen. Dabei entsteht Kohlendioxid."],

  // Stufe 5: Herz und Blutgefässe
  [5, "kreislauf", "Wie heissen die feinsten Blutgefässe, durch die der Sauerstoff in den Körper gelangt?", "Haargefässe (Kapillaren)", "Herzklappen", "Lungenflügel",
    "Haargefässe sind dünner als ein Haar. Durch ihre dünne Wand gelangen Sauerstoff und Nährstoffe in den Körper."],
  [5, "herz", "Wozu hat das Herz Klappen?", "Damit das Blut nur in eine Richtung fliesst.", "Damit das Herz Luft holen kann.", "Damit das Blut kälter wird.",
    "Die Herzklappen sind wie Ventile: Sie gehen nur in eine Richtung auf."],
  [5, "herz", "Warum hat die linke Herzkammer die dickste Wand?", "Sie pumpt das Blut durch den ganzen Körper.", "Sie pumpt das Blut nur zur Lunge.", "Sie muss das Herz warm halten.",
    "Der Weg durch den Körper ist viel länger als der Weg zur Lunge. Darum braucht die linke Kammer am meisten Kraft."],
  [5, "herz", "Wie oft schlägt das Herz eines Erwachsenen an einem Tag ungefähr?", "etwa 100 000-mal", "etwa 1000-mal", "etwa 100-mal",
    "Bei 70 Schlägen in der Minute sind es in 24 Stunden etwa 100 000 Schläge."],
  [5, "kreislauf", "Welches Blutgefäss ist eine Arterie und führt trotzdem sauerstoffarmes Blut?", "die Lungenarterie", "die Aorta", "die Lungenvene",
    "Arterie heisst: vom Herzen weg. Die Lungenarterie bringt sauerstoffarmes Blut vom Herzen zur Lunge."],
  [5, "kreislauf", "Wie heisst die grosse Arterie, die das Blut aus der linken Kammer in den Körper führt?", "die Aorta", "die Hohlvene", "die Lungenvene",
    "Die Aorta ist die Hauptschlagader. Von ihr zweigen die Arterien in den ganzen Körper ab."],
];

// Hinweise nach einer falschen Antwort, je Thema (verraten die Lösung nicht).
const KREISLAUF_TIPPS = {
  herz: "Leg die Hand auf deine Brust und spür dein Herz. Was weisst du darüber?",
  blut: "Das Blut ist wie ein Lieferdienst im Körper. Was muss es wohin bringen?",
  lunge: "In der Lunge treffen Luft und Blut aufeinander. Was braucht der Körper, was muss er loswerden?",
  puls: "Der Puls ist der Stoss, den jeder Herzschlag in den Arterien macht. Lies genau und rechne nach.",
  bewegung: "Stell dir vor, du bist gerade gerannt. Was spürst du in deiner Brust?",
  kreislauf: "Arterien führen vom Herzen weg, Venen zum Herzen hin.",
};
