# Natur und Technik Zyklus 3 — Kompetenzstufen nach Lehrplan Volksschule SG

Quelle: sg.lehrplan.ch, 26 gesicherte Kompetenzseiten Natur und Technik (`index.php?code=a|6|2|<Bereich>|0|<Nr>`,
Roh-HTML in [quellen_nt/](quellen_nt/) `NT1.1.html` … `NT9.3.html`), Fassung „Lehrplan Volksschule August 2025“
(Fusszeile der Seiten). Ausgewertet am 2026-11-05 nur aus diesen Dateien, nicht im Browser gegengeprüft. Rahmen, Reichweite und die Bedeutung von GA, OP und Erweiterung für Real und Sek:
[lehrplan_sg_sek1.md](lehrplan_sg_sek1.md). Aufbau wie [mathematik_zyklus3.md](mathematik_zyklus3.md).

**Lesart der Tabellen**
- Natur und Technik ist ein Fach **nur des Zyklus 3**. Die Seiten enthalten nur Stufen mit `marker_z3` („Auftrag
  3. Zyklus“); die erste trägt die Zyklusziffer 3 (`zycode`). Einen **GA Zyklus 2 gibt es auf diesen Seiten nicht**.
  Der Anschluss steht als „Vorangehende Kompetenz“ im Fach NMG (Natur, Mensch, Gesellschaft) und ist je Kompetenz
  genannt, aber nicht ausgewertet.
- Marken: **GA** Grundanspruch (Klasse `mindestanspruch` an der Stufenzeile), **OP** Orientierungspunkt (Zyklus 3:
  Mitte 2. Oberstufe; `marker_z3_op` und `hr … op` stehen am Ende der Stufenzeile, die Stufe ist bis dahin
  bearbeitet). **E** Erweiterung: Auf keiner der 26 Seiten steht kursiver Text oder „Erweiterung:“ im Inhalt.
- **OP vor der ersten Stufe** (NT.1.3, NT.3.1 Aufbau 2, NT.5.3, NT.8.1, NT.8.3, NT.9.2): Dort steht vor Stufe a eine leere Zeile mit Pfeil,
  „Arbeit beginnt später im Zyklus“ (`kompetenz_arrow_later`), und der OP sitzt in dieser leeren Zeile. Lesart: Bis
  zum OP ist noch keine Stufe bearbeitet.
- **Zwei Aufbauten** auf einer Seite (NT.2.1, NT.3.1): Die Stufen heissen 1a, 1b … und 2a, 2b … (Titel `NT.2.1.1a`
  usw.), jeder Aufbau hat eigenen Zwischentitel, eigenen GA und eigenen OP.
- **VI** = „Verbindliche Inhalte“ (`span class="tooltip begriffe"`, auf der Seite grau hinterlegt): Begriffe, die die
  Stufe verbindlich festlegen. Wörtlich übernommen.
- Inhalte **sinngemäss** und gekürzt. Beispiele („z.B.“) und Begriffslisten sind übernommen, weil sie die Stufe
  festlegen. Für Aufgaben in einer Übung gilt der Wortlaut auf der Seite.
- **Formeln:** Auf keiner der 26 Seiten steht eine Formel, weder als Text noch als Bild (die einzigen Bilder sind
  Pfeile, OP-Zeichen und Logos). Auch wo die Seite „berechnen“ verlangt (NT.4.1.e, NT.5.1, NT.5.2) oder das Ohm'sche
  Gesetz nennt (NT.5.2.c), nennt sie keine Formel. Formeln für Übungen sind deshalb aus dem Lehrmittel zu belegen.
- „Für kurze Übungen (Lesart)“: welche Stufen sich für kurze Aufgaben mit eindeutiger Lösung eignen (Begriffe
  zuordnen, Rechnen mit Formeln, Einheiten). Das ist eine **Einschätzung**, kein Inhalt des Lehrplans.

Zusammengeführt am 2026-11-05 aus zwei Auswertungen (NT.1–NT.5 und NT.6–NT.9), beide nur aus den Roh-HTML,
nicht im Browser gegengeprüft. Anmerkungen beider Teile stehen am Schluss.

## Überblick: GA und OP je Kompetenz

| Kompetenz | GA Z2 | Stufen Z3 | OP Z3 | GA Z3 | Stufen mit Erweiterung |
|---|---|---|---|---|---|
| NT.1.1 Erkenntnisgewinnung beschreiben | — (NMG.5.3) | a–d | a | b | — |
| NT.1.2 Technische Alltagsgeräte | — (NMG.5.1) | a–d | a | b | — |
| NT.1.3 Nachhaltigkeit von Anwendungen | — (NMG.5.3) | a–c | vor a | a | — |
| NT.2.1 Stoffe untersuchen, ordnen — Aufbau 1 Stoffeigenschaften | — (NMG.3.3) | 1a–1c | 1a | 1a | — |
| NT.2.1 — Aufbau 2 Teilchenmodell | — (NMG.3.3) | 2a–2c | 2a | 2a | — |
| NT.2.2 Stoffe trennen | — (NMG.3.4) | a–c | c | c | — |
| NT.3.1 Stoffumwandlungen — Aufbau 1 Chemische Reaktionen | — (NMG.3.4) | 1a–1d | 1b | 1b | — |
| NT.3.1 — Aufbau 2 Nachweisreaktionen | — (NMG.3.4) | 2a–2c | vor 2a | 2a | — |
| NT.3.2 Stoffumwandlungen einordnen, erklären | — (NMG.3.4) | a–e | b | b | — |
| NT.3.3 Stoffe als globale Ressource | — (NMG.6.3) | a–d | a | c | — |
| NT.4.1 Energieformen, -umwandlungen | — (NMG.3.2) | a–f | c | d | — |
| NT.4.2 Speicherung, Bereitstellung, Transport von Energie | — (NMG.3.2) | a–f | c | d | — |
| NT.5.1 Bewegungen und Kräfte | — (NMG.3.1) | a–f | a | d | — |
| NT.5.2 Grundlagen der Elektrik | — (NMG.5.2) | a–e | c | c | — |
| NT.5.3 Elektrische und elektronische Schaltungen | — (NMG.5.2) | a–d | vor a | b | — |
| NT.6.1 Sinnesreize und Verarbeitung | — (NMG.4.1) | a–d | c | c | — |
| NT.6.2 Hören und Sehen | — (NMG.4.2, NMG.4.3) | a–d | b | c | — |
| NT.6.3 Optische Phänomene | — (NMG.4.3) | a–e | a | b | — |
| NT.7.1 Anatomie und Physiologie | — (NMG.1.4) | a–c | b | b | — |
| NT.7.2 Stoffwechselvorgänge | — (NMG.1.4) | a–c | a | b | — |
| NT.7.3 Fortpflanzung, Verhütung | — (NMG.1.5) | a–d | — | c | — |
| NT.7.4 Massnahmen gegen Erkrankungen | — (NMG.1.2) | a–c | a | b | — |
| NT.8.1 Artenvielfalt, Evolutionstheorie | — (NMG.2.4, NMG.2.5) | a–c | vor a | b | — |
| NT.8.2 Wachstum und Entwicklung | — (NMG.2.3) | a–c | b | b | — |
| NT.8.3 Genetik | — (NMG.2.3) | a–c | vor a | — | — |
| NT.9.1 Aquatische Ökosysteme | — (NMG.2.1, NMG.2.2) | a–c | b | b | — |
| NT.9.2 Terrestrische Ökosysteme | — (NMG.2.1, NMG.2.2) | a–c | vor a | b | — |
| NT.9.3 Einflüsse des Menschen | — (NMG.2.1, NMG.2.2, NMG.2.6) | a–c | a | b | — |

## 1 Wesen und Bedeutung von Naturwissenschaften und Technik verstehen

### NT.1.1 Wege zur Gewinnung naturwissenschaftlicher Erkenntnisse beschreiben und deren kulturelle Bedeutung reflektieren (`a|6|2|1|0|1`)

Zwischentitel: Physik, Chemie, Biologie, Technik: Prinzipien der Naturwissenschaften.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | OP | beschreiben, wie naturwissenschaftliche Erkenntnisse gewonnen werden (Was ist eine Beobachtung, eine naturwissenschaftliche Frage, eine Hypothese, ein Experiment? Rolle der Untersuchungsbedingungen); naturwissenschaftliche von nicht naturwissenschaftlichen Erkenntnissen unterscheiden (Chemie versus Alchemie, Astronomie versus Astrologie). VI: Naturwissenschaftliche Beobachtung; Naturwissenschaftliches Experimentieren |
| b | GA | Informationen zu Persönlichkeiten erschliessen (Galilei, le Verrier, Adams und Galle, Curie, Einstein, Team um Watson und Crick) und ableiten, was Naturwissenschaftler/innen machen, wie sie zu Erkenntnissen gelangen |
| c | | angeleitet Informationen über eine Erkenntnis zusammenstellen und kommunizieren, wie sie das Weltbild verändert hat (Kopernikanische Wende, Entdeckung des Magensaftes, Gravitationsgesetz, Rutherfords Streuversuch, Atomtheorie, Entdeckung der Kernenergie, Penizillin, Entdeckung der Gene, Urknalltheorie) |
| d | | generalisieren, wie naturwissenschaftliche Erkenntnisgewinnung abläuft und welchen Prinzipien sie unterliegt, und sie nicht naturwissenschaftlicher gegenüberstellen. VI: Prinzipien der Naturwissenschaften: grundsätzliche Verstehbarkeit der Welt, Einfachheit der Lösung, Objektivität und Reproduzierbarkeit, Beständigkeit und Vorläufigkeit, Grenzen der Erkenntnisse |

**Für kurze Übungen (Lesart):** a (Begriffe Beobachtung, Frage, Hypothese, Experiment zuordnen; naturwissenschaftlich
oder nicht: Chemie/Alchemie, Astronomie/Astrologie), d (Prinzipien der Naturwissenschaften erkennen). b und c sind
Recherche und Präsentation; allenfalls Persönlichkeit ↔ Entdeckung zuordnen, die Zuordnung steht aber nicht auf der
Seite.

### NT.1.2 Technische Alltagsgeräte bedienen und ihre Funktionsweise erklären (`a|6|2|1|0|2`)

Zwischentitel: Technik: Technik im Alltag.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | OP | Funktionsweise einfacher technischer Geräte erfassen und Komponenten nachbauen (Handbohrmaschine, Heissluftballon); einfache Fehlersuche bei nicht funktionierenden Geräten, Fehlfunktion genau beschreiben (defekte Lampe, Sicherung, Kabel richtig einstecken). VI: Einfache technische Geräte: Funktionsweise; Einfache Fehlersuche |
| b | GA | Anwendungsmöglichkeiten unter verschiedenen Rahmenbedingungen testen (erhöhte Reibung, tiefere Temperatur); Geräte austesten, hinterfragen, Verbesserungen vorschlagen (Schattenwurf und Neigungswinkel bei Solarzellen). VI: Testverfahren |
| c | | Grundprinzipien von Alltagsgeräten erkennen, vergleichen, präsentieren (wärmeerzeugende Geräte, Wärmepumpe, Lampen, Übersetzung Fahrrad, Zapfenzieher, Personenlift, Sicherungsautomat, Lautsprecher, Leuchtdiode, Solarzellen) |
| d | | Funktionsweise aktueller Technologien aus Sachtexten erfassen, künftige Anwendungen skizzieren (Geothermie, Informations- und Kommunikationstechnologie, Handy in Funkzellen, GPS, Flachbildschirm, Endoskop, Induktionsherd) |

**Für kurze Übungen (Lesart):** kaum. Allenfalls a (Fehlersuche als Auswahl: Lampe, Sicherung, Kabel) und c (Gerät ↔
Grundprinzip); die Prinzipien selbst nennt die Seite nicht, sie wären aus dem Lehrmittel zu belegen. b und d sind
Experiment und Recherche.

### NT.1.3 Nachhaltigkeit naturwissenschaftlich-technischer Anwendungen diskutieren (`a|6|2|1|0|3`)

Zwischentitel: Physik, Chemie, Biologie, Technik: Nachhaltigkeit von Anwendungen.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| (leer) | OP | Zeile ohne Inhalt: „Arbeit beginnt später im Zyklus“; OP vor Stufe a |
| a | GA | sich angeleitet über die Bedeutung von Anwendungen für den Menschen informieren, besonders Gesundheit, Sicherheit, Ethik (Gentechnik, Nanostoffe, Haltbarmachung von Milch, Antibiotika) |
| b | | sich angeleitet über die Nachhaltigkeit von Anwendungen informieren, Chancen und Risiken diskutieren (Verbrennungsmotoren, Kernenergie, Herstellung von Düngemittel, Computer) |
| c | | selbstständig Sachinformationen recherchieren, reflektieren, präsentieren (Auswirkungen bei Rohstoffmangel) |

**Für kurze Übungen (Lesart):** keine. Alle Stufen sind Informieren, Diskutieren und Präsentieren ohne eindeutige
Lösung.

## 2 Stoffe untersuchen und gewinnen

### NT.2.1 Stoffe untersuchen, beschreiben und ordnen (`a|6|2|2|0|1`)

Zwei Aufbauten.

**Aufbau 1** — Zwischentitel: Chemie, Physik: Stoffeigenschaften.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| 1a | GA, OP | Stoffeigenschaften nach Anleitung bestimmen, geeignete Messverfahren und -geräte einsetzen. VI: Schmelz- und Siedetemperatur, Dichte, Löslichkeit, pH-Wert, Brennbarkeit; Messgeräte |
| 1b | | Versuchsergebnisse vergleichen, Messgenauigkeit diskutieren. VI: Messverfahren, Messgenauigkeit |
| 1c | | Versuche zur Unterscheidung oder Gruppierung von Stoffen selbstständig planen, durchführen, auswerten |

**Aufbau 2** — Zwischentitel: Chemie, Physik: Teilchenmodell.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| 2a | GA, OP | Aggregatzustände und Zustandsänderungen mit dem Teilchenmodell erklären und veranschaulichen. VI: Aggregatzustände, Zustandsänderungen; Teilchenmodell: Energie, Anziehung, Abstände und Ordnung der Teilchen |
| 2b | | Grenzen des Teilchenmodells bei Stoffeigenschaften, Lösevorgängen, Stoffgemischen aufzeigen; Vorteile der Weiterentwicklungen Ladungsmodell und Elementarmagnetmodell beschreiben. VI: Ladungsmodell: elektrostatische Eigenschaften, elektrische Leitfähigkeit; Elementarmagnetmodell: Magnetismus, Magnetisierbarkeit |
| 2c | | Unterschiede zwischen Modell und Wirklichkeit aufzeigen |

**Für kurze Übungen (Lesart):** 1a (Stoffeigenschaft ↔ Messgerät oder Messverfahren zuordnen; Dichte rechnen und
Einheiten, die Formel steht nicht auf der Seite), 2a (Aggregatzustände und Zustandsänderungen benennen, Teilchenbild ↔
Zustand zuordnen), 2b (Eigenschaft ↔ passendes Modell: Teilchen-, Ladungs-, Elementarmagnetmodell). 1b, 1c und 2c
sind Versuch und Diskussion.

### NT.2.2 Stoffe aufgrund ihrer Eigenschaften gezielt trennen (`a|6|2|2|0|2`)

Zwischentitel: Chemie, Technik: Trennverfahren.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | | Stoffe nach ihrer Zusammensetzung benennen und nach naturwissenschaftlichen Prinzipien ordnen. VI: Reinstoff/Gemisch, Gemischarten, Metall/Nichtmetall, Element/Verbindung |
| b | | einfache Gemische nach Anleitung trennen, Vorgehen fachlich korrekt beschreiben. VI: Extraktion, Chromatografie, Destillation |
| c | GA, OP | Anwendungen der Trennverfahren im Alltag erkennen (Tee-, Kaffeezubereitung, Wäschereinigung, Kläranlage, Ölabscheider, Magnetscheide) |

**Für kurze Übungen (Lesart):** a (Reinstoff/Gemisch, Metall/Nichtmetall, Element/Verbindung einordnen), b
(Gemisch ↔ Trennverfahren Extraktion, Chromatografie, Destillation), c (Alltagsanwendung ↔ Trennverfahren). Gut
geeignet: alle drei Stufen haben feste Begriffslisten.

## 3 Chemische Reaktionen erforschen

### NT.3.1 Stoffumwandlungen untersuchen und beschreiben (`a|6|2|3|0|1`)

Zwei Aufbauten.

**Aufbau 1** — Zwischentitel: Chemie: Chemische Reaktionen.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| 1a | | Sicherheitsvorschriften und Regeln im Umgang mit Chemikalien und Geräten einhalten. VI: Laborführerschein: Gefahren- und Sicherheitshinweise nach globalem Klassifikations- und Einstufungssystem für Chemikalien GHS |
| 1b | GA, OP | Stoffumwandlungen beobachten, untersuchen, als materielle und energetische Umwandlung erkennen und in Fachsprache beschreiben (Kerzen- und Brennerflammen, Verbrennung, Gerinnung von Eiklar). VI: Chemische Reaktion, Reaktionsschema in Worten |
| 1c | | angeleitet Reaktionen mit Sauerstoff durchführen, protokollieren, Vermutungen experimentell prüfen. VI: Oxide, Korrosion/Korrosionsschutz |
| 1d | | Zusammenhänge und Gesetzmässigkeiten bei Reaktionen vermuten und prüfen (Einfluss der Temperatur, Erhaltung der Masse) |

**Aufbau 2** — Zwischentitel: Chemie, Technik: Nachweisreaktionen.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| (leer) | OP | Zeile ohne Inhalt: „Arbeit beginnt später im Zyklus“; OP vor Stufe 2a |
| 2a | GA | angeleitet Kohlenstoffdioxid, Sauerstoff, Zucker, Stärke und Proteine chemisch nachweisen. VI: Nachweisreaktionen |
| 2b | | neutrale, saure, basische Lösungen mit Indikatoren nachweisen (Rotkohlsaft, Universalindikator), Wirkungen von Säuren und Basen untersuchen; Neutralisationen nach Anleitung durchführen. VI: Eigenschaften Säuren/Basen, pH-Streifen, Neutralisation |
| 2c | | beim Untersuchen von Alltagsstoffen geeignete Nachweisverfahren wählen und einsetzen (Messstäbchen), Sicherheit und Sorgfalt beachten. VI: pH-Wert, Wasserhärte |

**Für kurze Übungen (Lesart):** 1a (GHS-Gefahrensymbole und ihre Bedeutung zuordnen), 1b (Reaktionsschema in Worten
ergänzen: Ausgangsstoffe → Produkte; chemische Reaktion oder nicht), 1c (Oxid und Korrosion als Begriffe), 2a (Stoff ↔
Nachweis; welcher Nachweis gehört zu Zucker, Stärke, CO₂ …), 2b und 2c (sauer, neutral, basisch nach pH-Wert oder
Indikatorfarbe). Die Nachweise selbst und die Indikatorfarben stehen nicht auf der Seite; sie wären aus dem
Lehrmittel zu belegen.

### NT.3.2 Stoffumwandlungen einordnen und erklären (`a|6|2|3|0|2`)

Zwischentitel: Chemie: Periodensystem und Modelle.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | | in der Entstehungsgeschichte des Periodensystems der Elemente PSE die Bedeutung des systematischen Beschreibens und Ordnens erkennen; Informationen zu den Elementen aus dem PSE herauslesen. VI: Element Metalle, Nichtmetalle, Edelgase |
| b | GA, OP | eine chemische Reaktion mit dem Teilchenmodell veranschaulichen; Energiediagramme skizzieren und Reaktionen zuordnen. VI: Kugelmodell; Energiediagramme |
| c | | an der Geschichte des Kern-Hülle-Modells die Grenzen von Modellen erkennen; Atome mit dem Kern-Hülle-Modell darstellen, Protonen und Neutronen als Kernbausteine benennen. VI: Masse-Ladungsmodell nach Thomson, Kern-Hülle-Modell nach Rutherford; PSE: Ordnungszahl, Atommasse, Hauptgruppen; Isotop |
| d | | Zusammenhänge zwischen Schalenmodell und PSE aufzeigen; Stoffumwandlungen als Veränderung der Anordnung von Teilchen und der chemischen Bindungen erklären. VI: Schalenmodell; Wertigkeit, Donator-Akzeptor-Konzept bei Redoxreaktionen, Bindungstypen, Edelgasregel |
| e | | Vielfalt der Stoffe auf Anordnung und Kombination der Atome zurückführen; Gesetzmässigkeiten mit Modellen erklären (Erhaltung der Masse, Reaktionsgeschwindigkeit). VI: Ionen-, Metall-, Molekülbindung; Modifikation |

**Für kurze Übungen (Lesart):** a (aus dem PSE ablesen: Metall, Nichtmetall, Edelgas), b (Energiediagramm ↔ Reaktion,
Reaktion im Kugelmodell), c (Ordnungszahl, Atommasse, Hauptgruppe ablesen; Protonen, Neutronen zählen; Isotop
erkennen), d (Schalenmodell ↔ PSE, Wertigkeit, Edelgasregel), e (Stoff ↔ Bindungsart Ionen-, Metall-, Molekülbindung).
Gut geeignet, weil eindeutige Werte und Begriffe; ab c über dem GA.

### NT.3.3 Stoffe als globale Ressource erkennen und nachhaltig damit umgehen (`a|6|2|3|0|3`)

Zwischentitel: Physik, Chemie, Biologie, Technik: Stoffkreisläufe.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | OP | Informationen zusammentragen und die Umwandlungsschritte vom Rohstoff zum Produkt darstellen (Flusswasser – Trinkwasser, Steinsalz – Kochsalz, Rohöl – Fraktionsprodukte). VI: Rohstoff und Produkt |
| b | | Stoffkreisläufe erklären und darstellen. VI: Rohstoff-, Kohlenstoffkreislauf |
| c | GA | lokale und globale Folgen der Rohstoffnutzung für die Umwelt aufzeigen, Möglichkeiten zum nachhaltigen Umgang zusammenstellen und einschätzen; Informationsquellen beurteilen (vertreten sie Interessen?). VI: Globale Ressourcen: Wasser, Luft, fossile Brennstoffe, Uran; Endlichkeit der Ressourcen |
| d | | selbstständig Informationen zum Recycling suchen, eigenes Recyclingverhalten reflektieren; Ideen zur Abfallverminderung und für weitere Recyclingkreisläufe entwickeln. VI: Wertstoffkreislauf, PET |

**Für kurze Übungen (Lesart):** a (Rohstoff ↔ Produkt zuordnen, Umwandlungsschritte ordnen), b (Stationen eines
Kreislaufs in Reihenfolge bringen; die Stationen stehen nicht auf der Seite). c und d sind Beurteilen und Reflektieren.

## 4 Energieumwandlungen analysieren und reflektieren

### NT.4.1 Energieformen und -umwandlungen analysieren (`a|6|2|4|0|1`)

Zwischentitel: Physik, Chemie, Biologie: Energieformen und Energieumwandlungen.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | | Vorgänge beschreiben, bei denen eine Energieform in eine andere umgewandelt wird (Verbrennung von Treibstoff, Verwertung der Nahrung im Körper, Berg hinunterschlitteln, Backofen, Glüh-, Halogen- oder Energiesparlampe). VI: Energieformen qualitativ: Lage-, Bewegungs-, elektrische, chemische und thermische Energie |
| b | | Energieumwandlungsketten schematisch darstellen, Energieformen und -wandler benennen (Bewegungsenergie – Generator – elektrische Energie – Heizung – thermische Energie). VI: Energieumwandlungsketten |
| c | OP | Bedeutung der Systemgrenzen bei Energieumwandlungen kennen; Prinzip der Energieerhaltung beschreiben und an Beispielen verdeutlichen |
| d | GA | umgewandelte Energie pro Zeit als Leistung experimentell erfassen (mechanische Leistung beim Treppensteigen als gewonnene Lageenergie pro Zeit; elektrische Leistung beim Wasserkochen als elektrische Energie pro Zeit); Arbeit als massgebliche Grösse der Energieumwandlung identifizieren |
| e | | Lage-, Bewegungs- und elektrische Energie berechnen (verschieden schwere Steine in verschiedene Höhen gehoben; verschieden lange Laufzeiten elektrischer Geräte); mechanische und elektrische Leistung berechnen |
| f | | Energieumwandlungen in lebenden Systemen erkennen und beschreiben. VI: Fotosynthese, Zellatmung |

**Für kurze Übungen (Lesart):** a (Vorgang ↔ Energieform vorher und nachher), b (Umwandlungskette ergänzen, Wandler
benennen), d (Leistung = Energie pro Zeit, so umschrieben auf der Seite; einfache Rechnung), e (Lage-, Bewegungs-,
elektrische Energie und Leistung rechnen, mit Einheiten). Die Formeln für e stehen **nicht** auf der Seite; sie wären
aus dem Lehrmittel zu belegen. e liegt über dem GA. f (Fotosynthese, Zellatmung als Umwandlung erkennen) als Zuordnung.

### NT.4.2 Herausforderungen zu Speicherung, Bereitstellung und Transport von Energie beschreiben und reflektieren (`a|6|2|4|0|2`)

Zwischentitel: Physik, (Chemie, Biologie): Speicherung, Bereitstellung und Transport von Energie.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | | Möglichkeiten der Isolation an Alltagsbeispielen beschreiben und ihre Wirkung vergleichen (Thermoskanne versus Glaskanne, grobmaschiger Wollpullover versus Baumwollhemd). VI: Wärmeleitung, Wärmestrahlung, Wärmeströmung; Isolation |
| b | | an Alltagsbeispielen zeigen, dass bei Energieumwandlungen fast immer ein Teil in thermische Energie umgewandelt wird. VI: Energieentwertung |
| c | OP | Möglichkeiten der Speicherung und Bereitstellung elektrischer Energie benennen und beschreiben (Batterie, Schwungrad, Dynamo, Generatoren in Energiewerken) |
| d | GA | Formen der Energiebereitstellung recherchieren und vergleichend analysieren; Wirkungsgrad von Energiewandlern vergleichen und bewerten (nicht nutzbare Energieformen, Inexistenz eines Perpetuum mobile). VI: Erneuerbare und fossile Energieträger |
| e | | wissen, wie Energie unter verschiedenen Rahmenbedingungen gespeichert und transportiert werden kann; Vor- und Nachteile diskutieren |
| f | | Erkenntnisse über Energie im Alltag anwenden, im Umgang mit Energieressourcen reflektiert handeln |

**Für kurze Übungen (Lesart):** a (Beispiel ↔ Wärmeleitung, -strahlung, -strömung), b (Energieentwertung erkennen),
c (Speicher benennen), d (Energieträger erneuerbar oder fossil; Wirkungsgrad vergleichen, als Rechnung nur mit einer
Formel aus dem Lehrmittel). e und f sind Diskussion und Handeln.

## 5 Mechanische und elektrische Phänomene untersuchen

### NT.5.1 Bewegungen und Wirkungen von Kräften analysieren (`a|6|2|5|0|1`)

Zwischentitel: Physik: Bewegungen und Kräfte.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | OP | gleichförmige Bewegungen in Diagrammen erkennen und darstellen |
| b | | Wirkungen von Kräften untersuchen und beschreiben (verformte Plastilinkugel nach dem Herunterfallen, Gurte beim Autofahren, Flugbahn eines Balls). VI: Angriffspunkt, Richtung und Betrag einer Kraft; Verformung, Bewegungs- und Lageänderungen durch Krafteinwirkung |
| c | | experimentell zeigen und in Diagrammen darstellen, dass die Gewichtskraft proportional zur Masse ist. VI: Umgang mit einem Kraftmesser |
| d | GA | Kräfte einordnen und darstellen; experimentell zeigen, dass einfache Maschinen die benötigten Kräfte verringern (Hebel, schiefe Ebene, Flaschenzug, Ketten-/Zahnradgetriebe). VI: Kräftediagramm |
| e | | begründen, dass einfache Maschinen die Kraft verringern, die Strecke aber verlängern (Hebel, schiefe Ebene, Flaschenzug). VI: Goldene Regel der Mechanik |
| f | | beschleunigte Bewegungen in Diagrammen erkennen und darstellen |

**Für kurze Übungen (Lesart):** a und f (Diagramm ↔ gleichförmig oder beschleunigt; aus einem Diagramm ablesen), b
(Angriffspunkt, Richtung, Betrag; Wirkung Verformung oder Bewegungsänderung zuordnen), c (Gewichtskraft proportional zur
Masse: Wertetabelle ergänzen; der Proportionalitätsfaktor steht nicht auf der Seite), d (Beispiel ↔ einfache Maschine),
e (Goldene Regel: halbe Kraft, doppelter Weg; als Rechnung, die Formel steht nicht auf der Seite). Gut geeignet für
Rechnen und Zuordnen. **Dichte** und **Geschwindigkeit** als Rechengrösse nennt diese Seite nicht (Dichte steht in
NT.2.1.1a als Stoffeigenschaft).

### NT.5.2 Grundlagen der Elektrik verstehen und anwenden (`a|6|2|5|0|2`)

Zwischentitel: Physik: Grundlagen der Elektrik.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | | erklären und mit Experimenten zeigen, dass der elektrische Strom verschiedene Wirkungen hat (Licht-, Wärme-, magnetische, chemische Wirkung) |
| b | | Veränderungen in Stromkreisen mit Messgeräten untersuchen, einfache Regeln aufstellen (mehr/weniger Lämpchen, Serie-/Parallelschaltung) |
| c | GA, OP | die massgeblichen Grössen eines einfachen Stromkreises in Beziehung setzen, Gesetzmässigkeiten experimentell herleiten. VI: Stromstärke, Spannung, Widerstand, Ohm'sches Gesetz |
| d | | die Grössen eines verzweigten Stromkreises in Beziehung setzen, Gesetzmässigkeiten herleiten, Versuchsprotokolle anfertigen. VI: Knoten- und Maschenregel |
| e | | Funktionsweise von Elektromotor und Generator beschreiben |

**Für kurze Übungen (Lesart):** a (Gerät ↔ Wirkung des Stroms), b (Serie oder parallel erkennen; was geschieht mit
mehr Lämpchen), c (Ohm'sches Gesetz rechnen mit Stromstärke, Spannung, Widerstand und Einheiten — GA und OP, am
deutlichsten für Rechenübungen), d (Knoten- und Maschenregel rechnen, über dem GA). Die Formel des Ohm'schen Gesetzes
und die Einheiten stehen **nicht** auf der Seite; sie wären aus dem Lehrmittel zu belegen. e als Beschreibung kaum.

### NT.5.3 Elektrische und elektronische Schaltungen untersuchen und analysieren (`a|6|2|5|0|3`)

Zwischentitel: Physik, Technik: Elektrische und elektronische Schaltungen.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| (leer) | OP | Zeile ohne Inhalt: „Arbeit beginnt später im Zyklus“; OP vor Stufe a |
| a | | Schalter, Dioden, veränderbare Widerstände sachgemäss einbauen, prinzipielle Funktion beschreiben (Bimetallstreifen, Reedkontakt, Relais, Leuchtdiode, Fotowiderstand, Heiss- oder Kaltleiterwiderstand). VI: Schaltplan, Vorwiderstand, Sperr- und Durchlassrichtung, Sensoren |
| b | GA | einfache Anwendungsprobleme analysieren, passende Schaltung entwerfen (Thermoschalter im Haarföhn, Rauchmelder) |
| c | | Entwicklung der Halbleitertechnologie recherchieren, Bedeutung für die Gesellschaft diskutieren |
| d | | einfache Transistorschaltungen bauen und analysieren (Alarmanlage, Feuchtigkeitsmelder); prinzipielle Funktion von Halbleitern beschreiben. VI: Schalter, Verstärker, Steuer-, Arbeitsstromkreis; n- und -p-Leiter, Dotierung (so auf der Seite) |

**Für kurze Übungen (Lesart):** a (Bauteil ↔ Funktion oder Sensor; Schaltzeichen im Schaltplan erkennen; leuchtet die
Diode in Sperr- oder Durchlassrichtung?), b (welche Schaltung löst das Problem, als Auswahl), d (Steuer- und
Arbeitsstromkreis unterscheiden). Schaltzeichen stehen nicht auf der Seite. c ist Recherche.

---

## 6 Sinne und Signale erforschen

### NT.6.1 Sinnesreize und deren Verarbeitung beschreiben, analysieren und beurteilen (`a|6|2|6|0|1`)

Zwischentitel: Biologie: Sinnesorgane und Reizweiterleitung. Vorangehend: NMG.4.1.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | | Bau und Vielfalt der Sinnesorgane mit der Lebensweise ausgewählter Tiere in Beziehung setzen (z.B. Anordnung der Augen bei Flucht- und Raubtieren, Seitenlinienorgan der Fische) |
| b | | beobachten, beschreiben, dokumentieren, wie ein Reiz eine Reaktion auslöst (z.B. Stimme und Körpergeruch führen zu Zuneigung oder Abneigung) |
| c | GA, OP | Reiz und Reaktion in das Zusammenspiel von Sinnesorgan, Nerven, Gehirn und Muskeln bzw. Drüsen einordnen. VI: Reflex, unbewusste Reaktion, bewusste Reaktion |
| d | | mit einfachen Versuchen nachweisen, dass jedes Lebewesen die Welt anders wahrnimmt (z.B. Farbwahrnehmung in der Dämmerung, Geschmacksempfinden der Zunge). VI: Intersubjektive Wahrnehmung der Welt |

**Für kurze Übungen (Lesart):** c — Kette Reiz → Sinnesorgan → Nerven → Gehirn → Muskel/Drüse in die richtige
Reihenfolge bringen; Beispiele den Begriffen Reflex, unbewusste und bewusste Reaktion zuordnen. a eingeschränkt
(Sinnesorgan zu Tier zuordnen).

### NT.6.2 Hören und Sehen analysieren (`a|6|2|6|0|2`)

Zwischentitel: Biologie, Physik: Akustik und Hören, Optik und Sehen. Vorangehend: NMG.4.2, NMG.4.3.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | | Schallausbreitung als fortschreitende Verdichtung der Luft beschreiben und mit Modellen erklären (z.B. grosse Spiralfeder, Magnete) |
| b | OP | mögliche Hörschäden mit Schalleinwirkungen in Beziehung setzen (z.B. Trommelfellriss durch lauten Knall, Lücken im Hörbereich durch Dauerbeschallung) und Verhalten ableiten |
| c | GA | Funktionsweise des Ohres beschreiben (z.B. Stereohören, Schallverstärkung, Frequenzverarbeitung, Hinhören/Weghören); Funktionsweise des Auges beschreiben (z.B. Stereosehen, Farbsehen, Akkommodieren) |
| d | | Fehlsichtigkeiten und ihre Korrekturen beschreiben (z.B. Kurz-, Weit- und Alterssichtigkeit) |

**Für kurze Übungen (Lesart):** b (Ursache → Hörschaden zuordnen), c (Teile und Leistungen von Ohr und Auge zuordnen,
soweit die Seite sie nennt: Stereohören, Schallverstärkung, Frequenzverarbeitung, Stereosehen, Farbsehen,
Akkommodieren), d (Fehlsichtigkeit ↔ Beschreibung). Die Seite nennt keine Bauteile von Ohr oder Auge; eine Liste dazu
wäre nicht aus dem Lehrplan belegt.

### NT.6.3 Optische Phänomene untersuchen (`a|6|2|6|0|3`)

Zwischentitel: Physik: Optik. Vorangehend: NMG.4.3.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | OP | Eigenschaften von Konvex- und Konkavlinsen experimentell bestimmen, Versuchsprotokolle anfertigen. VI: Brennpunkt |
| b | GA | Entstehung von Spiegelbildern und Abbildungen mit Linsen mit dem Modell Lichtstrahl bzw. Lichtbündel erklären; Aufbau optischer Geräte darstellen, wichtigste Bestandteile benennen (z.B. Fernrohr, Mikroskop, Fotoapparat) |
| c | | Bedingungen für Totalreflexion experimentell bestimmen, Versuchsprotokoll anfertigen |
| d | | optische Hebung mit dem Strahlengangmodell erklären |
| e | | Entstehung der Abbildung in/mit optischen Geräten mit dem Strahlengangmodell erklären (z.B. Fernrohr, Mikroskop, Fotoapparat) |

**Für kurze Übungen (Lesart):** a (Konvex/Konkav: sammelnd oder zerstreuend, Lage des Brennpunkts erkennen), b
(Bestandteile optischer Geräte benennen; Strahlengang am Spiegel als Bildaufgabe). c–e eher als Bildaufgaben zum
Strahlengang denkbar; eine Formel (Linsengleichung o.ä.) nennt die Seite nicht.

---

## 7 Körperfunktionen verstehen

### NT.7.1 Aspekte der Anatomie und Physiologie des Körpers erklären (`a|6|2|7|0|1`)

Zwischentitel: Biologie, (Chemie, Physik): Anatomie und Physiologie. Vorangehend: NMG.1.4.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | | mit dem eigenen Körper sowie Funktions- und Strukturmodellen das Zusammenspiel von Bau und Funktion des Bewegungsapparates analysieren (z.B. Biomechanik der Muskelansatzstellen). VI: Biomechanik: Bau und Funktion des Bewegungsapparats |
| b | GA, OP | mit Medien, Modellen oder realen Objekten Bau und Funktion eines inneren Organs analysieren (z.B. Physiologie der Lungenbläschen). VI: Physiologie: Bau und Funktion innerer Organe |
| c | | aus dem Verständnis von Physiologie und Anatomie Gesetzmässigkeiten ableiten und erklären (z.B. Agonist - Antagonist, Röhrenknochen - Platte Knochen; Resorption benötigt grosse Oberfläche). VI: anatomische und physiologische Gesetzmässigkeiten |

**Für kurze Übungen (Lesart):** c (Paare und Gesetzmässigkeiten zuordnen: Agonist/Antagonist, Röhrenknochen/platte
Knochen, grosse Oberfläche für Resorption), b eingeschränkt (Organ ↔ Funktion). a verlangt Modellarbeit am Körper.

### NT.7.2 Stoffwechselvorgänge analysieren und Verantwortung für den eigenen Körper übernehmen (`a|6|2|7|0|2`)

Zwischentitel: Biologie, (Chemie, Physik): Stoffwechselvorgänge. Vorangehend: NMG.1.4.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | OP | Organe als Teile eines Systems mit den vier zentralen Stoffwechselvorgängen Aufnahme, Transport, Umwandlung und Abgabe erkennen. VI: Aufnahme: Lunge, Verdauungsorgane; Transport: Blut, Blutkreislauf, Herz; Umwandlung: Leber, Fettgewebe, Knochen, Muskeln, Hirn; Abgabe: Niere, Lunge Verdauungsorgane, Haut |
| b | GA | körpereigene Phänomene mit Stoffwechselvorgängen erklären (z.B. unterschiedliche Gelbfärbung des Urins, Verdauungskoma). VI: Aktion und Reaktion bei Stoffwechselvorgängen |
| c | | Ergebnisse experimenteller Untersuchungen (z.B. Nährstoffnachweise in Lebensmitteln, Verdauung im Reagenzglas) nutzen, um die Ansprüche des eigenen Körpers einzuschätzen und danach zu handeln. VI: Nährstoffexperimente, Ernährung, Bewegung, Schlaf |

**Für kurze Übungen (Lesart):** a — die beste Stufe dieses Teils für eine kurze Übung: Organ den vier Vorgängen
Aufnahme, Transport, Umwandlung, Abgabe zuordnen, nach der VI-Liste. Achtung: Lunge und Verdauungsorgane stehen dort
unter Aufnahme **und** Abgabe; eine Zuordnungsaufgabe muss Mehrfachzuordnung zulassen. (Bei „Lunge Verdauungsorgane“
unter Abgabe fehlt auf der Seite ein Komma.)

### NT.7.3 Grundwissen über menschliche Fortpflanzung, sexuell übertragbare Krankheiten und Verhütung (`a|6|2|7|0|3`)

Zwischentitel: Biologie: Menschliche Fortpflanzung. Vorangehend: NMG.1.5.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | | Wirk- und Anwendungsweise verschiedener Mittel und Methoden zur Empfängnisverhütung kennen, Risiken und Nebenwirkungen vergleichen. VI: Fortpflanzung, Verhütung |
| b | | um die Verantwortung beider Geschlechter für Empfängnis und Verhütung wissen |
| c | GA | häufig sexuell übertragene Krankheiten kennen und erläutern, wie man sich davor schützt. VI: HIV, Geschlechtskrankheiten |
| d | | altersgemässe Medien und Informationsquellen zur Sexualaufklärung kennen |

Kein OP auf dieser Seite.

**Für kurze Übungen (Lesart):** keine Empfehlung für eine Lernspiel-Übung. Das Thema ist Aufklärung mit Haltung und
Verantwortung (b, d) und gehört in den begleiteten Unterricht; c liesse sich als Wissensfrage (Übertragungswege,
Schutz) fassen, die Seite nennt dazu aber nur „HIV, Geschlechtskrankheiten“.

### NT.7.4 Massnahmen gegen häufige Erkrankungen beurteilen (`a|6|2|7|0|4`)

Zwischentitel: Biologie: Krankheit und Genese. Vorangehend: NMG.1.2.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | OP | verschiedene Verursacher von Erkrankungen unterscheiden, prinzipielle Reaktionsweisen des Immunsystems kennen (z.B. Antikörper blockieren Viren in der Blutbahn). VI: Krankheitsverursacher: Viren, Bakterien, Pilze; Immunsystem |
| b | GA | präventiv (z.B. Hände waschen, Impfung) und kurativ (z.B. körperliche Ruhe bei einer Grippe) angemessen auf häufige Erkrankungen reagieren. VI: Prävention, Therapie |
| c | | grundlegende Wirkungsweisen von Medikamenten verstehen (z.B. keine Wirkung ohne Nebenwirkung), unterscheiden und abgrenzen (z.B. gegenüber Placebo). VI: Wirkung, Nebenwirkung |

**Für kurze Übungen (Lesart):** a (Verursacher Viren, Bakterien, Pilze unterscheiden — welche Krankheit wozu gehört, ist
auf der Seite nicht aufgeführt und müsste aus einem Lehrmittel belegt werden), b (Massnahme ↔ präventiv oder kurativ
sortieren), c eingeschränkt (Begriffe Wirkung, Nebenwirkung, Placebo).

---

## 8 Fortpflanzung und Entwicklung analysieren

### NT.8.1 Artenvielfalt in Beziehung zur Evolutionstheorie setzen (`a|6|2|8|0|1`)

Zwischentitel: Biologie: Evolutionstheorie. Vorangehend: NMG.2.4, NMG.2.5.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| (vor a) | OP | leere Zeile „Arbeit beginnt später im Zyklus“ |
| a | | Ordnungssysteme der Lebewesen hinterfragen und als Modelle erkennen (z.B. Stammbäume). VI: Biologische Ordnungssysteme |
| b | GA | zentrale Prinzipien der Evolutionstheorie an Beispielen erkennen, Gesetzmässigkeiten nachvollziehen. VI: Evolutionstheorie: Mutation, Rekombination, Selektion |
| c | | Veränderlichkeit der Arten erfassen, Probleme benennen, begründete Vermutungen äussern (z.B. Was spricht dafür, dass Teichfrosch, Wasserfrosch und Seefrosch verschiedene Arten sind, was dagegen?). VI: Artkonzept |

**Für kurze Übungen (Lesart):** b (Beispiele den Begriffen Mutation, Rekombination, Selektion zuordnen), a eingeschränkt
(Stammbaum lesen). c ist Begründen ohne eindeutige Lösung.

### NT.8.2 Wachstum und Entwicklung von Organismen erforschen und in Grundzügen erklären (`a|6|2|8|0|2`)

Zwischentitel: Biologie: Wachstum und Entwicklung. Vorangehend: NMG.2.3.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | | mikroskopische Phänomene an Zellen beobachten, dokumentieren, ihre Funktionen präsentieren (z.B. Stadien des Zellzyklus in Zwiebelwurzelzellen mikroskopieren und erläutern). VI: Zellen, Mikroskopieren |
| b | GA, OP | Experimente zu Wachstum und Entwicklung von Pflanzen planen, durchführen, dokumentieren (z.B. Keimungs- und Wachstumsexperimente). VI: Pflanzenwachstum, Pflanzenentwicklung, Experimentierprozess |
| c | | Informationen zu Zellteilung, -streckung und -differenzierung recherchieren und damit Ergebnisse von Keimungs- und Wachstumsexperimenten interpretieren. VI: Zellteilung, Zellstreckung, Zelldifferenzierung |

**Für kurze Übungen (Lesart):** c (Begriffe Zellteilung, Zellstreckung, Zelldifferenzierung den Beschreibungen
zuordnen), a eingeschränkt (Stadien des Zellzyklus ordnen — die Stadien nennt die Seite nicht). b ist Experimentieren.

### NT.8.3 Grundlagen der Genetik analysieren und erklären (`a|6|2|8|0|3`)

Zwischentitel: Biologie: Genetik und Gentechnik. Vorangehend: NMG.2.3.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| (vor a) | OP | leere Zeile „Arbeit beginnt später im Zyklus“ |
| a | | Zusammenhang von DNS, Genen, Proteinen und Merkmalsausprägungen darstellen. VI: Molekulare Genetik: DNS, Gene, Proteine, Phäne |
| b | | Ursachen und Wirkungen von Mutationen beschreiben und zur Erklärung von Merkmalsveränderungen heranziehen; aus der molekularen Genetik das Prinzip der Gentechnik ableiten. VI: Mutationen, gentechnische Veränderung, gentechnisch veränderte Organismen |
| c | | Gesetzmässigkeiten der Vererbung erkennen und zur Erklärung von Phänomenen heranziehen. VI: Klassische Genetik: Wahrscheinlichkeit, Mendelsche Regel |

Kein GA auf dieser Seite.

**Für kurze Übungen (Lesart):** a (Kette DNS → Gen → Protein → Merkmal ordnen), c (Erbgang mit Wahrscheinlichkeit nach
den Mendelschen Regeln — eindeutige Lösung, auch rechnend; welche Regeln und Erbgänge, sagt die Seite nicht). b eher
Erklären.

---

## 9 Ökosysteme erkunden

### NT.9.1 Aquatische Ökosysteme untersuchen und beurteilen (`a|6|2|9|0|1`)

Zwischentitel: Physik, Chemie, Biologie: Gewässerforschung. Vorangehend: NMG.2.1, NMG.2.2.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | | mit geeigneten Instrumenten Daten über abiotische (z.B. Strömungsgeschwindigkeit, Wassertemperatur) und biotische Faktoren (z.B. Leitorganismen für Wassergüte wie Eintagsfliegenlarven) sammeln, ordnen, auswerten. VI: Aquatisches Ökosystem, abiotische und biotische Faktoren |
| b | GA, OP | Planung und Durchführung der Beobachtungen und Experimente kriteriengeleitet prüfen, Optimierungen vorschlagen. VI: Methodenkritik |
| c | | vertiefende Informationen zu aquatischen Ökosystemen oder zum Wasser als Lebensgrundlage suchen, mit Modellen deuten, einschätzen. VI: Nahrungskette, Nahrungsnetze, Konkurrenz |

**Für kurze Übungen (Lesart):** a (Faktor ↔ abiotisch oder biotisch sortieren; Einheiten zu Messgrössen wie
Strömungsgeschwindigkeit, Temperatur), c (Nahrungskette ordnen). b ist Methodenkritik ohne eindeutige Lösung.

### NT.9.2 Wechselwirkungen in und zwischen terrestrischen Ökosystemen erkennen und charakterisieren (`a|6|2|9|0|2`)

Zwischentitel: Physik, Chemie, Biologie: Ökosysteme. Vorangehend: NMG.2.1, NMG.2.2.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| (vor a) | OP | leere Zeile „Arbeit beginnt später im Zyklus“ |
| a | | Wechselwirkungen zwischen mehreren terrestrischen Ökosystemen erkennen und beschreiben (z.B. Verinselung von Lebensräumen). VI: terrestrisches Ökosystem |
| b | GA | Untersuchungen zur Wechselwirkung zwischen Pflanzen und Böden planen, durchführen, auswerten (z.B. pH-Wert mit zunehmender Entfernung von einem Baumstamm, Zunahme des Sandanteils von der Oberfläche in den Untergrund); aus den Daten Schlussfolgerungen zu Wechselwirkungen ziehen, gewichten, generalisieren. VI: Bodeneigenschaften und Zeigereigenschaften von Pflanzen |
| c | | Informationen und Quellen zum Boden als Ressource einordnen, Schlussfolgerungen für eine nachhaltige Nutzung ziehen und beurteilen. VI: Bodennutzung, Nährstoffkreisläufe |

**Für kurze Übungen (Lesart):** b eingeschränkt (pH-Wert lesen: sauer, neutral, basisch; Zeigerpflanze ↔
Bodeneigenschaft — welche Pflanzen, nennt die Seite nicht). a und c sind Beschreiben und Beurteilen.

### NT.9.3 Einflüsse des Menschen auf regionale Ökosysteme erkennen und einschätzen (`a|6|2|9|0|3`)

Zwischentitel: Biologie: Naturnutzung und Naturschutz. Vorangehend: NMG.2.1, NMG.2.2, NMG.2.6.

| Stufe | Marke | Inhalt (sinngemäss) |
|---|---|---|
| a | OP | eigenen Beobachtungen zum Einfluss des Menschen auf Ökosysteme Informationen aus verschiedenen Quellen gegenüberstellen, Schlussfolgerungen ziehen (z.B. naturnahe und naturfremde Ufer, Nährstoffanreicherung in Gewässern). VI: anthropogene Einflüsse |
| b | GA | zum Einfluss des Menschen verschiedene Perspektiven einnehmen, langfristige Folgen prüfen (z.B. intensive und extensive Bewirtschaftung, invasive Pflanzen und Tiere). VI: Naturnutzung, Naturschutz |
| c | | aufgrund von Fakten eigene Ideen und Visionen zu einem verantwortungsvollen Umgang mit der Natur entwickeln und begründen |

**Für kurze Übungen (Lesart):** a und b nur eingeschränkt (Beispiele sortieren: naturnah/naturfremd, intensiv/extensiv).
Die Kompetenz zielt auf Perspektiven und Beurteilen; eine kurze Übung mit eindeutiger Lösung trifft sie kaum. c gar
nicht.

## Auffälligkeiten

### NT.1 bis NT.5

- **Kein GA Zyklus 2, keine Erweiterungen, keine Formeln** auf allen 13 Seiten (geprüft: kein `<em>`/`<i>` und kein
  „Erweiterung“ im Inhalt, keine Bilder ausser Pfeilen, OP-Zeichen und Logos).
- **GA nach dem OP** bei NT.3.3 (OP a, GA c), NT.4.1 und NT.4.2 (OP c, GA d) und NT.5.1 (OP a, GA d): Der
  Grundanspruch geht dort über den Stand Mitte 2. Oberstufe hinaus. Bei NT.1.1 und NT.1.2 liegt der GA eine Stufe
  nach dem OP. Gleich bei NT.2.1 (beide Aufbauten), NT.2.2, NT.3.1 Aufbau 1, NT.3.2, NT.5.2.
- **OP vor der ersten Stufe** bei NT.1.3, NT.3.1 Aufbau 2 und NT.5.3 („Arbeit beginnt später im Zyklus“).
- Bei NT.2.2 ist die letzte Stufe c zugleich GA und OP; die Stufen a und b (Begriffe, Trennverfahren) liegen davor.

### NT.6 bis NT.9

(im Kopf und bei den Kompetenzen vermerkt)
