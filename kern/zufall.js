/* Kern — Zufall über eine austauschbare Quelle (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.4).
   Standard ist Math.random, erst beim Aufruf gelesen: So greift auch ein Testskript, das Math.random ersetzt
   (Eulenpfad, tools/pruef_dom.js). Ein Testskript kann stattdessen KERN.zufall.quelle.zufall setzen (Lernsteig) oder
   eine Quelle mit Startwert von KERN.zufall.mitStartwert(seed) nehmen. */
"use strict";

(function (KERN) {
  const quelle = { zufall: () => Math.random() };
  /** Ganze Zahl von min bis max (beide eingeschlossen). */
  function zufall(min, max) { return min + Math.floor(quelle.zufall() * (max - min + 1)); }
  /** Ein Element der Liste. */
  function waehle(liste) { return liste[Math.floor(quelle.zufall() * liste.length)]; }
  /** Gemischte Kopie der Liste (Fisher-Yates). */
  function mische(liste) {
    const a = liste.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(quelle.zufall() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  /** Wiederholbare Zahlenfolge in [0, 1) aus einem Startwert (mulberry32), für Testskripte. */
  function mitStartwert(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  KERN.zufall = { quelle, zufall, waehle, mische, mitStartwert };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
