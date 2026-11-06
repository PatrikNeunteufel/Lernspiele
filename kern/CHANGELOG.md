# Kern — Änderungen

Versionen nach KB1 a: kleine Nummer Fehlerbehebung, mittlere neue Funktion (alte bleiben), grosse Schnittstelle
geändert (Apps müssen nachziehen).

## 1.15.0 — 2026-11-06 (LERN_Session18)
- `daten.js` (`KERN.daten`, DF1 a, DF2 a, DF4 a): Sichern, Einlesen und Abgleich in einem Dateiformat `reihe-daten`
  für alle Apps — Prüfung jedes Eintrags vor dem Schreiben, nur geänderte Schlüssel, alles oder nichts; Löschvermerke
  (Person nach Kennung und Name, Runden je Inhalt) und Freigabe nach dem jüngsten Stand; Teile der App (Eulenpfad:
  Meldungen); ältere Dateien `eulenpfad-daten` 1–3 und `lernsteig-sicherung` 1–2 werden umgedeutet, Dateien einer
  anderen App mit ihrem Namen abgewiesen. Eine gelöschte Person fällt nur weg, wenn sie seither weder geändert wurde
  noch gespielt hat (gefunden mit der Nachrechnung: sonst blieben ihre Runden auf dem anderen Gerät ohne Person liegen).
  Die Apps benutzen es noch nicht.
- `person.js` (DF4 a): `fuerDatei` (geschützte Person ohne PIN-Prüfwert, mit `geschuetzt` und dem Prüfwert des Codes),
  `gesperrt`, `freischalten` (Code und neue PIN, oder Bestätigung der App); `zusammenfuehren(…, { schutz: true })` sperrt
  geschützte Personen und Aufsichten ohne eigene PIN — nur mit der Option, ohne sie bleibt alles wie bisher.
  `ohneGeheimnis` und das Verbinden nehmen `gesperrt` und `geschuetzt` nie aus einer fremden Fassung.
- `anmeldung.js`: Eine gesperrte Person lässt sich weder wählen noch anmelden.

## 1.14.1 — 2026-11-06 (LERN_Session17)
- `anmeldung.js`: Die Anmeldung dieses Tabs geht vor der gewählten Person des Geräts. Vorher war ein Jugendlicher mit
  PIN in seinem Tab abgemeldet, sobald sich in einem zweiten Tab desselben Geräts eine Aufsicht anmeldete (gefunden mit den
  Seitentests des Lernsteigs im Ersatz-DOM, B2).

## 1.14.0 — 2026-11-06 (LERN_Session17)
- `terme.js` (`KERN.terme`): Terme lesen, vergleichen, Form prüfen und schreiben, aus dem Lernsteig; `text(p, sw)` mit
  der Schreibweise der App statt `LST.zahlText`. Behoben: D3 (`(3)(2x+3)` bei „ausgeklammert“ stürzt nicht mehr ab),
  D10 (Exponent höchstens 100, Zwischenergebnis höchstens 2000 Glieder, sonst Meldung statt eingefrorenem Tab),
  Exponenten ab 10: `text` schreibt sie hochgestellt (vorher „x1⁰“), `lies` liest eine Folge hochgestellter Ziffern als
  einen Exponenten („x²³“ = x^23, vorher (x²)³; ⁰ und ¹ fehlten). Ordnung der Glieder wie im Lehrmittel (TO1 a):
  bei gleichem Grad je Variable im Alphabet der höhere Exponent zuerst — (a + b)² = a² + 2ab + b² (vorher
  „2ab + a² + b²“); in den Übungen des Lernsteigs ändert das heute keine Aufgabe (6000 Aufgaben alt gegen neu).
- `rechner.js` (`KERN.rechner`): Rechenkern des Taschenrechners (Tasten-Kennungen, `rechne`, `anzeige(w, sw)`), aus dem
  Lernsteig; Modelle und Tastenfeld bleiben dort. Behoben: D9 (NaN heisst „nicht definiert“; erst auf 10 Ziffern
  runden, dann über wissenschaftliche Schreibweise entscheiden: 9999999999.6 → 1 · 10¹⁰).

## 1.13.0 — 2026-11-06 (LERN_Session17)
- `rolleiste.js` (`KERN.rolleiste`): einzeilige Leiste, die seitlich rollt, mit Pfeilen nur bei Bedarf; `zustand` als
  reine Rechnung getestet; das aktive Element rollt erst ins Bild, wenn die Pfeile stehen. Tab-Leiste von Eulenpfad
  und Lernsteig, Pfeile dort neben den Tabs.
- `personenmenue.js` (`KERN.personenMenue`, Entscheid PA1 a): Personen-Knopf mit Bild und Name, Menü mit den anderen
  Personen und getrennt darunter Abmelden (beim Gast Anmelden); Tastatur ohne Auswahl beim Pfeilen; `naechster` als
  reine Rechnung getestet. Ersetzt die Auswahlliste des Eulenpfads und Name mit Knopf im Lernsteig.

## 1.12.0 — 2026-11-06 (LERN_Session16)
- `person.js`: `uebernehmen(quelle, ziel, zusatz)` — Übernahme einer Aufsicht in eine andere App (Plan C9, Ü1 a, Ü2 b):
  Kennung, Name, Rolle, Art, PIN-Prüfwert, Sicherheitsfrage und Antwort-Prüfwert reisen mit, der Wiederherstellungscode wird
  neu ausgegeben; Felder der Ziel-App über `zusatz` (Lernsteig: `art`); keine Bestätigung in der Ziel-App; nichts wird
  überschrieben (`status` „schon“ oder „name“). Eulenpfad → Lernsteig im Profil der Aufsicht, Lernsteig → Eulenpfad
  auf der Aufsichtsseite.

## 1.11.0 — 2026-11-06 (LERN_Session16)
- `auswertung.js` (`KERN.auswertung`, Entscheide AW1 a, AW2 a): Rechnungen ohne App-Bezug — `mittel`, `median`,
  `korrelation`, `sitzungen` (Pause als Parameter), `lernzeiten`, `wochenStart`, `wochen` (Wochenziel mit Tagen und
  Minuten, Serie, erfüllte Wochen; ohne Minuten = Wochenserie des Lernsteigs), `stand` (eine Regel: letzte n Aufgaben,
  Mindestzahl, Schwelle, ohne gezeigte Lösung), `bedarf`, `ziehe`. Eulenpfad: Bedarf und Vorschläge mit dem Fenster der
  letzten 24 Aufgaben (bei Runden zu acht gleich wie bisher, nachgerechnet), Lernplan über `wochen`; Lernsteig:
  Kompetenzstand über `stand`, Wochenserie über `wochen`.

## 1.10.0 — 2026-11-06 (LERN_Session16)
- `einladung.js` (`KERN.einladung`): Einladung in eine andere App (EL1 a, Notiz EP1) — `erstellen(daten, { ziel, von })`
  mit Format `{ format: "einladung", v: 1, ziel, von, name, geboren, klasse, niveau, lehrplan }`, `fragment` für den
  Link `#einladung=…` (base64url über UTF-8-Bytes), `dateiname`, `lesen(fragment | objekt, { ziel, klasse, niveau,
  lehrplan })` mit den Prüfungen der Ziel-App; ältere Einladungen des Lernsteigs ohne `format` gelten. Lernsteig liest
  über den Kern (auch als Datei), der Eulenpfad erzeugt sie nach der 6. Klasse.

## 1.9.0 — 2026-11-06 (LERN_Session16)
- `entwicklung.js` (`KERN.entwicklung(opt)`): Entwickler-Modus für alle Apps (E1 a, E2 a, E3 a; Plan C6) — Schlüssel
  gegen den Hash (ein Schlüssel für das Repo, Rechnung wie bisher: `KERN.geheimnis.hash(s, "eulenpfad-entwickler")`),
  Zustand je App (`entwickler`), `aktiv` nur für die angemeldete Aufsicht, Entwickler-Server (`server`, `fremd`),
  `setzeGeprueft` je Bereich der App, `setzeEintraege`, Bemerkungen je App; jede Anfrage nennt `app`, der Prüfstand
  der App wird auf den Stand des Servers gebracht. Meldungen über `opt.melde`. Eulenpfad umgestellt (`LS.entwicklung`
  unverändert), Lernsteig neu (Freischalten auf der Aufsichtsseite, Leiste in den Übungen).

## 1.8.0 — 2026-11-06 (LERN_Session16)
- `anmeldung.js`: Gast (Entscheid C2 a) — Option `gast: { tab, erlaubt }`, `alsGast()` (meldet eine Person ab, gilt nur im
  Tab), `istGast()`; wählen, anmelden und abmelden beenden den Gast; `erlaubt()` schaltet ihn je Gerät ab, auch einen
  laufenden. Ohne Option kein Gast (Eulenpfad bis „👀 Nur schauen“). Lernsteig: ein Platz für Jugendliche und Aufsicht
  mit Gast (Plan C1).

## 1.7.0 — 2026-11-06 (LERN_Session16)
- `anmeldung.js` (`KERN.anmeldung.platz`): Anmeldung und Sitzung im Tab für alle Apps. Ein Platz merkt die gewählte
  Person (Kennung im Speicher der App); wer im Tab angemeldet sein muss (Standard `standardImTab`: Aufsicht oder mit
  PIN), gilt nur im geöffneten Tab (sessionStorage, Präfix der App). `aktiv`, `waehle` (ohne PIN), `anmelden` (PIN über
  `KERN.geheimnis`), `abmelden`; `gewaehlt: null` für einen Platz nur im Tab. Ältere Stände mit dem Namen im Tab gelten.
  Eulenpfad (Kind oder Aufsicht) und Lernsteig (Jugendliche, Aufsicht) umgestellt, Schlüssel unverändert.

## 1.6.0 — 2026-11-05 (LERN_Session15)
- `runden.js` (`KERN.runden`, Entscheid R1 a): ein Format für Runden und Rekorde aller Apps — Kernfelder `id`,
  `person`, `zeit`, `inhalt`, `stufe`, `aufgaben`, `fehler`, `dauer`, `test`, `punkte` (Rekord); `maengel` mit Schema der
  App-Felder (`zusatz`), Pflichtfeldern (`pflicht`), bekannten Inhalten und Personen; `umdeuten` (Felder umbenennen,
  feste Kennung `r-alt-…` aus Name, Zeit, Inhalt, Stufe für ältere Einträge, auf allen Geräten gleich);
  `zusammenfuehren` nach Kennung (Rekord: höherer Stand; fremde geprüft, eigene bleiben); `neueId`; `fingerabdruck`
  (cyrb53, auch `KERN.fingerabdruck`).
- Eulenpfad: `spiel` → `inhalt`, Kennung je Runde und je Serie (Zwischen- und Endstand teilen sie), Umzug beim Laden,
  Einlesen und Abgleich über den Kern mit Prüfung (D14), Dateien `format: "eulenpfad-daten"` Version 3.
- Lernsteig: `konto` → `person`, `uebung` → `inhalt`, Umzug beim Laden, Sicherung Version 2, Einlesen über den Kern.

## 1.5.0 — 2026-11-05 (LERN_Session15)
- `suche.js` (`KERN.suche`): Volltextsuche mit Rangfolge aus dem Eulenpfad (SU1 a) — `woerter`, `wortWert` (ganz,
  Wortanfang, ä = a, Wortteil, ein Tippfehler), `suche(text, eintraege, opt)` mit Feldern, Gewichten, sichtbaren
  Feldern, Grund und Passung als Faktor; `aehnlich(id, eintraege, opt)` mit Vergleich der App; `naehe` für Klassen.
- Der Eulenpfad (`LS.suche`, `LS.aehnlich`, `LS.passung`) gibt nur noch Felder, Gewichte und Vergleich an; die festen
  Suchbeispiele des Testskripts geben dasselbe Ergebnis. Der Lernsteig nutzt die Suche mit dem Tab Übungen (C3).

## 1.4.0 — 2026-11-05 (LERN_Session15)
- `freigabe.js` (`KERN.freigabe(opt)`): Freigabe nach Prüfstand aus dem Eulenpfad (L4 a, E1 a, FG1 a) — neu gesperrt
  bis angesehen, Inhaltslisten bis geprüft, Verweise `von` und Zusatzlisten, Gerätefreigabe der Aufsicht mit
  `freigabeStand`, Sperrgrund; die App nennt `art` („spiele“, „uebungen“), Katalog, Prüfstand, Speicher und Aufsicht.
- Eulenpfad (`LS.spielFrei`, `sperrGrund`, `spielListen` … unverändert nach aussen) und Lernsteig (`LST.FREIGABE`,
  `sperrGrund`, `uebungSichtbar`) benutzen ihn; im Lernsteig-Katalog fällt `geprueft` (zweite Quelle) weg.

## 1.3.0 — 2026-11-05 (LERN_Session15)
- `person.js`: `anlegen` gibt nur gesetzten Feldern (und Name, Rolle) eine Zeit, nicht den Vorgaben der App — sonst
  überschriebe beim Zusammenführen eine leere Vorgabe den echten Wert eines anderen Geräts.
- Der Eulenpfad benutzt `KERN.person` (Profile als `lernspiele:personen`, Umzug aus `lernspiele:profile`) und
  `KERN.geheimnis` (PIN, Code, Sicherheitsfrage).

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
