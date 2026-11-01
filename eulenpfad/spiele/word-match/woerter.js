/* Englische Wörter für Word-Match — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS1E.5.B.1: a „begrenztes Repertoire an einzelnen Wörtern und Wendungen“ zu vertrauten
   Themen, b „elementares Repertoire an häufigen Wörtern und Wendungen“.
   Je Eintrag: [englisch, deutsch, Bild]. Britische Schreibweise. Deutsch in Schweizer Schreibweise.
   Wendungen ohne Bild stehen unter „wendungen“.

   Inhaltslisten (Entscheid L4 a): das Feld „liste“ je Thema nennt die Liste; Familie und Körper
   bilden zusammen eine Liste („familie-koerper“), WENDUNGEN_EN ist die Liste „wendungen“.
   Der Prüfstand steht im Katalog (spiele/gemeinsam/katalog.js, Eintrag „word-match“, Feld listen). */

const THEMEN_EN = {
  farben: { name: "Colours", liste: "farben", woerter: [
    ["red", "rot", "🟥"], ["blue", "blau", "🟦"], ["green", "grün", "🟩"], ["yellow", "gelb", "🟨"],
    ["black", "schwarz", "⬛"], ["white", "weiss", "⬜"], ["orange", "orange", "🟧"], ["purple", "violett", "🟪"],
    ["brown", "braun", "🟫"],
  ] },
  tiere: { name: "Animals", liste: "tiere", woerter: [
    ["dog", "Hund", "🐶"], ["cat", "Katze", "🐱"], ["bird", "Vogel", "🐦"], ["fish", "Fisch", "🐟"],
    ["horse", "Pferd", "🐴"], ["cow", "Kuh", "🐄"], ["pig", "Schwein", "🐷"], ["mouse", "Maus", "🐭"],
    ["sheep", "Schaf", "🐑"], ["duck", "Ente", "🦆"], ["frog", "Frosch", "🐸"], ["lion", "Löwe", "🦁"],
  ] },
  zahlen: { name: "Numbers", liste: "zahlen", woerter: [
    ["one", "eins", "1️⃣"], ["two", "zwei", "2️⃣"], ["three", "drei", "3️⃣"], ["four", "vier", "4️⃣"],
    ["five", "fünf", "5️⃣"], ["six", "sechs", "6️⃣"], ["seven", "sieben", "7️⃣"], ["eight", "acht", "8️⃣"],
    ["nine", "neun", "9️⃣"], ["ten", "zehn", "🔟"],
  ] },
  essen: { name: "Food", liste: "essen", woerter: [
    ["apple", "Apfel", "🍎"], ["banana", "Banane", "🍌"], ["bread", "Brot", "🍞"], ["milk", "Milch", "🥛"],
    ["cheese", "Käse", "🧀"], ["egg", "Ei", "🥚"], ["cake", "Kuchen", "🍰"], ["carrot", "Karotte", "🥕"],
    ["strawberry", "Erdbeere", "🍓"], ["water", "Wasser", "💧"],
  ] },
  familie: { name: "Family", liste: "familie-koerper", woerter: [
    ["mother", "Mutter", "👩"], ["father", "Vater", "👨"], ["sister", "Schwester", "👧"], ["brother", "Bruder", "👦"],
    ["baby", "Baby", "👶"], ["grandmother", "Grossmutter", "👵"], ["grandfather", "Grossvater", "👴"],
  ] },
  schule: { name: "School", liste: "schule", woerter: [
    ["book", "Buch", "📖"], ["pencil", "Bleistift", "✏️"], ["ruler", "Lineal", "📏"], ["scissors", "Schere", "✂️"],
    ["chair", "Stuhl", "🪑"], ["clock", "Uhr", "🕒"], ["teacher", "Lehrerin / Lehrer", "🧑‍🏫"],
  ] },
  koerper: { name: "Body", liste: "familie-koerper", woerter: [
    ["hand", "Hand", "✋"], ["foot", "Fuss", "🦶"], ["eye", "Auge", "👁️"], ["ear", "Ohr", "👂"],
    ["nose", "Nase", "👃"], ["mouth", "Mund", "👄"],
  ] },
  wetter: { name: "Weather", liste: "wetter", woerter: [
    ["sun", "Sonne", "☀️"], ["rain", "Regen", "🌧️"], ["snow", "Schnee", "❄️"], ["wind", "Wind", "🌬️"],
    ["cloud", "Wolke", "☁️"],
  ] },
};

const WENDUNGEN_EN = [
  ["Hello!", "Hallo!"], ["Goodbye!", "Auf Wiedersehen!"], ["Good morning!", "Guten Morgen!"],
  ["Good night!", "Gute Nacht!"], ["Thank you!", "Danke!"], ["Please.", "Bitte."],
  ["How are you?", "Wie geht es dir?"], ["I'm fine.", "Mir geht es gut."],
  ["What's your name?", "Wie heisst du?"], ["My name is Tim.", "Ich heisse Tim."],
  ["How old are you?", "Wie alt bist du?"], ["I'm nine.", "Ich bin neun."],
];
