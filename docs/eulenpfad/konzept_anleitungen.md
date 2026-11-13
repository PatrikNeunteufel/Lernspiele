# Konzept: Aufbau der Anleitungen (Bild, Nummern, Text, Layout)

Stand: LERN_Session37 (2026-11-13). **Entschieden (Patrik): AL1 a bis AL7 a.** AL7 kam aus der Rückfrage Patrik zu AL3 (Kinder
spielen auch im Browser und auf dem Tablet) und ersetzt dort „Kinder weiter auf dem Handy“: Jedes Bild gibt es breit und
schmal. Die Liste der Rahmen (AL4) liegt in `docs/eulenpfad/anleitung_rahmen.json` statt im Bildordner, weil
`eulenpfad/` nur enthält, was online geht (P1 a). Anlass: Rückmeldung Patrik am Ende von
LERN_Session36 (Report, Abschnitt „Rückmeldung Patrik zu den Anleitungen“). Betrifft `eulenpfad/anleitung/kinder.html`,
`aufsicht.html`, `anleitung.css` und `tools/anleitung_bilder.js`. Frühere Entscheide zum Aufbau gibt es keine (gesucht in
`docs/konzept_*`, `docs/eulenpfad/konzept_*`, `rahmen.md`, Reports und CHANGELOG; nur AN-B a „nachführen“).

## 1. Befund (gezählt am 13.11.2026)

Rahmen je Bild aus `tools/anleitung_bilder.js`, rote Nummern (`.nr`) im Text zum Bild, Bildgrössen gemessen.

| Befund | Bilder |
|---|---|
| Rahmen mit Nummer, im Text keine Nummer | k01 (1), k04 (2), k05 (1), k09 (1), k13 (2); in a03 (1) beschreibt der Text die Nummer nicht |
| Nummern in der Bildunterschrift „(1) … (4)“ statt im Text | a19, a20 |
| Zwei Nummern für eine Beschreibung („②③ Weiterrechnen“) | a20 |
| Nummer gegen die Lesereihenfolge | a01 (2 links, 1 rechts); weitere nicht gemessen, das Werkzeug nummeriert nach der Liste im Skript |
| Doppelte Zählung: nummerierte Liste `<ol>` und rote Nummer | 11 Listen `<ol>` in `aufsicht.html` (dazu `<ul>` mit roten Nummern, etwa a02, a14) |
| Rote Nummer frei im Absatz, nicht in einer Liste | k02, k03, k11, k14, k12; a04, a05 (1), a09 (1), a13 |
| Text mal vor, mal nach dem Bild | Kinder: Abschnitte 1, 3, 9 Text vor dem Bild, 2, 5, 6 danach; Aufsicht: a01, a14 Text davor |
| Bilder mit Nummern, deren Beschreibung erst nach dem Bild steht und dazwischen anderes | k12 (Nummern vor dem Bild), a20 (Bildunterschrift und Liste) |

**Massstab** (Breite der Anleitung `main` 860 px, Karte innen 816 px):

| Bildart | Aufnahme | gezeigt | Schrift der App (18 px) im Bild |
|---|---|---|---|
| Aufsicht, ganze Seite | 1200 CSS-px breit | 816 px (68 %) | rund 12 px |
| Aufsicht, Anmeldung | 752 breit | 752 (100 %) | 18 px |
| Kinder, Handy | 390 CSS-px (Faktor 2: 780 Bildpunkte) | 340 px (87 %) | rund 16 px |

Kinderbilder sind bis 1400 CSS-px hoch (k02, k03, k07: 2800 Bildpunkte) und stehen gezeigt bis rund 1220 px hoch — auf
dem Desktop eine schmale Säule von 340 px in einer Karte von 816 px. Das ist der Eindruck „schmal wie ein Handy“. Dazu ist
der Kindertext zentriert.

## 2. Regeln (gelten unabhängig von den Entscheiden)

1. **Jede Nummer im Bild ist genau einmal beschrieben**, und jede Beschreibung gehört zu genau einer Nummer. Zwei Stellen
   für eine Beschreibung bekommen einen gemeinsamen Rahmen oder zwei Beschreibungen.
2. **Ein Bild ohne Beschreibung je Stelle hat keine Rahmen.** Ein Rahmen nur zum Zeigen („hier“) ist ein Bild mit
   einem Rahmen und einem Satz, der mit der Nummer beginnt.
3. **Nummern im Bild stehen in Lesereihenfolge** (Zeilen von oben nach unten, in der Zeile von links nach rechts).
4. **Abschnittsnummern** („3. Wähle eine Stufe“) bleiben als Teil der Überschrift. Sie sehen nie wie die roten Nummern aus
   und verweisen nur mit „Abschnitt 8“.
5. **Der Bildblock** ist die Einheit: Bild und seine Legende (die Beschreibungen der Nummern) stehen zusammen. Text ohne
   Nummer, der zum Bild hinführt, steht davor, Ergänzungen danach — nie zwischen Bild und Legende.
6. **Eine Bildunterschrift** sagt nur, was das Bild zeigt („Statistik mit erfundenen Beispielrunden“), ohne Nummern.

## 3. Entscheidungsfragen

### AL1 — Eine Nummernart
- **Ort:** `aufsicht.html` (11 `<ol>`, dazu `<ul>`), `kinder.html` (Absätze), Bildunterschriften a19, a20.
- **Heute:** `<ol><li><span class="nr">1</span>…` (Liste und Nummer), `<p><span class="nr">1</span>…<br><span class="nr">2</span>…`
  (frei), „(1) das Bild …, (2) Klasse …“ (Bildunterschrift).
- **Problem:** drei Schreibweisen; die Liste zählt doppelt (1. und ①); die Nummer ist von Hand getippt und kann von der im Bild
  abweichen.
- **a (Empfehlung):** Eine Legende `<ol class="legende">` direkt beim Bild. Ihr Zähler **ist** die rote Nummer (CSS-Zähler
  statt `<span class="nr">`, kein zweiter Zähler); jeder Punkt trägt mit `data-ziel` den Schlüssel seines Rahmens. Keine
  Nummern in Bildunterschrift oder Fliesstext.
- **b:** Rote Nummern von Hand (`<span class="nr">`) wie heute, aber immer in einer Liste ohne eigene Zählung
  (`list-style: none`); Bildunterschriften ohne Nummern.

*Warum die Empfehlung:* Bei a kann die Nummer im Text nicht falsch sein, weil sie die Stelle in der Legende ist. Das Bild
und die Legende werden über den Schlüssel verbunden und lassen sich prüfen (AL5). Zudem bleibt die Liste eine echte Liste
für Vorleseprogramme. Für b spricht, dass sie näher am heutigen HTML bleibt. Dafür bleibt die getippte Nummer eine zweite
Quelle, und genau sie ist in a20 („②③“) und a01 auseinandergelaufen. Die Empfehlung kippt nur, wenn eine Legende Nummern
überspringen müsste — das schliesst Regel 1 aus.

### AL2 — Bildblock auf allen Geräten
- **Ort:** `anleitung.css` (`figure`, `figure.handy`), beide Seiten.
- **Heute:** Bild und Text untereinander, Reihenfolge je Abschnitt verschieden; Handy-Bilder 340 px breit, mittig.
- **Problem:** Auf dem Desktop steht ein Kinderbild bis 1220 px hoch als schmale Säule, die Legende erst darunter — weit weg
  von Nummer 1. Text steht mal davor, mal danach.
- **a (Empfehlung):** Bildblock als Raster. **Hochformat** (Bild höher als breit): ab 720 px Seitenbreite Bild links
  (höchstens 340 px), Legende rechts daneben, oben bündig; schmaler untereinander, Legende unter dem Bild. **Querformat:**
  immer Bild über die ganze Breite, Legende darunter. Führender Text immer vor dem Block (Regel 5).
- **b:** Immer untereinander auf allen Geräten: Bild, darunter die Legende.

*Warum die Empfehlung:* Bei a stehen auf Desktop und Tablet die Nummern eines Handybilds neben ihrer Beschreibung, und die
Karte ist ausgefüllt statt einer Säule mit leeren Rändern. Auf dem Handy ist a gleich wie b. Für b spricht, dass es nur ein
Muster gibt. Bei hohen Bildern wandert die Legende aber 1000 px unter die Nummern, und das bleibt mit b auf dem Desktop
so. Die Empfehlung kippt, wenn AL3 alle Bilder so niedrig schneidet, dass auch ein Hochformat in eine Bildschirmhöhe passt
(unter rund 600 px gezeigt). Dann reicht b.

### AL3 — Massstab und Ausschnitt der Bilder
- **Ort:** `tools/anleitung_bilder.js` (`groesse`, `bild`, `maxHoehe`).
- **Heute:** Aufsicht bei 1200 px Breite, gezeigt in 816 px (68 %, Schrift rund 12 px); Kinder ganze Seite bis 1400 CSS-px
  hoch; k01 zeigt die ganze Seite für einen Knopf.
- **Problem:** Verkleinerte Schrift ist schwer lesbar; ganze Seiten zeigen viel, das der Text nicht erklärt (k02: Abzeichen-Hinweis
  oben).
- **a (Empfehlung):** Je Bild nur der Ausschnitt um seine Rahmen mit einem Rand (das Werkzeug rechnet ihn aus den Rahmen,
  höchstens 900 CSS-px hoch). Die Aufsicht wird mit 816 px Fensterbreite aufgenommen, also 1 : 1 gezeigt — so sieht die
  Seite auf einem Tablet quer aus. Kinder weiter auf dem Handy (390 px).
- **b:** Ganze Seiten wie heute, Aufsicht weiter 1200 breit und verkleinert.

*Warum die Empfehlung:* Bei a ist die Schrift im Bild so gross wie in der App (18 px statt rund 12), und jedes Bild zeigt
nur, was die Legende beschreibt. Für b spricht, dass man auf einer ganzen Seite sieht, wo etwas liegt. Dafür reichen bei a
die Bilder mit ganzer Seite, die es weiter geben darf (a04 Bereiche, k02 Tab Spiele), und ihre Rahmen zeigen den Ort. Bei
816 px brechen die Tabs um (seit LERN_Session36 passen sie erst ab rund 1100 px in eine Zeile). Das ist die Ansicht eines
Tablets und richtig so; nur a04 zeigt die Tabs und kann weiter 1200 breit aufgenommen werden. Die Empfehlung kippt, wenn
Patrik die Desktopansicht der Aufsicht zeigen will. Dann müsste die Anleitung auf rund 1240 px Breite wachsen, damit das
Bild 1 : 1 bleibt.

### AL4 — Wer bestimmt die Reihenfolge der Nummern
- **Ort:** `tools/anleitung_bilder.js` (`rahmen(ziele)`), Legenden in beiden Seiten.
- **Heute:** Die Nummer ist die Stelle in der Liste `ziele` im Skript, von Hand geordnet; a01 steht gegen die Lesereihenfolge.
- **Problem:** Lesereihenfolge hängt von der Lage auf der Seite ab, die sich mit der App ändert, nicht vom Skript.
- **a (Empfehlung):** Jedes Ziel hat einen Schlüssel (`{ id: "kind", css: … }`). Das Werkzeug nummeriert nach der Lage
  (Regel 3: gleiche Zeile, wenn sich die Rahmen in der Höhe zur Hälfte überdecken) und schreibt je Bild die Schlüssel in
  dieser Reihenfolge nach `eulenpfad/anleitung/bilder/rahmen.json`. Die Legende muss dieselbe Reihenfolge haben (AL5).
- **b:** Reihenfolge von Hand im Skript wie heute; der Prüfer (AL5) meldet, wenn die Lage nicht der Liste folgt.

*Warum die Empfehlung:* Bei a stimmt die Lesereihenfolge von selbst, auch wenn die App umgebaut wird. Bei einer Änderung
meldet der Prüfer nur, dass die Legende umzustellen ist. Für b spricht, dass im Skript sichtbar bleibt, welche Nummer was
ist. Diese Angabe stünde bei a in `rahmen.json`, und dort ist sie gemessen statt behauptet. Die Empfehlung kippt, wenn
eine Anleitung bewusst gegen die Lage erzählen muss (Ablauf: erst unten, dann oben). Das kommt heute in keinem Bild vor;
dafür wäre ein Bild je Schritt sauberer.

### AL5 — Prüfer Nummern ↔ Rahmen
- **Ort:** neu in `tools/pruefe_skripte.js` (kurz, ohne Browser) oder im Werkzeuglauf.
- **Heute:** nichts. Das Auseinanderlaufen fiel zweimal erst beim Lesen auf (LERN_Session35 Werkzeug, LERN_Session36 Texte;
  Prüfer-Kandidat im Report).
- **a (Empfehlung):** `pruefe_skripte.js` liest beide Seiten und `rahmen.json` und meldet als Fehler: Bild ohne Eintrag in
  `rahmen.json`; Zahl der Legendenpunkte ≠ Zahl der Rahmen; Schlüssel oder Reihenfolge verschieden; Legende ohne Bild oder
  Bild mit Rahmen ohne Legende; eine `.nr` oder „(1)“ ausserhalb einer Legende; ein Bild, das neuer ist als
  `rahmen.json` (Aufnahme ohne nachgeführte Liste). Das Werkzeug selbst bricht ab, wenn ein Ziel fehlt (wie heute).
- **b:** Nur das Werkzeug prüft beim Aufnehmen.

*Warum die Empfehlung:* Texte werden öfter geändert als Bilder aufgenommen. Bei a meldet jeder kurze Testlauf eine Legende,
die nicht mehr zum Bild passt, in unter einer Sekunde und ohne Server. Bei b fällt es nur auf, wenn jemand die Bilder neu
aufnimmt — so war es bisher. Für b spricht, dass kein Prüfer ein weiteres Dateiformat kennen muss. `rahmen.json` ist
aber ohnehin die Quelle für AL4. Die Empfehlung kippt nicht an AL4: Auch mit b dort schreibt das Werkzeug die Schlüssel
in `rahmen.json`, und der Prüfer prüft statt der Lage nur die Reihenfolge der Liste.

### AL6 — Ein Stil für beide Anleitungen
- **Ort:** `anleitung.css` (`body.kinder …`), `kinder.html`.
- **Heute:** gleiche Breite (`main` 860 px), Kinder mit grösserer Schrift, **zentriertem Text** und Handy-Bildern in der Mitte;
  Aufsicht linksbündig mit Inhaltsverzeichnis.
- **Problem:** Zwei Seiten, die verschieden aufgebaut wirken; zentrierter Text verträgt keine Legende neben dem Bild.
- **a (Empfehlung):** Ein Aufbau für beide: Karten je Abschnitt, Überschrift mit Abschnittsnummer, führender Text,
  Bildblock (AL2), Ergänzungen, Tipp-Kasten — alles linksbündig. Die Kinderseite unterscheidet sich nur durch grössere
  Schrift (22 px), das grosse Bildzeichen über der Überschrift und kürzere Sätze. Inhaltsverzeichnis auf beiden Seiten.
- **b:** Gleicher Bildblock, die Kinderseite bleibt zentriert; nur die Legende linksbündig.

*Warum die Empfehlung:* Ein Aufbau heisst, dass Regeln, CSS und Prüfer nur eine Gestalt kennen. Eine Lehrperson, die
beide Seiten zeigt, findet in beiden alles am selben Ort. Für b spricht, dass zentrierter Text für Kinder freundlicher
wirken kann. Neben einer linksbündigen Legende bilden aber zwei Satzachsen in einer Karte den unruhigen Eindruck, den
die Rückmeldung bemängelt. Die Empfehlung kippt, wenn Patrik die Kinderseite als Bilderbuch ohne Legenden will (nur Bild
und ein Satz). Dann trüge sie keine Nummern, und Zentrieren wäre stimmig.

### AL7 — Welches Gerät die Bilder zeigen
- **Ort:** `tools/anleitung_bilder.js` (`groesse`), `<figure>` in beiden Seiten, `rahmen.json`, Prüfer (AL5).
- **Heute:** Kinderbilder nur vom Handy (390 px), Aufsicht nur breit (nach AL3 a 816 px).
- **Problem (Rückfrage Patrik):** Ein Kind am Tablet oder Computer sieht die App im breiten Aufbau, die Bilder zeigen aber
  den schmalen; Fach-Reiter, Filter, Karten und Stufen stehen dort anders. Umgekehrt zeigt ein breites Bild auf dem Handy
  in rund 300 px statt 816: 37 %, die Schrift der App (18 px) im Bild rund 7 px — unlesbar, bei beiden Anleitungen.
- **a (Empfehlung):** Zwei Fassungen je Bild, beide Anleitungen: **breit** mit 816 px Fensterbreite (Aufbau über 560 px
  wie auf dem Tablet hoch; Tablet quer und Computer ändern ab 900 px quer und ab 1100 px nur Einzelnes, etwa die Lage des
  Notizblocks und die Tabs in einer Zeile) und **schmal** mit 390 px (Handy, Faktor 2). Die Seite
  wählt mit `<picture>` die Fassung nach der eigenen Breite (bis 600 px schmal). Eine Legende für beide: dieselben
  Schlüssel, und die Lesereihenfolge muss in beiden gleich sein; sonst meldet der Prüfer einen Fehler, und die Ziele
  werden so gewählt, dass sie es ist (etwa ein gemeinsamer Rahmen). Ein Bild, das es nur in einem Aufbau gibt, steht in
  der Liste der Rahmen mit einer Fassung und wird auf jedem Gerät gezeigt (heute keins: auch die Tabs gibt es auf dem Handy).
- **b:** Nur breit (816 px) für beide Anleitungen.
- **c:** Kinder nur schmal wie heute, Aufsicht nur breit.

*Warum die Empfehlung:* Nur bei a sieht jedes Kind und jede Aufsicht die App so, wie sie auf dem eigenen Gerät aussieht,
und lesbar: breit 1 : 1 (18 px), schmal 300 von 390 px (77 %, rund 14 px). b ist auf dem Handy unlesbar (rund 7 px),
c zeigt am Tablet einen fremden Aufbau — genau die Verwirrung aus der Rückfrage. Gegen a spricht die doppelte Zahl
der Bilder (rund 70 statt 36) und ein längerer Lauf des Werkzeugs; das kostet nur Rechenzeit, Werkzeug und Prüfer machen
beide Fassungen gleich. Ein echtes Risiko ist eine Legende, die in einem Aufbau nicht passt: Der Prüfer meldet sie, sie
geht nicht still durch. Die Empfehlung kippt, wenn mehr als eine Handvoll Bilder in den beiden Aufbauten keine gemeinsame
Lesereihenfolge zulassen — dann bräuchte jede Fassung eine eigene Legende, und das widerspricht dem gleichen Text für alle.
Zu prüfen beim Bau: ob ein Bild im Aufbau ab 900 px quer wesentlich anders aussieht (Notizblock a20/k14); dann bekommt
nur dieses Bild eine dritte Fassung „quer“ (1200 px, `<source media>` ab 900 px quer), nicht alle.

## 4. Umsetzung — erledigt 2026-11-13 (LERN_Session37)

Folge von AL7 für AL2: Die breite Fassung ist 816 px breit, also so breit wie die Karte; neben einer Legende stünde sie nur
verkleinert. „Nebeneinander“ gilt darum nur für ein Bild höchstens halb so breit wie die Karte (class `hoch`, geprüft in
`tools/pruefe_skripte.js` Punkt 9); heute hat keins diese Breite, alle Bilder stehen über ihrer Legende. Die schmale
Fassung zeigt die Seite nur bis 600 px, wo ohnehin alles untereinander steht.

Offen: a08 (Aussehen) und a19 (Profil) sind schmal über 1300 px hoch — ein Block der App, der auf dem Handy so lang ist.

1. `anleitung.css`: Bildblock, Legende mit Zähler, beide Seiten im gleichen Aufbau; dunkel und hell.
2. `tools/anleitung_bilder.js`: Ziele mit Schlüssel, Nummer nach Lage, Ausschnitt um die Rahmen, Breite nach AL3,
   `rahmen.json`.
3. `kinder.html`, `aufsicht.html`: jeder Abschnitt nach Regel 5; Legenden statt `.nr`; Bilder ohne Beschreibung ohne Rahmen.
4. Prüfer nach AL5 in `tools/pruefe_skripte.js`, dazu ein Fall, der eine absichtlich falsche Legende meldet.
5. Alle Bilder neu; beide Seiten hell und dunkel bei 1024, 768 und 375 px ansehen.
