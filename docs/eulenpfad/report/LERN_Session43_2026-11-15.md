# LERN_Session43_2026-11-15_bildhoehe-messung

## Schwerpunkt
Ganze Aufgabe im Bild (LERN-55, BH3 a): erst die fünf Spiele aus der Liste von LERN_Session42 (Sachaufgaben-Kompass,
Netz-Falter, Diagramm-Detektiv, Hello-Dialog, Fledermaus-Forscher), dann die übrigen Spiele der Liste, danach die
**volle Messung mit fünf Ziehungen** über alle 175 Spiele (21 000 Messungen) und die 17 Spiele, die sie neu zeigte.
Drei Commits von Patrik (`9b7cdfd`, `a8f11f7`, `4ab9c80`), nicht gepusht. Entwickler-Bemerkungen: keine offenen.

## Entscheide (Patrik, 15.11.2026)
- **DD1 a:** Im Diagramm-Detektiv steht neben einem Diagramm die Tabelle oder Strichliste auf dem Handy **quer** (eine
  Spalte je Kategorie, Bild und Name oben, Anzahl oder Striche darunter; `querTabelle`).

## Neu
- **`tools/bildhoehe.js`:** Feld `text` je Ziehung im JSON (Anfang des Aufgabentexts — zeigt, welche Aufgabenart
  überläuft); Chrome mit `--autoplay-policy=no-user-gesture-required` (keine Meldung „Stimme hat nicht gesprochen“ mehr,
  Punkt (3) des Handovers erledigt); prüft vor dem Messen, ob der Server antwortet, und wartet, bis die Startseite bereit
  ist, statt fest 2,5 s. rahmen.md 20.
- **Messung LERN_Session43** in `docs/eulenpfad/bildhoehe_offen.md` (eigener Abschnitt, Liste ersetzt die Einschätzung
  aus einer Ziehung).

## Geändert (36 Spiele, je Spiel im CHANGELOG mit den Werten vorher)
- **Fünf Spiele (`9b7cdfd`):** Fledermaus neben dem Satz; Hello-Dialog breit Dialog links, Antworten rechts;
  Netz-Falter Netz nach der Bildhöhe; Sachaufgaben-Kompass Daten rechts (`.kompass-raster`), Rechenwege zweispaltig,
  wenn sie passen (`zweiSpaltig`); Diagramm-Detektiv Tablet hoch Antworten über die ganze Breite, Handy DD1 a.
- **Übrige Liste (`a8f11f7`):** Rechen-Maschine, Wassertropfen-Reise (💡 über `data-tipp-ziel`), Zahlen-Baukasten,
  Zehntel-Lupe, Quelle heure, Hundertertafel, Fahrplan-Rechner, Au café, Hoch-Tief-Ohr, Kompass, Braille-Finger,
  Koordinaten-Schatz, Znüni-Teller, Finger-Zähler. Calendrier und Son-Lauscher waren nur Messfehler (Stimmen-Meldung).
- **Nach der vollen Messung (`4ab9c80`):** Punkte-Blitz (161 px), Lärm-Wächter (102), Lese-Detektiv (78, breit Text
  links), Möglichkeiten-Finder (bis 71; Ausnahme s6 jetzt bis 97 statt 196), Gedicht-Baukasten (52, je Strophe eine
  Spalte), Plan-Leser (46/35), Gefühle-Radar, Schweiz-Karte, Rede-Zeichen, Taschengeld-Planer (Waren als Zeilen),
  Bruch-Werkstatt, Bionik-Paare, Mittelwert-Waage, Geschichten-Ordner, Tonleiter-Treppe (Breite in `treppeSvg`),
  Blutkreislauf-Lotse; Gemeinde-Helfer seitlich (breitere Spalten bei langen Namen).

## Stolperfallen
- **Gestoppter Server:** Der erste volle Lauf endete sofort mit „LS is not defined“ — der Vorschau-Server war weg. Jetzt
  prüft das Werkzeug den Server vorab.
- **Inline-Stil schlägt CSS:** Tonleiter-Treppe setzt `max-width` im Skript; die neue CSS-Regel wirkte nicht. Vor einer
  Grössenregel nach `style.` im Skript suchen.
- **Rahmen-Klassen im eigenen Stil:** `.auftrag:has(…)` im Möglichkeiten-Finder — `pruefe_spiele.js` weist Selektoren ab,
  die mit einer reservierten Klasse beginnen. Eingeschachtelt (`div:has(> .gl-anzeige) > .auftrag`) ist erlaubt. Der
  Prüfer hat es gefunden; kein neuer Hook nötig.
- **Reihenfolge bei Spalten:** Gedicht-Baukasten mit drei Strophen im 2-Spalten-Raster — die dritte unter der ersten, die
  Aufgabe fragt aber nach „der zweiten Strophe“. Erst beim Ansehen bemerkt; jetzt je Strophe eine Spalte. Wo eine Aufgabe
  nach Reihenfolge fragt, Umstellungen in Spalten immer ansehen.
- **Zwei Spalten mit langen Wörtern:** Taschengeld-Planer „Füllerpatronen“ ragte neben dem Bild aus dem Knopf; Wörter
  ohne Trennstelle vor dem Umbau gegen die Spaltenbreite rechnen.
- **Vorschlag DD1 mit falscher Annahme** (s6 doppel ohne Tabelle) — im Verlauf berichtigt.
- **Werkzeug im Browser:** Pfeilfunktionen und Template-Strings im Ausführen-Werkzeug teils abgewiesen; lange Schleifen
  laufen in das 45-s-Limit — in kleinere Aufrufe teilen.
- Von Patrik keine Regel von Hand durchgesetzt.

## Verifikation
- Skripte „Keine Fehler.“ (295 Skriptdateien, zuletzt nach allen Änderungen).
- Eulenpfad gezielt: sachaufgaben-kompass, diagramm-detektiv, wassertropfen-reise; die 17 Spiele des letzten Pakets je
  „Keine Fehler.“ (Möglichkeiten-Finder im zweiten Lauf).
- Bildhöhe: volle Messung (alle Spiele, fünf Ziehungen); Nachmessung der 17 Spiele mit fünf Ziehungen und des
  Möglichkeiten-Finders: Aufgabe nur noch bei den Ausnahmen von Punkt 4 über dem Rand (Plan-Leser Weg beschreiben Handy
  259, Möglichkeiten-Finder s6 53), Bionik-Paare 3 px an der Schwelle. Rohdaten `.temp/bildhoehe/` (gitignored).
- Angesehen im Browser je auf dem betroffenen Gerät (Liste im CHANGELOG).
- **Kein voller Eulenpfad-Lauf** — letzter voller Lauf weiter auf `5cc948b`; seither `stil.css` (LERN_Session42) und
  CSS/Code in rund 40 Spielen geändert.

## Offene Punkte / Plan für die nächste Session
1. **Push** der drei Commits und dieses Abschlusses; voller Eulenpfad-Lauf vorher auf Patriks Entscheid.
2. **Ausnahmen von Punkt 4 prüfen**, ob sie bleiben (Plan-Leser Weg beschreiben, Diagramm-Wahl s5 Tabelle,
   Möglichkeiten-Finder s6, Quader-Volumen, Hebel-Wippe, Kakao-Weg, Malkreuz) — oder **GR1 a** umsetzen (sichtbare
   Fläche, Verdichtung unter 700 px, Vollbild-Knopf), `bildhoehe_offen.md` Punkt 1.
3. Werkzeug-Kandidat: Vorgabehöhe je Breite in `bilder_aufnehmen.js` (375 → 812, 768 → 1024).
4. Sachaufgaben-Kompass Ergebnis-Schritt auf dem Handy (Punkt 6, Entscheid offen).
5. Sudokus ansehen und freigeben (Patrik); aus LERN_Session41: Prüfer Tastenmarken, Hook-Kandidaten, Suche in
   Verwaltung und Lernsteig, Checkliste.
