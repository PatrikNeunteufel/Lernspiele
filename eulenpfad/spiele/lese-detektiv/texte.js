// Texte für den Lese-Detektiv (Lehrplan SG D.2.B.1). [Stufe, Titel oder null, Text, Frage, richtig, falsch, falsch]
// Stufe 1: ein Satz, Antworten sind Bilder. Die Namen sind erfunden.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a): Die Texte einer Stufe (erstes Feld) bilden eine Liste, die die
// Aufsicht einzeln freigibt (Zuordnung in LESETEXTE_LISTEN). Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Eintrag lese-detektiv, Feld listen). Eine Spielstufe braucht ihre
// eigene Liste; ab Stufe 3 kommen die Texte der Stufe davor dazu, wenn deren Liste frei ist.

const LESETEXTE_LISTEN = { 1: "bildsaetze", 2: "kurztexte", 3: "sachtexte-kurz", 4: "zwischen-zeilen", 5: "sachtexte-lang", 6: "sachtexte-folgern" };

const LESETEXTE = [
  [1, null, "Der Apfel ist grün.", "Welches Bild passt?", "🍏", "🍎", "🍐"],
  [1, null, "Im Glas ist Milch.", "Welches Bild passt?", "🥛", "🧃", "☕"],
  [1, null, "Die Sonne scheint.", "Welches Bild passt?", "☀️", "🌧️", "❄️"],
  [1, null, "Es schneit.", "Welches Bild passt?", "❄️", "☀️", "🌧️"],
  [1, null, "Drei Fische schwimmen.", "Welches Bild passt?", "🐟🐟🐟", "🐟🐟", "🐦🐦🐦"],
  [1, null, "Der Hund hat einen Knochen.", "Welches Bild passt?", "🐕 🦴", "🐈 🦴", "🐕 ⚽"],
  [1, null, "Das Taxi ist gelb.", "Welches Bild passt?", "🚕", "🚗", "🚙"],
  [1, null, "Zwei Katzen spielen.", "Welches Bild passt?", "🐈🐈", "🐈🐈🐈", "🐕🐕"],
  [2, null, "Mia hat einen Hund. Er heisst Bello. Bello spielt gern mit dem Ball.", "Wie heisst der Hund?", "Bello", "Mia", "Ball"],
  [2, null, "Tom isst einen Apfel. Der Apfel ist grün und süss.", "Welche Farbe hat der Apfel?", "grün", "rot", "gelb"],
  [2, null, "Heute regnet es. Lena nimmt den Regenschirm mit.", "Was nimmt Lena mit?", "den Regenschirm", "die Sonnenbrille", "den Ball"],
  [2, null, "Im Garten steht ein Baum. Auf dem Baum sitzt eine Katze.", "Wo sitzt die Katze?", "auf dem Baum", "im Haus", "unter dem Tisch"],
  [2, null, "Ben hat Geburtstag. Er wird heute acht Jahre alt.", "Wie alt wird Ben?", "acht Jahre", "sieben Jahre", "neun Jahre"],
  [3, "Der Igel", "Der Igel hat viele Stacheln. Wenn er Angst hat, rollt er sich zu einer Kugel zusammen. In der Nacht sucht er Käfer, Würmer und Schnecken. Im Winter hält er Winterschlaf.", "Was macht der Igel, wenn er Angst hat?", "Er rollt sich zu einer Kugel zusammen.", "Er klettert auf einen Baum.", "Er springt ins Wasser."],
  [3, "Die Biene", "Bienen fliegen von Blüte zu Blüte. Dort sammeln sie Nektar. Aus dem Nektar machen sie Honig. Bienen leben in einem Bienenstock.", "Was machen Bienen aus dem Nektar?", "Honig", "Milch", "Käse"],
  [3, "Das Eichhörnchen", "Das Eichhörnchen lebt im Wald. Im Herbst sammelt es Nüsse und versteckt sie im Boden. Im Winter sucht es seine Vorräte. Manche Nüsse findet es nicht mehr. Aus ihnen wachsen neue Bäume.", "Was wächst aus den vergessenen Nüssen?", "neue Bäume", "Pilze", "Blumen"],
  [3, "Schneeflocken", "Wenn es sehr kalt ist, fällt Schnee. Schneeflocken sind aus Eis. Jede Flocke hat sechs Spitzen.", "Wie viele Spitzen hat eine Schneeflocke?", "sechs", "vier", "acht"],
  [4, null, "Lukas zieht seine Stiefel und die dicke Jacke an. Er nimmt die Schaufel und geht hinaus. Bald steht vor dem Haus ein grosser Schneemann.", "Welche Jahreszeit ist es?", "Winter", "Sommer", "Frühling"],
  [4, null, "Anna packt Badetuch, Sonnencreme und Badekleid ein. Dann fährt sie mit dem Velo zum See.", "Was will Anna am See machen?", "baden", "Schlittschuh laufen", "Pilze sammeln"],
  [4, null, "Der Bäcker steht jeden Morgen um drei Uhr auf. Wenn die anderen Leute aufwachen, sind Brot und Gipfeli schon fertig.", "Warum steht der Bäcker so früh auf?", "Damit Brot und Gipfeli am Morgen fertig sind.", "Weil er nicht schlafen kann.", "Weil er in die Schule muss."],
  [4, null, "Im Herbst werden die Blätter gelb, rot und braun. Dann fallen sie zu Boden. Im Frühling wachsen an den Ästen neue Blätter.", "Was passiert im Herbst mit den Blättern?", "Sie werden bunt und fallen herunter.", "Sie werden grün.", "Sie wachsen neu."],
  [5, "Der Rhein", "Der Rhein ist einer der grössten Flüsse Europas. Er entspringt in den Alpen im Kanton Graubünden. Bei Schaffhausen stürzt er über den Rheinfall. In Basel verlässt er die Schweiz und fliesst bis in die Nordsee.", "Was stimmt?", "Der Rhein fliesst bis in die Nordsee.", "Der Rhein entspringt in Basel.", "Der Rheinfall ist in Genf."],
  [5, "Der Steinbock", "Der Steinbock lebt in den Bergen und kann sehr gut klettern. Die Männchen haben lange, gebogene Hörner. Vor gut hundert Jahren gab es in der Schweiz keine Steinböcke mehr. Heute leben wieder viele in den Alpen.", "Was stimmt?", "Heute leben wieder viele Steinböcke in den Alpen.", "Steinböcke leben am Meer.", "Steinböcke können nicht klettern."],
  [5, "Der Mond", "Der Mond kreist um die Erde. Er leuchtet nicht selbst, sondern wird von der Sonne beschienen. Für eine Runde um die Erde braucht er ungefähr einen Monat.", "Was stimmt?", "Der Mond wird von der Sonne beschienen.", "Der Mond leuchtet selbst wie eine Lampe.", "Der Mond braucht einen Tag für eine Runde um die Erde."],
  [5, "Die Kartoffel", "Die Kartoffel wächst unter der Erde. Im Frühling legt man Kartoffeln in den Boden. Aus jeder wächst eine Pflanze mit vielen neuen Knollen. Im Spätsommer und Herbst werden sie geerntet.", "Was stimmt?", "Kartoffeln wachsen unter der Erde.", "Kartoffeln wachsen an Bäumen.", "Man erntet Kartoffeln im Winter."],
  // Stufe 6 (Königsstufe): längere Sachtexte, die Antwort steht nicht wörtlich da — man muss
  // zwei Stellen verbinden. NEU in LERN_Session2, UNGEPRÜFT.
  [6, "Der Biber", "Der Biber lebt an Bächen und Flüssen. Mit seinen scharfen Zähnen kann er sogar Bäume fällen. Er wohnt in einer Biberburg aus Ästen und Schlamm. Der Eingang zur Burg muss immer unter Wasser liegen. Ist ein Bach zu wenig tief, baut der Biber einen Damm aus Ästen, Steinen und Schlamm. Hinter dem Damm staut sich das Wasser.", "Warum baut der Biber einen Damm?", "Damit das Wasser tief genug für den Eingang seiner Burg ist.", "Damit er trockenen Fusses über den Bach gehen kann.", "Damit die Fische nicht wegschwimmen können."],
  [6, "Schwalbe und Meise", "Die Schwalbe frisst nur Insekten. Sie fängt sie im Flug. Im Herbst wird es bei uns kalt, und es fliegen kaum noch Insekten herum. Dann fliegt die Schwalbe weit nach Süden, bis nach Afrika. Die Meise frisst im Sommer auch Insekten. Im Winter frisst sie Samen und Körner. Sie bleibt das ganze Jahr bei uns.", "Warum kann die Meise im Winter bei uns bleiben?", "Sie findet auch im Winter Futter: Samen und Körner.", "Sie friert nie, weil sie so klein ist.", "Sie kann nicht so weit fliegen wie die Schwalbe."],
  [6, "Das Murmeltier", "Murmeltiere leben hoch oben in den Alpen. Im Sommer fressen sie viel Gras und Kräuter. Sie werden dabei rund und dick. Im Herbst kriechen sie in ihren Bau unter der Erde. Den Eingang verschliessen sie mit Erde und Gras. Dann schlafen sie den ganzen Winter lang und fressen nichts. Im Frühling kommen sie dünn wieder heraus.", "Wozu brauchen die Murmeltiere das Fett, das sie im Sommer anfressen?", "Davon leben sie während des Winterschlafs.", "Damit sie im Sommer schneller rennen können.", "Damit sie im Bau weich liegen."],
  [6, "Der Löwenzahn", "Im Frühling blüht der Löwenzahn auf vielen Wiesen gelb. Nach einigen Tagen wird aus der Blüte eine weisse Kugel: die Pusteblume. Sie besteht aus vielen kleinen Schirmchen. An jedem Schirmchen hängt ein Samen. Schon ein leichter Wind trägt die Schirmchen weit fort. Wo ein Samen landet, kann eine neue Pflanze wachsen.", "Warum wächst Löwenzahn an so vielen Orten?", "Der Wind trägt seine Samen weit herum.", "Die Menschen pflanzen ihn überall an.", "Die Bienen tragen die gelben Blüten fort."],
];
