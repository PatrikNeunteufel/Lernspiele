# Lernsteig — Stand, Anleitung und Plan

> **Rücknahme 2026-11-05 (LERN_Session15):** Der Stand unten stammt aus dem Cloud-Repo `Lernsteig` (`8f55173`) und
> ist ins Repo Lernspiele übernommen (Pfadliste: `lernsteig/**`, `docs/lernsteig/**` ohne die Cloud-Fassungen von
> `AUFTRAG_cloud.md` und `SYNC_lernspiele.md`, `docs/commons_bibliothek.md`, `docs/gemeinsame_mechaniken.md`). Seither
> sind alle Übungen gesperrt, bis sie im Prüfstand stehen (A1 a). Was als Nächstes kommt, steht im
> [Plan zum Angleich der Reihe](../plan_angleich_reihe.md); er geht dem Plan in Abschnitt 3 vor.

Stand: 2026-11-05, Ende LST_Session1 (Cloud). Branch `claude/confident-albattani-emy3iw`, Pull Request
[PatrikNeunteufel/Lernsteig#1](https://github.com/PatrikNeunteufel/Lernsteig/pull/1). Dieses Dokument ist der Einstieg
für die nächste Sitzung (lokal oder Cloud). Einzelheiten: Vertrag [rahmen.md](rahmen.md), Entscheide
[HANDOVER.md](HANDOVER.md) und [fragen.md](fragen.md), Verlauf [CHANGELOG.md](CHANGELOG.md).

---

## 1. Anleitung

### 1.1 Starten
- `lernsteig/index.html` im Browser öffnen (Doppelklick genügt, offline, kein Server, kein Build).
- Aus dem Repo Lernspiele heraus auch über `portal/index.html` → Lernsteig.

### 1.2 Seiten
| Seite | Wofür |
|---|---|
| `lernsteig/index.html` | Startseite: Konto, Einstellungen (Land, Kanton, Prüfungsziel, Taschenrechner-Modell), Fächer mit Übungen nach Thema, „wird geprüft“, „x von n Stufen sicher“, Wochenziel, wer mitliest |
| `lernsteig/statistik.html` | Mein Stand: Überblick, Wochenziel, Stand je Übung und Stufe, letzte Runden, Sichern und Einlesen. Mit `?konto=<id>` für eine angemeldete Aufsicht (nur verbundene Konten) |
| `lernsteig/aufsicht.html` | Aufsicht für Eltern und Lehrpersonen: anlegen (PIN Pflicht), anmelden, verbundene Konten, Mitlesen anfragen, Konto anlegen, Sichern und Einlesen, Einstellungen des Geräts |
| `lernsteig/uebungen/<id>/index.html` | eine Übung. Parameter: `?niveau=n1\|n2`, `?stufe=<buchstabe>\|<a>-<b>\|challenge`, `&endlos=1` (Serie) |

### 1.3 Ablauf für Jugendliche
1. Startseite → „Neues Konto“ (Vorname, Geburtsdatum, Klasse, PIN freiwillig). Mit PIN wird einmal ein
   Wiederherstellungscode gezeigt (aufschreiben).
2. Niveau je Fach wählen (Real `n1`, Sek `n2`), Prüfungsziel (keins, Stellwerk 8, Gymnasium, EAP).
3. Übung → Stufe wählen. Stufen: Lehrplan-Buchstaben (Referenz), Übergänge (zwei Stufen gemischt), Challenge.
4. Runde: falsche Antwort → Hinweis, neuer Versuch; nach drei Versuchen Lösung mit Weg. Serie: bis zum ersten Fehler.
5. Taschenrechner: nur wo die Übung ihn erlaubt (Knopf „Rechner“), Modell aus den Einstellungen.

### 1.4 Ablauf für eine Aufsicht
1. `aufsicht.html` → „Neue Aufsicht“ (Name, Rolle, PIN). Code aufschreiben.
2. Konto für einen Jugendlichen anlegen (gleich verbunden) **oder** „anfragen“ → der Jugendliche lässt in seinem Konto
   zu (nur mit PIN) **oder** eine Sicherung des Jugendlichen einlesen (verbindet, AF2 a).
3. „Stand ansehen“ öffnet die Statistik des Kontos. Lösen können beide Seiten (AF1 a).
4. Einstellungen des Geräts: Taschenrechner (wie die Übung / überall gesperrt / überall erlaubt), Dezimalzeichen.
- Grenze: alles liegt im Browser. Die PIN schützt vor Versehen, nicht vor Entwicklerwerkzeugen (Server: DS1 a).

### 1.5 Prüfen (Testskript)
```
node docs/lernsteig/werkzeuge/pruefe_uebungen.js                    # alle Übungen, 3000 Aufgaben je Stufe
node docs/lernsteig/werkzeuge/pruefe_uebungen.js zufall brueche     # nur diese
node docs/lernsteig/werkzeuge/pruefe_uebungen.js --aufgaben=500 --browser   # dazu Chromium, 375 px
```
Prüft: Generator gegen unabhängige `pruefeAufgabe`, Hinweise ohne Lösung, kein NaN/undefined, Apostroph ab vier
Stellen auch im Lösungsweg (Mathe), Vorrat der Serien (≥ 100), Kompetenz-Codes gegen die Recherche, Rechenkern und
Modelle des Rechners, Wochenserie mit festen Daten; im Browser: jede Stufe durchspielen, Protokoll, Serie, Rechner,
Konten, Aufsicht, Statistik mit Sichern und Einlesen. Playwright muss installiert sein (`require("playwright")`).

### 1.6 Eine neue Übung anlegen
1. Kompetenz und Stufen nur aus `docs/lernsteig/lehrplan/` (keine Codes aus dem Gedächtnis).
2. Ordner `lernsteig/uebungen/<id>/` mit `index.html` (von einer bestehenden Übung kopieren, Titel ändern) und
   `aufgaben.js`: `UEBUNG`, `aufgabeErzeugen(stufe, niveau)`, `pruefeAufgabe(a, stufe, niveau)` (unabhängig
   nachrechnen), `hinweis(a, eingabe)` (nennt die Lösung nie), `module.exports` am Ende.
3. Inhaltslisten (Wörter, Sätze) in eine eigene Datei im Ordner, Kopf „UNGEPRÜFT“, im Katalog `listen`.
4. Eintrag in `lernsteig/gemeinsam/katalog.js`: `kompetenz`, `stufen`, `ohneE`, `rechner`, `niveaus`, `anzahl`,
   `endlos`, `neu`.
5. Testskript laufen lassen, bis 0 Fehler; dann CHANGELOG und HANDOVER.
6. Zahlen immer über `LST.zahlText` / `LST.dezimalText` (Apostroph ab vier Stellen, Dezimalpunkt, „−“).

### 1.7 Regeln, die immer gelten
- Nur `lernsteig/**`, `docs/lernsteig/**`, Zeilen in `docs/gemeinsame_mechaniken.md`, `docs/commons_bibliothek.md`.
- Nichts aus `eulenpfad/` laden; jede übernommene Mechanik als Zeile in `docs/gemeinsame_mechaniken.md`.
- Speicher `lernsteig:*`; Daten nur im Browser; keine Namen von Kindern in Commits.
- Commits mit `LST:`, kein `Co-Authored-By`; Schweizer Schreibweise (ss).

---

## 2. Stand

### 2.1 Gemeinsame Dateien (`lernsteig/gemeinsam/`)
| Datei | Inhalt |
|---|---|
| `werkzeug.js` | Speicher, Zufall (Seed austauschbar), Zahlschreibung, Niveaus, Stufenliste, Zielstufe, Wochenserie |
| `lehrplaene.js` | Kantone, Prüfungsziele, Marken (GA Z2, Stufen, OP, GA, E) je Kompetenz, geprüfte Stufen je PA |
| `katalog.js` | Fächer und 23 Übungen |
| `bruch.js`, `terme.js` | exakte Brüche (BigInt), Terme lesen und in Formen bewerten |
| `rechner.js` | eingebauter Rechner, Modelle allgemein, TI-30X Plus MathPrint, TI-30 eco RS, Casio fx-82DE |
| `konten.js` | Konten, PIN und Code (SHA-256 mit Salz), Anmeldung im Tab, Einladung, Aufsicht und Verbindungen |
| `daten.js` | Sichern und Einlesen (`lernsteig-sicherung` v1), Zusammenführen |
| `rahmen.js` | Stufenwahl, Runde, Serie, Protokoll, Kompetenzstand, Rechner je Stufe, Wochenziel |
| `stil.css` | Aussehen |

### 2.2 Übungen (27)
| Fach | Übung | Kompetenz, Stufen |
|---|---|---|
| Mathematik | rationale-zahlen | MA.1.A.3 g–i |
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
| Natur und Technik | stromkreis | NT.5.2 b, c, d |
| | kraefte (Liste maschinen ungeprüft) | NT.5.1 a, c, d, e |
| | atombau (Liste pse ungeprüft) | NT.3.2 a, c, d |
| | stoffwechsel | NT.7.2 a |

### 2.3 Testlauf
Stand 2026-11-05: ohne Browser alle Übungen 0 Fehler; mit Browser jede Übung nach ihrer letzten Änderung einzeln
0 Fehler. Ein voller Lauf mit Browser über alles steht vor dem Merge an.

**Wann welcher Test:** nach einer Änderung an einer Übung nur diese Übung (`pruefe_uebungen.js <id> --browser`); nach
einer Änderung an `lernsteig/gemeinsam/` oder am Testskript alles ohne Browser plus zwei, drei Übungen mit Browser;
der volle Lauf mit Browser nur vor dem Merge oder am Ende einer Sitzung.

### 2.4 Entscheide dieser Sitzung
G1, SP1, NV1, AU1, BF1, DS1, KT1, GE1, EL1, AB1, GW1, GR1, NV2, ST1, MZ1, TR1, UE1, ST2, RE1, RM1, AF1 a, AF2 a,
FG1 a, KB1 a, KB2 a. Kurzform in [fragen.md](fragen.md).

---

## 3. Plan

### 3.1 Als Nächstes (Reihenfolge)
1. ~~Fehler `brueche` Challenge~~ — behoben 2026-11-05: `bt` schreibt Zähler und Nenner über `LST.zahlText`
   („−407/1'080“); `terme.js` liest den Apostroph beim Einlesen heraus, Eingabe mit und ohne Apostroph gilt.
2. **Freigabe nach Prüfstand (FG1 a):** `lernsteig/gemeinsam/pruefstand.js` (`{ uebungen: { <id>: { am, von } },
   listen: { "<id>/<liste>": { am, von } } }`), Speicher `lernsteig:freigabe` je Gerät (Aufsicht gibt frei oder
   sperrt), ungeprüfte Übungen auf der Startseite ausgegraut „noch nicht freigegeben“, Übungsseite zeigt dasselbe bei
   direktem Aufruf. Testskript: im Browser den Prüfstand per Freigabe setzen. Vorlage `docs/eulenpfad/rahmen.md` 6.
3. **Patrik prüft:** fünf Inhaltslisten (aussagen, grammatik, rechtschreibung, englisch, franzoesisch) und die
   Annahmen im Kopf jeder `aufgaben.js`; Übungen auf Desktop, Tablet, Handy ansehen → Prüfstand eintragen.
4. **Natur und Technik:** Die 26 Kompetenzseiten sind gesichert (`lehrplan/quellen_nt/`) und ausgewertet
   ([lehrplan/nt_zyklus3.md](lehrplan/nt_zyklus3.md), je Kompetenz mit Lesart „für kurze Übungen“; Lage des OP im
   Browser an zwei, drei Seiten gegenprüfen). Übungen `stromkreis` (NT.5.2), `kraefte` (NT.5.1; g = 10 N/kg als Annahme), `atombau` (NT.3.2), `stoffwechsel` (NT.7.2 a).
   NT.2.1 hat zwei Aufbauten (Stufen 1a…, 2a…): Der Rahmen kennt nur einfache Buchstaben; vor einer Übung entscheiden,
   wie Doppel-Aufbauten heissen (etwa zwei Einträge im Katalog je Aufbau). Weiter nach der Lesart:
   NT.5.1 b und f ergänzen, NT.2.1/NT.2.2 und NT.3.2
   (Stoffe, Teilchenmodell, Trennverfahren, Periodensystem), NT.4.1 (Energie), NT.7.2 a (Organe ↔ Vorgänge),
   NT.6.1 c, NT.7.4 b, NT.8.1 b, NT.8.3 a/c, NT.9.1 a. Keine Übung zu NT.7.3. Formeln, Einheiten und Begriffslisten,
   die nicht im Lehrplan stehen, aus dem Lehrmittel belegen (Lehrmittel-Statusliste über www.sg.ch). Je neue
   Kompetenz die Marken in `lehrplaene.js` `MARKEN_ROH` nachtragen. Auftrag: [lehrplan/R6_auftrag_nt.md](lehrplan/R6_auftrag_nt.md).
   Netz der Cloud-Umgebung (Stand 2026-11-05): erreichbar sg.lehrplan.ch, www.sg.ch, www.lehrplan21.ch,
   v-fe.lehrplan.ch, www.klett.ch, www.schulverlag.ch, www.lmvz.ch (mit Browser-Kennung), Wikipedia, Google;
   gesperrt www.lmvsg.ch; www.edk.ch lehnt selbst ab (403).
5. **Gemeinsamer Kern (KB1 a, KB2 a, lokal im Repo Lernspiele):** Ordner `kern/` als einzige Quelle,
   `tools/kern_verteilen.py` kopiert nach `eulenpfad/kern/` und `lernsteig/kern/` (Version, Prüfsumme), Testskripte
   prüfen die Übereinstimmung. Beginn mit `bruch.js` und Zahlschreibung (Schreibweise als Einstellung), dann Speicher,
   Zufall, `el`, zuletzt Protokoll, Serie, Anmeldung. Vorschlag in [../commons_bibliothek.md](../commons_bibliothek.md).

### 3.2 Danach
- Weitere Mathe-Kompetenzen ohne Übung: MA.1.B.1, MA.1.B.3, MA.1.C.1, MA.2.A.1 (Begriffe, als Liste), MA.2.A.2,
  MA.2.B.1, MA.2.B.2, MA.2.C.1–C.3, MA.3.B.1, MA.3.C.3. Lesart je Stufe: nur, was eine kurze Aufgabe mit eindeutiger
  Lösung erlaubt.
- Deutsch, Englisch, Französisch: weitere Kompetenzen (Wortschatz, Lesen mit eindeutigen Fragen), längere Listen.
- Gruppen am selben Gerät (GR1 a, Stufe 1), Timer als Zusatz.
- Abgleich über einen Ordner (wie Eulenpfad S1 a), Aufsicht auf mehreren Geräten.
- Konzept „Server für die Schule“ (DS1, Idee Patrik).
- Vorschläge an Patrik: `.gitignore` um `lernsteig-*.json` (EP4), Datenschutz-Wortlaut in `CLAUDE.md` (EP3).

### 3.3 Rücktransfer ins Repo Lernspiele
Pfade sind dieselben wie im Repo Lernspiele. Nach dem Merge des Pull Requests holt Patrik `lernsteig/`, `docs/lernsteig/`,
`docs/gemeinsame_mechaniken.md`, `docs/commons_bibliothek.md` hinüber; Abgleich in [SYNC_lernspiele.md](SYNC_lernspiele.md).
