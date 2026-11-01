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

## 2026-10-31 — LERN_Session3
- Prüfer „Hinweis verrät die Lösung“ (LERN-19) im Testskript; neun verratende Hinweise korrigiert.
- Testhilfen 🔑/⏭ und `ctx.loesung()` in allen Spielen; Testspieler später in der Rolle Aufsicht (L2 a).
- Neun Spiele zum OP 4. Klasse (T3 a), Preis-Tabelle statt Folgen-Fortsetzer.
- Vergleichs-Krokodil: Schlusskarte (Klassenkonflikt `.mitte`); Prüfung reservierter Rahmen-Klassen,
  `LS.RAHMEN_KLASSEN`, `docs/rahmen.md` (R1 a).
- Startseite als eine Seite mit Tabs, Anmeldung mit Aufsicht und PIN, Fach-Gruppen, Favoriten,
  Kompaktansicht, Verwaltung (L1 a – L3 a); `start/`, `statistik.html` leitet um.
- Prüfstand und Freigabe je Spiel und Inhaltsliste (L4 a): 162 Listen, Verweise `von`, Zusatzlisten;
  standardmässig frei, was nichts zu prüfen hat; Annahmen sperren nicht (F1 a).
- Wiederholungsregel je Runde, `ctx.kennung()`; Checkliste `docs/checkliste.md` (`tools/checkliste.js`).
- 19 weitere Spiele (G1 a), Sprachausgabe für Englisch (G2 a, `LS.spielMitStimme`).
- Endlos-Modus mit Rekorden und Rangliste in 34 Spielen; mit Timer gleiche Startzeit für alle und
  je Aufgabe 4 % knapper (Untergrenze 40 %); vollständige Ranglisten ohne/mit Timer im Startbild.
- Spielkarte: Schalter ⏱ ♾ ⭐ als SVG (aus grau, an gold), Tipp auf die Karte öffnet das Startbild;
  Lernziel-Kürzel blenden beim Antippen ihren Klartext ein.
- Prüfliste Teile 22–39; Lernziele in docs/lernziele/lehrplan_sg_session3.md.
- Session-Abschluss: Report docs/report/LERN_Session3_2026-10-31.md, Handover nachgeführt.

## 2026-10-31 — LERN_Session4
- Endlos-Timer (Entscheide F1 a, F2 a): Die Zeit nähert sich einem Boden je Aufgabe (1,2 s + 0,5 s je
  Handgriff + Wartezeit), je richtige Aufgabe fallen 8 % der restlichen Spanne weg; ersetzt
  „4 % knapper, Untergrenze 40 % und 3 s“. Anzeige auf Zehntelsekunden, unter 10 s mit Komma.
- Rahmen: `ctx.schritte(n)`, `ctx.wartezeit(s)`, `LS.tippSchritte(wert)`; die Bausteine zählen ihre
  Handgriffe selbst; der Timer startet erst, wenn die Aufgabe gezeichnet ist.
- Alle 34 Endlos-Spiele nennen ihre Handgriffe je Aufgabe; Hoch-Tief-Ohr dazu die Abspielzeit.
- Testskript: Endlos-Aufgaben ohne `ctx.schritte` und mit weniger Klicks gelöste Aufgaben sind Fehler;
  die Übersicht zeigt die Handgriffe je Stufe. `docs/rahmen.md` Abschnitte 4.2, 4.3, 7, 8.
- `.claude/launch.json`: dritte Vorschau `lernspiele-3` auf Port 8769.
- Behoben: Endlos-Runden zählten erst beim Antippen von „Zum Ergebnis“; jetzt sofort beim Rundenende
  gespeichert (einmal je Runde). Das Testskript prüft es.
- Endlos (Entscheid E1 a): Verlassen mitten in der Serie (`pagehide`, `visibilitychange`) speichert sie
  als Zwischenstand mit `abgebrochen: true`; Weiterspielen ersetzt ihn. Testskript stellt das Verlassen nach.
- Stellen-Detektiv (Entscheid SD1 a): Stufen 1–3 fragen nur „Wie heisst die Stelle unter der Lupe?“
  (Lernziel G1), umgekehrt erst ab Stufe 4 (bisher wegen der Umstellung auf sechs Stufen auch in Stufe 1).
  Königsstufe zufällig, höchstens drei Aufgaben derselben Richtung hintereinander.
- Serienbremse im Rahmen (Vorgabe Patrik 2026-11-01): `ctx.serie(name, wert)` meldet zufällige Merkmale
  (Richtung, Aufgabenart, Antwort bei wenigen festen Antworten); der Rahmen zieht neu statt eines vierten
  gleichen in Folge (`LS.SERIE_MAX` = 3). Testskript prüft Serien je Runde.
- 75 Spiele melden ihre zufälligen Merkmale mit `ctx.serie` (Richtung, Aufgabenart, Antwort bei
  höchstens drei festen Antworten); Inhaltslisten-Spiele melden nur in Stufen, deren freie Listen
  mehrere Werte hergeben.
- Session-Abschluss: Report docs/report/LERN_Session4_2026-10-31.md, Handover nachgeführt
  (LERN-25 bis LERN-27). Gesamtlauf des Testskripts ohne Fehler.

## 2026-11-01 — LERN_Session5
- Name der Sammlung „Eulenpfad“ (Entscheid N1 a): Startseite, Statistik-Titel, README, CLAUDE.md.
  Swissreg ohne Treffer; technische Namen (`lernspiele:*`, `lernspiele-*.json`) bleiben.
- Zufallsmix (Entscheid M1 a): `mix.html`, `mix/mix.js`, `mix/mix.css`, Einstieg oben im Tab Spiele.
  Bis zu sechs Spiele in einer Runde (10 oder 20 Aufgaben) oder endlos; Fach, Fokus, Stufe („passend“
  oder fest), Timer, Wechsel nach 1 oder 3 Aufgaben. Die Spiele laufen unverändert im iframe
  (`?mix=1`), der Mix führt Serie, Protokoll (je Spiel mit `mix`) und Rekord (`mix:<Auswahl>`).
- Rahmen: Mix-Betrieb in `runde`, `body.im-mix`, `LS.tonSchalter`, `LS.rangliste`, weitere Exporte;
  `FAECHER` im Katalog. Statistik zeigt Mix-Rekorde und Mix-Runden.
- Punkte-Schieber: Ablauf beginnt nach 8 Aufgaben von vorn (stürzte im Mix bei der 9. ab).
- Testskript: jedes Spiel im Mix (`--mix=0` schaltet ab), Ausnahmen auch im Mix-Zweig;
  `docs/rahmen.md` Abschnitte 8 und 9.
- Session-Abschluss: Report docs/report/LERN_Session5_2026-11-01.md, Handover nachgeführt
  (LERN-9 erledigt, LERN-28 bis LERN-30 neu). Zwei Gesamtläufe des Testskripts ohne Fehler.

## 2026-11-01 — LERN_Session6
- Reihenfolge der Teile direkt im Spiel (Entscheid R1 a): Schalter „🔀 Teile: nach Stufe / geordnet /
  gemischt“ auf der Stufenwahl von Zahlen-Baukasten und Zahlenrätsel-Tresor; schreibt die Wahl je
  Spiel wie das Profil (`setzeReihenfolgeSpiel` in `spiel.js`, Klassen `reihenfolge-zeile`,
  `reihenfolge-schalter`).
- Fix: Die Wahl je Spiel „nach Stufe“ schlug eine globale Wahl „immer geordnet/gemischt“ nicht; jetzt
  gilt je Spiel vor global für alle drei Werte (`reihenfolgeFuer`).
- Durchgesehen: Die übrigen Stellenwert-Spiele zeigen keine Teile, die man mischen sollte (Tabellen und
  Ziffernkarten haben eine feste Ordnung); kein weiteres Spiel mit `reihenfolge: true`.
- Filter „🎒 Meine Klasse“ im Tab Spiele (Entscheide K1 a, K2 a): für Kinder mit Klasse im Profil,
  vorgegeben an, abschaltbar (Profil-Feld `meineKlasse`); zeigt Spiele mit Basisklasse ±1 (Klasse 2:
  48 von 84 Spielen, Klasse 4: 46 von 84, jeweils vor der Freigabe).
- Abgleich zwischen Geräten (Entscheid S1 a, rahmen.md Abschnitt 10): Ordner je Gerät in der Verwaltung,
  eigene Datei `lernspiele-sync-<id>.json` je Gerät, Abgleich beim Öffnen und nach jeder Änderung; ohne
  Ordner über eine Abgleich-Datei. Neu `spiele/gemeinsam/abgleich.js`, auf allen 86 Seiten geladen.
- `LS.zusammenfuehren` erweitert: Rekorde mit höherem Stand ersetzen den Zwischenstand, Profile je Feld
  nach Zeitstempel (`geaendert`), Löschvermerke (`lernspiele:geloescht`), Freigabe nach
  `lernspiele:freigabeStand`. Das Einlesen in der Statistik nutzt dasselbe.
- Datenregel LERN-5 b in CLAUDE.md um den Abgleich-Ordner ergänzt; LERN-31 (echte Geräte) im Handover.
- Verwaltung in Untertabs Konten, Freigabe und Abgleich (`#verwaltung/<untertab>`, Klasse `untertabs`
  in start.css). Freigabe je Fach zuklappbar mit „x von y frei · z zu prüfen“; offene Fächer merkt
  sich das Gerät (`lernspiele:verwaltungOffen`, nicht abgeglichen).
- Ordner für die Reihe (Entscheid P1 a): App nach `eulenpfad/` (index.html, mix.html, statistik.html,
  spiele/, start/, mix/), Eulenpfad-Doku nach `docs/eulenpfad/`; `docs/konzept_reihe_eulenpfad.md`
  bleibt in `docs/`. Werkzeuge, README, CLAUDE.md (Steckbrief) und rahmen.md auf die neuen Pfade;
  Checkliste neu erzeugt (nur Pfade geändert), Prüfliste unverändert.
- Veröffentlichen (Entscheid P2 a): Einstiegsseite `portal/index.html` (Eulenpfad, Lernsteig und
  Gratwanderung „in Planung“) und `.github/workflows/pages.yml`: stellt nur Einstiegsseite und
  App-Ordner in derselben Ordnerstruktur wie im Repo zusammen (Wurzel leitet auf `portal/` weiter,
  damit `../eulenpfad/` lokal und online gilt), bricht bei Spielerdaten oder Fotos ab, startet nur
  von Hand (LERN-17).
