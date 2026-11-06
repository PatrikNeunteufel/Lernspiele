# Handover — Eulenpfad (Ordner Lernspiele)

## Stand
**2026-11-06, nach LERN_Session18** ([Report](report/LERN_Session18_2026-11-06.md)):
- **Kern 1.18.0:** dazu `daten.js` (ein Dateiformat `reihe-daten` für Sichern, Einlesen, Abgleich; Löschvermerke,
  Freigabe, geschützte Personen nach DF4 a), `abgleich.js` (Ordner-Abgleich) und `rollen.js` (Bestätigung, PIN vergessen,
  Frist). Noch nicht im Kern: Ablauf einer Runde (Zuschnitt AR1 a entschieden), Gruppenleitung mit LERN-48 (RL1 a).
- **Eulenpfad:** Einlesen einer Datei der Version 3 behoben (war seit LERN_Session15 online kaputt); alles über den Kern;
  eine Aufsicht reist ohne PIN und ist auf einem anderen Gerät 🔒 gesperrt, bis sie freigeschaltet ist; auf Anhieb
  richtig nur noch ein Lob (LB1 a), Sprachspiele in der Fremdsprache (LB2 a), Prüfer „Lob“.
- **Tests:** Kern „5545 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 0 Hinweise.“ (Konten 72 Fälle), Gratwanderung
  „Keine Fehler.“; Eulenpfad nur Stichproben „Keine Fehler.“ — seit LB1 a weichen die Klickzahlen vom letzten vollen Lauf
  ab (Zufallsfolge verschoben). Voller Lauf nach Patriks Entscheid, vor dem nächsten Push vorgeschlagen.
- **Weiter mit:** `runde.js` — zuerst die Einzelentscheide (Report, Plan 1), dann die reinen Hilfen, dann der Ablauf;
  Lernsteig-Abgleich mit Zusatz zu AS1. 15 Commits lokal, nach dem Push Geräte einmal neu laden (neues Dateiformat).

**2026-11-06, nach LERN_Session17** ([Report](report/LERN_Session17_2026-11-06.md)):
- **Kern 1.14.1:** dazu Rollleiste und Personen-Knopf (PA1 a), Terme und Rechenkern; Anmeldung des Tabs geht vor der
  gewählten Person. Noch nicht im Kern: Dateiformat mit Abgleich, Ablauf der Runde, Rest der Rollen.
- **Eulenpfad:** Tab-Leiste einzeilig mit Personen-Knopf; 39 neue Zeichnungen (Geschichte, Urzeit, Dinge aus der Zeit ihrer
  Kultur; ZA1 a, MF1 a, BZ1 a), Bemerkungen 23–32 erledigt; nach einer richtigen Antwort nur kurzes Lob, Erklärung nach
  einem Fehlversuch (WZ2 a). Server starten im Portal (SV1 a).
- **Tests:** Einstieg `node tools/pruefe.js`; Kern „5439 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 0 Hinweise.“ mit 320
  Runden im Ersatz-DOM; Eulenpfad voller Lauf „Keine Fehler.“ vor den letzten Änderungen, danach Stichproben. Ein voller
  Lauf nur auf Patriks Entscheid; die Textsuche liest jetzt mit Abstand zwischen den Knoten und könnte Neues finden.
- **Weiter mit:** offene Kern-Teile (AN2 a: Dateiformat mit Abgleich, Rollen, Ablauf der Runde), dann B2 Schritt 3, dann
  C3–C8. Prüfen durch Patrik: neue Zeichnungen und geänderte Listen.

**2026-11-06, nach LERN_Session16** ([Report](report/LERN_Session16_2026-11-06.md)):
- **Bemerkungen 11–22 erledigt:** Fahrplan-Rechner fragt „? h ? min“; Bildersammlung `spiele/gemeinsam/bilder.js` (B1 a)
  mit 24 neu gezeichneten Lebewesen, Lebensraum in Stufe 1–4 mit allen; Nahrungsketten bis zur Prüfung der Bilder
  gesperrt (B2 a).
- **Kern 1.12.0:** dazu Anmeldung mit Gast, Entwicklung (Server für alle Apps), Einladung, Auswertung (eine Stand-Regel,
  AW2 a), Übernahme einer Aufsicht (C9). Es fehlen noch Terme und Rechenkern.
- **Lernsteig:** Anmeldung zuerst mit Gast (C1), Tabs wie im Eulenpfad (C2), Entwickler-Leiste; Stand in
  [docs/lernsteig/HANDOVER.md](../lernsteig/HANDOVER.md).
- **Eulenpfad:** Einladung zum Lernsteig ab 6. Klasse, Übernahme der Aufsicht, „↑ Alle Apps“; Aussehen sonst unverändert.
- **Tests:** Kern „5337 Fälle, 0 Fehler.“; Lernsteig „0 Fehler, 0 Hinweise.“, Konten 48 Fälle; Eulenpfad Stichproben
  „Keine Fehler.“ mit gleichen Klickzahlen. **Voller Lauf erst, wenn der ganze Kern umgebaut ist** (Vorgabe Patrik), und
  vor dem nächsten Push mit einer Sicherung je Gerät.
- **Weiter mit:** Terme und Rechenkern in den Kern, dann Testgerüst B2 (Seitentests im Ersatz-DOM), dann voller Lauf;
  Prüfen durch Patrik: neue Bilder, Lernsteig-Übungen im Entwickler-Modus freigeben.

**2026-11-05, nach LERN_Session15** ([Report](report/LERN_Session15_2026-11-05.md)):
- **Reihe:** Der Lernsteig ist aus dem Cloud-Repo zurückgeholt (A1 a, A2 a) und gesperrt, bis er geprüft ist. Was als
  Nächstes kommt, steht im [Plan zum Angleich der Reihe](../plan_angleich_reihe.md) (Pakete A–H, alle Entscheide).
- **Gemeinsamer Kern 1.6.0** (`kern/`, [docs/kern/rahmen.md](../kern/rahmen.md)): Zahl, Bruch, Speicher, Zufall, `el`,
  Geheimnis, Person, Freigabe, Suche, Runden; verteilt mit `tools/kern_verteilen.py`, geprüft mit
  `node tools/pruefe_kern.js`. Beide Apps benutzen ihn.
- **Eulenpfad:** Profile als Personen mit fester Kennung (P1 a, P2 a; Umzug beim Laden), Runden und Rekorde im
  gemeinsamen Format (R1 a), Dateien `eulenpfad-daten` Version 3; Notizblock mischt Rechnungen; Anleitungen nachgeführt.
  Aussehen unverändert.
- **Tests:** Kern „5222 Fälle, 0 Fehler.“; Lernsteig „0 Fehler, 0 Hinweise.“; Eulenpfad voller Lauf nach Kern 1.1.0
  „Keine Fehler.“, danach Stichproben (globale Regel „Testläufe während eines Umbaus“). **Vor dem nächsten Push, der
  veröffentlicht:** voller Lauf und eine Sicherung je Gerät (der Umzug geht nur in eine Richtung).
- **Weiter mit:** Bemerkung 11, dann Kern (Anmeldung, Entwickler-Modus, Einladung, Auswertung), Testgerüst B2 und das
  Grundgerüst C.

**2026-11-04, nach LERN_Session14** ([Report](report/LERN_Session14_2026-11-04.md)):
- **Reihe:** README im Repo als Übersicht der drei Apps, Eulenpfad-README in `eulenpfad/`.
- **Profil:** Geburtsmonat statt Alter (`LS.alterVon`), Klassenaufstieg einzeln und als „Neues Schuljahr“ mit Nachricht
  und Abzeichen; Profil der Aufsicht neu geordnet (Formular mit Speichern, darunter die Sofort-Häkchen).
- **Tab Spiele:** Klassen-Rand (G1 a), Filter einklappbar, 📖 Anleitungen in der App.
- **Notizblock** für schriftliches Rechnen (NB1–NB4 a, rahmen.md 21) mit Dezimalzahlen und eigenem Ziffernfeld;
  Bildschirmtastatur schreibt ins gewählte Notizfeld; Balken der Rückmeldung auf festem Platz.
- **Spiele:** 169 — neu Hundertertafel-Detektiv (Hilfsmittel H2, HM1 a); Sachaufgaben-Kompass mit Angaben mit
  Bedeutung (SK1 a).
- **Tests:** 2026-11-04 „Keine Fehler.“ über alle 169 Spiele (22 Hinweise bekannter Arten); der volle Lauf dauert rund 25 min.

Stand nach LERN_Session13 ([Report](report/LERN_Session13_2026-11-04.md)):
- **Anmeldung:** „🐣 Ich bin neu“ für Kinder und Erwachsene (Frage für Erwachsene, Erlaubnis einer Aufsicht), PIN
  vergessen in vier Stufen (zweite Aufsicht, Code, Sicherheitsfrage, Zurücksetzen mit 3 Tagen Frist; rahmen.md 6).
- **Bedienung:** Kurztasten für Antwortknöpfe (Schweizer Tastatur, rahmen.md 19); Rückmeldung lesbar und
  überspringbar; Eule zeigt bei neuer Aufgabe den Auftrag.
- **Ganze Aufgabe im Bild** (rahmen.md 20, `tools/bildhoehe.js`): Rahmen und 58 Spiele angepasst; Ziel sichtbare
  Fläche (GR1 a) noch umzusetzen, offene Punkte in [bildhoehe_offen.md](bildhoehe_offen.md).
- **Notizen für Zwischenergebnisse** (NZ1 a, [konzept_notizen.md](konzept_notizen.md)) in 32 Spielen, Abzeichen
  „Kopfrechner“; Probe-Stempel mit „nicht sicher“ und Abzeichen „Ganz sicher“.
- **Tests:** 2026-11-04 „Keine Fehler.“ über alle 168 Spiele (Hinweise bekannter Arten).

Stand nach LERN_Session12 ([Report](report/LERN_Session12_2026-11-03.md)):
- **Profil für Kinder** (konzept_profil_kind.md, rahmen.md 18): Kind sieht nur „Mein Bild“; Avatare in fünf Sätzen
  mit Farben und Rahmen, Abzeichen-Symbole ab Gold und Rahmen ab dem ersten Gold/Platin/Diamant freigeschaltet;
  Wahl des Kindes getrennt von der Vorgabe der Aufsicht mit „fest“; Weiterspielen; Statistik des Kindes; Podestplätze.
- **Endlos** in jeder Stufe ab 100 verschiedenen Aufgaben (Messung mit der Kennung im Testskript): 129 Spiele; dazu
  beim Zufälligen Spiel, Endlos-Mix mit allen Spielen.
- **Tests:** letzter Lauf abgebrochen nach 168 Spielen × 6 Stufen ohne Fehler; Endlos, Mix, Kind ungeprüft.

Stand nach LERN_Session11 ([Report](report/LERN_Session11_2026-11-03.md)):
- **Spiele:** 168 (drei Strategie-Rätsel mit Regelseite, LERN-49). Katalogfeld `art`, Sortierung im Tab Spiele,
  Spieltabelle im Portal (`portal/eulenpfad-spiele.html`).
- **Prüfung je Eintrag** (rahmen.md 17): Prüfansicht mit Haken je Eintrag, Gruppen und Bemerkungen; je Spiel eine
  `pruefung.js`, bisher nur Anlaut-Angel und Auge-Entdecker (LERN-51, LP5).
- **Wiederholungen:** eine Aufgabe erst wieder, wenn alle der Stufe dran waren (Gedächtnis `lernspiele:gestellt`).
- **Konzept Gruppen** entschieden (G1–G11, G3b), Bau offen (LERN-48); Beiträge vorbereitet, Links leer (LERN-50).
- **Tests:** 2026-11-03 „Keine Fehler.“ über alle 168 Spiele (19 Hinweise der bekannten Arten: verrät, Serie, Einzahl?).

Stand nach LERN_Session10 ([Report](report/LERN_Session10_2026-11-03.md)):
- **Spiele:** 165 (15 neu: Runde B 3. Klasse T1–T8 und Runde C S8, S9, S14, S15, T9–T11; Lernziele und Annahmen in
  `lernziele/lehrplan_sg_session10.md`). **Beide Ideenlisten sind abgearbeitet** (Checkliste: 0 Ideen offen); der
  Rest deckt sich mit vorhandenen Spielen oder braucht Daten von aussen (N9, N11).
- **Startseite:** Zeile „Nur“ (Meine Klasse, Fokus, Zu prüfen), Thema/Stufe/Klasse als Mehrfachwahl, Karten
  Zufallsmix und Zufälliges Spiel (rahmen.md 6). **Bedarf** (`AUSWERTUNG.bedarf`) gewichtet Zufall, Mix und
  Suche (`LS.passung`); **„🔗 Ähnliche Spiele“** (`LS.aehnlich`) auf Startblatt und Schlusskarte.
- **Lernplan und Erfolge** (L1 a, rahmen.md 15): Wochenziel je Kind, Wochenstern, Tab „🏅 Erfolge“ mit 24
  Abzeichen und Teilen als Bild (Annahme B1: Vorname reist nur auf Knopfdruck mit).
- **Tests:** 2026-11-03 „Keine Fehler.“ über alle 165 Spiele (17 bekannte Hinweise). Teilen auf echtem Gerät offen.

Stand nach LERN_Session9 ([Report](report/LERN_Session9_2026-11-02.md)):
- **Spiele:** 150 (10 neu, Runde A 6. Klasse mit Blick auf den Übertritt; `lernziele/lehrplan_sg_session9.md`,
  Plan in `spielideen/lehrplan_3_und_6.md`, als Nächstes Runde B 3. Klasse). Übertritts-Check im Zufallsmix.
- **Rahmen neu:** Fazit in der Statistik (regelbasiert, fürs Kind nach Freigabe), Fehler melden 🙋 über die
  Aufsicht mit Rückmeldung (rahmen.md Abschnitt 13; Adresse in `eulenpfad/kontakt.js`, noch leer, LERN-40),
  Hilfe ❓ und Tipp 💡 in allen Spielen (Abschnitt 14), Uhr erst wenn das Kind antworten kann (LERN-38).
- **Tests:** 2026-11-02 „Keine Fehler.“ über alle 150 Spiele, jedes Spiel mit Tipps.

Stand nach LERN_Session8 ([Report](report/LERN_Session8_2026-11-02.md)):
- **Spiele:** 140 (49 neu in LERN_Session8: drei Runden 5./6. Klasse und ein Kindergarten-Paket; Lernziele in
  `lernziele/lehrplan_sg_session8.md`). Fach Französisch neu, Thema Wirtschaft, Dezimalzahlen.
- **Kindergarten und Vorlesen** (rahmen.md Abschnitt 12): Klasse 0 = Kindergarten; die Eule liest Aufträge und
  Tipps vor (🗣️, im Spiel automatisch für Kindergarten und 1. Klasse oder nach Einstellung), langes Drücken
  liest Knöpfe, Stufen und Spielkarten vor; 🔇 schaltet alles stumm. 29 Spiele der 1./2. Klasse lesearm.
- **Server:** `server_starten.bat` (tools/server.py, ohne Zwischenspeicher), `entwickler_server_starten.bat`.
- **Tests:** 2026-11-02 „Keine Fehler.“, 15 bekannte Hinweise. Echte Sprachausgabe noch nicht angehört.

Älterer Stand (LERN_Session7):
- **Reihe und Ordner** (P1 a, P2 a): App in `eulenpfad/`, Doku in `docs/eulenpfad/`; Grundgerüste
  `lernsteig/`, `gratwanderung/` (Handover in `docs/lernsteig/`, `docs/gratwanderung/`); Einstiegsseite
  `portal/`. **Online** unter patrikneunteufel.github.io/Lernspiele/ (Pages bei jedem Push, der eine App
  ändert; W1 a).
- **Spiele:** 91 Spiele in 31 Themen, je sechs Stufen zur Basisklasse. Plan 1.–4. Klasse vollständig
  (1.: 10, 2.: 28, 3.: 11, 4.: 37); 5./6. Klasse: Plan in `spielideen/lehrplan_sg_5-6.md` (52 Ideen),
  gebaut Bruch-Pizzeria (5), Mittelwert-Türme (5), Teiler-Spürnase (6), Überschlags-Radar (6),
  Velo-Tabelle (6) in LERN_Session7.
- **Anleitungen** für Erwachsene und Kinder in `eulenpfad/anleitung/`, vom Portal verlinkt; Bilder neu mit
  `node tools/anleitung_bilder.js` (Server auf Port 8765 nötig), nach Änderungen an der Oberfläche.
- **Einstellungen der Aufsicht** je Gerät (Verwaltung → Einstellungen): Dezimalzeichen global und je
  Spiel, Standard Punkt (`LS.dezimalText`); Geld nach Klasse der Stufe (`LS.geldText`, C1 a).
  Klasseneinstellungen durch Lehrpersonen nur als Konzept: `konzept_klasseneinstellungen.md` (F1–F8).
- **Statistik:** Karte „Vorgehen“ (`ctx.vorgehen`), heute für Möglichkeiten-Finder, Teiler-Spürnase,
  Mittelwert-Türme.
- **Prüfstand** in `eulenpfad/spiele/gemeinsam/pruefstand.js`, gesetzt im **Entwickler-Modus**
  (`python tools/entwickler_server.py`, Schlüssel in `entwickler.key`, rahmen.md Abschnitt 11):
  2 von 35 neuen Spielen angesehen, 3 von 166 Inhaltslisten geprüft; für Kinder frei 34 von 91.
  Bemerkungen in `docs/eulenpfad/bemerkungen.json` (heute leer).
- **Abgleich zwischen Geräten** (S1 a, rahmen.md Abschnitt 10): Ordner je Gerät oder Abgleich-Datei;
  auf echten Geräten ungeprüft (LERN-31).
- **Bedienung:** Suche mit Rangfolge (SU1 a), Filter „Meine Klasse“ (K1 a, K2 a) und „Zu prüfen“,
  Verwaltung mit Untertabs, Spieloptionen auf der Stufenwahl (Reihenfolge R1 a, Übertrag UE1 a).
- **Tests:** `node tools/pruefe_spiele.js` — alle Spiele × Stufen, Endlos, Inhaltslisten als Kind, Mix,
  zehn Beispielsuchen, Hinweis „Einzahl?“, Namen (doppelt = Fehler, Grundwort > 2 = Hinweis). Stand
  2026-11-02: „Keine Fehler.“, 11 bekannte Hinweise „zu wenig verschiedene Aufgaben“, Grundwörter
  Detektiv, Sortierer, Puzzle über der Grenze.
- **Datenschutz:** Scan von Arbeitsbaum, Pages-Auslieferung und Git-Historie ohne Funde (D2 a, D3 a).
- **Offen:**
  - Noch kein Kind hat gespielt; Spiele ansehen und Listen prüfen (LERN-21, LERN-11).
  - Schweiz-Karten-Suche ohne Seen, Flüsse, Gebirge (eigener swisstopo-Datensatz).
  - Grundzeit und Schrittzeit des Endlos-Bodens sind Annahmen bis zur Testrunde (LERN-4).

**Nächste Session — Plan:**
1. Offene Bemerkungen aus `docs/eulenpfad/bemerkungen.json` abarbeiten.
2. **Anleitungen:** Notizen und Notizblock beschreiben, Bilder neu (`node tools/anleitung_bilder.js`, Server 8765):
   Profil, Tab Spiele mit Filter und Klassen-Rand, Aufstieg.
3. **Lehrmittel abgleichen:** Hundertertafel ab 0 oder 1 (`START`), Zwanzigerfeld oder Rechenrahmen, Verfahren der
   Subtraktion (Notizblock und Werkstatt), schriftliche Division in der Primarschule.
4. **Hilfsmittel weiter** (LERN-60, [spielideen/hilfsmittel.md](spielideen/hilfsmittel.md)): H1 Zwanzigerfeld,
   H3 Punktefeld, H4 Rechenstrich; H5 als Stufe der Rechen-Maschine.
5. **Prüfer-Kandidaten:** `tools/meldungen_stand.py` behält veröffentlichte Antworten; Testskript meldet Stellenfarben
   ausserhalb von Stellen.
6. Aus LERN_Session13: **GR1 a** (LERN-55), **Sudoku-Familie** (LERN-56), **PS2** (LERN-57), **Weitere Erfolge** (LERN-58).
7. **LP5 / LERN-51**, **VL1 a / LERN-52**, Avatare in Verwaltung → Konten, LERN-48.
8. Patrik: Spieler mit Farbcodes im eigenen Browser löschen; LERN-49, LERN-50, LERN-43, LERN-46, LERN-37.
9. Weiter offen: LERN-45, LERN-35, LERN-39, LERN-40, LERN-41, LERN-31, LERN-4, LERN-33.

Technik: HTML/CSS/JS ohne Build (Entscheid LERN-1). Vertrag zwischen Rahmen und Spielen: [rahmen.md](rahmen.md).
Übersicht aller Spiele und was zu prüfen ist: [checkliste.md](checkliste.md) (erzeugt mit `node tools/checkliste.js`). Gemeinsamer Rahmen `spiele/gemeinsam/`:
`spiel.js` (Stufenskala mit Basisklasse, Spieler/Profil/Protokoll, Stufenwahl, Timer, Zeitmessung,
Eule, Tastatur, Sterne; Bausteine `LS.auswahl`, `LS.reihenfolge`, `LS.koerbe`, `LS.fliegen`,
`ctx.vorbei()`; `LS.loescheRunden`, `LS.zusammenfuehren`), `katalog.js` (Themen, Spiele mit
Basisklasse `klasse`, Lernziele, Vorgabezeiten), `auswertung.js` (Lernzeiten, Konzentration,
Vorschläge), `noten.js` (Notensystem als SVG, Töne per WebAudio), `stil.css` (Stellenfarben wie
Calcularis, nur für Stellen).

**Stufenskala** (Entscheid Patrik 2026-10-31, CLAUDE.md): 1 eine Klasse tiefer · 2 leichter ·
3 Klassenziel · 4 schwerer · 5 eine Klasse höher · 6 👑 Königsstufe. Basisklassen je Spiel und
Lehrplan-Zuordnung: [lehrplan_sg_session2.md](lernziele/lehrplan_sg_session2.md),
Stellenwert: [4-2_stellenwert.md](lernziele/4-2_stellenwert.md). Ältere Runden im Protokoll tragen
die alten Stufennummern (bei Bedarf Spielstand zurücksetzen).

**Spiele:** vollständige Liste mit Thema, Basisklasse und Lernzielen in `spiele/gemeinsam/katalog.js`.
Basisklasse 1: Silben, Reime, Punkte-Blitz, Zahlenhaus, Doppel-Spiegel, Zahlen-Waage, Muster,
Formen, Anlaute, Buchstaben · 2: Zahlenmauer, Kalender, Uhr, Kiosk, Spiegeln, Sätze, Zehner-Ergänzer,
ABC, Lebensraum, Fledermaus, Rhythmus, Hoch-Tief, Schätzen, Flächen, Rechengeschichten, Blitzlesen,
Lese-Detektiv, Lebenszyklus, Körper, Znüni, Magnet, Schwimmt/sinkt, Instrumente · 3: Einmaleins,
Rest, Masse, Koordinaten, Wortarten, Regel-Lücke, Himmel, Tiere, Noten, Nomen-Puzzle ·
4: sieben Stellenwert-Spiele (Lernzielblatt 4.2), Rechen-Rakete, Runden, Zahlenstrahl,
Vergleichs-Krokodil, English Word-Match.

Daten nur im Browser (Entscheid LERN-5 b). Statistik: Sichern als `lernspiele-<Namen>-<Datum>.json`,
Einlesen **führt zusammen** (Entscheid Patrik a: doppelte Runden zählen einmal, Profile bleiben),
Spielstand zurücksetzen (alle Spiele oder eines). Timer zuschaltbar, Zeit je Aufgabe gemessen.

Prüfen: `node tools/pruefe_spiele.js [spiel-id …]` (Ersatz-DOM `tools/pruef_dom.js`; Spiele mit
`aufgabeErzeugen`/`pruefeAufgabe` werden zusätzlich fachlich geprüft). Prüfliste neu erzeugen:
`node tools/pruefliste_wortlisten.js > docs/pruefung/wortlisten_zur_pruefung.md`.

Git: lokales Repo in `Lernspiele/` (Branch `master`, kein Remote). Nicht im Repo: `.vs/`, `material/`,
Fotos (`*.jpeg`, `*.jpg`), gesicherte Spielerdaten (`lernspiele-*.json`).

Vorschau: `.claude/launch.json` (`lernspiele` Port 8765, `lernspiele-2` Port 8767). Nach Änderungen
hart neu laden (Strg+F5). Ohne Server per Doppelklick (README). Ungeprüft: Firefox mit `file://`.

## Ordner
- `index.html`, `start/` — Startseite; `mix.html`, `mix/` — Zufallsmix
- `spiele/` — die Spiele (je Spiel ein Unterordner mit Inhaltsdatei), `spiele/gemeinsam/` Rahmen
- `tools/` — Testskript, Ersatz-DOM, Prüfliste
- `docs/lernziele/` — Lernziele und Basisklassen mit Zuordnung Lernziel → Spiel
- `docs/spielideen/` — Spielideen aus dem Lehrplan Volksschule SG
- `docs/pruefung/` — Prüfliste der Inhalte
- `material/<klasse>/` — Vorlagen (Lernzielblätter), nicht im Repo
- `docs/report/` — Session-Reports

## Offene Punkte
| Nr. | Punkt | Status | Einzelheiten |
|---|---|---|---|
| LERN-1 | Technik der Spiele festlegen | erledigt 2026-10-31 (HTML/JS, CLAUDE.md) | Steckbrief *Sprachen* |
| LERN-2 | Spiele 4.2 Stellenwert bauen | erledigt 2026-10-31 (LERN_Session1, 8 von 8) | docs/eulenpfad/lernziele/4-2_stellenwert.md |
| LERN-3 | Thema/Lernzielblatt 2. Klasse | offen | noch kein Material |
| LERN-4 | Test mit den Kindern; Schwierigkeit und Hinweise nachschärfen | in Arbeit seit 2026-10-31 (LERN_Session1, erste Rückmeldung umgesetzt) | Report LERN_Session2, Plan |
| LERN-5 | Fortschritt protokollieren mit Namen | erledigt 2026-10-31 (LERN_Session1, Entscheid b) | CLAUDE.md Gestaltungsregeln |
| LERN-6 | Schreibweise vierstelliger Zahlen („4500“ / „4 500“) mit Lehrmittel abgleichen | offen | Lehrplan SG schreibt „320'000“ (MA.1.A.3.e), das Lernzielblatt „30 400“ |
| LERN-7 | Farben je Stelle nach Calcularis | erledigt 2026-10-31 (LERN_Session1) | CLAUDE.md Gestaltungsregeln |
| LERN-8 | Einstellung Reihenfolge der Teile je Spiel oder je Spieler | erledigt 2026-10-31 (LERN_Session1) | Profil auf der Startseite |
| LERN-9 | Mischspiel über mehrere Themen, gewichtet nach Fokus | erledigt 2026-11-01 (LERN_Session5, Zufallsmix; Fokus als Filter, nicht als Gewicht) | rahmen.md Abschnitt 9, mix/ |
| LERN-10 | Spielideen aus dem Lehrplan Volksschule SG, alle Fächer 1.–6. Kl. | erledigt 2026-10-31 (LERN_Session1) | docs/spielideen/lehrplan_sg_spielideen.md |
| LERN-11 | Inhaltslisten prüfen lassen | offen (Prüfung durch Patrik oder Lehrperson, Entscheid a) | docs/pruefung/wortlisten_zur_pruefung.md (Teile 1–39); geprüfte Listen im Katalog `geprueft` |
| LERN-12 | Timer, Zeitmessung und didaktische Statistik | erledigt 2026-10-31 (LERN_Session1) | spiel.js, auswertung.js, statistik.html |
| LERN-13 | Weitere Spiele aus den Spielideen | erledigt 2026-11-03 (LERN_Session10, 165 Spiele; beide Ideenlisten abgearbeitet, Rest deckt sich mit vorhandenen Spielen oder braucht Daten von aussen) | checkliste.md; lehrplan_sg_5-6.md; lehrplan_3_und_6.md |
| LERN-14 | Testskript für die Aufgabengeneratoren aller Spiele (Node) | erledigt 2026-10-31 (LERN_Session2) | tools/pruefe_spiele.js |
| LERN-15 | Stufenskala mit Basisklasse und Königsstufe | erledigt 2026-10-31 (LERN_Session2, Entscheid Patrik) | CLAUDE.md; docs/lernziele/lehrplan_sg_session2.md |
| LERN-16 | Spielstand zurücksetzen und zwischen Geräten abgleichen | erledigt 2026-10-31 (LERN_Session2, Entscheid a: Zusammenführen) | statistik.html, LS.zusammenfuehren |
| LERN-17 | Veröffentlichen über GitHub Pages | erledigt 2026-11-01 (LERN_Session6, online unter patrikneunteufel.github.io/Lernspiele/) | `.github/workflows/pages.yml`, Entscheide P1 a, P2 a, W1 a; Datenschutz-Scan im CHANGELOG |
| LERN-18 | Kiosk-Kasse Stufe 3–4 (Franken/Rappen) auf Basisklasse 2 prüfen | offen | docs/lernziele/lehrplan_sg_session2.md, Bekannte Grenzen |
| LERN-19 | Prüfer: Hinweis verrät die Lösung automatisch erkennen | erledigt 2026-10-31 (LERN_Session3) | tools/pruefe_spiele.js, LS.pruefung.haken |
| LERN-20 | Testspieler und Testhilfen (Entscheid T1 a, T2 a) | erledigt 2026-10-31 (LERN_Session3; heute Rolle Aufsicht, L2 a) | spiel.js (ctx.loesung), rahmen.md Abschnitt 6 |
| LERN-21 | Neue Spiele (2 von 94 angesehen) und die Startseite auf Desktop, Tablet und Handy ansehen | offen | checkliste.md |
| LERN-22 | Startseite mit Anmeldung, Tabs, Gruppen, Favoriten; Rollen Kind/Aufsicht mit PIN (L1–L3 a) | erledigt 2026-10-31 (LERN_Session3), im Browser noch nicht angesehen | rahmen.md Abschnitt 6, start/ |
| LERN-23 | Prüfstand und Freigabe je Spiel und Inhaltsliste (L4 a) | erledigt 2026-10-31 (LERN_Session3) | katalog.js (geprueft, listen), Tab Verwaltung |
| LERN-24 | Checkliste Klasse → Fach → Thema → Spiel | erledigt 2026-10-31 (LERN_Session3) | checkliste.md, tools/checkliste.js |
| LERN-25 | Endlos-Timer: Boden je Aufgabe aus Handgriffen (F1 a, F2 a); Konstanten eichen | in Arbeit seit 2026-10-31 (LERN_Session4); gebaut, Eichung nach LERN-4 | rahmen.md Abschnitt 7, `ENDLOS_TEMPO` in spiel.js |
| LERN-26 | Serienbremse für zufällige Merkmale (`ctx.serie`, höchstens 3 gleiche) | erledigt 2026-11-01 (LERN_Session4) | rahmen.md Abschnitt 4.2; Grenzfälle im Report LERN_Session4 |
| LERN-27 | Gewöhnliche Runde erst nach „Weiter“ gespeichert, wenn die Eule die letzte Aufgabe auflöst | offen (Entscheid Patrik) | Report LERN_Session4, Offene Punkte |
| LERN-28 | Statistik und Empfehlungen ausbauen (Können-Wert, Fehlermuster, Wiedervorlage, Prüfungsplan, Bericht) | offen (Entscheid Patrik) | Report LERN_Session5, Recherche |
| LERN-29 | Name „Eulenpfad“: Markenrecherche EU (TMview) und Domain vor der Veröffentlichung | offen | Report LERN_Session5; Swissreg ohne Treffer |
| LERN-30 | Zufallsmix in Safari/iPad und Firefox prüfen; Leiste auf dem Handy (drei Zeilen) | offen | rahmen.md Abschnitt 9 |
| LERN-31 | Abgleich-Ordner auf den echten Geräten prüfen (`file://`, Netzwerk- und Cloud-Ordner, iPad/Android nur Datei) | in Arbeit seit 2026-11-01 (LERN_Session6); gebaut, nur auf localhost geprüft | rahmen.md Abschnitt 10 |
| LERN-32 | Lehrplan SG 5./6. Klasse auswerten, Spielideen mit Basisklasse 5/6 (Entscheid P56 a) | erledigt 2026-11-01 (LERN_Session7, 52 Ideen, Top 15) | docs/eulenpfad/spielideen/lehrplan_sg_5-6.md; Auswahl offen |
| LERN-33 | Schweiz-Karten-Suche: Seen, Flüsse, Gebirge (swisstopo-Datensatz, Download anfragen) | offen | `tools/karte_schweiz.py`; Report LERN_Session6 |
| LERN-34 | Klasseneinstellungen durch Lehrpersonen | offen (Konzept, Entscheide F1–F8) | docs/eulenpfad/konzept_klasseneinstellungen.md |
| LERN-35 | Grundwörter in Spielnamen über der Grenze (Detektiv 5, Sortierer 4, Puzzle 4) umbenennen | offen (D2 a, später) | Testskript, Namensprüfung; Report LERN_Session7 |
| LERN-36 | Dezimalzahlen-Spiele M3–M5 und Eingabe von Dezimalzahlen; Dezimalzeichen der Zahlenbuch-Neuausgabe | erledigt 2026-11-02 (LERN_Session8; Dezimalzeichen der Neuausgabe weiter offen) | lehrplan_sg_session8.md; rahmen.md 4.3 |
| LERN-37 | Vorlesen und Kindergarten auf echten Geräten anhören und prüfen | offen | rahmen.md Abschnitt 12 |
| LERN-38 | „▶ Los! 3-2-1“ nur bei der ersten Aufgabe und nach Fehlern, dazwischen kurz ein Aufpassen-Zeichen 👀 (Hinweis Patrik) | erledigt 2026-11-02 (LERN_Session9, F1–F4 a) | rahmen.md (`ctx.uhrWarten`, `ctx.losKnopf`) |
| LERN-39 | Entscheide aus LERN_Session8: Farben rechts vom Komma, Malzeichen, Braille-Finger ohne freie Liste | offen | Report LERN_Session8, Plan 1 |
| LERN-40 | E-Mail-Adresse für Fehlermeldungen bestimmen (eigenes Postfach, A1 a) und eintragen | offen | `eulenpfad/kontakt.js`, Feld `meldungen`; rahmen.md Abschnitt 13 |
| LERN-41 | Fachlich unsichere Stellen aus LERN_Session9 prüfen (Tipps, Regeln, Fakten, Preise; Annahmen Runde A) | offen | Report LERN_Session9, Plan 1 |
| LERN-42 | Prüfer: Spiel-CSS definiert eine reservierte Rahmen-Klasse neu | erledigt 2026-11-02 (LERN_Session9, `rahmenKlassenImStil` im Testskript; im Handover erst 2026-11-03 nachgetragen) | tools/pruefe_spiele.js |
| LERN-43 | Fachlich unsichere Stellen aus LERN_Session10 prüfen (Annahmen Runde B und C, ZU-PRÜFEN-Köpfe der 13 Inhaltsdateien) | offen | lernziele/lehrplan_sg_session10.md; Report LERN_Session10, Plan 1 |
| LERN-44 | Lernplan: Wochenziel je Kind, Wochenstern, Tab Erfolge mit Abzeichen und Teilen (R2, Entscheid L1 a) | erledigt 2026-11-03 (LERN_Session10) | rahmen.md Abschnitt 15 |
| LERN-45 | Rahmen-Baustein „Fragenfolge“ (mehrere Fragen je Aufgabe), danach sechs Spiele darauf umstellen | offen | Report LERN_Session10, Stolperfallen |
| LERN-46 | Teilen eines Abzeichens auf Tablet und Handy prüfen (Teilen-Dialog, Bild im PNG) | offen | start/erfolge.js, `teileAbzeichen`; seit LERN_Session12 gezeichnete Symbole statt Emoji |
| LERN-47 | Weitere Sektion im Portal für ein Publikum ausserhalb der Schulstufen, Arbeitsname „Eulerpfad“ (R1 a) | später | Report LERN_Session11 |
| LERN-48 | Gruppen: Familie, Klasse, Lerngruppe; Rolle Lehrperson, Klassenstatistik, Abgleich je Gruppe verschlüsselt | offen (Entscheide G1–G11 und G3b getroffen 2026-11-03, Bau ausstehend) | docs/konzept_gruppen.md, Abschnitt 9; docs/anleitung_zertifikat_klassenserver.md; docs/anleitung_klassenserver_internet.md; umfasst LERN-34 |
| LERN-50 | Freiwillige Beiträge (Kaffee-Link, QR-Rechnung, GitHub Sponsors) nur für Erwachsene; Links leer bis aktiviert | in Arbeit seit 2026-11-03 (LERN_Session11); vorbereitet, Links leer — Patrik trägt sie ein, Steuern und Impressum klären | docs/anleitung_freiwillige_beitraege.md; portal/unterstuetzen.js |
| LERN-49 | Strategie-Rätsel im Eulenpfad (Matt in 1, Atari-Go, Nim); ganze Partien Schach und Go erst im Lernsteig (S1 a) | in Arbeit seit 2026-11-03 (LERN_Session11); drei Spiele gebaut, Annahmen offen | lernziele/lehrplan_sg_session11.md; spielideen/strategie_raetsel.md |
| LERN-51 | Alle Inhaltslisten je Eintrag prüfbar machen (`pruefung.js` je Spiel, gemischte Listen trennen; LP5 a) | in Arbeit seit 2026-11-03 (LERN_Session11); Pilot Anlaut-Angel und Auge-Entdecker | rahmen.md 17; spiele/gemeinsam/listenpruefung.js |
| LERN-52 | Zweisprachiges Vorlesen (VL1 a), Pilot Au café | offen | Report LERN_Session11, Plan 4 |
| LERN-53 | PIN der Aufsicht ohne zweite Aufsicht wiederherstellen (Entscheid PIN1) | erledigt 2026-11-04 (LERN_Session13, PIN1 a, PIN1-R a) | rahmen.md 6 |
| LERN-54 | Profil für Kinder: Avatar, Wahl gegen Vorgabe, Statistik, Endlos nach Messung (AV1–AV6, ST1, ST2, ZG1, RF1, VR1–VR3, EN1, EN2) | erledigt 2026-11-04 (LERN_Session12) bis auf VR2, VR3 und Ziele der Klasse (mit LERN-48) | docs/eulenpfad/konzept_profil_kind.md; rahmen.md 7, 18 |
| LERN-55 | Ganze Aufgabe im Bild auf der sichtbaren Fläche (GR1 a); GR1 b (1000 × 500 ohne Vollbild) zurückgestellt | in Arbeit seit 2026-11-04 (LERN_Session13); BH1–BH3 umgesetzt, GR1 a offen | bildhoehe_offen.md; rahmen.md 20 |
| LERN-56 | Sudoku-Familie: Bilder-, Zahlen-, Vergleichs-, Käfig-, Gebiets-Sudoku, Sudoku-Duell; Thema Logikrätsel (SU1–SU3 a) | offen (entschieden 2026-11-04) | Report LERN_Session13, Plan 2 |
| LERN-57 | Neunerprobe im Probe-Stempel (PS2 a) mit Rückfrage Patrik: Erklärung, Regeln für 3/6/9, Gruppe für Neugierige | offen (vorzulegen) | Report LERN_Session13, Plan 3 |
| LERN-58 | Weitere Erfolge: Abzeichen je Thema und für besondere Spiele (Zusatz Patrik zu NZ1) | offen | Report LERN_Session13, Plan 4 |
| LERN-59 | Notizen für Zwischenergebnisse (NZ1 a) | erledigt 2026-11-04 (LERN_Session13, 32 Spiele) | konzept_notizen.md; rahmen.md 4.3 |
| LERN-60 | Angleich der Reihe: Kern, Grundgerüst Lernsteig und Gratwanderung wie Eulenpfad, Fehler, Fachliches, Recherchen, Portal | in Arbeit seit 2026-11-05 (LERN_Session15, Paket B); Kern 1.18.0 in beiden Apps, offen Ablauf der Runde (AR1 a) | docs/plan_angleich_reihe.md; docs/kern/rahmen.md |
| LERN-61 | Bemerkung 11: Fahrplan-Rechner Stufe 3 sagt nicht, ob „5 h 35 min“ oder „335 min“ gemeint ist | erledigt 2026-11-06 (LERN_Session16, Bemerkung 11) | docs/eulenpfad/bemerkungen.json |
| LERN-60 | Hilfsmittel als eigene Spiele (HM1 a): Zwanzigerfeld, Hundertertafel, Punktefeld, Rechenstrich, Folgen-Maschine; Rechenschieber für LERN-47 | in Arbeit seit 2026-11-04 (LERN_Session14, H2 Hundertertafel gebaut, H1, H3–H6 offen) | spielideen/hilfsmittel.md; lernziele/lehrplan_sg_session14.md |
