/* Prüfansicht des Körper-Puzzles (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Sechs eigene Listen, je ein Abschnitt: Körperteile mit Artikel (KOERPERTEILE), Sinne (SINNE), drei Fragenlisten
   (aus KOERPER_FRAGEN, getrennt nach dem Feld Liste) und Wege durch den Körper (WEGE). Die Stufen liest die Ansicht aus
   der Stufentabelle des Spiels (STUFE_ARTEN), die Stufen einer Frage zusätzlich mit frageIn — dieselbe Regel, mit der
   das Spiel die Fragen einer Stufe wählt (eigene Stufe immer, die Stufe davor ab und zu). Zu prüfen vor allem: Stimmen
   die Sachangaben zum Körper (Organe, Lage, Aufgaben, Reihenfolge der Wege), ist genau eine Antwort richtig, passt das
   Bild eindeutig? */
"use strict";
{
  /** Nummern der Stufen, in denen eine der Arten vorkommt — aus STUFE_ARTEN des Spiels. */
  const stufenMit = arten => Object.entries(STUFE_ARTEN)
    .filter(([, liste]) => liste.some(([art]) => arten.includes(art))).map(([s]) => s.slice(1));
  const stufenText = nrn => (nrn.length === 1 ? `Stufe ${nrn[0]}` : `Stufen ${nrn.join(", ")}`);
  /** Stufen, in denen eine Frage gezogen werden kann, nach frageIn des Spiels; „ab und zu“ = als Frage der Stufe davor. */
  const frageStufen = f => Object.entries(STUFE_ARTEN).flatMap(([s, liste]) => {
    const wie = liste.filter(([art]) => art === "frage").map(([, n]) => frageIn(f, n)).find(Boolean);
    return wie ? [wie === "eigen" ? s.slice(1) : `${s.slice(1)} (ab und zu)`] : [];
  });
  const fragenVon = liste => KOERPER_FRAGEN.filter(f => f[5] === liste);
  const fragenStufen = liste => [...new Set(fragenVon(liste).flatMap(frageStufen))];
  const fragen = (liste, thema) => ({
    beschreibung: `Fragen zu ${thema} (${stufenText(fragenStufen(liste))}): Das Kind liest die Frage und wählt aus drei `
      + "Antworten die richtige."
      + (fragenStufen(liste).some(s => s.includes("ab und zu")) ? " „Ab und zu“ heisst: als Frage der Stufe davor." : ""),
    abschnitte: [{
      id: "frage", titel: "Fragen", spalten: ["Frage", "Richtig", "Falsch", "Falsch", "Stufen"],
      hinweis: "Stimmt die Sachangabe (Biologie des Körpers, so vereinfacht, dass sie für das Alter noch richtig ist)? "
        + "Ist die richtige Antwort eindeutig richtig und ist keine der falschen ebenso richtig oder teilweise richtig?",
      eintraege: () => fragenVon(liste),
      zeile: f => [f[1], f[2], f[3], f[4], frageStufen(f).join(", ")],
    }],
  });

  LS.listenPruefung("koerper-puzzle", {
    koerperteile: {
      beschreibung: `Körperteile mit Artikel: Das Kind sieht ein Bild und wählt den Namen (${stufenText(stufenMit(["teil"]))}) `
        + `oder liest den Namen und tippt auf das passende Bild (${stufenText(stufenMit(["finde"]))}); in Stufe 4 mit vier `
        + "statt drei Antworten. Die Ablenker sind andere Körperteile der Liste; die Lösung nennt den Artikel („Das ist der Zahn.“).",
      abschnitte: [{
        id: "teil", titel: "Körperteile", spalten: ["Bild", "Name", "Artikel"],
        hinweis: "Zeigt das Bild eindeutig diesen Körperteil und keinen anderen der Liste (Mund 👄 und Zunge 👅, Bein 🦵 "
          + "und Fuss 🦶, Hand ✋ und Arm 💪)? Stimmt der Artikel?",
        eintraege: () => KOERPERTEILE,
        zeile: ([bild, name, artikel]) => [bild, name, artikel],
      }],
    },
    sinne: {
      beschreibung: `Sinne und Sinnesorgane (${stufenText(stufenMit(["sinn"]))}): Das Kind liest die Frage („Womit hörst du?“) `
        + "und wählt unter allen Sinnesorganen der Liste (mit Bild) das richtige.",
      abschnitte: [{
        id: "sinn", titel: "Sinne", spalten: ["Frage", "Bild", "Sinnesorgan"],
        hinweis: "Passt das Sinnesorgan eindeutig zur Frage, und kein anderes Organ der Liste ebenso? Das Bild steht auf "
          + "dem Antwortknopf neben dem Namen: Zeigt es das Sinnesorgan?",
        eintraege: () => SINNE,
        zeile: ([frage, bild, organ]) => [frage, bild, organ],
      }],
    },
    "gelenke-schutz": fragen("gelenke-schutz", "Gelenken, Schutz und Milchzähnen"),
    organe: fragen("organe", "Herz, Lunge, Magen, Gehirn und Bewegung"),
    "kreislauf-haut": fragen("kreislauf-haut", "Blutkreislauf, Puls und Haut"),
    wege: {
      beschreibung: `Wege durch den Körper (${stufenText(stufenMit(["weg"]))}): Das Kind tippt die Stationen in der `
        + "richtigen Reihenfolge an (gemischt angeboten, ohne Ablenker).",
      abschnitte: [{
        id: "weg", titel: "Wege", spalten: ["Weg", "Stationen der Reihe nach"],
        hinweis: "Stimmt die Reihenfolge, fehlt keine Station, die das Kind kennen sollte, und ist jede Station "
          + "eindeutig vor oder nach der anderen?",
        eintraege: () => WEGE,
        zeile: ([name, stationen]) => [name, stationen.join(" → ")],
      }],
    },
  });
}
