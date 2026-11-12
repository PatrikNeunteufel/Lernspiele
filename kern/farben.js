/* Kern — Farben anwenden (Entscheide DM1 a, DM2 a, DM2-S a, docs/konzept_darkmode.md; docs/kern/rahmen.md 4.29).
   Die Farben selbst stehen in farben.css (--k-*, hell unter :root, dunkel unter :root[data-farben="dunkel"]). Hier nur, wie
   die Wahl zur Seite kommt: Werte WAHLEN; dunkel(wahl) entscheidet (bei "geraet" nach prefers-color-scheme); anwenden
   setzt oder nimmt data-farben an <html> und folgt bei "geraet" dem Gerät, solange die Seite offen ist; merke legt die
   aufgelöste Wahl im Speicher der App ab, damit farben.kopf.js sie auf der nächsten Seite vor dem ersten Bild setzt.
   Welche Wahl gilt (Gerät, „Für mich“ einer Aufsicht, Person im Lernsteig), entscheidet die App. */
"use strict";

(function (KERN) {
  const WAHLEN = ["hell", "dunkel", "geraet"];
  const ABFRAGE = "(prefers-color-scheme: dark)";
  const geraetDunkel = () => typeof matchMedia === "function" && matchMedia(ABFRAGE).matches;
  /** Dunkel für diese Wahl? Unbekannte Werte: hell. */
  const dunkel = wahl => wahl === "dunkel" || (wahl === "geraet" && geraetDunkel());

  let folgt = null; // Abfrage, der die Seite bei "geraet" folgt
  /** data-farben an <html> setzen; bei "geraet" auch später dem Gerät folgen. */
  function anwenden(wahl) {
    if (typeof document === "undefined") return;
    const setze = () => {
      if (dunkel(wahl)) document.documentElement.setAttribute("data-farben", "dunkel");
      else document.documentElement.removeAttribute("data-farben");
    };
    setze();
    if (folgt) { folgt.m.removeEventListener?.("change", folgt.f); folgt = null; }
    if (wahl === "geraet" && typeof matchMedia === "function") {
      const m = matchMedia(ABFRAGE), f = () => setze();
      m.addEventListener?.("change", f);
      folgt = { m, f };
    }
  }
  /** Die aufgelöste Wahl im Speicher der App ablegen (KERN.speicher: speicher.schreibe) — für farben.kopf.js. */
  function merke(speicher, wahl) { speicher.schreibe("farben", WAHLEN.includes(wahl) ? wahl : "hell"); }

  KERN.farben = { WAHLEN, dunkel, anwenden, merke };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
