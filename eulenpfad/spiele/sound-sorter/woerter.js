/* Englische Wörter für den Sound-Sorter — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS1E.5.C.2.c: Schrift und Laut vergleichen (Beispiele im Lehrplan: my, live, life).
   Aussprache: britisches Englisch (Standard Southern British / RP), wie die Stimme en-GB des Geräts.
   Weggelassen wurden Wörter mit zwei Aussprachen (live, read, wind, close, can, room …) und Wörter,
   deren Vokal im Britischen anders klingt als im Amerikanischen beim a (bath, grass, class, ask).

   Schreibweise je Wort: [Wort, Laut, Bild] — Bild (Emoji) nur, wo es eindeutig ist; Stufe 1 nimmt
   nur Wörter mit Bild. Der Laut ist ein Schlüssel aus SOUND_LAUTE.

   Inhaltsliste (Entscheid L4 a): eine Liste „woerter“; der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag sound-sorter, Feld listen). */

// Laute: Buchstabe(n), Lautschrift (nur zum Prüfen, das Spiel zeigt sie nicht), Beispielwörter für die Körbe.
const SOUND_LAUTE = {
  "i-kurz":  { buchstabe: "i",  ipa: "/ɪ/",  beispiele: ["sit", "fish"] },
  "i-lang":  { buchstabe: "i",  ipa: "/aɪ/", beispiele: ["bike", "five"] },
  "a-kurz":  { buchstabe: "a",  ipa: "/æ/",  beispiele: ["cat", "hat"] },
  "a-lang":  { buchstabe: "a",  ipa: "/eɪ/", beispiele: ["cake", "name"] },
  "o-kurz":  { buchstabe: "o",  ipa: "/ɒ/",  beispiele: ["dog", "hot"] },
  "o-lang":  { buchstabe: "o",  ipa: "/əʊ/", beispiele: ["home", "nose"] },
  "ee":      { buchstabe: "ee", ipa: "/iː/", beispiele: ["tree", "green"] },
  "oo-kurz": { buchstabe: "oo", ipa: "/ʊ/",  beispiele: ["book", "good"] },
  "oo-lang": { buchstabe: "oo", ipa: "/uː/", beispiele: ["moon", "food"] },
};

const SOUND_WOERTER = [
  // i kurz /ɪ/ — give: Ausnahme, i-e und trotzdem kurz (nur Königsstufe als Falle, sonst hören)
  ["sit", "i-kurz", ""], ["fish", "i-kurz", "🐟"], ["big", "i-kurz", ""], ["pig", "i-kurz", "🐷"],
  ["milk", "i-kurz", "🥛"], ["swim", "i-kurz", "🏊"], ["ship", "i-kurz", "🚢"], ["win", "i-kurz", "🏆"],
  ["hill", "i-kurz", ""], ["six", "i-kurz", "6️⃣"], ["chips", "i-kurz", "🍟"], ["lips", "i-kurz", "👄"],
  ["film", "i-kurz", "🎬"], ["gift", "i-kurz", "🎁"], ["bit", "i-kurz", ""], ["kit", "i-kurz", ""],
  ["pin", "i-kurz", "📌"], ["fin", "i-kurz", ""], ["rid", "i-kurz", ""], ["slid", "i-kurz", ""],
  ["twin", "i-kurz", ""], ["give", "i-kurz", ""], ["this", "i-kurz", ""], ["sing", "i-kurz", "🎤"],

  // i lang /aɪ/
  ["bike", "i-lang", "🚲"], ["life", "i-lang", ""], ["my", "i-lang", ""], ["five", "i-lang", "5️⃣"],
  ["time", "i-lang", "⏰"], ["ride", "i-lang", ""], ["kite", "i-lang", "🪁"], ["nine", "i-lang", "9️⃣"],
  ["white", "i-lang", "⚪"], ["like", "i-lang", ""], ["rice", "i-lang", "🍚"], ["fly", "i-lang", "🪰"],
  ["sky", "i-lang", ""], ["try", "i-lang", ""], ["why", "i-lang", ""], ["by", "i-lang", ""],
  ["buy", "i-lang", ""], ["eye", "i-lang", "👁️"], ["night", "i-lang", "🌃"], ["light", "i-lang", "💡"],
  ["high", "i-lang", ""], ["bite", "i-lang", ""], ["pine", "i-lang", "🌲"], ["fine", "i-lang", ""],
  ["slide", "i-lang", "🛝"], ["hide", "i-lang", ""], ["ice", "i-lang", "🧊"], ["lion", "i-lang", "🦁"],
  ["tiger", "i-lang", "🐯"],

  // a kurz /æ/
  ["cat", "a-kurz", "🐱"], ["hat", "a-kurz", "🎩"], ["bag", "a-kurz", "👜"], ["man", "a-kurz", "👨"],
  ["hand", "a-kurz", "✋"], ["black", "a-kurz", "⚫"], ["map", "a-kurz", "🗺️"], ["jam", "a-kurz", ""],
  ["dad", "a-kurz", ""], ["van", "a-kurz", "🚐"], ["cap", "a-kurz", "🧢"], ["rat", "a-kurz", "🐀"],
  ["sad", "a-kurz", "😢"], ["apple", "a-kurz", "🍎"], ["tap", "a-kurz", "🚰"], ["mad", "a-kurz", ""],
  ["plan", "a-kurz", ""], ["have", "a-kurz", ""], ["bat", "a-kurz", "🦇"], ["lamp", "a-kurz", ""],

  // a lang /eɪ/
  ["cake", "a-lang", "🎂"], ["name", "a-lang", ""], ["plane", "a-lang", "✈️"], ["game", "a-lang", "🎮"],
  ["lake", "a-lang", ""], ["face", "a-lang", ""], ["make", "a-lang", ""], ["late", "a-lang", ""],
  ["gate", "a-lang", ""], ["snake", "a-lang", "🐍"], ["cape", "a-lang", ""], ["tape", "a-lang", ""],
  ["hate", "a-lang", ""], ["made", "a-lang", ""], ["cane", "a-lang", ""], ["wave", "a-lang", "👋"],
  ["whale", "a-lang", "🐋"], ["rain", "a-lang", "🌧️"], ["train", "a-lang", "🚆"], ["day", "a-lang", ""],
  ["play", "a-lang", ""], ["grey", "a-lang", ""], ["eight", "a-lang", "8️⃣"], ["they", "a-lang", ""],
  ["great", "a-lang", ""],

  // o kurz /ɒ/ (britisch; amerikanisch anders)
  ["hot", "o-kurz", "🔥"], ["dog", "o-kurz", "🐶"], ["box", "o-kurz", "📦"], ["frog", "o-kurz", "🐸"],
  ["clock", "o-kurz", "🕐"], ["sock", "o-kurz", "🧦"], ["stop", "o-kurz", "🛑"], ["shop", "o-kurz", "🏪"],
  ["pot", "o-kurz", ""], ["lot", "o-kurz", ""], ["hop", "o-kurz", ""], ["not", "o-kurz", ""],
  ["rock", "o-kurz", "🪨"], ["fox", "o-kurz", "🦊"], ["rod", "o-kurz", ""], ["rob", "o-kurz", ""],
  ["doll", "o-kurz", ""], ["top", "o-kurz", ""], ["on", "o-kurz", ""], ["got", "o-kurz", ""],
  ["lock", "o-kurz", "🔒"],

  // o lang /əʊ/
  ["home", "o-lang", "🏠"], ["nose", "o-lang", "👃"], ["rope", "o-lang", "🪢"], ["bone", "o-lang", "🦴"],
  ["phone", "o-lang", "📱"], ["hope", "o-lang", ""], ["note", "o-lang", ""], ["stone", "o-lang", ""],
  ["robe", "o-lang", ""], ["rode", "o-lang", ""], ["go", "o-lang", ""], ["no", "o-lang", ""],
  ["cold", "o-lang", "🥶"], ["old", "o-lang", ""], ["boat", "o-lang", "⛵"], ["coat", "o-lang", "🧥"],
  ["road", "o-lang", "🛣️"], ["snow", "o-lang", "❄️"], ["slow", "o-lang", "🐌"], ["toe", "o-lang", ""],
  ["so", "o-lang", ""], ["rose", "o-lang", "🌹"], ["globe", "o-lang", "🌍"], ["smoke", "o-lang", ""],

  // ee /iː/ — geschrieben ee, ea, e, ey
  ["tree", "ee", "🌳"], ["see", "ee", "👀"], ["sea", "ee", "🌊"], ["tea", "ee", "🍵"],
  ["green", "ee", "🟢"], ["sheep", "ee", "🐑"], ["three", "ee", "3️⃣"], ["meet", "ee", ""],
  ["meat", "ee", "🥩"], ["eat", "ee", ""], ["beach", "ee", "🏖️"], ["leaf", "ee", "🍃"],
  ["bee", "ee", "🐝"], ["he", "ee", ""], ["we", "ee", ""], ["me", "ee", ""],
  ["key", "ee", "🔑"], ["cheese", "ee", "🧀"], ["sleep", "ee", "😴"], ["seat", "ee", "💺"],
  ["team", "ee", ""], ["dream", "ee", ""], ["queen", "ee", "👸"],

  // oo kurz /ʊ/
  ["book", "oo-kurz", "📖"], ["look", "oo-kurz", ""], ["cook", "oo-kurz", "🧑‍🍳"], ["foot", "oo-kurz", "🦶"],
  ["good", "oo-kurz", "👍"], ["wood", "oo-kurz", "🪵"], ["hook", "oo-kurz", "🪝"], ["took", "oo-kurz", ""],
  ["wool", "oo-kurz", "🧶"],

  // oo lang /uː/ — geschrieben oo, ue, o, oe, ui
  ["moon", "oo-lang", "🌙"], ["food", "oo-lang", ""], ["school", "oo-lang", "🏫"], ["spoon", "oo-lang", "🥄"],
  ["zoo", "oo-lang", ""], ["boot", "oo-lang", "👢"], ["cool", "oo-lang", "😎"], ["pool", "oo-lang", ""],
  ["soon", "oo-lang", ""], ["too", "oo-lang", ""], ["tooth", "oo-lang", "🦷"], ["goose", "oo-lang", "🪿"],
  ["blue", "oo-lang", "🔵"], ["two", "oo-lang", "2️⃣"], ["shoe", "oo-lang", "👟"], ["juice", "oo-lang", "🧃"],
  ["fruit", "oo-lang", ""],
];
