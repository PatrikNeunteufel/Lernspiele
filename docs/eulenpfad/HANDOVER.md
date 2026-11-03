# Handover — Eulenpfad (Ordner Lernspiele)

## Stand
**2026-11-03, nach LERN_Session10** ([Report](report/LERN_Session10_2026-11-03.md)):
- **Spiele:** 165 (15 neu: Runde B 3. Klasse T1–T8 und Runde C S8, S9, S14, S15, T9–T11; Lernziele und Annahmen in
  `lernziele/lehrplan_sg_session10.md`). **Beide Ideenlisten sind abgearbeitet** (Checkliste: 0 Ideen offen); der
  Rest deckt sich mit vorhandenen Spielen oder braucht Daten von aussen (N9, N11).
- **Startseite:** Zeile „Nur“ (Meine Klasse, Fokus, Zu prüfen), Thema/Stufe/Klasse als Mehrfachwahl, Karten
  Zufallsmix und Zufälliges Spiel (rahmen.md 6). **Bedarf** (`AUSWERTUNG.bedarf`) gewichtet Zufall, Mix und
  Suche (`LS.passung`); **„🔗 Ähnliche Spiele“** (`LS.aehnlich`) auf Startblatt und Schlusskarte.
- **Lernplan und Erfolge** (L1 a, rahmen.md 15): Wochenziel je Kind, Wochenstern, Tab „🏅 Erfolge“ mit 24
  Abzeichen und Teilen als Bild (Annahme B1: Vorname reist nur auf Knopfdruck mit).
- **Tests:** 2026-11-03 „Keine Fehler.“ über alle 165 Spiele (17 bekannte Hinweise). Teilen auf echtem Gerät offen.

Stand nach LERN_Session9 ([Report](report/LERN_Session9_2026-11-02.md)):
- **Spiele:** 150 (10 neu, Runde A 6. Klasse mit Blick auf den Übertritt; `lernziele/lehrplan_sg_session9.md`,
  Plan in `spielideen/lehrplan_3_und_6.md`, als Nächstes Runde B 3. Klasse). Übertritts-Check im Zufallsmix.
- **Rahmen neu:** Fazit in der Statistik (regelbasiert, fürs Kind nach Freigabe), Fehler melden 🙋 über die
  Aufsicht mit Rückmeldung (rahmen.md Abschnitt 13; Adresse in `eulenpfad/kontakt.js`, noch leer, LERN-40),
  Hilfe ❓ und Tipp 💡 in allen Spielen (Abschnitt 14), Uhr erst wenn das Kind antworten kann (LERN-38).
- **Tests:** 2026-11-02 „Keine Fehler.“ über alle 150 Spiele, jedes Spiel mit Tipps.

Stand nach LERN_Session8 ([Report](report/LERN_Session8_2026-11-02.md)):
- **Spiele:** 140 (49 neu in LERN_Session8: drei Runden 5./6. Klasse und ein Kindergarten-Paket; Lernziele in
  `lernziele/lehrplan_sg_session8.md`). Fach Französisch neu, Thema Wirtschaft, Dezimalzahlen.
- **Kindergarten und Vorlesen** (rahmen.md Abschnitt 12): Klasse 0 = Kindergarten; die Eule liest Aufträge und
  Tipps vor (🗣️, im Spiel automatisch für Kindergarten und 1. Klasse oder nach Einstellung), langes Drücken
  liest Knöpfe, Stufen und Spielkarten vor; 🔇 schaltet alles stumm. 29 Spiele der 1./2. Klasse lesearm.
- **Server:** `server_starten.bat` (tools/server.py, ohne Zwischenspeicher), `entwickler_server_starten.bat`.
- **Tests:** 2026-11-02 „Keine Fehler.“, 15 bekannte Hinweise. Echte Sprachausgabe noch nicht angehört.

Älterer Stand (LERN_Session7):
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
2. Patrik: Annahmen Runde B und C prüfen (LERN-43, `lernziele/lehrplan_sg_session10.md`), neue Spiele ansehen
   und freigeben (LERN-21; der Übertritts-Check braucht freie Spiele der Basisklasse 5/6), Teilen eines
   Abzeichens auf Tablet und Handy prüfen (LERN-46), Vorlesen anhören (LERN-37).
3. Rahmen-Kandidat LERN-45: Baustein „Fragenfolge“ für Spiele mit mehreren Fragen je Aufgabe.
4. Entscheide: Umbenennen Detektiv / Sortierer / Puzzle (LERN-35), Farben rechts vom Komma, Malzeichen
   „·“/„×“, Braille-Finger ohne freie Liste sichtbar (LERN-39); Postfach für Meldungen (LERN-40).
5. Weiter offen: LERN-41, LERN-34, LERN-31, LERN-4, LERN-33.

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
| LERN-13 | Weitere Spiele aus den Spielideen | erledigt 2026-11-03 (LERN_Session10, 165 Spiele; beide Ideenlisten abgearbeitet, Rest deckt sich mit vorhandenen Spielen oder braucht Daten von aussen) | checkliste.md; lehrplan_sg_5-6.md; lehrplan_3_und_6.md |
| LERN-14 | Testskript für die Aufgabengeneratoren aller Spiele (Node) | erledigt 2026-10-31 (LERN_Session2) | tools/pruefe_spiele.js |
| LERN-15 | Stufenskala mit Basisklasse und Königsstufe | erledigt 2026-10-31 (LERN_Session2, Entscheid Patrik) | CLAUDE.md; docs/lernziele/lehrplan_sg_session2.md |
| LERN-16 | Spielstand zurücksetzen und zwischen Geräten abgleichen | erledigt 2026-10-31 (LERN_Session2, Entscheid a: Zusammenführen) | statistik.html, LS.zusammenfuehren |
| LERN-17 | Veröffentlichen über GitHub Pages | erledigt 2026-11-01 (LERN_Session6, online unter patrikneunteufel.github.io/Lernspiele/) | `.github/workflows/pages.yml`, Entscheide P1 a, P2 a, W1 a; Datenschutz-Scan im CHANGELOG |
| LERN-18 | Kiosk-Kasse Stufe 3–4 (Franken/Rappen) auf Basisklasse 2 prüfen | offen | docs/lernziele/lehrplan_sg_session2.md, Bekannte Grenzen |
| LERN-19 | Prüfer: Hinweis verrät die Lösung automatisch erkennen | erledigt 2026-10-31 (LERN_Session3) | tools/pruefe_spiele.js, LS.pruefung.haken |
| LERN-20 | Testspieler und Testhilfen (Entscheid T1 a, T2 a) | erledigt 2026-10-31 (LERN_Session3; heute Rolle Aufsicht, L2 a) | spiel.js (ctx.loesung), rahmen.md Abschnitt 6 |
| LERN-21 | Neue Spiele (2 von 94 angesehen) und die Startseite auf Desktop, Tablet und Handy ansehen | offen | checkliste.md |
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
| LERN-36 | Dezimalzahlen-Spiele M3–M5 und Eingabe von Dezimalzahlen; Dezimalzeichen der Zahlenbuch-Neuausgabe | erledigt 2026-11-02 (LERN_Session8; Dezimalzeichen der Neuausgabe weiter offen) | lehrplan_sg_session8.md; rahmen.md 4.3 |
| LERN-37 | Vorlesen und Kindergarten auf echten Geräten anhören und prüfen | offen | rahmen.md Abschnitt 12 |
| LERN-38 | „▶ Los! 3-2-1“ nur bei der ersten Aufgabe und nach Fehlern, dazwischen kurz ein Aufpassen-Zeichen 👀 (Hinweis Patrik) | erledigt 2026-11-02 (LERN_Session9, F1–F4 a) | rahmen.md (`ctx.uhrWarten`, `ctx.losKnopf`) |
| LERN-39 | Entscheide aus LERN_Session8: Farben rechts vom Komma, Malzeichen, Braille-Finger ohne freie Liste | offen | Report LERN_Session8, Plan 1 |
| LERN-40 | E-Mail-Adresse für Fehlermeldungen bestimmen (eigenes Postfach, A1 a) und eintragen | offen | `eulenpfad/kontakt.js`, Feld `meldungen`; rahmen.md Abschnitt 13 |
| LERN-41 | Fachlich unsichere Stellen aus LERN_Session9 prüfen (Tipps, Regeln, Fakten, Preise; Annahmen Runde A) | offen | Report LERN_Session9, Plan 1 |
| LERN-42 | Prüfer: Spiel-CSS definiert eine reservierte Rahmen-Klasse neu | erledigt 2026-11-02 (LERN_Session9, `rahmenKlassenImStil` im Testskript; im Handover erst 2026-11-03 nachgetragen) | tools/pruefe_spiele.js |
| LERN-43 | Fachlich unsichere Stellen aus LERN_Session10 prüfen (Annahmen Runde B und C, ZU-PRÜFEN-Köpfe der 13 Inhaltsdateien) | offen | lernziele/lehrplan_sg_session10.md; Report LERN_Session10, Plan 1 |
| LERN-44 | Lernplan: Wochenziel je Kind, Wochenstern, Tab Erfolge mit Abzeichen und Teilen (R2, Entscheid L1 a) | erledigt 2026-11-03 (LERN_Session10) | rahmen.md Abschnitt 15 |
| LERN-45 | Rahmen-Baustein „Fragenfolge“ (mehrere Fragen je Aufgabe), danach sechs Spiele darauf umstellen | offen | Report LERN_Session10, Stolperfallen |
| LERN-46 | Teilen eines Abzeichens auf Tablet und Handy prüfen (Teilen-Dialog, Emoji im PNG) | offen | start/erfolge.js, `teileAbzeichen` |
