# Changelog — Lernspiele

## 2026-10-31 — LERN_Session1
- Projekt eingerichtet: CLAUDE.md (Gestaltungsregeln, Steckbrief), docs/HANDOVER.md, Ordnerstruktur.
- Lernziele 4.2 Stellenwert / Ziffern und Zahlen erfasst (docs/lernziele/4-2_stellenwert.md).
- Entscheid LERN-1: HTML/CSS/JS ohne Build-Schritt.
- Gemeinsamer Spielrahmen spiele/gemeinsam/ (stil.css, spiel.js) und Startseite index.html.
- Spiele 4.2-G2 Zahlen-Baukasten, 4.2-G3 Tabellen-Post, 4.2-G5 Zahlen-Hüpfer.
- Spiele 4.2-G1 Stellen-Detektiv, 4.2-G4/E2 Ziffernkarten (zwei Stufen), 4.2-E1 Zahlenrätsel-Tresor,
  4.2-E3 Punkte-Schieber; Startseite verlinkt alle acht Lernziele.
- Rahmen: Direktstart einer Stufe per `?stufe=<id>`; Eule über der Aufgabe; Handy-Layout (375 px).
- Entscheid LERN-5 b: Spielerwahl, Profil (Alter, Klasse, Fokus) und Protokoll je Runde, nur im Browser.
- Fünf-Stufen-Skala für alle Spiele (1 Einsteiger ab 2. Klasse … 5 Profi); alle sieben Spiele umgebaut.
- Katalog `spiele/gemeinsam/katalog.js`; neue Startseite mit Filter Thema/Stufe/Fokus und Stufenknöpfen.
- Statistik `statistik.html` mit Stand je Lernziel, Vergleich der Kinder, Verlauf, Sichern/Einlesen.
- `.gitignore` für gesicherte Spielerdaten.
- Stellenfarben wie Calcularis (E rot, Z blau, H grün, ab T wiederholt); Deko-Farben getrennt.
- Profil-Einstellung „Reihenfolge der Teile“ (nach Stufe / geordnet / gemischt), global und je Spiel;
  Baukasten und Tresor beachten sie; Protokoll vermerkt sie je Runde.
- Spielideen aus dem Lehrplan Volksschule SG (74 Ideen, 7 Fächer, Top 15): docs/spielideen/lehrplan_sg_spielideen.md.
- Fix: Schlusstext „fast alles richtig“ erschien auch bei 0 Fehlern; jetzt je Fehlerzahl.
- Zeitmessung je Aufgabe (Protokoll `aufgabenZeiten`); zuschaltbarer Timer mit Vorgabezeiten im Katalog,
  Einstellung im Spiel und im Profil (global, Faktor, je Spiel und Stufe, Vorschlag aus eigenen Zeiten).
- `spiele/gemeinsam/auswertung.js` und Statistik: Vorschläge, Lernzeiten, Konzentration.
- Neue Spiele: Einmaleins-Blitz, Rechen-Rakete (MA.1.A.3), Wortarten-Sortierer (D.5.D.1), Regel-Lücke
  (D.5.E.1); Themen Rechnen, Wortarten, Rechtschreibung; Lehrplan-Lernziele im Katalog.
- Prüfliste der Deutsch-Wortlisten (docs/pruefung/), erzeugt mit tools/pruefliste_wortlisten.js.
- Git (lokal, von Visual Studio angelegt): `.gitignore` schliesst `.vs/`, `material/` und Fotos aus.
- Neue Spiele: Runden-Rutsche (MA.1.A.4), Zahlenstrahl-Pfeil (MA.1.A.2), Zahlenmauer-Baumeister
  (MA.1.B.1), Rest-Rätsel (MA.1.B.2), Jahreskreis-Ordner (NMG.9.1); Themen „Zahlen ordnen“ und „Zeit“.
- Fix Zahlenmauer: Stufe 5 hatte unlösbar viele Lücken (Endlosschleife); jetzt höchstens 6, Generator begrenzt.
- Neue Spiele: Uhr-Werkstatt, Kiosk-Kasse, Masse-Umwandler (MA.3.A.1, MA.3.A.2); Thema „Grössen“.
- Neue Spiele: Spiegel-Raster (MA.2.A.2), Koordinaten-Schatzsuche (MA.2.C.4); Thema „Form und Raum“.
- Neue Spiele: Satz-Reparatur und Wörter-Trenner (D.4.F.1), English Word-Match (FS1E.5.B.1),
  Vergleichs-Krokodil (MA.1.A.1/2), Himmels-Forscher (NMG.4.5); Themen Sätze, Englisch, Himmel;
  Prüfliste um Sätze und englische Wörter erweitert.
- Session-Abschluss: Report docs/report/LERN_Session1_2026-10-31.md, Handover mit Stand und Plan.

## 2026-10-31 — LERN_Session2
- Wortarten-Sortierer: das Wort fliegt schräg in den gewählten Korb (`LS.fliegen`).
- Zehn Spiele: Zehner-Ergänzer, Silben-Klatscher, Reim-Paare, ABC-Sortierer, Tier-Sortierer,
  Lebensraum-Zuordnung, Fledermaus-Forscher, Noten-Namen, Rhythmus-Leser, Hoch-Tief-Ohr.
- Zwanzig Spiele ab der 1. Klasse: Punkte-Blitz, Zahlenhaus, Doppel-Spiegel, Zahlen-Waage,
  Muster-Fortsetzer, Formen-Detektiv, Schätz-Waage, Flächen-Pixel, Rechengeschichten, Anlaut-Angel,
  Buchstaben-Zwillinge, Blitzlesen, Nomen-Puzzle, Lese-Detektiv, Lebenszyklus-Puzzle, Körper-Puzzle,
  Znüni-Teller, Magnet-Labor, Schwimmt oder sinkt?, Instrumenten-Kenner. Sieben neue Themen.
- Rahmen: `LS.auswahl`, `LS.reihenfolge`, `LS.koerbe`, `ctx.vorbei()`; `noten.js` für Noten und Töne.
- Entscheid: Stufenskala mit Basisklasse je Spiel (1 tiefer · 2 leichter · 3 Klassenziel · 4 schwerer ·
  5 höher · 6 Königsstufe); alle 56 Spiele umgebaut, Katalog mit `klasse`, CLAUDE.md nachgeführt.
- Testskript `tools/pruefe_spiele.js` mit Ersatz-DOM; 336 Kombinationen ohne Fehler.
- Behoben: Hinweise, die die Lösung verrieten (über zehn Stellen); mehrdeutige Aufgaben; Rechen-Rakete
  Stufen 3/4; Zahlenmauer-Zahlenraum; Satz-Reparatur akzeptiert Punkt bei Aussagen mit Nachdruck.
- Statistik: Dateiname mit Namen; Spielstand zurücksetzen; Einlesen führt zusammen (Entscheid a).
- Handy: Punkte-Blitz und Zahlen-Waage passen in 375 px; README.md; Prüfliste Teil 5–21.
- Session-Abschluss: Report docs/report/LERN_Session2_2026-10-31.md, Handover neu gefasst.

## 2026-10-31 — LERN_Session3
- Prüfer „Hinweis verrät die Lösung“ (LERN-19) im Testskript; neun verratende Hinweise korrigiert.
- Testhilfen 🔑/⏭ und `ctx.loesung()` in allen Spielen; Testspieler später in der Rolle Aufsicht (L2 a).
- Neun Spiele zum OP 4. Klasse (T3 a), Preis-Tabelle statt Folgen-Fortsetzer.
- Vergleichs-Krokodil: Schlusskarte (Klassenkonflikt `.mitte`); Prüfung reservierter Rahmen-Klassen,
  `LS.RAHMEN_KLASSEN`, `docs/rahmen.md` (R1 a).
- Startseite als eine Seite mit Tabs, Anmeldung mit Aufsicht und PIN, Fach-Gruppen, Favoriten,
  Kompaktansicht, Verwaltung (L1 a – L3 a); `start/`, `statistik.html` leitet um.
- Prüfstand und Freigabe je Spiel und Inhaltsliste (L4 a): 162 Listen, Verweise `von`, Zusatzlisten;
  standardmässig frei, was nichts zu prüfen hat; Annahmen sperren nicht (F1 a).
- Wiederholungsregel je Runde, `ctx.kennung()`; Checkliste `docs/checkliste.md` (`tools/checkliste.js`).
- 19 weitere Spiele (G1 a), Sprachausgabe für Englisch (G2 a, `LS.spielMitStimme`).
- Endlos-Modus mit Rekorden und Rangliste in 34 Spielen; mit Timer gleiche Startzeit für alle und
  je Aufgabe 4 % knapper (Untergrenze 40 %); vollständige Ranglisten ohne/mit Timer im Startbild.
- Spielkarte: Schalter ⏱ ♾ ⭐ als SVG (aus grau, an gold), Tipp auf die Karte öffnet das Startbild;
  Lernziel-Kürzel blenden beim Antippen ihren Klartext ein.
- Prüfliste Teile 22–39; Lernziele in docs/lernziele/lehrplan_sg_session3.md.
- Session-Abschluss: Report docs/report/LERN_Session3_2026-10-31.md, Handover nachgeführt.

## 2026-10-31 — LERN_Session4
- Endlos-Timer (Entscheide F1 a, F2 a): Die Zeit nähert sich einem Boden je Aufgabe (1,2 s + 0,5 s je
  Handgriff + Wartezeit), je richtige Aufgabe fallen 8 % der restlichen Spanne weg; ersetzt
  „4 % knapper, Untergrenze 40 % und 3 s“. Anzeige auf Zehntelsekunden, unter 10 s mit Komma.
- Rahmen: `ctx.schritte(n)`, `ctx.wartezeit(s)`, `LS.tippSchritte(wert)`; die Bausteine zählen ihre
  Handgriffe selbst; der Timer startet erst, wenn die Aufgabe gezeichnet ist.
- Alle 34 Endlos-Spiele nennen ihre Handgriffe je Aufgabe; Hoch-Tief-Ohr dazu die Abspielzeit.
- Testskript: Endlos-Aufgaben ohne `ctx.schritte` und mit weniger Klicks gelöste Aufgaben sind Fehler;
  die Übersicht zeigt die Handgriffe je Stufe. `docs/rahmen.md` Abschnitte 4.2, 4.3, 7, 8.
- `.claude/launch.json`: dritte Vorschau `lernspiele-3` auf Port 8769.
- Behoben: Endlos-Runden zählten erst beim Antippen von „Zum Ergebnis“; jetzt sofort beim Rundenende
  gespeichert (einmal je Runde). Das Testskript prüft es.
- Endlos (Entscheid E1 a): Verlassen mitten in der Serie (`pagehide`, `visibilitychange`) speichert sie
  als Zwischenstand mit `abgebrochen: true`; Weiterspielen ersetzt ihn. Testskript stellt das Verlassen nach.
- Stellen-Detektiv (Entscheid SD1 a): Stufen 1–3 fragen nur „Wie heisst die Stelle unter der Lupe?“
  (Lernziel G1), umgekehrt erst ab Stufe 4 (bisher wegen der Umstellung auf sechs Stufen auch in Stufe 1).
  Königsstufe zufällig, höchstens drei Aufgaben derselben Richtung hintereinander.
- Serienbremse im Rahmen (Vorgabe Patrik 2026-11-01): `ctx.serie(name, wert)` meldet zufällige Merkmale
  (Richtung, Aufgabenart, Antwort bei wenigen festen Antworten); der Rahmen zieht neu statt eines vierten
  gleichen in Folge (`LS.SERIE_MAX` = 3). Testskript prüft Serien je Runde.
- 75 Spiele melden ihre zufälligen Merkmale mit `ctx.serie` (Richtung, Aufgabenart, Antwort bei
  höchstens drei festen Antworten); Inhaltslisten-Spiele melden nur in Stufen, deren freie Listen
  mehrere Werte hergeben.
- Session-Abschluss: Report docs/report/LERN_Session4_2026-10-31.md, Handover nachgeführt
  (LERN-25 bis LERN-27). Gesamtlauf des Testskripts ohne Fehler.

## 2026-11-01 — LERN_Session5
- Name der Sammlung „Eulenpfad“ (Entscheid N1 a): Startseite, Statistik-Titel, README, CLAUDE.md.
  Swissreg ohne Treffer; technische Namen (`lernspiele:*`, `lernspiele-*.json`) bleiben.
- Zufallsmix (Entscheid M1 a): `mix.html`, `mix/mix.js`, `mix/mix.css`, Einstieg oben im Tab Spiele.
  Bis zu sechs Spiele in einer Runde (10 oder 20 Aufgaben) oder endlos; Fach, Fokus, Stufe („passend“
  oder fest), Timer, Wechsel nach 1 oder 3 Aufgaben. Die Spiele laufen unverändert im iframe
  (`?mix=1`), der Mix führt Serie, Protokoll (je Spiel mit `mix`) und Rekord (`mix:<Auswahl>`).
- Rahmen: Mix-Betrieb in `runde`, `body.im-mix`, `LS.tonSchalter`, `LS.rangliste`, weitere Exporte;
  `FAECHER` im Katalog. Statistik zeigt Mix-Rekorde und Mix-Runden.
- Punkte-Schieber: Ablauf beginnt nach 8 Aufgaben von vorn (stürzte im Mix bei der 9. ab).
- Testskript: jedes Spiel im Mix (`--mix=0` schaltet ab), Ausnahmen auch im Mix-Zweig;
  `docs/rahmen.md` Abschnitte 8 und 9.
- Session-Abschluss: Report docs/report/LERN_Session5_2026-11-01.md, Handover nachgeführt
  (LERN-9 erledigt, LERN-28 bis LERN-30 neu). Zwei Gesamtläufe des Testskripts ohne Fehler.

## 2026-11-01 — LERN_Session6
- Reihenfolge der Teile direkt im Spiel (Entscheid R1 a): Schalter „🔀 Teile: nach Stufe / geordnet /
  gemischt“ auf der Stufenwahl von Zahlen-Baukasten und Zahlenrätsel-Tresor; schreibt die Wahl je
  Spiel wie das Profil (`setzeReihenfolgeSpiel` in `spiel.js`, Klassen `reihenfolge-zeile`,
  `reihenfolge-schalter`).
- Fix: Die Wahl je Spiel „nach Stufe“ schlug eine globale Wahl „immer geordnet/gemischt“ nicht; jetzt
  gilt je Spiel vor global für alle drei Werte (`reihenfolgeFuer`).
- Durchgesehen: Die übrigen Stellenwert-Spiele zeigen keine Teile, die man mischen sollte (Tabellen und
  Ziffernkarten haben eine feste Ordnung); kein weiteres Spiel mit `reihenfolge: true`.
- Filter „🎒 Meine Klasse“ im Tab Spiele (Entscheide K1 a, K2 a): für Kinder mit Klasse im Profil,
  vorgegeben an, abschaltbar (Profil-Feld `meineKlasse`); zeigt Spiele mit Basisklasse ±1 (Klasse 2:
  48 von 84 Spielen, Klasse 4: 46 von 84, jeweils vor der Freigabe).
- Abgleich zwischen Geräten (Entscheid S1 a, rahmen.md Abschnitt 10): Ordner je Gerät in der Verwaltung,
  eigene Datei `lernspiele-sync-<id>.json` je Gerät, Abgleich beim Öffnen und nach jeder Änderung; ohne
  Ordner über eine Abgleich-Datei. Neu `spiele/gemeinsam/abgleich.js`, auf allen 86 Seiten geladen.
- `LS.zusammenfuehren` erweitert: Rekorde mit höherem Stand ersetzen den Zwischenstand, Profile je Feld
  nach Zeitstempel (`geaendert`), Löschvermerke (`lernspiele:geloescht`), Freigabe nach
  `lernspiele:freigabeStand`. Das Einlesen in der Statistik nutzt dasselbe.
- Datenregel LERN-5 b in CLAUDE.md um den Abgleich-Ordner ergänzt; LERN-31 (echte Geräte) im Handover.
- Verwaltung in Untertabs Konten, Freigabe und Abgleich (`#verwaltung/<untertab>`, Klasse `untertabs`
  in start.css). Freigabe je Fach zuklappbar mit „x von y frei · z zu prüfen“; offene Fächer merkt
  sich das Gerät (`lernspiele:verwaltungOffen`, nicht abgeglichen).
- Ordner für die Reihe (Entscheid P1 a): App nach `eulenpfad/` (index.html, mix.html, statistik.html,
  spiele/, start/, mix/), Eulenpfad-Doku nach `docs/eulenpfad/`; `docs/konzept_reihe_eulenpfad.md`
  bleibt in `docs/`. Werkzeuge, README, CLAUDE.md (Steckbrief) und rahmen.md auf die neuen Pfade;
  Checkliste neu erzeugt (nur Pfade geändert), Prüfliste unverändert.
- Veröffentlichen (Entscheid P2 a): Einstiegsseite `portal/index.html` (Eulenpfad, Lernsteig und
  Gratwanderung „in Planung“) und `.github/workflows/pages.yml`: stellt nur Einstiegsseite und
  App-Ordner in derselben Ordnerstruktur wie im Repo zusammen (Wurzel leitet auf `portal/` weiter,
  damit `../eulenpfad/` lokal und online gilt), bricht bei Spielerdaten oder Fotos ab, startet nur
  von Hand (LERN-17).
- Datenschutz-Scan (Arbeitsbaum, Pages-Auslieferung, Git-Historie aller 16 Commits): keine Kinderdaten,
  Fotos oder Geheimnisse. Danach (D2 a) das Prüfungsdatum der 4. Klasse aus Lernziel-Doku, Handover und
  drei Reports genommen; (D3 a) das doppelte Foto des Lernzielblatts aus der Repo-Wurzel gelöscht
  (byte-gleich mit der Kopie in `material/`).
- Grundgerüst `lernsteig/` und `gratwanderung/`: je eine Startseite mit Platzhaltern (Niveaus, Fächer),
  eigener Farbwelt und Rückweg zur Einstiegsseite, ohne Übungen und ohne gespeicherte Daten; Handover
  je App in `docs/lernsteig/` und `docs/gratwanderung/`. Die Einstiegsseite verlinkt beide („im Aufbau“).
- Einstiegsseite: Überschrift „Eulenpfad · Lernsteig · Gratwanderung“ statt „Eulenpfad“ (Entscheid N2 a),
  auf dem Handy untereinander.
- Pages-Ablauf startet von selbst bei jedem Push auf master, der `portal/` oder einen App-Ordner ändert,
  und weiter von Hand (Entscheid W1 a). Online seit 2026-11-01: patrikneunteufel.github.io/Lernspiele/
  (LERN-17 erledigt).
- Entwickler-Modus (Entscheide E1 a, E2 a, E3 a; rahmen.md Abschnitt 11):
  - Prüfstand aus `katalog.js` (162 Felder `geprueft: null`) in `eulenpfad/spiele/gemeinsam/pruefstand.js`
    gelöst; `spiel.js`, Verwaltung und `tools/checkliste.js` lesen ihn dort.
  - `tools/entwickler_server.py`: liefert das Repo aus (ohne Zwischenspeicher, ohne `entwickler.key` und
    `.git`) und schreibt mit Schlüssel nur Prüfstand und `docs/eulenpfad/bemerkungen.json`.
  - Schlüssel im Klartext nur in `entwickler.key` (gitignored), im Repo nur der Hash (`entwicklung.js`).
  - `eulenpfad/spiele/gemeinsam/entwicklung.js` auf allen Seiten: Freischalten, Schalter, Leiste im Spiel
    („✓ Spiel angesehen“, „📝 Bemerkung“ mit Stufe und laufender Aufgabe), Meldung ohne Server.
  - Verwaltung: Untertab „🛠 Entwicklung“ (Freischalten, Name, Bemerkungen); in der Freigabe „✓ angesehen“,
    „✓ geprüft“ und „ansehen“ (Einträge einer Liste mit Bemerkung je Eintrag).
  - `tools/pruefliste_wortlisten.js` schreibt zusätzlich `docs/eulenpfad/pruefung/listen.json`: alle 162
    Quell-Listen mit ihren Einträgen (2237 Zeilen), Grundlage für „ansehen“; die Markdown-Prüfliste bleibt
    byte-gleich.
  - Entwickler-Server leitet die Wurzel auf die Einstiegsseite um.
  - Fix: Unter Windows liefen mehrere Python-Server still auf Port 8765 (altes `http.server`, zwei
    Entwickler-Server); Anfragen landeten beim falschen. Der Entwickler-Server belegt den Port jetzt
    exklusiv und bricht sonst mit Meldung ab; die Seite meldet „anderer Server auf diesem Port“.
  - Start des Servers: Links zu Eulenpfad, Einstiegsseite und Entwicklung je auf eigener Zeile;
    `--oeffnen` öffnet Eulenpfad gleich im Browser.
  - Grund der Sperre (`LS.sperrGrund`): Die Marke auf der Spielkarte sagt jetzt, warum Kinder ein Spiel
    nicht sehen (noch nicht angesehen, keine Inhaltsliste geprüft, auf dem Gerät gesperrt); die
    Entwickler-Leiste zeigt, ob Kinder das Spiel sehen.
  - Inhaltslisten direkt im Spiel prüfen: Die Entwickler-Leiste klappt die Listen des Spiels auf, je mit
    „ansehen“ und „✓ geprüft“; die Listenansicht liegt dafür in `entwicklung.js` (`zeigeListe`), Stil in
    `stil.css`, und wird von Spielseite und Freigabe gemeinsam benutzt.
- Suchfeld im Tab Spiele und in der Freigabe, mit Rangfolge (Entscheid SU1 a, `LS.suche`): Feldgewichte
  Name 6, Lernziel-Kürzel 4, Beschreibung 3, Inhaltslisten 2, Thema 1; Wortanfang vor Wortteil, genaue
  Umlaute vor ä = a; ein Tippfehler nur im Namen und nie bei Kürzeln; jedes Suchwort muss passen. Während
  einer Suche eine Liste, beste Treffer zuerst; Treffer über Thema oder Inhaltsliste tragen „🔍 gefunden …“.
  Das Testskript prüft zehn feste Beispielsuchen (`node tools/pruefe_spiele.js suche`).
- Inhaltslisten prüfen nur nach dem Ansehen: In der Entwickler-Leiste und in der Freigabe ist der Listenname
  ein Link zur Liste, „✓ Liste geprüft“ gibt es nur dort; geprüfte Listen grün.
- Filter „🔍 Zu prüfen“ im Tab Spiele für die Aufsicht: Spiele, die noch nicht angesehen sind oder eine
  ungeprüfte eigene Inhaltsliste haben (heute 49 von 84).
- Schriftlich-Werkstatt: Übertrag selbst schreiben (Entscheid UE1 a). Schalter „✏️ Übertrag: nach Stufe ·
  zeige ich · schreibst du“ auf der Stufenwahl (nach Stufe: 1–3 zeigt das Spiel, 4–6 schreibt das Kind);
  nach jeder Ergebnisziffer kommt der Übertrag ins Bläschen („?“, kein Übertrag = 0), Hinweis ohne Lösung,
  nach drei Fehlversuchen schreibt ihn die Eule. Endlos-Handgriffe zählen ihn mit.
- Rahmen: allgemeine Spieloptionen (`def.optionen`, `ctx.option`, Profil `optionen`, im Protokoll); der
  Reihenfolge-Schalter nutzt denselben Baustein. Klassen `reihenfolge-zeile/-schalter` heissen jetzt
  `option-zeile/-schalter`.
- Einzahl (Hinweis Patrik „1 werden gegessen“): Rechengeschichten mit Einzahlformen in den Vorlagen
  (`{b:wird|werden}`), das Spiel prüft das je Aufgabe; Kiosk-Kasse („Das ist 1 Fr.“, „1 Stück kostet“),
  Preis-Tabelle („Was kostet 1 kg …?“), Diagramm-Detektiv („Bei … ist es 1 Kind“, neues Feld `einzahl`
  in den Umfragen). Das Testskript meldet solche Stellen künftig als Hinweis „Einzahl?“.
- Neue Spiele (3. Klasse vervollständigt: 11 von 11 geplanten; gesamt 86 von 87, offen nur Mots-Match):
  - **Tipp-Trainer** (Basisklasse 3, D.4.A.1.e, neues Thema „Schreiben“): Buchstaben, Nomen und Sätze auf
    einer Bildschirmtastatur (QWERTZ) oder einer echten Tastatur tippen, Grossbuchstaben mit ⇧; nach drei
    Fehlversuchen tippt die Eule das Zeichen. Inhalte per Verweis aus ABC-Sortierer und Satz-Reparatur.
  - **Schweiz-Karten-Suche** (Basisklasse 4, NMG.8.4.d; Entscheid K3 a): stumme Karte aus swisstopo
    swissBOUNDARIES3D (Landesgrenze, 26 Kantone, Wahlkreise SG, 116 Orte), erzeugt mit
    `tools/karte_schweiz.py` (nur Standardbibliothek, Douglas-Peucker 250 m, 78 KB). Stufen: Wahlkreise SG ·
    Ostschweiz · alle Kantone · Hauptorte · grosse Städte · Königsstufe „markiert — wie heisst es?“. Falscher
    Tipp: Name des getippten Gebiets und Richtung zum Ziel. Namen in `orte.js` (4 neue, ungeprüfte Listen).
    Seen, Flüsse und Gebirge fehlen noch (eigener swisstopo-Datensatz nötig).
- Prüfliste um die Kartenlisten ergänzt (166 Listen in `listen.json`); Checkliste „1 Idee offen“ (Einzahl).
- Session-Abschluss: Report `docs/eulenpfad/report/LERN_Session6_2026-11-01.md`, Handover nachgeführt
  (LERN-17 erledigt, LERN-32 und LERN-33 neu).
  - `.claude/launch.json`: Vorschau „entwicklung“ (Port 8766).

## 2026-11-01 — LERN_Session7
- Lehrplan SG 5./6. Klasse ausgewertet (P56 a, LERN-32): 202 Kompetenzen, 369 Stufen nach dem
  Orientierungspunkt, 52 Spielideen, Top 15 — `docs/eulenpfad/spielideen/lehrplan_sg_5-6.md`;
  Leseskripte `tools/lehrplan_sg_lesen.py`, `tools/lehrplan_sg_5-6.py`.
- Entscheide A1 a, A2 a, A3 a; Lehrmittel SG 5./6. Klasse und Zahlenbuch-Belege für die Basisklasse in
  `docs/eulenpfad/lernziele/lehrplan_sg_session7.md`.
- Neue Spiele: Bruch-Pizzeria (Basisklasse 5, Thema Brüche), Teiler-Spürnase und Überschlags-Radar
  (Basisklasse 6, Thema Teiler und Überschlag); Lernziele MA.1.C.2 und MA.1.A.2 im Katalog erweitert.
- Entscheid B1 a: Mittelwert-Türme (Basisklasse 5) und Velo-Tabelle (Basisklasse 6, Weg und Zeit) statt
  eines Dreisatz-Markts; Lernziel NMG.3.1 neu, MA.3.A.3 und MA.3.C.1 erweitert.
- Einstellungen der Aufsicht je Gerät: Verwaltung → Einstellungen, `LS.EINSTELLUNGEN`, `LS.einstellung`,
  `LS.dezimalText`; erste Einstellung Dezimalzeichen (Standard Punkt), „↺ Alles auf Standard“.
- Konzept `docs/eulenpfad/konzept_klasseneinstellungen.md` (Klasseneinstellungen durch Lehrpersonen,
  nicht umgesetzt).
- Glace-Kombinator (Hinweis Patrik): Das Lob am Ende des Legens wertet die Fundreihenfolge aus —
  wie ein Zählwerk („streng“), nur beieinander („geordnet“) oder kreuz und quer — und nennt das
  Vorgehen; vorher hiess es immer „super systematisch“.
- Vorgehen in der Statistik (Wunsch Patrik): `ctx.vorgehen(art, wert)` je Aufgabe, `AUSWERTUNG.VORGEHEN`
  und `AUSWERTUNG.vorgehen`, Karte „Vorgehen“ mit den letzten 12 Aufgaben. Melden: Glace-Kombinator
  (Systematik), Teiler-Spürnase (Teiler in Paaren, der Grösse nach, durcheinander), Mittelwert-Türme
  (Ausgleichen ohne Umweg); deren Lob nennt das Vorgehen jetzt auch.
- Namen der Spiele (D2 a): `tools/pruefe_spiele.js` meldet doppelte Namen als Fehler und ein Grundwort
  am Ende in mehr als 2 Namen als Hinweis (`NAMEN_GRUNDWORT_MAX`). Die vier neuen Spiele heissen jetzt
  Bruch-Pizzeria, Teiler-Spürnase, Überschlags-Radar (nicht „Pi-mal-Daumen“: π ist kein Stoff der
  Primarschule) und Mittelwert-Türme; Ids und Ordner bleiben. Detektiv (5), Sortierer (4), Puzzle (4)
  liegen weiter über der Grenze, Vorschläge zum Umbenennen später.
- D1 a: Glace-Kombinator heisst Möglichkeiten-Finder 🧩 (Id bleibt).
- C1 a: `LS.geldText` — Geld bis 3. Klasse „25 Fr. 60 Rp.“, ab 4. Klasse „25.60 Fr.“ mit dem
  Dezimalzeichen, nach der Klasse der Stufe (`LS.klasseDerStufe`); Kiosk-Kasse und Preis-Tabelle nutzen es.
- Einstellung Dezimalzeichen auch je Spiel („wie global“, Punkt, Komma), Katalog-Feld `einstellungen`.
- Anleitungen, vom Portal verlinkt: `eulenpfad/anleitung/aufsicht.html` (Erwachsene: Einrichten, Konten,
  Stufen, Testhilfe, Freigabe, Statistik, Sichern, Abgleich, Einstellungen, Fragen) und `kinder.html`
  (kindgerecht, Handy-Bilder). Bilder mit nummerierten Rahmen aus `tools/anleitung_bilder.js` (Chrome ohne
  Fenster, eigenes leeres Profil, Musterkonten und erfundene Beispielrunden); WebP, weil Pages JPEG abweist.
  Endlos-Modus und Ranglisten in beiden Anleitungen (Hinweis Patrik), dafür drei Musterkinder mit
  erfundenen Rekorden; Rahmen nur um sichtbare Elemente (Freigabe-Bild hatte einen leeren Rahmen).
- Session-Abschluss: Report `docs/eulenpfad/report/LERN_Session7_2026-11-01.md`, Handover nachgeführt
  (LERN-34 bis LERN-36 neu).
- Fix: In der PIN-Eingabe stand „null“ (DOM-`append` schreibt null als Text; `anmeldung.js`).
- Portal: Eulenpfad für die 1. bis 6. Klasse; Entwickler-Server liefert WebP mit dem richtigen Typ.

## 2026-11-02 — LERN_Session8
- Rahmen: Zifferntastatur mit Dezimalzeichen (`LS.tastatur({ dezimal, nachkomma })`, `onOk(wert, text)`,
  `LS.tippSchritte(wert, stellen)`); erledigt LERN-36.
- Runde 1, 5./6. Klasse (15 Spiele): Zehntel-Lupe, Dezimal-Rakete, Dezimal-Rutsche, Schoggi-Brüche,
  Probe-Stempel, Zufalls-Skala, Rechteck-Labor, Würfel-Kipper, Begriffs-Geodreieck, Flächenmass-Treppe,
  Speicher-Leiter, Geheimschrift-Knacker, Hebel-Wippe, Komma-Jagd, Morphem-Schere; Thema Dezimalzahlen.
- Runde 2 (Frage 5 a, 15 Spiele): Rede-Zeichen, Trenn-Schere, Verben-Fächer, Wort-Spürnase, Sound-Sorter,
  Taschengeld-Planer, Wassertropfen-Reise, Erdzeit-Leiter, Pflanzen-Bestimmer, Blutkreislauf-Lotse,
  Energie-Wandler, Bionik-Paare, Kakao-Weg, Rhythmus-Diktat, Tonleiter-Treppe; Thema Wirtschaft.
- Runde 3 (Frage 6 a, 11 Spiele): Mots-Match, Wörter-Brücke, Le ou la?, Son-Lauscher, Nombres-Rallye,
  Quelle heure?, Calendrier, Au café, Weather-Report, Datei-Typen, Braille-Finger; Fach Französisch, Stimme
  fr-CH/fr-FR.
- Kindergarten (Wunsch Patrik, Frage 8 a): Klasse 0 im Profil und beim Anlegen (`LS.KLASSEN`, `LS.klasseVon`);
  Paket mit Teddy-Versteck, Sortier-Kiste, Gegenteil-Wippe, Tageslauf-Sonne, Merk-Blick, Finger-Zähler,
  Gerecht-Teiler, Klang-Wichtel (Lehrplan neu gelesen, erste Stufen des 1. Zyklus).
- Vorlesen (rahmen.md Abschnitt 12): 🗣️ neben der Eule, im Spiel automatisch für Kindergarten und 1. Klasse
  oder nach Einstellung (auch auf der Stufenwahl), langes Drücken liest Knöpfe, Stufen und Spielkarten,
  Stimmlage für Aufgabe, Lob und Tipp, 🔇 schaltet auch die Stimme; Lob nicht mehr doppelt.
- 29 Spiele der 1./2. Klasse lesearm überarbeitet (Vorlesbares in `.frage`, Zeichen auf Antwortknöpfen).
- `LS.losGehts`: „▶ Los!“ und 3-2-1 vor dem kurzen Zeigen (Merk-Blick, Punkte-Blitz, Blitzlesen,
  Finger-Zähler); Finger-Zähler mit gestrichelten Fingern statt Tipp auf die Handfläche.
- `server_starten.bat` mit `tools/server.py` (ohne Zwischenspeicher), `entwickler_server_starten.bat`.
- Testskript: Ersatz-DOM gekapselt, fr-FR-Stimme, Mix-Hänger-Zählung, Beispielsuchen; Profilseite auf dem
  Handy nicht mehr zu breit; leere Eulenblase ausgeblendet.
- Prüfliste Teile 41–65, Checkliste; Session-Abschluss: Report `docs/eulenpfad/report/LERN_Session8_2026-11-02.md`,
  Handover (LERN-37 bis LERN-39 neu).

## 2026-11-02 — LERN_Session9
- LERN-38 (F1–F4 a): „▶ Los!“ nur zu Rundenbeginn und nach Fehlern, sonst 👀; Uhr erst, wenn das Kind
  antworten kann (`ctx.uhrWarten`, `ctx.wartezeit`); Vorgabezeiten ohne Wartezeit.
- Lehrplan 3. und 6. Klasse ausgewertet (G1 a), mit Übertritt in die Oberstufe und nationaler Sicht:
  `spielideen/lehrplan_3_und_6.md`, `lernziele/lehrplan_sg_session9.md`, `tools/lehrplan_sg_3_6.py`.
- Runde A, 6. Klasse (H1 a, 10 Spiele): Sachaufgaben-Kompass, Fahrplan-Rechner, Komma-Messband,
  Prozent-Brücke, Stufenzahl-Schieber, Stimmt-immer?, Sachtext-Spurensuche, Korrektur-Stift (G4 a),
  Hör-Reporter, Wortarten-Probe; Themen Begründen und Zuhören. Übertritts-Check im Zufallsmix.
- Fazit in der Statistik (`AUSWERTUNG.fazit`): Menge, Qualität, Konzentration, Stärken/Schwächen,
  Auffälligkeiten; fürs Kind nach Freigabe der Aufsicht.
- Fehler melden (K1 a, M1 a): „🙋 Melden“, Meldungen je Kind, Aufsicht bestätigt und leitet weiter
  (Entwickler-Server oder E-Mail), Antwort über `eulenpfad/meldungen-stand.json` (`tools/meldungen_stand.py`),
  🏅 Fehlerfinder; Adresse an einer Stelle in `eulenpfad/kontakt.js` (A1 a, noch leer, LERN-40).
- Hilfe ❓ und Tipp 💡 in allen 150 Spielen (T1–T3 a); Tipps zählen halb bei den Sternen; ❓ und 🙋 halten
  die Uhr an und verdecken die Aufgabe.
- Pentomino-Puzzle „🧩 Ein Teil legen“ (P1 a); Son-Lauscher Stufe 6 ohne verratene Schreibweise (S1 a);
  Bemerkungen 1 und 2 (Finger-Zähler, Malkreuz); Meldefenster behält die Rundung.
- Session-Abschluss: Report `docs/eulenpfad/report/LERN_Session9_2026-11-02.md`, Handover (LERN-38 erledigt,
  LERN-40 bis LERN-42 neu).

## 2026-11-03 — LERN_Session10
- Runde B, 3. Klasse (T1–T8, 8 Spiele): Platzhalter-Geschichten, Zeit-Schätzer, Würfel-Zähler, Auge-Entdecker,
  Gemeinde-Helfer, Gefühle-Radar, Geschichten-Ordner, Hör-Geschichte; Themen Erzählen und Gemeinschaft;
  Lehrplan-Codes an sg.lehrplan.ch geprüft (`lernziele/lehrplan_sg_session10.md`), Prüfliste Teile 70–76;
  Entscheid V1 a (Rechen- und Sachtexte in `frage` werden vorgelesen).
- Runde C (S8, S9, S14, S15, T9–T11, 7 Spiele): Quader-Volumen, Diagramm-Wahl, Gattungs-Kenner, Figuren-Spiegel,
  Kulturen-Koffer, Hello-Dialog, Lärm-Wächter; Thema Dialoge; Prüfliste Teile 77–82. 165 Spiele, Ideenlisten
  abgearbeitet (Checkliste 0 Ideen offen).
- Startseite: Zeile „Nur“, Thema/Stufe/Klasse als Mehrfachwahl mit „Alle“ als Umschalter, Klassen-Filter,
  Karten Zufallsmix und Zufälliges Spiel unter dem Filter.
- Bedarf (`AUSWERTUNG.bedarf`, `ziehe`) für Zufälliges Spiel und Zufallsmix; Suche mit persönlicher Passung
  (`LS.passung`); „🔗 Ähnliche Spiele“ (`LS.aehnlich`) mit Knopf auf Startblatt und Schlusskarte.
- Zufallsmix nennt Kindern die noch nicht freigegebenen passenden Spiele (Übertritts-Check).
- Lernplan mit Wochenziel und Wochenstern (L1 a), Tab „🏅 Erfolge“ mit 24 Abzeichen, 🆕 und Teilen als Bild
  (Annahme B1, Datenschutz-Ausnahme in CLAUDE.md); rahmen.md Abschnitt 15.
- Session-Abschluss: Report `docs/eulenpfad/report/LERN_Session10_2026-11-03.md`, Handover (LERN-13, LERN-42,
  LERN-44 erledigt; LERN-43, LERN-45, LERN-46 neu).

## 2026-11-03 — LERN_Session11
- Vorlesen und Töne nacheinander (Meldung Patrik, Hoch-Tief-Ohr): `ctx.nachAnsage(fn)` im Rahmen — erst Lob der
  vorigen Aufgabe ausreden lassen, dann vorlesen, dann Melodie oder Hörtext; gleicher Auftrag wird automatisch nur
  einmal gelesen. Hoch-Tief-Ohr, Tonleiter-Treppe, Rhythmus-Diktat, Gefühle-Radar, Hör-Geschichte und Hör-Reporter
  umgestellt (vorher eigene Verzögerungen von 250/450 ms); Wartezeit der Uhr zählt ab der Ansage.
- Portal: je App eine Spalte, die Anleitungen hängen an der Eulenpfad-Karte (P1 a); auf dem Handy direkt darunter.
- Anleitungen für Erwachsene und Kinder nachgeführt (Spiele finden, Lernplan, Hilfe/Tipp/Vorlesen/Melden,
  Kindergarten, Fazit, Erfolge, Fehlermeldungen); `tools/anleitung_bilder.js` mit fünf neuen Bildern.
- Abzeichen mit Stufen 🥉 Bronze bis 💎 Diamant und eigener Abstufung je Abzeichen (19 Abzeichen, 95 Stufen;
  Runden-, Sterne- und Entdecker-Reihen zusammengelegt, Gesehenes bleibt gesehen).
- Wochenkarte warnt, wenn die Serie zu brechen droht.
- Konzept Gruppen (Familie, Klasse, Lerngruppe; Lehrperson, Klassenstatistik, verschlüsselter Abgleich je Gruppe):
  `docs/konzept_gruppen.md`, Entscheide G1–G10 offen (K1 a); mit Speicher im Browser (gemessen: localStorage rund
  52 Mio. Zeichen, IndexedDB 5,7 GB im eingebauten Browser; iPad ungeprüft), Schicht Arbeitsspeicher über
  IndexedDB, Tabelle der Abgleichsdaten und Klassenserver im Intranet (G9, G10).
- Entscheid S1 a: Strategie-Rätsel im Eulenpfad, ganze Partien Schach und Go erst im Lernsteig (LERN-49).
- Strategie-Rätsel gebaut (ST1 a, ST2 a, ST3 a; Thema „Strategie“, MI.2.2, Basisklasse 5): Stein-Duell (Nim),
  Steine fangen (Atari-Go), König in der Falle (Matt in 1, Königsstufe Matt in 2; 144 eigene Stellungen, Prüfliste
  Teil 83) — je mit eigener Regel-Maschine, die jeden Zug selbst prüft. 168 Spiele.
- Rahmen: Regelseite je Spiel (Katalog `regeln: true`, „📖 Regeln“ auf Startblatt und in der Hilfe, `regeln.css`,
  Prüfung im Testskript; rahmen.md 16); `ctx.tipp(texte, beiTipp)` für Tipps mit Bild.
- Entscheide SD1 a, SF1 a, SF2 a (Go-Koordinaten A–I ohne Lücke).
- Konzept Gruppen entschieden: G1–G10 nach Empfehlung mit Zusätzen (G3 rückwirkend datierbar, G4 abwärtskompatibel
  mit sofortigem Ersatz der unverschlüsselten Datei, G5 Eindeutigkeit am Ort geprüft, G7 QR für den Beitrittscode,
  G8 Challenges mit Zustimmung der Lehrperson, G9 auch Internet, Betrieb dort als G11 offen). Neue Anleitung
  `docs/anleitung_zertifikat_klassenserver.md` (G10; Befehle mit openssl 3.2.3 und Python-https geprüft).
- G3b a (Austritt: Geteiltes bei der Klasse löschen, vorgewählt Ja), G11 a und b mit c beschrieben; QR auch für die
  Adresse des Klassenservers. Neue Anleitungen `docs/anleitung_klassenserver_internet.md` (Vergleichsmatrix a/b/c)
  und `docs/anleitung_freiwillige_beitraege.md` (LERN-50; Angaben der Anbieter ungeprüft).
- Freiwillige Beiträge vorbereitet (LERN-50): `portal/unterstuetzen.js` (leere Links = unsichtbar),
  `portal/unterstuetzen.html`, Hinweis in Portal-Fusszeile, Anleitung für Erwachsene und Verwaltung → Einstellungen,
  nie für Kinder; Testskript prüft, dass sonst nichts im App-Ordner die Beitragsseite verlinkt.
- Anregungen der Aufsicht an die Entwicklung (Verwaltung → Meldungen, `typ: "anregung"`, gleicher Weg und gleiche
  Antwort wie Fehlermeldungen, für Kinder unsichtbar).
- Sortierung im Tab Spiele (SO1 a, SO2 a): Vorgabe nach Fach und Thema, dazu „passt zu dir“, Alphabet, Klasse, je auf
  oder ab; Kinder ab der 4. Klasse wählen selbst; Vorgabe und Erlaubnis je Kind in Konten.
- Katalogfeld `art` (Spielweise, SP1 a) für alle 168 Spiele: 145 aus den Bausteinen, 23 nach dem Hilfetext; Testskript
  prüft es. Spieltabelle im Portal `portal/eulenpfad-spiele.html` (Name, Fach, Thema, Art, Klasse, Verfügbarkeit nach
  Prüfstand; Sortieren nach mehreren Spalten mit Priorität, Filter).
- Bemerkungen 3–5 erledigt: Bild und Wort stimmen überein (ABC-Sortierer „Daumen 👍“ statt „Dach 🏠“, ebenso
  Geschichten-Ordner und Hör-Geschichte); Auge-Entdecker mit eigener Trefferebene (Pupille und Augenlid antippbar,
  sichtbare Formen fangen keine Tipps mehr); `meldungen-stand.json` mit zwei Antworten.
- Entwickler-Leiste erscheint auch in Spielen, die auf eine Stimme warten (Au café und 12 weitere; Ereignis
  `lernspiele:spiel` beim Start).
- Stimmen sichtbar: Startblatt zeigt die Stimme je Sprache (gefunden, lädt, fehlt) mit „▶ Probe“ und Rückmeldung;
  Fehler beim Sprechen meldet die Eule einmal je Runde (rahmen.md 12).
- Meldung 6 (Au café): Die nächste Aufgabe kommt erst, wenn die Stimme fertig ist (höchstens 6 s), in allen Spielen.
- Auge-Entdecker: Beim Weissen leuchtet die Fläche statt des Randes der Augenöffnung (wirkte wie die Augenwinkel).
- Prüfung je Eintrag (LP1 a, LP2 a, LP4 a; rahmen.md 17): Prüfansicht im Spiel mit Abschnitten und Gruppen
  (aufklappbar, geprüfte zu), Haken je Eintrag am Fingerabdruck, „✓ alle“ und „Ganze Liste geprüft“, Bemerkungen je
  Eintrag sichtbar und entfernbar, Bilder vom Spiel gezeichnet; Entwicklung schreibt den Prüfstand, Aufsicht und
  Lehrperson haken auf ihrem Gerät ab und schicken Korrekturen. Pilot: Anlaut-Angel (je Buchstabe bzw. Laut gruppiert),
  Auge-Entdecker (sieben Abschnitte, Teile mit markiertem Bild).
- Wiederholungen: Eine Aufgabe kommt erst wieder, wenn alle verschiedenen der Stufe einmal dran waren, auch über Runden
  (Gedächtnis je Kind, Spiel, Stufe); die Serienbremse geht vor.
- Bemerkung 7: Blitz-Spiele verdecken die Antworten, bis das Aufblitzen vorbei ist (`LS.losGehts` mit
  `antwortenNachBlitz`; Blitzlesen, Punkte-Blitz, Finger-Zähler); die Uhr startet erst dann.
- Abschluss: Report `docs/eulenpfad/report/LERN_Session11_2026-11-03.md`; Tests „Keine Fehler.“ über alle 168 Spiele.
- Nach dem Abschluss, DD1 a: Diagramm-Detektiv heisst **Daten-Detektiv** (zeigt Strichlisten, Tabellen und Säulendiagramme, Lehrplan MA.3.C.1 Daten); Kennung `diagramm-detektiv` bleibt, Checkliste ordnet die Idee unter dem alten Namen zu.

## 2026-11-03 — LERN_Session12
- Meldung 8: Ziffernkarten nennen „Vorne darf keine 0 stehen.“ gleich unter der Aufgabe, im Ergebnis und in der
  Einleitung; Antwort in `meldungen-stand.json`.
- LP3 a: Eine Liste geht erst ganz geprüft in die Aufgaben. LP3-H a: `tools/listen_fingerabdruck.js`; Testskript
  meldet nach der Prüfung geänderte Listen als Fehler, die Checkliste führt sie wieder als zu prüfen.
- Profil für Kinder (AV1–AV6, ST1, ST2, ZG1, RF1, VR1; konzept_profil_kind.md, rahmen.md 18): Kind sieht nur „Mein
  Bild“; Avatare (`avatare.js`) in fünf Sätzen auf 6 Farben mit 4 Rahmen, vor dem Namen überall; Abzeichen-Symbole
  gezeichnet (auch im Tab Erfolge und im geteilten Bild), ab Gold als Bild wählbar; Rahmen Gold/Platin/Diamant ab dem
  ersten Abzeichen in diesem Rang; Hinweis „Freigeschaltet“ im Tab Spiele, 🆕 und 🔒 in der Bildwahl.
- Wahl des Kindes (Stufenwahl, Spielkarte) getrennt von der Vorgabe der Aufsicht, mit „🔒 fest“ und „↺ Auf Vorgabe
  zurück“ (VR1 a); vorher überschrieb das Kind die Vorgabe still. Profil der Aufsicht: „wie global“.
- Schalter Reihenfolge auf den Karten von Zahlen-Baukasten und Zahlenrätsel-Tresor; „▶️ Weiterspielen“ im Tab Spiele;
  Statistik des Kindes mit vier Karten; „🏆 Meine Podestplätze“ im Tab Erfolge.
- Endlos (EN1 a, EN2 a): jede Stufe ab 100 verschiedenen Aufgaben, mit Liste oder ohne, gemessen mit der Kennung des
  Rahmens (`LS.pruefung.zaehle`, Testskript meldet Abweichungen); Katalog 129 statt 63 Spiele. Endlos beim Zufälligen
  Spiel (♾ auf der Karte), Endlos-Mix mit allen Spielen.
- Fix: Eine neue Rahmenfunktion `waehle` verdeckte die zufällige Auswahl (`LS.waehle`); umbenannt in `setzeWahl`,
  das Testskript meldet doppelte Namen in `spiel.js`.
- Anleitungen: Bildwahl, Profil der Aufsicht, Hinweis zu PINs, Endlos bei Zufall und Mix; Bilder a19, k13 neu.
- Abschluss: Report `docs/eulenpfad/report/LERN_Session12_2026-11-03.md`; letzter Testlauf nach 168 Spielen × 6 Stufen
  ohne Fehler abgebrochen, Endlos, Mix und Kind-Läufe ungeprüft.

## 2026-11-04 — LERN_Session13
- Testlauf über alles: Handgriffe in den Endlos-Stufen von 21 Spielen (65 Fehler). HG1 a: Handgriffe gelten ab dem
  Stellen der Aufgabe, späte Aufrufe meldet das Testskript.
- Anmeldung (KR1 a, KR2 a): „🐣 Ich bin neu“ für Kinder (Vorname, Klasse) und Erwachsene (Frage über dem Stoff der
  Primarschule, Erlaubnis einer bestehenden Aufsicht); „Zurück“ im Browser schrittweise. PIN vergessen (PIN1 a,
  PIN1-R a): zweite Aufsicht, Wiederherstellungscode, Sicherheitsfrage, Zurücksetzen mit 3 Tagen Frist;
  `LS.ohneGeheimnis` für Sichern, Abgleich und Einlesen.
- Kurztasten für Antwortknöpfe (TK1 a): Schweizer Tastatur, gleiche Zeichen auf gleichen Tasten, Belegung erkannt in
  Chrome/Edge; Bausteine und 22 Spiele (rahmen.md 19).
- Ganze Aufgabe im Bild (BH1–BH3 a): Rahmen nach Höhe, Zifferntastatur daneben oder unten fest, Sprechblase zwei
  Zeilen, 💡 beim Antwortbereich, `LS.lesetext`; 58 Spiele angepasst; `tools/bildhoehe.js`. GR1 a (sichtbare Fläche)
  entschieden, Umsetzung und offene Punkte in `docs/eulenpfad/bildhoehe_offen.md`; GR1 b zurückgestellt.
- Notizen für Zwischenergebnisse (NZ1 a): `ctx.notizen`, `LS.notizFeld`, Einstellung der Aufsicht, Abzeichen
  „Kopfrechner“; 32 Spiele (`docs/eulenpfad/konzept_notizen.md`).
- Probe-Stempel: Endziffer-Probe mit „nicht sicher“, getarnte Fehler, Abzeichen „Ganz sicher“. Rechen-Maschine: Tipps
  mit den Zahlen der Aufgabe. Rückmeldung lesbar und überspringbar (WZ1 a); Eule zeigt bei neuer Aufgabe den Auftrag.
- Entschieden, noch nicht gebaut: Sudoku-Familie (SU1–SU3 a), Neunerprobe (PS2 a, Rückfrage offen).
- Abschluss: Report `docs/eulenpfad/report/LERN_Session13_2026-11-04.md`.

## 2026-11-04 — LERN_Session14
- README im Repo als Übersicht der Reihe, Eulenpfad-README nach `eulenpfad/`; CLAUDE.md: Kindergarten bis 6. Klasse.
- Profil: Geburtsmonat statt Alter (`LS.alterVon`, Annahme GM1 ohne Tag); Klassenaufstieg einzeln und als „Neues
  Schuljahr“ in Verwaltung → Konten, Nachricht ans Kind, Abzeichen „Aufgestiegen“; Profil der Aufsicht neu geordnet
  (Person, Vorgaben, Fokus je Fach einklappbar, Speichern, darunter die Sofort-Häkchen); Kind sieht Alter und Klasse.
- Tab Spiele: Klassen-Rand (G1 a, Deko-Farben mit Zeichen), Filter einklappbar, 📖 Anleitungen in der App.
- Notizblock für schriftliches Rechnen (NB1–NB4 a): `spiele/gemeinsam/notizblock.js`, Vorlagen Plus, Minus, Mal,
  Geteilt, Häuschen, Dezimalzahlen mit Kommalinie, eigenes Ziffernfeld, `ctx.notizblock`; Schriftlich-Werkstatt auf
  dem gemeinsamen Raster. Bildschirmtastatur schreibt ins gewählte Notizfeld. Probe-Stempel mit beschrifteten
  Zerlegungsschritten.
- Rahmen: Eule zeigt den Auftrag aus `.frage`/`.auftrag`; Ja/Nein auf J/N; Balken der Rückmeldung auf festem Platz.
- Sachaufgaben-Kompass: Angaben mit Bedeutung (SK1 a). Pentomino-Umriss sichtbar. Rechteck-Labor: Höhe ganz sichtbar.
- Hilfsmittel als eigene Spiele (HM1 a, `spielideen/hilfsmittel.md`); neu Hundertertafel-Detektiv (169 Spiele).
- Bemerkungen 9 und 10 erledigt, Meldungsstand neu.
- Abschluss: Report `docs/eulenpfad/report/LERN_Session14_2026-11-04.md`.

## 2026-11-05 — LERN_Session15
- Notizblock mischt Rechnungen (Plus und Minus in einer Spalte, „Weiterrechnen“ bis sechs Rechnungen, Ziffernfeld fest
  unten mit eingestelltem Dezimalzeichen, Platz für Tablet quer); Anleitungen mit Notizblock, Klassen-Rand, Filter.
- Prüfung der Cloud-Sitzung LST_Session1 und der lokalen Recherchen; Plan zum Angleich der Reihe
  (`docs/plan_angleich_reihe.md`, Pakete A–H); Entscheide A1, A2, C1 (mit Filter), C2, F1, P1, P2, R1 (alle a).
- Lernsteig aus dem Cloud-Repo zurückgeholt (`8f55173`) und gesperrt bis zum Prüfstand; Cloud-Repo abgeschlossen;
  `.gitignore` für Sicherungen von Lernsteig und Gratwanderung.
- Gemeinsamer Kern 1.0.0 bis 1.6.0 (`kern/`, `tools/kern_verteilen.py`, `tools/pruefe_kern.js`, `docs/kern/rahmen.md`):
  Zahl, Bruch, Speicher, Zufall, `el`, Geheimnis, Person, Freigabe, Suche, Runden; in Eulenpfad und Lernsteig benutzt.
- Eulenpfad: Profile als Personen mit fester Kennung, Runden und Rekorde im gemeinsamen Format, Einlesen geprüft (D14).
- Lernsteig: eine Personenliste, Aufsicht nur mit Bestätigung und Verbinden nur mit Zustimmung (D5), Einlesen geprüft und
  alles oder nichts (D4), Einladung geprüft (D12), Runden im gemeinsamen Format, `pruefe_konten.js`.
- CLAUDE.md: Geburtsdatum vollständig (B3), Datenschutz-Ausnahme Aufsicht im Lernsteig; globale Regel „Testläufe
  während eines Umbaus“ in `~/.claude/CLAUDE.md`.
- Abschluss: Report `docs/eulenpfad/report/LERN_Session15_2026-11-05.md`.

## 2026-11-06 — LERN_Session16
- Fahrplan-Rechner: Bei einer Zeitdauer zeigen leere Anzeige und Rechnung „? h ? min“ (Bemerkung 11, Antwort ans Kind).
- Bildersammlung `spiele/gemeinsam/bilder.js` (B1 a, rahmen.md 22): einzige Quelle für Bilder ohne Emoji (`svg:<name>`);
  `LS.bild`, `LS.mitBildText`, `LS.zelleMitBildern`; Knöpfe, Karten, Körbe und beide Listenansichten zeichnen sie.
  Waschbrett, Waschmaschine (Früher–heute) und Triangel, Klangstab, Schlagholz (Instrumente) umgezogen; 24 Lebewesen
  neu gezeichnet (tiere.js, nahrung.js) — Lebensraum Stufe 1–4 jetzt mit allen Lebewesen. Testskript: fehlendes Bild
  und Bildname als Text sind Fehler. Bemerkungen 12–22 erledigt.
- Prüfvermerk `lebensraum/nahrungsketten` aufgehoben (B2 a), bis die neuen Bilder darin geprüft sind.
- Kern 1.7.0: `anmeldung.js` (`KERN.anmeldung.platz`) — Anmeldung und Sitzung im Tab für beide Apps (Eulenpfad:
  Kind oder Aufsicht; Lernsteig: Jugendliche und Aufsicht), Schlüssel unverändert; docs/kern/rahmen.md 4.11.
- Weg zum Portal (PL1 a): „↑ Alle Apps“ oben links auf der Startseite des Eulenpfads; Lernsteig und Gratwanderung
  von „← Alle Apps“ auf „↑ Alle Apps“ (← führt innerhalb einer App zurück, ↑ eine Ebene hinauf zum Portal).
- Lernsteig: Anmeldung zuerst (C1, vorgezogen nach AZ1 a) — Jugendliche und Aufsichten zum Antippen, „Ich bin neu“
  (Jugendliche oder Aufsicht mit Bestätigung), „Als Gast weiter“; ein Platz für alle (Aufsicht anlegen und anmelden
  auf der Startseite, aufsicht.html nur noch angemeldet); Gast (C2 a) nur im Tab, nichts gespeichert, je Gerät
  abschaltbar; Runden der Aufsicht als Test; Übungen und Statistik ohne Anmeldung nur mit dem Weg dorthin. Kern 1.8.0:
  Gast in `KERN.anmeldung`. Konten-Tests 48 Fälle.
- Lernsteig: keine Frage für Erwachsene (EF1 a, Stoff der Oberstufe trennt nicht); im Konto jedes Jugendlichen die
  Aufsichten des Geräts mit Datum und ob sie mitlesen.
- Kern 1.9.0: `entwicklung.js` (`KERN.entwicklung`) — Entwickler-Modus für alle Apps (Schlüssel, Zustand, Server, Prüfstand
  und Bemerkungen je App); Entwickler-Server mit `APPS` (Eulenpfad, Lernsteig; Anfragen ohne `app` = Eulenpfad);
  Eulenpfad umgestellt (`LS.entwicklung` unverändert); Lernsteig: Freischalten auf der Aufsichtsseite, Leiste in den
  Übungen („Übung angesehen“, Bemerkung), Prüfstand im Format des Servers. docs/kern/rahmen.md 4.12, lernsteig/rahmen.md 5e.
- Kern 1.10.0: `einladung.js` (`KERN.einladung`, EL1 a) — Einladung als Link oder Datei; Eulenpfad: „📨 Einladung zum
  Lernsteig“ im Profil eines Kindes der 6. Klasse (EP1 erledigt); Lernsteig liest über den Kern, auch als Datei, und behält
  einen Geburtsmonat ohne Tag. CLAUDE.md: Datenschutz-Ausnahme Einladung.
- Kern 1.11.0: `auswertung.js` (`KERN.auswertung`, AW1 a, AW2 a) — Sitzungen, Lernzeiten, Wochen, Stand, Bedarf, Ziehen
  für beide Apps; Eulenpfad: Bedarf und Vorschläge aus den letzten 24 Aufgaben (bei Runden zu acht gleich wie bisher,
  nachgerechnet), Lernplan über `wochen`; Lernsteig: Kompetenzstand und Wochenserie über den Kern.
- Kern 1.12.0: `KERN.person.uebernehmen` — Übernahme einer Aufsicht zwischen den Apps (C9, Ü1 a, Ü2 b): Eulenpfad →
  Lernsteig im Profil der Aufsicht (mit Rolle), Lernsteig → Eulenpfad auf der Aufsichtsseite; gleiche Kennung, PIN,
  Sicherheitsfrage und Art, neuer Wiederherstellungscode, nichts überschrieben.
- Lernsteig: Tabs wie im Eulenpfad (C2, TA1 a) — Übungen · Profil · Statistik · Erfolge · Verwaltung (nur Aufsicht), Tab in
  der Adresse; Leiste mit angemeldeter Person und Abmelden; Erfolge mit Wochenziel, Stand je Übung und Rekorden;
  Aufsicht sieht verbundene Konten unter #statistik/<id> und #erfolge/<id>; statistik.html und aufsicht.html leiten weiter.
- Abschluss: Report `docs/eulenpfad/report/LERN_Session16_2026-11-06.md`.

## 2026-11-06 — LERN_Session17
- Kern 1.13.0: `rolleiste.js` (`KERN.rolleiste`) — Tab-Leiste in Eulenpfad und Lernsteig bleibt einzeilig, die Tabs rollen
  seitlich mit Pfeilen nur bei Bedarf, der gewählte Tab rollt ins Bild; „Angemeldet:“ nicht mehr sichtbar (Tooltip);
  unter 600 px Tabs auf eigener Zeile über der Person (Wunsch Patrik); Pfeile neben den Tabs statt darüber, der gewählte
  Tab rollt ganz ins Bild (Rückmeldung Patrik).
- Kern 1.13.0: `personenmenue.js` (`KERN.personenMenue`, Entscheid PA1 a) — Person und Abmelden in beiden Apps gleich:
  Personen-Knopf mit Bild und Name, Menü mit den anderen Personen und getrennt darunter „↩ Abmelden“ (beim Gast
  „Anmelden“); ersetzt die Auswahlliste des Eulenpfads und Name mit Knopf im Lernsteig.
- Kern 1.14.0: `terme.js` (`KERN.terme`) und `rechner.js` (`KERN.rechner`, Rechenkern) aus dem Lernsteig; der Lernsteig reicht weiter (`LST_TERME`, `LST_RECHNER` mit Modellen und Tastenfeld). Behoben: D3
  (Absturz bei „(3)(2x+3)“), D9 (NaN „nicht definiert“, Anzeige auf 10 Stellen), D10 (Grenzen statt eingefrorenem Tab),
  Exponenten ab 10 in `text` und `lies` (x¹⁰, x²³). Glieder in Lösungen wie im Lehrmittel geordnet (TO1 a:
  a² + 2ab + b²); heute ändert das keine Aufgabe der Übungen.
- Server (SV1 a): `server_starten.bat` und `entwickler_server_starten.bat` öffnen die Einstiegsseite `portal/` wie
  GitHub Pages; beide Server leiten die Wurzel dorthin und nennen Einstieg, Eulenpfad und Lernsteig in der Konsole.
- Bemerkungen 23–32 erledigt: 20 neue Zeichnungen in der Bildersammlung (Faustkeil, Pfahlbau, Römerstrasse, Pyramiden,
  Tempel, Webgewicht, Tonkrug, Bronzebeil, Mahlstein, Latein, Aventicum, Wachstafel, Kaiser, Hieroglyphen, Mumie,
  Schriftzeichen; Vormensch, Frühmensch, früher Homo sapiens, Neandertaler — MF1 a) statt unpassender oder fehlender
  Emojis im Zeitstrahl-Sortierer, Kulturen-Koffer und in der Erdzeit-Leiter; die drei Spiele zeichnen über `LS.bild`,
  die Ablage von `LS.reihenfolge` auch. Zeitstrahl: Gutenberg und Kolumbus mit „Übergang vom Mittelalter zur Neuzeit
  — wird nicht gefragt“ (ZA1 a). Listen und Bilder ungeprüft bis zur Prüfansicht (E1 a). Dazu das Steinbeil der
  Pfahlbauer (geschliffene Steinklinge in Hirschgeweih am Holzschaft) statt 🪓.
- Prüfliste neu erzeugt (`docs/eulenpfad/pruefung/listen.json`, `wortlisten_zur_pruefung.md`): Die Prüfansicht zeigte
  noch die alten Bilder, weil sie aus der erzeugten Prüfliste liest. `pruefliste_wortlisten.js --pruefe` vergleicht nur
  und endet mit Code 1, wenn sie veraltet ist; `tools/pruefe_spiele.js` ruft das bei jedem Lauf auf. Kulturen-Koffer:
  vorhandene Zeichnungen auch bei „Gab es das schon?“ (Holzhaus, Töpfe aus Ton) und bei den Funden (Webgewicht,
  Tonkrug, Pyramide, Hieroglyphen).
- Bilder aus der Zeit der Kultur (BZ1 a): 18 neue Zeichnungen — Helm des Legionärs und griechischer Bronzehelm,
  Nilboot, antikes Stadion, römisches Bad, Bodenheizung, Aquädukt, römische Münze, Pharao, ägyptischer Schreiber,
  chinesischer Löffelkompass, Philosoph, α β, römische Zahlen, Vase mit Läufer; im Zeitstrahl Karavelle, Motorwagen
  von Benz und Flugzeug der Brüder Wright — statt 🪖 ⛵ 🏟️ 🛁 ♨️ 🌉 🪙 👑 ✍️ 🧭 🧔 🔤 🔢 🏃 🚗 ✈️; Latein neu als
  Inschrift „VILLA“. Prüfliste neu erzeugt.
- Testgerüst B2, Schritt 1: Einstieg `tools/pruefe.js` für alle Apps (ohne Angabe Kern, Lernsteig, Gratwanderung; den
  Eulenpfad nur, wenn genannt), Übersicht mit Dauer je App. Die Prüfskripte des Lernsteigs liegen jetzt in `tools/`
  (`pruefe_uebungen.js`, `pruefe_konten.js`, vorher `docs/lernsteig/werkzeuge/`); CLAUDE.md (Tests), Rahmen nachgeführt.
- Wartezeit nach einer richtigen Antwort (WZ2 a, Hinweis Patrik): `ctx.richtig(lob, erklaerung)` und `opt.erklaerung` —
  die Erklärung kommt nur nach einem Fehlversuch bei dieser Aufgabe ans Lob; Lesezeit höchstens 3 s statt 5 s (30 statt
  45 ms je Zeichen). 12 Spiele trennen Lob und Erklärung (Bionik-Paare, Blutkreislauf-Lotse, Energie-Wandler, Erdzeit-Leiter,
  Fledermaus-Forscher, Kakao-Weg, Kulturen-Koffer, Nombres-Rallye, Schulweg-Profi, Tier-Sortierer, Wetter-Jahreszeiten,
  Znüni-Teller). Auf Anhieb gelöst warten sie jetzt 1,3–1,8 s statt 2,8–3,6 s.
- Testgerüst B2, Schritt 2 (AN2 a): Seiten des Lernsteigs im Ersatz-DOM (`tools/lernsteig_seiten.js`) statt Playwright —
  alle Rollen und Tabs, Konten über die Bedienung, Rechner-Sperre, Einladung, 320 Runden über alle Übungen, Stufen und
  Niveaus (11 s). Ersatz-DOM: Adresse mit `#` und `hashchange`, `history.replaceState`, eigener Speicher je Tab,
  `select.value` aus der gewählten Option, `name`/`type`/`href` gespiegelt, `__textMitAbstand` — sichtbarer Text mit
  Abstand zwischen den Knoten, sonst fand die Suche ein „undefined“ neben einem Nachbarn nicht (auch im Testskript
  des Eulenpfads). Kern 1.14.1: Die Anmeldung dieses Tabs geht vor der gewählten Person des Geräts — ein Jugendlicher
  mit PIN war abgemeldet, sobald sich in einem zweiten Tab eine Aufsicht anmeldete (von den Seitentests gefunden).
- Abschluss: Report `docs/eulenpfad/report/LERN_Session17_2026-11-06.md`, Handover Eulenpfad und Lernsteig.

## 2026-11-06 — LERN_Session18
- Fehler behoben (Eulenpfad, online seit LERN_Session15): „📂 Einlesen“ in der Statistik und „📂 Abgleich-Datei
  einlesen“ in der Verwaltung wiesen jede Datei der Version 3 ab („Diese Datei kann ich nicht lesen.“) — die Prüfung
  verlangte das Feld `profile`, das seit `c8f7d9f` nicht mehr geschrieben wird. Neu `LS.abgleich.datenEinlesen`
  (nimmt `personen` oder `profile`); Test „Sichern und Einlesen“ in `tools/pruefe_spiele.js` (Version 3, Version 2,
  Sicherung des Lernsteigs abgewiesen; einzeln `node tools/pruefe_spiele.js daten`), Gegenprobe mit der alten Prüfung
  schlägt an. Der Abgleich über einen Ordner war nicht betroffen. rahmen.md 10 nachgeführt.
- Entscheide DF1 a, DF2 a, DF3 a, DF4 a (ein Dateiformat `reihe-daten` im Kern, Löschvermerke und Freigabe im Kern,
  Abgleich über einen Ordner als Kern-Teil, Personen mit PIN reisen geschützt über den Wiederherstellungscode) im Plan.
- Kern 1.15.0: `kern/daten.js` (`KERN.daten`) — ein Dateiformat `reihe-daten` für Sichern, Einlesen und Abgleich aller
  Apps: jeder Eintrag geprüft, bevor etwas geschrieben wird, nur geänderte Schlüssel, alles oder nichts; Löschvermerke
  und Freigabe im Kern (DF2 a); ältere Dateien beider Apps umgedeutet, Dateien einer anderen App mit ihrem Namen
  abgewiesen. DF4 a in `person.js` (`fuerDatei`, `gesperrt`, `freischalten`) und `anmeldung.js` (gesperrt = keine
  Anmeldung). Die Apps benutzen es noch nicht; ihr Verhalten ist unverändert. docs/kern/rahmen.md 4.7, 4.11, 4.19 (neu),
  Kern-Changelog, Plan.
- Eulenpfad auf `KERN.daten`: Sichern (Statistik), Abgleich-Datei, Einlesen, Löschen eines Kindes und Zurücksetzen des
  Spielstands gehen über den Kern (Format `reihe-daten`; ältere Dateien werden gelesen). Neu dabei: jeder Eintrag wird
  geprüft, bevor etwas geschrieben wird, und es wird alles oder nichts gespeichert; Statistik und Verwaltung zeigen beim
  Einlesen den Grund in einem Satz („Das ist eine Datei des Lernsteigs; …“). Geschützte Aufsicht (DF4 a): Sie reist
  ohne PIN und ist auf einem anderen Gerät 🔒 gesperrt, bis sie dort mit ihrem Wiederherstellungscode oder der PIN einer
  anderen Aufsicht freigeschaltet ist und eine neue PIN hat — vorher konnte dort, wer sie antippte, ohne Frage eine PIN
  festlegen. Entfernt: eigene Löschvermerke, `LS.ohneGeheimnis`, `meldungenZusammenfuehren`, die doppelte Sicherung in
  der Statistik. rahmen.md 6 und 10. Test „Sichern und Einlesen“ um Sicherung einer Person, zweites Einlesen, Löschen auf
  dem anderen Gerät und die geschützte Aufsicht erweitert.
- Lernsteig auf `KERN.daten` (Kern 1.16.0): Sichern und Einlesen im Format `reihe-daten`, ältere Sicherungen
  (`lernsteig-sicherung` 1, 2) werden gelesen, eine Datei des Eulenpfads wird mit einem Satz abgewiesen. Ein Konto mit
  PIN reist geschützt und ist auf einem anderen Gerät 🔒 gesperrt (DF4 a) — vorher kam es ohne PIN an und war dort für
  jeden offen. Freischalten auf der Anmeldung und im Personen-Knopf mit dem Wiederherstellungscode und einer neuen
  PIN, eine Aufsicht auch mit der PIN einer anderen Aufsicht (`LST_KONTEN.freischalten`). Aufsichten in einer Datei
  liest nur eine angemeldete Aufsicht ein (Entscheid AS1 a). Kern 1.16.0: `einlesen(…, { rollen })`, Option
  `gueltig`, eine eigene PIN nimmt den Vermerk `gesperrt` weg. `.claude/launch.json`: Startprofil `lernspiele-4`
  (Port 8771 fest). docs/lernsteig/rahmen.md 5c, docs/kern/rahmen.md 4.19, gemeinsame_mechaniken.md, Plan.
- Kern 1.17.0: Abgleich über einen Ordner als Kern-Teil `kern/abgleich.js` (`KERN.abgleich`, DF3 a), in Node mit einem
  Ersatz-Ordner geprüft (drei Geräte, kaputte Datei, fremdes Präfix, Erlaubnis). Der Eulenpfad gibt in `abgleich.js` nur
  noch Präfix, Datenbank, Ereignis und den Ergebnissatz mit; Verhalten unverändert (gleiche Datei, gleicher gemerkter
  Ordner). docs/kern/rahmen.md 4.20, rahmen.md 10, Plan.
- Lob nach einer richtigen Antwort (LB1 a, Vorgabe Patrik): Auf Anhieb steht in allen Spielen nur ein kurzes Lob aus
  der Liste des Rahmens („Super!“, „Genau richtig!“ …); was ein Spiel dazu mitgibt (Rechnung, Begründung, „Richtig:
  7 + 4 = 11“), kommt nur nach einem Fehlversuch. Vorher zeigten 137 von 169 Spielen ihren eigenen Text auch auf Anhieb.
  Neuer Prüfer „Lob“ im Testskript (Haken `gelobt`, `LS.LOB`), Gegenprobe mit der alten Regel schlägt an. Die Folge der
  Zufallsaufgaben verschiebt sich dadurch (das Lob zieht jetzt immer aus der Liste); Klickzahlen der Stichproben
  weichen deshalb vom letzten vollen Lauf ab. Eigene Lobliste je Spiel `def.lob` (LB2 a, höchstens 20 Zeichen je Lob):
  die 8 Sprachspiele loben auf Anhieb in der Fremdsprache („Oui !“, „Great!“). rahmen.md 4 (`ctx.richtig`), Plan.
- Kern 1.18.0: `kern/rollen.js` (`KERN.rollen`, RL2 a) — Bestätigung durch eine bestehende Aufsicht, PIN vergessen in den
  Stufen andere Aufsicht, Code, Sicherheitsfrage, Zurücksetzen mit Frist von 3 Tagen; beide Apps benutzen es. Lernsteig
  neu: Sicherheitsfrage beim Anlegen einer Aufsicht (Pflicht), „PIN vergessen?“ der Aufsicht mit Code, Frage oder der PIN
  einer anderen Aufsicht, „⏳ Zurücksetzen“ mit Hinweis auf der Anmeldung und Abbrechen mit PIN oder Code; nach Ablauf
  werden die Aufsichten des Geräts entfernt samt Verbindungen. Eine weitere Aufsicht braucht nur noch dann eine
  Bestätigung, wenn es eine Aufsicht mit PIN gibt (eine gesperrte könnte nicht bestätigen). Eulenpfad: Frist und
  Bestätigung über den Kern, Verhalten gleich. Gruppenleitung mit LERN-48 (RL1 a). docs/kern/rahmen.md 4.21 (neu),
  lernsteig/rahmen.md 5d, rahmen.md 6, Plan (RL1 a, RL2 a).
- Ablauf einer Runde (letzter offener Kern-Teil): Bestand beider Apps aufgenommen, Zuschnitt entschieden (AR1 a,
  Kern-Teil `runde.js` ohne Oberfläche; die Unterschiede ohne Entscheid kommen einzeln zur Vorlage). Doku-Drift behoben:
  lernsteig/rahmen.md 5 nannte den Rekord „je … Niveau“, der Code rechnet nach ST1 a je Stufe.
- Abschluss: Report `docs/eulenpfad/report/LERN_Session18_2026-11-06.md`, Handover Eulenpfad (dazu LERN-60 auf Kern 1.18.0,
  LERN-61 als erledigt in LERN_Session16 nachgetragen) und Lernsteig.

## 2026-11-06 — LERN_Session19
- Ablauf einer Runde, Einzelentscheide RA1–RA8 a (Plan B): `zeit` = Ende der Runde, `dauer` auf 0,1 s, eine Serie ist
  auch eine Runde im Protokoll, eine Liste je Aufgabe, Gedächtnis als Durchgang auch in Serien, Kürzen bei erschöpfter
  Stufe, Zeit je Aufgabe ab `bereit` ohne Pausen, im Lernsteig auf Anhieb nur „Richtig.“.
- Kern 1.19.0: `kern/runde.js` (`KERN.runde`) mit den reinen Hilfen — Gedächtnis, Auswahl der Aufgaben (Suche in fünf
  Stufen, Serienbremse, Kürzen), Rekord nach Kennung, Bestwert, Bestzeit, Dauer, Wächter des Zwischenstands. Nachrechnung
  im Testskript: wählt in 1200 Runden aus 300 Zufallsfällen genau wie die bisherige Schleife des Eulenpfads.
- Eulenpfad: Auswahl, Gedächtnis, Rekorde und Wächter über den Kern; normale Runden unverändert (Stichprobe mit gleichen
  Klickzahlen). Neu: in einer Serie keine Aufgabe zweimal, und das Gedächtnis gilt auch dort (RA5 a; vorher keine der
  letzten 30). Gedächtnis je Person statt je Name (alter Schlüssel übernommen). Eigener Fingerabdruck durch den des Kerns
  ersetzt (gleiche Rechnung). Testskript: Wiederholung in einer Serie ist ein Fund.
- Lernsteig: Durchgang über Runden für alle Stufen (vorher nur Serien, letzte 30, mit Niveau im Schlüssel), Runde endet
  bei erschöpfter Stufe früher (`gekuerzt`), Serie mit „Alle Aufgaben dieser Stufe geschafft“; der Gast merkt sich nichts
  mehr im Speicher (vorher schrieb er sein Gedächtnis). Richtig auf Anhieb nur „Richtig.“, nach einem Fehlversuch der Weg
  mit „Weiter“ (RA8 a; vorher stand der Weg 1,2 s da). Seitentest prüft RA8, Wiederholungen und Gedächtnis; Gegenprobe
  mit dem alten Verhalten schlägt an (84 Funde).
- Ersatz-DOM (`tools/pruef_dom.js`): `addEventListener` auch als Eigenschaft des Fensters, wie im Browser.
- Doku: docs/kern/rahmen.md 4.22 (neu), 4.23; rahmen.md 4.2 und 7 (Wiederholungen); lernsteig/rahmen.md 5;
  gemeinsame_mechaniken.md; Plan (RA1–RA8 a, Stand B).
- Kern 1.20.0: Ablauf einer Runde `KERN.runde.lauf()` — Versuche, Fehler, Lösung nach dem dritten Fehlversuch, Ende der
  Serie, Zeit je Aufgabe ab `bereit` ohne Pausen (RA7 a), Eintrag mit `zeit` am Ende, `dauer` auf 0,1 s und einer Liste je
  Aufgabe (RA1, RA2, RA4 a), Rekord mit derselben Kennung; Umdeutung älterer Runden (`ausEulenpfad`, `ausLernsteig`,
  gegen die alte Aufzeichnung nachgerechnet); beim Zusammenführen ersetzt der spätere Stand einen Zwischenstand einer
  Runde; `KERN.daten` deutet beim Einlesen um.
- Eulenpfad und Lernsteig auf dem Ablauf des Kerns: Protokoll mit `liste` statt `aufgabenZeiten`/`fehlerAufgaben`
  (Eulenpfad) bzw. `zeiten`/`falsch` (Lernsteig); alte Runden beim Laden und Einlesen umgedeutet (Lernsteig dazu `zeit`
  vom Beginn ans Ende, RA1 a). Eine Serie steht auch im Protokoll (RA3 a): ihre Zeit und Aufgaben zählen in Statistik,
  Stand, Fazit und Wochenziel; in Sterne-Auswertungen und Konzentration nicht. Zufallsmix meldet je Aufgabe den Eintrag
  des Kerns und schreibt `liste`; im Endlos-Mix auch Protokoll. Statistik des Eulenpfads zeigt Serien („♾ n in Folge“)
  und je Aufgabe mit Fehler „Lösung gezeigt“, „übersprungen“ oder „nicht gelöst“. Klickzahlen der Stichprobe gleich wie
  vor dem Umbau (die Kennung einer Runde entsteht erst beim Speichern).
- Testskript: Liste je Aufgabe passt zur Runde (Aufgaben, Fehler, gezeigt), Serie im Protokoll mit derselben Kennung
  (Gegenprobe schlägt an), Mix-Meldung trägt ihre Fehler selbst; Musterrunden der Anleitungsbilder im neuen Format.
- Entscheide OA1 a, OA2 a (Aufsichten im Abgleich). Befund: In beiden Apps brachte eine selbst gebaute Datei mit
  bekanntem Wiederherstellungscode eine Aufsicht ohne Bestätigung aufs Gerät — im Eulenpfad über Datei und Ordner, im
  Lernsteig wäre es mit dem Ordner gekommen. Kern 1.21.0: Eine gesperrte Aufsicht schaltet ihr Code nur auf einem Gerät
  ohne Aufsicht mit PIN frei, sonst bestätigt eine Aufsicht des Geräts (`KERN.person.codeReicht`); die Anmeldung beider
  Apps zeigt dann kein Codefeld und sagt in einem Satz, warum. AS1 a aufgehoben: Im Lernsteig reisen Aufsichten in Datei
  und Abgleich immer mit und kommen gesperrt an.
- Lernsteig: Abgleich über einen Ordner in der Verwaltung (Plan C5; `lernsteig/gemeinsam/abgleich.js` über
  `KERN.abgleich`, `lernsteig-sync-`, IndexedDB `lernsteig`), selbsttätig auf der Startseite, ohne Ordner-Fähigkeit über
  eine Datei; Änderungshaken `LST.beiAenderung` (auch für Konten); Startseite zeichnet nach einem Abgleich neu.
- Tests: Kern (weitere Aufsicht aus einer Datei: Code reicht nicht, auf einem leeren Gerät schon), Konten (Aufsicht aus
  einer Datei ohne angemeldete Aufsicht gesperrt übernommen, Code reicht nicht neben einer anderen Aufsicht, Abgleich
  zwischen zwei Geräten), Eulenpfad (Mama neben Papa nur mit Bestätigung); Gegenprobe ohne die neue Prüfung schlägt in
  allen drei an. Im Browser: Abschnitt „Abgleich zwischen Geräten“ und Freischalten ohne Codefeld.
- Doku: docs/kern/rahmen.md 4.7, 4.19, 4.20; lernsteig/rahmen.md 5b, 5c, 6; rahmen.md 10; Plan (OA1 a, OA2 a, C5),
  Kern-Changelog.
- Lernsteig, Meldung Patrik (Grafiken passen nicht ins Bild): Graphen ohne eigene Höhe wurden im gleichen Massstab auf
  beiden Achsen gezeichnet — in `kraefte` (Weg gegen Zeit) bis 2900 px hoch, in `prozent-funktionen` 440–910 px (gemessen
  über 2000 Aufgaben je Stufe). Jetzt höchstens quadratisch, mindestens halb so hoch wie breit (`LST.graphHoehe`), dazu
  höchstens die halbe Fensterhöhe; Koordinaten und Geraden mit gleichen Spannen bleiben, wie sie waren. Seitentest meldet
  Grafiken höher als breit (Gegenprobe mit der alten Rechnung: 30 Funde). Im Browser auf 375 px: Graph 310 × 310 px, die
  ganze Aufgabe mit „Prüfen“ im Fenster. lernsteig/rahmen.md 4.
- Lernsteig, Meldung Patrik (rationale-zahlen Stufe g ohne Rechner zum Teil zu schwer), Entscheide RZ1 a, RZ2 a: Brüche
  als Dezimalzahl nur mit den Nennern des Lehrplans (2, 4, 5, 8, 10, 20, 50, 100, 1000; 3 und 6 folgen mit periodischen
  Dezimalzahlen), Dezimal-Multiplikationen mit höchstens 5 Wertziffern in beiden Faktoren zusammen. Der Wortlaut auf
  sg.lehrplan.ch nennt eine feste Nennerliste; unsere Fassung in `mathematik_zyklus3.md` hatte „Nenner bis 1000“
  (berichtigt). Gemessen über 20 000 Aufgaben: schwere Aufgaben je Runde zu 8 von 1,3 auf 0,4, Runden mit drei und mehr
  schweren von 13 % auf 1 %; Stufe g mit 1855 verschiedenen Aufgaben. Prüfer in `pruefeAufgabe` (Gegenprobe am alten
  Generator: 1438 bzw. 2113 Funde in 20 000 Aufgaben). Plan (RZ1 a, RZ2 a).
- Lernsteig, Meldung Patrik zu 847 · 81 (Entscheid RZ3 a): Multiplikationen in rationale-zahlen g über die ganze Spanne
  bis zur Grenze — Faktoren zusammen gleich oft 3, 4 oder 5 Wertziffern. Gemessen über 20 000 Aufgaben: ganzzahlig mit
  mehr als 4 Einmaleins-Schritten von 73 % auf 12 %, dezimal von 40 % auf 14 %; dezimale Ergebnisse mit drei
  Nachkommastellen von 5 % auf 27 % (kleine Faktoren wie 0.47 · 0.8 = 0.376, zwei Einmaleins-Schritte, übt die
  Kommaregel). Stufe g mit 1830 verschiedenen Aufgaben. Plan (RZ3 a).
- Voller Eulenpfad-Lauf auf dem Stand nach `141cc53`: „Keine Fehler.“ (169 Spiele × 6 Stufen, 1178 s; Hinweise bekannter
  Arten: gekürzte Runden in kleinen Stufen, „Hinweis verrät“ in kulturen-koffer s3, „Einzahl?“ in quader-volumen s6,
  Grundwörter in Spielnamen).
- Notizblock für eigene Rechenwege im Lernsteig (Wunsch Patrik, Entscheide NB1 a–NB4 a): Kern 1.22.0 mit `kern/notizblock.js`
  (`KERN.notizblock`) aus dem Eulenpfad; dort `SCHRIFTLICH` als Hülle, Verhalten gleich (Stichprobe mit sechs Spielen, 36
  Stufen mit gleichen Klickzahlen wie im vollen Lauf). Neu in beiden Apps: Mal mit Komma in beiden Zahlen — ohne Komma
  gerechnet, darunter die Kommaregel, Platz für die Null vor dem Komma (NB3 a). Lernsteig: Knopf bei jeder Zahl-Antwort
  (NB2 a), `vorgehen.notiz` im Eintrag je Aufgabe, sachliches Aussehen ohne Stellenfarben (NB4 a). Tests: Kern (rechne gegen
  3000 Nachrechnungen, zahlAus, Kommaregel), Seitentest des Lernsteigs (0.47 × 0.8 mit Kommaregel und Weiterrechnen mit
  0.376; Vorgehen je Aufgabe in allen Übungen). Im Browser: Block am Desktop rechts, auf 375 px unten.
  docs/kern/rahmen.md 4.23 (neu), 4.24; rahmen.md 21; lernsteig/rahmen.md 5a0 (neu); Plan (NB1–NB4 a); Kern-Changelog.
- Abschluss: Report `docs/eulenpfad/report/LERN_Session19_2026-11-07.md`, Handover Eulenpfad (Haltepunkt aufgelöst, LERN-60 auf
  Kern 1.22.0) und Lernsteig.

## 2026-11-07 — LERN_Session20
- Kern 1.23.0 (Meldung Patrik: im Lernsteig hatte nur der Notizblock Tasten, die Aufgabe nicht; Gleichungen sollen sich im
  Block auflösen lassen; Entscheide TF1 a, GL1 a im Plan): `kern/tastenfeld.js` (`KERN.tastenfeld`) — Tasten, die in ein
  gewähltes Feld schreiben, ohne ihm den Fokus zu nehmen, aus dem Ziffernfeld des Notizblocks; der Notizblock benutzt es
  mit denselben Tasten. Neu im Notizblock die Vorlage „= Gleichung“: Zeilen „Gleichung | Umformung“, oben die Gleichung der
  Aufgabe (bei einem System beide), „＋ Zeile“ schreibt die letzte ab, Zeichen der Gleichung im Tastenfeld, nichts
  bewertet; die App wählt die Vorlagen.
- Lernsteig: unter jeder Zahl- und Term-Antwort ein Tastenfeld (Zahl: Ziffern, Komma, ⌫, ±, Prüfen; Term: dazu die Zeichen
  der Aufgabe und + − ·, ersetzt die Zeichenzeile und den Knopf ±), Tastatur des Geräts zu; Vorlagen je Übung im Katalog
  (`notizblock: […]`), „= Gleichung“ zuerst in `gleichungen` und `binome-gleichungen`; Aufgaben tragen `gleichung`
  (`pruefeAufgabe` prüft, dass sie zur Aufgabe passt; Gegenprobe ohne sie schlägt an).
- Eulenpfad: unverändert (Kern-Kopie 1.23.0; Stichprobe schriftlich-werkstatt, rechenprobe, malkreuz, zahlenhaus,
  preis-tabelle, quader-volumen mit denselben Klickzahlen wie mit Kern 1.22.0, 36 Stufen).
- Tests: Kern „5612 Fälle, 0 Fehler.“ (Einfügeregel, Vorlagen, Lösung zum Weiterrechnen), Lernsteig „0 Fehler, 0 Hinweise.“
  (Tastenfeld je Aufgabe, Antwort nur mit Tasten getippt und geprüft, Gleichung im Block mit Umformung, ＋ Zeile und
  Weiterrechnen), Konten 83 Fälle, Gratwanderung „Keine Fehler.“ Im Browser: gleichungen j am Desktop und auf 375 px.
  docs/kern/rahmen.md 4.23, 4.24 (neu), 4.25; lernsteig/rahmen.md 4, 5a0; Plan (TF1 a, GL1 a); Kern-Changelog.
- Lernsteig, Meldung Patrik (Screenshot „Schreibe als Potenz: b · b · b · b · b“ ohne Taste b): Seit die Tastatur des
  Geräts zu bleibt, fehlten in `terme` Tasten für die Lösung — die Variable bei „Schreibe als Potenz“ (die Übung gab nur
  ^ ² ³ mit) und „/“ bei „Fasse zusammen“ mit Brüchen; über 8000 Aufgaben 1144 nicht tippbar. `LST.antwortTasten` nimmt
  jetzt die Variablen, „/“ und „²“ aus dem Term der Aufgabe dazu; `tools/pruefe_uebungen.js` prüft für jede erzeugte
  Term-Aufgabe, dass jedes Zeichen der Lösung eine Taste hat (Gegenprobe mit der alten Wahl: 1144 Funde, neu 0; übrige
  Term-Übungen nie betroffen), der Seitentest dasselbe in der Seite. lernsteig/rahmen.md 4.
- Lernsteig, Plan C5: Verwaltung mit Untertabs wie im Eulenpfad (`#verwaltung/<teil>`: Konten, Freigabe, Abgleich,
  Einstellungen, Entwicklung; `aufsicht.html?konto=<id>` führt zu `#statistik/<id>`). Neu der Untertab **Freigabe je
  Gerät** über `KERN.freigabe`: je Fach eine zuklappbare Gruppe mit Prüfstand und Schalter je Übung und Inhaltsliste,
  „↺ wie Prüfstand“, alles freigeben, sperren, wie Prüfstand; auf dem Handy Übung oben, Prüfstand und Schalter darunter.
  Die Freigabe reist im Abgleich mit, die jüngste gewinnt (wie im Eulenpfad). Tests: Konten 88 Fälle, 0 Fehler (Freigabe
  in der Abgleich-Datei, jüngere übernommen, ältere nicht), Lernsteig „0 Fehler, 0 Hinweise.“ (Untertabs, Freigabe mit
  dem echten Prüfstand bis zum Verweis beim Jugendlichen); im Browser am Desktop und auf 375 px. lernsteig/rahmen.md 5b,
  5d, 5e, 6, 7, 8; Plan C5.
- Kern 1.24.0, Entscheide KE1 a, KE2 a (Plan C5 Rest): `KERN.person.ausgeblendet` — Personen auf diesem Gerät nicht
  zeigen, ohne sie zu löschen (Liste nur auf dem Gerät, die Person reist im Abgleich weiter). Lernsteig: Der Jugendliche
  löscht sein Konto im Profil (Vorname, PIN), die Aufsicht ein verbundenes Konto nach Rückfrage, beide mit Löschvermerk
  und „Zuerst sichern“; ein nicht verbundenes Konto und eine gesperrte Aufsicht blendet die Aufsicht auf diesem Gerät aus
  (Anmeldung, Personen-Knopf, Anfragen), „Wieder zeigen“ in der Verwaltung, dort auch die anderen Aufsichten. Eulenpfad:
  bei einer gesperrten Aufsicht „🙈 auf diesem Gerät ausblenden“ statt „🗑 löschen“ (ein Löschvermerk nahm sie im Abgleich
  auch auf ihrem eigenen Gerät mit), Rolle „Aufsicht (🔒 von einem anderen Gerät)“. Beim Prüfen im Browser gefunden und
  behoben: nach dem Ausblenden stand die Person noch im Personen-Knopf (die Verwaltung zeichnete nur ihren Inhalt neu);
  der Seitentest prüft das jetzt (Gegenprobe schlägt an). Tests: Kern 5619 Fälle 0 Fehler, Konten 101 Fälle 0 Fehler,
  Lernsteig „0 Fehler, 0 Hinweise.“, Gratwanderung „Keine Fehler.“, Eulenpfad Daten „Keine Fehler.“ (gesperrte Mama
  ausblenden, Papa nicht; Gegenprobe schlägt an), Eulenpfad-Stichprobe (schriftlich-werkstatt, rechenprobe, malkreuz,
  zahlenhaus, preis-tabelle, quader-volumen) mit denselben Klickzahlen wie mit Kern 1.23.0; im Browser beide Apps.
  docs/kern/rahmen.md 4.7, lernsteig/rahmen.md 5c, 5d, 6, 7, 8, eulenpfad/rahmen.md (Abgleich), Plan (KE1 a, KE2 a, C5),
  Kern-Changelog.
- Plan B2 Schritt 3, Annahme von Antworten: Die Prüfung einer Zahl- oder Term-Antwort steht als `LST.antwortPruefen` in
  `werkzeug.js` (die Seite benutzt sie, Verhalten gleich); `tools/pruefe_uebungen.js` prüft damit je Stufe 300 Aufgaben —
  gleichwertige Schreibweisen angenommen, knapp falsche abgewiesen, kaputte Eingaben ohne Absturz (Gegenprobe mit
  gelockerter Rundungsgrenze: 32 Stufen schlagen an). Fund und Kern 1.25.0 (ZL1 a): Apostroph und Leerzeichen galten
  beim Lesen von Zahlen und Termen überall als Gliederung („1'''“ = 1, „12'34“ = 1234); jetzt nur in Dreiergruppen vor
  dem Komma, sonst unlesbar mit dem Hinweis „Den Apostroph nur zwischen Dreiergruppen, zum Beispiel 12'340.“ (kein
  Fehlversuch). Bestandsaufnahme Plan B: von den Kern-Teilen fehlt nur die Gruppenleitung (mit LERN-48), Zeile B
  nachgeführt. Tests: Kern 5658 Fälle 0 Fehler, Konten 101 Fälle 0 Fehler, Lernsteig „0 Fehler, 0 Hinweise.“,
  Gratwanderung „Keine Fehler.“, Eulenpfad-Stichprobe (6 Spiele, 36 Stufen) mit denselben Klickzahlen wie mit Kern
  1.24.0 (der Eulenpfad liest keine Zahlen über den Kern). docs/kern/rahmen.md (zahl, terme), lernsteig/rahmen.md 7,
  Plan (B, B2, ZL1 a), Kern-Changelog.
- Plan B2 Schritt 3, Text gegen Prüfdaten (Entscheid TD1 a), erste Übung `flaechen-volumen`: `liesText` liest je Typ
  (18 Typen) die Werte aus dem angezeigten Satz (`LST.zahlenImText`, neu in `werkzeug.js`; Durchmesser → Radius, Basis →
  halbe Basis); `pruefeAufgabe` vergleicht sie mit den Daten und rechnet die Lösung ein zweites Mal aus dem Gelesenen.
  Kein Fund. Gegenprobe: Durchmesser gleich dem Radius gesetzt → 384 Aufgaben gemeldet, Schenkel um 1 verschoben → jede
  Aufgabe des Typs. `tools/pruefe_uebungen.js` verlangt `liesText` für die fertigen Übungen und nennt die offenen.
  Messung vorab: bei 60 von 128 Typen der zehn Übungen zeigt der Text andere Grössen als die Daten — ein Vergleich ohne
  Typ trägt nicht. Tests: Lernsteig „0 Fehler, 0 Hinweise.“, Konten 101 Fälle 0 Fehler. lernsteig/rahmen.md 4, Plan
  (TD1 a, B, B2).
- Text gegen Prüfdaten (TD1 a), zweite Übung `koerper-winkel`: `liesText` für alle 18 Typen (Winkelsumme aus der Figur,
  Ähnlichkeitsfaktor aus den beiden Längen zurückgerechnet), `pruefeAufgabe` vergleicht auch Listen (Winkel). Kein Fund.
  Gegenprobe mit vertauschter Rolle (im zweiten Dreieck b statt a gezeigt): gemeldet. Tests: Lernsteig „0 Fehler,
  0 Hinweise.“, Konten 101 Fälle 0 Fehler. Plan (B, B2).
- Text gegen Prüfdaten (TD1 a), dritte Übung `prozent-funktionen`: `liesText` für alle 15 Typen liest Satz und
  Darstellung — beim Graphen die gezeichnete Gerade, bei der Tabelle die Zeilen (Steigung, y bei x = 0), Gleichungen
  „y = −0.5x + 3“ mit eigenem Leser, Kartenzahl aus Personen mal Karten. Die Nachrechnung ist `sollAus(typ, werte)`
  (exakt mit Brüchen) für Daten und Gelesenes. Kein Fund. Gegenprobe (Graph mit umgekehrter Steigung gezeichnet):
  gemeldet. Tests: Lernsteig „0 Fehler, 0 Hinweise.“, Konten 101 Fälle 0 Fehler. Plan (B, B2).
- Text gegen Prüfdaten (TD1 a), vierte Übung `daten-rabatt`: `liesText` für alle 11 Typen — Wertelisten mit 1 bis
  12 Zahlen, Richtung der Währungsumrechnung aus der Frage (der Betrag in fremder Währung aus Franken durch Kurs), Urne
  mit und ohne grüne Kugeln, beim fehlenden Wert passt die genannte Anzahl zur Liste. Nachrechnung als `sollAus`, Vergleich
  auch von Listen und Texten. `LST.zahlenImText`: „~“ nimmt auch „$“ an. Kein Fund. Gegenprobe (ein Wert im Mittelwert-
  Text weggelassen): gemeldet. Tests: Lernsteig „0 Fehler, 0 Hinweise.“, Konten 101 Fälle 0 Fehler. Plan (B, B2).
- Text gegen Prüfdaten (TD1 a), fünfte Übung `folgen`: Gezeigt werden Glieder oder eine Tabelle, nicht die Regel —
  `liesText` (alle 12 Typen) liest die Zahlen und leitet die Regel selbst ab (gleicher Abstand, Quadratzahl plus c,
  n · n); folgen sie keiner Regel des Typs, meldet die Prüfung das. Beim Term zur Figurenfolge wird die Tabelle mit den
  Daten verglichen (die Lösung prüfte schon gegen die Tabelle). `LST.zahlenImText`: „#*“ für eine Zahlenliste;
  `daten-rabatt` benutzt es statt eines eigenen Listen-Lesers. Kein Fund. Gegenprobe (viertes Glied bricht die Regel):
  gemeldet. Tests: Lernsteig „0 Fehler, 0 Hinweise.“, Konten 101 Fälle 0 Fehler. Plan (B, B2).
- Text gegen Prüfdaten (TD1 a), sechste Übung `sachsituationen`: `liesText` für alle 7 Typen — Sätze, beim Weg-Zeit-
  Diagramm die gezeichnete Gerade, bei der Tabelle Zuwachs und y bei x = 0, bei den Auswahlaufgaben auch die vier
  Antworten („y = 3x − 2“). Die Prüfung bestimmt aus dem Gezeigten, welche Antwort passt, und vergleicht mit der
  markierten; Nachrechnung als `sollAus`. Kein Fund. Gegenprobe (Tabelle um 1 verschoben): gemeldet, mit der Antwort,
  die dann passen würde. Tests: Lernsteig „0 Fehler, 0 Hinweise.“, Konten 101 Fälle 0 Fehler. Plan (B, B2).
- Text gegen Prüfdaten (TD1 a), siebte Übung `zehnerpotenzen`: `liesText` für alle 9 Typen — Hochzahlen („10⁻⁸“) vor
  dem Lesen zu „^-8“, Zahlwörter über das schon vorhandene `liesWort`, der gefragte Exponent aus Zahl und Mantisse
  (muss ganz sein), die ausgeschriebene Zahl aus Mantisse und Exponent. Die Prüfung der Werte steht in `pruefeMit(a, d)`
  und läuft mit den Daten und mit dem Gelesenen. Kein Fund. Gegenprobe (Exponent im Text um 1 zu gross): gemeldet.
  Tests: Lernsteig „0 Fehler, 0 Hinweise.“, Konten 101 Fälle 0 Fehler. Plan (B, B2).
- Text gegen Prüfdaten (TD1 a), achte Übung `binome-gleichungen`: Die Gleichungen las die Prüfung schon (Lösung in die
  gezeigte Gleichung eingesetzt); neu liest `liesText` alle 10 Typen ganz — Potenzen (gleiche Basis verlangt),
  Gleichungen mit Vorzeichen „+ 3“ / „− 3“, Systeme, Bruchgleichungen, dazu die Frage (x oder y, grössere oder kleinere
  Lösung) und beim Binom den Ausdruck; `sollAus` rechnet die gefragte Lösung aus dem Gelesenen. Kein Fund. Gegenprobe
  (das System fragt nach der anderen Variablen): gemeldet — die bisherige Prüfung nahm die Frage aus den Daten und hätte
  es nicht bemerkt. Tests: Lernsteig „0 Fehler, 0 Hinweise.“, Konten 101 Fälle 0 Fehler. Plan (B, B2).
- Text gegen Prüfdaten (TD1 a), neunte Übung `kombinatorik`: Wortlaut je Ereignis im Prüfteil eigens festgehalten
  (`WORTLAUT`); `liesText` (alle 19 Typen) findet ihn im Satz und gibt die Kennung, mit der abgezählt wird, dazu Wurf
  (zwei Münzen, zwei Würfel, Münze und Würfel), Augensumme, Ziffern 1 bis n, Buchstaben mit Beispielwort, Anzahlen
  der Kleider (die Frage nennt so viele Teile, wie aufgezählt sind), n bei Handshakes und Vielecken. Das Nachzählen ist
  `zaehle(a, d)` und läuft mit den Daten und mit dem Gelesenen; die frühere Suche „Ziffern / n im Text“ ersetzt es.
  Kein Fund. Gegenprobe (Ereignis „mindestens einmal Kopf“ als „zweimal Kopf“ gezeigt): gemeldet. Tests: Lernsteig
  „0 Fehler, 0 Hinweise.“, Konten 101 Fälle 0 Fehler. Plan (B, B2).
- Text gegen Prüfdaten (TD1 a), zehnte und letzte Übung `zufall`: Wortlaute im Prüfteil eigens festgehalten — Ereignisse
  bei drei Münzen und drei Würfeln, bei der Urne mit den Farben aus dem Text („zweimal rot“, „zuerst gelb, dann grün“),
  die Sätze zum Ziehen (mit oder ohne Zurücklegen, zwei oder drei Züge), die Mehrfachversuche der Pfade („dreimal
  würfeln“), die erwarteten Ereignisse („eine gerade Zahl“ → jede zweite) und die Sätze zur relativen Häufigkeit;
  `liesText` liest damit alle 11 Typen, Datenreihen auch mit Ziffern in der Bezeichnung („um 7 Uhr“). Die Prüfung der
  Werte ist `pruefeMit(a, d)` und läuft mit den Daten und mit dem Gelesenen. Kein Fund. Gegenprobe („ohne Zurücklegen“
  mit dem Satz für „mit Zurücklegen“ gezeigt): gemeldet. Damit lesen alle zehn Übungen ihren Text; `TEXT_OFFEN` ist
  leer. Tests: Kern, Lernsteig „0 Fehler, 0 Hinweise.“, Konten 101 Fälle 0 Fehler, Gratwanderung „Keine Fehler.“
  lernsteig/rahmen.md 7, Plan (B, B2).
- Plan B2 Schritt 3, Vorrat je Stufe (Entscheid VF1 a): `tools/pruefe_uebungen.js` misst den Vorrat einer Stufe ohne
  Endlos in Runden — Fehler, wenn sie weniger verschiedene Aufgaben hat, als eine Runde lang ist; Hinweis, wenn sich die
  Aufgaben vor der sechsten Runde wiederholen; Ausnahmen nur mit Begründung im Katalog (`vorrat`, neu, vom Testskript
  geprüft und am Ende aufgeführt). Heute 21 Hinweise (kombinatorik, atombau, kraefte, stromkreis — b wiederholt sich
  nach 1.3 Runden — und die vier Sprachübungen), als Liste in Plan E 9; keine Begründung eingetragen. Gegenprobe:
  Rundenlänge über dem Vorrat → Fehler, Begründung im Katalog → statt des Hinweises aufgeführt. Tests: Lernsteig
  „0 Fehler, 21 Hinweise.“, Konten 101 Fälle 0 Fehler. lernsteig/rahmen.md 4, 7; Plan (VF1 a, B, B2, E 9).
- Kern 1.26.0, Plan B2 Schritt 3, Zeitzone: neu `kern/zeit.js` (`KERN.zeit.tag`, `vorTagen`, `tagAnzeige`) — Kalendertage
  in Ortszeit. Bisher bildeten Statistik und Verwaltung des Lernsteigs die Übungstage aus der UTC-Zeit (eine Runde um
  00:30 Uhr zählte zum Vortag, das Wochenziel dagegen in Ortszeit), ebenso die Grenze des Geburtsdatums, „angelegt am“,
  der Dateiname von Sicherungen (Kern) und im Eulenpfad das Datum in Meldungen und Prüfvermerken der Listenprüfung.
  `LST.tagText` benutzt den Kern. `tools/pruefe_kern.js` prüft Zeiten um Mitternacht und über die Sommerzeit und sucht
  im Code aller Apps nach einem Tag aus einer UTC-Zeit (fand beim Bau zwei Stellen, die die erste Suche übersehen hatte).
  Node nimmt hier `TZ` nicht an; die Fälle greifen auf einem Rechner ausserhalb von UTC (Schweiz). Tests: Kern 5671
  Fälle 0 Fehler, Konten 101 Fälle 0 Fehler, Lernsteig „0 Fehler, 21 Hinweise.“, Gratwanderung „Keine Fehler.“,
  Eulenpfad Daten „Keine Fehler.“, Eulenpfad-Stichprobe (6 Spiele, 36 Stufen) mit denselben Klickzahlen wie mit Kern
  1.25.0. docs/kern/rahmen.md 4.25 (neu), 4.26; Kern-Changelog; Plan (B, B2).
- Abschluss: Report `docs/eulenpfad/report/LERN_Session20_2026-11-07.md`, Handover Eulenpfad und Lernsteig nachgeführt.
  Push ohne vollen Eulenpfad-Lauf (Entscheid Patrik, „ohne Volllauf“; Stichproben nach jedem Kern-Schritt gleich).
  Offen: C3, Vorrat der 21 Stufen (E 9).

## 2026-11-07 — LERN_Session21
- Lernsteig — Tab Übungen wie der Tab Spiele (Plan C3 Schritt 1): neu `lernsteig/start/uebungen.js` (aus `start.js`
  gelöst). Favoriten oben, dann je Fach (mit Bereich und Niveau-Wahl) und Thema auf- und zuklappbar, „Alle auf“, „Alle
  zu“, Ansicht Kacheln oder kompakt. Kachel: Symbol (bis zum Entscheid SY1 das Kürzel des Fachs), Titel, Kompetenz,
  „wird geprüft“, Sperrvermerk, je Lehrplan-Stufe der Kompetenzstand als Buchstabe in seiner Farbe, Stern für die
  Favoriten; Antippen öffnet die Übung, gesperrt für Jugendliche ohne Verweis. Favoriten, Zuklappen und Ansicht stehen
  im Konto (`favoriten`, `zu`, `ansicht`), bei Gast und Aufsicht nur im Tab. `tools/lernsteig_seiten.js` prüft Zahl
  der Kacheln, Favorit, Zuklappen und Ansicht im Konto und das Zurücknehmen; Gegenprobe (Stern speichert nicht):
  zwei Fehler gemeldet. lernsteig/rahmen.md 1, 6; Plan C3. Tests: Kern, Lernsteig „0 Fehler, 21 Hinweise.“ (Konten
  101 Fälle), Gratwanderung „Keine Fehler.“; Browser Desktop und 375 px ohne Konsolenfehler, ohne seitliches Rollen.
- Lernsteig — Piktogramme der Übungen (Entscheid SY1 a: eigene einfarbige Strichzeichnungen statt Emoji, weil der
  Lernsteig sachlich aussieht und Emoji je Gerät verschieden und bunt gezeichnet werden): neu
  `lernsteig/gemeinsam/symbole.js` mit 26 Zeichnungen (24 × 24, Strich 1.8, ohne Text; Farbe aus `stil.css`,
  `.piktogramm`), im Katalog je Übung das Feld `symbol` (Pflicht; English grammar und Français : grammaire teilen
  die Sprechblasen). Sechs zuerst als Vorschau, Stil von Patrik bestätigt (SY2 a), dann die übrigen. Die Kachel
  zeigt das Kürzel des Fachs nur noch, wenn ein Piktogramm fehlt. `tools/pruefe_uebungen.js` verlangt je Übung ein
  vorhandenes Piktogramm, `tools/lernsteig_seiten.js` eines auf jeder Kachel; Gegenprobe (unbekanntes Piktogramm
  bei brueche): beide gemeldet. lernsteig/rahmen.md 1, Plan C3. Tests: Kern 5671 Fälle 0 Fehler, Lernsteig
  „0 Fehler, 21 Hinweise.“ (Konten 101 Fälle), Gratwanderung „Keine Fehler.“; Browser Desktop und 375 px ohne
  Konsolenfehler, ohne seitliches Rollen.
- Lernsteig — Tab Übungen, Plan C3 Schritt 2: Suche über `KERN.suche` (Titel mit einem Tippfehler, Kompetenz-Code
  — „MA.1.A“ findet alle darunter —, Fach; Thema und Inhaltslisten mit Grund auf der Kachel), Treffer als eine Liste,
  beste zuerst; einklappbarer Filter (Fach, Themen des Fachs, Nur: Favoriten, Wird geprüft, Mit Serie, für die
  Aufsicht Zu prüfen), zugeklappt mit dem, was gilt; Sortierung nach Fach und Thema (gegliedert), nach Titel, nach
  Stufe (Entscheid SS1 a: Lage der Stufen zum Grundanspruch Zyklus 3, Anschluss zuerst, für alle gleich), je auf-
  oder absteigend; Hinweis,
  wenn nichts passt. Sortierung und Zuklappen des Filters im Konto, die Filterwahl je Browser (`lernsteig:filter`).
  `tools/lernsteig_seiten.js` prüft Suche nach Titel und Thema (mit Grund), Suche ohne Treffer, Filter Fach und Mit
  Serie, Sortierung nach Titel in beiden Richtungen und nach Stufe; `tools/pruef_dom.js` kennt `setSelectionRange`.
  Dazu im Filter die Zeile Niveau (Wunsch Patrik): Real oder Sek für alle Fächer auf einmal; das Niveau bleibt je Fach
  gespeichert und in der Gruppe des Fachs änderbar, sind sie verschieden, sagt der Filter es; geprüft im Seitentest
  (Gegenprobe: nur ein Fach gesetzt → vier Fehler gemeldet).
  Gegenprobe (Richtung der Sortierung wirkungslos): gemeldet. lernsteig/rahmen.md 1, 6; Plan C3. Tests: Kern 0 Fehler,
  Lernsteig „0 Fehler, 21 Hinweise.“ (Konten 101 Fälle), Gratwanderung „Keine Fehler.“, Eulenpfad-Stichprobe
  zahlenhaus „Keine Fehler.“ (für das Ersatz-DOM); Browser Desktop und 375 px ohne Konsolenfehler.
- Eulenpfad — Filter im Tab Spiele wie im Lernsteig (Hinweis Patrik): Kopfzeile und Filterzeilen in einem umrahmten
  Block statt nur der umrahmten Kopfzeile (`eulenpfad/start/start.css`).
- Lernsteig — Tab Übungen, Plan C3 Schritt 3 (damit C3 fertig): Passung nach P1 a (Mittel aus Nähe zur Zielstufe des
  Niveaus, Bedarf aus dem Kompetenzstand und Prüfung; ohne Prüfungsziel und in Fächern ohne hinterlegte Prüfungsstufen
  neutral, weil keine Angabe kein Befund ist) als Faktor auf die Suche, für die ähnlichen Übungen und als Sortierung
  „passt zu dir“ (nicht für die Aufsicht); Wackel-Stufen nach W1 a (`LST.wackelt`: mindestens 5 Aufgaben, unter 70 %
  auf Anhieb in den letzten 10) als Marke am Stufen-Buchstaben und Filter „Nur: Wackelt“; `LST.stufenBedarf` nach der
  Kern-Regel; ähnliche Übungen über „Ähnliche Übungen →“ auf der Seite der Übung (`?aehnlich=<id>`, Liste mit Grund,
  „✕ Alle Übungen“). `tools/lernsteig_seiten.js` prüft die Prüfungsteile der Passung, die Sortierung passt zu dir,
  Wackeln nach 6 Fehlversuchen, kein Wackeln nach 10 auf Anhieb und nach 4 Aufgaben, den Filter Wackelt, die Liste der
  ähnlichen Übungen und den Knopf; Gegenproben (Mindestzahl 4, fehlende Prüfungsangabe als 0): drei Fehler gemeldet.
  lernsteig/rahmen.md 5b, Plan C3. Tests: Kern 0 Fehler, Lernsteig „0 Fehler, 21 Hinweise.“ (Konten 101 Fälle),
  Gratwanderung „Keine Fehler.“; Browser Desktop und 375 px ohne Konsolenfehler.
- Kern 1.27.0 und Lernsteig — Rechner am Bildrand wie der Notizblock (Hinweis Patrik; Entscheid RP1 a): der Rechner
  steht nicht mehr unter dem Tastenfeld, sondern als Fenster `.rechner-fenster` am Platz des Notizblocks (ab 1100 px
  rechts, Tablet quer schmaler rechts, sonst unten), mit ▁ und ✕. Beide teilen den Platz: wird einer gross, wird der
  andere auf seine Kopfzeile verkleinert, nicht geschlossen (Inhalt und Ans bleiben). Dafür im Kern
  `KERN.notizblock({ vorn })`, `verkleinern()`, `istKlein()` (neu, alte Aufrufe unverändert). `tools/lernsteig_seiten.js`
  prüft je Übung mit Rechner: am Bildrand, Notizblock auf → Rechner klein, Rechner zurück → Notizblock klein, Ans
  bleibt, Schliessen; Gegenprobe (Rechner verkleinert den Block nicht): 27 Fehler gemeldet. Docs kern/rahmen.md 4.23,
  lernsteig/rahmen.md 5a, Kern-Changelog. Tests: Kern 5671 Fälle 0 Fehler, Lernsteig „0 Fehler, 21 Hinweise.“
  (Konten 101 Fälle), Gratwanderung „Keine Fehler.“; Eulenpfad-Stichprobe (schriftlich-werkstatt, rechenprobe,
  malkreuz, zahlenhaus, preis-tabelle, quader-volumen) mit denselben Klickzahlen wie mit Kern 1.26.0; Browser
  1024 × 600 (Tablet quer), 1400 × 900 und 375 px ohne Konsolenfehler.
- Lernsteig — Vorrat `stromkreis` b (Plan E 9, VF1 a): statt acht fester Fragen (Wiederholung nach 1,3 Runden) je
  Aufbau mit 1 bis 4 gleichen Lämpchen in Serie oder parallel eine Veränderung (eines dazu, durch ein Kabel ersetzt,
  herausgeschraubt) und die Frage nach der Helligkeit oder der Anzeige des Strommessers, dazu Zweig- gegen
  Batteriestrom: 37 verschiedene Aufgaben, nur Lämpchen und Schaltungsart wie im Lehrplan NT.5.2.b. Die Antworten
  kommen aus einer Tabelle der einfachen Regeln; die Prüfung liest den gezeigten Satz mit eigenen Mustern (`liesB`)
  und rechnet mit dem Schaltungsmodell nach. Gegenproben (eine falsche Regel; ein veränderter Wortlaut): gemeldet.
  Plan E 9 (heute 20 Hinweise). Tests: Kern 0 Fehler, Lernsteig „0 Fehler, 20 Hinweise.“ (Konten 101 Fälle),
  Gratwanderung „Keine Fehler.“. Die neuen Wortlaute sind noch von Patrik zu prüfen (die Übung ist ohnehin gesperrt).
- Lernsteig — Vorrat `kombinatorik` (Plan E 9, VF1 a): f mit drei Münzen, Glücksrad (gleich grosse Felder 1 bis n:
  gerade, ungerade, grösser oder kleiner als k) und Urne (rote und blaue Kugeln), 23 → 236 Aufgaben, f deshalb auch als
  Serie (Katalog `endlos`); Challenge mit Gegenereignis bei drei Münzen, Augensumme höchstens s und Glücksrad zweimal
  (dieselbe Zahl, mindestens einmal die Eins), 26 → 50. Prüfung zählt alle Fälle auf (`ergebnisse` für Rad und Urne)
  und liest die neuen Sätze (TD1 a). Gegenprobe (Urne nennt die andere Farbe; Rad zählt bei „kleiner als“ eins zu viel):
  beides gemeldet. Plan E 9. Tests: Kern 0 Fehler, Lernsteig „0 Fehler, 18 Hinweise.“ (Konten 101 Fälle),
  Gratwanderung „Keine Fehler.“.
- Lernsteig — Vorrat `atombau` (Plan E 9, VF1 a), ohne neue Elemente oder Angaben: a mit der Umkehrfrage „Welches
  dieser Elemente ist ein Metall / Nichtmetall / Edelgas?“ (drei Elemente aus der Liste, genau eines passt), 20 → über
  1000 Aufgaben, a deshalb auch als Serie; Challenge mit „Welches Edelgas hat gleich viele Elektronen wie das Ion?“
  (Helium, Neon, Argon), 28 → 42. Prüfung liest die Sätze und rechnet Art und Elektronenzahl aus der Stellung im PSE.
  Gegenprobe (falscher Treffer; Edelgas verschoben): beides gemeldet. Plan E 9 (heute 16 Hinweise).
- Lernsteig — Vorrat `kraefte` d (Plan E 9, Entscheid KR1 a): Inhaltsliste `maschinen.js` von 11 auf 36 Beispiele, je
  Maschine des Lehrplans (Hebel, schiefe Ebene, Flaschenzug, Ketten-/Zahnradgetriebe) neun; nur eindeutige Fälle, keine
  Wellräder und Keile. Bleibt ungeprüft, bis Patrik sie durchsieht. Gegenprobe (eine Maschine ausserhalb der vier):
  gemeldet; ob ein Beispiel fachlich passt, kann der Test nicht prüfen. Plan E 9. Tests: Kern 0 Fehler, Lernsteig
  „0 Fehler, 15 Hinweise.“ (Konten 101 Fälle), Gratwanderung „Keine Fehler.“.
- Lernsteig — Vorrat `grammatik` (Plan E 9, Entscheid SP1 a: Satzlisten erweitern, Übung für Übung, Deutsch zuerst):
  `grammatik.js` e 20 → 50 (Fälle, auch mit Präposition und Wechselpräposition), f 25 → 48 (Wortarten nach den fünf
  Wortarten, Zeitformen), g 20 → 48 (Aktiv/Passiv, Modus, Subjekt und Objekte); die Challenge mischt alle (146) und
  gibt es deshalb auch als Serie. Liste bleibt ungeprüft. Gegenprobe (Fall ausserhalb der vier; markiertes Wort
  doppelt): gemeldet. Plan E 9. Tests: Kern 0 Fehler, Lernsteig „0 Fehler, 12 Hinweise.“ (Konten 101 Fälle),
  Gratwanderung „Keine Fehler.“.
- Abschluss: Report `docs/eulenpfad/report/LERN_Session21_2026-11-07.md`, Handover Eulenpfad und Lernsteig nachgeführt.
  13 Commits, gepusht bis `1bb6c19`. Offen: E 9 für rechtschreibung, englisch- und franzoesisch-grammatik (SP1 a),
  Prüfen durch Patrik, voller Eulenpfad-Lauf auf seinen Entscheid.

## 2026-11-08 — LERN_Session22
- Lernsteig — Vorrat `rechtschreibung` (Plan E 9, Entscheid SP1 a): `rechtschreibung.js` d 20 → 51 (ie, f/v, e/ä,
  ck/tz, Nomen gross, Komma bei Aufzählungen), e 14 → 49 (Nachsilben, dazu -isch), f 13 → 48 (Verben als Nomen auch
  nach „nach dem“ und „vor dem“, Höflichkeitsform), g 11 → 48 (Adjektive als Nomen, Komma bei Relativsatz, Einschub und
  Infinitivgruppe); die Challenge mischt alle (196) und gibt es deshalb auch als Serie. Prüfung nimmt „dem“ vor der
  Lücke als Artikel. Liste bleibt ungeprüft. Gegenprobe (Verb als Nomen ohne Artikel; Satzvariante mit anderem Wort;
  Gross/klein-Variante mit anderer Schreibung): gemeldet. Plan E 9. Tests: Kern „5671 Fälle, 0 Fehler.“, Lernsteig
  „0 Fehler, 8 Hinweise.“ (Konten 101 Fälle), Gratwanderung „Keine Fehler.“.
- Lernsteig — Vorrat `englisch-grammatik` (Plan E 9, Entscheid SP1 a): `englisch.js` b 11 → 49 (to be, to have,
  Subjektpronomen, Fragewörter), c 14 → 49 (Wortstellung in Frage und Aussage, zwei Objekte, unregelmässige Mehrzahl,
  Präpositionen), d 16 → 54 (Modalverben, Verneinung, Reflexiv-, Demonstrativ- und Possessivpronomen, because/so,
  Zeitformen auch present progressive und simple present); die Challenge mischt alle (152) und gibt es deshalb auch als
  Serie. „The keys are ___ the table“ ohne „at“ (Plan E 8), Ablenker „I play tennis often play.“ → „I tennis often
  play.“ Prüfung: Satzvarianten müssen dieselben Wörter haben (bis auf to, do/does, -s/-es); bisher genügte eine
  ähnliche Länge, das liess ein anderes Wort durch. Liste bleibt ungeprüft. Gegenprobe (Variante mit anderem Verb,
  mit anderem Nomen): gemeldet. Plan E 9. Tests: Kern „5671 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 4 Hinweise.“
  (Konten 101 Fälle), Gratwanderung „Keine Fehler.“.
- Lernsteig — Vorrat `franzoesisch-grammatik` (Plan E 9, Entscheid SP1 a): `franzoesisch.js` b 13 → 51 (être, avoir,
  aller, faire, Verben auf -er, Subjektpronomen, Fragewörter), c 13 → 48 (Wortstellung in Frage und Aussage, zwei
  Objekte, unregelmässige Mehrzahl auch -eu → -eux, Präpositionen bei Ländern und Städten), d 16 → 52 (devoir und
  vouloir, Verneinung, ce/cet/cette/ces, Reflexivverben, Possessiv, Zeitformen auch présent, parce que/donc); die
  Challenge mischt alle (151) und gibt es deshalb auch als Serie. „de moi“, „d'elle“ idiomatisch ersetzt („Ce vélo est
  à moi“, „Ces clés sont à elle“, Plan E 8). Prüfung: Satzvarianten müssen dieselben Wörter haben (bis auf que, à, ne/n'), wie in
  englisch-grammatik. Liste bleibt ungeprüft. Gegenprobe (Variante mit anderem Nomen, mit anderer Verneinung; fehlendes
  geschütztes Leerzeichen): gemeldet. Plan E 8, E 9 (für alle 21 Stufen erledigt). Tests: Kern „5671 Fälle, 0 Fehler.“,
  Lernsteig „0 Fehler, 0 Hinweise.“ (Konten 101 Fälle), Gratwanderung „Keine Fehler.“.
- Lernsteig — `folgen` j mit beschriebenen Figuren (Plan E 9): Neben „Hölzchen je Figur“ mit reiner Tabelle kommt in
  einem Drittel der Aufgaben der Bauplan in Worten: Dreiecke, Quadrate, Fünfecke, Sechsecke aus Hölzchen in einer Reihe,
  eine Doppelreihe Quadrate, Tische mit Stühlen, Kreuz und Winkel aus Plättchen (2n + 1 bis 5n + 2), Tabellenkopf mit
  der passenden Einheit; 53 → 61 verschiedene Aufgaben. Die Prüfung zählt jede Figur unabhängig von a und b nach dem
  Bauplan nach (`ZAEHLUNG`) und verlangt den Bauplan im Text. Gegenprobe (Tische mit 3n + 1): gemeldet. Plan E 9.
  Tests: Kern „5671 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 0 Hinweise.“ (Konten 101 Fälle), Gratwanderung „Keine
  Fehler.“.
- Lernsteig — `zehnerpotenzen` i: Zahlwort für 101, 201 … 901 Millionen (Plan E 9, Entscheid ZW1 a): „einhunderteine
  Million“ statt „einhundertein Millionen“ — „ein“ vor dem weiblichen „Million“ gebeugt, danach Einzahl; der Lösungsweg
  sagt es dazu. Belege (Reichweite: diese drei Quellen, Duden-Grammatik nicht gelesen): Duden „hundertein“ (Beispiele
  „hundertundeinen Wunsch äußern“, „hundertein/(auch:) hunderteins Tage vergingen“, nichts zu Million);
  deutschland-rechner.de „Zahl in Worten“ (nicht amtlich: „endet die Zahl davor auf eins, bleibt es bei der Einzahl:
  einhunderteine Million.“); Amtliches Regelwerk 2024, gedruckt S. 314, nur „tausend[und]ein: ein Märchen aus
  Tausendundeiner Nacht“ (regelt die Schreibung, nicht die Einzahl). Prüfung: Form von Million aus der Zahl selbst
  (eine Million; …eine Million; sonst Millionen). Gegenprobe (alte Form): gemeldet. Plan E 9. Tests: Kern „5671 Fälle,
  0 Fehler.“, Lernsteig „0 Fehler, 0 Hinweise.“ (Konten 101 Fälle), Gratwanderung „Keine Fehler.“.
- Abschluss: Report `docs/eulenpfad/report/LERN_Session22_2026-11-08.md`, Handover Eulenpfad und Lernsteig nachgeführt.
  5 Commits `7b34e24` … `13199a7`, nicht gepusht. Offen: Push, Prüfen durch Patrik, Kern-Teil für Gruppen und Favoriten
  zur Absegnung, Hook-Kandidaten (Testzahlen aus Datei; Commit-Message gegen geänderte Pfade).
- Lernsteig — Durchsicht der sieben Listen aus LERN_Session21 und 22 (Auftrag Patrik: „du kannst die listen
  durchziehen“; vier unabhängige Prüfer, jeder Befund nachgeprüft; ersetzt nicht die Freigabe im Prüfstand):
  - rechtschreibung: „Wir helfen dir“ (Stammregel führt über „half“ zu „hälfen“) → „Zelt“; „Die Übung macht den
    Meister“ → „Am Klavier mache ich jeden Tag eine Übung“; zwei „sie“-Sätze mit Mehrzahl, die auch als Höflichkeitsform
    gehen, in die Einzahl; „Mein Bruder lernt kochen“ → „will heute kochen“; Regel „verb-klein“ war falsch allgemein
    („Schwimmen ist gesund“) und nennt jetzt die Verben davor.
  - grammatik: „gern“ (steigerbar: lieber) → „manchmal“; „Der Richter beschuldigt“ → „Die Nachbarin beschuldigt“.
    Bewusst gelassen: „sehr“ als Partikel (der Ersatz „ziemlich“ wäre auch Adjektiv).
  - englisch-grammatik: Reflexiv-Ablenker, die als Objektpronomen auch richtig sind (her, it, them, him), ersetzt;
    Fragen nur über die Satzmelodie („He plays the guitar?“) als Ablenker durch klar falsche ersetzt; „This is my pen
    here“ → „This pen here is mine“; Regeln zu Fragewörtern (What … like?), Wortstellung, Mehrzahl, Verneinung ergänzt.
  - franzoesisch-grammatik: „parce que elle“ im Lösungsweg (fehlende Elision) → „… son équipe a gagné“; „beaucoup de
    livres“ → „Elle prend toujours le bus“; „Vous voulez un café“ → „… venir avec nous“; „ta professeure de français“;
    Regeln zu ce/cet (stummes h), Wortstellung, vouloir, Possessiv berichtigt.
  - kraefte d: Kurbeln und Winde (Wellräder, gegen KR1 a) durch reine Ketten- und Zahnradbeispiele ersetzt, Kette am
    Flaschenzug durch Seil, Beisszange hebelt statt schneidet, Kran beim Flaschenzug; Lösungsweg mit Begründung je
    Maschine, Hinweis nennt die Kette; Prüfung weist Kurbel, Winde, Keil im Beispiel ab. Bewusst gelassen: Schere als
    Hebel (so in den Lehrmitteln).
  - stromkreis b: alle 37 Antworten im Modell richtig; Einleitung nennt die feste Spannung der Batterie; Strommesser
    „direkt hinter der Batterie eingebaut“, Option „zeigt 0“ statt „kein Strom mehr“; der Vergleich Zweig gegen Batterie
    ohne „zeigt 0“ (eigene Optionen); Lösungswege klarer, bei fünf Lämpchen in Serie mit „es fliesst weiter Strom“.
  - englisch-grammatik, Namen der Zeitformen nach dem Lehrmittel Open World (Entscheid ZF1 a): present simple,
    present continuous, past simple, past continuous, present perfect statt simple present, present progressive,
    simple past, past progressive (24 Optionen und die Regel); die Prüfung lässt nur diese Namen zu. Beleg (Reichweite:
    eine Seite, die Verlagsseite klett.ch/lehrwerke/open_world gab 404): Arbeitsblatt zu Open World auf
    unterrichtsmaterial.ch, Inhaltsangabe „C) Present simple D) Present continuous E) Present simple or present
    continuous F) Past simple“ (Kick-off-Check „Grammatikalische Strukturen der Primarstufe“); „past continuous“ dort
    nicht genannt, nach demselben Muster gebildet.
  Gegenproben (Kurbel im Beispiel; Zweigvergleich mit „zeigt 0“; Zeitform „simple past“): gemeldet. Tests: Kern „5671 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 0 Hinweise.“ (Konten 101 Fälle), Gratwanderung
  „Keine Fehler.“.
- Nachtrag zum Abschluss: Report um „Nachtrag nach dem Abschluss: Durchsicht der Listen“ ergänzt, Handover Eulenpfad
  und Lernsteig nachgeführt. 7 Commits `7b34e24` … `b636a14`, nicht gepusht.

## 2026-11-08 — LERN_Session23
- Kern 1.28.0: `kern/uebersicht.js` (`KERN.uebersicht`, Entscheid KT1 a) — Bausteine einer Übersicht mit Kacheln aus dem
  Tab Spiele des Eulenpfads und dem Tab Übungen des Lernsteigs: Gruppen mit gemerktem Zuklappen (gespeichert nur bei
  einer Änderung), einklappbarer Filter-Block, Suchfeld mit Fokus nach dem Neuzeichnen, „?aehnlich=“, Sortierwahl,
  Favoriten umschalten, Stern. Speichern und Aussehen bleiben bei den Apps, die Datenfelder unverändert; noch von keiner
  App benutzt (Umbau Lernsteig, dann Eulenpfad mit Seitentest des Tabs Spiele). Abschnitt 4.26 in docs/kern/rahmen.md,
  Zeile in docs/gemeinsame_mechaniken.md. Tests in `pruefe_kern.js` mit Ersatz-DOM; Gegenproben (Wächter gegen `toggle`
  ohne Änderung entfernt, Handy offen, kein Fokus): gemeldet. Tests: Kern „5709 Fälle, 0 Fehler.“ (Kopien gleich),
  Lernsteig „0 Fehler, 0 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“; Eulenpfad Stichprobe (schriftlich-werkstatt,
  rechenprobe, malkreuz, zahlenhaus, preis-tabelle, quader-volumen) mit Kern 1.27.0 und 1.28.0: gleiche Ausgabe und
  Klickzahlen, „Keine Fehler.“.
- Lernsteig, Tab Übungen auf `KERN.uebersicht` umgestellt (KT1 a, `lernsteig/start/uebungen.js`, 43 Zeilen weniger):
  Gruppen, Filter-Block, Suchfeld, „?aehnlich=“, Sortierwahl, Favoriten und Stern aus dem Kern; Verhalten und Datenfelder
  gleich, das Zuklappen wird nur noch bei einer Änderung gespeichert. Gegenproben im Seitentest (Zuklappen nicht gemerkt;
  Favorit nicht gemerkt): gemeldet. Browser (Gast): Favorit, Zuklappen über das Neuzeichnen, Richtung der Sortierung,
  Tippen im Suchfeld mit Fokus über jede Neuzeichnung, Filter auf 375 px ohne Wahl zu; keine Konsolenfehler. Tests:
  Lernsteig „0 Fehler, 0 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“).
- Eulenpfad, Tab Spiele auf `KERN.uebersicht` umgestellt (KT1 a, `eulenpfad/start/spiele.js`): Gruppen, Filter-Block,
  Suchfeld, „?aehnlich=“, Sortierwahl, Favoriten und die Form des Sterns aus dem Kern; die Freigabe-Suche in
  `start/verwaltung.js` mit eigenem `KERN.uebersicht.suche()` statt des gemeinsamen `suchFeld`. Zwei Fehler behoben:
  „Alle auf“ / „Alle zu“ standen auch während einer Suche und bei den Ähnlichen da (jetzt nur mit Gruppen), und bei
  einem Suchfeld mit nur Leerzeichen waren alle Gruppen offen und Zuklappen wurde nicht gemerkt. Karten tragen
  `data-spiel`, der Stern `data-favorit`.
- Neuer Seitentest des Tabs Spiele (`tools/eulenpfad_seiten.js`, Teil `tab` von `pruefe_spiele.js`, 33 Prüfschritte):
  Favorit, Zuklappen (auch ohne Änderung), Alle auf/zu, Ansicht, Filter-Block, Sortierung und Richtung, Suche mit Fokus,
  nur Leerzeichen, Ähnliche. Bisher prüfte kein Test den Tab. Gegenproben (beide alten Fehler, Favorit, `filterZu`,
  Tippen schliesst Ähnliche nicht, Richtung): alle gemeldet. Tests: Eulenpfad `suche daten tab` „Keine Fehler.“
  (Spielseiten unverändert, Kern unverändert 1.28.0: keine Stichprobe der Spiele nötig). Browser: Tab Spiele als Kind
  (Tippen mit Fokus, Favorit gold, Zuklappen), Freigabe-Suche als Aufsicht, keine Konsolenfehler.
- Hook-Kandidaten aus LERN_Session22 (Entscheide HK1 a, HK2 a):
  - HK1 a: Die Testskripte (`pruefe_kern.js`, `pruefe_uebungen.js`, `pruefe_konten.js`, `pruefe_spiele.js`, Gratwanderung
    in `pruefe.js`) merken ihre Schlusszeile mit Tag, Zeit und Aufruf in `.temp/pruefung/<skript>.json`
    (`tools/testausgabe.js`; `.temp/` in `.gitignore`). Projektlokaler Stop-Hook `.claude/hooks/testzahlen.py`
    (`.claude/settings.json`): Eine Commit-Message im Chat (Codeblock ab „LERN_Session“) mit Testzahlen („n Fälle, m
    Fehler“, „n Fehler, m Hinweise“, „Keine Fehler“), die in keinem heutigen Lauf stehen, wird abgewiesen, mit den
    gespeicherten Zeilen; Ausnahme `TESTZAHLEN_OK`. Gegenproben mit nachgebauten Transkripten (10 Fälle): falsche
    Hinweiszahl wie in LERN_Session22 und falsche Fallzahl abgewiesen; richtige Zahlen, Text ohne Message, anderer
    Codeblock, Ausnahme, zweiter Stopp, alte Message vor der Nutzernachricht, fehlendes Transkript durchgelassen.
  - HK2 a: git-Hook `tools/git-hooks/commit-msg` (`commit_msg.py`): Ändert ein Commit Übungen oder Spiele, muss die
    Message mindestens eine davon nennen (Id oder Anzeigename, Umlaute ausgeschrieben, Bindestrich auch als
    Leerzeichen); über zehn Ids (Sammel-Commits) ungeprüft; Merge, Revert, fixup!, squash! ungeprüft. Gemessen am
    Verlauf: zuerst 22 von 145 Commits gemeldet (Anzeigenamen, Sammel-Commits), nach dem Namensabgleich und der Grenze
    0 von 145. Gegenprobe: Dateien von `4d1916a` (franzoesisch-grammatik) mit der Message von `20150cc`
    (englisch-grammatik) abgewiesen. `.gitattributes`: der Shell-Hook immer mit LF. Eingeschaltet wird er von Patrik
    (`git config core.hooksPath tools/git-hooks`), noch nicht gesetzt.
  - Steckbrief in CLAUDE.md nachgeführt. Tests: Kern „5709 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 0 Hinweise.“
    (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“, Eulenpfad `tab` „Keine Fehler.“.
- Plan E (NX1 a): Stand der Punkte E 1–E 7 und E 10 im Code nachgelesen (drei Prüfer, Befunde nachgeprüft, E 4 mit
  `KERN.terme.bewerte` nachgerechnet) und je Punkt in `docs/plan_angleich_reihe.md` eingetragen; Übersicht E „in
  Arbeit“. Ergebnis: E 1, E 4, E 5, E 10 teilweise; E 2, E 3, E 6, E 7 offen (E 7: Kran eindeutig, stromkreis d und
  Challenge realistisch). E 1 „Nenner bis 1000“ als überholt vermerkt.
- Abdeckungstabelle (Plan E 1, Entscheid AT1 a): `docs/lernsteig/abdeckung.json` hält je Übung und Lehrplan-Stufe die
  Inhaltsteile des Lehrplans mit genau einer Zuordnung (Aufgabentypen `typ`, andere Übung, bewusst nicht, offen;
  dazu was fehlt). `tools/abdeckung.js` misst die Anteile der Typen (fester Startwert) und erzeugt
  `docs/lernsteig/abdeckung.md`; `pruefe_uebungen.js` meldet Typen ohne Inhaltsteil, zugeordnete Typen, die nicht
  vorkommen, fehlende Stufen und eine veraltete Übersicht als Fehler, offene und teilweise Teile als Hinweis.
  Gemessen: alle 27 Übungen geben `typ` mit (80 Stufen, 281 Typen). Erfasst: `rationale-zahlen` und `brueche`
  (MA.1.A.3 f–i, sinngemäss) — neun Hinweise: Rechteckmodell als Bild, Prüfen des Produkts, Nenner 3 und 6,
  Primfaktoren, Bruchterme mit Variablen, Dezimalzahlen addieren, Rechner in f. Befund: Das Lehrplan-Beispiel
  308 · 52 ist ein Ganzzahl-Produkt — die Forderung von E 1, Ganzzahl-Produkte nur mit Dezimalstellen, ist zu
  klären. Gegenproben (Typ ohne Teil, Typ ohne Aufgaben, zwei Zuordnungen, falscher Verweis, fehlende Stufe,
  Übersicht von Hand geändert): alle gemeldet. Tests: Kern „5709 Fälle, 0 Fehler.“, Lernsteig „0 Fehler,
  9 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Abdeckung aller Übungen erfasst (Plan E 1, AT1 a): die übrigen 25 Übungen in `docs/lernsteig/abdeckung.json`,
  entworfen von drei Prüfern (Mathematik zweimal, NT und Sprachen) nach den Regeln von `tools/abdeckung.js`,
  zusammengeführt mit einem Abgleich jedes Teiltexts gegen `docs/lernsteig/lehrplan/` (zwei Texte mit herausgelöster
  Erweiterung, mit Notiz), Stichproben gelesen (kraefte, grammatik, koordinaten). Stand: 80 Stufen, 186
  Inhaltsteile — 51 abgedeckt, 66 teilweise, 60 offen, 9 in einer anderen Übung, keine Stufe am Wortlaut. Fehlender
  Lehrplan-Text: FS1E.5.D.1.b (Englisch hat dort den GA Z2, Typen über FS2F.5.D.1.b zugeordnet). Die offenen und
  teilweisen Teile stehen als Hinweise im Testlauf. Tests: Kern „5709 Fälle, 0 Fehler.“, Lernsteig „0 Fehler,
  128 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Abdeckung am Wortlaut (Plan E 1): Roh-HTML der 18 übrigen Kompetenzen der Lernsteig-Übungen gesichert
  (`docs/lernsteig/lehrplan/quellen_ma/`, `quellen_sprachen/`, sg.lehrplan.ch am 2026-11-08, Fassung August 2025),
  neuer Leser `tools/lehrplan_wortlaut.js` (Stufen mit Zyklus, GA, OP und Punkten; GA/OP der 14
  Mathematik-Kompetenzen stimmen mit `mathematik_zyklus3.md` überein). `tools/abdeckung.js` prüft bei
  `quelle: wortlaut` jeden Teil auf wörtliches Vorkommen und jeden Punkt der Stufe auf lückenlose Bedeckung
  (Beispiele eingeschlossen). Alle 80 Stufen von drei Prüfern auf den Wortlaut umgeschrieben, zusammengeführt
  und geprüft: 215 Inhaltsteile — 61 abgedeckt, 64 teilweise, 81 offen, 9 in einer anderen Übung (vorher 186
  sinngemäss). Neu sichtbar u. a.: fehlende Handlungen (darstellen, zeichnen, einzeichnen, durchführen),
  Grammatik f/g (Infinitiv und Personalform, Morpheme, Verbenfächer), Beispiele, die die Stufe festlegen.
  FS1E.5.D.1.b steht auf der Seite (gleich wie FS2F.5.D.1.b). Formeln formel1 und formel6d am Bild
  nachgesehen. Gegenproben (Zeichen geändert, Beispiel weggelassen, Teil gekürzt, Marke „Erweiterung“
  entfernt, `aus` auf ungesicherte Stufe): alle gemeldet. Tests: Kern „5709 Fälle, 0 Fehler.“, Lernsteig
  „0 Fehler, 147 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan E 1 am Wortlaut neu gefasst (Entscheide E1-1 a, E1-2 a, E1-3 a): Ganzzahl-Produkte bleiben (Beispiel
  308 · 52 in MA.1.A.3.g), der Schnitt nach Lehrplan-Stufen bleibt, die Erweiterungen von MA.1.A.3 h und i
  werden auf Niveau Sek geübt; Umbau in acht Schritten (Nenner der Liste, Nenner 20/50/100, Umschreiben in alle
  Richtungen, Dezimalzahlen plus/minus, Überprüfen, Rechner, Erweiterungen, Rechteckmodell als Bild), Nenner 3 und
  6 weiter zurückgestellt (RZ1 a). Übung `rationale-zahlen` heisst „Dezimalzahlen und rationale Zahlen“.
- Eulenpfad, Zufalls-Skala (Bemerkung Patrik): Auf der Skala mit fünf Knöpfen liefen „unwahrscheinlich“ und
  „wahrscheinlich“ über den Knopf hinaus (Raster 720 px, Knopf 136 px, Wort 205 bzw. 175 px). Neu: Raster bis
  980 px, Schrift 16–18 px mit der Breite, weiche Trennstellen nur auf den Knöpfen (un-wahr-scheinlich,
  wahr-scheinlich; die automatische Trennung greift in Chromium nicht). Nachgemessen in einer Probeseite mit dem
  Stil der Seite: bei 1024 und 1600 px eine Zeile, bei 768 px zwei Zeilen, bei 375 px wie bisher zwei Knöpfe je
  Reihe, nirgends Überlauf. Tests: Eulenpfad zufalls-skala „Keine Fehler.“, Kern „5709 Fälle, 0 Fehler.“,
  Lernsteig „0 Fehler, 147 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan E 1 Schritte 1–4 (`brueche`, MA.1.A.3 f, g und MA.1.A.1.h): Nenner nur aus der Liste des Lehrplans (2, 3, 4,
  5, 6, 8, 10, 20, 50, 100; vorher dazu 12 und 25), auch beim Kürzen der ungekürzte Bruch und beim Erweitern der
  Zielnenner; die Nenner 20, 50, 100 jetzt bei plus, minus und mal (gemeinsamer Nenner bzw. Produkt der Nenner
  höchstens 100, Annahme). Umschreiben in alle sechs Richtungen (Bruch, Dezimalzahl, Prozentzahl; Nenner der Liste
  und 1'000, ohne 3 und 6 nach RZ1 a), vorher nur Dezimal- oder Prozentzahl → Bruch. Neuer Typ `dezimal-plus-minus`
  in f (bis 5 Wertziffern wie RZ2 a). Die Helfer nach Wertziffern stehen jetzt in `LST` (werkzeug.js), gemeinsam
  mit `rationale-zahlen` (gleiche Aufgaben vorher und nachher: 2000 von 2000 mit Startwert 11). Neue Prüfungen in
  `pruefeAufgabe` (Nenner der Liste, gemeinsamer Nenner, Produkt der Nenner, Zahl-Lösungen exakt nachgerechnet,
  Wertziffern); Gegenproben (10 falsche Aufgaben, eine richtige): wie erwartet. Gemessen über 20 000 Aufgaben je
  Stufe: keine Fehler, f sechs Typen je 16–17 %, die sechs Richtungen je rund 1/6, g `mal` 50 %. Abdeckung: f
  Dezimalzahlen abgedeckt, Umschreiben nur noch ohne 3 und 6, f und g nur noch ohne Rechteckmodell als Bild. Befund:
  `pruefe_uebungen.js` erzeugt nach dem ersten Fehler keine Aufgaben der folgenden Übungen mehr (`if (fehler)
  return;` zählt über alle Übungen), deren Abdeckung meldet dann Folgefehler. Tests: Kern „5709 Fälle, 0 Fehler.“,
  Lernsteig „0 Fehler, 146 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan E 1 Schritt 5 (`rationale-zahlen` g, „… multiplizieren und die Ergebnisse überprüfen“): neuer Typ
  `ueberpruefen` als Auswahl — welches von vier Ergebnissen stimmt; falsch sind das Ergebnis mal 10 und durch 10
  (Überschlag) und eines mit falscher letzter Ziffer; Faktoren wie `mal-dezimal`, Lösungsweg mit Überschlag. Die
  Prüfung rechnet das Produkt exakt nach und verlangt vier verschiedene Ergebnisse mit genau einem richtigen. Über
  20 000 Aufgaben der Stufe g: keine Fehler, fünf Typen je rund 20 %, die richtige Wahl an jeder Stelle gleich oft.
  Abdeckung: der Teil Multiplizieren und Überprüfen ganz abgedeckt. Tests: Kern „5709 Fälle, 0 Fehler.“, Lernsteig
  „0 Fehler, 145 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan E 1 Schritt 6 (E1-4 a, E1-5 a): Eine Aufgabe darf `rechner: "mit"` tragen und überstimmt damit die Vorgabe
  ihrer Stufe (`rechnerFuer` in `lernsteig/gemeinsam/rahmen.js`; die Sperre der Aufsicht gilt weiter; Vertrag in
  docs/lernsteig/rahmen.md 4 und 5a). `brueche` f hat den Typ `rechner` (MA.1.A.3.f „Grundoperationen mit dem Rechner
  ausführen“: 1'000.00–9'999.99 mit 10.00–999.99, mal und geteilt exakt auf zwei Nachkommastellen gerundet); das
  Bruchrechnen der Stufe bleibt ohne Rechner. `pruefe_uebungen.js` prüft das Feld, der Seitentest prüft in Stufen
  „ohne“ jetzt jede Aufgabe der Runde (vorher nur die erste) auf den Rechner-Knopf. Gegenproben: Aufgabe ohne
  `rechner`, falsch gerundet, abgeschnitten statt gerundet — gemeldet; Rahmen ohne Überstimmen — Seitentest meldet
  „kein Rechner-Knopf“. Über 20 000 Aufgaben der Stufe f keine Fehler, sieben Typen je 14–15 % (behoben unterwegs:
  Rechenreste beim Runden grosser Ergebnisse). Plan: E1-4 a, E1-5 a eingetragen, „nur auf Niveau Sek“ aus E1-3 a
  ersetzt. Tests: Kern „5709 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 144 Hinweise.“ (Konten „101 Fälle,
  0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan E 1 Schritt 7 (E1-3 a, E1-5 a), Erweiterungen von MA.1.A.3 h und i in ihrer Stufe für alle Niveaus: Kern
  1.29.0 (`kern/terme.js`): neue Formen `primfaktoren` (nur Primzahlen als Faktoren, mit oder ohne Exponent) und
  `bruchterm` (wie `vereinfacht`, jeder Bruch gekürzt); „/“ nach einem Faktor teilt durch eine Zahl („2a/3“, „11a/12“),
  „a/b“ bleibt unlesbar; 43 neue Kern-Fälle, verteilt an alle Apps (Eulenpfad und Gratwanderung benutzen den
  Term-Leser nicht). `rationale-zahlen` h: Typ `primfaktoren` (Zahlen 12 bis 1'000 aus Primzahlen bis 13, ein
  Viertel der Stufe), `ohneE` nur noch i. `brueche` i: ein Viertel der Aufgaben die Erweiterung — `variablen-bruch`
  (Variable im Zähler, alle vier Operationen) und `belegen` (die Formeln formel6a–6d mit Zahlen), `ohneE` entfällt.
  Offen bleibt: Variablen im Nenner. Gegenproben (11): wie erwartet; je 20 000 Aufgaben von rationale-zahlen h und
  brueche i ohne Fehler. Abdeckung nachgeführt (rationale-zahlen i verweist auf brueche). Tests: Kern „5752 Fälle,
  0 Fehler.“, Lernsteig „0 Fehler, 143 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan E 1 Schritt 8 (E1-6 a), Rechteckmodell: neue Darstellung `rechteck` im Rahmen (`lernsteig/gemeinsam/rahmen.js`,
  SVG; Raster mit gefärbten Spalten, Zeilen oder Feldern, Überlappung in einer dritten Farbe; Stil in `stil.css`,
  Vertrag in docs/lernsteig/rahmen.md 4). In `brueche` zeigt jede Bruch-Aufgabe in f und g ihr Modell: kürzen und
  erweitern als n Spalten zu f Feldern, plus und minus beide Brüche im Raster des gemeinsamen Nenners (wenn möglich
  Spalten und Zeilen), mal als Überlappungsmodell, ganz mal so viele Modelle wie die ganze Zahl. `pruefeAufgabe` rechnet
  die gefärbten Anteile gegen die Lösung nach, der Seitentest zählt die gezeichneten und gefärbten Felder. Gegenproben:
  ein Feld zu viel, Modell fehlt (je Typ) — gemeldet; Rahmen zeichnet ein Feld weniger — Seitentest meldet 42 Stellen.
  Je 20 000 Aufgaben ohne Fehler; im Browser angesehen (Desktop und 375 px: erweitern, plus, mal, ganz mal, kein
  Überlauf). Abdeckung MA.1.A.3: offen nur noch Nenner 3 und 6 (RZ1 a) und Variablen im Nenner. Plan E 1 Stand
  ersetzt. Tests: Kern „5752 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 140 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“),
  Gratwanderung „Keine Fehler.“.
- Abschluss: Report [LERN_Session23](docs/eulenpfad/report/LERN_Session23_2026-11-08.md), Handover Eulenpfad und
  Lernsteig nachgeführt.

## 2026-11-09 — LERN_Session24
- Prüfer-Kandidat aus LERN_Session23: `tools/pruefe_uebungen.js` zählt Mängel im Aufbau je Übung (vorher hielt
  `if (fehler) return` beim ersten Fehler, auch einem aus Kern oder Konten, alle folgenden Übungen an, und ihre
  Abdeckung meldete Folgefehler: in LERN_Session23 81 aus 2). Eine Übung mit Mangel oder mit einem `aufgaben.js`, das
  beim Laden wirft, fällt allein aus („keine Aufgaben erzeugt“, Abdeckung ausgelassen); das Skript läuft weiter.
  `tools/lernsteig_seiten.js` bekommt den ganzen Katalog: Freigabe für alle Übungen, die festen Teile (Notizblock,
  Tastenfeld, Rechner-Sperre) laufen auch in Teilläufen ohne ihre Übungen — vorher meldeten sie dort Fehler und das
  Skript brach bei `terme` ab, ohne Schlusszeile. Gegenproben: Teillauf `kombinatorik` (vorher 2 Fehler und Absturz,
  jetzt 0 Fehler, 12 Runden); falsches Piktogramm in `terme` bzw. `aufgaben.js` von `terme` wirft — je 1 Fehler, `brueche`
  danach voll geprüft. docs/lernsteig/rahmen.md 7 nachgeführt. Tests: Kern „5752 Fälle, 0 Fehler.“, Lernsteig
  „0 Fehler, 140 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan E 2 (E2-1 a), `daten-rabatt` l: Brutto und Netto in beiden belegten Lesarten statt über einen Zuschlag. Neue
  Typen `nettopreis` („Ein Velo kostet brutto … Fr. Es gibt … % Rabatt. Nettopreis =“, ersetzt `rabatt` mit „Neuer
  Preis“), `nettogewicht` und `bruttogewicht` (Tara in %, Gewichte in kg mit höchstens einer Nachkommastelle;
  ersetzen `brutto` und `netto` mit Zuschlag), `rabatt-betrag` bleibt; je rund 25 %. Hinweise: „Der Bruttopreis ist
  100 % …“, „Bruttogewicht = Nettogewicht + Tara“. Beleg der Gewichts-Lesart: Schweizer Skript oriesen.ch Prozent4S,
  S. 19; Lesart des mathbuchs nicht nachgesehen. Stufenbeschreibung „Rabatt, Brutto und Netto (Preis und Gewicht)“.
  Über 20 000 Aufgaben keine Mängel (8795 verschiedene); Gegenproben je Typ (Lösung, Zahl im Text, Prüfdaten): alle 12
  gemeldet. Im Browser angesehen (Desktop, 375 px, Hinweis nach Fehlversuch, kein Überlauf). Abdeckung nachgeführt,
  Plan E 2 Stand ersetzt. Tests: Kern „5752 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 140 Hinweise.“ (Konten „101 Fälle,
  0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan E 3 (E3-1 a, E3-2 a), `ueberschlagen-ordnen`: Der Überschlag kommt aus gerundeten Zahlen wie im Lehrplan
  („23'268 + 4'785 ≈ 28'000“) — Summe und Differenz runden alle Zahlen auf die zweite Stelle der grössten (vorher wurde
  das genaue Ergebnis auf eine Ziffer gerundet, bis 50 % daneben), Produkt, Quotient und zwei Schritte jede Zahl auf eine
  Ziffer (Ergebnis mit höchstens zwei Ziffern). Je Aufgabe ein oder zwei Ablenker aus einer falsch gerundeten Zahl
  (falsche Richtung, eine Stelle zu grob, Komma verschoben), 10–30 % neben dem genauen Wert und mindestens 5 % weiter weg
  als die richtige Antwort, der Rest um Zehnerpotenzen (vorher nur Zehnerpotenzen); der Hinweis nennt die Zahl, die
  anders gerundet wurde. Prozentsatz mit zwei oder drei Sätzen 10–30 % daneben. Neu: Summe und Differenz auch mit
  Zahlen unter 1 und über 1'000 (je ein Drittel), Typ `prozentwert` („45 % von 13'000 sind …“, mehr als / weniger als,
  Schwelle 10–40 % daneben); h je ein Viertel Summe, Differenz, Prozentsatz, Prozentwert. Die Prüfung verlangt statt
  Faktor 1.8 jetzt 10 % Abstand und 5 % Vorsprung der richtigen Antwort, rechnet jeden Ablenker aus seinem Fehler und
  den Überschlag nach der Regel nach. Je 20 000 Aufgaben der Stufen h, i, j und Challenge ohne Mängel (in i Produkt und
  Quotient je 50 %); Gegenproben (29, je Typ: andere Antwort als richtig, Ablenker verschoben, Herkunft falsch, Ablenker
  zu nahe, Überschlag nicht nach der Regel, Schwelle zu nahe, Text verändert): alle gemeldet. Im Browser angesehen
  (375 px: Hinweis nach einem Rundungs-Ablenker, Prozentwert mit zwei Knöpfen, kein Überlauf). Abdeckung: Prozent in h
  abgedeckt, offen bleibt in h und i nur das Aufschreiben des Überschlags. Plan E 3 Stand ersetzt. Tests: Kern „5752
  Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine
  Fehler.“.
- Plan E 4 (E4-1 a), Kern 1.30.0 (`kern/terme.js`, verteilt an alle Apps): Form `potenz` verlangt die Basis der Lösung
  („2^6“ und „64^1“ für 4³, „8^1“ für 2³ sind Formfehler „Schreibe als Potenz mit der Basis 4“; „−2^3“ ist keine Potenz
  von −2); „×“, „⋅“ und Grossbuchstaben werden gelesen („2A“ = 2a); `vereinfacht` und `bruchterm` verlangen je Glied
  höchstens eine Zahl und jede Variable einmal („2a·3“, „a·a“, „aa“, „a²a“ sind Formfehler „Fasse die Faktoren noch
  zusammen“); gemischte Zahlen „1 3/4“ werden gelesen und sind ausser in `frei` ein Formfehler „Schreibe als Bruch ohne
  Ganze“ (kein Fehlversuch), ein Zähler mit genau drei Ziffern bleibt Gliederung (ZL1 a), „1 7/4“ ist unlesbar mit eigener
  Meldung. Betrifft im Lernsteig vor allem `brueche` f, g, i, Challenge und `terme` k (16–26 % der Lösungen unechte
  Brüche). 46 neue Kern-Fälle; Gegenprobe: mit dem Term-Leser 1.29.0 schlagen 29 davon fehl. Alle Lösungen der Übungen
  bestehen ihre Form (`pruefe_uebungen.js`). Eulenpfad (benutzt `KERN.terme` nicht): Stichprobe tab, bruch-werkstatt,
  dezimal-rakete, kiosk-kasse, prozent-bruecke mit Kern-Kopie 1.29.0 und 1.30.0 — gleiche Klickzahlen, „Keine
  Fehler.“; kein voller Lauf. Im Browser angesehen (terme i: Formhinweis zur Basis). docs/kern/rahmen.md 4.17, Kern-
  CHANGELOG, Plan E 4 Stand ersetzt. Tests: Kern „5798 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“ (Konten
  „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan E 5 (E5-1 a), Lernsteig: Stufen nur aus Erweiterung in der Stufenwahl. `lehrplaene.js` bekommt das sechste Feld
  der Marken „Stufen nur aus E“ (`nurE`; MA.1.A.2.i, MA.1.A.4.j, MA.1.B.2.i, MA.3.C.1.i), `marken()` liefert `nurE`.
  `rahmen.js`: eine solche Stufe zeigt „nur Erweiterung · Stufe k geht auch ohne sie“ statt „mit Erweiterung“, ein
  Übergang neben ihr „Aufgaben aus Stufe j (Erweiterung) und k gemischt“; betrifft `terme` j und `ueberschlagen-ordnen` i
  (mitten in der Reihe), Kennungen der Stufen unverändert. `pruefe_uebungen.js` prüft `nurE` gegen den Wortlaut der
  gesicherten Seiten (genau die Stufen, deren Punkte alle mit „Erweiterung:“ beginnen; eine Kompetenz einer Übung ohne
  gesicherte Seite ist ein Fehler); der Seitentest prüft die Texte der Stufenwahl von `terme`. Gegenproben (3): Marke bei
  MA.1.A.4.j entfernt, bei MA.1.A.3.h ergänzt, Rahmen ohne den neuen Text — gemeldet. Im Browser angesehen (375 px,
  terme und ueberschlagen-ordnen). docs/lernsteig/rahmen.md 3, Plan E 5 Stand ersetzt. Tests: Kern „5798 Fälle,
  0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan E 6 (E6-1: Patrik „für die normalen Stufen a, in der Challenge auch Halbmetalle“), `atombau`: Challenge ohne
  Be²⁺ und B³⁺ (kein einfaches Ion: H, Edelgase, Halbmetalle, Hauptgruppe IV, Be); `pse.js` führt Bor und Silicium als
  `halbmetall` und unter `weitere` Germanium, Arsen, Antimon, Tellur (die sechs meistgenannten Halbmetalle; Po, At, Se,
  Bi je nach Einteilung, nicht dabei; Liste weiter ungeprüft). Stufe a (`art`, `welches`) lässt Halbmetalle aus, wie im
  Lehrplan nur Metalle, Nichtmetalle, Edelgase. Neu in der Challenge der Typ `halbmetall` („Ist Germanium (Ge) ein
  Metall, ein Nichtmetall, ein Halbmetall oder ein Edelgas?“, ein Viertel der Challenge); Hinweis zur Lage nennt
  Wasserstoff als Ausnahme. Prüfung meldet Halbmetalle in a und Ionen ohne einfaches Ion. Challenge 42 → 60 verschiedene
  Aufgaben. Je 20 000 Aufgaben der Stufen a, c, d und Challenge ohne Mängel; Gegenproben (6: Ion von Be und B, Si in
  art und welches, Halbmetall als Nichtmetall, Antworten vertauscht): gemeldet. Im Browser angesehen (375 px, Challenge
  mit Hinweis). Abdeckung nachgeführt, Plan E 6 Stand ersetzt. Tests: Kern „5798 Fälle, 0 Fehler.“, Lernsteig „0 Fehler,
  139 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan E 7 (E7-1 a, E7-2 a, E7-3 a), Lernsteig `kraefte`, `stromkreis`: Rahmen zeichnet im Graphen mehrere benannte
  Linien (`linien`, Geraden oder Streckenzüge, Name am Ende; `rahmen.js`, `stil.css`, docs/lernsteig/rahmen.md 4).
  `kraefte` a mit drei neuen Typen im Weg-Zeit-Diagramm: `gleichfoermig` (welche von vier Linien — daneben Pause,
  schneller und langsamer werdend), `schneller` (drei Körper), `darstellen` (Linie zur Geschwindigkeit wählen); je 20 %
  mit den beiden bisherigen Typen. `kraefte` c: Kraftmesser mit Messbereich (Annahme 1, 2, 5, 10, 20, 50 N), Anzeige
  darin, Masse unter 1 kg in Gramm; neue Typen `fm-kraft` und `fm-masse` (Diagramm Gewichtskraft–Masse mit Messpunkten
  bis 5 kg); Gewichtskraft von Alltagsmassen bis 100 kg ohne Kraftmesser. `stromkreis` c: je die Hälfte Schulversuch
  1.5–24 V („Im Versuch …“) und Haushaltgerät am Netz 230 V (`netz-R`, `netz-I`; Glühlampe, Bügeleisen, Toaster, Föhn,
  Wasserkocher, Heizlüfter mit üblichen Strömen, Annahme). Prüfungen rechnen Linien, Messbereich, Diagramm und
  Zusammenhang nach; Seitentest: Rechner-Übernahme beantwortet vorher Auswahl-Aufgaben. Je 20 000 Aufgaben ohne Mängel;
  Gegenproben (14): gemeldet. Im Browser angesehen (375 px, kraefte a mit vier Linien). Abdeckung (Kraftmesser jetzt
  teilweise), Plan E 7 Stand ersetzt. Tests: Kern „5798 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“
  (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan C6 (LK1 a, LK2 a), Prüfansicht der Inhaltslisten im Lernsteig: Kern 1.31.0 mit `kern/listenpruefung.js`
  (`KERN.listenpruefung`, aus dem Eulenpfad; docs/kern/rahmen.md 4.27), verteilt. Eulenpfad: `listenpruefung.js` nur noch
  Anbindung (mit Korrekturen über die Meldungen). **Befund:** Die Prüfansicht des Eulenpfads lud seit LERN_Session20
  (`2d64b4a`) nicht — ein Kommentar verschluckte eine schliessende Klammer; kein Test merkte es, weil die Datei erst beim
  Öffnen lädt. Jetzt lädt `pruefe_spiele.js` jede Prüfdefinition (Gegenprobe mit der alten Datei: „Prüfansicht lädt
  nicht“). Lernsteig: `LST.listenPruefung`, `LST.listenPruefen`, Knöpfe „🔍 Inhalte prüfen“ unter der Stufenwahl
  (Aufsicht, Entwicklung), „🔍 prüfen“ in Verwaltung → Freigabe (`?pruefen=<liste>`), `pruefung.js` für die sieben
  Listen (atombau pse, kraefte maschinen, aussagen, grammatik, rechtschreibung, englisch, franzoesisch; Abschnitte je
  Stufe, Gruppen je Thema oder Regel, aussagen mit Spalte „stimmt“), leeres `gemeinsam/pruefstand-eintraege.json`,
  Stile in `stil.css`; ohne Korrekturvorschläge bis zu den Meldungen (LK2 a, neuer Plan-Punkt C11: Meldungswesen und
  Entwickler-Server einstellbar, Vorgabe Patrik). `pruefe_uebungen.js`: jede eigene Liste hat eine Prüfdefinition, die
  lädt, Schlüssel im Format des Servers, keine doppelten Einträge, geprüfte Liste unverändert (`pruefung.js` gilt nicht
  als Inhaltsliste); Seitentest: Weg zur Prüfansicht für jede eigene Liste. Kern-Fälle (10) zu Schlüssel und
  Fingerabdruck; Fingerabdrücke der fünf Eulenpfad-Listen alt = neu. Gegenproben (3, Lernsteig): falscher
  Fingerabdruck im Prüfstand, doppelter Eintrag, Prüfansicht wirft beim Laden — gemeldet. Im Browser: Lernsteig
  englisch (152 Sätze, 19 Gruppen, Haken lokal, „Ganze Liste geprüft“ gibt auf dem Gerät frei; 375 px) und Eulenpfad
  anlaut-angel (73 Einträge, mit ✏️). Eulenpfad-Stichprobe: anlaut-angel, auge-entdecker „Keine Fehler.“, kein voller
  Lauf. Doku: Kern 4.27, Eulenpfad 17, Lernsteig 5e, Plan C6 und C11. Tests: Kern „5808 Fälle, 0 Fehler.“, Lernsteig
  „0 Fehler, 139 Hinweise.“ (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Voller Eulenpfad-Lauf auf `51686cd`: „Keine Fehler.“ (169 Spiele × 6 Stufen, 1184 s).
- Abschluss: Report [LERN_Session24](docs/eulenpfad/report/LERN_Session24_2026-11-09.md), Handover Eulenpfad und
  Lernsteig nachgeführt.

## 2026-11-09 — LERN_Session25
- Plan E 10 (E10-1 a, E10-2 a), Hinweise im Lernsteig: Wurzel-Hinweis in allen Wurzelaufgaben — `flaechen-volumen`
  hypotenuse, diagonale, gleichschenklig, `koordinaten` abstand-schraeg, `rationale-zahlen` i (Typ `potenz-wurzel`
  geteilt in `potenz` und `wurzel`, je ein Achtel der Stufe; Wurzel-Hinweis mit der Wurzeltaste des Rechners). Erkannt
  werden die zwei typischen Fehler: Wurzel vergessen (Eingabe = Quadrat der Lösung, „Ziehe noch die Wurzel.“; in
  hypotenuse, hypotenuse-gerundet, kathete, diagonale, abstand-schraeg) und Wurzel als Hälfte oder Drittel
  (`rationale-zahlen` wurzel, vor dem Komma-Hinweis: √400 → 200 hat dieselben Ziffern). `folgen` i: Rechteckzahlen
  ohne die Regel „n · (n + 1)“ im Text, dafür die Figuren 1 bis 4 als Rechtecke aus k Reihen zu k + 1 Feldern; Hinweis
  „Zähle bei jedem Rechteck …“; die Prüfung der Übung rechnet die Rechtecke nach. Rahmen: Rechteckmodell mit
  `quadratisch` (Felder 18 px, Grösse nach der Zahl der Felder, Nummer darunter; bei 375 px eine Zeile, 310 px Platz).
  `pruefe_uebungen.js`: Wurzelaufgaben ohne Wurzel-Hinweis, nicht erkannte typische Fehler (falsche Eingabe aus den
  Daten nachgerechnet), Wurzel-Typen, die nie vorkommen, und Zahl-Aufgaben in `folgen` mit Buchstabenterm sind Fehler.
  Gegenproben (3): alter Hinweis zu hypotenuse, Fehlererkennung in koordinaten entfernt, Regel wieder im Text von
  folgen i — gemeldet. Behoben: `tools/abdeckung.js` brach seit LERN_Session24 ab (lud `pruefung.js` ohne
  `LST.listenPruefung`), lädt sie jetzt nicht mehr. Abdeckung (`potenz` und `wurzel`; rechteckzahl ohne Mangel), Doku
  Lernsteig 5 (`hinweis`, Rechteckmodell), Plan E 10. Im Browser angesehen (375 px, folgen i mit Hinweis). Eulenpfad
  nicht berührt, kein Lauf. Tests: Kern „5808 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“ (Konten „101
  Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan C11 entschieden (C11-1 a, C11-2 a, C11-3 a; Plan C11, CLAUDE.md Ausnahme Fehlermeldungen: im Lernsteig leiten
  Jugendliche selbst weiter, Entwickler-Server nur lokal, ein Server im Netz braucht einen eigenen Entscheid — später
  möglich nur verschlüsselt und mit geheimer Kennung). Schritt 1: Kern 1.32.0 mit `kern/meldungen.js`
  (`KERN.meldungen`, docs/kern/rahmen.md 4.28) aus dem Eulenpfad; beim Zusammenführen gewinnt je Kennung der **bessere**
  Stand (Fortschritt des Status, dann Antwort, dann Verlauf, zuletzt Zeit), die Verläufe werden vereinigt — bisher
  gewann der jüngere, und ein Gerät, das später nur bestätigte, überschrieb ein „weitergeleitet“. Weg zur Entwicklung
  austauschbar (`weitergeben`: Server, E-Mail, Text). Eulenpfad: `spiel.js` bindet den Kern an (Namen unter `LS`
  unverändert, neu `LS.meldungWeitergeben`, `LS.meldungenAbfragen`), `start/verwaltung.js` benutzt sie. Alt gegen neu
  (alte `spiel.js` aus dem letzten Commit): Text, Betreff, Lesen aus dem Text, Antworten — 50 Vergleiche gleich;
  Gegenprobe (anderes Wort im Text): 9 gemeldet. Kern-Fälle (41) zu Zusammenführen in beide Richtungen, Text, Wegen.
  Im Browser: Eulenpfad-Startseite ohne Konsolenfehler, Probemeldung über `LS` (danach gelöscht). Eulenpfad-Stichprobe
  tab, anlaut-angel, einmaleins-blitz „Keine Fehler.“, kein voller Lauf. Doku Kern 4.28, Eulenpfad 13,
  `gemeinsame_mechaniken.md`. Tests: Kern „5849 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“ (Konten „101
  Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan C11 Schritt 2, Lernsteig (C11-2 a): „Fehler melden“ in jeder Übung (Jugendliche und Aufsicht, nicht der Gast) mit
  Formular über der Seite (diese Aufgabe oder die davor, Art, Begründung ab drei Wörtern; Zeit ruht), gespeichert mit
  Aufgabe, Lösung, allen Eingaben, Wertung, Klasse, Niveau, Lehrplan (`gemeinsam/rahmen.js`, `LST.MELDUNGEN` über
  `KERN.meldungen`); Senden im Tab Statistik von der Person selbst, oder von einer verbundenen Aufsicht (Statistik des
  Kontos, neu Verwaltung → 🙋 Meldungen), über Entwickler-Server, E-Mail (`lernsteig/kontakt.js`, neu, leer) oder Text,
  ohne Namen; Antworten aus `lernsteig/meldungen-stand.json`; Meldungen in Sicherung und Abgleich (`daten.js`,
  `abgleich.js`). `tools/meldungen_stand.py` je App (ohne Angabe beide; Eulenpfad-Datei bytegleich). Kern 1.32.1: Ein
  gelöschtes Konto nimmt seine Meldungen auch beim Einlesen und im Abgleich mit (vorher brachte eine alte Sicherung sie
  zurück; Gegenprobe: 3 gemeldet), Eulenpfad mit `entferne` ebenso; beim Zusammenführen bleibt der Stand der besseren
  Fassung (sonst zählte eine schwächere, jüngere als geändert — gefunden von `pruefe_konten.js`). Tests: Kern-Fälle (4),
  Konten (5: Sichern, besserer Stand, Löschen, alte Sicherung), Seitentest „Fehler melden“ (Formular, Pflichtangaben,
  Felder, Statistik, Senden als Text, kein Name im Text); Gegenproben (2: Name im Text, Knopf fehlt) gemeldet. Im Browser
  (375 px): Knopf, Formular, Speichern, Statistik; Testkonto danach entfernt. Eulenpfad-Stichprobe tab, anlaut-angel,
  einmaleins-blitz „Keine Fehler.“, kein voller Lauf. Doku Lernsteig 5f und 6, Kern 4.28, Eulenpfad 13, Plan C11,
  `gemeinsame_mechaniken.md`. Tests: Kern „5853 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“ (Konten „106
  Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan C11 Schritt 3 (C11-3 a), Kern 1.33.0: Weg der Meldungen und Adresse des Entwickler-Servers je Gerät — in beiden
  Apps unter Verwaltung → Einstellungen → „Meldungen an die Entwicklung“ (Weg automatisch, nur Server, nur E-Mail, nur
  Text; Adresse nur `localhost`/`127.0.0.1` mit Port, leer = diese Seite; „Verbindung prüfen“), Vorgabe in
  `<app>/kontakt.js` (neu Feld `server`). `KERN.entwicklung` mit `adresse()` und `adresseGueltig`, `KERN.meldungen` mit
  `meldeweg`/`setzeMeldeweg`, `weitergeben` folgt dem Weg und begründet, wenn er nicht geht. `tools/entwickler_server.py`
  antwortet mit CORS nur für erlaubte Herkunft (lokal jeder Port, die veröffentlichte Seite, `--herkunft`), samt
  Vorabfrage und `Access-Control-Allow-Private-Network`; er hört weiter nur auf 127.0.0.1. Kern-Fälle (14);
  Gegenprobe (Adressprüfung ab): 3 gemeldet. Im Browser mit zwei Servern (App auf 8767, Entwickler-Server auf 8766):
  Status lesbar, POST-Vorabfrage durch (403 mit falschem Schlüssel, nichts geschrieben), Netzadresse abgewiesen;
  Lernsteig-Verwaltung (375 px, Texte gekürzt) und Eulenpfad-Verwaltung (Feld auf volle Breite) bedient; fremde
  Herkunft per curl: Vorabfrage 403, ohne Freigabe. Nicht nachgewiesen: Zugriff der veröffentlichten Seite auf localhost
  (erst nach einem Push). Testkonten und Einstellungen im Browser danach entfernt. Eulenpfad-Stichprobe tab,
  anlaut-angel, einmaleins-blitz „Keine Fehler.“, kein voller Lauf. Doku Kern 4.12 und 4.28, Eulenpfad 11, Lernsteig 5f
  und 6, Plan C11. Tests: Kern „5867 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“ (Konten „106 Fälle,
  0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan C11 Schritt 4 (LK2 a), Lernsteig: Korrekturvorschläge der Aufsicht (✏️) in der Prüfansicht der Inhaltslisten —
  `LST.KORREKTUR` speichert eine Anregung der Art „korrektur“ mit Übung, Liste, Eintrag und Schlüssel; Verwaltung →
  🙋 Meldungen zeigt sie unter „Korrekturen an Inhaltslisten“ und sendet sie wie eine Meldung (Text ohne Namen).
  **Behoben:** Der Link „🔍 prüfen“ aus Verwaltung → Freigabe (`?pruefen=<liste>`) öffnete die Prüfansicht seit
  LERN_Session24 nicht — die Stufenwahl schrieb die Adresse um, bevor `pruefung.js` geladen war; der Wert wird jetzt beim
  Laden gemerkt (gefunden im Browser; der Seitentest prüft nur den Link, der Ersatz-DOM kennt kein `dialog`). Seitentest:
  Korrektur speichern, in der Verwaltung sehen, als Text senden, kein Name im Text; Gegenprobe (falsches Feld): 2
  gemeldet. Im Browser (375 px): Prüfansicht über `?pruefen=pse` mit 30 ✏️, Vorschlag gespeichert, in der Verwaltung zu
  sehen; Testaufsicht danach entfernt. Kern 1.33.1 (nur ein Kommentar). Plan C11 und C6 erledigt bis auf den Nachweis,
  dass die veröffentlichte Seite an localhost melden darf. Eulenpfad-Stichprobe tab, anlaut-angel „Keine Fehler.“, kein
  voller Lauf. Doku Lernsteig 5e, Kern 4.27, Plan C6, C11. Tests: Kern „5867 Fälle, 0 Fehler.“, Lernsteig „0 Fehler,
  139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Prüfer-Kandidat aus LERN_Session24 umgesetzt (PK1 a): `tools/pruefe_skripte.js` liest jede `.js`-Datei und jedes Skript
  in einer Seite unter `eulenpfad/`, `lernsteig/`, `gratwanderung/`, `portal/` und `kern/` ohne Ausführen (`vm.Script`),
  prüft jede `<script src>` auf eine vorhandene Datei und dass kein Skript von aussen kommt (LERN-1); läuft als „skripte“
  mit den kurzen Prüfungen in `tools/pruefe.js` (200 Dateien, 205 Skripte in Seiten, 1652 Verweise, unter 1 s; heute
  keine Funde). Gegenproben in einem Wegwerf-Ordner: Syntaxfehler in Datei und Seite, fehlendes und externes Skript und
  die echte kaputte Prüfansicht aus `2d64b4a` (Zeile 96) — alle 5 gemeldet, Daten-Blöcke und Auskommentiertes nicht.
  Steckbrief (CLAUDE.md, Tests) und Kern 6 nachgeführt. Tests: Skripte „Keine Fehler.“, Kern „5867 Fälle, 0 Fehler.“,
  Lernsteig „0 Fehler, 139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“.
- Plan D, Lernsteig: **D1** Wertung von Zahlen mit einem Rundungsrest relativ zur Lösung (1e-14, bei 0 1e-15) statt
  absolut 1e-9 (`gemeinsam/werkzeug.js`) — bis dahin galt in zehnerpotenzen k „0.000000076“ für 7.62 · 10⁻⁸; ein erster
  Versuch relativ zur Eingabe nahm 999…9 an, einer mit 1e-12 nahm bei 8.54 · 10¹² die letzte Stelle ±1 an — beides fand
  der Test. `pruefe_uebungen.js` prüft „letzte Stelle ±1“ und „ein Millionstel daneben“ jetzt auch bei kleinen Zahlen;
  Gegenprobe (alte Regel): zehnerpotenzen k 101 von 300 Aufgaben gemeldet. **D2** kombinatorik f „Zahl und eine Augenzahl
  von mindestens 5“ bzw. „… höchstens 2“ statt „mindestens eine Fünf“ (mit einem Würfel als genau eine Fünf lesbar).
  **D13** sachsituationen h Weg „y = −3“ statt „-3“; `pruefe_uebungen.js` meldet jedes ASCII-Minus vor einer Zahl
  (Gegenprobe gemeldet). **D7** war seit LERN_Session20 erledigt (Kern `zeit.js`), im Plan nachgetragen. **D11** Befund:
  die geplante „Warnung wie Eulenpfad“ gibt es im Eulenpfad nicht, beide Apps verlieren eine Runde bei vollem Speicher
  still — als Entscheid vorgelegt (danach D11 a, D11-W a; siehe nächster Eintrag). Stolperfalle beim Bau: ein Kommentar am Zeilenende schluckte in sachsituationen die
  Felder kennung und daten (gültiges JavaScript, gefunden vom Übungstest). Tests: Skripte „Keine Fehler.“, Kern
  „5867 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine
  Fehler.“.
- Speicherschicht nach docs/konzept_gruppen.md 5a (entschieden LERN_Session11, nie in den Plan übernommen — jetzt Plan D11
  mit Verweis; D11 a, D11-W a), Schritt 1: Kern 1.34.0 — `KERN.speicher` mit grossen Schlüsseln in IndexedDB
  (Zwischenspeicher, `bereit()`, Umzug bei jedem Start mit Vereinigen, wenn ein Schlüssel in beiden Speichern liegt,
  BroadcastChannel für andere Tabs, `beiFehler`), `belegung()`, `dauerhaftBitten()`; Grenzen nach MDN (localStorage 5 MiB je
  Ursprung, IndexedDB bis rund 60 % der Festplatte) in docs/kern/rahmen.md 4.3. Lernsteig: `runden`, `rekorde`, `meldungen`,
  `geloescht` in IndexedDB `lernsteig-ablage`; Übungen und Startseite warten auf `LST.bereit()`, Abgleich startet danach;
  `daten.js` und `konten.js` über denselben Speicher (vorher je eigene Instanz, `entferne` hätte IndexedDB verfehlt);
  „Nicht gespeichert: Der Speicher dieses Browsers ist voll …“ oben auf der Seite (D11 a); Verwaltung → Einstellungen →
  „Speicher dieses Geräts“ mit Belegung, Warnung ab 80 % und „Browser bitten, nichts von selbst zu löschen“; ohne
  Abgleich-Ordner Erinnerung ans Sichern nach 14 Tagen (ab der letzten Sicherung, sonst ab der ältesten Runde).
  `tools/ersatz_idb.js` (IndexedDB-Ersatz ohne Abhängigkeit) für Kern-Fälle (21: Umzug, Kopie, zweite Seite, Löschen,
  beide Speicher, eigene Regel, voll, kaputt, Belegung) und Seitentest (Umzug, Statistik, neue Runde in IndexedDB).
  Gegenproben: Startseite ohne Warten (Fehler „vor bereit() gelesen“), Umzug ohne Vereinigen (Runde aus altem Tab fehlt) —
  gemeldet. Im Browser (Chromium, echte IndexedDB): Runde in der Ablage, nicht in localStorage, Statistik, Speicheranzeige
  (5185 MB verfügbar), Erinnerung erst nach 14 Tagen; danach Testkonto und Datenbank gelöscht. **Eulenpfad noch nicht
  umgestellt** (nächster Schritt). Doku Kern 4.3, Lernsteig 6, Konzept 5a, Plan D11. Tests: Skripte „Keine Fehler.“, Kern
  „5888 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine
  Fehler.“; Eulenpfad-Stichprobe tab, anlaut-angel „Keine Fehler.“.
- Abschluss: Report [LERN_Session25](docs/eulenpfad/report/LERN_Session25_2026-11-09.md), Handover Eulenpfad (Haltepunkt
  16:42 aufgelöst) und Lernsteig nachgeführt. Befund: Commit `6f52459` enthält C11 Schritt 4, trägt aber die Message von
  Schritt 3. Kein voller Eulenpfad-Lauf in dieser Sitzung (letzter auf `51686cd`).

## 2026-11-09 — LERN_Session26
- Speicherschicht nach docs/konzept_gruppen.md 5a, Schritt 2: **Eulenpfad** (Plan D11 erledigt; D11 a, D11-W a; Kern
  unverändert 1.34.0). `protokoll`, `rekorde`, `meldungen`, `geloescht` in IndexedDB `lernspiele-ablage`, Vereinen beim
  Umzug wie im Lernsteig; `LS.bereit`, `LS.nachBereit`, `LS.beiBereit`: Spielseiten (`LS.spiel`), Startseite und Mix
  zeichnen erst nach dem Laden, Abgleich und Umzug alter Stände laufen danach; ohne IndexedDB lädt `spiel.js` synchron
  wie bisher (Testskripte, Klickzahlen unverändert). Band „Nicht gespeichert: Der Speicher dieses Browsers ist voll …“
  für eine erwachsene Person (`.speicher-voll`, reserviert; bis hier ging die Runde still verloren); Startseite zeichnet
  neu, wenn ein anderer Tab Runden speichert; Verwaltung → Einstellungen → Speicher mit Belegung, Warnung ab 80 % und
  `persist()`; ohne Abgleich-Ordner Erinnerung ans Sichern nach 14 Tagen oben in der Verwaltung (zählt „💾 Alle sichern“
  und „💾 Abgleich-Datei sichern“, nicht ein einzelnes Kind). Seitentest `speicher` in `tools/pruefe_spiele.js`
  (`tools/eulenpfad_seiten.js`, 21 Prüfschritte: ohne IndexedDB, Umzug, neue Runde, Spielseite mit Sternen aus der Ablage,
  Erinnerung und Speicheranzeige, voll, kaputt); `tools/ersatz_idb.js` nimmt `__idbOpt` im Kontext. Gegenproben (3):
  ohne `beiFehler`-Hörer, ohne grosse Schlüssel, Spiel ohne Warten — gemeldet. Im Browser (Chromium, echte IndexedDB):
  Umzug einer Runde und eines Rekords im alten Format, Runde gespielt und in der Ablage, Statistik, Verwaltung mit
  Erinnerung, Speicheranzeige und Band, Mix mit sechs iframes, keine Konsolenfehler. Doku Eulenpfad 8 und 23, Konzept 5a,
  Plan D11. Tests: Skripte „Keine Fehler.“, Kern „5888 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 139 Hinweise.“ (Konten
  „106 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“; Eulenpfad-Stichprobe tab, daten, suche, zahlenhaus,
  einmaleins-blitz, anlaut-angel, hoer-geschichte, kiosk-kasse mit gleichen Klickzahlen wie auf `c119a50`, Teil speicher
  „Keine Fehler.“; kein voller Lauf (letzter auf `51686cd`).
- Abschluss: Report [LERN_Session26](docs/eulenpfad/report/LERN_Session26_2026-11-09.md), Handover Eulenpfad nachgeführt.
  Stolperfalle: Die Vorschau auf `eulenpfad/README.md` öffnete einen Speichern-unter-Dialog (`.md` ohne Typ aus
  `tools/server.py`); zum Verlassen einer Seite künftig nur HTML.

## 2026-11-10 — LERN_Session27
- Eulenpfad, Verwaltung: Die Untertabs (Konten, Freigabe, Abgleich, Einstellungen, Meldungen, Entwicklung) brechen um
  wie im Lernsteig (`eulenpfad/start/start.css`). Seit LERN_Session17 stehen alle `.tabs` einzeilig, die Untertabs aber
  ohne Rollleiste — auf 375 px ragten sie bis 694 px über den Rand und die ganze Seite liess sich seitlich schieben.
  Im Browser auf 375 px angesehen: drei Zeilen, Seite 375 px breit, keine Konsolenfehler; dabei Erinnerung ans Sichern
  und Speicheranzeige (LERN_Session26) auf Handy-Breite gelesen, ohne Befund.
- Voller Eulenpfad-Lauf (169 Spiele × 6 Stufen, 1442 s): „Keine Fehler.“ — erster voller Lauf seit `51686cd`, deckt Kern
  1.32–1.34 und die Speicherschicht ab.
- Nach dem Push (`6055527`), Nachweis C11 auf der veröffentlichten Seite: Sie trägt den neuen Stand (Ablage im Modus
  `idb`, Untertabs mit Umbruch). Der Entwickler-Server beantwortet Vorabfrage und Status für ihre Herkunft richtig
  (CORS, `Access-Control-Allow-Private-Network`); eine Adresse ausser localhost wird abgewiesen. Aus dem Vorschau-Browser
  von Claude kommt die Anfrage nicht an (`ERR_BLOCKED_BY_CLIENT`, Sperre des Browsers selbst) — der Nachweis in einem
  gewöhnlichen Browser ist offen (Plan C11). Testdaten auf der veröffentlichten Seite im Vorschau-Browser entfernt.
- Kern 1.35.0 (`entwicklung.js`, `verbindungPruefen`), Eulenpfad und Lernsteig: „Verbindung prüfen“ unter Verwaltung →
  Einstellungen → Meldungen prüft die Adresse **im Feld** (was „Adresse speichern“ speichern würde) statt der
  gespeicherten und nennt sie in der Meldung („✓ Entwickler-Server erreichbar: http://localhost:8766.“, bei leerem Feld
  „http://localhost:8765 (diese Seite)“), dazu „Die Adresse ist noch nicht gespeichert.“, wenn sie abweicht, und „Prüfe …“
  während der Anfrage; eine nicht erlaubte Adresse wird nicht angefragt. Rückmeldung Patrik: Mit dem Entwickler-Server auf
  8765 war jede Eingabe „erreichbar (diese Seite)“, weil die ungespeicherte Eingabe nicht zählte. 6 neue Kern-Fälle; im
  Browser in beiden Apps angesehen (leer gegen `tools/server.py`: anderer Server; 8766: erreichbar; 8799: nicht erreichbar;
  127.0.1.1: nicht erlaubt), Testkonten danach entfernt. Doku Kern 4.12, Eulenpfad 11, Lernsteig 5f.
- Plan C12 (Meldungsserver im Netz, Versionen, E-Mail-Kontakt; Rückmeldung Patrik): Entscheide NS1 a, NS2 a, NS2-K a,
  NS3 a festgehalten (Plan C12; CLAUDE.md, Ausnahme Fehlermeldungen um den Meldungsserver im Netz erweitert: nur https,
  nur Meldungen und ihr Stand, nur bei gültiger Unterschrift mit dem Schlüssel der Entwicklung); Notiz Patrik zu einem
  künftigen Abgleich-Server für Spieldaten (zweiter Schlüssel der Aufsicht, die ihn betreibt) in
  docs/konzept_gruppen.md 5c. E-Mail-Kontakt patrik.neunteufel@gmail.com in `eulenpfad/kontakt.js` und
  `lernsteig/kontakt.js` (Kommentar und Eulenpfad-Doku 13: die Adresse ist auf der öffentlichen Seite lesbar); Betreff
  wie bisher mit Lernprogramm, Kennung und Thema. Lernsteig-Seitentest: E-Mail-Weg über `mailLink` (Adresse aus
  kontakt.js, Betreff mit „Lernsteig“, Kennung, Übung, kein Name), Text-Weg mit ausdrücklich gewähltem Weg; Gegenprobe
  (Adresse leer): gemeldet.
- Plan C12, NS3 a — Versionen (Kern 1.36.0): `eulenpfad/VERSION` 1.0.0, `lernsteig/VERSION` 0.1.0,
  `gratwanderung/VERSION` 0.1.0; `tools/kern_verteilen.py` erzeugt daraus `<app>/version.js` (`APP_VERSION`) und schreibt
  `KERN.version` ans Ende des Bündels, `--pruefe` vergleicht. Alle 199 Seiten, die den Kern laden (172 Eulenpfad, 27
  Lernsteig), laden `version.js` davor; `tools/pruefe_skripte.js` meldet eine Seite ohne (Gegenprobe gemeldet).
  Protokoll 1 (`KERN.entwicklung.PROTOKOLL`): `/entwicklung/status` nennt Server-Version 1.0.0 und `protokoll: [1, 1]`,
  der Server weist ein anderes Protokoll mit 409 ab und merkt bei Bemerkungen `fassung` und `gesendet_mit`; die App
  nimmt einen Server mit anderem Protokoll nicht an und sagt warum, mit den Versionen beider Seiten. Meldungen merken
  die Fassung, in der sie entstanden: Zeile „Version: Eulenpfad 1.0.0 · Kern 1.36.0“, Betreff „Eulenpfad 1.0.0:
  Fehlermeldung M-… (zahlenhaus, Stufe 3)“. „Verbindung prüfen“ nennt Server-Version und Protokoll. Statistik beider Apps
  mit der Zeile „Eulenpfad 1.0.0 · Kern 1.36.0“. 8 neue Kern-Fälle, Gegenprobe (Protokollprüfung immer „passt“):
  gemeldet. Im Browser mit dem Entwickler-Server angesehen (Status, Verbindung prüfen, Statistik, Meldung und Betreff in
  beiden Apps, kein Name im Betreff), Testkonten danach entfernt; Server direkt: Protokoll 2 abgewiesen. Doku Kern 3,
  4.12, 4.28, Eulenpfad 1, Lernsteig Aufbau, Plan C12.
- Plan C12, IM1 a, IM1-A a — Impressum und Datenschutz: neue Seite `portal/impressum.html` mit Angaben aus
  `portal/impressum.js` (Name, Postadresse — trägt Patrik ein, bis dahin „noch nicht eingetragen“ —, E-Mail, Stand).
  Datenschutz in Klartext: alles bleibt im Browser, die Ausnahmen aus CLAUDE.md (Sichern, Abgleich, Meldungen ohne Namen
  per E-Mail oder Text, Antworten in meldungen-stand.json, Einladung, Abzeichen, Aufsicht im Lernsteig), was die
  Entwicklung erhält und wozu, GitHub Pages protokolliert IP-Adressen (Sitz Niederlande und USA; DSG Art. 19 Abs. 2 und
  4), Rechte; der Meldungsserver als geplant. Wortlaut UWG Art. 3 Abs. 1 Bst. s und DSG Art. 19 auf fedlex gelesen,
  Angaben von GitHub aus docs.github.com. Verlinkt in der Fusszeile des Portals und unter Verwaltung → Einstellungen
  beider Apps; `tools/pruefe_spiele.js` prüft Seite und Links (Gegenprobe ohne Seite: gemeldet). Im Browser auf 375 px
  angesehen (Seite 375 px breit, keine Konsolenfehler, Links in beiden Verwaltungen), Testkonten entfernt.
- Plan C12, IM2 c, ES1 a bis ES5 a: Bemerkungen und Meldungen nicht mehr im öffentlichen Repo — `.gitignore` mit
  `docs/*/bemerkungen.json`, `docs/*/pruefstand-eingang.json`, `.entwicklung/`; `docs/eulenpfad/bemerkungen.json` aus
  dem Index genommen (nur Testbemerkungen von Patrik, im Verlauf bleiben sie). Entscheide zu Schlüssel je Aufsicht
  (HMAC aus Name, E-Mail und Geheimnis des Servers), Speicher beim Server (Name, Hash, keine E-Mail), Abgleich
  Entwicklung ↔ Server (holen, übernehmen, senden; Freigabe nur über pruefstand.js im Repo), Anforderung per E-Mail
  mit Vorlage und Ausweisen (Nachweis der E-Mail-Adresse, kein Ausweis) im Plan C12; CLAUDE.md vermerkt die
  Bemerkungen als nur lokal.
- Plan C12, ES5-S a, SR1 a: Richtlinie [docs/richtlinie_freigaben.md](docs/richtlinie_freigaben.md) für das Übernehmen
  eingereichter Freigaben — Stufe je Person (neu, bewährt, gesperrt), übernahmereif ab zwei verschiedenen Personen,
  davon eine bewährt, ohne offene Meldung; Anzeige und Befehle von `uebernehmen`; Bewertung nur lokal bei der
  Entwicklung; Schwellen nur mit Eintrag und Datum. Die Entwicklung gibt weiterhin selbst direkt frei.
  `docs/eulenpfad/bemerkungen.json` aus dem Index (IM2 c).
- Plan C12, ES1 a, ES2 a, ES4 a, ES5 a — zugelassene Aufsichten (Kern 1.37.0): `tools/entwickler_server.py` mit
  `--zulassen "Vorname Name" person@… [--neu]` (Schlüssel HMAC-SHA-256 aus Name, E-Mail, Zähler und Geheimnis des
  Servers, 20 Zeichen in Gruppen, klein und ohne Bindestriche getippt geht auch), `--sperren`, `--zugelassen`;
  `.entwicklung/geheimnis` und `.entwicklung/zugelassen.json` (Name, Hash, Datum, Zähler, gesperrt — keine E-Mail);
  `/entwicklung/freischalten`; Prüfvermerke einer Aufsicht gehen in `docs/<app>/pruefstand-eingang.json` (einmal je
  offenem Vermerk, unter dem Namen der Zulassung), Status von Bemerkungen setzt nur die Entwicklung. Kern:
  `freischalten` auch über den Server (`true`/`false`/`null`), `rolle()`, Meldung „Eingereicht (Nr. …)“,
  `anforderungLink`. Eulenpfad und Lernsteig (Verwaltung → Entwicklung): „✉️ Entwicklermodus anfordern“ mit Vorlage an
  patrik.neunteufel@gmail.com, Hinweis bei fehlendem Server, Zeile „Freigeschaltet als zugelassene Aufsicht“; im
  Eulenpfad sieht die Aufsicht die Bemerkungen anderer nicht. Neu `tools/pruefe_server.py` (Server im Prozess mit
  leerem Ordner, 22 Fälle) in den kurzen Prüfungen (`node tools/pruefe.js server`), Gegenprobe ohne Eingang: gemeldet;
  6 neue Kern-Fälle. Im Browser mit dem echten Server: Anforderung in beiden Apps, Freischalten als Aufsicht, Vermerk
  eingereicht, pruefstand.js unverändert; Testzulassung, Geheimnis, Eingang und Testkonten danach entfernt. Doku Kern
  4.12, Eulenpfad 11, Lernsteig 5e, Plan C12 (offen: GET /entwicklung/bemerkungen für NS1 schützen).
- Impressum: Postadresse in `portal/impressum.js` (IM1-A a).
- Plan C12, ES3 a, SR1 a — Übernehmen nach der Richtlinie: neu `tools/entwicklung_abgleich.py uebernehmen [app]` zeigt
  den Eingang je Freigabe mit Nummern, einreichenden Personen, Stufe (neu, bewährt, gesperrt) und Zählung, markiert
  „übernahmereif“ (zwei verschiedene Personen, eine bewährt, keine offene Meldung) oder „selbst ansehen“ mit Grund;
  `--reife`, `--annehmen`, `--ablehnen`, `--zuruecknehmen "Name"`; trägt in `pruefstand.js` ein (von: alle Namen), bei
  Listen auch die Haken je Eintrag; Bewertung in `.entwicklung/bewertung.json`. 12 neue Fälle in
  `tools/pruefe_server.py` (jetzt 34), Gegenprobe (Schwelle eine Person): gemeldet. Richtlinie Abschnitt 4 mit den
  Befehlen, Plan C12, Steckbrief (Server in den kurzen Prüfungen).
- Plan C12, NS2 a, NS2-K a — Unterschrift des Servers (Kern 1.38.0): `tools/entwickler_server.py --neues-schluesselpaar`
  erzeugt mit `openssl` ein ECDSA-P-256-Paar (privat `.entwicklung/server-privat.pem`, gitignored) und trägt den
  öffentlichen Schlüssel als `SERVER_SCHLUESSEL` in `kern/entwicklung.js` ein; `/entwicklung/status?zufall=…`
  unterschreibt „lernspiele-entwicklung|<zufall>|<Version>“ (openssl, DER in r‖s gewandelt). openssl wird im PATH und an
  den Orten von Git for Windows gesucht. Kern: Zufallszahl bei jeder Statusabfrage, `unterschriftEcht` mit WebCrypto,
  `echt` in `server()` und `verbindungPruefen`, im Netz nur mit gültiger Unterschrift („weist sich nicht als Server der
  Entwicklung aus“), Text von „Verbindung prüfen“ mit „Unterschrift der Entwicklung geprüft / ohne Unterschrift /
  Unterschrift passt nicht“. `SERVER_SCHLUESSEL` ist noch leer — das Paar erzeugt Patrik für seinen Server. Tests: 11
  neue Fälle in `tools/pruefe_server.py` (45; fünf openssl-Unterschriften bestehen die WebCrypto-Prüfung des Kerns,
  andere Zufallszahl und fremdes Paar nicht), Gegenprobe (r und s vertauscht): gemeldet; 3 neue Kern-Fälle mit echter
  WebCrypto-Unterschrift; im Browser: „…, Protokoll 1, ohne Unterschrift.“, keine Konsolenfehler.
- Plan C12, NS1 a — Meldungsserver im Netz (Kern 1.39.0): `tools/entwickler_server.py <port> --netz [--host …]
  [--zertifikat … --zertifikat-schluessel …]` liefert kein Repo aus, schreibt nur nach `.entwicklung/daten/<app>/`,
  protokolliert keine Anfragen (keine IP-Adressen), nimmt Meldungen von allen ohne Schlüssel an
  (`/entwicklung/meldung`, gültige Kennung, höchstens 20 je Absender und Stunde, ohne Namen), Vermerke nur von
  zugelassenen Aufsichten (Antwort ohne Prüfstand), `/entwicklung/holen` und `/entwicklung/senden` nur mit dem
  Schlüssel der Entwicklung; `GET /entwicklung/bemerkungen` gibt es dort nicht. Werkzeug: `entwicklung_abgleich.py holen
  --server https://…` und `senden` prüfen vorher die Unterschrift mit openssl (nur dann geht entwickler.key hin), legen
  Meldungen nach Kennung und den Rest nach Quelle und Server-Nummer zusammen. Kern: Adressen im Netz nur über https mit
  Namen, `meldung()` ohne Schlüssel, `weitergeben` ohne Entwickler-Modus, Hinweis „Meldungsserver … nicht erreichbar“
  für Adressen im Netz. Apps: Text zur Adresse aus `KERN.entwicklung.ADRESSE_REGEL`, `kontakt.js` beschrieben. Tests: 13
  neue Fälle in `tools/pruefe_server.py` (58), Gegenprobe (Netz ohne Sperre): gemeldet; Kern-Fälle für Adressen im Netz,
  Zwang zur Unterschrift und Meldung ohne Schlüssel; Lernsteig-Test unverändert grün; im Browser: http im Netz
  abgewiesen, https im Netz erreichbar geprüft (`.invalid`, keine fremde Anfrage), keine Konsolenfehler ausser der
  Namensauflösung.
- Plan C12 — Anleitung und Datenschutz zum Meldungsserver: neu
  [docs/anleitung_entwickler_server.md](docs/anleitung_entwickler_server.md) (wer was darf, was wo liegt und was nie ins
  Repo kommt, lokaler Betrieb, zugelassene Aufsichten mit Antwortvorlage, Schlüsselpaar, Meldungsserver im Netz mit Caddy
  und systemd — als nicht geprüft gekennzeichnet —, Abgleich, Aktualisieren, was der Server speichert, Fehlersuche).
  Behoben: Hinter einem Reverse-Proxy kam jede Meldung von 127.0.0.1, die Grenze von 20 je Stunde hätte für alle
  zusammen gegolten — neu `--hinter-proxy` (letzte Angabe von X-Forwarded-For; selbst mitgeschickte zählt nicht), Fall
  in `tools/pruefe_server.py` (59), Gegenprobe (erste Angabe): gemeldet. Datenschutzseite: Abschnitte
  „Meldungsserver der Entwicklung“ (nur https, nur an einen Server mit Unterschrift, ohne Namen, keine IP-Adressen) und
  „Prüfen im Entwicklermodus“ (Name und Prüfwert, keine E-Mail, Zählung nur bei der Entwicklung). Steckbrief verweist
  auf die Anleitung.
- Plan C12 — Inbetriebnahme zum Abhaken: neu
  [docs/anleitung_inbetriebnahme_meldungsserver.md](docs/anleitung_inbetriebnahme_meldungsserver.md) für einen Server zu
  Hause (A Schlüsselpaar und Veröffentlichen am Arbeitsrechner, B Anschluss, DynDNS, feste Adresse, Portfreigabe, C
  Linux-Gerät oder Windows-PC mit Caddy und Dienst, D Prüfen von aussen, E Apps umstellen, F eine Meldung von Anfang bis
  Ende mit holen, senden und Antwort, G Betrieb), als nicht geprüft gekennzeichnet, mit Rückfall auf E-Mail.
- Plan C12 — Anleitung für Erwachsene im Eulenpfad (`eulenpfad/anleitung/aufsicht.html`) nachgeführt: Abschnitt 1 mit
  Meldungsserver und Link auf Impressum und Datenschutz; Statistik mit der Versionszeile; Abschnitt 14 mit dem Weg der
  Meldungen (Meldungsserver, sonst E-Mail mit Programm, Version, Nummer und Spiel im Betreff, sonst Text; wie sie ging,
  steht im Verlauf); Einstellungen mit „Meldungen an die Entwicklung“ (Weg, Adresse, Verbindung prüfen) und „Speicher“
  (Belegung, Warnung, Erinnerung ans Sichern, Sieben-Tage-Regel von Safari); neu Abschnitt 18 „Mithelfen: Spiele prüfen
  (Entwicklermodus)“ (Anfordern, persönlicher Schlüssel, Einreichen, Richtlinie), Häufige Fragen jetzt 19, Fusszeile mit
  Impressum. Im Browser auf 375 px: alle Sprungmarken vorhanden, kein seitliches Überlaufen. Lernsteig und Portal haben
  noch keine Anleitung (Plan H).
- Konzept [docs/konzept_abschluss_animationen.md](docs/konzept_abschluss_animationen.md) (Wunsch Patrik, Entwurf, nicht
  entschieden): Regeln (fachlich treu, 2–4 s und überspringbar, „Bewegung reduzieren“, nie strafend, nichts
  Nachgebautes, ohne Text, offline, Ton nur mit Ton an), Stufe ändert das Ziel und Sterne schmücken aus, acht Muster
  (REISE, ZYKLUS, WACHSEN, BAUEN, ZOOM, AUFTRITT, SAMMELN, KARTE) mit Schnittstelle `feier` im Rahmen, ausgearbeitet
  Rechen-Rakete (Reise bis zum Rand des Sonnensystems), Dezimal-Rakete (Landung auf dem Zahlenstrahl, je Stufe eine
  Stelle genauer, bis Tausendstel wie s6) und Himmels-Forscher (s1–s4 Mondphasen, s5 Planeten wie im Spiel, s6 Eule vor
  dem Vollmond statt einer bekannten Filmszene); Ideen für alle 169 Spiele (von einem Hilfsagenten entworfen, von Hand
  durchgesehen), Liste „Beim Bauen zu prüfen“; Entscheide AN1 bis AN3 vorgelegt.
- Konzept Abschluss-Animationen entschieden (AN1 a, AN2 a, AN3 a): Pilotliste P1–P8, je Muster ein Spiel (Rechen-Rakete,
  Dezimal-Rakete, Himmels-Forscher, Wortfamilien-Baum, Zahlenmauer-Baumeister, Instrumenten-Kenner, Anlaut-Angel,
  Schweiz-Karten-Suche) mit dem, was jedes am Rahmen prüft; AN3-Z a: Ruhezeiten (eine oder mehrere Zeitspannen je
  Wochentag, Ortszeit, global, mit dem Abgleich), in denen die Abschluss-Animation aus ist; Frage Patrik „Ruhezeit auch
  für Töne?“ als AN3-T vorgelegt. Handover: Haltepunkt aufgenommen.
- Konzept Abschluss-Animationen, AN3-T a: Die Ruhezeit gilt auch für den Ton; die 23 Spiele mit der Spielweise „Hören“
  zeigen in der Ruhezeit „🎧 Diese Runde braucht Ton — mit Kopfhörern spielen“ und „Ton für diese Runde an“. Zusatz
  Patrik „differenziert einstellbar“, Lesart zur Bestätigung: je Art (Animation, Klänge, Vorlesen, Hören als Inhalt),
  je Zeitspanne und je Spiel.
- Konzept Abschluss-Animationen: Lesart „differenziert“ bestätigt; AN3-K a — Einstellung je Gerät „🎧 Dieses Gerät wird
  mit Kopfhörern benutzt“ (Ruhezeit gilt dann nicht für Hören als Inhalt; reist nicht mit; Kopfhörer lassen sich nicht
  zuverlässig erkennen); Zusatz Patrik: Spiele, die Ton brauchen, in der Ruhezeit wahlweise ausblenden (auch in Zufall
  und Mix).
- Eulenpfad, Geburtsdatum (Plan B3, Vorgabe Patrik LERN_Session15): Profil mit Datumsfeld wie im Lernsteig statt Monat
  und Jahr (`start/profil.js`), gespeichert `JJJJ-MM-TT` über `KERN.person`; `LS.alterVon` rechnet mit
  `KERN.person.alter`. Profile mit nur dem Monat bleiben gültig: Das Feld ist leer, der Hinweis sagt „bisher nur März
  2017, bitte den Tag nachtragen“, Speichern ohne Tag lässt den Monat stehen. Im Browser angesehen (Monat → Tag
  nachgetragen, Speichern ohne Tag, 375 px, keine Konsolenfehler), Testkonten entfernt. Anleitung für Erwachsene
  (Abschnitt 4), README, rahmen.md 18, Steckbrief (sensible Daten), Plan B3 nachgeführt.
