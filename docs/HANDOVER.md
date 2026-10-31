# Handover — Lernspiele

## Stand
**2026-10-31, nach LERN_Session3** ([Report](report/LERN_Session3_2026-10-31.md)):
- **Spiele:** 84 Spiele in 28 Themen, je sechs Stufen bezogen auf eine Basisklasse. Neu in dieser
  Sitzung: 28 Spiele (9 zum Orientierungspunkt der 4. Klasse, 19 aus den übrigen Ideen), siehe
  [lehrplan_sg_session3.md](lernziele/lehrplan_sg_session3.md). Offen sind noch 3 Ideen.
- **Tests:** `node tools/pruefe_spiele.js` prüft alle 504 Kombinationen Spiel × Stufe, dazu den
  Endlos-Modus und jede Inhaltsliste als Kind. Neu prüft das Skript:
  - Hinweise, die die Lösung verraten (LERN-19);
  - die Testhilfen;
  - Rahmen-Klassen, die ein Spiel im eigenen Stil umdefiniert.
- **Startseite neu** (Entscheide L1 a bis L4 a, [rahmen.md](rahmen.md) Abschnitt 6):
  - Anmeldung: Kinder ohne PIN, die Aufsicht mit PIN.
  - Tabs: Spiele, Profil, Statistik, Verwaltung.
  - Spiele nach Fach und Thema auf- und zuklappbar, Favoriten, Kompaktansicht.
  - Die Aufsicht spielt als Tester, mit Testhilfen und mit Runden, die nicht zählen.
- **Freigabe:** Standardmässig frei ist, was nichts mehr zu prüfen hat. Gesperrt sind die 28 neuen
  Spiele (`neu`, bis angesehen) und Spiele, deren Inhaltslisten alle ungeprüft sind (162 Listen,
  gemeinsam genutzte als Verweis). Heute für Kinder frei: 32 von 84 Spielen.
- **Wiederholungen:** In einer Runde höchstens eine Aufgabe ein zweites Mal, nie direkt
  hintereinander; kleine Stufen haben kürzere Runden.
- **Endlos-Modus:** 34 Spiele, die ihre Aufgaben berechnen, bis zum ersten Fehler, mit oder ohne
  Timer; Rekorde und Rangliste (rahmen.md Abschnitt 7).
- **Sprachausgabe:** `LS.sprich`, `LS.spielMitStimme` (Listen & Tap, Spelling-Bee); britische Stimme
  bevorzugt, ohne Stimme keine Runde.
- **Offen:**
  - Inhalte und Spiele prüfen; Stand in [checkliste.md](checkliste.md).
  - Noch kein Kind hat gespielt.
  - Die neue Startseite und die neuen Spiele hat noch niemand im Browser angesehen.
  - Der letzte Teil von Session 3 (zweites Paket, Endlos, Sprachausgabe) ist nicht committet.

**Nächste Session — Plan:**
1. Startseite und die 28 neuen Spiele auf Desktop, Tablet und Handy ansehen, dazu die
   Sprachausgabe auf dem Tablet der Kinder. Danach im Katalog
   `geprueft` eintragen und die Checkliste neu erzeugen.
2. LERN-11: die Prüfliste einarbeiten; geprüfte Listen im Katalog `geprueft`.
3. LERN-4: Testrunde mit den Kindern.
4. Vor LERN-17 (GitHub Pages): Datenschutz-Scan des Repos.

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
| LERN-2 | Spiele 4.2 Stellenwert bauen (Prüfung Do 05.11.26) | erledigt 2026-10-31 (LERN_Session1, 8 von 8) | docs/lernziele/4-2_stellenwert.md |
| LERN-3 | Thema/Lernzielblatt 2. Klasse | offen | noch kein Material |
| LERN-4 | Test mit den Kindern; Schwierigkeit und Hinweise nachschärfen | in Arbeit seit 2026-10-31 (LERN_Session1, erste Rückmeldung umgesetzt) | Report LERN_Session2, Plan |
| LERN-5 | Fortschritt protokollieren mit Namen | erledigt 2026-10-31 (LERN_Session1, Entscheid b) | CLAUDE.md Gestaltungsregeln |
| LERN-6 | Schreibweise vierstelliger Zahlen („4500“ / „4 500“) mit Lehrmittel abgleichen | offen | Lehrplan SG schreibt „320'000“ (MA.1.A.3.e), das Lernzielblatt „30 400“ |
| LERN-7 | Farben je Stelle nach Calcularis | erledigt 2026-10-31 (LERN_Session1) | CLAUDE.md Gestaltungsregeln |
| LERN-8 | Einstellung Reihenfolge der Teile je Spiel oder je Spieler | erledigt 2026-10-31 (LERN_Session1) | Profil auf der Startseite |
| LERN-9 | Mischspiel über mehrere Themen, gewichtet nach Fokus | später | Profil-Fokus ist dafür angelegt |
| LERN-10 | Spielideen aus dem Lehrplan Volksschule SG, alle Fächer 1.–6. Kl. | erledigt 2026-10-31 (LERN_Session1) | docs/spielideen/lehrplan_sg_spielideen.md |
| LERN-11 | Inhaltslisten prüfen lassen | offen (Prüfung durch Patrik oder Lehrperson, Entscheid a) | docs/pruefung/wortlisten_zur_pruefung.md (Teile 1–39); geprüfte Listen im Katalog `geprueft` |
| LERN-12 | Timer, Zeitmessung und didaktische Statistik | erledigt 2026-10-31 (LERN_Session1) | spiel.js, auswertung.js, statistik.html |
| LERN-13 | Weitere Spiele aus den Spielideen | in Arbeit seit 2026-10-31 (LERN_Session2); 84 Spiele gebaut, 3 Ideen offen | checkliste.md; offen Tipp-Trainer, Schweiz-Karten-Suche (Kartendaten/Lizenz), Mots-Match |
| LERN-14 | Testskript für die Aufgabengeneratoren aller Spiele (Node) | erledigt 2026-10-31 (LERN_Session2) | tools/pruefe_spiele.js |
| LERN-15 | Stufenskala mit Basisklasse und Königsstufe | erledigt 2026-10-31 (LERN_Session2, Entscheid Patrik) | CLAUDE.md; docs/lernziele/lehrplan_sg_session2.md |
| LERN-16 | Spielstand zurücksetzen und zwischen Geräten abgleichen | erledigt 2026-10-31 (LERN_Session2, Entscheid a: Zusammenführen) | statistik.html, LS.zusammenfuehren |
| LERN-17 | Veröffentlichen über GitHub Pages | offen (Patrik) | vorher Datenschutz-Scan; Anleitung im Chat LERN_Session2 |
| LERN-18 | Kiosk-Kasse Stufe 3–4 (Franken/Rappen) auf Basisklasse 2 prüfen | offen | docs/lernziele/lehrplan_sg_session2.md, Bekannte Grenzen |
| LERN-19 | Prüfer: Hinweis verrät die Lösung automatisch erkennen | erledigt 2026-10-31 (LERN_Session3) | tools/pruefe_spiele.js, LS.pruefung.haken |
| LERN-20 | Testspieler und Testhilfen (Entscheid T1 a, T2 a) | erledigt 2026-10-31 (LERN_Session3; heute Rolle Aufsicht, L2 a) | spiel.js (ctx.loesung), rahmen.md Abschnitt 6 |
| LERN-21 | 28 neue Spiele und die Startseite auf Desktop, Tablet und Handy ansehen | offen | checkliste.md |
| LERN-22 | Startseite mit Anmeldung, Tabs, Gruppen, Favoriten; Rollen Kind/Aufsicht mit PIN (L1–L3 a) | erledigt 2026-10-31 (LERN_Session3), im Browser noch nicht angesehen | rahmen.md Abschnitt 6, start/ |
| LERN-23 | Prüfstand und Freigabe je Spiel und Inhaltsliste (L4 a) | erledigt 2026-10-31 (LERN_Session3) | katalog.js (geprueft, listen), Tab Verwaltung |
| LERN-24 | Checkliste Klasse → Fach → Thema → Spiel | erledigt 2026-10-31 (LERN_Session3) | checkliste.md, tools/checkliste.js |
