/* Inhalte des Möglichkeiten-Finders (Lehrplan SG MA.3.B.2) — UNGEPRÜFT, bitte von Eltern oder
   Lehrperson prüfen lassen. Schweizer Schreibweise (ss statt ß).

   Inhaltslisten (Entscheid L4 a), der Prüfstand steht im Katalog (spiele/gemeinsam/katalog.js,
   Eintrag „glace-kombinator“, Feld listen):
   - „sorten“: Glacesorten. Spalten [Name, Farbe der Kugel, Buchstabe auf der Kugel]. Der Buchstabe
     hilft, ähnliche Farben zu unterscheiden; jeder Buchstabe kommt nur einmal vor. Die Farben sind
     Inhalt (wie die Sorte aussieht), keine Farben des Rahmens.
   - „kleider“: Kleidungsstücke. Spalten [Gruppe, Bild (Emoji), Name]. Gruppen in KLEIDER_GRUPPEN;
     ein Kleider-Set nimmt aus jeder Gruppe genau ein Stück. */

const GLACE_LISTEN = ["sorten", "kleider"];

const GLACE_SORTEN = [
  ["Vanille", "#f3e2a4", "V"],
  ["Schokolade", "#7a4a2a", "S"],
  ["Erdbeere", "#f48fb1", "E"],
  ["Zitrone", "#fff04d", "Z"],
  ["Pistazie", "#9cc97a", "P"],
  ["Himbeere", "#d81b60", "H"],
  ["Mango", "#ffa630", "M"],
  ["Caramel", "#d08a48", "C"], // heller (vorher #c27c3a): dunkle Schrift 4,6 statt 3,8
  ["Blaubeere", "#5c6bc0", "B"],
  ["Kokos", "#ffffff", "K"],
];

// name: Mehrzahl (Überschrift, Lösung), eins: Einzahl („1 Oberteil“)
const KLEIDER_GRUPPEN = {
  oberteil: { name: "Oberteile", eins: "Oberteil" },
  hose: { name: "Hosen", eins: "Hose" },
  schuhe: { name: "Paar Schuhe", eins: "Paar Schuhe" },
  kopf: { name: "Kopfbedeckungen", eins: "Kopfbedeckung" },
};

const KLEIDER = [
  ["oberteil", "👕", "T-Shirt"],
  ["oberteil", "👚", "Bluse"],
  ["oberteil", "🧥", "Jacke"],
  ["oberteil", "🎽", "Trägershirt"],
  ["hose", "👖", "lange Hose"],
  ["hose", "🩳", "kurze Hose"],
  ["schuhe", "👟", "Turnschuhe"],
  ["schuhe", "🥾", "Wanderschuhe"],
  ["schuhe", "👢", "Stiefel"],
  ["schuhe", "🩴", "Flipflops"],
  ["schuhe", "👡", "Sandalen"],
  ["schuhe", "👞", "Halbschuhe"],
  ["kopf", "🧢", "Kappe"],
  ["kopf", "👒", "Sonnenhut"],
  ["kopf", "🎩", "Zylinder"],
];
