/* Kern — Tastenfeld: Tasten, die in ein gewähltes Eingabefeld schreiben, ohne ihm den Fokus zu nehmen (Entscheid TF1 a,
   LERN_Session20; docs/kern/rahmen.md 4.24). Herkunft: das Ziffernfeld des Notizblocks (kern/notizblock.js, LERN_Session14).
   KERN.tastenfeld({ tasten, ziel, klasse, label, ton, leer }) → { element, tippe(taste), ziel() }
     tasten  Liste: eine Zeichenkette ist eine Taste, die sich selbst schreibt („7“, „x“, „·“); „⌫“ löscht vor der
             Schreibmarke. Ein Objekt { text, label, klasse, wert, tue(feld) } schreibt wert (Standard text) oder tut
             selbst etwas (tue, etwa das Vorzeichen wechseln).
     ziel()  das Feld, in das geschrieben wird (die App entscheidet; null = nichts tun)
     klasse  Klassen des Felds (Standard „tastenfeld“), label die Beschriftung für Vorleser
     ton(art) Ton beim Tippen (Standard still); leer(feld) ruft ⌫ in einem leeren Feld (Notizblock: ein Häuschen zurück)
   Ein Feld mit maxlength 1 (Häuschen) wird ersetzt, sonst wird an der Schreibmarke eingefügt, höchstens bis maxlength.
   Nach jedem Tippen meldet das Feld „input“ wie beim Schreiben mit der Tastatur. Aussehen gibt jede App in ihrem CSS.
   einfuegen() ist die Regel ohne DOM (für die Prüfung). Greift erst beim Aufruf auf document zu. */
"use strict";

(function (KERN) {
  const LOESCHEN = "⌫";

  /**
   * Was nach einem Tipp im Feld steht: { wert, pos } oder null (nichts geändert).
   * wert, von, bis: Inhalt und Auswahl; was: das Zeichen oder LOESCHEN; max: maxlength (0 = ohne Grenze).
   */
  function einfuegen(wert, von, bis, was, max = 0) {
    wert = String(wert ?? "");
    von = Math.max(0, Math.min(von ?? wert.length, wert.length));
    bis = Math.max(von, Math.min(bis ?? von, wert.length));
    if (was === LOESCHEN) {
      if (von !== bis) return { wert: wert.slice(0, von) + wert.slice(bis), pos: von };
      if (!von) return null;
      return { wert: wert.slice(0, von - 1) + wert.slice(von), pos: von - 1 };
    }
    if (max === 1) return { wert: was, pos: was.length }; // ein Häuschen, ein Zeichen
    const neu = wert.slice(0, von) + was + wert.slice(bis);
    if (max && neu.length > max) return null;
    return { wert: neu, pos: von + was.length };
  }

  function tastenfeld({ tasten, ziel, klasse = "tastenfeld", label = "Tasten", ton = () => {}, leer = null }) {
    const el = KERN.el;
    const tippe = taste => {
      const f = ziel();
      if (!f) return;
      const t = typeof taste === "string" ? { text: taste } : taste;
      f.focus();
      if (t.tue) { t.tue(f); f.dispatchEvent(new Event("input", { bubbles: true })); return; }
      const was = t.wert ?? t.text;
      if (was === LOESCHEN && !f.value && leer) { leer(f); return; }
      const max = Number(f.getAttribute("maxlength")) || 0;
      // Ohne Schreibmarke (Ersatz-DOM, nie gewählt) wird hinten angefügt
      const von = typeof f.selectionStart === "number" ? f.selectionStart : f.value.length;
      const bis = typeof f.selectionEnd === "number" ? f.selectionEnd : von;
      const r = einfuegen(f.value, von, bis, was, max);
      if (!r) return;
      f.value = r.wert;
      try { f.setSelectionRange?.(r.pos, r.pos); } catch { /* Felder ohne Schreibmarke */ }
      if (was !== LOESCHEN) ton("tipp");
      f.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const knopf = taste => {
      const t = typeof taste === "string" ? { text: taste } : taste;
      const name = t.label || (t.text === LOESCHEN ? "Löschen" : t.text);
      return el("button", { type: "button", text: t.text, class: t.klasse || null, "aria-label": name, onclick: () => tippe(taste) });
    };
    const element = el("div", { class: klasse, role: "group", "aria-label": label }, ...tasten.map(knopf));
    // Fokus bleibt im gewählten Feld (sonst ginge die Schreibmarke verloren und die Tastatur des Geräts käme)
    element.addEventListener("pointerdown", e => e.preventDefault());
    element.addEventListener("mousedown", e => e.preventDefault());
    return { element, tippe, ziel };
  }

  KERN.tastenfeld = Object.assign(tastenfeld, { einfuegen, LOESCHEN });
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
