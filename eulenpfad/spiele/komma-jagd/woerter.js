/* Sätze für die Komma-Jagd — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG D.5.E.1.d (Grundanspruch): Komma bei Aufzählungen und zwischen übersichtlichen
   Verbgruppen; D.4.F.1.d: eigene Texte mit dem Komma überarbeiten. Selbst geschriebene Sätze.

   Schreibweise: Jeder Satz steht so da, wie er richtig geschrieben wird — MIT seinen Kommas. Das Spiel
   entfernt die Kommas und lässt das Kind sie zwischen die Wörter tippen. Jedes Komma im Satz ist also
   eine Stelle, an die ein Komma gehört; andere Stellen bekommen keines. Nur Kommas, die sicher stehen
   müssen: keine Kommas, die man setzen darf, aber nicht muss (etwa vor „und“ zwischen zwei Hauptsätzen
   oder bei Infinitivgruppen mit „um zu“). Schweizer Schreibweise (ss statt ß).

   Inhaltslisten (Liste-Id = Schlüssel; Prüfstand im Katalog, Eintrag „komma-jagd“, Feld listen):
     aufzaehlung  Aufzählungen; vor „und“ und „oder“ kein Komma
     verbgruppen  zwei (oder mehr) Verbgruppen mit je eigenem Verb: Nebensatz mit weil, wenn, dass,
                  als, ob, bis, während, nachdem, sobald, wie, wo, wer, den … oder Hauptsätze ohne „und“;
                  die letzten Sätze enthalten dazu eine Aufzählung (Königsstufe)
     ohne         Zusatzliste: Sätze OHNE Komma, etwa „und“ oder „oder“ zwischen zwei Teilen. Sie kommen
                  nur zu den anderen dazu, damit das Kind nicht überall Kommas setzt. */

const KOMMA_SAETZE = {
  aufzaehlung: [
    // ein Komma (drei Teile)
    "Im Znüni-Säckli habe ich einen Apfel, ein Brot und ein Rüebli.",
    "Lea spielt Gitarre, Klavier und Flöte.",
    "Wir brauchen Mehl, Zucker und Eier für den Kuchen.",
    "Im Wald sehen wir Rehe, Füchse und einen Specht.",
    "Am Morgen putze ich die Zähne, wasche das Gesicht und ziehe mich an.",
    "Mein Bruder mag Fussball, Unihockey und Schwimmen.",
    "Auf dem Pausenplatz rennen, hüpfen und lachen die Kinder.",
    "Für das Lager packe ich den Schlafsack, die Taschenlampe und warme Socken ein.",
    "Die Ampel zeigt Rot, Gelb oder Grün.",
    "Willst du Tee, Sirup oder Wasser trinken?",
    "Im Herbst werden die Blätter gelb, rot und braun.",
    "Nina, Jonas und Mia gehen zusammen ins Hallenbad.",
    "Im Zoo füttern wir die Ziegen, die Schafe und die Esel.",
    "Am Wochenende wandern, grillieren und baden wir am See.",
    "Der Hund bellt, springt und wedelt mit dem Schwanz.",
    "Zum Zmittag gibt es Reis, Gemüse und Fisch.",
    // zwei und mehr Kommas
    "Im Etui sind ein Bleistift, ein Gummi, ein Spitzer und ein Lineal.",
    "Wir kaufen Brot, Käse, Tomaten, Gurken und Joghurt.",
    "Die Wochentage heissen Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag und Sonntag.",
    "Im Garten wachsen Rüebli, Salat, Bohnen und Kartoffeln.",
    "Tim, Lara, Ben und Sofia spielen Verstecken.",
    "Mein Velo hat zwei Räder, eine Klingel, ein Licht und einen Gepäckträger.",
    "In der Turnhalle stehen Bänke, Matten, Kästen und Reckstangen.",
    "Im Winter fahren wir Ski, bauen einen Schneemann, trinken Tee und spielen Karten.",
    "Die Katze schleicht, duckt sich, springt und fängt den Ball.",
    "Im Schulzimmer hängen eine Wandtafel, eine Uhr, eine Karte und viele Zeichnungen.",
    "Auf dem Markt gibt es Äpfel, Birnen, Trauben, Kürbisse und Blumen.",
    "Für die Pizza brauchen wir Teig, Tomatensauce, Käse, Schinken und Oliven.",
    "Am Bach finden wir Steine, Schnecken, Muscheln und einen alten Schuh.",
    "Im Regenbogen sieht man Rot, Orange, Gelb, Grün, Blau und Violett.",
    "Nach der Schule mache ich die Aufgaben, esse ein Zvieri, spiele draussen und lese ein Buch.",
    "Ich habe einen Bruder, zwei Schwestern, eine Katze und einen Hasen.",
    "Im Lager wandern wir, singen am Feuer, schlafen im Zelt und kochen selber.",
    "Die Klasse sammelt Papier, Karton, Glas und Aluminium.",
    "Im Kühlschrank stehen Milch, Butter, Konfitüre, Senf und Eier.",
    "Paul zeichnet ein Haus, einen Baum, eine Sonne und drei Vögel.",
  ],
  verbgruppen: [
    // zwei Verbgruppen, ein Komma
    "Ich bleibe zu Hause, weil ich erkältet bin.",
    "Wenn es regnet, spielen wir drinnen.",
    "Mama sagt, dass das Essen bereit ist.",
    "Als wir ankamen, war das Spiel schon vorbei.",
    "Der Hund bellt, die Katze faucht.",
    "Ich weiss nicht, ob Lukas heute kommt.",
    "Wir gehen baden, wenn die Sonne scheint.",
    "Weil der Bus Verspätung hatte, kam ich zu spät.",
    "Ich hoffe, dass morgen schönes Wetter ist.",
    "Lena liest ein Buch, ihr Bruder hört Musik.",
    "Als das Telefon klingelte, sass ich in der Badewanne.",
    "Der Lehrer erklärt, wie man einen Brief schreibt.",
    "Wenn du willst, kannst du mitkommen.",
    "Das ist der Ball, den ich zum Geburtstag bekommen habe.",
    "Wir warten, bis der Regen aufhört.",
    "Nachdem wir gegessen hatten, gingen wir spazieren.",
    "Es schneit, die Strassen sind weiss.",
    "Ich freue mich, dass du da bist.",
    "Mein Freund wohnt in Bern, ich wohne in Zürich.",
    "Während ich koche, deckt Sara den Tisch.",
    "Die Sonne ging unter, es wurde kühl.",
    "Kannst du mir sagen, wo der Bahnhof ist?",
    "Weil es so heiss war, assen wir ein Glace.",
    "Ich ziehe die Jacke an, weil es draussen kalt ist.",
    "Der Zug fährt ab, sobald alle eingestiegen sind.",
    "Weisst du, wer meinen Bleistift genommen hat?",
    // Verbgruppen und Aufzählung (mehrere Kommas)
    "Wenn wir in die Ferien fahren, packen wir Kleider, Bücher und Spiele ein.",
    "Ich kaufe Brot, Milch und Käse, weil der Kühlschrank leer ist.",
    "Als wir im Zoo waren, sahen wir Löwen, Giraffen und Pinguine.",
    "Mia sagt, dass sie Hunde, Katzen und Pferde mag.",
    "Weil es geregnet hat, sind die Wiese, der Weg und unsere Schuhe nass.",
    "Der Wind heult, die Fenster klappern, der Hund versteckt sich unter dem Tisch.",
    "Ich glaube, dass Tim, Lara und Noah schon auf dem Pausenplatz sind.",
    "Nachdem wir den Tisch gedeckt hatten, kamen die Grossmutter, der Grossvater und meine Tante.",
    "Wenn die Glocke läutet, packen wir die Hefte, die Bücher und das Etui weg.",
    "Wir spielen Fussball, Ben steht im Tor, Sara schiesst den Penalty.",
    "Weil ich Hunger hatte, ass ich einen Apfel, eine Banane und ein Brot.",
    "Die Lehrerin fragt, wer Bleistifte, Scheren oder Leim braucht.",
  ],
  ohne: [
    "Wir essen Brot und Käse.",
    "Willst du Tee oder Sirup?",
    "Lena und Ben spielen Fussball.",
    "Ich nehme den roten oder den blauen Stift.",
    "Am Morgen trinke ich Milch und esse ein Brot.",
    "Der Hund springt über den Bach und rennt in den Wald.",
    "Im Garten blühen Rosen und Tulpen.",
    "Heute gehen wir ins Kino oder ins Museum.",
    "Mein Bruder und meine Schwester sind älter als ich.",
    "Nach der Schule spiele ich mit meinen Freunden auf dem Pausenplatz.",
    "Die Kinder singen und tanzen im Schulzimmer.",
    "Ich mag Erdbeeren und Himbeeren am liebsten.",
    "Am Samstag fahren wir mit dem Zug nach Luzern.",
    "Möchtest du Pommes oder Kartoffelstock?",
    "Der Bär schläft den ganzen Winter in seiner Höhle.",
    "Tim liest ein Buch über Dinosaurier.",
    "Die Katze und der Hund schlafen auf dem Sofa.",
    "Im Herbst sammeln wir Kastanien und Nüsse.",
    "Wir können zu Fuss gehen oder mit dem Velo fahren.",
    "Meine Grossmutter backt jeden Sonntag einen Zopf.",
    "Am Abend lese ich noch ein Kapitel und gehe dann ins Bett.",
    "Sara und ihre Freundin bauen eine Hütte im Wald.",
    "Im Sommer baden wir im See oder im Fluss.",
    "Der Lehrer verteilt die Hefte und die Bücher.",
  ],
};
