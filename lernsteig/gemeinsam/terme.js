/* Lernsteig — Terme: reicht den Kern weiter (KERN.terme, docs/kern/rahmen.md 4.17, seit kern 1.14.0), mit der
   Schreibweise des Lernsteigs in text(). Übungen behalten ihre gewohnten Aufrufe LST_TERME.lies, .bewerte, .text, … */
"use strict";

var LST_TERME = Object.assign({}, KERN.terme, {
  /** Polynom als Text in der Schreibweise des Lernsteigs („1'000a − 3“). */
  text: p => KERN.terme.text(p, LST.schreibweise()),
});

if (typeof module !== "undefined") module.exports = LST_TERME;
