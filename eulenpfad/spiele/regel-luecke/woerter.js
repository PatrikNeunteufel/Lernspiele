/* Wörter für die Regel-Lücke — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG D.5.E.1: Stufe b „sp-/st-Regel“; Stufe c „ie-Regel; ck-/tz-Regel; f-/v-Regel und
   e-/ä-Schreibung … wobei die Regel jeweils vorliegt und keine Ausnahmen vorkommen“; Stufe d mit
   Ausnahmen und Doppelkonsonantenregel.

   Schreibweise: Die Lücke steht in geschweiften Klammern, die RICHTIGE Möglichkeit zuerst:
   "B{ie|i}ne" → Lücke mit Auswahl „ie“ (richtig) oder „i“. Bild optional (Emoji).
   Schweizer Schreibweise (ss statt ß).

   Inhaltslisten (Entscheid L4 a): je Regel eine Liste, der Schlüssel ist die Liste-Id —
   „sp-st“, „ie-i“, „ck-tz“, „f-v“, „e-ae“, „doppel“. Die Ausnahmen der ie-Regel
   (REGELN["ie-i"].ausnahmen) sind eine eigene Liste, „ie-ausnahmen“. Der Prüfstand steht im
   Katalog (spiele/gemeinsam/katalog.js, Eintrag „regel-luecke“, Feld listen). */

const REGELN = {
  "sp-st": {
    name: "sp / st",
    regel: "Am Wortanfang hört man «schp» und «scht» — man schreibt aber sp und st.",
    woerter: [
      ["{St|Scht}ern", "⭐"], ["{Sp|Schp}iel", "🎲"], ["{St|Scht}ein", "🪨"], ["{St|Scht}uhl", "🪑"],
      ["{Sp|Schp}inne", "🕷️"], ["{St|Scht}ift", "✏️"], ["{St|Scht}rasse", "🛣️"], ["{Sp|Schp}ort", "⚽"],
      ["{Sp|Schp}iegel", "🪞"], ["{St|Scht}iefel", "👢"], ["{St|Scht}adt", "🏙️"], ["{Sp|Schp}inat", "🥬"],
      ["{sp|schp}ringen", "🦘"], ["{st|scht}ehen", "🧍"], ["{sp|schp}ielen", "🧸"], ["{St|Scht}empel", "📮"],
    ],
  },
  "ie-i": {
    name: "ie oder i",
    regel: "Ein lang gesprochenes i schreibt man meistens ie (Biene). Ein kurzes i schreibt man nur i (Kind).",
    woerter: [
      ["B{ie|i}ne", "🐝"], ["T{ie|i}r", "🐾"], ["Br{ie|i}f", "✉️"], ["W{ie|i}se", "🌾"], ["L{ie|i}be", "❤️"],
      ["Sp{ie|i}l", "🎲"], ["R{ie|i}se", "🧌"], ["Fl{ie|i}ge", "🪰"], ["Z{ie|i}ge", "🐐"], ["D{ie|i}b", "🦹"],
      ["K{i|ie}nd", "🧒"], ["F{i|ie}sch", "🐟"], ["B{i|ie}ld", "🖼️"], ["W{i|ie}nd", "🌬️"], ["K{i|ie}ste", "📦"],
      ["L{i|ie}cht", "💡"], ["M{i|ie}tte", "🎯"], ["Z{i|ie}mmer", "🛏️"],
    ],
    // Ausnahmen (nur Stufe 5): langes i ohne e
    ausnahmen: [["{I|Ie}gel", "🦔"], ["T{i|ie}ger", "🐯"], ["K{i|ie}no", "🎬"], ["Krokod{i|ie}l", "🐊"],
      // UNGEPRÜFT (LERN, Königsstufe 2026-10-31): weitere Ausnahmen mit langem i ohne e
      ["B{i|ie}ber", "🦫"], ["Kan{i|ie}nchen", "🐇"], ["Masch{i|ie}ne", "⚙️"], ["Benz{i|ie}n", "⛽"]],
  },
  "ck-tz": {
    name: "ck / k und tz / z",
    regel: "Nach einem kurzen Vokal schreibt man ck und tz (Zucker, Katze). Nach einem langen Vokal, nach au, ei, eu und nach l, n, r nur k und z (Haken, Pauke, Balken, Kerze).",
    woerter: [
      ["Zu{ck|k}er", "🍬"], ["De{ck|k}e", "🛌"], ["Glo{ck|k}e", "🔔"], ["Brü{ck|k}e", "🌉"], ["So{ck|k}e", "🧦"],
      ["Ja{ck|k}e", "🧥"], ["Schne{ck|k}e", "🐌"], ["Ha{k|ck}en", "🪝"], ["Pau{k|ck}e", "🥁"], ["Bal{k|ck}en", "🪵"],
      ["On{k|ck}el", "👨"], ["Wol{k|ck}e", "☁️"],
      ["Ka{tz|z}e", "🐱"], ["Mü{tz|z}e", "🧢"], ["Pla{tz|z}", "🏟️"], ["Hi{tz|z}e", "🔥"], ["Pfü{tz|z}e", "💧"],
      ["Bli{tz|z}", "⚡"], ["Ne{tz|z}", "🥅"], ["Ker{z|tz}e", "🕯️"], ["Pil{z|tz}", "🍄"], ["Hol{z|tz}", "🪵"],
      ["Her{z|tz}", "❤️"], ["Kreu{z|tz}", "✝️"],
    ],
  },
  "f-v": {
    name: "f oder v",
    regel: "Die meisten Wörter mit dem f-Laut schreibt man mit f. Nur wenige mit v — die muss man sich merken: Vogel, Vater, viel, vier, voll, von, vor …",
    woerter: [
      ["{V|F}ogel", "🐦"], ["{V|F}ater", "👨"], ["{v|f}iel", "🔢"], ["{v|f}ier", "4️⃣"], ["{v|f}oll", "🫙"],
      ["{v|f}orne", "⬆️"], ["{V|F}ieh", "🐄"],
      ["{F|V}isch", "🐟"], ["{F|V}eder", "🪶"], ["{F|V}enster", "🪟"], ["{f|v}ahren", "🚗"], ["{F|V}euer", "🔥"],
      ["{F|V}rosch", "🐸"], ["{F|V}uss", "🦶"],
    ],
  },
  "e-ae": {
    name: "e oder ä",
    regel: "Gibt es ein verwandtes Wort mit a, schreibt man ä (Hand → Hände). Sonst schreibt man e.",
    woerter: [
      ["H{ä|e}nde", "🙌"], ["Gl{ä|e}ser", "🥛"], ["M{ä|e}nner", "👨‍👨‍👦"], ["W{ä|e}lder", "🌲"], ["k{ä|e}lter", "🥶"],
      ["G{ä|e}rten", "🌷"], ["{Ä|E}pfel", "🍎"], ["F{ä|e}hre", "⛴️"],
      ["B{e|ä}tt", "🛏️"], ["F{e|ä}st", "🎉"], ["H{e|ä}md", "👕"], ["M{e|ä}sser", "🔪"], ["W{e|ä}tter", "🌦️"],
      ["{E|Ä}cke", "📐"], ["F{e|ä}ld", "🌾"],
    ],
  },
  doppel: {
    name: "Doppelkonsonant",
    regel: "Nach einem kurzen Vokal folgt oft ein doppelter Konsonant (Ball, Sonne). Nach einem langen Vokal nicht (Hose).",
    woerter: [
      ["Ba{ll|l}", "⚽"], ["So{nn|n}e", "☀️"], ["Mu{tt|t}er", "👩"], ["Te{ll|l}er", "🍽️"], ["Pu{pp|p}e", "🪆"],
      ["Su{pp|p}e", "🍲"], ["Wa{ss|s}er", "💧"], ["Hi{mm|m}el", "🌌"], ["Ta{ss|s}e", "☕"],
      ["Ho{s|ss}e", "👖"], ["Na{s|ss}e", "👃"], ["Ro{s|ss}e", "🌹"], ["Ha{s|ss}e", "🐇"],
    ],
  },
};
