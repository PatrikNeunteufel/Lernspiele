# LERN_Session26_2026-11-09_speicherschicht-eulenpfad

## Schwerpunkt
Schritt 2 der Speicherschicht nach docs/konzept_gruppen.md 5a: der Eulenpfad auf `KERN.speicher` mit grossen Schlüsseln
in IndexedDB (Plan D11, D11 a, D11-W a; Report LERN_Session25 Punkt 1). Kern unverändert 1.34.0. Ein Commit `7357cde`,
dazu dieser Abschluss; nichts gepusht (auch die Commits aus LERN_Session25 nicht).

## Neu
- **Ablage** (`eulenpfad/spiele/gemeinsam/spiel.js`): `protokoll`, `rekorde`, `meldungen`, `geloescht` in IndexedDB
  `lernspiele-ablage`; liegt ein Schlüssel beim Umzug in beiden Speichern, werden Löschvermerke
  (`KERN.daten.vermerkeVereinen`) und Meldungen (`KERN.meldungen.zusammenfuehren`) nach ihren Regeln vereinigt, Runden
  und Rekorde nach Kennung — wie im Lernsteig.
- **Start nach dem Laden:** `LS.bereit`, `LS.nachBereit`, `LS.beiBereit`. `LS.spiel` (damit auch `spielMitStimme`),
  `start/start.js` und `mix/mix.js` zeichnen erst nach dem Laden; der Umzug alter Stände (Profile → Personen, Felder,
  Kennungen) und der Abgleich (`abgleich.js`) laufen über `beiBereit`. **Ohne IndexedDB** lädt `spiel.js` synchron am
  Ende — die Testskripte laufen dadurch unverändert, mit gleichen Klickzahlen.
- **Speicher voll:** Band `.speicher-voll` (reserviert, `stil.css`) oben auf der Seite, für eine erwachsene Person
  geschrieben; ausgelöst von der Rückgabe in `protokolliere`/`speichereRekord` und von `beiFehler` (IndexedDB).
- **Verwaltung:** Einstellungen → Speicher (Belegung, Warnung ab 80 %, „Browser bitten, nichts von selbst zu löschen“);
  ohne Abgleich-Ordner Erinnerung ans Sichern nach 14 Tagen oben in der Verwaltung. Als Sicherung zählen „💾 Alle
  sichern“ (Statistik) und „💾 Abgleich-Datei sichern“, die Sicherung eines einzelnen Kindes nicht — Abweichung vom
  Lernsteig, der jede Datei zählt.
- **Andere Tabs:** Die Startseite zeichnet neu, wenn ein anderer Tab Runden oder Meldungen speichert (BroadcastChannel).
- **Test:** Teil `speicher` in `tools/pruefe_spiele.js` über `tools/eulenpfad_seiten.js` (`oeffne` jetzt für jede Seite und
  mit IndexedDB-Ersatz; 21 Prüfschritte in sechs Fällen: ohne IndexedDB, Umzug, neue Runde, Spielseite mit Sternen aus
  der Ablage, Erinnerung und Speicheranzeige, voll, kaputt). `tools/ersatz_idb.js` nimmt `__idbOpt` im Kontext.

## Geändert
- Doku: docs/eulenpfad/rahmen.md 8 (Teil `speicher`) und neu 23 (Speicher), Konzept Gruppen 5a (Stand), Plan D11
  erledigt, CHANGELOG.

## Stolperfallen
- **Speichern-unter-Dialog aus der Vorschau:** Um die Mix-Seite zu verlassen (offene Verbindungen hielten das Löschen der
  Test-Datenbank auf), schickte ich den Vorschau-Browser auf `eulenpfad/README.md`. `tools/server.py` liefert `.md` ohne
  Typ (`application/octet-stream`), der Browser öffnete „Speichern unter“ — Patrik sah einen Dialog, den er nicht
  ausgelöst hatte. Abgebrochen, nichts gespeichert. Künftig zum Verlassen nur eine HTML-Seite (`portal/index.html`).
  Erstes Vorkommen; **Hook-Kandidat** erst beim zweiten: Navigation der Vorschau auf eine Nicht-HTML-Datei abweisen.
- **Gegenprobe meldete irreführend:** „Band doppelt“ auch, wenn gar kein Band da war (Prüfung `=== 1` statt `<= 1`);
  berichtigt.
- **Hooks** wiesen richtig ab: Backslash im Heredoc (1).

## Verifikation
- Kurze Prüfungen ganz: Skripte „Keine Fehler.“, Kern „5888 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“
  (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“
- Eulenpfad-Teil `speicher`: „Keine Fehler.“ (21 Prüfschritte). Gegenproben (3), alle gemeldet: ohne Hörer auf
  `beiFehler` (2 Fehler), ohne grosse Schlüssel (9), Spiel ohne Warten (Abbruch „vor bereit() gelesen“).
- **Stichprobe mit Vergleich:** tab, daten, suche, zahlenhaus, einmaleins-blitz, anlaut-angel, hoer-geschichte,
  kiosk-kasse auf HEAD `c119a50` (per `git archive` nach `.temp/alt`, danach entfernt) und auf dem neuen Stand — gleiche
  Ausgabe, gleiche Klickzahlen; einziger Unterschied die Prüfliste der Wortlisten, die im Archiv ohne `docs/` fehlte.
- Browser (Vorschau 8769, Chromium, echte IndexedDB): Runde und Rekord im alten Format in localStorage → nach dem Laden
  umgedeutet in der Ablage, localStorage leer; Zahlenhaus s1 gespielt, Runde in der Ablage, Sterne der umgezogenen
  Runde in der Stufenwahl; Statistik; Verwaltung mit Erinnerung, Speicheranzeige (5185 MB verfügbar) und Band; Mix mit
  sechs iframes; keine Konsolenfehler. Testkonten, localStorage-Schlüssel und Datenbank danach entfernt.
- **Nicht gelaufen:** voller Eulenpfad-Lauf (letzter auf `51686cd`); Handy-Breite der neuen Verwaltungsteile nicht
  eigens angesehen; echte Geräte (Konzept 5a, Abschnitt 10 Schritt 2).

## Offene Punkte / Plan für die nächste Session
1. **Voller Eulenpfad-Lauf** auf Patriks Entscheid (rund 25 min; Kern
   1.32–1.34 und die Speicherschicht seit `51686cd`).
2. **Push** der Commits seit `55ea8b9` auf Patriks Wort; danach Nachweis C11: meldet die veröffentlichte Seite an
   `http://localhost:8766`? Und die Ablage im Browser der veröffentlichten Seite (Umzug echter Daten) ansehen.
3. **Freigabe im Prüfstand** durch Patrik (sieben Listen, geänderte Übungen; E 11) — im Lernsteig mit ✏️.
4. **Hook-/Prüfer-Kandidaten** aus LERN_Session25 zur Absegnung: Kommentar am Zeilenende in Objektzeilen; Liste
   „entschieden, nicht gebaut“ aus den Konzepten gegen den Plan.
5. Prüfen auf echten Geräten (Konzept 5a, Abschnitt 10 Schritt 2): Grenzen, `persist()`, Sieben-Tage-Regel von Safari auf
   dem iPad; die neuen Verwaltungsteile auf 375 px.
6. Danach: Abgleich mit dem mathbuch, C4, C7 (Anleitung mit Hinweis auf die Sieben-Tage-Regel), C8, C10.
