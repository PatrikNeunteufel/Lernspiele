/* Prüfansicht der Hör-Geschichte (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „geschichten“, je Gruppe der Geschichten ein Abschnitt (sehr kurz, kurz, länger), weil jede Gruppe andere
   Fragearten hat. Geschichte und Fragen stehen in einem Eintrag, wie im Lese-Detektiv: Ob eine Frage eindeutig
   beantwortbar ist, lässt sich nur mit der Geschichte prüfen. Je Frageart eine Spalte („Frage → richtig (sonst: …)“),
   damit jede Spalte dieselbe Bedeutung hat. Welche Stufen eine Gruppe nehmen, steht in der Stufentabelle des Spiels
   (STUFE); die Wortzahl zählt die Zeile wie pruefeAufgabe, mit dem Bereich des Spiels (WORTZAHL). Eingetragen sind die
   Rohdaten (HOER_GESCHICHTEN aus geschichten.js), nicht der freigegebene Vorrat des Spiels.
   Zu prüfen: Passt die Geschichte zum Alter und ist sie gut vorzulesen? Folgt die richtige Antwort aus dem Gehörten (bei
   „Schluss“: lässt sie sich schliessen), und ist kein Ablenker ebenso richtig? Passen die Bilder zu den Antworten? */
"use strict";
{
  const ARTEN = {
    wer: "Wer?", wo: "Wo?", was: "Was?", warum: "Warum?", reihenfolge: "Reihenfolge",
    schluss: "Schluss (erschliessen)", titel: "Titel (Stufe 6)", weiter: "Fortsetzung (Stufe 6)",
  };
  /** Gruppen und ihre Fragearten wie in geschichten.js beschrieben (pruefeAufgabe prüft, dass sie da sind). */
  const GRUPPEN = {
    1: { titel: "Sehr kurze Geschichten", arten: ["wer", "wo", "was"],
      hinweis: "Drei Sätze. Das Kind hört die Geschichte und beantwortet eine der drei Fragen, Antworten mit Bild und "
        + "Wort. Steht die Antwort so in der Geschichte, und zeigt das Bild sie eindeutig? Ist kein Ablenker auch "
        + "richtig (etwa eine Person, die auch vorkommt, aber das Gefragte nicht tut)?" },
    2: { titel: "Kurze Geschichten mit Grund und Reihenfolge", arten: ["wer", "wo", "was", "warum", "reihenfolge"],
      hinweis: "Stufe 2 zeigt die Fragen vor dem Hören, mit Bild; Stufen 3 und 4 zeigen bei Wer, Wo, Was nur das Wort "
        + "nach dem Bild. Steht die Antwort in der Geschichte (bei Warum: mit weil, darum, damit)? Ist kein Ablenker "
        + "auch richtig? Reihenfolge: drei Ereignisse in der Reihenfolge der Geschichte, das Spiel mischt sie — sind "
        + "sie eindeutig zu ordnen?" },
    3: { titel: "Längere Geschichten mit Schluss, Titel und Fortsetzung", arten: ["wer", "wo", "was", "schluss", "titel", "weiter"],
      hinweis: "Antworten ohne Bild. Wer, Wo, Was stehen in der Geschichte. Schluss steht nicht wörtlich da: Folgt "
        + "die Antwort aus dem Gehörten, und lässt sich kein Ablenker ebenso begründen? Titel (in Stufe 6 bleibt der "
        + "Titel verborgen): passt nur der richtige zur ganzen Geschichte? Fortsetzung: passt nur die richtige zum "
        + "Schluss der Geschichte?" },
  };
  /** Stufen, die eine Gruppe nehmen — aus der Stufentabelle des Spiels. */
  const stufenVon = gruppe => {
    const liste = Object.keys(STUFE).filter(s => STUFE[s].gruppe === Number(gruppe)).map(s => s.slice(1));
    return liste.length > 1 ? `Stufen ${liste.join(", ")}` : `Stufe ${liste[0]}`;
  };
  const wortzahl = g => {
    const [min, max] = WORTZAHL[g.gruppe];
    return `${g.text.split(/\s+/).length} (${min}–${max})`;
  };
  /** Zelle einer Frageart: „Frage → richtig (sonst: …)“; Reihenfolge mit den drei Ereignissen in ihrer Folge. */
  const frageZelle = (g, art) => {
    const f = g.fragen.find(x => x[0] === art);
    if (!f) return "–";
    const [, frage, richtig, ...falsch] = f;
    if (art === "reihenfolge") return `${frage} ${richtig.join(" → ")}`;
    return `${frage} → ${richtig} (sonst: ${falsch.join("; ")})`;
  };
  const abschnitte = Object.entries(GRUPPEN).map(([gruppe, def]) => ({
    id: `gruppe${gruppe}`, titel: `${def.titel} (${stufenVon(gruppe)})`, hinweis: def.hinweis,
    spalten: ["Titel", "Geschichte", "Wörter", ...def.arten.map(a => ARTEN[a])],
    eintraege: () => HOER_GESCHICHTEN.filter(g => g.gruppe === Number(gruppe)),
    zeile: g => [g.titel, g.text, wortzahl(g), ...def.arten.map(a => frageZelle(g, a))],
  }));
  LS.listenPruefung("hoer-geschichte", {
    geschichten: {
      beschreibung: "Kurze Geschichten zum Vorlesen mit Fragen. Die Eule erzählt die Geschichte (der Text ist dabei nicht "
        + "zu sehen), danach beantwortet das Kind Fragen: Stufe 1 eine Frage mit Bildern (Wer? Wo? Was?), Stufe 2 zwei "
        + "Fragen mit Bildern, schon vor dem Hören gezeigt, Stufe 3 Wer, Wo und Was, Stufe 4 zwei davon und dazu Warum "
        + "oder „Was passierte zuerst?“ (drei Ereignisse ordnen), Stufe 5 längere Geschichten mit zwei Fragen und einer "
        + "zum Erschliessen, Stufe 6 eine Frage, eine zum Erschliessen, welcher Titel passt und wie es weitergeht.",
      abschnitte,
    },
  });
}
