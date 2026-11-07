# Kern der Reihe — Vertrag Kern ↔ Apps

Stand: kern 1.18.0, 2026-11-06 (LERN_Session18). Entscheide KB1 a, KB2 a; Plan [plan_angleich_reihe.md](../plan_angleich_reihe.md)
Abschnitt B. Gegenstücke: [Eulenpfad](../eulenpfad/rahmen.md), [Lernsteig](../lernsteig/rahmen.md).

Der Kern enthält, was Eulenpfad, Lernsteig und Gratwanderung **gleich** brauchen. Er kennt keine App: Alles, was je
App anders ist (Schreibweise, Speicher-Präfix, Rollen-Namen), gibt die App als Parameter mit.

## 1. Aufbau

```
kern/TEILE            Teile in Ladereihenfolge, je Zeile eine Datei
kern/VERSION          Version des Kerns (1.18.0)
kern/CHANGELOG.md     Änderungen je Version
kern/<teil>.js        die Teile — einzige Quelle
tools/kern_verteilen.py   bündelt die Teile in <app>/kern/kern.js (Kopie je App)
tools/pruefe_kern.js      Tests der Teile und der Kopien
<app>/kern/kern.js        Kopie je App, erzeugt — nie von Hand ändern
```

`kern/` selbst geht nicht online (Pages veröffentlicht nur `portal/` und die App-Ordner); online ist nur die Kopie
im App-Ordner. So bleibt jeder App-Ordner eigenständig (P1 a) und läuft offline per Doppelklick.

## 2. Regeln für jeden Teil

- **Ohne App-Globals, ohne Wirkung beim Laden.** Ein Teil liest weder `LS` noch `LST`. Braucht er etwas aus der App
  (Schreibweise, Präfix), bekommt er es als Parameter. DOM und Speicher fasst nur an, wessen Aufgabe es ist (`el`,
  `speicher`), und erst beim Aufruf, über die globalen Namen `document` und `localStorage` (nicht `globalThis.…`:
  Ersatz-DOMs der Testskripte legen sie als Variablen an). So bleibt jeder Teil in Node ladbar.
- **Rahmen der Datei:** Der Teil hängt sich an das globale Objekt `KERN` und exportiert es für Node:
  ```js
  "use strict";
  (function (KERN) {
    …
    KERN.<teil> = { … };
  })(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));
  if (typeof module !== "undefined") module.exports = globalThis.KERN;
  ```
  So läuft derselbe Text als `<script>` im Browser, gebündelt in `kern.js` und mit `require` in Node.
- **Fehler mit Klartext:** `throw new Error("keine Zahl: …")`, keine rohen Laufzeitfehler aus Eingaben.
- **Jede Funktion hat Tests** in `tools/pruefe_kern.js`: feste Beispiele, Randfälle, wenn möglich eine unabhängige
  Nachrechnung über viele Zufallswerte.
- Schweizer Schreibweise in Texten (ss), Kommentare auf Deutsch.

## 3. Einbinden in einer App

Jede Seite lädt **einmal** die Kopie, **vor** dem Rahmen der App:

| App | Seite | Zeile |
|---|---|---|
| Eulenpfad | Spielseite `spiele/<id>/index.html` | `<script src="../../kern/kern.js"></script>` vor `../gemeinsam/spiel.js` |
| Eulenpfad | `index.html`, `mix.html` | `<script src="kern/kern.js"></script>` vor `spiele/gemeinsam/spiel.js` |
| Lernsteig | Übungsseite `uebungen/<id>/index.html` | `<script src="../../kern/kern.js"></script>` vor `../../gemeinsam/werkzeug.js` |
| Lernsteig | `index.html` (Tabs; `statistik.html`, `aufsicht.html` leiten nur weiter) | `<script src="kern/kern.js"></script>` vor `gemeinsam/werkzeug.js` |
| Gratwanderung | noch ohne Skripte | lädt die Kopie mit dem Grundgerüst (Plan C8) |

Ein neuer Kern-Teil braucht keine Änderung an den Seiten: Er kommt in `kern/TEILE` und ist nach dem Verteilen in
`kern.js` enthalten. Die Rahmen der Apps reichen weiter (etwa `LS.zahlText` → `KERN.zahl.text` mit der Schreibweise
des Eulenpfads), damit Spiele und Übungen ihre gewohnten Aufrufe behalten.

## 4. Teile

### 4.1 `KERN.zahl` (`kern/zahl.js`) — Zahlschreibung

Schreibweise `sw = { tausender, abStellen, minus, dezimal }`, ohne Angabe `KERN.zahl.STANDARD`
(`{ tausender: " ", abStellen: 5, minus: "−", dezimal: "." }`).

| Funktion | Ergebnis |
|---|---|
| `text(n, sw)` | Zahl in der Schreibweise: ganze Zahlen exakt bis 2^53, andere wie `dezimalText`; nur der ganze Teil gegliedert |
| `dezimalText(x, stellen, sw)` | Dezimalzahl, `stellen` feste Nachkommastellen (gerundet), ohne Angabe so viele wie nötig — ohne Exponent und Rundungsreste (`0.1 + 0.2` → „0.3“, `4.485e-8` → „0.00000004485“); kein „−0“; `NaN`, `Infinity` als Text |
| `lies(eingabe)` | Zahl oder `null`; nimmt „−“, „-“, „–“, Punkt oder Komma, Leerzeichen, schmales Leerzeichen und Apostroph als Gliederung |
| `klartext(x)` | Betrag als Dezimaltext mit 15 gültigen Ziffern (Hilfsfunktion) |

Schreibweisen der Apps:

| App | `tausender` | `abStellen` | `minus` | `dezimal` | Beispiele |
|---|---|---|---|---|---|
| Eulenpfad (`spiel.js`, `schreibweise()`) | schmales Leerzeichen U+202F | 5 | − | Einstellung `dezimal` der Aufsicht | „4500“, „30 400“ |
| Lernsteig (`werkzeug.js`, `schreibweise()`) | Apostroph (Z1 a) | 4 | − (MZ1 a) | Einstellung, Standard Punkt | „1'000“, „−320'000“ |

### 4.2 `KERN.bruch` (`kern/bruch.js`) — exakte Bruchrechnung

Ein Bruch ist `{ z, n }` mit `BigInt`, `n > 0`, gekürzt. Gedacht für Prüffunktionen: Lösungen werden unabhängig
vom Generator exakt nachgerechnet.

| Funktion | Ergebnis |
|---|---|
| `bruch(z, n = 1)` | gekürzter Bruch; `n = 0` → Fehler „Division durch 0“ |
| `plus`, `minus`, `mal`, `durch`, `neg` | Grundoperationen |
| `hoch(a, e)` | Potenz mit ganzem `e ≥ 0` |
| `wurzel(a, k)` | exakte k-te Wurzel, sonst Fehler „Wurzel nicht exakt“ |
| `wurzelGanz(x, k)` | ganzzahlige Wurzel einer `BigInt`, exakt auch über 2^53, sonst `null` |
| `zahl(text)` | Dezimaltext („1'234.56“, „30 400“, „0,5“, „−3“) → Bruch; keine Zahl → Fehler „keine Zahl: …“ |
| `vonZahl(x)` | JavaScript-Zahl → Bruch über 15 gültige Ziffern; `NaN`/`Infinity` → Fehler |
| `gleich(a, b)`, `vergleich(a, b)` | Gleichheit; −1, 0 oder 1 wie a − b |
| `endlich(a)` | ist der Bruch eine endliche Dezimalzahl? |
| `text(a)` | „3/4“, „−1/4“ als „-1/4“, ganze als „5“ (technischer Text, nicht für die Anzeige) |
| `alsZahl(a)` | Näherung als Zahl |

### 4.3 `KERN.speicher` (`kern/speicher.js`) — Speicher mit Präfix

Alle Apps teilen den Ursprung und damit `localStorage`. Jede schreibt nur unter ihrem Präfix.

| Aufruf | Ergebnis |
|---|---|
| `KERN.speicher("lernsteig:")` | `{ praefix, lies, schreibe, entferne, schluessel }`; Präfix aus Kleinbuchstaben, Ziffern, `-`, mit `:` am Ende, sonst Fehler |
| `lies(schluessel, ersatz)` | gespeicherter Wert (JSON) oder `ersatz` — auch ohne Speicher, bei gesperrtem Speicher oder kaputtem JSON |
| `schreibe(schluessel, wert)` | `true`, wenn gespeichert; `false`, wenn der Speicher fehlt, voll oder gesperrt ist — die App entscheidet, ob sie warnt |
| `entferne(schluessel)` | Eintrag löschen |
| `schluessel()` | alle Schlüssel dieses Präfixes, ohne Präfix |

Präfixe: Eulenpfad `lernspiele:`, Lernsteig `lernsteig:`, Gratwanderung `gratwanderung:`. Ein Teil, der Daten einer
anderen App liest oder schreibt (Profil-Übernahme C9), öffnet deren Speicher mit deren Präfix.

### 4.4 `KERN.zufall` (`kern/zufall.js`) — Zufall mit austauschbarer Quelle

| Aufruf | Ergebnis |
|---|---|
| `zufall(min, max)` | ganze Zahl von min bis max, beide eingeschlossen |
| `waehle(liste)` | ein Element |
| `mische(liste)` | gemischte Kopie (Fisher-Yates); die Vorlage bleibt |
| `quelle.zufall` | die Quelle, Standard `() => Math.random()` — erst beim Aufruf gelesen |
| `mitStartwert(seed)` | wiederholbare Folge in [0, 1) für Testskripte |

Testskripte setzen den Zufall auf zwei Wegen: der Eulenpfad ersetzt `Math.random` im Ersatz-DOM
(`tools/pruef_dom.js`), der Lernsteig setzt `KERN.zufall.quelle.zufall` (als `LST.quelle.zufall`). Beide geben mit
gleichem Startwert dieselbe Folge wie vor dem Umzug.

### 4.5 `KERN.el` (`kern/el.js`) — Element bauen

`el(tag, attr, ...kinder)`:
- `text` → `textContent` — **immer** für Daten (Namen, eingelesene Dateien, Eingaben);
- `html` → `innerHTML` — nur für festen Text aus dem Code, nie für Daten;
- `class` → `className`; `on…` mit Funktion → `addEventListener`;
- Attribut `undefined`, `null`, `false` → weggelassen; `true` → leeres Attribut (`disabled`, `hidden`); sonst als Text
  (`"false"` und `0` bleiben);
- Kinder: verschachtelte Listen flach; `undefined`, `null`, `false` fallen weg.

Greift erst beim Aufruf auf `document` zu (über den globalen Namen, damit auch der Ersatz-DOM greift).

### 4.6 `KERN.geheimnis` (`kern/geheimnis.js`) — PIN, Code, Sicherheitsfrage

Gespeichert werden nur Prüfwerte `{ salz, hash }` mit `hash = SHA-256("salz:wert")` — dieselbe Rechnung wie bisher in
beiden Apps, eine PIN gilt also nach einer Übernahme (C9) weiter. Grenze (DS1 a): schützt vor Versehen und Neugier am
Gerät, nicht vor Entwicklerwerkzeugen.

| Aufruf | Ergebnis |
|---|---|
| `verfuegbar()` | kann dieses Fenster rechnen? (`crypto.subtle` nur in einem sicheren Kontext: https, localhost, Datei) |
| `pin(p)` | Prüfwert der PIN (4–6 Ziffern), sonst Fehler „Die PIN hat 4 bis 6 Ziffern.“ |
| `pinStimmt(p, wert)` | stimmt die PIN? ohne Prüfwert nie |
| `wiederherstellung({ code?, frage?, antwort? }, alt)` | `{ wiederherstellung: { code, frage?, antwort? }, code }` — ohne Code wird einer erzeugt, der nur jetzt sichtbar ist |
| `codeStimmt(c, w)`, `antwortStimmt(a, w)` | Code ohne Gliederung und Gross/Klein; Antwort ohne Gross/Klein, ß/ss, mehrfache Leerzeichen |
| `neuerCode()` | „K7QM-2XRA-9TPL“ (ohne 0/O, 1/I) |
| `pruefwert`, `stimmt`, `hash`, `salz` | die Grundlagen |

Fehlt `crypto.subtle` (etwa eine Seite über `http://<Adresse im Netz>`), werfen die Funktionen den Satz `OHNE_KRYPTO`
statt eines Laufzeitfehlers (Befund D6).

### 4.7 `KERN.person` (`kern/person.js`) — Personen

Entscheide P1 a, P2 a, Vorgabe B3. Eine Liste von Personen je App:

```
{ id, name, rolle: "lernend" | "aufsicht", art?: "eltern" | "lehrperson", gruppenleitung?: true,
  geboren: "JJJJ-MM-TT" | "JJJJ-MM" | null, klasse, frueher?: [Kennungen], angelegt, geaendert: { <feld>: ISO },
  pin?, wiederherstellung?, … Felder der App }
```

- **Kennung** `p-<Zeit>-<Zufall>` entsteht beim Anlegen und ändert sich nie; sie reist bei einer Übernahme mit.
  Ältere Kennungen (Lernsteig `k-…`, `a-…`) bleiben gültig.
- **Name** je App und Gerät eindeutig, verglichen ohne Gross/Klein und Leerzeichen am Rand; nur Anzeige.
- **geaendert** hält je Feld die Zeit der letzten Änderung.
- **Geheimnisse** `pin`, `wiederherstellung` und die Gerätefelder der App bleiben auf dem Gerät.
- **Schutz in Dateien** (DF4 a, seit 1.15.0): In Sicherung und Abgleich reist eine Person mit PIN ohne PIN-Prüfwert,
  aber mit `geschuetzt: true` und nur dem Prüfwert ihres Wiederherstellungscodes (`fuerDatei`). Grund: alle 1 110 000
  PINs mit 4–6 Ziffern sind gegen den Prüfwert in rund 1,2 s durchprobiert, der Code (32¹² ≈ 1,2 · 10¹⁸) erst in rund
  40 000 Jahren. Hat sie auf dem anderen Gerät keine eigene PIN, ist sie dort **gesperrt** (`gesperrt: true`), bis sie mit
  dem Code und einer neuen PIN freigeschaltet ist; der Code bleibt derselbe. Eine Aufsicht aus einer Datei gilt immer
  als geschützt (ohne Code: Freischalten nur über eine Bestätigung, die die App verlangt). Einlesen nimmt nie einen
  Schutz weg: `gesperrt` und `geschuetzt` nimmt der Kern nie aus einer fremden Fassung, und eine eigene PIN bleibt.
  Wurde die PIN hier später entfernt als dort gesetzt, wird nicht wieder gesperrt.

| Aufruf | Ergebnis |
|---|---|
| `geburtsdatumLies(text)` | „TT.MM.JJJJ“, „JJJJ-MM-TT“ → „JJJJ-MM-TT“; „MM.JJJJ“, „JJJJ-MM“ → „JJJJ-MM“; sonst `null` |
| `geburtsdatumText(g)` | „07.03.2014“, ohne Tag „März 2014“ |
| `alter(g, heute)` | ganze Jahre; ohne Tag ab dem Ersten des Monats; `tagFehlt(g)` |
| `nameRein`, `nameGleich` | Namen bereinigen und vergleichen |
| `maengel(p)` | Liste von Mängeln (leer = gültig) — für Einlesen, Abgleich, Einladung |
| `ohneGeheimnis(p, geraetFelder)` | Kopie ohne `pin`, `wiederherstellung`, `gesperrt`, `geschuetzt` und Gerätefelder (Einladung, Übernahme) |
| `fuerDatei(p, geraetFelder)` | Kopie für Sicherung und Abgleich: wie `ohneGeheimnis`, eine geschützte Person dazu mit `geschuetzt` und `wiederherstellung: { code }` |
| `gesperrt(p)` | `gesperrt: true` und keine eigene PIN |
| `freischalten(liste, id, pin, { code } \| { bestaetigt: true })` | gesperrte Person mit ihrem Code (oder nach einer Bestätigung der App) freischalten, neue PIN; Fehler mit Klartext („Der Code stimmt nicht.“) |
| `liste(speicher, { schluessel, felder })` | `{ alle, finde (auch über frühere Kennungen), findeName, nameFrei, anlegen, aendere, entferne, speichere }`; `anlegen` und `aendere` prüfen Name und Mängel und melden einen vollen Speicher |
| `zusammenfuehren(eigene, fremde, { geraetFelder, schutz })` | `schutz: true` für Personen aus einer Datei (setzt `KERN.daten`): Schutz übertragen wie oben; gleiche Kennung (auch frühere) → verbinden; sonst gleicher Name → verbinden, die ältere Kennung bleibt, die andere wird frühere; sonst neu; Ungültiges abgewiesen. Je Feld der jüngere Stand; ein jüngerer Name, den hier jemand anders trägt, gilt nicht. Ergebnis `{ personen, neu, geaendert, abgewiesen, kennungen: { alt: neu } }` — mit `kennungen` biegt die App Verweise (Runden, Rekorde) um |
| `uebernehmen(quelle, ziel, zusatz)` | Übernahme einer **Aufsicht** in eine andere App (C9, Ü1 a, Ü2 b; seit 1.12.0): `ziel` ist die Liste der Ziel-App (`liste(KERN.speicher("<präfix>"))`). Mit reisen Kennung, Name, Rolle, Art, PIN-Prüfwert, Sicherheitsfrage und Antwort-Prüfwert; der Wiederherstellungscode wird neu ausgegeben (`code`, nur jetzt sichtbar). Keine Bestätigung in der Ziel-App; nichts wird überschrieben: `status` „neu“, „schon“ (dieselbe Kennung ist dort) oder „name“ (Name dort vergeben). Fehler ohne PIN und für Lernende (die kommen über die Einladung) |

Rollen und Sicht je App (P2 a): Der Lernsteig verlangt von der Aufsicht eine PIN und zeigt ihr nur verbundene Konten,
eine weitere Aufsicht braucht die Bestätigung einer bestehenden. Der Eulenpfad (seit 1.3.0) zeigt der Aufsicht alle
Personen des Geräts und kennt keine Verbindungen; seine Aufrufe gehen über den Namen, darunter gilt die Kennung.

### 4.8 `KERN.freigabe` (`kern/freigabe.js`) — Freigabe nach Prüfstand

Entscheide L4 a, E1 a, FG1 a. Prüfstand im Repo (`<app>/…/pruefstand.js`, gesetzt im Entwickler-Modus), Freigabe je
Gerät durch die Aufsicht. Die App erzeugt ihre Freigabe einmal:

```js
const FREIGABE = KERN.freigabe({
  art: "spiele",                         // Eulenpfad; Lernsteig "uebungen" — Schlüssel in Prüfstand und Freigabe
  eintrag: id => Katalogeintrag | null,  // neu, listen: { <liste>: { name, zusatz?, von? } }
  pruefstand: () => ({ <art>: { <id>: { am, von } }, listen: { "<id>/<liste>": { am, von } } }),
  speicher: { lies, schreibe },          // der App (Präfix); Schlüssel freigabe und freigabeStand
  aufsicht: () => bool,                  // angemeldete Aufsicht sieht alles
});
```

| Aufruf | Ergebnis |
|---|---|
| `frei(id)`, `setzeFrei(id, wert)` | Inhalt als Ganzes frei? Ohne Gerätefreigabe: nicht `neu` oder im Prüfstand. `wert: null` = zurück auf den Prüfstand |
| `listen(id)` | `[{ id, quelle, name, geprueft, von, zusatz }]`, Name und Prüfstand von der Quelle eines Verweises |
| `listeFrei(id, liste)`, `setzeListeFrei(…)`, `freieListen(id)` | Liste frei? Freigabe und Prüfstand gelten an der Quelle; `freieListen` liefert der Aufsicht alle |
| `fuerLernendeSichtbar(id)`, `sichtbar(id)` | frei und mindestens eine eigenständige Liste frei (Zusatzlisten zählen nicht); `sichtbar` auch für die Aufsicht |
| `sperrGrund(id)` | „auf diesem Gerät gesperrt“, „noch nicht angesehen“, „Inhaltslisten gesperrt“, „Inhaltsliste noch nicht geprüft“, „keine der n Inhaltslisten geprüft“, „unbekannt“ oder `null` |
| `geraet()`, `pruefstand(bereich, schluessel)`, `zuPruefen(id)`, `geprueft(id)`, `listenQuelle(id, liste)` | Bausteine |

Jedes `setze…` schreibt zuerst `freigabeStand` (jetzt), dann `freigabe`: Beim Abgleich gewinnt die Freigabe des Geräts
mit dem jüngsten Stand. Eulenpfad: `LS.spielFrei`, `LS.sperrGrund`, `LS.spielListen` … reichen weiter; Lernsteig:
`LST.FREIGABE`, `LST.sperrGrund`, `LST.uebungSichtbar`.

### 4.9 `KERN.suche` (`kern/suche.js`) — Suche mit Relevanz und Passung

Entscheid SU1 a, Passung nach Wunsch Patrik (LERN_Session10). Je Suchwort zählt der beste Treffer über alle Felder,
gewichtet nach Feld und Art des Treffers; jedes Suchwort muss passen; bei gleichem Wert bleibt die Reihenfolge der
Einträge.

| Aufruf | Ergebnis |
|---|---|
| `woerter(text)` | Wörter klein, Kürzel mit Punkten ganz („ma.1.a.3“) |
| `wortWert(q, w, tippfehler)` | 1 ganz · 0.8 Wortanfang · 0.7 / 0.6 dasselbe mit ä = a · 0.4 / 0.3 Wortteil ab 4 Zeichen · 0.25 ein Tippfehler (nur wenn erlaubt, ab 5 Zeichen, nie mit Ziffern; ein Buchstabendreher sind zwei) · sonst 0 |
| `suche(text, eintraege, opt)` | `[{ id, wert, passung, grund }]`, leere Suche `null`; `opt = { felder: e → { feld: [Texte] }, gewicht, sichtbar, tippfehler, grund: (feld, text) → Satz, passung: e → 0–1 \| null, faktor }` |
| `aehnlich(id, eintraege, opt)` | `[{ id, wert, passung, grund }]`; `opt.vergleich(e, x) → { wert, grund } \| null` |
| `mitPassung(wert, p, faktor)` | `wert · (1 + faktor · p)` — die Passung hebt, der Text bleibt massgebend |
| `naehe(a, b)` | 1 gleich · 0.6 eine daneben · 0.2 zwei · 0 · 0.5 unbekannt |

Eulenpfad: Felder Name 6, Lernziel-Kürzel 4, Beschreibung 3, Inhaltslisten 2, Thema 1; Tippfehler nur im Namen; Passung
aus Klasse und Bedarf; Ähnlich über Lernziel (4 je Code), Thema 3, Fach 1, Klassenabstand. Der Lernsteig bekommt mit
dem Tab Übungen (C3) eigene Felder und eine Passung aus Niveau, Prüfungsziel und Kompetenzstand.

### 4.10 `KERN.runden` (`kern/runden.js`) — Runden und Rekorde

Entscheid R1 a: ein Format in allen Apps; in der Oberfläche heisst `inhalt` weiter Spiel oder Übung.

```
Runde:  { id, person, zeit, inhalt, stufe, aufgaben?, fehler?, dauer?, test?, … Felder der App }
Rekord: { id, person, zeit, inhalt, stufe, punkte, dauer?, test?, abgebrochen?, … Felder der App }
```

| Aufruf | Ergebnis |
|---|---|
| `neueId()` | „r-<Zeit>-<Zufall>“; eine Endlos-Serie behält ihre Kennung, damit der Endstand den Zwischenstand ersetzt |
| `kennungAus(wer, zeit, inhalt, stufe)` | feste Kennung „r-alt-…“ für ältere Einträge ohne Kennung |
| `maengel(e, art, opt)` | Mängel einer Runde oder eines Rekords; `opt = { zusatz: { feld: "zahl" \| "text" \| "bool" \| "liste" \| "objekt" \| "zahlOderNull" \| "textOderNull" }, pflicht: [Felder], inhaltBekannt, personBekannt }`; unbekannte Felder bleiben |
| `umdeuten(e, { alt: neu })` | Felder umbenennen, fehlende Kennung aus Name (sonst Person), Zeit, Inhalt, Stufe — dieselbe alte Runde bekommt auf jedem Gerät dieselbe |
| `zusammenfuehren(eigene, fremde, { art, pruefung, umbiegen, behalten })` | nach Kennung; Rekord: höherer Stand; Runde: ein Zwischenstand (`abgebrochen`) weicht dem späteren Stand (RA3 a, 1.20.0); fremde geprüft und abgewiesen, eigene bleiben (nur `behalten` entscheidet, etwa ein Löschvermerk); nach Zeit sortiert; `{ eintraege, neu, ersetzt, abgewiesen }` |
| `fingerabdruck(wert)` | cyrb53 über JSON (auch `KERN.fingerabdruck`; Prüfung der Inhaltslisten im Eulenpfad) |

Felder der Apps:

| App | Pflicht (Runde) | weitere geprüfte Felder | ältere Namen (umgedeutet) |
|---|---|---|---|
| Eulenpfad | `aufgaben`, `fehler`, `dauer` | `name`, `sterne`, `fehlerAufgaben`, `aufgabenZeiten`, `optionen`, `mix`; Rekord `name`, `spiele` | `spiel` → `inhalt`; Kennung fehlte |
| Lernsteig | `aufgaben`, `dauer` | `fach`, `niveau`, `endlos`, `aufAnhieb`, `gezeigt`, `zeiten`, `falsch`, `liste`, `mitRechner`, `gruppe`; Rekord `niveau`, `mitRechner`, `abgebrochen` | `konto` → `person`, `uebung` → `inhalt` |

Dateien: Eulenpfad `format: "eulenpfad-daten"`, Version 3; Lernsteig `format: "lernsteig-sicherung"`, Version 2. Ältere
Fassungen liest das Einlesen weiter.

### 4.11 `KERN.anmeldung` (`kern/anmeldung.js`) — Anmeldung und Sitzung im Tab

Herkunft: Eulenpfad (L1 a: gewählte Person, Aufsicht nur im Tab) und Lernsteig (aktives Konto, mit PIN nur im Tab;
Aufsicht nur im Tab). Ein **Platz** hält, wer an diesem Gerät angemeldet ist:

- Gemerkt wird die **Kennung** der gewählten Person im Speicher der App (`gewaehlt`, localStorage).
- Wer **im Tab** angemeldet sein muss, gilt nur, solange derselbe Browser-Tab offen ist (sessionStorage, Schlüssel
  Präfix der App + `tab`). Standard `standardImTab(p)`: eine Aufsicht oder wer eine PIN hat. Schliesst man den Tab,
  ist die Person abgemeldet; wer danach das Gerät nimmt, erbt ihre Rechte nicht. Ohne sessionStorage (gesperrt) gilt
  niemand im Tab als angemeldet.
- Ein älterer Stand mit dem Namen im Tab gilt, wenn `finde` den Namen auflöst.
- Eine **gesperrte** Person (`KERN.person.gesperrt`, DF4 a, seit 1.15.0) gibt es für den Platz nicht: Sie lässt sich weder
  wählen noch anmelden, und eine frühere Wahl gilt nicht mehr, bis sie freigeschaltet ist.

| Aufruf | Ergebnis |
|---|---|
| `platz({ speicher, gewaehlt, tab, finde, imTab?, gast? })` | ein Platz; `gewaehlt: null` = nur im Tab, nichts darüber hinaus gemerkt; `finde(wert)` der App entscheidet, wer zu diesem Platz gehört (Kennung, ältere Stände auch Name) |
| `aktiv()` | die angemeldete Person oder `null`; die Anmeldung dieses Tabs geht vor der gewählten Person des Geräts (1.14.1) |
| `waehle(wert)` | Person ohne Tab-Pflicht wählen (Tab wird geleert); `false` für Unbekannte, für wen der Tab gilt, und bei einem Platz nur im Tab |
| `anmelden(wert, pin)` | mit PIN muss sie stimmen (`KERN.geheimnis`); wer im Tab sein muss, braucht eine gesetzte PIN. Gibt die Person oder `null` |
| `abmelden()` | nichts gewählt, Tab leer, kein Gast |
| `alsGast()` | nur mit `gast: { tab, erlaubt? }`: meldet eine Person ab und gilt als Gast, nur in diesem Tab (Präfix + `gast.tab`); `false`, wenn `erlaubt()` nein sagt |
| `istGast()` | Gast in diesem Tab und noch erlaubt (abschalten beendet auch einen laufenden Gast) |

**Gast** (Entscheid C2 a, seit 1.8.0): ohne Person, nur im Tab; die App speichert für ihn nichts (keine Runden, Profil
ohne Wirkung) und schaltet ihn je Gerät ab (`erlaubt`). Wählen, anmelden und abmelden beenden ihn.

Benutzt von: Eulenpfad (`lernspiele:spieler`, Tab `lernspiele:aufsicht`, ohne Gast bis „👀 Nur schauen“;
`LS.aktuellerSpieler`, `setzeSpieler`, `meldeAufsichtAn`, `abmelden`) und Lernsteig (seit 1.8.0 ein Platz wie im
Eulenpfad: `lernsteig:aktiv`, Tab `lernsteig:angemeldet` für Jugendliche mit PIN und jede Aufsicht, Gast `lernsteig:gast`,
abschaltbar mit der Geräte-Einstellung `gast: "aus"`).

### 4.12 `KERN.entwicklung` (`kern/entwicklung.js`) — Entwickler-Modus

Entscheide E1 a, E2 a, E3 a (LERN_Session6), für alle Apps seit 1.9.0 (Plan C6). Herkunft: Eulenpfad
`spiele/gemeinsam/entwicklung.js`. Der Teil kennt keine Oberfläche: Was die App zeigt (Leiste, Listenansicht), bleibt in
der App; Meldungen gehen an `opt.melde`.

- **Ein Schlüssel für das Repo:** im Klartext nur in `entwickler.key` (gitignored), im Kern sein Hash
  `SHA-256(„eulenpfad-entwickler:<Schlüssel>“)` = `KERN.geheimnis.hash(s, SALZ)` — dieselbe Rechnung wie bisher, der
  bestehende Schlüssel gilt. `python tools/entwickler_server.py --neuer-schluessel` trägt einen neuen Hash in
  `kern/entwicklung.js` ein; danach Version erhöhen und verteilen.
- **Zustand je App und Gerät** unter `entwickler` im Speicher der App (`{ schluessel, an, name }`, nicht abgeglichen).
- **Server:** `tools/entwickler_server.py` (`APPS`): jede Anfrage nennt `app`; der Server schreibt Prüfstand
  (`<app>`-Datei, nur die Bereiche der App) und Bemerkungen der App. Ältere Seiten ohne `app` gelten als Eulenpfad.

| Aufruf | Ergebnis |
|---|---|
| `entwicklung({ app, speicher, aufsicht, name?, pruefstand?, arten, melde?, start? })` | Entwickler-Modus der App; `pruefstand` ist das Objekt der App (wird nach jeder Änderung auf den Stand des Servers gebracht, dasselbe Objekt) |
| `freischalten(s)`, `sperren()`, `freigeschaltet()` | Schlüssel gegen den Hash prüfen und merken |
| `aktiv()` | Zusätze sichtbar: angemeldete Aufsicht, freigeschaltet und eingeschaltet (`setzeAn`) |
| `name()`, `benenne(n)`, `zustand()` | Name für „von“ (sonst `opt.name()`), Zustand |
| `server()`, `fremd()`, `serverMeldung()` | läuft der Entwickler-Server? antwortet ein anderer auf dem Port? Text für die Meldung |
| `setzeGeprueft(art, id, ja)` | Inhalt angesehen bzw. Liste geprüft setzen oder aufheben; `art` aus `opt.arten`, sonst Fehler |
| `setzeEintraege(daten)` | Haken je Eintrag (Prüfansicht, LP2 a) |
| `bemerkung(daten)`, `bemerkungen()`, `bemerkungStatus(nr, status)` | Bemerkungen der App schreiben, lesen, Status setzen |

Benutzt von: Eulenpfad (`LS.entwicklung`, Bereiche `spiele`, `listen`; Schnittstelle unverändert) und Lernsteig
(`LST.ENTWICKLUNG`, Bereiche `uebungen`, `listen`; Freischalten auf der Aufsichtsseite, Leiste in den Übungen).

### 4.13 `KERN.einladung` (`kern/einladung.js`) — Einladung in eine andere App

Entscheid EL1 a, Notiz EP1 (Lernsteig, LST_Session1), im Kern seit 1.10.0. Beim Übertritt gibt die Aufsicht der Person
eine Einladung mit, nur Stammdaten, kein Verlauf, keine PIN. Zwei Wege mit demselben Inhalt: Link mit Fragment
`…/<ziel>/#einladung=<base64url(JSON)>` (geht nicht an den Server; die Ziel-App löscht es aus der Adresse) oder Datei
`<ziel>-einladung.json`.

```
{ format: "einladung", v: 1, ziel?, von?, name, geboren?, klasse?, niveau?, lehrplan? }
```

| Aufruf | Ergebnis |
|---|---|
| `erstellen(daten, { ziel, von })` | Inhalt der Einladung (leere Felder fallen weg); ohne Vornamen Fehler |
| `fragment(einladung)` | „#einladung=…“ (base64url über UTF-8-Bytes) |
| `dateiname(ziel)` | „lernsteig-einladung.json“ |
| `lesen(fragment \| objekt, { ziel, klasse, niveau, lehrplan })` | bereinigte Stammdaten oder `null`: fremdes Format, andere Version, Einladung für eine andere App, ohne Vornamen. Vorname und Geburtsdatum (auch ohne Tag, B3) prüft der Kern, Klasse, Niveau und Lehrplan die Ziel-App; Ungültiges fällt weg (D12). Ältere Einladungen des Lernsteigs `{ v: 1, … }` ohne `format` gelten |

Benutzt von: Eulenpfad (Profil eines Kindes in der 6. Klasse: „📨 Einladung zum Lernsteig“ mit Link oder Datei; Vorname,
Geburtsdatum oder -monat, Klasse 7) und Lernsteig (`einladungLesen` beim Laden der Startseite und „Einladung öffnen“
für die Datei; ein Geburtsmonat ohne Tag bleibt erhalten).

### 4.14 `KERN.auswertung` (`kern/auswertung.js`) — Auswertung ohne App-Bezug

Entscheide AW1 a, AW2 a (LERN_Session16), im Kern seit 1.11.0. Reine Rechnungen auf Runden (`zeit`, `dauer`) und auf
Listen von Aufgaben; Fazit, Vorschläge, Konzentration, Vorgehen und Kompetenztexte bleiben in den Apps. Testrunden
filtert die App vorher heraus.

| Aufruf | Ergebnis |
|---|---|
| `mittel`, `median`, `korrelation(xs, ys)` | Grundrechnungen; Korrelation null unter drei Werten oder ohne Streuung |
| `sitzungen(runden, { pauseMin })` | Runden zu Sitzungen (Pause plus Dauer der Runde) |
| `lernzeiten(runden, jetzt)` | Minuten und Runden je Wochentag, Tageszeit und Tag der letzten 14 Tage, `uebungstage14` |
| `wochenStart(zeit)`, `wochen(runden, ziel, jetzt)` | Wochen ab Montag seit der ersten Runde: Tage erfüllt (mit `ziel.minuten` ab so vielen Minuten, sonst ab einer Runde), Woche erfüllt ab `ziel.tage`, `serie` (die laufende Woche bricht sie nicht), `erfuellt` (Zahl) |
| `stand(aufgaben, { fenster, mindestens, schwelle, ohneGezeigt })` | **eine Regel für den Stand** (AW2 a): Quote auf Anhieb der letzten `fenster` Aufgaben; `sicher` ab `mindestens` Aufgaben, Quote ab `schwelle`, im Fenster keine gezeigte Lösung |
| `bedarf(quote, tageSeit, { schwelle })` | Gewicht für Zufallswahlen: neu 2, unter der Schwelle 1 + 4 · (1 − Quote), sonst frisch 0.5, nach sieben Tagen 2 |
| `ziehe(kandidaten, gewicht, n, zufall)` | nach Gewicht ziehen, ohne Zurücklegen |

Schwellen je App: Eulenpfad `fenster` 24, `mindestens` 1, `schwelle` 0.7 (für eine höhere Stufe mit Timer 0.9) —
bei Runden zu acht Aufgaben genau die bisherige Regel „letzte drei Runden“ (in `pruefe_kern.js` nachgerechnet, dazu
alte gegen neue Auswertung auf 3000 Zufallsverläufen gleich); Lernsteig `fenster` 10, `mindestens` 10, `schwelle`
0.85, ohne gezeigte Lösung, mit und ohne Rechner getrennt. `wochen` ohne Minuten ist die Wochenserie des Lernsteigs
(500 Zufallsfälle nachgerechnet), mit Minuten der Lernplan des Eulenpfads.

### 4.15 `KERN.rolleiste` (`kern/rolleiste.js`) — einzeilige Leiste mit Pfeilen

Im Kern seit 1.13.0 (Wunsch Patrik, LERN_Session17: die Tab-Leiste bricht nicht mehr in zwei Zeilen um). Eine Zeile, die
seitlich rollt; ein Pfeil steht nur da, wo noch etwas verborgen ist.

| Aufruf | Ergebnis |
|---|---|
| `rolleiste(inhalt, { aktiv, schritt, links, rechts })` | Hülle `div.rolleiste` mit `button.rolle-pfeil.links`, `inhalt` (bekommt `rolle-inhalt`) und `button.rolle-pfeil.rechts`. Pfeile mit `hidden`, nachgeführt beim Rollen und bei jeder Grössenänderung (`ResizeObserver`); ein Tippen rollt um `schritt` (0.7) der sichtbaren Breite. Nach dem Einhängen rollt das Element zu `aktiv` (`[aria-selected="true"]`) ins Bild, nur seitlich und erst, wenn die Pfeile stehen. Die Pfeile sind nicht fokussierbar: mit der Tastatur rollt der Fokus die Leiste selbst |
| `rolleiste.zustand(links, breite, sichtbar)` | `{ links, rechts }`: welche Pfeile nötig sind (1 px Toleranz für gebrochene Rollwerte beim Zoomen) |

Das Aussehen gibt die App; nötig sind `.rolle-inhalt { overflow-x: auto }` ohne Umbruch der Kinder, `.rolleiste {
position: relative }` für die Pfeile und `.rolle-pfeil[hidden] { display: none }`; die Pfeile dürfen neben der Rollfläche (Flex-Kinder der Hülle) oder darüber
stehen — beide Apps stellen sie daneben, damit sie keinen Tab verdecken. Benutzt von: Tab-Leiste des
Eulenpfads (`start/start.js`) und des Lernsteigs (`start/start.js`); beide zeigen „Angemeldet“ nur noch als Tooltip, unter
600 px stehen die Tabs auf eigener Zeile über der Person.

### 4.16 `KERN.personenMenue` (`kern/personenmenue.js`) — Personen-Knopf mit Menü

Im Kern seit 1.13.0, Entscheid PA1 a (LERN_Session17): Wer angemeldet ist, wechseln und abmelden steht in beiden Apps an
einem Ort und sieht gleich aus. Ersetzt die Auswahlliste des Eulenpfads (Personen und „Abmelden“ in einer Liste — mit
den Pfeiltasten meldete die Tastatur ohne Absicht ab) und im Lernsteig Name mit Knopf „Abmelden“.

| Aufruf | Ergebnis |
|---|---|
| `personenMenue({ ich, personen, waehle, schluss, titel })` | Hülle `div.personen-menue` mit `button.personen-knopf` (Bild, Name, ▾; `aria-haspopup="menu"`, `aria-expanded`) und `div.personen-liste[role=menu]`: je Person `button.personen-eintrag` (Bild, Name, `zusatz` wie 🔒), Trenner, `button.personen-schluss`. `ich` = `{ name, bild }`, `personen` ohne die angemeldete Person `[{ id, name, bild, zusatz, aria }]`, `waehle(id)` meldet an oder fragt die PIN (die App), `schluss` = `{ text, aktion }`, `titel` für Bildschirmleser („Angemeldet als“) |
| `personenMenue.naechster(i, n, taste)` | Index nach Pfeil ab/auf (im Kreis), Pos1, Ende; −1 ohne Einträge |

Bedienung: Tippen auf den Knopf öffnet und schliesst; Pfeil ab/auf auf dem Knopf öffnet mit dem ersten/letzten Eintrag;
im Menü wählt eine Pfeiltaste nichts aus, erst Enter oder ein Tippen; Esc schliesst und gibt den Fokus dem Knopf zurück,
Tab oder ein Tippen daneben schliesst. Die Liste steht bündig rechts am Knopf; reicht der Platz links nicht (Knopf am
linken Rand, auf dem Handy), setzt der Kern `nach-rechts`. Das Aussehen gibt die App; nötig sind `.personen-menue {
position: relative }`, die Liste absolut darunter, `.personen-liste[hidden] { display: none }` und `.personen-liste.nach-rechts
{ right: auto; left: 0 }`.

Benutzt von: Eulenpfad (`start/start.js`, `werWahl`: andere Kinder und Aufsichten mit Bild, eine Aufsicht über die
Anmeldung mit vorgewähltem Namen, „↩ Abmelden“) und Lernsteig (`start/start.js`, `personenKnopf`: Konten mit 🔒 und
Aufsichten mit 🔑; mit PIN über die PIN-Abfrage, „Zurück“ dort lässt die Person angemeldet; „↩ Abmelden“, beim Gast
„Anmelden“).

### 4.17 `KERN.terme` (`kern/terme.js`) — Terme lesen, vergleichen, Form prüfen

Im Kern seit 1.14.0 (LERN_Session17), aus `lernsteig/gemeinsam/terme.js`; Plan B, Befunde D3, D10. Ein Term wird exakt
als Polynom gelesen (Map „Monom → Bruch“ über `KERN.bruch`, Monom als Schlüssel „a2b1“).

| Aufruf | Ergebnis |
|---|---|
| `lies(text)` | `{ poly, info, roh }` oder wirft mit Klartext. Liest Variablen a–z, Zahlen „1'234.5“ und „1234,5“, Brüche „5/8“, `+ − - · * : ( )`, implizites Mal („3a“, „2(x + 1)“), Potenzen „^12“ und hochgestellt — eine Folge hochgestellter Ziffern ist **ein** Exponent („x²³“ = x^23). Grenzen (D10): Exponent höchstens `GRENZE_EXPONENT` (100), höchstens 2000 Glieder je Zwischenergebnis |
| `bewerte(eingabe, { antwortTerm, form })` | `{ ok, gleichwertig, lesbar, meldung }`; `form`: `vereinfacht`, `bruch`, `potenz`, `ausgeklammert`, `frei`. Eine unlesbare Eingabe wirft nie (D3: „(3)(2x+3)“ bei `ausgeklammert` ist ein Formfehler), ein unlesbarer `antwortTerm` schon (Fehler der Aufgabe) |
| `text(poly, sw)` | Text in der Ordnung des Lehrmittels (TO1 a): höchster Grad zuerst, bei gleichem Grad je Variable im Alphabet der höhere Exponent zuerst, Konstante zuletzt („a² + 2ab + b²“, „a²b + ab²“); Zahlen in der Schreibweise `sw` der App wie `KERN.zahl.text`, Brüche „z/n“; `lies(text(p))` ergibt wieder `p` |
| `gleich`, `plus`, `mal`, `neg`, `hoch`, `konst`, `variable`, `glieder` | Rechnen mit Polynomen für Aufgabengeneratoren |

Benutzt von: Lernsteig über `gemeinsam/terme.js`, das `LST_TERME` mit `text` in der Schreibweise des Lernsteigs
weiterreicht (Übungen behalten ihre Aufrufe). Tests: feste Beispiele, alle Formen, D3, D10 und 2000 Zufallsterme
(Polynom gegen Zahlwert, `text` gegen `lies`); alt gegen neu auf 5000 Zufallsfällen gleich ausser den behobenen Fällen.

### 4.18 `KERN.rechner` (`kern/rechner.js`) — Rechenkern des Taschenrechners

Im Kern seit 1.14.0 (LERN_Session17), Teil 1 aus `lernsteig/gemeinsam/rechner.js` (TR1 a, RE1 a); Befund D9. Ohne DOM.
Modelle, Beschriftungen, Bedienhilfe, Tipps zu Bedienfehlern und das Tastenfeld bleiben in der App.

| Aufruf | Ergebnis |
|---|---|
| Kennungen | Ziffern, „.“, `+ − · : ^ ( )`, „√“ (vor der Zahl), „x²“, „π“, „Ans“, dazu `VORZ` „(−)“, `VORZ_NACH` „+⇔−“, `WURZEL_NACH` „√x“, `NTE_INDEX` „ⁿ√“, `NTE_RADIKAND` „ˣ√y“ — der Vertrag mit den Modellen der App |
| `rechne(eingabe, ans)` | `{ wert }` oder `{ fehler }` mit Klartext, nie eine Ausnahme. Rangfolge Klammern, Wurzel und Potenz, Vorzeichen, Punkt vor Strich ((−)2² = −4); exakte Wurzeln ganz. D9: NaN „nicht definiert“, unendlich „Ergebnis zu gross“ |
| `anzeige(wert, sw)` | höchstens `STELLEN` (10) gültige Ziffern in der Schreibweise `sw`; erst gerundet, dann ab 10¹⁰ und unter 10⁻⁶ wissenschaftlich („1 · 10¹⁰“ für 9999999999.6, D9) |

Benutzt von: Lernsteig (`gemeinsam/rechner.js`: `rechne` und `anzeige` mit der Schreibweise des Lernsteigs). Tests: die
Beispiele aus Lehrplan und Anleitungen, D9 und 2000 Zufallsrechnungen gegen JavaScript; alt gegen neu auf 20 000
Zufallseingaben gleich.

### 4.19 `KERN.daten` (`kern/daten.js`) — Sichern, Einlesen und Abgleich

Entscheide DF1 a, DF2 a, DF4 a (LERN_Session18), dazu R1 a, P1 a und Befund D4. Herkunft: Eulenpfad (`LS.zusammenfuehren`,
`LS.abgleichDaten`, Löschvermerke) und Lernsteig (`lernsteig/gemeinsam/daten.js`: erst prüfen, dann alles oder nichts).
Seit 1.15.0 im Kern. Benutzt vom Eulenpfad seit LERN_Session18 (`LS.zusammenfuehren`, `LS.abgleichDaten`,
`LS.sicherung`, `LS.loescheSpieler`, `LS.loescheRunden`; Schlüssel `runden: "protokoll"`, Teil `meldungen`, Freigabe);
vom Lernsteig seit LERN_Session18 (`LST_DATEN`; Gerätefelder `aufsicht`, `anfragen`, `ohnePerson: ["gast"]`, `gueltig`
für die Elemente von `liste`; ohne angemeldete Aufsicht `rollen: ["lernend"]`, AS1 a).

```
{ format: "reihe-daten", version: 1, app, art: "sicherung" | "abgleich", gesichert, geraet?,
  personen, runden, rekorde, geloescht?, freigabe?, freigabeStand?, … Teile der App unter eigenem Namen }
```

- **Sicherung:** gewählte Personen (`fuerDatei`, ohne PIN) und ihre Runden und Rekorde. **Abgleich:** alles, dazu die
  Löschvermerke und, wenn die App sie teilt, die Freigabe.
- **Löschvermerke** (DF2 a) `{ personen: { <id>: ISO }, namen: { <name>: ISO }, runden: [{ person, name?, inhalt | null, bis }] }`:
  Eine Person fällt weg, wenn sie seit dem Vermerk weder geändert wurde noch gespielt hat (Runden beider Seiten); mit ihr
  ihre Runden. Ein Runden-Vermerk entfernt die Runden der Person (eines Inhalts oder alle) bis zu seinem Zeitpunkt. Die
  Vermerke beider Seiten gelten zusammen. Vermerke des Eulenpfads bis LERN_Session18 (`spieler`, `spiel`) werden gelesen.
- **Ältere Dateien:** `eulenpfad-daten` 1–3 und Dateien ohne `format` mit `profile` oder `personen` und `protokoll`
  (Eulenpfad; Profile nach Namen über `altePerson`, Einträge nur mit Namen bekommen die Person der Datei oder eine neue,
  `spiel` → `inhalt`), `lernsteig-sicherung` 1–2 (`konten`, `konto` → `person`, `uebung` → `inhalt`).
- **Einlesen:** erst lesen und jeden Eintrag prüfen — Personen mit `KERN.person.maengel`, Runden und Rekorde mit
  `KERN.runden.maengel`, dem Schema der App und nur zu einer Person des Ergebnisses (oder `ohnePerson`); Ungültiges wird
  gezählt (`abgewiesen`) und nie gespeichert. Dann im Speicher zusammenführen und **nur geänderte Schlüssel** schreiben;
  scheitert ein Schreiben, wird alles zurückgeschrieben (alles oder nichts). Ein zweites Einlesen derselben Datei schreibt nichts.

| Aufruf | Ergebnis |
|---|---|
| `KERN.daten({ app, speicher, schluessel?, dateiPraefix?, geraetFelder?, pruefung?, gueltig?, ohnePerson?, freigabe?, teile?, altePerson?, umdeuten? })` | Daten einer App; `gueltig: { runde, rekord }` weitere Prüfung der App je fremdem Eintrag; `umdeuten({ runden, rekorde })` bringt fremde Einträge älterer Fassungen vor der Prüfung in die heutige Form (1.20.0; beide Apps mit `KERN.runde.ausEulenpfad` bzw. `ausLernsteig`); `schluessel` je Bereich (Standard gleichnamig, Eulenpfad `runden: "protokoll"`); `teile: { <name>: { schluessel, sichern(ids \| null, eigene), zusammenfuehren(eigene, fremde, { umbiegen, personVon }) → { wert, neu }, entferne?(eigene, ids) } }` |
| `sichern({ ids, art, filter, geraet })` | Datei als Objekt; `ids: null` = alle Personen; `filter(e)` für Runden und Rekorde (etwa ohne Testrunden) |
| `einlesen(text \| objekt, { rollen })` | `rollen`: nur Personen dieser Rollen, die anderen abgewiesen (null = alle); `{ personen: { neu, geaendert }, runden, rekorde, teile, freigabe, abgewiesen, kennungen, ids, neueIds, geschrieben, datei }`; Fehler mit Klartext |
| `lesen(text \| objekt)` | nur lesen und umdeuten; Fehler: „Diese Datei kann ich nicht lesen.“, „Das ist keine Sicherung und keine Abgleich-Datei.“, „Das ist eine Datei des Lernsteigs; hier lässt sie sich nicht einlesen.“, neuere Fassung, „Die Datei ist beschädigt.“ |
| `loeschePerson(id)`, `loescheRunden(id, inhalt)` | löschen mit Vermerk, alles oder nichts; Teile mit `entferne` werden mitgezogen |
| `vermerke()`, `dateiname(teil, datum)` | Löschvermerke des Geräts; „lernspiele-Mia-Lena-2026-11-06.json“ (`.gitignore` hält `<präfix>-*.json` aus dem Repo) |
| `KERN.daten.vermerkeRein`, `vermerkeVereinen`, `personWeg`, `eintragWeg`, `lesen(e, app)` | Bausteine |

Geprüft in `tools/pruefe_kern.js`, darunter eine Nachrechnung: zwei Geräte mit zufälligen Personen, Runden und Löschungen
gleichen in beide Richtungen ab und haben danach denselben Stand, ohne dass eine gelöschte Runde zurückkommt (150 Fälle).

### 4.20 `KERN.abgleich` (`kern/abgleich.js`) — Abgleich über einen Ordner

Entscheide S1 a (Eulenpfad), DF3 a (LERN_Session18, seit 1.17.0). Jedes Gerät schreibt nur seine eigene Datei
`<dateiPraefix><gerät>.json` in einen Ordner, den die Aufsicht wählt, und liest beim Abgleichen die der anderen; zwei
Geräte überschreiben sich nie. Ordner nur mit File System Access (Chrome, Edge auf dem Computer), der Zugriff wird in
IndexedDB gemerkt; sonst dieselben Daten als Datei. Browser-Schnittstellen erst beim Aufruf.

| Aufruf | Ergebnis |
|---|---|
| `KERN.abgleich({ speicher, dateiPraefix, datenbank, ordnerId?, sichern(geraet), einlesen(text, { quelle }), ereignis?, geteilt?, beiAenderung?, zaehltNicht?, schluessel? })` | Abgleich einer App; `sichern` liefert die eigene Datei (`KERN.daten` mit `art: "abgleich"`), `einlesen` führt eine fremde zusammen (`quelle`: „ordner“ oder „datei“); für Tests `ordnerWahl`, `ablage`, `kannOrdner` |
| `jetzt(fragen)` | `{ status: "ok" \| "kein-ordner" \| "keine-erlaubnis" \| "fehler", neu, geraete }`; `neu` zählt die Ergebnisse zusammen (Zahlen addiert, Ja/Nein verbunden, `KERN.abgleich.summe`); kam etwas dazu, das Ereignis; eine kaputte Datei steht als `{ datei, fehler }` in `geraete`, die anderen werden gelesen |
| `waehlen()`, `vergessen()`, `ordner()` | Ordner wählen (nach einem Tippen) und abgleichen; vergessen; den gemerkten Ordner |
| `starte()` | selbsttätig: gleich, wenn die Seite wieder sichtbar wird, und 1,5 s nach Änderungen an `geteilt`; `false` ohne Ordner-Fähigkeit |
| `dateiSichern()`, `dateiEinlesen(datei)`, `geraet()`, `benenne(name)`, `stand()` | Abgleich über eine Datei; Gerät mit Kennung und Namen (`geraet`); letzter Stand (`abgleichStand`) |

Benutzt vom Eulenpfad (`LS.abgleich`, `lernspiele-sync-`, IndexedDB `lernspiele`, Ereignis `lernspiele:abgeglichen`).
Der Lernsteig bekommt ihn mit der Verwaltung (Plan C; `lernsteig-sync-`, IndexedDB `lernsteig`, SP1 a). Geprüft in
`tools/pruefe_kern.js` mit einem Ersatz-Ordner: drei Geräte, kaputte Datei, fremdes Präfix, Erlaubnis, Vergessen.

### 4.21 `KERN.rollen` (`kern/rollen.js`) — Bestätigung, PIN vergessen, Zurücksetzen mit Frist

Entscheide KR2 a, PIN1 a, PIN1-R a, D5; RL1 a, RL2 a (LERN_Session18, seit 1.18.0). Für Aufsichten in allen Apps gleich;
gearbeitet wird auf der Personenliste der App (`KERN.person.liste`). Die Gruppenleitung (G2 a) kommt mit den Gruppen
(RL1 a, LERN-48).

| Aufruf | Ergebnis |
|---|---|
| `brauchtBestaetigung(personen)` | gibt es eine Aufsicht mit PIN? (eine gesperrte zählt nicht, sie könnte nicht bestätigen) |
| `bestaetige(personen, { id, pin }, { ausser })` | die bestätigende Aufsicht, sonst Fehler „Eine Aufsicht dieses Geräts muss mit ihrer PIN bestätigen.“ (`BESTAETIGEN`); nicht die Person selbst |
| `neuePin(personen, id, pin, { code } \| { antwort } \| { bestaetigung })` | PIN vergessen, Stufen 1–3: Weg prüfen, neue PIN, gleich ein neuer Code (Frage und Antwort bleiben); `{ person, code }` |
| `frist({ speicher, schluessel = "zuruecksetzen", tage = 3, jetzt })` | Stufe 4: `{ TAGE, stand, anfordern, abbrechen, abgelaufen }`; `abgelaufen()` erledigt die Frist und sagt der App, dass sie zurücksetzt |
| `abbrechbarMit(personen, eingabe)` | ist die Eingabe die PIN oder der Code einer Aufsicht mit PIN? |
| `zuruecksetzen(personen, { art: "lernend" \| "entfernen", verweise })` | nach Ablauf: Eulenpfad „lernend“ (Konto ohne PIN, Code, Frage); Lernsteig „entfernen“ (Aufsicht auf diesem Gerät entfernt, ihre Kennung aus `aufsicht` und `anfragen` der Konten gestrichen, ohne Löschvermerk — über den Abgleich kommt sie gesperrt zurück, DF4 a) |

Benutzt vom Eulenpfad (`LS.zuruecksetzen…`, Bestätigung beim Freischalten) und vom Lernsteig (`aufsichtAnlegen`,
`aufsichtPinVergessen`, `freischalten`, `frist…`; Sicherheitsfrage beim Anlegen Pflicht). Geprüft in `tools/pruefe_kern.js`
(alle Stufen, falsche Wege, Frist mit fester Uhr, beide Arten des Zurücksetzens) und `tools/pruefe_konten.js`.

### 4.22 `KERN.runde` (`kern/runde.js`) — Ablauf einer Runde

Zuschnitt AR1 a (ohne Oberfläche: Prüfen der Antwort, Bewertung, Lob, Sterne, Timer und Wartezeiten bleiben in der App),
Einzelentscheide RA1–RA8 a (Plan B). Seit 1.19.0 die reinen Hilfen, seit 1.20.0 der Ablauf selbst.

**Eintrag einer Runde** (`lauf().eintrag`, RA1–RA4 a): `{ id, zeit (Ende), …Felder der App, aufgaben, fehler, gezeigt,
dauer (s, auf 0,1), liste, endlos?, gekuerzt?, abgebrochen? }`; `liste` je Aufgabe `{ ms, versuche, geloest, gezeigt?,
uebersprungen?, zeitUm?, … Felder der App }`, mit Fehlversuch oder „Zeit um“ dazu `text`, `loesung`, `eingaben` (die letzten
6). `ms` ab `bereit` (sonst ab `gestellt`) ohne Pausen (RA7 a). Eine Serie ist eine Runde (RA3 a): Eintrag mit `endlos` und
dazu ein Rekord `{ id (dieselbe), zeit, punkte, dauer, alles?, abgebrochen? }`.

| Teil | Zweck |
|---|---|
| `lauf({ endlos, anzahl, loesungNach = 3, id?, uhr?, messuhr? })` | Ablauf: je Aufgabe `gestellt({ text, loesung })`, `bereit()`, `pause()`/`weiter()`, `eingabe(t)`, `zusatz(felder)`, dann `falsch({ text, loesung, eingabe })` → `{ versuche, loesungZeigen, vorbei }` (Lösung nach dem dritten Fehlversuch, wenn eine Lösung genannt ist; in einer Serie vorbei), `zeitUm()` (ein Fehler, die Aufgabe bleibt offen; Serie vorbei), `richtig()` → `{ aufAnhieb }`, `uebersprungen()`; `erschoepft()`; Stand `offen`, `versuche`, `aufgaben`, `fehler`, `geschafft`, `gezeigt`, `liste`, `vorbei`; `eintrag(felder, { abgebrochen })`, `rekord(felder, { abgebrochen })`. Die Kennung entsteht erst beim ersten Eintrag (so bleibt die Zufallsfolge eines Testlaufs gleich) |
| `eintragen(liste, eintrag)` (auch `rekordEintragen`) | gleiche Kennung ersetzt (Zwischenstand → Endstand), für Runden und Rekorde; neue Liste |
| `mitFehler(eintrag)`, `aufAnhieb(aufgabe)` | Aufgaben mit Fehlversuch oder „Zeit um“ (früher `fehlerAufgaben`); gelöst ohne Fehlversuch, „Zeit um“ und Tipp (T1 a) |
| `ausEulenpfad(e)`, `ausLernsteig(e)` | Runden bis LERN_Session18 in die heutige Form: Eulenpfad `aufgabenZeiten` + `fehlerAufgaben` (in der Reihenfolge der Aufgaben mit Fehler; ohne `aufgabenZeiten` die übrigen Aufgaben ohne Zeit), Lernsteig `zeiten` + `liste` + `falsch` und `zeit` vom Beginn ans Ende (RA1 a). Heutige Einträge bleiben, wie sie sind |
| `gedaechtnis({ speicher, schluessel, feld = "gestellt", alt, max = 400 })` | Durchgang über Runden und Serien (RA5 a): `hat(fp)`, `merke(fp)`, `beginneNeu(fps)`; Schlüssel „Person\|Inhalt/Stufe“ (ohne Niveau); `alt` übernimmt frühere Schlüssel (Eulenpfad: nach Name) und entfernt sie |
| `auswahl({ gedaechtnis, endlos, serieMax = 3 })` | je Aufgabe `neueSuche()`, je Zug `pruefe(kennung, serien, versuch)` → `{ nehmen, serieErzwungen, wiederholung }`, `{ erschoepft }` oder `{ weiter }`. Suche in fünf Stufen (`VERSUCHE`): neu und ohne Muster → aus früheren Runden → Serie erzwungen → neuer Durchgang → eine Wiederholung der Runde, nie direkt hintereinander (nicht in Serien). Erschöpft: Runde endet früher mit `gekuerzt`, Serie mit „alles geschafft“ (RA6 a) |
| `bestwert(rekorde, passt)`, `bestzeit(runden, passt)` | höchster Stand; kürzeste Dauer nur voller Runden ohne gezeigte Lösung, keine Serie, keine gekürzte |
| `sekunden(ms)` | Dauer auf 0,1 s (RA2 a) |
| `waechter(beimVerlassen, { fenster, dokument })` | Zwischenstand bei `pagehide` und `visibilitychange` (hidden); `aus()` |

Die Kennung einer Aufgabe bildet die App (Eulenpfad aus der Fläche, Lernsteig aus dem Generator), der Kern vergleicht nur
ihre Fingerabdrücke. Benutzt von beiden Apps (Eulenpfad: Ablauf, Auswahl, Gedächtnis, Rekorde, Wächter, Mix mit den
Einträgen je Aufgabe; Lernsteig: dazu Bestzeit). Geprüft in `tools/pruefe_kern.js`: Nachrechnung gegen die bisherige
Schleife des Eulenpfads (1200 Runden aus 300 Zufallsfällen, gleiche Züge und Kürzungen), Durchgang, Serie bis erschöpft,
Serienbremse, Rekord, Bestzeit, Wächter; Ablauf mit fester Uhr (Zeit ab bereit, Pause, Zeit um, Lösung nach dem dritten
Fehlversuch, Serie); Umdeutung gegen die alte Aufzeichnung beider Apps (je 300 Zufallsrunden; Gegenprobe mit falscher
Zuordnung schlägt an). Die letzte, falsch beantwortete Aufgabe einer alten Lernsteig-Serie hat keine Zeit: Sie wurde nie
gemessen.

### 4.23 Geplant

Noch nicht im Kern (Plan B, Tabelle der Kern-Teile, und `docs/gemeinsame_mechaniken.md`, Spalte „Kern?“): die
Gruppenleitung mit den Gruppen (RL1 a, LERN-48). Prüfen der Antwort und der Vertrag `aufgabeErzeugen`/`pruefeAufgabe`
bleiben nach AR1 a in den Apps. Ein neuer Teil bekommt hier seinen Abschnitt, bevor er umzieht.

## 5. Ändern und verteilen

1. Den Teil in `kern/` ändern, nie die Kopie in einer App.
2. `kern/VERSION` nach KB1 a erhöhen: kleine Nummer Fehlerbehebung, mittlere neue Funktion (alte bleiben), grosse
   Schnittstelle geändert (Apps müssen nachziehen). Eintrag in `kern/CHANGELOG.md`.
3. `node tools/pruefe_kern.js` grün.
4. `python tools/kern_verteilen.py` (alle Apps) oder `python tools/kern_verteilen.py <app>` (nur eine).
5. Die Testskripte der betroffenen Apps laufen lassen.

Eine App darf hinter dem Kern zurückliegen; sie verteilt erst, wenn ihr Testskript mit der neuen Version grün ist.

## 6. Prüfung

- `node tools/pruefe.js` — Einstieg für alle Apps (Plan B2): ohne Angabe Kern, Lernsteig und Gratwanderung, den
  Eulenpfad nur, wenn genannt (`node tools/pruefe.js eulenpfad [spiel …]`); Übersicht mit Dauer je App.
- `node tools/pruefe_kern.js` — alle Teile und die Kopien; Ende mit Code 1 bei einem Fehler.
- `python tools/kern_verteilen.py --pruefe [app …]` — nur die Kopien, schreibt nichts:
  - **Fehler:** Kopie fehlt, ist von Hand geändert (Prüfsumme im Kopf stimmt nicht mit dem Inhalt) oder trägt die
    Version des Kerns mit anderem Inhalt (Version vergessen).
  - **Hinweis:** Kopie liegt zurück (ältere Version).
- Das Testskript jeder App prüft ihre Kopie mit (`tools/pruefe_spiele.js`, `tools/pruefe_uebungen.js`; Einstieg `tools/pruefe.js`)
  und lädt sie so, wie die Seiten sie laden.
