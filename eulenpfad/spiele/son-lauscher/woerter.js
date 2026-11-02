/* Französische Wörter für den Son-Lauscher — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS2F.5.C.2.c: Laute und Schrift (ou, au, on, ch); FS2F.5.E.2.a: é und Nasallaute schreiben.
   Wortschatz: gängiger Grundwortschatz der ersten Französischjahre (nicht aus dem Lehrmittel „dis donc!“
   abgeschrieben). Artikel immer dabei (le, la, l’); Apostroph ’ (U+2019).

   Schreibweise je Eintrag: ["Wort mit [Lautgruppe]", Laut, Bild]
   - Die eckigen Klammern markieren die Buchstaben, die den Laut schreiben; dort steht im Spiel die Lücke.
   - Laut: Schlüssel aus SON_LAUTE. Bild (Emoji) nur, wo es eindeutig ist.
   Jedes Wort enthält nur einen der geübten Laute, damit es in genau einen Korb gehört. Weggelassen wurden
   darum zum Beispiel bonjour (on und ou), le chapeau (ch und eau), l’oiseau (oi und eau), la banane (an
   dort nicht nasal), le chien (ch und ien), la poche und la cloche (o klingt fast wie au).

   Inhaltsliste (Entscheid L4 a): eine Liste „woerter“; der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag son-lauscher, Feld listen). */

// Laute: Name auf dem Korb, Schreibweisen, Lautschrift (nur zum Prüfen, das Spiel zeigt sie nicht),
// Beispielwörter für die Körbe (ohne Artikel, alle aus der Liste unten).
const SON_LAUTE = {
  "ou": { name: "ou",      schrift: ["ou"],                   ipa: "/u/",  beispiele: ["rouge", "nous", "loup"] },
  "au": { name: "au / eau", schrift: ["au", "eau"],           ipa: "/o/",  beispiele: ["jaune", "gâteau", "bateau"] },
  "on": { name: "on",      schrift: ["on", "om"],             ipa: "/ɔ̃/",  beispiele: ["ballon", "lion", "melon"] },
  "an": { name: "an / en", schrift: ["an", "en", "am", "em"], ipa: "/ɑ̃/",  beispiele: ["maman", "lampe", "gant"] },
  "in": { name: "in / ain", schrift: ["in", "ain", "im", "ein"], ipa: "/ɛ̃/", beispiele: ["lapin", "pain", "sapin"] },
  "ch": { name: "ch",      schrift: ["ch"],                   ipa: "/ʃ/",  beispiele: ["chat", "vache", "cheval"] },
  "é":  { name: "é",       schrift: ["é"],                    ipa: "/e/",  beispiele: ["café", "vélo", "bébé"] },
  "è":  { name: "è / ê",   schrift: ["è", "ê"],               ipa: "/ɛ/",  beispiele: ["mère", "fête", "père"] },
  "oi": { name: "oi",      schrift: ["oi"],                   ipa: "/wa/", beispiele: ["trois", "roi", "noir"] },
};

const SON_WOERTER = [
  // ou /u/
  ["r[ou]ge", "ou", "🔴"], ["n[ou]s", "ou", ""], ["la s[ou]pe", "ou", "🍲"], ["le l[ou]p", "ou", "🐺"],
  ["la p[ou]le", "ou", "🐔"], ["d[ou]ze", "ou", ""], ["la r[ou]e", "ou", "🛞"], ["le c[ou]", "ou", ""],
  ["la s[ou]ris", "ou", "🐭"], ["le j[ou]r", "ou", ""], ["l’[ou]rs", "ou", "🐻"], ["la b[ou]le", "ou", ""],
  ["le hib[ou]", "ou", "🦉"],

  // au, eau /o/
  ["j[au]ne", "au", "🟡"], ["l’[eau]", "au", "💧"], ["le gât[eau]", "au", "🎂"], ["le bat[eau]", "au", "⛵"],
  ["le cad[eau]", "au", "🎁"], ["b[eau]", "au", ""], ["la s[au]ce", "au", ""], ["le tabl[eau]", "au", "🖼️"],
  ["le rid[eau]", "au", ""], ["le bur[eau]", "au", ""], ["le mart[eau]", "au", "🔨"], ["h[au]t", "au", ""],

  // on, om /ɔ̃/
  ["le ball[on]", "on", "⚽"], ["le mel[on]", "on", "🍈"], ["le cray[on]", "on", "✏️"], ["le citr[on]", "on", "🍋"],
  ["le p[on]t", "on", "🌉"], ["[on]ze", "on", ""], ["le n[om]", "on", ""], ["la mais[on]", "on", "🏠"],
  ["le sav[on]", "on", "🧼"], ["le garç[on]", "on", "👦"], ["le li[on]", "on", "🦁"], ["l[on]g", "on", ""],
  ["r[on]d", "on", ""], ["le viol[on]", "on", "🎻"], ["le p[om]pier", "on", "🧑‍🚒"],

  // an, en, am, em /ɑ̃/
  ["mam[an]", "an", ""], ["l’[en]fant", "an", "🧒"], ["gr[an]d", "an", ""], ["bl[an]c", "an", "⚪"],
  ["la d[en]t", "an", "🦷"], ["le v[en]t", "an", "🌬️"], ["tr[en]te", "an", ""], ["la j[am]be", "an", "🦵"],
  ["la l[am]pe", "an", "💡"], ["la t[an]te", "an", ""], ["l’or[an]ge", "an", "🍊"], ["le serp[en]t", "an", "🐍"],
  ["le g[an]t", "an", "🧤"], ["c[en]t", "an", ""], ["la d[an]se", "an", "💃"],

  // in, ain, im, ein /ɛ̃/
  ["le lap[in]", "in", "🐰"], ["le p[ain]", "in", "🍞"], ["la m[ain]", "in", "✋"], ["le jard[in]", "in", ""],
  ["le sap[in]", "in", "🎄"], ["c[in]q", "in", "5️⃣"], ["le tr[ain]", "in", "🚆"], ["dem[ain]", "in", ""],
  ["le b[ain]", "in", "🛁"], ["le dess[in]", "in", ""], ["le s[in]ge", "in", "🐒"], ["le t[im]bre", "in", ""],
  ["pl[ein]", "in", ""], ["le mat[in]", "in", ""], ["le requ[in]", "in", "🦈"],

  // ch /ʃ/
  ["le [ch]at", "ch", "🐱"], ["la [ch]aise", "ch", "🪑"], ["le [ch]eval", "ch", "🐴"], ["la va[ch]e", "ch", "🐮"],
  ["la [ch]emise", "ch", "👔"], ["ri[ch]e", "ch", ""], ["la ru[ch]e", "ch", ""], ["le [ch]ef", "ch", ""],
  ["la ni[ch]e", "ch", ""], ["la bi[ch]e", "ch", ""],

  // é /e/
  ["le caf[é]", "é", "☕"], ["l’ét[é]", "é", ""], ["le béb[é]", "é", "👶"], ["l’[é]cole", "é", "🏫"],
  ["le v[é]lo", "é", "🚲"], ["le d[é]", "é", "🎲"], ["le th[é]", "é", "🍵"], ["la cl[é]", "é", "🔑"],
  ["la fus[é]e", "é", "🚀"], ["la pur[é]e", "é", ""], ["l’id[é]e", "é", ""], ["le z[é]ro", "é", ""],
  ["le l[é]zard", "é", "🦎"],

  // è, ê /ɛ/
  ["la m[è]re", "è", ""], ["le p[è]re", "è", ""], ["le fr[è]re", "è", ""], ["la f[ê]te", "è", "🎉"],
  ["la t[ê]te", "è", ""], ["la cr[è]me", "è", ""], ["la for[ê]t", "è", "🌲"], ["la b[ê]te", "è", ""],
  ["la r[è]gle", "è", "📏"], ["la pi[è]ce", "è", ""], ["tr[è]s", "è", ""], ["la rivi[è]re", "è", ""],
  ["la lumi[è]re", "è", ""],

  // oi /wa/
  ["tr[oi]s", "oi", "3️⃣"], ["le r[oi]", "oi", "👑"], ["n[oi]r", "oi", "⚫"], ["la p[oi]re", "oi", "🍐"],
  ["le s[oi]r", "oi", ""], ["la v[oi]ture", "oi", "🚗"], ["le b[oi]s", "oi", ""], ["m[oi]", "oi", ""],
  ["le d[oi]gt", "oi", "☝️"], ["l’arm[oi]re", "oi", ""],
];
