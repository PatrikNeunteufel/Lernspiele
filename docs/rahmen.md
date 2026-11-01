# Rahmen der Lernspiele — Vertrag zwischen Rahmen und Spielen

Dieses Dokument legt fest, was der gemeinsame Rahmen (`spiele/gemeinsam/`) bereitstellt und was
ein Spiel einhalten muss, damit alle Spiele gleich aussehen und sich gleich verhalten. Es gilt
für jedes neue Spiel und für jede Änderung am Rahmen (Entscheid Patrik R1 a, 2026-10-31).

Die Gestaltungsregeln für Kinder (Stufen, Farben je Stelle, Fehler nicht schlimm, Inhaltslisten)
stehen in `CLAUDE.md`. Hier steht, **wie** ein Spiel sie technisch umsetzt.

**Einzige Quellen.** Dieses Dokument erklärt sie, wiederholt sie aber nicht:
- CSS-Klassen des Rahmens: `LS.RAHMEN_KLASSEN` in `spiele/gemeinsam/spiel.js`
- Farben: `:root` in `spiele/gemeinsam/stil.css`
- Spiele, Themen, Lernziele: `spiele/gemeinsam/katalog.js`

`node tools/pruefe_spiele.js` prüft die Punkte, die mit ✔ markiert sind.

## 1. Aufbau einer Spielseite

```
spiele/<id>/index.html     die Seite: <header class="kopf">, <main class="buehne">, eigenes <style>, Skript
spiele/<id>/woerter.js     Inhaltslisten (Wörter, Sätze, Orte …), falls es welche gibt
```

Die Skripte werden in dieser Reihenfolge geladen: `../gemeinsam/spiel.js`, `../gemeinsam/katalog.js`,
bei Bedarf `../gemeinsam/noten.js`, dann die eigene Inhaltsdatei und das eigene Skript.
Vorlage ist ein bestehendes Spiel, zum Beispiel `spiele/rest-raetsel/index.html`.

## 2. CSS-Klassen

### 2.1 Reservierte Klassen — nie im eigenen Stil umdefinieren ✔

Mit diesen Klassen baut der Rahmen den Kopf, das Startbild mit Stufenwahl, die Runde und die
Schlusskarte. Die Liste steht in `LS.RAHMEN_KLASSEN.reserviert`. Ein Spiel darf sie
in seinem `<style>` **nicht auf oberster Ebene** definieren, also nicht mit einem Selektor, der mit
der Klasse beginnt. Sonst verschiebt es auch die Seiten des Rahmens.

Beispiel: Das Vergleichs-Krokodil hatte eine eigene `.mitte` für seinen Kreis. Dadurch schrumpfte
die Schlusskarte (`karte schluss mitte`) auf 110 px, und ihr Inhalt stand nebeneinander statt
untereinander.

| Gruppe | Klassen (Auszug) | wofür |
|---|---|---|
| Seite | `buehne`, `kopf`, `zurueck`, `ton` | Fläche der Seite, Kopfzeile mit Zurück und Ton |
| Karten | `karte`, `mitte`, `schluss`, `auftrag` | weisse Karte, zentriert, Schlusskarte, Auftragszeile |
| Knöpfe | `knopf` mit `hell`, `gruen`, `klein`; `knopfzeile`, `link` | alle Knöpfe des Rahmens |
| Eule | `eule`, `eule-zeile`, `blase` | Eule mit Sprechblase |
| Runde | `fortschritt`, `zeitleiste`, `zeitbalken`, `testhilfe` | Punkte je Aufgabe, Timer, Testhilfen |
| Sterne | `sterne`, `sterne-klein`, `aus`, `konfetti`, `flug` | Belohnung und Animation |
| Angemeldet | `spieler-zeile` | „Du spielst als …“ im Startbild; angemeldet wird auf der Startseite |
| Stufenwahl | `stufen`, `stufe`, `fuer`, `timer-zeile`, `timer-schalter`, `leise` | Startbild des Spiels |

**Erlaubt:** reservierte Klassen eingeschachtelt in einer eigenen Klasse. `.uhr .mitte` trifft nur
die Uhr. `.knopf` darf ein Spiel als Klasse an eigene Knöpfe hängen, aber nicht umgestalten.

### 2.2 Klassen der Bausteine — anpassbar

Diese Klassen gehören zu den Bausteinen (Abschnitt 4). Ein Spiel darf sie im eigenen Stil anpassen,
zum Beispiel grössere Wahlknöpfe. Die Liste steht in `LS.RAHMEN_KLASSEN.bausteine`.

| Baustein | Klassen |
|---|---|
| `LS.auswahl`, `LS.reihenfolge` | `wahl`, `wahl-knopf`, `bild`, `ablage`, `pfeil` |
| `LS.koerbe` | `korb-karte`, `korb-reihe`, `korb-knopf` |
| `LS.tastatur` | `tastatur`, `anzeige`, `ok`, `loeschen` |
| Noten (`noten.js`) | `hoer-zeile`, `hoer-knopf`, `notenblatt`, `noten-zeile` |

Den Zustand zeigen die Klassen `richtig`, `falsch` und `gewaehlt`. Sie setzt der Baustein selbst;
ein Spiel kann sie für eigene Elemente mitbenutzen.

### 2.3 Eigene Klassen eines Spiels

Alles andere benennt ein Spiel selbst. Allgemeine Namen bekommen einen Vorsatz aus dem Spiel
(`kroko-mitte`, `baustein-plus`) oder werden unter einer eigenen Klasse eingeschachtelt
(`.uhr .zeiger`). Fachliche Namen wie `.mauer` oder `.malkreuz` sind ohne Vorsatz in Ordnung, solange
der Rahmen sie nicht benutzt.

### 2.4 Klassen für den Aufgabentext im Protokoll

Bei einem Fehler schreibt der Rahmen den Text der Aufgabe ins Protokoll. Er liest ihn aus Elementen
mit diesen Klassen (`aufgabenText` in `spiel.js`): `auftrag`, `vorgabe`, `raetsel`, `bausteine`,
`zahl-gross`, `zahl-ziffern`, `rechnung`, `satz`, `wortkarte`, `lueckenwort`, `frage`, `ziel-zahl`,
`auf`, `sachtext`, `theke`, `familie`, `digital`. Den Text der Aufgabe stellt ein Spiel deshalb in
ein Element mit einer dieser Klassen, meist `frage` oder `auftrag`. Sonst ist der Eintrag in der
Statistik leer.

## 3. Farben

Die Werte stehen in `:root` in `stil.css`. Ein Spiel verwendet nur die Variablen, keine eigenen
Farbwerte für diese Zwecke.

| Variable | wofür | nie für |
|---|---|---|
| `--st-E`, `--st-Z`, `--st-H`, `--st-T`, `--st-ZT`, `--st-HT`, `--st-M`; Klassen `.st-E` … setzen `--f` | **nur Stellen** (Einer rot, Zehner blau, Hunderter grün, ab T wiederholt — wie Calcularis) | Dekoration, Körbe, Stufen |
| `--deko-1` … `--deko-7` | Spielkarten, Stufen, Körbe, Titel, Säulen und Linien in Grafiken | Stellen |
| `--gut`, `--gut-hell` | richtig, gelöst | — |
| `--hinweis`, `--hinweis-hell` | falsch, Hinweis, Zeit um | Strafe (es gibt keine) |
| `--text`, `--text-leise`, `--rand`, `--karte`, `--knopf`, `--schatten` | Grundgestaltung | — |

## 4. Programmierschnittstelle

### 4.1 Ein Spiel starten

```js
LS.spiel({
  id: "<id>",                     // wie Ordner und Katalog
  einleitung: "…",                // sagt die Eule im Startbild
  anzahl: 8,                      // Aufgaben je Runde
  stufen: { s1: "…", …, s6: "…" },// alle sechs Stufen mit kurzer Beschreibung ✔
  aufgabe(ctx) { … },             // zeichnet eine Aufgabe in ctx.flaeche
});
```

`?stufe=s1 … s6` startet eine Stufe direkt ✔. Was jede Stufe für die Basisklasse bedeutet, steht in
`CLAUDE.md` (Stufenskala).

### 4.2 Was `ctx` bietet

| | |
|---|---|
| `ctx.stufe`, `ctx.nr`, `ctx.flaeche` | Stufe (`s1`–`s6`), Nummer der Aufgabe, Fläche zum Zeichnen |
| `ctx.geordnet` | Bausteine geordnet zeigen? (Profil-Einstellung; nur Spiele mit `reihenfolge: true` im Katalog) |
| `ctx.richtig(lob?)` | Aufgabe gelöst |
| `ctx.falsch(hinweis, loesungText?)` | Fehlversuch. Der Hinweis darf die Lösung **nicht verraten** ✔. Mit `loesungText` zeigt der Rahmen nach dem dritten Fehlversuch die Lösung und einen Weiter-Knopf. Ohne ihn bleibt die Aufgabe offen; das Spiel hilft dann selbst (Zahlenmauer, Malkreuz). |
| `ctx.loesung(text)` | Lösung gleich beim Zeichnen nennen. Sie erscheint nur beim Testspieler hinter „🔑“. **Pflicht in jeder Aufgabe** ✔. Die Bausteine rufen sie selbst auf. Den Text in **eine** Konstante legen, die auch `ctx.falsch` bekommt. |
| `ctx.vorbei()` | Ist die Aufgabe gelöst oder aufgelöst? Dann nimmt sie keine Antwort mehr an. |
| `ctx.kennung(wert)` | Woran die Aufgabe zu erkennen ist, wenn man es nicht sieht (Hör-Aufgaben: die Melodie). Sonst nimmt der Rahmen Text, Bilder und Lösung. |
| `ctx.schritte(n)` | Die Aufgabe braucht n Handgriffe mehr: Tipps, Ziffern samt OK, Züge, so viele wie mindestens nötig sind. Aufrufe zählen zusammen. Die Bausteine zählen ihre selbst (`auswahl` und `koerbe` 1, `reihenfolge` je Teil 1); für die Tastatur `LS.tippSchritte(wert)`. **Pflicht in Endlos-Stufen** ✔, daraus folgt der Boden der Endlos-Zeit (Abschnitt 7). |
| `ctx.serie(name, wert)` | Ein zufällig gewähltes Merkmal, das das Kind als Muster erkennen kann: Richtung oder Aufgabenart, oder die richtige Antwort bei höchstens drei festen Antworten (ja/nein, <, =, >, auf/ab). **Serienbremse** (Vorgabe Patrik 2026-11-01): Der Rahmen zieht neu, statt dasselbe Merkmal öfter als `LS.SERIE_MAX` = 3-mal hintereinander zu stellen (bis zu 40 Versuche). Nicht für Zahlenwerte oder Knopfpositionen, und nur in Stufen, die wirklich mehrere Werte haben ✔. |
| `ctx.wartezeit(s)` | Die Aufgabe hält das Kind s Sekunden auf, ohne dass es etwas tun kann (gleich vorgespielte Töne). Zählt zum Boden der Endlos-Zeit. |
| `ctx.sag(text, art?)` | Die Eule spricht (`art`: `"gut"` oder `"hinweis"`). |

**Wiederholungen** (Vorgabe Patrik 2026-10-31): In einer Runde kommt höchstens eine Aufgabe ein
zweites Mal, nie direkt hintereinander. Der Rahmen zieht eine nicht erlaubte Aufgabe neu (das Spiel
zieht in `aufgabe()` zufällig). Gibt eine Stufe nicht genug verschiedene Aufgaben her, endet die Runde
früher; das Protokoll vermerkt dann `gekuerzt` mit der geplanten Anzahl, und das Testskript meldet es
als Hinweis.

Ausserhalb von `ctx`, für Spiele mit Inhaltslisten: `LS.freieListen("<id>")` liefert die Listen,
die der angemeldete Spieler üben darf. Die Aufsicht bekommt alle, ein Kind nur die freigegebenen
(Abschnitt 6).

### 4.3 Bausteine

Sie hängen ihre Teile an `ctx.flaeche` und rufen `ctx.richtig`, `ctx.falsch` und `ctx.loesung` selbst
auf. Die Optionen sind in `spiel.js` beschrieben.

| Baustein | wofür |
|---|---|
| `LS.auswahl(ctx, opt)` | genau eine richtige Antwort unter mehreren Knöpfen |
| `LS.reihenfolge(ctx, opt)` | Teile in der richtigen Reihenfolge antippen |
| `LS.koerbe(ctx, opt)` | Karte in den richtigen Korb (sie fliegt hinein) |
| `LS.tastatur(opt)` | Zifferntastatur mit Anzeigefeld; das Spiel prüft selbst in `onOk` |
| `NOTEN.zeile`, `NOTEN.hoerKnopf` | Notenbild und Hörknopf (`noten.js`) |

Hilfsfunktionen: `LS.el` (Element bauen), `LS.zahlText` (Schulschreibweise, „30 400“),
`LS.zerlege`, `LS.zufall`, `LS.waehle`, `LS.mische`, `LS.tippSchritte(wert)` (Handgriffe, um eine Zahl
einzutippen: je Ziffer einer, dazu OK).

### 4.4 Pflichtfunktionen für die Prüfung

Jedes Spiel definiert auf oberster Ebene:

- `aufgabeErzeugen(stufe)` liefert eine Aufgabe als Daten, ohne DOM.
- `pruefeAufgabe(aufgabe, stufe)` liefert eine Liste von Mängeln: Zahlenraum der Stufe, Lösung
  richtig, genau eine richtige Antwort, keine doppelten Optionen.

Das Testskript ruft beide je Stufe einige tausend Mal auf ✔.

## 5. Katalog und Doku

Ein neues Spiel braucht:
1. einen Eintrag in `SPIELE` in `katalog.js` (id, klasse, bild, name, thema, farbe `var(--deko-N)`,
   pfad, stufen, zeiten, beschreibung, lernziele; bei Inhaltslisten `listen`; `geprueft` erst nach
   der Prüfung, siehe Abschnitt 6);
2. Thema und Lernziele in `THEMEN` und `LERNZIELE`;
3. eine Zeile in `docs/lernziele/` mit den Lehrplan-Stufen je Spielstufe;
4. die Inhaltslisten in `tools/pruefliste_wortlisten.js`, danach die Prüfliste neu erzeugen. Neue
   Inhalte gelten als ungeprüft;
5. die Checkliste neu erzeugen: `node tools/checkliste.js > docs/checkliste.md`. Offene Annahmen in
   `docs/lernziele/` nennen das betroffene Spiel mit Namen, sonst findet die Checkliste sie nicht.

## 6. Anmeldung, Rollen und Freigabe

Entscheide Patrik L1 a bis L4 a, 2026-10-31.

**Rollen** (Profil-Feld `rolle`):
- **Kind:** meldet sich auf der Startseite ohne PIN an, sieht nur freigegebene Spiele und Inhalte
  und nur die eigene Statistik, sichert nur die eigenen Daten.
- **Aufsicht:** meldet sich mit einer PIN (4–6 Ziffern) an. Gespeichert werden nur Salz und
  SHA-256-Hash im Profil; beim Sichern wird beides weggelassen. Die Anmeldung gilt nur im
  geöffneten Browser-Tab (`sessionStorage`). Die Aufsicht
  - verwaltet Konten und Freigaben,
  - sieht alle Statistiken,
  - sichert alle oder einzelne Kinder und liest Dateien ein,
  - spielt als Tester: Ihre Runden tragen `test: true`, und im Spiel gibt es die Testhilfen.

  Frühere Testspieler (`test: true`) werden beim Lesen zur Aufsicht.

**Freigabe.** Der Prüfstand steht im Repo, die Freigabe gilt je Gerät. Standardmässig frei ist,
was nichts mehr zu prüfen hat (Präzisierung Patrik 2026-10-31).
- Ein neues Spiel trägt im Katalog `neu: "<Sitzung>"` und ist gesperrt, bis es angesehen ist:
  `geprueft: { am, von }`, das heisst auf Desktop, Tablet und Handy durchgespielt. Spiele ohne `neu`
  sind frei.
- Offene Annahmen zum Lehrmittel (`docs/lernziele/`) sperren nicht: Sie betreffen die Darstellung,
  nicht die fachliche Richtigkeit (Entscheid Patrik F1 a, 2026-10-31). Sie stehen in der Checkliste.
- Spiele mit Inhaltslisten tragen zusätzlich `listen: { <liste-id>: { name, geprueft } }`.
  - **Verweis:** Nutzt ein Spiel die Liste eines anderen (dieselben Wörter oder Sätze), steht dort nur
    `{ von: "<spiel>/<liste>" }`. Prüfstand und Freigabe gelten einmal, an der Quelle; die Verwaltung
    zeigt den Verweis ohne eigenen Schalter. Beispiele: Blitzlesen und Buchstaben-Zwillinge nutzen
    die Anlaut-Wörter der Anlaut-Angel, der Wörter-Trenner nutzt die Sätze der Satz-Reparatur.
  - **Zusatzliste:** `zusatz: true` heisst, die Liste ergibt allein keine Aufgabe, sondern kommt nur zu
    einer anderen dazu (fehlerfreie Sätze der Fehler-Lupe). Sie allein macht ein Spiel nicht sichtbar.
- Die Aufsicht gibt im Tab Verwaltung frei oder sperrt. Gespeichert wird das in
  `lernspiele:freigabe` = `{ spiele: { <id>: bool }, listen: { "<id>/<liste>": bool } }`. Ohne Eintrag
  entscheidet der Prüfstand.
- Ein Kind sieht ein Spiel, wenn es frei ist und, falls es Listen hat, mindestens eine Liste frei
  ist. Im Spiel kommen die Inhalte nur aus `LS.freieListen(id)`. Stufen ohne freie Inhalte bietet
  das Spiel nicht an.
- Öffnet ein Kind ein gesperrtes Spiel über die Adresse, zeigt der Rahmen „noch nicht freigegeben“.

**Startseite** (`index.html`, Code in `start/`): Ohne Anmeldung zeigt sie die Anmeldung, danach
die Tabs Spiele, Profil, Statistik und, nur für die Aufsicht, Verwaltung. Der Tab steht in der
Adresse (`#statistik`). `#anmelden` meldet ab und führt zur Anmeldung; dorthin verweist auch
„wechseln“ im Spiel. Auf jeder Spielkarte schalten ⏱ (Timer dieses Spiels, dieselbe Einstellung wie
im Spiel) und ♾ (Endlos, Profil-Feld `endlosAn`), was die Stufenknöpfe starten. Die Symbole sind als
SVG gezeichnet: aus als grauer Umriss, an in Gold wie der Favoriten-Stern. Ein Tipp auf eine freie
Stelle der Karte öffnet das Startbild des Spiels. Lernziel-Kürzel blenden beim Antippen ihren Klartext ein. Je Spieler speichert das Profil Favoriten, die Ansicht (`kacheln` oder
`kompakt`) und welche Gruppen zugeklappt sind (`zu`).

## 7. Endlos-Modus und Rekorde

Vorgabe Patrik 2026-10-31.
- **Ablauf:** Aufgaben, bis die erste falsch ist oder, mit Timer, die Zeit um ist. Gezählt werden die
  richtig gelösten. Im Startbild des Spiels unter den Stufen „♾ Endlos“, mit dem eigenen Rekord;
  direkt über `?stufe=s3&endlos=1`.
- **Welche Spiele:** Der Katalog nennt je Spiel die Stufen mit `endlos: [...]`. Ausgewählt sind
  Spiele ohne Inhaltslisten, die ihre Aufgaben berechnen, in Stufen mit mindestens 100 verschiedenen
  Aufgaben (gemessen in LERN_Session3). Bei Wortlisten wäre Endlos nur ein Durchlauf durch die Liste.
- **Wiederholungen:** keine der letzten 30 Aufgaben nochmal. Findet sich keine neue mehr, ist die
  Stufe „alles geschafft“.
- **Timer im Endlos-Modus** (Wunsch Patrik 2026-10-31; Boden und Verlauf: Entscheide F1 a und F2 a,
  LERN_Session4): Alle starten mit der Vorgabezeit der Stufe aus dem Katalog, ohne den persönlichen
  Faktor aus dem Profil. Die Zeit nähert sich einem **Boden je Aufgabe**: 1,2 s Grundzeit + 0,5 s je
  Handgriff (`ctx.schritte`) + Wartezeit (`ctx.wartezeit`). Nach jeder richtigen Aufgabe fallen 8 % der
  restlichen Spanne bis zum Boden weg: anfangs grosse Schritte, dann immer kleinere, ohne abrupten Halt
  (`ENDLOS_TEMPO` in `spiel.js`). Die Zeit erscheint auf eine Zehntelsekunde, unter 10 s mit Komma.
  Weil der Boden an der Aufgabe hängt, bekommt eine Aufgabe mit mehr Ziffern etwas mehr Zeit als ihre
  Vorgängerin. Grundzeit und Schrittzeit sind Annahmen, bis gemessene Zeiten von Kindern vorliegen; der
  Boden zählt Handgriffe, nicht Lese- und Denkzeit. Beispiele (Sekunden nach 10 / 20 / 50 Aufgaben):
  Einmaleins s3, 10 s Start, 3 Handgriffe: 5,9 / 4,1 / 2,8 · Baukasten s3, 25 s, 5 Handgriffe:
  13 / 7,7 / 4,0 · Zahlenmauer s6, 188 s, 33 Handgriffe: 92 / 50 / 20.
  In gewöhnlichen Runden bleibt die Zeit gleich, damit die Zeiten je Aufgabe in der Statistik
  vergleichbar bleiben (Entscheid Patrik Z1 a).
- **Speicher:** `lernspiele:rekorde` = `[{ name, zeit, spiel, stufe, timer, punkte, dauer, alles?,
  test?, hilfe?, abgebrochen? }]`, eine Zeile je Endlos-Runde, getrennt vom Protokoll. `timer` ist die Startzeit in
  Sekunden oder `null`. Je Stufe gibt es zwei Ranglisten: ohne und mit Timer.
  Gespeichert wird, sobald die Runde vorbei ist (Fehler, Zeit um, alles geschafft), nicht erst beim
  Antippen von „Zum Ergebnis“ (Meldung Patrik, LERN_Session4). Verlässt das Kind die Seite mitten in
  der Serie (Zurück-Pfeil, Tab zu: `pagehide`; Tablet aus, App gewechselt: `visibilitychange`), zählt
  die Serie bis dahin mit `abgebrochen: true` (Entscheid Patrik E1 a). Kommt es zurück und spielt
  weiter, ersetzt der nächste Stand diesen Zwischenstand. Eine Serie ohne richtige Aufgabe gibt keinen
  Eintrag.
  Sichern, Einlesen und Löschen behandeln die Rekorde wie das Protokoll.
- **Rangliste:** bester Wert je Kind, ohne Testrunden und ohne Aufsicht. Am Ende einer Endlos-Runde
  die ersten zehn, im Startbild des Spiels unter den Stufen die vollständigen Ranglisten beider
  Varianten je Endlos-Stufe, in der Statistik der Platz („2. von 3“).
- **Später, noch Idee:** eine Online-Rangliste, bei der die Aufsicht das Gerät anmeldet und
  Wettbewerbe nach Alter, Klasse und Region erscheinen. Das Speicherformat ist dafür geeignet. Heute
  bleibt alles lokal.

## 8. Was das Testskript dazu prüft

`node tools/pruefe_spiele.js [ids] [--seed=N]` prüft:
- jede Stufe lädt und lässt sich durchspielen;
- kein NaN, undefined oder null im sichtbaren Text;
- die Generatoren mit `pruefeAufgabe`;
- Hinweise, die die Lösung verraten;
- `ctx.loesung` in jeder Aufgabe;
- die Testhilfen;
- reservierte Klassen im eigenen Stil;
- jedes Spiel mit Inhaltslisten als Kind, mit je einer freigegebenen Liste: Es gibt mindestens eine
  Stufe, und keine Stufe läuft leer;
- Wiederholungen je Runde;
- jedes Spiel mit Endlos-Stufen im Endlos-Modus (`--endlos=0` schaltet ab): jede Aufgabe nennt ihre
  Handgriffe (`ctx.schritte`), und keine wird mit weniger Klicks gelöst, als sie nennt. Die Übersicht
  zeigt je Stufe die kleinste und grösste Zahl Handgriffe der gestellten Aufgaben, z. B. `s3:3 [2–3]`.
  Ist eine Endlos-Runde vorbei, muss ihr Rekord schon gespeichert sein, bevor „Zum Ergebnis“ angetippt wird.
  Einmal je Stufe stellt der Test das Verlassen mitten in der Serie nach (`pagehide`): Es muss ein
  Zwischenstand mit der Serie entstehen, und am Ende der Runde darf er nicht stehen bleiben.
- die Serienbremse: Kein Merkmal aus `ctx.serie` kommt öfter als `LS.SERIE_MAX`-mal hintereinander
  (Fehler). Musste der Rahmen nach 40 Versuchen aufgeben, meldet der Test einen Hinweis: Die Stufe hat
  dann wohl nur diesen Wert, und `ctx.serie` gehört dort weg.
- jedes Spiel im Zufallsmix (Abschnitt 9; `--mix=0` schaltet ab), Stufe 3 mit Timer und, falls es
  Endlos-Stufen hat, die erste davon im Endlos-Mix: Das Spiel meldet „bereit“, zeichnet erst auf
  „aufgabe“ hin, meldet je Aufgabe genau ein vollständiges Ergebnis, bleibt danach still und schreibt
  weder Protokoll noch Rekord selbst. Die Übersicht zeigt `s3:10 s1♾:1` (gemeldete Ergebnisse).

**Nicht geprüft** wird das Aussehen. Das heisst: Desktop, Tablet (768 px) und Handy (375 px) im
Browser ansehen.

## 9. Zufallsmix

Entscheid M1 a (LERN_Session5, 2026-11-01). `mix.html` mit `mix/mix.js` mischt Aufgaben aus bis zu
sechs Spielen in einer Runde (10 oder 20 Aufgaben) oder einer Endlos-Serie. Einstellbar sind:
- Fächer, dazu Fokus;
- Stufe: „passend für mich“ = empfohlene Stufe je Spiel, sonst 3; oder eine feste Stufe;
- Timer an oder aus;
- Länge;
- Wechsel nach jeder oder nach drei Aufgaben.

Die Einstellungen stehen im Profil (`mix`). Teil des Mix ist jedes Spiel, das das Kind sehen darf und
das die Stufe anbietet; im Endlos-Mix nur Stufen mit `endlos` im Katalog.

- **Bauweise:** Jedes Spiel läuft unverändert in einem eigenen iframe (`?stufe=…&mix=1&timer=0|1`,
  dazu `&endlos=1`). Mit `mix=1` blendet der Rahmen Kopfzeile und Fortschritt aus (`body.im-mix`) und
  stellt eine Aufgabe nur, wenn der Mix sie verlangt. Serie, Wechsel, Ende, Protokoll und Rekord führt
  allein `mix.js`. Wiederholungen und Serienbremse gelten je Spiel weiter, weil jedes iframe seine
  Runde behält.
- **Nachrichten** (`postMessage`, `{ lern: "mix", typ, … }`; angenommen nur vom eigenen iframe bzw.
  von `parent`):

  | Richtung | typ | Inhalt |
  |---|---|---|
  | Spiel → Mix | `bereit` | geladen, wartet auf die erste Aufgabe |
  | Spiel → Mix | `ergebnis` | `zeit` (Eintrag wie `aufgabenZeiten`), `fehler`, `hilfen`, `fehlerAufgabe` oder null |
  | Spiel → Mix | `erschoepft` | keine neue Aufgabe mehr (Wiederholungsregel) |
  | Spiel → Mix | `geht-nicht` | Stufe nicht angeboten, nicht frei oder keine Stimme |
  | Mix → Spiel | `aufgabe` | `geschafft`: Serie über alle Spiele, für die knapper werdende Endlos-Zeit |
  | Mix → Spiel | `ton` | `an`: Ton-Schalter der Mix-Seite |

- **Endlos-Mix:** Endet beim ersten Fehler oder bei „Zeit um“; das Spiel zeigt die Lösung und
  „Weiter ➜“. Die Zeit startet bei der Vorgabezeit des jeweiligen Spiels und nähert sich wie in
  Abschnitt 7 dem Boden der Aufgabe. Gezählt wird dabei die Serie des Mix.
- **Speicher:**
  - Runde: je gespieltes Spiel ein Protokolleintrag mit `mix: "<Auswahl>"` und `sterne: null`, weil
    Sterne für ganze Runden eines Spiels gelten. Die Aufgaben zählen damit für die Lernziele.
  - Endlos: ein Rekord unter `spiel: "mix:<Auswahl>"`, mit `stufe` (`s1`–`s6` oder `passend`),
    `timer: true` oder null und `spiele: [ids]`.
  - `<Auswahl>` ist `alle`, sonst `fokus` und/oder Fächer mit `+`. Ranglisten vergleichen so nur
    gleiche Mischungen.
  - Verlassen mitten in der Runde zählt bis dahin (`abgebrochen`, wie E1 a).
- **Unter `file://`** geprüft am 2026-11-01 in Chrome und Edge (headless): `postMessage`, gemeinsamer
  `localStorage` und `sessionStorage` (Aufsicht) und die Adresse im iframe funktionieren. Ungeprüft:
  Safari/iPad und Firefox.
