/* Geheimwörter für den Geheimschrift-Knacker — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG MI.2.1.c: Geheimschriften (Verschiebe-Schrift nach Caesar) ver- und entschlüsseln.

   Schreibweise: kurze, kindgerechte Nomen in GROSSBUCHSTABEN, nur A–Z — ohne Umlaute (Ä, Ö, Ü) und
   ohne ß, sonst geht die Verschiebung im Alphabet nicht auf. Länge 3 bis 7 Buchstaben.
   Schweizer Schreibweise; selbst gewählte Wörter, keine Namen.

   Inhaltsliste (Entscheid L4 a): Liste-Id „woerter“ (Katalog-Eintrag „geheimschrift-knacker“,
   Feld listen: „Geheimwörter (kurze Nomen)“). */

const GEHEIM_WOERTER = [
  // Tiere
  "HUND", "KATZE", "MAUS", "VOGEL", "FISCH", "PFERD", "ZEBRA", "TIGER", "ADLER", "ESEL",
  "ENTE", "GANS", "IGEL", "AFFE", "HASE", "BIENE", "SCHAF", "ZIEGE", "WOLF", "FUCHS",
  "EULE", "LAMA", "RABE", "DACHS",
  // Natur und Wetter
  "BAUM", "BLUME", "STERN", "SONNE", "MOND", "WOLKE", "REGEN", "SCHNEE", "WIND", "BLITZ",
  "WALD", "BERG", "INSEL", "ROSE", "TULPE",
  // Zuhause und Schule
  "HAUS", "TISCH", "STUHL", "LAMPE", "BUCH", "HEFT", "STIFT", "PINSEL", "FARBE", "TASSE",
  "TELLER", "GABEL", "MESSER", "KISTE", "UHR", "KERZE", "BRIEF", "SCHULE", "PAUSE",
  // Essen
  "APFEL", "BIRNE", "BANANE", "KIWI", "TOMATE", "BROT", "KUCHEN", "NUDEL", "PIZZA", "MILCH", "SALAT",
  // Spiel und Abenteuer
  "BALL", "SPIEL", "PUZZLE", "PIRAT", "SCHATZ", "KARTE", "BOOT", "SCHIFF", "RAKETE", "KRONE",
  "RITTER", "BURG", "DRACHE", "ZWERG", "RIESE", "ROBOTER", "TROMMEL", "GEIGE", "GITARRE",
];

/* Gesperrte Schlüssel (Entscheid GK1 a, LERN_Session38): Mit diesen Schlüsseln wird aus dem Wort ein anstössiges
   Geheimwort. Das Wort bleibt in der Liste; das Spiel verschlüsselt es nur nie mit diesen Schlüsseln und zeigt auch
   in keinem Hinweis diese Verschiebung. Gefunden mit einer Suche nach anstössigen Teilwörtern (Deutsch, Englisch)
   über alle Wörter und Schlüssel 1–25; die Prüfansicht zeigt alle Geheimwörter zum Nachsehen. Bewusst nicht gesperrt
   (Entscheid GK2 a): kurze Zufallstreffer in sonst sinnlosen Geheimwörtern wie KZ (KZXVI), POO (TPOOF), TIT (GPZTIT).
   Neue Funde hier ergänzen: Wort in Grossbuchstaben, dahinter die Schlüssel. */
const GEHEIM_SPERRE = {
  PUZZLE: [19], // INSSEX
  MAUS: [6],    // SGAY
  HAUS: [6],    // NGAY
  PAUSE: [6],   // VGAYK
  TOMATE: [20], // NIGUNY
  KARTE: [13],  // XNEGR
  BLUME: [8],   // JTCUM
  APFEL: [5],   // FUKJQ
  ZWERG: [6],   // FCKXM
};
