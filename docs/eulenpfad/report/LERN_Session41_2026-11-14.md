# LERN_Session41_2026-11-14_sudoku-duell

## Schwerpunkt
Das **Sudoku-Duell** als letztes Spiel der Sudoku-Familie (LERN-56 erledigt). Danach auf Hinweise Patrik: die **Suche
im Tab Spiele** (erster Buchstabe erschien erst nach Sekunden), die **Tastenmarken** A/S/D (aus einer missverstandenen
Notiz, aber ein gemessener Fehler in 74 Spielen), der **Plan-Leser** (Bemerkung 54: die grüne Fläche verdeckte das
getippte Zeichen) und **Ganze Aufgabe im Bild** für Stromkreis-Bauer und Rhythmus-Leser (LERN-55); dabei ein Messfehler
in `tools/bildhoehe.js` gefunden. Sechs Commits von Patrik (`a493be5` bis `62813e0`), nicht gepusht (mit den acht aus
LERN_Session40 vierzehn). Entwickler-Bemerkungen: keine offenen (Nr. 54 erledigt).

## Entscheide (Patrik, 14.11.2026)
- **DU1 a:** Regel des Duells — abwechselnd eine Zahl in ein leeres Feld, die in Zeile, Spalte und Kasten noch nicht
  steht; wer keine Zahl mehr setzen kann, verliert. (Müsste jede Zahl zur Lösung passen, stünde der Sieger vor dem
  ersten Zug fest.)
- **DU2 a:** Königsstufe halb lange Endspiele auf dem 6 × 6, halb „wer die letzte Zahl setzt, verliert“.
- **KV1 a:** Karten in den Listen ohne Gruppen (Treffer, ähnliche Spiele, flache Sortierung) mit `content-visibility`.
- **TM1 a:** Tastenmarke bekommt oben Platz, nur wo sie auf Inhalt läge; auf Rückfrage nach dem Missverständnis
  behalten („TM1 behalten“).

## Neu
- **Sudoku-Duell (sudoku-duell)**, Basisklasse 5, Thema Strategie, neu und ungeprüft: Endspiel-Stellungen (S1 a), s1–s3
  4 × 4, s4–s6 6 × 6; unerlaubter Zug = Hinweis, schlechter Zug zeigt die Gewinnantwort der Eule im Raster; zweiter Tipp
  markiert gesperrte Felder mit ✖; endlos, im Mix, Regelseite, Abschluss-Animation `duell`. Baustein `sudoku.js`:
  `duellZuege`, `gesperrt`, `duellGewinnt`, `duellGewinnzuege`, `duellStellung`; `pruefeAufgabe` mit eigener Suche.
- **Kern 1.46.0:** `suche().feld` ruft `neu()` erst nach dem nächsten Bild und einmal für mehrere Eingaben.
- **Tab Spiele:** `zeichneAuswahl()` zeichnet nur, was von der Suche abhängt (`.spiele-auswahl`); die Ansicht ohne
  Suche bleibt während einer Suche aufbewahrt.
- **Tastenmarken:** `ktPlatz` in `spiel.js`, Klasse `marke-platz` (`stil.css`).
- **`tools/bildhoehe.js`:** Feld `maus` je Gerät; Handy und Tablet ohne Tastenmarken gemessen.

## Geändert
- Suche: erster Buchstabe nach 56–88 statt 500–620 ms (CPU vierfach gedrosselt, 1024 px), Leeren 132–152 statt
  327–366 ms, erster Buchstabe mit Liste 269–365 statt 403–439 ms.
- Tastenmarken über alle Spiele, sechs Stufen, 1024 und 1366 px (je dieselbe Aufgabe mit und ohne): auf Inhalt 905
  Knöpfe in 74 Spielen → keine verdeckten Buchstaben mehr.
- Lernziel-Erklärung der Kürzel im Tab Spiele hängt an der Zeile `.marken` (ragte bis 130 px aus der Karte).
- Plan-Leser: Tippfelder unter den Zeichen; „auf den Weiher“ statt „auf der Weiher“.
- Stromkreis-Bauer: Antworten neben dem Schaltbild; Rhythmus-Leser: Noten am Computer höchstens 110 px. Beide auf keinem
  Gerät mehr mit der Aufgabe über dem Rand (vorher bis 139 px).
- Handover: Angleich der Reihe heisst LERN-62 (LERN-60 war doppelt vergeben).

## Stolperfallen
- **Notiz missverstanden:** „Tasten-Abzeichen über langen Antworten (Plan-Leser s5)“ aus LERN_Session39 war als
  Tastenmarken gelesen; gemeint war die grüne Fläche im Plan-Leser (Bild Patrik). Daraus wurde ein ganzer Entscheid
  (TM1) vorgelegt und gebaut. Für Hinweise Patriks im Handover den Wortlaut oder ein Bild mitnehmen, nicht die eigene
  Deutung.
- **Antworten auf Englisch:** Zwischenmeldungen rutschten ins Englische (Rückfrage Patrik „wieso redest du englisch?“).
  Die Regel steht in der globalen CLAUDE.md; sie wurde hier von Patrik von Hand durchgesetzt. **Hook-Kandidat:** ein
  Stop-Hook, der eine Antwort meldet, deren Text überwiegend englisch ist.
- **Messen im versteckten Vorschaufenster:** `requestAnimationFrame` läuft dort etwa einmal je Sekunde oder gar nicht —
  Zeiten waren falsch, eine Suche zeichnete gar nicht. Gemessen wurde danach in Chrome ohne Fenster über CDP.
- **Browser-Cache:** Nach `kern_verteilen.py` lief im Vorschaufenster noch `kern.js` 1.45.1, auch nach Neuladen ohne
  Cache; erst `fetch(…, { cache: "reload" })` je Datei half.
- **Vergleich über zwei Läufe:** Jede Seite zieht eine Zufallsaufgabe; „54 Seiten bis 183 px neu über den Rand“ war fast
  nur die andere Aufgabe. Richtig: dieselbe Aufgabe mit und ohne die Änderung messen.
- **`bildhoehe.js` misst mit Maus:** Chrome ohne Fenster meldet für alle Rahmen eine Maus; seit TM1 a bekamen auch
  Handy-Rahmen Platz für Marken — 58 px Überlauf, den es auf dem Handy nicht gibt. Behoben (Feld `maus`).
- **Kartenvorrat verworfen:** Karten wiederverwenden statt neu bauen brachte gemessen fast nichts (157 → 145 ms) — vor
  dem Bauen messen, wo die Zeit liegt (hier Layout).
- **`LS.langDruecken` merkt sich eine Fläche:** Beim Umbau der Suche war sie kurz nur die Auswahl; Vorlesen auf
  Fach-Reitern, Suche und Filter fiel aus (in `18ae573` committet, mit `0919713` behoben).
- **Hooks:** dreimal Backslash im Heredoc, einmal `cd` — jeweils mit Write/Edit umgangen. Ein Server-Start über Bash
  wurde abgelehnt (Server nur über `preview_start`); der Vergleich gelang stattdessen mit `bildhoehe.js --css`.
- **Prüfer-Kandidat:** das Messskript für Tastenmarken (Marke auf eigenem Inhalt, auf fremdem Inhalt, Überlauf; je
  dieselbe Aufgabe mit und ohne) als `tools/`-Prüfung nach dem Muster von `bildhoehe.js`.

## Verifikation
- Kern „6078 Fälle, 0 Fehler.“, Server „61 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“, Gratwanderung und
  Schrift „Keine Fehler.“, Skripte „Keine Fehler.“, Feier „175 Spiele, 6300 Bilder, keine Fehler.“.
- Eulenpfad gezielt: sudoku-duell (alle Stufen, je 3000 Aufgaben fachlich, endlos, Mix), tab (Tab Spiele, 69
  Prüfschritte), plan-leser, gegenteil-wippe, stellen-detektiv, au-cafe, rhythmus-diktat, stromkreis-bauer,
  rhythmus-leser — alle „Keine Fehler.“; Prüfansicht plan-leser und stromkreis-bauer „Keine Fehler.“.
- Bildhöhe sudoku-duell „Alle Aufgaben passen ins Bild.“; stromkreis-bauer und rhythmus-leser auf allen Geräten ohne
  Aufgabe über dem Rand. Kontrast sudoku-duell, stromkreis-bauer, rhythmus-leser hell und dunkel „Kein Text unter der
  Untergrenze.“.
- **Kein voller Eulenpfad-Lauf** — letzter voller Lauf weiter auf `5cc948b`. Seither geändert: alle Spielseiten und
  Schlussbild (LERN_Session40), `spiel.js` (Tastenmarken), `stil.css`, Kern 1.46.0.

## Offene Punkte / Plan für die nächste Session
1. **Push** der 14 Commits; vorher der volle Eulenpfad-Lauf auf Patriks Entscheid (siehe Verifikation).
2. Sudoku-Familie und Sudoku-Duell ansehen und im Prüfstand freigeben (Patrik); Wortlaut MA.1.B.1 im 1. Zyklus
   nachlesen (Annahme Bilder-Sudoku).
3. Sieben Spiele färben nach dem Tippen Flächen in SVG-Bildern (Erdzeit-Leiter, Kakao-Weg, Netz-Falter, Schweiz-Karte,
   Tonleiter-Treppe, Wassertropfen-Reise, Würfel-Kipper) — prüfen, ob dort wie im Plan-Leser etwas verdeckt wird.
4. Bildhöhe mit dem korrigierten Werkzeug über alle Spiele neu messen (die Handy-Werte seit TM1 a waren zu hoch);
   übrige Seiten mit Tipp-Zeile unter dem Rand (LERN-55).
5. Prüfer-Kandidat Tastenmarken in `tools/`; Hook-Kandidaten: englische Antwort, `sed -i` auf CRLF, `CD_SITZUNG_OK` nur
   für ein alleinstehendes `cd`.
6. Suche in Verwaltung (Freigabe) und Lernsteig bauen die Seite noch ganz neu auf (der Buchstabe steht seit Kern 1.46.0
   sofort); bei Bedarf wie im Tab Spiele nur die Liste.
7. Aus LERN_Session40 weiter: Checkliste neu erzeugen; ähnliche Bilder bei „Bild verrät“.
