# LERN_Session34_2026-11-12_darkmode-3c-3

## Schwerpunkt
Drei Stränge: (1) Darkmode Schritt 3c-3 (DM5 a, DM6 a, Funde im Rahmen, Kontrast über alle Seiten), danach DM2-K a
(Kinder schalten selbst um) und Schritt 4 (Bildkachel, DM3 a); (2) Stil „hand“ verspielter nach Wünschen Patriks —
gezeichnete Fach- und Themenblöcke, tanzender Titel, Motive in den Lücken des Kachelrasters mit Wirkung auf die
Nachbarkacheln, zwei realistische schwarze Löcher; (3) Hinweise Patriks aus dem Browser (Wassertropfen-Reise dunkel,
gestrichelte Kacheln, Timer-Knopf, Stimmzeile). 11 Commits, alle von Patrik (`245d65a` bis `7bb91df`); dieser Abschluss
noch zu committen. Keine offenen Entwickler-Bemerkungen zu Beginn (52 von 52 erledigt).

## Entscheide (Patrik, 12.11.2026)
- **G1 a** (Konzept Darkmode, Kipppunkt aus DM5): Helle Deko-Flächen mit Schrift behalten ihren Ton und tragen dunkle
  Schrift (gut 5,4, Hinweis 6,3, deko-3 4,7, deko-4 6,7, deko-5 5,2); weisse Schrift auf der dunkleren Fassung nur bei
  deko-1, 2, 6, 7. Grund: Am Farbmuster war der grüne Knopf `#218750` vom neuen Hunderter-Grün `#157f45` kaum zu
  unterscheiden (1,1), deko-3 und Hinweis wurden beide braun.
- **LU1 a** (Konzept Gestaltung): Motive zum Fach in den Lücken, mit Zusatz (Nachbarkacheln in Mitleidenschaft), vier
  Nachträgen (realistische schwarze Löcher in zwei Fassungen, Schlauch nach Skizze Patriks, alles dezent bewegt, Löcher
  wirken auf die Zeit) und dem Vorschlag Patriks, den Schlauch über den Klassen-Rand zu legen.
- **Titel „Eulenpfad“** tanzend im Stil „hand“; **Easter Eggs** zu besonderen Tagen vorgemerkt (nichts gebaut).
- **Timer-Knopf** nur die Uhr, das Wort daneben (FB2 a bleibt erfüllt); **Stimmzeile** nur für die Aufsicht.

## Neu
- **`tools/bilder_aufnehmen.js`:** Seiten (Spiel-Id, `start#tab`, Pfad im Repo) je Modus und Breite als Bild, mit
  `--vorher` (Code vor der Aufnahme), `--voll`, `--warte` (Bewegung zu mehreren Zeitpunkten), `--klasse`. Ersetzt die
  Skripte, die in LERN_Session33 dreimal von Hand entstanden (Prüfer-Kandidat von dort). Im Steckbrief eingetragen.
- **DM5 a / DM6 a / G1 a:** Stellenfarben hell `#d93a40`, `#1f74c0`, `#157f45`; Kern 1.42.1 `--k-knopf` `#5666f1`,
  `--k-leise` `#5e6179` (auch auf dem Himmel 4,6), dunkel `--k-knopf` `#8593ff`; `--deko-N-schrift` (Stufennummer,
  Titel), `--<farbe>-grund` mit `--auf-<farbe>` (Körbe, grüne Knöpfe, Timer an, Fach-Reiter, Klassenmarke);
  `LS.schriftFarbe`, `LS.flaeche`. Kopfzellen der Schriftlich-Werkstatt getönt statt halb durchsichtig.
- **DM2-K a:** Art `farben` im Muster VR1 a, ohne Angabe fest; `LS.farbenKnopf` (☀️/🌙 neben dem Namen), Freigabe im
  Profil unter „Was … selbst umstellen darf“; Seitentest „Aussehen“ mit 13 statt 6 Schritten.
- **Schritt 4 (DM3 a), Kern 1.43.0:** heller Satz unter `:root, .bildkachel`, `--k-bildgrund` in eigenem Block;
  Zeichnungen der Sammlung, Abschluss-Animationen, Kartenbilder und Abzeichen-Symbole mit `bildkachel`; dunkel auf dem
  warmen Bildgrund, hell unverändert. `pruefe_kern.js` prüft den Block (6067 Fälle).
- **Stil „hand“:** Fach- und Themenblöcke mit gezeichnetem Rahmen als Maske auf `::after` (SVG in `<details>`
  verschwindet zugeklappt); Titel mit tanzenden Buchstaben; gestrichelter gezeichneter Rahmen für nicht freigegebene
  Spiele.
- **Lücken-Motive** (`eulenpfad/start/luecken.js`, 18 Motive, je Fach 2–4, der Reihe nach über die Lücken): Wirkungen
  sog, zieht, heben, ecke, loch (`STIL.nachbarn`, `STIL.schlauch`); Bewegung über Klassen `lu-*`, `@property --lx --ly
  --lr --ls` und SMIL, ruhig bei „weniger Bewegung“; Kennungen `lid-…` je Lücke eindeutig.

## Geändert
- **Wassertropfen-Reise:** Satzbox und Nummern der Pfeile im Dunkeln lesbar (Hinweise Patrik; die Aufgabe war richtig,
  der Text war hell auf hellem Grund).
- **Stufenwahl:** Timer-Knopf nur die Uhr (Klassen `nur-symbol`, `timer-wort` reserviert); Stimmzeile mit Probe nur für
  die Aufsicht.
- **Endlos** fehlt bei manchen Stufen mit Absicht (Regel: mindestens 100 verschiedene Aufgaben), nicht wegen der Freigabe.

## Stolperfallen
- **Schlauch in Lücken-Koordinaten:** Die Kacheln sind im Stil „hand“ verschoben und skaliert — der Schlauch lag neben
  dem Rahmen. Erst in Pixeln nach `getBoundingClientRect` der Kachel wurde es eine Linie; die gezogene Kachel muss dafür
  stillstehen.
- **Klassen-Rand ist ein Schatten** (`--glow`, 2 px rund um die Kachel): Masken des gezeichneten Rahmens erreichen ihn
  nicht. In den eigenen Aufnahmen unsichtbar, weil der Filter „Meine Klasse“ an war — Patriks Bild zeigte ihn. Lösung:
  Lücke in der Ebene über den Kacheln, die Füllung deckt ihn am Übergang.
- **Gleiche SVG-Kennungen in mehreren Lücken:** Liegt die erste in einem zugeklappten Block, fehlen Verläufe in allen
  anderen — Kennungen je Lücke mit Endung.
- **`-webkit-mask`-Kurzform** setzt `mask-composite` zurück; **SMIL** hält CSS bei „weniger Bewegung“ nicht an (im
  Skript weglassen).
- **Kern-Namen `--k-*`** sind dem Kern vorbehalten (`--k-auf` vom Kern-Test abgewiesen, umbenannt in `--korb-auf`).
- **Konzeptwert nicht nachgerechnet:** DM6 a nannte deko-6 „reicht schon“ (4,47 < 4,5) — eigene Fassung `#6264ed`.
- **Heredoc mit Backslash** und Backticks in `python -c` wiederholt vom Hook abgewiesen; Patch-Skripte über Write.
- **Prüfer-Kandidat:** `.temp/farbmuster.html` (Farbpaare nebeneinander, vorher/nachher) hat die G1-Frage sichtbar
  gemacht — als Werkzeug in `tools/` mit den Farben aus `stil.css` statt von Hand, damit jede Farbänderung ihr Muster hat.
- **Prüfer-Kandidat:** Abstimmung Kachelrand ↔ angedockte Zeichnung (Schlauch) prüft keine Messung; ein Seitentest
  könnte die Endpunkte des Schlauchs gegen das Rechteck der Kachel vergleichen.

## Verifikation
Kurze Tests nach Schritt 4: Skripte „Keine Fehler.“, Kern „6067 Fälle, 0 Fehler.“, Server „59 Fälle, 0 Fehler.“,
Lernsteig „0 Fehler, 139 Hinweise.“, Konten „106 Fälle, 0 Fehler.“, Gratwanderung „Keine Fehler.“, Feier „169 Spiele,
6084 Bilder, keine Fehler.“, Schrift „Keine Fehler.“. Eulenpfad nur Stichproben (zuletzt tab „Keine Fehler.“, davor tab
speicher zahlenhaus stellen-detektiv wort-zwillinge „Keine Fehler.“). Kontrast über alle 1215 Seiten: hell 98 Funde
(vorher 1091, gemessen vor G1 a), dunkel 348 (vorher 355). **Letzter voller Eulenpfad-Lauf weiter auf `6055527`.** Im
Browser (Chrome ohne Fenster, `tools/bilder_aufnehmen.js`) angesehen: Farbmuster, Stufenwahl, Startseite, Blöcke,
Lücken je Wirkung beidseitig hell und dunkel zu mehreren Zeitpunkten, Wassertropfen-Reise, Kopfzeile mit ☀️/🌙, Profil
der Aufsicht, Bildkacheln, Abzeichen.

## Offene Punkte / Plan für die nächste Session
1. **Darkmode Schritt 5:** Spielseiten in Blöcken (DM4 a) — feste weisse Felder mit `var(--text)`, SVG-Schrift mit
   `fill: var(--text)` in 23 Seiten, eigene Korb- und Stellenfarben (Wortarten-Sortierer, Stellen-Detektiv,
   Punkte-Schieber), Regelkarte in sechs Spielen, gezeichnete Szenen der 17 Seiten; je Block in beiden Modi ansehen.
2. Schritt 6: Lernsteig (Akzent im Titel 2,84), Gratwanderung, Anleitungen, Portal.
3. Blasse Texte in Symbolen noch offener Abzeichen (vier Funde hell wie dunkel) — absichtlich blass; bei Bedarf als
   Frage vorlegen.
4. Voller Eulenpfad-Lauf auf Patriks Entscheid vor dem nächsten Push (seit `6055527` nicht gepusht).
5. Vorgemerkt: Easter Eggs zu besonderen Tagen (eigenes Konzept vor dem Bau).
