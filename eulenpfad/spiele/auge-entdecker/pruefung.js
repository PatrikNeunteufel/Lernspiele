/* Prüfansicht des Auge-Entdeckers (LP1 a, LERN_Session11; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „teile“, aber in Abschnitten, die einzeln geprüft werden (Hinweis Patrik): Name und Bild zuerst — das Bild
   zeigt das Teil so markiert, wie es im Spiel leuchtet, damit die Zuordnung Bezeichnung → Teil abgesegnet werden kann. */
"use strict";
{
  const name = t => `${t.artikel} ${t.name}${t.zusatz ? ` (${t.zusatz})` : ""}`;
  const teilVon = id => AUGE_TEILE.find(t => t.id === id);
  /** Das Teil im passenden Bild, markiert wie in „Wie heisst das Teil, das leuchtet?“ (Ziel-Fläche, z. B. Bindehaut → das Weisse). */
  function teilBild(t) {
    const art = t.bild?.[0];
    if (!art) return LS.el("span", { class: "leise", text: "kein Bild (nur auf dem Weg des Lichts)" });
    const b = art === "schnitt" ? schnittBild({}) : augeBild({ klein: true });
    b.teile.get(t.ziel || t.id)?.classList.add("ae-markiert");
    return b.svg;
  }
  LS.listenPruefung("auge-entdecker", {
    teile: {
      beschreibung: "Teile des Auges (NMG.4.3): aussen in Stufe 1–4 (Bild von vorn), innen in Stufe 5 (Schnitt von der Seite); dazu Aufgaben der Teile, Pupille hell/dunkel, Aussagen und Warum-Fragen. Sätze für die 3. Klasse.",
      abschnitte: [
        { id: "teil", titel: "Teile: Bezeichnung und Bild", spalten: ["Bezeichnung", "Gruppe", "Lage (Tipp 1)", "Aussehen (Tipp 3)"],
          hinweis: "Stimmt die Bezeichnung zum markierten Teil? Lage und Aussehen nennen den Namen nicht.",
          eintraege: () => AUGE_TEILE, bild: teilBild, gruppe: t => (t.gruppe === "aussen" ? "aussen (Bild von vorn)" : t.gruppe === "innen" ? "innen (Schnitt)" : "Weg des Lichts"),
          zeile: t => [name(t), t.gruppe, t.lage, t.aussehen] },
        { id: "aufgabe", titel: "Was die Teile tun (Stufe 4: Körbe)", spalten: ["Teil", "… macht das"],
          hinweis: "Jeder Satz darf nur auf sein Teil passen — sonst sind die Körbe nicht eindeutig.",
          eintraege: () => AUGE_TEILE.flatMap(t => t.aufgaben.map(satz => ({ teil: t.id, satz }))),
          gruppe: a => name(teilVon(a.teil)), zeile: a => [name(teilVon(a.teil)), `… ${a.satz}.`] },
        { id: "pupille", titel: "Pupille: hell und dunkel (Stufe 3)", spalten: ["Satz", "Antwort"],
          eintraege: () => AUGE_PUPILLE, zeile: ([satz, gross]) => [satz, gross === "gross" ? "grösser" : "kleiner"] },
        { id: "augen", titel: "Zwei Augen: welches? (Stufe 3)", spalten: ["Frage", "gesuchte Pupille"],
          eintraege: () => AUGE_AUGEN, zeile: ([frage, gross]) => [frage, gross === "gross" ? "die grosse" : "die kleine"] },
        { id: "aussage", titel: "Stimmt das? (Stufe 5)", spalten: ["Aussage", "stimmt", "Tipp"],
          eintraege: () => AUGE_AUSSAGEN, gruppe: ([, ja]) => (ja ? "stimmt" : "stimmt nicht"), zeile: ([satz, ja, tipp]) => [satz, ja ? "ja" : "nein", tipp] },
        { id: "warum", titel: "Warum? (Stufe 6)", spalten: ["Frage", "richtig", "falsch", "falsch", "Tipp"],
          eintraege: () => AUGE_WARUM, zeile: ([frage, richtig, f1, f2, tipp]) => [frage, richtig, f1, f2, tipp] },
        { id: "lichtweg", titel: "Weg des Lichts (Stufe 6)", spalten: ["von vorn nach hinten"],
          eintraege: () => [AUGE_LICHTWEG], zeile: weg => [weg.map(id => teilVon(id)?.name || id).join(" → ")] },
      ],
    },
  });
}
