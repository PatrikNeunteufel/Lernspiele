# Ganze Aufgabe im Bild — offene Punkte (Stand LERN_Session13, 2026-11-04)

Entscheide BH1 a, BH2 a, BH2-T a, BH3 a sind umgesetzt (rahmen.md Abschnitt 20). Gemessen mit `tools/bildhoehe.js`
(Zufallsaufgaben, Streuung um einige Dutzend Pixel). Zahlen: wie weit die **Aufgabe selbst** (ohne Tipp-Zeile) über den
unteren Rand ragt, in px, höchster Wert über die gemessenen Stufen.

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
7. **Messwerkzeug:** eine Option „alle Aufgabenarten“ oder mehrere Ziehungen je Stufe (Fälle wie energie-wandler bis
   397 px zeigte erst eine Stichprobe); Hörspiele messen ohne Stimme (Eule meldet den Sprechfehler, die Blase wird länger).
