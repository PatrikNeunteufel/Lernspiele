# LERN_Session48_2026-11-19_zug-pakete

## Schwerpunkt
Ziel war, jede Aufgabe bis zum Ende im Bild zu halten (LERN-55). Dazu bekamen zuerst alle 175 Spiele einen vollständigen
Zug (ZU1 a) in drei Paketen. Dann spielt `pruefe_spiele.js` jede Stufe einmal geführt durch (ZP1 a). Danach wurden mit
`bildhoehe.js --schritte` alle Spiele bis zum Lösen gemessen. Zuletzt behoben vier Agenten die Überläufe in späteren
Schritten, in 52 Spielen.

Patrik hat sieben Commits gemacht, von `55d9318` bis `47ba274`; keiner ist gepusht. Es gab eine Pause mit Haltepunkt
(16:32, aufgenommen 19:37). Entwickler-Bemerkungen: keine offenen.

## Entscheide (Patrik, 19.11.2026)
- **ZP1 a:** `pruefe_spiele.js` spielt je Spiel und Stufe zusätzlich eine geführte Runde mit `LS.pruefung.zug`: ein
  falscher, dann richtige Handgriffe. Fehlt einer Aufgabe der Zug, ist das ein Fehler (`ZUG_PFLICHT`).
- **ZF1 a:** `LS.tastatur` nimmt `opt.erwartetFalsch` für Spiele, in denen Wert + 1 noch richtig wäre.
- **ZW1 a:** Ein Zug darf `"warte"` geben, wenn gerade nichts zu tun ist (Stimme, Zeigen, Antwort der Eule).
  `LS.losGehts` meldet seinen Zug selbst.
- **VL1 a:** voller Eulenpfad-Lauf nach dem Commit `ec5ba6f`.
- **ÜL1 a:** Der Stand nach dem lösenden Handgriff zählt nicht als „über dem Rand“; die Messung nennt ihn getrennt.
- **EU1 a:** In Würfel-Zähler, Probe-Stempel und Sachaufgaben-Kompass sagt die Eule beim nächsten Schritt kurz
  „Genau! …“.
- **Ton aus:** Die Messwerkzeuge spielen keine Klänge und keine Stimme mehr ab. Das ist ein Wunsch Patriks, kein
  Entscheid mit Kennung.
- **SA1 a:** jetzt abschliessen; die Rahmenwünsche kommen in eine neue Sitzung.

## Neu
- **Rahmen** (`spiel.js`, rahmen.md 4.2, 4.3):
  - `opt.erwartetFalsch` an der Tastatur.
  - `"warte"` als Rückgabe eines Zugs.
  - Zug in `LS.losGehts`.
  - Zug im Sudoku-Baustein (`sudoku.js`).
- **`tools/pruefe_spiele.js`:**
  - geführte Runde (ZP1 a) mit Funden „geführt:“, `ZUG_PFLICHT` und `--gefuehrt=0`;
  - Grenze der Züge dreimal `ctx.schritte`, mindestens 80, für die erste Aufgabe 300.
- **`tools/pruef_dom.js`:** Ereignisse übernehmen `clientX` und `clientY`, SVG-Punkte rechnen als Identität um.
- **`tools/bildhoehe.js --schritte`:**
  - höchstens 200 Züge je Ziehung;
  - misst erst, wenn die Aufgabe gezeichnet ist (bis 10 s);
  - wartet bei `"warte"`;
  - führt den Stand nach dem Lösen getrennt (ÜL1 a).
- **`tools/stumm.js`:** Chrome startet mit `--mute-audio`, jede Äusserung der Stimme hat die Lautstärke 0. Gilt in
  `bildhoehe.js`, `bilder_aufnehmen.js`, `kontrast.js` und `anleitung_bilder.js`.
- **`tools/bilder_aufnehmen.js`:** Die Stimme spricht ohne Antippen.

## Geändert
- **Zug-Pakete:**
  - Paket 1: 26 Spiele, nur `erwartet` (`55d9318`).
  - Paket 2: 26 Spiele mit Tastatur und eigenen Knöpfen (`f5dcce7`).
  - Paket 3: die übrigen 73 Spiele (`d675e40`).
  - Damit melden alle 175 Spiele einen Zug.
- **Überläufe in späteren Schritten (`47ba274`):** 52 Spiele in vier Paketen.
  - Vorher waren mit dem Stand nach dem Lösen 113 Seiten in 53 Spielen über dem Rand, ohne ihn 98 Seiten in 50 Spielen.
  - Die grössten Fälle: Braille-Finger s5 250 px, Verben-Fächer s2 199, Probe-Stempel 147, Wortarten-Probe 143,
    Hör-Geschichte 135, Würfel-Zähler 134.
  - Seitlich lief die Zahlen-Waage s6 20 px über.
  - Nachher ist auf vier sichtbaren Flächen keine Aufgabe mehr über dem Rand.
- **Änderungen über das Anordnen hinaus** (Patrik zum Ansehen vorgelegt):
  - Rede-Zeichen: Auf schmalen und niedrigen Bildschirmen steht der zweite Teil der Frage nur noch in der Blase und in
    der Hilfe.
  - Hör-Reporter: ohne Vorschau, sobald die Fragen kommen.
  - Wortarten-Probe: Eine Probe, die nicht klappt, verliert ihren Knopf.
  - Morphem-Schere und Verben-Fächer: Erledigtes fällt weg.
  - Gesenkte Untergrenzen (Liste im CHANGELOG).

## Stolperfallen
- **Geführte Runde:** Die erste Aufgabe galt als gelöst, weil −1 === −1 war. Behoben mit `gestelltNr = 0`.
- **Unter Last war ein 9 × 9-Sudoku nach 1,5 s noch leer** und galt als „nicht zu Ende gespielt“. `bildhoehe.js` wartet
  jetzt bis 10 s auf die gezeichnete Aufgabe.
- **`--mute-audio` erreicht die Stimme unter Windows nicht:** `speechSynthesis` spricht dort über die Sprachausgabe des
  Systems. Darum bekommt jede Äusserung die Lautstärke 0 (`tools/stumm.js`).
- **Agenten liessen Warteschleifen zurück:** sechs `until … sleep`-Schleifen auf Dateien, die nie den erwarteten Text
  bekamen. Beim Halt von Hand beendet (Memory „Hintergrund: auch Shell-Schleifen“).
  - **Hook-Kandidat:** Das Muster ist wiederholt aufgetreten, zuletzt in LERN_Session46. Ein Stop-Hook könnte verwaiste
    `until`-Schleifen dieser Sitzung melden.
- **Grid mit einem Kind über beide Spalten** (`small` in den Quellen-Knöpfen des Kulturen-Koffers): Die Spalten wurden
  breit, und Bild und Name standen weit auseinander. Flex mit Umbruch nehmen.
- **Serien-Hinweise der geführten Runde** (Himmels-Forscher s1, Lebensraum s5): keine Folge der geführten Runde. Die
  Stufen haben zu wenige Aufgaben je Art, und die vierte Runde hat es zufällig sichtbar gemacht.
- **Anzeigenamen in Commit und CHANGELOG** zuerst aus dem Gedächtnis geschrieben und mehrere falsch. Jetzt stammen sie
  aus `katalog.js`.

## Verifikation
- **Voller Eulenpfad-Lauf** auf `ec5ba6f`: „Keine Fehler.“ (3941 s) mit „Geführt (ZP1 a): 1050 Stufen ganz
  durchgespielt; 0 Spiele mit einer Aufgabe ohne Zug“.
- **Danach** (`c307ca5`, `47ba274`) kein voller Lauf. Der Eulenpfad lief für die geänderten Spiele: alle 52 „Keine
  Fehler.“, je Paket und nach den letzten Änderungen. Skripte „Keine Fehler.“.
- **Messungen mit `--schritte`:**
  - je Paket s1–s6 auf Handy-, Tablet-, Quer- und Laptop-Sicht, drei Ziehungen: ohne Aufgabe über dem Rand;
  - Nachmessung aller 52 auf Handy und quer: zwei Reste, danach behoben;
  - Kulturen-Koffer zuletzt auf fünf Flächen mit sechs Ziehungen: 0.
- **Vor dem Push:** Ein voller Eulenpfad-Lauf auf dem letzten Stand fehlt noch. Ob er läuft, entscheidet Patrik.

## Offene Punkte / Plan für die nächste Session
1. Push ab `55d9318` (Patrik). Vorher der volle Eulenpfad-Lauf, wenn Patrik ihn will (rund 65 min).
2. **Wünsche an den Rahmen** aus den Behebungen, je ein Entscheid (`bildhoehe_offen.md`, Stand LERN_Session48):
   - Hinweis nach einem Fehler kürzen; er ist die häufigste Ursache.
   - Schrittwechsel in der Blase.
   - Tastatur rechts für eigene Behälter.
   - Erledigtes als eine Zeile.
   - `--wahl-breite` nur auf dem Handy.
   - `LS.restHoehe` nach einem Fehler.
   - Messung „geschrumpft“ in Rasterspalten.
   - 💡 in schmalen Spalten.
3. **Kleine Stufen mit Serien:** Himmels-Forscher s1, Lebensraum s5 (`wasFrisst`). Entweder mehr Aufgaben oder
   `ctx.serie("art")` dort weglassen.
4. **Übrige 123 Spiele** einmal mit `--schritte` auf allen vier Sichten messen. Bisher nur Handy und quer.
5. Aus früheren Sitzungen: Sudokus freigeben (Patrik).
