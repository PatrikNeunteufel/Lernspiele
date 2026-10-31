// Inhalte der Schätz-Waage (Lehrplan SG MA.3.A.1). Dezimalpunkt wie im Lehrplan SG (1.5 t).
// Referenzfragen: ungefähre Werte; die falschen Antworten liegen um mindestens das Zehnfache daneben,
// damit beim Schätzen genau eine sinnvoll ist.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a), einzeln von der Aufsicht freigegeben; der Prüfstand steht im
// Katalog (spiele/gemeinsam/katalog.js, Eintrag schaetz-waage, Feld listen):
//   vergleiche  VERGLEICHE (Stufe 1 und 2)
//   reihen      REIHEN (Stufe 2 und 4)
//   laenge, gewicht, hohlmass, zeit   SCHAETZFRAGEN je Grössenart — nach der Einheit der richtigen
//               Antwort, Zuordnung in SCHAETZ_LISTEN
const SCHAETZ_LISTEN = { laenge: ["mm", "cm", "m", "km"], gewicht: ["g", "kg", "t"], hohlmass: ["ml", "dl", "l"], zeit: ["s", "min", "h"] };

// Vergleichen (Stufe 1, in Stufe 2 dazwischen): [Eigenschaft, grösseres Ding, kleineres Ding] — Ding = [Bild, Name mit Artikel]
const VERGLEICHE = [
  ["schwerer", ["🐘", "der Elefant"], ["🐭", "die Maus"]],
  ["schwerer", ["🚗", "das Auto"], ["🚲", "das Velo"]],
  ["schwerer", ["🍉", "die Wassermelone"], ["🍓", "die Erdbeere"]],
  ["schwerer", ["🐄", "die Kuh"], ["🐔", "das Huhn"]],
  ["schwerer", ["🎃", "der Kürbis"], ["🍎", "der Apfel"]],
  ["schwerer", ["🐎", "das Pferd"], ["🐕", "der Hund"]],
  ["länger", ["🚌", "der Bus"], ["🚗", "das Auto"]],
  ["länger", ["🚆", "der Zug"], ["🚲", "das Velo"]],
  ["länger", ["🐊", "das Krokodil"], ["🦎", "die Eidechse"]],
  ["grösser", ["🦒", "die Giraffe"], ["🐈", "die Katze"]],
  ["grösser", ["🌳", "der Baum"], ["🌷", "die Blume"]],
  ["grösser", ["🏠", "das Haus"], ["⛺", "das Zelt"]],
];

// Ordnen: [Eigenschaft, Dinge vom kleinsten zum grössten]. Drei Dinge in Stufe 2, vier Dinge in Stufe 4.
// Die Reihen mit vier Dingen (LERN, 2026-10-31) sind UNGEPRÜFT.
const REIHEN = [
  ["leicht → schwer", [["🪶", "Feder"], ["🍎", "Apfel"], ["🐈", "Katze"], ["🐘", "Elefant"]]],
  ["leicht → schwer", [["🍓", "Erdbeere"], ["🍎", "Apfel"], ["🍉", "Wassermelone"], ["🚗", "Auto"]]],
  ["kurz → lang", [["🐜", "Ameise"], ["✏️", "Bleistift"], ["🚲", "Velo"], ["🚌", "Bus"]]],
  ["klein → gross", [["🐁", "Maus"], ["🐈", "Katze"], ["🐎", "Pferd"], ["🦒", "Giraffe"]]],
  ["leicht → schwer", [["🪶", "Feder"], ["🍎", "Apfel"], ["🍉", "Wassermelone"]]],
  ["leicht → schwer", [["🐭", "Maus"], ["🐈", "Katze"], ["🐎", "Pferd"]]],
  ["leicht → schwer", [["🐜", "Ameise"], ["🐕", "Hund"], ["🐘", "Elefant"]]],
  ["leicht → schwer", [["🍓", "Erdbeere"], ["🍌", "Banane"], ["🎃", "Kürbis"]]],
  ["kurz → lang", [["🐜", "Ameise"], ["🐈", "Katze"], ["🐊", "Krokodil"]]],
  ["kurz → lang", [["✏️", "Bleistift"], ["🧹", "Besen"], ["🚌", "Bus"]]],
  ["klein → gross", [["🐁", "Maus"], ["🐕", "Hund"], ["🦒", "Giraffe"]]],
  ["klein → gross", [["🌷", "Blume"], ["🧑", "Mensch"], ["🌳", "Baum"]]],
];

// Referenzgrössen: [Stufe, Frage, richtig, falsch, falsch]. Stufen der Skala mit Basisklasse 2:
// 3 cm und m, 4 cm und m schwieriger, 5 kg, g, l, dl (3. Klasse), 6 km, mm, t, ml, h, min, s.
// Die Fragen der Stufe 4 (LERN, 2026-10-31) sind UNGEPRÜFT.
const SCHAETZFRAGEN = [
  [4, "Wie lang ist ein Auto?", "4 m", "40 cm", "40 m"],
  [4, "Wie hoch hängt ein Basketballkorb?", "3 m", "30 cm", "30 m"],
  [4, "Wie lang ist ein Schullineal?", "30 cm", "3 m", "3 cm"],
  [4, "Wie breit ist ein Schulheft?", "21 cm", "2 m", "2 cm"],
  [4, "Wie lang ist ein Bus?", "12 m", "12 cm", "120 m"],
  [4, "Wie lang ist dein Fuss?", "20 cm", "2 m", "2 cm"],
  [4, "Wie hoch ist ein Stockwerk in einem Haus?", "3 m", "30 cm", "30 m"],
  [4, "Wie lang ist eine Turnhalle?", "30 m", "3 m", "300 m"],
  [4, "Wie lang ist ein Regenwurm?", "10 cm", "1 m", "1 cm"],
  [3, "Wie lang ist ein neuer Bleistift?", "18 cm", "18 m", "2 cm"],
  [3, "Wie hoch ist eine Zimmertür?", "2 m", "20 cm", "20 m"],
  [3, "Wie breit ist ein Fingernagel?", "1 cm", "1 m", "10 cm"],
  [3, "Wie gross ist ein Kind in der 2. Klasse?", "125 cm", "125 m", "12 cm"],
  [3, "Wie lang ist ein Schulzimmer?", "9 m", "9 cm", "90 m"],
  [3, "Wie lang ist eine Banane?", "20 cm", "2 m", "2 cm"],
  [3, "Wie hoch ist ein Tisch?", "75 cm", "75 m", "7 cm"],
  [5, "Wie schwer ist eine Packung Mehl?", "1 kg", "1 g", "100 kg"],
  [5, "Wie schwer ist eine Tafel Schokolade?", "100 g", "100 kg", "1 g"],
  [5, "Wie schwer ist ein Apfel?", "150 g", "150 kg", "15 g"],
  [5, "Wie viel passt in ein Wasserglas?", "2 dl", "2 l", "20 l"],
  [5, "Wie viel Milch ist in einer Milchpackung?", "1 l", "1 dl", "10 l"],
  [5, "Wie schwer ist ein Kind in der 2. Klasse?", "25 kg", "25 g", "250 kg"],
  [5, "Wie viel Wasser passt in einen Eimer?", "10 l", "10 dl", "100 l"],
  [5, "Wie schwer ist ein Velo?", "15 kg", "150 kg", "1 kg"],
  [6, "Wie lang ist ein Schulweg zu Fuss?", "1 km", "1 mm", "100 km"],
  [6, "Wie lang ist eine Ameise?", "5 mm", "5 m", "50 cm"],
  [6, "Wie schwer ist ein Auto?", "1.5 t", "1.5 kg", "15 g"],
  [6, "Wie viel passt in einen Teelöffel?", "5 ml", "5 l", "5 dl"],
  [6, "Wie lange dauert eine Schullektion?", "45 min", "45 s", "45 h"],
  [6, "Wie lange schläft ein Kind in der Nacht?", "10 h", "10 min", "10 s"],
  [6, "Wie lange dauert das Zähneputzen?", "3 min", "3 h", "3 s"],
  [6, "Wie lange dauert ein Herzschlag ungefähr?", "1 s", "1 min", "1 h"],
  [6, "Wie schwer ist ein Elefant?", "5 t", "5 kg", "50 g"],
  [6, "Wie dick ist eine Münze?", "2 mm", "2 cm", "2 m"],
];
