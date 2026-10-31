/* Übersicht aller Spiele — eine Quelle für Startseite und Statistik.
   Braucht spiel.js (LS.SKALA) davor. Jedes Spiel bietet die Stufen s1–s5 der Skala an;
   'lernziele' ordnet die Lernziele des Lernzielblatts den Stufen zu, in denen sie geübt werden.
   'zeiten': Vorgabezeit je Aufgabe in Sekunden für den zuschaltbaren Timer (im Profil anpassbar).
   'reihenfolge': das Spiel beachtet die Profil-Einstellung „Teile geordnet / gemischt“. */

const THEMEN = [
  { id: "stellenwert", fach: "Mathe", name: "Stellenwert", titel: "Stellenwert / Ziffern und Zahlen", quelle: "Lernziele 4.2" },
  { id: "rechnen", fach: "Mathe", name: "Rechnen", titel: "Einmaleins und Kopfrechnen", quelle: "Lehrplan SG MA.1.A.3" },
  { id: "wortarten", fach: "Deutsch", name: "Wortarten", titel: "Nomen, Verb, Adjektiv", quelle: "Lehrplan SG D.5.D.1" },
  { id: "rechtschreibung", fach: "Deutsch", name: "Rechtschreibung", titel: "Rechtschreibregeln", quelle: "Lehrplan SG D.5.E.1" },
];

const ALLE_STUFEN = ["s1", "s2", "s3", "s4", "s5"];

const SPIELE = [
  { id: "stellen-detektiv", bild: "🔍", name: "Stellen-Detektiv", thema: "stellenwert", farbe: "var(--deko-6)",
    pfad: "spiele/stellen-detektiv/index.html", stufen: ALLE_STUFEN, zeiten: { s1: 10, s2: 10, s3: 12, s4: 15, s5: 15 },
    beschreibung: "Die Stellen einer Zahl benennen: Einer, Zehner, Hunderter, …",
    lernziele: [{ lz: "4.2-G1", stufen: ["s3", "s4"] }] },
  { id: "zahlen-baukasten", bild: "🧱", name: "Zahlen-Baukasten", thema: "stellenwert", farbe: "var(--deko-5)",
    pfad: "spiele/zahlen-baukasten/index.html", stufen: ALLE_STUFEN, zeiten: { s1: 15, s2: 20, s3: 25, s4: 30, s5: 40 },
    beschreibung: "Aus Bausteinen wie 3 ZT + 4 H eine Zahl zusammensetzen", reihenfolge: true,
    lernziele: [{ lz: "4.2-G2", stufen: ["s3", "s4"] }] },
  { id: "tabellen-post", bild: "📮", name: "Tabellen-Post", thema: "stellenwert", farbe: "var(--deko-2)",
    pfad: "spiele/tabellen-post/index.html", stufen: ALLE_STUFEN, zeiten: { s1: 20, s2: 25, s3: 35, s4: 45, s5: 55 },
    beschreibung: "Zahlen in die Stellenwerttabelle schreiben und daraus ablesen",
    lernziele: [{ lz: "4.2-G3", stufen: ["s3", "s4"] }] },
  { id: "ziffernkarten", bild: "🃏", name: "Ziffernkarten", thema: "stellenwert", farbe: "var(--deko-4)",
    pfad: "spiele/ziffernkarten/index.html", stufen: ALLE_STUFEN, zeiten: { s1: 20, s2: 30, s3: 40, s4: 60, s5: 80 },
    beschreibung: "Aus Ziffernkarten Zahlen nach Vorgaben legen",
    lernziele: [{ lz: "4.2-G4", stufen: ["s3"] }, { lz: "4.2-E2", stufen: ["s4", "s5"] }] },
  { id: "zahlen-huepfer", bild: "🐸", name: "Zahlen-Hüpfer", thema: "stellenwert", farbe: "var(--deko-3)",
    pfad: "spiele/zahlen-huepfer/index.html", stufen: ALLE_STUFEN, zeiten: { s1: 30, s2: 40, s3: 50, s4: 60, s5: 75 },
    beschreibung: "In Schritten vorwärts und rückwärts zählen",
    lernziele: [{ lz: "4.2-G5", stufen: ["s3", "s4"] }] },
  { id: "zahlenraetsel-tresor", bild: "🔐", name: "Zahlenrätsel-Tresor", thema: "stellenwert", farbe: "var(--deko-1)",
    pfad: "spiele/zahlenraetsel-tresor/index.html", stufen: ALLE_STUFEN, zeiten: { s1: 30, s2: 45, s3: 60, s4: 90, s5: 120 },
    beschreibung: "Knifflige Zahlenrätsel lösen und den Tresor knacken", reihenfolge: true,
    lernziele: [{ lz: "4.2-E1", stufen: ["s3", "s4", "s5"] }] },
  { id: "punkte-schieber", bild: "⚪", name: "Punkte-Schieber", thema: "stellenwert", farbe: "var(--deko-7)",
    pfad: "spiele/punkte-schieber/index.html", stufen: ALLE_STUFEN, zeiten: { s1: 25, s2: 30, s3: 40, s4: 60, s5: 75 },
    beschreibung: "Zahlen mit Punkten in der Tabelle legen und Punkte verschieben",
    lernziele: [{ lz: "4.2-E3", stufen: ["s3", "s4", "s5"] }] },
  { id: "einmaleins-blitz", bild: "⚡", name: "Einmaleins-Blitz", thema: "rechnen", farbe: "var(--deko-4)",
    pfad: "spiele/einmaleins-blitz/index.html", stufen: ALLE_STUFEN, zeiten: { s1: 8, s2: 8, s3: 10, s4: 12, s5: 15 },
    beschreibung: "Malaufgaben blitzschnell lösen — von der 2er-Reihe bis 30 × 7",
    lernziele: [{ lz: "MA.1.A.3", stufen: ALLE_STUFEN }] },
  { id: "rechen-rakete", bild: "🚀", name: "Rechen-Rakete", thema: "rechnen", farbe: "var(--deko-6)",
    pfad: "spiele/rechen-rakete/index.html", stufen: ALLE_STUFEN, zeiten: { s1: 15, s2: 20, s3: 25, s4: 30, s5: 40 },
    beschreibung: "Im Kopf rechnen mit Wertziffern: 402 + 90, 320 000 + 38 000",
    lernziele: [{ lz: "MA.1.A.3", stufen: ALLE_STUFEN }] },
  { id: "wortarten-sortierer", bild: "🧺", name: "Wortarten-Sortierer", thema: "wortarten", farbe: "var(--deko-3)",
    pfad: "spiele/wortarten-sortierer/index.html", stufen: ALLE_STUFEN, zeiten: { s1: 8, s2: 10, s3: 12, s4: 15, s5: 15 },
    beschreibung: "Wörter in die Körbe Nomen, Verb und Adjektiv sortieren",
    lernziele: [{ lz: "D.5.D.1", stufen: ALLE_STUFEN }] },
  { id: "regel-luecke", bild: "✏️", name: "Regel-Lücke", thema: "rechtschreibung", farbe: "var(--deko-2)",
    pfad: "spiele/regel-luecke/index.html", stufen: ALLE_STUFEN, zeiten: { s1: 8, s2: 8, s3: 10, s4: 10, s5: 12 },
    beschreibung: "Die richtige Schreibweise einsetzen: sp/st, ie, ck/tz, f/v, e/ä",
    lernziele: [{ lz: "D.5.E.1", stufen: ALLE_STUFEN }] },
];

/** Lernziele (Lernzielblatt 4.2 und Lehrplan SG) — für Profil-Fokus und Statistik je Lernziel. */
const LERNZIELE = [
  { lz: "4.2-G1", niveau: "Grund", text: "Stellen einer Zahl benennen" },
  { lz: "4.2-G2", niveau: "Grund", text: "Wertziffern E … M kennen, Zahl aus Teilen zusammensetzen" },
  { lz: "4.2-G3", niveau: "Grund", text: "Zahlen in der Stellenwerttabelle lesen und hineinschreiben" },
  { lz: "4.2-G4", niveau: "Grund", text: "Aus Ziffern Zahlen nach schriftlichen Vorgaben bilden" },
  { lz: "4.2-G5", niveau: "Grund", text: "In vorgegebenen Schritten vorwärts und rückwärts zählen" },
  { lz: "4.2-E1", niveau: "erweitert", text: "Schwierige Zahlenrätsel mit Wertziffern lösen" },
  { lz: "4.2-E2", niveau: "erweitert", text: "Aus Ziffern Zahlen bilden, die den Vorgaben entsprechen" },
  { lz: "4.2-E3", niveau: "erweitert", text: "Zahlen mit Punkten darstellen und Punkte verschieben" },
  // Kompetenzen aus dem Lehrplan Volksschule SG (geprüft an sg.lehrplan.ch, 2026-10-31)
  { lz: "MA.1.A.3", niveau: "Lehrplan SG", text: "Einmaleins und Kopfrechnen: addieren, subtrahieren, multiplizieren, dividieren" },
  { lz: "D.5.D.1", niveau: "Lehrplan SG", text: "Nomen, Verb und Adjektiv bestimmen" },
  { lz: "D.5.E.1", niveau: "Lehrplan SG", text: "Rechtschreibregeln anwenden (sp/st, ie, ck/tz, f/v, e/ä)" },
];
