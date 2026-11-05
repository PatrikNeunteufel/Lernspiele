/* kern 1.1.0 · Prüfsumme sha256:f62a55b4a13239611abc9a5b5fa633a7e6794f1136878637951f2012209643c1 · erzeugt von tools/kern_verteilen.py aus kern/ — nicht von Hand ändern, sondern kern/ ändern und neu verteilen. */
/* ---- kern/zahl.js ---- */
/* Kern — Zahlschreibung (Entscheide KB1 a, KB2 a; Plan docs/plan_angleich_reihe.md B).
   Die Schreibweise ist eine Einstellung der App, der Kern kennt keine App:
     { tausender: Zeichen der Gliederung, abStellen: ab so vielen Ziffern vor dem Komma wird gegliedert,
       minus: Minuszeichen, dezimal: Dezimalzeichen }
   Eulenpfad: schmales Leerzeichen ab 5 Stellen („30 400“, „4500“); Lernsteig: Apostroph ab 4 Stellen (Z1 a, „1'000“).
   Ohne DOM und ohne Speicher; im Browser und in Node gleich. */
"use strict";

(function (KERN) {
  const STANDARD = { tausender: " ", abStellen: 5, minus: "−", dezimal: "." };
  const mit = sw => Object.assign({}, STANDARD, sw || {});

  /** Ziffernfolge vor dem Komma gliedern („30400“ → „30 400“), kürzere bleiben ungegliedert. */
  function gliedere(ziffern, sw) {
    return ziffern.length < sw.abStellen ? ziffern : ziffern.replace(/\B(?=(\d{3})+(?!\d))/g, sw.tausender);
  }

  /** Betrag als Dezimaltext ohne Exponent und ohne Rundungsreste („0.00000004485“, 0.1 + 0.2 → „0.3“). */
  function klartext(x) {
    return Number(Math.abs(x).toPrecision(15)).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 });
  }

  /**
   * Zahl mit dem Dezimalzeichen der Schreibweise; vor dem Komma gegliedert. stellen: feste Anzahl Nachkommastellen,
   * ohne Angabe so viele wie nötig. Das Minus steht nur, wenn eine Ziffer ungleich 0 sichtbar ist (kein „−0“).
   */
  function dezimalText(x, stellen, sw) {
    sw = mit(sw);
    if (!Number.isFinite(x)) return String(x);
    // Ganze Zahlen exakt (auch 16 Stellen), sonst über klartext; mit stellen gerundet.
    const roh = stellen !== undefined ? Math.abs(x).toFixed(stellen)
      : Number.isSafeInteger(x) ? String(Math.abs(x)) : klartext(x);
    const [ganz, rest] = roh.split(".");
    const t = gliedere(ganz, sw) + (rest ? sw.dezimal + rest : "");
    return x < 0 && /[1-9]/.test(roh) ? sw.minus + t : t;
  }

  /** Zahl in der Schreibweise der App. Ganze Zahlen ohne Komma; andere wie dezimalText (nur der ganze Teil gegliedert). */
  function text(n, sw) {
    return dezimalText(n, undefined, sw);
  }

  /**
   * Eingabe einer Zahl lesen: „−“, „-“, „–“ als Minus, Punkt oder Komma als Dezimalzeichen, Leerzeichen und Apostroph
   * als Gliederung. Eine Zahl oder null, wenn die Eingabe keine Zahl ist.
   */
  function lies(eingabe) {
    const t = String(eingabe).trim().replace(/[\s  '’]/g, "").replace(/[−–]/g, "-").replace(",", ".");
    if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t)) return null;
    return Number(t);
  }

  KERN.zahl = { STANDARD, text, dezimalText, lies, klartext };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/bruch.js ---- */
/* Kern — exakte Bruchrechnung mit BigInt (Entscheide KB1 a, KB2 a; Herkunft lernsteig/gemeinsam/bruch.js, LST_Session1).
   Für Prüffunktionen: Lösungen werden unabhängig vom Generator nachgerechnet. Ohne DOM, ohne Speicher.
   Ein Bruch ist { z, n } (BigInt) mit n > 0, gekürzt. */
"use strict";

(function (KERN) {
  const ggt = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
  function bruch(z, n = 1n) {
    z = BigInt(z); n = BigInt(n);
    if (n === 0n) throw new Error("Division durch 0");
    if (n < 0n) { z = -z; n = -n; }
    const g = ggt(z, n) || 1n;
    return { z: z / g, n: n / g };
  }
  const plus = (a, b) => bruch(a.z * b.n + b.z * a.n, a.n * b.n);
  const minus = (a, b) => bruch(a.z * b.n - b.z * a.n, a.n * b.n);
  const mal = (a, b) => bruch(a.z * b.z, a.n * b.n);
  const durch = (a, b) => bruch(a.z * b.n, a.n * b.z);
  const neg = a => bruch(-a.z, a.n);
  function hoch(a, e) { let r = bruch(1n); for (let i = 0; i < e; i++) r = mal(r, a); return r; }

  /** Ganzzahlige k-te Wurzel von x ≥ 0, exakt auch über 2^53 (Bisektion auf BigInt); null, wenn nicht ganz. */
  function wurzelGanz(x, k) {
    if (x < 0n) return null;
    if (x < 2n) return x;
    const K = BigInt(k);
    let lo = 0n, hi = 1n;
    while (hi ** K <= x) hi *= 2n;
    while (lo + 1n < hi) { const m = (lo + hi) / 2n; if (m ** K <= x) lo = m; else hi = m; }
    return lo ** K === x ? lo : null;
  }
  /** Exakte k-te Wurzel, sonst Fehler. */
  function wurzel(a, k) {
    const z = wurzelGanz(a.z, k), n = wurzelGanz(a.n, k);
    if (z === null || n === null) throw new Error("Wurzel nicht exakt");
    return bruch(z, n);
  }
  /** Dezimaltext („1'234.56“, „30 400“, „0,5“, „-3“) → Bruch; keine Zahl → Fehler „keine Zahl: …“. */
  function zahl(text) {
    const t = String(text).replace(/['’\s  ]/g, "").replace(/−/g, "-").replace(",", ".");
    const m = /^([+-]?)(\d*)(?:\.(\d*))?$/.exec(t);
    if (!m || !(m[2] + (m[3] || ""))) throw new Error(`keine Zahl: ${text}`);
    const d = m[3] || "";
    const b = bruch(BigInt((m[2] || "0") + d), 10n ** BigInt(d.length));
    return m[1] === "-" ? neg(b) : b;
  }
  /** JavaScript-Zahl → Bruch über den Dezimaltext mit 15 gültigen Ziffern (exakt für grosse und sehr kleine Zahlen). */
  function vonZahl(x) {
    if (!Number.isFinite(x)) throw new Error(`keine endliche Zahl: ${x}`);
    const s = Number.isSafeInteger(x) ? String(Math.abs(x))
      : Number(Math.abs(x).toPrecision(15)).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 });
    const b = zahl(s);
    return x < 0 ? neg(b) : b;
  }
  const gleich = (a, b) => a.z === b.z && a.n === b.n;
  /** Vergleich: negativ, 0 oder positiv wie a − b. */
  const vergleich = (a, b) => { const d = a.z * b.n - b.z * a.n; return d < 0n ? -1 : d > 0n ? 1 : 0; };
  /** Ist der Bruch eine endliche Dezimalzahl? */
  function endlich(a) { let n = a.n; for (const p of [2n, 5n]) while (n % p === 0n) n /= p; return n === 1n; }
  const text = a => (a.n === 1n ? String(a.z) : `${a.z}/${a.n}`);
  const alsZahl = a => Number(a.z) / Number(a.n);

  KERN.bruch = { bruch, plus, minus, mal, durch, neg, hoch, wurzel, wurzelGanz, zahl, vonZahl, gleich, vergleich, endlich, text, alsZahl };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/speicher.js ---- */
/* Kern — Speicher im Browser mit Präfix der App (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.3).
   Alle Apps teilen den Ursprung patrikneunteufel.github.io und damit localStorage; darum schreibt jede App nur unter
   ihrem Präfix („lernspiele:“, „lernsteig:“, „gratwanderung:“). Der Kern kennt keine Schlüssel der Apps.
   Darf fehlen (privates Fenster, gesperrter Speicher, Node): dann gilt beim Lesen der Ersatz, Schreiben meldet false. */
"use strict";

(function (KERN) {
  // Über den globalen Namen, nicht über globalThis: Ersatz-DOMs der Testskripte (tools/pruef_dom.js) legen
  // localStorage als Variable an. Der Zugriff selbst kann werfen (gesperrte Cookies).
  const ablage = () => { try { return typeof localStorage !== "undefined" ? localStorage : null; } catch (e) { return null; } };

  /**
   * Speicher für ein Präfix: { praefix, lies(schluessel, ersatz), schreibe(schluessel, wert) → true|false,
   * entferne(schluessel), schluessel() → Liste der Schlüssel ohne Präfix }. Werte als JSON.
   */
  function speicher(praefix) {
    if (typeof praefix !== "string" || !/^[a-z][a-z0-9-]*:$/.test(praefix)) throw new Error(`ungültiges Präfix: ${praefix}`);
    function lies(schluessel, ersatz) {
      try {
        const v = ablage()?.getItem(praefix + schluessel);
        return v === null || v === undefined ? ersatz : JSON.parse(v);
      } catch (e) { return ersatz; }
    }
    function schreibe(schluessel, wert) {
      try {
        const a = ablage();
        if (!a) return false;
        a.setItem(praefix + schluessel, JSON.stringify(wert));
        return true;
      } catch (e) { return false; } // voll oder gesperrt: der Aufrufer entscheidet, ob er warnt
    }
    function entferne(schluessel) { try { ablage()?.removeItem(praefix + schluessel); } catch (e) { /* fehlt */ } }
    function schluessel() {
      const a = ablage(), liste = [];
      try { for (let i = 0; a && i < a.length; i++) { const k = a.key(i); if (k && k.startsWith(praefix)) liste.push(k.slice(praefix.length)); } }
      catch (e) { /* fehlt */ }
      return liste;
    }
    return { praefix, lies, schreibe, entferne, schluessel };
  }

  KERN.speicher = speicher;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/zufall.js ---- */
/* Kern — Zufall über eine austauschbare Quelle (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.4).
   Standard ist Math.random, erst beim Aufruf gelesen: So greift auch ein Testskript, das Math.random ersetzt
   (Eulenpfad, tools/pruef_dom.js). Ein Testskript kann stattdessen KERN.zufall.quelle.zufall setzen (Lernsteig) oder
   eine Quelle mit Startwert von KERN.zufall.mitStartwert(seed) nehmen. */
"use strict";

(function (KERN) {
  const quelle = { zufall: () => Math.random() };
  /** Ganze Zahl von min bis max (beide eingeschlossen). */
  function zufall(min, max) { return min + Math.floor(quelle.zufall() * (max - min + 1)); }
  /** Ein Element der Liste. */
  function waehle(liste) { return liste[Math.floor(quelle.zufall() * liste.length)]; }
  /** Gemischte Kopie der Liste (Fisher-Yates). */
  function mische(liste) {
    const a = liste.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(quelle.zufall() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  /** Wiederholbare Zahlenfolge in [0, 1) aus einem Startwert (mulberry32), für Testskripte. */
  function mitStartwert(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  KERN.zufall = { quelle, zufall, waehle, mische, mitStartwert };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/el.js ---- */
/* Kern — Element bauen (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.5).
   Greift erst beim Aufruf auf document zu, nie beim Laden (in Node ladbar).
   el("button", { class, text, onclick, "aria-label": …, … }, kinder…)
   - text → textContent (immer für Daten: Namen, eingelesene Dateien, Eingaben)
   - html → innerHTML, nur für festen Text aus dem Code, nie für Daten
   - on… → addEventListener
   - undefined, null, false → Attribut weglassen; true → leeres Attribut (disabled, hidden)
   - Kinder: verschachtelte Listen werden flach gemacht; undefined, null, false fallen weg. */
"use strict";

(function (KERN) {
  function el(tag, attr, ...kinder) {
    const e = document.createElement(tag); // globaler Name (auch der Ersatz-DOM tools/pruef_dom.js)
    for (const [k, v] of Object.entries(attr || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "class") e.className = v;
      else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (const kind of kinder.flat(Infinity)) if (kind !== undefined && kind !== null && kind !== false) e.append(kind);
    return e;
  }

  KERN.el = el;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
