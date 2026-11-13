/* Prüfansicht des Pflanzen-Bestimmers (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „pflanzen“ (PFLANZEN_LISTE in woerter.js) mit drei Inhalten, je für sich abzuhaken: die Merkmale der
   Pflanzen mit Blättern (Laubbäume, Sträucher, Blumen; je Gruppe des Eintrags eine Gruppe), die der Nadelbäume (Nadeln
   statt Blattform, Rand und Stellung) und die Merksätze, die das Kind nach der Antwort liest, mit den Stufen je Pflanze
   — getrennt, damit die Zeichnungen gross genug für Blattrand und Stellung sind und die Merkmale bei 1024 px ohne
   seitliches Scrollen in den Dialog passen (PT1 a). Das Bild zeichnet das Spiel selbst nach den Merkmalen (pflanzeSvg):
   Blatt mit Rand und Blüte, wie im Bestimmungsschlüssel, dazu der Zweig mit der Blattstellung; bei Nadelbäumen der
   Nadelzweig. Die Spalte „Stufen“ liest die Stufentabelle des Spiels (STUFE_ARTEN, aus der es auch seine Aufgaben baut)
   mit seiner Auswahl je Art (NIMMT, ohne Freigabe). Die Blütenteile (Stufe 5 und 6) gehören zum Spiel, nicht zu dieser
   Liste. */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Kurzname der Art für die Spalte „Stufen“. */
  const ART_KURZ = { laubNadel: "Laub/Nadel", form: "Form", formBild: "Form", rand: "Rand", stellung: "Stellung",
    schluessel: "Schlüssel", merkmale: "Merkmale" };
  /** Die Art mit ihren Angaben in Worten, wie das Kind sie sieht. */
  const artText = (art, ...angaben) => ({
    laubNadel: () => "Laubbaum oder Nadelbaum? (Korb)",
    form: () => "Welche Blattform hat das Blatt? (4 Formen zur Wahl)",
    formBild: () => "Welches Blatt ist …? (3 Bilder)",
    rand: ([drei]) => (drei ? "Blattrand glatt, gesägt oder gekerbt?" : "Blattrand glatt oder gesägt?"),
    stellung: () => "gegenständig oder wechselständig?",
    schluessel: ([n]) => `Bestimmungsschlüssel mit ${n} Pflanzen (Ja/Nein-Fragen zum Bild)`,
    merkmale: () => "Welche Pflanze passt zu allen Merkmalen? (2–3 Merkmale, 4 Bilder)",
    teilName: () => "Blütenteile benennen", teilTippen: () => "Blütenteil antippen", funktion: () => "Aufgabe eines Blütenteils",
  })[art](angaben);
  /** „Stufe 1: … · Stufe 2: …“ aus STUFE_ARTEN, jede Art einer Stufe nur einmal. */
  const stufenUeberblick = Object.entries(STUFE_ARTEN)
    .map(([s, arten]) => `Stufe ${nummer(s)}: ${[...new Set(arten.map(a => artText(...a)))].join("; ")}`).join(" · ");
  /** „1: Laub/Nadel · 3: Rand, Stellung · …“ — je Stufe die Arten, die diese Pflanze nehmen. */
  function stufenVon(p) {
    const teile = [];
    for (const [s, arten] of Object.entries(STUFE_ARTEN)) {
      const kurz = new Set(arten.filter(([art, ...angaben]) => NIMMT[art](p, ...angaben)).map(([art]) => ART_KURZ[art]));
      if (kurz.size) teile.push(`${nummer(s)}: ${[...kurz].join(", ")}`);
    }
    return teile.join(" · ") || "—";
  }
  /** Arten, nach denen das Spiel den Merksatz zeigt (zeigeLaubNadel, zeigeSchluessel, zeigeMerkmale). */
  const MERKSATZ_ARTEN = ["laubNadel", "schluessel", "merkmale"];
  /** „1, 4, 6“: Stufen, in denen eine der Arten vorkommt (STUFE_ARTEN). */
  const stufenMit = arten => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([a]) => arten.includes(a))).map(nummer).join(", ");
  const leer = w => (w == null ? "—" : String(w));
  function blattText(p) {
    if (!p.blatt) return "—";
    if (p.lappen) return `${p.blatt} (${p.lappen === "hand" ? "Hand" : "Fieder"})`;
    return p.teile ? `${p.blatt} (${p.teile})` : p.blatt;
  }
  function blueteText(b) {
    if (!b) return "—";
    return `${b.farbe}, ${b.zahl ?? "—"}`;
  }
  /** Zeichnungen des Spiels: Blatt und Blüte (wie im Schlüssel), dazu der Zweig, wenn die Stellung bekannt ist. */
  function bilder(p) {
    const klein = svg => { svg.style.width = "150px"; svg.style.margin = "0"; return svg; };
    const svgs = p.blatt === "nadelförmig" ? [pflanzeSvg(p, "blatt")]
      : [pflanzeSvg(p, "voll"), p.stellung && p.blatt ? pflanzeSvg(p, "zweig") : null].filter(Boolean);
    return LS.el("span", { style: "display:flex;flex-direction:column;gap:4px" }, ...svgs.map(klein));
  }

  LS.listenPruefung("pflanzen-bestimmer", {
    pflanzen: {
      beschreibung: "Einheimische Pflanzen mit ihren Merkmalen (NMG.2.4): Das Kind ordnet Bäume als Laub- oder Nadelbaum, "
        + "benennt Blattform, Blattrand und Blattstellung und bestimmt Pflanzen mit einem Ja/Nein-Schlüssel nach dem Bild. "
        + `${stufenUeberblick}. Die Blütenteile gehören zum Spiel, nicht zu dieser Liste. `
        + "„—“ heisst: nicht eindeutig oder für die Zeichnung nicht sicher; das Merkmal wird zu dieser Pflanze nie gefragt. "
        + "Die Spalte „Stufen“ (bei den Merksätzen) zeigt je Pflanze, welche Aufgaben sie nehmen; im Schlüssel kommt sie "
        + "nur mit Pflanzen vor, von denen eine Frage sie trennt.",
      abschnitte: [{
        id: "blaetter", titel: "Laubbäume, Sträucher und Blumen",
        spalten: ["Name", "Blattform", "Rand", "Stellung", "Blüte"], bild: bilder,
        hinweis: "Je Gruppe des Eintrags eine Gruppe (in Stufe 1 ist sie bei Bäumen die Antwort). Blattform: gelappt "
          + "(Hand) wie beim Ahorn, gelappt (Fieder) links und rechts wie bei der Eiche, die Zahl in Klammern = gezeichnete "
          + "Blättchen. Blüte: Farbe, Zahl der Blütenblätter (viele = Körbchen oder Köpfchen aus vielen kleinen Blüten, "
          + "— = Zahl wird nicht gefragt, die Zeichnung zeigt einen Farbfleck). Stimmen Blattform, "
          + "Blattrand (glatt = ohne Zähne, gesägt = spitze Zähne, gekerbt = runde Zähne) und Stellung (gegenständig = zwei "
          + "auf gleicher Höhe) für die Art, und zwar eindeutig — sonst gehört null hinein? Stimmen Farbe und Zahl der "
          + "Blütenblätter? Zeigt die Zeichnung das Merkmal so, dass ein Kind es im Bild erkennt (der Schlüssel fragt nur "
          + "nach dem Bild)? Haben zwei Pflanzen in allen Spalten dieselben Werte, kann das Spiel sie nicht unterscheiden. "
          + "Ist der Name wie in Schweizer Lehrmitteln?",
        eintraege: () => PFLANZEN_LISTE.filter(p => p.gruppe !== "Nadelbaum"),
        gruppe: p => p.gruppe,
        zeile: p => [p.name, blattText(p), leer(p.rand), leer(p.stellung), blueteText(p.bluete)],
      }, {
        id: "nadeln", titel: "Nadelbäume",
        spalten: ["Name", "Nadeln"], bild: bilder,
        hinweis: "Stimmt, wie die Nadeln am Zweig wachsen (einzeln, zu zweit, zu fünft, im Büschel)? Die Zeichnung macht "
          + "Weisstanne und Eibe flach wie einen Kamm (Tanne mit weissem Streifen), die Fichte rundum. Der Schlüssel fragt "
          + "nur nach der Zahl der Nadeln je Stelle: Pflanzen mit „einzeln“ trennt er nicht voneinander. Ist die Lärche "
          + "als Nadelbaum richtig (sie wirft im Herbst die Nadeln ab; in Stufe 1 ist „Nadelbaum“ die Antwort)?",
        eintraege: () => PFLANZEN_LISTE.filter(p => p.gruppe === "Nadelbaum"),
        zeile: p => [p.name, leer(p.nadeln)],
      }, {
        id: "merksaetze", titel: `Merksätze (Stufen ${stufenMit(MERKSATZ_ARTEN)})`, spalten: ["Name", "Merksatz", "Stufen"],
        hinweis: "Je Gruppe des Eintrags eine Gruppe. Das Kind liest den Satz nach der Antwort (Laub- oder Nadelbaum, "
          + "Schlüssel, Merkmale). Stimmt er sachlich, passt er nur zu dieser Pflanze, und versteht ihn ein Kind der "
          + "5. Klasse? Sagt er nichts, was der Zeichnung widerspricht? „Stufen“: wo die Pflanze vorkommt (Laub/Nadel, Form "
          + "= Blattform benennen oder im Bild finden, Rand, Stellung, Schlüssel, Merkmale) — wird ein Merkmal dort gefragt, "
          + "muss es in den Abschnitten oben besonders sicher stimmen.",
        eintraege: () => PFLANZEN_LISTE,
        gruppe: p => p.gruppe,
        zeile: p => [p.name, p.merke, stufenVon(p)],
      }],
    },
  });
}
