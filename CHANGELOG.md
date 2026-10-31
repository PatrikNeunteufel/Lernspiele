# Changelog — Lernspiele

## 2026-10-31 — LERN_Session1
- Projekt eingerichtet: CLAUDE.md (Gestaltungsregeln, Steckbrief), docs/HANDOVER.md, Ordnerstruktur.
- Lernziele 4.2 Stellenwert / Ziffern und Zahlen erfasst (docs/lernziele/4-2_stellenwert.md).
- Entscheid LERN-1: HTML/CSS/JS ohne Build-Schritt.
- Gemeinsamer Spielrahmen spiele/gemeinsam/ (stil.css, spiel.js) und Startseite index.html.
- Spiele 4.2-G2 Zahlen-Baukasten, 4.2-G3 Tabellen-Post, 4.2-G5 Zahlen-Hüpfer.
- Spiele 4.2-G1 Stellen-Detektiv, 4.2-G4/E2 Ziffernkarten (zwei Stufen), 4.2-E1 Zahlenrätsel-Tresor,
  4.2-E3 Punkte-Schieber; Startseite verlinkt alle acht Lernziele.
- Rahmen: Direktstart einer Stufe per `?stufe=<id>`; Eule über der Aufgabe; Handy-Layout (375 px).
- Entscheid LERN-5 b: Spielerwahl, Profil (Alter, Klasse, Fokus) und Protokoll je Runde, nur im Browser.
- Fünf-Stufen-Skala für alle Spiele (1 Einsteiger ab 2. Klasse … 5 Profi); alle sieben Spiele umgebaut.
- Katalog `spiele/gemeinsam/katalog.js`; neue Startseite mit Filter Thema/Stufe/Fokus und Stufenknöpfen.
- Statistik `statistik.html` mit Stand je Lernziel, Vergleich der Kinder, Verlauf, Sichern/Einlesen.
- `.gitignore` für gesicherte Spielerdaten.
- Stellenfarben wie Calcularis (E rot, Z blau, H grün, ab T wiederholt); Deko-Farben getrennt.
- Profil-Einstellung „Reihenfolge der Teile“ (nach Stufe / geordnet / gemischt), global und je Spiel;
  Baukasten und Tresor beachten sie; Protokoll vermerkt sie je Runde.
- Spielideen aus dem Lehrplan Volksschule SG (74 Ideen, 7 Fächer, Top 15): docs/spielideen/lehrplan_sg_spielideen.md.
- Fix: Schlusstext „fast alles richtig“ erschien auch bei 0 Fehlern; jetzt je Fehlerzahl.
- Zeitmessung je Aufgabe (Protokoll `aufgabenZeiten`); zuschaltbarer Timer mit Vorgabezeiten im Katalog,
  Einstellung im Spiel und im Profil (global, Faktor, je Spiel und Stufe, Vorschlag aus eigenen Zeiten).
- `spiele/gemeinsam/auswertung.js` und Statistik: Vorschläge, Lernzeiten, Konzentration.
- Neue Spiele: Einmaleins-Blitz, Rechen-Rakete (MA.1.A.3), Wortarten-Sortierer (D.5.D.1), Regel-Lücke
  (D.5.E.1); Themen Rechnen, Wortarten, Rechtschreibung; Lehrplan-Lernziele im Katalog.
- Prüfliste der Deutsch-Wortlisten (docs/pruefung/), erzeugt mit tools/pruefliste_wortlisten.js.
- Git (lokal, von Visual Studio angelegt): `.gitignore` schliesst `.vs/`, `material/` und Fotos aus.
- Neue Spiele: Runden-Rutsche (MA.1.A.4), Zahlenstrahl-Pfeil (MA.1.A.2), Zahlenmauer-Baumeister
  (MA.1.B.1), Rest-Rätsel (MA.1.B.2), Jahreskreis-Ordner (NMG.9.1); Themen „Zahlen ordnen“ und „Zeit“.
- Fix Zahlenmauer: Stufe 5 hatte unlösbar viele Lücken (Endlosschleife); jetzt höchstens 6, Generator begrenzt.
- Neue Spiele: Uhr-Werkstatt, Kiosk-Kasse, Masse-Umwandler (MA.3.A.1, MA.3.A.2); Thema „Grössen“.
- Neue Spiele: Spiegel-Raster (MA.2.A.2), Koordinaten-Schatzsuche (MA.2.C.4); Thema „Form und Raum“.
- Neue Spiele: Satz-Reparatur und Wörter-Trenner (D.4.F.1), English Word-Match (FS1E.5.B.1),
  Vergleichs-Krokodil (MA.1.A.1/2), Himmels-Forscher (NMG.4.5); Themen Sätze, Englisch, Himmel;
  Prüfliste um Sätze und englische Wörter erweitert.
- Session-Abschluss: Report docs/report/LERN_Session1_2026-10-31.md, Handover mit Stand und Plan.

## 2026-10-31 — LERN_Session2
- Wortarten-Sortierer: das Wort fliegt schräg in den gewählten Korb (`LS.fliegen`).
- Zehn Spiele: Zehner-Ergänzer, Silben-Klatscher, Reim-Paare, ABC-Sortierer, Tier-Sortierer,
  Lebensraum-Zuordnung, Fledermaus-Forscher, Noten-Namen, Rhythmus-Leser, Hoch-Tief-Ohr.
- Zwanzig Spiele ab der 1. Klasse: Punkte-Blitz, Zahlenhaus, Doppel-Spiegel, Zahlen-Waage,
  Muster-Fortsetzer, Formen-Detektiv, Schätz-Waage, Flächen-Pixel, Rechengeschichten, Anlaut-Angel,
  Buchstaben-Zwillinge, Blitzlesen, Nomen-Puzzle, Lese-Detektiv, Lebenszyklus-Puzzle, Körper-Puzzle,
  Znüni-Teller, Magnet-Labor, Schwimmt oder sinkt?, Instrumenten-Kenner. Sieben neue Themen.
- Rahmen: `LS.auswahl`, `LS.reihenfolge`, `LS.koerbe`, `ctx.vorbei()`; `noten.js` für Noten und Töne.
- Entscheid: Stufenskala mit Basisklasse je Spiel (1 tiefer · 2 leichter · 3 Klassenziel · 4 schwerer ·
  5 höher · 6 Königsstufe); alle 56 Spiele umgebaut, Katalog mit `klasse`, CLAUDE.md nachgeführt.
- Testskript `tools/pruefe_spiele.js` mit Ersatz-DOM; 336 Kombinationen ohne Fehler.
- Behoben: Hinweise, die die Lösung verrieten (über zehn Stellen); mehrdeutige Aufgaben; Rechen-Rakete
  Stufen 3/4; Zahlenmauer-Zahlenraum; Satz-Reparatur akzeptiert Punkt bei Aussagen mit Nachdruck.
- Statistik: Dateiname mit Namen; Spielstand zurücksetzen; Einlesen führt zusammen (Entscheid a).
- Handy: Punkte-Blitz und Zahlen-Waage passen in 375 px; README.md; Prüfliste Teil 5–21.
- Session-Abschluss: Report docs/report/LERN_Session2_2026-10-31.md, Handover neu gefasst.
