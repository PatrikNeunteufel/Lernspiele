/* Au café: kurze Dialoge — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS2F.3.A.1 (Französisch, 2. Zyklus): a begrüssen, sich verabschieden, sich vorstellen;
   b nach dem Befinden fragen und antworten, etwas bestellen, nach dem Preis fragen.
   Selbst geschrieben, nicht aus einem Lehrmittel. Gängiger Grundwortschatz der ersten
   Französischjahre; das Lehrmittel („dis donc!“) lag nicht vor.

   Inhaltsliste (Entscheid L4 a): alles in dieser Datei gehört zur Liste „dialoge“ (Katalog,
   Spiel „au-cafe“, Feld listen) — die Dialoge, die Formeln mit Bild (Stufe 1), die Antworten auf
   „Ça va ?“ (Stufe 2) und die Paare tu/vous.

   Schreibweise: korrekte Akzente, Apostroph ’ (U+2019). Vor ? und ! steht wie im Französischen ein
   Leerzeichen; das Spiel macht es geschützt, damit das Zeichen nicht allein auf eine neue Zeile rutscht.
   tu / vous: Kinder untereinander und Erwachsene zu Kindern tu; Kinder zu fremden Erwachsenen und im
   Café (Gast und Kellnerin) vous; mehrere Personen immer vous.
   Preise in ganzen Franken, Zahlen bis 20. Namen sind erfunden.

   CAFE_SPRECHER: Kürzel → [Bild, Name].
   CAFE_SACHEN:   Schlüssel → [französisch, Bild, deutsch] — was man im Café bestellen kann.
   CAFE_DIALOGE:  { id, thema: "gruss" | "vorstellen" | "bestellen", repliken: [[Sprecher, französisch,
                  deutsch, Art], …], bestellung?: { sache, anzahl, preis } }
                  Art (für die Aufgabe „Welche Antwort passt?“): gruss, gruss-frage (Gruss mit Frage nach dem
                  Befinden), befinden, name-frage, name, alter-frage, alter, wohnort-frage, wohnort, freude,
                  abschied, bestell-frage, bestellung, groesse-frage, groesse, noch-frage, noch, bringen,
                  preis-frage, preis, bezahlen, dank.
   CAFE_FORMELN:  Schlüssel → [französisch, deutsch]; CAFE_SITUATIONEN: [Bild, Situation, Formel].
   CAFE_BEFINDEN: [Gefühl, französisch, deutsch]; Gefühl gut / mittel / schlecht, Bild in CAFE_GESICHTER.
   CAFE_TU_VOUS:  [mit tu, mit vous, was du sagen willst]; CAFE_PERSONEN: [Bild, mit wem, "tu" | "vous", ab Stufe]. */

const CAFE_LISTEN = ["dialoge"];

const CAFE_SPRECHER = {
  k: ["👧", "Lina"], j: ["👦", "Noé"], d: ["👵", "Madame Rochat"], s: ["👩", "la serveuse"], v: ["👨", "le serveur"],
};

const CAFE_SACHEN = {
  chocolat: ["chocolat chaud", "☕", "heisse Schokolade"],
  croissant: ["croissant", "🥐", "Gipfeli"],
  jus: ["jus d’orange", "🍊", "Orangensaft"],
  glaceVanille: ["glace à la vanille", "🍦", "Vanilleglace"],
  glaceChocolat: ["glace au chocolat", "🍨", "Schokoladenglace"],
  crepe: ["crêpe", "🥞", "Crêpe"],
  the: ["thé", "🍵", "Tee"],
  eau: ["eau minérale", "💧", "Mineralwasser"],
  sandwich: ["sandwich", "🥪", "Sandwich"],
  tarte: ["tarte aux pommes", "🥧", "Apfelkuchen"],
  limonade: ["limonade", "🍋", "Limonade"],
};

const CAFE_DIALOGE = [
  // ---- begrüssen, Befinden, verabschieden ----
  { id: "g1", thema: "gruss", repliken: [
    ["j", "Salut, Lina !", "Hallo, Lina!", "gruss"],
    ["k", "Salut, Noé ! Ça va ?", "Hallo, Noé! Geht’s gut?", "gruss-frage"],
    ["j", "Ça va bien, merci. Et toi ?", "Gut, danke. Und dir?", "befinden"],
    ["k", "Très bien, merci !", "Sehr gut, danke!", "befinden"]] },
  { id: "g2", thema: "gruss", repliken: [
    ["d", "Bonjour, Lina !", "Guten Tag, Lina!", "gruss"],
    ["k", "Bonjour, Madame Rochat ! Comment allez-vous ?", "Guten Tag, Frau Rochat! Wie geht es Ihnen?", "gruss-frage"],
    ["d", "Très bien, merci. Et toi ?", "Sehr gut, danke. Und dir?", "befinden"],
    ["k", "Ça va bien, merci.", "Mir geht es gut, danke.", "befinden"]] },
  { id: "g3", thema: "gruss", repliken: [
    ["j", "Bonjour !", "Hallo!", "gruss"],
    ["k", "Bonjour, Noé ! Ça va ?", "Hallo, Noé! Geht’s gut?", "gruss-frage"],
    ["j", "Pas très bien. Je suis malade.", "Nicht so gut. Ich bin krank.", "befinden"]] },
  { id: "g4", thema: "gruss", repliken: [
    ["k", "Salut, Noé ! Comment ça va ?", "Hallo, Noé! Wie geht’s?", "gruss-frage"],
    ["j", "Comme ci, comme ça. Et toi ?", "Es geht so. Und dir?", "befinden"],
    ["k", "Super, merci !", "Super, danke!", "befinden"]] },
  { id: "g5", thema: "gruss", repliken: [
    ["j", "Au revoir, Madame Rochat !", "Auf Wiedersehen, Frau Rochat!", "abschied"],
    ["d", "Au revoir, Noé ! Bonne journée !", "Auf Wiedersehen, Noé! Einen schönen Tag!", "abschied"]] },
  { id: "g6", thema: "gruss", repliken: [
    ["k", "Salut, Noé ! À demain !", "Tschüss, Noé! Bis morgen!", "abschied"],
    ["j", "Oui, à demain ! Salut, Lina !", "Ja, bis morgen! Tschüss, Lina!", "abschied"]] },
  { id: "g7", thema: "gruss", repliken: [
    ["d", "Bonsoir, Lina !", "Guten Abend, Lina!", "gruss"],
    ["k", "Bonsoir, Madame Rochat !", "Guten Abend, Frau Rochat!", "gruss"]] },

  // ---- sich vorstellen: Name, Alter, Wohnort ----
  { id: "v1", thema: "vorstellen", repliken: [
    ["j", "Salut ! Comment tu t’appelles ?", "Hallo! Wie heisst du?", "name-frage"],
    ["k", "Je m’appelle Lina. Et toi ?", "Ich heisse Lina. Und du?", "name"],
    ["j", "Moi, je m’appelle Noé.", "Ich heisse Noé.", "name"]] },
  { id: "v2", thema: "vorstellen", repliken: [
    ["d", "Bonjour ! Comment tu t’appelles ?", "Guten Tag! Wie heisst du?", "name-frage"],
    ["j", "Je m’appelle Noé.", "Ich heisse Noé.", "name"],
    ["d", "Tu as quel âge, Noé ?", "Wie alt bist du, Noé?", "alter-frage"],
    ["j", "J’ai onze ans.", "Ich bin elf Jahre alt.", "alter"]] },
  { id: "v3", thema: "vorstellen", repliken: [
    ["k", "Tu as quel âge ?", "Wie alt bist du?", "alter-frage"],
    ["j", "J’ai douze ans. Et toi ?", "Ich bin zwölf. Und du?", "alter"],
    ["k", "Moi, j’ai dix ans.", "Ich bin zehn.", "alter"]] },
  { id: "v4", thema: "vorstellen", repliken: [
    ["j", "Tu habites où ?", "Wo wohnst du?", "wohnort-frage"],
    ["k", "J’habite à Saint-Gall. Et toi ?", "Ich wohne in St. Gallen. Und du?", "wohnort"],
    ["j", "Moi, j’habite à Wil.", "Ich wohne in Wil.", "wohnort"]] },
  { id: "v5", thema: "vorstellen", repliken: [
    ["k", "Bonjour, Madame ! Comment vous appelez-vous ?", "Guten Tag! Wie heissen Sie?", "name-frage"],
    ["d", "Je m’appelle Anne Rochat. Et toi ?", "Ich heisse Anne Rochat. Und du?", "name"],
    ["k", "Je m’appelle Lina.", "Ich heisse Lina.", "name"],
    ["d", "Enchantée, Lina !", "Freut mich, Lina!", "freude"]] },
  { id: "v6", thema: "vorstellen", repliken: [
    ["j", "Salut ! Je m’appelle Noé. Et toi ?", "Hallo! Ich heisse Noé. Und du?", "name"],
    ["k", "Moi, c’est Lina.", "Ich bin Lina.", "name"],
    ["j", "Tu habites où, Lina ?", "Wo wohnst du, Lina?", "wohnort-frage"],
    ["k", "J’habite à Berne.", "Ich wohne in Bern.", "wohnort"]] },

  // ---- bestellen und bezahlen (im Café: vous) ----
  { id: "b1", thema: "bestellen", bestellung: { sache: "chocolat", anzahl: 1, preis: 5 }, repliken: [
    ["s", "Bonjour ! Vous désirez ?", "Guten Tag! Was wünschen Sie?", "bestell-frage"],
    ["k", "Je voudrais un chocolat chaud, s’il vous plaît.", "Ich hätte gern eine heisse Schokolade, bitte.", "bestellung"],
    ["s", "Voilà. Ça fait cinq francs.", "Bitte schön. Das macht fünf Franken.", "preis"],
    ["k", "Voilà cinq francs. Merci !", "Hier sind fünf Franken. Danke!", "bezahlen"]] },
  { id: "b2", thema: "bestellen", bestellung: { sache: "croissant", anzahl: 1, preis: 2 }, repliken: [
    ["v", "Bonjour ! Qu’est-ce que vous prenez ?", "Guten Tag! Was nehmen Sie?", "bestell-frage"],
    ["j", "Un croissant, s’il vous plaît.", "Ein Gipfeli, bitte.", "bestellung"],
    ["v", "Voilà votre croissant.", "Hier ist Ihr Gipfeli.", "bringen"],
    ["j", "Merci ! Ça fait combien ?", "Danke! Wie viel macht das?", "preis-frage"],
    ["v", "Ça fait deux francs.", "Das macht zwei Franken.", "preis"]] },
  { id: "b3", thema: "bestellen", bestellung: { sache: "jus", anzahl: 1, preis: 4 }, repliken: [
    ["s", "Bonjour ! Vous désirez ?", "Guten Tag! Was wünschen Sie?", "bestell-frage"],
    ["k", "Je voudrais un jus d’orange, s’il vous plaît.", "Ich hätte gern einen Orangensaft, bitte.", "bestellung"],
    ["s", "Petit ou grand ?", "Klein oder gross?", "groesse-frage"],
    ["k", "Grand, s’il vous plaît.", "Gross, bitte.", "groesse"],
    ["s", "Voilà. Ça fait quatre francs.", "Bitte schön. Das macht vier Franken.", "preis"]] },
  { id: "b4", thema: "bestellen", bestellung: { sache: "glaceVanille", anzahl: 1, preis: 3 }, repliken: [
    ["v", "Bonjour ! Vous désirez ?", "Guten Tag! Was wünschen Sie?", "bestell-frage"],
    ["j", "Une glace à la vanille, s’il vous plaît.", "Eine Vanilleglace, bitte.", "bestellung"],
    ["v", "Voilà. Ça fait trois francs.", "Bitte schön. Das macht drei Franken.", "preis"],
    ["j", "Voilà trois francs. Merci !", "Hier sind drei Franken. Danke!", "bezahlen"],
    ["v", "Merci ! Au revoir !", "Danke! Auf Wiedersehen!", "abschied"]] },
  { id: "b5", thema: "bestellen", bestellung: { sache: "crepe", anzahl: 1, preis: 6 }, repliken: [
    ["s", "Bonjour ! Qu’est-ce que vous prenez ?", "Guten Tag! Was nehmen Sie?", "bestell-frage"],
    ["k", "Je prends une crêpe au chocolat, s’il vous plaît.", "Ich nehme eine Crêpe mit Schokolade, bitte.", "bestellung"],
    ["s", "Voilà. Bon appétit !", "Bitte schön. En Guete!", "bringen"],
    ["k", "Merci ! C’est combien ?", "Danke! Wie viel kostet das?", "preis-frage"],
    ["s", "Ça fait six francs.", "Das macht sechs Franken.", "preis"]] },
  { id: "b6", thema: "bestellen", bestellung: { sache: "the", anzahl: 1, preis: 4 }, repliken: [
    ["k", "Bonjour, Madame ! Un thé, s’il vous plaît.", "Guten Tag! Einen Tee, bitte.", "bestellung"],
    ["s", "Bien sûr. Voilà votre thé.", "Gerne. Hier ist Ihr Tee.", "bringen"],
    ["k", "Merci. Ça fait combien ?", "Danke. Wie viel macht das?", "preis-frage"],
    ["s", "Quatre francs, s’il vous plaît.", "Vier Franken, bitte.", "preis"]] },
  { id: "b7", thema: "bestellen", bestellung: { sache: "croissant", anzahl: 2, preis: 4 }, repliken: [
    ["v", "Bonjour ! Vous désirez ?", "Guten Tag! Was wünschen Sie?", "bestell-frage"],
    ["j", "Je voudrais deux croissants, s’il vous plaît.", "Ich hätte gern zwei Gipfeli, bitte.", "bestellung"],
    ["v", "Voilà. Ça fait quatre francs.", "Bitte schön. Das macht vier Franken.", "preis"],
    ["j", "Voilà quatre francs. Au revoir !", "Hier sind vier Franken. Auf Wiedersehen!", "bezahlen"]] },
  { id: "b8", thema: "bestellen", bestellung: { sache: "eau", anzahl: 1, preis: 3 }, repliken: [
    ["s", "Bonjour ! Qu’est-ce que vous prenez ?", "Guten Tag! Was nehmen Sie?", "bestell-frage"],
    ["k", "Je voudrais une eau minérale, s’il vous plaît.", "Ich hätte gern ein Mineralwasser, bitte.", "bestellung"],
    ["s", "Voilà. Ça fait trois francs.", "Bitte schön. Das macht drei Franken.", "preis"],
    ["k", "Merci beaucoup !", "Vielen Dank!", "dank"]] },
  { id: "b9", thema: "bestellen", bestellung: { sache: "sandwich", anzahl: 1, preis: 7 }, repliken: [
    ["v", "Bonsoir ! Vous désirez ?", "Guten Abend! Was wünschen Sie?", "bestell-frage"],
    ["j", "Un sandwich au fromage, s’il vous plaît.", "Ein Käsesandwich, bitte.", "bestellung"],
    ["v", "Et avec ça ?", "Sonst noch etwas?", "noch-frage"],
    ["j", "C’est tout, merci.", "Das ist alles, danke.", "noch"],
    ["v", "Alors, ça fait sept francs.", "Also, das macht sieben Franken.", "preis"]] },
  { id: "b10", thema: "bestellen", bestellung: { sache: "glaceChocolat", anzahl: 3, preis: 12 }, repliken: [
    ["s", "Bonjour ! Vous désirez ?", "Guten Tag! Was wünschen Sie?", "bestell-frage"],
    ["k", "Trois glaces au chocolat, s’il vous plaît.", "Drei Schokoladenglaces, bitte.", "bestellung"],
    ["s", "Voilà vos glaces. Ça fait douze francs.", "Hier sind Ihre Glaces. Das macht zwölf Franken.", "preis"],
    ["k", "Voilà douze francs. Merci !", "Hier sind zwölf Franken. Danke!", "bezahlen"],
    ["s", "Merci ! Bonne journée !", "Danke! Einen schönen Tag!", "abschied"]] },
  { id: "b11", thema: "bestellen", bestellung: { sache: "tarte", anzahl: 1, preis: 5 }, repliken: [
    ["v", "Bonjour ! Qu’est-ce que vous prenez ?", "Guten Tag! Was nehmen Sie?", "bestell-frage"],
    ["k", "Je voudrais une tarte aux pommes, s’il vous plaît.", "Ich hätte gern einen Apfelkuchen, bitte.", "bestellung"],
    ["v", "Voilà votre tarte.", "Hier ist Ihr Kuchen.", "bringen"],
    ["k", "Merci ! C’est combien ?", "Danke! Wie viel kostet das?", "preis-frage"],
    ["v", "Cinq francs, s’il vous plaît.", "Fünf Franken, bitte.", "preis"]] },
  { id: "b12", thema: "bestellen", bestellung: { sache: "chocolat", anzahl: 2, preis: 10 }, repliken: [
    ["s", "Bonjour ! Vous désirez ?", "Guten Tag! Was wünschen Sie?", "bestell-frage"],
    ["j", "Deux chocolats chauds, s’il vous plaît.", "Zwei heisse Schokoladen, bitte.", "bestellung"],
    ["s", "Voilà. Ça fait dix francs.", "Bitte schön. Das macht zehn Franken.", "preis"],
    ["j", "Voilà dix francs. Merci !", "Hier sind zehn Franken. Danke!", "bezahlen"]] },
  { id: "b13", thema: "bestellen", bestellung: { sache: "croissant", anzahl: 4, preis: 8 }, repliken: [
    ["v", "Bonjour ! Vous désirez ?", "Guten Tag! Was wünschen Sie?", "bestell-frage"],
    ["k", "Quatre croissants, s’il vous plaît.", "Vier Gipfeli, bitte.", "bestellung"],
    ["v", "Et avec ça ?", "Sonst noch etwas?", "noch-frage"],
    ["k", "C’est tout. Ça fait combien ?", "Das ist alles. Wie viel macht das?", "preis-frage"],
    ["v", "Ça fait huit francs.", "Das macht acht Franken.", "preis"]] },
  { id: "b14", thema: "bestellen", bestellung: { sache: "crepe", anzahl: 3, preis: 18 }, repliken: [
    ["s", "Bonsoir ! Qu’est-ce que vous prenez ?", "Guten Abend! Was nehmen Sie?", "bestell-frage"],
    ["j", "Trois crêpes, s’il vous plaît.", "Drei Crêpes, bitte.", "bestellung"],
    ["s", "Voilà vos crêpes. Bon appétit !", "Hier sind Ihre Crêpes. En Guete!", "bringen"],
    ["j", "Merci ! C’est combien ?", "Danke! Wie viel kostet das?", "preis-frage"],
    ["s", "Ça fait dix-huit francs.", "Das macht achtzehn Franken.", "preis"],
    ["j", "Voilà dix-huit francs. Au revoir !", "Hier sind achtzehn Franken. Auf Wiedersehen!", "bezahlen"]] },
  { id: "b15", thema: "bestellen", bestellung: { sache: "sandwich", anzahl: 2, preis: 14 }, repliken: [
    ["v", "Bonjour ! Vous désirez ?", "Guten Tag! Was wünschen Sie?", "bestell-frage"],
    ["k", "Je voudrais deux sandwichs, s’il vous plaît.", "Ich hätte gern zwei Sandwichs, bitte.", "bestellung"],
    ["v", "Voilà. Ça fait quatorze francs.", "Bitte schön. Das macht vierzehn Franken.", "preis"],
    ["k", "Voilà quatorze francs. Merci, au revoir !", "Hier sind vierzehn Franken. Danke, auf Wiedersehen!", "bezahlen"]] },
  { id: "b16", thema: "bestellen", bestellung: { sache: "limonade", anzahl: 1, preis: 4 }, repliken: [
    ["s", "Bonjour ! Qu’est-ce que vous prenez ?", "Guten Tag! Was nehmen Sie?", "bestell-frage"],
    ["j", "Une limonade, s’il vous plaît.", "Eine Limonade, bitte.", "bestellung"],
    ["s", "Petite ou grande ?", "Klein oder gross?", "groesse-frage"],
    ["j", "Petite, s’il vous plaît.", "Klein, bitte.", "groesse"],
    ["s", "Voilà. Ça fait quatre francs.", "Bitte schön. Das macht vier Franken.", "preis"],
    ["j", "Merci ! Au revoir !", "Danke! Auf Wiedersehen!", "abschied"]] },
];

// Stufe 1: Formeln zum Bild
const CAFE_FORMELN = {
  bonjour: ["Bonjour !", "Guten Tag!"],
  aurevoir: ["Au revoir !", "Auf Wiedersehen!"],
  merci: ["Merci !", "Danke!"],
  svp: ["S’il vous plaît.", "Bitte."],
};
const CAFE_SITUATIONEN = [
  ["☕🚪", "Du kommst ins Café.", "bonjour"],
  ["🥐🌅", "Du gehst am Morgen in die Bäckerei.", "bonjour"],
  ["👵👋", "Du triffst am Morgen deine Nachbarin.", "bonjour"],
  ["🚪👋", "Du gehst aus dem Café hinaus.", "aurevoir"],
  ["🏠🚶", "Der Besuch geht nach Hause.", "aurevoir"],
  ["🍦🙂", "Die Kellnerin bringt dir die Glace.", "merci"],
  ["🎁", "Du bekommst ein Geschenk.", "merci"],
  ["🚪🙂", "Jemand hält dir die Türe auf.", "merci"],
  ["🙏", "Du möchtest höflich um etwas bitten.", "svp"],
  ["🍊", "Du bestellst: „Un jus d’orange, …“", "svp"],
];

// Stufe 2: Ça va ? — Gesicht und passende Antwort
const CAFE_GESICHTER = { gut: "😀", mittel: "😐", schlecht: "🤒" };
const CAFE_BEFINDEN = [
  ["gut", "Ça va bien, merci.", "Gut, danke."],
  ["gut", "Très bien, merci !", "Sehr gut, danke!"],
  ["gut", "Super, merci !", "Super, danke!"],
  ["mittel", "Comme ci, comme ça.", "Es geht so."],
  ["mittel", "Bof … ça peut aller.", "Na ja … es geht."],
  ["schlecht", "Ça ne va pas. Je suis malade.", "Es geht mir nicht gut. Ich bin krank."],
  ["schlecht", "Pas très bien. J’ai mal à la tête.", "Nicht so gut. Ich habe Kopfweh."],
];

// tu oder vous
const CAFE_TU_VOUS = [
  ["Et toi ?", "Et vous ?", "Du fragst zurück: Und …?"],
  ["Comment tu t’appelles ?", "Comment vous appelez-vous ?", "Du fragst nach dem Namen."],
  ["Comment vas-tu ?", "Comment allez-vous ?", "Du fragst, wie es geht."],
  ["Tu habites où ?", "Vous habitez où ?", "Du fragst, wo jemand wohnt."],
  ["S’il te plaît.", "S’il vous plaît.", "Du sagst bitte."],
  ["Tu veux un croissant ?", "Vous voulez un croissant ?", "Du bietest ein Gipfeli an."],
  ["Tu as un stylo ?", "Vous avez un stylo ?", "Du fragst nach einem Stift."],
];
const CAFE_PERSONEN = [
  ["👧", "mit deiner Freundin", "tu", 4],
  ["👦", "mit deinem Bruder", "tu", 4],
  ["🧒", "mit einem Kind auf dem Spielplatz", "tu", 4],
  ["👩", "mit der Kellnerin im Café", "vous", 4],
  ["👨", "mit dem Verkäufer in der Bäckerei", "vous", 4],
  ["👵", "mit einer fremden Frau auf der Strasse", "vous", 4],
  ["👮", "mit einem Polizisten", "vous", 4],
  ["👧👦", "mit zwei Freunden zugleich", "vous", 6],
];
