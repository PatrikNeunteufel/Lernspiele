# Auftrag Cloud-Sitzung: Lernsteig

Stand: 2026-11-04 (aus LERN_Session13). Diese Sitzung arbeitet **nur am Lernsteig**; am Eulenpfad arbeitet Patrik
parallel lokal.

## Ziel
Den **Lernsteig** (Sekundarstufe I, Zyklus 3 des Lehrplans 21, Alter 12–15) vom Grundgerüst zu einem ersten
spielbaren Prototyp bringen: **prinzipiell gleich aufgebaut wie der Eulenpfad**, aber dem Niveau und dem Alter
angepasst — sachlich statt kindlich, **keine Eule als Figur** (nur noch Logo/Wegmarke), keine Sterne-Belohnung,
Fortschritt über Serien und Rekorde, Prüfungsvorbereitung und Üben im Vordergrund, kurze Runden bleiben.

Zuerst lesen:
- `docs/konzept_reihe_eulenpfad.md` (Abschnitt 2 Lernsteig, 3 Gemeinsame Basis, 5 Reihenfolge, 6 Offene Fragen)
- `docs/lernsteig/HANDOVER.md` (Stand, „Vor den ersten Übungen zu klären“)
- `docs/gemeinsame_mechaniken.md` (Regel zum Abschauen, Tabelle der Übernahmen)
- Als Vorbild, nur lesen: `docs/eulenpfad/rahmen.md` (Vertrag Rahmen ↔ Spiele) und `eulenpfad/spiele/gemeinsam/`
- `CLAUDE.md` im Repo (Projektregeln, Steckbrief)

## Grenzen — wichtig
- **Ändern nur:** `lernsteig/**`, `docs/lernsteig/**` und Zeilen in `docs/gemeinsame_mechaniken.md`.
  Nicht ändern: `eulenpfad/**`, `docs/eulenpfad/**`, `portal/**`, `tools/**`, `CLAUDE.md`, `.github/**`,
  `gratwanderung/**`. Braucht es dort etwas (Portal-Link, Werkzeug für beide Apps), **nur vorschlagen**.
- **Abschauen erlaubt, keine Abhängigkeit:** Mechaniken des Eulenpfads (Stufenmodell, Anmeldung/PIN, Protokoll,
  Kurztasten, Bildhöhe, Notizen, Testskript-Ideen …) dürfen kopiert und angepasst werden — aber kein Laden von
  Dateien aus `eulenpfad/`. **Jede Übernahme als Zeile in `docs/gemeinsame_mechaniken.md`** (Herkunft, Kopie,
  Anpassung, Kern-Kandidat). Später wird ausgelagert, was beide brauchen.
- **Speicher:** eigene Schlüssel `lernsteig:*` (alle Apps teilen unter github.io dieselbe Adresse); ob Konten mit dem
  Eulenpfad geteilt werden, ist eine Frage an Patrik (siehe unten).
- **Git:** Arbeite auf einem **eigenen Branch** (z. B. `lernsteig/prototyp`), **nie auf `master`** — jeder Push auf
  `master`, der einen App-Ordner ändert, veröffentlicht sofort auf GitHub Pages. Commits und Push nur auf diesen
  Branch und nur, weil diese Cloud-Sitzung anders nicht abliefern kann (Freigabe Patrik für diese Sitzung).
  Patrik übernimmt über einen Pull Request. **Kein `Co-Authored-By`-Trailer**, Commit-Messages im Stil der
  Repo-Historie (`LERN_Session…`-Präfix nicht nötig; Präfix `LST:` für Lernsteig).
- **Changelog:** nicht in `CHANGELOG.md` im Repo-Root schreiben (Konfliktgefahr mit der lokalen Arbeit); stattdessen
  `docs/lernsteig/CHANGELOG.md` anlegen und führen.

## Regeln von Patrik (gelten sonst nur lokal, hier ausdrücklich)
- **Sprache:** Antworten auf Deutsch. In allem, was Jugendliche sehen, Schweizer Schreibweise (ss statt ß).
- **Fachliche Treue zuerst:** Begriffe und Schreibweisen wie im Lehrplan 21 / Lehrmittel; Unsicheres als Annahme
  markieren und Patrik vorlegen. Netz-Zusammenfassungen sind kein Beleg — nur zitierter Wortlaut mit Quelle.
- **Entscheidungsfragen** an Patrik immer in diesem Format, jede Frage einzeln, am Ende der Antwort: Titel · Ort ·
  heutiger Wortlaut/Zustand · Problem in Klartext · Optionen als fertiger Text, die empfohlene vorn als **a
  (Empfehlung)** · Absatz *Warum die Empfehlung* (was den Ausschlag gibt, was für die andere spricht und warum es
  weniger wiegt, woran die Empfehlung kippen würde). Empfehlen nach „sauber/richtig“, nicht nach Aufwand; jede Option
  gegen alle messbaren Zielgrössen rechnen.
- **Pausieren nur mit Freigabe:** Einen Schritt nicht eigenmächtig aufschieben — in einem Satz vorlegen.
- **Daten:** nichts über Jugendliche an Server; alles lokal im Browser; keine Namen, Fotos, Handschrift in Code oder
  Commits.
- **Technik:** HTML/CSS/JS ohne Build und ohne externe Abhängigkeiten, offline lauffähig, eine Seite je Übung.
- **Bash:** nie `cd`, immer absolute Pfade. Deutsche Anführungszeichen „…“ in JS-Strings: nach „ nie ein ASCII-`"`.

## Erste Schritte (Vorschlag, Reihenfolge mit Patrik abstimmen)
1. Die offenen Fragen aus `docs/lernsteig/HANDOVER.md` als Entscheidungsfragen vorlegen: Speicher getrennt oder geteilt;
   Niveau-Modell (Real/Sek/Pro-Gymi, A/B/C je Kanton; getrennt, kooperativ, integriert); Aufsicht ab der Sek
   (Lehrperson, Eltern, Selbstanmeldung der Jugendlichen); Belohnung/Fortschritt (Serien, Rekorde, Abzeichen?).
2. Rahmen für den Lernsteig unter `lernsteig/gemeinsam/` (Kopie und Anpassung des Eulenpfad-Rahmens, eingetragen in
   `docs/gemeinsame_mechaniken.md`), eigener sachlicher Stil, eigener Vertrag `docs/lernsteig/rahmen.md`.
3. Prototyp Mathematik Zyklus 3 mit zwei Niveaus: 3–5 Übungen (Vorschläge mit Lehrplan-Kompetenz vorlegen),
   je mit Stufen, Aufgabengenerator und Prüffunktion (`aufgabeErzeugen`, `pruefeAufgabe` wie im Eulenpfad).
4. Testskript für den Lernsteig (Kopie/Anpassung von `tools/pruefe_spiele.js` unter `lernsteig/` oder
   `docs/lernsteig/`, vorgeschlagen, nicht in `tools/` — dort nur nach Rückfrage).
5. `docs/lernsteig/HANDOVER.md` nachführen, Session-Reports nach `docs/lernsteig/report/LST_Session<N>_<YYYY-MM-DD>.md`.

## Fertig heisst (für diesen Auftrag)
Ein Branch mit Prototyp (Startseite mit Niveau-Wahl, 3–5 spielbare Mathe-Übungen), eigener Rahmen ohne Abhängigkeit
zum Eulenpfad, Testskript grün, Doku (`rahmen.md`, Handover, Changelog, Report) nachgeführt, alle Übernahmen in
`docs/gemeinsame_mechaniken.md`, offene Entscheidungen im Format oben vorgelegt — und ein Pull Request gegen `master`.
