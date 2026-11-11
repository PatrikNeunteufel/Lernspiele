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

Die Skripte werden in dieser Reihenfolge geladen: `../../version.js` (Version des Eulenpfads, aus `eulenpfad/VERSION`
erzeugt, Plan C12 NS3 a; docs/kern/rahmen.md 3), `../../kern/kern.js` (gemeinsamer Kern der Reihe, vom Werkzeug
`tools/kern_verteilen.py` aus `kern/` erzeugt, nie von Hand ändern; `docs/plan_angleich_reihe.md` B),
`../gemeinsam/spiel.js`, `../gemeinsam/katalog.js`,
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
| Abschluss-Animation | `feier`, `ruhig` | Animation im Schlussbild (`feier.js`, Abschnitt 24) |
| Angemeldet | `spieler-zeile` | „Du spielst als …“ im Startbild; angemeldet wird auf der Startseite |
| Stufenwahl | `stufen`, `stufe`, `fuer`, `timer-zeile`, `timer-schalter`, `option-zeile`, `option-schalter`, `leise` |
| Entwickler-Modus | `entwickler-leiste`, `entwickler-feld` | Leiste unten im Spiel (Abschnitt 11) | Startbild des Spiels |
| Kurztasten | `mit-tasten` (am `html`), Attribut `data-marke` | Marke der Taste am Knopf (Abschnitt 19) |

**Erlaubt:** reservierte Klassen eingeschachtelt in einer eigenen Klasse. `.uhr .mitte` trifft nur
die Uhr. `.knopf` darf ein Spiel als Klasse an eigene Knöpfe hängen, aber nicht umgestalten.

### 2.2 Klassen der Bausteine — anpassbar

Diese Klassen gehören zu den Bausteinen (Abschnitt 4). Ein Spiel darf sie im eigenen Stil anpassen,
zum Beispiel grössere Wahlknöpfe. Die Liste steht in `LS.RAHMEN_KLASSEN.bausteine`.

| Baustein | Klassen |
|---|---|
| `LS.auswahl`, `LS.reihenfolge` | `wahl`, `wahl-knopf`, `bild`, `ablage`, `pfeil` |
| `LS.bild` (Bildersammlung, Abschnitt 22) | `gezeichnet`, `pruef-bild`, `pruef-text-bild`; `pruef-farbe`, `pruef-farbfeld` (Farbcode `#rgb`/`#rrggbb` in einer Liste: Feld in der Farbe vor dem Code) |
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
| `ctx.richtig(lob?, erklaerung?)` | Aufgabe gelöst. **Auf Anhieb** zeigt der Rahmen nur ein Lob aus seiner Liste (`LOB`: „Super!“, „Genau richtig!“ …; Entscheid LB1 a, LERN_Session18, Vorgabe Patrik: „bei der richtigen Antwort reicht das Lob“). Was das Spiel mitgibt — `lob` (etwa „Richtig! 1 Fr. 25 Rp.“, „7 + 4 = 11 🏠“) und `erklaerung` (ein ganzer Satz, WZ2 a) —, kommt nur **nach einem Fehlversuch** bei dieser Aufgabe, auch nach einem Verklicken, dann lässt es sich überspringen. `LS.auswahl`, `LS.reihenfolge` und `LS.koerbe` nehmen dafür `opt.lob` und `opt.erklaerung`. Bis LERN_Session18 zeigte der Rahmen `lob` immer; 137 von 169 Spielen gaben darin Rechnungen oder Begründungen mit. Eigene Lobliste je Spiel: `def.lob` (LB2 a), nur reines Lob bis 20 Zeichen, heute in den Sprachspielen („Oui !“, „Great!“: au-cafe, calendrier, son-lauscher, weather-report, listen-tap, sound-sorter, word-match, sentence-builder); Prüfer „Lob“ im Testskript |
| `ctx.falsch(hinweis, loesungText?)` | Fehlversuch. Der Hinweis darf die Lösung **nicht verraten** ✔. Mit `loesungText` zeigt der Rahmen nach dem dritten Fehlversuch die Lösung und einen Weiter-Knopf. Ohne ihn bleibt die Aufgabe offen; das Spiel hilft dann selbst (Zahlenmauer, Malkreuz). |
| `ctx.loesung(text)` | Lösung gleich beim Zeichnen nennen. Sie erscheint nur beim Testspieler hinter „🔑“. **Pflicht in jeder Aufgabe** ✔. Die Bausteine rufen sie selbst auf. Den Text in **eine** Konstante legen, die auch `ctx.falsch` bekommt. |
| `ctx.vorbei()` | Ist die Aufgabe gelöst oder aufgelöst? Dann nimmt sie keine Antwort mehr an. |
| `ctx.kennung(wert)` | Woran die Aufgabe zu erkennen ist, wenn man es nicht sieht (Hör-Aufgaben: die Melodie). Sonst nimmt der Rahmen Text, Bilder und Lösung. |
| `ctx.sag(text)` beim Stellen | Was ein Spiel beim Stellen einer Aufgabe sagt, gilt als sein Auftrag. Sagt es bei einer späteren Aufgabe nichts, zeigt die Eule den Auftrag dieser Aufgabe aus der Fläche (`.frage` oder `.auftrag`, ohne Knöpfe wie 💡), erst ohne solchen den zuletzt gesagten (ohne erneut vorzulesen; LERN_Session14, Pentomino-Puzzle zeigte nach „Formen finden“ beim Legen nur „Weiter geht's mit der nächsten Aufgabe.“) — nie bleibt das Lob der vorigen Aufgabe („Richtig wäre …“) neben einer neuen stehen. Nach `ctx.richtig` wartet der Rahmen, bis die Rückmeldung gelesen sein kann: 1,3 s, dazu 30 ms je Zeichen über 20, höchstens 3 s (WZ2 a; bis LERN_Session17 45 ms und 5 s), und bis die Stimme fertig ist (Hinweis Patrik, LERN_Session13). Überspringen (Entscheid WZ1 a): ein Balken läuft ab (Klassen `weiter-leiste`, `weiter-balken`, `weiter-knopf`), auf einem festen Platz links in der Zeile von „🙋 Melden“ unter der Eule, die immer gleich hoch ist — die Aufgabe rutscht nicht mehr (Hinweis Patrik, LERN_Session14; auf dem Handy sind Melden und Notizblock während der Rückmeldung ausgeblendet, damit die Zeile nicht umbricht); „Weiter ➜“, Antippen der Blase, Enter oder Leertaste führen sofort weiter und brechen die Stimme ab. Im Endlos-Modus fest 0,9 s ohne Balken |
| `ctx.schritte(n)` | Die Aufgabe braucht n Handgriffe mehr: Tipps, Ziffern samt OK, Züge, so viele wie mindestens nötig sind. Aufrufe zählen zusammen. Die Bausteine zählen ihre selbst (`auswahl` und `koerbe` 1, `reihenfolge` je Teil 1); für die Tastatur `LS.tippSchritte(wert)`. **Pflicht in Endlos-Stufen** ✔, daraus folgt der Boden der Endlos-Zeit (Abschnitt 7). **Alle Handgriffe der Aufgabe beim Stellen nennen** (Entscheid HG1 a, LERN_Session13): Mit dem Stellen gilt die Zahl fest; was danach erscheint (ein zweiter Schritt, eine Auswahl nach dem ersten Tipp), rechnet das Spiel vorab ein. Ein Baustein, der erst danach entsteht, zählt nicht mehr; ein späteres `ctx.schritte` des Spiels meldet das Testskript als Fehler. |
| `ctx.serie(name, wert)` | Ein zufällig gewähltes Merkmal, das das Kind als Muster erkennen kann: Richtung oder Aufgabenart, oder die richtige Antwort bei höchstens drei festen Antworten (ja/nein, <, =, >, auf/ab). **Serienbremse** (Vorgabe Patrik 2026-11-01): Der Rahmen zieht neu, statt dasselbe Merkmal öfter als `LS.SERIE_MAX` = 3-mal hintereinander zu stellen (bis zu 40 Versuche). Nicht für Zahlenwerte oder Knopfpositionen, und nur in Stufen, die wirklich mehrere Werte haben ✔. |
| `ctx.vorgehen(art, wert)` | Wie das Kind die Aufgabe angegangen ist, vor `ctx.richtig()` gemeldet (LERN_Session7). Landet in `liste[i].vorgehen` (bis LERN_Session18 `aufgabenZeiten[i]`) und in der Statistik, Karte „Vorgehen“ (Punkte der letzten 12 Aufgaben). Arten und Werte (vom besten zum schwächsten, Ton gut/mittel/schwach) stehen in `AUSWERTUNG.VORGEHEN`: `systematik` (Möglichkeiten-Finder: Zählwerk, geordnet, kreuz und quer, mit Hilfe), `teilerpaare` (Teiler-Spürnase: in Paaren, der Grösse nach, durcheinander), `ausgleichen` (Mittelwert-Türme: ohne Umweg, mit Umwegen). |
| `ctx.wartezeit(s)` | Die Aufgabe hält das Kind s Sekunden auf, ohne dass es etwas tun kann (gleich vorgespielte Töne). Uhr und Zeitmessung beginnen so viel später (Entscheide F1 a, F2 a, LERN_Session9); wartet das Spiel mit `ctx.nachAnsage`, zählt die Wartezeit ab dann. |
| `ctx.nachAnsage(fn)` | `fn` erst rufen, wenn die Eule fertig ist: Lob der vorigen Aufgabe ausgesprochen, Auftrag vorgelesen (falls automatisch). **Pflicht für alles, was ein Spiel beim Zeichnen vorspielt oder vorspricht** (Melodie, Rhythmus, Hörtext, Satz) — sonst überlagern sich Stimme und Ton, oder die Eule bricht den Hörtext ab (Meldung Patrik zum Hoch-Tief-Ohr, LERN_Session11). Ohne Stimme 300 ms nach dem Zeichnen; eine neu gezogene Fassung der Aufgabe ruft nie. Ersetzt die früheren Verzögerungen von 250/450 ms in sechs Spielen. |
| `ctx.tipp(texte, beiTipp?)` | Gestufte Tipps zur Aufgabe (Text oder Liste), vom Anstoss zum Konkreten; nie die Lösung (das Testskript prüft es wie Hinweise). Beim Zeichnen rufen. `beiTipp(i, letzter)` wird gerufen, nachdem Tipp i gezeigt ist — für Tipps mit Bild (LERN_Session11, Steine fangen); kein eigener Klick-Hörer am Tipp-Knopf. Das Kind holt sie mit „💡 Tipp“ einzeln; ein Tipp zählt für die Sterne wie ein halber Fehler, „auf Anhieb“ heisst ohne Tipp; im Endlos-Modus keine Tipps (Abschnitt 14). |
| `ctx.uhrWarten()` | Uhr und Zeitmessung beginnen erst, wenn die zurückgegebene Funktion gerufen wird: Jetzt kann das Kind antworten. Beim Zeichnen rufen. Für eine Stimme, die gleich vorspricht: `LS.sprich(text, sprache, "", ctx.uhrWarten())` (die Uhr startet, wenn die Stimme fertig ist, ohne Stimme sofort). `LS.losGehts` nutzt es selbst. **Regel** (F1 a, F2 a): Die Uhr läuft nie, solange das Kind nur warten kann — „▶ Los!“, 3-2-1, Zeigen, Vorspielen. |
| `ctx.losKnopf` | Für `LS.losGehts`: „▶ Los!“ mit 3-2-1 (erste Aufgabe, nach einer Aufgabe mit Fehler oder Zeit um, im Mix) oder nur kurz 👀 (LERN-38). |
| `ctx.sag(text, art?)` | Die Eule spricht (`art`: `"gut"` oder `"hinweis"`). |

**Wiederholungen** (Vorgabe Patrik 2026-10-31, verschärft LERN_Session11): Eine Aufgabe kommt erst wieder, wenn alle
verschiedenen Aufgaben der Stufe einmal dran waren — auch über Runden und Serien hinweg (RA5 a). Der Rahmen merkt sich
dafür je Person, Spiel und Stufe die Fingerabdrücke der gestellten Aufgaben (`lernspiele:gestellt`, Schlüssel
„Kennung der Person|Spiel/Stufe“, bis LERN_Session18 nach dem Namen; nur dieses Gerät, höchstens 400 je Stufe) und zieht
eine nicht erlaubte Aufgabe neu (das Spiel zieht in `aufgabe()` zufällig). Entscheiden tut der Kern
(`KERN.runde.auswahl`, docs/kern/rahmen.md 4.22). Suchstufen (`KERN.runde.VERSUCHE`): 1. ungestellt und ohne zu lange Serie; 2. aus einer früheren Runde, wenn sonst ein Muster entstünde (die
Serienbremse geht vor); 3. ungestellt, Serie erzwungen; 4. ist keine ungestellte mehr zu finden, beginnt ein neuer
Durchgang; 5. höchstens eine Aufgabe ein zweites Mal je Runde, nie direkt hintereinander — sonst endet die Runde früher. Weil der Rahmen den Vorrat nicht kennt, ist „alle“ eine
Suche mit vielen Zügen, kein Abzählen. Gibt eine Stufe nicht genug verschiedene Aufgaben her, endet die Runde früher; das
Protokoll vermerkt dann `gekuerzt` mit der geplanten Anzahl, und das Testskript meldet es als Hinweis.

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
| `LS.losGehts(ctx, element, weiter, { uhr })` | Für Aufgaben, die etwas nur kurz zeigen (einprägen, aufblitzen): element bleibt verdeckt. Bei der ersten Aufgabe einer Runde, nach einer Aufgabe mit Fehler und im Mix darüber „▶ Los!“, nach dem Tippen 3-2-1; sonst nur 1 s 👀 (`ctx.losKnopf`, LERN-38). Dann sichtbar, und `weiter(uhrLos)` startet die Zeigezeit. Mit und ohne Timer gleich: Die Uhr startet nach `weiter()`, mit `{ uhr: false }` erst, wenn das Spiel `uhrLos()` ruft (Merk-Blick: mit dem veränderten Bild). Mit `{ antwortenNachBlitz: true }` bleiben die Antworten (`.wahl`, `.tastatur`, `.korb-reihe`) verdeckt, bis das Spiel `weiter(uhrLos, vorbei)` → `vorbei()` ruft; erst dann startet die Uhr (höchstens 8 s, Bemerkung 7, LERN_Session11: Blitzlesen, Punkte-Blitz, Finger-Zähler). Benutzt von Merk-Blick, Punkte-Blitz, Blitzlesen, Finger-Zähler (Wunsch Patrik, LERN_Session8) |
| `LS.tastatur(opt)` | Zifferntastatur mit Anzeigefeld; das Spiel prüft selbst in `onOk`. Mit `dezimal: true` eine Taste für das eingestellte Dezimalzeichen (auch `.` und `,` auf der Tastatur), `nachkomma` begrenzt die Ziffern danach (Standard 3); `onOk(wert, text)` bekommt die Zahl und den getippten Text mit „.“, wenn die Stellenzahl zählt („3.0“ beim Runden) (LERN_Session8, LERN-36) |
| `NOTEN.zeile`, `NOTEN.hoerKnopf` | Notenbild und Hörknopf (`noten.js`) |
| `ctx.notizen(empfohlen)`, `LS.notizFeld({ breite, label })` | Notizen für Zwischenergebnisse (NZ1 a, `docs/eulenpfad/konzept_notizen.md`): `ctx.notizen(empfohlen)` sagt, ob das Spiel Notizfelder zeigt — `empfohlen` ist seine Regel für „nach Stufe“ (ab welcher Stufe oder Schrittzahl Kopfrechnen vor allem das Merken prüft); die Einstellung der Aufsicht `notizen` (nach Stufe · immer · nie, global und je Spiel, Katalog `einstellungen: ["notizen"]`) entscheidet. `LS.notizFeld()` gibt ein kleines Feld (Klasse `zw-notiz`), das das Spiel genau dorthin setzt, wo das Zwischenergebnis hingehört; nie bewertet. Der Rahmen hält fest, ob es benutzt wurde (Vorgehen `notiz`: im Kopf / mit Notizen; Abzeichen „Kopfrechner“). **Mit der Bildschirmtastatur** (Meldung Patrik, LERN_Session14): Ist ein Notizfeld oder ein Häuschen des Notizblocks gewählt, schreiben Ziffern, Zeichen und ⌫ dort hinein, ✕ leert es, OK heisst „✓ Notiz fertig“ und führt zurück zur Antwort; die Tasten nehmen dem Feld den Fokus nicht, und die Tastatur des Geräts bleibt zu (`inputmode` none) |
| `LS.lesetext(feld)` | Lesespiele (BH3 a): Der Text scrollt in seinem eigenen Feld, Auftrag, Frage und Antworten bleiben im Bild. Der Rahmen rechnet die Höhe aus dem übrigen Platz (mindestens 120 px), bei jeder Grössenänderung neu; ein Schatten unten zeigt, dass noch Text kommt. Gleich nach dem Einhängen des Texts aufrufen |
| `LS.kurztasten(box, knoepfe?, { reihe })` | Kurztasten für eigene Antwortknöpfe (Abschnitt 19); `auswahl`, `reihenfolge` und `koerbe` rufen es selbst. `reihe: true` verlangt die Grundreihe, wo gleiche Zeichen verschiedene Plätze meinen (Stellen-Detektiv Stufe 6). `data-taste` am Knopf nennt sein Zeichen, wo der Text es nicht ist (Stellen-Detektiv „Hunderter“ → `H`). `LS.kurztastenAus()` schaltet sie für die Seite ab (Spiele mit eigener Tastenbedienung) |

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
1. einen Eintrag in `SPIELE` in `katalog.js` (id, **art**, klasse, bild, name, thema, farbe `var(--deko-N)`,
   pfad, stufen, zeiten, beschreibung, lernziele; bei Inhaltslisten `listen`; `geprueft` erst nach
   der Prüfung, siehe Abschnitt 6). `art`: wie das Kind antwortet, Schlüssel aus `SPIELWEISEN`, wichtigste zuerst
   (Entscheid SP1 a, LERN_Session11; für die Spieltabelle im Portal `portal/eulenpfad-spiele.html`) ✔;
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
  geöffneten Browser-Tab (`sessionStorage`; Rechnung im Kern, `KERN.anmeldung`, docs/kern/rahmen.md 4.11). Die Aufsicht
  - verwaltet Konten und Freigaben,
  - sieht alle Statistiken,
  - sichert alle oder einzelne Kinder und liest Dateien ein,
  - spielt als Tester: Ihre Runden tragen `test: true`, und im Spiel gibt es die Testhilfen.

  Frühere Testspieler (`test: true`) werden beim Lesen zur Aufsicht.

**Neue Kinder und Aufsichten** (Entscheide KR1 a, KR2 a mit Zusatz Patrik, LERN_Session13): Auf der Anmeldung steht
immer „🐣 Ich bin neu“ und fragt „Ich bin ein Kind“ oder „Ich bin erwachsen (Aufsicht)“. Jeder Schritt steht im
Verlauf (`#neu`, `#neu-kind`, `#neu-klasse`, `#neu-frage`, `#neu-bestaetigen`, `#neu-aufsicht`, `#pin`), „Zurück“ im
Browser geht einen Schritt zurück; Namen stehen nie in der Adresse.
- **Aufsicht:** zuerst eine Frage über dem Stoff der Primarschule (Wurzel, Potenz, Produkt zweier negativer Zahlen,
  einfache Gleichung, Punkt-vor-Strich-Falle mit Potenz („5 + 3 · 4²“), Pythagoras mit ganzzahligen Seiten; falsch →
  andere Frage) — eine Hürde gegen Kinder, kein Schutz. Gibt es schon eine Aufsicht mit
  PIN, bestätigt eine von ihnen mit ihrer PIN (`LS.pinStimmt`, meldet nicht an); dann Name und PIN zweimal.
- **PIN vergessen** (Entscheide PIN1 a, PIN1-R a mit Zusatz Patrik): Beim Anlegen einer Aufsicht wählt sie eine
  Sicherheitsfrage mit Antwort und bekommt einmal einen Wiederherstellungscode (12 Zeichen, „K7QM-2XRA-9TPL“) zu sehen;
  gespeichert sind nur Prüfwerte (`wiederherstellung`). In Sicherung und Abgleich reist davon nur der Prüfwert des Codes
  (Abschnitt 10, „Geschützte Aufsicht“); PIN, Frage und Antwort bleiben auf dem Gerät.
  Bei der PIN-Abfrage führt „PIN vergessen?“ über die Frage für Erwachsene zu den Stufen: (1) Hinweis auf eine zweite
  Aufsicht (setzt die PIN in Verwaltung → Konten), (2) Code, (3) Sicherheitsfrage (Gross-/Kleinschreibung und
  Leerzeichen zählen nicht), danach eine neue PIN und gleich ein neuer Code; (4) Zurücksetzen mit Frist von 3 Tagen
  (`lernspiele:zuruecksetzen`, je Gerät; seit LERN_Session18 über den Kern `KERN.rollen`, docs/kern/rahmen.md 4.21, RL2 a,
  im Lernsteig gleich): Die Anmeldung zeigt allen den Termin, PIN oder Code einer Aufsicht bricht ab
  (`LS.zuruecksetzenAbbrechenMit`);
  nach Ablauf werden alle Aufsichten des Geräts zu Konten ohne PIN, und „Ich bin neu“ richtet ohne Erlaubnis eine neue
  ein. **Achtung Abgleich:** Die Rolle reist mit, nach dem nächsten Abgleich gilt das Zurücksetzen auch auf den anderen
  Geräten. Aufsichten von früher richten Code und Frage in Verwaltung → Konten ein („Falls Sie Ihre PIN vergessen“).
- **Kind:** Vorname, dann
die Klasse über grosse Knöpfe (Kindergarten, 1.–6., „Weiss nicht“), danach öffnet sich „Mein Bild“. Das geht
auch ohne Aufsicht; das Kind spielt dann alle freigegebenen Spiele, und was nur die Aufsicht kann (Freigaben,
Wochenziel, „fest“, Meldungen weitergeben), kommt, sobald eine eingerichtet ist. Gibt es eine Aufsicht, kann sie
es mit der Einstellung „Kinder legen sich selbst an“ (`selbstAnlegen`, Standard ja) abschalten; dann legt nur
sie Kinder an (Verwaltung → Konten).

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
„wechseln“ im Spiel. Gruppen, Filter-Block, Suchfeld, Sortierwahl und Favoriten des Tabs Spiele (und das Suchfeld der
Freigabe) kommen aus `KERN.uebersicht` (KT1 a, docs/kern/rahmen.md 4.26). Die **Suche** im Tab Spiele und in der
Freigabe (Entscheid SU1 a, `LS.suche`) ordnet
nach Relevanz: Feldgewichte Name 6, Lernziel-Kürzel 4, Beschreibung 3, Inhaltslisten 2, Thema 1;
Wortanfang vor Wortteil, genaue Umlaute vor ä = a; ein Tippfehler nur im Namen ab 5 Buchstaben und nie bei
Kürzeln mit Ziffern; jedes Suchwort muss passen. Während einer Suche steht statt der Gruppen eine Liste,
beste Treffer zuerst; wer nur über Thema oder Inhaltsliste passt, trägt „🔍 gefunden …“. **Persönliche Passung**
(Wunsch Patrik, LERN_Session10): Für ein angemeldetes Kind rechnet `LS.passung` aus der Nähe der Basisklasse zu
seiner Klasse (gleich 1, eine daneben 0.6, zwei 0.2) und dem Bedarf aus dem Protokoll (`AUSWERTUNG.bedarf`: Quote der
letzten 24 Aufgaben nach `KERN.auswertung.stand`, AW2 a, docs/kern/rahmen.md 4.14; in der
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
**Klassen-Rand** (Entscheid G1 a, LERN_Session14): Ist „🎒 Meine Klasse“ aus, bekommt jede Karte eines Kindes mit Klasse
einen Glow nach aussen und links oben ein Zeichen: ✓ Türkis (`--deko-5`) Basisklasse tiefer als die eigene, ● Gold
(`--deko-4`) die eigene, ▲ Violett (`--deko-1`) höher, „Herausforderung“. Nie Stellenfarben; das Zeichen trägt die
Bedeutung auch ohne Farbsehen, langes Drücken liest sie vor. Eine Legende steht über den Karten. Massgebend ist die
Basisklasse; welche Stufe genau passt, zeigt weiter 👍 (`LS.empfohleneStufe`). Die Aufsicht sieht keinen Rand.
**Sortierung** (Wunsch Patrik, Entscheide SO1 a, SO2 a, LERN_Session11; `LS.sortierungFuer`): Vorgabe „nach Fach und
Thema“ (Einstellung `sortierung` der Aufsicht), sonst eine Liste ohne Gruppen „passt zu dir zuerst“ (`LS.passung`),
„nach Alphabet“ oder „nach Klasse“, je auf- oder absteigend (Profilfeld `sortierung: { art, ab }`). Wählen darf die
Aufsicht immer, ein Kind ab der 4. Klasse (Einstellung `sortierungWahl`: nie, ab 4., ab 5., alle); je Kind abweichend in
Verwaltung → Konten, Spalte 🔀 (Art und `sortierungWahl` ja/nein). Eine Suche ordnet weiter nach Relevanz.
**Einklappbar** (Wunsch Patrik, LERN_Session14): Der ganze Filter steht in einem `details` „🔎 Filter“; die Kopfzeile
nennt auch zugeklappt, was gilt („Mathe · 4. Klasse · Stufe 3“ oder „alle Spiele“). Gemerkt je Person (Profilfeld
`filterZu`); ohne Wahl auf dem Handy (bis 560 px) zu, sonst offen. **Anleitungen in der App** (LERN_Session14): 📖 in der
Leiste führt das Kind zu `anleitung/kinder.html`, die Aufsicht zu `aufsicht.html`; unter der Anmeldung stehen beide.
Mit `?von=app` führt „Zurück“ dort in die App statt ins Portal.
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

**Kartenbild und Kinderkarte** (Entscheide GS1 a, GS2 a, SK1 a; LERN_Session32, docs/eulenpfad/konzept_gestaltung.md):
- In den Kacheln trägt jede Spielkarte oben das ruhige Endbild ihrer Abschluss-Animation, Stufe 3 mit 3 Sternen (fehlt
  sie, die nächste nach `KARTENBILD_STUFEN` in `start/spiele.js`), gezeichnet mit `LS_FEIER.zeige` aus `feier` im Katalog
  — dieselbe Quelle wie im Spiel. Die Startseite lädt dafür `feier.js`. Gezeichnet wird erst, wenn die Karte ins Bild kommt
  (IntersectionObserver, 300 px Vorlauf); die Fläche steht vorher schon in ihrer Grösse (320 : 150). Nennt `feier.daten`
  Dateien des Spiels (Schweiz-Karte: `karte.js`, `orte.js`), lädt die Startseite sie einmal in dieser Reihenfolge nach.
  Mit Bild entfällt das Emoji im Kopf (`.mit-bild`); ohne Bild kommt es zurück. Kompakt bleibt ohne Bild.
- Ein Kind sieht je Karte Bild, Name und Stufenknöpfe. Die Beschreibung zeigt ⓘ (`.karten-info`) und liest langes
  Drücken vor; Lernziel-Kürzel und Sperrmarken sieht nur die Aufsicht, den Grund eines Suchtreffers alle. Die
  Zufallskarten tragen für ein Kind nur den Titel; „🎯 Zufälliges Spiel“ heisst für ein Kind „🎯 Überrasch mich“.
- Gemessen (LERN_Session32, Desktop, lokaler Server): `feier.js` 739 KB ausgeliefert (gepackt 204 KB), Ausführen 2 ms,
  ein Kartenbild 0,17 ms; geprüft in `tools/eulenpfad_seiten.js` (Tab Spiele).

## 7. Endlos-Modus und Rekorde

Vorgabe Patrik 2026-10-31.
- **Ablauf:** Aufgaben, bis die erste falsch ist oder, mit Timer, die Zeit um ist. Gezählt werden die
  richtig gelösten. Im Startbild des Spiels unter den Stufen „♾ Endlos“, mit dem eigenen Rekord;
  direkt über `?stufe=s3&endlos=1`.
- **Welche Spiele** (Entscheide EN1 a, EN2 a, LERN_Session12): Der Katalog nennt je Spiel die Stufen mit
  `endlos: [...]` — jede Stufe mit mindestens 100 verschiedenen Aufgaben, mit Inhaltsliste oder ohne. Gezählt wird mit
  der Kennung des Rahmens, die auch Wiederholungen erkennt (`LS.pruefung.zaehle`): Das Testskript misst je Stufe und
  meldet einen Hinweis, wenn der Katalog davon abweicht (`ENDLOS_MIN` in `tools/pruefe_spiele.js`). Ist bei einer
  Liste alles gestellt, endet die Runde mit „alles geschafft“; es zählen nur freie Listen (LP3 a).
- **Wiederholungen** (RA5 a, LERN_Session19): in einer Serie keine Aufgabe zweimal, und wie in Runden zuerst, was im
  Gedächtnis noch nicht steht (Durchgang über Runden und Serien, `KERN.runde`). Findet sich keine neue mehr, ist die
  Stufe „alles geschafft“. Bis LERN_Session18: keine der letzten 30 der Serie, ohne Gedächtnis.
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
- **Speicher:** `lernspiele:rekorde` = `[{ id, name, zeit, inhalt, stufe, timer, punkte, dauer, alles?,
  test?, hilfe?, abgebrochen? }]`, eine Zeile je Endlos-Runde. `timer` ist die Startzeit in Sekunden oder `null`. Je
  Stufe gibt es zwei Ranglisten: ohne und mit Timer. Seit LERN_Session19 steht die Serie dazu im Protokoll (RA3 a: eine
  Serie ist eine Runde) — mit derselben Kennung, `endlos: true`, `sterne: null` und der Liste je Aufgabe; so zählen ihre
  Zeit und ihre Aufgaben in Statistik, Stand und Wochenziel. Rekord und Eintrag baut der Kern (`KERN.runde.lauf`).
  Gespeichert wird, sobald die Runde vorbei ist (Fehler, Zeit um, alles geschafft), nicht erst beim
  Antippen von „Zum Ergebnis“ (Meldung Patrik, LERN_Session4). Verlässt das Kind die Seite mitten in
  der Serie (Zurück-Pfeil, Tab zu: `pagehide`; Tablet aus, App gewechselt: `visibilitychange`), zählt
  die Serie bis dahin mit `abgebrochen: true` (Entscheid Patrik E1 a). Kommt es zurück und spielt
  weiter, ersetzt der nächste Stand diesen Zwischenstand (Rekord und Eintrag im Protokoll). Eine Serie ohne richtige
  Aufgabe gibt keinen Eintrag.
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
- den Tab Spiele der Startseite im Ersatz-DOM (`tools/eulenpfad_seiten.js`, KT1 a; `tab` als id: nur dieser,
  `--tab=0` schaltet ab): Favorit setzen und zurücknehmen (Profil, Gruppe Favoriten, Stern an), Zuklappen gemerkt
  und nach dem Neuzeichnen zu (ein `toggle` ohne Änderung speichert nicht), „Alle zu“ / „Alle auf“, Ansicht,
  Filter-Block (`filterZu`), Sortierung nach Name und umgekehrt, Suche als Liste ohne Gruppen und ohne
  „Alle auf/zu“ mit Fokus im Feld, nur Leerzeichen wie ohne Suche, Ähnliche mit „✕ Alle Spiele“ und Tippen;
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
- die Speicherschicht im Ersatz-DOM mit IndexedDB-Ersatz (Abschnitt 23, `tools/eulenpfad_seiten.js`; `speicher` als id: nur
  diese, `--speicher=0` schaltet ab): ohne IndexedDB in `localStorage` und sofort gezeichnet; mit IndexedDB zeichnen
  Startseite und Spielseite erst nach dem Laden, der Umzug leert `localStorage`, neue Runden landen in der Ablage, die
  Stufenwahl zeigt ihre Sterne; Verwaltung mit Erinnerung ans Sichern (weg nach dem Sichern) und Speicheranzeige; voller
  Speicher zeigt das Band genau einmal; kaputte IndexedDB fällt auf `localStorage` zurück;
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
  | Spiel → Mix | `ergebnis` | `zeit` (Eintrag der Aufgabe aus `KERN.runde`, mit Fehler auch `text`, `loesung`, `eingaben`; bis LERN_Session18 dazu `fehlerAufgabe`), `fehler`, `hilfen` |
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
jedem Gerät im Haushalt vollständig. Code im Kern (`KERN.abgleich`, docs/kern/rahmen.md 4.20, seit LERN_Session18);
`spiele/gemeinsam/abgleich.js` (`LS.abgleich`) gibt nur mit, was der Eulenpfad anders hat, und den Satz über das
Ergebnis. Jede Seite lädt es direkt nach `spiel.js`.

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
- **Personen** (seit LERN_Session15, Entscheide P1 a, P2 a; `KERN.person`, docs/kern/rahmen.md 4.7): Die Profile
  stehen als Liste `lernspiele:personen` mit fester Kennung `id`; der Name ist je Gerät eindeutig (ohne Gross/Klein)
  und nur Anzeige. Die Aufrufe des Eulenpfads (`LS.profil(name)`, `aktuellerSpieler()` …) gehen weiter über den
  Namen. Runden, Rekorde und Meldungen tragen `person` und `name` (Kopie für die Anzeige, nachgeführt von
  `LS.umbenennen` und beim Zusammenführen); `LS.gehoert(eintrag, person)` prüft die Zugehörigkeit.
  `lernspiele:spieler` und die Sitzung der Aufsicht speichern die Kennung. Der frühere Speicher `lernspiele:profile`
  (nach Namen) wird beim ersten Laden umgezogen; zwei Profile, die sich nur in Gross/Klein unterschieden, behalten ihre
  Runden, das zweite bekommt eine Nummer („mia (2)“). Die Rolle heisst `lernend` (bisher `kind`).
- **Dateiformat** (seit LERN_Session18, Kern 1.15.0, Entscheide DF1 a, DF2 a, DF4 a; `KERN.daten`, docs/kern/rahmen.md
  4.19): Sicherung (Statistik, `LS.sicherung(namen, filter)`: gewählte Kinder, Testrunden nur, wenn eingeblendet) und
  Abgleich-Datei (`LS.abgleichDaten(geraet)`: alles mit Löschvermerken, Freigabe und Meldungen) im Format `reihe-daten`
  der Reihe. Ältere Dateien (`eulenpfad-daten` 1–3, Version 1 und 2 ohne `format`) deutet der Kern um; eine Datei des
  Lernsteigs wird mit einem Satz abgewiesen. Ein Gerät mit älterem Stand liest die neuen Dateien erst nach dem Neuladen.
  Statistik und Verwaltung zeigen beim Einlesen den Satz des Kerns (keine Datei, andere App, neuere Fassung, beschädigt,
  Speicher voll). Bis LERN_Session18 wies das Einlesen über die Datei jede Datei der Version 3 ab (verlangte `profile`).
  Test „Sichern und Einlesen“ in `tools/pruefe_spiele.js`, einzeln `node tools/pruefe_spiele.js daten`.
- **Zusammenführen** (`LS.zusammenfuehren(text | objekt)` über `KERN.daten.einlesen`, auch beim Einlesen): erst wird
  jeder Eintrag geprüft (`RUNDEN_PRUEFUNG`, `REKORD_PRUEFUNG`), dann alles oder nichts geschrieben.
  - Personen: gleiche Kennung, sonst gleicher Name → dieselbe Person, die ältere Kennung bleibt, die andere wird
    frühere Kennung (`frueher`); je Feld der jüngere Zeitstempel (`geaendert`). Die PIN reist nie mit.
  - Runden: nach Kennung, Verweise auf eine zusammengeführte Kennung werden umgebogen und die Namenskopie nachgeführt;
    Runden ohne Person der Datei oder des Geräts werden abgewiesen.
  - Rekorde: ebenso, bei gleicher Kennung gilt der höhere Stand (Zwischenstand → Endstand).
  - Löschen (`LS.loescheSpieler`, `LS.loescheRunden` über den Kern): `lernspiele:geloescht` hält Vermerke für gelöschte
    Personen (`personen` nach Kennung, `namen`) und zurückgesetzte Runden (`person`, `name`, `inhalt`); die Form bis
    LERN_Session18 (`spieler`, `spiel`) liest der Kern weiter. Ein Vermerk entfernt auf allen Geräten, was bis zu seinem
    Zeitpunkt entstand; wer danach angelegt, geändert wurde oder gespielt hat, bleibt.
  - Freigabe: die des Geräts mit dem jüngsten `lernspiele:freigabeStand`.
  - Meldungen: je Kennung der jüngere Stand (`stand`), Verweise auf die bleibende Person.
- **Geschützte Aufsicht** (DF4 a): Eine Aufsicht reist ohne PIN, mit dem Vermerk `geschuetzt` und dem Prüfwert ihres
  Wiederherstellungscodes. Auf einem Gerät, auf dem sie keine eigene PIN hat, ist sie **gesperrt** (🔒 auf der
  Anmeldung, `LS.gesperrt(name)`): Tippt man sie an, schaltet man sie mit ihrem Code oder mit der PIN einer anderen
  Aufsicht dieses Geräts frei und legt eine neue PIN fest (`LS.freischalten`); der Code bleibt derselbe. Der Code reicht
  nur auf einem Gerät ohne Aufsicht mit PIN; gibt es eine, bestätigt sie (OA1 a, LERN_Session19, `KERN.person.codeReicht`;
  die Anmeldung zeigt dann kein Codefeld). Vorher brachte eine selbst gebaute Datei mit bekanntem Code eine Aufsicht
  ohne Bestätigung aufs Gerät. Setzt eine
  andere Aufsicht ihre PIN in Verwaltung → Konten, ist sie ebenfalls freigeschaltet. Gibt es weder Code noch eine andere
  Aufsicht, richtet man zuerst mit „🐣 Ich bin neu“ eine Aufsicht ein. Bis LERN_Session18 kam sie ohne PIN an, und wer
  sie auf einem Gerät ohne andere Aufsicht antippte, konnte eine PIN festlegen.
- **Gesperrte Aufsicht ausblenden** (KE1 a, LERN_Session20; `KERN.person.ausgeblendet`): In Verwaltung → Konten steht bei
  einer gesperrten Aufsicht „🙈 auf diesem Gerät ausblenden“ statt „🗑 löschen“ — sie ist auf ihrem eigenen Gerät echt,
  und ein Löschvermerk nähme sie im Abgleich dort mit (samt Verbindungen). Ausgeblendet steht sie nicht auf der
  Anmeldung und nicht im Personen-Knopf, bleibt aber in den Daten und reist im Abgleich weiter; „👁 wieder zeigen“ holt
  sie zurück. Die Liste `lernspiele:ausgeblendet` gilt nur für dieses Gerät (`LS.angezeigt`, `LS.ausblenden`,
  `LS.zeigen`, `LS.darfAusblenden`). Andere Personen löscht die Aufsicht wie bisher.
- **Geprüft** am 2026-11-01 auf localhost mit dem Browser-eigenen Dateispeicher (OPFS) als Ordner:
  zwei bzw. drei Geräte, Zwischen- und Endstand, Löschen und neu Anlegen, Freigabe, Neuzeichnen der
  Rangliste. Ungeprüft: `file://`, echte Netzwerk- und Cloud-Ordner, Uhren, die zwischen Geräten
  abweichen (LERN-31).

## 11. Entwickler-Modus

Entscheide Patrik E1 a, E2 a, E3 a, 2026-11-01 (LERN_Session6). Code in `spiele/gemeinsam/entwicklung.js`
(`LS.entwicklung`: Listenansicht und Leiste) über dem Kern (`KERN.entwicklung`, docs/kern/rahmen.md 4.12: Schlüssel,
Zustand, Server) und `tools/entwickler_server.py` (für alle Apps, jede Anfrage nennt `app`).

- **Nur lokal:** Er funktioniert nur im lokalen Repo mit laufendem Entwickler-Server
  (`python tools/entwickler_server.py`, dann `http://localhost:8765/eulenpfad/`). Der Server liefert das
  Repo aus wie `http.server` (ohne Zwischenspeicher, ohne `entwickler.key` und `.git`) und schreibt nur
  zwei Dateien: `spiele/gemeinsam/pruefstand.js` und `docs/eulenpfad/bemerkungen.json`. Seit LERN_Session25
  (C11-3 a, Kern 1.33.0) darf die Seite von woanders kommen (anderer Port, veröffentlichte Seite): Die Adresse des
  Servers steht unter Verwaltung → Einstellungen → „Meldungen an die Entwicklung“ (nur dieses Gerät, `lernspiele:meldeweg`;
  nur `localhost`/`127.0.0.1`; Vorgabe `eulenpfad/kontakt.js`, Feld `server`), dort auch der Weg der Meldungen (automatisch,
  nur Server, nur E-Mail, nur Text) und „Verbindung prüfen“ (prüft die Adresse im Feld, nennt sie und sagt, wenn sie noch
  nicht gespeichert ist; Kern 1.35.0 `verbindungPruefen`). Der Server antwortet mit CORS nur für erlaubte Herkunft.
- **Schlüssel:** Im Klartext nur in `entwickler.key` in der Repo-Wurzel (von Git ausgeschlossen); in
  `kern/entwicklung.js` steht nur `SCHLUESSEL_HASH` (SHA-256 mit Salz; ein Schlüssel für das ganze Repo). Die Aufsicht schaltet unter Verwaltung →
  Entwicklung je Gerät frei (`lernspiele:entwickler`, nicht abgeglichen); der Server prüft den Schlüssel
  bei jedem Schreiben noch einmal. Neuer Schlüssel: `python tools/entwickler_server.py --neuer-schluessel`.
- **Zugelassene Aufsichten** (seit LERN_Session27, Plan C12 ES1 a bis ES5 a, Kern 1.37.0): Wer prüfen will, tippt unter
  Verwaltung → Entwicklung „✉️ Entwicklermodus anfordern“ (E-Mail mit Vorlage an die Adresse aus `kontakt.js`). Die
  Entwicklung lässt mit `--zulassen "Vorname Name" person@…` zu und schickt den Schlüssel an die anfragende Adresse.
  Mit ihm schaltet die Aufsicht frei (geprüft beim Server); ihre Vermerke gehen in `docs/eulenpfad/pruefstand-eingang.json`
  (gitignored) und wirken erst nach Übernahme (docs/richtlinie_freigaben.md). Die Bemerkungen anderer sieht sie nicht.
- **Zusätze**, eingeschaltet über einen eigenen Schalter, nur für die angemeldete Aufsicht:
  - in jedem Spiel eine Leiste unten (`entwickler-leiste`): „✓ Spiel angesehen“ und „📝 Bemerkung“ mit
    Spiel, Stufe und laufender Aufgabe (`LS.spielStand()`), ob Kinder das Spiel sehen (`LS.sperrGrund`), und
    aufklappbar die Inhaltslisten des Spiels, je mit „ansehen“ und „✓ geprüft“ (`entwickler-listen`);
  - in der Freigabe je Spiel „✓ angesehen“, je Liste „✓ geprüft“ und „ansehen“: die Einträge der Liste
    aus `docs/eulenpfad/pruefung/listen.json` (vom Prüflisten-Generator; nach jeder Änderung einer Liste neu erzeugen —
    `node tools/pruefe_spiele.js` meldet eine veraltete Prüfliste über `pruefliste_wortlisten.js --pruefe`), je Eintrag eine Bemerkung;
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
  - **Auftrag nur, wenn er neu ist** (LERN_Session11): Lautet der Auftrag gleich wie bei der vorigen Aufgabe
    („Wohin geht die Melodie?“), liest die Eule ihn automatisch nicht nochmals; 🗣️ liest ihn immer.
  - **Reihenfolge:** Lob der vorigen Aufgabe ausreden lassen (`nachStimme`), dann vorlesen, dann `ctx.nachAnsage`.
  - **Stimmen sichtbar** (Meldung Patrik, LERN_Session11): Das Startblatt zeigt je Sprache, die das Spiel braucht
    (`def.stimme` aus `LS.spielMitStimme`, dazu Deutsch fürs Vorlesen), die gefundene Stimme mit Sprache, „⏳ wird
    geladen“ oder „⚠ keine Stimme“ mit Hinweis, und „▶ Probe“ mit Rückmeldung („✓ gesprochen“, Fehlercode, Ton aus)
    — Klassen `stimmen-zeile`, `stimme-eintrag`, `stimme-meldung`. Scheitert das Sprechen im Spiel (nicht abgebrochen
    oder unterbrochen), sagt die Eule es einmal je Runde.
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

**Anregungen der Aufsicht** (Wunsch Patrik, LERN_Session11): Verwaltung → Meldungen, Karte „💡 Anregungen an die
Entwicklung“ — Art (`LS.ANREGUNG_ARTEN`), wahlweise ein Spiel, Text. Gespeichert wie eine Meldung mit
`typ: "anregung"` (`LS.neueAnregung`), gesendet gleich beim Speichern auf demselben Weg (E-Mail bzw. Entwickler-Server,
Text „Anregung M-…“), Antwort über dieselbe Abfrage. Kinder sehen Anregungen nie; sie zählen weder als neue Meldung
noch als Fehlerfinder (`LS.istAnregung`).

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
  und beim Sichern mit; je Kennung gewinnt der bessere Stand, die Verläufe werden vereinigt (C11-1 a, seit
  LERN_Session25; vorher der jüngere `stand`). Die Logik steht seit Kern 1.32.0 in `KERN.meldungen`
  (docs/kern/rahmen.md 4.28); `spiel.js` bindet sie an und behält die Namen unter `LS`. Ein gelöschtes Kind nimmt
  seine Meldungen mit, auch beim Einlesen und im Abgleich (Kern 1.32.1); Anregungen der Aufsicht bleiben.
- **Status:** neu → (Aufsicht) bestätigt oder kein Fehler (mit Erklärung ans Kind) → weitergeleitet →
  (Entwicklung) geplant, behoben oder kein Fehler. Status- und Antwortwechsel zeigen dem Kind 🔔 an der
  Statistik, bis es sie gesehen hat; neue Meldungen zeigen der Aufsicht 🙋 an der Verwaltung.
- **Weitergeben:** nur die Aufsicht, ohne den Namen des Kindes (`LS.meldungFuerEntwicklung`: Kennung,
  Klasse, Spiel, Stufe, Aufgabe, Lösung, Eingaben, Begründung). Mit Entwickler-Server direkt als Bemerkung
  in `docs/eulenpfad/bemerkungen.json` (Feld `meldung` = Kennung, nur einmal). Ohne Entwickler-Server per
  E-Mail (Entscheid M1 a): Das Mailprogramm der Aufsicht öffnet sich mit Betreff und Text
  (`LS.meldungMailLink`). **Die Adresse trägt die Entwicklung an genau einer Stelle ein:**
  `eulenpfad/kontakt.js`, Feld `meldungen` (Entscheid A1 a riet zu einem eigenen Postfach; seit LERN_Session27 die
  Adresse der Entwicklung nach NS1 a, Plan C12 — die Seite ist öffentlich, die Adresse also für jeden lesbar). Nur die Startseite lädt die Datei; `LS.meldungAdresse()`
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
- **💡 Tipp** beim Antwortbereich ohne eigene Zeile (Klasse `tipp-zeile`; Ort seit BH2-T a, LERN_Session13: Abschnitt
  20), nur wenn das Spiel `ctx.tipp([...])` gibt, nie im Endlos-Modus. Jedes Antippen zeigt den nächsten Tipp in der
  Eulenblase; der Knopf sagt es als Beschriftung („Noch ein Tipp“, zuletzt „Keine Tipps mehr“, dann grau). Die Uhr läuft weiter. Gezählt wird je Aufgabe (`liste[i].tipps`) und je
  Runde (`tipps`); die **Sterne** rechnen `sterneFuer(fehler + tipps / 2)` — fragen ist günstiger als
  raten, aber nicht gratis. „Auf Anhieb“ heisst ohne Fehler und ohne Tipp (Auswertung, Mix, Fazit); der
  Abschluss nennt die Tipps, Fazit und Statistik ebenso.
- **Pause** bei ❓ Hilfe und 🙋 Melden: Die Uhr hält an (Restzeit bleibt), die Aufgabe ist verdeckt
  (`pause-verdeckt`), die Pause zählt nicht zur Zeit der Aufgabe. Ein Tipp pausiert nicht.
- **Testskript:** Tipps werden wie Hinweise geprüft („Hinweis verrät“); am Ende eine Liste „Ohne Tipps
  (ctx.tipp)“ je Spiel und Stufe (Übersicht, kein Fehler). Versteckte Knöpfe (`hidden`) tippt es nicht an.

## 15. Lernplan und Erfolge

Entscheid L1 a und Wunsch Patrik (Abzeichen zum Teilen, eigene Seite), LERN_Session10. Rechnen tut
`spiele/gemeinsam/erfolge.js` (`ERFOLGE`), zeigen `start/erfolge.js` (Tab „🏅 Erfolge“). Alles entsteht aus dem
Protokoll, den Endlos-Rekorden und den Meldungen; gespeichert werden nur zwei Profilfelder.

- **Lernplan (Wochenziel):** Die Aufsicht setzt je Kind in der Verwaltung (Konten, Spalte 📅) Tage pro Woche und
  Minuten je Tag (Vorgabe 3 × 10; Profilfeld `lernplan`, „aus“ = kein Ziel). Ein Tag ist erfüllt, wenn die Runden des
  Tages zusammen die Minuten erreichen; eine Woche (Montag bis Sonntag) ist erfüllt, wenn genug Tage erfüllt sind.
  Jede erfüllte Woche gibt einen **Wochenstern 🌟**, unabhängig von Fehlern und Tempo; die **Serie** zählt erfüllte
  Wochen in Folge (die laufende Woche bricht sie nicht, solange sie läuft). **Warnung** (Wunsch Patrik,
  LERN_Session11; `gefahr` im Ergebnis von `lernplan`): Läuft eine Serie und reichen die restlichen Tage der Woche ab
  heute nur noch knapp (fehlende Tage = verbleibende), mahnt die Wochenkarte „⚠️ Achtung …“ mit orangem Rahmen;
  reicht es nicht mehr, tröstet sie („nächste Woche startest du neu“), ohne Rot. `ERFOLGE.lernplan(profil, runden)` liefert
  alle Wochen seit der ersten Runde. Das Kind sieht die Woche als sieben Tage (★ erfüllt, • gespielt, Rahmen = heute)
  oben im Tab Spiele (kompakt, nur mit Ziel) und im Tab Erfolge; die Aufsicht sieht in der Statistik die letzten zwölf
  Wochen als Reihe.
- **Abzeichen:** 19 Stück in `ERFOLGE.ABZEICHEN` (Fleissig, Sternensammler, Perfekt, Aus eigener Kraft, Königsstufe,
  alle sechs Stufen, Spiel-Meister, Entdecker, Vielseitig, Mathe-/Deutsch-Ass, Forscher, Sprachtalent, Endlos-Läufer,
  Mix-Meister, Wochenstern, Dranbleiber, Fehlerfinder, Frühaufsteher), **jedes mit Stufen** (Wunsch Patrik,
  LERN_Session11): `ERFOLGE.RAENGE` = 🥉 Bronze, 🥈 Silber, 🥇 Gold, 🏆 Platin, 💎 Diamant; je Abzeichen eine eigene
  Abstufung `stufen` (zum Beispiel Runden 1/10/50/100/500, Entdecker 10/25/50/100/150, Vielseitig 2/3/4/5/7 Fächer).
  `text(n)` sagt, was die Menge n braucht, `pruefe(k, n)` → `{ ist, soll, wann }`; eine Stufe ist erreicht mit der
  Zeit der Runde, die sie vollendet hat. Dranbleiber zählt die längste Serie, Endlos den Bestwert. Die Kachel zeigt die
  erreichte Stufe (Rahmenfarbe `rang-<id>`) und den Balken zur nächsten; offene den Balken zu Bronze. Neue Stufen
  tragen 🆕 (und der Tab „🏅 Erfolge 🆕“), bis das Kind den Tab öffnet (Profilfeld `erfolgeGesehen` = Liste
  `"<id>:<stufe>"`; Gesehenes gilt für tiefere Stufen mit, frühere Einträge ohne Stufe übersetzt `FRUEHER`).
  Testrunden zählen nicht. Die Aufsicht sieht die Erfolge jedes Kindes (Auswahl wie in der Statistik), ohne 🆕.
- **Teilen (Annahme B1):** „📤 Teilen“ zeichnet das Abzeichen als PNG (Bild, Titel mit Stufe und Rahmen in ihrer Farbe, Text, Vorname des Kindes, Datum,
  „🦉 Eulenpfad“) und übergibt es dem Teilen-Dialog des Geräts (`navigator.share` mit Datei), sonst wird es
  gespeichert. Nur auf Knopfdruck; es reist nur der Vorname mit, kein weiteres Profil. Datenschutz-Ausnahme in
  `CLAUDE.md`.
- **Neue Abzeichen** kommen in `ABZEICHEN` dazu, mit Id, Bild, Titel, `stufen` (steigend, höchstens fünf), `text(n)` und
  `pruefe(k, n)`; mehr braucht es nicht.

## 16. Regelseite

Wunsch Patrik, LERN_Session11 (zu ST3 a): Spiele mit Regeln, die man kennen muss, bevor man spielen kann (Schach,
Go, Nim), erklären sie auf einer eigenen Seite statt in Stufen. Die Stufen bleiben beim einen Lernziel.

- **Katalog:** `regeln: true`. Dann gehört neben `index.html` eine Seite `spiele/<id>/regeln.html` ✔.
- **Zugang:** „📖 Regeln“ auf dem Startblatt (neben „🔗 Ähnliche Spiele“, gleicher Tab) und im Fenster „❓ So geht
  das Spiel“ (im laufenden Spiel in einem neuen Tab, damit die Runde bleibt). Klasse `regeln-link` ist reserviert.
- **Seite:** eigenständig, ohne Spielrahmen; lädt `../gemeinsam/stil.css` und `../gemeinsam/regeln.css` ✔, oben
  „← Zurück zum Spiel“ mit `href="index.html"` ✔, darunter `<main class="regeln">` mit kurzen Abschnitten
  (`section`, `h2`, ein Bild als inline-SVG, `.merke` für den einen Satz, der zählt) und am Ende ein Knopf zurück zum
  Spiel. Kurze Sätze, Bilder vor Text, Schweizer Schreibweise; was die Regeln nicht verraten dürfen (die
  Gewinnstrategie), bleibt weg.

## 17. Prüfung der Inhaltslisten je Eintrag

Entscheide LP1 a, LP2 a, LP4 a, LP5 a (Patrik, LERN_Session11), LP3 a (Patrik, LERN_Session12). Code: Ansicht seit
Kern 1.31.0 in `kern/listenpruefung.js` (LK1 a, docs/kern/rahmen.md 4.27), `spiele/gemeinsam/listenpruefung.js` (Anbindung), `spiel.js` (`LS.listenPruefung`, `LS.listenPruefen`, `LS.fingerabdruck`, lokale Haken), Entwickler-Server
(`/entwicklung/eintraege`, `/entwicklung/bemerkung-status`).

- **pruefung.js je Spiel** neben den Inhalten meldet mit `LS.listenPruefung(spielId, { <liste>: { beschreibung,
  abschnitte } })`, wie seine Listen geprüft werden. Ein Abschnitt: `id`, `titel`, `hinweis?`, `spalten`,
  `eintraege()` (Rohdaten wie im Spiel), `zeile(e)` (Zellen), `gruppe?(e)` (Untergruppen), `bild?(e)` (Bild, vom Spiel
  gezeichnet). Eine Liste mit gemischtem Inhalt bekommt mehrere Abschnitte; jeder ist für sich abzuhaken.
- **Laden:** Die Spielseite bindet nichts zusätzlich ein. `LS.listenPruefen(spiel, liste)` lädt `listenpruefung.js` und
  `pruefung.js` nach und öffnet die Ansicht — vom Startblatt („🔍 Inhalte prüfen“, Aufsicht und Entwicklung), aus der
  Entwickler-Leiste und über `?pruefen=<liste>` (Verwaltung → Freigabe, „🔍 prüfen“). Ohne pruefung.js bleibt die alte
  Tabelle aus `docs/eulenpfad/pruefung/listen.json` (nur Entwickler-Modus).
- **Haken je Eintrag** hängen am Fingerabdruck von Abschnitt und Rohdaten (`<abschnitt>:<cyrb53>`): Ändert sich ein
  Eintrag, ist sein Haken weg. Abschnitte und Gruppen klappen auf und zu; ganz geprüfte sind beim Öffnen zu. „✓ alle“ je
  Gruppe, „✓ Ganze Liste geprüft“ übernimmt die gesetzten Haken und hakt den Rest ab; Einträge mit offener Bemerkung
  bleiben offen.
- **Entwicklung** (Entwickler-Modus): Haken in `spiele/gemeinsam/pruefstand-eintraege.json`; ist alles abgehakt, steht die
  Liste in `pruefstand.js` mit `hash` (Fingerabdruck der ganzen Liste). Bemerkungen je Eintrag (mit `schluessel`) stehen
  in der Ansicht und lassen sich entfernen (Status „erledigt … (in der Prüfansicht entfernt)“).
- **Aufsicht und Lehrperson** (LP4 a): Haken auf dem Gerät (`lernspiele:pruefungLokal`); ganz geprüft heisst auf diesem
  Gerät frei (`LS.setzeListeFrei`), sonst zurück auf den Prüfstand. ✓E zeigt, was die Entwicklung schon geprüft hat.
  ✏️ schreibt eine **Korrektur** — eine Anregung der Art `korrektur` mit Liste, Eintrag und Schlüssel, gesendet unter
  Verwaltung → Meldungen; solange sie nicht gesendet ist, lässt sie sich in der Ansicht entfernen.
- **Freigabe nur ganz** (LP3 a): Eine Liste geht erst in die Aufgaben, wenn alle ihre Einträge geprüft sind; einzelne
  Haken geben nichts frei. Bis dahin sehen Kinder sie nicht (`LS.freieListen`), die Aufsicht schon.
  **Geändert nach der Prüfung** (LP3-H a): `tools/listen_fingerabdruck.js` rechnet je Liste mit pruefung.js den
  Fingerabdruck nach; weicht er vom `hash` im Prüfstand ab, meldet `tools/pruefe_spiele.js` einen Fehler und
  `tools/checkliste.js` führt die Liste wieder als zu prüfen (ohne `hash`, also vor der Prüfung je Eintrag geprüft:
  ein Hinweis). Geprüft wird im Repo, nicht zur Laufzeit — Listen ändern sich nur dort.
- **Darstellung:** Linien zwischen den Zeilen, kurze Spalten so breit wie ihr Inhalt, lange Zellen (über 24 Zeichen)
  brechen um. Regeln für die Listen selbst (ein Inhalt je Abschnitt, Spalten mit fester Bedeutung, Gruppen, Beschreibung
  mit Stufen): die Pilotspiele Anlaut-Angel und Auge-Entdecker zeigen sie.

## 18. Profil des Kindes, Avatar, Wahl und Vorgabe

Entscheide AV1–AV3, ST1, ST2, ZG1, RF1, VR1 a (Patrik, LERN_Session12); Konzept und offene Teile (VR2, VR3, Ziele der
Klasse): `docs/eulenpfad/konzept_profil_kind.md`.

- **Avatar** (`spiele/gemeinsam/avatare.js`, auf jeder Seite vor `spiel.js` geladen): gezeichnete Motive in Sätzen
  (16 Tiere; je 6 Weltall und Technik, Fantasie, aus den Spielen; 22 Abzeichen-Symbole) auf 6 Hintergrundfarben
  (Deko-Farben, nie Stellenfarben) und 4 Rahmen; Kennung `<motiv>-<farbe>[-<rahmen>]` im Profilfeld `avatar`; keine
  Fotos. Freigeschaltet (`ERFOLGE.freischaltungen`, AV5 a, AV6 a): das Symbol eines Abzeichens ab Gold, die Rahmen
  Gold, Platin, Diamant ab dem ersten Abzeichen in diesem Rang. Neues meldet der Tab Spiele, bis das Kind die Bildwahl
  öffnet (`freiGesehen`). Die Abzeichen zeigen dieselben Symbole statt Emoji, auch im geteilten Bild.
  `LS.avatarBild(name, groesse)` gibt das Bild als Element, ohne Avatar den Anfangsbuchstaben. Es steht vor dem Namen:
  Anmeldung (Kachel), Kopfzeile, Spielerzeile im Spiel, Endlos-Ranglisten, Namens-Chips der Aufsicht, Abzeichen-Bild.
- **Profil:** Ein Kind sieht sein Alter und seine Klasse (nur zum Lesen) und wählt „Mein Bild“. Die Aufsicht (Aufbau
  nach Hinweis Patrik, LERN_Session14): oben ein Formular — **👤 Person** (Bild des Kindes nur zum Ansehen, Geburtsdatum
  mit Alter, Klasse mit dem Aufstieg gleich daneben), **🎮 Vorgaben fürs Spielen** (Vorlesen, Reihenfolge global und je
  Spiel eingeklappt, Timer), **⭐ Fokus** (ganz und je Fach oder Lernzielblatt einklappbar, mit Zählern) — und gleich
  darunter „Speichern“. Darunter **🔒 Was das Kind selbst umstellen darf**: „🔒 fest“ und „↺ Auf Vorgabe zurück“ je
  Einstellung, die sofort wirken. Vor einem Aufstieg speichert das Formular, was geändert ist.
- **Geburtsdatum** (Plan B3, Vorgabe Patrik LERN_Session15; umgestellt LERN_Session27, wie im Lernsteig): Profilfeld
  `geboren: "JJJJ-MM-TT"`, eingegeben im Datumsfeld, gelesen und gezeigt über `KERN.person` (`geburtsdatumLies`,
  `geburtsdatumText`); `LS.alterVon(profil, jetzt)` rechnet das Alter mit `KERN.person.alter`. Profile seit
  LERN_Session14 tragen nur den Monat (`"JJJJ-MM"`, damals Datensparsamkeit, Annahme GM1): Das Datumsfeld bleibt leer,
  der Monat gilt weiter (Alter ab dem Ersten des Monats), und das Profil bittet, den Tag nachzutragen. Ältere Profile mit
  der Zahl `alter` gelten weiter, bis ein Geburtsdatum gesetzt ist.
- **Übernahme in den Lernsteig** (Plan C9, Ü1 a, Ü2 b): Im eigenen Profil der angemeldeten Aufsicht „🔑 In den
  Lernsteig übernehmen“ mit der Rolle dort (Eltern oder Lehrperson; bleibt hier als Feld `art` ohne Wirkung) —
  `KERN.person.uebernehmen`, docs/kern/rahmen.md 4.7. Gleiche Kennung, PIN und Sicherheitsfrage, neuer Code (einmal
  angezeigt); Runden und Einstellungen bleiben hier.
- **Klassenaufstieg** (Wunsch Patrik, LERN_Session14): `LS.aufsteigen(name)` setzt die Klasse um eins höher und hängt
  `{ von, nach, zeit }` an das Profilfeld `aufstiege`; nach der 6. Klasse nicht mehr (Lernsteig): Dort steht im Profil
  „📨 Einladung zum Lernsteig“ (EL1 a, `KERN.einladung`, docs/kern/rahmen.md 4.13) — Link zum Kopieren oder Datei
  `lernsteig-einladung.json` mit Vorname, Geburtsdatum oder -monat und Klasse 7; der Lernsteig füllt damit „Neues Konto“ vor.
  `LS.aufstiegZuruecknehmen(name)` nimmt den letzten zurück. Einzeln im Profil, für mehrere Kinder in Verwaltung →
  Konten → „Neues Schuljahr“, nach Klasse geordnet und vorab angekreuzt — bis zu den Gruppen (LERN-48) die
  Klassenorganisation der Lehrperson. Die Klasse von Hand ändern bleibt eine Korrektur. Beim nächsten Öffnen der
  Startseite zeigt `aufstiegFeier` (start.js) dem Kind einmal „Du bist jetzt in der n. Klasse!“ mit Konfetti
  (`LS.neuerAufstieg`, gesehen in `aufstiegGesehen`); das Abzeichen „Aufgestiegen“ 🏫 zählt die Aufstiege (1–5).
- **Wahl des Kindes** (VR1 a): Was das Kind auf der Stufenwahl oder der Spielkarte umstellt, steht im Profilfeld `wahl`
  (`LS.waehle`, `LS.waehleTimer`) und gilt vor der Vorgabe (`timerFuer`, `reihenfolgeFuer`, `vorlesenArt`). Hat die
  Aufsicht festgelegt (`fest`, `LS.setzeFest`), gilt die Wahl nicht; Stufenwahl und Karte zeigen den Wert mit 🔒
  (Klasse `aufsicht-fest`). Später kommt die Ebene Klasse dazwischen (VR2, VR3, mit den Gruppen).
- **Spielkarte:** Spiele mit `reihenfolge: true` haben einen vierten Schalter, der weiterschaltet: nach Stufe (Balken
  grau), geordnet (Balken gold), gemischt (Mischpfeil gold).
- **Tab Spiele:** zuoberst „▶️ Weiterspielen“ mit den letzten fünf Spielen (ohne Zufallsmix), Antippen startet die
  zuletzt gespielte Stufe, nach einer Endlos-Runde wieder endlos.
- **Statistik des Kindes:** „Das übe ich als Nächstes“ (Vorschläge, Fazit wenn freigegeben), „Meine Woche“, „Meine
  Runden“, „Meine Meldungen“. Alles andere nur für die Aufsicht. **Erfolge:** „🏆 Meine Podestplätze“ — Platz 1–3 der
  Endlos-Ranglisten dieses Geräts.

## 19. Kurztasten für Antwortknöpfe

Entscheid TK1 a mit Zusatz Patrik (LERN_Session13): Wer mit einer echten Tastatur spielt, wählt Antworten auch mit
Tasten. Ausgelegt für die Schweizer Tastatur (QWERTZ); gleiche Zeichen liegen in jedem Spiel auf denselben,
benachbarten Tasten. Code in `spiel.js`, Abschnitt „Kurztasten“; Spiele mit eigenen Knöpfen rufen `LS.kurztasten`.

| Antworten | Tasten | gemessen an |
|---|---|---|
| < = > | Y X C | Ort (`code`), dazu die Zeichen selbst |
| + − · : | V B N M | Ort, dazu `+ - * / :` |
| Satzzeichen „ “ ! , . ? und ⌫ | B V N , . - und die Rücktaste (unten rechts wie auf der Schweizer Tastatur; : wie oben auf M) | Ort, dazu die Zeichen selbst |
| Stellen E Z H T M, ZT, HT | E Z H T M, ⇧Z, ⇧H | Zeichen (`key`) |
| Ja und Nein, auch mit Bild davor („✅ Ja“) | J N (Meldung zum Netz-Falter, LERN_Session14) | Zeichen, erstes Wort ohne Bild |
| je ein Buchstabe oder eine Ziffer | er selbst (Ziffern nur ohne offene Zifferntastatur); bei doppelten der erste freie Knopf mit dem Zeichen (Buchstabier-Kacheln: das Wort tippen) | Zeichen |
| alles andere (Wörter, Zahlen, Bilder) | A S D F G H J K L, dann Q W E R T Z U I O P, in Bildschirm-Reihenfolge; nie Ziffern, damit die Taste 5 nie die Antwort „5“ meint | Ort |

- **Belegung erkennen:** Chrome und Edge nennen die Belegung (`navigator.keyboard.getLayoutMap`); dann tragen die
  Marken die Beschriftung der eigenen Tastatur (auf einer amerikanischen steht an derselben Stelle Z statt Y). Sonst
  gilt die Schweizer Belegung. Die Tasten nach Ort bleiben am selben Platz, die nach Zeichen folgen der Beschriftung.
- **Marke:** oben rechts am Knopf (Attribut `data-marke`, als `::after` gezeichnet, damit Text und Kennung des
  Knopfs gleich bleiben). Sie erscheint am Computer mit Maus (`hover: hover` und `pointer: fine`) oder nach dem ersten
  echten Tastendruck (gemerkt je Gerät in `lernspiele:tasten`); auf Tablet und Handy ohne Tastatur nie. Steht der
  Buchstabe oder die Ziffer sichtbar auf dem Knopf, entfällt sie; nennt nur `data-taste` das Zeichen, bleibt sie.
- **Gruppen:** Ruft ein Spiel `LS.kurztasten` erneut für dieselbe Box auf, ersetzt die neue Gruppe die alte. Schon
  gewählte Knöpfe (`gewaehlt`, `disabled`, `aria-disabled`) überspringt die Taste.
- **Vorrang:** Die Zifferntastatur hat die Ziffern, Enter und ⌫. Die jüngste sichtbare Gruppe gewinnt; verdeckte
  Antworten (`antworten-warten`) und Eingabefelder bleiben aussen vor.
- **Ohne Kurztasten** bleiben Spiele, die nur mit Zeigen, Ziehen, Raster, Brett oder Antippen im Text gehen, und Spiele
  mit eigener Tastenbedienung (`LS.kurztastenAus()`).
- **Annahmen bis zur Testrunde:** die Tasten für < = > und + − · :, die Grundreihe für alles andere.

## 20. Ganze Aufgabe im Bild

Entscheid BH1 a (LERN_Session13): Die ganze Aufgabe soll ohne Scrollen ins Bild passen — Handy 375×812, Tablet hoch
768×1024, Tablet quer 1024×768, Laptop 1366×768.

- **Rahmen** (`stil.css`, nach dem Handy-Block): (1) Unter 820 px Höhe verdichtet er wie unter 560 px Breite (Eule,
  Tasten 52 px, Ränder). (2) Breit und quer (ab 900 px, Querformat) steht die Zifferntastatur rechts neben der Aufgabe
  — nur, wenn sie direkt in der Spielfläche steht (`.karte > div > .tastatur`). (3) Sonst bleibt sie als Leiste unten im
  Bild (`position: sticky`), und die Aufgabe scrollt darüber.
- **Sprechblase und Tipp** (Entscheide BH2 a, BH2-T a; ersetzen den Ort aus T1 a): In der Runde zeigt die Blase
  höchstens zwei Zeilen (`span.blase-text`); ist der Text länger, steht „…“ und ▾, Antippen klappt auf und zu. Ein
  Hinweis nach einem Fehler steht immer ganz, 🗣️ liest immer alles. 💡 steht beim Antwortbereich ohne eigene Zeile:
  mit Zifferntastatur als Taste in ihrer untersten Reihe (mit Dezimaltaste wird OK schmaler), sonst rund und rechts in
  der letzten Zeile `auftrag` oder `frage` direkt in der Spielfläche (der Text fliesst herum), fehlen beide, rechts oben
  in der Spielfläche. Steht die Frage in einer eigenen Hülle, nennt das Spiel die Zeile mit dem Attribut
  `data-tipp-ziel`. Nie zwischen den Antworten.
- **Je Spiel** (BH3 a): Was danach noch überläuft, passt das Spiel selbst an (Grafik nach der Bildhöhe, `min()` mit
  `vh`, engere Abstände, Teile nebeneinander); Lesespiele nehmen `LS.lesetext`. Steht eine `.wahl` in einer Spalte eines
  Rasters, braucht sie `margin-inline: 0` — mit `margin: 0 auto` wird sie so breit wie ihr Mindestinhalt, und die
  Seite läuft seitlich über (Pflanzen-Bestimmer). Ein Spiel, das die Tastatur in einen
  eigenen Behälter setzt, bekommt (2) und (3) nicht und ordnet selbst.
- **Untergrenze** (Entscheid H1 a, LERN_Session28): Jede Grösse nach der Bildhöhe hat eine Untergrenze —
  `max(Mindestmass, min(…, calc(100vh - …)))`, wo der Platz schmal sein kann `max(min(Mindestmass, 100%), …)`, oder
  `min-width`/`min-height` derselben Achse im selben Regelblock. Lieber scrollen als nichts sehen: Ohne sie wurde die
  Breite unter etwa 480 px Bildhöhe null — Handy quer und das Spielfenster des Zufallsmix (ab 460 px hoch) zeigten
  leere Felder (Finger-Zähler Stufe 6, Bemerkungen 34 und 35; dazu Uhr, Kompass, Erdzeit-Leiter, Wassertropfen,
  Plan-Leser, Diagramm-Detektiv, Go-Brett, Roboter-Pfad). Das Mindestmass richtet sich nach der Grafik: Felder
  bleiben antippbar, Zahlen lesbar (Uhr und Kompassrose 160 px, Bretter und Pläne 200–300 px). Ausnahme nur mit
  dem Kommentar „ohne Untergrenze: <Grund>“ im Regelblock (feste Fenster). `tools/pruefe_skripte.js` weist jede
  Stelle ohne Untergrenze ab.
- **Messen:** `node tools/bildhoehe.js [Basis-URL] [spiel-id …]` (Server nötig; Chrome ohne Fenster, Messkind mit allem
  freigegeben). Je Gerät: Seiten mit Überlauf unten, mit der Aufgabe selbst über dem Rand (ohne Tipp-Zeile), mit der
  Zifferntastatur nicht ganz im Bild, und seitlich (Code 1). Dazu die Grafiken der Aufgabe (svg, canvas, img mit
  Klasse, nicht in Knöpfen, Eule mit Blase, Legende, Kopf): Geschrumpft heisst eine, deren kürzere Seite unter 100 px
  liegt und deren Massstab (gezeichnete Breite je Einheit der viewBox, bei img je Bildpixel) unter der Hälfte des
  kleinsten Massstabs derselben Klasse bei 1024 × 768 (fehlt der Vergleich, unter 40 px); sie wird aufgelistet
  (Code 1, H1 a). 1024 × 768 wird dafür immer mitgemessen. Der Massstab hängt nicht vom Inhalt ab: Eine lange
  Notenzeile ist flach, aber nicht geschrumpft; Grafiken, die schon dort klein sind (Nordpfeil), bleiben ruhig.
  Die niedrigen Fenster `--geraete=mix,handy-quer` (1024 × 460, 800 × 450) müssen nicht ins Bild passen, aber ohne
  zu kleine Grafik bleiben. `--css=datei` probiert CSS aus, ohne den Code zu ändern.

## 21. Notizblock für schriftliches Rechnen

Entscheide NB1–NB4 a (Wunsch Patrik, LERN_Session14). Code in `spiele/gemeinsam/notizblock.js` (Objekt `SCHRIFTLICH`,
nach `spiel.js` geladen in den 32 Spielen mit Notizen und in der Schriftlich-Werkstatt), Stil `.schriftlich` und
`.notizblock` in `stil.css`. Seit LERN_Session19 ist der Block ein Kern-Teil (`KERN.notizblock`, docs/kern/rahmen.md 4.23,
NB1 a der Reihe); `notizblock.js` gibt nur noch die Stellen, das Dezimalzeichen und den Ton mit, Verhalten und Aussehen
sind gleich geblieben. Der Lernsteig benutzt ihn ebenfalls.

- **Wann:** in Aufgaben, die Notizfelder zeigen (`ctx.notizen`) oder nur den Block anbieten (`ctx.notizblock(empfohlen)`:
  zusätzlich zu Notizfeldern oder wo sich eine Rechnung nicht sinnvoll zerlegen lässt; „Notizen: nie“ schaltet auch ihn
  ab). Bietet ein Spiel Notizen erst in einem späteren Schritt an (Probe-Stempel, Kompass), kommt
  der Knopf in diesem Moment (LERN_Session14). Dazu die Einstellung der Aufsicht
  „Notizblock für schriftliches Rechnen“ (global und je Spiel, `spieleWie: "notizen"`): **ab Stufe 4** (Standard) ·
  **immer, wo Notizen sind** · **nie**. Der Knopf „📝 Notizblock“ steht in der Zeile von „🙋 Melden“ (`nb-platz`), in
  jedem Spiel an derselben Stelle — beim Notizfeld selbst zerriss er den Aufbau (Rechen-Maschine: Feld auf dem Pfeil).
- **Ein Blatt mit mehreren Rechnungen** (Wunsch Patrik, LERN_Session15): Unter jede geschriebene Rechnung hängt
  „Weiterrechnen:“ (dieselben Vorlagen) die nächste, bis `MAX_SCHRITTE` = 6; jede trägt Nummer, Rechnung als Titel und ✕.
  Ihre erste Zahl ist, was das Kind ins Ergebnis der vorigen geschrieben hat (`geschrieben`: rechtsbündig, bei Komma die
  letzten Felder nach dem Komma; Geteilt von links; Lücken oder ein Komma in der Division → leer), änderbar — nicht das
  gerechnete Ergebnis, der Block prüft nichts. Eine Wahl, solange die letzte Rechnung noch nicht untereinander steht, ersetzt
  sie. **Plus und Minus gemischt:** jede Zahl ab der zweiten trägt ihr Zeichen als Knopf (`nb-op-wechsel`), Antippen
  wechselt + und −; die Vorlage gibt nur das Anfangszeichen, beide nehmen 2–4 Zahlen; abgewiesen wird nur ein Ergebnis
  unter 0. Das Ziffernfeld steht fest unten im Block (`nb-fuss`) und schreibt das eingestellte Dezimalzeichen.
- **Vorlagen (NB1 a):** Plus und Minus (2–4 Zahlen, Zeichen je Zahl), Mal (einstellig wie die Werkstatt; mehrstellig mit einer versetzten
  Zeile je Ziffer, höchste zuerst, dann Übertrag und Summe), Geteilt („a : b =“ mit Ergebnis-Häuschen, darunter
  2 × Stellenzahl Zeilen für die Schritte, links eine Zeichenspalte), Häuschen frei (10 × 8). Das Kind wählt die
  Vorlage, tippt seine Zahlen ein (höchstens bis zur Million, `MAX_STELLEN`, und 3 Stellen nach Punkt oder Komma) und
  „Untereinander schreiben ➜“. **Dezimalzahlen** (LERN_Session14): Plus und Minus richten am Komma aus; eine senkrechte
  Kommalinie (`nach-komma`) steht links der Zehntel, die Spalten heissen z, h, t in neutraler Farbe (`st-nk`, nie
  Stellenfarben). Bei Geteilt darf nur die erste Zahl ein Komma haben. Bei Mal auch die zweite (NB3 a, LERN_Session19):
  dann rechnet der Block ohne Komma, darunter steht die Kommaregel („2 + 1 = 3 Stellen nach dem Komma“, `nb-kommaregel`),
  das Ergebnis hat eine Spalte für die Null vor dem Komma (bis LERN_Session19: nur die erste Zahl). **Eigenes Ziffernfeld** im Block
  (`nb-tasten`, 0–9, Komma, ⌫): schreibt in das gewählte Zahlenfeld oder Häuschen, ohne ihm den Fokus zu nehmen; die
  Felder des Blocks öffnen die Tastatur des Geräts nicht (`inputmode` none).
  Häuschen nehmen eine Ziffer und springen in Schreibrichtung weiter (Ergebnis, Überträge, Teilprodukte nach links,
  Häuschen und Division nach rechts); die Rücktaste im leeren Häuschen geht zurück.
- **Nicht bewertet (NB3 a):** nichts geprüft, nichts übernommen, nichts gespeichert. Jede neue Aufgabe schliesst und
  leert den Block. Vorgehen `notiz: "block"` („mit Notizblock“ in der Statistik), geht vor `benutzt`; das Abzeichen
  „Kopfrechner“ zählt nur `ohne`. Tasten im Block lösen keine Kurztasten des Spiels aus.
- **Platz:** ab 1100 px oben rechts, über der Entwickler-Leiste, `.buehne` rückt 480 px nach links; quer ab 980 px
  ebenso, schmaler (360 px, `--nb-breite`), damit die Aufgabe rund 620 px behält; sonst (Handy, Tablet hochkant) unten
  wie ein Blatt, die Seite bekommt unten Platz zum Hinaufscrollen (LERN_Session15: zwischen 561 und 1100 px deckte der
  Block die Aufgabe zu). Rechts daneben unter 620 px ginge nicht: die `@media`-Regeln der Spiele rechnen mit der ganzen
  Fensterbreite. ▁ verkleinert und gibt den Platz frei, ✕ schliesst und leert.
- **Gemeinsames Raster (NB4 a):** `SCHRIFTLICH.raster(n, { links, rechts })` mit `kopf()`, `zahl(z, { zeichen, rechts })`,
  `reihe(mache, …)`, `strich()`; `SCHRIFTLICH.rechne(art, zahlen)` rechnet spaltenweise mit Überträgen (Subtraktion:
  Übertrag unten dazu, wie beim Ergänzen — mit dem Lehrmittel abzugleichen). Die Schriftlich-Werkstatt baut ihre
  Tabelle damit; ändert sich ein Verfahren, ändert es sich an einer Stelle.

## 22. Bildersammlung

Entscheid B1 a (LERN_Session16, Bemerkungen 12–22). `spiele/gemeinsam/bilder.js` (Objekt `BILDER`) ist die **einzige
Quelle** für Bilder, die es nicht als passendes Emoji gibt: Lebewesen (Luchs, Gämse, Feuersalamander …), Dinge von
früher (Waschbrett), Schulinstrumente (Triangel), Geschichte (Faustkeil, Pfahlbau, Römerstrasse, Pyramiden, Tempel,
Funde wie Webgewicht und Wachstafel; LERN_Session17, Bemerkungen 23–32) und die Menschen der Urzeit (Vormensch,
Frühmensch, früher Homo sapiens, Neandertaler; MF1 a). Ein Emoji, das etwas Heutiges zeigt (🪓 Axt für ein Steinwerkzeug,
🧑 heutiger Mensch für einen Frühmenschen), gilt als unpassend. Bilder stammen aus der Zeit, um die es geht (Entscheid
BZ1 a): ein Ding zeigt das Bild seiner Hauptkultur, Einträge je Kultur (etwa „Gab es das schon?“, Funde) je ihr eigenes
— der Helm des Legionärs ist ein anderer als der griechische aus Bronze. Ein Spiel zeichnet sie nicht selbst.

- **In Inhaltslisten** steht ein solches Bild wie ein Emoji in der Bildzelle, als `svg:<name>`
  (`["Luchs", "svg:luchs", …]`). Der Name ist klein, ohne Umlaute (ä → ae).
- **Zeichnen:** `LS.bild(b, klasse = "bild")` gibt ein `<span>` — ein Emoji als Text, `svg:<name>` als Zeichnung
  (Klasse `gezeichnet`, so gross wie ein Emoji derselben Schrift). `LS.auswahl`, `LS.reihenfolge` und `LS.koerbe`
  benutzen es von selbst, ein Spiel gibt `bild` einfach weiter; die Ablage von `LS.reihenfolge` zeichnet ein
  `svg:` aus `opt.ablage` ebenfalls. In Fliesstext (Lösungssatz, Lob, Tipp)
  `LS.mitBildText(b, text)`: Emoji davor, eine Zeichnung entfällt. `LS.istZeichnung(b)` unterscheidet.
- **Laden:** Eine Seite, deren Inhalte `svg:` nennen, lädt `../gemeinsam/bilder.js` nach `entwicklung.js` (heute
  Früher–heute, Instrumente, Tier-Sortierer, Lebensraum, Zeitstrahl-Sortierer, Kulturen-Koffer, Erdzeit-Leiter und die
  Startseite für die Listenansicht der Verwaltung).
  Fehlt die Sammlung oder ein Name, zeigt `LS.bild` „❔“ und meldet `Bild svg:… fehlt` auf der Konsole; das
  Testskript zählt das als Fehler, ebenso ein `svg:` im Text der Fläche oder der Lösung.
- **Prüfansichten:** Beide Listenansichten (Entwickler-Modus, Abschnitt 11, und Prüfung je Eintrag, Abschnitt 17)
  zeichnen jedes `svg:<name>` einer Zelle mit `LS.zelleMitBildern` — allein in der Zelle gross, im Text so gross wie
  die Emojis daneben; der Rohtext steht im Tooltip.
- **Ein Bild je Eintrag:** `name` (wofür es steht, mit den Kennzeichen, an denen man die Art erkennt), `box`
  (viewBox), `svg` (nur Formen mit eigenen Farben, keine Klassen, keine Skripte). Ein neues oder geändertes Bild gilt
  wie ein Listeneintrag als ungeprüft (E1 a).
- **Nicht in der Sammlung:** Zeichnungen, die ein Spiel aus Werten baut (Gegenteil-Wippe: Grösse je Stufe, Pakete;
  Geometrie, Uhren, Zahlenbilder).

## 23. Speicher (`lernspiele:*`)

Seit LERN_Session26 (Kern 1.34.0, docs/konzept_gruppen.md 5a, Plan D11, D11 a, D11-W a; wie im Lernsteig) liegen
`protokoll`, `rekorde`, `meldungen` und `geloescht` in IndexedDB `lernspiele-ablage` (`GROSS` in `spiel.js`), der Rest in
`localStorage` (Personen, Einstellungen, Freigabe, Anmeldung …). `localStorage` hat je Ursprung nur 5 MiB für alle Apps
unter `patrikneunteufel.github.io` zusammen. Den Abgleich-Ordner merkt der Browser weiter in der IndexedDB `lernspiele`.

- **Start erst nach dem Laden:** `LS.spiel` (und damit `spielMitStimme`), `start/start.js` und `mix/mix.js` starten über
  `LS.nachBereit(f)`; der Abgleich und der Umzug alter Stände (Profile → Personen, Felder der Runden, Kennungen) laufen
  über `LS.beiBereit(f)`. `LS.bereit()` gibt das Versprechen. Wer einen grossen Schlüssel vor dem Laden liest, bekommt
  vom Kern einen Fehler („vor bereit() gelesen“) — so fällt eine vergessene Stelle sofort auf.
- **Ohne IndexedDB** (Testskripte im Ersatz-DOM, gesperrter Speicher, sehr alte Browser) lädt `spiel.js` synchron am
  Ende und alles läuft wie bis Kern 1.33 in `localStorage` — darum laufen `pruefe_spiele.js` und die Klickzahlen
  unverändert. Lässt sich IndexedDB nicht öffnen, fällt der Kern ebenfalls auf `localStorage` zurück.
- **Umzug:** Beim ersten Start mit IndexedDB zieht der Kern die vier Schlüssel aus `localStorage` um und löscht sie dort
  erst nach dem Schreiben; liegt ein Schlüssel in beiden (ein Tab der alten Fassung schrieb danach), werden Runden und
  Rekorde nach Kennung, Löschvermerke und Meldungen nach ihren Regeln vereinigt.
- **Andere Tabs:** Speichert ein anderer Tab Runden oder Meldungen, zeichnet die Startseite neu (BroadcastChannel,
  `LS.SPEICHER.beiFremdAenderung`), ausser jemand tippt gerade.
- **Speicher voll:** Scheitert das Speichern einer Runde oder eines Rekords (in `localStorage` sofort, in IndexedDB über
  `beiFehler`), steht oben auf der Seite ein Band (`.speicher-voll`, reserviert) für eine erwachsene Person: in der
  Statistik sichern und alte Runden löschen. Bis LERN_Session26 ging die Runde still verloren.
- **Verwaltung → Einstellungen → Speicher:** Belegung des kleinen Speichers und der Ablage (`KERN.speicher.belegung`),
  Warnung ab 80 %, Knopf „Browser bitten, nichts von selbst zu löschen“ (`persist()`).
- **Erinnerung ans Sichern:** Ohne Abgleich-Ordner steht in der Verwaltung oben ein Hinweis, wenn es Runden gibt und seit
  14 Tagen nicht gesichert wurde (ab `letzteSicherung`, sonst ab der ältesten Runde) — mit dem Hinweis auf die
  Sieben-Tage-Regel von Safari. Als Sicherung zählen „💾 Alle sichern“ in der Statistik und „💾 Abgleich-Datei sichern“;
  die Sicherung eines einzelnen Kindes nicht.

## 24. Abschluss-Animation (`feier.js`)

Seit LERN_Session27 (docs/konzept_abschluss_animationen.md, Entscheide AN1 a, AN2 a, AN3 a). Die Animation eines Spiels
steht **im Katalog**, im Eintrag als `feier: { muster, … }` (Entscheid GS1 a, LERN_Session32: einzige Quelle, damit die
Startseite das Kartenbild zeichnen kann; docs/eulenpfad/konzept_gestaltung.md). `LS.spiel` übernimmt sie von dort
(`def.feier`); eine Angabe in `LS.spiel({ …, feier })` meldet die Konsole als Fehler. Braucht die Animation Daten des
Spiels, nennt sie diese beim Namen (Entscheid SK1 a): `feier.karte: "schweiz"`, Ziele wie `{ flaechen: "ostschweiz" }`,
dazu `daten: ["karte.js", "orte.js"]` (Dateien im Spielordner, die die Startseite nachlädt). Die Datendatei meldet Karte
und Auswahl an (`LS_FEIER.kartenDaten(name, { karte, auswahl: { name: karte => … } })`, in `schweiz-karte/orte.js` mit
OSTSCHWEIZ und STADT_MIN); unbekannte Namen geben kein Bild. Das Spiel lädt
`../gemeinsam/feier.js` nach `spiel.js` und nennt im Katalog `einstellungen: ["feier"]`. Das Schlussbild zeigt sie (`LS_FEIER.zeige`) zwischen „Geschafft“ und den Sternen, wenn die
Einstellung „Abschluss-Animation“ (`EINSTELLUNGEN.feier`, global und je Spiel) an ist; dann entfällt das Konfetti.
Spiele ohne `feier` behalten das bisherige Schlussbild mit Konfetti.

- **Stufe ändert das Ziel, Sterne schmücken aus:** 2 Sterne ein Fähnchen oder funkelnde Sterne (`data-schmuck="2"`),
  3 dazu Funken oder eine Sternschnuppe (`data-schmuck="3"`); 1 Stern die Animation der Stufe ohne Schmuck. Die
  Bewegung beginnt kurz nach dem Aufbau (0,15 s), damit sie nicht ruckelt.
- **Ein Tippen** springt ans Ende (SMIL `setCurrentTime`); die Knöpfe des Schlussbilds sind sofort bedienbar. Die
  Animation ist Schmuck (`aria-hidden`).
- **„Bewegung reduzieren“** des Geräts (`prefers-reduced-motion`): gleich das Endbild ohne Bewegung (Klasse `ruhig`).
- **Muster** (gebaut; die übrigen folgen mit den Piloten, Konzept, Abschnitt 7):

  | Muster | Angabe | Pilot |
  |---|---|---|
  | REISE | `{ muster: "reise", reisender: "rakete" \| "sonde", ziele: { s1 … s6 } }`, Ziel `"mond"`, `"mars"`, `"jupiter"`, `"saturn"`, `{ um: "erde" }` oder `{ rand: true }` (die acht Planeten) | Rechen-Rakete |
  | ZOOM | `{ muster: "zoom", ziele: { s1: 4, s2: 4.6, … } }`: Zahlenstrahl, je Stelle nach dem Komma eine Lupe tiefer, Landung auf der Zahl; Zahlen über `LS.dezimalText` (Punkt oder Komma); `stellen: { sX: n }` setzt die Tiefe, sonst zählt die Zahl | Dezimal-Rakete |
  | ZYKLUS | `{ muster: "zyklus", bilder: "mond", ziele: { s1: "neu", … } }`: der Mond der Phase steigt hinter dem Hügel auf und zieht im Bogen über den Himmel (beim Neumond die Sonne daneben); als Liste (`["neu", "sichel"]`) die Phasen der Reihe nach, die letzte gross. Phasen `neu`, `sichel`, `halb`, `dreiviertel`, `voll`, zunehmend rechts hell wie im Himmels-Forscher | Himmels-Forscher s1–s4 |
  | SZENE | `{ muster: "szene", szene: "eule-vollmond" }`: ein festes Bild für den Endgegner | Himmels-Forscher s6 |
  | WACHSEN | `{ muster: "wachsen", bilder: "baum", ziele: { s1: "stamm", … } }`: der Baum wächst Teil um Teil bis zum Teil der Stufe (`stamm`, `ast`, `aeste`, `blaetter`, `blueten`, `fruechte`; aus den Blüten werden Äpfel, die Eule setzt sich in die Krone); Wörter nur als leere Kärtchen | Wortfamilien-Baum |
  | BAUEN | `{ muster: "bauen", bilder: "mauer", ziele: { s1: [2, 3, 4], … } }`: Zahlenmauer aus den Grundsteinen der Stufe, Stein um Stein von unten; jeder Stein trägt `data-stein="r,i"` und `data-wert`, der Test rechnet die Summenregel und die Zahl im Stein nach | Zahlenmauer-Baumeister |
  | AUFTRITT | `{ muster: "auftritt", bilder: "musik", ziele: { s1: 1, … s5: 5, s6: "orchester" } }`: Eulen treten mit Trommel, Querflöte, Geige, Trompete, Cello auf (Solo bis Quintett, im Orchester Streicher dahinter), richtig gehalten; je Auftritt ein Ton | Instrumenten-Kenner |
  | SAMMELN | `{ muster: "sammeln", bilder: "angel", ziele: { s1: 1, … } }`: die Eule angelt so viele Fische, sie stehen aufrecht nebeneinander im Eimer (zählbar) | Anlaut-Angel |
  | KARTE | `{ muster: "karte", karte: KARTE, ziele: { sX: { flaechen: [d …], punkte: [[x, y] …], ausschnitt } } }`: die Eule fliegt von West nach Ost über die stumme Karte aus den Daten des Spiels, was sie überfliegt, leuchtet auf; `ausschnitt` zeigt nur die Gegend der Ziele | Schweiz-Karten-Suche |

  **Ton** (Regel 8 des Konzepts): Der Rahmen gibt `LS_FEIER.zeige` seinen Ton als `klang` mit (`ton`, nimmt auch eine
  Folge `[[Frequenz, Dauer], …]`); er beachtet den Schalter 🔇, also klingt eine Animation nur mit Ton an. Ein Tippen ans
  Ende bricht die ausstehenden Töne ab. **Mengen** (Musikerinnen, Fische, Kartenstücke) zählt der Test: `data-anzahl` am
  Bild gegen die Stücke mit `data-stueck`.

  **Bilder je Spiel** (`feier.bilder`, `BILDER` in `feier.js`, seit dem Ausrollen AR1 a): ein Muster hat mehrere Bilder;
  jedes folgt den Stufen seines Spiels. Block M1 (Stellenwert, Dezimal):

  | Muster · bilder | Angabe je Stufe | Spiel |
  |---|---|---|
  | REISE · `stellen` | ganze Zahl (`472`): Stellentafel bis zu ihrer höchsten Stelle, die Lupe wandert von E nach links | Stellen-Detektiv |
  | REISE · `seerosen` | `{ start, schritt, anzahl = 4 }`: Frosch hüpft über Seerosen mit den Zahlen (`data-wert`) | Zahlen-Hüpfer |
  | REISE · `rutsche` | `{ werte: [...], stellen, einheit?, wertStellen? }`: Hügel zwischen den Nachbarn, Gipfel = Mitte, der Wagen rollt zur gerundeten Zahl | Dezimal-Rutsche |
  | REISE · `komma` | `{ von, faktor, durch? }`: Ziffern rutschen in der Stellentafel, das Komma bleibt; Rechnung darunter (`data-wert` = Ergebnis) | Stufenzahl-Schieber |
  | SAMMELN · `post` | ganze Zahl oder Teile `{ M: 2, H: 14, E: 5 }`: Briefe in die Fächer, Nullen leer, mehr als 9 wird gebündelt | Tabellen-Post |
  | SAMMELN · `punkte` | ganze Zahl: so viele Punkte je Spalte wie die Ziffer | Punkte-Schieber |
  | SAMMELN · `tresor` | 1–6: das Rad dreht, die Tür geht auf, je Stufe ein wertvolleres Stück (Münze bis Diamant) | Zahlenrätsel-Tresor |
  | BAUEN · `baukasten` | `{ H: 4, E: 2 }`: Dienes-Bausteine je Stelle, Rechnung mit der Zahl darunter | Zahlen-Baukasten |
  | BAUEN · `karten` | Ziffern als Text (`"97532"`): Karten legen sich zur Zahl, ab fünf Stellen mit Lücke | Ziffernkarten |
  | ZOOM · `figur: "kaefer"` | wie ZOOM, ein Marienkäfer landet statt der Rakete | Zehntel-Lupe |

  Block M2 (Zahlen, Teiler, Begründen; LERN_Session28) — jedes Bild prüft die Zahlen, die es zeigt, und gibt ohne
  stimmige Angabe kein Bild (der Test meldet dann „keine Animation“):

  | Muster · bilder | Angabe je Stufe | Spiel |
  |---|---|---|
  | REISE · `rutsche`, `figur: "kugel"` | `{ werte: [347], auf: 10 }`: ganze Zahlen, auf den Zehner, Hunderter … | Runden-Rutsche |
  | ZOOM · `strahl` | `{ von, bis, wert, ganz? }`: der Pfeil trifft die Zahl auf dem Strahl (zehn Abschnitte); `ganz` zeigt darüber den Ausschnitt auf dem grösseren Strahl | Zahlenstrahl-Pfeil |
  | SAMMELN · `tafel` | `{ von, bis, reihe?, finde? }`: Tafel Zeile um Zeile (bis 50 mit Zahlen), die Reihe als Muster, ab 101 eine Seite im Tausenderbuch; `finde`: die Lupe sucht die Zahl | Hundertertafel-Detektiv |
  | SAMMELN · `spuernase` | `{ zahl, teiler, paare? }`: der Hund findet die Teiler als Knochen; mit `paare` (alle Teiler, geprüft) Bögen für die Teilerpaare, ein Teiler mit sich selbst im Ring | Teiler-Spürnase |
  | ZOOM · `radar` | `{ a, op, b, ra, rb }` oder `{ teil, ganz, prozent }`: Radar, je Stufe schärfer; Überschlag wie im Spiel (erste Ziffer, bei der Division kompatible Zahlen, 0.6- bis 1.6-mal) | Überschlags-Radar |
  | REISE · `velo` | `{ v, zeiten, stunden?, frage?, fehler?, vergleich? }`: Velo und Tabelle Zeit → Weg; rückwärts, berichtigter Fehler, zwei Velos | Velo-Tabelle |
  | REISE · `krokodil` | `{ links, rechts }` (Zahl oder `{ a, op, b }`): das Maul öffnet sich zur grösseren, darunter < oder > | Vergleichs-Krokodil |
  | SAMMELN · `blitz` | `{ wuerfel }`, `{ zehner }` oder `{ stellen }`: Würfelbild, Zehnerfeld(er), Dienes-Material blitzen auf | Punkte-Blitz |
  | BAUEN · `kette` | `{ folge, weiter, regel? }`: Perlen in den Farben des Spiels (`r`, `b`, `g`) oder mit Zahlen; Muster und Folge geprüft | Muster-Fortsetzer |
  | SAMMELN · `korb` | `{ art: "spar" \| "stueck" \| "gramm", x, rp }`: Tabelle Spalte um Spalte, dazu Sparschwein, Korb oder Säckchen; Folge gleichmässig, Preise proportional | Preis-Tabelle |
  | SAMMELN · `haende` | `{ n, vergleich?, rest?, blitz? }`: Finger strecken sich ab dem Daumen; Würfel und Zehnerfeld daneben, fehlende Finger bis 10, Blitz mit Decke | Finger-Zähler |
  | BAUEN · `beweis` | `{ art: "paare" \| "gruppen" \| "verdoppeln" \| "ausgleich" \| "quadrat" \| "winkel", … }`: je Stufe eine Begründung aus dem Spiel mit Steinen und Figuren | Stimmt immer? |

  Block M3 (Rechnen; LERN_Session28) — Rechnungen als Liste aus Zahlen und Zeichen (`[9, "×", 6, "−", 6]`, Punkt vor
  Strich), die das Bild nachrechnet (`wertVon`):

  | Muster · bilder | Angabe je Stufe | Spiel |
  |---|---|---|
  | BAUEN · `punktfeld` | `{ zeilen, spalten, einheit?, rechnung, luecke? }`: Punktefeld Reihe um Reihe, `einheit` 10 Zehnerstangen, 100 Hunderterplatten; die Rechnung muss zum Feld passen | Einmaleins-Blitz |
  | SAMMELN · `reste` | `{ zahl, teiler, ding? }`: reihum auf die Teller, der Rest ins Glas; ab 7 je Teller die Zahl auf dem Teller | Rest-Rätsel |
  | BAUEN · `ergaenzen` | `{ start, ziel, art: "zehnerfeld" \| "hunderter" \| "balken", von? }`: was da ist und was dazukommt | Zehner-Ergänzer |
  | BAUEN · `haus` | `{ dach, stockwerke }`: Dach mit der Zahl, Stockwerke mit zwei oder drei Zahlen (Summe geprüft) | Zahlenhaus |
  | WACHSEN · `spiegel` | `{ zahl, halb? }`: Punkte oder Dienes und ihr Spiegelbild; `halb` teilt am Spiegel | Doppel-Spiegel |
  | BAUEN · `waage` | `{ links, rechts }`: Waage neigt sich und steht gerade, beide Seiten gleich (geprüft) | Zahlen-Waage |
  | BAUEN · `schriftlich` | `{ zahlen, op: "+" \| "−" \| "×" }`: untereinander, Ziffern und Überträge von rechts (Minus ergänzend) | Schriftlich-Werkstatt |
  | BAUEN · `malkreuz` | `{ a, b, raetsel? }`: Malkreuz Feld um Feld; `raetsel`: eine Randzahl erst „?“ | Malkreuz |
  | SAMMELN · `trick` | `{ zeilen }`: Rechnung, Trick, Ergebnis — alle gleich viel; die Lupe untersucht | Rechentrick-Detektiv |
  | BAUEN · `maschine` | `{ start, kaesten, weiche? }`: die Zahl läuft über das Förderband durch die Kästen; Weiche „gerade?“ mit ✓ und ✗ | Rechen-Maschine |
  | ZOOM · `zielscheibe` | `{ karten, rechnung, ziel, alle? }`: Karten legen sich zur Rechnung, der Pfeil trifft | Zielzahl-Jagd |
  | SAMMELN · `probe` | `{ rechnung, art: "umkehr" \| "endziffer" \| "ueberschlag", ra?, rb? }`: Heft, Probe, Stempel | Probe-Stempel |
  | SAMMELN · `teller` | `{ teller, schale? }`: Guetzli wandern, bis alle Teller gleich viel haben, der Rest in die Schale | Gerecht-Teiler |

  Block M4 (Sachrechnen, Grössen; LERN_Session29) — Uhrzeiten, Geld, Umwandlungen und Gleichungen rechnet jedes Bild
  nach (Einheiten je Familie wie die Treppen der Spiele: Längen bis km, Hohlmasse, Gewichte bis t, Zeit, Geld,
  Flächenmasse bis km²). Dinge, die das Spiel als Bildzeichen (Emoji) zeigt, zeigt das Bild ebenso; ein `svg:<name>`
  aus der Bildersammlung zeichnet `bildzeichen` über `LS.bild` gleich gross und mittig (seit LERN_Session32, ZS2 a:
  Mondlandung, Karavelle im Zeitstrahl-Sortierer). ZYKLUS nimmt
  eigene Bilder (`BILDER.zyklus`). Geld schreibt die Klasse der Stufe (`feier.klasse` = Basisklasse des Spiels, wie
  `LS.geldText`):

  | Muster · bilder | Angabe je Stufe | Spiel |
  |---|---|---|
  | ZYKLUS · `uhr` | `{ von, zeit, digital? }` (Zeiger drehen zur Uhrzeit), `{ von, dauer, zerlegen? }`, `{ von, bis }` (Zeitspanne, bis 60 min als Torte), `{ sekunden }` oder `{ minuten }` (Stoppuhr) | Uhr-Werkstatt, Zeit-Schätzer |
  | SAMMELN · `kasse` | `{ legen }` (Stücke in Rappen) oder `{ preise, menge?, bezahlt, zurueck, wenig? }`: Münzen und Noten wie im Spiel fallen in die Kasse; Rückgeld nachgerechnet, `wenig`: so wenige Stücke wie möglich | Kiosk-Kasse |
  | BAUEN · `treppe` | `{ von: [[3, "m"], [25, "cm"]], nach }`: Einheiten-Treppe, die Karte springt Stufe um Stufe mit dem Faktor; `{ auslegen: ["dm²", "cm²"] }` (10 × 10 Quadrate); `{ lineal: [35, 27] }` (Längen in mm auf dem Lineal) | Masse-Umwandler, Flächenmass-Treppe |
  | ZOOM · `messband` | `{ wert, einheit, nach, rueck?, plus? }`: Messband, je Stelle nach dem Komma eine Lupe tiefer, der Zeiger landet; darunter die Umwandlung | Komma-Messband |
  | REISE · `zug` | `{ halte, summe?, formate?, in?, dezimal? }`: Halte mit Zeiten (beim Umsteigen zwei), je Fahrt ein Zug, über Mitternacht Nachthimmel; Zeitspanne oder Summe der Fahrzeiten, auch in Dezimalstunden | Fahrplan-Rechner |
  | REISE · `kompass` | `{ schritte: [{ r, e }], unwichtig?, saeulen? }`: der Kompass geht den Rechenweg Karte um Karte ab, am Ziel das Ergebnis mit Einheit; unwichtige Angabe durchgestrichen, Säulendiagramm als Quelle | Sachaufgaben-Kompass |
  | SAMMELN · `buch` | `{ art: "dazu" \| "weg" \| "mal" \| "luecke" \| "teilen" \| "angaben", bild, gleichung, wert }`: links die Geschichte mit Bildzeichen, rechts die Rechnung, „?“ wird zur Zahl | Rechengeschichten |
  | SAMMELN · `platzhalter` | `{ gleichungen: [{ gl, wert, umkehr? }] }`: die Karte mit „?“ dreht sich um, darunter die Probe mit der Umkehrrechnung | Platzhalter-Geschichten |
  | BAUEN · `schaetzen` | `{ waage }`, `{ reihe }` oder `{ ding, wert, einheit, mass: "lineal" \| "waage" }`: Wippe, Dinge von leicht zu schwer, Lineal oder Waage mit Anzeige | Schätz-Waage |
  | SAMMELN · `wippe` | `{ wippe }`, `{ paar, merkmal: "lang" \| "schnell" \| "gross" }`, `{ reihe, hervor? }`, `{ pakete }`: Wippe, Balken, Wettlauf, Reihe nach Grösse, zwei Wippen mit Paketen wie im Spiel | Gegenteil-Wippe |

  Block M5 (Geometrie; LERN_Session29) — Würfelgebäude wie im Würfelbau-Blick (von vorne rechts oben, Bauplan Zeilen
  hinten → vorne), mehrere Gebäude in einem Bild im selben Massstab; Linien zeichnen sich (`zeichne`, gestrichelte
  blenden ein):

  | Muster · bilder | Angabe je Stufe | Spiel |
  |---|---|---|
  | BAUEN · `spiegelraster` | `{ breite, hoehe, zellen, achse \| achsen \| schub }`: Bild an der senkrechten, waagrechten, schrägen Achse, an zwei Achsen oder verschoben; im Raster und nicht auf der Figur (geprüft) | Spiegel-Raster |
  | REISE · `koordinaten` | `{ tafel: [E, Z] }`, `{ punkt }`, `{ figur, schub? \| fehlt? }`: Hundertertafel, Weg zum Schatz, Figur verschieben oder zeichnen, fehlende Quadratecke (geprüft) | Koordinaten-Schatzsuche |
  | BAUEN · `formen` | `{ formen, gedreht?, ecken? }` oder `{ eigenschaften: "rechteck" }`: Formen und Körper, Ecken mit Zahl; Rechteck mit rechten Winkeln und Symmetrieachsen | Formen-Detektiv |
  | BAUEN · `pixel` | `{ figuren, umfang? }`: Häuschen zählen, zwei Figuren vergleichen, Umfang in Häuschen-Seiten | Flächen-Pixel |
  | BAUEN · `pentomino` | `{ breite, hoehe, teile }`: Teile füllen den Umriss lückenlos (geprüft) | Pentomino-Puzzle |
  | BAUEN · `wuerfelbau` | `{ plan, ansichten?, zahlen? }`: Gebäude, Ansichten oben, vorne, rechts wie im Spiel, Bauplan mit Zahlen | Würfelbau-Blick |
  | BAUEN · `netz` | `{ wuerfel: "kreuz" \| "treppe", gegenueber?, augen? }`, `{ quader: [l, b, h] }`, `{ pyramide }`: Netz und Körper; Augen der Gegenseiten zusammen 7 (geprüft) | Netz-Falter |
  | BAUEN · `rechtecke` | `{ rechtecke, zeige: "flaeche" \| "umfang" \| "beide", hervor? }`: Rechtecke mit Fläche und Umfang; das hervorgehobene hat die grösste Fläche (geprüft) | Rechteck-Labor |
  | REISE · `kipper` | `{ weg, oben? }`: Wegkarte und Spielwürfel nach jedem Kipp (Kippregel und Startlage des Spiels) | Würfel-Kipper |
  | BAUEN · `geo` | eine der Figuren `rechteck-kreis`, `sechseck-kreis`, `parallel-senkrecht`, `schnittpunkt`, `quadrat-diagonalen`, `alles` | Begriffs-Geodreieck |
  | SAMMELN · `merken` | `{ dinge, art: "fehlt" \| "neu" \| "tausch" \| "dreh" \| "farbe", i, mit?, zu? }` oder `{ dinge, aenderungen }`: Bildzeichen oder Formen des Spiels | Merk-Blick |
  | BAUEN · `zaehler` | `{ plaene, dazu? }` oder `{ kiste: [l, b, h], da }`: Gebäude vergleichen, gleich viele bauen, Kiste füllen | Würfel-Zähler |
  | BAUEN · `quader` | `{ masse, einheit?, da? }` oder `{ gross: [[w, e] × 3], in, gitter? \| wasser? \| liter?, zeile? }`: Quader aus Würfeln, grosse Quader mit Massen, Liter | Quader-Volumen |

  Block A (Mathe M6, Deutsch Teil 1; LERN_Session29) — Brüche übereinander (`bruchBild`, `zeileMitBruechen`); in
  Deutsch ohne Lesetext. AUFTRITT und KARTE nehmen eigene Bilder (`BILDER.auftritt`, `BILDER.karte`). `erscheine`
  blendet bis zur eigenen Deckkraft eines Teils (`opacity`), sonst bis 1:

  | Muster · bilder | Angabe je Stufe | Spiel |
  |---|---|---|
  | BAUEN · `pizza` | `{ brueche, gleich? }`: Pizzen, Zeichen dazwischen nachgerechnet | Bruch-Pizzeria |
  | BAUEN · `schoggi` | `{ a, op: "+" \| "−", b }`: Tafel mit gemeinsamem Nenner, gekürzt, gemischte Zahl | Schoggi-Brüche |
  | BAUEN · `prozent` | `{ bruch, feld?, folge? }`, `{ von: [p, rp] }`, `{ teil: [k, n] }`: Bruch, Dezimalzahl, Prozent | Prozent-Brücke |
  | BAUEN · `mittelwert` | `{ werte, art: "spanne" \| "ausgleich" \| "mittel", fehlt?, mittel? }` | Mittelwert-Türme |
  | WACHSEN · `diagramm` | `{ art: "strich" \| "saeulen" \| "kreis" \| "linie", … }`: Strichliste, Säulen (fehlt, differenz, mittel, gruppen, total), Kreis (prozent), Linie | Daten-Detektiv, Diagramm-Wahl |
  | SAMMELN · `zufall` | `{ sack \| rad, ziel, fuenf?, zahl? }`, `{ vergleich }`, `{ summe }`: Skala mit den Stufen des Spiels | Zufalls-Skala |
  | SAMMELN · `sortieren` | `{ regel, kisten, teile, ziel?, zaehlen? }`: jeder Klotz in genau eine Kiste (geprüft) | Sortier-Kiste |
  | SAMMELN · `kombinationen` | `{ art: "kleider", anzahl }` oder `{ art: "glace", sorten, kugeln, reihenfolge?, wiederholung?, gefaess }`, `zahl` geprüft | Möglichkeiten-Finder |
  | AUFTRITT · `silben` | `{ bild, silben, ordnen? }`: Silbenbögen und Klatschen | Silben-Klatscher |
  | SAMMELN · `reime` | `{ paare, nicht? }` | Reim-Paare |
  | SAMMELN · `zwillinge` | `{ paare }`: Gross- und Kleinbuchstabe je Sockenpaar | Buchstaben-Zwillinge |
  | SAMMELN · `laternen` | Zahl 1–6 | Blitzlesen |
  | ZOOM · `lupenzoom` | Ziel im Bild (`szene: "fern"`: Fernglas) | Lese-Detektiv, Sachtext-Spurensuche |
  | KARTE · `spurweg` | Zahl 1–6 | Wort-Spürnase |
  | AUFTRITT · `theater` | Gefühle als Bildzeichen | Figuren-Spiegel |
  | BAUEN · `steg` | Zahl 1–6 | Regel-Lücke |
  | REISE · `abc` | Buchstabe als Zahl 1–26 | ABC-Sortierer |
  | BAUEN · `morphem` | Wörter aus `v`, `s`, `e` | Morphem-Schere |
  | SAMMELN · `streifen` | Zahl der Teile | Trenn-Schere |
  | REISE · `tastatur` | Tasten `[reihe, nr]`, Reihe 4 der Leerschlag | Tipp-Trainer |
  | BAUEN · `bildstreifen` | Zahl der Bilder 3–6 | Geschichten-Ordner |

  Block B (Deutsch Teil 2, NMG Teil 1; LERN_Session30) — Deutsch wie Block A ohne Lesetext; Zeichen nur, wo sie selbst
  der Inhalt sind (Satzzeichen, Kommas, Zeichen der wörtlichen Rede, Fragewörter, Hilfsverben, Reimschema). Was eine
  Figur abfährt (Lupe, Stift), leuchtet nach der Weglänge auf (`ankunft`: `animateMotion` fährt gleichmässig). Farben
  der Spiele: Korb Nomen deko-6, Verb deko-3, Adjektiv deko-5; Zielband deko-1; gefunden gelb, repariert grün:

  | Muster · bilder | Angabe je Stufe | Spiel |
  |---|---|---|
  | BAUEN · `satzzug` | `[{ woerter, zeichen, gross? }]` (bis drei Sätze): Wortwagen, grosse Wörter mit Dach, Schlusswagen mit . ? ! | Satz-Reparatur |
  | SAMMELN · `girlande` | Zahl der Wörter 2–16: die Schlange wird geschnitten, die Wörter hängen als Fähnchen | Wörter-Trenner |
  | ZOOM · `fehlersuche` | `[{ woerter, fehler }]` (`fehler: null` = fehlerfreier Satz): Lupe, gelb, grün | Fehler-Lupe |
  | SAMMELN · `kommas` | `[{ woerter, kommas: [Stellen] }]`: die Kommas fliegen in die Lücken | Komma-Jagd |
  | AUFTRITT · `rede` | `[{ art: "vorne" \| "hinten" \| "mitte", zeichen }]` oder `{ art: "erkennen", woerter, rede }`: Begleitsatz und Rede mit „ “ : , . ? ! | Rede-Zeichen |
  | BAUEN · `korrektur` | `{ saetze, fehler }`: Text im Kasten, der Stift verbessert | Korrektur-Stift |
  | SAMMELN · `wortkoerbe` | `{ koerbe: [N, V, A], aus: "karte" \| "satz", jeSatz? }` | Wortarten-Sortierer |
  | BAUEN · `wortpuzzle` | `{ teile, art: "zusammen" \| "zerlegen" \| "legen", fuge?, artikel?, ganz? }` (Artikel des Ganzen = der des letzten Teils, geprüft) | Nomen-Puzzle |
  | REISE · `zeitband` | `{ ziel, von?, hilfsverb?, wahl? }` (Präsens, Präteritum, Perfekt) | Zeitreise-Verben |
  | BAUEN · `faecher` | `{ fragen, falsch?, zeit? }`: der Fächer öffnet sich mit Wer? Wen? Wem? Wo? Wohin? | Verben-Fächer |
  | SAMMELN · `labor` | `{ wortart, proben: 3 \| 5, art? }`: genau die passende Probe trifft (🏷️ 👤 📈 📋 🔒) | Wortarten-Probe |
  | BAUEN · `gedicht` | `{ schema: "aa" \| "aabb" \| "abab" \| "abba", strophen?, ordnen?, zaehlen?, luecke? }` | Gedicht-Baukasten |
  | SAMMELN · `regal` | `{ buecher, gut?, fremd? }` (🏰 ⛰️ 🦊 📜 📰 📖 🎭) | Gattungs-Kenner |
  | AUFTRITT · `reporter` | `{ fragen }` (wer, wo, wann, was, warum, schluss 💡, zahl 🔢, kern 🎯) | Hör-Reporter |
  | AUFTRITT · `gefuehle` | `{ gefuehle, paar? }`: Gesichter auf dem Radar | Gefühle-Radar |
  | AUFTRITT · `lagerfeuer` | `{ zuhoerer, titel? }` | Hör-Geschichte |
  | ZYKLUS · `jahresrad` | `{ ring: "tage" \| "monate", von, schritt }` oder `{ ring, ordnen }`; Jahreszeit nur bei den eindeutigen Monaten wie im Spiel | Jahreskreis-Ordner |
  | REISE · `zeitreise` | `{ reihe, rueck? }`, `{ korb: { frueher, heute } }` oder `{ jahr, ja, nein }` | Früher und heute |
  | WACHSEN · `lebenslinie` | `{ reihe }` oder `{ von, bis, klein, gross, marken, alter?, jahrhundert? }` (Marken mindestens ein Bild auseinander, geprüft) | Zeitstrahl-Sortierer |
  | REISE · `erdleiter` | `{ ereignisse: [[Jahre, Bild]], zahlen? }` (Leiter logarithmisch 10⁹ bis 10⁴ Jahre, die Bilder gleichmässig mit einer Linie an ihre Stelle) oder `{ tag: [Jahre, Bild] }` (die Erdgeschichte als ein Tag) | Erdzeit-Leiter |
  | ZYKLUS · `sonnenbogen` | `{ zeiten, bilder, fremd? }` (links auf, rechts unter, die Nacht unter dem Horizont) oder `{ woche: ±1, ±2 }` | Tageslauf-Sonne |
  | SAMMELN · `koffer` | `{ faecher: [{ kultur, dinge }], zu? }` oder `{ gab: { kultur, dinge: [[Bild, ja]] } }`; Dinge gegen die Liste des Spiels geprüft | Kulturen-Koffer |
  | SAMMELN · `wolkenschloss` | `{ echt, erfunden: [Bild \| [Bild, Merkmal]] }` (spricht, bewegt, fabelwesen, zauber, unmoeglich) | Echt oder erfunden? |
  | KARTE · `dorfplan` | `{ orte, notruf? }`, `{ ebenen: true }` oder `{ ablauf: [fünf Bilder] }` | Gemeinde-Helfer |
  | KARTE · `schulweg` | Teile aus `trottoir`, `randstein`, `streifen`, `auto`, `ampel`, `velo`, `schule` | Schulweg-Profi |

  Block C (NMG Rest; LERN_Session30) — Farben der Spiele (Nordpol rot, Südpol grün; Blut sauerstoffreich #d62839, arm
  #2b59c3; Braille-Punkte nach der Tafel des Spiels, gesetzt deko-5), Mengen und Rechnungen nachgerechnet:

  | Muster · bilder | Angabe je Stufe | Spiel |
  |---|---|---|
  | SAMMELN · `magnet` | `{ an, nicht }`, `{ pole: [[a, b], [c, d]], wahl? }` (anziehen oder abstossen nach den Polen in der Mitte), `{ durch }`, `{ kompass }`, `{ strom }` | Magnet-Labor |
  | SAMMELN · `wanne` | `{ dinge, schiff? }` (schwimmt oder sinkt nach der Liste des Spiels) | Schwimmt oder sinkt? |
  | BAUEN · `stromkreis` | `{ lampen: 1–3, art?: "serie" \| "parallel", schliesst?: "draht" \| "schalter" \| Bild, kurz? }` (überbrückt nur in Serie, geprüft) | Stromkreis-Bauer |
  | BAUEN · `hebel` | `{ links, rechts }` (kg × Platz, nachgerechnet) oder `{ stein, a, b }` (Stange, ganzzahlige Kraft) | Hebel-Wippe |
  | ZYKLUS · `wasserkreis` | `{ weg: "boden" \| "berg", bis, nummern? }`, `{ zustaende }`, `{ klaer: 3–6 }` | Wassertropfen-Reise |
  | REISE · `energiekette` | `{ kette }` abwechselnd Form (deko-4) und Wandler (deko-6), lange Ketten als Schlange | Energie-Wandler |
  | SAMMELN · `bionik` | `{ paare, abgeschaut? }` (Paare aus der Liste des Spiels) | Bionik-Paare |
  | REISE · `koerperweg` | `{ teile }`, `{ gelenke }`, `{ weg: "essen" \| "luft" }` | Körper-Puzzle |
  | SAMMELN · `znueni` | `{ koerbe }` oder `{ teller }` (ein ausgewogener Teller des Spiels) | Znüni-Teller |
  | REISE · `blut` | `{ bis: 3–8, kammern?, spaet? }` oder `{ organe }` | Blutkreislauf-Lotse |
  | BAUEN · `braille` | `{ text, zaehlen?, finger? }` | Braille-Finger |
  | ZOOM · `auge` | `{ teile }`, `{ pupille: "hell" \| "dunkel" }`, `{ schnitt }`, `{ lichtweg }` | Auge-Entdecker |
  | REISE · `schall` | `{ leise, laut }`, `{ skala }` (Lärm-Skala 1–5), `{ quelle, schutz }`, `{ ohr }`, `{ echo }` | Lärm-Wächter |
  | KARTE · `kompassweg` | `{ start, schritte: [[Richtung, Felder]], ziel, acht?, dreh? }` (gedrehte Karte: Nordpfeil und Nadel zeigen nach Norden der Karte) | Kompass-Spiel |
  | KARTE · `planweg` | `{ finde }`, `{ zaehle }` oder `{ start, weg, massstab }` (Länge nachgerechnet) | Plan-Leser |
  | REISE · `teddy` | Liste der Plätze oder `{ regal: [[Bild, Fach]] }` | Teddy-Versteck |
  | SAMMELN · `album` | `{ seiten: [[Korbzeichen, Tiere]], falle? }` | Tier-Sortierer |
  | REISE · `lebensraeume` | `{ raeume }`, `{ kette }` oder `{ netz }` (der Pfeil: wird gefressen von) | Lebensraum-Zuordnung |
  | ZYKLUS · `fledermaus` | `{ echo }`, `{ jagd }`, `{ wochenstube }`, `{ jahr, ohneZeit? }`, `{ anpassungen }` | Fledermaus-Forscher |
  | ZYKLUS · `lebenszyklus` | `{ stadien, kreis? }` (Puppe, Larve, Kaulquappen gezeichnet) oder `{ geburt }` | Lebenszyklus-Puzzle |
  | WACHSEN · `pflanze` | `{ baeume }`, `{ blaetter }`, `{ rand }`, `{ schluessel }`, `{ bluete: 4 \| 9 }` | Pflanzen-Bestimmer |
  | ZYKLUS · `wetter` | `{ jahr }`, `{ thermo, wert, symbol?, kleidung? }`, `{ thermo, differenz }`, `{ bericht }` (Thermometer wie im Spiel, Wert auf dem Strich) | Wetter und Jahreszeiten |
  | SAMMELN · `kaesseli` | `{ reicht }`, `{ rest }`, `{ woche, wahl }`, `{ sparen }`, `{ bedarf, wunsch }`, `{ vergleich }` (Beträge über `LS.geldText`, nachgerechnet) | Taschengeld-Planer |
  | REISE · `kakao` | `{ schritte, fehlt?, wer?, herkunft? }` oder `{ kreislauf }` | Kakao-Weg |

  Block D (Englisch, Französisch, Musik, Medien und Informatik; LERN_Session31) — Wörter der Fremdsprachen als leere
  Kärtchen, Zeichen nur, wo sie selbst der Inhalt sind (Artikel, Laute, Buchstaben beim Buchstabieren, Notennamen,
  Endungen, Einheiten, Uhrzeiten); Farben der Spiele (Körbe le/un deko-6, la/une deko-3, l’/des deko-5, les deko-2;
  Datei-Körbe Text deko-1, Bild deko-2, Ton deko-3, Video deko-4; Speicher GB deko-1 bis bit deko-5). Musikbilder spielen
  mit Ton an ihre Töne über `klang`. Gemeinsam: `korbBild` (Körbe mit Beschriftung, die Karten fallen hinein), `hoerbild`
  (Eule mit Kopfhörern, Antippen), `gespraech` (zwei Sprecher, Sprechblasen):

  | Muster · bilder | Angabe je Stufe | Spiel |
  |---|---|---|
  | SAMMELN · `themenkarten` | `{ themen: [Bild], ton?: "an" \| "aus", richtung?: "wort", wendung? }` oder `{ artikel: { bild, richtig, falsch } }` | English Word-Match, Mots-Match |
  | BAUEN · `buchstaben` | `{ wort, bild?, hilfe: "wort" \| "bild" \| "deutsch" \| "hoeren", extra? }` (genau die Buchstaben des Worts, überzählige fallen weg); mit `waben: true` als Wabe mit Biene | Word-Match s5, s6, Spelling-Bee |
  | SAMMELN · `wortzwillinge` | Liste von `{ art: "gleich" \| "aehnlich" \| "falsch", bild? }` (falscher Freund: die deutsche Falle fällt weg, ⚠️) | Wort-Zwillinge |
  | BAUEN · `wortzug` | Liste von `{ woerter: 3–6, zeichen: "." \| "?", gross?, falsch?, nicht? }` (Verwechsler-Karte fällt herunter, Verneinung durchgestrichen) | Sentence-Builder |
  | AUFTRITT · `hoerbild` | `{ bilder: [2–6], ziel, anders? }` oder `{ wo: [{ tier, ort: "on" \| "under" \| "next" \| "in", ding: "table" \| "box" }] }` | Listen & Tap, Mots-Match s4, s6, Sound-Sorter s1, s6 |
  | SAMMELN · `lautkoerbe` | `{ koerbe: ["i-kurz", "i-lang", …] \| ["🌳", "🚲", "🎂"], dinge, ohneTon? }` (Laut nach der Liste des Spiels; kurz Punkt, lang Strich) | Sound-Sorter |
  | AUFTRITT · `wetterbericht` | `{ wetter }`, `{ meldung: { wetter, grad } }`, `{ tage }`, `{ sport: [[Team, Tore] ×2] }` (Pokal oder 🤝), `{ weg: { strasse, seite, ziel } }` | Weather-Report |
  | AUFTRITT · `gespraech` | `{ a, b, zuege: 2–6, antwort?, ort?, fremd?, luecke?, ordnen?, hoeflich? }` | Hello-Dialog, Au café |
  | BAUEN · `bruecke` | Liste von `{ bild? }`, `{ falle: true }` (bleibt am ⚠️ und fällt ins Wasser) oder `{ satz: 3–6, bild }` | Wörter-Brücke |
  | SAMMELN · `artikel` | `{ koerbe: [Artikel], dinge: [[Bild, mehr?]], ohneBild? }` (Artikel nach Geschlecht, Vokal und Zahl geprüft) oder `{ mehrzahl: [Bild] }` (le/la → les, Endung ‑s, ‑x, ‑aux) | Le ou la ? |
  | SAMMELN · `laute` | `{ gleich: [Bild, Bild] }`, `{ koerbe: [Laut], dinge, lesen? }` oder `{ luecke: { bild, wort, laut }, tippen? }` (Schreibweise passt zum Laut) | Son-Lauscher |
  | REISE · `rallye` | `{ von, bis, tafeln: [Zahl \| { geld } \| { telefon } \| { ch }], ziel? }` (Geld über `LS.geldText`, Westschweizer Form mit Schweizer Kreuz) | Nombres-Rallye |
  | ZYKLUS · `uhren` | `{ zeiten: ["h:mm" ×1–3], tag?, hoeren? }` (ab 13 Uhr und mit `tag` die Digitalform darunter) | Quelle heure ? |
  | ZYKLUS · `kalenderfr` | `{ woche }`, `{ heute: 1–5 }`, `{ monate }`, `{ blaetter: [[Tag, Monat]] }`, `{ blatt: { jahr, monat, tag, geburtstag? } }`, `{ wechsel: { jahr, monat } }` (Montag zuerst, Wochenende deko-2) | Calendrier |
  | AUFTRITT · `bestellung` | `{ sachen: [Bild], preis: 2–20, anrede?: [[Person, "tu" \| "vous"]], hoeren? }` (tu nur Kinder, vous Erwachsene) | Au café s4, s5 |
  | AUFTRITT · `notennamen` | `{ toene: [p \| [p, ±1]] }` (p wie `noten.js`: 0 = e′, −2 = c′; Hilfslinien, ♯/♭, deutscher Name darunter) | Noten-Namen |
  | AUFTRITT · `rhythmus` | `{ takte: [{ art: 2–4, noten: [Werte in Vierteln] }], luecke? }` (jeder Takt geht auf) | Rhythmus-Leser |
  | BAUEN · `diktat` | `{ takte: [[Karte]] }` mit Karten `4`, `88`, `2`, `p`, `16`, `8-16-16`, `16-16-8`, `4.8`, `8.16`, `16-8-16` (4/4, höchstens eine Pause je Takt, Balken wie im Spiel) | Rhythmus-Diktat |
  | REISE · `melodie` | `{ toene: [p ×2–4], vergleich?, gleich?, pfeile?, schritte?: ["½" \| "1"] }` (Halbton und Ganzton nachgerechnet; der Vogel landet auf jeder Note, wenn sie klingt) | Hoch-Tief-Ohr |
  | AUFTRITT · `klangwichtel` | `{ gegensatz: "laut" \| "lang" \| "schnell" }`, `{ vergleich: [Art, a, b] }`, `{ schrift: ["k" \| "l"] \| ["g" \| "kl"] }`, `{ karten, ziel }` | Klang-Wichtel |
  | BAUEN · `tonleiter` | `{ leiter: "C" \| "G" \| "F" \| "D" \| "B" \| "a" \| "e" \| "d", halbtoene?, richtung? }` (Schritte aus den Namen gegen Dur bzw. Moll geprüft) oder `{ klaviatur: [[Taste, Taste]] }` | Tonleiter-Treppe |
  | KARTE · `roboter` | `{ raster: 4–6, start: [x, y, Richtung], steine, programm: ["V" \| "L" \| "R" \| { mal, karten } \| { solange }] }` (Weg gerechnet, kein Stein, nicht aus dem Raster; das Ziel am Ende) | Roboter-Pfad |
  | BAUEN · `speicher` | `{ dinge }`, `{ bits }`, `{ leiter }`, `{ umrechnen: [Zahl, Einheit, Zahl, Einheit] }`, `{ karte: { gb, mb, bild } }`, `{ laden: { mb, mbits } }` (Faktor 1000 wie im Spiel, nachgerechnet) | Speicher-Leiter |
  | ZYKLUS · `scheibe` | `{ wort, schluessel: 1–25, richtung: "ver" \| "ent", knacken? }` (Caesar über A–Z wie im Spiel) | Geheimschrift-Knacker |
  | SAMMELN · `dateien` | `{ dinge }`, `{ endungen: [Endung \| [Endung, Bild]] }`, `{ programme }`, `{ groessen }` (Endungen, Programme und Grössen des Spiels) | Datei-Typen |
  | SAMMELN · `nim` | `{ reihen: [n ×1–3], max?, eule? }` (das Kind spielt richtig, die Eule nimmt einen Stein; nur ein Bild, wenn das Kind den letzten nimmt) | Stein-Duell |
  | SAMMELN · `atari` | `{ brett: 5–9, weiss, schwarz, zuege: [["s" \| "w", x, y]], freiheiten?, retten?, falle? }` (Fang nach den Regeln gerechnet, kein Selbstmord) | Steine fangen |
  | REISE · `schach` | `{ weiss: { Feld: Figur }, schwarz, zuege: [[von, nach]] }` (Gangart geprüft; am Ende Schach und kein freies Fluchtfeld) | König in der Falle |

  Stellenfarben in den Bildern nur über `var(--st-…)` aus `stil.css`, nach dem Komma `--deko-7` mit der Kommalinie
  `--deko-1` (wie `.schriftlich`); Zahlen über `LS.zahlText` und `LS.dezimalText`.

  Eine Stufe kann ein anderes Muster nehmen: `ziele: { s5: { muster: "reise", reisender: "sonde", ziel: { rand: true } } }`
  (Himmels-Forscher übt in s5 und s6 Planeten statt Mondphasen).
- **Test:** Der Rahmen meldet `pruefung.haken("schluss", …)`; `tools/pruefe_spiele.js` prüft für jedes Spiel mit
  `feier`: `feier.js` geladen, Animation im Schlussbild, jede Stufe mit Bild, Schmuck passend zu 1–3 Sternen, mit
  „Bewegung reduzieren“ keine Bewegung, sonst Bewegung, und jede `animateTransform` mit einer gültigen Art (translate,
  scale, rotate, skewX, skewY — eine andere übergeht der Browser still). Seit LERN_Session29 dazu **Lage und Schrift**
  im ruhigen Endbild mit 3 Sternen (`tools/feier_geometrie.js`, ohne Layout aus den Attributen gerechnet): kein Text
  unter 9 Einheiten der viewBox, kein Teil mehr als 1,5 Einheiten über den Rand; Unsichtbares (opacity 0) und
  Zugeschnittenes (clip-path, die Karte) zählen nicht. Kurven über Punkte auf der Kurve, Bögen über ihren Mittelpunkt,
  Textbreite geschätzt (gegen `getBBox` im Browser abgeglichen); vierzehn Gegenproben bei jedem Lauf. Seit LERN_Session31
  dazu (alles in `tools/feier_geometrie.js`, `feierPruefungen()`): **Schmuck über Text** (ein Teil mit `data-schmuck` liegt
  zu mehr als einem Viertel auf einem Text oder Bildzeichen; ein Ring ohne Füllung und ein durchscheinendes Licht unter
  halber Deckkraft zählen nicht, ein Bildzeichen zählt als rund), **bewegt gegen ruhig** (das Endbild der Bewegung, die
  SMIL-Animationen bis zum Ende gerechnet: `fill="freeze"`, `set`, `animateTransform` ersetzend oder `additive="sum"`,
  `animateMotion` ans Ende des Wegs — zeigt dieselben Texte am selben Ort wie das ruhige Bild), **Animationen, die der
  Browser still übergeht** (`attributeName` passt zum Element, `keyTimes` von 0 bis 1 mit so vielen `values` und
  `keyPoints`, `keySplines` passend zu `calcMode="spline"`), und Bildzeichen aus mehreren Zeichen (👩‍🏫, ☀️) zählen als
  eines. **Schnell für alle Spiele:** `node tools/pruefe_feier.js [spiel …]` lädt jede Seite im Vorschau-Modus, fängt die
  Angabe aus `LS.spiel` ab und prüft alle Stufen des Katalogs mit 1–3 Sternen, bewegt und ruhig (169 Spiele, 6084 Bilder
  in Sekunden; mit Gegenproben), Teil der kurzen Prüfungen (`node tools/pruefe.js`, App `feier`). Die Klickzahlen eines Spiels mit Animation ändern sich (kein
  Konfetti mehr, das Zufallszahlen verbrauchte; die Animation ist anklickbar).
- **Vorschau:** `?feier=<stufe>&sterne=1–3[&ruhig=1]` zeigt nur das Schlussbild mit der Animation und „↻ Nochmal“ —
  ohne Anmeldung, ohne Runde, nichts wird gespeichert; die Stufe kommt aus der Skala (auch wenn ihre Inhaltslisten
  nicht frei sind), Einstellung und Ruhezeit gelten nicht, der Ton schon. `tools/feier_vorschau.html` (nicht
  veröffentlicht, über den Entwickler-Server) zeigt so alle sechs Stufen eines Piloten in 1024, 768 oder 375 px;
  „Nebeneinander“ drei je Zeile, „Anhalten bei“ hält jede Animation bei einer Sekunde an (SMIL `setCurrentTime`) — so
  lässt sich der Ablauf Bild um Bild prüfen, nicht nur das Endbild (LERN_Session28). **Abnahme** (Wunsch Patrik,
  LERN_Session31): „✓ Animation geprüft“ je Spiel schreibt über den Entwickler-Server in den Prüfstand (`pruefstand.js`,
  Art `feier`, neben `spiele` und `listen`), „Geprüfte ausblenden“ nimmt sie aus der Auswahl (gemerkt im Browser), und
  „📝 Anmerkung“ je Stufe legt eine Bemerkung an (`inhalt: "feier"`, Stufe, dazu Sterne, Breite und Zeitpunkt) — die
  offenen stehen unter der Stufe und werden wie alle Bemerkungen zu Beginn einer Sitzung abgearbeitet. Schlüssel und
  Adresse des Servers nimmt die Vorschau vom Eulenpfad desselben Browsers (`lernspiele:entwickler`, `lernspiele:meldeweg`,
  sonst `kontakt.js`); ohne Schlüssel lässt sie nur ansehen.

## 25. Ruhezeiten

Seit LERN_Session27 (docs/konzept_abschluss_animationen.md 7, Entscheide AN3-Z a, AN3-T a mit der Lesart „differenziert“,
AN3-K a). Zu festen Zeiten bleibt es still, etwa im Unterricht. Eingestellt in Verwaltung → Einstellungen, Teil
„🤫 Ruhezeiten“, gleich nach den beiden Einstellungen des Geräts dazu.

- **Daten:** `lernspiele:ruhezeiten = { stand, zeiten: [{ id, tage: [1–7, Mo = 1], von: "08:00", bis: "12:00", arten }],
  spiele: { <spiel>: "aus" | "alles" } }`. `bis` ist ausgeschlossen, `"24:00"` = Mitternacht (das Zeitfeld zeigt es als
  00:00 „(Mitternacht)“). Es gilt die Ortszeit des Geräts. Gelesen wird nur, was `LS.ruheZeitGueltig` besteht.
- **Arten** (`LS.RUHE_ARTEN`), je Zeitspanne wählbar: `feier` (Abschluss-Animation; dann wie „aus“, also Konfetti),
  `klaenge` (`LS.ton`, auch die Töne der Animation), `vorlesen` (die Eule liest vor: das interne `sprich` mit Kanal
  „vorlesen“), `hoeren` (Hören als Inhalt: `LS.sprich` der Spiele, `noten.js`, Klang-Wichtel). Die Probe der Stimme auf
  dem Startblatt klingt immer (Knopfdruck der Aufsicht).
- **Je Spiel:** „wie eingestellt“, „gilt hier nicht“ (`aus`), „gilt hier ganz“ (`alles`: alle Arten, solange eine
  Zeitspanne läuft).
- **Gerät** (`EINSTELLUNGEN`, reisen nicht mit): `kopfhoerer` — `nein` / `hoeren` (Hören ausgenommen) / `vorlesen` (Hören
  und Vorlesen ausgenommen); `tonSpieleRuhe` — `zeigen` / `ausblenden`.
- **Spiele, die Ton brauchen** (Katalog `art` mit `hoeren`, `LS.brauchtTon`): ruht das Hören (`LS.tonSpielRuht`), zeigt
  `runde` vor dem Start „🎧 Diese Runde braucht Ton — mit Kopfhörern spielen“ mit „🔊 Ton für diese Runde an“
  (`data-aktion="ton-fuer-runde"`) und „Zurück“; der Ton bleibt bis zum Schluss der Runde an, dann und auf der
  Stufenwahl wieder still. Mit `ausblenden` fehlen sie im Tab Spiele (`LS.ruheAusgeblendet`, Hinweis
  `data-hinweis="ruhezeit"`). Zufall und Zufallsmix nehmen sie in der Ruhezeit nie, auch mit `zeigen`: dort kann niemand
  den Ton für die Runde einschalten.
- **Abgleich:** Teil `ruhezeiten` von `KERN.daten` (in der App, `RUHE_TEIL`): reist in der Abgleich-Datei und in der
  Sicherung aller, nicht in der Sicherung einzelner Kinder; der jüngere `stand` gewinnt; fremde Zeitspannen und Werte je
  Spiel gehen nur geprüft in den Speicher.
- **API:** `LS.ruhe(art, spielId?, jetzt?)`, `ruhezeiten()`, `setzeRuhezeiten({ zeiten?, spiele? })`, `ruheJetzt(jetzt?)`,
  `ruheStand(jetzt?)` (für die Verwaltung: „Mo–Fr 08:00–12:00“ und Arten), `ruheTageText`, `WOCHENTAGE`.
- **Test:** `node tools/pruefe_spiele.js ruhe` — Regeln mit fester Uhrzeit (Wochentag, Ende ausgeschlossen, zwei
  Zeitspannen, je Spiel, Kopfhörer), ungültige Zeitspannen, Spiele mit Ton (ruht, ausgeblendet, mit Kopfhörern), ein
  Klang entsteht in der Ruhezeit nicht (WebAudio ersetzt), Abgleich und Sicherung.
