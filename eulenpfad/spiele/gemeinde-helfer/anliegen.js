/* Anliegen und Einrichtungen für den Gemeinde-Helfer — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG NMG.10.3 (Wortlaut sg.lehrplan.ch, gelesen 2026-11-03):
     c (2. Zyklus) „können öffentliche Institutionen und Einrichtungen in der Gemeinde benennen und deren
       Funktion verstehen (z.B. Spital, Schule, Feuerwehr, Abfallentsorgung, Gericht)“;
     d (2. Zyklus) „können den Unterschied zwischen privater und öffentlicher Sphäre beschreiben“;
     e (GA und OP) „können zuständige Stellen für Fragen und Anliegen identifizieren (z.B. die Lehrperson,
       die Schulleitung, der/die Schulhauswart/-in, die Gemeindebehörde)“.
   Alles selbst geschrieben, Schweizer Schreibweise (ss). Was Einrichtungen tun, ist vereinfacht und kann
   je Gemeinde und Kanton abweichen (Stadtpolizei, private Spitäler, Kehrichtabfuhr durch den Werkhof):
   siehe die Anmerkungen „ZU PRÜFEN“ unten.

   Inhaltsliste (Entscheid L4 a): eine Liste „anliegen“; der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag gemeinde-helfer, Feld listen). Alle Listen dieser Datei gehören
   zu ihr: Einrichtungen, Anliegen, Notrufnummern, zuständige Stellen, Ebenen und Abläufe.

   Schreibweise je Eintrag:
   - Einrichtung: { id, name, bild, tut, oeffentlich, ebene, umschreibung, klar }
       tut: Kurzsatz „Was sie tut“ (ohne Namen anderer Einrichtungen, er dient als Hinweis)
       oeffentlich: true = gehört allen in der Gemeinde, false = gehört einer Person oder Firma
       ebene: „gemeinde“, „kanton“, „bund“ oder null, wenn es je Kanton verschieden ist
       umschreibung: Tipp ohne den Namen („die Leute, die Brände löschen“)
       klar: true = eindeutig genug für Stufe 1 (2. Klasse, Bild-Karten)
   - Anliegen: { satz, kurz, ziel, schwierigkeit, ablenker, hinweis }
       satz: ganzer Satz ab Stufe 2; kurz: Bild-Zeichen und 2–3 Wörter für Stufe 1 (nur bei klaren Zielen)
       schwierigkeit: 1 einfach, 2 mittel, 3 Falle (nächstliegender Ablenker passt fast)
       ablenker: Id der Einrichtung, die am ehesten verwechselt wird; sie kommt als Korb dazu
       hinweis: nur bei Fallen — was den Unterschied ausmacht, ohne den Namen des Ziels
   - Notruf: { nummer, name, bild, situationen }
   - Stelle (Stufe 5, NMG.10.3.e): { id, name, bild, tut, umschreibung } und Anliegen { satz, ziel, ablenker }
   - Ebene (Stufe 5): { name, bild, ebene } — nur eindeutige Fälle
   - Ablauf (Stufe 6): { titel, bild, schritte: [{ text, kurz }] } in der richtigen Reihenfolge */

const GEMEINDE_EINRICHTUNGEN = [
  { id: "feuerwehr", name: "Feuerwehr", bild: "🚒", tut: "löscht Brände, pumpt Wasser aus Kellern und rettet bei Unfällen",
    oeffentlich: true, ebene: "gemeinde", umschreibung: "die Leute, die Brände löschen und Keller auspumpen", klar: true },
  { id: "polizei", name: "Polizei", bild: "👮", tut: "sorgt für Sicherheit, fängt Diebe und nimmt Unfälle auf",
    oeffentlich: true, ebene: null, umschreibung: "die Leute, die für Sicherheit sorgen und Diebe suchen", klar: false },
  { id: "spital", name: "Spital", bild: "🏥", tut: "behandelt Kranke und Verletzte, auch im Notfall",
    oeffentlich: true, ebene: null, umschreibung: "der Ort, wo Ärztinnen und Ärzte Kranke und Verletzte behandeln", klar: true },
  { id: "gemeindehaus", name: "Gemeindehaus", bild: "🏛️", tut: "hier arbeitet die Gemeindeverwaltung: anmelden, Ausweise, Hundemarke",
    oeffentlich: true, ebene: "gemeinde", umschreibung: "das Haus, wo die Verwaltung des Dorfes oder der Stadt arbeitet", klar: false },
  { id: "bibliothek", name: "Bibliothek", bild: "📚", tut: "leiht Bücher, Hörbücher und Spiele aus",
    oeffentlich: true, ebene: "gemeinde", umschreibung: "der Ort, wo man Bücher ausleihen kann", klar: true },
  { id: "werkhof", name: "Werkhof", bild: "🚜", tut: "unterhält die Strassen, räumt Schnee, stellt Strassenschilder auf und leert die öffentlichen Abfalleimer",
    oeffentlich: true, ebene: "gemeinde", umschreibung: "die Leute mit den orangen Fahrzeugen, die Strassen und Plätze in Ordnung halten", klar: false },
  { id: "post", name: "Post", bild: "📮", tut: "befördert Briefe und Päckli und verkauft Briefmarken",
    oeffentlich: true, ebene: "bund", umschreibung: "die Stelle, die Briefe und Päckli befördert", klar: true },
  { id: "schule", name: "Schule", bild: "🏫", tut: "hier lernen Kinder lesen, schreiben und rechnen",
    oeffentlich: true, ebene: "gemeinde", umschreibung: "der Ort, wo Kinder jeden Tag lernen", klar: true },
  { id: "schwimmbad", name: "Schwimmbad", bild: "🏊", tut: "hier kann man baden und schwimmen lernen",
    oeffentlich: true, ebene: "gemeinde", umschreibung: "der Ort mit den grossen Becken voll Wasser", klar: true },
  { id: "entsorgung", name: "Abfallentsorgung", bild: "♻️", tut: "holt den Kehricht ab und nimmt Glas, Papier und Sperrgut an der Sammelstelle an",
    oeffentlich: true, ebene: "gemeinde", umschreibung: "die Stelle, die Abfall abholt und Glas, Papier und alte Geräte annimmt", klar: false },
  { id: "fundbuero", name: "Fundbüro", bild: "🧤", tut: "sammelt verlorene Sachen, bis jemand sie abholt",
    oeffentlich: true, ebene: "gemeinde", umschreibung: "der Ort, wo verlorene Sachen aufbewahrt werden", klar: false },
  { id: "gericht", name: "Gericht", bild: "⚖️", tut: "entscheidet bei Streit, was recht ist, und bestimmt die Strafe, wenn jemand ein Gesetz gebrochen hat",
    oeffentlich: true, ebene: null, umschreibung: "der Ort, wo eine Richterin oder ein Richter entscheidet", klar: false },
  // Private Betriebe — Ablenker ab Stufe 4 (NMG.10.3.d: private und öffentliche Sphäre)
  { id: "baeckerei", name: "Bäckerei", bild: "🥐", tut: "backt und verkauft Brot und Gipfeli",
    oeffentlich: false, ebene: null, umschreibung: "der Laden, wo es Brot gibt", klar: false },
  { id: "coiffeur", name: "Coiffeur", bild: "💇", tut: "schneidet Haare",
    oeffentlich: false, ebene: null, umschreibung: "der Laden, wo man die Haare schneiden lässt", klar: false },
  { id: "velowerkstatt", name: "Velowerkstatt", bild: "🔧", tut: "repariert und verkauft Velos",
    oeffentlich: false, ebene: null, umschreibung: "der Laden, wo Velos repariert werden", klar: false },
  { id: "supermarkt", name: "Supermarkt", bild: "🛒", tut: "verkauft Lebensmittel und Dinge für den Haushalt",
    oeffentlich: false, ebene: null, umschreibung: "der Laden, wo man Lebensmittel einkauft", klar: false },
];

const GEMEINDE_ANLIEGEN = [
  // ---------- Feuerwehr ----------
  { satz: "In der Küche brennt es, und der Rauch wird immer dichter.", kurz: "🔥 Es brennt!", ziel: "feuerwehr", schwierigkeit: 1, ablenker: "polizei" },
  { satz: "Nach dem Gewitter steht der Keller voll Wasser.", kurz: "🌊 Keller voll Wasser", ziel: "feuerwehr", schwierigkeit: 2, ablenker: "werkhof" },
  { satz: "Eine Katze sitzt seit Stunden hoch oben im Baum und traut sich nicht mehr herunter.", kurz: "🐱 Katze im Baum", ziel: "feuerwehr", schwierigkeit: 2, ablenker: "polizei" }, // ZU PRÜFEN: Tierrettung durch die Feuerwehr ist üblich, aber nicht überall
  { satz: "Aus einem Lastwagen läuft Öl auf die Strasse.", ziel: "feuerwehr", schwierigkeit: 3, ablenker: "werkhof",
    hinweis: "Öl auf der Strasse ist gefährlich und muss sofort weg — das ist ein Einsatz, kein Unterhalt." }, // ZU PRÜFEN: Ölwehr gehört zur Feuerwehr
  // ---------- Polizei ----------
  { satz: "Dein Velo wurde vor dem Schulhaus gestohlen.", ziel: "polizei", schwierigkeit: 3, ablenker: "fundbuero",
    hinweis: "Gestohlen heisst: Jemand hat es absichtlich weggenommen. Das ist nicht dasselbe wie verloren." },
  { satz: "Ein Auto rast jeden Tag viel zu schnell durch die Quartierstrasse.", ziel: "polizei", schwierigkeit: 2, ablenker: "werkhof" },
  { satz: "Zwei Autos sind zusammengestossen. Niemand ist verletzt, aber jemand muss den Unfall aufnehmen.", ziel: "polizei", schwierigkeit: 2, ablenker: "spital" },
  { satz: "Jemand ist in der Nacht in ein Haus eingebrochen.", ziel: "polizei", schwierigkeit: 1, ablenker: "feuerwehr" },
  { satz: "Im Einkaufszentrum hat ein kleines Kind seine Eltern verloren und weint.", ziel: "polizei", schwierigkeit: 3, ablenker: "fundbuero",
    hinweis: "Hier ist kein Gegenstand verloren, sondern ein Kind sucht seine Eltern. Wer hilft Menschen in Not?" },
  // ---------- Spital ----------
  { satz: "Du bist vom Velo gestürzt, und dein Arm ist gebrochen.", kurz: "🦴 Arm gebrochen", ziel: "spital", schwierigkeit: 1, ablenker: "feuerwehr" },
  { satz: "Beim Fussball hat sich dein Freund das Bein schwer verletzt.", kurz: "🩹 Bein verletzt", ziel: "spital", schwierigkeit: 1, ablenker: "polizei" },
  { satz: "Deine Tante bekommt ein Baby.", kurz: "👶 Baby kommt", ziel: "spital", schwierigkeit: 1, ablenker: "gemeindehaus" },
  { satz: "Opa muss am Knie operiert werden.", kurz: "🛏️ Operation", ziel: "spital", schwierigkeit: 1, ablenker: "schwimmbad" },
  // ---------- Gemeindehaus ----------
  { satz: "Eure Familie ist neu ins Dorf gezogen und muss sich anmelden.", ziel: "gemeindehaus", schwierigkeit: 2, ablenker: "post" },
  { satz: "Du brauchst eine Identitätskarte für die Ferien im Ausland.", ziel: "gemeindehaus", schwierigkeit: 2, ablenker: "post" }, // ZU PRÜFEN: Antrag für die ID in SG über die Gemeinde, der Pass über das kantonale Passbüro
  { satz: "Ihr habt einen Hund gekauft. Er muss angemeldet werden und braucht eine Marke.", ziel: "gemeindehaus", schwierigkeit: 2, ablenker: "polizei" },
  { satz: "Du möchtest wissen, wann die nächste Gemeindeversammlung ist.", ziel: "gemeindehaus", schwierigkeit: 2, ablenker: "bibliothek" },
  { satz: "Deine Eltern brauchen eine Bestätigung, dass sie in dieser Gemeinde wohnen.", ziel: "gemeindehaus", schwierigkeit: 2, ablenker: "post" },
  // ---------- Bibliothek ----------
  { satz: "Du möchtest ein Buch ausleihen.", kurz: "📖 Buch ausleihen", ziel: "bibliothek", schwierigkeit: 1, ablenker: "schule" },
  { satz: "Du suchst ein Hörbuch für die Ferien.", kurz: "🎧 Hörbuch leihen", ziel: "bibliothek", schwierigkeit: 1, ablenker: "post" },
  { satz: "Für einen Vortrag brauchst du drei Bücher über Dinosaurier.", ziel: "bibliothek", schwierigkeit: 2, ablenker: "schule" },
  // ---------- Werkhof ----------
  { satz: "Es hat die ganze Nacht geschneit. Die Strasse muss geräumt werden.", ziel: "werkhof", schwierigkeit: 1, ablenker: "feuerwehr" },
  { satz: "Ein Strassenschild ist umgefallen und liegt auf dem Trottoir.", ziel: "werkhof", schwierigkeit: 2, ablenker: "polizei" },
  { satz: "Der Abfalleimer beim Spielplatz quillt über.", ziel: "werkhof", schwierigkeit: 3, ablenker: "entsorgung",
    hinweis: "Der Abfalleimer auf dem Spielplatz gehört der Gemeinde wie die Bänke und die Strasse. Wer hält die Plätze in Ordnung?" }, // ZU PRÜFEN: je Gemeinde verschieden
  { satz: "In der Strasse ist ein tiefes Loch, in dem die Velos hängen bleiben.", ziel: "werkhof", schwierigkeit: 2, ablenker: "polizei" },
  { satz: "Das Gras am Strassenrand ist so hoch, dass man die Kreuzung nicht mehr sieht.", ziel: "werkhof", schwierigkeit: 3, ablenker: "polizei",
    hinweis: "Noch ist nichts passiert. Jemand muss das Gras schneiden — wer pflegt die Strassenränder?" },
  // ---------- Post ----------
  { satz: "Du willst deiner Cousine ein Päckli schicken.", kurz: "📦 Päckli schicken", ziel: "post", schwierigkeit: 1, ablenker: "gemeindehaus" },
  { satz: "Du brauchst Briefmarken für die Geburtstagskarten.", kurz: "✉️ Briefmarken kaufen", ziel: "post", schwierigkeit: 1, ablenker: "supermarkt" },
  { satz: "Ein Brief muss bis morgen bei deiner Grossmutter sein.", ziel: "post", schwierigkeit: 2, ablenker: "gemeindehaus" },
  // ---------- Schule ----------
  { satz: "Hier lernst du jeden Morgen lesen, schreiben und rechnen.", kurz: "✏️ Lesen und rechnen lernen", ziel: "schule", schwierigkeit: 1, ablenker: "bibliothek" },
  { satz: "Hier triffst du jeden Tag deine Klasse und deine Lehrerin.", kurz: "👩‍🏫 Klasse und Lehrerin", ziel: "schule", schwierigkeit: 1, ablenker: "bibliothek" },
  { satz: "Du hast dein Mathebuch im Klassenzimmer liegen lassen und holst es.", ziel: "schule", schwierigkeit: 2, ablenker: "fundbuero" },
  // ---------- Schwimmbad ----------
  { satz: "Es ist heiss, und du möchtest baden gehen.", kurz: "☀️ Baden gehen", ziel: "schwimmbad", schwierigkeit: 1, ablenker: "spital" },
  { satz: "Du willst endlich richtig schwimmen lernen.", kurz: "🩱 Schwimmen lernen", ziel: "schwimmbad", schwierigkeit: 1, ablenker: "schule" },
  { satz: "Deine Klasse hat heute Schwimmunterricht.", ziel: "schwimmbad", schwierigkeit: 2, ablenker: "schule" },
  // ---------- Abfallentsorgung ----------
  { satz: "Der alte Kühlschrank muss weg.", ziel: "entsorgung", schwierigkeit: 2, ablenker: "werkhof" },
  { satz: "Ihr habt eine Kiste voll leerer Flaschen und Gläser gesammelt.", ziel: "entsorgung", schwierigkeit: 2, ablenker: "supermarkt" },
  { satz: "Der Kehrichtsack vor dem Haus soll abgeholt werden.", ziel: "entsorgung", schwierigkeit: 2, ablenker: "werkhof" }, // ZU PRÜFEN: in manchen Gemeinden holt der Werkhof den Kehricht
  // ---------- Fundbüro ----------
  { satz: "Dein Velo ist weg, und du weisst nicht mehr, wo du es abgestellt hast.", ziel: "fundbuero", schwierigkeit: 3, ablenker: "polizei",
    hinweis: "Niemand hat es weggenommen — du hast es verloren. Wo landen verlorene Sachen?" },
  { satz: "Du hast deine Mütze auf dem Spielplatz verloren.", ziel: "fundbuero", schwierigkeit: 2, ablenker: "polizei" },
  { satz: "Jemand hat deinen verlorenen Schlüssel abgegeben. Wo holst du ihn ab?", ziel: "fundbuero", schwierigkeit: 2, ablenker: "gemeindehaus" },
  // ---------- Gericht ----------
  { satz: "Zwei Nachbarn streiten seit Monaten um einen Zaun und finden keine Lösung.", ziel: "gericht", schwierigkeit: 3, ablenker: "polizei",
    hinweis: "Hier ist nichts gestohlen und niemand in Gefahr. Jemand muss entscheiden, wer recht hat." },
  { satz: "Ein Dieb wurde gefasst. Wer bestimmt, welche Strafe er bekommt?", ziel: "gericht", schwierigkeit: 3, ablenker: "polizei",
    hinweis: "Fangen ist das eine, die Strafe bestimmen das andere. Wer darf eine Strafe aussprechen?" },
];

/** Notrufnummern der Schweiz — ZU PRÜFEN (Stand 2026: 117, 118, 144; 112 gilt in ganz Europa und auch in der Schweiz). */
const GEMEINDE_NOTRUF = [
  { nummer: "117", name: "Polizei", bild: "👮", situationen: [
    "Du siehst, wie jemand in ein Auto einbricht.",
    "Ein Fremder verfolgt dich auf dem Heimweg.",
    "Auf der Strasse ist ein Unfall passiert, und die Autos blockieren alles. Niemand ist verletzt.",
  ] },
  { nummer: "118", name: "Feuerwehr", bild: "🚒", situationen: [
    "Aus dem Fenster des Nachbarhauses kommt Rauch.",
    "Im Wald neben dem Spielplatz brennt es.",
    "Eine Kerze hat den Vorhang angezündet, und die Flammen werden grösser.",
  ] },
  { nummer: "144", name: "Sanität", bild: "🚑", situationen: [
    "Dein Grossvater fällt um und wacht nicht mehr auf.",
    "Ein Kind ist vom Klettergerüst gefallen und kann nicht mehr aufstehen.",
    "Jemand bekommt kaum noch Luft.",
  ] },
];
/** Der europäische Notruf, der in der Schweiz ebenfalls gilt — als eigene Frage, weil er sonst immer auch richtig wäre. */
const GEMEINDE_NOTRUF_EUROPA = { nummer: "112", frage: "Welche Nummer gilt in ganz Europa — und auch in der Schweiz?" };

/** Zuständige Stellen in Schule und Gemeinde (Stufe 5, NMG.10.3.e). */
const GEMEINDE_STELLEN = [
  { id: "lehrperson", name: "Lehrperson", bild: "👩‍🏫", tut: "unterrichtet die Klasse und hilft bei Aufgaben", umschreibung: "die Person, die dich jeden Tag unterrichtet" },
  { id: "schulleitung", name: "Schulleitung", bild: "🏫", tut: "leitet das ganze Schulhaus und teilt die Klassen ein", umschreibung: "die Person, die für das ganze Schulhaus verantwortlich ist" },
  { id: "hauswart", name: "Hauswart", bild: "🧰", tut: "sorgt dafür, dass im Schulhaus alles funktioniert und sauber ist", umschreibung: "die Person, die im Schulhaus repariert und putzt" },
  { id: "verwaltung", name: "Gemeindeverwaltung", bild: "🏛️", tut: "erledigt Anmeldungen, Ausweise und Gebühren im Gemeindehaus", umschreibung: "die Leute am Schalter im Gemeindehaus" },
  { id: "gemeinderat", name: "Gemeinderat", bild: "🗳️", tut: "entscheidet, was in der Gemeinde gebaut und bezahlt wird", umschreibung: "die gewählten Leute, die über neue Dinge in der Gemeinde entscheiden" },
];
const GEMEINDE_STELLEN_ANLIEGEN = [
  { satz: "Du verstehst die Hausaufgabe nicht.", ziel: "lehrperson", ablenker: "schulleitung" },
  { satz: "Du hast dein Heft verloren und brauchst ein neues.", ziel: "lehrperson", ablenker: "hauswart" },
  { satz: "Ein Kind in deiner Klasse wird immer wieder geärgert.", ziel: "lehrperson", ablenker: "gemeinderat" },
  { satz: "Du wirst am Montag fehlen, weil du zum Zahnarzt musst.", ziel: "lehrperson", ablenker: "schulleitung" },
  { satz: "Die Heizung im Schulzimmer ist seit Tagen kalt.", ziel: "hauswart", ablenker: "lehrperson" },
  { satz: "Im Gang des Schulhauses ist eine Lampe kaputt.", ziel: "hauswart", ablenker: "verwaltung" },
  { satz: "Die Türe zur Turnhalle klemmt.", ziel: "hauswart", ablenker: "schulleitung" },
  { satz: "Im Schulhaus ist ein Fenster zerbrochen.", ziel: "hauswart", ablenker: "gemeinderat" },
  { satz: "Deine Familie zieht um. Du musst in ein anderes Schulhaus wechseln.", ziel: "schulleitung", ablenker: "lehrperson" },
  { satz: "Eure Klasse möchte für das Schulfest die ganze Aula benutzen.", ziel: "schulleitung", ablenker: "hauswart" },
  { satz: "Eine neue Familie ist im Dorf angekommen und muss sich anmelden.", ziel: "verwaltung", ablenker: "gemeinderat" },
  { satz: "Deine Eltern brauchen eine Hundemarke für den neuen Hund.", ziel: "verwaltung", ablenker: "gemeinderat" },
  { satz: "Du brauchst eine Identitätskarte.", ziel: "verwaltung", ablenker: "schulleitung" },
  { satz: "Die Kinder im Quartier wünschen sich einen neuen Spielplatz.", ziel: "gemeinderat", ablenker: "verwaltung" },
  { satz: "Viele Leute wünschen sich eine neue Turnhalle für das Dorf.", ziel: "gemeinderat", ablenker: "schulleitung" },
  { satz: "Der Schulweg braucht einen Fussgängerstreifen. Wer kann das beschliessen?", ziel: "gemeinderat", ablenker: "verwaltung" },
];

/** Gemeinde, Kanton oder Bund — nur eindeutige Fälle (Stufe 5). ZU PRÜFEN: je Kanton verschieden, deshalb mit dem Namen gekennzeichnet. */
const GEMEINDE_EBENEN = [
  { name: "Primarschule", bild: "🏫", ebene: "gemeinde" },
  { name: "Werkhof", bild: "🚜", ebene: "gemeinde" },
  { name: "Gemeindebibliothek", bild: "📚", ebene: "gemeinde" },
  { name: "Kehrichtabfuhr", bild: "🗑️", ebene: "gemeinde" },
  { name: "Spielplatz im Dorf", bild: "🛝", ebene: "gemeinde" },
  { name: "Kantonsspital", bild: "🏥", ebene: "kanton" },
  { name: "Kantonspolizei", bild: "👮", ebene: "kanton" },
  { name: "Kantonsstrasse", bild: "🛣️", ebene: "kanton" },
  { name: "Kantonsschule", bild: "🎓", ebene: "kanton" },
  { name: "Post", bild: "📮", ebene: "bund" },
  { name: "Bahn (SBB)", bild: "🚆", ebene: "bund" },
  { name: "Armee", bild: "🎖️", ebene: "bund" },
  { name: "Autobahn", bild: "🛤️", ebene: "bund" },
  { name: "Zoll an der Grenze", bild: "🛃", ebene: "bund" },
];
const GEMEINDE_EBENE_TEXT = {
  gemeinde: { name: "Gemeinde", bild: "🏘️", erklaerung: "dein Dorf oder deine Stadt" },
  kanton: { name: "Kanton", bild: "🏞️", erklaerung: "ein grösseres Gebiet mit vielen Gemeinden" },
  bund: { name: "Bund", bild: "🇨🇭", erklaerung: "die ganze Schweiz" },
};

/** Der Weg eines Anliegens durch die Gemeinde (Stufe 6, Königsstufe) — vereinfacht, ZU PRÜFEN. */
const GEMEINDE_ABLAEUFE = [
  { titel: "Die Kinder wünschen sich einen neuen Spielplatz.", bild: "🛝", schritte: [
    { text: "Die Kinder schreiben einen Brief mit ihrem Vorschlag an den Gemeinderat.", kurz: "Brief an den Gemeinderat" },
    { text: "Der Gemeinderat prüft den Vorschlag und rechnet aus, was er kostet.", kurz: "Gemeinderat prüft und rechnet" },
    { text: "Die Stimmberechtigten entscheiden an der Gemeindeversammlung.", kurz: "Gemeindeversammlung entscheidet" },
    { text: "Der Werkhof baut den Spielplatz.", kurz: "Werkhof baut" },
    { text: "Die Kinder spielen auf dem neuen Spielplatz.", kurz: "Kinder spielen" },
  ] },
  { titel: "Eine Strassenlampe im Quartier ist kaputt.", bild: "💡", schritte: [
    { text: "Eine Nachbarin meldet die kaputte Lampe der Gemeindeverwaltung.", kurz: "Meldung an die Verwaltung" },
    { text: "Die Verwaltung gibt die Meldung an den Werkhof weiter.", kurz: "Weiter an den Werkhof" },
    { text: "Der Werkhof schaut die Lampe an und bestellt das Ersatzteil.", kurz: "Werkhof bestellt Ersatzteil" },
    { text: "Der Werkhof wechselt die Lampe aus.", kurz: "Lampe ausgewechselt" },
    { text: "Am Abend ist die Strasse wieder hell.", kurz: "Strasse wieder hell" },
  ] },
  { titel: "Der Schulweg braucht einen sicheren Übergang.", bild: "🚸", schritte: [
    { text: "Die Eltern schreiben dem Gemeinderat, dass die Strasse am Schulweg gefährlich ist.", kurz: "Eltern schreiben dem Gemeinderat" },
    { text: "Der Gemeinderat lässt die Stelle von Fachleuten anschauen.", kurz: "Fachleute schauen die Stelle an" },
    { text: "Der Gemeinderat beschliesst einen Fussgängerstreifen mit Insel.", kurz: "Gemeinderat beschliesst" },
    { text: "Der Werkhof malt den Streifen und baut die Insel.", kurz: "Werkhof baut" },
    { text: "Die Kinder überqueren die Strasse sicher.", kurz: "Kinder gehen sicher" },
  ] },
];
