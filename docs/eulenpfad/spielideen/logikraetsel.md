# Logikrätsel im Eulenpfad (Thema „🧠 Logikrätsel“, SU2 a)

Stand: 14.11.2026 (LERN_Session41), Sudoku-Familie vollständig. Zusatz Patrik zu SU2 a (LERN_Session13): „Logikspiele gibt es sicher auch noch ein
paar andere.“ Hier die Familie aus SU1 a und weitere Ideen. Lehrplan wie in
[lehrplan_sg_session40.md](../lernziele/lehrplan_sg_session40.md): MA.1.B.1.f (Beziehungen erforschen), .h (heuristische
Strategien, Annahmen treffen); Wortlaut in [strategie_raetsel.md](strategie_raetsel.md), Abschnitt 1. Ein Rätsel, das
gegen einen Gegner gespielt wird, gehört ins Thema Strategie (MI.2.2.b), nicht hierher.

## 1. Sudoku-Familie (SU1 a)

Alle auf dem Baustein `eulenpfad/spiele/gemeinsam/sudoku.js` ([rahmen.md](../rahmen.md), Abschnitt 26): Raster mit
beliebigen Gebieten, Löser, Generator, Bedienung mit ✏️-Notizen; Fehler nach SU3 a.

| Spiel | Basisklasse | was es übt | Status |
|---|---|---|---|
| Zahlen-Sudoku | 4 | Zahlen 1 … n in Zeile, Spalte, Kasten; 4 × 4 → 6 × 6 → 9 × 9 | erledigt 2026-11-13 (LERN_Session40), neu und ungeprüft |
| Bilder-Sudoku | KG/1 | dasselbe mit Tieren statt Zahlen, 4 × 4 | erledigt 2026-11-13 (LERN_Session40), neu und ungeprüft |
| Gebiets-Sudoku | 4 | unregelmässige Gebiete statt Kästen (Zusatz Patrik); 4 × 4, 5 × 5, 6 × 6, 9 × 9 | erledigt 2026-11-14 (LERN_Session40), neu und ungeprüft |
| Vergleichs-Sudoku | 3 | < und > zwischen Nachbarfeldern statt vieler Vorgaben | erledigt 2026-11-14 (LERN_Session40), neu und ungeprüft |
| Käfig-Sudoku | 5 | Summen in Zellgruppen, oben auch −, ×, :; 4 × 4 und 6 × 6 | erledigt 2026-11-14 (LERN_Session40), neu und ungeprüft |
| Sudoku-Duell | 5 | abwechselnd mit der Eule eine Zahl setzen, die zu den anderen passt; wer keine mehr setzen kann, verliert (Thema Strategie, DU1 a, DU2 a) | erledigt 2026-11-14 (LERN_Session41), neu und ungeprüft |

Der Baustein kann damit alles, was die Familie braucht: Bilder seit dem Bilder-Sudoku (`zeichen`, `name`, `nennung`, eigene
`tipps`), Gebiete seit dem Gebiets-Sudoku, Zeichen < und > seit dem Vergleichs-Sudoku, Käfige seit dem Käfig-Sudoku und die
Regel-Maschine des Duells (`duellZuege`, `duellGewinnt`, `duellGewinnzuege`, `gesperrt`, `duellStellung`) seit dem
Sudoku-Duell.

**Sudoku-Duell, Regel (DU1 a, LERN_Session41):** Die Zahlen müssen nur zueinander passen, nicht zu einer Lösung. Müsste
jede Zahl zur Lösung passen (oder das Rätsel lösbar bleiben), würde das Raster immer voll, die Zahl der Züge stünde vor dem
ersten fest — dann gäbe es keine Strategie. Gemessen: Auf dem leeren 4 × 4 verliert, wer anfängt (vollständige Suche
2,9 s); die Spiegelstrategie (gleiche Zahl ins gegenüberliegende Feld) brach in 20 000 Partien nie eine Regel. Schon nach
einem Zug gewinnt aber jede Antwort, nach drei Zügen fast jede: Strategie zählt erst am Ende, darum ist jede Aufgabe ein
Endspiel (S1 a: eine Stellung, ein Zug). Königsstufe (DU2 a): halb lange Endspiele auf dem 6 × 6, halb „wer die letzte
Zahl setzt, verliert“.

**Gebiets-Sudoku 7 × 7 (offen):** Bei 5 und 7 gibt es keine Kästen; die Gebiete entstehen dort aus den Zeilen, und ein Tausch
gelingt fast nur an den Zeilenenden. Beim 7 × 7 blieb in 96 bis 99 von 100 ersten Versuchen ein Gebiet ein Rechteck, ein
Rätsel kostete über 100 ms, die Prüfung mit 3000 Rätseln je Stufe liefe aus (LERN_Session40). Für ein 7 × 7 bräuchte
`gebieteZufall` einen anderen Start (eine Lösung, deren Gebiete schon unregelmässig sind) oder Tausche über drei Gebiete.

## 2. Weitere Ideen (nicht entschieden)

Jede übt logisches Schliessen ohne Gegner, hat genau eine Lösung, die ein Löser prüfen kann, und lässt sich in sechs
Stufen staffeln. Reihenfolge ohne Wertung.

| Idee | Basisklasse | was es übt | Stufen (Skizze) |
|---|---|---|---|
| **Logical** (Wer wohnt wo?) | 3 | Aussagen kombinieren, Tabelle mit ✓ und ✗ füllen | 3 × 3 mit drei Sätzen → 5 × 4 mit Verneinungen |
| **Brücken bauen** (Inseln verbinden) | 4 | Zahlen als Zahl der Brücken, alles verbunden | 5 × 5, 4 Inseln → 9 × 9 mit Doppelbrücken |
| **Bild-Rätsel** (Nonogramm) | 2 | Zeilen- und Spaltenzahlen, Felder ausmalen und ausschliessen | 5 × 5 Tier → 10 × 10 |
| **Wahr oder gelogen** (Wahrheitssager) | 5 | Aussagen von Figuren, von denen eine lügt | zwei Figuren → drei Figuren mit „oder“ |
| **Waage-Rätsel** | 2 | Gleichgewicht: Gewichte von Gegenständen erschliessen | zwei Waagen → drei Waagen mit Unbekannten |
| **Zahlen-Kreuzworträtsel** | 4 | Summen in Zeilen und Spalten (Kakuro-Art), Ziffern nicht doppelt | 3 × 3 → 6 × 6 |
| **Schalter-Rätsel** (alle Lampen aus) | 5 | Wirkung eines Zugs vorhersagen, Reihenfolge egal | 3 × 3 → 5 × 5 |

Vor dem Bau einer Idee: Vorlage mit Entscheidungsfrage (Konzepte in `docs/konzept_*` vorher durchsuchen), Namen ohne
geschützte Markennamen, Lehrplan neu lesen.
