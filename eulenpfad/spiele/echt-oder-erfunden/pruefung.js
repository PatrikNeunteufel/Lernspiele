/* Prüfansicht von „Echt oder erfunden?“ (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Vier Listen aus texte.js, je Inhalt ein Abschnitt: Sätze mit Bild (aussagen), kurze Geschichten und die Merkmale
   des Erfundenen (geschichten), erstaunliche Sätze (staunen), Textsorten mit Merkmal und ihre Texte (textsorten).
   Was das Spiel aus den Rohdaten rechnet, kommt aus index.html: die Lösung als Korb, wie das Kind ihn sieht (LOESUNG,
   KORB), und die Stufen je Eintrag aus der Stufentabelle (STUFE_ARTEN) mit der Auswahl je Art (NIMMT, Liste der Art
   aus LISTE_DER_ART) — so steht bei den Aussagen, welche schon in Stufe 1 kommen.
   Die Merkmale und die Textsorten stehen in eigenen Abschnitten: In Stufe 5 und 6 sind die anderen Merkmale die
   Ablenker, darum muss jedes Merkmal nur auf seine Geschichten und seine Textsorte passen.
   Zu prüfen: Stimmen die Sachaussagen („echt“, „stimmt“), sind die erfundenen eindeutig erfunden, hat jede erfundene
   Geschichte genau einen erfundenen Satz mit genau einem Merkmal, passt es zum Alter (Stufe 1–4 für die 1. und
   2. Klasse)? */
"use strict";
{
  const ART = {
    aussage: nurEinfach => `Satz mit Bild in den Korb legen${nurEinfach ? " (nur ganz eindeutige Sätze)" : ""}`,
    geschichte: () => "Geschichte als echt oder erfunden erkennen",
    welcherSatz: () => "den erfundenen Satz antippen",
    merkmal: () => "das Merkmal des Erfundenen wählen",
    staunen: () => "„stimmt“ oder „erfunden“ wählen",
    textsorte: () => "Textsorte wählen (aus allen vier)",
    textmerkmal: () => "Merkmal der Textsorte wählen (aus drei)",
  };
  const nummer = s => s.slice(1);
  const nr = stufen => (stufen.length ? `${stufen.length > 1 ? "Stufen" : "Stufe"} ${stufen.map(nummer).join(", ")}` : "keine Stufe");
  /** Stufen, in denen eine Art dieser Liste den Eintrag nehmen kann (STUFE_ARTEN mit NIMMT des Spiels, ohne Freigabe). */
  const stufenVon = (liste, e) => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([art, zusatz]) => LISTE_DER_ART[art] === liste && NIMMT[art](e, zusatz)));
  /** „Stufe 1: Satz mit Bild … · Stufe 2: …“ für die Arten einer Liste; mehrfach genannte Arten nur einmal. */
  const stufenText = liste => Object.entries(STUFE_ARTEN)
    .map(([s, arten]) => [s, [...new Set(arten.filter(([art]) => LISTE_DER_ART[art] === liste).map(([art, zusatz]) => ART[art](zusatz)))]])
    .filter(([, texte]) => texte.length).map(([s, texte]) => `Stufe ${nummer(s)}: ${texte.join("; ")}`).join(" · ");
  const korb = schluessel => `${KORB[schluessel].bild} ${KORB[schluessel].text}`;
  const geschichtenMit = merkmal => GESCHICHTEN.filter(g => g[2] === merkmal).length;
  const texteDer = sorte => TEXTSORTEN_TEXTE.filter(t => t[0] === sorte).length;

  LS.listenPruefung("echt-oder-erfunden", {
    aussagen: {
      beschreibung: `Kurze Sätze mit Bild: Das Kind legt die Karte in den Korb „Kann es geben“ oder „Erfunden“. ${stufenText("aussagen")}. `
        + "Die Eule liest den Satz mit vor. Echt und erfunden kommen etwa gleich oft.",
      abschnitte: [{
        id: "aussage", titel: "Sätze mit Bild", spalten: ["Bild", "Satz", "Korb", "Stufen"],
        hinweis: "Je Bild eine Gruppe: Jedes Bild soll einmal echt und einmal erfunden vorkommen, damit es nichts verrät. "
          + "Kann es das Echte wirklich geben, ist das Erfundene eindeutig unmöglich (nicht nur selten)? Sätze in Stufe 1 "
          + "müssen für die 1. Klasse ganz eindeutig sein.",
        eintraege: () => AUSSAGEN,
        gruppe: e => `Bild ${e[0]}`,
        zeile: e => [e[0], e[1], korb(LOESUNG.aussage(e)), nr(stufenVon("aussagen", e))],
      }],
    },
    geschichten: {
      beschreibung: `Kurze Geschichten aus drei Sätzen; eine erfundene hat genau einen erfundenen Satz. ${stufenText("geschichten")}.`,
      abschnitte: [{
        id: "geschichte", titel: "Geschichten", spalten: ["Satz 1", "Satz 2", "Satz 3", "Lösung", "Stufen"],
        hinweis: "Je Merkmal eine Gruppe. Kann bei den echten jeder Satz wirklich passieren? Ist bei den erfundenen genau der "
          + "genannte Satz unmöglich und die anderen beiden möglich? Passt nur das Merkmal der Gruppe — kein anderes aus dem "
          + "Abschnitt „Merkmale“ (sie sind in Stufe 5 die Ablenker)?",
        eintraege: () => GESCHICHTEN,
        gruppe: ([, k, merkmal]) => (k < 0 ? "kann wirklich passieren" : `erfunden: ${MERKMALE[merkmal]}`),
        zeile: e => [...e[0], `${korb(LOESUNG.geschichte(e))}${e[1] < 0 ? "" : `: Satz ${e[1] + 1}`}`, stufenVon("geschichten", e).map(nummer).join(", ")],
      }, {
        id: "merkmal", titel: "Merkmale des Erfundenen (Stufe 5: Antwort und Ablenker)", spalten: ["Merkmal", "Geschichten damit"],
        hinweis: "Die Merkmale müssen sich ausschliessen: Zu jeder erfundenen Geschichte zeigt das Spiel ihr Merkmal und zwei "
          + "andere zufällig. Ist jedes Merkmal für ein Kind der 3. Klasse klar, und passt keines auf die Geschichten eines anderen?",
        eintraege: () => Object.entries(MERKMALE),
        zeile: ([schluessel, text]) => [text, String(geschichtenMit(schluessel))],
      }],
    },
    staunen: {
      beschreibung: `Erstaunliche Sätze über Tiere und Natur: Stimmt das, oder ist es erfunden? ${stufenText("staunen")}. `
        + "Die wahren Sätze sollen erstaunlich klingen, die erfundenen glaubhaft.",
      abschnitte: [{
        id: "satz", titel: "Sätze", spalten: ["Satz", "Lösung", "Stufen"],
        hinweis: "Je Lösung eine Gruppe. Stimmt jede Sachangabe genau (Zahlen, Tierarten)? Sind die erfundenen sicher falsch — "
          + "auch nicht für einzelne Arten wahr?",
        eintraege: () => STAUNEN,
        gruppe: e => korb(LOESUNG.staunen(e)),
        zeile: e => [e[0], korb(LOESUNG.staunen(e)), nr(stufenVon("staunen", e))],
      }],
    },
    textsorten: {
      beschreibung: `Selbst geschriebene Ausschnitte aus Märchen, Sage, Fabel und Sachtext. ${stufenText("textsorten")}. `
        + "Die Sagen erfinden Geschichten zu echten Orten der Ostschweiz.",
      abschnitte: [{
        id: "sorte", titel: "Textsorten und ihr Merkmal (Antwort und Ablenker)", spalten: ["Textsorte", "Merkmal", "Texte"],
        hinweis: "Beim Merkmal zeigt das Spiel das richtige und zwei andere: Passt jedes Merkmal nur auf seine Textsorte?",
        eintraege: () => Object.entries(TEXTSORTEN),
        zeile: ([schluessel, { name, merkmal }]) => [name, merkmal, String(texteDer(schluessel))],
      }, {
        id: "text", titel: "Texte", spalten: ["Textsorte", "Text"],
        hinweis: "Je Textsorte eine Gruppe. Zeigt jeder Text das Merkmal seiner Textsorte (Abschnitt oben) und keines einer "
          + "anderen? Stimmen die Sachangaben im Sachtext und die Orte der Sagen?",
        eintraege: () => TEXTSORTEN_TEXTE,
        gruppe: ([sorte]) => TEXTSORTEN[sorte].name,
        zeile: ([sorte, text]) => [TEXTSORTEN[sorte].name, text],
      }],
    },
  });
}
