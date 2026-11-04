# Eulenpfad

Kleine Lernspiele für die Primarschule, vom Kindergarten bis zur 6. Klasse (Mathe, Deutsch, Englisch,
Französisch, NMG, Medien und Informatik, Musik), ausgerichtet am Lehrplan Volksschule St. Gallen.
Jedes Spiel ist für eine Basisklasse gebaut und hat sechs Stufen:
1 eine Klasse tiefer · 2 leichter · 3 Klassenziel · 4 schwerer · 5 eine Klasse höher ·
6 👑 Königsstufe (Endgegner). Mit der Klasse im Profil schlägt die Startseite je Spiel eine Stufe vor.

Eulenpfad ist die erste App der Reihe Eulenpfad → Lernsteig → Gratwanderung; die Übersicht über die
Reihe steht in der [README des Repos](../README.md).

## Starten

**Kein Server nötig.** `eulenpfad/index.html` doppelklicken, dann öffnet sich die Startseite im
Browser. Alles läuft offline und ohne Installation. Online: <https://patrikneunteufel.github.io/Lernspiele/eulenpfad/>.

**Anmelden:** Kinder tippen ihren Namen an. Die **Aufsicht** (Eltern, Lehrperson) meldet sich mit
ihrer PIN an. Sie legt die Kinder an, gibt Spiele und Inhaltslisten frei, sieht alle Statistiken
und spielt als Tester (mit „Lösung zeigen“, Runden zählen nicht). Beim ersten Start richtet man
die Aufsicht ein. **Kinder sehen alles, was nichts mehr zu prüfen hat:** Neue Spiele erscheinen,
sobald sie angesehen sind, Spiele mit Wort- und Inhaltslisten, sobald eine Liste geprüft ist. Die
Aufsicht kann im Tab Verwaltung anders freigeben oder sperren.

**Klasse:** Die Aufsicht trägt je Kind Geburtsmonat und Klasse ein; das Alter rechnet die App selbst.
Auf den Spielkarten zeigt ein farbiger Rand, wie ein Spiel zur Klasse des Kindes steht (✓ tiefer,
● meine Klasse, ▲ Herausforderung). Zum neuen Schuljahr lässt die Aufsicht das Kind im Profil
**aufsteigen**; das Kind sieht beim nächsten Anmelden eine Nachricht und erhält ein Abzeichen.

**♾ Endlos:** Rechenspiele bieten zusätzlich einen Endlos-Modus: so viele Aufgaben wie möglich bis
zum ersten Fehler, mit oder ohne Timer. Auf der Spielkarte oben rechts ♾ (Endlos) und ⏱ (Timer)
einschalten — sie leuchten dann wie der Favoriten-Stern —, danach eine Stufe antippen. Ein Tipp auf
eine freie Stelle der Karte öffnet das Startbild des Spiels mit allen Stufen, Rekorden und den
Ranglisten. Mit Timer wird die Zeit im Endlos-Modus nach jeder richtigen Aufgabe etwas knapper.
Die Lernziel-Kürzel (z. B. MA.1.A.3) zeigen beim Antippen, was geübt wird. Der Rekord je Kind und
die Rangliste stehen am Ende der Runde und in der Statistik.

**🎲 Zufallsmix:** Oben im Tab Spiele. Mischt Aufgaben aus bis zu sechs Spielen. Einstellen lassen
sich Fächer, Stufe („passend für mich“ oder fest), Timer, Länge (10, 20 oder ♾ Endlos) und wie oft das
Spiel wechselt. Die Aufgaben zählen in der Statistik bei ihrem Spiel, Endlos-Serien haben eigene
Ranglisten je Mischung.

**Anleitungen** für Erwachsene und Kinder: [`anleitung/`](anleitung/).

- **Empfohlen: Chrome oder Edge.** Dort teilen Startseite, Spiele und Statistik auch beim Öffnen per
  Doppelklick (`file://`) denselben Speicher, also Spieler, Profil und Fortschritt.
- **Firefox:** ungeprüft, ob der Speicher beim Doppelklick zwischen den Seiten geteilt wird. Wer
  sichergehen will, startet einen kleinen lokalen Server im Hauptordner des Repos und öffnet
  <http://localhost:8765/eulenpfad/>:

  ```bash
  python -m http.server 8765 --bind 127.0.0.1
  ```

  Unter Windows genügt ein Doppelklick auf `server_starten.bat` im Hauptordner: Sie startet
  `tools/server.py` (wie oben, aber ohne Zwischenspeicher im Browser — nach Änderungen genügt ein
  gewöhnliches Neuladen) und öffnet Eulenpfad im Browser.

- Nach einer Änderung an den Dateien die Seite hart neu laden (Strg+F5).

## Daten der Kinder

Name, Geburtsmonat, Klasse und Lernstand bleiben **nur in diesem Browser auf diesem Gerät**
(`localStorage`, Schlüssel `lernspiele:*`). Nichts wird verschickt. Die PIN der Aufsicht wird nur als
Hash gespeichert und nie mitgesichert. In der Statistik lassen sich die Daten als JSON-Datei sichern
(`lernspiele-<Namen>-<Datum>.json`) und auf einem anderen Gerät einlesen. Einlesen führt zusammen:
Runden, die schon da sind, zählen einmal, neue kommen dazu, vorhandene Profile bleiben — so lässt sich
zwischen Handy und Computer hin und her abgleichen. Ein Kind sichert nur seine eigenen Daten; die
Aufsicht alle oder einzelne Kinder und liest ein. Solche Dateien gehören nicht ins Repo; `.gitignore`
schliesst sie aus. Ebenfalls in der Statistik: den Spielstand eines Kindes zurücksetzen (alle Spiele
oder ein einzelnes; Profil bleibt). Die Ausnahmen (Abgleich-Ordner, Fehlermeldungen, Abzeichen teilen)
stehen in der [CLAUDE.md](../CLAUDE.md), Abschnitt Gestaltungsregeln.

## Ordner

| Ordner | Inhalt |
|---|---|
| `index.html`, `start/` | Startseite: Anmeldung und Tabs Spiele, Profil, Statistik, Erfolge, Verwaltung (je Tab eine Datei) |
| `mix.html`, `mix/` | Zufallsmix: Einstellungen, Spiele im iframe, Protokoll und Rekord (Vertrag: [rahmen.md](../docs/eulenpfad/rahmen.md) Abschnitt 9) |
| `spiele/<name>/` | je Spiel eine Seite `index.html`, Inhaltslisten in eigenen Dateien (`woerter.js` …) |
| `spiele/gemeinsam/` | Rahmen (`spiel.js`), Abgleich (`abgleich.js`), Katalog aller Spiele mit Prüfstand (`katalog.js`), Auswertung, Stil |
| `anleitung/` | Anleitungen für Erwachsene und Kinder mit Bildern |
| `kontakt.js`, `meldungen-stand.json` | Adresse und Antworten für Fehlermeldungen (rahmen.md Abschnitt 13) |

Doku zu Eulenpfad liegt ausserhalb des App-Ordners, damit nur online geht, was gebraucht wird:

| Ort | Inhalt |
|---|---|
| [`docs/eulenpfad/rahmen.md`](../docs/eulenpfad/rahmen.md) | Vertrag zwischen Rahmen und Spielen: Klassen, Farben, Schnittstelle, Freigabe, Abgleich |
| [`docs/eulenpfad/checkliste.md`](../docs/eulenpfad/checkliste.md) | Checkliste: Klasse → Fach → Thema → Spiel, gebaut oder Idee, was noch zu prüfen ist (erzeugt) |
| [`docs/eulenpfad/lernziele/`](../docs/eulenpfad/lernziele/) | Lernziele mit Zuordnung Lernziel → Spiel |
| [`docs/eulenpfad/spielideen/`](../docs/eulenpfad/spielideen/) | Spielideen aus dem Lehrplan Volksschule SG |
| [`docs/eulenpfad/pruefung/`](../docs/eulenpfad/pruefung/) | Prüfliste der Wort- und Inhaltslisten für Eltern oder Lehrperson |
| [`docs/eulenpfad/HANDOVER.md`](../docs/eulenpfad/HANDOVER.md), `report/` | Stand und Sitzungsberichte |

## Prüfen

Ohne Browser, mit Node.js, im Hauptordner des Repos:

```bash
node tools/pruefe_spiele.js
```

Das Skript lädt jedes Spiel in jeder Stufe, spielt mehrere Runden mit Zufallsklicks durch und
meldet Abstürze, Endlosschleifen und Texte mit `NaN` oder `undefined`. Spiele mit eigener
Prüffunktion (`pruefeAufgabe`) werden zusätzlich mit 3000 Zufallsaufgaben je Stufe fachlich
geprüft. Danach spielt es jedes Spiel mit Inhaltslisten als Kind, mit je einer freigegebenen Liste.
Einzelne Spiele: `node tools/pruefe_spiele.js reim-paare abc-sortierer`.

Bildhöhe je Gerät (Server nötig, rahmen.md Abschnitt 20):

```bash
node tools/bildhoehe.js
```

**Entwickler-Modus** (nur lokal): Spiele durchspielen, Inhaltslisten ansehen, beides als geprüft
markieren und Bemerkungen für die Entwicklung eintragen. Server starten:

```bash
python tools/entwickler_server.py
```

Unter Windows: Doppelklick auf `entwickler_server_starten.bat` (startet ihn mit `--oeffnen`). Er belegt
denselben Port 8765 wie `server_starten.bat`; es läuft also immer nur einer von beiden.

Der Server schreibt die Links in die Konsole (Strg+Klick öffnet sie); mit `--oeffnen` öffnet er
Eulenpfad gleich im Browser. Dann <http://localhost:8765/eulenpfad/> öffnen, als Aufsicht anmelden und
unter Verwaltung → Entwicklung den Schlüssel aus `entwickler.key` eingeben (die Datei ist von Git
ausgeschlossen). Der Server schreibt den Prüfstand nach `eulenpfad/spiele/gemeinsam/pruefstand.js` und
Bemerkungen nach `docs/eulenpfad/bemerkungen.json`; nach Commit und Push gilt der Prüfstand für alle.

Die Checkliste neu erzeugen, nachdem sich Katalog, Prüfstand, Spielideen oder Annahmen geändert haben:

```bash
node tools/checkliste.js > docs/eulenpfad/checkliste.md
```

Die Prüfliste der Inhaltslisten neu erzeugen, nachdem eine Liste geändert wurde (schreibt zusätzlich
`docs/eulenpfad/pruefung/listen.json` für „ansehen“ im Entwickler-Modus):

```bash
node tools/pruefliste_wortlisten.js > docs/eulenpfad/pruefung/wortlisten_zur_pruefung.md
```
