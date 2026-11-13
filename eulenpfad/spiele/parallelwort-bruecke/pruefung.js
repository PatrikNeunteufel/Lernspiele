/* Prüfansicht der Wörter-Brücke (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „parallel“ mit drei Inhalten, je ein Abschnitt: Parallelwörter (Brücken aus PARALLEL, gruppiert nach dem
   Kennzeichen „gleich“ oder „aehnlich“), falsche Freunde (Kennzeichen „falle“) und die kurzen Sätze (PARALLEL_SAETZE).
   Die Stufen liest die Stufentabelle des Spiels (STUFE_ARTEN, aus der es auch seine Aufgaben baut); ob ein Wort in eine
   Bild-Aufgabe kommt, sagt bildZiel des Spiels. Welche Wörter der Liste in einem Satz stehen, rechnet das Spiel mit
   nomen und ganzesWort (daraus nimmt es die Ablenker-Bilder); ob es den englischen Tipp zeigt, sagt hinweisFuer.
   Zu prüfen: Ist das Wort wirklich aus Deutsch oder Englisch erkennbar, stimmt die Bedeutung, Artikel und Akzente
   richtig, ist ein falscher Freund sicher einer? */
"use strict";
{
  /** Objekt des Spiels zu einem Rohdaten-Eintrag (ALLE ist PARALLEL in derselben Reihenfolge). */
  const wort = e => ALLE[PARALLEL.indexOf(e)];
  const KENNZ_TEXT = { gleich: "fast gleich", aehnlich: "ähnlich", falle: "falscher Freund" };
  const saetzeVon = w => PARALLEL_SAETZE.filter(([, fr]) => fr === w.fr);
  // Ziel einer Art: Brücken (alles ausser „falle“, wie BRUECKEN im Spiel) für die Bild-, Deutsch- und Französisch-
  // Aufgaben, Fallen (wie FALLEN) für „Was heisst das wirklich?“, beide für „Brücke oder Falle?“, Sätze nur mit Satz.
  const ZIEL = {
    bild: (w, kennz) => w.kennz !== "falle" && bildZiel(w, kennz),
    hoerBild: (w, kennz) => w.kennz !== "falle" && bildZiel(w, kennz),
    deutsch: w => w.kennz !== "falle",
    franz: w => w.kennz !== "falle",
    satz: w => saetzeVon(w).length > 0,
    freund: w => w.kennz === "falle",
    entscheid: () => true,
  };
  const stufenVon = w => Object.entries(STUFE_ARTEN)
    .filter(([, arten]) => arten.some(([art, kennz]) => ZIEL[art](w, kennz)))
    .map(([s]) => s.slice(1)).join(", ") || "— (in keiner Stufe!)";
  const stufenDerArt = art => Object.entries(STUFE_ARTEN).filter(([, arten]) => arten.some(([a]) => a === art)).map(([s]) => s.slice(1)).join(", ");
  /** Englisch, wie das Spiel es als Tipp zeigt — nicht, wenn es gleich wie das deutsche Wort ist (hinweisFuer). */
  function englisch(w) {
    if (!w.en) return "—";
    const tipp = hinweisFuer({ art: "bild", ziel: w });
    return typeof tipp === "string" && tipp.startsWith("Tipp:") ? w.en : `${w.en} (nicht gezeigt, wie Deutsch)`;
  }
  const ART_TEXT = {
    bild: "französisches Wort lesen, das passende Bild wählen",
    hoerBild: "Wort nur hören, das passende Bild wählen",
    deutsch: "zum französischen Wort das deutsche wählen (die anderen sehen ähnlich aus)",
    franz: "zum deutschen Wort das französische unter ähnlichen wählen",
    satz: "kurzen Satz lesen, das Bild zum Parallelwort darin wählen",
    freund: "falscher Freund: die richtige Bedeutung wählen, das gleich aussehende deutsche Wort steht als Falle daneben",
    entscheid: "Wortpaar: bedeuten beide dasselbe (Brücke), oder ist es eine Falle",
  };
  const stufenText = Object.entries(STUFE_ARTEN).map(([s, arten]) => `Stufe ${s.slice(1)}: ` + arten.map(([art, kennz, n]) =>
    `${ART_TEXT[art]}${kennz ? ` (nur ${kennz.map(k => KENNZ_TEXT[k]).join(" und ")}, mit Bild)` : ""}${n ? `, ${n} Antworten` : ""}`).join("; ")).join(". ");
  const bildZelle = b => b || "— (kein Bild)";

  LS.listenPruefung("parallelwort-bruecke", {
    parallel: {
      beschreibung: `Französische Wörter, die man aus dem Deutschen oder Englischen schon versteht, dazu falsche Freunde und kurze Sätze mit einem Parallelwort. ${stufenText}.`,
      abschnitte: [
        { id: "bruecke", titel: "Parallelwörter (Brücken)", spalten: ["Bild", "Französisch", "Deutsch", "Englisch (Tipp)", "Stufen", "Satz"],
          hinweis: "Je Kennzeichen eine Gruppe. Erkennt ein Kind der 5. Klasse das Wort wirklich aus dem Deutschen (Schweizer Schreibweise: Velo, Spital, Tram) oder Englischen — „fast gleich“ ohne Mühe, „ähnlich“ mit etwas Mut? Stimmt die Bedeutung, ist der Artikel (le, la, l’) richtig, stehen alle Akzente (é, è, ê, ô)? Englisch nur britisch und nur, wo es beim Erkennen hilft. Das Bild muss eindeutig zum Wort passen und darf mit keinem anderen Bild zu verwechseln sein (drei bis fünf Bilder stehen nebeneinander). In „Wie heisst das auf Französisch?“ und „Was heisst das auf Deutsch?“ stehen ähnlich aussehende Wörter daneben — kein deutsches Wort darf zu zwei französischen passen.",
          eintraege: () => PARALLEL.filter(e => e[4] !== "falle"),
          gruppe: e => (e[4] === "gleich" ? "sieht fast gleich aus (gleich)" : "ähnlich, mit etwas Mut zu erkennen (aehnlich)"),
          zeile: e => { const w = wort(e); return [bildZelle(w.bild), w.fr, w.de, englisch(w), stufenVon(w), saetzeVon(w).map(([s]) => s).join(" · ") || "—"]; } },
        { id: "falle", titel: "Falsche Freunde (Fallen)", spalten: ["Bild", "Französisch", "heisst", "nicht (sieht so aus)", "Englisch (nicht gezeigt)", "Stufen"],
          hinweis: "Bedeutet das französische Wort wirklich das unter „heisst“ — und nicht das deutsche Wort daneben? Sieht es dem deutschen Wort so ähnlich, dass ein Kind hineinfällt? Nur sichere Fallen: keine, bei der die falsche Bedeutung manchmal auch stimmt. Unter den Antworten stehen die Bedeutungen der anderen Fallen — keine darf auch hier passen. In „Brücke oder Falle?“ sieht das Kind das Paar „Französisch – nicht“.",
          eintraege: () => PARALLEL.filter(e => e[4] === "falle"),
          zeile: e => { const w = wort(e); return [bildZelle(w.bild), w.fr, w.de, w.falsch, w.en || "—", stufenVon(w)]; } },
        { id: "satz", titel: "Kurze Sätze mit einem Parallelwort", spalten: ["Bild", "Satz", "Parallelwort", "Deutsch", "Wörter der Liste im Satz", "Stufen"],
          hinweis: "Ist der Satz richtiges, sehr einfaches Französisch (Akzente, Apostroph ’), stimmt die deutsche Übersetzung? Das Kind wählt das Bild zum Parallelwort: Es muss das einzige Wort der Liste im Satz sein (Spalte „Wörter der Liste im Satz“ genau ein Eintrag), und der Satz darf zu keinem anderen Bild passen.",
          eintraege: () => PARALLEL_SAETZE,
          zeile: ([satz, fr, de]) => {
            const ziel = ALLE.find(w => w.fr === fr);
            const imSatz = ALLE.filter(w => ganzesWort(w.nomen).test(satz)).map(w => w.fr);
            return [bildZelle(ziel?.bild), satz, fr, de, imSatz.join(", ") || "— (keins!)", stufenDerArt("satz")];
          } },
      ],
    },
  });
}
