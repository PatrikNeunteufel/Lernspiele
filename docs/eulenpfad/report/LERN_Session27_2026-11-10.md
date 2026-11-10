# LERN_Session27_2026-11-10_voller-lauf-push

## Schwerpunkt
Ein langer Tag in drei Teilen: (1) voller Eulenpfad-Lauf und Push, kleine Fehler aus dem Gebrauch (Untertabs, „Verbindung
prüfen“); (2) Plan C12 — Meldungsserver im Netz mit Versionen, Unterschrift, zugelassenen Aufsichten, Richtlinie,
Impressum und Anleitungen (Kern 1.35.0 bis 1.39.0); (3) Abschluss-Animationen vom Konzept über acht Muster, Ruhezeiten
und Vorschau bis zur Abnahme der Piloten und dem ersten Block des Ausrollens (M1). Dazwischen das Geburtsdatum im
Eulenpfad (Plan B3). 28 Commits von `6055527` bis `f9e7a20`, dazu dieser Abschluss; gepusht hat Patrik zwischendurch
(laut lokalem `origin/master` nichts offen — nicht abgefragt).

## Neu
- **Plan C12, Meldungsserver** (Entscheide NS1 a, NS2 a, NS2-K a, NS3 a, IM1 a, IM1-A a, IM2 c, ES1 a bis ES5 a, SR1 a):
  `tools/entwickler_server.py --netz` nimmt nur Meldungen an und gibt ihren Stand heraus, nur über https und nur, wenn er
  eine Zufallszahl der App mit dem privaten Schlüssel unterschreibt (ECDSA P-256, geprüft mit WebCrypto, Kern 1.38.0);
  Versionen von App, Kern und Protokoll in jeder Meldung (Kern 1.36.0, `<app>/VERSION`, `version.js`); zugelassene
  Aufsichten mit eigenem Schlüssel (Kern 1.37.0); Übernehmen eingereichter Freigaben nach
  `docs/richtlinie_freigaben.md` (`tools/entwicklung_abgleich.py uebernehmen`); Bemerkungen und Meldungen nicht mehr
  im Repo (gitignored); Impressum und Datenschutz `portal/impressum.html` mit Postadresse; Anleitungen
  `docs/anleitung_entwickler_server.md` und `docs/anleitung_inbetriebnahme_meldungsserver.md`, Anleitung für Erwachsene
  im Eulenpfad nachgeführt.
- **Geburtsdatum im Eulenpfad** (Plan B3): Datumsfeld wie im Lernsteig, gespeichert `JJJJ-MM-TT` über `KERN.person`;
  Profile mit nur dem Monat bleiben gültig, der Tag lässt sich nachtragen.
- **Abschluss-Animationen** (Konzept `docs/konzept_abschluss_animationen.md`, Entscheide AN1 a, AN2 a, AN3 a, AN3-Z a,
  AN3-T a „differenziert“, AN3-K a, AR1 a): `eulenpfad/spiele/gemeinsam/feier.js` (`LS_FEIER.zeige`, SVG mit SMIL) mit
  REISE, ZOOM, ZYKLUS, SZENE, WACHSEN, BAUEN, AUFTRITT, SAMMELN, KARTE; Einstellung „Abschluss-Animation“ global und je
  Spiel; Ton nur über den Ton des Rahmens (Regel 8). Acht Piloten (Rechen-Rakete, Dezimal-Rakete, Himmels-Forscher,
  Wortfamilien-Baum, Zahlenmauer-Baumeister, Instrumenten-Kenner, Anlaut-Angel, Schweiz-Karten-Suche) — von Patrik
  abgenommen. Block M1 (Stellenwert, Dezimal; zehn Spiele) mit Bildern je Spiel (`feier.bilder`: Stellentafel,
  Dienes-Bausteine, Briefe, Punkte, Karten, Seerosen, Tresor, Rutsche, rutschende Ziffern, Marienkäfer) — abgenommen,
  der Tresor danach nachgebessert.
- **Ruhezeiten** (`docs/eulenpfad/rahmen.md` 25): Zeitspannen je Wochentag, je Zeitspanne Animation, Klänge, Vorlesen,
  Hören; je Spiel abweichend; Kopfhörer und „Spiele mit Ton ausblenden“ je Gerät; Hinweis „🎧 Diese Runde braucht Ton“
  mit „Ton für diese Runde an“; Zufall und Mix nehmen Ton-Spiele in der Ruhezeit nie; reisen mit dem Abgleich (Teil
  `ruhezeiten`).
- **Vorschau** `tools/feier_vorschau.html` (nicht veröffentlicht): je Spiel mit Animation alle sechs Stufen in 1024, 768
  oder 375 px, aus dem Katalog; dazu `?feier=<stufe>&sterne=` auf jeder Spielseite (ohne Runde, nichts gespeichert).
- **Prüfungen:** Haken `schluss` in `tools/pruefe_spiele.js` (Animation je Stufe, Bewegung, Schmuck je Sternen, Summen
  der Zahlenmauer, Mengen `data-anzahl`, gültige `animateTransform`-Art); Prüfteil `ruhe`.

## Geändert
- **Untertabs der Verwaltung** brechen um wie im Lernsteig; **„Verbindung prüfen“** prüft die Adresse im Feld und nennt
  sie (Kern 1.35.0).
- **Commit-Hook** `tools/git-hooks/commit_msg.py` schreibt seine Meldung als UTF-8 (Visual Studio zeigte nur „Die Bytes
  [E4] im Index 31 …“).
- **Himmels-Forscher** nach Rückmeldung Patrik: der Mond zieht im Bogen über den Himmel, Stufe um Stufe zunehmend;
  **Sternschnuppe** mit Kopf und Schweif (der blosse Strich war nicht erkennbar).
- Doku: `docs/eulenpfad/rahmen.md` 2, 18, 24, 25; Konzept Abschluss-Animationen (Entscheide, Pilotliste mit Status,
  Abnahmeliste, Blockplan M1–M6, Abweichungen); CHANGELOG je Schritt.

## Stolperfallen
- **Stille SMIL-Fehler:** Die Tür des Zahlenrätsel-Tresors ging nie auf — `animateTransform type="matrix"` gibt es
  nicht, der Browser übergeht es ohne Meldung. Geprüft hatte ich nur das ruhige Endbild (Tür dort ohne Animation offen);
  Patrik fand es bei der Abnahme. Jetzt prüft der Haken die Art; **Anweisung Patrik, als Memory festgehalten**:
  Animationen laufend durchspielen und mit Screenshots zu mehreren Zeitpunkten prüfen. Verwandt: `erscheine` blendet die
  Deckkraft bis 1 auf und überschreibt ein `opacity` am Element (Lichtschein im Tresor) — dafür `fill-opacity`.
  **Hook-/Prüfer-Kandidat:** weitere SMIL-Prüfungen im Haken (gültiges `attributeName` je Element, `opacity` an Teilen,
  die `erscheine` bekommen).
- **Nur gerechnet statt gesehen:** In Block M1 war das Browserfenster ausgeblendet; ich prüfte die Endbilder rechnerisch
  (im Bild, keine Überlappung, Zahlen gegen die Stufen). Das fand zwei Fehler, den stillen des Tresors nicht.
- **Bereitstellen in Visual Studio:** zweimal Chaos mit bereitgestellten Dateien (einmal durch einen vorgeschlagenen
  `git rm --cached`, einmal stellte Visual Studio einen halben Zwischenstand bereit, `feier.js` älter als im Ordner) →
  Memory „Kein Staging vorschlagen“; Hinweis „Alle committen“ bei jeder Commit-Message mit neuen Dateien.
- **Variable verdeckt Funktion:** `const boden = 108` in der Rutsche verdeckte `boden()` — der Testlauf fand es sofort.
- **Weiche erbt Felder:** Eine Stufe mit eigenem Muster erbt `bilder` des Spiels (Himmels-Forscher s5) — die Weiche der
  Reise nimmt nur vorhandene Bilder.
- **Rechnen:** Zahl der übrigen Spiele zuerst falsch (81 statt 92, Französisch 7 statt 8) — aus dem Katalog gezählt.
- **Hooks** wiesen richtig ab: Backslash im Heredoc (mehrmals), Commit-Hook (Message des falschen Schritts).

## Verifikation
- Nach Kern 1.39.0 ganz: Kern „5916 Fälle, 0 Fehler.“, Server „59 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139
  Hinweise.“, Konten „106 Fälle, 0 Fehler.“, Gratwanderung „Keine Fehler.“; Skripte zuletzt 23:56 „Keine Fehler.“
- **Eulenpfad:** voller Lauf zu Beginn auf `6055527` (169 Spiele × 6 Stufen, 1442 s, „Keine Fehler.“). Danach nur
  Stichproben je Schritt: die 18 Spiele mit Animation, Ton-Spiele (hoch-tief-ohr, klang-wichtel, noten-namen,
  wort-zwillinge), tab, daten, speicher, ruhe, zahlenhaus — „Keine Fehler.“; Klickzahlen ohne Animation gleich wie
  vorher (Gegenproben je Block), mit Animation geändert (Ursache je Gegenprobe bestätigt).
- **Gegenproben** gemeldet: Schmuck und Bewegung, Summen der Mauer, Mengen, Ruhezeit-Regeln (3), ungültige Art.
- Browser (Vorschau 8769): Piloten und Ruhezeiten auf 768 und 375 px angesehen; M1 nur rechnerisch, der Tresor
  laufend nachgemessen und angesehen.
- **Nicht gelaufen:** voller Eulenpfad-Lauf seit `6055527` (spiel.js mit Ruhezeiten, Vorschau, feier.js, 18 Spiele);
  Block M1 nicht laufend mit Screenshots durchgesehen (ausser Tresor).

## Offene Punkte / Plan für die nächste Session
1. **Block M1 laufend nachsehen** (Memory „Animationen laufend prüfen“): alle zehn Spiele zu mehreren Zeitpunkten mit
   Screenshots, vor allem Tabellen-Post (Bündeln), Stufenzahl-Schieber (rutschende Ziffern), Dezimal-Rutsche, Zehntel-
   Lupe (Käfer); Patrik: Abnahme des nachgebesserten Tresors.
2. **Block M2** (Zahlen, Teiler, Begründen; zwölf Spiele) nach AR1 a, je Spiel nach seinen Stufen; „Beim Bauen zu prüfen“
   im Konzept beachten. Danach M3–M6, Deutsch, NMG, übrige Fächer.
3. **Voller Eulenpfad-Lauf** auf Patriks Entscheid (rund 25 min) — vor dem nächsten Push, der `spiel.js` mitbringt.
4. **Anleitungen** (Patrik: „erst wenn alles fertig“): Abschluss-Animation, Ruhezeiten, Kopfhörer in der Anleitung für
   Erwachsene.
5. **Nach den Animationen: Gestaltung** — Rückmeldung einer Lehrperson („steril“, „nach KI“), von Patrik
   zusammengefasst, in `docs/eulenpfad/rueckmeldung_gestaltung.md` (Eingang): Bildkarten statt Textkarten, Kinder-Bühne
   und Lehrer-Cockpit trennen, rundere Schrift und Knöpfe mit Tiefe. Erst Konzept mit Entscheidungsfragen (frühere
   Entscheide wie ST1 a abgleichen, Schrift nur als lokale Datei), Screenshots der Animationen als mögliche Kartenbilder.
6. Patrik: Inbetriebnahme des Meldungsservers zu Hause nach `docs/anleitung_inbetriebnahme_meldungsserver.md`.
