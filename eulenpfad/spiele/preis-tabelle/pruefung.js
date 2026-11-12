/* Prüfansicht der Preis-Tabelle (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Liste ein Abschnitt. Preise stehen in den Inhalten in Rappen; hier zusätzlich als Betrag, wie das Spiel ihn in der
   4. Klasse schreibt (LS.geldText). Zu prüfen: Passen die Preise ungefähr zu Schweizer Laden- und Kioskpreisen, stimmen
   Einzahl und Mehrzahl, passt der Satz zur Folge? Die Zahlen in den Tabellen erzeugt das Spiel. */
"use strict";
{
  const betrag = rp => LS.geldText(rp, 4);
  const spanne = (von, bis) => `${betrag(von)} bis ${betrag(bis)}`;
  LS.listenPruefung("preis-tabelle", {
    stueckware: {
      beschreibung: "Waren mit Preis je Stück (Stufen 2–6): Das Kind ergänzt die Preistabelle für mehrere Stück oder rechnet zurück, wie viele es sind.",
      abschnitte: [{
        id: "stueck", titel: "Ware je Stück", spalten: ["Bild", "Einzahl", "Mehrzahl", "Preis je Stück"],
        hinweis: "Das Spiel wählt den Stückpreis zwischen dem kleinsten und dem grössten Wert. Die Mehrzahl steht in der Tabelle („3 Äpfel“).",
        eintraege: () => ARTIKEL, zeile: ([bild, eins, mehr, von, bis]) => [bild, eins, mehr, spanne(von, bis)],
      }],
    },
    gewichtsware: {
      beschreibung: "Waren mit Preis je 100 g (Stufen 5 und 6): Das Kind rechnet den Preis für ein anderes Gewicht (Dreisatz).",
      abschnitte: [{
        id: "gewicht", titel: "Ware nach Gewicht", spalten: ["Bild", "Name", "Preis für 100 g"],
        hinweis: "Das Spiel wählt den Preis für 100 g zwischen dem kleinsten und dem grössten Wert.",
        eintraege: () => WARE_GEWICHT, zeile: ([bild, name, von, bis]) => [bild, name, spanne(von, bis)],
      }],
    },
    folgen: {
      beschreibung: "Folgen in Tabellen (Stufe 1): Jede Zeile kommt gleich viel dazu; das Kind setzt die Folge fort.",
      abschnitte: [{
        id: "folge", titel: "Folgen in Tabellen", spalten: ["Bild", "Spalte links", "Spalte rechts", "rechts steht", "Satz zur Frage"],
        hinweis: "Der Satz muss sagen, dass jedes Mal gleich viel dazukommt; die Spalten müssen dazu passen.",
        eintraege: () => FOLGEN, zeile: ([bild, links, rechts, geld, satz]) => [bild, links, rechts, geld ? "ein Frankenbetrag" : "eine Zahl", satz],
      }],
    },
  });
}
