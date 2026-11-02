/* Sätze für die Rede-Zeichen — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG D.4.F.1.d (Grundanspruch 2. Zyklus): Zeichen der direkten Rede mit Schema setzen.
   Selbst geschriebene Sätze; Namen frei erfunden. Schweizer Schreibweise (ss statt ß).

   Schreibweise: Jeder Satz steht so da, wie er richtig geschrieben wird — MIT allen Zeichen. Das Spiel
   nimmt Doppelpunkt, Anführungszeichen, Komma und die Satzzeichen heraus, und das Kind setzt sie wieder.
   Anführungszeichen nach Schweizer Schulschrift: unten „ (wie 99) und oben “ (wie 66) — Annahme, mit dem
   Lehrmittel abzugleichen. In der Rede steht kein Komma (sonst müsste das Kind zwei Regeln zugleich
   anwenden).

   Inhaltslisten (Liste-Id = Schlüssel; Prüfstand im Katalog, Eintrag „rede-zeichen“, Feld listen):
     vorne   Begleitsatz vorne:   Lea sagt: „Ich komme mit.“   (auch mit ? oder ! am Ende der Rede)
     hinten  Begleitsatz hinten:  „Ich komme mit“, sagt Lea.   Kein Punkt am Ende der Rede; ? und !
             bleiben: „Kommst du mit?“, fragt Tim.
             Ein „|“ in der Rede markiert, wo der Begleitsatz in der Königsstufe eingeschoben wird:
             „Morgen | gehen wir baden“, verspricht Papa.  →  „Morgen“, verspricht Papa, „gehen wir baden.“
             Ohne Königsstufe zeigt das Spiel den Satz ohne „|“. */

const REDE_SAETZE = {
  vorne: [
    // Aussagesätze
    "Lea sagt: „Ich komme mit.“",
    "Tim erzählt: „Gestern habe ich einen Fuchs gesehen.“",
    "Die Lehrerin erklärt: „Heute schreiben wir eine Geschichte.“",
    "Mama sagt: „Das Znüni liegt auf dem Tisch.“",
    "Opa erzählt: „Früher gab es hier noch keine Strasse.“",
    "Mia flüstert: „Ich habe ein Geheimnis.“",
    "Der Trainer meint: „Ihr habt heute gut gespielt.“",
    "Papa sagt: „Wir fahren am Samstag in die Berge.“",
    "Noah erklärt: „Mein Velo hat einen Platten.“",
    "Die Verkäuferin sagt: „Das Brot ist noch warm.“",
    "Lina antwortet: „Ich habe meine Hausaufgaben schon gemacht.“",
    "Der Hauswart brummt: „Hier darf man nicht Fussball spielen.“",
    "Grossmutter sagt: „Der Kuchen braucht noch zehn Minuten.“",
    "Jonas meint: „Das Hallenbad ist heute geschlossen.“",
    "Die Ärztin sagt: „Du musst zwei Tage im Bett bleiben.“",
    "Elif erzählt: „Unsere Katze hat drei Junge bekommen.“",
    "Der Lokführer sagt: „Der Zug fährt gleich ab.“",
    "Am Abend sagt Mama: „Jetzt ist Zeit zum Schlafen.“",
    "Leon flüstert: „Der Hund schläft unter dem Tisch.“",
    "Die Lehrerin sagt: „Morgen machen wir einen Ausflug.“",
    "Sara erklärt: „Ich spiele seit zwei Jahren Geige.“",
    "Der Förster erzählt: „Im Wald leben viele Rehe.“",
    "Tante Rosa sagt: „Ich bringe euch Erdbeeren mit.“",
    "Der Busfahrer sagt: „Bitte steigt hinten ein.“",
    "Sara sagt: „Ich freue mich auf die Ferien.“",
    // Fragesätze
    "Tim fragt: „Kommst du mit?“",
    "Die Lehrerin fragt: „Wer hat das Fenster offen gelassen?“",
    "Lea fragt: „Darf ich dein Velo ausleihen?“",
    "Opa fragt: „Wie war es in der Schule?“",
    "Der Kellner fragt: „Was möchtest du trinken?“",
    "Mama fragt: „Hast du deine Jacke dabei?“",
    "Jonas fragt: „Wann beginnt der Film?“",
    // Ausrufesätze
    "Ben ruft: „Ich habe gewonnen!“",
    "Mia ruft: „Pass auf!“",
    "Der Schiedsrichter ruft: „Das war ein Foul!“",
    "Lea jubelt: „Endlich scheint die Sonne!“",
    "Die Kinder rufen: „Es schneit!“",
    "Noah staunt: „So ein grosser Fisch!“",
    "Grossvater schimpft: „Schon wieder liegt Abfall im Garten!“",
    "Elif bittet: „Hilf mir bitte beim Tragen!“",
  ],
  hinten: [
    // Aussagesätze
    "„Ich komme | gleich mit“, sagt Lea.",
    "„Morgen | gehen wir baden“, verspricht Papa.",
    "„Heute Abend | gibt es Pizza“, sagt Mama.",
    "„Das Wasser ist kalt“, ruft Tim.",
    "„Im Sommer | fahren wir ans Meer“, erzählt Mia.",
    "„Mein Bruder | hat heute Geburtstag“, erzählt Noah.",
    "„Der Bus kommt zu spät“, meint Lina.",
    "„Nach der Pause | rechnen wir weiter“, erklärt die Lehrerin.",
    "„Ich habe den Schlüssel vergessen“, seufzt Jonas.",
    "„Am Wochenende | besuchen wir Grossmutter“, sagt Sara.",
    "„Die Erdbeeren sind reif“, ruft Opa.",
    "„Leider | ist das Hallenbad geschlossen“, sagt der Bademeister.",
    "„Mein Hamster heisst Krümel“, erklärt Leon.",
    "„Ohne Helm | darfst du nicht Velo fahren“, sagt Mama.",
    "„Wir haben das Spiel knapp verloren“, erzählt der Trainer.",
    "„Zum Znüni | gibt es heute Äpfel“, sagt die Lehrerin.",
    "„Ich lese gerade ein spannendes Buch“, erzählt Elif.",
    "„Der Schnee | bleibt bis morgen liegen“, meint Papa.",
    "„Ich kann schon rückwärts schwimmen“, sagt Ben.",
    "„In zehn Minuten | fährt der letzte Zug“, sagt der Kondukteur.",
    "„Unser Garten ist voller Schnecken“, klagt Grossvater.",
    "„Für den Ausflug | brauchst du gute Schuhe“, erklärt der Lehrer.",
    "„Das Bild hast du schön gemalt“, lobt Tante Rosa.",
    "„Nach dem Essen | spielen wir ein Spiel“, meint Lina.",
    "„Ich habe Hunger“, sagt Noah.",
    "„Die Katze | sitzt schon wieder auf dem Dach“, lacht Mia.",
    "„Der Film beginnt um acht Uhr“, sagt Jonas.",
    // Fragesätze
    "„Kommst du | morgen mit ins Hallenbad?“, fragt Tim.",
    "„Hast du | meine Mütze gesehen?“, fragt Lea.",
    "„Wo ist mein Turnsack?“, fragt Ben.",
    "„Darf ich | heute länger aufbleiben?“, fragt Sara.",
    "„Wann | fahren wir endlich los?“, fragt Noah.",
    "„Wer hat den Kuchen gegessen?“, fragt Mama.",
    // Ausrufesätze
    "„Pass auf!“, ruft Mia.",
    "„Endlich | sind Ferien!“, jubelt Elif.",
    "„Ich habe gewonnen!“, ruft Leon.",
    "„Hör sofort | mit dem Lärm auf!“, schimpft der Nachbar.",
    "„Schau mal | da oben!“, ruft Lina.",
    "„So ein Glück!“, ruft Jonas.",
    "„Bleib bitte stehen!“, ruft der Polizist.",
  ],
};
