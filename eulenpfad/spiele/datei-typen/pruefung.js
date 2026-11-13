/* Prüfansicht der Datei-Typen (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „endungen“ aus woerter.js mit vier Inhalten, je für sich abzuhaken: die Endungen (DATEI_ENDUNGEN) mit Art,
   Programm und Beispielnamen, die Programme (DATEI_PROGRAMME) mit den Endungen, bei denen sie richtig oder als falsche
   Antwort vorkommen, die Dinge der Stufe 1 (DATEI_DINGE) und die neutralen Namen (DATEI_NEUTRAL). Was das Spiel aus den
   Rohdaten rechnet, zeigt die Ansicht mit seinen Funktionen und Konstanten: Korb und Bild mit ARTEN, Programme mit
   programmText, Dateinamen mit datei, die falschen Programme mit FALSCHE_PROGRAMME (aus ihnen wählt das Spiel drei),
   die Stufen aus der Stufentabelle (STUFE) mit seiner Auswahl je Aufgabenart (vorratFuer). Die Grössen der Stufen 5
   und 6 (GROESSEN) stehen im Spiel, nicht in der Liste. Gruppen nach der Art der Datei. */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Aufgabenarten des Spiels (STUFE, Feld arten), die aus der Liste wählen, in Worten. */
  const ART = {
    ding: "Ding → Art der Datei (Text, Bild oder Ton)", korb: "Datei in den Korb legen",
    falle: "Datei in den Korb legen, der Name täuscht", welche: "gleicher Name, vier Endungen: die Datei einer Art finden",
    programm: "das Programm wählen, das die Datei öffnet",
  };
  const ART_KURZ = { ding: "Art", korb: "Korb", falle: "Falle", welche: "welche?", programm: "Programm" };
  /** Je Stufe und Art, die aus der Liste wählt, der Vorrat des Spiels (vorratFuer). */
  const AUSWAHL = Object.entries(STUFE).flatMap(([stufe, p]) =>
    [...new Set(p.arten)].filter(art => ART[art]).map(art => ({ stufe, art, vorrat: vorratFuer(art, p) })));
  /** „2: Korb · 4: Programm“ — je Stufe die Arten, deren Vorrat den Eintrag enthält. */
  function stufenText(treffer) {
    const jeStufe = new Map();
    for (const a of AUSWAHL) if (treffer(a)) jeStufe.set(a.stufe, [...(jeStufe.get(a.stufe) || []), ART_KURZ[a.art]]);
    return [...jeStufe].map(([stufe, arten]) => `${nummer(stufe)}: ${arten.join(", ")}`).join(" · ") || "—";
  }
  const STUFEN_TEXT = Object.entries(STUFE).map(([s, p]) => `Stufe ${nummer(s)}: `
    + [...new Set(p.arten)].map(a => ART[a] || "Grösse der Datei (Angaben im Spiel)").filter((t, i, l) => l.indexOf(t) === i).join("; "))
    .join(" · ");

  /** Endungen ohne Korb heissen im Spiel nur über ihr Programm. */
  const OHNE_KORB = { praesentation: "Präsentation", tabelle: "Tabelle", archiv: "Archiv", webseite: "Webseite" };
  const artName = art => (ARTEN[art] ? `${ARTEN[art].bild} ${ARTEN[art].name}` : `ohne Korb: ${OHNE_KORB[art] || art}`);
  const endungenText = liste => liste.map(e => `.${e.endung}`).join(" ") || "—";

  LS.listenPruefung("datei-typen", {
    endungen: {
      beschreibung: "Dateiendungen mit ihrer Art (Text, Bild, Ton, Video oder ohne Korb), dem Programm, das sie öffnet, und "
        + "Beispielnamen; dazu die Programme, die Dinge der Stufe 1 und neutrale Namen. Das Kind legt Dateien in die Körbe "
        + `Text, Bild, Ton und Video, findet die Datei einer Art und das passende Programm. ${STUFEN_TEXT}.`,
      abschnitte: [
        { id: "endung", titel: "Endungen", spalten: ["Endung", "nach der Antwort", "Programm", "falsche Programme", "Beispielnamen", "Stufen"],
          hinweis: "Je Art eine Gruppe. Gehört die Endung eindeutig zu dieser Art und zu keiner anderen (in den Körben Text, "
            + "Bild, Ton, Video)? Ist sie gängig? Stimmt der Satz nach der Antwort? Öffnet das Programm sie wirklich, und kann "
            + "keines der falschen Programme sie öffnen (aus ihnen wählt das Spiel drei)? Passen die Beispielnamen zur Art — "
            + "in Stufe 6 tragen Dateien anderer Körbe diese Namen als Falle, der Name darf also nur zu dieser Art passen?",
          eintraege: () => DATEI_ENDUNGEN, gruppe: e => artName(e.art),
          zeile: e => [`.${e.endung}`, e.wozu, programmText(e.programm), FALSCHE_PROGRAMME[e.art].map(programmText).join(", "),
            e.namen.map(n => datei(n, e.endung)).join(", "),
            stufenText(a => a.vorrat.includes(e)) + (e.nieNeben ? ` · nie neben ${e.nieNeben.map(k => ARTEN[k].name).join(", ")}` : "")] },
        { id: "programm", titel: "Programme", spalten: ["Bild", "Programm", "klein darunter", "richtig für", "falsche Antwort bei"],
          hinweis: "Stimmen Name, Bild und Beispiel (Schweizer Schulen, gängige Programme)? „Falsche Antwort bei“: Kann das "
            + "Programm eine dieser Dateien doch öffnen, wäre die Aufgabe nicht eindeutig.",
          eintraege: () => Object.entries(DATEI_PROGRAMME),
          zeile: ([id, pr]) => [pr.bild, pr.name, pr.beispiel, endungenText(DATEI_ENDUNGEN.filter(e => e.programm === id)),
            endungenText(DATEI_ENDUNGEN.filter(e => FALSCHE_PROGRAMME[e.art].includes(id)))] },
        { id: "ding", titel: "Dinge (Art der Datei)", spalten: ["Bild", "Ding", "Art", "Stufen"],
          hinweis: "Je Art eine Gruppe. Das Kind wählt zwischen Text, Bild und Ton. Ist die Art eindeutig (liest man es, schaut "
            + "man es an, hört man es)? Zeigt das Bild das Ding eindeutig?",
          eintraege: () => DATEI_DINGE, gruppe: d => artName(d.art),
          zeile: d => [d.bild, d.name, ARTEN[d.art].name, stufenText(a => a.vorrat.includes(d))] },
        { id: "neutral", titel: "Neutrale Namen", spalten: ["Name", "Stufen"],
          hinweis: "Derselbe Name mit vier Endungen (welche Datei ist ein Bild?): Er darf zu keiner Art passen, damit nur die "
            + "Endung entscheidet.",
          eintraege: () => DATEI_NEUTRAL,
          zeile: n => [n, stufenText(a => a.art === "welche")] },
      ],
    },
  });
}
