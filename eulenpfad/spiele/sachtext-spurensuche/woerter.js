/* Sachtexte für die Sachtext-Spurensuche — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan 21 D.2.B.1 (wichtige Informationen aus Sachtexten entnehmen):
     e (Orientierungspunkt Ende 4. Klasse) übersichtliche Sachtexte überblicken, Wesentliches finden
     f (Grundanspruch Ende 6. Klasse) Struktur eines Textes erkennen, explizite Informationen
       entnehmen, einen kürzeren Text als Ganzes verstehen, naheliegende implizite Informationen
       erschliessen, Abbildungen und Text zueinander in Bezug setzen
     g/h (3. Zyklus) Informationen aus übersichtlichen Tabellen entnehmen, Text und Tabelle verbinden

   Selbst geschriebene Texte, keine Zitate. Sachangaben nur, wenn gesichert; erfundene Daten
   (Umfragen, Messungen einer Klasse) sind im Text als solche erkennbar. Personennamen erfunden.
   Schweizer Schreibweise (ss statt ß). Eine Liste: „texte“ (Katalog, Eintrag sachtext-spurensuche).

   Aufbau eines Texts:
     stufe      Spielstufe 1–6 (Länge: 1 etwa 4 Sätze · 2 fünf bis sechs · 3 zwei Abschnitte ·
                4 zwei Abschnitte, oft mit Tabelle · 5 und 6 zwei längere Abschnitte mit Tabelle)
     titel      Titel des Texts (wird gezeigt, ausser bei der Frage nach dem Titel)
     text       Stufe 1–2: der Text als ein Abschnitt (Zeichenkette)
     abschnitte ab Stufe 3: [[Titel des Abschnitts, Text], …] — die Abschnitts-Titel sieht das Kind
                nicht; das Spiel fragt danach („Welcher Titel passt zu Abschnitt 2?“)
     ablenker   ab Stufe 3: ein Titel, der zu keinem Abschnitt passt
     tabelle    optional { titel, kopf: [Spalten], zeilen: [[…], …], nach: Abschnitt-Nummer }
     fragen     Liste, je Frage eine Zeile:
       ["angabe", Frage, richtig, falsch, falsch]   Angabe steht ausdrücklich im Text
       ["tabelle", Frage, richtig, falsch, falsch]  Angabe aus der Tabelle (ab Stufe 4)
       ["folgern", Frage, richtig, falsch, falsch]  naheliegende Schlussfolgerung (ab Stufe 4)
       ["stimmt", Aussage, "ja" | "nein" | "fehlt"] stimmt / stimmt nicht / steht nicht im Text
                                                    („fehlt“ ab Stufe 2)
       ["titel", richtig, falsch, falsch]           Titel für den ganzen Text (Stufe 1–2)
   Bei „fehlt“ steht im Text nichts dazu, auch nicht versteckt — die Aussage darf in Wirklichkeit
   stimmen: Genau das übt die Frage (Weltwissen ist nicht dasselbe wie „steht im Text“). */

const SPUREN_TEXTE = [
  // ---------- Stufe 1: etwa vier Sätze ----------
  { stufe: 1, titel: "Der Luchs",
    text: "Der Luchs ist eine grosse Wildkatze. An den Spitzen seiner Ohren hat er lange Haarbüschel, die Pinsel. Er jagt vor allem Rehe und Gämsen. Meistens lebt ein Luchs allein.",
    fragen: [
      ["angabe", "Was hat der Luchs an den Spitzen seiner Ohren?", "lange Haarbüschel", "kleine Hörner", "weisse Punkte"],
      ["angabe", "Was jagt der Luchs vor allem?", "Rehe und Gämsen", "Fische und Frösche", "Beeren und Nüsse"],
      ["stimmt", "Der Luchs ist eine Wildkatze.", "ja"],
      ["stimmt", "Luchse leben meistens in grossen Gruppen.", "nein"],
      ["titel", "Die Wildkatze mit den Pinselohren", "Ein Hund im Wald", "Wie Rehe leben"],
    ] },
  { stufe: 1, titel: "Der Regenbogen",
    text: "Einen Regenbogen sieht man, wenn die Sonne scheint und es gleichzeitig regnet. Dabei hat man die Sonne im Rücken. In den Regentropfen wird das Sonnenlicht in seine Farben zerlegt. Ganz aussen im Regenbogen ist Rot, ganz innen Violett.",
    fragen: [
      ["angabe", "Wo ist die Sonne, wenn man einen Regenbogen sieht?", "im Rücken", "direkt vor einem", "hinter einer Wolke"],
      ["angabe", "Welche Farbe ist ganz aussen im Regenbogen?", "Rot", "Violett", "Grün"],
      ["stimmt", "Für einen Regenbogen braucht es Sonne und Regen.", "ja"],
      ["stimmt", "Ganz innen im Regenbogen ist Rot.", "nein"],
      ["titel", "Wie ein Regenbogen entsteht", "Warum es regnet", "Farben im Malkasten"],
    ] },
  { stufe: 1, titel: "Der Kompost",
    text: "Auf den Kompost kommen Rüstabfälle wie Kartoffelschalen und Apfelreste, dazu welke Blätter. Dort leben viele kleine Tiere, zum Beispiel Regenwürmer. Sie fressen die Abfälle und zerkleinern sie. Nach einigen Monaten ist daraus dunkle, gute Erde geworden.",
    fragen: [
      ["angabe", "Welche Tiere nennt der Text?", "Regenwürmer", "Ameisen", "Schnecken"],
      ["angabe", "Was wird aus den Abfällen?", "dunkle, gute Erde", "feiner Sand", "frisches Wasser"],
      ["stimmt", "Auf den Kompost kommen Kartoffelschalen.", "ja"],
      ["stimmt", "Schon nach einem Tag ist aus den Abfällen Erde geworden.", "nein"],
      ["titel", "Aus Abfall wird Erde", "Regenwürmer im Regen", "Kartoffeln kochen"],
    ] },
  { stufe: 1, titel: "Der Specht",
    text: "Der Specht klopft mit seinem harten Schnabel an Baumstämme. So findet er Käfer und Larven unter der Rinde. Mit seiner langen Zunge holt er sie heraus. In einen Baumstamm hackt er eine Höhle für sein Nest.",
    fragen: [
      ["angabe", "Womit holt der Specht die Käfer heraus?", "mit seiner langen Zunge", "mit seinen Krallen", "mit seinen Flügeln"],
      ["angabe", "Wo findet der Specht Käfer und Larven?", "unter der Rinde", "im Wasser", "in der Wiese"],
      ["stimmt", "Der Specht baut sein Nest in eine Baumhöhle.", "ja"],
      ["stimmt", "Der Specht hat einen weichen Schnabel.", "nein"],
      ["titel", "Der Klopfer im Wald", "Ein Vogel am See", "Wie Bäume wachsen"],
    ] },
  { stufe: 1, titel: "Die Schweizer Fahne",
    text: "Die Schweizer Fahne ist rot und hat in der Mitte ein weisses Kreuz. Sie ist quadratisch, also gleich hoch wie breit. Nur noch ein anderes Land hat eine quadratische Fahne: der Vatikan. Am 1. August, dem Nationalfeiertag, sieht man die Fahne besonders oft.",
    fragen: [
      ["angabe", "Welche Form hat die Schweizer Fahne?", "quadratisch", "rund", "dreieckig"],
      ["angabe", "Welches andere Land hat auch eine quadratische Fahne?", "der Vatikan", "Italien", "Österreich"],
      ["stimmt", "Das Kreuz auf der Schweizer Fahne ist weiss.", "ja"],
      ["stimmt", "Der Nationalfeiertag der Schweiz ist am 1. Mai.", "nein"],
      ["titel", "Eine besondere Fahne", "Ein Fest im Mai", "Farben mischen"],
    ] },

  // ---------- Stufe 2: fünf bis sechs Sätze, dazu „steht nicht im Text“ ----------
  { stufe: 2, titel: "Die Fledermaus",
    text: "Fledermäuse sind die einzigen Säugetiere, die richtig fliegen können. Sie sind vor allem in der Nacht unterwegs. Beim Fliegen stossen sie sehr hohe Rufe aus. Das Echo verrät ihnen, wo ein Hindernis oder ein Insekt ist. Die Fledermäuse in der Schweiz fressen Insekten, zum Beispiel Mücken und Nachtfalter. Den Tag verschlafen sie kopfüber hängend.",
    fragen: [
      ["angabe", "Was verrät den Fledermäusen, wo ein Insekt ist?", "das Echo ihrer Rufe", "ihre guten Augen", "der Geruch"],
      ["angabe", "Wie verschlafen Fledermäuse den Tag?", "kopfüber hängend", "im Wasser liegend", "auf einem Bein stehend"],
      ["stimmt", "Fledermäuse sind vor allem in der Nacht unterwegs.", "ja"],
      ["stimmt", "Die Fledermäuse in der Schweiz fressen Früchte.", "nein"],
      ["stimmt", "Fledermäuse halten im Winter einen Winterschlaf.", "fehlt"],
      ["titel", "Jäger der Nacht", "Vögel am Morgen", "Mäuse im Keller"],
    ] },
  { stufe: 2, titel: "Der Gotthard-Basistunnel",
    text: "Der Gotthard-Basistunnel ist ein Eisenbahntunnel tief unter den Alpen. Er ist 57 Kilometer lang. Damit ist er der längste Eisenbahntunnel der Welt. Eröffnet wurde er im Jahr 2016. Er verbindet Erstfeld im Kanton Uri mit Bodio im Kanton Tessin. Durch den Tunnel fahren Personenzüge und Güterzüge.",
    fragen: [
      ["angabe", "Wie lang ist der Tunnel?", "57 Kilometer", "17 Kilometer", "75 Kilometer"],
      ["angabe", "In welchem Jahr wurde der Tunnel eröffnet?", "2016", "2006", "1916"],
      ["stimmt", "Der Tunnel führt unter den Alpen hindurch.", "ja"],
      ["stimmt", "Durch den Tunnel fahren nur Güterzüge.", "nein"],
      ["stimmt", "Der Bau des Tunnels dauerte viele Jahre.", "fehlt"],
      ["titel", "Der längste Eisenbahntunnel der Welt", "Eine Wanderung über den Pass", "Mit dem Tram durch die Stadt"],
    ] },
  { stufe: 2, titel: "Der Ameisenstaat",
    text: "Ameisen leben in grossen Gruppen zusammen, in einem Ameisenstaat. Im Staat gibt es eine oder mehrere Königinnen. Sie legen die Eier. Die Arbeiterinnen bauen das Nest, holen Futter und pflegen die Jungen. Eine Ameise kann ein Vielfaches ihres eigenen Gewichts tragen.",
    fragen: [
      ["angabe", "Wer legt die Eier?", "die Königinnen", "die Arbeiterinnen", "die Jungen"],
      ["angabe", "Was machen die Arbeiterinnen?", "Sie holen Futter.", "Sie legen Eier.", "Sie bauen Strassen aus Steinen."],
      ["stimmt", "In einem Ameisenstaat kann es mehr als eine Königin geben.", "ja"],
      ["stimmt", "Ameisen leben allein.", "nein"],
      ["stimmt", "Waldameisen bauen grosse Hügel aus Nadeln.", "fehlt"],
      ["titel", "Zusammen stark: der Ameisenstaat", "Eine Königin im Schloss", "Insekten im Winter"],
    ] },
  { stufe: 2, titel: "Wasser kocht und gefriert",
    text: "Wasser kann fest, flüssig oder gasförmig sein. Bei 0 Grad Celsius gefriert es zu Eis. Erhitzt man Wasser, beginnt es irgendwann zu kochen. Am Meer kocht Wasser bei 100 Grad. Hoch in den Bergen kocht es schon bei einer tieferen Temperatur. Beim Kochen wird aus dem Wasser Wasserdampf.",
    fragen: [
      ["angabe", "Bei welcher Temperatur gefriert Wasser?", "bei 0 Grad", "bei 100 Grad", "bei 10 Grad"],
      ["angabe", "Wo kocht Wasser schon bei einer tieferen Temperatur?", "hoch in den Bergen", "am Meer", "im Kühlschrank"],
      ["stimmt", "Am Meer kocht Wasser bei 100 Grad.", "ja"],
      ["stimmt", "In den Bergen kocht Wasser erst bei einer höheren Temperatur.", "nein"],
      ["stimmt", "Eis schwimmt auf dem Wasser.", "fehlt"],
      ["titel", "Wasser verändert sich", "Ein Tag am Meer", "Wie man Tee macht"],
    ] },
  { stufe: 2, titel: "Der Velohelm",
    text: "Ein Velohelm schützt den Kopf bei einem Sturz. Er hilft aber nur, wenn er richtig sitzt. Der Helm soll waagrecht auf dem Kopf sitzen und die Stirn bedecken. Den Riemen unter dem Kinn stellt man so ein, dass der Helm nicht wackelt. Nach einem schweren Sturz braucht man einen neuen Helm, auch wenn man keinen Schaden sieht.",
    fragen: [
      ["angabe", "Was soll der Helm bedecken?", "die Stirn", "die Ohren", "den Nacken"],
      ["angabe", "Was braucht man nach einem schweren Sturz?", "einen neuen Helm", "einen neuen Riemen", "ein neues Velo"],
      ["stimmt", "Ein Helm hilft nur, wenn er richtig sitzt.", "ja"],
      ["stimmt", "Nach einem schweren Sturz kann man den Helm immer weiter benutzen.", "nein"],
      ["stimmt", "Velohelme gibt es in vielen Farben.", "fehlt"],
      ["titel", "So schützt der Velohelm richtig", "Eine Velotour in den Bergen", "Wie man ein Velo flickt"],
    ] },

  // ---------- Stufe 3: zwei Abschnitte, Titel zu Abschnitten ----------
  { stufe: 3, titel: "Der Maulwurf",
    abschnitte: [
      ["Gänge und Hügel", "Der Maulwurf lebt fast immer unter der Erde. Mit seinen breiten Vorderpfoten gräbt er lange Gänge. Die lockere Erde schiebt er nach oben. So entstehen die Maulwurfshügel auf der Wiese."],
      ["Futtersuche im Dunkeln", "Der Maulwurf sieht sehr schlecht. Dafür kann er gut riechen und tasten. So findet er Regenwürmer und Insektenlarven. Auch im Winter ist er auf Futtersuche, denn er hält keinen Winterschlaf."],
    ],
    ablenker: "Ein Nest hoch im Baum",
    fragen: [
      ["angabe", "Womit gräbt der Maulwurf seine Gänge?", "mit den breiten Vorderpfoten", "mit der Schnauze", "mit den Hinterbeinen"],
      ["angabe", "Wie entstehen die Maulwurfshügel?", "Er schiebt die lockere Erde nach oben.", "Er sammelt Erde im Maul.", "Der Regen spült Erde zusammen."],
      ["stimmt", "Der Maulwurf kann gut riechen.", "ja"],
      ["stimmt", "Der Maulwurf hält einen Winterschlaf.", "nein"],
      ["stimmt", "Ein Maulwurf wird nur wenige Jahre alt.", "fehlt"],
    ] },
  { stufe: 3, titel: "Der Weg des Wassers",
    abschnitte: [
      ["Vom Meer in die Wolken", "Die Sonne erwärmt das Wasser in Meeren, Seen und Flüssen. Ein Teil davon verdunstet und steigt als unsichtbarer Wasserdampf in die Luft. Weiter oben ist es kälter. Dort bilden sich aus dem Dampf winzige Tröpfchen, und es entstehen Wolken."],
      ["Von den Wolken zurück ins Meer", "Werden die Tropfen in der Wolke zu schwer, fallen sie als Regen herunter. Ist es kalt genug, fällt Schnee. Das Wasser fliesst in Bäche und Flüsse und schliesslich wieder ins Meer. Dann beginnt der Kreislauf von vorn."],
    ],
    ablenker: "Ein Gewitter im Sommer",
    fragen: [
      ["angabe", "Was erwärmt das Wasser?", "die Sonne", "der Wind", "der Mond"],
      ["angabe", "Wann fallen die Tropfen aus der Wolke?", "wenn sie zu schwer werden", "wenn es Nacht wird", "wenn der Wind aufhört"],
      ["stimmt", "Wasserdampf ist unsichtbar.", "ja"],
      ["stimmt", "Weiter oben in der Luft ist es wärmer.", "nein"],
      ["stimmt", "Ein Teil des Regens versickert im Boden.", "fehlt"],
    ] },
  { stufe: 3, titel: "Die Sprachen der Schweiz",
    abschnitte: [
      ["Vier Landessprachen", "Die Schweiz hat vier Landessprachen: Deutsch, Französisch, Italienisch und Rätoromanisch. Am meisten Menschen sprechen Deutsch. Französisch spricht man vor allem im Westen des Landes, Italienisch vor allem im Süden. Rätoromanisch ist im Kanton Graubünden zu Hause."],
      ["Mehrere Sprachen im Alltag", "Viele Kinder lernen in der Schule eine zweite Landessprache. Auf Verpackungen stehen oft mehrere Sprachen nebeneinander. Auf den Briefmarken steht „Helvetia“. Das ist der lateinische Name der Schweiz."],
    ],
    ablenker: "Wie man eine Sprache erfindet",
    fragen: [
      ["angabe", "Wo spricht man vor allem Italienisch?", "im Süden", "im Westen", "im Norden"],
      ["angabe", "Was steht auf den Briefmarken?", "Helvetia", "Schweiz", "Suisse"],
      ["stimmt", "Am meisten Menschen in der Schweiz sprechen Deutsch.", "ja"],
      ["stimmt", "Die Schweiz hat drei Landessprachen.", "nein"],
      ["stimmt", "In Graubünden spricht man auch Deutsch und Italienisch.", "fehlt"],
    ] },
  { stufe: 3, titel: "Strom von der Sonne",
    abschnitte: [
      ["So funktioniert eine Solaranlage", "Auf vielen Dächern sieht man dunkle Platten. Das sind Solarzellen. Sie machen aus Sonnenlicht elektrischen Strom. Je stärker die Sonne scheint, desto mehr Strom liefern sie."],
      ["Wann es wenig Strom gibt", "Bei bewölktem Himmel liefern die Solarzellen weniger Strom. In der Nacht liefern sie gar keinen. Liegt im Winter Schnee auf den Platten, kommt kaum Licht hindurch. Darum braucht man auch noch andere Stromquellen."],
    ],
    ablenker: "Strom aus dem Stausee",
    fragen: [
      ["angabe", "Was machen Solarzellen aus Sonnenlicht?", "elektrischen Strom", "Gas", "Wind"],
      ["angabe", "Warum braucht man noch andere Stromquellen?", "Weil Solarzellen nicht immer genug Strom liefern.", "Weil Solarzellen zu teuer sind.", "Weil Solarzellen zu laut sind."],
      ["stimmt", "In der Nacht liefern Solarzellen keinen Strom.", "ja"],
      ["stimmt", "Bei Wolken liefern Solarzellen mehr Strom.", "nein"],
      ["stimmt", "Solarzellen halten viele Jahre.", "fehlt"],
    ] },
  { stufe: 3, titel: "Der Weissstorch",
    abschnitte: [
      ["Im Sommer bei uns", "Der Weissstorch ist ein grosser Vogel mit langen roten Beinen und einem roten Schnabel. Sein Nest baut er hoch oben, zum Beispiel auf Dächern, Kaminen oder Masten. Auf Wiesen und Feldern sucht er Futter. Er frisst Mäuse, Frösche, Regenwürmer und grosse Insekten."],
      ["Die grosse Reise", "Im Spätsommer machen sich viele Störche auf eine lange Reise. Im Winter fänden sie bei uns zu wenig Futter. Manche fliegen bis nach Afrika, andere bleiben in Spanien. Im Frühling kehren sie zurück, oft zum gleichen Nest."],
    ],
    ablenker: "Ein Vogel, der nicht fliegen kann",
    fragen: [
      ["angabe", "Wo baut der Storch sein Nest?", "hoch oben, zum Beispiel auf Dächern", "im hohen Gras", "in einer Erdhöhle"],
      ["angabe", "Wohin fliegen manche Störche?", "bis nach Afrika", "bis nach Amerika", "bis nach Norwegen"],
      ["stimmt", "Der Weissstorch hat rote Beine.", "ja"],
      ["stimmt", "Alle Störche fliegen bis nach Afrika.", "nein"],
      ["stimmt", "Ein Storchenpaar zieht jedes Jahr mehrere Junge gross.", "fehlt"],
    ] },

  // ---------- Stufe 4: Abschnitte, Tabelle, einfache Schlussfolgerung ----------
  { stufe: 4, titel: "Lawinen",
    abschnitte: [
      ["Wann Lawinen abgehen", "Eine Lawine ist eine grosse Menge Schnee, die einen steilen Hang hinunterrutscht. Gefährlich wird es besonders nach viel Neuschnee, bei starkem Wind oder wenn es plötzlich warm wird. Dann hält die Schneedecke nicht mehr gut am Hang."],
      ["Das Lawinenbulletin", "In Davos beobachten Fachleute jeden Tag den Schnee in den Alpen. Sie geben das Lawinenbulletin heraus. Darin steht, wie gross die Lawinengefahr ist. Es gibt fünf Gefahrenstufen. Wer abseits der Pisten unterwegs ist, liest das Bulletin vorher."],
    ],
    ablenker: "Skifahren lernen",
    tabelle: { titel: "Die fünf Gefahrenstufen", kopf: ["Stufe", "Gefahr"], zeilen: [["1", "gering"], ["2", "mässig"], ["3", "erheblich"], ["4", "gross"], ["5", "sehr gross"]], nach: 2 },
    fragen: [
      ["angabe", "Wo beobachten Fachleute jeden Tag den Schnee?", "in Davos", "in Bern", "in Zermatt"],
      ["tabelle", "Welche Gefahr bedeutet Stufe 3?", "erheblich", "mässig", "gross"],
      ["folgern", "Drei Tage lang hat es stark geschneit. Wie ist die Lawinengefahr jetzt wahrscheinlich?", "eher hoch", "eher tief", "Es gibt gar keine Gefahr."],
      ["stimmt", "Das Lawinenbulletin kennt fünf Gefahrenstufen.", "ja"],
      ["stimmt", "Wenn es plötzlich warm wird, hält der Schnee besser am Hang.", "nein"],
      ["stimmt", "Lawinenhunde suchen nach verschütteten Menschen.", "fehlt"],
    ] },
  { stufe: 4, titel: "Sammeln statt wegwerfen",
    abschnitte: [
      ["Abfall getrennt sammeln", "In der Schweiz sammelt man viele Abfälle getrennt. PET-Flaschen, Glas, Aluminium, Papier und Karton kommen nicht in den Abfallsack. Aus dem gesammelten Material macht man neue Dinge. So braucht man weniger Rohstoffe und Energie."],
      ["Glas nach Farben", "Altglas wird nach Farben getrennt: braun, grün und weiss. Glas mit einer anderen Farbe, zum Beispiel blaues, gibt man meistens zum grünen Glas. Aus dem alten Glas schmilzt man neue Flaschen und Gläser."],
    ],
    ablenker: "Ein Besuch in der Glasbläserei",
    fragen: [
      ["angabe", "In welche drei Farben trennt man Altglas?", "braun, grün und weiss", "rot, blau und gelb", "braun, blau und weiss"],
      ["angabe", "Wohin gehört eine blaue Flasche meistens?", "zum grünen Glas", "zum weissen Glas", "in den Abfallsack"],
      ["folgern", "Lea bringt ein leeres Konfitüreglas zur Sammelstelle. Worauf muss sie achten?", "auf die Farbe des Glases", "auf die Grösse des Glases", "auf das Gewicht des Glases"],
      ["stimmt", "PET-Flaschen gehören in den Abfallsack.", "nein"],
      ["stimmt", "Aus altem Glas macht man neue Flaschen.", "ja"],
      ["stimmt", "Alte Batterien bringt man in den Laden zurück.", "fehlt"],
    ] },
  { stufe: 4, titel: "Wie wir zur Schule kommen",
    abschnitte: [
      ["Die Umfrage", "Die Klasse 6a wollte wissen, wie die Kinder zur Schule kommen. Alle 24 Kinder der Klasse haben mitgemacht. Jedes Kind hat genau eine Antwort gegeben: den Weg, den es am häufigsten nimmt."],
      ["Was die Klasse herausgefunden hat", "Fast die Hälfte der Klasse geht zu Fuss. Nur wenige fahren mit dem Bus, denn die meisten wohnen nahe beim Schulhaus. Im Winter nehmen einige Velofahrer lieber den Bus. Das hat die Umfrage aber nicht gezählt."],
    ],
    ablenker: "Ein neuer Schulweg",
    tabelle: { titel: "Ergebnis der Umfrage", kopf: ["Weg zur Schule", "Kinder"], zeilen: [["zu Fuss", "11"], ["mit dem Velo", "7"], ["mit dem Bus", "4"], ["mit dem Trottinett", "2"]], nach: 1 },
    fragen: [
      ["tabelle", "Wie viele Kinder kommen mit dem Velo?", "7", "11", "4"],
      ["tabelle", "Wie kommen die wenigsten Kinder zur Schule?", "mit dem Trottinett", "mit dem Bus", "zu Fuss"],
      ["folgern", "Wie viele Kinder der Klasse kommen nicht zu Fuss?", "13", "11", "24"],
      ["folgern", "Warum fahren wohl nur wenige mit dem Bus?", "Die meisten wohnen nahe beim Schulhaus.", "Der Bus ist zu teuer.", "Der Bus fährt nur im Winter."],
      ["stimmt", "Alle Kinder der Klasse haben bei der Umfrage mitgemacht.", "ja"],
      ["stimmt", "Im Winter fahren mehr Kinder mit dem Velo.", "nein"],
      ["stimmt", "Die Klasse hat die Umfrage im Mai gemacht.", "fehlt"],
    ] },
  { stufe: 4, titel: "Der Siebenschläfer",
    abschnitte: [
      ["Ein langer Schlaf", "Der Siebenschläfer ist ein kleines Nagetier mit einem buschigen Schwanz. Seinen Namen hat er von seinem langen Winterschlaf: Er dauert oft sieben Monate. Vorher frisst er sich eine dicke Fettschicht an. Von diesem Fett lebt er, solange er schläft."],
      ["Ein Tier der Nacht", "Im Sommer ist der Siebenschläfer in der Nacht aktiv. Er klettert geschickt in den Bäumen und frisst Bucheckern, Nüsse, Früchte und Knospen. Manchmal zieht er in einen Nistkasten oder auf einen Dachboden. Dort hört man ihn nachts rumpeln."],
    ],
    ablenker: "Ein Vogel im Nistkasten",
    fragen: [
      ["angabe", "Wovon lebt der Siebenschläfer während des Winterschlafs?", "von seiner Fettschicht", "von gesammelten Nüssen", "von Knospen"],
      ["folgern", "Warum frisst der Siebenschläfer vor dem Winter besonders viel?", "Er braucht Fett für den langen Winterschlaf.", "Er will schneller klettern können.", "Im Winter frisst er doppelt so viel."],
      ["folgern", "Wann trifft man einen Siebenschläfer am ehesten wach an?", "in einer Sommernacht", "an einem Wintermorgen", "am Mittag im Januar"],
      ["stimmt", "Der Siebenschläfer klettert gut.", "ja"],
      ["stimmt", "Im Sommer ist der Siebenschläfer vor allem am Tag aktiv.", "nein"],
      ["stimmt", "Siebenschläfer bekommen im Sommer Junge.", "fehlt"],
    ] },
  { stufe: 4, titel: "Unterwegs auf Wanderwegen",
    abschnitte: [
      ["Richtung und Zeit", "In der Schweiz gibt es ein dichtes Netz von markierten Wanderwegen. Gelbe Wegweiser zeigen die Richtung und die Zeit bis zum Ziel. Die Zeit ist ohne Pausen gerechnet."],
      ["Bergwege", "Bergwanderwege sind weiss-rot-weiss markiert. Sie sind oft steil und schmal. Darum braucht man dort gute Wanderschuhe. Alpinwanderwege sind weiss-blau-weiss markiert. Sie führen durch schwieriges Gelände und sind nur für erfahrene Berggänger gedacht."],
    ],
    ablenker: "Mit der Seilbahn auf den Gipfel",
    tabelle: { titel: "Ein Wegweiser (Beispiel)", kopf: ["Ziel", "Zeit"], zeilen: [["Waldhof", "45 min"], ["Alp Sonnenberg", "1 h 30 min"], ["Gipfel Rotstock", "2 h 45 min"]], nach: 1 },
    fragen: [
      ["tabelle", "Wie lange braucht man laut Wegweiser bis zum Waldhof?", "45 min", "1 h 30 min", "2 h 45 min"],
      ["tabelle", "Welches Ziel ist laut Wegweiser am weitesten?", "Gipfel Rotstock", "Alp Sonnenberg", "Waldhof"],
      ["folgern", "Mia macht unterwegs zwei Pausen. Wie lange braucht sie bis zur Alp Sonnenberg?", "länger als 1 h 30 min", "kürzer als 1 h 30 min", "genau 1 h 30 min"],
      ["stimmt", "Alpinwanderwege sind weiss-blau-weiss markiert.", "ja"],
      ["stimmt", "Auf gelben Wegweisern steht nur die Richtung.", "nein"],
      ["stimmt", "Die Wanderwege werden jedes Jahr kontrolliert.", "fehlt"],
    ] },

  // ---------- Stufe 5: Text und Tabelle verbinden ----------
  { stufe: 5, titel: "Was der Puls verrät",
    abschnitte: [
      ["Das Herz als Pumpe", "Das Herz ist ein Muskel. Es pumpt das Blut durch den ganzen Körper. Das Blut bringt Sauerstoff zu den Muskeln. Jeden Herzschlag spürt man als Puls, zum Beispiel am Handgelenk oder am Hals."],
      ["Ninas Versuch", "Nina hat ihren Puls jeweils eine Minute lang gezählt. Zuerst sass sie ruhig auf einem Stuhl. Dann stieg sie zweimal die Treppe hinauf. Danach rannte sie drei Minuten lang. Fünf Minuten später zählte sie noch einmal. Je mehr sich die Muskeln anstrengen, desto mehr Sauerstoff brauchen sie. Darum schlägt das Herz dann schneller."],
    ],
    ablenker: "Wie man eine Treppe baut",
    tabelle: { titel: "Ninas Messungen", kopf: ["Wann gezählt", "Schläge in einer Minute"], zeilen: [["in Ruhe", "84"], ["nach der Treppe", "112"], ["nach dem Rennen", "148"], ["fünf Minuten später", "96"]], nach: 2 },
    fragen: [
      ["tabelle", "Wie viele Schläge zählte Nina in Ruhe?", "84", "112", "96"],
      ["tabelle", "Wann schlug Ninas Herz am schnellsten?", "nach dem Rennen", "nach der Treppe", "fünf Minuten später"],
      ["folgern", "Was zeigt die letzte Messung?", "Nach der Anstrengung wird der Puls wieder langsamer.", "Nach dem Rennen bleibt der Puls gleich hoch.", "Der Puls ist danach langsamer als in Ruhe."],
      ["folgern", "Um wie viele Schläge war der Puls nach dem Rennen höher als in Ruhe?", "64", "36", "52"],
      ["angabe", "Warum schlägt das Herz bei Anstrengung schneller?", "Die Muskeln brauchen mehr Sauerstoff.", "Das Blut wird kälter.", "Der Körper wird schwerer."],
      ["stimmt", "Den Puls kann man am Hals spüren.", "ja"],
      ["stimmt", "Nina hat den Puls jeweils zehn Sekunden lang gezählt.", "nein"],
      ["stimmt", "Erwachsene haben in Ruhe meist einen langsameren Puls als Kinder.", "fehlt"],
    ] },
  { stufe: 5, titel: "Der Schulgarten",
    abschnitte: [
      ["Ein Beet für die Klasse", "Die Klasse 6b hat im Frühling ein Beet im Schulgarten angelegt. Sie hat Kartoffeln, Rüebli, Bohnen und Salat gepflanzt. Jede Woche hat eine Gruppe gegossen und gejätet."],
      ["Ernte und Pläne", "Im Sommer und im Herbst hat die Klasse geerntet. Die Kartoffeln hat sie in einem kühlen, dunklen Keller gelagert. Aus einem Teil der Ernte hat sie eine Suppe für das ganze Schulhaus gekocht. Im nächsten Jahr will sie auf dem Beet keine Kartoffeln pflanzen, sondern Bohnen."],
    ],
    ablenker: "Gemüse aus dem Laden",
    tabelle: { titel: "Die Ernte der Klasse 6b", kopf: ["Gemüse", "geerntet"], zeilen: [["Kartoffeln", "18 kg"], ["Rüebli", "6 kg"], ["Bohnen", "4 kg"], ["Salat", "12 Köpfe"]], nach: 2 },
    fragen: [
      ["tabelle", "Wie viel Rüebli hat die Klasse geerntet?", "6 kg", "4 kg", "18 kg"],
      ["tabelle", "Von welchem Gemüse hat die Klasse am meisten Kilogramm geerntet?", "Kartoffeln", "Rüebli", "Bohnen"],
      ["folgern", "Wie viele Kilogramm Kartoffeln, Rüebli und Bohnen waren es zusammen?", "28 kg", "24 kg", "30 kg"],
      ["angabe", "Wo hat die Klasse die Kartoffeln gelagert?", "in einem kühlen, dunklen Keller", "auf dem Fenstersims", "im Kühlschrank"],
      ["stimmt", "Die Klasse hat eine Suppe für das ganze Schulhaus gekocht.", "ja"],
      ["stimmt", "Im nächsten Jahr pflanzt die Klasse auf dem Beet wieder Kartoffeln.", "nein"],
      ["stimmt", "Im Schulgarten gibt es auch einen Kompost.", "fehlt"],
    ] },
  { stufe: 5, titel: "Die Schulwetterstation",
    abschnitte: [
      ["Was eine Wetterstation misst", "Eine Wetterstation misst zum Beispiel die Lufttemperatur, den Regen und den Wind. Die Temperatur misst man im Schatten, etwa zwei Meter über dem Boden. In der Sonne würde das Thermometer zu viel anzeigen. Den Regen fängt man in einem Messbecher auf und gibt ihn in Millimetern an."],
      ["Eine Woche im April", "Die Klasse 6c hat eine Woche lang jeden Mittag die Werte ihrer Schulwetterstation notiert. Am Dienstag war es den ganzen Tag trüb und nass. Danach wurde es von Tag zu Tag wärmer."],
    ],
    ablenker: "Ein Gewitter in der Nacht",
    tabelle: { titel: "Werte am Mittag", kopf: ["Tag", "Temperatur", "Regen"], zeilen: [["Montag", "9 °C", "0 mm"], ["Dienstag", "7 °C", "12 mm"], ["Mittwoch", "11 °C", "3 mm"], ["Donnerstag", "14 °C", "0 mm"], ["Freitag", "16 °C", "0 mm"]], nach: 2 },
    fragen: [
      ["tabelle", "An welchem Tag war es am Mittag am wärmsten?", "am Freitag", "am Donnerstag", "am Dienstag"],
      ["tabelle", "Wie viel Regen fiel am Mittwoch?", "3 mm", "12 mm", "0 mm"],
      ["folgern", "An wie vielen Tagen dieser Woche hat es geregnet?", "an 2 Tagen", "an 3 Tagen", "an 1 Tag"],
      ["angabe", "Warum misst man die Temperatur im Schatten?", "In der Sonne würde das Thermometer zu viel anzeigen.", "Im Schatten bleibt das Thermometer trocken.", "Im Schatten kann man die Zahlen besser lesen."],
      ["folgern", "Was passt zum Dienstag?", "Es war am kühlsten und hat am meisten geregnet.", "Es war am wärmsten und trocken.", "Es hat geschneit."],
      ["stimmt", "Die Klasse hat die Werte jeden Morgen notiert.", "nein"],
      ["stimmt", "Regen gibt man in Millimetern an.", "ja"],
      ["stimmt", "Die Wetterstation steht auf dem Dach des Schulhauses.", "fehlt"],
    ] },
  { stufe: 5, titel: "Velotour um den See",
    abschnitte: [
      ["Der Plan", "Die Klasse 6a plant eine Velotour um den See. Die Route ist in vier Etappen aufgeteilt. Nach jeder Etappe gibt es eine Pause. Bei der Badi gibt es die lange Mittagspause."],
      ["Gut vorbereitet", "Vor der Tour kontrollieren alle ihr Velo: Bremsen, Licht und Reifen. Jedes Kind trägt einen Helm und nimmt eine Trinkflasche mit. Die Lehrerin fährt vorne, ein Vater fährt am Schluss."],
    ],
    ablenker: "Ein Velo flicken",
    tabelle: { titel: "Die Etappen", kopf: ["Etappe", "von – bis", "Länge"], zeilen: [["1", "Schulhaus – Hafen", "8 km"], ["2", "Hafen – Badi", "12 km"], ["3", "Badi – Schloss", "6 km"], ["4", "Schloss – Schulhaus", "14 km"]], nach: 1 },
    fragen: [
      ["tabelle", "Welche Etappe ist am kürzesten?", "Badi – Schloss", "Schulhaus – Hafen", "Schloss – Schulhaus"],
      ["tabelle", "Wie lang ist die ganze Tour?", "40 km", "34 km", "14 km"],
      ["folgern", "Wie viele Kilometer sind die Kinder bei der Mittagspause schon gefahren?", "20 km", "12 km", "26 km"],
      ["angabe", "Was kontrollieren alle vor der Tour?", "Bremsen, Licht und Reifen", "Klingel, Sattel und Kette", "Helm, Schuhe und Jacke"],
      ["stimmt", "Die Route hat vier Etappen.", "ja"],
      ["stimmt", "Die lange Mittagspause ist beim Schloss.", "nein"],
      ["stimmt", "Die Klasse fährt im Juni.", "fehlt"],
    ] },

  // ---------- Stufe 6 (Königsstufe): längere Abschnitte, verknüpfen und folgern ----------
  { stufe: 6, titel: "Strom sparen im Schulhaus",
    abschnitte: [
      ["Strom, den niemand braucht", "Viele Geräte brauchen auch dann Strom, wenn sie nur im Standby sind. Ein kleines Lämpchen zeigt das oft an. Wer das Gerät ganz ausschaltet, spart diesen Strom. Auch Licht in leeren Zimmern verbraucht Strom, ohne dass es jemandem nützt."],
      ["Die Klasse vergleicht Lampen", "Die Klasse 6b hat untersucht, wie viel Strom verschiedene Lampen brauchen. Die drei Lampen geben etwa gleich viel Licht. Die Kinder haben die Leistung auf den Lampen abgelesen. Sie wird in Watt (W) angegeben. Je kleiner die Zahl, desto weniger Strom braucht die Lampe in einer Stunde."],
    ],
    ablenker: "Wie ein Kraftwerk funktioniert",
    tabelle: { titel: "Lampen mit etwa gleich viel Licht", kopf: ["Lampe", "Leistung"], zeilen: [["alte Glühbirne", "60 W"], ["Energiesparlampe", "12 W"], ["LED-Lampe", "8 W"]], nach: 2 },
    fragen: [
      ["tabelle", "Welche Lampe braucht am wenigsten Strom?", "die LED-Lampe", "die Energiesparlampe", "die alte Glühbirne"],
      ["folgern", "Wie viel Strom braucht die Glühbirne im Vergleich zur Energiesparlampe?", "5-mal so viel", "4-mal so viel", "48-mal so viel"],
      ["folgern", "Am Fernseher leuchtet ein kleines rotes Lämpchen, das Bild ist aus. Was bedeutet das wahrscheinlich?", "Er braucht noch etwas Strom.", "Er ist kaputt.", "Er braucht gar keinen Strom."],
      ["folgern", "Warum lohnt es sich, in der Pause das Licht zu löschen, wenn alle draussen sind?", "Licht im leeren Zimmer braucht Strom, ohne zu nützen.", "Die Lampen gehen sonst kaputt.", "Im Dunkeln wird das Zimmer wärmer."],
      ["stimmt", "Die LED-Lampe gibt viel weniger Licht als die Glühbirne.", "nein"],
      ["stimmt", "Die Leistung einer Lampe gibt man in Watt an.", "ja"],
      ["stimmt", "Die Klasse hat danach alle alten Lampen ersetzt.", "fehlt"],
    ] },
  { stufe: 6, titel: "Wasser im Haushalt",
    abschnitte: [
      ["Wofür wir Wasser brauchen", "In der Schweiz braucht eine Person im Haushalt jeden Tag weit über hundert Liter Wasser. Viel davon fliesst durch die Toilette, beim Duschen und Baden und in der Waschmaschine. Zum Trinken und Kochen braucht man nur wenige Liter."],
      ["Familie Graf schätzt", "Familie Graf wollte wissen, wo sie Wasser sparen kann. Sie hat geschätzt, wie viel Wasser einzelne Tätigkeiten brauchen. Seither duscht sie meistens, statt zu baden. Beim Zähneputzen füllt sie einen Becher, statt das Wasser laufen zu lassen."],
    ],
    ablenker: "Ein Ferientag am See",
    tabelle: { titel: "Schätzung von Familie Graf", kopf: ["Tätigkeit", "Wasser"], zeilen: [["ein Vollbad", "150 Liter"], ["5 Minuten duschen", "50 Liter"], ["Zähneputzen, Wasser läuft", "6 Liter"], ["Zähneputzen mit Becher", "1 Liter"]], nach: 2 },
    fragen: [
      ["tabelle", "Wie viel Wasser braucht ein Vollbad laut Familie Graf?", "150 Liter", "50 Liter", "100 Liter"],
      ["folgern", "Wie viele Liter spart die Familie, wenn jemand 5 Minuten duscht statt badet?", "100 Liter", "50 Liter", "200 Liter"],
      ["folgern", "Warum benutzt die Familie beim Zähneputzen einen Becher?", "Mit dem Becher braucht man viel weniger Wasser.", "Das Wasser aus dem Hahn ist zu kalt.", "Der Wasserhahn ist kaputt."],
      ["angabe", "Wofür braucht man laut Text nur wenige Liter?", "zum Trinken und Kochen", "für die Toilette", "für die Waschmaschine"],
      ["stimmt", "Familie Graf hat die Zahlen in der Tabelle genau gemessen.", "nein"],
      ["stimmt", "Zum Trinken und Kochen braucht man nur wenige Liter.", "ja"],
      ["stimmt", "Familie Graf hat einen Garten.", "fehlt"],
    ] },
  { stufe: 6, titel: "Der Schutzwald",
    abschnitte: [
      ["Ein Wald als Schutz", "In den Bergen schützen viele Wälder Dörfer, Strassen und Bahnlinien. Man nennt sie Schutzwälder. Die Bäume halten Steine auf, die vom Hang herunterfallen. Ausserdem verhindern sie, dass an steilen Hängen Lawinen entstehen."],
      ["Der Wald braucht Pflege", "Ein Schutzwald hilft nur, wenn er gesund ist und junge Bäume nachwachsen. Darum fällen Förster alte Bäume und schaffen so Platz und Licht für junge. Wo kein Wald wächst, baut man Lawinenverbauungen aus Holz oder Stahl. Solche Verbauungen sind viel teurer als die Pflege eines Waldes."],
    ],
    ablenker: "Holz für den Ofen",
    fragen: [
      ["angabe", "Wovor schützt der Schutzwald laut Text?", "vor Steinschlag und Lawinen", "vor Blitz und Hagel", "vor Hitze und Trockenheit"],
      ["angabe", "Warum fällen Förster im Schutzwald alte Bäume?", "Junge Bäume bekommen so Platz und Licht.", "Das Holz wird für Verbauungen gebraucht.", "Alte Bäume halten keine Steine auf."],
      ["folgern", "Was passiert wahrscheinlich, wenn in einem Schutzwald lange keine jungen Bäume nachwachsen?", "Der Wald schützt später immer schlechter.", "Der Wald schützt später immer besser.", "Es gibt keine Lawinen mehr."],
      ["folgern", "Warum pflegt eine Berggemeinde lieber ihren Schutzwald, statt überall Verbauungen zu bauen?", "Die Pflege des Waldes kostet viel weniger.", "Verbauungen helfen gar nicht.", "Förster dürfen keine Verbauungen bauen."],
      ["stimmt", "Schutzwälder schützen auch Bahnlinien.", "ja"],
      ["stimmt", "Lawinenverbauungen sind billiger als die Pflege eines Waldes.", "nein"],
      ["stimmt", "Im Schutzwald wachsen vor allem Fichten.", "fehlt"],
    ] },
  { stufe: 6, titel: "Die Schulbibliothek",
    abschnitte: [
      ["Ausleihen und verlängern", "In der Schulbibliothek darf jedes Kind bis zu vier Medien gleichzeitig ausleihen, also Bücher, Hörbücher oder Zeitschriften. Bücher darf man drei Wochen behalten, Hörbücher und Zeitschriften nur zwei Wochen. Wer mehr Zeit braucht, kann die Ausleihe einmal um die gleiche Zeit verlängern. Hat jemand anderes das Medium reserviert, geht das nicht."],
      ["Was am meisten gelesen wird", "Die Bibliothekarin hat gezählt, welche Bücher im letzten Schuljahr am häufigsten ausgeliehen wurden. Sachbücher über Tiere waren besonders beliebt. Nun will sie mehr davon kaufen."],
    ],
    ablenker: "Wie man ein Buch schreibt",
    tabelle: { titel: "Ausleihen im letzten Schuljahr", kopf: ["Art", "Ausleihen"], zeilen: [["Comics", "312"], ["Krimis", "187"], ["Sachbücher", "164"], ["Abenteuerbücher", "141"]], nach: 2 },
    fragen: [
      ["tabelle", "Welche Art Bücher wurde am häufigsten ausgeliehen?", "Comics", "Krimis", "Sachbücher"],
      ["folgern", "Lio leiht ein Buch aus und verlängert einmal. Wie lange darf er es höchstens behalten?", "sechs Wochen", "vier Wochen", "drei Wochen"],
      ["folgern", "Mia hat schon vier Bücher ausgeliehen. Darf sie heute noch ein Hörbuch mitnehmen?", "Nein, zuerst muss sie etwas zurückbringen.", "Ja, Hörbücher zählen nicht.", "Ja, aber nur für eine Woche."],
      ["folgern", "Wie viele Ausleihen mehr hatten die Krimis als die Sachbücher?", "23", "33", "13"],
      ["stimmt", "Ein Medium, das jemand anderes reserviert hat, kann man nicht verlängern.", "ja"],
      ["stimmt", "Zeitschriften darf man drei Wochen behalten.", "nein"],
      ["stimmt", "Die Bibliothek ist jeden Mittwoch offen.", "fehlt"],
    ] },
];
