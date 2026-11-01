# LERN_Session5_2026-11-01

## Schwerpunkt
Name für die Sammlung, Lage am Markt, Ausbau von Statistik und Empfehlungen, ein Zufallsspiel mit
einstellbaren Randbedingungen und ein Endlos-Modus über mehrere Spiele. Entschieden und gebaut:
Name „Eulenpfad“ (N1 a) und der Zufallsmix mit den Spielen im iframe (M1 a).

## Recherche (Antworten im Chat, hier knapp festgehalten)
- **Name:**
  - Vorschläge: Eulenpfad, Knobelwiese, Lernlichtung, Kauzli. Websuche ohne Treffer für die ersten
    drei, Kauzli nicht gesucht.
  - Swissreg am 2026-11-01 (Wortsuche): „eulenpfad“ 0 Treffer, „owlpath“ 0. Kontrolle „calcularis“
    ergab 2 Treffer.
  - Nächster Name: EULENBLICK (CH, Klassen 25, 41, 43, 45, aktiv); dazu eulenauge (Klasse 41).
    Gemeinsam ist nur „Eulen-“.
  - Nicht durchsucht: TMview/EUIPO, DPMA, Domains, App-Stores.
- **Markt:** Neun allgemeine Websuchen, dünne Lage.
  - Belegt sind: Anton gratis und werbefrei (Goethe-Institut); Mindsteps (IBE, Uni Zürich) ab 2023/24
    im Zyklus 2 im Kanton Zug Pflicht (zg.ch, FHNW); Calcularis fachlich umstritten (GDM Schweiz).
  - Nicht belegt: Nutzerzahlen und heutige Preise von Anton.
  - Einschätzung, nicht belegt: verkaufen kaum möglich; Nische für Familie, Lehrperson oder ein
    offenes Projekt.
- **Statistik-Ideen** (LERN-28, nicht gebaut):
  - Können-Wert je Lernziel nach Elo wie Math Garden (Klinkenberg u. a. 2011; dynamisches K, 2026);
  - Fehlermuster über eine Fehlerart in `ctx.falsch`;
  - Wiedervorlage falsch gelöster Aufgaben nach 1, 3 und 7 Tagen;
  - „sitzt automatisch“ bei Tempo-Lernzielen;
  - Prüfungsplan aus Lernzielblatt und Datum;
  - druckbarer Bericht.

## Neu
- **Name „Eulenpfad“** (Entscheid N1 a): Titel und Überschrift der Startseite (`start/start.js`), Titel
  der Statistik-Weiterleitung, README, CLAUDE.md. Technische Namen bleiben: Ordner, Schlüssel
  `lernspiele:*`, gesicherte Dateien `lernspiele-*.json` (sonst wären vorhandene Daten weg und
  `.gitignore` griffe nicht mehr).
- **Zufallsmix** (Entscheid M1 a), `mix.html` mit `mix/mix.js` und `mix/mix.css`:
  - Einstieg: eine Karte oben im Tab Spiele.
  - Einstellungen im Profil (`mix`): Fächer, Fokus, Stufe („👍 passend für mich“ oder fest), Timer,
    Länge (10, 20, ♾ Endlos), Wechsel nach 1 oder 3 Aufgaben.
  - Bis zu sechs Spiele, je ein iframe mit `?stufe=…&mix=1&timer=0|1[&endlos=1]`.
  - Nachrichten `bereit`, `ergebnis`, `erschoepft`, `geht-nicht` (Spiel → Mix) und `aufgabe`, `ton`
    (Mix → Spiel). Vertrag: `docs/rahmen.md` Abschnitt 9.
  - Endlos-Mix: Ende beim ersten Fehler oder bei „Zeit um“. Die Zeit startet bei der Vorgabezeit des
    jeweiligen Spiels und wird mit der Serie des Mix knapper.
  - Speicher, Runde: je Spiel ein Protokolleintrag mit `mix: "<Auswahl>"` und `sterne: null`.
  - Speicher, Endlos: ein Rekord unter `mix:<Auswahl>`, mit `stufe` (`s1`–`s6` oder `passend`) und
    `timer: true` oder null. Verlassen zählt bis dahin (`abgebrochen`).
- **Rahmen** (`spiel.js`):
  - Mix-Betrieb in `runde` (`mix`-Parameter), `body.im-mix` blendet Kopfzeile und Fortschritt aus;
  - `LS.tonSchalter`, `LS.rangliste` auf Modulebene;
  - Exporte `sterneFuer`, `speichereRekord`, `protokolliere`, `euleZeile`, `MIX_PRAEFIX`, `istMix`,
    `mixName`; Profilfeld `mix`.
- **Katalog:** `FAECHER` dort statt in `start/spiele.js`, weil Startseite und Mix sie brauchen.
- **Statistik:** Mix-Rekorde mit Namen („🎲 Zufallsmix · Mathe“), Stufe „👍 passend“, Timer „⏱ an“;
  Runden aus dem Mix mit „🎲 im Zufallsmix“ statt Sternen.
- **Testskript:**
  - Jedes Spiel im Mix: Stufe 3 mit Timer, Endlos-Spiele zusätzlich ihre erste Endlos-Stufe, je 12
    Aufgaben (`--mix=0` schaltet ab).
  - Geprüft wird: „bereit“, nichts gezeichnet vor „aufgabe“, genau ein vollständiges Ergebnis je
    Aufgabe, Stille danach, kein eigenes Protokoll und kein eigener Rekord.
  - Das Ersatz-DOM hat dafür ein `parent`, das Nachrichten sammelt.

## Geändert
- **Punkte-Schieber:** liest die Aufgabenart über `ctx.nr` aus einer festen Folge mit 8 Plätzen. Im
  Mix stürzte es bei der 9. Aufgabe ab (vom neuen Mix-Test gefunden). Jetzt beginnt die Folge von vorn
  (`ctx.nr % länge`). Gewöhnliche Runden laufen mit unveränderten Klickzahlen.
- **Testskript:** Ausnahmen im Spiel (`__fehler`) sammelt jetzt `mitAusnahmen()`, auch im Mix-Zweig.
  Der Zweig hatte sie zuerst übergangen, der Absturz erschien nur als „Hänger“-Hinweis.

## Stolperfallen
- **Spiele mit fester Folge über `ctx.nr`:** Ausser Punkte-Schieber nutzen Spiele `ctx.nr` nur für den
  ersten Satz der Eule, für Abwechslung (`% 2`) oder mit eigenem Rückfall (Zahlenrätsel-Tresor).
  Rechen-Rakete und Stellen-Detektiv laufen schon endlos. Mit `ctx.nr === 0` zurückgesetzte Zustände
  (Fledermaus, Lese-Detektiv, Einmaleins, Wortarten) setzen im Mix nie zurück. Folge: Das Spiel ist
  früher „erschöpft“, der Mix wechselt dann.
- **Browser-Pane im Hintergrund:** Ist die Pane versteckt, laufen Zeitgeber gedrosselt. Ein
  Fahrerskript mit vielen `await`-Pausen läuft dann über 45 s. Kurze Aufrufe in mehreren Schritten.
- **Lösung über 🔑 abgleichen klappt nicht allgemein:** Der Lösungstext ist oft ein Satz („8000 liegt
  genau auf einem Strich“), kein Knopftext. Der Mix-Lauf mit lauter richtigen Antworten wurde deshalb
  im Ersatz-DOM gemessen, nicht im Browser.
- **Hook-/Prüfer-Kandidaten:**
  - Der Backslash-Hook griff einmal (Python im Heredoc), gelöst mit einer Datei über das
    Write-Werkzeug. Kein neuer Hook nötig.
  - Der Mix-Zweig des Testskripts verlor Ausnahmen still. Das ist kein Hook-Fall; die Gegenprobe
    („alten Fehler einsetzen, schlägt der Test an?“) bleibt Pflicht für jede neue Prüfung.

## Verifikation
- **`file://`-Probe** (Chrome und Edge headless): `postMessage` zwischen iframe und Seite; gemeinsamer
  `localStorage` und `sessionStorage` (Aufsicht); Adresse im iframe. Alles funktioniert.
- **`node tools/pruefe_spiele.js --runden=5`** zweimal über alles: **„Keine Fehler.“**
  - Gleich wie vor der Sitzung (gegen `git archive 311cee3` verglichen, gleiche Klickzahlen):
    11 Hinweise „zu wenig verschiedene Aufgaben“ und der bekannte Serien-Hinweis bei Flächen-Pixel s6.
  - Mix: 78 Spiele mit 12 Ergebnissen. Unter 12 bleiben Doppel-Spiegel, Körper-Puzzle,
    Lese-Detektiv, Schätz-Waage, Wörter-Trenner (erschöpft) und Zielzahl-Jagd (3; vermutlich gehen
    dem Zufallsfahrer die Klicks aus, nicht nachgeprüft).
- **Gegenprobe:** alter Punkte-Schieber in einer Kopie → „Ausnahme: TypeError … 1 Fehler.“
- **Endlos-Mix-Zeit** (Ersatz-DOM, Einmaleins s3): Serie 0 → 10 s, 10 → 6,2 s, 40 → 3 s, wieder 0 → 10 s.
- **Im Browser** (Vorschau `lernspiele-3`):
  - Startseite mit Namen und Mix-Karte; Einstellungen.
  - Runde über 10 Aufgaben, Wechsel nach 3, je Spiel ein Protokolleintrag.
  - Endlos-Mix: Ende mit Rekord `mix:Mathe`, als Aufsicht mit `test: true`.
  - 60 Wechsel nach jeder Aufgabe; Handy 375 px ohne seitliches Scrollen; keine Konsolenfehler.
  - Die Testkonten sind danach gelöscht.
- **Nicht geprüft:** Safari/iPad und Firefox; ein Mix-Lauf mit lauter richtigen Antworten im Browser;
  Tablet 768 px.

## Offene Punkte / Plan für die nächste Session
1. **LERN-21:** Startseite, Mix und die 28 neuen Spiele ansehen. Den Mix auf dem Tablet der Kinder
   (Safari?) prüfen (LERN-30), dabei die Leiste auf dem Handy (drei Zeilen).
2. **LERN-11, LERN-4** wie bisher; Prüfung 4.2 am Do 05.11.
3. **LERN-28:** Statistik-Ausbau entscheiden; zuerst der Können-Wert je Lernziel, er trägt auch
   „passend“ im Mix.
4. **LERN-29:** vor LERN-17 Markenrecherche EU (TMview) und Domain für „Eulenpfad“.
5. Offene Entscheide aus LERN_Session4: Flächen-Pixel s6, LERN-27.
