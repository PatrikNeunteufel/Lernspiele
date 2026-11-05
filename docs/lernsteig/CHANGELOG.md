# Changelog Lernsteig

Eigenes Logbuch des Lernsteigs (das `CHANGELOG.md` im Repo-Root gehört dem Eulenpfad). Neueste Einträge oben.

## 2026-11-05 — LST_Session1 (Fortsetzung)

- Fehler behoben: `brueche` schrieb in der Challenge Nenner ab vier Stellen ohne Apostroph („61/1080“).
- **Natur und Technik:** 26 Kompetenzseiten von sg.lehrplan.ch gesichert (`lehrplan/quellen_nt/`) und ausgewertet
  (`lehrplan/nt_zyklus3.md`); Fach NT freigeschaltet. Erste Übung **Stromkreis und Ohmsches Gesetz** (NT.5.2 b, c, d:
  Serie und Parallel als Auswahl, geprüft über ein Schaltungsmodell; Ohmsches Gesetz; Knoten- und Maschenregel).
  Formel und Einheiten stehen nicht im Lehrplan: Annahme, mit dem Lehrmittel abzugleichen. Testskript kennt die
  NT-Codes.
- Vierte NT-Übung **Stoffwechsel: Organe und Vorgänge** (NT.7.2 a, OP): Zuordnung wörtlich nach den Verbindlichen
  Inhalten des Lehrplans (belegt), Lunge und Verdauungsorgane mit „Aufnahme und Abgabe“.
- Dritte NT-Übung **Atombau und Periodensystem** (NT.3.2 a, c, d: Metall/Nichtmetall/Edelgas, Protonen, Neutronen,
  Isotope, Schalen, Hauptgruppe, Ionen nach der Edelgasregel; Elementdaten 1 bis 20 in `pse.js`, ungeprüft; die
  Prüfung rechnet die Schalen über die Stellung im PSE nach).
- Zweite NT-Übung **Kräfte und einfache Maschinen** (NT.5.1 a, c, d, e: Geschwindigkeit aus dem Weg-Zeit-Diagramm,
  Gewichtskraft mit g = 10 N/kg, Beispiele einfacher Maschinen als Liste `maschinen.js` ungeprüft, Goldene Regel mit
  Hebel, Flaschenzug, schiefer Ebene).
- Zwei Mathe-Übungen: **Möglichkeiten zählen** (MA.3.B.2 d, f, g: systematisch zählen, Wahrscheinlichkeit bei zwei
  Münzen oder Würfeln, Handshakes und Analogien) und **Daten und Zufall** (MA.3.C.1 f, h, i: Mittelwert, Baumdiagramm,
  Ziehen mit und ohne Zurücklegen, Wahrscheinlichkeit aus relativer Häufigkeit). Die Prüffunktionen zählen jede Antwort
  durch Aufzählen aller Fälle nach.
- Mathe-Übung **Körper, Winkel, Ähnlichkeit** (MA.2.A.3 j, k: Pyramide, Kegel, Kugel, Winkelsummen, Thales,
  Streckfaktor für Länge, Fläche, Volumen).
- Testskript: Zahlschreibung ab vier Stellen mit Apostroph auch im Lösungsweg (alle Mathe-Übungen).
- Entscheide AF1 a, AF2 a.
- **Statistik** (`lernsteig/statistik.html`): Überblick, Stand je Übung und Stufe, letzte Runden. **Sichern und
  Einlesen** als Datei (`gemeinsam/daten.js`), Einlesen führt zusammen. Testskript prüft Sichern und Einlesen im Browser.
- **Wochenziel** (BF1 a, Serie über Tage): selbst gesetzte Übungstage je Woche, Wochen in Folge erreicht; geprüft
  mit festen Daten im Testskript.
- **Aufsicht** (`lernsteig/aufsicht.html`, AU1 a): Eltern und Lehrpersonen mit PIN und Code; Verbindung zu einem Konto
  nur durch Anlegen, Zustimmung des Jugendlichen (mit PIN) oder eingelesene Sicherung; der Jugendliche sieht, wer
  mitliest, und kann lösen. Einstellungen des Geräts (Taschenrechner, Dezimalzeichen) nur durch die Aufsicht.
  Entscheide AF1 a (Lösen durch Jugendlichen und Aufsicht), AF2 a (Einlesen verbindet). Testskript spielt den Ablauf.
- Auftrag R6 (Teil NT) für die lokale Sitzung: `sg.lehrplan.ch` ist aus der Cloud gesperrt.

## 2026-11-04 — LST_Session1

- **Konten** (`lernsteig/gemeinsam/konten.js`, AU1 a, KT1 a, GE1 b, EL1 a): selbst anlegen mit Geburtsdatum und
  Klasse, PIN freiwillig mit Wiederherstellungscode (nur Hash), PIN vergessen, Anmeldung je Tab bei PIN, Einladungslink.
  **Kompetenzstand** (BF1 a) je Lehrplan-Stufe in der Stufenwahl und auf der Startseite. Testskript spielt den Ablauf.

- Modalverb-Aufgaben in Englisch und Französisch eindeutig gemacht (falsche Antworten sind falsche Formen statt anderer
  korrekter Verben; „Je vais faire …“ wäre auch richtig gewesen).
- Erste Französisch-Übung **Français : grammaire** (FS2F.5.D.1 b, c, d, Challenge) mit Inhaltsliste `franzoesisch.js`
  (ungeprüft); Prüfung der französischen Typografie (geschütztes Leerzeichen vor ? ! :).
- Katalogfeld `sprache`: Aufgabentext und Antworten der Fremdsprachen-Übungen tragen `lang` (Vorlesen, Trennung).
- Erste Englisch-Übung **English grammar** (FS1E.5.D.1 b, c, d, Challenge): be/have, Pronomen, Fragewörter, Wortstellung,
  zwei Objekte, unregelmässige Mehrzahl, Präpositionen, Modalverben, Verneinung, Zeitformen; Inhaltsliste `englisch.js`
  (ungeprüft). Testskript liest die Fremdsprachen-Tabelle der Recherche.
- Deutsch-Übung **Rechtschreibung** (D.5.E.1 d, e, f, g, Challenge): ie, f/v, e/ä, ck/tz, Grossschreibung über
  Nachmorpheme, nominalisierte Verben und Adjektive, Höflichkeitsform, Kommas; Inhaltsliste `rechtschreibung.js`
  (ungeprüft), Form maschinell geprüft.
- Erste Deutsch-Übung **Grammatik: Fälle, Wortarten, Formen** (D.5.D.1 e, f, g, Challenge) mit Inhaltsliste
  `grammatik.js` (ungeprüft; fünf Wortarten der Schweizer Schulgrammatik, Artikel als Pronomen — Annahme). Marken
  D.5.D.1 in `lehrplaene.js`, Testskript liest auch die Sprachen-Recherche. Übungen ohne `rechner` im Katalog zeigen
  keinen Rechner und keinen Rechner-Hinweis.
- Übung **Binome und Gleichungen** (MA.1.A.4 l, m, Challenge): binomische Formeln (Term-Antwort), Potenzgesetze,
  quadratische Gleichungen durch Faktorzerlegung, Gleichungssysteme, Bruchgleichungen; jede Lösung eingesetzt geprüft.
- Übung **Lineare Funktionen** (MA.3.A.3 j, k, Challenge): Schnittpunkt, Steigung und Achsenabschnitt am Graphen und aus
  Punkten, Nullstelle, Gerade durch zwei Punkte; Prüfung liest die Gleichungen aus dem Text.
- Startseite: Übungen nach Themenbereich gegliedert, Marke „wird geprüft“ je nach Prüfungsziel.
- Übung **Brüche rechnen** (MA.1.A.3 f, g, i, Challenge; MA.1.A.1.h): kürzen, erweitern, Grundoperationen auch negativ,
  umschreiben; Term-Antwort mit neuer Form `bruch` (vollständig gekürzt, ganze Zahl ohne Nenner).
- Übung **Koordinaten** (MA.2.C.4 h, i, j, Challenge): Massstab, Abstände und Flächen auch negativ, Spiegelungen,
  Dreiecksfläche, Mittelpunkt; Graph zeigt Punkte mit Namen und Vielecke (`punkte`, `vieleck`).
- Übung **Sachsituationen** (MA.3.C.2 f, g, h, Challenge): Dreisatz, Taxitarif, Weg-Zeit-Graph, Tabelle/Text und Term
  zuordnen, Tarifvergleich. Graph mit eigenem Massstab der y-Achse und Achsennamen. Behoben: Gleichstand im
  Tarifvergleich durch Fliesskomma falsch (jetzt ganzzahlig).
- Übung **Folgen und Muster** (MA.1.C.2 g, h, i, j, Challenge): Zahlenfolgen, Teiler, Zahlenrätsel, Figurenfolgen als
  Tabelle, Summen ungerader Zahlen, Term zur linearen Figurenfolge (Term-Antwort).
- Übung **Aussagen prüfen** (MA.1.B.2 h, j, k, Challenge): „Welche Aussage stimmt (nicht)?“; Aussagen als
  Inhaltsliste `aussagen.js` (ungeprüft), jede maschinell nachgerechnet (Terme exakt, Teilbarkeit durch Einsetzen).
  Testskript lädt Inhaltslisten im Übungsordner.
- Übung **Mittelwert, Häufigkeit, Rabatt** (MA.3.A.1 j, k, l, Challenge): arithmetisches Mittel, Währung,
  relative und absolute Häufigkeit, Wahrscheinlichkeit, Rabatt, Brutto und Netto; Franken auf 5 Rappen.
- Übung **Überschlagen und Ordnen** (MA.1.A.2 h, i, j, Challenge) mit Antworten zum Auswählen: Rahmen kann jetzt
  `art: "auswahl"` (Knöpfe, Kurztasten 1–4, falsche Wahl wird gesperrt). Prüfung: genau eine Antwort richtig,
  Überschlag-Antworten um Zehnerpotenzen auseinander, Ordnen exakt mit Brüchen nachgerechnet.
- Übung **Grosse Zahlen und Zehnerpotenzen** (MA.1.A.1 i, j, k; Challenge MA.1.A.3.j): Zahlwörter bis eine
  Milliarde (Prüfung liest sie mit eigenem Parser zurück), wissenschaftliche Schreibweise, Rechnen mit Zehnerpotenzen.
  Behoben in `werkzeug.js`/`bruch.js`: sehr kleine Zahlen erschienen als „4.485e-8“, grosse wurden ungenau gerundet.
- **Rechner je Modell** nach R11 (RM1 b, F1–F3): allgemein, TI-30X Plus MathPrint, TI-30 eco RS, Casio fx-82DE PLUS /
  DE X — je Modell die Bedienlogik (Vorzeichen und Wurzel vor oder nach der Zahl, Index oder Radikand zuerst, Ans),
  eigene Beschriftung, Bedienhilfe „?“ mit Tipps und Seitenangaben der Anleitungen, Tipps bei typischen Fehlern,
  Markenvermerk; Wahl im Rechner und auf der Startseite („Mein Taschenrechner“, Konto-Feld `rechnerModell`).
  Testskript mit den Beispielen aus den Anleitungen.
- Übung **Längen, Flächen, Volumen berechnen** (MA.2.A.3 f, g, h, i, Challenge): Quader, Drei- und Vierecke,
  Pythagoras, Kreis, Prisma, Zylinder; Rahmen mit `toleranz` für gerundete Ergebnisse, Rechner mit π-Taste.
- Recherche R11 von master hereingeholt.
- Vorschlag gemeinsame Bibliothek `docs/commons_bibliothek.md` (KB1, KB2); Session-Report `report/LST_Session1_2026-11-04.md`.

- master mit Lehrplan-Recherche SG, Abgleichnotiz und Entscheid Z1 a hereingeholt (Merge, Handover zusammengeführt).
- Rahmen im Entwurf: `lernsteig/gemeinsam/` (`werkzeug.js`, `lehrplaene.js`, `katalog.js`, `rahmen.js`, `stil.css`),
  Vertrag `rahmen.md`; Muster-Übung `lernsteig/uebungen/ganze-zahlen/`. Übernahmen in `docs/gemeinsame_mechaniken.md`.
- Neu vorgelegt: NV2, ST1, MZ1, TR1, UE1 — entschieden NV2 a, ST1 a (mit Zusatz), MZ1 a, TR1 a (mit Zusatz), UE1 a.
- Niveaus nach NV2 a (`n1`, `n2`, Prüfungsziel, Schulniveaus SG, geprüfte Stufen nach PA in `lehrplaene.js`).
- Startseite neu (`lernsteig/index.html`, `start/`): Land, Kanton, Prüfungsziel, Niveau je Fach, Übungen.
- Testskript `werkzeuge/pruefe_uebungen.js` (ohne und mit Browser), grün.
- Rückfragen ST2 (Übergangs- und Challenge-Stufen) und RE1 (eingebauter Rechner) — beide a; neu RM1.
- Stufenmodell nach ST1 a/ST2 a: `LST.stufenListe`, `LST.zielstufe`, Marken GA/OP/E Mathematik Z3 in `lehrplaene.js`.
- Übung **Terme vereinfachen** (MA.1.A.4 i, j, k, Challenge) mit Term-Antworten: `lernsteig/gemeinsam/terme.js` liest
  Terme exakt als Polynome, vergleicht auf Gleichwertigkeit und prüft die Form (vereinfacht, Potenz, ausgeklammert);
  stimmt nur die Form nicht, zählt es nicht als Fehlversuch. Hilfstasten für Variablen, Hochzahl, Klammern.
- Übung **Prozent und Funktionswerte** (MA.3.A.3 g, h, i, Challenge); Rahmen zeichnet Wertetabellen und Graphen
  (`a.darstellung`), lange Aufgabentexte kleiner. Behoben: „null“ im Text bei leeren Teilen; Hinweise mit Zahlen, die
  zufällig die Lösung nannten.
- Übung **Grössen umwandeln** (MA.3.A.2 h, i, j, k, Challenge): Prüfung über eine eigene Tabelle der Grundeinheiten;
  sie fand periodische Zeitumrechnungen und einen Hinweis, der die Lösung nannte — beides behoben.
- Übung **Gleichungen lösen** (MA.1.A.4 h, j, Challenge): Prüfung liest beide Seiten als lineare Terme, löst exakt und
  prüft jeden Schritt des Lösungswegs. Gemeinsame Bruchrechnung `lernsteig/gemeinsam/bruch.js`; Rahmen zeigt Text vor
  und nach dem Feld (`vor`, `einheit`).
- Eingebauter Rechner (`lernsteig/gemeinsam/rechner.js`, Ansicht „allgemein“) nach TR1 a/RE1 a: Knopf je nach
  Stufe, Einstellung der Aufsicht, Nutzung im Protokoll, Bestzeit und Rekord mit/ohne Rechner getrennt; im Testskript
  Rechenkern und Bedienung.
- RM1 b entschieden; Auftrag R11 (Rechnermodelle) für die lokale Sitzung in `lehrplan/R11_auftrag_rechnermodelle.md`.
- Muster-Übung umgebaut zu **Rationale Zahlen rechnen** (MA.1.A.3 g, h, i, Challenge), Prüfung mit exaktem Bruch-Parser.

- Entscheide G1, SP1, NV1, AU1, BF1 (je a, mit Zusätzen von Patrik) festgehalten in `HANDOVER.md` und `fragen.md`.
- Neu `fragen.md`: Übersicht der Entscheidungsfragen; DS1 a, KT1 a, GE1 b, EL1 a, AB1 a, GW1 a, GR1 a entschieden.
- Neu `notizen_fuer_eulenpfad.md`: Punkte für den Eulenpfad (Klassenaufstieg und Wechsel per Knopf, Aufstieg als
  Erfolg, Geburtsdatum, `.gitignore`).
