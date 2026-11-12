# Konzept: Gestaltung der Startseite (Kinder-Bühne, Kartenbilder, Schrift)

Stand: 11.11.2026 (LERN_Session32) · **GS0 a, GS1 a, GS2 a, SK1 a entschieden und gebaut** (Patrik, LERN_Session32;
Umsetzung docs/eulenpfad/rahmen.md 6, „Kartenbild und Kinderkarte“); GS3 a (Schrift Nunito) gebaut; dazu der Stil wie
von Hand gezeichnet (Wunsch Patrik, Einstellung `stil`, Standard hand: Rahmen, Raster, Knöpfe, Felder) auf der
Startseite und um die Runde jedes Spiels herum (SP1: Stufenwahl, Ranglisten, Schlussbild; rahmen.md 6), Blöcke der
Verwaltung, Form des Avatar-Rahmens wählbar, Druckknöpfe; offen der Versuch mit Kindern und der Lehrperson.

**Kipppunkt GS1 gemessen** (Desktop, lokaler Server): `feier.js` 28 ms übertragen, 2 ms ausgeführt, ein Kartenbild
0,17 ms; die Seite ist nach 83 ms fertig. Für das Handy übers Mobilnetz nur gerechnet, nicht gemessen: 204 KB gepackt
beim ersten Besuch etwa 0,2 s (4G) bis 1 s (langsames 3G), danach aus dem Zwischenspeicher. Die Empfehlung kippt damit
nicht; am Gerät nachmessen, wenn ein Handy zur Hand ist. Eingang: [rueckmeldung_gestaltung.md](rueckmeldung_gestaltung.md).

## Auslöser

Eine Lehrperson fand den Eulenpfad „steril“ und „nach KI“. Die Einschätzung dazu (Eingang, Chat LERN_Session27):
Inhaltlich stark, im Auftritt ein Verwaltungsportal — viel kleiner grauer Text auf den Karten, Standard-Look von
Dashboards (Pillen-Filter, Tab-Leiste, dünne Ränder, Systemschrift), keine Bild-Identität der Spiele. Die Spielseiten
selbst gelten als gelungen. Hebel: Bildkarten (Idee Patrik: aus den Abschluss-Animationen), Kinder-Bühne und
Lehrer-Cockpit trennen, rundere Schrift und Druckknöpfe.

## Befund heute (Vorarbeit LERN_Session32)

**Spielkarte** (`start/spiele.js` `karte()`, Stil `start/start.css` `.spielkarte`): Schalterleiste (Klassen-Marke,
Reihenfolge, ⏱, ♾, ☆) · Emoji 44 px und Name 22 px · Beschreibung als grauer Text 15 px (`--text-leise`) · Lernziel-Kürzel
als Pillen 13 px („4.2-G1“) · sechs Stufenknöpfe mit Symbol, Nummer und Sternen 11 px. Darüber der Filter (Fach, Klasse,
Nur, Stufe als Pillen, ausgeklappt), Suche, Kacheln/Kompakt, die Zufallskarten mit langen Sätzen („Die Eule zieht ein
Spiel aus deiner Auswahl — eher eines, das du noch üben solltest.“). Gesehen im Browser mit einem Testprofil 3. Klasse.

**Der zitierte Satz** „In den letzten 3 Aufgaben nur 33 % auf Anhieb richtig …“ steht nicht auf den Spielkarten, sondern
in der Kinder-Statistik, Karte „🦉 Das übe ich als Nächstes“ (`auswertung.js` `vorschlaege()`, `statistik.js`).

**Frühere Entscheide, die das Konzept binden** (Fundstellen im Bericht der Vorarbeit, LERN_Session32):

| Entscheid | Inhalt | Folge für dieses Konzept |
|---|---|---|
| Plan Angleich, Grundsatz (Auftrag Patrik 2026-11-05, `docs/plan_angleich_reihe.md`) | „Der Eulenpfad bleibt im Aussehen, wie er ist (höchstens kleine Retuschen)“ | steht dem Umbau entgegen → **GS0** |
| ST1 a (LERN_Session12) | Kind sieht in der Statistik vier Karten; Konzentration, Vorgehen, Lernzeiten nur die Aufsicht | Hebel 2 ist in der Statistik schon entschieden; Lücke behoben (unten) |
| L1 a–L4 a, K1 a, K2 a, G1 a, ZG1 a, SU1 a | Tabs, Freigaben, „Meine Klasse“, Klassen-Rand, Weiterspielen, Suche | bleiben; das Konzept ändert Aussehen und Text der Karte, nicht diese Abläufe |
| Vorlesen (LERN_Session8) | langes Drücken liest Name und Beschreibung | trägt die Beschreibung, wenn sie von der Karte geht → **GS2** |
| CLAUDE.md, Alter | 2. Klasse fast ohne Lesetext, 4. Klasse kurze Sätze erlaubt | Massstab für **GS2** |
| AN1 a–AR1 a, Regeln 3, 6, 7 (Konzept Abschluss-Animationen) | ruhiges Endbild, ohne Text, SVG ohne Bilddateien | Kartenbild ohne neue Zeichnungen möglich → **GS1** |
| KT1 a, PA1 a (Kern) | Übersicht, Filter, Personenmenü, Tab-Leiste sind Kern-Bausteine beider Apps | reine CSS-Änderungen in `start.css` berühren den Lernsteig nicht; ein Umbau der Bausteine schon |
| LERN-1, P1 a | ohne externe Abhängigkeiten, App-Ordner eigenständig | eine Schrift nur als Datei im App-Ordner → **GS3** |
| — | Schrift: kein Entscheid; `--schrift` nennt „Nunito“ zuerst, im Repo liegt aber keine Schriftdatei | heute zeigt jedes Gerät seine eigene Schrift → **GS3** |

**Behoben in der Vorarbeit** (Abweichungen von Entscheiden, keine Frage):
- Die Kinder-Statistik zeigte Konzentrations-Vorschläge („🧠 Konzentration … Prozentpunkte“) — gegen ST1 a. Jetzt
  ausgefiltert (`statistik.js`).
- `tools/pruefe_skripte.js` prüfte nach LERN-1 nur `<script src>`; eine Schrift von einem Schriftdienst per `<link>`,
  `@import` oder `url()` wäre durchgerutscht. Jetzt geprüft, mit Gegenproben.

## Zahlen zu den Kartenbildern (gemessen LERN_Session32)

Gemessen im Browser: je Spiel die Spielseite im Vorschau-Modus (`?feier=s3&sterne=3&ruhig=1`), Länge des SVG-Markups.

| Grösse | Wert |
|---|---|
| Endbild je Spiel, Median | 3,5 KB (kleinstes 1,7 KB, 90 % unter 7,2 KB) |
| Ausreisser | Schweiz-Karte 123 KB (Kantonsgrenzen), danach 16 KB |
| alle 169 Endbilder zusammen | 821 KB (ohne Schweiz-Karte 698 KB) |
| Feier-Angaben aller Spiele (`feier: {…}` in den Spielseiten) | 63 KB, im Schnitt 371 B je Spiel |
| `feier.js` (alle Muster und Bilder) | 737 KB, gepackt (gzip, wie Pages ausliefert) 204 KB |
| `katalog.js` heute | 131 KB; jede Spielseite lädt ihn (169 von 169) |
| Farben in den Bildern | 191 Stellen mit `var(--…)` in `feier.js`: ein Bild als eigene Datei (`<img>`) kennt die Variablen aus `stil.css` nicht |

## Entscheidungsfragen

### GS0 — Gilt „Aussehen bleibt“ weiter für die Startseite? → **a** (Patrik, 11.11.2026)

**Zusatz DM0 a** (Patrik, 12.11.2026, [konzept_darkmode.md](../konzept_darkmode.md)): Ausgenommen ist der dunkle
Farbsatz — wer ihn wählt, sieht auch die laufende Runde dunkel; Aufbau, Formen und Stellenfarben bleiben gleich.

**Ort:** `docs/plan_angleich_reihe.md`, Grundsätze.
**Heute:** „Der Eulenpfad bleibt im Aussehen, wie er ist (höchstens kleine Retuschen); der Lernsteig wird ihm im Aufbau
ähnlich, nur erwachsener …“
**Problem:** Die Rückmeldung verlangt mehr als Retuschen (Kartenbilder, weniger Text, Schrift). Ohne neuen Entscheid
widerspricht jeder Schritt dem Grundsatz.

- **a (Empfehlung):** „Der Eulenpfad bleibt in den Spielen im Aussehen, wie er ist (höchstens kleine Retuschen). Die
  Startseite (Tabs Spiele, Profil, Statistik, Erfolge) wird nach docs/eulenpfad/konzept_gestaltung.md überarbeitet
  (Entscheid GS0 a); der Lernsteig übernimmt davon nur den Aufbau, nicht das Kindliche.“
- **b:** Grundsatz bleibt; aus der Rückmeldung nur Retuschen (Text kürzen, Knöpfe), keine Kartenbilder, keine Schrift.

*Warum die Empfehlung:* Der Grundsatz schützte die Spielseiten beim Angleich der Reihe vor dem Umbau des Lernsteigs — sie
gelten auch in der Rückmeldung als gelungen. Die Kritik trifft die Startseite; a öffnet genau sie und hält die Spiele fest.
Für b spricht, dass die Reihe gerade erst angeglichen ist und jede Änderung an Kern-Bausteinen beide Apps trifft — das
fängt a ab, weil der Lernsteig nur den Aufbau übernimmt. Kippen würde die Empfehlung, wenn Kinder und die Lehrperson im
Versuch die heutige Startseite gar nicht als Hürde erleben (dann reichen Retuschen).

### GS1 — Woher kommen die Kartenbilder? → **a** (Patrik, 11.11.2026)

**Ort:** neu; Startseite `start/spiele.js` `karte()`, Katalog `spiele/gemeinsam/katalog.js`, Feier-Angaben heute in
`spiele/<id>/index.html` (`LS.spiel({ feier })`).
**Heute:** je Karte ein Emoji (`bild` im Katalog). Die Feier-Angaben stehen nur in den Spielseiten; die Startseite lädt
`feier.js` nicht.
**Problem:** Das Endbild der Abschluss-Animation ist die Bild-Identität, die die Rückmeldung vermisst — es braucht eine
Quelle, aus der die Startseite es zeichnen kann, ohne dass es zweimal gepflegt wird.

- **a (Empfehlung):** „Die Feier-Angabe jedes Spiels zieht in den Katalog (`feier` im Eintrag, einzige Quelle; die
  Spielseite liest sie dort). Die Startseite lädt `feier.js` und zeichnet je sichtbarer Karte das ruhige Endbild der
  Stufe 3 mit 3 Sternen (`LS_FEIER.zeige(…, { ruhig: true })`), erst wenn die Karte ins Bild kommt.“
- **b:** „Ein Werkzeug `tools/kartenbilder.js` schreibt je Spiel das Endbild als SVG-Datei nach
  `eulenpfad/kartenbilder/<id>.svg` (Farben aufgelöst); die Startseite zeigt sie als `<img loading="lazy">`; eine
  Prüfung meldet jede Datei, die nicht mehr dem heutigen Bild gleicht.“
- **c:** Bildschirmfotos der Vorschau als PNG je Spiel.

*Warum die Empfehlung:* a hat eine Quelle und keine Kopie: Wird ein Bild nachgebessert (wie heute 41–49), stimmt die
Karte sofort; Farben kommen aus `stil.css` wie im Spiel. Der Katalog ist schon die Quelle aller Angaben je Spiel, jede
Spielseite lädt ihn — die 63 KB Feier-Angaben gehören dorthin (Katalog 131 → 194 KB). Gegen a spricht die Ladegrösse:
`feier.js` 737 KB (204 KB gepackt) einmal beim ersten Besuch, danach aus dem Zwischenspeicher. b lädt je Bildschirm nur
die sichtbaren Bilder (rund 10 × 3,5 KB), legt aber 821 KB erzeugte Dateien ins Repo, braucht eine Gleichheitsprüfung
(wie Kern und Kopien) und muss die 191 Farbvariablen beim Erzeugen auflösen — ändert sich eine Farbe in `stil.css`, sind
alle Dateien falsch, bis das Werkzeug läuft. c ist wie b ohne Prüfung und unscharf auf grossen Bildschirmen. Kippen würde
die Empfehlung, wenn die Startseite auf dem Handy über das Mobilnetz spürbar langsamer startet (messen: erster Aufruf
mit und ohne `feier.js` auf `handy-quer` und 375 px) — dann b mit derselben Quelle im Katalog.

**Zusatz SK1 a (Patrik, 11.11.2026):** Die Schweiz-Karte rechnete ihre Animation aus den Kartendaten der Seite. Jetzt
nennt der Katalog Karte und Auswahl nur beim Namen (`karte: "schweiz"`, `flaechen: "ostschweiz"`, `daten: ["karte.js",
"orte.js"]`); `orte.js` meldet sie mit den Regeln des Spiels an (`LS_FEIER.kartenDaten`), die Startseite lädt die beiden
Dateien nach, wenn die Karte ins Bild kommt. Damit stehen alle 169 Angaben im Katalog.

### GS2 — Welcher Text bleibt auf der Karte, die ein Kind sieht? → **a** (Patrik, 11.11.2026)

**Ort:** `start/spiele.js` `karte()`, `start/start.css` `.ziel`, `.marken`; Zufallskarten `zufallsKarte`.
**Heute:** Name, Beschreibung (grau, 15 px), Lernziel-Kürzel, sechs Stufenknöpfe; Zufallskarten mit ganzen Sätzen.
**Problem:** Ein Kind liest die Beschreibung nicht, die Kürzel versteht es nicht; für die Lehrperson wirkt der Text
generiert. Die Regel im CLAUDE.md erlaubt ab der 4. Klasse kurze Sätze, verlangt sie aber nicht.

- **a (Empfehlung):** „Ein Kind sieht je Karte das Kartenbild (GS1), den Namen und die Stufenknöpfe. Die Beschreibung
  liest langes Drücken vor (wie heute) und zeigt ein Tipp auf ⓘ; Lernziel-Kürzel und Sperrmarken sieht nur die
  Aufsicht. Zufallskarten tragen nur einen kurzen Titel („🎲 Überrasch mich“).“
- **b:** „Wie a, aber ab der 4. Klasse bleibt die Beschreibung auf der Karte, gekürzt auf eine Zeile.“

*Warum die Empfehlung:* Mit dem Kartenbild trägt das Bild, was heute die Beschreibung trägt; eine Zeile Text pro Karte
macht aus 169 Karten wieder eine Textwand. a gilt für alle Klassen gleich, Vorlesen bleibt für die, die nicht lesen.
Für b spricht, dass Ältere am Text ein Spiel schneller finden — dafür ist die Suche da (SU1 a). Kippen würde die
Empfehlung, wenn Kinder ab der 4. Klasse im Versuch Spiele am Bild allein nicht wiederfinden.

### GS3 — Welche Schrift? → **a** (Patrik, 11.11.2026; gebaut: `eulenpfad/schriften/Nunito.woff2` 43,7 KB mit Latin Extended-A für Vornamen, `@font-face` in `start/start.css`, `tools/schrift_zuschneiden.py`, Prüfung „schrift“ in den kurzen Tests)

**Ort:** `spiele/gemeinsam/stil.css` `--schrift`; nach GS0 a gilt sie zuerst auf der Startseite (`start/start.css`).
**Heute:** `"Nunito", "Segoe UI Rounded", "Arial Rounded MT Bold", "Segoe UI", system-ui, sans-serif` — Nunito liegt
nicht im Repo; jedes Gerät zeigt seine eigene Schrift (unter Windows Segoe UI).
**Problem:** Eine rundere Schrift gibt es nur als Datei im App-Ordner (LERN-1). Sie muss die Zahlen der Spiele tragen
(gleich breite Ziffern, U+202F), die Zeichen der Apps haben und ihre Lizenz muss das Zuschneiden erlauben.

**Gemessen (LERN_Session32):** Dateien aus `google/fonts` (`ofl/nunito`, `ofl/andika`, `ofl/fredoka`), zugeschnitten mit
fontTools auf die 207 Zeichen, die Eulenpfad, Lernsteig und Portal ohne Emoji zeigen, als woff2; Probebilder in der
Stärke der Karten (Namen 800–900).

| | Nunito (variabel) | Andika Regular + Bold | Fredoka (variabel) |
|---|---|---|---|
| woff2 zugeschnitten | **33 KB** (alle Stärken) | 57 KB (zwei Dateien) | 54 KB |
| Stärken | 200–1000 | nur 400 und 700 — 800/900 der Karten zeigt der Browser als 700 | 300–700 |
| Ziffern gleich breit | ja (600) | ja | **nein** (396–608): Stellentafeln und Rechnungen springen |
| fehlende wichtige Zeichen | U+202F (Browser nimmt es aus der nächsten Schrift) | keine | **≈**, U+2009, U+202F, ≤ ≥ ≠, Pfeile |
| a, g | zweistöckig (die Stilsets ss01/ss02 ändern das nicht) | **einstöckig wie die Basisschrift** | einstöckig |
| I, l, 1 | l mit kleinem Bogen unten, unterscheidbar | I mit Querstrichen, klar | I und l fast gleich |
| Wirkung | rund, freundlich | sachlich, Fibel | sehr rund, verspielt |
| Lizenz | OFL 1.1, kein reservierter Name | OFL 1.1, **reservierter Name „Andika“**: zugeschnitten muss sie anders heissen, sonst ungekürzt 1,35 MB | OFL 1.1, kein reservierter Name |

- **a (Empfehlung):** „Die Startseite nimmt Nunito (variabel, zugeschnitten als woff2 in `eulenpfad/schriften/`, mit
  OFL.txt), `--schrift` bleibt wie heute; Ziffern, Zeichen und Stärken trägt sie, U+202F kommt aus der nächsten Schrift.
  Ein Werkzeug `tools/schrift_zuschneiden.py` schneidet sie aus der Originaldatei auf die Zeichen der App zu.“
- **b:** „Die Startseite nimmt Andika, umbenannt (zugeschnitten, etwa ‚Eulenpfad Fibel‘, wie es die OFL verlangt):
  einstöckiges a und g wie die Basisschrift, klare I/l/1.“
- **c:** „Fredoka für den Titel ‚Eulenpfad‘ und die Kartennamen, sonst Nunito wie a“ (zusammen 87 KB).

*Warum die Empfehlung:* Die Rückmeldung verlangt eine rundere Schrift für Titel und Kartennamen; nach GS2 a stehen auf
der Startseite kaum noch Lesetexte, sondern Namen, Knöpfe und Zahlen. Nunito trägt alle Stärken, die die Karten nutzen,
hat gleich breite Ziffern, fast alle Zeichen und ist mit 33 KB die kleinste. Für b spricht die Basisschrift: einstöckiges a
und g kennen die Kinder aus der Schule, das wiegt für Lesetext viel — auf der Startseite gibt es davon nach GS2 a kaum
etwas, und Andika fehlt 800/900, sie wirkt sachlich statt rund und muss umbenannt werden. c gibt dem Titel mehr Spiel,
aber Fredoka kann keine Zahlen (Ziffern ungleich breit, ≈ fehlt) und gehört damit nie in eine Zeile mit Zahlen. Kippen
würde die Empfehlung, wenn die Schrift später auch in die Spiele soll (Lesetexte der Deutsch-Spiele): dann b für den
Lesetext, Nunito für Titel und Knöpfe.

## Statistik und Erfolge für Kinder (Wunsch Patrik, LERN_Session32; Vorlage LERN_Session33)

**Wunsch:** Erfolge und Statistik im Stil „hand“ vollständig, die Statistik kindgerechter — die Aufsicht sieht weiter
alles ausführlich (Beispiel Patrik: „In den letzten 4 Aufgaben nur 25 % …“). Gilt weiter: ST1 a (welche Karten das Kind
sieht), ST2 a (Podestplätze in Erfolge), G3 (Fazit nur nach Freigabe), Gestaltungsregeln (2. Klasse fast ohne Lesetext;
Fehler sind nicht schlimm), GS2 a (Kürzel der Lernziele nur für die Aufsicht).

**Befund** (Browser, Testkind 3. Klasse mit acht Runden, LERN_Session33):
- „🦉 Das übe ich als Nächstes“ zeigt dem Kind die Texte der Aufsicht: „🔁 Wiederholen: Uhr-Werkstatt · Stufe 4 — In den
  letzten 6 Aufgaben nur 33 % auf Anhieb richtig, 2 Aufgaben nicht gelöst. Lieber 2–3 kurze Runden an verschiedenen
  Tagen als viele am Stück.“ (33 Wörter, zwei Zahlen); „Fokus“ und „Auffrischen“ nennen das Lernziel mit Kürzel
  („⭐ Fokus: 4.2-G1 …“), „Lieber oft und kurz“ einen Rat an Erwachsene ohne Knopf.
- „🔁 Meine Runden“: 15 Textzeilen „08.11. 08:45 · Kiosk-Kasse · Stufe 🌳 3 · ★★ · 1 Fehler“, aufgeklappt die Aufgaben mit
  Zahl der Fehlversuche.
- „📅 Meine Woche“: die Wochenkarte („📅 Deine Woche“) steckt als Karte in der Karte, darunter die Wochenreihe „2.11. 2 ·
  9.11. 4“ (Datum und Zahl der Tage), für ein Kind nicht lesbar. Im Tab Erfolge steht dieselbe Wochenkarte oben.
- Erfolge: Abzeichen mit glatten Rahmen, sonst im Stil. Stil-Retuschen ohne eigene Frage: Abzeichen, Wochenkarte und
  Personen-Dropdown bekommen die Rahmen und Ecken des Stils „hand“.

### KS1 — Was sagen die Vorschläge dem Kind? → **a** (Patrik, 12.11.2026)

**Ort:** `spiele/gemeinsam/auswertung.js` `vorschlaege()` (Felder `titel`, `text`), `start/statistik.js` Karte „Das übe
ich als Nächstes“.
**Heute:** Das Kind liest denselben Titel und Text wie die Aufsicht (Beispiel oben).
**Problem:** Prozente, Fehlerzahlen und Ratschläge an Erwachsene sind für ein Kind der 2. Klasse nicht lesbar und klingen
nach Bewertung — gegen „Fehler sind nicht schlimm“.

- **a (Empfehlung):** „Jeder Vorschlag trägt neben `titel` und `text` (für die Aufsicht, unverändert) ein Feld `kind`:
  ein kurzer Satz ohne Zahlen und ohne Kürzel, je Art fest — wiederholen ‚Das war knifflig. Nochmal?‘, weiter ‚Super!
  Die nächste Stufe wartet.‘, auffrischen ‚Schon eine Weile her. Kurz auffrischen?‘, fokus ‚Das übst du gerade.‘, timer
  ‚Das kannst du! Mit Uhr probieren?‘. Das Kind sieht je Vorschlag eine Karte wie im Tab Spiele: Kartenbild des Spiels,
  Name, Stufe als Level (Zahl und Symbol), den Satz und den Knopf ‚▶ Los‘; langes Drücken liest den Satz vor. Vorschläge
  ohne Knopf (Regelmässigkeit, Konzentration) sieht nur die Aufsicht. Höchstens drei Karten.“
- **b:** „Die Karte bleibt, wie sie ist; nur der Text wird für Kinder kürzer und ohne Prozent (‚Nochmal üben: 2 Aufgaben
  waren knifflig‘).“

*Warum die Empfehlung:* Die Aussage gehört zur Auswertung (eine Quelle, `vorschlaege()`), die Fassung zur Leserin oder zum
Leser — wie beim Fazit (`fazitFuerKind`). Das Kind erkennt das Spiel am Bild, nicht am Namen, und kann direkt starten; der
Satz bleibt lesbar auch für die 2. Klasse und lässt sich vorlesen. b behält Zahlen, die ein Kind nicht deuten kann, und
den Aufbau einer Liste für Erwachsene. Kippen würde die Empfehlung, wenn Kinder ab der 5. Klasse die Zahlen sehen wollen
(dann `kind` je Klasse: mit Zahl ab der 5. Klasse).

### KS2 — Wie zeigt „Meine Runden“ die Runden? → **a** (Patrik, 12.11.2026)

**Ort:** `start/statistik.js` `rundenKarte()`.
**Heute:** Textzeile je Runde mit Datum, Uhrzeit, Spiel, Stufe, Sternen und Zahl der Fehler; aufgeklappt jede Aufgabe mit
Fehler, Zahl der Fehlversuche und Ausgang („dann gelöst“, „Lösung gezeigt“).
**Problem:** Viel Text, Uhrzeiten und Fehlerzahlen; die Runden lassen sich nicht wiederholen.

- **a (Empfehlung):** „Kacheln wie im Tab Spiele, klein: Kartenbild, Name, Stufe als Level, Sterne gross (bei Endlos ♾ mit
  der Zahl in Folge). Gruppiert nach ‚Heute‘, ‚Gestern‘, ‚Diese Woche‘, ‚Früher‘, ohne Uhrzeit und ohne Fehlerzahl.
  Antippen öffnet ‚Diese Aufgaben waren knifflig‘ mit jeder Aufgabe und ihrer Lösung (ohne Zahl der Fehlversuche) und den
  Knopf ‚▶ Nochmal‘. Die Aufsicht sieht weiter die Textzeilen mit allen Angaben.“
- **b:** „Textzeilen bleiben, ohne Uhrzeit und Fehlerzahl; aufgeklappt wie heute.“

*Warum die Empfehlung:* Was ein Kind an einer Runde ablesen kann, sind Spiel, Stufe und Sterne — das zeigt a als Bild. Die
kniffligen Aufgaben mit ihrer Lösung bleiben da (ST1 a: falsch gelöste Aufgaben aufklappbar), nur ohne Zählen der
Fehlversuche; und das Kind kann die Runde gleich nochmal spielen. b kürzt den Text, bleibt aber eine Liste zum Lesen.
Kippen würde die Empfehlung, wenn die Kacheln auf dem Handy (375 px) zu viel Platz brauchen — dann zwei Spalten, am Gerät
ansehen.

### KS3 — „Meine Woche“ ohne Doppelkarte und ohne Datumsreihe? → **a** (Patrik, 12.11.2026)

**Ort:** `start/statistik.js` `lernplanKarte()`, `start/erfolge.js` `wochenKarte()`.
**Heute:** Karte „📅 Meine Woche“ um die Karte „📅 Deine Woche“ (sieben Tage), darunter die Reihe der letzten zwölf Wochen
mit Datum und Zahl der Tage. Im Tab Erfolge steht die Wochenkarte oben, ebenfalls in einer Karte.
**Problem:** Zwei Titel für dasselbe, eine Zahlenreihe, die ein Kind nicht lesen kann.

- **a (Empfehlung):** „Für das Kind eine Karte ‚📅 Meine Woche‘: die sieben Tage wie heute, darunter die Wochensterne als
  Reihe 🌟🌟☆ (erfüllte Wochen der Serie, ohne Datum), ohne Wochenziel nur die Tage. Im Tab Erfolge dieselbe Karte, nicht
  in einer zweiten. Die Reihe mit Datum und Zahl sieht nur die Aufsicht.“
- **b:** „Nur die Doppelkarte auflösen; die Wochenreihe bleibt für alle.“

*Warum die Empfehlung:* Die sieben Tage und der Wochenstern sind, was das Kind selbst steuert und gewinnt (L1 a); eine
Sternreihe sagt „schon zwei Wochen geschafft“ ohne Zahl. Die Datumsreihe ist eine Auswertung für Erwachsene. b behebt nur
das Doppelte. Kippen würde die Empfehlung, wenn Kinder ihre Wochen zurückverfolgen wollen (dann die Sternreihe mit
Antippen für die Woche).

### KS4 — Darf die Aufsicht die Empfehlungen ans Kind übersteuern? (Frage Patrik, LERN_Session33)

**Ort:** `start/statistik.js` (Karte „Das empfehle ich für …“ der Aufsicht, Karte „Das übe ich als Nächstes“ des
Kindes), `spiele/gemeinsam/auswertung.js` `vorschlaege()` (Rangfolge `prio`), Profil des Kindes.
**Heute:** Das Programm ordnet die Vorschläge fest (wiederholen vor Fokus, Konzentration, weiter, auffrischen,
Regelmässigkeit, Timer); das Kind sieht die ersten drei mit Satz (KS1 a), die Aufsicht bis zu acht mit Begründung in
Zahlen. Die Aufsicht lenkt nur indirekt über die Fokus-Lernziele im Profil. Frühere Entscheide: VR1 a (Vorgabe der
Aufsicht, „fest“), VR2 a (die Ebene Klasse kommt mit den Gruppen, LERN-48; Persönliches bestimmt die Familie, die Klasse
schlägt vor), Gruppen-Konzept 3 (Fokus „⭐ von deiner Lehrperson“ neben „⭐ für dich“).
**Problem:** Eine Lehrperson oder ein Elternteil weiss manchmal, was gerade dran ist (Prüfung, Thema in der Schule) oder
dass eine Empfehlung nicht passt; heute kann sie das dem Kind nicht sagen, ohne die Fokus-Lernziele umzubauen.

- **a (Empfehlung):** „Jetzt, als Vorgabe der Aufsicht am Gerät (Ebene VR1): In ihrer Karte steht bei jedem Vorschlag
  ‚📌 Fürs Kind oben‘ und ‚🚫 Fürs Kind ausblenden‘, dazu ‚➕ Eigene Empfehlung‘ (Spiel und Stufe wählen). Angeheftete und
  eigene Empfehlungen stehen beim Kind zuerst, mit dem Satz ‚⭐ Von <Name der Aufsicht>‘; danach füllt das Programm bis
  drei auf. Ausgeblendete sieht das Kind nicht, die Aufsicht weiter grau mit ‚ausgeblendet‘ und dem Grund des Programms;
  jede Vorgabe lässt sich zurücknehmen. Das Programm erklärt die Rangfolge hinter ⓘ (warum wiederholen vor weiter
  usw.) und bei jedem Vorschlag seinen Grund in Zahlen (wie heute). Gespeichert im Profil des Kindes
  (`empfehlungen: { oben: [{ spiel, stufe, von, zeit }], aus: [{ art, spiel, stufe, von, zeit }] }`), mit Sicherung und
  Abgleich unterwegs. Mit den Gruppen schlägt die Klasse auf dieselbe Weise vor (Struktur gleich, Vorrang nach VR2).“
- **b:** „Erst mit dem Klassenmanager (LERN-48): dann für Klasse und Familie zugleich, mit Vorrang nach VR2.“
- **c:** „Kein direktes Übersteuern; die Aufsicht lenkt weiter über die Fokus-Lernziele, deren Vorschläge höher
  gewichtet werden.“

*Warum die Empfehlung:* Das Vetorecht ist ein Recht der Erwachsenen, die das Kind begleiten — Eltern wie Lehrperson —,
nicht erst der Klasse; die Aufsicht am Gerät gibt es heute, und VR1 a hat für Vorgaben schon die Ebene „Aufsicht“
geschaffen. Mit derselben Struktur kann die Klasse später vorschlagen, ohne dass etwas umgebaut wird; die Erklärung
bleibt beim Programm, die Entscheidung bei der Aufsicht. b verschiebt einen Nutzen, den Familien schon jetzt hätten,
hinter ein grosses Paket; wofür b spricht: erst dort ist geklärt, wer gewinnt, wenn Lehrperson und Eltern verschieden
übersteuern — das wiegt heute weniger, weil an einem Gerät eine Aufsicht nach der anderen entscheidet und die letzte
Vorgabe sichtbar mit Namen steht. c lässt die Aufsicht nur über einen Umweg wirken und kann eine unpassende Empfehlung
nicht wegnehmen. Kippen würde die Empfehlung zu b, wenn eine Lehrperson die Empfehlungen in der Schule an einem
fremden Gerät (Schul-iPad) setzt und die Familie sie zu Hause nicht überschreiben dürfen soll — das ist eine Frage des
Vorrangs zwischen Gruppen und gehört zu LERN-48.

## Reihenfolge nach den Entscheiden (Vorschlag)

1. GS1: Feier-Angaben in den Katalog, Kartenbild auf der Startseite, Ladezeit messen.
2. GS2: Text der Kinderkarte.
3. GS3: Schrift messen, entscheiden, als Datei im App-Ordner.
4. Druckknöpfe auf der Startseite (`.chip`, `.tab`, Stufenknöpfe) wie `.knopf` im Rahmen — Retusche, ohne eigene Frage
   (gebaut LERN_Session32: Rand unten 4–6 px, beim Drücken sinkt der Knopf ein; `start/start.css`).
5. Versuch mit Kindern und der Lehrperson, die die Rückmeldung gab.
