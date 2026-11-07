# LERN_Session20_2026-11-07_push-notizblock

## Schwerpunkt
Aus Patriks Rückmeldungen zum Lernsteig zuerst Eingabe und Notizblock: ein Tastenfeld als Kern-Teil für jede Antwort
(TF1 a) und die Vorlage „= Gleichung“ im Notizblock (GL1 a), dazu ein Fehler nach Screenshot (Variable fehlte als Taste).
Dann der Rest von C5 in der Lernsteig-Verwaltung: Untertabs, Freigabe je Gerät mit Abgleich, Konten löschen und auf dem
Gerät ausblenden (KE1 a, KE2 a; auch im Eulenpfad). Danach B2 Schritt 3 ganz: Annahme von Antworten (mit Fund ZL1 a),
Text gegen Prüfdaten in zehn Übungen (TD1 a), Vorrat je Stufe in Runden (VF1 a) und die Zeitzone (Kern `zeit.js`).
Kern von 1.22.0 auf 1.26.0. 17 Commits von `f60d46b` bis `2d64b4a`, dazu dieser Abschluss; gepusht bis `631f625`.

## Neu
- **Kern** (docs/kern/rahmen.md 4.24, 4.25):
  - 1.23.0 `tastenfeld.js` (`KERN.tastenfeld`, TF1 a): Tasten, die an der Schreibmarke in ein Feld schreiben, ohne ihm
    den Fokus zu nehmen; der Notizblock benutzt es. Vorlage „= Gleichung“ im Notizblock (GL1 a): Zeilen „Gleichung |
    Umformung“, „＋ Zeile“, Zeichen der Gleichung, Weiterrechnen nach „x = Zahl“, nichts bewertet.
  - 1.24.0 `KERN.person.ausgeblendet`: Personen auf einem Gerät nicht zeigen, ohne sie zu löschen (KE1 a, KE2 a).
  - 1.25.0 Gliederung nur in Dreiergruppen beim Lesen von Zahlen und Termen (ZL1 a), `KERN.zahl.gliederungFalsch`.
  - 1.26.0 `zeit.js` (`KERN.zeit.tag`, `vorTagen`, `tagAnzeige`): Kalendertage in Ortszeit.
- **Lernsteig:**
  - Tastenfeld unter jeder Zahl- und Term-Antwort, Tastatur des Geräts zu; `LST.antwortTasten` wählt die Tasten aus dem
    Term der Aufgabe; Notizblock-Vorlagen je Übung im Katalog, „= Gleichung“ in gleichungen und binome-gleichungen.
  - Verwaltung mit Untertabs (Konten, Freigabe, Abgleich, Einstellungen, Entwicklung); Freigabe je Fach und Übung mit
    Prüfstand, Schalter und „wie Prüfstand“, im Abgleich mit (jüngste gewinnt).
  - Konto löschen (der Jugendliche im Profil mit Vorname und PIN, die verbundene Aufsicht nach Rückfrage, Löschvermerk);
    nicht verbundene Konten und gesperrte Aufsichten auf dem Gerät ausblenden, „Wieder zeigen“.
  - `LST.antwortPruefen` (Prüfung einer Antwort ohne Seite), `LST.zahlenImText` (Zahlen aus einem Satz nach Muster).
  - `liesText` in zehn Übungen (flaechen-volumen, koerper-winkel, prozent-funktionen, daten-rabatt, folgen,
    sachsituationen, zehnerpotenzen, binome-gleichungen, kombinatorik, zufall): `pruefeAufgabe` liest den angezeigten
    Text und die Darstellung, vergleicht mit den Daten und rechnet die Lösung ein zweites Mal aus dem Gelesenen; in
    Kombinatorik und Zufall der Wortlaut der Ereignisse aus eigenen Tabellen im Prüfteil.
  - Katalogfeld `vorrat` (VF1 a) für begründet kleine Vorräte.
- **Prüfer:** `pruefe_uebungen.js` — Tasten für jede Lösung, Annahme von Antworten (300 Aufgaben je Stufe), `liesText`
  Pflicht für die zehn Übungen, Vorrat in Runden; Seitentest — Tastenfeld, Notizblock mit Gleichung, Untertabs,
  Freigabe, Ausblenden und Löschen; Konten — Freigabe im Abgleich, Ausblenden und Löschen (101 Fälle); Kern — Tastenfeld,
  Ausblenden, Gliederung, Kalendertage und eine Suche nach Tagen aus UTC-Zeiten im Code aller Apps. Jede neue Prüfung mit
  Gegenprobe.

## Geändert
- **Eulenpfad:** gesperrte Aufsicht „auf diesem Gerät ausblenden“ statt „löschen“ (ein Löschvermerk nahm sie im Abgleich
  auf ihrem eigenen Gerät mit), Rolle „Aufsicht (🔒 von einem anderen Gerät)“; Datum in Meldungen und Prüfvermerken in
  Ortszeit; Notizblock über das Tastenfeld des Kerns (Verhalten gleich).
- **Lernsteig:** Übungstage in Statistik und Verwaltung in Ortszeit (vorher UTC-Tag, das Wochenziel schon Ortszeit);
  `aufsicht.html?konto=<id>` führt zu `#statistik/<id>`; die Prüfungen der zehn Übungen über `sollAus`/`pruefeMit`, die
  mit Daten und Gelesenem rechnen (in kombinatorik ersetzt `zaehle` die frühere Suche „Ziffern im Text“).
- Doku: docs/kern/rahmen.md 4.7, 4.23–4.26; lernsteig/rahmen.md 4, 5a0, 5b–5e, 6, 7, 8; eulenpfad/rahmen.md (Abgleich);
  Plan (TF1, GL1, KE1, KE2, ZL1, TD1, VF1 a; B, B2, C5, E 9); Kern-Changelog; CHANGELOG.

## Stolperfallen
- **Tasten fehlten für Lösungen** (Patriks Screenshot „b · b · b“ ohne Taste b): seit die Tastatur des Geräts zu bleibt,
  muss jedes Zeichen einer Lösung eine Taste haben; 1144 von 8000 terme-Aufgaben waren nicht tippbar. Jetzt geprüft.
- **Personen-Knopf blieb stehen:** Die Verwaltung zeichnete nach dem Ausblenden nur ihren Inhalt neu, die Leiste nicht —
  im Browser gesehen, behoben, im Seitentest geprüft.
- **Freigabe-Tabelle auf 375 px** drückte die Karte über den Rand (Grid ohne `min-width: 0`); dann Zeilen gestapelt.
- **`sed -i` auf einer CRLF-Datei** (koerper-winkel) machte sie still zu LF — zweiter Fall nach LERN_Session19. Ins
  Gedächtnis aufgenommen (`sed-i-entfernt-crlf`); Gegenproben seither mit Kopie, Edit und Rückkopie. **Hook-Kandidat:**
  ein PreToolUse-Hook, der `sed -i` auf Dateien des Repos abweist (die Regel wurde zweimal von Hand durchgesetzt).
- **Der Term-Leser hatte dieselbe Lücke wie der Zahl-Leser** (Apostroph überall entfernt); erst der zweite Lauf zeigte
  sie in `brueche`.
- **Erste Suche nach UTC-Tagen unvollständig:** die abgeschnittene Ausgabe verbarg zwei Stellen in der
  Listenprüfung; der Suchlauf im Kern-Test fand sie. Lehre: Suchergebnisse nicht nach Zeichen kürzen, bevor sie gelesen
  sind.
- **Node nimmt `TZ` hier nicht an** (Windows): Zeitzonen-Fälle greifen nur auf einem Rechner ausserhalb von UTC.
- „commie“ als „committed“ gelesen (ohne Rückfrage).

## Verifikation
- Kern „5671 Fälle, 0 Fehler.“ (Kopien aller drei Apps auf 1.26.0).
- Lernsteig „0 Fehler, 21 Hinweise.“ — die 21 Hinweise sind die gewollten Vorrats-Meldungen (VF1 a, Plan E 9); Konten
  „101 Fälle, 0 Fehler.“; 320 Runden im Ersatz-DOM.
- Gratwanderung „Keine Fehler.“
- Eulenpfad: nach jedem Kern-Schritt die Stichprobe schriftlich-werkstatt, rechenprobe, malkreuz, zahlenhaus,
  preis-tabelle, quader-volumen (36 Stufen) mit denselben Klickzahlen wie mit dem Kern davor; Datenteil „Keine Fehler.“
  Ein voller Lauf fand in dieser Sitzung nicht statt (letzter auf dem Stand nach `141cc53`).
- Browser: gleichungen j mit Tastenfeld und Gleichung im Block (Desktop, 375 px); Lernsteig-Verwaltung mit Freigabe
  (Desktop, 375 px), Ausblenden und Löschen; Eulenpfad-Verwaltung mit Ausblenden einer gesperrten Aufsicht.
- **Nicht geprüft:** Term-Tastenfeld im Browser (terme für den Gast gesperrt; im Seitentest geprüft); Zeitzonen-Fälle auf
  einem Rechner in UTC; voller Eulenpfad-Lauf mit Kern 1.23–1.26 (bis 1.25 schon gepusht).

## Offene Punkte / Plan für die nächste Session
1. **Voller Eulenpfad-Lauf** auf Patriks Entscheid, vor dem Push von `2d64b4a` (Kern 1.26.0) — seit dem letzten vollen
   Lauf kamen 1.22–1.26 nur mit Stichproben.
2. **C3** (Plan C): Tab Übungen wie der Tab Spiele — zuerst `eulenpfad/start/spiele.js` lesen, dann in drei Schritten:
   Kacheln nach Fach und Thema mit Symbolen und Favoriten; Filter, Sortierung, Suche (`KERN.suche`); Passung aus Niveau
   und Prüfungsziel, Wackel-Stufen, ähnliche Übungen.
3. **Vorrat (E 9):** die 21 gemeldeten Stufen je Übung vergrössern oder im Katalog begründen (stromkreis b zuerst,
   Wiederholung nach 1.3 Runden).
4. **Prüfen durch Patrik:** Tastenfeld und Gleichung im Block (gleichungen, binome-gleichungen), Verwaltung mit Freigabe,
   Löschen und Ausblenden.
5. Danach laut Plan C4, C6–C8, C10; zurückgestellt: periodische Dezimalzahlen (Nenner 3, 6).
