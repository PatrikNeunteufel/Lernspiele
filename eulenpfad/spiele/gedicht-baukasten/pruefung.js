/* Prüfansicht des Gedicht-Baukastens (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Fünf Listen aus gedichte.js, je ein Abschnitt: die Zweizeiler (REIMPAARE) mit dem ergänzten Reimwort und den drei
   falschen Wahlen, die Vierzeiler je Reimschema (VIERZEILER.paarreim, .kreuzreim, .umarmend) mit den Reimpaaren, wie
   das Spiel sie paart (PARTNER, endwort), und die Gedichte mit Strophen (STROPHEN_GEDICHTE) je Strophe mit Reimschema.
   Zu prüfen: Reimen sich die Reimpaare rein und nur sie (bei „Welches Wort reimt sich?“ sind die übrigen Endwörter die
   falschen Wahlen), passt das Reimschema, ist die Reihenfolge der Verse eindeutig — und reimt sich bei den Zweizeilern
   nur das Reimwort und die Falle, während die beiden anderen Wahlen zum Sinn passen? */
"use strict";
{
  const NAME = { paarreim: "Paarreim", kreuzreim: "Kreuzreim", umarmend: "umarmender Reim" };
  /** Reimschema einer Strophe als Text; zwei Verse im Paarreim sind „aa“. */
  const schemaText = (schema, verse) => (verse.length === 4 ? SCHEMA[schema] : `${NAME[schema]} (${"a".repeat(verse.length)})`);
  /** Reimpaare wie im Spiel: im Vierzeiler nach PARTNER, sonst je zwei Verse nacheinander. */
  const reimpaare = (schema, verse) => {
    const partner = verse.length === 4 ? PARTNER[schema] : verse.map((v, i) => i ^ 1);
    return verse.map((v, i) => [i, partner[i]]).filter(([i, p]) => i < p)
      .map(([i, p]) => `${endwort(verse[i])} – ${endwort(verse[p])}`).join(" · ");
  };
  const ARTEN = "Reimwort finden (Stufen 2–4), Verse zählen und einen Vers antippen (Stufen 3, 6), die Verse ordnen (Stufen 4–6), das Reimschema bestimmen (Stufen 5, 6).";
  /** „im …“: Dativ des Reimschemas. */
  const IM = { paarreim: "Paarreim (aabb)", kreuzreim: "Kreuzreim (abab)", umarmend: "umarmenden Reim (abba)" };
  const vierzeiler = liste => ({
    beschreibung: `Vierzeiler im ${IM[liste]}: ${ARTEN}`,
    abschnitte: [{
      id: liste, titel: `Vierzeiler im ${IM[liste]}`, spalten: ["Vers 1", "Vers 2", "Vers 3", "Vers 4", "Reimpaare"],
      hinweis: `Nur der letzte Vers endet mit Punkt oder Ausrufezeichen, sonst wäre das Ordnen nicht eindeutig${liste === "umarmend" ? "; der dritte Vers beginnt mit „und“" : ""}. Kein Endwort darf sich mit einem anderen als seinem Partner reimen.`,
      eintraege: () => VIERZEILER[liste],
      zeile: verse => [...verse, reimpaare(liste, verse)],
    }],
  });
  const strophe = s => (s ? `${schemaText(s[0], s.slice(1))}: ${s.slice(1).join(" / ")}` : "—");
  LS.listenPruefung("gedicht-baukasten", {
    reimpaare: {
      beschreibung: "Zweizeiler (Stufen 1, 2): Im zweiten Vers fehlt das letzte Wort; das Kind wählt aus drei Wörtern das, das sich reimt und zum Sinn passt. Stufe 1: Reimwort und zwei Wörter, die passen, aber sich nicht reimen. Stufe 2: Reimwort, ein passendes Wort und eine Falle, die sich reimt, aber nicht passt.",
      abschnitte: [{
        id: "reimpaare", titel: "Zweizeiler zum Ergänzen", spalten: ["Vers 1", "Vers 2 mit Reimwort", "Reimwort", "passt, reimt nicht (Stufen 1, 2)", "passt, reimt nicht (Stufe 1)", "Falle: reimt, passt nicht (Stufe 2)"],
        hinweis: "Das Reimwort in „…“. Die zwei Wörter, die passen, dürfen sich nicht reimen; die Falle muss sich reimen und darf im Satz keinen Sinn ergeben.",
        eintraege: () => REIMPAARE,
        zeile: ([v1, v2, richtig, f1, f2, falle]) => [v1, v2.replace("{}", `„${richtig}“`), richtig, f1, f2, falle],
      }],
    },
    paarreim: vierzeiler("paarreim"),
    kreuzreim: vierzeiler("kreuzreim"),
    umarmend: vierzeiler("umarmend"),
    strophen: {
      beschreibung: "Gedichte mit zwei oder drei Strophen (Stufen 3, 6): Verse oder Strophen zählen, einen Vers einer Strophe antippen; in Stufe 6 auch das Reimschema einer vierzeiligen Strophe bestimmen.",
      abschnitte: [{
        id: "strophen", titel: "Gedichte mit Strophen", spalten: ["Titel", "Strophen", "Verse", "Strophe 1", "Strophe 2", "Strophe 3", "Reimpaare"],
        hinweis: "Je Strophe das Reimschema, wie es das Spiel abfragt (nur bei vier Versen), und die Verse. Reimpaare je Strophe durch „|“ getrennt.",
        eintraege: () => STROPHEN_GEDICHTE,
        zeile: ([titel, strophen]) => [titel, strophen.length, strophen.reduce((n, s) => n + s.length - 1, 0),
          strophe(strophen[0]), strophe(strophen[1]), strophe(strophen[2]),
          strophen.map(s => reimpaare(s[0], s.slice(1))).join(" | ")],
      }],
    },
  });
}
