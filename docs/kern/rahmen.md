# Kern der Reihe — Vertrag Kern ↔ Apps

Stand: kern 1.0.0, 2026-11-05 (LERN_Session15). Entscheide KB1 a, KB2 a; Plan [plan_angleich_reihe.md](../plan_angleich_reihe.md)
Abschnitt B. Gegenstücke: [Eulenpfad](../eulenpfad/rahmen.md), [Lernsteig](../lernsteig/rahmen.md).

Der Kern enthält, was Eulenpfad, Lernsteig und Gratwanderung **gleich** brauchen. Er kennt keine App: Alles, was je
App anders ist (Schreibweise, Speicher-Präfix, Rollen-Namen), gibt die App als Parameter mit.

## 1. Aufbau

```
kern/TEILE            Teile in Ladereihenfolge, je Zeile eine Datei
kern/VERSION          Version des Kerns (1.0.0)
kern/CHANGELOG.md     Änderungen je Version
kern/<teil>.js        die Teile — einzige Quelle
tools/kern_verteilen.py   bündelt die Teile in <app>/kern/kern.js (Kopie je App)
tools/pruefe_kern.js      Tests der Teile und der Kopien
<app>/kern/kern.js        Kopie je App, erzeugt — nie von Hand ändern
```

`kern/` selbst geht nicht online (Pages veröffentlicht nur `portal/` und die App-Ordner); online ist nur die Kopie
im App-Ordner. So bleibt jeder App-Ordner eigenständig (P1 a) und läuft offline per Doppelklick.

## 2. Regeln für jeden Teil

- **Ohne DOM, ohne Speicher, ohne App-Globals.** Ein Teil liest weder `LS`, `LST` noch `localStorage`. Braucht er
  etwas aus der App (Schreibweise, Präfix), bekommt er es als Parameter.
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

### 4.3 Geplant (Plan B, Reihenfolge B4)

Speicher mit Präfix, Zufall mit austauschbarer Quelle, `el`, Profil (Geburtsdatum B3, Übernahme zwischen den Apps
C9), Rollen und PIN, Freigabe und Prüfstand, Suche, Protokoll und Statistik, Sichern und Einlesen mit Schema,
Einladung, Terme, Rechenkern des Rechners. Je Teil kommt hier ein Abschnitt dazu, bevor er umzieht.

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
