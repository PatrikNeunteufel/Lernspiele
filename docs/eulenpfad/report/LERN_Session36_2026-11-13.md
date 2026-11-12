# LERN_Session36_2026-11-13_inhaltslisten-anleitungen

## Schwerpunkt
Begonnen am 12.11. als zweite Sitzung im Worktree (`claude/sleepy-snyder-54c222`): Trennlinien der Prüfansicht. Weil die
Änderungen im Worktree nicht in `master` erschienen, ab Schritt 2 im Hauptordner weitergeführt (W2 b, Worktree danach
von Patrik entfernt). Dann die Prüfung je Eintrag für alle Inhaltslisten (LP5 a, LERN-51) in Blöcken nach T4 a: Block 1
Mathe von Hand, Blöcke 2 und 3 Deutsch mit je fünf parallelen Agenten (zwei Spiele je Agent), jedes Ergebnis von mir
gelesen und im Browser geprüft. Danach die Anleitungen (AN-B a; Darkmode Schritt 6 damit erledigt). Zehn Commits von
Patrik (`e002e30` bis `71b4ffa`); A1 a/A2 a und dieser Abschluss noch zu committen. Keine Entwickler-Bemerkungen
bearbeitet (Sitzung als Fortsetzung begonnen).

## Entscheide (Patrik, 12./13.11.2026)
- **T1 a–T4 a** (aus dem Worktree übernommen): Zeilen- und Säulenlinien kräftiger, Rahmen der Gruppen in `--trennlinie`,
  Lernsteig mit eigener `--trennlinie`, Prüfung je Eintrag in Blöcken zu höchstens zehn Spielen, ein Commit je Block.
- **W2 b:** Keine Worktrees — Regel im Steckbrief der Projekt-`CLAUDE.md`.
- **N1 a:** Prüfdialog mit `background: var(--karte)` (Eulenpfad und Lernsteig). **N2 a:** eigene Farbe
  `--trennlinie-fertig` für den Rahmen ganz geprüfter Gruppen (hell `#1f8a50`, dunkel `var(--gut)`).
- **A1 a:** Statistik ohne Endlos-Runde weist auf den Schalter ♾ Endlos. **A2 a:** Abgleich-Text in der Verwaltung nennt,
  was wirklich reist; Einstellungen und PIN bleiben auf dem Gerät.

## Neu
- **`pruefung.js` für 29 Spiele** (Block 1 Mathe: 9, Block 2 Deutsch: 10, Block 3 Deutsch: 10). Gemischte Listen in
  Abschnitte getrennt, Spalten mit den Funktionen der Spiele gerechnet, Bilder vom Spiel gezeichnet (Glacekugeln,
  gezeichnete Dinge der Gegenteil-Wippe, Säulen-, Kreis- und Liniendiagramme), Beispiele ausgefüllt (Rechengeschichten,
  Platzhalter-Geschichten). Prüfstand und Fingerabdrücke unverändert (keine dieser Listen hat einen `hash`).
- **Anleitungen:** neuer Abschnitt „🔍 Wortlisten selbst prüfen“ und Empfehlungen ans Kind; zwei neue Bilder
  (`a21-pruefansicht`, `a22-empfehlungen`); `tools/anleitung_bilder.js` setzt Rahmen auch in offene Dialoge.

## Geändert
- `--trennlinie` im Eulenpfad (hell `#858aa6`, dunkel `#7d84aa`) und im Lernsteig (hell `#7b8794`, dunkel `#7d84aa`).
- Anleitungen `aufsicht.html` und `kinder.html` gegen die heutige App nachgeführt (Abgleich durch einen Agenten, Belege
  im Code geprüft); alle 36 Bilder neu; `anleitung.css`: Handy-Bilder nie breiter als die Karte.
- `tools/anleitung_bilder.js`: wartet erst auf `about:blank`, prüft die geladene Seite, Aufsicht 1200 breit, neue Rahmen.
- Zwei veraltete App-Texte (A1 a, A2 a), noch nicht committet.

## Stolperfallen
- **Worktree:** Änderungen der Worktree-Sitzung erschienen nicht in `master`; daraus W2 b.
- **Ladeereignis von `about:blank`:** beendete im Bilder-Werkzeug das Warten auf die eigentliche Seite; der nächste
  Befehl lief auf der leeren Seite („localStorage … Access is denied“).
- **Testserver still beendet:** Port 8769 lief zwischendurch nicht mehr; das Werkzeug meldete nur „Seite nicht geladen“.
- **Browser-Zwischenspeicher:** nach einer Änderung an `verwaltung.js` zeigte die Vorschau den alten Text, bis die Datei
  ohne Zwischenspeicher geholt wurde.
- **Gemischte Zeilenenden:** `Edit` brachte die 9 LF-Zeilen in `lernsteig/gemeinsam/stil.css` auf CRLF — folgenlos, weil
  `text: auto` im Repo LF speichert.
- **Dialog im top layer:** Rahmen am `body` lagen unter dem offenen Prüfdialog; sie gehören in den Dialog.
- **Prüfer-Kandidat (zweiter Fall):** Die Anleitungen laufen der App davon, ohne dass etwas meldet — in LERN_Session35
  das Werkzeug, jetzt Texte und Nummern. Ein Test könnte je Bild die Zahl der Rahmen im Werkzeug gegen die roten Nummern
  im Text daneben prüfen und jedes Rahmen-Ziel gegen die Seite.
- **Prüfer-Kandidat:** Stufen, die als Text in einer `pruefung.js` stehen (Trenn-Schere, Gedicht-Baukasten), laufen der
  Stufentabelle davon; `pruefe_spiele.js` kennt die Stufen je Liste und könnte sie gegen die Beschreibung halten.

## Rückmeldung Patrik zu den Anleitungen (am Ende der Sitzung, Auftrag für LERN_Session37)
Die Anleitungen sind nicht zufriedenstellend, vor allem die Nummern:
- Manche Bilder tragen Nummern, die der Text gar nicht beschreibt (etwa k01, Abschnitt 1 der Kinder-Anleitung).
- Die Reihenfolge der Nummern im Bild folgt nicht der Lesereihenfolge („geordnet ist anders“, a01: 2 links, 1 rechts).
- Der Text steht mal über, mal unter dem Bild.
- Doppelte Zählung: nummerierte Liste (1., 2.) und dazu die rote Nummer — besser nur die rote Nummer.
- Nummern mal als „(1), (2)“ in der Bildunterschrift, mal als rote Nummer im Text, mal frei, mal in einer Aufzählung.
- Zwei Nummern ohne klare Zuweisung (etwa „②③ Weiterrechnen“ beim Notizblock).
- Layout: die Kinder-Anleitung ist schmal wie ein Handy, die für Erwachsene über die ganze Breite — gewünscht ist ein
  gemeinsamer, sauber strukturierter Stil, der auf allen Geräten passt.

## Inhaltliche Auffälligkeiten aus den Agenten (nicht geändert, beim Prüfen ansehen)
- Buchstaben-Zwillinge: Gruppe i/j/l (grosses I wie kleines l); Ablenker „Frisch“, „Bis“ gross, „Hund“/„Mond“ zwei
  Buchstaben, „Kur“, „Kahn“, „Wall“ für kleine Kinder kaum bekannt.
- Satz-Reparatur: „Warum lachst du so?“ in der Liste der abstrakten Nomen ohne Nomen.
- Nomen-Puzzle: Ablenker „Holzfeuer“ ist ein Wort; Bilder ⛱️ (Regenschirm), 🍾 (Wasserflasche), 🖌️ (Bürste).
- Lese-Detektiv: Herbst-Text in „Zwischen den Zeilen“ fast wörtlich; Steinbock „vor gut hundert Jahren“ ungenau.
- Reim-Paare: Bus/Nuss je nach Aussprache. Regel-Lücke: vier ie-Ausnahmen in `woerter.js` als ungeprüft markiert.
- Gedicht-Baukasten: „er rennt so schnell wie ein Held“. Komma-Jagd: zwei Sätze im Teil „Verbgruppen und Aufzählung“
  ohne Aufzählung. Zeitreise-Verben: Fallen mit falschem Hilfsverb nur stichprobenweise angesehen.

## Verifikation
Je Block: `pruefe_spiele.js` der Spiele des Blocks „Keine Fehler.“ (Mathe, Deutsch 2, Deutsch 3 je ganz), `pruefe_skripte`
„Keine Fehler.“, im Browser jede Liste jeder Prüfansicht durchlaufen (Zellen = Spalten, keine Ausnahme, Listen =
Katalog), Ansichten hell und dunkel aufgenommen und angesehen. Kontrast Lernsteig Aussagen und Anlaut-Angel/
Auge-Entdecker „Kein Text unter der Untergrenze.“. Anleitungen hell und dunkel, Desktop und Handy angesehen. Kurze
Testreihe am Schluss (`node tools/pruefe.js`): Skripte „Keine Fehler.“, Kern „6068 Fälle, 0 Fehler.“, Server „59 Fälle,
0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“, Konten „106 Fälle, 0 Fehler.“, Gratwanderung „Keine Fehler.“, Feier
„169 Spiele, 6084 Bilder, keine Fehler.“, Schrift „Keine Fehler.“. Eulenpfad nur Blöcke — **letzter voller Lauf weiter auf `6055527`**.

## Offene Punkte / Plan für die nächste Session
1. **Anleitungen neu strukturieren** (Rückmeldung oben): zuerst eine Vorlage mit Regeln für Bild, Nummern und Text
   (eine Nummernart, Lesereihenfolge, jede Nummer genau einmal beschrieben, Text immer an derselben Stelle) und einem
   gemeinsamen, geräteübergreifenden Layout für beide Anleitungen; dann umsetzen, Werkzeug und Bilder nachziehen;
   Prüfer-Kandidat Nummern ↔ Rahmen.
2. **Inhaltslisten weiter (LP5 a, T4 a):** Block 4 Deutsch (9 Spiele ab sachtext-spurensuche: sachtext-spurensuche,
   korrektur-stift, hoer-reporter, wortarten-probe, gefuehle-radar, geschichten-ordner, hoer-geschichte, gattungs-kenner,
   figuren-spiegel), dann Englisch, Französisch, NMG (drei Blöcke), MI und Musik. Bewährt: fünf Agenten zu je zwei
   Spielen mit einem Auftrag aus Vertrag (rahmen.md 17), Vorbildern (Piloten und Blöcke 1–3), Verboten (nur die eigene
   `pruefung.js`, kein Git) und Pflichtprüfungen (`pruefe_skripte`, Ladeprüfung jeder Zeile wie
   `tools/listen_fingerabdruck.js`, `pruefe_spiele`); danach selbst lesen, im Browser je Eintrag prüfen, hell/dunkel ansehen.
3. Voller Eulenpfad-Lauf auf Patriks Entscheid vor dem nächsten Push (seit `6055527` nicht gepusht).
4. Vorgemerkt: Easter Eggs zu besonderen Tagen (eigenes Konzept vor dem Bau).
