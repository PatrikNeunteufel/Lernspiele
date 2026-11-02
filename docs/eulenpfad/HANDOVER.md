# Handover — Eulenpfad (Ordner Lernspiele)

## Stand
**2026-11-02, nach LERN_Session7** ([Report](report/LERN_Session7_2026-11-01.md)):
- **Reihe und Ordner** (P1 a, P2 a): App in `eulenpfad/`, Doku in `docs/eulenpfad/`; Grundgerüste
  `lernsteig/`, `gratwanderung/` (Handover in `docs/lernsteig/`, `docs/gratwanderung/`); Einstiegsseite
  `portal/`. **Online** unter patrikneunteufel.github.io/Lernspiele/ (Pages bei jedem Push, der eine App
  ändert; W1 a).
- **Spiele:** 91 Spiele in 31 Themen, je sechs Stufen zur Basisklasse. Plan 1.–4. Klasse vollständig
  (1.: 10, 2.: 28, 3.: 11, 4.: 37); 5./6. Klasse: Plan in `spielideen/lehrplan_sg_5-6.md` (52 Ideen),
  gebaut Bruch-Pizzeria (5), Mittelwert-Türme (5), Teiler-Spürnase (6), Überschlags-Radar (6),
  Velo-Tabelle (6) in LERN_Session7.
- **Anleitungen** für Erwachsene und Kinder in `eulenpfad/anleitung/`, vom Portal verlinkt; Bilder neu mit
  `node tools/anleitung_bilder.js` (Server auf Port 8765 nötig), nach Änderungen an der Oberfläche.
- **Einstellungen der Aufsicht** je Gerät (Verwaltung → Einstellungen): Dezimalzeichen global und je
  Spiel, Standard Punkt (`LS.dezimalText`); Geld nach Klasse der Stufe (`LS.geldText`, C1 a).
  Klasseneinstellungen durch Lehrpersonen nur als Konzept: `konzept_klasseneinstellungen.md` (F1–F8).
- **Statistik:** Karte „Vorgehen“ (`ctx.vorgehen`), heute für Möglichkeiten-Finder, Teiler-Spürnase,
  Mittelwert-Türme.
- **Prüfstand** in `eulenpfad/spiele/gemeinsam/pruefstand.js`, gesetzt im **Entwickler-Modus**
  (`python tools/entwickler_server.py`, Schlüssel in `entwickler.key`, rahmen.md Abschnitt 11):
  2 von 35 neuen Spielen angesehen, 3 von 166 Inhaltslisten geprüft; für Kinder frei 34 von 91.
  Bemerkungen in `docs/eulenpfad/bemerkungen.json` (heute leer).
- **Abgleich zwischen Geräten** (S1 a, rahmen.md Abschnitt 10): Ordner je Gerät oder Abgleich-Datei;
  auf echten Geräten ungeprüft (LERN-31).
- **Bedienung:** Suche mit Rangfolge (SU1 a), Filter „Meine Klasse“ (K1 a, K2 a) und „Zu prüfen“,
  Verwaltung mit Untertabs, Spieloptionen auf der Stufenwahl (Reihenfolge R1 a, Übertrag UE1 a).
- **Tests:** `node tools/pruefe_spiele.js` — alle Spiele × Stufen, Endlos, Inhaltslisten als Kind, Mix,
  zehn Beispielsuchen, Hinweis „Einzahl?“, Namen (doppelt = Fehler, Grundwort > 2 = Hinweis). Stand
  2026-11-02: „Keine Fehler.“, 11 bekannte Hinweise „zu wenig verschiedene Aufgaben“, Grundwörter
  Detektiv, Sortierer, Puzzle über der Grenze.
- **Datenschutz:** Scan von Arbeitsbaum, Pages-Auslieferung und Git-Historie ohne Funde (D2 a, D3 a).
- **Offen:**
  - Noch kein Kind hat gespielt; Spiele ansehen und Listen prüfen (LERN-21, LERN-11).
  - Schweiz-Karten-Suche ohne Seen, Flüsse, Gebirge (eigener swisstopo-Datensatz).
  - Grundzeit und Schrittzeit des Endlos-Bodens sind Annahmen bis zur Testrunde (LERN-4).

**Nächste Session — Plan:**
1. Offene Bemerkungen aus `docs/eulenpfad/bemerkungen.json` abarbeiten.
2. Die fünf neuen Spiele der 5./6. Klasse im Entwickler-Modus ansehen und freigeben (LERN-21).
3. 5./6. Klasse weiter nach `docs/eulenpfad/spielideen/lehrplan_sg_5-6.md`: M3–M5 mit Dezimalzahlen
   (LERN-36), dann die übrigen Top 15.
4. Umbenennen der Grundwörter Detektiv, Sortierer, Puzzle vorschlagen (LERN-35).
5. LERN-34 (Entscheide F1–F8 Klasseneinstellungen), LERN-31, LERN-4, LERN-33, LERN-11.

Technik: HTML/CSS/JS ohne Build (Entscheid LERN-1). Vertrag zwischen Rahmen und Spielen: [rahmen.md](rahmen.md).
Übersicht aller Spiele und was zu prüfen ist: [checkliste.md](checkliste.md) (erzeugt mit `node tools/checkliste.js`). Gemeinsamer Rahmen `spiele/gemeinsam/`:
`spiel.js` (Stufenskala mit Basisklasse, Spieler/Profil/Protokoll, Stufenwahl, Timer, Zeitmessung,
Eule, Tastatur, Sterne; Bausteine `LS.auswahl`, `LS.reihenfolge`, `LS.koerbe`, `LS.fliegen`,
`ctx.vorbei()`; `LS.loescheRunden`, `LS.zusammenfuehren`), `katalog.js` (Themen, Spiele mit
Basisklasse `klasse`, Lernziele, Vorgabezeiten), `auswertung.js` (Lernzeiten, Konzentration,
Vorschläge), `noten.js` (Notensystem als SVG, Töne per WebAudio), `stil.css` (Stellenfarben wie
Calcularis, nur für Stellen).

**Stufenskala** (Entscheid Patrik 2026-10-31, CLAUDE.md): 1 eine Klasse tiefer · 2 leichter ·
3 Klassenziel · 4 schwerer · 5 eine Klasse höher · 6 👑 Königsstufe. Basisklassen je Spiel und
Lehrplan-Zuordnung: [lehrplan_sg_session2.md](lernziele/lehrplan_sg_session2.md),
Stellenwert: [4-2_stellenwert.md](lernziele/4-2_stellenwert.md). Ältere Runden im Protokoll tragen
die alten Stufennummern (bei Bedarf Spielstand zurücksetzen).

**Spiele:** vollständige Liste mit Thema, Basisklasse und Lernzielen in `spiele/gemeinsam/katalog.js`.
Basisklasse 1: Silben, Reime, Punkte-Blitz, Zahlenhaus, Doppel-Spiegel, Zahlen-Waage, Muster,
Formen, Anlaute, Buchstaben · 2: Zahlenmauer, Kalender, Uhr, Kiosk, Spiegeln, Sätze, Zehner-Ergänzer,
ABC, Lebensraum, Fledermaus, Rhythmus, Hoch-Tief, Schätzen, Flächen, Rechengeschichten, Blitzlesen,
Lese-Detektiv, Lebenszyklus, Körper, Znüni, Magnet, Schwimmt/sinkt, Instrumente · 3: Einmaleins,
Rest, Masse, Koordinaten, Wortarten, Regel-Lücke, Himmel, Tiere, Noten, Nomen-Puzzle ·
4: sieben Stellenwert-Spiele (Lernzielblatt 4.2), Rechen-Rakete, Runden, Zahlenstrahl,
Vergleichs-Krokodil, English Word-Match.

Daten nur im Browser (Entscheid LERN-5 b). Statistik: Sichern als `lernspiele-<Namen>-<Datum>.json`,
Einlesen **führt zusammen** (Entscheid Patrik a: doppelte Runden zählen einmal, Profile bleiben),
Spielstand zurücksetzen (alle Spiele oder eines). Timer zuschaltbar, Zeit je Aufgabe gemessen.

Prüfen: `node tools/pruefe_spiele.js [spiel-id …]` (Ersatz-DOM `tools/pruef_dom.js`; Spiele mit
`aufgabeErzeugen`/`pruefeAufgabe` werden zusätzlich fachlich geprüft). Prüfliste neu erzeugen:
`node tools/pruefliste_wortlisten.js > docs/pruefung/wortlisten_zur_pruefung.md`.

Git: lokales Repo in `Lernspiele/` (Branch `master`, kein Remote). Nicht im Repo: `.vs/`, `material/`,
Fotos (`*.jpeg`, `*.jpg`), gesicherte Spielerdaten (`lernspiele-*.json`).

Vorschau: `.claude/launch.json` (`lernspiele` Port 8765, `lernspiele-2` Port 8767). Nach Änderungen
hart neu laden (Strg+F5). Ohne Server per Doppelklick (README). Ungeprüft: Firefox mit `file://`.

## Ordner
- `index.html`, `start/` — Startseite; `mix.html`, `mix/` — Zufallsmix
- `spiele/` — die Spiele (je Spiel ein Unterordner mit Inhaltsdatei), `spiele/gemeinsam/` Rahmen
- `tools/` — Testskript, Ersatz-DOM, Prüfliste
- `docs/lernziele/` — Lernziele und Basisklassen mit Zuordnung Lernziel → Spiel
- `docs/spielideen/` — Spielideen aus dem Lehrplan Volksschule SG
- `docs/pruefung/` — Prüfliste der Inhalte
- `material/<klasse>/` — Vorlagen (Lernzielblätter), nicht im Repo
- `docs/report/` — Session-Reports

## Offene Punkte
| Nr. | Punkt | Status | Einzelheiten |
|---|---|---|---|
| LERN-1 | Technik der Spiele festlegen | erledigt 2026-10-31 (HTML/JS, CLAUDE.md) | Steckbrief *Sprachen* |
| LERN-2 | Spiele 4.2 Stellenwert bauen | erledigt 2026-10-31 (LERN_Session1, 8 von 8) | docs/eulenpfad/lernziele/4-2_stellenwert.md |
| LERN-3 | Thema/Lernzielblatt 2. Klasse | offen | noch kein Material |
| LERN-4 | Test mit den Kindern; Schwierigkeit und Hinweise nachschärfen | in Arbeit seit 2026-10-31 (LERN_Session1, erste Rückmeldung umgesetzt) | Report LERN_Session2, Plan |
| LERN-5 | Fortschritt protokollieren mit Namen | erledigt 2026-10-31 (LERN_Session1, Entscheid b) | CLAUDE.md Gestaltungsregeln |
| LERN-6 | Schreibweise vierstelliger Zahlen („4500“ / „4 500“) mit Lehrmittel abgleichen | offen | Lehrplan SG schreibt „320'000“ (MA.1.A.3.e), das Lernzielblatt „30 400“ |
| LERN-7 | Farben je Stelle nach Calcularis | erledigt 2026-10-31 (LERN_Session1) | CLAUDE.md Gestaltungsregeln |
| LERN-8 | Einstellung Reihenfolge der Teile je Spiel oder je Spieler | erledigt 2026-10-31 (LERN_Session1) | Profil auf der Startseite |
| LERN-9 | Mischspiel über mehrere Themen, gewichtet nach Fokus | erledigt 2026-11-01 (LERN_Session5, Zufallsmix; Fokus als Filter, nicht als Gewicht) | rahmen.md Abschnitt 9, mix/ |
| LERN-10 | Spielideen aus dem Lehrplan Volksschule SG, alle Fächer 1.–6. Kl. | erledigt 2026-10-31 (LERN_Session1) | docs/spielideen/lehrplan_sg_spielideen.md |
| LERN-11 | Inhaltslisten prüfen lassen | offen (Prüfung durch Patrik oder Lehrperson, Entscheid a) | docs/pruefung/wortlisten_zur_pruefung.md (Teile 1–39); geprüfte Listen im Katalog `geprueft` |
| LERN-12 | Timer, Zeitmessung und didaktische Statistik | erledigt 2026-10-31 (LERN_Session1) | spiel.js, auswertung.js, statistik.html |
| LERN-13 | Weitere Spiele aus den Spielideen | in Arbeit seit 2026-10-31 (LERN_Session2); 84 Spiele gebaut, 3 Ideen offen | checkliste.md; offen Tipp-Trainer, Schweiz-Karten-Suche (Kartendaten/Lizenz), Mots-Match |
| LERN-14 | Testskript für die Aufgabengeneratoren aller Spiele (Node) | erledigt 2026-10-31 (LERN_Session2) | tools/pruefe_spiele.js |
| LERN-15 | Stufenskala mit Basisklasse und Königsstufe | erledigt 2026-10-31 (LERN_Session2, Entscheid Patrik) | CLAUDE.md; docs/lernziele/lehrplan_sg_session2.md |
| LERN-16 | Spielstand zurücksetzen und zwischen Geräten abgleichen | erledigt 2026-10-31 (LERN_Session2, Entscheid a: Zusammenführen) | statistik.html, LS.zusammenfuehren |
| LERN-17 | Veröffentlichen über GitHub Pages | erledigt 2026-11-01 (LERN_Session6, online unter patrikneunteufel.github.io/Lernspiele/) | `.github/workflows/pages.yml`, Entscheide P1 a, P2 a, W1 a; Datenschutz-Scan im CHANGELOG |
| LERN-18 | Kiosk-Kasse Stufe 3–4 (Franken/Rappen) auf Basisklasse 2 prüfen | offen | docs/lernziele/lehrplan_sg_session2.md, Bekannte Grenzen |
| LERN-19 | Prüfer: Hinweis verrät die Lösung automatisch erkennen | erledigt 2026-10-31 (LERN_Session3) | tools/pruefe_spiele.js, LS.pruefung.haken |
| LERN-20 | Testspieler und Testhilfen (Entscheid T1 a, T2 a) | erledigt 2026-10-31 (LERN_Session3; heute Rolle Aufsicht, L2 a) | spiel.js (ctx.loesung), rahmen.md Abschnitt 6 |
| LERN-21 | 28 neue Spiele und die Startseite auf Desktop, Tablet und Handy ansehen | offen | checkliste.md |
| LERN-22 | Startseite mit Anmeldung, Tabs, Gruppen, Favoriten; Rollen Kind/Aufsicht mit PIN (L1–L3 a) | erledigt 2026-10-31 (LERN_Session3), im Browser noch nicht angesehen | rahmen.md Abschnitt 6, start/ |
| LERN-23 | Prüfstand und Freigabe je Spiel und Inhaltsliste (L4 a) | erledigt 2026-10-31 (LERN_Session3) | katalog.js (geprueft, listen), Tab Verwaltung |
| LERN-24 | Checkliste Klasse → Fach → Thema → Spiel | erledigt 2026-10-31 (LERN_Session3) | checkliste.md, tools/checkliste.js |
| LERN-25 | Endlos-Timer: Boden je Aufgabe aus Handgriffen (F1 a, F2 a); Konstanten eichen | in Arbeit seit 2026-10-31 (LERN_Session4); gebaut, Eichung nach LERN-4 | rahmen.md Abschnitt 7, `ENDLOS_TEMPO` in spiel.js |
| LERN-26 | Serienbremse für zufällige Merkmale (`ctx.serie`, höchstens 3 gleiche) | erledigt 2026-11-01 (LERN_Session4) | rahmen.md Abschnitt 4.2; Grenzfälle im Report LERN_Session4 |
| LERN-27 | Gewöhnliche Runde erst nach „Weiter“ gespeichert, wenn die Eule die letzte Aufgabe auflöst | offen (Entscheid Patrik) | Report LERN_Session4, Offene Punkte |
| LERN-28 | Statistik und Empfehlungen ausbauen (Können-Wert, Fehlermuster, Wiedervorlage, Prüfungsplan, Bericht) | offen (Entscheid Patrik) | Report LERN_Session5, Recherche |
| LERN-29 | Name „Eulenpfad“: Markenrecherche EU (TMview) und Domain vor der Veröffentlichung | offen | Report LERN_Session5; Swissreg ohne Treffer |
| LERN-30 | Zufallsmix in Safari/iPad und Firefox prüfen; Leiste auf dem Handy (drei Zeilen) | offen | rahmen.md Abschnitt 9 |
| LERN-31 | Abgleich-Ordner auf den echten Geräten prüfen (`file://`, Netzwerk- und Cloud-Ordner, iPad/Android nur Datei) | in Arbeit seit 2026-11-01 (LERN_Session6); gebaut, nur auf localhost geprüft | rahmen.md Abschnitt 10 |
| LERN-32 | Lehrplan SG 5./6. Klasse auswerten, Spielideen mit Basisklasse 5/6 (Entscheid P56 a) | erledigt 2026-11-01 (LERN_Session7, 52 Ideen, Top 15) | docs/eulenpfad/spielideen/lehrplan_sg_5-6.md; Auswahl offen |
| LERN-33 | Schweiz-Karten-Suche: Seen, Flüsse, Gebirge (swisstopo-Datensatz, Download anfragen) | offen | `tools/karte_schweiz.py`; Report LERN_Session6 |
| LERN-34 | Klasseneinstellungen durch Lehrpersonen | offen (Konzept, Entscheide F1–F8) | docs/eulenpfad/konzept_klasseneinstellungen.md |
| LERN-35 | Grundwörter in Spielnamen über der Grenze (Detektiv 5, Sortierer 4, Puzzle 4) umbenennen | offen (D2 a, später) | Testskript, Namensprüfung; Report LERN_Session7 |
| LERN-36 | Dezimalzahlen-Spiele M3–M5 und Eingabe von Dezimalzahlen; Dezimalzeichen der Zahlenbuch-Neuausgabe | offen | lehrplan_sg_5-6.md Abschnitt 9; Konzept F5 |
