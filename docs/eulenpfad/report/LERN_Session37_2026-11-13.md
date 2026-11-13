# LERN_Session37_2026-11-13_anleitungen-neu-strukturieren

## Schwerpunkt
Bemerkung 53 (Znüni-Teller), dann die Anleitungen neu aufgebaut nach einer Vorlage mit Entscheiden AL1 a–AL7 a, danach
die Prüfung je Eintrag (LP5 a, LERN-51) weiter in Blöcken nach T4 a: Block 4 Deutsch, Englisch, Französisch und NMG
Block 1 — je Block fünf (oder drei bis vier) parallele Agenten mit zwei Spielen, jedes Ergebnis von mir gelesen und im
Browser bzw. kopflos geprüft. Acht Commits von Patrik (`a305878` bis `154b2f0`); dieser Abschluss noch zu committen.
Entwickler-Bemerkungen: Nr. 53 erledigt (die einzige offene).

## Entscheide (Patrik, 13.11.2026)
- **AL1 a–AL7 a** (docs/eulenpfad/konzept_anleitungen.md): eine Legende je Bild, deren Zähler die rote Nummer ist;
  Bildblock (Bild mit Legende, führender Text davor); Ausschnitt um die Rahmen, 1 : 1; Nummer nach der Lage; Prüfer
  Legende ↔ Rahmen in `pruefe_skripte.js`; ein Stil für beide Anleitungen; jedes Bild breit (816 px) und schmal (390 px).
  AL7 kam aus Patriks Rückfrage zu AL3 (Kinder spielen auch am Tablet und im Browser).
- **Bemerkung 53:** Süsses und Salziges in der Liste getrennt (Art süss/salzig), im Spiel ein Korb (Wunsch Patrik).
- **Anleitung Klassen-Zeichen** (Hinweis Patrik): Das Zeichen steht oben links auf der Karte, der Rand hat seine Farbe.

## Neu
- **Anleitungen** neu aufgebaut: `aufsicht.html`, `kinder.html`, `anleitung.css`; 40 Bilder je breit und schmal (80
  Dateien), alte 36 entfernt; neu a23 Zufall, a24 Selbst umstellen, a25 Dezimalzeichen, a26 Eigene Empfehlung, k15
  Weiterspielen; a20 entfällt (beide zeigen k14).
- **`tools/anleitung_bilder.js`** neu: Ziele mit Schlüssel, Nummer nach Lage, Ausschnitt ohne angeschnittene Zeilen,
  Knöpfe und Bilder, Rahmen nur um den sichtbaren Teil, Fenster bis ans Ausschnittende statt Scrollen; schreibt
  `docs/eulenpfad/anleitung_rahmen.json` (Schlüssel, Grösse, Fingerabdruck je Bild und Fassung).
- **`tools/pruefe_skripte.js` Punkt 9** (AL5 a): Legenden gegen die Rahmen in beiden Fassungen, keine Nummern von Hand,
  Fingerabdrücke, unbenutzte Bilder; acht Gegenproben.
- **`tools/pruefe_pruefansicht.js`** (Ladeprüfung jeder Zeile einer Prüfansicht, Fingerabdruck je Liste) und
  **`docs/eulenpfad/auftrag_pruefansicht.md`** (gemeinsamer Auftrag der Agenten) — beide entstanden im Lauf der Sitzung
  im Scratchpad und wurden zum Abschluss ins Repo übernommen.
- **`pruefung.js` für 41 Spiele:** Znüni-Teller; Block 4 Deutsch (9); Englisch (7, Spelling-Bee leiht nur); Französisch
  (5, drei Spiele ohne Listen); NMG Block 1 (10).
- **Aufgabenschritte ins Spiel gezogen** statt in der Prüfansicht nachgebaut, in 25 Spielen (meist die Stufentabelle als
  Daten `STUFE_ARTEN`, dazu kleine Funktionen wie `inStufe`, `NIMMT`, `satzAufgabe`); Aufgaben unverändert, ab dem
  Französisch-Block je Stufe mehrere hundert Aufgaben mit festem Startwert vorher und nachher verglichen.

## Geändert
- Znüni-Teller: Liste mit Art süss/salzig; `tools/pruefliste_wortlisten.js` mit Spalte Art, `listen.json` und
  `wortlisten_zur_pruefung.md` neu erzeugt.
- Weather-Report: „What was the score in the … match?“ (vorher ohne „in“).

## Stolperfallen
- **Prüfer-Kandidat (manuell durchgesetzt, dreimal):** Agenten bauten Schritte der Aufgabe in der Prüfansicht nach (Block
  4: drei Spiele, Englisch: fünf), ich habe sie jedes Mal von Hand ins Spiel gezogen; ab Französisch stand die Regel im
  Auftrag. Ein Prüfer könnte in `pruefung.js` Stufenangaben als Zahlentext („Stufen 3, 4“) und Kopien von Zeichenketten
  aus `index.html` melden.
- **Hook-Kandidat:** Ein Agent benutzte den eingebauten Browser, schloss den Tab und öffnete einen neuen — damit war
  Patriks Anmeldung als Aufsicht weg (sessionStorage je Tab), und der Testserver lief nicht mehr. Seither steht im Auftrag
  der Agenten ein Verbot; ein Hook könnte `mcp__Claude_Browser__*` für Unteragenten sperren.
- **Mein Fix zu breit:** Das „in“ bei Weather-Report traf zuerst auch die Sieger-Frage („Who won in …“); erst die
  Durchsicht aller Fragen im Browser zeigte es.
- **Bilder-Werkzeug:** Fester Hintergrund (`background-attachment: fixed`) endete nach einer Fensterhöhe; nach einem
  Scrollen lag die festsitzende Kopfzeile über dem Ausschnitt; `<option>`-Text meldet Flächen der ganzen Liste; ein
  Element in einem Scrollbereich (Notizblock auf dem Handy) liegt unter dem Ziffernfeld — alles im Werkzeug abgefangen.
- **AL2 durch AL7 überholt:** Die breite Fassung ist so breit wie die Karte; „nebeneinander“ greift heute nirgends
  (Konzept Abschnitt 4).
- **CHANGELOG CRLF:** angehängte Zeilen waren LF; mit `patchlib` je Anker geht es richtig.
- **Kopflos statt Browser-Pane:** Bei verborgenem Fenster laden iframes nicht; `bilder_aufnehmen.js` mit `--vorher` ist
  der verlässliche Weg, Prüfansichten anzusehen.

## Inhaltliche Auffälligkeiten aus den Agenten (nicht geändert, beim Prüfen ansehen)
- **Block 4 Deutsch:** Gattungs-Kenner (vier Texte mit zweiter passender Stelle, Karten „Echter Ort“/„Zauber“ nicht
  eindeutig, „mittendrin“); Gefühle-Radar (drei gemeine „unpassende“ Antworten, zweimal Tod eines Haustiers);
  Figuren-Spiegel (vier wahre Motiv-Ablenker, „Der Zopf“); Geschichten-Ordner („Das Loch im Zahn“ mit Apfel);
  Hör-Geschichte („Der Fuchs beim Zelt“: Wildfuchs füttern); Korrektur-Stift (Hunger, Kindheit nie gezeigt;
  „lustiche“); Wortarten-Probe („laut“, „schnell“ beim Verb nicht als Falle); Sachtext („am weitesten“ bei Gehzeiten).
- **Englisch:** Ente/Vogel (Word-Match, Listen & Tap); Hello-Dialog (zweiter Knopf passt oft, Sprecherbilder Playground,
  „St. Gallen“); Sound-Sorter („meet“ in keiner Stufe, „Wie klingt das i?“ bei my, fly); Wort-Zwillinge (chocolate,
  rocket eher „ähnlich“; where/who).
- **Französisch:** Wörter-Brücke (vier Fallen nur über Englisch: cave, librairie, pain, coin); Au café (Salut als
  Abschied, Befinden als Ablenker passt, „En Guete!“, „Bof …“); Mots-Match (raisin = Trauben); Son-Lauscher (l’_fant).
- **NMG Block 1:** Lebensraum (Grasfrosch, Bergmolch, Fuchs, Reh, Regenwurm mit zwei Räumen; Gras → Reh);
  Tier-Sortierer (Unpaarhufer-Erklärung, Fliege/Mücke als Wildtier, 🐇); Lebenszyklus (Beuteltiere auch „lebend“,
  Apfelkerne nach dem Apfel, Stufentext s2); Fledermaus (Morgen, Zug nach Süden); Magnet-Labor („nur Eisen“, kein
  Metall, das nicht angezogen wird); Schwimmt oder sinkt? (Korbbilder verraten die Lösung); Schweiz-Karte (Orte näher als
  die Tippfläche, Sitten/Delsberg); Früher und heute („gab es schon“ erfunden oder verbreitet); Körper-Puzzle (✋ Haut und
  Hand).

## Verifikation
Je Block: `pruefe_skripte` „Keine Fehler.“, Ladeprüfung jeder Zeile (Zellen = Spalten) ohne Fehler, `pruefe_spiele`
der Spiele des Blocks „Keine Fehler.“ (Englisch mit Spelling-Bee, Weather-Report nach dem Fix nochmals), im Browser je
Liste Zeilen = Einträge (Block 4, Englisch, Französisch; NMG Block 1 nur in Node, um Patriks Browser nicht zu stören),
alle Ansichten hell und dunkel aufgenommen und angesehen. Anleitungen: beide Seiten bei 1024 und 375 px hell und dunkel,
alle 80 Bilder auf Bögen. Kurze Testreihe am Schluss (`node tools/pruefe.js`): siehe Handover. Eulenpfad nur Blöcke —
**letzter voller Lauf weiter auf `6055527`**.

## Offene Punkte / Plan für die nächste Session
1. **Inhaltslisten NMG Block 2** (9): schulweg-profi, wetter-jahreszeiten, zeitstrahl-sortierer, stromkreis-bauer,
   plan-leser, echt-oder-erfunden, taschengeld-planer, wassertropfen-reise, erdzeit-leiter; dann **Block 3** (8):
   pflanzen-bestimmer, blutkreislauf-lotse, energie-wandler, bionik-paare, kakao-weg, gemeinde-helfer, kulturen-koffer,
   laerm-waechter; dann MI und Musik. Agenten nach `docs/eulenpfad/auftrag_pruefansicht.md` (Vertrag, Vorbilder, „Schritt
   ins Spiel ziehen“ mit Nachweis gleicher Aufgaben, kein eingebauter Browser, Pflichtprüfungen), Ladeprüfung mit
   `tools/pruefe_pruefansicht.js`.
2. Inhaltliche Auffälligkeiten oben beim Prüfen der Listen ansehen (Patrik oder Lehrperson).
3. Voller Eulenpfad-Lauf auf Patriks Entscheid vor dem nächsten Push (seit `6055527` nicht gepusht).
3a. **Anleitung k04** (Hinweis Patrik am Ende der Sitzung): Rahmen 1 „Das ist die Aufgabe“ umfasst nur die Zahl
   (`.zahl-gross`, darin der Tipp-Knopf 💡); „runde auf Hunderter“ gehört zur Aufgabe und steht ausserhalb. Ziel im
   Werkzeug auf Zahl und Auftrag zusammen setzen (ohne 💡), Bilder neu aufnehmen.
4. Vorgemerkt: Easter Eggs zu besonderen Tagen (eigenes Konzept vor dem Bau).
