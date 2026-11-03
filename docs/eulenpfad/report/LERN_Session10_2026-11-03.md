# LERN_Session10_2026-11-03

## Schwerpunkt
Auftrag Patrik: **Runde B** der 3. Klasse (T1–T8, 8 Spiele) nach `spielideen/lehrplan_3_und_6.md`, danach der
**Rest der Liste** (Runde C: S8, S9, S14, S15, T9–T11, 7 Spiele): 150 → 165 Spiele, damit sind beide Ideenlisten
abgearbeitet. Gebaut wie in LERN_Session9 mit je einem Bau-Agenten pro Spiel nach einem festen Regelwerk
(`bau_regeln.md` im Scratchpad: Pflichtlektüre, Pflichten, Prüfen, Bericht); die Lehrplan-Codes vorher gegen eine
frisch gelesene `stufen.json` geprüft. Dazwischen und danach Wünsche Patrik zur Startseite und zum Rahmen: Filter
(Zeile „Nur“, Mehrfachwahl, Klasse), Zufallskarten mit Bedarfsgewichtung, Suche mit persönlicher Passung,
„Ähnliche Spiele“, Lernplan mit Wochenziel (Entscheid L1 a), Tab „🏅 Erfolge“ mit Abzeichen zum Teilen.
Neun Commits, jeweils an einem sinnvollen Schritt mit Pause (Regel Patrik, siehe Stolperfallen).

## Neu
- **Runde B, 3. Klasse** (T1–T8; Lernziele und Annahmen in `lernziele/lehrplan_sg_session10.md`, Prüfliste
  Teile 70–76): Platzhalter-Geschichten (MA.3.C.2/3), Zeit-Schätzer (MA.3.A.1, NMG.9.1), Würfel-Zähler
  (MA.2.A.3), Auge-Entdecker (NMG.4.3 — der Lehrplan nennt ausdrücklich Hornhaut, Bindehaut, Tränenflüssigkeit),
  Gemeinde-Helfer (NMG.10.3, neues Thema Gemeinschaft), Gefühle-Radar (D.1.C.1, lesearm), Geschichten-Ordner
  (D.4.D.1, D.3.B.1, neues Thema Erzählen), Hör-Geschichte (D.1.B.1).
- **Runde C** (Prüfliste Teile 77–82): Basisklasse 6 — Quader-Volumen (MA.2.A.3.e, MA.3.A.1.h), Diagramm-Wahl
  (MA.3.A.1.h, MA.3.C.1), Gattungs-Kenner (D.6.C.1), Figuren-Spiegel (D.2.C.1); Basisklasse 3 — Kulturen-Koffer
  (NMG.9.3), Hello-Dialog (FS1E.3.A.1, neues Thema Dialoge), Lärm-Wächter (NMG.4.2). Sechs neue Lernziel-Codes
  im Katalog, Themen Zeit, Körper, Gedichte erweitert.
- **Startseite** (rahmen.md Abschnitt 6): „🎒 Meine Klasse“, „⭐ Mein Fokus“ und „🔍 Zu prüfen“ in einer eigenen
  Zeile **Nur** (kein Fach); **Thema, Stufe und Klasse als Mehrfachwahl** („Alle“ wählt alles an, nochmals alles
  ab; Klasse = Basisklasse 1.–6., für alle sichtbar); unter dem Filter die Karten **🎲 Zufallsmix** und
  **🎯 Zufälliges Spiel** im Aufbau der Spielkarten.
- **Bedarf** (`AUSWERTUNG.bedarf`, `AUSWERTUNG.ziehe`): wackelnde Runden hoch, nie gespielt mittel, kürzlich
  sicher niedrig, sicher aber über sieben Tage her wieder mittel, Fokus doppelt. Gilt für das Zufällige Spiel,
  die Spiele einer Zufallsmix-Runde (Übertritts-Check bleibt gleichmässig) und als Passung in der Suche.
- **Suche mit Passung** (`LS.passung`, rahmen.md 6): für ein Kind Faktor 1 + 0.5 · (Nähe der Basisklasse + Bedarf)/2
  auf die Textrelevanz; Aufsicht und Testskript neutral. **„🔗 Ähnliche Spiele“** (`LS.aehnlich`): Knopf auf
  Startblatt und Schlusskarte jedes Spiels, Liste auf der Startseite (`?aehnlich=<id>#spiele`) nach gleichem
  Lernziel (4 je Code) und Thema (3), Fach 1 dazu, Basisklasse-Abstand als Abzug, mit Passung.
- **Lernplan und Erfolge** (Entscheid L1 a, Annahme B1; `spiele/gemeinsam/erfolge.js`, `start/erfolge.js`,
  rahmen.md Abschnitt 15): Wochenziel je Kind (Aufsicht: Tage × Minuten in Verwaltung → Konten), Wochenstern 🌟
  und Serie; Wochenkarte im Tab Spiele (kompakt), im Tab **🏅 Erfolge** und in der Statistik (zwölf Wochen);
  24 Abzeichen mit Fortschritt, 🆕 am Tab und als Hinweis im Tab Spiele, bis das Kind sie gesehen hat
  (Profilfelder `lernplan`, `erfolgeGesehen`); „📤 Teilen“ als PNG über den Teilen-Dialog des Geräts, sonst
  speichern — nur auf Knopfdruck, der Vorname reist mit (Datenschutz-Ausnahme in CLAUDE.md).
- **Zufallsmix** sagt Kindern, wie viele passende Spiele noch nicht freigegeben sind (Hinweis Patrik: der
  Übertritts-Check „mischte nicht“ — für Kinder ist von 35 Spielen der Basisklasse 5/6 nur die Velo-Tabelle frei).
- Entscheid **V1 a**: Rechen- und Sachtexte dürfen in `frage` stehen und werden vorgelesen (rahmen.md 12).

## Geändert
- Katalog: 15 Einträge, Themen Erzählen, Gemeinschaft, Dialoge; Zeiten je Stufe nach den Berichten der Agenten.
- `tools/pruefliste_wortlisten.js`: Runden 6 und 7 (13 neue Listen); `tools/checkliste.js`: Glace-Kombinator und
  Mots-Match als gebaut erkannt (0 Ideen offen).
- Name „Gefühle-Spürnase“ → **Gefühle-Radar**, weil „Spürnase“ sonst dreimal vorkäme (Grundwort-Regel); ebenso
  „Figuren-Blick“ → Figuren-Spiegel, „Gattungs-Lupe“ → Gattungs-Kenner, „Lärm-Detektiv“ → Lärm-Wächter,
  „Alte Kulturen“ → Kulturen-Koffer vor dem Bau.
- Diagramm-Wahl: Mini-Diagramm-Knöpfe mit Silbentrennung (Beschriftungen überlappten auf 375 px).
- Ähnliche Spiele: Treffer nur über das gleiche Fach fallen weg (Zahlenmauer wäre „ähnlich“ zur Uhr-Werkstatt).

## Stolperfallen
- **Commit-Pause** (Patrik): Die Commit-Message stand in einem Zwischentext und ging unter, und der Katalog war
  schon für die nächste Runde geändert. Seither: am sinnvollen Schritt anhalten, Arbeitsbaum genau auf diesen
  Schritt bringen, Message als letzte Ausgabe, weiter erst nach dem Commit. Als Merkposten gespeichert.
- **Verzweigung master/origin**: Patrik hatte den gepushten Commit lokal mit „Korrigieren“ (amend) umgeschrieben;
  identische Dateistände, nur die Message anders → `push --force-with-lease` (Entscheid G1 a).
- **Grundwort-Regel** griff erst im vollen Testlauf (Spürnase dreimal); seither Namen vor dem Bau gezählt.
- **Browser-Cache**: `localhost:8769` lieferte nach einer Änderung an `spiel.js` noch die alte Fassung (25 statt
  13 ähnliche Spiele); Node-Rechnung bestätigte den Code. Auf dem Tablet nach Rahmen-Änderungen hart neu laden.
- **Prüflisten-Werkzeug**: Konstantennamen kollidierten zweimal (`ZS`, `GK`) — neue Blöcke mit längeren Namen.
- **Bausteine beenden die Aufgabe**: `LS.auswahl`/`LS.reihenfolge` rufen `ctx.richtig` beim ersten Treffer; sechs
  Spiele bauen mehrstufige Fragenfolgen deshalb von Hand (Wortarten-Probe, Hör-Reporter, Hör-Geschichte,
  Figuren-Spiegel, Sachtext-Spurensuche, Gattungs-Kenner). **Rahmen-Kandidat** LERN-45: Baustein „Fragenfolge“.
- Hook-Bedarf: keine Regel zweimal von Hand durchgesetzt; der Backslash-Heredoc-Hook und der Backtick-Hook
  griffen je einmal (Skripte als Datei abgelegt).

## Verifikation
- `node tools/pruefe_spiele.js` über alle 165 Spiele × 6 Stufen nach Runde B, nach Runde C und zuletzt nach den
  Rahmen-Änderungen (Schlusskarte, Suche, Erfolge): jeweils **„Keine Fehler.“**, 17 bekannte Hinweise (zu wenig
  verschiedene Aufgaben, Grundwörter Detektiv/Sortierer/Puzzle). Suchfälle unverändert grün.
- Browser (localhost:8769, Testdaten danach gelöscht): alle 15 neuen Spiele auf 375 px; Startseite mit Filtern,
  Zufallskarten (Zufälliges Spiel startet Runden-Rutsche), Ähnliche Spiele (13 zur Uhr-Werkstatt), Klassen-Filter
  (6. Klasse → 18 Spiele); Zufallsmix mit Bedarf und Hinweis auf gesperrte Spiele; Lernplan in Verwaltung,
  Statistik, Spiele und Erfolge; Abzeichen mit 🆕 und Hinweis.
- **Nicht geprüft:** „📤 Teilen“ auf einem echten Gerät (Teilen-Dialog, Emoji im PNG); Sachangaben der 15 neuen
  Spiele; echte Geräte und Kinder; Wahl-Aufgabe der Diagramm-Wahl im Browser nach der CSS-Korrektur.

## Offene Punkte / Plan für die nächste Session
1. **Patrik fachlich prüfen** (LERN-43): Annahmen Runde B und C in `lernziele/lehrplan_sg_session10.md` und die
   ZU-PRÜFEN-Köpfe der 13 Inhaltsdateien (Notrufnummern, Gemeinde-Zuordnungen, Dauern, Auge-Sätze, Abfolgen,
   Schluss- und Titelfragen, Gefühlswörter, Diagramm-Konventionen, Gattungsbegriffe, Kulturen-Fakten,
   Dialog-Wortschatz, Lärm-Skala).
2. **Freigeben** (LERN-21): 38 von 165 Spielen frei; der Übertritts-Check braucht Spiele der Basisklasse 5/6.
3. **Teilen prüfen** (LERN-46) auf Tablet und Handy; Vorlesen anhören (LERN-37).
4. **Rahmen-Kandidat** LERN-45: Baustein „Fragenfolge“ (mehrere Fragen je Aufgabe mit `ctx.schritte`, Erledigt-Liste,
   Tipps je Frage), danach die sechs Spiele darauf umstellen.
5. Weiter offen: LERN-39, LERN-35, LERN-40, LERN-41, LERN-31, LERN-4, LERN-33, LERN-34.
