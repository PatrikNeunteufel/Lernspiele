# Handover — Lernspiele

## Stand
Technik: HTML/CSS/JS ohne Build (Entscheid LERN-1). Gemeinsamer Rahmen `spiele/gemeinsam/`:
`spiel.js` (Stufenskala, Spieler/Profil/Protokoll, Stufenwahl, Timer, Zeitmessung, Eule, Tastatur,
Sterne), `katalog.js` (Themen, Spiele, Lernziele, Vorgabezeiten), `auswertung.js` (didaktische
Auswertung: Lernzeiten, Konzentration, Vorschläge), `stil.css` (Stellenfarben wie Calcularis).

**Sechsundzwanzig Spiele in elf Themen**, jedes mit fünf Stufen (1 Einsteiger ab 2. Klasse … 5 Profi):
- Mathe · Stellenwert (Lernzielblatt 4.2, alle 8 Lernziele): Stellen-Detektiv, Zahlen-Baukasten,
  Tabellen-Post, Ziffernkarten, Zahlen-Hüpfer, Zahlenrätsel-Tresor, Punkte-Schieber.
- Mathe · Zahlen ordnen (Lehrplan SG MA.1.A.1, MA.1.A.2, MA.1.A.4): Zahlenstrahl-Pfeil,
  Runden-Rutsche, Vergleichs-Krokodil.
- Mathe · Rechnen (MA.1.A.3, MA.1.B.1, MA.1.B.2): Einmaleins-Blitz, Rechen-Rakete,
  Zahlenmauer-Baumeister, Rest-Rätsel.
- Mathe · Form und Raum (MA.2.A.2, MA.2.C.4): Spiegel-Raster, Koordinaten-Schatzsuche
  (Hundertertafel 0–99: Zeile = Zehner, Spalte = Einer, also 2 E 5 Z = 52).
- Mathe · Grössen (MA.3.A.1, MA.3.A.2): Uhr-Werkstatt, Kiosk-Kasse (Fr./Rp., Münzen und Noten als
  einfache Formen, keine Nachbildung echter Banknoten), Masse-Umwandler.
- NMG · Zeit (NMG.9.1): Jahreskreis-Ordner (Jahreszeiten nur zu eindeutigen Monaten gefragt).
- NMG · Himmel (NMG.4.5): Himmels-Forscher (Mondphasen für die Nordhalbkugel, Stufe 5 Planeten).
- Deutsch · Wortarten (D.5.D.1): Wortarten-Sortierer. Deutsch · Rechtschreibung (D.5.E.1): Regel-Lücke.
  Deutsch · Sätze (D.4.F.1): Satz-Reparatur, Wörter-Trenner (beide aus `satz-reparatur/saetze.js`).
- Englisch · Wortschatz (FS1E.5.B.1): English Word-Match.
  Alle Inhaltslisten (`woerter.js` / `saetze.js` in wortarten-sortierer, regel-luecke, satz-reparatur,
  word-match) sind **noch von Eltern oder Lehrperson zu prüfen** (LERN-11).

Jede Aufgabe wird zeitlich gemessen; ein Timer je Aufgabe ist zuschaltbar (im Spiel oder im Profil,
global und je Spiel/Stufe, Vorgabezeiten im Katalog, Vorschlag aus eigenen Zeiten). Zeit um = ein
Fehler, die Aufgabe bleibt lösbar. Statistik: Vorschläge (wiederholen, auffrischen nach 7 Tagen,
nächste Stufe, Fokus, Konzentration, Rhythmus, Timer als Herausforderung), Lernzeiten nach
14 Tagen / Wochentag / Tageszeit, Konzentration nach Aufgabe in der Runde und Runde in der Sitzung,
Stand je Lernziel, Vergleich der Kinder. Daten nur im Browser (Entscheid LERN-5 b).

Geprüft im Browser-Pane: alle 130 Kombinationen Spiel × Stufe laden ohne Konsolenfehler;
Generatoren der Mathe-Spiele je Stufe mit 2000–5000 Zufallsaufgaben auf Gültigkeit und Zahlenraum
geprüft; Wortlisten auf Format geprüft (104 Wörter, 35 Sätze); Timer, Protokoll und Statistik mit
Testdaten durchgespielt (danach gelöscht). Noch nicht von einem Kind gespielt.

Git: lokales Repo in `Lernspiele/` (von Visual Studio angelegt, Branch `master`, kein Remote).
Nicht im Repo: `.vs/`, `material/` und alle Fotos (`*.jpeg`, `*.jpg`), weil die Lernzielblätter
Handschrift von Kindern zeigen können (Entscheid Patrik 2026-10-31); die Abschrift liegt in
`docs/lernziele/`.

Vorschau: `.claude/launch.json` (Konfiguration `lernspiele`, Port 8765). Nach Änderungen hart neu
laden (Strg+F5). Ungeprüft: ob Firefox beim Öffnen per Doppelklick (`file://`) den Speicher
zwischen Startseite und Spielen teilt — Chrome/Edge oder der Server sind sicher.

## Ordner
- `spiele/` — die Spiele (je Spiel ein Unterordner), `spiele/gemeinsam/` Rahmen, Katalog, Auswertung
- `docs/lernziele/` — Lernziele je Klasse/Thema mit Zuordnung Lernziel → Spiel
- `docs/spielideen/` — Spielideen aus dem Lehrplan Volksschule SG
- `material/<klasse>/` — Vorlagen (Lernzielblätter), nicht Teil der Spiele
- `docs/report/` — Session-Reports

## Offene Punkte
| Nr. | Punkt | Status | Einzelheiten |
|---|---|---|---|
| LERN-1 | Technik der Spiele festlegen | erledigt 2026-10-31 (HTML/JS, CLAUDE.md) | Steckbrief *Sprachen* |
| LERN-2 | Spiele 4.2 Stellenwert bauen (Prüfung Do 05.11.26) | erledigt 2026-10-31 (LERN_Session1, 8 von 8) | docs/lernziele/4-2_stellenwert.md |
| LERN-3 | Thema/Lernzielblatt 2. Klasse | offen | noch kein Material |
| LERN-4 | Test mit dem Kind; Schwierigkeit und Hinweise nachschärfen | in Arbeit seit 2026-10-31 (erste Rückmeldung umgesetzt) | Schlusstext je Fehlerzahl korrigiert |
| LERN-5 | Fortschritt protokollieren mit Namen | erledigt 2026-10-31 (LERN_Session1, Entscheid b) | CLAUDE.md Gestaltungsregeln |
| LERN-6 | Schreibweise vierstelliger Zahlen („4500“ / „4 500“) mit Lehrmittel abgleichen | offen | Lehrplan SG schreibt „320'000“ (MA.1.A.3.e), das Lernzielblatt „30 400“ |
| LERN-7 | Farben je Stelle nach Calcularis | erledigt 2026-10-31 (LERN_Session1) | CLAUDE.md Gestaltungsregeln |
| LERN-8 | Einstellung Reihenfolge der Teile je Spiel oder je Spieler | erledigt 2026-10-31 (LERN_Session1) | Profil auf der Startseite; Baukasten, Tresor |
| LERN-9 | Mischspiel über mehrere Themen, gewichtet nach Fokus | später | Profil-Fokus ist dafür angelegt |
| LERN-10 | Spielideen aus dem Lehrplan Volksschule SG, alle Fächer 1.–6. Kl. | erledigt 2026-10-31 (LERN_Session1) | docs/spielideen/lehrplan_sg_spielideen.md |
| LERN-11 | Wortlisten Deutsch prüfen lassen | offen (Prüfung durch Patrik oder Lehrperson, Entscheid a) | Prüfliste docs/pruefung/wortlisten_zur_pruefung.md; nach Korrekturen in woerter.js neu erzeugen mit `node tools/pruefliste_wortlisten.js > docs/pruefung/wortlisten_zur_pruefung.md` |
| LERN-12 | Timer, Zeitmessung und didaktische Statistik | erledigt 2026-10-31 (LERN_Session1) | spiel.js, auswertung.js, statistik.html |
| LERN-13 | Weitere Spiele aus der Top-15-Liste | in Arbeit seit 2026-10-31 (LERN_Session1); 13 von 15 gebaut, insgesamt 19 von 74 Ideen | offen aus Top 15: Schweiz-Karten-Suche und Roboter-Pfad (Kartendaten/Lizenz klären) |
