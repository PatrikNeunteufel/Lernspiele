# LERN_Session11_2026-11-03

## Schwerpunkt
Auftrag Patrik zum Start: beide Anleitungen nachführen, Portal mit den Anleitungen bei Eulenpfad (P1 a), später eine
Sektion „Eulerpfad“ für ein Publikum ausserhalb der Schulstufen (R1 a), Lehrperson, Klassen und Gruppen mit
verschlüsseltem Abgleich zuerst als Konzept (K1 a). Dazwischen viele Wünsche und Meldungen Patrik: Vorlesen und Töne
nacheinander, Abzeichen mit Stufen, Serienwarnung, Konzept Gruppen mit Entscheiden G1–G11, Anleitungen Klassenserver
und freiwillige Beiträge, Strategie-Rätsel, Sortierung, Spieltabelle im Portal, Anregungen, Bemerkungen 3–7, Stimmen
sichtbar, **Prüfung je Eintrag** (LP1, LP2, LP4, LP5) und die **Wiederholungsregel**. Eine Pause mit Haltepunkt
(`/session-pause`), danach in derselben Sitzung weiter. 165 → 168 Spiele.

## Neu
- **Konzept Gruppen** (`docs/konzept_gruppen.md`; Familie, Klasse, Lerngruppe; Rolle Lehrperson, Klassenstatistik,
  Abgleich je Gruppe verschlüsselt mit Geräte-Kennung): Entscheide G1–G10 nach Empfehlung mit Zusätzen, G3b a, G11 a
  und b (c beschrieben). Speicher gemessen (localStorage rund 52 Mio. Zeichen, IndexedDB 5,7 GB im eingebauten Browser).
  Anleitungen `docs/anleitung_zertifikat_klassenserver.md` (G10), `docs/anleitung_klassenserver_internet.md`
  (Vergleichsmatrix a/b/c). Bau steht aus (LERN-48).
- **Freiwillige Beiträge** (LERN-50): `docs/anleitung_freiwillige_beitraege.md`, `portal/unterstuetzen.js` (leere
  Links unsichtbar), `portal/unterstuetzen.html`, Hinweis nur für Erwachsene; Testskript prüft, dass keine Kinderseite
  darauf verlinkt.
- **Strategie-Rätsel** (S1 a, ST1–ST3 a, SD1/SF1/SF2 a; Thema Strategie, Basisklasse 5): Stein-Duell (Nim), Steine
  fangen (Atari-Go), König in der Falle (Matt in 1/2, 144 Stellungen) mit eigener Regel-Maschine. **Regelseite** je
  Spiel (Katalog `regeln: true`, rahmen.md 16), `ctx.tipp(texte, beiTipp)`.
- **Abzeichen in Stufen** 🥉 bis 💎 (19 Abzeichen, 95 Stufen); Wochenkarte warnt, wenn die Serie zu brechen droht.
- **Sortierung im Tab Spiele** (SO1 a, SO2 a), **Katalogfeld `art`** (SPIELWEISEN, SP1 a) für 168 Spiele,
  **Spieltabelle** `portal/eulenpfad-spiele.html` mit Mehrfach-Sortierung und Verfügbarkeit nach Prüfstand.
- **Anregungen** der Aufsicht an die Entwicklung (`typ: "anregung"`), **Korrekturen** von Listeneinträgen
  (`art: "korrektur"`, `LS.neueKorrektur`).
- **Prüfung je Eintrag** (LP1 a, LP2 a, LP4 a; rahmen.md 17): `spiele/gemeinsam/listenpruefung.js` — Abschnitte und
  Gruppen aufklappbar, ganz geprüfte zu; Haken je Eintrag am Fingerabdruck (`LS.fingerabdruck`, cyrb53); „✓ alle“,
  „Ganze Liste geprüft“ (überspringt Einträge mit Bemerkung); Bemerkungen sichtbar und entfernbar. Entwicklung
  schreibt `pruefstand-eintraege.json` über `/entwicklung/eintraege`, Aufsicht und Lehrperson haken lokal ab
  (`LS.pruefungLokal`) und schicken Korrekturen. Je Spiel eine `pruefung.js`; Pilot Anlaut-Angel (je Buchstabe/Laut,
  Spalte Laut) und Auge-Entdecker (sieben Abschnitte, Teile mit markiertem Bild).
- **Wiederholungen:** Gedächtnis `lernspiele:gestellt` je Kind, Spiel und Stufe — eine Aufgabe kommt erst wieder, wenn
  alle verschiedenen der Stufe einmal dran waren, auch über Runden; die Serienbremse geht vor, höchstens eine
  Wiederholung je Runde (rahmen.md, Abschnitt Wiederholungen).
- **Stimmen sichtbar:** Startblatt zeigt je Sprache die Stimme (gefunden, lädt, fehlt) mit „▶ Probe“.

## Geändert
- Vorlesen und Töne nacheinander: `ctx.nachAnsage(fn)`; sechs Hör-Spiele umgestellt; Vorlesen nur bei geändertem Auftrag.
- Meldung 6: nächste Aufgabe erst, wenn die Stimme fertig ist (höchstens 6 s), alle Spiele.
- Bemerkung 7: `LS.losGehts(…, { antwortenNachBlitz: true })` verdeckt die Antworten bis nach dem Aufblitzen
  (Blitzlesen, Punkte-Blitz, Finger-Zähler); die Uhr startet erst dann.
- Bemerkungen 3–5: Bild und Wort stimmen überein (ABC-Sortierer, Geschichten-Ordner, Hör-Geschichte); Auge-Entdecker
  mit Trefferebene (Pupille, Lid). Beim Weissen leuchtet die Fläche, nicht der Rand der Augenöffnung.
- Entwickler-Leiste auch in Spielen, die auf eine Stimme warten (Ereignis `lernspiele:spiel`).
- Portal je App eine Spalte, Anleitungen an der Eulenpfad-Karte; beide Anleitungen nachgeführt (fünf neue Bilder).

## Stolperfallen
- **Namenskollisionen im globalen Raum der Spielseiten:** `SPIELARTEN` gab es schon im Spiel Instrumente (43 Fehler),
  `pruefung` war schon der Haken des Testskripts. Neue globale Namen im Rahmen vorher gegen alle Spiele suchen.
  Hook-/Prüfer-Kandidat: Testskript meldet Rahmen-Exporte, die ein Spiel als eigene Konstante deklariert.
- **Wiederholungsregel zuerst zu weit:** unbegrenzte Wiederholungen je Runde ergaben 299 Testfehler („zweite
  Wiederholung“); der Gedächtniszyklus setzte nicht zurück, solange ungestellte Aufgaben nur selten gezogen wurden.
- **Bemerkung vs. „Ganze Liste geprüft“:** die Liste der Bemerkungen musste beim Hinzufügen/Entfernen mitgeführt
  werden, sonst wurde ein frisch bemerkter Eintrag mit abgehakt.
- **Document-Klicklisteners in Spielen** (Steine fangen, König in der Falle) fingen fremde Klicks — ersetzt durch `ctx.tipp`.
- Zweimal von Hand durchgesetzt: „Bild passt zum Wort“ (Dach/Käfig/Keller). Kandidat für die Listenprüfung je Eintrag
  (Spalte Bild sichtbar), kein eigener Hook.

## Verifikation
- Browser (Vorschau Port 8769): Prüfansicht Anlaut-Angel und Auge-Entdecker, Haken und Bemerkungen, Blitz-Spiele
  (Antworten vor Los, beim Zählen und beim Blitz verdeckt, danach sichtbar), Stimmenzeile, Meldung 6 (Stimme bis
  1867 ms, neue Aufgabe 1993 ms).
- Testskript `node tools/pruefe_spiele.js` über alle 168 Spiele × Stufen nach allen Änderungen: „Keine Fehler.“,
  19 Hinweise der bekannten Arten (Hinweis verrät, Serie, Einzahl?).

## Offene Punkte / Plan für die nächste Session
1. Offene Bemerkungen abarbeiten.
2. **LP3** entscheiden (Inhalte erst nach ganz geprüfter Liste in die Aufgaben, oder teilweise).
3. **LP5: alle Listen überarbeiten** — je Spiel eine `pruefung.js` (217 Listen), gemischte Listen trennen (Au café:
   Dialog eigene Liste, „Personen und Sachen“ nach Spalteninhalt); Bau mit Agenten nach festem Regelwerk.
4. `tools/pruefliste_wortlisten.js` auf die `pruefung.js`-Dateien umstellen; Testskript prüft `pruefung.js`.
5. **VL1 a** Pilot Au café: zweisprachiges Vorlesen (Sprachwechsel je Abschnitt messen).
6. **Gruppen bauen** (LERN-48) nach `docs/konzept_gruppen.md`.
7. Bei Patrik: Strategie-Rätsel ansehen und freigeben (LERN-49), Beitrags-Links eintragen (LERN-50).
