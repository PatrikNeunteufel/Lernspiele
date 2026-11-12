/* Prüfansicht der Wort-Spürnase (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „saetze“ mit einem Abschnitt: Alle Einträge haben denselben Aufbau (Text mit schwierigem Wort und
   Hinweis, eine richtige und zwei falsche Bedeutungen); die Stufe im ersten Feld bestimmt nur, wo der Hinweis steht.
   Deshalb je Stufe eine Gruppe, nicht je Stufe ein Abschnitt; in Stufe 5 sind die Gegensätze („nicht …, sondern …“)
   eine eigene Gruppe, weil dort der Hinweis das Gegenteil des Worts ist. Wort und Hinweis zerlegt die Ansicht wie das
   Spiel (zerlege). Zu prüfen: Gilt die richtige Bedeutung für das Wort, wie es im Text steht, verrät der Hinweis sie
   (in Stufe 1–2 im selben Satz, in 3–4 im nächsten), und ist keine falsche Bedeutung ebenso möglich? */
"use strict";
{
  const STUFEN = {
    1: "Stufe 1 (4. Klasse): bekanntere Wörter, Hinweis im selben Satz",
    2: "Stufe 2: seltenere Wörter, Hinweis im selben Satz",
    3: "Stufe 3: Hinweis im nächsten Satz",
    4: "Stufe 4 (auch Stufe 6): seltenere Wörter, Hinweis im nächsten Satz",
    5: "Stufe 5 (auch Stufe 6): Fremdwörter, Hinweis irgendwo im Text",
  };
  const GEGENSATZ = /\bnicht\b.*\bsondern\b|\bim Gegensatz\b|^statt\b/i;
  const teil = (teile, art) => teile.find(t => t.art === art)?.text || "—";
  LS.listenPruefung("wort-spuernase", {
    saetze: {
      beschreibung: "Texte mit einem schwierigen Wort (Stufen 1–5 je ihre Sätze, Stufe 6 die Sätze der Stufen 4 und 5): Das Kind liest den Text und wählt die Bedeutung des farbigen Worts aus drei; danach zeigt das Spiel den Hinweis. In Stufe 6 tippt das Kind den Hinweis im Text selbst an (jedes Wort des Hinweises zählt).",
      abschnitte: [{
        id: "saetze", titel: "Texte mit schwierigem Wort", spalten: ["Text", "Wort", "Hinweis", "richtig", "falsch"],
        hinweis: "Je Stufe eine Gruppe. Der Hinweis (ein bis drei Wörter) nennt das Wort nicht selbst. Bei den Gegensätzen ist der Hinweis das Gegenteil; die falsche Bedeutung, die dem Hinweis gleicht, ist dort Absicht.",
        eintraege: () => SPUER_SAETZE,
        gruppe: ([nr, text]) => (nr === 5 && GEGENSATZ.test(text) ? "Stufe 5 (auch Stufe 6): Gegensätze, der Hinweis ist das Gegenteil" : STUFEN[nr] || `Stufe ${nr}`),
        zeile: ([, text, richtig, f1, f2]) => {
          const teile = zerlege(text);
          return [teile.map(t => t.text).join(""), teil(teile, "wort"), teil(teile, "hinweis"), richtig, `${f1}; ${f2}`];
        },
      }],
    },
  });
}
