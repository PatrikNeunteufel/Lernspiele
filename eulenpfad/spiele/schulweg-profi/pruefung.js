/* Prüfansicht des Schulweg-Profis (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Vier Listen aus situationen.js, je Inhalt ein Abschnitt: Situationen mit ihrem Korb (sicher-gefaehrlich), der
   Merksatz und die Fragen zum Queren (queren), die Signale (signale) und die Velofragen (velo). Bilder zeichnet das
   Spiel selbst: Lichtsignal (ampelEl über bildEl) und Verkehrssignale (signalEl).
   Was das Spiel aus den Rohdaten rechnet, kommt aus index.html: der Korb (korbVon), die Stufen je Frage aus der
   Stufentabelle (STUFE_ARTEN) mit der Auswahl der Art „frage“ (frageNimmt), die Ablenker je Signal (signalAblenker:
   nie ein Signal, dessen Bedeutung auch passen würde) und der Name des Signals im Lösungstext (SIGNAL_NAME).
   Zu prüfen: Stimmen die Regeln für Kinder in der Schweiz (Fussgängerstreifen gelb, warte–luege–lose–laufe, Rad
   steht – Kind geht, Trottoir, Bus, Velo nach VTS), ist sicher/gefährlich eindeutig, ist kein Ablenker auch richtig,
   zeigt das Bild eindeutig das Gemeinte? */
"use strict";
{
  const ART = {
    korb: () => "Situationen in die Körbe sicher / gefährlich legen",
    frage: (liste, n, nurAb) => `Fragen ${liste ? `zum ${liste === "velo" ? "Velo" : "Queren"}` : "aus Queren und Velo"} ${nurAb ? `genau ab Stufe ${n}` : `bis Stufe ${n}`}`,
    merksatz: () => "Merksatz warte, luege, lose, laufe ordnen",
    signal: vor => (vor ? "Signal → Bedeutung" : "Bedeutung → Signal"),
  };
  const nummer = s => s.slice(1);
  const nr = stufen => (stufen.length ? `${stufen.length > 1 ? "Stufen" : "Stufe"} ${stufen.map(nummer).join(", ")}` : "keine Stufe");
  /** Stufen, in denen eine Art der Stufentabelle des Spiels (STUFE_ARTEN) zutrifft. */
  const stufenMit = bedingung => Object.keys(STUFE_ARTEN).filter(s => STUFE_ARTEN[s].some(([art, ...angaben]) => bedingung(art, angaben)));
  const stufenDerArt = name => stufenMit(art => art === name);
  /** Stufen, in denen die Art „frage“ diese Frage nehmen kann (frageNimmt des Spiels, ohne Freigabe). */
  const stufenDerFrage = f => stufenMit((art, angaben) => art === "frage" && frageNimmt(f, ...angaben));
  /** „Stufe 2: Fragen zum Queren bis Stufe 2; …“ für die Arten, die eine Bedingung erfüllen. */
  const stufenText = bedingung => Object.entries(STUFE_ARTEN)
    .map(([s, arten]) => [s, [...new Set(arten.filter(([art, ...angaben]) => bedingung(art, angaben)).map(([art, ...angaben]) => ART[art](...angaben)))]])
    .filter(([, texte]) => texte.length).map(([s, texte]) => `Stufe ${nummer(s)}: ${texte.join("; ")}`).join(" · ");

  const fragen = liste => ({
    id: "fragen", titel: `Fragen (${liste === "velo" ? "Velo" : "über die Strasse"})`,
    spalten: ["Frage", "richtig", "Ablenker", "Erklärung", "Stufen"],
    hinweis: "Je Gruppe die Stufe, ab der die Frage drankommt; „Stufen“: wo sie gestellt wird, „Erklärung“: steht nach der Antwort. Stimmt die Antwort nach den Regeln in der Schweiz? Ist kein "
      + "Ablenker auch richtig oder halb richtig? Stimmt die Erklärung, und zeigt das Bild (Emoji oder gezeichnetes "
      + "Lichtsignal) das Gemeinte, ohne die Antwort zu verraten?",
    eintraege: () => SW_FRAGEN.filter(f => f[1] === liste),
    bild: f => bildEl(f[2]),
    gruppe: f => `ab Stufe ${f[0]}`,
    zeile: f => {
      const [, , , frage, richtig, f1, f2, erklaerung] = f;
      return [frage, richtig, [f1, f2].filter(Boolean).join(" · "), erklaerung, stufenDerFrage(f).map(nummer).join(", ")];
    },
  });

  LS.listenPruefung("schulweg-profi", {
    "sicher-gefaehrlich": {
      beschreibung: `Situationen auf dem Schulweg mit Bild: Das Kind legt die Karte in den Korb „sicher“ oder „gefährlich“ (${nr(stufenDerArt("korb"))}; `
        + "Stufe 1 nur diese Aufgaben, Stufe 6 gemischt mit allem anderen). Die Eule liest die Situation mit vor.",
      abschnitte: [{
        id: "situation", titel: "Situationen", spalten: ["Bild", "Situation", "Korb"],
        hinweis: "Je Korb eine Gruppe. Ist die Situation eindeutig sicher oder eindeutig gefährlich — ohne „kommt darauf an“? "
          + "Passt das Bild, ohne den Korb zu verraten?",
        eintraege: () => SW_SICHER,
        gruppe: e => `${KORB[korbVon(e)].bild} ${KORB[korbVon(e)].text}`,
        zeile: e => [e[0], e[1], KORB[korbVon(e)].text],
      }],
    },
    queren: {
      beschreibung: "Über die Strasse gehen: Merksatz am Fussgängerstreifen in der richtigen Reihenfolge antippen und Fragen mit "
        + `drei (selten zwei) Antworten. ${stufenText((art, [liste]) => art === "merksatz" || (art === "frage" && liste !== "velo"))}.`,
      abschnitte: [{
        id: "merksatz", titel: `Merksatz (${nr(stufenDerArt("merksatz"))})`, spalten: ["Schritt", "Bild", "Mundart (auf der Karte)", "Hochdeutsch (klein darunter)"],
        hinweis: "Die Reihenfolge der Zeilen ist die Lösung. Stimmen Reihenfolge, Mundart und Übersetzung, passt das Bild zum Schritt?",
        eintraege: () => SW_MERKSATZ,
        zeile: e => [String(SW_MERKSATZ.indexOf(e) + 1), e[0], e[1], e[2]],
      }, fragen("queren")],
    },
    signale: {
      beschreibung: "Verkehrssignale, gezeichnet nach der Signalisationsverordnung: Das Kind wählt zum Signal die Bedeutung oder "
        + `zur Bedeutung das Signal, je aus drei. ${stufenText(art => art === "signal")}.`,
      abschnitte: [{
        id: "signal", titel: "Signale", spalten: ["Bedeutung", "nie Ablenker (Bedeutung)", "nie Ablenker (Signal)", "in der Lösung"],
        hinweis: "Zeigt das Bild das Schweizer Signal (Form, Farbe, Symbol)? Stimmt die Bedeutung, so wie ein Kind sie braucht? "
          + "Als Ablenker wählt das Spiel zwei der anderen zufällig, ausser den genannten: „nie Ablenker (Bedeutung)“ bei "
          + "„Was bedeutet dieses Signal?“ (Bedeutungen, die auch passen würden), „nie Ablenker (Signal)“ bei „Welches Signal "
          + "bedeutet …?“ (Signale, zu denen diese Bedeutung auch passt). Fehlt dort keines, das auch richtig wäre? "
          + "„in der Lösung“: so nennt der Lösungstext das Signal.",
        eintraege: () => SW_SIGNALE,
        bild: e => signalEl(e[0]),
        zeile: e => {
          const nie = vor => SW_SIGNALE.filter(s => s !== e && !signalAblenker(e, s, vor));
          return [e[1], nie(true).map(s => s[1]).join(" · ") || "—", nie(false).map(s => SIGNAL_NAME[s[0]]).join(" · ") || "—", SIGNAL_NAME[e[0]]];
        },
      }],
    },
    velo: {
      beschreibung: `Velo fahren: Fragen mit drei Antworten zu Licht, Bremsen, Glocke, Helm, Handzeichen und totem Winkel. ${stufenText((art, [liste]) => art === "frage" && liste !== "queren")}.`,
      abschnitte: [fragen("velo")],
    },
  });
}
