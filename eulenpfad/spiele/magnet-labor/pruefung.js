/* Prüfansicht des Magnet-Labors (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Vier Listen aus versuche.js: Dinge (MAGNET_DINGE) gruppiert nach dem Korb mit seinem Namen im Spiel (KOERBE), und
   drei Fragenlisten (MAGNET_FRAGEN, Liste im letzten Feld). Die Liste kompass-pole hat dazu einen Abschnitt für die
   Pol-Aufgaben, die das Spiel selbst erzeugt: je Lage des linken Magneten (STAEBE) das Ergebnis mit beiden Lagen des
   rechten (WIRKUNG) und der Pol, der rechts in der Mitte stehen muss (POL_FUER), gezeichnet wie im Spiel (stab).
   Die Spalte „Stufen“ liest die Stufentabelle des Spiels (STUFE_ARTEN) mit seiner Auswahl der Fragen (FRAGE_NIMMT):
   „4 (ab und zu)“ heisst, die Frage kommt dort ab und zu als Frage der Stufe davor. Zu prüfen ist vor allem die Physik:
   Ein Magnet zieht Eisen (auch Stahl), Nickel und Kobalt an, nicht alle Metalle. */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Stufen, in denen eine der Arten vorkommt, als „1, 2, 3“. */
  const stufenMit = (...arten) => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([art]) => arten.includes(art))).map(nummer).join(", ");
  /** Stufen einer Frage: wo sie immer kommt, und wo nur ab und zu (FRAGE_NIMMT des Spiels, ohne Freigabe). */
  const stufenVon = f => Object.keys(STUFE_ARTEN).map(s => {
    const nimmt = STUFE_ARTEN[s].filter(([art]) => art === "frage").map(([, n]) => FRAGE_NIMMT(f, n));
    return nimmt.includes("immer") ? nummer(s) : nimmt.includes("manchmal") ? `${nummer(s)} (ab und zu)` : null;
  }).filter(Boolean).join(", ");
  const fragenVon = liste => () => MAGNET_FRAGEN.filter(f => f[5] === liste);
  /** Stufen aller Fragen einer Liste zusammen, als „3, 4“. */
  const stufenDerListe = liste => Object.keys(STUFE_ARTEN).filter(s => STUFE_ARTEN[s].some(([art, n]) =>
    art === "frage" && MAGNET_FRAGEN.some(f => f[5] === liste && FRAGE_NIMMT(f, n)))).map(nummer).join(", ");
  const korb = k => `${KOERBE[k].bild} ${KOERBE[k].text}`;
  const WIRKUNG_TEXT = { anziehen: "🤝 ziehen sich an", abstossen: "↔️ stossen sich ab" };
  const polText = pole => pole.join(" ");

  /** Abschnitt „Fragen“ einer Fragenliste. */
  const fragen = (liste, hinweis) => ({
    id: "frage", titel: "Fragen", spalten: ["Frage", "Richtig", "Falsch", "Falsch", "Stufen"], hinweis,
    eintraege: fragenVon(liste), zeile: f => [f[1], f[2], f[3], f[4], stufenVon(f)],
  });
  const FRAGEN_BESCHREIBUNG = "Das Kind wählt aus einer richtigen und zwei falschen Antworten (gemischt).";

  LS.listenPruefung("magnet-labor", {
    dinge: {
      beschreibung: `Zieht der Magnet das an? Das Kind legt ein Ding in den Korb „${KOERBE.ja.text}“ oder `
        + `„${KOERBE.nein.text}“ (Stufen ${stufenMit("ding")}). Bei einem Fehler sagt das Spiel: Ein Magnet zieht `
        + "Dinge aus Eisen an — nicht Holz, Papier, Glas oder Stoff.",
      abschnitte: [{
        id: "ding", titel: "Dinge", spalten: ["Bild", "Ding", "Stufen"],
        hinweis: "Je Korb eine Gruppe (Name wie im Spiel). Ist das Ding im Alltag eines Kindes sicher aus Eisen oder Stahl "
          + "(zieht an) beziehungsweise sicher ohne Eisen, Nickel und Kobalt (zieht nicht an)? Dinge, bei denen es auf das "
          + "Material ankommt (Schlüssel aus Messing, Löffel aus Edelstahl, Münzen, Dosen aus Aluminium), gehören nicht "
          + "in die Liste. Zeigt das Bild eindeutig das Ding und sein Material?",
        eintraege: () => MAGNET_DINGE, gruppe: ([, , zieht]) => korb(zieht ? "ja" : "nein"),
        zeile: ([bild, name]) => [bild, name, stufenMit("ding")],
      }],
    },
    wirkung: {
      beschreibung: `Fragen zur Wirkung durch Papier und Wasser und zum Abstand (Stufen ${stufenDerListe("wirkung")}). `
        + FRAGEN_BESCHREIBUNG,
      abschnitte: [fragen("wirkung", "Stimmt die richtige Antwort physikalisch (ein Magnet wirkt durch Papier, Wasser, "
        + "Holz und Kunststoff; je näher, desto stärker), und sind die beiden anderen eindeutig falsch?")],
    },
    "kompass-pole": {
      beschreibung: "Nord- und Südpol: Das Kind sagt, ob sich zwei Stabmagnete anziehen oder abstossen (Stufen "
        + `${stufenMit("pole")}) oder welcher Pol rechts in der Mitte stehen muss (Stufe ${stufenMit("poleWahl")}). `
        + `Dazu Fragen zu Kompass, Erde als Magnet und Polen (Stufen ${stufenDerListe("kompass-pole")}). `
        + FRAGEN_BESCHREIBUNG,
      abschnitte: [{
        id: "pole", titel: "Pol-Aufgaben (vom Spiel erzeugt)",
        spalten: ["Magnet links", `rechts ${polText(STAEBE[0])}`, `rechts ${polText(STAEBE[1])}`,
          "anziehen: rechts in der Mitte", "abstossen: rechts in der Mitte"],
        hinweis: "Je Lage des linken Magneten, was das Spiel als richtig zählt (das Bild zeigt den Magneten wie im Spiel: "
          + "Nordpol rot, Südpol grün). Gleiche Pole stossen sich ab, verschiedene ziehen sich an — entscheidend sind die "
          + "beiden Pole, die sich in der Mitte treffen. Stimmt jede Zelle?",
        eintraege: () => STAEBE,
        bild: links => LS.el("div", { class: "magnete", style: "margin:0" }, stab(links)),
        zeile: links => [polText(links), ...STAEBE.map(rechts => WIRKUNG_TEXT[WIRKUNG(links, rechts)]),
          POL_FUER(links, "anziehen"), POL_FUER(links, "abstossen")],
      }, fragen("kompass-pole", "Stimmt die richtige Antwort physikalisch, und sind die beiden anderen eindeutig "
        + "falsch? Achtung bei „Norden“: Die Nadel zeigt zum magnetischen Nordpol, nicht genau zum geografischen — für "
        + "die Primarschule genügt „nach Norden“.")],
    },
    strom: {
      beschreibung: `Fragen zu Strom, Stromkreis, Leitern, Elektromagnet und Sicherheit (Stufe ${stufenDerListe("strom")}, `
        + `Königsstufe). ${FRAGEN_BESCHREIBUNG}`,
      abschnitte: [fragen("strom", "Stimmt die richtige Antwort, ist sie die einzige richtige (Leiter, Schalter, "
        + "Elektromagnet), und ist die Warnung zur Steckdose unmissverständlich?")],
    },
  });
}
