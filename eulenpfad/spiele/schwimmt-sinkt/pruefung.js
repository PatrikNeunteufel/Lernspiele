/* Prüfansicht von „Schwimmt oder sinkt?“ (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js,
   rahmen.md 17). Vier Listen aus stoffe.js: Dinge im Wasser (WASSER_DINGE) gruppiert nach dem Korb mit seinem Namen im
   Spiel (WASSER), dazu als eigener Abschnitt die Auswahl für Stufe 1 (WASSER_EINFACH); Dinge mit Material
   (MATERIAL_DINGE) gruppiert nach dem Korb (MATERIALIEN des Spiels), dazu die Körbe selbst, die das Kind als Ablenker
   sieht; zwei Fragenlisten (STOFF_FRAGEN, Liste im letzten Feld). Die Spalte „Stufen“ liest die Stufentabelle des
   Spiels (STUFE_ARTEN) mit seiner Auswahl je Art (NIMMT): „5 (ab und zu)“ heisst, die Frage kommt dort ab und zu als
   Frage der Stufe davor. Zu prüfen ist vor allem die Physik: Schwimmt das Ding als Ganzes, so wie das Bild es zeigt,
   sicher — oder kommt es auf Form, Füllung oder Material an? */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Stufen, in denen eine der Arten den Eintrag nimmt (NIMMT des Spiels, ohne Freigabe), als „1, 2, 5 (ab und zu)“. */
  const stufenVon = (e, ...arten) => Object.keys(STUFE_ARTEN).map(s => {
    const nimmt = STUFE_ARTEN[s].filter(([art]) => arten.includes(art)).map(([art, zusatz]) => NIMMT[art](e, zusatz));
    return nimmt.some(n => n === true || n === "immer") ? nummer(s) : nimmt.includes("manchmal") ? `${nummer(s)} (ab und zu)` : null;
  }).filter(Boolean).join(", ");
  /** Stufen, in denen die Art vorkommt, als „1, 2, 3“. */
  const stufenMit = art => Object.keys(STUFE_ARTEN).filter(s => STUFE_ARTEN[s].some(([a]) => a === art)).map(nummer).join(", ");
  const FRAGE_ARTEN = ["frage", "frageBis"];
  const fragenVon = liste => () => STOFF_FRAGEN.filter(f => f[5] === liste);
  /** Stufen aller Fragen einer Liste zusammen, als „4, 5, 6“. */
  const stufenDerListe = liste => Object.keys(STUFE_ARTEN).filter(s => STUFE_ARTEN[s].some(([art, n]) =>
    FRAGE_ARTEN.includes(art) && STOFF_FRAGEN.some(f => f[5] === liste && NIMMT[art](f, n)))).map(nummer).join(", ");
  /** Stufen mit Material-Aufgaben und der Zahl ihrer Körbe, als „3 und 4 mit 3 Körben, 6 mit 5 Körben“. */
  const materialStufen = () => {
    const je = {};
    for (const [s, arten] of Object.entries(STUFE_ARTEN))
      for (const [art, zahl] of arten) if (art === "material") (je[zahl] ||= []).push(nummer(s));
    return Object.entries(je).map(([zahl, st]) => `${st.join(" und ")} mit ${zahl} Körben`).join(", ");
  };
  const wasserKorb = schwimmt => { const k = WASSER[schwimmt ? "schwimmt" : "sinkt"]; return `${k.bild} ${k.text}`; };
  const DINGE_HINWEIS = "Schwimmt das Ding als Ganzes, so wie das Bild es zeigt, in gewöhnlichem Wasser sicher "
    + "beziehungsweise sinkt es sicher? Dinge, bei denen es auf das einzelne Stück, die Form oder das Material ankommt "
    + "(Ei, Orange mit oder ohne Schale, Schwamm, Büroklammer auf der Wasserhaut, Bimsstein), gehören nicht in die Liste.";

  /** Abschnitt „Fragen“ einer Fragenliste. */
  const fragen = (liste, hinweis) => ({
    id: "frage", titel: "Fragen", spalten: ["Frage", "Richtig", "Falsch", "Falsch", "Stufen"], hinweis,
    eintraege: fragenVon(liste), zeile: f => [f[1], f[2], f[3], f[4], stufenVon(f, ...FRAGE_ARTEN)],
  });
  const FRAGEN_BESCHREIBUNG = "Das Kind wählt aus einer richtigen und zwei falschen Antworten (gemischt).";

  LS.listenPruefung("schwimmt-sinkt", {
    wasser: {
      beschreibung: `Schwimmt es oder sinkt es? Das Kind legt ein Ding in den Korb „${WASSER.schwimmt.text}“ oder `
        + `„${WASSER.sinkt.text}“ (Stufen ${stufenMit("wasser")}; Stufe 1 nur die Auswahl der ganz `
        + "eindeutigen Dinge).",
      abschnitte: [{
        id: "ding", titel: "Dinge im Wasser", spalten: ["Bild", "Ding", "Stufen"],
        hinweis: `Je Korb eine Gruppe (Name wie im Spiel). ${DINGE_HINWEIS} Zeigt das Bild eindeutig das Ding?`,
        eintraege: () => WASSER_DINGE, gruppe: ([, , schwimmt]) => wasserKorb(schwimmt),
        zeile: d => [d[0], d[1], stufenVon(d, "wasser")],
      }, {
        id: "einfach", titel: "Auswahl für Stufe 1 (ganz eindeutig)", spalten: ["Bild", "Ding", "Im Wasser"],
        hinweis: "Stufe 1 ist der Einstieg (Kindergarten). Ist jedes dieser Dinge ohne jeden Zweifel zu beurteilen, auch "
          + "für ein Kind, das nur auf einen Teil schaut (etwa den Holzstiel des Hammers)? Steht jeder Name genau so in "
          + "„Dinge im Wasser“ (sonst fehlt das Ding in Stufe 1)?",
        eintraege: () => WASSER_EINFACH,
        zeile: name => {
          const d = WASSER_DINGE.find(w => w[1] === name);
          return d ? [d[0], name, wasserKorb(d[2])] : ["", name, "— fehlt in „Dinge im Wasser“"];
        },
      }],
    },
    material: {
      beschreibung: `Aus welchem Material ist das? Das Kind legt ein Ding in den Korb seines Materials (Stufen `
        + `${materialStufen()}: der richtige und zufällig gewählte andere).`,
      abschnitte: [{
        id: "ding", titel: "Dinge", spalten: ["Bild", "Ding", "Stufen"],
        hinweis: "Je Material eine Gruppe (Korb wie im Spiel). Ist das Ding ganz oder fast ganz aus diesem Material, so "
          + "dass kein anderer Korb auch passt (Deckel, Rahmen, Griffe)? Zeigt das Bild das Ding eindeutig?",
        eintraege: () => MATERIAL_DINGE, gruppe: ([, , m]) => LS.mitBildText(MATERIALIEN[m], m),
        zeile: d => [d[0], d[1], stufenVon(d, "material")],
      }, {
        id: "korb", titel: "Körbe (Material zur Wahl)", spalten: ["Bild", "Material"],
        hinweis: "Diese Körbe bietet das Spiel an; neben dem richtigen stehen zufällig andere. Ist jedes Material für das "
          + "Alter bekannt, und zeigt das Bild das Material, nicht schon eines der Dinge?",
        eintraege: () => Object.entries(MATERIALIEN), zeile: ([m, bild]) => [bild, m],
      }],
    },
    eigenschaften: {
      beschreibung: `Fragen zu Eigenschaften von Stoffen: durchsichtig, Wärme, biegsam, Papier (Stufen `
        + `${stufenDerListe("eigenschaften")}). ${FRAGEN_BESCHREIBUNG}`,
      abschnitte: [fragen("eigenschaften", "Stimmt die richtige Antwort, ist sie die einzige richtige, und sind die "
        + "beiden anderen eindeutig falsch? Ist die Frage so gestellt, dass ein Kind die gemeinte Eigenschaft erkennt?")],
    },
    "schwimmen-sinken": {
      beschreibung: `Fragen: Warum schwimmt oder sinkt etwas? (Stufen ${stufenDerListe("schwimmen-sinken")}). `
        + FRAGEN_BESCHREIBUNG,
      abschnitte: [fragen("schwimmen-sinken", "Stimmt die richtige Antwort physikalisch (es kommt darauf an, ob ein Ding "
        + "für seine Grösse schwerer oder leichter ist als Wasser, und auf die Form: ein hohles Boot verdrängt viel "
        + "Wasser), ist die Vereinfachung für das Alter vertretbar, und sind die beiden anderen eindeutig falsch?")],
    },
  });
}
