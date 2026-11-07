# LERN_Session19_2026-11-06_runde-js

Begonnen 2026-11-06, nach einer Pause (Haltepunkt 23:45) am 2026-11-07 fortgesetzt und abgeschlossen.

## Schwerpunkt
Der letzte offene Kern-Teil der Angleichung: der Ablauf einer Runde (`kern/runde.js`, Zuschnitt AR1 a) mit den acht
Einzelentscheiden RA1–RA8 a, in zwei Schritten (reine Hilfen 1.19.0, Ablauf 1.20.0) und in beiden Apps. Danach der
Ordner-Abgleich im Lernsteig mit dem Zusatz zu AS1 (OA1 a, OA2 a; dabei eine Lücke im Eulenpfad gefunden und geschlossen),
drei Meldungen Patriks zum Lernsteig (Grafiken, rationale-zahlen g zweimal: RZ1–RZ3 a) und der Notizblock als Kern-Teil
für beide Apps (NB1–NB4 a). Der volle Eulenpfad-Lauf auf dem Stand nach `141cc53`: „Keine Fehler.“ Sieben Commits von
`72a1a0e` bis `c9ab107`, dazu dieser Abschluss; gepusht bis `68f1945`.

## Neu
- **Kern 1.19.0–1.22.0** (`kern/`, docs/kern/rahmen.md 4.22, 4.23):
  - `runde.js` (`KERN.runde`): Gedächtnis als Durchgang über Runden und Serien (RA5 a), Auswahl der Aufgaben in fünf
    Suchstufen mit Serienbremse und Kürzen (RA6 a), Rekord und Runde nach Kennung (`eintragen`), Bestwert, Bestzeit,
    Wächter des Zwischenstands, Dauer auf 0,1 s (RA2 a); der Ablauf `lauf()` — Versuche, Fehler (Zeit um ist einer),
    Lösung nach dem dritten Fehlversuch, Ende der Serie, Zeit je Aufgabe ab `bereit` ohne Pausen (RA7 a), Eintrag mit
    `zeit` am Ende (RA1 a) und einer `liste` je Aufgabe (RA4 a), Serie auch im Protokoll (RA3 a); Umdeutung älterer Runden
    (`ausEulenpfad`, `ausLernsteig`).
  - `runden.js`: ein Zwischenstand einer Runde weicht dem späteren Stand; `daten.js`: Option `umdeuten` beim Einlesen.
  - `person.js`: `codeReicht` — eine gesperrte Aufsicht schaltet ihr Code nur auf einem Gerät ohne Aufsicht mit PIN frei
    (OA1 a).
  - `notizblock.js` (`KERN.notizblock`, NB1 a): der Notizblock aus dem Eulenpfad; neu Mal mit Komma in beiden Zahlen und
    der Kommaregel (NB3 a).
- **Lernsteig:** Ordner-Abgleich in der Verwaltung (`gemeinsam/abgleich.js`, Plan C5), Änderungshaken
  `LST.beiAenderung`; Notizblock bei jeder Zahl-Antwort (NB2 a, NB4 a); `LST.graphHoehe`.
- **Prüfer:** Kern-Nachrechnungen (Auswahl gegen die alte Schleife des Eulenpfads, 1200 Runden; Umdeutung gegen die alte
  Aufzeichnung beider Apps, je 300 Runden; rechne gegen 3000 Fälle); Eulenpfad-Testskript: Liste je Aufgabe passt zur
  Runde, Serie im Protokoll, Wiederholung in einer Serie; Lernsteig-Seitentest: RA8, Wiederholungen und Gedächtnis,
  Grafik höher als breit, Notizblock bedient, Vorgehen je Aufgabe; Konten: Aufsicht aus der Datei, Code neben einer
  anderen Aufsicht, Abgleich zwischen zwei Geräten. Jede neue Prüfung mit Gegenprobe.

## Geändert
- **Eulenpfad:** Runden über `KERN.runde.lauf`; Protokoll mit `liste` statt `aufgabenZeiten`/`fehlerAufgaben` (beim Laden
  und Einlesen umgedeutet); Serie auch im Protokoll (Zeit und Aufgaben zählen in Statistik, Stand, Wochenziel); in Serien
  keine Aufgabe zweimal (vorher keine der letzten 30); Gedächtnis je Person statt je Name; Zufallsmix mit Einträgen je
  Aufgabe; Statistik zeigt Serien und den Ausgang je Aufgabe mit Fehler; Freischalten einer Aufsicht neben einer anderen
  nur mit deren Bestätigung; `SCHRIFTLICH` ist Hülle über den Kern.
- **Lernsteig:** Ablauf über den Kern, Durchgang für alle Stufen, Kürzen, `zeit` vom Beginn ans Ende (umgedeutet); auf
  Anhieb nur „Richtig.“ (RA8 a); AS1 a aufgehoben (OA2 a); Grafiken höchstens quadratisch und halb so hoch wie das Fenster;
  rationale-zahlen g nach dem Wortlaut des Lehrplans (Nenner 2, 4, 5, 8, 10, 20, 50, 100, 1000; Faktoren zusammen bis 5
  Wertziffern; über die ganze Spanne verteilt — RZ1–RZ3 a).
- Doku: docs/kern/rahmen.md 4.7, 4.10, 4.19, 4.20, 4.22–4.24; rahmen.md 4.2, 7, 9, 10, 14, 21; lernsteig/rahmen.md 4, 5,
  5a0, 5b, 5c, 6; lehrplan/mathematik_zyklus3.md (MA.1.A.3 g nach dem Wortlaut); gemeinsame_mechaniken.md; Plan (RA1–RA8,
  OA1–OA2, RZ1–RZ3, NB1–NB4 a).

## Stolperfallen
- **Zufallsfolge verschoben durch eine früh gezogene Kennung:** `lauf()` zog die Kennung beim Start; im Ersatz-DOM ohne
  `crypto` kommt sie aus derselben Zufallsquelle wie die Aufgaben — die Klickzahlen wichen ab (zahlenhaus s2 473 → 609).
  Jetzt erst beim Speichern; danach gleich. Lehre: Vergleich der Klickzahlen gegen einen alten Lauf fängt auch solche
  Nebenwirkungen.
- **Ersatz-DOM ohne `globalThis.addEventListener`:** ein `const` auf oberster Ebene ist kein Fenster-Attribut; der
  Wächter des Kerns fand es nicht. `tools/pruef_dom.js` angeglichen.
- **Lücke im Eulenpfad:** Eine selbst gebaute Datei mit bekanntem Code brachte eine Aufsicht ohne Bestätigung aufs Gerät
  (Datei und Ordner) — gefunden beim Vorbereiten von OA1, geschlossen im Kern.
- **Geglätteter Lehrplantext:** `mathematik_zyklus3.md` sagte „Nenner bis 1000“, der Wortlaut nennt eine feste Liste —
  daraus 43 % der Bruch-Aufgaben in g ausserhalb des Lehrplans. Gleicher Fehlertyp wie die globale Regel zu
  Zusammenfassungen von Abrufen: sinngemässe Fassungen sind kein Beleg. **Prüfer-Kandidat:** Grenzen der Generatoren gegen
  wörtlich zitierte Lehrplanlisten prüfen (für rationale-zahlen g jetzt in `pruefeAufgabe`).
- **847 · 81 nach RZ2 a:** in der Vorlage als „eigene Frage“ offen gelassen statt als Frage gestellt — Patrik stiess
  erneut darauf. Offene Folgefragen gehören als Frage in die Vorlage, nicht als Nebensatz.
- **`sed -i` auf einer CRLF-Datei** machte aus `werkzeug.js` LF (zurückgestellt); für CRLF-Dateien nur Edit oder patchlib.
- Eigene Testfehler (gleich auf Listen, asynchrones `anlegen`, `.nb-weg` traf den falschen Schritt, Messung mit Grenze je
  Stufe) — jeweils am Befund geklärt, nicht am Code des Rahmens.
- Hook-Bedarf: keine Regel von Hand durchgesetzt, die nicht schon Prüfer ist; der Prüfer-Kandidat oben.

## Verifikation
- Kern „5597 Fälle, 0 Fehler.“ (Kopien aller drei Apps auf 1.22.0).
- Lernsteig „0 Fehler, 0 Hinweise.“ (320 Runden im Ersatz-DOM, Notizblock bedient), Konten „83 Fälle, 0 Fehler.“
- Gratwanderung „Keine Fehler.“
- Eulenpfad: **voller Lauf** auf dem Stand nach `141cc53` „Keine Fehler.“ (169 Spiele × 6 Stufen, 1178 s; Hinweise
  bekannter Arten). Danach (Notizblock, `c9ab107`) Stichprobe schriftlich-werkstatt, rechenprobe, malkreuz, zahlenhaus,
  preis-tabelle, quader-volumen „Keine Fehler.“ mit gleichen Klickzahlen wie im vollen Lauf (36 Stufen).
- Browser: Umdeutung alter Runden beim Laden (Eulenpfad), Verwaltung mit Abgleich und Freischalten ohne Codefeld
  (Lernsteig), Grafik auf 375 px, Notizblock am Desktop und auf 375 px (Lernsteig).
- **Nicht geprüft:** Ordnerwahl und Abgleich zwischen echten Geräten; Notizblock im Eulenpfad im Browser (nur Ersatz-DOM);
  voller Eulenpfad-Lauf auf dem Stand `c9ab107`.

## Offene Punkte / Plan für die nächste Session
1. **Vor dem Push von `c9ab107`** (Kern 1.22.0 berührt alle Seiten mit Notizblock): voller Eulenpfad-Lauf auf Patriks
   Entscheid vorschlagen.
2. **Prüfen durch Patrik:** Notizblock im Lernsteig ausprobieren (Mal mit Komma, Aussehen), rationale-zahlen g erneut
   üben; ob eine Übung den Block abschalten soll (Kipppunkt NB2, etwa Überschlagen).
3. **Zurückgestellt:** periodische Dezimalzahlen eingeben (Nenner 3 und 6 in MA.1.A.3.g, RZ1 a); Zyklus von g prüfen (die
   Lehrplanseite stellt g vor die Markierung „3“).
4. **C5 Rest:** Konten entfernen (auch gesperrte Aufsichten, Kipppunkt OA2), Freigabe je Gerät.
5. Dann laut Plan: B2 Schritt 3, C3, C4, C6–C8, C10; Prüfen durch Patrik: Zeichnungen und Listen aus LERN_Session17.
