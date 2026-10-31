// Inhalte für „Echt oder erfunden?“ (Lehrplan SG NMG.9.4). Alle Sätze und Texte sind selbst
// geschrieben; Sagen und Märchen sind nachgemacht, nicht überliefert.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a), einzeln freizugeben. Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Spiel „echt-oder-erfunden“, Feld listen).
//   aussagen     AUSSAGEN                      kurze Sätze mit Bild: kann es geben oder erfunden
//   geschichten  GESCHICHTEN und MERKMALE      drei Sätze; erfundene haben genau einen erfundenen Satz
//   staunen      STAUNEN                       erstaunlich, aber wahr — oder erfunden? (Tiere, Natur)
//   textsorten   TEXTSORTEN und TEXTSORTEN_TEXTE   Märchen, Sage, Fabel, Sachtext
const ECHT_LISTEN = ["aussagen", "geschichten", "staunen", "textsorten"];

// [Bild, Satz, kann es geben?, Stufe 1 (ganz eindeutig)?] — Liste aussagen.
// Bild und Thema kommen je einmal echt und einmal erfunden vor, damit das Bild nichts verrät.
const AUSSAGEN = [
  ["🐶", "Der Hund bellt laut.", true, true],
  ["🐶", "Der Hund liest die Zeitung vor.", false, true],
  ["🐱", "Die Katze schläft auf dem Sofa.", true, true],
  ["🐱", "Die Katze backt einen Kuchen.", false, true],
  ["🐄", "Die Kuh frisst Gras auf der Weide.", true, true],
  ["🐄", "Die Kuh fliegt über das Dach.", false, true],
  ["🐟", "Der Fisch schwimmt im Teich.", true, true],
  ["🐟", "Der Fisch singt ein Lied.", false, true],
  ["🍎", "Der Apfel fällt vom Baum.", true, true],
  ["🍎", "Der Apfel erzählt der Birne einen Witz.", false, true],
  ["🚌", "Der Bus hält an der Haltestelle.", true, true],
  ["🚌", "Der Bus fliegt zum Mond.", false, true],
  ["🌳", "Im Herbst fallen die Blätter vom Baum.", true, false],
  ["🌳", "Der Baum geht im Wald spazieren.", false, true],
  ["⛄", "Die Kinder bauen einen Schneemann.", true, true],
  ["⛄", "Der Schneemann geht im Sommer baden.", false, false],
  ["🐸", "Der Frosch springt ins Wasser.", true, true],
  ["🐸", "Der Frosch trägt eine Krone und spricht.", false, false],
  ["🚲", "Lena fährt mit dem Velo zur Schule.", true, true],
  ["🚲", "Das Velo fährt ganz allein zum Bäcker.", false, false],
  ["🐦", "Der Vogel baut ein Nest.", true, true],
  ["🐦", "Der Vogel strickt sich eine Mütze.", false, false],
  ["🐌", "Die Schnecke kriecht langsam über den Weg.", true, false],
  ["🐌", "Die Schnecke rennt schneller als ein Auto.", false, false],
  ["🐝", "Die Biene fliegt von Blüte zu Blüte.", true, false],
  ["🐝", "Die Biene fährt mit dem Zug in die Ferien.", false, false],
  ["🌧️", "Es regnet, und die Strasse wird nass.", true, false],
  ["🌧️", "Es regnet Bonbons vom Himmel.", false, false],
  ["🐘", "Der Elefant trinkt mit dem Rüssel.", true, false],
  ["🐘", "Der Elefant passt in eine Zündholzschachtel.", false, false],
  ["🦉", "Die Eule ist in der Nacht wach.", true, false],
  ["🦉", "Die Eule erklärt den Kindern das Einmaleins.", false, false],
  ["🐴", "Ein Pferd frisst Heu im Stall.", true, false],
  ["🦄", "Ein Einhorn grast auf der Wiese.", false, false],
];

// Woran man eine erfundene Geschichte erkennt — Liste geschichten. Die Merkmale schliessen sich aus;
// jede erfundene Geschichte hat genau eines.
const MERKMALE = {
  tier: "Ein Tier spricht wie ein Mensch.",
  ding: "Ein Ding bewegt sich oder spricht von selbst.",
  wesen: "Ein Fabelwesen kommt vor (Drache, Riese, Fee).",
  zauber: "Jemand zaubert.",
  mensch: "Ein Mensch kann etwas, das kein Mensch kann.",
};

// [Sätze, Nummer des erfundenen Satzes (0, 1, 2; -1 = alles kann wirklich passieren), Merkmal] — Liste geschichten
const GESCHICHTEN = [
  [["Mia geht mit ihrem Grossvater in den Wald.", "Sie sammeln Tannzapfen und Moos.", "Zu Hause basteln sie daraus einen Igel."], -1, ""],
  [["Luca hat Geburtstag.", "Seine Freunde kommen zum Spielen.", "Am Abend ist er müde und schläft schnell ein."], -1, ""],
  [["Es schneit die ganze Nacht.", "Am Morgen ist der Garten weiss.", "Nora zieht ihre Stiefel an und geht hinaus."], -1, ""],
  [["Ben verliert einen Zahn.", "Er legt ihn in eine kleine Dose.", "Seine Mutter sagt: «Bald wächst ein neuer.»"], -1, ""],
  [["Die Klasse besucht einen Bauernhof.", "Die Kinder dürfen die Kälber streicheln.", "Zum Zvieri gibt es Brot und Käse."], -1, ""],
  [["Im Herbst ernten Aylin und ihr Vater Äpfel.", "Sie füllen zwei Körbe.", "Daraus kocht die Familie Apfelmus."], -1, ""],
  [["Tim sucht seine Katze.", "Er ruft und ruft.", "Endlich findet er sie schlafend im Wäschekorb."], -1, ""],
  [["Es ist heiss.", "Lea und Jonas gehen in die Badi.", "Danach kaufen sie sich ein Glace."], -1, ""],
  [["Elif übt Velofahren ohne Stützräder.", "Zuerst fällt sie zweimal um.", "Dann klappt es, und sie fährt eine ganze Runde."], -1, ""],
  [["Der Bus hat Verspätung.", "Die Kinder warten an der Haltestelle.", "Nach fünf Minuten kommt er endlich."], -1, ""],
  [["Noah pflanzt eine Sonnenblume.", "Er giesst sie jeden Tag.", "Im Sommer ist sie grösser als er."], -1, ""],
  [["Am Abend zieht ein Gewitter auf.", "Es blitzt und donnert.", "Die Familie bleibt im Haus, bis es vorbei ist."], -1, ""],
  [["Mia geht mit ihrem Grossvater in den Wald.", "Ein Fuchs sagt zu ihnen: «Guten Tag, ihr zwei!»", "Dann sammeln sie Tannzapfen."], 1, "tier"],
  [["Luca hat Geburtstag.", "Er bläst die Kerzen auf dem Kuchen aus.", "Da schwebt er plötzlich wie ein Ballon bis zur Zimmerdecke."], 2, "mensch"],
  [["Es schneit die ganze Nacht.", "Am Morgen winkt der Schneemann im Garten den Kindern zu.", "Nora zieht ihre Stiefel an."], 1, "ding"],
  [["Ben verliert einen Zahn.", "Er legt ihn unter das Kopfkissen.", "In der Nacht kommt eine winzige Fee mit Flügeln und holt ihn ab."], 2, "wesen"],
  [["Die Klasse besucht einen Bauernhof.", "Eine Kuh erklärt den Kindern, wie man Käse macht.", "Zum Zvieri gibt es Brot und Käse."], 1, "tier"],
  [["Aylin pflückt Äpfel.", "Ein Mann schwingt einen Zauberstab, und alle Äpfel werden zu Gold.", "Aylin staunt."], 1, "zauber"],
  [["Tim sucht seine Katze.", "Er findet sie im Garten.", "Die Katze sagt: «Ich habe nur eine Maus gesucht.»"], 2, "tier"],
  [["Lea und Jonas gehen in die Badi.", "Im Becken schwimmt ein grüner Drache mit drei Köpfen.", "Danach kaufen sie sich ein Glace."], 1, "wesen"],
  [["Elif übt Velofahren.", "Ihr Velo sagt: «Halt dich gut fest!»", "Bald fährt sie eine ganze Runde."], 1, "ding"],
  [["Der Bus hat Verspätung.", "Als er kommt, ruft er: «Entschuldigung, ich habe verschlafen!»", "Die Kinder steigen ein."], 1, "ding"],
  [["Noah klettert auf einen Baum.", "Oben breitet er die Arme aus und fliegt wie ein Vogel davon.", "Am Abend ist er wieder zu Hause."], 1, "mensch"],
  [["Am Abend zieht ein Gewitter auf.", "Ein Riese, so gross wie ein Berg, schaut zum Fenster herein.", "Die Familie bleibt im Haus."], 1, "wesen"],
  [["Mila soll ihr Zimmer aufräumen.", "Sie zaubert mit ihrem Zauberstab, und schon ist alles ordentlich.", "Dann darf sie spielen."], 1, "zauber"],
  [["Jan geht mit seinem Hund spazieren.", "Plötzlich wird Jan unsichtbar.", "Der Hund bellt ganz aufgeregt."], 1, "mensch"],
  [["Sara kocht Tee.", "Die Teekanne hüpft vom Tisch und tanzt durch die Küche.", "Dann trinkt Sara ihren Tee."], 1, "ding"],
];

// [Satz, stimmt es?] — Liste staunen. Die wahren Sätze klingen erstaunlich, die erfundenen glaubhaft.
const STAUNEN = [
  ["Ein Krake hat drei Herzen.", true],
  ["Pinguine sind Vögel, aber sie können nicht fliegen.", true],
  ["Ein Wal ist kein Fisch, sondern ein Säugetier.", true],
  ["Fledermäuse hängen beim Schlafen mit dem Kopf nach unten.", true],
  ["Bienen zeigen anderen Bienen mit einem Tanz, wo es Blüten hat.", true],
  ["Unter dem weissen Fell hat der Eisbär eine schwarze Haut.", true],
  ["Eine Giraffe hat im langen Hals gleich viele Halswirbel wie ein Mensch.", true],
  ["Ein Chamäleon kann seine Farbe ändern.", true],
  ["Es gibt Fische, die selbst leuchten.", true],
  ["Der Mond leuchtet nicht selbst. Die Sonne beleuchtet ihn.", true],
  ["Ein Einsiedlerkrebs zieht in ein grösseres Schneckenhaus um, wenn er wächst.", true],
  ["Ein Specht klopft mit dem Schnabel Löcher in Baumstämme.", true],
  ["Der Magen einer Kuh hat vier Teile.", true],
  ["Ein Krake hat zwanzig Arme.", false],
  ["Pinguine fliegen im Winter in den Süden.", false],
  ["Ein Wal atmet unter Wasser mit Kiemen.", false],
  ["Fledermäuse legen Eier.", false],
  ["Bienen machen Honig aus Sand.", false],
  ["Ein Igel kann seine Stacheln wie Pfeile abschiessen.", false],
  ["Spinnen haben sechs Beine.", false],
  ["Der Mond ist eine grosse Lampe, die am Abend eingeschaltet wird.", false],
  ["Eine Schnecke kann aus ihrem Haus ausziehen und sich ein neues suchen.", false],
  ["Ein Chamäleon kann sich ganz unsichtbar machen.", false],
  ["Ein Specht baut sein Nest aus Steinen.", false],
  ["Fische müssen nicht atmen.", false],
];

// Textsorten mit ihrem Merkmal — Liste textsorten
const TEXTSORTEN = {
  maerchen: { name: "Märchen", merkmal: "Es beginnt mit «Es war einmal», und es gibt Zauber oder Fabelwesen." },
  sage: { name: "Sage", merkmal: "Sie spielt an einem Ort, den es wirklich gibt, und erzählt etwas Seltsames." },
  fabel: { name: "Fabel", merkmal: "Tiere sprechen wie Menschen, und am Schluss steht eine Lehre." },
  sachtext: { name: "Sachtext", merkmal: "Er erklärt, wie etwas wirklich ist." },
};

// [Textsorte, Text] — Liste textsorten. Die Sagen erfinden Geschichten zu echten Orten der Ostschweiz.
const TEXTSORTEN_TEXTE = [
  ["maerchen", "Es war einmal ein armer Müllerssohn. Eines Tages schenkte ihm eine alte Frau einen Zauberstein. Wer den Stein drehte, dem wurden drei Wünsche erfüllt."],
  ["maerchen", "Es war einmal eine Königstochter, die konnte nicht lachen. Da kam ein junger Schneider mit einer Gans, die goldene Eier legte. Als die Gans zu tanzen begann, musste die Königstochter laut lachen."],
  ["maerchen", "Es war einmal ein Schäfer, der fand im Wald einen goldenen Schlüssel. Damit öffnete er eine Tür im Felsen. Dahinter sassen sieben Zwerge und schliefen."],
  ["maerchen", "Es war einmal eine Prinzessin, die ein böser Zauberer in eine Eule verwandelt hatte. Nur ein mutiger Hirte konnte den Zauber lösen."],
  ["sage", "Am Säntis erzählen die Leute von einem Senn, der vor langer Zeit ganz allein auf der Alp lebte. In stürmischen Nächten soll man noch heute seinen Jodel über die Felsen hören."],
  ["sage", "Am Ufer des Bodensees, so erzählt man, lag einst ein Dorf. Weil die Leute dort geizig waren, versank es in einer Nacht im See. Bei ruhigem Wasser soll man manchmal Glocken läuten hören."],
  ["sage", "Im Toggenburg liegt ein grosser Felsblock mitten in einer Wiese. Die Alten sagen, ein Riese habe ihn vor vielen hundert Jahren dorthin geworfen."],
  ["sage", "Auf einer Burg über dem Rheintal soll ein Ritter einen Schatz versteckt haben. Wer ihn in der Neujahrsnacht sucht, hört nur den Wind in den Mauern."],
  ["fabel", "Eine Maus und ein Elefant wollten über einen Bach. Der Elefant lachte: «Du bist viel zu klein!» Doch im Schlamm blieb er stecken, und die Maus holte Hilfe. Lehre: Auch die Kleinen können den Grossen helfen."],
  ["fabel", "Ein Spatz prahlte: «Ich bin der schnellste Vogel im Wald!» Er flog so wild, dass er gegen einen Ast prallte. Die Eule sagte ruhig: «Wer prahlt, schaut nicht, wohin er fliegt.»"],
  ["fabel", "Zwei Ziegen trafen sich auf einem schmalen Steg. «Geh zurück!», rief die eine. «Nein, du!», rief die andere. Sie stiessen mit den Hörnern, bis beide ins Wasser fielen. Lehre: Wer nachgibt, kommt weiter."],
  ["fabel", "Ein Eichhörnchen versteckte alle Nüsse nur für sich. Im Winter fand es die Verstecke nicht mehr. Da teilten die anderen Eichhörnchen ihre Nüsse mit ihm. Lehre: Teilen macht alle satt."],
  ["sachtext", "Der Igel ist ein Säugetier. Er frisst Käfer, Würmer und Schnecken. Im Winter hält er Winterschlaf in einem Nest aus Laub."],
  ["sachtext", "Die Biene sammelt Nektar aus Blüten. Im Bienenstock wird daraus Honig. Ein Bienenvolk hat eine Königin, die Eier legt."],
  ["sachtext", "Der Säntis ist ein Berg in der Ostschweiz. Er ist 2502 Meter hoch. Auf dem Gipfel steht eine Wetterstation."],
  ["sachtext", "Ein Apfelbaum blüht im Frühling. Bienen tragen den Blütenstaub von Blüte zu Blüte. Im Herbst wachsen dort, wo Blüten waren, Äpfel."],
];
