# Konzept: Darkmode für die Reihe (Eulenpfad, Lernsteig, Gratwanderung)

Stand: 12.11.2026 (LERN_Session33) · Grundsatz entschieden (Patrik, 12.11.2026, Antwort „a“ im Chat): Darkmode als
Einstellung im Block Aussehen, im Eulenpfad standardmässig hell, im Lernsteig nach der Einstellung des Geräts; dunkel
werden Rahmen, Karten und Text über Variablen im Kern; die Stellenfarben bleiben gleich; Zeichnungen und
Abschluss-Animationen stehen in beiden Modi auf einer hellen Bildkachel; zuerst dieses Konzept, dann bauen.
**DM0–DM6, DM2-S, DM2-K und G1 entschieden, je a** (Patrik, 12.11.2026); Schritt 3 bis 3c-3 und DM2-K gebaut (Reihenfolge unten). Gebaut: Schritt 1 (Kern 1.40.0,
`kern/farben.css`) und Schritt 2 (Messung `tools/kontrast.js`, Zählung fester Farben `tools/pruefe_skripte.js` Punkt 7);
Zahlen unten unter „Messung hell“. GS0 a im Konzept Gestaltung und im Plan Angleich um den Zusatz aus DM0 a ergänzt.

## Auslöser

Frage Patrik (LERN_Session33): „Macht es Sinn, einen Darkmode zu erstellen?“ Antwort im Chat mit drei Optionen
(a Einstellung mit Bildkachel, b nur Lernsteig, c nur Rahmen); entschieden a.

## Befund heute (gemessen LERN_Session33)

**Kein Darkmode, nirgends:** `prefers-color-scheme` und `color-scheme` kommen in keiner App vor. Der Kern (`kern/`)
enthält keine Farbe und kein CSS; jede App färbt die Kern-Bausteine (Übersicht, Personenmenü, Notizblock, Tastenfeld,
Rechner) mit ihrem eigenen Stil. `tools/kern_verteilen.py` verteilt heute nur `<app>/kern/kern.js`.

**Farben je Datei** (feste Farbe = `#…`, `rgb(…)`, `rgba(…)` ausserhalb einer Variablen-Zeile):

| Datei | Variablen | feste Farben |
|---|---|---|
| `eulenpfad/spiele/gemeinsam/stil.css` | 37 | 114 |
| `eulenpfad/start/start.css` | 8 | 122 |
| `eulenpfad/anleitung/anleitung.css`, `mix/mix.css`, `spiele/gemeinsam/regeln.css` | 1 | 17 |
| `lernsteig/gemeinsam/stil.css` | 8 | 30 |
| `lernsteig/start/start.css` | 0 | 6 |
| `eulenpfad/spiele/gemeinsam/spiel.js`, `start/*.js` | — | 36 |
| `eulenpfad/spiele/gemeinsam/avatare.js` | — | 374 |
| `eulenpfad/spiele/gemeinsam/bilder.js` (Bildersammlung) | — | 817 |
| `eulenpfad/spiele/gemeinsam/feier.js` (Abschluss-Animationen) | — | 1616 |

**Spielseiten** (`eulenpfad/spiele/*/index.html`, 169): 144 tragen eigene Farben im `<style>` (606 Werte), 116 davon
feste Hintergründe (269 Stellen, etwa weisse Felder, Zahlenstrahl, Tafeln); 17 zeichnen im Skript mit festen Farben (159
Werte, etwa Pflanzen-Bestimmer, Wassertropfen-Reise); kein Spiel zeichnet auf `<canvas>`. Meiste Farben:
pflanzen-bestimmer 53, wassertropfen-reise 43, kiosk-kasse 21, teddy-versteck 21.

**Namen der Variablen** sind je App verschieden: Eulenpfad `--karte --text --text-leise --rand --knopf --gut --hinweis
--himmel-oben --himmel-unten`, Lernsteig `--karte --text --leise --flaeche --rand --akzent --gut --hinweis --fokus`.

**Was dunkel kaputtgeht:** Viele Zeichnungen haben dunkle Umrisse (Salamander `#1b1b1f`, Umrisse `#5a4127`, Text in
Animationen) und verschwinden auf dunklem Grund. Eine feste weisse Fläche einer Spielseite mit `color: var(--text)`
würde im Darkmode helle Schrift auf Weiss zeigen.

**Kontrast** (WCAG 2.x; ≥ 4,5 für Text, ≥ 3 für grosse Schrift ab 24 px oder 18,7 px fett und für Bedienelemente).
Hell = heutige Werte auf der Karte `#ffffff`; dunkel = Vorschlag unten auf der Karte `#262a3b`:

| Paar | hell heute | dunkel (Vorschlag) |
|---|---|---|
| Text `--text` | 12,92 | 12,49 |
| leiser Text `--text-leise` | 4,92 | 7,21 |
| Text auf dem Himmel (Hintergrund) | 9,83 | 14,72 |
| Schrift auf dem Knopf `--knopf` | **4,17** | 5,66 |
| Stelle rot `--rot` | **3,91** | 5,14 |
| Stelle blau `--blau` | **3,43** | 5,44 |
| Stelle grün `--gruen` | **2,70** | 5,27 |
| Deko 1 … 7 | 4,55 · 3,52 · 2,76 · **1,92** · 2,49 · 4,47 · 4,76 | 4,53 · 5,37 · 6,25 · 8,70 · 6,86 · 4,59 · 5,55 |

Dunkler Vorschlag (für die Rechnung, nicht entschieden): Himmel `#1a1d2a`, Karte `#262a3b`, Text `#eef0f7`, leise
`#b3b8cc`, Rand `#3d4361`, Knopf `#7584ff` mit Schrift `#10132a`, Stellen rot `#ff6b6f`, blau `#4ea6f0`, grün
`#2fb36b` (unverändert), Deko je um einen Schritt heller. Die Stellenfarben behalten ihren Ton (rot, blau, grün nach
Calcularis), im Dunkeln steigt ihr Kontrast.

**Nebenbefund (hell, heute):** Grün auf Weiss liegt mit 2,70 unter 3 : 1, Blau mit 3,43 und Rot mit 3,91 unter 4,5; die
Schrift auf dem Knopf mit 4,17 ebenfalls. Gelb (Deko 4) mit 1,92 taugt auf Weiss nur als Fläche, nicht als Schrift.
Dunklere Fassungen gleichen Tons auf Weiss: grün `#1f9254` 3,96 · `#157f45` 5,06; blau `#2580cf` 4,14 · `#1f74c0` 4,86;
rot `#d93a40` 4,54. → **DM5**

**Frühere Entscheide, die das Konzept binden:**

| Entscheid | Inhalt | Folge |
|---|---|---|
| GS0 a (Konzept Gestaltung) | Der Eulenpfad bleibt in den Spielen im Aussehen, wie er ist; die Startseite wird überarbeitet | Darkmode in der laufenden Runde braucht einen Zusatz → **DM0** |
| SP1 (Konzept Gestaltung) | Stil „hand“ um die Runde herum (Stufenwahl, Ranglisten, Schlussbild), die Runde glatt | Vorbild für eine Grenze an der Runde → **DM0** |
| Gestaltungsregeln, Farben je Stelle | Einer rot, Zehner blau, Hunderter grün; nur in `stil.css` (`--st-*`), nur für Stellen | Ton bleibt in beiden Modi; Werte je Modus → **DM5** |
| LERN-1, PK1 a | ohne Build-Schritt, nichts von aussen | Farben als Datei im App-Ordner, keine Bibliothek → **DM1** |
| KT1 a, PA1 a (Kern) | Übersicht, Filter, Personenmenü sind Kern-Bausteine beider Apps | gemeinsame Namen tragen beide Apps → **DM1** |
| Einstellungen der Aufsicht je Gerät (Verwaltung → Einstellungen, Block Aussehen mit `stil`) | Aufsicht stellt ein, Kinder nicht | Ort der Einstellung → **DM2** |
| H1 a (rahmen.md 20), `tools/pruefe_skripte.js` Punkt 5 | Untergrenzen werden geprüft, nicht nur beschrieben | Kontrast als Prüfung → **DM4**, **DM5** |

## Entscheidungsfragen

### DM0 — Reicht der Darkmode in die laufende Runde? → **a** (Patrik, 12.11.2026)

**Ort:** `docs/eulenpfad/konzept_gestaltung.md` GS0 a; `docs/plan_angleich_reihe.md`, Grundsätze.
**Heute:** „Der Eulenpfad bleibt in den Spielen im Aussehen, wie er ist (höchstens kleine Retuschen).“
**Problem:** Ein Darkmode, der die Runde hell lässt, lässt die grösste helle Fläche stehen — gerade sie blendet am Abend.
Einer, der in die Runde reicht, ändert das Aussehen der Spiele, das GS0 a festhält.

- **a (Empfehlung):** „Der Eulenpfad bleibt in den Spielen im Aufbau und im hellen Aussehen, wie er ist. Ausgenommen ist
  der dunkle Farbsatz (Entscheid DM0 a, docs/konzept_darkmode.md): Wer ihn wählt, sieht auch die laufende Runde dunkel;
  Aufbau, Formen und Stellenfarben bleiben gleich.“
- **b:** „Der Darkmode gilt wie der Stil „hand“ nur um die Runde herum (Startseite, Stufenwahl, Ranglisten, Schlussbild);
  die laufende Runde bleibt hell.“

*Warum die Empfehlung:* GS0 a schützt die Spielseiten davor, beim Umbau der Startseite mit umgebaut zu werden — gemeint
sind Aufbau und Aussehen, das sich bewährt hat. Ein Farbsatz, den niemand bekommt, der ihn nicht wählt, und der Aufbau,
Formen und Stellenfarben nicht anfasst, ändert daran nichts. Für b spricht die Grenze von SP1, die schon eingeführt ist
und den Prüfaufwand auf den Rahmen beschränkt (keine 116 Spielseiten mit eigenen Hintergründen). Sie wiegt weniger, weil
b den Zweck verfehlt: Nach jeder Stufenwahl springt das Bild auf eine helle Fläche. Kippen würde die Empfehlung, wenn
Patrik GS0 a so liest, dass die Spiele auch in einer gewählten Farbe nicht anders aussehen dürfen — dann b.

### DM1 — Wo stehen die Farben? → **a** (Patrik, 12.11.2026)

**Ort:** neu `kern/farben.css`; `tools/kern_verteilen.py`; `eulenpfad/spiele/gemeinsam/stil.css`,
`lernsteig/gemeinsam/stil.css`.
**Heute:** Der Kern hat keine Farbe; jede App hat ihre Variablen mit eigenen Namen (`--text-leise` gegen `--leise`).
**Problem:** Der Grundsatz sagt „über Variablen im Kern“. Der Kern verteilt bisher nur JavaScript. Eine Farbe, die erst
ein Skript setzt, blitzt beim Laden hell auf.

- **a (Empfehlung):** „Neuer Kern-Teil `kern/farben.css` mit gemeinsamen Namen für die Rahmenfarben (Hintergrund, Karte,
  Text, leiser Text, Rand, Knopf, Knopfschrift, gut, Hinweis, Fokus, Bildgrund) je für hell und dunkel; umgeschaltet mit
  `data-farben="dunkel"` an `<html>`. `kern_verteilen.py` verteilt ihn als `<app>/kern/kern.css` mit Version und
  Prüfsumme wie `kern.js`. Jede App setzt darauf ihre eigenen Töne (Eulenpfad: Himmel, Deko, Stellen; Lernsteig: Akzent);
  die alten Namen bleiben als Verweis (`--text-leise: var(--k-leise)`), bis sie ersetzt sind. Ein kurzes Skript im
  `<head>` jeder Seite liest die Einstellung vor dem ersten Bild.“
- **b:** „Jede App behält ihre Variablen und schreibt ihren dunklen Satz selbst; der Kern liefert nur das Umschalten
  (`data-farben` setzen, Einstellung lesen) in `kern.js`.“

*Warum die Empfehlung:* Die Kern-Bausteine (Übersicht, Personenmenü, Notizblock, Tastenfeld, Rechner) sind in beiden Apps
dieselben; heute färbt jede App sie selbst, und ein dunkler Satz müsste in beiden für dieselben Bausteine stimmen. Mit a
gibt es dafür eine Quelle, und `kern.css` wird wie `kern.js` nie von Hand geändert. Die Gratwanderung bekommt den
Darkmode mit, ohne eigenen Satz. Für b spricht, dass der Kern bisher nur JavaScript verteilt und der Lernsteig bewusst
anders aussieht (erwachsener) — das trägt a auch, weil die App-eigenen Töne bei der App bleiben. Kippen würde die
Empfehlung, wenn die Kern-Bausteine in den Apps verschieden gefärbt sein sollen (dann gehört ihre Farbe nicht in den
Kern).

### DM2 — Wer wählt, und was gilt ohne Wahl? → **a** (Patrik, 12.11.2026)

**Ort:** Verwaltung → Einstellungen → Block „🎨 Aussehen“ (`LS.EINSTELLUNG_BLOECKE`, heute nur `stil`); Lernsteig
Einstellungen; Personen im Kern (`KERN.person`).
**Heute:** Einstellungen der Aufsicht gelten je Gerät; Kinder stellen nichts ein.
**Problem:** Der Grundsatz sagt „Eulenpfad hell, Lernsteig wie das Gerät“. Offen ist, ob die Wahl am Gerät oder an der
Person hängt, und ob ein Kind wählen darf.

- **a (Empfehlung):** „Einstellung `farben`: hell · dunkel · wie das Gerät. Im Eulenpfad stellt sie die Aufsicht je Gerät
  ein, Standard hell; jede Aufsicht kann für sich selbst abweichen (gilt, solange sie angemeldet ist). Kinder wählen
  nicht. Im Lernsteig wählt jede Person selbst, Standard wie das Gerät. Gespeichert wie die übrigen Einstellungen,
  nicht im Protokoll.“
- **b:** „Eine Einstellung je Gerät für alle Personen; im Eulenpfad Standard hell, im Lernsteig wie das Gerät.“
- **c:** „Wie a, dazu darf ein Kind in ‚Mein Bild‘ zwischen hell und dunkel wählen, wenn die Aufsicht es erlaubt.“

*Warum die Empfehlung:* Am Gerät stellt die Aufsicht ein, was Kinder sehen — so wie Stil, Dezimalzeichen und Ruhezeiten;
dass ein Tablet der Eltern im Darkmode steht, soll das Kind nicht ungefragt ins Dunkle schicken. Die Aufsicht selbst
nutzt Statistik und Verwaltung oft am Abend; mit a sieht sie dunkel, ohne dass die Kinder es tun. Im Lernsteig sind die
Jugendlichen selbst zuständig (Konten, eigene Meldung), also wählen sie selbst. b ist einfacher, zwingt aber Aufsicht und
Kind am selben Gerät in dieselbe Farbe. c gibt Kindern eine Wahl mehr; sie wiegt weniger, weil hell zum Lesen der
bessere Standard ist und die Wahl nichts am Lernen ändert. Kippen würde die Empfehlung zu c, wenn Kinder im Versuch den
Darkmode ausdrücklich wollen (etwa weil Geschwister ihn haben).

### DM2-S — Gilt die eigene Wahl der Aufsicht auch für den Stil? (Frage Patrik, LERN_Session33) → **a** (Patrik, 12.11.2026)

**Ort:** Block „🎨 Aussehen“ (`LS.EINSTELLUNG_BLOECKE`), Einstellung `stil` (`spiel.js` `EINSTELLUNGEN.stil`, Standard
hand); gespeichert in `lernspiele:einstellungen` je Gerät, dazu je Spiel; Personen im Kern (`KERN.person`).
**Heute:** Der Stil gilt je Gerät für alle Personen gleich. Eine Einstellung je Person gibt es nirgends; DM2 a führt
sie für `farben` ein.
**Problem:** Mit DM2 a hätte der Block Aussehen zwei Einstellungen nach zwei Regeln: Farben je Aufsicht wählbar, Stil
nur je Gerät. Eine Aufsicht, die für sich dunkel und glatt will, könnte das Glatte nur für alle Kinder mit einstellen.

- **a (Empfehlung):** „Beide Einstellungen des Blocks Aussehen (`stil`, `farben`) haben zwei Ebenen: ‚Dieses Gerät‘ —
  gilt für Kinder und für jede Aufsicht ohne eigene Wahl — und ‚Für mich‘ je Aufsicht (Wert oder ‚wie das Gerät‘),
  gespeichert bei ihrer Person und mit Sicherung und Abgleich unterwegs, nicht im Protokoll. Neben der Einstellung des
  Geräts steht, ob die angemeldete Aufsicht für sich etwas anderes gewählt hat. Kinder wählen keins von beiden. Was
  später in den Block kommt, folgt derselben Regel.“
- **b:** „Nur `farben` hat die Ebene ‚Für mich‘ (DM2 a); der Stil bleibt je Gerät für alle gleich.“
- **c:** „Wie a, aber ‚Für mich‘ gilt nur auf diesem Gerät (gespeichert je Gerät und Person, reist nicht mit).“

*Warum die Empfehlung:* Stil und Farben sind beide Geschmack der Person, die vor dem Bild sitzt, und beide ändern nichts
am Lernen; eine Regel für den ganzen Block ist leichter zu verstehen und zu prüfen als zwei. Mit a sieht die Aufsicht
Statistik und Verwaltung so, wie sie will, und die Kinder sehen, was sie für sie eingestellt hat. Bei der Person
gespeichert gilt die Wahl auf jedem Gerät, auf dem sie sich anmeldet — so wie man es von eigenen Einstellungen erwartet.
Für b spricht, dass der Stil eine Gestaltungsentscheidung für die Kinder-Bühne ist (Konzept Gestaltung) und eine
Aufsicht ihn ohnehin selten umstellt; es wiegt weniger, weil b genau den Fall oben (dunkel und glatt nur für mich) nicht
kann. Für c spricht, dass eine Aufsicht am Tablet anders wollen kann als am PC; es wiegt weniger, weil das selten ist und
dann jedes Gerät einzeln einzustellen wäre. Kippen würde die Empfehlung zu c, wenn Aufsichten im Versuch je Gerät
verschieden einstellen.

### DM3 — Wie stehen Zeichnungen und Animationen im Darkmode? → **a** (Patrik, 12.11.2026)

**Ort:** `eulenpfad/spiele/gemeinsam/bilder.js` (817 Farben), `feier.js` (1616), `avatare.js` (374), Zeichnungen der
Spielseiten im Skript (17 Seiten, 159 Farben); Kartenbilder der Startseite.
**Heute:** alle für hellen Grund gezeichnet, viele mit dunklen Umrissen.
**Problem:** Der Grundsatz sagt „helle Bildkachel“. Offen ist, was genau eine Kachel bekommt.

- **a (Empfehlung):** „Jede Zeichnung (Bild der Sammlung, Abschluss-Animation, Kartenbild, gezeichnete Szene eines
  Spiels) steht auf einer Fläche `--k-bildgrund`, die in beiden Modi hell bleibt (hell: wie heute, dunkel: ein warmes
  Weiss, etwa `#f6f1e7`), mit runden Ecken. Emoji bekommen keine Kachel (sie sind farbig und haben keine dunklen
  Umrisse). Avatare behalten ihren gezeichneten hellen Kreis je Deko-Farbe (`avatare.js`) und brauchen keine Kachel. Die
  Farben der Zeichnungen bleiben unverändert.“
- **b:** „Zeichnungen bekommen im Darkmode eine helle Umrisslinie (CSS-Filter `drop-shadow`) statt einer Kachel.“

*Warum die Empfehlung:* Die Zeichnungen sind nach Kennzeichen gezeichnet und einzeln geprüft (E1 a); a lässt jede Farbe
und damit jede Prüfung gültig. Eine helle Kachel ist zudem das, was Kinder von Bildkarten kennen. b ändert jedes Bild
sichtbar (Schein um jede Form) und rettet dunkle Flächen innerhalb eines Bildes nicht, etwa die dunkle Nacht im
Himmels-Forscher (`#312e81`) gegen einen dunklen Grund. Kippen würde die Empfehlung, wenn die hellen Kacheln im dunklen Bild zu stark
blenden (dann ein gedämpfterer Bildgrund, am Gerät anzusehen).

### DM4 — Was geschieht mit den eigenen Farben der Spielseiten? → **a** (Patrik, 12.11.2026)

**Ort:** `eulenpfad/spiele/*/index.html` — 144 Seiten mit 606 eigenen Farben, davon 116 mit 269 festen Hintergründen.
**Heute:** feste Werte im `<style>` jeder Seite (etwa `background: #fff` für ein Feld, in dem `var(--text)` steht).
**Problem:** Eine feste helle Fläche bleibt im Darkmode hell, der Text darin wird hell — unlesbar. Das geschieht still,
ohne Konsolenfehler.

- **a (Empfehlung):** „Jede eigene Farbe einer Spielseite wird eine Variable des Kerns oder der App (Karte, Rand, Feld,
  Stelle, Deko) oder liegt in einer Bildkachel (DM3). Neue Prüfung in `tools/pruefe_skripte.js`: keine feste Farbe im
  `<style>` einer Spielseite ausser in einem Block, der als Bild markiert ist; dazu im Prüf-DOM je Spiel und Stufe in
  beiden Modi der Kontrast jeder Schrift gegen ihren Grund (Untergrenze 4,5, grosse Schrift 3). Umbau in Blöcken wie
  die Abschluss-Animationen, je Block mit Ansicht im Browser in beiden Modi.“
- **b:** „Die Spielfläche jeder Seite gilt als Bildkachel: hell in beiden Modi, Text darin dunkel; nur Rahmen, Kopfzeile,
  Eule und Rückmeldung werden dunkel.“

*Warum die Empfehlung:* a macht den Darkmode vollständig und beweisbar: Die Prüfung findet jede vergessene feste Farbe,
auch künftige in neuen Spielen, und der Kontrast wird gerechnet statt geschätzt. Dieselbe Kontrastprüfung deckt den
hellen Modus mit ab (DM5). b hielte die 116 Seiten unverändert, liesse aber in jeder Runde die grosse helle Fläche
stehen — der Zweck von DM0 a ginge verloren, und die Grenze „was gehört zur Spielfläche“ müsste je Seite gezogen werden.
Kippen würde die Empfehlung, wenn DM0 b gewählt wird (dann braucht es DM4 nicht).

### DM5 — Kontrast im hellen Modus: Stellenfarben und Knopfschrift → **a** (Patrik, 12.11.2026)

**Ort:** `eulenpfad/spiele/gemeinsam/stil.css` `--rot --blau --gruen` (über `--st-*`), `--knopf`.
**Heute:** grün `#2fb36b` 2,70, blau `#2f8fe0` 3,43, rot `#e5484d` 3,91 auf Weiss; weisse Schrift auf dem Knopf 4,17.
**Problem:** Grün liegt unter 3 : 1, also auch für grosse Ziffern zu schwach; Blau und Rot reichen nur für grosse Schrift.
Eine Kontrastprüfung (DM4) würde das sofort melden.

- **a (Empfehlung):** „Im hellen Modus Stellenfarben und Knopf mit mindestens 4,5 auf Weiss, gleicher Ton: grün
  `#157f45` (5,06), blau `#1f74c0` (4,86), rot `#d93a40` (4,54), Knopf so weit dunkler, bis weisse Schrift 4,5 erreicht.
  Die Prüfung aus DM4 hält die Untergrenze für beide Modi fest. Flächen in Stellenfarbe mit weisser Schrift werden dabei
  lesbarer.“
- **b:** „Untergrenze 3 für Stellenfarben (Ziffern sind gross und fett): grün `#1f9254` (3,96), Blau und Rot bleiben;
  Knopf bleibt.“
- **c:** „Hell bleibt, wie es ist; geprüft wird nur der dunkle Modus.“

*Warum die Empfehlung:* Stellenfarben stehen nicht nur auf grossen Ziffern, sondern auch auf kleinen Kürzeln (E, Z, H in
Tabellen und Legenden) und als Flächen mit weisser Schrift; 4,5 gilt für alle diese Fälle, 3 nur für die grossen. Der
Ton bleibt rot, blau, grün, die Vorgabe „wie Calcularis“ gilt für die Zuordnung, nicht für den genauen Wert. b reicht für
die Ziffern und ändert weniger am vertrauten Bild; es wiegt weniger, weil die kleinen Kürzel dann weiter zu schwach
sind. c liesse einen gemessenen Mangel stehen. Kippen würde die Empfehlung, wenn das dunklere Grün neben dem Gut-Grün der
Rückmeldung (`--gut` `#2fbf71`) verwechselbar wird — am Bildschirm nebeneinander ansehen, bevor es gebaut wird.

### DM6 — Deko-Farben, Gut und Hinweis als Schrift und als Grund für Schrift (aus der Messung, LERN_Session33) → **a** (Patrik, 12.11.2026)

**Ort:** `eulenpfad/spiele/gemeinsam/stil.css` `--deko-1` … `--deko-7`, `--gut`, `--hinweis`; Stufenwahl
(`.stufe-nr`, `spiel.js`), Körbe (`.korb-knopf`), grüne Knöpfe (`.knopf.gruen`), Spielseiten mit eigener Verwendung.
**Heute:** Die Deko-Farben sind für Flächen gewählt; dieselben Werte stehen als Schrift (die grosse Stufennummer, FB2 a)
und als Grund unter weisser Schrift (Körbe, „OK ✓“, „▶ Los!“). Gemessen auf Weiss: deko-4 1,92, deko-5 2,49, deko-3 2,76,
gut 2,38, hinweis 2,05 (alle unter 3); weisse Schrift darauf ebenso.
**Problem:** DM5 a regelt Stellenfarben und Knopf, nicht diese. Mit DM4 a gilt die Untergrenze auch für sie. Weder Weiss
noch die dunkle Schrift `--text` reicht auf allen Flächen: `--text` auf deko-1 2,84, deko-6 2,89, deko-7 2,72, Knopf 3,10;
Weiss auf deko-2 3,52, deko-3 2,76, deko-4 1,92, deko-5 2,49, gut 2,38.

- **a (Empfehlung):** „Jede dieser Farben bekommt eine Schrift-Fassung gleichen Tons mit mindestens 4,5 auf Weiss
  (`--deko-N-schrift`, `--gut-schrift`, `--hinweis-schrift`; dunkler gemischt: deko-2 `#c24a85`, deko-3 `#b65e20`, deko-4
  `#947200`, deko-5 `#0e8578`, gut `#218750`, hinweis `#a76812`; deko-1, 6, 7 reichen schon). Sie gilt, wo die Farbe
  Schrift ist (Stufennummer), und als Grund, wo weisse Schrift darauf steht (Körbe, grüne Knöpfe). Die helle Fassung
  bleibt für Flächen ohne Schrift, Ränder und Bilder. Im dunklen Modus bekommt jede Schrift-Fassung ihren eigenen Wert.“
- **b:** „Die Farben bleiben; Schrift steht nie in einer Deko-Farbe (die Stufennummer dunkel in einem farbigen Kreis), und
  auf einer farbigen Fläche nimmt die Schrift Weiss oder `--text`, was mehr Kontrast gibt.“

*Warum die Empfehlung:* a erfüllt die Untergrenze auf jeder Fläche und für jede Schriftgrösse, mit einer Regel für alle
Farben, und hält die Farbe dort, wo sie etwas trägt (die Stufe hat ihre Farbe, FB2 a). b ändert das von Patrik
abgenommene Bild der Stufenwahl (grosse farbige Zahl) und reicht nicht überall: auf deko-2 gibt die bessere der beiden
Schriften 3,67 — für kleine Schrift unter 4,5. Für b spricht, dass keine neuen Variablen entstehen und die Schrift immer
aus den Textfarben kommt, die in beiden Modi ohnehin geprüft sind. Kippen würde die Empfehlung, wenn die dunkleren
Fassungen neben den hellen Flächen derselben Karte fremd wirken (am Bildschirm ansehen; das Gelb `#947200` ist ein
Ocker).

### DM2-K — Dürfen Kinder selbst zwischen hell und dunkel umschalten? (Wunsch Patrik, LERN_Session33) → **a** (Patrik, 12.11.2026)

**Ort:** DM2 a; Profil des Kindes (Muster VR1 a: Vorgabe der Aufsicht, „Kind darf ändern“ oder „🔒 fest“, Felder `wahl`
und `fest`); Kopfzeile der Startseite.
**Heute (DM2 a):** „… Kinder wählen nicht.“
**Problem:** Patrik möchte, dass ein Kind selbst umschalten kann (☀️/🌙), ob es das darf, soll die Aufsicht entscheiden.

- **a (entschieden):** „Farben folgen dem Muster VR1 a: Vorgabe ist die Einstellung des Geräts; im Profil des Kindes
  legt die Aufsicht fest, ob es selbst umschalten darf (‚🔒 fest‘ als Standard). Darf es, steht in seiner Kopfzeile neben
  dem Namen ein Knopf ☀️/🌙; seine Wahl wird eigens gespeichert (`wahl.farben`), gilt vor dem Gerät und reist mit
  Sicherung und Abgleich; ‚↺ Auf Vorgabe zurück‘ löscht sie. DM2 a wird um diesen Zusatz ergänzt.“
- b: eine Einstellung je Gerät im Block „Kinder“ für alle Kinder. c: wie DM2 a, Kinder wählen nicht.

*Warum a:* VR1 a ist das Muster der Reihe für „das Kind darf, wenn die Aufsicht es erlaubt“ (Vorgabe, Freigabe je Kind,
eigene Wahl, zurück auf Vorgabe); kein zweiter Weg für dieselbe Frage. Fest als Standard, weil hell zum Lesen der
bessere Standard ist. Kippen würde es, wenn eine Lehrperson viele Kinder am selben Gerät nicht einzeln freigeben will
(dann ein Knopf „für alle Kinder“ in der Verwaltung). **Gebaut 12.11.2026** (LERN_Session34: `LS.farbenKnopf`, Freigabe im
Profil unter „Was … selbst umstellen darf“, Seitentest „Aussehen“ mit 13 Schritten). **Kipppunkt eingetreten
12.11.2026** (Wunsch Patrik, LERN_Session35): Freigabe für alle Kinder in der Verwaltung (Einstellung `freiFarben`, ebenso
für Timer, Teile und Vorlesen), je Kind „wie alle Kinder“, frei oder fest; dazu der Mond als Schalter auf der Spielseite
(Seitentest „Aussehen“ mit 16 Schritten).

**Zusatz zu DM2 a:** Kinder wählen nicht — ausser die Aufsicht erlaubt es einem Kind nach DM2-K a.

### G1 — Grün und Braun nach DM5/DM6 (Kipppunkt aus DM5, LERN_Session34) → **a** (Patrik, 12.11.2026)

**Ort:** `eulenpfad/spiele/gemeinsam/stil.css`, Schrift-Fassungen als Grund unter weisser Schrift.
**Heute (gebaut nach DM6 a):** grüne Knöpfe, „Timer an“ und Körbe auf der dunkleren Schrift-Fassung mit weisser Schrift.
**Problem:** Am Farbmuster (`.temp/farbmuster.html`, Bild mit `tools/bilder_aufnehmen.js`) war der grüne Knopf `#218750`
vom neuen Hunderter-Grün `#157f45` kaum zu unterscheiden (1,1 zwischen beiden) — der Kipppunkt von DM5; deko-3 `#b65e20`
und Hinweis `#a76812` wurden beide braun (1,0).

- **a (entschieden):** „Wo Schrift auf einer hellen Deko-Fläche steht, behält die Fläche ihren Ton und die Schrift wird
  dunkel (`--text`): gut 5,4, Hinweis 6,3, deko-3 4,7, deko-4 6,7, deko-5 5,2. Weisse Schrift auf der dunkleren Fassung nur,
  wo dunkle nicht reicht (deko-1, 2, 6). Stufennummern und Titel behalten die Schrift-Fassungen. Je Farbe ein Name für die
  Schrift darauf.“
- b: wie gebaut, `--gut-schrift` in einem bläulicheren Ton. c: wie gebaut lassen.

*Warum a:* Der grüne Knopf bleibt `#2fbf71`, zum Hunderter-Grün 2,1 — klar getrennt; Orange und Gelb bleiben wie
abgenommen; dieselbe Regel wie dunkel (helle Fläche, dunkle Schrift). Gebaut: `--<farbe>-grund` mit `--auf-<farbe>`,
`LS.flaeche(farbe)`; `--gut-schrift` und `--hinweis-schrift` entfallen.

## Messung nach 3c-3 (LERN_Session34)

`node tools/kontrast.js --modus=hell,dunkel` vor G1 a, 1215 Seiten: **hell 98 Funde** in 47 von 198 Spielen und Seiten
(vorher 1091), **dunkel 355** in 104. Der Rahmen ist danach frei bis auf „Meine Klasse“ im Filterknopf (halb
durchsichtig, behoben). Übrig: eigene Farben der Spielseiten (Schritt 5; am häufigsten weisse Felder mit `var(--text)`,
Regelkarte `#a0703d` auf `#fff8e1` in sechs Spielen, Körbe und Stellenknöpfe mit eigenen Farben in Wortarten-Sortierer,
Stellen-Detektiv, Punkte-Schieber), Texte in Kartenbildern (Schritt 4) und im Lernsteig (Schritt 6). SVG-Schrift mit
`fill: var(--text)` in Zeichnungen steht in 23 Spielseiten und wird dunkel unlesbar (Hinweis Patrik an der
Wassertropfen-Reise: Nummern der Pfeile; dort mit `--k-bildtext` behoben) — Schritt 5. Stichprobe nach G1 a (acht Spiele
mit Körben, grünen Knöpfen, Stellen): Funde nur noch in den drei genannten Spielseiten.

## Messung hell (LERN_Session33, vor dem Umbau)

`node tools/kontrast.js`: 1215 Seiten (Startseite mit vier Tabs, je Spiel Stufenwahl und erste Aufgabe jeder Stufe,
Lernsteig), 20 994 Texte, keiner auf einem Bild als Grund. **1091 Funde unter der Untergrenze** (je Spiel verschiedene
Orte gezählt), in 170 von 198 Spielen und Seiten; im Lernsteig keiner, dort ist ohne Konto aber nur die Anmeldung zu
sehen (172 Texte).

Fast alles kommt aus dem Rahmen (sieben Orte, 888 Funde): Stufennummern in deko-3, 4, 5 auf Weiss (je 169 Spiele; DM6),
„wechseln“ in `--knopf` auf Weiss 4,17 (169; DM5), Buchstabe im Ersatz-Avatar `#64748b` auf `#eceef6` 4,11 (170),
weisse Schrift auf Körben in deko-3 und deko-5 (23, 19; DM6). Dazu 167 Orte in 74 Spielen, häufigste: grüner Knopf
„OK ✓“ 2,38 (7 Spiele), Untertitel der Körbe, Regelkarte `#a0703d` auf `#fff8e1` 4,05 (6), Buchstaben ausserhalb in der
Trenn-Schere 1,47, Kopfzellen der Stellen im Notizblock 1,35; auf der Startseite der bunte Titel „Eulenpfad“ (1,46 bis
2,68) und leiser Text auf dem Himmel 3,75. Alle Funde mit Ort, Farben und Stufe: `.temp/kontrast/hell.json`
(gitignored, neu mit dem Werkzeug).

Nicht erfasst: Rückmeldung, Lösung und Schlussbild (nur die erste Aufgabe); Tab Verwaltung (nur für eine Aufsicht mit PIN);
Übungen im Lernsteig (Konto nötig). Feste Farben in Stilen (`pruefe_skripte.js --farben`): 923 in 156 Stilen, davon 606
in 145 Spielseiten, 124 in `start.css`, 119 in `stil.css`.

## Reihenfolge nach den Entscheiden (Vorschlag)

1. `kern/farben.css` mit hellem Satz gleich den heutigen Werten (oder den DM5-Werten), Verteilen, Seiten binden;
   Gegenprobe: hell sieht aus wie vorher (Bildvergleich je App). **Erledigt 12.11.2026** (Kern 1.40.0).
2. Kontrastprüfung (DM4), zuerst nur melden; Zahlen je Spiel. **Erledigt 12.11.2026:** im Browser (`tools/kontrast.js`),
   nicht im Prüf-DOM — das Ersatz-DOM der Seitentests rechnet kein CSS (Kaskade, Variablen, Deckkraft); Zählung fester
   Farben als Hinweis in `tools/pruefe_skripte.js` Punkt 7, Ausnahme mit dem Kommentar „Bildfarben: <Grund>“.
3. Dunkler Satz, Einstellung `farben` (DM2), Skript im `<head>`, `color-scheme` für Formularfelder. **3a erledigt
   12.11.2026** (Kern 1.41.0: dunkler Satz, `KERN.farben`, `kern-kopf.js`), **3b erledigt 12.11.2026** (Einstellung und
   „Für mich“, Kopf-Skript in 174 Seiten); **3c-1 und 3c-2 erledigt 12.11.2026:** `stil.css` (43 Namen) und
   `start.css` (40 Namen) ohne feste Farben, hell unverändert (Farbabdruck auf acht Seiten gleich), dunkel mit eigenen
   Werten; Kern 1.42.0 mit `--k-feld`; Prüfung Punkt 7 zählt dunkle halb durchsichtige Schatten und `color-mix` mit einer
   Variablen nicht mehr, Ausnahme „Gleich in beiden Modi:“ (Leiste der Entwicklung). **3c-3 erledigt 12.11.2026**
   (LERN_Session34, Kern 1.42.1): DM5 a, DM6 a, G1 a; Messung nach dem Umbau unter „Messung nach 3c-3“.
4. Bildkachel (DM3) in Bildersammlung, Abschluss-Animationen, Kartenbildern, Avataren. **Erledigt 12.11.2026**
   (LERN_Session34, Kern 1.43.0): Klasse `bildkachel` (heller Satz gilt darin), Zeichnungen der Sammlung und
   Abschluss-Animationen dunkel auf dem warmen Bildgrund, Kartenbilder mit hellen Farben; Avatare ohne Kachel (eigener
   heller Kreis, angesehen); Symbole erreichter Abzeichen im Tab Erfolge auf runder Kachel; offene ohne Kachel, im Dunkeln
   kaum erkennbar — eine Überraschung bis zum Erreichen (Wunsch Patrik).
   Messung dunkel danach 348 Funde (vorher 355); auf der Startseite bleiben nur die blassen Texte in Symbolen noch offener
   Abzeichen (wie hell). Gezeichnete Szenen der Spielseiten selbst (17 Seiten) mit Schritt 5.
5. Spielseiten in Blöcken (DM4), je Block im Browser in beiden Modi ansehen. **In Arbeit seit 12.11.2026**
   (LERN_Session35): Stile aller Spielseiten ohne feste Farbe (vorher 534 in 142 Seiten; `tools/pruefe_skripte.js`
   Punkt 7 dort jetzt ein Fehler); neue Namen `--auf-stelle`, `--feld-leise`, `--marker`, `--regel` in `stil.css`;
   Szenen mit `szenenbild bildkachel`, Gegenstände mit „Gleich in beiden Modi:“; Deko-Töne als Schrift über
   `--deko-N-schrift`; Notenblatt mit dunklen Noten. Messung danach: **hell 10, dunkel 9** verschiedene Funde (vorher
   98 und 348). Übrig: Texte in den Lücken-Motiven der Startseite (Schmuck), Zahl im Dach des Zahlenhauses und
   „Fels“ in der Wassertropfen-Reise (Grenzen der Messung: Dach als Rand gezeichnet, Schrift mit Umriss), Holz im
   Wortfamilien-Baum 4,1 und Glace-Kugel 3,8 (Gegenstände), blasse Buchstaben ausserhalb in der Trenn-Schere
   (absichtlich), Beschriftung B im Koordinaten-Schatz hell 3,3, Akzent im Lernsteig (Schritt 6). Feste Farben in
   Skripten prüft keine Messung.
6. Lernsteig und Gratwanderung; Anleitungen und Portal; Bilder der Anleitungen neu.
