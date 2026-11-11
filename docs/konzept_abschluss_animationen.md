# Konzept: Abschluss-Animationen im Eulenpfad

Stand: 11.11.2026 (LERN_Session30) · **Entschieden (AN1 a, AN2 a, AN3 a, AN3-Z a, AN3-T a, AN3-K a); Piloten P1–P8 und Ruhezeiten gebaut und abgenommen; Ausrollen nach AR1 a in Arbeit: M1 abgenommen, M2 bis M5, A, B und C gebaut (140 von 169 Spielen), Abnahme offen; D offen.**
Entscheide und Pilotliste in Abschnitt 7.

## 1. Auslöser

Patrik (LERN_Session27), nach einem Hinweis von Gemini: Bei erfolgreichem Abschluss einer Runde wäre eine kleine
Animation „toll für den Lerneffekt“ — je nach Stufe oder Erfolgsgrad (Sterne) oder beidem etwas anders. Beispiele von
Patrik: Rechen-Rakete (Stufe 1 umrundet die Erde, 2 Mond, 3 Mars, 4 Jupiter, 5 Saturn), Himmels-Forscher (Mondphasen je
Stufe). Auftrag: Ideen für alle Spiele, als Muster.

**Was belegt ist und was nicht:** Dass eine Belohnung am Ende motiviert weiterzuspielen, ist plausibel; dass eine
Animation den *Lerneffekt* steigert, ist hier nicht belegt (keine Quelle gesucht). Ein Lerneffekt ist am ehesten zu
erwarten, wo die Animation den Inhalt des Spiels zeigt (Mondphasen in der richtigen Reihenfolge, Planeten in der
richtigen Folge) — darum Regel 1 in Abschnitt 3.

## 2. Heute

`spiele/gemeinsam/spiel.js`: Am Ende jeder geschafften Runde der Schluss mit Sternen (`sterne`, `flug`) und `konfetti()`
(berichtigt LERN_Session27: bei jeder Runde, nicht nur bei 3 Sternen), im Endlos-Modus Konfetti bei einem neuen Rekord —
für alle Spiele gleich. Reservierte Klassen: `sterne`, `sterne-klein`, `aus`, `konfetti`, `flug` (docs/eulenpfad/rahmen.md 2).

**Gebaut (LERN_Session27):** Rahmen `spiele/gemeinsam/feier.js` mit Muster REISE und Pilot P1 Rechen-Rakete
(docs/eulenpfad/rahmen.md 24); die übrigen sieben Muster und Piloten folgen, danach die Ruhezeiten (AN3-Z, AN3-T, AN3-K).

## 3. Regeln für jede Animation

1. **Fachlich treu:** Die Animation zeigt den Inhalt richtig — Mondphasen, Planetenfolge, Geografie, Stellenwerte, Noten.
   Wo ein Bild etwas Falsches behaupten könnte, ein neutrales Bild wählen.
2. **Kurz und überspringbar:** 2–4 Sekunden; ein Tippen überspringt sie, „Nochmal“ und „Andere Stufe“ sind sofort
   bedienbar.
3. **Ruhig:** Mit der Einstellung „Bewegung reduzieren“ des Geräts (`prefers-reduced-motion`) ein stehendes Schlussbild
   statt Bewegung. Kein Blinken, nichts Grelles, keine Explosionen.
4. **Nie strafend:** Auch 1 Stern ist ein Erfolg und bekommt die Animation der Stufe; mehr Sterne schmücken nur aus.
   Eine abgebrochene Runde bekommt keine.
5. **Eigenes, nichts Nachgebautes:** keine Figuren, Marken, Logos oder bekannten Filmszenen. Die Eule des Eulenpfads ist
   die eigene Figur und darf überall auftreten.
6. **Ohne Text:** höchstens Zahlen, wo sie zum Inhalt gehören (Alter 2. Klasse: fast ohne Lesetext).
7. **Offline und leicht:** SVG und CSS, keine Bibliothek, keine Bilddateien aus dem Netz. Farben aus `--deko-*`, wo der
   Inhalt keine Farbe verlangt; Naturfarben, wo er es tut (Mars rötlich, Erde blau mit Land). Die
   Stellenfarben `--st-*` nur, wo eine Stelle gezeigt wird — dort aber genau so wie im Spiel (Einer rot, Zehner blau,
   Hunderter grün, ab den Tausendern wiederholt). Dezimalzahlen über `LS.dezimalText`, Geld über `LS.geldText`.
8. **Ton nur mit Ton an:** Wenn das Spiel Töne hat (🔇-Schalter), darf die Animation einen kurzen Klang haben, sonst still.

## 4. Was sich ändert: Stufe und Sterne

- **Stufe → Ziel oder Szene.** s1 Einstieg bis s6 Königsstufe gehen einen Schritt weiter: weiter weg, grösser, genauer,
  vollständiger. So sieht das Kind, dass die höhere Stufe „weiter“ führt.
- **Sterne → Ausschmückung.** 1 Stern: die Animation schlicht. 2 Sterne: ein Zusatz (etwa ein Fähnchen). 3 Sterne:
  Feier (Funken oder das bisherige Konfetti, kurz).
- **Endlos-Modus:** keine Stufen-Animation (die Runde endet mit einem Fehler); wie heute Konfetti bei einem neuen Rekord.

## 5. Muster

Damit nicht 169 Einzelstücke entstehen, baut der Rahmen wenige **Muster**; ein Spiel wählt eines und gibt nur die
Bilder je Stufe an. Vorschlag für `spiele/gemeinsam/feier.js`:

| Muster | Was geschieht | Beispiel |
|---|---|---|
| **REISE** | ein Objekt fliegt oder fährt zu einem Ziel, je Stufe weiter | Rechen-Rakete |
| **ZYKLUS** | etwas durchläuft Phasen, je Stufe eine Phase weiter | Mondphasen, Jahreszeiten, Lebenszyklus |
| **WACHSEN** | etwas wächst je Stufe grösser | Samen → Baum |
| **BAUEN** | etwas wird je Stufe höher oder vollständiger | Zahlenmauer wird zum Turm |
| **ZOOM** | Genauigkeit oder Vergrösserung, je Stufe eine Stelle mehr | Dezimal-Rakete |
| **AUFTRITT** | eine Szene wird je Stufe voller | Musik: Solo → Orchester |
| **SAMMELN** | eine Sammlung füllt sich je Stufe | Regal, Album, Truhe |
| **KARTE** | ein Weg über eine Karte, je Stufe weiter | Schweiz-Karte |

Schnittstelle (Vorschlag): Das Spiel gibt im Aufruf von `LS.spiel` `feier: { muster: "reise", stufen: { s1: …, s6: … } }`
mit; der Rahmen spielt sie im Schlussbild ab und kümmert sich um Regeln 2–4 und 8. Ein Spiel ohne `feier` behält das
heutige Schlussbild.

## 6. Ausgearbeitete Beispiele

### Rechen-Rakete (REISE) — Vorschlag Patrik

s1 die Rakete umrundet die Erde · s2 fliegt zum Mond · s3 zum Mars · s4 zum Jupiter · s5 zum Saturn · s6 hinaus an den
Rand des Sonnensystems, die Sonne nur noch ein heller Punkt. Die Planeten in der richtigen Folge und mit erkennbaren
Merkmalen (Mars rötlich, Jupiter mit Streifen, Saturn mit Ring); Abstände nicht massstäblich. Sterne: 2 — ein Fähnchen
am Ziel, 3 — die Eule winkt aus dem Fenster.

### Dezimal-Rakete (ZOOM) — statt derselben Reise

Gleich wie die Rechen-Rakete wäre doppelt; passender zum Inhalt (Dezimalzahlen): Die Rakete **landet auf einem
Zahlenstrahl**, und je Stufe wird hineingezoomt — s1 landet auf einer ganzen Zahl, s2 auf dem Zehntel, s3 zwischen zwei
Zehnteln genau, s4 auf dem Hundertstel, s5 nach zweimal Zoomen auf dem Hundertstel, s6 auf dem Tausendstel genau. Die
Zahl am Landeplatz steht in der Schreibweise des Geräts (`LS.dezimalText`). Sterne: 2 — Landelichter, 3 — Funken.

### Himmels-Forscher (ZYKLUS, dann REISE)

Das Spiel übt in s1–s4 **Mondphasen**, in s5 und s6 **Planeten**. Darum:

- s1 Sonnenaufgang und -untergang mit **Neumond** daneben — er geht etwa mit der Sonne auf und unter und ist darum
  nicht zu sehen (nur als dunkle Scheibe angedeutet).
- s2 nach Sonnenuntergang im Westen die **zunehmende Sichel** (auf der Nordhalbkugel rechts hell).
- s3 der **Halbmond** im ersten Viertel (rechte Hälfte hell), abends im Süden.
- s4 der **zunehmende Dreiviertelmond**, dann der **Vollmond**, der bei Sonnenuntergang im Osten aufgeht — der ganze
  Zyklus, den s4 übt.
- s5 eine Sonde fliegt von der Sonne aus an den **acht Planeten der Reihe nach** vorbei (was s5 übt).
- s6 Königsstufe: **Vollmond über einer Hügelkante, die Eule fliegt als Silhouette davor durchs Bild** — eigenes
  Bild statt der bekannten Filmszene mit dem Fahrrad vor dem Mond (Regel 5).

Sterne: 2 — ein Sternbild leuchtet auf, 3 — Sternschnuppe.

Patriks Idee (Vollmond in Stufe 4 und 5) setzt eine Stufe mehr Mond voraus; s5 und s6 üben aber Planeten.

## 7. Entscheide

**Entschieden** von Patrik am 10.11.2026 (LERN_Session27):

| Nr. | Entscheid | Zusatz Patrik |
|---|---|---|
| AN1 | a — Rahmen und die acht Muster bauen, an einem Pilot von acht Spielen prüfen, dann fachweise alle übrigen | „liste mit den piloten ist ein muss“ — Pilotliste unten |
| AN2 | a — Stufe ändert das Ziel, Sterne schmücken aus (Abschnitt 4) | — |
| AN3 | a — Einstellung der Aufsicht „Abschluss-Animation: an (Standard) / aus“, global und je Spiel; „Bewegung reduzieren“ des Geräts gilt immer | „mit Zeitschaltuhr/en?“ → AN3-Z |
| AN3-Z | a — **Ruhezeiten**, global für das Gerät: eine oder mehrere Zeitspannen je Wochentag (etwa Mo–Fr 08:00–12:00 und 13:30–16:00), Ortszeit des Geräts (`KERN.zeit`); während einer Ruhezeit ist die Abschluss-Animation aus, danach gilt an/aus wie eingestellt, auch je Spiel; reist mit dem Abgleich; die Verwaltung zeigt, ob gerade Ruhezeit ist | Frage Patrik: auch Ruhezeit für Töne? → AN3-T |
| AN3-T | a — die Ruhezeit gilt auch für den Ton; Spiele mit der Spielweise „Hören“ (23 im Katalog) zeigen während einer Ruhezeit beim Start „🎧 Diese Runde braucht Ton — mit Kopfhörern spielen“ und „Ton für diese Runde an“, nach der Runde wieder aus | „es sollte differenziert eingestellt werden können“ — Lesart unten |
| AN3-K | a — Einstellung je Gerät „🎧 Dieses Gerät wird mit Kopfhörern benutzt“: dann gilt die Ruhezeit nicht für „Hören als Inhalt“ (und, wenn gewählt, nicht für das Vorlesen); Klänge und Animation folgen weiter der Ruhezeit; reist nicht mit dem Abgleich. Kopfhörer erkennen kann eine Webseite nicht zuverlässig (keine Schnittstelle für die aktive Ausgabe; Gerätenamen nur mit Mikrofon-Freigabe; auf iPad und iPhone gar nicht) | „eventuell auch die option, dass spiele mit erforderlicher audioausgabe ausgeblendet werden“ — unten |
| AR1 | a — **Reihenfolge beim Ausrollen:** Mathe zuerst, in Blöcken nach Thema von je etwa 10 bis 15 Spielen; danach Deutsch, NMG und am Schluss Englisch, Französisch, Musik, Medien und Informatik; je Block ein Commit und die Abnahme durch Patrik in der Vorschau (`tools/feier_vorschau.html`) | — |

**Spiele, die Ton brauchen, in der Ruhezeit (Zusatz Patrik zu AN3-K):** Einstellung je Gerät „Spiele, die Ton
brauchen, während einer Ruhezeit: **mit Kopfhörer-Hinweis zeigen** (Standard) / **ausblenden**“. Ausgeblendet heisst: Im
Tab Spiele fehlen sie mit einem Hinweis „… Spiele mit Ton sind während der Ruhezeit ausgeblendet“, Zufall und Mix nehmen
sie nicht; nach der Ruhezeit sind sie wieder da. Mit „🎧 Kopfhörer“ (AN3-K) bleiben sie immer sichtbar. Welche Spiele Ton
brauchen, sagt der Katalog (Spielweise `hoeren`).

**Lesart „differenziert“ (AN3-T, von Patrik bestätigt 10.11.2026):**

- **Je Art**, wofür die Ruhezeit gilt, einzeln ein- und ausschaltbar: ☑ Abschluss-Animation · ☑ Klänge (Richtig, Falsch,
  Sterne) · ☑ Vorlesen der Eule · ☑ Hören als Inhalt (Aussprache, Musik, Hörgeschichte; mit dem Kopfhörer-Hinweis oben).
  Vorgabe: alle an.
- **Je Zeitspanne** wählbar: etwa Unterricht 08:00–12:00 alles, Mittag 12:00–13:30 nur Abschluss-Animation.
- **Je Spiel** abweichend, wie die übrigen Einstellungen je Spiel („wie global“ / eigene Wahl).
- Die Aufsicht sieht in der Verwaltung, welche Ruhezeit gerade gilt und wofür.

**Gebaut** 10.11.2026 (LERN_Session27, Schritt 3; docs/eulenpfad/rahmen.md 25). Wo der Bau selbst entschieden hat (zur
Abnahme):

- **Je Spiel** drei Werte: „wie eingestellt“, „gilt hier nicht“, „gilt hier ganz“ (alle Arten, solange eine Zeitspanne
  läuft) — statt je Spiel und je Art einzeln, das wären bei 169 Spielen vier Schalter je Zeile.
- **Zufall und Zufallsmix** nehmen Spiele mit Ton in der Ruhezeit nie, auch mit „mit Kopfhörer-Hinweis zeigen“: Dort
  gibt es keinen Ort, an dem jemand „Ton für diese Runde an“ wählen könnte; die Runde wäre stumm.
- **Der Kopfhörer-Hinweis** steht vor jeder Runde, nicht nur auf der Stufenwahl: Die Stufenknöpfe im Tab Spiele
  starten die Runde direkt.
- **Abschluss-Animation in der Ruhezeit** wie „aus“: das Schlussbild mit Konfetti (still, ohne Bewegung der Animation).
- **Abgleich:** Die Ruhezeiten reisen auch in einer Sicherung aller Personen, nicht in der Sicherung eines Kindes.
- **Mitternacht** als Ende: Das Zeitfeld kennt kein 24:00; „bis 00:00“ heisst Mitternacht und steht so da.

### Pilotliste (AN1 a)

Je Muster ein Spiel, über Fächer und Klassen verteilt; jedes prüft etwas Eigenes am Rahmen. Erst wenn alle acht auf
Desktop, Tablet (768 px) und Handy (375 px) angesehen und von Patrik abgenommen sind, folgen die übrigen Spiele.

| Nr. | Spiel | Muster | Fach, Klasse | Prüft am Rahmen | Status |
|---|---|---|---|---|---|
| P1 | 🚀 Rechen-Rakete | REISE | Mathe, 4 | Weg über sechs Ziele, Planeten fachlich richtig (Folge, Mars rötlich, Saturn mit Ring) | abgenommen 10.11.2026 (Patrik, LERN_Session27) |
| P2 | 🚀 Dezimal-Rakete | ZOOM | Mathe, 5 | Zahlen in der Animation über `LS.dezimalText` (Punkt oder Komma nach Einstellung), Zoom bis Tausendstel | abgenommen 10.11.2026 (Patrik, LERN_Session27) |
| P3 | 🔭 Himmels-Forscher | ZYKLUS, dann REISE | NMG, 3 | zwei Muster in einem Spiel (Stufen 1–4 und 5–6), Mondphasen fachlich richtig | abgenommen 10.11.2026 (Patrik, LERN_Session27) |
| P4 | 🌳 Wortfamilien-Baum | WACHSEN | Deutsch, 4 | Wachsen ohne Text (Wörter nur angedeutet), Sprachfach | abgenommen 10.11.2026 (Patrik, LERN_Session27) |
| P5 | 🧱 Zahlenmauer-Baumeister | BAUEN | Mathe, 2 | Zahlen in den Steinen richtig (jeder Stein die Summe der beiden darunter), jüngere Kinder | abgenommen 10.11.2026 (Patrik, LERN_Session27) |
| P6 | 🎺 Instrumenten-Kenner | AUFTRITT | Musik, 2 | Ton nur mit Ton an (Regel 8), Haltung der Instrumente richtig | abgenommen 10.11.2026 (Patrik, LERN_Session27) |
| P7 | 🎣 Anlaut-Angel | SAMMELN | Deutsch, 1 | jüngste Kinder (fast ohne Lesetext), das schlichteste Muster | abgenommen 10.11.2026 (Patrik, LERN_Session27) |
| P8 | 🗺️ Schweiz-Karten-Suche | KARTE | NMG, 4 | Kartendaten des Spiels wiederverwenden statt neu zeichnen | abgenommen 10.11.2026 (Patrik, LERN_Session27) |

**Abnahme** (Patrik): `python tools/entwickler_server.py`, dann `http://localhost:<port>/tools/feier_vorschau.html` —
je Pilot alle sechs Stufen in 1024, 768 und 375 px, mit 1, 2 und 3 Sternen, einmal mit „Bewegung reduzieren“.
Je Pilot prüfen: führt die Stufe sichtbar weiter; stimmt der Inhalt fachlich (Spalte „Prüft am Rahmen“ oben und die
Abweichungen unten); passt der Schmuck zu den Sternen; ruckelt nichts, ragt nichts aus dem Bild; beim
Instrumenten-Kenner mit Ton an je Auftritt ein Ton, mit 🔇 still. Was nicht passt, als Bemerkung (Entwickler-Modus)
oder im Chat.

Fremdsprachen und Medien und Informatik sind im Pilot nicht vertreten; ihre Spiele nutzen dieselben Muster (ZYKLUS,
AUFTRITT, KARTE, REISE) und kommen mit dem fachweisen Ausrollen.

Die Ideen je Spiel stehen in Abschnitt 8. Wo die gebauten Piloten davon abweichen (zur Abnahme):

- **P2 Dezimal-Rakete:** gestapelte Zahlenstrahlen statt eines Planeten; je Stelle eine Lupe tiefer, die Rakete landet
  senkrecht auf der Zahl, die Zahl steht darunter. Schmuck wie bei der Reise (Fähnchen, Funken, Eule im Fenster) statt
  federnder Landebeine. Zahlen der Stufen: 4 · 4.6 · 7.3 · 3.75 · 6.47 · 4.375 (s6 Tausendstel, wie die Stufe übt).
- **P3 Himmels-Forscher:** s1–s4 steigt der Mond hinter dem Hügel auf und zieht im Bogen über den Himmel, Stufe um
  Stufe zunehmend: Neumond (die Sonne daneben), Sichel, Halbmond, Vollmond (Rückmeldung Patrik, ersetzt die erste
  Fassung mit der Reihe der Phasen); ohne Himmelsrichtung, die wäre ohne Text nicht lesbar. s5 Sonde an den acht
  Planeten vorbei, s6 Eule vor dem Vollmond wie vorgeschlagen. Schmuck: funkelnde Sterne (2★) statt eines Sternbilds,
  Sternschnuppe mit hellem Kopf und verblassendem Schweif links oben (3★; als blosser Strich war sie nicht erkennbar).
- **P4 Wortfamilien-Baum:** Folge wie vorgeschlagen (Stamm, erster Ast, drei Äste, Blätter, Blüten, Früchte); Wörter
  als leere Kärtchen am Holz und an den Ästen. Aus den Blüten werden Äpfel (die Blüten vergehen), die Eule fliegt erst
  mit den Früchten in die Krone. Schmuck: ein Schmetterling flattert heran (2★), ein Vogel singt auf der Wiese (3★)
  statt raschelnder Blätter und fallender Blüten — beides gäbe es in Stufe 1–3 noch nicht.
- **P5 Zahlenmauer-Baumeister:** Form wie das Spiel (s1–s3 drei Reihen, s4 und s5 vier, s6 fünf) statt 2 bis 6
  Reihen; Grundsteine im Zahlenraum der Stufe (oberster Stein 12, 45, 72, 64, 690, 1435). Die Steine fallen von unten
  nach oben an ihren Platz, Sandstein statt Stellenfarben. Schmuck: Eule auf dem Deckstein (2★), Fähnchen und Funken
  (3★).
- **P6 Instrumenten-Kenner:** Folge wie vorgeschlagen (Trommel, + Querflöte, + Geige, + Trompete, + Cello, Orchester
  mit sechs Streichern dahinter); die Musikerinnen sind Eulen. Haltung: Querflöte zur rechten Seite der Spielerin,
  Geige an der linken Schulter mit dem Bogen rechts, Cello zwischen den Knien mit dem Hals links; die Trompete zeigt
  nach vorn (im Bild zur Seite). Je Auftritt ein Ton des C-Dur-Dreiklangs, nur mit Ton an. Schmuck: Scheinwerfer
  (2★), Verbeugung und Funken (3★) statt Konfetti.
- **P7 Anlaut-Angel:** Fische ohne Bild darauf (ein Bild in jedem Fisch wäre zu klein); sie stehen aufrecht
  nebeneinander im Eimer, damit die Kinder sie zählen können. Schmuck: Wasserringe (2★), Funken über dem Eimer (3★)
  statt Fischsprüngen im Bogen — die Fische springen schon in der Grundfassung im Bogen.
- **P8 Schweiz-Karten-Suche:** Folge nach dem Spiel statt nach der Idee: s1 die Wahlkreise des Kantons St. Gallen
  (Ausschnitt), s2 die Ostschweiz, s3 alle 26 Kantone, s4 die Hauptorte, s5 die Städte, s6 Kantone und Hauptorte.
  Umrisse und Lage aus karte.js (swisstopo), keine Namen. Die Eule fliegt von West nach Ost, was sie überfliegt,
  leuchtet auf. Schmuck: Fähnchen am letzten Ziel (2★), Funken (3★) statt glänzender Berge (keine Höhendaten).

### Ausrollen (AR1 a)

| Block | Themen | Spiele | Status |
|---|---|---|---|
| M1 | Stellenwert, Dezimal | 10 | abgenommen 10.11.2026 (Patrik, LERN_Session27); Tresor danach nachgebessert, dessen Abnahme offen |
| M2 | Zahlen, Teiler, Begründen | 12 | in Arbeit seit 11.11.2026 (LERN_Session28, M2): gebaut, Abnahme offen |
| M3 | Rechnen | 13 | in Arbeit seit 11.11.2026 (LERN_Session28, M3): gebaut, Abnahme offen |
| M4 | Sachrechnen, Grössen | 12 | in Arbeit seit 11.11.2026 (LERN_Session29, M4): gebaut, Abnahme offen |
| M5 | Geometrie | 13 | in Arbeit seit 11.11.2026 (LERN_Session29, M5): gebaut, Abnahme offen |
| A | Mathe M6 (Daten, Kombinatorik, Brüche) und Deutsch Teil 1 (Laute, Lesen, Schreiben, Rechtschreibung, Erzählen) | 23 | in Arbeit seit 11.11.2026 (LERN_Session29, A): gebaut, Abnahme offen |
| B | Deutsch Teil 2 (Sätze, Wortarten, Gedichte, Zuhören) und NMG Teil 1 (Zeit, Geschichten, Gemeinschaft, Verkehr) | 25 | in Arbeit seit 11.11.2026 (LERN_Session30, B): gebaut, Abnahme offen |
| C | NMG Rest (Forschen, Körper, Orientierung, Tiere, Wetter, Wirtschaft) | 24 | in Arbeit seit 11.11.2026 (LERN_Session30, C): gebaut, Abnahme offen |
| D | Englisch, Französisch, Musik, Medien und Informatik | 29 | offen |

**Block M1 — wo das Bild vom Entwurf in Abschnitt 8 abweicht** (die Animation folgt den Stufen des Spiels; zur Abnahme):

- **Stellen-Detektiv:** die Lupe wandert über eine Zahl der Stufe (s1 bis H wie das Spiel, nicht E, Z, H allein);
  2★ Glanz an der Lupe statt Blinken, 3★ Funken ohne Detektivhut. Die Felder unter den Ziffern zart wie im Spiel,
  bewegt wie ruhig (Entscheid Patrik LERN_Session29 nach Vergleich; abgenommen war die bewegt voll farbige Fassung).
- **Zahlen-Baukasten:** die Bausteine der Stufe wie im Spiel (s1 4 H + 2 E mit leerer Stelle, s6 14 H + 3 T), mit der
  Rechnung darunter, statt eines Turms Stelle um Stelle; 2★ Fähnchen statt Kran.
- **Tabellen-Post:** Zahlen der Stufen mit Nullen wie im Spiel; s6 bündelt 14 H zu 1 T und 4 H („mehr als 9 in einem
  Fach“) statt „alle Fächer voll“; 2★ Glanz statt Postsack, 3★ Funken statt Konfetti und Stempel.
- **Ziffernkarten:** 3 bis 7 Karten wie die Stufen des Spiels (nicht 3- bis 7-stellig je Stufe), ohne Umdrehen.
- **Zahlen-Hüpfer:** Schritte der Stufen des Spiels (s1 +50 bis 1000, s6 −99 999 in den Millionen) statt 1er bis 1000er.
- **Zahlenrätsel-Tresor:** das Rad dreht, die Tür schwingt auf, darin je Stufe etwas Wertvolleres: Münze, Münzstapel,
  Goldbarren, Perlenkette, Krone, grosser Diamant (s6 mit der Eule) — nach Rückmeldung Patrik („der tresor öffnet sich
  und es ist immer etwas wertvolleres darin“); in der ersten Fassung ging die Tür nie auf. 2★ Glanz, 3★ Funken.
- **Punkte-Schieber:** Tafeln der Stufen des Spiels (s1 bis H, s2–s3 bis T, s4–s5 bis HT, s6 bis M) statt jede Stufe
  eine Stelle mehr; 2★ Glanz statt Hüpfen.
- **Zehntel-Lupe:** Zahlen der Stufen des Spiels, s5 bis zu den Tausendsteln (0.725), s6 die Mitte 2.45; der
  Marienkäfer landet bei jeder Stufe, nicht erst in s6.
- **Dezimal-Rutsche:** die Rutsche als Hügel zwischen den beiden Nachbarn, der Gipfel ist die Mitte (x.5 rundet
  auf); s1 Geld (3.40 Fr. ≈ 3 Fr.), s6 zwei Wagen von beiden Seiten ins Tal 4.5 (die kleinste und die grösste Zahl,
  die auf 4.5 rundet, auf Hundertstel) statt dreier Rundungen.
- **Stufenzahl-Schieber:** Ziffern rutschen in der Stellentafel statt eines hüpfenden Kommas — das Komma bleibt, wie
  im Spiel; Rechnungen der Stufen des Spiels (s5 36 · 0.1, s6 0.36 : 0.1).

**Block M2 — wo das Bild vom Entwurf in Abschnitt 8 abweicht** (die Animation folgt den Stufen des Spiels; zur Abnahme):

- **Runden-Rutsche:** die Rutsche aus M1 mit der Kugel des Spiels, Zahlen der Stufen statt „je Stufe eine Stelle
  mehr“: 347 ≈ 350, 4362 ≈ 4400, 7520 ≈ 8000, 499 600 ≈ 500 000 (über die Stelle hinweg), 685 412 ≈ 690 000,
  6 500 000 ≈ 7 000 000 (genau die Mitte rundet auf); 2★ Fähnchen statt Looping.
- **Zahlenstrahl-Pfeil:** Strahlen der Stufen (0–1000 in Hundertern … 7 240 000–7 250 000); ab s4 steht der
  Ausschnitt markiert auf dem grösseren Strahl darüber; s5 und s6 treffen zwischen zwei Striche (4637, 7 246 500),
  wie die Stufen „genau schätzen“ üben. 2★ Glanz statt Zittern.
- **Hundertertafel-Detektiv:** Streifen bis 20 und 50 mit den Zahlen, die ganze Tafel mit der 5er- und 3er-Reihe
  als Muster, Seiten im Tausenderbuch 401–500 und 601–700 (7er-Reihe); in s2 und s5 sucht die Lupe eine Zahl (37,
  457), wie die Stufen „Zahlen auf der Tafel finden“ üben. Ohne Umblättern und Zuklappen.
- **Teiler-Spürnase:** Teilbar durch 2, 5, 10 (340) und bis 1000 (7000) wie s1 und s2, dann alle Teiler von 24 und 36
  mit Bögen für die Teilerpaare, die Primzahl 97 (nur 1 und 97) und 49 mit der 7 allein im Ring (ungerade Anzahl
  Teiler, s6) statt Vielfacher und der Primzahlen bis 50. 2★ Glanz statt Wedeln.
- **Überschlags-Radar:** Rechnungen der Stufen mit dem Überschlag wie im Spiel (erste Ziffer; Division mit
  kompatiblen Zahlen): 38 712 + 21 196 ≈ 60 000 … s5 „263 von 830 ≈ 30 %“ (das kleine Wort „von“ wie im Spiel),
  s6 198 765 · 48 ≈ 10 000 000. Der Leuchtpunkt wird je Stufe schärfer; s6 ohne herausfallende Rechnung.
- **Velo-Tabelle:** Tabelle Zeit → Weg wie im Spiel statt 1, 2, 5, 10 km: s1 12 km je Stunde, s3 mit Kommazahlen,
  s4 rückwärts (18 km → 90 min), s5 zwei Velos 9 und 12 km in 60 min, s6 der falsche Wert 8 km wird zu 7.5 km.
  2★ Fähnchen statt Klingel; die Fahrerin ist die Eule.
- **Vergleichs-Krokodil:** Zahlen und Rechnungen der Stufen; das Krokodil taucht zwischen den Karten auf, das offene
  Maul ist das Zeichen (beide Richtungen kommen vor). 2★ Glanz statt Lächeln, 3★ Funken statt blühender Seerosen.
- **Punkte-Blitz:** Bilder der Stufen (Würfel 5, Zehnerfeld 7, zwei Felder 16 und 13, 47 und 352 in Dienes-Material)
  blitzen mit einem hellen Schein auf, statt sich zu sammeln; die Dienes-Teile grösser als im Baukasten.
- **Muster-Fortsetzer:** Bildmuster in den Farben von 🔴 🔵 🟡 (s1–s3), Folgen 18, 15, 12, 9 → 6, 0, 9, 18, 27 → 36
  und 1, 4, 9, 16 → 25 statt Punkt-Quadraten; die nächste Perle fällt an ihren Platz.
- **Preis-Tabelle:** s1 das Sparschwein der Folge „jede Woche 3 Fr. mehr“ statt eines Korbs; Stückpreise s2–s4
  (s4 ohne Preis für 1 Stück), Gramm s5 und s6 (250 g über 50 g) mit einem wachsenden Säckchen; Geld über
  `LS.geldText`. 2★ Glanz statt Kassenzettel.
- **Finger-Zähler:** Stufen des Spiels statt 20 und 100 Fingern: 3, 5, 7 Finger ab dem Daumen, s4 6 Finger gleich
  Würfel und Zehnerfeld, s5 8 + 2 = 10 mit den fehlenden Fingern gestrichelt, s6 die Hände blitzen kurz auf, eine
  Decke wie im Spiel, dann 9. 2★ Glanz statt Winken.
- **Stimmt immer?:** statt eines Mosaiks je Stufe eine Begründung aus den Aussagen des Spiels: zwei ungerade Zahlen
  (die übrigen Steine werden ein Paar), ein Vielfaches von 6 ist eines von 3, 4 · 6 = 2 · 12 (verdoppeln und
  halbieren), drei Nachbarzahlen ausgleichen, doppelte Seite gibt vierfache Fläche, die drei Winkel eines Dreiecks
  füllen die Gerade (180°).

**Block M3 — wo das Bild vom Entwurf in Abschnitt 8 abweicht** (die Animation folgt den Stufen des Spiels; zur Abnahme):

- **Einmaleins-Blitz:** Punktefeld statt Blumenbeet, Reihen der Stufen: 3 × 5, 7 × 8, 56 : 8 (7 Reihen zu 8),
  30 × 7 in Zehnerstangen, s5 die Lücke 70 × 6 = 420 (die gesuchte 70 in Farbe), 40 × 60 in Hunderterplatten.
- **Rest-Rätsel:** Teller und Glas statt Guetzli im Glas allein; s1 Äpfel wie im Spiel, ab 35 je Teller die Zahl auf
  dem Teller (250 : 7, 59 : 7, 5000 : 7). Das Wort „Rest“ in der Rechnung, wie im Spiel.
- **Zehner-Ergänzer:** Zehnerfeld (13 + 7 = 20), Hunderterfelder (60 + 40, 37 + 3, 37 + 63, 365 + 35) und ein
  Rechenstrich (4750 + 250 = 5000) statt eines Turms; das Ergänzte in einer zweiten Farbe, nicht in den Stellenfarben.
- **Zahlenhaus:** Häuser der Stufen (Dach 5, 7, 10 mit allen Zehnerfreunden, 15, 60, 700 mit drei Zahlen je Stockwerk);
  2★ Kamin statt Licht, 3★ die Eule auf dem Dach.
- **Doppel-Spiegel:** Spiegel mit Punkten (3, 5, 9; s3 halbiert 8) und Dienes (35, 374) statt Zahlen.
- **Zahlen-Waage:** Rechnungen der Stufen auf Karten in den Schalen (2 + 3 = 5 … 4 · 6 = 3 · 8); die Waage neigt sich,
  solange nur eine Seite belegt ist. 2★ Glanz statt Wippen.
- **Schriftlich-Werkstatt:** Rechnungen der Stufen untereinander mit Überträgen über dem Strich, beim Minus wie im Spiel
  ergänzend (812 − 347, 40 005 − 2678), s5 347 × 6, s6 drei Zahlen (48 357 + 27 815 + 9468); Spaltenköpfe in den
  Stellenfarben. Ohne Werkzeug und Eule.
- **Malkreuz:** das Kreuz statt eines Rechtecks aus Teilen, Faktoren der Stufen (23 × 4 … 254 × 37); s6 als Rätsel mit
  „?“ am Rand, bis das Feld darunter es verrät.
- **Rechentrick-Detektiv:** Lupe, Trick und Ergebnis je Stufe (9 × 6 = 10 × 6 − 6, 5 × 86 = 10 × 43, 298 + 145 =
  300 + 143, 4 × 37 × 25 = 100 × 37, 999 × 46, 125 × 4072 = 1000 × 509) statt eines Werkzeugkastens.
- **Rechen-Maschine:** Förderband und Kästen der Stufen statt wachsender Zahnräder (15 + 7; zwei, drei Kästen;
  2400 → 5500); s6 die Weiche „gerade?“ wie im Spiel (das Wort steht so dort), 14 → : 2 → + 9 → 16.
- **Zielzahl-Jagd:** Karten der Stufen legen sich zur Rechnung (8 + 4 + 3 = 15 … 25 × 8 + 7 × 3 = 221 mit allen
  Karten), der Pfeil trifft den inneren Ring neben der Zielzahl; statt Ring um Ring je Stufe.
- **Probe-Stempel:** Proben der Stufen: Umkehraufgabe (s1, s2, s5, s6), Endziffer (s3, die letzten Ziffern rot),
  Überschlag (s4); ein Stempel statt mehrerer.
- **Gerecht-Teiler:** Teller der Stufen (4 und 2, 7 und 3, drei Teller, 8 und 4, s5 15 halbiert mit 1 in der Schale,
  s6 vier Teller und Guetzli aus der Schale); die Guetzli wandern im Bogen, darunter je Teller die Zahl.

**Block M4 — wo das Bild vom Entwurf in Abschnitt 8 abweicht** (die Animation folgt den Stufen des Spiels; zur Abnahme).
Neu für alle: **Bildzeichen (Emoji)** in drei Bildern (Schätz-Waage, Gegenteil-Wippe, Rechengeschichten), dieselben wie
in den Inhaltslisten der Spiele — bisher war jedes Bild gezeichnet; das Aussehen hängt von der Schrift des Geräts ab.

- **Uhr-Werkstatt:** die Zeiger drehen zur Uhrzeit der Stufe (3:30, 4:45, 7:25 und 8:43 mit Digitalanzeige wie s3
  und s4), s5 „7:50 + 35 min = 8:25“ mit der überstrichenen Zeit als Torte, s6 „8:47 → 11:20 = 2 h 33 min“ statt
  eines ganzen Tages; Zifferblatt und Zeigerfarben wie im Spiel. 2★ Glanz statt Kuckuck-Eule.
- **Kiosk-Kasse:** Münzen und Noten wie im Spiel (Grösse, 5 Rp. golden, Farben der Noten, nur der Wert) fallen in die
  Kasse: 17 Fr., 87 Fr., 7 Fr. 40 Rp., s4 Rückgeld „20 Fr. − 13 Fr. 60 Rp. = 6 Fr. 40 Rp.“, s5 drei Preise, s6
  „10 Fr. − 4 × 2 Fr. 35 Rp. = 60 Rp.“ mit so wenigen Stücken wie möglich; Beträge nach der Klasse der Stufe
  (`LS.geldText`). 2★ Glanz statt Klingeln, 3★ Funken ohne Fähnchen.
- **Masse-Umwandler:** die Einheiten-Treppe des Spiels statt eines wachsenden Messbands: die Karte springt mit dem
  Faktor Stufe um Stufe (2 m = 200 cm über dm, 2000 g = 2 kg aufwärts, 3 m 25 cm mit „300 + 25“, 5 l = 5000 ml,
  3 km = 300 000 cm); s5 zwei Längen auf dem Lineal (3 cm 5 mm + 2 cm 7 mm = 62 mm), wie s5 im Spiel ohne Treppe.
- **Flächenmass-Treppe:** s1 das Quadrat füllt sich mit 10 × 10 cm² (Auslegen wie im Spiel), dann die Treppe mit ×100:
  3 m² = 300 dm², 3 m² 25 dm², s4 die Falle 4 m² 7 dm² = 407 dm² („400 + 7“), 3 ha = 300 a, 2.5 m² = 25 000 cm².
- **Schätz-Waage:** Wippe mit Elefant und Maus, Reihen auf wachsenden Sockeln (Feder, Apfel, Melone; Ameise,
  Bleistift, Velo, Bus), Bleistift 18 cm auf dem Lineal, Apfel 150 g und Auto 1.5 t auf der Waage mit Anzeige — Werte
  aus den Schätzfragen des Spiels; statt einer Reihe bis zur Kuh.
- **Rechengeschichten:** Bilderbuch, links die Geschichte mit Bildzeichen (3 + 2 Äpfel, 12 − 5 Ballone fliegen weg,
  4 · 6 Eier, 18 + ? = 25 Fische mit leeren Plätzen, 30 : 6 Guetzli auf sechs Tellern), rechts die Rechnung, „?“ wird
  zur Zahl; s6 drei Angaben, die unwichtige (12) durchgestrichen. Ohne Blättern.
- **Gegenteil-Wippe:** Stein und Feder auf der Wippe, Schlange und Raupe mit Balken (lang – kurz), Wettlauf Hase und
  Schildkröte, drei Dinge mit dem grössten im Ring, vier Dinge der Grösse nach, s6 zwei Wippen mit den Paketen des
  Spiels, das schwerste leuchtet — statt eines Regals; die Wippe neigt sich nur dort, wo sie wiegt.
- **Sachaufgaben-Kompass:** REISE statt KARTE: der Kompass geht den Rechenweg Karte um Karte ab (24 · 12 Fr., Rückgeld
  in zwei Schritten, Dreisatz 21.60 Fr. : 3, Säulendiagramm als Quelle, Taxi 6 Fr. + 8 · 3 Fr., s6 drei Schritte), am
  Ziel das Ergebnis mit Einheit; unwichtige Angaben (45 min, 3 h) durchgestrichen. Fähnchen am Ziel bei 2★.
- **Fahrplan-Rechner:** Zeiten der Stufen auf Tafeln über den Halten, beim Umsteigen Ankunft und Abfahrt, je Fahrt ein
  Zug; s3 „45 min + 45 min = 90 min = 1.5 h“, s4 über Mitternacht (Nachthimmel), s5 „= 1.2 h“, s6 „1.75 h + 50 min +
  1 h 20 min = 3 h 55 min“ in der Nacht. Ohne Pfeifen und Winken.
- **Komma-Messband:** Messband in der Einheit, je Stelle nach dem Komma eine Lupe tiefer, der Zeiger landet; darunter
  die Umwandlung (3.25 m = 325 cm, 75 cm = 0.75 m, 0.75 l = 7.5 dl, 0.05 m = 5 cm, 1.25 kg + 750 g = 2 kg,
  0.035 km = 3500 cm — die Stufen des Spiels statt 2 m bis 2.457 m). Fähnchen am Zeiger, Funken um die Landestelle.
- **Platzhalter-Geschichten:** wie vorgeschlagen, mit den Gleichungen der Stufen (7 + 5 = ?, 28 + ? = 50, ? − 15 = 27,
  ? · 8 = 320, 945 : ? = 7) und der Probe mit Haken; s6 zwei Lücken nacheinander (3 · ? = 240, ? + 80 = 500).
- **Zeit-Schätzer:** Stoppuhr für s1–s4 (1 s, 60 s = 1 min, 10 min, 60 min = 1 h), dann die Uhr: s5 „9:45 → 10:20 =
  35 min“, s6 „135 min = 2 h 15 min“ — die Stufen des Spiels statt Tag, Woche und Jahr.

**Block A — wo das Bild vom Entwurf in Abschnitt 8 abweicht** (die Animation folgt den Stufen des Spiels; zur Abnahme).
Deutsch ohne Lesetext wie der Wortfamilien-Baum (Wörter als leere Kärtchen, Silben als Bögen); Buchstaben nur, wo sie
selbst der Inhalt sind (ABC, Gross und klein). Neu im Rahmen: `erscheine` blendet bis zur eigenen Deckkraft eines
Teils, nicht mehr immer bis 1 — dadurch ist der **Scheinwerfer im Instrumenten-Kenner (P6)** jetzt auch bewegt zart wie
im ruhigen Bild (vorher bewegt voll deckend; dieselbe Lesart wie beim Stellen-Detektiv, Entscheid a).

- **Bruch-Pizzeria:** Pizzen der Stufen statt Halbe bis Kürzen: 3/4, 5/8, 1/2 < 2/3, drei geordnet, 1/2 = 2/4 = 4/8,
  vier geordnet — Zeichen nachgerechnet.
- **Schoggi-Brüche:** Tafel mit dem gemeinsamen Nenner, der erste Bruch dunkel, der zweite hell dazu oder weggegessen:
  2/8 + 3/8, 1/3 + 1/4 = 4/12 + 3/12, 1/4 + 1/5, 2/5 + 3/10, 3/4 + 1/2 = 5/4 = 1 1/4 (zwei Tafeln), 7/20 − 3/25 = 23/100.
- **Prozent-Brücke:** Streifen oder Hunderterfeld, darunter Bruch = Dezimalzahl = Prozent auf einer Brücke (3/10,
  37 % = 37/100, 1/2 = 50 %, 3/20 = 0.15 = 15 %), s5 25 % von 80 Fr. = 20 Fr., s6 12 von 40 = 30 % — statt Pfeilern.
- **Mittelwert-Türme:** s1 der Unterschied (7 − 3 = 4), s2 Klötze wandern, bis alle gleich sind, s3 und s4 die Linie des
  Mittelwerts mit der Rechnung, s5 und s6 der fehlende Turm (erst „?“, dann die Zahl).
- **Daten-Detektiv:** Strichliste, Säulen, der Unterschied zweier Säulen, eine fehlende Säule, der Durchschnitt, zwei
  Klassen mit dem Total; 3★ Fähnchen auf der höchsten Säule.
- **Diagramm-Wahl:** Säulen, Kreis in Hälfte und Vierteln, Kreis mit Achteln, Liniendiagramm, Kreis mit Prozent,
  Durchschnitt — statt einer Sonnenblume.
- **Zufalls-Skala:** Säckchen oder Glücksrad, der Zeiger fällt auf die Stufe der Skala mit den Bildzeichen des Spiels
  (drei Stufen, ab s3 fünf, Regeln des Spiels), s4 zwei Räder, s5 „3 von 10“, s6 alle Paare zur Augensumme 7.
- **Sortier-Kiste:** nach Farbe, Form, Grösse, mit Zahl, gelbe Dreiecke, Regel finden.
- **Möglichkeiten-Finder:** alle Möglichkeiten erzeugt und gezählt wie im Spiel: 2 · 3 Kleider, Glace im Becher, Becher
  oder Cornet, mit Wiederholung, Cornet-Türme 4 · 3 und 4 · 3 · 2.
- **Silben-Klatscher:** statt klatschender Tiere das Bild des Worts mit Silbenbögen und Klatschen (2 bis 5 Silben),
  s5 und s6 rutschen die Silben in ihre Reihenfolge.
- **Reim-Paare:** Paare aus der Liste des Spiels, s4 und s5 ein durchgestrichenes Bild, das sich nicht reimt.
- **Buchstaben-Zwillinge:** Sockenpaare mit Gross- und Kleinbuchstaben (b und d in s2).
- **Lese-Detektiv:** wie vorgeschlagen, ein Bild, in das je Stufe tiefer gezoomt wird, am Ende ein Lupenring.
- **Sachtext-Spurensuche:** wie vorgeschlagen bis zum geschlüpften Vogel, im Fernglas.
- **Figuren-Spiegel:** Puppentheater mit Gesichtern als Gefühle (😊 😢 😠 😮 🤔 😏), 2★ Scheinwerfer statt Vorhang.
- **Wort-Spürnase:** Spürnase der Teiler-Spürnase auf der Fährte, s6 bis zum Buch.
- **Regel-Lücke:** Steg mit sechs Lücken, wie vorgeschlagen.
- **ABC-Sortierer:** Steine mit den Buchstaben (statt ohne), die Eule hüpft bis D, H, M, R, V, Z.
- **Morphem-Schere:** leere Bausteine Vorsilbe, Stamm, Endung, je Stufe mehr Wörter.
- **Trenn-Schere:** der Streifen wird geschnitten, 2 bis 7 Teile; ohne Kette um den Bildrand.
- **Tipp-Trainer:** Tastatur ohne Beschriftung, die Tasten der Wörter und Sätze der Stufen leuchten nach.
- **Geschichten-Ordner:** Bildstreifen mit 3 bis 6 Bildern wie die Stufen, der Schneemann wächst Bild um Bild.

**Block M5 — wo das Bild vom Entwurf in Abschnitt 8 abweicht** (die Animation folgt den Stufen des Spiels; zur Abnahme):

- **Spiegel-Raster:** wie vorgeschlagen Kästchen um Kästchen am Spiegelplatz, mit den Achsen der Stufen: senkrecht,
  grösseres Raster, waagrecht, s4 Verschieben mit Pfeil (statt einer schrägen Form), s5 die schräge Achse (Diagonale),
  s6 zwei Achsen, vier Teile. Ohne flatternden Schmetterling (2★ Glanz, 3★ Funken).
- **Koordinaten-Schatzsuche:** REISE statt KARTE, nach den Stufen: s1 und s2 die Hundertertafel („2 E 5 Z = 52“, E und
  Z in den Stellenfarben), s3 der Weg nach rechts, dann nach oben zur Truhe bei (3|7), s4 ein Dreieck wird verschoben,
  s5 ein Rechteck aus Koordinaten, s6 die fehlende Ecke des Quadrats (nachgerechnet) mit der Truhe. Schreibweise
  „(3|7)“ wie im Spiel.
- **Formen-Detektiv:** die Formen und Körper der Stufen nebeneinander statt eines Hauses (s3 gedreht mit Ecken und ihrer
  Zahl, s4 Würfel und Kugel, s5 alle fünf Körper), s6 ein Rechteck mit rechten Winkeln, Symmetrieachsen und
  Parallelzeichen statt des gespiegelten Hauses.
- **Flächen-Pixel:** Häuschen der Stufen (6 < 9, 9, 12, 11 < 12), s5 Rechteck 15 mit Umfang 16, s6 krumme Figur mit
  Umfang 20 — der Umfang in Häuschen-Seiten wie im Spiel (nachgerechnet).
- **Pentomino-Puzzle:** Teile der Stufen statt immer mehr Pentominos bis 6 × 10: zwei und drei Vierlinge, dann zwei,
  drei, vier und sechs Pentominos im Rechteck — jeder Umriss lückenlos (geprüft), s6 nicht alle zwölf verschiedenen.
- **Würfelbau-Blick:** Gebäude wie im Spiel (von vorne rechts oben), dazu die Ansichten oben, vorne, rechts mit Pfeil der
  Blickrichtung, s5 der Bauplan mit Zahlen; ohne Drehen des Gebäudes.
- **Netz-Falter:** Netz links Fläche um Fläche, rechts der Körper — statt eines Falt-Films (im Bild ohne Raum nicht
  sauber zu zeigen): Würfelnetze, s3 Gegenflächen gleich gefärbt, s4 Spielwürfel (1 + 6 = 2 + 5 = 3 + 4 = 7, gefaltet
  1 oben, 2 vorne, 3 rechts wie im Würfel-Kipper), s5 Quader in den Farben seiner Gegenflächen, s6 Pyramide.
- **Rechteck-Labor:** Rechtecke der Stufen (4 · 3 = 12 cm², Umfang 16 cm, beides, alle mit 24 cm² ausser 1 × 24, s5 und
  s6 gleicher Umfang, das Quadrat mit der grössten Fläche leuchtet) statt nur Umfang 12, 16 und 20.
- **Würfel-Kipper:** Wegkarte von oben und der Spielwürfel im Schrägbild wie im Spiel nach jedem Kipp (Kippregel und
  Startlage des Spiels); s1 die Gegenseiten (1 + 6 = 7), s6 ein Weg mit der 6 oben (nachgerechnet).
- **Begriffs-Geodreieck:** Figuren der Stufen statt eines Hauses: Rechteck mit Ecken und Diagonale und Kreis mit
  Mittelpunkt, Sechseck mit Diagonalen, Radius und Durchmesser, Parallele und Senkrechte mit rechten Winkeln,
  Schnittpunkt der Diagonalen, Quadrat (Diagonalen senkrecht, gleich lang, halbiert), s6 alles.
- **Merk-Blick:** was das Spiel fragt statt eines Fotoalbums: fehlt (3 und 4 Dinge), neu (6), Platztausch (7), eine Form
  dreht sich (9 Formen), s6 eine dreht sich und eine färbt sich um (12 Formen); Bildzeichen und Formen des Spiels.
- **Würfel-Zähler:** Gebäude im selben Massstab mit Zahl und Zeichen (3 < 5 … 7 < 9 < 12), s4 gleich viele bauen
  (7 = 4 + 3), s5 eine Kiste 3 × 3 × 2, die fehlenden 6 Würfel kommen dazu; ohne Deckel und Schleife.
- **Quader-Volumen:** Schicht um Schicht wie vorgeschlagen (3 · 2 · 2, 4 · 3 · 2 mit den fehlenden Würfeln, 5 cm · 3 cm
  · 2 cm), s4 1 dm³ = 1000 cm³ = 1 l, s5 Quader mit 0.5 m (10 dm³ = 10 l), s6 Aquarium 40 cm · 20 cm · 25 cm füllt sich
  (20 000 cm³ = 20 l).

**Block B — wo das Bild vom Entwurf in Abschnitt 8 abweicht** (die Animation folgt den Stufen des Spiels; zur Abnahme).
Deutsch ohne Lesetext wie Block A; Zeichen nur, wo sie der Inhalt sind (Satzzeichen, Kommas, „ “ : , der wörtlichen
Rede, Fragewörter des Verben-Fächers, hat und ist, Reimschema a und b). Bildzeichen aus den Listen der Spiele. Schmuck
überall 2★ Glanz und 3★ Funken (Hör-Geschichte: Sterne und Sternschnuppe am Nachthimmel).

- **Satz-Reparatur:** je Satz ein Zug aus leeren Wortwagen, gross geschriebene Wörter mit Dach, der Schlusswagen trägt
  das Zeichen: s1 und s2 Punkt (s2 mit Nomen), s3 Fragezeichen, s4 langer Satz, s5 zwei Sätze, s6 drei Sätze mit . ? !
  — statt Lok mit wachsendem Zug.
- **Wörter-Trenner:** die Schlange ohne Lücken wird an den Wortgrenzen geschnitten (orange wie im Spiel), die Wörter
  hängen als Fähnchen, so viele wie die Stufe Wörter hat (3, 4, 5, 7, 10, 16) statt 2 bis 6.
- **Fehler-Lupe:** statt Sand, Muschel und Kristall die Sätze des Spiels mit genau einem Fehler: die Lupe geht Wort um
  Wort, der Fehler leuchtet gelb und wird grün; s4 langer Satz, s6 dazu ein fehlerfreier Satz mit Haken.
- **Komma-Jagd:** statt Netz und Glas die Sätze mit den kleinen Lücken des Spiels, die Kommas fliegen hinein: s1 ein
  Komma, s2 zwei, s3 dazu ein Satz ohne Komma (Haken), s4 Verbgruppe, s5 gemischt, s6 drei Kommas.
- **Rede-Zeichen:** Begleitsatz und Rede als Kästchen wie im Spiel statt Sprechblasen: s1 die gesprochenen Wörter, s2
  Begleitsatz vorne, s3 hinten (Komma nach dem schliessenden Zeichen), s4 beide, s5 mit Frage und Ausruf, s6 der
  Begleitsatz in der Mitte.
- **Korrektur-Stift:** statt eines Bilds zum Ausmalen der Text im Kasten mit den Fehlern der Stufen (2, 3, 3, 4, 4, 5),
  der Stift verbessert, unten die Zahl.
- **Wortarten-Sortierer:** die drei Körbe des Spiels mit ihren Bildzeichen und Farben; s1 und s2 Wortkarten, ab s3 das
  markierte Wort aus dem Satz, s6 drei Wörter aus einem Satz; die Zahl je Korb (zusammen bis zehn, eine Runde).
- **Nomen-Puzzle:** statt eines Hauses die Bildkarten der Liste: s1 🏠 + 🚪 zusammensetzen, s2 legen, s3 zerlegen, s4 mit
  den Artikeln (das Grundwort bestimmt den Artikel), s5 Fugenlaut (Sonne-n-blume), s6 drei Teile.
- **Zeitreise-Verben:** statt Spuren auf dem Pfad das Zielband des Spiels (Präteritum, Perfekt, Präsens): das gelbe Verb
  reist in seine Zeit, im Perfekt kommt hat oder ist dazu; s5 zur Wahl, s6 zwei Schritte.
- **Verben-Fächer:** die Blätter tragen die Fragen der Stufe (s2 Wer? Wen?, s3 Wem?, s4 alle fünf); s1 wird das Verb im
  Satz gefunden, s5 die Zeitform am Griff; falsche Karten fallen weg.
- **Wortarten-Probe:** je Glas eine Probe des Spiels (🏷️ 👤 📈, ab s5 📋 🔒), genau die passende trifft, darunter die
  Wortart, s6 Partikel: Präposition — statt Gläser zu zählen.
- **Gedicht-Baukasten:** wie vorgeschlagen; s1 mit Lücke im Reimwort, s2 Zweizeiler, s3 gezählt, s4 und s5 geordnet.
- **Gattungs-Kenner:** Bücher mit den Bildzeichen der Gattungen der Stufe (1, 3, 5, 5, 7); s1 mit gut 😇 und böse 😈,
  s6 fällt das Buch hinaus, das nicht passt. s3 und s4 zeigen dieselben fünf Gattungen (s4 übt ihre Merkmale).
- **Hör-Reporter:** statt Publikum die Fragekarten der Stufe (Wer? Wo? … 💡 Schluss, 🔢 Zahl, 🎯 Kern), die Eule mit
  Kopfhörern.
- **Gefühle-Radar:** statt eines Kreises von Kindern der Radarschirm mit den Gesichtern der Liste (Grundgefühle, ab s4
  feine), s6 ein Gefühlspaar.
- **Hör-Geschichte:** statt Tieren die Figuren der Antworten im Spiel am Lagerfeuer; s6 dazu das Buch mit dem Titel.
- **Jahreskreis-Ordner:** statt der vier Jahreszeiten das Rad der Wochentage oder Monate, gerechnet wie die Stufen (Mi
  + 1, Fr + 2, März bis Juli ordnen, November + 5, Di − 10, April + 20); Jahreszeit nur bei den eindeutigen Monaten.
- **Früher und heute:** statt der Telefone die Dinge der Listen des Spiels: s1 Körbe 🕰️ und ✨, s2 und s3 Reihen, s4
  von heute zurück, s5 vor 60 Jahren (1966) ✅ oder ❌, s6 die Reihe zu Fuss bis Flugzeug.
- **Zeitstrahl-Sortierer:** s1 Lebensabschnitte und s2 Generationen ohne Zahlen, ab s3 der Strahl mit Jahreszahlen wie
  im Spiel: Generationen, Alter (2026 − 2016 = 10), Ereignisse, s6 das Jahrhundert (1291 → 13. Jahrhundert).
- **Erdzeit-Leiter:** die Leiter quer und logarithmisch wie im Spiel, die Ereignisse der Liste gleichmässig mit einer
  Linie an ihre Stelle (dicht beieinander wären sie nicht zu lesen); s3 mit Zahlen, s5 die Erdgeschichte als ein Tag
  (die ersten Dinosaurier 22:48 Uhr).
- **Tageslauf-Sonne:** die Tageszeiten der Stufen mit Bildern der Tätigkeiten (s1 Tag und Nacht, s3 alle fünf), s5 der
  Wochenplan (übermorgen), s6 das Bild, das nicht passt.
- **Kulturen-Koffer:** je Kultur ein Fach mit ihrem Zeichen; s4 Gab es das bei den Römern? (Rad, Münzen, Glas ja, Strom
  nein); s6 klappt der Koffer zu.
- **Echt oder erfunden?:** s5 mit dem Merkmal des Erfundenen, s6 Textsorten mit den Bildzeichen der Gattungen (Märchen
  und Fabel erfunden, Bericht echt; die Sage nicht, sie kann einen wahren Kern haben).
- **Gemeinde-Helfer:** die Einrichtungen der Stufen auf dem Dorfplan, s3 mit Notruf 118, s4 mit privatem Betrieb, s5
  Gemeinde, Kanton und Bund als Ringe, s6 der Ablauf zum Spielplatz in fünf Schritten.
- **Schulweg-Profi:** wie vorgeschlagen; der Fussgängerstreifen gelb, s3 ein Auto von links hält an, s4 Lichtsignal am
  Streifen, s5 Velo rechts auf der Strasse.

**Block C — wo das Bild vom Entwurf in Abschnitt 8 abweicht** (die Animation folgt den Stufen des Spiels; zur Abnahme).
Bildzeichen und Farben aus den Spielen (Nordpol rot, Südpol grün; Blut sauerstoffreich rot, arm blau; Braille-Punkte
nach der Tafel), Mengen und Rechnungen nachgerechnet. Schmuck 2★ Glanz, 3★ Funken (Fledermaus-Forscher: Sterne und
Sternschnuppe am Nachthimmel).

- **Magnet-Labor:** s1 Büroklammer und Schraube hängen am Magneten, Holz und Papier bleiben liegen; s2 zwei Stabmagnete
  stossen sich ab (gleiche Pole in der Mitte); s3 der Magnet wirkt durch Papier; s4 die Kompassnadel dreht nach Norden;
  s5 der fehlende Pol wird gesetzt, sie ziehen sich an; s6 ein Elektromagnet — statt einer Kette aus Klammern.
- **Schwimmt oder sinkt?:** die Dinge der Liste des Spiels, was schwimmt, bleibt oben; s5 ein Schiff aus Metall trägt
  die Eule (Stahlschiff schwimmt, eine Frage der Stufe) statt eines Holzschiffchens.
- **Stromkreis-Bauer:** Schaltbild des Spiels; was den Kreis schliesst, kommt zuletzt: s1 Draht, s2 Schalter, s3 ein
  Schlüssel, s4 zwei Lampen in Serie, s5 parallel mit Schalter, s6 drei Lampen in Serie, die mittlere überbrückt bleibt
  dunkel (statt eines Hauses).
- **Hebel-Wippe:** die Wippe des Spiels mit Plätzen 1–5, darunter die Momente (2 · 3 > 2 · 1 …); s5 die Stange mit dem
  Stein (60 · 2 = 20 · 6), s6 knapp 17 > 16 — statt nur gleicher Gewichte.
- **Wassertropfen-Reise:** s1 Eis, Wasser, Dampf bei 0 °C und 100 °C; s2–s4 die Wege des Spiels über Boden und Berg
  (s4 nummeriert); s5 und s6 die Kläranlage — statt eines einzigen Kreislaufs.
- **Energie-Wandler:** Ketten des Spiels mit Energieformen und Wandlern statt eines Stausees mit Dorf; s6 die lange
  Kette Sonne → Pflanze → Muskeln → Velodynamo → LED-Lampe.
- **Bionik-Paare:** wie vorgeschlagen; s3 und s6 mit der Lupe „abgeschaut“.
- **Körper-Puzzle:** statt des Wegs des Apfels in jeder Stufe: s1 und s2 Körperteile und Sinne, s3 Gelenke, s4 Körperteile,
  s5 der Weg der Luft, s6 der Weg des Essens (wie die Liste „wege“).
- **Znüni-Teller:** Körbe wie im Spiel (jeden Tag und ab und zu, Frucht und Gemüse, Gruppen), s4 und s5 die
  ausgewogenen Teller des Spiels, s6 alle sechs Gruppen.
- **Blutkreislauf-Lotse:** s1 die Organe; s2–s6 die Stationen des Kreislaufs der Stufe, das Blut wird in der Lunge rot und
  im Körper wieder blau, s5 und s6 mit Vorhof und Kammer, s6 färben sich die Gefässe erst, wenn das Blut durchfliesst.
  s2 zeigt den Anfang des grossen Kreislaufs (Körper, Hohlvene, Herz) statt des kleinen Bilds mit Kopf und Armen.
- **Braille-Finger:** Buchstaben der Stufen (D gezählt, B, K = A + Punkt 3, M, HUND, EULE mit Finger) statt a bis e.
- **Auge-Entdecker:** wie vorgeschlagen, mit den Teilen der Stufen; s3 die Pupille im Hellen klein, s5 der Schnitt,
  s6 der Lichtweg bis ins Gehirn.
- **Lärm-Wächter:** statt einer Reise des Schalls die Aufgaben der Stufen: s1 laut und leise, s2 die Lärm-Skala, s3 und
  s4 Schutz (Ohrstöpsel hilft gut, Ohren zuhalten etwas), s5 das Ohr, s6 das Echo.
- **Kompass-Spiel:** Plan 6 × 6 des Spiels mit Wegen der Stufen; ab s4 acht Richtungen, s5 und s6 gedrehte Karte (Nordpfeil
  und Nadel zeigen nach Norden der Karte).
- **Plan-Leser:** statt Brücke und Kirche der Quartierplan mit Legende: s1 ein Zeichen finden, s2 zählen, s3–s6 Wege mit
  Massstab und Länge.
- **Teddy-Versteck:** wie vorgeschlagen mit den Plätzen der Stufen (auf, unter, über, in, zwischen, links neben, rechts
  neben); s6 das Regal 3 × 3 statt des Betts.
- **Tier-Sortierer:** Album mit den Körben des Spiels (Haltung, Wirbeltierklassen, Säugetiergruppen) statt Heimtiere,
  Wildtiere, …; s5 und s6 die kniffligen Tiere (Fledermaus kein Vogel, Wal kein Fisch, Spinne kein Insekt).
- **Lebensraum-Zuordnung:** s1–s3 die Lebensräume der Stufen mit ihren Tieren, s4 eine Nahrungskette, s5 und s6
  Nahrungsnetze (die Feldmaus fressen Fuchs und Waldkauz) — nur Tiere mit Bildzeichen.
- **Fledermaus-Forscher:** s1 Echo, s2 Jagd, s3 Wochenstube, s4 das Jahr im Kreis, s5 Anpassungen, s6 das Jahr ohne
  Jahreszeit — nach den Themen der Stufen.
- **Lebenszyklus-Puzzle:** Zyklen des Spiels: s1 Huhn, s2 Sonnenblume, s3 Geburt in den Körben, s4 Schmetterling, s5
  Marienkäfer, s6 Frosch (statt nur des Froschs).
- **Pflanzen-Bestimmer:** s1 Laub- und Nadelbaum, s2 Blattformen, s3 Rand und Stellung, s4 Bestimmungsschlüssel, s5 und
  s6 die Blüte im Schnitt mit den Teilen (statt Samen bis Wiese).
- **Wetter und Jahreszeiten:** s1 der Baum durchs Jahr, s2 und s3 Thermometer der Stufen mit Wettersymbol und Kleidung, s4
  Wetterbericht, s5 und s6 Unterschied Morgen und Mittag (s6 über null).
- **Taschengeld-Planer:** Aufgaben der Stufen statt Münzen zählen: reicht es, Rest, Wochenbudget, sparen (7 Wochen),
  Bedarf und Wunsch, Packungen vergleichen.
- **Kakao-Weg:** die acht Schritte des Wegs der Schoggi auf einer Karte (Westafrika, Meer, Schweiz), s3 mit fehlendem
  Schritt und wer ihn macht, s4 Herkunft, s5 der Kreislauf Haushalte und Unternehmen.

## 8. Ideen je Spiel

Entwurf je Spiel (Muster, Folge der sechs Stufen, Zusatz bei 2 und 3 Sternen), entworfen nach den Regeln in
Abschnitt 3 und von Hand durchgesehen (Himmels-Forscher und Speicher-Leiter an den Inhalt des Spiels angepasst).
Viele SAMMELN-Ideen sind bewusst schlicht; sie sind Platzhalter, bis ein Spiel ein besseres Bild bekommt.

### Mathe

| Spiel | Muster | s1 → s6 | Sterne |
|---|---|---|---|
| 🔍 Stellen-Detektiv | REISE | s1 Lupe leuchtet E, Z, H an · s2 wandert nach links zu T · s3 zu ZT · s4 zu HT · s5 zu M · s6 alle sieben Stellen einer Million leuchten von rechts nach links auf (Stellenfarben) | 2★ Lupe blinkt · 3★ Eule zieht den Detektivhut, Funken |
| 🧱 Zahlen-Baukasten | BAUEN | s1 Turm aus Einerwürfeln und Zehnerstangen · s2 + Hunderterplatte · s3 + Tausenderwürfel · s4 + ZT-Stange aus 10 Tausenderwürfeln · s5 + HT · s6 Turm bis zur Million (Stellenfarben) | 2★ Kran setzt den letzten Stein · 3★ Fähnchen auf der Spitze |
| 📮 Tabellen-Post | SAMMELN | s1 Briefe fallen in die Fächer E, Z, H · s2 + Fach T · s3 + ZT · s4 + HT · s5 + M · s6 alle Fächer voll, jede Ziffer im Fach ihrer Stelle (Stellenfarben) | 2★ Postsack winkt · 3★ Eule stempelt, Konfetti |
| 🃏 Ziffernkarten | BAUEN | s1 Karten legen sich zu einer 3-stelligen Zahl · s2 4-stellig · s3 5-stellig (mit schmalem Leerzeichen) · s4 6-stellig · s5 7-stellig · s6 grösste Zahl aus den Karten, Karten drehen sich der Reihe nach um | 2★ Karten fächern sich · 3★ Karten springen hoch, Funken |
| 🐸 Zahlen-Hüpfer | REISE | s1 Frosch hüpft in 1er-Schritten über Seerosen · s2 2er · s3 10er · s4 100er · s5 1000er · s6 vor und zurück in 1000er-Schritten bis ans Ufer; jede Seerose trägt die richtige Zahl | 2★ Libelle fliegt mit · 3★ Frosch hüpft im Bogen, Wasserringe glitzern |
| 🔐 Zahlenrätsel-Tresor | SAMMELN | s1 Tresor öffnet sich, eine Münze · s2 zwei Münzen · s3 kleine Krone · s4 Perlenkette · s5 Edelstein · s6 voller Tresor glänzt, Eule schaut hinein | 2★ Tresorrad dreht eine Ehrenrunde · 3★ Edelsteine funkeln |
| ⚪ Punkte-Schieber | SAMMELN | s1 Punkte rollen in die Spalten E, Z, H · s2 + T · s3 + ZT · s4 + HT · s5 + M · s6 alle Spalten gefüllt, höchstens 9 Punkte je Spalte, Stellenfarben | 2★ Punkte hüpfen einmal · 3★ Punkte tanzen im Kreis, Funken |
| ⚡ Einmaleins-Blitz | WACHSEN | Blumenbeet in Reihen: s1 2 × 3 = 6 · s2 2 × 5 = 10 · s3 5 × 6 = 30 · s4 7 × 8 = 56 · s5 9 × 9 = 81 · s6 30 × 7 = 210 als drei Zehnerblöcke je Reihe | 2★ Schmetterling landet · 3★ alle Blumen öffnen sich, Funken |
| 🚀 Rechen-Rakete | REISE | s1 Rakete umrundet die Erde · s2 fliegt zum Mond · s3 zum Mars · s4 zum Jupiter · s5 zum Saturn mit Ringen · s6 hinter Neptun bis zum Rand des Sonnensystems | 2★ Schweif aus Sternenstaub · 3★ Eule winkt aus dem Fenster, Funkenregen |
| 🛝 Runden-Rutsche | REISE | s1 Kugel rutscht auf den nächsten Zehner (bis 100) · s2 Zehner bis 1000 · s3 Hunderter · s4 Tausender · s5 Zehntausender · s6 Hunderttausender; Kugel landet immer auf der richtig gerundeten Zahl | 2★ Kugel macht einen Looping · 3★ Fähnchen am Ziel |
| 🎯 Zahlenstrahl-Pfeil | ZOOM | Pfeil trifft die Zahl auf dem Strahl: s1 bis 100 · s2 bis 1000 · s3 bis 10 000 · s4 bis 100 000 · s5 bis 1 000 000 · s6 1 000 000 auf den Tausender genau, Strahl zoomt hinein | 2★ Pfeil zittert und glänzt · 3★ Ringe um den Treffer, Funken |
| 🔢 Hundertertafel-Detektiv | SAMMELN | s1 Felder 1–20 leuchten · s2 1–50 · s3 ganze Tafel 1–100 · s4 Tafel wird erste Seite des Tausenderbuchs · s5 fünf Seiten bis 500 · s6 alle zehn Seiten bis 1000 | 2★ Eule blättert eine Seite · 3★ Buch klappt zu, Funken |
| 🧱 Zahlenmauer-Baumeister | BAUEN | s1 Mauer mit 2 Reihen · s2 3 Reihen · s3 4 Reihen · s4 5 Reihen · s5 grössere Zahlen · s6 6 Reihen; jeder Stein ist die Summe der beiden darunter | 2★ Eule setzt sich oben drauf · 3★ Fähnchen auf dem Deckstein |
| 🍪 Rest-Rätsel | SAMMELN | Guetzli auf Teller: s1 7 : 2 = 3 Rest 1 · s2 10 : 3 = 3 Rest 1 · s3 17 : 5 = 3 Rest 2 · s4 29 : 4 = 7 Rest 1 · s5 50 : 6 = 8 Rest 2 · s6 100 : 7 = 14 Rest 2; Rest liegt im Glas | 2★ Glas mit dem Rest glänzt · 3★ Eule zählt nach und nickt, Funken |
| 🍕 Bruch-Pizzeria | BAUEN | Pizza wird belegt: s1 Halbe · s2 Viertel · s3 Achtel · s4 Drittel und Sechstel · s5 1/2 = 2/4 = 4/8 (Erweitern) · s6 6/8 wird zu 3/4 (Kürzen); alle Stücke gleich gross | 2★ Dampf steigt auf · 3★ Eule serviert, Funken |
| 🐶 Teiler-Spürnase | SAMMELN | Hund schnuppert und findet: s1 Vielfache von 2 bis 20 · s2 von 5 bis 50 · s3 von 3 bis 30 · s4 Teiler von 12 · s5 Teiler von 36 · s6 Primzahlen bis 50 leuchten | 2★ Hund wedelt · 3★ Hund dreht sich, Knochen-Fähnchen |
| 📡 Überschlags-Radar | ZOOM | Radar wird schärfer: s1 Ergebnis auf den Zehner · s2 Hunderter · s3 Tausender · s4 Stellenzahl erkannt · s5 grosse Zahlen · s6 falsche Rechnung fällt heraus, richtige bleibt im Kreuz | 2★ Radar piept fröhlich · 3★ Radarkreise leuchten auf |
| 🏰 Mittelwert-Türme | BAUEN | Türme gleichen sich aus: s1 3 und 5 → 4, 4 · s2 2, 4, 6 → 4 · s3 1, 3, 5, 7 → 4 · s4 fünf Türme · s5 sechs Türme · s6 fehlender Turm wächst, bis der Mittelwert stimmt | 2★ Fähnchen auf dem höchsten Turm · 3★ alle Türme mit Fähnchen |
| 🚲 Velo-Tabelle | REISE | s1 Velo fährt 1 km · s2 2 km · s3 5 km · s4 10 km · s5 zwei Velos, das schnellere ist in gleicher Zeit weiter · s6 Etappe mit Pause, Strecke und Zeit passen zur Tabelle | 2★ Klingel läutet · 3★ Zielband flattert, Fähnchen |
| 🕰️ Uhr-Werkstatt | ZYKLUS | s1 Zeiger auf volle Stunde · s2 halbe Stunde · s3 Viertel · s4 5 Minuten · s5 auf die Minute · s6 Stundenzeiger dreht zweimal herum: ein ganzer Tag (24 h) | 2★ Kuckuck-Eule ruft einmal · 3★ Zahnräder glänzen, Funken |
| 🏪 Kiosk-Kasse | SAMMELN | Kasse füllt sich: s1 10 und 20 Rp. · s2 50 Rp. · s3 1 Fr. · s4 2 und 5 Fr. · s5 10-Fr.-Note · s6 volle Kasse bis 100 Fr.; nur Wert auf der Münze, keine echten Notenbilder | 2★ Kasse klingelt · 3★ Münzen glänzen, Fähnchen |
| 📏 Masse-Umwandler | BAUEN | Messband wächst: s1 10 mm = 1 cm · s2 100 cm = 1 m · s3 1000 g = 1 kg · s4 1000 ml = 1 l · s5 1000 m = 1 km · s6 Messband, Waage und Krug stehen nebeneinander | 2★ Messband rollt sich ein · 3★ Eule misst sich selbst, Funken |
| 🪞 Spiegel-Raster | BAUEN | Mosaik an der Achse: s1 Quadrat gespiegelt · s2 L-Form · s3 Schmetterling · s4 schräge Form · s5 Form verschoben · s6 zwei Achsen, vier gleiche Teile; jedes Kästchen am richtigen Spiegelplatz | 2★ Spiegel glänzt · 3★ Schmetterling flattert, Funken |
| 🏴‍☠️ Koordinaten-Schatzsuche | KARTE | Eule geht im Raster, erst nach rechts, dann nach oben: s1 (1∣1) · s2 (2∣3) · s3 (3∣7) · s4 (5∣4) · s5 (8∣6) · s6 über drei Punkte zur Truhe bei (9∣9) | 2★ Truhe öffnet sich · 3★ Edelsteine funkeln |
| 🐊 Vergleichs-Krokodil | REISE | Krokodil schwimmt den Fluss entlang, Maul offen zur grösseren Zahl: s1 bis 20 · s2 bis 100 · s3 bis 1000 · s4 bis 10 000 · s5 bis 1 000 000 · s6 lange Reihe, alle Zeichen richtig | 2★ Krokodil lächelt · 3★ Seerosen blühen, Funken |
| 🔟 Zehner-Ergänzer | BAUEN | Turm wird ergänzt: s1 7 + 3 = 10 · s2 37 + 3 = 40 · s3 65 + 35 = 100 · s4 365 + 635 = 1000 · s5 820 + 180 = 1000 · s6 3650 + 6350 = 10 000 (Stellenfarben) | 2★ Deckel klickt auf · 3★ Fähnchen oben |
| ⚡ Punkte-Blitz | SAMMELN | s1 Würfelbilder 1–6 · s2 Zehnerfeld voll (10) · s3 zwei Zehnerfelder (20) · s4 Zehnerstangen bis 50 · s5 zehn Stangen = 100 · s6 Hunderterplatte und Stangen; Einer rot, Zehner blau, Hunderter grün | 2★ Punkte blinken · 3★ Punkte springen wie Funken |
| 🏠 Zahlenhaus | BAUEN | Haus wächst: s1 Dach 5, 2 Stockwerke · s2 Dach 7 · s3 Dach 10 · s4 Dach 15 · s5 Dach 20 · s6 Dach 100, sechs Stockwerke; jedes Stockwerk zerlegt richtig (7 = 3 + 4) | 2★ Licht in allen Fenstern · 3★ Eule winkt vom Dach |
| 🪞 Doppel-Spiegel | WACHSEN | Spiegel verdoppelt: s1 2 → 4 · s2 5 → 10 · s3 25 → 50 · s4 75 → 150 · s5 250 → 500 · s6 500 → 1000, und zurück halbiert | 2★ Spiegel funkelt · 3★ zwei Eulen winken sich zu |
| ⚖️ Zahlen-Waage | BAUEN | Waage bleibt gerade: s1 3 = 3 · s2 2 + 2 = 4 · s3 8 + 5 = 6 + 7 · s4 9 + 6 = 10 + 5 · s5 25 + 25 = 40 + 10 · s6 70 + 30 = 55 + 45 | 2★ Waage wippt sanft · 3★ Schalen glänzen, Funken |
| 🔁 Muster-Fortsetzer | BAUEN | Perlenkette wächst (Deko-Farben): s1 AB AB · s2 ABB ABB · s3 ABC ABC · s4 1, 3, 5, 7 · s5 1, 4, 9, 16 als Punkt-Quadrate · s6 1, 4, 9, 16, 25 | 2★ Kette schwingt · 3★ Kette glitzert, Funken |
| 🔺 Formen-Detektiv | BAUEN | Haus aus Formen: s1 Quadrat · s2 + Dreieck-Dach · s3 + Kreis-Fenster · s4 + Rechteck-Tür · s5 Würfel daneben (8 Ecken, 12 Kanten) · s6 Haus mit Symmetrieachse gespiegelt | 2★ Rauch aus dem Kamin · 3★ Fähnchen auf dem Dach |
| 📏 Schätz-Waage | BAUEN | Reihe von leicht zu schwer: s1 Feder · s2 + Apfel · s3 + Buch · s4 + Katze · s5 + Kind · s6 + Kuh; die Waage neigt sich immer zur schwereren Seite | 2★ Waage wippt · 3★ Eule landet sanft auf der Feder-Seite, Funken |
| 🟩 Flächen-Pixel | BAUEN | Mosaik füllt sich: s1 4 Häuschen · s2 8 · s3 12 · s4 20 · s5 zwei Flächen gleich gross · s6 Umfang-Linie läuft einmal ganz herum | 2★ Mosaik leuchtet · 3★ Kästchen hüpfen, Funken |
| 📖 Rechengeschichten | SAMMELN | Bilderbuch füllt sich: s1 2 + 1 Äpfel · s2 3 + 2 Vögel · s3 8 − 3 Ballone · s4 4 × 2 Räder · s5 12 : 3 Kuchenstücke · s6 Buch mit sechs Seiten klappt auf | 2★ Seiten blättern · 3★ Eule liest, Funken |
| 🔎 Daten-Detektiv | WACHSEN | s1 Strichliste wächst · s2 Tabelle füllt sich · s3 Säulen wachsen · s4 höchste Säule glänzt · s5 Differenz zweier Säulen leuchtet · s6 ganzes Diagramm passt zur Strichliste | 2★ Säulen wippen · 3★ Fähnchen auf der höchsten Säule |
| 🧾 Preis-Tabelle | SAMMELN | Korb füllt sich, Preis wächst: s1 1 Stück 2.40 Fr. · s2 2 Stück 4.80 Fr. · s3 5 Stück 12.00 Fr. · s4 10 Stück 24.00 Fr. · s5 rückwärts 12.00 Fr. : 5 · s6 volle Tabelle (Geld über LS.geldText) | 2★ Kassenzettel rollt · 3★ Korb glänzt, Funken |
| 🛠️ Schriftlich-Werkstatt | BAUEN | Stellen füllen sich von rechts: s1 E · s2 Z · s3 H mit Übertrag (457 + 368 = 825) · s4 T · s5 ZT · s6 HT; Übertrag hüpft je eine Stelle nach links (Stellenfarben) | 2★ Werkzeug klappert · 3★ Eule zieht den Strich, Funken |
| ✖️ Malkreuz | BAUEN | Rechteck aus Teilen: s1 2 × 7 · s2 12 × 7 · s3 23 × 7 = 140 + 21 = 161 · s4 48 × 6 · s5 23 × 17 · s6 34 × 26 = 600 + 180 + 80 + 24 = 884 | 2★ Teile schieben sich zusammen · 3★ Rechteck glänzt, Funken |
| 🕵️ Rechentrick-Detektiv | SAMMELN | Werkzeugkasten füllt sich: s1 Tauschen · s2 Verdoppeln · s3 Halbieren · s4 Zusammenfassen · s5 Nachbaraufgabe · s6 voller Kasten klappt zu (Werkzeugbilder, kein Text) | 2★ Lupe glänzt · 3★ Eule tippt an den Hut, Funken |
| ⚙️ Rechen-Maschine | BAUEN | Maschine bekommt Zahnräder: s1 ein Rad · s2 zwei · s3 drei · s4 vier · s5 fünf · s6 Zahl läuft durch (5 → 10 → 7) und zurück; benachbarte Räder drehen gegenläufig | 2★ Lämpchen leuchtet · 3★ Dampfwölkchen und Funken |
| 🎯 Zielzahl-Jagd | ZOOM | Pfeil trifft Zielscheibe: s1 äusserer Ring · s2 nächster · s3 mittlerer · s4 innerer · s5 kleiner Kern · s6 genau die Mitte, dort steht die Zielzahl | 2★ Scheibe dreht sich · 3★ Ringe leuchten auf, Funken |
| 🧩 Möglichkeiten-Finder | SAMMELN | Kleiderschrank füllt sich mit allen Kombinationen: s1 1 Hose × 2 Shirts = 2 · s2 2 × 2 = 4 · s3 2 × 3 = 6 · s4 3 × 3 = 9 · s5 3 × 4 = 12 · s6 2 × 3 × 4 = 24 mit Hüten | 2★ Eule probiert ein Outfit · 3★ Spiegel glänzt, Funken |
| 🧩 Pentomino-Puzzle | BAUEN | Umriss füllt sich: s1 2 Vierlinge · s2 4 Vierlinge · s3 3 Pentominos · s4 6 Pentominos · s5 9 Pentominos · s6 alle 12 Pentominos im 6 × 10-Rechteck (gültige Lösung) | 2★ Teile rasten ein · 3★ Rechteck glänzt, Funken |
| 🧊 Würfelbau-Blick | BAUEN | Würfelgebäude wächst: s1 3 Würfel · s2 6 · s3 10 · s4 Treppe · s5 Turm mit Anbau · s6 Gebäude dreht sich, Ansicht vorne, rechts, oben passt | 2★ Schatten zeigt die Ansicht · 3★ Fähnchen auf dem Turm |
| 📦 Netz-Falter | BAUEN | Netz faltet sich zu: s1 Würfel · s2 Quader · s3 Dreiecksprisma · s4 Pyramide mit quadratischer Grundfläche · s5 Würfel mit Augen, Gegenseiten ergeben 7 · s6 alle Körper als Geschenkschachteln | 2★ Schleife auf der Schachtel · 3★ Deckel springt auf, Funken |
| 🔎 Zehntel-Lupe | ZOOM | Lupe zoomt auf den Strahl: s1 Ganze · s2 Halbe · s3 Zehntel · s4 Zehntel in Schritten · s5 Hundertstel · s6 Hundertstel ganz genau, Marienkäfer sitzt auf dem Punkt (Zeichen über LS.dezimalText) | 2★ Lupe glänzt · 3★ Marienkäfer fliegt eine Runde, Funken |
| 🚀 Dezimal-Rakete | ZOOM | Landung auf dem Zahlenstrahl-Planeten: s1 auf die Ganze · s2 auf den Zehntel · s3 Zehntel, engerer Platz · s4 auf den Hundertstel · s5 Hundertstel, kleinster Platz · s6 auf den Tausendstel genau | 2★ Landebeine federn · 3★ Eule steigt aus, Fähnchen, Funken |
| 🎢 Dezimal-Rutsche | REISE | Wagen rollt zur gerundeten Zahl: s1 auf Ganze · s2 auf Ganze bei x.5 aufwärts · s3 auf Zehntel · s4 auf Zehntel bei längeren Zahlen · s5 auf Hundertstel · s6 drei Rundungen nacheinander | 2★ Wagen macht eine Welle · 3★ Fähnchen am Ziel |
| 🍫 Schoggi-Brüche | BAUEN | Schoggitafel aus 12 Stücken: s1 1/2 · s2 1/4 + 1/4 · s3 1/2 + 1/4 = 3/4 · s4 1/3 + 1/6 = 1/2 · s5 2/3 − 1/4 = 5/12 · s6 ganze Tafel 12/12 | 2★ Silberpapier glänzt · 3★ Eule teilt, Funken |
| ✅ Probe-Stempel | SAMMELN | Heft bekommt Stempel: s1 ein Häkchen · s2 zwei · s3 Umkehraufgabe · s4 Überschlag · s5 Endziffer · s6 ganze Seite gestempelt | 2★ Stempel wird farbig · 3★ Eule stempelt im Takt, Funken |
| 🎲 Zufalls-Skala | SAMMELN | Skala füllt sich: s1 Säckchen nur blau: blau ist sicher · s2 kein Rot: rot ist unmöglich · s3 halb-halb: Mitte · s4 Würfel: 6 ist möglich · s5 Würfel: 7 ist unmöglich · s6 Glücksrad zu 3/4 grün | 2★ Würfel rollt aus · 3★ Glücksrad leuchtet, Funken |
| 📐 Rechteck-Labor | BAUEN | Rechtecke mit Umfang 12: s1 1 × 5 (Fläche 5) · s2 2 × 4 (8) · s3 3 × 3 (9) · s4 Umfang 16 · s5 Umfang 20 · s6 grösste Fläche ist jeweils das Quadrat, es leuchtet | 2★ Gummiband schnalzt sanft · 3★ Quadrat glänzt, Funken |
| ⚀ Würfel-Kipper | REISE | Würfel kippt über einen Pfad: s1 1 Kipp · s2 2 · s3 3 · s4 4 · s5 5 · s6 6 Kipps bis ins Ziel; oben immer die richtige Augenzahl, Gegenseiten ergeben 7 | 2★ Würfel hüpft · 3★ Ziel-Fähnchen, Funken |
| 📏 Begriffs-Geodreieck | BAUEN | Figur entsteht: s1 Strecke · s2 Parallele · s3 Senkrechte mit rechtem Winkel · s4 Rechteck mit Diagonale · s5 Kreis mit Radius · s6 Haus aus allem zusammen | 2★ Geodreieck dreht sich · 3★ Linien leuchten nach, Funken |
| 🪜 Flächenmass-Treppe | BAUEN | Treppe steigt, jede Stufe × 100: s1 mm² → cm² · s2 cm² → dm² · s3 dm² → m² · s4 m² → a · s5 a → ha · s6 ha → km² | 2★ Eule steigt eine Stufe · 3★ Fähnchen oben |
| 🧺 Sortier-Kiste | SAMMELN | Klötze springen in Kisten: s1 nach Farbe · s2 + Form · s3 + Grösse · s4 Zahl je Kiste erscheint · s5 Kisten nebeneinander verglichen · s6 alle Kisten voll, richtig sortiert | 2★ Kisten wippen · 3★ Deckel öffnen sich, Fähnchen |
| ⚖️ Gegenteil-Wippe | SAMMELN | Paare kommen aufs Regal: s1 gross–klein · s2 dick–dünn · s3 lang–kurz · s4 schwer–leicht (Wippe neigt sich zur schweren Seite) · s5 hoch–tief · s6 alle Paare nebeneinander | 2★ Wippe schaukelt · 3★ Paare winken sich zu, Funken |
| 👀 Merk-Blick | SAMMELN | Fotoalbum füllt sich: s1 ein Bild · s2 zwei · s3 drei · s4 vier · s5 fünf · s6 sechs Bilder, Eule klappt es zu | 2★ Kamera blitzt sanft · 3★ Album glänzt, Funken |
| 🖐️ Finger-Zähler | SAMMELN | Finger strecken sich: s1 3 · s2 5 · s3 7 (5 + 2) · s4 10 · s5 zwei Kinder, 20 Finger · s6 zehn Paar Hände, 100 Finger | 2★ Hände winken · 3★ Hände klatschen, Funken |
| 🍪 Gerecht-Teiler | SAMMELN | Guetzli verteilen sich gleich: s1 2 Teller je 2 · s2 2 je 3 · s3 2 je 5 · s4 3 Teller je 4 · s5 4 Teller je 5 · s6 6 Teller je 6 | 2★ Teller glänzen · 3★ Eule lädt alle ein, Funken |
| 🧭 Sachaufgaben-Kompass | KARTE | Kompass führt über die Karte: s1 Angabe finden · s2 zweite Angabe · s3 Rechenweg · s4 Zwischenhalt · s5 Ergebnis · s6 Ziel mit Ergebnis und Einheit | 2★ Nadel zittert · 3★ Fähnchen am Ziel |
| 🚆 Fahrplan-Rechner | REISE | Zug fährt, Uhr läuft mit: s1 eine Station · s2 zwei · s3 mit Umsteigen · s4 90 Minuten = 1 h 30 min · s5 lange Fahrt · s6 über Mitternacht: 23:59 → 00:00 (erfundene Stationen) | 2★ Zug pfeift · 3★ Winken am Bahnsteig, Funken |
| 📏 Komma-Messband | ZOOM | Messband zoomt: s1 2 m · s2 2.4 m · s3 2.45 m · s4 2.457 m = 2457 mm · s5 1.250 kg = 1250 g · s6 0.75 l = 7.5 dl (Zeichen über LS.dezimalText) | 2★ Messband rollt ein · 3★ Eule misst sich selbst, Funken |
| 🌉 Prozent-Brücke | BAUEN | Brücke bekommt Pfeiler: s1 1/2 = 0.5 = 50 % · s2 1/4 = 25 % · s3 3/4 = 75 % · s4 1/5 = 20 % · s5 1/10 = 10 % · s6 1/1 = 100 %, Eule läuft hinüber | 2★ Geländer leuchtet · 3★ Fähnchen an beiden Enden |
| 🔟 Stufenzahl-Schieber | REISE | Komma hüpft: s1 3.5 × 10 = 35 · s2 3.5 × 100 = 350 · s3 3.5 × 1000 = 3500 · s4 35 : 10 = 3.5 · s5 35 : 100 = 0.35 · s6 hin und zurück (Zeichen über LS.dezimalText) | 2★ Komma winkt · 3★ Ziffern tanzen, Funken |
| 🤔 Stimmt immer? | SAMMELN | Mosaik füllt sich: s1 ein Stein · s2 zwei · s3 drei · s4 vier · s5 fünf · s6 sechs Steine, Mosaik zeigt eine Eule | 2★ Mosaik glänzt · 3★ Mosaik-Eule zwinkert, Funken |
| ❔ Platzhalter-Geschichten | SAMMELN | Fragezeichen-Karten drehen sich um: s1 7 + ? = 12 → 5 · s2 ? − 4 = 9 → 13 · s3 6 × ? = 42 → 7 · s4 ? : 5 = 8 → 40 · s5 zwei Schritte · s6 ganze Geschichte gelöst | 2★ Karte glänzt · 3★ Karten fliegen hoch, Funken |
| ⏱️ Zeit-Schätzer | ZYKLUS | s1 Sekundenzeiger macht einen Schritt · s2 Sekundenzeiger einmal ganz herum: 1 Minute · s3 Minutenzeiger einmal herum: 1 Stunde · s4 Sonne geht auf und unter: 1 Tag · s5 7 Tage · s6 Jahreszeiten: 1 Jahr | 2★ Sanduhr dreht sich · 3★ Eule schaut auf die Uhr, Funken |
| 🧱 Würfel-Zähler | BAUEN | Kiste füllt sich mit Würfeln: s1 2 · s2 2 × 2 = 4 · s3 2 × 2 × 2 = 8 · s4 3 × 3 × 2 = 18 · s5 3 × 3 × 3 = 27 · s6 4 × 4 × 4 = 64 | 2★ Deckel klappt zu · 3★ Schleife auf der Kiste |
| 🗃️ Quader-Volumen | BAUEN | s1 3 Würfel in einer Reihe · s2 Schicht 3 × 2 = 6 · s3 3 × 2 × 2 = 12 · s4 4 × 3 × 2 = 24 · s5 10 × 10 × 10 = 1000 cm³ = 1 dm³ · s6 1 dm³ füllt sich mit Wasser: 1 Liter | 2★ Wasser glitzert · 3★ Eule taucht den Finger ein, Funken |
| 🥧 Diagramm-Wahl | WACHSEN | Sonnenblume wächst, Diagramme zeigen es: s1 Säule · s2 mehrere Säulen · s3 Linie steigt · s4 Linie über Wochen · s5 Kreis füllt sich bis 100 % · s6 alle drei Diagramme nebeneinander | 2★ Biene besucht die Blüte · 3★ Blüte öffnet sich, Funken |

### Deutsch

| Spiel | Muster | s1 → s6 | Sterne |
|---|---|---|---|
| 🧺 Wortarten-Sortierer | SAMMELN | Bildkarten in drei Körbe (Ding, Tun, Wie): s1 je eine · s2 je zwei · s3 je drei · s4 je vier · s5 je fünf · s6 alle Körbe voll | 2★ Körbe wippen · 3★ Bänder an den Körben |
| ✏️ Regel-Lücke | BAUEN | Steg über den Bach: s1 1 Lücke geschlossen · s2 2 · s3 3 · s4 4 · s5 5 · s6 Steg vollständig, Eule läuft hinüber | 2★ Fisch springt · 3★ Fähnchen am Ufer |
| 🔧 Satz-Reparatur | BAUEN | Zug wird gekoppelt: s1 grosse Lok + 1 Wagen · s2 + 2 Wagen · s3 Schlusswagen mit Punkt · s4 längerer Zug · s5 Schlusswagen mit ? · s6 Schlusswagen mit !, Zug fährt ab | 2★ Dampfwölkchen · 3★ Fähnchen am Schlusswagen |
| ✂️ Wörter-Trenner | SAMMELN | Lange Papierschlange wird an den Wortgrenzen zu Fähnchen: s1 2 Fähnchen · s2 3 · s3 4 · s4 5 · s5 6 · s6 Girlande hängt quer über dem Bild | 2★ Girlande schwingt · 3★ Konfetti |
| ⌨️ Tipp-Trainer | REISE | Eule läuft über die Tasten (ohne Beschriftung): s1 halbe Grundreihe · s2 ganze Grundreihe · s3 obere Reihe · s4 untere Reihe · s5 Umschalttaste hebt die Eule hoch · s6 Lichtwelle über die ganze Tastatur | 2★ Tasten klicken · 3★ Leertaste wird Sprungbrett, Funken |
| 👏 Silben-Klatscher | AUFTRITT | s1 Eule klatscht allein · s2 + Hase · s3 + Igel · s4 + Maus · s5 + Fuchs · s6 ganzer Kreis klatscht im Takt | 2★ Klatschfunken · 3★ alle verbeugen sich, Konfetti |
| 🎵 Reim-Paare | SAMMELN | Paare springen zusammen: s1 Maus–Haus · s2 Fisch–Tisch · s3 Hose–Rose · s4 Kanne–Tanne · s5 Hund–Mund · s6 Schnecke–Decke, alle Paare tanzen | 2★ Paare drehen sich · 3★ Herzchen und Funken |
| 🔤 ABC-Sortierer | REISE | Eule hüpft über einen Pfad aus 26 Steinen (ohne Buchstaben): s1 bis Stein 4 · s2 bis 8 · s3 bis 13 · s4 bis 18 · s5 bis 22 · s6 alle 26 Steine | 2★ Steine leuchten nach · 3★ Fähnchen am letzten Stein |
| 🎣 Anlaut-Angel | SAMMELN | Eule angelt Bildfische in den Eimer: s1 1 · s2 2 · s3 3 · s4 4 · s5 5 · s6 6 Fische, Eimer voll | 2★ Wasserringe · 3★ Fische springen im Bogen, Funken |
| 🔡 Buchstaben-Zwillinge | SAMMELN | Sockenpaare an der Wäscheleine: s1 1 Paar · s2 2 · s3 3 · s4 4 · s5 5 · s6 6 Paare, Leine voll | 2★ Wind bläht die Socken · 3★ Wäscheklammern tanzen, Funken |
| ⚡ Blitzlesen | SAMMELN | Laternenkette leuchtet auf: s1 1 Laterne · s2 2 · s3 3 · s4 4 · s5 5 · s6 6, ganze Kette leuchtet | 2★ Laternen schaukeln · 3★ Glühwürmchen fliegen um die Kette |
| 🧩 Nomen-Puzzle | BAUEN | Haus wird zusammengesetzt: s1 Haus · s2 + Haustür · s3 + Dachfenster · s4 + Gartenzaun · s5 + Blumentopf · s6 + Briefkasten, fertiges Haus | 2★ Licht im Fenster · 3★ Rauch und Fähnchen |
| 🕵️ Lese-Detektiv | ZOOM | Lupe über einem Wimmelbild: s1 grosses Haus · s2 Fenster · s3 Katze im Fenster · s4 Halsband · s5 Glöckchen · s6 Marienkäfer auf dem Glöckchen | 2★ Lupe glänzt · 3★ Marienkäfer fliegt los, Funken |
| 🌳 Wortfamilien-Baum | WACHSEN | s1 Stamm wächst · s2 erster Ast · s3 drei Äste · s4 Blätter · s5 Blüten · s6 Früchte, Eule setzt sich in die Krone | 2★ Blätter rascheln · 3★ Vögel singen, Blüten fallen sanft |
| ⏳ Zeitreise-Verben | REISE | Eule spaziert auf einem Pfad, ihre Spuren bleiben hinter ihr: s1 ein Schritt · s2 zwei · s3 drei · s4 vier · s5 fünf · s6 ganzer Pfad mit Spuren bis zur Bank | 2★ Sanduhr dreht sich · 3★ Fähnchen an der Bank |
| 🔍 Fehler-Lupe | ZOOM | Lupe sucht im Sand: s1 Stein · s2 Muschel · s3 Muster der Muschel · s4 Kristall · s5 Kristallkante · s6 winziger Funkelpunkt | 2★ Kristall glänzt · 3★ Regenbogen-Funken |
| 📜 Gedicht-Baukasten | BAUEN | Gedicht aus Zeilen-Balken, reimende Zeilen gleiche Farbe: s1 1 Vers · s2 2 Verse · s3 Strophe aus 4 Versen · s4 Paarreim (1–2, 3–4) · s5 Kreuzreim (1–3, 2–4) · s6 zwei Strophen, umarmender Reim (1–4, 2–3) | 2★ Reimbögen leuchten · 3★ Blätter wirbeln wie Konfetti |
| ✒️ Komma-Jagd | SAMMELN | Eule fängt fliegende Kommas sanft mit dem Netz: s1 1 · s2 2 · s3 3 · s4 4 · s5 5 · s6 6, das Glas leuchtet | 2★ Netz glänzt · 3★ Kommas tanzen im Glas, Funken |
| ✂️ Morphem-Schere | BAUEN | Drei Bausteine stecken zusammen (Vorsilbe, Stamm, Endung in Deko-Farben): s1 Stamm · s2 + Endung · s3 + Vorsilbe · s4 zwei Wörter, gleicher Stamm · s5 vier · s6 Turm aus einer Wortfamilie | 2★ Bausteine klicken · 3★ Fähnchen oben |
| 💬 Rede-Zeichen | AUFTRITT | Sprechblasen ohne Text mit „ “: s1 Eule allein · s2 + Freund · s3 drei Figuren · s4 vier · s5 fünf · s6 Gesprächsrunde am Tisch | 2★ Blasen poppen sanft · 3★ alle lachen, Konfetti |
| 📄 Trenn-Schere | SAMMELN | Papierstreifen wird an den Silben geschnitten und zu einer Kette: s1 2 Teile · s2 3 · s3 4 · s4 5 · s5 6 · s6 lange Kette um den Bildrand | 2★ Kette schwingt · 3★ Schere klappert im Takt, Konfetti |
| 🪭 Verben-Fächer | BAUEN | Fächer öffnet sich: s1 1 Blatt · s2 2 · s3 3 · s4 4 · s5 5 · s6 ganzer Fächer, Eule fächelt sich Luft zu | 2★ Fächer glänzt · 3★ Blüten wehen heraus |
| 👃 Wort-Spürnase | KARTE | Spürnase folgt einer Fährte über die Karte: s1 1 Abschnitt · s2 2 · s3 3 · s4 4 · s5 5 · s6 bis zum Buch-Schatz | 2★ Nase schnuppert, Blätter fliegen · 3★ Buch öffnet sich, Funken |
| 🔎 Sachtext-Spurensuche | ZOOM | Fernglas stellt scharf auf eine Landschaft: s1 Hügel · s2 Baum · s3 Ast · s4 Nest · s5 Ei im Nest · s6 Vogel schlüpft | 2★ Fernglas glänzt · 3★ Vogel piepst, Funken |
| ✏️ Korrektur-Stift | BAUEN | Stift malt ein Bild sauber nach: s1 Umriss · s2 Himmel · s3 Haus · s4 Baum · s5 Garten · s6 Farben fertig | 2★ Stift wirbelt · 3★ Bild im Rahmen, Funken |
| 🎧 Hör-Reporter | AUFTRITT | Eule am Mikrofon, Zuhörer kommen dazu: s1 1 · s2 2 · s3 3 · s4 5 · s5 8 · s6 grosses Publikum, alle klatschen | 2★ Scheinwerfer an · 3★ Applaus und Konfetti |
| 🧪 Wortarten-Probe | SAMMELN | Reagenzgläser im Ständer füllen sich mit drei Deko-Farben: s1 1 · s2 2 · s3 3 · s4 4 · s5 5 · s6 6 Gläser, alle leuchten | 2★ Bläschen steigen · 3★ Gläser glitzern, Funken |
| 🎭 Gefühle-Radar | AUFTRITT | Fröhliche Gesichter kommen dazu: s1 Eule lächelt · s2 + 1 Kind · s3 + 2 · s4 + 3 · s5 + 4 · s6 Kreis aus lachenden Gesichtern, alle winken | 2★ Herzchen · 3★ Konfetti |
| 📚 Geschichten-Ordner | BAUEN | Bildstreifen füllt sich in Reihenfolge, Eule baut einen Schneemann: s1 Schnee fällt · s2 Kugel rollen · s3 zweite Kugel · s4 Kopf · s5 Nase · s6 Hut, fertig | 2★ Schneeflocken tanzen · 3★ Schneemann winkt, Funken |
| 👂 Hör-Geschichte | AUFTRITT | Eule erzählt, Zuhörer setzen sich dazu: s1 Hase · s2 + Igel · s3 + Maus · s4 + Eichhörnchen · s5 + Reh · s6 ganzer Kreis am Lagerfeuer | 2★ Glühwürmchen · 3★ alle klatschen, Funken |
| 📜 Gattungs-Kenner | SAMMELN | Bücherregal füllt sich (Symbole statt Titel): s1 1 Buch · s2 2 · s3 3 · s4 4 · s5 5 · s6 volles Regal, Eule liest | 2★ Leselampe an · 3★ Buch öffnet sich, Funken |
| 🪞 Figuren-Spiegel | AUFTRITT | Puppentheater: s1 eine Figur · s2 zwei · s3 drei · s4 vier · s5 fünf · s6 alle Figuren verbeugen sich | 2★ Vorhang schwingt · 3★ Applaus, Konfetti |

### NMG

| Spiel | Muster | s1 → s6 | Sterne |
|---|---|---|---|
| 📅 Jahreskreis-Ordner | ZYKLUS | Jahresrad dreht sich: s1 Frühling · s2 Sommer · s3 Herbst · s4 Winter · s5 12 Monatsfelder leuchten der Reihe nach · s6 innen 7 Wochentage, aussen 12 Monate | 2★ Rad glänzt · 3★ Blüten, Sonne, Blätter, Flocken wirbeln |
| 🔭 Himmels-Forscher | ZYKLUS, dann REISE | s1 Sonne geht auf und unter, Neumond daneben (nicht sichtbar) · s2 zunehmende Sichel abends im Westen · s3 Halbmond, erstes Viertel · s4 Dreiviertel- und Vollmond, geht bei Sonnenuntergang im Osten auf · s5 Sonde fliegt an den 8 Planeten der Reihe nach vorbei · s6 Vollmond über Hügel, Eule fliegt als Silhouette davor (Abschnitt 6) | 2★ ein Sternbild leuchtet auf · 3★ Sternschnuppe |
| 🐾 Tier-Sortierer | SAMMELN | Album füllt sich, je Gruppe eine Seite: s1 Heimtiere (Katze, Meerschweinchen) · s2 Wildtiere (Fuchs, Reh) · s3 Vögel (Amsel, Meise) · s4 Nager (Maus, Eichhörnchen) · s5 Raubtiere (Fuchs, Luchs) · s6 Paarhufer (Reh, Kuh, Gämse) | 2★ Tiere winken · 3★ Album glänzt, Funken |
| 🌳 Lebensraum-Zuordnung | REISE | Eule fliegt: s1 Wiese (Schmetterling) · s2 Wald (Eichhörnchen) · s3 Weiher (Frosch) · s4 Gebirge (Murmeltier) · s5 Pfeile Löwenzahn → Schnecke → Igel · s6 alle vier Lebensräume nebeneinander | 2★ Tiere schauen hervor · 3★ Regenbogen nach dem Regen (rot aussen), Funken |
| 🦇 Fledermaus-Forscher | ZYKLUS | Jahr der Fledermaus: s1 erwacht im Frühling · s2 jagt nachts Insekten, Echo-Bögen gehen hin und zurück · s3 Wochenstube mit Jungtier · s4 Jungtier fliegt mit · s5 Herbst: frisst sich Vorrat an · s6 Winterschlaf kopfüber | 2★ Mond scheint · 3★ Sterne funkeln über der Höhle |
| 🐛 Lebenszyklus-Puzzle | ZYKLUS | Frosch: s1 Laich · s2 Kaulquappe · s3 mit Hinterbeinen · s4 mit Vorderbeinen · s5 Jungfrosch, Schwanz wird kürzer · s6 Frosch springt auf ein Seerosenblatt | 2★ Libelle fliegt · 3★ Seerose blüht, Wasserringe |
| 🫀 Körper-Puzzle | REISE | Weg des Apfels: s1 Mund, Zähne beissen · s2 Speiseröhre · s3 Magen · s4 Dünndarm · s5 Dickdarm · s6 Körper hat Kraft, Kind springt | 2★ Herz klopft sichtbar · 3★ Kind jubelt, Funken |
| 🍎 Znüni-Teller | SAMMELN | Teller füllt sich: s1 Apfel · s2 + Karotte · s3 + Vollkornbrot · s4 + Käse · s5 + Nüsse · s6 + Glas Wasser, feines Znüni | 2★ Apfel glänzt · 3★ Serviette und Funken |
| 🧲 Magnet-Labor | SAMMELN | Magnet zieht an: s1 Büroklammer · s2 + Nagel · s3 + Schraube; Holz und Plastik bleiben liegen · s4 Nordpol zieht Südpol an · s5 Kompassnadel zeigt nach Norden · s6 Kette aus Klammern hängt am Magnet | 2★ Magnetfeld-Linien leuchten · 3★ Funken |
| 🛁 Schwimmt oder sinkt? | SAMMELN | Wanne: s1 Holz schwimmt · s2 Stein sinkt · s3 Kerze schwimmt · s4 Korken schwimmt · s5 Nagel sinkt · s6 Holzschiffchen trägt die Eule | 2★ Wasserringe · 3★ Seifenblasen steigen auf |
| 🗺️ Schweiz-Karten-Suche | KARTE | Eule fliegt über die stumme Karte (Umrisse aus dem Spiel): s1 1 Kanton leuchtet · s2 3 · s3 Hauptorte als Punkte · s4 10 Kantone · s5 Städte · s6 alle 26 Kantone leuchten nacheinander | 2★ Fähnchen am letzten Punkt · 3★ Berge glänzen, Funken |
| 🧭 Kompass-Spiel | KARTE | Eule geht auf dem Plan: s1 nach Norden · s2 nach Osten · s3 nach Süden · s4 nach Westen · s5 Karte dreht sich, Nadel zeigt weiter nach Norden · s6 Rundweg durch alle vier Richtungen | 2★ Nadel zittert · 3★ Fähnchen am Ziel |
| 🕰️ Früher und heute | REISE | Reise durch die Zeit: s1 Brief mit der Postkutsche · s2 Kurbeltelefon an der Wand · s3 Telefon mit Wählscheibe · s4 Tastentelefon · s5 Handy mit Tasten · s6 Smartphone | 2★ Telefon klingelt freundlich · 3★ Eule winkt, Funken |
| 🚸 Schulweg-Profi | KARTE | Kind geht zur Schule: s1 auf dem Trottoir · s2 wartet am Randstein · s3 gelber Fussgängerstreifen: warte, luege, lose, laufe · s4 Lichtsignal grün · s5 Velo mit Helm · s6 ganzer Weg bis ins Schulhaus | 2★ Schulglocke läutet · 3★ Freunde winken, Fähnchen |
| 🌦️ Wetter und Jahreszeiten | ZYKLUS | Baum durchs Jahr: s1 Knospen · s2 Blüten · s3 Sommer, grün, Sonne · s4 Herbst, bunte Blätter · s5 Winter, Schnee, Thermometer unter 0 °C · s6 ganzer Kreis zurück zum Frühling | 2★ Wettersymbol glänzt · 3★ Regenbogen (rot aussen, violett innen) |
| 📏 Zeitstrahl-Sortierer | WACHSEN | Ein Mensch wächst auf dem Zeitstrahl: s1 Baby · s2 Kleinkind · s3 Schulkind · s4 Jugendliche · s5 Erwachsene · s6 Grosseltern, dazu drei Generationen zusammen | 2★ Familienfoto blitzt · 3★ alle winken, Funken |
| 💡 Stromkreis-Bauer | BAUEN | Stromkreis schliesst sich: s1 Batterie und Lampe · s2 + Schalter, ein · s3 + Kabelstück aus Metall · s4 zwei Lampen in Serie · s5 zwei Lampen parallel · s6 Haus mit Lampen in jedem Zimmer | 2★ Lampe flackert freundlich an · 3★ Lichtpunkte wandern im Kreis |
| 🗺️ Plan-Leser | KARTE | Weg nach Plan mit Legendenzeichen: s1 Weg · s2 + Brücke · s3 + Kirche · s4 + Wald · s5 Massstab: 1 cm = 100 m · s6 ganze Strecke bis zum Ziel | 2★ Fussspuren leuchten · 3★ Fähnchen am Ziel |
| 🦄 Echt oder erfunden? | SAMMELN | Zwei Orte füllen sich: echte Tiere in den Korb, Fabelwesen ins Wolkenschloss: s1 1 + 1 · s2 2 + 2 · s3 3 + 3 · s4 4 + 4 · s5 5 + 5 · s6 beide voll, richtig verteilt | 2★ Wolkenschloss glänzt · 3★ Einhorn verbeugt sich, Funken |
| 🪵 Hebel-Wippe | BAUEN | Wippe bleibt waagrecht (Gewicht × Abstand gleich): s1 1 auf 2 gegen 1 auf 2 · s2 2 auf 2 gegen 2 auf 2 · s3 2 auf 1 gegen 1 auf 2 · s4 3 auf 2 gegen 2 auf 3 · s5 drei Gruppen · s6 langer Hebel hebt grossen Stein | 2★ Wippe schaukelt sanft · 3★ Eule landet in der Mitte, Funken |
| 👛 Taschengeld-Planer | SAMMELN | Sparkässeli füllt sich: s1 eine Münze · s2 zwei · s3 drei · s4 vier · s5 fünf · s6 Wunsch (Ball) ist erreicht | 2★ Kässeli klimpert · 3★ Ball hüpft, Funken |
| 💧 Wassertropfen-Reise | ZYKLUS | s1 Tropfen im See · s2 verdunstet in der Sonne · s3 kondensiert zur Wolke · s4 fällt als Regen · s5 versickert ins Grundwasser · s6 Quelle und Bach bringen ihn zurück in den See | 2★ Tropfen lächelt · 3★ Regenbogen (rot aussen, violett innen) |
| 🦕 Erdzeit-Leiter | REISE | Eule klettert die Zeitleiter: s1 Einzeller im Meer · s2 erste Meerestiere · s3 Fische · s4 Tiere gehen an Land · s5 Dinosaurier · s6 nach den Dinosauriern Säugetiere, zuletzt der Mensch | 2★ Farn wiegt sich · 3★ Fähnchen oben auf der Leiter |
| 🌿 Pflanzen-Bestimmer | WACHSEN | s1 Samen keimt, Wurzel nach unten · s2 erste Blätter · s3 Stängel mit Blättern · s4 Knospe · s5 Blüte öffnet sich · s6 Wiese mit verschiedenen Blattformen | 2★ Biene besucht die Blüte · 3★ Schmetterlinge, Funken |
| ❤️ Blutkreislauf-Lotse | REISE | Blutkörperchen: s1 Herz → Lunge · s2 in der Lunge wird es hellrot · s3 zurück ins Herz · s4 Arterie in den Körper · s5 gibt im Muskel Sauerstoff ab, wird dunkler · s6 Vene zurück zum Herz | 2★ Herz klopft · 3★ Herz leuchtet, Funken |
| ⚡ Energie-Wandler | REISE | s1 Wasser im Stausee · s2 fliesst hinunter · s3 dreht die Turbine · s4 Generator wandelt Bewegung in Strom · s5 Strom fliesst durch die Leitung · s6 Lampen im Dorf leuchten | 2★ Lampe strahlt · 3★ Lichter gehen der Reihe nach an |
| 🦎 Bionik-Paare | SAMMELN | Album mit Paaren aus der Liste des Spiels: s1 Klette ↔ Klettverschluss · s2 zwei Paare · s3 drei · s4 vier · s5 fünf · s6 Album voll | 2★ Paare klicken zusammen · 3★ Album glänzt, Funken |
| 🍫 Kakao-Weg | REISE | s1 Kakaofrucht wächst am Stamm · s2 Bohnen trocknen in der Sonne · s3 Schiff über das Meer · s4 Fabrik röstet · s5 Schoggitafel entsteht · s6 Tafel im Laden, Kind kauft sie | 2★ Duftwölkchen · 3★ Silberpapier glänzt, Funken |
| ⠃ Braille-Finger | BAUEN | Punkte erscheinen in der 6-Punkte-Zelle nach der Tabelle des Spiels: s1 a · s2 b · s3 c · s4 d · s5 e · s6 ganzes kurzes Wort, Finger tastet darüber | 2★ Punkte leuchten · 3★ Punkte klingen wie Glöckchen, Funken |
| 🧸 Teddy-Versteck | REISE | Teddy hüpft durchs Zimmer: s1 auf den Stuhl · s2 unter den Tisch · s3 neben die Kiste · s4 hinter den Vorhang · s5 zwischen zwei Kissen · s6 links und rechts winken, dann ins Bett | 2★ Teddy gähnt · 3★ Sterne über dem Bett |
| 🌞 Tageslauf-Sonne | ZYKLUS | Blick nach Süden: s1 Sonne geht links (Osten) auf · s2 Vormittag · s3 Mittag, am höchsten · s4 Nachmittag · s5 Abend, geht rechts (Westen) unter · s6 Nacht mit Mond und Sternen, dann neuer Morgen | 2★ Vogel singt · 3★ Sternschnuppe |
| 👁️ Auge-Entdecker | ZOOM | Zoom ins Auge: s1 Gesicht · s2 Augenlid und Wimpern · s3 Iris · s4 Pupille wird im Hellen klein · s5 Hornhaut glänzt · s6 im Dunkeln wird die Pupille wieder weit, Auge zwinkert | 2★ Augenzwinkern · 3★ Glanzpunkt funkelt |
| 🏛️ Gemeinde-Helfer | KARTE | Eule besucht den Dorfplan: s1 Gemeindehaus · s2 Bibliothek · s3 Werkhof · s4 Feuerwehr (118) · s5 Spital mit Ambulanz (144) · s6 ganzes Dorf leuchtet | 2★ Glocke am Gemeindehaus · 3★ Fähnchen auf dem Dorfplatz |
| 🧳 Kulturen-Koffer | SAMMELN | Koffer füllt sich mit Dingen aus der Liste des Spiels: s1 Pfahlbauhaus · s2 Pyramide · s3 Amphore · s4 vier Dinge · s5 fünf · s6 Koffer voll, klappt zu | 2★ Kofferschloss klickt · 3★ Reiseaufkleber, Funken |
| 🦻 Lärm-Wächter | REISE | Schall reist: s1 Glöckchen klingt · s2 Schallbögen fliegen zum Ohr · s3 Trichter bündelt den Schall · s4 Dämmung macht leiser · s5 Ohrstöpsel schützen bei lautem Klang · s6 Echo: Ruf hallt von der Felswand zurück | 2★ Ohr wackelt · 3★ leise Musiknoten schweben |

### Englisch

| Spiel | Muster | s1 → s6 | Sterne |
|---|---|---|---|
| 🇬🇧 English Word-Match | SAMMELN | Bildkarten-Paare (ohne Wörter): s1 1 Paar · s2 2 · s3 3 · s4 4 · s5 5 · s6 6 Paare, Karten drehen sich | 2★ Karten glänzen · 3★ Eule jongliert sanft, Funken |
| 👯 Wort-Zwillinge | SAMMELN | Zwillingspaare aus Bildern (Haus, Maus, Ball …): s1 1 Paar · s2 2 · s3 3 · s4 4 · s5 5 · s6 6 Paare tanzen | 2★ Paare drehen sich · 3★ Herzchen, Funken |
| 🧱 Sentence-Builder | BAUEN | Zug aus Wortkarten-Wagen (ohne Text): s1 Lok + 1 · s2 + 2 · s3 + 3 · s4 + 4 · s5 + 5 · s6 langer Zug mit Fragezeichen-Schlusswagen fährt ab | 2★ Dampfwölkchen · 3★ Fähnchen am Zug |
| 👂 Listen & Tap | AUFTRITT | Eule mit Kopfhörern, Tiere tauchen auf: s1 Katze · s2 + Hund · s3 + Vogel · s4 + Fisch · s5 + Pferd · s6 alle Tiere tanzen | 2★ Musiknoten schweben · 3★ Konfetti |
| 🐝 Spelling-Bee | BAUEN | Biene baut Waben (Sechsecke): s1 1 Zelle · s2 3 · s3 5 · s4 7 · s5 10 · s6 volle Wabe mit Honig | 2★ Honig glänzt · 3★ Biene fliegt eine Acht, Funken |
| 🔊 Sound-Sorter | SAMMELN | Klangkugeln rollen in zwei Röhren: s1 je 1 · s2 je 2 · s3 je 3 · s4 je 4 · s5 je 5 · s6 beide Röhren voll | 2★ Kugeln klingen · 3★ Röhren leuchten, Funken |
| 🌦️ Weather-Report | ZYKLUS | Wetterbild wechselt: s1 Sonne · s2 Wolke · s3 Regen · s4 Wind · s5 Schnee · s6 Sonne nach Regen mit Regenbogen (rot aussen, violett innen) | 2★ Mikrofon glänzt · 3★ Eule-Sprecherin verbeugt sich |
| 💬 Hello-Dialog | AUFTRITT | Figuren winken sich zu, Sprechblasen ohne Text: s1 Eule · s2 + 1 Kind · s3 + 2 · s4 + 3 · s5 + 4 · s6 Kreis, alle geben sich die Hand | 2★ Herzchen · 3★ Konfetti |

### Musik

| Spiel | Muster | s1 → s6 | Sterne |
|---|---|---|---|
| 🎼 Noten-Namen | AUFTRITT | Eulenchor singt, Noten im Violinschlüssel richtig gesetzt: s1 c · s2 c d e · s3 c bis g · s4 c bis a · s5 c bis h · s6 bis zum oberen c, ganzer Chor | 2★ Noten schweben · 3★ Chor verbeugt sich, Funken |
| 🥁 Rhythmus-Leser | AUFTRITT | 4/4-Takt füllt sich, Musiker kommen dazu: s1 1 Ganze (Trommel) · s2 2 Halbe · s3 4 Viertel · s4 8 Achtel · s5 gemischter Takt · s6 Ensemble spielt mehrere Takte | 2★ Taktstrich leuchtet · 3★ Applaus, Konfetti |
| 👂 Hoch-Tief-Ohr | REISE | Vogel fliegt die Melodie: s1 hoch und tief · s2 aufwärts · s3 abwärts · s4 auf und ab · s5 Halbton als kleiner, Ganzton als grösserer Schritt · s6 ganze Melodie bis zum Nest | 2★ Vogel trillert · 3★ Noten wirbeln, Funken |
| 🎺 Instrumenten-Kenner | AUFTRITT | s1 Trommel solo · s2 + Flöte (Duo) · s3 + Geige mit Bogen (Trio) · s4 + Trompete (Quartett) · s5 + Cello (Quintett) · s6 Orchester; alle richtig gehalten | 2★ Scheinwerfer · 3★ Verbeugung, Konfetti |
| 🔔 Klang-Wichtel | AUFTRITT | Wichtel spielen: s1 Glöckchen leise · s2 laut · s3 kurz und lang · s4 schnell und langsam · s5 vier Wichtel · s6 ganzes Wichtelkonzert im Wald | 2★ Glühwürmchen · 3★ Pilze leuchten sanft |
| 🥁 Rhythmus-Diktat | BAUEN | Takte aus Notenkarten: s1 Achtel · s2 + Sechzehntel · s3 + punktierte Viertel (= 3 Achtel) · s4 gemischter Takt · s5 zwei Takte · s6 ganze Zeile, Trommel spielt mit | 2★ Karten wippen · 3★ Applaus, Funken |
| 🎼 Tonleiter-Treppe | BAUEN | C-Dur-Treppe: s1 c d e · s2 + f (kleine Halbtonstufe) · s3 + g · s4 + a · s5 + h · s6 + oberes c, Halbtöne bei e–f und h–c | 2★ Eule hüpft die Treppe · 3★ Klangfunken oben |

### Medien und Informatik

| Spiel | Muster | s1 → s6 | Sterne |
|---|---|---|---|
| 🤖 Roboter-Pfad | KARTE | Roboter fährt im Raster: s1 vor · s2 vor, links · s3 um Steine herum · s4 mit Wiederholung · s5 mit Bedingung · s6 ganzer Weg bis zur Ladestation | 2★ Lämpchen blinkt · 3★ Roboter dreht sich, Funken |
| 💾 Speicher-Leiter | BAUEN | Leiter wächst, Sprossen werden breiter: s1 1 bit (Lämpchen an/aus) · s2 8 bit = 1 Byte · s3 kB · s4 MB · s5 GB · s6 die ganze Leiter bit → Byte → kB → MB → GB leuchtet, Eule oben | 2★ Sprossen leuchten · 3★ Fähnchen oben |
| 📜 Geheimschrift-Knacker | ZYKLUS | Schlüsselscheibe dreht sich: s1 um 1 Feld · s2 um 3 · s3 um 5 · s4 um 10 · s5 um 13 · s6 um 26, ganzer Kreis, Truhe öffnet sich | 2★ Scheibe klickt · 3★ Truhe glänzt, Funken |
| 🗂️ Datei-Typen | SAMMELN | Ordner füllen sich mit Zeichen (Text, Bild, Ton, Film): s1 1 Ordner · s2 2 · s3 3 · s4 4 · s5 grösste Datei am dicksten · s6 alle Ordner sauber im Schrank | 2★ Schublade klickt · 3★ Ordner glänzen, Funken |
| 🪨 Stein-Duell | BAUEN | Eule baut ein Steinmännchen: s1 2 Steine · s2 3 · s3 4 · s4 5 · s5 6 · s6 7 Steine, ganz ruhig im Gleichgewicht | 2★ Moos wächst darauf · 3★ Schmetterling landet oben |
| ⚫ Steine fangen | SAMMELN | Schwarze und weisse Steine kommen in die Schalen: s1 2 · s2 4 · s3 6 · s4 8 · s5 10 · s6 beide Schalen voll | 2★ Steine klacken · 3★ Schalen glänzen, Funken |
| ♟️ König in der Falle | REISE | Springer springt in L-Zügen übers Brett: s1 1 Sprung · s2 2 · s3 3 · s4 4 · s5 5 · s6 6 Sprünge von Ecke zu Ecke (a1 → h8), jeder Zug gültig | 2★ Springer wiehert sanft · 3★ Fähnchen auf dem Zielfeld |

### Französisch

| Spiel | Muster | s1 → s6 | Sterne |
|---|---|---|---|
| 🥐 Mots-Match | SAMMELN | Bildkarten-Paare auf dem Marktstand: s1 1 · s2 2 · s3 3 · s4 4 · s5 5 · s6 voller Stand | 2★ Croissant duftet · 3★ Eule verbeugt sich, Funken |
| 🌉 Wörter-Brücke | BAUEN | Brücke bekommt Bögen: s1 1 · s2 2 · s3 3 · s4 4 · s5 5 · s6 ganze Brücke, Eule geht hinüber | 2★ Fluss glitzert · 3★ Fähnchen an beiden Enden |
| 🏷️ Le ou la? | SAMMELN | Geschenke bekommen Bänder in zwei Deko-Farben: s1 1 · s2 2 · s3 3 · s4 4 · s5 5 · s6 Stapel aus 6 Geschenken | 2★ Schleifen glänzen · 3★ Konfetti |
| 👂 Son-Lauscher | AUFTRITT | Eule lauscht, Klangtiere kommen dazu: s1 Kuh · s2 + Taube · s3 + Hahn · s4 + Katze · s5 + Hund · s6 alle machen leise Musik | 2★ Ohr wackelt · 3★ Noten schweben, Funken |
| 🔢 Nombres-Rallye | REISE | Rallye-Auto fährt an Zahltafeln vorbei: s1 bis 10 · s2 bis 20 · s3 bis 40 · s4 bis 60 · s5 bis 80 · s6 bis 100 ins Ziel | 2★ Hupe tönt · 3★ Zielflagge weht, Funken |
| 🕰️ Quelle heure? | ZYKLUS | Uhr am Turm: s1 volle Stunde · s2 halbe · s3 Viertel nach · s4 Viertel vor · s5 Minuten · s6 Zeiger einmal ganz herum | 2★ Glocke läutet · 3★ Tauben fliegen auf |
| 📆 Calendrier | ZYKLUS | Kalenderrad: s1 1 Tag · s2 7 Tage · s3 1 Monat · s4 4 Monate · s5 8 Monate · s6 12 Monate, ganzes Jahr (nur Zahlen) | 2★ Blatt flattert · 3★ Konfetti |
| ☕ Au café | AUFTRITT | Café füllt sich: s1 1 Gast · s2 2 · s3 3 · s4 4 · s5 5 · s6 alle Tische besetzt, Eule serviert | 2★ Tassen dampfen · 3★ alle stossen an, Funken |

### Beim Bauen zu prüfen

- **🚀 Dezimal-Rakete:** s6 „auf den Tausendstel“ setzt voraus, dass Stufe 6 Tausendstel übt; sonst s6 = Hundertstel auf dem engsten Landeplatz.
- **🔭 Himmels-Forscher:** Phasen und Lage (zunehmend rechts hell) sind sicher; s5 überspringt den abnehmenden Mond zwischen Vollmond und letztem Viertel — die Animation sollte ihn im Übergang zeigen, nicht als eigene Stufe.
- **🦕 Erdzeit-Leiter:** Reihenfolge Einzeller → Meerestiere → Fische → Landtiere → Dinosaurier → Säugetiere/Mensch stimmt im Groben; welches Tier „an Land geht“ (Amphibie) und die Bilder gegen die Liste des Spiels abgleichen.
- **🦇 Fledermaus-Forscher:** Jahreslauf (Wochenstube im Sommer, Fettvorrat im Herbst, Winterschlaf kopfüber) gilt für einheimische Arten; mit den Inhalten des Spiels abgleichen.
- **🗺️ Schweiz-Karten-Suche:** nur sicher, wenn Kantonsumrisse und Hauptorte aus den Kartendaten des Spiels kommen; Wahlkreise sind bewusst nicht abgebildet.
- **💾 Speicher-Leiter:** Umrechnungsfaktor (1000 oder 1024) bewusst nicht gezeigt; s6 „TB“ geht über das Spiel (bis GB) hinaus — falls unerwünscht, s6 = GB mit Film-Symbol.
- **💡 Stromkreis-Bauer:** Serie und parallel nur als „Lampen leuchten“ zeigen, keine Helligkeit vergleichen (in Serie leuchten gleiche Lampen schwächer — falsch gezeichnet wäre das ein Fehler).
- **🦎 Bionik-Paare, 🧳 Kulturen-Koffer, ⠃ Braille-Finger:** bewusst an die Liste beziehungsweise Tabelle des Spiels gebunden; ausser Klette ↔ Klettverschluss, Pfahlbau, Pyramide, Amphore und den Punkten für a–e keine Inhalte von mir festgelegt.
- **🏛️ Gemeinde-Helfer:** 118 (Feuerwehr) und 144 (Sanität) stimmen für die Schweiz; prüfen, ob das Spiel sie gleich zeigt.
- **🌞 Tageslauf-Sonne:** „Osten links, Westen rechts“ gilt nur, wenn das Bild nach Süden blickt — so zeichnen oder die Himmelsrichtungen weglassen.
- **🍫 Kakao-Weg:** Gären der Bohnen vor dem Trocknen weggelassen (Vereinfachung, nichts Falsches).
- **🎺 Instrumenten-Kenner:** Haltung muss stimmen (Geige an der linken Schulter, Bogen rechts; Querflöte nach rechts) — beim Zeichnen prüfen.
