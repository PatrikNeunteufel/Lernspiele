// Tiere und Pflanzen für Tier-Sortierer und Lebensraum-Zuordnung (Lehrplan SG NMG.2.1, NMG.2.4).
// Je Eintrag: [Name, Bild, Klasse, Gruppe (nur Säugetiere), Haltung, Lebensraum]
//   Klasse:     Säugetier, Vogel, Fisch, Reptil, Amphibie, Insekt, Spinnentier, Weichtier, Wurm,
//               Pflanze, Pilz (Pilze sind keine Pflanzen, Lehrplan NMG.2.4.e nennt sie getrennt)
//   Gruppe:     Nagetier, Hasenartige, Raubtier, Insektenfresser, Fledertier, Paarhufer, Unpaarhufer, Wal
//   Haltung:    Wildtier, Nutztier, Heimtier — null, wo es nicht eindeutig ist (Pferd, Kaninchen, Biene)
//   Lebensraum: Wald, Wiese, Weiher (Weiher und Bach), Gebirge — der typische Lebensraum in der Schweiz; null, wo ein Tier
//               in mehreren gleich typisch ist oder nicht in der Schweiz lebt
// Bild null = kein passendes Emoji; solche Einträge erscheinen erst in Stufen mit Lesetext.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a): Freigegeben wird je Spalte — eine Liste prüft eine Eigenschaft
// aller Tiere. Der Prüfstand steht im Katalog (spiele/gemeinsam/katalog.js, Feld listen der
// Spiele); Kinder sehen nur Inhalte aus freien Listen.
//   Tier-Sortierer („tier-sortierer“):
//     tierklassen         Spalte Klasse (auch die knifflige Auswahl im Spiel: Fledermaus, Wal …)
//     saeugetier-gruppen  Spalte Gruppe
//     haltung             Spalte Haltung
//   Lebensraum-Zuordnung („lebensraum“, Spalte Lebensraum, je Lebensraum eine Liste):
//     wald, wiese, weiher, gebirge — siehe lebensraum/nahrung.js (dort auch die Nahrungsketten)
const TIER_LISTEN = ["tierklassen", "saeugetier-gruppen", "haltung"];
const TIER_LISTE_JE_MERKMAL = { klasse: "tierklassen", gruppe: "saeugetier-gruppen", haltung: "haltung" };

const TIERE = [
  // Säugetiere
  ["Reh", "🦌", "Säugetier", "Paarhufer", "Wildtier", "Wald"],
  ["Rothirsch", "🦌", "Säugetier", "Paarhufer", "Wildtier", "Wald"],
  ["Wildschwein", "🐗", "Säugetier", "Paarhufer", "Wildtier", "Wald"],
  ["Fuchs", "🦊", "Säugetier", "Raubtier", "Wildtier", "Wald"],
  ["Dachs", "🦡", "Säugetier", "Raubtier", "Wildtier", "Wald"],
  ["Luchs", null, "Säugetier", "Raubtier", "Wildtier", "Wald"],
  ["Wolf", "🐺", "Säugetier", "Raubtier", "Wildtier", null],
  ["Braunbär", "🐻", "Säugetier", "Raubtier", "Wildtier", null],
  ["Eichhörnchen", "🐿️", "Säugetier", "Nagetier", "Wildtier", "Wald"],
  ["Feldmaus", "🐁", "Säugetier", "Nagetier", "Wildtier", "Wiese"],
  ["Feldhase", "🐇", "Säugetier", "Hasenartige", "Wildtier", "Wiese"],
  ["Maulwurf", null, "Säugetier", "Insektenfresser", "Wildtier", "Wiese"],
  ["Igel", "🦔", "Säugetier", "Insektenfresser", "Wildtier", null],
  ["Spitzmaus", null, "Säugetier", "Insektenfresser", "Wildtier", null],
  ["Fledermaus", "🦇", "Säugetier", "Fledertier", "Wildtier", null],
  ["Biber", "🦫", "Säugetier", "Nagetier", "Wildtier", "Weiher"],
  ["Murmeltier", null, "Säugetier", "Nagetier", "Wildtier", "Gebirge"],
  ["Steinbock", null, "Säugetier", "Paarhufer", "Wildtier", "Gebirge"],
  ["Gämse", null, "Säugetier", "Paarhufer", "Wildtier", "Gebirge"],
  ["Kuh", "🐄", "Säugetier", "Paarhufer", "Nutztier", null],
  ["Schaf", "🐑", "Säugetier", "Paarhufer", "Nutztier", null],
  ["Ziege", "🐐", "Säugetier", "Paarhufer", "Nutztier", null],
  ["Schwein", "🐖", "Säugetier", "Paarhufer", "Nutztier", null],
  ["Pferd", "🐎", "Säugetier", "Unpaarhufer", null, null],
  ["Esel", "🫏", "Säugetier", "Unpaarhufer", null, null],
  ["Zebra", "🦓", "Säugetier", "Unpaarhufer", "Wildtier", null],
  ["Hund", "🐕", "Säugetier", "Raubtier", "Heimtier", null],
  ["Katze", "🐈", "Säugetier", "Raubtier", "Heimtier", null],
  ["Kaninchen", "🐰", "Säugetier", "Hasenartige", null, null],
  ["Hamster", "🐹", "Säugetier", "Nagetier", "Heimtier", null],
  ["Meerschweinchen", null, "Säugetier", "Nagetier", "Heimtier", null],
  ["Ratte", "🐀", "Säugetier", "Nagetier", null, null],
  ["Wal", "🐋", "Säugetier", "Wal", "Wildtier", null],
  ["Delfin", "🐬", "Säugetier", "Wal", "Wildtier", null],
  // Vögel
  ["Specht", null, "Vogel", null, "Wildtier", "Wald"],
  ["Waldkauz", "🦉", "Vogel", null, "Wildtier", "Wald"],
  ["Stockente", "🦆", "Vogel", null, "Wildtier", "Weiher"],
  ["Graureiher", null, "Vogel", null, "Wildtier", "Weiher"],
  ["Höckerschwan", "🦢", "Vogel", null, "Wildtier", "Weiher"],
  ["Steinadler", "🦅", "Vogel", null, "Wildtier", "Gebirge"],
  ["Alpendohle", "🐦‍⬛", "Vogel", null, "Wildtier", "Gebirge"], // UNGEPRÜFT, neu LERN_Session2 (Gebirge mit Bild)
  ["Feldlerche", null, "Vogel", null, "Wildtier", "Wiese"],
  ["Huhn", "🐔", "Vogel", null, "Nutztier", null],
  ["Wellensittich", "🦜", "Vogel", null, "Heimtier", null],
  ["Pinguin", "🐧", "Vogel", null, "Wildtier", null],
  // Fische
  ["Forelle", "🐟", "Fisch", null, "Wildtier", null],
  ["Hecht", null, "Fisch", null, "Wildtier", "Weiher"],
  ["Goldfisch", "🐠", "Fisch", null, "Heimtier", null],
  ["Hai", "🦈", "Fisch", null, "Wildtier", null],
  // Reptilien
  ["Zauneidechse", "🦎", "Reptil", null, "Wildtier", null],
  ["Ringelnatter", "🐍", "Reptil", null, "Wildtier", "Weiher"],
  ["Blindschleiche", null, "Reptil", null, "Wildtier", null],
  ["Schildkröte", "🐢", "Reptil", null, null, null],
  ["Krokodil", "🐊", "Reptil", null, "Wildtier", null],
  // Amphibien
  ["Grasfrosch", "🐸", "Amphibie", null, "Wildtier", "Weiher"],
  ["Erdkröte", null, "Amphibie", null, "Wildtier", null],
  ["Bergmolch", null, "Amphibie", null, "Wildtier", "Weiher"],
  ["Feuersalamander", null, "Amphibie", null, "Wildtier", "Wald"],
  ["Alpensalamander", null, "Amphibie", null, "Wildtier", "Gebirge"],
  // Insekten
  ["Waldameise", "🐜", "Insekt", null, "Wildtier", "Wald"],
  ["Hirschkäfer", "🪲", "Insekt", null, "Wildtier", "Wald"],
  ["Heuschrecke", "🦗", "Insekt", null, "Wildtier", "Wiese"],
  ["Schmetterling", "🦋", "Insekt", null, "Wildtier", "Wiese"],
  ["Marienkäfer", "🐞", "Insekt", null, "Wildtier", null],
  ["Honigbiene", "🐝", "Insekt", null, null, "Wiese"],
  ["Libelle", null, "Insekt", null, "Wildtier", "Weiher"],
  ["Stubenfliege", "🪰", "Insekt", null, "Wildtier", null],
  ["Mücke", "🦟", "Insekt", null, "Wildtier", null],
  // keine Insekten
  ["Kreuzspinne", "🕷️", "Spinnentier", null, "Wildtier", null],
  ["Weinbergschnecke", "🐌", "Weichtier", null, "Wildtier", null],
  ["Regenwurm", "🪱", "Wurm", null, "Wildtier", "Wiese"],
  // Pflanzen und Pilze (nur für die Lebensraum-Zuordnung)
  ["Fichte", "🌲", "Pflanze", null, null, "Wald"],
  ["Fliegenpilz", "🍄", "Pilz", null, null, "Wald"],
  ["Farn", "🌿", "Pflanze", null, null, "Wald"],
  ["Löwenzahn", "🌼", "Pflanze", null, null, "Wiese"],
  ["Klee", "🍀", "Pflanze", null, null, "Wiese"],
  ["Seerose", "🪷", "Pflanze", null, null, "Weiher"],
  ["Schilf", null, "Pflanze", null, null, "Weiher"],
  ["Edelweiss", null, "Pflanze", null, null, "Gebirge"],
  ["Enzian", null, "Pflanze", null, null, "Gebirge"],
];
