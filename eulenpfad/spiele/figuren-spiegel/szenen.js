/* Szenen für den Figuren-Spiegel — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan D.2.C.1 (Literarische Texte: Figuren verstehen):
   d  Textverständnis zeigen, indem sie einen Text gestaltend vorlesen (einzelne Figuren stimmlich
      unterscheiden) — hier: das Gefühl einer Figur erkennen, das der Text nennt (Stufe 1);
   e  (Orientierungspunkt 2. Zyklus) mit Unterstützung Stimmungen wahrnehmen, die ein Text vermittelt
      (z. B. Spannung in einem Krimi) — Stufe 2: Stimmung der Szene, Grund für eine Handlung, der im
      Text steht;
   f  (Grundanspruch Ende 6. Klasse) sich in Figuren hineinversetzen, ihr Handeln sowie mit
      Unterstützung deren Absichten und Motive nachvollziehen und mit der eigenen Lebenswelt in
      Verbindung bringen — Stufe 3 Motiv erschliessen, Stufe 4 zwei Sichten und Sagen ≠ Meinen,
      Stufe 5 Fortsetzung und Ich-Perspektive, Stufe 6 Motive aus Andeutungen und Lebenswelt.
   Alle Szenen selbst geschrieben, erfundene Namen, Schweizer Alltag (Schule, Lager, Familie, Sport,
   Freundschaft); keine Gewalt, jede Reibung löst sich auf. Schweizer Schreibweise (ss), Anführungszeichen
   im Text «…» wie in Schweizer Lehrmitteln.

   Schreibweise je Eintrag: { gruppe, titel, figuren, text, fragen }
   - gruppe: 1 = 40–70 Wörter (Stufen 1–2), 2 = 60–100 Wörter (Stufen 3–4), 3 = 80–120 Wörter (Stufen 5–6);
     das Spiel zählt die Wörter nach (pruefeAufgabe).
   - figuren: Namen, die im Text vorkommen (die erste ist die Hauptfigur).
   - fragen: je Frage [Art, Frage, richtige Antwort, falsche Antwort, falsche Antwort]. Die richtige steht
     immer zuerst; das Spiel mischt. Bei motiv ist die erste falsche Antwort die zu wörtliche oder
     oberflächliche, die zweite passt nicht zur Szene.
   Arten:
     gefuehl     Wie fühlt sich die Figur? — das Gefühl steht so oder fast so im Text (Stufe 1)
     stimmung    Welche Stimmung hat die Szene? — spannend, lustig, traurig, gemütlich, unheimlich (Stufe 2)
     grund       Warum tut sie das? — der Grund steht im Text (Stufe 2)
     motiv       Absicht oder Motiv, das NICHT wörtlich dasteht (Stufen 3, 4, 6)
     sicht       Was denkt oder weiss die zweite Figur? (Stufe 4)
     meinen      Die Figur sagt etwas und meint etwas anderes (Stufen 4, 6)
     weiter      Was tut die Figur wohl als Nächstes? — passend zum Motiv (Stufen 5, 6)
     ich         Was würdest du an ihrer Stelle fühlen? — eine eindeutig passende Antwort (Stufen 5, 6)
     lebenswelt  Welche Situation aus dem Alltag passt am ehesten dazu? (Stufe 6)

   Inhaltsliste (Entscheid L4 a): eine Liste „szenen“; der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag figuren-spiegel, Feld listen). */

const SPIEGEL_SZENEN = [
  // ---------- Gruppe 1: kurze Szenen (40–70 Wörter), Gefühl, Stimmung, Grund ----------
  { gruppe: 1, titel: "Der leere Platz", figuren: ["Nora", "Samira"],
    text: "Am Montag kommt Nora in die Klasse und bleibt an der Tür stehen. Der Platz neben ihr ist leer. Samira ist weggezogen, nach Bern. Nora setzt sich langsam hin und schaut auf den leeren Stuhl. Sie ist traurig. In der Pause bleibt sie drinnen und schreibt Samira eine Karte, weil sie ihr erzählen will, wie es in der Klasse ohne sie ist.",
    fragen: [
      ["gefuehl", "Wie fühlt sich Nora?", "traurig", "stolz", "aufgeregt"],
      ["stimmung", "Welche Stimmung hat die Szene?", "traurig", "lustig", "unheimlich"],
      ["grund", "Warum schreibt Nora eine Karte?", "Weil sie Samira erzählen will, wie es ohne sie ist.", "Weil die Lehrerin es verlangt.", "Weil Samira Geburtstag hat."],
    ] },
  { gruppe: 1, titel: "Das Tor", figuren: ["Elias", "Vater"],
    text: "Beim Fussballturnier in Wil steht es kurz vor Schluss 1:1. Elias bekommt den Ball, läuft los und schiesst. Der Ball fliegt ins Netz! Die ganze Mannschaft rennt auf ihn zu. Elias ist so stolz, dass er fast nicht atmen kann. Auf dem Heimweg erzählt er seinem Vater die Szene dreimal, weil er sie noch einmal erleben will.",
    fragen: [
      ["gefuehl", "Wie fühlt sich Elias nach dem Tor?", "stolz", "ängstlich", "gelangweilt"],
      ["stimmung", "Welche Stimmung hat die Szene?", "spannend", "unheimlich", "traurig"],
      ["grund", "Warum erzählt Elias die Szene dreimal?", "Weil er sie noch einmal erleben will.", "Weil sein Vater nicht zuhört.", "Weil er sie schon vergessen hat."],
    ] },
  { gruppe: 1, titel: "Die Nachtwanderung", figuren: ["Lina", "Jonas", "Herr Keller"],
    text: "Im Klassenlager machen alle eine Nachtwanderung. Der Wald ist dunkel, nur die Taschenlampe von Herrn Keller leuchtet. Ein Ast knackt. Lina hält Jonas am Ärmel fest, weil sie Angst hat, im Dunkeln den Weg zu verlieren. Da ruft eine Eule. Alle lachen erleichtert, und Lina lässt den Ärmel los.",
    fragen: [
      ["gefuehl", "Wie fühlt sich Lina im dunklen Wald?", "Sie hat Angst.", "Sie ist stolz.", "Sie langweilt sich."],
      ["stimmung", "Welche Stimmung hat die Szene?", "unheimlich", "gemütlich", "lustig"],
      ["grund", "Warum hält Lina Jonas am Ärmel fest?", "Weil sie Angst hat, den Weg zu verlieren.", "Weil Jonas gestolpert ist.", "Weil sie ihm etwas zeigen will."],
    ] },
  { gruppe: 1, titel: "Die Überraschung", figuren: ["Mila", "Bruder", "Eltern"],
    text: "Mila kommt von der Schule nach Hause. Im Flur ist es ganz still. Sie öffnet die Küchentür – und zwanzig Luftballons schweben an die Decke. «Überraschung!», rufen ihre Eltern und ihr kleiner Bruder. Mila hatte ihren Geburtstag fast vergessen. Jetzt ist sie so aufgeregt, dass sie nur noch lachen kann. Ihr Bruder hat die Ballons aufgeblasen, weil er ihr eine Freude machen wollte.",
    fragen: [
      ["gefuehl", "Wie fühlt sich Mila, als sie die Ballons sieht?", "aufgeregt und froh", "traurig", "wütend"],
      ["stimmung", "Welche Stimmung hat die Szene?", "lustig", "unheimlich", "traurig"],
      ["grund", "Warum hat der Bruder die Ballons aufgeblasen?", "Weil er Mila eine Freude machen wollte.", "Weil er sie an die Decke kleben wollte.", "Weil die Eltern es ihm befohlen haben."],
    ] },
  { gruppe: 1, titel: "Der Regentag", figuren: ["Ben", "Grossmutter"],
    text: "Draussen regnet es seit dem Morgen. Ben und seine Grossmutter sitzen in der Küche. Auf dem Herd köchelt eine Suppe, und es riecht nach Zimt. Die Grossmutter holt das alte Fotoalbum, weil Ben wissen will, wie sie als Kind ausgesehen hat. Ben kuschelt sich an sie. Er ist zufrieden und möchte, dass der Regen noch lange bleibt.",
    fragen: [
      ["gefuehl", "Wie fühlt sich Ben?", "zufrieden", "nervös", "enttäuscht"],
      ["stimmung", "Welche Stimmung hat die Szene?", "gemütlich", "spannend", "unheimlich"],
      ["grund", "Warum holt die Grossmutter das Fotoalbum?", "Weil Ben wissen will, wie sie als Kind ausgesehen hat.", "Weil sie die Fotos verkaufen will.", "Weil der Regen das Album nass gemacht hat."],
    ] },
  { gruppe: 1, titel: "Das Diktat", figuren: ["Tarik", "Frau Roth"],
    text: "Am Freitag gibt Frau Roth die Diktate zurück. Tarik hat die ganze Woche geübt. Er bekommt sein Blatt und sieht nur zwei Fehler. Letztes Mal waren es elf. Tarik ist erleichtert und grinst bis zu den Ohren. Er steckt das Blatt sorgfältig in die Mappe, weil er es zu Hause seiner Mutter zeigen will.",
    fragen: [
      ["gefuehl", "Wie fühlt sich Tarik?", "erleichtert", "beschämt", "gelangweilt"],
      ["grund", "Warum steckt Tarik das Blatt sorgfältig in die Mappe?", "Weil er es seiner Mutter zeigen will.", "Weil Frau Roth es morgen wieder einsammelt.", "Weil er die Fehler verstecken will."],
    ] },
  { gruppe: 1, titel: "Der Hund im Garten", figuren: ["Yara", "Vater"],
    text: "Als Yara am Samstag aufwacht, hört sie ein Bellen. Im Garten sitzt ein kleiner brauner Hund mit nassem Fell. Yara kennt ihn nicht. Er hat kein Halsband. Sie holt eine Decke und eine Schüssel Wasser, weil er zittert. Dann ruft sie ihren Vater. Yara ist neugierig: Wem gehört der Hund, und wie ist er in den Garten gekommen?",
    fragen: [
      ["gefuehl", "Wie fühlt sich Yara?", "neugierig", "wütend", "traurig"],
      ["stimmung", "Welche Stimmung hat die Szene?", "spannend", "traurig", "lustig"],
      ["grund", "Warum holt Yara eine Decke?", "Weil der Hund zittert.", "Weil sie selber friert.", "Weil der Vater es gesagt hat."],
    ] },
  { gruppe: 1, titel: "Der verpasste Bus", figuren: ["Leo"],
    text: "Leo rennt die Strasse hinunter. Der Schulbus steht schon an der Haltestelle. Als Leo noch zwanzig Meter entfernt ist, schliessen sich die Türen, und der Bus fährt ab. Leo bleibt stehen und tritt gegen einen Stein. Er ist wütend auf sich selbst, weil er zu lange gefrühstückt hat. Jetzt muss er eine halbe Stunde warten.",
    fragen: [
      ["gefuehl", "Wie fühlt sich Leo?", "wütend", "froh", "stolz"],
      ["grund", "Warum ist Leo wütend auf sich selbst?", "Weil er zu lange gefrühstückt hat.", "Weil der Bus zu früh gefahren ist.", "Weil er den Stein getreten hat."],
    ] },
  { gruppe: 1, titel: "Das Rennen im Schnee", figuren: ["Amira"],
    text: "Im Skilager gibt es am letzten Tag ein Rennen. Amira steht am Start und zittert. Nicht wegen der Kälte – sie ist nervös, weil alle zuschauen. Dann geht das Tor auf. Amira fährt los, Tor um Tor, und kommt ohne Sturz ins Ziel. Sie ist nicht die Schnellste, aber sie lacht laut, weil sie es geschafft hat.",
    fragen: [
      ["gefuehl", "Wie fühlt sich Amira am Start?", "nervös", "gelangweilt", "traurig"],
      ["stimmung", "Welche Stimmung hat die Szene?", "spannend", "gemütlich", "traurig"],
      ["grund", "Warum lacht Amira im Ziel?", "Weil sie es ohne Sturz geschafft hat.", "Weil sie die Schnellste ist.", "Weil jemand einen Witz erzählt."],
    ] },
  { gruppe: 1, titel: "Die Lesenacht", figuren: ["Selin", "Frau Imhof"],
    text: "In der Lesenacht liegen alle in Schlafsäcken im Klassenzimmer. Nur eine Lampe brennt. Frau Imhof liest eine Geschichte von einem Gespenst im Keller vor. Bei jeder Tür, die in der Geschichte knarrt, zieht Selin den Schlafsack höher. Sie gruselt sich – aber es ist ein schönes Gruseln. Am Schluss bittet Selin um noch eine Geschichte, weil sie noch lange nicht schlafen kann.",
    fragen: [
      ["gefuehl", "Wie fühlt sich Selin beim Zuhören?", "Sie gruselt sich.", "Sie langweilt sich.", "Sie ist wütend."],
      ["stimmung", "Welche Stimmung hat die Szene?", "unheimlich", "lustig", "traurig"],
      ["grund", "Warum bittet Selin um noch eine Geschichte?", "Weil sie noch lange nicht schlafen kann.", "Weil die Lampe kaputt ist.", "Weil Frau Imhof es verlangt."],
    ] },
  { gruppe: 1, titel: "Der Zaubertrick", figuren: ["Noah"],
    text: "Beim Klassenfest zeigt Noah einen Zaubertrick. Er steckt ein Tuch in den Hut, klopft dreimal – und zieht eine Gummiente heraus. Alle kichern. Dann rutscht ihm der Hut vom Kopf, und drei weitere Enten purzeln auf den Boden. Jetzt lachen alle, auch Noah. Er verbeugt sich, weil die Pannen am besten ankommen. Noah ist glücklich.",
    fragen: [
      ["gefuehl", "Wie fühlt sich Noah am Ende?", "glücklich", "beschämt", "ängstlich"],
      ["stimmung", "Welche Stimmung hat die Szene?", "lustig", "unheimlich", "traurig"],
      ["grund", "Warum verbeugt sich Noah?", "Weil die Pannen am besten ankommen.", "Weil er den Hut aufheben will.", "Weil die Lehrerin ihn ruft."],
    ] },
  { gruppe: 1, titel: "Das kaputte Velo", figuren: ["Finn", "Luca"],
    text: "Finn wollte am Nachmittag mit Luca zum See fahren. Aber am Mittag sieht er, dass sein Velo einen platten Reifen hat. Finn ist enttäuscht. Er schiebt das Velo in die Garage und setzt sich auf die Treppe. Da kommt Luca mit zwei Velos um die Ecke, weil er das Velo seiner Schwester ausgeliehen hat. Finn springt auf.",
    fragen: [
      ["gefuehl", "Wie fühlt sich Finn, als er den platten Reifen sieht?", "enttäuscht", "stolz", "neugierig"],
      ["grund", "Warum kommt Luca mit zwei Velos?", "Weil er das Velo seiner Schwester ausgeliehen hat.", "Weil er zwei Velos besitzt.", "Weil Finn ihn darum gebeten hat."],
    ] },

  // ---------- Gruppe 2: mittlere Szenen (60–100 Wörter), Motiv, Sicht, Sagen ≠ Meinen ----------
  { gruppe: 2, titel: "Mira schweigt", figuren: ["Mira", "Jonas", "Frau Bucher"],
    text: "Im Deutschunterricht fragt Frau Bucher, wer das Gedicht vortragen möchte. Mira kennt es auswendig. Gestern hat sie es ihrer Katze dreimal vorgesagt, ohne einen Fehler. Jetzt schaut sie auf ihr Pult und sagt nichts. Neben ihr meldet sich Jonas, obwohl er nur die erste Strophe kann. «Mira, du?», fragt Frau Bucher. Mira schüttelt den Kopf. «Ich kann es nicht so gut», murmelt sie. Jonas stösst sie unter dem Tisch leicht an. Er hat sie gestern durch das offene Fenster gehört.",
    fragen: [
      ["motiv", "Warum schweigt Mira, als Frau Bucher fragt?", "Sie traut sich nicht, vor der Klasse zu sprechen.", "Sie kann das Gedicht nicht so gut.", "Sie findet das Gedicht langweilig."],
      ["sicht", "Was denkt Jonas, als Mira den Kopf schüttelt?", "Er weiss, dass Mira das Gedicht kann.", "Er glaubt ihr, dass sie es nicht kann.", "Er ist froh, dass er allein vortragen darf."],
      ["meinen", "Mira sagt: «Ich kann es nicht so gut.» Was ist wirklich los?", "Sie hat Angst, vor allen zu sprechen.", "Sie hat das Gedicht nicht gelernt.", "Sie möchte, dass Jonas vorträgt."],
    ] },
  { gruppe: 2, titel: "Das Geschenk", figuren: ["Lena", "Omar", "Mutter"],
    text: "Zu Lenas Geburtstag bringt Omar ein Päckchen mit. Lena packt es aus: ein Buch über Pferde. Sie hat genau dieses Buch schon zu Weihnachten bekommen. «Oh, danke, super», sagt Lena und legt es schnell auf den Stapel. Omar strahlt. Er hat sein ganzes Taschengeld dafür gebraucht und wusste, dass Lena Pferde liebt. Am Abend fragt Lenas Mutter, ob sie das Buch umtauschen will. «Nein», sagt Lena, «Omar soll es nicht merken.»",
    fragen: [
      ["motiv", "Warum will Lena das Buch nicht umtauschen?", "Sie will Omar nicht enttäuschen.", "Omar soll es nicht merken.", "Sie will das Buch zweimal lesen."],
      ["sicht", "Was denkt Omar, als Lena das Buch auspackt?", "Er glaubt, dass Lena sich sehr freut.", "Er merkt, dass Lena das Buch schon hat.", "Er findet, dass Lena undankbar ist."],
      ["meinen", "Lena sagt: «Oh, danke, super.» Was ist wirklich los?", "Sie hat das Buch schon und tut nur so, als freue sie sich.", "Sie findet das Buch wirklich super.", "Sie mag keine Pferde."],
    ] },
  { gruppe: 2, titel: "Der Platz im Team", figuren: ["Dario", "Nils", "Trainer"],
    text: "Beim Unihockey-Training stellt der Trainer die Mannschaft für das Turnier auf. Dario steht nicht auf der Liste. «Ist mir egal», sagt er laut und lacht, «ich hatte sowieso keine Lust.» Dann packt er seinen Stock ein, ohne jemanden anzuschauen, und geht als Erster in die Garderobe. Sein Freund Nils bleibt noch kurz stehen. Er weiss, dass Dario die letzten drei Wochen jeden Abend im Hof geübt hat. Nils geht ihm nach.",
    fragen: [
      ["motiv", "Warum geht Dario als Erster in die Garderobe?", "Er will nicht zeigen, wie enttäuscht er ist.", "Er hatte sowieso keine Lust.", "Er muss früh nach Hause."],
      ["sicht", "Was denkt Nils?", "Er weiss, dass Dario sehr enttäuscht ist.", "Er glaubt, dass es Dario wirklich egal ist.", "Er findet, dass Dario zu wenig geübt hat."],
      ["meinen", "Dario sagt: «Ist mir egal.» Was meint er wirklich?", "Es ist ihm sehr wichtig, und es tut weh.", "Es ist ihm wirklich egal.", "Er freut sich, dass er frei hat."],
    ] },
  { gruppe: 2, titel: "Die Hausaufgaben", figuren: ["Sofia", "Elia"],
    text: "Sofia sitzt mit ihrem kleinen Bruder Elia am Küchentisch. Elia soll zehn Rechnungen lösen, aber er kommt nicht weiter und schiebt das Heft weg. «Soll ich sie dir vorsagen?», fragt Sofia. Elia nickt. Sofia nimmt den Stift, hält dann aber inne. Stattdessen malt sie zehn Punkte auf ein Blatt und fragt: «Wie viele sind es, wenn drei weggehen?» Elia stöhnt. «Du bist gemein!» Zehn Minuten später hat er alle Rechnungen selbst gelöst und zeigt stolz das Heft.",
    fragen: [
      ["motiv", "Warum sagt Sofia die Lösungen nicht vor?", "Elia soll die Rechnungen selbst verstehen.", "Sie malt lieber Punkte.", "Sie kann die Rechnungen selbst nicht lösen."],
      ["sicht", "Was denkt Elia, als Sofia die Punkte malt?", "Er findet, dass Sofia ihm nicht helfen will.", "Er merkt sofort, dass Sofia ihm richtig hilft.", "Er denkt, dass Sofia mit ihm spielen will."],
      ["meinen", "Elia sagt: «Du bist gemein!» Was zeigt die Szene am Ende?", "Sofia war nicht gemein, sondern hat ihm richtig geholfen.", "Sofia war wirklich gemein zu ihm.", "Elia hat die Rechnungen nicht lösen können."],
    ] },
  { gruppe: 2, titel: "Der Umweg", figuren: ["Aylin", "Ruben"],
    text: "Jeden Morgen geht Aylin mit Ruben zur Schule. Seit einer Woche nimmt Ruben einen Umweg über die Bahnhofstrasse, obwohl der Weg zehn Minuten länger ist. Aylin ärgert sich. «Warum gehen wir nicht am Park vorbei?», fragt sie. «Ist schöner so», sagt Ruben und schaut weg. Aylin weiss, dass die Bahnhofstrasse laut und grau ist. Am Park wohnt seit Kurzem ein grosser Hund, der am Zaun bellt. Ruben hat ihr einmal erzählt, dass ihn als kleines Kind ein Hund gebissen hat.",
    fragen: [
      ["motiv", "Warum nimmt Ruben den Umweg?", "Er hat Angst vor dem Hund am Park.", "Er findet die Bahnhofstrasse schöner.", "Er will später in die Schule kommen."],
      ["sicht", "Was weiss Aylin am Ende der Szene?", "Sie ahnt, dass Ruben dem Hund ausweichen will.", "Sie glaubt, dass Ruben die Bahnhofstrasse wirklich schöner findet.", "Sie denkt, dass Ruben sie ärgern will."],
      ["meinen", "Ruben sagt: «Ist schöner so.» Was meint er wirklich?", "Er will nicht sagen, dass er sich vor dem Hund fürchtet.", "Er findet die Strasse wirklich schöner.", "Er will Aylin eine Freude machen."],
    ] },
  { gruppe: 2, titel: "Das Lagerfeuer", figuren: ["Tim", "Mara"],
    text: "Am letzten Abend im Lager sitzen alle am Feuer. Jede Gruppe soll etwas vorführen. Tims Gruppe hat ein Lied vorbereitet, aber Tim hat seit dem Nachmittag Halsweh und kann kaum sprechen. Als seine Gruppe an der Reihe ist, steht Tim auf, nimmt die Gitarre und spielt. Singen tun die anderen. Nachher sagt Mara: «Du hättest auch einfach zuschauen können.» Tim zuckt mit den Schultern. «Ihr habt so lange geübt», krächzt er.",
    fragen: [
      ["motiv", "Warum spielt Tim trotz Halsweh mit?", "Er will seine Gruppe nicht im Stich lassen.", "Mit Halsweh kann man noch Gitarre spielen.", "Er will allein im Mittelpunkt stehen."],
      ["sicht", "Was denkt Mara?", "Sie macht sich Sorgen um Tim.", "Sie ärgert sich, dass Tim nicht gesungen hat.", "Sie findet, dass Tim schlecht gespielt hat."],
    ] },
  { gruppe: 2, titel: "Die Einladung", figuren: ["Jana", "Kim", "Noemi"],
    text: "Jana hat am Samstag Geburtstag und darf fünf Kinder einladen. Sie schreibt die Karten am Küchentisch. Bei der fünften Karte hält sie an. Noemi oder Kim? Kim ist lustig und hat Jana letzte Woche ihre Stifte geliehen. Noemi ist neu in der Klasse und steht in der Pause meistens allein am Zaun. Jana schreibt «Noemi» auf die Karte. Als Kim davon hört, sagt sie: «Macht nichts, ich habe am Samstag sowieso Training.» Jana sieht, wie Kim dabei auf ihre Schuhe schaut.",
    fragen: [
      ["motiv", "Warum lädt Jana Noemi ein und nicht Kim?", "Sie möchte, dass Noemi nicht mehr allein ist.", "Noemi steht in der Pause am Zaun.", "Sie ist auf Kim wütend."],
      ["sicht", "Was denkt Kim wirklich?", "Sie ist enttäuscht, dass sie nicht eingeladen ist.", "Sie ist froh, weil sie wirklich Training hat.", "Sie ist auf Noemi wütend."],
      ["meinen", "Kim sagt: «Macht nichts.» Was meint sie?", "Es macht ihr etwas aus, sie will es nur nicht zeigen.", "Es macht ihr wirklich nichts aus.", "Sie will Jana trösten."],
    ] },
  { gruppe: 2, titel: "Das Bild", figuren: ["Lukas", "Enzo", "Herr Gerber"],
    text: "Im Zeichenunterricht hängt Herr Gerber die Bilder an die Wand. Lukas hat eine Woche an seinem Bild gearbeitet: ein Drache über dem Bodensee. Enzo schaut es an und sagt: «Sieht aus wie ein Krokodil mit Flügeln.» Ein paar Kinder lachen. Lukas lacht mit, ein bisschen zu laut. In der Pause bleibt er im Zimmer und schaut sein Bild lange an. Enzo kommt zurück. «Ehrlich, der Drache ist cool», sagt er. «Ich wollte nur lustig sein.»",
    fragen: [
      ["motiv", "Warum lacht Lukas mit?", "Er will nicht zeigen, dass ihn der Spruch verletzt hat.", "Er findet den Spruch wirklich lustig.", "Er lacht über Enzos Bild."],
      ["sicht", "Was denkt Enzo, als er zurückkommt?", "Ihm tut leid, was er gesagt hat.", "Er will noch einen Witz machen.", "Er findet das Bild immer noch schlecht."],
      ["meinen", "Lukas lacht «ein bisschen zu laut». Was zeigt das?", "Sein Lachen ist nicht echt; der Spruch hat ihn getroffen.", "Er findet die Situation sehr lustig.", "Er will Enzo nachmachen."],
    ] },
  { gruppe: 2, titel: "Das Velorennen", figuren: ["Nico", "Lia"],
    text: "Am Sonntag ist das Velorennen im Quartier. Nico und seine Schwester Lia starten in der gleichen Gruppe. Nico ist schneller, das wissen beide. Auf der letzten Runde liegt er vorne. Er schaut zurück: Lia strampelt mit rotem Kopf hinter ihm. Kurz vor dem Ziel wird Nico langsamer, bis Lia neben ihm ist. Sie fahren zusammen über die Linie. «Mein Bein hat gezwickt», sagt Nico. Lia grinst. Sie kennt ihren Bruder.",
    fragen: [
      ["motiv", "Warum wird Nico langsamer?", "Er will mit Lia zusammen ankommen.", "Sein Bein hat gezwickt.", "Er hat vergessen, wo das Ziel ist."],
      ["sicht", "Was denkt Lia?", "Sie weiss, dass Nico absichtlich gewartet hat.", "Sie glaubt, dass Nicos Bein wirklich weh tut.", "Sie ärgert sich, dass Nico vorne lag."],
      ["meinen", "Nico sagt: «Mein Bein hat gezwickt.» Was stimmt?", "Er sucht eine Ausrede, damit Lia nicht merkt, dass er gewartet hat.", "Sein Bein tut wirklich weh.", "Er will das Rennen abbrechen."],
    ] },
  { gruppe: 2, titel: "Der Zettel", figuren: ["Samuel", "Zoe", "Frau Steiner"],
    text: "Nach der Mathestunde findet Frau Steiner einen Zettel unter Samuels Pult: eine Zeichnung von ihr mit riesiger Nase. Sie hält ihn hoch. «Wer war das?» Niemand sagt etwas. Samuel wird rot. Da steht Zoe auf. «Ich war es», sagt sie. Samuel starrt sie an – Zoe war in der Stunde gar nicht da, sie kam erst nach der Pause. Frau Steiner schaut Zoe lange an und legt den Zettel weg. «Wir reden nachher», sagt sie, und ihre Stimme ist nicht böse.",
    fragen: [
      ["motiv", "Warum sagt Zoe, sie sei es gewesen?", "Sie will Samuel schützen.", "Weil sie den Zettel gezeichnet hat.", "Sie will, dass alle über sie lachen."],
      ["sicht", "Was weiss Frau Steiner wahrscheinlich?", "Dass Zoe es nicht gewesen sein kann.", "Dass Zoe den Zettel gezeichnet hat.", "Dass es niemand aus der Klasse war."],
      ["meinen", "Zoe sagt: «Ich war es.» Was stimmt?", "Das stimmt nicht – sie war gar nicht in der Stunde.", "Sie hat den Zettel wirklich gezeichnet.", "Sie hat den Zettel gefunden."],
    ] },
  { gruppe: 2, titel: "Die Pausenbank", figuren: ["Emma", "Yusuf", "Ida"],
    text: "Seit die neue Bank im Pausenhof steht, sitzen Emma und Yusuf jeden Tag darauf. Heute sitzt dort Ida aus der Parallelklasse, allein, mit einem Buch. Yusuf will sie wegschicken: «Das ist unsere Bank.» Emma hält ihn zurück. Sie setzt sich neben Ida und fragt, was sie liest. Ida antwortet erst leise, dann immer schneller. Nach der Pause sagt Yusuf: «War ja langweilig.» Am nächsten Tag ist er als Erster bei der Bank – und rückt zur Seite, als Ida kommt.",
    fragen: [
      ["motiv", "Warum setzt sich Emma neben Ida?", "Sie will Ida kennenlernen, statt sie wegzuschicken.", "Weil die Bank gross genug ist.", "Weil sie Yusuf ärgern will."],
      ["sicht", "Was denkt Ida, als Emma sie anspricht?", "Sie freut sich, dass jemand mit ihr redet.", "Sie ärgert sich über die Störung.", "Sie hat Angst vor Emma."],
      ["meinen", "Yusuf sagt: «War ja langweilig.» Was zeigt der nächste Tag?", "Es war ihm nicht langweilig, er mag Ida inzwischen.", "Es war wirklich langweilig für ihn.", "Er will die Bank für sich allein."],
    ] },
  { gruppe: 2, titel: "Das Referat", figuren: ["Alina", "Tobias"],
    text: "Alina und Tobias halten zusammen ein Referat über Wölfe. Alina hat alle Plakate gemacht, Tobias hat nur die Bilder gesucht. Vor der Klasse bleibt Tobias plötzlich stecken. Er weiss nicht mehr, was auf dem zweiten Plakat steht. Alina könnte jetzt einfach weiterreden. Stattdessen zeigt sie auf das Bild und fragt: «Tobias, war das der Wolf aus dem Tessin?» Tobias nickt und findet den Faden wieder. Nach dem Referat sagt Tobias: «Ich hätte es auch allein geschafft.» Alina lächelt nur.",
    fragen: [
      ["motiv", "Warum stellt Alina Tobias die Frage?", "Sie hilft ihm, ohne dass es die Klasse merkt.", "Sie will wissen, ob der Wolf aus dem Tessin war.", "Sie will zeigen, dass Tobias nichts gelernt hat."],
      ["sicht", "Was denkt Tobias, als Alina die Frage stellt?", "Er merkt, dass sie ihm hilft, und ist erleichtert.", "Er ärgert sich, weil sie ihn unterbricht.", "Er versteht die Frage nicht."],
      ["meinen", "Tobias sagt: «Ich hätte es auch allein geschafft.» Was meint er?", "Er will nicht zugeben, dass er Hilfe gebraucht hat.", "Er hätte es wirklich allein geschafft.", "Er will Alina loben."],
    ] },

  // ---------- Gruppe 3: längere Szenen (80–120 Wörter), Motiv aus Andeutungen, Lebenswelt, Fortsetzung, Ich ----------
  { gruppe: 3, titel: "Der Helikopter", figuren: ["Rafael", "Leon"],
    text: "Rafael erzählt in der Pause, dass er am Wochenende mit seinem Onkel in einem Helikopter geflogen sei, über das Matterhorn, bei Sonnenaufgang. Letzte Woche war es ein Haifisch im Zürichsee. Die anderen nicken und wechseln das Thema. Nur Leon fragt nach: «Welche Farbe hatte der Helikopter?» Rafael überlegt kurz. «Rot. Nein, blau.» Nach der Schule geht Leon ein Stück mit ihm. Rafael erzählt nichts mehr von Helikoptern. Er sagt, dass sein Onkel am Wochenende gar nicht gekommen ist, obwohl er es versprochen hatte. Leon sagt nichts, aber er lädt Rafael zum Fussball am Sonntag ein.",
    fragen: [
      ["motiv", "Warum erzählt Rafael solche Geschichten?", "Er möchte, dass die anderen ihn beachten und bewundern.", "Er ist wirklich mit dem Helikopter geflogen.", "Er will Leon ärgern."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Jemand prahlt mit Dingen, die nicht stimmen, weil er dazugehören will.", "Jemand verliert sein Pausenbrot.", "Jemand gewinnt einen Preis und zeigt ihn allen."],
      ["weiter", "Was tut Rafael wohl als Nächstes?", "Er kommt am Sonntag zum Fussball.", "Er erzählt Leon von einem Flug zum Mond.", "Er geht nie mehr in die Schule."],
      ["ich", "Was würdest du an Leons Stelle fühlen, als Rafael von seinem Onkel erzählt?", "Mitgefühl – jetzt verstehe ich, warum er so angibt.", "Stolz, weil ich ihn ertappt habe.", "Angst vor dem Onkel."],
    ] },
  { gruppe: 3, titel: "Die Wette", figuren: ["Malik", "Juri"],
    text: "«Wetten, dass du nicht vom Dreimeterbrett springst?», sagt Juri zu Malik im Schwimmbad. Malik schaut hinauf. Das Brett wirkt höher als im letzten Sommer. «Klar spring ich», sagt er und geht zur Leiter. Oben bleibt er stehen. Unten ruft Juri: «Na los!» Malik schaut nach unten, dann zu den Kleinen im Planschbecken. «Ich habe Hunger», ruft er, «ich springe nachher.» Er klettert wieder hinunter und holt sich Pommes. Juri grinst. Beim Umziehen sagt Malik leise: «Nächsten Sommer.» Juri legt ihm den Arm um die Schulter. «Ich bin auch erst mit zwölf gesprungen.»",
    fragen: [
      ["motiv", "Warum holt sich Malik Pommes?", "Er sucht eine Ausrede, weil er sich nicht traut zu springen.", "Er hat wirklich grossen Hunger.", "Er will Juri die Pommes abgeben."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Du sagst «keine Lust», weil du dich vor etwas fürchtest.", "Du teilst dein Essen mit einem Freund.", "Du gewinnst eine Wette."],
      ["weiter", "Was tut Juri wohl als Nächstes?", "Er lässt die Wette sein und redet nicht mehr darüber.", "Er erzählt allen, dass Malik ein Feigling ist.", "Er zwingt Malik, sofort zu springen."],
      ["ich", "Was würdest du an Maliks Stelle oben auf dem Brett fühlen?", "Angst – und Scham, weil alle zuschauen.", "Hunger.", "Stolz, weil ich gewonnen habe."],
    ] },
  { gruppe: 3, titel: "Die Bestnote", figuren: ["Chiara", "Paula"],
    text: "Die Klasse bekommt die Prüfung zurück. Chiara hat eine 6. Sie dreht das Blatt sofort um und legt das Etui darauf. Als Paula fragt, winkt sie ab: «Ging so.» In der Pause sucht Chiara Paula, die mit rotem Gesicht am Fenster steht. Paula hat eine 3.5. «Ich habe nur Glück gehabt», sagt Chiara, «die Hälfte habe ich geraten.» Das stimmt nicht; Chiara hat zwei Wochen gelernt. «Willst du nächstes Mal mit mir lernen?», fragt sie. Paula schaut auf. «Du hast doch gar nicht gelernt.» Chiara zögert. «Doch», sagt sie dann. «Ziemlich viel sogar.»",
    fragen: [
      ["motiv", "Warum sagt Chiara, sie habe nur geraten?", "Sie will nicht, dass Paula sich noch schlechter fühlt.", "Sie hat die Hälfte wirklich geraten.", "Sie schämt sich für die gute Note."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Du spielst deinen Erfolg herunter, damit sich jemand nicht schlecht fühlt.", "Du gibst mit einer guten Note an.", "Du schreibst bei jemandem ab."],
      ["weiter", "Was tun die beiden wohl als Nächstes?", "Sie verabreden sich zum Lernen.", "Paula redet nie wieder mit Chiara.", "Chiara zerreisst ihre Prüfung."],
      ["ich", "Was würdest du an Paulas Stelle fühlen, als Chiara die Wahrheit sagt?", "Erleichtert – sie ist ehrlich und will mir helfen.", "Stolz auf meine eigene Note.", "Langeweile, weil Lernen nichts bringt."],
    ] },
  { gruppe: 3, titel: "Der Schlüssel", figuren: ["Benjamin", "Fabio"],
    text: "Nach dem Turnen fehlt Benjamins Schlüssel. Er sucht in der Garderobe, im Turnsack, unter der Bank. Nichts. Fabio hilft ihm suchen, besonders eifrig. Er schaut unter alle Bänke, nur nicht unter seine eigene. «Vielleicht hast du ihn zu Hause vergessen», sagt Fabio. Benjamin weiss, dass er ihn am Morgen in der Hand hatte. Als Fabio seine Jacke anzieht, klirrt etwas in der Tasche. Fabio wird rot. «Oh», sagt er, «der muss aus Versehen …» Benjamin nimmt den Schlüssel. Er sagt lange nichts. Dann sagt er: «Nächstes Mal fragst du einfach, wenn du einen Spass machen willst.»",
    fragen: [
      ["motiv", "Warum sucht Fabio «besonders eifrig»?", "Er will nicht auffallen, weil er den Schlüssel selbst hat.", "Er will Benjamin wirklich helfen.", "Er hat seinen eigenen Schlüssel verloren."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Jemand versteckt etwas aus Spass, und der Spass geht zu weit.", "Jemand findet einen Schlüssel auf der Strasse.", "Jemand hilft einem Freund beim Umzug."],
      ["weiter", "Was tut Fabio wohl als Nächstes?", "Er entschuldigt sich bei Benjamin.", "Er versteckt den Schlüssel noch einmal.", "Er beschuldigt Benjamin."],
      ["ich", "Was würdest du an Benjamins Stelle fühlen, als es in der Jacke klirrt?", "Enttäuscht, weil ein Freund mich an der Nase herumgeführt hat.", "Froh, weil Fabio so eifrig geholfen hat.", "Stolz auf meine neue Jacke."],
    ] },
  { gruppe: 3, titel: "Der geheime Fan", figuren: ["Elina", "Lou", "Nael"],
    text: "Ein Zettel liegt in Elinas Fach: «Du bist die Beste! Dein geheimer Fan.» Elina lacht und zeigt ihn Lou. Lou lacht nicht. «Weisst du, von wem der ist?», fragt sie. Elina zuckt mit den Schultern. Am nächsten Tag liegt wieder einer da: «Dein Vortrag war toll.» Diesmal zeigt Elina ihn nicht herum. Lou beobachtet, wie Elina nach dem Lesen zu Nael hinüberschaut, der sofort auf sein Heft starrt. Nael hat in der Klasse noch nie mit Elina gesprochen. Am Freitag setzt sich Elina in der Bibliothek an seinen Tisch. «Mein Vortrag war nicht so toll», sagt sie. «Aber danke.»",
    fragen: [
      ["motiv", "Warum setzt sich Elina zu Nael?", "Sie hat erraten, dass die Zettel von ihm sind, und will mit ihm reden.", "Weil in der Bibliothek kein anderer Platz frei ist.", "Sie will ihn wegen der Zettel ausschimpfen."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Jemand traut sich nicht, direkt mit dir zu reden, und zeigt es anders.", "Jemand verliert einen Zettel.", "Jemand hält einen Vortrag über Fans."],
      ["weiter", "Was tut Nael wohl als Nächstes?", "Er redet zum ersten Mal mit Elina.", "Er rennt aus der Bibliothek.", "Er schreibt Lou einen Zettel."],
      ["ich", "Was würdest du an Naels Stelle fühlen, als Elina sich an den Tisch setzt?", "Aufgeregt und ein bisschen ertappt.", "Gelangweilt.", "Wütend auf Elina."],
    ] },
  { gruppe: 3, titel: "Das Lager-Tagebuch", figuren: ["Noemi", "Till", "Herr Vogt"],
    text: "Im Lager wird jeden Abend das Tagebuch vorgelesen. Heute hat Noemi es geschrieben. Sie liest vor: «Das Mittagessen war ein Traum. Die Suppe hatte nur drei Klumpen, und das Brot war erst zwei Tage alt.» Alle lachen, auch der Koch Herr Vogt. Nur Till versteht es nicht: «Wieso ein Traum? Die Suppe war grusig.» Noemi liest weiter: «Herr Vogt ist der grösste Künstler der Küche, vor allem beim Verbrennen.» Herr Vogt verbeugt sich. Am Abend steht ein Teller Guetzli auf dem Tisch, mit einem Zettel: «Für die Kritiker. Nicht verbrannt.»",
    fragen: [
      ["meinen", "Noemi schreibt: «Das Mittagessen war ein Traum.» Was meint sie?", "Das Gegenteil – das Essen war schlecht, und sie macht sich darüber lustig.", "Das Essen war wirklich sehr gut.", "Sie hat vom Essen geträumt."],
      ["motiv", "Warum verbeugt sich Herr Vogt?", "Er nimmt den Spass mit Humor und spielt mit.", "Er freut sich über das Lob.", "Er will, dass alle still sind."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Jemand sagt «super» in einem Ton, der das Gegenteil meint, und alle lachen.", "Jemand kocht eine Suppe für die Familie.", "Jemand schreibt einen Brief an den Koch."],
      ["weiter", "Was tut Till wohl als Nächstes?", "Er fragt, warum alle lachen – und versteht den Witz.", "Er geht zum Koch und beschwert sich über die Suppe.", "Er isst alle Guetzli allein."],
      ["ich", "Was würdest du an Herrn Vogts Stelle fühlen, als Noemi vorliest?", "Ich würde mitlachen – die Kinder meinen es nicht böse.", "Ich würde die Kinder bestrafen.", "Ich wäre stolz auf meine Suppe."],
    ] },
  { gruppe: 3, titel: "Die Abstimmung", figuren: ["Jonas", "Lea", "Levin"],
    text: "Die Klasse stimmt ab, wohin die Schulreise geht: Zoo oder Kletterpark. Vor der Abstimmung sagt Jonas laut: «Zoo ist für Babys.» Mehrere lachen. Dann wird abgestimmt. Lea sieht, wie Jonas beim Zoo nur ganz kurz die Hand hebt und sie gleich wieder senkt, als sein Freund Levin ihn anschaut. Der Kletterpark gewinnt mit einer Stimme. Auf dem Heimweg sagt Jonas zu Lea: «Mir doch egal, wohin.» Lea weiss, dass Jonas seit Jahren Pate eines Pinguins im Zoo ist. Er erzählt sonst jedem davon. Nur Levin nicht.",
    fragen: [
      ["motiv", "Warum zieht Jonas seine Hand beim Zoo wieder zurück?", "Er will vor Levin nicht als uncool dastehen.", "Er findet den Zoo wirklich nur für Babys.", "Er hat sich beim Abstimmen geirrt."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Du tust so, als magst du etwas nicht, weil ein Freund es uncool findet.", "Du stimmst für das, was du wirklich willst.", "Du besuchst den Zoo mit der Familie."],
      ["weiter", "Was tut Lea wohl als Nächstes?", "Sie sagt Jonas, dass er zu seinem Pinguin stehen darf.", "Sie erzählt Levin vom Pinguin, um Jonas zu blamieren.", "Sie verlangt, dass noch einmal abgestimmt wird."],
      ["ich", "Was würdest du an Jonas' Stelle nach der Abstimmung fühlen?", "Ärger auf mich selbst, weil ich nicht zu mir gestanden habe.", "Freude, dass der Kletterpark gewonnen hat.", "Stolz, weil ich so laut war."],
    ] },
  { gruppe: 3, titel: "Nochmal", figuren: ["Ayla", "Frau Caduff", "Rosa", "Sara"],
    text: "Beim Schwimmtraining ist Frau Caduff streng. Heute lässt sie Ayla zehnmal die Wende üben, während die anderen schon spielen dürfen. «Nochmal», sagt sie jedes Mal, ohne zu lächeln. Ayla schluckt die Tränen hinunter. Beim elften Mal klappt die Wende. «Gut», sagt Frau Caduff nur, dreht sich um und geht. In der Garderobe sagt Ayla zu Rosa: «Sie mag mich nicht.» Rosa überlegt. «Weisst du, bei wem sie so streng ist?», fragt sie. «Bei Sara, die im Sommer an die Schweizermeisterschaft geht. Bei mir sagt sie nie nochmal.»",
    fragen: [
      ["motiv", "Warum ist Frau Caduff mit Ayla so streng?", "Sie traut Ayla viel zu und will sie weiterbringen.", "Sie mag Ayla nicht.", "Sie will, dass Ayla mit dem Schwimmen aufhört."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Jemand verlangt viel von dir, weil er an dich glaubt.", "Jemand lässt dich in Ruhe, weil es ihm egal ist.", "Jemand lobt dich für alles, was du tust."],
      ["weiter", "Was tut Ayla wohl als Nächstes?", "Sie sieht die Strenge anders und übt weiter.", "Sie hört mit dem Schwimmen auf.", "Sie beschwert sich bei Sara."],
      ["ich", "Was würdest du an Aylas Stelle nach Rosas Worten fühlen?", "Überrascht und ein bisschen stolz.", "Wütend auf Rosa.", "Gelangweilt."],
    ] },
  { gruppe: 3, titel: "Die Pralinen", figuren: ["Lio", "Opa Walter", "Mutter"],
    text: "Jede Woche bringt Opa Walter eine Schachtel Pralinen. Jedes Mal sagt Lio: «Danke, Opa!», und jedes Mal landen sie bei seiner Mutter, denn Lio mag keine Pralinen. Das hat er Opa nie gesagt. Heute kommt Opa mit zwei Schachteln. «Weil du sie so gern hast», sagt er und strahlt. Lio schaut seine Mutter an. «Opa», sagt er langsam, «eigentlich esse ich lieber Nüsse.» Opas Lächeln verschwindet kurz. Dann lacht er. «Und ich bringe dir seit zwei Jahren Pralinen! Warum sagst du nichts?» Lio zuckt mit den Schultern. «Ich wollte dich nicht traurig machen.» «Jetzt weiss ich endlich etwas über dich», sagt Opa.",
    fragen: [
      ["motiv", "Warum hat Lio Opa nie die Wahrheit gesagt?", "Er wollte Opa nicht enttäuschen.", "Er wollte die Pralinen für seine Mutter.", "Er hatte Angst vor Opa."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Du sagst nicht, was du wirklich magst, um niemanden zu verletzen.", "Du tauschst ein Geschenk im Laden um.", "Du bekommst jede Woche Taschengeld."],
      ["weiter", "Was bringt Opa wohl nächste Woche?", "Nüsse.", "Drei Schachteln Pralinen.", "Gar nichts mehr, weil er beleidigt ist."],
      ["ich", "Was würdest du an Lios Stelle fühlen, als Opa lacht?", "Erleichtert – die Wahrheit war nicht so schlimm.", "Beleidigt, weil Opa lacht.", "Traurig, weil die Pralinen weg sind."],
    ] },
  { gruppe: 3, titel: "Der Zahnarzt", figuren: ["Sina", "Mael"],
    text: "Sina und Mael wollten am Mittwoch zusammen das Baumhaus fertig bauen. Am Dienstagabend schreibt Mael: «Kann morgen nicht, muss zum Zahnarzt.» Am Mittwoch sieht Sina ihn vom Bus aus – auf dem Fussballplatz, mit Kindern aus der Parallelklasse. Am Donnerstag erzählt Mael, der Zahnarzt sei schrecklich gewesen. Sina sagt: «Ich habe dich gestern gesehen.» Mael wird rot. «Die haben mich gefragt, und ich wollte nicht Nein sagen. Und dir wollte ich nicht absagen.» «Hast du aber», sagt Sina. Mael schaut auf den Boden. «Samstag, Baumhaus?», fragt er. Sina lässt ihn warten. «Samstag», sagt sie dann. «Aber ohne Zahnarzt.»",
    fragen: [
      ["motiv", "Warum hat Mael den Zahnarzt erfunden?", "Er wollte niemanden enttäuschen und fand keinen anderen Ausweg.", "Er hatte wirklich einen Termin beim Zahnarzt.", "Er wollte Sina loswerden."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Du erfindest eine Ausrede, statt ehrlich abzusagen.", "Du gehst zum Zahnarzt.", "Du baust ein Baumhaus allein."],
      ["weiter", "Was tun die beiden wohl am Samstag?", "Sie bauen das Baumhaus zusammen weiter.", "Sie gehen zusammen zum Zahnarzt.", "Sie reden nie wieder miteinander."],
      ["ich", "Was würdest du an Sinas Stelle fühlen, als du Mael auf dem Fussballplatz siehst?", "Enttäuscht und verletzt, weil er mich angelogen hat.", "Froh, dass sein Zahn gesund ist.", "Neidisch auf das Baumhaus."],
    ] },
  { gruppe: 3, titel: "Die Ersatzspielerin", figuren: ["Elin", "Beat", "Kaya", "Zoé"],
    text: "Beim Handballturnier sitzt Elin auf der Bank. Sie ist die Neue im Team und hat noch keine Minute gespielt. In der zweiten Halbzeit verletzt sich Kaya am Fuss. Trainer Beat schaut die Bank entlang. «Elin, du gehst rein.» Elin steht auf, sagt aber: «Nimm lieber Zoé, die kennt die Spielzüge.» Zoé hat heute schon dreimal den Ball verloren. Beat schüttelt den Kopf. «Ich habe dich gefragt.» Elin geht aufs Feld. Sie macht einen Fehler, dann noch einen – und dann ein Tor. Nach dem Spiel sagt Kaya: «Du wolltest nur nicht, dass es an dir liegt, wenn wir verlieren.» Elin wird rot. «Vielleicht», sagt sie.",
    fragen: [
      ["motiv", "Warum will Elin, dass Zoé spielt?", "Sie hat Angst, am Verlieren schuld zu sein.", "Zoé kennt die Spielzüge wirklich besser.", "Sie hat keine Lust zu spielen."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Du lehnst eine Chance ab, weil du Angst hast, Fehler zu machen.", "Du wirst beim Sport verletzt.", "Du schiesst ein Tor und feierst."],
      ["weiter", "Was tut Elin wohl beim nächsten Spiel?", "Sie sagt Ja, wenn der Trainer sie ruft.", "Sie bleibt zu Hause.", "Sie verlangt, dass Zoé auf die Bank muss."],
      ["ich", "Was würdest du an Elins Stelle fühlen, als Beat sagt: «Ich habe dich gefragt»?", "Nervös – aber auch, dass er mir etwas zutraut.", "Wütend, weil er Zoé nicht nimmt.", "Gelangweilt."],
    ] },
  { gruppe: 3, titel: "Der Zopf", figuren: ["Dilan", "Herr Marti", "Mia"],
    text: "Für die Schulreise fehlen der Klasse noch hundert Franken. Herr Marti schlägt einen Kuchenverkauf vor. «Ich backe nicht», sagt Dilan sofort, «Backen ist langweilig.» Die anderen teilen sich die Kuchen auf. Am Verkaufstag bringt Dilan nichts mit – aber er steht drei Stunden am Stand, spricht jeden Passanten an und verkauft am Ende auch das letzte Stück. Als Herr Marti die Kasse zählt, sind es hundertzwanzig Franken. «Wer hat den Zopf gebracht?», fragt Mia. Niemand meldet sich. Dilans Grossmutter backt den besten Zopf im Dorf. Dilan schaut aus dem Fenster und pfeift.",
    fragen: [
      ["motiv", "Warum meldet sich Dilan beim Zopf nicht?", "Er will nicht zugeben, dass er doch mitgeholfen hat – das passt nicht zu seinem Spruch.", "Er hat den Zopf nicht gebracht.", "Er hat den Zopf selbst gegessen."],
      ["lebenswelt", "Welche Situation aus dem Alltag passt am ehesten dazu?", "Jemand tut cool und hilft dann heimlich doch.", "Jemand kauft Kuchen auf dem Markt.", "Jemand backt für die Familie einen Zopf."],
      ["weiter", "Was tut Mia wohl als Nächstes?", "Sie ahnt, von wem der Zopf ist, und lächelt Dilan an.", "Sie wirft den Zopf weg.", "Sie beschuldigt Herrn Marti."],
      ["ich", "Was würdest du an Dilans Stelle fühlen, als Mia fragt?", "Ein bisschen ertappt – und stolz, dass der Zopf allen geschmeckt hat.", "Wütend, weil niemand meinen Kuchen will.", "Traurig, weil die Schulreise ausfällt."],
    ] },
];
