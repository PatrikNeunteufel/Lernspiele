/* Wörter für die Trenn-Schere — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG D.5.E.1.d (Grundanspruch 2. Zyklus): Trennregel. Selbst zusammengestellte Wörter.
   Schweizer Schreibweise (ss statt ß).

   Schreibweise: ALLE Stellen, an denen man das Wort am Zeilenende trennen darf, sind markiert, nach der
   Regel seit 1996 (Amtliches Regelwerk, Stand 2006):
     -   Trennstelle nach Sprechsilben: Ba-na-ne, Kat-ze, Fens-ter (st wird getrennt), Zu-cker (ck nicht)
     |   Trennstelle zwischen den Teilen eines zusammengesetzten Worts oder nach einer Vorsilbe:
         Haus|tür, ver|lie-ren — im Spiel ebenfalls ein Trennstrich; das „|“ ordnet nur die Stufe zu.
   Ohne Zeichen: Das Wort darf man nicht trennen — einsilbig (Brot) oder nur mit einem einzelnen Vokal
   am Anfang oder am Ende (Igel: nicht I-gel; Oma: nicht O-ma). Bei Ele-fant bleibt das E beim l.
   Nicht aufgenommen: Wörter, bei denen der Duden zwei Trennungen erlaubt (Zi-tro-ne / Zit-ro-ne) und
   Fremdwörter mit Sonderregeln.

   Inhaltsliste (Liste-Id = Schlüssel; Prüfstand im Katalog, Eintrag „trenn-schere“, Feld listen):
     woerter  alle Wörter; das Spiel ordnet sie selbst den Stufen zu (einfach; ck, ch, sch und st;
              zusammengesetzt; einzelner Vokal am Anfang; nicht trennbar). */

const TRENN_WOERTER = {
  woerter: [
    // einfach: nach Sprechsilben
    "Ba-na-ne", "Ho-se", "Ka-ter", "To-ma-te", "Na-se", "Wol-ke", "Kat-ze", "Fe-der", "Lam-pe", "Tin-te",
    "Gar-ten", "Ham-mer", "Kar-tof-fel", "Pup-pe", "Tan-ne", "Som-mer", "Win-ter", "Schu-le", "Fin-ger",
    "Ap-fel", "Was-ser", "Mau-er", "Ta-fel", "Lö-we", "Ka-me-ra", "Pa-pa-gei", "Schmet-ter-ling", "Re-gen",
    "Ei-mer", "Eu-le", "Au-to", "Ra-ke-te", "Wes-pe", "Tep-pich", "Kup-fer",
    // ck, ch, sch bleiben zusammen; st wird getrennt
    "Zu-cker", "Ja-cke", "Bä-cker", "Glo-cke", "Schne-cke", "Brü-cke", "De-cke", "Rü-cken", "Ste-cker", "Lü-cke",
    "Kis-te", "Fens-ter", "Kas-ten", "Schwes-ter", "Os-tern", "Bürs-te", "Pfos-ten", "Gäs-te", "Geis-ter",
    "Ku-chen", "Ta-sche", "Fla-sche", "Kü-che", "Bü-cher", "Mu-schel", "Kir-sche", "Mäd-chen", "Ma-schi-ne",
    // zusammengesetzte Wörter und Vorsilben
    "Haus|tür", "Schul|haus", "Fuss|ball", "Gar-ten|zaun", "Ge-burts|tag", "ver|lie-ren", "be|zah-len",
    "Auf|ga-be", "Ein|gang", "ent|de-cken", "er|zäh-len", "Bahn|hof", "Sonn|tag", "Kin-der|gar-ten",
    "Zahn|bürs-te", "Schnee|mann", "Re-gen|schirm", "Son-nen|blu-me", "Was-ser|fall", "Ap-fel|baum",
    "Hand|schuh", "Ve-lo|weg", "Znü-ni|pau-se", "Ta-schen|lam-pe", "Win-ter|ja-cke", "Post|au-to", "Ab|fall",
    // einzelner Vokal am Wortanfang bleibt am Wort
    "Ele-fant", "Ana-nas", "Amei-se", "Oli-ve", "Aben-teu-er", "Ebe-ne",
    // nicht trennbar
    "Igel", "Abend", "Ofen", "Esel", "Oma", "Opa", "Ufer", "Brot", "Hund", "Schiff", "Strumpf", "Zwerg", "Obst", "Kopf",
  ],
};
