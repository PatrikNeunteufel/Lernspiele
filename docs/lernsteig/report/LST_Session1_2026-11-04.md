# LST_Session1_2026-11-04

## Schwerpunkt
Erste Cloud-Sitzung am Lernsteig (Auftrag `docs/lernsteig/AUFTRAG_cloud.md`). Ausgangsstand `b2276cf` (G1 a), Branch
`claude/confident-albattani-emy3iw`, Patriks Lehrplan-Recherche SG (`3927603`) per Merge hereingeholt. Zuerst die
offenen Grundsatzfragen als Entscheidungsfragen, dann nach Patriks Recherche Niveau- und Stufenmodell neu vorgelegt,
danach der Rahmen, der eingebaute Rechner und alle fünf Mathe-Übungen aus UE1, zuletzt der Vorschlag für die gemeinsame
Bibliothek.

## Entscheide (Patrik, 2026-11-04)
G1 a · SP1 a (mit Zusatz Aufstieg per Knopf) · NV1 a, ersetzt durch NV2 a · AU1 a (Zusatz Einladung, E-Mail) · BF1 a ·
DS1 a (Idee Server für die Schule) · KT1 a · GE1 b · EL1 a · AB1 a · GW1 a · GR1 a · Z1 a (Patrik, in der Recherche) ·
ST1 a mit ST2 a · MZ1 a · TR1 a mit RE1 a und RM1 b · UE1 a. Wortlaut und Folgen: `docs/lernsteig/HANDOVER.md`,
Übersicht `docs/lernsteig/fragen.md`.

## Neu
- **Rahmen** `lernsteig/gemeinsam/` (Vertrag `docs/lernsteig/rahmen.md`): `werkzeug.js` (Speicher `lernsteig:*`,
  Zufall mit Seed, Zahlschreibung nach Z1 a, Niveaus `n1`/`n2`, Stufen), `lehrplaene.js` (Kantone, Niveaunamen,
  Schulniveaus SG, Prüfungsziele mit den geprüften Stufen nach PA, Marken GA/OP/E Mathematik Z3), `katalog.js`,
  `rahmen.js` (Stufenwahl mit Marken, Ziel je Niveau, „wird geprüft“; Runde mit Hinweis und Lösungsweg; Serie mit
  Rekord und Zwischenstand; Protokoll je Aufgabe mit Lehrplan-Stufe; Tabellen und Graphen; Term-Antworten),
  `bruch.js` (exakte Bruchrechnung), `terme.js` (Terme lesen, vergleichen, Form prüfen), `rechner.js` (eingebauter
  Rechner nach RE1 a), `stil.css`.
- **Stufen** nach ST1 a/ST2 a: Lehrplan-Stufen als Referenz, Übergänge (beide gemischt), Challenge.
- **Startseite** `lernsteig/index.html` mit `start/`: Land, Kanton, Prüfungsziel, Niveau je Fach, Übungen.
- **Fünf Übungen** (UE1 a), je mit Generator, unabhängiger Prüffunktion und Hinweisen:
  Rationale Zahlen rechnen (MA.1.A.3 g–i), Gleichungen lösen (MA.1.A.4 h, j), Grössen umwandeln (MA.3.A.2 h–k),
  Prozent und Funktionswerte (MA.3.A.3 g–i), Terme vereinfachen (MA.1.A.4 i–k).
- **Testskript** `docs/lernsteig/werkzeuge/pruefe_uebungen.js` (ohne und mit `--browser`): Generatoren gegen Prüffunktion,
  Hinweise ohne Lösung, Vorrat der Serien, Kompetenz-Codes und Marken gegen die Recherche, Rechenkern des Rechners,
  jede Stufe im Browser durchgespielt, Protokoll, Rekord, Rechner-Bedienung.
- **Doku:** `fragen.md`, `notizen_fuer_eulenpfad.md` (EP1–EP4), `CHANGELOG.md`, `lehrplan/R11_auftrag_rechnermodelle.md`,
  `docs/commons_bibliothek.md` (Vorschlag mit KB1, KB2), Übernahmen in `docs/gemeinsame_mechaniken.md`.

## Befunde der Prüfungen (behoben)
Die unabhängigen Prüffunktionen und das Testskript fanden: Nenner „1000“ ohne Apostroph (Z1 a); periodische
Zeitumrechnungen (71 s in min); Massstab-Aufgaben mit mehr als zwei Nachkommastellen und 156 cm Kartenstrecke;
Hinweise, die zufällig die Lösung nannten („1 m/s … 3.6 km/h“, „1 %“, „100 m“); der Text „null“ in der Seite bei
leeren Teilen; die Musterlösung beim Ausklammern in falscher Form.

## Geprüft
`node docs/lernsteig/werkzeuge/pruefe_uebungen.js --browser --aufgaben=3000`: 0 Fehler, 0 Hinweise (Chromium, 375 px).
Bildschirmfotos angesehen: Startseite, Stufenwahl, Aufgabe, Rechner, Graph, Tabelle, Term-Aufgabe (375 px).
**Nicht geprüft:** Tablet (768 px) und Desktop im Browser angesehen; `file://` auf Windows; echte Geräte.

## Offen
- Annahmen in den Übungen (je im Kopf von `aufgaben.js`): Rechner je Stufe, Schreibweise von Brüchen („3/8“), negative
  Zahlen immer in Klammern, „7 · x“ in Stufe h, Hektare/Are, Massstab „1 : 25'000“.
- Noch nicht in den Übungen: Brüche multiplizieren am Rechteckmodell (MA.1.A.3.g), Potenz als Produkt schreiben und
  Notation abc (MA.1.A.4.i), Textgleichungen (MA.1.A.4.j), Grössen schätzen und relativ vergleichen (MA.3.A.2.i).
- Anmeldung und Profil (AU1 a, KT1 a, GE1 b, EL1 a), Kompetenzstand je Lernziel (BF1 a), Oberfläche der Aufsicht
  für `einstellungen.rechner` (TR1 a), Gruppen am selben Gerät (GR1 a), Rechner-Modelle nach R11 (RM1 b),
  Konzept „Server für die Schule“ (DS1).
- Vorschläge an Patrik: `.gitignore` um `lernsteig-*.json` und `__pycache__/` (EP4); Wortlaut Datenschutz in `CLAUDE.md`
  (EP3); Entscheidungsfragen KB1, KB2 in `docs/commons_bibliothek.md`.
