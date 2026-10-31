# Lernspiele

Kleine Lernspiele für die 1. bis 4. Klasse (Mathe, Deutsch, Englisch, NMG, Musik), ausgerichtet am
Lehrplan Volksschule St. Gallen. Jedes Spiel ist für eine Basisklasse gebaut und hat sechs Stufen:
1 eine Klasse tiefer · 2 leichter · 3 Klassenziel · 4 schwerer · 5 eine Klasse höher ·
6 👑 Königsstufe (Endgegner). Mit der Klasse im Profil schlägt die Startseite je Spiel eine Stufe vor.

## Starten

**Kein Server nötig.** `index.html` im Hauptordner doppelklicken, dann öffnet sich die Startseite im
Browser. Alles läuft offline und ohne Installation.

**Anmelden:** Kinder tippen ihren Namen an. Die **Aufsicht** (Eltern, Lehrperson) meldet sich mit
ihrer PIN an. Sie legt die Kinder an, gibt Spiele und Inhaltslisten frei, sieht alle Statistiken
und spielt als Tester (mit „Lösung zeigen“, Runden zählen nicht). Beim ersten Start richtet man
die Aufsicht ein. **Kinder sehen nur freigegebene Spiele** — was im Repo geprüft ist oder was die
Aufsicht im Tab Verwaltung freigibt.

- **Empfohlen: Chrome oder Edge.** Dort teilen Startseite, Spiele und Statistik auch beim Öffnen per
  Doppelklick (`file://`) denselben Speicher, also Spieler, Profil und Fortschritt.
- **Firefox:** ungeprüft, ob der Speicher beim Doppelklick zwischen den Seiten geteilt wird. Wer
  sichergehen will, startet einen kleinen lokalen Server im Hauptordner und öffnet
  <http://localhost:8765>:

  ```bash
  python -m http.server 8765 --bind 127.0.0.1
  ```

- Nach einer Änderung an den Dateien die Seite hart neu laden (Strg+F5).

## Daten der Kinder

Name, Alter, Klasse und Lernstand bleiben **nur in diesem Browser auf diesem Gerät**
(`localStorage`, Schlüssel `lernspiele:*`). Nichts wird verschickt. Die PIN der Aufsicht wird nur als Hash gespeichert und nie
mitgesichert. In der Statistik lassen sich die Daten als JSON-Datei sichern (`lernspiele-<Namen>-<Datum>.json`) und auf einem anderen Gerät
einlesen. Einlesen führt zusammen: Runden, die schon da sind, zählen einmal, neue kommen dazu,
vorhandene Profile bleiben — so lässt sich zwischen Handy und Computer hin und her abgleichen.
Ein Kind sichert nur seine eigenen Daten; die Aufsicht alle oder einzelne Kinder und liest ein. Solche Dateien gehören nicht ins Repo; `.gitignore` schliesst sie aus. Ebenfalls in der
Statistik: den Spielstand eines Kindes zurücksetzen (alle Spiele oder ein einzelnes; Profil bleibt).

## Ordner

| Ordner | Inhalt |
|---|---|
| `index.html`, `start/` | Startseite: Anmeldung und Tabs Spiele, Profil, Statistik, Verwaltung (je Tab eine Datei) |
| `spiele/<name>/` | je Spiel eine Seite `index.html`, Inhaltslisten in eigenen Dateien (`woerter.js` …) |
| `spiele/gemeinsam/` | Rahmen (`spiel.js`), Katalog aller Spiele mit Prüfstand (`katalog.js`), Auswertung, Stil |
| `docs/rahmen.md` | Vertrag zwischen Rahmen und Spielen: Klassen, Farben, Schnittstelle, Freigabe |
| `docs/checkliste.md` | Checkliste: Klasse → Fach → Thema → Spiel, gebaut oder Idee, was noch zu prüfen ist (erzeugt) |
| `docs/lernziele/` | Lernziele mit Zuordnung Lernziel → Spiel |
| `docs/spielideen/` | Spielideen aus dem Lehrplan Volksschule SG |
| `docs/pruefung/` | Prüfliste der Wort- und Inhaltslisten für Eltern oder Lehrperson |
| `tools/` | Prüfskripte (Node.js) |

## Prüfen

Ohne Browser, mit Node.js:

```bash
node tools/pruefe_spiele.js
```

Das Skript lädt jedes Spiel in jeder Stufe, spielt mehrere Runden mit Zufallsklicks durch und
meldet Abstürze, Endlosschleifen und Texte mit `NaN` oder `undefined`. Spiele mit eigener
Prüffunktion (`pruefeAufgabe`) werden zusätzlich mit 3000 Zufallsaufgaben je Stufe fachlich
geprüft. Danach spielt es jedes Spiel mit Inhaltslisten als Kind, mit je einer freigegebenen Liste.
Einzelne Spiele: `node tools/pruefe_spiele.js reim-paare abc-sortierer`.

Die Checkliste neu erzeugen, nachdem sich Katalog, Prüfstand, Spielideen oder Annahmen geändert haben:

```bash
node tools/checkliste.js > docs/checkliste.md
```

Die Prüfliste der Inhaltslisten neu erzeugen, nachdem eine Liste geändert wurde:

```bash
node tools/pruefliste_wortlisten.js > docs/pruefung/wortlisten_zur_pruefung.md
```
