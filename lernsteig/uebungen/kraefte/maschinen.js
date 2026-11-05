/* Inhaltsliste „Einfache Maschinen: Beispiele“ (NT.5.1 d) — zum Durchsehen ohne Code.
   UNGEPRÜFT (LST_Session1), bis Patrik sie durchgesehen hat. Die Lehrplanseite nennt als einfache Maschinen: Hebel,
   schiefe Ebene, Flaschenzug, Ketten-/Zahnradgetriebe (docs/lernsteig/lehrplan/nt_zyklus3.md, NT.5.1 d). Die
   Beispiele sind Annahmen und mit dem Lehrmittel abzugleichen. Je Eintrag: beispiel, maschine (einer der vier Namen). */
"use strict";

const MASCHINEN = {
  namen: ["Hebel", "schiefe Ebene", "Flaschenzug", "Ketten-/Zahnradgetriebe"],
  beispiele: [
    { beispiel: "Mit einer Brechstange wird ein schwerer Stein angehoben.", maschine: "Hebel" },
    { beispiel: "Ein Nussknacker knackt eine Baumnuss.", maschine: "Hebel" },
    { beispiel: "Mit einer Schubkarre wird Erde transportiert.", maschine: "Hebel" },
    { beispiel: "Eine Schere schneidet Karton.", maschine: "Hebel" },
    { beispiel: "Ein Fass wird über ein Brett auf einen Lastwagen gerollt.", maschine: "schiefe Ebene" },
    { beispiel: "Eine Passstrasse führt in Serpentinen den Berg hinauf.", maschine: "schiefe Ebene" },
    { beispiel: "Ein Rollstuhl fährt über eine Rampe ins Gebäude.", maschine: "schiefe Ebene" },
    { beispiel: "Ein Kran hebt eine Last mit mehreren Rollen und einem Seil.", maschine: "Flaschenzug" },
    { beispiel: "Ein Segel wird mit einem Seil über mehrere Rollen hochgezogen.", maschine: "Flaschenzug" },
    { beispiel: "Am Velo wird ein grösseres Ritzel hinten eingelegt, damit der Berg leichter geht.", maschine: "Ketten-/Zahnradgetriebe" },
    { beispiel: "Ein Handbohrer überträgt die Kurbelbewegung über Zahnräder auf den Bohrer.", maschine: "Ketten-/Zahnradgetriebe" },
  ],
};

if (typeof module !== "undefined") module.exports = MASCHINEN;
