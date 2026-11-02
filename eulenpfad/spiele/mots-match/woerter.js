/* Französische Wörter für Mots-Match — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS2F.5.B.1 (Wortschatz zu vertrauten Themen), FS2F.2.A.1.a (Wörter mit Bild verstehen).
   Lehrmittel „dis donc!“: sein Wortschatz liegt nicht vor; hier steht gängiger Grundwortschatz der
   ersten Französischjahre, nichts aus dem Lehrmittel abgeschrieben.

   Je Eintrag: [Artikel, Wort, Deutsch, Bild]. Artikel le, la, l’ (Apostroph ’) oder les; das Wort mit
   Akzenten (é, è, ê, à, ç) und œ. Deutsch in Schweizer Schreibweise (ss, Glace, Gipfeli).
   Farben sind als Nomen männlich (le rouge); „l’orange“ ist hier die Farbe.

   Inhaltslisten (Entscheid L4 a): je Thema eine Liste, die Id ist der Schlüssel des Themas
   (farben, tiere, essen, schule, koerper-familie) wie im Katalog (spiele/gemeinsam/katalog.js,
   Eintrag „mots-match“, Feld listen). Jedes französische Wort und jedes Bild kommt nur einmal vor. */

const THEMEN_FR = {
  farben: { name: "Les couleurs", woerter: [
    ["le", "rouge", "rot", "❤️"], ["le", "bleu", "blau", "💙"], ["le", "vert", "grün", "💚"],
    ["le", "jaune", "gelb", "💛"], ["le", "noir", "schwarz", "🖤"], ["le", "blanc", "weiss", "🤍"],
    ["l’", "orange", "orange", "🧡"], ["le", "violet", "violett", "💜"], ["le", "marron", "braun", "🤎"],
    ["le", "rose", "rosa", "🩷"], ["le", "gris", "grau", "🩶"], ["le", "bleu clair", "hellblau", "🩵"],
    ["l’", "arc-en-ciel", "Regenbogen", "🌈"], ["la", "peinture", "Malfarbe", "🎨"], ["le", "pinceau", "Pinsel", "🖌️"],
  ] },
  tiere: { name: "Les animaux", woerter: [
    ["le", "chat", "Katze", "🐱"], ["le", "chien", "Hund", "🐶"], ["le", "cheval", "Pferd", "🐴"],
    ["la", "vache", "Kuh", "🐄"], ["le", "cochon", "Schwein", "🐷"], ["la", "souris", "Maus", "🐭"],
    ["le", "lapin", "Kaninchen", "🐰"], ["l’", "oiseau", "Vogel", "🐦"], ["le", "poisson", "Fisch", "🐟"],
    ["le", "canard", "Ente", "🦆"], ["la", "grenouille", "Frosch", "🐸"], ["le", "lion", "Löwe", "🦁"],
    ["l’", "éléphant", "Elefant", "🐘"], ["la", "girafe", "Giraffe", "🦒"], ["le", "singe", "Affe", "🐒"],
    ["le", "serpent", "Schlange", "🐍"], ["la", "poule", "Huhn", "🐔"], ["le", "mouton", "Schaf", "🐑"],
    ["l’", "ours", "Bär", "🐻"], ["la", "tortue", "Schildkröte", "🐢"], ["l’", "escargot", "Schnecke", "🐌"],
    ["le", "papillon", "Schmetterling", "🦋"], ["l’", "abeille", "Biene", "🐝"],
  ] },
  essen: { name: "Manger et boire", woerter: [
    ["le", "pain", "Brot", "🍞"], ["le", "fromage", "Käse", "🧀"], ["la", "pomme", "Apfel", "🍎"],
    ["la", "banane", "Banane", "🍌"], ["la", "fraise", "Erdbeere", "🍓"], ["la", "poire", "Birne", "🍐"],
    ["le", "gâteau", "Kuchen", "🍰"], ["le", "lait", "Milch", "🥛"], ["l’", "eau", "Wasser", "💧"],
    ["l’", "œuf", "Ei", "🥚"], ["la", "carotte", "Karotte", "🥕"], ["la", "tomate", "Tomate", "🍅"],
    ["le", "chocolat", "Schokolade", "🍫"], ["la", "glace", "Glace", "🍦"], ["la", "pizza", "Pizza", "🍕"],
    ["les", "frites", "Pommes frites", "🍟"], ["le", "croissant", "Gipfeli", "🥐"], ["le", "citron", "Zitrone", "🍋"],
    ["la", "pomme de terre", "Kartoffel", "🥔"], ["le", "riz", "Reis", "🍚"], ["les", "pâtes", "Teigwaren", "🍝"],
    ["le", "raisin", "Trauben", "🍇"],
  ] },
  schule: { name: "L’école", woerter: [
    ["le", "livre", "Buch", "📖"], ["le", "crayon", "Bleistift", "✏️"], ["la", "règle", "Lineal", "📏"],
    ["les", "ciseaux", "Schere", "✂️"], ["la", "chaise", "Stuhl", "🪑"], ["le", "sac à dos", "Rucksack", "🎒"],
    ["l’", "ordinateur", "Computer", "💻"], ["le", "cahier", "Heft", "📓"], ["le", "stylo", "Kugelschreiber", "🖊️"],
    ["l’", "horloge", "Uhr", "🕒"], ["la", "maîtresse", "Lehrerin", "👩‍🏫"], ["le", "maître", "Lehrer", "👨‍🏫"],
    ["l’", "école", "Schule", "🏫"], ["la", "feuille", "Blatt Papier", "📄"], ["le", "trombone", "Büroklammer", "📎"],
    ["la", "carte", "Landkarte", "🗺️"],
  ] },
  "koerper-familie": { name: "Le corps et la famille", woerter: [
    ["la", "main", "Hand", "✋"], ["le", "pied", "Fuss", "🦶"], ["l’", "œil", "Auge", "👁️"],
    ["l’", "oreille", "Ohr", "👂"], ["le", "nez", "Nase", "👃"], ["la", "bouche", "Mund", "👄"],
    ["la", "dent", "Zahn", "🦷"], ["le", "bras", "Arm", "💪"], ["la", "jambe", "Bein", "🦵"],
    ["le", "doigt", "Finger", "☝️"], ["le", "cœur", "Herz", "🫀"], ["la", "mère", "Mutter", "👩"],
    ["le", "père", "Vater", "👨"], ["la", "sœur", "Schwester", "👧"], ["le", "frère", "Bruder", "👦"],
    ["le", "bébé", "Baby", "👶"], ["la", "grand-mère", "Grossmutter", "👵"], ["le", "grand-père", "Grossvater", "👴"],
    ["la", "famille", "Familie", "👨‍👩‍👧"],
  ] },
};

/* Wörter, bei denen der andere Artikel ein anderes Wort ergibt (la livre = das Pfund): Hier gibt es
   keine Antwort mit vertauschtem Artikel. */
const ARTIKEL_DOPPELT_FR = ["livre"];
