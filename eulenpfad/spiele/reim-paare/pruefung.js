/* Prüfansicht der Reim-Paare (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Zwei Listen mit je einem Inhalt: Reimgruppen (ein Eintrag je Gruppe, gruppiert danach, wofür das Spiel sie nehmen
   kann: „reimt nicht“ braucht drei Wörter mit Bild, die Paare zwei) und Verse (gruppiert nach den Stufen, in denen der
   Vers vorkommt; die Spalte „reimt auf“ sucht das Reimwort im Vers genau so wie pruefeAufgabe). Zu prüfen: Reimen sich
   alle Wörter einer Gruppe wirklich (gleich ab dem betonten Selbstlaut, auch in der Mundart nicht nur zufällig)? Reimt
   sich kein Wort auf eines einer anderen Gruppe? Passt jedes Bild eindeutig zum Wort? Ist der Vers sinnvoll und reimt
   sich die Lösung auf ein Wort im Vers? */
"use strict";
{
  const mitBild = g => g.filter(([, bild]) => bild);
  const wortMitBild = ([wort, bild]) => (bild ? `${bild} ${wort}` : wort);
  const gruppeVon = wort => REIMGRUPPEN.find(g => g.some(([w]) => w === wort));
  const eintragVon = wort => gruppeVon(wort)?.find(([w]) => w === wort);
  /** Reimwörter zur Lösung, die im Vers stehen (wie pruefeAufgabe im Spiel: Teilzeichenkette des Verses). */
  const reimImVers = ([text, wort]) => (gruppeVon(wort) || []).filter(([w]) => w !== wort && text.includes(w)).map(([w]) => w);
  const versStufen = ([, wort]) => (eintragVon(wort)?.[1] ? "Stufen 5 und 6 (Lösung mit Bild)" : "nur Stufe 6 (Lösung ohne Bild)");
  LS.listenPruefung("reim-paare", {
    reimgruppen: {
      beschreibung: "Gruppen von Wörtern, die sich reimen, mit Bild (alle Stufen): Welches Bild reimt sich (Stufen 1, 2), Reim-Paare finden (3, 4, 6), welches reimt sich nicht (4, 5). Wörter ohne Bild kommen nur in Stufe 6 als Auswahl in den Versen vor. Wörter verschiedener Gruppen dürfen sich nicht reimen.",
      abschnitte: [{
        id: "gruppe", titel: "Reimgruppen", spalten: ["Wörter mit Bild", "Wörter ohne Bild (nur Stufe 6)"],
        hinweis: "Ein Eintrag je Gruppe. Alle Wörter einer Zeile reimen sich, keines reimt sich auf ein Wort einer anderen Zeile. Passt jedes Bild eindeutig zu seinem Wort?",
        eintraege: () => REIMGRUPPEN,
        gruppe: g => (mitBild(g).length >= 3 ? "drei oder mehr mit Bild (auch „reimt nicht“)"
          : mitBild(g).length === 2 ? "zwei mit Bild (Paare, „welches reimt sich“)" : "weniger als zwei mit Bild (nur Stufe 6)"),
        zeile: g => [mitBild(g).map(wortMitBild).join(" – ") || "—", g.filter(([, bild]) => !bild).map(([w]) => w).join(", ") || "—"],
      }],
    },
    reimverse: {
      beschreibung: "Verse mit einer Lücke (Stufen 5 und 6): Das Kind wählt das Wort, das sich auf ein Wort im Vers reimt und in den Satz passt. Stufe 5 nimmt nur Verse, deren Lösung ein Bild hat. Ist nur diese Liste frei, sind die Lösungswörter der anderen Verse die Auswahl; das Bild zur Lösung kommt aus den Reimgruppen.",
      abschnitte: [{
        id: "vers", titel: "Verse", spalten: ["Vers mit Lösung", "Lösung", "reimt auf"],
        hinweis: "Je Stufe eine Gruppe. Ergibt der Vers mit der Lösung einen sinnvollen Satz, und reimt sich die Lösung auf das Wort in „reimt auf“?",
        eintraege: () => REIMVERSE,
        gruppe: versStufen,
        zeile: v => [v[0].replace("___", `„${v[1]}“`), eintragVon(v[1]) ? wortMitBild(eintragVon(v[1])) : `${v[1]} (nicht in den Reimgruppen!)`,
          reimImVers(v).join(", ") || "— (kein Reimwort im Vers!)"],
      }],
    },
  });
}
