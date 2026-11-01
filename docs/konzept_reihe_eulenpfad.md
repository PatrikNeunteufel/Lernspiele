# Konzept: Lernspiel-Reihe Eulenpfad → Lernsteig → Gratwanderung

Stand: 2026-11-01 · Status: Entwurf

## 1. Idee

Drei Apps, eine Wegmetapher: der Weg wird mit jeder Schulstufe steiler.

| App | Schulstufe | Alter (≈) | Bild |
|---|---|---|---|
| **Eulenpfad** | Primar (1.–6. Klasse) | 6–12 | Waldpfad, die Eule begleitet |
| **Lernsteig** | Sekundarstufe I (Sek, Real) | 12–15 | Bergsteig, steiler, aber begehbar |
| **Gratwanderung** | Gymnasium (Sekundarstufe II) | 15–19 | Exponierter Grat, Konzentration statt Spielerei |

Die Eule bleibt der rote Faden, wird aber leiser. Im Eulenpfad ist sie die Figur, im Lernsteig
nur noch Logo und Wegmarke, in der Gratwanderung ein Detail im Icon.

## 2. Abgrenzung der Apps

### Eulenpfad (bestehend)
- Grundlage: Lehrplan 21 (aktuell Lehrplan Volksschule St. Gallen), Zyklus 1 und 2.
- Sechs Stufen je Spiel relativ zur Basisklasse (bestehendes Modell `LS.SKALA`).
- Ton: spielerisch, Sterne, fast ohne Lesetext in den unteren Klassen.

### Lernsteig
- Grundlage: Lehrplan 21, Zyklus 3.
- **Niveaus statt eigener Apps:** Real, Sek und Pro-Gymi sind Niveaus in einer App.
  Das Modell entspricht dem Eulenpfad (Basisklasse + Stufen), ergänzt um die Achse Niveau
  (Schweiz: A/B/C bzw. Real/Sek je Kanton).
- Inhalt: Prüfungsvorbereitung und Üben steht stärker im Vordergrund als das Spielen.
  Kurze Runden bleiben.
- Ton: sachlich, wenig Deko, keine Kinderfiguren. Fortschritt über Serien und Rekorde
  statt über Sterne.
- Die ersten zwei Jahre des Langzeitgymnasiums laufen voraussichtlich als Niveau «Pro-Gymi» im
  Lernsteig mit (Annahme, je Kanton zu prüfen).

### Gratwanderung
- Grundlage: kantonale Gymnasiallehrpläne auf Basis des Rahmenlehrplans (kein Lehrplan 21).
- Eigene Fächerlogik: Grundlagen-, Schwerpunkt- und Ergänzungsfächer, Latein usw.
- Eher Trainings- und Repetitionswerkzeug (Maturavorbereitung) als Spielsammlung.
- Ton: nüchtern, ein Hauch Ironie («Gratwanderung» darf das).

## 3. Gemeinsame Basis

Was alle drei Apps teilen. Wird es einmal gebaut, profitieren alle davon.

- **Lehrplan-Profile** (`lehrplaene.js`): Land/Kanton, Klassenzählung (traditionell oder
  HarmoS), Fachnamen-Mapping (z. B. NMG ↔ Sachunterricht), Fremdsprachen mit Startklasse,
  Basis-URL der Lehrplanquelle. Die Auswahl trifft die Aufsicht.
- **Kanonischer Kompetenzschlüssel:** LP21-Code intern; die Anzeige und die
  Zuordnung zu anderen Lehrplänen (DE, AT) laufen über Mapping-Tabellen.
- **Stufen-/Niveaumodell:** Basisklasse je Lehrplan-Profil, Stufen relativ dazu.
- **Inhaltslisten mit Region-Tag** (`region: ["ch"]`, `["de"]`, `["at"]`) für Schreibweise
  (ss/ß), Währung, Wortschatz (Znüni/Jause), Verkehrssignale, Orte.
- **Datenschutz wie bisher:** alles lokal im Browser, Export nur auf Knopfdruck, keine
  Konten.
- **Technik wie bisher:** offline, kein Server nötig, eine HTML-Datei je Spiel.

Offen: gemeinsame Codebasis (ein Repo, drei Einstiegsseiten) oder drei Repos mit einem
geteilten Kern. Eine Tendenz ergibt sich erst, wenn der Lernsteig den ersten eigenen Bedarf zeigt.

## 4. Länder-Erweiterung

Reihenfolge nach Aufwand:

1. **Weitere LP21-Kantone:** praktisch nur Konfiguration (gleiche Codes). Achtung bei den
   Fremdsprachen: In den Passepartout-Kantonen kommt Französisch vor Englisch. Die Sprachenfrage
   ist politisch in Bewegung, die Reihenfolge gehört deshalb in Daten, nicht in Code.
2. **Liechtenstein (LiLe):** auf den Lehrplan 21 abgestimmt, gleiche Plattform.
3. **Österreich:** ein Bundeslehrplan mit Kompetenzbeschreibungen je Schulstufe, eine
   Fremdsprache ab der 1. Schulstufe. Zuordnung zu den LP21-Codes von Hand.
4. **Deutschland:** Basisprofil über die KMK-Bildungsstandards, danach Länderprofile
   (z. B. Bayern, Baden-Württemberg). Für Lernsteig und Gratwanderung wächst der Aufwand
   deutlich (Schulformen, gymnasiale Oberstufe je Land).

## 5. Reihenfolge der Umsetzung

1. Eulenpfad: Lehrplan-Profile einführen (SG, ein Passepartout-Kanton, AT als erste drei).
2. Den gemeinsamen Kern herauslösen (Profile, Stufenmodell, Statistik, Anmeldung).
3. Lernsteig: Prototyp mit einem Fach (Mathe, Zyklus 3) und zwei Niveaus.
4. Gratwanderung: erst wenn der Lernsteig steht. Vorher Zielgruppe und Nutzen klären.

## 6. Offene Fragen

- Lernsteig: Realschule / Sek B/C als Niveau oder als Filter? Kantonal unterschiedliche
  Modelle (getrennt, kooperativ, integriert) müssen abbildbar sein.
- Gratwanderung: Welche Fächer zuerst? Mathe liegt nahe, Latein wäre die Nische.
- Markenprüfung der drei Namen (Markenregister, App-Stores, Domains).
- Aufsichtsrolle ab der Sek: Lehrperson statt Eltern? Selbstständige Anmeldung der
  Jugendlichen?
- Gestaltung: eigene Farbwelt je App oder gemeinsame Palette mit einem Akzent je Stufe.
