# Lernspiele — kleine Lernspiele für die 2. und 4. Klasse

Sammlung kleiner, in sich geschlossener Lernspiele für Primarschüler (2. und 4. Klasse).
Jedes Spiel übt **genau ein Lernziel** aus dem jeweiligen Lernzielblatt der Klasse und ist
kindgerecht gestaltet: grosse Bedienelemente (Tablet/Finger), wenig Text, sofortige freundliche
Rückmeldung, kurze Runden (2–5 Minuten), Belohnung über Sterne/Animation statt Punktedruck.

## Gestaltungsregeln (gelten für jedes Spiel)

- **Fachliche Treue zuerst:** Begriffe und Schreibweisen exakt wie im Lernzielblatt/Lehrmittel
  (E, Z, H, T, ZT, HT, M; Tausendertrennung mit schmalem Leerzeichen „30 400", ab fünf Stellen;
  vierstellige Zahlen ungegliedert „4500" — Annahme, mit dem Lehrmittel abzugleichen). Schweizer
  Schreibweise (ss statt ß) in allem, was Kinder sehen.
- **Ein Lernziel je Spiel** (Ausnahme: Ziffernkarten üben G4 und E2 in verschiedenen Stufen),
  Zuordnung Lernziel → Spiel und Stufen in `spiele/gemeinsam/katalog.js` und `docs/lernziele/`.
- **Fünf Stufen je Spiel** auf einer gemeinsamen Skala (`LS.SKALA` in `spiele/gemeinsam/spiel.js`):
  1 Einsteiger (ab 2. Klasse, bis 100) · 2 Entdecker (bis 1000) · 3 Grundanforderung und
  4 Erweitert (wie das Lernzielblatt der 4. Klasse) · 5 Profi (Herausforderung). Die Stufe wird
  per `?stufe=s1 … s5` direkt angesprungen; die Klasse im Profil schlägt eine Stufe vor.
- **Farben je Stelle wie Calcularis** (Vorgabe Patrik 2026-10-31): Einer rot, Zehner blau,
  Hunderter grün, ab den Tausendern wiederholt (T rot, ZT blau, HT grün, M rot). Sie stehen nur in
  `spiele/gemeinsam/stil.css` (`--st-M` … `--st-E`) und werden **nur für Stellen** benutzt;
  Spielkarten, Stufen und Titel nehmen die `--deko-*`-Farben, damit nichts mit einer Stelle
  verwechselt wird.
- **Reihenfolge der Teile** (Bausteine, Rätselteile): geordnet = grösste Stelle links. Einstellbar
  im Profil global und je Spiel („nach Stufe“ = Stufe 1–3 geordnet, 4–5 gemischt); Spiele lesen
  `ctx.geordnet` und sind im Katalog mit `reihenfolge: true` markiert.
- **Fehler sind nicht schlimm:** falsche Antwort → Hinweis und neuer Versuch, kein Punktabzug,
  kein Zeitdruck als Standard. Der Timer ist eine **zuschaltbare** Zusatzschwierigkeit (Zeit um =
  ein Fehler, die Aufgabe bleibt lösbar); gemessen wird die Zeit je Aufgabe aber immer.
- **Inhaltslisten (Wörter, Sätze) stehen in eigenen Dateien** (`woerter.js` im Spielordner), damit
  Eltern oder Lehrperson sie ohne Code prüfen können; jede neue Liste gilt als ungeprüft, bis das
  im Handover vermerkt ist.
- **Alter:** 2. Klasse (≈ 7–8 J.) fast ohne Lesetext, Symbole/Bilder; 4. Klasse (≈ 9–10 J.)
  kurze Sätze erlaubt.
- **Offline lauffähig**, keine Anmeldung. **Daten über das Kind nur lokal im Browser**
  (Entscheid LERN-5 b, 2026-10-31): Profil (Name, Alter, Klasse, Fokus-Lernziele) und je Runde
  ein Protokolleintrag (Spiel, Stufe, Sterne, Fehler, Dauer, falsch gelöste Aufgaben). Nichts
  wird an einen Server geschickt; Sichern/Einlesen als JSON-Datei nur auf Knopfdruck in der
  Statistik. Keine weiteren Angaben (Nachname, Schule, Foto) erfassen.

## Projekt-Steckbrief
<!-- Kopplungsblock für die globalen ~/.claude-Skills. Format: ~/.claude/docs/steckbrief.template.md -->
- **Projekt:** Lernspiele — kleine Mathe-Lernspiele (später weitere Fächer) für die 2. und 4. Klasse
- **Session-Prefix:** LERN
- **Sprachen:** HTML/CSS/JavaScript ohne Build-Schritt und ohne externe Abhängigkeiten (Entscheid LERN-1, 2026-10-31). Jedes Spiel ist eine eigenständige Seite `spiele/<name>/index.html`; Gemeinsames in `spiele/gemeinsam/`; Startseite `index.html` (Filter Thema/Stufe, Spielerwahl, Profil), Statistik `statistik.html`. Läuft offline per Doppelklick.
- **Konventionen:** CLAUDE.md (Abschnitt Gestaltungsregeln)
- **Architektur-Doku:** —
- **Handover:** docs/HANDOVER.md
- **Session-Reports:** docs/report/ · LERN_Session<N>_<YYYY-MM-DD>.md
- **Changelog/Logbuch:** CHANGELOG.md
- **Build:** — (kein Build; `index.html` im Browser öffnen)
- **Tests:** — (manuell im Browser: Desktop, Tablet 768 px, Handy 375 px; jede Kombination Spiel × Stufe lädt ohne Konsolenfehler; Aufgabengeneratoren je Stufe mit einigen tausend Zufallsaufgaben auf Zahlenraum und gültige Lösung prüfen)
- **Sensible Daten:** Namen, Alter und Lernstand der Kinder nur im Browser (localStorage, Schlüssel `lernspiele:*`) und in selbst gesicherten JSON-Dateien — solche Dateien nie ins Repo; keine Namen, Fotos oder Handschrift von Kindern in Spielen/Commits; Lernzielblätter liegen nur als Material in material/
- **Bewusste Vereinfachungen:** —
- **Deliverables:** je Spiel eine lauffähige Seite; Lernziel-Abdeckung in docs/lernziele/
- **Domänen-Skills (lokal):** —
- **Beim Start laden:** —
