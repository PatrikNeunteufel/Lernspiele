# Lernspiele — Reihe Eulenpfad → Lernsteig → Gratwanderung

Drei Lern-Apps, eine Wegmetapher: Der Weg wird mit jeder Schulstufe steiler. Alle laufen im Browser,
offline und ohne Anmeldung bei einem Dienst; Daten über die Lernenden bleiben im Browser des Geräts.
Konzept: [docs/konzept_reihe_eulenpfad.md](docs/konzept_reihe_eulenpfad.md).

| App | Schulstufe | Alter (≈) | Stand | Ordner · Doku |
|---|---|---|---|---|
| **Eulenpfad** | Primar, Kindergarten bis 6. Klasse | 5–12 | 169 Lernspiele, je sechs Stufen zur Basisklasse | [`eulenpfad/`](eulenpfad/README.md) · [`docs/eulenpfad/`](docs/eulenpfad/HANDOVER.md) |
| **Lernsteig** | Sekundarstufe I (Real, Sek, Pro-Gymi als Niveaus) | 12–15 | Grundgerüst, noch ohne Übungen | [`lernsteig/`](lernsteig/) · [`docs/lernsteig/`](docs/lernsteig/HANDOVER.md) |
| **Gratwanderung** | Gymnasium (Sekundarstufe II) | 15–19 | Grundgerüst, noch ohne Übungen | [`gratwanderung/`](gratwanderung/) · [`docs/gratwanderung/`](docs/gratwanderung/HANDOVER.md) |

Online: <https://patrikneunteufel.github.io/Lernspiele/> (Einstiegsseite der Reihe, verlinkt die Apps).

## Starten

**Kein Server nötig.** Lokal `portal/index.html` (Einstiegsseite) oder direkt `eulenpfad/index.html`
doppelklicken. Wie Eulenpfad bedient wird — Anmeldung, Aufsicht, Endlos, Zufallsmix, Daten der Kinder —
steht in der [README von Eulenpfad](eulenpfad/README.md).

Wer einen lokalen Server braucht (Firefox, Entwickler-Modus): `server_starten.bat` oder
`entwickler_server_starten.bat` im Hauptordner, beide auf Port 8765. Beide öffnen die Einstiegsseite
<http://localhost:8765/portal/index.html> wie online; die Wurzel <http://localhost:8765/> leitet dorthin.

## Ordner

| Ordner | Inhalt |
|---|---|
| `eulenpfad/`, `lernsteig/`, `gratwanderung/` | je App ein Ordner mit **nur dem, was online geht** (Entscheide P1 a, P2 a) |
| `portal/` | Einstiegsseite der Reihe; online leitet die Wurzel dorthin |
| `docs/` | Konzepte für die ganze Reihe (Reihe, Gruppen, gemeinsame Mechaniken, Klassenserver, Beiträge) |
| `docs/<app>/` | Doku je App: Handover, Rahmen, Lernziele, Reports |
| `tools/` | Prüf- und Hilfsskripte (Node.js, Python), Server für lokal und den Entwickler-Modus |
| `material/` | Lernzielblätter und Lehrplan als Material, nicht im Repo |
| `.github/workflows/pages.yml` | Veröffentlichen auf GitHub Pages: nur `portal/` und die App-Ordner, von selbst bei jedem Push auf master, der sie ändert |

## Gemeinsam für alle Apps

- **Keine Build-Schritte, keine externen Abhängigkeiten:** HTML, CSS und JavaScript.
- **Datenschutz:** Namen, Alter und Lernstand nur im Browser (`localStorage`); Sichern als Datei nur auf
  Knopfdruck, solche Dateien nie ins Repo. Die Ausnahmen stehen in der [CLAUDE.md](CLAUDE.md).
- **Gemeinsamer Kern:** Mechaniken dürfen zwischen den Apps abgeschaut werden; jede Übernahme steht in
  [docs/gemeinsame_mechaniken.md](docs/gemeinsame_mechaniken.md), damit sie später in einen gemeinsamen
  Kern ausgelagert werden kann.
- **Speicher:** Alle Apps teilen online dieselbe Adresse (`github.io`); wie Lernsteig und Gratwanderung
  ihre Daten von Eulenpfad trennen oder mit ihm teilen, ist noch offen (Handover Lernsteig).
