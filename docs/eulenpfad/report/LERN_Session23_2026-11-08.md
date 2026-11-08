# LERN_Session23_2026-11-08

## Schwerpunkt
Drei Stränge in einer langen Sitzung: (1) gemeinsamer Kern-Teil für die Übersichten (KT1 a) in Lernsteig und Eulenpfad;
(2) Hook-Kandidaten aus LERN_Session22 (HK1 a, HK2 a); (3) Plan E 1 als Massstab — Abdeckungstabelle aller
Lernsteig-Übungen am Wortlaut des Lehrplans (NX1 a, AT1 a) und danach MA.1.A.3 in acht Schritten bis aufs
Zurückgestellte (E1-1 a bis E1-6 a). Dazwischen eine Bemerkung Patrik zur Zufalls-Skala. 14 Commits von `c205170` bis
`73386cb`; gepusht bis `e7ceb90`, `73386cb` (Schritt 8) noch nicht.

## Neu
- **Kern 1.28.0 `KERN.uebersicht`** (KT1 a): Gruppen, Filter-Block, Suche, Ähnliche, Sortwahl, Favoriten und Stern;
  Lernsteig-Tab Übungen (`643096c`) und Eulenpfad-Tab Spiele (`ee20049`) darauf umgestellt, neuer Seitentest
  `tools/eulenpfad_seiten.js` (Teil `tab` von `pruefe_spiele.js`). Behoben: „Alle auf/zu“ während Suche, Suchfeld nur mit
  Leerzeichen.
- **Hooks** (HK1 a, HK2 a, `67b97d9`): Testskripte merken ihre Schlusszeile in `.temp/pruefung/<skript>.json`
  (`tools/testausgabe.js`); Stop-Hook `.claude/hooks/testzahlen.py` weist Commit-Messages mit Testzahlen ab, die in
  keinem heutigen Lauf stehen; git-Hook `tools/git-hooks/commit-msg` verlangt, dass eine geänderte Übung oder ein Spiel
  in der Message steht (eingeschaltet von Patrik).
- **Plan E im Code nachgelesen** (NX1 a, `c5dc51c`): E 1, E 4, E 5, E 10 teilweise; E 2, E 3, E 6, E 7 offen.
- **Abdeckungstabelle** (AT1 a): `docs/lernsteig/abdeckung.json` (je Übung und Stufe die Inhaltsteile mit genau einer
  Zuordnung), `tools/abdeckung.js` (Messung mit festem Startwert, erzeugt `docs/lernsteig/abdeckung.md`), Prüfung in
  `pruefe_uebungen.js`. Erst sinngemäss für alle 27 Übungen (`342091d`), dann **am Wortlaut** (`f89ed22`): Roh-HTML der
  übrigen 18 Kompetenzen in `docs/lernsteig/lehrplan/quellen_ma/` und `quellen_sprachen/`, Leser
  `tools/lehrplan_wortlaut.js`, Prüfung „jeder Teil wörtlich, jeder Punkt lückenlos bedeckt“. Stand jetzt: 215
  Inhaltsteile — 67 abgedeckt, 62 teilweise, 77 offen, 9 in einer anderen Übung.
- **MA.1.A.3 nach E 1** (E1-1 a bis E1-6 a):
  - `brueche`: Nenner nur aus der Liste, 20/50/100 auch bei plus, minus, mal; Umschreiben in alle sechs Richtungen;
    Dezimalzahlen plus/minus (f); Rechner-Aufgaben in f (`rechner: "mit"` an der Aufgabe, E1-4 a); Brüche mit Variablen
    und Formeln mit Zahlen belegen (Erweiterung i); Rechteckmodell zu jeder Bruch-Aufgabe in f und g (E1-6 a).
  - `rationale-zahlen`: heisst „Dezimalzahlen und rationale Zahlen“; „Welches Ergebnis stimmt?“ in g (Überprüfen);
    Primfaktoren in h (Erweiterung).
  - Rahmen: Rechner je Aufgabe, Darstellung `rechteck` (SVG). Werkzeug: Zahlen nach Wertziffern in `LST`.
  - **Kern 1.29.0** (`kern/terme.js`): Formen `primfaktoren` und `bruchterm`, „/“ nach einem Faktor teilt durch eine Zahl.

## Geändert
- **Zufalls-Skala** (Eulenpfad, Bemerkung Patrik): Knöpfe der Skala ohne Überlauf (Raster bis 980 px, Schrift
  16–18 px, weiche Trennstellen nur auf den Knöpfen).
- Plan E 1 neu gefasst; Entscheide E1-1 a bis E1-6 a im Plan; „nur auf Niveau Sek“ aus E1-3 a durch E1-5 a ersetzt.
- `sprachen_zyklus3.md`: FS1E.5.D.1.b steht auf der Seite, gleich wie FS2F.5.D.1.b.
- Seitentest: Rechner in Stufen „ohne“ je Aufgabe der Runde, Rechteckmodell gezählt.

## Stolperfallen
- **Eigene Vorlage gegen den Rahmen:** E1-3 a schlug „nur auf Niveau Sek“ vor, obwohl ST1 a sagt, dass die Aufgaben
  einer Stufe nicht am Niveau hängen; erst beim Bauen bemerkt und als E1-5 vorgelegt. Vor einer Vorlage, die Aufgaben
  betrifft, die Verträge in `docs/lernsteig/rahmen.md` (3, 4, 5a) gegenlesen.
- **`pruefe_uebungen.js` bricht nach dem ersten Fehler ab:** `if (fehler) return;` zählt über alle Übungen; die folgenden
  Übungen erzeugen keine Aufgaben, ihre Abdeckung meldet dann Folgefehler (einmal 81 Fehler aus 2 echten).
  **Prüfer-Kandidat:** den Abbruch je Übung zählen (zweiter Fall nach dem bekannten Seitentest-Mangel bei Teilläufen).
- **Teilläufe des Seitentests** verlangen `terme`, `gleichungen` und `rationale-zahlen` (bekannt seit LERN_Session21);
  Gegenproben deshalb mit diesen Übungen.
- **Anker in Skripten:** Eine `replace`-Korrektur traf den alten statt den neuen Text; ein Katalog-Anker passte auf zwei
  Übungen. `patchlib` brach beide Male ab, nichts wurde falsch geschrieben. Eine Gegenprobe mit leerem Zielanker liess
  sich nicht zurücksetzen; die Datei wurde aus den Entwürfen neu gebaut; danach meldete `abdeckung.js --pruefe` die
  Übersicht als aktuell und die Entwurfsprüfung 0 Fehler.
- **Generator-Fehler, gefunden durch die Messung über 20 000 Aufgaben:** Endlosschleife bei `1/2 − 1/2`, Typ neu ausgelost
  statt neu gezogen (minus 8 % statt 17 %), Rechenreste beim Runden grosser Ergebnisse (`x · 1e9`), ein Hinweis mit
  Zahlen, die die Lösung sein können, fehlender Tausender-Apostroph im Lösungsweg.
- **Agenten-Entwürfe:** Das Prüfskript für die Entwürfe ordnete die Kompetenz per Regex zu und gab dem Fach „mathematik“
  die Kompetenz von rationale-zahlen; ersetzt durch den Katalog. Eine Entität (`&middot;`) fehlte im Leser.
- **Hooks** haben richtig abgewiesen: Backslash im Heredoc (dreimal), dazu der Testzahlen-Hook nie (alle Zahlen aus
  `.temp/pruefung`).
- **Entwickler-Server auf 8765 lief nicht mehr:** nicht neu gestartet (schreibt den Prüfstand); angesehen über eine
  eigene Vorschau auf 8767 als Gast, `brueche` nur im Speicher des Browser-Fensters freigegeben.

## Verifikation
- Nach jedem Schritt der kurze Lauf ganz; zuletzt Kern „5752 Fälle, 0 Fehler.“, Lernsteig „0 Fehler, 140 Hinweise.“
  (Konten „101 Fälle, 0 Fehler.“), Gratwanderung „Keine Fehler.“. Die Hinweise sind die offenen und teilweisen Teile der
  Abdeckung (AT1 a).
- Eulenpfad: Teil `tab` und `zufalls-skala` („Keine Fehler.“); **kein voller Lauf**, obwohl die Kern-Kopie zweimal
  wechselte (1.28.0, 1.29.0; der Eulenpfad benutzt `KERN.terme` nicht). Gepusht wurde bis `e7ceb90` ohne vollen Lauf.
- Gegenproben je Schritt, alle wie erwartet: Wortlaut (5), brueche-Prüfungen (11), Rechner (4 und Seitentest),
  Erweiterungen (11), Rechteckmodell (je Typ, Seitentest 42 Stellen).
- Je 20 000 Aufgaben der geänderten Stufen ohne Fehler; `rationale-zahlen` nach dem Umzug der Helfer gleich (2000 von
  2000 Aufgaben mit Startwert 11).
- Browser: Tab Spiele und Freigabe-Suche (Eulenpfad), Zufalls-Skala über eine Probeseite (375–1600 px), Rechteckmodell
  in `brueche` f und g (Desktop und 375 px).

## Offene Punkte / Plan für die nächste Session
1. **Push** von `73386cb` und diesem Abschluss; vorher nach Steckbrief der **volle Eulenpfad-Lauf** (Kern-Kopie 1.28.0
   und 1.29.0) — nur auf Patriks Entscheid.
2. **Freigabe im Prüfstand durch Patrik:** `brueche` und `rationale-zahlen` mit den neuen Typen und dem Rechteckmodell;
   dazu weiter die Listen aus LERN_Session21/22.
3. **Plan E 2 bis E 10** mit der Abdeckungstabelle als Massstab; am meisten offen sind Handlungen (darstellen,
   zeichnen, durchführen) und Grammatik f/g.
4. Zurückgestellt: periodische Dezimalzahlen (Nenner 3 und 6), Variablen im Nenner (Term-Leser teilt nur durch Zahlen).
5. Prüfer-Kandidat zur Absegnung: Abbruch von `pruefe_uebungen.js` je Übung statt global; Seitentest-Teilläufe ohne
   Abhängigkeit von bestimmten Übungen.
6. Danach laut Plan C4, C6–C8, C10.
