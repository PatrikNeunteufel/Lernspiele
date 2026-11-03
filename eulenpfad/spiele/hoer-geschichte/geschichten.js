/* Geschichten für die Hör-Geschichte — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan D.1.B.1 (Hörverstehen). Annahme (Spielidee, nicht am Lehrplan belegt): Buchstabe d =
   globales Hörverständnis in kurzen erzählten Geschichten — Figuren (Wer?), Ort (Wo?), Ereignis
   (Was passiert?) und Reihenfolge; dazu in den oberen Stufen naheliegende Schlüsse (schluss),
   ein passender Titel und eine passende Fortsetzung. Die Buchstaben-Zuordnung der Stufen steht
   im Kopfkommentar von index.html und ist eine Annahme.
   Alle Geschichten selbst geschrieben, keine Zitate; Kindernamen frei erfunden; Schweizer Alltag
   (Pausenplatz, Wald, Bauernhof, Bahnhof, Hallenbad, Lager), nichts Beängstigendes.
   Zahlen und Uhrzeiten so geschrieben, wie man sie spricht („halb drei“, „9 Uhr 20“), damit Stimme
   und Knöpfe gleich lauten. Schweizer Schreibweise (ss statt ß).

   Schreibweise je Eintrag: { gruppe, titel, text, fragen: [[art, Frage, richtig, falsch, falsch], …] }
   gruppe: 1 sehr kurze Geschichten, drei Sätze, 25–40 Wörter (Stufe 1);
           2 kurze Geschichten, 40–70 Wörter (Stufe 2–4);
           3 längere Geschichten, 60–90 Wörter (Stufe 5–6).
   art:    wer, wo, was — steht so in der Geschichte; warum — Grund, steht in der Geschichte
           (weil, darum, damit);
           reihenfolge — richtig ist eine Liste von drei Ereignissen in der Reihenfolge der
           Geschichte, keine falschen Antworten (das Spiel mischt die drei Teile);
           schluss — steht nicht wörtlich da, man muss es aus dem Gehörten schliessen;
           titel — welcher Titel passt am besten? (richtig = der Titel der Geschichte, der in
           Stufe 6 nicht gezeigt wird); weiter — welche Fortsetzung passt?
   Bild-Antworten (Gruppe 1 und 2, Arten wer/wo/was): Jede Antwort beginnt mit einem Bildzeichen
   (Emoji) und einem Leerzeichen, z. B. „🧒 Lina“. In Stufe 1 und 2 zeigt das Spiel Bild und Wort,
   in Stufe 3 und 4 nur das Wort.
   Die Fragen stehen in der Reihenfolge der Geschichte; das Spiel wählt je Stufe einige davon aus.
   Nötig je Gruppe (geprüft von pruefeAufgabe): Gruppe 1 je ein wer, wo, was; Gruppe 2 dazu ein
   warum und ein reihenfolge; Gruppe 3 wer, wo, was, schluss, titel, weiter.

   Inhaltsliste: eine Liste „geschichten“; der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag hoer-geschichte, Feld listen). */

const HOER_GESCHICHTEN = [
  // ---------- Gruppe 1: sehr kurze Geschichten, drei Sätze ----------
  { gruppe: 1, titel: "Der rote Drachen",
    text: "Am Samstag geht Lina mit ihrem Grossvater auf den Hügel. Dort lässt sie ihren roten Drachen steigen. Der Wind bläst stark, und der Drachen fliegt hoch über die Bäume.",
    fragen: [
      ["wer", "Wer lässt den Drachen steigen?", "🧒 Lina", "👴 der Grossvater", "👦 Nico"],
      ["wo", "Wo lässt sie ihn steigen?", "⛰️ auf dem Hügel", "🏖️ am See", "🏫 auf dem Pausenplatz"],
      ["was", "Was macht der Wind?", "💨 Er bläst stark.", "🌧️ Er bringt Regen.", "😴 Er schläft ein."],
    ] },
  { gruppe: 1, titel: "Die Mütze in der Pfütze",
    text: "In der grossen Pause spielt Jonas auf dem Pausenplatz Fangen. Dabei fällt seine blaue Mütze in eine Pfütze. Seine Freundin Ayla fischt sie heraus und hängt sie zum Trocknen an die Heizung.",
    fragen: [
      ["wer", "Wer fischt die Mütze heraus?", "👧 Ayla", "👦 Jonas", "👩‍🏫 die Lehrerin"],
      ["wo", "Wo spielt Jonas Fangen?", "🏫 auf dem Pausenplatz", "🌲 im Wald", "🏡 im Garten"],
      ["was", "Was passiert mit der Mütze?", "💧 Sie fällt in eine Pfütze.", "🌳 Sie hängt im Baum.", "🐕 Ein Hund nimmt sie mit."],
    ] },
  { gruppe: 1, titel: "Das Kalb Flöckli",
    text: "Auf dem Bauernhof von Tante Rosa ist in der Nacht ein Kalb geboren. Am Morgen darf Samuel es im Stall besuchen. Das Kalb heisst Flöckli und trinkt Milch aus einer grossen Flasche.",
    fragen: [
      ["wer", "Wer besucht das Kalb?", "👦 Samuel", "👩 Tante Rosa", "👧 Mia"],
      ["wo", "Wo ist das Kalb?", "🐄 im Stall", "🌳 auf der Wiese", "🚜 auf dem Traktor"],
      ["was", "Was trinkt das Kalb?", "🍼 Milch aus der Flasche", "💧 Wasser aus dem Bach", "🧃 Saft aus dem Becher"],
    ] },
  { gruppe: 1, titel: "Der Sprung ins Wasser",
    text: "Am Mittwoch geht die Klasse ins Hallenbad. Noah traut sich zum ersten Mal vom Sprungbrett. Er springt mit einem lauten Platsch ins Wasser, und alle Kinder klatschen.",
    fragen: [
      ["wer", "Wer springt vom Sprungbrett?", "👦 Noah", "👩‍🏫 die Lehrerin", "👧 Elina"],
      ["wo", "Wo ist die Klasse?", "🏊 im Hallenbad", "🏫 im Schulzimmer", "⛰️ in den Bergen"],
      ["was", "Was machen die anderen Kinder?", "👏 Sie klatschen.", "😴 Sie schlafen.", "🏃 Sie rennen weg."],
    ] },
  { gruppe: 1, titel: "Die Zugfahrt",
    text: "Am Bahnhof wartet Elina mit ihrer Mutter auf den Zug. Der Zug kommt um 9 Uhr 20 auf Gleis drei. Elina darf am Fenster sitzen und winkt dem Lokführer.",
    fragen: [
      ["wer", "Wer wartet auf den Zug?", "👧 Elina", "👨 der Lokführer", "👦 Ben"],
      ["wo", "Wo warten die beiden?", "🚉 am Bahnhof", "🚌 an der Bushaltestelle", "✈️ am Flughafen"],
      ["was", "Was macht Elina im Zug?", "👋 Sie winkt dem Lokführer.", "😴 Sie schläft.", "📖 Sie liest ein Buch."],
    ] },
  { gruppe: 1, titel: "Pilze im Wald",
    text: "Am Sonntag sucht Ben mit seinem Vater im Wald Pilze. Ben findet unter einer Tanne einen grossen braunen Pilz. Zu Hause kocht der Vater daraus eine feine Suppe.",
    fragen: [
      ["wer", "Wer findet den grossen Pilz?", "👦 Ben", "👨 der Vater", "👧 Lina"],
      ["wo", "Wo suchen sie Pilze?", "🌲 im Wald", "🏡 im Garten", "🏔️ auf der Alp"],
      ["was", "Was kocht der Vater?", "🍲 eine Suppe", "🍕 eine Pizza", "🎂 einen Kuchen"],
    ] },
  { gruppe: 1, titel: "Bruno, der neue Hund",
    text: "Mia bekommt einen kleinen Hund. Er heisst Bruno und hat weiche braune Ohren. Im Garten rennt Bruno dem Ball nach und bringt ihn Mia jedes Mal zurück.",
    fragen: [
      ["wer", "Wer bekommt einen Hund?", "👧 Mia", "👦 Noah", "👵 die Grossmutter"],
      ["wo", "Wo rennt Bruno dem Ball nach?", "🏡 im Garten", "🏫 im Schulhaus", "🏊 im Hallenbad"],
      ["was", "Was bringt Bruno zurück?", "⚽ den Ball", "🥏 die Frisbee", "🥖 das Brot"],
    ] },
  { gruppe: 1, titel: "Die Schlittenfahrt",
    text: "Im Winter fahren Leo und seine Schwester Nora mit dem Schlitten den Hügel hinunter. Nora steuert, Leo hält sich fest. Unten landen beide lachend im tiefen Schnee.",
    fragen: [
      ["wer", "Wer steuert den Schlitten?", "👧 Nora", "👦 Leo", "👨 der Vater"],
      ["wo", "Wo fahren sie Schlitten?", "⛰️ auf dem Hügel", "🛣️ auf der Strasse", "🏫 auf dem Pausenplatz"],
      ["was", "Was passiert unten?", "❄️ Sie landen im Schnee.", "💧 Sie fallen in den Bach.", "🏆 Sie gewinnen einen Preis."],
    ] },
  { gruppe: 1, titel: "Das Picknick am See",
    text: "Am Nachmittag macht Familie Keller am See ein Picknick. Yara verteilt die Sandwiches. Plötzlich kommt eine Ente ganz nah und bettelt um ein Stück Brot.",
    fragen: [
      ["wer", "Wer verteilt die Sandwiches?", "👧 Yara", "👩 die Mutter", "🦆 die Ente"],
      ["wo", "Wo ist das Picknick?", "🏖️ am See", "🌲 im Wald", "🏡 im Garten"],
      ["was", "Was macht die Ente?", "🍞 Sie bettelt um Brot.", "🏊 Sie taucht unter.", "😴 Sie schläft am Ufer."],
    ] },
  { gruppe: 1, titel: "Am Lagerfeuer",
    text: "Im Klassenlager sitzen die Kinder am Abend um ein Lagerfeuer. Herr Baumann erzählt eine lustige Geschichte. Danach brät Amir für alle Schlangenbrot über der Glut.",
    fragen: [
      ["wer", "Wer erzählt etwas Lustiges?", "👨‍🏫 Herr Baumann", "👦 Amir", "👧 Lina"],
      ["wo", "Wo sitzen die Kinder?", "🔥 am Lagerfeuer", "🏫 im Schulzimmer", "🚌 im Bus"],
      ["was", "Was brät Amir?", "🥖 Schlangenbrot", "🌭 Würste", "🍎 Äpfel"],
    ] },
  { gruppe: 1, titel: "Selinas Geburtstag",
    text: "Heute wird Selina acht Jahre alt. Ihre Mutter backt einen Schokoladenkuchen mit acht Kerzen. Am Nachmittag kommen drei Freundinnen, und sie spielen im Garten Verstecken.",
    fragen: [
      ["wer", "Wer hat Geburtstag?", "👧 Selina", "👩 die Mutter", "👦 Leo"],
      ["wo", "Wo spielen die Kinder?", "🏡 im Garten", "🏊 im Hallenbad", "🏫 in der Turnhalle"],
      ["was", "Was backt die Mutter?", "🎂 einen Schokoladenkuchen", "🍪 Guetzli", "🍞 ein Brot"],
    ] },
  { gruppe: 1, titel: "Auf dem Markt",
    text: "Am Samstagmorgen geht Tim mit seiner Grossmutter auf den Markt. Sie kaufen Äpfel, Rüebli und einen Strauss Blumen. Der Gemüsehändler schenkt Tim eine süsse Erdbeere.",
    fragen: [
      ["wer", "Wer schenkt Tim eine Erdbeere?", "🧑‍🌾 der Gemüsehändler", "👵 die Grossmutter", "👩 die Mutter"],
      ["wo", "Wo sind Tim und seine Grossmutter?", "🧺 auf dem Markt", "🏫 in der Schule", "🌲 im Wald"],
      ["was", "Was kaufen sie?", "🥕 Äpfel, Rüebli und Blumen", "🍞 Brot und Käse", "🧸 ein Spielzeug"],
    ] },

  // ---------- Gruppe 2: kurze Geschichten mit Grund und Reihenfolge ----------
  { gruppe: 2, titel: "Der Igel unter dem Laub",
    text: "Am Herbstnachmittag räumt Lena mit ihrem Vater den Garten auf. Unter einem Haufen Laub entdeckt sie plötzlich einen kleinen Igel. Er rollt sich sofort zu einer Kugel zusammen. Lena lässt das Laub an dieser Stelle liegen, weil der Igel darin seinen Winterschlaf halten will. Am Abend stellt sie ihm noch ein Schälchen Wasser hin.",
    fragen: [
      ["wer", "Wer entdeckt den Igel?", "👧 Lena", "👨 der Vater", "🐱 die Katze"],
      ["wo", "Wo ist der Igel?", "🍂 unter dem Laub", "🌳 auf dem Baum", "⬇️ im Keller"],
      ["was", "Was macht der Igel?", "🦔 Er rollt sich zusammen.", "🏃 Er rennt davon.", "😴 Er schläft auf Lenas Hand."],
      ["warum", "Warum lässt Lena das Laub liegen?", "Der Igel will darin seinen Winterschlaf halten.", "Sie hat keine Lust mehr zum Aufräumen.", "Der Vater braucht es für den Kompost."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Lena räumt den Garten auf.", "Sie entdeckt einen Igel.", "Sie stellt ihm Wasser hin."]],
    ] },
  { gruppe: 2, titel: "Ein Ei aus dem Nest",
    text: "Am Dienstag fährt die Klasse von Frau Imhof mit dem Bus zu einem Bauernhof. Zuerst zeigt der Bauer den Kindern die Kühe im Stall. Dann dürfen alle die Hühner füttern. Elias bekommt ein Ei direkt aus dem Nest in die Hand. Er trägt es ganz vorsichtig, weil es noch warm und zerbrechlich ist. Zum Schluss gibt es für alle Apfelsaft.",
    fragen: [
      ["wer", "Wer bekommt ein Ei?", "👦 Elias", "👩‍🏫 Frau Imhof", "🧑‍🌾 der Bauer"],
      ["wo", "Wo sind die Kühe?", "🐄 im Stall", "🌳 auf der Wiese", "🚜 beim Traktor"],
      ["was", "Was gibt es zum Schluss?", "🧃 Apfelsaft", "🥛 Milch", "🍪 Guetzli"],
      ["warum", "Warum trägt Elias das Ei so vorsichtig?", "Es ist noch warm und zerbrechlich.", "Er will es verstecken.", "Der Bauer schimpft sonst."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Der Bauer zeigt die Kühe.", "Die Kinder füttern die Hühner.", "Alle trinken Apfelsaft."]],
    ] },
  { gruppe: 2, titel: "Die Kuh auf den Gleisen",
    text: "Jana steht am Bahnhof und wartet auf ihre Grossmutter. Der Zug sollte um halb drei kommen. Doch die Zeit vergeht, und kein Zug fährt ein. Eine Durchsage erklärt, dass der Zug zehn Minuten später kommt, weil eine Kuh auf den Gleisen stand. Jana muss lachen. Als die Grossmutter endlich aussteigt, umarmen sich die beiden ganz fest.",
    fragen: [
      ["wer", "Auf wen wartet Jana?", "👵 auf ihre Grossmutter", "👨 auf ihren Vater", "👧 auf ihre Freundin"],
      ["wo", "Wo wartet Jana?", "🚉 am Bahnhof", "🏠 zu Hause", "🚌 an der Bushaltestelle"],
      ["was", "Was passiert, als die Grossmutter aussteigt?", "🤗 Die beiden umarmen sich.", "😢 Jana weint.", "🏃 Jana rennt weg."],
      ["warum", "Warum kommt der Zug später?", "Eine Kuh stand auf den Gleisen.", "Der Lokführer hat verschlafen.", "Es hat stark geschneit."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Jana wartet am Bahnhof.", "Eine Durchsage erklärt die Verspätung.", "Die Grossmutter steigt aus."]],
    ] },
  { gruppe: 2, titel: "Das schwarze Schlangenbrot",
    text: "Im Klassenlager machen die Kinder am Abend ein Feuer. Herr Weber zeigt, wie man den Teig um einen Stecken wickelt. Noah hält sein Schlangenbrot zu nah an die Flammen, darum wird es auf einer Seite ganz schwarz. Seine Freundin Lea teilt ihr Brot mit ihm. Dann singen alle zusammen ein Lied.",
    fragen: [
      ["wer", "Wer zeigt, wie man den Teig wickelt?", "👨‍🏫 Herr Weber", "👦 Noah", "👧 Lea"],
      ["wo", "Wo sind die Kinder?", "🏕️ im Klassenlager", "🏫 im Schulzimmer", "🏡 zu Hause"],
      ["was", "Was macht Lea?", "🥖 Sie teilt ihr Brot.", "🎤 Sie singt allein.", "🔥 Sie löscht das Feuer."],
      ["warum", "Warum wird Noahs Brot schwarz?", "Er hält es zu nah an die Flammen.", "Er hat zu viel Teig genommen.", "Lea hat ihn gestossen."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Die Kinder machen ein Feuer.", "Noahs Brot wird schwarz.", "Alle singen ein Lied."]],
    ] },
  { gruppe: 2, titel: "Der Sprung vom Dreimeterbrett",
    text: "Am Freitag geht Amira mit ihrem Bruder Karim ins Hallenbad. Karim will vom Dreimeterbrett springen. Oben zögert er lange, weil das Wasser so weit unten ist. Amira ruft: Du schaffst das! Dann springt Karim, taucht unter und kommt strahlend wieder hoch. Als Belohnung kaufen sich die beiden am Kiosk ein Glace.",
    fragen: [
      ["wer", "Wer springt vom Dreimeterbrett?", "👦 Karim", "👧 Amira", "👨 der Bademeister"],
      ["wo", "Wo sind die beiden?", "🏊 im Hallenbad", "🏖️ am See", "🏫 in der Turnhalle"],
      ["was", "Was kaufen sie am Kiosk?", "🍦 ein Glace", "🍟 Pommes", "🧃 einen Saft"],
      ["warum", "Warum zögert Karim oben so lange?", "Das Wasser ist so weit unten.", "Er hat die Badehose vergessen.", "Der Bademeister pfeift."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Karim zögert auf dem Brett.", "Karim springt ins Wasser.", "Die beiden kaufen ein Glace."]],
    ] },
  { gruppe: 2, titel: "Schnee in der Pause",
    text: "In der grossen Pause liegt zum ersten Mal Schnee auf dem Pausenplatz. Sofort beginnt eine Schneeballschlacht. Luca trifft aus Versehen die Lehrerin am Rücken. Er erschrickt, doch Frau Steiner lacht und wirft zurück. Die Pause dauert heute länger, weil die Lehrerin selbst nicht aufhören will. Am Ende sind alle nass und fröhlich.",
    fragen: [
      ["wer", "Wer trifft die Lehrerin?", "👦 Luca", "👧 Nina", "👨 der Hauswart"],
      ["wo", "Wo ist die Schneeballschlacht?", "🏫 auf dem Pausenplatz", "🌲 im Wald", "🏡 im Garten"],
      ["was", "Was macht Frau Steiner?", "❄️ Sie lacht und wirft zurück.", "😠 Sie schimpft.", "🚪 Sie geht ins Schulhaus."],
      ["warum", "Warum dauert die Pause länger?", "Die Lehrerin will selbst nicht aufhören.", "Die Glocke ist kaputt.", "Es ist der letzte Schultag."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Die Schneeballschlacht beginnt.", "Luca trifft die Lehrerin.", "Alle sind nass und fröhlich."]],
    ] },
  { gruppe: 2, titel: "Ein Brief für Opa",
    text: "Finn möchte seinem Opa einen Brief schreiben, weil Opa für zwei Wochen weit weg in den Ferien ist. Er malt ein Bild von ihrem Hund Lotte dazu. Dann geht Finn mit seiner Mutter zur Post. Dort kauft er eine Briefmarke mit einem Vogel darauf. Finn wirft den Brief selbst in den gelben Briefkasten. Zwei Tage später ruft Opa an und bedankt sich.",
    fragen: [
      ["wer", "Wer bekommt den Brief?", "👴 Opa", "👵 Oma", "🐕 Lotte"],
      ["wo", "Wo kauft Finn die Briefmarke?", "📮 auf der Post", "🏪 im Laden", "🏫 in der Schule"],
      ["was", "Was malt Finn dazu?", "🐕 ein Bild vom Hund", "🌳 einen Baum", "🚂 einen Zug"],
      ["warum", "Warum schreibt Finn den Brief?", "Opa ist weit weg in den Ferien.", "Finn hat Geburtstag.", "Die Lehrerin will es so."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Finn malt ein Bild dazu.", "Finn kauft eine Briefmarke.", "Opa ruft an."]],
    ] },
  { gruppe: 2, titel: "Der platte Reifen",
    text: "Am Sonntag macht Familie Brunner eine Velotour dem Fluss entlang. Nach einer Stunde hat Mila einen platten Reifen. Ihr Vater holt das Flickzeug aus dem Rucksack, weil er so etwas schon erwartet hat. Mila hilft beim Aufpumpen. Danach fahren alle weiter bis zu einer Badestelle, wo sie die Füsse ins kühle Wasser halten.",
    fragen: [
      ["wer", "Wer hat einen platten Reifen?", "👧 Mila", "👨 der Vater", "👩 die Mutter"],
      ["wo", "Wo fahren sie mit dem Velo?", "🏞️ dem Fluss entlang", "⛰️ den Berg hinauf", "🏙️ durch die Stadt"],
      ["was", "Was machen sie an der Badestelle?", "💧 Füsse ins Wasser halten", "🏊 um die Wette schwimmen", "🎣 fischen"],
      ["warum", "Warum hat der Vater Flickzeug dabei?", "Er hat so etwas schon erwartet.", "Er will ein Velo kaufen.", "Mila hat es ihm geschenkt."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Mila hat einen platten Reifen.", "Der Vater flickt den Reifen.", "Alle halten die Füsse ins Wasser."]],
    ] },
  { gruppe: 2, titel: "Das Lied in der Aula",
    text: "Die Klasse von Herrn Roth übt seit Wochen ein Lied für das Schulfest. Am Abend des Fests ist die Aula voll. Kurz vor dem Auftritt vergisst Sara ihren Text, weil ihr vor Aufregung die Hände zittern. Herr Roth flüstert ihr die erste Zeile zu, und dann klappt alles. Die Eltern klatschen so laut, dass die Klasse das Lied noch einmal singt.",
    fragen: [
      ["wer", "Wer flüstert Sara die erste Zeile zu?", "👨‍🏫 Herr Roth", "👧 ihre Freundin", "👩 ihre Mutter"],
      ["wo", "Wo singt die Klasse?", "🎤 in der Aula", "🏫 im Schulzimmer", "⛪ in der Kirche"],
      ["was", "Was macht die Klasse am Schluss?", "🎶 Sie singt das Lied noch einmal.", "🍰 Sie isst Kuchen.", "🏃 Sie läuft nach Hause."],
      ["warum", "Warum vergisst Sara ihren Text?", "Ihr zittern vor Aufregung die Hände.", "Sie hat das Lied nie geübt.", "Das Licht geht aus."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Die Klasse übt das Lied.", "Sara vergisst ihren Text.", "Die Klasse singt noch einmal."]],
    ] },
  { gruppe: 2, titel: "Das Baumhaus",
    text: "Im Wald hinter dem Dorf bauen Elin und Jonas ein Baumhaus. Jonas sägt die Bretter, Elin schlägt die Nägel ein. Als es fertig ist, klettern sie hinauf und schauen über die Wipfel. Am nächsten Tag hängen sie ein Schild hin: Nur für Freunde! Sie laden ihre Nachbarin Amira ein, weil sie beim Tragen der Bretter geholfen hat.",
    fragen: [
      ["wer", "Wer schlägt die Nägel ein?", "👧 Elin", "👦 Jonas", "🧒 Amira"],
      ["wo", "Wo steht das Baumhaus?", "🌲 im Wald", "🏡 im Garten", "🏫 beim Schulhaus"],
      ["was", "Was hängen sie am nächsten Tag hin?", "🪧 ein Schild", "🏳️ eine Fahne", "🔔 eine Glocke"],
      ["warum", "Warum laden sie Amira ein?", "Sie hat beim Tragen der Bretter geholfen.", "Sie hat Geburtstag.", "Sie hat Guetzli mitgebracht."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Jonas sägt die Bretter.", "Sie klettern ins fertige Baumhaus.", "Sie hängen ein Schild hin."]],
    ] },
  { gruppe: 2, titel: "Die Katze auf dem Dach",
    text: "Am Morgen miaut es laut vor dem Haus. Die Katze von Nachbar Ruedi sitzt auf dem Garagendach und traut sich nicht hinunter. Leonie holt ihren Vater. Der stellt die lange Leiter an das Dach, weil die Katze sonst den ganzen Tag dort oben bliebe. Leonie klettert hinauf, nimmt die Katze auf den Arm und trägt sie vorsichtig zu Ruedi.",
    fragen: [
      ["wer", "Wer trägt die Katze zu Ruedi?", "👧 Leonie", "👨 der Vater", "👵 die Grossmutter"],
      ["wo", "Wo sitzt die Katze?", "⬆️ auf dem Garagendach", "🌳 auf dem Baum", "🚗 im Auto"],
      ["was", "Was holt der Vater?", "🪜 die lange Leiter", "🐟 einen Fisch", "📞 das Telefon"],
      ["warum", "Warum stellt der Vater die Leiter an?", "Die Katze bliebe sonst den ganzen Tag oben.", "Er will das Dach putzen.", "Leonie will auf dem Dach spielen."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Die Katze miaut auf dem Dach.", "Der Vater stellt die Leiter an.", "Leonie trägt die Katze zu Ruedi."]],
    ] },
  { gruppe: 2, titel: "Der Wettlauf",
    text: "Beim Sporttag auf dem Sportplatz läuft Timo beim Wettlauf mit. Beim Start stolpert er und ist zuerst Letzter. Er gibt nicht auf, weil seine Klasse am Rand laut seinen Namen ruft. Runde um Runde holt er auf. Am Ende wird Timo Dritter und bekommt eine Medaille aus Schokolade. Die teilt er mit seiner Schwester.",
    fragen: [
      ["wer", "Wer bekommt eine Medaille?", "👦 Timo", "👧 seine Schwester", "👨‍🏫 der Lehrer"],
      ["wo", "Wo ist der Wettlauf?", "🏟️ auf dem Sportplatz", "🌲 im Wald", "🏊 im Hallenbad"],
      ["was", "Was passiert beim Start?", "🤕 Timo stolpert.", "🏆 Timo gewinnt sofort.", "😴 Timo verschläft den Start."],
      ["warum", "Warum gibt Timo nicht auf?", "Seine Klasse ruft laut seinen Namen.", "Der Lehrer rennt mit.", "Es gibt ein Velo zu gewinnen."],
      ["reihenfolge", "Was passierte zuerst? Tipp die drei Dinge der Reihe nach an.", ["Timo stolpert beim Start.", "Timo holt Runde um Runde auf.", "Timo bekommt eine Medaille."]],
    ] },

  // ---------- Gruppe 3: längere Geschichten mit Schluss, Titel und Fortsetzung ----------
  { gruppe: 3, titel: "Der Regenschirm im Wald",
    text: "Am Samstag wandert Nora mit ihrer Familie durch den Wald zum Aussichtsturm. Ihr grosser Bruder Dario trägt den Rucksack mit dem Picknick. Unterwegs wird der Himmel immer dunkler, und bald fallen die ersten Tropfen. Nora hat als Einzige einen Regenschirm dabei. Darunter drängen sich plötzlich alle vier zusammen und lachen. Beim Turm angekommen, scheint die Sonne schon wieder, und die Familie isst ihr Picknick auf der Bank.",
    fragen: [
      ["wer", "Wer trägt den Rucksack?", "Dario", "Nora", "der Vater"],
      ["wo", "Wohin wandert die Familie?", "zum Aussichtsturm", "zum See", "auf den Bauernhof"],
      ["was", "Was passiert unterwegs?", "Die ersten Tropfen fallen.", "Nora verliert einen Schuh.", "Sie sehen einen Hirsch."],
      ["schluss", "Warum hat Nora den Schirm wohl mitgenommen?", "Sie hat am Morgen Wolken gesehen und an Regen gedacht.", "Sie wollte ihn dem Bruder schenken.", "Im Wald ist es immer dunkel."],
      ["titel", "Welcher Titel passt am besten?", "Der Regenschirm im Wald", "Darios schwerer Rucksack", "Ein Tag im Hallenbad"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "Nach dem Picknick steigen alle auf den Turm und schauen weit über das Land.", "Nora kauft im Wald einen neuen Schirm.", "Die Familie steigt in ihr Boot und rudert über den See."],
    ] },
  { gruppe: 3, titel: "Das Rennen der Schnecken",
    text: "In der Pause finden Mila und Ben auf dem nassen Pausenplatz zwei Schnecken. Sie legen ein Blatt als Ziel auf den Boden und lassen die Schnecken um die Wette kriechen. Bald stehen zehn Kinder im Kreis und feuern die Schnecken an. Mila nennt ihre Schnecke Blitz, Ben seine Turbo. Blitz kriecht langsam, aber immer geradeaus. Turbo dreht immer wieder um. Als die Glocke läutet, hat noch keine Schnecke das Blatt erreicht. Die Kinder setzen beide vorsichtig ins Gras.",
    fragen: [
      ["wer", "Wer findet die Schnecken?", "Mila und Ben", "die Lehrerin", "zehn Kinder"],
      ["wo", "Wo sind die Schnecken?", "auf dem Pausenplatz", "im Schulzimmer", "im Wald"],
      ["was", "Was machen die Kinder, als die Glocke läutet?", "Sie setzen die Schnecken ins Gras.", "Sie nehmen die Schnecken mit nach Hause.", "Sie bauen ein Schneckenhaus."],
      ["schluss", "Welche Schnecke war wohl näher beim Blatt?", "Blitz, weil sie immer geradeaus kroch.", "Turbo, weil sie den schnelleren Namen hat.", "Keine, denn beide haben die ganze Zeit geschlafen."],
      ["titel", "Welcher Titel passt am besten?", "Das Rennen der Schnecken", "Die Glocke läutet", "Milas neues Haustier"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "Am nächsten Tag schauen Mila und Ben nach, ob die Schnecken noch im Gras sind.", "Die Kinder spielen im Schulzimmer mit den Schnecken weiter.", "Ben verkauft Turbo auf dem Markt."],
    ] },
  { gruppe: 3, titel: "Die verpasste Haltestelle",
    text: "Jeden Morgen fährt Leon mit dem Bus zur Schule. Heute liest er unterwegs ein so spannendes Buch, dass er die Haltestelle beim Schulhaus verpasst. Erst beim Bahnhof merkt er es. Der Busfahrer sieht Leons erschrockenes Gesicht und sagt: Keine Sorge, in fünf Minuten fahre ich zurück. Leon darf sitzen bleiben und fährt mit zurück. Als er endlich ins Schulzimmer kommt, lächelt die Lehrerin und sagt: Das Buch muss wirklich spannend sein.",
    fragen: [
      ["wer", "Wer verpasst die Haltestelle?", "Leon", "der Busfahrer", "die Lehrerin"],
      ["wo", "Wo merkt Leon, dass er zu weit gefahren ist?", "beim Bahnhof", "beim Schulhaus", "zu Hause"],
      ["was", "Was sagt der Busfahrer?", "In fünf Minuten fahre ich zurück.", "Du musst zu Fuss gehen.", "Der Bus ist kaputt."],
      ["schluss", "Woher weiss die Lehrerin wohl vom Buch?", "Leon kommt zu spät und hat das Buch noch in der Hand.", "Sie hat das Buch selbst geschrieben.", "Der Busfahrer hat ihr einen Brief geschickt."],
      ["titel", "Welcher Titel passt am besten?", "Die verpasste Haltestelle", "Ein Tag am Bahnhof", "Der kaputte Bus"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "Leon erzählt der Klasse, warum er zu spät kam, und alle wollen das Buch lesen.", "Leon fährt mit dem Bus in die Berge und geht nie mehr zur Schule.", "Der Busfahrer verkauft den Bus und kauft sich ein Velo."],
    ] },
  { gruppe: 3, titel: "Das Kalb auf der Alp",
    text: "In den Sommerferien darf Selin eine Woche bei ihrem Onkel auf der Alp verbringen. Jeden Morgen hilft sie im Stall und bringt den Kälbern Heu. Ein Kalb mit einem weissen Fleck auf der Stirn folgt ihr überall hin. Selin nennt es Sternli. Am letzten Tag will Sternli nicht von ihrer Seite weichen, und Selin muss sich dreimal verabschieden. Im Auto nach Hause schaut sie lange aus dem Fenster und sagt kein Wort.",
    fragen: [
      ["wer", "Wer folgt Selin überall hin?", "das Kalb Sternli", "der Onkel", "der Hofhund"],
      ["wo", "Wo verbringt Selin die Ferien?", "auf der Alp", "am Meer", "im Lager"],
      ["was", "Was bringt Selin den Kälbern?", "Heu", "Brot", "Wasser"],
      ["schluss", "Warum sagt Selin im Auto kein Wort?", "Sie ist traurig, weil sie Sternli vermisst.", "Sie ist müde vom Autofahren.", "Sie hat Halsweh."],
      ["titel", "Welcher Titel passt am besten?", "Das Kalb auf der Alp", "Ein Morgen im Stall", "Die Fahrt im Auto"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "Zu Hause schreibt Selin dem Onkel und fragt, wie es Sternli geht.", "Selin kauft sich am nächsten Tag ein eigenes Kalb für den Balkon.", "Selin vergisst die Alp sofort und denkt nie mehr an Sternli."],
    ] },
  { gruppe: 3, titel: "Der Vogel im Schulzimmer",
    text: "Am Montagmorgen steht das Fenster im Schulzimmer offen. Plötzlich flattert eine Amsel herein und setzt sich auf die Lampe. Die Kinder kichern, Frau Blum legt den Finger auf die Lippen. Alle werden ganz still. Yusuf öffnet vorsichtig das zweite Fenster, damit der Vogel mehr Platz zum Hinausfliegen hat. Nach einer langen Minute hüpft die Amsel aufs Fensterbrett und fliegt in den Garten. Die Klasse klatscht leise, und Frau Blum schreibt an die Wandtafel: Heute Besuch gehabt.",
    fragen: [
      ["wer", "Wer öffnet das zweite Fenster?", "Yusuf", "Frau Blum", "der Hauswart"],
      ["wo", "Wo setzt sich die Amsel zuerst hin?", "auf die Lampe", "auf das Pult", "auf die Wandtafel"],
      ["was", "Was schreibt Frau Blum an die Wandtafel?", "Heute Besuch gehabt.", "Fenster schliessen!", "Hausaufgaben für morgen."],
      ["schluss", "Warum legt Frau Blum den Finger auf die Lippen?", "Damit die Kinder still sind und der Vogel keine Angst bekommt.", "Weil sie Zahnweh hat.", "Weil die Pause beginnt."],
      ["titel", "Welcher Titel passt am besten?", "Der Vogel im Schulzimmer", "Yusuf und die Lampe", "Ein Tag im Garten"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "Die Klasse malt später Bilder von der Amsel und hängt sie ans Fenster.", "Die Amsel kommt am Nachmittag zurück und schreibt die Prüfung mit.", "Frau Blum nimmt den Vogel mit nach Hause in einen Käfig."],
    ] },
  { gruppe: 3, titel: "Die Schatzkarte vom Grossvater",
    text: "Zum Geburtstag bekommt Nino von seinem Grossvater eine alte Karte. Darauf ist der Garten gezeichnet, und beim Apfelbaum steht ein rotes Kreuz. Nino holt die Schaufel aus dem Gartenhaus und gräbt. Nach einer Weile stösst die Schaufel auf etwas Hartes. Es ist eine Blechdose. Darin liegen ein Brief und eine Tüte mit Samen. Im Brief steht: Pflanze sie ein, und im Sommer siehst du den Schatz. Nino gräbt ein zweites Loch und legt die Samen hinein.",
    fragen: [
      ["wer", "Wer schenkt Nino die Karte?", "der Grossvater", "die Mutter", "sein Freund"],
      ["wo", "Wo steht das rote Kreuz?", "beim Apfelbaum", "beim Gartenhaus", "beim Teich"],
      ["was", "Was ist in der Blechdose?", "ein Brief und Samen", "Goldmünzen", "ein altes Foto"],
      ["schluss", "Was ist der Schatz wohl?", "Blumen, die aus den Samen wachsen.", "Eine zweite Blechdose.", "Ein Goldstück unter dem Apfelbaum."],
      ["titel", "Welcher Titel passt am besten?", "Die Schatzkarte vom Grossvater", "Die kaputte Schaufel", "Ninos Geburtstagskuchen"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "Nino giesst die Stelle jeden Tag und wartet auf den Sommer.", "Nino wirft die Samen weg, weil er lieber Gold wollte.", "Nino baut aus der Blechdose ein Boot und fährt damit aufs Meer."],
    ] },
  { gruppe: 3, titel: "Der Hamster ist weg",
    text: "Am Freitag soll Lea den Hamster der Klasse übers Wochenende nach Hause nehmen. Doch als sie den Käfig holen will, ist die Tür offen und Pino verschwunden. Lea sucht unter den Pulten und hinter dem Schrank. Dann hört sie ein leises Rascheln aus der Papierkiste. Pino sitzt mitten in einem Nest aus zerknüllten Blättern und frisst eine Erdnuss. Lea trägt ihn vorsichtig zurück in den Käfig und prüft zweimal, ob die Tür zu ist.",
    fragen: [
      ["wer", "Wer nimmt den Hamster übers Wochenende mit?", "Lea", "die Lehrerin", "der Hauswart"],
      ["wo", "Wo findet Lea den Hamster?", "in der Papierkiste", "hinter dem Schrank", "unter dem Pult"],
      ["was", "Was frisst Pino?", "eine Erdnuss", "ein Rüebli", "ein Stück Käse"],
      ["schluss", "Warum prüft Lea die Tür zweimal?", "Pino soll nicht noch einmal entwischen.", "Die Tür ist neu.", "Die Lehrerin schaut zu."],
      ["titel", "Welcher Titel passt am besten?", "Der Hamster ist weg", "Die Erdnuss", "Ein Wochenende bei Lea"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "Lea trägt den Käfig nach Hause und richtet Pino ein gemütliches Plätzchen ein.", "Lea lässt Pino im Schulhaus und fährt in die Ferien.", "Pino baut sich aus der Papierkiste ein Flugzeug."],
    ] },
  { gruppe: 3, titel: "Die Durchsage im Hallenbad",
    text: "Im Hallenbad ist am Mittwoch viel los. Jan und seine Cousine Ida rutschen zum zehnten Mal die grosse Rutschbahn hinunter. Plötzlich kommt eine Durchsage: Ein blaues Badetuch mit gelben Fischen liegt an der Kasse. Ida schaut auf ihren Platz am Beckenrand, dort liegt nur noch Jans Tuch. Sie rennt zur Kasse, und die Frau dort lacht: Du bist schon die Dritte heute. Ida bedankt sich und hängt das Tuch diesmal an den Haken.",
    fragen: [
      ["wer", "Wer holt das Badetuch an der Kasse?", "Ida", "Jan", "die Frau an der Kasse"],
      ["wo", "Wo liegt das Badetuch?", "an der Kasse", "auf der Rutschbahn", "am Beckenrand"],
      ["was", "Was machen Jan und Ida vor der Durchsage?", "Sie rutschen die Rutschbahn hinunter.", "Sie essen Pommes.", "Sie schwimmen um die Wette."],
      ["schluss", "Wem gehört das blaue Badetuch?", "Ida", "Jan", "der Frau an der Kasse"],
      ["titel", "Welcher Titel passt am besten?", "Die Durchsage im Hallenbad", "Jans Badetuch", "Die Frau an der Kasse"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "Jan und Ida rutschen noch ein paar Mal und gehen dann zusammen nach Hause.", "Ida verliert das Tuch gleich wieder im Zug nach Italien.", "Die Frau an der Kasse behält das Tuch und geht schwimmen."],
    ] },
  { gruppe: 3, titel: "Der Fuchs beim Zelt",
    text: "Im Klassenlager dürfen die Kinder eine Nacht im Zelt schlafen. Noemi und Zoe bauen ihr Zelt neben dem grossen Baum auf. Am Abend hören sie in der Dunkelheit ein Rascheln. Zoe knipst die Taschenlampe an. Im Lichtkegel sitzt ein Fuchs und schaut neugierig herüber, dann trottet er gemütlich davon. Am Morgen erzählen die beiden allen vom Fuchs. Herr Keller zeigt ihnen die kleinen Spuren im feuchten Gras neben dem Zelt.",
    fragen: [
      ["wer", "Wer knipst die Taschenlampe an?", "Zoe", "Noemi", "Herr Keller"],
      ["wo", "Wo steht das Zelt?", "neben dem grossen Baum", "am Fluss", "vor dem Haus"],
      ["was", "Was zeigt Herr Keller am Morgen?", "die Spuren im Gras", "ein Foto vom Fuchs", "den Weg zum Wald"],
      ["schluss", "Warum hatten Noemi und Zoe wohl keine Angst?", "Der Fuchs war nur neugierig und ging gleich wieder weg.", "Herr Keller schlief im selben Zelt.", "Sie hatten einen Hund dabei."],
      ["titel", "Welcher Titel passt am besten?", "Der Fuchs beim Zelt", "Die kaputte Taschenlampe", "Ein Tag am Fluss"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "In der nächsten Nacht legen die Kinder Brot vors Zelt und warten auf den Fuchs.", "Noemi nimmt den Fuchs mit nach Hause und hält ihn im Zimmer.", "Die Kinder bauen das Zelt ab und reisen noch am selben Morgen ab."],
    ] },
  { gruppe: 3, titel: "Der Teddy mit einem Ohr",
    text: "Am Samstag findet auf dem Dorfplatz der Kinderflohmarkt statt. Emil breitet auf einer Decke alte Spielsachen aus: ein Puzzle, zwei Autos und einen Teddy mit nur einem Ohr. Eine alte Frau mit einem Stock bleibt lange vor dem Teddy stehen. Sie erzählt, dass sie als Kind genau so einen hatte. Emil sagt: Den schenke ich Ihnen. Die Frau drückt den Teddy an sich. Am Abend hat Emil zwölf Franken verdient und ein grosses Lächeln im Gesicht.",
    fragen: [
      ["wer", "Wer bleibt lange vor dem Teddy stehen?", "eine alte Frau mit einem Stock", "Emils Mutter", "ein Junge aus der Klasse"],
      ["wo", "Wo ist der Flohmarkt?", "auf dem Dorfplatz", "im Schulhaus", "im Wald"],
      ["was", "Was macht Emil mit dem Teddy?", "Er schenkt ihn der Frau.", "Er verkauft ihn für zwölf Franken.", "Er nimmt ihn wieder nach Hause."],
      ["schluss", "Warum hat Emil am Abend ein grosses Lächeln?", "Er hat Geld verdient und der Frau eine Freude gemacht.", "Er hat das Puzzle fertig gelöst.", "Der Teddy hat ein neues Ohr bekommen."],
      ["titel", "Welcher Titel passt am besten?", "Der Teddy mit einem Ohr", "Zwei Autos auf der Decke", "Ein Tag im Hallenbad"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "Emil kauft mit dem Geld ein neues Puzzle und denkt noch oft an die Frau.", "Die Frau bringt den Teddy am Abend zurück, weil er ihr nicht gefällt.", "Emil verkauft seine Decke und geht ohne Geld nach Hause."],
    ] },
  { gruppe: 3, titel: "Der kleine Bruder",
    text: "Seit drei Wochen hat Aisha einen kleinen Bruder. Er heisst Samir und schläft fast den ganzen Tag. Am Sonntag darf Aisha ihn zum ersten Mal allein auf dem Arm halten. Sie sitzt ganz still auf dem Sofa und wagt kaum zu atmen. Samir öffnet die Augen, schaut sie an und greift nach ihrem Finger. Aisha flüstert: Ich bin deine grosse Schwester. Die Mutter macht ein Foto, und das hängt jetzt an der Wand im Flur.",
    fragen: [
      ["wer", "Wer darf Samir auf dem Arm halten?", "Aisha", "die Mutter", "die Nachbarin"],
      ["wo", "Wo sitzt Aisha mit Samir?", "auf dem Sofa", "im Garten", "im Auto"],
      ["was", "Was macht die Mutter?", "Sie macht ein Foto.", "Sie kocht Suppe.", "Sie singt ein Lied."],
      ["schluss", "Warum wagt Aisha kaum zu atmen?", "Sie will mit dem Baby ganz vorsichtig sein.", "Sie hat Schnupfen.", "Im Zimmer ist es stickig."],
      ["titel", "Welcher Titel passt am besten?", "Der kleine Bruder", "Das Sofa im Wohnzimmer", "Ein Foto im Flur"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "Aisha zeigt das Foto allen, die zu Besuch kommen.", "Samir läuft am nächsten Tag allein in den Kindergarten.", "Aisha schenkt das Sofa ihrer Lehrerin."],
    ] },
  { gruppe: 3, titel: "Die Nachbarin und der Schlüssel",
    text: "Als Dario am Mittag von der Schule kommt, ist niemand zu Hause, und sein Schlüssel steckt noch im Turnsack im Schulhaus. Er setzt sich auf die Treppe. Da öffnet Frau Egli, die Nachbarin, ihre Tür. Sie lädt ihn zu Suppe und Brot ein. Dario erzählt ihr von seiner Klasse, und Frau Egli zeigt ihm Fotos von ihren Enkeln. Um zwei Uhr kommt seine Mutter nach Hause. Dario sagt: Nächstes Mal vergesse ich den Schlüssel absichtlich.",
    fragen: [
      ["wer", "Wer lädt Dario zum Essen ein?", "Frau Egli, die Nachbarin", "seine Mutter", "sein Lehrer"],
      ["wo", "Wo ist Darios Schlüssel?", "im Turnsack im Schulhaus", "bei Frau Egli", "unter der Treppe"],
      ["was", "Was zeigt Frau Egli?", "Fotos von ihren Enkeln", "ihren Garten", "ein Buch"],
      ["schluss", "Warum will Dario den Schlüssel nächstes Mal absichtlich vergessen?", "Bei Frau Egli hat es ihm gefallen.", "Er sitzt gern auf Treppen.", "Er findet seinen Turnsack zu schwer."],
      ["titel", "Welcher Titel passt am besten?", "Die Nachbarin und der Schlüssel", "Suppe und Brot", "Fotos von den Enkeln"],
      ["weiter", "Wie geht die Geschichte wohl weiter?", "Am nächsten Tag bringt Dario Frau Egli als Dank eine Zeichnung.", "Dario zieht bei Frau Egli ein und kommt nie mehr nach Hause.", "Die Mutter wirft den Schlüssel in den Fluss."],
    ] },
];
