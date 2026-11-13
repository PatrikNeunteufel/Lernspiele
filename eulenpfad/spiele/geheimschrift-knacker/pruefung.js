/* Prüfansicht des Geheimschrift-Knackers (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „woerter“ (woerter.js, GEHEIM_WOERTER) mit drei Inhalten, je für sich abzuhaken: die Wörter selbst (passt
   das Wort für die 4.–6. Klasse, in welchen Stufen kommt es mit welchen Schlüsseln vor) und alle 25 Geheimwörter je
   Wort (entsteht beim Verschlüsseln nichts Anstössiges). Die Stufen liest die Ansicht aus der Stufentabelle des Spiels
   (STUFE) mit seiner Auswahl je Wort und Schlüssel (passtInStufe: Mindestlänge, Überlauf über das Alphabet-Ende) und
   beim Knacken mit passendeSchluessel (nur eindeutige Schlüssel); die Geheimwörter rechnet sie mit verschiebe. Gruppen
   nach der Zahl der Buchstaben, weil die Stufen 5 und 6 eine Mindestlänge haben. Braille-Finger leiht die Liste.
   Dazu die gesperrten Schlüssel je Wort (GEHEIM_SPERRE, GK1 a), über gesperrt aus dem Spiel. */
"use strict";
{
  const nummer = s => s.slice(1);
  const WORT_STUFEN = Object.keys(STUFE).filter(brauchtWoerter);
  /** Aufgabenarten des Spiels (STUFE, Feld arten) in Worten. */
  const ART = {
    wort: p => p.richtungen.map(r => ({ ver: "verschlüsseln", ent: "entschlüsseln" })[r]).join(" und "),
    knacken: () => "den Schlüssel knacken (vier zur Wahl)",
    knackenWort: () => "knacken und das Wort eintippen",
  };
  /** [1, 2, 3, 5] → „1–3, 5“ */
  function bereiche(zahlen) {
    const teile = [];
    for (const z of zahlen) {
      const letzter = teile.at(-1);
      if (letzter && z === letzter[1] + 1) letzter[1] = z; else teile.push([z, z]);
    }
    return teile.map(([a, b]) => (a === b ? `${a}` : `${a}–${b}`)).join(", ");
  }
  /** Schlüssel, mit denen die Stufe das Wort nimmt; beim Knacken nur solche, die kein anderes Wort der Liste ergeben. */
  const schluesselVon = (w, s) => STUFE[s].schluessel.filter(k => passtInStufe(w, k, STUFE[s]) && !gesperrt(w, k)
    && (STUFE[s].arten[0] === "wort" || passendeSchluessel(verschiebe(w, k)).length === 1));
  const stufenVon = w => WORT_STUFEN.map(s => [s, schluesselVon(w, s)]).filter(([, ks]) => ks.length)
    .map(([s, ks]) => `${nummer(s)}: ${bereiche(ks)}`).join(" · ") || "—";
  /** Wörter der Liste, die eine Verschiebung dieses Worts sind (machen den Schlüssel beim Knacken mehrdeutig). */
  const verwandte = w => passendeSchluessel(w).map(j => `${verschiebe(w, -j)} (${j})`).join(", ") || "—";
  const STUFEN_TEXT = WORT_STUFEN.map(s => {
    const p = STUFE[s];
    const lauf = p.ueberlauf === undefined ? "" : p.ueberlauf ? ", nur wenn es über Z hinaus geht" : ", ohne über Z hinaus";
    const laenge = p.minLaenge ? `, Wörter ab ${p.minLaenge} Buchstaben` : "";
    return `Stufe ${nummer(s)}: ${p.arten.map(a => ART[a](p)).join(", ")} mit Schlüssel ${bereiche(p.schluessel)}${lauf}${laenge}`;
  }).join(" · ");
  const GRUPPE = w => `${w.length} Buchstaben`;

  LS.listenPruefung("geheimschrift-knacker", {
    woerter: {
      beschreibung: "Kurze Nomen in Grossbuchstaben (nur A–Z) für die Verschiebe-Schrift nach Caesar. Das Kind ver- und "
        + `entschlüsselt sie mit der Schlüsselscheibe und knackt den Schlüssel. Stufe ${nummer(Object.keys(STUFE).find(s => !brauchtWoerter(s)))} `
        + `übt einzelne Buchstaben und braucht keine Wörter. ${STUFEN_TEXT}. Die Spalte „Stufen“ zeigt je Wort die Schlüssel, `
        + "mit denen es vorkommt. Braille-Finger leiht die Liste: die Wörter mit 3 bis 5 Buchstaben, in Stufe 4 zum Lesen "
        + "(vier gleich lange Wörter zur Wahl) und in Stufe 6 zum Schreiben in Punktschrift.",
      abschnitte: [
        { id: "wort", titel: "Wörter", spalten: ["Wort", "Stufen (Schlüssel)", "Verschiebung eines anderen Worts"],
          hinweis: "Je Länge eine Gruppe. Ist das Wort ein Nomen, das Kinder der 4.–6. Klasse kennen, in Schweizer "
            + "Schreibweise (ss, kein ß) und ohne Umlaut (mit Ä, Ö, Ü ginge die Verschiebung im Alphabet nicht auf)? Ist es "
            + "eindeutig ein Wort, kein Name? Die letzte "
            + "Spalte nennt Wörter der Liste, die nur eine Verschiebung dieses Worts sind (der Schlüssel wäre beim Knacken "
            + "nicht eindeutig; das Spiel nimmt das Wort dann in Stufe 5 und 6 nicht).",
          eintraege: () => GEHEIM_WOERTER, gruppe: GRUPPE, zeile: w => [w, stufenVon(w), verwandte(w)] },
        { id: "geheim", titel: "Geheimwörter je Schlüssel", spalten: ["Wort", "Schlüssel 1–5", "6–10", "11–15", "16–20", "21–25"],
          hinweis: "Je Wort alle 25 Geheimwörter, wie die Scheibe sie macht (in Stufe 5 und 6 kann jeder Schlüssel "
            + "vorkommen). Entsteht ein anstössiges, beleidigendes oder peinliches Wort, auch auf Englisch oder als Teil "
            + "des Geheimworts? Dann gehört der Schlüssel zum Wort in die Sperre (GEHEIM_SPERRE in woerter.js). "
            + "Schon gesperrte stehen mit ⛔ und kommen im Spiel nicht vor.",
          eintraege: () => GEHEIM_WOERTER, gruppe: GRUPPE,
          zeile: w => [w, ...[0, 5, 10, 15, 20].map(ab => [1, 2, 3, 4, 5]
            .map(i => `${gesperrt(w, ab + i) ? "⛔ " : ""}${verschiebe(w, ab + i)}`).join(" · "))] },
        { id: "sperre", titel: "Gesperrte Schlüssel", spalten: ["Wort", "Schlüssel", "Geheimwort"],
          hinweis: "Mit diesen Schlüsseln verschlüsselt das Spiel das Wort nie und zeigt diese Verschiebung auch in keinem "
            + "Hinweis beim Knacken (GEHEIM_SPERRE in woerter.js, Entscheid GK1 a). Ist das Geheimwort wirklich "
            + "anstössig, und ist sonst nichts zu sperren? Das Wort selbst bleibt in der Liste.",
          eintraege: () => Object.entries(GEHEIM_SPERRE).flatMap(([w, ks]) => ks.map(k => [w, k])),
          zeile: ([w, k]) => [w, k, verschiebe(w, k)] },
      ],
    },
  });
}
