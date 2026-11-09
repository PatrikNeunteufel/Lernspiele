/* Prüfansicht der Liste „Aussagen“ (LK1 a, LERN_Session24; Aufbau in kern/listenpruefung.js).
   Je Aussage der Text, die maschinelle Prüfung und ihr Ergebnis (stimmt aus aufgaben.js). Zu prüfen ist, ob der Text
   genau das sagt, was die Prüfung rechnet. */
"use strict";
(() => {
  const PRUEFUNG = p => p.art === "gleich" ? `${p.links} = ${p.rechts}`
    : p.art === "teilbar" ? `${p.term} durch ${p.durch} teilbar`
    : `${p.term} ${p.art}`;
  LST.listenPruefung("aussagen", {
    aussagen: {
      beschreibung: "Aussagen je Stufe. Die Übung rechnet nach, ob eine Aussage stimmt (Spalte „stimmt“); zu prüfen ist, ob der Text genau das sagt, was gerechnet wird.",
      abschnitte: Object.keys(AUSSAGEN).map(s => ({
        id: `stufe-${s}`, titel: `Stufe ${s}: ${UEBUNG.stufen[s] || ""}`, spalten: ["Aussage", "Prüfung", "stimmt"],
        eintraege: () => AUSSAGEN[s], zeile: a => [a.text, PRUEFUNG(a.pruefung), stimmt(a.pruefung) ? "ja" : "nein"],
      })),
    },
  });
})();
