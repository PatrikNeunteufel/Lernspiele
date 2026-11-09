# Abdeckung der Lehrplan-Stufen — Lernsteig

Erzeugt von `node tools/abdeckung.js` aus `docs/lernsteig/abdeckung.json` und den Aufgaben der Übungen — **nicht von
Hand ändern** (Plan E 1, Entscheid AT1 a). Geprüft von `tools/pruefe_uebungen.js`. Anteile: 1000 Aufgaben je Stufe und Niveau, Startwert 7.

Erfasst: 27 von 27 Übungen, 80 von 80 Stufen.

## Dezimalzahlen und rationale Zahlen (`rationale-zahlen`, MA.1.A.3)

### MA.1.A.3.g — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Dezimalzahlen bis 5 Wertziffern multiplizieren und die Ergebnisse überprüfen (im Kopf oder mit Notieren eigener Rechenwege, z.B. 308 · 52; 12 · 0,3) — *Das Beispiel 308 · 52 ist ein Ganzzahl-Produkt und deckt mal-ganz (E1-1 a); ueberpruefen: welches von vier Ergebnissen stimmt (Komma verrutscht, falsche letzte Ziffer)* | `mal-dezimal` 21 %, `mal-ganz` 20 %, `ueberpruefen` 20 % | — |
| Brüche mit den Nennern 2, 3, 4, 5, 6, 8, 10, 20, 50, 100 am Rechteckmodell multiplizieren | in `brueche` | — |
| Brüche mit den Nennern 2, 3, 4, 5, 6, 8, 10, 20, 50, 100, 1'000 als Dezimalzahlen schreiben | `bruch-dezimal` 19 % | die Nenner 3 und 6 (periodische Dezimalzahlen, nach RZ1 a zurückgestellt) |
| bestimmen, wie oft Stammbrüche in ganzen Zahlen enthalten sind (z.B. Wie viele Male ist ⅕ in 2 enthalten? → 2 : ⅕) | `stammbruch` 19 % | — |

### MA.1.A.3.h — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Prozentrechnungen mit dem Rechner ausführen | `grundwert` 27 %, `prozentwert` 24 %, `prozentsatz` 25 % | — |
| Erweiterung: natürliche Zahlen in Primfaktoren zerlegen — *Zahlen 12 bis 1'000 aus Primzahlen bis 13; Antwort nur als Produkt von Primzahlen (Form primfaktoren, kern 1.29.0)* | `primfaktoren` 24 % | — |

### MA.1.A.3.i — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| die Grundoperationen mit rationalen Zahlen ausführen | `plus-minus` 25 %, `mal-geteilt` 26 %, `dezimal-negativ` 25 % | — |
| Wurzeln und Potenzen mit dem Rechner berechnen (z.B. 4³ · 4³ = 4'096; 4³ + 4³ = 128; ³√8000) | `potenz-wurzel` 25 % | — |
| Erweiterung: die Grundoperationen mit gewöhnlichen Brüchen mit Variablen ausführen und mit Zahlen belegen: [Bild formel6a.png]; [Bild formel6b.png]; [Bild formel6c.png]; [Bild formel6d.png] — *Abschrift der Formelbilder (docs/lernsteig/lehrplan/mathematik_zyklus3.md, formel1 und formel6d am Bild nachgesehen): formel6a a/b + c/d; formel6b a/b − c/d; formel6c a/b · c/d; formel6d a : c/b : d = a/c · b/d* | in `brueche` | — |

## Gleichungen lösen (`gleichungen`, MA.1.A.4)

### MA.1.A.4.h — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Gleichungen mit Variablen durch Einsetzen oder Umkehroperationen lösen — *nur natürliche Zahlen, ein oder zwei Schritte; Einsetzen nur im Hinweis (bei „Zahl − x“)* | `plus` 20 %, `minus` 19 %, `mal` 20 %, `geteilt` 20 %, `zwei` 20 % | — |
| die Rechenregeln Punkt vor Strich und die Klammerregeln befolgen (z.B. 4 + 8 - 2 · 3 = 6; (4 + 8 - 2) · 3 = 30; 4 + (8 - 2) · 3 = 22) — *rationale-zahlen führt MA.1.A.4.h im Katalog unter weitere (Klammerregeln), übt in Stufe i aber nur Vorzeichenklammern ohne Punkt vor Strich; die Klammer-Aufgaben dort stehen nur in der Challenge — darum nicht „in“* | **offen** | alles |
| Erweiterung: Teilbarkeitsregeln durch 3, 4, 6, 8, 9, 25, 50 nutzen und Teiler natürlicher Zahlen bestimmen — *Teiler zählen übt folgen (Typ teiler), aber in MA.1.C.2.g, nicht in dieser Kompetenz-Stufe* | **offen** | alles |

### MA.1.A.4.j — am Wortlaut nachgelesen

Die Stufe besteht nur aus Erweiterungen; jeder Teil darum mit „Erweiterung: “.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Erweiterung: lineare Gleichungen mit einer Variablen mit Äquivalenzumformungen lösen (z.B. 5x + 3 = 7) | `einseitig` 33 %, `beidseitig` 35 %, `klammer` 32 % | — |
| Erweiterung: Polynome addieren und subtrahieren (z.B. 3(a² + 2b) - 2(a² + b) = a² + 4b) | in `terme` | — |
| Erweiterung: Terme ausmultiplizieren und ausklammern (Faktorzerlegung) — *Ausmultiplizieren von Klammern in Gleichungen auch im Typ klammer dieser Übung* | in `terme` | — |
| Erweiterung: Gleichungen sprachlich deuten (z.B. x = y + 1 → x ist um 1 grösser als y) und Textgleichungen umsetzen — *Kopfkommentar: „Textgleichungen folgen“ (ohne Entscheid-Kürzel)* | **offen** | alles |
| Erweiterung: Terme mit Variablen umformen bzw. sinnvoll vereinfachen (ausklammern, ausmultiplizieren, kürzen und Vorzeichenregeln) | in `terme` | kürzen (auch in terme nicht) |

## Grössen umwandeln (`groessen`, MA.3.A.2)

### MA.3.A.2.h — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Grössen (Geld, Längen, Gewicht bzw. Masse, Zeit, Volumen [l]) schätzen, bestimmen, vergleichen, runden, mit ihnen rechnen — *aufgaben.js nimmt „Grössen schätzen und messen“ aus, ohne Entscheid-Kürzel; Vergleichen, Runden und Rechnen kommen in der Stufe nicht vor (gemischte Einheiten addieren nur in der Challenge)* | **offen** | alles |
| in benachbarte Masseinheiten umwandeln | `laenge-hoch` 8 %, `laenge-runter` 9 %, `masse-hoch` 9 %, `masse-runter` 8 %, `zeit-hoch` 8 %, `zeit-runter` 8 %, `liter-hoch` 9 %, `liter-runter` 8 % | Geld (Fr. ↔ Rp. nur zweifach benannt im Typ zweifach) |
| in zweifach benannten Einheiten schreiben | `zweifach` 34 % | das Schreiben in zweifach benannten Einheiten: geübt wird nur die Richtung „3 m 45 cm = … cm“ |

### MA.3.A.2.i — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Flächeninhalte und Volumen [m³] in einer geeigneten Masseinheit schätzen — *aufgaben.js nimmt „Grössen schätzen und messen“ aus, ohne Entscheid-Kürzel* | **offen** | alles |
| in benachbarte Masseinheiten umwandeln | `flaeche-hoch` 26 %, `flaeche-runter` 25 %, `volumen-hoch` 25 %, `volumen-runter` 25 % | — |
| Grössen absolut und relativ vergleichen (z.B. 120 Stück oder 60% bzw. ⅗ einer Menge) — *aufgaben.js: „Nicht in dieser Übung (eigene Übungen später)“, ohne Entscheid-Kürzel; Ähnliches übt daten-rabatt in MA.3.A.1.k (andere Kompetenz)* | **offen** | alles |
| Distanzen und Zeitdauern für Geschwindigkeitsberechnungen messen — *Messen passt nicht in eine Zahlaufgabe; aufgaben.js nimmt „Grössen schätzen und messen“ aus, ohne Entscheid-Kürzel* | **offen** | alles |

### MA.3.A.2.j — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| das System der dezimalen Masseinheiten (SI-System) nutzen — *vorsatz-umrechnen rechnet zwischen Vorsätzen bei m, g, l, W, J, Hz um; der Wortlaut meint das System der dezimalen Masseinheiten, dazu gehört auch l* | `vorsatz-umrechnen` 69 % | — |
| die Vorsätze Mega, Kilo, Dezi, Centi und Milli den Zehnerpotenzen zuordnen | `vorsatz` 31 % | — |

### MA.3.A.2.k — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Berechnungen mit zusammengesetzten Masszahlen durchführen — *Rechnen mit gemischten Einheiten nur in der Challenge (flaeche-summe, zeit-summe, volumen-liter); weg-zeit rechnet v = s : t, eingetragen bei „Geschwindigkeiten umwandeln“ (Beispiel 200m/10s)* | **offen** | alles |
| Grössenangaben von einer Einheit in eine andere umrechnen | `dichte` 26 % | weitere Einheiten (dichte rechnet nur g/cm³ ↔ kg/m³ um; km/h ↔ m/s beim nächsten Teil) |
| Geschwindigkeiten umwandeln (z.B. von 200m/10s in 72 km/h) | `kmh-ms` 23 %, `ms-kmh` 27 %, `weg-zeit` 24 % | — |

## Prozent und Funktionswerte (`prozent-funktionen`, MA.3.A.3)

### MA.3.A.3.g — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Funktionswerte aufgrund von Funktionsgraphen bestimmen | `graph-proportional` 26 % | nicht proportionale Graphen (in g nur Ursprungsgeraden) |
| mit indirekt proportionalen Beziehungen rechnen (z.B. Anzahl Karten je Person bei 72 Karten und x Mitspielenden) | `indirekt` 26 % | — |
| verstehen Prozentangaben als proportionale Zuordnungen und führen Prozentrechnungen aus (z.B. Wie viele Prozente sind 7 von 35 sowie wie viel sind 7% von 35?) | `prozent-von` 27 %, `prozentsatz` 22 % | — |

### MA.3.A.3.h — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| zu einer Funktionsgleichung Wertepaare bestimmen | `wertepaar` 43 % | — |
| in einem Koordinatensystem einzeichnen — *je Aufgabe wird eine Zahl verlangt, nichts eingezeichnet* | **offen** | alles |
| Streckenlängen aufgrund von Massstabangaben bestimmen und umgekehrt (z.B. auf einer Karte geeignete Routen für eine 12 km-Wanderung eintragen) | `massstab-karte` 26 %, `massstab-wirklich` 32 % | Routen auf einer Karte eintragen (das Beispiel); gefragt ist nur die umgerechnete Länge |

### MA.3.A.3.i — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| den Funktionswert zu einer gegebenen Zahl aus einer Wertetabelle, einer graphischen Darstellung und mit der Funktionsgleichung bestimmen | `tabelle` 20 %, `graph` 20 %, `gleichung` 20 % | — |
| Wertepaare im Koordinatensystem einzeichnen (z.B. y = 2x + 1. Für x = 7 → y = 15) — *Das Beispiel steht im Wortlaut am Satzende und gilt auch für den Funktionswert (Typ gleichung, Teil 1); eingezeichnet wird nichts* | **offen** | alles |
| Rechner oder geeignete Software (z.B. Tabellenkalkulation) zur Berechnung von Funktionswerten und Masszahlen benutzen — *der Rechner ist in Stufe i zugelassen (Katalog rechner i: mit), die Tabellenkalkulation wird nicht geübt* | **offen** | alles |
| Sachaufgaben mit Prozentangaben lösen (z.B. zu Steigung und Zins) | `zins` 19 %, `steigung` 21 % | — |

## Terme vereinfachen (`terme`, MA.1.A.4)

### MA.1.A.4.i — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| ein Produkt mit gleichen Faktoren als Potenz schreiben und umgekehrt (z.B. 15 · 15 · 15 = 15³ ; a · a · a · a = a⁴) | `potenz` 50 % | „und umgekehrt“: Potenz als Produkt schreiben (Kopfkommentar: folgt) |
| das Distributivgesetz bei Termumformungen anwenden (z.B. a · (b + c) = a · b + a · c = ab + ac) — *nur ausmultiplizieren mit einem Faktor vor einer Klammer mit zwei Gliedern* | `distributiv` 50 % | — |
| Rechenergebnisse sinnvoll runden | **offen** | alles |
| Erweiterung: verstehen die Konventionen über die Notation algebraischer Terme (z.B. abc = a · b · c aber 789 ≠ 7 · 8 · 9) — *Kopfkommentar: die Notation „folgt“ (ohne Entscheid-Kürzel)* | **offen** | alles |

### MA.1.A.4.j — am Wortlaut nachgelesen

Die Stufe besteht nur aus Erweiterungen; jeder Teil darum mit „Erweiterung: “.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Erweiterung: lineare Gleichungen mit einer Variablen mit Äquivalenzumformungen lösen (z.B. 5x + 3 = 7) | in `gleichungen` | — |
| Erweiterung: Polynome addieren und subtrahieren (z.B. 3(a² + 2b) - 2(a² + b) = a² + 4b) | `polynome` 38 % | — |
| Erweiterung: Terme ausmultiplizieren und ausklammern (Faktorzerlegung) — *ausklammern nur einer Zahl aus zwei Gliedern (6a + 9 = 3(2a + 3)); ausmultiplizieren steckt in polynome und vorzeichen* | `ausklammern` 25 % | die Faktorzerlegung über eine Zahl hinaus (Variable oder Term ausklammern, etwa a² + ab = a(a + b)): ausklammern nimmt nur eine Zahl aus zwei Gliedern |
| Erweiterung: Gleichungen sprachlich deuten (z.B. x = y + 1 → x ist um 1 grösser als y) und Textgleichungen umsetzen | **offen** | alles |
| Erweiterung: Terme mit Variablen umformen bzw. sinnvoll vereinfachen (ausklammern, ausmultiplizieren, kürzen und Vorzeichenregeln) | `vorzeichen` 37 % | kürzen |

### MA.1.A.4.k — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Terme mit Variablen addieren und subtrahieren (z.B. a + 2a + b + 3b + ¼ + ⅜ = 3a + 4b + ⅝) | `zusammenfassen` 49 %, `zusammenfassen-bruch` 51 % | — |

## Längen, Flächen, Volumen berechnen (`flaechen-volumen`, MA.2.A.3)

### MA.2.A.3.f — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Volumen von Quadern berechnen | `quader-volumen` 66 %, `quader-hoehe` 34 % | — |
| den Flächeninhalt von nicht rechteckigen Figuren in Rastern annähernd bestimmen (z.B. die Anzahl Einheitsquadrate in einem Kreis auszählen) — *aufgaben.js: „Nicht in dieser Übung“, ohne Entscheid-Kürzel* | **offen** | alles |

### MA.2.A.3.g — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Vielecke und gerade Prismen zur Berechnung von Flächeninhalten und Volumen zerlegen | **offen** | alles |
| den Flächeninhalt von Drei- und Vierecken berechnen | `dreieck` 19 %, `parallelogramm` 21 %, `trapez` 19 % | weitere Vierecke (Raute, Drachenviereck); Grundseite und Höhe sind immer gegeben |
| Kantenlängen, Seitenflächen und Volumen von Quadern berechnen | `quader-kanten` 21 %, `quader-oberflaeche` 20 % | das Volumen (in Stufe g kein Aufgabentyp; geübt in Stufe f mit quader-volumen); einzelne Seitenflächen (gefragt sind die Summe aller Kanten und die ganze Oberfläche) |

### MA.2.A.3.h — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Längen und Flächeninhalte mithilfe des Satzes von Pythagoras berechnen | `hypotenuse` 26 %, `kathete` 23 %, `diagonale` 26 %, `hypotenuse-gerundet` 26 % | Flächeninhalte (gefragt sind nur Längen) |
| bei geometrischen Berechnungen Formeln und Tabellenkalkulation verwenden — *aufgaben.js nimmt die Tabellenkalkulation aus („Nicht in dieser Übung“), ohne Entscheid-Kürzel* | **offen** | alles |

### MA.2.A.3.i — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Umfang und Flächeninhalt von Kreisen berechnen | `kreis-umfang` 26 %, `kreis-flaeche` 24 % | — |
| Kantenlängen, Flächen und Volumen an geraden Prismen und Zylindern berechnen | `prisma-volumen` 26 %, `zylinder-volumen` 24 % | Kantenlängen und Flächen an Prismen und Zylindern (Zylinder-Oberfläche nur in der Challenge); Prismen nur mit dreieckiger Grundfläche |
| Volumen beliebiger Körper schätzen durch Zerlegen oder Vergleichen mit bekannten Körpern — *aufgaben.js: „Nicht in dieser Übung“, ohne Entscheid-Kürzel* | **offen** | alles |

## Grosse Zahlen und Zehnerpotenzen (`zehnerpotenzen`, MA.1.A.1)

### MA.1.A.1.i — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| verstehen und verwenden die Begriffe Term, Variable, Unbekannte, hoch, Potenz, Zehnerpotenz, Vorzeichen, positive Zahlen, negative Zahlen, (Quadrat-) Wurzel — *passt nur ungefähr: der Typ übt die Zehnerpotenz als Zahl, keinen Begriff* | `zehnerpotenz` 25 % | die Begriffe selbst und alle ausser hoch/Zehnerpotenz: zehnerpotenz rechnet nur 10ⁿ aus (n = 2 bis 9) |
| Erweiterung: verstehen und verwenden die Begriffe Basis, Exponent — *Katalog ohneE: [„i“] (Begriffe Basis, Exponent nicht abgefragt), ohne Entscheid-Kürzel* | **offen** | alles |
| die Symbole √, ≤, ≥ verwenden und Rechner entsprechend nutzen | **offen** | alles |
| Zahlen bis 1 Milliarde lesen und schreiben | `wort-zahl` 50 %, `zahl-stellen` 25 % | Zahlen in Worten schreiben (Richtung Zahl → Zahlwort) |

### MA.1.A.1.j — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Zahlen in wissenschaftlicher Schreibweise mit positiven Exponenten lesen und schreiben (z.B. 1.32 · 10⁸ = 132 000 000) | `exponent-positiv` 49 %, `ausschreiben-positiv` 51 % | — |
| Potenzen mit rationaler Basis und natürlichem Exponenten lesen und schreiben | **offen** | alles |

### MA.1.A.1.k — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| verstehen und verwenden die Begriffe natürliche Zahlen, ganze Zahlen, rationale Zahlen, Kehrwert, 3. Wurzel | **offen** | alles |
| Zahlen in wissenschaftlicher Schreibweise, auch mit negativen Exponenten, lesen und schreiben | `exponent-negativ` 52 %, `ausschreiben-negativ` 48 % | — |

## Überschlagen und Ordnen (`ueberschlagen-ordnen`, MA.1.A.2)

### MA.1.A.2.h — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Summen und Differenzen mit Dezimalzahlen überschlagen (z.B. 0.723 - 0.04 ≈ 0.7; 23'268 + 4'785 ≈ 28'000) | `summe` 37 %, `differenz` 29 % | den Überschlag selbst bilden: gewählt wird unter vier Antworten, die sich um Zehnerpotenzen unterscheiden (nur die Grössenordnung); die Zahlbereiche der Beispiele (Dezimalzahlen unter 1 wie 0.723 − 0.04, Zahlen über 1'000 wie 23'268 + 4'785): die Summanden liegen zwischen 1 und 999 |
| in Prozentrechnungen Ergebnisse überschlagen (z.B. 263 von 830 sind etwa 30%; 45% von 13'000 sind mehr als 5'000) | `prozent` 34 % | das zweite Beispiel: einen Prozentwert überschlagen (45% von 13'000 sind mehr als 5'000); prozent überschlägt nur den Prozentsatz („… von … sind etwa … %“) |

### MA.1.A.2.i — am Wortlaut nachgelesen

Die Stufe besteht nur aus der Erweiterung.

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Erweiterung: Produkte und Quotienten von Dezimalzahlen überschlagen. (z.B. 0.382 : 42.8 → 0.4 : 40 = 0.4 : 4 : 10 = 0.01; 32.7 : 0.085 → 30 : 0.1 = 300 : 1 = 300) | `produkt` 51 %, `quotient` 49 % | den Überschlag selbst bilden: gewählt wird unter vier Antworten, die sich um Zehnerpotenzen unterscheiden (nur die Grössenordnung) |

### MA.1.A.2.j — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| positive und negative rationale Zahlen auf dem Zahlenstrahl ordnen | `groesste` 35 %, `kleinste` 33 %, `naechste-null` 32 % | der Zahlenstrahl als Bild und das Ordnen aller Zahlen (gewählt wird nur die grösste, kleinste oder nächste bei 0) |

## Mittelwert, Häufigkeit, Rabatt (`daten-rabatt`, MA.3.A.1)

### MA.3.A.1.j — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| verstehen und verwenden die Begriffe Koordinatensystem, Währung, arithmetisches Mittel — *Währung übt der Typ waehrung, eingetragen beim Teil „Geld (CHF, €, $)“* | `mittelwert` 67 % | das Koordinatensystem |
| (Erweiterung: indirekte Proportionalität) — *Erweiterung in Klammern innerhalb eines Punkts (darum ohne „Erweiterung: “ vorn). Katalog ohneE j: „übt Prozent und Funktionswerte“ (prozent-funktionen, Typ indirekt) — dort aber MA.3.A.3.g, nicht dieselbe Kompetenz-Stufe, daher nicht als in eingetragen* | **offen** | alles |
| Masseinheiten und deren Abkürzungen verwenden sowie sich an Referenzgrössen orientieren: Flächenmasse (km², ha, a, m², dm², cm², mm²) — *Der Satzanfang gilt auch für Raummasse und Geld (nächste Teile). Umwandeln der Flächenmasse übt groessen in MA.3.A.2.i (andere Kompetenz)* | **offen** | alles |
| Raummasse (km³, m³, dm³, cm³, mm³) — *groessen übt in MA.3.A.2.i m³ … mm³ (ohne km³), andere Kompetenz* | **offen** | alles |
| Geld (CHF, €, $) — *Wechselkurse erfunden und in der Aufgabe angegeben (Annahme in aufgaben.js)* | `waehrung` 33 % | die Abkürzung CHF (die Aufgaben schreiben Fr.) und Referenzgrössen |

### MA.3.A.1.k — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| verstehen und verwenden die Begriffe absolute und relative Häufigkeit | `relativ-prozent` 46 %, `absolut` 41 % | — |
| x-Koordinate, y-Koordinate, x-Achse, y-Achse, Einheitsstrecke — *die Wörter x- und y-Koordinate stehen in Aufgaben von koordinaten und lineare-funktionen (andere Kompetenzen)* | **offen** | alles |
| Wahrscheinlichkeit | `wahrscheinlichkeit` 13 % | — |
| Masseinheiten und deren Abkürzungen verwenden: Geschwindigkeit (km/h, m/s, kB/s, dpi) — *km/h und m/s übt groessen in MA.3.A.2.k (andere Kompetenz); kB/s und dpi nirgends* | **offen** | alles |

### MA.3.A.1.l — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| verstehen und verwenden die Begriffe Steigung in %, Zins, Zinssatz, Kapital — *aufgaben.js: Steigung und Zins übt „Prozent und Funktionswerte“ (prozent-funktionen, Typen zins und steigung), dort MA.3.A.3.i, andere Kompetenz* | **offen** | alles |
| Rabatt, Brutto, Netto — *Lesart E2-1 a (LERN_Session24), der Wortlaut nennt nur die Begriffe: beim Preis Bruttopreis − Rabatt = Nettopreis (nettopreis, rabatt-betrag), beim Gewicht Bruttogewicht = Nettogewicht + Tara (nettogewicht, bruttogewicht), brutto je 100 % wie im Schweizer Skript oriesen.ch Prozent4S S. 19; Lesart des mathbuchs nicht nachgesehen* | `nettopreis` 24 %, `rabatt-betrag` 27 %, `nettogewicht` 25 %, `bruttogewicht` 24 % | — |

## Möglichkeiten zählen (`kombinatorik`, MA.3.B.2)

### MA.3.B.2.d — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| in auszählbaren Variationen und Kombinationen alle Möglichkeiten systematisch aufschreiben (z.B. Zahlen mit den Ziffern 1, 2, 3 mit und ohne Wiederholung: 123, 132, 213, 231, 312, 321, 112, 121, 211, ...) | `ziffern-ohne` 16 %, `ziffern-mit` 14 %, `wort` 28 %, `kleider` 29 %, `schloss` 13 % | das systematische Aufschreiben (gefragt ist nur die Anzahl) |

### MA.3.B.2.f — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Wahrscheinlichkeiten und statistische Angaben überprüfen und begründen (z.B. die Wahrscheinlichkeit, mit einer Münze zwei mal hintereinander Kopf zu werfen, ist 0.25; In den Voralpen besitzen relativ mehr Jugendliche einen Roller als im Mittelland) | `muenzen` 9 %, `muenzen3` 11 %, `wuerfel-summe` 20 %, `wuerfel-gleich` 10 %, `muenze-wuerfel` 11 %, `rad` 21 %, `urne` 19 % | überprüfen und begründen (die Wahrscheinlichkeit wird berechnet, keine gegebene Angabe geprüft); statistische Angaben (das Beispiel mit dem relativen Vergleich Voralpen–Mittelland) |

### MA.3.B.2.g — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| vergleichen kombinatorische Probleme, erkennen und erfinden Analogien (z.B. Handshakes bei 5 Personen ist analog zu von 5 Personen erhalten 2 einen Fünfliber) | `handshake` 17 %, `turnier-hin` 18 %, `turnier-rueck` 16 %, `strecken` 17 %, `diagonalen` 17 %, `teams` 15 % | das Vergleichen, Erkennen und Erfinden von Analogien (je Aufgabe ein Problem; die Analogie liegt nur zwischen den Aufgaben, sie wird nicht verlangt) |

## Daten und Zufall (`zufall`, MA.3.C.1)

### MA.3.C.1.f — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Datensätze nach Kriterien auswerten — *die Aufgaben geben eine Werteliste; nach Kriterien ausgewählt oder gruppiert wird nicht* | **offen** | alles |
| in Datensätzen Mittelwert, Maximum und Minimum bestimmen | `mittelwert` 66 %, `spanne` 34 % | Maximum und Minimum einzeln (nur ihr Unterschied, spanne) |

### MA.3.C.1.h — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| mehrstufige Zufallsexperimente mit Würfeln, Münzen oder Karten durchführen und mögliche Ereignisse darstellen (z.B. ein Baumdiagramm zum dreimaligen Werfen einer Münze zeichnen) | `drei-muenzen` 40 %, `urne-mit` 41 %, `pfade` 19 % | das Durchführen; das Darstellen der Ereignisse, das Baumdiagramm als Bild (gefragt sind nur Anzahl Pfade und Wahrscheinlichkeiten); Karten (nur Münzen, Würfel und Kugeln) |

### MA.3.C.1.i — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Erweiterung: Zufallsexperimente durchführen — *Durchführen passt nicht in eine Zahlaufgabe* | **offen** | alles |
| Erweiterung: die Wahrscheinlichkeiten ermitteln (z.B. die Wahrscheinlichkeit bestimmen, aus einem Kartenspiel 2x hintereinander die gleiche Farbe zu ziehen) — *gezogen werden Kugeln aus einer Urne ohne Zurücklegen, kein Kartenspiel* | `urne-ohne` 51 % | — |
| Erweiterung: Aussagen zur Wahrscheinlichkeit aus der relativen Häufigkeit eines Ereignisses ableiten (z.B. in einem Monat verspäten sich 88 von 2'750 Zügen mehr als 5 min, 57 davon mehr als 10 min) — *erwartet passt nur ungefähr: es rechnet umgekehrt aus der Wahrscheinlichkeit die erwartete Häufigkeit („Wie oft erwartest du …“), ein eigener Lehrplantext dafür fehlt* | `relativ` 24 %, `erwartet` 25 % | — |

## Körper, Winkel, Ähnlichkeit (`koerper-winkel`, MA.2.A.3)

### MA.2.A.3.j — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Strecken, Flächen und Volumen an Pyramiden, Kegeln und Kugeln berechnen | `pyramide` 12 %, `kegel` 13 %, `kugel-volumen` 13 %, `kugel-oberflaeche` 12 % | Strecken (Höhe, Mantellinie; Pyramidenhöhe nur in der Challenge); Flächen an Pyramide und Kegel (nur Volumen); Pyramiden nur mit quadratischer Grundfläche (Annahme in aufgaben.js) |
| Winkel aufgrund von Winkelsummen, Satz von Thales, Ähnlichkeit und Kongruenz bestimmen | `dreieck` 8 %, `viereck` 8 %, `summe` 9 %, `regelmaessig` 8 %, `thales` 9 %, `gleichschenklig` 8 % | Ähnlichkeit und Kongruenz (in j keine Aufgabe; ähnliche Figuren übt Stufe k) |

### MA.2.A.3.k — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Ähnlichkeiten erkennen — *die Ähnlichkeit ist in jeder Aufgabe vorgegeben („Zwei Dreiecke sind ähnlich“, „Alle Längen werden mit … multipliziert“)* | **offen** | alles |
| bei ähnlichen Figuren und Körpern Längen, Flächeninhalte und Volumen berechnen | `seite` 33 %, `flaeche` 17 %, `volumen` 18 %, `faktor-flaeche` 16 %, `faktor-volumen` 16 % | — |

## Stoffwechsel: Organe und Vorgänge (`stoffwechsel`, NT.7.2)

### NT.7.2.a — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| die Organe als Komponenten eines Systems erkennen, das die vier zentralen Stoffwechselvorgänge Aufnahme, Transport, Umwandlung und Abgabe umschliesst. Aufnahme: Lunge, Verdauungsorgane; Transport: Blut, Blutkreislauf, Herz; Umwandlung: Leber, Fettgewebe, Knochen, Muskeln, Hirn; Abgabe: Niere, Lunge Verdauungsorgane, Haut — *Ein Teil mit den Verbindlichen Inhalten: Ihre vier Glieder sind die eine Zuordnung Organ ↔ Vorgang, die beide Typen über alle vier Vorgänge abfragen* | `organ` 48 %, `vorgang` 52 % | — |

## Atombau und Periodensystem (`atombau`, NT.3.2)

### NT.3.2.a — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| in der Entstehungsgeschichte des Periodensystems der Elemente PSE die Bedeutung des systematischen Beschreibens und Ordnens erkennen | **offen** | alles |
| Element Metalle, Nichtmetalle, Edelgase — *Verbindliche Inhalte der Stufe (auf der Seite am ersten Punkt); art fragt je Element Metall, Nichtmetall oder Edelgas* | `art` 50 % | nur die Elemente 1 bis 20 |
| aus dem Periodensystem Informationen zu den Elementen herauslesen — *welches lässt drei Elemente im PSE nachsehen; art liest dieselbe Angabe und ist beim Teil der Verbindlichen Inhalte gezählt* | `welches` 50 % | andere Informationen aus dem PSE als die Art (Metall, Nichtmetall, Edelgas); nur die Elemente 1 bis 20 |

### NT.3.2.c — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| am Beispiel der Entwicklungsgeschichte des Kern-Hülle-Modells die Bedeutung der Grenzen von Modellen erkennen. Masse-Ladungsmodell nach Thomson, Kern-Hülle-Modell nach Rutherford | **offen** | alles |
| Atome mit dem Kern-Hülle-Modell darstellen | `elektronen` 20 % | das Darstellen im Modell (elektronen fragt nur die Anzahl Elektronen in der Hülle eines ungeladenen Atoms) |
| Protonen und Neutronen als Kernbausteine benennen — *die Protonen fragt protonen, gezählt bei der Ordnungszahl* | `neutronen` 41 % | — |
| PSE: Ordnungszahl, Atommasse, Hauptgruppen — *protonen: die Ordnungszahl steht nicht in der Aufgabe, sie ist aus dem PSE zu lesen* | `protonen` 19 % | die Atommasse (die Übung nimmt nach ihrer Annahme die ganzzahlige Massenzahl und nennt sie in der Aufgabe) und die Hauptgruppen (in c nicht gefragt, erst in d) |
| Isotop | `isotop` 20 % | — |

### NT.3.2.d — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Zusammenhänge zwischen Schalenmodell und PSE aufzeigen Schalenmodell — *Mit den Verbindlichen Inhalten (die Seite setzt keinen Punkt davor). Schalenbesetzung nur nach der Annahme 2, 8, 8, 2 für die Elemente 1 bis 20* | `aussen` 51 %, `schalen` 26 %, `gruppe` 23 % | — |
| Stoffumwandlungen als Veränderung in der Anordnung von Teilchen und als Veränderung chemischer Bindungen erklären | **offen** | alles |
| Wertigkeit, Donator-Akzeptor-Konzept bei Redoxreaktionen, Bindungstypen, Edelgasregel — *Verbindliche Inhalte. Die Edelgasregel (Ionenladung, Elektronen des Ions) übt nur die Challenge (ladung, ionen-elektronen, edelgas-gleich), obwohl der Stufentitel von d sie nennt* | **offen** | alles |

## Kräfte und einfache Maschinen (`kraefte`, NT.5.1)

### NT.5.1.a — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| gleichförmige Bewegungen von Körpern in Diagrammen erkennen und darstellen — *Geschwindigkeit als Rechengrösse nennt die Lehrplanseite nicht; v = s : t ist Annahme der Übung* | `v-diagramm` 68 %, `weg-nach` 32 % | das Erkennen und das Darstellen: Das Diagramm ist immer eine Ursprungsgerade und die Aufgabe sagt selbst, dass die Bewegung gleichförmig ist; gefragt sind nur Geschwindigkeit und Weg, nichts wird erkannt oder gezeichnet |

### NT.5.1.c — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| experimentell zeigen und in Diagrammen darstellen, dass die Gewichtskraft proportional zur Masse ist | `kraft-kg` 34 %, `kraft-g` 33 %, `masse` 33 % | das Experiment und das Diagramm; geübt wird das Rechnen mit F = m · g, g = 10 N/kg (Annahme) |
| Umgang mit einem Kraftmesser — *Verbindlicher Inhalt; kraft-g und masse nennen den Kraftmesser nur im Aufgabentext* | **offen** | alles |

### NT.5.1.d — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Kräfte einordnen und darstellen. Kräftediagramm | **offen** | alles |
| experimentell zeigen, dass bei einfachen Maschinen die benötigten Kräfte verringert werden können (z.B. Hebel, schiefe Ebene, Flaschenzug, Ketten-/Zahnradgetriebe) — *Beispiele ohne Wellräder und Keile nach KR1 a — beide nennt der Lehrplan nicht* | `maschine` 100 % | dass die Maschinen die Kraft verringern (gefragt ist nur, welche Maschine ein Beispiel zeigt) und das Experiment |

### NT.5.1.e — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| begründen, dass bei einfachen Maschinen die benötigten Kräfte verringert werden können, sich gleichzeitig aber die Strecke, entlang der die Kräfte wirken, verlängert (z.B. Hebel, schiefe Ebene, Flaschenzug). Goldene Regel der Mechanik — *Mit dem Verbindlichen Inhalt: Die Goldene Regel ist der Satz davor. Formeln (Hebelgesetz, Kraft · Weg bleibt gleich) sind Annahme der Übung, die Lehrplanseite nennt keine* | `hebel` 26 %, `flaschenzug-kraft` 25 %, `flaschenzug-weg` 25 %, `schiefe-ebene` 24 % | das Begründen (die Übung rechnet nur Kraft oder Seilweg aus); die längere Strecke rechnet nur flaschenzug-weg |

## Stromkreis und Ohmsches Gesetz (`stromkreis`, NT.5.2)

### NT.5.2.b — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Veränderungen in Stromkreisen mithilfe geeigneter Messgeräte untersuchen und einfache Regeln aufstellen (z.B. mehr/weniger Lämpchen, Serie-/Parallelschaltung) — *parallel-zweig vergleicht Zweig- und Batteriestrom und begründet im Lösungsweg mit der Knotenregel (NT.5.2.d); als Regel zur Parallelschaltung hier gezählt* | `parallel-dazu` 23 %, `serie-dazu` 22 %, `serie-kabel` 15 %, `serie-weg` 17 %, `parallel-weg` 15 %, `parallel-zweig` 8 % | das Untersuchen mit Messgeräten und das Aufstellen der Regeln (die Übung fragt die Regeln ab; der Strommesser steht nur im Text) |

### NT.5.2.c — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| die massgeblichen Grössen eines einfachen Stromkreises miteinander in Beziehung setzen und Gesetzmässigkeiten experimentell herleiten. Stromstärke, Spannung, Widerstand, Ohm'sches Gesetz — *Ein Teil mit den Verbindlichen Inhalten: Sie nennen die Grössen und das Gesetz, die der Satz in Beziehung setzt. Formel U = R · I und Einheiten sind Annahme der Übung, die Lehrplanseite nennt keine* | `ohm-U` 33 %, `ohm-I` 33 %, `ohm-R` 34 % | das experimentelle Herleiten der Gesetzmässigkeiten |

### NT.5.2.d — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| die massgeblichen Grössen eines verzweigten Stromkreises miteinander in Beziehung setzen, Gesetzmässigkeiten experimentell herleiten sowie entsprechende Versuchsprotokolle anfertigen. Knoten- und Maschenregel — *Ein Teil mit den Verbindlichen Inhalten (Knoten- und Maschenregel sind die Gesetzmässigkeiten des Satzes). masche und serie-ohm rechnen an einer unverzweigten Serienschaltung; serie-ohm (Ohm'sches Gesetz mit R1 + R2) passt nur ungefähr: Die Summe der Widerstände folgt aus der Maschenregel, ein verzweigter Stromkreis ist es nicht* | `knoten` 24 %, `masche` 22 %, `knoten-fehlt` 25 %, `parallel-ohm` 17 %, `serie-ohm` 13 % | das experimentelle Herleiten der Gesetzmässigkeiten und das Anfertigen von Versuchsprotokollen |

## Aussagen prüfen (`aussagen`, MA.1.B.2)

### MA.1.B.2.h — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Aussagen zu arithmetischen Gesetzmässigkeiten erforschen, begründen oder widerlegen (z.B. eine ungerade Summe entsteht durch Addition einer geraden und einer ungeraden Zahl; die Produkte vier aufeinanderfolgender Zahlen sind durch 24 teilbar) — *Die Typen sind nach der Frageform geschnitten, nicht nach Inhalt* | `wahr` 66 %, `falsch` 34 % | das Erforschen, Begründen oder Widerlegen selbst: gewählt wird die eine wahre (wahr) oder die eine falsche Aussage (falsch) |
| die Anzahl Nachkommastellen bei Produkten und Quotienten von Dezimalzahlen erforschen und begründen (z.B. mit Rechner) — *Kopfkommentar: „Nicht in dieser Übung“ (ohne Entscheid-Kürzel)* | **offen** | alles |

### MA.1.B.2.j — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| algebraische Aussagen durch Einsetzen von Zahlen überprüfen (z.B. a³ + 5a ist durch 6 teilbar: 4³ + 5⋅4 = 84 → 84 : 6 = 14; [Bild formel8.png]; 2⁶ = (2²)³ = 2²˙³ = 4³; 2⁸ = 4⁴; 3⁴ = 9²) — *Auswahl unter vier Aussagen; die Typen sind nach der Frageform geschnitten, nicht nach Inhalt. Abschrift des Formelbilds formel8: a²ᵇ = (a²)ᵇ* | `wahr` 66 %, `falsch` 34 % | — |

### MA.1.B.2.k — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Ergebnisse durch Verallgemeinern begründen (z.B. das Quadrat einer Zahl ist um 1 grösser als das Produkt der beiden Nachbarzahlen: 4 · 4 -1 = 3 · 5 → a² - 1 = (a - 1)(a + 1)) — *Aussagen wie a² − 1 = (a − 1)(a + 1) stehen in der Liste der Stufe k und kommen in wahr/falsch vor (Teil 2), verlangt wird aber nur das Auswählen, kein Begründen* | **offen** | alles |
| Term- und Äquivalenzumformungen überprüfen | `wahr` 67 %, `falsch` 33 % | Äquivalenzumformungen (Gleichungen): die Liste enthält nur Termumformungen und Teilbarkeitsaussagen |

## Folgen und Muster (`folgen`, MA.1.C.2)

### MA.1.C.2.g — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Gesetzmässigkeiten im Bereich der natürlichen Zahlen mit Beispielen konkretisieren (z.B. Quadratzahlen haben eine ungerade Anzahl Teiler → 16: 1, 2, 4, 8, 16) | `teiler` 30 % | die Gesetzmässigkeit selbst: teiler fragt nur die Anzahl Teiler einer Zahl (Quadratzahl oder beliebig) |
| Brüche mit den Nennern 2, 3, 4, 5, 6, 8, 10 darstellen und vergleichen sowie Darstellungen interpretieren (z.B. Kreis-, Rechteckmodell, Zahlenstrahl) | **offen** | alles |
| Zahlenfolgen mit positiven rationalen Zahlen beschreiben (z.B. ½, ¼, ⅛, ...; 0.7, 0.77, 0.777, ...) | `folge-dezimal` 70 % | beide Beispielarten des Lehrplans: Folgen mit Brüchen (½, ¼, ⅛, …) und Folgen ohne gleichen Abstand (0.7, 0.77, 0.777, …); folge-dezimal hat nur gleiche Abstände mit Dezimalzahlen und fragt die nächste Zahl, kein Beschreiben |

### MA.1.C.2.h — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Zahlenrätsel mathematisieren und erfinden (z.B. wenn man eine Zahl verdreifacht und um 3 vergrössert gibt es 33) | `raetsel` 49 % | Zahlenrätsel erfinden |
| Figurenfolgen numerisch beschreiben (z.B. die Anzahl sichtbarer Seiten bei Würfeltürmen mit 1, 2, 3, 4, ... Würfeln) | `figuren-linear` 35 %, `figuren-quadrat` 16 % | die Figuren als Bild (nur Wertetabelle, Kopfkommentar: Bilder folgen) |

### MA.1.C.2.i — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Zusammenhänge zwischen Termen und Figuren beschreiben (z.B. n(n+1) als Rechteck interpretieren; Die Summe der ersten n ungeraden Zahlen als Quadrat darstellen: 1 + 3 + 5 + 7 = 4 · 4) | `gerade-summe` 34 %, `ungerade-summe` 33 %, `rechteckzahl` 33 % | die Figur (Rechteck, Quadrat) als Bild; rechteckzahl nennt die Regel n · (n + 1) im Aufgabentext, gerechnet wird nur ein Wert |
| Terme zu Streckenlängen, Flächeninhalten und Volumen bilden und entsprechende Terme deuten | **offen** | alles |
| arithmetische und algebraische Terme veranschaulichen, insbesondere mit Text, Symbolen und Skizzen (z.B. das Produkt zweier Binome, die Summe dreier aufeinanderfolgender Zahlen) | **offen** | alles |
| arithmetische Gesetzmässigkeiten mit Buchstabentermen verallgemeinern (z.B. 3(4 + 5) = 3 · 4 + 3 · 5 → a(b + c) = ab + ac) — *Die Summen-Typen (Teil 1) wenden eine Verallgemeinerung an, verlangen sie aber nicht als Buchstabenterm* | **offen** | alles |
| Erweiterung: arithmetische Strukturen algebraisch formulieren (z.B. die Produkte 2 · 3 · 4 / 3 · 4 · 5 / 5 · 6 · 7, ... sind durch 6 teilbar → a(a + 1) · (a + 2) · ⅙ ist ganzzahlig) — *Katalog ohneE: [„i“] (wie PA), ohne Entscheid-Kürzel im Kopfkommentar* | **offen** | alles |

### MA.1.C.2.j — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Terme geometrisch interpretieren (z.B. a² · b als Quader mit quadratischer Grundfläche, a · b als Rechteck mit den Seitenlängen a und b und a + b als Summe zweier Strecken) | **offen** | alles |
| lineare Figurenfolgen in einen Term übertragen (z.B. die Anzahl benötigte Hölzchen, um eine Reihe von n gleichseitigen Dreiecken zu legen, als 2n + 1) | `term-linear` 100 % | die Figuren als Bild (beschrieben in Worten und als Wertetabelle) |

## Sachsituationen (`sachsituationen`, MA.3.C.2)

### MA.3.C.2.f — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| erkennen proportionale und lineare (Erweiterung: indirekt proportionale) Zusammenhänge in Sachsituationen (z.B. Taxipreis bei Grundtaxe und festem Preis/km) — *Die Erweiterung in Klammern (indirekt proportionale) steht zusätzlich als eigener Teil und ist hier nicht mitgemeint* | `dreisatz` 48 %, `taxi` 52 % | das Erkennen (die Art des Zusammenhangs ist in der Aufgabe vorgegeben) |
| (Erweiterung: indirekt proportionale) — *Erweiterung in Klammern innerhalb eines Punkts (darum ohne „Erweiterung: “ vorn). Katalog ohneE f: „noch nicht in der Übung“* | **offen** | alles |
| Wertepaare sowie Funktionsgraphen im Koordinatensystem darstellen (z.B. Zwischenzeiten in 10'000 m - Läufen; Gewicht bzw. Masse und Preis von Lebensmitteln) | **offen** | alles |
| Alltagssituationen (z.B. Flächeninhalt eines Zimmers; Geschwindigkeit eines Autos; Benzinverbrauch) in mathematische Sprache übersetzen, die richtigen Grössen identifizieren und geeignete Masseinheiten wählen — *dreisatz und taxi übersetzen Text in eine Rechnung (eingetragen beim ersten Teil); Grössen identifizieren und Einheiten wählen wird nicht geübt, die Einheit steht hinter dem Feld* | **offen** | alles |

### MA.3.C.2.g — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| die Abhängigkeit zweier Grössen mit einem Funktionsgraphen darstellen — *der Graph ist gegeben, dargestellt wird nichts* | **offen** | alles |
| Graphenverläufe interpretieren (z.B. Weg - Zeit - Diagramm zu einem 400 m - Lauf) | `weg-zeit` 50 % | den Verlauf deuten (die Gerade ist gleichförmig; gefragt ist ein abgelesener Wert) |
| Erweiterung: zu Wertetabellen eine geeignete Skalierung im Koordinatensystem wählen — *Katalog ohneE g: „noch nicht in der Übung“* | **offen** | alles |
| Erweiterung: lineare funktionale Zusammenhänge mit einem Term beschreiben (z.B. Wechselkurse) — *Katalog ohneE g: „noch nicht in der Übung“; aufgaben.js: „hier nur in der Challenge“* | **offen** | alles |
| (MA.3.C.2.f) erkennen proportionale und lineare (Erweiterung: indirekt proportionale) Zusammenhänge in Sachsituationen (z.B. Taxipreis bei Grundtaxe und festem Preis/km) — *Taxitarif rückwärts (Kilometer aus dem Preis) gehört zum Taxipreis der Stufe f; das Rückwärtsrechnen steht dort nicht ausdrücklich. Die Erweiterung in Klammern ist nicht mitgemeint* | `taxi-rueckwaerts` 50 % | — |

### MA.3.C.2.h — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Wertetabellen, Diagramme, Sachtexte, Terme und Graphen einander zuordnen und interpretieren | `tabelle-term` 51 %, `text-term` 49 % | Diagramme und Graphen (nur Tabelle → Term und Text → Term); das Interpretieren |
| Sachsituationen nach funktionalen, statistischen und probabilistischen Gesichtspunkten bearbeiten, angemessene Entscheidungen treffen und Lösungswege mit Wertetabellen, Diagrammen, Texten, Termen und Graphen darstellen | **offen** | alles |

## Koordinaten (`koordinaten`, MA.2.C.4)

### MA.2.C.4.h — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Lagebeziehungen von Objekten massstabgetreu in einem Koordinatensystem darstellen (z.B. den Pausenplatz) | `massstab` 100 % | Lagebeziehungen darstellen (eintragen oder zeichnen); massstab liest nur einen achsenparallelen Abstand ab und rechnet ihn mit dem Massstab um |

### MA.2.C.4.i — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Figuren im kartesischen Koordinatensystem darstellen (auch mit negativen und nicht ganzzahligen Koordinaten) — *Die Figuren werden gezeigt, nicht dargestellt; negative Koordinaten kommen in allen Typen der Stufe vor, nicht ganzzahlige nicht (Kopfkommentar: folgen)* | **offen** | alles |
| in einem Koordinatensystem Abstände und Flächeninhalte berechnen — *Abstände: abstand, abstand-schraeg; Flächeninhalte: rechteck, dreieck (nur rechtwinklig mit Katheten auf Gitterlinien; beliebige Dreiecke nur in der Challenge)* | `abstand` 26 %, `abstand-schraeg` 12 %, `rechteck` 32 %, `dreieck` 29 % | — |

### MA.2.C.4.j — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| geometrische Abbildungen im Koordinatensystem darstellen (z.B. Spiegelung eines Dreiecks an der Geraden x = 2) | `spiegel-x` 32 %, `spiegel-y` 29 %, `ursprung` 39 % | andere Abbildungen (Verschieben, Drehen); das Abbilden ganzer Figuren (das Beispiel spiegelt ein Dreieck) und das Darstellen — gefragt ist eine Koordinate eines gespiegelten Punkts |

## Brüche rechnen (`brueche`, MA.1.A.3)

### MA.1.A.3.f — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Dezimalzahlen bis 5 Wertziffern addieren und subtrahieren (im Kopf oder mit Notieren eigener Rechenwege, z.B. 30.8 + 5.6) — *„bis 5 Wertziffern“ wie RZ2 a: beide Zahlen zusammen, wie 30.8 + 5.6* | `dezimal-plus-minus` 14 % | — |
| Brüche mit den Nennern 2, 3, 4, 5, 6, 8, 10, 20, 50, 100 am Rechteckmodell kürzen, erweitern, addieren und subtrahieren — *jede Aufgabe mit ihrem Rechteckmodell (E1-6 a); Nenner nur aus der Liste, auch der ungekürzte beim Kürzen und der Zielnenner beim Erweitern; bei plus und minus der gemeinsame Nenner höchstens 100 (Annahme)* | `kuerzen` 14 %, `erweitern` 14 %, `plus` 14 %, `minus` 17 % | — |
| Grundoperationen mit dem Rechner ausführen — *die einzige Aufgabe der Stufe mit Rechner (rechner an der Aufgabe, E1-4 a); mal und geteilt auf zwei Nachkommastellen gerundet* | `rechner` 13 % | — |
| (MA.1.A.1.h) Brüche (Nenner 2, 3, 4, 5, 6, 8, 10, 20, 50, 100, 1'000), Dezimalzahlen und Prozentzahlen je in die beiden anderen Schreibweisen übertragen — *alle sechs Richtungen gleich oft; Bruch → Dezimalzahl übt auch rationale-zahlen in MA.1.A.3.g (bruch-dezimal)* | `umschreiben` 14 % | die Nenner 3 und 6 (periodische Dezimalzahlen, RZ1 a) |

### MA.1.A.3.g — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Dezimalzahlen bis 5 Wertziffern multiplizieren und die Ergebnisse überprüfen (im Kopf oder mit Notieren eigener Rechenwege, z.B. 308 · 52; 12 · 0,3) | in `rationale-zahlen` | — |
| Brüche mit den Nennern 2, 3, 4, 5, 6, 8, 10, 20, 50, 100 am Rechteckmodell multiplizieren — *jede Aufgabe mit ihrem Rechteckmodell (mal: Überlappung, ganz mal: so viele Modelle wie die ganze Zahl; E1-6 a); Nenner nur aus der Liste; bei mal das Produkt der Nenner höchstens 100 (Annahme)* | `mal` 49 %, `ganz-mal` 28 % | — |
| Brüche mit den Nennern 2, 3, 4, 5, 6, 8, 10, 20, 50, 100, 1'000 als Dezimalzahlen schreiben | in `rationale-zahlen` | — |
| bestimmen, wie oft Stammbrüche in ganzen Zahlen enthalten sind (z.B. Wie viele Male ist ⅕ in 2 enthalten? → 2 : ⅕) | `stammbruch` 23 % | — |

### MA.1.A.3.i — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| die Grundoperationen mit rationalen Zahlen ausführen | `plus-minus-negativ` 26 %, `mal-negativ` 25 %, `geteilt` 26 % | — |
| Wurzeln und Potenzen mit dem Rechner berechnen (z.B. 4³ · 4³ = 4'096; 4³ + 4³ = 128; ³√8000) | in `rationale-zahlen` | — |
| Erweiterung: die Grundoperationen mit gewöhnlichen Brüchen mit Variablen ausführen und mit Zahlen belegen: [Bild formel6a.png]; [Bild formel6b.png]; [Bild formel6c.png]; [Bild formel6d.png] — *variablen-bruch: Variable im Zähler (2a/3 + a/4, 2a/3 : 4/5), Antwort gekürzt (Form bruchterm, kern 1.29.0); belegen: die vier Formeln mit Zahlen. Abschrift der Formelbilder (docs/lernsteig/lehrplan/mathematik_zyklus3.md, formel1 und formel6d am Bild nachgesehen): formel6a a/b + c/d; formel6b a/b − c/d; formel6c a/b · c/d; formel6d a : c/b : d = a/c · b/d* | `variablen-bruch` 12 %, `belegen` 12 % | Variablen im Nenner (a/b + c/d mit Variablen: der Term-Leser teilt nur durch Zahlen) |

## Lineare Funktionen (`lineare-funktionen`, MA.3.A.3)

### MA.3.A.3.j — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| den Schnittpunkt zweier Geraden algebraisch und graphisch bestimmen | `schnittpunkt` 100 % | graphisch (die Aufgabe gibt nur die Gleichungen, kein Graph) |

### MA.3.A.3.k — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| zu linearen Funktionen den Funktionsgraphen zeichnen — *aufgaben.js: „Zeichnen folgt“, ohne Entscheid-Kürzel* | **offen** | alles |
| die Steigung, den y-Achsenabschnitt und die Nullstelle bestimmen | `steigung-graph` 25 %, `abschnitt-graph` 24 %, `steigung-punkte` 26 %, `nullstelle` 26 % | — |

## Binome und Gleichungen (`binome-gleichungen`, MA.1.A.4)

### MA.1.A.4.l — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| quadratische Gleichungen durch Faktorzerlegung lösen (z.B. x² - 4 = 0) | `quadratisch-differenz` 20 %, `quadratisch-faktoren` 20 % | Faktorzerlegung eines Trinoms (x² + px + q = 0): quadratisch-faktoren gibt die Faktoren schon vor, das Zerlegen steht nur in der Challenge |
| Terme mit Binomen umformen und dabei die binomischen Formeln anwenden (z.B. [Bild formel4.png]) — *Abschrift des Formelbilds formel4: 4a² + 12ab² + 9b⁴ = (2a + 3b²)²* | `binom` 40 % | die Richtung des Beispiels (Summe als Quadrat eines Binoms schreiben) und Binome mit Koeffizienten oder Potenzen (2a + 3b²); binom multipliziert nur (x ± b)² und (x + b)(x − b) aus |
| die Rechenregeln [Bild formel1.png] — *Abschrift des Formelbilds formel1: aˣ · aʸ = a⁽ˣ⁺ʸ⁾; potenzregel nur mit Zahlbasis* | `potenzregel` 21 % | — |
| Potenz vor Punkt vor Strich anwenden | **offen** | alles |

### MA.1.A.4.m — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Bruchterme mit Binomen umformen — *Kopfkommentar: „Nicht in dieser Übung“ (ohne Entscheid-Kürzel)* | **offen** | alles |
| Rechengesetze bei Termen mit Potenzen und Wurzeln | `potenzgesetz` 25 % | Wurzeln und Terme mit Variablen: potenzgesetz rechnet nur (aˣ)ʸ und aˣ : aʸ mit Zahlbasis |
| bei Zahlen in wissenschaftlicher Schreibweise befolgen — *Rechnen in wissenschaftlicher Schreibweise übt zehnerpotenzen nur in der Challenge (MA.1.A.3.j)* | **offen** | alles |
| Bruchgleichungen mit der Unbekannten im Nenner (z.B. [Bild formel2.png]) — *Abschrift des Formelbilds formel2: 3/x + 2 = 4/x + 3* | `bruchgleichung` 26 % | — |
| Gleichungen mit einem Parameter lösen (z.B. ax + a = 7) — *Kopfkommentar: „Nicht in dieser Übung“ (ohne Entscheid-Kürzel)* | **offen** | alles |
| lineare Gleichungssysteme mit 2 Unbekannten lösen | `system` 49 % | — |

## Grammatik: Fälle, Wortarten, Formen (`grammatik`, D.5.D.1)

### D.5.D.1.e — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Präpositionen mithilfe einer reduzierten Liste benennen — *Die Sätze enthalten Fälle nach Präpositionen, die Präposition selbst wird nicht benannt* | **offen** | alles |
| in typischen Fällen Nominativ, Akkusativ, Dativ und Genitiv mithilfe der Ersatzprobe bestimmen | `fall` 100 % | — |
| Wörter in Stamm-, Vor- und Nachmorphem zerlegen | **offen** | alles |
| einen Verbenfächer bilden und die Satzglieder Nominal- und Präpositionalgruppe unterscheiden | **offen** | alles |

### D.5.D.1.f — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Nomen, Verb und Adjektiv mithilfe formaler Kriterien sowie Pronomen mithilfe der umfassenden Pronomenliste bestimmen sowie den Rest als Partikel benennen | `wortart` 60 % | — |
| die Partikeln Präposition und Konjunktion in typischen Fällen bestimmen — *grammatik.js zählt Präpositionen und Konjunktionen zu den Partikeln (grammatik.js:8); als eigene Begriffe nicht gefragt* | **offen** | alles |
| Präsens, Präteritum, Perfekt und Futur — *zeitform bietet dazu Plusquamperfekt an (D.5.D.1.d: Erfahrungen mit Futur und Plusquamperfekt), „Futur“ meint Futur I* | `zeitform` 40 % | — |
| Infinitiv und Personalform bestimmen — *zeitform fragt nur die Zeitform (Optionen aufgaben.js:24)* | **offen** | alles |
| Stamm-, Vor- und Nachmorphem bestimmen | **offen** | alles |
| mithilfe eines Verbenfächers Satzglieder bestimmen | **offen** | alles |
| kennen die Begriffe Subjekt und Objekt — *Subjekt und Objekte bestimmt erst Stufe g (satzglied)* | **offen** | alles |

### D.5.D.1.g — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| kennen die Begriffe Indikativ, Imperativ, Konjunktiv I und II sowie Aktiv und Passiv | `modus` 36 %, `genus` 29 % | — |
| einen Verbenfächer bilden und formal die Satzglieder Nominal- und Präpositionalgruppe unterscheiden | **offen** | alles |
| bei klaren Beispielen zwischen Subjekt und Objekt unterscheiden | `satzglied` 34 % | — |
| einfache und zusammengesetzte Sätze unterscheiden | **offen** | alles |

## Rechtschreibung (`rechtschreibung`, D.5.E.1)

### D.5.E.1.d — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Wörter in ihre Morpheme zerlegen. Sie nutzen dies für die Stammregel — *Die Stammregel bei e/ä übt eae; Morpheme als solche nicht* | **offen** | alles |
| Wörter mit regulärer Laut-Buchstaben-Zuordnung im gedruckten und elektronischen Schul-Wörterbuch mit Sicherheit auffinden — *Kopfkommentar aufgaben.js:7 nimmt das Wörterbuch aus, ohne Entscheid-Kürzel* | **offen** | alles |
| folgende Rechtschreibregeln in dafür konstruierten Übungen anwenden, wobei die Regel inklusive relevanter Ausnahmen jeweils vorliegt: ie-Regel | `ie` 18 % | — |
| f-/v-Regel | `fv` 17 % | — |
| e-/ä-Schreibung (Stammregel) | `eae` 18 % | — |
| Doppelkonsonantenregel (inkl. ck-/tz-Regel) | `cktz` 21 % | Doppelkonsonanten ausser ck und tz (etwa ll, mm, nn, ss): cktz übt nur ck und tz (rechtschreibung.js:22–26, 49–54) |
| Grossschreibung für konkrete und gebräuchliche abstrakte Nomen (z.B. Liebe, Wut, Glück) | `gross` 15 % | — |
| Trennregel — *Kopfkommentar aufgaben.js:7 nimmt die Trennregel aus, ohne Entscheid-Kürzel* | **offen** | alles |
| Komma bei Aufzählungen | `komma-aufzaehlung` 12 % | — |
| Komma zwischen übersichtlichen Verbgruppen | **offen** | alles |

### D.5.E.1.e — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Wörter in ihre Morpheme zerlegen. Sie können dies für die Gross-Klein-Schreibung nutzen (z.B. Frei-heit, Entdeck-ung) | `nachmorphem-gross` 57 %, `nachmorphem-klein` 43 % | das Zerlegen als eigener Schritt (die Aufgabe zeigt das ganze Wort, gefragt ist nur gross oder klein; rechtschreibung.js:67–76 und folgende) |

### D.5.E.1.f — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| folgende Rechtschreibregeln in dafür konstruierten Übungen anwenden: Nomen aus Verben mit vorhergehender Präposition plus Artikel in typischen Fällen (z.B. beim Essen, nach dem Essen) — *verb-klein ist das Gegenstück (Infinitiv nach Modalverb oder „gehen“ bleibt klein)* | `verb-nominalisiert` 39 %, `verb-klein` 25 % | — |
| Höflichkeitspronomen "Sie" in Briefen — *hoeflich in Briefanreden („Sehr geehrte …“), nicht-hoeflich als Gegenstück ausserhalb von Briefen* | `hoeflich` 22 %, `nicht-hoeflich` 14 % | — |

### D.5.E.1.g — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| Strategien nutzen, um auch Wörter mit nicht-eindeutiger Laut-Buchstaben-Zuordnung im gedruckten und elektronischen Wörterbuch aufzufinden — *Kopfkommentar aufgaben.js:7 nimmt das Wörterbuch aus, ohne Entscheid-Kürzel* | **offen** | alles |
| folgende Rechtschreibregel in dafür konstruierten Übungen anwenden: Nomen aus Adjektiven mit vorhergehendem Pronomen in typischen Fällen (z.B. alles Gute, etwas Schönes, viel Schlechtes) | `adjektiv-nominalisiert` 38 % | — |
| Komma bei infinitivischen Verbgruppen, bei Einschüben und Relativsätzen — *komma-infinitiv nur mit um, ohne, statt, anstatt* | `komma-relativ` 24 %, `komma-infinitiv` 22 %, `komma-einschub` 16 % | — |

## English grammar (`englisch-grammatik`, FS1E.5.D.1)

### FS1E.5.D.1.b — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| beim Sprechen und Schreiben einige einfache grammatische Strukturen verwenden, machen dabei aber noch Fehler (z.B. Konjugationsformen wichtiger Verben, Personalpronomen in Subjektstellung, einfache Frage mit Fragewort) | `fragewort` 32 %, `be` 24 %, `pronomen-subjekt` 24 %, `have` 21 % | — |
| auf bestimmte Situationen bezogene grammatische Strukturen mit Unterstützung erkennen und für das Verständnis nutzen (z.B. Zeitangaben, Ortsangaben) | **offen** | alles |

### FS1E.5.D.1.c — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| beim Sprechen und Schreiben einfache grammatische Strukturen verwenden, machen dabei aber teilweise noch Fehler (z.B. Wortfolge in einfachen Aussagesätzen und Fragen, Verben mit zwei Objekten, unregelmässige Pluralformen, häufige Präpositionen) | `praeposition` 24 %, `plural` 22 %, `wortfolge-frage` 19 %, `wortfolge-aussage` 19 %, `zwei-objekte` 16 % | — |
| in Texten mit Unterstützung einfache grammatische Strukturen erkennen und für das Verständnis nutzen (z.B. Wortfolge im Satz, Frage mit Fragewort oder Intonation, Konjugationsformen) — *wortfolge-frage und wortfolge-aussage lassen den richtigen Satz wählen, das kommt dem Erkennen nahe; Konjugationsformen und Intonation im Text nicht* | **offen** | alles |

### FS1E.5.D.1.d — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| beim Sprechen und Schreiben auch einige komplexere grammatische Strukturen ausreichend korrekt verwenden (z.B. Hilfs- und Modalverben, verschiedene Formen der Negation, Demonstrativ- und Reflexivpronomen) | `negation` 17 %, `modal` 13 %, `demonstrativ` 13 %, `reflexiv` 13 % | Hilfsverben als eigenes Thema (sie kommen nur in negation und zeitform vor) |
| in Texten auch komplexere Strukturen erkennen und für das Verständnis nutzen (z.B. Zeitform der Verben, häufige Modalverben, Konjunktionen zur Begründung, Possessiv- und Reflexivpronomen) — *Modalverben und Reflexivpronomen im ersten Teil gezählt; konjunktion übt neben because auch so (Folge, nicht begründend); Zeitformen mit den Namen nach ZF1 a* | `konjunktion` 16 %, `possessiv` 14 %, `zeitform` 15 % | — |

## Français : grammaire (`franzoesisch-grammatik`, FS2F.5.D.1)

### FS2F.5.D.1.b — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| beim Sprechen und Schreiben einige einfache grammatische Strukturen verwenden, machen dabei aber noch Fehler (z.B. Konjugationsformen wichtiger Verben, Personalpronomen in Subjektstellung, einfache Frage mit Fragewort) | `interrogatif` 17 %, `etre` 16 %, `verbe-er` 16 %, `avoir` 15 %, `faire` 12 %, `pronom-sujet` 11 %, `aller` 13 % | — |
| auf bestimmte Situationen bezogene grammatische Strukturen mit Unterstützung erkennen und für das Verständnis nutzen (z.B. Zeitangaben, Ortsangaben) | **offen** | alles |

### FS2F.5.D.1.c — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| beim Sprechen und Schreiben einfache grammatische Strukturen verwenden, machen dabei aber teilweise noch Fehler (z.B. Wortfolge in einfachen Aussagesätzen und Fragen, Verben mit zwei Objekten, unregelmässige Pluralformen, häufige Präpositionen) | `preposition` 29 %, `pluriel` 27 %, `ordre-question` 16 %, `deux-objets` 14 %, `ordre-phrase` 15 % | — |
| in Texten mit Unterstützung einfache grammatische Strukturen erkennen und für das Verständnis nutzen (z.B. Wortfolge im Satz, Frage mit Fragewort oder Intonation, Konjugationsformen) — *ordre-question und ordre-phrase lassen den richtigen Satz wählen, das kommt dem Erkennen nahe; Konjugationsformen und Intonation im Text nicht* | **offen** | alles |

### FS2F.5.D.1.d — am Wortlaut nachgelesen

| Inhalt des Lehrplans | Abdeckung | Was fehlt |
|---|---|---|
| beim Sprechen und Schreiben auch einige komplexere grammatische Strukturen ausreichend korrekt verwenden (z.B. Hilfs- und Modalverben, verschiedene Formen der Negation, Demonstrativ- und Reflexivpronomen) | `negation` 13 %, `modal` 14 %, `demonstratif` 16 %, `reflexif` 16 % | Hilfsverben als eigenes Thema (sie kommen nur in negation und temps vor) |
| in Texten auch komplexere Strukturen erkennen und für das Verständnis nutzen (z.B. Zeitform der Verben, häufige Modalverben, Konjunktionen zur Begründung, Possessiv- und Reflexivpronomen) — *Modalverben und Reflexivpronomen im ersten Teil gezählt; conjonction übt neben parce que auch donc (Folge, nicht begründend)* | `conjonction` 11 %, `possessif` 15 %, `temps` 15 % | — |
