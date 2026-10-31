/* Sätze für die Satz-Reparatur — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG D.4.F.1: a Eigennamen und konkrete Nomen gross, Satzanfang gross, Punkt am Satzende;
   b gebräuchliche abstrakte Nomen gross, Satzschlusszeichen.
   Die Sätze stehen hier RICHTIG geschrieben. Das Spiel zeigt sie klein und ohne Schlusszeichen,
   das Kind stellt die Grossschreibung und das Satzzeichen wieder her.
   Keine Kommas und keine Abkürzungen mit Punkt (z. B. „St.“), Schweizer Schreibweise (ss).

   Inhaltslisten (Entscheid L4 a): Jede Gruppe in SAETZE ist eine Liste, die die Aufsicht einzeln
   freigibt (Zuordnung in SAETZE_LISTEN unten). Der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag satz-reparatur, Feld listen). Die Königsstufe nimmt ein
   Satzpaar und einen Satz aus nomen-abstrakt oder lange-saetze. AUCH_PUNKT gehört zu den Sätzen,
   die es nennt. Auch der Wörter-Trenner liest diese Datei; er kennt die Listen (noch) nicht. */

const SAETZE_LISTEN = { s1: "satzanfang", s2: "nomen-konkret", s3: "nomen-abstrakt", s4: "lange-saetze", s5: "satzpaare" };

const SAETZE = {
  // Stufe 1: nur Satzanfang und Punkt — Sätze ohne Nomen
  s1: [
    "Ich bin heute müde.",
    "Wir spielen draussen.",
    "Er lacht laut.",
    "Sie rennt schnell.",
    "Du malst schön.",
    "Wir singen zusammen.",
    "Es regnet stark.",
    "Ich lese gern.",
    "Heute ist es warm.",
    "Morgen gehen wir weg.",
    "Er springt hoch.",
    "Wir lachen viel.",
  ],
  // Stufe 2: dazu Eigennamen und konkrete Nomen
  s2: [
    "Der Hund bellt laut.",
    "Lina malt ein Haus.",
    "Die Katze schläft auf dem Sofa.",
    "Tim isst einen Apfel.",
    "Mein Bruder spielt Fussball.",
    "Die Sonne scheint hell.",
    "Im Garten wächst eine Blume.",
    "Mia fährt mit dem Velo zur Schule.",
    "Der Vogel sitzt auf dem Baum.",
    "Papa kocht heute Spaghetti.",
    "Wir wohnen in Wil.",
    "Oma backt einen Kuchen.",
  ],
  // Stufe 3: dazu abstrakte Nomen und Fragezeichen oder Ausrufezeichen
  s3: [
    "Hast du Angst vor Hunden?",
    "Was für eine Freude!",
    "Kommst du morgen zu meinem Fest?",
    "Die Kinder haben viel Mut.",
    "Wie heisst dein Lehrer?",
    "Wir haben grossen Hunger!",
    "Lisa hat Glück gehabt.",
    "Warum lachst du so?",
    "Das macht mir grossen Spass!",
    "Hast du heute Zeit?",
    "Die Freundschaft ist wichtig.",
    "Der Ärger ist schnell vorbei.",
  ],
  // Stufe 4: längere Sätze mit mehreren Nomen und allen Schlusszeichen
  s4: [
    "Am Montag gehen wir mit der Klasse in den Wald.",
    "Hat der Hund von Oma einen Namen?",
    "Im Sommer baden die Kinder im See.",
    "Mein Freund Luca wohnt neben der Schule.",
    "Wann beginnt die Pause am Nachmittag?",
    "Endlich ist der Winter da!",
    "Die Lehrerin erzählt eine spannende Geschichte.",
    "Im Herbst fallen die Blätter von den Bäumen.",
    "Wer hat meine Jacke gesehen?",
    "Der Zug fährt um acht Uhr nach Zürich.",
  ],
  // Stufe 5: zwei Sätze hintereinander — zwei Satzanfänge, zwei Schlusszeichen
  s5: [
    "Heute regnet es. Wir bleiben im Haus.",
    "Wo ist mein Buch? Ich finde es nicht.",
    "Wir haben Ferien! Alle Kinder jubeln.",
    "Der Bus kommt. Steig schnell ein!",
    "Kennst du Anna? Sie wohnt in Bern.",
    "Das Essen ist fertig. Kommt ihr?",
    "Im Zoo gibt es Elefanten. Hast du schon einen gesehen?",
    "Lukas hat Geburtstag. Er wird neun Jahre alt.",
    "Pass auf! Die Strasse ist nass.",
    "Die Angst war gross. Doch dann kam die Freude.",
  ],
};

// Aussagen mit Nachdruck: Hier ist neben dem Ausrufezeichen auch ein Punkt richtig. Aufforderungen
// („Pass auf!“) und Ausrufe wie „Was für eine Freude!“ verlangen das Ausrufezeichen.
const AUCH_PUNKT = [
  "Wir haben grossen Hunger!",
  "Das macht mir grossen Spass!",
  "Endlich ist der Winter da!",
  "Wir haben Ferien!",
];
