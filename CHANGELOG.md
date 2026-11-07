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
