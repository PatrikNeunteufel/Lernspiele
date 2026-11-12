/* Prüfansicht der Komma-Jagd (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Drei Listen (KOMMA_SAETZE[<liste>]). Jeder Satz steht mit seinen Kommas da; das Spiel nimmt sie heraus (zerlege),
   und das Kind setzt sie wieder. Die Stufen je Satz rechnet die Ansicht aus STUFE des Spiels (Filter nach der Zahl der
   Kommas). Die Liste „verbgruppen“ trägt zwei Aufbauten und hat deshalb zwei Abschnitte: zwei Verbgruppen mit einem
   Komma (Stufen 4, 5) und Sätze mit mehreren Kommas, auch mit Aufzählung (Stufen 5, 6).
   Zu prüfen: Muss jedes Komma stehen (kein Kann-Komma), fehlt keines, und steht vor „und“ und „oder“ keines? */
"use strict";
{
  const BINDEWOERTER = ["weil", "wenn", "dass", "als", "ob", "bis", "während", "nachdem", "sobald", "wie", "wo", "wer", "den"];
  const kommaZahl = satz => zerlege(satz).kommas.length;
  /** Stufen, in denen der Satz gezogen werden kann — mit den Filtern des Spiels. */
  const stufenVon = (liste, satz) => {
    const n = kommaZahl(satz);
    const nr = Object.entries(STUFE)
      .filter(([, p]) => (liste === "ohne" ? !!p.ohne : !!p.quellen[liste]?.(n))).map(([s]) => s.slice(1));
    return nr.join(", ") || "—";
  };
  const kommasText = n => (n === 1 ? "1 Komma" : `${n} Kommas`);
  const zeile = liste => satz => [satz, kommaZahl(satz), stufenVon(liste, satz)];
  const SPALTEN = ["Satz (richtig geschrieben)", "Kommas", "Stufen"];
  /** Verbindung zweier Verbgruppen: das Bindewort am Satzanfang oder nach dem Komma, sonst zwei Hauptsätze. */
  const verbindung = satz => {
    const { woerter, kommas } = zerlege(satz);
    const klein = i => (woerter[i] || "").toLowerCase().replace(/[.?!]$/, "");
    const w = [0, ...kommas.map(i => i + 1)].map(klein).find(x => BINDEWOERTER.includes(x));
    return w ? `Nebensatz mit „${w}“` : "zwei Hauptsätze ohne Bindewort";
  };
  /** „Stufe 3: 30 %; Stufe 4: 25 % …“ — aus STUFE des Spiels. */
  const anteilOhne = () => Object.entries(STUFE).filter(([, p]) => p.ohne)
    .map(([s, p]) => `Stufe ${s.slice(1)}: ${Math.round(p.ohne * 100)} %`).join("; ");
  const was = "Das Kind sieht den Satz ohne Kommas, tippt zwischen die Wörter, wo ein Komma hingehört, und prüft.";
  LS.listenPruefung("komma-jagd", {
    aufzaehlung: {
      beschreibung: `Sätze mit Aufzählungen (Stufe 1: ein Komma; Stufe 2: zwei und mehr; Stufe 3: alle, gemischt mit Sätzen ohne Komma; Stufe 5: alle, gemischt mit Verbgruppen; Stufe 6: ab drei Kommas). ${was}`,
      abschnitte: [{
        id: "aufzaehlung", titel: "Aufzählungen", spalten: SPALTEN,
        hinweis: "Je Zahl der Kommas eine Gruppe. Komma zwischen den Teilen der Aufzählung, vor „und“ und „oder“ keines; sonst kein Komma im Satz.",
        eintraege: () => KOMMA_SAETZE.aufzaehlung, zeile: zeile("aufzaehlung"), gruppe: satz => kommasText(kommaZahl(satz)),
      }],
    },
    verbgruppen: {
      beschreibung: `Sätze mit zwei oder mehr Verbgruppen (Stufe 4: ein Komma, mit Regelkarte; Stufe 5: alle, gemischt mit Aufzählungen; Stufe 6: ab zwei Kommas). ${was}`,
      abschnitte: [
        { id: "verbgruppen-eins", titel: "Zwei Verbgruppen, ein Komma", spalten: SPALTEN,
          hinweis: "Je Verbindung eine Gruppe. Jede Verbgruppe hat ihr eigenes Verb; das Komma steht genau zwischen den beiden.",
          eintraege: () => KOMMA_SAETZE.verbgruppen.filter(s => kommaZahl(s) === 1), zeile: zeile("verbgruppen"), gruppe: verbindung },
        { id: "verbgruppen-mehr", titel: "Mehrere Kommas: Verbgruppen, auch mit Aufzählung", spalten: SPALTEN,
          hinweis: "Hier steht jedes Komma — zwischen Verbgruppen und zwischen den Teilen einer Aufzählung (vor „und“ und „oder“ keines).",
          eintraege: () => KOMMA_SAETZE.verbgruppen.filter(s => kommaZahl(s) >= 2), zeile: zeile("verbgruppen") },
      ],
    },
    ohne: {
      beschreibung: `Sätze ganz ohne Komma, als Zusatz (Anteil der Aufgaben: ${anteilOhne()}), damit das Kind nicht überall Kommas setzt. ${was} Richtig ist hier: kein Komma.`,
      abschnitte: [{
        id: "ohne", titel: "Sätze ohne Komma", spalten: SPALTEN,
        hinweis: "Je Verbindung eine Gruppe. Kein Komma darf stehen müssen — auch keine zwei Verbgruppen ohne „und“ oder „oder“.",
        eintraege: () => KOMMA_SAETZE.ohne, zeile: zeile("ohne"),
        gruppe: satz => (/ und /.test(satz) ? "mit „und“" : / oder /.test(satz) ? "mit „oder“" : "ohne „und“ und „oder“"),
      }],
    },
  });
}
