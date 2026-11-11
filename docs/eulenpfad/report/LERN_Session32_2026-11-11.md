# LERN_Session32_2026-11-11_gestaltung-kacheln

## Schwerpunkt
Überarbeitung der Startseite nach der Rückmeldung zur Gestaltung („steril“, „nach KI“): Konzept mit Entscheidungsfragen
(`docs/eulenpfad/konzept_gestaltung.md`), dann gebaut — Kartenbilder aus den Abschluss-Animationen, Kinderkarte ohne
Lehrplantext, Schrift Nunito, Stil „wie von Hand gezeichnet“ (Standard) auf der Startseite und um jede Runde herum,
Fach-Reiter und Knopf „Filter“, Stufen als Level, Fach- und Themenblöcke. Vorher die offenen Bemerkungen 41–49 aus der
Abnahme der Abschluss-Animationen. 20 Commits, alle von Patrik (`8de68fd` bis `67514d6`).

## Entscheide (Patrik, 11.11.2026)
- **ZS1 a, ZS2 a** (Bemerkungen 42, 43): Ereignisse der Gegenwart in der Liste des Zeitstrahl-Sortierers (1991 erste
  Website am CERN, 2007 Smartphone ohne Stift, 2022 KI-Chatprogramm; belegt aus Wikipedia, die CERN-Seiten gaben 404,
  OpenAI 403); Mondlandung als Bild `svg:mondlandung`.
- **GS0 a:** Die Startseite wird überarbeitet, die Spiele bleiben (Grundsatz im Plan Angleich der Reihe neu gefasst).
- **GS1 a, SK1 a:** Feier-Angaben aller 169 Spiele im Katalog (einzige Quelle); die Schweiz-Karte nennt Karte und
  Auswahl beim Namen, `orte.js` meldet sie an (`LS_FEIER.kartenDaten`); die Startseite zeichnet daraus das Kartenbild.
- **GS2 a:** Kinderkarte mit Bild, Name, Stufenknöpfen; Beschreibung hinter ⓘ, Kürzel nur für die Aufsicht.
- **GS3 a:** Nunito als zugeschnittene Datei (`eulenpfad/schriften/Nunito.woff2`, 43,7 KB) mit Werkzeug und Prüfung.
- **SP1 (Antwort „auch Schlussbild“):** Stil um die Runde herum — Stufenwahl, Ranglisten, Schlussbild; die Runde glatt.
  Dazu Wunsch Patrik: „wie von Hand gezeichnet“ ist Standard.
- **FB1 a, FB2 a, FB3 a** (Feedback zum Update): Fach-Reiter und Knopf „Filter“ mit Schiebereglern; Stufen als Level
  mit Sternen, Timer und Endlos mit Symbol und Wort; Boden der Spielkarten (**noch nicht gebaut**).
- **WO1 a:** Wochenziel als Marke in der Kopfzeile — am Ende der Sitzung von Patrik zurückgenommen (siehe Offen).
- **GR1 a:** Fach und Thema als Blöcke mit Bild. **FB2-K a:** Stichworte für Stufen mit wechselnder Tätigkeit (noch
  nicht gebaut).

## Neu
- **Kartenbilder** (`start/spiele.js`): ruhiges Endbild der Stufe 3 mit 1 Stern (ohne Schmuck, Wunsch Patrik), erst
  gezeichnet, wenn die Karte ins Bild kommt; Daten eines Spiels (Schweiz-Karte) nachgeladen in Reihenfolge.
- **Stil „wie von Hand gezeichnet“** (Einstellung `stil`, Standard `hand`; `STIL` am Ende von `spiel.js`): krumme Rahmen
  mit dicker Kopfseite über Spielkarten, Weiterspielen, Filter, Karten der Tabs, Stufenwahl und Schlussbild; Raster der
  Kacheln je Spiel verschoben und skaliert, ab und zu eine Lücke (auch in der ersten Spalte); Knöpfe, Chips, Tabs und
  Felder mit ungleichen Ecken. Gemessen: keine Karte überdeckt eine andere (kleinster Abstand 7,4 px bei 1024, 6,4 px
  bei 375).
- **Avatare:** im Stil „hand“ verformt; Form des Rahmens wählbar im Profil (rund, Quadrat, Dreieck oben/unten, Fünfeck;
  Kennung `…[-<form>]`), alles im Bild (gemessen, höchstens 56).
- **Filter:** Gruppen je für sich einklappbar (vorgegeben zu, `filterOffen`); Meine Klasse in der Gruppe Klasse; über den
  Spielen nur Fach-Reiter (umbrechend, nicht scrollend), Suche und Knopf „Filter“.
- **Verwaltung → Einstellungen** in Blöcken (`LS.EINSTELLUNG_BLOECKE`): Aussehen (Stil), In den Spielen, Kinder, Ton
  und Ruhezeiten; Meldeweg, Speicher, „Alles auf Standard“ je für sich.
- **Druckknöpfe** auf der Startseite; **Stufen als Level** auf jeder Spielseite (grosse Zahl, drei Sterne, Untertitel,
  ⓘ für den Lehrplantext); Schaltersymbole nach `spiel.js` (`LS.schalterSymbol`).
- **Fach- und Themenblöcke** mit Bild je Fach und je Thema (`THEMEN[].bild`, 41).
- **Bilder der Sammlung:** `svg:mondlandung`, `svg:schweiz` (Windows zeichnet keine Flaggen-Emoji; 🇨🇭 in vier Spielen
  und zwei Abschlussbildern ersetzt, Word-Match 🔤 statt 🇬🇧); `feier.js` zeichnet Bilder der Sammlung über `LS.bild`.
- **Werkzeuge:** `tools/schrift_zuschneiden.py` (`--pruefe` in den kurzen Tests als „schrift“); `pruefe_skripte.js`
  prüft auch `<link>`, `@import` und `url()` von aussen (LERN-1).

## Geändert
- Bemerkungen 41 (Dezimal-Rutsche: Stufen unterscheidbar), 42/43 (Zeitstrahl), 44–49 (Echt oder erfunden: Wendung aus
  dem Satz in einer Blase — dasselbe Bild kann echt und erfunden sein) erledigt.
- Kinder-Statistik ohne Konzentrations-Vorschläge (ST1 a war verletzt).
- Wochenziel im Tab Spiele: Karte weg, Marke in der Kopfzeile (WO1 a).

## Stolperfallen
- **Patrik committete einen Zwischenstand mit** (`a2c91ae` trägt die Message von FB1, enthält den Code von FB2); die
  Commit-Pause half nicht, weil weitergebaut wurde, bevor „committet“ kam. Ab jetzt nach „weiter“ zuerst `git status`.
- **Prüf-DOM:** `[data-gruppe^="fach:"]` wirkt dort nicht wie im Browser (zählte 14 statt 1) — **Prüfer-Kandidat:**
  ältere Prüfung in `eulenpfad_seiten.js` (Gruppen nach Fach) nutzt denselben Selektor und besteht womöglich zu leicht;
  `^=` in `tools/pruef_dom.js` nachrüsten.
- **Gegenprobe mit falscher Klasse:** eine neue Prüfung suchte `.wochen-karte`, die es nicht gibt, und hätte immer
  bestanden — erst nachgesehen, wie die Klasse heisst. Zweiter Fall dieser Art in der Sitzung (auch beim Stufentext:
  `display: block` hob `hidden` auf) → **Prüfer-Kandidat:** Seitentest meldet Elemente mit `hidden`, die sichtbar sind.
- **Namenskonflikte im IIFE:** `BILDER` in `feier.js` verdeckt die Bildersammlung (Ausweg `LS.bild`); `auswahl` im
  STIL-Block traf eine Deklaration von `LS` (die Spielprüfung liest Deklarationen nach der Einrückung).
- Dynamisch eingefügte Skripte laufen ohne `async = false` in beliebiger Reihenfolge (orte.js vor karte.js).
- Ein `details` zeigt zugeklappt nur den Kopf — ein darübergelegter SVG-Rahmen verschwindet mit; Fach-Blöcke darum mit
  ungleichen Ecken statt SVG.
- Die Masse des Schweizer Kreuzes stammen aus dem Gedächtnis (im Code vermerkt), beim Prüfen belegen.

## Verifikation
Kurze Tests grün (heutige Läufe): Skripte „Keine Fehler.“, Kern „5916 Fälle, 0 Fehler.“, Server „59 Fälle, 0 Fehler.“,
Lernsteig „0 Fehler, 139 Hinweise.“, Konten „106 Fälle, 0 Fehler.“, Gratwanderung „Keine Fehler.“, Feier „169 Spiele,
6084 Bilder, keine Fehler.“, Schrift „Keine Fehler.“; Eulenpfad Stichproben „Keine Fehler.“ (zuletzt tab). Umzug der
Feier-Angaben gegen den Altstand verglichen: alle 169 Spiele × 6 Stufen ruhig und bewegt gleiches Markup. **Letzter
voller Eulenpfad-Lauf weiter auf `6055527`.** Im Browser angesehen: Startseite (Desktop, 375 px), Stufenwahl, Avatare,
Abschlussbilder; nicht: Ansicht der Aufsicht (PIN), Schlussbild einer echten Runde.

## Nachtrag nach dem Abschluss (12.11.2026)
In den Fach-Blöcken standen nur noch zwei statt drei Kacheln nebeneinander: Die Innenabstände der Blöcke liessen bei
1024 px 904 px Platz, drei Kacheln zu 300 px brauchen 932. Jetzt je Kachel mindestens 280 px und ein Drittel der Zeile
(höchstens drei Spalten; vier fand Patrik zu viel); die Startseite darf bis 1320 px breit werden (Hinweis Patrik: „die
Blöcke können grösser werden“), dort wachsen die Kacheln auf rund 400 px; Symbol und Zahl der Stufenknöpfe brechen nicht
mehr um. Gemessen: 3 Spalten bei 1024 und 1600, 1 bei 375, keine Überdeckung, kein seitliches Scrollen.

## Offen / Plan für die nächste Session
1. **Wunsch Patrik am Ende:** Erfolge und Statistik im Stil „hand“ vollständig; die **Statistik kindgerechter** (nur die
   Aufsicht sieht weiter alles ausführlich, etwa „In den letzten 4 Aufgaben nur 25 % …“); die **Marke des Wochenziels in
   der Kopfzeile wieder entfernen** (das Wochenziel steht schon in Statistik und Erfolge; WO1 a zurückgenommen); das
   **Personen-Dropdown** in der Kopfzeile im Stil anpassen.
2. **FB2-K a:** Stichworte („🎧 hören“, „📖 lesen“, „✏️ zeichnen“, „↩ rückwärts“) für die 20 Spiele mit wechselnder
   Tätigkeit (Liste mit `stufentexte.py` aus dieser Sitzung neu erzeugen); die übrigen 92 Spiele von Hand durchsehen.
3. **FB3 a:** Boden der Spielkarten in einer dunkleren Fassung der Kartenfarbe, Einsinken beim Drücken; mit dem
   Klassen-Rand im Browser ansehen.
4. Bilder der Anleitungen neu erzeugen (`tools/anleitung_bilder.js`, Server nötig).
5. Prüfer-Kandidaten aus den Stolperfallen; Versuch mit Kindern und der Lehrperson (Konzept Gestaltung).
6. Voller Eulenpfad-Lauf (rund 25 min) vor dem nächsten Push, auf Patriks Entscheid.
