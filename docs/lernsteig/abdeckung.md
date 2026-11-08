# Abdeckung der Lehrplan-Stufen — Lernsteig

Erzeugt von `node tools/abdeckung.js` aus `docs/lernsteig/abdeckung.json` und den Aufgaben der Übungen — **nicht von
Hand ändern** (Plan E 1, Entscheid AT1 a). Geprüft von `tools/pruefe_uebungen.js`. Anteile: 1000 Aufgaben je Stufe und Niveau, Startwert 7.

Erfasst: 27 von 27 Übungen, 80 von 80 Stufen.

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

## Gleichungen lösen (`gleichungen`, MA.1.A.4)

### MA.1.A.4.h — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Gleichungen mit Variablen durch Einsetzen oder Umkehroperation lösen — *nur natürliche Zahlen, ein oder zwei Schritte; Einsetzen nur im Hinweis (bei „Zahl − x“)* | `plus` 20 %, `minus` 19 %, `mal` 20 %, `geteilt` 20 %, `zwei` 20 % | — |
| Punkt vor Strich und Klammerregeln (4 + 8 − 2 · 3 = 6) — *rationale-zahlen führt MA.1.A.4.h im Katalog unter weitere (Klammerregeln), übt in Stufe i aber nur Vorzeichenklammern ohne Punkt vor Strich; die Klammer-Aufgaben dort stehen nur in der Challenge — darum nicht „in“* | **offen** | alles |
| Erweiterung: Teilbarkeitsregeln für 3, 4, 6, 8, 9, 25, 50, Teiler bestimmen — *Teiler zählen übt folgen (Typ teiler), aber in MA.1.C.2.g, nicht in dieser Kompetenz-Stufe* | **offen** | alles |

### MA.1.A.4.j — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Stufe besteht nur aus Erweiterungen (Doku: „nur Erweiterungen“); jeder Teil darum mit „Erweiterung: “.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Erweiterung: lineare Gleichungen mit einer Variablen durch Äquivalenzumformung (5x + 3 = 7) | `einseitig` 33 %, `beidseitig` 35 %, `klammer` 32 % | — |
| Erweiterung: Polynome addieren/subtrahieren (3(a² + 2b) − 2(a² + b) = a² + 4b) | in `terme` | — |
| Erweiterung: ausmultiplizieren und ausklammern — *Ausmultiplizieren von Klammern in Gleichungen auch im Typ klammer dieser Übung* | in `terme` | — |
| Erweiterung: Gleichungen sprachlich deuten und Textgleichungen umsetzen — *Kopfkommentar: „Textgleichungen folgen“ (ohne Entscheid-Kürzel)* | **offen** | alles |
| Erweiterung: Terme vereinfachen (ausklammern, ausmultiplizieren, kürzen, Vorzeichenregeln) | in `terme` | kürzen (auch in terme nicht) |

## Grössen umwandeln (`groessen`, MA.3.A.2)

### MA.3.A.2.h — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Geld, Längen, Gewicht/Masse, Zeit, Volumen [l] schätzen, vergleichen, runden, rechnen, in benachbarte Einheiten umwandeln, zweifach benannt schreiben | `laenge-hoch` 8 %, `laenge-runter` 9 %, `masse-hoch` 9 %, `masse-runter` 8 %, `zeit-hoch` 8 %, `zeit-runter` 8 %, `liter-hoch` 9 %, `liter-runter` 8 %, `zweifach` 34 % | schätzen, vergleichen, runden und rechnen (nur Umwandeln); Geld nur zweifach benannt (Fr. Rp. → Rp.), nicht benachbart umgewandelt; zweifach benannt nur in Richtung „3 m 45 cm = … cm“, nie zweifach benannt schreiben |

### MA.3.A.2.i — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Flächen und Volumen [m³] schätzen und in benachbarte Einheiten umwandeln | `flaeche-hoch` 26 %, `flaeche-runter` 25 %, `volumen-hoch` 25 %, `volumen-runter` 25 % | das Schätzen |
| Grössen absolut und relativ vergleichen (120 Stück, 60 %, ⅗) — *aufgaben.js: „Nicht in dieser Übung (eigene Übungen später)“, ohne Entscheid-Kürzel; Ähnliches übt daten-rabatt in MA.3.A.1.k (andere Kompetenz)* | **offen** | alles |
| Distanzen und Zeiten für Geschwindigkeit messen — *Messen passt nicht in eine Zahlaufgabe; aufgaben.js nimmt „Grössen schätzen und messen“ aus, ohne Entscheid-Kürzel* | **offen** | alles |

### MA.3.A.2.j — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| SI-System nutzen — *vorsatz-umrechnen passt nur ungefähr: es ist Umrechnen zwischen Vorsätzen, l ist keine SI-Einheit* | `vorsatz-umrechnen` 69 % | das SI-System selbst (Basiseinheiten und Grössen); geübt wird nur das Umrechnen mit Vorsätzen bei m, g, l, W, J, Hz |
| Vorsätze Mega, Kilo, Dezi, Centi, Milli den Zehnerpotenzen zuordnen | `vorsatz` 31 % | — |

### MA.3.A.2.k — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| mit zusammengesetzten Masszahlen rechnen, Einheiten umrechnen | `dichte` 26 % | das Rechnen mit zusammengesetzten Masszahlen (dichte rechnet nur g/cm³ ↔ kg/m³ um); weitere zusammengesetzte Einheiten |
| Geschwindigkeiten umwandeln (200 m/10 s = 72 km/h) | `kmh-ms` 23 %, `ms-kmh` 27 %, `weg-zeit` 24 % | — |

## Prozent und Funktionswerte (`prozent-funktionen`, MA.3.A.3)

### MA.3.A.3.g — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Funktionswerte aus Graphen | `graph-proportional` 26 % | nicht proportionale Graphen (in g nur Ursprungsgeraden) |
| indirekte Proportionalität (72 Karten auf x Personen) | `indirekt` 26 % | — |
| Prozent als proportionale Zuordnung (7 von 35; 7 % von 35) | `prozent-von` 27 %, `prozentsatz` 22 % | — |

### MA.3.A.3.h — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| zu einer Funktionsgleichung Wertepaare bestimmen und einzeichnen | `wertepaar` 43 % | das Einzeichnen der Wertepaare |
| Massstab (12-km-Wanderung auf der Karte) | `massstab-karte` 26 %, `massstab-wirklich` 32 % | — |

### MA.3.A.3.i — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Funktionswert aus Tabelle, Graph und Gleichung (y = 2x + 1, x = 7 → y = 15), Wertepaare einzeichnen | `tabelle` 20 %, `graph` 20 %, `gleichung` 20 % | das Einzeichnen der Wertepaare |
| Rechner/Tabellenkalkulation — *der Rechner ist in Stufe i zugelassen (Katalog rechner i: mit), die Tabellenkalkulation wird nicht geübt* | **offen** | alles |
| Sachaufgaben mit Prozent (Steigung, Zins) | `zins` 19 %, `steigung` 21 % | — |

## Terme vereinfachen (`terme`, MA.1.A.4)

### MA.1.A.4.i — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Produkt gleicher Faktoren als Potenz und umgekehrt (15 · 15 · 15 = 15³) | `potenz` 50 % | „und umgekehrt“: Potenz als Produkt schreiben (Kopfkommentar: folgt) |
| Distributivgesetz (a(b + c) = ab + ac) — *nur ausmultiplizieren mit einem Faktor vor einer Klammer mit zwei Gliedern* | `distributiv` 50 % | — |
| Ergebnisse sinnvoll runden | **offen** | alles |
| Erweiterung: Notation algebraischer Terme (abc = a · b · c, aber 789 ≠ 7 · 8 · 9) — *Kopfkommentar: die Notation „folgt“ (ohne Entscheid-Kürzel)* | **offen** | alles |

### MA.1.A.4.j — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Stufe besteht nur aus Erweiterungen (Doku: „nur Erweiterungen“); jeder Teil darum mit „Erweiterung: “.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Erweiterung: lineare Gleichungen mit einer Variablen durch Äquivalenzumformung (5x + 3 = 7) | in `gleichungen` | — |
| Erweiterung: Polynome addieren/subtrahieren (3(a² + 2b) − 2(a² + b) = a² + 4b) | `polynome` 38 % | — |
| Erweiterung: ausmultiplizieren und ausklammern — *ausklammern nur einer Zahl aus zwei Gliedern (6a + 9 = 3(2a + 3)); ausmultiplizieren steckt in polynome und vorzeichen* | `ausklammern` 25 % | — |
| Erweiterung: Gleichungen sprachlich deuten und Textgleichungen umsetzen | **offen** | alles |
| Erweiterung: Terme vereinfachen (ausklammern, ausmultiplizieren, kürzen, Vorzeichenregeln) | `vorzeichen` 37 % | kürzen |

### MA.1.A.4.k — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Terme mit Variablen addieren und subtrahieren (a + 2a + b + 3b + ¼ + ⅜ = 3a + 4b + ⅝) | `zusammenfassen` 49 %, `zusammenfassen-bruch` 51 % | — |

## Längen, Flächen, Volumen berechnen (`flaechen-volumen`, MA.2.A.3)

### MA.2.A.3.f — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Volumen von Quadern | `quader-volumen` 66 %, `quader-hoehe` 34 % | — |
| Fläche nicht rechteckiger Figuren im Raster annähern — *aufgaben.js: „Nicht in dieser Übung“, ohne Entscheid-Kürzel* | **offen** | alles |

### MA.2.A.3.g — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Vielecke und gerade Prismen zerlegen | **offen** | alles |
| Flächeninhalt von Drei- und Vierecken | `dreieck` 19 %, `parallelogramm` 21 %, `trapez` 19 % | weitere Vierecke (Raute, Drachenviereck); Grundseite und Höhe sind immer gegeben |
| Kanten, Flächen, Volumen von Quadern | `quader-kanten` 21 %, `quader-oberflaeche` 20 % | das Volumen (in Stufe g kein Aufgabentyp; geübt in Stufe f mit quader-volumen) |

### MA.2.A.3.h — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Satz des Pythagoras für Längen und Flächen | `hypotenuse` 26 %, `kathete` 23 %, `diagonale` 26 %, `hypotenuse-gerundet` 26 % | Flächen (gefragt sind nur Längen) |
| Formeln und Tabellenkalkulation — *aufgaben.js nimmt die Tabellenkalkulation aus („Nicht in dieser Übung“), ohne Entscheid-Kürzel* | **offen** | alles |

### MA.2.A.3.i — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Umfang und Fläche des Kreises | `kreis-umfang` 26 %, `kreis-flaeche` 24 % | — |
| Kanten, Flächen, Volumen von geraden Prismen und Zylindern | `prisma-volumen` 26 %, `zylinder-volumen` 24 % | Kanten und Oberflächen von Prismen und Zylindern (Zylinder-Oberfläche nur in der Challenge); Prismen nur mit dreieckiger Grundfläche |
| Volumen beliebiger Körper schätzen — *aufgaben.js: „Nicht in dieser Übung“, ohne Entscheid-Kürzel* | **offen** | alles |

## Grosse Zahlen und Zehnerpotenzen (`zehnerpotenzen`, MA.1.A.1)

### MA.1.A.1.i — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Begriffe Term, Variable, Unbekannte, hoch, Potenz, Zehnerpotenz, Vorzeichen, positive/negative Zahlen, (Quadrat-)Wurzel — *passt nur ungefähr: der Typ übt die Zehnerpotenz als Zahl, keinen Begriff* | `zehnerpotenz` 25 % | die Begriffe selbst und alle ausser hoch/Zehnerpotenz: zehnerpotenz rechnet nur 10ⁿ aus (n = 2 bis 9) |
| Erweiterung: Basis, Exponent — *Katalog ohneE: ["i"] (Begriffe Basis, Exponent nicht abgefragt), ohne Entscheid-Kürzel* | **offen** | alles |
| Symbole √, ≤, ≥ auch am Rechner | **offen** | alles |
| Zahlen bis 1 Milliarde lesen und schreiben | `wort-zahl` 50 %, `zahl-stellen` 25 % | Zahlen in Worten schreiben (Richtung Zahl → Zahlwort) |

### MA.1.A.1.j — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| wissenschaftliche Schreibweise mit positiven Exponenten lesen/schreiben (1.32 · 10⁸ = 132 000 000) | `exponent-positiv` 49 %, `ausschreiben-positiv` 51 % | — |
| Potenzen mit rationaler Basis und natürlichem Exponenten lesen/schreiben | **offen** | alles |

### MA.1.A.1.k — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Begriffe natürliche, ganze, rationale Zahlen, Kehrwert, 3. Wurzel | **offen** | alles |
| wissenschaftliche Schreibweise auch mit negativen Exponenten | `exponent-negativ` 52 %, `ausschreiben-negativ` 48 % | — |

## Überschlagen und Ordnen (`ueberschlagen-ordnen`, MA.1.A.2)

### MA.1.A.2.h — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Summen und Differenzen mit Dezimalzahlen überschlagen | `summe` 37 %, `differenz` 29 % | den Überschlag selbst bilden: gewählt wird unter vier Antworten, die sich um Zehnerpotenzen unterscheiden (nur die Grössenordnung) |
| Ergebnisse von Prozentrechnungen überschlagen (263 von 830 ≈ 30 %) | `prozent` 34 % | — |

### MA.1.A.2.i — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Stufe besteht nur aus der Erweiterung.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Erweiterung: Produkte und Quotienten von Dezimalzahlen überschlagen (0.382 : 42.8 → 0.4 : 40 = 0.01) | `produkt` 51 %, `quotient` 49 % | den Überschlag selbst bilden: gewählt wird unter vier Antworten, die sich um Zehnerpotenzen unterscheiden (nur die Grössenordnung) |

### MA.1.A.2.j — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| positive und negative rationale Zahlen auf dem Zahlenstrahl ordnen | `groesste` 35 %, `kleinste` 33 %, `naechste-null` 32 % | der Zahlenstrahl als Bild und das Ordnen aller Zahlen (gewählt wird nur die grösste, kleinste oder nächste bei 0) |

## Mittelwert, Häufigkeit, Rabatt (`daten-rabatt`, MA.3.A.1)

### MA.3.A.1.j — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Koordinatensystem, Währung, arithmetisches Mittel — *Währung übt der Typ waehrung, eingetragen beim Teil „Geld CHF, €, $“* | `mittelwert` 67 % | das Koordinatensystem |
| Erweiterung: indirekte Proportionalität — *Katalog ohneE j: „übt Prozent und Funktionswerte“ (prozent-funktionen, Typ indirekt) — dort aber MA.3.A.3.g, nicht dieselbe Kompetenz-Stufe, daher nicht als in eingetragen* | **offen** | alles |
| Flächenmasse km², ha, a, m² … mm² — *Umwandeln der Flächenmasse übt groessen in MA.3.A.2.i (andere Kompetenz)* | **offen** | alles |
| Raummasse km³ … mm³ — *groessen übt in MA.3.A.2.i m³ … mm³ (ohne km³), andere Kompetenz* | **offen** | alles |
| Geld CHF, €, $ — *Wechselkurse erfunden und in der Aufgabe angegeben (Annahme in aufgaben.js)* | `waehrung` 33 % | — |

### MA.3.A.1.k — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| absolute und relative Häufigkeit, x-/y-Koordinate, x-/y-Achse, Einheitsstrecke, Wahrscheinlichkeit | `relativ-prozent` 46 %, `absolut` 41 %, `wahrscheinlichkeit` 13 % | x-/y-Koordinate, x-/y-Achse, Einheitsstrecke |
| Geschwindigkeit km/h, m/s, kB/s, dpi — *km/h und m/s übt groessen in MA.3.A.2.k (andere Kompetenz); kB/s und dpi nirgends* | **offen** | alles |

### MA.3.A.1.l — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Steigung in %, Zins, Zinssatz, Kapital, Rabatt, Brutto, Netto — *brutto und netto rechnen über einen Zuschlag auf den Nettopreis („Nettopreis … dazu 5 % Zuschlag“), nicht über einen Rabatt (Brutto vor, Netto nach Abzug); welche Lesart der Lehrplan meint, ist am Wortlaut zu klären* | `rabatt` 23 %, `rabatt-betrag` 26 %, `brutto` 26 %, `netto` 25 % | Steigung in %, Zins, Zinssatz, Kapital (aufgaben.js: übt „Prozent und Funktionswerte“, dort MA.3.A.3.i, andere Kompetenz) |

## Möglichkeiten zählen (`kombinatorik`, MA.3.B.2)

### MA.3.B.2.d — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| alle Möglichkeiten systematisch aufschreiben, mit und ohne Wiederholung (Ziffern 1, 2, 3) | `ziffern-ohne` 16 %, `ziffern-mit` 14 %, `wort` 28 %, `kleider` 29 %, `schloss` 13 % | das systematische Aufschreiben (gefragt ist nur die Anzahl) |

### MA.3.B.2.f — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Wahrscheinlichkeiten und statistische Angaben prüfen und begründen (zweimal Kopf = 0.25) | `muenzen` 9 %, `muenzen3` 11 %, `wuerfel-summe` 20 %, `wuerfel-gleich` 10 %, `muenze-wuerfel` 11 %, `rad` 21 %, `urne` 19 % | prüfen und begründen (die Wahrscheinlichkeit wird berechnet, keine gegebene Angabe geprüft); statistische Angaben |

### MA.3.B.2.g — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| kombinatorische Probleme vergleichen, Analogien finden (Handshakes bei 5 Personen) | `handshake` 17 %, `turnier-hin` 18 %, `turnier-rueck` 16 %, `strecken` 17 %, `diagonalen` 17 %, `teams` 15 % | das Vergleichen (je Aufgabe ein Problem; die Analogie liegt nur zwischen den Aufgaben, sie wird nicht verlangt) |

## Daten und Zufall (`zufall`, MA.3.C.1)

### MA.3.C.1.f — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Datensätze auswerten, Mittelwert, Maximum, Minimum | `mittelwert` 66 %, `spanne` 34 % | Maximum und Minimum einzeln (nur ihr Unterschied, spanne) |

### MA.3.C.1.h — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| mehrstufige Zufallsexperimente, Baumdiagramm (dreimal Münze) | `drei-muenzen` 40 %, `urne-mit` 41 %, `pfade` 19 % | das Baumdiagramm als Bild (gefragt sind nur Anzahl Pfade und Wahrscheinlichkeiten) |

### MA.3.C.1.i — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Erweiterung: Wahrscheinlichkeiten ermitteln (zweimal gleiche Farbe ziehen) | `urne-ohne` 51 % | — |
| Wahrscheinlichkeit aus relativer Häufigkeit (88 von 2750 Zügen verspätet) — *steht in der Doku noch im kursiven Erweiterungs-Abschnitt; ob auch dieser Teil Erweiterung ist, am Wortlaut zu prüfen. erwartet passt nur ungefähr: es rechnet umgekehrt aus der Wahrscheinlichkeit die erwartete Häufigkeit („Wie oft erwartest du …“), ein eigener Lehrplantext dafür fehlt* | `relativ` 24 %, `erwartet` 25 % | — |

## Körper, Winkel, Ähnlichkeit (`koerper-winkel`, MA.2.A.3)

### MA.2.A.3.j — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Pyramide, Kegel, Kugel | `pyramide` 12 %, `kegel` 13 %, `kugel-volumen` 13 %, `kugel-oberflaeche` 12 % | Oberflächen von Pyramide und Kegel (nur Volumen); Pyramiden nur mit quadratischer Grundfläche (Annahme in aufgaben.js) |
| Winkel über Winkelsummen, Satz des Thales, Ähnlichkeit, Kongruenz | `dreieck` 8 %, `viereck` 8 %, `summe` 9 %, `regelmaessig` 8 %, `thales` 9 %, `gleichschenklig` 8 % | Ähnlichkeit und Kongruenz (in j keine Aufgabe; ähnliche Figuren übt Stufe k) |

### MA.2.A.3.k — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| ähnliche Figuren und Körper: Längen, Flächen, Volumen | `seite` 33 %, `flaeche` 17 %, `volumen` 18 %, `faktor-flaeche` 16 %, `faktor-volumen` 16 % | — |

## Stoffwechsel: Organe und Vorgänge (`stoffwechsel`, NT.7.2)

### NT.7.2.a — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Verbindlichen Inhalte sind wörtlich übernommen (nt_zyklus3.md:22; aufgaben.js nennt quellen_nt/NT7.2.html), der übrige Text sinngemäss (nt_zyklus3.md:23).

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Organe als Teile eines Systems mit den vier zentralen Stoffwechselvorgängen Aufnahme, Transport, Umwandlung und Abgabe erkennen. VI: Aufnahme: Lunge, Verdauungsorgane; Transport: Blut, Blutkreislauf, Herz; Umwandlung: Leber, Fettgewebe, Knochen, Muskeln, Hirn; Abgabe: Niere, Lunge Verdauungsorgane, Haut — *Die VI-Liste nicht an „;“ zerlegt: Ihre vier Glieder sind die eine Zuordnung Organ ↔ Vorgang, die beide Typen über alle vier Vorgänge abfragen* | `organ` 48 %, `vorgang` 52 % | — |

## Atombau und Periodensystem (`atombau`, NT.3.2)

### NT.3.2.a — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Verbindlichen Inhalte sind wörtlich übernommen (nt_zyklus3.md:22), der übrige Text sinngemäss.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| in der Entstehungsgeschichte des Periodensystems der Elemente PSE die Bedeutung des systematischen Beschreibens und Ordnens erkennen | **offen** | alles |
| Informationen zu den Elementen aus dem PSE herauslesen. VI: Element Metalle, Nichtmetalle, Edelgase | `art` 50 %, `welches` 50 % | andere Informationen aus dem PSE als die Art (Metall, Nichtmetall, Edelgas); nur die Elemente 1 bis 20 |

### NT.3.2.c — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Verbindlichen Inhalte sind wörtlich übernommen (nt_zyklus3.md:22), der übrige Text sinngemäss.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| an der Geschichte des Kern-Hülle-Modells die Grenzen von Modellen erkennen | **offen** | alles |
| Atome mit dem Kern-Hülle-Modell darstellen, Protonen und Neutronen als Kernbausteine benennen. VI: Masse-Ladungsmodell nach Thomson, Kern-Hülle-Modell nach Rutherford — *VI an „.“ angehängt, weil die Zerlegung nur an „;“ trennt; elektronen fragt die Hülle eines ungeladenen Atoms* | `neutronen` 41 %, `elektronen` 20 % | das Darstellen im Modell (die Übung fragt nur Anzahlen ab); Masse-Ladungsmodell nach Thomson und Kern-Hülle-Modell nach Rutherford |
| PSE: Ordnungszahl, Atommasse, Hauptgruppen — *protonen: die Ordnungszahl steht nicht in der Aufgabe, sie ist aus dem PSE zu lesen* | `protonen` 19 % | die Atommasse (die Übung nimmt nach ihrer Annahme die ganzzahlige Massenzahl und nennt sie in der Aufgabe) und die Hauptgruppen (in c nicht gefragt, erst in d) |
| Isotop | `isotop` 20 % | — |

### NT.3.2.d — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Verbindlichen Inhalte sind wörtlich übernommen (nt_zyklus3.md:22), der übrige Text sinngemäss.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Zusammenhänge zwischen Schalenmodell und PSE aufzeigen — *Schalenbesetzung nur nach der Annahme 2, 8, 8, 2 für die Elemente 1 bis 20* | `aussen` 51 %, `schalen` 26 %, `gruppe` 23 % | — |
| Stoffumwandlungen als Veränderung der Anordnung von Teilchen und der chemischen Bindungen erklären. VI: Schalenmodell — *Die VI „Schalenmodell“ hängt nur durch die Zerlegung an „;“ an diesem Teil; inhaltlich gehört sie zum ersten Teil und ist dort geübt* | **offen** | alles |
| Wertigkeit, Donator-Akzeptor-Konzept bei Redoxreaktionen, Bindungstypen, Edelgasregel — *VI. Die Edelgasregel (Ionenladung, Elektronen des Ions) übt nur die Challenge (ladung, ionen-elektronen, edelgas-gleich), obwohl der Stufentitel von d sie nennt* | **offen** | alles |

## Kräfte und einfache Maschinen (`kraefte`, NT.5.1)

### NT.5.1.a — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die „Lesart“ zu NT.5.1 (nt_zyklus3.md:268) ist eine Einschätzung, kein Wortlaut (nt_zyklus3.md:28–29).

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| gleichförmige Bewegungen in Diagrammen erkennen und darstellen — *Geschwindigkeit als Rechengrösse nennt die Lehrplanseite nicht (nt_zyklus3.md:272); v = s : t ist Annahme der Übung* | `v-diagramm` 68 %, `weg-nach` 32 % | gleichförmige Bewegungen in Diagrammen erkennen und darstellen: Das Diagramm ist immer eine Ursprungsgerade und die Aufgabe sagt selbst, dass die Bewegung gleichförmig ist; gefragt sind nur Geschwindigkeit und Weg, nichts wird erkannt oder gezeichnet |

### NT.5.1.c — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Verbindlichen Inhalte sind wörtlich übernommen (nt_zyklus3.md:22), der übrige Text sinngemäss.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| experimentell zeigen und in Diagrammen darstellen, dass die Gewichtskraft proportional zur Masse ist. VI: Umgang mit einem Kraftmesser | `kraft-kg` 34 %, `kraft-g` 33 %, `masse` 33 % | das Experiment, das Diagramm und der Umgang mit dem Kraftmesser (kraft-g und masse nennen ihn nur im Text); geübt wird das Rechnen mit F = m · g, g = 10 N/kg (Annahme) |

### NT.5.1.d — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Verbindlichen Inhalte sind wörtlich übernommen (nt_zyklus3.md:22), der übrige Text sinngemäss.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Kräfte einordnen und darstellen | **offen** | alles |
| experimentell zeigen, dass einfache Maschinen die benötigten Kräfte verringern (Hebel, schiefe Ebene, Flaschenzug, Ketten-/Zahnradgetriebe). VI: Kräftediagramm — *VI an „.“ angehängt, weil die Zerlegung nur an „;“ trennt. Beispiele ohne Wellräder und Keile nach KR1 a — beide nennt der Lehrplan nicht* | `maschine` 100 % | dass die Maschinen die Kraft verringern (gefragt ist nur, welche Maschine ein Beispiel zeigt), das Experiment und das Kräftediagramm |

### NT.5.1.e — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Verbindlichen Inhalte sind wörtlich übernommen (nt_zyklus3.md:22), der übrige Text sinngemäss.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| begründen, dass einfache Maschinen die Kraft verringern, die Strecke aber verlängern (Hebel, schiefe Ebene, Flaschenzug). VI: Goldene Regel der Mechanik — *Formeln (Hebelgesetz, Kraft · Weg bleibt gleich) sind Annahme der Übung, die Lehrplanseite nennt keine (nt_zyklus3.md:25–27)* | `hebel` 26 %, `flaschenzug-kraft` 25 %, `flaschenzug-weg` 25 %, `schiefe-ebene` 24 % | das Begründen (die Übung rechnet nur Kraft oder Seilweg aus); die längere Strecke rechnet nur flaschenzug-weg |

## Stromkreis und Ohmsches Gesetz (`stromkreis`, NT.5.2)

### NT.5.2.b — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Veränderungen in Stromkreisen mit Messgeräten untersuchen, einfache Regeln aufstellen (mehr/weniger Lämpchen, Serie-/Parallelschaltung) — *parallel-zweig vergleicht Zweig- und Batteriestrom und begründet im Lösungsweg mit der Knotenregel (NT.5.2.d); als Regel zur Parallelschaltung hier gezählt* | `parallel-dazu` 23 %, `serie-dazu` 22 %, `serie-kabel` 15 %, `serie-weg` 17 %, `parallel-weg` 15 %, `parallel-zweig` 8 % | das Untersuchen mit Messgeräten und das Aufstellen der Regeln (die Übung fragt die Regeln ab; der Strommesser steht nur im Text) |

### NT.5.2.c — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Verbindlichen Inhalte sind wörtlich übernommen (nt_zyklus3.md:22), der übrige Text sinngemäss.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| die massgeblichen Grössen eines einfachen Stromkreises in Beziehung setzen, Gesetzmässigkeiten experimentell herleiten. VI: Stromstärke, Spannung, Widerstand, Ohm'sches Gesetz — *Formel U = R · I und Einheiten sind Annahme der Übung, die Lehrplanseite nennt keine (nt_zyklus3.md:25–27)* | `ohm-U` 33 %, `ohm-I` 33 %, `ohm-R` 34 % | das experimentelle Herleiten der Gesetzmässigkeiten |

### NT.5.2.d — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

Die Verbindlichen Inhalte sind wörtlich übernommen (nt_zyklus3.md:22), der übrige Text sinngemäss.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| die Grössen eines verzweigten Stromkreises in Beziehung setzen, Gesetzmässigkeiten herleiten, Versuchsprotokolle anfertigen. VI: Knoten- und Maschenregel — *masche und serie-ohm rechnen an einer unverzweigten Serienschaltung; serie-ohm (Ohm'sches Gesetz mit R1 + R2) passt nur ungefähr: Die Summe der Widerstände folgt aus der Maschenregel, ein verzweigter Stromkreis ist es nicht* | `knoten` 24 %, `masche` 22 %, `knoten-fehlt` 25 %, `parallel-ohm` 17 %, `serie-ohm` 13 % | das Herleiten der Gesetzmässigkeiten und das Anfertigen von Versuchsprotokollen |

## Aussagen prüfen (`aussagen`, MA.1.B.2)

### MA.1.B.2.h — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Aussagen zu arithmetischen Gesetzmässigkeiten begründen oder widerlegen (gerade + ungerade = ungerade; Produkt vier aufeinanderfolgender Zahlen durch 24 teilbar) — *Die Typen sind nach der Frageform geschnitten, nicht nach Inhalt* | `wahr` 66 %, `falsch` 34 % | das Begründen oder Widerlegen selbst: gewählt wird die eine wahre (wahr) oder die eine falsche Aussage (falsch) |
| Nachkommastellen bei Produkten und Quotienten erforschen — *Kopfkommentar: „Nicht in dieser Übung“ (ohne Entscheid-Kürzel)* | **offen** | alles |

### MA.1.B.2.j — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| algebraische Aussagen durch Einsetzen prüfen (a³ + 5a durch 6 teilbar; a²ᵇ = (a²)ᵇ, formel8; 2⁶ = (2²)³ = 4³) — *Auswahl unter vier Aussagen; die Typen sind nach der Frageform geschnitten, nicht nach Inhalt* | `wahr` 66 %, `falsch` 34 % | — |

### MA.1.B.2.k — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| durch Verallgemeinern begründen (a² − 1 = (a − 1)(a + 1)) — *Aussagen wie a² − 1 = (a − 1)(a + 1) stehen in der Liste der Stufe k und kommen in wahr/falsch vor (Teil 2), verlangt wird aber nur das Auswählen, kein Begründen* | **offen** | alles |
| Term- und Äquivalenzumformungen prüfen | `wahr` 67 %, `falsch` 33 % | Äquivalenzumformungen (Gleichungen): die Liste enthält nur Termumformungen und Teilbarkeitsaussagen |

## Folgen und Muster (`folgen`, MA.1.C.2)

### MA.1.C.2.g — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Gesetzmässigkeiten natürlicher Zahlen an Beispielen (Quadratzahlen haben ungerade viele Teiler) | `teiler` 30 % | die Gesetzmässigkeit selbst: teiler fragt nur die Anzahl Teiler einer Zahl (Quadratzahl oder beliebig) |
| Brüche (Nenner bis 10) darstellen und vergleichen | **offen** | alles |
| Zahlenfolgen mit positiven rationalen Zahlen | `folge-dezimal` 70 % | Folgen mit Brüchen und andere als arithmetische Folgen (nur gleicher Abstand, Dezimalzahlen) |

### MA.1.C.2.h — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Zahlenrätsel mathematisieren und erfinden | `raetsel` 49 % | Zahlenrätsel erfinden |
| Figurenfolgen numerisch beschreiben (Würfeltürme) | `figuren-linear` 35 %, `figuren-quadrat` 16 % | die Figuren als Bild (nur Wertetabelle, Kopfkommentar: Bilder folgen) |

### MA.1.C.2.i — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Terme und Figuren verbinden (n(n + 1) als Rechteck; 1 + 3 + 5 + 7 = 4 · 4) | `gerade-summe` 34 %, `ungerade-summe` 33 %, `rechteckzahl` 33 % | die Figur (Rechteck, Quadrat) als Bild; rechteckzahl nennt die Regel n · (n + 1) im Aufgabentext, gerechnet wird nur ein Wert |
| Terme zu Längen, Flächen, Volumen bilden und deuten | **offen** | alles |
| Terme mit Text, Symbolen, Skizzen veranschaulichen | **offen** | alles |
| Gesetzmässigkeiten mit Buchstabentermen verallgemeinern — *Die Summen-Typen (Teil 1) wenden eine Verallgemeinerung an, verlangen sie aber nicht als Buchstabenterm* | **offen** | alles |
| Erweiterung: Strukturen algebraisch formulieren (a(a + 1)(a + 2) · ⅙ ganzzahlig) — *Katalog ohneE: ["i"] (wie PA), ohne Entscheid-Kürzel im Kopfkommentar* | **offen** | alles |

### MA.1.C.2.j — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Terme geometrisch deuten (a² · b als Quader, a · b als Rechteck) | **offen** | alles |
| lineare Figurenfolgen als Term (n Dreiecke aus Hölzchen: 2n + 1) | `term-linear` 100 % | die Figuren als Bild (beschrieben in Worten und als Wertetabelle) |

## Sachsituationen (`sachsituationen`, MA.3.C.2)

### MA.3.C.2.f — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| proportionale und lineare Zusammenhänge erkennen, Taxipreis — *Die Erweiterung in Klammern (indirekt proportionale) steht als eigener Teil* | `dreisatz` 48 %, `taxi` 52 % | das Erkennen (die Art des Zusammenhangs ist in der Aufgabe vorgegeben) |
| Erweiterung: indirekt proportionale — *Katalog ohneE f: „noch nicht in der Übung“* | **offen** | alles |
| Wertepaare und Graphen darstellen | **offen** | alles |
| Alltagssituationen in mathematische Sprache übersetzen, Grössen und Einheiten wählen — *dreisatz und taxi übersetzen Text in eine Rechnung (eingetragen beim ersten Teil); Grössen und Einheiten wählen wird nicht geübt, die Einheit steht hinter dem Feld* | **offen** | alles |

### MA.3.C.2.g — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Abhängigkeit zweier Grössen als Graph, Graphen deuten (Weg-Zeit-Diagramm 400-m-Lauf) | `weg-zeit` 50 % | die Abhängigkeit selbst als Graph darstellen (nur Ablesen aus einem gegebenen Graphen) |
| Erweiterung: passende Skalierung wählen — *Katalog ohneE g: „noch nicht in der Übung“* | **offen** | alles |
| lineare Zusammenhänge als Term (Wechselkurse) — *steht in der Doku im kursiven Erweiterungs-Abschnitt; aufgaben.js: „hier nur in der Challenge“* | **offen** | alles |
| (MA.3.C.2.f) proportionale und lineare Zusammenhänge erkennen, Taxipreis — *Taxitarif rückwärts (Kilometer aus dem Preis) gehört zum Taxipreis der Stufe f; das Rückwärtsrechnen steht dort nicht ausdrücklich. Die Erweiterung in Klammern (indirekt proportionale) steht als eigener Teil der Stufe f* | `taxi-rueckwaerts` 50 % | — |

### MA.3.C.2.h — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Wertetabellen, Diagramme, Texte, Terme, Graphen einander zuordnen | `tabelle-term` 51 %, `text-term` 49 % | Diagramme und Graphen (nur Tabelle → Term und Text → Term) |
| Sachsituationen funktional, statistisch, probabilistisch bearbeiten und entscheiden | **offen** | alles |

## Koordinaten (`koordinaten`, MA.2.C.4)

### MA.2.C.4.h — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Lagebeziehungen massstabgetreu im Koordinatensystem (Pausenplatz) | `massstab` 100 % | Lagebeziehungen eintragen oder zeichnen; massstab liest nur einen achsenparallelen Abstand ab und rechnet ihn mit dem Massstab um |

### MA.2.C.4.i — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Figuren im kartesischen Koordinatensystem, auch negativ und nicht ganzzahlig | `rechteck` 32 %, `dreieck` 29 % | nicht ganzzahlige Koordinaten (Kopfkommentar: folgen); Figuren zeichnen |
| Abstände und Flächen berechnen — *Flächen berechnen die Typen rechteck und dreieck (Teil 1); jeder Typ steht nur bei einem Teil* | `abstand` 26 %, `abstand-schraeg` 12 % | — |

### MA.2.C.4.j — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| geometrische Abbildungen im Koordinatensystem (Spiegelung an x = 2) | `spiegel-x` 32 %, `spiegel-y` 29 %, `ursprung` 39 % | andere Abbildungen (Verschieben, Drehen) und das Abbilden ganzer Figuren; gefragt ist eine Koordinate eines gespiegelten Punkts |

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

## Lineare Funktionen (`lineare-funktionen`, MA.3.A.3)

### MA.3.A.3.j — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Schnittpunkt zweier Geraden algebraisch und graphisch | `schnittpunkt` 100 % | graphisch (die Aufgabe gibt nur die Gleichungen, kein Graph) |

### MA.3.A.3.k — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| lineare Funktionen: Graph zeichnen, Steigung, y-Achsenabschnitt, Nullstelle | `steigung-graph` 25 %, `abschnitt-graph` 24 %, `steigung-punkte` 26 %, `nullstelle` 26 % | den Graphen zeichnen (aufgaben.js: „Zeichnen folgt“) |

## Binome und Gleichungen (`binome-gleichungen`, MA.1.A.4)

### MA.1.A.4.l — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| quadratische Gleichungen durch Faktorzerlegung (x² − 4 = 0) | `quadratisch-differenz` 20 %, `quadratisch-faktoren` 20 % | Faktorzerlegung eines Trinoms (x² + px + q = 0): quadratisch-faktoren gibt die Faktoren schon vor, das Zerlegen steht nur in der Challenge |
| binomische Formeln (4a² + 12ab² + 9b⁴ = (2a + 3b²)², formel4) | `binom` 40 % | die Richtung des Beispiels (Summe als Quadrat eines Binoms schreiben) und Binome mit Koeffizienten oder Potenzen (2a + 3b²); binom multipliziert nur (x ± b)² und (x + b)(x − b) aus |
| Potenzregel aˣ · aʸ = a⁽ˣ⁺ʸ⁾ (formel1) und Potenz vor Punkt vor Strich | `potenzregel` 21 % | Potenz vor Punkt vor Strich |

### MA.1.A.4.m — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Bruchterme mit Binomen umformen — *Kopfkommentar: „Nicht in dieser Übung“ (ohne Entscheid-Kürzel)* | **offen** | alles |
| Rechengesetze für Potenzen, Wurzeln, wissenschaftliche Schreibweise | `potenzgesetz` 25 % | Wurzeln und wissenschaftliche Schreibweise; von den Potenzgesetzen nur (aˣ)ʸ und aˣ : aʸ |
| Bruchgleichungen mit der Unbekannten im Nenner (3/x + 2 = 4/x + 3, formel2) und Gleichungen mit Parameter (ax + a = 7) | `bruchgleichung` 26 % | Gleichungen mit Parameter (ax + a = 7; Kopfkommentar: „Nicht in dieser Übung“, ohne Entscheid-Kürzel) |
| lineare Gleichungssysteme mit 2 Unbekannten | `system` 49 % | — |

## Grammatik: Fälle, Wortarten, Formen (`grammatik`, D.5.D.1)

### D.5.D.1.e — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Präpositionen (reduzierte Liste) — *Die Sätze enthalten Fälle nach Präpositionen, die Präposition selbst wird nicht benannt* | **offen** | alles |
| vier Fälle in typischen Fällen mit der Ersatzprobe | `fall` 100 % | — |
| Morpheme zerlegen | **offen** | alles |
| Verbenfächer, Nominal- und Präpositionalgruppe | **offen** | alles |

### D.5.D.1.f — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Wortarten: Nomen, Verb, Adjektiv formal, Pronomen mit der umfassenden Liste, Rest als Partikel | `wortart` 60 % | — |
| Präposition und Konjunktion — *grammatik.js zählt Präpositionen und Konjunktionen zu den Partikeln (grammatik.js:8); als eigene Begriffe nicht gefragt* | **offen** | alles |
| Präsens, Präteritum, Perfekt, Futur — *zeitform bietet dazu Plusquamperfekt an (D.5.D.1.d: erste Erfahrungen mit Futur, Plusquamperfekt), „Futur“ meint Futur I* | `zeitform` 40 % | — |
| Satzglieder mit dem Verbenfächer | **offen** | alles |
| Begriffe Subjekt und Objekt — *Subjekt und Objekte bestimmt erst Stufe g (satzglied)* | **offen** | alles |

### D.5.D.1.g — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Indikativ, Imperativ, Konjunktiv I und II, Aktiv und Passiv | `modus` 36 %, `genus` 29 % | — |
| Subjekt und Objekt unterscheiden | `satzglied` 34 % | — |
| einfache und zusammengesetzte Sätze | **offen** | alles |

## Rechtschreibung (`rechtschreibung`, D.5.E.1)

### D.5.E.1.d — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Morpheme für die Stammregel — *Die Stammregel bei e/ä übt eae (im dritten Teil); Morpheme als solche nicht* | **offen** | alles |
| Wörterbuch bei regelmässiger Laut-Buchstaben-Zuordnung — *Kopfkommentar aufgaben.js:7 nimmt das Wörterbuch aus, ohne Entscheid-Kürzel* | **offen** | alles |
| ie-Regel, f/v, e/ä (Stammregel), Doppelkonsonanten (ck, tz), Grossschreibung konkreter und gebräuchlicher abstrakter Nomen, Trennregel, Komma bei Aufzählungen und zwischen übersichtlichen Verbgruppen | `cktz` 21 %, `ie` 18 %, `eae` 18 %, `gross` 15 %, `fv` 17 %, `komma-aufzaehlung` 12 % | die Trennregel (Kopfkommentar aufgaben.js:7, ohne Entscheid-Kürzel) und das Komma zwischen übersichtlichen Verbgruppen |

### D.5.E.1.e — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Morpheme für die Gross- und Kleinschreibung nutzen (Frei-heit) | `nachmorphem-gross` 57 %, `nachmorphem-klein` 43 % | — |

### D.5.E.1.f — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| nominalisierte Verben nach Präposition + Artikel (beim Essen) — *verb-klein ist das Gegenstück (Infinitiv nach Modalverb oder „gehen“ bleibt klein)* | `verb-nominalisiert` 39 %, `verb-klein` 25 % | — |
| Höflichkeitspronomen „Sie“ in Briefen — *hoeflich in Briefanreden („Sehr geehrte …“), nicht-hoeflich als Gegenstück ausserhalb von Briefen* | `hoeflich` 22 %, `nicht-hoeflich` 14 % | — |

### D.5.E.1.g — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Wörterbuch auch bei nicht eindeutiger Laut-Buchstaben-Zuordnung — *Kopfkommentar aufgaben.js:7 nimmt das Wörterbuch aus, ohne Entscheid-Kürzel* | **offen** | alles |
| nominalisierte Adjektive nach Pronomen (alles Gute, etwas Schönes) | `adjektiv-nominalisiert` 38 % | — |
| Komma bei Infinitivgruppen, Einschüben, Relativsätzen — *komma-infinitiv nur mit um, ohne, statt, anstatt* | `komma-relativ` 24 %, `komma-infinitiv` 22 %, `komma-einschub` 16 % | — |

## English grammar (`englisch-grammatik`, FS1E.5.D.1)

### FS1E.5.D.1.b — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

sprachen_zyklus3.md:201 führt Stufe b nur für Französisch („— / b“) und sagt dazu „In EN ist das der GA Z2“; einen Text für FS1E.5.D.1.b gibt die Doku nicht. Die Teile unten sind der Text von FS2F.5.D.1.b.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Lehrplan-Text dieser Stufe fehlt in docs/lernsteig/lehrplan/ | **offen** | alles |
| (FS2F.5.D.1.b) einige einfache Strukturen verwenden, noch mit Fehlern (Konjugation wichtiger Verben, Personalpronomen als Subjekt, Frage mit Fragewort) — *Ersatz für den fehlenden englischen Text; der Kopfkommentar aufgaben.js:3 legt b ebenso aus* | `fragewort` 32 %, `be` 24 %, `pronomen-subjekt` 24 %, `have` 21 % | — |
| (FS2F.5.D.1.b) Zeit- und Ortsangaben erkennen | **offen** | alles |

### FS1E.5.D.1.c — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| einfache Strukturen verwenden, teils noch Fehler (Wortfolge in Aussage und Frage, Verben mit zwei Objekten, unregelmässiger Plural, häufige Präpositionen) | `praeposition` 24 %, `plural` 22 %, `wortfolge-frage` 19 %, `wortfolge-aussage` 19 %, `zwei-objekte` 16 % | — |
| einfache Strukturen im Text erkennen (Wortfolge, Frage, Konjugationsformen) — *wortfolge-frage und wortfolge-aussage lassen den richtigen Satz wählen, das kommt dem Erkennen nahe; Konjugationsformen im Text nicht* | **offen** | alles |

### FS1E.5.D.1.d — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| auch komplexere Strukturen ausreichend korrekt (Hilfs- und Modalverben, Formen der Negation, Demonstrativ- und Reflexivpronomen) | `negation` 17 %, `modal` 13 %, `demonstrativ` 13 %, `reflexiv` 13 % | Hilfsverben als eigenes Thema (sie kommen nur in negation und zeitform vor) |
| im Text erkennen (Zeitformen, Modalverben, begründende Konjunktionen, Possessiv- und Reflexivpronomen) — *Modalverben und Reflexivpronomen im ersten Teil gezählt; konjunktion übt neben because auch so (Folge, nicht begründend); Zeitformen mit den Namen nach ZF1 a* | `konjunktion` 16 %, `possessiv` 14 %, `zeitform` 15 % | — |

## Français : grammaire (`franzoesisch-grammatik`, FS2F.5.D.1)

### FS2F.5.D.1.b — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| einige einfache Strukturen verwenden, noch mit Fehlern (Konjugation wichtiger Verben, Personalpronomen als Subjekt, Frage mit Fragewort) | `interrogatif` 17 %, `etre` 16 %, `verbe-er` 16 %, `avoir` 15 %, `faire` 12 %, `pronom-sujet` 11 %, `aller` 13 % | — |
| Zeit- und Ortsangaben erkennen | **offen** | alles |

### FS2F.5.D.1.c — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| einfache Strukturen verwenden, teils noch Fehler (Wortfolge in Aussage und Frage, Verben mit zwei Objekten, unregelmässiger Plural, häufige Präpositionen) | `preposition` 29 %, `pluriel` 27 %, `ordre-question` 16 %, `deux-objets` 14 %, `ordre-phrase` 15 % | — |
| einfache Strukturen im Text erkennen (Wortfolge, Frage, Konjugationsformen) — *ordre-question und ordre-phrase lassen den richtigen Satz wählen, das kommt dem Erkennen nahe; Konjugationsformen im Text nicht* | **offen** | alles |

### FS2F.5.D.1.d — sinngemäss (Zusammenfassung, Wortlaut noch nachzulesen)

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| auch komplexere Strukturen ausreichend korrekt (Hilfs- und Modalverben, Formen der Negation, Demonstrativ- und Reflexivpronomen) | `negation` 13 %, `modal` 14 %, `demonstratif` 16 %, `reflexif` 16 % | Hilfsverben als eigenes Thema (sie kommen nur in negation und temps vor) |
| im Text erkennen (Zeitformen, Modalverben, begründende Konjunktionen, Possessiv- und Reflexivpronomen) — *Modalverben und Reflexivpronomen im ersten Teil gezählt; conjonction übt neben parce que auch donc (Folge, nicht begründend)* | `conjonction` 11 %, `possessif` 15 %, `temps` 15 % | — |
