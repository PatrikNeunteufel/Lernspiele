# Lehrplan SG — Lernziele der Spiele aus LERN_Session14

## Hilfsmittel als eigene Spiele (Entscheid HM1 a)

Ideenliste: [hilfsmittel.md](../spielideen/hilfsmittel.md). Wortlaut von MA.1.B.3 am 2026-11-04 von sg.lehrplan.ch
gelesen (Kompetenzseite `a|5|0|1|2|3`, Seitenstand „Lehrplan Volksschule August 2025“); nur diese Seite. MA.1.A.2 nach
der früheren Auswertung in [lehrplan_sg_spielideen.md](../spielideen/lehrplan_sg_spielideen.md), nicht neu gelesen.

**Basisklasse 2:** s1 = 1. Klasse (bis 20), s3 = Klassenziel (bis 100, Muster der Reihen), s5 = 3. Klasse
(Tausenderbuch), s6 = Königsstufe.

| Lernziel | Spiel | Stufen im Spiel (s1 → s6) |
|---|---|---|
| MA.1.B.3 (`.b` Punktefeld, 100er-Tafel und Zahlenstrahl beim Erforschen arithmetischer Muster nutzen, z. B. die Positionen der 9er-Reihe auf der 100er-Tafel), MA.1.A.2 (`.c` 100er-Tafel, Zählen in Schritten; `.d/.e` bis 1000) | Hundertertafel-Detektiv (H2) | Streifen 2 × 5 bis 20, eine Lücke, alles andere sichtbar (Vorstufe zu `.b`) → 3 × 3 bis 50, nur die Nachbarn der Lücke sichtbar; Zahl auf der Tafel suchen mit Rand (`.b`, MA.1.A.2.c) → Puzzleteil bis 100 mit einem Feld, gesucht ein Nachbar auch schräg (± 1, ± 10, ± 9, ± 11); 2er-, 5er-, 10er-Reihe gelb, die nächste antippen (`.b`) → weite Sprünge bis 2 Zeilen und Spalten; 3er-, 4er-, 6er- und 9er-Reihe (`.b`, Lehrplan-Beispiel); Suchen nur mit den Ecken → Seiten des Tausenderbuchs 101–1000: Puzzleteile und Suchen (MA.1.A.2.d/e) → Sprünge bis 3 Zeilen und Spalten im Tausenderbuch; 7er-, 8er-, 9er-, 11er-, 12er-Reihe |

## Annahmen (mit dem Lehrmittel abzugleichen)

- **Die Tafel beginnt bei 1** (1 … 100, im Tausenderbuch 301 … 400). Beginnt sie im Zahlenbuch bei 0, genügt im Spiel
  `START = 0` (eine Stelle im Code, alles andere rechnet damit).
- **Reihen nur auf der 100er-Tafel**, auch in Stufe 6; im Tausenderbuch nur Lücken und Suchen.
- **Stufe 1 ohne Antippen:** in der 1. Klasse nur der Streifen bis 20 mit Eintippen; ob die 1. Klasse die 20er-Tafel
  so kennt, ist offen (sonst Zwanzigerfeld, H1).
