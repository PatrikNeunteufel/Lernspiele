# Rahmen des Lernsteigs — Vertrag zwischen Rahmen und Übungen

Stand: 2026-11-04 (LST_Session1) · **Entwurf**: Niveaus nach NV2 a, Stufen nach ST1 a und ST2 a umgesetzt; offen
sind die Rechner-Ansichten je Modell (RM1 b, nach R11) und die Anmeldung ([fragen.md](fragen.md)). Vorbild: `docs/eulenpfad/rahmen.md`; jede Übernahme steht in
[gemeinsame_mechaniken.md](../gemeinsame_mechaniken.md). Kein Laden aus `eulenpfad/`.

Pfade gelten relativ zum App-Ordner `lernsteig/`.

## 1. Aufbau

```
kern/kern.js              gemeinsamer Kern der Reihe (KERN.zahl, KERN.bruch: exakte Bruchrechnung für Prüffunktionen),
                          erzeugt von tools/kern_verteilen.py aus kern/ — nie von Hand ändern
gemeinsam/werkzeug.js     reiner Teil (ohne DOM): Speicher lernsteig:*, Zufall, Schreibweise der Zahlen, Niveaus, Stufen
gemeinsam/lehrplaene.js   Lehrplan-Profile: Länder, Kantone, Namen der Niveaus
gemeinsam/katalog.js      Fächer und Übungen (einzige Quelle für Fach, Kompetenz, Basisklasse, Niveaus, Endlos-Stufen)
gemeinsam/pruefstand.js   was geprüft ist; Ungeprüftes ist für Jugendliche gesperrt (FG1 a, A1 a)
gemeinsam/konten.js       Konten, PIN und Code, Aufsicht mit Verbindungen, Einladung
gemeinsam/daten.js        Sichern und Einlesen
gemeinsam/terme.js        Terme lesen, vergleichen, Form prüfen (Term-Antworten)
gemeinsam/rechner.js      eingebauter Taschenrechner: Rechenkern (ohne DOM) und Tastenfeld
gemeinsam/rahmen.js       Seitenteil: Konto, Stufenwahl, Runde, Serie, Protokoll, Rekorde
gemeinsam/stil.css        Stil, Farben nur hier (:root)
index.html, start/        Startseite: Land, Kanton, Prüfungsziel, Niveau je Fach, Übungen je Fach
uebungen/<id>/aufgaben.js Aufgaben als Daten (ohne DOM), Prüffunktion, Hinweise
uebungen/<id>/index.html  lädt kern/kern.js, werkzeug, lehrplaene, katalog, terme, rechner, konten, pruefstand, rahmen,
                          die Inhaltslisten und aufgaben.js, ruft LST.uebung(...)
```

Eine Übungsseite läuft offline per Doppelklick (`file://`).

## 2. Zahlschreibung

Nur über `LST.zahlText(n)` und `LST.dezimalText(x, stellen)` (Entscheid Z1 a): Apostroph ab vier Stellen („1'000“),
Dezimalpunkt. Minus vorerst „−“ (U+2212), Frage MZ1. Eingaben liest `LST.leseZahl(text)`: „-“, „−“, „–“, Apostroph,
Leerzeichen, Punkt und Komma sind erlaubt.

## 3. Niveaus und Stufen (Entwurf)

- **Niveaus** (NV2 a): `n1` = bis Grundanspruch Z3, `n2` = GA plus Auftrag Z3, je Fach im Konto. Name aus
  `LST_LEHRPLAENE.niveauName(niveau, lehrplan)`: Schweiz „Real“, „Sek“, sonst „Grundlegend“, „Erweitert“.
  Schulniveaus g/m/e je Kanton in `LST_LEHRPLAENE.KANTON` (bisher SG; g → `n1`, e → `n2`, m ohne Zuordnung).
- **Prüfungsziel** (NV2 a): `keins`, `stellwerk8`, `gymnasium`, `eap`; wählbar je nach Kanton
  (`pruefungszieleFuer`). `LST_LEHRPLAENE.geprueft("MA.1.A.4.j", ziel, lehrplan)` sagt, ob eine Stufe geprüft wird
  (Tabelle `PRUEFUNG_STUFEN` nach PA, `lehrplan/sg_oberstufe_praxis.md` 3).
- **Stufen** (ST1 a, ST2 a, `LST.stufenListe(eintrag)`): je Lehrplan-Stufe der Übung eine **Referenzstufe** (Id =
  Buchstabe, „Stufe h“), dazwischen ein **Übergang** (Id „h-i“, Aufgaben beider Stufen gemischt, je Aufgabe zufällig),
  zuoberst die **Challenge** (Id „challenge“, überall gleich: alle Stufen, schwerste Varianten, mehrere Schritte, kein
  Stoff über den Lehrplan hinaus). Die Zahl der Stufen hängt an der Übung, Namen und Verhalten nicht.
- Die Stufenwahl zeigt je Referenzstufe die Marken aus `LST_LEHRPLAENE.MARKEN` (Grundanspruch Zyklus 2,
  Orientierungspunkt, Grundanspruch, mit Erweiterung — ausser die Übung lässt sie weg, `ohneE`), das **Ziel** des
  Niveaus (`LST.zielstufe`: `n1` GA Z3, ohne GA der OP; `n2` letzte Stufe Z3), „weiterführend“ darüber, „wird geprüft“
  nach Prüfungsziel und den Taschenrechner der Stufe.
- Die Aufgaben einer Stufe hängen nicht am Niveau; Bestzeit und Rekord gelten je Stufe.
- Adresse: `?niveau=n1&stufe=h` (oder `h-i`, `challenge`) startet direkt, `&endlos=1` als Serie.

## 4. Eine Übung

`aufgaben.js` definiert auf oberster Ebene:

- `UEBUNG = { id, einleitung, stufen: { <buchstabe>: "Beschreibung", …, challenge: "…" } }`
- `aufgabeErzeugen(stufe, niveau)` mit `stufe` = Lehrplan-Buchstabe oder `"challenge"` (Übergänge mischt der Rahmen)
  → `{ art: "zahl", stufe, typ, text, antwort, loesung, weg, kennung, daten }`. `stufe` nennt die Lehrplan-Stufe der
  Aufgabe (fürs Protokoll und den Kompetenzstand), `kennung` erkennt Wiederholungen, `weg` ist der Lösungsweg.
- **Term-Antworten:** `art: "term"` mit `antwortTerm` (etwa „3a + 4b + 5/8“), `form` (`vereinfacht`, `potenz`,
  `ausgeklammert`, `frei`) und `tasten` (Hilfstasten). Der Rahmen prüft mit `LST_TERME.bewerte`: gleichwertig und in
  der Form → richtig; gleichwertig, aber Form falsch → Hinweis ohne Fehlversuch; nicht gleichwertig → Fehlversuch.
  `lernsteig/gemeinsam/terme.js` liest Variablen a–z, Zahlen, Brüche „5/8“, `+ − · * : ( )`, implizites Mal und
  Potenzen („^2“, „²“) exakt als Polynom.
- **Auswahl-Antworten:** `art: "auswahl"` mit `optionen` (Texte) und `richtig` (Index); der Rahmen zeigt Knöpfe mit
  Kurztasten 1 … n, eine falsche Wahl wird gesperrt (Fehlversuch), `kennung` soll die Antworten enthalten.
- Optional `vor` („x =“) und `einheit` („m²“): Text vor und nach dem Eingabefeld.
- Katalogfeld `sprache` („en“, „fr“): Aufgabentext und Antworten tragen dieses `lang`, damit Vorlesefunktionen und
  Silbentrennung die Fremdsprache erkennen; die Seite bleibt `de-CH`.
- Optional `darstellung`: `{ art: "tabelle", kopf, zeilen }` (Wertetabelle) oder `{ art: "graph", m, b, x: [min, max],
  y: [min, max] }` (Gerade im Gitter); der Rahmen zeichnet sie unter den Aufgabentext. Zusätze zum Graphen:
  `schrittY`, `beschrY`, `hoehe` (eigener Massstab der y-Achse), `xName`, `yName` (Achsennamen), `punkte: [{ x, y, name }]`
  und `vieleck: true` (Punkte verbunden); ohne `m` keine Gerade.
- Hinweise ohne Ziffern formulieren, wo eine Zahl zufällig die Lösung sein kann („ein Prozent“ statt „1 %“) — das
  Testskript meldet jeden Hinweis, der die Lösung enthält.
- `pruefeAufgabe(aufgabe, stufe, niveau)` → Liste von Mängeln. Unabhängig vom Generator nachrechnen (Rationale
  Zahlen: exakter Bruch-Parser über den angezeigten Term), Grenzen der Lehrplan-Stufe, Schreibweise.
- `hinweis(aufgabe, eingabe)` → Text bei einem Fehlversuch. Nennt die Lösung nie.

Der Katalog-Eintrag nennt `kompetenz` („MA.1.A.3“), `stufen` (Buchstaben), `weitere` (Nebenkompetenzen), `ohneE`,
`rechner` (je Stufe und Challenge `ohne`/`mit`/`frei`, TR1 a), `niveaus`, `anzahl`, `endlos` (`true` oder Liste) und
`neu` (Sitzung, bis geprüft). Codes nur aus `docs/lernsteig/lehrplan/`.

## 5. Ablauf einer Runde

- `anzahl` Aufgaben. Fehlversuch: Hinweis, neuer Versuch, nach dem dritten die Lösung mit Weg und „Weiter“. Kein
  Punktabzug, kein Zeitdruck; die Zeit je Aufgabe wird gemessen.
- Ergebnis: auf Anhieb richtig, Zeit, Bestzeit (nur Runden ohne gezeigte Lösung). Keine Sterne (BF1 a).
- **Serie** (Endlos): Aufgaben, bis eine falsch ist; Rekord je Konto, Übung, Stufe und Niveau. Gespeichert, sobald die
  Serie vorbei ist; beim Verlassen mitten drin als Zwischenstand (`abgebrochen: true`).

## 5a. Taschenrechner (TR1 a, RE1 a, RM1 b)

- Je Lehrplan-Stufe und Challenge nennt der Katalog `rechner`: `ohne`, `mit`, `frei`. Die Aufsicht überstimmt mit
  `einstellungen.rechner`: `uebung` (Standard), `ohne` (überall gesperrt), `erlaubt` (auch bei `ohne`). Die Oberfläche
  dafür kommt mit der Anmeldung der Aufsicht.
- Bei `mit` und `frei` gibt es den Knopf „Rechner“; das Feld bleibt über die Runde offen, `Ans` merkt sich das letzte
  Ergebnis. Bei `ohne` ist es weg (in einem Übergang je Aufgabe).
- Funktionen nach RE1 a: Ziffern, Punkt, `+ − · :`, Klammern, `x²`, `xʸ`, `√`, `ⁿ√` (zuerst n, dann die Taste, dann die
  Zahl), Vorzeichen `(−)` getrennt vom Minus, `Ans`, Löschen, AC, „→ Antwort“. Rangfolge: Klammern, Wurzel und
  Potenz, Vorzeichen, Punkt vor Strich ((−)2² = −4). Ergebnis mit höchstens 10 gültigen Ziffern in der Schreibweise
  des Lernsteigs, sehr gross oder klein wissenschaftlich („1.32 · 10⁸“). Tastatur: Ziffern, `+ - * / ^ ( )`, Enter,
  Rücktaste, Esc.
- **Verwendung wird nicht überwacht** (geht im Browser nicht): „ohne“ ist eine Abmachung. Protokolliert wird, ob der
  eingebaute Rechner offen war (`liste[i].rechner`, `mitRechner` je Runde und Rekord); Bestzeit und Rekord gelten je
  Seite (mit / ohne Rechner) getrennt.
- **Modelle** (RM1 b, R11 `lehrplan/rechnermodelle_sg.md`, F1–F3): `LST_RECHNER.MODELLE` — allgemein, TI-30X Plus
  MathPrint, TI-30 eco RS, Casio fx-82DE PLUS / DE X. Je Modell die Bedienlogik (Tasten-Kennungen `(−)` vor oder
  `+⇔−` nach der Zahl, `√` vor oder `√x` nach der Zahl, `ⁿ√` Index zuerst oder `ˣ√y` Radikand zuerst, Ans ja/nein),
  eigene Beschriftung im sachlichen Aussehen des Lernsteigs, Bedienhilfe „?“ mit Seitenangaben, Tipps bei typischen
  Fehlern (`tippZuFehler`), Markenvermerk „nicht verbunden mit …“. Kein getreues Abbild, keine Fotos oder Logos (R11
  Abschnitt 3; ein Abbild erst nach Anfrage beim Hersteller, R17). Gewählt im Rechner oder auf der Startseite, im
  Konto `rechnerModell`.

## 5b. Konten und Kompetenzstand (AU1 a, KT1 a, GE1 b, EL1 a, BF1 a)

- `gemeinsam/konten.js` (`LST_KONTEN`): Jugendliche legen ihr Konto selbst an (Vorname, Geburtsdatum, Klasse 1.–3.
  Oberstufe, PIN freiwillig 4–6 Ziffern). Land, Kanton, Niveaus, Prüfungsziel und Rechnermodell übernimmt das neue
  Konto vom Gast. Mit PIN: nur Salz und SHA-256-Hash gespeichert, dazu ein Wiederherstellungscode („K7QM-2XRA-9TPL“,
  nur einmal angezeigt, ebenfalls nur als Hash). „PIN vergessen?“ setzt mit dem Code eine neue PIN und gibt einen neuen
  Code. `ohneGeheimnis(k)` für Sicherungen und Abgleich.
- Angemeldet: Konto ohne PIN bleibt gewählt (`lernsteig:aktiv`); mit PIN nur im geöffneten Tab
  (`sessionStorage lernsteig:angemeldet`). Ohne Konto gilt das Gastkonto. `LST.konto()` liefert immer das aktive.
- Alter aus dem Geburtsdatum (`LST_KONTEN.alter`).
- **Einladung** (EL1 a): `…/lernsteig/#einladung=<base64url(JSON)>` mit `{ v: 1, name, geboren, klasse, niveau,
  lehrplan }`; die Startseite füllt das Formular vor und löscht das Fragment. Erzeugt mit `einladungErstellen(daten)`
  (für den Eulenpfad, Notiz EP1).
- **Kompetenzstand** (`LST.kompetenzstand(konto, uebung, lp)`): je Lehrplan-Stufe aus der Protokoll-`liste`:
  *sicher* ab 10 Aufgaben mit mindestens 85 % auf Anhieb in den letzten 10 und keiner gezeigten Lösung (ohne Rechner;
  sonst *sicher mit Rechner*), *am Üben* ab einer Aufgabe, sonst *offen*. Schwellen in `STAND` (Annahme). Angezeigt als
  Marke in der Stufenwahl (Tooltip mit Zahlen) und auf der Startseite („2 von 3 Stufen sicher“).
- **Serie über Tage** (BF1 a, selbst gesetzt, ohne Stern): Wochenziel `wochenziel` (1–7 Tage je Woche) im Konto,
  gesetzt auf der Statistik-Seite. Übungstag = Kalendertag (Ortszeit) mit mindestens einer Runde, Wochen ab Montag.
  `LST.wochenSerie(tage, ziel)` (werkzeug.js) zählt die Tage dieser Woche und die Wochen in Folge mit erreichtem Ziel;
  die laufende Woche unterbricht die Serie nicht. Angezeigt auf Startseite, Statistik und bei der Aufsicht (nur lesen).
- Noch nicht: Abgleich über einen Ordner.

## 5c. Statistik, Sichern und Einlesen (BF1 a, DS1 a)

- `statistik.html` (Code `start/statistik.js`), verlinkt von der Startseite: für das aktive Konto, sonst den Gast.
  Überblick (Runden, Aufgaben, Anteil auf Anhieb, Übungstage der letzten 14 Tage), Kompetenzstand je gespielter Übung
  und Lehrplan-Stufe (5b), die letzten 10 Runden.
- **Sichern** nur auf Knopfdruck (`gemeinsam/daten.js`, `LST_DATEN`): Datei `lernsteig-<vorname>-<datum>.json`,
  `{ format: "lernsteig-sicherung", version: 1, erstellt, konten, runden, rekorde }`, nur die Daten des Kontos, Konten
  ohne PIN und Code (`ohneGeheimnis`). Das Gastkonto selbst reist nicht mit, nur seine Runden und Rekorde.
- **Einlesen** (Befund D4, seit LERN_Session15): zuerst wird die ganze Datei geprüft — Konten mit
  `KERN.person.maengel`, Runden und Rekorde mit eigenem Schema (`LST_DATEN.rundeGueltig`, `rekordGueltig`: Kennung,
  Konto, Zeit, bekannte Übung, Stufe, Zahlen); Ungültiges wird gezählt und nie gespeichert. Dann wird im Speicher
  zusammengeführt und erst am Ende geschrieben, alles oder nichts (voller Speicher → alter Stand, Meldung).
  Konten mit `KERN.person.zusammenfuehren` (P1 a: gleiche Kennung, sonst gleicher Name; je Feld der jüngere Stand;
  PIN, Code und Verbindungen bleiben die des Geräts); Runden nach Kennung (gleiche zählt einmal, nach Zeit sortiert),
  Rekorde nach Kennung (höherer Stand); Verweise auf zusammengeführte Kennungen werden umgebogen. Ältere Sicherungen
  (Konto mit `erstellt` und einer Zeit `geaendert`) werden umgedeutet. Keine Löschvermerke. Andere Dateien werden mit
  Meldung abgewiesen. Test: `docs/lernsteig/werkzeuge/pruefe_konten.js`.

## 5d. Aufsicht (AU1 a, TR1 a)

- `aufsicht.html` (Code `start/aufsicht.js`), verlinkt von der Startseite. Freiwillig, für Eltern und Lehrpersonen.
  Seit LERN_Session15 (P2 a) stehen Jugendliche und Aufsichten in **einer** Liste `lernsteig:personen`
  (`KERN.person`, docs/kern/rahmen.md 4.7): Aufsicht `{ id, name, rolle: "aufsicht", art: eltern | lehrperson, pin,
  wiederherstellung, angelegt, geaendert }`; die früheren Listen `lernsteig:konten` und `lernsteig:aufsichten` zieht
  `konten.js` beim ersten Laden um (Kennungen bleiben). PIN Pflicht (`KERN.geheimnis`), Wiederherstellungscode,
  angemeldet nur im Tab (sessionStorage `lernsteig:aufsicht`). **Eine weitere Aufsicht** auf dem Gerät nur mit
  Bestätigung durch eine bestehende mit deren PIN (wie Eulenpfad KR2 a; Befund D5).
- **Verbindung** im Konto: `aufsicht` (Ids), offene Anfragen `anfragen` (Ids). Sie entsteht nur, wenn (1) die Aufsicht
  das Konto anlegt (ohne PIN; die setzt der Jugendliche selbst), (2) der Jugendliche eine Anfrage in seinem Konto
  zulässt — nur mit PIN, damit niemand sonst für ihn zustimmt —, oder (3) die Aufsicht eine Sicherung einliest, die
  der Jugendliche ihr gegeben hat (AF2 a) — verbunden werden dabei nur Konten, die neu auf das Gerät kommen; ein
  Konto, das schon da ist, braucht die Zustimmung nach (2) (Befund D5). Lösen kann der Jugendliche oder die Aufsicht selbst (AF1 a).
  `aendern` übernimmt die Verbindung nie aus einer älteren Kopie des Kontos; Sicherungen enthalten sie nicht
  (`LST_KONTEN.GERAET`).
- **Der Jugendliche sieht**, wer mitliest (Startseite, Konto), und jede Anfrage mit Zulassen / Ablehnen.
- **Die Aufsicht sieht** je verbundenem Konto Runden, letzten Übungstag, Übungstage der letzten 14 Tage und sichere
  Stufen, dazu die Statistik `statistik.html?konto=<id>` (nur für verbundene Konten, ohne Einlesen); sie kann anfragen,
  Konten anlegen, die verbundenen Konten sichern und Sicherungen einlesen.
- **Einstellungen des Geräts** (`lernsteig:einstellungen`) setzt nur eine angemeldete Aufsicht: `rechner` (uebung |
  ohne | erlaubt, TR1 a) und `dezimal` (punkt | komma). Eine Sperre des Rechners steht für alle sichtbar auf der
  Startseite.
- **Grenze:** Alles liegt im Browser. Die PIN schützt vor Versehen und Neugier am selben Gerät, nicht vor jemandem, der
  die Entwicklerwerkzeuge öffnet; echter Schutz braucht den Server (DS1 a). Die Seite sagt das.
- Noch nicht: Freigabe der Inhaltslisten nach Prüfstand und Sperren durch die Aufsicht (AU1 a), PIN eines verbundenen
  Kontos zurücksetzen, Aufsicht auf einem anderen Gerät (braucht Abgleich oder Server).

## 6. Speicher (`lernsteig:*`, SP1 a)

| Schlüssel | Inhalt |
|---|---|
| `konten` | Liste der Konten (5b), PIN und Code nur als Hash; Verbindungen `aufsicht`, `anfragen` (5d) |
| `aufsichten` | Liste der Aufsichten (5d), PIN und Code nur als Hash |
| `aktiv` | zuletzt gewähltes Konto (Id) |
| `gast` | Gastkonto ohne Anmeldung: `{ id: "gast", name, niveau: { <fach>: n }, lehrplan: { land, kanton }, pruefungsziel }` |
| `personen` | Jugendliche und Aufsichten (`KERN.person`, 5d); früher `konten` und `aufsichten`, beim Laden umgezogen |
| `runden` | je Runde im gemeinsamen Format (R1 a, `KERN.runden`) `{ id, person, zeit, inhalt, fach, stufe, niveau, endlos, aufgaben, aufAnhieb, fehler, gezeigt, dauer, zeiten, falsch, liste, mitRechner, gruppe }` (bis LERN_Session15 `konto`, `uebung`; beim Laden umgedeutet); `liste` je Aufgabe `{ lp, versuche, gezeigt }` (Grundlage für den Kompetenzstand) |
| `rekorde` | je Serie `{ id, person, zeit, inhalt, stufe, niveau, punkte, dauer, mitRechner, abgebrochen? }` |
| `freigabe`, `freigabeStand` | Freigabe der Übungen auf diesem Gerät durch die Aufsicht (`KERN.freigabe`) |
| `gestellt` | zuletzt gestellte Kennungen je `konto/uebung/stufe/niveau` (höchstens 30) |
| `einstellungen` | `{ dezimal?, rechner? }`, nur von einer angemeldeten Aufsicht gesetzt (5d) |

## 7. Prüfen

`node docs/lernsteig/werkzeuge/pruefe_uebungen.js [übung …] [--aufgaben=3000] [--seed=1] [--browser]`:
- ohne Browser: Seite lädt die gemeinsamen Dateien und nichts aus `eulenpfad/`; Kompetenz-Codes des Katalogs stehen in
  `lehrplan/mathematik_zyklus3.md`; je Niveau und Stufe Zufallsaufgaben gegen `pruefeAufgabe`, kein NaN/undefined/null,
  Hinweise zu typischen falschen Eingaben nennen die Lösung nicht; Endlos-Stufen haben mindestens 100 verschiedene
  Aufgaben (Hinweis, wenn eine andere Stufe es auch hätte);
- mit `--browser` (Chromium, 375 px): Startseite und jede Stufe ohne Konsolenfehler, eine Runde mit einem
  Fehlversuch durchspielen, Protokoll plausibel, Serie speichert den Rekord vor „Zum Ergebnis“; Konten; Statistik
  zeigt die gespielte Runde, Sichern lädt die Datei herunter, Einlesen in einem frischen Browser stellt sie her
  (zweimal eingelesen zählt einmal), eine fremde Datei wird abgewiesen; Aufsicht: anlegen, Verbindung erst nach
  Zustimmung (nicht ohne PIN), Statistik nur verbunden, Sperre des Rechners wirkt und ist sichtbar, Lösen. Das
Skript liegt unter `docs/lernsteig/`, weil `lernsteig/` nur enthält, was online geht.

## 8. Noch nicht gebaut

Freigabe der Listen durch die Aufsicht (AU1 a) (BF1 a), Abgleich über einen Ordner, Timer als Zusatz, Gruppen am selben
Gerät (GR1 a), Übungen Natur und Technik (wartet auf R6).
