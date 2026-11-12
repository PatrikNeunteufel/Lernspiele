/* Prüfansicht des Lese-Detektivs (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Liste (Texte einer Stufe, Zuordnung LESETEXTE_LISTEN in texte.js) ein Abschnitt. Text und Frage stehen in einem
   Eintrag, nicht in getrennten Abschnitten: Zu jedem Text gibt es genau eine Frage, und ob sie eindeutig beantwortbar
   ist, lässt sich nur mit dem Text prüfen. Zu prüfen: Ist der Text richtig und für das Alter lesbar (bei Sachtexten:
   stimmen die Sachangaben?), folgt die richtige Antwort aus dem Text, und ist kein Ablenker auch richtig? */
"use strict";
{
  const LISTEN = {
    1: { titel: "Ein Satz mit Bild", stufen: "Stufe 1", tut: "Das Kind liest einen Satz und tippt das passende Bild an.",
      hinweis: "Genau ein Bild passt zum Satz; die beiden anderen unterscheiden sich in dem, was der Satz sagt (Farbe, Anzahl, Ding)." },
    2: { titel: "Kurztexte mit Frage", stufen: "Stufen 2, 3", tut: "Das Kind liest zwei, drei Sätze und beantwortet eine Frage.",
      hinweis: "Die Antwort steht wörtlich im Text; die Ablenker stehen nicht als Antwort darin. Die Namen sind erfunden." },
    3: { titel: "Kurze Sachtexte", stufen: "Stufen 3, 4", tut: "Das Kind liest einen kurzen Sachtext und beantwortet eine Frage.",
      hinweis: "Stimmen die Sachangaben? Die Antwort steht im Text." },
    4: { titel: "Zwischen den Zeilen", stufen: "Stufen 4, 5", tut: "Das Kind liest einen Kurztext und folgert, was nicht wörtlich dasteht (Welche Jahreszeit ist es?).",
      hinweis: "Die Antwort folgt eindeutig aus den Hinweisen im Text; kein Ablenker lässt sich ebenso begründen." },
    5: { titel: "Längere Sachtexte: Was stimmt?", stufen: "Stufen 5, 6", tut: "Das Kind liest einen längeren Sachtext und wählt die Aussage, die stimmt.",
      hinweis: "Stimmen die Sachangaben? Genau eine Aussage stimmt nach dem Text; die beiden anderen widersprechen ihm." },
    6: { titel: "Lange Sachtexte: Warum ist das so?", stufen: "Stufe 6 (Königsstufe)", tut: "Das Kind liest einen langen Sachtext und verbindet zwei Stellen, um eine Warum-Frage zu beantworten.",
      hinweis: "Stimmen die Sachangaben? Die Antwort steht nicht wörtlich da, folgt aber eindeutig aus dem Text; kein Ablenker lässt sich aus dem Text begründen." },
  };
  const defs = {};
  for (const [stufe, liste] of Object.entries(LESETEXTE_LISTEN)) {
    const l = LISTEN[stufe];
    const eintraege = () => LESETEXTE.filter(t => LESETEXTE_LISTEN[t[0]] === liste);
    const mitTitel = eintraege().some(t => t[1]);
    const bilder = Number(stufe) === 1;
    defs[liste] = {
      beschreibung: `Texte der Stufe ${stufe}, genutzt in ${l.stufen}. ${l.tut}`,
      abschnitte: [{
        id: liste, titel: l.titel, hinweis: l.hinweis,
        spalten: [...(mitTitel ? ["Titel"] : []), bilder ? "Satz" : "Text", "Frage", bilder ? "richtiges Bild" : "richtig", bilder ? "andere Bilder" : "Ablenker"],
        eintraege,
        zeile: ([, titel, text, frage, richtig, f1, f2]) => [...(mitTitel ? [titel || "–"] : []), text, frage, richtig, `${f1}; ${f2}`],
      }],
    };
  }
  LS.listenPruefung("lese-detektiv", defs);
}
