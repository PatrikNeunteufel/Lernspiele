# Gemeinsame Bibliothek für Eulenpfad, Lernsteig und Gratwanderung — Vorschlag

Stand: 2026-11-04 (LST_Session1, Cloud) · **Vorschlag, nicht umgesetzt.** Auftrag: `docs/lernsteig/AUFTRAG_cloud.md`,
Schritt 6. Grundlage: die Übernahmen in [gemeinsame_mechaniken.md](gemeinsame_mechaniken.md) und der Stand des
Lernsteig-Rahmens (`docs/lernsteig/rahmen.md`).

## 1. Ziel und Rahmenbedingungen

Was beide Apps gleich brauchen, soll **eine** Quelle haben, statt als Kopie in jeder App still auseinanderzulaufen.
Dabei gilt weiter:
- **Keine Abhängigkeit zwischen App-Ordnern** (Entscheid Patrik 2026-11-04): Der Lernsteig lädt nichts aus
  `eulenpfad/`, und umgekehrt.
- **Ohne Build-Schritt, ohne externe Abhängigkeiten, offline per Doppelklick** (LERN-1).
- **Je App ein Ordner, der nur enthält, was online geht** (P1 a).
- **Eine Adresse für alle Apps** unter `patrikneunteufel.github.io`: gleicher Ursprung, also gleiches localStorage, gleiche
  IndexedDB-Namen und gleicher Speicherplatz (je nach Browser rund 5 MB für alles unter dieser Adresse).

## 2. Kandidaten für den Kern

Aus der Tabelle in `gemeinsame_mechaniken.md` (Spalte „Kern-Kandidat? ja“) und dem, was im Lernsteig neu entstanden
ist und auch der Eulenpfad brauchen kann:

| Teil | heute | Kern-Schnittstelle (Vorschlag) |
|---|---|---|
| Speicher mit Präfix | `LS.lies/schreibe` (`lernspiele:`), `LST.lies/schreibe` (`lernsteig:`) | `kern.speicher(praefix)` → `{ lies, schreibe }` — der Kern kennt keine App-Schlüssel |
| Zufall mit austauschbarer Quelle | beide | `kern.zufall` mit `quelle` (Seed fürs Testskript) |
| Zahlschreibung | Eulenpfad: Leerzeichen ab 5 Stellen; Lernsteig: Apostroph ab 4 (Z1 a) | `kern.zahlText(n, { tausender, abStellen, minus })` — Schreibweise als Einstellung je App |
| Element bauen `el` | beide | unverändert |
| Exakte Bruchrechnung | Lernsteig `gemeinsam/bruch.js` | unverändert (Eulenpfad kann Prüffunktionen damit härten) |
| Terme lesen und vergleichen | Lernsteig `gemeinsam/terme.js` | unverändert (ab Gratwanderung wichtig) |
| Taschenrechner | Lernsteig `gemeinsam/rechner.js` | Rechenkern im Kern, Ansichten je App |
| Wiederholungsbremse, Serie/Endlos mit Zwischenstand | beide, verschieden ausgebaut | gemeinsamer Ablauf, App-eigene Darstellung |
| Protokoll- und Rekordformat | beide, ähnlich | ein Format mit App-Feldern (`niveau`, `sterne` …) |
| Einladung beim Aufstieg (EL1 a) | noch nicht gebaut | Format der Einladung, von beiden Apps gelesen bzw. geschrieben |
| Testskript-Kern | `tools/pruefe_spiele.js`, `docs/lernsteig/werkzeuge/pruefe_uebungen.js` | gemeinsamer Teil (Generatoren gegen Prüffunktion, Hinweise ohne Lösung, verdächtiger Text), Treiber je App |
| Anmeldung, PIN, Wiederherstellungscode | Eulenpfad | gemeinsamer Teil (Hash, Code, Frist), Rollen und Ablauf je App |

**Kein** Kern-Kandidat: Ton, Belohnung (Sterne gegen Serien und Kompetenzstand), Stufenmodell (Eulenpfad sechs Stufen,
Lernsteig Lehrplan-Stufen), Darstellung.

## 3. Wo die Bibliothek liegt und wie die Apps sie einbinden

Vier Wege, geprüft gegen die Rahmenbedingungen aus Abschnitt 1:

| | Offline per Doppelklick | App-Ordner bleibt eigenständig | eine Quelle | Pages ohne Zusatz | Aufwand im Alltag |
|---|---|---|---|---|---|
| A: Ordner `kern/` im Repo, Apps laden `../kern/…` | ja, wenn das ganze Repo vorliegt | **nein** (App braucht den Nachbarordner) | ja | ja (`kern/` mitveröffentlichen) | klein |
| B: Ordner `kern/` im Repo als Quelle, **Kopie per Werkzeug** nach `<app>/kern/` | ja | ja | ja (Kopien sind abgeleitet und geprüft) | ja | Werkzeug laufen lassen |
| C: eigenes Repo, Git-Submodul in jeder App | ja | ja | ja | Pages-Ablauf muss Submodule holen | Submodule pflegen |
| D: eigenes Repo, Kopie per Werkzeug | ja | ja | ja | ja | zwei Repos abgleichen |

Bei B bleibt jede App ein Ordner, der allein läuft und nur enthält, was online geht. Die einzige Quelle ist `kern/`. Ein
Werkzeug (`tools/kern_verteilen.py`) kopiert die Dateien in die Apps und schreibt Version und Prüfsumme in den Kopf
jeder Kopie. Das Testskript jeder App bricht ab, wenn eine Kopie von `kern/` abweicht. Das ist dieselbe Denkweise wie bei
abgeleiteten Daten: Die Kopie ist ein Ergebnis, nie eine zweite Quelle.

## 4. Versionen

- `kern/VERSION` (etwa `1.3.0`) und `kern/CHANGELOG.md`. Kleine Nummer: Fehlerbehebung; mittlere: neue Funktion,
  alte bleiben; grosse: Schnittstelle geändert, Apps müssen nachziehen.
- Jede Kopie trägt im Kopf `kern 1.3.0, Prüfsumme …`. Eine App darf hinter dem Kern zurückliegen (sie verteilt erst,
  wenn ihr Testskript mit der neuen Version grün ist).
- Datenformate (Protokoll, Rekord, Einladung) tragen ein Feld `format`; wer liest, versteht ältere Fassungen.

## 5. Umstellen ohne Bruch

1. `kern/` anlegen mit einem ersten, kleinen Teil (Vorschlag: `bruch.js` und `zahlText` mit Schreibweise als
   Einstellung).
2. Werkzeug `kern_verteilen.py` und Prüfung im Testskript beider Apps.
3. Teil für Teil umziehen: Kopie in der App durch die verteilte Kern-Datei ersetzen, Testskript grün, Zeile in
   `gemeinsame_mechaniken.md` auf „im Kern seit <Version>“ setzen.
4. Speicherschlüssel bleiben, wie sie sind (`lernspiele:*`, `lernsteig:*`); der Kern bekommt das Präfix als Parameter.

## 6. GitHub Pages: worauf zu achten ist

- Gleicher Ursprung: kein Kern-Teil darf feste Speicherschlüssel, IndexedDB-Namen oder Dateinamen benutzen; alles mit
  Präfix der App.
- Zwischenspeicher der Browser: Nach einer neuen Kern-Version liegen alte Dateien eventuell noch im Cache. Bei B ist das
  harmlos (jede App hat ihre Kopie mit ihrer Version); bei A müssten alle Apps gleichzeitig mit dem neuen Kern laufen.
- Ein späterer Service Worker (Offline-App) gehört je App in ihren Ordner, mit eigenem Geltungsbereich.

## 7. Entscheidungsfragen

**Entschieden 2026-11-05 (Patrik): KB1 a, KB2 a** — Umsetzung lokal im Repo Lernspiele.

### Frage KB1 — Ort und Einbindung der Bibliothek

**Ort:** dieser Vorschlag, Abschnitt 3; `CLAUDE.md` (Kopf: „wie die gemeinsamen Teile später in eine eigene Bibliothek
kommen (Ordner oder eigenes Repo, Einbindung ohne Build, Versionen, Rücktransfer in beide Apps)“)

**Heutiger Zustand:** Mechaniken werden kopiert und in `gemeinsame_mechaniken.md` eingetragen; es gibt keinen Kern.

**Problem:** Zwei Kopien laufen auseinander, sobald eine App sie ändert. Ein gemeinsamer Ordner, den die Apps direkt
laden (A), verletzt „App-Ordner nur mit dem, was online geht, und eigenständig“; ein eigenes Repo (C, D) bringt einen
zweiten Abgleich dazu, solange nur ein Repo veröffentlicht.

**Optionen:**
- **a (Empfehlung):** „Weg B: Ordner `kern/` im Repo Lernspiele als einzige Quelle; das Werkzeug `tools/kern_verteilen.py`
  kopiert in `eulenpfad/kern/` und `lernsteig/kern/` (Version und Prüfsumme im Kopf); das Testskript jeder App prüft,
  dass ihre Kopie mit `kern/` übereinstimmt. Ein eigenes Repo erst, wenn eine App ausserhalb des Repos Lernspiele
  lebt.“
- **b:** „Weg A: Ordner `kern/` im Repo, die Apps laden `../kern/…` direkt.“
- **c:** „Weg C: eigenes Repo `lernspiele-kern`, als Git-Submodul in den App-Ordnern.“

**Warum die Empfehlung:** Den Ausschlag gibt, dass B als einziger Weg alle Rahmenbedingungen zugleich hält: eine Quelle,
eigenständige App-Ordner, offline per Doppelklick, kein Zusatz bei Pages, und eine Abweichung fällt im Testskript auf.
Für b spricht, dass nichts kopiert werden muss — das wiegt weniger, weil jede App dann nur mit dem Nachbarordner läuft
und eine neue Kern-Version alle Apps zugleich trifft (Abschnitt 6). Für c spricht die saubere Trennung in ein eigenes
Repo; heute liegen aber alle Apps in einem Repo, und Submodule machen jeden Klon und den Pages-Ablauf komplizierter.
Kippt zu c, wenn eine App in ein eigenes Repo zieht oder der Kern auch ausserhalb der Reihe genutzt werden soll.

### Frage KB2 — Womit der Kern beginnt

**Ort:** Abschnitt 2 und 5

**Heutiger Zustand:** Kandidaten-Liste ohne Reihenfolge.

**Problem:** Alles auf einmal umzuziehen ist riskant (beide Apps gleichzeitig umbauen). Der erste Teil soll den Weg
(Werkzeug, Version, Prüfung) beweisen, ohne eine App zu gefährden.

**Optionen:**
- **a (Empfehlung):** „Zuerst `bruch.js` (neu, im Eulenpfad noch nicht benutzt) und die Zahlschreibung mit Schreibweise
  als Einstellung; danach Speicher mit Präfix, Zufall, `el`; zuletzt Protokollformat, Serie und Anmeldung.“
- **b:** „Zuerst die Anmeldung mit PIN, weil sie am meisten Code enthält.“

**Warum die Empfehlung:** Den Ausschlag gibt das Risiko: `bruch.js` ist klein, ohne DOM und vollständig getestet; der
Eulenpfad gewinnt damit sofort härtere Prüffunktionen, ohne dass sich etwas für Kinder ändert. Die Zahlschreibung zeigt,
wie App-Eigenheiten als Einstellung in den Kern kommen. Für b spricht der grösste Gewinn an doppeltem Code; dort hängen
aber Profilformat, Rollen und Abgleich daran, und ein Fehler sperrt Kinder aus. Kippt, wenn die Anmeldung des
Lernsteigs (AU1 a) ohnehin als Nächstes gebaut wird: dann gleich als Kern-Teil.
