# LERN_Session1_2026-10-31_setup-stellenwert

## Schwerpunkt
Projekt eingerichtet und von null auf 26 Lernspiele gebracht: zuerst das Stellenwert-Paket für die
Prüfung 4.2, dann gemeinsamer Rahmen mit Spielerprofil, fünf Stufen, Timer,
Zeitmessung und didaktischer Statistik, danach Spiele aus dem Lehrplan Volksschule St. Gallen für
Mathe, Deutsch, NMG und Englisch.

## Neu
- **Projekt:** CLAUDE.md mit Gestaltungsregeln und Steckbrief (Prefix LERN), Handover, Changelog,
  Ordnerstruktur, `.gitignore`, `.claude/launch.json` (Vorschau-Server Port 8765).
- **Entscheide:** LERN-1 HTML/CSS/JS ohne Build · LERN-5 b Spielerprofil und Protokoll mit Namen,
  nur im Browser · LERN-7 Stellenfarben wie Calcularis (E rot, Z blau, H grün, ab T wiederholt) ·
  LERN-8 Reihenfolge der Teile einstellbar · LERN-11 a Wortlisten prüft Patrik oder Lehrperson ·
  Fotos der Lernzielblätter nicht ins Repo.
- **Rahmen `spiele/gemeinsam/`:** `spiel.js` (Fünf-Stufen-Skala, Spieler/Profil/Protokoll,
  Timer, Zeitmessung je Aufgabe, Eule, Tastatur, Sterne), `katalog.js` (Themen, Spiele,
  Lernziele, Vorgabezeiten), `auswertung.js` (Lernzeiten, Konzentration, Übungsvorschläge),
  `stil.css`.
- **Startseite** mit Filter Thema/Stufe/Fokus, Profil (Alter, Klasse, Fokus, Reihenfolge, Timer);
  **Statistik** mit Vorschlägen, Lernzeiten (14 Tage, Wochentag, Tageszeit), Konzentration
  (Aufgabe in der Runde, Runde in der Sitzung), Stand je Lernziel, Vergleich, Sichern/Einlesen.
- **26 Spiele in 11 Themen** (Liste im Handover), alle mit fünf Stufen.
- **Recherche:** `docs/spielideen/lehrplan_sg_spielideen.md` (Agent, 74 Ideen, 7 Fächer, Top 15);
  Stichproben an sg.lehrplan.ch selbst geprüft (MA.1.A.2/3/4, MA.1.B.1/2, MA.2.A.2, MA.2.C.4,
  MA.3.A.1/2, D.4.F.1, D.5.D.1, D.5.E.1, FS1E.5.B.1, NMG.4.5, NMG.9.1, Lektionentafel).
- **Prüfliste** `docs/pruefung/wortlisten_zur_pruefung.md`, erzeugt mit `tools/pruefliste_wortlisten.js`.

## Geändert (nach Rückmeldung Patrik)
- Schlusstext „fast alles richtig“ erschien auch bei 0 Fehlern → Text je Fehlerzahl.
- Von zwei auf fünf Stufen je Spiel (2. Klasse kann 4.-Klass-Spiele versuchen).
- Startseite nach Thema und Stufe filterbar.

## Stolperfallen
- **Generatoren ohne Abbruch:** Zahlenmauer Stufe 5 verlangte 7 Lücken bei 4 Grundsteinen
  (nie eindeutig lösbar) → Endlosschleife, Seite hing. Jetzt höchstens 6 Lücken, Versuche begrenzt.
- **Ungültige Zufallsaufgaben** dreimal erst im Test gefunden: Zahlenstrahl (Dezimalziel, über 1 Mio),
  Vergleichs-Krokodil (einstellige Zahl → NaN), Rechen-Rakete (triviale 330 + 1).
  **Hook-/Prüfer-Kandidat:** ein Testskript `tools/pruefe_generatoren` (Node), das jede Spielseite
  lädt und je Stufe einige tausend Aufgaben auf Gültigkeit prüft — heute geschieht das von Hand im
  Browser-Pane.
- **Antwort verraten:** Planetengrösse bei „grösster Planet“, Monatsfarben bei Jahreszeit-Fragen,
  Zeilenumbruch mitten im Wort beim Wörter-Trenner — bei Auswahl-Spielen jede Darstellung darauf
  prüfen, ob sie die Lösung zeigt.
- **Doppelter Punkt nach „Fr.“** („20 Fr..“) in Sätzen.
- **Browser-Cache:** der Python-Server sendet keine Cache-Vorgaben; nach Änderungen hart neu laden.
- **Heredoc-Hook** wies Python-Snippets mit Backslash ab; Blöcke über Scratch-Dateien oder `chr()`.
- **Commit-Message** von `0962a6c` enthält den kompletten Befehlstext inklusive `" -m "` (vermutlich
  in das Visual-Studio-Feld eingefügt); `2cdd543` beginnt mit „ernspiele“. Beides harmlos,
  korrigierbar mit `git commit --amend` nur für den letzten Commit.

## Verifikation
- Alle 130 Kombinationen Spiel × Stufe laden im Browser-Pane ohne Konsolenfehler.
- Mathe-Generatoren je Stufe mit 2000–5000 Zufallsaufgaben auf Gültigkeit und Zahlenraum geprüft.
- Timer, Protokoll, Statistik und Vorschläge mit Testdaten durchgespielt (danach gelöscht).
- Tablet (768 px) und Handy (375 px) stichprobenartig geprüft.
- **Nicht geprüft:** Spiel durch ein Kind (ausser einer ersten Rückmeldung), Firefox mit `file://`,
  Inhaltslisten durch Fachperson.

## Offene Punkte / Plan für die nächste Session
1. **Nächste fünf Spiele (Entscheid a):** Lücken der 1./2. Klasse — Zehner-Ergänzer (Mathe),
   Silben-Klatscher, Reim-Paare, ABC-Sortierer (Deutsch), Lebensraum-Zuordnung (NMG). Vorher je
   Lehrplanstelle an der Quelle prüfen; neue Listen in eigene Dateien und in die Prüfliste.
2. LERN-11: Prüfliste durch Patrik oder Lehrperson (4 Teile, rund 280 Einträge).
3. LERN-4: Testrunde mit dem Kind, Rückmeldung in den Rahmen einarbeiten.
4. Kandidat: Generator-Testskript (siehe Stolperfallen).
5. LERN-6 Schreibweise vierstelliger Zahlen; LERN-3 Material 2. Klasse; LERN-9 Mischspiel.
