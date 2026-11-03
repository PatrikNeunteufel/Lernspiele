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
