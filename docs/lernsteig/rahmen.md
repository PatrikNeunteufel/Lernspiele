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
gemeinsam/terme.js        Terme: reicht KERN.terme weiter (text in der Schreibweise des Lernsteigs)
gemeinsam/rechner.js      eingebauter Taschenrechner: Modelle und Tastenfeld; Rechenkern KERN.rechner
gemeinsam/rahmen.js       Seitenteil: Konto, Stufenwahl, Runde, Serie, Protokoll, Rekorde
gemeinsam/stil.css        Stil, Farben nur hier (:root)
index.html, start/        Startseite: Anmeldung, dann Tabs wie im Eulenpfad (Plan C2, Adresse #<tab>): Übungen (start.js:
                          Fächer, Niveau, Übungen), Profil (start.js: Konto, Einstellungen), Statistik und Erfolge
                          (start/statistik.js), Verwaltung nur für die Aufsicht (start/aufsicht.js); statistik.html und
                          aufsicht.html leiten auf #statistik und #verwaltung weiter
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
  `ausgeklammert`, `frei`) und `tasten` (Zeichen, die das Tastenfeld der Antwort dazu zeigt, etwa `["a", "²", "(", ")"]`;
  Ziffern und + − · hat es immer). Der Rahmen prüft mit `LST_TERME.bewerte`: gleichwertig und in
  der Form → richtig; gleichwertig, aber Form falsch → Hinweis ohne Fehlversuch; nicht gleichwertig → Fehlversuch.
  `KERN.terme` (docs/kern/rahmen.md 4.17, über `gemeinsam/terme.js`) liest Variablen a–z, Zahlen, Brüche „5/8“,
  `+ − · * : ( )`, implizites Mal und Potenzen („^2“, „²“, „x²³“ = x^23) exakt als Polynom; Exponent höchstens 100.
- **Auswahl-Antworten:** `art: "auswahl"` mit `optionen` (Texte) und `richtig` (Index); der Rahmen zeigt Knöpfe mit
  Kurztasten 1 … n, eine falsche Wahl wird gesperrt (Fehlversuch), `kennung` soll die Antworten enthalten.
- Optional `vor` („x =“) und `einheit` („m²“): Text vor und nach dem Eingabefeld.
- **Tastenfeld der Antwort** (TF1 a, `KERN.tastenfeld`, docs/kern/rahmen.md 4.24): unter jeder Zahl- und Term-Antwort;
  Zahl mit Ziffern, Komma (Zeichen der Einstellung), ⌫, ± und „Prüfen“, Term mit Ziffern, den Variablen des Terms der
  Aufgabe (`ausdruck`, sonst `text`) und „/“ und „²“, wenn er sie hat, dazu `tasten` und + − ·, ⌫ und „Prüfen“
  (`LST.antwortTasten`). Die Tastatur des Geräts bleibt zu (`inputmode` none), eine echte Tastatur schreibt weiter ins
  Feld. Deshalb muss jedes Zeichen der Lösung eine Taste haben; `tools/pruefe_uebungen.js` prüft das für jede erzeugte
  Aufgabe (Meldung Patrik LERN_Session20: in `terme` waren 1144 von 8000 Lösungen nicht tippbar, Potenz ohne Variable,
  Brüche ohne „/“).
- Optional `gleichung` (Text oder Liste bei einem System): steht im Notizblock oben, wenn die Übung die Vorlage
  „= Gleichung“ anbietet (5a0).
- Katalogfeld `sprache` („en“, „fr“): Aufgabentext und Antworten tragen dieses `lang`, damit Vorlesefunktionen und
  Silbentrennung die Fremdsprache erkennen; die Seite bleibt `de-CH`.
- Optional `darstellung`: `{ art: "tabelle", kopf, zeilen }` (Wertetabelle) oder `{ art: "graph", m, b, x: [min, max],
  y: [min, max] }` (Gerade im Gitter); der Rahmen zeichnet sie unter den Aufgabentext. Zusätze zum Graphen:
  `schrittY`, `beschrY`, `hoehe` (eigener Massstab der y-Achse), `xName`, `yName` (Achsennamen), `punkte: [{ x, y, name }]`
  und `vieleck: true` (Punkte verbunden); ohne `m` keine Gerade. Ohne `hoehe` gilt der gleiche Massstab auf beiden
  Achsen, aber die Fläche ist höchstens quadratisch und mindestens halb so hoch wie breit (`LST.graphHoehe`, LERN_Session19;
  vorher bis 2900 px hoch in `kraefte`); angezeigt höchstens 340 px breit und halb so hoch wie das Fenster, damit die
  ganze Aufgabe im Bild bleibt. Der Seitentest meldet eine Grafik, die höher als breit ist.
- Hinweise ohne Ziffern formulieren, wo eine Zahl zufällig die Lösung sein kann („ein Prozent“ statt „1 %“) — das
  Testskript meldet jeden Hinweis, der die Lösung enthält.
- `pruefeAufgabe(aufgabe, stufe, niveau)` → Liste von Mängeln. Unabhängig vom Generator nachrechnen (Rationale
  Zahlen: exakter Bruch-Parser über den angezeigten Term), Grenzen der Lehrplan-Stufe, Schreibweise.
- `liesText(aufgabe)` (TD1 a, seit LERN_Session20; Pflicht für die Übungen in `TEXT_GELESEN` von
  `tools/pruefe_uebungen.js`) → die Werte, die der angezeigte Text nennt, in der Form von `a.daten`, oder null. Je Typ der
  ganze Satz als Muster für `LST.zahlenImText(text, muster)` („#“ eine Zahl in der Schreibweise des Lernsteigs, „~“ eine
  Einheit), unabhängig vom Erzeuger geschrieben; abgeleitete Angaben zurückgerechnet (Durchmesser → Radius, Basis →
  halbe Basis). `pruefeAufgabe` vergleicht sie mit `a.daten` und rechnet die Lösung ein zweites Mal aus dem Gelesenen —
  so fällt auch ein Text auf, der andere oder vertauschte Werte zeigt, als die Prüfung nachrechnet.
- `hinweis(aufgabe, eingabe)` → Text bei einem Fehlversuch. Nennt die Lösung nie.

Der Katalog-Eintrag nennt `kompetenz` („MA.1.A.3“), `stufen` (Buchstaben), `weitere` (Nebenkompetenzen), `ohneE`,
`rechner` (je Stufe und Challenge `ohne`/`mit`/`frei`, TR1 a), `niveaus`, `anzahl`, `endlos` (`true` oder Liste) und
`neu` (Sitzung, bis geprüft). Codes nur aus `docs/lernsteig/lehrplan/`.

## 5. Ablauf einer Runde

- `anzahl` Aufgaben. Fehlversuch: Hinweis, neuer Versuch, nach dem dritten die Lösung mit Weg und „Weiter“. Kein
  Punktabzug, kein Zeitdruck; die Zeit je Aufgabe wird gemessen.
- Richtig (RA8 a, wie LB1 a im Eulenpfad): auf Anhieb nur „Richtig.“, weiter nach 1,2 s (Serie 0,7 s); nach einem
  Fehlversuch „Jetzt stimmt es.“ mit dem Weg und „Weiter“, ohne Selbstlauf.
- Wiederholungen (RA5 a, RA6 a; `KERN.runde`, docs/kern/rahmen.md 4.22): in einer Runde oder Serie keine Aufgabe zweimal,
  solange die Stufe neue hergibt; über Runden ein Durchgang je Konto, Übung und Stufe (`lernsteig:gestellt`, Schlüssel
  „Konto|Übung/Stufe“, ohne Niveau; der Gast nur in der Seite). Höchstens eine Wiederholung je Runde, nie direkt
  hintereinander; danach endet die Runde früher (`gekuerzt`), die Serie mit „Alle Aufgaben dieser Stufe geschafft“
  (Rekord `alles: true`). Bis LERN_Session18: nur in Serien keine der letzten 30, Schlüssel mit Niveau.
- Ergebnis: auf Anhieb richtig, Zeit, Bestzeit (nur volle Runden ohne gezeigte Lösung). Keine Sterne (BF1 a).
- **Serie** (Endlos): Aufgaben, bis eine falsch ist; Rekord je Konto, Übung und Stufe, getrennt mit und ohne Rechner (RE1 a; nicht je Niveau, weil die Aufgaben einer
  Stufe nicht am Niveau hängen, ST1 a — bis LERN_Session18 stand hier „und Niveau“). Gespeichert, sobald die
  Serie vorbei ist; beim Verlassen mitten drin als Zwischenstand (`abgebrochen: true`), Rekord und Runde (RA3 a); das Ende
  ersetzt beide (gleiche Kennung).
- Den Ablauf führt der Kern (`KERN.runde.lauf`, docs/kern/rahmen.md 4.22): Versuche, Fehler, Lösung nach dem dritten
  Fehlversuch, Ende der Serie, Zeit je Aufgabe, Eintrag und Rekord. Hier bleiben Oberfläche, Prüfen der Antwort und Rechner.

## 5a0. Notizblock für eigene Rechenwege (NB1 a–NB4 a, LERN_Session19)

- Lehrplan MA.1.A.3.g: „im Kopf oder mit Notieren eigener Rechenwege“. Knopf „📝 Notizblock“ in jeder Aufgabe mit
  Zahl-Antwort, mit und ohne Rechner (NB2 a); nicht bei Auswahl- und Term-Antworten. Eine Übung schaltet ihn mit
  `notizblock: false` im Katalog ab (heute keine; Kipppunkt: Übungen, die Kopfrechnen prüfen).
- Block aus dem Kern (`KERN.notizblock`, docs/kern/rahmen.md 4.23): Plus, Minus, Mal, Geteilt, Häuschen; Mal auch mit Komma
  in beiden Zahlen, darunter die Kommaregel (NB3 a). Dezimalzeichen wie die Einstellung des Geräts. Nichts wird bewertet;
  jede neue Aufgabe beginnt mit leerem Block. Im Eintrag je Aufgabe `vorgehen.notiz`: „block“, wenn hineingeschrieben
  wurde, sonst „ohne“.
- Aussehen sachlich (NB4 a, `stil.css`): Stellen mit ihren Buchstaben in neutraler Farbe, keine Stellenfarben; ab 1100 px
  rechts neben der Aufgabe (die Bühne rückt nach links), auf Tablet quer schmaler rechts, sonst unten wie ein Blatt.
- **Gleichung umformen** (GL1 a, LERN_Session20): Eine Übung nennt im Katalog die Vorlagen ihres Blocks in ihrer
  Reihenfolge (`notizblock: ["=", "+", "−", "×", ":", "frei"]`, heute `gleichungen` und `binome-gleichungen`); ohne Liste
  die Standard-Vorlagen. Bei „= Gleichung“ steht die `gleichung` der Aufgabe oben (bei einem System je Gleichung eine
  Zeile), darunter Zeilen mit der Umformung rechts vom Strich; Zeichen der Gleichung im Tastenfeld des Blocks. Nichts wird
  nachgerechnet. `pruefeAufgabe` beider Übungen prüft, dass `gleichung` zur Aufgabe passt.

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
- **Anmeldung zuerst** (Plan C1, wie Eulenpfad L1 a): Die Startseite zeigt ohne Anmeldung nur die Anmeldung —
  Jugendliche und Aufsichten (🔑) zum Antippen, „🐣 Ich bin neu“ (Jugendliche oder Erwachsene; eine weitere Aufsicht
  nur mit Bestätigung, D5; keine Frage für Erwachsene, EF1 a) und „👀 Als Gast weiter“. Im Konto sieht jeder
  Jugendliche alle Aufsichten des Geräts mit Datum und ob sie bei ihm mitlesen (EF1 a). **Ein Platz** (`KERN.anmeldung`, docs/kern/rahmen.md 4.11):
  angemeldet ist ein Jugendlicher, eine Aufsicht oder der Gast. Konto ohne PIN bleibt gewählt (`lernsteig:aktiv`);
  mit PIN und jede Aufsicht nur im geöffneten Tab (`sessionStorage lernsteig:angemeldet`). `LST.werUebt()` sagt
  „lernend“, „aufsicht“, „gast“ oder „niemand“; Übungs- und Statistikseiten zeigen bei „niemand“ nur den Weg zur
  Anmeldung.
- **Gast** (C2 a): nur im Tab (`lernsteig:gast`), nichts gespeichert — keine Runden, keine Rekorde; Land, Kanton,
  Niveaus, Prüfungsziel und Rechnermodell gelten nur im Tab (`sessionStorage lernsteig:tab-konto`). Die Aufsicht schaltet
  ihn je Gerät ab (Einstellung „Gast“). **Aufsicht übt** zum Ansehen und Prüfen: Einstellungen nur im Tab, Runden
  und Rekorde mit `test: true` (wie im Eulenpfad). `LST.konto()` liefert das Konto des Jugendlichen, sonst die
  Einstellungen des Tabs.
- Alter aus dem Geburtsdatum (`LST_KONTEN.alter`).
- **Einladung** (EL1 a, Format im Kern `KERN.einladung`, docs/kern/rahmen.md 4.13): Link `…/lernsteig/#einladung=…` oder Datei
  `lernsteig-einladung.json` („Einladung öffnen“ in „Neues Konto“), Inhalt `{ format, v: 1, ziel, von, name, geboren, klasse, niveau,
  lehrplan }`; die Startseite füllt das Formular vor und löscht das Fragment. Erzeugt mit `einladungErstellen(daten)`
  (der Eulenpfad erzeugt sie nach der 6. Klasse, Notiz EP1). Ein Geburtsmonat ohne Tag bleibt beim Anlegen erhalten.
- **Kompetenzstand** (`LST.kompetenzstand(konto, uebung, lp)`): je Lehrplan-Stufe aus der Protokoll-`liste`:
  *sicher* ab 10 Aufgaben mit mindestens 85 % auf Anhieb in den letzten 10 und keiner gezeigten Lösung (ohne Rechner;
  sonst *sicher mit Rechner*), *am Üben* ab einer Aufgabe, sonst *offen*. Schwellen in `STAND` (Annahme); gerechnet mit
  `KERN.auswertung.stand` (eine Regel für beide Apps, AW2 a), die Wochenserie mit `KERN.auswertung.wochen`. Angezeigt als
  Marke in der Stufenwahl (Tooltip mit Zahlen) und auf der Startseite („2 von 3 Stufen sicher“).
- **Serie über Tage** (BF1 a, selbst gesetzt, ohne Stern): Wochenziel `wochenziel` (1–7 Tage je Woche) im Konto,
  gesetzt auf der Statistik-Seite. Übungstag = Kalendertag (Ortszeit) mit mindestens einer Runde, Wochen ab Montag.
  `LST.wochenSerie(tage, ziel)` (werkzeug.js) zählt die Tage dieser Woche und die Wochen in Folge mit erreichtem Ziel;
  die laufende Woche unterbricht die Serie nicht. Angezeigt auf Startseite, Statistik und bei der Aufsicht (nur lesen).
- **Abgleich über einen Ordner** (Plan C5, seit LERN_Session19; `gemeinsam/abgleich.js` über `KERN.abgleich`,
  docs/kern/rahmen.md 4.20): Die Aufsicht wählt in der Verwaltung einen Ordner (Netzwerk- oder Cloud-Ordner); jedes Gerät
  schreibt dort `lernsteig-sync-<gerät>.json` und liest die der anderen — Konten, Aufsichten, Runden, Rekorde,
  Löschvermerke und die Freigabe (seit LERN_Session20; die jüngste gewinnt, 5d) —, selbsttätig beim Öffnen der Startseite, beim Wiedersichtbarwerden und nach Änderungen
  (`LST.beiAenderung`). Ohne Ordner-Fähigkeit des Browsers dieselbe Datei zum Sichern und Einlesen. PIN, Code und
  Verbindungen bleiben auf dem Gerät; neue Konten werden beim Abgleich mit niemandem verbunden (das tut nur das Einlesen
  durch die Aufsicht, AF2 a). Kam etwas dazu, zeichnet die Startseite neu (Ereignis `lernsteig:abgeglichen`), ausser
  jemand tippt gerade.

## 5c. Statistik, Sichern und Einlesen (BF1 a, DS1 a)

- **Tab Statistik** (`#statistik`, Code `start/statistik.js`; bis LERN_Session16 `statistik.html`, leitet weiter): für das
  aktive Konto; der Gast hat keinen Stand (nichts gespeichert). Wochenziel, Kompetenzstand je Übung und Rekorde stehen
  seit Plan C2 im **Tab Erfolge** (`#erfolge`, BF1 a: keine Sterne); Testrunden der Aufsicht zählen nicht.
  Überblick (Runden, Aufgaben, Anteil auf Anhieb, Übungstage der letzten 14 Tage), Kompetenzstand je gespielter Übung
  und Lehrplan-Stufe (5b), die letzten 10 Runden.
- **Sichern** nur auf Knopfdruck (`gemeinsam/daten.js`, `LST_DATEN`, seit LERN_Session18 über `KERN.daten`,
  docs/kern/rahmen.md 4.19; DF1 a): Datei `lernsteig-<vorname>-<datum>.json` im Format der Reihe
  `{ format: "reihe-daten", version: 1, app: "lernsteig", art: "sicherung", gesichert, personen, runden, rekorde }`, nur
  die Daten der gewählten Konten, ohne PIN und Verbindungen. Ein Konto mit PIN reist **geschützt** (DF4 a): mit dem
  Vermerk `geschuetzt` und nur dem Prüfwert seines Wiederherstellungscodes. Das Gastkonto selbst reist nicht mit, nur
  seine Runden und Rekorde.
- **Einlesen** (Befund D4): zuerst wird die ganze Datei geprüft — Konten mit `KERN.person.maengel`, Runden und Rekorde
  mit `KERN.runden.maengel` und dem Schema des Lernsteigs (`RUNDE`, `REKORD`, dazu jedes Element von `liste` ein
  Objekt); Ungültiges wird gezählt und nie gespeichert. Dann wird im Speicher zusammengeführt und nur Geändertes
  geschrieben, alles oder nichts (voller Speicher → alter Stand, Meldung). Konten nach P1 a (gleiche Kennung, sonst
  gleicher Name; je Feld der jüngere Stand; PIN, Code und Verbindungen bleiben die des Geräts); Runden und Rekorde
  nach Kennung (Rekord: höherer Stand), Verweise umgebogen. Ältere Sicherungen (`lernsteig-sicherung` 1, 2) deutet der
  Kern um; eine Datei des Eulenpfads wird mit „Das ist eine Datei des Eulenpfads; …“ abgewiesen. Löschvermerke führt der
  Kern (DF2 a); gelöscht wird ein Konto seit LERN_Session20 nach KE2 a (5d). Test: `tools/pruefe_konten.js`.
- **Aufsichten in Datei und Abgleich** (Entscheide OA1 a, OA2 a, LERN_Session19; ersetzen AS1 a): Aufsichten reisen
  immer mit und kommen gesperrt an, auch wenn ein Jugendlicher einliest oder beim Abgleich übt. Geschützt wird beim
  Freischalten: Für eine Aufsicht reicht ihr Code nur auf einem Gerät ohne Aufsicht mit PIN, sonst bestätigt eine
  Aufsicht des Geräts mit ihrer PIN (`KERN.person.codeReicht`, `LST_KONTEN.codeReicht`; die Anmeldung zeigt dann kein
  Codefeld). Sonst brächte eine selbst gebaute Datei mit einem bekannten Code eine Aufsicht ohne Bestätigung aufs Gerät
  (D5). Bis LERN_Session19 (AS1 a): Aufsichten nur, wenn eine Aufsicht einlas.
- **Gesperrt** (DF4 a): Ein Konto oder eine Aufsicht mit PIN von einem anderen Gerät ist hier 🔒 gesperrt, bis es mit
  dem Wiederherstellungscode und einer neuen PIN freigeschaltet ist (`LST_KONTEN.freischalten`, Ansicht „freischalten“
  auf der Anmeldung und im Personen-Knopf); eine Aufsicht auch mit der PIN einer anderen Aufsicht dieses Geräts. Der
  Code bleibt derselbe. Wer hier eine eigene PIN setzt (auch über „PIN vergessen“), ist nicht mehr gesperrt.

## 5d. Aufsicht (AU1 a, TR1 a)

- **Anlegen und PIN vergessen** (seit LERN_Session18, RL2 a, Kern `KERN.rollen`, docs/kern/rahmen.md 4.21): beim
  Anlegen eine Sicherheitsfrage mit Antwort (Pflicht); eine weitere Aufsicht nur mit der Bestätigung einer Aufsicht mit
  PIN. „PIN vergessen?“ einer Aufsicht: Code, Sicherheitsfrage oder die PIN einer anderen Aufsicht dieses Geräts, dazu
  die neue PIN und gleich ein neuer Code; ohne alles „⏳ Zurücksetzen“ mit Frist von 3 Tagen
  (`lernsteig:zuruecksetzen`). Die Anmeldung zeigt allen den Termin, PIN oder Code einer Aufsicht bricht ab (Ansicht
  „frist“). Nach Ablauf werden die Aufsichten auf diesem Gerät entfernt samt ihren Verbindungen und Anfragen; danach
  legt „Ich bin neu“ ohne Bestätigung eine an. Jugendliche setzen eine vergessene PIN weiter mit ihrem Code.

- **In den Eulenpfad übernehmen** (Plan C9, Ü1 a, Ü2 b; `KERN.person.uebernehmen`): Abschnitt auf der Aufsichtsseite;
  legt die angemeldete Aufsicht im Eulenpfad an (gleiche Kennung, PIN, Sicherheitsfrage und Art, neuer Code).
- **Tab Verwaltung** (`#verwaltung`, Code `start/aufsicht.js`; bis LERN_Session16 `aufsicht.html`, leitet weiter), nur für die
  angemeldete Aufsicht; seit LERN_Session20 mit Untertabs wie im Eulenpfad, in der Adresse `#verwaltung/<teil>`:
  Konten (ohne Angabe), Freigabe, Abgleich, Einstellungen, Entwicklung (`aufsicht.html?konto=<id>` führt seither zu
  `#statistik/<id>`);
  anlegen und anmelden auf der Startseite (Plan C1). Freiwillig, für Eltern und Lehrpersonen.
  Seit LERN_Session15 (P2 a) stehen Jugendliche und Aufsichten in **einer** Liste `lernsteig:personen`
  (`KERN.person`, docs/kern/rahmen.md 4.7): Aufsicht `{ id, name, rolle: "aufsicht", art: eltern | lehrperson, pin,
  wiederherstellung, angelegt, geaendert }`; die früheren Listen `lernsteig:konten` und `lernsteig:aufsichten` zieht
  `konten.js` beim ersten Laden um (Kennungen bleiben). PIN Pflicht (`KERN.geheimnis`), Wiederherstellungscode,
  angemeldet nur im Tab (sessionStorage `lernsteig:angemeldet`, derselbe Platz wie die Jugendlichen; bis LERN_Session16
  `lernsteig:aufsicht`). **Eine weitere Aufsicht** auf dem Gerät nur mit
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
  Stufen, dazu Statistik und Erfolge `#statistik/<id>`, `#erfolge/<id>` (nur für verbundene Konten, ohne Einlesen); sie kann anfragen,
  Konten anlegen, die verbundenen Konten sichern und Sicherungen einlesen.
- **Einstellungen des Geräts** (`lernsteig:einstellungen`) setzt nur eine angemeldete Aufsicht: `rechner` (uebung |
  ohne | erlaubt, TR1 a) und `dezimal` (punkt | komma). Eine Sperre des Rechners steht für alle sichtbar auf der
  Startseite.
- **Freigabe je Gerät** (Plan C5, seit LERN_Session20; Kern `KERN.freigabe`, docs/kern/rahmen.md 4.8; `LST.FREIGABE`),
  Untertab Freigabe, wie im Eulenpfad (docs/eulenpfad/rahmen.md 6): je Fach eine zuklappbare Gruppe (offen gemerkt in
  `lernsteig:verwaltungOffen`, nur dieses Gerät), darin je Übung Prüfstand („✓ <Datum> · <Name>“, „nicht angesehen“
  oder „nichts zu prüfen“ ohne `neu`) und ein Schalter „✓ frei“ / „🔒 gesperrt“, mit eigenem Eintrag dazu „↺ wie
  Prüfstand“; darunter die Inhaltslisten (ein Verweis `von` zeigt den Stand der Quelle). Dazu „Alles freigeben“, „Alles
  sperren“, „Alles wie Prüfstand“ und die Zahl der Übungen, die Jugendliche sehen. Mit dem Entwickler-Modus je Übung
  „✓ angesehen“ (schreibt den Prüfstand über den Server). Die Freigabe reist im Abgleich mit (`freigabe: true` in
  `KERN.daten`, `geteilt` in `abgleich.js`): die des Geräts mit dem jüngsten `freigabeStand` gewinnt, als Ganzes. Auf
  dem Handy (unter 600 px) steht je Zeile die Übung oben, Prüfstand und Schalter darunter.
- **Grenze:** Alles liegt im Browser. Die PIN schützt vor Versehen und Neugier am selben Gerät, nicht vor jemandem, der
  die Entwicklerwerkzeuge öffnet; echter Schutz braucht den Server (DS1 a). Die Seite sagt das.
- **Löschen und Ausblenden** (Entscheide KE1 a, KE2 a, LERN_Session20; `LST_KONTEN.loeschen`, `ausblenden`, `zeigen`,
  `darfLoeschen`, `darfAusblenden`):
  - **Löschen** mit Löschvermerk (`LST_DATEN.loeschePerson` über `KERN.daten`): Konto, Runden und Rekorde, auf allen
    Geräten des Abgleichs. Der Jugendliche selbst im Profil („Konto löschen“, mit seinem Vornamen und der PIN, wenn er eine
    hat; danach abgemeldet, die Anmeldung meldet es) oder eine Aufsicht, mit der das Konto verbunden ist (Untertab
    Konten, „Konto löschen“ mit Rückfrage). Beide mit „Zuerst sichern“.
  - **Ausblenden** (`KERN.person.ausgeblendet`, `lernsteig:ausgeblendet`, nur dieses Gerät): Die Aufsicht blendet ein
    Konto aus, das nicht mit ihr verbunden ist (KE2 a: ohne Verbindung kein Recht an seinen Daten), und eine gesperrte
    Aufsicht (KE1 a: auf ihrem eigenen Gerät echt). Ausgeblendete stehen nicht auf der Anmeldung, nicht im
    Personen-Knopf und nicht unter „Mitlesen anfragen“, bleiben aber in den Daten und reisen im Abgleich weiter; unter
    „Ausgeblendet auf diesem Gerät“ mit „Wieder zeigen“. Im Untertab Konten stehen dafür auch die anderen Aufsichten.
- Noch nicht: PIN eines verbundenen Kontos zurücksetzen.

## 5e. Entwickler-Modus (E1 a, Plan C6)

- Wie im Eulenpfad (docs/eulenpfad/rahmen.md 11) über den Kern (`KERN.entwicklung`, docs/kern/rahmen.md 4.12),
  `LST.ENTWICKLUNG`. Die angemeldete Aufsicht schaltet ihn auf der Aufsichtsseite unter „Entwicklung“ mit dem
  Entwickler-Schlüssel frei (`lernsteig:entwickler`, nur dieses Gerät) und schaltet die Leiste ein.
- **Leiste** unten in jeder Übung (`entwickler-leiste`): Stand (angesehen am …, Sperrgrund), „✓ Übung angesehen“ bzw.
  „Markierung aufheben“, „📝 Bemerkung“ (mit Übung und Stufe).
- **Geschrieben** nur über den Entwickler-Server (`python tools/entwickler_server.py`, dann
  `http://localhost:8765/lernsteig/`): Prüfstand nach `gemeinsam/pruefstand.js` (`uebungen`, `listen`; Datei vom Server
  im JSON-Format geschrieben, nicht von Hand ändern), Bemerkungen nach `docs/lernsteig/bemerkungen.json`.
- Noch nicht: Prüfansicht der Inhaltslisten je Eintrag (C6). Die Freigabe je Gerät steht seit LERN_Session20 in der
  Verwaltung (5d).

## 6. Speicher (`lernsteig:*`, SP1 a)

| Schlüssel | Inhalt |
|---|---|
| `konten` | Liste der Konten (5b), PIN und Code nur als Hash; Verbindungen `aufsicht`, `anfragen` (5d) |
| `aufsichten` | Liste der Aufsichten (5d), PIN und Code nur als Hash |
| `aktiv` | zuletzt gewähltes Konto (Id) |
| `gast` | bis LERN_Session16 das Gastkonto des Geräts; wird nicht mehr gelesen. Runden mit `person: "gast"` bleiben und reisen in Sicherungen mit |
| `personen` | Jugendliche und Aufsichten (`KERN.person`, 5d); früher `konten` und `aufsichten`, beim Laden umgezogen |
| `runden` | je Runde im gemeinsamen Format (R1 a, `KERN.runden`; gebaut von `KERN.runde.lauf`) `{ id, person, zeit (Ende, RA1 a), inhalt, fach, stufe, niveau, endlos?, gekuerzt?, abgebrochen?, aufgaben, aufAnhieb, fehler, gezeigt, dauer (s, auf 0,1), liste, mitRechner, gruppe }`; `liste` je Aufgabe `{ ms, versuche, geloest, gezeigt?, lp, rechner }`, mit Fehlversuch dazu `text`, `loesung`, `eingaben` (RA4 a; Grundlage für den Kompetenzstand). Beim Laden und Einlesen umgedeutet (`LST.alteEintraegeUmdeuten`): bis LERN_Session15 `konto`, `uebung`; bis LERN_Session18 `zeit` = Beginn (jetzt + `dauer`, auch beim Rekord einer Serie) und `zeiten`, `falsch` getrennt |
| `rekorde` | je Serie `{ id, person, zeit, inhalt, stufe, niveau, punkte, dauer, mitRechner, abgebrochen? }` |
| `freigabe`, `freigabeStand` | Freigabe der Übungen auf diesem Gerät durch die Aufsicht (`KERN.freigabe`, 5d); reist im Abgleich mit |
| `verwaltungOffen` | Fächer, deren Gruppe in der Freigabe offen ist (nur dieses Gerät) |
| `ausgeblendet` | Kennungen der Personen, die dieses Gerät nicht zeigt (KE1 a, KE2 a, 5d; nicht abgeglichen) |
| `gestellt` | Gedächtnis gegen Wiederholungen (RA5 a): Fingerabdrücke je `konto\|uebung/stufe` (höchstens 400; bis LERN_Session18 die Kennungen je `konto/uebung/stufe/niveau`, höchstens 30) |
| `geraet`, `abgleichStand` | Abgleich über einen Ordner (5b, `KERN.abgleich`): Kennung und Name dieses Geräts; Ordner, letzter Abgleich, andere Geräte. Den gewählten Ordner merkt der Browser in IndexedDB `lernsteig` |
| `einstellungen` | `{ dezimal?, rechner? }`, nur von einer angemeldeten Aufsicht gesetzt (5d) |

## 7. Prüfen

`node tools/pruefe_uebungen.js [übung …] [--aufgaben=3000] [--seed=1] [--seiten=0]` (oder `node tools/pruefe.js lernsteig`):
- Daten: Seite lädt die gemeinsamen Dateien und nichts aus `eulenpfad/`; Kompetenz-Codes des Katalogs stehen in
  `lehrplan/mathematik_zyklus3.md`; je Niveau und Stufe Zufallsaufgaben gegen `pruefeAufgabe`, kein NaN/undefined/null,
  Hinweise zu typischen falschen Eingaben nennen die Lösung nicht; Text gegen Prüfdaten (TD1 a, seit LERN_Session20):
  `liesText` Pflicht für die zehn Übungen in `TEXT_GELESEN`, `pruefeAufgabe` meldet einen Text, der keinem Muster folgt
  oder andere Werte zeigt, als nachgerechnet wird; Annahme von Antworten (Plan B2 Schritt 3, seit
  LERN_Session20) je Stufe an 300 Aufgaben über `LST.antwortPruefen`, dieselbe Prüfung wie die Seite: angenommen werden
  die Lösung und gleichwertige Schreibweisen (Zahl: Komma, wie angezeigt, „+“, „−“, Null am Ende, Leerzeichen; Term:
  ohne Leerzeichen, `*` und `-`, Summanden vertauscht), abgewiesen knapp falsche (letzte Stelle ±1, letzte Ziffer
  weggelassen, ein Millionstel daneben, „+ 1“ am Term, letzte Ziffer verändert), 30 kaputte Eingaben werfen nie und
  gelten nie als richtig, falsch gegliederte Zahlen sind unlesbar mit dem Hinweis auf die Dreiergruppen (ZL1 a);
  Endlos-Stufen haben mindestens 100 verschiedene
  Aufgaben (Hinweis, wenn eine andere Stufe es auch hätte);
- Seiten im Ersatz-DOM (`tools/lernsteig_seiten.js` über `tools/pruef_dom.js`, Plan B2; ersetzt seit LERN_Session17
  den Browser-Teil mit Playwright, der lokal nicht lief): Startseite als niemand, Gast, Jugendlicher und Aufsicht mit
  jedem Tab; Konto mit PIN anlegen (Code, PIN nur als Prüfwert), falsche PIN in einem neuen Tab, PIN vergessen mit
  dem Code; Aufsicht anlegen (Rolle, Prüfwert), ohne Verbindung keine Statistik des Kontos, Rechner-Sperre des
  Geräts wirkt in der Übung; Untertabs der Verwaltung über die Adresse; Freigabe mit dem echten Prüfstand (eine
  gesperrte Übung freigeben, der Jugendliche sieht sie, „wie Prüfstand“ hebt es auf; eine Liste umschalten; alles
  sperren, freigeben, wie Prüfstand); Ausblenden eines nicht verbundenen Kontos (weg von Anmeldung und Personen-Knopf,
  wieder zeigen), Löschen eines verbundenen Kontos nach Rückfrage, der Jugendliche löscht sein Konto im Profil (falsche
  PIN abgewiesen); Einladung über den Link füllt das Formular vor, das Fragment verschwindet; jede Übung in
  jeder Stufe und jedem Niveau eine Runde mit einem Fehlversuch (Protokoll, danach Statistik und Erfolge), Rechner je
  Lehrplan-Stufe (12 · 3 übernehmen, Nutzung im Protokoll), Serie speichert den Rekord vor „Zum Ergebnis“. Gemeldet
  werden Ausnahmen, Konsolenfehler und sichtbarer Text mit NaN, undefined, null (Knoten mit Abstand gelesen). Die
  Prüfung schaltet alle Übungen und Listen frei; die Sperre selbst prüfen `tools/pruefe_konten.js` und die Startseite.
  Über die Bedienung nicht geprüft (über die Schnittstelle in `pruefe_konten.js` schon): Verbinden mit Zustimmung,
  Lösen der Verbindung, Sichern und Einlesen als Datei.

## 8. Noch nicht gebaut

Timer als Zusatz, Gruppen am selben
Gerät (GR1 a), Übungen Natur und Technik (wartet auf R6).
