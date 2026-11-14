# Ganze Aufgabe im Bild — offene Punkte (Stand LERN_Session42, 2026-11-14)

Entscheide BH1 a, BH2 a, BH2-T a, BH3 a sind umgesetzt (rahmen.md Abschnitt 20). Gemessen mit `tools/bildhoehe.js`
(Zufallsaufgaben, Streuung um einige Dutzend Pixel). Zahlen: wie weit die **Aufgabe selbst** (ohne Tipp-Zeile) über den
unteren Rand ragt, in px, höchster Wert über die gemessenen Stufen.

## Messung LERN_Session42 (2026-11-14)

Alle 175 Spiele, sechs Stufen, die vier Geräte von BH1 a (Handy 375×812, Tablet 768×1024, quer 1024×768, Laptop
1366×768; nicht die sichtbare Fläche von GR1 a) — 4200 Seiten, mit dem Werkzeug nach LERN_Session41 (Handy und Tablet
ohne Tastenmarken). Die 30 auffälligen Spiele zweimal nachgemessen. Das Werkzeug misst nur die **erste** Aufgabe jeder
Stufe; welche das ist, entscheidet der Zufall. Darum unten getrennt: über den Rand in allen drei Läufen, und nur bei
einer Aufgabenart (in einem oder zwei Läufen). Zahlen in px, höchster Wert der drei Läufe. Seit BW1 a misst das
Werkzeug jede Seite mehrmals (`--ziehungen`, Vorgabe 5) — die Liste ist mit einer Ziehung je Lauf entstanden.

**In allen drei Läufen über dem Rand:**

| Spiel | Stufe | Gerät: px | Was |
|---|---|---|---|
| weather-report | s5 | Handy 123, quer 134, Laptop 134 | Stadtplan zum Weg (rund 420 px hoch); dazu die Meldung „Stimme hat nicht gesprochen“ im Messbrowser |
| hoch-tief-ohr | s6 | quer 12, Laptop 12 | — |
| braille-finger | s5 | quer 8, Laptop 8 | — |
| fahrplan-rechner | s4 | Handy 8 | — |
| koordinaten-schatz | s2 | Laptop 7 | (s3, s4 bis 8 in ein oder zwei Läufen) |
| son-lauscher | s6 | Handy 5 | — |

weather-report s5: *erledigt 2026-11-14 (LERN_Session42)* — breit und quer Plan neben Bild, Knopf und Frage, bis 820 px
Bildhöhe Plan enger und Bild mit „nochmal“ in einer Zeile; mit gewöhnlicher Sprechblase Handy 45 px Luft, 1024×768 und
Laptop 165 px. `bildhoehe.js` meldet auf dem Handy noch 19 px: die Meldung „Stimme hat nicht gesprochen“ des Messbrowsers
(rund 64 px höher als die gewöhnliche Blase).

**Nur bei einer Aufgabenart** (in den anderen Läufen passt dieselbe Stufe):
kulturen-koffer quer s5/s6 443, s4 298, Handy s5 238, Tablet s4/s6 134 · plan-leser Handy s6 333, s5 288, s1–s3 bis 53,
Laptop s6 56 (s5/s6 Weg beschreiben: Ausnahme Punkt 4) · diagramm-wahl Handy s5 473, s6 119, s1 32 (s5 Tabelle:
Ausnahme) · quader-volumen Handy s4 128, s6 30 (s4 zerlegen: Ausnahme) · sachaufgaben-kompass quer s4 108, Handy s4 91,
Laptop s4 89, Handy s2 31 · netz-falter Handy s5 103, Laptop s6 70, quer s5 48 · diagramm-detektiv Tablet s5 101, Handy
s6 79, s3–s5 49 · hello-dialog quer/Laptop s5 88, Handy s5 27 · fledermaus-forscher Laptop s5 87, Handy s4–s6 47 ·
calendrier Handy s5 58 (Stimme fehlt im Messbrowser) · au-cafe Handy s4 56, s6 29 · rechen-maschine Tablet s6 51
(dreimal dieselbe Aufgabe zuerst; eine andere passt mit 334 px Luft) · kompass Laptop s5 38 · zehntel-lupe Tablet s5/s6
37 · wassertropfen-reise Handy s6 33, s2 23 · quelle-heure Handy s3 27, quer s4 15, Laptop s6 15 · bionik-paare Handy s6
23 · hundertertafel quer/Laptop s5 21 · unter 15: znueni-teller, geschichten-ordner, finger-zaehler, zahlen-baukasten,
schriftlich-werkstatt.

**Seitlich:** prozent-bruecke Handy s6 17 px, quader-volumen Handy s3 4 px — je in einem Lauf, in beiden Nachmessungen
nicht. **Einzelwerte ohne Wiederholung:** hundertertafel quer s4 1023 px, zahlen-baukasten quer s3 678 px (je ein Lauf;
bei hundertertafel ragt in allen Stufen bei 1024×768 nur die Tipp-Zeile 54 px über den Rand, die Aufgabe nicht).

**Grafik geschrumpft (H1 a):** 15 Handy-Seiten gemeldet (Runden-Rutsche, Dezimal-Rutsche, Zehntel-Lupe,
Zahlenstrahl-Pfeil, Zeitstrahl-Sortierer, Rhythmus-Leser) — alle mit `width: 100%`, auf dem Handy also nach der
**Breite** kleiner, nicht nach der Bildhöhe. Das Werkzeug vergleicht den Massstab nur mit 1024×768 und hält das für
Schrumpfen (Fehlmeldung; Session 28 mass das Handy nicht). Behoben mit BW2 a: volle Breite gilt nicht als
geschrumpft, der Massstab ist der des gezeichneten Inhalts (rahmen.md 20).

**Gegenüber Punkt 3 unten (LERN_Session13):** punkte-blitz, laerm-waechter, stromkreis-bauer passen jetzt;
weather-report schlechter (Handy 79 → 123, quer und Laptop 74 → 134); netz-falter Laptop 12 → bis 70 (eine Aufgabenart);
plan-leser Handy 240 → bis 333 (Weg beschreiben).

Rohdaten (gitignored): `.temp/bildhoehe/alle_2026-11-14.json`, `nach_a.json`, `nach_b.json`.

## Entscheid GR1 (Patrik, 2026-11-04)

- **GR1 a gilt:** Ziel ist die sichtbare Fläche im Browser — Handy 375×660, Tablet 768×950 und 1024×690, Laptop
  1366×650. Dazu verdichtet der Rahmen unter 700 px Höhe (Probe `niedrig_probe.css`: Kopfzeile, Eule 40 px, Knöpfe 46 px,
  Abstände), und ein Knopf ⛶ „Vollbild“ steht auf Geräten mit Maus unter 650 px Höhe in der Kopfzeile.
  **Umsetzung in der nächsten Sitzung** (Wunsch Patrik: aktuelle Arbeiten fertig, dann neu).
- **GR1 b zurückgestellt:** Alles auch bei 1000×500 ohne Vollbild (Laptop mit 200 % Skalierung) — „kann später
  vielleicht auf b geändert werden, aktuell so bleiben“.

Gemessen (Spiele, deren Aufgabe selbst über den Rand ragt):

| sichtbare Fläche | heute | mit Verdichtung unter 700 px |
|---|---|---|
| Handy 375×660 | 62 | 30 |
| Tablet hoch 768×950 | 3 | – |
| Tablet quer 1024×690 | 13 | 0 |
| Laptop 1366×650 | 25 | 4 |
| 1000×500 (GR1 b, zurückgestellt) | 124 | 74 |
| 1000×600 (Vollbild) | – | 20 |

## Offen

1. **GR1 a umsetzen:** Verdichtung unter 700 px in `stil.css`, Vollbild-Knopf, Messgeräte der sichtbaren Fläche als
   Vorgabe in `tools/bildhoehe.js`; danach eine Runde je Spiel für den Rest (Handy-Liste unten).
2. **Rest auf der sichtbaren Handy-Fläche** (mit Verdichtung gemessen): gefuehle-radar 92, calendrier 91 (Stimme fehlt im
   Messbrowser), gerecht-teiler 76, diagramm-detektiv 71, geheimschrift-knacker 70, kakao-weg 67, malkreuz 65,
   kiosk-kasse 60, glace-kombinator 58, hebel-wippe 55, quader-volumen 50, bionik-paare 48, roboter-pfad 44,
   punkte-blitz 41, tier-sortierer 39, znueni-teller 38, zahlenmauer 36, gattungs-kenner 30, zufalls-skala 30,
   reim-paare 21, au-cafe 20, braille-finger 20, schwimmt-sinkt 20, rhythmus-diktat 18, rechen-maschine 18,
   taschengeld-planer 16, gemeinde-helfer 14, zahlenhaus 12, flaechen-pixel 6, blutkreislauf-lotse 3.
   Laptop 1366×650: rhythmus-leser 20, stromkreis-bauer 19, braille-finger 11, tier-sortierer 5.
3. **Rest auf Bildschirmgrössen** (ohne Leisten, alle Stufen): plan-leser Handy 240, weather-report Handy 79 / quer und
   Laptop 74, punkte-blitz Handy 65, laerm-waechter quer 55, stromkreis-bauer quer 14, netz-falter Laptop 12.
4. **Begründete Ausnahmen der Bau-Helfer** (BH3, prüfen, ob sie bleiben): plan-leser Weg beschreiben (s5/s6, Handy, bis
   348 px), diagramm-wahl s5 Tabelle (Handy, Diagramme sonst unter 10 px Schrift), glace-kombinator Kleider-Sets
   zählen (s5/s6, Handy), kakao-weg s6 Schritte ordnen, quader-volumen s4 zerlegen und s6 Aquarium, zahlen-baukasten s6
   (sechs ausgeschriebene Bausteine), hebel-wippe s6 (langer Auftrag), diagramm-detektiv Handy (Tabelle mit Diagramm),
   malkreuz s6 3×2-Rätsel.
5. **Wünsche an den Rahmen** (aus BH3): Baustein „Element an die restliche Höhe anpassen“ für Grafiken (statt
   `100vh − …px` je Spiel); Tastatur-Anordnung (2)/(3) auch für eigene Tastaturen (Geheimschrift-Knacker); Baustein
   „Bild links, Rest rechts“ für breit und quer; allgemeine Grösse für `.knopf.klein`.
6. **Sachaufgaben-Kompass, Ergebnis-Schritt auf dem Handy:** läuft schon ohne Notizen über (s3–s6 55–270 px, die
   Zifferntastatur nicht ganz im Bild); mit Notizen auch s2 (39–77 px). Das Messwerkzeug sieht es nicht, weil es nur
   den ersten Schritt misst (Befund Notiz-Paket A). Zu entscheiden: Notizen auf dem Handy in s2 lassen; den
   Ergebnis-Schritt selbst verdichten.
7. **Messwerkzeug:** *erledigt 2026-11-14 (LERN_Session42, BW1 a: `--ziehungen`, Vorgabe 5; Hörspiele weiter offen).*
   Eine Option „alle Aufgabenarten“ oder mehrere Ziehungen je Stufe (Fälle wie energie-wandler bis
   397 px zeigte erst eine Stichprobe); Hörspiele messen ohne Stimme (Eule meldet den Sprechfehler, die Blase wird länger).
