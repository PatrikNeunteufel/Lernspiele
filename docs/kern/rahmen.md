# Kern der Reihe — Vertrag Kern ↔ Apps

Stand: kern 1.8.0, 2026-11-06 (LERN_Session16). Entscheide KB1 a, KB2 a; Plan [plan_angleich_reihe.md](../plan_angleich_reihe.md)
Abschnitt B. Gegenstücke: [Eulenpfad](../eulenpfad/rahmen.md), [Lernsteig](../lernsteig/rahmen.md).

Der Kern enthält, was Eulenpfad, Lernsteig und Gratwanderung **gleich** brauchen. Er kennt keine App: Alles, was je
App anders ist (Schreibweise, Speicher-Präfix, Rollen-Namen), gibt die App als Parameter mit.

## 1. Aufbau

```
kern/TEILE            Teile in Ladereihenfolge, je Zeile eine Datei
kern/VERSION          Version des Kerns (1.8.0)
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
| Lernsteig | `index.html`, `statistik.html`, `aufsicht.html` | `<script src="kern/kern.js"></script>` vor `gemeinsam/werkzeug.js` |
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

| Aufruf | Ergebnis |
|---|---|
| `geburtsdatumLies(text)` | „TT.MM.JJJJ“, „JJJJ-MM-TT“ → „JJJJ-MM-TT“; „MM.JJJJ“, „JJJJ-MM“ → „JJJJ-MM“; sonst `null` |
| `geburtsdatumText(g)` | „07.03.2014“, ohne Tag „März 2014“ |
| `alter(g, heute)` | ganze Jahre; ohne Tag ab dem Ersten des Monats; `tagFehlt(g)` |
| `nameRein`, `nameGleich` | Namen bereinigen und vergleichen |
| `maengel(p)` | Liste von Mängeln (leer = gültig) — für Einlesen, Abgleich, Einladung |
| `ohneGeheimnis(p, geraetFelder)` | Kopie für Sicherung, Abgleich, Einladung, Übernahme |
| `liste(speicher, { schluessel, felder })` | `{ alle, finde (auch über frühere Kennungen), findeName, nameFrei, anlegen, aendere, entferne, speichere }`; `anlegen` und `aendere` prüfen Name und Mängel und melden einen vollen Speicher |
| `zusammenfuehren(eigene, fremde, { geraetFelder })` | gleiche Kennung (auch frühere) → verbinden; sonst gleicher Name → verbinden, die ältere Kennung bleibt, die andere wird frühere; sonst neu; Ungültiges abgewiesen. Je Feld der jüngere Stand; ein jüngerer Name, den hier jemand anders trägt, gilt nicht. Ergebnis `{ personen, neu, geaendert, abgewiesen, kennungen: { alt: neu } }` — mit `kennungen` biegt die App Verweise (Runden, Rekorde) um |

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
| `zusammenfuehren(eigene, fremde, { art, pruefung, umbiegen, behalten })` | nach Kennung; Rekord: höherer Stand; fremde geprüft und abgewiesen, eigene bleiben (nur `behalten` entscheidet, etwa ein Löschvermerk); nach Zeit sortiert; `{ eintraege, neu, ersetzt, abgewiesen }` |
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

| Aufruf | Ergebnis |
|---|---|
| `platz({ speicher, gewaehlt, tab, finde, imTab?, gast? })` | ein Platz; `gewaehlt: null` = nur im Tab, nichts darüber hinaus gemerkt; `finde(wert)` der App entscheidet, wer zu diesem Platz gehört (Kennung, ältere Stände auch Name) |
| `aktiv()` | die angemeldete Person oder `null` |
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

### 4.12 Geplant (Plan B, Reihenfolge B4)

Profil-Übernahme zwischen den Apps (C9), Entwickler-Modus, Auswertung (Fazit, Bedarf,
Kompetenzstand) mit Regeln je App, Einladung, Terme, Rechenkern des Rechners. Je Teil kommt hier ein Abschnitt dazu,
bevor er umzieht.

## 5. Ändern und verteilen

1. Den Teil in `kern/` ändern, nie die Kopie in einer App.
2. `kern/VERSION` nach KB1 a erhöhen: kleine Nummer Fehlerbehebung, mittlere neue Funktion (alte bleiben), grosse
   Schnittstelle geändert (Apps müssen nachziehen). Eintrag in `kern/CHANGELOG.md`.
3. `node tools/pruefe_kern.js` grün.
4. `python tools/kern_verteilen.py` (alle Apps) oder `python tools/kern_verteilen.py <app>` (nur eine).
5. Die Testskripte der betroffenen Apps laufen lassen.

Eine App darf hinter dem Kern zurückliegen; sie verteilt erst, wenn ihr Testskript mit der neuen Version grün ist.

## 6. Prüfung

- `node tools/pruefe_kern.js` — alle Teile und die Kopien; Ende mit Code 1 bei einem Fehler.
- `python tools/kern_verteilen.py --pruefe [app …]` — nur die Kopien, schreibt nichts:
  - **Fehler:** Kopie fehlt, ist von Hand geändert (Prüfsumme im Kopf stimmt nicht mit dem Inhalt) oder trägt die
    Version des Kerns mit anderem Inhalt (Version vergessen).
  - **Hinweis:** Kopie liegt zurück (ältere Version).
- Das Testskript jeder App prüft ihre Kopie mit (`tools/pruefe_spiele.js`, `docs/lernsteig/werkzeuge/pruefe_uebungen.js`)
  und lädt sie so, wie die Seiten sie laden.
