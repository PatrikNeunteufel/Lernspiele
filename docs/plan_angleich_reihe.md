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
| B | Gemeinsamer Kern und Testgerüst für alle drei Apps | in Arbeit seit 2026-11-05 (LERN_Session15, B1): Kern 1.15.0 mit `daten.js`; offen: Apps auf `daten.js`, Ordner-Abgleich (DF3 a), Ablauf der Runde, Rest der Rollen; Testgerüst B2 in Arbeit seit 2026-11-06 (LERN_Session17): Einstieg und Seiten des Lernsteigs im Ersatz-DOM gebaut, als Nächstes die offenen Kern-Teile (AN2 a), dann B2 Schritt 3 | Abschnitt B |
| C | Grundgerüst Lernsteig wie Eulenpfad, Gratwanderung dazu | in Arbeit seit 2026-11-06 (LERN_Session16, C1 vorgezogen, AZ1 a): C1, C2 und C9 gebaut, C6 zum Teil (Entwickler-Modus); als Nächstes B2 | Abschnitt C |
| D | Fehler und Schwachstellen beheben | offen, mit B/C | Abschnitt D |
| E | Fachliche Korrekturen der Übungen | offen, nach C | Abschnitt E |
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
Stand 2026-11-06: Kern 1.15.0 mit Zahl, Bruch, Terme, Rechenkern, Speicher, Zufall, `el`, Geheimnis, Person,
Freigabe, Suche, Runden, Daten (ein Dateiformat für Sichern, Einlesen und Abgleich mit Löschvermerken und Schutz nach
DF4 a), Anmeldung (mit Gast), Entwicklung, Einladung, Auswertung, Übernahme einer Aufsicht, Rollleiste und
Personen-Knopf; Eulenpfad und Lernsteig benutzen, was sie brauchen (`daten.js` noch keine), die Gratwanderung hat die
Kopie und lädt sie mit C8. Noch nicht im Kern: der Abgleich über einen Ordner (DF3 a), der Ablauf einer Runde (Fehlversuch mit Hinweis und Lösung nach dem
dritten, Serie/Endlos mit Rekord und Zwischenstand, Wiederholungsbremse, Vertrag `aufgabeErzeugen`/`pruefeAufgabe`)
und der Rest der Rollen (Gruppenleitung G2 a, Bestätigung durch eine bestehende Aufsicht, PIN zurücksetzen mit Frist).

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
    abfangen und melden).
  - Text gegen Prüfdaten: Ereigniswortlaut in Kombinatorik/Zufall aus den Daten neu erzeugt und verglichen;
    Prüffunktionen, die nur auf `daten` rechnen, lesen den angezeigten Text (flaechen-volumen, koerper-winkel,
    prozent-funktionen, daten-rabatt, folgen, sachsituationen, Teile von zehnerpotenzen und binome-gleichungen).
  - `konten`/`rollen` und `daten`: kaputte und fremde Dateien, Ids fremder Konten, voller Speicher, Zeitzone.
  - Vielfalt: Mindestvorrat je Stufe auch ohne Endlos (Hinweis unter 50 verschiedenen Aufgaben).
  - Rechner: NaN, Division durch 0, 10-stellige Anzeige.
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
   Favoriten. **Mehr Personalisierung als im Eulenpfad:** Passung zusätzlich aus Niveau je Fach und Prüfungsziel
   (Übungen mit geprüften Stufen des gewählten Ziels nach vorn), Wackel-Stufen aus dem Kompetenzstand.
4. **Profil:** Person (Vorname, Geburtsdatum B3, Klasse 1.–3. Oberstufe, Land und Kanton), Niveau je Fach,
   Prüfungsziel, Rechnermodell, Fokus; Aufbau wie das Eulenpfad-Profil (Formular, Speichern, sofort wirkende Häkchen).
5. **Verwaltung (nur Aufsicht):** Konten, Freigabe, Abgleich, Einstellungen, Entwicklung — wie Eulenpfad.
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

1. **Rationale Zahlen, Stufe g** (Hinweis Patrik): Der Lehrplan MA.1.A.3.g verlangt Dezimalzahlen bis 5 Wertziffern
   multiplizieren (308 · 52; 12 · 0.3), Brüche am Rechteckmodell multiplizieren, Brüche (Nenner bis 1000) als
   Dezimalzahlen, Stammbruch in einer ganzen Zahl. Die Übung zieht ein Viertel reine Ganzzahl-Produkte (`mal-ganz`) und
   kein Bruch-Produkt; der Name „Rationale Zahlen“ verspricht, was erst Stufe i bringt. Zudem decken `brueche` und
   `rationale-zahlen` beide MA.1.A.3 g. Neu schneiden: eine Übung je Zahlart und Operation (Dezimalzahlen
   multiplizieren und dividieren; Brüche; negative Zahlen), Ganzzahl-Produkte nur als Teil mit Dezimalstellen,
   Bruch-Produkte am Rechteckmodell dazu. Gleicher Massstab für alle Übungen: Prüfen, ob die Aufgaben je Stufe den
   **ganzen** Inhalt der Lehrplanstufe abdecken (Abdeckungstabelle je Übung).
2. **Brutto/Netto** (`daten-rabatt`): Bruttopreis − Rabatt = Nettopreis als Hauptfall; Lesart mit Lehrmittel (mathbuch)
   abgleichen.
3. **Überschlagen** (`ueberschlagen-ordnen`): Ablenker aus falschem Runden (eine Stelle falsch gerundet, Ergebnis
   ±10–30 %), nicht nur Zehnerpotenzen daneben.
4. **Terme:** „Schreibe als Potenz“ nur mit derselben Basis; `a/2`, `×`, `⋅`, Grossbuchstaben annehmen; gemischte
   Zahl `1 3/4` erkennen oder ausdrücklich abweisen; „vereinfacht“ verlangt zusammengefasste Faktoren.
5. **Terme, Reihenfolge j/k:** Stufen bleiben nach Lehrplan (j Erweiterung, k GA); in der Stufenwahl sichtbar machen,
   dass k ohne j erreichbar ist.
6. **Atombau:** B³⁺ und Be²⁺ aus der Challenge; B und Si als Halbmetall oder aus der Frage „Metall/Nichtmetall“
   nehmen; Hinweis zur Lage der Nichtmetalle mit Ausnahme H.
7. **Kräfte:** Stufe a nach Seitentext (Diagramme erkennen und darstellen) statt nur v = s : t; Beispiele in
   `maschinen.js` eindeutig (Kran, Handbohrer); realistische Grössen (Kraftmesser, Spannungen in `stromkreis`).
8. **Französisch:** „C'est le vélo de moi“, „les clés d'elle“ idiomatisch ersetzen; Englisch „___ the table“ eindeutig.
9. **Vielfalt:** `kombinatorik` f (23) mit drei Münzen, Glücksrad, Urne, Karten; `folgen` j (53) mit weiteren Figuren;
   `zehnerpotenzen` Zahlwort „einhundertein Millionen“ prüfen (Duden).
10. **Hinweise:** Wurzelaufgaben bekommen einen Wurzel-Hinweis; `folgen` nennt die Formel nicht in der Aufgabe.
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
