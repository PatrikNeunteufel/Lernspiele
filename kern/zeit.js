/* Kern — Kalendertage in Ortszeit (Plan docs/plan_angleich_reihe.md B2 Schritt 3, Zeitzone; docs/kern/rahmen.md 4.25).
   Zeiten werden als ISO in UTC gespeichert (toISOString). Ein Kalendertag — Übungstag, „angelegt am“, Datum in einer
   Meldung oder einem Dateinamen — ist aber der Tag des Geräts: Eine Runde um 00:30 Uhr in der Schweiz liegt in UTC noch
   am Vortag. Darum nie „iso.slice(0, 10)“ oder „toISOString().slice(0, 10)“ für einen Tag, sondern diese Funktionen.
   tools/pruefe_kern.js sucht solche Stellen im Code der Apps. */
"use strict";

(function (KERN) {
  const zwei = n => String(n).padStart(2, "0");
  /** Kalendertag „JJJJ-MM-TT“ in Ortszeit; d: Date, ISO-Text oder Zeitwert (ohne Angabe jetzt). "" bei ungültiger Zeit. */
  function tag(d = new Date()) {
    const x = d instanceof Date ? d : new Date(d);
    return isNaN(x) ? "" : `${x.getFullYear()}-${zwei(x.getMonth() + 1)}-${zwei(x.getDate())}`;
  }
  /** Kalendertag vor n Tagen (Ortszeit; über Kalendertage gezählt, nicht über 24-Stunden-Schritte: hält bei Sommerzeit). */
  function vorTagen(n, heute = new Date()) {
    const x = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() - n, 12);
    return tag(x);
  }
  /** Kalendertag als „T.M.JJJJ“ (Ortszeit), "" bei ungültiger Zeit. */
  function tagAnzeige(d) {
    const x = d instanceof Date ? d : new Date(d);
    return isNaN(x) ? "" : `${x.getDate()}.${x.getMonth() + 1}.${x.getFullYear()}`;
  }

  KERN.zeit = { tag, vorTagen, tagAnzeige };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
