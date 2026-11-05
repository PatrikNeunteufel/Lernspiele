# Kern — Änderungen

Versionen nach KB1 a: kleine Nummer Fehlerbehebung, mittlere neue Funktion (alte bleiben), grosse Schnittstelle
geändert (Apps müssen nachziehen).

## 1.2.0 — 2026-11-05 (LERN_Session15)
- `geheimnis.js` (`KERN.geheimnis`): PIN, Wiederherstellungscode und Sicherheitsfrage als Prüfwerte, dieselbe Rechnung
  wie bisher in beiden Apps (SHA-256 von „salz:wert“); Format der Wiederherstellung wie im Eulenpfad
  `{ code, frage, antwort }`; ohne `crypto.subtle` eine verständliche Meldung (D6).
- `person.js` (`KERN.person`, Entscheide P1 a, P2 a, B3): Kennung `p-…`, Name eindeutig ohne Gross/Klein, Rollen
  `lernend`/`aufsicht` mit Art und Gruppenleitung, Geburtsdatum mit oder ohne Tag (`geburtsdatumLies`, `…Text`,
  `alter`, `tagFehlt`), Prüfung `maengel`, `ohneGeheimnis`, Liste im Speicher der App (`liste`) mit Zeit je Feld,
  `zusammenfuehren` (gleiche Kennung, sonst gleicher Name; ältere Kennung bleibt, andere als frühere; je Feld der
  jüngere Stand; Geheimnisse bleiben vom Gerät; Namen bleiben eindeutig; Kennungen zum Umbiegen).
- Lernsteig benutzt beide (Konten und Aufsichten in einer Liste `lernsteig:personen`); der Eulenpfad zieht mit C um.

## 1.1.0 — 2026-11-05 (LERN_Session15)
- `speicher.js`: `KERN.speicher(praefix)` → `{ praefix, lies, schreibe, entferne, schluessel }`; `schreibe` meldet
  `false`, wenn der Speicher voll oder gesperrt ist (Grundlage für D11), Präfix wird geprüft.
- `zufall.js`: `KERN.zufall` mit austauschbarer `quelle` (Standard Math.random, erst beim Aufruf gelesen), `zufall`,
  `waehle`, `mische`, `mitStartwert(seed)` für Testskripte.
- `el.js`: `KERN.el` als Vereinigung beider App-Fassungen: `html` bleibt (nur fester Text), `false`/`null`/`undefined`
  als Attribut oder Kind fallen weg (im Eulenpfad gaben sie bisher „false“ als Text oder Attribut), `true` als leeres
  Attribut, verschachtelte Kinderlisten flach.
- Eulenpfad (`LS.el`, `lies`, `schreibe`, `zufall`, `waehle`, `mische`) und Lernsteig (`LST.lies`, `schreibe`,
  `quelle`, `zufall`, `waehle`, `mische`, `el`) benutzen die Teile; `LS.schreibe` gibt jetzt true/false zurück.

## 1.0.0 — 2026-11-05 (LERN_Session15)
- Erster Kern (Plan `docs/plan_angleich_reihe.md` B, KB2 a).
- `zahl.js`: `KERN.zahl.text`, `dezimalText`, `lies`, `klartext` mit der Schreibweise als Einstellung
  `{ tausender, abStellen, minus, dezimal }`. Neu gegenüber den App-Kopien: nur der ganze Teil wird gegliedert
  (`1234.5678` gab „1'234.5'678“, Befund D8), ganze Zahlen exakt bis 2^53, ohne Exponent und ohne Rundungsreste,
  kein „−0“, `NaN`/`Infinity` als Text statt falsch gegliedert.
- `bruch.js` aus `lernsteig/gemeinsam/bruch.js`: `zahl` meldet „keine Zahl: …“ statt eines rohen BigInt-Fehlers,
  liest Apostroph, schmales Leerzeichen, Komma und „−“; `wurzelGanz` exakt auch über 2^53; neu `vergleich`, `alsZahl`;
  Kommentar zu `vonZahl` richtig (15 gültige Ziffern, Befund K7).
