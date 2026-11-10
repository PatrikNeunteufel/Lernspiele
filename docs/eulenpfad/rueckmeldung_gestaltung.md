# Rückmeldung zur Gestaltung — Eingang (noch kein Konzept)

Stand: 10.11.2026 (LERN_Session27) · **Eingang, nichts entschieden.** Aufgenommen auf Wunsch Patrik als nächster
Arbeitsschritt **nach den Abschluss-Animationen** (Ausrollen nach AR1 a, docs/konzept_abschluss_animationen.md 7).
Daraus wird zuerst ein Konzept mit Entscheidungsfragen, dann gebaut.

## Auslöser

Eine Lehrperson fand, der Eulenpfad sehe „steril“ und „nach KI/Claude“ aus. Patrik hat dazu eine Einschätzung anhand von
Screenshots zusammengefasst (Chat LERN_Session27). Kern der Einschätzung, in eigenen Worten:

- **Inhaltlich stark, im Auftritt ein Verwaltungsportal:** Fehleranalysen, Konzentrationsverläufe, Ruhezeiten, dezente
  Hilfen, Lehrplancodes sind tief — die Oberfläche wirkt aber wie ein Patientenportal oder ein Firmen-Dashboard.
  „Krumme Rahmen“ als Filter darüber lösen das nicht.
- **Woher der Eindruck kommt:**
  1. **Viel kleiner grauer Text auf den Karten** (Spielkarten, Empfehlungen, z. B. „In den letzten 3 Aufgaben nur 33 %
     auf Anhieb richtig …“): ein Kind liest ihn nicht, eine Lehrperson hält ihn für generiert.
  2. **Standard-Look von Web-Dashboards:** Pillen-Filter, Tab-Leiste oben, zarte Verläufe, hellgraue Karten mit dünnem
     farbigem Rand, System-Schrift.
  3. **Keine Bild-Identität der Spiele:** je Karte nur ein kleines Symbol und Text; Kinder erkennen Spiele an Bildern,
     Szenen, Figuren.
- **Was schon gut ist:** im Spiel selbst (Beispiel Finger-Zähler) — gross illustrierte Hände, die Eule mit Mütze, der
  grüne Knopf „✓ Fertig“ mit Tiefe. „Das ist die eigentliche Spielwelt; das Portal drumherum wirkt wie ein
  Verwaltungsakt.“

## Vorgeschlagene Hebel (aus der Rückmeldung)

1. **Bildkarten statt Textkarten:** auf der Übersicht rund 70 % des Textes weg; je Spielkarte ein kleines buntes
   Vorschaubild statt des Symbols. **Idee Patrik:** Screenshots der Abschluss-Animationen als Kartenbilder — darum erst
   nach dem Ausrollen.
2. **Kinder-Bühne und Lehrer-Cockpit trennen:** tiefe Auswertungen nur für Aufsicht und Lehrperson; das Kind sieht
   kurz und bildhaft, was es geschafft hat („3 Sterne gesammelt“).
3. **Schrift und Knöpfe:** rundere Schrift für Titel und Kartennamen (genannt: Fredoka, Quicksand, Baloo 2), Hauptknöpfe
   mit sichtbarer Tiefe (dunklerer Rand unten als „Druckknopf“).

## Beim Konzept zu klären (Vorarbeit, noch keine Frage an Patrik)

- **Frühere Entscheide:** `docs/eulenpfad/konzept_profil_kind.md` ST1 a regelt schon, was ein Kind in der Statistik sieht
  (vier Karten; Konzentration, Vorgehen, Lernziele nur für die Aufsicht) — Hebel 2 dagegen abgleichen: was davon ist
  umgesetzt, was wirkt trotzdem zu „Börse“? Weitere `docs/konzept_*` und `docs/eulenpfad/konzept_*` durchsuchen.
- **Schrift ohne externe Abhängigkeit** (LERN-1, offline per Doppelklick): eine Schrift nur als Datei im App-Ordner (Lizenz
  prüfen, etwa SIL OFL), nicht von einem Schriftdienst; Grösse der Datei, Lesbarkeit der Ziffern (Stellenwert,
  Tausendertrennung), deutsche Sonderzeichen.
- **Was im Spiel bleibt:** Die Spielseiten gelten als gelungen — Änderungen zuerst an Startseite (Tabs Spiele, Profil,
  Statistik), nicht an den Spielen.
- **Kartenbilder:** aus der Vorschau (`tools/feier_vorschau.html`, `?feier=`) erzeugt oder als SVG direkt aus `feier.js`
  (gleiches Bild, keine Bilddateien, wächst mit jedem Spiel) — abwägen; Bildhöhe je Gerät (`docs/eulenpfad/rahmen.md` 20).
- **Text auf den Karten:** welcher Text bleibt für Kinder (Name, Bild), wohin geht der Rest (Aufsicht, Hilfe, langes
  Drücken zum Vorlesen).
- **Prüfen** mit Kindern und der Lehrperson, die die Rückmeldung gab, wenn ein Entwurf steht.
