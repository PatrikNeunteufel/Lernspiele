# Handover — Lernspiele

## Stand
**2026-10-31, nach LERN_Session2** ([Report](report/LERN_Session2_2026-10-31.md)): 56 Spiele in 18 Themen,
je sechs Stufen bezogen auf eine Basisklasse; `node tools/pruefe_spiele.js` meldet für alle
336 Kombinationen Spiel × Stufe keine Fehler. Inhaltslisten ungeprüft (Prüfliste 1199 Einträge);
noch von keinem Kind gespielt. Session-2-Änderungen noch nicht committet.

**Nächste Session — Plan:** LERN-11 Prüfliste einarbeiten, sobald Rückmeldungen da sind; LERN-4
Testrunde mit den Kindern (Stufe 3 je Basisklasse, Königsstufen); vor LERN-17 (GitHub Pages)
Datenschutz-Scan des Repos; Prüfer-Kandidat „Hinweis verrät Lösung“ ins Testskript.

Technik: HTML/CSS/JS ohne Build (Entscheid LERN-1). Gemeinsamer Rahmen `spiele/gemeinsam/`:
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
| LERN-11 | Inhaltslisten prüfen lassen | offen (Prüfung durch Patrik oder Lehrperson, Entscheid a) | docs/pruefung/wortlisten_zur_pruefung.md (1199 Einträge, Teil 1–21) |
| LERN-12 | Timer, Zeitmessung und didaktische Statistik | erledigt 2026-10-31 (LERN_Session1) | spiel.js, auswertung.js, statistik.html |
| LERN-13 | Weitere Spiele aus den Spielideen | in Arbeit seit 2026-10-31 (LERN_Session2); 56 Spiele gebaut | offen u. a. Schweiz-Karten-Suche, Roboter-Pfad (Kartendaten/Lizenz) |
| LERN-14 | Testskript für die Aufgabengeneratoren aller Spiele (Node) | erledigt 2026-10-31 (LERN_Session2) | tools/pruefe_spiele.js |
| LERN-15 | Stufenskala mit Basisklasse und Königsstufe | erledigt 2026-10-31 (LERN_Session2, Entscheid Patrik) | CLAUDE.md; docs/lernziele/lehrplan_sg_session2.md |
| LERN-16 | Spielstand zurücksetzen und zwischen Geräten abgleichen | erledigt 2026-10-31 (LERN_Session2, Entscheid a: Zusammenführen) | statistik.html, LS.zusammenfuehren |
| LERN-17 | Veröffentlichen über GitHub Pages | offen (Patrik) | vorher Datenschutz-Scan; Anleitung im Chat LERN_Session2 |
| LERN-18 | Kiosk-Kasse Stufe 3–4 (Franken/Rappen) auf Basisklasse 2 prüfen | offen | docs/lernziele/lehrplan_sg_session2.md, Bekannte Grenzen |
| LERN-19 | Prüfer: Hinweis verrät die Lösung automatisch erkennen | offen | Report LERN_Session2, Stolperfallen |
