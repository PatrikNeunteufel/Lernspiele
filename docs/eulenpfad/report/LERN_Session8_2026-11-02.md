# LERN_Session8_2026-11-02

## Schwerpunkt
Auftrag Patrik: LERN-36 und folgende Spiele der 5./6. Klasse in Runden zu 10 bis 20 Spielen bauen; das
Ansehen und Freigeben (LERN-21) übernimmt Patrik. Gebaut wurden vier Runden mit zusammen **49 Spielen**
(132 → 140 im Katalog, vorher 91): Runde 1 (15, Dezimalzahlen, Geometrie, Informatik, Deutsch), Runde 2
(15, Deutsch, NMG, Musik, Englisch), Runde 3 (11, Französisch nach „dis donc!“ u. a.) und auf Wunsch Patrik
ein **Kindergarten-Paket** (8). Dazu: Klasse „Kindergarten“, Vorlesen für Kinder, die noch nicht lesen,
eine lesearme Überarbeitung der 1./2. Klasse, „▶ Los! 3-2-1“ für Spiele mit kurzem Zeigen, Startdateien
für die Server. Gebaut von je 3–5 parallelen Agenten mit gemeinsamer Bauanleitung; Katalog, Doku und Rahmen
von Hand. Entscheide: Frage 5 a (Runde 2), 6 a (Französisch), 8 a (Kindergarten-Paket).

## Neu
- **Runde 1** (Lernziele in `docs/eulenpfad/lernziele/lehrplan_sg_session8.md`): Zehntel-Lupe,
  Dezimal-Rakete, Dezimal-Rutsche, Schoggi-Brüche, Probe-Stempel, Zufalls-Skala, Rechteck-Labor,
  Würfel-Kipper, Begriffs-Geodreieck, Flächenmass-Treppe, Speicher-Leiter, Geheimschrift-Knacker,
  Hebel-Wippe, Komma-Jagd, Morphem-Schere. Thema „Dezimalzahlen“.
- **Runde 2:** Rede-Zeichen, Trenn-Schere, Verben-Fächer, Wort-Spürnase, Sound-Sorter, Taschengeld-Planer,
  Wassertropfen-Reise, Erdzeit-Leiter, Pflanzen-Bestimmer, Blutkreislauf-Lotse, Energie-Wandler,
  Bionik-Paare, Kakao-Weg, Rhythmus-Diktat, Tonleiter-Treppe. Thema „Wirtschaft“.
- **Runde 3:** Mots-Match, Wörter-Brücke, Le ou la?, Son-Lauscher, Nombres-Rallye, Quelle heure?,
  Calendrier, Au café, Weather-Report, Datei-Typen, Braille-Finger. Fach Französisch (Themen „Wörter und
  Laute“, „Alltag“).
- **Runde 4, Kindergarten** (Basisklasse 1, Stufe 1 = Kindergarten; Lehrplan: alle 250 Kompetenzseiten
  neu gelesen, Kindergarten = erste Stufen des 1. Zyklus): Teddy-Versteck, Sortier-Kiste, Gegenteil-Wippe,
  Tageslauf-Sonne, Merk-Blick, Finger-Zähler, Gerecht-Teiler, Klang-Wichtel.
- **Rahmen** (`rahmen.md` Abschnitt 12 und Bausteine):
  - Dezimal-Eingabe: `LS.tastatur({ dezimal, nachkomma })`, `onOk(wert, text)`, `tippSchritte(wert, stellen)`.
  - Klasse 0 = Kindergarten (`LS.KLASSEN`, `LS.klasseVon`), im Profil und beim Anlegen; „Meine Klasse“ und
    Stufenvorschlag rechnen damit.
  - Vorlesen: 🗣️ neben der Eule liest Blase und `.frage`/`.auftrag`; automatisch (Kindergarten, 1. Klasse
    oder Einstellung) nur im Spiel; Schalter „🗣️ Vorlesen: gleich / auf Knopfdruck“ auf der Stufenwahl;
    Stimmlage Aufgabe/Lob/Tipp verschieden; 🔇 schaltet auch die Stimme; nicht in Englisch, Französisch und
    im Lese-Detektiv.
  - Langes Drücken liest Knöpfe vor (nicht in Deutsch), auf Startblatt und Startseite auch Stufen und
    Spielkarten (`data-vorlesen`).
  - `LS.losGehts(ctx, element, weiter)`: verdeckt, „▶ Los!“, 3-2-1, dann zeigen; in Merk-Blick,
    Punkte-Blitz, Blitzlesen, Finger-Zähler. `ctx.mitTimer`.
  - Französische Stimme (fr-CH, dann fr-FR); leere Eulenblase ausgeblendet.
- **Lesearm** 1./2. Klasse: 29 Spiele mit Basisklasse 1 und Stufe 1–2 der Basisklasse 2 überarbeitet
  (Vorlesbares in `.frage`, Zeichen auf Antwortknöpfen, Lesestoff aus Fragen der Lesespiele entfernt).
- **Server:** `server_starten.bat` (startet `tools/server.py`, ohne Zwischenspeicher) und
  `entwickler_server_starten.bat` (`--oeffnen`); `.claude/launch.json` auf `tools/server.py` umgestellt.
- Prüfliste Teile 41–65 (29 neue Listen), `listen.json`, Checkliste.

## Geändert
- Profilseite: auf dem Handy nicht mehr zu breit (Auswahlfelder begrenzt; war schon vorher).
- Finger-Zähler: gestrichelte Umrisse zeigen, wohin tippen; die Handfläche klappt nichts mehr um
  (Meldung Patrik).
- Testskript: Ersatz-DOM kapselt seine Hilfsnamen; fr-FR-Test-Stimme; 🗣️ zählt nicht als Aufgabenknopf;
  Mix-Hänger zählt Wartezeiten am Stück; feste Beispielsuchen um neue Treffer erweitert.
- Lernziel-Texte im Katalog ergänzt (Kindergarten-Stoff, Flächenmasse, Wahrscheinlichkeit, Lage, …);
  `lehrplan_sg_5-6.md` Stand je Runde.

## Stolperfallen
- **Antippbare Elemente nie eingehängt** (Komma-Jagd, Morphem-Schere, Runde 1): Spiele waren unlösbar, das
  Testskript merkte es nicht, weil der Rahmen nach drei Fehlversuchen auflöst. Ab Runde 2 musste jeder
  Agent jede Stufe selbst lösen. **Prüfer-Kandidat:** „keine Aufgabe einer Stufe durch Tippen gelöst“ — als
  einfache Regel unbrauchbar (Zifferntastatur löst zufällig fast nie); bräuchte einen Löser je Spiel.
- **Browser-Zwischenspeicher:** Patrik sah nach Änderungen die alte Fassung (keine gestrichelten Finger), ich
  selbst ebenso bei Prüfungen. Behoben mit `tools/server.py` (`no-store`).
- **Vorlesen im Test nie aktiv:** Einrichten über ein Promise lief im Ersatz-DOM erst nach dem Lauf. Jetzt
  sofort, wenn die Stimme da ist — dabei fielen zwei Testfehler auf (🗣️ und Hörer an der Fläche galten als
  Aufgabenknöpfe).
- **Lob doppelt vorgelesen:** Die Blase hielt das Lob der vorigen Aufgabe (Meldung Patrik); jetzt nur, wenn
  die Eule in der Aufgabe etwas sagte.
- **Agenten:** einer schrieb Zeilenenden um und wieder zurück (Diff geprüft, sauber); einer stufte „le car“
  als falschen Freund ein (in der Schweiz „Car“ = Reisebus, korrigiert); „stormy“ hiess „Gewitter“.
- **Python-Heredocs mit Backslash** wies der Hook mehrmals ab; jeweils als Skriptdatei oder mit dem
  Edit-Werkzeug gelöst. Kein neuer Hook.
- **Hook-/Prüfer-Kandidaten:** Löser je Spiel (oben); Prüfung, dass `.frage`/`.auftrag` in Lesespielen keinen
  Lesestoff enthalten (heute von Hand, Agent Runde „lesearm“).

## Verifikation
- `node tools/pruefe_spiele.js` über alle 140 Spiele × 6 Stufen mit Endlos, Inhaltslisten als Kind, Mix,
  Suche, Namen: **„Keine Fehler.“**, 15 bekannte Hinweise (11 zu wenig verschiedene Aufgaben, 1 Serie,
  3 Grundwörter). Letzter Lauf nach allen Änderungen ausser dem Weglassen des automatischen Vorlesens auf
  dem Startblatt (danach zwei Spiele einzeln geprüft).
- Jede Stufe jedes neuen Spiels von den Agenten selbst gelöst (Runde 2–4).
- Browser 375 px: alle 230 neuen Kombinationen Spiel × Stufe ohne waagrechtes Scrollen und ohne leere Blase;
  Bildschirmfotos ausgewählter Spiele; Vorlesen, langes Drücken, Stimmlagen, Stummschalten, Startseite und
  „▶ Los! 3-2-1“ mit einer Attrappe der Sprachausgabe geprüft.
- **Nicht geprüft:** echte Sprachausgabe gehört (der Browser hier hatte zeitweise keine deutsche Stimme),
  Safari/iPad, Tablet nur stichprobenweise, Spiele mit Kindern, Sachangaben (Listen „bitte nachprüfen“).

## Offene Punkte / Plan für die nächste Session
0. **„▶ Los! 3-2-1“ nicht bei jeder Aufgabe** (Hinweis Patrik am Sitzungsende): Countdown und Merk-Erklärung
   nur bei der ersten Aufgabe einer Runde; danach direkt zeigen; nach einem oder mehreren Fehlern wieder
   Hinweis und Countdown. Betrifft `LS.losGehts` (Rahmen) und damit Merk-Blick, Punkte-Blitz, Blitzlesen,
   Finger-Zähler; Rahmen braucht dafür, ob die vorige Aufgabe Fehler hatte. Idee Patrik: zwischen den
   Aufgaben kurz ein „Aufpassen“-Zeichen (👀) zeigen, bevor das Bild erscheint.
1. Entscheide aus dieser Sitzung (Fragen im Chat): **1–3** Umbenennen Detektiv / Sortierer / Puzzle
   (LERN-35), **4** Farben rechts vom Komma; Malzeichen „·“ oder „×“ einheitlich; Braille-Finger für Kinder
   ohne freie Wortliste sichtbar machen (Katalog-Kennzeichen „Liste nur für einzelne Stufen“).
2. Patrik: neue Spiele ansehen und freigeben (2 von 84 neuen angesehen), Listen prüfen (3 von 199);
   „bitte nachprüfen“ in `lehrplan_sg_session8.md` (Jahreszahlen Erdgeschichte, Pflanzen, Puls, Bionik,
   Trennungen, Preise, französischer Wortschatz nach „dis donc!“).
3. Vorlesen auf dem Tablet anhören (Stimmlagen, automatisches Vorlesen, langes Drücken).
4. Rahmen-Wünsche der Agenten: Buchstabentastatur als Baustein, Bruch-Eingabe, Option `label` in
   `LS.auswahl`, Lautstärke in `NOTEN.spiele`, Laute bei Anlaut-Aufgaben vorspielen.
5. Weiter offen: LERN-31, LERN-4, LERN-33, LERN-34 (F1–F8), Fortsetzungen nach `lehrplan_sg_5-6.md`
   Abschnitt 8 (braucht eine Sperre für geänderte Stufen).
