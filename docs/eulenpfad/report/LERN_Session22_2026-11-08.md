# LERN_Session22_2026-11-08_vorrat-sprachuebungen

## Schwerpunkt
Plan E 9 (Vorrat und Vielfalt der Lernsteig-Übungen) zu Ende: die drei übrigen Sprachübungen nach SP1 a (rechtschreibung,
englisch-grammatik, franzoesisch-grammatik), danach die zwei Restpunkte von E 9 (`folgen` j mit weiteren Figuren, Zahlwort
in `zehnerpotenzen`, Entscheid ZW1 a). Dazu der Englisch- und der Französisch-Teil von Plan E 8. Fünf Commits von
`7b34e24` bis `13199a7`, nicht gepusht; dazu dieser Abschluss.

## Neu
- **Vorrat der Sprachübungen** (SP1 a, je Stufe mindestens 48 Sätze = 6 Runden zu 8):
  - rechtschreibung d 20 → 51, e 14 → 49 (dazu -isch), f 13 → 48 (Verben als Nomen auch nach „nach dem“, „vor dem“),
    g 11 → 48; Challenge 196.
  - englisch-grammatik b 11 → 49, c 14 → 49, d 16 → 54 (Zeitformen auch present progressive, simple present);
    Challenge 152.
  - franzoesisch-grammatik b 13 → 51, c 13 → 48 (Mehrzahl auch -eu → -eux), d 16 → 52 (Zeitformen auch présent);
    Challenge 151.
  - Die drei Challenges sind über 100 Sätze und deshalb im Katalog auch als Serie (`endlos: ["challenge"]`).
  - Alle neuen Sätze stehen ab dem Vermerk „Erweitert in LERN_Session22“; die Listen bleiben ungeprüft.
- **folgen j:** acht beschriebene Figuren mit Bauplan in Worten (`FIGUREN`: Dreiecke, Quadrate, Fünf- und Sechsecke aus
  Hölzchen, Doppelreihe Quadrate, Tische mit Stühlen, Kreuz und Winkel aus Plättchen), in einem Drittel der Aufgaben;
  53 → 61 Aufgaben. Die Prüfung zählt nach dem Bauplan (`ZAEHLUNG`), nicht aus a und b.
- **Prüfungen:**
  - rechtschreibung nimmt „dem“ vor der Lücke als Artikel.
  - englisch-grammatik: Satzvarianten müssen dieselben Wörter haben (bis auf to, do/does, -s/-es); vorher genügte eine
    ähnliche Länge.
  - franzoesisch-grammatik: dieselbe Wortprüfung (bis auf que, à, ne/n'); vorher gab es keine.
  - zehnerpotenzen: die Form von „Million“ aus der Zahl selbst (eine Million, …eine Million, sonst Millionen).

## Geändert
- **zehnerpotenzen i** (ZW1 a): „einhunderteine Million“ statt „einhundertein Millionen“ für 101, 201 … 901 Millionen;
  der Lösungsweg nennt die Einzahl. Belege mit Reichweite im CHANGELOG.
- **Plan E 8:** Englisch „The keys are ___ the table“ ohne „at“; Französisch „Ce vélo est à moi“, „Ces clés sont à
  elle“ statt „de moi“, „d'elle“. Ablenker „I play tennis often play.“ → „I tennis often play.“
- Regeltexte ergänzt (rechtschreibung „nach dem“, „-isch“; Zeitformen in beiden Fremdsprachen; -eu → -eux).
- Prüfvermerke Patrik von heute im Eulenpfad-Prüfstand (magnet-labor, taschengeld-planer) im Commit `343738d`.

## Stolperfallen
- **Zahl der Hinweise in der Commit-Message falsch** (folgen j: „4 Hinweise“ statt „0“), selbst bemerkt und berichtigt;
  **zweiter Fall** nach LERN_Session21 („17 statt 18“). **Hook-/Prüfer-Kandidat:** Testzahlen für Commit-Message und
  CHANGELOG aus einer gespeicherten Testausgabe einsetzen (etwa `tools/pruefe.js` schreibt die Schlusszeilen in eine
  Datei unter `.temp/`), statt sie abzuschreiben.
- **Falsche Commit-Message bei Patrik:** Der Französisch-Commit trug zuerst die Message der englischen Übung (Codeblock
  der Antwort davor kopiert); beim Prüfen von `git log` vor dem nächsten Schritt aufgefallen, Patrik hat sie ersetzt
  (`4d1916a`). Vor jedem Schritt nicht nur „Arbeitsbaum sauber“ prüfen, sondern auch, ob die letzte Message zu den
  Dateien passt. **Hook-Kandidat** (erster Fall): Abgleich Übungsname in der Message gegen die geänderten Pfade.
- **Fast falsche Angabe im CHANGELOG:** „Le livre est ___ la table ersetzt“ geschrieben, obwohl der Satz blieb und ein
  neuer dazukam; vor dem Schreiben bemerkt. Angaben über Änderungen aus dem Skript ablesen, nicht aus der Absicht.
- **Quellen zum Zahlwort:** Das Amtliche Regelwerk regelt die Schreibung, nicht Einzahl/Mehrzahl nach „…ein“; die
  Zusammenfassungen von WebFetch und WebSearch wurden nicht als Beleg genommen, nur wörtlich zitierte Stellen und die
  eigene Suche mit `quelle_suchen.py` im PDF. Die Duden-Grammatik ist nicht gelesen; ZW1 a stützt sich auf eine nicht
  amtliche Quelle und die Beugung im Duden-Beispiel.
- **Ablenker, die auch richtig sein könnten:** Beim Erweitern bewusst gemieden (Possessiv „ma veste“, „tes clés“,
  „leurs“; Präposition „at the table“, „sous le lit“; „but“ bei Folge-Sätzen). Der Test erkennt das nicht — es bleibt
  Sache der Durchsicht.
- Hooks haben dreimal richtig abgewiesen (`cd` auf oberster Ebene, Backslash im Heredoc, Backtick in `python -c`);
  jeweils auf Skriptdatei im Scratchpad ausgewichen.
- `pruefe_uebungen.js <übung> terme` meldet weiter drei Seitenfehler (Notizblock, Tastenfeld, Gleichung), weil die
  Seitentests rationale-zahlen und gleichungen verlangen; nicht behoben (bekannt seit LERN_Session21).

## Verifikation
- Kern „5671 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 0 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung
  „Keine Fehler.“ — nach jedem Schritt der kurze Lauf ganz.
- Gegenproben je Schritt, alle gemeldet: rechtschreibung (Verb ohne Artikel, Satzvariante mit anderem Wort,
  Gross/klein mit anderer Schreibung); englisch (anderes Verb, anderes Nomen); französisch (anderes Nomen, andere
  Verneinung, fehlendes geschütztes Leerzeichen); folgen j (Tische 3n + 1, Datei danach byte-gleich); zehnerpotenzen
  (alte Form, Datei danach byte-gleich).
- Zeilenenden nach jedem Schreiben mit `patchlib --pruefe`: keine gemischten Dateien.
- Eulenpfad: nicht gelaufen (kein Eulenpfad-Code geändert, nur Prüfvermerke). Browser: nicht geprüft — die Übungen sind
  für den Gast gesperrt; die neuen Sätze stehen in den Listen zum Durchsehen.

## Nachtrag nach dem Abschluss: Durchsicht der Listen
Auftrag Patrik („du kannst die listen durchziehen“): die sieben Listen aus LERN_Session21 und 22 (rechtschreibung,
grammatik, englisch-grammatik, franzoesisch-grammatik, kraefte/maschinen, stromkreis b) von vier unabhängigen Prüfern
gelesen (je Sprache bzw. Physik ein Agent, nur mit den Dateien, ohne Einschätzung), jeder Befund gegen die Datei
nachgeprüft. Ein Commit `b636a14`.
- **Echte Fehler:** „parce que elle“ im französischen Lösungsweg; Regel „verb-klein“ allgemein falsch („Schwimmen ist
  gesund“); „Wir helfen dir“ führt über die Stammregel („half“) zu „hälfen“.
- **Zwei richtige Antworten:** englische Reflexiv-Ablenker, die als Objektpronomen auch gehen („The machine turns it
  off“); Fragen nur über die Satzmelodie („He plays the guitar?“); zwei „sie“-Sätze in der Mehrzahl, die auch als
  Höflichkeitsform gehen; „gern“ ist steigerbar (lieber).
- **Gegen KR1 a:** sechs Maschinenbeispiele mit Kurbel oder Winde (Wellräder) durch Ketten- und Zahnradbeispiele
  ersetzt; Prüfung weist Kurbel, Winde, Keil im Beispiel ab; Lösungsweg begründet je Maschine.
- **stromkreis b:** alle 37 Antworten im Modell richtig; feste Spannung in der Einleitung, Strommesser hinter der
  Batterie, „zeigt 0“, eigene Optionen für den Zweigvergleich.
- **ZF1 a:** englische Zeitformen wie im Lehrmittel Open World (present simple, present/past continuous, past simple);
  Prüfung nur mit diesen Namen. Beleg: ein Arbeitsblatt zu Open World, die Verlagsseite gab 404.
- **Bewusst gelassen:** „sehr“ als Partikel, Schere als Hebel, fünf Lämpchen in Serie (mit Satz im Lösungsweg).
- **Stolperfalle:** „zeigt null“ löste die Prüfung auf Programmwerte im Text aus (`\bnull\b`); die erste
  Stromkreis-Gegenprobe war davon überdeckt und wurde wiederholt. Bei einer Gegenprobe zuerst den Lauf ohne Fehler
  ansehen.
- Tests nach dem Nachtrag: Kern „5671 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 0 Hinweise.“ (Konten 101 Fälle),
  Gratwanderung „Keine Fehler.“; Gegenproben (Kurbel, Zweigvergleich, „simple past“) gemeldet.

## Offene Punkte / Plan für die nächste Session
1. **Push** der sieben Commits bis `b636a14` und dieses Nachtrags (Pages veröffentlicht; kein Eulenpfad-Code geändert,
   voller Lauf nur auf Patriks Entscheid).
2. **Freigabe im Prüfstand durch Patrik:** Die sieben Listen sind durchgesehen (Nachtrag), die Vermerke setzt weiter
   nur der Entwickler-Modus; dazu die Figuren in folgen j, Piktogramme, Tab Übungen, Rechner am Rand.
3. **Zur Absegnung:** gemeinsamer Kern-Teil für Gruppen und Favoriten (aus LERN_Session21, braucht einen vollen
   Eulenpfad-Lauf).
4. Übrige Punkte von Plan E, soweit offen (etwa E 7 Kräfte: Stufe a nach Seitentext; E 10 Hinweise), dann laut Plan
   C4, C6–C8, C10; zurückgestellt: periodische Dezimalzahlen.
5. Hook-Kandidaten aus den Stolperfallen zur Absegnung vorlegen (Testzahlen aus Datei; Message gegen Pfade).
