# LERN_Session29_2026-11-11_animationen-block-m4

## Schwerpunkt
Abschluss-Animationen weiter ausgerollt: Block M4 (Sachrechnen, Grössen), M5 (Geometrie) und Block A (Mathe M6 und
Deutsch Teil 1) — 58 Spiele; dazu eine Prüfung für Lage und Schrift aller Animationen (Prüfer-Kandidat aus
LERN_Session28) und zwei Befunde am Rahmen, die schon abgenommene Bilder betrafen (Stellen-Detektiv, Scheinwerfer im
Instrumenten-Kenner). Auftrag Patrik: die übrigen Spiele in vier Blöcken A bis D. Commits `fef042d` bis `b9dcdf6`
(M4, Prüfung, M5 in zwei Commits); Block A und dieser Abschluss noch offen. Nichts gepusht (zehn Commits vor
`origin/master`).

## Neu
- **Block M4** (12 Spiele): Uhr und Stoppuhr, Kasse mit Münzen und Noten wie im Spiel (Geld nach der Klasse der Stufe),
  Einheiten-Treppe mit Auslegen und Lineal, Messband mit Lupen, Zug mit Fahrplantafeln (auch über Mitternacht),
  Kompass auf dem Rechenweg, Bilderbuch, Gleichungskarten mit Probe, Schätz-Waage, Wippe und Pakete. ZYKLUS nimmt eigene
  Bilder. Erstmals Bildzeichen (Emoji) aus den Inhaltslisten der Spiele in den Bildern.
- **Prüfung Lage und Schrift** (`tools/feier_geometrie.js`, aufgerufen von `tools/pruefe_spiele.js`): rechnet am ruhigen
  Endbild mit 3 Sternen ohne Layout nach, ob ein Text unter 9 Einheiten liegt oder ein Teil mehr als 1,5 Einheiten über
  den Rand ragt (Transformationen, Kurven über Punkte auf der Kurve, Bögen über den Mittelpunkt, Textbreite gegen
  `getBBox` abgeglichen); vierzehn Gegenproben bei jedem Lauf. Fand zwei echte Fehler (Krone der Stoppuhr,
  „≈ 7 000 000“ der Runden-Rutsche).
- **Block M5** (13 Spiele): Spiegelbilder im Raster, Hundertertafel und Koordinaten, Formen und Körper, Häuschen mit
  Umfang, Pentomino-Puzzle (lückenlos geprüft), Würfelgebäude wie im Würfelbau-Blick mit berechneten Ansichten, Netz und
  Körper, Rechtecke mit Fläche und Umfang, Würfel-Kipper mit Kippregel und Startlage des Spiels, Fachzeichen der
  Geometrie, Merk-Blick, Würfel vergleichen (gleicher Massstab), Quader und Liter.
- **Block A** (23 Spiele): Brüche (Pizza, Schoggitafel, Prozent-Brücke), Mittelwert-Türme, Diagramme (Strichliste,
  Säulen, Kreis, Linie), Zufalls-Skala nach den Regeln des Spiels, Sortier-Kiste, alle Kombinationen; Deutsch ohne
  Lesetext: Silbenbögen, Reim-Paare, Sockenpaare mit Buchstaben, Laternen, Zoom ins Bild (Lupe, Fernglas), Spürnase,
  Puppentheater, Steg, ABC-Steine, Bausteine der Wörter, Papierstreifen, Tastatur, Bildstreifen. AUFTRITT und KARTE
  nehmen eigene Bilder.

## Geändert
- **Stellen-Detektiv** (M1, abgenommen): Felder unter den Ziffern bewegt wie ruhig zart (Entscheid Patrik a nach
  Vergleich im Browser; vorher bewegt voll farbig, dunkle Ziffern auf kräftigem Grund).
- **Rahmen `erscheine`**: blendet bis zur eigenen Deckkraft eines Teils statt immer bis 1 — die Ursache des Befunds
  oben. Im Browser über alle 91 Spiele gesucht: betroffen nur der neue Figuren-Spiegel und der **Scheinwerfer im
  Instrumenten-Kenner (P6, abgenommen)**, der jetzt auch bewegt zart ist wie im ruhigen Bild.
- `zeichne` (Linien, die sich zeichnen): gestrichelte Linien blenden ein, sonst ginge ihre Strichelung verloren.
- Ausrollplan im Konzept: statt „D, N, F“ die vier Blöcke A bis D (Auftrag Patrik).
- Doku: docs/eulenpfad/rahmen.md 24 (Bilder M4, M5, A; Prüfung Lage und Schrift), Konzept Abschnitt 7 (Status,
  Abweichungen je Block), CHANGELOG je Schritt.

## Spiele mit Abschluss-Animation (91 von 169, Katalog `einstellungen: ["feier"]`)

| Gruppe | Spiele | Stand |
|---|---|---|
| Piloten (8), M1 (10) | wie in LERN_Session28 | abgenommen; Tresor nachgebessert, Stellen-Detektiv und Scheinwerfer (P6) nach Entscheid a geändert — Abnahme offen |
| M2 (12), M3 (13) | wie in LERN_Session28 | Abnahme offen |
| M4 Sachrechnen, Grössen (12) | Uhr-Werkstatt, Kiosk-Kasse, Masse-Umwandler, Schätz-Waage, Rechengeschichten, Flächenmass-Treppe, Gegenteil-Wippe, Sachaufgaben-Kompass, Fahrplan-Rechner, Komma-Messband, Platzhalter-Geschichten, Zeit-Schätzer | Abnahme offen |
| M5 Geometrie (13) | Spiegel-Raster, Koordinaten-Schatzsuche, Formen-Detektiv, Flächen-Pixel, Pentomino-Puzzle, Würfelbau-Blick, Netz-Falter, Rechteck-Labor, Würfel-Kipper, Begriffs-Geodreieck, Merk-Blick, Würfel-Zähler, Quader-Volumen | Abnahme offen |
| A M6 und Deutsch Teil 1 (23) | Bruch-Pizzeria, Schoggi-Brüche, Prozent-Brücke, Mittelwert-Türme, Daten-Detektiv, Diagramm-Wahl, Zufalls-Skala, Sortier-Kiste, Möglichkeiten-Finder, Silben-Klatscher, Reim-Paare, Buchstaben-Zwillinge, Blitzlesen, Lese-Detektiv, Wort-Spürnase, Sachtext-Spurensuche, Figuren-Spiegel, Regel-Lücke, ABC-Sortierer, Morphem-Schere, Trenn-Schere, Tipp-Trainer, Geschichten-Ordner | Abnahme offen |

Noch ohne: 78 Spiele — Block B (25): satz-reparatur woerter-trenner fehler-lupe komma-jagd rede-zeichen korrektur-stift
wortarten-sortierer nomen-puzzle zeitreise-verben verben-faecher wortarten-probe gedicht-baukasten gattungs-kenner
hoer-reporter gefuehle-radar hoer-geschichte jahreskreis frueher-heute zeitstrahl-sortierer erdzeit-leiter
tageslauf-sonne kulturen-koffer echt-oder-erfunden gemeinde-helfer schulweg-profi; Block C (24): magnet-labor
schwimmt-sinkt stromkreis-bauer hebel-wippe wassertropfen-reise energie-wandler bionik-paare koerper-puzzle
znueni-teller blutkreislauf-lotse braille-finger auge-entdecker laerm-waechter kompass plan-leser teddy-versteck
tier-sortierer lebensraum fledermaus-forscher lebenszyklus pflanzen-bestimmer wetter-jahreszeiten taschengeld-planer
kakao-weg; Block D (29): Englisch (8), Französisch (8), Musik (6), Medien und Informatik (7).

## Stolperfallen
- **Bildschirmfotos zeigten oft einen alten Stand** (wie in LERN_Session28): nach dem Anhalten der Animation immer ein
  zweites Foto, bevor ein Befund gilt. Mehrfach sah ein fertiges Bild halbfertig aus.
- **`erscheine` überschrieb die Deckkraft** (opacity 0 → 1): zarte Teile wurden bewegt voll deckend, ruhig blieben sie
  zart. Dreimal getroffen (Stellen-Detektiv, Hundertertafel der Koordinaten, Scheinwerfer), erst dann an der Ursache
  behoben. **Prüfer-Kandidat:** bewegtes und ruhiges Endbild vergleichen (gleiche Deckkraft je Teil) — fängt jede
  Abweichung zwischen beiden Fassungen, nicht nur diese.
- **Ungültige SMIL-Werte verwirft der Browser still:** `keySplines` über 1 (die Wippe stand waagrecht), `animateTransform`
  mit `matrix`, `set` auf `style`. Die Prüfung kennt nur die Art von `animateTransform`. **Prüfer-Kandidat:** auch
  `keySplines` (0 … 1) und `attributeName` (nicht `style`) prüfen.
- **Transformationen, die eine Bewegung überschreibt:** `vonOben`, `schiebe` und `bewege` setzen `transform` am selben
  Element — Dinge mit eigener Lage brauchen eine Gruppe darum. Mehrfach beim Bauen gefunden.
- **Eigene Schätzungen in der Prüfung:** die erste Fassung der Lage-Prüfung meldete 114 Stellen, zwei waren echt
  (Stützpunkte von Kurven, Leerzeichen so breit wie Ziffern). Erst der Abgleich mit `getBBox` im Browser trennte.
- **Doppelte Namen in `feier.js`:** `zeitText` und `saeckchen` waren schon vergeben (die Skriptprüfung fand sie). Eine
  zweite gleichnamige Funktion verdeckte die erste still; vor jedem Block die Namen prüfen.
- **Massstab beim Vergleichen:** Gebäude im Würfel-Zähler waren je für sich eingepasst — ein Turm aus 5 Würfeln so hoch
  wie einer aus 3. Was verglichen wird, braucht denselben Massstab.
- **Hooks** wiesen richtig ab: `cd` auf oberster Ebene, Backslash im Heredoc.

## Verifikation
- Kurz ganz (`node tools/pruefe.js`, zuletzt nach Block A): Skripte „Keine Fehler.“, Kern „5916 Fälle, 0 Fehler.“,
  Server „59 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung
  „Keine Fehler.“
- Eulenpfad, Stichproben: je Block alle Spiele des Blocks; dazu himmels-forscher, rechen-rakete, dezimal-rakete (M4),
  alle 55 und dann 68 Spiele mit Animation (Prüfung Lage), stellen-detektiv, instrumente (Block A) — „Keine Fehler.“
  **Letzter voller Lauf weiter auf `6055527`.**
- Im Browser: alle Endbilder der drei Blöcke in Handybreite (rund 390 px) und den Ablauf mitten drin angesehen;
  Gegenprüfung mit `getBBox` über alle 91 Spiele × 6 Stufen: nichts über dem Rand, kein Text unter 9 Einheiten.

## Offene Punkte / Plan für die nächste Session
1. **Block B** (Deutsch Teil 2, NMG Teil 1; 25 Spiele, Liste oben) wie Block A: Konzeptideen und Stufen lesen, Bilder
   bauen, jedes Endbild und den Ablauf ansehen; danach Block C und D.
2. **Abnahme** durch Patrik in der Vorschau: M2, M3, M4, M5, Block A; dazu Tresor, Stellen-Detektiv und der
   Scheinwerfer im Instrumenten-Kenner (beide nach Entscheid a geändert). Neu zur Abnahme: Bildzeichen (Emoji) in den
   Bildern, Deutsch ohne Lesetext, Buchstaben in ABC-Sortierer und Buchstaben-Zwillingen.
3. **Voller Eulenpfad-Lauf** auf Patriks Entscheid vor dem nächsten Push (seit `6055527` nur Stichproben).
4. Prüfer-Kandidaten aus den Stolperfallen: bewegtes gegen ruhiges Endbild, `keySplines` und `attributeName`.
5. Danach wie im Handover: Rückmeldung zur Gestaltung als Konzept; Inbetriebnahme des Meldungsservers (Patrik).
