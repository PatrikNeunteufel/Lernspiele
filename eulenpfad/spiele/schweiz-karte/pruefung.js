/* Prüfansicht der Schweiz-Karten-Suche (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Die Lage aller Gebiete und Orte kommt aus karte.js (swisstopo, swissBOUNDARIES3D, erzeugt); zu prüfen sind die Namen
   aus orte.js und ihre Zuordnung zur Lage. Darum zeigt jede Zeile im Bild die stumme Karte des Spiels (karteZeichnen,
   punktZeichnen) mit dem Gebiet bzw. Ort markiert, und den Namen, den das Kind sieht (zieleAus mit allen Listen), neben
   dem Namen in den Daten. Die Spalte „Stufen“ liest die Stufentabelle des Spiels (STUFE, ziele mit allen Listen).
   Rohdaten je Liste: Wahlkreise aus karte.js (KARTE.wahlkreise, Namen dort), Kantone aus orte.js (KANTONE_NAMEN),
   Hauptorte und Städte aus karte.js (KARTE.orte, so gefiltert wie im Spiel); die deutschen Namen statt der
   Gemeindenamen (ORT_NAMEN) als eigener Abschnitt bei den Hauptorten bzw. Städten, damit ihr Fingerabdruck mitzählt. */
"use strict";
{
  /** Ziele aller Listen des Katalogs, ohne Freigabe — so, wie das Spiel sie mit freien Listen baut. */
  const ALLE = zieleAus(new Set(LS.spielListen("schweiz-karte").map(l => l.id)));
  /** Stufen, deren Ziele (mit allen Listen) das Ziel enthalten, das passt. */
  const stufenVon = passt => Object.keys(STUFE).filter(s => STUFE[s].ziele(ALLE).some(passt)).map(s => s.slice(1)).join(", ");
  /** Stufen (Nummern), in denen Ziele der Liste gesucht werden, nur mit der Art art (gebiet, punkt, erkennen). */
  const stufenDer = (liste, art) => Object.keys(STUFE)
    .filter(s => (!art || STUFE[s].art === art) && STUFE[s].ziele(ALLE).some(z => ALLE[liste].includes(z)))
    .map(s => s.slice(1)).join(", ");
  /** Stufen, in denen Orte der Liste nur als weitere Punkte auf der Karte stehen (STUFE.mit, nicht gesucht). */
  const stufenDaneben = liste => Object.keys(STUFE)
    .filter(s => STUFE[s].mit?.(ALLE).some(z => ALLE[liste].includes(z)) && !STUFE[s].ziele(ALLE).some(z => ALLE[liste].includes(z)))
    .map(s => s.slice(1)).join(", ");
  const kantonName = nr => KANTONE_NAMEN[nr]?.[1] || `Kanton ${nr}`;
  const einwohner = n => LS.zahlText(n);

  /** Karte des Spiels mit einem markierten Gebiet (Breite fest, damit kleine Kantone sichtbar bleiben). */
  const karteMit = (ansicht, gebiet, breite) => {
    const { svg } = karteZeichnen(ansicht, g => (g.d === gebiet?.d ? " markiert" : ""));
    svg.style.setProperty("width", breite);
    return svg;
  };
  /** Karte der Schweiz (Kantone blass wie in Stufe 4 und 5) mit dem Ort als markiertem Punkt; der Punkt doppelt so gross
      wie im Spiel, damit er im kleinen Bild zu sehen ist. */
  const karteMitOrt = o => {
    const { svg } = karteZeichnen("ganz", () => " blass");
    const { gruppe, kreis } = punktZeichnen(o, " markiert");
    kreis.setAttribute("r", 2 * Number(kreis.getAttribute("r")));
    svg.append(gruppe);
    svg.style.setProperty("width", "300px");
    return svg;
  };

  /** Ziel des Spiels zu einem Ort aus karte.js (Name und Lage gleich). */
  const ortZiel = (liste, o) => ALLE[liste].find(x => x.name === o.name && x.x === o.x && x.y === o.y);
  /** Abschnitt „Ort“ für Hauptorte bzw. Städte; mit Gruppen je Kanton, wenn jeKanton. */
  const orte = (liste, id, titel, wort, jeKanton, hinweis) => ({
    id, titel, hinweis, bild: karteMitOrt,
    spalten: [wort, "Gemeinde in den Daten", "Kanton", "Einwohner", "Stufen"],
    eintraege: () => KARTE.orte.filter(o => ortZiel(liste, o)),
    ...(jeKanton ? { gruppe: o => kantonName(o.kanton) } : {}),
    zeile: o => [ortZiel(liste, o).anzeige, o.name, kantonName(o.kanton), einwohner(o.einwohner),
      stufenVon(z => z.name === o.name && z.x === o.x && z.y === o.y)],
  });
  /** Abschnitt „Deutsche Namen“: Einträge aus ORT_NAMEN, deren Gemeinde in der Liste vorkommt. */
  const namen = liste => ({
    id: "name", titel: "Deutsche Namen statt der Gemeindenamen",
    spalten: ["Gemeinde in den Daten", "Name im Spiel"],
    hinweis: "Ist das der Name, den Kinder in der Deutschschweiz in der Schule lernen (Schulatlas, Lehrmittel)? Bei "
      + "allen anderen Orten gilt der Gemeindename ohne Kantonszusatz („Wil (SG)“ → „Wil“).",
    eintraege: () => Object.entries(ORT_NAMEN).filter(([gemeinde]) => ALLE[liste].some(o => o.name === gemeinde)),
    zeile: ([gemeinde, name]) => [gemeinde, name],
  });

  LS.listenPruefung("schweiz-karte", {
    "wahlkreise-sg": {
      beschreibung: `Die Wahlkreise des Kantons St. Gallen auf der stummen Karte (Ausschnitt St. Gallen) antippen — Stufe `
        + `${stufenDer("wahlkreise")}. `
        + "Das Kind liest den Namen und tippt das Gebiet an; tippt es daneben, nennt das Spiel das getippte Gebiet und die Richtung.",
      abschnitte: [{
        id: "wahlkreis", titel: "Wahlkreise", spalten: ["Wahlkreis", "Stufen"],
        hinweis: "Liegt der markierte Wahlkreis dort, wo sein Name hingehört (Rheintal am Rhein im Osten, Rorschach am "
          + "Bodensee, See-Gaster am oberen Zürichsee …)? Stimmt der Name genau so (Schreibweise wie beim Kanton "
          + "St. Gallen)? Fehlt keiner (der Kanton St. Gallen hat acht Wahlkreise)?",
        eintraege: () => KARTE.wahlkreise,
        bild: w => karteMit("sg", w, "220px"),
        zeile: w => [ALLE.wahlkreise.find(x => x.d === w.d).anzeige, stufenVon(z => z.d === w.d)],
      }],
    },
    kantone: {
      beschreibung: `Die 26 Kantone mit Kürzel auf der stummen Karte der Schweiz antippen (Stufen ${stufenDer("kantone", "gebiet")}; `
        + `in einer davon nur St. Gallen und seine Nachbarkantone: ${OSTSCHWEIZ.map(nr => KANTONE_NAMEN[nr][0]).join(", ")}). `
        + `In Stufe ${stufenDer("kantone", "erkennen")} ist ein Kanton rot markiert, und das Kind wählt aus vier `
        + "Kantonsnamen den richtigen. Das Spiel zeigt „Name (Kürzel)“.",
      abschnitte: [{
        id: "kanton", titel: "Kantone", spalten: ["Kürzel", "Kanton", "Name in den Daten", "Stufen"],
        hinweis: "Ist der markierte Kanton wirklich der genannte (die Zuordnung läuft über die Kantonsnummer des BFS; "
          + "die Spalte „Name in den Daten“ zeigt, welchen Kanton swisstopo dort hat)? Stimmen das amtliche Kürzel und der "
          + "deutsche Name genau (Basel-Landschaft, Appenzell Ausserrhoden und Innerrhoden, Freiburg, Neuenburg, Waadt, "
          + "Wallis, Tessin, Genf)? Steht in Stufe 2 genau St. Gallen mit seinen Nachbarkantonen?",
        eintraege: () => Object.entries(KANTONE_NAMEN),
        bild: ([nr]) => karteMit("ganz", KARTE.kantone.find(k => k.nr === Number(nr)), "300px"),
        zeile: ([nr, [kurz, name]]) => [kurz, name, KARTE.kantone.find(k => k.nr === Number(nr))?.name || "— (fehlt in karte.js)",
          stufenVon(z => z.nr === Number(nr))],
      }],
    },
    hauptorte: {
      beschreibung: `Die Hauptorte der Kantone als Punkte auf der Karte antippen (Stufe ${stufenDer("hauptorte", "punkt")}; `
        + `in Stufe ${stufenDaneben("hauptorte")} stehen sie als weitere Punkte neben den Städten). In Stufe `
        + `${stufenDer("hauptorte", "erkennen")} ist ein Hauptort rot markiert, und das Kind wählt aus vier Namen von `
        + "Hauptorten den richtigen.",
      abschnitte: [
        orte("hauptorte", "hauptort", "Hauptorte", "Hauptort", false, "Genau ein Hauptort je Kanton? Ist der Ort "
          + "wirklich der Hauptort (Sitz von Regierung und Parlament; bei Appenzell Ausserrhoden Herisau)? Liegt der "
          + "markierte Punkt dort, wo der Ort ist? (Der Punkt ist der Mittelpunkt der Gemeindefläche, nicht der Ortskern — "
          + "bei grossen Gemeinden liegt er etwas daneben.)"),
        namen("hauptorte"),
      ],
    },
    staedte: {
      beschreibung: `Grosse Städte ab ${einwohner(STADT_MIN)} Einwohnern, ohne die Hauptorte, als Punkte auf der Karte `
        + `antippen (Stufe ${stufenDer("staedte")}). Auf der Karte stehen dabei auch die Hauptorte als Punkte.`,
      abschnitte: [
        orte("staedte", "stadt", "Städte", "Stadt", true, "Je Kanton eine Gruppe. Ist der Ort eine Stadt, die Kinder kennen sollen, und "
          + "liegt der markierte Punkt dort, wo der Ort ist? Liegt er so nah an einem anderen Punkt (Hauptort oder Stadt), "
          + "dass man die beiden auf dem Tablet oder Handy nicht auseinanderhalten kann? (Der Punkt ist der Mittelpunkt "
          + "der Gemeindefläche, nicht der Ortskern.)"),
        namen("staedte"),
      ],
    },
  });
}
