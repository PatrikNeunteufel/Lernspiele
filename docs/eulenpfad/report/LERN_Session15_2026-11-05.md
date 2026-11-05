# LERN_Session15_2026-11-05

## Schwerpunkt
Zuerst der Notizblock (Rechnungen mischen) und die Anleitungen. Danach die Prüfung der Cloud-Sitzung LST_Session1
(Repo `Lernsteig`, 64 Commits) und der lokalen Recherchen mit drei Prüfagenten (Mathe fachlich, Code und Architektur,
Recherchen), das Urteil, die Erfassung aller Arbeiten im [Plan zum Angleich der Reihe](../../plan_angleich_reihe.md) und
die Rücknahme des Lernsteigs nach Lernspiele. Dann der gemeinsame Kern der Reihe in sechs Schritten bis 1.6.0. Entscheide
A1, A2, C1 (mit Filter), C2, F1, P1, P2, R1 (alle a); Vorgaben Patrik: Geburtsdatum vollständig (B3), Profil-Übernahme
zwischen den Apps (C9), Testläufe im Umbau als Stichprobe (globale Regel). Zehn Commits von `2f8fc70` bis `c8f7d9f`.

## Neu
- **Notizblock mischt Rechnungen** (Wunsch Patrik): Plus und Minus in einer Spalte (Zeichen je Zahl), „Weiterrechnen“
  hängt bis zu sechs Rechnungen jeder Art an, die erste Zahl ist das geschriebene Ergebnis der vorigen; Ziffernfeld fest
  unten mit dem eingestellten Dezimalzeichen; Platz unter 1100 px unten, Tablet quer ab 980 px rechts. Anleitungen mit
  Notizblock, Klassen-Rand und Filter, alle Bilder neu.
- **Lernsteig in Lernspiele** (A1 a, A2 a): nach Pfadliste übernommen (`8f55173`), im selben Commit gesperrt — Prüfstand
  `lernsteig/gemeinsam/pruefstand.js`, alle 27 Übungen „noch nicht freigegeben“, die Aufsicht sieht sie mit Vermerk.
  Cloud-Repo abgeschlossen. `.gitignore`: `lernsteig-*.json`, `gratwanderung-*.json`, `__pycache__/`.
- **Plan zum Angleich** (`docs/plan_angleich_reihe.md`): Pakete A Rücknahme · B Kern und Testgerüst · C Grundgerüst
  Lernsteig wie Eulenpfad (Anmeldung zuerst mit Gast, Tabs, Kacheln, Suche, Prüfungsvorbereitung, Aufsicht, Lehrperson,
  Profil-Übernahme) · D Fehler D1–D14 · E Fachliches · F Recherchen · G Doku-Drift · H Portal; mit allen Entscheiden.
- **Gemeinsamer Kern** `kern/` (KB1 a, KB2 a): einzige Quelle; `tools/kern_verteilen.py` bündelt `kern/TEILE` in
  `<app>/kern/kern.js` mit Version und Prüfsumme, `--pruefe` meldet Handänderung oder vergessene Version;
  `tools/pruefe_kern.js` (5222 Fälle); Entwicklerdoku `docs/kern/rahmen.md`. Teile:
  `zahl.js` (Schreibweise als Einstellung), `bruch.js`, `speicher.js` (Präfix), `zufall.js`, `el.js`, `geheimnis.js`
  (PIN, Code, Frage), `person.js` (Kennung, Name, Rollen, Geburtsdatum, Zusammenführen), `freigabe.js`, `suche.js`,
  `runden.js` (gemeinsames Format, Schema, feste Kennungen für alte Einträge).
- **Lernsteig-Tests ohne Browser:** `docs/lernsteig/werkzeuge/pruefe_konten.js` (37 Fälle: Umzug, PIN und Code,
  Bestätigung, Verbinden, kaputte und fremde Dateien, voller Speicher, Gast, Einladung, Sicherung Version 2).

## Geändert
- **Eulenpfad:** Profile als `lernspiele:personen` mit fester Kennung (P1 a, P2 a; Umzug aus `lernspiele:profile`,
  Doppel nur in Gross/Klein behalten ihre Runden), Rolle `lernend`, `LS.umbenennen`, `LS.person`, `LS.gehoert`; PIN über
  `KERN.geheimnis`; Freigabe, Suche, Zahlschreibung, Speicher, Zufall, `el` über den Kern; Runden und Rekorde im Format
  R1 a (`spiel` → `inhalt`, Kennung je Runde und je Endlos-Serie), Einlesen und Abgleich über den Kern mit Prüfung (D14),
  Dateien `format: "eulenpfad-daten"` Version 3. Aussehen unverändert.
- **Lernsteig:** Jugendliche und Aufsichten in einer Liste `lernsteig:personen` (Umzug); weitere Aufsicht nur mit
  Bestätigung (D5), Einlesen verbindet nur neue Konten (D5), prüft alles und schreibt alles oder nichts (D4), Einladung
  prüft Land, Kanton, Klasse und nimmt den Geburtsmonat (D12); Runden `konto` → `person`, `uebung` → `inhalt`, Sicherung
  Version 2; Startseite ohne „null“; Katalog ohne `geprueft` (zweite Quelle).
- **CLAUDE.md:** Geburtsdatum vollständig, Tag nachholbar (B3); Datenschutz-Ausnahme Aufsicht im Lernsteig; Steckbrief
  Tests und Architektur-Doku. **~/.claude/CLAUDE.md:** globale Regel „Testläufe während eines Umbaus“.
- Doku: `docs/eulenpfad/rahmen.md` (1, 10, 21), `docs/lernsteig/rahmen.md` (1, 5c, 5d, 6), `gemeinsame_mechaniken.md`
  (Teile „im Kern seit …“), `STAND_und_PLAN.md` und `AUFTRAG_cloud.md` des Lernsteigs (Rücknahme vermerkt).

## Stolperfallen
- **`sed -i` in Git-Bash schreibt CRLF-Dateien als LF** (ganze Datei). Wegen `* text=auto` ohne Folgen im Repo, aber
  gegen die Regel „nie ganze Dateien normalisieren“. **Hook-Kandidat:** `sed -i` auf Dateien mit CRLF abweisen und auf
  `patchlib` verweisen — zweimal von Hand korrigiert.
- **Ersatz-DOM legt `document` und `localStorage` als Variablen an**, nicht auf `globalThis`. Der Kern greift darum über
  die globalen Namen zu (Regel in `docs/kern/rahmen.md` 2).
- **Neue Kennungen ziehen Zufallszahlen**: Ohne `crypto` im Ersatz-DOM verschiebt das die Zufallsfolge; die Klickzahlen
  sind seit dem Personen-Umzug nicht mehr mit älteren Läufen vergleichbar. Der volle Lauf am Ende gibt die neue Grundlage.
- **Natives `append(null)` schreibt „null“** (Lernsteig-Startseite, aus der Cloud-Fassung). Der geplante Seitentest im
  Ersatz-DOM (B2) findet so etwas.
- **Kern-Vorgaben mit Zeit** hätten beim Zusammenführen echte Werte anderer Geräte überschrieben — behoben (1.3.0).
- **Eigene Testerwartungen falsch** (Wortteil „ruch“, Buchstabendreher, Listenvergleich mit `===`, fehlende `dauer` in
  Testrunden): jedes Mal zuerst den Code geprüft, dann die Erwartung korrigiert.
- Port 8765 ist von einem fremden Server mit anderem Stand belegt; Prüfungen über `lernspiele-2` (8767).
- Commit `565dd92` trägt die Message von Kern 1.4.0, enthält aber Kern 1.5.0 (Suche). Nicht korrigiert (Git macht Patrik).

## Verifikation
- Kern: `node tools/pruefe_kern.js` „5222 Fälle, 0 Fehler.“; Kopien in allen drei Apps gleich.
- Lernsteig: `node docs/lernsteig/werkzeuge/pruefe_uebungen.js` „0 Fehler, 0 Hinweise.“ mit `pruefe_konten.js`
  „37 Fälle, 0 Fehler.“
- Eulenpfad: voller Lauf über alle 169 Spiele nach Kern 1.1.0 „Keine Fehler.“ (gleiche Klickzahlen wie vorher); seither
  Stichproben je Schritt (zuletzt zahlenhaus, preis-tabelle, anlaut-angel, Suchbeispiele) „Keine Fehler.“; das Testskript
  prüft jetzt jede Runde und jeden Rekord gegen das Format R1 a.
- Browser: Umzug alter Profile und Runden, Umbenennen, Zusammenführen mit Dateien älterer Fassungen, Lernsteig-Runde
  gespielt und im neuen Format, Aufsicht mit Bestätigung, gesperrte Übungen; Testdaten danach gelöscht.
- **Nicht geprüft:** voller Eulenpfad-Lauf nach Kern 1.3.0–1.6.0, Zufallsmix gespielt, echte Geräte.

## Offene Punkte / Plan für die nächste Session
1. **Bemerkung 11** (Fahrplan-Rechner, Stufe 3): die Aufgabe sagt nicht, ob „5 h 35 min“ oder „335 min“ gemeint ist.
2. **Kern weiter (Plan B):** Anmeldung und Sitzung im Tab, Entwickler-Modus, Einladung, Auswertung mit Regeln je App;
   **Testgerüst B2** für alle Apps (Seitentests des Lernsteigs im Ersatz-DOM, Browserteil ohne Playwright).
3. **Grundgerüst C:** Lernsteig wie Eulenpfad (Anmeldung mit Gast, Tabs, Kacheln, Suche mit Passung, Prüfungsvorbereitung
   C1 a, Verwaltung mit Freigabe und Entwickler-Modus, Lehrperson), Gratwanderung mit demselben Gerüst, Profil-Übernahme
   C9 (Annahme vor dem Bau vorlegen: Rolle und PIN reisen mit, Code neu).
4. Danach D (Rest D1–D3, D6–D11, D13), E (Fachliches, u. a. Rationale Zahlen Stufe g), F (Recherchen), G, H (Portal).
5. **Vor jedem Push, der veröffentlicht:** voller Eulenpfad-Lauf und eine Sicherung je Gerät (Umzug nur in eine Richtung).
