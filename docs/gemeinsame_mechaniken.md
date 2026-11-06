# Gemeinsame Mechaniken — Kandidaten für den gemeinsamen Kern

Stand: 2026-11-04 (Notiz Patrik, LERN_Session13)

**Entscheid Patrik:** Lernsteig (und später Gratwanderung) dürfen Mechaniken aus dem Eulenpfad **abschauen und
kopieren**, angepasst an Alter und Niveau. Es gibt dabei **keine Abhängigkeit zwischen den App-Ordnern** — kein
`<script src="../eulenpfad/…">`, kein Import aus `eulenpfad/`. Wo Mechaniken in beiden Apps gleich oder fast gleich
laufen, werden sie **später** in einen gemeinsamen Kern ausgelagert (Konzept der Reihe, Abschnitt 3 und 5).

Damit das später geht, trägt jede Übernahme hier eine Zeile ein — auch kleine. Wer eine Mechanik in einer App
ändert, vermerkt es hier, damit die Kopien nicht still auseinanderlaufen.

| Mechanik | Herkunft (Datei, Abschnitt) | Kopie in | angepasst wie | Stand | Kern-Kandidat? |
|---|---|---|---|---|---|
| Stufen je Übung | `eulenpfad/spiele/gemeinsam/spiel.js`, `SKALA`, `stufeFuer`; `CLAUDE.md` Stufen | `lernsteig/gemeinsam/werkzeug.js` `stufenListe`, `zielstufe`; `rahmen.js` `stufeInfo` | bewusst anders (ST1 a, ST2 a): Lehrplan-Stufen als Referenz, Übergänge, Challenge; Zahl je Übung frei; Kopie vom 2026-11-04 (sechs feste Stufen) ersetzt | 2026-11-04 LST_Session1 | nein (Idee „Stufen aus Daten des Katalogs“ ja) |
| Zufall (`zufall`, `waehle`, `mische`) | `spiel.js` oben | `werkzeug.js` | Zufallsquelle austauschbar (Seed für das Testskript) | **im Kern seit 1.1.0** (`kern/zufall.js`, 2026-11-05 LERN_Session15) | — |
| Speicher mit Präfix (`lies`, `schreibe`) | `spiel.js` Speicher | `werkzeug.js` | `schreibe` meldet true/false | **im Kern seit 1.1.0** (`kern/speicher.js`, 2026-11-05 LERN_Session15); Hörer bleiben im Eulenpfad | — |
| Zahlschreibung (`zahlText`, `dezimalText`, `leseZahl`) | `spiel.js` `zahlText`, `dezimalText` | `werkzeug.js` | bewusst anders: Apostroph ab vier Stellen, Dezimalpunkt (Z1 a) | **im Kern seit 1.0.0** (`kern/zahl.js`, 2026-11-05 LERN_Session15); beide Apps geben nur ihre Schreibweise | — |
| Exakte Bruchrechnung | `lernsteig/gemeinsam/bruch.js` (LST_Session1) | — | — | **im Kern seit 1.0.0** (`kern/bruch.js`, `KERN.bruch`, 2026-11-05 LERN_Session15) | — |
| Terme lesen, vergleichen, Form prüfen | — | `lernsteig/gemeinsam/terme.js` | — | **im Kern seit 1.14.0** (`kern/terme.js`, `KERN.terme`, 2026-11-06 LERN_Session17); der Lernsteig gibt nur seine Schreibweise | — |
| Rechenkern des Taschenrechners | — | `lernsteig/gemeinsam/rechner.js` | Modelle, Bedienhilfe und Tastenfeld bleiben im Lernsteig | **im Kern seit 1.14.0** (`kern/rechner.js`, `KERN.rechner`, 2026-11-06 LERN_Session17) | — |
| Element bauen (`el`) | `spiel.js` `el` | `lernsteig/gemeinsam/rahmen.js` | gleich | **im Kern seit 1.1.0** (`kern/el.js`, 2026-11-05 LERN_Session15) | — |
| Vertrag Aufgabe als Daten: `aufgabeErzeugen`, `pruefeAufgabe` | `docs/eulenpfad/rahmen.md` 4.4 | `lernsteig/uebungen/<id>/aufgaben.js`, `docs/lernsteig/rahmen.md` | Niveau als zweiter Parameter; der Rahmen zeichnet die Aufgabe selbst aus den Daten (eine Quelle für Seite und Test) | 2026-11-04 LST_Session1 | ja |
| Fehlversuch: Hinweis, nach drei Versuchen Lösung und Weiter | `docs/eulenpfad/rahmen.md` 4.2 `ctx.falsch` | `rahmen.js` `runde` | Hinweis als Funktion der Übung (`hinweis(aufgabe, eingabe)`), Lösungsweg dazu, sachlicher Ton | 2026-11-04 LST_Session1 | ja |
| Endlos-Modus („Serie“) mit Rekord, Zwischenstand bei `pagehide`/`visibilitychange` | `docs/eulenpfad/rahmen.md` 7 | `rahmen.js` `runde`, Speicher `lernsteig:rekorde` | ohne Timer und ohne Rangliste (vorerst ein Gastkonto); Rekord vor „Zum Ergebnis“ gespeichert | 2026-11-04 LST_Session1 | ja |
| Wiederholungsbremse | `docs/eulenpfad/rahmen.md` 4.2 „Wiederholungen“, `lernspiele:gestellt` | `rahmen.js` `ziehe`, `lernsteig:gestellt` | vereinfacht: keine Wiederholung in der Runde, in Serien keine der letzten 30 | 2026-11-04 LST_Session1 | ja |
| Protokolleintrag je Runde (**im Kern seit 1.6.0**: `kern/runden.js`, Format R1 a; LERN_Session15) | Protokoll in `spiel.js`, `docs/eulenpfad/rahmen.md` 7 | `rahmen.js` `protokolliere`, `lernsteig:runden` | Felder `niveau`, `fach`, `gruppe` (GR1 a) dazu, keine Sterne (BF1 a) | 2026-11-04 LST_Session1 | ja, Format im Kern vereinheitlichen |
| Testskript: Generatoren gegen Prüffunktion, Hinweise ohne Lösung, Endlos-Vorrat, Seiten im Browser | `tools/pruefe_spiele.js` | `tools/pruefe_uebungen.js` | eigenes, kleineres Skript: Playwright statt Ersatz-DOM, Kompetenz-Codes gegen die Lehrplan-Recherche, Seed über austauschbare Zufallsquelle | 2026-11-04 LST_Session1 | ja, gemeinsamer Kern mit Treiber je App |
| PIN mit Salz und SHA-256, Wiederherstellungscode, PIN vergessen, Anmeldung nur im Tab | `docs/eulenpfad/rahmen.md` 6 (Aufsicht-PIN, PIN1 a) | `lernsteig/gemeinsam/konten.js` | für Jugendliche statt Aufsicht (AU1 a), PIN freiwillig, Code-Format gleich, ohne Sicherheitsfrage und ohne Zurücksetzen mit Frist | **im Kern seit 1.2.0** (`kern/geheimnis.js`, `kern/person.js`, 2026-11-05 LERN_Session15) für beide Apps (Eulenpfad seit 1.3.0: Profile als `lernspiele:personen`); Anmeldung im Tab **im Kern seit 1.7.0** (`kern/anmeldung.js`, 2026-11-06 LERN_Session16) | — |
| Sichern und Einlesen als Datei, Zusammenführen | `docs/eulenpfad/rahmen.md` 10 „Zusammenführen“ (`LS.zusammenfuehren`), Entscheid LERN-5 b | `lernsteig/gemeinsam/daten.js`, `lernsteig/start/statistik.js` | Format `lernsteig-sicherung` v1; Runden und Rekorde nach Kennung statt nach Kind/Zeit/Spiel; Konto je Konto statt je Feld; ohne Löschvermerke und ohne Ordner-Abgleich | 2026-11-05 LST_Session1 | im Kern seit 2026-11-06 (LERN_Session18, `kern/daten.js`, Format `reihe-daten`; beide Apps umgestellt; Ordner-Abgleich folgt, DF3 a) |
| Aufsicht mit PIN, Einstellungen des Geräts nur mit Aufsicht | `docs/eulenpfad/rahmen.md` 6 (Aufsicht-PIN, PIN1 a) | `lernsteig/gemeinsam/konten.js` (Aufsicht), `lernsteig/start/aufsicht.js` | mehrere Aufsichten mit Rolle; sieht nur verbundene Konten (Zustimmung des Jugendlichen mit PIN), für den Jugendlichen sichtbar (AU1 a); ohne Sicherheitsfrage | 2026-11-05 LST_Session1 | ja (PIN, Code, Anmeldung im Tab), Verbindung nein |

Hinweise:
- „Herkunft“ mit Pfad und Abschnitt (etwa `eulenpfad/spiele/gemeinsam/spiel.js`, „Kurztasten“; `docs/eulenpfad/rahmen.md` 19).
- „Stand“: Datum und Sitzung der Kopie; bei späteren Änderungen an einer Seite neue Zeile oder Vermerk.
- „Kern-Kandidat?“: ja, wenn beide Apps dieselbe Logik brauchen (Speicher, Anmeldung, PIN, Kurztasten, Bildhöhe,
  Messwerkzeug, Testskript); nein, wenn die Kopie bewusst eigene Wege geht (Ton, Belohnung, Darstellung).
