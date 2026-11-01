# LERN_Session6_2026-11-01

## Schwerpunkt
Ausgangsfrage war die Reihenfolge der Ziffernbausteine. Daraus wurde eine lange Sitzung über Bedienung,
Geräte und Veröffentlichung: Reihenfolge-Schalter im Spiel, Klassenfilter, Abgleich zwischen Geräten,
eigener Ordner je App der Reihe (Eulenpfad, Lernsteig, Gratwanderung), Veröffentlichung auf GitHub Pages
mit Datenschutz-Scan, Entwickler-Modus mit lokalem Server, Suche mit Rangfolge, Übertrag selbst
schreiben, Einzahlfehler in allen Spielen, und die 3. Klasse vervollständigt (Tipp-Trainer,
Schweiz-Karten-Suche). Entscheide: R1 a, K1 a, K2 a, S1 a, S2 b, G1 a, P1 a, P2 a, D2 a, D3 a, N2 a,
W1 a, E1 a, E2 a (mit Schlüssel), E3 a, SU1 a, UE1 a, K3 a, P56 a (Auswertung in der nächsten Sitzung).

## Neu
- **Reihenfolge der Teile im Spiel** (R1 a): Schalter auf der Stufenwahl; Fehler behoben, dass „nach
  Stufe“ je Spiel eine globale Wahl nicht schlug. Später zu allgemeinen **Spieloptionen** ausgebaut
  (`def.optionen`, `ctx.option`, Profil `optionen`, im Protokoll; Klassen `option-zeile/-schalter`).
- **Filter „🎒 Meine Klasse“** (K1 a, K2 a): Spiele mit Basisklasse ±1, vorgegeben an, je Kind abschaltbar.
- **Abgleich zwischen Geräten** (S1 a, `spiele/gemeinsam/abgleich.js`): Ordner je Gerät, eigene Datei
  `lernspiele-sync-<id>.json` je Gerät, Zusammenführung mit Zeitstempeln je Profilfeld, Löschvermerken,
  höherem Rekordstand und Freigabe-Stand; ohne Ordner über eine Abgleich-Datei. Ziel: vollständige
  Endlos-Ranglisten auf jedem Gerät.
- **Verwaltung mit Untertabs** Konten, Freigabe (je Fach zuklappbar), Abgleich, Entwicklung.
- **Ordner der Reihe** (P1 a): App in `eulenpfad/`, Doku in `docs/eulenpfad/`, Grundgerüste `lernsteig/`
  und `gratwanderung/` mit eigenem Handover, Einstiegsseite `portal/` (N2 a: „Eulenpfad · Lernsteig ·
  Gratwanderung“).
- **GitHub Pages** (P2 a, W1 a): `.github/workflows/pages.yml` veröffentlicht nur `portal/` und die
  App-Ordner in derselben Ordnerstruktur, bricht bei Spielerdaten oder Fotos ab, startet bei jedem Push,
  der sie ändert. Online seit heute: patrikneunteufel.github.io/Lernspiele/ (LERN-17 erledigt).
- **Entwickler-Modus** (E1 a, E2 a, E3 a): Prüfstand aus `katalog.js` nach `pruefstand.js` gelöst;
  `tools/entwickler_server.py` liefert das Repo aus und schreibt mit Schlüssel nur Prüfstand und
  `docs/eulenpfad/bemerkungen.json`; Schlüssel nur in `entwickler.key` (gitignored), im Repo der Hash.
  Leiste im Spiel („✓ Spiel angesehen“, „📝 Bemerkung“ mit laufender Aufgabe, Inhaltslisten als Links),
  Listenansicht aus `docs/eulenpfad/pruefung/listen.json` (vom Prüflisten-Generator, 166 Listen),
  geprüft wird eine Liste erst nach dem Ansehen. Grund der Sperre auf jeder Spielkarte, Filter
  „🔍 Zu prüfen“ für die Aufsicht.
- **Suche mit Rangfolge** (SU1 a, `LS.suche`): Feldgewichte, Wortanfang vor Wortteil, genaue Umlaute vor
  ä = a, ein Tippfehler nur im Namen; Trefferliste mit Grund („gefunden im Thema …“). Zehn feste
  Beispielsuchen im Testskript.
- **Übertrag selbst schreiben** in der Schriftlich-Werkstatt (UE1 a), als Spieloption.
- **Tipp-Trainer** (Basisklasse 3, D.4.A.1.e) und **Schweiz-Karten-Suche** (Basisklasse 4, NMG.8.4.d,
  K3 a) mit `tools/karte_schweiz.py` aus swisstopo swissBOUNDARIES3D (lokal vorhanden im Projekt
  Grid-Arbitrage, `data/raw/kantone.gpkg`).

## Geändert
- **Einzahlfehler** (Hinweis Patrik „1 werden gegessen“): Rechengeschichten mit Einzahlformen
  (`{b:wird|werden}`) und Prüfung je Aufgabe; Kiosk-Kasse, Preis-Tabelle, Diagramm-Detektiv (Feld
  `einzahl` in den Umfragen); Checkliste „1 Idee“. Testskript meldet „Einzahl?“ als Hinweis.
- **Datenschutz** (D2 a, D3 a): Prüfungsdatum der 4. Klasse aus Lernziel-Doku, Handover und drei Reports
  genommen; doppeltes Foto des Lernzielblatts gelöscht.
- **Entwickler-Server** belegt den Port exklusiv (Windows liess drei Python-Server still auf 8765 laufen),
  leitet die Wurzel auf das Portal um, gibt `entwickler.key` und `.git` nie heraus, schreibt Links in die
  Konsole, `--oeffnen` öffnet den Browser.

## Stolperfallen
- **Mehrere Server auf einem Port (Windows):** `http.server` setzt `SO_REUSEADDR`; unter Windows
  teilen sich dadurch mehrere Prozesse still einen Port, Anfragen landen zufällig. Der Entwickler-Server
  nutzt jetzt `SO_EXCLUSIVEADDRUSE`. Alte `python -m http.server` aus Vorschauen können weiterlaufen.
- **Browser-Zwischenspeicher:** `http.server` sendet kein `Cache-Control`; nach Änderungen sah der
  Browser alte Dateien (fehlendes Layout). Der Entwickler-Server sendet `no-store`.
- **Backslash-Hook:** griff viermal bei Python im Heredoc (`\n`); gelöst mit `chr(10)` bzw. dem
  Edit-Werkzeug. Kein neuer Hook nötig.
- **Einrücken per Skript:** Eine innere Klammer `  }` wurde als Funktionsende erkannt; von Hand korrigiert.
- **Hook-/Prüfer-Kandidaten:**
  - Einzahl nach Zahl 1: von Hand in vier Spielen behoben; jetzt als Hinweis im Testskript (kein Hook).
  - Hinweise, die die Lösung verraten, griff zweimal (Tipp-Trainer „Leerschlag“): die bestehende
    Prüfung LERN-19 hat es gefunden — wirkt.
- **Nicht im Arbeitsbaum, aber zu wissen:** GitHub-Pages-Einstellung „GitHub Actions“ hat Patrik gesetzt.

## Verifikation
- `node tools/pruefe_spiele.js` über alle 86 Spiele × 6 Stufen (mit Endlos, Inhaltslisten als Kind, Mix,
  Suche): **„Keine Fehler.“**, 11 bekannte Hinweise „zu wenig verschiedene Aufgaben“, kein Einzahl-Hinweis.
- Einzeln geprüft: Tipp-Trainer und Schweiz-Karten-Suche alle Stufen, als Kind je Liste, im Mix:
  „Keine Fehler.“; zehn Beispielsuchen ✓.
- **Im Browser:** Abgleich mit simulierten Geräten (OPFS als Ordner), Entwickler-Modus über den Server
  (Freischalten, Prüfstand, Bemerkung, Liste ansehen und prüfen, Meldung ohne bzw. mit falschem Server),
  Suche, Filter, Übertrag, Karte (Stufe 1, 3, 4), Tipp-Trainer auf 375 px. Testdaten danach entfernt.
- **Datenschutz-Scan** (Arbeitsbaum, Pages-Auslieferung, Git-Historie aller Commits): keine Kinderdaten,
  Fotos oder Geheimnisse.
- **Nicht geprüft:** Abgleich-Ordner auf echten Geräten und unter `file://` (LERN-31); Safari/iPad;
  Nutzungsbedingungen von swisstopo nicht am Text nachgelesen (nach Wissen: offene Daten mit Quellenangabe).

## Offene Punkte / Plan für die nächste Session
1. **P56 a:** Lehrplan SG für die 5./6. Klasse auswerten (Kompetenzstufen nach dem OP je Fach, Abdeckung
   durch bestehende Stufen, neue Spielideen mit Basisklasse 5/6) → `docs/eulenpfad/spielideen/lehrplan_sg_5-6.md`.
2. **Bemerkungen** aus `docs/eulenpfad/bemerkungen.json` abarbeiten (CLAUDE.md-Regel).
3. Schweiz-Karten-Suche: Seen, Flüsse, Gebirge (swisstopo-Datensatz, Download anfragen); Namen prüfen.
4. LERN-21/LERN-11 mit dem Entwickler-Modus: Spiele ansehen und Listen prüfen (heute 2 von 30 neuen
   Spielen angesehen, 3 von 166 Listen geprüft).
5. LERN-31 auf den echten Geräten; LERN-4 Testrunde mit den Kindern.
