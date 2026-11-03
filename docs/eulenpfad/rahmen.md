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

Pfade gelten relativ zum App-Ordner `eulenpfad/` (Entscheid P1 a); die Werkzeuge liegen in `tools/`
der Repo-Wurzel.

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
| Eule | `eule`, `eule-zeile`, `blase`, `vorlesen` | Eule mit Sprechblase und Vorlese-Knopf 🔊 (Abschnitt 12) |
| Runde | `fortschritt`, `zeitleiste`, `zeitbalken`, `testhilfe` | Punkte je Aufgabe, Timer, Testhilfen |
| Sterne | `sterne`, `sterne-klein`, `aus`, `konfetti`, `flug` | Belohnung und Animation |
| Angemeldet | `spieler-zeile` | „Du spielst als …“ im Startbild; angemeldet wird auf der Startseite |
| Stufenwahl | `stufen`, `stufe`, `fuer`, `timer-zeile`, `timer-schalter`, `option-zeile`, `option-schalter`, `leise` |
| Entwickler-Modus | `entwickler-leiste`, `entwickler-feld` | Leiste unten im Spiel (Abschnitt 11) | Startbild des Spiels |

**Erlaubt:** reservierte Klassen eingeschachtelt in einer eigenen Klasse. `.uhr .mitte` trifft nur
die Uhr. `.knopf` darf ein Spiel als Klasse an eigene Knöpfe hängen, aber nicht umgestalten.

### 2.2 Klassen der Bausteine — anpassbar

Diese Klassen gehören zu den Bausteinen (Abschnitt 4). Ein Spiel darf sie im eigenen Stil anpassen,
zum Beispiel grössere Wahlknöpfe. Die Liste steht in `LS.RAHMEN_KLASSEN.bausteine`.

| Baustein | Klassen |
|---|---|
| `LS.auswahl`, `LS.reihenfolge` | `wahl`, `wahl-knopf`, `bild`, `ablage`, `pfeil` |
| `LS.koerbe` | `korb-karte`, `korb-reihe`, `korb-knopf` |
| `LS.tastatur` | `tastatur`, `anzeige`, `ok`, `loeschen`, `zeichen` (Dezimalzeichen) |
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
  hilfe: "…",                     // „❓ So geht das Spiel“: Bedienung dieses Spiels (oder stufe => Text), Abschnitt 14
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
| `ctx.geordnet` | Bausteine geordnet zeigen? Nur Spiele mit `reihenfolge: true` im Katalog. Eingestellt auf der Stufenwahl (Schalter „🔀 Teile“, Entscheid R1 a) oder im Profil; die Wahl je Spiel schlägt die globale, „nach Stufe“ heisst Stufe 1–3 geordnet. Im Zufallsmix gilt dieselbe Einstellung. |
| `ctx.option(id)` | Wert einer **Spieloption** (Entscheid UE1 a). Ein Spiel beschreibt sie in `def.optionen = { <id>: { titel, werte: { stufe: "nach Stufe", …: Text }, erklaerung: { <wert>: Text }, nachStufe(stufe) → Wert } }`; der Rahmen zeigt je Option einen Schalter auf der Stufenwahl (`option-zeile`), speichert die Wahl je Spieler und Spiel (Profil `optionen`) und schreibt sie ins Protokoll. „nach Stufe“ ist schon aufgelöst. Beispiel: Schriftlich-Werkstatt, `uebertrag`: `zeigen` oder `selbst`. |
| `ctx.richtig(lob?)` | Aufgabe gelöst |
| `ctx.falsch(hinweis, loesungText?)` | Fehlversuch. Der Hinweis darf die Lösung **nicht verraten** ✔. Mit `loesungText` zeigt der Rahmen nach dem dritten Fehlversuch die Lösung und einen Weiter-Knopf. Ohne ihn bleibt die Aufgabe offen; das Spiel hilft dann selbst (Zahlenmauer, Malkreuz). |
| `ctx.loesung(text)` | Lösung gleich beim Zeichnen nennen. Sie erscheint nur beim Testspieler hinter „🔑“. **Pflicht in jeder Aufgabe** ✔. Die Bausteine rufen sie selbst auf. Den Text in **eine** Konstante legen, die auch `ctx.falsch` bekommt. |
| `ctx.vorbei()` | Ist die Aufgabe gelöst oder aufgelöst? Dann nimmt sie keine Antwort mehr an. |
| `ctx.kennung(wert)` | Woran die Aufgabe zu erkennen ist, wenn man es nicht sieht (Hör-Aufgaben: die Melodie). Sonst nimmt der Rahmen Text, Bilder und Lösung. |
| `ctx.schritte(n)` | Die Aufgabe braucht n Handgriffe mehr: Tipps, Ziffern samt OK, Züge, so viele wie mindestens nötig sind. Aufrufe zählen zusammen. Die Bausteine zählen ihre selbst (`auswahl` und `koerbe` 1, `reihenfolge` je Teil 1); für die Tastatur `LS.tippSchritte(wert)`. **Pflicht in Endlos-Stufen** ✔, daraus folgt der Boden der Endlos-Zeit (Abschnitt 7). |
| `ctx.serie(name, wert)` | Ein zufällig gewähltes Merkmal, das das Kind als Muster erkennen kann: Richtung oder Aufgabenart, oder die richtige Antwort bei höchstens drei festen Antworten (ja/nein, <, =, >, auf/ab). **Serienbremse** (Vorgabe Patrik 2026-11-01): Der Rahmen zieht neu, statt dasselbe Merkmal öfter als `LS.SERIE_MAX` = 3-mal hintereinander zu stellen (bis zu 40 Versuche). Nicht für Zahlenwerte oder Knopfpositionen, und nur in Stufen, die wirklich mehrere Werte haben ✔. |
| `ctx.vorgehen(art, wert)` | Wie das Kind die Aufgabe angegangen ist, vor `ctx.richtig()` gemeldet (LERN_Session7). Landet in `aufgabenZeiten[i].vorgehen` und in der Statistik, Karte „Vorgehen“ (Punkte der letzten 12 Aufgaben). Arten und Werte (vom besten zum schwächsten, Ton gut/mittel/schwach) stehen in `AUSWERTUNG.VORGEHEN`: `systematik` (Möglichkeiten-Finder: Zählwerk, geordnet, kreuz und quer, mit Hilfe), `teilerpaare` (Teiler-Spürnase: in Paaren, der Grösse nach, durcheinander), `ausgleichen` (Mittelwert-Türme: ohne Umweg, mit Umwegen). |
| `ctx.wartezeit(s)` | Die Aufgabe hält das Kind s Sekunden auf, ohne dass es etwas tun kann (gleich vorgespielte Töne). Uhr und Zeitmessung beginnen so viel später (Entscheide F1 a, F2 a, LERN_Session9). |
| `ctx.tipp(texte)` | Gestufte Tipps zur Aufgabe (Text oder Liste), vom Anstoss zum Konkreten; nie die Lösung (das Testskript prüft es wie Hinweise). Beim Zeichnen rufen. Das Kind holt sie mit „💡 Tipp“ einzeln; ein Tipp zählt für die Sterne wie ein halber Fehler, „auf Anhieb“ heisst ohne Tipp; im Endlos-Modus keine Tipps (Abschnitt 14). |
| `ctx.uhrWarten()` | Uhr und Zeitmessung beginnen erst, wenn die zurückgegebene Funktion gerufen wird: Jetzt kann das Kind antworten. Beim Zeichnen rufen. Für eine Stimme, die gleich vorspricht: `LS.sprich(text, sprache, "", ctx.uhrWarten())` (die Uhr startet, wenn die Stimme fertig ist, ohne Stimme sofort). `LS.losGehts` nutzt es selbst. **Regel** (F1 a, F2 a): Die Uhr läuft nie, solange das Kind nur warten kann — „▶ Los!“, 3-2-1, Zeigen, Vorspielen. |
| `ctx.losKnopf` | Für `LS.losGehts`: „▶ Los!“ mit 3-2-1 (erste Aufgabe, nach einer Aufgabe mit Fehler oder Zeit um, im Mix) oder nur kurz 👀 (LERN-38). |
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
| `LS.losGehts(ctx, element, weiter, { uhr })` | Für Aufgaben, die etwas nur kurz zeigen (einprägen, aufblitzen): element bleibt verdeckt. Bei der ersten Aufgabe einer Runde, nach einer Aufgabe mit Fehler und im Mix darüber „▶ Los!“, nach dem Tippen 3-2-1; sonst nur 1 s 👀 (`ctx.losKnopf`, LERN-38). Dann sichtbar, und `weiter(uhrLos)` startet die Zeigezeit. Mit und ohne Timer gleich: Die Uhr startet nach `weiter()`, mit `{ uhr: false }` erst, wenn das Spiel `uhrLos()` ruft (Merk-Blick: mit dem veränderten Bild). Benutzt von Merk-Blick, Punkte-Blitz, Blitzlesen, Finger-Zähler (Wunsch Patrik, LERN_Session8) |
| `LS.tastatur(opt)` | Zifferntastatur mit Anzeigefeld; das Spiel prüft selbst in `onOk`. Mit `dezimal: true` eine Taste für das eingestellte Dezimalzeichen (auch `.` und `,` auf der Tastatur), `nachkomma` begrenzt die Ziffern danach (Standard 3); `onOk(wert, text)` bekommt die Zahl und den getippten Text mit „.“, wenn die Stellenzahl zählt („3.0“ beim Runden) (LERN_Session8, LERN-36) |
| `NOTEN.zeile`, `NOTEN.hoerKnopf` | Notenbild und Hörknopf (`noten.js`) |

Hilfsfunktionen: `LS.el` (Element bauen), `LS.zahlText` (Schulschreibweise, „30 400“),
`LS.zerlege`, `LS.zufall`, `LS.waehle`, `LS.mische`, `LS.tippSchritte(wert)` (Handgriffe, um eine Zahl
einzutippen: je Ziffer und Dezimalzeichen einer, dazu OK; die Null in „0.5“ setzt die Tastatur selbst; `tippSchritte(wert, stellen)` für eine feste Stellenzahl wie „3.0“).

**Dezimalzahlen** schreibt ein Spiel nur mit `LS.dezimalText(x, stellen?)` („30 400.5“ oder
„30 400,5“), **Geldbeträge** nur mit `LS.geldText(rappen)` (Entscheid C1 a): bis zur 3. Klasse
„25 Fr. 60 Rp.“, ab der 4. Klasse „25.60 Fr.“; massgebend ist die Klasse der laufenden Stufe
(`LS.klasseDerStufe`, Königsstufe wie Stufe 5), ganze Franken immer „13 Fr.“. Das Dezimalzeichen
stellt die Aufsicht in der Verwaltung ein (Untertab Einstellungen, Standard Punkt wie im Lehrplan):
global und je Spiel („wie global“, Punkt, Komma). Ein Spiel, das die Einstellung nutzt, trägt im
Katalog `einstellungen: ["dezimal"]`; nur diese Spiele erscheinen unter „Je Spiel“.
`LS.einstellung(name)` liest im Spiel den Wert des Spiels, sonst den globalen, sonst den Standard.
Später setzt eine Lehrperson sie je Klasse ([konzept_klasseneinstellungen.md](konzept_klasseneinstellungen.md)).

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

**Freigabe.** Der Prüfstand steht im Repo (`spiele/gemeinsam/pruefstand.js`, gesetzt im
Entwickler-Modus, Abschnitt 11), die Freigabe gilt je Gerät. Standardmässig frei ist, was nichts mehr
zu prüfen hat (Präzisierung Patrik 2026-10-31).
- Ein neues Spiel trägt im Katalog `neu: "<Sitzung>"` und ist gesperrt, bis es angesehen ist:
  `PRUEFSTAND.spiele[<id>] = { am, von }`, das heisst auf Desktop, Tablet und Handy durchgespielt.
  Spiele ohne `neu` sind frei.
- Offene Annahmen zum Lehrmittel (`docs/lernziele/`) sperren nicht: Sie betreffen die Darstellung,
  nicht die fachliche Richtigkeit (Entscheid Patrik F1 a, 2026-10-31). Sie stehen in der Checkliste.
- Spiele mit Inhaltslisten tragen zusätzlich `listen: { <liste-id>: { name } }`; geprüft ist eine Liste
  mit `PRUEFSTAND.listen["<spiel>/<liste>"] = { am, von }`.
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

**Fazit in der Statistik** (Wunsch Patrik, LERN_Session9; `AUSWERTUNG.fazit` in `spiele/gemeinsam/auswertung.js`,
Karte oben im Tab Statistik, nur für die Aufsicht): ein Urteil in Worten, **regelbasiert, ohne KI** — jede
Aussage nennt ihre Zahlen, bei zu wenig Daten schweigt eine Regel, alles bleibt im Browser (LERN-5 b).
Grenzen in `AUSWERTUNG.FAZIT` (Annahmen bis zu Erfahrungen mit Kindern). Abschnitte:
- **Menge:** Runden, Aufgaben, Minuten, Übungstage (14 Tage), Verteilung auf Fächer, einseitig ab 75 %.
- **Qualität:** auf Anhieb richtig, Lösung gezeigt; Fortschritt **nur im selben Spiel und derselben Stufe**
  (frühere gegen neuere Hälfte) — ein Wechsel zu schwereren Spielen ist kein Rückschritt; Niveau der Stufen
  gegen die Klasse im Profil.
- **Konzentration:** Befunde aus `konzentration()` (seit LERN_Session9 gemessen am eigenen Schnitt im selben
  Spiel und derselben Stufe), dazu mit Timer oder im Zufallsmix deutlich schwächer.
- **Stärken und Schwächen** je Thema (Katalog `THEMEN`), erst ab 12 Aufgaben in 2 Runden; stark ab 85 %
  und über dem eigenen Schnitt, schwach unter 60 % oder 15 Punkte unter dem Schnitt.
- **Auffälligkeiten:** (a) ein Thema weicht vom Rest seines Fachs um 20 Punkte ab („in Mathe sonst sicher,
  aber Brüche“; die Gegenrichtung nur, wenn der Rest aus mindestens zwei Themen besteht); (b) über Fächer
  hinweg, fachlich begründet: Lesen, Sachrechnen und Rechnen (`BEREICHE`) — Sachaufgaben schwach und Lesen
  schwach, Lesen schwach aber Sachaufgaben gut, Lesen gut aber Sachaufgaben schwach; Zuhören besser als
  Lesen; (c) Zusammenhänge mit Tageszeit und Pause **je Sitzung**, mit der Runde in der Sitzung je Runde,
  jeweils mit der Leistung gegenüber dem eigenen Schnitt im selben Spiel und derselben Stufe; erwähnt nur ab
  12 Einheiten und |r| ≥ max(0.35, 2/√n), mit dem Satz „ein Zusammenhang, noch keine Ursache“.

**Startseite** (`index.html`, Code in `start/`): Ohne Anmeldung zeigt sie die Anmeldung, danach
die Tabs Spiele, Profil, Statistik und, nur für die Aufsicht, Verwaltung mit den Untertabs Konten,
Freigabe, Abgleich, Einstellungen (für alle auf diesem Gerät, „↺ Alles auf Standard“) und Entwicklung. Der Tab steht in der Adresse (`#statistik`, Untertab `#verwaltung/abgleich`;
ohne Untertab Konten). `#anmelden` meldet ab und führt zur Anmeldung; dorthin verweist auch
„wechseln“ im Spiel. Die **Suche** im Tab Spiele und in der Freigabe (Entscheid SU1 a, `LS.suche`) ordnet
nach Relevanz: Feldgewichte Name 6, Lernziel-Kürzel 4, Beschreibung 3, Inhaltslisten 2, Thema 1;
Wortanfang vor Wortteil, genaue Umlaute vor ä = a; ein Tippfehler nur im Namen ab 5 Buchstaben und nie bei
Kürzeln mit Ziffern; jedes Suchwort muss passen. Während einer Suche steht statt der Gruppen eine Liste,
beste Treffer zuerst; wer nur über Thema oder Inhaltsliste passt, trägt „🔍 gefunden …“. **Persönliche Passung**
(Wunsch Patrik, LERN_Session10): Für ein angemeldetes Kind rechnet `LS.passung` aus der Nähe der Basisklasse zu
seiner Klasse (gleich 1, eine daneben 0.6, zwei 0.2) und dem Bedarf aus dem Protokoll (`AUSWERTUNG.bedarf` in der
empfohlenen Stufe, auf 5 gedeckelt) einen Wert 0–1; die Suche nimmt ihn als Faktor 1 + 0.5 · Passung auf die
Textrelevanz, der Text bleibt also massgebend. Die Aufsicht und das Testskript suchen neutral. **Ähnliche Spiele:**
`LS.aehnlich(id, person)` ordnet nach gleichem Lernziel (4 je Code) und gleichem Thema (3), gleiches Fach zählt 1 dazu (allein reicht es nicht), je Basisklasse
Abstand 0.5 Abzug, mit derselben Passung; der Knopf „🔗 Ähnliche Spiele“ auf dem Startblatt und der Schlusskarte
jedes Spiels öffnet `index.html?aehnlich=<id>#spiele`, die Startseite zeigt die Liste wie eine Suche (mit „🔗 gleiches
Lernziel …“ an der Karte), „✕ Alle Spiele“ oder eine Eingabe im Suchfeld beendet sie. Der Filter „🎒 Meine Klasse“ (Entscheide K1 a, K2 a) zeigt einem Kind mit
Klasse im Profil nur Spiele, deren Basisklasse höchstens eine Klasse daneben liegt, die also eine
Stufe genau für seine Klasse haben. Er ist vorgegeben an, das Kind darf ihn ausschalten (Profil-Feld
`meineKlasse`); er ordnet nur die Anzeige, sichtbar macht weiterhin die Freigabe. Er steht mit „⭐ Mein Fokus“ und
„🔍 Zu prüfen“ in einer eigenen Zeile **Nur** unter den Fächern, weil er kein Fach ist (Hinweis Patrik, LERN_Session10).
**Thema, Stufe und Klasse sind Mehrfachwahl** (Wunsch Patrik, LERN_Session10): jeder Chip schaltet einzeln, leer heisst keine
Einschränkung; „Alle“ wählt alle an und, nochmals angetippt, alle ab. Die Zeile **Klasse** filtert nach der Basisklasse
des Spiels (1.–6. Klasse) und steht allen offen, gedacht vor allem für die Aufsicht; „🎒 Meine Klasse“ bleibt die
Abkürzung des Kindes. Bei genau einer Stufe zeigen die Karten den
grossen Knopf „Stufe n spielen“, bei mehreren nur die gewählten Stufen. Gespeichert wird der Filter je Browser
(`lernspiele:filter`, Listen von Ids; ältere Speicherungen mit einem Wert werden umgedeutet). Unter dem Filter stehen
zwei Karten im Aufbau der Spielkarten, ohne Thema: **🎲 Zufallsmix** (öffnet die Mix-Seite) und **🎯 Zufälliges Spiel**
(je Stufe ein Knopf; zieht aus der gefilterten Auswahl, gewichtet nach Bedarf aus dem Protokoll des Kindes: wackelnde
Runden hoch, nie gespielt mittel, kürzlich sicher niedrig, sicher aber über sieben Tage her wieder mittel, Fokus-Lernziel
doppelt — `AUSWERTUNG.bedarf` und `AUSWERTUNG.ziehe` in `auswertung.js`, dieselbe Gewichtung wie im Zufallsmix). Auf jeder Spielkarte schalten ⏱ (Timer dieses Spiels, dieselbe Einstellung wie
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
  Handgriff (`ctx.schritte`); Wartezeit zählt nicht dazu, weil die Uhr erst danach startet (`ctx.wartezeit`,
  `ctx.uhrWarten`, LERN_Session9). Nach jeder richtigen Aufgabe fallen 8 % der
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
- zehn feste Beispielsuchen mit erwarteten Treffern, Reihenfolge und Grund (`suche` als id: nur diese);
- Hinweis „Einzahl?“, wenn im sichtbaren Text die Zahl 1 bei einem Verb in der Mehrzahl steht („1 werden
  gegessen“, „Es kommen 1 dazu“, „1 Stück kosten“) — zum Nachsehen, kein Fehler;
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
sechs Spielen in einer Runde (10 oder 20 Aufgaben) oder einer Endlos-Serie. Die Spiele der Runde werden
**nach Bedarf gezogen** (Wunsch Patrik, LERN_Session10): `AUSWERTUNG.bedarf` gewichtet je Spiel und Stufe nach dem
Protokoll des Kindes (wackelnd hoch, nie gespielt mittel, kürzlich sicher niedrig, Fokus doppelt), `AUSWERTUNG.ziehe`
zieht ohne Zurücklegen; nur der Übertritts-Check bleibt eine gleichmässige Stichprobe. Einstellbar sind:
- Fächer, dazu Fokus;
- Stufe: „passend für mich“ = empfohlene Stufe je Spiel, sonst 3; oder eine feste Stufe;
- Timer an oder aus;
- Länge;
- Wechsel nach jeder oder nach drei Aufgaben.

Die Einstellungen stehen im Profil (`mix`). Teil des Mix ist jedes Spiel, das das Kind sehen darf und
das die Stufe anbietet; im Endlos-Mix nur Stufen mit `endlos` im Katalog.

- **Übertritts-Check 6. Klasse** (Entscheid H1 a, LERN_Session9; `UEBERTRITT` in `mix.js`): Mischung
  „🎒 Übertritts-Check“ statt „frei“. Fächer und Stufe stehen dann fest: alle sichtbaren Spiele in
  Mathematik und Deutsch, die die 6. Klasse üben — Basisklasse 6 in Stufe 3, Basisklasse 5 in Stufe 5.
  Grund: Beim Übertritt in die Oberstufe zählen in den gelesenen Kantonen Mathematik und Deutsch
  (`docs/eulenpfad/spielideen/lehrplan_3_und_6.md`, Abschnitt 2). Bis zu acht Spiele je Runde. Am
  Schluss statt der Liste je Spiel ein **Bericht je Thema**: auf Anhieb richtig, „✅ sitzt“ ab 80 %,
  „🙂 fast“ ab 50 %, sonst „💪 üben“ (Grenzen sind Annahmen); die Eule nennt die Themen zum Üben.
  Auswahl-Kennung `uebertritt-6` (Protokoll `mix`, Rekord `mix:uebertritt-6`).

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

## 10. Abgleich zwischen Geräten

Entscheid Patrik S1 a, 2026-11-01 (LERN_Session6). Ziel: Endlos-Ranglisten und Statistik sind auf
jedem Gerät im Haushalt vollständig. Code in `spiele/gemeinsam/abgleich.js` (`LS.abgleich`), jede
Seite lädt es direkt nach `spiel.js`.

- **Ordner:** Die Aufsicht wählt in der Verwaltung auf jedem Gerät denselben Ordner (Netzwerkordner
  oder Ordner eines Cloud-Dienstes). Der Browser merkt sich den Zugriff in IndexedDB (`lernspiele`,
  Speicher `abgleich`). Das geht nur mit File System Access, heute Chrome und Edge auf dem Computer.
- **Je Gerät eine Datei** `lernspiele-sync-<id>.json` (Kennung und Name in `lernspiele:geraet`).
  Jedes Gerät schreibt nur seine eigene; zwei Geräte überschreiben sich also nie.
- **Wann:** Beim Öffnen jeder Seite und wenn sie wieder in den Vordergrund kommt, liest das Gerät die
  Dateien der anderen und schreibt dann die eigene. Nach jeder Änderung an geteilten Daten (Profile,
  Runden, Rekorde, Freigabe, Löschvermerke) schreibt es die eigene Datei nach 1,5 s nach. Im iframe
  des Zufallsmix gleicht nur die Mix-Seite ab. Kam etwas dazu, meldet `lernspiele:abgeglichen` es der
  Seite; Startseite und Stufenwahl zeichnen sich neu.
- **Erlaubnis:** Will der Browser vor dem Zugriff fragen, steht oben auf der Startseite „🔄 Abgleichen“
  — fragen darf er nur nach einem Tippen.
- **Ohne Ordner** (iPad, Android, Firefox): dieselben Daten als Datei sichern und auf dem anderen Gerät
  einlesen (Verwaltung oder Statistik).
- **Zusammenführen** (`LS.zusammenfuehren`, auch beim Einlesen):
  - Runden: gleiche Runde (Kind, Zeit, Spiel, Stufe) zählt einmal.
  - Rekorde: ebenso, bei gleicher Runde gilt der höhere Stand (Zwischenstand → Endstand).
  - Profile: je Feld der jüngere Zeitstempel (`geaendert`); ältere Profile ohne Zeitstempel bleiben,
    wie sie sind. Die PIN reist nie mit.
  - Löschen: `lernspiele:geloescht` hält Vermerke für gelöschte Kinder und zurückgesetzte Runden.
    Ein Vermerk entfernt auf allen Geräten, was bis zu seinem Zeitpunkt entstand; danach neu Angelegtes
    bleibt.
  - Freigabe: die des Geräts mit dem jüngsten `lernspiele:freigabeStand`.
- **Geprüft** am 2026-11-01 auf localhost mit dem Browser-eigenen Dateispeicher (OPFS) als Ordner:
  zwei bzw. drei Geräte, Zwischen- und Endstand, Löschen und neu Anlegen, Freigabe, Neuzeichnen der
  Rangliste. Ungeprüft: `file://`, echte Netzwerk- und Cloud-Ordner, Uhren, die zwischen Geräten
  abweichen (LERN-31).

## 11. Entwickler-Modus

Entscheide Patrik E1 a, E2 a, E3 a, 2026-11-01 (LERN_Session6). Code in `spiele/gemeinsam/entwicklung.js`
(`LS.entwicklung`) und `tools/entwickler_server.py`.

- **Nur lokal:** Er funktioniert nur im lokalen Repo mit laufendem Entwickler-Server
  (`python tools/entwickler_server.py`, dann `http://localhost:8765/eulenpfad/`). Der Server liefert das
  Repo aus wie `http.server` (ohne Zwischenspeicher, ohne `entwickler.key` und `.git`) und schreibt nur
  zwei Dateien: `spiele/gemeinsam/pruefstand.js` und `docs/eulenpfad/bemerkungen.json`.
- **Schlüssel:** Im Klartext nur in `entwickler.key` in der Repo-Wurzel (von Git ausgeschlossen); in
  `entwicklung.js` steht nur `SCHLUESSEL_HASH` (SHA-256 mit Salz). Die Aufsicht schaltet unter Verwaltung →
  Entwicklung je Gerät frei (`lernspiele:entwickler`, nicht abgeglichen); der Server prüft den Schlüssel
  bei jedem Schreiben noch einmal. Neuer Schlüssel: `python tools/entwickler_server.py --neuer-schluessel`.
- **Zusätze**, eingeschaltet über einen eigenen Schalter, nur für die angemeldete Aufsicht:
  - in jedem Spiel eine Leiste unten (`entwickler-leiste`): „✓ Spiel angesehen“ und „📝 Bemerkung“ mit
    Spiel, Stufe und laufender Aufgabe (`LS.spielStand()`), ob Kinder das Spiel sehen (`LS.sperrGrund`), und
    aufklappbar die Inhaltslisten des Spiels, je mit „ansehen“ und „✓ geprüft“ (`entwickler-listen`);
  - in der Freigabe je Spiel „✓ angesehen“, je Liste „✓ geprüft“ und „ansehen“: die Einträge der Liste
    aus `docs/eulenpfad/pruefung/listen.json` (vom Prüflisten-Generator), je Eintrag eine Bemerkung;
  - unter Verwaltung → Entwicklung alle Bemerkungen, offene zuerst.
- **Ohne Server** bleiben die Knöpfe sichtbar und melden „Entwickler-Server nicht gefunden“ samt Startbefehl.
  Antwortet auf der Adresse ein anderer Server (etwa ein altes `python -m http.server`), melden sie das.
- **Port allein:** Unter Windows teilen sich Python-Server sonst still denselben Port, und Anfragen landen
  zufällig beim falschen. Der Entwickler-Server belegt den Port deshalb exklusiv und bricht ab, wenn er
  schon belegt ist (`python tools/entwickler_server.py 8770` für einen anderen Port).
- **Bemerkungen** (`docs/eulenpfad/bemerkungen.json`): `{ nr, zeit, status: "offen" | "erledigt …", text,
  von, spiel?, stufe?, liste?, eintrag?, aufgabe?, seite }`. Claude liest sie zu Beginn einer Sitzung, behebt
  sie und setzt den Status. Keine Namen von Kindern hineinschreiben: die Datei liegt im öffentlichen Repo.
- **Vorrang:** Was hier geprüft wird, gilt nach Commit und Push für alle; eine lokale Sperre der Aufsicht
  (`lernspiele:freigabe`) schlägt den Prüfstand weiterhin.

## 12. Kindergarten und Vorlesen

Wunsch Patrik, LERN_Session8: Kinder, die noch nicht lesen, sollen ohne Lesen spielen können, ausser in den
Spielen, die das Lesen selbst üben; ein Kind im Kindergarten soll sich eintragen lassen.

- **Klasse 0 = Kindergarten** (`LS.KLASSEN`, `LS.klasseVon(profil)`, `LS.klasseText(0)` = „Kindergarten“). Im
  Profil und beim Anlegen wählbar. Es gibt keine Spiele mit Basisklasse 0: Stufe 1 der Spiele mit Basisklasse 1
  ist der Kindergarten (Skala „eine Klasse tiefer“). „🎒 Meine Klasse“ zeigt einem Kindergartenkind die Spiele mit
  Basisklasse 1; die empfohlene Stufe ist 1, auch im Stufenfilter der Startseite. Nie `Number(p.klasse) || …`
  schreiben — 0 ist eine Klasse.
- **Vorlesen:** Neben der Eule steht 🗣️ (nicht 🔊: das ist der Ton-Schalter der Kopfzeile); die Eule liest ihre
  Sprechblase und den Auftrag der Aufgabe vor, also
  **nur die Elemente `.frage` und `.auftrag`** (die obersten, ohne verschachtelte). Satz, Wortkarte, Sachtext und
  Antwortknöpfe liest sie nie. Daraus folgt für jedes Spiel: In `.frage` und `.auftrag` steht nur die Anweisung,
  nie der Stoff, den ein **Lesespiel** üben will (das Wort, der Buchstabe, der Text). Rechen- und Sachtexte, die
  nicht das Lesen üben (Rechengeschichte, Anliegen, Lebensraum-Frage), dürfen in `.frage` stehen und werden
  vorgelesen — sonst misst das Spiel bei Kindern der 2. Klasse das Lesen statt Rechnen oder Sachwissen
  (Entscheid V1 a, LERN_Session10; so schon Rechengeschichten und Lebensraum-Zuordnung).
  - Profil-Feld `vorlesen`: `auto` (jede neue Aufgabe und jeden Tipp), `knopf` (nur auf 🗣️), fehlt = nach Klasse:
    Kindergarten und 1. Klasse automatisch, sonst auf 🗣️ (`LS.vorlesenArt`). Auch auf der Stufenwahl jedes Spiels
    umschaltbar („🗣️ Vorlesen: gleich / auf Knopfdruck“, schreibt dasselbe Profil-Feld).
  - **Startseite:** Langes Drücken auf eine Spielkarte liest Name und Beschreibung (`data-vorlesen`), auf einen
    Stufenknopf Spiel, Stufe und für wen (`LS.langDruecken(box)` in `start/spiele.js`); kurzes Tippen öffnet wie
    bisher.
  - **Startblatt** eines Spiels: 🗣️ liest die Einleitung, langes Drücken einen Stufenknopf (sein `aria-label`:
    Stufe, Name, für wen, Beschreibung). Hier und auf der Startseite nur auf Knopfdruck — automatisch liest die
    Eule nur im Spiel selbst (Vorgabe Patrik, LERN_Session8).
  - **Blase nur einmal:** Automatisch liest die Eule mit der neuen Aufgabe die Blase nur, wenn sie in dieser
    Aufgabe etwas gesagt hat — sonst stünde dort noch das Lob der vorigen und käme zweimal.
  - **Ton aus** (🔇 in der Kopfzeile) geht vor: Dann spricht keine Stimme, auch nicht in den Hörspielen (`sprich`
    prüft `tonAn`); Ausschalten bricht eine laufende Ansage ab.
  - **Stimmlage:** Aufgaben normal, Lob (`ctx.richtig`, Blase „gut“) höher und lebhafter, Tipps (Blase „hinweis“)
    tiefer und ruhiger (`STIMMLAGE`, nur Tonhöhe und Tempo — mehr bietet die Sprachausgabe nicht).
  - Ausgeschlossen: Spiele mit `vorlesen: false` im Katalog (Lese-Detektiv: die Fragen gehören zum
    Leseverstehen) und alle Spiele in Englisch und Französisch (fremde Wörter in Fragen, eigene Stimmen).
  - Stimme: Deutsch, bevorzugt de-CH (`BEVORZUGT`); ohne deutsche Stimme kein Knopf. Bildzeichen (Emoji) werden
    vor dem Sprechen entfernt, × und : zwischen Zahlen als „mal“ und „durch“ gelesen.
  - Antwortknöpfe mit Wörtern brauchen für Kinder bis zur 1. Klasse ein Bild oder Zeichen dazu (Beispiel
    Punkte-Blitz: ⬅️ Links, 🟰 Gleich viele, ➡️ Rechts).
  - **Langes Drücken** (0,5 s) auf einen Knopf in der Aufgabe liest seinen Text vor (`aria-label`, sonst Text);
    der Knopf wird dabei nicht ausgelöst (`langDruecken` in `spiel.js`). Nicht in Deutsch (Buchstaben und
    Wörter auf Knöpfen sind dort Stoff) und überall, wo nicht vorgelesen wird; Katalog-Feld `knoepfeVorlesen`
    schaltet es je Spiel an oder aus.

## 13. Fehler melden durch Kinder

Wunsch Patrik, LERN_Session9. Kinder sollen Fehler im Programm melden können; ein echter Fehler zählt
für sie positiv. Code: Speicher, Formular und Abgleich in `spiel.js` (`LS.meldungen`, `LS.meldeFormular` …),
Aufsicht in `start/verwaltung.js` (Untertab „🙋 Meldungen“), Kind in `start/statistik.js`.

- **Wer meldet:** Einstellung der Aufsicht `melden` (Verwaltung → Einstellungen): aus, ab der 3. Klasse
  (Standard, weil die Begründung geschrieben wird), ab der 5. Klasse, alle Kinder. Die Aufsicht immer.
- **Im Spiel:** Knopf „🙋 Melden“ in einer eigenen kleinen Zeile rechts unter der Eule (Klassen `melde-zeile`,
  `melden`; neben der Blase machte das Wort sie auf dem Handy zu schmal), auch im Zufallsmix (Entscheid K1 a: „sich melden“ kennen Kinder aus der Schule, „Bug“ nicht). Das Formular bietet
  „Diese Aufgabe“ und „Die Aufgabe davor“, die Art (falsch gewertet, Fehler in Text/Bild/Lösung, nicht
  lösbar, anderes) und eine Begründung (mindestens ein paar Wörter, „bitte keine Namen“). Der Rahmen gibt
  dazu mit: Aufgabentext, erwartete Lösung (`ctx.loesung`), die letzten Eingaben des Kindes (angetippte
  Knöpfe, bei OK das Getippte; ein Hörer am Dokument) und wie gewertet wurde.
- **Speicher:** `lernspiele:meldungen` = `[{ id, name, zeit, stand, status, verlauf, spiel, stufe, klasse,
  aufgabeNr, aufgabe, loesung, eingabe, ergebnis, art, text, antwort?, gelesen }]`. Reist mit dem Abgleich
  (je Kennung gewinnt der jüngere `stand`) und beim Sichern mit.
- **Status:** neu → (Aufsicht) bestätigt oder kein Fehler (mit Erklärung ans Kind) → weitergeleitet →
  (Entwicklung) geplant, behoben oder kein Fehler. Status- und Antwortwechsel zeigen dem Kind 🔔 an der
  Statistik, bis es sie gesehen hat; neue Meldungen zeigen der Aufsicht 🙋 an der Verwaltung.
- **Weitergeben:** nur die Aufsicht, ohne den Namen des Kindes (`LS.meldungFuerEntwicklung`: Kennung,
  Klasse, Spiel, Stufe, Aufgabe, Lösung, Eingaben, Begründung). Mit Entwickler-Server direkt als Bemerkung
  in `docs/eulenpfad/bemerkungen.json` (Feld `meldung` = Kennung, nur einmal). Ohne Entwickler-Server per
  E-Mail (Entscheid M1 a): Das Mailprogramm der Aufsicht öffnet sich mit Betreff und Text
  (`LS.meldungMailLink`). **Die Adresse trägt die Entwicklung an genau einer Stelle ein:**
  `eulenpfad/kontakt.js`, Feld `meldungen` (Entscheid A1 a: ein eigenes Postfach nur für Eulenpfad-Meldungen,
  keine private Adresse — die Seite ist öffentlich). Nur die Startseite lädt die Datei; `LS.meldungAdresse()`
  liest sie. Leer = kein E-Mail-Knopf, nur Text kopieren; der Tab Entwicklung zeigt, ob sie eingetragen ist. Bei der
  Entwicklung: Tab Entwicklung → „🙋 Meldung aus E-Mail einfügen“ macht daraus eine Bemerkung mit derselben
  Kennung (`LS.meldungAusText`). Datenschutz: CLAUDE.md, Ausnahme Fehlermeldungen.
- **Antwort zurück:** Die Entwicklung setzt den Status der Bemerkung („erledigt …“ → behoben, „kein
  Fehler …“, „geplant …“/„in Arbeit …“) und schreibt die Antwort fürs Kind ins Feld `antwort`.
  `python tools/meldungen_stand.py` veröffentlicht daraus `eulenpfad/meldungen-stand.json` (je Kennung nur
  Status und Antwort). „🔄 Antworten der Entwicklung abfragen“ liest diese Datei und, mit Entwickler-Server,
  die Bemerkungen (`LS.meldungStandAnwenden`).
- **Positiv gewertet:** Behobene Meldungen zählen als „🏅 Fehlerfinder“ in der Statistik des Kindes und im
  Fazit (auch in der freundlichen Fassung fürs Kind; Freigabe durch die Aufsicht je Kind, Profil-Feld
  `fazitFuerKind`, Entscheid G3).

## 14. Hilfe und Tipp

Wunsch Patrik, Entscheide T1 a, T2 a, T3 a (LERN_Session9). **Hilfe** erklärt die Bedienung des Spiels,
**Tipp** hilft bei der aktuellen Aufgabe.

- **❓ Hilfe** in der Kopfzeile jeder Spielseite (Klasse `hilfe-knopf`, auch auf der Stufenwahl); im Zufallsmix
  in dessen Leiste, die Mix-Seite schickt `{ typ: "hilfe" }` ans laufende Spiel. Das Fenster „So geht das
  Spiel“ zeigt oben `def.hilfe` (Text oder `stufe => Text`: was in diesem Spiel zu tun ist, 1–3 Sätze) und
  darunter, was der Rahmen auf der Seite findet: Stufenwahl, Zifferntastatur, Antworten, Körbe,
  Reihenfolge, ▶ Los, 🔊, 💡 Tipp, Zeitbalken, „Falsch ist nicht schlimm“, 🗣️, 🙋 Melden. Ohne Folgen; die
  Runde notiert nur, wie oft (`bedienhilfe` im Protokoll).
- **💡 Tipp** unter der Aufgabe (Klasse `tipp-zeile`), nur wenn das Spiel `ctx.tipp([...])` gibt, nie im
  Endlos-Modus. Jedes Antippen zeigt den nächsten Tipp in der Eulenblase („💡 Noch ein Tipp“, zuletzt
  „Keine Tipps mehr“). Die Uhr läuft weiter. Gezählt wird je Aufgabe (`aufgabenZeiten[i].tipps`) und je
  Runde (`tipps`); die **Sterne** rechnen `sterneFuer(fehler + tipps / 2)` — fragen ist günstiger als
  raten, aber nicht gratis. „Auf Anhieb“ heisst ohne Fehler und ohne Tipp (Auswertung, Mix, Fazit); der
  Abschluss nennt die Tipps, Fazit und Statistik ebenso.
- **Pause** bei ❓ Hilfe und 🙋 Melden: Die Uhr hält an (Restzeit bleibt), die Aufgabe ist verdeckt
  (`pause-verdeckt`), die Pause zählt nicht zur Zeit der Aufgabe. Ein Tipp pausiert nicht.
- **Testskript:** Tipps werden wie Hinweise geprüft („Hinweis verrät“); am Ende eine Liste „Ohne Tipps
  (ctx.tipp)“ je Spiel und Stufe (Übersicht, kein Fehler). Versteckte Knöpfe (`hidden`) tippt es nicht an.
