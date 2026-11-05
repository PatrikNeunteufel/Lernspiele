/* Kern — Speicher im Browser mit Präfix der App (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.3).
   Alle Apps teilen den Ursprung patrikneunteufel.github.io und damit localStorage; darum schreibt jede App nur unter
   ihrem Präfix („lernspiele:“, „lernsteig:“, „gratwanderung:“). Der Kern kennt keine Schlüssel der Apps.
   Darf fehlen (privates Fenster, gesperrter Speicher, Node): dann gilt beim Lesen der Ersatz, Schreiben meldet false. */
"use strict";

(function (KERN) {
  // Über den globalen Namen, nicht über globalThis: Ersatz-DOMs der Testskripte (tools/pruef_dom.js) legen
  // localStorage als Variable an. Der Zugriff selbst kann werfen (gesperrte Cookies).
  const ablage = () => { try { return typeof localStorage !== "undefined" ? localStorage : null; } catch (e) { return null; } };

  /**
   * Speicher für ein Präfix: { praefix, lies(schluessel, ersatz), schreibe(schluessel, wert) → true|false,
   * entferne(schluessel), schluessel() → Liste der Schlüssel ohne Präfix }. Werte als JSON.
   */
  function speicher(praefix) {
    if (typeof praefix !== "string" || !/^[a-z][a-z0-9-]*:$/.test(praefix)) throw new Error(`ungültiges Präfix: ${praefix}`);
    function lies(schluessel, ersatz) {
      try {
        const v = ablage()?.getItem(praefix + schluessel);
        return v === null || v === undefined ? ersatz : JSON.parse(v);
      } catch (e) { return ersatz; }
    }
    function schreibe(schluessel, wert) {
      try {
        const a = ablage();
        if (!a) return false;
        a.setItem(praefix + schluessel, JSON.stringify(wert));
        return true;
      } catch (e) { return false; } // voll oder gesperrt: der Aufrufer entscheidet, ob er warnt
    }
    function entferne(schluessel) { try { ablage()?.removeItem(praefix + schluessel); } catch (e) { /* fehlt */ } }
    function schluessel() {
      const a = ablage(), liste = [];
      try { for (let i = 0; a && i < a.length; i++) { const k = a.key(i); if (k && k.startsWith(praefix)) liste.push(k.slice(praefix.length)); } }
      catch (e) { /* fehlt */ }
      return liste;
    }
    return { praefix, lies, schreibe, entferne, schluessel };
  }

  KERN.speicher = speicher;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
