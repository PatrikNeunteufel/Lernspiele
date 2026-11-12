/* Prüfansicht der Trenn-Schere (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „woerter“ (TRENN_WOERTER.woerter) mit zwei Inhalten, je für sich abzuhaken: Wörter mit Trennstellen und
   Wörter, die man nicht trennt. Jedes Wort wird so zerlegt wie im Spiel (zerlegeWort, getrennt); die Regel, die es übt,
   und damit seine Stufe bestimmt das Spiel selbst (artVon) — danach die Gruppen.
   Zu prüfen: Stehen genau die Trennstellen, die nach der Regel seit 1996 erlaubt sind (keine fehlt, keine zu viel; ck,
   ch, sch zusammen, st getrennt, kein einzelner Vokal abgetrennt), liegt die Fuge eines zusammengesetzten Worts oder
   einer Vorsilbe an der richtigen Stelle — und darf ein Wort ohne Trennstelle wirklich nicht getrennt werden? */
"use strict";
{
  // Stufen je Regel wie STUFE im Spiel (Stufe 1 nur einfache Wörter mit höchstens zwei Trennstellen); in Stufe 6 alle
  // Wörter, in Stufen 5 und 6 alle auch als Zeilenende.
  const REGELN = {
    einfach: "Nach Sprechsilben (Stufen 1, 2)",
    ckst: "ck, ch, sch zusammen, st getrennt (Stufe 3)",
    zusammen: "Zusammengesetzt oder mit Vorsilbe (Stufe 4)",
    vokal: "Einzelner Vokal am Wortanfang bleibt am Wort (Stufe 5)",
  };
  const regelVon = text => zerlegeWort(text).regel;
  /** Teile eines zusammengesetzten Worts, wie die Liste sie mit „|“ markiert. */
  const zeigeTeile = text => text.split("|").map(t => t.replace(/-/g, "")).join(" + ");
  /** Grund ohne Trennstelle: Silben grob gezählt (Doppellaute au, ei, eu, äu, ie als ein Vokal). */
  const grund = text => (/[aeiouäöü].*[aeiouäöü]/i.test(text.replace(/au|ei|eu|äu|ie/gi, "a"))
    ? "zwei Silben, aber ein einzelner Vokal am Anfang oder Ende" : "einsilbig");
  LS.listenPruefung("trenn-schere", {
    woerter: {
      beschreibung: "Wörter zum Trennen am Zeilenende. Das Kind setzt alle Trennstriche (Stufe 1: einfache Wörter, die Zahl der Striche steht dabei; 2 nach Sprechsilben; 3 ck, ch, sch und st; 4 zusammengesetzte Wörter und Vorsilben; 5 Wörter, die man nicht oder nur ohne einzelnen Vokal trennt; 6 alles gemischt). In Stufen 5 und 6 trennt es ausserdem jedes Wort der Liste am Zeilenende mit wenig Platz an der grössten erlaubten Stelle oder schreibt es ganz auf die neue Zeile.",
      abschnitte: [
        { id: "trennbar", titel: "Wörter mit Trennstellen",
          spalten: ["Wort", "getrennt (Lösung im Spiel)", "Trennstriche", "Teile (Fuge oder Vorsilbe)"],
          hinweis: "Je Regel eine Gruppe; die Regel bestimmt das Spiel aus dem Wort. Im Spiel ist jede Trennstelle ein Trennstrich; die Spalte Teile zeigt, wo die Liste eine Fuge oder Vorsilbe markiert (|).",
          eintraege: () => TRENN_WOERTER.woerter.filter(text => regelVon(text) !== "ohne"),
          gruppe: text => REGELN[regelVon(text)],
          zeile: text => {
            const w = zerlegeWort(text);
            return [w.wort, getrennt(w), w.stellen.length, w.regel === "zusammen" ? zeigeTeile(text) : "—"];
          } },
        { id: "ohne", titel: "Wörter, die man nicht trennt (Stufe 5)",
          spalten: ["Wort"],
          hinweis: "Je Grund eine Gruppe (Silben von der Ansicht grob gezählt, nicht vom Spiel). Einsilbig oder nur mit einem einzelnen Vokal am Anfang oder Ende trennbar — dann gar nicht. Das Kind tippt ohne Trennstrich auf „Prüfen“; am Zeilenende kommt das Wort ganz auf die neue Zeile.",
          eintraege: () => TRENN_WOERTER.woerter.filter(text => regelVon(text) === "ohne"),
          gruppe: grund, zeile: text => [text] },
      ],
    },
  });
}
