/* Prüfansicht der Wortarten-Probe (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „woerter“ (woerter.js). Ihre Sätze (PROBE_SAETZE) stehen in sechs Gruppen, die je etwas anderes üben
   (typische Wörter, veränderte Formen, Fallen, Doppelgänger, Pronomen und Partikeln, Doppelgänger mit Pronomen und
   Partikeln) — deshalb je Gruppe ein Abschnitt, mit den Stufen, die sie ziehen (aus STUFE des Spiels). Dazu die
   Pronomenliste (PROBE_PRONOMEN), die das Kind ab Stufe 5 sieht, als eigener Abschnitt.
   Je Satz: das abgefragte Wort in „…“, die Wortart (bei Partikeln auch welche), die Probe, die klappen muss, und was
   das Spiel dem Kind dazu zeigt — Wortart, Probe und Text mit den Namen und befund() des Spiels. Untergruppen nach
   Wortart; in den Doppelgänger-Gruppen nach dem Wort, damit die beiden Sätze eines Paars beisammen stehen.
   Zu prüfen: Ist das Wort in diesem Satz ohne Zweifel diese Wortart (Schweizer Schulgrammatik: Adjektiv beim Verb
   bleibt Adjektiv, Präposition und Konjunktion sind Partikeln), klappt die genannte Probe genau so, und ist die
   Falle als Falle markiert? */
"use strict";
{
  const TITEL = {
    1: "Typische Nomen, Verben, Adjektive", 2: "Veränderte Formen (Mehrzahl, Präteritum, Vergleichsform)",
    3: "Fallen (nominalisiert, Adjektiv vor dem Nomen, Infinitiv)", 4: "Ein Wort, zwei Wortarten",
    5: "Pronomen und Partikeln", 6: "Doppelgänger mit Pronomen und Partikeln",
  };
  const HINWEIS = {
    1: "Je Wortart eine Gruppe. Einfache Sätze: Das Wort muss eindeutig sein, und die Probe muss mit dem Wort genau so klappen, wie es im Satz steht.",
    2: "Je Wortart eine Gruppe. Das Wort steht verändert da (Mehrzahl, Präteritum, Vergleichsform); der Beleg führt auf die Grundform zurück. Stimmt die Grundform?",
    3: "Je Wortart eine Gruppe. Fallen sind mit „Falle“ markiert: Nominalisierte Verben und Adjektive sind Nomen (das Lachen, beim Essen, das Gute), ein Adjektiv vor dem Nomen bleibt Adjektiv, ein Infinitiv bleibt Verb. Ist jede Falle wirklich eine — und jeder Satz ohne Markierung keine?",
    4: "Je Wort eine Gruppe mit den Sätzen des Paars: dasselbe Wort einmal als Nomen, einmal als Verb oder Adjektiv. Ist die Wortart in jedem Satz eindeutig?",
    5: "Je Wortart eine Gruppe. Pronomen müssen in der Pronomenliste stehen; Partikeln sind unveränderlich (Präposition, Konjunktion, andere — in Stufe 6 fragt das Spiel auch, welche). Dazu einige Nomen, Verben, Adjektive, damit nicht jedes Wort ein Pronomen oder eine Partikel ist.",
    6: "Je Wort eine Gruppe mit seinen Doppelgängern (sein Velo — muss sein, laut, seit, während, trotz, dank, bis). Ist die Wortart in jedem Satz eindeutig, und stimmt bei Partikeln die Art (Präposition oder Konjunktion)?",
  };
  const DOPPEL = new Set([4, 6]);
  /** Satz als Aufgabe ohne Zufall, mit der Funktion des Spiels (dieselbe baut aufgabeErzeugen). */
  const aufgabe = e => satzAufgabe(e);
  const wortartText = a => (PARTIKELN[a.art] ? `${WORTARTEN.PART}: ${PARTIKELN[a.art]}` : WORTARTEN[a.wortart]);
  const satzText = e => { const a = aufgabe(e); return `${a.vor}„${a.wort}“${a.nach}`; };
  const stufenVon = gruppe => Object.keys(STUFE).filter(s => STUFE[s].gruppen.includes(gruppe)).map(s => s.slice(1));
  const stufenText = nr => (nr.length ? `${nr.length > 1 ? "Stufen" : "Stufe"} ${nr.join(", ")}` : "keine Stufe");
  const gruppen = [...new Set(PROBE_SAETZE.map(e => e[0]))].sort((x, y) => x - y);
  /** Untergruppe eines Doppelgängers: das Wort klein, oder das kürzeste Wort derselben Gruppe, mit dem es beginnt
      (Kranker → krank, Fremde → fremd), damit beide Sätze des Paars beisammen stehen. */
  const paarWort = (g, e) => {
    const wort = aufgabe(e).wort.toLowerCase();
    const andere = PROBE_SAETZE.filter(x => x[0] === g).map(x => aufgabe(x).wort.toLowerCase()).filter(w => wort.startsWith(w));
    return andere.sort((x, y) => x.length - y.length)[0];
  };

  const abschnitt = g => ({
    id: `gruppe-${g}`, titel: `${TITEL[g] || `Gruppe ${g}`} (${stufenText(stufenVon(g))})`, hinweis: HINWEIS[g],
    spalten: ["Satz", "Wortart", "Probe", "Was das Spiel zeigt", "Falle"],
    eintraege: () => PROBE_SAETZE.filter(e => e[0] === g),
    gruppe: e => (DOPPEL.has(g) ? paarWort(g, e) : wortartText(aufgabe(e))),
    zeile: e => {
      const a = aufgabe(e);
      return [satzText(e), wortartText(a), PROBEN[a.probe].kurz, befund(a.probe, a).replace(/^✓ /, ""), a.falle ? "Falle" : "—"];
    },
  });

  // Proben je Stufe, aus STUFE des Spiels: „Stufen 1–4: …; Stufen 5, 6: …“
  const probenText = () => {
    const je = new Map();
    for (const [s, p] of Object.entries(STUFE)) {
      const k = p.proben.map(x => PROBEN[x].kurz).join(", ");
      je.set(k, [...(je.get(k) || []), s.slice(1)]);
    }
    return [...je].map(([k, nr]) => `${stufenText(nr)}: ${k}`).join("; ");
  };
  const partikelStufen = Object.keys(STUFE).filter(s => STUFE[s].partikelArt).map(s => s.slice(1));
  const listeStufen = Object.keys(STUFE).filter(s => STUFE[s].liste).map(s => s.slice(1));
  /** Sätze, in denen das Wort der Pronomenliste abgefragt wird, mit seiner Wortart dort. */
  const abgefragt = pronomen => PROBE_SAETZE.filter(e => aufgabe(e).wort.toLowerCase() === pronomen)
    .map(e => `${satzText(e)} (${wortartText(aufgabe(e))})`).join("; ") || "—";

  LS.listenPruefung("wortarten-probe", {
    woerter: {
      beschreibung: `Sätze mit einem farbigen Wort, in sechs Gruppen (${gruppen.map(g => `Gruppe ${g}: ${stufenText(stufenVon(g))}`).join("; ")}). Das Kind wählt zuerst die Probe, die bei diesem Wort in diesem Satz klappt (${probenText()}), dann die Wortart, die sie zeigt; in ${stufenText(partikelStufen)} bei einer Partikel auch, welche. Ab ${stufenText(listeStufen)} steht die Pronomenliste unter dem Satz.`,
      abschnitte: [
        ...gruppen.map(abschnitt),
        {
          id: "pronomenliste", titel: `Pronomenliste (${stufenText(listeStufen)})`,
          hinweis: "Die Liste, in der das Kind nachschlägt. Ist jedes Wort ein Pronomen, und fehlt keins, das in einem Satz als Pronomen abgefragt wird? Steht ein Wort der Liste in einem Satz als andere Wortart, muss es dort eine Falle sein.",
          spalten: ["Pronomen", "abgefragt in"],
          eintraege: () => PROBE_PRONOMEN,
          zeile: p => [p, abgefragt(p)],
        },
      ],
    },
  });
}
