# LERN_Session9_2026-11-02

## Schwerpunkt
Zuerst LERN-38 (Start-Steuerung, Uhr erst wenn das Kind antworten kann; Entscheide F1–F4 a, von Patrik
schon als da36a85 committet). Danach auf Wunsch Patrik: Lehrplan 3. und 6. Klasse ausgewertet (G1 a), mit
Blick auf den Übertritt in die Oberstufe und nicht nur auf St. Gallen; **Runde A** mit 10 Spielen für die
6. Klasse und einem **Übertritts-Check** im Zufallsmix (H1 a; 140 → 150 Spiele). Dann drei Rahmen-Bausteine:
ein **Fazit** in der Statistik (regelbasiert, keine KI), **Fehler melden** durch Kinder über die Aufsicht an
die Entwicklung mit Rückmeldung ans Kind (K1 a, M1 a), sowie **Hilfe ❓ und Tipp 💡** in allen 150 Spielen
(T1–T3 a). Zum Schluss Entscheide P1 a (Pentomino), S1 a (Son-Lauscher), A1 a (Melde-Adresse).

## Neu
- **Runde A, 6. Klasse** (Lernziele in `docs/eulenpfad/lernziele/lehrplan_sg_session9.md`, Ideen in
  `docs/eulenpfad/spielideen/lehrplan_3_und_6.md`, Quellen Lehrplan 21 national und Übertrittsverfahren
  mehrerer Kantone): Sachaufgaben-Kompass, Fahrplan-Rechner, Komma-Messband, Prozent-Brücke,
  Stufenzahl-Schieber, Stimmt-immer?, Sachtext-Spurensuche, Korrektur-Stift, Hör-Reporter, Wortarten-Probe.
  Themen „Begründen“ und „Zuhören“, Lernziele D.1.B.1 und MA.2.B.2. Werkzeug `tools/lehrplan_sg_3_6.py`.
- **Übertritts-Check** (rahmen.md Abschnitt 9): Mix-Option, Mathe und Deutsch, Basisklasse 6 → Stufe 3,
  Basisklasse 5 → Stufe 5, 8 Spiele je Runde, Bericht je Thema (sitzt ≥ 80 %, fast ≥ 50 %, sonst üben).
- **Fazit** (`AUSWERTUNG.fazit`, Schwellen in `AUSWERTUNG.FAZIT`): Menge, Qualität, Konzentration, Stärken und
  Schwächen, Auffälligkeiten. Vergleiche nur innerhalb von Spiel und Stufe; Querregeln Lesen ↔ Sachrechnen
  ↔ Rechnen (`BEREICHE`); Korrelationen (Tageszeit, Pause, Rundennummer) erst ab |r| ≥ max(0.35, 2/√n).
  „🦉 Mein Fazit“ fürs Kind, von der Aufsicht freigegeben (Profilfeld `fazitFuerKind`, G3 b).
- **Fehler melden** (rahmen.md Abschnitt 13): Knopf „🙋 Melden“ in eigener Zeile unter der Eule, Formular für
  diese oder die vorige Aufgabe mit Art und Begründung, gespeichert in `lernspiele:meldungen` (Abgleich und
  Sichern). Aufsicht im Untertab „🙋 Meldungen“: bestätigen, „kein Fehler“ mit Erklärung, an die Entwicklung
  (Entwickler-Server → Bemerkung mit Feld `meldung`; sonst E-Mail oder Text kopieren), Antwort ans Kind.
  Rückweg über `eulenpfad/meldungen-stand.json` (`tools/meldungen_stand.py`). 🔔/🙋 an den Tabs,
  „🏅 Fehlerfinder“ in Statistik und Fazit. Einstellung `melden` (aus / ab 3. Klasse / ab 5. / alle).
  Datenschutz-Ausnahme M1 a in CLAUDE.md.
- **Melde-Adresse** an einer Stelle: `eulenpfad/kontakt.js`, Feld `meldungen` (A1 a, heute leer), nur von der
  Startseite geladen, `LS.meldungAdresse()`; der Tab Entwicklung zeigt, ob sie eingetragen ist.
- **Hilfe und Tipp** (rahmen.md Abschnitt 14): `def.hilfe` (Bedienung) mit generischen Teilen aus der Seite;
  `ctx.tipp([...])` je Aufgabe, gestuft. Ein Tipp zählt einen halben Fehler bei den Sternen, Aufgaben nur mit
  Tipp nicht als „Anhieb“; Felder `tipps` und `bedienhilfe` im Protokoll. ❓ und 🙋 halten die Uhr an und
  verdecken die Aufgabe (`pause-verdeckt`), 💡 nicht.

## Geändert
- LERN-38: „▶ Los!“ nur zu Rundenbeginn und nach Fehlern, sonst 👀; `ctx.uhrWarten()`, `ctx.wartezeit`,
  Vorgabezeiten ohne Wartezeit (F1–F4 a).
- Bemerkungen 1 (Finger-Zähler: „✓ Fertig“) und 2 (Malkreuz: Abstände, Trennlinie) erledigt.
- Korrektur-Stift (G4 a): drei Versuche je Stelle, Lösung erst an der Grenze.
- Pentomino-Puzzle (P1 a): eigener Knopf heisst „🧩 Ein Teil legen“ (zählt als Fehler); beim Legen dazu
  Rahmen-Tipps. Son-Lauscher Stufe 6 (S1 a): Ansage nennt keine Schreibweise mehr.
- Kompass: Dativ in zwei Sätzen. Mix: „Perfekt“ nur, wenn alle Aufgaben auf Anhieb gelöst sind.
- Stimme: Uhrzeiten als „7 Uhr 42“.
- Meldefenster: gescrollt wird der Hintergrund, nicht das Fenster (Rundung blieb sonst nicht ganz;
  Meldung Patrik).
- Reservierte Klassen ergänzt; `tipp-zeile` war in zwei Spielen schon vergeben → `fr-beispiel`,
  `sr-anleitung`.

## Stolperfallen
- **Reservierte Klasse doppelt** (`tipp-zeile` in Fahrplan-Rechner und Satz-Reparatur): fiel erst im
  Browser auf. **Prüfer-Kandidat:** Testskript meldet Spiel-CSS, das eine Klasse aus
  `RAHMEN_KLASSEN.reserviert` neu definiert.
- **Testskript hielt Rahmen-Knöpfe für Aufgabenknöpfe** (Klick-Hörer an der Fläche, versteckter
  Tipp-Knopf, neuer Haken „uhr“): jeweils im Skript nachgezogen.
- **Fazit zuerst verwechselt:** Runden verschiedener Spiele direkt verglichen, Spiegelsätze bei Fächern mit
  zwei Themen. Behoben durch Vergleich je Spiel und Stufe und eine Mindestzahl Themen.
- **Melden-Knopf drückte die Blase** auf 375 px zusammen → eigene Zeile.
- **Fenster mit eigenem Scrollbalken** schnitt die Rundung (Meldung Patrik) → Hintergrund scrollt.
- **Heredoc mit Backslash** wies der Hook wieder ab → Edit-Werkzeug. Kein neuer Hook.
- Port 8765/8767 hier nicht nutzbar (WinError 10013) → Vorschau auf 8769.

## Verifikation
- `node tools/pruefe_spiele.js` über alle 150 Spiele × 6 Stufen (mit Tipps): **„Keine Fehler.“**, bekannte
  Hinweise (zu wenig verschiedene Aufgaben, Grundwörter Detektiv/Sortierer/Puzzle); jedes Spiel hat Tipps.
  Nach dem Lauf geänderte Spiele (Kompass, Einmaleins-Blitz, Finger-Zähler, Zahlenstrahl-Pfeil,
  Pentomino-Puzzle, Son-Lauscher) einzeln nachgeprüft: „Keine Fehler.“
- Browser (localhost:8769) mit Testdaten, danach gelöscht: Melde-Ablauf Kind → Aufsicht → Antwort → 🔔/🏅;
  Übertritts-Check-Bericht; Fazit-Karte; Pause und Verdecken bei ❓/🙋; Melden-Zeile auf 375 px;
  Meldefenster bei Überhöhe; Pentomino-Knöpfe; Startseite lädt `kontakt.js` ohne Konsolenfehler.
- **Nicht geprüft:** Hinweis im Tab Entwicklung zur Adresse angeschaut (braucht Aufsicht-Anmeldung), E-Mail
  aus einem echten Mailprogramm, echte Geräte, Spiele mit Kindern, Sachangaben der neuen Spiele.

## Offene Punkte / Plan für die nächste Session
1. **Patrik fachlich prüfen** (von den Agenten als unsicher gemeldet): energie-wandler (Tipp „Frage“),
   fehler-lupe (Tipp 2, Stufe 4–6), tipp-trainer Stufe 1; Regeln in schulweg-profi (Signal),
   schriftlich-werkstatt (Subtraktion), rede-zeichen Stufe 4/6, netz-falter (Dreierreihen), hoch-tief-ohr
   Stufe 6 (Halbton), instrumente („König“); Inhalte fledermaus-forscher, word-match, zielzahl-jagd,
   znueni-teller, zeitreise-verben, stellen-detektiv, stimmt-immer, teddy-versteck; Fakten in
   sachtext-spurensuche (Gotthard u. a.), hoer-reporter, Preise in sachaufgaben-kompass; Annahmen in
   `lehrplan_sg_session9.md`.
2. **LERN-40:** Postfach für Meldungen anlegen und in `eulenpfad/kontakt.js` eintragen; dann einmal eine
   Meldung per E-Mail durchspielen.
3. **Runde B (3. Klasse, T1–T8)** nach `spielideen/lehrplan_3_und_6.md` Abschnitt 6; danach S8, S9, S14,
   S15, T9–T11, R2.
4. **LERN-39** (Farben rechts vom Komma, Malzeichen, Braille-Finger ohne freie Liste) und **LERN-35**
   (Umbenennen Detektiv/Sortierer/Puzzle) entscheiden.
5. Prüfer-Kandidat umsetzen: reservierte Rahmen-Klassen im Spiel-CSS erkennen.
6. Weiter offen: LERN-21 (ansehen und freigeben, jetzt auch die 10 Spiele der Runde A), LERN-37, LERN-31,
   LERN-4.
