/* Kern — Rollleiste: eine Zeile, die seitlich rollt, mit Pfeilen nur bei Bedarf (docs/kern/rahmen.md 4.15).
   Für die Tab-Leiste der Apps (Wunsch Patrik, LERN_Session17: die Leiste bleibt einzeilig, statt umzubrechen).
   KERN.rolleiste(inhalt, { aktiv, schritt, links, rechts }) → Hülle div.rolleiste mit
     button.rolle-pfeil.links · inhalt (bekommt die Klasse rolle-inhalt) · button.rolle-pfeil.rechts
   Ein Pfeil steht nur da, wo noch etwas verborgen ist (Attribut hidden); ein Tippen rollt um einen Teil der
   sichtbaren Breite. Die Pfeile dürfen neben der Rollfläche stehen (sie machen sie dann schmaler) oder darüber.
   Beim Einhängen rollt das aktive Element (Standard [aria-selected="true"]) ganz ins Bild.
   Aussehen und die nötigen Regeln (overflow-x, keine Umbrüche, [hidden]) gibt die App in ihrem CSS.
   KERN.rolleiste.zustand(links, breite, sichtbar) → { links, rechts }: welche Pfeile nötig sind (rein, getestet).
   Greift erst beim Aufruf auf document zu, nie beim Laden (in Node ladbar). */
"use strict";

(function (KERN) {
  const TOLERANZ = 1; // Pixel: gebrochene Rollwerte bei Zoom zählen nicht als „noch etwas verborgen“

  /** Welche Pfeile nötig sind: links, wenn schon gerollt; rechts, wenn rechts noch etwas verborgen ist. */
  function zustand(links, breite, sichtbar) {
    const rest = breite - sichtbar - links;
    return { links: links > TOLERANZ, rechts: rest > TOLERANZ };
  }

  function rolleiste(inhalt, opt = {}) {
    const { aktiv = '[aria-selected="true"]', schritt = 0.7, links = "◀", rechts = "▶" } = opt;
    const pfeil = (richtung, text) => KERN.el("button", {
      type: "button", class: "rolle-pfeil " + richtung, text, hidden: true, tabindex: "-1", "aria-hidden": "true",
      // Mit der Tastatur rollt der Fokus die Leiste selbst; die Pfeile sind nur für Finger und Maus.
      onclick: () => inhalt.scrollBy({ left: (richtung === "links" ? -1 : 1) * inhalt.clientWidth * schritt, behavior: "smooth" }),
    });
    const l = pfeil("links", links), r = pfeil("rechts", rechts);
    inhalt.classList.add("rolle-inhalt");
    const huelle = KERN.el("div", { class: "rolleiste" }, l, inhalt, r);

    const nachfuehren = () => {
      const z = zustand(inhalt.scrollLeft, inhalt.scrollWidth, inhalt.clientWidth);
      l.hidden = !z.links;
      r.hidden = !z.rechts;
    };
    inhalt.addEventListener("scroll", nachfuehren, { passive: true });
    if (typeof ResizeObserver === "function") new ResizeObserver(nachfuehren).observe(inhalt);
    else addEventListener("resize", nachfuehren);

    // Aktives Element ganz ins Bild rollen (nur seitlich, die Seite rollt nicht); true, wenn gerollt wurde.
    const insBild = () => {
      const a = aktiv && inhalt.querySelector(aktiv);
      if (!a) return false;
      const ra = a.getBoundingClientRect(), ri = inhalt.getBoundingClientRect();
      const vorn = ra.left - ri.left + inhalt.scrollLeft, hinten = vorn + ra.width, vorher = inhalt.scrollLeft;
      if (vorn < inhalt.scrollLeft) inhalt.scrollLeft = vorn;
      else if (hinten > inhalt.scrollLeft + inhalt.clientWidth) inhalt.scrollLeft = hinten - inhalt.clientWidth;
      return Math.abs(inhalt.scrollLeft - vorher) > TOLERANZ;
    };
    // Nach dem Einhängen: erst die Pfeile setzen (stehen sie neben der Rollfläche, machen sie sie schmaler), dann ins
    // Bild rollen; wiederholen, bis nichts mehr rollt (ein neuer Pfeil kann den Platz noch einmal ändern).
    requestAnimationFrame(() => {
      for (let i = 0; i < 3; i++) { nachfuehren(); if (!insBild()) break; }
      nachfuehren();
    });
    return huelle;
  }
  rolleiste.zustand = zustand;

  KERN.rolleiste = rolleiste;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
