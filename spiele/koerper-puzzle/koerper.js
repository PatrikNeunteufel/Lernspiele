// Inhalte für das Körper-Puzzle (Lehrplan SG NMG.1.4).
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).

// Körperteile (Stufe 1): [Bild, Name, Artikel]
const KOERPERTEILE = [
  ["👁️", "Auge", "das"], ["👂", "Ohr", "das"], ["👃", "Nase", "die"], ["👄", "Mund", "der"], ["✋", "Hand", "die"],
  ["🦶", "Fuss", "der"], ["🦵", "Bein", "das"], ["💪", "Arm", "der"], ["🦷", "Zahn", "der"], ["👅", "Zunge", "die"],
];

// Sinne (Stufe 2): [Frage, Bild, Sinnesorgan]
const SINNE = [
  ["Womit siehst du?", "👁️", "Auge"], ["Womit hörst du?", "👂", "Ohr"], ["Womit riechst du?", "👃", "Nase"],
  ["Womit schmeckst du?", "👅", "Zunge"], ["Womit fühlst du, ob etwas warm oder kalt ist?", "✋", "Haut"],
];

// Fragen: [ab Stufe, Frage, richtig, falsch, falsch] — Stufe = Spielstufe s1–s6 (Skala mit Königsstufe)
const KOERPER_FRAGEN = [
  [3, "Wo kannst du dein Bein beugen?", "am Knie", "am Schienbein", "an der Zehe"],
  [3, "Wo kannst du deinen Arm beugen?", "am Ellbogen", "am Oberarm", "am Fingernagel"],
  [3, "Was schützt das Gehirn?", "der Schädel", "die Haare", "die Ohren"],
  [3, "Was schützt die Augen vor Staub?", "die Augenlider und Wimpern", "die Nase", "die Zähne"],
  [3, "Wie heissen die ersten Zähne eines Kindes?", "Milchzähne", "Weisheitszähne", "Goldzähne"],
  // Stufe 4 (gemischt) nimmt die Fragen der Stufe 3 dazu Sinne und Körperteile.
  [5, "Was macht das Herz?", "Es pumpt das Blut durch den Körper.", "Es verdaut das Essen.", "Es denkt nach."],
  [5, "Was macht die Lunge?", "Sie nimmt beim Atmen Luft auf.", "Sie pumpt das Blut.", "Sie bewegt die Beine."],
  [5, "Was macht der Magen?", "Er verdaut das Essen.", "Er sieht.", "Er pumpt das Blut."],
  [5, "Was macht das Gehirn?", "Es denkt und steuert den Körper.", "Es verdaut das Essen.", "Es atmet."],
  [5, "Was brauchst du, um dich zu bewegen?", "Muskeln und Knochen", "nur Haare", "nur die Haut"],
  [5, "Was gibt dem Körper Halt?", "das Skelett aus Knochen", "das Blut", "die Haare"],
  [6, "Wohin führen die Arterien das Blut?", "vom Herz weg in den Körper", "nur in die Haare", "aus dem Körper hinaus"],
  [6, "Wohin führen die Venen das Blut?", "zurück zum Herz", "in den Magen", "in die Haare"],
  [6, "Warum schwitzt du, wenn dir heiss ist?", "Damit der Körper abkühlt.", "Damit die Haut wächst.", "Damit du besser siehst."],
  [6, "Warum schützt du dich mit Sonnencreme?", "Damit die Haut keinen Sonnenbrand bekommt.", "Damit die Haare wachsen.", "Damit du schneller rennst."],
  // NEU in LERN_Session2 für die Königsstufe, UNGEPRÜFT
  [6, "Was bringt das Blut zu allen Teilen des Körpers?", "Sauerstoff und Nährstoffe", "Haare und Nägel", "Steine und Sand"],
  [6, "Was spürst du am Handgelenk, wenn du zwei Finger darauflegst?", "den Puls: so schlägt das Herz", "wie die Lunge atmet", "wie der Magen verdaut"],
  [6, "Wie schützt die Haut den Körper?", "Sie hält Schmutz und Keime draussen.", "Sie pumpt das Blut.", "Sie verdaut das Essen."],
];

// Wege durch den Körper (Stufe 6): [Name, Stationen in Reihenfolge]
const WEGE = [
  ["Der Weg des Essens", ["Mund", "Speiseröhre", "Magen", "Dünndarm", "Dickdarm"]],
  ["Der Weg der Luft", ["Nase", "Luftröhre", "Lunge"]],
];
