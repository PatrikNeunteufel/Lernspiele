# Eulenpfad — kleine Lernspiele für die Primarschule (Kindergarten bis 6. Klasse)

Name der Sammlung „Eulenpfad“ (Entscheid N1 a, 2026-11-01). Technische Namen bleiben: Ordner
`Lernspiele/`, Speicherschlüssel `lernspiele:*`, gesicherte Dateien `lernspiele-*.json`.

**Ordner** (Entscheide P1 a, P2 a, 2026-11-01): Das Repo trägt die Reihe Eulenpfad → Lernsteig →
Gratwanderung ([Konzept](docs/konzept_reihe_eulenpfad.md)). Je App ein Ordner, der **nur enthält,
was online geht**: `eulenpfad/`, dazu `lernsteig/` und `gratwanderung/` (Grundgerüst seit
LERN_Session6, Stand in `docs/lernsteig/` und `docs/gratwanderung/`). Doku je App unter
`docs/<app>/`, Werkzeuge in `tools/`, Einstiegsseite der Reihe in `portal/`. Pfade in Code-Angaben
(`spiele/…`, `start/…`) gelten relativ zum App-Ordner.

Sammlung kleiner, in sich geschlossener Lernspiele für Primarschüler (Kindergarten bis 6. Klasse; Übersicht der Reihe in `README.md`, Bedienung in `eulenpfad/README.md`).
Jedes Spiel übt **genau ein Lernziel** aus dem jeweiligen Lernzielblatt der Klasse und ist
kindgerecht gestaltet: grosse Bedienelemente (Tablet/Finger), wenig Text, sofortige freundliche
Rückmeldung, kurze Runden (2–5 Minuten), Belohnung über Sterne/Animation statt Punktedruck.

## Gestaltungsregeln (gelten für jedes Spiel)

- **Fachliche Treue zuerst:** Begriffe und Schreibweisen exakt wie im Lernzielblatt/Lehrmittel
  (E, Z, H, T, ZT, HT, M; Tausendertrennung mit schmalem Leerzeichen „30 400", ab fünf Stellen;
  vierstellige Zahlen ungegliedert „4500" — Annahme, mit dem Lehrmittel abzugleichen; Dezimalzahlen
  nur über `LS.dezimalText`, das Zeichen stellt die Aufsicht ein, global oder je Spiel, Standard
  Punkt; Geld nur über `LS.geldText`: bis 3. Klasse „25 Fr. 60 Rp.“, ab 4. Klasse „25.60 Fr.“). Schweizer
  Schreibweise (ss statt ß) in allem, was Kinder sehen.
- **Ein Lernziel je Spiel** (Ausnahme: Ziffernkarten üben G4 und E2 in verschiedenen Stufen),
  Zuordnung Lernziel → Spiel und Stufen in `spiele/gemeinsam/katalog.js` und `docs/eulenpfad/lernziele/`.
- **Sechs Stufen je Spiel, bezogen auf seine Basisklasse** (Entscheid Patrik 2026-10-31): Jedes
  Spiel ist für eine Basisklasse ausgelegt (Katalog, Feld `klasse`). Skala `LS.SKALA` in
  `spiele/gemeinsam/spiel.js`: 1 Einstieg (eine Klasse tiefer) · 2 Üben (Basisklasse, leichter) ·
  3 Klassenziel (Lernziel der Basisklasse) · 4 Knifflig (Basisklasse, schwerer) · 5 Nächste Klasse
  (eine Klasse höher) · 6 Königsstufe (Endgegner, besonders herausfordernd). Die Beschriftung
  „2. Klasse, leichter“ rechnet `LS.stufeFuer` aus der Basisklasse. Direkt anspringen mit
  `?stufe=s1 … s6`; die Klasse im Profil schlägt je Spiel eine Stufe vor (gleiche Klasse → 3,
  tiefer → 1, eine höher → 5, zwei höher → 6).
- **Farben je Stelle wie Calcularis** (Vorgabe Patrik 2026-10-31): Einer rot, Zehner blau,
  Hunderter grün, ab den Tausendern wiederholt (T rot, ZT blau, HT grün, M rot). Sie stehen nur in
  `spiele/gemeinsam/stil.css` (`--st-M` … `--st-E`) und werden **nur für Stellen** benutzt;
  Spielkarten, Stufen und Titel nehmen die `--deko-*`-Farben, damit nichts mit einer Stelle
  verwechselt wird.
- **Reihenfolge der Teile** (Bausteine, Rätselteile): geordnet = grösste Stelle links. Einstellbar
  im Profil global und je Spiel, je Spiel auch auf der Stufenwahl (Entscheid R1 a, 2026-11-01);
  die Wahl je Spiel schlägt die globale („nach Stufe“ = Stufe 1–3 geordnet, 4–6 gemischt); Spiele lesen
  `ctx.geordnet` und sind im Katalog mit `reihenfolge: true` markiert.
- **Fehler sind nicht schlimm:** falsche Antwort → Hinweis und neuer Versuch, kein Punktabzug,
  kein Zeitdruck als Standard. Der Timer ist eine **zuschaltbare** Zusatzschwierigkeit (Zeit um =
  ein Fehler, die Aufgabe bleibt lösbar); gemessen wird die Zeit je Aufgabe aber immer.
- **Inhaltslisten (Wörter, Sätze) stehen in eigenen Dateien** (`woerter.js` im Spielordner), damit
  Eltern oder Lehrperson sie ohne Code prüfen können; jede neue Liste gilt als ungeprüft, bis sie im
  Entwickler-Modus geprüft ist (`spiele/gemeinsam/pruefstand.js`, Entscheid E1 a).
- **Entwickler-Bemerkungen** (`docs/eulenpfad/bemerkungen.json`, seit LERN_Session27 gitignored — nur lokal, IM2 c): zu Beginn jeder Sitzung die offenen
  lesen, beheben und ihren Status auf „erledigt <Datum> (<Sitzung>)“ setzen.
- **Alter:** 2. Klasse (≈ 7–8 J.) fast ohne Lesetext, Symbole/Bilder; 4. Klasse (≈ 9–10 J.)
  kurze Sätze erlaubt.
- **Offline lauffähig**, keine Anmeldung. **Daten über das Kind nur lokal im Browser**
  (Entscheid LERN-5 b, 2026-10-31): Profil (Name, Geburtsdatum — in allen Apps vollständig, gespeichert
  `JJJJ-MM-TT`, gezeigt `TT.MM.JJJJ`; fehlt der Tag wie in Profilen seit LERN_Session14, gilt der Monat und der Tag
  kann nachgetragen werden (Vorgabe Patrik LERN_Session15, ersetzt „Monat ohne Tag“; Umsetzung
  `docs/plan_angleich_reihe.md` B3) —, Klasse mit Aufstiegen, Fokus-Lernziele; im Lernsteig dazu Land und Kanton,
  Niveau je Fach und Prüfungsziel) und je Runde
  ein Protokolleintrag (Spiel, Stufe, Sterne, Fehler, Dauer, falsch gelöste Aufgaben). Nichts
  wird an einen Server geschickt; Sichern/Einlesen als JSON-Datei nur auf Knopfdruck in der
  Statistik. Ausnahme Abgleich (Entscheid S1 a, 2026-11-01): Daten verlassen den Browser nur in
  einen Ordner, den die Aufsicht wählt (Netzwerkordner oder Ordner eines Cloud-Dienstes), ohne PIN.
  Ausnahme Fehlermeldungen (Entscheid M1 a, 2026-11-02): Eine Meldung, die die Aufsicht bestätigt hat, geht
  nur auf ihren Knopfdruck an die Entwicklung — per E-Mail aus ihrem eigenen Mailprogramm, als Bemerkung
  über den lokalen Entwickler-Server oder an den Meldungsserver der Entwicklung im Netz —, ohne den Namen des Kindes
  (Klasse, Aufgabe, Begründung; dazu die Versionen von App, Kern und Protokoll, NS3 a). Zurück kommt
  nur `<app>/meldungen-stand.json` (je Kennung Status und Antwort). Im Lernsteig leitet die oder der Jugendliche
  die eigene Meldung selbst weiter, auf eigenen Knopfdruck und ohne Namen (Klasse, Niveau, Übung, Aufgabe, Eingaben,
  Begründung); eine verbundene Aufsicht kann es ebenfalls (Entscheid C11-2 a, 2026-11-09). Der Entwickler-Server ist
  lokal (`localhost`, `127.0.0.1`, C11-3 a) und schreibt Prüfstand und Bemerkungen. Der Meldungsserver im Netz
  (Entscheide NS1 a, NS2 a, NS2-K a, 2026-11-10) nimmt nur Meldungen an und gibt ihren Stand heraus; die App schickt
  ihm nur über https und nur, wenn er eine Zufallszahl der App mit dem privaten Schlüssel der Entwicklung unterschreibt
  (ECDSA P-256, geprüft mit WebCrypto gegen den öffentlichen Schlüssel im Kern). Ein Abgleich-Server für Spieldaten
  ist damit nicht erlaubt; er bräuchte einen eigenen Entscheid (Notiz in docs/konzept_gruppen.md 5c).
  Ausnahme Abzeichen (Entscheid L1 a, Annahme B1, 2026-11-03): Ein Abzeichen aus dem Tab Erfolge verlässt den
  Browser nur auf Knopfdruck des Kindes als Bild (Vorname, Titel, Datum) über den Teilen-Dialog des Geräts oder als
  gespeicherte Datei.
  Ausnahme Lernsteig (Entscheide AU1 a, AF1 a, AF2 a, 2026-11-05): Eine Aufsicht (Eltern, Lehrperson) sieht am selben
  Gerät nur Konten, die mit ihr verbunden sind — verbunden nur mit Zustimmung des Jugendlichen oder durch Einlesen
  einer Sicherung, die er ihr gegeben hat; beide Seiten können die Verbindung lösen.
  Ausnahme Einladung (Entscheid EL1 a, 2026-11-04): Beim Übertritt in die nächste App verlässt eine Einladung den
  Browser nur auf Knopfdruck der Aufsicht als Link (Fragment, geht nicht an einen Server) oder Datei — nur Vorname,
  Geburtsdatum (oder -monat) und Klasse, im Lernsteig dazu Niveau und Lehrplan; kein Verlauf, keine PIN.
  Keine weiteren Angaben (Nachname, Schule, Foto) erfassen.

## Projekt-Steckbrief
<!-- Kopplungsblock für die globalen ~/.claude-Skills. Format: ~/.claude/docs/steckbrief.template.md -->
- **Projekt:** Eulenpfad (Ordner Lernspiele) — kleine Lernspiele (Mathe, Deutsch, Fremdsprachen, NMG, MI, Musik) vom Kindergarten bis zur 6. Klasse
- **Session-Prefix:** LERN
- **Sprachen:** HTML/CSS/JavaScript ohne Build-Schritt und ohne externe Abhängigkeiten (Entscheid LERN-1, 2026-10-31). App-Ordner `eulenpfad/`: Jedes Spiel ist eine eigenständige Seite `eulenpfad/spiele/<name>/index.html`; Gemeinsames in `eulenpfad/spiele/gemeinsam/`; Startseite `eulenpfad/index.html` mit Anmeldung und Tabs Spiele, Profil, Statistik, Verwaltung (Code je Tab in `eulenpfad/start/`). Läuft offline per Doppelklick.
- **Konventionen:** CLAUDE.md (Abschnitt Gestaltungsregeln)
- **Architektur-Doku:** docs/eulenpfad/rahmen.md (Vertrag Rahmen ↔ Spiele: reservierte CSS-Klassen, Farben, ctx-API, Bausteine, Pflichtfunktionen); docs/lernsteig/rahmen.md (Lernsteig); docs/kern/rahmen.md (gemeinsamer Kern der Reihe: Teile, Schnittstellen, Einbinden, Verteilen, Prüfen)
- **Handover:** docs/eulenpfad/HANDOVER.md
- **Session-Reports:** docs/eulenpfad/report/ · LERN_Session<N>_<YYYY-MM-DD>.md
- **Changelog/Logbuch:** CHANGELOG.md
- **Build:** — (kein Build; `eulenpfad/index.html` im Browser öffnen). Veröffentlichen: `.github/workflows/pages.yml` auf `https://patrikneunteufel.github.io/Lernspiele/`, von selbst bei jedem Push auf master, der `portal/` oder einen App-Ordner ändert (W1 a), sonst von Hand
- **Entwickler-Modus:** `python tools/entwickler_server.py` (Repo ausliefern, Prüfstand und Bemerkungen je App schreiben: Eulenpfad und Lernsteig), ein Schlüssel für das Repo in `entwickler.key` (gitignored); docs/kern/rahmen.md 4.12, docs/eulenpfad/rahmen.md 11, docs/lernsteig/rahmen.md 5e
- **Tests:** Einstieg `node tools/pruefe.js [skripte|kern|lernsteig|gratwanderung|eulenpfad …]` (ohne Angabe die kurzen: Skripte, Kern, Server, Lernsteig, Gratwanderung; den Eulenpfad nur, wenn genannt). `python tools/pruefe_server.py` prüft den Entwickler-Server im Prozess mit leerem Ordner (Version, Protokoll, zugelassene Aufsichten, Eingang, Übernehmen nach docs/richtlinie_freigaben.md). `node tools/pruefe_skripte.js` liest jedes Skript aller Apps ohne Ausführen, prüft jede `<script src>` und dass keins von aussen kommt (Entscheid PK1 a, 0,5 s). Einzeln: `node tools/pruefe_spiele.js [spiel …]` (Eulenpfad), `node tools/pruefe_uebungen.js [übung …]` (Lernsteig, ruft `tools/pruefe_konten.js` mit), `node tools/pruefe_kern.js` (gemeinsamer Kern `kern/`, verteilt mit `python tools/kern_verteilen.py`, Kopien `<app>/kern/kern.js` nie von Hand ändern). Während eines Umbaus (globale Regel „Testläufe während eines Umbaus“): `pruefe_kern.js` und das Lernsteig-Skript ohne Browser laufen ganz (kurz), der Eulenpfad (alle Spiele, rund 25 min) als Stichprobe mit Vergleich der Klickzahlen gegen den letzten vollen Lauf; voll am Ende und vor jedem Push auf master (Pages veröffentlicht). Dazu manuell im Browser: Desktop, Tablet 768 px, Handy 375 px; jede Kombination Spiel × Stufe lädt ohne Konsolenfehler; Aufgabengeneratoren je Stufe mit einigen tausend Zufallsaufgaben auf Zahlenraum und gültige Lösung prüfen). Bildhöhe je Gerät: `node tools/bildhoehe.js` (Server nötig; docs/eulenpfad/rahmen.md Abschnitt 20). Jedes Testskript merkt seine Schlusszeile in `.temp/pruefung/<skript>.json` (gitignored, `tools/testausgabe.js`); Testzahlen in Commit-Message und CHANGELOG von dort übernehmen — der projektlokale Stop-Hook `.claude/hooks/testzahlen.py` weist eine Commit-Message im Chat ab, deren Zahlen in keinem heutigen Lauf stehen (Entscheid HK1 a; Ausnahme `TESTZAHLEN_OK`)
- **Git-Hook (HK2 a):** `tools/git-hooks/commit-msg` weist einen Commit ab, der eine Übung oder ein Spiel ändert, ohne sie in der Message zu nennen (Id oder Anzeigename; Sammel-Commits über mehr als zehn ungeprüft). Einschalten macht Patrik einmal je Klon: `git config core.hooksPath tools/git-hooks`; prüfen ohne Commit: `python tools/git-hooks/commit_msg.py --verlauf`
- **Sensible Daten:** Namen, Geburtsmonat, Alter und Lernstand der Kinder nur im Browser (localStorage, Schlüssel `lernspiele:*`) und in selbst gesicherten JSON-Dateien — solche Dateien nie ins Repo; keine Namen, Fotos oder Handschrift von Kindern in Spielen/Commits; Lernzielblätter liegen nur als Material in material/
- **Bewusste Vereinfachungen:** —
- **Deliverables:** je Spiel eine lauffähige Seite; Lernziel-Abdeckung in docs/eulenpfad/lernziele/
- **Domänen-Skills (lokal):** —
- **Beim Start laden:** —
