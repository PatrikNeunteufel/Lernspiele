/* Teile des Auges, Aussagen und Fragen für den Auge-Entdecker — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG NMG.4.3 (Sehen und Licht), Wortlaut von sg.lehrplan.ch (gelesen 2026-11-03):
     c (2. Zyklus): „können die äusseren Merkmale des Auges benennen und die jeweiligen Vorgänge und
        Funktionen beschreiben. Auge: Augenbraue, Augenlid mit Wimpern, Tränenflüssigkeit, Hornhaut, Bindehaut“
     e (2. Zyklus): „können den prinzipiellen Aufbau des Auges beschreiben und ein einfaches Augenmodell herstellen“
   Iris und Pupille stehen nicht im Wortlaut von c, sind aber sichtbare äussere Merkmale und gehören zur
   Beobachtung „Pupille bei hell und dunkel“ (Spielidee); deshalb ab Stufe 2 dabei.

   Inhaltsliste (Entscheid L4 a): eine Liste, Id „teile“ (Katalog, Eintrag „auge-entdecker“, Feld listen).
   Dazu gehören alle Sammlungen in dieser Datei: AUGE_TEILE, AUGE_PUPILLE, AUGE_AUGEN, AUGE_AUSSAGEN,
   AUGE_WARUM, AUGE_LICHTWEG. Schweizer Schreibweise (ss statt ß), Sätze für die 3. Klasse.

   Schreibweise AUGE_TEILE (je Teil ein Objekt):
     id        Schlüssel, auch im Bild (data-teil)
     name      Name, wie er auf Knöpfen steht; artikel der/die/das; mz: true bei Mehrzahl (Wimpern)
     zusatz    zweiter Name, klein auf dem Knopf (Iris → Regenbogenhaut, das Weisse → Lederhaut)
     gruppe    aussen (NMG.4.3.c) oder innen (NMG.4.3.e); weg: nur auf dem Weg des Lichts (Gehirn)
     bild      in welchen Bildern das Teil vorkommt: auge (von vorn), schnitt (von der Seite)
     ziel      welche Fläche im Bild beim Antippen zählt, wenn nicht die eigene: Die Bindehaut liegt
               über dem Weissen, beide tippt man auf derselben Fläche an. Darum wird die Bindehaut nie
               „markiert und benannt“ (benennbar: false), sondern nur gesucht, zugeordnet und erklärt.
     lage      wo es im Bild ist — ohne seinen Namen (Tipp 1, Hinweis)
     aufgaben  was es tut, als Satz ohne Subjekt in der 3. Person („fängt … ab“); der erste Satz ist der
               Hauptsatz (Lob, Tipp 2), alle Sätze sind Aufgaben in Stufe 4 — ohne den eigenen Namen,
               und so, dass kein Satz auf ein anderes Teil passt (Körbe!)
     aussehen  wie es aussieht — ohne seinen Namen (Tipp 3)

   ZU PRÜFEN (fachlich vorsichtig formuliert, aber nicht aus einem Lehrmittel abgeschrieben):
   - Bindehaut: „schützt das Auge vor Keimen“ (dünne Schleimhaut über Lederhaut und Lidinnenseite,
     Schutz vor Krankheitserregern). Die Formulierung „hält das Auge feucht“ steht bei der Tränenflüssigkeit,
     damit die Körbe eindeutig bleiben.
   - Augenbraue: „leitet Regen und Schweiss am Auge vorbei“ — übliche Schulbuch-Erklärung.
   - Wimpern: „lassen uns sofort blinzeln, wenn etwas sie berührt“ (Lidschlussreflex).
   - Linse: „kann sich dicker und dünner machen“ (Nah- und Fernsehen) — vereinfacht.
   - Aussage „Beim langen Schauen auf einen Bildschirm blinzeln wir weniger, und die Augen werden trocken“:
     verbreitete Angabe, kein Schaden behauptet.
   - „Zu viel Sonnenlicht vom Schnee schadet den Augen“ (Schneeblindheit): nur „schadet“, keine Einzelheiten. */

const AUGE_TEILE = [
  // ---------- aussen (NMG.4.3.c) ----------
  { id: "braue", name: "Augenbraue", artikel: "die", gruppe: "aussen", bild: ["auge"],
    lage: "Es ist ganz oben, über dem Auge.",
    aufgaben: ["fängt Schweiss von der Stirn ab, damit er nicht ins Auge läuft", "leitet Regentropfen von der Stirn am Auge vorbei"],
    aussehen: "ein Bogen aus kurzen Härchen" },
  { id: "lid", name: "Augenlid", artikel: "das", gruppe: "aussen", bild: ["auge"],
    lage: "Es liegt oben und unten als Rand um das Auge und kann sich schliessen.",
    aufgaben: ["schliesst sich beim Schlafen und schützt das Auge", "wischt beim Blinzeln wie ein Scheibenwischer über das Auge"],
    aussehen: "zwei Hautfalten, die sich wie ein Vorhang schliessen" },
  { id: "wimpern", name: "Wimpern", artikel: "die", mz: true, gruppe: "aussen", bild: ["auge"],
    lage: "Sie sitzen am Rand des Lids und zeigen nach aussen.",
    aufgaben: ["fangen Staub und kleine Dinge ab, bevor sie ins Auge kommen", "lassen uns sofort blinzeln, wenn etwas sie berührt"],
    aussehen: "viele feine Härchen in einer Reihe" },
  { id: "weiss", name: "Weisse", artikel: "das", zusatz: "Lederhaut", gruppe: "aussen", bild: ["auge"],
    lage: "Es ist die grosse weisse Fläche rund um den farbigen Ring.",
    aufgaben: ["ist die feste, weisse Hülle, die das Auge aussen schützt", "gibt dem Auge seine runde Form"],
    aussehen: "weiss und fest" },
  { id: "iris", name: "Iris", artikel: "die", zusatz: "Regenbogenhaut", gruppe: "aussen", bild: ["auge"],
    lage: "Es ist der farbige Ring in der Mitte des Auges.",
    aufgaben: ["gibt dem Auge seine Farbe: braun, blau oder grün", "macht mit kleinen Muskeln das Loch in der Mitte enger oder weiter"],
    aussehen: "braun, blau oder grün — bei jedem Menschen anders" },
  { id: "pupille", name: "Pupille", artikel: "die", gruppe: "aussen", bild: ["auge"],
    lage: "Es ist ganz in der Mitte, im farbigen Ring.",
    aufgaben: ["ist das Loch, durch das das Licht ins Auge kommt", "wird im Dunkeln gross und im Hellen klein"],
    aussehen: "ein dunkles, rundes Loch, das gross und klein werden kann" },
  { id: "traene", name: "Tränenflüssigkeit", artikel: "die", gruppe: "aussen", bild: ["auge"],
    lage: "Es ist ganz innen im Augenwinkel, bei der Nase.",
    aufgaben: ["spült Staub und Schmutz aus dem Auge", "hält das Auge immer feucht"],
    aussehen: "ein kleiner Tropfen" },
  { id: "hornhaut", name: "Hornhaut", artikel: "die", gruppe: "aussen", bild: ["auge", "schnitt"],
    lage: "Es liegt ganz vorn, als Glanz über dem farbigen Ring und dem dunklen Loch.",
    aufgaben: ["ist die durchsichtige Scheibe ganz vorn, durch die das Licht hineinkommt", "schützt den farbigen Ring und das Loch in der Mitte wie ein Uhrglas"],
    aussehen: "durchsichtig wie ein Uhrglas, man sieht nur einen Glanz" },
  { id: "bindehaut", name: "Bindehaut", artikel: "die", gruppe: "aussen", bild: ["auge"], ziel: "weiss", benennbar: false,
    lage: "Es liegt als dünne Haut über dem Weissen und innen am Lid.",
    aufgaben: ["ist die dünne, glatte Haut über dem Weissen und innen am Lid", "schützt das Auge vor Keimen, die krank machen"],
    aussehen: "so dünn, dass man sie fast nicht sieht" },
  // ---------- innen (NMG.4.3.e) ----------
  { id: "linse", name: "Linse", artikel: "die", gruppe: "innen", bild: ["schnitt"],
    lage: "Sie liegt gleich hinter dem Loch, durch das das Licht kommt.",
    aufgaben: ["bündelt das Licht, damit hinten im Auge ein scharfes Bild entsteht", "kann sich dicker und dünner machen, um nah und fern scharf zu sehen"],
    aussehen: "durchsichtig und geformt wie eine Lupe: in der Mitte dicker als am Rand" },
  { id: "glaskoerper", name: "Glaskörper", artikel: "der", gruppe: "innen", bild: ["schnitt"],
    lage: "Es füllt den grossen Raum im Inneren des Auges aus.",
    aufgaben: ["füllt das Innere des Auges wie durchsichtiges Gelee", "hält das Auge von innen in Form"],
    aussehen: "durchsichtig wie Gelee" },
  { id: "netzhaut", name: "Netzhaut", artikel: "die", gruppe: "innen", bild: ["schnitt"],
    lage: "Sie liegt ganz hinten im Auge, innen an der Wand.",
    aufgaben: ["nimmt hinten im Auge das Licht auf", "verwandelt das Licht in Signale für das Gehirn"],
    aussehen: "eine dünne Schicht, die wie eine Leinwand das Bild auffängt" },
  { id: "sehnerv", name: "Sehnerv", artikel: "der", gruppe: "innen", bild: ["schnitt"],
    lage: "Er führt hinten aus dem Auge heraus in den Kopf.",
    aufgaben: ["leitet die Signale von der Netzhaut ans Gehirn", "ist das Kabel vom Auge zum Gehirn"],
    aussehen: "wie ein dickes Kabel" },
  // ---------- nur auf dem Weg des Lichts ----------
  { id: "gehirn", name: "Gehirn", artikel: "das", gruppe: "weg", bild: [],
    lage: "Es ist im Kopf, am Ende des Kabels.",
    aufgaben: ["macht aus den Signalen des Auges ein Bild"],
    aussehen: "der Teil im Kopf, der aus Signalen ein Bild macht" },
];

// Stufe 3, Pupille: [Satz mit „…“ am Ende, richtig: gross oder klein] — Antwort „grösser“ oder „kleiner“.
const AUGE_PUPILLE = [
  ["Im Hellen wird die Pupille …", "klein"],
  ["Im Dunkeln wird die Pupille …", "gross"],
  ["Du gehst aus dem Haus in die Sonne. Die Pupille wird …", "klein"],
  ["Du gehst in einen dunklen Keller. Die Pupille wird …", "gross"],
  ["Jemand leuchtet mit einer Taschenlampe in dein Auge. Die Pupille wird …", "klein"],
  ["Im Kino geht das Licht aus. Die Pupille wird …", "gross"],
  ["Am Morgen ziehst du den Vorhang auf. Die Pupille wird …", "klein"],
  ["In der Nacht löschst du das Licht. Die Pupille wird …", "gross"],
];

// Stufe 3, zwei Augen nebeneinander: [Frage, gesuchte Pupille: gross oder klein]
const AUGE_AUGEN = [
  ["Welches Auge ist im Dunkeln?", "gross"],
  ["Welches Auge ist im Hellen?", "klein"],
  ["Welches Auge schaut in eine helle Lampe?", "klein"],
  ["Welches Auge ist im dunklen Keller?", "gross"],
];

// Stufe 5, Aussagen: [Satz, stimmt (true) oder stimmt nicht (false), Tipp ohne die Antwort]
const AUGE_AUSSAGEN = [
  ["Mit einer Sonnenbrille kannst du gefahrlos direkt in die Sonne schauen.", false, "Auch durch eine Sonnenbrille kommt noch sehr viel Licht ins Auge."],
  ["Die Hornhaut ist durchsichtig.", true, "Das Licht muss ganz vorn ins Auge hineinkommen."],
  ["Die Linse bündelt das Licht.", true, "Denk an eine Lupe."],
  ["Die Netzhaut nimmt hinten im Auge das Licht auf.", true, "Wo entsteht das Bild — vorn oder hinten?"],
  ["Der Sehnerv leitet die Signale ans Gehirn.", true, "Irgendwie muss die Nachricht vom Auge in den Kopf kommen."],
  ["Im Dunkeln wird die Pupille klein.", false, "Wie viel Licht braucht das Auge im Dunkeln — mehr oder weniger?"],
  ["Das Bild entsteht vorn auf der Hornhaut.", false, "Die Hornhaut ist durchsichtig. Kann darauf ein Bild entstehen?"],
  ["Beim Blinzeln verteilt das Lid die Tränenflüssigkeit über das Auge.", true, "Wozu ist das Lid wie ein Scheibenwischer?"],
  ["Der Glaskörper füllt das Innere des Auges aus.", true, "Was ist im Auge zwischen Linse und Netzhaut?"],
  ["Ein Laserpointer ins Auge ist harmlos.", false, "Ein Laser bündelt sehr viel Licht auf einen einzigen Punkt."],
  ["Beim Werken mit Hammer und Holz schützt eine Schutzbrille vor Splittern.", true, "Was passiert, wenn ein Splitter ins Auge fliegt?"],
  ["Die Augen mit schmutzigen Händen zu reiben ist in Ordnung.", false, "Was bringen schmutzige Hände mit ans Auge?"],
  ["Die Pupille ist ein Loch in der Iris.", true, "Ist das Dunkle in der Mitte etwas Festes?"],
  ["Die Linse liegt hinter der Pupille.", true, "Wohin geht das Licht, nachdem es durch das Loch gekommen ist?"],
  ["Die Netzhaut liegt ganz vorn am Auge.", false, "Wo fängt das Auge das Bild auf — vorn oder hinten?"],
  ["Der Sehnerv ist das Kabel vom Auge zum Gehirn.", true, "Wie kommt die Nachricht vom Auge in den Kopf?"],
  ["Beim langen Schauen auf einen Bildschirm blinzeln wir weniger, und die Augen werden trocken.", true, "Was macht das Lid beim Blinzeln mit der Tränenflüssigkeit?"],
  ["Die Iris gibt dem Auge seine Farbe.", true, "Was ist bei braunen und blauen Augen verschieden?"],
  ["Im Hellen wird die Pupille gross.", false, "Soll im Hellen viel oder wenig Licht ins Auge?"],
  ["Ein Sandkorn im Auge spült man mit sauberem Wasser heraus, statt zu reiben.", true, "Was macht ein Sandkorn beim Reiben auf dem Auge?"],
  ["Die Wimpern lassen das Licht ins Auge.", false, "Wozu sind die Härchen am Lidrand da?"],
  ["Die Augenbraue bündelt das Licht.", false, "Was macht die Augenbraue mit dem Schweiss von der Stirn?"],
  ["Der Glaskörper gibt dem Auge seine Farbe.", false, "Welcher Teil ist braun, blau oder grün?"],
  ["Die Linse sitzt ganz hinten im Auge an der Wand.", false, "Wo liegt die Lupe des Auges — vorn beim Loch oder hinten?"],
  ["Die Tränenflüssigkeit spült Staub aus dem Auge.", true, "Was passiert, wenn dir etwas ins Auge fliegt?"],
  ["Zu viel Sonnenlicht, das vom Schnee gespiegelt wird, schadet den Augen.", true, "Warum tragen viele Leute beim Skifahren eine Sonnenbrille?"],
  ["Ohne Licht kann die Netzhaut nichts aufnehmen.", true, "Was siehst du in einem ganz dunklen Raum?"],
  ["Die Hornhaut liegt hinter der Netzhaut.", false, "Was ist ganz vorn am Auge, was ganz hinten?"],
];

// Stufe 6, Warum-Fragen: [Frage, richtige Antwort, falsche Antwort, falsche Antwort, Tipp ohne die Antwort]
const AUGE_WARUM = [
  ["Warum werden die Pupillen im Dunkeln gross?", "Damit mehr Licht ins Auge kommt.", "Damit das Auge wärmer wird.", "Damit wir besser hören.",
    "Im Dunkeln gibt es wenig Licht. Was braucht das Auge dann?"],
  ["Warum werden die Pupillen im Hellen klein?", "Damit nicht zu viel Licht ins Auge kommt.", "Damit das Auge nicht austrocknet.", "Damit wir Farben sehen.",
    "Im Hellen gibt es sehr viel Licht. Was wäre zu viel?"],
  ["Warum blinzeln wir?", "Damit das Lid die Tränenflüssigkeit über das Auge verteilt und es feucht bleibt.", "Damit die Iris ihre Farbe behält.", "Damit die Linse scharf wird.",
    "Denk an einen Scheibenwischer."],
  ["Warum haben wir Augenbrauen?", "Damit Schweiss von der Stirn nicht ins Auge läuft.", "Damit mehr Licht ins Auge kommt.", "Damit die Pupille rund bleibt.",
    "Was läuft beim Rennen von der Stirn herunter?"],
  ["Warum haben wir Wimpern?", "Sie fangen Staub und kleine Dinge ab, bevor sie ins Auge kommen.", "Sie helfen beim Scharfsehen.", "Sie halten das Auge warm.",
    "Wo sitzen die Wimpern, und was fliegt dort vorbei?"],
  ["Warum ist die Hornhaut durchsichtig?", "Damit das Licht ins Auge hineinkommen kann.", "Damit man die Netzhaut von aussen sieht.", "Damit das Auge leichter ist.",
    "Was muss ganz vorn ins Auge hinein, damit wir sehen?"],
  ["Warum braucht das Auge den Sehnerv?", "Er leitet die Signale von der Netzhaut ans Gehirn.", "Er macht die Pupille gross und klein.", "Er hält das Auge feucht.",
    "Das Auge fängt das Bild auf. Wo muss es dann hin?"],
  ["Was macht das Gehirn beim Sehen?", "Es setzt die Signale aus dem Auge zu einem Bild zusammen.", "Es bündelt das Licht.", "Es gibt der Iris ihre Farbe.",
    "Die Netzhaut schickt nur Signale. Wer macht daraus ein Bild?"],
  ["Warum schauen wir nie direkt in die Sonne?", "Das starke Licht kann die Netzhaut verletzen.", "Die Iris wird sonst blass.", "Die Wimpern fallen sonst aus.",
    "Welches Teil nimmt das Licht auf, und was macht zu viel Licht damit?"],
  ["Warum tränen die Augen, wenn Staub hineinkommt?", "Die Tränen spülen den Staub wieder heraus.", "Das Auge will die Pupille schliessen.", "Der Sehnerv wird nass.",
    "Was macht Wasser mit Staub?"],
  ["Warum sehen wir mit der Linse scharf?", "Sie bündelt das Licht so, dass auf der Netzhaut ein scharfes Bild entsteht.", "Sie macht das Licht heller.", "Sie färbt das Bild bunt.",
    "Denk an eine Lupe: Was macht sie mit den Lichtstrahlen?"],
  ["Warum hilft eine Brille manchen Kindern?", "Sie lenkt das Licht so, dass das Bild auf der Netzhaut scharf wird.", "Sie macht die Pupille grösser.", "Sie färbt die Iris.",
    "Wenn das Bild hinten im Auge unscharf ist — was muss sich ändern?"],
  ["Warum siehst du in einem ganz dunklen Raum nichts?", "Ohne Licht kommt nichts ins Auge, das die Netzhaut aufnehmen könnte.", "Die Pupille ist dann zu.", "Der Sehnerv schläft.",
    "Was braucht das Auge zum Sehen, und was fehlt im Dunkeln?"],
  ["Warum tragen viele Leute beim Werken eine Schutzbrille?", "Splitter und Staub dürfen nicht ins Auge fliegen.", "Damit sie besser hören.", "Damit die Pupille klein bleibt.",
    "Was fliegt beim Sägen und Hämmern durch die Luft?"],
];

// Stufe 6, Weg des Lichts (Ids aus AUGE_TEILE, von vorn nach hinten).
const AUGE_LICHTWEG = ["hornhaut", "pupille", "linse", "glaskoerper", "netzhaut", "sehnerv", "gehirn"];
