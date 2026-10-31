// Fakten für den Fledermaus-Forscher (Lehrplan SG NMG.2.3.e Steckbrief eines Säugetiers,
// NMG.2.4.d Merkmale, die das Leben in einem Lebensraum erlauben). Gilt für die Fledermäuse der
// Schweiz. Bewusst ohne genaue Zahlen (Artenzahl, Gewicht), die je nach Quelle abweichen.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).

// Aussagen: [Stufe ab, Aussage, stimmt?, Erklärung]
const FLEDERMAUS_AUSSAGEN = [
  [1, "Fledermäuse schlafen am Tag.", true, "Fledermäuse schlafen am Tag und jagen in der Nacht."],
  [1, "Fledermäuse hängen beim Schlafen kopfüber.", true, "Sie halten sich mit den Krallen der Füsse fest und hängen kopfüber."],
  [1, "Fledermäuse fliegen in der Nacht.", true, "In der Dämmerung und in der Nacht gehen sie auf die Jagd."],
  [1, "Fledermäuse sind Vögel.", false, "Fledermäuse haben keine Federn. Sie sind Säugetiere."],
  [1, "Fledermäuse haben ein Fell.", true, "Ihr Körper ist mit einem weichen Fell bedeckt, wie bei allen Säugetieren."],
  [2, "Fledermaus-Junge trinken Milch bei der Mutter.", true, "Fledermäuse sind Säugetiere: Die Jungen werden geboren und trinken Milch."],
  [2, "Fledermäuse legen Eier.", false, "Fledermäuse bekommen lebende Junge. Eier legen zum Beispiel Vögel."],
  [2, "Fledermäuse sind Mäuse.", false, "Sie heissen nur so. Fledermäuse sind eine eigene Gruppe, die Fledertiere."],
  [2, "Die Flügel der Fledermaus sind aus Haut.", true, "Die Flughaut ist zwischen den langen Fingern, den Armen und den Beinen gespannt."],
  [2, "Fledermäuse sind die einzigen Säugetiere, die richtig fliegen können.", true, "Kein anderes Säugetier kann mit Flügeln fliegen."],
  [3, "Fledermäuse sind blind.", false, "Fledermäuse können sehen. Im Dunkeln finden sie den Weg aber vor allem mit ihren Ohren."],
  [3, "Fledermäuse finden ihre Beute mit dem Echo ihrer Rufe.", true, "Sie rufen sehr hoch, das Echo verrät ihnen, wo eine Mücke fliegt."],
  [3, "Wir Menschen hören die Rufe der Fledermäuse meistens nicht.", true, "Die Rufe sind so hoch (Ultraschall), dass unsere Ohren sie meistens nicht hören."],
  [3, "Die Fledermäuse in der Schweiz fressen Insekten.", true, "Mücken, Nachtfalter und Käfer — alle Fledermäuse der Schweiz fressen Insekten."],
  [3, "Fledermäuse in der Schweiz saugen Blut.", false, "Nein. Nur drei Arten in Amerika trinken Blut. Unsere Fledermäuse fressen Insekten."],
  [3, "Im Winter halten Fledermäuse Winterschlaf.", true, "Im Winter gibt es keine Insekten. Darum schlafen sie in Höhlen, Kellern oder Baumhöhlen."],
  [4, "Im Winterschlaf schlägt das Herz der Fledermaus viel langsamer.", true, "Der Körper wird kühl und das Herz schlägt langsam — so reicht das Fett bis zum Frühling."],
  [4, "Eine Fledermaus-Mutter bekommt meistens ein Junges im Jahr.", true, "Meistens ist es ein einziges Junges im Frühsommer."],
  [4, "Im Sommer leben die Mütter mit ihren Jungen zusammen in einer Wochenstube.", true, "In der Wochenstube ist es warm. Dort ziehen viele Mütter zusammen ihre Jungen auf."],
  [4, "Fledermäuse bauen Nester wie Vögel.", false, "Sie bauen keine Nester. Sie suchen Verstecke: Baumhöhlen, Spalten, Dachböden."],
  [5, "In der Schweiz sind alle Fledermäuse geschützt.", true, "Man darf sie nicht stören, fangen oder ihre Verstecke zerstören."],
  [5, "Auch Delfine finden ihre Beute mit dem Echo.", true, "Delfine orientieren sich im Wasser ebenfalls mit Echo-Lauten."],
  [5, "Eine Fledermaus am Boden nimmt man sofort mit blossen Händen auf.", false, "Nicht mit blossen Händen anfassen! Eine erwachsene Person holen, die beim Fledermausschutz anruft."],
  [5, "Viel helles Licht in der Nacht hilft den Fledermäusen.", false, "Viele Fledermäuse meiden helles Licht. Dunkle Nächte helfen ihnen."],
];

// Fragen mit Auswahl: [Stufe ab, Frage, richtig, falsch, falsch, Erklärung]
const FLEDERMAUS_FRAGEN = [
  [1, "Wann jagt die Fledermaus?", "in der Nacht", "am Mittag", "am Morgen früh", "Fledermäuse jagen in der Dämmerung und in der Nacht."],
  [2, "Woraus sind die Flügel der Fledermaus?", "aus Haut", "aus Federn", "aus Schuppen", "Die Flughaut ist zwischen den Fingern gespannt."],
  [2, "Was trinkt ein Fledermaus-Junges?", "Milch der Mutter", "Nektar", "Wasser aus dem Weiher", "Fledermäuse sind Säugetiere."],
  [2, "Zu welcher Tiergruppe gehört die Fledermaus?", "Säugetiere", "Vögel", "Insekten", "Fell, lebende Junge, Milch: ein Säugetier."],
  [3, "Was frisst eine Fledermaus in der Schweiz?", "Insekten", "Früchte", "Blut", "Mücken, Nachtfalter und Käfer."],
  [3, "Wie findet die Fledermaus im Dunkeln eine Mücke?", "mit dem Echo ihrer Rufe", "mit der Nase", "mit einer Taschenlampe", "Sie ruft und hört, wie das Echo zurückkommt."],
  [3, "Was macht die Fledermaus im Winter?", "Winterschlaf", "Sie fliegt in den Süden.", "Sie jagt im Schnee.", "Im Winter gibt es keine Insekten — sie schläft."],
  [4, "Wo verbringen Fledermäuse den Winter?", "in Höhlen, Kellern oder Baumhöhlen", "in einem Nest im Gras", "im Weiher", "Dort ist es ruhig und frostfrei."],
  [4, "Wie heisst das Sommer-Quartier, in dem die Mütter ihre Jungen aufziehen?", "Wochenstube", "Winterquartier", "Bienenstock", "In der Wochenstube leben viele Mütter mit ihren Jungen."],
  [5, "Was hilft den Fledermäusen im Garten?", "Blumen, die Insekten anlocken", "viel helles Licht in der Nacht", "Gift gegen Insekten", "Wo es Insekten gibt, finden Fledermäuse Futter."],
  [5, "Was hilft einer Fledermaus, die eine Wohnung sucht?", "ein Fledermauskasten", "ein Vogelhäuschen mit Futter", "ein Gartenteich", "Fledermauskästen sind schmale Verstecke mit einem Schlitz unten."],
];

// Das Jahr einer Fledermaus, in Reihenfolge ab dem Winter: [Jahreszeit, was passiert]
const FLEDERMAUS_JAHR = [
  ["❄️ Winter", "Winterschlaf in einer Höhle"],
  ["🌱 Frühling", "Aufwachen und Insekten jagen"],
  ["☀️ Frühsommer", "Ein Junges kommt in der Wochenstube zur Welt"],
  ["☀️ Sommer", "Das Junge lernt fliegen und jagen"],
  ["🍂 Herbst", "Fett anfressen und ein Winterquartier suchen"],
];

// Merkmale und wozu sie dienen (Anpassung an das Leben in der Nacht): [Merkmal, Nutzen]
// Jeder Nutzen passt nur zu einem Merkmal — sonst wäre eine „falsche“ Antwort auch richtig
// (darum nicht „grosse Ohren“ und „hohe Rufe“ zusammen: beide helfen beim Beutefinden).
const FLEDERMAUS_ANPASSUNGEN = [
  ["grosse Ohren", "das Echo der Rufe hören"],
  ["Flughaut zwischen den Fingern", "fliegen"],
  ["Krallen an den Füssen", "kopfüber hängen"],
  ["Winterschlaf", "den Winter ohne Insekten überstehen"],
  ["spitze Zähne", "Käfer mit hartem Panzer knacken"],
  ["Fell", "warm bleiben"],
];
