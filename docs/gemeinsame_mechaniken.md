# Gemeinsame Mechaniken — Kandidaten für den gemeinsamen Kern

Stand: 2026-11-04 (Notiz Patrik, LERN_Session13)

**Entscheid Patrik:** Lernsteig (und später Gratwanderung) dürfen Mechaniken aus dem Eulenpfad **abschauen und
kopieren**, angepasst an Alter und Niveau. Es gibt dabei **keine Abhängigkeit zwischen den App-Ordnern** — kein
`<script src="../eulenpfad/…">`, kein Import aus `eulenpfad/`. Wo Mechaniken in beiden Apps gleich oder fast gleich
laufen, werden sie **später** in einen gemeinsamen Kern ausgelagert (Konzept der Reihe, Abschnitt 3 und 5).

Damit das später geht, trägt jede Übernahme hier eine Zeile ein — auch kleine. Wer eine Mechanik in einer App
ändert, vermerkt es hier, damit die Kopien nicht still auseinanderlaufen.

| Mechanik | Herkunft (Datei, Abschnitt) | Kopie in | angepasst wie | Stand | Kern-Kandidat? |
|---|---|---|---|---|---|
| | | | | | |

Hinweise:
- „Herkunft“ mit Pfad und Abschnitt (etwa `eulenpfad/spiele/gemeinsam/spiel.js`, „Kurztasten“; `docs/eulenpfad/rahmen.md` 19).
- „Stand“: Datum und Sitzung der Kopie; bei späteren Änderungen an einer Seite neue Zeile oder Vermerk.
- „Kern-Kandidat?“: ja, wenn beide Apps dieselbe Logik brauchen (Speicher, Anmeldung, PIN, Kurztasten, Bildhöhe,
  Messwerkzeug, Testskript); nein, wenn die Kopie bewusst eigene Wege geht (Ton, Belohnung, Darstellung).
