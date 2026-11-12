/* Prüfansicht der Diagramm-Wahl (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „daten“ mit drei Arten von Datensätzen; je Art die Daten mit dem Diagramm, wie das Spiel es zeichnet
   (saeulenSvg, kreisSvg, linieSvg), dazu die Fragen und Sätze je Datensatz und die offenen Aussagen als eigene
   Abschnitte — sie werden je für sich geprüft. Alle Zahlen sind erfunden. */
"use strict";
{
  const breit = (svg, px) => { svg.style.width = `${px}px`; return svg; };
  const saeulenBild = d => breit(saeulenSvg({ kategorien: d.kategorien.map((k, i) => kategorie(d, i)), achse: d.achse, einheit: d.einheit, gruppe: d.gruppen?.[0] }), 200);
  const kreisBild = d => LS.el("span", {}, breit(kreisSvg({ teile: d.teile, nenner: d.nenner }), 140), legende(d.teile));
  const linienBild = d => breit(linieSvg({ x: d.x, werte: d.werte, achse: d.achse, einheit: d.einheit }), 200);
  const ART = { wert: "je Säule", meist: "am meisten", wenigst: "am wenigsten", mehr: "mehr als", doppelt: "doppelt so viel", gruppen: "zwei Gruppen",
    hoechst: "am höchsten", tiefst: "am tiefsten", anstieg: "Anstieg", gestiegen: "gestiegen", gesunken: "gesunken" };
  const satzZeilen = o => Object.entries(o || {}).map(([k, v]) => `${ART[k] || k}: ${v}`).join(" · ");
  const KREIS = { 2: "Hälften und Viertel (Stufe 2)", 4: "Hälften und Viertel (Stufe 2)", 8: "Achtel und Drittel (Stufe 3)", 3: "Achtel und Drittel (Stufe 3)", 10: "Prozent (Stufe 5)", 20: "Prozent (Stufe 5)" };
  const art = d => (DIAGRAMM_DATEN.saeulen.includes(d) ? "Säulendiagramm" : "Liniendiagramm");
  LS.listenPruefung("diagramm-wahl", {
    daten: {
      beschreibung: "Datensätze zu Säulen-, Kreis- und Liniendiagrammen: ablesen (Stufe 1), Anteile im Kreis (2, 3, 5), das passende Diagramm wählen (3), Verlauf und Aussagen (4), irreführende Diagramme, Mittelwert und Extremwerte (6).",
      abschnitte: [
        { id: "saeulen", titel: "Säulendiagramme: Daten", bild: saeulenBild,
          spalten: ["Titel", "Einheit", "Kategorien: Wert", "Gruppen", "Frage zur Wahl", "Grund"],
          hinweis: "Vergleich von Gruppen. Das Bild zeigt die ersten Werte; bei zwei Gruppen stehen beide Werte in der Spalte Kategorien. Werte auf dem Raster der Achse, Mittelwert der ersten Werte ganzzahlig.",
          eintraege: () => DIAGRAMM_DATEN.saeulen,
          zeile: d => [d.titel, d.einheit, d.kategorien.map(k => `${k[0]} ${k[1]}: ${k.slice(2).join(" / ")}`.trim()).join(", "), (d.gruppen || []).join(" / ") || "—", d.wahl.frage, d.wahl.grund] },
        { id: "saeulen-saetze", titel: "Säulendiagramme: Fragen und Sätze",
          spalten: ["Titel", "Fragen", "Sätze"],
          hinweis: "{x} ist eine Kategorie, {a} und {b} sind zwei Kategorien (bei „gruppen“ die zwei Gruppen). Die Sätze sind Aussagen, die das Kind als richtig oder falsch erkennt.",
          eintraege: () => DIAGRAMM_DATEN.saeulen, zeile: d => [d.titel, satzZeilen(d.fragen), satzZeilen(d.satz)] },
        { id: "kreis", titel: "Kreisdiagramme", bild: kreisBild,
          spalten: ["Titel", "Teile (Zähler von Nenner)", "Frage zur Wahl", "Grund"],
          hinweis: "Je Nenner eine Gruppe. Die Zähler ergeben zusammen den Nenner; es geht um Anteile vom Ganzen.",
          eintraege: () => DIAGRAMM_DATEN.kreis, gruppe: d => `Nenner ${d.nenner}: ${KREIS[d.nenner] || ""}`.trim(),
          zeile: d => [d.titel, d.teile.map(t => `${t[0]} ${t[1]}: ${t[2]}/${d.nenner}`.trim()).join(", "), d.wahl.frage, d.wahl.grund] },
        { id: "linien", titel: "Liniendiagramme: Daten", bild: linienBild,
          spalten: ["Titel", "Grösse", "Einheit", "Messpunkte: Wert", "ungleiche Zeitachse (Königsstufe)", "Frage zur Wahl", "Grund"],
          hinweis: "Veränderung über die Zeit. Die ungleiche Zeitachse hat gleich viele Punkte, aber ungleiche Abstände — für das irreführende Diagramm.",
          eintraege: () => DIAGRAMM_DATEN.linien,
          zeile: d => [d.titel, d.groesse, d.einheit, d.x.map((x, i) => `${x}: ${d.werte[i]}`).join(", "), (d.xUngleich || []).join(", ") || "—", d.wahl.frage, d.wahl.grund] },
        { id: "linien-saetze", titel: "Liniendiagramme: Fragen und Sätze",
          spalten: ["Titel", "Messpunkte im Satz", "Fragen", "Sätze"],
          hinweis: "{a} und {b} sind zwei Messpunkte, {x} einer — eingesetzt wird die Form im Satz („um 6 Uhr“, „am Montag“).",
          eintraege: () => DIAGRAMM_DATEN.linien, zeile: d => [d.titel, d.xWo.join(", "), satzZeilen(d.fragen), satzZeilen(d.satz)] },
        { id: "offen", titel: "Aussagen, die man nicht ablesen kann (Stufen 4 und 6)",
          spalten: ["Aussage"],
          hinweis: "Je Datensatz eine Gruppe. Die Aussage darf aus dem Diagramm weder richtig noch falsch sein („kann man nicht sagen“).",
          eintraege: () => [...DIAGRAMM_DATEN.saeulen, ...DIAGRAMM_DATEN.linien].flatMap(d => (d.offen || []).map(aussage => ({ titel: d.titel, art: art(d), aussage }))),
          gruppe: e => `${e.art}: ${e.titel}`, zeile: e => [e.aussage] },
      ],
    },
  });
}
