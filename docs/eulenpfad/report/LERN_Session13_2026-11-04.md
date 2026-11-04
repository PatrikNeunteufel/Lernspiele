# LERN_Session13_2026-11-04

## Schwerpunkt
Testlauf über alles (aus LERN_Session12 offen), dann auf Hinweise Patrik: Bildhöhe auf allen Geräten, Kurztasten,
„Ich bin neu“ für Kinder und Erwachsene, vergessene PIN, Notizen für Zwischenergebnisse, Probe-Stempel. Entscheide HG1,
KR1, KR2, PIN1, PIN1-R, TK1, BH1, BH2, BH2-T, BH3, NZ1, SU1–SU3, GR1, WZ1 (alle a, mit Zusätzen Patrik). Zwei Commits:
der erste bis vor den Notizen (Patrik, nach dem Testlauf), der zweite mit diesem Abschluss.

## Neu
- **Handgriffe (HG1 a):** Mit dem Stellen der Aufgabe gilt `ctx.schritte` fest; Bausteine, die danach entstehen,
  zählen nicht; ein spätes `ctx.schritte` des Spiels meldet das Testskript. 21 Spiele mit Endlos aus LERN_Session12
  nennen ihre Handgriffe (65 Fehler im ersten Testlauf).
- **„🐣 Ich bin neu“ (KR1 a, KR2 a):** Kind (Vorname, Klasse, dann „Mein Bild“) oder Erwachsene: Frage über dem Stoff
  der Primarschule (Wurzel, Potenz, negative Zahlen, Gleichung, Punkt vor Strich mit Potenz, Pythagoras — Wünsche
  Patrik), Erlaubnis einer bestehenden Aufsicht mit ihrer PIN, dann Name, PIN und Sicherheitsfrage. Einstellung
  „Kinder legen sich selbst an“. „Zurück“ im Browser geht Schritt für Schritt (`#neu`, `#pin` …).
- **PIN vergessen (PIN1 a, PIN1-R a):** 1 zweite Aufsicht · 2 Wiederherstellungscode (einmal angezeigt) · 3 eigene
  Sicherheitsfrage · 4 Zurücksetzen mit 3 Tagen Frist, für alle sichtbar, abbrechbar. `LS.ohneGeheimnis` für Sichern,
  Abgleich und Einlesen; Verwaltung → Konten „Falls Sie Ihre PIN vergessen“.
- **Kurztasten (TK1 a, Zusatz Patrik):** nach dem Ort auf der Schweizer Tastatur, gleiche Zeichen auf gleichen Tasten
  (< = > Y X C, + − · : V B N M, Satzzeichen unten rechts, ⌫ Rücktaste), Stellen und Buchstaben auf sich selbst (auch
  doppelte: das Wort tippen), sonst A S D F …; Belegung erkannt in Chrome/Edge; Marke nur mit Tastatur. In den
  Bausteinen und 22 Spielen mit eigenen Knöpfen (rahmen.md 19).
- **Ganze Aufgabe im Bild (BH1–BH3 a):** Rahmen verdichtet nach Höhe, Zifferntastatur breit daneben und sonst unten fest,
  Sprechblase zwei Zeilen mit „…“, 💡 beim Antwortbereich (`data-tipp-ziel`), `LS.lesetext` für Lesespiele; 58 Spiele
  angepasst; `tools/bildhoehe.js` (Chrome ohne Fenster, Geräte auch als sichtbare Fläche, `--css` zum Ausprobieren).
- **Notizen für Zwischenergebnisse (NZ1 a, Zusatz Patrik):** `ctx.notizen(empfohlen)`, `LS.notizFeld()`, Einstellung
  „nach Stufe / immer / nie“, Vorgehen `notiz` in der Statistik, Abzeichen „Kopfrechner“ 🧠. In 32 Spielen nach
  `docs/eulenpfad/konzept_notizen.md` (Rechen-Maschine auf den Pfeilen, Probe-Stempel unter der Probe, drei Helfer
  den Rest; begründet ohne: Glace-Kombinator, Erdzeit-Leiter).
- **Probe-Stempel (Wunsch Patrik):** Endziffer-Probe mit „stimmt / nicht sicher / falsch“, getarnte Fehler mit gleicher
  Endziffer; nachgerechnet und sicher gestempelt zählt fürs Abzeichen „Ganz sicher“ 🔎 (nicht für Sterne).
- **Rückmeldung (WZ1 a):** Nach „richtig“ bleibt sie lesbar stehen (1,3 s + 45 ms je Zeichen über 20, höchstens 5 s,
  bis die Stimme fertig ist), Balken mit „Weiter ➜“, Antippen, Enter oder Leertaste überspringen; Endlos fest 0,9 s.
  Sagt ein Spiel beim Stellen nichts, zeigt die Eule wieder den Auftrag statt des Lobs der vorigen Aufgabe.

## Geändert
- Rechen-Maschine: Tipps mit den Zahlen der Aufgabe (statt „Starte hinten …“ bei jeder), Kette neben der Tastatur in
  einer Reihe. Probe-Stempel: Tastatur direkt in der Spielfläche.
- Vergleichs-Krokodil Stufe 6 lief auf dem Handy seitlich über.
- Anmeldung neu geschrieben (`start/anmeldung.js`); die aufklappbare „Aufsicht einrichten“ entfällt.
- Doku: rahmen.md (4.2, 4.3, 6, 14, 19, 20), Anleitungen (Ich bin neu, PIN vergessen, Tastatur), Steckbrief (Tests:
  Bildhöhe), neue Blätter `konzept_notizen.md`, `bildhoehe_offen.md`.

## Stolperfallen
- **Erste Bildhöhen-Messung falsch:** Gesperrte Spiele zeigten dem Messkind nur „noch nicht freigegeben“ und passten
  scheinbar. Das Werkzeug gibt jetzt alles frei und meldet gesperrte Seiten. Und: Bildschirmgrösse ist nicht die
  sichtbare Fläche (Browserleisten, Skalierung) — Hinweis Patrik mit seinem Laptop 1000 × 500.
- **Ausgeblendetes Browserfenster bremst Zeitgeber:** Messungen im Fenster liefen stundenlang; ohne Fenster (CDP)
  in Minuten. `requestAnimationFrame` läuft dort gar nicht — der Rahmen darf sich nicht darauf verlassen (Blase).
- **Späte Bausteine zählten Handgriffe still weiter** (zweiter Fall nach LERN_Session12): jetzt im Rahmen und
  Testskript erzwungen (HG1). **Prüfer-Kandidat erledigt.**
- Messwerkzeug misst nur die erste Zufallsaufgabe und den ersten Schritt (Sachaufgaben-Kompass, Rechentrick-Detektiv);
  Hörspiele ohne Stimme verfälschen die Höhe. Kandidat: Option „alle Aufgabenarten“ (bildhoehe_offen.md 7).
- Eigene Klassennamen wie `notiz` waren schon vergeben (Verwaltung) → `zw-notiz`; allgemeine Wörter (`kurz`, `offen`)
  nicht in die reservierten Klassen.
- Backslash im Heredoc weist der Hook ab: Skripte mit Write anlegen.

## Verifikation
- Testlauf über alles vor dem ersten Commit: „Keine Fehler.“ (20 Hinweise bekannter Arten).
- Testlauf über alles zum Abschluss: „Keine Fehler.“ (Hinweise bekannter Arten; neu ein „Einzahl?“ in Quader-Volumen s6,
  Fehlalarm aus den Beschriftungen der Notizen).
- Bildhöhe (Bildschirmgrössen, alle sechs Stufen): Handy 12, Tablet 1, quer 9, Laptop 11 Spiele mit Überlauf (vorher
  68/16/94/90 in drei Stufen). Sichtbare Fläche: siehe `bildhoehe_offen.md`.
- Im Browser angesehen: Anmeldung (Kind, erste und zweite Aufsicht, PIN vergessen über Code, Frage und Frist, Ablauf
  der Frist), Kurztasten (Anlaut-Angel, Gefühle-Radar, Rede-Zeichen, Spelling-Bee), Blase und 💡, Lesetext, Rechen-
  Maschine mit Notizen, „Weiter“ nach der Rückmeldung. **Nicht angesehen:** die drei Stempel im Probe-Stempel, die
  Notizen der 30 Helfer-Spiele (nur gemessen und getestet). Anleitungsbilder nicht neu aufgenommen.

## Offene Punkte / Plan für die nächste Session
1. **GR1 a umsetzen** (bildhoehe_offen.md): Verdichtung unter 700 px, Vollbild-Knopf, sichtbare Flächen als Vorgabe im
   Werkzeug, Runde je Spiel (Handy-Rest 30 Spiele). GR1 b (1000 × 500 ohne Vollbild) zurückgestellt (Patrik).
2. **Sudoku-Familie (SU1 a mit Gebiets-Sudoku, SU2 a, SU3 a):** Bilder-, Zahlen-, Vergleichs-, Käfig-, Gebiets-Sudoku,
   Sudoku-Duell; Thema „Logikrätsel“; Widerspruch sofort, Rest bei „Fertig“, ✏️-Notizen als Tipp. Ideenliste weiterer
   Logikrätsel `docs/eulenpfad/spielideen/logikraetsel.md`.
3. **PS2 a mit Rückfrage Patrik:** Neunerprobe in der Königsstufe des Probe-Stempels — braucht eine Erklärung bei der
   ersten Aufgabe; die Regeln für 3, 6, 9 unterscheiden sich; Idee „Gruppe von Spielen ausserhalb des Lehrplans für
   Neugierige, die Herausforderungen suchen“ als Entscheid vorlegen.
4. **Weitere Erfolge** (Zusatz Patrik zu NZ1): Konzept für Abzeichen je Thema und für besondere Spiele.
5. Sachaufgaben-Kompass: Ergebnis-Schritt auf dem Handy (bildhoehe_offen.md 6). Notizen in Spielen ansehen (Stichprobe).
6. Anleitungsbilder neu (`node tools/anleitung_bilder.js`, Server 8765): Anmeldung, Tipp-Ort, Kurztasten, Notizen.
7. Weiter aus LERN_Session12: LP5/LERN-51, VL1/LERN-52, Avatare in Konten, LERN-48, Patriks Punkte (LERN-49, -50, -43,
   -46, -37).
