# Lernziele LERN_Session11 — Strategie-Rätsel

Entscheide S1 a, ST1 a, ST2 a, ST3 a (Patrik, 03.11.2026); Vorlage und Wortlaut des Lehrplans in
[strategie_raetsel.md](../spielideen/strategie_raetsel.md). Lehrplan neu gelesen am 03.11.2026 mit
`tools/lehrplan_sg_lesen.py` (sg.lehrplan.ch).

| Spiel | Basisklasse | Lernziel | Stufen |
|---|---|---|---|
| Stein-Duell (`stein-duell`) | 5 | MI.2.2 (Stufe .b: „eine Spielstrategie entwickeln“) | s1 eine Reihe, k = 2–4 · s2 7–12 Steine · s3 bis 20, k = 3 · s4 „Wer fängt an?“ · s5 zwei Reihen · s6 drei Reihen oder „wer den letzten nimmt, verliert“ |
| Steine fangen (`steine-fangen`) | 5 | MI.2.2 (.b) | s1 Freiheiten zählen · s2 Fang in 1 · s3 Gruppen fangen, Gefahr erkennen · s4 retten · s5 Fang in 2 · s6 Fang in 2 mit falscher Fährte |
| König in der Falle (`koenig-falle`) | 5 | MI.2.2 (.b) | s1 Turm · s2 Dame · s3 zwei Türme, Dame mit Deckung · s4 Läufer, Springer · s5 eigene Figuren verstellen · s6 Matt in 2 |

Thema neu: **Strategie** (Fach Medien und Informatik). Jedes Spiel hat eine Regelseite (`regeln.html`, rahmen.md 16).

## Annahmen und offene Punkte

- **Einordnung 5./6. Klasse:** Medien und Informatik ist in St. Gallen ein Fach ab der 5. Klasse; MI.2.2.b steht im 2.
  Zyklus ohne Grundanspruch. Stufe 1 (4. Klasse) ist damit ein Vorgriff.
- **Stein-Duell s1/s2:** abweichend von der Vorlage „nimm 1–2“ erlaubt das Spiel bis 4 bzw. 3 Steine je Zug, weil
  „nimm 1–2“ nur 3 bzw. 6 verschiedene Gewinnstellungen ergibt (zu wenig für eine Runde mit 8 Aufgaben). Vorlage an Patrik.
- **Steine fangen:** Atari-Go = wer zuerst irgendeinen Stein fängt, gewinnt; einfaches Ko; Koordinaten A–J ohne I
  (Go-Brauch); Tipp mit Bild in s1/s2 zeigt Nachbarpunkte bzw. die Freiheiten aller weissen Gruppen, nicht die Lösung.
- **König in der Falle:** keine Rochade, kein en passant, keine Umwandlung (Stellungen, in denen sie zählten, sind
  ausgeschlossen); weisser König nie im Schach vor dem Zug; s6 die zäheste Verteidigung der Eule. 144 Stellungen,
  selbst gebaut und geprüft, als Inhaltsliste ungeprüft (Prüfliste Teil 83). Schachzeichen auf iPad/Android ungeprüft.
