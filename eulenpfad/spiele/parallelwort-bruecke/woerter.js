/* Wörter-Brücke: französische Parallelwörter — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS2F.2.B.1.b und FS2F.1.B.1.b: Parallelwörter und Bekanntes aus anderen Sprachen
   (Deutsch, Englisch) erkennen und so den Sinn erschliessen. Gängiger Grundwortschatz, nichts aus
   dem Lehrmittel „dis donc!“ abgeschrieben. Französisch mit Akzenten und Apostroph ’; Deutsch in
   Schweizer Schreibweise (ss, Velo, Spital, Tram).

   Inhaltsliste „parallel“ (Entscheid L4 a; Katalog, Eintrag „parallelwort-bruecke“, Feld listen).

   PARALLEL: [französisch mit Artikel, Deutsch, Englisch oder null, Bild oder null, Kennzeichen, falsches Deutsch]
   Kennzeichen:
   - „gleich“:   sieht fast gleich aus wie im Deutschen oder Englischen (la banane, le train)
   - „aehnlich“: ähnlich, man erkennt es mit etwas Mut (la musique, le café)
   - „falle“:    falscher Freund (faux ami): sieht bekannt aus, bedeutet aber etwas anderes. Dann ist
                 „Deutsch“ die richtige Bedeutung und das letzte Feld das deutsche Wort, nach dem es
                 aussieht (le magasin = Laden, nicht Magazin). Nur Fallen, die sicher sind.
   Englisch steht nur, wo es beim Erkennen hilft; das Spiel zeigt es als Tipp.

   PARALLEL_SAETZE: [kurzer Satz, das Parallelwort darin (wie in PARALLEL), Deutsch]. Selbst
   geschrieben, sehr einfach; jeder Satz enthält genau ein Wort aus PARALLEL. */

const PARALLEL = [
  // gleich: sieht fast gleich aus
  ["la banane", "Banane", "banana", "🍌", "gleich"], ["le train", "Zug", "train", "🚆", "gleich"],
  ["la pizza", "Pizza", "pizza", "🍕", "gleich"], ["la girafe", "Giraffe", "giraffe", "🦒", "gleich"],
  ["le lion", "Löwe", "lion", "🦁", "gleich"], ["le crocodile", "Krokodil", "crocodile", "🐊", "gleich"],
  ["le hamster", "Hamster", "hamster", "🐹", "gleich"], ["la tomate", "Tomate", "tomato", "🍅", "gleich"],
  ["la carotte", "Karotte", "carrot", "🥕", "gleich"], ["le bus", "Bus", "bus", "🚌", "gleich"],
  ["le taxi", "Taxi", "taxi", "🚕", "gleich"], ["le tram", "Tram", "tram", "🚋", "gleich"],
  ["le vélo", "Velo", null, "🚲", "gleich"], ["le robot", "Roboter", "robot", "🤖", "gleich"],
  ["le piano", "Klavier", "piano", "🎹", "gleich"], ["la radio", "Radio", "radio", "📻", "gleich"],
  ["le film", "Film", "film", "🎬", "gleich"], ["le sport", "Sport", "sport", "🏅", "gleich"],
  ["le tennis", "Tennis", "tennis", "🎾", "gleich"], ["le golf", "Golf", "golf", "⛳", "gleich"],
  ["le ski", "Ski", "ski", "🎿", "gleich"], ["le judo", "Judo", "judo", "🥋", "gleich"],
  ["le restaurant", "Restaurant", "restaurant", "🍽️", "gleich"], ["le clown", "Clown", "clown", "🤡", "gleich"],
  ["la rose", "Rose", "rose", "🌹", "gleich"], ["l’orange", "Orange", "orange", "🍊", "gleich"],
  ["le kiwi", "Kiwi", "kiwi", "🥝", "gleich"], ["le popcorn", "Popcorn", "popcorn", "🍿", "gleich"],
  ["le koala", "Koala", "koala", "🐨", "gleich"], ["le panda", "Panda", "panda", "🐼", "gleich"],
  ["l’ananas", "Ananas", null, "🍍", "gleich"], ["le papa", "Papa", null, "👨", "gleich"],
  ["le zoo", "Zoo", "zoo", null, "gleich"], ["la question", "Frage", "question", "❓", "gleich"],
  ["la lampe", "Lampe", "lamp", null, "gleich"], ["la table", "Tisch", "table", null, "gleich"],
  // aehnlich: mit etwas Mut zu erkennen
  ["la musique", "Musik", "music", "🎵", "aehnlich"], ["le zèbre", "Zebra", "zebra", "🦓", "aehnlich"],
  ["l’éléphant", "Elefant", "elephant", "🐘", "aehnlich"], ["le tigre", "Tiger", "tiger", "🐯", "aehnlich"],
  ["le kangourou", "Känguru", "kangaroo", "🦘", "aehnlich"], ["le chocolat", "Schokolade", "chocolate", "🍫", "aehnlich"],
  ["la salade", "Salat", "salad", "🥗", "aehnlich"], ["le citron", "Zitrone", null, "🍋", "aehnlich"],
  ["la soupe", "Suppe", "soup", "🍲", "aehnlich"], ["le café", "Kaffee", "coffee", "☕", "aehnlich"],
  ["le thé", "Tee", "tea", "🍵", "aehnlich"], ["l’hélicoptère", "Helikopter", "helicopter", "🚁", "aehnlich"],
  ["la guitare", "Gitarre", "guitar", "🎸", "aehnlich"], ["la trompette", "Trompete", "trumpet", "🎺", "aehnlich"],
  ["le violon", "Geige", "violin", "🎻", "aehnlich"], ["le téléphone", "Telefon", "telephone", "☎️", "aehnlich"],
  ["la télévision", "Fernseher", "television", "📺", "aehnlich"], ["le parc", "Park", "park", "🏞️", "aehnlich"],
  ["l’hôtel", "Hotel", "hotel", "🏨", "aehnlich"], ["la banque", "Bank", "bank", "🏦", "aehnlich"],
  ["l’hôpital", "Spital", "hospital", "🏥", "aehnlich"], ["la police", "Polizei", "police", "🚓", "aehnlich"],
  ["le docteur", "Doktor", "doctor", "🧑‍⚕️", "aehnlich"], ["la famille", "Familie", "family", "👨‍👩‍👧", "aehnlich"],
  ["le bébé", "Baby", "baby", "👶", "aehnlich"], ["la maman", "Mama", null, "👩", "aehnlich"],
  ["le prince", "Prinz", "prince", "🤴", "aehnlich"], ["la princesse", "Prinzessin", "princess", "👸", "aehnlich"],
  ["le pirate", "Pirat", "pirate", "🏴‍☠️", "aehnlich"], ["le dragon", "Drache", "dragon", "🐉", "aehnlich"],
  ["le dinosaure", "Dinosaurier", "dinosaur", "🦕", "aehnlich"], ["la planète", "Planet", "planet", "🪐", "aehnlich"],
  ["la tulipe", "Tulpe", "tulip", "🌷", "aehnlich"], ["le cactus", "Kaktus", "cactus", "🌵", "aehnlich"],
  ["le melon", "Melone", "melon", "🍈", "aehnlich"], ["la mangue", "Mango", "mango", "🥭", "aehnlich"],
  ["la cerise", "Kirsche", "cherry", "🍒", "aehnlich"], ["l’animal", "Tier", "animal", "🐾", "aehnlich"],
  ["la minute", "Minute", "minute", "⏱️", "aehnlich"], ["l’idée", "Idee", "idea", "💡", "aehnlich"],
  ["la classe", "Klasse", "class", null, "aehnlich"], ["le gorille", "Gorilla", "gorilla", "🦍", "aehnlich"],
  ["le dauphin", "Delfin", "dolphin", "🐬", "aehnlich"], ["le dentiste", "Zahnarzt", "dentist", "🦷", "aehnlich"],
  ["le menu", "Menü", "menu", null, "aehnlich"], ["la photo", "Foto", "photo", null, "aehnlich"],
  ["le car", "Reisebus", null, null, "aehnlich"], // auf Schweizerdeutsch auch „Car“; englisch car = Auto
  // falle: falsche Freunde (faux amis)
  ["le magasin", "Laden", null, "🏪", "falle", "Magazin"],
  ["la cave", "Keller", "cave", null, "falle", "Höhle"],
  ["la librairie", "Buchhandlung", "library", null, "falle", "Bibliothek"],
  ["le raisin", "Trauben", "raisin", "🍇", "falle", "Rosinen"],
  ["le pain", "Brot", "pain", "🍞", "falle", "Schmerz"],
  ["le coin", "Ecke", "coin", null, "falle", "Münze"],
  ["la veste", "Jacke", null, "🧥", "falle", "Weste"],
];

const PARALLEL_SAETZE = [
  ["Le matin, je mange une banane.", "la banane", "Am Morgen esse ich eine Banane."],
  ["Mon frère joue de la guitare.", "la guitare", "Mein Bruder spielt Gitarre."],
  ["Le train arrive à la gare.", "le train", "Der Zug kommt am Bahnhof an."],
  ["Le tigre dort sous un arbre.", "le tigre", "Der Tiger schläft unter einem Baum."],
  ["Ce soir, nous mangeons au restaurant.", "le restaurant", "Heute Abend essen wir im Restaurant."],
  ["Ma sœur adore le chocolat.", "le chocolat", "Meine Schwester liebt Schokolade."],
  ["Le bus est jaune.", "le bus", "Der Bus ist gelb."],
  ["Le clown a un nez rouge.", "le clown", "Der Clown hat eine rote Nase."],
  ["Je bois un thé chaud.", "le thé", "Ich trinke einen heissen Tee."],
  ["Le dragon vole dans le ciel.", "le dragon", "Der Drache fliegt am Himmel."],
  ["Grand-mère fait une soupe.", "la soupe", "Grossmutter kocht eine Suppe."],
  ["Le crocodile nage dans la rivière.", "le crocodile", "Das Krokodil schwimmt im Fluss."],
  ["Mon cousin a un petit hamster.", "le hamster", "Mein Cousin hat einen kleinen Hamster."],
  ["Le robot parle très vite.", "le robot", "Der Roboter spricht sehr schnell."],
  ["La princesse habite dans une tour.", "la princesse", "Die Prinzessin wohnt in einem Turm."],
  ["Le samedi, je joue au tennis.", "le tennis", "Am Samstag spiele ich Tennis."],
  ["Le pirate cherche un trésor.", "le pirate", "Der Pirat sucht einen Schatz."],
  ["Je vais à l’école à vélo.", "le vélo", "Ich fahre mit dem Velo zur Schule."],
  ["Le kangourou saute très haut.", "le kangourou", "Das Känguru springt sehr hoch."],
  ["Nous écoutons de la musique.", "la musique", "Wir hören Musik."],
  ["Le dauphin nage dans la mer.", "le dauphin", "Der Delfin schwimmt im Meer."],
  ["Je coupe une tomate.", "la tomate", "Ich schneide eine Tomate."],
  ["Le docteur est très gentil.", "le docteur", "Der Doktor ist sehr nett."],
  ["L’éléphant boit beaucoup d’eau.", "l’éléphant", "Der Elefant trinkt viel Wasser."],
];
