# Auftrag für Agenten: Prüfansicht `pruefung.js` je Spiel (LP5 a, LERN-51)

Gemeinsamer Auftrag an die Agenten, die die Prüfansichten in Blöcken nach T4 a bauen (seit LERN_Session37). Der Auftrag
an einen Agenten nennt dazu nur seine Spiele und, worauf er fachlich besonders achten soll. Ergebnisse liest die
leitende Sitzung selbst, prüft sie und gibt Patrik eine Commit-Message je Block.

Projekt Eulenpfad (HTML/JS ohne Build). Antworte und schreibe Kommentare auf Deutsch, Schweizer Schreibweise (ss statt ß).

## Ort und Regeln
- Repo: `C:/Users/patri/source/repos/Visuals_Project/cmake/Lernspiele`. Schreibe nur absolute Pfade, nie `cd`.
- Du legst `eulenpfad/spiele/<spiel>/pruefung.js` für deine Spiele an. Ausser im Fall „Schritt ins Spiel ziehen“
  änderst du keine andere Datei (nicht die Inhaltsdateien, nicht Katalog, nicht Prüfstand). **Kein Git** (kein add,
  commit, stash, checkout …). Andere Agenten arbeiten gleichzeitig im selben Ordner an anderen Spielen.
- Inhalte **nicht ändern**, auch wenn dir etwas falsch vorkommt — notiere es im Bericht.
- **Den eingebauten Browser (Werkzeuge `mcp__Claude_Browser__*`) nicht benutzen** — er gehört dem Nutzer, der darin
  angemeldet ist; ein geschlossener oder neuer Tab meldet ihn ab und hält den Testserver an (LERN_Session37). Zum Ansehen
  einer Prüfansicht: `node tools/bilder_aufnehmen.js <spiel> --modus=hell,dunkel --breite=1024 --hoehe=900
  --port=<eigener Port 9340–9399> --vorher="const s=location.pathname.split('/').at(-2); await LS.listenPruefen(s,
  LS.spielListen(s).filter(x=>!x.von)[0].id); await new Promise(r=>setTimeout(r,900));" --ziel=<dein Scratchpad-Ordner>`
  (eigener Chrome ohne Fenster; der Server auf Port 8765 muss laufen), Bilder danach mit dem Read-Werkzeug ansehen.

## Vertrag und Vorbilder (zuerst lesen)
- `docs/eulenpfad/rahmen.md`, Abschnitt „17. Prüfung der Inhaltslisten je Eintrag“.
- `eulenpfad/spiele/gemeinsam/listenpruefung.js`, Darstellung in `eulenpfad/kern/kern.js` (Suche nach `listenpruefung`).
- Vorbilder: `anlaut-angel/pruefung.js` und `auge-entdecker/pruefung.js` (Pilotspiele: ein Inhalt je Abschnitt,
  Spalten mit fester Bedeutung, Gruppen, Beschreibung mit Stufen), `znueni-teller/pruefung.js` (mehrere Abschnitte,
  Gruppen mit Namen wie im Spiel), `gegenteil-wippe/pruefung.js` (Bilder vom Spiel gezeichnet über `bild(e)`),
  `hoer-reporter/pruefung.js` (Texte getrennt von ihren Fragen, je Text eine Gruppe), `satz-reparatur/pruefung.js`
  (geliehene Listen in der Beschreibung der Quelle), `le-ou-la/pruefung.js`, `wort-zwillinge/pruefung.js`,
  `lebensraum/pruefung.js`, `schweiz-karte/pruefung.js` (Stufen je Eintrag aus `STUFE_ARTEN` des Spiels, Karten).
- Listen des Spiels im Katalog `eulenpfad/spiele/gemeinsam/katalog.js` (Feld `listen` beim Spiel); Inhalte in der
  Inhaltsdatei im Spielordner; Verwendung (welche Stufe was nutzt, wie Aufgaben gebaut werden) in `index.html`.

## Was die Prüfansicht leisten soll
- `LS.listenPruefung("<spiel>", { <liste>: { beschreibung, abschnitte } })`, für **jede** eigene Liste aus dem Katalog
  (geliehene Listen mit `von:` werden in ihrer Quelle geprüft; deren Beschreibung nennt, wie die leihenden Spiele sie
  nutzen).
- `beschreibung`: was das Kind damit tut, in welchen Stufen (aus der Stufentabelle des Spiels gerechnet).
- Ein Abschnitt je Inhalt; gemischter Inhalt bekommt mehrere Abschnitte, jeder für sich abzuhaken. `hinweis` sagt der
  prüfenden Person konkret, worauf sie achten soll: stimmen die Sachangaben, ist die Zuordnung eindeutig, ist kein
  Ablenker ebenso richtig, zeigt das Bild eindeutig das Gemeinte, passt es zum Alter.
- `eintraege()` gibt die **Rohdaten wie im Spiel** zurück (dieselben Arrays/Objekte, nicht umgebaut, nicht nur die
  freigegebenen — daran hängt der Fingerabdruck). `zeile(e)` macht die Zellen; `gruppe(e)` wo es Untergruppen gibt
  (Namen wie im Spiel); `bild(e)`, wo das Spiel ein Bild selbst zeichnet (mit seiner Zeichenfunktion).
- Eigene Hilfsnamen in pruefung.js in einen Block `{ … }`.
- Kopfkommentar wie bei den Vorbildern: was die Ansicht zeigt und warum so (LP5 a, <Sitzung>; Rahmen:
  spiele/gemeinsam/listenpruefung.js, rahmen.md 17).

## Keine Nachbauten — Schritt ins Spiel ziehen
Wo das Spiel aus den Rohdaten etwas rechnet oder baut (Zuordnung, Stufenbedingung, Satz, Ablenker-Regel, Lösung),
zeigt die Prüfansicht das Ergebnis mit **derselben Funktion oder Konstante des Spiels**. Steckt der Schritt nur im
Aufgabenbau mit Zufall (`aufgabeErzeugen`, `ARTEN.*`, Funktionen in `STUFE`) oder in `vorrat` zusammen mit der
Freigabe, dann ziehe ihn in `index.html` des Spiels in eine kleine benannte Funktion oder Konstante (Kommentar:
„… — auch für die Prüfansicht (pruefung.js)“), lass den Aufgabenbau sie benutzen, und benutze sie in pruefung.js.
Bedingungen: Die Aufgaben bleiben gleich, die Reihenfolge der Zufallsaufrufe (`waehle`, `mische`, `LS.zufall`,
`Math.random`) bleibt gleich, die Prüffunktion `pruefeAufgabe` bleibt unabhängig (nicht auf die neue Funktion
umstellen, sie ist das Orakel). Stufenangaben nie als Text abschreiben, wenn sie aus einer Tabelle des Spiels lesbar
sind. Vorbilder: `satzAufgabe` in `wortarten-probe/index.html`, `inStufe` in `sentence-builder/index.html`,
`STUFE_ARTEN` und `NIMMT` in `le-ou-la/index.html`, `STUFE_ARTEN` in `wort-zwillinge/index.html`.
**Nachweis, wenn du index.html änderst:** vor der Änderung je Stufe einige hundert Aufgaben mit festem Startwert
erzeugen und speichern (kleines Skript in deinem Scratchpad: die Seite wie `tools/listen_fingerabdruck.js` im
vm-Kontext laden, mit `__seite.seed` und `aufgabeErzeugen(stufe)` als JSON ausgeben), danach dasselbe — die Ausgaben
müssen gleich sein. Zeilenenden der Datei erhalten (LF bleibt LF).

## Pflichtprüfungen (alle „Keine Fehler.“)
1. `node tools/pruefe_skripte.js`
2. `node tools/pruefe_pruefansicht.js <spiel …>` (Ladeprüfung jeder Zeile, Zellen = Spalten, Fingerabdruck je Liste).
3. `node tools/pruefe_spiele.js <spiel …>` (rund eine Minute je Spiel), als letzter Schritt nach der letzten Änderung.

## Bericht (Schlussantwort, knapp)
Je Spiel: Listen → Abschnitte (Titel, Spalten, Einträge, Gruppen); welche Spielfunktionen genutzt; was du in index.html
neu herausgezogen hast (Name, warum) mit dem Nachweis gleicher Aufgaben; die Testzeilen wörtlich; **inhaltliche
Auffälligkeiten** (falsche Sachangabe, mehrdeutige Zuordnung, Ablenker auch richtig, mehrdeutiges Bild, für das Alter
ungeeignet), je mit Eintrag — nur melden, nicht ändern.
