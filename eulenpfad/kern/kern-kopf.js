/* kern 1.45.0 · Prüfsumme sha256:73e182518766b4a2b8bc6f08348e89eef9a3e291914f7865759974e5ddbf3247 · erzeugt von tools/kern_verteilen.py aus kern/ — nicht von Hand ändern, sondern kern/ ändern und neu verteilen. */
/* ---- kern/farben.kopf.js ---- */
/* Kern — Farben vor dem ersten Bild (Entscheide DM1 a, DM2 a, docs/konzept_darkmode.md; docs/kern/rahmen.md 4.29).
   Läuft im <head> jeder Seite vor allem anderen, ohne KERN und ohne Abhängigkeit, damit eine dunkle Seite nicht erst hell
   aufblitzt: setzt data-farben="dunkel" an <html>, wenn die Wahl es verlangt. Die Wahl legt die App mit KERN.farben.merke
   unter <praefix>farben ab ("hell" | "dunkel" | "geraet", als JSON wie KERN.speicher); das Präfix steht am Skript:
   <script src="…/kern/kern-kopf.js" data-speicher="lernspiele:"></script>. Ohne Wert oder ohne Speicher: hell.
   Dieselbe Regel wie KERN.farben.dunkel (tools/pruefe_kern.js vergleicht beide). tools/kern_verteilen.py bündelt die
   .kopf.js-Teile in <app>/kern/kern-kopf.js. */
(function () {
  "use strict";
  try {
    var skript = document.currentScript;
    var praefix = (skript && skript.getAttribute("data-speicher")) || "";
    var wahl = null;
    try { wahl = JSON.parse(localStorage.getItem(praefix + "farben")); } catch (e) { wahl = null; }
    var dunkel = wahl === "dunkel" || (wahl === "geraet" && typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches);
    if (dunkel) document.documentElement.setAttribute("data-farben", "dunkel");
  } catch (e) { /* ohne Speicher oder DOM: hell */ }
})();
