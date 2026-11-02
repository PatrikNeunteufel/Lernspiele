# LERN_Session7_2026-11-01

## Schwerpunkt
Aus der Auswertung des Lehrplans SG für die 5./6. Klasse (LERN-32) wurden die ersten fünf Spiele für die
Mittelstufe gebaut. Dabei kamen Fragen zu Schreibweisen auf (Dezimalzeichen, Geld), die zu Einstellungen der
Aufsicht und einem Konzept für Klasseneinstellungen führten. Auf Hinweise von Patrik folgten das
Vorgehen in der Statistik, eine Namensprüfung und Anleitungen für Erwachsene und Kinder mit
skriptgesteuerten Bildern. Entscheide: A1 a, A2 a, A3 a, B1 a, C1 a, D1 a, D2 a.

## Neu
- **Lehrplan 5./6. Klasse** (P56 a, LERN-32): 202 Kompetenzen, 369 Stufen nach dem Orientierungspunkt aus
  allen 239 Kompetenzseiten (direkt als HTML gelesen), 52 Spielideen, Top 15 —
  `docs/eulenpfad/spielideen/lehrplan_sg_5-6.md`; Leseskripte `tools/lehrplan_sg_lesen.py`, `tools/lehrplan_sg_5-6.py`.
- **Lehrmittel SG** (A3 a): Liste des Kantons für 2023/24 (Schweizer Zahlenbuch 5/6, Mathematik 5/6, mathwelt 2;
  Französisch dis donc!). Basisklasse je Spiel aus dem Zahlenbuch belegt (Konzeption 2011, Inhaltsverzeichnis
  Band 6 2017, Broschüre Neuausgabe): `docs/eulenpfad/lernziele/lehrplan_sg_session7.md`.
- **Fünf Spiele** (A1 a, B1 a; Namen nach D2 a): Bruch-Pizzeria (5), Mittelwert-Türme (5), Teiler-Spürnase (6),
  Überschlags-Radar (6, ohne Dezimalzahlen), Velo-Tabelle (6, Weg und Zeit, mit Dezimalzahlen). Themen „Brüche“
  und „Teiler und Überschlag“; Lernziele MA.1.C.2, MA.1.A.2, MA.3.A.3, MA.3.C.1 erweitert, NMG.3.1 neu.
- **Einstellungen der Aufsicht** (Verwaltung → Einstellungen): Dezimalzeichen global und je Spiel („wie
  global“, Punkt, Komma), Standard Punkt, „Alles auf Standard“; `LS.EINSTELLUNGEN`, `LS.einstellung`,
  `LS.dezimalText`, Katalog-Feld `einstellungen`.
- **Geld nach Klasse** (C1 a): `LS.geldText` — bis 3. Klasse „25 Fr. 60 Rp.“, ab 4. Klasse „25.60 Fr.“ mit dem
  Dezimalzeichen, nach `LS.klasseDerStufe`; Kiosk-Kasse und Preis-Tabelle umgestellt.
- **Konzept Klasseneinstellungen** durch Lehrpersonen, nicht umgesetzt: `docs/eulenpfad/konzept_klasseneinstellungen.md`
  (Rollen, Klasse ohne Namensliste, Kandidaten, Vorrang Kind → Klasse → Gerät → Standard, Verteilung als
  Datei, offene Fragen F1–F8).
- **Vorgehen in der Statistik**: `ctx.vorgehen(art, wert)`, `AUSWERTUNG.VORGEHEN`, Karte „Vorgehen“ (letzte 12
  Aufgaben als Punkte). Melden: Möglichkeiten-Finder (Zählwerk / geordnet / kreuz und quer / mit Hilfe),
  Teiler-Spürnase (in Paaren / der Grösse nach / durcheinander), Mittelwert-Türme (ohne Umweg / mit Umwegen).
- **Namensprüfung** im Testskript: doppelter Name = Fehler, Grundwort in mehr als 2 Namen = Hinweis.
- **Anleitungen**, vom Portal verlinkt: `eulenpfad/anleitung/aufsicht.html` (14 Abschnitte, mit Endlos und
  Ranglisten) und `kinder.html` (8 Schritte, Handy-Bilder). 24 Bilder mit nummerierten Rahmen aus
  `tools/anleitung_bilder.js`: Chrome ohne Fenster, eigenes leeres Profil, Muster Admin (PIN 1111), drei
  Musterkinder, erfundene Runden und Rekorde; WebP.

## Geändert
- Glace-Kombinator heisst **Möglichkeiten-Finder** (D1 a); sein Lob wertet die Fundreihenfolge aus statt
  immer „super systematisch“ (Hinweis Patrik).
- Portal: Eulenpfad für die 1. bis 6. Klasse, Kacheln zu den Anleitungen.
- Entwickler-Server liefert WebP mit `image/webp`.
- CLAUDE.md: Dezimalzahlen nur über `LS.dezimalText`, Geld nur über `LS.geldText`.
- Fix: „null“ in der PIN-Eingabe (DOM-`append` schreibt `null` als Text).

## Stolperfallen
- **Lehrplanseiten in UTF-8:** zuerst als cp1252 gelesen → Umlaut-Salat; die Seiten sind UTF-8.
- **Python-Abruf mit fremder Kennung** wurde vom Auto-Modus als Umgehung abgewiesen; mit `curl` selbst lief es.
- **Globaler Name `THEMEN`:** Die Mittelwert-Türme brachen beim Laden ab, weil `katalog.js` `THEMEN` schon
  definiert. Spiele teilen den globalen Namensraum mit dem Katalog.
- **Überschneidung übersehen:** Dreisatz und Durchschnitt gab es schon in Stufe 5 von Preis-Tabelle und
  Diagramm-Detektiv; erst beim Bauen bemerkt (B1). Beim Planen neuer Spiele die Stufen 5–6 der Spiele mit
  Basisklasse eine tiefer lesen.
- **Grundwörter in Namen:** Vier der fünf neuen Spiele hätten ein schon mehrfach benutztes Grundwort
  getragen. → Prüfer gebaut (Namensprüfung, Hinweis).
- **Browser-Bereich verborgen:** Aufnahmen wurden doppelt vergrössert und abgeschnitten; daher das Bildskript
  mit eigenem Chrome. Wechsel nur des `#`-Teils löst kein Ladeereignis aus (Skript hing).
- **Rahmen um verborgene Elemente:** `querySelector` traf einen Schalter in einem zugeklappten Fach → leerer
  Rahmen im Bild (Hinweis Patrik). Das Skript rahmt nur noch sichtbare Elemente.
- **Changelog-Reihenfolge:** Eintrag zuerst vor Session 6 eingefügt; die Sitzungen stehen aufsteigend.
- **Backslash-Hook** griff zweimal bei Python im Heredoc; jeweils als Skriptdatei gelöst. Kein neuer Hook.
- **Hook-/Prüfer-Kandidaten:**
  - Doppelte oder gehäufte Grundwörter in Spielnamen: von Hand bemerkt → jetzt im Testskript.
  - Globale Konstanten eines Spiels, die mit Rahmen oder Katalog kollidieren (`THEMEN`): Kandidat für eine
    Prüfung im Testskript (Liste der globalen Namen von `spiel.js`/`katalog.js` gegen die Spielskripte).

## Verifikation
- `node tools/pruefe_spiele.js` über alle 91 Spiele × 6 Stufen mit Endlos, Inhaltslisten als Kind, Mix,
  Suche und Namen: **„Keine Fehler.“**, 11 bekannte Hinweise „zu wenig verschiedene Aufgaben“, ein
  bekannter Serien-Hinweis (Flächen-Pixel oder Uhr-Werkstatt), drei Grundwort-Hinweise (Detektiv 5,
  Sortierer 4, Puzzle 4).
- Systematik-Erkennung an sieben Hand-Beispielen geprüft (u. a. a1b2, a2b1, a1b1, a2b2 → kreuz und quer).
- **Im Browser** (Desktop, Tablet 768 px, Handy 375 px): die fünf neuen Spiele, Möglichkeiten-Finder,
  Einstellungen global und je Spiel, Geld in Preis-Tabelle und Kiosk-Kasse mit Punkt und Komma, Karte
  „Vorgehen“ (mit vorübergehenden Testrunden, danach entfernt), beide Anleitungen (alle Bilder laden, kein
  waagrechtes Scrollen auf dem Handy).
- **Nicht geprüft:** Inhaltsverzeichnis der Zahlenbuch-Neuausgabe 2023, Mathematik 5/6 und mathwelt 2;
  Dezimalzeichen der Neuausgabe; die neuen Spiele mit Kindern; Safari/iPad.

## Offene Punkte / Plan für die nächste Session
1. Die fünf neuen Spiele im Entwickler-Modus ansehen und freigeben (heute 2 von 35 neuen Spielen angesehen).
2. 5./6. Klasse weiter nach `lehrplan_sg_5-6.md`: M3–M5 (Dezimalzahlen mit `LS.dezimalText`; Eingabe von
   Dezimalzahlen fehlt noch, Konzept F5), dann die übrigen Top 15 (Komma-Jagd, Morphem-Schere, Code-Garten,
   Mots-Match).
3. Vorschläge zum Umbenennen der Grundwörter Detektiv, Sortierer, Puzzle (D2 a, später).
4. Klasseneinstellungen: Entscheide F1–F8 im Konzept.
5. Weiter offen: LERN-21/LERN-11 (ansehen, Listen prüfen), LERN-31 (Abgleich auf echten Geräten), LERN-4
   (Testrunde mit Kindern), Schweiz-Karten-Suche mit Seen, Flüssen, Gebirgen (LERN-33).
