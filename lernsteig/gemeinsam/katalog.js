/* Lernsteig — Katalog der Übungen: einzige Quelle für Fach, Kompetenz, Stufen, Niveaus, Rechner und Endlos-Stufen.
   Vertrag: docs/lernsteig/rahmen.md, Abschnitt 4.
   stufen: Lehrplan-Stufen der Kompetenz (Buchstaben, aufsteigend); daraus entstehen Übergänge und die Challenge
   (ST1 a, ST2 a). rechner: je Lehrplan-Stufe und „challenge“: "ohne" | "mit" | "frei" (TR1 a). endlos: true = jede
   Stufe als Serie (das Testskript verlangt dann je Stufe mindestens 100 verschiedene Aufgaben).

   kompetenz: Code der Kompetenz im Lehrplan Volksschule SG, mit Stufe (docs/lernsteig/lehrplan/mathematik_zyklus3.md).
   Nur Codes aus der Recherche, nie aus dem Gedächtnis. */
"use strict";

var LST_KATALOG = (function () {
  const FAECHER = [
    { id: "mathematik", name: "Mathematik", bereich: "Zahl und Variable, Form und Raum, Grössen, Funktionen und Daten" },
    { id: "deutsch", name: "Deutsch", bereich: "Grammatik, Rechtschreibung, Lesen" },
    { id: "englisch", name: "Englisch", bereich: "Wortschatz und Grammatik" },
    { id: "franzoesisch", name: "Französisch", bereich: "Wortschatz und Grammatik" },
    { id: "nt", name: "Natur und Technik", bereich: "Physik, Chemie, Biologie" },
  ];

  const UEBUNGEN = [
    {
      id: "rationale-zahlen",
      titel: "Rationale Zahlen rechnen",
      fach: "mathematik",
      thema: "Zahl und Variable",
      kompetenz: "MA.1.A.3",
      stufen: ["g", "h", "i"],                // UE1 a
      ohneE: ["h", "i"],                      // Erweiterungen dieser Stufen nicht in der Übung (wie PA Gymnasium)
      weitere: ["MA.1.A.4.h"],                // Klammerregeln, Punkt vor Strich
      // Annahme nach dem Lehrplantext: g ohne Rechner (Kopf oder eigener Rechenweg), h „mit dem Rechner“,
      // i Grundoperationen frei, Potenzen und Wurzeln „mit dem Rechner“; Challenge mit Rechner.
      rechner: { g: "ohne", h: "mit", i: "frei", challenge: "mit" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "gleichungen",
      titel: "Gleichungen lösen",
      fach: "mathematik",
      thema: "Zahl und Variable",
      kompetenz: "MA.1.A.4",
      stufen: ["h", "j"],                     // UE1 a; j besteht nur aus Erweiterungen und wird am Gymnasium geprüft
      ohneE: ["h"],                           // Erweiterung von h (Teilbarkeitsregeln) gehört nicht zu dieser Übung
      // Annahme: h ohne Rechner (Umkehroperation im Kopf), j und Challenge frei.
      rechner: { h: "ohne", j: "frei", challenge: "frei" },
      notizblock: ["=", "+", "−", "×", ":", "frei"], // Gleichung umformen zuerst (GL1 a)
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "groessen",
      titel: "Grössen umwandeln",
      fach: "mathematik",
      thema: "Grössen, Funktionen, Daten und Zufall",
      kompetenz: "MA.3.A.2",
      stufen: ["h", "i", "j", "k"],           // UE1 a; h ist der Grundanspruch Zyklus 2 (Anschluss)
      // Annahme: Umwandeln in benachbarte Einheiten und Vorsätze ohne Rechner, zusammengesetzte Einheiten frei.
      rechner: { h: "ohne", i: "ohne", j: "ohne", k: "frei", challenge: "frei" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "prozent-funktionen",
      titel: "Prozent und Funktionswerte",
      fach: "mathematik",
      thema: "Grössen, Funktionen, Daten und Zufall",
      kompetenz: "MA.3.A.3",
      stufen: ["g", "h", "i"],                // UE1 a
      // Annahme: g ohne Rechner (Ablesen, einfache Zuordnungen), h frei, i mit („Rechner/Tabellenkalkulation“).
      rechner: { g: "ohne", h: "frei", i: "mit", challenge: "mit" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "terme",
      titel: "Terme vereinfachen",
      fach: "mathematik",
      thema: "Zahl und Variable",
      kompetenz: "MA.1.A.4",
      stufen: ["i", "j", "k"],                // UE1 a; j nur Erweiterungen (am Gymnasium geprüft), k Grundanspruch
      ohneE: ["i"],                           // Notation abc = a · b · c (Erweiterung von i) noch nicht in der Übung
      rechner: { i: "ohne", j: "ohne", k: "ohne", challenge: "ohne" }, // Annahme: Algebra ohne Rechner
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "flaechen-volumen",
      titel: "Längen, Flächen, Volumen berechnen",
      fach: "mathematik",
      thema: "Form und Raum",
      kompetenz: "MA.2.A.3",
      stufen: ["f", "g", "h", "i"],           // Gymnasium f–h, EAP f–i (PA)
      // Annahme: f und g ohne Rechner, Pythagoras frei, Kreis und Zylinder mit Rechner (π-Taste).
      rechner: { f: "ohne", g: "ohne", h: "frei", i: "mit", challenge: "mit" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "zehnerpotenzen",
      titel: "Grosse Zahlen und Zehnerpotenzen",
      fach: "mathematik",
      thema: "Zahl und Variable",
      kompetenz: "MA.1.A.1",
      stufen: ["i", "j", "k"],                // Gymnasium und EAP prüfen h–j; k weiterführend
      weitere: ["MA.1.A.3.j"],                // Challenge: rechnen in wissenschaftlicher Schreibweise
      ohneE: ["i"],                           // Begriffe Basis, Exponent (Erweiterung) nicht abgefragt
      // Annahme: ohne Rechner (Stellwerk 8 und Mathematik I ohne Rechner), Challenge frei.
      rechner: { i: "ohne", j: "ohne", k: "ohne", challenge: "frei" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "ueberschlagen-ordnen",
      titel: "Überschlagen und Ordnen",
      fach: "mathematik",
      thema: "Zahl und Variable",
      kompetenz: "MA.1.A.2",
      stufen: ["h", "i", "j"],                // Gymnasium und EAP prüfen h, i, j (PA); i besteht aus der Erweiterung
      rechner: { h: "ohne", i: "ohne", j: "ohne", challenge: "ohne" }, // Überschlagen heisst: im Kopf
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "daten-rabatt",
      titel: "Mittelwert, Häufigkeit, Rabatt",
      fach: "mathematik",
      thema: "Grössen, Funktionen, Daten und Zufall",
      kompetenz: "MA.3.A.1",
      stufen: ["j", "k", "l"],                // Gymnasium i–k, EAP i–l (PA)
      ohneE: ["j"],                           // indirekte Proportionalität (Erweiterung j) übt „Prozent und Funktionswerte“
      // Annahme: Mittelwert und Häufigkeit frei, Prozentaufgaben mit Rechner erlaubt.
      rechner: { j: "frei", k: "frei", l: "frei", challenge: "frei" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "kombinatorik",
      titel: "Möglichkeiten zählen",
      fach: "mathematik",
      thema: "Grössen, Funktionen, Daten und Zufall",
      kompetenz: "MA.3.B.2",
      stufen: ["d", "f", "g"],                // e (OP: Häufigkeiten im Experiment) passt nicht in eine kurze Aufgabe
      // Annahme: kleine Zahlen, Rechner frei
      rechner: { d: "frei", f: "frei", g: "frei", challenge: "frei" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: ["d", "g"],
      neu: "LST_Session1",
    },
    {
      id: "zufall",
      titel: "Daten und Zufall",
      fach: "mathematik",
      thema: "Grössen, Funktionen, Daten und Zufall",
      kompetenz: "MA.3.C.1",
      stufen: ["f", "h", "i"],                // g (Diagramme am Computer) und j (übt „Mittelwert, Häufigkeit, Rabatt“) fehlen
      rechner: { f: "frei", h: "frei", i: "frei", challenge: "frei" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "koerper-winkel",
      titel: "Körper, Winkel, Ähnlichkeit",
      fach: "mathematik",
      thema: "Form und Raum",
      kompetenz: "MA.2.A.3",
      stufen: ["j", "k"],                     // f–i übt „Längen, Flächen, Volumen berechnen“
      // Annahme: Kegel und Kugel mit π-Taste, Rest frei
      rechner: { j: "mit", k: "frei", challenge: "frei" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "stoffwechsel",
      titel: "Stoffwechsel: Organe und Vorgänge",
      fach: "nt",
      thema: "Biologie: Körper, Entwicklung, Ökosysteme",
      kompetenz: "NT.7.2",
      stufen: ["a"],                          // b (GA) und c erklären und experimentieren
      niveaus: ["n1", "n2"],                  // ohne Rechner (kein Eintrag rechner)
      anzahl: 6,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "atombau",
      titel: "Atombau und Periodensystem",
      fach: "nt",
      thema: "Chemie: Stoffe und Reaktionen",
      kompetenz: "NT.3.2",
      stufen: ["a", "c", "d"],                // b (GA, OP: Energiediagramme) und e (Bindungen) folgen
      rechner: { a: "ohne", c: "ohne", d: "ohne", challenge: "ohne" },
      niveaus: ["n1", "n2"],
      anzahl: 6,
      endlos: false,
      listen: { pse: { name: "Elemente 1 bis 20" } },
      neu: "LST_Session1",
    },
    {
      id: "kraefte",
      titel: "Kräfte und einfache Maschinen",
      fach: "nt",
      thema: "Physik: Mechanische und elektrische Phänomene",
      kompetenz: "NT.5.1",
      stufen: ["a", "c", "d", "e"],           // b (Wirkungen) und f (beschleunigt) folgen
      rechner: { a: "frei", c: "frei", d: "ohne", e: "frei", challenge: "frei" }, // d: Zuordnen als Auswahl
      niveaus: ["n1", "n2"],
      anzahl: 6,
      endlos: ["a", "c", "e", "challenge"],
      listen: { maschinen: { name: "Einfache Maschinen" } },
      neu: "LST_Session1",
    },
    {
      id: "stromkreis",
      titel: "Stromkreis und Ohmsches Gesetz",
      fach: "nt",
      thema: "Physik: Mechanische und elektrische Phänomene",
      kompetenz: "NT.5.2",
      stufen: ["b", "c", "d"],                // a (Wirkungen des Stroms) und e (Motor, Generator) beschreibend
      // Annahme: Rechner frei; Formel und Einheiten aus dem Lehrmittel zu bestätigen
      rechner: { b: "ohne", c: "frei", d: "frei", challenge: "frei" }, // b: Regelfragen als Auswahl
      niveaus: ["n1", "n2"],
      anzahl: 6,
      endlos: ["c", "d", "challenge"],
      neu: "LST_Session1",
    },
    {
      id: "aussagen",
      titel: "Aussagen prüfen",
      fach: "mathematik",
      thema: "Zahl und Variable",
      kompetenz: "MA.1.B.2",
      stufen: ["h", "j", "k"],                // Gymnasium und EAP prüfen h und j (PA); i besteht aus der Erweiterung
      rechner: { h: "ohne", j: "ohne", k: "ohne", challenge: "ohne" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      listen: { aussagen: { name: "Aussagen" } }, // Inhaltsliste; gesperrt, bis sie im Prüfstand steht
      neu: "LST_Session1",
    },
    {
      id: "folgen",
      titel: "Folgen und Muster",
      fach: "mathematik",
      thema: "Zahl und Variable",
      kompetenz: "MA.1.C.2",
      stufen: ["g", "h", "i", "j"],           // Gymnasium und EAP prüfen h, i (ohne Erweiterung), j (PA)
      ohneE: ["i"],
      rechner: { g: "ohne", h: "ohne", i: "ohne", j: "ohne", challenge: "frei" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: ["g", "h", "i", "challenge"],   // j hat weniger als 100 verschiedene Figurenfolgen
      neu: "LST_Session1",
    },
    {
      id: "sachsituationen",
      titel: "Sachsituationen",
      fach: "mathematik",
      thema: "Grössen, Funktionen, Daten und Zufall",
      kompetenz: "MA.3.C.2",
      stufen: ["f", "g", "h"],                // Gymnasium und EAP prüfen f, g, h (PA)
      ohneE: ["f", "g"],                      // indirekte Proportionalität, Skalierung wählen: noch nicht in der Übung
      rechner: { f: "frei", g: "frei", h: "ohne", challenge: "frei" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "koordinaten",
      titel: "Koordinaten",
      fach: "mathematik",
      thema: "Form und Raum",
      kompetenz: "MA.2.C.4",
      stufen: ["h", "i", "j"],                // h Grundanspruch und OP; geprüft wird g (PA)
      rechner: { h: "ohne", i: "ohne", j: "ohne", challenge: "ohne" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "brueche",
      titel: "Brüche rechnen",
      fach: "mathematik",
      thema: "Zahl und Variable",
      kompetenz: "MA.1.A.3",
      stufen: ["f", "g", "i"],                // f Grundanspruch Zyklus 2; Gymnasium prüft g, h, i (PA)
      weitere: ["MA.1.A.1.h"],                // Brüche, Dezimal- und Prozentzahlen umschreiben
      ohneE: ["i"],
      rechner: { f: "ohne", g: "ohne", i: "ohne", challenge: "ohne" }, // Annahme: Bruchrechnen im Kopf (Mathematik I)
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "lineare-funktionen",
      titel: "Lineare Funktionen",
      fach: "mathematik",
      thema: "Grössen, Funktionen, Daten und Zufall",
      kompetenz: "MA.3.A.3",
      stufen: ["j", "k"],                     // EAP prüft k (PA); g–i übt „Prozent und Funktionswerte“
      rechner: { j: "frei", k: "frei", challenge: "frei" },
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "binome-gleichungen",
      titel: "Binome und Gleichungen",
      fach: "mathematik",
      thema: "Zahl und Variable",
      kompetenz: "MA.1.A.4",
      stufen: ["l", "m"],                     // EAP prüft l und m (PA); weiterführend nach dem Grundanspruch k
      rechner: { l: "ohne", m: "frei", challenge: "frei" },
      notizblock: ["=", "+", "−", "×", ":", "frei"], // quadratische, Bruchgleichungen und Systeme umformen (GL1 a)
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: true,
      neu: "LST_Session1",
    },
    {
      id: "grammatik",
      titel: "Grammatik: Fälle, Wortarten, Formen",
      fach: "deutsch",
      thema: "Sprache(n) im Fokus",
      kompetenz: "D.5.D.1",
      stufen: ["e", "f", "g"],                // e Grundanspruch und OP; kein Rechner (Feld rechner fehlt)
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: false,                          // Inhaltsliste mit weniger als 100 Einträgen je Stufe
      listen: { grammatik: { name: "Sätze" } },
      neu: "LST_Session1",
    },
    {
      id: "rechtschreibung",
      titel: "Rechtschreibung",
      fach: "deutsch",
      thema: "Sprache(n) im Fokus",
      kompetenz: "D.5.E.1",
      stufen: ["d", "e", "f", "g"],           // d Grundanspruch Zyklus 2 (Anschluss), f Grundanspruch und OP
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: false,                          // Inhaltsliste mit weniger als 100 Einträgen je Stufe
      listen: { rechtschreibung: { name: "Sätze" } },
      neu: "LST_Session1",
    },
    {
      id: "englisch-grammatik",
      titel: "English grammar",
      fach: "englisch",
      thema: "Sprache(n) im Fokus",
      kompetenz: "FS1E.5.D.1",
      sprache: "en",                          // lang-Auszeichnung für Aufgabentext und Antworten (Vorlesen, Trennung)
      stufen: ["b", "c", "d"],                // b Grundanspruch Zyklus 2, c Grundanspruch und OP
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: false,                          // Inhaltsliste mit weniger als 100 Einträgen je Stufe
      listen: { englisch: { name: "Sätze" } },
      neu: "LST_Session1",
    },
    {
      id: "franzoesisch-grammatik",
      titel: "Français : grammaire",
      fach: "franzoesisch",
      thema: "Sprache(n) im Fokus",
      kompetenz: "FS2F.5.D.1",
      sprache: "fr",
      stufen: ["b", "c", "d"],                // c Grundanspruch und OP
      niveaus: ["n1", "n2"],
      anzahl: 8,
      endlos: false,                          // Inhaltsliste mit weniger als 100 Einträgen je Stufe
      listen: { franzoesisch: { name: "Sätze" } },
      neu: "LST_Session1",
    },
  ];

  const uebung = id => UEBUNGEN.find(u => u.id === id) || null;
  const fach = id => FAECHER.find(f => f.id === id) || null;

  return { FAECHER, UEBUNGEN, uebung, fach };
})();

if (typeof module !== "undefined") module.exports = LST_KATALOG;
