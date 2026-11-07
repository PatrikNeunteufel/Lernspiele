/* Schriftlich rechnen: Raster der Verfahren und Notizblock (Entscheide NB1–NB4 a, Wunsch Patrik, LERN_Session14).
   Vertrag: docs/eulenpfad/rahmen.md Abschnitt 21. Seit LERN_Session19 ein Kern-Teil (KERN.notizblock, docs/kern/rahmen.md
   4.23; Entscheid NB1 a für die Reihe) — hier steht nur, was der Eulenpfad mitgibt: die Stellen E … M, das eingestellte
   Dezimalzeichen und den Ton. Lädt nach spiel.js; der Rahmen öffnet den Notizblock, die Schriftlich-Werkstatt baut ihr
   Raster mit SCHRIFTLICH.raster und rechnet mit SCHRIFTLICH.rechne. Aussehen: .schriftlich, .notizblock in stil.css. */
const SCHRIFTLICH = KERN.notizblock({
  stellen: LS.STELLEN,
  dezimal: () => (LS.einstellung("dezimal") === "komma" ? "," : "."),
  ton: art => LS.ton?.(art),
});
