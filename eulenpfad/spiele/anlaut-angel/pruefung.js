/* Prüfansicht der Anlaut-Angel (LP1 a, LERN_Session11; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Liste ein Abschnitt, gruppiert nach dem Laut, um den es geht; die Spalte „Laut“ rechnet das Spiel genau so aus wie
   in der Aufgabe (erster Buchstabe, letzter Buchstabe, erster Selbstlaut). Zu prüfen: Passt das Bild eindeutig zum Wort,
   und hört man den Laut wirklich so (keine Auslautverhärtung, kein stummes h)? */
"use strict";
{
  const zeile = ([wort, bild], laut) => [bild, wort, laut];
  const gross = w => w[0].toUpperCase();
  const selbstlaut = w => w.toLowerCase().split("").find(b => "aeiou".includes(b)) || "?";
  LS.listenPruefung("anlaut-angel", {
    anlaut: {
      beschreibung: "Wörter mit Bild für den Anfangslaut (Stufen 1, 2, 3, 6; auch Blitzlesen und Buchstaben-Zwillinge nutzen sie). Das Kind sieht das Bild und wählt den ersten Buchstaben — oder umgekehrt das Bild zum Buchstaben.",
      abschnitte: [{
        id: "anlaut", titel: "Anfangslaut", spalten: ["Bild", "Wort", "Anlaut"],
        hinweis: "Je Buchstabe eine Gruppe. Keine Anlaute, die man anders hört (V wie F, Sch, St, Sp, Pf, Ch, Au, Ei, Eu).",
        eintraege: () => ANLAUT_WOERTER, zeile: e => zeile(e, gross(e[0])), gruppe: e => gross(e[0]),
      }],
    },
    endlaut: {
      beschreibung: "Wörter mit Bild für den Endlaut (Stufen 3, 4, 6): Das Kind wählt den letzten Buchstaben.",
      abschnitte: [{
        id: "endlaut", titel: "Endlaut", spalten: ["Bild", "Wort", "Endlaut"],
        hinweis: "Je Endbuchstabe eine Gruppe. Man muss den Buchstaben am Ende so hören: kein b, d, g (klingt wie p, t, k), kein -er, -h, -e.",
        eintraege: () => ENDLAUT_WOERTER, zeile: e => zeile(e, e[0].slice(-1)), gruppe: e => e[0].slice(-1),
      }],
    },
    mitte: {
      beschreibung: "Einsilbige Wörter mit Bild für den Selbstlaut in der Mitte (Stufen 4, 5, 6): Das Kind wählt a, e, i, o oder u.",
      abschnitte: [{
        id: "mitte", titel: "Selbstlaut in der Mitte", spalten: ["Bild", "Wort", "Selbstlaut"],
        hinweis: "Je Selbstlaut eine Gruppe. Genau ein Selbstlaut, kurz oder lang, kein Umlaut und kein Doppellaut.",
        eintraege: () => MITTE_WOERTER, zeile: e => zeile(e, selbstlaut(e[0])), gruppe: e => selbstlaut(e[0]),
      }],
    },
    luecke: {
      beschreibung: "Lautgetreue Wörter mit Bild für „Welcher Buchstabe fehlt?“ (Stufen 5, 6): Ein beliebiger Buchstabe fehlt, das Kind setzt ihn ein.",
      abschnitte: [{
        id: "luecke", titel: "Lückenwörter", spalten: ["Bild", "Wort", "Buchstaben"],
        hinweis: "Jeder Buchstabe kann die Lücke sein — das Wort muss sich Buchstabe für Buchstabe so schreiben, wie man es hört.",
        eintraege: () => LUECKEN_WOERTER, zeile: e => zeile(e, e[0].length), gruppe: e => `${e[0].length} Buchstaben`,
      }],
    },
  });
}
