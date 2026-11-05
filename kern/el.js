/* Kern — Element bauen (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.5).
   Greift erst beim Aufruf auf document zu, nie beim Laden (in Node ladbar).
   el("button", { class, text, onclick, "aria-label": …, … }, kinder…)
   - text → textContent (immer für Daten: Namen, eingelesene Dateien, Eingaben)
   - html → innerHTML, nur für festen Text aus dem Code, nie für Daten
   - on… → addEventListener
   - undefined, null, false → Attribut weglassen; true → leeres Attribut (disabled, hidden)
   - Kinder: verschachtelte Listen werden flach gemacht; undefined, null, false fallen weg. */
"use strict";

(function (KERN) {
  function el(tag, attr, ...kinder) {
    const e = document.createElement(tag); // globaler Name (auch der Ersatz-DOM tools/pruef_dom.js)
    for (const [k, v] of Object.entries(attr || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "class") e.className = v;
      else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (const kind of kinder.flat(Infinity)) if (kind !== undefined && kind !== null && kind !== false) e.append(kind);
    return e;
  }

  KERN.el = el;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
