# LERN_Session21_2026-11-07_c3-tab-uebungen

## Schwerpunkt
Plan C3 ganz: der Tab Übungen des Lernsteigs wie der Tab Spiele des Eulenpfads — Kacheln nach Fach und Thema mit eigenen
Piktogrammen und Favoriten, Suche, Filter, Sortierung, dann Passung, Wackel-Stufen und ähnliche Übungen. Dazwischen
Rückmeldungen von Patrik: Niveau für alle Fächer im Filter, Filter-Block im Eulenpfad, Rechner am Bildrand wie der
Notizblock (Kern 1.27.0). Danach Plan E 9 (Vorrat der Stufen) für stromkreis b, kombinatorik, atombau, kraefte d und
grammatik. 13 Commits von `67b5e3e` bis `1bb6c19`, alle gepusht; dazu dieser Abschluss.

## Neu
- **Lernsteig, Tab Übungen** (`lernsteig/start/uebungen.js`, aus `start.js` gelöst):
  - Schritt 1: Favoriten oben, Fach (mit Bereich und Niveau-Wahl) und Thema auf- und zuklappbar, Kacheln oder kompakt;
    je Lehrplan-Stufe der Kompetenzstand als Buchstabe. Favoriten, Zuklappen, Ansicht, Sortierung und `filterZu` im
    Konto (Gast und Aufsicht nur im Tab).
  - Piktogramme (SY1 a, Stil SY2 a): `lernsteig/gemeinsam/symbole.js` mit 26 einfarbigen Strichzeichnungen, im Katalog
    das Pflichtfeld `symbol`.
  - Schritt 2: Suche über `KERN.suche` (Titel mit Tippfehler, Kompetenz-Code, Fach; Thema und Listen mit Grund),
    einklappbarer Filter (Niveau für alle Fächer, Fach, Themen, Nur: Favoriten, Wird geprüft, Mit Serie, Wackelt, für
    die Aufsicht Zu prüfen; Filterwahl je Browser), Sortierung nach Fach und Thema, Titel, Stufe (SS1 a), auf- oder
    absteigend.
  - Schritt 3: Passung (P1 a: Mittel aus Nähe zur Zielstufe des Niveaus, Bedarf aus dem Kompetenzstand, Prüfung —
    neutral ohne Ziel und ohne hinterlegte Prüfungsstufen) für Suche, ähnliche Übungen und „passt zu dir“;
    Wackel-Stufen (W1 a, `LST.wackelt`: ab 5 Aufgaben unter 70 % auf Anhieb in den letzten 10); `LST.stufenBedarf`;
    ähnliche Übungen über „Ähnliche Übungen →“ auf jeder Übungsseite (`?aehnlich=<id>`).
- **Kern 1.27.0:** `KERN.notizblock({ vorn })`, `verkleinern()`, `istKlein()`.
- **Lernsteig, Rechner am Bildrand** (RP1 a): `.rechner-fenster` am Platz des Notizblocks; der jeweils andere wird
  verkleinert, Inhalt und Ans bleiben.
- **Vorrat (E 9):** stromkreis b 8 → 37 (erzeugt aus Aufbau, Veränderung und Frage; Antworten aus einer Regeltabelle,
  Prüfung liest den Satz und rechnet mit dem Schaltungsmodell); kombinatorik f 23 → 236 (drei Münzen, Glücksrad, Urne)
  und challenge 26 → 50; atombau a 20 → über 1000 (Umkehrfrage aus der vorhandenen Liste) und challenge 28 → 42 (Edelgas
  gleicher Elektronenzahl); kraefte d 11 → 36 Beispiele (KR1 a); grammatik e 20 → 50, f 25 → 48, g 20 → 48 (SP1 a).
  Neu als Serie: kombinatorik f, atombau a, grammatik challenge.
- **Prüfer:** Seitentest für Kacheln, Favoriten, Zuklappen, Ansicht, Suche, Filter, Sortierung, Niveau für alle,
  Passung, Wackeln, Ähnliche und Knopf, Rechner am Bildrand mit gegenseitigem Verkleinern; `pruefe_uebungen.js` verlangt
  je Übung ein vorhandenes Piktogramm. Jede neue Prüfung mit Gegenprobe.

## Geändert
- **Eulenpfad:** Filter im Tab Spiele als umrahmter Block wie im Lernsteig (Hinweis Patrik). Sonst nur die Kern-Kopie.
- **Lernsteig:** Rechner nicht mehr unter dem Tastenfeld; `pruef_dom.js` kennt `setSelectionRange`.

## Stolperfallen
- **Filter-Rahmen falsch herum verstanden:** „im Lernsteig umrahmt, im Eulenpfad nicht — anpassen“ zuerst als „Lernsteig
  wie Eulenpfad“ umgesetzt; Patrik meinte das Umgekehrte. Bei „X hat …, Y nicht“ nachfragen, welche Seite das Vorbild
  ist.
- **Zeilenenden:** Beim Ersetzen eines ganzen Blocks per Python-Slicing (stromkreis) kam LF in eine CRLF-Datei; erst
  `patchlib --pruefe` danach zeigte es. **Hook-Kandidat:** nach jedem Schreiben aus `python`/`node` in `lernsteig/` oder
  `eulenpfad/` die geänderten Dateien auf gemischte Zeilenenden prüfen (heute von Hand nach jedem Schritt).
- **Gegenprobe mit zwei Fehlern zugleich** kann einen verdecken: ein veränderter Wortlaut liess die Sätze gar nicht erst
  lesen, die falsche Regel blieb unsichtbar. Fehler, die dieselben Aufgaben treffen, einzeln gegenproben.
- **Zahl der Hinweise falsch gerechnet** (17 statt 18) und in die Doku geschrieben; berichtigt. Zahlen im Bericht aus der
  Testausgabe übernehmen, nicht abziehen.
- **Frage nach der Commit-Message:** einmal die Entscheidungsfrage hinter die Commit-Message gesetzt (globale Regel
  „Fragen ans Ende“ gegen „Commit-Message als letzte Ausgabe“). Gelöst: Frage im Kasten unten, im Text nach der Message
  nur, wenn die globale Regel es verlangt — mit Hinweis.
- `pruefe_uebungen.js <übung>` ohne `terme` bricht im Seitentest ab (verlangt `terme`); nicht behoben.
- Für den Gast gesperrte Übungen lassen sich im Browser nicht ansehen; neue Wortlaute deshalb als Liste ausgegeben.

## Verifikation
- Kern „5671 Fälle, 0 Fehler.“ (1.27.0, Kopien gleich), Lernsteig „0 Fehler, 12 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“;
  die 12 Hinweise sind die Stufen der drei übrigen Sprachübungen), Gratwanderung „Keine Fehler.“.
- Eulenpfad: Stichprobe schriftlich-werkstatt, rechenprobe, malkreuz, zahlenhaus, preis-tabelle, quader-volumen mit
  Kern 1.26.0 und 1.27.0 — dieselben Klickzahlen, „Keine Fehler.“; zahlenhaus nach der Änderung am Ersatz-DOM. Kein voller
  Lauf; der letzte volle Lauf bleibt auf dem Stand nach `141cc53`.
- Browser (Gast): Tab Übungen auf Desktop und 375 px, Rechner und Notizblock auf 1024 × 600, 1400 × 900 und 375 px, ohne
  Konsolenfehler und ohne seitliches Rollen.

## Offene Punkte / Plan für die nächste Session
1. **E 9 weiter nach SP1 a:** rechtschreibung (d 20, e 14, f 13, g 11), dann englisch-grammatik (b, c, d, challenge),
   dann franzoesisch-grammatik (b, c, d, challenge) — je mindestens 48 Sätze je Stufe, Übung für Übung mit Commit und
   Liste zum Durchsehen.
2. **Prüfen durch Patrik:** neue Listen und Wortlaute (grammatik.js ab den Vermerken „Erweitert in LERN_Session21“,
   kraefte/maschinen.js, stromkreis b — 37 Sätze im Verlauf dieser Sitzung), Piktogramme, Tab Übungen, Rechner am Rand.
3. **Zur Absegnung:** Gruppen mit gemerktem Zuklappen und Favoriten gibt es jetzt fast gleich in Eulenpfad und Lernsteig;
   ein gemeinsamer Kern-Teil wäre sauberer, braucht aber einen vollen Eulenpfad-Lauf.
4. Voller Eulenpfad-Lauf auf Patriks Entscheid (Kern 1.22–1.27 nur mit Stichproben).
5. Danach laut Plan C4, C6–C8, C10; zurückgestellt: periodische Dezimalzahlen (Nenner 3, 6).
