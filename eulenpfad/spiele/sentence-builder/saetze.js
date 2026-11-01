/* Sentence-Builder: einfache englische Sätze — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS1E.5.D.1: a sehr einfache Strukturen mit Unterstützung, b einfache Strukturen.
   Britisches Englisch („have got“ für Besitz, wie im Schweizer Lehrmittel üblich — Annahme).
   Deutsch in Schweizer Schreibweise (Glace, Velo, ss statt ß).

   Inhaltslisten (Entscheid L4 a), einzeln freizugeben; der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Spiel „sentence-builder“, Feld listen):
   - „ich-saetze“:  I like … / I have got … / I can … / I am …
   - „er-sie-saetze“: She has got … / He likes … / Tom is … (3. Person)
   - „fragen“:      Do you … ? / Have you got … ? / Can you … ? / What … ?
   - „verneinung“:  I don't … / She doesn't … / I haven't got … / It isn't …

   SAETZE: [englischer Satz, deutsche Übersetzung, Liste]. Jedes Wort ist eine Karte (getrennt an
   Leerzeichen, das Satzzeichen hängt am letzten Wort). Kein Wort darf in einem Satz zweimal vorkommen,
   und keine andere Reihenfolge der Karten darf auch richtig sein.

   VERWECHSLER: falsche Form, die in oberen Stufen als überzählige Karte dazukommt (has statt have).
   Es wird das erste Wort des Satzes ersetzt, das hier steht. */

const SATZ_LISTEN = ["ich-saetze", "er-sie-saetze", "fragen", "verneinung"];

const SAETZE = [
  // ich-saetze
  ["I like cats.", "Ich mag Katzen.", "ich-saetze"],
  ["I like apples.", "Ich mag Äpfel.", "ich-saetze"],
  ["I can swim.", "Ich kann schwimmen.", "ich-saetze"],
  ["I am nine.", "Ich bin neun.", "ich-saetze"],
  ["I am happy.", "Ich bin fröhlich.", "ich-saetze"],
  ["I can sing.", "Ich kann singen.", "ich-saetze"],
  ["I like pizza.", "Ich mag Pizza.", "ich-saetze"],
  ["I can dance.", "Ich kann tanzen.", "ich-saetze"],
  ["I am ten.", "Ich bin zehn.", "ich-saetze"],
  ["I like dogs.", "Ich mag Hunde.", "ich-saetze"],
  ["I have got a dog.", "Ich habe einen Hund.", "ich-saetze"],
  ["I have got a red pencil.", "Ich habe einen roten Bleistift.", "ich-saetze"],
  ["I can play football.", "Ich kann Fussball spielen.", "ich-saetze"],
  ["I like ice cream.", "Ich mag Glace.", "ich-saetze"],
  ["I have got two sisters.", "Ich habe zwei Schwestern.", "ich-saetze"],
  ["I can ride a bike.", "Ich kann Velo fahren.", "ich-saetze"],
  ["I like my school.", "Ich mag meine Schule.", "ich-saetze"],
  ["I have got a blue bag.", "Ich habe eine blaue Tasche.", "ich-saetze"],
  ["I am from Switzerland.", "Ich komme aus der Schweiz.", "ich-saetze"],
  // er-sie-saetze
  ["She has got a cat.", "Sie hat eine Katze.", "er-sie-saetze"],
  ["He has got a bike.", "Er hat ein Velo.", "er-sie-saetze"],
  ["She likes bananas.", "Sie mag Bananen.", "er-sie-saetze"],
  ["He likes football.", "Er mag Fussball.", "er-sie-saetze"],
  ["Tom is ten.", "Tom ist zehn.", "er-sie-saetze"],
  ["Anna has got long hair.", "Anna hat lange Haare.", "er-sie-saetze"],
  ["My brother likes pizza.", "Mein Bruder mag Pizza.", "er-sie-saetze"],
  ["The dog is big.", "Der Hund ist gross.", "er-sie-saetze"],
  ["It is sunny.", "Es ist sonnig.", "er-sie-saetze"],
  ["Lisa plays the piano.", "Lisa spielt Klavier.", "er-sie-saetze"],
  ["Max eats an apple.", "Max isst einen Apfel.", "er-sie-saetze"],
  ["My cat sleeps a lot.", "Meine Katze schläft viel.", "er-sie-saetze"],
  ["She can sing.", "Sie kann singen.", "er-sie-saetze"],
  ["He can run fast.", "Er kann schnell rennen.", "er-sie-saetze"],
  ["My sister can dance.", "Meine Schwester kann tanzen.", "er-sie-saetze"],
  // fragen
  ["Do you like cats?", "Magst du Katzen?", "fragen"],
  ["Have you got a pet?", "Hast du ein Haustier?", "fragen"],
  ["Can you swim?", "Kannst du schwimmen?", "fragen"],
  ["Are you nine?", "Bist du neun?", "fragen"],
  ["Is it red?", "Ist es rot?", "fragen"],
  ["Does she like pizza?", "Mag sie Pizza?", "fragen"],
  ["Has he got a bike?", "Hat er ein Velo?", "fragen"],
  ["What is your name?", "Wie heisst du?", "fragen"],
  ["How old are you?", "Wie alt bist du?", "fragen"],
  ["Where is my bag?", "Wo ist meine Tasche?", "fragen"],
  ["Can she dance?", "Kann sie tanzen?", "fragen"],
  ["Do you like ice cream?", "Magst du Glace?", "fragen"],
  ["Is your dog big?", "Ist dein Hund gross?", "fragen"],
  // verneinung
  ["I don't like spiders.", "Ich mag keine Spinnen.", "verneinung"],
  ["She doesn't like milk.", "Sie mag keine Milch.", "verneinung"],
  ["I haven't got a cat.", "Ich habe keine Katze.", "verneinung"],
  ["He hasn't got a bike.", "Er hat kein Velo.", "verneinung"],
  ["I can't swim.", "Ich kann nicht schwimmen.", "verneinung"],
  ["It isn't cold.", "Es ist nicht kalt.", "verneinung"],
  ["We don't like rain.", "Wir mögen keinen Regen.", "verneinung"],
  ["Tom can't sing.", "Tom kann nicht singen.", "verneinung"],
  ["I am not tired.", "Ich bin nicht müde.", "verneinung"],
  ["My dog doesn't like cats.", "Mein Hund mag keine Katzen.", "verneinung"],
  ["They aren't at school.", "Sie sind nicht in der Schule.", "verneinung"],
  ["He isn't hungry.", "Er hat keinen Hunger.", "verneinung"],
];

const VERWECHSLER = {
  has: "have", have: "has", Has: "Have", Have: "Has", likes: "like", like: "likes",
  is: "are", are: "is", Is: "Are", Are: "Is", am: "is", Do: "Does", Does: "Do",
  plays: "play", eats: "eat", sleeps: "sleep",
  "don't": "doesn't", "doesn't": "don't", "haven't": "hasn't", "hasn't": "haven't", "isn't": "aren't", "aren't": "isn't",
};
