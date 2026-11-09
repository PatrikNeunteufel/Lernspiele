/* Inhaltsliste „Periodensystem: Elemente 1 bis 20“ (NT.3.2) — zum Durchsehen ohne Code.
   UNGEPRÜFT (LST_Session1), bis Patrik sie mit dem PSE des Lehrmittels abgeglichen hat. Je Element: Ordnungszahl (oz),
   Symbol, Name (Schweizer Schreibweise), Massenzahl des häufigsten Isotops (masse), Art (metall | nichtmetall |
   halbmetall | edelgas). Annahmen: Wasserstoff als Nichtmetall; Bor und Silicium als Halbmetalle (E6-1, LERN_Session24:
   in den Stufen nur Metall, Nichtmetall, Edelgas wie im Lehrplan, Halbmetalle nur in der Challenge); Isotope für
   Aufgaben nur mit den hier genannten Massenzahlen und den Beispielen unter „isotope“.
   Unter „weitere“ die übrigen der sechs meistgenannten Halbmetalle (B, Si, Ge, As, Sb, Te; Po, At, Se, Bi werden je nach
   Einteilung mitgezählt und fehlen hier) — nur für die Frage nach der Art in der Challenge. */
"use strict";

const PSE = {
  elemente: [
    { oz: 1, symbol: "H", name: "Wasserstoff", masse: 1, art: "nichtmetall" },
    { oz: 2, symbol: "He", name: "Helium", masse: 4, art: "edelgas" },
    { oz: 3, symbol: "Li", name: "Lithium", masse: 7, art: "metall" },
    { oz: 4, symbol: "Be", name: "Beryllium", masse: 9, art: "metall" },
    { oz: 5, symbol: "B", name: "Bor", masse: 11, art: "halbmetall" },
    { oz: 6, symbol: "C", name: "Kohlenstoff", masse: 12, art: "nichtmetall" },
    { oz: 7, symbol: "N", name: "Stickstoff", masse: 14, art: "nichtmetall" },
    { oz: 8, symbol: "O", name: "Sauerstoff", masse: 16, art: "nichtmetall" },
    { oz: 9, symbol: "F", name: "Fluor", masse: 19, art: "nichtmetall" },
    { oz: 10, symbol: "Ne", name: "Neon", masse: 20, art: "edelgas" },
    { oz: 11, symbol: "Na", name: "Natrium", masse: 23, art: "metall" },
    { oz: 12, symbol: "Mg", name: "Magnesium", masse: 24, art: "metall" },
    { oz: 13, symbol: "Al", name: "Aluminium", masse: 27, art: "metall" },
    { oz: 14, symbol: "Si", name: "Silicium", masse: 28, art: "halbmetall" },
    { oz: 15, symbol: "P", name: "Phosphor", masse: 31, art: "nichtmetall" },
    { oz: 16, symbol: "S", name: "Schwefel", masse: 32, art: "nichtmetall" },
    { oz: 17, symbol: "Cl", name: "Chlor", masse: 35, art: "nichtmetall" },
    { oz: 18, symbol: "Ar", name: "Argon", masse: 40, art: "edelgas" },
    { oz: 19, symbol: "K", name: "Kalium", masse: 39, art: "metall" },
    { oz: 20, symbol: "Ca", name: "Calcium", masse: 40, art: "metall" },
  ],
  // weitere Halbmetalle ausserhalb 1 bis 20 (nur Art, für die Challenge)
  weitere: [
    { oz: 32, symbol: "Ge", name: "Germanium", art: "halbmetall" },
    { oz: 33, symbol: "As", name: "Arsen", art: "halbmetall" },
    { oz: 51, symbol: "Sb", name: "Antimon", art: "halbmetall" },
    { oz: 52, symbol: "Te", name: "Tellur", art: "halbmetall" },
  ],
  // weitere natürliche Isotope (Massenzahlen) für Isotop-Aufgaben
  isotope: [
    { oz: 1, masse: 2 }, { oz: 6, masse: 13 }, { oz: 6, masse: 14 }, { oz: 8, masse: 18 }, { oz: 17, masse: 37 }, { oz: 12, masse: 26 },
  ],
};

if (typeof module !== "undefined") module.exports = PSE;
