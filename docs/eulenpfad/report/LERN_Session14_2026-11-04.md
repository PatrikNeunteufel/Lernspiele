# LERN_Session14_2026-11-04

## Schwerpunkt
Korrekturen und Wünsche Patrik: README der Reihe, Geburtsmonat, Klassenaufstieg, Klassen-Rand auf den Spielkarten;
danach im Wechsel Hinweise aus dem Browser (Pentomino, Meldungen 9 und 10, Notizfelder, Filter, Anleitungen, Profil,
Balken der Rückmeldung, Rechteck-Labor) und zwei neue Bausteine: Notizblock für schriftliches Rechnen und das erste
Hilfsmittel-Spiel (Hundertertafel-Detektiv). Entscheide G1, SK1, NB1–NB4, HM1 (alle a); PS1 durch Patriks eigenen
Vorschlag ersetzt. Drei Commits (0f4d784, 4ea0e2a und der Abschluss).

## Neu
- **Repo-README** als Übersicht der Reihe Eulenpfad → Lernsteig → Gratwanderung; die bisherige README zieht nach
  `eulenpfad/README.md` (Kindergarten bis 6. Klasse statt „2. und 4. Klasse“; CLAUDE.md ebenso).
- **Geburtsmonat statt Alter:** Profilfeld `geboren: "JJJJ-MM"` ohne Tag (Annahme GM1, Datensparsamkeit),
  `LS.alterVon`; ältere Profile mit `alter` gelten weiter. Datenregel in der CLAUDE.md nachgeführt.
- **Klassenaufstieg:** `LS.aufsteigen`, `LS.aufstiegZuruecknehmen`, `LS.neuerAufstieg`; einzeln im Profil (Knopf neben
  der Klasse), für mehrere Kinder in Verwaltung → Konten → „Neues Schuljahr“. Das Kind sieht einmal „Du bist jetzt in
  der n. Klasse!“ mit Konfetti; Abzeichen „Aufgestiegen“ 🏫 (1–5 Aufstiege) mit gezeichnetem Symbol.
- **Klassen-Rand (G1 a):** ohne „🎒 Meine Klasse“ ein Glow nach aussen mit Zeichen — ✓ Türkis tiefer, ● Gold eigene
  Klasse, ▲ Violett Herausforderung; Deko-Farben, nie Stellenfarben; Legende über den Karten.
- **Filter einklappbar** (Kopfzeile nennt, was gilt; Handy zu, sonst offen; je Person gemerkt). **Anleitungen in der
  App:** 📖 in der Leiste, Links unter der Anmeldung, Rückweg mit `?von=app`.
- **Notizblock für schriftliches Rechnen (NB1–NB4 a):** `spiele/gemeinsam/notizblock.js` (`SCHRIFTLICH`): Vorlagen Plus,
  Minus, Mal (auch mehrstellig mit versetzten Teilprodukten), Geteilt, Häuschen; Dezimalzahlen am Komma ausgerichtet
  mit Kommalinie und Spalten z h t; eigenes Ziffernfeld. Nicht bewertet; Vorgehen „mit Notizblock“. Einstellung der
  Aufsicht „ab Stufe 4 / immer, wo Notizen sind / nie“; `ctx.notizblock(empfohlen)` für Spiele ohne Notizfelder.
  Die Schriftlich-Werkstatt baut ihre Tabelle mit demselben Raster (rahmen.md 21).
- **Hilfsmittel als eigene Spiele (HM1 a):** Ideenliste `spielideen/hilfsmittel.md` nach dem Wortlaut von MA.1.B.3
  (sg.lehrplan.ch, gelesen 2026-11-04); gebaut **Hundertertafel-Detektiv** (H2, Basisklasse 2): Lücke, Reihe, Suchen,
  bis ins Tausenderbuch; Lernziele und Annahmen in `lernziele/lehrplan_sg_session14.md`. 169 Spiele.

## Geändert
- **Sachaufgaben-Kompass (SK1 a, Meldung 10):** Angaben tragen ihre Bedeutung („Am letzten Tag fährt sie noch 14 km“);
  Prüfung meldet Angaben ohne Zahl; Satzzeichen hängen an der Angabe, kein doppelter Punkt nach „Fr.“.
- **Rahmen:** Eule zeigt bei neuer Aufgabe den Auftrag aus `.frage`/`.auftrag` (ohne 💡); Ja/Nein auf J/N (Meldung 9);
  Bildschirmtastatur schreibt ins gewählte Notizfeld („✓ Notiz fertig“); Balken der Rückmeldung auf festem Platz in
  der Zeile von „Melden“ — die Aufgabe rutscht nicht mehr.
- **Probe-Stempel:** Notizfelder mit beschrifteten Zerlegungsschritten (`zerlegung`), dazu der Notizblock.
- **Profil neu geordnet (Patriks Vorschlag statt PS1):** oben Person, Vorgaben, Fokus (je Fach einklappbar) und
  „Speichern“; darunter die sofort wirkenden Häkchen. Bild des Kindes nur zum Ansehen; das Kind sieht Alter und Klasse.
- Pentomino-Puzzle: Umriss getönt und gestrichelt. Rechteck-Labor: Höhe bis „10 cm“ ganz sichtbar.
- Doku: rahmen.md (4.2, 4.3, 6, 18, 19, 21), Anleitung für Erwachsene, konzept_notizen.md, Checkliste, Handover.

## Stolperfallen
- **Notizfelder ohne Zweck:** Zwei unbeschriftete Felder für eine einzige Rechnung halfen nichts; die erste Korrektur
  nahm sie ganz weg — auch falsch. Richtig sind beschriftete Schritte. Merksatz: ein Notizfeld braucht eine Beschriftung,
  die sagt, was hineingehört.
- **Knopf nur beim Stellen gesetzt:** Spiele mit Notizen in einem späteren Schritt (Probe-Stempel, Kompass) bekamen
  keinen Notizblock. Jetzt auch bei späten Aufrufen.
- **`meldungen_stand.py` verlor eine veröffentlichte Antwort**, weil sie nur in `meldungen-stand.json` stand und nicht
  in der Bemerkung. Von Hand nachgetragen. **Prüfer-Kandidat:** das Werkzeug soll vorhandene Antworten behalten oder
  warnen, wenn eine wegfällt.
- **Stellenfarben von Hand durchgesetzt** (Klassen-Rand, Spalten z h t im Notizblock): **Prüfer-Kandidat** — das
  Testskript könnte `st-`-Klassen ausserhalb von Stellen melden.
- Ausgeblendeter Browserbereich: Bildschirmfotos verzerrt oder veraltet; geprüft über Masse und DOM. Ein voller
  Testlauf dauert über 10 Minuten — bei laufenden Korrekturen nur das geänderte Spiel prüfen (Wunsch Patrik).
- Lehrplanseiten liegen nicht zwischengespeichert vor; MA.1.B.3 direkt geholt.

## Verifikation
- Testskript je Änderung für die betroffenen Spiele: „Keine Fehler.“ (Hundertertafel, Kompass, Probe-Stempel,
  Werkstatt, Rechen-Maschine, Rechteck-Labor u. a.). Voller Lauf zum Abschluss über alle 169 Spiele: „Keine Fehler.“, 22 Hinweise bekannter Arten (zu wenig verschiedene
  Aufgaben in kleinen Listen, „verrät“-Verdacht, zwei nicht messbare Stufen, Grundwort „Puzzle“); Dauer 24 min 52 s.
- Im Browser (Desktop 1300 px, Handy 375 px) geprüft: Aufstieg (einzeln, Klasse, Zurücknehmen, Nachricht), Klassen-Rand,
  Geburtsmonat, Filter, Anleitungen, Notizblock (Mal, Geteilt, Minus, Dezimal mit Klicks aufs eigene Ziffernfeld),
  Notizfeld mit Bildschirmtastatur, Hundertertafel (drei Arten), Profil (Lage, Speichern vor Aufstieg), Balken (Lage
  der Aufgabe gemessen), Rechteck-Labor. **Nicht angesehen:** Kompass-Angaben aller 33 Vorlagen auf dem Handy (nur
  Stufe 3); Notizblock zwischen 561 und 1100 px Breite (überdeckt dort einen Teil der Aufgabe); Anleitungsbilder.

## Offene Punkte / Plan für die nächste Session
1. **Anleitungen:** Notizen und Notizblock beschreiben (kommen dort noch nicht vor), Bilder neu
   (`node tools/anleitung_bilder.js`): Profil, Tab Spiele mit Filter und Rand, Aufstieg.
2. **Lehrmittel abgleichen:** Hundertertafel ab 0 oder 1 (`START`), Zwanzigerfeld oder Rechenrahmen (H1),
   Subtraktionsverfahren im Notizblock und in der Werkstatt, schriftliche Division in der Primarschule.
3. **Hilfsmittel weiter (LERN-60):** H1 Zwanzigerfeld, H3 Punktefeld, H4 Rechenstrich; H5 als Stufe der Rechen-Maschine.
4. **Prüfer-Kandidaten:** `meldungen_stand.py` behält Antworten; Testskript meldet Stellenfarben ausserhalb von Stellen.
5. Aus LERN_Session13 weiter: GR1 a (LERN-55), Sudoku-Familie (LERN-56), PS2 (LERN-57), Weitere Erfolge (LERN-58).
6. Weiter offen: LERN-51, LERN-52, LERN-48, LERN-49, LERN-50, LERN-43, LERN-46, LERN-37, LERN-45, LERN-35, LERN-40.
