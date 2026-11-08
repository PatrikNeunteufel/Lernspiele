# Abdeckung der Lehrplan-Stufen — Lernsteig

Erzeugt von `node tools/abdeckung.js` aus `docs/lernsteig/abdeckung.json` und den Aufgaben der Übungen — **nicht von
Hand ändern** (Plan E 1, Entscheid AT1 a). Geprüft von `tools/pruefe_uebungen.js`. Anteile: 1000 Aufgaben je Stufe und Niveau, Startwert 7.

Erfasst: 2 von 27 Übungen, 6 von 80 Stufen.

## Rationale Zahlen rechnen (`rationale-zahlen`, MA.1.A.3)

### MA.1.A.3.g — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Nennerlisten sind am Wortlaut nachgelesen (LERN_Session19), der übrige Text nicht.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Dezimalzahlen bis 5 Wertziffern multiplizieren und prüfen (308 · 52; 12 · 0,3) — *Das Beispiel 308 · 52 des Lehrplans ist ein Ganzzahl-Produkt und deckt mal-ganz; Plan E 1 will Ganzzahl-Produkte nur als Teil mit Dezimalstellen — zu klären* | `mal-dezimal` 25 %, `mal-ganz` 26 % | das Prüfen des Ergebnisses (kein eigener Aufgabentyp) |
| Brüche mit den Nennern 2, 3, 4, 5, 6, 8, 10, 20, 50, 100 am Rechteckmodell multiplizieren | in `brueche` | das Rechteckmodell als Bild (auch in brueche) |
| Brüche mit den Nennern 2, 3, 4, 5, 6, 8, 10, 20, 50, 100, 1'000 als Dezimalzahlen schreiben | `bruch-dezimal` 26 % | die Nenner 3 und 6 (periodische Dezimalzahlen, nach RZ1 a zurückgestellt) |
| wie oft ein Stammbruch in einer ganzen Zahl steckt (2 : ⅕) | `stammbruch` 24 % | — |

### MA.1.A.3.h — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Prozentrechnungen mit dem Rechner | `grundwert` 33 %, `prozentwert` 32 %, `prozentsatz` 35 % | — |
| Erweiterung: natürliche Zahlen in Primfaktoren zerlegen | **offen** | alles |

### MA.1.A.3.i — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Grundoperationen mit rationalen Zahlen | `plus-minus` 26 %, `mal-geteilt` 25 %, `dezimal-negativ` 24 % | — |
| Wurzeln und Potenzen mit dem Rechner (4³ · 4³ = 4096; 4³ + 4³ = 128; ³√8000) | `potenz-wurzel` 25 % | — |
| Erweiterung: Grundoperationen mit gewöhnlichen Brüchen mit Variablen, mit Zahlen belegen (a/b + c/d; a/b − c/d; a/b · c/d; a : c/b : d = a/c · b/d) — *aufgaben.js nimmt die Erweiterung als Annahme aus, mit Patrik abzustimmen* | **offen** | alles |

## Brüche rechnen (`brueche`, MA.1.A.3)

### MA.1.A.3.f — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Dezimalzahlen bis 5 Wertziffern addieren und subtrahieren (Kopf oder eigener Rechenweg) | **offen** | alles |
| Brüche (Nenner bis 100) am Rechteckmodell kürzen, erweitern, addieren, subtrahieren | `kuerzen` 19 %, `erweitern` 24 %, `plus` 25 %, `minus` 11 % | das Rechteckmodell als Bild |
| Grundoperationen mit dem Rechner | **offen** | alles |
| (MA.1.A.1.h) Brüche (Nenner 2, 3, 4, 5, 6, 8, 10, 20, 50, 100, 1000), Dezimal- und Prozentzahlen ineinander umschreiben | `umschreiben` 22 % | — |

### MA.1.A.3.g — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Nennerlisten sind am Wortlaut nachgelesen (LERN_Session19), der übrige Text nicht.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Dezimalzahlen bis 5 Wertziffern multiplizieren und prüfen (308 · 52; 12 · 0,3) | in `rationale-zahlen` | — |
| Brüche mit den Nennern 2, 3, 4, 5, 6, 8, 10, 20, 50, 100 am Rechteckmodell multiplizieren | `mal` 51 %, `ganz-mal` 25 % | das Rechteckmodell als Bild |
| Brüche mit den Nennern 2, 3, 4, 5, 6, 8, 10, 20, 50, 100, 1'000 als Dezimalzahlen schreiben | in `rationale-zahlen` | — |
| wie oft ein Stammbruch in einer ganzen Zahl steckt (2 : ⅕) | `stammbruch` 24 % | — |

### MA.1.A.3.i — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Grundoperationen mit rationalen Zahlen | `plus-minus-negativ` 34 %, `mal-negativ` 32 %, `geteilt` 35 % | — |
| Wurzeln und Potenzen mit dem Rechner (4³ · 4³ = 4096; 4³ + 4³ = 128; ³√8000) | in `rationale-zahlen` | — |
| Erweiterung: Grundoperationen mit gewöhnlichen Brüchen mit Variablen, mit Zahlen belegen (a/b + c/d; a/b − c/d; a/b · c/d; a : c/b : d = a/c · b/d) | in `rationale-zahlen` | — |

## Noch nicht erfasst

`gleichungen`, `groessen`, `prozent-funktionen`, `terme`, `flaechen-volumen`, `zehnerpotenzen`, `ueberschlagen-ordnen`, `daten-rabatt`, `kombinatorik`, `zufall`, `koerper-winkel`, `stoffwechsel`, `atombau`, `kraefte`, `stromkreis`, `aussagen`, `folgen`, `sachsituationen`, `koordinaten`, `lineare-funktionen`, `binome-gleichungen`, `grammatik`, `rechtschreibung`, `englisch-grammatik`, `franzoesisch-grammatik`
