# LERN_Session16_2026-11-06

## Schwerpunkt
Zuerst die offenen Bemerkungen 11–22 (Fahrplan-Rechner, Bilder ohne Emoji), dann der gemeinsame Kern weiter bis 1.12.0
(Anmeldung mit Gast, Entwicklung, Einladung, Auswertung, Übernahme einer Aufsicht) und im Lernsteig das Grundgerüst C
vorgezogen: Anmeldung zuerst (C1) und Tabs wie im Eulenpfad (C2). Entscheide B1 a, B2 a, AZ1 a, PL1 a, EF1 a, AW1 a,
AW2 a, Ü1 a, Ü2 b, TA1 a; Vorgabe Patrik: voller Eulenpfad-Lauf erst, wenn der ganze Kern umgebaut ist. Zehn Commits von
`8e64fde` bis `99bfa17`.

## Neu
- **Bildersammlung** `eulenpfad/spiele/gemeinsam/bilder.js` (B1 a, rahmen.md 22): einzige Quelle für Bilder ohne Emoji
  (`svg:<name>`); `LS.bild`, `LS.mitBildText`, `LS.zelleMitBildern`. Umgezogen: Waschbrett, Waschmaschine, Triangel,
  Klangstab, Schlagholz. Neu gezeichnet: 24 Lebewesen (Luchs, Gämse, Steinbock, Murmeltier, Maulwurf, Spitzmaus,
  Meerschweinchen, Specht, Graureiher, Feldlerche, Sperber, Hecht, Bergmolch, Feuer- und Alpensalamander, Erdkröte,
  Blindschleiche, Libelle, Mückenlarve, Baummarder, Nachtfalter, Schilf, Edelweiss, Enzian). Lebensraum in Stufe 1–4 mit
  allen Lebewesen. Beide Listenansichten zeigen die Bilder.
- **Kern 1.7.0–1.12.0** (`kern/`, docs/kern/rahmen.md 4.7, 4.11–4.14):
  - `anmeldung.js`: ein Platz je App (gewählte Person, Sitzung im Tab für Aufsicht und PIN), Gast nur im Tab (C2 a).
  - `entwicklung.js`: Entwickler-Modus für alle Apps; Entwickler-Server mit `APPS` (Prüfstand und Bemerkungen je App).
  - `einladung.js`: Einladung als Link `#einladung=…` oder Datei (EL1 a).
  - `auswertung.js`: Sitzungen, Lernzeiten, Wochen, eine Stand-Regel mit Schwellen je App (AW2 a), Bedarf, Ziehen.
  - `person.js` `uebernehmen`: Übernahme einer Aufsicht zwischen den Apps (C9, Ü1 a, Ü2 b).
- **Lernsteig:** Anmeldung zuerst mit „Ich bin neu“ und Gast (C1); ein Platz für Jugendliche und Aufsicht; Tabs Übungen ·
  Profil · Statistik · Erfolge · Verwaltung (C2); Entwickler-Leiste in den Übungen und Freischalten in der Verwaltung (C6
  zum Teil); Einladung auch als Datei; Aufsichten des Geräts im Konto des Jugendlichen (EF1 a); Erfolge mit Rekorden.
- **Eulenpfad:** „Einladung zum Lernsteig“ im Profil eines Kindes der 6. Klasse (EP1); „In den Lernsteig übernehmen“ im
  Profil der Aufsicht; „↑ Alle Apps“ zum Portal (PL1 a, auch in Lernsteig und Gratwanderung).
- **Testskript Eulenpfad:** fehlendes Bild und Bildname als Text sind Fehler.

## Geändert
- Fahrplan-Rechner: bei einer Dauer „? h ? min“ in Anzeige und Rechnung (Bemerkung 11).
- Eulenpfad: Anmeldung, Entwicklung, Auswertung (Bedarf und Vorschläge aus den letzten 24 Aufgaben, bei Runden zu acht
  gleich wie bisher) und Lernplan über den Kern; `LS.*`-Schnittstellen unverändert.
- Lernsteig: Runden der Aufsicht mit `test`, Gast speichert nichts; Kompetenzstand und Wochenserie über den Kern;
  `statistik.html` und `aufsicht.html` leiten auf die Tabs weiter; Prüfstand im JSON-Format des Servers.
- Prüfvermerk `lebensraum/nahrungsketten` aufgehoben (B2 a), bis die neuen Bilder geprüft sind.
- CLAUDE.md: Datenschutz-Ausnahme Einladung, Steckbrief Entwickler-Modus. Erinnerungen: voller Lauf erst nach dem Kern,
  patchlib nur mit LF.

## Stolperfallen
- **Natives `append`/`replaceChildren` mit `null` schreibt „null“** — dreimal in dieser Sitzung (Startseite des
  Lernsteigs, auch ein älterer Fall ohne Einladung; Entwickler-Leiste). Jedes Mal erst im Browser bemerkt.
  **Prüfer-Kandidat:** Seitentest im Ersatz-DOM (B2) sucht „null“, „undefined“, „NaN“ im sichtbaren Text.
- **`\r\n` im Ersatztext von patchlib** ergab in CRLF-Dateien `\r\r\n` — zweimal (11 und 3 Stellen), `--pruefe` meldet
  es nicht. **Hook-Kandidat:** patchlib weist ein `\r` im Ersatztext ab oder `--pruefe` zählt `\r\r`.
- Der Hook gegen Backslashes im Heredoc schlug mehrmals an; mit `chr(10)` oder Skript-Dateien umgangen (wie vorgesehen).
- Ein ungefragt gestarteter voller Lauf (25 min) während des Umbaus — abgebrochen; Vorgabe jetzt in der Erinnerung.
- Zweimal doppelt in eine Seite geladenes `bilder.js` (von Hand beim Prüfen) gab „BILDER already declared“ — kein
  Fehler der App; frische Seite sauber.
- Browser-Zwischenspeicher lieferte einmal das alte `start.js`; nach Neuladen richtig.
- Erste Fassung der Übernahme nahm die Art nicht mit (im Browser gefunden, behoben).
- `PRUEFSTAND`-Änderungen von Patrik (Lebensraum-Listen) lagen ungefragt im Arbeitsbaum — nicht angefasst, im Commit
  vermerkt.

## Verifikation
- Kern: `node tools/pruefe_kern.js` „5337 Fälle, 0 Fehler.“, mit Nachrechnungen (Fenster 24 = letzte drei Runden in
  2000 Fällen, `wochen` = Wochenserie des Lernsteigs in 500 Fällen); Kopien in allen drei Apps gleich (1.12.0).
- Alte gegen neue Auswertung des Eulenpfads: Bedarf 12 000 Fälle, Vorschläge 3000 Verläufe, 0 Abweichungen.
- Lernsteig: `pruefe_uebungen.js` „0 Fehler, 0 Hinweise.“, `pruefe_konten.js` „48 Fälle, 0 Fehler.“
- Eulenpfad: Stichproben (zuletzt zahlenhaus, anlaut-angel, preis-tabelle, fahrplan-rechner, lebensraum, frueher-heute)
  „Keine Fehler.“ mit gleichen Klickzahlen wie im (abgebrochenen) Lauf von heute; dessen Hauptteil (1000 Spiel × Stufe)
  ohne Fehler.
- Browser: Bilder im Spiel und in den Listenansichten; Anmeldung, Gast, Aufsicht, Tabs, Einladung Eulenpfad → Lernsteig,
  Übernahme in beide Richtungen, Entwickler-Leiste mit Server (falscher Schlüssel), Desktop und 375 px; Testdaten gelöscht.
- **Nicht geprüft:** voller Eulenpfad-Lauf (erst nach dem Kern), Browser-Teil des Lernsteig-Testskripts (Playwright,
  läuft lokal nicht; wird mit B2 neu), „Als Datei“ der Einladung (Datei-Dialog), echtes „Übung angesehen“ mit dem echten
  Schlüssel, echte Geräte.

## Offene Punkte / Plan für die nächste Session
1. **Kern fertig (Plan B):** Terme und Rechenkern des Rechners (nur Lernsteig, ohne verdeckte Globals).
2. **Testgerüst B2** auf den fertigen Seiten: Seitentests des Lernsteigs im Ersatz-DOM (mit Suche nach „null“), Browserteil
   ohne Playwright; danach der **volle Eulenpfad-Lauf** (neue Grundlage der Klickzahlen) und vor dem Push je Gerät eine
   Sicherung.
3. **Prüfen (Patrik):** die neuen Bilder in der Prüfansicht (Lebensraum-Listen, Nahrungsketten wieder abhaken),
   Lernsteig-Übungen mit dem Entwickler-Modus freigeben.
4. Danach Grundgerüst C weiter: C3 Tab Übungen wie Tab Spiele, C4 Profil, C5 Verwaltung (PIN vergessen in Stufen),
   C6 Freigabe je Gerät, C7 Anleitungen, C8 Gratwanderung; dann D, E, F, G, H.
