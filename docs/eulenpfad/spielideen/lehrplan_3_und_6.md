# Spielideen für die 3. und die 6. Klasse (Schwerpunkt Übertritt in die Oberstufe)

Stand: 02.11.2026 (LERN_Session9, Entscheid G1 a) · Grundlage: Lehrplan SG (Lehrplan 21),
https://sg.lehrplan.ch/, und die Übertrittsregeln einzelner Kantone (Abschnitt 2).

## Kurzfassung

- **Warum diese zwei Klassen:** Ein eigenes Klassenziel (Stufe 3) haben heute 11 Spiele der 3. Klasse
  und 4 der 6. Klasse, gegenüber 28 (2.), 37 (4.) und 42 (5.).
- **6. Klasse = Übertritt:** In allen gelesenen Regeln zählt eine Gesamtbeurteilung durch die
  Lehrperson, und darin die Leistungen. **Mathematik und Deutsch** nennt St. Gallen ausdrücklich;
  Zürich teilt die Anforderungsstufen in M, D, F, E nach der Leistung im Fach zu. Daraus folgt der
  Schwerpunkt: Spiele zu den **GA-Stufen des 2. Zyklus in Mathematik und Deutsch** (Mindestanspruch am
  Ende der 6. Klasse), dort wo der Bestand Lücken hat, besonders **Sachaufgaben**, **Leseverstehen**,
  **Grössen mit Dezimalzahlen** und **Texte überarbeiten**.
- **National:** Der Lehrplan SG ist eine Fassung des Lehrplans 21; Codes und Stufen sind in den
  Kantonen mit Lehrplan 21 gleich (in dieser Sitzung nicht je Kanton nachgeprüft). Die Spiele tragen
  deshalb keine St. Galler Besonderheiten. Abweichend ist die **Reihenfolge der Fremdsprachen**
  (Abschnitt 5).
- **Umfang:** 16 Ideen für die 6. Klasse (8 Mathematik, 6 Deutsch, 2 Rahmen) und 11 für die 3. Klasse.
  Nicht aufgenommen, weil vorhanden: Brüche addieren (Schoggi-Brüche, Stufe 3), Satzglieder
  (3. Zyklus, D.5.D.1.e–g), Zeitformen (Zeitreise-Verben Stufe 5), Stammregel (Morphem-Schere).
  Vorschlag zum Bau in Abschnitt 6.

## 1. Quellen und Abrufweg

- **Lehrplan:** `stufen.json` aus LERN_Session8 (alle 239 Kompetenzseiten, gelesen mit
  `tools/lehrplan_sg_lesen.py`, Stand 02.11.2026), ausgewertet mit `tools/lehrplan_sg_3_6.py`.
  - **3. Klasse (geschätzt):** Stufen des 2. Zyklus **vor dem OP** (OP = Ende 4. Klasse). Der
    Lehrplan trennt 3. und 4. Klasse nicht; 133 Stufen.
  - **6. Klasse:** Stufen des 2. Zyklus **ab der GA-Stufe** (GA spätestens Ende 6. Klasse, belegt in
    der ersten Auswertung); ohne OP auf der Seite die letzte Stufe des 2. Zyklus; 215 Stufen.
  - Abgleich mit dem Katalog auf Ebene der **Kompetenz** (`MA.1.A.3`), weil der Katalog keine
    Stufenbuchstaben führt. „Kompetenz im Katalog“ heisst nur: ein Spiel übt etwas aus dieser
    Kompetenz, nicht zwingend diese Stufe.
- **Übertritt:** wörtlich gelesen, Fundstellen in Abschnitt 2. Reichweite: vier Kantone gesucht, drei
  gelesen; Bern und Aargau nur aus Suchzusammenfassungen, die Dokumente lieferten 404.

## 2. Was beim Übertritt zählt

| Kanton | Grundlage (Wortlaut oder Beleg) | Quelle |
|---|---|---|
| St. Gallen | „Grundlage ist: a) die Gesamteinschätzung der Lehrperson der sechsten Primarklasse. Die Gesamteinschätzung basiert auf dem aktuellen Lern- und Entwicklungsstand, der Lernsituation und der Lernentwicklung […]; b) der Leistungsstand in den Fächern Mathematik und Deutsch.“ Verfügt „Ende Mai des sechsten Primarschuljahres“. | Reglement über Beurteilung, Promotion und Übertritt, vom 19. Juni 2019 mit Nachträgen, Art. 24 Abs. 1–2, S. 6/7 (sg.ch, Weisungen und Reglemente) |
| Zürich | „Die Zuteilung in eine Abteilung erfolgt aufgrund einer Gesamtbeurteilung […]. Diese umfasst die schulischen Leistungen eines Kindes, sein Arbeits- und Lernverhalten, das Sozialverhalten sowie seinen Entwicklungsstand.“ Anforderungsstufen in M, D, F, E nach der „Leistungsbeurteilung im entsprechenden Fachbereich“. | zh.ch, Volksschule, Sekundarschule (ohne Datum, abgerufen 02.11.2026) |
| Luzern | Im Beurteilungsgespräch der 6. Klasse (ab Februar) besprechen Eltern und Lehrperson „die schulischen Leistungen, die Noten, das Verhalten und die mögliche Entwicklung des Kindes“ und entscheiden gemeinsam. Fächer stehen nicht drin. | Dienststelle Volksschulbildung LU, Übertrittsverfahren, Elterninformation, März 2020, S. 2/4 |
| Bern | **nicht belegt:** Suchzusammenfassung nennt Mathematik, Deutsch, Französisch und Lern- und Arbeitsverhalten. | Dokument der Schulaufsicht 404 |
| Aargau | **nicht belegt:** Suchzusammenfassung nennt Leistungen, Selbstständigkeit, Problemlösefähigkeit, Auffassungsgabe; Übertrittsprüfung in D, M, Fremdsprache. | BKS-Merkblatt 404 |

**Folgerung für die Spiele:** Mathematik und Deutsch sind der gemeinsame Kern; Französisch und
Englisch zählen in einem Teil der Kantone (Zürich belegt). Arbeits- und Lernverhalten lässt sich nicht
in einem Spiel üben; der Rahmen kann es aber unterstützen (Ideen R1, R2). Notenschwellen werden nicht
verwendet: sie sind kantonal und je Gemeinde verschieden und nicht belegt.

## 3. Ideen 6. Klasse (Basisklasse 6)

Stufen nach `LS.SKALA`: 1 = 5. Klasse (Stufen nach dem OP), 3 = GA Ende 2. Zyklus, 5 = erste Stufen des
3. Zyklus (in `stufen.json` vorhanden, noch nicht ausgewertet), 6 = Königsstufe.

### Mathematik

| Nr. | Spiel | Lehrplan | Lücke im Bestand | Übertritt | Idee |
|---|---|---|---|---|---|
| S1 | **Sachaufgaben-Werkstatt** | MA.3.C.2.e [GA], MA.3.C.2.d | Sachtext mit Auswahl der Angaben fehlt: Rechengeschichten (2) ist eine Rechnung, Preis- und Velo-Tabelle üben Tabellen, Taschengeld-Planer ein Budget | hoch | Kurzer Sachtext oder Tabelle: wichtige Angaben antippen, unwichtige liegen lassen, Rechenart wählen, Ergebnis mit Einheit eintippen. Stufen: eine Rechnung → zwei Schritte → überflüssige Angaben → Tabelle/Diagramm → Proportionalität erkennen (Stufe 5, MA.3.C.2.f). |
| S2 | **Prozent-Brücke** | MA.1.A.1.g [GA] (Bruch, Prozent, Symbol %) | Prozent kommt nicht vor | mittel | Paare finden: ½ = 0.5 = 50 %, ¼, ¾, ⅕, 1/10, 1/100, 1/20, 1/50. Stufe 5: Prozent von einfachen Beträgen (10 % von 80 Fr.). |
| S3 | **Zeit-Rechner** | MA.3.A.2.h [GA] (Zeit rechnen, umwandeln) | Uhr-Werkstatt (2) rechnet Zeitdauern bis Stufe 6 („Von 8:47 bis 11:20?“), aber ohne Dezimalstunden und Fahrplan | hoch | Fahrplan lesen (Umsteigen, Wartezeit), über Mitternacht, 1.5 h = 90 min, 0.25 h, Zeiten addieren (2 h 45 min + 1 h 30 min). |
| S4 | **Komma-Masse** | MA.3.A.2.h [GA] (benachbarte Einheiten, Dezimalschreibweise) | Masse-Umwandler (3) ohne Dezimalzahlen (zweifach benannt „3 m 25 cm“ schon ab Stufe 3) | hoch | 3.25 m = 325 cm, 2.4 kg = 2400 g, 0.75 l = 7.5 dl, Geld 4.05 Fr. = 405 Rp.; mit Dezimal-Tastatur. Stufe 5: mit Dezimalzahlen rechnen (1.25 kg + 750 g). |
| S5 | **Stufenzahl-Schieber** | MA.1.A.3.f/g, MA.1.A.1.g | Dezimal-Rakete addiert, schiebt nicht | mittel | × und : 10, 100, 1000 mit Dezimalzahlen; das Komma „wandert“ auf der Stellentafel (Stellenfarben). |
| S6 | **Stimmt immer?** | MA.1.B.2.g [GA], MA.2.B.2.c [GA] | Begründen und Prüfen fehlt | mittel | Aussage über Zahlen oder Figuren: immer / manchmal / nie wahr; bei „manchmal“ ein Gegenbeispiel antippen. Übt Problemlösen. |
| S8 | **Quader-Volumen** | MA.2.A.3.e [GA] (Quader aus Würfeln), MA.3.A.1.h (Volumen) | Würfelbau-Blick zählt Ansichten | mittel | Quader aus Einheitswürfeln: Anzahl, fehlende Würfel, l und dm³ (Stufe 5). |
| S9 | **Diagramm-Wahl** | MA.3.A.1.h [GA] (Kreis-, Säulen-, Liniendiagramm) | Diagramm-Detektiv (4) liest Säulen | klein | Welches Diagramm passt zur Frage; Kreisdiagramm in Hälften/Vierteln lesen. |

### Deutsch

| Nr. | Spiel | Lehrplan | Lücke im Bestand | Übertritt | Idee |
|---|---|---|---|---|---|
| S10 | **Sachtext-Detektiv** | D.2.B.1.f [GA] | Wort-Spürnase übt nur Wortbedeutung | hoch | Eigener kurzer Sachtext (4–8 Sätze): Frage zu einer ausdrücklichen Angabe, Titel zu Abschnitten, richtig/falsch/steht nicht drin. Texte in `texte.js`, prüfen nach Entscheid E1 a. |
| S11 | **Hör-Detektiv** | D.1.B.1.f [GA] | Hören in Deutsch fehlt | mittel | Die Eule liest einen kurzen Bericht vor (Vorlesen, de-CH), dann Fragen; Text nicht sichtbar, nochmal hören erlaubt. |
| S12 | **Korrektur-Profi** | D.4.F.1.d [GA] (die meisten Unkorrektheiten finden) | Fehler-Lupe (4) zeigt einzelne Sätze | hoch | Kurzer Text mit 3–5 Fehlern ohne Markierung (Gross/Klein, Doppelkonsonant, Endung, Satzzeichen); finden und verbessern. |
| S13 | **Probe-Werkstatt** | D.5.D.1.c [GA] (Wortarten mit formalen Proben) | Wortarten-Sortierer (3) inhaltlich | mittel | Nomen-, Verb-, Adjektiv-Probe als Werkzeug anwenden: „lässt sich steigern?“, „Artikel davor?“, „lässt sich konjugieren?“. |
| S14 | **Gattungs-Lupe** | D.6.C.1.f [GA] | D9 der Liste 5./6. (offen) | klein | Eigene kurze Auszüge: Märchen, Sage, Fabel, Gedicht, Bericht; Merkmal antippen. |
| S15 | **Figuren-Blick** | D.2.C.1.f [GA] (sich in Figuren hineinversetzen) | fehlt | klein | Kurze Szene, Frage: Warum handelt die Figur so? Was fühlt sie? |

### Rahmen (keine eigenen Spiele)

| Nr. | Idee | Bezug | Übertritt |
|---|---|---|---|
| R1 | **Übertritts-Check 6. Klasse**: Zufallsmix aus allen Mathematik- und Deutsch-Spielen in der GA-Stufe, mit Bericht je Teilgebiet („Sachaufgaben sicher, Zeit rechnen üben“) | Mix und Auswertung vorhanden | hoch |
| R2 | **Lernplan**: ein Ziel je Woche (z. B. dreimal 10 Minuten), Sterne fürs Dranbleiben statt für Tempo; zeigt der Aufsicht Regelmässigkeit | Arbeits- und Lernverhalten (ZH belegt) | mittel |

## 4. Ideen 3. Klasse (Basisklasse 3)

Stufen: 1 = 2. Klasse, 3 = erste Stufen des 2. Zyklus (vor dem OP), 5 = 4. Klasse.

| Nr. | Spiel | Lehrplan | Lücke im Bestand | Idee |
|---|---|---|---|---|
| T1 | **Platzhalter-Geschichten** | MA.3.C.2.c, MA.3.C.3.d | Rechengeschichten (2) ohne Platzhalter | Geschichte → passende Gleichung mit Lücke (28 + _ = 50) und umgekehrt; Umkehroperation. |
| T2 | **Zeit-Schätzer** | MA.3.A.1.e (Zeitpunkt, Zeitdauer, Sekunde), NMG.9.1.e (Zeitdauer schätzen) | Uhr-Werkstatt (2) rechnet Dauern ab Stufe 5, schätzt aber nicht | Zeitpunkt oder Zeitdauer? Wie lange dauert Zähneputzen, ein Lied, die Pause — Sekunden, Minuten oder Stunden? |
| T3 | **Würfel-Zähler** | MA.2.A.3.c (Volumen von Würfelgebäuden vergleichen) | fehlt | Welches Gebäude hat mehr Würfel? Gebäude gleich gross bauen. |
| T4 | **Auge-Entdecker** | NMG.4.3.c (äussere Teile des Auges) | fehlt | Teile beschriften (Lid, Wimpern, Iris, Pupille), Pupille bei hell/dunkel. |
| T5 | **Gemeinde-Helfer** | NMG.10.3.c (öffentliche Einrichtungen) | fehlt | Anliegen → Einrichtung (Feuerwehr, Spital, Gemeindehaus, Bibliothek, Werkhof). |
| T6 | **Gefühle-Detektiv** | D.1.C.1.c (Stimmungen wahrnehmen) | fehlt | Bild, Satz oder gesprochener Satz (Stimmlage) → Gefühl; lesearm. |
| T7 | **Geschichten-Ordner** | D.3.B.1.d, D.4.D.1.c (Abfolge, nacherzählen) | fehlt | Bildergeschichte oder Sätze in die richtige Reihenfolge; Königsstufe mit Zeitwörtern (zuerst, dann, am Schluss). |
| T8 | **Hör-Geschichte** | D.1.B.1.d (globales Hörverständnis) | fehlt | Kurze Geschichte vorgelesen, Fragen zu wer, wo, was passiert. Gemeinsamer Baustein mit S11. |
| T9 | **Alte Kulturen** | NMG.9.3.d (Bild einer vergangenen Kultur) | fehlt | Gegenstände und Bauten Ägypten, Römer, Pfahlbauer zuordnen. |
| T10 | **Hello-Dialog** | FS1E.3.A.1.a (Kontakt aufnehmen) | Englisch-Spiele lesen und hören, sprechen nicht | Passende Antwort im Mini-Dialog wählen (Hello, my name is …). Beginnklasse Englisch je Kanton verschieden (Abschnitt 5). |
| T11 | **Lärm-Detektiv** | NMG.4.2.b (Schutz vor Lärm) | fehlt | Geräusch-Situationen nach laut/leise, Schutz zuordnen; nur Randidee. |

## 5. Hinweise für die nationale Nutzung

- **Fremdsprachen:** Die Basisklassen der Englisch- und Französisch-Spiele folgen der St. Galler
  Reihenfolge (Englisch ab 3., Französisch ab 5.). In Kantonen mit Französisch zuerst (Passepartout,
  etwa BE, BS, BL, SO, FR, VS; in dieser Sitzung nicht nachgeprüft) ist es umgekehrt. Braucht eine
  Einstellung „Sprachenfolge“ in der Verwaltung, die Klasse und Stufenvorschlag dieser Spiele
  verschiebt — eigener Entscheid, nicht Teil dieser Liste.
- **Inhalte:** Ortsnamen, Geld (Fr.) und Schweizer Schreibweise sind national gültig. Kantonale
  Eigenheiten (Schulweg, Karten) bleiben auf die Schweiz bezogen.
- **Romandie und Tessin** nutzen andere Lehrpläne (PER, Piano di studio) und andere Sprachen; nicht im
  Umfang.

## 6. Vorschlag für den Bau

- **Runde A (6. Klasse, Übertritt):** S1, S3, S4, S10, S12 (hoch), S2, S5, S6, S11, S13, dazu R1.
- **Runde B (3. Klasse):** T1–T8.
- **Danach:** S8, S9, S14, S15, T9–T11, R2.
- Stufen 5 und 6 der Basisklasse 6 brauchen die Stufen des 3. Zyklus aus `stufen.json` (lesen beim Bau).
