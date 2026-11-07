/* Inhaltsliste „Einfache Maschinen: Beispiele“ (NT.5.1 d) — zum Durchsehen ohne Code.
   UNGEPRÜFT (LST_Session1, erweitert LERN_Session21 von 11 auf 36), bis Patrik sie durchgesehen hat. Die Lehrplanseite nennt als einfache Maschinen: Hebel,
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
    // Erweitert in LERN_Session21 (Plan E 9, KR1 a): je Maschine neun Beispiele, nur eindeutige Fälle — keine Wellräder
    // (Türklinke, Lenkrad, Schraubenzieher) und keine Keile, weil sie nicht unter den vier Namen des Lehrplans stehen.
    { beispiel: "Auf einer Wippe hebt ein leichtes Kind ein schwereres, weil es weiter vom Drehpunkt entfernt sitzt.", maschine: "Hebel" },
    { beispiel: "Mit einem Flaschenöffner wird ein Kronkorken abgehoben.", maschine: "Hebel" },
    { beispiel: "Mit einer Beisszange wird ein Draht durchgeknipst.", maschine: "Hebel" },
    { beispiel: "Mit dem Stiel eines Löffels wird der Deckel einer Farbdose aufgehebelt.", maschine: "Hebel" },
    { beispiel: "Mit einem Klauenhammer wird ein Nagel aus dem Brett gezogen.", maschine: "Hebel" },
    { beispiel: "Eine Waschmaschine wird über zwei schräge Bretter in einen Lieferwagen geschoben.", maschine: "schiefe Ebene" },
    { beispiel: "Neben der Treppe einer Unterführung führt eine Rampe für Velos und Kinderwagen hinauf.", maschine: "schiefe Ebene" },
    { beispiel: "Ein Bagger fährt über eine Rampe auf einen Tieflader.", maschine: "schiefe Ebene" },
    { beispiel: "Ein Wanderweg führt im Zickzack einen steilen Hang hinauf.", maschine: "schiefe Ebene" },
    { beispiel: "Ein Kühlschrank wird über die ausklappbare Rampe in einen Möbelwagen geschoben.", maschine: "schiefe Ebene" },
    { beispiel: "Ein schwerer Rollkoffer wird über eine schräge Rampe in den Zug gezogen.", maschine: "schiefe Ebene" },
    { beispiel: "Ein Mechaniker hebt einen Automotor mit einer Kette über mehrere Rollen aus dem Auto.", maschine: "Flaschenzug" },
    { beispiel: "Auf einer Baustelle zieht ein Arbeiter einen Eimer Mörtel über eine feste und eine lose Rolle hoch.", maschine: "Flaschenzug" },
    { beispiel: "Ein Klavier wird mit einem Seil über mehrere Rollen in den dritten Stock gehoben.", maschine: "Flaschenzug" },
    { beispiel: "In der Werkstatt wird ein schweres Autorad an einem Seil über mehrere Rollen hochgezogen.", maschine: "Flaschenzug" },
    { beispiel: "Eine grosse Fensterscheibe wird mit einem Seil, das über vier Rollen läuft, aufs Dach gehoben.", maschine: "Flaschenzug" },
    { beispiel: "Auf einem Schiff wird eine schwere Ladung mit einem Seil über mehrere Rollen an Deck gehoben.", maschine: "Flaschenzug" },
    { beispiel: "Im Turm einer Burg wird eine schwere Kiste mit Seil und mehreren Rollen hochgezogen.", maschine: "Flaschenzug" },
    { beispiel: "Am Velo wird vorne das kleinere Kettenblatt eingelegt, damit es bergauf leichter geht.", maschine: "Ketten-/Zahnradgetriebe" },
    { beispiel: "Am Mountainbike wird hinten das grösste Ritzel eingelegt, um einen steilen Weg hinaufzufahren.", maschine: "Ketten-/Zahnradgetriebe" },
    { beispiel: "Eine Winde mit Kurbel zieht ein Boot über Zahnräder mit wenig Kraft auf den Anhänger.", maschine: "Ketten-/Zahnradgetriebe" },
    { beispiel: "Mit einer Handkurbel und Zahnrädern wird das schwere Tor einer Schleuse geöffnet.", maschine: "Ketten-/Zahnradgetriebe" },
    { beispiel: "Eine schwere Markise wird mit einer Kurbel über Zahnräder ausgefahren.", maschine: "Ketten-/Zahnradgetriebe" },
    { beispiel: "Ein Rollstuhl mit Handkurbel und Kette lässt sich auch bergauf mit wenig Kraft bewegen.", maschine: "Ketten-/Zahnradgetriebe" },
    { beispiel: "Ein Kinderkarussell wird mit einer Kurbel über Zahnräder mit wenig Kraft gedreht.", maschine: "Ketten-/Zahnradgetriebe" },
  ],
};

if (typeof module !== "undefined") module.exports = MASCHINEN;
