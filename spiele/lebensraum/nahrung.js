// Nahrungsketten für die Lebensraum-Zuordnung (Lehrplan SG NMG.2.1.d „Nahrungsketten“).
// Jede Kette liest sich „… wird gefressen von …“. Das erste Glied ist eine Pflanze (p: true).
// Für „Was frisst …?“ zählt nur, was hier steht — die falschen Antworten wählt das Spiel so,
// dass sie sicher falsch sind (Pflanzen bei Fleischfressern, grosse Räuber bei Pflanzenfressern).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).

const NAHRUNGSKETTEN = [
  [["Gras", "🌱", true], ["Heuschrecke", "🦗"], ["Grasfrosch", "🐸"], ["Graureiher", null]],
  [["Gras", "🌱", true], ["Feldmaus", "🐁"], ["Fuchs", "🦊"]],
  [["Blätter", "🍃", true], ["Raupe", "🐛"], ["Kohlmeise", "🐦"], ["Sperber", null]],
  [["Salat", "🥬", true], ["Schnecke", "🐌"], ["Igel", "🦔"]],
  [["Algen", "🌿", true], ["Mückenlarve", null], ["Forelle", "🐟"], ["Graureiher", null]],
  [["Eicheln", "🌰", true], ["Eichhörnchen", "🐿️"], ["Baummarder", null]],
  [["Laub", "🍂", true], ["Regenwurm", "🪱"], ["Amsel", "🐦‍⬛"]],
  [["Blütennektar", "🌸", true], ["Nachtfalter", null], ["Fledermaus", "🦇"]],
  [["Gras", "🌱", true], ["Reh", "🦌"], ["Luchs", null]],
  [["Gräser", "🌱", true], ["Murmeltier", null], ["Steinadler", "🦅"]],
];

// Artikel der Tiere, für die Frage „Was frisst der/die/das …?“
const ARTIKEL = {
  Heuschrecke: "die", Grasfrosch: "der", Graureiher: "der", Feldmaus: "die", Fuchs: "der", Raupe: "die",
  Kohlmeise: "die", Sperber: "der", Schnecke: "die", Igel: "der", Mückenlarve: "die", Forelle: "die",
  Eichhörnchen: "das", Baummarder: "der", Regenwurm: "der", Amsel: "die", Nachtfalter: "der",
  Fledermaus: "die", Reh: "das", Luchs: "der", Murmeltier: "das", Steinadler: "der",
};

// Grosse Räuber: Sie werden in keiner Kette von einem Pflanzenfresser gefressen.
const GROSSE_RAEUBER = ["Fuchs", "Luchs", "Steinadler", "Graureiher", "Sperber", "Baummarder"];
// Pflanzen, die keiner der Fleischfresser oben frisst.
const NICHT_FUTTER = ["Algen", "Laub", "Eicheln"];
