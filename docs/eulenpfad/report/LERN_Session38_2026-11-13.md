# LERN_Session38_2026-11-13_inhaltslisten-nmg-block2

## Schwerpunkt
Zuerst die Anleitung k04, dann auf Hinweise Patriks die Körbe (Farbe je Korb, Platz nach dem Sortierschalter), die
Tageslauf-Sonne und die Zufalls-Skala. Danach die Prüfansichten (LP5 a, LERN-51) für NMG Block 2 und 3, MI, Musik und
die letzten Spiele — damit hat **jedes Spiel mit eigenen Listen eine Prüfansicht**. Aus den 13 Agentenberichten die
inhaltlichen Befunde gesammelt und nach BF1 a abgearbeitet (je Sachangabe belegt), dabei eine neue Prüfung „Bild verrät“
gebaut und in 13 Spielen behoben. Zum Schluss drei Fehler und Wünsche an der Prüfansicht (Kern 1.44.0 bis 1.45.1). Eine
Pause dazwischen (Haltepunkt, in derselben Sitzung aufgenommen). 21 Commits von Patrik (`46688e2` bis `90f318b`), nicht
gepusht; dieser Abschluss noch zu committen. Entwickler-Bemerkungen: keine offenen.

## Entscheide (Patrik, 13.11.2026)
- **KF1 a, KF2 a:** Die Farbe gehört zum Korb und wird je Runde neu verteilt; Platz der Körbe hängt am Sortierschalter
  („geordnet“ = jeder Korb immer am selben Platz).
- **TS1 a** (Tageslauf-Sonne, Auftrag), **ZS1 a, ZS2 a** (Zufalls-Skala: „oder“ nur bei mindestens zwei Farben, dazu die
  Frage „Wie wahrscheinlich ist das?“), **PT1 a** (lange Spalten der Prüftabellen 8em).
- **GK1 a, GK2 a:** Geheimschrift-Knacker sperrt Paare aus Wort und Schlüssel mit anstössigem Geheimwort
  (`GEHEIM_SPERRE`); kurze Zufallstreffer (KZ, POO, TIT) bewusst nicht.
- **BF1 a:** Befunde Spiel für Spiel, belegt; eindeutig Falsches beheben, Ermessen als Entscheid.
- **BI1 a, IK2 a, WT1 a:** Bilder, die die Lösung verraten oder etwas anderes zeigen: eigene Zeichnungen und eine
  Prüfung im Testskript; Klavier in Stufe 3 ohne Saiten- und Schlaginstrument als falschen Korb; Station Wasserdampf
  gezeichnet.
- **EO1 a:** Zahnfee in Echt oder erfunden durch einen kleinen Drachen ersetzt.
- **ÜB1 a, ÜB2 a:** Prüfansicht zeigt schon Geprüftes grau und übernimmt genau gleiche Zeilen; Zeilen aus lauter
  bekannten Zellen werden nicht übernommen (eine Zeile sagt etwas über den Zusammenhang ihrer Zellen).
- **DP1 a:** „🔍 Inhalte prüfen“ auf dem Startblatt im Entwickler-Modus weg, für die Aufsicht klein.

## Neu
- **Prüfansichten** (`pruefung.js`) für NMG Block 2 (9 Spiele), Block 3 (8), MI, Musik und die letzten (Instrumenten-
  Kenner, Geheimschrift-Knacker, Datei-Typen, Tageslauf-Sonne, Königs-Falle) — von Agenten nach
  `docs/eulenpfad/auftrag_pruefansicht.md`, jedes Ergebnis von mir gelesen; Aufgabenschritte ins Spiel gezogen, Aufgaben
  je Stufe mit festen Startwerten vorher und nachher byte-gleich.
- **`docs/eulenpfad/pruefung/befunde_LERN_Session38.md`:** alle fachlichen Meldungen der Agenten, je Spiel mit Stand,
  Belegen und dem, was behoben ist.
- **Prüfung „Bild verrät“** in `tools/pruefe_spiele.js`: Die richtige Antwort trägt als einzige ein Bild, das die
  Aufgabe beim Stellen zeigt (nicht bei Diagrammen mit den Bildern aller Antworten, nicht bei reinen Bildantworten;
  Emojis je Graphem). Dafür geben die Haken „gestellt“ und „richtig“ die Fläche mit (spiel.js).
- **Zeichnungen in `bilder.js`:** Korbbilder der Instrumente (saiten, taste, rohrblatt, mundstueck, bogen),
  Materialproben (stoffHolz … stoffPapier), Anch, Landschaften der Lebensräume, Wasserdampf, Fischsaurier, kahler Baum.
- **Kern 1.44.0:** `oeffne(…, nachher)` — die Entwickler-Leiste zeigt eine ganz geprüfte Liste gleich als ✓.
- **Kern 1.45.0** (ÜB1 a): Haken mit Fingerabdrücken `zeile` und `zellen`, bekannte Zellen grau, gleiche Zeilen
  „✓ übernommen“; Server und `entwicklung_abgleich.py` speichern sie; `tools/haken_nachtragen.js` (252 Haken nachgetragen).
- **Kern 1.45.1:** Pfeil ▸/▾ vor den Gruppen, „↺ alle aufheben“ klappt auf.

## Geändert (Befunde, belegt — Einzelheiten in der Befund-Datei)
- Instrumenten-Kenner (`auch`, `auchGruppe`, Pianistin), Wassertropfen-Reise (🫖, 🧊, Tipp ohne „Grund“), Lärm-Wächter
  (`knall`, Schutzmittel, Hall-Frage), Erdzeit-Leiter (drei Sachsätze, Zeitalter-Körbe), Zeitstrahl (Bahnlinie 1847,
  Merkmalbilder), Stromkreis-Bauer (Graphit, `AUCH_GRUND`, Tipp Kurzschluss), Energie-Wandler (`auch` für drei Geräte),
  Schulweg-Profi (Verkehrsregeln, 🚲), Echt oder erfunden (💭, `MERKMAL_AUCH`, Fabeln, Zahnfee), Wetter (Bilder),
  Plan-Leser (Massstab je Plan im Stufentext).
- Korbbilder ohne Kartenbild: Schwimmt oder sinkt, Znüni-Teller, Kulturen-Koffer, Gefühle-Radar (anderes Gesicht als der
  Knopf), Kakao-Weg, Datei-Typen, Geschichten-Ordner, Lebensraum.
- Körbe: `LS.koerbe` mit Farbe je Korb und Runde (`korbFarbenRunde`), `familie` für den festen Platz; Prüfung „Korbfarbe“.

## Stolperfallen
- **Prüfer-Kandidat erfüllt:** „Bild verrät“ war in Block 2 bis 4 von Hand gesucht worden — jetzt im Testskript. Die
  verkürzte Zählung (2 Runden, 50 Aufgaben) übersah Fälle, die der normale Lauf fand (Kulturen-Koffer Früher/Heute,
  Kakao-Weg Milch, Erdzeit-Leiter Zeitalter): **Der volle Lauf kann weitere finden.**
- **Prüfer-Kandidat:** Ähnliche, nicht gleiche Bilder (☀️ zu 🌞, 🍂 zu 🍁) findet die Prüfung nicht.
- **Eigener Fehler in einer Vorlage:** ÜB1 a schlug vor, Zeilen aus lauter bekannten Zellen abzuhaken — übersehen, dass
  eine Zeile einen Zusammenhang behauptet; beim Bauen bemerkt und als ÜB2 vorgelegt.
- **Zufallsfolge:** Eine Sperre, die vor der Wahl der Richtung abbricht, verschiebt die Zufallsfolge — nur die Gegenprobe
  mit 20 000 Startwerten zeigte es (Geheimschrift).
- **Zusammengesetzte Emojis:** 👩‍🏫 enthält 🏫 — die Prüfung zählt jetzt je Graphem.
- **Kein Pfeil an `summary`:** `display: flex` entfernt ihn; zugeklappte Gruppen sahen wie leer aus.
- **Browser-Bereich:** Tab-Grenze erreicht, Dateitabs lassen sich nicht umleiten; `bilder_aufnehmen.js --vorher` war der
  verlässliche Weg. Im Browser-Bereich liegt ein Test-Kind „Bildkind“ (localhost).
- **Fedlex** liefert ohne JavaScript nichts; das gespeicherte PDF mit `quelle_suchen.py`/`pdftotext` gelesen.
- **Hooks** wiesen Heredocs mit Backslash und `cd` ab — Edit oder Skriptdateien genommen.

## Verifikation
- Kurze Tests (`node tools/pruefe.js`): Skripte, Kern „6075 Fälle, 0 Fehler.“, Server „61 Fälle, 0 Fehler.“, Lernsteig,
  Gratwanderung, Feier „169 Spiele, 6084 Bilder, keine Fehler.“, Schrift — alle ohne Fehler.
- Prüfansicht und Eulenpfad je geändertem Spiel „Keine Fehler.“; Eulenpfad verkürzt über alle Spiele (2 Runden, 50
  Aufgaben, ohne Kind) „Keine Fehler.“ nach Durchgang 2.
- **Kein voller Eulenpfad-Lauf** in dieser Sitzung — letzter voller Lauf weiter auf `6055527`.
- Im Browser nicht angesehen: Prüfansicht mit Entwickler-Server nach Kern 1.45 (graue Zellen, „✓ übernommen“).

## Offene Punkte / Plan für die nächste Session
1. **Voller Eulenpfad-Lauf** auf Patriks Entscheid vor dem nächsten Push (21 Commits und dieser Abschluss ungepusht);
   „Bild verrät“ kann dort weitere Fälle melden.
2. **Übrige Befunde** aus der Befund-Datei: Plan-Leser (Massstab zur Plangrösse, Zeichen), Taschengeld-Planer (Bilder,
   „Blumen für Mama“, Bedarf als Sparziel), Blutkreislauf, Bionik, Gemeinde-Helfer (PET, Schwimmunterricht, Kühlschrank),
   Kulturen-Koffer (Tonkrug ohne Stufe, Sachangaben China), Pflanzen-Bestimmer, Kakao-Weg (Papier), Tageslauf-Sonne
   (Essensbilder), Datei-Typen (.gif), Lärm-Skala, Stromkreis (schwache Ablenker), Energie (Bilder), Erdzeit
   („2 500 000“).
3. **Prüfansicht nach Kern 1.45** im Browser mit Entwickler-Server ansehen; im Lernsteig alte Haken ohne Fingerabdruck
   (Werkzeug bisher nur Eulenpfad).
4. Nachbauten in Prüfansichten (in Kauf genommen): plan-leser `stufenMit("tippen","zaehlen")`, koenig-falle `ZWEI`,
   Geheimschrift Braille-Text; Prüfstand-Listen ohne Fingerabdruck (taschengeld-planer/waren,
   tageslauf-sonne/taetigkeiten) nach einer neuen Prüfung mit Fingerabdruck.
5. **LERN-11** (Listen prüfen) läuft bei Patrik — die Prüfansicht hilft jetzt mit „schon geprüft“.
