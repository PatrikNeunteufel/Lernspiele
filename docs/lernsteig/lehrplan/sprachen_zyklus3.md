# Sprachen Zyklus 3 — Kompetenzstufen nach Lehrplan Volksschule SG

Quelle: sg.lehrplan.ch, alle Kompetenzseiten Deutsch (`code=a|1|11|…`), Englisch (`a|1|21|…`), Französisch
(`a|1|32|…`), Italienisch (`a|1|41|…`) und Latein (`a|1|45|…`) sowie *Strukturelle und inhaltliche Hinweise* des
Fachbereichs Sprachen (`code=e|1|4`). Fassung „Lehrplan Volksschule August 2025“, abgerufen am 2026-11-04. Roh-HTML
von D.5.D.1, D.5.E.1, FS1E.5.D.1 und FS2F.5.D.1 (die Kompetenzen der Lernsteig-Übungen) in
[quellen_sprachen/](quellen_sprachen/), abgerufen am 2026-11-08, gelesen mit `node tools/lehrplan_wortlaut.js`. Rahmen,
Reichweite und die Bedeutung von GA und OP für Real und Sek: [lehrplan_sg_sek1.md](lehrplan_sg_sek1.md). Mathematik:
[mathematik_zyklus3.md](mathematik_zyklus3.md).

**Lesart der Tabellen**
- Je Kompetenz der Handlungsaspekt, die Stufe des **Grundanspruchs Zyklus 2** (Anschluss Realschule) und **alle
  Stufen des Zyklus 3** mit ihren Marken. In der letzten Spalte steht der **Grundanspruch Zyklus 3**, sinngemäss
  und gekürzt (Latein: Inhalt der Kompetenz, weil es dort keinen GA gibt). Den vollen Wortlaut aller Stufen enthält
  die Seite.
- Marken: **GA** Grundanspruch, **OP** Orientierungspunkt (Zyklus 3: Mitte 2. Oberstufe), **A 1.1 … B 1.2**
  validiertes Niveau nach dem Gemeinsamen europäischen Referenzrahmen (GER), **GK** Hinweis auf die nationalen
  Grundkompetenzen der EDK („GK 1.FS“, „GK 2.FS“, „GK 1.+2.FS“). So sind sie auf den Seiten ausgewiesen.
- Gelesen aus dem HTML der Seiten: Zyklus aus `marker_z…`, GA aus der Zeilenklasse `mindestanspruch`, OP aus
  `tooltip op`, GER und GK aus `euroref`. Gegenprobe im HTML an D.2.B.1 und FS1E.1.A.1: Die OP-Marke von Zyklus 3
  steht in derselben Zeile wie der GA, in Zyklus 2 dagegen in einer anderen (D.2.B.1: OP bei e, GA bei f).
- Ein Prüfskript vergleicht jede Marke dieser Tabellen mit den ausgelesenen Daten (Stand siehe Abschnitt 6).

## 1. Was für alle Sprachen gilt (Strukturelle Hinweise, `e|1|4`, sinngemäss)

- **Deutsch, Englisch, Französisch:** In Zyklus 3 liegt der **OP auf derselben Stufe wie der GA**, in allen
  Kompetenzen, die einen GA haben. Für Real heisst das: Der GA soll schon Mitte der 2. Oberstufe bearbeitet sein.
  Was danach kommt, ist Auftrag des Zyklus (für Sek nach [lehrplan_sg_sek1.md](lehrplan_sg_sek1.md), Abschnitt 2).
- **Englisch und Französisch** haben je einen eigenen Lehrplan, aber **OP und GA des Zyklus 3 sind für beide
  Fremdsprachen dieselben**. Die Kurzfassungen unten gelten deshalb für beide. Geprüft: Von 31 GA-Texten sind 20
  bis auf den Sprachnamen wortgleich, die übrigen 11 unterscheiden sich nur in den Beispielen (z.B. Comic gegen
  Bande dessinée, „I am“ gegen „j’ai“).
- **Niveaus nach GER** stehen bei den Kompetenzen zum Sprachhandeln (Hören, Lesen, dialogisches und monologisches
  Sprechen, Schreiben). Der GA Zyklus 3 liegt in Englisch und Französisch bei **A2.2** für Hören, Lesen und Sprechen
  und bei **A2.1** für Schreiben. Der Auftrag reicht bis **B1.2** (Schreiben bis B1.1).
- **Italienisch:** eigener Lehrplan nur über den Zyklus 3. Der GA ist auf der Basis von **drei Jahreslektionen**
  gesetzt, es gibt **keine Orientierungspunkte**. Der GA ist jeweils die erste Stufe (a, A1.1), der Auftrag reicht
  bis A2.2.
- **Latein:** **keine GA und keine OP**. Die Verbindlichkeit legen die Kantone nach ihren Rahmenbedingungen fest,
  alle Kompetenzbereiche müssen aber berücksichtigt werden. Einige Kompetenzen nummerieren ihre Stufen in Gruppen
  (1a, 1b, 2a …). Was die Ziffer bedeutet, sagen die gelesenen Seiten nicht (offen).
- **Rätoromanisch** kommt im Lehrplan SG nicht vor: kein Treffer auf der Startseite, im Downloadbereich und in den
  Rahmenbedingungen.

## 2. Stellung in der SG-Lektionentafel

Aus [lehrplan_sg_sek1.md](lehrplan_sg_sek1.md), Abschnitt 3:
- **Deutsch:** 4/4/4 Wochenlektionen in Sek, Real und Kleinklasse.
- **Englisch:** Sek 3/2/2, Real 3/2/–. In der 3. Realklasse ist Englisch Wahlfach (2).
- **Französisch:** Sek 3/3/2, Real 3/0–3/– (in der 2. Realklasse Wahlpflicht mit TTG). In der 3. Realklasse ist
  Französisch Wahlfach (2).
- **Italienisch:** Wahlfach 2./3. Klasse (2/2), nur bei genügend Anmeldungen.
- **Latein:** Wahlfach mit Durchführungspflicht, **nur Sekundarschule**, 1./2. Klasse (3/3).

Für das Niveau-Modell des Lernsteigs folgt daraus: In Englisch und Französisch hat die Realschule in der 3. Klasse
keinen Pflichtunterricht mehr. Italienisch und Latein sind Angebote für einen Teil der Jugendlichen.

Ausnahme bei OP gleich GA: FS1E.6.B.1 und FS2F.6.B.1 (Haltungen zum Kulturraum) haben keinen GA, aber einen OP
(Stufe b).

## 3. Deutsch (D)

| Kompetenz | Handlungsaspekt | GA Z2 | Stufen Z3 (Marken) | Grundanspruch Z3 (sinngemäss) |
|---|---|---|---|---|
| D.1.A.1 | A Grundfertigkeiten | f | g · h (GA, OP) | Wörter und Wendungen in verschiedenen Situationen verstehen, Sprachregistern zuordnen |
| D.1.B.1 | B Verstehen in monologischen Hörsituationen | f | g (GA, OP) · h | mehrteilige Aufträge verstehen und ausführen; längeren Theaterstücken, Filmen, Hörspielen folgen; unbekannte Wörter erfragen oder erschliessen |
| D.1.C.1 | C Verstehen in dialogischen Hörsituationen | e | f · g (GA, OP) · h | Gesprächsverhalten anderer in Diskussionen einschätzen und darauf reagieren; gezielt nach Begründungen fragen; sich im Gespräch mit unbekannten Erwachsenen einstellen (Vorstellungsgespräch, Schnupperlehre) |
| D.1.D.1 | D Reflexion über das Hörverhalten | c | d (GA, OP) · e | mit Leitfragen eigenes Verstehen und Hörprobleme beurteilen, Hörstrategien anpassen |
| D.2.A.1 | A Grundfertigkeiten | f | g · h (GA, OP) | geübten Text flüssig und betont vorlesen; Wörter verschiedenen Registern zuordnen (Fachsprache) |
| D.2.B.1 | B Verstehen von Sachtexten | f | g · h (GA, OP) · i | Informationen aus diskontinuierlichen Sachtexten entnehmen (Text und Abbildung verbinden); übersichtliche Texte als Ganzes verstehen; unbekannte Wörter aus Kontext oder Hilfsmitteln erschliessen; Informationen weiterverarbeiten (Stichwortliste, Mindmap, Zeitstrahl); Bibliothek nutzen |
| D.2.C.1 | C Verstehen literarischer Texte | f | g · h (GA, OP) · i | Bücher nach Interesse wählen und selbstständig lesen; mit Unterstützung implizite Informationen zu Figuren verstehen; Kerngedanken eines Gedichts formulieren; gestaltend vorlesen |
| D.2.D.1 | D Reflexion über das Leseverhalten | c | d (GA, OP) · e | unter Anleitung Lesestrategien und Verstehensprobleme beschreiben; Lektürewahl begründen |
| D.3.A.1 | A Grundfertigkeiten | d | e (GA, OP) · f | Standardsprache flüssig sprechen (mundartlich gefärbt erlaubt); Verbales, Nonverbales, Paraverbales zielgerichtet einsetzen; Tempo und Sprechweise steuern |
| D.3.B.1 | B Monologisches Sprechen | f | g · h (GA, OP) · i | sich in Standardsprache weitgehend sicher ausdrücken; adressatengerecht (nach-)erzählen; Arbeitsergebnisse strukturiert präsentieren, Medien gezielt nutzen |
| D.3.C.1 | C Dialogisches Sprechen | e | f · g · h (GA, OP) · i · j | Vorstellungsgespräch mit Leitfragen vorbereiten und überzeugend spielen; Argumente anderer aufgreifen; Gesprächsregeln selbstständig einhalten |
| D.3.D.1 | D Reflexion über das Sprech-, Präsentations- und Gesprächsverhalten | c | d · e (GA, OP) · f | mit Rückfragen eigene Sprechstrategien beschreiben; eigene Präsentation nach Kriterien beurteilen; Gesprächsformen reflektieren (Mundart/Standard, Höflichkeit, Jugendsprache) |
| D.4.A.1 | A Grundfertigkeiten | g | h · i (GA, OP) | Handschrift und Tastatur ausreichend automatisiert; textverknüpfende Mittel aktivieren |
| D.4.B.1 | B Schreibprodukte | e | f · g · h (GA, OP) | vielfältige Textmuster und typische Formulierungsmuster kennen (Erzählung, Argumentation, Zeitungsbericht, Geschäftsbrief, Blog …); alle Teile von Bewerbungsunterlagen kennen |
| D.4.C.1 | C Schreibprozess: Ideen finden und planen | e | f · g (GA, OP) · h | Strategien zur Ideenfindung und Planung selbstständig kombinieren; Medien dafür nutzen |
| D.4.D.1 | D Schreibprozess: formulieren | d | e (GA, OP) · f | vorgegebene Wörter als Formulierungshilfe nutzen; Schreibblockaden überwinden; Gedanken sinnvoll ordnen und gezielt wirken lassen |
| D.4.E.1 | E Schreibprozess: inhaltlich überarbeiten | d | e · f (GA, OP) · g | im Austausch Stärken und Unstimmigkeiten gegenüber Schreibziel und Textsorte erkennen, Alternativen finden; Bewerbungsunterlagen mit Unterstützung anpassen |
| D.4.F.1 | F Schreibprozess: sprachformal überarbeiten | d | e · f (GA, OP) · g | Texte sprachformal überarbeiten nach: Wortstammregel, Doppelkonsonantenregel, Grossschreibung konkreter, abstrakter und abgeleiteter Nomen (mit Nachmorphemen), Komma zwischen leicht erkennbaren Verbgruppen, jeweils mit wichtigen Ausnahmen; Schreibungen mit dem Schulwörterbuch klären; Bewerbungsunterlagen fehlerfrei |
| D.4.G.1 | G Reflexion über den Schreibprozess und eigene Schreibprodukte | d | e · f (GA, OP) · g | im Austausch Qualitäten des eigenen Textes nach Kriterien einschätzen; gelungene Stellen benennen; Schreibvorgehen vergleichen |
| D.5.A.1 | A Verfahren und Proben | b | c (GA, OP) · d | Ersatz-, Verschiebe-, Erweiterungs-, Weglassprobe selbstständig anwenden; Vorgehen beim Sammeln und Ordnen begründen |
| D.5.B.1 | B Sprachgebrauch untersuchen | c | d (GA, OP) | Gebrauch sprachlicher Mittel untersuchen (Chat, Präsentation, Bewerbung); sprachliche Themen in mehreren Sprachen untersuchen; Vor- und Nachteile von Medien reflektieren |
| D.5.C.1 | C Sprachformales untersuchen | d | e (GA, OP) | Lautstruktur, Wort- und Satzbau in Standard und Mundart untersuchen und mit anderen Sprachen vergleichen; Schreibweisen (SMS) untersuchen; Bedeutung von Rechtschreibregeln reflektieren |
| D.5.D.1 | D Grammatikbegriffe | c | d · e (GA, OP) · f · g | Präpositionen mit reduzierter Liste benennen; Nominativ, Akkusativ, Dativ, Genitiv in typischen Fällen mit der Ersatzprobe bestimmen; Wörter in Stamm-, Vor-, Nachmorphem zerlegen; Verbenfächer bilden, Nominal- und Präpositionalgruppe unterscheiden |
| D.5.E.1 | E Rechtschreibregeln | d | e · f (GA, OP) · g | in konstruierten Übungen anwenden: nominalisierte Verben nach Präposition + Artikel (beim Essen, nach dem Essen); Höflichkeitspronomen „Sie“ in Briefen |
| D.6.A.1 | A Auseinandersetzung mit literarischen Texten | e | f · g (GA, OP) · h · i | Innensicht von Figuren erkennen und gestalten (szenisch, innerer Monolog); Textteile ordnen; Gedanken beim Lesen reflektieren (Lesetagebuch) |
| D.6.A.2 | A Auseinandersetzung mit literarischen Texten | f | g · h (GA, OP) · i · j | eigenes Leseverhalten reflektieren; Textverständnis im Gespräch formulieren und weiterentwickeln; verschiedene Bedeutungen erkennen |
| D.6.B.1 | B Auseinandersetzung mit verschiedenen Autor/innen und verschiedenen Kulturen | c | d · e (GA, OP) · f | Informationen zu Autorinnen und Autoren der Kinder- und Jugendliteratur sammeln; einzelne Texte der deutschen Literatur kennen; Texte aus anderen Kulturen vergleichen |
| D.6.C.1 | C Literarische Texte: Beschaffenheit und Wirkung | f | g · h (GA, OP) · i | unvertraute literarische Texte bearbeiten; Gestaltungsprinzipien erkennen (Spannung, Motive); Fiktion und Realität unterscheiden; Merkmale von Erzähltexten und Lyrik kennen |

### Für Übungen besonders geeignet: Rechtschreibung und Grammatik, alle Stufen Z3 (sinngemäss)

Diese Aufbauten beschreiben Regelwissen, das sich in kurzen Runden mit eindeutiger Lösung üben lässt.

| Stufe | Marke | Inhalt |
|---|---|---|
| **D.4.F.1** Text sprachformal überarbeiten | | |
| d | GA Z2 | Text auf Fehler durchlesen; Punkt für Punkt nach Wortstammregel (leichte Stämme), Doppelkonsonantenregel, Grossschreibung typischer abstrakter Nomen (Glück), Komma zwischen leicht erkennbaren Verbgruppen; Zeichen der direkten Rede nach Schema; Grammatikproben; Wörterbuch |
| e | | Rechtschreibprobleme erkennen und Strategie wählen (Stamm, Analogie, Regel, nachschlagen); Korrekturprogramme; Grossschreibung abgeleiteter Nomen mit häufigen Nachmorphemen (Frei-heit, Entdeck-ung) |
| f | GA, OP | wie oben, alle Regeln mit wichtigen Ausnahmen; Schreibungen mit dem Schulwörterbuch klären; Bewerbungsunterlagen fehlerfrei |
| g | | Texte selbstständig sprachformal überarbeiten |
| **D.5.D.1** Grammatikbegriffe | | |
| c | GA Z2 | Nomen, Verb, Adjektiv mit formalen Proben; Präsens, Präteritum, Perfekt, Infinitiv, Personalform; Wortstamm, Wortfamilien; Morpheme (Stamm-, Vor-, Nachmorphem); Fragen für einen Verbenfächer |
| d | | Begriff Pronomen (Liste), Begriff Partikel; erste Erfahrungen mit Futur, Plusquamperfekt und den vier Fällen; einfache Sätze im Verbenfächer |
| e | GA, OP | Präpositionen (reduzierte Liste); vier Fälle in typischen Fällen mit der Ersatzprobe; Morpheme zerlegen; Verbenfächer, Nominal- und Präpositionalgruppe |
| f | | Wortarten: Nomen, Verb, Adjektiv formal, Pronomen mit der umfassenden Liste, Rest als Partikel; Präposition und Konjunktion; Präsens, Präteritum, Perfekt, Futur; Satzglieder mit dem Verbenfächer; Begriffe Subjekt und Objekt |
| g | | Indikativ, Imperativ, Konjunktiv I und II, Aktiv und Passiv; Subjekt und Objekt unterscheiden; einfache und zusammengesetzte Sätze |
| **D.5.E.1** Rechtschreibregeln in konstruierten Übungen | | |
| d | GA Z2 | Morpheme für die Stammregel; Wörterbuch bei regelmässiger Laut-Buchstaben-Zuordnung; ie-Regel, f/v, e/ä (Stammregel), Doppelkonsonanten (ck, tz), Grossschreibung konkreter und gebräuchlicher abstrakter Nomen, Trennregel, Komma bei Aufzählungen und zwischen übersichtlichen Verbgruppen |
| e | | Morpheme für die Gross- und Kleinschreibung nutzen (Frei-heit) |
| f | GA, OP | nominalisierte Verben nach Präposition + Artikel (beim Essen); Höflichkeitspronomen „Sie“ in Briefen |
| g | | Wörterbuch auch bei nicht eindeutiger Laut-Buchstaben-Zuordnung; nominalisierte Adjektive nach Pronomen (alles Gute, etwas Schönes); Komma bei Infinitivgruppen, Einschüben, Relativsätzen |

## 4. Englisch (FS1E) und Französisch (FS2F)

Die Kurzfassung des GA gilt für beide Sprachen (Abschnitt 1). Beispiele je Sprache stehen auf der Seite.

### Englisch

| Kompetenz | Handlungsaspekt | GA Z2 | Stufen Z3 (Marken) | Grundanspruch Z3 (sinngemäss) |
|---|---|---|---|---|
| FS1E.1.A.1 | A Monologische und dialogische Texte hören und verstehen | c (A 2.1) | d (A 2.2, GA, OP, GK 1.+2.FS) · e (B 1.1) · f (B 1.2) | A2.2: in Beiträgen und längeren Gesprächen über vertraute Themen verstehen, worum es geht (langsam, deutlich gesprochen); persönlich gegebene Anweisungen verstehen |
| FS1E.1.A.2 | A Monologische und dialogische Texte hören und verstehen | a | b (GA, OP) · c | in Hörtexten einzelne ästhetische Gestaltungsmittel entdecken, auf Deutsch beschreiben |
| FS1E.1.B.1 | B Strategien | c | d (GA, OP) · e | hilfreiche Hörstrategien (auch aus anderen Sprachen) beurteilen und einsetzen |
| FS1E.1.C.1 | C Sprachmittlung | a | b (GA, OP) · c · d | einfache Fragen und Informationen aus Gespräch oder Durchsage verstehen und sinngemäss auf Deutsch wiedergeben (informelles Dolmetschen) |
| FS1E.2.A.1 | A Texte lesen und verstehen | c (A 2.1) | d (A 2.2, GA, OP, GK 1.+2.FS) · e (B 1.1) · f (B 1.2) | A2.2: in klar strukturierten Texten zu vertrauten Themen Haupt- und Einzelinformationen verstehen; illustrierte Anleitungen befolgen; persönliche Texte verstehen |
| FS1E.2.A.2 | A Texte lesen und verstehen | a | b · c (GA, OP) · d | in Texten ästhetische Gestaltungsmittel entdecken, auf Deutsch beschreiben |
| FS1E.2.B.1 | B Strategien | c | d (GA, OP) · e | hilfreiche Lesestrategien beurteilen und einsetzen |
| FS1E.2.C.1 | C Sprachmittlung | a | b (GA, OP) · c · d | Haupt- oder Einzelinformationen kurzer Texte zu vertrauten Themen sinngemäss auf Deutsch wiedergeben |
| FS1E.3.A.1 | A Dialogisches Sprechen | c (A 2.1) | d (A 2.2, GA, OP, GK 1.+2.FS) · e (B 1.1) · f (B 1.2) | A2.2: einfache Aussagen zu vertrauten Themen machen und reagieren; Fragen zu Alltagsaktivitäten stellen und beantworten; zustimmen oder ablehnen; um einen Gefallen bitten |
| FS1E.3.B.1 | B Monologisches Sprechen | c (A 2.1) | d (A 2.2, GA, OP, GK 1.+2.FS) · e (B 1.1) · f (B 1.2) | A2.2: kurze Geschichten erzählen; Meinungen und Vorlieben einfach begründen; Vertrautes beschreiben; Erlebnisse beschreiben |
| FS1E.3.B.2 | B Monologisches Sprechen | a | b · c (GA, OP) · d | Texte kreativ gestalten und vortragen (Sketch, kurze Geschichte) |
| FS1E.3.C.1 | C Strategien | b | c · d (GA, OP) · e | Sprechstrategien einsetzen und beurteilen (Wiederholung erbitten, umschreiben) |
| FS1E.3.D.1 | D Sprachmittlung | a | b (GA, OP) · c · d | einfache Informationen aus Deutschem (Gespräch, Durchsage, kurzer Text) sinngemäss in die Zielsprache übertragen |
| FS1E.4.A.1 | A Schriftliche Texte verfassen | b (A 1.2) | c (A 2.1, GA, OP, GK 1.+2.FS) · d (A 2.2) · e (B 1.1) | A2.1: mit Unterstützung (Chunks) einfache Geschichten beginnen oder beenden; Notizen und kurze Mitteilungen verfassen; über Vertrautes in einfachen Sätzen berichten |
| FS1E.4.A.2 | A Schriftliche Texte verfassen | a | b (GA, OP) · c | in eigenen Texten mit einfachen Gestaltungsmitteln wirken (Gedicht, Cartoon) |
| FS1E.4.B.1 | B Strategien | b | c (GA, OP) · d | hilfreiche Schreibstrategien beurteilen und einsetzen |
| FS1E.4.C.1 | C Sprachmittlung | a | b (GA, OP) · c · d | einfache deutsche Mitteilungen sinngemäss als kurze Notiz in der Zielsprache festhalten |
| FS1E.5.A.1 | A Bewusstheit für Sprache | a | b (GA, OP) · c | sprachliche Vielfalt in Europa, der Welt und der Schweiz erkennen und beschreiben |
| FS1E.5.A.2 | A Bewusstheit für Sprache | a | b (GA, OP) · c | Varietäten der Zielsprache wahrnehmen |
| FS1E.5.B.1 | B Wortschatz | b | c (GA, OP) · d | Wortschatz genügt für Texte zu allgemeineren Themen und routinemässige Gespräche |
| FS1E.5.B.2 | B Wortschatz | b | c (GA, OP) · d | passende Techniken zum Wortschatzerwerb wählen; unter Anleitung Wortbildungsregeln erkennen |
| FS1E.5.C.1 | C Aussprache | b | c (GA, OP) · d | trotz merklichem Akzent meist verständlich sprechen und vorlesen |
| FS1E.5.C.2 | C Aussprache | c | d (GA, OP) · e | unter Anleitung Schriftbild und Aussprache verbinden, Regeln ableiten |
| FS1E.5.D.1 | D Grammatik | b | c (GA, OP) · d | einfache Strukturen verwenden, noch mit Fehlern (Wortfolge in Aussage und Frage, Verben mit zwei Objekten, unregelmässiger Plural, häufige Präpositionen); einfache Strukturen im Text erkennen |
| FS1E.5.D.2 | D Grammatik | a | b (GA, OP) · c | unter Anleitung komplexere Strukturen untersuchen und vergleichen (Zeitform, Konjugation) |
| FS1E.5.E.1 | E Rechtschreibung | b | c (GA, OP) · d | kürzere Texte zu vertrauten Themen angemessen korrekt schreiben; häufige Formen korrekt (EN „I am“, FR „j’ai“) |
| FS1E.5.E.2 | E Rechtschreibung | b | c (GA, OP) | unter Anleitung häufige Rechtschreibregeln ableiten; Schreibung prüfen (Wörterbuch) |
| FS1E.5.F.1 | F Sprachlernreflexion und -planung | b | c (GA, OP) · d | eigene Fortschritte einschätzen; Ziele setzen und Lernen planen |
| FS1E.6.A.1 | A Kenntnisse | b | c · d (GA, OP) · e | kulturelle Gegebenheiten und Kulturerzeugnisse des Sprachraums kennen |
| FS1E.6.B.1 | B Haltungen | — | b (OP) | — (kein GA) |
| FS1E.6.C.1 | C Handlungen | b | c · d (GA, OP) · e | an Kulturerzeugnissen eigene Lebenswelt bewusster wahrnehmen, eigene Normen als relativ erkennen |

### Französisch

| Kompetenz | Handlungsaspekt | GA Z2 | Stufen Z3 (Marken) | Grundanspruch Z3 (sinngemäss) |
|---|---|---|---|---|
| FS2F.1.A.1 | A Monologische und dialogische Texte hören und verstehen | b (A 1.2) | c (A 2.1) · d (A 2.2, GA, OP, GK 1.+2.FS) · e (B 1.1) · f (B 1.2) | A2.2: in Beiträgen und längeren Gesprächen über vertraute Themen verstehen, worum es geht (langsam, deutlich gesprochen); persönlich gegebene Anweisungen verstehen |
| FS2F.1.A.2 | A Monologische und dialogische Texte hören und verstehen | a | b (GA, OP) · c | in Hörtexten einzelne ästhetische Gestaltungsmittel entdecken, auf Deutsch beschreiben |
| FS2F.1.B.1 | B Strategien | c | d (GA, OP) · e | hilfreiche Hörstrategien (auch aus anderen Sprachen) beurteilen und einsetzen |
| FS2F.1.C.1 | C Sprachmittlung | — | b (GA, OP) · c · d | einfache Fragen und Informationen aus Gespräch oder Durchsage verstehen und sinngemäss auf Deutsch wiedergeben (informelles Dolmetschen) |
| FS2F.2.A.1 | A Texte lesen und verstehen | b (A 1.2) | c (A 2.1) · d (A 2.2, GA, OP, GK 1.+2.FS) · e (B 1.1) · f (B 1.2) | A2.2: in klar strukturierten Texten zu vertrauten Themen Haupt- und Einzelinformationen verstehen; illustrierte Anleitungen befolgen; persönliche Texte verstehen |
| FS2F.2.A.2 | A Texte lesen und verstehen | a | b · c (GA, OP) · d | in Texten ästhetische Gestaltungsmittel entdecken, auf Deutsch beschreiben |
| FS2F.2.B.1 | B Strategien | c | d (GA, OP) · e | hilfreiche Lesestrategien beurteilen und einsetzen |
| FS2F.2.C.1 | C Sprachmittlung | — | b (GA, OP) · c · d | Haupt- oder Einzelinformationen kurzer Texte zu vertrauten Themen sinngemäss auf Deutsch wiedergeben |
| FS2F.3.A.1 | A Dialogisches Sprechen | b (A 1.2) | c (A 2.1) · d (A 2.2, GA, OP, GK 1.+2.FS) · e (B 1.1) · f (B 1.2) | A2.2: einfache Aussagen zu vertrauten Themen machen und reagieren; Fragen zu Alltagsaktivitäten stellen und beantworten; zustimmen oder ablehnen; um einen Gefallen bitten |
| FS2F.3.B.1 | B Monologisches Sprechen | b (A 1.2) | c (A 2.1) · d (A 2.2, GA, OP, GK 1.+2.FS) · e (B 1.1) · f (B 1.2) | A2.2: kurze Geschichten erzählen; Meinungen und Vorlieben einfach begründen; Vertrautes beschreiben; Erlebnisse beschreiben |
| FS2F.3.B.2 | B Monologisches Sprechen | a | b · c (GA, OP) · d | Texte kreativ gestalten und vortragen (Sketch, kurze Geschichte) |
| FS2F.3.C.1 | C Strategien | b | c · d (GA, OP) · e | Sprechstrategien einsetzen und beurteilen (Wiederholung erbitten, umschreiben) |
| FS2F.3.D.1 | D Sprachmittlung | — | b (GA, OP) · c · d | einfache Informationen aus Deutschem (Gespräch, Durchsage, kurzer Text) sinngemäss in die Zielsprache übertragen |
| FS2F.4.A.1 | A Schriftliche Texte verfassen | b (A 1.2) | c (A 2.1, GA, OP, GK 1.+2.FS) · d (A 2.2) · e (B 1.1) | A2.1: mit Unterstützung (Chunks) einfache Geschichten beginnen oder beenden; Notizen und kurze Mitteilungen verfassen; über Vertrautes in einfachen Sätzen berichten |
| FS2F.4.A.2 | A Schriftliche Texte verfassen | a | b (GA, OP) · c | in eigenen Texten mit einfachen Gestaltungsmitteln wirken (Gedicht, Cartoon) |
| FS2F.4.B.1 | B Strategien | b | c (GA, OP) · d | hilfreiche Schreibstrategien beurteilen und einsetzen |
| FS2F.4.C.1 | C Sprachmittlung | — | b (GA, OP) · c · d | einfache deutsche Mitteilungen sinngemäss als kurze Notiz in der Zielsprache festhalten |
| FS2F.5.A.1 | A Bewusstheit für Sprache | a | b (GA, OP) · c | sprachliche Vielfalt in Europa, der Welt und der Schweiz erkennen und beschreiben |
| FS2F.5.A.2 | A Bewusstheit für Sprache | a | b (GA, OP) · c | Varietäten der Zielsprache wahrnehmen |
| FS2F.5.B.1 | B Wortschatz | b | c (GA, OP) · d | Wortschatz genügt für Texte zu allgemeineren Themen und routinemässige Gespräche |
| FS2F.5.B.2 | B Wortschatz | b | c (GA, OP) · d | passende Techniken zum Wortschatzerwerb wählen; unter Anleitung Wortbildungsregeln erkennen |
| FS2F.5.C.1 | C Aussprache | b | c (GA, OP) · d | trotz merklichem Akzent meist verständlich sprechen und vorlesen |
| FS2F.5.C.2 | C Aussprache | c | d (GA, OP) · e | unter Anleitung Schriftbild und Aussprache verbinden, Regeln ableiten |
| FS2F.5.D.1 | D Grammatik | a | b · c (GA, OP) · d | einfache Strukturen verwenden, noch mit Fehlern (Wortfolge in Aussage und Frage, Verben mit zwei Objekten, unregelmässiger Plural, häufige Präpositionen); einfache Strukturen im Text erkennen |
| FS2F.5.D.2 | D Grammatik | a | b (GA, OP) · c | unter Anleitung komplexere Strukturen untersuchen und vergleichen (Zeitform, Konjugation) |
| FS2F.5.E.1 | E Rechtschreibung | b | c (GA, OP) · d | kürzere Texte zu vertrauten Themen angemessen korrekt schreiben; häufige Formen korrekt (EN „I am“, FR „j’ai“) |
| FS2F.5.E.2 | E Rechtschreibung | b | c (GA, OP) | unter Anleitung häufige Rechtschreibregeln ableiten; Schreibung prüfen (Wörterbuch) |
| FS2F.5.F.1 | F Sprachlernreflexion und -planung | b | c (GA, OP) · d | eigene Fortschritte einschätzen; Ziele setzen und Lernen planen |
| FS2F.6.A.1 | A Kenntnisse | b | c · d (GA, OP) · e | kulturelle Gegebenheiten und Kulturerzeugnisse des Sprachraums kennen |
| FS2F.6.B.1 | B Haltungen | — | b (OP) | — (kein GA) |
| FS2F.6.C.1 | C Handlungen | b | c · d (GA, OP) · e | an Kulturerzeugnissen eigene Lebenswelt bewusster wahrnehmen, eigene Normen als relativ erkennen |

Französisch beginnt später als Englisch: 5. statt 3. Klasse (Lektionentafel Primarschule SG, Bild
`2025-07-31_tabellen_SG_ps.jpg` in den Rahmenbedingungen: Englisch 2/3/2/2 in der 3.–6. Klasse, Französisch 2/2 in
der 5./6.). Deshalb liegt der GA Zyklus 2 tiefer (Hören, Lesen,
Sprechen A1.2 statt A2.1), und vier Sprachmittlungs-Kompetenzen haben im Zyklus 2 keinen GA. Der GA Zyklus 3 ist
derselbe.

### Für Übungen besonders geeignet: Grammatik (5.D.1), alle Stufen Z3, beide Sprachen (sinngemäss)

| Stufe EN / FR | Marke | Inhalt |
|---|---|---|
| — / b | | (nur FR) einige einfache Strukturen verwenden, noch mit Fehlern (Konjugation wichtiger Verben, Personalpronomen als Subjekt, Frage mit Fragewort); Zeit- und Ortsangaben erkennen. In EN ist das der GA Z2 |
| c / c | GA, OP | einfache Strukturen verwenden, teils noch Fehler (Wortfolge in Aussage und Frage, Verben mit zwei Objekten, unregelmässiger Plural, häufige Präpositionen); einfache Strukturen im Text erkennen (Wortfolge, Frage, Konjugationsformen) |
| d / d | | auch komplexere Strukturen ausreichend korrekt (Hilfs- und Modalverben, Formen der Negation, Demonstrativ- und Reflexivpronomen); im Text erkennen (Zeitformen, Modalverben, begründende Konjunktionen, Possessiv- und Reflexivpronomen) |

Im Wortlaut (`quellen_sprachen/`, 2026-11-08) sind die Stufen b, c und d in FS1E.5.D.1 und FS2F.5.D.1 Wort für Wort
gleich; EN b steht also auf der Seite (Zyklus 2, GA), nur hier in der Tabelle nicht.

Wortschatz (5.B.1) beschreibt nur den Umfang: GA = genügend für Texte zu allgemeineren Themen und routinemässige
Gespräche; Stufe d = ausreichend für Themen der eigenen Lebenswelt und Alltagsgespräche. **Welche Wörter** dazu
gehören, sagt der Lehrplan nicht. Das legt das Lehrmittel fest (nicht recherchiert).

## 5. Italienisch (FS3I, Wahlfach) und Latein (LAT, Wahlfach Sek)

### Italienisch

| Kompetenz | Handlungsaspekt | GA Z2 | Stufen Z3 (Marken) | Grundanspruch Z3 (sinngemäss) |
|---|---|---|---|---|
| FS3I.1.A.1 | A Monologische und dialogische Texte hören und verstehen | — | a (A 1.1, GA) · b (A 1.2) · c (A 2.1) · d (A 2.2) | A1.1: vertraute Wörter, einfache Informationen und Anleitungen verstehen (deutlich gesprochen, mit Bild oder Gestik) |
| FS3I.1.A.2 | A Monologische und dialogische Texte hören und verstehen | — | a (GA) · b · c | in einen langsam gesprochenen Hörtext eintauchen |
| FS3I.1.B.1 | B Strategien | — | a (GA) · b · c · d | unter Anleitung Hörstrategien aus anderen Fremdsprachen übertragen |
| FS3I.1.C.1 | C Sprachmittlung | — | a (GA) · b · c · d | Hauptaussagen kurzer Mitteilungen sinngemäss auf Deutsch wiedergeben |
| FS3I.2.A.1 | A Texte lesen und verstehen | — | a (A 1.1, GA) · b (A 1.2) · c (A 2.1) · d (A 2.2) | A1.1: einzelne Ausdrücke mit Bildern verstehen; Grundinformationen auf Schild, Plakat, Postkarte finden; wiederkehrende Anweisungen verstehen |
| FS3I.2.A.2 | A Texte lesen und verstehen | — | a (GA) · b · c | in illustrierte kurze Texte eintauchen |
| FS3I.2.B.1 | B Strategien | — | a (GA) · b · c · d | unter Anleitung Lesestrategien übertragen |
| FS3I.2.C.1 | C Sprachmittlung | — | a (GA) · b · c · d | Hauptaussagen kurzer schriftlicher Mitteilungen sinngemäss auf Deutsch wiedergeben |
| FS3I.3.A.1 | A Dialogisches Sprechen | — | a (A 1.1, GA) · b (A 1.2) · c (A 2.1) · d (A 2.2) | A1.1: mit ganz einfachen Worten Kontakt aufnehmen (grüssen, danken, bestellen) |
| FS3I.3.B.1 | B Monologisches Sprechen | — | a (A 1.1, GA) · b (A 1.2) · c (A 2.1) · d (A 2.2) | A1.1: kurze Reime vortragen; Vertrautes benennen; einfach über sich sprechen |
| FS3I.3.B.2 | B Monologisches Sprechen | — | a (GA) · b · c | mit Reim, Zungenbrecher, Vers spielerisch experimentieren |
| FS3I.3.C.1 | C Strategien | — | a (GA) · b · c · d | unter Anleitung Sprechstrategien übertragen |
| FS3I.3.D.1 | D Sprachmittlung | — | a (GA) · b · c · d | Hauptaussagen kurzer deutscher Mitteilungen sinngemäss auf Italienisch wiedergeben |
| FS3I.4.A.1 | A Verfassen schriftlicher Texte | — | a (A 1.1, GA) · b (A 1.2) · c (A 2.1) · d (A 2.2) | A1.1: Listen und Bildbeschriftungen; Formulare mit persönlichen Angaben; kurze Sätze über sich |
| FS3I.4.A.2 | A Verfassen schriftlicher Texte | — | a (GA) · b · c | mit einfachen Gestaltungsmitteln spielen (Reimwörter) |
| FS3I.4.B.1 | B Strategien | — | a (GA) · b · c | unter Anleitung Schreibstrategien übertragen |
| FS3I.4.C.1 | C Sprachmittlung | — | a (GA) · b · c · d | zu einfachen deutschen Texten Stichworte auf Italienisch festhalten |
| FS3I.5.A.1 | A Bewusstheit für Sprache | — | a (GA) · b · c | mit Unterstützung sprachliche Phänomene wahrnehmen und vergleichen (Lehnwörter, Internationalismen) |
| FS3I.5.B.1 | B Wortschatz | — | a (GA) · b · c | begrenztes Repertoire an Wörtern und Wendungen für vertraute Themen |
| FS3I.5.B.2 | B Wortschatz | — | a (GA) · b · c | bekannte Techniken zum Erschliessen neuer Wörter nutzen |
| FS3I.5.C.1 | C Aussprache | — | a (GA) · b | vertraute Wörter meist verständlich aussprechen |
| FS3I.5.C.2 | C Aussprache | — | a (GA) · b | spezifische Laute beobachten und mit anderen Sprachen vergleichen (ciao, chiamo) |
| FS3I.5.D.1 | D Grammatik | — | a (GA) · b · c | sehr einfache Strukturen intuitiv verwenden, noch häufig Fehler (regelmässiger Plural, erste Konjugationsformen); Negation, Fragewörter erkennen |
| FS3I.5.D.2 | D Grammatik | — | a (GA) · b | unter Anleitung einzelne Strukturen erforschen und vergleichen (Singular/Plural, Artikel, Wortstellung in Fragen) |
| FS3I.5.E.1 | E Rechtschreibung | — | a (GA) · b · c | einzelne Wörter und kurze Wendungen weitgehend korrekt abschreiben |
| FS3I.5.E.2 | E Rechtschreibung | — | a (GA) · b | elementare Rechtschreibregeln erforschen (è/e, che/c’è); eigene Fehler mit Vorlage korrigieren |
| FS3I.5.F.1 | F Sprachlernreflexion und -planung | — | a (GA) · b · c · d | mit Unterstützung Lernziele setzen (Lernjournal, Portfolio) |
| FS3I.6.A.1 | A Kenntnisse | — | a (GA) · b · c · d · e | einige Kulturerzeugnisse und Landeskunde des italienischen Sprachraums kennen |
| FS3I.6.B.1 | B Haltungen | — | a · b | — (kein GA) |
| FS3I.6.C.1 | C Handlungen | — | a (GA) · b · c · d | Lebensalltag des italienischen Sprachraums mit eigenen Erfahrungen vergleichen |

### Latein

Keine GA, keine OP (Abschnitt 1). Alle Stufen gehören zum Zyklus 3.

| Kompetenz | Handlungsaspekt | GA Z2 | Stufen Z3 | Inhalt der Kompetenz (sinngemäss) |
|---|---|---|---|---|
| LAT.1.A.1 | A Texte lesen und verstehen | — | a · b · c | lateinische Sach- und ästhetische Texte lesen und verstehen |
| LAT.1.A.2 | A Texte lesen und verstehen | — | a | Inhalte eines lateinischen Textes sinngemäss auf Deutsch wiedergeben |
| LAT.1.B.1 | B Strategien | — | a · b | Lesestrategien anwenden und reflektieren |
| LAT.2.A.1 | A Texte erschliessen | — | a · b · c | einen lateinischen Text erschliessen |
| LAT.2.B.1 | B Texte übertragen | — | a · b · c | in korrektes, verständliches Deutsch übersetzen; ästhetische Wirkung reflektieren |
| LAT.2.C.1 | C Texte interpretieren | — | a · b · c | Text über seine sprachlichen und inhaltlichen Merkmale interpretieren |
| LAT.2.C.2 | C Texte interpretieren | — | a | Texte mit Werken der Rezeptionsgeschichte vergleichen |
| LAT.2.D.1 | D Strategien | — | 1a · 1b · 2a | gedrucktes oder digitales Wörterbuch nutzen |
| LAT.2.D.2 | D Strategien | — | a · b | Strategien beim Übersetzen anwenden |
| LAT.2.D.3 | D Strategien | — | a · b | beim Interpretieren Hintergrundinformationen verwenden |
| LAT.3.A.1 | A Verstehen von Hörtexten | — | a · b | lateinische Hörtexte verstehen |
| LAT.3.A.2 | A Verstehen von Hörtexten | — | a | Inhalte eines Hörtextes sinngemäss auf Deutsch wiedergeben |
| LAT.3.A.3 | A Verstehen von Hörtexten | — | a · b | ästhetische Wirkung von Hörtexten wahrnehmen und begründen |
| LAT.3.B.1 | B Strategien | — | a | Hörstrategien anwenden und reflektieren |
| LAT.4.A.1 | A Texte vortragen | — | 1a · 2a | lateinische Wörter korrekt aussprechen |
| LAT.4.A.2 | A Texte vortragen | — | a · b · c | lateinische Texte vortragen |
| LAT.4.A.3 | A Texte vortragen | — | a | über die Wirkung vorgetragener Texte nachdenken |
| LAT.5.A.1 | A Bewusstheit für Sprache | — | a · b | sprachhistorische Bedeutung des Lateins kennen |
| LAT.5.A.2 | A Bewusstheit für Sprache | — | a · b | lateinische Herkunftswörter in romanischen Sprachen und Internationalismen erkennen |
| LAT.5.A.3 | A Bewusstheit für Sprache | — | 1a · 1b · 1c · 2a | Entwicklung vom Latein zu romanischen und anderen Sprachen kennen |
| LAT.5.B.1 | B Wortschatz | — | 1a · 1b · 2a | lateinischen Wortschatz aufbauen |
| LAT.5.B.2 | B Wortschatz | — | 1a · 2a · 2b | Techniken zum Wortschatzerwerb und Wortbildungsregeln nutzen |
| LAT.5.C.1 | C Grammatik | — | a | grammatische Strukturen verstehen und mit Deutsch, Französisch, Englisch vergleichen |
| LAT.6.A.1 | A Kenntnisse | — | 1a · 1b · 2a · 3a | Phänomene der antiken Kultur und ihre Entwicklung kennen |
| LAT.6.A.2 | A Kenntnisse | — | 1a · 1b · 2a | kulturelle Prägung lateinischer Begriffe erkennen |
| LAT.6.B.1 | B Haltungen | — | a | Gedanken und Gefühle zu Inhalten reflektieren |
| LAT.6.B.2 | B Haltungen | — | a · b | sich mit Normen und Werten der römischen Kultur auseinandersetzen |
| LAT.6.C.1 | C Handlungen | — | a | authentische Erzeugnisse der antiken Kultur entschlüsseln |
| LAT.6.D.1 | D Literatur und ästhetische Bildung | — | a | Merkmale lateinischer Textsorten kennen |
| LAT.6.D.2 | D Literatur und ästhetische Bildung | — | a · b · c | lateinische Autoren kennen und historisch einordnen |
| LAT.6.D.3 | D Literatur und ästhetische Bildung | — | a · b | spielerisch-kreativ mit lateinischen Texten umgehen |
| LAT.6.D.4 | D Literatur und ästhetische Bildung | — | a · b | bewusste Gestaltung lateinischer Texte erkennen und reflektieren |

## 6. Prüfung

Ein Prüfskript hat alle 152 Kompetenzzeilen am 2026-11-04 frisch aus den ausgelesenen Seitendaten berechnet und
mit diesem Dokument verglichen: Code, GA Z2, Stufen Z3 mit GA, OP, GER und GK. Dazu kamen die Marken der
Detailtabellen D.4.F.1, D.5.D.1, D.5.E.1 und 5.D.1. Ergebnis: 0 Abweichungen. Die Kurzfassungen in der letzten
Spalte sind von Hand geschrieben und **nicht** maschinell geprüft. Für Englisch und Französisch beruhen sie auf dem
englischen Wortlaut; der französische unterscheidet sich nur in den Beispielen (Abschnitt 1).
