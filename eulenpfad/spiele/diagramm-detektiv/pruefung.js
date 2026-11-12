/* Prüfansicht des Daten-Detektivs (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „umfragen“ mit zwei Inhalten, je für sich abzuhaken: die Fragen je Umfrage und die Kategorien, jede mit
   der Frage, wie das Spiel sie stellt ({x} durch das Wort der Kategorie ersetzt). Die Zahlen erzeugt das Spiel. */
"use strict";
{
  const art = u => (u.durchschnitt ? "Zählung über die Woche (mit Durchschnitt, Stufen 5 und 6)" : "Umfrage unter Kindern");
  LS.listenPruefung("diagramm-detektiv", {
    umfragen: {
      beschreibung: "Umfragen und Zählungen aus dem Schulalltag: Das Kind liest Strichliste, Tabelle oder Säulendiagramm ab und beantwortet Fragen (wie viele, am meisten, am wenigsten, mehr als, zusammen, Durchschnitt). Die Zahlen erzeugt das Spiel.",
      abschnitte: [
        { id: "umfrage", titel: "Umfragen: Titel und Fragen", spalten: ["Titel", "gezählt (Einzahl / Mehrzahl)", "am meisten", "am wenigsten", "Durchschnitt", "Klassen (Königsstufe)"],
          hinweis: "Die Fragen müssen zu dem passen, was gezählt wird; die Klassen stehen im Doppel-Säulendiagramm der Königsstufe.",
          eintraege: () => UMFRAGEN, gruppe: art,
          zeile: u => [u.titel, `1 ${u.einzahl} / ${u.einheit}`, u.meist, u.wenigst, u.durchschnitt || "—", (u.gruppen || []).join(", ") || "—"] },
        { id: "kategorie", titel: "Kategorien und ihre Frage", spalten: ["Bild", "Beschriftung", "Wort in der Frage", "Frage im Spiel", "im Vergleich"],
          hinweis: "Je Umfrage eine Gruppe. Die Beschriftung steht unter der Säule (höchstens 8 Zeichen); die Frage muss mit dem Wort ein richtiger Satz sein.",
          eintraege: () => UMFRAGEN.flatMap(u => u.kategorien.map(k => ({ umfrage: u.titel, k }))),
          gruppe: e => e.umfrage,
          zeile: ({ umfrage, k: [bild, name, wort, vergleich] }) => [bild, name, wort,
            UMFRAGEN.find(u => u.titel === umfrage).frage.replace("{x}", wort), vergleich || `bei ${bild} ${name}`] },
      ],
    },
  });
}
