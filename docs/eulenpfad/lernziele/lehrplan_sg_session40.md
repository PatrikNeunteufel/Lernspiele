# Lehrplan SG — Lernziele der Spiele aus LERN_Session40

## Sudoku-Familie (LERN-56; Entscheide SU1 a–SU3 a, LERN_Session13)

Thema „🧠 Logikrätsel“ im Fach Mathematik (SU2 a). Den Lehrplan habe ich in dieser Sitzung **nicht neu gelesen**. Der
Wortlaut unten steht in [strategie_raetsel.md](../spielideen/strategie_raetsel.md), Abschnitt 1, am 03.11.2026 mit
`tools/lehrplan_sg_lesen.py` von sg.lehrplan.ch gelesen. Sudoku nennt der Lehrplan dort nicht; die Zuordnung ist eine
Annahme.

- **MA.1.B.1.f** (2. Zyklus, Orientierungspunkt, Ende 4. Klasse): „lassen sich auf offene Aufgaben ein, erforschen
  Beziehungen, formulieren Vermutungen und suchen Lösungsalternativen.“
- **MA.1.B.1.h** (2. Zyklus, Grundanspruch, 5./6. Klasse): „können heuristische Strategien verwenden: ausprobieren,
  Beispiele suchen, Analogien bilden, Regelmässigkeiten untersuchen, Annahmen treffen, Vermutungen formulieren.“

**Basisklasse 4** (SU1 a): s1 = 3. Klasse, s3 = Klassenziel, s5 = 5. Klasse, s6 = Königsstufe.

| Lernziel | Spiel | Stufen im Spiel (s1 → s6) |
|---|---|---|
| MA.1.B.1 (`.f` Beziehungen erforschen: in welches Feld passt nur eine Zahl, wo hat eine Zahl nur einen Platz; `.h` Annahmen treffen und prüfen mit den ✏️-Notizen) | Zahlen-Sudoku | s1 4 × 4, 6 leere Felder, nur „ein Feld, eine Zahl“ · s2 4 × 4, 10 leer · s3 6 × 6 (Kästen 2 × 3), 18 leer · s4 6 × 6, 24 leer, eine Zahl mit nur einem Platz nötig · s5 9 × 9, 45 leer · s6 9 × 9, 54 leer, eine Zahl mit nur einem Platz nötig |

**Gebiets-Sudoku, Basisklasse 4** wie das Zahlen-Sudoku, mit unregelmässigen Gebieten statt Kästen (Zusatz Patrik zu
SU1 a).

| Lernziel | Spiel | Stufen im Spiel (s1 → s6) |
|---|---|---|
| MA.1.B.1 (`.f`, `.h` wie beim Zahlen-Sudoku; dazu die Form der Gebiete lesen) | Gebiets-Sudoku | s1 4 × 4, 8 leer · s2 5 × 5, 13 leer · s3 6 × 6, 18 leer · s4 6 × 6, 22 leer, „versteckt“ nötig · s5 9 × 9, 45 leer · s6 9 × 9, 52 leer, „versteckt“ nötig |

**Vergleichs-Sudoku, Basisklasse 3** (SU1 a: < und > zwischen Nachbarfeldern statt vieler Vorgaben): s1 = 2. Klasse,
s3 = Klassenziel 3. Klasse, s5 = 4. Klasse. Dazu MA.1.A.1 („Anzahlen und Zahlen vergleichen: grösser, kleiner, <, >“, im
Katalog seit LERN_Session2, an sg.lehrplan.ch geprüft).

| Lernziel | Spiel | Stufen im Spiel (s1 → s6) |
|---|---|---|
| MA.1.A.1 (Zahlen vergleichen mit < und >), MA.1.B.1 (`.f`, `.h`: aus Zeichen schliessen) | Vergleichs-Sudoku | Zeichen an jeder Kante im Kasten; s1 4 × 4, 10 leer · s2 4 × 4, 12 leer · s3 6 × 6, 26 leer · s4 6 × 6, 30 leer, Zeichen zwischen zwei leeren Feldern nötig · s5 6 × 6 ohne vorgegebene Zahl · s6 9 × 9 mit neun Zahlen, Zeichen zwischen leeren Feldern nötig |

**Bilder-Sudoku, Basisklasse 1** (SU1 a: „Basis Kindergarten/1. Klasse“; Spiele für den Kindergarten haben Basisklasse
1, Stufe 1 ist der Kindergarten): s3 = Klassenziel 1. Klasse, s5 = 2. Klasse.

| Lernziel | Spiel | Stufen im Spiel (s1 → s6) |
|---|---|---|
| MA.1.B.1 (1. Zyklus; Beziehungen erforschen ohne Zahlen: in welches Feld passt nur noch ein Tier) | Bilder-Sudoku | immer 4 × 4 mit 🐶 🐱 🐰 🐸; leere Felder s1 3 · s2 5 · s3 7 · s4 9 · s5 11 · s6 12 |

## Annahmen (mit dem Lehrmittel abzugleichen)

- **Bilder-Sudoku zu MA.1.B.1 im 1. Zyklus:** Den Wortlaut der Kompetenzstufen des 1. Zyklus (`.a` bis `.c`) habe ich
  nicht gelesen; gelesen sind nur `.f` und `.h` (2. Zyklus). Vor der Freigabe den Wortlaut von MA.1.B.1 im 1. Zyklus
  nachlesen.
- **Bilder-Sudoku, Stufen nur über die Zahl leerer Felder:** Ein 4 × 4 lässt sich bis 12 leere Felder immer mit „in
  dieses Feld passt nur noch ein Tier“ lösen (gemessen, je 300 Rätsel); schwerere Schritte gibt es dort nicht. Ob 12 leere
  Felder (nur vier Tiere vorgegeben) in der Königsstufe für die 1./2. Klasse passen, zeigt erst das Spielen.

- **Zahlen-Sudoku zu MA.1.B.1.f und .h:** Der Lehrplan nennt Sudoku nicht. Führt das Lehrmittel (Schweizer Zahlenbuch,
  mathbuch) Sudoku unter einem anderen Thema, kippt SU2 a (so in der Vorlage vermerkt).
- **Zahlen-Sudoku, 4 × 4 schon in der 3. Klasse** (Stufe 1): nur Felder, in die eine einzige Zahl passt; ob die 3. Klasse
  Sudoku kennt, ist offen.
- **Zahlen-Sudoku, keine schwereren Schritte als „versteckt“:** Jedes Rätsel lässt sich mit den beiden Schritten lösen,
  die der Tipp zeigt (ein Feld mit nur einer möglichen Zahl, eine Zahl mit nur einem Platz). Paare, Ausschluss über
  Kästen und Probieren verlangt keine Stufe; ob die Königsstufe damit herausfordernd genug ist, zeigt erst das Spielen.
