# LERN_Session3_2026-10-31

## Schwerpunkt
Von 56 auf **84 Spiele** (28 neu). Dazu wurden die Startseite und die Arbeitsweise umgebaut:
- Prüfer gegen Hinweise, die die Lösung verraten (LERN-19);
- Testhilfen;
- Anmeldung mit Aufsicht und PIN, Tabs;
- Prüfstand und Freigabe je Spiel und Inhaltsliste;
- Wiederholungsregel je Runde;
- Endlos-Modus mit Rekorden und Rangliste;
- Sprachausgabe für Englisch;
- Rahmen-Vertrag (`docs/rahmen.md`) und erzeugte Checkliste.

Die Arbeit lief in zwei Commits (`118936f`, `a9d1798`) und dem hier beschriebenen offenen Rest.

## Neu
- **28 Spiele**, alle mit `neu: "LERN_Session3"`, also für Kinder gesperrt, bis sie angesehen sind.
  Zuordnung in `docs/lernziele/lehrplan_sg_session3.md`.
  - **Paket 1, Orientierungspunkt 4. Klasse (T3 a):** Schriftlich-Werkstatt, Malkreuz,
    Rechentrick-Detektiv, Diagramm-Detektiv, Preis-Tabelle (statt Folgen-Fortsetzer),
    Kompass-Spiel, Wortfamilien-Baum, Zeitreise-Verben, Fehler-Lupe.
  - **Paket 2, übrige Ideen (G1 a):**
    - Mathe: Pentomino-Puzzle, Würfelbau-Blick, Netz-Falter, Rechen-Maschine, Zielzahl-Jagd,
      Glace-Kombinator
    - Informatik: Roboter-Pfad
    - NMG: Früher und heute, Schulweg-Profi, Wetter und Jahreszeiten, Zeitstrahl-Sortierer,
      Stromkreis-Bauer, Plan-Leser, Echt oder erfunden?
    - Deutsch: Gedicht-Baukasten
    - Englisch: Wort-Zwillinge, Sentence-Builder, Listen & Tap, Spelling-Bee
  - Neue Themen: Daten, Orientierung, Kombinieren, Informatik, Wetter, Sicher unterwegs,
    Geschichten, Gedichte, Englisch-Sätze, Englisch hören.
- **Startseite** (L1 a – L3 a): eine Seite mit Tabs Spiele, Profil, Statistik und Verwaltung; der
  Code je Tab liegt in `start/`.
  - Anmeldung: Kinder ohne PIN, die Aufsicht mit PIN (SHA-256-Hash, gilt nur im Tab).
  - Spiele nach Fach und Thema auf- und zuklappbar, Favoriten, Ansicht Kacheln oder kompakt.
  - Statistik: Ein Kind sieht und sichert nur sich. Die Aufsicht sieht alle, sichert alle oder
    einzelne und liest ein.
  - Verwaltung: Freigabe je Spiel und Liste, Konten, PIN.
- **Freigabe** (L4 a, Präzisierung F1 a):
  - Standardmässig frei ist, was nichts zu prüfen hat.
  - Gesperrt bleiben neue Spiele bis „angesehen“ und Inhaltslisten bis „geprüft“. Beides steht
    im Katalog (`geprueft`, `listen`).
  - 162 Listen in 43 Spielen; gemeinsam genutzte Listen als Verweis (`von`), Zusatzlisten
    (`zusatz`).
  - Offene Annahmen zum Lehrmittel sperren nicht.
- **Testhilfen** für die Aufsicht: 🔑 Lösung zeigen und ⏭ Aufgabe überspringen. Jedes Spiel nennt
  seine Lösung mit `ctx.loesung()`.
- **Wiederholungsregel:** Höchstens eine Aufgabe kommt je Runde ein zweites Mal, nie direkt
  hintereinander; reicht der Vorrat nicht, wird die Runde kürzer (`gekuerzt`). Hör-Aufgaben nennen
  ihre Kennung mit `ctx.kennung()`.
- **Endlos-Modus:**
  - 34 Spiele, die ihre Aufgaben berechnen, in Stufen mit mindestens 100 verschiedenen Aufgaben.
  - Die Runde läuft bis zum ersten Fehler oder bis die Zeit um ist.
  - Einstieg über „♾ Endlos spielen“ auf der Spielkarte ins Startbild des Spiels; die Stufenknöpfe
    der Startseite springen direkt in eine gewöhnliche Runde.
  - Rekorde in `lernspiele:rekorde`, Rangliste am Schluss und in der Statistik.
  - Die Online-Rangliste ist als Idee dokumentiert.
- **Sprachausgabe:** `LS.sprich`, `LS.stimmeBereit`, `LS.spielMitStimme`; britische Stimme bevorzugt.
- **Doku und Werkzeuge:**
  - `docs/rahmen.md`: Vertrag zwischen Rahmen und Spielen. `LS.RAHMEN_KLASSEN` ist die einzige
    Liste der Klassen.
  - `docs/checkliste.md`, erzeugt von `tools/checkliste.js`: Klasse → Fach → Thema → Spiel,
    gebaut oder Idee, frei oder gesperrt, was zu prüfen ist.
  - Prüfliste Teile 22–39.

## Geändert
- **Hinweise, die die Lösung verrieten**, korrigiert: Schätz-Waage, Zahlen-Waage, Punkte-Blitz,
  Regel-Lücke, Lebenszyklus, Körper-Puzzle, Himmel, Znüni.
- **Vergleichs-Krokodil:** Die Schlusskarte schrumpfte durch die eigene Klasse `.mitte`; jetzt heisst
  sie `.kroko-mitte`. Ebenso Zahlen-Baukasten: `.plus` → `.baustein-plus`.
- **29 bestehende Spiele** ziehen ihre Inhalte aus freien Teillisten. 34 Spiele haben `ctx.loesung`
  nachgerüstet.
- Testspieler (T1/T2) ist in der Rolle **Aufsicht** aufgegangen (L2 a); frühere Testspieler werden
  beim Lesen migriert.
- `statistik.html` leitet auf `index.html#statistik` um.

## Stolperfallen
- **Namenskonflikt bei CSS-Klassen:** Spiel-Stile überschrieben Rahmen-Klassen. Das Krokodil traf
  es sichtbar (Schlusskarte), den Zahlen-Baukasten unbemerkt. Jetzt prüft es das Testskript gegen
  `LS.RAHMEN_KLASSEN`.
- **Gemeinsam genutzte Inhalte:** Anlaut-Wörter in drei Spielen, Sätze in zwei Spielen. Mit
  eigenen Listen je Spiel hätte derselbe Inhalt mehrere Prüfstände. Lösung: Verweis `von`.
- **Inhalt mit dem Spiel freigegeben:** Ein Agent schlug vor, die fehlerfreien Sätze der Fehler-Lupe
  automatisch mit dem Spiel freizugeben. Das widerspricht L4 a; sie sind jetzt eine eigene
  Zusatzliste.
- **Prüfer-Artefakte:** Übersprungene Aufgaben hinterliessen Hinweise für die nächste Runde
  (behoben über das Ereignis `aufgabe`). „Na“ + „se“ ergab „NaN“ (nur noch ganze Wörter).
  Endlos-Ereignisse fielen in die Zählung „ohne ctx.loesung“.
- **Aufgaben-Kennung bei Bild- und Hörspielen:** Text allein erkannte verschiedene Melodien als
  gleich. Lösung: SVG-Formen in die Kennung, für Hörspiele `ctx.kennung`.
- **Messung „verschiedene Aufgaben“** über die Daten des Generators ist bei Wortlisten-Spielen zu
  hoch (gemischte Ablenker). Die Endlos-Auswahl beschränkt sich deshalb auf Spiele mit berechneten
  Aufgaben.
- **Hooks:** Backslashes in Heredocs und Backticks in `python -c` werden abgewiesen. Ersetzungen
  liefen über Python-Dateien im Scratchpad mit `patchlib`.
- **Hook-/Prüfer-Kandidaten:** Beide Regeln wurden mehrfach von Hand durchgesetzt; heute deckt sie
  das Testskript ab.
  - „Hinweis verrät Lösung“ (LERN-19, jetzt Prüfer).
  - „Annahme ohne Spielname wird von der Checkliste übersehen“: Offen ist ein Prüfer in
    `tools/checkliste.js`, der Annahmen ohne bekannten Spielnamen meldet.

## Verifikation
- `node tools/pruefe_spiele.js`, zwei Gesamtläufe (Startwert 1 und 2): „Keine Fehler.“ für 84 Spiele
  × 6 Stufen, 34 Endlos-Spiele und 182 Listen-Fälle als Kind.
- Katalog und Ordner stimmen überein (84/84); jedes Thema und jedes Lernziel ist definiert und
  benutzt.
- Szenarien der Startseite in Node (Anmeldung, PIN, Freigabe, Statistik, Rekorde): ohne Fehler.
- **Nicht geprüft:**
  - Das Aussehen im echten Browser: Die Vorschau lehnte localhost ab; nur Stichproben der Agenten
    im Headless-Browser.
  - Die Sprachausgabe auf dem Tablet der Kinder.
  - `crypto.subtle` über `file://`.
  - Lange Endlos-Serien und „alles geschafft“.

## Offene Punkte / Plan für die nächste Session
1. **Ansehen:** Startseite und die 28 neuen Spiele auf Desktop, Tablet und Handy, dazu
   Sprachausgabe und PIN unter `file://`. Danach im Katalog `geprueft` eintragen und
   `node tools/checkliste.js > docs/checkliste.md` ausführen (LERN-21).
2. **LERN-11:** Prüfliste einarbeiten (Teile 1–39); geprüfte Listen im Katalog `geprueft`.
3. **LERN-4:** Testrunde mit den Kindern (Stellenwert-Prüfung Do 05.11).
4. **Lehrmittel-Abgleich:** 50 Spiele mit offenen Annahmen, siehe Checkliste.
5. **Vor LERN-17 (GitHub Pages):** Datenschutz-Scan.
6. **Offene Ideen:** Tipp-Trainer, Schweiz-Karten-Suche, Mots-Match.
