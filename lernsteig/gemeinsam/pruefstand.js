/* Prüfstand des Lernsteigs (Entscheide FG1 a, A1 a, LERN_Session15): was im Repo angesehen bzw. geprüft ist.
   Eine Übung mit `neu` im Katalog ist gesperrt, bis sie hier unter `uebungen` steht (auf Desktop, Tablet und Handy
   durchgespielt); eine Übung mit Inhaltslisten braucht dazu mindestens eine geprüfte Liste unter `listen`
   ("<übung>/<liste>"). Einträge: { am: "JJJJ-MM-TT", von: "<Name>" }. Gleiches Prinzip wie im Eulenpfad
   (docs/eulenpfad/rahmen.md 6). Geschrieben vom Entwickler-Server (tools/entwickler_server.py) — nicht von Hand
   ändern. */
"use strict";

const LST_PRUEFSTAND = {
  "listen": {},
  "uebungen": {
    "gleichungen": {
      "am": "2026-11-07",
      "von": "Patrik"
    },
    "rationale-zahlen": {
      "am": "2026-11-07",
      "von": "Patrik"
    },
    "terme": {
      "am": "2026-11-07",
      "von": "Patrik"
    }
  }
};

if (typeof module !== "undefined") module.exports = LST_PRUEFSTAND;
