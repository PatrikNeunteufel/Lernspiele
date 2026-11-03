# Strategie-Rätsel im Eulenpfad (Entscheid S1 a, LERN-49)

Stand: 03.11.2026 (LERN_Session11) · **Vorlage, nicht gebaut.** Ganze Partien Schach und Go gehören in den Lernsteig
(S1 a); im Eulenpfad gibt es kurze Rätsel, je Aufgabe eine Stellung und ein Zug, Runden von 2–5 Minuten.

## 1. Beleg im Lehrplan

Gelesen am 03.11.2026 mit `tools/lehrplan_sg_lesen.py` von sg.lehrplan.ch (`stufen.json`, neu abgerufen). Wortlaut:

- **MI.2.2.b** (2. Zyklus): „können durch Probieren Lösungswege für einfache Problemstellungen suchen und auf
  Korrektheit prüfen (z.B. einen Weg suchen, eine Spielstrategie entwickeln). Sie können verschiedene Lösungswege
  vergleichen.“ — Kompetenz MI.2.2 „einfache Problemstellungen analysieren, mögliche Lösungsverfahren beschreiben
  und in Programmen umsetzen“.
- **MA.1.B.1.h** (2. Zyklus, Grundanspruch): „können heuristische Strategien verwenden: ausprobieren, Beispiele
  suchen, Analogien bilden, Regelmässigkeiten untersuchen, Annahmen treffen, Vermutungen formulieren.“
- Dazu MA.1.B.1.f (2. Zyklus, Orientierungspunkt): „lassen sich auf offene Aufgaben ein, erforschen Beziehungen,
  formulieren Vermutungen und suchen Lösungsalternativen.“

Einordnung: Medien und Informatik ist in St. Gallen ein eigenes Fach ab der 5. Klasse
([lehrplan_sg_5-6.md](lehrplan_sg_5-6.md), Abschnitt 1); MA.1.B.1.h folgt auf den Orientierungspunkt .f (Ende 4.
Klasse) und ist damit Stoff der 5./6. Klasse. Suchwörter „Strategie“, „Spielregel“, „Schach“, „Brettspiel“ über alle
Fächer des 1. und 2. Zyklus: sonst nur Lese-, Hör-, Sprech- und Schreibstrategien in D, FS1E, FS2F. Schach und Go
selbst nennt der Lehrplan nicht.

## 2. Drei Spiele

Alle drei: die Eule als Gegenspielerin, jede Aufgabe eine Stellung („Du bist dran“), richtig ist ein Zug, der
gewinnt bzw. das Ziel erreicht; ein anderer Zug zeigt, wie die Eule antwortet, und gibt einen Hinweis. Die Lösung
prüft eine eigene kleine Regel-Maschine je Spiel (ohne Abhängigkeit), das Testskript jede Stellung auf genau eine
richtige Lösung bzw. auf die Menge der richtigen Züge.

### 2.1 Stein-Duell (Nim) — ohne Vorwissen

Steine in einer Reihe, abwechselnd nimmt man 1 bis k; wer den letzten nimmt, gewinnt. Die Strategie (Rest auf ein
Vielfaches von k + 1 bringen) ist mit Probieren und Regelmässigkeiten zu finden — genau MI.2.2.b und MA.1.B.1.h.

| Stufe | Inhalt |
|---|---|
| s1 (4. Kl.) | 4–7 Steine, nimm 1–2: der Gewinnzug ist sichtbar nahe am Ende |
| s2 | bis 12 Steine, nimm 1–2 |
| s3 (5. Kl.) | bis 20 Steine, nimm 1–3; Tipp „Welche Anzahl willst du der Eule lassen?“ |
| s4 | „Willst du anfangen?“ — erkennen, ob die Stellung gewinnt; k wechselt (1–4, 1–5) |
| s5 (6. Kl.) | zwei Reihen, aus einer Reihe beliebig viele (Gleichgewicht der Reihen) |
| s6 👑 | drei Reihen (klassisches Nim) oder „wer den letzten nimmt, verliert“ |

### 2.2 Steine fangen (Atari-Go) — Regeln in zwei Sätzen

Brett 5×5 bis 9×9. Ein Stein oder eine Gruppe ohne freie Nachbarpunkte (Freiheiten) wird gefangen; wer zuerst fängt,
gewinnt. Die Regeln stehen in Hilfe und Tipp; geübt wird das Vorausdenken.

| Stufe | Inhalt |
|---|---|
| s1 (4. Kl.) | Freiheiten zählen: „Wie viele Freiheiten hat dieser Stein?“ |
| s2 | Fang in 1: ein Stein mit einer Freiheit |
| s3 (5. Kl.) | Fang in 1 bei Gruppen; „Welcher deiner Steine ist in Gefahr?“ |
| s4 | Retten: der eigene Stein steht im Atari — verlängern statt gefangen werden |
| s5 (6. Kl.) | Fang in 2: Leiter und Netz |
| s6 👑 | Fang in 2 mit falscher Fährte (der naheliegende Zug scheitert) |

### 2.3 König in der Falle (Matt in 1) — mit wenigen Figuren

Nur König, Dame, Turm in den ersten Stufen, später Läufer, Springer, Bauer. Zugregeln in Hilfe und Tipp; jede
Aufgabe ist ein Matt in 1 mit genau einer Lösung. Die Stellungen stehen in einer Inhaltsliste (`stellungen.js`),
ungeprüft bis zum Prüfstand.

| Stufe | Inhalt |
|---|---|
| s1 (4. Kl.) | Turm und König gegen König am Rand |
| s2 | Dame und König gegen König |
| s3 (5. Kl.) | zwei Türme; Matt mit Dame mit Deckung |
| s4 | mit Läufer und Springer; der König hat mehr Fluchtfelder |
| s5 (6. Kl.) | eigene Figuren verstellen den Weg, Schlagen als Matt |
| s6 👑 | Matt in 2 (der erste Zug ist ein Opfer oder ein stiller Zug) |

## 3. Namen

Stein-Duell, Steine fangen, König in der Falle — kein Grundwort doppelt mit vorhandenen Namen (Detektiv, Sortierer,
Puzzle über der Grenze); vor dem Bau mit dem Testskript nachzählen.

## 4. Entscheide (Patrik, 03.11.2026)

- **ST1 a:** Lernziel MI.2.2 (Stufe .b), Thema „Strategie“ im Fach Medien und Informatik, für alle drei Spiele.
- **ST2 a:** Basisklasse 5 (Stufe 1 = 4. Klasse, Stufe 5 = 6. Klasse).
- **ST3 a:** Zugregeln nur in Hilfe und Tipp, dazu in s1 und s2 die möglichen Züge der angetippten Figur
  einblenden; alle Stufen bleiben Rätsel. **Dazu** (Wunsch Patrik): Jedes der drei Spiele hat eine eigene
  **Regelseite**, erreichbar vom Startblatt und aus der Hilfe — als Baustein des Rahmens für ähnliche Fälle
  (rahmen.md Abschnitt 16).
- **SD1 a:** Stein-Duell s1/s2 mit wechselnder Höchstzahl je Zug (s1: 2–4, s2: 2–3) statt „nimm 1–2“.
- **SF1 a:** Steine fangen, letzter Tipp in s1/s2 zeigt Nachbarpunkte bzw. Freiheiten aller weissen Gruppen, nicht die Lösung.
- **SF2 a:** Go-Koordinaten A–I ohne Lücke.
