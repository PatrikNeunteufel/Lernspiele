# LERN_Session18_2026-11-06

## Schwerpunkt
Die offenen Kern-Teile nach AN2 a: ein Dateiformat für Sichern, Einlesen und Abgleich (Kern 1.15.0–1.16.0, beide Apps
umgestellt), der Abgleich über einen Ordner als Kern-Teil (1.17.0), die Rollen der Aufsicht (1.18.0, beide Apps), dazu
der Zuschnitt des letzten Teils, des Ablaufs einer Runde (AR1 a). Unterwegs: ein Einlese-Fehler im Eulenpfad, der online
war, eine Schutzlücke für Personen mit PIN im Abgleich (DF4 a) und auf Hinweis Patrik das Lob nach einer richtigen
Antwort in allen Spielen (LB1 a, LB2 a). Entscheide DF1–DF4 a, AS1 a, LB1 a, LB2 a, RL1 a, RL2 a, AR1 a. Acht Commits von
`a5c5784` bis `ffd7f8e`, dazu der Zuschnitt AR1 a und dieser Abschluss (noch nicht committet); nichts gepusht.

## Neu
- **Kern 1.15.0–1.18.0** (`kern/`, docs/kern/rahmen.md 4.19–4.21):
  - `daten.js` (`KERN.daten`, DF1 a, DF2 a): Format `reihe-daten` für alle Apps; erst jeden Eintrag prüfen, dann nur
    Geändertes schreiben, alles oder nichts; Löschvermerke (Person nach Kennung und Name, Runden je Inhalt) und Freigabe im
    Kern; Teile der App (Meldungen); ältere Dateien `eulenpfad-daten` 1–3 und `lernsteig-sicherung` 1–2 umgedeutet, Dateien
    der anderen App mit ihrem Namen abgewiesen; `einlesen(…, { rollen })`, Option `gueltig` (1.16.0).
  - DF4 a in `person.js`: `fuerDatei` (geschützte Person ohne PIN-Prüfwert, mit `geschuetzt` und dem Prüfwert des
    Codes), `gesperrt`, `freischalten`; `anmeldung.js` nimmt Gesperrte nicht an; eine eigene PIN nimmt den Vermerk weg.
  - `abgleich.js` (`KERN.abgleich`, DF3 a): Ordner-Abgleich aus dem Eulenpfad, in Node mit Ersatz-Ordner geprüft.
  - `rollen.js` (`KERN.rollen`, RL2 a): Bestätigung durch eine bestehende Aufsicht, PIN vergessen (andere Aufsicht, Code,
    Sicherheitsfrage), Zurücksetzen mit Frist von 3 Tagen.
- **Eulenpfad:** Seite zum Freischalten einer 🔒 gesperrten Aufsicht (Code oder PIN einer anderen Aufsicht, neue PIN);
  `def.lob` für eine eigene Lobliste (LB2 a) in 8 Sprachspielen; Prüfer „Lob“ im Testskript (Haken `gelobt`).
- **Lernsteig:** Freischalten gesperrter Konten und Aufsichten (Anmeldung, Personen-Knopf); Sicherheitsfrage beim Anlegen
  einer Aufsicht; „PIN vergessen?“ der Aufsicht mit Code, Frage oder PIN einer anderen Aufsicht; „⏳ Zurücksetzen“ mit
  Hinweis auf der Anmeldung und Abbrechen.
- **Tests:** „Sichern und Einlesen“ in `tools/pruefe_spiele.js` (auch einzeln `daten`), Zufallsnachrechnung „Abgleich in
  beide Richtungen“ (150 Fälle) und Ersatz-Ordner in `tools/pruefe_kern.js`, DF4/AS1/RL2 in `tools/pruefe_konten.js`.
- `.claude/launch.json`: Startprofil `lernspiele-4` (Port 8771 fest).

## Geändert
- **Eulenpfad:** Sichern, Einlesen, Abgleich, Löschen und Zurücksetzen über den Kern (`LS.zusammenfuehren`,
  `LS.abgleichDaten`, `LS.sicherung`); `abgleich.js` nur noch Hülle; Statistik und Verwaltung zeigen beim Einlesen den
  Grund in einem Satz. Entfernt: eigene Löschvermerke, `LS.ohneGeheimnis`, `meldungenZusammenfuehren`, doppelte Sicherung.
- **Lob (LB1 a):** Auf Anhieb steht in allen Spielen nur ein Lob aus der Liste; Text und Erklärung des Spiels kommen nur
  nach einem Fehlversuch. Vorher zeigten 137 von 169 Spielen auch auf Anhieb Rechnungen oder Begründungen.
- **Lernsteig:** `lernsteig/gemeinsam/daten.js` als Hülle über `KERN.daten`; Aufsichten in einer Datei nur mit
  angemeldeter Aufsicht (AS1 a); eine weitere Aufsicht braucht nur eine Bestätigung, wenn es eine Aufsicht mit PIN gibt.
- Doku: rahmen.md 4, 6, 10; lernsteig/rahmen.md 5, 5c, 5d; docs/kern/rahmen.md 4.7, 4.11, 4.19–4.22; Plan B (Stand,
  Entscheide); gemeinsame_mechaniken.md.

## Stolperfallen
- **Einlesen im Eulenpfad seit LERN_Session15 kaputt, online:** Die Prüfung verlangte `profile`, das `c8f7d9f` nicht mehr
  schrieb; kein Test las eine eigene Datei wieder ein. Jetzt Test „Sichern und Einlesen“, Gegenprobe schlägt an.
- **Schutz ging im Abgleich verloren:** Eine Person mit PIN kam auf dem anderen Gerät ohne PIN an (Eulenpfad: PIN der
  Aufsicht ohne Frage festlegbar; Lernsteig: Konto offen). Nachgerechnet: alle PINs sind gegen den Prüfwert in 1,2 s
  durchprobiert, darum reist nur der Code (DF4 a).
- **Löschvermerk liess Runden ohne Person zurück** — erst die Zufallsnachrechnung (31 von 150 Fällen) zeigte es. Regel
  jetzt wie im Eulenpfad: weg nur, wer seither weder geändert wurde noch gespielt hat.
- **Selbst gebaute Datei als Umweg um D5** (Lernsteig, Jugendlicher liest ein) — beim Bauen gefunden, AS1 a.
- **Stale `gesperrt` nach eigener PIN** (PIN vergessen, später entfernt) hätte wieder gesperrt — im Kern behoben.
- **Lob mit Erklärung trotz WZ2 a:** Die Regel hing davon ab, dass jedes Spiel trennt; 137 von 169 gaben trotzdem
  eigenen Text ins Lob (Rechnung, Begründung, Bestätigung), nur 12 waren in LERN_Session17 getrennt worden. Jetzt setzt
  der Rahmen sie durch und der Prüfer „Lob“ wacht. **Hook-Kandidat** erfüllt: ist jetzt Prüfer.
- Vorschau: `server.py` hängt an der Portangabe in `launch.json`; 8767/8769 belegte eine andere Sitzung, `autoPort` lief
  ins Leere (Server auf 8767 statt 8768). Eigenes Profil mit festem Port.
- Heredocs mit `\n` vom Hook abgewiesen (dreimal) — Skripte als Datei im Scratchpad oder Edit-Werkzeug.
- Ein Python-Schreiben auf `docs/kern/rahmen.md` scheiterte einmal mit „Invalid argument“ (Datei wohl kurz gesperrt);
  die Datei blieb unversehrt.
- `pruefstand.js` war zwischendurch geändert, nicht von mir (Entwickler-Modus); nicht angefasst.

## Verifikation
- Kern: „5545 Fälle, 0 Fehler.“ (Kopien aller drei Apps auf 1.18.0).
- Lernsteig: Konten „72 Fälle, 0 Fehler.“; `pruefe_uebungen.js` mit Seiten im Ersatz-DOM „0 Fehler, 0 Hinweise.“
- Gratwanderung: „Keine Fehler.“
- Eulenpfad: nur Stichproben (zuletzt zahlenhaus, au-cafe, daten; davor die 8 Sprachspiele, quader-volumen,
  quelle-heure, kulturen-koffer, anlaut-angel, preis-tabelle, bionik-paare) „Keine Fehler.“ Klickzahlen gleich bis vor
  LB1 a; seit LB1 a verschiebt sich die Folge der Zufallsaufgaben (das Lob zieht jetzt immer aus der Liste).
- Browser: Freischalten im Eulenpfad (Code) und im Lernsteig (Code, Bestätigung); Frist im Lernsteig (Hinweis, Abbrechen,
  PIN vergessen über die Frage) und im Eulenpfad (per Skript).
- **Nicht geprüft:** voller Eulenpfad-Lauf (Entscheid Patrik; seit LERN_Session17 nicht mehr, dazwischen WZ2 a, LB1 a,
  neue Textsuche und alle Kern-Umbauten); Ordner-Abgleich mit einem echten Ordner; Ablauf der Frist im Lernsteig im
  Browser; 375 px.

## Offene Punkte / Plan für die nächste Session
1. **`runde.js` (AR1 a):** zuerst die Einzelentscheide vorlegen, je mit Zahlen — `zeit` Start oder Ende, `dauer` s oder
   0,1 s, Serie im Protokoll, Fehlerliste je Aufgabe, Gedächtnis gegen Wiederholungen (Fenster, auch in normalen Runden),
   Kürzen bei erschöpfter Stufe, Beginn der Zeitmessung, Rückmeldung bei Richtig im Lernsteig; dann die reinen Hilfen
   (Fingerabdruck, Kennung, Gedächtnis, Rekord, Wächter, Bestwert), dann den Ablauf.
2. **Lernsteig:** Abgleich über einen Ordner in der Verwaltung (Plan C5) mit dem Zusatz zu AS1 (was über den Ordner der
   Aufsicht kommt, gilt als von ihr gebracht) — zur Entscheidung vorlegen.
3. **Vor dem nächsten Push** (15 Commits liegen lokal): voller Eulenpfad-Lauf nach Patriks Entscheid; das neue Dateiformat
   lesen nur Geräte mit neuem Stand (DF1 a, Kipppunkt) — Geräte nach dem Push einmal neu laden.
4. Dann B2 Schritt 3, C3–C8, C10. Prüfen durch Patrik: Zeichnungen und Listen aus LERN_Session17.
