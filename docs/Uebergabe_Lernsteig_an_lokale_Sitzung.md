# Übergabe: Cloud-Sitzung Lernsteig (LST_Session1) → lokale Sitzung im Repo Lernspiele

Stand: 2026-11-05. Verfasst von der Cloud-Sitzung LST_Session1 (Repo `PatrikNeunteufel/Lernsteig`, Branch
`claude/confident-albattani-emy3iw`, Pull Request #1, von Patrik gemerged). Dieses Dokument liegt **nicht** im Repo;
es ist die Übergabe für die Sitzung, die die Arbeit ins Repo **Lernspiele** zurückholt und weiterführt.

**Wichtigster Einstieg im Repo:** `docs/lernsteig/STAND_und_PLAN.md` (Anleitung, Stand, Plan). Dazu
`docs/lernsteig/HANDOVER.md` (Entscheide im Wortlaut), `docs/lernsteig/fragen.md` (alle Entscheidungsfragen kurz),
`docs/lernsteig/rahmen.md` (Vertrag), `docs/lernsteig/CHANGELOG.md` (Verlauf).

---

## 1. Kurzfassung

- Der **Lernsteig** (Sekundarstufe I, Zyklus 3, Kanton SG) ist als lauffähiger Prototyp gebaut: offline, ohne Build,
  HTML/CSS/JS, Speicher `lernsteig:*`, keine Abhängigkeit zu `eulenpfad/`.
- **27 Übungen:** Mathematik 19, Deutsch 2, Englisch 1, Französisch 1, Natur und Technik 4.
- **Rahmen:** Niveaus `n1`/`n2` und Prüfungsziel; Stufen nach dem Lehrplan mit Übergängen und Challenge; Zahl-, Term-
  und Auswahl-Antworten; Tabellen und Graphen; Serie mit Rekord; Protokoll je Aufgabe; Kompetenzstand je Stufe.
- **Eingebauter Taschenrechner** mit Bedienlogik von TI-30X Plus MathPrint, TI-30 eco RS und Casio fx-82DE (aus R11).
- **Konten** (Jugendliche, PIN freiwillig mit Wiederherstellungscode, Einladungslink), **Statistik** mit Wochenziel
  und Sichern/Einlesen, **Aufsicht** für Eltern und Lehrpersonen (verbunden nur mit Zustimmung).
- **Lehrplan Natur und Technik** aus der Cloud recherchiert (26 Kompetenzseiten gesichert und ausgewertet).
- **Testskript** `docs/lernsteig/werkzeuge/pruefe_uebungen.js` prüft Generatoren gegen unabhängige Prüffunktionen,
  Hinweise, Zahlschreibung, Lehrplan-Codes und im Browser (Playwright, 375 px) alle Abläufe.
- **Gemeinsame Bibliothek:** entschieden **KB1 a** und **KB2 a** — Umsetzung **lokal im Repo Lernspiele** (Abschnitt 6).

---

## 2. Zurückholen ins Repo Lernspiele

Pfade sind identisch. Anleitung in `docs/lernsteig/SYNC_lernspiele.md`.

**Übernehmen** (an denselben Pfad):
- `lernsteig/**` (alles)
- `docs/lernsteig/**` — **ausser** `AUFTRAG_cloud.md` und `SYNC_lernspiele.md` (Fassungen nur für das Cloud-Repo)
- `docs/commons_bibliothek.md`
- `docs/gemeinsame_mechaniken.md`: **zeilenweise zusammenführen**, nicht überschreiben (neue Zeilen: Sichern/Einlesen,
  Aufsicht mit PIN; ältere: Stufen, Zufall, Zahlschreibung, `el`, Vertrag, Fehlversuch, Serie, Wiederholungsbremse,
  Protokoll, Testskript, PIN/Code)

**Nicht übernehmen:** Kopf der Cloud-`CLAUDE.md`, `.claude/` des Cloud-Repos, `.gitignore` des Cloud-Repos.

**Danach** in `SYNC_lernspiele.md` (im Lernspiele-Repo) eine Zeile in die Tabelle „Abgleiche“.

**Vorschläge, die die Cloud nicht ändern durfte** (im Lernspiele-Repo von Hand):
- **EP4** `.gitignore`: `lernsteig-*.json` (später `gratwanderung-*.json`) und `__pycache__/` ergänzen.
- **EP3** `CLAUDE.md`, Datenschutz-Abschnitt: „Profil (Name, Geburtsdatum oder Alter, Klasse, Fokus-Lernziele)“; im
  Lernsteig zusätzlich „Land und Kanton, Niveau je Fach“.
- Datenschutz-Ausnahmen des Lernsteigs in `CLAUDE.md` ergänzen: Sichern/Einlesen als Datei nur auf Knopfdruck; Aufsicht
  am selben Gerät, verbunden nur mit Zustimmung (AU1 a, AF1 a, AF2 a).

---

## 3. Entscheide (alle von Patrik, 2026-11-04/05)

| Nr. | Thema | Entscheid |
|---|---|---|
| G1 | Ausgangscommit | `b2276cf`, eigener Branch |
| SP1 | Speicher | a: getrennt `lernsteig:*`; Aufstieg per Knopf (EP1) |
| NV1 / NV2 | Niveau-Modell | `n1` bis GA Z3 (Real), `n2` GA plus Auftrag Z3 (Sek); Prüfungsziel eigene Achse (keins, Stellwerk 8, Gymnasium, EAP); g/m/e nur Anzeige |
| KT1 | Kanton im Profil | a: `lehrplan { land, kanton }` je Jugendlichem |
| AU1 | Anmeldung, Aufsicht | a: Selbstanmeldung, PIN freiwillig, Aufsicht freiwillig und sichtbar; Einladung |
| GE1 | Geburtsdatum | b: ganzes Datum |
| EL1 | Einladung Eulenpfad → Lernsteig | a: Link `#einladung=…` oder Datei, nur Stammdaten, Format im Kern |
| DS1 | Server, E-Mail | a: Prototyp lokal; Server eigener Ausbauschritt (Idee: Server für die Schule) |
| BF1 | Fortschritt | a: Kompetenzstand, Serie über Tage (Wochenziel), Rekorde; keine Sterne, Ränge, Teilen |
| AB1 | Aufstiegs-Erfolg | a: gleicher Rang je Übertritt |
| GW1 | Pro-Gymi, Gratwanderung | a: Pro-Gymi bleibt im Lernsteig, Wechsel mit Eintritt Sek II |
| GR1 | Gruppen, Wettbewerbe | a: Stufe 1 am selben Gerät, Stufe 2 mit Server; Feld `gruppe` im Format |
| ST1 / ST2 | Stufen | Lehrplan-Stufen als Referenz, Übergänge (zwei gemischt), Challenge; Zahl je Übung frei |
| MZ1 | Minuszeichen | a: „−“ anzeigen, alle Formen annehmen |
| Z1 | Zahlschreibung | a: Apostroph ab vier Stellen („1'000“), Dezimalpunkt |
| TR1 / RE1 / RM1 | Taschenrechner | Katalogfeld `rechner` je Stufe (ohne/mit/frei), Aufsicht kann überstimmen; eingebauter Rechner wie an der PA; Bedienlogik je Modell nach R11 |
| UE1 | Erste Übungen | a |
| AF1 | Verbindung lösen | a: Jugendlicher und Aufsicht |
| AF2 | Einlesen durch Aufsicht | a: verbindet (Übergabe der Datei = Zustimmung) |
| FG1 | Freigabe nach Prüfstand | a: wie Eulenpfad, Ungeprüftes gesperrt bis geprüft, Aufsicht gibt frei — **noch nicht gebaut** |
| KB1 | Ort der Bibliothek | a: `kern/` als einzige Quelle, Werkzeug verteilt Kopien |
| KB2 | Beginn des Kerns | a: zuerst `bruch.js` und Zahlschreibung |

---

## 4. Was gebaut ist

### 4.1 Gemeinsame Dateien `lernsteig/gemeinsam/`
| Datei | Inhalt |
|---|---|
| `werkzeug.js` | Speicher, Zufall (Seed austauschbar), Zahlschreibung, Niveaus, Stufenliste, Zielstufe, Wochenserie |
| `lehrplaene.js` | Kantone, Prüfungsziele, Marken (GA Z2, Stufen, OP, GA, E) je Kompetenz, geprüfte Stufen je PA |
| `katalog.js` | Fächer und 27 Übungen mit Kompetenz, Stufen, Rechner je Stufe, Niveaus, Serie, Listen |
| `bruch.js`, `terme.js` | exakte Brüche (BigInt), Terme lesen und in Formen bewerten (vereinfacht, Potenz, ausgeklammert, Bruch) |
| `rechner.js` | Rechner mit Modellen, Bedienhilfe, Fehlertipps, Markenvermerk |
| `konten.js` | Konten, PIN und Code (SHA-256 mit Salz), Anmeldung im Tab, Einladung, Aufsicht und Verbindungen |
| `daten.js` | Sichern und Einlesen (`lernsteig-sicherung` v1), Zusammenführen |
| `rahmen.js` | Stufenwahl, Runde, Serie, Protokoll, Kompetenzstand, Rechner je Stufe, Wochenziel |

### 4.2 Seiten
`lernsteig/index.html` (Start), `statistik.html`, `aufsicht.html`, `uebungen/<id>/index.html`.

### 4.3 Übungen (27)
| Fach | Übung | Kompetenz, Stufen |
|---|---|---|
| Mathe | rationale-zahlen | MA.1.A.3 g–i |
| | brueche | MA.1.A.3 f, g, i |
| | gleichungen | MA.1.A.4 h, j |
| | terme | MA.1.A.4 i–k |
| | binome-gleichungen | MA.1.A.4 l, m |
| | zehnerpotenzen | MA.1.A.1 i–k |
| | ueberschlagen-ordnen | MA.1.A.2 h–j |
| | aussagen (Liste ungeprüft) | MA.1.B.2 h, j, k |
| | folgen | MA.1.C.2 g–j |
| | flaechen-volumen | MA.2.A.3 f–i |
| | koerper-winkel | MA.2.A.3 j, k |
| | koordinaten | MA.2.C.4 h–j |
| | groessen | MA.3.A.2 h–k |
| | prozent-funktionen | MA.3.A.3 g–i |
| | lineare-funktionen | MA.3.A.3 j, k |
| | daten-rabatt | MA.3.A.1 j–l |
| | kombinatorik | MA.3.B.2 d, f, g |
| | zufall | MA.3.C.1 f, h, i |
| | sachsituationen | MA.3.C.2 f–h |
| Deutsch | grammatik, rechtschreibung (Listen ungeprüft) | D.5.D.1 e–g, D.5.E.1 d–g |
| Englisch | englisch-grammatik (Liste ungeprüft) | FS1E.5.D.1 b–d |
| Französisch | franzoesisch-grammatik (Liste ungeprüft) | FS2F.5.D.1 b–d |
| NT | stromkreis | NT.5.2 b, c, d |
| | kraefte (Liste maschinen ungeprüft) | NT.5.1 a, c, d, e |
| | atombau (Liste pse ungeprüft) | NT.3.2 a, c, d |
| | stoffwechsel (Zuordnung wörtlich aus dem Lehrplan) | NT.7.2 a |

Fachliche **Annahmen** stehen im Kopf jeder `aufgaben.js`. Bei NT nennt der Lehrplan **keine Formeln**: U = R · I,
Einheiten, g = 10 N/kg, Hebelgesetz, Flaschenzug, Massenzahl statt Atommasse sind mit dem Lehrmittel abzugleichen.

### 4.4 Testen
```bash
node docs/lernsteig/werkzeuge/pruefe_uebungen.js                      # alle, ohne Browser
node docs/lernsteig/werkzeuge/pruefe_uebungen.js <id> --browser       # eine Übung mit Browser
node docs/lernsteig/werkzeuge/pruefe_uebungen.js --aufgaben=500 --browser   # voll, vor dem Merge
```
Regel (Abschnitt 2.3 im Stand-Dokument): nach einer Änderung an einer Übung nur diese; nach Änderung am Gemeinsamen
alles ohne Browser plus zwei, drei Übungen mit Browser; voller Browser-Lauf nur vor dem Merge oder am Sitzungsende.
Letzter Stand: ohne Browser 0 Fehler; jede Übung nach ihrer letzten Änderung einzeln mit Browser 0 Fehler. **Ein voller
Browser-Lauf über alles steht noch aus.**

---

## 5. Recherchen

### 5.1 Aus der lokalen Sitzung (Patrik, 2026-11-04), im Repo unter `docs/lernsteig/lehrplan/`
| Datei | Inhalt |
|---|---|
| `lehrplan_sg_sek1.md` | Oberstufe SG (Real/Sek), was Real und Sek erreichen sollen, Lektionentafel, Fächer und Kompetenzbereiche; Annahmen A1–A5 (Niveaus auf der Lehrplanskala, Erweiterungen, e/m/g, OP = Mitte 2. Oberstufe, Pro-Gymi) |
| `mathematik_zyklus3.md` | alle 26 Mathe-Kompetenzen mit GA Z2, Stufen Z3, OP, GA, Erweiterungen (aus den CSS-Klassen von sg.lehrplan.ch) |
| `sprachen_zyklus3.md` | Deutsch, Englisch, Französisch, Italienisch, Latein mit GA, OP, GER-Niveaus |
| `sg_oberstufe_praxis.md` | Lehrmittel, Beurteilung und Wechsel Real ↔ Sek, Aufnahmeprüfungen (geprüfte Mathe-Stufen), Stellwerk 8, Schreibweisen |
| `rechnermodelle_sg.md` | R10/R11: erlaubte Modelle, Bedienlogik je Modell, Rechte am Aussehen, kein Rechner im Stellwerk 8 |

**Offene Recherchen aus der lokalen Sitzung:**
- R5: Niveaus e/m/g ↔ Real/Sek.
- R7: Stufengruppen 1a/1b/2a im Latein. Das gleiche Muster hat jetzt auch NT.2.1 und NT.3.1.
- R8: Schreibweisen im mathbuch.
- R9: alte Aufnahmeprüfungen (Matura-Navigator).
- R12–R19 (Rechner):
  - R12: Verbreitung der Modelle
  - R13: mathbuch und Tastenfolgen
  - R14: Casio, Komma oder Punkt in der Anzeige
  - R15: weitere Modelle
  - R16: typische Bedienfehler
  - R17: Rechte
  - R18: fx-82DE X an der Prüfung
  - R19: Stellwerk-Hilfen

### 5.2 Aus der Cloud-Sitzung (2026-11-05)
- **Natur und Technik:** 26 Kompetenzseiten NT.1.1 bis NT.9.3 roh gesichert (`lehrplan/quellen_nt/`, Code
  `a|6|2|<Bereich>|0|<Nr>`) und ausgewertet in `lehrplan/nt_zyklus3.md` (zwei Agenten, nur aus den HTML-Dateien).
  Befunde:
  - NT gibt es nur im Zyklus 3: kein GA Z2, stattdessen eine vorangehende Kompetenz in NMG. Keine Erweiterungen.
    Keine Formeln, auch nicht beim Ohmschen Gesetz.
  - Verbindliche Inhalte (`tooltip begriffe`) sind wörtlich übernommen.
  - Bei NT.1.3, NT.3.1 (Aufbau 2), NT.5.3, NT.8.1, NT.8.3 und NT.9.2 liegt der OP vor Stufe a.
  - Doppel-Aufbauten bei NT.2.1 und NT.3.1.
  - NT.7.3 hat keinen OP, NT.8.3 keinen GA.
  - Die Lage des OP ist im Browser noch an zwei, drei Seiten gegenzuprüfen.
  - Empfehlung: keine Übung zu NT.7.3 (Sexualaufklärung).
- **Erreichbare Adressen der Cloud-Umgebung** (nach Freigabe durch Patrik): sg.lehrplan.ch, www.sg.ch,
  www.lehrplan21.ch, v-fe.lehrplan.ch, www.klett.ch, www.schulverlag.ch, www.lmvz.ch (nur mit Browser-Kennung),
  Wikipedia, Google. Gesperrt: www.lmvsg.ch (Proxy). www.edk.ch lehnt selbst ab (403).
- Noch offen aus R6: Lehrmittel NT in SG (Statusliste über www.sg.ch); ob NT an den Aufnahmeprüfungen geprüft wird
  (vermutlich nicht, nur Vornote).

---

## 6. Gemeinsame Bibliothek (Kern) — Plan nach KB1 a und KB2 a

Vollständiger Vorschlag: `docs/commons_bibliothek.md`. Herkunft jeder Kopie: `docs/gemeinsame_mechaniken.md`.

**Rahmen:**
- Keine Abhängigkeit zwischen App-Ordnern.
- Ohne Build, offline per Doppelklick.
- Jeder App-Ordner enthält nur, was online geht.
- Alle Apps teilen den Ursprung `patrikneunteufel.github.io`, also auch localStorage. Darum hat jeder Kern-Teil ein
  Präfix der App als Parameter.

**Ort und Einbindung (KB1 a, Weg B):**
- `kern/` im Repo Lernspiele ist die **einzige Quelle**.
- Ein Werkzeug `tools/kern_verteilen.py` kopiert die Kern-Dateien nach `eulenpfad/kern/` und `lernsteig/kern/`. Im
  Kopf jeder Kopie steht `kern <Version>, Prüfsumme …`.
- Das Testskript jeder App bricht ab, wenn ihre Kopie von `kern/` abweicht. Die Kopie ist ein Ergebnis, nie eine
  zweite Quelle.
- `kern/VERSION` folgt der Semantik klein = Fehler, mittel = neue Funktion, gross = Schnittstelle. Dazu
  `kern/CHANGELOG.md`. Eine App darf hinter dem Kern zurückliegen.
- Datenformate (Protokoll, Rekord, Einladung, Sicherung) tragen ein Feld `format`.
- Ein eigenes Repo erst, wenn eine App ausserhalb von Lernspiele lebt (Kipppunkt zu Weg C, Submodul).

**Reihenfolge (KB2 a):**
1. `bruch.js` (Lernsteig, ohne DOM, vollständig getestet; der Eulenpfad kann damit härtere Prüffunktionen bauen) und
   `zahlText` mit der Schreibweise als Einstellung: `kern.zahlText(n, { tausender, abStellen, minus })`. Der Eulenpfad
   schreibt Leerzeichen ab 5 Stellen, der Lernsteig Apostroph ab 4.
2. Speicher mit Präfix `kern.speicher(praefix)`, Zufall mit austauschbarer Quelle, `el`.
3. Protokoll- und Rekordformat, Serie und Wiederholungsbremse, Anmeldung mit PIN, Code und Hash.
   - Die Rollen bleiben je App.
   - Die Lernsteig-Aufsicht hat Verbindungen, der Eulenpfad nicht. Diese Kopien laufen bereits auseinander.

**Weitere Kandidaten:** `terme.js` (ab Gratwanderung wichtig), der Rechenkern des Rechners (die Ansichten bleiben je
App), das Einladungsformat (EL1 a, der Lernsteig hat es als Erster festgelegt), Sichern und Zusammenführen, und der
Testskript-Kern (Generator gegen Prüffunktion, Hinweise ohne Lösung, verdächtiger Text, Apostroph-Prüfung; Treiber je
App).

**Kein Kern:** Ton, Belohnung (Sterne gegen Kompetenzstand), Stufenmodell, Darstellung.

**Umstellen ohne Bruch:**
1. `kern/` mit dem ersten Teil anlegen.
2. Werkzeug und Prüfung im Testskript beider Apps einrichten.
3. Teil für Teil umziehen, das Testskript grün halten, die Zeile in `gemeinsame_mechaniken.md` auf „im Kern seit
   <Version>“ setzen.

Speicherschlüssel bleiben (`lernspiele:*`, `lernsteig:*`).

---

## 7. Für den Eulenpfad (Notizen EP1–EP4, `docs/lernsteig/notizen_fuer_eulenpfad.md`)

- **EP1:** Klassenaufstieg per Knopf der Aufsicht. Nach der 6. Klasse der Wechsel zum Lernsteig mit Einladung (Link
  `…/lernsteig/#einladung=<base64url(JSON {v:1,name,geboren,klasse,niveau,lehrplan})>` oder Datei; nur Stammdaten, keine
  PIN). Der Lernsteig liest die Einladung bereits.
- **EP2:** Aufstieg als Erfolg. Nach AB1 a gleicher Rang für jeden Übertritt; ein Abzeichen zählt die Klassen.
- **EP3:** Geburtsdatum statt Alter im Profil (GE1 b), mit Änderung im Datenschutz-Abschnitt.
- **EP4:** Ergänzung der `.gitignore`.

Ausserdem gewünscht: Gruppenaufgaben und Live-Wettbewerbe (GR1 a) und das Konzept „Server für die Schule“ (DS1).

---

## 8. Plan (Reihenfolge)

1. ~~Fehler `brueche`~~ (behoben).
2. **Freigabe nach Prüfstand (FG1 a)** bauen. Ungeprüftes ist gesperrt, die Aufsicht gibt frei oder sperrt. Vorlage
   `docs/eulenpfad/rahmen.md` 6. Dazu:
   - `lernsteig/gemeinsam/pruefstand.js` mit `uebungen` und `listen` je `{ am, von }`.
   - `lernsteig:freigabe` je Gerät.
   - Startseite und Übungsseite zeigen „noch nicht freigegeben“.
3. **Patrik prüft:**
   - sieben Listen: aussagen, grammatik, rechtschreibung, englisch, franzoesisch, maschinen, pse;
   - die Annahmen je Übung;
   - die Übungen auf Desktop, Tablet und Handy;
   - danach den Prüfstand eintragen.
4. **NT weiter** nach der Lesart in `nt_zyklus3.md`:
   - NT.5.1 b und f; NT.2.2 und NT.3.2 b und e; NT.4.1; NT.6.1 c; NT.7.4 b; NT.8.1 b; NT.8.3 a/c; NT.9.1 a.
   - Doppel-Aufbauten (NT.2.1, NT.3.1): erst entscheiden, wie Stufen „1a/2a“ im Rahmen heissen (Vorschlag: je
     Aufbau ein eigener Katalogeintrag).
   - Je Kompetenz `MARKEN_ROH` in `lehrplaene.js` nachtragen.
5. **Kern** aufbauen, lokal (Abschnitt 6).
6. Danach:
   - Mathe-Kompetenzen ohne Übung (MA.1.B.1, MA.1.B.3, MA.1.C.1, MA.2.A.1, MA.2.A.2, MA.2.B.1, MA.2.B.2,
     MA.2.C.1–C.3, MA.3.B.1, MA.3.C.3);
   - weitere Sprachkompetenzen;
   - Gruppen am selben Gerät (GR1 a), Timer als Zusatz;
   - Abgleich über einen Ordner;
   - Server-Konzept.
7. Vor dem nächsten Merge: voller Testlauf mit Browser.

---

## 9. Hinweise für die nächste Sitzung

- **Regeln:**
  - Codes nur aus `docs/lernsteig/lehrplan/`.
  - Netzzusammenfassungen sind kein Beleg.
  - Was unsicher ist, als Annahme markieren.
  - Schweizer Schreibweise (ss).
  - Zahlen nur über `LST.zahlText` und `LST.dezimalText`.
- **Grenze der Aufsicht:** Alles liegt im Browser. Die PIN schützt vor Versehen, nicht vor jemandem mit
  Entwicklerwerkzeugen (DS1 a). Die Seite sagt das.
- **Vertrag:** Eine neue Übung folgt `docs/lernsteig/rahmen.md` 4. Die Anleitung Schritt für Schritt steht in
  `STAND_und_PLAN.md` 1.6.
- **Inhaltslisten** stehen in eigenen Dateien im Übungsordner, mit dem Kopf „UNGEPRÜFT“ und einem `listen`-Eintrag im
  Katalog.
- **Entscheidungsfragen** im festen Format:
  - Titel, Ort, heutiger Wortlaut, Problem;
  - die Optionen, mit **a (Empfehlung)** vorn;
  - *Warum die Empfehlung*, mit Kipppunkten.
  - Empfohlen wird nach sauber/richtig, nicht nach Aufwand.
