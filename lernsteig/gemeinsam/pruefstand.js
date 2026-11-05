/* Prüfstand des Lernsteigs (Entscheide FG1 a, A1 a, LERN_Session15): was im Repo angesehen bzw. geprüft ist.
   Eine Übung mit `neu` im Katalog ist gesperrt, bis sie hier unter `uebungen` steht (auf Desktop, Tablet und Handy
   durchgespielt); eine Übung mit Inhaltslisten braucht dazu mindestens eine geprüfte Liste unter `listen`
   ("<übung>/<liste>"). Einträge: { am: "JJJJ-MM-TT", von: "<Name>" }. Gleiches Prinzip wie im Eulenpfad
   (docs/eulenpfad/rahmen.md 6); gesetzt wird später im Entwickler-Modus (docs/plan_angleich_reihe.md C6). */
"use strict";

const LST_PRUEFSTAND = {
  uebungen: {},
  listen: {},
};

if (typeof module !== "undefined") module.exports = LST_PRUEFSTAND;
