# LERN_Session2_2026-10-31_spiele-erste-klasse

## Schwerpunkt
Von 26 auf 56 Spiele: zehn Spiele für Lücken der 1./2. Klasse und NMG-Tiere/Musik, danach 20 Spiele
ab der 1. Klasse. Dann die neue **Stufenskala mit Basisklasse und Königsstufe** (Entscheid Patrik) für
alle Spiele, ein **Testskript** ohne Browser, und rund um die Daten: Dateiname mit Namen, Spielstand
zurücksetzen, Einlesen führt zusammen, Handy-Darstellung geprüft.

## Neu
- **30 Spiele** (Lehrplan je Spiel an sg.lehrplan.ch gelesen, Zuordnung in
  `docs/lernziele/lehrplan_sg_session2.md`):
  - Mathe: Zehner-Ergänzer, Punkte-Blitz, Zahlenhaus, Doppel-Spiegel, Zahlen-Waage, Muster-Fortsetzer,
    Formen-Detektiv, Schätz-Waage, Flächen-Pixel, Rechengeschichten.
  - Deutsch: Silben-Klatscher, Reim-Paare, ABC-Sortierer, Anlaut-Angel, Buchstaben-Zwillinge,
    Blitzlesen, Nomen-Puzzle, Lese-Detektiv.
  - NMG: Tier-Sortierer (Wild/Nutz/Heim, Klassen, Nager, Raubtiere …), Lebensraum-Zuordnung mit
    Nahrungsketten, Fledermaus-Forscher, Lebenszyklus-Puzzle, Körper-Puzzle, Znüni-Teller,
    Magnet-Labor, Schwimmt oder sinkt?
  - Musik: Noten-Namen, Rhythmus-Leser, Hoch-Tief-Ohr, Instrumenten-Kenner.
  - Themen neu: Laute/Silben/Reime, Lesen, Tiere, Körper und Ernährung, Forschen, Musik, Sachrechnen.
- **Rahmen `spiele/gemeinsam/`:** Bausteine `LS.auswahl`, `LS.reihenfolge`, `LS.koerbe`, `LS.fliegen`
  (Wort/Karte fliegt schräg in den gewählten Korb), `ctx.vorbei()`; `noten.js` (Notensystem als SVG,
  Töne per WebAudio, offline).
- **Stufenskala (Entscheid Patrik 2026-10-31):** sechs Stufen bezogen auf die Basisklasse je Spiel
  (Katalog `klasse`): 1 eine Klasse tiefer · 2 leichter · 3 Klassenziel · 4 schwerer · 5 eine
  Klasse höher · 6 Königsstufe. Beschriftung `LS.stufeFuer`, Vorschlag je Spiel `LS.empfohleneStufe`.
  CLAUDE.md nachgeführt.
- **Testskript `tools/pruefe_spiele.js`** mit Ersatz-DOM `tools/pruef_dom.js`: lädt jedes Spiel je
  Stufe mit dem echten Rahmen in Node, spielt Runden per Zufallsklick, meldet Ausnahmen,
  Endlosschleifen, NaN/undefined im Text; prüft Generatoren mit `pruefeAufgabe` (3000 Aufgaben je
  Stufe). Gegentest mit absichtlich kaputtem Spiel bestanden. Erledigt LERN-14.
- **Statistik:** Dateiname `lernspiele-<Namen>-<Datum>.json`; Spielstand zurücksetzen (alle Spiele
  oder eines, Profil bleibt); Einlesen **führt zusammen** statt zu ersetzen (Entscheid Patrik a).
- **README.md** (Start ohne Server, Daten, Ordner, Prüfen).
- Prüfliste um Teil 5–21 erweitert (1199 Prüfkästchen).

## Geändert
- Alle 26 älteren Spiele auf sechs Stufen: Viertklass-Spiele (Basisklasse 4) verlieren den Einstieg
  „bis 100“, bekommen eine leichtere Stufe 2 und die Königsstufe; die übrigen bekommen die Königsstufe.
  Umbau durch fünf Hilfsagenten nach vorgegebener Zuordnung, Ergebnisse per Testskript geprüft.
- Zahlenmauer auf Basisklasse 2 (bis 20 / bis 100 / ab Stufe 5 bis 1000, Obergrenze geprüft).
- Satz-Reparatur: Bei Aussagen mit Nachdruck gilt auch der Punkt (`AUCH_PUNKT` in `saetze.js`).
- Rechen-Rakete: alter Fehler, Stufen 3/4 erreichten ihre Beispielzahlen nie — behoben.
- Handy (375 px): Punkte-Blitz (Hunderterplatten umbrechen) und Zahlen-Waage (Schale) korrigiert.
- `.claude/launch.json`: zweite Vorschau `lernspiele-2` auf Port 8767 (8765 war belegt).

## Stolperfallen
- **Lösung im Hinweis verraten** — in dieser Sitzung über zehnmal gefunden (Silben-Punkte, Anlaut
  buchstabiert, Rhythmus „es fehlen n Viertel“, Planeten-Merkliste, Einmaleins-Grundaufgabe …).
  **Hook-/Prüfer-Kandidat:** im Testskript prüfen, ob der Hinweistext von `ctx.falsch` die Lösung
  (Wert oder Text) enthält.
- **Mehrdeutige Aufgaben:** „a + a“ = „a + b“ bei gleichen Zahlen, 4 − 2 = 4 : 2, Quadrat als
  Ablenker zum Rechteck, zweiter Magnet „zieht an“. Generatoren prüfen jetzt Eindeutigkeit selbst.
- **Rahmen erkannte „aufgelöst“ an `.knopfzeile`** — ein eigener Knopf mit dieser Klasse legte alle
  Antworten still. Jetzt `ctx.vorbei()`.
- **Fachliche Fehler in eigenen Listen:** Pilz als Pflanze, gleichschenklig-rechtwinkliges Dreieck mit
  Achse, Emoji für falsches Tier (Dachs statt Marder). Bilder nur, wo sie stimmen.
- **requestAnimationFrame** läuft in verdeckten Tabs nicht → Übergang per erzwungenem Reflow.
- **Hooks:** Heredoc mit Backslash und `cd` werden abgewiesen; Agenten nutzten zweimal `patchlib.py`
  über die Shell statt Edit (Zeilenenden blieben erhalten, alle Dateien LF geprüft).
- Agenten-Berichte sind keine Belege: Katalog-Vorschläge und Zahlenmauer selbst nachgeprüft.

## Verifikation
- `node tools/pruefe_spiele.js`: 56 Spiele × 6 Stufen = 336 Kombinationen, **keine Fehler**; ein
  Hinweis: Ziffernkarten Stufe 6 schaffen Zufallsklicks nicht alle Runden (7 Karten), kein Fehler.
- Browser: Startseite 18 Themen/56 Spiele ohne Konsolenfehler; Stichproben Noten, Rhythmus, Waage,
  Formen, Flächen, Punkte-Blitz; Handy-Breite 375 px für alle Spiele in Stufe 1 und 6 gemessen.
- Statistik: Zurücksetzen und Zusammenführen mit Testdaten geprüft (doppelte Runde zählt einmal,
  Profil bleibt); Testspieler gelöscht.
- **Nicht geprüft:** Spiele durch ein Kind; alle neuen Inhaltslisten (UNGEPRÜFT); Firefox mit `file://`;
  Ton auf Tablet/Handy; einzelne Stufen der Agenten-Spiele nur per Skript, nicht von Hand.

## Offene Punkte / Plan für die nächste Session
1. **LERN-11:** Prüfliste durch Patrik oder Lehrperson — jetzt 1199 Einträge, viele neue Sachinhalte.
2. **LERN-4:** Testrunde mit den Kindern, besonders Stufe 3 je Basisklasse und die Königsstufen.
3. **LERN-17:** GitHub Pages (Anleitung im Chat); vorher Datenschutz-Scan des Repos (Reports, Handover).
4. **LERN-18:** Kiosk-Kasse Stufe 3–4 (Franken/Rappen) auf Basisklasse 2 prüfen.
5. **Prüfer-Kandidat:** Hinweis-verrät-Lösung im Testskript automatisch prüfen.
6. Alte Runden im Protokoll tragen alte Stufennummern → bei Bedarf Spielstand zurücksetzen.
7. LERN-6 Schreibweise vierstelliger Zahlen; LERN-3 Material 2. Klasse; LERN-9 Mischspiel;
   LERN-13 Rest der Spielideen (Schweiz-Karte, Roboter-Pfad).
