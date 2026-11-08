# Plan: Angleich der Reihe (Eulenpfad, Lernsteig, Gratwanderung) und Rücknahme des Lernsteigs

Stand: 2026-11-05 (LERN_Session15). Erfassung nach der Prüfung der Cloud-Sitzung LST_Session1 (Repo
`PatrikNeunteufel/Lernsteig`, gemergt als `8f55173`) und der lokalen Recherchen (`3927603`, `9d20452`). Grundlage:
Auftrag Patrik vom 2026-11-05 im Chat, [Übergabe](Uebergabe_Lernsteig_an_lokale_Sitzung.md).

**Grundsätze (Auftrag Patrik):**
- **Lernspiele ist massgebend.** Was hier aktueller ist, gilt; im Zweifel wird nachgefragt.
- **Erst das Grundgerüst angleichen**, dann Inhalte. Der Eulenpfad bleibt im Aussehen, wie er ist (höchstens kleine
  Retuschen); der Lernsteig wird ihm im Aufbau ähnlich, nur erwachsener; die Gratwanderung bekommt dasselbe Gerüst.
- **Doku folgt dem richtigen Soll, nicht dem fehlerhaften Ist:** Wo Code und Doku auseinanderlaufen, wird geprüft,
  was richtig ist; ist der Code falsch, wird der Code korrigiert.
- **Nichts Ungeprüftes online:** Im Lernsteig ist jede Übung gesperrt, bis sie im Entwickler-Modus geprüft ist (wie
  im Eulenpfad). Damit ist ein Push auf master ungefährlich.

## Übersicht

| Nr. | Paket | Status | Einzelheiten |
|---|---|---|---|
| A | Rücknahme des Lernsteigs nach Lernspiele, mit Sperre | erledigt 2026-11-05 (LERN_Session15, Commit d27d7cd) | Abschnitt A |
| B | Gemeinsamer Kern und Testgerüst für alle drei Apps | in Arbeit seit 2026-11-05 (LERN_Session15, B1): Kern 1.26.0; offen: Gruppenleitung mit LERN-48 (RL1 a); Testgerüst B2 Schritte 1–3 gebaut (LERN_Session17–20) | Abschnitt B |
| C | Grundgerüst Lernsteig wie Eulenpfad, Gratwanderung dazu | in Arbeit seit 2026-11-06 (LERN_Session16, C1 vorgezogen, AZ1 a): C1, C2 und C9 gebaut, C5 bis auf die Gruppenleitung, C6 zum Teil (Entwickler-Modus), C3 gebaut (LERN_Session21) | Abschnitt C |
| D | Fehler und Schwachstellen beheben | offen, mit B/C | Abschnitt D |
| E | Fachliche Korrekturen der Übungen | in Arbeit seit 2026-11-07 (LERN_Session21, E 9): E 8 und E 9 erledigt, übrige offen oder teilweise | Abschnitt E |
| F | Recherchen ordnen, Widersprüche und Zweifel klären | offen | Abschnitt F |
| G | Doku-Drift beseitigen | offen, laufend | Abschnitt G |
| H | Portal: Anleitungen und Listen je App | offen, nach C | Abschnitt H |

---

## A. Rücknahme des Lernsteigs

1. Aus `Lernsteig@8f55173` **nur nach Pfadliste** kopieren, nie das Diff seit `b2276cf` anwenden (es würde hier
   `docs/monetarisierung_recherche.md` löschen, `docs/anleitung_freiwillige_beitraege.md` zurücksetzen und den Kopf der
   `CLAUDE.md` überschreiben):
   - `lernsteig/**`, `docs/lernsteig/**` ohne `AUFTRAG_cloud.md` und `SYNC_lernspiele.md` (Cloud-Fassungen),
   - `docs/commons_bibliothek.md`,
   - `docs/gemeinsame_mechaniken.md` ganz (hier seit `382cdcc` unverändert, Blob `8013f97`).
   - Nicht: `.claude/` (globale Sammlung, privat), `CLAUDE.md`-Kopf, `.gitignore` des Cloud-Repos.
2. `.gitignore`: `lernsteig-*.json`, `gratwanderung-*.json`, `__pycache__/` (EP4).
3. **Sperre im selben Commit** (A1 a): Jede Lernsteig-Übung trägt `neu` und ist gesperrt, solange sie nicht im
   Prüfstand `lernsteig/gemeinsam/pruefstand.js` steht (mit Inhaltslisten: dazu eine geprüfte Liste). Startseite ohne
   Verweis mit „noch nicht freigegeben“, Übungsseite bei direktem Aufruf nur der Hinweis; die angemeldete Aufsicht
   sieht alles mit Vermerk (`LST.sperrGrund`, `LST.uebungSichtbar` in `rahmen.js`). Entwickler-Modus und Freigabe je
   Gerät kommen mit C6. Das Feld `geprueft` in den `listen` des Katalogs ist damit überholt (zweite Quelle) und fällt
   mit C6 weg.
4. `docs/lernsteig/SYNC_lernspiele.md` aus dem Cloud-Repo **nicht** übernehmen; in Lernspiele eine eigene kurze Notiz
   „Rücknahme 2026-11-05, Lernsteig-Commit `8f55173`, danach wird nur noch hier gearbeitet“. Das Cloud-Repo gilt als
   abgeschlossen (Frage A2).
5. Datenschutz-Abschnitt in `CLAUDE.md` nachführen (EP3, neu gefasst): Profil mit Geburtsdatum (Tag freiwillig, siehe
   B3), im Lernsteig zusätzlich Land, Kanton, Niveau je Fach; Ausnahmen Sichern/Einlesen und Aufsicht mit Zustimmung.

## B. Gemeinsamer Kern und Testgerüst

Entscheide KB1 a (Ordner `kern/` als einzige Quelle, `tools/kern_verteilen.py` verteilt Kopien mit Version und
Prüfsumme) und KB2 a. **Erweitert nach Auftrag Patrik:** Der Kern beginnt nicht nur mit `bruch.js` und Zahlschreibung,
sondern umfasst gleich die Teile, die das gemeinsame Grundgerüst trägt (C):

| Kern-Teil | Quelle heute | Ziel |
|---|---|---|
| `zahl.js` | `LS.zahlText`/`dezimalText`, `LST.zahlText`/`dezimalText` | Schreibweise als Einstellung `{ tausender, abStellen, minus, dezimal }`; nur ganze Zahlen gruppieren (K6) |
| `bruch.js` | `lernsteig/gemeinsam/bruch.js` | unverändert, Kommentar richtig (K7), `zahl("abc")` mit eigener Meldung |
| `speicher.js`, `zufall.js`, `el` | beide Apps | Präfix als Parameter, Zufallsquelle austauschbar |
| `profil.js` | `spiel.js` Profil, `konten.js` | ein Format für alle Apps (B3), App-Felder daneben; Übernahme eines Profils in eine andere App (C9) |
| `rollen.js` | `spiel.js` PIN/Code/Frage, Anmeldung, `konten.js` | Rollen Lernende, Aufsicht, Lehrperson/Gruppenleitung, Entwickler; PIN mit Salz und Hash, Code, Frage für Erwachsene, Bestätigung durch bestehende Aufsicht (KR2 a), Zurücksetzen mit Frist |
| `freigabe.js` | `pruefstand.js`, `entwicklung.js`, Verwaltung → Freigabe | Prüfstand je App-Datei, Freigabe je Gerät, Listen je Eintrag |
| `suche.js` | `LS.suche`, `LS.passung`, `LS.aehnlich` | Relevanz mit Feldgewichten, Passung als Faktor; App liefert Felder und Passung |
| `protokoll.js`, `statistik.js` | Protokoll, `auswertung.js`, Lernsteig `rahmen.js` | ein Rundenformat mit `format`, Auswertung (Fazit, Bedarf) mit App-Regeln |
| `daten.js` | `LS.zusammenfuehren`, `abgleich.js`, Lernsteig `daten.js` | Sichern, Einlesen **mit Schema-Prüfung und atomar** (D4), Zusammenführen |
| `einladung.js` | Lernsteig `konten.js` | Format `{ format, v, name, geboren, klasse, … }`, von beiden Apps gelesen |
| `terme.js`, Rechenkern `rechner.js` | Lernsteig | ohne verdeckte Globals (`LST.zahlText` übergeben) |

**Entwicklerdoku des Kerns:** [docs/kern/rahmen.md](kern/rahmen.md) (Teile, Schnittstellen, Einbinden, Verteilen,
Prüfen); jeder neue Teil bekommt dort seinen Abschnitt, bevor er umzieht.

**B1 Werkzeug:** `tools/kern_verteilen.py` bündelt die Teile aus `kern/TEILE` in **eine** Datei je App,
`<app>/kern/kern.js`, Kopfzeile `kern <Version> · Prüfsumme sha256:…`; `--pruefe` schreibt nichts und meldet eine
von Hand geänderte Kopie oder gleiche Version mit anderem Inhalt als Fehler, eine ältere Version als Hinweis.
`kern/VERSION`, `kern/CHANGELOG.md`. Eine Datei je App statt einer Kopie je Teil, damit ein neuer Kern-Teil keine der
rund 200 Seiten anfasst: Jede Seite lädt einmal `kern/kern.js` vor dem Rahmen ihrer App. Die Teile hängen sich an
`KERN` (`KERN.zahl`, `KERN.bruch`, …). Tests: `node tools/pruefe_kern.js` (Teile gegen feste Beispiele und
Nachrechnungen, dazu die Kopien); das Testskript jeder App prüft ihre Kopie.
Stand 2026-11-07: Kern 1.25.0 (seit 1.22.0 auch der Notizblock, NB1 a) mit Zahl, Bruch, Terme, Rechenkern, Speicher, Zufall, `el`, Geheimnis, Person,
Freigabe, Suche, Runden, Daten (ein Dateiformat für Sichern, Einlesen und Abgleich mit Löschvermerken und Schutz nach
DF4 a), Anmeldung (mit Gast), Entwicklung, Einladung, Auswertung, Übernahme einer Aufsicht, Rollleiste und
Personen-Knopf; Eulenpfad und Lernsteig benutzen, was sie brauchen (`daten.js` beide), die Gratwanderung hat die
Kopie und lädt sie mit C8. Seit 1.23.0 das Tastenfeld, seit 1.24.0 das Ausblenden je Gerät, seit 1.25.0 die Gliederung
nur in Dreiergruppen beim Lesen (ZL1 a). Seit 1.17.0 auch der Abgleich über einen Ordner (DF3 a; Lernsteig mit der Verwaltung, Plan C),
seit 1.18.0 die Rollen der Aufsicht (`rollen.js`: Bestätigung, PIN vergessen, Zurücksetzen mit Frist; RL2 a, beide Apps).
Seit 1.19.0/1.20.0 der Ablauf einer Runde (`runde.js`, AR1 a, RA1–RA8 a): Gedächtnis als Durchgang, Auswahl mit
Serienbremse und Kürzen, Rekord nach Kennung, Bestwert, Bestzeit, Wächter des Zwischenstands, dazu der Ablauf `lauf()`
(Versuche, Lösung nach dem dritten Fehlversuch, Ende von Runde und Serie, Zeit je Aufgabe ab `bereit`, Eintrag mit `zeit`
am Ende, `dauer` auf 0,1 s, einer Liste je Aufgabe; Serie auch im Protokoll) und die Umdeutung älterer Runden; beide Apps,
dazu RA8 a im Lernsteig. Prüfen der Antwort und der Vertrag `aufgabeErzeugen`/`pruefeAufgabe` bleiben nach AR1 a in den
Apps. Noch nicht im Kern: die Gruppenleitung (G2 a), die mit den Gruppen kommt (RL1 a, LERN-48).

**B2 Testgerüst für alle Apps:** Ein Testskript-Kern unter `tools/` mit Treiber je App, so dass ein Aufruf alle drei
Apps gegenprüft (`node tools/pruefe.js [eulenpfad|lernsteig|gratwanderung] …`). Er prüft auch, dass jede Kern-Kopie mit
`kern/` übereinstimmt.
- **Kein Playwright.** Der Eulenpfad prüft ohne Browser im Ersatz-DOM (`tools/pruef_dom.js`, `vm`), und wo echte
  Darstellung nötig ist, steuert er Chrome direkt über das DevTools-Protokoll (`tools/bildhoehe.js`,
  `tools/anleitung_bilder.js`). Der Lernsteig übernimmt beides; der Browser-Teil seines Testskripts
  (`pruefe_uebungen.js --browser`, Playwright, lokal nicht installiert) wird darauf umgestellt.
- Neue Prüfungen (Lücken aus der Prüfung):
  - Annahme von Antworten: knapp falsch (abgeschnittene Ziffer, letzte Stelle ±1, relative Abweichung), gleichwertige
    Schreibweisen (Terme, gemischte Zahlen, Malzeichen), Eingaben, die `bewerte` zum Absturz bringen (Ausnahmen
    abfangen und melden). **Gebaut LERN_Session20:** `LST.antwortPruefen` (dieselbe Prüfung wie die Seite), in
    `pruefe_uebungen.js` je Stufe 300 Aufgaben; Fund: Apostroph und Leerzeichen galten überall als Gliederung (ZL1 a).
    Gemischte Zahlen: der Lernsteig fragt sie heute nicht als Antwort ab.
  - Text gegen Prüfdaten: Ereigniswortlaut in Kombinatorik/Zufall aus den Daten neu erzeugt und verglichen;
    Prüffunktionen, die nur auf `daten` rechnen, lesen den angezeigten Text (flaechen-volumen, koerper-winkel,
    prozent-funktionen, daten-rabatt, folgen, sachsituationen, Teile von zehnerpotenzen und binome-gleichungen).
    Vorgehen TD1 a; **gebaut LERN_Session20** für alle zehn Übungen und alle ihre Aufgabentypen, je mit Gegenprobe; kein Fund.
  - `konten`/`rollen` und `daten`: kaputte und fremde Dateien, Ids fremder Konten, voller Speicher, Zeitzone. **Zeitzone
    gebaut LERN_Session20:** Kern 1.26.0 `KERN.zeit` (Kalendertage in Ortszeit) für Übungstage, Geburtsdatum-Grenze,
    „angelegt am“, Dateinamen, Meldungen und Prüfvermerke; `pruefe_kern.js` sucht Tage aus UTC-Zeiten im Code.
  - Vielfalt: Mindestvorrat je Stufe auch ohne Endlos (Hinweis unter 50 verschiedenen Aufgaben). **Gebaut
    LERN_Session20 nach VF1 a**, gemessen in Runden statt an 50; die 21 gemeldeten Stufen stehen in E 9.
  - Rechner: NaN, Division durch 0, 10-stellige Anzeige. (Im Kern-Test, `pruefe_kern.js` Rechenkern.)
  - Seiten des Lernsteigs (Start, Statistik, Aufsicht, jede Übung) im Ersatz-DOM wie im Eulenpfad, mit Suche nach
    „null“, „undefined“, „NaN“ im sichtbaren Text. Anlass: Die Startseite zeigte ohne Wochenziel „null“ (natives
    `append` mit `null`, behoben 2026-11-05); ohne laufenden Browserteil fiel es nicht auf.
  - Stand 2026-11-05: `tools/pruefe_konten.js` (bis LERN_Session17 unter `docs/lernsteig/werkzeuge/`) (Konten, Aufsicht, Sichern und Einlesen: Umzug,
    PIN und Code, Bestätigung, Verbinden, kaputte und fremde Dateien, voller Speicher, Einladung; 33 Fälle), vom
    Testskript des Lernsteigs mitgerufen.

**B3 Geburtsdatum (Vorgabe Patrik 2026-11-05):** In allen Apps vollständig, gespeichert als ISO `JJJJ-MM-TT`, gezeigt
als `TT.MM.JJJJ`. Fehlt der Tag (Eulenpfad-Profile seit LERN_Session14: `JJJJ-MM`), bricht nichts: Das Alter wird wie
heute aus dem Monat gerechnet, das Profil bietet an, den Tag nachzutragen. Einladung und Einlesen nehmen beide Formen
an. Ersetzt im Eulenpfad die Datensparsamkeit „Monat ohne Tag“ (CLAUDE.md und `rahmen.md` 18 nachführen).

**B4 Reihenfolge des Umbaus:** Teil für Teil, je Teil beide Apps umstellen und das Testskript über alle grün halten;
die Zeile in `gemeinsame_mechaniken.md` auf „im Kern seit <Version>“.

## C. Grundgerüst Lernsteig wie Eulenpfad (und Gratwanderung)

Ziel: gleicher Aufbau, gleiche Begriffe, gleiche Bedienwege; der Lernsteig sachlicher im Ton und Aussehen, ohne
Kindersprache.

1. **Anmeldung zuerst** (wie Eulenpfad L1 a): Konten zum Antippen, „Ich bin neu“ (Jugendliche, Erwachsene mit
   Bestätigung; eine Frage gibt es im Lernsteig nicht, weil kein Stoff Jugendliche der Oberstufe sicher von Erwachsenen
   trennt, EF1 a), dazu **Gast**: nichts wird gespeichert, Profil ohne Wirkung, Freigaben des Geräts gelten (Frage C2).
2. **Tabs in derselben Reihenfolge wie im Eulenpfad:** Übungen · Profil · Statistik · Erfolge · Verwaltung (nur
   Aufsicht). Im Lernsteig zeigt „Erfolge“ nach BF1 a Kompetenzstand, Serie über Tage und Rekorde, keine Sterne.
   Prüfungsvorbereitung: Frage C1.
3. **Tab Übungen wie Tab Spiele:** gruppierte Kacheln nach Fach und Thema mit Symbolen, Sortierung (Fach/Thema, passt
   zu dir, Alphabet, Stufe), einklappbarer Filter, Suche mit Relevanz und Passung (Kern `suche.js`), ähnliche Übungen,
   Favoriten. Drei Schritte: (1) Kacheln nach Fach und Thema mit Symbolen und Favoriten — gebaut in LERN_Session21
   (`lernsteig/start/uebungen.js`; Favoriten, Zuklappen und Ansicht im Konto; Piktogramme nach SY1 a in `lernsteig/gemeinsam/symbole.js`); (2) Filter,
   Sortierung, Suche (`KERN.suche`) — gebaut in LERN_Session21; Sortierung „nach Stufe“ nach SS1 a: Lage der
   Lehrplan-Stufen zum Grundanspruch Zyklus 3 der Kompetenz (`LST_START.stufenLage`), Anschluss zuerst; (3) Passung, Wackel-Stufen, ähnliche Übungen — gebaut in LERN_Session21 nach P1 a (Prüfung neutral ohne hinterlegte
   Stufen) und W1 a (mindestens 5 Aufgaben, unter 70 % auf Anhieb). **Mehr Personalisierung als im Eulenpfad:** Passung zusätzlich aus Niveau je Fach und Prüfungsziel
   (Übungen mit geprüften Stufen des gewählten Ziels nach vorn), Wackel-Stufen aus dem Kompetenzstand.
4. **Profil:** Person (Vorname, Geburtsdatum B3, Klasse 1.–3. Oberstufe, Land und Kanton), Niveau je Fach,
   Prüfungsziel, Rechnermodell, Fokus; Aufbau wie das Eulenpfad-Profil (Formular, Speichern, sofort wirkende Häkchen).
5. **Verwaltung (nur Aufsicht):** Konten, Freigabe, Abgleich, Einstellungen, Entwicklung — wie Eulenpfad. Abgleich über
   einen Ordner seit LERN_Session19 (`lernsteig/gemeinsam/abgleich.js`; Aufsichten nach OA1 a, OA2 a); Untertabs und
   Freigabe je Gerät (mit Abgleich) seit LERN_Session20, ebenso Konten löschen und ausblenden, auch gesperrte
   Aufsichten (KE1 a, KE2 a).
   **Aufsicht wie Eulenpfad** (D5): neue Aufsicht nur mit Frage und Bestätigung durch eine bestehende, PIN vergessen
   mit denselben Stufen. Dazu im Lernsteig die Verbindung mit Zustimmung (AU1 a, AF1 a, AF2 a) und die Rolle
   **Lehrperson/Gruppenleitung** nach [konzept_gruppen.md](konzept_gruppen.md) (G2 a: „Ich bin Lehrperson“), in
   beiden Apps gleich.
6. **Freigabe nach Prüfstand (FG1 a)** über den Kern: Prüfstand `lernsteig/gemeinsam/pruefstand.js`, Entwickler-Modus
   mit `tools/entwickler_server.py` auch für den Lernsteig, Listen je Eintrag (`listenpruefung.js`).
7. **Anleitungen:** `lernsteig/anleitung/jugendliche.html` und `aufsicht.html` im Muster des Eulenpfads, Bilder mit
   `tools/anleitung_bilder.js` (Musterkonten je App).
8. **Gratwanderung:** dasselbe Gerüst ohne Übungen (Anmeldung, Tabs, leerer Katalog, Anleitung als Gerüst), damit der
   Kern von Anfang an drei Apps trägt und das Testskript sie mitprüft.
9. **Profil in die anderen Apps übernehmen** (Wunsch Patrik, 2026-11-05): Eine Aufsicht des Eulenpfads legt aus
   ihrem Eulenpfad-Profil mit dessen Daten ein Profil im Lernsteig und in der Gratwanderung an, wenn der Name dort
   nicht schon belegt ist (belegt → Hinweis, nichts überschrieben). Alle Apps teilen den Ursprung und damit
   localStorage; der Kern (`profil.js`, `rollen.js`) liest und schreibt dafür mit dem Präfix der Ziel-App, ohne dass
   eine App die andere lädt. Gilt in jede Richtung zwischen den drei Apps. Entschieden (Ü1 a, Ü2 b, 2026-11-06):
   Kennung, Name, Rolle, Art, PIN-Prüfwert sowie Sicherheitsfrage und Antwort-Prüfwert reisen mit, der
   Wiederherstellungscode wird in der Ziel-App neu ausgegeben; keine Bestätigung in der Ziel-App. Gebaut in
   LERN_Session16 (`KERN.person.uebernehmen`) für Eulenpfad ↔ Lernsteig; die Gratwanderung folgt mit C8.
10. **Eulenpfad:** übernimmt aus dem Angleich nur, was er neu braucht (Kern-Teile, Gast, Geburtstag mit Tag, Rolle
   Lehrperson); Aussehen bleibt.

## D. Fehler und Schwachstellen (aus der Prüfung 2026-11-05)

| Nr. | Wo | Fehler | Behebung |
|---|---|---|---|
| D1 | `lernsteig/gemeinsam/rahmen.js:367` | absolute Toleranz: in `zehnerpotenzen` k gilt `0.000000076` für `7.62 · 10⁻⁸` | exakter Vergleich über Brüche, Toleranz nur wo gerundet wird, dann relativ |
| D2 | `kombinatorik/aufgaben.js:97` | „mindestens eine Fünf“, „höchstens eine Zwei“ mehrdeutig | „eine Augenzahl von mindestens 5“; Challenge einheitlich als Anzahl |
| D3 | `terme.js:123–125` | Absturz bei `(3)(2x+3)` | `lies` in `try`, Rückmeldung „nicht lesbar“ — erledigt 2026-11-06 (LERN_Session17, Kern 1.14.0 `KERN.terme`: Formfehler „Zahl mal Klammer“) |
| D4 | `daten.js:36–62` | Einlesen ohne Schema, halber Import, vergiftet spätere Importe | Schema je Datensatz, erst prüfen, dann schreiben (Kern `daten.js`) — erledigt 2026-11-05 (LERN_Session15, `lernsteig/gemeinsam/daten.js`, Test `pruefe_konten.js`) |
| D5 | `aufsicht.js:135`, `konten.js:130` | Einlesen verbindet fremde Konten ohne Zustimmung; neue Aufsicht ohne Bestätigung | nur neu angelegte Konten verbinden; Aufsicht wie Eulenpfad (C5) — erledigt 2026-11-05 im Lernsteig (Bestätigung durch bestehende Aufsicht, nur neue Konten verbinden; Test `pruefe_konten.js`) |
| D6 | `konten.js:24`, Eulenpfad `spiel.js:393` | fehlt `crypto.subtle` (http über LAN), technische Meldung | Prüfung und verständliche Meldung, im Kern — erledigt 2026-11-05 (Kern 1.2.0 `KERN.geheimnis`, beide Apps seit 1.3.0) |
| D7 | `statistik.js:13`, `aufsicht.js:85` | Übungstage in UTC, Wochenziel in Ortszeit | überall Ortszeit (Kern) |
| D8 | `werkzeug.js:41`, Eulenpfad `spiel.js:22` | `zahlText(1234.5678)` → `1'234.5'678` | nur ganze Zahlen gruppieren (Kern `zahl.js`) — erledigt 2026-11-05 (Kern 1.0.0) |
| D9 | `rechner.js:112` | NaN als „zu gross“, 11 Stellen bei 9999999999.6 | „nicht definiert“, Anzeige auf 10 Stellen — erledigt 2026-11-06 (LERN_Session17, Kern 1.14.0 `KERN.rechner`) |
| D10 | `terme.js:63` | Exponent unbegrenzt friert den Tab ein | Grenze mit Meldung — erledigt 2026-11-06 (LERN_Session17, Kern 1.14.0: Exponent ≤ 100, ≤ 2000 Glieder) |
| D11 | `rahmen.js:121`, `daten.js` | voller Speicher verliert Runden still | Rückgabe auswerten, Warnung wie Eulenpfad (80 %) |
| D12 | `konten.js:243–258` | Einladung prüft Land/Kanton nicht, verwirft `JJJJ-MM` | gegen `LP.LAENDER`/`KANTONE` prüfen; B3 — erledigt 2026-11-05 (Land, Kanton, Klasse geprüft; Geburtsdatum mit oder ohne Tag) |
| D14 | Eulenpfad `LS.zusammenfuehren` | Runden aus einer Datei werden nicht geprüft; eine Runde ohne `fehlerAufgaben` bricht die Statistik (`auswertung.js` `anhieb`) | Schema wie im Lernsteig (`rundeGueltig`), in den Kern-Teil Sichern und Einlesen — erledigt 2026-11-05 (Kern 1.6.0 `KERN.runden`, `auswertung.js` verträgt fehlende `fehlerAufgaben`) |
| D13 | `sachsituationen/aufgaben.js:66, 79` | ASCII-Minus | über `LST.zahlText` |

## E. Fachliche Korrekturen

1. **MA.1.A.3 am Wortlaut** (Hinweis Patrik; neu gefasst LERN_Session23 nach E1-1 a bis E1-3 a): Massstab ist der
   Wortlaut der Stufen, geprüft in der Abdeckungstabelle (`docs/lernsteig/abdeckung.md`). Der Schnitt nach
   Lehrplan-Stufen bleibt; die Zahlarten sind innerhalb der Stufen verteilt (g: Dezimalzahlen in
   `rationale-zahlen`, Brüche in `brueche`). Ganzzahl-Produkte gehören zum Wortlaut (Beispiel 308 · 52) und bleiben.
   `rationale-zahlen` heisst „Dezimalzahlen und rationale Zahlen“. Die Erweiterungen von h und i werden in ihrer Stufe
   geübt, für alle Niveaus (E1-5 a). Umbau in dieser Reihenfolge: (1) Nenner ausserhalb der Liste aus `brueche` entfernen (12, 25);
   (2) Nenner 20, 50, 100 bei plus, minus, mal; (3) Umschreiben in alle sechs Richtungen (MA.1.A.1.h); (4)
   Dezimalzahlen addieren und subtrahieren (`brueche` f); (5) Ergebnisse überprüfen (`rationale-zahlen` g); (6)
   Aufgaben mit dem Rechner (`brueche` f); (7) Erweiterungen: Primfaktoren (`rationale-zahlen` h), Brüche mit
   Variablen (`brueche` i); (8) Rechteckmodell als Bild (`brueche` f, g). Zurückgestellt bleibt: Nenner 3 und 6
   (periodische Dezimalzahlen, RZ1 a). Gleicher Massstab für alle Übungen: die Abdeckungstabelle.
   *Stand 2026-11-08 (LERN_Session23):* MA.1.A.3 erledigt bis auf Zurückgestelltes: Schritte (1) bis (8) umgesetzt; offen
   nur die Nenner 3 und 6 (periodische Dezimalzahlen, RZ1 a) und Variablen im Nenner (der Term-Leser teilt nur durch
   Zahlen). Abdeckungstabelle für alle 27 Übungen, alle 80 Stufen am Wortlaut (`docs/lernsteig/abdeckung.md`): 215
   Inhaltsteile — 67 abgedeckt, 62 teilweise, 77 offen, 9 in einer anderen Übung; die übrigen Übungen sind der Massstab
   für E 2 bis E 10.
2. **Brutto/Netto** (`daten-rabatt`): Bruttopreis − Rabatt = Nettopreis als Hauptfall; Lesart mit Lehrmittel (mathbuch)
   abgleichen.
   *Stand 2026-11-08 (LERN_Session23, Code nachgelesen):* offen. Stufe l zieht `rabatt`, `rabatt-betrag`, `brutto`, `netto` gleich oft; Brutto und Netto hängen am Zuschlag („Brutto ist Netto plus Zuschlag“), das Ergebnis nach Rabatt heisst „Neuer Preis“; kein Abgleich mit dem mathbuch dokumentiert.
3. **Überschlagen** (`ueberschlagen-ordnen`): Ablenker aus falschem Runden (eine Stelle falsch gerundet, Ergebnis
   ±10–30 %), nicht nur Zehnerpotenzen daneben.
   *Stand 2026-11-08 (LERN_Session23, Code nachgelesen):* offen. Ablenker nur um Zehnerpotenzen (Faktoren 10, 0.1, 100 oder 0.01; bei `prozent` andere Sätze). Die Prüfung der Übung verlangt Abstand ab Faktor 1.8 und würde Ablenker ±10–30 % abweisen — sie muss mitgeändert werden.
4. **Terme:** „Schreibe als Potenz“ nur mit derselben Basis; `a/2`, `×`, `⋅`, Grossbuchstaben annehmen; gemischte
   Zahl `1 3/4` erkennen oder ausdrücklich abweisen; „vereinfacht“ verlangt zusammengefasste Faktoren.
   *Stand 2026-11-08 (LERN_Session23, Code nachgelesen):* teilweise, nachgerechnet mit `KERN.terme.bewerte`. Die Aufgaben haben dieselbe Basis, die Form „potenz“ nimmt aber „2^6“ für 4³ und „8^1“ für 2³ an; „a/2“, „2×a“, „2⋅a“, „2A“ sind unlesbar; „1 3/4“ wird abgewiesen, mit der unpassenden Meldung zu Dreiergruppen; „vereinfacht“ nimmt „2a·3“ und „a·a“ an.
5. **Terme, Reihenfolge j/k:** Stufen bleiben nach Lehrplan (j Erweiterung, k GA); in der Stufenwahl sichtbar machen,
   dass k ohne j erreichbar ist.
   *Stand 2026-11-08 (LERN_Session23, Code nachgelesen):* teilweise. Stufen i, j, k nach Lehrplan, die Stufenwahl zeigt „Grundanspruch“ und „mit Erweiterung“; kein Hinweis, dass k ohne j erreichbar ist, und der „Übergang j → k“ (`lernsteig/gemeinsam/werkzeug.js`) legt eine Reihenfolge nahe.
6. **Atombau:** B³⁺ und Be²⁺ aus der Challenge; B und Si als Halbmetall oder aus der Frage „Metall/Nichtmetall“
   nehmen; Hinweis zur Lage der Nichtmetalle mit Ausnahme H.
   *Stand 2026-11-08 (LERN_Session23, Code nachgelesen):* offen. Be²⁺ und B³⁺ in allen drei Typen der Challenge (ausgenommen sind nur H, He, Edelgase und Gruppe IV); B und Si als `nichtmetall` in `pse.js`; der Hinweis nennt H nicht als Ausnahme.
7. **Kräfte:** Stufe a nach Seitentext (Diagramme erkennen und darstellen) statt nur v = s : t; Beispiele in
   `maschinen.js` eindeutig (Kran, Handbohrer); realistische Grössen (Kraftmesser, Spannungen in `stromkreis`).
   *Stand 2026-11-08 (LERN_Session23, Code nachgelesen):* offen bis auf zwei Teile. Stufe a fragt nur Geschwindigkeit und Weg aus einer Ursprungsgeraden ab, nichts zu „gleichförmige Bewegungen in Diagrammen erkennen und darstellen“ (`nt_zyklus3.md`). Kran eindeutig (Flaschenzug am Haken), einen Handbohrer gibt es nicht (Wellrad, nach KR1 a ausgeschlossen). Kraftmesser bis 1500 N und Massen bis 100 kg in Stufe c; `stromkreis` c bis 400 V, d und Challenge 3–24 V (realistisch).
8. **Französisch:** „C'est le vélo de moi“, „les clés d'elle“ idiomatisch ersetzen (erledigt in LERN_Session22: „Ce vélo
   est à moi“, „Ces clés sont à elle“); Englisch „___ the table“ eindeutig (Englisch erledigt in LERN_Session22: ohne „at“).
9. **Vielfalt:** `kombinatorik` f (23) mit drei Münzen, Glücksrad, Urne, Karten; `folgen` j (53) mit weiteren Figuren (erledigt in LERN_Session22: acht beschriebene Figuren, 61);
   `zehnerpotenzen` Zahlwort „einhundertein Millionen“ prüfen (Duden; erledigt in LERN_Session22, ZW1 a:
   „einhunderteine Million“). Seit VF1 a (LERN_Session20) meldet das
   Testskript jede Stufe ohne Endlos, deren Aufgaben sich vor der sechsten Runde wiederholen — heute 21, je Übung
   vergrössern oder im Katalog begründen (`vorrat`): rechtschreibung d, e, f, g;
   englisch-grammatik b, c, d, challenge; franzoesisch-grammatik b, c, d, challenge (die Sprachübungen begrenzt durch
   ihre Inhaltslisten). Erledigt in LERN_Session21: stromkreis b (8 feste Fragen → 37 erzeugte), kombinatorik f (23 → 236, mit drei Münzen,
   Glücksrad, Urne; f jetzt auch als Serie) und challenge (26 → 50), atombau a (20 → über 1000 mit der Umkehrfrage
   „Welches der drei ist …?“, a jetzt auch als Serie) und challenge (28 → 42, Edelgas mit gleicher Elektronenzahl);
   kraefte d (KR1 a: Liste der einfachen Maschinen 11 → 36, je Maschine neun, ohne Wellrad und Keil, ungeprüft);
   grammatik e, f, g (SP1 a: 20/25/20 → 50/48/48 Sätze, Challenge auch als Serie). Erledigt in LERN_Session22:
   rechtschreibung d, e, f, g (SP1 a: 20/14/13/11 → 51/49/48/48 Sätze, Challenge mit 196 auch als Serie);
   englisch-grammatik b, c, d (SP1 a: 11/14/16 → 49/49/54, Challenge mit 152 auch als Serie);
   franzoesisch-grammatik b, c, d (SP1 a: 13/13/16 → 51/48/52, Challenge mit 151 auch als Serie). Heute 0 Hinweise:
   E 9 ist damit für alle 21 Stufen erledigt. Karten nicht (Jass oder französisch?).
10. **Hinweise:** Wurzelaufgaben bekommen einen Wurzel-Hinweis; `folgen` nennt die Formel nicht in der Aufgabe.
   *Stand 2026-11-08 (LERN_Session23, Code nachgelesen):* teilweise. Wurzel-Hinweis in `koerper-winkel`; in `flaechen-volumen` und `koordinaten` (Pythagoras) lückenhaft; `rationale-zahlen` i (√x, ³√x) hat nur den Potenz-Hinweis. `folgen` i nennt die Formel im Aufgabentext (Rechteckzahlen „n · (n + 1)“), die übrigen Stufen nur im Lösungsweg.
11. Danach: Patrik prüft die sieben Listen und die Annahmen je Übung im Entwickler-Modus (FG1 a).

## F. Recherchen ordnen

1. **Ordnung:** `docs/lernsteig/lehrplan/` bekommt eine `README.md` mit allen Recherchen (Datei, Inhalt, Quellen,
   Stand, Reichweite, offene Punkte) und eine **eine** Liste offener Recherchen (heute verstreut über
   `lehrplan_sg_sek1.md` §6, `rechnermodelle_sg.md` §6, `R6_auftrag_nt.md`, Handover). Erledigte Aufträge (R6 Teil NT,
   R11) als erledigt markieren und mit dem Ergebnis verlinken.
2. **Widersprüche und Zweifel klären** (mit Quelle, nicht durch Glätten):
   - Lehrmittellisten: `rechnermodelle_sg.md` Z. 90 nennt Listen 2025/26 und 2026/27 ohne Quelle,
     `sg_oberstufe_praxis.md` Z. 24 und `lehrplan_sg_sek1.md` Z. 22 sagen, es gebe keine neuere als 2023/24. Auf sg.ch
     nachsehen; gibt es sie, Tabelle LM auf den neuen Stand, sonst die Zeile in `rechnermodelle_sg.md` belegen oder
     streichen. Dazu „Schuljahr 2023/24, erstellt am 25.01.2022“ prüfen.
   - WAH-Fussnote ⁷ gegen Kleinklasse 4/4/4: Sek (0+4+2) und Real (0+2+4) ergeben je 6; die Fussnote gilt also
     vermutlich nur für Sek und Real. Am Original (LP-RB, Lektionentafeln) bestätigen und so vermerken.
   - Lesart des OP („bis dahin bearbeitet“) in `nt_zyklus3.md` und `mathematik_zyklus3.md` als Lesart markieren;
     im Browser an zwei, drei Seiten gegenprüfen (Darstellung der `hr op`).
   - Quellen ohne Adresse (LM, BPU, PA „PDF auf sg.ch“): Adresse und Abrufdatum nachtragen.
3. **Veraltete Stellen:** `lehrplan_sg_sek1.md` (R6 „dringend offen“; „nicht gelesen: Aufnahmeprüfung,
   Lehrmittelliste“; „übrige Fächer nicht ausgelesen“), Handover „R1–R7“, `commons_bibliothek.md` („Einladung noch nicht
   gebaut“), GW1 mit `n3`.
4. **Kleinklasse:** Frage F1.
5. Offene Recherchen danach in der Reihenfolge, die die Übungen brauchen: R8 (Schreibweisen im mathbuch, betrifft
   Z1 a), R6-Rest (NT-Lehrmittel), R5, R9, R12–R19.

## G. Doku-Drift

Nach dem Grundsatz oben: zuerst entscheiden, was richtig ist.
- `docs/lernsteig/rahmen.md`: Kopf („offen: Anmeldung“ — gebaut), Abschnitt 1 (`konten.js`, `daten.js` fehlen; „vier
  gemeinsame Dateien“ — sieben), Abschnitt 5 Rekord „je Niveau“ gegen Code „je Stufe“ (richtig ist je Stufe: die
  Aufgaben einer Stufe hängen heute nicht vom Niveau ab, das Niveau wählt nur das Ziel; also Doku angleichen — bekommt
  ein Niveau eigene Aufgaben, dann Rekord je Stufe und Niveau),
  Abschnitt 5a, Abschnitt 6 Speicherfelder (`rechnerModell`, `wochenziel`, `mitRechner`, `liste[].rechner`).
- `STAND_und_PLAN.md`: „23 Übungen“ → 27, „fünf Listen“ → sieben.
- Session-Report LST_Session1 deckt nur den 4.11. ab: Nachtrag 5.11. (Konten, Aufsicht, Statistik, NT, KB1/KB2, FG1).
- ~~`bruch.js:39` Kommentar, `werkzeug.js:47` doppelter Kommentar~~ — erledigt 2026-11-05 mit Kern 1.0.0.
- Nach C werden `rahmen.md` beider Apps auf den Kern verwiesen statt doppelt beschrieben.

## H. Portal

- Je App eine Spalte mit Karte und Anleitungen (P1 a): Lernsteig mit Anleitung für Jugendliche, für Erwachsene und
  „Alle Übungen“ (Tabelle wie `eulenpfad-spiele.html`, Verfügbarkeit nach Prüfstand, gesperrte als „in Prüfung“).
- Gratwanderung mit denselben Platzhaltern („noch keine Übungen“).
- Die Tabelle je App aus einem gemeinsamen Baustein (Kern oder `portal/`), nicht dreimal.

## Fragen

Entschieden 2026-11-05 (Patrik, LERN_Session15), alle nach Empfehlung:
- **A1 a:** Rücknahme und Sperre aller Lernsteig-Übungen im selben Commit; voller Prüfstand mit C.
- **A2 a:** Cloud-Repo `Lernsteig` mit `8f55173` abgeschlossen; der Lernsteig lebt nur noch in Lernspiele, spätere
  Cloud-Sitzungen auf einem Branch von Lernspiele.
- **C1 a:** Prüfungsvorbereitung als Gruppe „🎯 Prüfungsvorbereitung“ oben im Tab Übungen (bei gewähltem Prüfungsziel:
  geprüfte Stufen, Mischrunde, Stand je Kompetenz); Tab-Reihe wie im Eulenpfad. **Zusatz Patrik:** auch filterbar —
  Chip „🎯 Prüfungsziel“ in der Filterzeile „Nur“ neben „⭐ Mein Fokus“, zeigt nur Übungen mit geprüften Stufen des
  Ziels und auf den Karten nur diese Stufen.
- **Ü1 a** (2026-11-06): Bei der Übernahme einer Aufsicht reisen Kennung, Name, Rolle, Art, PIN-Prüfwert, Sicherheitsfrage
  und Antwort-Prüfwert mit; der Wiederherstellungscode ist je App ein eigener und wird neu ausgegeben.
- **Ü2 b** (2026-11-06): Keine Bestätigung durch eine Aufsicht der Ziel-App (in der Quell-App schon geprüft).
- **TA1 a** (2026-11-06): C2 (Tabs des Lernsteigs) vor dem Rest von Plan B, damit das Testgerüst B2 die bleibenden
  Seiten prüft.
- **PA1 a** (2026-11-06, LERN_Session17): Person und Abmelden in beiden Apps gleich — ein Personen-Knopf mit Bild und
  Name, das Menü nennt die anderen Personen des Geräts und getrennt darunter „↩ Abmelden“ (beim Gast „Anmelden“); Kern-Teil
  `KERN.personenMenue` (docs/kern/rahmen.md 4.16). Nicht b (Auswahlliste in beiden: Pfeiltasten melden ab) und nicht c
  (nur Knopf „Abmelden“: Wechseln kostet einen Seitenwechsel).
- **ZA1 a** (2026-11-06, LERN_Session17, Bemerkungen 26, 27): Ereignisse an der Grenze Mittelalter/Neuzeit (um 1450,
  1492) bekommen kein Zeitalter, sondern „Übergang … — wird nicht gefragt“; mit fester Grenze aus dem Lehrmittel
  neu zu entscheiden.
- **MF1 a** (2026-11-06, LERN_Session17, Bemerkung 28): Menschen der Urzeit als eigene Zeichnungen an den
  Kennzeichen (Bildersammlung), nicht als heutige Menschen.
- **BZ1 a** (2026-11-06, LERN_Session17): Jeder Eintrag zeigt ein Bild aus seiner Zeit — ein Ding das seiner Hauptkultur,
  „Gab es das schon?“ und Funde je Kultur ihr eigenes; gezeichnet, wo ein Emoji die heutige Form zeigt. Nicht b (mehrere
  Bilder an einem Ding: ein Ding erscheint nie im Zusammenhang einer zweiten Kultur).
- **WZ2 a** (2026-11-06, LERN_Session17, Eulenpfad): Nach einer richtigen Antwort nur das kurze Lob; die Erklärung
  (`ctx.richtig(lob, erklaerung)`, `opt.erklaerung`) nur nach einem Fehlversuch bei dieser Aufgabe (auch nach einem
  Verklicken, überspringbar) und in der Lösung; Lesezeit 1,3 s + 30 ms je Zeichen über 20, höchstens 3 s.
- **AN2 a** (2026-11-06, LERN_Session17): Zuerst B2 Schritt 2 (Seiten des Lernsteigs im Ersatz-DOM), dann die offenen
  Kern-Teile (Dateiformat mit Abgleich, Rest der Rollen, Ablauf der Runde), dann B2 Schritt 3, dann C3–C8.
- **TO1 a** (2026-11-06, LERN_Session17): Glieder in Lösungen wie im Lehrmittel ordnen — bei gleichem Grad je Variable im
  Alphabet der höhere Exponent zuerst, (a + b)² = a² + 2ab + b² (`KERN.terme.text`, docs/kern/rahmen.md 4.17). Mit dem
  mathbuch abzugleichen, falls es bei mehreren Variablen anders ordnet.
- **AW1 a** (2026-11-06): Kern-Teil Auswertung mit den Rechnungen ohne App-Bezug (Mittel, Median, Korrelation,
  Sitzungen, Lernzeiten, Wochen, Bedarf, Ziehen); Fazit, Vorschläge und Kompetenztexte bleiben in den Apps.
- **AW2 a** (2026-11-06): eine Regel für den Stand aus den letzten n Aufgaben, Schwellen je App (Eulenpfad 24 / 70 %,
  Lernsteig 10 / 10 / 85 % ohne gezeigte Lösung).
- **EF1 a** (2026-11-06): Im Lernsteig keine Frage für Erwachsene — die Frage des Eulenpfads (Wurzeln, Potenzen,
  negative Zahlen, Gleichungen, Pythagoras) ist Stoff der Oberstufe, und keine Wissensfrage trennt Jugendliche sicher von
  Erwachsenen. Schutz: erste Aufsicht ohne Frage, jede weitere mit Bestätigung (D5), Mitlesen nur mit Zustimmung
  (AU1 a); jeder Jugendliche sieht in seinem Konto alle Aufsichten des Geräts.
- **C2 a:** Gast in allen drei Apps als Teil des Kerns (nichts gespeichert, Profil ohne Wirkung, nur Freigegebenes, je
  Gerät abschaltbar); im Eulenpfad „👀 Nur schauen“.
- **P1 a:** Jede Person hat in allen Apps eine feste Kennung `id` (beim Anlegen, reist bei einer Übernahme mit); der
  Name ist je App und Gerät eindeutig und nur Anzeige. Der Eulenpfad zieht einmal um (Profil, Protokoll, Rekorde,
  Löschvermerke bekommen `person`; ältere Sicherungen werden beim Einlesen umgedeutet). Abgleich: gleiche Kennung →
  zusammenführen; gleicher Name, andere Kennung → zusammenführen wie heute, die ältere Kennung bleibt, die andere wird
  als frühere Kennung vermerkt.
- **P2 a:** Eine Liste von Personen je App, `rolle: "lernend" | "aufsicht"`, bei der Aufsicht die Art (`eltern`,
  `lehrperson`) und das Merkmal Gruppenleitung (G2 a); Entwickler bleibt Freischaltung des Geräts, keine Rolle.
  Anmeldung, PIN, Code, Sicherheitsfrage, Zurücksetzen für alle Rollen gleich; PIN-Pflicht und Sicht der Aufsicht
  stellt jede App ein. Der Lernsteig führt `aufsichten` in die Liste über.
- **R1 a:** Ein gemeinsames Format für Runden und Rekorde in allen Apps: Kernfelder `id`, `person`, `zeit`, `inhalt`
  (Spiel oder Übung), `stufe`, `aufgaben`, `fehler`, `dauer`, `test`, bei Rekorden `punkte`, vom Kern geprüft;
  App-Felder unter eigenem Namen daneben, ihr Schema meldet die App. Beide Apps ziehen ihre Daten einmal um
  (`spiel`/`uebung` → `inhalt`, `konto` → `person`), der Eulenpfad bekommt Kennungen je Runde. Sicherungen und
  Abgleich tragen `format` mit Version; ältere werden beim Einlesen umgedeutet. In der Oberfläche bleiben die Wörter
  Spiel und Übung.
- **F1 a:** Kleinklasse als drittes Schulniveau SG (Niveau `n1`, Ziel „so weit wie möglich“, Fremdsprachen
  ausgeblendet und einschaltbar, keine Prüfungsziele, keine eigenen Übungen); Praxis in F2 an der Quelle prüfen.
- **DF1 a** (2026-11-06, LERN_Session18): Ein Dateiformat für Sichern und Abgleich in allen Apps, `{ format: "reihe-daten",
  version: 1, app, art: "sicherung" | "abgleich", gesichert, geraet?, personen, runden, rekorde, geloescht, freigabe?,
  freigabeStand?, … Teile der App unter eigenem Namen }`, im Kern-Teil `daten.js`. Ältere Dateien (`eulenpfad-daten` 1–3,
  `lernsteig-sicherung` 1–2) deutet der Kern beim Einlesen um; eine Datei einer anderen App wird mit ihrem Namen
  abgewiesen. Kipppunkt: Geräte, die länger mit einer alten Offline-Kopie laufen.
- **DF2 a** (2026-11-06, LERN_Session18): Löschvermerke (Person nach Kennung; Runden je Person, Inhalt oder alle, bis zu
  einem Zeitpunkt) und die Freigabe nach dem jüngsten Stand führt der Kern für alle Apps; Vermerke nach Namen von
  älteren Geräten des Eulenpfads werden beim Einlesen umgedeutet.
- **DF3 a** (2026-11-06, LERN_Session18): Abgleich über einen Ordner als Kern-Teil `abgleich.js` über `daten.js`;
  Dateipräfix, Name der IndexedDB und Ereignis gibt die App mit (Eulenpfad `lernspiele-sync-`, `lernspiele`; Lernsteig
  `lernsteig-sync-`, `lernsteig` nach SP1 a). Browser-Schnittstellen erst beim Aufruf, in Node mit Ersatz-Ordner geprüft.
- **DF4 a** (2026-11-06, LERN_Session18): Eine Person mit PIN reist in Sicherung und Abgleich ohne PIN-Prüfwert, aber
  mit dem Prüfwert ihres Wiederherstellungscodes und dem Vermerk `geschuetzt`. Auf einem Gerät ohne eigene PIN dieser
  Person ist sie gesperrt; freigeschaltet mit dem Wiederherstellungscode und einer neuen PIN, eine Aufsicht im
  Eulenpfad auch mit der Bestätigung einer bestehenden Aufsicht des Geräts. Gilt in allen Apps für alle Rollen;
  Aufsichten reisen auch im Lernsteig mit. Grund: Alle 1 110 000 PINs mit 4–6 Ziffern sind gegen SHA-256 mit Salz in
  1,2 s durchprobiert (Node, ein Kern), der Code (32¹², rund 1,2 · 10¹⁸) im selben Tempo erst in rund 40 000 Jahren;
  heute kommt eine Person mit PIN ungeschützt an (Eulenpfad: PIN der Aufsicht ohne Frage festlegbar; Lernsteig: Konto
  eines Jugendlichen offen). Nicht b (PIN-Prüfwert reist mit). Kipppunkt: die Grenze aus DS1 a auch für den Abgleich
  als genug ansehen, dann b mit PBKDF2.
- **AS1 a** (2026-11-06, LERN_Session18, Lernsteig): Aufsichten in einer Datei liest nur eine angemeldete Aufsicht ein;
  liest ein Jugendlicher ein, werden sie abgewiesen und gezählt (`KERN.daten` `einlesen(…, { rollen })`). Sonst brächte
  eine selbst gebaute Datei mit bekanntem Code eine Aufsicht ohne Bestätigung aufs Gerät (D5). Nicht b (Aufsichten
  reisen immer mit). Kipppunkt: der Abgleich über einen Ordner (DF3 a) läuft auch, wenn ein Jugendlicher angemeldet ist —
  dort gilt, was über den von der Aufsicht eingerichteten Ordner kommt, als von ihr gebracht (Zusatz bei DF3 vorlegen).
- **LB1 a** (2026-11-06, LERN_Session18, Eulenpfad; Vorgabe Patrik: „generell bei allen spielen reicht bei der richtigen
  antwort das lob, es braucht da keine erklärungen“): Auf Anhieb richtig zeigt der Rahmen nur ein Lob aus seiner Liste
  (`LOB`); was das Spiel mitgibt (`ctx.richtig(text, erklaerung)`, `opt.lob`, `opt.erklaerung`), kommt nur nach einem
  Fehlversuch. Grund: 137 von 169 Spielen gaben im Lob Rechnungen oder Begründungen mit, WZ2 a griff nur bei getrennter
  Erklärung. Nicht b (jedes Spiel von Hand trennen). Prüfer „Lob“ im Testskript. Ausnahmen nur mit Vermerk (LB2).
- **LB2 a** (2026-11-06, LERN_Session18): Ein Spiel kann eine eigene Lobliste angeben (`def.lob`, jedes Lob höchstens 20
  Zeichen); auf Anhieb zieht der Rahmen daraus. Für das Lob in der Fremdsprache der 8 Sprachspiele. Bestätigungen mit dem
  Lösungswort („Great! apple“) bleiben Text nach einem Fehlversuch. Nicht b (auch dort auf Deutsch loben).
- **RL1 a** (2026-11-06, LERN_Session18): Die Gruppenleitung („Ich bin Lehrperson“, G2 a) kommt mit dem Bau der Gruppen
  (LERN-48) in den Kern, zusammen mit dem Untertab Klassen; ohne ihn hätte das Merkmal keine Wirkung. Nicht b (Merkmal
  jetzt, ohne Wirkung). Kipppunkt: Lehrpersonen sollen das Merkmal schon vor den Gruppen setzen.
- **RL2 a** (2026-11-06, LERN_Session18): PIN vergessen für Aufsichten in allen Apps mit denselben Stufen über den Kern
  (`rollen.js`): andere Aufsicht, Code, Sicherheitsfrage (im Lernsteig beim Anlegen Pflicht), Zurücksetzen mit Frist von 3
  Tagen (für alle sichtbar, mit PIN oder Code abzubrechen). Nach Ablauf im Eulenpfad Konten ohne PIN wie bisher, im
  Lernsteig Aufsichten auf dem Gerät entfernt samt Verbindungen, ohne Löschvermerk. Nicht b (Frist nur im Eulenpfad).
  Kipppunkt: Lernsteig-Geräte, die oft tagelang ohne Aufsicht laufen (dann längere Frist).
- **AR1 a** (2026-11-06, LERN_Session18): Kern-Teil `runde.js` als Ablauf ohne Oberfläche — die App meldet je Aufgabe
  gestellt, falsch, richtig, Lösung gezeigt, übersprungen, Zeit um; der Kern zählt Versuche und Fehler, entscheidet Lösung
  nach dem dritten Fehlversuch, Ende von Runde und Serie, Zwischen- und Endstand des Rekords, führt die
  Wiederholungsbremse (Gedächtnis mit Fenster, Serienbremse, Kürzen bei erschöpfter Stufe) und baut den Protokolleintrag
  im gemeinsamen Format. Oberfläche, Prüfen der Antwort, Bewertung, Timer und Wartezeiten bleiben in der App. Erster
  Schritt die reinen Hilfen (Fingerabdruck, Kennung, Gedächtnis, Rekord nach Kennung, Wächter des Zwischenstands,
  Bestwert). Die Unterschiede ohne Entscheid (`zeit` Start oder Ende, `dauer` in s oder 0,1 s, Serie im Protokoll,
  Fehlerliste je Aufgabe, Gedächtnis, Kürzen, Zeitmessung, Rückmeldung bei Richtig im Lernsteig) werden vor dem Bau je
  einzeln vorgelegt. Nicht b (nur die Hilfen). Kipppunkt: Apps sollen im Ablauf absichtlich auseinanderlaufen.
- **RA1 a** (2026-11-06, LERN_Session19): `zeit` einer Runde ist ihr Ende (beim Rekord der Stand beim Speichern), der
  Beginn `zeit − dauer`; der Lernsteig deutet seine Runden (bisher Beginn) beim Laden um. Nicht b (Beginn; die Runden des
  Eulenpfads mit Ende-Zeit sind online, ein Gerät mit altem Stand schriebe in der Übergangszeit ohne Vermerk weiter Enden).
  Kipppunkt: echte Lernsteig-Runden oder ein Formatvermerk.
- **RA2 a** (2026-11-06, LERN_Session19): `dauer` in Sekunden mit einer Nachkommastelle (0,1 s; Bestzeit im Lernsteig);
  ganze Sekunden älterer Runden bleiben gültig. Nicht b (ganze s), nicht c (ms in einem neuen Feld).
- **RA3 a** (2026-11-06, LERN_Session19): Eine Serie ist eine Runde — Protokolleintrag mit `endlos: true` und `sterne:
  null` und dazu ein Rekord; beim Verlassen beide als Zwischenstand (`abgebrochen: true`), ein späterer Stand derselben
  Kennung ersetzt ihn, auch beim Zusammenführen. Nicht b (nur Rekord; im Eulenpfad fehlten Serien in Lernzeiten und Stand).
- **RA4 a** (2026-11-06, LERN_Session19): Eine Liste je Aufgabe im Kern (`liste`: `{ ms, versuche, geloest, gezeigt?,
  uebersprungen?, zeitUm? }`, mit Fehlversuch dazu `text`, `loesung`, `eingaben`; Felder der App je Aufgabe nach Schema)
  statt `aufgabenZeiten`/`fehlerAufgaben` (Eulenpfad) und `zeiten`/`liste`/`falsch` (Lernsteig); ältere Einträge beim
  Laden umgedeutet, die Zuordnung mit einer Zufallsnachrechnung belegt. Nicht b (Eulenpfad-Listen), nicht c (je App).
  Kipppunkt: Zuordnung nicht eindeutig — dann alte Einträge mit alten Feldern lesen.
- **RA5 a** (2026-11-06, LERN_Session19): Gedächtnis über Runden als Durchgang (eine Aufgabe erst wieder, wenn alle dran
  waren; bis 400 Fingerabdrücke) in allen Apps, für Runden und Serien, je Person, Inhalt und Stufe ohne Niveau; in einer
  Runde oder Serie keine Aufgabe zweimal, solange die Stufe neue hergibt. Nicht b (Fenster der letzten 30; bei Stufen
  unter 31 Aufgaben nie erfüllbar). Kipppunkt: Serien sollen absichtlich auch Geübtes bringen.
- **RA6 a** (2026-11-06, LERN_Session19): Höchstens eine Wiederholung je Runde, nie direkt hintereinander; danach endet
  die Runde früher mit `gekuerzt` (geplante Zahl); gekürzte Runden zählen nicht für die Bestzeit. Nicht b (Runde immer
  voll mit Wiederholungen).
- **RA7 a** (2026-11-06, LERN_Session19): Zeit je Aufgabe ab der Meldung `bereit` der App (ohne Meldung ab `gestellt`)
  bis zur Antwort, ohne die Zeit zwischen `pause` und `weiter`. Nicht b (ab `gestellt`; zählte im Eulenpfad Töne und
  3-2-1 mit).
- **RA8 a** (2026-11-06, LERN_Session19): Lernsteig wie LB1 a — auf Anhieb nur „Richtig.“, weiter nach 1,2 s (Serie
  0,7 s); richtig nach einem Fehlversuch „Jetzt stimmt es.“ mit dem Weg und „Weiter“ ohne Selbstlauf. Nicht b (Knopf
  „Weg ansehen“), nicht c (heute: Weg 1,2 s sichtbar, nicht lesbar). Kipppunkt: Jugendliche sollen ihren Weg auch nach
  einer richtigen Antwort prüfen.
- **OA1 a** (2026-11-07, LERN_Session19): Aufsichten reisen im Abgleich (Ordner und Datei) immer mit und kommen gesperrt
  an; eine gesperrte Aufsicht schaltet ihr Wiederherstellungscode nur frei, wenn das Gerät noch keine Aufsicht mit PIN
  hat, sonst braucht es die Bestätigung einer Aufsicht des Geräts mit deren PIN (wie beim Anlegen, D5, KR2 a). Regel im
  Kern (`KERN.person.freischalten`), für alle Apps. Befund dazu: Im Eulenpfad brachte bis dahin jede selbst gebaute Datei
  mit bekanntem Code eine Aufsicht ohne Bestätigung aufs Gerät (Datei und Ordner). Nicht b (Ordner gilt als von der
  Aufsicht gebracht, Code reicht), nicht c (AS1 a auch im Ordner). Kipppunkt: Aufsichten müssen oft auf Geräte, deren
  andere Aufsicht nicht greifbar ist.
- **OA2 a** (2026-11-07, LERN_Session19): AS1 a ist aufgehoben — Aufsichten reisen in Datei und Ordner gleich mit,
  geschützt wird beim Freischalten (OA1 a). Der Filter `rollen` von `KERN.daten.einlesen` bleibt im Kern, der Lernsteig
  benutzt ihn nicht mehr. Nicht b (AS1 a bleibt für Dateien). Kipppunkt: gesperrte fremde Aufsichten auf der Anmeldung
  sind selbst ein Schaden — dann b und ein Entfernen gesperrter Aufsichten in der Verwaltung.
- **RZ1 a** (2026-11-07, LERN_Session19, Lernsteig, Meldung Patrik „Stufe g ohne Rechner zum Teil noch etwas heftig“):
  „Bruch als Dezimalzahl“ in rationale-zahlen g nur mit den Nennern des Lehrplans (Wortlaut MA.1.A.3.g: 2, 3, 4, 5, 6, 8,
  10, 20, 50, 100, 1'000), ohne 3 und 6, bis die Übung periodische Dezimalzahlen annehmen kann (offener Punkt, zurückgestellt:
  die Eingabe fehlt). Vorher alle Teiler von 1000 und 16 — 43 % der Bruch-Aufgaben mit Nennern ausserhalb der Liste, aus
  einer geglätteten Fassung des Lehrplans („Nenner bis 1000“). Nicht b (3, 6 gerundet), nicht c (wie bisher). Kipppunkt:
  das Lehrmittel übt in g Nenner wie 25, 125, 250.
- **RZ2 a** (2026-11-07, LERN_Session19, Lernsteig): „bis 5 Wertziffern“ heisst in rationale-zahlen g: beide Faktoren
  zusammen höchstens 5, wie 308 · 52 und 12 · 0,3. Gemessen über 40 000 Aufgaben: keine Aufgabe mehr mit mehr
  Einmaleins-Schritten als 308 · 52 (vorher 11 %), Dezimal-Multiplikationen mit drei Nachkommastellen 5 % (vorher 19 %).
  Nicht b (Ergebnis höchstens 5), nicht c (je Faktor, bisher). Kipppunkt: das Lehrmittel übt in g Aufgaben wie
  23,56 · 4,4 ohne Rechner.
- **RZ3 a** (2026-11-07, LERN_Session19, Lernsteig, Meldung Patrik zu 847 · 81): Die Multiplikationen in rationale-zahlen g
  haben zusammen gleich oft 3, 4 oder 5 Wertziffern (Aufteilung 2 + 1 / 1 + 2, 3 + 1 / 2 + 2, 3 + 2 / 4 + 1), die ganze
  Spanne bis zur Grenze. Vorher ganzzahlig immer dreistellig · zweistellig, in 73 % mit 6 Einmaleins-Schritten; jetzt rund
  12 %. Nicht b (nur 4 und 5), nicht c (wie bisher). Kipppunkt: Stufe g soll in der Oberstufe vor allem die Grenze
  festigen. Dazu Wunsch Patrik: ein Notizblock für eigene Rechenwege im Lernsteig („im Kopf oder mit Notieren eigener
  Rechenwege“, MA.1.A.3.g), aus dem Eulenpfad.
- **NB1 a** (2026-11-07, LERN_Session19): Der Notizblock wird Kern-Teil `kern/notizblock.js` (`KERN.notizblock`):
  Vorlagen, Rechenwege, Ziffernfeld, Öffnen und Schliessen; Dezimalzeichen, Ton und Namen der Stellen gibt die App mit,
  das Aussehen steht im CSS jeder App (wie Rollleiste, Personen-Knopf). Der Eulenpfad behält `SCHRIFTLICH` als Hülle,
  sein Aussehen bleibt. Nicht b (Kopie im Lernsteig). Kipppunkt: der Block soll im Lernsteig grundsätzlich anders arbeiten
  (Terme, Variablen).
- **NB2 a** (2026-11-07, LERN_Session19): Im Lernsteig ein Knopf „📝 Notizblock“ in jeder Aufgabe mit Zahl-Antwort, mit
  und ohne Rechner; eine Übung kann ihn im Katalog abschalten (`notizblock: false`, heute keine); im Eintrag je Aufgabe
  `vorgehen.notiz`, nichts bewertet. Nicht b (nur ohne Rechner, 43 Stufen), nicht c (nur rationale-zahlen g). Kipppunkt:
  eine Übung soll ausdrücklich Kopfrechnen prüfen (etwa Überschlagen) — dann dort `notizblock: false`.
- **NB3 a** (2026-11-07, LERN_Session19): Mal im Notizblock nimmt Komma in beiden Zahlen — gerechnet wird ohne Komma,
  darunter steht die Kommaregel als Zeile („2 + 1 = 3 Stellen nach dem Komma“); Geteilt weiter nur mit Komma in der
  ersten Zahl; keine negativen Zahlen (Beträge rechnen, Vorzeichen getrennt). Gilt in beiden Apps. Nicht b (wie bisher nur
  die erste Zahl). Kipppunkt: das Lehrmittel zeigt die Kommaregel anders (Erweitern auf ganze Zahlen).
- **NB4 a** (2026-11-07, LERN_Session19): Im Lernsteig sieht der Block sachlich aus — Stellen mit ihren Buchstaben in
  neutraler Farbe, Farben und Formen des Lernsteigs, Platz wie im Eulenpfad. Nicht b (Calcularis-Farben). Kipppunkt: der
  Lernsteig übernimmt die Stellenfarben ohnehin.
- Meldung Patrik (LERN_Session20): Im Lernsteig hat der Notizblock Tasten, die Aufgabe nicht (im Eulenpfad beide); Gleichungen
  sollen sich im Block auflösen lassen.
- **TF1 a** (2026-11-07, LERN_Session20): Kern-Teil `kern/tastenfeld.js` (`KERN.tastenfeld`) — Tasten, die in ein gewähltes
  Feld schreiben, ohne ihm den Fokus zu nehmen (aus dem Ziffernfeld des Notizblocks); der Notizblock benutzt ihn mit
  denselben Tasten. Im Lernsteig unter jeder Zahl- und Term-Antwort: Zahl mit Ziffern, Komma, ⌫, ± und „Prüfen“, Term mit
  Ziffern, den Zeichen der Aufgabe (`a.tasten`) und + − · (ersetzt die Zeichenzeile); die Tastatur des Geräts bleibt zu
  (`inputmode` none), eine echte Tastatur schreibt weiter. `LS.tastatur` des Eulenpfads bleibt (eigene Anzeige, Kurztasten,
  Klickzahlen). Nicht b (eigene Tasten im Lernsteig neben denen des Blocks). Kipppunkt: das Tastenfeld stört am Desktop —
  dann einklappbar.
- **GL1 a** (2026-11-07, LERN_Session20): Vorlage „= Gleichung“ im Notizblock des Kerns — Zeilen „Gleichung | Umformung“,
  oben die Gleichung der Aufgabe (bei einem System je Gleichung eine Zeile), „＋ Zeile“ schreibt die letzte ab; Zeichen
  (Variablen, + − · : ( ) =, ² und / wenn die Gleichung sie hat) im Tastenfeld, solange ein Feld der Gleichung gewählt ist;
  nichts bewertet. Die App wählt die Vorlagen (`oeffne({ vorlagen, gleichung })`); im Lernsteig je Übung im Katalog
  (`notizblock: […]`, heute `gleichungen` und `binome-gleichungen`), der Eulenpfad ohne. Nicht b (jede Zeile still
  nachrechnen). Kipppunkt: der Block soll in diesen Übungen Lernhilfe sein statt Papier — dann b, etwa nur in Stufe h.
- **KE1 a** (2026-11-07, LERN_Session20): Eine gesperrte Aufsicht (über den Abgleich auf dem Gerät, OA1 a) lässt sich in
  der Verwaltung **auf diesem Gerät ausblenden**: nicht auf der Anmeldung, nicht im Personen-Knopf, in den Daten und im
  Abgleich unverändert, „wieder zeigen“; die Liste gilt nur für das Gerät. Regel im Kern (`KERN.person.ausgeblendet`),
  beide Apps; im Eulenpfad statt „löschen“ bei einer gesperrten Aufsicht. Nicht b (löschen mit Vermerk: nähme sie auf
  ihrem eigenen Gerät samt Verbindungen mit), nicht c (entfernen ohne Vermerk: kommt mit dem Abgleich wieder).
  Kipppunkt: eine ausgeblendete Aufsicht kostet Platz oder Daten, die nicht auf dem Gerät bleiben dürfen — dann b mit
  Bestätigung durch sie selbst.
- **KE2 a** (2026-11-07, LERN_Session20, Lernsteig): Ein Konto löscht der Jugendliche selbst (Profil, mit Vornamen und
  PIN, wenn er eine hat) oder eine Aufsicht, mit der es verbunden ist (mit Rückfrage), beide mit Löschvermerk — auf allen
  Geräten des Abgleichs; vorher „Zuerst sichern“. Ein nicht verbundenes Konto kann die Aufsicht nur auf diesem Gerät
  ausblenden (wie KE1 a). Nicht b (wie im Eulenpfad: jede Aufsicht jedes Konto), nicht c (nur der Jugendliche). Kipppunkt:
  die Verbindung soll nur Mitlesen heissen, ohne jedes Löschrecht — dann c.
- **ZL1 a** (2026-11-07, LERN_Session20, Fund der Annahme-Prüfung B2 Schritt 3): Apostroph und Leerzeichen gelten beim
  Lesen einer Zahl oder eines Terms nur als Gliederung in Dreiergruppen vor dem Komma („1'080“, „30 400“, „1'080.5“);
  sonst ist die Eingabe unlesbar, zählt nicht als Fehlversuch und bekommt den Hinweis „Den Apostroph nur zwischen
  Dreiergruppen, zum Beispiel 12'340.“ (Kern 1.25.0, `KERN.zahl.lies`, `KERN.terme.lies`). Vorher galten „1'''“ als 1
  und „12'34“ als 1234. Nicht b (wie bisher, überall überlesen), nicht c (streng, als Fehlversuch). Kipppunkt:
  Lehrmittel oder Lehrperson lassen andere Gruppierungen zu (etwa Viererblöcke bei langen Dezimalzahlen) — dann b.
- **TD1 a** (2026-11-07, LERN_Session20, B2 Schritt 3): Text gegen Prüfdaten — jede der zehn Übungen, deren Prüfung nur
  auf `a.daten` rechnete (flaechen-volumen, koerper-winkel, prozent-funktionen, daten-rabatt, folgen, sachsituationen,
  zehnerpotenzen, binome-gleichungen, kombinatorik, zufall), bekommt `liesText(a)`: je Typ liest es die Werte aus dem
  angezeigten Text, unabhängig vom Erzeuger (Satzmuster über `LST.zahlenImText`); `pruefeAufgabe` vergleicht sie mit den
  Daten und rechnet die Lösung ein zweites Mal aus dem Gelesenen. Kombinatorik und Zufall: Ereigniswortlaut aus den Daten
  neu gebaut und verglichen. Übung für Übung, ein Commit je Übung, alle 128 Typen; das Testskript verlangt `liesText`
  für die fertigen (`TEXT_GELESEN`). Anlass der Messung: Ein Vergleich ohne Wissen um den Typ trägt nicht — bei 60 von 128
  Typen zeigt der Text andere Grössen als die Daten (Durchmesser statt Radius, Zahlwörter, Hochzahlen). Nicht b
  (Zahlenmenge je Typ: übersieht vertauschte Rollen), nicht c (Text ein zweites Mal bauen: verdoppelt den Erzeuger).
  Kipppunkt: die Texte ändern sich bald stark (E) — dann zuerst E oder vorerst b.
- **VF1 a** (2026-11-07, LERN_Session20, B2 Schritt 3): Der Vorrat einer Stufe ohne Endlos wird in Runden gemessen —
  Fehler, wenn sie weniger verschiedene Aufgaben hat, als eine Runde lang ist (Wiederholung in derselben Runde);
  Hinweis, wenn sie sich vor der sechsten Runde wiederholt (bei 8 Aufgaben je Runde unter 48, bei 6 unter 36), mit der
  Zahl der Runden. Ausnahmen nur mit Begründung im Katalog (`vorrat: { <stufe>: "<Grund>" }`), die in der Ausgabe steht;
  heute keine eingetragen, die 21 gemeldeten Stufen in E 9. Nicht b (fester Hinweis unter 50), nicht c (nur die
  Wiederholung in der Runde). Kipppunkt: das Gedächtnis mischt bald über Stufen hinweg — dann b.
- **E1-1 a** (2026-11-08, LERN_Session23, E 1): Ganzzahl-Produkte gehören zum Wortlaut von MA.1.A.3.g (Beispiel
  308 · 52) und bleiben, wie heute die Hälfte der Multiplikationen in g (`mal-ganz` 25 %, `mal-dezimal` 25 % der
  Aufgaben); die Forderung „nur mit Dezimalstellen“ entfällt. Nicht b (`mal-ganz` streichen: das erste Beispiel des
  Lehrplans würde nicht geübt). Kipppunkt: das Lehrmittel (mathbuch) übt in g keine reinen Ganzzahl-Produkte.
- **E1-2 a** (2026-11-08, LERN_Session23, E 1): Der Schnitt nach Lehrplan-Stufen bleibt (UE1 a); die Zahlarten sind
  innerhalb der Stufen auf die Übungen verteilt und in der Abdeckungstabelle mit `in` verwiesen. `rationale-zahlen`
  heisst „Dezimalzahlen und rationale Zahlen“ (Kennung bleibt). Nicht b (drei Übungen je Zahlart). Kipppunkt: die
  Übungsauswahl soll nach Zahlart statt nach Lehrplan-Stufe gehen.
- **E1-3 a** (2026-11-08, LERN_Session23, E 1): Die Erweiterungen von MA.1.A.3 h (Primfaktoren, in
  `rationale-zahlen`) und i (Brüche mit Variablen, in `brueche`) werden geübt, nur auf Niveau Sek (A2); `ohneE`
  entfällt bei beiden. Nicht b (ausgenommen „wie PA Gymnasium“: der Umfang einer Prüfung, nicht des Lehrplans).
  Kipppunkt: der Lernsteig soll ausdrücklich auf die Gymnasium-Prüfung zugeschnitten sein. „Nur auf Niveau Sek“
  ersetzt durch E1-5 a.
- **E1-4 a** (2026-11-08, LERN_Session23, E 1 Schritt 6): Eine Aufgabe darf `rechner: "mit"` tragen; das überstimmt
  die Vorgabe ihrer Stufe (die Sperre der Aufsicht gilt weiter). `brueche` f bekommt einen Typ `rechner`
  (Grundoperationen mit Zahlen, die man nicht im Kopf rechnet); Bruchrechnen bleibt ohne Rechner. Nicht b (Stufe f
  „frei“: hebt „Bruchrechnen im Kopf“ auf), nicht c (bewusst nicht). Kipppunkt: das Lehrmittel übt in f keine
  Rechner-Aufgaben.
- **E1-5 a** (2026-11-08, LERN_Session23, E 1 Schritt 7): Die Erweiterungen von MA.1.A.3 h und i gehören zu ihrer
  Stufe wie in den anderen Übungen, für alle Niveaus (ST1 a: die Aufgaben einer Stufe hängen nicht am Niveau); die
  Stufenwahl zeigt „mit Erweiterung“. „Nur auf Niveau Sek“ aus E1-3 a entfällt. Nicht b (Aufgaben am Niveau, ST1 a
  ändern). Kipppunkt: A2 soll für alle Übungen gelten — dann b als eigener Umbau.
