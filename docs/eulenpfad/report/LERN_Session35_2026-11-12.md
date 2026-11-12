# LERN_Session35_2026-11-12_darkmode-schritt-5

## Schwerpunkt
Darkmode Schritte 5 und 6 nach `docs/konzept_darkmode.md`: alle Spielseiten ohne feste Farbe, Kontrast über alle 1215
Seiten am Ende hell 0 und dunkel 1 Fund (zu Beginn 98 und 348), dann Lernsteig, Portal, Anleitungen und Mix. Dazwischen
Wünsche Patriks zur Bedienung: Schalterzeile der Stufenwahl wie auf der Karte (RS1 a), Freigaben für alle Kinder mit
Ausnahme je Kind, ☀️/🌙 auf der Spielseite, schnellerer Tab Spiele, Favoriten, Vorlesen über 🗣️. Eine Pause mit
Haltepunkt, danach in derselben Sitzung weiter. Elf Commits, alle von Patrik (`7cbd5db` bis `123d099`); dieser
Abschluss noch zu committen. Keine offenen Entwickler-Bemerkungen (52 von 52 erledigt). Eine zweite Sitzung
[listen-pruefung] läuft auf eigenem Zweig (`claude/sleepy-snyder-54c222`, LERN_Session36): Trennlinien der Prüfansicht
und Prüfung je Eintrag für alle Inhaltslisten (LP5 a).

## Entscheide (Patrik, 12.11.2026)
- **RS1 a:** Auf der Spielseite dieselben Symbolknöpfe wie auf der Karte, je mit Wort, darunter die Erklärung des
  zuletzt geänderten; Endlos an startet die Stufen endlos, der Endlos-Block zeigt nur noch die Ranglisten.
- **Vorlesen** zuerst als Schalter in der Zeile, dann auf Wunsch über 🗣️ neben der Eule: antippen liest, lange drücken
  schaltet „gleich vorlesen“ (goldener Ring); Rückmeldung auf der Stufenwahl in der Hinweiszeile.
- **Freigaben für alle Kinder** (Kipppunkt aus DM2-K a eingetreten): je Art eine Einstellung des Geräts, im Profil je
  Kind „wie alle Kinder“, „darf selbst umstellen“ oder „🔒 fest“.
- **☀️/🌙** in der Kopfzeile der Spielseite (der Mond in der Zeile zeigte den Zustand statt des Ziels).
- **Favoriten:** oben zusätzlich, gerahmt wie ein Fach, „Alle Favoriten entfernen“ beim zweiten Tippen; Stern auch auf
  der Spielseite.
- **AN-B a:** Bilder und Texte der Anleitungen in einer eigenen Sitzung nachführen. **RS-A a:** Sitzungen nacheinander —
  diese abschliessen, dann die Inhaltslisten fertig und zusammenführen, dann die Anleitungen frisch von `master`.

## Neu
- **Spielseiten (Schritt 5):** Felder `--k-feld`, Trennlinien `--k-karte`, Schrift auf Farbgrund mit den Paaren aus
  `stil.css` (`--auf-stelle` neu); Namen `--feld-leise`, `--marker`, `--regel` mit dunkler Fassung; Deko-Töne als
  Schrift über `--deko-N-schrift` in 47 Seiten; Szenen mit `szenenbild bildkachel` (reserviert, Grund und Schrift ohne
  Gewicht); Gegenstände mit „Gleich in beiden Modi:“ (Banknoten, Klaviertasten, Go-Brett, Verkehrszeichen, Nachthimmel
  …); Notenblatt mit dunklen Noten nur im Blatt; `mark` mit der Schrift der Seite.
- **Prüfung:** `tools/pruefe_skripte.js` Punkt 7 in jedem Stil der Reihe ein Fehler (0 feste Farben); Punkt 8 neu
  (Farben in Skripten der Spielseiten nur in `SKRIPT_BILDFARBEN` mit Grund); Punkt 6 verlangt das Kopf-Skript auch im
  Lernsteig; Variablen in `:root, .bildkachel` und Masken zählen nicht; Gegenproben ergänzt.
- **Messung:** `tools/kontrast.js` liest den Grund des äussersten `<svg>`, misst Umriss-Schrift gegen den Umriss, scrollt
  Text in scrollenden Kästen hinein, lässt Schmuck (Lücken, Avatar-Motive) aus; Gegenprobe 22 Fälle; nicht messbare
  Texte mit Grund im JSON (`offen`).
- **Lernsteig (Schritt 6):** Kopf-Skript in 28 Seiten, Wahl „Hell oder dunkel“ im Profil je Person (Standard wie das
  Gerät, DM2 a; `LST.farbenAnwenden`), dunkler Akzent und Gefahr, Rechner gleich in beiden Modi.
- **Portal** folgt dem Gerät (`prefers-color-scheme`), **Anleitungen** dem Eulenpfad (`kern-kopf.js` mit `lernspiele:`).
- **Tab Spiele:** Schalter zeichnen nur ihre Karte neu (`karteNeu`, im Browser 5–12 ms statt Neuaufbau); Favoritenfeld
  für sich neu gezeichnet.
- **Freigaben:** Einstellungen `freiTimer`, `freiReihenfolge`, `freiVorlesen`, `freiFarben` (Block Kinder);
  `LS.festImProfil`, `LS.setzeFest(…, null)`.

## Geändert
- Restfunde: Lebensraum (Landschaftsfarben als Seitenvariablen, Wiese und Weiher hell dunkler), Blutkreislauf (dunkle
  Fassungen), Koordinaten-Schatz (Beschriftungen), Wortfamilien-Baum (Holz), Glace-Kombinator (Caramel heller,
  Inhaltsliste „sorten“, Prüfliste neu), Zahlenhaus (Dach als Fläche), Würfel-Zähler, Kiosk-Kasse (Scheine), Rutschen.
- Stufenwahl: „ohne Endlos“ entfällt; Satz zu Endlos in Einzahl und Mehrzahl.
- Vier Bilder der Kinder-Anleitung neu (a01–a04); das Werkzeug bricht danach ab (siehe Offene Punkte).

## Stolperfallen
- **`color` erbt den berechneten Wert:** In einer Bildkachel ist `var(--text)` hell gemeint, Text ohne eigene Farbe
  erbte aber die helle Schrift der Seite — `:where(.szenenbild.bildkachel) { color: var(--text) }`.
- **Spezifität des Bildgrunds:** `:root[data-farben] .szenenbild.bildkachel` verdrängte den eigenen Grund der Szene
  (Kompass-Plan) — mit `:where()` ohne Gewicht.
- **Zustand statt Ziel:** Der Mond-Schalter zeigte, was ist; ☀️/🌙 zeigt, wohin er schaltet. Patrik bemerkte es.
- **Messlücken als Funde:** `elementsFromPoint` liefert weder `pointer-events: none` noch Text ausserhalb eines
  scrollenden Ausschnitts; eine zu breite Regel machte 32 Texte „nicht messbar“ — erst mit Grund im JSON gefunden.
- **Prüf-DOM:** kennt weder `createComment` noch iterierbare `classList`, und `dataset` setzt kein Attribut.
- **Datei kurz gesperrt:** Schreiben schlug mehrmals mit „Invalid argument“ / „UNKNOWN“ fehl (Server oder Virenscanner);
  Wiederholen half. Prüfer-Kandidat: `patchlib` mit eingebautem Wiederholen.
- **Prüfer-Kandidat:** `tools/anleitung_bilder.js` merkt nicht, dass die Ziele seiner Rahmen veraltet sind, bis es
  abbricht; ein Seitentest könnte die Ziele gegen die Startseite prüfen.
- **Prüfer-Kandidat:** Text im Bild (Lücken-Motive, Avatare) nimmt die Messung jetzt aus; ob ein neues Motiv lesbaren
  Text bringt, prüft niemand.

## Verifikation
Kurze Tests zuletzt alle grün: Skripte „Keine Fehler.“, Kern „6068 Fälle, 0 Fehler.“, Server „59 Fälle, 0 Fehler.“,
Lernsteig „0 Fehler, 139 Hinweise.“, Konten „106 Fälle, 0 Fehler.“, Gratwanderung „Keine Fehler.“, Feier „169 Spiele,
6084 Bilder, keine Fehler.“, Schrift „Keine Fehler.“. Kontrast über alle 1215 Seiten (vor Schritt 6): hell 0, dunkel 1
(Lernsteig, danach behoben; Lernsteig hell und dunkel ohne Fund, ohne Konto nur die Anmeldung). Eulenpfad nur
Stichproben der geänderten Spiele, zuletzt „Keine Fehler.“ — **letzter voller Lauf weiter auf `6055527`**. Im Browser
angesehen (hell und dunkel, Desktop und Handy): Spielseiten mit Szenen, Stufenwahl mit Schaltern, Favoriten, Lernsteig
als Gast, Portal, Anleitung.

## Offene Punkte / Plan für die nächste Session
1. **Inhaltslisten (LERN_Session36, Sitzung listen-pruefung, Zweig `claude/sleepy-snyder-54c222`):** Trennlinien
   committen, `master` in den Zweig holen (Konflikt in CHANGELOG), zurückführen; dann LP5 a in Blöcken (Mathe zuerst).
2. **Danach die Anleitungen (AN-B a):** Texte und `tools/anleitung_bilder.js` gegen die heutige App abgleichen, alle
   Bilder neu, hell und dunkel ansehen — frisch von `master`, ohne eigenen Zweig.
3. Darkmode Schritt 6 schliesst mit den Anleitungen; die Gratwanderung bekommt die Wahl mit ihren ersten Übungen.
4. Voller Eulenpfad-Lauf auf Patriks Entscheid vor dem nächsten Push (seit `6055527` nicht gepusht).
5. Vorgemerkt: Easter Eggs zu besonderen Tagen (eigenes Konzept vor dem Bau).
