/* Prüfansicht des Lärm-Wächters (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „geraeusche“ mit neun Inhalten aus geraeusche.js, je Inhalt ein Abschnitt, jeder für sich abzuhaken:
   Geräusche (nach der Lärm-Skala gruppiert), Orte, Schutzmassnahmen (nach ihrer Wirkung), Situationen, „Schadet
   das?“, Teile des Ohrs (im Ohr-Bild des Spiels gezeigt: ohrBild), „Was schwingt?“, Echo / Trichter / Dämmung und
   Stoffe zum Dämpfen.
   Was das Spiel aus den Rohdaten rechnet, kommt aus index.html: der Korb in Stufe 1 und welche Geräusche dort kommen
   (KLAR_LAUT_LEISE, lautKorb, LAUT), die Lärm-Stufen beim Ordnen (ORDNEN_LAUT), die Rolle der Orte (STILL_ORT), die
   Paare bei „Was ist schlimmer?“ (SCHLIMMER_PAARE), die übrigen Körbe zu einer Situation (andereKoerbe), die
   Antworten wie das Kind sie sieht (ANTWORT, WIRKUNG, dauerText, mitArtikel), das Prinzip je Phänomen (PRINZIP) und
   die Stufen aus der Stufentabelle (STUFE).
   Zu prüfen: Ist die Reihung auf der Lärm-Skala (1–5, keine Dezibel) eindeutig, wo zwei Geräusche gegeneinander
   stehen? Helfen die Schutzmassnahmen wirklich so gut wie angegeben, und hilft kein Korb-Ablenker ebenso? Stimmen
   die Sätze zu Schaden, Schwingen, Echo, Trichter und Dämmung? */
"use strict";
{
  /** Aufgabenarten des Spiels (Schlüssel in STUFE) in Worten. */
  const ART = {
    lautleise: "Geräusch in den Korb „leise“ oder „laut“ legen",
    ordnen: "drei Geräusche von leise nach laut ordnen",
    still: "„Wo ist es still?“ (ein stiller Ort, zwei laute)",
    schutz: "zur Situation den passenden Schutz im Korb wählen (ein passender, zwei andere Körbe)",
    schadet: "„Schadet das den Ohren?“ Ja oder Nein",
    wirkung: "„Wie gut hilft das?“ gut, ein wenig oder nicht",
    schlimmer: "„Was ist schlimmer für die Ohren?“ von zwei Geräuschen",
    "ohr-tippen": "Teil im Ohr antippen",
    "ohr-benennen": "leuchtendes Teil benennen",
    "ohr-aufgabe": "Teil zu seiner Aufgabe wählen",
    schwingt: "„Stimmt das?“ zum Schwingen",
    phaenomen: "Erklärung zu Echo, Schalltrichter oder Dämmung wählen",
    daempfer: "„Was dämpft den Schall am besten?“ (ein weicher Stoff, zwei harte)",
  };
  const nummer = s => s.slice(1);
  const nr = stufen => (stufen.length ? `${stufen.length > 1 ? "Stufen" : "Stufe"} ${stufen.map(nummer).join(", ")}` : "keine Stufe");
  /** Stufen, deren Arten (STUFE des Spiels) eine dieser Arten enthalten. */
  const stufenMit = arten => Object.keys(STUFE).filter(s => STUFE[s].some(a => arten.includes(a)));
  /** „Stufe 1: … · Stufe 6: …“ für die Arten eines Abschnitts; mehrfach genannte Arten nur einmal. */
  const stufenText = arten => Object.entries(STUFE)
    .map(([s, liste]) => [s, [...new Set(liste.filter(a => arten.includes(a)))]])
    .filter(([, liste]) => liste.length).map(([s, liste]) => `Stufe ${nummer(s)}: ${liste.map(a => ART[a]).join("; ")}`).join(" · ");
  const alleArten = [...new Set(Object.values(STUFE).flat())];

  const massnahme = id => {
    const s = LAERM_SCHUTZ.find(x => x.id === id);
    return s ? `${s.bild} ${s.name}` : `?? ${id}`;
  };
  const liste = ids => (ids.length ? ids.map(massnahme).join(", ") : "—");
  const lautText = e => `Lärm ${e.laut} von 5`;
  /** Massnahmen, die nie helfen (wirkung 0): in jeder Situation ein möglicher Korb. */
  const ablenker = LAERM_SCHUTZ.filter(s => s.wirkung === 0).map(s => s.id);

  /** Gegenstück bei „Was ist schlimmer?“ je Art des Paars (SCHLIMMER_PAARE): [für a (schlimmer), für b (harmloser)]. */
  const GEGEN = {
    "lang-kurz": ["laut und kurz", "laut und lang"],
    "laut-leise": ["leise und lang", "laut und lang"],
    "kurz-leise": ["leise und lang", "sehr lauter Knall"],
  };
  /** „schlimmer als …; harmloser als …“: a, wenn paar.a passt; b nur, wenn es ein a dazu gibt. */
  const rollenVon = g => {
    const paare = Object.entries(SCHLIMMER_PAARE);
    const schlimmer = [...new Set(paare.filter(([, p]) => p.a(g)).map(([typ]) => GEGEN[typ][0]))];
    const harmloser = [...new Set(paare.filter(([, p]) => LAERM_GERAEUSCHE.some(a => p.a(a) && p.b(g, a))).map(([typ]) => GEGEN[typ][1]))];
    return [schlimmer.length ? `schlimmer als ${schlimmer.join(", ")}` : null,
      harmloser.length ? `harmloser als ${harmloser.join(", ")}` : null].filter(Boolean);
  };
  /** Stufen eines Geräuschs: Stufe 1 nur klare Fälle, Ordnen nur die Lärm-Stufen aus ORDNEN_LAUT, „schlimmer“ je Rolle. */
  const stufenVonGeraeusch = g => Object.keys(STUFE).filter(s => STUFE[s].some(art =>
    (art === "lautleise" && KLAR_LAUT_LEISE(g)) || (art === "ordnen" && ORDNEN_LAUT.includes(g.laut))
    || (art === "schlimmer" && rollenVon(g).length)));
  const korb = k => `${LAUT[k].bild} ${LAUT[k].text}`;

  const ortRolle = o => (STILL_ORT.still(o) ? "still — die Antwort" : STILL_ORT.laut(o) ? "laut — Ablenker" : "kommt nicht vor");
  const antwort = (art, w) => `${ANTWORT[art](w).bild} ${ANTWORT[art](w).text}`;
  const wirkungText = w => `${WIRKUNG[w].bild} ${WIRKUNG[w].text}`;
  const zaehle = (feld, id) => String(LAERM_SITUATIONEN.filter(s => s[feld].includes(id)).length);
  const PHAENOMEN_NAME = { echo: "Echo", verstaerkung: "Verstärkung (Schalltrichter)", daemmung: "Dämmung" };

  /** Das Ohr-Bild des Spiels (ohrBild), das Teil leuchtet wie bei „Wie heisst der Teil, der leuchtet?“. */
  const ohrMit = t => {
    const b = ohrBild();
    b.teile.get(t.id)?.classList.add("lw-markiert");
    b.svg.style.width = "200px";
    return b.svg;
  };

  const SCHLIMMER_STUFEN = nr(stufenMit(["schlimmer"]));

  LS.listenPruefung("laerm-waechter", {
    geraeusche: {
      beschreibung: "Geräusche mit Lärm-Skala (1 ganz leise bis 5 sehr laut, eine grobe Einschätzung, keine Dezibel), "
        + "Orte, Schutzmassnahmen und laute Situationen, Sätze zu Schaden und Schwingen, die Teile des Ohrs, Echo, "
        + `Schalltrichter und Dämmung. ${stufenText(alleArten)}.`,
      abschnitte: [{
        id: "geraeusch", titel: "Geräusche", spalten: ["Bild", "Name", "Dauer", "Du hörst es …",
          `schlimmer? (${SCHLIMMER_STUFEN})`, "Stufen"],
        hinweis: "Je Lärm-Stufe eine Gruppe, mit dem Korb in Stufe 1. Gehört jedes Geräusch eindeutig in seine Stufe? Stufe 1 nimmt nur Lärm 1–2 (leise) "
          + "gegen Lärm 4–5 (laut); beim Ordnen stehen je ein Geräusch mit Lärm 1, 3 und 5 nebeneinander — ist dann "
          + "jedes mit Lärm 5 sicher lauter als jedes mit Lärm 3, und dieses lauter als jedes mit Lärm 1? Bei „Was ist "
          + "schlimmer?“ zählt erst die Dauer (laut und lang schlägt laut und kurz, auch bei gleicher Stufe), dann die "
          + "Lautstärke: Ist das für jedes mögliche Paar richtig, auch bei einem sehr nahen Knall? Stimmt die Dauer (kurz "
          + "oder lang) und der Ort, der im Tipp steht? Zeigt das Bild das Geräusch?",
        eintraege: () => LAERM_GERAEUSCHE,
        gruppe: g => `${lautText(g)} · ${KLAR_LAUT_LEISE(g) ? `Korb ${korb(lautKorb(g))}` : "nicht in Stufe 1"}`,
        zeile: g => [g.bild, g.name, dauerText(g.dauer), g.ort, rollenVon(g).join("; ") || "—", stufenVonGeraeusch(g).map(nummer).join(", ")],
      }, {
        id: "ort", titel: `Orte: „Wo ist es still?“ (${nr(stufenMit(["still"]))})`, spalten: ["Bild", "Ort", "Lärm", "Rolle"],
        hinweis: "Je Rolle eine Gruppe. Ein stiller Ort steht gegen zwei laute. Ist jeder stille Ort wirklich still, und ist "
          + "keiner der lauten Orte ebenso still (etwa zu einer anderen Tageszeit)? Zeigt das Bild den Ort?",
        eintraege: () => LAERM_ORTE,
        gruppe: ortRolle,
        zeile: o => [o.bild, o.name, lautText(o), ortRolle(o)],
      }, {
        id: "schutz", titel: `Schutzmassnahmen (${nr(stufenMit(["schutz", "wirkung"]))})`,
        spalten: ["Bild", "Massnahme", "Tipp: Umschreibung", "Hinweis nach falschem Korb", "Situationen: gut / ein wenig"],
        hinweis: "Je Wirkung eine Gruppe (gilt, wenn die Massnahme zur Situation passt); die letzte Spalte zählt die "
          + "Situationen, in denen sie gut oder ein wenig hilft. „Hilft nicht“ sind die Ablenker: In „Wie gut hilft das?“ fragt das Spiel sie zu "
          + "jeder Situation (Antwort „hilft nicht“). Stimmt die Wirkung? Verrät die Umschreibung den Namen nicht, und "
          + "stimmt der Hinweis? Zeigt das Bild die Massnahme — und ist es nicht mit einem Bild aus den Situationen zu "
          + "verwechseln?",
        eintraege: () => LAERM_SCHUTZ,
        gruppe: s => wirkungText(s.wirkung),
        zeile: s => [s.bild, s.name, s.umschreibung || "—", s.hinweis, `${zaehle("schutz", s.id)} / ${zaehle("wenig", s.id)}`],
      }, {
        id: "situation", titel: `Situationen (${nr(stufenMit(["schutz", "wirkung"]))})`,
        spalten: ["Bild", "Situation", "hilft hier", "andere Körbe", "Tipp 3"],
        hinweis: `Je Lärm und Dauer eine Gruppe. „Hilft hier“: ${WIRKUNG[2].bild} hilft gut, ${WIRKUNG[1].bild} hilft ein `
          + "wenig. „Andere Körbe“: was in Stufe 3 neben dem guten Schutz stehen kann, ohne die Ablenker. In Stufe 3 steht einer der guten Schutze im Korb, dazu zwei aus „andere "
          + "Körbe“ oder den Ablenkern, die nie helfen (Abschnitt Schutzmassnahmen): Hilft wirklich keiner der anderen "
          + "Körbe ebenso (sonst wäre die Antwort strittig)? In Stufe 4 fragt das Spiel „hilft gut“, „hilft ein wenig“ "
          + "und einen Ablenker: Stimmt jede Einstufung? Ist die Situation laut und anhaltend, und verrät der Tipp die "
          + "Lösung nicht?",
        eintraege: () => LAERM_SITUATIONEN,
        gruppe: s => `${lautText(s)} · ${dauerText(s.dauer)}`,
        zeile: s => [s.bild, s.text, `${WIRKUNG[2].bild} ${liste(s.schutz)} · ${WIRKUNG[1].bild} ${liste(s.wenig)}`,
          liste(andereKoerbe(s, LAERM_SCHUTZ).filter(id => !ablenker.includes(id))), s.tipp],
      }, {
        id: "schadet", titel: `„Schadet das den Ohren?“ (${nr(stufenMit(["schadet"]))})`, spalten: ["Satz", "Antwort", "Tipp 3"],
        hinweis: "Je Antwort eine Gruppe. Stimmt die Antwort (sehr laut, oder laut und lange, schadet; Leises nie)? Verrät "
          + "der Tipp die Antwort nicht ganz?",
        eintraege: () => LAERM_SCHADET,
        gruppe: e => antwort("schadet", e[1]),
        zeile: ([satz, ja, tipp]) => [satz, antwort("schadet", ja), tipp],
      }, {
        id: "ohr", titel: `Teile des Ohrs (${nr(stufenMit(["ohr-tippen", "ohr-benennen", "ohr-aufgabe"]))})`,
        spalten: ["Teil", "Lage (Tipp)", "Aufgabe", "Aussehen (Tipp)"], bild: ohrMit,
        hinweis: "Das Bild zeigt das Ohr des Spiels, das Teil leuchtet. Liegt es im Bild richtig (Ohrmuschel aussen, "
          + "Gehörgang als Tunnel, Trommelfell am Ende)? Stimmen Artikel, Lage, Aufgabe und Aussehen, und nennen Lage und "
          + "Aussehen den Namen nicht? Passt jede Aufgabe nur zu ihrem Teil (bei „Welcher Teil macht das?“ sind die "
          + "beiden anderen die Ablenker)?",
        eintraege: () => LAERM_OHR_TEILE,
        zeile: t => [mitArtikel(t), t.lage, `… ${t.aufgabe}.`, t.aussehen],
      }, {
        id: "schwingt", titel: `„Was schwingt?“ (${nr(stufenMit(["schwingt"]))})`, spalten: ["Satz", "Antwort", "Tipp 2"],
        hinweis: "Je Antwort eine Gruppe. Stimmt die Antwort, und passt der Tipp (ein Versuch, der das Schwingen zeigt)?",
        eintraege: () => LAERM_SCHWINGT,
        gruppe: e => antwort("schwingt", e[1]),
        zeile: ([satz, ja, tipp]) => [satz, antwort("schwingt", ja), tipp],
      }, {
        id: "phaenomen", titel: `Echo, Schalltrichter, Dämmung (${nr(stufenMit(["phaenomen"]))})`,
        spalten: ["Bild", "Frage", "richtige Erklärung", "falsche Erklärungen", "Tipp 2"],
        hinweis: "Je Phänomen eine Gruppe mit dem Merksatz des Spiels (dritter Tipp). Stimmt die richtige Erklärung "
          + "fachlich? Sind die beiden falschen sicher falsch, und nicht nur ungenau? Passt das Bild zur Frage?",
        eintraege: () => LAERM_PHAENOMENE,
        gruppe: p => `${PHAENOMEN_NAME[p.art] || p.art}: ${PRINZIP[p.art]}`,
        zeile: p => [p.bild, p.frage, p.richtig, p.falsch.join(" / "), p.tipp],
      }, {
        id: "daempfer", titel: `„Was dämpft den Schall am besten?“ (${nr(stufenMit(["daempfer"]))})`,
        spalten: ["Bild", "Stoff", "Rolle"],
        hinweis: "Je Rolle eine Gruppe. Ein weicher Stoff steht gegen zwei harte. Dämpft jeder weiche den Schall deutlich "
          + "besser als jeder harte? Zeigt das Bild den Stoff (und nicht etwas anderes)?",
        eintraege: () => LAERM_DAEMPFER,
        gruppe: d => (d.daempft ? "weich — schluckt den Schall (die Antwort)" : "hart — wirft den Schall zurück (Ablenker)"),
        zeile: d => [d.bild, d.name, d.daempft ? "dämpft" : "dämpft nicht"],
      }],
    },
  });
}
