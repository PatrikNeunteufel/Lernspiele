/* Prüfansicht des Verben-Fächers (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „verben“, aber jeder Eintrag trägt zwei Inhalte, die getrennt abzuhaken sind: den Satz mit den
   Ergänzungen, die das Verb braucht (Fächer, Stufen 1–4 und 6), und die drei Zeitformen (Stufen 5 und 6). Beide
   Abschnitte zeigen dieselben Einträge; Satz und Formen rechnet die Ansicht mit den Funktionen des Spiels aus
   (zerlegeVerb, satzIn, satzText), so wie das Kind sie sieht.
   Zu prüfen: Braucht das Verb genau diese Ergänzungen (ohne sie ist der Satz nicht fertig, keine freien Angaben) und
   beantwortet jede die Frage daneben? Passen Präsens, Präteritum und Perfekt zur Person im Satz, und ist das Perfekt
   so, wie man es in der Schweiz bildet (sonst leer)? */
"use strict";
{
  const quelle = () => VERBEN_LISTEN.verben;
  const fragenText = v => v.fragen.map(q => FRAGEN[q]).join(" ");
  const ergaenzungen = v => v.teile.map(t => `${FRAGEN[t.frage]} ${t.text}`).join(" · ");
  /** Satz in einer Zeitform, wie das Spiel ihn baut; ohne Perfekt (Schweiz anders) ein Strich. */
  const satzIm = (v, zeit) => (zeit === "perfekt" && !v.perfekt ? "— (nicht abgefragt)" : satzText(satzIn(v, zeit)));
  const hilfsverb = v => {
    const h = v.perfekt.split(" ")[0];
    if (!h) return "ohne Perfekt (in der Schweiz anders gebildet)";
    return h === "ist" || h === "sind" ? "Perfekt mit sein" : "Perfekt mit haben";
  };
  LS.listenPruefung("verben-faecher", {
    verben: {
      beschreibung: "Verben mit ihren Ergänzungen und Zeitformen. Stufe 1: das Verb im Satz finden (alle Verben). Stufen 2–4 und 6: Das Kind tippt im Fächer die Fragen an, die das Verb braucht, und baut dann den Satz aus Wortkarten (Stufe 2 nur Verben mit Wer oder was? und Wen oder was?, Stufe 3 dazu Wem?, Stufen 4 und 6 alle, dazu Wo? und Wohin?). Stufe 5: Personalform antippen oder den Infinitiv wählen, im Präsens, Präteritum oder Perfekt; Stufe 6 baut den Satz in einer dieser Zeitformen.",
      abschnitte: [
        { id: "satz", titel: "Satz und Fragen des Verbs (Stufen 1–4, 6)", spalten: ["Verb", "Fragen", "Satz", "Ergänzungen"],
          hinweis: "Je Fragen-Fächer eine Gruppe. Jede Ergänzung muss nötig sein, und ihre Frage muss passen (der, den, dem). Die Antworten auf Wem?, Wo? und Wohin? dienen in anderen Sätzen als falsche Wortkarten — sie dürfen dort nicht auch passen.",
          eintraege: quelle, gruppe: e => fragenText(zerlegeVerb(e)),
          zeile: e => { const v = zerlegeVerb(e); return [v.inf, fragenText(v), satzIm(v, "praesens"), ergaenzungen(v)]; } },
        { id: "formen", titel: "Zeitformen (Stufen 5, 6)", spalten: ["Infinitiv", "Präsens", "Präteritum", "Perfekt", "Satz im Präteritum", "Satz im Perfekt"],
          hinweis: "Je Hilfsverb eine Gruppe. Die Formen passen zur Person im Satz. In Stufe 5 stehen Infinitiv, Präsens, Präteritum und Partizip als Antworten zur Wahl — der Infinitiv darf nur einmal vorkommen.",
          eintraege: quelle, gruppe: e => hilfsverb(zerlegeVerb(e)),
          zeile: e => { const v = zerlegeVerb(e); return [v.inf, v.praesens, v.praeteritum, v.perfekt || "—", satzIm(v, "praeteritum"), satzIm(v, "perfekt")]; } },
      ],
    },
  });
}
