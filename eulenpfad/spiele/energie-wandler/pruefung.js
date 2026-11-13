/* Prüfansicht des Energie-Wandlers (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „geraete“ aus woerter.js mit vier Inhalten, je für sich abzuhaken: die Energieformen (ENERGIEFORMEN), die
   Geräte (ENERGIE_GERAETE) in drei Abschnitten — Umwandlung vorher → nachher, „Braucht es Strom?“ mit „Erneuerbar?“,
   Kraftwerke —, die Ketten (ENERGIE_KETTEN) und die Fragen (ENERGIE_FRAGEN). Was das Spiel aus den Rohdaten rechnet,
   zeigt die Ansicht mit seinen Funktionen: die Umwandlung mit paarText, die falschen Antworten je Gerät mit ABLENKER (aus
   diesen Formen wählt das Spiel zufällig), die Antworten Ja/Nein mit jaNein, die Kette mit ketteEl (Bild) und
   ketteText (Lösungstext). Die Spalte „Stufen“ liest die Stufentabelle des Spiels (STUFE) mit seiner Auswahl je Art
   (vorratFuer, ohne Freigabe). Zu prüfen: Stimmt die Energie vorher und nachher, ist keine der falschen Antworten
   ebenso richtig (was nebenbei mitspielt, steht unter „spielt auch mit“ und kommt nie als falsche Antwort), stimmen
   Strom, erneuerbar und die Sachangaben der Fragen. */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Aufgabenarten des Spiels (STUFE, Feld arten) in Worten, wie das Kind sie sieht. */
  const ART = {
    strom: "Braucht es Strom?", woher: "Welche Energie ist vorher da?", wohin: "Welche Energie kommt heraus?",
    paar: "Welche Umwandlung stimmt?", fehlt: "Welcher Wandler fehlt?", mitte: "Welche Energie geht dazwischen?",
    erneuerbar: "Ist die Energiequelle erneuerbar?", kraftwerk: "Kraftwerk: Welche Energie ist vorher da?",
    frage: "Frage zur Energie in der Schweiz", ordnen: "Kette ordnen", falsch: "Falschen Wandler finden",
  };
  /** Kurz für die Spalte „Stufen“. */
  const ART_KURZ = { strom: "Strom?", woher: "vorher?", wohin: "nachher?", paar: "Umwandlung?", fehlt: "fehlt", mitte: "dazwischen",
    erneuerbar: "erneuerbar?", kraftwerk: "Kraftwerk", frage: "Frage", ordnen: "ordnen", falsch: "falscher Wandler" };
  /** Je Stufe und Art die Auswahl des Spiels (vorratFuer: Geräte, Ketten der Stufe oder Fragen). */
  const AUSWAHL = Object.entries(STUFE).flatMap(([stufe, { arten }]) =>
    [...new Set(arten)].map(art => ({ stufe, art, vorrat: vorratFuer(art, stufe) })));
  const istKette = x => Array.isArray(x?.geraete);
  /** „2: vorher? · 4: fehlt, dazwischen“ — je Stufe ihre Arten, jede nur einmal. */
  function stufenText(treffer) {
    const jeStufe = new Map();
    for (const a of AUSWAHL) if (treffer(a)) jeStufe.set(a.stufe, new Set([...(jeStufe.get(a.stufe) || []), ART_KURZ[a.art]]));
    return [...jeStufe].map(([stufe, arten]) => `${nummer(stufe)}: ${[...arten].join(", ")}`).join(" · ") || "—";
  }
  /** „Braucht es Strom? (Stufe 1); …“ für alle Arten, deren Auswahl etwas aus 'treffer' nimmt. */
  function stufenUeberblick(treffer) {
    const jeArt = new Map();
    for (const a of AUSWAHL) if (treffer(a)) jeArt.set(a.art, new Set([...(jeArt.get(a.art) || []), nummer(a.stufe)]));
    return [...jeArt].map(([art, st]) => `${ART[art]} (Stufe ${[...st].join(", ")})`).join("; ");
  }
  const geraeteArten = a => a.vorrat.some(x => ENERGIE_GERAETE.includes(x));
  const kettenArten = a => a.vorrat.some(istKette);
  const fragenArten = a => a.vorrat === ENERGIE_FRAGEN;

  const geraet = g => `${g.bild} ${g.name}`;
  const formen = liste => (liste?.length ? liste.map(formText).join(", ") : "—");
  const umwandlung = g => paarText(`${g.von}>${g.zu.join("+")}`);
  const jaNeinText = (art, wert) => { const t = jaNein(art)(wert ? "ja" : "nein"); return `${t.bild} ${t.text}`; };
  /** Falsche Antworten bei „nachher?“ (ABLENKER.wohin) und was bei „vorher?“ dazukommt (ABLENKER.woher); ohne Kernenergie-Geräte. */
  function falscheText(g) {
    if (!vorratFuer("woher").includes(g)) return "—";
    const nachher = ABLENKER.wohin(g), nurVorher = ABLENKER.woher(g).filter(f => !nachher.includes(f));
    return formen(nachher) + (nurVorher.length ? `; bei „vorher?“ auch ${formen(nurVorher)}` : "");
  }
  const gruppeVorher = g => `vorher: ${formText(g.von)}`;
  /** Kette als Bild, wie das Spiel sie zeichnet, verkleinert für die Tabelle. */
  function ketteBild(k) {
    const b = ketteEl(k);
    b.style.cssText = "zoom: 0.55; width: 520px; margin: 0; justify-content: flex-start;";
    return b;
  }

  LS.listenPruefung("energie-wandler", {
    geraete: {
      beschreibung: "Geräte, Vorgänge und Kraftwerke mit der Energie vorher und nachher, dazu Ketten aus mehreren Wandlern "
        + "und Fragen zur Energie in der Schweiz (NMG.3.2). Das Kind sagt, ob ein Gerät Strom braucht, welche Energie vorher "
        + "da ist und welche herauskommt, ergänzt und ordnet Ketten, findet den falschen Wandler und entscheidet, ob eine "
        + `Energiequelle erneuerbar ist. Geräte: ${stufenUeberblick(geraeteArten)}. Ketten: ${stufenUeberblick(kettenArten)}. `
        + `Fragen: ${stufenUeberblick(fragenArten)}. Kernenergie kommt erst ab Stufe 5 vor. In Ketten-Aufgaben kann jedes `
        + "Gerät ohne Kernenergie als falscher Wandler erscheinen, wenn es nicht zur Energie davor und danach passt.",
      abschnitte: [
        { id: "form", titel: "Energieformen", spalten: ["Bild", "Name"],
          hinweis: "So heissen die Energieformen auf allen Knöpfen und in allen Ketten. Stimmt der Name (Lehrmittel), und zeigt "
            + "das Bild die Energieform eindeutig?",
          eintraege: () => Object.entries(ENERGIEFORMEN), zeile: ([, f]) => [f.bild, f.name] },
        { id: "geraet", titel: "Geräte: Energie vorher und nachher", spalten: ["Gerät", "Umwandlung · spielt auch mit",
          "falsche Antworten", "Erklärung"],
          hinweis: `${stufenUeberblick(a => a.vorrat === vorratFuer("woher"))}: alle Geräte ausser denen mit Kernenergie `
            + "(Stufen in Ketten: Abschnitt „Ketten“). Je Energie vorher eine Gruppe. Stimmt die Umwandlung (vorher → nachher, "
            + "so wie das Kind sie lernt)? Nach „spielt auch mit“ steht, was nebenbei entsteht oder mitwirkt — das kommt nie als "
            + "falsche Antwort. Die Spalte „falsche Antworten“ nennt die Energieformen, aus denen das Spiel bei „vorher?“ und "
            + "„nachher?“ die falschen Antworten zieht (bei zwei Formen nachher je zwei davon zusammen), dazu, was nur bei "
            + "„vorher?“ kommt: Ist keine davon ebenso richtig? Passt die Erklärung (sie erscheint nach jeder Antwort zum Gerät), "
            + "und zeigt das Bild das Gerät eindeutig?",
          eintraege: () => ENERGIE_GERAETE, gruppe: gruppeVorher,
          zeile: g => [geraet(g), umwandlung(g) + (g.auch?.length ? ` · spielt auch mit: ${formen(g.auch)}` : ""), falscheText(g), g.text] },
        { id: "strom", titel: "Braucht es Strom? Erneuerbar?", spalten: ["Gerät", "Strom aus Steckdose oder Batterie?", "Energiequelle erneuerbar?", "Stufen"],
          hinweis: "Nur Geräte, zu denen das Spiel eine dieser Fragen stellt (sonst „—“). „Braucht es Strom?“: aus der Steckdose "
            + "oder aus einer Batterie oder einem Akku. „Erneuerbar?“: Die Energiequelle wächst nach oder geht nicht aus. Ist die "
            + "Antwort für das Kind eindeutig? Nach der Antwort steht die Erklärung aus dem Abschnitt „Geräte“.",
          eintraege: () => ENERGIE_GERAETE.filter(g => vorratFuer("strom").includes(g) || vorratFuer("erneuerbar").includes(g)),
          gruppe: g => (vorratFuer("strom").includes(g) ? jaNeinText("strom", g.strom) : "nur „erneuerbar?“"),
          zeile: g => [geraet(g), vorratFuer("strom").includes(g) ? jaNeinText("strom", g.strom) : "—",
            vorratFuer("erneuerbar").includes(g) ? jaNeinText("erneuerbar", g.erneuerbar) : "—",
            stufenText(a => (a.art === "strom" || a.art === "erneuerbar") && a.vorrat.includes(g))] },
        { id: "kraftwerk", titel: "Kraftwerke: Welche Energie ist vorher da?", spalten: ["Kraftwerk", "Umwandlung", "falsche Antworten", "Stufen"],
          hinweis: "Die Spalte „falsche Antworten“ nennt die Energieformen, aus denen das Spiel zwei zufällig wählt (hier auch "
            + "Kernenergie). Treibt die Energie vorher das Kraftwerk eindeutig an, und ist keine der falschen ebenso richtig?",
          eintraege: () => ENERGIE_GERAETE.filter(g => vorratFuer("kraftwerk").includes(g)),
          zeile: g => [geraet(g), umwandlung(g), formen(ABLENKER.kraftwerk(g)), stufenText(a => a.art === "kraftwerk" && a.vorrat.includes(g))] },
        { id: "kette", titel: "Ketten aus Wandlern", spalten: ["Am Anfang", "Kette (Lösungstext)", "Stufen"],
          hinweis: "Je Zahl der Wandler eine Gruppe. Gibt jeder Wandler genau die Energie ab, die der nächste aufnimmt, und passt "
            + "der Anfang zur ersten Energie? Ist die Kette als Ganzes sachlich richtig und für die 5. Klasse verständlich?",
          eintraege: () => ENERGIE_KETTEN, bild: ketteBild, gruppe: k => `${k.geraete.length} Wandler`,
          zeile: k => [k.anfang, ketteText(k), stufenText(a => a.vorrat.includes(k))] },
        { id: "frage", titel: "Fragen zur Energie in der Schweiz", spalten: ["Frage", "richtig", "falsch", "falsch", "Erklärung"],
          hinweis: "Stimmt die richtige Antwort sachlich, sind die beiden anderen eindeutig falsch, und stimmt die Erklärung "
            + "(Zahlen, Schweizer Verhältnisse)?",
          eintraege: () => ENERGIE_FRAGEN, zeile: ([frage, richtig, f1, f2, erklaerung]) => [frage, richtig, f1, f2, erklaerung] },
      ],
    },
  });
}
