/* Le ou la? Französische Nomen mit Geschlecht und Mehrzahl — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS2F.5.D.2.a (bestimmter und unbestimmter Artikel, Einzahl und Mehrzahl) und
   FS2F.5.D.1.a. Gängiger Grundwortschatz, nichts aus dem Lehrmittel „dis donc!“ abgeschrieben.

   Inhaltsliste „nomen“ (Entscheid L4 a; Katalog, Eintrag „le-ou-la“, Feld listen).

   Je Eintrag: [Wort ohne Artikel, Geschlecht "m" oder "f", Mehrzahl, Bild, Deutsch, Ausnahme?]
   - Mehrzahl im Normalfall: Wort + s (le chat – les chats). Dann bleibt das letzte Feld leer.
   - Ausnahmen sind gekennzeichnet:
     „eau“    -eau → -eaux (le gâteau – les gâteaux)
     „al“     -al → -aux (le cheval – les chevaux)
     „eu“     -eu → -eux (le jeu – les jeux)
     „gleich“ Wort endet auf -s, -x oder -z und bleibt gleich (la souris – les souris)
     „oeil“   l’œil – les yeux
   - l’ steht vor Vokal und stummem h (l’arbre, l’hôpital). Wörter mit „h aspiré“ (le héros, le hibou)
     sind mit Absicht nicht in der Liste: dort gibt es kein l’.
   Deutsch in Schweizer Schreibweise (ss, Velo, Spital, Glace). */

const NOMEN = [
  // männlich, Konsonant am Anfang
  ["chat", "m", "chats", "🐱", "Katze"], ["chien", "m", "chiens", "🐶", "Hund"],
  ["cheval", "m", "chevaux", "🐴", "Pferd", "al"], ["lapin", "m", "lapins", "🐰", "Kaninchen"],
  ["poisson", "m", "poissons", "🐟", "Fisch"], ["canard", "m", "canards", "🦆", "Ente"],
  ["lion", "m", "lions", "🦁", "Löwe"], ["singe", "m", "singes", "🐒", "Affe"],
  ["serpent", "m", "serpents", "🐍", "Schlange"], ["mouton", "m", "moutons", "🐑", "Schaf"],
  ["cochon", "m", "cochons", "🐷", "Schwein"], ["papillon", "m", "papillons", "🦋", "Schmetterling"],
  ["gâteau", "m", "gâteaux", "🍰", "Kuchen", "eau"], ["bateau", "m", "bateaux", "⛵", "Boot", "eau"],
  ["chapeau", "m", "chapeaux", "🎩", "Hut", "eau"], ["cadeau", "m", "cadeaux", "🎁", "Geschenk", "eau"],
  ["château", "m", "châteaux", "🏰", "Schloss", "eau"], ["drapeau", "m", "drapeaux", "🚩", "Fahne", "eau"],
  ["journal", "m", "journaux", "📰", "Zeitung", "al"], ["jeu", "m", "jeux", "🎲", "Spiel", "eu"],
  ["feu", "m", "feux", "🔥", "Feuer", "eu"], ["pain", "m", "pains", "🍞", "Brot"],
  ["fromage", "m", "fromages", "🧀", "Käse"], ["livre", "m", "livres", "📖", "Buch"],
  ["crayon", "m", "crayons", "✏️", "Bleistift"], ["vélo", "m", "vélos", "🚲", "Velo"],
  ["train", "m", "trains", "🚆", "Zug"], ["bus", "m", "bus", "🚌", "Bus", "gleich"],
  ["ballon", "m", "ballons", "⚽", "Ball"], ["nez", "m", "nez", "👃", "Nase", "gleich"],
  ["bras", "m", "bras", "💪", "Arm", "gleich"], ["pied", "m", "pieds", "🦶", "Fuss"],
  ["soleil", "m", "soleils", "☀️", "Sonne"], ["nuage", "m", "nuages", "☁️", "Wolke"],
  ["citron", "m", "citrons", "🍋", "Zitrone"], ["lit", "m", "lits", "🛏️", "Bett"],
  ["camion", "m", "camions", "🚚", "Lastwagen"], ["sac", "m", "sacs", "👜", "Tasche"],
  ["bonbon", "m", "bonbons", "🍬", "Bonbon"],
  // weiblich, Konsonant am Anfang
  ["vache", "f", "vaches", "🐄", "Kuh"], ["souris", "f", "souris", "🐭", "Maus", "gleich"],
  ["poule", "f", "poules", "🐔", "Huhn"], ["tortue", "f", "tortues", "🐢", "Schildkröte"],
  ["girafe", "f", "girafes", "🦒", "Giraffe"], ["grenouille", "f", "grenouilles", "🐸", "Frosch"],
  ["pomme", "f", "pommes", "🍎", "Apfel"], ["banane", "f", "bananes", "🍌", "Banane"],
  ["fraise", "f", "fraises", "🍓", "Erdbeere"], ["poire", "f", "poires", "🍐", "Birne"],
  ["tomate", "f", "tomates", "🍅", "Tomate"], ["carotte", "f", "carottes", "🥕", "Karotte"],
  ["pizza", "f", "pizzas", "🍕", "Pizza"], ["glace", "f", "glaces", "🍦", "Glace"],
  ["chaise", "f", "chaises", "🪑", "Stuhl"], ["maison", "f", "maisons", "🏠", "Haus"],
  ["voiture", "f", "voitures", "🚗", "Auto"], ["fleur", "f", "fleurs", "🌸", "Blume"],
  ["lune", "f", "lunes", "🌙", "Mond"], ["main", "f", "mains", "✋", "Hand"],
  ["bouche", "f", "bouches", "👄", "Mund"], ["dent", "f", "dents", "🦷", "Zahn"],
  ["jambe", "f", "jambes", "🦵", "Bein"], ["clé", "f", "clés", "🔑", "Schlüssel"],
  ["montre", "f", "montres", "⌚", "Armbanduhr"], ["guitare", "f", "guitares", "🎸", "Gitarre"],
  ["porte", "f", "portes", "🚪", "Tür"], ["fenêtre", "f", "fenêtres", "🪟", "Fenster"],
  ["cloche", "f", "cloches", "🔔", "Glocke"], ["robe", "f", "robes", "👗", "Kleid"],
  ["chaussure", "f", "chaussures", "👟", "Schuh"], ["mer", "f", "mers", "🌊", "Meer"],
  ["chemise", "f", "chemises", "👔", "Hemd"],
  // männlich, Vokal oder stummes h am Anfang (l’)
  ["oiseau", "m", "oiseaux", "🐦", "Vogel", "eau"], ["éléphant", "m", "éléphants", "🐘", "Elefant"],
  ["ours", "m", "ours", "🐻", "Bär", "gleich"], ["escargot", "m", "escargots", "🐌", "Schnecke"],
  ["animal", "m", "animaux", "🐾", "Tier", "al"], ["arbre", "m", "arbres", "🌳", "Baum"],
  ["avion", "m", "avions", "✈️", "Flugzeug"], ["œuf", "m", "œufs", "🥚", "Ei"],
  ["ordinateur", "m", "ordinateurs", "💻", "Computer"], ["hôpital", "m", "hôpitaux", "🏥", "Spital", "al"],
  ["hôtel", "m", "hôtels", "🏨", "Hotel"], ["œil", "m", "yeux", "👁️", "Auge", "oeil"],
  ["anniversaire", "m", "anniversaires", "🎂", "Geburtstag"], ["ananas", "m", "ananas", "🍍", "Ananas", "gleich"],
  // weiblich, Vokal oder stummes h am Anfang (l’)
  ["orange", "f", "oranges", "🍊", "Orange"], ["abeille", "f", "abeilles", "🐝", "Biene"],
  ["étoile", "f", "étoiles", "⭐", "Stern"], ["école", "f", "écoles", "🏫", "Schule"],
  ["île", "f", "îles", "🏝️", "Insel"], ["horloge", "f", "horloges", "🕰️", "Uhr"],
  ["oreille", "f", "oreilles", "👂", "Ohr"], ["église", "f", "églises", "⛪", "Kirche"],
  ["araignée", "f", "araignées", "🕷️", "Spinne"], ["assiette", "f", "assiettes", "🍽️", "Teller"],
];
