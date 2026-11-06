// Nahrungsketten für die Lebensraum-Zuordnung (Lehrplan SG NMG.2.1.d „Nahrungsketten“).
// Jede Kette liest sich „… wird gefressen von …“. Das erste Glied ist eine Pflanze (p: true).
// Für „Was frisst …?“ zählt nur, was hier steht — die falschen Antworten wählt das Spiel so,
// dass sie sicher falsch sind (Pflanzen bei Fleischfressern, grosse Räuber bei Pflanzenfressern).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten der Lebensraum-Zuordnung (Entscheid L4 a), einzeln freizugeben. Der Prüfstand
// steht im Katalog (spiele/gemeinsam/katalog.js, Spiel „lebensraum“, Feld listen); Kinder sehen nur
// Inhalte aus freien Listen.
//   wald, wiese, weiher, gebirge  Tiere und Pflanzen mit diesem Lebensraum (Spalte Lebensraum in
//                                 tier-sortierer/tiere.js, LEBENSRAUM_LISTE_JE_RAUM)
//   nahrungsketten                NAHRUNGSKETTEN, ARTIKEL, GROSSE_RAEUBER, NICHT_FUTTER (diese Datei)
const LEBENSRAUM_LISTEN = ["wald", "wiese", "weiher", "gebirge", "nahrungsketten"];
const LEBENSRAUM_LISTE_JE_RAUM = { Wald: "wald", Wiese: "wiese", Weiher: "weiher", Gebirge: "gebirge" };

const NAHRUNGSKETTEN = [
  [["Gras", "🌱", true], ["Heuschrecke", "🦗"], ["Grasfrosch", "🐸"], ["Graureiher", "svg:graureiher"]],
  [["Gras", "🌱", true], ["Feldmaus", "🐁"], ["Fuchs", "🦊"]],
  [["Blätter", "🍃", true], ["Raupe", "🐛"], ["Kohlmeise", "🐦"], ["Sperber", "svg:sperber"]],
  [["Salat", "🥬", true], ["Schnecke", "🐌"], ["Igel", "🦔"]],
  [["Algen", "🌿", true], ["Mückenlarve", "svg:mueckenlarve"], ["Forelle", "🐟"], ["Graureiher", "svg:graureiher"]],
  [["Eicheln", "🌰", true], ["Eichhörnchen", "🐿️"], ["Baummarder", "svg:baummarder"]],
  [["Laub", "🍂", true], ["Regenwurm", "🪱"], ["Amsel", "🐦‍⬛"]],
  [["Blütennektar", "🌸", true], ["Nachtfalter", "svg:nachtfalter"], ["Fledermaus", "🦇"]],
  [["Gras", "🌱", true], ["Reh", "🦌"], ["Luchs", "svg:luchs"]],
  [["Gräser", "🌱", true], ["Murmeltier", "svg:murmeltier"], ["Steinadler", "🦅"]],
  // UNGEPRÜFT, neu LERN_Session2 (mehr kurze Ketten mit Bildern für Stufe 4):
  [["Löwenzahn", "🌼", true], ["Feldhase", "🐇"], ["Fuchs", "🦊"]],
  [["Körner", "🌾", true], ["Feldmaus", "🐁"], ["Waldkauz", "🦉"]],
];

// Artikel der Tiere, für die Frage „Was frisst der/die/das …?“
const ARTIKEL = {
  Heuschrecke: "die", Grasfrosch: "der", Graureiher: "der", Feldmaus: "die", Fuchs: "der", Raupe: "die",
  Kohlmeise: "die", Sperber: "der", Schnecke: "die", Igel: "der", Mückenlarve: "die", Forelle: "die",
  Eichhörnchen: "das", Baummarder: "der", Regenwurm: "der", Amsel: "die", Nachtfalter: "der",
  Fledermaus: "die", Reh: "das", Luchs: "der", Murmeltier: "das", Steinadler: "der",
  Feldhase: "der", Waldkauz: "der", // UNGEPRÜFT, neu LERN_Session2
};

// Grosse Räuber: Sie werden in keiner Kette von einem Pflanzenfresser gefressen.
const GROSSE_RAEUBER = ["Fuchs", "Luchs", "Steinadler", "Graureiher", "Sperber", "Baummarder"];
// Pflanzen, die keiner der Fleischfresser oben frisst.
const NICHT_FUTTER = ["Algen", "Laub", "Eicheln"];
