# LERN_Session33_2026-11-12_erfolge-statistik-stil

## Schwerpunkt
Zwei Stränge: (1) der Wunsch aus LERN_Session32 — Wochenmarke weg, Statistik und Erfolge kindgerecht und im Stil
„hand“, Personen-Menü im Stil —, erweitert um das Übersteuern der Empfehlungen durch die Aufsicht; (2) der Darkmode, von
der Frage „macht es Sinn?“ über ein Konzept mit Messungen bis zu Schritt 3c-2 (Kern-Farben, Einstellung, Kopf-Skript,
Rahmen ohne feste Farben). Vorher die Bemerkungen 50–52. 12 Commits, alle von Patrik (`0e4d597` bis `2f8e361`); dieser
Abschluss noch zu committen.

## Entscheide (Patrik, 12.11.2026)
- **Darkmode** (`docs/konzept_darkmode.md`): Grundsatz a (Einstellung, Eulenpfad hell, Lernsteig wie das Gerät, Variablen
  im Kern, Stellenfarben gleich, Zeichnungen auf heller Bildkachel); **DM0 a** (auch in der laufenden Runde, Zusatz zu
  GS0 a in Konzept Gestaltung und Plan Angleich), **DM1 a** (`kern/farben.css`, verteilt als `kern.css`), **DM2 a** und
  **DM2-S a** (Gerät und „Für mich“ der Aufsicht, für Farben und Stil), **DM2-K a** (Kinder schalten selbst um, wenn
  die Aufsicht es je Kind erlaubt, Muster VR1 a, Standard fest — noch nicht gebaut), **DM3 a** (helle Bildkachel),
  **DM4 a** (eigene Farben auf Variablen, Prüfung und Kontrast in beiden Modi), **DM5 a** (Stellen und Knopf hell ab 4,5),
  **DM6 a** (Schrift-Fassung gleichen Tons für Deko, Gut, Hinweis) — DM5 und DM6 noch nicht gebaut.
- **Reihenfolge a:** Wochenmarke weg, dann Kern-Farben und Kontrastprüfung, dann Statistik und Erfolge auf den Variablen.
- **Statistik und Erfolge für Kinder** (Konzept Gestaltung): **KS1 a** (Vorschläge als Karten mit Satz ohne Zahlen),
  **KS2 a** (Runden als Kacheln nach Tagen), **KS3 a** (eine Wochenkarte mit Wochensternen), **KS4 a** (die Aufsicht heftet
  an, blendet aus, empfiehlt selbst; Rangfolge hinter ⓘ).

## Neu
- **Bemerkungen 50–52:** sechs Zeichnungen für die Wort-Zwillinge (`svg:garten`, `glas`, `gras`, `knie`, `haar`,
  `sommer`; je ohne Verwechslung mit einem anderen Bild der Liste), die Seite lädt `bilder.js`, Lösungssatz über
  `LS.mitBildText`; Formen in der Prüfansicht von Listen & Tap mit Bildern; Znüni-Teller: Gruppe „Stärke“ statt
  „Getreide“, Gemüse-Erklärung ohne „Knollen“.
- **Kern 1.40.0–1.42.0:** `kern/farben.css` (`--k-*` hell und dunkel, `color-scheme`, `--k-feld`, `--k-bildtext`),
  `kern/farben.js` (`KERN.farben`: `WAHLEN`, `dunkel`, `anwenden` mit Folgen dem Gerät, `merke`), `kern/farben.kopf.js`
  (setzt `data-farben` im `<head>` vor dem ersten Bild); `tools/kern_verteilen.py` bündelt drei Arten (`kern.js`,
  `kern.css`, `kern-kopf.js`). Doku `docs/kern/rahmen.md` 4.29.
- **Kontrastmessung** `tools/kontrast.js` (im Browser; Schichten an der Stelle, SVG-Formen, Verläufe; Gegenprobe mit 15
  Fällen bei jedem Lauf; meldet nur). Messung hell: 1215 Seiten, 1091 Funde, 888 aus sieben Orten des Rahmens.
- **Prüfungen:** `pruefe_skripte.js` Punkt 6 (kern.css vor dem App-Stil, im Eulenpfad `kern-kopf.js` mit Präfix davor)
  und Punkt 7 (feste Farben als Hinweis); `pruefe_kern.js` prüft Farben und das Kopf-Skript in einer Sandbox.
- **Einstellung „Farben“** im Block Aussehen, „Für mich“ der Aufsicht für Stil und Farben (`LS.aussehen`,
  `LS.farbenAnwenden`), Kopf-Skript in 174 Seiten.
- **Statistik des Kindes:** Vorschlagskarten (`AUSWERTUNG.fuerKind`, Feld `kind`), Kacheln der Runden mit „Diese
  Aufgaben waren knifflig“ und „▶ Nochmal“, Wochenkarte mit `wochenSterne`; dieselbe Woche in Erfolge.
- **Empfehlungen der Aufsicht** (KS4 a): 📌 anheften, 🚫 ausblenden, ➕ eigene Empfehlung, ✕ zurücknehmen, Rangfolge
  (`AUSWERTUNG.RANGFOLGE`) hinter ⓘ, Zeile „sieht jetzt“; Profilfeld `empfehlungen`.
- **Stil „hand“** für Rundenkacheln, Abzeichen (Rahmen in der Farbe der Stufe) und Personen-Menü.
- **Seitentests** (`tools/eulenpfad_seiten.js`): „Statistik des Kindes“, „Empfehlungen der Aufsicht“, „Aussehen
  (Farben, Für mich)“, Datum der Abzeichen.

## Geändert
- **Wochenmarke** in der Kopfzeile entfernt (WO1 a zurückgenommen).
- **Datum der Abzeichen** Wochenstern und Dranbleiber: die Runde, mit der das Wochenziel erreicht war (`erfuelltAm`),
  statt des Sonntags der Woche (stand in der laufenden Woche in der Zukunft); Gegenprobe mit der alten Fassung.
- **`stil.css` und `start.css` ohne feste Farben** (43 und 40 Namen, hell die bisherigen Werte, dunkel eigene);
  Gegenprobe hell mit dem Farbabdruck (`.temp/farbabdruck.html`) auf acht Seiten gleich.

## Stolperfallen
- **Abdruck zu früh gespeichert:** Beim ersten Versuch der Gegenprobe für `stil.css` war der Messlauf beim Speichern
  noch nicht fertig, die Grundlinie fehlte. Ausweg: alte Fassung aus `git show HEAD:…` kurz einsetzen, messen,
  zurück. **Prüfer-Kandidat:** `.temp/farbabdruck.html` als Werkzeug in `tools/` mit „vorher/nachher“ in Dateien statt
  im Browser-Speicher.
- **Ausgeblendete Ansicht der App:** `ResizeObserver` meldet dort nichts — der Rahmen des Personen-Menüs schien zu
  fehlen; im Chrome ohne Fenster war er da. Bilder darum über CDP aufnehmen (Skripte im Scratchpad, siehe
  Prüfer-Kandidat unten).
- **`<details>` blendet zugeklappt alles ausser `<summary>` aus**, auch den gezeichneten Rahmen: Hülle um die Kachel.
- **Gleicher Speicher in zwei Seiten des Prüf-DOM:** `setzeSpieler` auf einer Kinderseite meldete die Aufsicht der
  anderen ab — Kopie des Speichers für die zweite Seite.
- **Kontrastmessung dunkel:** Die Seite wendet beim Start die Einstellung des Geräts an und nahm das von aussen
  gesetzte `data-farben` wieder weg; das Werkzeug stellt jetzt auch die Einstellung um.
- **Zählfehler in Punkt 7:** `white-space` als Farbe `white` gezählt; Kommentare mit Klammern als Regelblock gelesen —
  beide von den eigenen Gegenproben gefunden.
- **Hook-Bedarf:** dreimal von Hand Bilder im Chrome ohne Fenster aufgenommen (`ansicht*.js` im Scratchpad) —
  **Kandidat** `tools/bilder_aufnehmen.js` (Seite, Breite, Modus hell/dunkel, Aktion vorher), damit Darkmode-Blöcke in
  Schritt 5 je Block in beiden Modi angesehen werden können.

## Verifikation
Kurze Tests nach dem letzten Kern-Schritt: Skripte „Keine Fehler.“, Kern „6064 Fälle, 0 Fehler.“, Server „59 Fälle,
0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“, Konten „106 Fälle, 0 Fehler.“, Gratwanderung „Keine Fehler.“, Feier
„169 Spiele, 6084 Bilder, keine Fehler.“, Schrift „Keine Fehler.“. Eulenpfad nur Stichproben (zuletzt tab speicher
zahlenhaus schriftlich-werkstatt stellen-detektiv „Keine Fehler.“, mit Tab Spiele 63, Speicher 23, Empfehlungen 14,
Aussehen 6 Prüfschritten). Kontrast dunkel an fünf Spielen: „34 Texte unter der Untergrenze.“ (meldet nur). **Letzter
voller Eulenpfad-Lauf weiter auf `6055527`.** Im Browser (Chrome ohne Fenster) angesehen: Statistik und Erfolge des
Kindes (Desktop, Handy, aufgeklappt), Ansicht der Aufsicht, Startseite, Statistik und eine Runde dunkel.

## Offen / Plan für die nächste Session
1. **Darkmode 3c-3:** DM5 a (Stellen `#d93a40`, `#1f74c0`, `#157f45`, Knopf so dunkel, dass weisse Schrift 4,5 erreicht;
   Kern) und DM6 a (`--deko-N-schrift`, `--gut-schrift`, `--hinweis-schrift`; Stufennummer über `--sf-schrift` aus der
   SKALA; Flächen mit weisser Schrift); vorher das dunklere Grün neben dem Gut-Grün ansehen (Kipppunkt DM5). Dazu die
   Funde dunkel im Rahmen: Ersatz-Avatar 4,03, Schrift in Knopffarbe 4,4, Schrift auf Stellen- und Deko-Flächen.
   Danach `node tools/kontrast.js --modus=hell,dunkel` über alle Seiten und den hellen Satz in `pruefe_kern.js` mitprüfen.
2. **DM2-K a bauen:** Knopf ☀️/🌙 für Kinder, die es dürfen (VR1 a, `wahl.farben`, `fest.farben`, Standard fest).
3. **Darkmode 4–6:** Bildkachel (DM3 a), Spielseiten in Blöcken (DM4 a; 536 feste Farben in 142 Seiten), Lernsteig,
   Gratwanderung, Anleitungen, Portal.
4. **Nicht pushen**, bevor 3c-3 fertig ist (dunkel wählbar, aber noch nicht überall lesbar); vor dem Push der volle
   Eulenpfad-Lauf auf Patriks Entscheid.
5. Aus LERN_Session32: FB2-K a (Stichworte der Stufen), FB3 a (Boden der Karten), Bilder der Anleitungen neu,
   Prüfer-Kandidaten, Versuch mit Kindern; Freigabe der neuen Bilder (Wort-Zwillinge) im Prüfstand durch Patrik.
