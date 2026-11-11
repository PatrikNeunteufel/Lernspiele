// Namen für die Schweiz-Karten-Suche (Lehrplan SG NMG.8.4). Die Lage aller Kantone, Wahlkreise und Orte
// kommt aus karte.js (swisstopo, swissBOUNDARIES3D); hier steht nur, wie die Kinder sie nennen.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/eulenpfad/pruefung/).
//
// Inhaltslisten (Entscheid L4 a): „wahlkreise-sg“ (Wahlkreise des Kantons St. Gallen), „kantone“
// (26 Kantone mit Kürzel), „hauptorte“ (Kantonshauptorte), „staedte“ (grosse Städte ab STADT_MIN Einwohnern).
// Der Prüfstand steht in spiele/gemeinsam/pruefstand.js (Schlüssel schweiz-karte/<liste>).

// Kantonsnummer (BFS) → [Kürzel, Name auf Deutsch]
const KANTONE_NAMEN = {
  1: ["ZH", "Zürich"], 2: ["BE", "Bern"], 3: ["LU", "Luzern"], 4: ["UR", "Uri"], 5: ["SZ", "Schwyz"],
  6: ["OW", "Obwalden"], 7: ["NW", "Nidwalden"], 8: ["GL", "Glarus"], 9: ["ZG", "Zug"], 10: ["FR", "Freiburg"],
  11: ["SO", "Solothurn"], 12: ["BS", "Basel-Stadt"], 13: ["BL", "Basel-Landschaft"], 14: ["SH", "Schaffhausen"],
  15: ["AR", "Appenzell Ausserrhoden"], 16: ["AI", "Appenzell Innerrhoden"], 17: ["SG", "St. Gallen"],
  18: ["GR", "Graubünden"], 19: ["AG", "Aargau"], 20: ["TG", "Thurgau"], 21: ["TI", "Tessin"], 22: ["VD", "Waadt"],
  23: ["VS", "Wallis"], 24: ["NE", "Neuenburg"], 25: ["GE", "Genf"], 26: ["JU", "Jura"],
};

// Der Kanton St. Gallen und seine Nachbarkantone (Stufe 2)
const OSTSCHWEIZ = [17, 1, 20, 15, 16, 18, 5, 8];

// Gemeindename in den swisstopo-Daten → Name, wie ihn Kinder auf Deutsch lernen. Fehlt ein Eintrag,
// gilt der Name aus den Daten ohne Kantonszusatz („Wil (SG)“ → „Wil“).
const ORT_NAMEN = {
  "Altdorf (UR)": "Altdorf", "Fribourg": "Freiburg", "Neuchâtel": "Neuenburg", "Genève": "Genf",
  "Sion": "Sitten", "Delémont": "Delsberg", "Biel/Bienne": "Biel",
};

// Städte für Stufe 5: ab so vielen Einwohnern (ohne die Kantonshauptorte)
const STADT_MIN = 25000;

// Auswahl für die Abschluss-Animation (Entscheid SK1 a, LERN_Session32): Der Katalog nennt Karte und Auswahl nur beim
// Namen (feier.karte "schweiz", ziele mit "ostschweiz", "staedte" …); hier stehen sie mit den Regeln des Spiels, damit
// OSTSCHWEIZ und STADT_MIN nur einmal vorkommen. feier.js löst die Namen auf; die Startseite lädt dafür karte.js und
// orte.js nach (feier.daten im Katalog).
if (typeof LS_FEIER !== "undefined") LS_FEIER.kartenDaten("schweiz", { karte: KARTE, auswahl: {
  wahlkreise: k => k.wahlkreise.map(w => w.d),
  kantone: k => k.kantone.map(x => x.d),
  ostschweiz: k => k.kantone.filter(x => OSTSCHWEIZ.includes(x.nr)).map(x => x.d),
  hauptorte: k => k.orte.filter(o => o.hauptort).map(o => [o.x, o.y]),
  staedte: k => k.orte.filter(o => !o.hauptort && o.einwohner >= STADT_MIN).map(o => [o.x, o.y]),
} });
