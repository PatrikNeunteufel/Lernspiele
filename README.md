# Eulenpfad

Kleine Lernspiele für die 1. bis 4. Klasse (Mathe, Deutsch, Englisch, NMG, Musik), ausgerichtet am
Lehrplan Volksschule St. Gallen. Jedes Spiel ist für eine Basisklasse gebaut und hat sechs Stufen:
1 eine Klasse tiefer · 2 leichter · 3 Klassenziel · 4 schwerer · 5 eine Klasse höher ·
6 👑 Königsstufe (Endgegner). Mit der Klasse im Profil schlägt die Startseite je Spiel eine Stufe vor.

## Starten

**Kein Server nötig.** `eulenpfad/index.html` doppelklicken, dann öffnet sich die Startseite im
Browser. Alles läuft offline und ohne Installation.

Eulenpfad ist die erste App einer Reihe: Eulenpfad (Primar) → Lernsteig (Sekundarstufe I) →
Gratwanderung (Gymnasium), siehe [Konzept](docs/konzept_reihe_eulenpfad.md). Jede App hat einen
eigenen Ordner mit genau dem, was online geht.

**Anmelden:** Kinder tippen ihren Namen an. Die **Aufsicht** (Eltern, Lehrperson) meldet sich mit
ihrer PIN an. Sie legt die Kinder an, gibt Spiele und Inhaltslisten frei, sieht alle Statistiken
und spielt als Tester (mit „Lösung zeigen“, Runden zählen nicht). Beim ersten Start richtet man
die Aufsicht ein. **Kinder sehen alles, was nichts mehr zu prüfen hat:** Neue Spiele erscheinen,
sobald sie angesehen sind, Spiele mit Wort- und Inhaltslisten, sobald eine Liste geprüft ist. Die
Aufsicht kann im Tab Verwaltung anders freigeben oder sperren.

**♾ Endlos:** Rechenspiele bieten zusätzlich einen Endlos-Modus: so viele Aufgaben wie möglich bis
zum ersten Fehler, mit oder ohne Timer. Auf der Spielkarte oben rechts ♾ (Endlos) und ⏱ (Timer)
einschalten — sie leuchten dann wie der Favoriten-Stern —, danach eine Stufe antippen. Ein Tipp auf
eine freie Stelle der Karte öffnet das Startbild des Spiels mit allen Stufen, Rekorden und den
Ranglisten. Mit Timer wird die Zeit im Endlos-Modus nach jeder richtigen Aufgabe etwas knapper.
Die Lernziel-Kürzel (z. B. MA.1.A.3) zeigen beim Antippen, was geübt wird. Der Rekord je Kind und die Rangliste stehen am Ende der
Runde und in der Statistik.

**🎲 Zufallsmix:** Oben im Tab Spiele. Mischt Aufgaben aus bis zu sechs Spielen. Einstellen lassen
sich Fächer, Stufe („passend für mich“ oder fest), Timer, Länge (10, 20 oder ♾ Endlos) und wie oft das
Spiel wechselt. Die Aufgaben zählen in der Statistik bei ihrem Spiel, Endlos-Serien haben eigene
Ranglisten je Mischung.

- **Empfohlen: Chrome oder Edge.** Dort teilen Startseite, Spiele und Statistik auch beim Öffnen per
  Doppelklick (`file://`) denselben Speicher, also Spieler, Profil und Fortschritt.
- **Firefox:** ungeprüft, ob der Speicher beim Doppelklick zwischen den Seiten geteilt wird. Wer
  sichergehen will, startet einen kleinen lokalen Server im Hauptordner und öffnet
  <http://localhost:8765/eulenpfad/>:

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
| `eulenpfad/` | **die App** — nur was online geht |
| `eulenpfad/index.html`, `start/` | Startseite: Anmeldung und Tabs Spiele, Profil, Statistik, Verwaltung (je Tab eine Datei) |
| `eulenpfad/mix.html`, `mix/` | Zufallsmix: Einstellungen, Spiele im iframe, Protokoll und Rekord (Vertrag: `docs/eulenpfad/rahmen.md` Abschnitt 9) |
| `eulenpfad/spiele/<name>/` | je Spiel eine Seite `index.html`, Inhaltslisten in eigenen Dateien (`woerter.js` …) |
| `eulenpfad/spiele/gemeinsam/` | Rahmen (`spiel.js`), Abgleich (`abgleich.js`), Katalog aller Spiele mit Prüfstand (`katalog.js`), Auswertung, Stil |
| `lernsteig/`, `gratwanderung/` | Grundgerüst der zweiten und dritten App (Startseite, noch ohne Übungen); Stand in `docs/lernsteig/`, `docs/gratwanderung/` |
| `portal/` | Einstiegsseite der Reihe, verlinkt die Apps (lokal `portal/index.html` öffnen; online leitet die Wurzel dorthin) |
| `docs/konzept_reihe_eulenpfad.md` | Konzept der Reihe Eulenpfad → Lernsteig → Gratwanderung |
| `docs/eulenpfad/rahmen.md` | Vertrag zwischen Rahmen und Spielen: Klassen, Farben, Schnittstelle, Freigabe, Abgleich |
| `docs/eulenpfad/checkliste.md` | Checkliste: Klasse → Fach → Thema → Spiel, gebaut oder Idee, was noch zu prüfen ist (erzeugt) |
| `docs/eulenpfad/lernziele/` | Lernziele mit Zuordnung Lernziel → Spiel |
| `docs/eulenpfad/spielideen/` | Spielideen aus dem Lehrplan Volksschule SG |
| `docs/eulenpfad/pruefung/` | Prüfliste der Wort- und Inhaltslisten für Eltern oder Lehrperson |
| `docs/eulenpfad/HANDOVER.md`, `report/` | Stand und Sitzungsberichte |
| `tools/` | Prüfskripte (Node.js) |
| `.github/workflows/pages.yml` | Veröffentlichen auf GitHub Pages (<https://patrikneunteufel.github.io/Lernspiele/>): nur `portal/` und die App-Ordner, von selbst bei jedem Push, der sie ändert |

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
node tools/checkliste.js > docs/eulenpfad/checkliste.md
```

Die Prüfliste der Inhaltslisten neu erzeugen, nachdem eine Liste geändert wurde:

```bash
node tools/pruefliste_wortlisten.js > docs/eulenpfad/pruefung/wortlisten_zur_pruefung.md
```
