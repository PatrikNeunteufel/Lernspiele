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
- Eulenpfad, Abschluss-Animationen Schritt 1 (AN1 a, AN2 a, AN3 a): neu `spiele/gemeinsam/feier.js` (`LS_FEIER.zeige`,
  SVG mit SMIL, ohne Bibliothek) mit Muster REISE; Schlussbild zeigt die Animation statt Konfetti, wenn das Spiel `feier`
  angibt und die neue Einstellung „Abschluss-Animation“ (global und je Spiel) an ist; Tippen springt ans Ende,
  „Bewegung reduzieren“ zeigt gleich das Endbild, 2 Sterne Fähnchen, 3 Sterne dazu Funken und die Eule im Fenster.
  Pilot P1 Rechen-Rakete: s1 einmal um die Erde, s2 Mond, s3 Mars, s4 Jupiter (Streifen), s5 Saturn (Ring), s6 an den
  acht Planeten in ihrer Reihenfolge vorbei bis an den Rand des Sonnensystems, die Sonne als heller Punkt. Reservierte
  Klassen `feier`, `ruhig`; Prüfhaken `schluss`; `tools/pruefe_spiele.js` prüft je Spiel mit `feier` Laden, Anzeige, jede
  Stufe, Schmuck je Sternen und „Bewegung reduzieren“ — Gegenproben (Bewegung trotz Reduzieren, kein Fähnchen bei 2
  Sternen): gemeldet. Klickzahlen der Rechen-Rakete ändern sich (Gegenproben: ohne Konfetti verbraucht der Schluss keine
  Zufallszahlen, die Animation ist anklickbar — mit beidem zurückgesetzt wieder gleich); Spiele ohne Animation gleich.
  Im Browser angesehen (alle Stufen mit 1–3 Sternen, laufend und im Endbild; Mars in der Planetenreihe berichtigt,
  Funken im Bild, Ankunft waagrecht), Einstellung in der Verwaltung. Doku rahmen.md 2 und 24, Konzept (Heute berichtigt:
  Konfetti bei jeder Runde; Regel 7 Naturfarben).
- Eulenpfad, Abschluss-Animationen Schritt 2a: `feier.js` mit den Mustern ZOOM, ZYKLUS und SZENE, der Raumsonde als
  zweitem Reisenden und einem anderen Muster je Stufe (`ziele: { s5: { muster, … } }`); Schmuck einheitlich markiert
  (`data-schmuck`), am Himmel funkelnde Sterne und Sternschnuppe; die Bewegung beginnt 0,15 s nach dem Aufbau (Rakete
  ruckelte zu Beginn, Rückmeldung Patrik). Pilot P2 Dezimal-Rakete (ZOOM): gestapelte Zahlenstrahlen, je Stelle eine Lupe
  tiefer, Landung auf 4 · 4.6 · 7.3 · 3.75 · 6.47 · 4.375, Zahlen über `LS.dezimalText`. Pilot P3 Himmels-Forscher: s1–s4
  Mondphasen der Reihe nach (zunehmend rechts hell wie im Spiel), s5 Sonde an den acht Planeten vorbei, s6 Eule vor dem
  Vollmond. Klickzahlen beider Spiele ändern sich (Gegenprobe mit den Spielseiten ohne Animation: wieder die alten Zahlen),
  Rechen-Rakete gleich wie in Schritt 1. Im Browser angesehen (alle Stufen, 1–3 Sterne, Endbild und laufend, Komma,
  keine Konsolenfehler): in Stufe 1 ragte die Rakete aus dem Bild und verdeckte die Landezahl — unterste Zeile nun
  unten, Zahl unter der Linie. Doku rahmen.md 24 (Tabelle der Muster), Konzept (Stand, Status der Piloten, Abweichungen
  von den Ideen).
- Eulenpfad, Abschluss-Animationen Schritt 2b: `feier.js` mit den Mustern WACHSEN (Baum wächst Teil um Teil, Wörter als
  leere Kärtchen, aus den Blüten werden Äpfel, die Eule fliegt mit den Früchten in die Krone) und BAUEN (Zahlenmauer
  Stein um Stein von unten, jeder Stein die Summe der beiden darunter); dazu Bilder am Tag, sitzende Eule, Schmetterling,
  singender Vogel, `bewege` mit Beginn und Dauer. Pilot P4 Wortfamilien-Baum (s1 Stamm … s6 Früchte), Pilot P5
  Zahlenmauer-Baumeister (Form und Zahlenraum wie die Stufe: drei, vier, fünf Reihen). Prüfhaken: `tools/pruefe_spiele.js`
  rechnet in jeder Mauer die Summenregel und die Zahl im Stein nach — Gegenproben (falsche Summe, falsche Zahl):
  gemeldet. Himmels-Forscher nach Rückmeldung Patrik: s1–s4 zieht der Mond im Bogen über den Himmel, Stufe um Stufe
  zunehmend (Neumond mit der Sonne, Sichel, Halbmond, Vollmond) statt der Reihe der Phasen; die Sternschnuppe (Schmuck bei
  3 Sternen) bekommt einen hellen Kopf und einen verblassenden Schweif und steht links oben im freien Himmel. Klickzahlen
  der beiden neuen Piloten ändern sich (Gegenprobe ohne Animation: wieder gleich), die drei ersten Piloten gleich wie in
  2a. Im Browser angesehen (alle Stufen, 1–3 Sterne, Endbild und laufend, keine Konsolenfehler): die Eule flog schon
  los, während der Stamm noch wuchs — berichtigt. Doku rahmen.md 24, Konzept (Status, Abweichungen P3–P5).
- Eulenpfad, Abschluss-Animationen Schritt 2c: `feier.js` mit den Mustern AUFTRITT (Eulen mit Trommel, Querflöte,
  Geige, Trompete, Cello, richtig gehalten; Solo bis Quintett, Orchester mit Streichern), SAMMELN (die Eule angelt Fische
  in den Eimer, aufrecht nebeneinander und zählbar) und KARTE (Flug von West nach Ost über die stumme Karte aus den
  Daten des Spiels, die Ziele leuchten auf). Ton nach Regel 8: `spiel.js` gibt `LS_FEIER.zeige` seinen Ton als `klang`
  mit (beachtet 🔇, `ton` nimmt auch eine Folge), je Auftritt ein Ton des C-Dur-Dreiklangs; ein Tippen ans Ende bricht
  ausstehende Töne ab (im Browser mit einem Zähler geprüft: fünf Töne, nach dem Tippen keine mehr). Piloten P6
  Instrumenten-Kenner, P7 Anlaut-Angel, P8 Schweiz-Karten-Suche (s1 Wahlkreise SG im Ausschnitt bis s6 Kantone und
  Hauptorte). Prüfhaken zählt Mengen (`data-anzahl` gegen `data-stueck`) — Gegenprobe (eine Menge zu viel): gemeldet.
  Klickzahlen der drei neuen Piloten ändern sich (Gegenprobe ohne Animation: wieder gleich), die fünf ersten gleich wie in
  2b; Stichprobe ohne Animation (tab, daten, speicher, zahlenhaus) ohne Fehler. Im Browser angesehen: Musikerinnen
  vergrössert, Querflöte und Trompete gekürzt (berührten die Nachbarin), Fische im Eimer zuerst nicht zählbar —
  aufrecht nebeneinander. Commit-Hook (`tools/git-hooks/commit_msg.py`) schreibt seine Meldung als UTF-8: Visual Studio
  zeigte statt „Der Commit ändert …“ nur „Die Bytes [E4] im Index 31 können nicht … übersetzt werden“ (Python schrieb
  cp1252). Doku rahmen.md 24 (Muster, Ton, Mengen), Konzept (Status, Abweichungen P6–P8).
- Eulenpfad, Ruhezeiten (Schritt 3; AN3-Z a, AN3-T a „differenziert“, AN3-K a, Zusatz Patrik zu den Spielen mit Ton):
  Verwaltung → Einstellungen, Teil „🤫 Ruhezeiten“ — Zeitspannen je Wochentag mit von/bis (Ortszeit des Geräts, bis
  Mitternacht als 00:00), je Zeitspanne wofür (Abschluss-Animation, Klänge, Vorlesen der Eule, Hören als Inhalt), je
  Spiel „wie eingestellt“ / „gilt hier nicht“ / „gilt hier ganz“, und welche Ruhezeit gerade gilt. Neu je Gerät:
  „🎧 Dieses Gerät wird mit Kopfhörern benutzt“ (Hören, auf Wunsch auch Vorlesen ausgenommen) und „Spiele, die Ton
  brauchen, während einer Ruhezeit“ (mit Kopfhörer-Hinweis zeigen / ausblenden). Rahmen (`spiel.js`): `LS.ruhe` und
  Freunde; `ton` schweigt bei den Klängen, das Vorlesen beim Vorlesen, `LS.sprich`, `noten.js` und der Klang-Wichtel
  beim Hören, die Abschluss-Animation wird zum Konfetti. Spiele mit der Spielweise „Hören“ zeigen vor der Runde
  „🎧 Diese Runde braucht Ton“ mit „Ton für diese Runde an“ (bis zum Schluss der Runde); ausgeblendet fehlen sie im Tab
  Spiele mit Hinweis; Zufall und Zufallsmix nehmen sie in der Ruhezeit nie. Die Ruhezeiten reisen mit dem Abgleich
  (Teil `ruhezeiten`, jüngerer Stand gewinnt, fremde Daten nur geprüft), nicht in der Sicherung eines Kindes. Neuer
  Prüfteil `node tools/pruefe_spiele.js ruhe` (Regeln mit fester Uhrzeit, ungültige Zeitspannen, Spiele mit Ton, Klang
  entsteht nicht, Abgleich) — Gegenproben (Klänge ohne Sperre, fremde Zeitspanne ungeprüft, Ende eingeschlossen):
  gemeldet; die zweite fiel zuerst nicht auf (das Lesen filtert noch einmal), der Test prüft jetzt den Speicher.
  Ohne Ruhezeit gleiche Klickzahlen wie vorher (Ton-Spiele hoch-tief-ohr, klang-wichtel, noten-namen, wort-zwillinge
  gegen den letzten Commit; die acht Piloten). Im Browser angesehen: Hinweis vor der Runde im Hoch-Tief-Ohr, Tab Spiele
  mit ausgeblendeten Spielen, Verwaltung auf 768 und 375 px mit allen Bedienungen (Probe-Kind und Probe-Aufsicht danach
  entfernt); „bis 24:00“ stand zuerst leer im Zeitfeld — berichtigt. Doku rahmen.md 25, Konzept (gebaut, eigene
  Entscheide zur Abnahme).
- Eulenpfad, Vorschau der Abschluss-Animationen für die Abnahme der Piloten: Ein Spiel zeigt mit
  `?feier=<stufe>&sterne=1–3[&ruhig=1]` nur sein Schlussbild mit „↻ Nochmal“, ohne Anmeldung und ohne Runde (nichts wird
  gespeichert). Neu `tools/feier_vorschau.html` (nicht veröffentlicht): je Pilot alle sechs Stufen in 1024, 768 oder 375
  px, Sterne und „Bewegung reduzieren“ wählbar. Im Browser alle 48 Bilder geprüft; zuerst fehlten sie in fünf Spielen,
  deren Stufen an freigegebenen Inhaltslisten hängen — die Vorschau nimmt die Stufe jetzt aus der Skala. Abnahmeliste im
  Konzept (Pilotliste). Klickzahlen unverändert.
- Abnahme der Piloten durch Patrik: alle acht geprüft und gut — P1 Rechen-Rakete bis P5 Zahlenmauer-Baumeister („bis P5
  ist alles geprüft und gut“), dann P6 Instrumenten-Kenner, P7 Anlaut-Angel, P8 Schweiz-Karten-Suche („P6–P8 auch
  gut“). Konzept: Status der Pilotliste und Stand nachgeführt; keine Code-Änderung.
- Ausrollen der Abschluss-Animationen, Entscheid AR1 a (Mathe zuerst in Blöcken nach Thema, dann Deutsch, NMG, die
  übrigen Fächer; je Block Commit und Abnahme). Block M1 (Stellenwert, Dezimal), zehn Spiele: Stellen-Detektiv,
  Zahlen-Baukasten, Tabellen-Post, Ziffernkarten, Zahlen-Hüpfer, Zahlenrätsel-Tresor, Punkte-Schieber, Zehntel-Lupe,
  Dezimal-Rutsche, Stufenzahl-Schieber. `feier.js`: Bilder je Spiel (`feier.bilder`) für REISE (stellen, seerosen,
  rutsche, komma), SAMMELN (post, punkte, tresor), BAUEN (baukasten, karten), ZOOM mit Marienkäfer; Stellentafel und
  Dienes-Bausteine in den Stellenfarben aus `stil.css`, nach dem Komma neutral mit Kommalinie wie im Spiel. Jedes Bild
  folgt den Stufen seines Spiels (Abweichungen vom Entwurf im Konzept). Vorschau (`tools/feier_vorschau.html`) liest die
  Spiele mit Animation jetzt aus dem Katalog, nach Fach. Im Browser alle 60 Endbilder rechnerisch geprüft (alles im
  Bild, keine überlappenden Zahlen) und die gezeigten Zahlen gegen die Stufen gelesen: Dezimal-Rutsche s6 mit zwei
  Wagen und doppeltem „≈ 4.5“ übereinander, Funken des Stufenzahl-Schiebers unten aus dem Bild, eine Variable verdeckte
  `boden()` — berichtigt. Klickzahlen der zehn Spiele ändern sich (Gegenprobe ohne Animation: wieder gleich), Piloten
  gleich. Konzept: Entscheid AR1, Blockplan M1–M6 mit Status, Tabelle der Entscheide wieder zusammenhängend (Leerzeile
  vor AN3-K); rahmen.md 24 (Bilder je Spiel).
- Block M1 von Patrik abgenommen („M1 gut“), mit Rückmeldung zum Zahlenrätsel-Tresor: nur der geschlossene Tresor, nie
  offen. Ursache: die Tür schwang mit `animateTransform type="matrix"` — diese Art gibt es nicht, der Browser übergeht
  sie still; nur das ruhige Endbild (geprüft) zeigte die Tür offen. Neu: das Rad dreht, die Tür schwingt an der Angel
  auf (scale), darin je Stufe etwas Wertvolleres (Münze, Münzstapel, Goldbarren, Perlenkette, Krone, grosser Diamant;
  s6 mit der Eule), grösser und mittig; Lichtschein im Tresor. `tools/pruefe_spiele.js` meldet jede `animateTransform`
  mit ungültiger Art — Gegenprobe („matrix“ wieder eingebaut): gemeldet. Im Browser mitten im Lauf nachgemessen (Tür
  104 → 33 → 10 Einheiten breit) und angesehen. Klickzahlen gleich.
- Session-Abschluss LERN_Session27: Report docs/eulenpfad/report/LERN_Session27_2026-11-10.md, Handover (Stand nach
  LERN_Session27, Haltepunkt der Sitzung aufgelöst). Anweisung Patrik als Memory: Animationen laufend durchspielen und
  mit Screenshots zu mehreren Zeitpunkten prüfen, nicht nur das ruhige Endbild. Keine Code-Änderung.
- Rückmeldung zur Gestaltung aufgenommen (Wunsch Patrik, als Schritt nach den Abschluss-Animationen): neu
  docs/eulenpfad/rueckmeldung_gestaltung.md (Eingang, nichts entschieden) — Eindruck „steril“ und „nach KI“, die drei
  Hebel Bildkarten, Kinder-Bühne und Lehrer-Cockpit, Schrift und Knöpfe, und was im Konzept zu klären ist; Handover und
  Report verweisen darauf.

## 2026-11-11 — LERN_Session28
- Bemerkungen 34 und 35 (Meldungen eines Kindes, 4. Klasse): Finger-Zähler Stufe 6 zeigte beim Blitz ein leeres Feld.
  Ursache: die Breite der Hände `min(560px, (100vh - 480px) * 1.88)` wird unter 480 px Bildhöhe null oder negativ —
  Handy quer oder Zufallsmix (iframe ab 460 px). Neu mit Untergrenze `max(240px, …)` für zwei Hände, `max(120px, …)` für
  eine; auf grösseren Bildschirmen unverändert. Im Browser bei 800 × 450 nachgestellt (vorher 0 px, jetzt 240 px, ganz
  im Bild) und während des Blitzes angesehen.
- Bemerkung 33: Diagramm-Wahl, Hilfslinien kaum zu sehen (Randfarbe, 1 px, verkleinert dünner). Jetzt Linien mit Zahl
  kräftig, Zwischenlinien heller, gleich dick auch auf dem Handy (`vector-effect: non-scaling-stroke`); Säulen- und
  Liniendiagramm. Angesehen in 1024 × 768 und 375 px.
- Antworten an das Kind in den drei Bemerkungen, `eulenpfad/meldungen-stand.json` mit `tools/meldungen_stand.py`
  erzeugt.
- Entscheid H1 a (Untergrenze für Grafiken nach der Bildhöhe): Bei 1024 × 460 (Spielfenster des Zufallsmix), 800 × 450
  (Handy quer) und 375 × 460 gemessen, schrumpften in acht weiteren Spielen die Hauptgrafiken auf 0 bis 42 px: Uhr
  (Quelle heure), Kompassrose und Plan, Erdzeit-Leiter, Wassertropfen-Grafik, Plan-Leser, Diagramm-Detektiv, Go-Brett
  (Steine fangen), Roboter-Pfad. Jetzt hat jede Grösse nach der Bildhöhe eine Untergrenze, je Grafik gewählt (Uhr und
  Rose 160 px, Pläne, Bretter und Leiter 200–300 px, wo der Platz schmal sein kann höchstens 100 %): auch in
  Auge-Entdecker, Blutkreislauf-Lotse, König-Falle, Koordinaten-Schatz, Schweiz-Karten-Suche, Spiegel-Raster und im
  Mix-Fenster fürs Handy (`max(460px, …)` wie auf grossen Bildschirmen). Notizblock und Rechner (feste Fenster, Eulenpfad
  und Lernsteig) tragen die Ausnahme „ohne Untergrenze: …“.
- `tools/pruefe_skripte.js` Punkt 5: liest alle Stile (`.css`, `<style>`) aller Apps und weist jede Stelle `100vh - …`
  ohne Untergrenze ab (umschliessendes `max()`, `clamp()` nicht im ersten Glied, `min-width`/`min-height` derselben
  Achse über 0 im Regelblock, oder die Ausnahme mit Grund); elf Gegenproben laufen bei jedem Aufruf mit. Vorher 38
  Stellen gemeldet, jetzt keine.
- `tools/bildhoehe.js`: Geräte `mix` (1024 × 460) und `handy-quer` (800 × 450); je Seite die Grafiken der Aufgabe,
  gemeldet wird eine geschrumpfte: kürzere Seite unter 100 px und Massstab (gezeichnete Breite je Einheit der viewBox)
  unter der Hälfte des kleinsten derselben Klasse bei 1024 × 768, das immer mitgemessen wird; ohne Vergleich unter
  40 px; Code 1. Zwei Vorstufen verworfen: eine feste Schwelle von 100 px traf vor allem Grafiken, die schon gross so
  klein oder flach sind (Nordpfeil, Zahlenstrahl, Thermometer) und die Eule (zählt nicht mehr); der Vergleich der
  kürzeren Seite traf die Notenzeile, deren Höhe von der Zahl der Noten abhängt, und kleine neben grossen
  Braille-Zellen. Gegenprobe: die alte Formel des Finger-Zählers per `--css` → gemeldet.
- Doku: docs/eulenpfad/rahmen.md 20 (Untergrenze, Messen), docs/kern/rahmen.md 6, Steckbrief in CLAUDE.md, tools/pruefe.js.
- Geprüft (H1 a): `tools/bildhoehe.js` über alle 169 Spiele, sechs Stufen, `mix`, `handy-quer` und `quer` (3042 Seiten):
  keine geschrumpfte Grafik, seitlich kein Überlauf. Im Browser angesehen bei 800 × 450 (Uhr, Plan-Leser,
  Wassertropfen) und 1024 × 460 (Go-Brett 300 px, Diagramm-Detektiv 320 × 267). Kompass s2 meldete zuerst die
  Windrose `.rose.klein` (bewusst 96 px); die Messung unterscheidet Grafiken jetzt nach allen Klassen.
- Abschluss-Animationen Block M2 (Zahlen, Teiler, Begründen; AR1 a): Runden-Rutsche, Zahlenstrahl-Pfeil,
  Hundertertafel-Detektiv, Teiler-Spürnase, Überschlags-Radar, Velo-Tabelle, Vergleichs-Krokodil, Punkte-Blitz,
  Muster-Fortsetzer, Preis-Tabelle, Finger-Zähler, Stimmt immer? — `feier.js` mit zwölf Bildern, jedes nach den Stufen
  seines Spiels und mit der Darstellung des Spiels (Kugel der Rutsche, Hände ab dem Daumen, Farben 🔴 🔵 🟡, Dienes in
  den Stellenfarben, Geld über `LS.geldText`). Jedes Bild prüft die Zahlen, die es zeigt (Teiler teilen, Teilerpaare
  vollständig, Preise proportional, Folge und Muster setzen sich fort, Überschlag nach der Regel des Spiels, Winkelsumme
  180°), und gibt sonst kein Bild. „Stimmt immer?“ zeigt je Stufe eine Begründung aus dem Spiel statt eines Mosaiks.
  Rahmen: `bewege` mit `linear` (Hund und Knochen, Velo und Tabelle im Takt), ZOOM mit eigenen Bildern, Rutsche für
  ganze Zahlen (dabei gefunden: 6 500 000 hätte innen schon auf 7 gerundet und den linken Nachbarn verschoben).
  Abweichungen vom Entwurf im Konzept, Abschnitt 7 (zur Abnahme); Doku rahmen.md 24.
- Im Browser alle 72 Endbilder in 375 px angesehen und die bewegten Teile mitten im Ablauf (1,2 und 1,6 s);
  dabei verbessert: Hände grösser, Decke mit Streifen wie im Spiel; Knochen über dem Weg des Hundes (er verdeckte den
  letzten); Hundertertafel mit sichtbaren Feldern im Tausenderbuch und der Lupe für die gesuchte Zahl (s2, s5);
  Krokodil grösser mit weit offenem Maul, Ergebnis der Rechnung in der Karte; Dienes im Punkte-Blitz 1,6-mal grösser
  (die Einer waren nicht zu zählen); Äpfel über dem Korbrand; km-Angaben neben dem Velo frei vom Rad; Steine und
  Halbkreis in „Stimmt immer?“ grösser.
- `tools/feier_vorschau.html`: „Nebeneinander“ (drei Stufen je Zeile) und „Anhalten bei“ einer Sekunde, damit der
  Ablauf Bild um Bild geprüft werden kann, nicht nur das Endbild (Anweisung Patrik, LERN_Session27).
- Abschluss-Animationen Block M3 (Rechnen; AR1 a): Einmaleins-Blitz, Rest-Rätsel, Zehner-Ergänzer, Zahlenhaus,
  Doppel-Spiegel, Zahlen-Waage, Schriftlich-Werkstatt, Malkreuz, Rechentrick-Detektiv, Rechen-Maschine, Zielzahl-Jagd,
  Probe-Stempel, Gerecht-Teiler — `feier.js` mit dreizehn Bildern nach den Stufen der Spiele; Rechnungen als Liste aus
  Zahlen und Zeichen, die jedes Bild nachrechnet (`wertVon`, Punkt vor Strich): Feld und Produkt, Rest kleiner als der
  Teiler, Zerlegungen im Haus, beide Seiten der Waage, Ziffern und Überträge der schriftlichen Rechnung (Minus
  ergänzend wie im Spiel), Teilprodukte im Malkreuz, alle Zeilen eines Tricks gleich, Kette der Maschine ganzzahlig,
  Karten höchstens einmal, Probe passend, Guetzli gleich verteilt. WACHSEN nimmt eigene Bilder (Doppel-Spiegel).
  Abweichungen vom Entwurf im Konzept, Abschnitt 7 (zur Abnahme); Doku rahmen.md 24.
- Im Browser alle 78 Endbilder in 375 px angesehen, dazu den Ablauf (Waage geneigt, Malkreuz halb gefüllt mit „?“,
  wandernde Guetzli); dabei verbessert: Zehnerstangen in s5 des Einmaleins ragten seitlich hinaus; Rest-Rätsel, Malkreuz,
  Schriftlich-Werkstatt, Rechentrick und Guetzli grösser; Rechen-Maschine neu mit Förderband, Startzahl am Eingang und
  lesbarer Weiche; der Pfeil der Zielzahl-Jagd verdeckte die Zielzahl; Punkte im Doppel-Spiegel mittig, Dienes so gross
  wie Platz ist. Beim Bauen gefunden: doppelt eingehängte Karten, ein Stempel, der um die Bildecke statt um seine Mitte
  gewachsen wäre, ein doppeltes Ergebnis am Ausgang der Maschine, eine Breitenprüfung ohne die Verkleinerung (374 im
  Spiegel gab kein Bild).
- Session-Abschluss LERN_Session28: Report docs/eulenpfad/report/LERN_Session28_2026-11-11.md mit der Liste der 43
  Spiele mit Abschluss-Animation (dieselben, die die Vorschau aus dem Katalog zeigt; Katalog und Spielseiten geprüft
  gleich), Handover (Stand nach LERN_Session28). Keine Code-Änderung.

## 2026-11-11 — LERN_Session29
- Abschluss-Animationen Block M4 (Sachrechnen, Grössen; AR1 a): Uhr-Werkstatt, Kiosk-Kasse, Masse-Umwandler,
  Schätz-Waage, Rechengeschichten, Flächenmass-Treppe, Gegenteil-Wippe, Sachaufgaben-Kompass, Fahrplan-Rechner,
  Komma-Messband, Platzhalter-Geschichten, Zeit-Schätzer — `feier.js` mit zehn Bildern nach den Stufen der Spiele (Uhr
  und Stoppuhr, Kasse mit Münzen und Noten wie im Spiel, Einheiten-Treppe mit Auslegen und Lineal, Messband mit Lupen,
  Zug mit Fahrplantafeln, Kompass auf dem Rechenweg, Bilderbuch, Gleichungskarten mit Probe, Schätz-Waage, Wippe und
  Pakete). Jedes Bild rechnet nach, was es zeigt: Uhrzeiten und Zeitspannen (auch über Mitternacht), Rückgeld und
  wenigste Stücke, Umwandlungen über die Einheiten der Spiele, Dezimalstunden, Gleichungen mit Lücke und
  Umkehrrechnung, Rechenwege mit Einheit; Geld nach der Klasse der Stufe (`LS.geldText`). ZYKLUS nimmt eigene Bilder.
  Neu: Bildzeichen (Emoji) wie in den Inhaltslisten der Spiele (Schätz-Waage, Gegenteil-Wippe, Rechengeschichten).
  Abweichungen vom Entwurf im Konzept, Abschnitt 7 (zur Abnahme); Doku rahmen.md 24.
- Im Browser alle 72 Endbilder in Handybreite (rund 390 px) angesehen, den Ablauf mitten drin (Zug unterwegs, Karte
  halb umgedreht, Treppe halb, Geld im Fallen); dabei verbessert: unterste Treppenstufe zu flach („ml“ abgeschnitten),
  gemischte Grössen auf der Treppe als „300 + 25“ statt eines Sprungs 30 → 325 mit „×10“, Wippe stand waagrecht
  (keySplines über 1 verwirft der Browser still), Nähte in der vollen Torte der Stoppuhr, Eierreihen ragten aus der
  Buchseite, Guetzli auf zwei Tellerreihen, Säulendiagramm mit Werten, grössere Schrift im Kompass, Mond vor der
  Fahrplantafel, Lupenzeilen des Messbands enger beschriftet, doppelte Gewichtsangabe an der Waage. Beim Bauen
  gefunden: Transformationen, die eine Bewegung überschrieben hätte (Dinge auf der Wippe, auf Lineal und Waage),
  `animateTransform` mit der Art `matrix` (ungültig), Namenskonflikt `zeitText`, weggeflogene Ballone als Stücke
  gezählt.
- Tests: Skripte „Keine Fehler.“, Kern „5916 Fälle, 0 Fehler.“, Server „59 Fälle, 0 Fehler.“, Lernsteig „0 Fehler,
  139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“; Eulenpfad Stichprobe: die zwölf
  Spiele von M4 „Keine Fehler.“, dazu himmels-forscher, rechen-rakete, dezimal-rakete (ZYKLUS, REISE, ZOOM) „Keine
  Fehler.“ — letzter voller Lauf weiter auf `6055527`.
- Prüfung Lage und Schrift der Abschluss-Animationen (Prüfer-Kandidat aus LERN_Session28): `tools/feier_geometrie.js`
  rechnet am ruhigen Endbild mit 3 Sternen ohne Layout aus den Attributen nach, ob ein Text unter 9 Einheiten der
  viewBox liegt oder ein Teil mehr als 1,5 Einheiten über den Rand ragt (Transformationen, Kurven über Punkte auf der
  Kurve, Bögen über ihren Mittelpunkt, Textbreite geschätzt); `tools/pruefe_spiele.js` ruft sie für jedes Spiel mit
  Animation und prüft sie mit vierzehn Gegenproben. Die erste Fassung meldete 114 Stellen, im Browser mit `getBBox`
  nachgemessen waren zwei echt: die Krone der Stoppuhr (Zeit-Schätzer s1–s4, 2 Einheiten über dem oberen Rand) und
  „≈ 7 000 000“ unter dem rechten Tal der Runden-Rutsche s6 (4,4 Einheiten) — beide behoben. Die übrigen kamen aus der
  Rechnung (Stützpunkte von Kurven, Leerzeichen so breit wie Ziffern); berichtigt und als Gegenprobe aufgenommen.
  Gegenprüfung im Browser über alle 55 Spiele × 6 Stufen: nichts über dem Rand, kein Text unter 9 Einheiten. Doku
  rahmen.md 24.
- Tests: Skripte „Keine Fehler.“, Kern „5916 Fälle, 0 Fehler.“, Server „59 Fälle, 0 Fehler.“, Lernsteig „0 Fehler,
  139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“; Eulenpfad die 55 Spiele mit Animation
  „Keine Fehler.“
- Abschluss-Animationen Block M5 (Geometrie; AR1 a): Spiegel-Raster, Koordinaten-Schatzsuche, Formen-Detektiv,
  Flächen-Pixel, Pentomino-Puzzle, Würfelbau-Blick, Netz-Falter, Rechteck-Labor, Würfel-Kipper, Begriffs-Geodreieck,
  Merk-Blick, Würfel-Zähler, Quader-Volumen — `feier.js` mit dreizehn Bildern nach den Stufen der Spiele. Geprüft wird,
  was die Bilder zeigen: Spiegelbilder im Raster und nicht auf der Figur, Quadratecke, Fläche und Umfang in
  Häuschen-Seiten, Puzzle lückenlos ohne Überlappung, Augen der Gegenseiten zusammen 7, grösste Fläche, Kipplagen nach
  der Kippregel des Spiels, Würfelzahlen und Volumen mit Einheiten. Würfelgebäude wie im Würfelbau-Blick (von vorne
  rechts oben), Ansichten wie dort berechnet; Würfel im Schrägbild wie im Würfel-Kipper. Abweichungen vom Entwurf im
  Konzept, Abschnitt 7 (zur Abnahme); Doku rahmen.md 24.
- Im Browser alle 78 Endbilder in Handybreite angesehen, den Ablauf mitten drin (Merk-Blick beim Verschwinden, Tauschen
  und Drehen, Wasser im Aquarium, Kipplagen); dabei verbessert: Gebäude im Würfel-Zähler im selben Massstab (der Turm aus
  5 Würfeln sah so hoch aus wie der aus 3), Quader im Netz in den Farben seiner Gegenflächen, Spielwürfel aus dem Netz
  mit Augen auf drei Seiten, Umfärben im Merk-Blick als Einblenden (style lässt sich mit SMIL nicht bewegen), Ring um
  beide getauschten Dinge, gestrichelte Linien blenden ein statt sich zu zeichnen (die Strichelung ging verloren),
  Hervorhebung in der Hundertertafel durchscheinend (opacity unter `erscheine` wurde voll), Raster, Puzzles,
  Wegkarte, Ansichten und einzelne Rechtecke grösser, Quader frei von der Rechnung. Gegenprüfung im Browser über alle
  68 Spiele mit Animation × 6 Stufen: nichts über dem Rand, kein Text unter 9 Einheiten.
- Tests: Skripte „Keine Fehler.“, Kern „5916 Fälle, 0 Fehler.“, Server „59 Fälle, 0 Fehler.“, Lernsteig „0 Fehler,
  139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“; Eulenpfad Stichprobe: die dreizehn
  Spiele von M5 „Keine Fehler.“ — letzter voller Lauf weiter auf `6055527`.
- Stellen-Detektiv (stellen-detektiv): die Felder unter den Ziffern sind jetzt auch im bewegten Bild zart wie in der
  Stellentafel des Spiels (Entscheid Patrik, Variante a, nach Vergleich im Browser). Vorher wurden sie bewegt voll
  farbig und dunkle Ziffern standen auf kräftigem Rot und Blau, im ruhigen Bild zart — `erscheine` bewegte die opacity
  0.18 auf 1; jetzt fill-opacity. Tests: Skripte „Keine Fehler.“, Eulenpfad stellen-detektiv „Keine Fehler.“
- Ausrollen in vier Blöcken statt fachweise (Auftrag Patrik): A Mathe M6 und Deutsch Teil 1 (23), B Deutsch Teil 2 und
  NMG Teil 1 (25), C NMG Rest (24), D Englisch, Französisch, Musik, Medien und Informatik (29); Konzept, Abschnitt 7.
- Abschluss-Animationen Block A: Bruch-Pizzeria, Schoggi-Brüche, Prozent-Brücke, Mittelwert-Türme, Daten-Detektiv,
  Diagramm-Wahl, Zufalls-Skala, Sortier-Kiste, Möglichkeiten-Finder, Silben-Klatscher, Reim-Paare,
  Buchstaben-Zwillinge, Blitzlesen, Lese-Detektiv, Wort-Spürnase, Sachtext-Spurensuche, Figuren-Spiegel, Regel-Lücke,
  ABC-Sortierer, Morphem-Schere, Trenn-Schere, Tipp-Trainer, Geschichten-Ordner — `feier.js` mit 21 Bildern nach den
  Stufen der Spiele; nachgerechnet: Bruchvergleiche, gemeinsamer Nenner, gekürzt und gemischt, Prozent und Anteile,
  Mittelwert und Ausgleich, Diagrammwerte, Stufen der Zufalls-Skala nach den Regeln des Spiels, Sortierung, alle
  Kombinationen. Deutsch ohne Lesetext (leere Kärtchen, Silbenbögen), Bildzeichen aus den Inhaltslisten der Spiele.
  AUFTRITT und KARTE nehmen eigene Bilder. Abweichungen im Konzept, Abschnitt 7 (zur Abnahme); Doku rahmen.md 24.
- Rahmen: `erscheine` blendet bis zur eigenen Deckkraft eines Teils statt immer bis 1. Im Browser über alle 91 Spiele
  gesucht: betroffen waren nur der neue Figuren-Spiegel und der Scheinwerfer im Instrumenten-Kenner (P6, abgenommen),
  der bewegt voll deckend war und jetzt zart ist wie im ruhigen Bild — dieselbe Lesart wie beim Stellen-Detektiv.
- Im Browser alle Endbilder angesehen und den Ablauf mitten drin; dabei verbessert: Steg mit sechs statt fünf Lücken,
  Fernglas mit freier Mitte, Zoom des Lese-Detektivs mit deutlich verschiedenen Stufen, Silbenkärtchen bei fünf Silben im
  Bild, Mittelwert-Klötze grösser und „?“ verschwindet vor der Zahl, Fähnchen auf der höchsten Säule statt Funken im
  Diagramm, Rechnung über dem Brückenbogen, Würfelpaare der Augensumme als Paare, Cornet-Türme ohne Überlappen,
  Tastatur ganz im Bild, gemischte Zahl bei den Schoggi-Brüchen. Gegenprüfung im Browser über alle 91 Spiele mit
  Animation: nichts über dem Rand, kein Text unter 9 Einheiten.
- Tests: Skripte „Keine Fehler.“, Kern „5916 Fälle, 0 Fehler.“, Server „59 Fälle, 0 Fehler.“, Lernsteig „0 Fehler,
  139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“; Eulenpfad Stichprobe: die 23 Spiele von
  Block A, instrumente und stellen-detektiv „Keine Fehler.“ — letzter voller Lauf weiter auf `6055527`.
- Session-Abschluss LERN_Session29: Report docs/eulenpfad/report/LERN_Session29_2026-11-11.md (Blöcke M4, M5, A,
  Prüfung Lage und Schrift, `erscheine`, Liste der 91 Spiele mit Animation und der 78 offenen je Block B, C, D,
  Stolperfallen, Plan), Handover (Stand nach LERN_Session29, weiter mit Block B).

## 2026-11-11 — LERN_Session30
- Bemerkung 36 (Möglichkeiten-Finder, Liste „sorten“): Die Listenansicht und die Prüfansicht zeigen vor einem Farbcode
  (`#rgb`, `#rrggbb`) ein rundes Feld in dieser Farbe, mit dunklem Rand, damit auch Weiss (Kokos) zu sehen ist
  (`LS.zelleMitBildern` in `spiele/gemeinsam/spiel.js`, Klassen `pruef-farbe` und `pruef-farbfeld` in `stil.css` und
  `LS.RAHMEN_KLASSEN.bausteine`, docs/eulenpfad/rahmen.md). Im Browser angesehen, keine Konsolenfehler.
- Tests: Skripte „Keine Fehler.“, Kern „5916 Fälle, 0 Fehler.“, Server „59 Fälle, 0 Fehler.“, Lernsteig „0 Fehler,
  139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“; Eulenpfad Stichprobe glace-kombinator
  abc-sortierer „Keine Fehler.“ — letzter voller Lauf weiter auf `6055527`.
- Abschluss-Animationen Block B (Deutsch Teil 2, NMG Teil 1; 25 Spiele, jetzt 116 von 169): `spiele/gemeinsam/feier.js`
  mit 25 Bildern nach den Stufen der Spiele — Satz-Reparatur (Züge aus Wortwagen mit Satzzeichen), Wörter-Trenner
  (Girlande), Fehler-Lupe (Lupe, gelb, grün), Komma-Jagd (Kommas in die Lücken), Rede-Zeichen (Begleitsatz, Rede und
  Zeichen vorne, hinten, in der Mitte), Korrektur-Stift, Wortarten-Sortierer (Körbe des Spiels), Nomen-Puzzle (Bildkarten
  der Liste, Artikel des Grundworts geprüft, Fugenlaut), Zeitreise-Verben (Zielband), Verben-Fächer, Wortarten-Probe
  (genau eine Probe trifft), Gedicht-Baukasten (Reimschema), Gattungs-Kenner (Bücherregal), Hör-Reporter, Gefühle-Radar,
  Hör-Geschichte (Lagerfeuer), Jahreskreis-Ordner (Rad der Wochentage und Monate, gerechnet), Früher und heute,
  Zeitstrahl-Sortierer (Strahl mit Jahreszahlen, Alter, Jahrhundert), Erdzeit-Leiter (logarithmisch, Erdgeschichte als
  Tag), Tageslauf-Sonne, Kulturen-Koffer (Dinge gegen die Liste geprüft), Echt oder erfunden?, Gemeinde-Helfer
  (Dorfplan, Notruf, Ebenen, Ablauf), Schulweg-Profi. Neu `ankunft`: was eine Figur abfährt, leuchtet nach der Weglänge
  auf (animateMotion fährt gleichmässig). Katalog `einstellungen: ["feier"]` für die 25 Spiele.
- Im Browser alle Endbilder in Handybreite und den Ablauf bei 1.2 und 1.6 s angesehen; dabei verbessert: Zug mittig und
  grösser, Kommas grösser mit breiteren Lücken, Lupe hebt am Ende ab, Körbe vor den Karten gezeichnet, Textkasten so hoch
  wie der Text, Fächer so weit offen wie er Blätter hat, Zeitstrahl s6 mit Ereignissen, die sich nicht überdecken,
  Erdzeit-Leiter mit Linien an die Stelle, Morgen- und Abendrot als Bögen, Koffer klappt ganz zu, Notruf-Schild und
  Ebenen im Gemeinde-Helfer, Lichtsignal neben dem Streifen; Funken und Strassen ganz im Bild (Prüfung Lage und Schrift).
- Tests: Skripte „Keine Fehler.“, Kern „5916 Fälle, 0 Fehler.“, Server „59 Fälle, 0 Fehler.“, Lernsteig „0 Fehler,
  139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“; Eulenpfad Stichprobe: die 25 Spiele von
  Block B, stellen-detektiv, instrumente, uhr-werkstatt „Keine Fehler.“ — letzter voller Lauf weiter auf `6055527`.
- Abschluss-Animationen Block C (NMG Rest; 24 Spiele, jetzt 140 von 169): `spiele/gemeinsam/feier.js` mit 24 Bildern nach
  den Stufen der Spiele — Magnet-Labor (Pole rot und grün, anziehen oder abstossen nachgerechnet, Elektromagnet),
  Schwimmt oder sinkt?, Stromkreis-Bauer (Schaltbild, Serie und parallel, überbrückte Lampe dunkel), Hebel-Wippe
  (Momente nachgerechnet), Wassertropfen-Reise (Wege und Kläranlage), Energie-Wandler (Ketten des Spiels),
  Bionik-Paare, Körper-Puzzle, Znüni-Teller, Blutkreislauf-Lotse (arm blau, ab der Lunge rot), Braille-Finger (Punkte
  nach der Tafel), Auge-Entdecker, Lärm-Wächter, Kompass-Spiel (gedrehte Karte), Plan-Leser (Massstab, Länge
  nachgerechnet), Teddy-Versteck, Tier-Sortierer (knifflige Tiere), Lebensraum-Zuordnung (Nahrungsnetze),
  Fledermaus-Forscher, Lebenszyklus-Puzzle, Pflanzen-Bestimmer, Wetter und Jahreszeiten (Thermometer der Stufen),
  Taschengeld-Planer (Beträge über LS.geldText), Kakao-Weg. Katalog `einstellungen: ["feier"]` für die 24 Spiele.
- Im Browser alle Endbilder in Handybreite und den Ablauf bei 1.2 und 1.6 s angesehen; dabei verbessert: Gesicht im
  Körper-Puzzle, Ohr im Schnitt, Fledermaus heller auf dem Nachthimmel, Finger über den Braille-Punkten, Münzen im
  Kässeli in voller Grösse, Ziel und Funken frei von Münzen, Rechnungen und Pfeilen; Ballon, Hufeisen ganz im Bild.
- Tests: Skripte „Keine Fehler.“, Kern „5916 Fälle, 0 Fehler.“, Server „59 Fälle, 0 Fehler.“, Lernsteig „0 Fehler,
  139 Hinweise.“ (Konten „106 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“; Eulenpfad Stichprobe: die 24 Spiele von
  Block C, kiosk-kasse, sachaufgaben-kompass, satz-reparatur, instrumente „Keine Fehler.“ — letzter voller Lauf weiter
  auf `6055527`.
- Session-Abschluss LERN_Session30: Report docs/eulenpfad/report/LERN_Session30_2026-11-11.md (Bemerkung 36, Blöcke B
  und C, `ankunft`, 140 von 169 Spielen mit Animation, Stolperfallen mit Prüfer-Kandidat „Schmuck über Inhalt“, Plan
  Block D), Handover (Stand nach LERN_Session30, Haltepunkt aufgelöst).

## 2026-11-11 — LERN_Session31
- **Abschluss-Animationen Block D** (Englisch, Französisch, Musik, Medien und Informatik; 29 Spiele): `feier.js` mit 29
  Bildern nach den Stufen der Spiele, gesammelt aus deren Code (die Entwürfe im Konzept passten meist nicht; Stein-Duell
  ist Nim, König in der Falle Matt-Rätsel, Geheimschrift ohne Schlüssel 26). Gemeinsame Bausteine `korbBild`, `hoerbild`,
  `gespraech`; Musik mit Notenzeile wie `noten.js` und Tönen über `klang`. Jedes Bild prüft, was es zeigt: Artikel nach
  Geschlecht und Vokal, Laute nach der Liste, Takte gehen auf, Halbtöne und Leitern nachgerechnet, Roboterweg, Nim mit
  richtigem Spiel, Atari-Fang nach den Regeln, Matt mit Fluchtfeldern, Speicher-Rechnungen mit Faktor 1000. Katalog
  `einstellungen` `feier` jetzt in allen 169 Spielen; `feier.js` nach `spiel.js` in den 29 Seiten. Alle Endbilder und
  Abläufe (1.0–1.2 s) im Browser angesehen und nachgebessert. Doku rahmen.md 24 (Tabelle Block D), Konzept (Status,
  Abweichungen Block D).
- **Vorschau der Abschluss-Animationen** (`tools/feier_vorschau.html`, Wunsch Patrik): „✓ Animation geprüft“ je Spiel in
  den Prüfstand (Art `feier`, neu im Entwickler-Server neben `spiele` und `listen`), „Geprüfte ausblenden“ in der
  Auswahl, „📝 Anmerkung“ je Stufe als Bemerkung (`inhalt: "feier"`, mit Sternen, Breite und Zeitpunkt), die offenen
  unter der Stufe. Schlüssel und Server-Adresse vom Eulenpfad desselben Browsers. Doku rahmen.md 24 (Vorschau).
- **Prüfer-Kandidaten gebaut** (aus LERN_Session29 bis 31): `tools/feier_geometrie.js` sammelt alle Prüfungen der
  Abschluss-Animationen (`feierPruefungen()`, auch vom Treiber in `pruefe_spiele.js` genutzt): Schmuck über Text, bewegtes
  Endbild gleich dem ruhigen (SMIL bis zum Ende gerechnet), `attributeName`, `keyTimes`, `keyPoints`, `keySplines`,
  Bildzeichen aus mehreren Zeichen als eines; die schmalen Leerzeichen der Breitenregel als `\u202f`, `\u2009`. Neu
  `tools/pruefe_feier.js`: alle 169 Spiele im Vorschau-Modus, alle Stufen des Katalogs (vorher nur die angebotenen), 6084
  Bilder in Sekunden, mit Gegenproben; in den kurzen Prüfungen. Gefunden und behoben: Funken oder Fähnchen auf Text in
  Stellen-Detektiv, Punkte-Schieber, Hundertertafel, Rechen-Maschine, Fahrplan-Rechner, Erdzeit-Leiter,
  Koordinaten-Schatz, Roboter-Pfad, Steine fangen, König in der Falle, Hello-Dialog, Au café; die fremde Zeile im
  Hello-Dialog am Ende unsichtbar.
- **Vorschau** weiter: Anmerkung zur ganzen Serie, Erklärung einklappbar, „Alle sechs ins Fenster“ (zwei Zeilen ohne
  Scrollen, auf die Animation zugeschnitten); Verwaltung → Entwicklung verlinkt sie (neuer Tab, über den Entwickler-Server).
- **Bemerkungen 37–40** (Abnahme in der Vorschau): Zahlen-Hüpfer (zahlen-huepfer) mit dem Schild des Spiels für den
  Schritt der Stufe — die Zahl der Sprünge ist im Spiel immer vier (Entscheid Patrik a) —, der Frosch hellgrün mit dunklem
  Rand statt im Grün der Seerose; Einmaleins-Blitz (einmaleins-blitz) s3: Division als Aufteilen (grauer Haufen, Gruppen
  mit Rahmen, Farbe und Nummer, die Zahl der Gruppen leuchtet); Runden-Rutsche (runden-rutsche): Kopf der Stelle, auf die
  gerundet wird, in der Stellenfarbe und die entscheidende Ziffer gross in ihrer Farbe, s2 und s5 runden jetzt ab.
- Session-Abschluss: Report docs/eulenpfad/report/LERN_Session31_2026-11-11.md, Handover (weiter mit der Überarbeitung
  der Kacheln und der Gestaltung).

## 2026-11-11 — LERN_Session32
- **Bemerkungen 41–49** aus der Abnahme der Abschluss-Animationen: Dezimal-Rutsche (dezimal-rutsche) mit Kopf der
  Rundungsstelle, entscheidender Ziffer und Stufen-Eigenheiten (Münze, Eingabefeld, Band); Echt oder erfunden?
  (echt-oder-erfunden) mit der Wendung aus dem Satz in einer Blase; Zeitstrahl-Sortierer (zeitstrahl-sortierer) mit
  Jahrhundert-Band, Ereignissen der Gegenwart (1991, 2007, 2022; ZS1 a) und gezeichneter Mondlandung (ZS2 a).
- **Konzept Gestaltung** (`docs/eulenpfad/konzept_gestaltung.md`) mit Entscheiden GS0–GS3, SK1, SP1, FB1–FB3, WO1, GR1,
  FB2-K; Grundsatz im Plan Angleich der Reihe neu gefasst (GS0 a: Startseite wird überarbeitet, Spiele bleiben).
- **Feier-Angaben im Katalog** (GS1 a, SK1 a): alle 169 Spiele, `spiel.js` nimmt sie nur von dort; Schweiz-Karte mit
  Karte und Auswahl beim Namen (`LS_FEIER.kartenDaten`); Gegenprobe: gleiches Markup wie vorher in allen Stufen.
- **Startseite:** Kartenbilder (Endbild Stufe 3, 1 Stern, verzögert gezeichnet), Kinderkarte mit ⓘ (GS2 a), Schrift
  Nunito als Datei (GS3 a, `tools/schrift_zuschneiden.py`, Prüfung „schrift“), Druckknöpfe, Fach-Reiter und Knopf
  „Filter“ mit Schiebereglern (FB1 a), Filtergruppen einklappbar, Fach- und Themenblöcke mit Bild (GR1 a, `THEMEN[].bild`),
  Wochenziel als Marke in der Kopfzeile (WO1 a, am Ende zurückgenommen, noch umzubauen).
- **Stil „wie von Hand gezeichnet“** (Einstellung `stil`, Standard hand; `STIL` in `spiel.js`): krumme Rahmen, variiertes
  Raster mit Lücken, ungleiche Ecken bei Knöpfen und Feldern; auf der Startseite und um jede Runde (Stufenwahl,
  Ranglisten, Schlussbild; SP1); Avatare verformt, Form des Rahmens wählbar (rund, Quadrat, Dreiecke, Fünfeck).
- **Stufenwahl als Level** (FB2 a): grosse Zahl, drei Sterne, Untertitel, Lehrplantext hinter ⓘ; Timer und Endlos mit
  Symbol und Wort (`LS.schalterSymbol`).
- **Verwaltung → Einstellungen** in Blöcken (`LS.EINSTELLUNG_BLOECKE`).
- **Bilder:** `svg:mondlandung`, `svg:schweiz` (Flaggen-Emoji ersetzt in gemeinde-helfer, kakao-weg, nombres-rallye,
  zeitstrahl-sortierer und zwei Abschlussbildern; word-match 🔤 statt 🇬🇧); `feier.js` zeichnet Bilder der Sammlung.
- **Prüfungen:** Kinder-Statistik ohne Konzentration (ST1 a); `pruefe_skripte.js` prüft auch `<link>`, `@import`,
  `url()` von aussen; `tools/eulenpfad_seiten.js` prüft Kinderkarte, Kartenbild, Stil, Filter, Reiter, Blöcke,
  Einstellungs-Blöcke und Wochenmarke.
- Session-Abschluss: Report docs/eulenpfad/report/LERN_Session32_2026-11-11.md, Handover (weiter mit Erfolge und
  Statistik im Stil, Statistik kindgerechter, Wochenmarke entfernen, Personen-Dropdown, FB2-K, FB3).

## 2026-11-12 — LERN_Session33
- **Bemerkungen 50–52:** Wort-Zwillinge (wort-zwillinge) mit sechs Zeichnungen in `bilder.js` (Garten, Glas, Gras,
  Knie, Haar, Sommer), `bilder.js` geladen, Lösungssatz über `LS.mitBildText`; Listen & Tap (listen-tap) Formen mit
  Bildern in der Prüfansicht; Znüni-Teller (znueni-teller) Gruppe „Stärke“ statt „Getreide“.
- **Konzept Darkmode** (`docs/konzept_darkmode.md`) mit DM0–DM6, DM2-S, DM2-K (je a), Messung hell und Reihenfolge.
- **Kern 1.40.0–1.42.0:** `farben.css` (hell und dunkel, `--k-feld`, `--k-bildtext`, `color-scheme`), `farben.js`
  (`KERN.farben`), `farben.kopf.js` (`kern-kopf.js`); `tools/kern_verteilen.py` mit drei Arten.
- **Prüfungen:** `tools/kontrast.js` (Kontrast im Browser, Gegenprobe), `pruefe_skripte.js` Punkte 6 und 7, Farben in
  `pruefe_kern.js`, Seitentests Statistik des Kindes, Empfehlungen der Aufsicht, Aussehen.
- **Startseite:** Wochenmarke entfernt; Statistik fürs Kind mit Vorschlagskarten, Rundenkacheln und Wochensternen
  (KS1–KS3 a), Empfehlungen der Aufsicht mit Anheften, Ausblenden, eigener Empfehlung und Rangfolge (KS4 a); Stil
  „hand“ für Kacheln, Abzeichen und Personen-Menü; Datum der Wochen-Abzeichen aus der Runde, die das Ziel erreichte.
- **Darkmode bis 3c-2:** Einstellung Farben und „Für mich“ (Stil, Farben), Kopf-Skript in 174 Seiten, `stil.css` und
  `start.css` ohne feste Farben (hell unverändert, Farbabdruck gleich).
- Session-Abschluss: Report docs/eulenpfad/report/LERN_Session33_2026-11-12.md, Handover (weiter mit Darkmode 3c-3,
  DM2-K a; nicht pushen vor 3c-3).

## 2026-11-12 — LERN_Session34
- **Darkmode 3c-3:** Stellenfarben und Knopf hell ab 4,5 (DM5 a, Kern 1.42.1), Schrift-Fassungen der Deko-Farben
  (DM6 a), helle Flächen mit dunkler Schrift statt dunklerer mit weisser (G1 a, Farbmuster); Funde im Rahmen behoben
  (Ersatz-Avatar, Kopfzellen, Wochentage, Filter). Kontrast über alle Seiten: hell 1091 → 98, dunkel 355 → 348.
- **DM2-K a:** ☀️/🌙 neben dem Namen für Kinder, denen die Aufsicht es im Profil erlaubt (Standard fest).
- **Darkmode Schritt 4 (DM3 a):** Kern 1.43.0 mit Bildkachel; Zeichnungen, Abschluss-Animationen, Kartenbilder und
  Symbole erreichter Abzeichen dunkel auf warmem hellem Grund (offene ohne, als Überraschung), hell unverändert.
- **Stil „hand“:** Fach- und Themenblöcke gezeichnet, Titel tanzend, nicht freigegebene Spiele gestrichelt; Lücken im
  Raster mit Motiven zum Fach (`start/luecken.js`, LU1 a), Wirkungen auf die Nachbarkacheln, zwei realistische schwarze
  Löcher mit Schlauch aus der Nachbarkachel, alles dezent bewegt.
- **Stufenwahl:** Timer-Knopf nur die Uhr; Stimmzeile nur für die Aufsicht. Wassertropfen-Reise dunkel lesbar.
- **Werkzeug:** `tools/bilder_aufnehmen.js` (Seiten je Modus und Breite als Bild).
- Session-Abschluss: Report docs/eulenpfad/report/LERN_Session34_2026-11-12.md, Handover (weiter mit Darkmode Schritt 5).

## 2026-11-12 — LERN_Session35
- **Darkmode Schritt 5 (DM4 a):** Stile aller Spielseiten ohne feste Farbe (vorher 534 in 142 Seiten) — Felder
  `--k-feld`, Trennlinien `--k-karte`, Schrift auf Farbgrund mit den Paaren aus `stil.css`; neu `--auf-stelle`,
  `--feld-leise`, `--marker`, `--regel` (Regelkarte hell 5,5 statt 4,1); Szenen mit `szenenbild bildkachel`
  (Pflanze, Wasserkreislauf, Tageslauf, Teddy, Thermometer, Plan, Karte, Kompass, Angel-See, Klaviatur); Gegenstände
  „Gleich in beiden Modi“ (Banknoten, Münzen, Go-Brett, Schachbrett, Verkehrszeichen, Nachthimmel …).
- **Schrift in Deko-Farbe** in 47 Spielseiten über `--deko-N-schrift` (DM6 a); dunkel deko-2 und deko-6 als Schrift
  heller; Stufen-Plättchen, Klötze und Körbe mit Fläche und Schrift wie `LS.flaeche`; blasse Kleintexte voll.
- **Rahmen:** `mark` mit der Schrift der Seite; Notenblatt mit dunklen Noten auf hellem Grund in beiden Modi, auf
  Wahlknöpfen die Schrift der Seite; Blutkreislauf, Lebensraum mit dunklen Fassungen ihrer eigenen Farben.
- **Prüfung:** `tools/pruefe_skripte.js` Punkt 7 in Spielseiten ein Fehler; `tools/kontrast.js` liest den Grund
  des äussersten `<svg>`. Kontrast über alle Seiten: hell 98 → 10, dunkel 348 → 9.
- **Stufenwahl (RS1 a, Wunsch Patrik):** Teile, Timer und Endlos als Symbolknöpfe wie auf der Karte, je mit Wort und
  der Erklärung des zuletzt geänderten; Endlos an lässt die Stufenknöpfe endlos starten (mit Rekord), der Endlos-Block
  zeigt nur noch die Ranglisten; Werte der Reihenfolge einmal im Rahmen (`LS.REIHENFOLGE_SCHALTER`). Vorlesen (gleich oder
  auf Knopfdruck) als vierter Schalter in derselben Zeile, mit eigenem Symbol (Lautsprecher, Wunsch Patrik).
- **Was Kinder selbst umstellen dürfen (Wunsch Patrik):** Verwaltung → Einstellungen → Kinder gibt Timer, Teile, Vorlesen
  und hell/dunkel für alle Kinder frei (Standard wie bisher: alles ausser hell/dunkel); im Profil je Kind „wie alle
  Kinder“, „darf selbst umstellen“ oder „🔒 fest“. ☀️/🌙 auch in der Kopfzeile der Spielseite, neben ❓ (zeigt wie auf der Startseite, wohin er schaltet).
- **Tab Spiele schneller (Hinweis Patrik):** Timer, Endlos, Teile und Stern zeichnen nur ihre Karte neu (im Browser
  5–12 ms statt Neuaufbau der Liste mit Stil „hand“). Favoriten: Feld oben nur mit Favoriten, Spiel bleibt am eigenen
  Platz, „☆ Alle Favoriten entfernen“ (zweimal tippen); Stern auch auf der Spielseite. Tab-Test mit fünf Schritten mehr.
- **Favoriten gerahmt** wie ein Fach, in Gold. **🗣️ neben der Eule:** antippen liest vor, lange drücken schaltet „gleich
  vorlesen“ ein oder aus (goldener Ring); der Vorlesen-Schalter in der Zeile der Spielseite entfällt (Wunsch Patrik).
- **Darkmode Schritt 5 abgeschlossen:** Restfunde (Beschriftungen im Koordinaten-Schatz, Holz im Wortfamilien-Baum,
  Caramel im Glace-Kombinator heller, Dach des Zahlenhauses als Fläche, Buchstaben im Würfel-Zähler); Prüfung Punkt 8
  (Farben in Skripten nur mit Grund); Messung genauer (Umriss-Schrift, scrollende Kästen, Schmuck). Kontrast über alle
  Seiten hell 0, dunkel 1 (Lernsteig, Schritt 6).
- **Darkmode Schritt 6 (Teil):** Lernsteig dunkel (Wahl im Profil je Person, Standard wie das Gerät; Kopf-Skript in
  allen Seiten; Akzent und Gefahr mit dunkler Fassung; Rechner gleich), Portal folgt dem Gerät, Anleitungen dem
  Eulenpfad, Mix und Regelkarten über Variablen. Feste Farben in Stilen sind jetzt überall ein Fehler (Punkt 7);
  Variablen in `:root, .bildkachel` und Masken zählen nicht. Vier Bilder der Kinder-Anleitung neu (a01–a04).
- Session-Abschluss: Report docs/eulenpfad/report/LERN_Session35_2026-11-12.md, Handover (weiter mit den Inhaltslisten
  in LERN_Session36, danach den Anleitungen).

## 2026-11-12 — LERN_Session36
- **Linien der Prüfansicht kräftiger** (Hinweis Patrik): eigene Farbe `--trennlinie` in `stil.css` (hell `#858aa6`, 3,4
  auf der Karte, 3,2 auf einer Zeile mit Bemerkung; dunkel `#7d84aa`, 3,9 und 3,6); vorher `--rand` mit 1,2 hell und 1,9
  dunkel. Dieselbe Farbe für die Rahmen der Abschnitte und Gruppen der Prüfansicht (T2 a), die Zeilen der Einstellungen
  je Spiel und der Ruhezeiten in der Verwaltung und die Grundlinie der Säulen in der Statistik (T1 a); Linien zwischen
  Abschnitten bleiben `--rand`.
- **Keine Worktrees** (W2 b, Anweisung Patrik): Regel im Projekt-Steckbrief der `CLAUDE.md` — Sitzungen arbeiten im
  Hauptordner, weitere Sitzungen starten ohne Worktree und ändern nie dieselben Dateien.
- **Linien der Prüfansicht im Lernsteig kräftiger** (T3 a): eigene `--trennlinie` in `lernsteig/gemeinsam/stil.css`
  für die Zeilen der Prüftabelle und die Rahmen der Gruppen — hell `#7b8794` (3,7 auf der Karte, 3,4 auf einer Zeile mit
  Bemerkung, 3,4 auf dem Grund; vorher `--rand` mit 1,3), dunkel `#7d84aa` wie im Eulenpfad (3,9 und 3,6).
- **Prüfung je Eintrag, Block 1 Mathe** (LP5 a, LERN-51, T4 a): `pruefung.js` für Schätz-Waage, Rechengeschichten,
  Daten-Detektiv, Preis-Tabelle, Möglichkeiten-Finder, Gegenteil-Wippe, Platzhalter-Geschichten, Zeit-Schätzer und
  Diagramm-Wahl — jede Liste je Abschnitt abhakbar. Gemischte Listen in mehrere Abschnitte getrennt: Umfragen (Fragen,
  Kategorien), Gegenteile (Bildpaare, gezeichnete Dinge, Reihen), Platzhalter-Geschichten (je Gruppe; in Gruppe 3 jede
  Variante ein Eintrag), Tätigkeiten (Dauern, Sätze mit Zeitpunkt, Sätze mit Zeitdauer), Diagramm-Daten (Säulen und
  Linien je Daten und Fragen/Sätze, Kreise, offene Aussagen). Bilder vom Spiel gezeichnet: Glacekugeln, die vier
  Fassungen der gezeichneten Dinge, Säulen-, Kreis- und Liniendiagramme. Rechengeschichten zeigen je Vorlage zwei
  Beispiele (kleinste und grösste Zahlen, mit Einzahl bei 1), Platzhalter-Geschichten eines mit Gleichung und Lücke.
  Prüfstand und Fingerabdrücke unverändert (die Listen sind vor der Prüfung je Eintrag als Ganzes geprüft).
- **Prüfdialog dunkel auf der Karte** (N1 a): `.listen-dialog` mit `background: var(--karte)` im Eulenpfad und im
  Lernsteig; vorher nahm er das fast schwarze Grau des Browsers. Hell unverändert (Weiss).
- **Rahmen einer fertig geprüften Gruppe** (N2 a): eigene Farbe `--trennlinie-fertig` in `stil.css` — hell `#1f8a50`
  (4,4 auf der Karte; vorher `--gut` mit 2,4), dunkel `var(--gut)` (7,7). Im Lernsteig reicht `--gut` (5,9).
- **Prüfung je Eintrag, Block 2 Deutsch** (LP5 a, LERN-51, T4 a): `pruefung.js` für Wortarten-Sortierer, Regel-Lücke,
  Satz-Reparatur, Silben-Klatscher, Reim-Paare, ABC-Sortierer, Buchstaben-Zwillinge, Blitzlesen, Nomen-Puzzle und
  Lese-Detektiv (36 eigene Listen; Wörter-Trenner und Tipp-Trainer leihen nur und brauchen keine). Gemischt war nur
  Regel-Lücke „ck-tz“: zwei Abschnitte, ck oder k und tz oder z. Die Spalten rechnen die Spiele mit ihren eigenen
  Funktionen aus (zerlegeWort, zerlegeSatz, zerlege, silbenText, zusammen); Stufen der Regel-Lücke aus ihrer
  Stufentabelle. Gruppen etwa je Wortart, je richtiger Schreibweise, je Satzart, je Anfangsbuchstabe, je Verwendung der
  Reimgruppe. Lese-Detektiv: Text und Frage bleiben ein Eintrag (je Text genau eine Frage). Die Beschreibungen nennen,
  welche Spiele eine Liste leihen. Prüfstand und Fingerabdrücke unverändert.
- **Prüfung je Eintrag, Block 3 Deutsch** (LP5 a, LERN-51, T4 a): `pruefung.js` für Wortfamilien-Baum,
  Zeitreise-Verben, Fehler-Lupe, Gedicht-Baukasten, Komma-Jagd, Morphem-Schere, Rede-Zeichen, Trenn-Schere,
  Verben-Fächer und Wort-Spürnase (29 Listen). Gemischte Listen in Abschnitte getrennt: Wortfamilien „umlaut-aehnlich“
  (Umlaut-Wörter gehören dazu, ähnliche Wörter nicht), Fehler-Lupe je Regel einer Liste (nomen-gross, sp-st-sch, ae-aeu,
  kurzer-vokal), Komma-Jagd „verbgruppen“ (ein Komma, mehrere Kommas), Morphem-Schere „stamm-ea“ (ä/äu mit verwandtem
  Wort, e/eu ohne), Rede-Zeichen „hinten“ (Sätze mit „|“ zusätzlich mit Begleitsatz in der Mitte), Trenn-Schere (mit und
  ohne Trennstelle), Verben-Fächer (Satz mit Ergänzungen, Zeitformen). Kurze und lange Sätze der Fehler-Lupe sind
  Gruppen, nicht Abschnitte. Sätze, Formen und Fallen bauen die Spiele mit ihren eigenen Funktionen; Stufen aus den
  Stufentabellen, wo sie auslesbar sind (in Trenn-Schere und Gedicht-Baukasten als Text). Prüfstand und Fingerabdrücke
  unverändert.
- **Anleitungen nachgeführt** (AN-B a; damit ist Darkmode Schritt 6 erledigt): `eulenpfad/anleitung/aufsicht.html` und
  `kinder.html` gegen die heutige App abgeglichen — Tab Spiele mit Fach-Reitern und Filter, Schalter auf Karte und
  Stufenwahl (Timer, Endlos, Favorit), Favoriten, 🗣️ mit langem Drücken, Personen-Menü, „Was … selbst umstellen darf“ im
  Profil, Einladung zum Lernsteig, Konten (→ Kind, ausblenden), Prüfansicht der Wortlisten mit ✏️ Korrektur (neuer
  Abschnitt), Empfehlungen ans Kind (📌, 🚫, ➕), Einstellungen in Blöcken (Aussehen, In den Spielen, Kinder, Ton und
  Ruhezeiten), Abschluss-Animation, 22 Abzeichen, Podestplätze, was der Abgleich mitnimmt (Einstellungen bleiben auf dem
  Gerät). `tools/anleitung_bilder.js` wieder lauffähig: Laden wartet erst auf about:blank, Aufsicht 1200 breit, neue
  Rahmen für Tab Spiele, Stufenwahl, Einstellungen, Profil und die Kinderbilder, Rahmen in offenen Dialogen; zwei neue
  Bilder (a21 Prüfansicht, a22 Empfehlungen), alle 36 Bilder neu. `anleitung.css`: Handy-Bilder nie breiter als die Karte.
- **Zwei veraltete Texte in der App** (A1 a, A2 a): Statistik ohne Endlos-Runde weist auf den Schalter ♾ Endlos auf der
  Spielkarte oder über den Stufen (statt „unter den Stufen“); der Abgleich in der Verwaltung nennt, was wirklich reist
  (Runden, Endlos-Rekorde, Kinder mit Profilen, Freigaben, Ruhezeiten, Meldungen) und dass Einstellungen und PIN auf dem
  Gerät bleiben (vorher „Einstellungen“ als mitreisend).
- **Session-Abschluss:** Report `docs/eulenpfad/report/LERN_Session36_2026-11-13.md` mit Patriks Rückmeldung zu den
  Anleitungen (Nummern im Bild und im Text uneinheitlich, Text mal über, mal unter dem Bild, verschiedene Breiten) als
  Auftrag für LERN_Session37; Handover (weiter mit dem Neuaufbau der Anleitungen, dann Inhaltslisten Block 4 Deutsch).

## 2026-11-13 — LERN_Session37
- **Bemerkung 53, Znüni-Teller** (znueni-teller, LP5 a): neue Prüfansicht `pruefung.js` für alle vier Listen, Lebensmittel
  nach Korb mit den Namen wie im Spiel; die Einträge des Korbs „Süsses und Salziges“ tragen die Art „süss“ oder „salzig“
  (Pommes frites salzig) und stehen in der Prüfansicht in zwei Gruppen; im Spiel bleibt es ein Korb.
- **Anleitungen neu aufgebaut** (docs/eulenpfad/konzept_anleitungen.md, AL1 a–AL7 a): Jedes Bild steht mit seiner Legende
  in einem Block; die Legende zählt selbst, ihre Nummer ist die rote Nummer im Bild (keine Nummern von Hand, keine in
  Bildunterschriften). Jedes Bild in zwei Fassungen, breit (816 px, 1 : 1 in der Karte, Aufbau wie am Tablet) und schmal
  (390 px, Handy), die Seite zeigt die passende. Kinder-Anleitung im selben Aufbau wie die für Erwachsene (linksbündig,
  mit Inhaltsverzeichnis). Rahmen nur, wo die Legende etwas beschreibt; a20 entfällt (beide Seiten zeigen k14), neu a23
  Zufall, a24 Selbst umstellen, a25 Dezimalzeichen, a26 Eigene Empfehlung, k15 Weiterspielen.
- **`tools/anleitung_bilder.js`:** Ziele mit Schlüssel, Nummer nach der Lage (Lesereihenfolge), Ausschnitt um die Rahmen
  ohne angeschnittene Zeilen, Knöpfe und Bilder, Rahmen nur um den sichtbaren Teil in Scrollbereichen, Fenster bis ans
  Ende des Ausschnitts statt Scrollen (sonst lag die Kopfzeile darüber); schreibt `docs/eulenpfad/anleitung_rahmen.json`
  (Schlüssel, Grösse, Fingerabdruck je Bild und Fassung).
- **`tools/pruefe_skripte.js` Punkt 9** (AL5 a): Legenden gegen die Liste der Rahmen (Schlüssel und Reihenfolge in beiden
  Fassungen), keine Nummern von Hand, jedes Bild mit beiden Fassungen, unverändert seit der Aufnahme und benutzt; mit
  acht Gegenproben.
- **Prüfung je Eintrag, Block 4 Deutsch** (LP5 a, LERN-51, T4 a): `pruefung.js` für Sachtext-Spurensuche, Korrektur-Stift,
  Hör-Reporter, Wortarten-Probe, Gefühle-Radar, Geschichten-Ordner, Hör-Geschichte, Gattungs-Kenner und Figuren-Spiegel
  (je eine Liste). Gemischte Listen in Abschnitte getrennt: Sachtexte und Berichte getrennt von ihren Fragen (je Text
  eine Gruppe, der Haken einer Frage hängt am Text), Korrektur-Stift je Fehlerart, Wortarten-Probe je Satzgruppe und
  Pronomenliste, Gefühle-Radar je Vorrat (Gesichter, Bilder, Sätze, Situationen, Körpersignale, Gespräche, Paare,
  Antworten), Geschichten-Ordner je Form, Hör-Geschichte und Figuren-Spiegel je Gruppe, Gattungs-Kenner mit Texten,
  Mischtexten und Merkmalen. Stufen aus den Stufentabellen der Spiele. Damit keine Prüfansicht einen Schritt der Aufgabe
  nachbaut, stehen drei davon jetzt als Funktion oder Konstante im Spiel und werden von beiden benutzt:
  Geschichten-Ordner `zeitwortSaetze` und `lueckenVon`, Wortarten-Probe `satzAufgabe`, Gattungs-Kenner `S4_GATTUNG`
  (Aufgaben unverändert). Prüfstand und Fingerabdrücke unverändert (keine dieser Listen hat einen `hash`).
- **Prüfung je Eintrag, Englisch** (LP5 a, LERN-51, T4 a): `pruefung.js` für English Word-Match (acht Listen),
  Wort-Zwillinge, Sentence-Builder, Listen & Tap (die zwei eigenen Listen), Sound-Sorter, Weather-Report und
  Hello-Dialog; Spelling-Bee leiht nur und braucht keine. Die Beschreibungen der sechs geliehenen Word-Match-Listen
  nennen, wie Listen & Tap und Spelling-Bee sie nutzen. Gemischte Listen in Abschnitte getrennt: Sound-Sorter Wörter
  je Laut und die Laute der Körbe, Listen & Tap Farben, Formen und Anfänge bzw. Tiere und Orte (vom Spiel gezeichnet),
  Weather-Report Wetterwörter, Wetterbilder, Durchsagen, Fragen je Durchsage, Wege (mit Plan), Mannschaften, Orte und
  Häuser, Hello-Dialog je Tabelle. Damit keine Prüfansicht einen Aufgabenschritt nachbaut, im Spiel neu: Sentence-Builder
  `inStufe`, Wort-Zwillinge Stufentabelle als Daten `STUFE_ARTEN`, Sound-Sorter `HOEREN_VOKALE` und `inStufe5`,
  Listen & Tap `anweisungSatz`, `woSatz` und `VERBEN_JE_STUFE`, Weather-Report der Filter der Durchsagen als drittes
  Element in `STUFE` (Aufgaben unverändert). Weather-Report: Resultat-Frage bei mehreren Spielen jetzt „What was the
  score in the football match?“ (vorher ohne „in“). Prüfstand und Fingerabdrücke unverändert.
- **Prüfung je Eintrag, Französisch** (LP5 a, LERN-51, T4 a): `pruefung.js` für Mots-Match (fünf Listen),
  Wörter-Brücke, Le ou la?, Son-Lauscher und Au café; Nombres-Rallye, Quelle heure und Calendrier haben keine
  Inhaltslisten. Gemischte Listen in Abschnitte getrennt: Wörter-Brücke Brücken, Fallen und Sätze, Son-Lauscher Wörter
  je Laut und die Laute der Körbe, Au café Sprecher, Situationen, Formeln, Befinden, Dialoge, Antworten, Bestellungen,
  Sachen, tu/vous und Personen. Damit keine Prüfansicht einen Aufgabenschritt nachbaut, im Spiel neu (Aufgaben
  unverändert, je Stufe mehrere hundert Aufgaben mit festem Startwert vorher und nachher gleich): Mots-Match
  `STUFE_ARTEN`; Le ou la? `STUFE_ARTEN`, `NIMMT` und `mehrzahlAnders`; Wörter-Brücke `STUFE_ARTEN` und `bildZiel`;
  Son-Lauscher `STUFE_ARTEN`, `kniffligGeschrieben` und `ABLENKER_E`; Au café `paareVon`, `zumOrdnen`, `personenBis`,
  `ANTWORT_JE_STUFE`, `ORDNEN_JE_STUFE`, `TU_VOUS_JE_STUFE` und `ablenkerFuer` mit wählbaren Dialogen. Prüfstand und
  Fingerabdrücke unverändert.
- **Anleitungen:** Ohne „Meine Klasse“ steht das Zeichen (✓ ● ▲) oben links auf der Karte, und der Rand hat seine
  Farbe; über den Karten steht die Legende (vorher: „zeigt der Rand“). Hinweis Patrik.
- **Prüfung je Eintrag, NMG Block 1** (LP5 a, LERN-51, T4 a): `pruefung.js` für Tier-Sortierer, Lebensraum,
  Fledermaus-Forscher, Lebenszyklus-Puzzle, Körper-Puzzle, Magnet-Labor, Schwimmt oder sinkt?, Schweiz-Karten-Suche,
  Kompass-Spiel und Früher und heute (40 Listen). Gruppen mit den Namen der Körbe wie im Spiel, Stufen je Eintrag aus den
  Spielen; Schweiz-Karten-Suche zeigt jedes Gebiet und jeden Ort auf der Karte des Spiels, Magnet-Labor die Pol-Aufgaben
  mit seinem Stabmagneten. Damit keine Prüfansicht einen Aufgabenschritt nachbaut, im Spiel neu (Aufgaben unverändert,
  je Stufe 400 bis 600 Aufgaben mit festem Startwert vorher und nachher gleich): die Stufentabelle als Daten
  `STUFE_ARTEN` in Tier-Sortierer, Lebensraum, Fledermaus-Forscher, Lebenszyklus-Puzzle, Körper-Puzzle, Magnet-Labor,
  Schwimmt oder sinkt? und Früher und heute, dazu je nach Spiel `NIMMT`, `frageIn`, `FRAGE_NIMMT`, `fragenFuer`,
  `zyklusInStufe`, `KNIFFLIG_KOERBE`, `frisstPaare`, `ablenkerFuer`, `wasFrisstFrage`, `STAEBE`, `WIRKUNG`, `POL_FUER`,
  `korbDinge`, `paarAblenker`, `dazwischenAblenker`, `gabEs`; Schweiz-Karten-Suche `zieleAus`, `karteZeichnen`,
  `punktZeichnen` und Ziele der Stufen auch ohne Freigabe. Prüfstand und Fingerabdrücke unverändert.
- **Werkzeuge für die Prüfansichten ins Repo:** `tools/pruefe_pruefansicht.js <spiel …>` (Ladeprüfung jeder Zeile einer
  Prüfansicht, Zellen = Spalten, Fingerabdruck je Liste; im Steckbrief unter Tests) und `docs/eulenpfad/auftrag_pruefansicht.md`
  (gemeinsamer Auftrag der Agenten: Vertrag, Vorbilder, Schritt ins Spiel ziehen mit Nachweis gleicher Aufgaben, kein
  eingebauter Browser).
- **Session-Abschluss:** Report `docs/eulenpfad/report/LERN_Session37_2026-11-13.md` (mit den inhaltlichen
  Auffälligkeiten aller Blöcke), Handover (weiter mit NMG Block 2).

## 2026-11-13 — LERN_Session38
- **Anleitung k04:** Rahmen 1 „Das ist die Aufgabe“ um Zahl und Auftrag zusammen, ohne 💡 (Hinweis Patrik).
  `tools/anleitung_bilder.js`: Rahmen-Ziele mit `alle` (ein Rahmen über alle Treffer) und `eng` (um den Inhalt statt die
  Blockbreite); `--nur=<bild,…>` schreibt nur diese Bilder, die übrigen bleiben unberührt.
- **Korbfarben (KF1 a, Hinweis Patrik zum Tier-Sortierer):** `LS.koerbe` färbt je Korb statt je Platz. Ein Korb behält
  seine Farbe die ganze Runde, auch gemischt; jede Runde verteilt sie neu, damit sich keine Farbe über Runden an einen Korb
  bindet; in einer Aufgabe nie zweimal dieselbe (bei mehr Körben als Farben weicht einer aus). Betraf gemischte Körbe in
  Tier-Sortierer, Instrumente, Son-Lauscher, Sound-Sorter, Znüni-Teller und Auge-Entdecker; Spiele mit eigener Farbe
  (`opt.farbe`) unverändert. Neuer Prüfer „Korbfarbe“ in `tools/pruefe_spiele.js` (Gegenprobe mit Farbe nach Platz: 230
  Meldungen im Tier-Sortierer).
- **Platz der Körbe (KF2 a):** die sechs Spiele folgen dem Sortierschalter (Katalog `reihenfolge: "koerbe"`, `LS.koerbe` mit
  `opt.familie`): geordnet steht jeder Korb immer am selben Platz, „nach Stufe“ = Stufe 1–3 geordnet, ab 4 gemischt.
  Schalter auf Karte und Stufenwahl mit eigenen Worten („Körbe nach Stufe“, `LS.reihenfolgeSchalter`), Profiltext ergänzt.
- **Tageslauf-Sonne (TS1 a):** Auftrag „Was kommt zuerst, was danach? Tipp die Bilder der Reihe nach an: vom Morgen bis in
  die Nacht.“ statt „Was machst du zuerst am Tag?“ (nicht jedes Bild ist etwas, das das Kind tut), Tipps ebenso.
- **Zufalls-Skala (ZS1 a, Hinweis Patrik):** „oder“ nur bei Säckchen und Rädern mit mindestens zwei Farben, eine der
  beiden genannten kommt vor (vorher ganz orange und „orange oder gelb“; 89 % der Oder-Aufgaben in Stufe 1 nannten eine
  fehlende Farbe). Oder-Aufgaben in Stufe 1 jetzt möglich 530 / sicher 380 von 20 000 (vorher sicher 2045, möglich 530,
  unmöglich 548); im Generator geprüft. Unter der Aussage neu die Frage „Wie wahrscheinlich ist das?“ (ZS2 a; vorher
  liess sich „Sie ist orange oder gelb.“ als Frage nach der Farbe lesen).
- **Prüfung je Eintrag, NMG Block 2 (LP5 a, LERN-51, T4 a):** `pruefung.js` für Schulweg-Profi, Wetter und Jahreszeiten,
  Zeitstrahl-Sortierer, Stromkreis-Bauer, Plan-Leser, Echt oder erfunden?, Taschengeld-Planer, Wassertropfen-Reise und
  Erdzeit-Leiter (22 Listen); Stufen je Eintrag aus den Spielen, Schaltbilder, Pläne und Signale vom Spiel gezeichnet.
  Damit keine Prüfansicht einen Aufgabenschritt nachbaut, im Spiel neu die Stufentabelle als Daten `STUFE_ARTEN` (alle
  neun Spiele), dazu je nach Spiel `NIMMT`, `korbVon`, `frageNimmt`, `signalAblenker`, `LOESUNG`, `kleidungFrage`,
  `ART_LISTEN`, `DREI_GENERATIONEN`/`VIER_GENERATIONEN`, `pronomen`, `ABSTAND_FAKTOR`, `abstandVon`, `VORRAT_FREI`/
  `VORRAT_ALLE`, `KANDIDATEN`, `zusatzText`, `legendeName`, `legendeZeichen`, `kurzformen`, `wareAus` (Aufgaben unverändert:
  je Stufe 400 bis 500 Aufgaben mit festen Startwerten vorher und nachher byte-gleich). Prüfstand und Fingerabdrücke
  unverändert.
- **Prüftabellen (PT1 a):** lange Spalten mindestens 8em statt 12em breit — die breitesten Tabellen (Wassertropfen-Reise,
  Velo-Fragen, Erdzeit-Leiter, Kurzschluss) passen bei 1024 px ganz in den Dialog, hell und dunkel angesehen; seitliches
  Scrollen bleibt als Notlösung.
- **Prüfung je Eintrag, NMG Block 3 (LP5 a, LERN-51, T4 a):** `pruefung.js` für Pflanzen-Bestimmer, Blutkreislauf-Lotse,
  Energie-Wandler, Bionik-Paare, Kakao-Weg, Gemeinde-Helfer, Kulturen-Koffer und Lärm-Wächter (acht Listen, je in
  mehrere Abschnitte geteilt); Blätter, Nadelzweige, Ohr und Wandlerketten vom Spiel gezeichnet; alle Tabellen bei 1024 px
  ohne seitliches Scrollen. Damit keine Prüfansicht einen Aufgabenschritt nachbaut, im Spiel neu: Pflanzen-Bestimmer
  `STUFE_ARTEN`, `NIMMT`, `MERK`, `merkmalWert`, `bekannteMerkmale`, `imMerkmalPool`; Blutkreislauf-Lotse `fragenFuer`,
  `THEMA_BILD`; Energie-Wandler `vorratFuer`, `ABLENKER`, `ketteText`; Kakao-Weg `werSchritte`, `transportText`;
  Gemeinde-Helfer `ablenkerAlsKorb`; Kulturen-Koffer `kulturInStufe`, `gabFrage`; Lärm-Wächter `KLAR_LAUT_LEISE`,
  `lautKorb`, `ORDNEN_LAUT`, `STILL_ORT`, `SCHLIMMER_PAARE`, `andereKoerbe`, `ANTWORT`, `mitArtikel` (Aufgaben unverändert:
  je Stufe 400 bis 500 Aufgaben mit festen Startwerten vorher und nachher byte-gleich). Prüfstand und Fingerabdrücke
  unverändert.
- **Prüfung je Eintrag, MI, Musik und die letzten (LP5 a, LERN-51, T4 a):** `pruefung.js` für Instrumenten-Kenner
  (sechs Listen), Geheimschrift-Knacker, Datei-Typen, Tageslauf-Sonne und Königs-Falle — damit hat jedes Spiel mit
  eigenen Listen eine Prüfansicht. Geheimschrift zeigt alle 25 Geheimwörter je Wort (zur Prüfung auf Anstössiges),
  Königs-Falle das Brett mit dem Lösungszug und die Prüfung der Regel-Maschine (genau ein Mattzug). Im Spiel neu:
  Instrumente `instrumentVon`, `NIMMT`, `genauerPaar`, `STUFE_ARTEN`; Tageslauf-Sonne `taetigkeitVon`, `zuordnenIn`;
  Geheimschrift `langGenug`, `passtInStufe`; Datei-Typen `vorratFuer`; Königs-Falle unverändert (Aufgaben unverändert:
  je Stufe 400 Aufgaben mit festen Startwerten vorher und nachher byte-gleich). Prüfstand und Fingerabdrücke unverändert.
- **Geheimschrift-Knacker: gesperrte Schlüssel (GK1 a):** Neun Paare aus Wort und Schlüssel ergaben anstössige
  Geheimwörter (PUZZLE 19 INSSEX, MAUS/HAUS/PAUSE 6 mit GAY, TOMATE 20 NIGUNY, KARTE 13 XNEGR, BLUME 8 JTCUM, APFEL 5
  FUKJQ, ZWERG 6 FCKXM; Suche nach 118 Teilwörtern, Deutsch und Englisch, über alle 88 Wörter und Schlüssel 1–25). Neu
  `GEHEIM_SPERRE` in `woerter.js`; das Spiel (`gesperrt`) verschlüsselt diese Wörter nie mit diesen Schlüsseln und zeigt
  die Verschiebung auch in keinem Hinweis zu einer falschen Antwort beim Knacken; `pruefeAufgabe` meldet beides. Die
  Wörter bleiben. Prüfansicht: ⛔ bei gesperrten Geheimwörtern, neuer Abschnitt „Gesperrte Schlüssel“ (Fingerabdruck der
  Liste dadurch neu, Prüfstand ohne Fingerabdruck unverändert). Je Stufe 20 000 Startwerte mit und ohne Sperre: geändert
  nur Aufgaben mit gesperrtem Paar (Stufe 3: 61, 4: 186, 5: 324, 6: 80), mit Sperre keine mehr. Bewusst nicht gesperrt
  (GK2 a): kurze Zufallstreffer in sonst sinnlosen Geheimwörtern — KZ (13, etwa KZXVI), POO (TPOOF), TIT (GPZTIT).
- **Inhaltliche Befunde der Prüfansichten gesammelt:** `docs/eulenpfad/pruefung/befunde_LERN_Session38.md` — was die
  Agenten beim Bau der Prüfansichten von NMG Block 2 und 3, MI, Musik und den letzten Spielen fachlich gemeldet haben
  (13 Berichte, nichts geändert, Sachangaben ohne Netzabruf). Gleich behoben: Plan-Leser (plan-leser) Stufentext nennt
  den Massstab je Plan aus `PLAN_MASSSTAB` („1 Feld = 1 m im Schulzimmer, 10 m im Quartier“, vorher fest 10 m auch im
  Schulzimmer); Wassertropfen-Reise (wassertropfen-reise) Kommentar zu den Spielstufen der Fragen in `woerter.js`.
- **Befunde abgearbeitet, Durchgang 1 (BF1 a):** je Sachangabe belegt (Quellen in der Befund-Datei).
  Instrumenten-Kenner (instrumente): Feld `auch` — Geige und Cello zupfen (Pizzicato), Glocke schütteln, Klavier
  schlagen stehen nie als falsche Spielweise daneben, `pruefeAufgabe` meldet es, Prüfansicht mit Spalte „auch
  richtig“; „die Pianistin oder der Pianist“; „das Plektrum“, „der Notenständer“. Wassertropfen-Reise
  (wassertropfen-reise): 🫖 statt ♨️ (Wasserdampf ist unsichtbar), 🧊 statt 🌨️ beim Hagel, Tipp zum Grundwasser ohne
  „Grund“, Ablenker „Salz“ statt „Wolken“. Lärm-Wächter (laerm-waechter): Feld `knall` (Knallkörper, Startpistole,
  Ballon; ein naher Knall kann sofort schaden) — nie das harmlosere bei „Was ist schlimmer?“; Schutzmittel, die
  ebenfalls helfen, nie als falscher Korb (zehn Situationen); Tipp „Was schwingt?“ mit Blatt Papier; Dämmungsfrage
  nach dem Hall im Übungsraum. Prüfliste `wortlisten_zur_pruefung.md` neu erzeugt.
- **Bilder, die die Lösung verraten (BI1 a, IK2 a, WT1 a):** Instrumenten-Kenner (instrumente): Körbe mit eigenen
  Zeichnungen in `bilder.js` (saiten, taste, rohrblatt, mundstueck, bogen; dazu 🥢, 💨, 🤏), die zeigen, wie der Ton
  entsteht — nie ein Instrument einer Karte (vorher Trompete 🎺 → Korb 🎺 Blechblasinstrument); Klavier in Stufe 3 nur
  neben Körben, die sicher falsch sind (`auchGruppe`, `gruppenKoerbe`; Saiten und Hämmer im Hinweis). Wassertropfen-Reise
  (wassertropfen-reise): Station Wasserdampf als Zeichnung `wasserdampf` (gestrichelte Pfeile über dem Wasser) statt ♨️;
  im Satz nur der Name (`LS.mitBildText`). Neue Prüfung „Bild verrät“ in `tools/pruefe_spiele.js` (die richtige Antwort
  trägt als einzige ein Bild der Aufgabe beim Stellen), dafür geben die Haken „gestellt“ und „richtig“ die Fläche mit
  (spiel.js). Zählung mit verkürztem Lauf über alle Spiele: 25 Funde in zehn weiteren Spielen, in der Befund-Datei, noch
  nicht behoben — `pruefe_spiele.js` meldet sie dort als Fehler.
- **„Bild verrät“ behoben, Durchgang 1 (BI1 a):** Schwimmt oder sinkt (schwimmt-sinkt): Materialkörbe als Proben
  (`bilder.js`: stoffHolz, stoffMetall, stoffGlas mit Ball dahinter, stoffKunststoff, stoffPapier) statt Gegenständen
  der Karten. Znüni-Teller (znueni-teller): Gruppenkörbe 🚰 Getränke, 🌳 Früchte, 🌱 Gemüse, 🌾 Brot/Teigwaren/Kartoffeln,
  🐄 Milch/Ei/Fisch/Fleisch, 🧁 Süsses und Salziges — kein Bild eines Lebensmittels. Kulturen-Koffer (kulturen-koffer):
  🛖 Pfahlbauer, Anch (`bilder.js`, anch) für Altes Ägypten, Quellenarten ⛏️ Fundstück, 🏚️ Bauwerk, 🖋️ Text, Körbe
  ⏳ Früher und 🆕 Heute (der volle Lauf fand dort Amphore 🏺 und Handy 📱, die die verkürzte Zählung nicht traf).
- **„Bild verrät“ behoben, Durchgang 2 (BI1 a):** Gefühle-Radar (gefuehle-radar): das grosse Gesicht ist nie das Bild
  des Antwortknopfs, sondern ein anderes Gesicht desselben Gefühls (`andereGesichter`, `pruefeAufgabe` meldet es).
  Kakao-Weg (kakao-weg): Körbe 🛠️ Fabrik, 🛣️ Transport, 🗄️ Grossverteiler, 🏷️ Laden; Schritte mit dem Bild ihres
  Produkts bekommen ein eigenes (Schoggi ⚙️, Milch abfüllen 📦, Saftpresse 🗜️). Zeitstrahl-Sortierer
  (zeitstrahl-sortierer): Merkmale 🛡️ Ritter und ⚙️ Fabriken statt der Bilder ihrer Zeitalter, 1803 🗺️ statt 🏛️.
  Datei-Typen (datei-typen): Körbe 🌄 Bild, 🔊 Ton. Geschichten-Ordner (geschichten-ordner): 🔖 vor dem Titel.
  Lebensraum (lebensraum): Körbe als gezeichnete Landschaften (`bilder.js`: lrWald, lrWiese, lrWeiher, lrGebirge).
  Prüfung „Bild verrät“: Emojis je Schriftzeichen (Graphem), 👩‍🏫 zählt nicht mehr als 🏫 (Scheinfund im
  Gemeinde-Helfer).
- **Befunde abgearbeitet, Durchgang 3 (BF1 a, Belege in der Befund-Datei):** Erdzeit-Leiter (erdzeit-leiter): „nur ihre
  Nachfahren, die Vögel, überleben“, „Frühmenschen machen Werkzeuge aus Stein“, „Gletscher bedecken das Mittelland und
  grosse Teile der Schweiz“, Fischsaurier als Zeichnung (`bilder.js`, fischsaurier) statt 🐬, Zeitalter-Körbe 🧫 🦂 🦎
  statt der Ereignisbilder. Zeitstrahl-Sortierer (zeitstrahl-sortierer): „Die erste Bahnlinie ganz in der Schweiz führt
  von Zürich nach Baden“. Stromkreis-Bauer (stromkreis-bauer): Hinweis zum Korb mit Graphit, `AUCH_GRUND` (gleicher Pol
  → nie „Draht nicht angeschlossen“ als falsche Antwort, `pruefeAufgabe` meldet es), Tipp zum Kurzschluss genauer.
  Energie-Wandler (energie-wandler): `auch` für Flusskraftwerk, Sonnenkollektor und Elektroherd.
- **Befunde abgearbeitet, Durchgang 4 (BF1 a):** Schulweg-Profi (schulweg-profi): „Das verlangen die Verkehrsregeln.“
  (VRV Art. 46 Abs. 1, nicht das Gesetz), 🚲 statt 🔴 beim Rücklicht. Echt oder erfunden? (echt-oder-erfunden): Korb
  💭 statt 🦄, Einhorn-Aussage mit 🐴, `MERKMAL_AUCH` für zaubern und „kann, was kein Mensch kann“, „erfundenes Wesen“
  statt „Fabelwesen“, Fabeln vom Eichhörnchen (Tiere sprechen) und vom Spatz („Lehre:“), Zahnfee ersetzt durch einen
  kleinen Drachen (EO1 a: ob die Zahnfee erfunden ist, entscheidet die Familie).
- **Prüfansicht: geprüfte Liste gleich als geprüft gezeigt (Hinweis Patrik, Kern 1.44.0):** Eine ganz abgehakte Liste
  stand im Prüfstand (`pruefstand.js`), die Entwickler-Leiste im Spiel zeigte sie aber erst nach dem Neuladen als ✓, weil
  sie nach dem Schliessen der Prüfansicht nicht neu zeichnete. Kern `listenpruefung.js`: `oeffne(defs, id, liste,
  nachher)` ruft `nachher()` nach dem Schliessen, wenn auch das letzte Speichern fertig ist (Speichern als Kette);
  Eulenpfad: `LS.listenPruefen(spiel, liste, nachher)`, die Leiste gibt ihr `zeichne` mit. Kern verteilt, Test in
  `pruefe_kern.js` (nachher erst nach dem Speichern). Dazu Patriks Prüfvermerke: Schwimmt oder sinkt, Listen
  eigenschaften und schwimmen-sinken.
- **Prüfansicht: schon Geprüftes erkennen (ÜB1 a, Kern 1.45.0):** Haken tragen Fingerabdrücke von Zeile und Zellen (nie
  den Wortlaut). Zellen, die dieselbe Person schon anderswo abgehakt hat, stehen grau; eine genau gleiche Zeile (gleiche
  Spalten, Prüffrage, Zellen, Bild) gilt als geprüft („✓ übernommen“). Bekannte Zellen allein haken nicht ab. Kern
  `listenpruefung.js` (`inhaltVon`, `opt.lokal.alle`), Entwickler-Server und `entwicklung_abgleich.py` speichern `zeile`
  und `zellen` (geprüft, Ungültiges fällt weg), Eulenpfad und Lernsteig binden die lokalen Haken aller Listen an, Stil
  `pruef-bekannt` in beiden Apps. Neu `tools/haken_nachtragen.js`: 252 bisherige Haken nachgetragen. Tests in
  `pruefe_kern.js` und `pruefe_server.py`. ÜB2 a: Zeilen aus lauter bekannten Zellen werden nicht übernommen, nur grau
  — eine Zeile sagt etwas über den Zusammenhang ihrer Zellen (über alle Spiele 1089 solche Zeilen).
- **Prüfansicht: zugeklappte Gruppen (Hinweis Patrik, Kern 1.45.1):** Ganz geprüfte Gruppen sind beim Öffnen zu (LP1 a),
  ohne Pfeil war aber nicht zu sehen, dass man sie aufklappen kann, und „↺ alle aufheben“ liess sie zu. Jetzt ein Pfeil
  ▸/▾ vor jeder Gruppe (Stile beider Apps), und „alle aufheben“ klappt die Gruppe samt Untergruppen auf.
- **„🔍 Inhalte prüfen“ auf dem Startblatt (DP1 a):** im Entwickler-Modus weggelassen — die Listen stehen in der
  Entwickler-Leiste, auf jeder Seite des Spiels; für Aufsicht und Lehrperson kleine Knöpfe nebeneinander statt der
  grossen Spielknöpfe (`.pruef-zeile` in stil.css). `?pruefen=<liste>` öffnet die Liste in beiden Rollen.
- **Abschluss:** Report `docs/eulenpfad/report/LERN_Session38_2026-11-13.md`, Handover nachgeführt (Haltepunkt
  aufgelöst, LERN-51 erledigt). Wetter und Jahreszeiten
  (wetter-jahreszeiten): 🌅, Korb Herbst 🍄, 🌿, kahler Laubbaum als Zeichnung (`bilder.js`, baumKahl), 🩱 Badekleid;
  bilder.js eingebunden.

## 2026-11-13 — LERN_Session39

- **Befunde aus den Prüfansichten (BF1 a), Durchgang 5** (Befund-Datei `docs/eulenpfad/pruefung/befunde_LERN_Session38.md`):
  - Datei-Typen (datei-typen): Feld `nieNeben` — .gif steht nie als falsche Antwort neben der gesuchten Video-Datei, und
    ihre Namen dienen bei Videos nicht als Falle (`pruefeAufgabe` meldet beides); die Prüfansicht zeigt es.
  - Blutkreislauf-Lotse (blutkreislauf-lotse): eigene Tipps für „Wie viele Lungenflügel?“ (Thema atmen) und die
    Haargefässe (Thema gefaesse, 🔬); die dicke Wand der linken Kammer mit dem höheren Druck erklärt statt mit dem
    längeren Weg.
  - Bionik-Paare (bionik-paare): Gruppe „widerstand“ für Haifischhaut und Eisvogel, Gecko „(in Entwicklung)“, Termiten
    ohne das Kaminmodell; Ahornsamen, Wabenplatte und Wand mit Klappen gezeichnet (`bilder.js`: ahornSamen,
    wabenplatte, klappenWand; BI1 a), bilder.js eingebunden. Paar Riesenseerose und Kristallpalast gestrichen (BK1 a:
    nur populäre Quellen, kein Primärbeleg; wie die übrigen unsicheren Geschichten im Dateikopf).
  - Gemeinde-Helfer (gemeinde-helfer): Feld `auch` (Einrichtung oder Stelle, die ebenfalls passt, nie als Korb oder zur
    Wahl): Schule beim Schwimmen, Werkhof beim Sperrgut, Schulleitung beim Ärgern; Sofa statt Kühlschrank (den nimmt
    auch der Handel zurück), Glasflaschen statt Flaschen (PET nimmt jede Verkaufsstelle zurück); Tipp „öffentlich“
    ohne „bezahlt die Gemeinde mit den Steuern“.
  - Kulturen-Koffer (kulturen-koffer): Tonkrug als Ding entfernt (kam in keiner Stufe vor); `auch` bei Webgewicht,
    Mahlstein, Soldatenhelm und Segelboot ergänzt; China „erfanden das Papier“ (der Kompass mit Nadel ist jünger),
    Kompass und Schriftzeichen genauer; Cäsar über die Helvetier; Bauwerk schliesst Denkmäler ein (Sphinx); Rätsel der
    Griechen vom Allgemeinen zum Konkreten; Flechtwerk, Mosaik und Dorf am Seeufer gezeichnet (flechtwand, mosaik,
    seeuferDorf).
- **Prüfansicht: Zeichnungen mit Grossbuchstaben (Fehler):** `LS.zelleMitBildern` erkannte nur `svg:[a-z0-9-]+` — Namen
  wie `baumKahl`, `stoffHolz`, `lrWald` erschienen in der Prüfansicht als ❔. Jetzt `LS.ZEICHNUNG_IM_TEXT`;
  `tools/pruefe_pruefansicht.js` prüft jede Zeichnung in den Zellen gegen die Bildersammlung.
- **Befunde, Durchgang 6:**
  - Stromkreis-Bauer (stromkreis-bauer): Bei „Warum brennt die Lampe nicht?“ kommen als falsche Gründe zuerst die, deren
    Teil im Bild vorkommt — kein offener Schalter ohne Schalter, kein Gegenstand ohne Lücke, kein Kurzschluss ohne orangen
    Draht, solange es andere gibt (`falscheGruende`, `pruefeAufgabe` meldet es).
  - Energie-Wandler (energie-wandler): Föhn, Staubsauger, Bohrmaschine, Generator und Velobremse gezeichnet (`bilder.js`;
    vorher 💇, 🧹, 🪛, ⚙️, 🛑), bilder.js eingebunden.
  - Lärm-Wächter (laerm-waechter): Gehörschutz, Ohrstöpsel, Vorhang, Fliesen, Teppich und Kissen gezeichnet, Staubsauger
    und Föhn wie im Energie-Wandler, Pause in der Stille 🧘; Lösungstexte über `LS.mitBildText`, bilder.js eingebunden.
    Skala unverändert (Stufe 3 kommt nur beim Ordnen zwischen 1 und 5 vor).
  - Kakao-Weg (kakao-weg): Papier aus Altpapier statt aus dem Schweizer Wald (KW1 a; BAFU: 90 % der Faserstoffe aus
    Altpapier) — Rohstoff Altpapier, erster Schritt „Wir bündeln Altpapier für die Papiersammlung.“, Auflösen statt
    Zerfasern; damit fällt auch „Forstwarte → Landwirtschaft“ weg.
- **Befunde, Durchgang 7:**
  - Plan-Leser (plan-leser): Garderobe mit einem Haken statt des Kreuzes (das Kreuz ist im Quartier die Kirche), Spital
    „H“, Bushaltestelle ein Rechteck; in der Legende ein Feld wie auf dem Plan neben „1 Feld = … m“ statt eines festen
    Balkens, der nicht so lang war wie ein Feld.
  - Pflanzen-Bestimmer (pflanzen-bestimmer): Maiglöckchen mit hängenden Glöckchen (`form: "glocken"`) statt des Sterns
    wie beim Bärlauch; Prüfansicht ohne „einheimisch“.
  - Taschengeld-Planer (taschengeld-planer): Radiergummi, Kaugummi, Sammelbilder, Comic-Heft, Velolicht, Busbillett und
    Sonnenhut gezeichnet (`bilder.js`), auch mitten im Text; bilder.js eingebunden.
  - Tageslauf-Sonne (tageslauf-sonne): „In der Pause am Morgen isst du das Znüni.“ statt „Im Kindergarten …“.
  - Erdzeit-Leiter: „2 500 000“ bleibt (ganze Zahlen ab der 4. Klasse).
- **Entscheide PL1 a, TG1 a, TG2 a, TG3 a:**
  - Plan-Leser (plan-leser): Massstab so, dass der Plan so gross ist wie das, was er zeigt — Schulzimmer überall
    1 Feld = 2 m (12 m), Quartier 50 m (Stufe 3), 50/100 m (4), 100/200 m (5), 50/100 m (6); vorher 1 m und 10 m.
  - Taschengeld-Planer (taschengeld-planer): „Blumen als Geschenk“ statt „Blumen für Mama“; Sparziel nie Bedarf (Velohelm,
    Turnschuhe …); Packgrössen je Ware statt 5, 6 oder 10 für alle (Feld Pack in woerter.js, Annahmen ZU PRÜFEN), die
    Prüfansicht zeigt sie, `pruefeAufgabe` meldet andere.
- **Befunde, Durchgang 8 (letzter):**
  - Kulturen-Koffer (kulturen-koffer): Quelle zum Alten China „Reste einer Mauer aus gestampfter Erde …“ statt eines
    Stücks der heutigen Grossen Mauer (grösstenteils Ming-Zeit); Feld `auch` bei den Quellen, die bemalte Vase hat
    „Fundstück“ nicht zur Wahl; Prüfansicht mit Spalte „passt auch“.
  - Königs-Falle (koenig-falle): Hinweis bei Kg7 „nicht am Rand“ statt „mitten auf dem Brett“.
  - Damit sind alle Befunde aus den Prüfansichten bearbeitet (Befund-Datei, Stand-Tabelle).
- **Voller Eulenpfad-Lauf auf `5cc948b`** (1840 s, 1014 Kombinationen Spiel × Stufe): ein Fund, „Bild verrät“ im
  Hello-Dialog (hello-dialog), Stufe 1 — die Antworten „Good morning!“ und „Good night!“ trugen 🌞 und 🌙 wie zwei
  Situationen; jetzt 🐓 und 😴. Danach Hello-Dialog einzeln „Keine Fehler.“, alle übrigen Spiele im vollen Lauf ohne
  Fehler.
- **Abschluss:** Report `docs/eulenpfad/report/LERN_Session39_2026-11-13.md`, Handover nachgeführt (alle Befunde der
  Prüfansichten bearbeitet, voller Lauf auf `5cc948b`, nächster Schritt Push).

## 2026-11-13 — LERN_Session40
- **Prüfansicht nach Kern 1.45 angesehen** (hell und dunkel, 1024 und 375 px, Schwimmt oder sinkt?): schon geprüfte
  Zellen standen nicht grau — `stil.css` nahm `var(--leise)`, das es im Eulenpfad nicht gibt (dort `--text-leise`);
  ebenso der Pfeil ▸/▾ vor den Gruppen. Beide auf `--text-leise`; sonst keine undefinierte Farbe in Eulenpfad, Lernsteig,
  Gratwanderung.
- **Haken ohne Fingerabdruck nachgetragen:** 192 Haken vom 13.11. (Energie-Wandler, Wassertropfen-Reise, Znüni-Teller)
  trugen nur `am` und `von` — vermutlich lief der Entwickler-Server noch mit dem Stand vor Kern 1.45 und verwarf die
  Fingerabdrücke still. Mit `tools/haken_nachtragen.js` ergänzt (alle 444 Haken jetzt mit Fingerabdruck). Im Lernsteig
  gibt es keine Haken je Eintrag (`pruefstand-eintraege.json` leer), dort ist nichts nachzutragen.
- **Neue Prüfung, Punkt 10 in `tools/pruefe_skripte.js`:** jede CSS-Variable ohne Ersatzwert muss gesetzt sein, wo sie
  gilt — eine Datei nutzt nur, was eine der Seiten setzt, die sie laden (selbst oder in einer ihrer Dateien), eine Seite
  in ihren eigenen Stilen nur, was für sie gesetzt ist; nachgeladene Skripte gehören zu den Seiten ihres Ordners. Je App
  allein hätte nicht gereicht: `eulenpfad/anleitung/anleitung.css` setzt `--leise` auch, aber keine Seite lädt es mit
  `stil.css`. Elf Gegenproben; gegen `stil.css` aus `5c953d4` meldet sie den Fehler von oben, heute keinen.
- **Sudoku-Familie (LERN-56, SU1 a–SU3 a aus LERN_Session13), Baustein und erstes Spiel:**
  - Baustein `spiele/gemeinsam/sudoku.js` und `sudoku.css` (rahmen.md 26): Raster mit beliebigen Gebieten, Löser durch
    Probieren (zählt die Lösungen), menschlicher Löser mit den Schritten „einer“ und „versteckt“, Generator (nur Rätsel,
    die sich mit den Schritten der Stufe lösen lassen; unter 1 ms je 9 × 9), Bedienung mit ✏️-Notizen, ⌫, „✓ Fertig“.
    Fehler nach SU3 a: Widerspruch sofort (Feld wackelt, Eule sagt wo, ein Fehler), falsch ohne Widerspruch erst bei
    „✓ Fertig“ (Felder leuchten). Drei Tipps, der erste mit ✏️ (Zusatz Patrik), der dritte zeigt ein Feld.
  - Neues Spiel **Zahlen-Sudoku (zahlen-sudoku)**, Basisklasse 4, neu und ungeprüft: 4 × 4 mit 6 und 10 leeren Feldern,
    6 × 6 mit 18 und 24, 9 × 9 mit 45 und 54; Knifflig und Königsstufe brauchen den Schritt „versteckt“. Endlos in allen
    Stufen, Abschluss-Animation (Bild `sudoku` in `feier.js`).
  - Neues Thema „🧠 Logikrätsel“ (SU2 a); Lernziel als Annahme MA.1.B.1.f und .h (Wortlaut aus strategie_raetsel.md),
    `docs/eulenpfad/lernziele/lehrplan_sg_session40.md`; Ideenliste weiterer Logikrätsel
    `docs/eulenpfad/spielideen/logikraetsel.md` (Zusatz Patrik zu SU2 a).
  - Rahmen: `def.anzahl` auch je Stufe (`{ s1: 3, …, s6: 1 }`), ein 9 × 9 ist allein eine Runde.
  - **Entscheid ZM1 b:** Sudoku nicht im Zufallsmix — Katalogfeld `mix: false`, `mix.js` nimmt solche Spiele nie
    (auch nicht im Übertritts-Check), das Testskript lässt sie im Mix aus (rahmen.md 9). Grund: eine Aufgabe ist ein
    ganzes Rätsel (90 s bis 15 min), die übrigen Spiele brauchen in Stufe 3 im Median 20 s.
  - Neues Spiel **Bilder-Sudoku (bilder-sudoku)**, Basisklasse 1 (Stufe 1 Kindergarten), neu und ungeprüft: 4 × 4 mit
    🐶 🐱 🐰 🐸, Stufen über die leeren Felder (3, 5, 7, 9, 11, 12; ein 4 × 4 braucht bis 12 leere Felder nie mehr als
    „in dieses Feld passt nur ein Tier“, gemessen), 4 bis 2 Rätsel je Runde, Endlos in allen Stufen, nicht im Mix,
    Abschluss-Animation mit den Tieren. Baustein dafür um `nennung`, eigene `tipps`, `notizText` und grosse Bildknöpfe
    erweitert (rahmen.md 26); Zahlen-Sudoku unverändert (gleiche Klickzahlen im Spieltest).
  - Neues Spiel **Gebiets-Sudoku (gebiets-sudoku)**, Basisklasse 4, neu und ungeprüft (Zusatz Patrik zu SU1 a: Zeilen
    und Spalten bleiben, die Kästen werden unregelmässige Gebiete, keins ein Rechteck): 4 × 4, 5 × 5, 6 × 6 (zweimal),
    9 × 9 (zweimal), Knifflig und Königsstufe mit „versteckt“; Gebiete leicht gefärbt, Nachbarn verschieden; Endlos, nicht
    im Mix, Abschluss-Animation mit den Gebieten. Baustein: `gebieteZufall` (Gebiete zu einer gegebenen Lösung, Tausch nur
    gleicher Zahlen), `gebieteMaengel`, `startGebiete`, `erzeuge` mit `loesung`, `fuelle` mit Schrittgrenze. Kein 7 × 7:
    dort blieb fast immer ein Gebiet ein Rechteck, die Prüfung liefe aus (logikraetsel.md).
  - Neues Spiel **Vergleichs-Sudoku (vergleichs-sudoku)**, Basisklasse 3, neu und ungeprüft: < und > an jeder Kante im
    Kasten statt vieler Vorgaben; 4 × 4 (10 und 12 leer), 6 × 6 (26, 30 leer, 36 ohne eine Zahl), 9 × 9 mit neun Zahlen.
    Lernziele MA.1.A.1 (vergleichen) und MA.1.B.1 (Annahme). Endlos, nicht im Mix, Abschluss-Animation mit den Zeichen.
    Baustein: Zeichen im Raster (`vergleicheAus`), in beiden Lösern, als Widerspruch beim Eintragen, Schritte
    „vergleich“ und „kette“; die anderen drei Sudoku-Spiele unverändert (gleiche Klickzahlen).
- **Schneller laden, Entscheid LZ1 a (Frage Patrik: „kann das Laden der Seite optimiert werden? lazyload?“):** gemessen in
  Chrome ohne Fenster mit vierfach gedrosselter CPU (wie ein Tablet). Die Dateien laden in 20 bis 40 ms, die Zeit steckt
  danach im Layout und Zeichnen der Startseite, vor allem in den gezeichneten Rahmen aller Karten. Neu zeichnet
  `spiel.js` (STIL) einen Rahmen erst, wenn das Element ins Bild kommt, und `start.css` gibt den Themenblöcken
  `content-visibility: auto`. Tab Spiele bedienbar nach 1,2 bis 2,4 s statt 1,8 bis 4,3 s (Stil „glatt“ 1,0 bis 1,4 s);
  nach dem Rollen haben alle Karten im Bild ihren Rahmen, am Blockrand ist nichts abgeschnitten (hell, dunkel, 1024 und
  375 px).
- **feier.js erst bei Bedarf (LZ1 a, Punkt 3, nach erneuter Vorlage a):** die 173 Spielseiten binden feier.js nicht mehr
  ein; `spiel.js` lädt es im Leerlauf nach dem Aufbau (`ladeFeier`), das Schlussbild wartet mit einem Platz
  (`.feier-platz`), ohne Datei Konfetti; die Vorschau `?feier=` wartet; `schweiz-karte/orte.js` stellt die Kartendaten in
  `globalThis.FEIER_KARTEN_DATEN` bereit (nur mit karte.js davor), feier.js liest sie dort. `tools/listen_fingerabdruck.js`
  (`skripte`) reiht feier.js auf Spielseiten nach spiel.js ein — dieselbe Folge wie vorher auf allen 172 Seiten (geprüft
  an HEAD). Zahlenmauer gedrosselt bedienbar nach 67 bis 145 ms statt 89 bis 534 ms. Im Browser geprüft: feier.js ab
  172 ms nach dem Aufbau (49 ms), Schlussbild mit Animation, ohne feier.js Konfetti, Vorschau der Schweiz-Karte mit Karte.
- **Käfig-Sudoku (kaefig-sudoku)**, Basisklasse 5, neu und ungeprüft (LERN-56, SU1 a): Käfige mit Ergebnis, Stufe 1–4
  nur Plus, Stufe 5–6 auch −, ×, :; 4 × 4 (12 leer, ohne Zahlen) und 6 × 6 (28, 32 leer, Königsstufe ohne Zahlen); kein
  9 × 9 (33 bis 131 ms je Rätsel, Runde weit über eine Viertelstunde; Entscheid KK1 a). Lernziele MA.1.A.3 und MA.1.B.1
  (Annahme). Endlos, nicht im Mix, Abschluss-Animation mit Käfigrändern. Baustein: `kaefigeAus`, Kombis je Käfig,
  Schritt „kaefig“, Widersprüche im Käfig, Ränder und Ergebnis im Raster; `mitTechnikLoesen` setzt je Durchgang alle
  Felder mit nur einer Zahl (gleiches Ergebnis, schneller).
- **Abschluss:** Report `docs/eulenpfad/report/LERN_Session40_2026-11-13.md`, Handover nachgeführt (Haltepunkt der Nacht
  aufgelöst; Sudoku-Familie bis auf das Duell, LZ1 a, Prüfung Punkt 10; nächster Schritt Sudoku-Duell und Push).

## 2026-11-14 — LERN_Session41
- **Sudoku-Duell (sudoku-duell)**, Basisklasse 5, Thema Strategie, neu und ungeprüft — letztes Spiel der Sudoku-Familie
  (LERN-56 erledigt). Entscheid **DU1 a**: abwechselnd eine Zahl in ein leeres Feld, die in Zeile, Spalte und Kasten noch
  nicht steht; wer keine Zahl mehr setzen kann, verliert (müsste jede Zahl zur Lösung passen, stünde der Sieger vor dem
  ersten Zug fest). Entscheid **DU2 a**: Königsstufe halb lange Endspiele auf dem 6 × 6, halb „wer die letzte Zahl setzt,
  verliert“. Jede Aufgabe ist eine Endspiel-Stellung (S1 a): s1–s3 4 × 4 (Gewinn mit einem Zug, zwei Züge voraus, mehr
  leere Felder), s4–s6 6 × 6. Ein unerlaubter Zug ist ein Hinweis, ein schlechter zeigt die Gewinnantwort der Eule im
  Raster; der zweite Tipp markiert gesperrte Felder mit ✖. Endlos in allen Stufen, im Zufallsmix, Regelseite,
  Abschluss-Animation `duell` (Züge beider Seiten, dann ✖). Lernziel MI.2.2.
- **Baustein `sudoku.js`:** Regel-Maschine des Duells — `duellZuege`, `gesperrt`, `duellGewinnt` (vollständige Suche mit
  Bitmasken und Speicher), `duellGewinnzuege`, `duellStellung`; die übrigen Funktionen unverändert. `pruefeAufgabe` im
  Spiel rechnet die Gewinnzüge mit einer eigenen Suche nach (in 600 Probe-Aufgaben gleich, s6 im Mittel 4 ms).
- **sudoku.css:** `--sd-extra` für weitere Zeilen über dem Raster (Standard 0, die anderen Sudokus unverändert); Farben
  `sd-eule` und `sd-gesperrt`. **feier.js:** Raster der Sudoku-Bilder in `sudokuRaster` ausgelagert, neues Bild `duell`.
- Doku: rahmen.md 26 (Duell), logikraetsel.md (Regel und Messungen), lehrplan_sg_session11.md (Strategie-Tabelle).
- **Suche im Tab Spiele ohne Wartezeit (Hinweis Patrik: „bei der Eingabe vom ersten Buchstaben geht es schon sekunden,
  bis eine reaktion erfolgt“):** Jede Eingabe baute die ganze Startseite neu auf, bevor der Buchstabe gezeichnet wurde.
  Gemessen in Chrome ohne Fenster, CPU vierfach gedrosselt, 1024 px: erster Buchstabe 500–620 ms bis zum Bild, danach
  um 100 ms, Löschen auf einen Buchstaben oder leer 400–600 ms. **Kern 1.46.0** (`uebersicht.js`, `suche().feld`):
  `neu()` erst nach dem nächsten Bild und einmal für mehrere schnelle Eingaben — gilt auch für die Suche in der
  Freigabe (Verwaltung) und im Lernsteig. **Tab Spiele** (`start/spiele.js`): Was von der Suche abhängt, zeichnet
  `zeichneAuswahl()` in einen eigenen Behälter (`.spiele-auswahl`, `display: contents`); die Suche zeichnet nur ihn und
  die Zeile „Ansicht“ im Filter neu, das Feld bleibt. Danach: Buchstabe nach 56–88 ms (erster) bzw. 16–40 ms; die Liste
  folgt nach 175–300 ms (erster Buchstabe, leer) bzw. 55–150 ms. Test `tools/eulenpfad_seiten.js`: `__fuelle` setzt
  erst den Fokus wie beim Tippen; geprüft wird, dass die Liste erst nach dem Bild kommt und dasselbe Feld den Fokus behält.
- **Suche leeren ohne Neubau:** Die Ansicht ohne Suche (Gruppen oder flache Liste) bleibt während einer Suche aufbewahrt
  und kommt beim Leeren zurück (`ohneSuche` in `start/spiele.js`); zugeklappte Gruppen bleiben zu. Ein Kartenschalter
  während der Suche verwirft sie, ein Stern ohne Suche nimmt das neue Favoriten-Feld mit. Gedrosselt 4×, 1024 px:
  Leeren 132–152 statt 327–366 ms. Geprüft auch: Stern auf einem Treffer, dann leeren — Favorit oben, beide Sterne an.
  Verworfen nach Messung: Karten aus einem Vorrat wiederverwenden (erster Buchstabe 145 statt 157 ms Skript, sonst im
  Rauschen). **Behoben:** Seit dem Umbau zur Suche las langes Drücken nur noch in der Auswahl vor, nicht auf Fach-Reitern,
  Suche und Filter — `LS.langDruecken` bekommt wieder den ganzen Tab.
- **Entscheid KV1 a — Karten in Listen ohne Gruppen erst beim Rollen layouten:** `.spiele-auswahl > .spiele .spielkarte`
  mit `content-visibility: auto` (wie die Themenblöcke, LZ1 a) für Treffer der Suche, ähnliche Spiele und flache
  Sortierung. Gedrosselt 4×, 1024 px: erster Buchstabe 269–365 statt 403–439 ms, Löschen auf einen Buchstaben 247–297
  statt 324–397 ms. Die Erklärung eines Lernziel-Kürzels (Aufsicht) ragte dabei bis 130 px rechts über die Karte und
  wäre abgeschnitten worden (gerechnet über alle 187 Kürzel); sie hängt jetzt an der Zeile `.marken` statt am Kürzel und
  ist nie breiter als sie — über alle Kürzel mindestens 32 px (1024 px) bzw. 56 px (375 px) innerhalb der Karte. Im Stil
  „hand“ hell und dunkel, 1024 und 375 px, mit Rahmen und Erklärung angesehen.
- **Entscheid TM1 a — Tastenmarke bekommt Platz, wo sie auf Inhalt läge:** `ktPlatz` in `spiel.js` misst nach dem
  Beschriften, beim Erscheinen der Marken und bei jeder Grössenänderung (ResizeObserver), ob die Marke auf Text oder Bild
  des Knopfs läge (gemessen ohne den Abstand, 3 px Spiel für Bildzeichen), und setzt dann `marke-platz` (`stil.css`:
  oben 27 px). Anlass Plan-Leser Stufe 5 („S“ auf „geradeaus,“); gemessen über alle Spiele, sechs Stufen, 1024 und
  1366 px (2100 Seiten, je dieselbe Aufgabe mit und ohne): Marke auf Inhalt 905 Knöpfe in 74 Spielen → 132 Berührungen
  ohne verdeckten Buchstaben in 19 Spielen; neu unten über den Rand 21 Seiten in 9 Spielen, höchstens 46 px — die
  Aufgabe selbst nur in Rhythmus-Leser und Stromkreis-Bauer, die schon vorher bis 93 px überliefen. Verworfen nach
  Messung: Marke über dem Rand (186 Marken auf fremdem Inhalt), Abstand links und rechts (613 Knöpfe weiter verdeckt),
  Abstand oben an jedem Knopf (74 statt 26 Seiten über den Rand). Stichprobe Eulenpfad: plan-leser gegenteil-wippe
  stellen-detektiv au-cafe rhythmus-diktat „Keine Fehler.“; rahmen.md 19.
- **Plan-Leser (plan-leser), Bemerkung 54 (Patrik):** Nach dem Tippen verdeckte die grüne (richtig) bzw. orange
  (daneben) Fläche das Zeichen im Feld — die Tippfelder lagen über den Zeichen. Jetzt liegen sie direkt über dem Grund,
  Zeichen und Rahmen lassen das Tippen durch (`pointer-events: none`); geprüft: in allen 36 Feldern trifft ein Tipp auf
  das Zeichen das Feld, hell und dunkel angesehen. Dazu „Tippe auf dem Plan auf der Weiher“ → „auf den Weiher“
  (Akkusativ für männliche Dinge).
- **Ganze Aufgabe im Bild (LERN-55, BH3 a) — Stromkreis-Bauer (stromkreis-bauer) und Rhythmus-Leser (rhythmus-leser):**
  Stromkreis-Bauer: Antworten neben dem Schaltbild, wo die Breite reicht (`.strom-zeile`, `.strom-seite` mit
  `min-width: 0` — das Antwortraster verlangte sonst über 450 px und brach um); „Warum brennt die Lampe nicht?“ ragte
  untereinander 93 px unter den Rand von 1024 × 768. Rhythmus-Leser: Noten in den Antwortkarten und im Takt am Computer
  höchstens 110 px hoch (vorher Karten 209 px, die Antwort-Noten 170 px), Frage und Antworten gleich gross. Ergebnis
  `tools/bildhoehe.js`, alle Stufen: Tablet, 1024 × 768 und 1366 × 768 nichts mehr über den Rand (vorher bis 139 px);
  Handy wie vorher oder besser (vorher bis 74 px, jetzt bis 58 px — „Warum“ mit Antworten unter dem Bild; verglichen mit
  dem alten Stil über `--css`). Tests: Eulenpfad stromkreis-bauer rhythmus-leser „Keine Fehler.“, Prüfansicht
  stromkreis-bauer „Keine Fehler.“, Feier „2 Spiele, 72 Bilder, keine Fehler.“, Kontrast hell und dunkel „Kein Text unter
  der Untergrenze.“, Skripte „Keine Fehler.“.
- **`tools/bildhoehe.js` misst Handy und Tablet ohne Tastenmarken:** Chrome ohne Fenster meldet für alle Rahmen eine Maus,
  darum bekamen seit TM1 a auch Handy-Rahmen Knöpfe mit Platz für Marken, die es dort nicht gibt — die „Warum“-Aufgabe
  des Stromkreis-Bauers zählte so 58 px Überlauf, als echtes Handy (Berührung, ohne Maus) gemessen passt sie mit 18 px
  Luft. Neu Feld `maus` je Gerät (Laptop, Desktop, Mix); ohne Maus nimmt die Messung Marken und `marke-platz` weg.
  Stromkreis-Bauer und Rhythmus-Leser damit: Aufgabe auf keinem Gerät mehr über dem Rand, Handy höchstens 20 px
  (Tipp-Zeile). rahmen.md 20.
- **Abschluss:** Report `docs/eulenpfad/report/LERN_Session41_2026-11-14.md`, Handover nachgeführt (Sudoku-Familie
  vollständig, Kern 1.46.0, Tastenmarken, LERN-55 für zwei Spiele; nächster Schritt Push mit Entscheid zum vollen Lauf).

## 2026-11-14 — LERN_Session42
- **Gefärbte Flächen in SVG-Bildern geprüft** (offener Punkt aus LERN_Session41, nach Bemerkung 54 im Plan-Leser):
  Erdzeit-Leiter, Kakao-Weg, Netz-Falter, Tonleiter-Treppe, Wassertropfen-Reise und Würfel-Kipper färben nur Flächen, die
  vor Zeichen, Zahlen und Beschriftung gezeichnet werden (Kakao-Weg und Würfel-Kipper färben nach dem Tippen gar nichts im
  Bild) — nichts verdeckt; Wassertropfen-Reise (Bodenschichten) hell angesehen, Rahmen und Namen ganz sichtbar.
- **Schweiz-Karte (schweiz-karte):** Der Rand eines gefärbten Gebiets (richtig, falsch, in Stufe 6 markiert) lag unter
  den später gezeichneten Nachbarn — der grüne Rand war zur Hälfte grau, an einem markierten Nachbarn ganz rot. Jetzt
  kommt das gefärbte Gebiet nach vorn, hinter das letzte Gebiet und unter die Landesgrenze (`faerbe`). Geprüft, dass
  dabei nichts zugedeckt wird: kein Kanton und kein Wahlkreis umschliesst einen anderen ohne Loch (St. Gallen hat Löcher
  für die Appenzell). Angesehen nach dem Tippen und nach dem Lösungsweg: Stufe 1 hell und dunkel, Stufe 2 und 3 hell, je
  1024 px, Stufe 2 und 3 auch 375 px. Tests: Eulenpfad schweiz-karte „Keine
  Fehler.“, Skripte „Keine Fehler.“.
- **Bildhöhe neu gemessen (LERN-55):** `tools/bildhoehe.js` über alle 175 Spiele, sechs Stufen, Handy, Tablet, quer und
  Laptop (4200 Seiten), die 30 auffälligen Spiele zweimal nach. In allen drei Läufen über dem Rand: weather-report s5
  (bis 134 px, schlechter als in LERN_Session13), dazu sechs Spiele mit 5–12 px; sonst nur bei einer Aufgabenart
  (kulturen-koffer bis 443 px, sachaufgaben-kompass, netz-falter, diagramm-detektiv, hello-dialog …). Die 15 Handy-Seiten
  „Grafik geschrumpft“ sind Fehlmeldungen des Werkzeugs (Grafiken nach der Breite, nicht nach der Höhe). Liste in
  `docs/eulenpfad/bildhoehe_offen.md`, Abschnitt „Messung LERN_Session42“.
- **`tools/bildhoehe.js` — mehrere Ziehungen (Entscheid BW1 a):** `--ziehungen=N` (Vorgabe 5) lädt jede Seite N-mal,
  jedes Mal mit einer neuen ersten Aufgabe; gemeldet wird je Seite der höchste Wert, neu die Liste „Aufgabe selbst über
  dem Rand“ mit der Zahl der Ziehungen (vorher hing das Ergebnis an der zufälligen Aufgabenart). Die JSON-Datei enthält
  jede Ziehung einzeln (Feld `ziehung`).
- **`tools/bildhoehe.js` — volle Breite ist nicht geschrumpft (Entscheid BW2 a):** Füllt der gezeichnete Inhalt einer
  Grafik die Breite ihres Behälters, begrenzt die Breite, nicht die Bildhöhe — keine Meldung mehr (vorher 15 Handy-Seiten
  mit Zahlenstrahlen). Der Massstab ist neu der des gezeichneten Inhalts (beim svg der kleinere aus Breite und Höhe der
  viewBox), damit eine Grafik mit `max-height` auffällt, deren Box breit bleibt (Auge-Entdecker, Quader-Volumen,
  Flächen-Pixel). Geprüft: die sechs Spiele der Fehlmeldungen und drei mit `max-height` auf dem Handy, drei Ziehungen,
  „Grafik geschrumpft: 0 Seiten“; Gegenprobe mit `--css` (Runden-Rutsche, Zehntel-Lupe auf dem Handy 30 px hoch) meldet
  alle vier Seiten, Code 1; niedrige Fenster `mix`, `handy-quer` an den acht Spielen aus LERN_Session28: keine
  geschrumpfte Grafik. rahmen.md 20.
- **Weather-Report (weather-report), Stufe 5 ganz im Bild (LERN-55, BH3 a):** Der Plan zur Wegbeschreibung (rund 420 px)
  stand unter Bild, Knopf und Frage und ragte auf Handy, 1024 × 768 und Laptop über 100 px unter den Rand. Jetzt stehen
  Bild, „nochmal“ und Frage in einer Hülle (`.wr-links`, 💡 über `data-tipp-ziel` bei der Frage), breit und quer der Plan
  rechts daneben (`.wr-weg`); bis 820 px Bildhöhe Plan enger (Häuser 46 statt 54 px) und Bild mit „nochmal“ in einer
  Zeile. Angesehen mit gewöhnlicher Sprechblase: Handy 375 × 812 45 px Luft (hell und dunkel), Tablet 768 × 1024 90 px,
  1024 × 768 und 1366 × 768 165 px. `bildhoehe.js` (drei Ziehungen) meldet auf dem Handy noch 19 px, die Stimmen-Meldung
  des Messbrowsers. Tests: Eulenpfad weather-report „Keine Fehler.“, Prüfansicht weather-report „Keine Fehler.“, Skripte
  „Keine Fehler.“.
- **Zeichnungen mit eigener Klasse — Kulturen-Koffer (kulturen-koffer), Erdzeit-Leiter (erdzeit-leiter):** Die
  Grössenregel für Zeichnungen der Bildersammlung hing an `.bild.gezeichnet`; `LS.bild(b, "kk-bild")` setzt aber nur
  `kk-bild gezeichnet`, und das svg wurde so breit wie die Karte. Im Kulturen-Koffer war die Karte bei „Woher wissen wir
  das?“ und „Gab es das damals schon?“ bis 711 px hoch, die Aufgabe ragte bis 443 px unter den Rand (LERN-55). Jetzt in
  `stil.css` an `.gezeichnet` (setzt `LS.bild` immer), dazu `width: fit-content` — sonst zog sich die Bildkachel im
  Dunkelmodus als Balken über die Karte; mittig setzen die beiden Spiele selbst (`margin-inline: auto`, allgemein schöbe
  es das Bild in Knopfzeilen in die Mitte). Gemessen mit acht Ziehungen je Stufe und Gerät: Kulturen-Koffer nirgends mehr
  über dem Rand (vorher Handy bis 238, Tablet 279, 1024 × 768 und Laptop 443 px). Angesehen: Zeichnung in beiden Spielen
  hell und dunkel, 375 und 1024 px; Zeichnungen in Knöpfen von Energie-Wandler, Instrumente, Kakao-Weg und Tier-Sortierer
  hell und dunkel — am Platz wie vorher. Tests: Eulenpfad kulturen-koffer erdzeit-leiter „Keine Fehler.“, Prüfansicht
  kulturen-koffer „Keine Fehler.“, Skripte „Keine Fehler.“.
- **Abschluss:** Report `docs/eulenpfad/report/LERN_Session42_2026-11-14.md`, Handover nachgeführt (SVG-Flächen geprüft,
  Bildhöhe neu gemessen, BW1 a, BW2 a, Weather-Report und Kulturen-Koffer im Bild; nächster Schritt volle Messung mit fünf
  Ziehungen oder die nächsten Spiele der Liste).

## 2026-11-15 — LERN_Session43
- **Ganze Aufgabe im Bild (LERN-55, BH3 a) — Fledermaus-Forscher (fledermaus-forscher), Hello-Dialog (hello-dialog),
  Netz-Falter (netz-falter), Sachaufgaben-Kompass (sachaufgaben-kompass), Diagramm-Detektiv (diagramm-detektiv):**
  Fledermaus unter 820 px Bildhöhe neben dem Satz (Jahr mit fünf Karten, vorher Laptop 85, Handy 47 px über dem Rand);
  Hello-Dialog breit und quer Dialog links, Antworten rechts, Handy Antwortzeilen 52 px (Lücke, vorher Laptop 88 px);
  Netz-Falter Netz nach der Bildhöhe mit Untergrenze (Quadernetze, vorher Laptop 183 px); Sachaufgaben-Kompass mit
  Tabelle oder Diagramm breit und quer die Daten rechts (`.kompass-raster`, 💡 über `data-tipp-ziel`), auf dem Handy
  Tabelle enger, „Prüfen“ neben dem Schritt, Rechenwege zweispaltig, wenn der längste in eine halbe Zeile passt
  (`zweiSpaltig`, gemessen; vorher bis 103 px); Diagramm-Detektiv auf dem Tablet hoch Frage und Antworten über die ganze
  Breite (vorher 251 px), auf dem Handy Diagramm mit Zifferntastatur nach der Bildhöhe, Tabelle mit Diagramm enger.
  Neben einem Diagramm steht die Tabelle oder Strichliste im Diagramm-Detektiv auf dem Handy quer (Entscheid DD1 a: eine
  Spalte je Kategorie, Bild und Name oben, Anzahl oder Striche darunter, `querTabelle`; vorher bei fünf Kategorien bis
  114 px über dem Rand). Nachgemessen mit acht Ziehungen je Stufe und Gerät: in keinem der fünf Spiele ragt die Aufgabe
  noch über den Rand. Angesehen im Browser: jedes Spiel auf den betroffenen Geräten. `docs/eulenpfad/bildhoehe_offen.md`.
- **`tools/bildhoehe.js`:** `--json` hält je Ziehung den Anfang des Aufgabentexts fest (Feld `text`), damit sich zeigt,
  welche Aufgabenart überläuft (rahmen.md 20).
- Tests: Skripte „Keine Fehler.“, Eulenpfad sachaufgaben-kompass „Keine Fehler.“, diagramm-detektiv „Keine Fehler.“ (nur
  in diesen beiden Code geändert; der erste Lauf im Sachaufgaben-Kompass fand `document.createRange`, das es im Test-DOM
  nicht gibt — jetzt gemessen über den span im Knopf).
- **`tools/bildhoehe.js` — Messbrowser ohne Stimmen-Meldung:** Chrome mit `--autoplay-policy=no-user-gesture-required`;
  vorher zeigte die Eule in jedem Spiel mit Fremdsprachen-Stimme „Stimme hat nicht gesprochen (not-allowed)“, eine rund
  64 px höhere Blase (Au-Café 136, Calendrier 58, Quelle heure 27, Son-Lauscher 5 px über dem Rand; in 480 Messungen
  danach keine Meldung mehr). rahmen.md 20.
- **Ganze Aufgabe im Bild (LERN-55, BH3 a) — Rechen-Maschine (rechen-maschine), Wassertropfen-Reise
  (wassertropfen-reise), Zahlen-Baukasten (zahlen-baukasten), Zehntel-Lupe (zehntel-lupe), Quelle heure (quelle-heure),
  Hundertertafel (hundertertafel), Fahrplan-Rechner (fahrplan-rechner), Au café (au-cafe), Hoch-Tief-Ohr
  (hoch-tief-ohr), Kompass (kompass), Braille-Finger (braille-finger), Koordinaten-Schatz (koordinaten-schatz),
  Znüni-Teller (znueni-teller), Finger-Zähler (finger-zaehler):** die übrigen Spiele der Liste. Rechen-Maschine s6 Weiche
  Eingang → Frage überall in einer Zeile, Handy Notizen und Hinweis enger (vorher Handy 100, Tablet 51 px); Wassertropfen
  💡 in der Frage über `data-tipp-ziel` statt eigener Zeile, Grafik-Formel auf dem Handy griff nicht (85 px);
  Zahlen-Baukasten s6 Anzeige und Bausteine niedriger (53 px); Zehntel-Lupe Strahlen auf dem Tablet hoch nach der
  Bildhöhe (37 px); Quelle heure Uhr kleiner, Satzknöpfe 54 px (23 px); Hundertertafel Zeile „Seite … bis …“ in der
  Feldgrösse (21 px); Fahrplan Zeilen enger (20 px); Au café Satzknöpfe mit Bild neben dem Wort, Blasen enger (bis
  73 px); Hoch-Tief-Ohr Notenblatt nach der Bildhöhe (12 px); Kompass Weg beschreiben breit enger, Plan bei langen
  Antworten kleiner (12 px); Braille-Finger Punktzelle nach der Bildhöhe, Koordinaten-Schatz, Znüni-Teller, Finger-Zähler
  Grafik etwas kleiner (3–14 px). Jede neue Grösse nach der Bildhöhe mit Untergrenze (H1 a). Nachgemessen mit fünf bis zehn
  Ziehungen je Stufe und Gerät: Aufgabe in keinem mehr über dem Rand (Bionik-Paare, Schriftlich-Werkstatt in einzelnen
  Ziehungen 3 px, an der Schwelle, unverändert). Angesehen im Browser je auf dem betroffenen Gerät.
  `docs/eulenpfad/bildhoehe_offen.md`.
- Tests: Skripte „Keine Fehler.“, Eulenpfad wassertropfen-reise „Keine Fehler.“ (nur dort Code geändert, sonst CSS).
- **Bildhöhe neu gemessen (LERN-55):** alle 175 Spiele, sechs Stufen, vier Geräte, fünf Ziehungen je Seite (21 000
  Messungen). Aufgabe selbst über dem Rand: 17 Spiele neu (meist nur bei einer Aufgabenart, die früher nicht gezogen
  wurde), dazu die Ausnahmen von Punkt 4 und vier Fälle an der Schwelle; seitlich gemeinde-helfer Tablet 7 px.
  `docs/eulenpfad/bildhoehe_offen.md` (Abschnitt Messung LERN_Session43).
- **`tools/bildhoehe.js`:** prüft vor dem Messen, ob der Server antwortet (sonst Abbruch mit Hinweis), und wartet, bis die
  Startseite bereit ist, statt fest 2,5 s (ein gestoppter Server beendete einen Lauf mit „LS is not defined“). rahmen.md 20.
- **Ganze Aufgabe im Bild (LERN-55, BH3 a) — Punkte-Blitz (punkte-blitz), Lärm-Wächter (laerm-waechter), Lese-Detektiv
  (lese-detektiv), Möglichkeiten-Finder (glace-kombinator), Gedicht-Baukasten (gedicht-baukasten), Plan-Leser
  (plan-leser), Gefühle-Radar (gefuehle-radar), Schweiz-Karte (schweiz-karte), Rede-Zeichen (rede-zeichen),
  Taschengeld-Planer (taschengeld-planer), Bruch-Werkstatt (bruch-werkstatt), Bionik-Paare (bionik-paare),
  Mittelwert-Waage (mittelwert-waage), Geschichten-Ordner (geschichten-ordner), Tonleiter-Treppe (tonleiter-treppe),
  Blutkreislauf-Lotse (blutkreislauf-lotse), Gemeinde-Helfer (gemeinde-helfer):** Punkte-Blitz Vergleich bis 20 auf dem
  Handy nebeneinander (vorher 161 px); Lärm-Wächter 👂 in der Satzzeile, Ohr-Bild nach der Bildhöhe (102 px); Lese-Detektiv
  breit Text links, Frage und Antworten rechts, Handy Text enger (78 px); Möglichkeiten-Finder Handy Gruppen, Sorten und
  Anzeige enger (bis 71 px; Ausnahme s6 jetzt bis 97 statt 196 px); Gedicht-Baukasten breit je Strophe eine Spalte,
  gestrichelt getrennt, Reihenfolge bleibt eindeutig (52 px); Plan-Leser Handy Plan nach `100vh − 620px`, Legende enger,
  breit bei Weg beschreiben Beschreibungen in zwei Zeilen (46 bzw. 35 px); Gefühle-Radar Paare mit Bild neben dem Text
  (36 px); Schweiz-Karte Karte kleiner bei zweizeiligen Namen (32 px); Rede-Zeichen enger (31 px); Taschengeld-Planer
  Handy Waren als Zeilen, Anzeige 56 px (29 px); Bruch-Werkstatt Streifen nach der Bildhöhe (27 px); Bionik-Paare langer
  Auftrag kleiner (23 px); Mittelwert-Waage Anzeige 56 px (13 px); Geschichten-Ordner, Tonleiter-Treppe (Breite in
  `treppeSvg` nach Seitenverhältnis und Bildhöhe), Blutkreislauf-Lotse enger (4–9 px); Gemeinde-Helfer breitere Spalten
  bei langen Namen (seitlich 7 px). Jede neue Grösse nach der Bildhöhe mit Untergrenze (H1 a). Nachgemessen (dieselben
  17 Spiele, fünf Ziehungen, alle Stufen und Geräte): Aufgabe in keinem mehr über dem Rand ausser den Ausnahmen von
  Punkt 4. Angesehen im Browser: Punkte-Blitz, Lärm-Wächter, Gefühle-Radar, Taschengeld-Planer, Möglichkeiten-Finder
  Handy; Lese-Detektiv Laptop; Gedicht-Baukasten quer. `docs/eulenpfad/bildhoehe_offen.md`.
- Tests: Skripte „Keine Fehler.“, Eulenpfad (die 17 Spiele) „Keine Fehler.“ — der erste Lauf im Möglichkeiten-Finder
  fand Regeln, die mit der Rahmen-Klasse `.auftrag` beginnen; jetzt unter der Spielfläche eingeschachtelt.
- **Abschluss:** Report `docs/eulenpfad/report/LERN_Session43_2026-11-15.md`, Handover nachgeführt (Bildhöhe bis auf die
  Ausnahmen erledigt, Stimme im Messbrowser erledigt; weiter mit Push, Ausnahmen von Punkt 4 oder GR1 a).

## 2026-11-15 — LERN_Session44
- Voller Eulenpfad-Lauf auf `750c0a8` (3070 s): „2 Fehler.“, beide im Zahlen-Baukasten — eine Regel begann mit der
  Rahmen-Klasse `.auftrag` (seit `a8f11f7`), jetzt `div:has(> .bausteine) > .auftrag`; einzeln „Keine Fehler.“.
- Ganze Aufgabe im Bild, Ausnahmen von Punkt 4 geprüft (LERN-55, BH3 a), Werte Handy vorher: Hebel-Wippe
  (hebel-wippe) Bild beginnt oben beim höchsten Inhalt mit Platz für die Neigung (s6 27 px); Malkreuz (malkreuz) Rätsel
  ohne „Malkreuz-Rätsel:“ auf dem Handy (s6 43 px); Zahlen-Baukasten (zahlen-baukasten) ausgeschriebene Bausteine enger
  (s6 11 px); Kakao-Weg (kakao-weg) Schritte ordnen mit schmaler leerer Ablage, Schritte 44 px, Tablet hoch enger (s6
  59 px, Tablet 10 px); Quader-Volumen (quader-volumen) zwei Körper nebeneinander (s4 106 px), Aquarium nach der Bildhöhe, nie unter 80 %
  seiner Zeichnung (s6 noch 17 px); Plan-Leser (plan-leser)
  Weg beschreiben mit der Legende neben dem Plan, Beschreibungen 16 px (s5/s6 259 px, jetzt höchstens 8 px in 1 von 12
  Ziehungen); Diagramm-Wahl (diagramm-wahl) fünf Bildantworten in drei Spalten (s1 32 px). Nachgemessen mit zehn bis
  zwölf Ziehungen: Aufgabe sonst in keinem mehr über dem Rand. Entscheide Patrik: 1 a — Diagramm-Wahl s5 auf dem
  Handy mit Tabelle quer und den drei Diagrammen zum Blättern (Reiter A B C; 484 px → passt); 2 a — Möglichkeiten-Finder
  (glace-kombinator) Kleider-Sets auf dem Handy mit der Regel neben der Anzeige, Stücke enger (s6 53 px → passt, vorher
  Anzeige halb unter der Tastatur). `docs/eulenpfad/bildhoehe_offen.md`.
- Tests: Eulenpfad hebel-wippe malkreuz zahlen-baukasten kakao-weg quader-volumen diagramm-wahl plan-leser „Keine
  Fehler.“, Eulenpfad diagramm-wahl glace-kombinator „Keine Fehler.“, Skripte „Keine Fehler.“
- Quader-Volumen (quader-volumen) s6, damit Punkt 4 erledigt: Aquarium und zwei Quader zusammen nach der Bildhöhe, nie
  unter 80 % ihrer Zeichnung (`nachHoehe`), Anzeige neben den Notizen 56 statt 76 px, Notizfelder 28 px, Frage enger
  (Handy 19 und 30 px → höchstens 3 px in 1 von 15); Tablet hoch Körper höchstens 260 px und nebeneinander (Vergleichen
  mit einem Körper in cm war 583 px hoch, Aufgabe bis 376 px darunter); Rand links in `koerperSvg` nach der Textbreite
  („0.5 dm“ unter schmalen Körpern und „💧 2.5 dm“ ragten links aus dem Bild). Tests: Eulenpfad quader-volumen „Keine
  Fehler.“, Skripte „Keine Fehler.“
- Plan-Leser (plan-leser) „Was ist zwischen …?“ (Handy s3 19, s6 55 px): bis 860 px Bildhöhe bei allen Aufgaben mit
  Antworten die Legende in einer Spalte neben dem Plan, 14 px einzeilig; darüber der Plan nach `100vh − 680px` statt
  620 px. Weg beschreiben: Legende 14 px — sie brach mit 15 px in der schmalen Spalte um (271 statt 172 px hoch), im
  Browser mit Handy-Emulation bis 57 px darunter, obwohl die Messung höchstens 8 px zeigte. Nachgemessen mit 15
  Ziehungen, dazu im Browser 375×870 und 375×932: Aufgabe überall im Bild. Tests: Eulenpfad plan-leser „Keine
  Fehler.“, Skripte „Keine Fehler.“
- `tools/bildhoehe.js`: neue Option `--text="<Muster>"` — misst nur Aufgaben, deren Text das Muster enthält, und lädt je
  Ziehung neu, bis die Art kommt (höchstens 25-mal, Feld `versuche`). Anlass: Die Messung meldete beim Plan-Leser
  „Weg beschreiben“ höchstens 8 px, im Browser waren es bis 57. Nachgestellt (Messaufbau des Werkzeugs, gleiche
  Schriftbreiten in beiden Browsern, alter Stil über `--css`): Das Werkzeug misst richtig, die Art kam nur in 7 von 24
  Ziehungen vor und dann günstig; gezielt mit `--text` und altem Stil bis 79 px, mit dem heutigen höchstens 2 px.
  rahmen.md 20, bildhoehe_offen.md Punkt 7.
- **Abschluss:** Report `docs/eulenpfad/report/LERN_Session44_2026-11-15.md`, Handover nachgeführt (Ausnahmen von
  Punkt 4 erledigt, Entscheide 1 a und 2 a, `--text` im Messwerkzeug; weiter mit Push, seltenen Aufgabenarten oder GR1 a).

## 2026-11-16 — LERN_Session45
- Voller Eulenpfad-Lauf auf `0022648` vor dem Push (Entscheid Patrik): „Keine Fehler.“ (4060 s).
- `tools/bildhoehe.js`: neue Option `--arten=<liste.json>` — misst eine Liste `[{ id, stufe, text }]` in einem Lauf, je
  Eintrag wie `--text` (leerer Text = jede Aufgabe der Stufe), gemeldet je Art (Feld `art`), „Nicht gemessen“ nennt je
  Gerät die Art, die in 25 Versuchen nicht kam. Das Muster wird gegen den Aufgabentext mit zusammengezogenem Leerraum
  geprüft (vorher kamen Muster über zwei Zeilen wie „Der Igel Der Igel“ nie). rahmen.md 20.
- Seltene Aufgabenarten nachgemessen (LERN-55, BH3 a): aus der vollen Messung vom 15.11. 452 Arten, die auf dem Handy
  höchstens einmal kamen, gezielt, dazu 400 Seiten ohne trennbare Arten mit 10 Ziehungen, alle vier Geräte. Behoben:
  Zeitstrahl-Sortierer (zeitstrahl-sortierer) s6 Ereignisse ordnen auf dem Handy mit Bild links, Jahrzahl und Ereignis
  rechts (89–100 px); Calendrier (calendrier) s5/s6 Monate mit sechs Wochen, Monatsblatt zum Ansehen enger,
  Wochentags-Knöpfe 50 px (33 px); Gedicht-Baukasten (gedicht-baukasten) s6 Vers in Strophen antippen, Vers-Knöpfe
  enger (38 px); Auge-Entdecker (auge-entdecker) s3 quer Satz neben dem Bild 21 px (13 px); Kompass (kompass) s6 Frage
  enger (4 px); Bruch-Rechteck (bruch-rechteck) s1 Tafel 76 % breit (3 px); Bionik-Paare (bionik-paare) s2 Vorbild →
  Erfindung nebeneinander (3 px). Nachgemessen: Aufgabe überall im Bild. Sachaufgaben-Kompass s2 (11 px in 1 von 10)
  nicht nachgestellt. `docs/eulenpfad/bildhoehe_offen.md` Abschnitt „Seltene Aufgabenarten LERN_Session45“.
- Tests: Eulenpfad zeitstrahl-sortierer calendrier gedicht-baukasten auge-entdecker kompass bruch-rechteck
  bionik-paare „Keine Fehler.“, Skripte „Keine Fehler.“
- **GR1 a umgesetzt (LERN-55):** `stil.css` verdichtet unter 700 px Höhe weiter (Kopfzeile mit 40-px-Knöpfen, Eule
  40 px, Blase 15 px, Knöpfe und Tasten 46 px, engere Abstände); ⛶ Vollbild in der Kopfzeile (`spiel.js`, Klasse
  `vollbild-knopf`, `im-vollbild` am html), nur auf Geräten mit Maus unter 650 px Höhe und im Vollbild, nicht in einem
  Rahmen; `tools/bildhoehe.js` misst als Vorgabe die sichtbare Fläche (handy-sicht, tablet-sicht, quer-sicht,
  laptop-sicht). Gemessen vorher und mit der Verdichtung (über `--css` auf demselben Code, drei Ziehungen): Spiele mit
  der Aufgabe über dem Rand Handy 375×660 118 → 68, Tablet quer 1024×690 36 → 0, Laptop 1366×650 72 → 12, Tablet hoch
  14 → 12. Rest je Spiel in `docs/eulenpfad/bildhoehe_offen.md` (Abschnitt „Sichtbare Fläche LERN_Session45“), rahmen.md
  20. Das Umschalten ins Vollbild war im Browser der App nicht prüfbar.
- Tests (Stichprobe nach „Testläufe während eines Umbaus“): Eulenpfad kompass kiosk-kasse zahlenmauer plan-leser
  zeitstrahl-sortierer zahlen-sudoku hello-dialog schriftlich-werkstatt „Keine Fehler.“, Feier „175 Spiele, 6300 Bilder,
  keine Fehler.“, Skripte „Keine Fehler.“
- **Baustein „restliche Höhe“ (LERN-55, Wunsch an den Rahmen aus BH3):** `LS.restHoehe(el)` in `spiel.js` setzt am
  Element `--rest-h` = seine Höhe plus den Platz unter seiner Karte (in einer Reihe nur seine Spalte, mehrere Elemente
  einer Karte teilen sich den Platz), neu gemessen bei jeder Grössenänderung der Bühne oder des Fensters; ersetzt die
  geschätzten Abzüge `100vh − …px`. `tools/pruefe_skripte.js` Punkt 5 verlangt auch für `var(--rest-h)` eine Untergrenze
  (zwei neue Gegenproben). Umgestellt (35 Spiele, keine Regel `100vh − …px` mehr in den Spielseiten): Auge-Entdecker
  (auge-entdecker), Blutkreislauf-Lotse (blutkreislauf-lotse), Braille-Finger (braille-finger), Bruch-Rechteck
  (bruch-rechteck), Bruch-Werkstatt (bruch-werkstatt), Diagramm-Detektiv (diagramm-detektiv), Diagramm-Wahl
  (diagramm-wahl), Erdzeit-Leiter (erdzeit-leiter), Finger-Zähler (finger-zaehler), Flächen-Pixel (flaechen-pixel),
  Geheimschrift-Knacker (geheimschrift-knacker), Hebel-Wippe (hebel-wippe), Hoch-Tief-Ohr (hoch-tief-ohr),
  Hundertertafel (hundertertafel), König in der Falle (koenig-falle), Kompass (kompass), Koordinaten-Schatz
  (koordinaten-schatz; Tafel auf dem Laptop 378 statt 280 px breit, Spalten `minmax(0, 1fr)`), Lärm-Wächter
  (laerm-waechter), Mittelwert-Waage (mittelwert-waage), Netz-Falter (netz-falter), Pentomino-Puzzle (pentomino-puzzle),
  Plan-Leser (plan-leser), Quader-Volumen (quader-volumen), Quelle heure (quelle-heure), Roboter-Pfad (roboter-pfad),
  Schriftlich-Werkstatt (schriftlich-werkstatt), Schweiz-Karte (schweiz-karte), Spiegel-Raster (spiegel-raster),
  Steine fangen (steine-fangen), Stromkreis-Bauer (stromkreis-bauer), Tonleiter-Treppe (tonleiter-treppe),
  Uhr-Werkstatt (uhr-werkstatt), Wassertropfen-Reise (wassertropfen-reise), Wetter und Jahreszeiten
  (wetter-jahreszeiten), Zehntel-Lupe (zehntel-lupe). Schlussmessung aller Spiele auf der sichtbaren Fläche: Spiele mit
  der Aufgabe über dem Rand Handy 68 → 60, Tablet hoch 12 → 9, Laptop 12 → 8, Tablet quer 0; die umgestellten Handy
  20 → 13, Tablet hoch 5 → 0, Laptop 2 → 0. `docs/eulenpfad/bildhoehe_offen.md` Abschnitt „Restliche Höhe
  LERN_Session45“, rahmen.md 20.
- Tests: Eulenpfad über die 35 umgestellten Spiele „Keine Fehler.“, Skripte „Keine Fehler.“
- Übrig gebliebene Warteschleifen der Agenten (`until … sleep`, bis 1 h alt) beendet; Hook-Kandidat im Report.
- **Abschluss:** Report `docs/eulenpfad/report/LERN_Session45_2026-11-16.md`, Handover nachgeführt (Haltepunkt
  aufgelöst; gepusht bis `74d99fc` ohne vollen Lauf nach GR1 a und Baustein; weiter mit vollem Lauf, Vollbild prüfen,
  Rest je Spiel).

## 2026-11-17 — LERN_Session46
- Voller Eulenpfad-Lauf auf `bde136d` (nach GR1 a und Baustein „restliche Höhe“): „Keine Fehler.“ (3587 s).
- Ganze Aufgabe im Bild (LERN-55), Rest je Spiel: 62 Spiele in fünf Gruppen (Agenten, je eigener Server und
  Messbrowser, alle Stufen mit fünf Ziehungen vorher und nachher), nur die Spielseiten geändert, Inhalt und Wortlaut
  unverändert — Bild links statt darüber, Frage neben Tabelle oder Grafik, Anzeige auf dem Handy 46–56 px, 💡 in der
  Frage (`data-tipp-ziel`), `LS.restHoehe` in Flächenmass-Treppe, Begriffs-Geodreieck, Tageslauf-Sonne, Zufalls-Skala,
  Kakao-Weg, engere Abstände: Begriffs-Geodreieck (begriffs-geodreieck), Bionik-Paare (bionik-paare), Calendrier
  (calendrier), Daten-Detektiv (diagramm-detektiv), Diagramm-Wahl (diagramm-wahl), Energie-Wandler (energie-wandler),
  Erdzeit-Leiter (erdzeit-leiter), Fahrplan-Rechner (fahrplan-rechner), Flächen-Pixel (flaechen-pixel),
  Flächenmass-Treppe (flaechenmass-treppe), Fledermaus-Forscher (fledermaus-forscher), Früher und heute
  (frueher-heute), Gattungs-Kenner (gattungs-kenner), Gefühle-Radar (gefuehle-radar), Gegenteil-Wippe
  (gegenteil-wippe), Geheimschrift-Knacker (geheimschrift-knacker), Gemeinde-Helfer (gemeinde-helfer), Gerecht-Teiler
  (gerecht-teiler), Geschichten-Ordner (geschichten-ordner), Möglichkeiten-Finder (glace-kombinator), Himmels-Forscher
  (himmels-forscher), Kakao-Weg (kakao-weg), Komma-Messband (komma-messband), Kompass-Spiel (kompass), Kulturen-Koffer
  (kulturen-koffer), Lese-Detektiv (lese-detektiv), Malkreuz (malkreuz), Mittelwert-Türme (mittelwert-waage),
  Pflanzen-Bestimmer (pflanzen-bestimmer), Platzhalter-Geschichten (platzhalter-geschichten), Preis-Tabelle
  (preis-tabelle), Punkte-Blitz (punkte-blitz), Quader-Volumen (quader-volumen), Rechen-Maschine (rechen-maschine),
  Reim-Paare (reim-paare), Rhythmus-Diktat (rhythmus-diktat), Roboter-Pfad (roboter-pfad), Sachaufgaben-Kompass
  (sachaufgaben-kompass), Satz-Reparatur (satz-reparatur), Schriftlich-Werkstatt (schriftlich-werkstatt), Schwimmt
  oder sinkt? (schwimmt-sinkt), Son-Lauscher (son-lauscher), Speicher-Leiter (speicher-leiter), Stufenzahl-Schieber
  (stufenzahl-schieber), Tageslauf-Sonne (tageslauf-sonne), Taschengeld-Planer (taschengeld-planer), Tier-Sortierer
  (tier-sortierer), Uhr-Werkstatt (uhr-werkstatt), Velo-Tabelle (velo-tabelle), Wassertropfen-Reise
  (wassertropfen-reise), Wortarten-Probe (wortarten-probe), Würfel-Zähler (wuerfel-zaehler), Zahlen-Baukasten
  (zahlen-baukasten), Zahlen-Waage (zahlen-waage), Zahlenhaus (zahlenhaus), Zahlenmauer-Baumeister (zahlenmauer),
  Zahlenrätsel-Tresor (zahlenraetsel-tresor), Zehntel-Lupe (zehntel-lupe), Zeitstrahl-Sortierer
  (zeitstrahl-sortierer), Ziffernkarten (ziffernkarten), Znüni-Teller (znueni-teller), Zufalls-Skala (zufalls-skala).
  Gemeinsame Nachmessung allein auf einem Server (alle Stufen, drei Ziehungen): Spiele mit der Aufgabe über dem Rand
  Handy 60 → 5, Tablet hoch 9 → 0, Laptop 8 → 0, Tablet quer 0; seitlich und geschrumpfte Grafik 0. Je Spiel
  vorher/nachher, Reste, Entscheid K1 (Kakao-Weg) und Wünsche an den Rahmen R1–R6 in
  `docs/eulenpfad/bildhoehe_offen.md` Abschnitt „Rest je Spiel LERN_Session46“.
- Energie-Wandler (energie-wandler): Pfeil zwischen einem Wandler und der nächsten Energie fehlte in der Kette
  (`ketteEl`), behoben.
- Tests: Skripte „Keine Fehler.“, Eulenpfad über die 62 geänderten Spiele „Keine Fehler.“, Eulenpfad energie-wandler
  „Keine Fehler.“
- Kakao-Weg (kakao-weg), Entscheide K1 a, K2 a, K3 a: In Stufe 6 scrollt die Liste der acht Schritte im eigenen Feld
  (`LS.lesetext`, beim Ordnen nach jedem Antippen neu eingepasst); beim Ordnen scrollt auch die Ablage (Handy höchstens
  150, sonst 200 px) und zeigt den zuletzt gelegten Schritt — sie wuchs je Schritt um 70–100 px, die Seite ragte am Ende
  bis 387 px (Handy), 166 px (Tablet hoch), 269 px (Laptop) über den Rand; jetzt bei keinem Schritt. Entscheid G1 a:
  Buchstabentasten des Geheimschrift-Knackers auf dem Handy bleiben 30 × 44 px. `docs/eulenpfad/bildhoehe_offen.md`.
- Tests: Eulenpfad kakao-weg „Keine Fehler.“, Skripte „Keine Fehler.“
- Rahmen, Entscheide R1 a–R6 a (LERN-55; vorher je Wunsch mit einer Probe gemessen, die dieselbe Aufgabe mit jeder
  Variante neu misst): `stil.css` unter 700 px Höhe Anzeige 52 statt 76 px (R1) und 8 px Abstand über der Zifferntastatur
  (R6); „OK ✓“ auf einer Zeile (R3); `spiel.js` `titelEinpassen` — Titel 20 → höchstens 16 px, bis er auf eine Zeile
  passt (R4; vorher 33 von 175 Titeln zweizeilig, jetzt zwei); Baustein „Antwortknopf mit Bild links“
  (`opt.bildLinks: true | "eng"` in `LS.auswahl`/`LS.reihenfolge`, `LS.bildLinks`, Klassen `bild-links`,
  `bild-links-eng`, R5); Melde-Zeile bleibt gleich hoch (R2, WZ1 a). Einzelregeln entfernt bzw. auf den Baustein
  umgestellt: Bionik-Paare (bionik-paare), Diagramm-Wahl (diagramm-wahl), Fahrplan-Rechner (fahrplan-rechner),
  Flächen-Pixel (flaechen-pixel), Gattungs-Kenner (gattungs-kenner), Geheimschrift-Knacker (geheimschrift-knacker),
  Gemeinde-Helfer (gemeinde-helfer), Möglichkeiten-Finder (glace-kombinator), Kakao-Weg (kakao-weg), Komma-Messband
  (komma-messband), Mittelwert-Türme (mittelwert-waage), Preis-Tabelle (preis-tabelle), Quader-Volumen (quader-volumen),
  Schriftlich-Werkstatt (schriftlich-werkstatt), Speicher-Leiter (speicher-leiter), Stufenzahl-Schieber
  (stufenzahl-schieber), Taschengeld-Planer (taschengeld-planer), Uhr-Werkstatt (uhr-werkstatt), Velo-Tabelle
  (velo-tabelle), Würfel-Zähler (wuerfel-zaehler), Zahlen-Baukasten (zahlen-baukasten), Zahlen-Waage (zahlen-waage),
  Zahlenhaus (zahlenhaus), Zehntel-Lupe (zehntel-lupe), Zufalls-Skala (zufalls-skala). Nachmessung aller Spiele: Spiele
  mit der Aufgabe über dem Rand gegen den 16.11. Handy 61 → 4, Tablet hoch 9 → 1, Laptop 8 → 0, Tablet quer 0. rahmen.md
  (Bausteine, Abschnitt 20), `docs/eulenpfad/bildhoehe_offen.md` Abschnitt „Rahmen R1–R6 LERN_Session46“.
- Tests: Skripte „Keine Fehler.“, Eulenpfad über die 25 geänderten Spiele „Keine Fehler.“, Feier „175 Spiele, 6300
  Bilder, keine Fehler.“
- Voller Eulenpfad-Lauf auf `8f58c33` (nach R1–R6): „Keine Fehler.“ (3269 s).
- Reste auf der sichtbaren Fläche (LERN-55), unter 700 px Höhe enger: Jahreskreis (jahreskreis) s6 Monate zählen in drei
  Spalten (51 px → im Bild), Hello-Dialog (hello-dialog) s5 Lücke und s6 Ordnen (49 bzw. 34 px auf dem Laptop → im Bild),
  Kiosk-Kasse (kiosk-kasse) s4 leere Kasse 64 px (36 → im Bild), Au café (au-cafe) s4 Gespräch mit fünf Zeilen (35 → im
  Bild); `docs/eulenpfad/bildhoehe_offen.md`.
- Tests: Eulenpfad hello-dialog kiosk-kasse jahreskreis au-cafe „Keine Fehler.“, Skripte „Keine Fehler.“
- Sachaufgaben-Kompass (sachaufgaben-kompass), Entscheid SK2 a (LERN-55, bildhoehe_offen.md Offen 6, offen seit
  LERN_Session13; vorgelegt als SK1): Im Ergebnis-Schritt stehen statt Sachtext und Daten nur die nötigen Angaben als
  grüne Karten, „📄 Text zeigen“ holt Text und Daten zurück; auf dem Handy Angaben, Schritt, Einheiten und Notizen
  enger. Vorher ragte der Schritt auf dem Handy in s2–s6 bis 255 px über den Rand (Zifferntastatur oft ganz), auf dem
  Tablet hoch bis 228, auf dem Laptop bis 98 px; nachher überall im Bild ausser Handy s6 einmal 11 px (gemessen über eine
  vorübergehende Kopie der Seite, die die Vorschritte richtig antippen lässt). `docs/eulenpfad/bildhoehe_offen.md`.
- Tests: Eulenpfad sachaufgaben-kompass „Keine Fehler.“, Skripte „Keine Fehler.“
- Volle Bildschirmgrössen (BH1 a) neu gemessen, alle Spiele: Seitlicher Überlauf behoben — Koordinaten-Schatz
  (koordinaten-schatz) s1 Tafel und Koordinatensystem nach dem Behälter statt nach `94vw`/`90vw` (2 px auf 375 × 812),
  Quader-Volumen (quader-volumen) s3 Antwortzeile mit Notiz auf jeder schmalen Fläche schmaler (4 px, vorher nur unter
  700 px Höhe behoben). Offen-Liste 2 und 3 durch den heutigen Stand ersetzt (`docs/eulenpfad/bildhoehe_offen.md`,
  Abschnitt „Stand LERN_Session46“).
- Tests: Eulenpfad quader-volumen koordinaten-schatz „Keine Fehler.“, Skripte „Keine Fehler.“
- **Abschluss:** Report `docs/eulenpfad/report/LERN_Session46_2026-11-17.md`, Handover nachgeführt (LERN-55 zu Ende
  geführt: Handy 61 → 4, Tablet hoch 9 → 1, Laptop 8 → 0 Spiele mit der Aufgabe über dem Rand; voller Lauf auf `8f58c33`
  „Keine Fehler.“; weiter mit Push, Vollbild prüfen, Sudokus, Werkzeug für spätere Schritte).

## 2026-11-18 — LERN_Session47
- ⛶ Vollbild von Patrik im eigenen Browser geprüft: nichts Störendes (offen seit LERN_Session45).
- Spätere Schritte einer Aufgabe messen (Entscheid ZU1 a, LERN-55): Zählung vorab über alle Spiele (Ersatz-DOM,
  Zufallsklicks, nur im Scratchpad) — 85 Spiele ändern die Aufgabe vor dem Lösen sichtbar, 46 offen, weil Zufallsklicks
  sie selten lösen (Sachaufgaben-Kompass 0 von 102, Sudokus 0 von 30), 44 ohne.
- Rahmen (`spiel.js`): `LS.pruefung.zug(richtig)` macht den nächsten richtigen oder falschen Handgriff der laufenden
  Aufgabe; `ctx.testZug(fn)` für eigene Knöpfe; Auswahl, Reihenfolge und Körbe melden ihre Züge selbst, die Tastatur mit
  der neuen Option `opt.erwartet`. Die Liste leert der Rahmen vor jedem Zeichnen; kein Kind kann sie auslösen.
- `tools/bildhoehe.js --schritte`: spielt jede Ziehung weiter (ein falscher, dann richtige Handgriffe bis zum Lösen) und
  misst nach jedem; meldet den höchsten Stand mit `Stand`, dazu Spiele ohne Zug und nicht zu Ende gespielte Seiten.
  Erste Messung aller Spiele (Handy, s1/s3/s6, eine Ziehung): 54 Spiele ganz gespielt, 44 in einem Teil der Stufen,
  76 ohne Zug, 1 mit einem späteren Schritt ohne Zug; neu gefunden Au café (au-cafe) s6 202 px nach 6 Handgriffen und
  Geschichten-Ordner (geschichten-ordner) s6 154 px nach 5. rahmen.md 4.2, 4.3 und 20.
- Tests: Skripte „Keine Fehler.“, Eulenpfad anlaut-angel tier-sortierer kakao-weg zahlenmauer sachaufgaben-kompass
  glace-kombinator „Keine Fehler.“
- Gelegte Teile verschwinden (Entscheid GT1 a): In `LS.reihenfolge` blieb ein gelegtes Teil blass in der Box stehen,
  während die Ablage darüber mit jedem Teil wuchs — die beiden Funde oben und weitere in späteren Schritten. Jetzt
  steht es nur noch in der Ablage (Klasse `reihe-wahl`, `stil.css`), in allen 32 Spielen mit dem Baustein. Gemessen
  mit `--schritte` (Stufen s1, s3, s6, Handy und Laptop, je 3 Ziehungen), Aufgabe über dem Rand nach dem zweiten
  Handgriff oder später: vorher Geschichten-Ordner 176 px, Auge-Entdecker 152, Au café 138, Wassertropfen-Reise 113,
  Gemeinde-Helfer 72, Lebenszyklus 54, Hello-Dialog 46, Gedicht-Baukasten 17, Kakao-Weg 10, Energie-Wandler 7.
  Nachgemessen über alle sechs Stufen und alle vier sichtbaren Flächen: übrig nur Energie-Wandler (energie-wandler)
  s6 43 px nach dem letzten Handgriff und Lärm-Wächter (laerm-waechter) s5 auf dem Laptop 16 px nach dem ersten
  richtigen; offen. Ebenfalls offen: Überläufe nach dem falschen Handgriff (Lärm-Wächter s4–s6 bis 89 px,
  Auge-Entdecker s4 76 px, weitere bis 18 px) und Hör-Geschichte (hoer-geschichte) s2 beim Laden 67 px. rahmen.md
  2.2 und 4.3.
- Au café (au-cafe): Die Hör-Aufgaben in s5 und s6 zeigten ☕👂, das ☕ trägt aber auch die heisse Schokolade — das Bild
  verriet sie (BI1 a). Jetzt nur 👂.
- Tests: Skripte „Keine Fehler.“, Eulenpfad geschichten-ordner au-cafe hello-dialog silben-klatscher auge-entdecker
  wassertropfen-reise „Keine Fehler.“
- Offene Überläufe nach der Nachmessung (LERN-55, `--schritte`, alle Stufen): Nach einem Fehler wächst nur die Sprechblase
  (Hinweis immer ganz, BH2 a; Melde-Zeile gleich hoch, R2 a) — das Spiel gibt Platz (BH3 a).
  - Hör-Geschichte (hoer-geschichte) s2: Die Vorschau „Darauf achtest du“ geht weg, wenn die Fragen kommen; sie wiederholte
    die gestellte Frage (Handy 88 px → im Bild).
  - Gedicht-Baukasten (gedicht-baukasten) s6, Reimschema einer Strophe: Gedicht mit mehreren Strophen auf dem Handy in
    16 px und engeren Abständen (193 px → im Bild, nach einem Fehler höchstens 15 px).
  - Lärm-Wächter (laerm-waechter): „Wie gut hilft das?“ (s4) mit Bild links (`bildLinks: "eng"`, 68 px → im Bild); „Was
    schützt deine Ohren?“ (s3) drei Körbe in einer Reihe, flacher (61 → im Bild); Ohr-Aufgaben (s5, s6) zwei Namen
    nebeneinander (`breite` 140), „Wie heisst der Teil, der leuchtet?“ mit dem Bild nach der Bildhöhe, Untergrenze des
    Ohr-Bilds 180 statt 240 px breit (113 → höchstens 18 px in einer von 6 Ziehungen).
  - Auge-Entdecker (auge-entdecker): Die Regeln für Karte, Körbe und Ablage griffen nie (`.ae .korb-karte`, die Bausteine
    hängen sie neben `.ae`), jetzt `.ae ~ …` — der Satz der Karte in s4 stand in 36 px (76 px → im Bild); Weg des Lichts
    (s6) Bild-Untergrenze 120 statt 160 px (58 → im Bild). Hinweis „keine Aufgabe für die Bindehaut“ statt „nicht die
    Aufgabe von die Bindehaut“.
  - Nachgemessen ohne Grafik geschrumpft und ohne seitlichen Überlauf. Offen (unter 45 px, nach einem Fehler, oder nach dem
    letzten Handgriff): Wassertropfen-Reise s4–s6 bis 38 px (Grafik schon an der Untergrenze, eine tiefere half nicht),
    Energie-Wandler s6 43 px, Kakao-Weg s3 21, Bruch-Werkstatt s1–s4 15, Erdzeit-Leiter s5 14, Lebenszyklus s3/s4 12.
- Tests: Skripte „Keine Fehler.“, Eulenpfad hoer-geschichte gedicht-baukasten laerm-waechter auge-entdecker „Keine
  Fehler.“
- Kleine Überläufe (LERN-55, `--schritte`, alle Stufen und Flächen):
  - Rahmen: `LS.lesetext` misst auch neu, wenn sich die Bühne ändert (wie `restHoehe`) — die wachsende Sprechblase nach
    einem Fehler schob sonst die Antworten unter den Rand (Kakao-Weg s3 21 px). Wirkt in Figuren-Spiegel,
    Gattungs-Kenner, Kakao-Weg, Korrektur-Stift, Sachtext-Spurensuche. rahmen.md 4.3.
  - Bruch-Werkstatt (bruch-werkstatt): Kreis zum Ablesen nach der Bildhöhe (180–240 px), zum Antippen fest (15 px → im Bild).
  - Erdzeit-Leiter (erdzeit-leiter): Uhrzeiten (`breite` 140) und Zeitspannen (150) zu zweit (14 und 19 px → im Bild).
  - Lebenszyklus (lebenszyklus): „Wie kommen die Jungen zur Welt?“ auf dem Handy mit kleiner Karte, drei Körbe in einer
    Reihe (12 px → im Bild).
  - Wassertropfen-Reise (wassertropfen-reise): Reise-Grafik Untergrenze 200 statt 240 px (s4 38 → im Bild); Kläranlage
    Stationen flacher (kleines Bild über dem Namen; Bild links probiert und verworfen: „Belebungsbecken“ lief seitlich
    über und brach mitten im Wort, eine Spalte war mit sechs Stationen 138 px zu hoch), volle Ablage enger (s6 am Ende
    65 px → höchstens 18 px nach dem ersten richtigen Handgriff).
  - Energie-Wandler (energie-wandler): gelegte Teile der Kette kleiner (s6 am Ende 67 px → im Bild); „Ein Wandler passt
    nicht“ mit flachen Wandlern (33 px → im Bild).
  - Gattungs-Kenner (gattungs-kenner): Merkmale mit engeren Zeilen (s6 16 px → im Bild).
  - Nachgemessen: keine Grafik geschrumpft, nichts seitlich; übrig Erdzeit-Leiter s5 6 px und Wassertropfen-Reise s6
    18 px (je nach einem Handgriff).
- Tests: Skripte „Keine Fehler.“, Eulenpfad wassertropfen-reise erdzeit-leiter gattungs-kenner energie-wandler
  bruch-werkstatt lebenszyklus kakao-weg figuren-spiegel korrektur-stift sachtext-spurensuche „Keine Fehler.“
- Körbe über alle Spiele gemessen (29 Spiele mit `LS.koerbe`, alle Stufen, Handy 375 × 660 und 375 × 812, je 3 Ziehungen):
  Eine Rahmen-Regel „drei Körbe auf dem Handy in einer Reihe“ half nur dem Gemeinde-Helfer s6 (39 px → im Bild), die
  übrigen Unterschiede waren Ziehungen; in 106 px breiten Körben passten „Schwimmbad“, „Feuerwehr“, „Bibliothek“,
  „Werkhof“ (Gemeinde-Helfer s2) nicht, die Seite lief seitlich über — verworfen. Eine Probe je Korb (Inhalt breiter als
  der Korb, 605 Körbe) fand die eigene Regel im Lärm-Wächter (laerm-waechter) s3 („Lärmschutzwand“ 120 in 106 px): dort
  jetzt zu zweit und flach (in 10 Ziehungen im Bild). Heute schon zu lang, unabhängig davon: Gemeinde-Helfer s2–s4
  „Abfallentsorgung“ 182 und „Gemeindehaus“ 169 in 164 px, Instrumente s4–s6 „Blechblasinstrument“ 172 und
  „Holzblasinstrument“ 168 in 162 px (Korbschrift auf dem Handy mindestens 18 px, kein Umbruch im Wort); offen.
- Tests: Skripte „Keine Fehler.“, Eulenpfad laerm-waechter „Keine Fehler.“
- Schrift im Korb (Entscheid WE1 a): Passt ein Name nicht in seinen Korb, wird dessen Schrift Pixel um Pixel kleiner, bis
  14 px (`spiel.js`, wie der Titel nach R4 a). Instrumente „Blechblasinstrument“, „Holzblasinstrument“ und Gemeinde-Helfer
  „Gemeindehaus“ passen jetzt; „Abfallentsorgung“ ragte neben dem Bild auch in 14 px heraus — im Gemeinde-Helfer
  (gemeinde-helfer) bricht der Name jetzt unter das Bild, wenn er nicht daneben passt (s2–s5 auf dem Handy nachgemessen,
  im Bild). `tools/bildhoehe.js` meldet „Inhalt breiter als Knopf“ (Antwort- und Korbknöpfe, je Stand, Code 1); dabei
  `split(/\\s+/)` im Seitencode berichtigt (im Template-String kam es als `/s+/` an). rahmen.md 4.3 und 20.
  Die Meldung zeigt in den Körbe-Spielen auch Antwortknöpfe mit zu langem Inhalt (Datei-Typen, Gattungs-Kenner,
  Gemeinde-Helfer s5, Tier-Sortierer, Früher-Heute, Zeit-Schätzer) — nicht Teil von WE1, Messung über alle Spiele folgt.
- Tests: Skripte „Keine Fehler.“, Eulenpfad gemeinde-helfer instrumente tier-sortierer lebenszyklus laerm-waechter
  „Keine Fehler.“
- Schrift je Box (Entscheid WE2 a): Auch Antwortknöpfe (`LS.auswahl`) und Teile (`LS.reihenfolge`) passen ihre Schrift an;
  alle Knöpfe einer Box werden um dieselben Pixel kleiner (keine Antwort fällt durch kleinere Schrift auf), höchstens bis
  14 px, ein Knopf mit kleinerer eigener Schrift bleibt dort stehen. Körbe ebenso (vorher je Korb). Für eigene
  Knopfkisten `LS.schriftEinpassen(box, auswahl)`. Vorher über alle Spiele (alle Stufen, Handy, Laptop, Tablet quer, eine
  Ziehung): 46 Knöpfe in 14 Spielen auf 29 Seiten mit Inhalt breiter als der Knopf (Au café „Schokoladenglace“ bis 37 px,
  Datei-Typen 30, Früher-Heute „Dampflokomotive“ 21 …), danach 4 Seiten. Au café (au-cafe): Sache und Bestellung mit Bild
  links (`bildLinks`), auf Handy und Tablet hoch Bild über dem Namen; Gattungs-Kenner (gattungs-kenner) ruft
  `LS.schriftEinpassen` für seine eigenen Knöpfe; nachgemessen im Bild und ohne zu enge Knöpfe. Übrig: Datei-Typen s6 auf
  dem Handy 2 px (kleine Zeile „zum Beispiel PowerPoint“, eine von 8 Ziehungen). rahmen.md 4.3.
- Tests: Skripte „Keine Fehler.“, Eulenpfad au-cafe gattungs-kenner datei-typen frueher-heute rechentrick-detektiv
  gemeinde-helfer instrumente „Keine Fehler.“
- Voller Eulenpfad-Lauf auf `f935860` „Keine Fehler.“ (3906 s).
- Abschluss: Report `docs/eulenpfad/report/LERN_Session47_2026-11-18.md`, Handover nachgeführt (Haltepunkt aufgelöst).

## 2026-11-19 — LERN_Session48
- Zug-Pakete (ZU1 a, LERN-55), Paket 1: Die 26 Spiele, die nur die Zifferntastatur nutzen, nennen `opt.erwartet`, damit
  `tools/bildhoehe.js --schritte` ihre Aufgaben zu Ende spielt: Dezimal-Rakete (dezimal-rakete), Doppel-Spiegel
  (doppel-spiegel), Einmaleins-Blitz (einmaleins-blitz), Fahrplan-Rechner (fahrplan-rechner; Uhrzeit, Dauer und
  Dezimalstunden wie die Prüfung), Flächen-Pixel (flaechen-pixel), Flächenmass-Treppe (flaechenmass-treppe),
  Komma-Messband (komma-messband), Masse-Umwandler (masse-umwandler), Muster-Fortsetzer (muster-fortsetzer),
  Quader-Volumen (quader-volumen; `tippfeld` reicht `erwartet` durch, beim Zählen je Schritt Schicht, Schichten,
  zusammen), Rechen-Maschine (rechen-maschine), Rechen-Rakete (rechen-rakete), Rechengeschichten (rechengeschichten),
  Rechentrick-Detektiv (rechentrick-detektiv), Rest-Rätsel (rest-raetsel; Ergebnis und Rest), Schriftlich-Werkstatt
  (schriftlich-werkstatt; je Spalte und Übertrag), Speicher-Leiter (speicher-leiter), Stufenzahl-Schieber
  (stufenzahl-schieber), Velo-Tabelle (velo-tabelle), Zahlen-Hüpfer (zahlen-huepfer; je Seerose), Zahlen-Waage
  (zahlen-waage), Zahlenhaus (zahlenhaus), Zahlenrätsel-Tresor (zahlenraetsel-tresor), Zehner-Ergänzer
  (zehner-ergaenzer), Zeit-Schätzer (zeit-schaetzer), Zufalls-Skala (zufalls-skala).
- Messung mit `--schritte` (die 26 Spiele, s1–s6, Handy, zwei Ziehungen): 0 Spiele ohne Zug, 0 Seiten nicht zu Ende
  gespielt. Neu sichtbar, meist nach dem falschen Handgriff (Stand 1): Speicher-Leiter s6 103 px, Rechentrick-Detektiv
  quer 88 px (Stand 2), Fahrplan-Rechner s2 78 px, Quader-Volumen s6 58 px, Flächen-Pixel s6 41 px, Komma-Messband s6
  41 px und kleinere — für den Rest LERN-55 vorgemerkt.
- Tests: Skripte „Keine Fehler.“, Eulenpfad die 26 Spiele „Keine Fehler.“
- Geführte Runde in `tools/pruefe_spiele.js` (Entscheid ZP1 a): je Spiel und Stufe zusätzlich eine Runde mit den Zügen
  des Rahmens statt Zufallsklicks — je Aufgabe ein falscher, dann richtige Handgriffe bis zum Lösen, auch in späteren
  Schritten; alle Prüfungen laufen mit, Funde mit „geführt:“ davor. Bleibt eine Aufgabe ohne Zug stehen („Zug“), ist das
  bis zum Ende der Zug-Pakete ein Hinweis (`ZUG_PFLICHT`), danach ein Fehler; Übersicht am Ende; `--gefuehrt=0` schaltet
  ab. Kostet kaum Zeit (sechs Spiele: 42 s ohne, 40 s mit). rahmen.md 8.
- Ersatz-DOM `tools/pruef_dom.js`: Ereignisse übernehmen `clientX`/`clientY` aus dem Konstruktor (vorher immer 0), SVG-Punkte
  rechnen ohne Bildschirm als Identität um (vorher immer (0, 0)); nutzt nur der Zahlenstrahl-Pfeil.
- Zug-Pakete, Paket 2: die 26 Spiele mit Zifferntastatur und eigenen Knöpfen nennen `opt.erwartet` und melden
  `ctx.testZug` für ihre eigenen Lösungsschritte: Schoggi-Brüche (bruch-rechteck), Dezimal-Rutsche (dezimal-rutsche),
  Daten-Detektiv (diagramm-detektiv; Bänder tragen `data-wert`), Möglichkeiten-Finder (glace-kombinator), Hebel-Wippe
  (hebel-wippe), Hundertertafel-Detektiv (hundertertafel), Kiosk-Kasse (kiosk-kasse), Malkreuz (malkreuz),
  Mittelwert-Türme (mittelwert-waage), Nombres-Rallye (nombres-rallye), Platzhalter-Geschichten (platzhalter-geschichten), Preis-Tabelle
  (preis-tabelle), Prozent-Brücke (prozent-bruecke), Punkte-Schieber (punkte-schieber), Quelle heure? (quelle-heure),
  Probe-Stempel (rechenprobe), Runden-Rutsche (runden-rutsche), Sachaufgaben-Kompass (sachaufgaben-kompass), Tabellen-Post
  (tabellen-post), Taschengeld-Planer (taschengeld-planer), Uhr-Werkstatt (uhr-werkstatt), Würfel-Zähler
  (wuerfel-zaehler), Zahlen-Baukasten (zahlen-baukasten), Zahlenmauer-Baumeister (zahlenmauer), Zahlenstrahl-Pfeil
  (zahlenstrahl-pfeil; der falsche Zug der Tastatur, Wert + 1, läge in der Toleranz — das Spiel meldet dafür einen eigenen
  falschen Zug), Zehntel-Lupe (zehntel-lupe). Spiellogik, Texte und Aussehen unverändert.
- Messung mit `--schritte` (die 26 Spiele, s1–s6, Handy, drei Ziehungen): 0 Spiele ohne Zug, 0 Seiten nicht zu Ende
  gespielt. Neu sichtbare Überläufe der Aufgabe für den Rest LERN-55: Möglichkeiten-Finder s6 163 px (Stand 20), s4 103,
  s3 77; Probe-Stempel s5 147, s6 127, s4 88, s3 76; Würfel-Zähler s3 138 (ab der Tastatur); Platzhalter-Geschichten s6
  102; Hebel-Wippe s5 65; Daten-Detektiv s4/s5 63; Taschengeld-Planer s3 50; Uhr-Werkstatt s6 36; Zehntel-Lupe s5 31.
- Geführt neu gemeldet, ein Hinweis: Mittelwert-Türme s5 „Hinweis verrät … «5»“ — die 5 ist die Anzahl Werte, Fehlalarm
  der bestehenden Prüfung (die Zufallsrunde traf die Aufgabe nicht).
- Tests: Skripte „Keine Fehler.“, Eulenpfad die 26 Spiele „Keine Fehler.“ („Geführt (ZP1 a): 150 Stufen ganz
  durchgespielt“, Zahlenstrahl-Pfeil nach der Berichtigung im Ersatz-DOM „6 Stufen ganz durchgespielt“)
- Falscher Zug der Tastatur (Entscheid ZF1 a): `LS.tastatur` nimmt `opt.erwartetFalsch` (Zahl, Text oder Funktion; leer =
  kein falscher Handgriff möglich) für Spiele, in denen Wert + 1 noch gilt (Toleranz, mehrere Lösungen); ohne die Angabe
  wie bisher Wert + 1. Zahlenstrahl-Pfeil (zahlenstrahl-pfeil) nennt einen Strich daneben und braucht seinen eigenen
  falschen Zug nicht mehr (er drückte die Tasten über ihre Beschriftung). rahmen.md 4.3.
- Tests: Skripte „Keine Fehler.“, Eulenpfad zahlenstrahl-pfeil einmaleins-blitz quader-volumen kiosk-kasse „Keine
  Fehler.“; Messung mit `--schritte` Zahlenstrahl-Pfeil (s1–s6, Handy, drei Ziehungen): 0 Spiele ohne Zug, 0 Seiten nicht
  zu Ende gespielt, in jeder Seite ein falscher Handgriff.
- Zug-Pakete, Paket 3 (ZU1 a, LERN-55): die 73 übrigen Spiele mit eigenen Knöpfen melden `ctx.testZug` für jeden eigenen
  Lösungsschritt (richtig wie ein Kind antippt, falsch ein anderer Knopf, ein zu frühes „Prüfen“ oder ein erlaubter,
  nicht lösender Zug; geht keiner, `false`): Auge-Entdecker (auge-entdecker), Begriffs-Geodreieck (begriffs-geodreieck),
  Bionik-Paare (bionik-paare), Blutkreislauf-Lotse (blutkreislauf-lotse), Braille-Finger (braille-finger),
  Bruch-Pizzeria (bruch-werkstatt), Calendrier (calendrier), Diagramm-Wahl (diagramm-wahl), Erdzeit-Leiter
  (erdzeit-leiter), Fehler-Lupe (fehler-lupe), Figuren-Spiegel (figuren-spiegel), Finger-Zähler (finger-zaehler),
  Gattungs-Kenner (gattungs-kenner), Gedicht-Baukasten (gedicht-baukasten), Gefühle-Radar (gefuehle-radar),
  Gegenteil-Wippe (gegenteil-wippe), Geheimschrift-Knacker (geheimschrift-knacker), Gerecht-Teiler (gerecht-teiler),
  Geschichten-Ordner (geschichten-ordner), Himmels-Forscher (himmels-forscher), Hör-Geschichte (hoer-geschichte),
  Hör-Reporter (hoer-reporter), Jahreskreis-Ordner (jahreskreis), Klang-Wichtel (klang-wichtel), König in der Falle
  (koenig-falle), Komma-Jagd (komma-jagd), Kompass-Spiel (kompass), Koordinaten-Schatzsuche (koordinaten-schatz),
  Korrektur-Stift (korrektur-stift), Lärm-Wächter (laerm-waechter), Merk-Blick (merk-blick), Morphem-Schere
  (morphem-schere), Netz-Falter (netz-falter), Pentomino-Puzzle (pentomino-puzzle), Pflanzen-Bestimmer
  (pflanzen-bestimmer), Plan-Leser (plan-leser), Rechteck-Labor (rechteck-labor), Rede-Zeichen (rede-zeichen),
  Regel-Lücke (regel-luecke), Reim-Paare (reim-paare), Rhythmus-Diktat (rhythmus-diktat), Roboter-Pfad (roboter-pfad),
  Satz-Reparatur (satz-reparatur), Schweiz-Karten-Suche (schweiz-karte), Sentence-Builder (sentence-builder),
  Son-Lauscher (son-lauscher), Sortier-Kiste (sortier-kiste), Spelling-Bee (spelling-bee), Spiegel-Raster
  (spiegel-raster), Stein-Duell (stein-duell), Steine fangen (steine-fangen), Stellen-Detektiv (stellen-detektiv),
  Stimmt immer? (stimmt-immer), Tageslauf-Sonne (tageslauf-sonne), Teddy-Versteck (teddy-versteck), Teiler-Spürnase
  (teiler-detektiv), Tipp-Trainer (tipp-trainer), Tonleiter-Treppe (tonleiter-treppe), Trenn-Schere (trenn-schere),
  Verben-Fächer (verben-faecher), Vergleichs-Krokodil (vergleichs-krokodil), Wassertropfen-Reise (wassertropfen-reise),
  Weather-Report (weather-report), Wörter-Trenner (woerter-trenner), English Word-Match (word-match), Wort-Spürnase
  (wort-spuernase), Wortarten-Probe (wortarten-probe), Wortarten-Sortierer (wortarten-sortierer), Wortfamilien-Baum
  (wortfamilien-baum), Würfel-Kipper (wuerfel-kipper), Zeitreise-Verben (zeitreise-verben), Zielzahl-Jagd
  (zielzahl-jagd), Ziffernkarten (ziffernkarten). Spiellogik, Texte und Aussehen unverändert; Pentomino-Puzzle: die
  Lege-Regel steht jetzt einmal (`wohin`), für Tippen und Zug.
- Sudoku-Baustein `spiele/gemeinsam/sudoku.js`: `SUDOKU.spiel` meldet den Zug selbst (richtig: Notizen aus, falsch
  gefülltes Feld leeren, sonst das erste leere Feld und seine Zahl; falsch: eine Zahl, die schon in Zeile, Spalte oder
  Gebiet steht) für Zahlen-Sudoku (zahlen-sudoku), Bilder-Sudoku (bilder-sudoku), Gebiets-Sudoku (gebiets-sudoku),
  Vergleichs-Sudoku (vergleichs-sudoku), Käfig-Sudoku (kaefig-sudoku); Sudoku-Duell (sudoku-duell) eigener Zug (richtig
  ein Gewinnzug, falsch ein erlaubter, der nicht gewinnt).
- Damit haben alle 175 Spiele ihre Züge: `ZUG_PFLICHT` in `tools/pruefe_spiele.js` ist an, eine Aufgabe ohne Zug ist ein
  Fehler. Grenze der Züge je Aufgabe dreimal `ctx.schritte`, mindestens 80, die erste Aufgabe 300 (vorher fest 80; ein 9
  × 9-Sudoku braucht bis gegen 100); Übersicht zählt Zug-Funde auch als Fehler. `tools/bildhoehe.js`: höchstens 200
  statt 60 Züge je Ziehung; gemessen wird erst, wenn die Aufgabe steht (bis 10 s, sonst „Aufgabe nach 11,5 s nicht
  gezeichnet“) — unter Last waren Sudokus, Figuren-Spiegel s6 und Plan-Leser s3 nach 1,5 s noch leer und galten als
  nicht zu Ende gespielt. rahmen.md 8 und 20.
- Messung mit `--schritte` je Teil (s1–s6, Handy, drei Ziehungen; Sudokus und Figuren-Spiegel nachgemessen mit dem
  berichtigten Werkzeug): 0 Spiele ohne Zug, 0 Seiten nicht zu Ende gespielt. Neu sichtbare Überläufe der Aufgabe für
  den Rest LERN-55, die grössten: Weather-Report s6 259 px, Braille-Finger s5 250, Verben-Fächer s2 192, Hör-Geschichte
  s6 176, Stimmt immer? s6 175, Rede-Zeichen s4 147, Wortarten-Probe s6 143, Figuren-Spiegel s6 121, Hör-Reporter s1 107,
  Plan-Leser s6 97.
- Geführt neu gemeldet, ein Hinweis: Himmels-Forscher s1 „Merkmal «art» kam trotz Serienbremse 4-mal hintereinander
  («zuOderAb»)“ — vorgemerkt.
- Tests: Skripte „Keine Fehler.“; Eulenpfad je Teil die eigenen Spiele „Keine Fehler.“; über alle Spiele gekürzt (eine
  Runde, 10 Generator-Aufgaben, ohne Kind, Endlos und Tab): „Geführt (ZP1 a): 1050 Stufen ganz durchgespielt; 0 Spiele
  mit einer Aufgabe ohne Zug“, „Keine Fehler.“; pentomino-puzzle nach dem Umbau „Keine Fehler.“
- Ein Zug, der wartet (Entscheid ZW1 a): `fn(richtig)` darf `"warte"` geben, wenn gerade nichts zu tun ist (Stimme liest
  vor, Bild wird gezeigt, die Eule antwortet); `LS.pruefung.zug` gibt es durch und fragt dann keinen früheren Zug. Die
  Werkzeuge warten ohne Messung und ohne Zählen, höchstens 30 s je Aufgabe, und fragen einen wartenden falschen
  Handgriff später nochmals (inzwischen den richtigen, der etwa „▶ Los!“ antippt). `LS.losGehts` meldet seinen Zug
  selbst: richtig „▶ Los!“, dann „warte“ bis zum Zeigen (auch beim kurzen 👀). Vorher gaben sechs Spiele beim Warten
  `true` ohne Handgriff; jetzt „warte“: Hör-Geschichte (hoer-geschichte) und Hör-Reporter (hoer-reporter; der falsche
  Handgriff fiel dort aus, wenn die Aufgabe beim Zuhören begann), Merk-Blick (merk-blick; ohne eigenen Los-Zug), König
  in der Falle (koenig-falle), Steine fangen (steine-fangen), Stimmt immer? (stimmt-immer). rahmen.md 4.2.
- Tests: Skripte „Keine Fehler.“; Eulenpfad hoer-geschichte hoer-reporter merk-blick koenig-falle steine-fangen
  stimmt-immer blitzlesen finger-zaehler punkte-blitz „Keine Fehler.“; Messung mit `--schritte` dieser neun (s1–s6,
  Handy, drei Ziehungen): 0 Spiele ohne Zug, 0 Seiten nicht zu Ende gespielt, auf jeder Seite ein falscher Handgriff;
  über alle Spiele gekürzt (eine Runde, 10 Generator-Aufgaben, ohne Kind, Endlos und Tab) „Geführt (ZP1 a): 1050 Stufen
  ganz durchgespielt; 0 Spiele mit einer Aufgabe ohne Zug“, „Keine Fehler.“
- Voller Eulenpfad-Lauf auf `ec5ba6f` „Keine Fehler.“ (3941 s, „Geführt (ZP1 a): 1050 Stufen ganz durchgespielt; 0
  Spiele mit einer Aufgabe ohne Zug“).
- Messung über alle Spiele mit `--schritte` (s1–s6, Handy und Tablet quer, zwei Ziehungen): alle zu Ende gespielt;
  Aufgabe über dem Rand auf 113 Seiten in 53 Spielen (5 beim Laden, 48 nach dem falschen Handgriff, 60 in späteren
  Schritten), seitlich Zahlen-Waage (zahlen-waage) s6 20 px und Verben-Fächer s4/s6 2 px — Liste für den Rest LERN-55.
- Stand nach dem Lösen (Entscheid ÜL1 a): `tools/bildhoehe.js --schritte` zählt den Stand nach dem lösenden Handgriff
  nicht mehr für „über dem Rand“ und nennt ihn getrennt („Nach dem Lösen über dem Rand“, ohne Code 1); seitlich und enge
  Knöpfe zählen dort weiter. Betraf 25 Ziehungen (Weather-Report, Möglichkeiten-Finder, Hör-Geschichte, Stimmt immer?,
  Zielzahl-Jagd …); Fehler-Lupe (fehler-lupe) s6 zeigt dort den reparierten Text und bleibt bei den Behebungen.
  rahmen.md 20.
- Tests: Messung mit `--schritte` weather-report glace-kombinator hoer-geschichte zielzahl-jagd fehler-lupe stimmt-immer
  (s3–s6, Handy, zwei Ziehungen): 0 Spiele ohne Zug, 0 Seiten nicht zu Ende gespielt, getrennte Liste nach dem Lösen mit
  acht Seiten.
- Überläufe in späteren Schritten behoben (BH3 a, LERN-55), 52 Spiele in vier Paketen, nur die Seite je Spiel (Grafik
  nach `--rest-h`, Teile nebeneinander, Erledigtes kompakt, engere Abstände auf dem Handy):
  - Deutsch und Lesen: Verben-Fächer (verben-faecher; nach dem Fächer Regelkarte und erste Frage weg, der Fächer eine
  Zeile; s2 199 px, s4 157, dazu 2 px seitlich → 0), Wortarten-Probe (wortarten-probe; eine Probe, die nicht klappt,
  verliert ihren Knopf, ihr Befund bleibt; s6 143 → 0), Rede-Zeichen (rede-zeichen; „Prüfen ✓“ bei den Tasten, der
  zweite Teil der Frage auf schmalen und niedrigen Bildern nur noch in Blase und Hilfe; s5 130 → 0), Morphem-Schere
  (morphem-schere; 95 → 0), Regel-Lücke (regel-luecke), Wörter-Brücke (parallelwort-bruecke; L0 26 → 0), Figuren-Spiegel
  (figuren-spiegel; gelöste Fragen je eine Zeile, Antippen zeigt sie ganz; 101 → 0), Fehler-Lupe (fehler-lupe;
  Wortknöpfe 42 px auf dem Handy; s6 92 px, nach dem Lösen 98 → 0, der reparierte Satz steht im Bild),
  Platzhalter-Geschichten (platzhalter-geschichten; 127 → 0), Hör-Geschichte (hoer-geschichte; das Buch wird mit den
  Fragen eine Zeile; s6 135 → 0), Hör-Reporter (hoer-reporter; ebenso, die Vorschau „Darauf achtest du:“ fällt mit den
  Fragen weg, `LS.schriftEinpassen` für die Antworten; 73 → 0), Kulturen-Koffer (kulturen-koffer; Rätsel zu dritt, auf
  dem Handy Bild links neben Text, Karte und Quellen; s6 115, s5 19, s3 25 → 0), Lärm-Wächter (laerm-waechter).
  - Rechnen: Fahrplan-Rechner (fahrplan-rechner; Anzeige einzeilig, Legende neben dem Fahrplan, quer die Anzeige der
  Abfahrtstafel über die ganze Breite; s6 117 → 0), Stein-Duell (stein-duell), Speicher-Leiter (speicher-leiter),
  Kompass-Spiel (kompass; Frage neben dem Plan; bis 112 → 0), Masse-Umwandler (masse-umwandler), Hebel-Wippe
  (hebel-wippe), Quelle heure? (quelle-heure; Uhren nach `--rest-h`, Zeiger-Knöpfe nebeneinander), Taschengeld-Planer
  (taschengeld-planer; „✓ im Korb“ als Schild), Flächen-Pixel (flaechen-pixel), Geheimschrift-Knacker
  (geheimschrift-knacker; Scheibe ab 160 px), Kiosk-Kasse (kiosk-kasse), Zehner-Ergänzer (zehner-ergaenzer; „+ ?“
  überdeckte die Frage), Zehntel-Lupe (zehntel-lupe; Strahlen ab 280 statt 400 px, Zahlen grösser gezeichnet).
  - Gemischt: Braille-Finger (braille-finger; Zelle neben Buchstabe und Knöpfen, Tafel je Zehnerreihe eine Zeile; s5 250 →
  0), Würfel-Zähler (wuerfel-zaehler; 134 → 0), Stimmt immer? (stimmt-immer; drei Figuren in einer Reihe), Probe-Stempel
  (rechenprobe; Robo neben der Rechnung, Probe und Anzeige in einer Zeile; bis 147 → 0), Himmels-Forscher
  (himmels-forscher), Würfelbau-Blick (wuerfelbau-blick), Sachaufgaben-Kompass (sachaufgaben-kompass),
  Rechentrick-Detektiv (rechentrick-detektiv; quer Tastatur rechts), Möglichkeiten-Finder (glace-kombinator),
  Roboter-Pfad (roboter-pfad; Antipp-Felder ab 41 px), Runden-Rutsche (runden-rutsche), Pentomino-Puzzle
  (pentomino-puzzle; Werkzeuge in einer Reihe). In Würfel-Zähler, Probe-Stempel und Sachaufgaben-Kompass sagt die Eule
  beim nächsten Schritt kurz „Genau! …“, sonst stand der Fehlerhinweis des vorigen Schritts bis fünf Zeilen weiter
  (Entscheid EU1 a: die Sätze bleiben).
  - Kleine Fälle: Quader-Volumen (quader-volumen; s6 Körper ab 60 %), Daten-Detektiv (diagramm-detektiv; Frage und Anzeige
  neben dem Diagramm), Rechen-Maschine (rechen-maschine), Finger-Zähler (finger-zaehler), Rhythmus-Leser
  (rhythmus-leser), Mittelwert-Türme (mittelwert-waage), Diagramm-Wahl (diagramm-wahl), Preis-Tabelle (preis-tabelle),
  Muster-Fortsetzer (muster-fortsetzer), Kakao-Weg (kakao-weg), Sortier-Kiste (sortier-kiste), Instrumenten-Kenner
  (instrumente), Erdzeit-Leiter (erdzeit-leiter), Zahlen-Waage (zahlen-waage; lange Terme mittig über dem Balkenende; s6
  20 px seitlich → 0).
- Ton aus in den Werkzeugen mit Chrome (Wunsch Patrik): neu `tools/stumm.js` — `--mute-audio` für Klänge, dazu jede
  Äusserung der Stimme mit Lautstärke 0 (unter Windows spricht `speechSynthesis` an `--mute-audio` vorbei); gesprochen
  wird weiter, Ereignisse und Dauer bleiben gleich. In `tools/bildhoehe.js`, `bilder_aufnehmen.js`, `kontrast.js`,
  `anleitung_bilder.js`.
- Tests: je Paket `bildhoehe.js --schritte` (s1–s6, Handy-, Tablet-, Quer- und Laptop-Sicht, drei Ziehungen) ohne
  Aufgabe über dem Rand, seitlich 0, 0 Spiele ohne Zug, 0 Seiten nicht zu Ende gespielt; Nachmessung aller 52 (Handy und
  quer, zwei Ziehungen; vorher 98 Seiten in 50 Spielen): 2 Seiten (Kulturen-Koffer s5 10 px, Sachaufgaben-Kompass s2 3
  px), beide danach behoben (Kulturen-Koffer fünf Sichten, sechs Ziehungen: 0); `pruefe_spiele.js` aller 52 „Keine
  Fehler.“ (je Paket und nach den letzten Änderungen); Skripte „Keine Fehler.“.
- `tools/bilder_aufnehmen.js` erlaubt die Stimme ohne Antippen (`--autoplay-policy=no-user-gesture-required` wie
  `bildhoehe.js`): Hörspiele kamen dort nie zu den Fragen (Wunsch aus den Überlauf-Paketen).
  `docs/eulenpfad/bildhoehe_offen.md`: Stand LERN_Session48 und die Wünsche an den Rahmen aus den Behebungen (Hinweis
  nach einem Fehler kürzen, Schrittwechsel in der Blase, Tastatur rechts für eigene Behälter, Erledigtes als eine Zeile,
  `--wahl-breite` nur auf dem Handy, `LS.restHoehe` nach einem Fehler, Messung „geschrumpft“ in Rasterspalten, 💡 in
  schmalen Spalten).
- Tests: Bild Hör-Geschichte (hoer-geschichte) s3 auf 375 px bis zur zweiten Frage gespielt, ohne Ton; Skripte „Keine
  Fehler.“.
- Voller Eulenpfad-Lauf auf `f6aea34` vor dem Push „Keine Fehler.“ (3361 s, „Geführt (ZP1 a): 1050 Stufen ganz
  durchgespielt; 0 Spiele mit einer Aufgabe ohne Zug“).

## 2026-11-20 — LERN_Session49
- Entscheidvorlage BZ1 Aufrufe zählen: `docs/entscheid_besucherzahlen.md` (a Cloudflare vor eigener Domain, b Zählpixel
  eines Dienstes, c eigener Meldungsserver; Umzug der Browserdaten bei neuer Domain), offen.
- GitHub Sponsors eingetragen (LERN-50): `portal/unterstuetzen.js` `github` mit Link, `.github/FUNDING.yml`. Rückmeldung
  für Erwachsene „💬 Gefällt Ihnen Eulenpfad?“ mit Link auf GitHub Discussions (`RUECKMELDUNG`, Entscheid RM1 a): Portal-Fusszeile,
  Anleitung für Erwachsene, Verwaltung → Einstellungen; `tools/pruefe_spiele.js` prüft auch `RUECKMELDUNG` ausserhalb
  dieser Stellen. Ko-fi (`kaffee`) und neu Patreon mit den Konten aus PruneCopy, auch in `FUNDING.yml`.
  Sponsors-Profil und Discussions richtet Patrik vor dem Push ein
  (`docs/anleitung_freiwillige_beitraege.md` Abschnitt 6).
- Tests: Skripte „Keine Fehler.“; Eulenpfad zehner-ergaenzer „Keine Fehler.“ (läuft die Prüfung der Beitragslinks mit);
  im Browser Portal, Beitragsseite, Anleitung und Verwaltung als Test-Aufsicht ohne Konsolenfehler.
