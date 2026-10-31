// Wörter für den Silben-Klatscher, in Sprechsilben getrennt („Ba-na-ne“), mit Bild.
// Sprechsilben, wie man sie klatscht — nicht die Trennung am Zeilenende: „E-le-fant“ hat
// drei Sprechsilben, getrennt wird am Zeilenende nur „Ele-fant“.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a): SILBEN_WOERTER ist nach Silbenzahl in Listen gruppiert —
// „eine-silbe“, „zwei-silben“, „drei-silben“, „vier-silben“, „fuenf-silben“. Der Prüfstand steht
// im Katalog (spiele/gemeinsam/katalog.js, Eintrag „silben-klatscher“, Feld listen).

const SILBEN_WOERTER = {
  "eine-silbe": [
  ["Hund", "🐕"], ["Maus", "🐭"], ["Ball", "⚽"], ["Baum", "🌳"], ["Haus", "🏠"], ["Fisch", "🐟"],
  ["Kuh", "🐄"], ["Schuh", "👟"], ["Mond", "🌙"], ["Stern", "⭐"], ["Brot", "🍞"], ["Hut", "🎩"],
  ["Bus", "🚌"], ["Zug", "🚆"], ["Eis", "🍦"], ["Herz", "❤️"],
  ],
  "zwei-silben": [
  ["Kat-ze", "🐈"], ["Ap-fel", "🍎"], ["Au-to", "🚗"], ["Blu-me", "🌸"], ["So-fa", "🛋️"], ["Ha-se", "🐇"],
  ["Bir-ne", "🍐"], ["Ro-se", "🌹"], ["Son-ne", "☀️"], ["Zie-ge", "🐐"], ["Kä-se", "🧀"], ["En-te", "🦆"],
  ["Lö-we", "🦁"], ["Ti-ger", "🐅"], ["Ho-se", "👖"], ["Ku-chen", "🍰"], ["Gur-ke", "🥒"], ["Bril-le", "👓"],
  ["Kir-sche", "🍒"], ["Wol-ke", "☁️"], ["Ze-bra", "🦓"], ["Kü-ken", "🐥"], ["Schne-cke", "🐌"], ["Dra-che", "🐉"],
  ["Ka-mel", "🐫"], ["Ge-schenk", "🎁"],
  ],
  "drei-silben": [
  ["Ba-na-ne", "🍌"], ["To-ma-te", "🍅"], ["E-le-fant", "🐘"], ["Pa-pa-gei", "🦜"], ["Schmet-ter-ling", "🦋"],
  ["Ka-rot-te", "🥕"], ["Te-le-fon", "☎️"], ["Ka-nin-chen", "🐰"], ["Pin-gu-in", "🐧"], ["Ra-ke-te", "🚀"],
  ["Gi-tar-re", "🎸"], ["Zi-tro-ne", "🍋"], ["Kro-ko-dil", "🐊"], ["Fle-der-maus", "🦇"], ["Schild-krö-te", "🐢"],
  ["Kän-gu-ru", "🦘"], ["Gi-raf-fe", "🦒"], ["Ok-to-pus", "🐙"], ["Ei-dech-se", "🦎"], ["Ro-bo-ter", "🤖"],
  ["Ka-len-der", "📅"], ["Re-gen-schirm", "☂️"], ["Mo-tor-rad", "🏍️"], ["Spa-ghet-ti", "🍝"], ["Schnee-flo-cke", "❄️"],
  ],
  "vier-silben": [
  ["Re-gen-bo-gen", "🌈"], ["Ba-de-wan-ne", "🛁"], ["He-li-kop-ter", "🚁"], ["Ta-schen-lam-pe", "🔦"],
  ["Son-nen-blu-me", "🌻"], ["Kran-ken-wa-gen", "🚑"],
  // UNGEPRÜFT, neu LERN_Session2 (mehr lange Wörter für die Königsstufe):
  ["Scho-ko-la-de", "🍫"], ["Kaf-fee-tas-se", "☕"], ["Ba-de-an-zug", "🩱"], ["Ba-by-fla-sche", "🍼"],
  ],
  "fuenf-silben": [
  ["Ma-ri-en-kä-fer", "🐞"], ["Lo-ko-mo-ti-ve", "🚂"], ["Was-ser-me-lo-ne", "🍉"], ["Feu-er-wehr-au-to", "🚒"],
  ["Po-li-zei-au-to", "🚓"],
  // UNGEPRÜFT, neu LERN_Session2:
  ["Kar-tof-fel-sa-lat", "🥗"],
  ],
};
