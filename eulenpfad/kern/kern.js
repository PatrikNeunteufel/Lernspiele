/* kern 1.45.1 · Prüfsumme sha256:1d958573c49b8b3aeadf8d977105e229ad27fb533f455ea13179e345ade94ae3 · erzeugt von tools/kern_verteilen.py aus kern/ — nicht von Hand ändern, sondern kern/ ändern und neu verteilen. */
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

  // Gliederung: Leerzeichen (auch geschützt und schmal) und Apostroph — nur zwischen Dreiergruppen vor dem Komma (ZL1 a)
  const TRENN = "[ \\u00A0\\u202F'\\u2019]";
  const ZAHL = new RegExp(`^([+-]?)\\s*(\\d{1,3}(?:${TRENN}\\d{3})+|\\d*)(?:[.,](\\d*))?$`);
  const norm = eingabe => String(eingabe).trim().replace(/[−–]/g, "-");

  /**
   * Eingabe einer Zahl lesen: „−“, „-“, „–“ als Minus, Punkt oder Komma als Dezimalzeichen; Leerzeichen und Apostroph
   * nur als Gliederung in Dreiergruppen vor dem Komma („1'080“, „30 400“, „1'080.5“; seit 1.25.0, ZL1 a — vorher galten sie
   * überall, „12'34“ als 1234). Eine Zahl oder null, wenn die Eingabe keine Zahl ist.
   */
  function lies(eingabe) {
    const m = norm(eingabe).match(ZAHL);
    if (!m || (!m[2] && !m[3])) return null;
    return Number(`${m[1]}${m[2].replace(new RegExp(TRENN, "g"), "") || "0"}.${m[3] || "0"}`);
  }
  /** Wäre die Eingabe ohne Gliederung eine Zahl? Dann stehen nur die Trennzeichen falsch (für einen Hinweis). */
  const gliederungFalsch = eingabe => lies(eingabe) === null && new RegExp(`\\d${TRENN}+\\d`).test(norm(eingabe))
    && lies(norm(eingabe).replace(new RegExp(TRENN, "g"), "")) !== null;

  KERN.zahl = { STANDARD, text, dezimalText, lies, gliederungFalsch, klartext };
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

/* ---- kern/terme.js ---- */
/* Kern — Terme lesen, vergleichen, ihre Form prüfen und schreiben (docs/kern/rahmen.md 4.17; aus dem Lernsteig,
   Plan docs/plan_angleich_reihe.md B, Befunde D3, D10).
   Ohne DOM. Ein Term wird exakt als Polynom gelesen: Variablen a–z (ein Buchstabe), Zahlen „1'234.5“, Brüche „5/8“,
   + − - · * : ( ), implizites Mal („3a“, „2(x + 1)“, „ab“), Potenzen „^2“ oder „²³⁴“. Baut auf KERN.bruch auf.
   Ein Polynom ist eine Map „Monom → Bruch“, das Monom als Schlüssel „a2b1“ (Variablen sortiert, mit Exponent).
   Die Schreibweise der Zahlen in text() gibt die App mit (wie KERN.zahl.text), der Kern kennt keine App. */
"use strict";

(function (KERN) {
  const B = KERN.bruch;
  // Hochgestellte Ziffern; eine Folge ist ein Exponent („x²³“ = x^23, „x¹⁰“ = x^10), wie text() sie schreibt.
  const HOCH = { "⁰": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9 };
  // D10: Ohne Grenze fror „x^99999999“ oder „(a+b+c)^200“ den Tab ein. Sek I braucht kleine Exponenten.
  const GRENZE_EXPONENT = 100;
  const GRENZE_GLIEDER = 2000; // so viele Monome höchstens in einem Zwischenergebnis

  // ---------- Polynome ----------
  const konst = b => new Map([["", b]]);
  const variable = v => new Map([[`${v}1`, B.bruch(1n)]]);
  function aufraeumen(p) {
    for (const [k, w] of p) if (w.z === 0n) p.delete(k);
    if (p.size > GRENZE_GLIEDER) throw new Error("Term zu gross");
    return p;
  }
  function plus(p, q) { const r = new Map(p); for (const [k, w] of q) r.set(k, r.has(k) ? B.plus(r.get(k), w) : w); return aufraeumen(r); }
  const neg = p => new Map([...p].map(([k, w]) => [k, B.neg(w)]));
  function monomMal(k1, k2) {
    const e = {};
    for (const k of [k1, k2]) for (const [, v, n] of k.matchAll(/([a-z])(\d+)/g)) e[v] = (e[v] || 0) + Number(n);
    return Object.keys(e).sort().map(v => `${v}${e[v]}`).join("");
  }
  function mal(p, q) {
    if (p.size * q.size > GRENZE_GLIEDER * 50) throw new Error("Term zu gross");
    const r = new Map();
    for (const [k1, w1] of p) for (const [k2, w2] of q) { const k = monomMal(k1, k2); r.set(k, r.has(k) ? B.plus(r.get(k), B.mal(w1, w2)) : B.mal(w1, w2)); }
    return aufraeumen(r);
  }
  function hoch(p, n) {
    if (!Number.isInteger(n) || n < 0) throw new Error("Exponent muss eine natürliche Zahl sein");
    if (n > GRENZE_EXPONENT) throw new Error(`Exponent zu gross (höchstens ${GRENZE_EXPONENT})`);
    let r = konst(B.bruch(1n));
    for (let i = 0; i < n; i++) r = mal(r, p);
    return r;
  }
  function durch(p, q) {
    if (q.size !== 1 || !q.has("")) throw new Error("nur durch Zahlen teilen");
    const d = q.get("");
    if (d.z === 0n) throw new Error("Division durch 0");
    return new Map([...p].map(([k, w]) => [k, B.durch(w, d)]));
  }
  const gleich = (p, q) => plus(p, neg(q)).size === 0;

  // ---------- Lesen ----------
  /** Liest einen Term; liefert { poly, info, roh } oder wirft. info: Zählungen für die Formprüfung. */
  // ZL1 a (1.25.0): Gliederung einer Zahl (Apostroph, Leerzeichen) nur in Dreiergruppen vor dem Komma, wie KERN.zahl.lies;
  // sonst Fehler GLIEDERUNG (bewerte meldet die Dreiergruppen). Vorher fiel jeder Apostroph weg („1'''“ galt als 1).
  const GLIEDERUNG = "Gliederung";
  function ohneGliederung(t) {
    const r = t.replace(/(^|[^\d.,])(\d+(?:[   '’]+\d+)+)/g, (all, vor, z) => {
      if (!/^\d{1,3}(?:[   '’]\d{3})+$/.test(z)) throw new Error(GLIEDERUNG);
      return vor + z.replace(/[   '’]/g, "");
    });
    if (/['’]/.test(r) || /[.,]\d+[   ]+\d/.test(r)) throw new Error(GLIEDERUNG);
    return r;
  }
  // E4-1 a (1.30.0): gemischte Zahl „1 3/4“, „−2 1/2“ = Ganzes plus echter Bruch. Ein Zähler mit genau drei Ziffern ist
  // Tausendergliederung („1 300/400“ = 1300/400, ZL1 a), ebenso ein Zähler mit führender Null oder ein unechter Bruch.
  // Ganzes mit unechtem Bruch („1 7/4“) wirft GEMISCHT (bewerte meldet es), statt als Gliederung zu gelten.
  const GEMISCHT = "Gemischt";
  function gemischteZahlen(t) {
    let n = 0;
    const r = t.replace(/(^|[^\d'’.,/])(\d+)[   ]+([1-9]\d?|[1-9]\d{3,})\/(\d+)/g, (all, vor, g, z, nn) => {
      if (Number(z) >= Number(nn)) throw new Error(GEMISCHT);
      n++;
      return `${vor}(${g}+${z}/${nn})`;
    });
    return { text: r, gemischt: n };
  }
  function lies(text) {
    const gm = gemischteZahlen(String(text));
    // 1.30.0 (Plan E 4): „×“ und „⋅“ als Mal, Grossbuchstaben wie Kleinbuchstaben („2A“ = 2a)
    const s = ohneGliederung(gm.text).replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/[*×⋅]/g, "·").replace(/,/g, ".")
      .replace(/[A-Z]/g, c => c.toLowerCase());
    let i = 0;
    const info = { klammern: 0, potenzen: 0, mal: 0, teilen: 0, gemischt: gm.gemischt };
    if (!s) throw new Error("leer");
    function ausdruck() {
      let w = (s[i] === "-") ? (i++, neg(glied())) : (s[i] === "+" ? (i++, glied()) : glied());
      while (s[i] === "+" || s[i] === "-") { const op = s[i++]; const g = glied(); w = op === "+" ? plus(w, g) : plus(w, neg(g)); }
      return w;
    }
    function glied() {
      let w = potenz();
      for (;;) {
        if (s[i] === "·" || s[i] === ":") { const op = s[i++]; info.mal++; const f = potenz(); w = op === ":" ? durch(w, f) : mal(w, f); continue; }
        // „/“ nach einem Faktor teilt durch eine Zahl wie „:“ (1.29.0): „2a/3“, „11a/12“, „(2a)/3“; „5/8“ bleibt eine Zahl
        // (einfach), „a/b“ bleibt unlesbar (nur durch Zahlen teilen)
        if (s[i] === "/") { i++; info.teilen++; w = durch(w, potenz()); continue; }
        if (s[i] && (/[a-z(]/.test(s[i]))) { w = mal(w, potenz()); continue; } // implizites Mal
        return w;
      }
    }
    function potenz() {
      let w = einfach();
      for (;;) {
        if (s[i] in HOCH) {
          let n = 0;
          while (s[i] in HOCH) n = n * 10 + HOCH[s[i++]];
          info.potenzen++; w = hoch(w, n); continue;
        }
        if (s[i] === "^") { i++; const m = s.slice(i).match(/^\d+/); if (!m) throw new Error("Exponent fehlt"); i += m[0].length; info.potenzen++; w = hoch(w, Number(m[0])); continue; }
        return w;
      }
    }
    function einfach() {
      if (s[i] === "(") { i++; info.klammern++; const w = ausdruck(); if (s[i] !== ")") throw new Error("„)“ fehlt"); i++; return w; }
      if (s[i] && /[a-z]/.test(s[i])) return variable(s[i++]);
      const m = s.slice(i).match(/^(\d+(?:\.\d+)?)(?:\/(\d+))?/);
      if (!m) throw new Error(`unerwartet „${s.slice(i, i + 4) || "Ende"}“`);
      i += m[0].length;
      return konst(m[2] ? B.durch(B.zahl(m[1]), B.zahl(m[2])) : B.zahl(m[1]));
    }
    const poly = ausdruck();
    if (i !== s.length) throw new Error(`unerwartet „${s.slice(i, i + 4)}“`);
    return { poly, info, roh: s };
  }

  /** Anzahl Glieder auf oberster Ebene (ohne Klammern) eines gelesenen Texts (roh aus lies). */
  function glieder(roh) {
    let tiefe = 0, n = 1;
    for (let i = 0; i < roh.length; i++) {
      const c = roh[i];
      if (c === "(") tiefe++; else if (c === ")") tiefe--;
      else if ((c === "+" || c === "-") && tiefe === 0 && i > 0 && roh[i - 1] !== "^") n++;
    }
    return n;
  }

  const ggtGanz = (x, y) => (y ? ggtGanz(y, x % y) : (x < 0n ? -x : x));
  const formFehler = meldung => ({ ok: false, gleichwertig: true, lesbar: true, meldung });
  const istPrim = n => { if (n < 2) return false; for (let t = 2; t * t <= n; t++) if (n % t === 0) return false; return true; };
  const HOCHZIFFER = { "⁰": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9 };
  /** Primfaktor mit Exponent ab 1: „2“, „2^3“, „2³“ (1.29.0). */
  function primFaktor(t) {
    const m = t.match(/^(\d+)(?:\^(\d+)|([⁰¹²³⁴⁵⁶⁷⁸⁹]+))?$/);
    if (!m || !istPrim(Number(m[1]))) return false;
    const exp = m[2] !== undefined ? Number(m[2]) : m[3] !== undefined ? Number([...m[3]].map(c => HOCHZIFFER[c]).join("")) : 1;
    return exp >= 1;
  }

  /**
   * Faktoren je Glied zusammengefasst (1.30.0, Plan E 4): höchstens eine Zahl (ein Nenner „/12“ gehört zu ihr, Exponenten
   * zählen nicht) und jede Variable nur einmal — „2a·3“, „a·a“, „aa“, „a²a“ sind nicht zusammengefasst. roh ohne Klammern.
   */
  function faktorenZusammengefasst(roh) {
    return roh.split(/(?<!\^)[+-]/).filter(Boolean).every(g => {
      const t = g.replace(/\^\d+/g, "").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, "").replace(/\/\d+(?:\.\d+)?/g, "");
      const zahlen = t.match(/\d+(?:\.\d+)?/g) || [], vars = t.match(/[a-z]/g) || [];
      return zahlen.length <= 1 && new Set(vars).size === vars.length;
    });
  }
  /** Basis einer einzelnen Potenz („4^3“, „a⁵“, „(−2)^3“) als Text, sonst null. */
  function basisText(roh) {
    const m = roh.replace(/^\+/, "").match(/^(.+?)(?:\^\d+|[⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/);
    // „−2^3“ ist −(2³): das Minus gehört nicht zur Basis, das ist keine einzelne Potenz
    return m && !m[1].startsWith("-") ? m[1] : null;
  }

  /**
   * Bewertet eine Eingabe gegen eine Aufgabe { antwortTerm, form }.
   * form: "vereinfacht" (keine Klammern, jedes Monom einmal, Zahlen ausgerechnet), "bruch" (ganze Zahl oder gekürzter
   *       Bruch), "potenz" (als eine Potenz geschrieben), "ausgeklammert" (Zahl mal Klammer, ggT ausgeklammert),
   *       "primfaktoren" (nur Primzahlen als Faktoren, mit oder ohne Exponent: 2³ · 3² · 5, seit 1.29.0), "bruchterm"
   *       (wie vereinfacht, dazu jeder Bruch gekürzt: 3a/4, 11/12a, seit 1.29.0), "frei".
   * Liefert { ok, gleichwertig, lesbar, meldung }. Eine unlesbare Eingabe wirft nie (D3); ein unlesbarer antwortTerm
   * ist ein Fehler der Aufgabe und wirft.
   */
  function bewerte(eingabe, a) {
    let e;
    try { e = lies(eingabe); } catch (err) {
      const meldung = /zu gross/.test(err.message) ? `Der Term ist zu gross: ${err.message}.`
        : err.message === GLIEDERUNG ? "Den Apostroph nur zwischen Dreiergruppen, zum Beispiel 12'340."
        : err.message === GEMISCHT ? "Schreibe als Bruch, zum Beispiel 3/2 statt 1 1/2."
        : "Den Term kann ich nicht lesen. Beispiel: 3a + 4b oder 2(x + 5).";
      return { ok: false, gleichwertig: false, lesbar: false, meldung };
    }
    const zielGelesen = lies(a.antwortTerm), ziel = zielGelesen.poly;
    if (!gleich(e.poly, ziel)) return { ok: false, gleichwertig: false, lesbar: true };
    const form = a.form || "frei";
    // E4-1 a: eine gemischte Zahl hat den richtigen Wert, aber nicht die verlangte Form (kein Fehlversuch)
    if (e.info.gemischt > 0 && form !== "frei") return formFehler("Der Wert stimmt. Schreibe als Bruch ohne Ganze, zum Beispiel 1 1/2 als 3/2.");
    const zusammenfassen = "Der Wert stimmt. Fasse die Faktoren noch zusammen, zum Beispiel a · a = a².";
    if (form === "vereinfacht") {
      if (e.info.klammern > 0) return formFehler("Der Wert stimmt. Löse noch die Klammern auf.");
      if (glieder(e.roh) > ziel.size) return formFehler("Der Wert stimmt. Fasse gleichartige Glieder noch zusammen.");
      if (/\d[·:]\d|:/.test(e.roh) || e.info.potenzen > 0 && /\d\^|\d[²-³⁴-⁹]/.test(e.roh)) return formFehler("Der Wert stimmt. Rechne die Zahlen noch aus.");
      if (!faktorenZusammengefasst(e.roh)) return formFehler(zusammenfassen);
    }
    if (form === "bruch") {
      // eine ganze Zahl oder ein vollständig gekürzter Bruch „z/n“ (auch negativ), kein Dezimalbruch
      const m = e.roh.match(/^(-?)(\d+)(?:\/(\d+))?$/);
      if (!m) return formFehler("Der Wert stimmt. Schreibe als Bruch, zum Beispiel 3/4.");
      if (m[3]) {
        if (ggtGanz(BigInt(m[2]), BigInt(m[3])) !== 1n) return formFehler("Der Wert stimmt. Kürze den Bruch noch vollständig.");
        if (m[3] === "1") return formFehler("Der Wert stimmt. Schreibe die ganze Zahl ohne Nenner.");
      }
    }
    if (form === "potenz" && !(e.info.potenzen === 1 && e.info.mal === 0 && glieder(e.roh) === 1)) {
      return formFehler("Der Wert stimmt. Schreibe als eine Potenz, zum Beispiel 5^3.");
    }
    // 1.30.0 (Plan E 4): ist die Lösung selbst eine Potenz, gilt nur dieselbe Basis („2^6“ für 4³ ist eine andere Potenz)
    if (form === "potenz") {
      const zb = basisText(zielGelesen.roh), eb = basisText(e.roh);
      if (zb !== null && (eb === null || !gleich(lies(eb).poly, lies(zb).poly))) {
        return formFehler(`Der Wert stimmt. Schreibe als Potenz mit der Basis ${zb.replace(/-/g, "−")}.`);
      }
    }
    if (form === "bruchterm") {
      if (e.info.klammern > 0) return formFehler("Der Wert stimmt. Löse noch die Klammern auf.");
      if (glieder(e.roh) > ziel.size) return formFehler("Der Wert stimmt. Fasse gleichartige Glieder noch zusammen.");
      if (!faktorenZusammengefasst(e.roh)) return formFehler(zusammenfassen);
      if (/[·:]/.test(e.roh)) return formFehler("Der Wert stimmt. Rechne die Zahlen noch aus.");
      // jeder Bruch gekürzt: Zähler (Zahl vor den Variablen, sonst 1) und Nenner teilerfremd, Nenner nicht 1
      for (const m of e.roh.matchAll(/(\d*)([a-z²-³¹⁴-⁹^\d]*?)\/(\d+)/g)) {
        const z = BigInt(m[1] || "1"), n = BigInt(m[3]);
        if (n === 1n || ggtGanz(z, n) !== 1n) return formFehler("Der Wert stimmt. Kürze den Bruch noch vollständig.");
      }
    }
    if (form === "primfaktoren" && !e.roh.split("·").every(primFaktor)) {
      return formFehler("Der Wert stimmt. Zerlege, bis nur noch Primzahlen dastehen, zum Beispiel 2³ · 3 · 5.");
    }
    if (form === "ausgeklammert") {
      const m = e.roh.match(/^(-?\d*)(?:·)?\((.*)\)$/);
      const zahlMalKlammer = "Der Wert stimmt. Schreibe als Zahl mal Klammer: 3(…).";
      if (!m) return formFehler(zahlMalKlammer);
      // D3: „(3)(2x+3)“ passt auf das Muster, das Innere „3)(2x+3“ ist aber kein Term — keine Zahl mal eine Klammer.
      let innen;
      try { innen = lies(m[2]).poly; } catch (err) { return formFehler(zahlMalKlammer); }
      let g = 0n;
      for (const [, w] of innen) {
        if (w.n !== 1n) return formFehler("Klammere so aus, dass in der Klammer ganze Zahlen stehen.");
        g = ggtGanz(g, w.z);
      }
      if (g !== 1n) return formFehler("Der Wert stimmt. In der Klammer steckt noch ein gemeinsamer Faktor.");
    }
    return { ok: true, gleichwertig: true, lesbar: true };
  }

  // ---------- Schreiben (für Lösungen) ----------
  const ZIFFER_HOCH = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const hochText = n => String(n).split("").map(c => ZIFFER_HOCH[c]).join("");
  /** Betrag eines Bruchs: ganze Zahlen in der Schreibweise der App, sonst „z/n“ (wie im Lehrplanbeispiel ¼ + ⅜). */
  const betragText = (b, sw) => (b.n === 1n ? KERN.zahl.text(Number(b.z), sw) : `${b.z}/${b.n}`);
  /** Exponenten eines Monom-Schlüssels: „a2b1“ → { a: 2, b: 1 }. */
  const exponenten = k => Object.fromEntries([...k.matchAll(/([a-z])(\d+)/g)].map(([, v, n]) => [v, Number(n)]));
  /**
   * Ordnung der Glieder wie im Lehrmittel (Entscheid TO1 a): höchster Grad zuerst; bei gleichem Grad nach den Variablen
   * im Alphabet, je mit dem höheren Exponenten zuerst — a² vor ab vor b², also (a + b)² = a² + 2ab + b².
   * Die Konstante steht zuletzt. Negativ: x vor y.
   */
  function ordnung(x, y) {
    const ex = exponenten(x), ey = exponenten(y);
    const grad = e => Object.values(e).reduce((s, n) => s + n, 0);
    if (grad(ex) !== grad(ey)) return grad(ey) - grad(ex);
    for (const v of [...new Set([...Object.keys(ex), ...Object.keys(ey)])].sort()) {
      const d = (ey[v] || 0) - (ex[v] || 0);
      if (d) return d;
    }
    return 0;
  }
  /**
   * Polynom als Text in fester Ordnung (siehe ordnung).
   * sw: Schreibweise der App wie bei KERN.zahl.text (ohne Angabe die Standard-Schreibweise des Kerns).
   */
  function text(p, sw) {
    const minus = Object.assign({}, KERN.zahl.STANDARD, sw || {}).minus;
    const schluessel = [...p.keys()].sort(ordnung);
    if (!schluessel.length) return "0";
    return schluessel.map((k, i) => {
      const w = p.get(k);
      const negativ = w.z < 0n;
      const betrag = negativ ? B.neg(w) : w;
      const vars = [...k.matchAll(/([a-z])(\d+)/g)].map(([, v, n]) => v + (n === "1" ? "" : hochText(n))).join("");
      const t = vars && betrag.z === 1n && betrag.n === 1n ? vars : `${betragText(betrag, sw)}${vars}`;
      if (i === 0) return (negativ ? minus : "") + t;
      return ` ${negativ ? minus : "+"} ${t}`;
    }).join("");
  }

  KERN.terme = { GRENZE_EXPONENT, lies, bewerte, gleich, text, plus, mal, neg, hoch, konst, variable, glieder };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/rechner.js ---- */
/* Kern — Rechenkern des eingebauten Taschenrechners (docs/kern/rahmen.md 4.18; aus dem Lernsteig, Entscheide TR1 a,
   RE1 a; Befund D9). Ohne DOM: Eingabe als Liste von Tasten-Kennungen, Auswertung, Anzeige.
   Modelle, Beschriftungen, Bedienhilfe und Tastenfeld gibt die App (Lernsteig: gemeinsam/rechner.js); die Kennungen
   unten sind der Vertrag zwischen beiden.
   Kennungen: Ziffern „0“–„9“, „.“, „+“, „−“ (U+2212), „·“, „:“, „^“, „(“, „)“, „√“ (vor der Zahl), „x²“, „π“, „Ans“,
   dazu VORZ, VORZ_NACH, WURZEL_NACH, NTE_INDEX, NTE_RADIKAND. */
"use strict";

(function (KERN) {
  const MINUS = "−";
  const VORZ = "(−)";        // Vorzeichen vor der Zahl (TI-30X Plus, Casio)
  const VORZ_NACH = "+⇔−"; // Vorzeichen nach der Zahl (TI-30 eco RS)
  const WURZEL_NACH = "√x";   // Quadratwurzel nach der Zahl (eco RS)
  const NTE_INDEX = "ⁿ√"; // n-te Wurzel, Index zuerst: 3 ⁿ√ 8000
  const NTE_RADIKAND = "ˣ√y"; // n-te Wurzel, Radikand zuerst: 8000 ˣ√y 3 (eco RS)
  const STELLEN = 10; // gültige Ziffern der Anzeige

  /** Zerlegt die Eingabe in Bausteine für den Parser. */
  function bausteine(eingabe) {
    const b = [];
    let zahl = "";
    const zahlFertig = () => { if (zahl) { b.push({ t: "zahl", w: Number(zahl), roh: zahl }); zahl = ""; } };
    for (const z of eingabe) {
      if (/^[0-9.]$/.test(z)) { zahl += z; continue; }
      zahlFertig();
      if (z === "x²") b.push({ t: "quadrat" });
      else if (z === VORZ) b.push({ t: "vorz" });
      else if (z === VORZ_NACH) b.push({ t: "vorzNach" });
      else if (z === WURZEL_NACH) b.push({ t: "wurzelNach" });
      else if (z === "Ans") b.push({ t: "ans" });
      else if (z === "π") b.push({ t: "pi" });
      else b.push({ t: "op", w: z });
    }
    zahlFertig();
    return b;
  }

  /**
   * Wertet die Eingabe aus. Rangfolge: Klammern, Wurzel und Potenz, Vorzeichen, Punkt vor Strich.
   * „a ⁿ√ b“: a-te Wurzel aus b (Index zuerst); „b ˣ√y a“: a-te Wurzel aus b (Radikand zuerst);
   * „√ b“ Quadratwurzel vor der Zahl, „b √x“ nach der Zahl; „a ^ b“ rechtsassoziativ; „x²“ hinter einer Zahl;
   * „(−)“ vor der Zahl, „+⇔−“ nach der Zahl. Vorzeichen bindet schwächer als die Potenz: (−)2² = −4
   * (wie in den Anleitungen, R11 Abschnitt 2). Liefert { wert } oder { fehler } (Klartext, nie eine Ausnahme).
   */
  function rechne(eingabe, ans) {
    const b = bausteine(eingabe);
    let i = 0;
    const ist = (t, w) => b[i] && b[i].t === t && (w === undefined || b[i].w === w);
    function ausdruck() {
      let w = glied();
      while (ist("op", "+") || ist("op", MINUS)) { const op = b[i++].w; const g = glied(); w = op === "+" ? w + g : w - g; }
      return w;
    }
    function glied() {
      let w = vorzeichen();
      while (ist("op", "·") || ist("op", ":")) {
        const op = b[i++].w; const g = vorzeichen();
        if (op === ":" && g === 0) throw new Error("Division durch 0");
        w = op === ":" ? w / g : w * g;
      }
      return w;
    }
    function vorzeichen() { if (ist("vorz")) { i++; return -vorzeichen(); } return potenz(); }
    function potenz() {
      let w = nachgestellt();
      if (ist("op", "^")) { i++; w = Math.pow(w, vorzeichen()); }
      else if (ist("op", NTE_INDEX)) { i++; w = wurzel(vorzeichen(), w); }
      else if (ist("op", NTE_RADIKAND)) { i++; w = wurzel(w, vorzeichen()); }
      return w;
    }
    function wurzel(x, n) {
      if (!Number.isInteger(n) || n < 1) throw new Error("Wurzelexponent muss eine natürliche Zahl sein");
      if (x < 0 && n % 2 === 0) throw new Error("gerade Wurzel aus negativer Zahl");
      const r = Math.sign(x) * Math.pow(Math.abs(x), 1 / n);
      const g = Math.round(r);
      return Math.abs(g ** n - x) < 1e-9 * Math.max(1, Math.abs(x)) ? g : r; // exakte Wurzeln ganz lassen
    }
    function nachgestellt() {
      let w = einfach();
      for (;;) {
        if (ist("quadrat")) { i++; w = w * w; continue; }
        if (ist("wurzelNach")) { i++; w = wurzel(w, 2); continue; }
        if (ist("vorzNach")) { i++; w = -w; continue; }
        return w;
      }
    }
    function einfach() {
      if (ist("zahl")) {
        const z = b[i++];
        if (!/^(\d+\.?\d*|\.\d+)$/.test(z.roh)) throw new Error("Zahl falsch eingegeben");
        return z.w;
      }
      if (ist("ans")) { i++; if (ans === undefined || ans === null) throw new Error("noch kein Ergebnis"); return ans; }
      if (ist("pi")) { i++; return Math.PI; }
      if (ist("op", "√")) { i++; return wurzel(ist("vorz") ? (i++, -nachgestellt()) : nachgestellt(), 2); }
      if (ist("op", "(")) {
        i++; const w = ausdruck();
        if (ist("op", ")")) i++; // fehlende schliessende Klammern am Ende sind erlaubt, wie bei vielen Rechnern
        else if (i < b.length) throw new Error("„)“ fehlt");
        return w;
      }
      throw new Error(i < b.length ? "Eingabe unvollständig" : "Eingabe fehlt");
    }
    try {
      if (!b.length) return { fehler: "Eingabe fehlt" };
      const w = ausdruck();
      if (i !== b.length) return { fehler: "Eingabe nicht verständlich" };
      // D9: NaN (etwa (−8)^0.5) ist nicht „zu gross“, sondern nicht definiert.
      if (Number.isNaN(w)) return { fehler: "nicht definiert" };
      if (!Number.isFinite(w)) return { fehler: "Ergebnis zu gross" };
      return { wert: w };
    } catch (e) { return { fehler: e.message }; }
  }

  const HOCH = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };

  /**
   * Ergebnis mit höchstens 10 gültigen Ziffern in der Schreibweise sw der App (wie KERN.zahl.dezimalText); ab 10¹⁰
   * und unter 10⁻⁶ wissenschaftlich „1.5 · 10¹²“. D9: erst runden, dann entscheiden — 9999999999.6 wird 1 · 10¹⁰,
   * nicht die elfstellige 10000000000.
   */
  function anzeige(w, sw) {
    if (w === 0) return "0";
    const gerundet = Number(w.toPrecision(STELLEN));
    const b = Math.abs(gerundet);
    if (b >= 1e10 || b < 1e-6) {
      const [m, e] = gerundet.toExponential(STELLEN - 1).split("e");
      return `${KERN.zahl.dezimalText(Number(m), undefined, sw)} · 10${String(Number(e)).replace(/[-0-9]/g, c => HOCH[c])}`;
    }
    return KERN.zahl.dezimalText(gerundet, undefined, sw);
  }

  KERN.rechner = { MINUS, VORZ, VORZ_NACH, WURZEL_NACH, NTE_INDEX, NTE_RADIKAND, STELLEN, bausteine, rechne, anzeige };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/speicher.js ---- */
/* Kern — Speicher im Browser mit Präfix der App (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.3).
   Alle Apps teilen den Ursprung patrikneunteufel.github.io und damit localStorage; darum schreibt jede App nur unter
   ihrem Präfix („lernspiele:“, „lernsteig:“, „gratwanderung:“). Der Kern kennt keine Schlüssel der Apps.
   Darf fehlen (privates Fenster, gesperrter Speicher, Node): dann gilt beim Lesen der Ersatz, Schreiben meldet false.

   Grosse Schlüssel (seit 1.34.0; docs/konzept_gruppen.md 5a, Entscheide D11 a, D11-W a): Was wächst (Runden, Rekorde,
   Meldungen, Löschvermerke), liegt in IndexedDB statt in localStorage — localStorage hat je Ursprung nur 5 MiB für alle
   Apps zusammen, IndexedDB ein Vielfaches (MDN, Storage quotas and eviction criteria, Stand 5.1.2026). Lesen und Schreiben
   bleiben sofort (Zwischenspeicher als JSON-Text, dieselbe Bedeutung wie localStorage); die Seite wartet beim Start
   einmal auf bereit(). Beim ersten bereit() zieht ein Wert aus localStorage um und wird dort erst nach dem Schreiben in
   IndexedDB gelöscht. Andere Tabs derselben App erfahren Änderungen über BroadcastChannel und lesen neu. Ohne
   IndexedDB (Node, Ersatz-DOM, sehr alte oder gesperrte Browser) bleiben die grossen Schlüssel in localStorage. */
"use strict";

(function (KERN) {
  // Über den globalen Namen, nicht über globalThis: Ersatz-DOMs der Testskripte (tools/pruef_dom.js) legen
  // localStorage als Variable an. Der Zugriff selbst kann werfen (gesperrte Cookies).
  const ablage = () => { try { return typeof localStorage !== "undefined" ? localStorage : null; } catch (e) { return null; } };
  const idb = () => { try { return typeof indexedDB !== "undefined" && indexedDB ? indexedDB : null; } catch (e) { return null; } };
  const STORE = "werte";
  /** Grenze von localStorage je Ursprung laut MDN: 5 MiB; gezählt in UTF-16, also 2 Byte je Zeichen. */
  const LOKAL_GRENZE_BYTE = 5 * 1024 * 1024;

  /** IndexedDB-Anfrage als Versprechen. */
  const alsVersprechen = req => new Promise((ok, fehler) => { req.onsuccess = () => ok(req.result); req.onerror = () => fehler(req.error); });

  /**
   * Speicher für ein Präfix: { praefix, lies(schluessel, ersatz), schreibe(schluessel, wert) → true|false,
   * entferne(schluessel), schluessel() → Liste der Schlüssel ohne Präfix, bereit() → Versprechen, modus(),
   * beiFehler(f), beiFremdAenderung(f) }. Werte als JSON.
   * opt.gross      Schlüssel, die in IndexedDB liegen (Standard: keine — dann wie bis 1.33)
   * opt.datenbank  Name der IndexedDB (je App eigener Name; nicht die des Abgleichs)
   * opt.vereinen   (schluessel, wertIndexedDB, wertLocalStorage) → vereinigter Wert oder undefined, für den Umzug, wenn
   *                ein Schlüssel in beiden liegt (Standard: Listen nach id; sonst bleiben beide liegen)
   */
  function speicher(praefix, opt = {}) {
    if (typeof praefix !== "string" || !/^[a-z][a-z0-9-]*:$/.test(praefix)) throw new Error(`ungültiges Präfix: ${praefix}`);
    const gross = new Set(opt.gross || []);
    if (gross.size && (typeof opt.datenbank !== "string" || !opt.datenbank)) throw new Error("speicher: datenbank fehlt");
    // Modus der grossen Schlüssel: „warten“ (vor bereit), „idb“ oder „lokal“ (ohne IndexedDB wie bis 1.33)
    let modus = !gross.size || !idb() ? "lokal" : "warten";
    const zwischen = new Map(); // Schlüssel → JSON-Text
    let db = null, bereitVersprechen = null;
    const fehlerHoerer = [], fremdHoerer = [];
    const meldeFehler = (schluessel, e) => { for (const f of fehlerHoerer) try { f(schluessel, e); } catch (x) { /* Hörer stört nicht */ } };
    const istGross = s => gross.has(s) && modus !== "lokal";
    /**
     * Zwei Fassungen eines grossen Schlüssels vereinigen (IndexedDB a, alter Rest aus localStorage b): zuerst opt.vereinen
     * der App (Rückgabe undefined = nicht zuständig), sonst Listen nach Kennung (id; a gewinnt, was nur in b steht, kommt
     * dazu); sonst undefined — dann bleiben beide liegen.
     */
    function vereinigen(s, a, b) {
      if (typeof opt.vereinen === "function") { const v = opt.vereinen(s, a, b); if (v !== undefined) return v; }
      if (Array.isArray(a) && Array.isArray(b)) {
        const da = new Set(a.filter(e => e && e.id !== undefined).map(e => e.id));
        return a.concat(b.filter(e => !(e && e.id !== undefined && da.has(e.id))));
      }
      return undefined;
    }
    const pruefeBereit = s => { if (modus === "warten") throw new Error(`speicher: „${praefix}${s}“ vor bereit() gelesen oder geschrieben`); };

    // ----- localStorage (kleine Schlüssel; grosse ohne IndexedDB) -----
    function liesLokal(schluessel, ersatz) {
      try {
        const v = ablage()?.getItem(praefix + schluessel);
        return v === null || v === undefined ? ersatz : JSON.parse(v);
      } catch (e) { return ersatz; }
    }
    function schreibeLokal(schluessel, text) {
      try {
        const a = ablage();
        if (!a) return false;
        a.setItem(praefix + schluessel, text);
        return true;
      } catch (e) { return false; } // voll oder gesperrt: der Aufrufer entscheidet, ob er warnt
    }

    // ----- IndexedDB: Schreiben je Schlüssel der Reihe nach, der letzte Stand gewinnt -----
    let kanal = null;
    const offen = new Map(); // Schlüssel → { text | null (löschen) } noch nicht geschrieben
    let kette = Promise.resolve();
    function nachIdb(schluessel, text) {
      offen.set(schluessel, text);
      kette = kette.then(async () => {
        if (!offen.has(schluessel)) return;
        const t = offen.get(schluessel);
        offen.delete(schluessel);
        try {
          await new Promise((ok, fehler) => {
            const tx = db.transaction(STORE, "readwrite");
            const s = tx.objectStore(STORE);
            if (t === null) s.delete(schluessel); else s.put(t, schluessel);
            tx.oncomplete = () => ok();
            tx.onerror = () => fehler(tx.error);
            tx.onabort = () => fehler(tx.error || new Error("abgebrochen"));
          });
          if (kanal) try { kanal.postMessage({ schluessel }); } catch (e) { /* ohne Kanal kein Hinweis an andere Tabs */ }
        } catch (e) { meldeFehler(schluessel, e); }
      });
      return kette;
    }

    /** Einmal beim Start abwarten: öffnet IndexedDB, liest die grossen Schlüssel, zieht alte Werte aus localStorage um. */
    function bereit() {
      if (bereitVersprechen) return bereitVersprechen;
      if (modus === "lokal") return (bereitVersprechen = Promise.resolve());
      bereitVersprechen = (async () => {
        try {
          const anfrage = idb().open(opt.datenbank, 1);
          anfrage.onupgradeneeded = () => { const d = anfrage.result; if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE); };
          db = await alsVersprechen(anfrage);
          for (const s of gross) {
            const tx = db.transaction(STORE, "readonly");
            const text = await alsVersprechen(tx.objectStore(STORE).get(s));
            // Umzug bei jedem Start: Was noch in localStorage liegt (erster Start, oder ein Tab mit der alten Fassung hat
            // nach dem Umzug noch geschrieben), kommt nach IndexedDB — liegt der Schlüssel schon in beiden, werden die
            // Fassungen vereinigt (vereinigen). Erst nach dem Schreiben in IndexedDB wird localStorage geleert.
            const alt = ablage()?.getItem(praefix + s);
            if (alt === null || alt === undefined) { if (typeof text === "string") zwischen.set(s, text); continue; }
            let neu = alt;
            if (typeof text === "string") {
              const v = vereinigen(s, JSON.parse(text), JSON.parse(alt));
              if (v === undefined) { zwischen.set(s, text); continue; } // nicht vereinbar: beide bleiben, nichts geht verloren
              neu = JSON.stringify(v);
            }
            zwischen.set(s, neu);
            await new Promise((ok, fehler) => {
              const t2 = db.transaction(STORE, "readwrite");
              t2.objectStore(STORE).put(neu, s);
              t2.oncomplete = () => ok(); t2.onerror = () => fehler(t2.error);
            });
            try { ablage()?.removeItem(praefix + s); } catch (e) { /* bleibt liegen, beim nächsten Start wieder vereinigt */ }
          }
          modus = "idb";
          if (typeof BroadcastChannel !== "undefined") {
            kanal = new BroadcastChannel(`kern-speicher:${opt.datenbank}`);
            kanal.onmessage = async ev => {
              const s = ev.data && ev.data.schluessel;
              if (!gross.has(s) || offen.has(s)) return;
              try {
                const t = await alsVersprechen(db.transaction(STORE, "readonly").objectStore(STORE).get(s));
                if (typeof t === "string") zwischen.set(s, t); else zwischen.delete(s);
                for (const f of fremdHoerer) try { f(s); } catch (x) { /* Hörer stört nicht */ }
              } catch (e) { /* beim nächsten Start */ }
            };
          }
        } catch (e) {
          // IndexedDB geht nicht (gesperrt, privates Fenster älterer Browser): wie bis 1.33 in localStorage
          db = null; zwischen.clear(); modus = "lokal";
        }
      })();
      return bereitVersprechen;
    }

    function lies(schluessel, ersatz) {
      if (gross.has(schluessel)) pruefeBereit(schluessel);
      if (!istGross(schluessel)) return liesLokal(schluessel, ersatz);
      const t = zwischen.get(schluessel);
      if (t === undefined) return ersatz;
      try { return JSON.parse(t); } catch (e) { return ersatz; }
    }
    function schreibe(schluessel, wert) {
      if (gross.has(schluessel)) pruefeBereit(schluessel);
      let text;
      try { text = JSON.stringify(wert); } catch (e) { return false; }
      if (!istGross(schluessel)) return schreibeLokal(schluessel, text);
      zwischen.set(schluessel, text);
      nachIdb(schluessel, text);
      return true; // ob IndexedDB es behalten hat, meldet beiFehler
    }
    function entferne(schluessel) {
      if (istGross(schluessel)) { zwischen.delete(schluessel); nachIdb(schluessel, null); return; }
      try { ablage()?.removeItem(praefix + schluessel); } catch (e) { /* fehlt */ }
    }
    function schluessel() {
      const a = ablage(), liste = [];
      try { for (let i = 0; a && i < a.length; i++) { const k = a.key(i); if (k && k.startsWith(praefix)) liste.push(k.slice(praefix.length)); } }
      catch (e) { /* fehlt */ }
      for (const s of zwischen.keys()) if (!liste.includes(s)) liste.push(s);
      return liste;
    }
    /** Warten, bis alles Geschriebene in IndexedDB angekommen ist (Tests, vor dem Verlassen der Seite). */
    const geschrieben = () => kette;

    return { praefix, lies, schreibe, entferne, schluessel, bereit, geschrieben, modus: () => modus,
      beiFehler: f => fehlerHoerer.push(f), beiFremdAenderung: f => fremdHoerer.push(f) };
  }

  /**
   * Belegung des Speichers dieses Ursprungs (D11 a): { lokal: { zeichen, byte, anteil } — localStorage aller Apps
   * zusammen gegen 5 MiB —, ablage: { belegt, verfuegbar, anteil } | null — navigator.storage.estimate() —, dauerhaft:
   * true|false|null, warnen: true ab 80 % in einem der beiden }.
   */
  async function belegung() {
    let zeichen = 0;
    const a = ablage();
    try { for (let i = 0; a && i < a.length; i++) { const k = a.key(i); zeichen += k.length + (a.getItem(k) || "").length; } } catch (e) { /* fehlt */ }
    const byte = zeichen * 2;
    const lokal = { zeichen, byte, anteil: byte / LOKAL_GRENZE_BYTE };
    let ablageWerte = null, dauerhaft = null;
    try {
      const sp = typeof navigator !== "undefined" ? navigator.storage : null;
      if (sp && sp.estimate) { const e = await sp.estimate(); if (e && e.quota) ablageWerte = { belegt: e.usage || 0, verfuegbar: e.quota, anteil: (e.usage || 0) / e.quota }; }
      if (sp && sp.persisted) dauerhaft = await sp.persisted();
    } catch (e) { /* ohne Angabe */ }
    return { lokal, ablage: ablageWerte, dauerhaft, warnen: lokal.anteil >= 0.8 || (!!ablageWerte && ablageWerte.anteil >= 0.8) };
  }
  /** Den Browser bitten, die Daten nicht von selbst zu löschen (navigator.storage.persist); true, false oder null. */
  async function dauerhaftBitten() {
    try {
      const sp = typeof navigator !== "undefined" ? navigator.storage : null;
      return sp && sp.persist ? await sp.persist() : null;
    } catch (e) { return null; }
  }

  speicher.belegung = belegung;
  speicher.dauerhaftBitten = dauerhaftBitten;
  speicher.LOKAL_GRENZE_BYTE = LOKAL_GRENZE_BYTE;
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

/* ---- kern/zeit.js ---- */
/* Kern — Kalendertage in Ortszeit (Plan docs/plan_angleich_reihe.md B2 Schritt 3, Zeitzone; docs/kern/rahmen.md 4.25).
   Zeiten werden als ISO in UTC gespeichert (toISOString). Ein Kalendertag — Übungstag, „angelegt am“, Datum in einer
   Meldung oder einem Dateinamen — ist aber der Tag des Geräts: Eine Runde um 00:30 Uhr in der Schweiz liegt in UTC noch
   am Vortag. Darum nie „iso.slice(0, 10)“ oder „toISOString().slice(0, 10)“ für einen Tag, sondern diese Funktionen.
   tools/pruefe_kern.js sucht solche Stellen im Code der Apps. */
"use strict";

(function (KERN) {
  const zwei = n => String(n).padStart(2, "0");
  /** Kalendertag „JJJJ-MM-TT“ in Ortszeit; d: Date, ISO-Text oder Zeitwert (ohne Angabe jetzt). "" bei ungültiger Zeit. */
  function tag(d = new Date()) {
    const x = d instanceof Date ? d : new Date(d);
    return isNaN(x) ? "" : `${x.getFullYear()}-${zwei(x.getMonth() + 1)}-${zwei(x.getDate())}`;
  }
  /** Kalendertag vor n Tagen (Ortszeit; über Kalendertage gezählt, nicht über 24-Stunden-Schritte: hält bei Sommerzeit). */
  function vorTagen(n, heute = new Date()) {
    const x = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() - n, 12);
    return tag(x);
  }
  /** Kalendertag als „T.M.JJJJ“ (Ortszeit), "" bei ungültiger Zeit. */
  function tagAnzeige(d) {
    const x = d instanceof Date ? d : new Date(d);
    return isNaN(x) ? "" : `${x.getDate()}.${x.getMonth() + 1}.${x.getFullYear()}`;
  }

  KERN.zeit = { tag, vorTagen, tagAnzeige };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/geheimnis.js ---- */
/* Kern — PIN, Wiederherstellungscode und Sicherheitsfrage als Prüfwerte (Entscheide PIN1 a, PIN1-R a, AU1 a, P2 a;
   Herkunft eulenpfad/spiele/gemeinsam/spiel.js und lernsteig/gemeinsam/konten.js, beide mit derselben Rechnung).
   Gespeichert werden nur Salz und SHA-256 von „salz:wert“, nie die PIN, der Code oder die Antwort selbst.
   Grenze (DS1 a): Das schützt vor Versehen und Neugier am selben Gerät, nicht vor jemandem mit Entwicklerwerkzeugen.
   crypto.subtle gibt es nur in einem sicheren Kontext (https, localhost, Datei); fehlt es (etwa http über das Netz),
   melden die Funktionen das mit einem Satz statt eines Laufzeitfehlers (Befund D6). */
"use strict";

(function (KERN) {
  const CODE_ZEICHEN = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // ohne 0/O und 1/I, die man verwechselt
  const OHNE_KRYPTO = "Auf dieser Adresse kann der Browser keine PIN prüfen (nur über https, localhost oder als Datei "
    + "geöffnet). Bitte die Seite so öffnen.";

  const krypto = () => (typeof crypto !== "undefined" ? crypto : null);
  /** Kann dieses Fenster Prüfwerte rechnen? */
  const verfuegbar = () => !!krypto()?.subtle && typeof krypto().getRandomValues === "function";
  function brauche() { if (!verfuegbar()) throw new Error(OHNE_KRYPTO); }

  const hex = bytes => [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
  function salz() { brauche(); return hex(krypto().getRandomValues(new Uint8Array(16))); }
  async function hash(text, s) {
    brauche();
    const daten = new TextEncoder().encode(`${s}:${text}`);
    return hex(new Uint8Array(await krypto().subtle.digest("SHA-256", daten)));
  }
  /** Prüfwert { salz, hash } zu einem Wert. */
  async function pruefwert(text) { const s = salz(); return { salz: s, hash: await hash(text, s) }; }
  /** Stimmt der Wert zum Prüfwert? Ohne Prüfwert nie. */
  async function stimmt(text, wert) { return !!wert?.salz && !!wert?.hash && (await hash(text, wert.salz)) === wert.hash; }

  const pinGueltig = pin => /^\d{4,6}$/.test(String(pin ?? ""));
  /** Code ohne Gliederung und in Grossbuchstaben („k7qm 2xra-9tpl“ → „K7QM2XRA9TPL“). */
  const codeRein = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  /** Antwort der Sicherheitsfrage: Gross/Klein, ß/ss und mehrfache Leerzeichen zählen nicht. */
  const antwortRein = a => String(a || "").trim().toLowerCase().replace(/ß/g, "ss").replace(/\s+/g, " ");
  /** Neuer Wiederherstellungscode, 12 Zeichen in drei Gruppen („K7QM-2XRA-9TPL“). */
  function neuerCode() {
    brauche();
    const z = [...krypto().getRandomValues(new Uint8Array(12))].map(b => CODE_ZEICHEN[b % CODE_ZEICHEN.length]).join("");
    return `${z.slice(0, 4)}-${z.slice(4, 8)}-${z.slice(8)}`;
  }

  /** Prüfwert der PIN (4–6 Ziffern), sonst Fehler. */
  async function pin(p) {
    if (!pinGueltig(p)) throw new Error("Die PIN hat 4 bis 6 Ziffern.");
    return pruefwert(String(p));
  }
  const pinStimmt = (p, wert) => stimmt(String(p ?? ""), wert);
  /**
   * Wiederherstellung { code: Prüfwert, frage?, antwort?: Prüfwert } (Format des Eulenpfads, PIN1 a).
   * Ohne code wird einer erzeugt; zurück kommt { wiederherstellung, code } — der Code ist nur jetzt sichtbar.
   */
  async function wiederherstellung({ code, frage, antwort } = {}, alt = {}) {
    const c = code || neuerCode();
    const w = { ...alt, code: await pruefwert(codeRein(c)) };
    if (frage && antwort) { w.frage = String(frage).trim().slice(0, 120); w.antwort = await pruefwert(antwortRein(antwort)); }
    return { wiederherstellung: w, code: c };
  }
  const codeStimmt = (c, w) => stimmt(codeRein(c), w?.code);
  const antwortStimmt = (a, w) => !!antwortRein(a) && stimmt(antwortRein(a), w?.antwort);

  KERN.geheimnis = {
    OHNE_KRYPTO, verfuegbar, salz, hash, pruefwert, stimmt, pinGueltig, pin, pinStimmt,
    codeRein, antwortRein, neuerCode, wiederherstellung, codeStimmt, antwortStimmt,
  };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/person.js ---- */
/* Kern — Personen einer App: Kennung, Name, Rolle, Geburtsdatum, Liste und Zusammenführen
   (Entscheide P1 a, P2 a, Vorgabe B3; Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.7).

   Person: { id, name, rolle: "lernend" | "aufsicht", art?: "eltern" | "lehrperson" (nur Aufsicht),
             gruppenleitung?: true (G2 a), geboren: "JJJJ-MM-TT" | "JJJJ-MM" | null, klasse, frueher?: [ids],
             angelegt: ISO, geaendert: { <feld>: ISO }, pin?, wiederherstellung?, … Felder der App }
   - Die Kennung entsteht beim Anlegen und ändert sich nie; sie reist bei einer Übernahme in eine andere App mit (C9).
   - Der Name ist je App und Gerät eindeutig (ohne Gross/Klein und Leerzeichen am Rand) und nur Anzeige.
   - geaendert hält je Feld die Zeit der letzten Änderung: Beim Zusammenführen gewinnt je Feld der jüngere Stand.
   - pin und wiederherstellung (kern/geheimnis.js) bleiben auf dem Gerät: ohneGeheimnis nimmt sie aus Einladungen
     und Übernahmen. Eine App kann weitere Gerätefelder nennen (geraetFelder).
   - In Sicherung und Abgleich (fuerDatei, DF4 a) reist eine geschützte Person ohne PIN-Prüfwert, aber mit dem Vermerk
     geschuetzt und dem Prüfwert ihres Wiederherstellungscodes (60 Bit; eine PIN mit 4–6 Ziffern wäre aus der Datei in
     rund einer Sekunde durchprobiert). Auf einem Gerät ohne eigene PIN dieser Person ist sie gesperrt (gesperrt: true),
     bis sie dort freigeschaltet wird (freischalten). Eine Aufsicht aus einer Datei gilt immer als geschützt. Einlesen
     nimmt nie einen Schutz weg. */
"use strict";

(function (KERN) {
  const ROLLEN = ["lernend", "aufsicht"];
  const AUFSICHT_ARTEN = ["eltern", "lehrperson"];
  const GEHEIM = ["pin", "wiederherstellung"];
  const VERWALTUNG = new Set(["id", "frueher", "angelegt", "geaendert"]);
  const NAME_MAX = 40;

  // ---------- Kennung ----------
  function zufallHex(n) {
    const c = typeof crypto !== "undefined" && crypto.getRandomValues ? crypto : null;
    const b = c ? c.getRandomValues(new Uint8Array(n)) : Array.from({ length: n }, () => Math.floor(Math.random() * 256));
    return [...b].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  /** Neue Kennung „p-<Zeit>-<Zufall>“, eindeutig über Geräte und Apps. */
  const neueId = () => `p-${Date.now().toString(36)}-${zufallHex(5)}`;

  // ---------- Name ----------
  const nameRein = n => String(n ?? "").trim().replace(/\s+/g, " ").slice(0, NAME_MAX);
  const nameSchluessel = n => nameRein(n).toLocaleLowerCase("de-CH");
  const nameGleich = (a, b) => nameSchluessel(a) === nameSchluessel(b) && nameSchluessel(a) !== "";

  // ---------- Geburtsdatum (B3) ----------
  const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober",
    "November", "Dezember"];
  const zwei = z => String(z).padStart(2, "0");
  function gueltigesDatum(j, m, t) {
    if (j < 1900 || j > 2100 || m < 1 || m > 12) return false;
    if (t === undefined) return true;
    const d = new Date(Date.UTC(j, m - 1, t));
    return d.getUTCFullYear() === j && d.getUTCMonth() === m - 1 && d.getUTCDate() === t;
  }
  /**
   * Eingabe → gespeicherte Form: „TT.MM.JJJJ“, „T.M.JJJJ“, „JJJJ-MM-TT“ → „JJJJ-MM-TT“; „MM.JJJJ“, „JJJJ-MM“ → „JJJJ-MM“
   * (Tag fehlt, Profile des Eulenpfads seit LERN_Session14). Kein gültiges Datum → null.
   */
  function geburtsdatumLies(text) {
    const t = String(text ?? "").trim();
    let m;
    if ((m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(t))) return gueltigesDatum(+m[3], +m[2], +m[1]) ? `${m[3]}-${zwei(m[2])}-${zwei(m[1])}` : null;
    if ((m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t))) return gueltigesDatum(+m[1], +m[2], +m[3]) ? t : null;
    if ((m = /^(\d{1,2})\.(\d{4})$/.exec(t))) return gueltigesDatum(+m[2], +m[1]) ? `${m[2]}-${zwei(m[1])}` : null;
    if ((m = /^(\d{4})-(\d{2})$/.exec(t))) return gueltigesDatum(+m[1], +m[2]) ? t : null;
    return null;
  }
  /** Gespeicherte Form → Anzeige: „07.03.2014“, ohne Tag „März 2014“; sonst "". */
  function geburtsdatumText(g) {
    const s = geburtsdatumLies(g);
    if (!s) return "";
    const [j, m, t] = s.split("-");
    return t ? `${t}.${m}.${j}` : `${MONATE[+m - 1]} ${j}`;
  }
  const tagFehlt = g => /^\d{4}-\d{2}$/.test(geburtsdatumLies(g) || "");
  /**
   * Alter in ganzen Jahren am Tag heute (Ortszeit). Ohne Tag zählt das neue Lebensjahr ab dem Ersten des
   * Geburtsmonats (höchstens einen Monat zu früh, wie bisher im Eulenpfad). Kein Datum → null.
   */
  function alter(g, heute = new Date()) {
    const s = geburtsdatumLies(g);
    if (!s) return null;
    const [j, m, t = 1] = s.split("-").map(Number);
    let a = heute.getFullYear() - j;
    const mh = heute.getMonth() + 1, th = heute.getDate();
    if (mh < m || (mh === m && th < t)) a--;
    return a >= 0 ? a : null;
  }

  // ---------- Prüfen (für Einlesen, Abgleich, Einladung; Befund D4) ----------
  /** Mängel einer Person als Liste von Sätzen; leer heisst gültig. */
  function maengel(p) {
    const m = [];
    if (!p || typeof p !== "object" || Array.isArray(p)) return ["keine Person"];
    if (typeof p.id !== "string" || !/^[A-Za-z0-9_-]{3,64}$/.test(p.id)) m.push("Kennung fehlt oder ungültig");
    if (typeof p.name !== "string" || !nameRein(p.name)) m.push("Name fehlt");
    if (!ROLLEN.includes(p.rolle)) m.push(`unbekannte Rolle ${p.rolle}`);
    if (p.art !== undefined && p.art !== null && !AUFSICHT_ARTEN.includes(p.art)) m.push(`unbekannte Art ${p.art}`);
    if (p.geboren !== undefined && p.geboren !== null && !geburtsdatumLies(p.geboren)) m.push("Geburtsdatum ungültig");
    if (p.frueher !== undefined && !(Array.isArray(p.frueher) && p.frueher.every(x => typeof x === "string"))) m.push("frühere Kennungen ungültig");
    if (p.geaendert !== undefined && (typeof p.geaendert !== "object" || p.geaendert === null || Array.isArray(p.geaendert))) m.push("Änderungszeiten ungültig");
    return m;
  }
  /** Kopie ohne Geheimnisse und Gerätefelder (Einladung, Übernahme; für Dateien fuerDatei). */
  function ohneGeheimnis(p, geraetFelder = []) {
    const c = { ...p };
    for (const f of GEHEIM.concat(geraetFelder, SCHUTZ)) delete c[f];
    return c;
  }

  // ---------- Schutz in Dateien (DF4 a) ----------
  // gesperrt: auf diesem Gerät, geschuetzt: in einer Datei; beide nimmt nur der Kern an, nie aus einer fremden Fassung
  const SCHUTZ = ["gesperrt", "geschuetzt"];
  const istPruefwert = w => istObjekt(w) && typeof w.salz === "string" && /^[0-9a-f]{8,128}$/.test(w.salz)
    && typeof w.hash === "string" && /^[0-9a-f]{64}$/.test(w.hash);
  function istObjekt(x) { return !!x && typeof x === "object" && !Array.isArray(x); }
  /** Auf einem anderen Gerät geschützt, hier noch ohne eigene PIN: keine Anmeldung, bis sie freigeschaltet ist. */
  const gesperrt = p => !!p && p.gesperrt === true && !p.pin;
  /**
   * Kopie für eine Datei (Sicherung, Abgleich): ohne PIN, Sicherheitsfrage und Gerätefelder. Wer eine PIN hat oder hier
   * gesperrt ist, bekommt den Vermerk geschuetzt und nur den Prüfwert seines Wiederherstellungscodes.
   */
  function fuerDatei(p, geraetFelder = []) {
    const c = ohneGeheimnis(p, geraetFelder);
    if (p.pin || gesperrt(p)) {
      c.geschuetzt = true;
      if (istPruefwert(p.wiederherstellung?.code)) c.wiederherstellung = { code: p.wiederherstellung.code };
    }
    return c;
  }
  /** Schutz einer fremden Fassung: { code: Prüfwert | null } oder null (ungeschützt). Eine Aufsicht ist immer geschützt. */
  function schutzVon(roh) {
    if (roh.geschuetzt !== true && roh.rolle !== "aufsicht") return null;
    const code = roh.geschuetzt === true && istPruefwert(roh.wiederherstellung?.code) ? roh.wiederherstellung.code : null;
    return { code };
  }
  /**
   * Schutz auf die Person hier übertragen: Hat sie hier eine PIN, bleibt alles. Sonst wird sie gesperrt — ausser hier
   * wurde die PIN später geändert (bewusst entfernt) als dort. Ein Code von dort gilt, wenn hier keiner ist oder er
   * jünger ist.
   */
  function schutzUebertragen(neu, hier, roh, schutz) {
    if (!schutz || neu.pin) return neu;
    if (hier && zeit(hier, "pin") > zeit(roh, "pin")) return neu;
    const p = { ...neu, gesperrt: true };
    if (schutz.code && (!istPruefwert(hier?.wiederherstellung?.code) || zeit(roh, "wiederherstellung") > zeit(hier, "wiederherstellung"))) {
      p.wiederherstellung = { ...(hier?.wiederherstellung || {}), code: schutz.code };
      p.geaendert = { ...(p.geaendert || {}), wiederherstellung: zeit(roh, "wiederherstellung") };
    }
    return p;
  }
  /** Aufsichten mit eigener PIN auf diesem Gerät (nur sie können bestätigen; eine gesperrte hat hier keine PIN). */
  const aufsichtenMitPin = personen => personen.alle().filter(p => p.rolle === "aufsicht" && p.pin);
  /**
   * Reicht für diese gesperrte Person ihr Wiederherstellungscode (OA1 a, LERN_Session19)? Für Lernende ja; für eine
   * Aufsicht nur, solange das Gerät keine Aufsicht mit PIN hat — sonst bestätigt eine von ihnen, wie beim Anlegen einer
   * weiteren Aufsicht (D5, KR2 a). Sonst brächte eine selbst gebaute Datei mit bekanntem Code eine Aufsicht ohne
   * Bestätigung aufs Gerät.
   */
  const codeReicht = (personen, id) => {
    const p = personen.finde(id);
    return !!p && (p.rolle !== "aufsicht" || !aufsichtenMitPin(personen).some(q => q.id !== p.id));
  };
  const NUR_BESTAETIGUNG = "Hier gibt es schon eine Aufsicht: Eine von ihnen muss mit ihrer PIN bestätigen.";
  /**
   * Gesperrte Person freischalten (DF4 a): mit ihrem Wiederherstellungscode und einer neuen PIN — oder ohne Code mit
   * { bestaetigt: true }, wenn die App die Bestätigung einer bestehenden Aufsicht des Geräts geprüft hat (KERN.rollen).
   * Eine Aufsicht auf einem Gerät mit Aufsicht nur so (OA1 a, codeReicht). Der Code bleibt derselbe: er gilt auf allen
   * Geräten. Gibt die Person zurück; Fehler mit Klartext.
   */
  async function freischalten(personen, id, pin, { code = null, bestaetigt = false } = {}) {
    const p = personen.finde(id);
    if (!gesperrt(p)) throw new Error("Diese Person ist hier nicht gesperrt.");
    if (!bestaetigt) {
      if (!codeReicht(personen, p.id)) throw new Error(NUR_BESTAETIGUNG);
      if (!istPruefwert(p.wiederherstellung?.code)) throw new Error("Für diese Person gibt es hier keinen Wiederherstellungscode.");
      if (!(await KERN.geheimnis.codeStimmt(code, p.wiederherstellung))) throw new Error("Der Code stimmt nicht.");
    }
    const pw = await KERN.geheimnis.pin(pin);
    return personen.aendere(p.id, { pin: pw });
  }

  // ---------- Liste im Speicher der App ----------
  /**
   * Personen einer App im Speicher (KERN.speicher(praefix)) unter einem Schlüssel (Standard „personen“).
   * felder: Vorgaben der App für neue Personen (etwa { klasse: null, fokus: [] }).
   */
  function liste(speicher, { schluessel = "personen", felder = {} } = {}) {
    const alle = () => (speicher.lies(schluessel, []) || []).filter(p => !maengel(p).length);
    const speichere = l => speicher.schreibe(schluessel, l);
    const finde = id => alle().find(p => p.id === id || (p.frueher || []).includes(id)) || null;
    const findeName = name => alle().find(p => nameGleich(p.name, name)) || null;
    const nameFrei = (name, ausserId = null) => !!nameRein(name) && !alle().some(p => p.id !== ausserId && nameGleich(p.name, name));

    /** Neue Person anlegen; Fehler, wenn der Name fehlt oder vergeben ist. Gibt die Person zurück. */
    function anlegen(daten = {}) {
      const name = nameRein(daten.name);
      if (!name) throw new Error("Der Name fehlt.");
      if (!nameFrei(name)) throw new Error(`Den Namen „${name}“ gibt es schon.`);
      const jetzt = new Date().toISOString();
      const p = { ...felder, ...daten, id: daten.id || neueId(), name, rolle: daten.rolle || "lernend", angelegt: jetzt, geaendert: {} };
      if (p.geboren !== undefined && p.geboren !== null) p.geboren = geburtsdatumLies(p.geboren);
      // Zeit nur für gesetzte Felder (und Name, Rolle), nicht für Vorgaben der App: sonst überschriebe eine leere
      // Vorgabe beim Zusammenführen den echten Wert eines anderen Geräts.
      for (const k of new Set([...Object.keys(daten), "name", "rolle"])) if (!VERWALTUNG.has(k)) p.geaendert[k] = jetzt;
      const fehler = maengel(p);
      if (fehler.length) throw new Error(fehler.join(", "));
      if (!speichere(alle().concat(p))) throw new Error("Der Speicher des Browsers ist voll oder gesperrt.");
      return p;
    }
    /** Felder ändern; jedes geänderte Feld bekommt seine Zeit. Gibt die Person zurück (oder null). */
    function aendere(id, daten) {
      const l = alle(); const i = l.findIndex(p => p.id === id);
      if (i < 0) return null;
      const jetzt = new Date().toISOString();
      const p = { ...l[i], geaendert: { ...(l[i].geaendert || {}) } };
      for (const [k, v] of Object.entries(daten)) {
        if (VERWALTUNG.has(k)) continue;
        if (k === "name") {
          const n = nameRein(v);
          if (!nameFrei(n, id)) throw new Error(`Den Namen „${n}“ gibt es schon.`);
          p.name = n;
        } else p[k] = k === "geboren" && v !== null ? geburtsdatumLies(v) : v;
        p.geaendert[k] = jetzt;
      }
      // Wer hier eine eigene PIN bekommt, ist nicht mehr gesperrt (DF4 a) — auch nicht, wenn er sie später entfernt
      if (daten.pin && p.gesperrt !== undefined) delete p.gesperrt;
      const fehler = maengel(p);
      if (fehler.length) throw new Error(fehler.join(", "));
      l[i] = p;
      if (!speichere(l)) throw new Error("Der Speicher des Browsers ist voll oder gesperrt.");
      return p;
    }
    function entferne(id) { speichere(alle().filter(p => p.id !== id)); }
    return { schluessel, alle, finde, findeName, nameFrei, anlegen, aendere, entferne, speichere };
  }

  // ---------- Zusammenführen (Sicherung einlesen, Abgleich zwischen Geräten) ----------
  const zeit = (p, k) => (p.geaendert && p.geaendert[k]) || "";
  /** Ältere Person zuerst (angelegt, dann Kennung): ihre Kennung bleibt. */
  const aelter = (a, b) => ((a.angelegt || "") < (b.angelegt || "") || ((a.angelegt || "") === (b.angelegt || "") && a.id <= b.id) ? a : b);
  /** Zwei Fassungen derselben Person verbinden: je Feld der jüngere Stand, Geheimnisse und Gerätefelder von hier. */
  function verbinde(hier, dort, geraetFelder) {
    const bleibt = aelter(hier, dort), andere = bleibt === hier ? dort : hier;
    const neu = { ...hier, id: bleibt.id, angelegt: bleibt.angelegt, geaendert: { ...(hier.geaendert || {}) } };
    for (const k of Object.keys(dort)) {
      if (VERWALTUNG.has(k) || GEHEIM.includes(k) || SCHUTZ.includes(k) || geraetFelder.includes(k)) continue;
      if (!(k in hier) || zeit(dort, k) > zeit(hier, k)) { neu[k] = dort[k]; neu.geaendert[k] = zeit(dort, k); }
    }
    const frueher = new Set([...(hier.frueher || []), ...(dort.frueher || [])]);
    if (andere.id !== bleibt.id) frueher.add(andere.id);
    frueher.delete(bleibt.id);
    if (frueher.size) neu.frueher = [...frueher]; else delete neu.frueher;
    return { neu, alt: andere.id !== bleibt.id ? andere.id : null };
  }
  /**
   * Fremde Personen in die eigenen führen (P1 a): gleiche Kennung (auch eine frühere) → verbinden; sonst gleicher
   * Name → verbinden, die ältere Kennung bleibt, die andere wird frühere Kennung; sonst neu. Ungültige werden
   * abgewiesen. Gibt { personen, neu, geaendert, abgewiesen, kennungen: { <alt>: <neu> } } — mit kennungen biegt die
   * App Verweise (Protokoll, Rekorde) auf die bleibende Kennung um.
   */
  // schutz: true, wenn die fremden Personen aus einer Datei kommen (KERN.daten, DF4 a): dann werden geschützte und
  // Aufsichten ohne eigene PIN hier gesperrt. Ohne die Option (Umzug am selben Gerät) bleibt alles wie vor kern 1.15.0.
  function zusammenfuehren(eigene, fremde, { geraetFelder = [], schutz: mitSchutz = false } = {}) {
    const personen = eigene.map(p => ({ ...p }));
    const erg = { personen, neu: 0, geaendert: 0, abgewiesen: 0, kennungen: {} };
    for (const roh of Array.isArray(fremde) ? fremde : []) {
      if (maengel(roh).length) { erg.abgewiesen++; continue; }
      const f = ohneGeheimnis(roh, geraetFelder);
      const schutz = mitSchutz ? schutzVon(roh) : null;
      const ids = new Set([f.id, ...(f.frueher || [])]);
      let i = personen.findIndex(p => ids.has(p.id) || (p.frueher || []).some(x => ids.has(x)));
      if (i < 0) i = personen.findIndex(p => nameGleich(p.name, f.name));
      if (i < 0) { personen.push(schutzUebertragen(f, null, roh, schutz)); erg.neu++; continue; }
      const vorher = JSON.stringify(personen[i]);
      const verbunden = verbinde(personen[i], f, geraetFelder);
      const alt = verbunden.alt;
      const neu = schutzUebertragen(verbunden.neu, personen[i], roh, schutz);
      // Ein jüngerer Name von dort, den hier schon jemand anders trägt, gilt nicht (Namen bleiben eindeutig).
      if (!nameGleich(neu.name, personen[i].name) && personen.some((p, j) => j !== i && nameGleich(p.name, neu.name))) {
        neu.name = personen[i].name; neu.geaendert.name = zeit(personen[i], "name");
      }
      if (alt) erg.kennungen[alt] = neu.id;
      if (personen[i].id !== neu.id) erg.kennungen[personen[i].id] = neu.id;
      personen[i] = neu;
      if (JSON.stringify(neu) !== vorher) erg.geaendert++;
    }
    return erg;
  }

  /**
   * Übernahme einer Aufsicht in eine andere App (Plan C9; Entscheide Ü1 a, Ü2 b, LERN_Session16). Alle Apps teilen den
   * Speicher des Browsers; ziel ist die Personenliste der Ziel-App (liste(KERN.speicher("<präfix>"), …)), keine App lädt
   * die andere. Mit reisen Kennung, Name, Rolle, PIN-Prüfwert (gleiche PIN) sowie Sicherheitsfrage und Antwort-Prüfwert;
   * der Wiederherstellungscode ist je App ein eigener Einmal-Schlüssel und wird neu ausgegeben. Verlauf, Verbindungen
   * und Einstellungen reisen nicht. Keine Bestätigung in der Ziel-App (Ü2 b: in der Quell-App schon geprüft).
   * zusatz: Felder, die die Ziel-App verlangt (Lernsteig: art). Nichts wird überschrieben.
   * Liefert { status: "neu" | "schon" | "name", person, code }: „schon“ = dieselbe Kennung ist dort, „name“ = der Name ist
   * dort an jemand anderen vergeben.
   */
  async function uebernehmen(quelle, ziel, zusatz = {}) {
    if (!quelle || quelle.rolle !== "aufsicht") throw new Error("Übernommen wird nur eine Aufsicht.");
    if (!quelle.pin) throw new Error("Die Aufsicht hat noch keine PIN.");
    const da = [quelle.id, ...(quelle.frueher || [])].map(ziel.finde).find(Boolean);
    if (da) return { status: "schon", person: da, code: null };
    if (!ziel.nameFrei(quelle.name)) return { status: "name", person: ziel.findeName(quelle.name), code: null };
    const alt = quelle.wiederherstellung || {};
    const behalten = alt.frage && alt.antwort ? { frage: alt.frage, antwort: alt.antwort } : {};
    const w = await KERN.geheimnis.wiederherstellung({}, behalten);
    // Die Art (Eltern, Lehrperson) reist mit, wenn die Quelle sie kennt; die Ziel-App kann sie über zusatz setzen.
    const person = ziel.anlegen({ ...(quelle.art ? { art: quelle.art } : {}), ...zusatz, id: quelle.id, name: quelle.name, rolle: "aufsicht", pin: quelle.pin, wiederherstellung: w.wiederherstellung });
    return { status: "neu", person, code: w.code };
  }

  // ---------- Auf diesem Gerät ausblenden (KE1 a, KE2 a, LERN_Session20) ----------
  /**
   * Personen, die dieses Gerät nicht zeigt (Anmeldung, Personen-Knopf, Anfragen), ohne sie zu löschen: Sie bleiben in den
   * Daten und reisen in Sicherung und Abgleich weiter; auf den anderen Geräten ändert sich nichts. Die Liste der
   * Kennungen liegt nur auf diesem Gerät (Speicher „ausgeblendet“, nicht abgeglichen). Wen eine App ausblenden lässt,
   * entscheidet sie (eine gesperrte Aufsicht in beiden Apps, KE1 a; im Lernsteig dazu ein nicht verbundenes Konto, KE2 a).
   * liste: KERN.person.liste der App (eine Person mit früheren Kennungen bleibt ausgeblendet).
   */
  function ausgeblendet(liste, speicher, { schluessel = "ausgeblendet" } = {}) {
    const ids = () => (speicher.lies(schluessel, []) || []).filter(x => typeof x === "string");
    const kennungen = p => [p.id, ...(p.frueher || [])];
    const ist = p => !!p && kennungen(p).some(id => ids().includes(id));
    /** Alle ausgeblendeten Personen, die es noch gibt. */
    const personen = () => liste.alle().filter(ist);
    /** Nur die gezeigten Personen einer Liste. */
    const gezeigt = l => l.filter(p => !ist(p));
    function ausblenden(id) {
      const p = liste.finde(id);
      if (!p) return false;
      if (!ist(p)) speicher.schreibe(schluessel, ids().concat(p.id));
      return true;
    }
    function zeigen(id) {
      const p = liste.finde(id);
      const weg = new Set(p ? kennungen(p) : [id]);
      speicher.schreibe(schluessel, ids().filter(x => !weg.has(x)));
    }
    return { schluessel, ids, ist, personen, gezeigt, ausblenden, zeigen };
  }

  KERN.person = {
    ROLLEN, AUFSICHT_ARTEN, GEHEIM, NAME_MAX, neueId, nameRein, nameGleich, ausgeblendet,
    geburtsdatumLies, geburtsdatumText, tagFehlt, alter, maengel, ohneGeheimnis, liste, zusammenfuehren, uebernehmen,
    SCHUTZ, gesperrt, fuerDatei, freischalten, codeReicht, aufsichtenMitPin, NUR_BESTAETIGUNG,
  };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/rollen.js ---- */
/* Kern — Rollen der Aufsicht: Bestätigung durch eine bestehende Aufsicht, PIN vergessen, Zurücksetzen mit Frist
   (Entscheide KR2 a, PIN1 a, PIN1-R a, D5; RL2 a für alle Apps, LERN_Session18; docs/kern/rahmen.md 4.21).
   Herkunft: eulenpfad/spiele/gemeinsam/spiel.js (PIN vergessen in vier Stufen, Frist) und lernsteig/gemeinsam/konten.js
   (Bestätigung einer weiteren Aufsicht). Die Gruppenleitung (G2 a) kommt mit den Gruppen (RL1 a, LERN-48).
   PIN vergessen, für Aufsichten in allen Apps gleich: (1) eine andere Aufsicht des Geräts bestätigt mit ihrer PIN,
   (2) Wiederherstellungscode, (3) Sicherheitsfrage, danach eine neue PIN und gleich ein neuer Code; (4) Zurücksetzen
   mit Frist (3 Tage, auf der Anmeldung für alle sichtbar, mit PIN oder Code einer Aufsicht abzubrechen). Nach Ablauf
   verlieren die Aufsichten des Geräts ihre Rolle — was das heisst, sagt die App (Eulenpfad: Konto ohne PIN; Lernsteig:
   entfernt samt Verbindungen). Gearbeitet wird auf der Personenliste der App (KERN.person.liste). */
"use strict";

(function (KERN) {
  const TAGE = 3;
  const BESTAETIGEN = "Eine Aufsicht dieses Geräts muss mit ihrer PIN bestätigen.";
  const aufsichtenMitPin = personen => KERN.person.aufsichtenMitPin(personen);

  /**
   * Bestätigung durch eine bestehende Aufsicht (KR2 a, D5): { id, pin } einer Aufsicht dieses Geräts mit PIN, nicht die
   * Person selbst (ausser). Gibt die bestätigende Aufsicht zurück; sonst Fehler mit Klartext.
   */
  async function bestaetige(personen, { id, pin } = {}, { ausser = null } = {}) {
    const b = id ? personen.finde(id) : null;
    if (!b || b.rolle !== "aufsicht" || !b.pin || (ausser && b.id === ausser)) throw new Error(BESTAETIGEN);
    if (!(await KERN.geheimnis.pinStimmt(pin, b.pin))) throw new Error(BESTAETIGEN);
    return b;
  }
  /** Braucht eine neue Aufsicht eine Bestätigung? Ja, sobald es auf dem Gerät eine Aufsicht mit PIN gibt. */
  const brauchtBestaetigung = personen => aufsichtenMitPin(personen).length > 0;

  /**
   * PIN vergessen (Stufen 1–3): weg = { code } | { antwort } | { bestaetigung: { id, pin } }. Prüft den Weg, setzt die
   * neue PIN und gibt gleich einen neuen Code aus (der alte ist bekannt geworden oder verloren); Frage und Antwort
   * bleiben. Gibt { person, code } zurück; Fehler mit Klartext.
   */
  async function neuePin(personen, id, pin, weg = {}) {
    const G = KERN.geheimnis;
    const p = personen.finde(id);
    if (!p) throw new Error("Person nicht gefunden");
    const w = p.wiederherstellung || {};
    if (weg.bestaetigung) await bestaetige(personen, weg.bestaetigung, { ausser: p.id });
    else if (weg.code !== undefined) { if (!(await G.codeStimmt(weg.code, w))) throw new Error("Der Code stimmt nicht."); }
    else if (weg.antwort !== undefined) { if (!w.frage || !(await G.antwortStimmt(weg.antwort, w))) throw new Error("Die Antwort stimmt nicht."); }
    else throw new Error("Weg fehlt");
    const neu = await G.pin(pin);
    const behalten = w.frage && w.antwort ? { frage: w.frage, antwort: w.antwort } : {};
    const r = await G.wiederherstellung({}, behalten);
    return { person: personen.aendere(p.id, { pin: neu, wiederherstellung: r.wiederherstellung }), code: r.code };
  }

  /**
   * Zurücksetzen mit Frist (Stufe 4), je Gerät: speicher[schluessel] = { angefordert, ab } (ISO-Zeiten).
   * jetzt: für Tests.
   */
  function frist({ speicher, schluessel = "zuruecksetzen", tage = TAGE, jetzt = () => new Date() } = {}) {
    if (!speicher || typeof speicher.lies !== "function") throw new Error("frist: speicher fehlt");
    const stand = () => { const s = speicher.lies(schluessel, null); return s && typeof s.ab === "string" ? s : null; };
    function anfordern() {
      const t = jetzt();
      const s = { angefordert: t.toISOString(), ab: new Date(t.getTime() + tage * 24 * 3600 * 1000).toISOString() };
      speicher.schreibe(schluessel, s);
      return s;
    }
    const abbrechen = () => (typeof speicher.entferne === "function" ? speicher.entferne(schluessel) : speicher.schreibe(schluessel, null));
    /** Ist die Frist abgelaufen? Dann ist sie erledigt (entfernt) und die App setzt die Aufsichten zurück. */
    function abgelaufen() {
      const s = stand();
      if (!s || new Date(s.ab) > jetzt()) return false;
      abbrechen();
      return true;
    }
    return { TAGE: tage, stand, anfordern, abbrechen, abgelaufen };
  }
  /** Bricht eine Eingabe die Frist ab? Ja, wenn sie die PIN oder der Code einer Aufsicht mit PIN ist. */
  async function abbrechbarMit(personen, eingabe) {
    const G = KERN.geheimnis;
    for (const a of aufsichtenMitPin(personen)) {
      if ((await G.pinStimmt(eingabe, a.pin)) || (await G.codeStimmt(eingabe, a.wiederherstellung))) return true;
    }
    return false;
  }
  /**
   * Nach Ablauf der Frist: alle Aufsichten des Geräts verlieren ihre Rolle. art „lernend“: Konto ohne PIN, Code und
   * Frage (Eulenpfad); art „entfernen“: die Aufsicht wird auf diesem Gerät entfernt und aus den Feldern verweise der
   * anderen Personen gestrichen (Lernsteig: aufsicht, anfragen), ohne Löschvermerk — kennt sie ihre PIN auf einem anderen
   * Gerät, kommt sie über den Abgleich gesperrt zurück (DF4 a). Gibt die Kennungen der Aufsichten zurück.
   */
  function zuruecksetzen(personen, { art = "lernend", verweise = [] } = {}) {
    const ids = personen.alle().filter(p => p.rolle === "aufsicht").map(p => p.id);
    if (!ids.length) return [];
    if (art === "lernend") {
      for (const id of ids) personen.aendere(id, { rolle: "lernend", pin: null, wiederherstellung: null, gesperrt: undefined });
      return ids;
    }
    if (art !== "entfernen") throw new Error(`zuruecksetzen: unbekannte Art ${art}`);
    const bleibt = personen.alle().filter(p => !ids.includes(p.id)).map(p => {
      const q = { ...p };
      for (const f of verweise) if (Array.isArray(q[f])) { const l = q[f].filter(x => !ids.includes(x)); if (l.length) q[f] = l; else delete q[f]; }
      return q;
    });
    if (!personen.speichere(bleibt)) throw new Error("Der Speicher des Browsers ist voll oder gesperrt.");
    return ids;
  }

  KERN.rollen = { TAGE, BESTAETIGEN, bestaetige, brauchtBestaetigung, neuePin, frist, abbrechbarMit, zuruecksetzen };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/freigabe.js ---- */
/* Kern — Freigabe nach Prüfstand (Entscheide L4 a, E1 a, FG1 a; Herkunft eulenpfad/spiele/gemeinsam/spiel.js;
   docs/kern/rahmen.md 4.8).
   Prüfstand im Repo, Freigabe auf dem Gerät. Frei ist, was nichts mehr zu prüfen hat:
   - Ein Inhalt (Spiel, Übung) mit `neu` im Katalog ist gesperrt, bis der Prüfstand ihn als angesehen führt.
   - Eine Inhaltsliste (Katalog `listen: { <liste>: { name, zusatz?, von? } }`) ist gesperrt, bis sie geprüft ist.
     `von: "<inhalt>/<liste>"` verweist auf die Liste eines anderen Inhalts: Prüfstand und Freigabe gelten an der
     Quelle. `zusatz: true` ergibt allein keine Aufgabe und macht einen Inhalt nicht sichtbar.
   - Die Aufsicht kann je Gerät anders entscheiden: Speicher „freigabe“ = { <art>: { <id>: bool }, listen: { … } };
     ohne Eintrag entscheidet der Prüfstand. „freigabeStand“ hält die Zeit der letzten Änderung (Abgleich: der jüngste
     Stand gewinnt).
   Die App gibt alles mit: wo der Katalog und der Prüfstand stehen, wie ihr Inhalt heisst (art), ihren Speicher und
   ob gerade eine Aufsicht angemeldet ist (sie sieht alles). */
"use strict";

(function (KERN) {
  /**
   * opt: { art: "spiele" | "uebungen", eintrag: id → Katalogeintrag | null, pruefstand: () → { <art>, listen },
   *        speicher: { lies, schreibe }, aufsicht: () → bool }
   */
  function freigabe(opt) {
    const { art, eintrag, speicher } = opt;
    const aufsicht = opt.aufsicht || (() => false);
    const stand = () => ({ ...(speicher.lies("freigabe", {}) || {}) });
    const geraet = () => { const f = stand(); return { ...f, [art]: { ...(f[art] || {}) }, listen: { ...(f.listen || {}) } }; };
    function setze(bereich, schluessel, wert) {
      const f = geraet();
      if (wert === null) delete f[bereich][schluessel]; else f[bereich][schluessel] = !!wert;
      // Stand vor der Freigabe schreiben: Der Abgleich nimmt die Freigabe des Geräts mit dem jüngsten Stand.
      speicher.schreibe("freigabeStand", new Date().toISOString());
      speicher.schreibe("freigabe", f);
    }
    /** Prüfstand { am, von } oder null; bereich = art oder "listen". */
    const pruefstand = (bereich, schluessel) => (opt.pruefstand() || {})[bereich]?.[schluessel] || null;
    /** Schlüssel "<inhalt>/<liste>" der Quelle einer Liste (folgt dem Verweis von). */
    const listenQuelle = (id, listeId) => eintrag(id)?.listen?.[listeId]?.von || `${id}/${listeId}`;
    function quellEintrag(schluessel) { const [i, l] = schluessel.split("/"); return eintrag(i)?.listen?.[l] || null; }
    /** Inhaltslisten: [{ id, quelle, name, geprueft, von, zusatz }] — Name und Prüfstand von der Quelle. */
    const listen = id => Object.entries(eintrag(id)?.listen || {}).map(([lid, l]) => {
      const quelle = l.von || `${id}/${lid}`;
      const q = l.von ? quellEintrag(l.von) : l;
      return { id: lid, quelle, name: q?.name ?? l.name, geprueft: pruefstand("listen", quelle), von: l.von || null, zusatz: !!q?.zusatz };
    });
    /** Liste für Lernende frei? */
    const listeFrei = (id, listeId) => { const s = listenQuelle(id, listeId); return geraet().listen[s] ?? !!pruefstand("listen", s); };
    const setzeListeFrei = (id, listeId, wert) => setze("listen", listenQuelle(id, listeId), wert);
    /** Listen, die die angemeldete Person üben darf (die Aufsicht alle). */
    const freieListen = id => listen(id).filter(l => aufsicht() || listeFrei(id, l.id)).map(l => l.id);
    /** Muss der Inhalt als Ganzes noch angesehen werden (neu und nicht im Prüfstand)? */
    const zuPruefen = id => !!eintrag(id)?.neu && !pruefstand(art, id);
    const geprueft = id => pruefstand(art, id);
    /** Inhalt als Ganzes frei (ohne Blick auf die Listen)? */
    const frei = id => geraet()[art][id] ?? !zuPruefen(id);
    const setzeFrei = (id, wert) => setze(art, id, wert);
    /** Sehen Lernende den Inhalt? Frei und, falls er Listen hat, mindestens eine eigenständige Liste frei. */
    const fuerLernendeSichtbar = id => frei(id) && (!listen(id).length || listen(id).some(l => !l.zusatz && listeFrei(id, l.id)));
    const sichtbar = id => aufsicht() || fuerLernendeSichtbar(id);
    /** Warum Lernende den Inhalt nicht sehen, oder null. */
    function sperrGrund(id) {
      if (!eintrag(id)) return "unbekannt";
      if (fuerLernendeSichtbar(id)) return null;
      if (geraet()[art][id] === false) return "auf diesem Gerät gesperrt";
      if (!frei(id)) return "noch nicht angesehen";
      const l = listen(id).filter(x => !x.zusatz);
      if (l.some(x => geraet().listen[x.quelle] === false)) return "Inhaltslisten gesperrt";
      return l.length === 1 ? "Inhaltsliste noch nicht geprüft" : `keine der ${l.length} Inhaltslisten geprüft`;
    }
    return { art, geraet, setze, pruefstand, listenQuelle, listen, listeFrei, setzeListeFrei, freieListen, zuPruefen,
      geprueft, frei, setzeFrei, fuerLernendeSichtbar, sichtbar, sperrGrund };
  }

  KERN.freigabe = freigabe;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/suche.js ---- */
/* Kern — Suche mit Relevanz und persönlicher Passung (Entscheid SU1 a, Wunsch Patrik LERN_Session10; Herkunft
   eulenpfad/spiele/gemeinsam/spiel.js; docs/kern/rahmen.md 4.9).
   Kleine Volltextsuche mit Rangfolge: je Suchwort der beste Treffer über alle Felder, gewichtet nach Feld und Art
   des Treffers; jedes Suchwort muss passen. Passt ein Eintrag nur über ein Feld, das auf der Karte nicht steht,
   nennt `grund` es. Die Passung (0–1, von der App gerechnet) wirkt als Faktor 1 + faktor · Passung auf die
   Textrelevanz — der Text bleibt massgebend. Ohne DOM; die App gibt Einträge, Felder, Gewichte und Passung mit. */
"use strict";

(function (KERN) {
  const falte = t => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  /** Wörter eines Texts, klein; Punkte nur im Wort („MA.1.A.3“ bleibt ganz). */
  const woerter = t => String(t || "").toLowerCase().split(/[^\p{L}\p{N}.]+/u).map(w => w.replace(/^\.+|\.+$/g, "")).filter(Boolean);
  /** Höchstens ein Zeichen Unterschied (einfügen, löschen, ersetzen)? */
  function einTippfehler(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, fehler = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++fehler > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return fehler + (a.length - i) + (b.length - j) <= 1;
  }
  /**
   * Wie gut passt das Suchwort q zum Wort w (0 bis 1)? Ganz 1, Wortanfang 0.8, mit ä = a 0.7 / 0.6, Wortteil ab 4
   * Zeichen 0.4 / 0.3, ein Tippfehler (nur wenn tippfehler, ab 5 Zeichen, nie mit Ziffern) 0.25.
   */
  function wortWert(q, w, tippfehler = false) {
    if (w === q) return 1;
    if (w.startsWith(q)) return 0.8;
    const fq = falte(q), fw = falte(w);
    if (fw === fq) return 0.7;
    if (fw.startsWith(fq)) return 0.6;
    if (q.length >= 4 && w.includes(q)) return 0.4;
    if (q.length >= 4 && fw.includes(fq)) return 0.3;
    if (tippfehler && q.length >= 5 && !/\d/.test(q)
      && (einTippfehler(fq, fw.slice(0, fq.length)) || einTippfehler(fq, fw.slice(0, fq.length + 1)))) return 0.25;
    return 0;
  }
  const mitPassung = (wert, p, faktor = 0.5) => (p === null || p === undefined ? wert : wert * (1 + faktor * p));
  /** Nähe zweier Klassen oder Stufen für die Passung: gleich 1, eine daneben 0.6, zwei 0.2, sonst 0; unbekannt 0.5. */
  const naehe = (a, b) => (a == null || b == null ? 0.5 : ([1, 0.6, 0.2][Math.abs(a - b)] ?? 0));

  /**
   * Einträge zur Suche, beste zuerst: [{ id, wert, passung, grund }]; leere Suche: null.
   * opt: { felder: e → { <feld>: [Texte] }, gewicht: { <feld>: Zahl }, sichtbar: [Felder auf der Karte],
   *        tippfehler: [Felder mit Tippfehler], grund: (feld, text) → Satz, passung: e → 0–1 | null, faktor }
   * Bei gleichem Wert bleibt die Reihenfolge der Einträge.
   */
  function suche(text, eintraege, opt) {
    const qs = woerter(text);
    if (!qs.length) return null;
    const sichtbar = new Set(opt.sichtbar || []), tipp = new Set(opt.tippfehler || []);
    const treffer = [];
    (eintraege || []).forEach((e, rang) => {
      const felder = opt.felder(e);
      let wert = 0;
      const gruende = [];
      for (const q of qs) {
        let best = 0, wo = null;
        for (const [feld, texte] of Object.entries(felder)) for (const t of texte || []) for (const w of woerter(t)) {
          const x = wortWert(q, w, tipp.has(feld)) * (opt.gewicht[feld] || 0);
          if (x > best) { best = x; wo = { feld, t }; }
        }
        if (!best) return;
        wert += best;
        if (!sichtbar.has(wo.feld) && opt.grund) gruende.push(opt.grund(wo.feld, wo.t));
      }
      const p = opt.passung ? opt.passung(e) : null;
      treffer.push({ id: e.id, wert: mitPassung(wert, p, opt.faktor), passung: p, rang, grund: gruende.length ? [...new Set(gruende)].join("; ") : null });
    });
    return treffer.sort((a, b) => b.wert - a.wert || a.rang - b.rang).map(({ rang, ...t }) => t);
  }

  /**
   * Ähnliche Einträge, ähnlichste zuerst: [{ id, wert, passung, grund }].
   * opt: { vergleich: (eintrag, anderer) → { wert, grund } | null (null = nicht ähnlich), passung, faktor }
   */
  function aehnlich(id, eintraege, opt) {
    const e = (eintraege || []).find(x => x.id === id);
    if (!e) return [];
    const liste = [];
    eintraege.forEach((x, rang) => {
      if (x.id === id) return;
      const v = opt.vergleich(e, x);
      if (!v) return;
      const p = opt.passung ? opt.passung(x) : null;
      liste.push({ id: x.id, wert: mitPassung(v.wert, p, opt.faktor), passung: p, rang, grund: v.grund || "" });
    });
    return liste.sort((a, b) => b.wert - a.wert || a.rang - b.rang).map(({ rang, ...t }) => t);
  }

  KERN.suche = { woerter, falte, einTippfehler, wortWert, mitPassung, naehe, suche, aehnlich };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/runden.js ---- */
/* Kern — Runden und Rekorde in einem Format für alle Apps (Entscheid R1 a; docs/kern/rahmen.md 4.10).
   Runde:  { id, person, zeit, inhalt, stufe, aufgaben?, fehler?, dauer?, test?, … Felder der App }
   Rekord: { id, person, zeit, inhalt, stufe, punkte, dauer?, test?, abgebrochen?, … Felder der App }
   - inhalt ist die Kennung des Spiels (Eulenpfad) oder der Übung (Lernsteig); die Oberfläche sagt weiter Spiel/Übung.
   - Die Kernfelder prüft der Kern; die Felder der App prüft er nach dem Schema, das die App meldet
     ({ <feld>: "zahl" | "text" | "bool" | "liste" | "objekt" | "zahlOderNull" | "textOderNull" }). Unbekannte Felder
     bleiben (eine neuere Fassung der App darf mehr schreiben).
   - Kennung: neue Runden „r-<Zeit>-<Zufall>“; ältere Runden ohne Kennung bekommen eine aus ihrem Inhalt
     (kennungAus), damit dieselbe alte Runde auf jedem Gerät dieselbe Kennung bekommt. */
"use strict";

(function (KERN) {
  /** Kurzer Fingerabdruck eines Werts (cyrb53 über JSON): gleich bei gleichem Inhalt, sonst fast sicher verschieden. */
  function fingerabdruck(wert) {
    const s = typeof wert === "string" ? wert : JSON.stringify(wert);
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  function zufallHex(n) {
    const c = typeof crypto !== "undefined" && crypto.getRandomValues ? crypto : null;
    const b = c ? c.getRandomValues(new Uint8Array(n)) : Array.from({ length: n }, () => Math.floor(Math.random() * 256));
    return [...b].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  /** Neue Kennung einer Runde oder eines Rekords. */
  const neueId = () => `r-${Date.now().toString(36)}-${zufallHex(5)}`;
  /** Feste Kennung für eine ältere Runde ohne Kennung: aus Person (oder Name), Zeit, Inhalt und Stufe. */
  const kennungAus = (wer, zeit, inhalt, stufe) => `r-alt-${fingerabdruck([wer, zeit, inhalt, stufe])}`;

  const istText = x => typeof x === "string" && x.length > 0 && x.length <= 200;
  const istZeit = x => typeof x === "string" && !Number.isNaN(Date.parse(x));
  const istZahl = x => typeof x === "number" && Number.isFinite(x) && x >= 0;
  const ARTEN = {
    zahl: istZahl, text: x => typeof x === "string", bool: x => typeof x === "boolean", liste: Array.isArray,
    objekt: x => !!x && typeof x === "object" && !Array.isArray(x),
    zahlOderNull: x => x === null || istZahl(x), textOderNull: x => x === null || typeof x === "string",
  };

  /**
   * Mängel einer Runde (art "runde") oder eines Rekords (art "rekord") als Liste; leer = gültig.
   * opt: { zusatz: Schema der App-Felder, pflicht: [Felder, die da sein müssen], inhaltBekannt: id → bool,
   *        personBekannt: id → bool }
   */
  function maengel(e, art = "runde", opt = {}) {
    if (!e || typeof e !== "object" || Array.isArray(e)) return ["kein Eintrag"];
    const m = [];
    if (!istText(e.id)) m.push("Kennung fehlt");
    if (!istText(e.person)) m.push("Person fehlt");
    else if (opt.personBekannt && !opt.personBekannt(e.person)) m.push("unbekannte Person");
    if (!istZeit(e.zeit)) m.push("Zeit fehlt oder ungültig");
    if (!istText(e.inhalt)) m.push("Inhalt fehlt");
    else if (opt.inhaltBekannt && !opt.inhaltBekannt(e.inhalt)) m.push(`unbekannter Inhalt ${e.inhalt}`);
    if (!istText(e.stufe)) m.push("Stufe fehlt");
    for (const f of ["aufgaben", "fehler", "dauer"]) if (e[f] !== undefined && !istZahl(e[f])) m.push(`${f} keine Zahl`);
    if (e.test !== undefined && typeof e.test !== "boolean") m.push("test kein Ja/Nein");
    if (art === "rekord" && !istZahl(e.punkte)) m.push("Punkte fehlen");
    for (const f of opt.pflicht || []) if (e[f] === undefined || e[f] === null) m.push(`${f} fehlt`);
    for (const [f, a] of Object.entries(opt.zusatz || {})) if (e[f] !== undefined && !(ARTEN[a] || (() => true))(e[f])) m.push(`${f} ist nicht ${a}`);
    return m;
  }

  /**
   * Eintrag eines älteren Formats umdeuten: Felder umbenennen (felder = { alt: neu }, etwa { spiel: "inhalt" }) und,
   * falls die Kennung fehlt, eine feste aus dem Inhalt geben. Gibt einen neuen Eintrag (der alte bleibt).
   */
  function umdeuten(e, felder = {}) {
    if (!e || typeof e !== "object") return e;
    const n = { ...e };
    for (const [alt, neu] of Object.entries(felder)) if (alt in n && !(neu in n)) { n[neu] = n[alt]; delete n[alt]; }
    // Name vor Kennung: Ältere Einträge tragen den Namen auf jedem Gerät gleich, die Kennung der Person aber erst
    // seit dem Umzug je Gerät verschieden — so bekommt dieselbe alte Runde überall dieselbe Kennung.
    if (!n.id) n.id = kennungAus(n.name || n.person || "", n.zeit, n.inhalt, n.stufe);
    return n;
  }

  /**
   * Einträge zusammenführen (Sicherung einlesen, Abgleich): nach Kennung; bei Rekorden gilt der höhere Stand
   * (Zwischenstand → Endstand), bei Runden ersetzt der spätere Stand einen Zwischenstand (abgebrochen, RA3 a). Fremde, ungültige werden abgewiesen; eigene bleiben, wie sie sind (nur `behalten`
   * entscheidet, etwa nach einem Löschvermerk). Ergebnis nach Zeit sortiert: { eintraege, neu, ersetzt, abgewiesen }.
   * opt: { art: "runde" | "rekord", pruefung (wie maengel), umbiegen: person → bleibende Kennung, behalten: e → bool }
   */
  function zusammenfuehren(eigene, fremde, opt = {}) {
    const art = opt.art || "runde";
    const biege = e => (opt.umbiegen && e && e.person ? { ...e, person: opt.umbiegen(e.person) } : e);
    const behalten = opt.behalten || (() => true);
    const nach = new Map();
    let ohneKennung = 0;
    for (const e of (eigene || []).map(biege)) if (e && behalten(e)) nach.set(e.id || `ohne-${ohneKennung++}`, e);
    const erg = { neu: 0, ersetzt: 0, abgewiesen: 0 };
    for (const roh of fremde || []) {
      const e = biege(roh);
      if (maengel(e, art, opt.pruefung).length) { erg.abgewiesen++; continue; }
      if (!behalten(e)) continue;
      const da = nach.get(e.id);
      if (!da) { nach.set(e.id, e); erg.neu++; }
      else if (art === "rekord" && e.punkte > (da.punkte || 0)) { nach.set(e.id, e); erg.ersetzt++; }
      // Runde (RA3 a): ein Zwischenstand beim Verlassen weicht dem späteren Stand derselben Runde
      else if (art === "runde" && da.abgebrochen && (!e.abgebrochen || (e.aufgaben || 0) > (da.aufgaben || 0))) { nach.set(e.id, e); erg.ersetzt++; }
    }
    erg.eintraege = [...nach.values()].sort((a, b) => String(a.zeit || "").localeCompare(String(b.zeit || "")));
    return erg;
  }

  KERN.runden = { fingerabdruck, neueId, kennungAus, maengel, umdeuten, zusammenfuehren, ARTEN };
  KERN.fingerabdruck = fingerabdruck;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/runde.js ---- */
/* Kern — Ablauf einer Runde (AR1 a, LERN_Session18; Einzelentscheide RA1–RA8 a, LERN_Session19; docs/kern/rahmen.md 4.22).
   Erster Schritt: die reinen Hilfen, ohne Oberfläche und ohne Zeitgeber — Gedächtnis gegen Wiederholungen (RA5 a),
   Auswahl der nächsten Aufgabe mit Serienbremse und Kürzen bei erschöpfter Stufe (RA6 a), Rekord nach Kennung,
   Bestwert und Bestzeit, Wächter des Zwischenstands beim Verlassen, Dauer in Sekunden auf 0,1 s (RA2 a).
   Herkunft: eulenpfad/spiele/gemeinsam/spiel.js (Gedächtnis seit LERN_Session11, Serienbremse, Suche in fünf Stufen) und
   lernsteig/gemeinsam/rahmen.js (Rekord, Bestzeit, Zwischenstand). Die Kennung einer Aufgabe bildet die App (Eulenpfad aus
   der Fläche, Lernsteig aus dem Generator); der Kern vergleicht nur. */
"use strict";

(function (KERN) {
  /** Merkmale aus ctx.serie (Eulenpfad) höchstens so oft gleich hintereinander (Vorgabe Patrik 2026-11-01). */
  const SERIE_MAX = 3;
  /**
   * Suche nach einer neuen Aufgabe in fünf Stufen, je bis zu dieser Zahl von Zügen (LERN_Session11):
   *   1. weder in dieser Runde noch im Gedächtnis, ohne zu lange Serie;
   *   2. aus einer früheren Runde, wenn sonst ein Muster entstünde (die Serienbremse geht vor, der Durchgang bleibt);
   *   3. ungestellt, Serie notfalls erzwungen;
   *   4. aus früheren Runden: (fast) alle waren dran → neuer Durchgang, das Gedächtnis beginnt neu;
   *   5. eine Wiederholung dieser Runde, nie zweimal und nie direkt hintereinander (nicht in einer Serie).
   * Danach ist die Stufe erschöpft: die Runde endet früher (gekuerzt), die Serie mit „alles geschafft“.
   */
  const VERSUCHE = { serie: 40, gedaechtnis: 70, erzwingen: 90, durchgang: 105, ende: 120 };
  /** Höchstens so viele Fingerabdrücke je Gedächtnis (Person, Inhalt, Stufe). */
  const GEDAECHTNIS_MAX = 400;

  const fingerabdruck = wert => KERN.runden.fingerabdruck(wert);

  /**
   * Gedächtnis über Runden (RA5 a): je Schlüssel die Fingerabdrücke der gestellten Aufgaben in speicher.lies(feld, {}).
   * Eine Aufgabe kommt erst wieder, wenn (fast) alle verschiedenen einmal dran waren; dann beginnt ein neuer Durchgang.
   * alt: frühere Schlüssel desselben Gedächtnisses (etwa nach Name statt Kennung); sie werden beim ersten Merken
   * übernommen und entfernt.
   */
  function gedaechtnis({ speicher, schluessel, feld = "gestellt", alt = [], max = GEDAECHTNIS_MAX } = {}) {
    if (!speicher || typeof speicher.lies !== "function") throw new Error("gedaechtnis: speicher fehlt");
    if (!schluessel) throw new Error("gedaechtnis: schluessel fehlt");
    const alle = () => { const a = speicher.lies(feld, {}); return a && typeof a === "object" && !Array.isArray(a) ? a : {}; };
    const start = alle();
    const altDa = alt.filter(s => Array.isArray(start[s]));
    const menge = new Set(Array.isArray(start[schluessel]) ? start[schluessel] : altDa.flatMap(s => start[s]));
    function sichere() {
      const a = { ...alle() };
      for (const s of altDa) delete a[s];
      a[schluessel] = [...menge].slice(-max);
      speicher.schreibe(feld, a);
    }
    return {
      hat: fp => menge.has(fp),
      merke(fp) { menge.delete(fp); menge.add(fp); sichere(); },
      /** Neuer Durchgang: nur diese Fingerabdrücke bleiben (die der laufenden Runde). */
      beginneNeu(fps = []) { menge.clear(); for (const f of fps) menge.add(f); },
      get groesse() { return menge.size; },
    };
  }

  /**
   * Auswahl der Aufgaben einer Runde oder Serie (RA5 a, RA6 a). Die App zieht zufällig und fragt je Zug mit
   * pruefe(kennung, serien, versuch): { nehmen, serieErzwungen } — dann ist die Aufgabe gestellt —, { erschoepft } nach
   * VERSUCHE.ende Zügen ohne passende, sonst { weiter }. neueSuche() vor dem ersten Zug jeder Aufgabe.
   * kennung: Text, an dem man die Aufgabe wiedererkennt, oder null (dann gilt sie als neu); serien: { Merkmal: Wert }.
   */
  function auswahl({ gedaechtnis: gd = null, endlos = false, serieMax = SERIE_MAX, versuche = VERSUCHE } = {}) {
    const gestellt = new Map(); // Kennung → wie oft in dieser Runde
    const verlauf = {};         // Merkmal → Werte der gestellten Aufgaben
    let wiederholt = false, letzte = null, sahUngestellt = false;
    const serieZuLang = serien => Object.entries(serien || {}).some(([name, wert]) => {
      const bisher = verlauf[name] || [];
      return bisher.length >= serieMax && bisher.slice(-serieMax).every(w => w === String(wert));
    });
    const stufeDer = v => (v < versuche.serie ? 1 : v < versuche.gedaechtnis ? 2 : v < versuche.erzwingen ? 3 : v < versuche.durchgang ? 4 : 5);
    return {
      neueSuche() { sahUngestellt = false; },
      pruefe(kennung, serien = {}, versuch = 0) {
        const k = kennung || null;
        const n = k ? gestellt.get(k) || 0 : 0;
        const zuLang = serieZuLang(serien);
        const fp = k ? fingerabdruck(k) : null;
        const ungestellt = n === 0 && (!fp || !gd || !gd.hat(fp));
        if (ungestellt) sahUngestellt = true;
        const stufe = stufeDer(versuch);
        const passt = stufe === 1 ? ungestellt && !zuLang
          : stufe === 2 ? n === 0 && !zuLang
          : stufe === 3 ? ungestellt
          : stufe === 4 ? n === 0
          : !endlos && n === 1 && !wiederholt && k !== letzte;
        if (!passt) return versuch >= versuche.ende ? { erschoepft: true } : { weiter: true };
        if (gd && fp) {
          // Neuer Durchgang, wenn keine ungestellte Aufgabe mehr zu finden war (Stufe 4, oder Stufe 2 ohne eine einzige
          // ungestellte); in Stufe 2 mit gesperrten ungestellten ist es nur eine Ausnahme gegen ein Muster.
          if (gd.hat(fp) && (stufe === 4 || (stufe === 2 && !sahUngestellt))) gd.beginneNeu([...gestellt.keys()].map(fingerabdruck));
          gd.merke(fp);
        }
        if (n) wiederholt = true;
        if (k) gestellt.set(k, n + 1);
        letzte = k;
        for (const [name, wert] of Object.entries(serien || {})) (verlauf[name] ||= []).push(String(wert));
        return { nehmen: true, serieErzwungen: zuLang && stufe >= 3, wiederholung: n > 0 };
      },
      get gestellt() { return gestellt.size; },
    };
  }

  /**
   * Runde oder Rekord in die Liste eintragen: gleiche Kennung = Zwischenstand derselben Runde oder Serie, wird ersetzt
   * (RA3 a). Neue Liste. (rekordEintragen: derselbe Teil unter seinem Namen aus 1.19.0.)
   */
  function eintragen(liste, eintrag) {
    const l = (Array.isArray(liste) ? liste : []).filter(r => !(r && eintrag.id && r.id === eintrag.id));
    l.push(eintrag);
    return l;
  }
  /** Höchster Punktestand der passenden Rekorde, 0 ohne. */
  const bestwert = (rekorde, passt = () => true) => (rekorde || []).filter(r => r && passt(r)).reduce((m, r) => Math.max(m, r.punkte || 0), 0);
  /** Kürzeste Dauer der passenden Runden — nur volle Runden ohne gezeigte Lösung, keine Serie (RA6 a); null ohne. */
  function bestzeit(runden, passt = () => true) {
    const z = (runden || []).filter(r => r && passt(r) && !r.endlos && !r.gekuerzt && !r.gezeigt && typeof r.dauer === "number").map(r => r.dauer);
    return z.length ? Math.min(...z) : null;
  }

  /** Dauer in Sekunden mit einer Nachkommastelle (RA2 a). */
  const sekunden = ms => Math.round(Math.max(0, ms) / 100) / 10;

  /**
   * Wächter des Zwischenstands: ruft beimVerlassen() auf, wenn die Seite verlassen wird (pagehide) oder verschwindet
   * (visibilitychange auf hidden; auf Tablets zuverlässiger). aus() nimmt ihn weg. fenster/dokument: für Tests.
   */
  function waechter(beimVerlassen, { fenster = globalThis, dokument = globalThis.document } = {}) {
    const verstecken = () => { if (dokument && dokument.visibilityState === "hidden") beimVerlassen(); };
    if (fenster && fenster.addEventListener) fenster.addEventListener("pagehide", beimVerlassen);
    if (dokument && dokument.addEventListener) dokument.addEventListener("visibilitychange", verstecken);
    let an = true;
    return {
      aus() {
        if (!an) return;
        an = false;
        if (fenster && fenster.removeEventListener) fenster.removeEventListener("pagehide", beimVerlassen);
        if (dokument && dokument.removeEventListener) dokument.removeEventListener("visibilitychange", verstecken);
      },
      get an() { return an; },
    };
  }

  // ---------- Ablauf einer Runde (AR1 a; RA1–RA4 a, RA7 a) ----------
  /** So viele Fehlversuche, dann zeigt die App die Lösung (wenn sie eine nennt). */
  const LOESUNG_NACH = 3;
  /** Höchstens so viele Eingaben je Aufgabe im Eintrag (die letzten). */
  const EINGABEN_MAX = 6;
  const messuhrStandard = () => (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());

  /**
   * Ablauf einer Runde oder Serie ohne Oberfläche. Die App meldet je Aufgabe: gestellt(), bereit() (das Kind kann
   * antworten; ohne Meldung zählt die Zeit ab gestellt, RA7 a), pause()/weiter() (Hilfe, Melden: zählt nicht), eingabe(),
   * falsch(), zeitUm(), richtig(), uebersprungen(); zusatz() hängt Felder der App an die Aufgabe (tipps, vorgehen, lp,
   * rechner). Der Kern zählt Versuche und Fehler (Zeit um ist ein Fehler, die Aufgabe bleibt offen), sagt, wann die
   * Lösung zu zeigen ist (nach dem dritten Fehlversuch, wenn die App eine Lösung nennt), wann die Serie vorbei ist (erste
   * falsche Antwort oder Zeit um) und die Runde (anzahl Aufgaben oder erschoepft()), und baut Eintrag und Rekord.
   * opt: { endlos, anzahl, loesungNach, id, uhr: () => Date (Zeit des Eintrags), messuhr: () => ms (Dauer, Zeiten) }
   */
  function lauf({ endlos = false, anzahl = Infinity, loesungNach = LOESUNG_NACH, id = null,
    uhr = () => new Date(), messuhr = messuhrStandard } = {}) {
    const beginn = messuhr();
    // Kennung erst, wenn ein Eintrag oder Rekord sie braucht (dann fest für Zwischen- und Endstand): wie bisher beim
    // Speichern gezogen, damit die Zufallsfolge eines Testlaufs mit Startwert gleich bleibt
    let kennung = id;
    const kennungJetzt = () => (kennung ||= KERN.runden.neueId());
    const liste = [];
    let a = null; // offene Aufgabe
    let fehler = 0, geschafft = 0, gezeigt = 0, verloren = false, erschoepft = false;
    const offen = () => { if (!a) throw new Error("runde: keine Aufgabe offen"); return a; };

    function abschliessen(geloest, art = {}) {
      const x = offen(), jetzt = messuhr();
      if (x.pauseSeit !== null) { x.pausiert += jetzt - x.pauseSeit; x.pauseSeit = null; }
      // ab bereit; wer schon vorher antwortet (während Töne laufen), ab gestellt (RA7 a)
      const ab = x.bereit !== null && x.bereit <= jetzt ? x.bereit : x.gestellt;
      const e = { ms: Math.round(Math.max(0, jetzt - ab - x.pausiert)), versuche: x.versuche, geloest,
        ...(art.gezeigt ? { gezeigt: true } : {}), ...(art.uebersprungen ? { uebersprungen: true } : {}), ...(x.zeitUm ? { zeitUm: true } : {}) };
      // Angaben zur Aufgabe nur, wenn sie einen Fehler hatte (RA4 a)
      if (x.versuche > 0 || x.zeitUm) Object.assign(e, { text: x.text || "", loesung: x.loesung || "", eingaben: x.eingaben.slice(-EINGABEN_MAX) });
      Object.assign(e, x.zusatz);
      liste.push(e);
      a = null;
      return e;
    }
    const merke = ({ text, loesung, eingabe } = {}) => {
      const x = offen();
      if (text && !x.text) x.text = String(text);
      if (loesung && !x.loesung) x.loesung = String(loesung);
      if (eingabe !== undefined && eingabe !== null && eingabe !== "") x.eingaben.push(String(eingabe));
    };

    const r = {
      get id() { return kennungJetzt(); },
      /** Neue Aufgabe; text und loesung (Text) für den Eintrag, falls sie einen Fehler bekommt. */
      gestellt({ text = "", loesung = "" } = {}) {
        if (a) throw new Error("runde: vorige Aufgabe noch offen");
        if (r.vorbei) throw new Error("runde: vorbei");
        a = { gestellt: messuhr(), bereit: null, pauseSeit: null, pausiert: 0, versuche: 0, zeitUm: false,
          text: text ? String(text) : "", loesung: loesung ? String(loesung) : "", eingaben: [], zusatz: {} };
      },
      /** Ab jetzt kann das Kind antworten (Töne, „▶ Los!“, Vorlesen fertig); wirkt einmal. */
      bereit() { const x = offen(); if (x.bereit === null) x.bereit = messuhr(); },
      pause() { const x = offen(); if (x.pauseSeit === null) x.pauseSeit = messuhr(); },
      weiter() { const x = offen(); if (x.pauseSeit !== null) { x.pausiert += messuhr() - x.pauseSeit; x.pauseSeit = null; } },
      eingabe(t) { merke({ eingabe: t }); },
      zusatz(felder) { Object.assign(offen().zusatz, felder); },
      /**
       * Falsche Antwort ({ text, loesung, eingabe } für den Eintrag). Ergebnis: { versuche, loesungZeigen, vorbei }
       * — loesungZeigen nach dem dritten Fehlversuch mit Lösung (die Aufgabe ist dann abgeschlossen), vorbei in einer Serie.
       */
      falsch(angaben = {}) {
        const x = offen();
        merke(angaben);
        x.versuche++; fehler++;
        if (endlos) { verloren = true; abschliessen(false); return { versuche: x.versuche, loesungZeigen: false, vorbei: true }; }
        const zeigen = x.versuche >= loesungNach && !!x.loesung;
        if (zeigen) { gezeigt++; abschliessen(false, { gezeigt: true }); }
        return { versuche: x.versuche, loesungZeigen: zeigen, vorbei: false };
      },
      /** Zeit um: ein Fehler, die Aufgabe bleibt offen; in einer Serie ist sie vorbei. */
      zeitUm(angaben = {}) {
        const x = offen();
        merke(angaben);
        if (x.zeitUm) return { vorbei: false };
        x.zeitUm = true; fehler++;
        if (endlos) { verloren = true; abschliessen(false); return { vorbei: true }; }
        return { vorbei: false };
      },
      /** Richtige Antwort: { aufAnhieb } (ohne Fehlversuch; Zeit um zählt nicht dagegen). */
      richtig(angaben = {}) {
        merke(angaben);
        const e = abschliessen(true);
        geschafft++;
        return { aufAnhieb: e.versuche === 0 };
      },
      /** Übersprungen (Testhilfe): abgeschlossen, nicht gelöst. */
      uebersprungen() { abschliessen(false, { uebersprungen: true }); },
      /** Die Stufe gibt keine neue Aufgabe mehr her (KERN.runde.auswahl): die Runde ist gekürzt, die Serie geschafft. */
      erschoepft() { erschoepft = true; },
      get offen() { return !!a; },
      get versuche() { return a ? a.versuche : 0; },
      get aufgaben() { return liste.length; },
      get fehler() { return fehler; },
      get geschafft() { return geschafft; },
      get gezeigt() { return gezeigt; },
      get liste() { return liste.slice(); },
      get erschoepftIst() { return erschoepft; },
      get vorbei() { return erschoepft || verloren || (!endlos && liste.length >= anzahl); },
      /**
       * Protokolleintrag (R1 a, RA1–RA4 a): zeit = jetzt (Ende), dauer in s auf 0,1 s, aufgaben, fehler, gezeigt, liste;
       * endlos, gekuerzt (geplante Zahl), abgebrochen (Zwischenstand beim Verlassen; eine offene Aufgabe zählt nicht).
       * felder: person, inhalt, stufe und die Felder der App.
       */
      eintrag(felder = {}, { abgebrochen = false } = {}) {
        const e = { id: kennungJetzt(), zeit: uhr().toISOString(), ...felder, aufgaben: liste.length, fehler, gezeigt,
          dauer: sekunden(messuhr() - beginn), liste: liste.slice() };
        if (endlos) e.endlos = true;
        if (!endlos && erschoepft && Number.isFinite(anzahl) && liste.length < anzahl) e.gekuerzt = anzahl;
        if (abgebrochen) e.abgebrochen = true;
        return e;
      },
      /** Rekord einer Serie (gleiche Kennung wie der Eintrag): punkte = richtig in Folge; alles = Stufe erschöpft. */
      rekord(felder = {}, { abgebrochen = false } = {}) {
        return { id: kennungJetzt(), zeit: uhr().toISOString(), ...felder, punkte: geschafft, dauer: sekunden(messuhr() - beginn),
          ...(erschoepft ? { alles: true } : {}), ...(abgebrochen ? { abgebrochen: true } : {}) };
      },
    };
    return r;
  }

  /** Aufgaben eines Eintrags mit Fehler (Fehlversuch oder Zeit um) — was früher fehlerAufgaben (Eulenpfad) hiess. */
  const mitFehler = e => (Array.isArray(e && e.liste) ? e.liste : []).filter(x => x && (x.versuche > 0 || x.zeitUm));
  /** Auf Anhieb gelöst: ohne Fehlversuch, ohne Zeit um, ohne Tipp. */
  const aufAnhieb = x => !!x && x.geloest === true && !(x.versuche > 0) && !x.zeitUm && !x.tipps;

  // ---------- Ältere Einträge umdeuten (RA4 a; RA1 a im Lernsteig) ----------
  /**
   * Runde des Eulenpfads bis LERN_Session18: aufgabenZeiten (je Aufgabe) und fehlerAufgaben (nur mit Fehler, in derselben
   * Reihenfolge: angelegt beim ersten Fehlversuch oder bei Zeit um) → liste. Ohne aufgabenZeiten (Runden der ersten
   * Sitzungen): je Aufgabe mit Fehler ein Eintrag aus fehlerAufgaben, die übrigen ohne Zeit als auf Anhieb gelöst.
   * Andere Einträge bleiben, wie sie sind.
   */
  function ausEulenpfad(e) {
    if (!e || typeof e !== "object" || !("aufgabenZeiten" in e || "fehlerAufgaben" in e)) return e;
    const { aufgabenZeiten, fehlerAufgaben, ...rest } = e;
    const zeiten = Array.isArray(aufgabenZeiten) ? aufgabenZeiten : null;
    const fa = (Array.isArray(fehlerAufgaben) ? fehlerAufgaben : []).filter(f => f && typeof f === "object");
    const angaben = f => ({ text: String(f.text || ""), loesung: String(f.loesung || ""), eingaben: [] });
    let liste;
    if (zeiten) {
      let k = 0;
      liste = zeiten.map(z => {
        const x = { ...z };
        if (x.versuche > 0 || x.zeitUm) { const f = fa[k++]; Object.assign(x, angaben(f || {})); }
        if (!x.geloest && !x.uebersprungen && x.versuche > 0) x.gezeigt = true;
        return x;
      });
    } else {
      liste = fa.map(f => ({ versuche: Number(f.versuche) || 0, geloest: !!f.geloest, ...(f.zeitUm ? { zeitUm: true } : {}),
        ...(!f.geloest && f.versuche > 0 ? { gezeigt: true } : {}), ...angaben(f) }));
      const n = Math.max(0, (Number(e.aufgaben) || 0) - liste.length);
      for (let i = 0; i < n; i++) liste.push({ versuche: 0, geloest: true });
    }
    return { ...rest, liste, gezeigt: liste.filter(x => x.gezeigt).length };
  }
  /**
   * Runde des Lernsteigs bis LERN_Session18: zeit war der Beginn (RA1 a: jetzt das Ende, zeit + dauer), zeiten (ms der
   * gelösten oder aufgelösten Aufgaben), liste ({ lp, versuche, gezeigt, rechner }), falsch ([{ text, eingaben }] in der
   * Reihenfolge der Aufgaben mit Fehlversuch, gleiche Texte zusammen) → eine liste. Andere bleiben.
   */
  function ausLernsteig(e) {
    if (!e || typeof e !== "object" || !("zeiten" in e || "falsch" in e)) return e;
    const { zeiten, falsch, ...rest } = e;
    const ms = Array.isArray(zeiten) ? zeiten : [];
    const fa = (Array.isArray(falsch) ? falsch : []).filter(f => f && typeof f === "object");
    const alt = Array.isArray(e.liste) ? e.liste : [];
    let j = 0, k = 0;
    const liste = alt.map((x, i) => {
      // die letzte Aufgabe einer Serie, falsch beantwortet: ohne Zeit, nicht gelöst
      const serieVerloren = e.endlos && i === alt.length - 1 && x.versuche > 0 && !x.gezeigt;
      const n = { ...x, geloest: !x.gezeigt && !serieVerloren };
      if (!x.gezeigt) delete n.gezeigt;
      if (!serieVerloren && j < ms.length) n.ms = ms[j++];
      if (x.versuche > 0) { const f = fa[k++] || {}; Object.assign(n, { text: String(f.text || ""), loesung: "", eingaben: Array.isArray(f.eingaben) ? f.eingaben.map(String).slice(-EINGABEN_MAX) : [] }); }
      return n;
    });
    const n = { ...rest, liste };
    const beginn = Date.parse(e.zeit);
    if (!Number.isNaN(beginn) && typeof e.dauer === "number") n.zeit = new Date(beginn + Math.round(e.dauer * 1000)).toISOString();
    return n;
  }

  KERN.runde = { SERIE_MAX, VERSUCHE, GEDAECHTNIS_MAX, LOESUNG_NACH, gedaechtnis, auswahl, eintragen, rekordEintragen: eintragen,
    bestwert, bestzeit, sekunden, waechter, lauf, mitFehler, aufAnhieb, ausEulenpfad, ausLernsteig };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/daten.js ---- */
/* Kern — Sichern, Einlesen und Abgleich in einem Dateiformat für alle Apps (Entscheide DF1 a, DF2 a, DF4 a, R1 a, P1 a;
   Befund D4; docs/kern/rahmen.md 4.19). Herkunft: eulenpfad/spiele/gemeinsam/spiel.js (LS.zusammenfuehren,
   LS.abgleichDaten, Löschvermerke) und lernsteig/gemeinsam/daten.js (Prüfung vor dem Schreiben, alles oder nichts).

   Datei: { format: "reihe-daten", version: 1, app, art: "sicherung" | "abgleich", gesichert, geraet?, personen, runden,
            rekorde, geloescht?, freigabe?, freigabeStand?, … Teile der App unter eigenem Namen }
   - Personen ohne PIN und Gerätefelder; wer geschützt ist, reist mit dem Vermerk geschuetzt und nur dem Prüfwert seines
     Wiederherstellungscodes (KERN.person.fuerDatei, DF4 a).
   - Runden und Rekorde im Format von KERN.runden, je mit der Kennung ihrer Person.
   - geloescht (nur im Abgleich): { personen: { <id>: ISO }, namen: { <name>: ISO }, runden: [{ person?, name?, inhalt, bis }] }
     — ein Vermerk entfernt auf jedem Gerät, was bis zu seinem Zeitpunkt entstand; später Entstandenes bleibt (DF2 a).
   - freigabe, freigabeStand (nur im Abgleich, wenn die App sie teilt): die Freigabe des Geräts mit dem jüngsten Stand gilt.
   Ältere Dateien (eulenpfad-daten 1–3 und ohne format, lernsteig-sicherung 1–2) deutet lesen() um.

   Einlesen: erst die ganze Datei lesen und jeden Eintrag prüfen (Ungültiges wird gezählt und nie gespeichert), dann im
   Speicher zusammenführen, am Ende nur die geänderten Schlüssel schreiben — scheitert ein Schreiben (Speicher voll),
   wird der alte Stand zurückgeschrieben: alles oder nichts. */
"use strict";

(function (KERN) {
  const FORMAT = "reihe-daten";
  const VERSION = 1;
  // Formate der Reihe: alte Formatnamen und ihre App; Anzeige der App in Meldungen
  const ALTE_FORMATE = { "eulenpfad-daten": "eulenpfad", "lernsteig-sicherung": "lernsteig" };
  const APP_TEXT = { eulenpfad: "des Eulenpfads", lernsteig: "des Lernsteigs", gratwanderung: "der Gratwanderung" };
  const appText = a => APP_TEXT[a] || `der App „${a}“`;
  const KOPF = new Set(["format", "version", "app", "art", "gesichert", "geraet", "personen", "runden", "rekorde",
    "geloescht", "freigabe", "freigabeStand"]);
  const BESCHAEDIGT = "Die Datei ist beschädigt.";
  const SPEICHER_VOLL = "Der Speicher des Browsers ist voll oder gesperrt; nichts wurde eingelesen.";

  const istObjekt = x => !!x && typeof x === "object" && !Array.isArray(x);
  const liste = x => (Array.isArray(x) ? x : []);
  const juengste = werte => werte.filter(w => typeof w === "string" && w).sort().pop() || "";
  const kennungen = p => [p.id, ...(p.frueher || [])];

  // ---------- Löschvermerke (DF2 a) ----------
  /** Vermerke in der Form des Kerns; liest auch die des Eulenpfads bis LERN_Session18 (spieler nach Namen, spiel). */
  function vermerkeRein(g) {
    const v = istObjekt(g) ? g : {};
    const zeiten = o => Object.fromEntries(Object.entries(istObjekt(o) ? o : {}).filter(([k, t]) => k && typeof t === "string" && t));
    return {
      personen: zeiten(v.personen),
      namen: { ...zeiten(v.spieler), ...zeiten(v.namen) },
      runden: liste(v.runden).filter(r => istObjekt(r) && (r.person || r.name) && typeof r.bis === "string" && r.bis)
        .map(r => ({ ...(r.person ? { person: String(r.person) } : {}), ...(r.name ? { name: String(r.name) } : {}),
          inhalt: r.inhalt ?? r.spiel ?? null, bis: r.bis })),
    };
  }
  /** Vermerke beider Seiten gelten zusammen: je Person und Name der spätere, Runden-Vermerke vereint. */
  function vermerkeVereinen(a, b) {
    const g = vermerkeRein(a), f = vermerkeRein(b);
    for (const feld of ["personen", "namen"]) for (const [k, t] of Object.entries(f[feld])) if (!(g[feld][k] >= t)) g[feld][k] = t;
    const schl = r => `${r.person || ""}|${r.name || ""}|${r.inhalt || ""}|${r.bis}`;
    const da = new Set(g.runden.map(schl));
    for (const r of f.runden) if (!da.has(schl(r))) { g.runden.push(r); da.add(schl(r)); }
    return g;
  }
  /** Jüngster Stand einer Person (über ihre Änderungszeiten). */
  const personStand = p => juengste(Object.values(p?.geaendert || {}));
  /** Seit wann ist die Person gelöscht? Über alle ihre Kennungen und den Namen; "" = nicht. */
  const geloeschtSeit = (p, g) => juengste(kennungen(p).map(id => g.personen[id]).concat(g.namen[p.name]));
  /**
   * Gelöscht und seither weder geändert noch gespielt? aktiv: Zeit der jüngsten Runde der Person (beide Seiten) — wer
   * nach dem Vermerk gespielt hat (auf einem anderen Gerät), bleibt, wie bisher im Eulenpfad („neu gespielt bleibt“).
   */
  const personWeg = (p, g, aktiv = "") => { const s = geloeschtSeit(p, g); return !!s && juengste([personStand(p), aktiv]) <= s; };
  /** Ist der Eintrag durch einen Vermerk gelöscht? p: seine Person (oder null, dann gilt seine Kennung). */
  function eintragWeg(e, p, g) {
    const ids = p ? kennungen(p) : [e.person];
    const name = p ? p.name : e.name;
    const seit = juengste(ids.map(id => g.personen[id]).concat(name ? g.namen[name] : ""));
    if (seit && e.zeit <= seit) return true;
    return g.runden.some(r => (r.person ? ids.includes(r.person) : !!name && r.name === name)
      && (!r.inhalt || r.inhalt === e.inhalt) && e.zeit <= r.bis);
  }

  // ---------- Ältere Dateien ----------
  /** Profil nach Namen (Eulenpfad version 1, 2) → Person; die App kann es mit opt.altePerson genauer. */
  function altePersonStandard(name, profil) {
    const { geaendert = {}, ...rest } = profil;
    const { angelegt = "", ...zeiten } = istObjekt(geaendert) ? geaendert : {};
    const geboren = rest.geboren == null ? null : KERN.person.geburtsdatumLies(rest.geboren);
    return { ...rest, geboren, id: rest.id || KERN.person.neueId(), name: KERN.person.nameRein(name),
      rolle: rest.rolle === "aufsicht" ? "aufsicht" : "lernend", angelegt, geaendert: zeiten };
  }
  function ausEulenpfad(d, altePerson) {
    if (d.version !== undefined && ![1, 2, 3].includes(d.version)) throw new Error(BESCHAEDIGT);
    if (d.personen !== undefined && !Array.isArray(d.personen)) throw new Error(BESCHAEDIGT);
    for (const f of ["protokoll", "rekorde"]) if (d[f] !== undefined && !Array.isArray(d[f])) throw new Error(BESCHAEDIGT);
    const personen = Array.isArray(d.personen) ? d.personen.slice()
      : Object.entries(istObjekt(d.profile) ? d.profile : {}).filter(([, p]) => istObjekt(p)).map(([n, p]) => altePerson(n, p));
    const umd = l => liste(l).map(e => (istObjekt(e) ? KERN.runden.umdeuten(e, { spiel: "inhalt" }) : e));
    const runden = umd(d.protokoll), rekorde = umd(d.rekorde);
    // Einträge von vor LERN_Session15 tragen nur den Namen: Person der Datei mit diesem Namen, sonst eine neue
    // (ein Kind, das nur in Runden vorkommt)
    for (const e of runden.concat(rekorde)) {
      if (!istObjekt(e) || e.person || !e.name) continue;
      let p = personen.find(q => istObjekt(q) && KERN.person.nameGleich(q.name, e.name));
      if (!p) {
        p = { id: KERN.person.neueId(), name: KERN.person.nameRein(e.name), rolle: "lernend", angelegt: e.zeit || "", geaendert: {} };
        if (KERN.person.maengel(p).length) continue;
        personen.push(p);
      }
      e.person = p.id;
    }
    const { format, version, profile, protokoll, personen: _p, rekorde: _r, ...rest } = d;
    return { ...rest, format: FORMAT, version: VERSION, app: "eulenpfad", art: d.geloescht ? "abgleich" : "sicherung",
      personen, runden, rekorde };
  }
  /** Konto einer Sicherung des Lernsteigs bis LERN_Session15 (erstellt, geaendert als eine Zeit, ohne Rolle) → Person. */
  function lernsteigKonto(k) {
    if (!istObjekt(k)) return k;
    const { erstellt, ...rest } = k;
    const p = { ...rest, rolle: k.rolle || "lernend" };
    if (!p.angelegt && erstellt) p.angelegt = erstellt;
    if (typeof p.geaendert === "string" || p.geaendert === undefined) {
      const t = typeof k.geaendert === "string" ? k.geaendert : (p.angelegt || "");
      p.geaendert = {};
      for (const f of Object.keys(p)) if (!["id", "angelegt", "geaendert", "frueher"].includes(f)) p.geaendert[f] = t;
    }
    return p;
  }
  function ausLernsteig(d) {
    if (![1, 2].includes(d.version)) throw new Error(BESCHAEDIGT);
    for (const f of ["konten", "runden", "rekorde"]) if (d[f] !== undefined && !Array.isArray(d[f])) throw new Error(BESCHAEDIGT);
    const umd = l => liste(l).map(e => (istObjekt(e) ? KERN.runden.umdeuten(e, { konto: "person", uebung: "inhalt" }) : e));
    return { format: FORMAT, version: VERSION, app: "lernsteig", art: "sicherung", gesichert: d.erstellt || d.gesichert || "",
      personen: liste(d.konten).map(lernsteigKonto), runden: umd(d.runden), rekorde: umd(d.rekorde) };
  }

  /**
   * Datei lesen (Text oder Objekt) und in die heutige Form bringen. Fehler mit Klartext: kein gültiger Inhalt, keine
   * Datei der Reihe, Datei einer anderen App, neuere Fassung, beschädigt.
   */
  function lesen(eingabe, app, { altePerson = altePersonStandard } = {}) {
    let d = eingabe;
    if (typeof d === "string") { try { d = JSON.parse(d); } catch (e) { throw new Error("Diese Datei kann ich nicht lesen."); } }
    if (!istObjekt(d)) throw new Error("Diese Datei kann ich nicht lesen.");
    const alteEulenpfad = !d.format && (istObjekt(d.profile) || Array.isArray(d.personen)) && Array.isArray(d.protokoll);
    const von = d.format === FORMAT ? d.app : ALTE_FORMATE[d.format] || (alteEulenpfad ? "eulenpfad" : null);
    if (!von || typeof von !== "string") throw new Error("Das ist keine Sicherung und keine Abgleich-Datei.");
    if (von !== app) throw new Error(`Das ist eine Datei ${appText(von)}; hier lässt sie sich nicht einlesen.`);
    let n;
    if (d.format === FORMAT) {
      if (!Number.isInteger(d.version) || d.version < 1) throw new Error(BESCHAEDIGT);
      if (d.version > VERSION) throw new Error("Die Datei stammt aus einer neueren Fassung. Bitte die Seite neu laden und noch einmal einlesen.");
      n = d;
    } else n = von === "lernsteig" ? ausLernsteig(d) : ausEulenpfad(d, altePerson);
    for (const f of ["personen", "runden", "rekorde"]) if (n[f] !== undefined && !Array.isArray(n[f])) throw new Error(BESCHAEDIGT);
    if (n.geloescht !== undefined && n.geloescht !== null && !istObjekt(n.geloescht)) throw new Error(BESCHAEDIGT);
    return n;
  }

  // ---------- Daten einer App ----------
  /**
   * opt:
   *   app           "eulenpfad" | "lernsteig" | … — steht in der Datei; Dateien anderer Apps werden abgewiesen
   *   speicher      KERN.speicher(<präfix>) der App
   *   schluessel    Speicherschlüssel { personen, runden, rekorde, geloescht, freigabe, freigabeStand } (Standard
   *                 gleichnamig; Eulenpfad runden: "protokoll")
   *   dateiPraefix  Anfang der Dateinamen („lernspiele“, „lernsteig“: .gitignore hält <präfix>-*.json aus dem Repo)
   *   geraetFelder  Felder der Personen, die auf dem Gerät bleiben (Lernsteig: Verbindungen)
   *   pruefung      { runde, rekord } — Schema der App wie bei KERN.runden.maengel (zusatz, pflicht, inhaltBekannt)
   *   gueltig       { runde?, rekord? } — weitere Prüfung der App je fremdem Eintrag (e → bool), etwa die Elemente einer Liste
   *   ohnePerson    Kennungen, denen Runden ohne Person gehören dürfen (Lernsteig: „gast“ bis LERN_Session16)
   *   freigabe      true: die Freigabe des Geräts reist im Abgleich mit (KERN.freigabe, jüngster Stand gewinnt)
   *   teile         { <name>: { schluessel, sichern(ids | null, eigene) → wert, zusammenfuehren(eigene, fremde, hilfe)
   *                 → { wert, neu }, entferne?(eigene, ids) → wert } } — Daten nur dieser App (Eulenpfad: meldungen);
   *                 hilfe = { umbiegen, personVon }
   *   altePerson    (name, profil) → Person — Profile nach Namen älterer Dateien des Eulenpfads
   *   umdeuten      ({ runden, rekorde }) → { runden, rekorde } — Einträge älterer Fassungen der App in die heutige Form,
   *                 vor der Prüfung (Eulenpfad, Lernsteig: KERN.runde.ausEulenpfad, ausLernsteig; RA4 a)
   */
  function daten(opt = {}) {
    const { app, speicher } = opt;
    if (typeof app !== "string" || !/^[a-z][a-z0-9-]*$/.test(app)) throw new Error("daten: app fehlt");
    if (!speicher || typeof speicher.lies !== "function") throw new Error("daten: speicher fehlt");
    const S = { personen: "personen", runden: "runden", rekorde: "rekorde", geloescht: "geloescht", freigabe: "freigabe",
      freigabeStand: "freigabeStand", ...(opt.schluessel || {}) };
    const dateiPraefix = opt.dateiPraefix || app;
    const geraetFelder = opt.geraetFelder || [];
    const pruefung = { runde: {}, rekord: {}, ...(opt.pruefung || {}) };
    const gueltig = { runde: () => true, rekord: () => true, ...(opt.gueltig || {}) };
    const ohnePerson = new Set(opt.ohnePerson || []);
    const teile = opt.teile || {};
    const altePerson = opt.altePerson || altePersonStandard;
    for (const n of Object.keys(teile)) if (KOPF.has(n)) throw new Error(`daten: Teil ${n} heisst wie ein Feld des Kerns`);

    const KEIN = {}; // Marke für „Schlüssel fehlt“ beim Zurückschreiben
    const roh = k => speicher.lies(k, KEIN);
    const rohListe = k => liste(speicher.lies(k, []));
    const personenAlle = () => rohListe(S.personen).filter(p => !KERN.person.maengel(p).length);
    const vermerke = () => vermerkeRein(speicher.lies(S.geloescht, {}));

    /**
     * Neue Werte schreiben, nur geänderte Schlüssel; scheitert eines, wird alles zurückgeschrieben (Fehler mit Klartext).
     * Gibt die geschriebenen Schlüssel zurück.
     */
    function schreibeAlle(neu, meldung = SPEICHER_VOLL) {
      const vorher = {}, geschrieben = [];
      for (const [k, w] of Object.entries(neu)) {
        const alt = roh(k);
        if (alt !== KEIN && JSON.stringify(alt) === JSON.stringify(w)) continue;
        vorher[k] = alt;
        if (!speicher.schreibe(k, w)) {
          for (const g of geschrieben) { if (vorher[g] === KEIN) speicher.entferne(g); else speicher.schreibe(g, vorher[g]); }
          throw new Error(meldung);
        }
        geschrieben.push(k);
      }
      return geschrieben;
    }

    /**
     * Sicherung (art „sicherung“: die genannten Personen und ihre Einträge) oder Abgleich (art „abgleich“: alles, dazu
     * Löschvermerke und Freigabe). ids: Kennungen der Personen, null = alle; filter: e → bool für Runden und Rekorde
     * (etwa ohne Testrunden); geraet: { id, name } im Abgleich.
     */
    function sichern({ ids = null, art = "sicherung", filter = null, geraet = null } = {}) {
      if (!["sicherung", "abgleich"].includes(art)) throw new Error(`daten: unbekannte Art ${art}`);
      const alle = personenAlle();
      const auswahl = ids ? alle.filter(p => kennungen(p).some(id => ids.includes(id))) : alle;
      const menge = new Set(auswahl.flatMap(kennungen));
      const waehle = k => rohListe(k).filter(e => istObjekt(e) && menge.has(e.person) && (!filter || filter(e)));
      const d = { format: FORMAT, version: VERSION, app, art, gesichert: new Date().toISOString(), ...(geraet ? { geraet } : {}),
        personen: auswahl.map(p => KERN.person.fuerDatei(p, geraetFelder)), runden: waehle(S.runden), rekorde: waehle(S.rekorde) };
      if (art === "abgleich") {
        d.geloescht = vermerke();
        if (opt.freigabe) { d.freigabe = speicher.lies(S.freigabe, null); d.freigabeStand = speicher.lies(S.freigabeStand, null); }
      }
      for (const [name, t] of Object.entries(teile)) d[name] = t.sichern(ids ? [...menge] : null, speicher.lies(t.schluessel, null));
      return d;
    }

    /**
     * Datei einlesen und zusammenführen (Text oder Objekt). Ergebnis: { personen: { neu, geaendert }, runden, rekorde,
     * teile: { <name>: neu }, freigabe, abgewiesen, kennungen, ids (Personen der Datei nach dem Zusammenführen), neueIds
     * (davon neu auf dem Gerät), geschrieben (Schlüssel), datei: { art, gesichert, geraet } }. Fehler mit Klartext.
     * rollen: nur Personen dieser Rollen übernehmen, die anderen zählen als abgewiesen (Lernsteig: ohne angemeldete
     * Aufsicht keine Aufsichten, AS1 a); null = alle.
     */
    function einlesen(eingabe, { rollen = null } = {}) {
      const gelesen = lesen(eingabe, app, { altePerson });
      // umgedeutet in eine Kopie: die eingegebene Datei bleibt, wie sie ist
      const u = opt.umdeuten ? opt.umdeuten({ runden: liste(gelesen.runden), rekorde: liste(gelesen.rekorde) }) : null;
      const d = u ? { ...gelesen, runden: liste(u.runden), rekorde: liste(u.rekorde) } : gelesen;
      const erg = { personen: { neu: 0, geaendert: 0 }, runden: 0, rekorde: 0, teile: {}, freigabe: false, abgewiesen: 0,
        kennungen: {}, ids: [], neueIds: [], geschrieben: [], datei: { art: d.art, gesichert: d.gesichert || "", geraet: d.geraet || null } };

      // 1. Löschvermerke beider Seiten
      const g = vermerkeVereinen(speicher.lies(S.geloescht, {}), d.geloescht);

      // 2. Personen (P1 a, DF4 a): zusammenführen, dann fällt weg, wer gelöscht ist und seither weder geändert wurde
      //    noch gespielt hat (Runden beider Seiten); mit ihr ihre Runden
      const eigene = personenAlle();
      const bekannt = new Set(eigene.flatMap(kennungen));
      const alleFremden = liste(d.personen);
      const fremde = rollen ? alleFremden.filter(p => istObjekt(p) && rollen.includes(p.rolle)) : alleFremden;
      erg.abgewiesen += alleFremden.length - fremde.length;
      const z = KERN.person.zusammenfuehren(eigene, fremde, { geraetFelder, schutz: true });
      erg.abgewiesen += z.abgewiesen;
      erg.kennungen = z.kennungen;
      const umbiegen = id => z.kennungen[id] || id;
      const findeIn = (l, id) => l.find(p => p.id === umbiegen(id) || (p.frueher || []).includes(id)) || null;
      const zuletzt = {}; // jüngste Runde je bleibender Kennung
      for (const e of rohListe(S.runden).concat(rohListe(S.rekorde), liste(d.runden), liste(d.rekorde))) {
        if (!istObjekt(e) || typeof e.person !== "string" || typeof e.zeit !== "string") continue;
        const p = findeIn(z.personen, e.person);
        if (p && !(zuletzt[p.id] >= e.zeit)) zuletzt[p.id] = e.zeit;
      }
      const personen = z.personen.filter(p => !personWeg(p, g, zuletzt[p.id]));
      const entfallen = z.personen.filter(p => !personen.includes(p));
      erg.personen = { neu: z.neu, geaendert: z.geaendert };
      const personVon = id => findeIn(personen, id);
      for (const f of fremde) {
        const p = istObjekt(f) && personVon(f.id);
        if (p && !erg.ids.includes(p.id)) { erg.ids.push(p.id); if (!kennungen(p).some(id => bekannt.has(id))) erg.neueIds.push(p.id); }
      }

      // 3. Runden und Rekorde (R1 a): fremde geprüft, nur zu einer Person des Ergebnisses; Vermerke gelten für beide Seiten
      const personDa = id => !!personVon(id) || ohnePerson.has(id);
      // Einträge einer jetzt entfallenen Person gehen mit ihr; Einträge ohne bekannte Person (ältere Fassungen) bleiben,
      // wie sie sind, soweit kein Vermerk sie trifft
      const behalten = e => !findeIn(entfallen, e.person) && !eintragWeg(e, personVon(e.person), g);
      // die weitere Prüfung der App vorab: was sie verwirft, zählt als abgewiesen
      // (eine Prüfung, die an einem kaputten Eintrag selbst scheitert, weist ihn ab)
      const pruefe = (g, e) => { try { return !!g(e); } catch (x) { return false; } };
      const vorab = (l, g) => { const ok = liste(l).filter(e => !istObjekt(e) || pruefe(g, e)); erg.abgewiesen += liste(l).length - ok.length; return ok; };
      const zr = KERN.runden.zusammenfuehren(rohListe(S.runden), vorab(d.runden, gueltig.runde),
        { art: "runde", pruefung: { ...pruefung.runde, personBekannt: personDa }, umbiegen, behalten });
      const zk = KERN.runden.zusammenfuehren(rohListe(S.rekorde), vorab(d.rekorde, gueltig.rekord),
        { art: "rekord", pruefung: { ...pruefung.rekord, personBekannt: personDa }, umbiegen, behalten });
      erg.runden = zr.neu; erg.rekorde = zk.neu + zk.ersetzt; erg.abgewiesen += zr.abgewiesen + zk.abgewiesen;

      const neu = { [S.geloescht]: g, [S.personen]: personen, [S.runden]: zr.eintraege, [S.rekorde]: zk.eintraege };
      // Wer schon da war und gelöscht wurde, ist weg; ohne Vermerk und ohne Änderung bleibt der Schlüssel unberührt
      if (roh(S.geloescht) === KEIN && !g.runden.length && !Object.keys(g.personen).length && !Object.keys(g.namen).length) delete neu[S.geloescht];

      // 4. Freigabe: die des Geräts mit dem jüngsten Stand
      if (opt.freigabe && istObjekt(d.freigabe) && typeof d.freigabeStand === "string" && d.freigabeStand > speicher.lies(S.freigabeStand, "")) {
        neu[S.freigabe] = d.freigabe; neu[S.freigabeStand] = d.freigabeStand; erg.freigabe = true;
      }

      // 5. Teile der App; Einträge gelöschter oder entfallener Personen nimmt entferne() heraus (seit 1.32.1: sonst
      //    brachte ein Abgleich die Meldungen eines gelöschten Kontos zurück)
      const bleiben = new Set(personen.flatMap(kennungen)); // wer nach dem Vermerk noch aktiv war, bleibt mit seinen Einträgen
      const wegIds = [...new Set([...entfallen.flatMap(kennungen), ...Object.keys(g.personen)])].filter(id => !bleiben.has(id));
      for (const [name, t] of Object.entries(teile)) {
        if (d[name] === undefined) continue;
        const r = t.zusammenfuehren(speicher.lies(t.schluessel, null), d[name], { umbiegen, personVon });
        neu[t.schluessel] = t.entferne && wegIds.length ? t.entferne(r.wert, wegIds) : r.wert; erg.teile[name] = r.neu || 0;
      }

      // 6. Schreiben: alles oder nichts
      erg.geschrieben = schreibeAlle(neu);
      return erg;
    }

    /** Person löschen (mit Vermerk, damit kein Abgleich sie zurückholt); false, wenn es sie nicht gibt. */
    function loeschePerson(id) {
      const p = personenAlle().find(q => kennungen(q).includes(id));
      if (!p) return false;
      const jetzt = new Date().toISOString();
      const g = vermerke();
      g.personen[p.id] = jetzt; g.namen[p.name] = jetzt;
      const ids = kennungen(p);
      const neu = { [S.geloescht]: g, [S.personen]: rohListe(S.personen).filter(q => !(istObjekt(q) && ids.includes(q.id))),
        [S.runden]: rohListe(S.runden).filter(e => !ids.includes(e?.person)), [S.rekorde]: rohListe(S.rekorde).filter(e => !ids.includes(e?.person)) };
      for (const t of Object.values(teile)) if (t.entferne) neu[t.schluessel] = t.entferne(speicher.lies(t.schluessel, null), ids);
      schreibeAlle(neu, "Der Speicher des Browsers ist voll oder gesperrt; nichts wurde gelöscht.");
      return true;
    }
    /** Runden einer Person löschen — alle oder die eines Inhalts; Person und Profil bleiben. */
    function loescheRunden(id, inhalt = null) {
      const p = personenAlle().find(q => kennungen(q).includes(id));
      const ids = p ? kennungen(p) : [id];
      const g = vermerke();
      g.runden.push({ person: p ? p.id : id, ...(p ? { name: p.name } : {}), inhalt, bis: new Date().toISOString() });
      const weg = e => istObjekt(e) && ids.includes(e.person) && (!inhalt || e.inhalt === inhalt);
      schreibeAlle({ [S.geloescht]: g, [S.runden]: rohListe(S.runden).filter(e => !weg(e)), [S.rekorde]: rohListe(S.rekorde).filter(e => !weg(e)) },
        "Der Speicher des Browsers ist voll oder gesperrt; nichts wurde gelöscht.");
    }

    /** Dateiname: <präfix>-<teil>-<JJJJ-MM-TT>.json; teil aus Buchstaben und Ziffern (Namen mit „-“ verbunden). */
    function dateiname(teil = "", datum = new Date()) {
      const t = String(teil).replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
      return `${dateiPraefix}-${t ? t + "-" : ""}${KERN.zeit.tag(datum)}.json`; // Tag des Geräts, nicht UTC
    }

    return { app, schluessel: S, sichern, einlesen, lesen: e => lesen(e, app, { altePerson }), loeschePerson, loescheRunden,
      vermerke, dateiname };
  }

  KERN.daten = Object.assign(daten, { FORMAT, VERSION, lesen, vermerkeRein, vermerkeVereinen, personWeg, eintragWeg });
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/abgleich.js ---- */
/* Kern — Abgleich zwischen Geräten über einen Ordner (Entscheide S1 a im Eulenpfad, DF3 a für alle Apps;
   docs/kern/rahmen.md 4.20). Herkunft: eulenpfad/spiele/gemeinsam/abgleich.js (LERN_Session6).
   Jedes Gerät schreibt seine Daten in einen Ordner, den die Aufsicht wählt (Netzwerkordner oder der Ordner eines
   Cloud-Dienstes), und zwar nur in seine eigene Datei <präfix><gerät>.json. Beim Abgleichen liest es die Dateien der
   anderen Geräte und führt sie zusammen (KERN.daten über die App), dann schreibt es seine eigene. So überschreiben sich
   zwei Geräte nie, auch wenn ein Cloud-Dienst verzögert abgleicht.
   Den Ordner kann der Browser nur mit File System Access (heute Chrome und Edge auf dem Computer); den Zugriff merkt er
   sich in IndexedDB. Ohne Ordner bleibt derselbe Abgleich über eine Datei (dateiSichern, dateiEinlesen).
   Browser-Schnittstellen (Ordnerwahl, IndexedDB, Ereignisse) erst beim Aufruf; Ordner und Ablage lassen sich für Tests
   ersetzen (opt.ordnerWahl, opt.ablage). */
"use strict";

(function (KERN) {
  /** Ablage für den gewählten Ordner in IndexedDB (der Browser kann den Zugriff nur dort aufbewahren). */
  function idbAblage(datenbank) {
    const tu = (art, wert) => new Promise((ok, fehler) => {
      const auf = indexedDB.open(datenbank, 1);
      auf.onupgradeneeded = () => auf.result.createObjectStore("abgleich");
      auf.onerror = () => fehler(auf.error);
      auf.onsuccess = () => {
        const tx = auf.result.transaction("abgleich", art === "lies" ? "readonly" : "readwrite");
        const st = tx.objectStore("abgleich");
        const r = art === "lies" ? st.get("ordner") : art === "schreib" ? st.put(wert, "ordner") : st.delete("ordner");
        r.onsuccess = () => ok(r.result ?? null);
        r.onerror = () => fehler(r.error);
      };
    });
    return { lies: () => tu("lies"), schreibe: h => tu("schreib", h), loesche: () => tu("loesch") };
  }
  /** Ergebnisse mehrerer Dateien zusammenzählen: Zahlen addieren, Ja/Nein verbinden; anderes fällt weg. */
  function summe(gesamt, r) {
    for (const [k, v] of Object.entries(r || {})) {
      if (typeof v === "number") gesamt[k] = (gesamt[k] || 0) + v;
      else if (typeof v === "boolean") gesamt[k] = !!gesamt[k] || v;
    }
    return gesamt;
  }
  const kennungZufall = () => {
    const c = typeof crypto !== "undefined" && crypto.getRandomValues ? crypto : null;
    const b = c ? c.getRandomValues(new Uint8Array(4)) : Array.from({ length: 4 }, () => Math.floor(Math.random() * 256));
    return [...b].map(x => x.toString(16).padStart(2, "0")).join("");
  };

  /**
   * opt:
   *   speicher      Speicher der App (Gerät „geraet“ und Stand „abgleichStand“; Schlüssel über opt.schluessel)
   *   dateiPraefix  Anfang der Dateien im Ordner („lernspiele-sync-“, „lernsteig-sync-“); .gitignore hält <app>-*.json fern
   *   datenbank     Name der IndexedDB für den gemerkten Ordner („lernspiele“, „lernsteig“, SP1 a)
   *   sichern       geraet → Objekt der eigenen Abgleich-Datei (App: KERN.daten.sichern({ art: "abgleich", geraet }))
   *   einlesen      (text, { quelle: "ordner" | "datei" }) → Ergebnis der App (Zahlen und Ja/Nein werden summiert)
   *   zaehltNicht   Felder des Ergebnisses, die nicht als „neu“ gelten (Standard ["abgewiesen"])
   *   ereignis      Name des Ereignisses, wenn etwas dazukam („lernspiele:abgeglichen“); detail = Summe
   *   geteilt       Schlüssel, nach deren Änderung die eigene Datei nachgezogen wird
   *   beiAenderung  f → registriert f(schluessel) bei jeder Speicheränderung der App
   *   ordnerWahl, ablage, kannOrdner   für Tests: Ordner wählen, Ordner merken, Fähigkeit des Browsers
   */
  function abgleich(opt = {}) {
    const { speicher } = opt;
    if (!speicher || typeof speicher.lies !== "function") throw new Error("abgleich: speicher fehlt");
    if (typeof opt.dateiPraefix !== "string" || !/^[a-z][a-z0-9-]*-$/.test(opt.dateiPraefix)) throw new Error("abgleich: dateiPraefix fehlt");
    if (typeof opt.sichern !== "function" || typeof opt.einlesen !== "function") throw new Error("abgleich: sichern und einlesen fehlen");
    const S = { geraet: "geraet", stand: "abgleichStand", ...(opt.schluessel || {}) };
    const praefix = opt.dateiPraefix;
    const zaehltNicht = new Set(opt.zaehltNicht || ["abgewiesen"]);
    const geteilt = new Set(opt.geteilt || []);
    const kannOrdner = opt.kannOrdner !== undefined ? !!opt.kannOrdner
      : typeof window !== "undefined" && typeof window.showDirectoryPicker === "function" && typeof indexedDB !== "undefined";
    let ablageObjekt = opt.ablage || null;
    const ablage = () => ablageObjekt || (ablageObjekt = idbAblage(opt.datenbank || "reihe"));
    // ordnerId: unter dieser Kennung merkt sich der Browser den zuletzt gewählten Ort der Ordnerwahl
    const ordnerWahl = opt.ordnerWahl || (() => window.showDirectoryPicker({ id: opt.ordnerId || `${praefix}ordner`, mode: "readwrite" }));

    /** Dieses Gerät: zufällige Kennung und ein Name, den die Aufsicht vergibt. */
    function geraet() {
      let g = speicher.lies(S.geraet, null);
      if (!g || !g.id) { g = { id: kennungZufall(), name: "" }; speicher.schreibe(S.geraet, g); }
      return g;
    }
    const benenne = name => speicher.schreibe(S.geraet, { ...geraet(), name: String(name).trim().slice(0, 30) });
    const eigeneDatei = () => `${praefix}${geraet().id}.json`;
    const dateiInhalt = () => JSON.stringify(opt.sichern(geraet()));
    const istNeu = r => Object.entries(r || {}).some(([k, v]) => !zaehltNicht.has(k) && (v === true || (typeof v === "number" && v > 0)));

    const ordner = async () => (kannOrdner ? ablage().lies().catch(() => null) : null);
    /** Darf die Seite in den Ordner schreiben? fragen = der Browser darf nachfragen (nur nach einem Tippen). */
    async function erlaubt(h, fragen) {
      const art = { mode: "readwrite" };
      if ((await h.queryPermission(art)) === "granted") return true;
      return !!fragen && (await h.requestPermission(art)) === "granted";
    }
    async function schreibeEigene(h) {
      const w = await (await h.getFileHandle(eigeneDatei(), { create: true })).createWritable();
      await w.write(dateiInhalt());
      await w.close();
    }

    let still = false; // während des Zusammenführens: die eigenen Schreibvorgänge lösen kein Schreiben aus
    let laeuft = null;
    /**
     * Jetzt abgleichen: die Dateien der anderen Geräte lesen und zusammenführen, dann die eigene schreiben.
     * Gibt { status: "ok" | "kein-ordner" | "keine-erlaubnis" | "fehler", neu (Summe), geraete } zurück; kam etwas dazu,
     * meldet opt.ereignis es der Seite. Ein zweiter Aufruf während eines laufenden wartet auf diesen.
     */
    function jetzt(fragen = false) {
      if (!laeuft) laeuft = abgleichen(fragen).finally(() => { laeuft = null; });
      return laeuft;
    }
    async function abgleichen(fragen) {
      const h = await ordner();
      if (!h) return { status: "kein-ordner" };
      try {
        if (!(await erlaubt(h, fragen))) return { status: "keine-erlaubnis" };
        const neu = {};
        const geraete = [];
        still = true;
        try {
          for await (const [name, eintrag] of h.entries()) {
            if (eintrag.kind !== "file" || !name.startsWith(praefix) || !name.endsWith(".json") || name === eigeneDatei()) continue;
            try {
              const text = await (await eintrag.getFile()).text();
              const r = opt.einlesen(text, { quelle: "ordner" });
              summe(neu, r);
              const kopf = (() => { try { const d = JSON.parse(text); return d && typeof d === "object" ? d : {}; } catch (e) { return {}; } })();
              geraete.push({ id: kopf.geraet?.id, name: kopf.geraet?.name || "", gesichert: kopf.gesichert });
            } catch (e) { geraete.push({ datei: name, fehler: true, meldung: String(e?.message || e) }); }
          }
        } finally { still = false; }
        await schreibeEigene(h);
        speicher.schreibe(S.stand, { zuletzt: new Date().toISOString(), ordner: h.name, geraete });
        if (istNeu(neu) && opt.ereignis && typeof dispatchEvent === "function" && typeof CustomEvent === "function") {
          dispatchEvent(new CustomEvent(opt.ereignis, { detail: neu }));
        }
        return { status: "ok", neu, geraete };
      } catch (fehler) {
        return { status: "fehler", fehler: String(fehler?.message || fehler) };
      }
    }
    /** Ordner wählen (nur nach einem Tippen) und gleich abgleichen. */
    async function waehlen() {
      const h = await ordnerWahl();
      await ablage().schreibe(h);
      return jetzt(true);
    }
    async function vergessen() {
      if (kannOrdner) await ablage().loesche().catch(() => null);
      speicher.schreibe(S.stand, null);
    }

    // Nach jeder Änderung die eigene Datei nachziehen (gesammelt), ohne zu fragen: Fehlt die Erlaubnis, holt der nächste
    // Abgleich mit einem Tippen alles nach.
    let geplant = null;
    async function eigeneNachziehen() {
      geplant = null;
      const h = await ordner();
      if (h && (await h.queryPermission({ mode: "readwrite" }).catch(() => "denied")) === "granted") await schreibeEigene(h).catch(() => null);
    }
    /** Selbsttätig abgleichen: beim Start, wenn die Seite wieder sichtbar wird, und nach Änderungen geteilter Daten. */
    function starte() {
      if (!kannOrdner) return false;
      if (typeof opt.beiAenderung === "function") opt.beiAenderung(schluessel => {
        if (still || !geteilt.has(schluessel)) return;
        clearTimeout(geplant);
        geplant = setTimeout(eigeneNachziehen, 1500);
      });
      if (typeof addEventListener === "function") {
        addEventListener("pagehide", () => { if (geplant) { clearTimeout(geplant); eigeneNachziehen(); } });
        addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") jetzt(false); });
      }
      jetzt(false);
      return true;
    }

    /** Abgleich ohne Ordner: dieselben Daten als Datei, die man auf dem anderen Gerät einliest. */
    function dateiSichern() {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([dateiInhalt()], { type: "application/json" }));
      a.download = eigeneDatei();
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
    /** Gesicherte oder Abgleich-Datei einlesen und zusammenführen; Fehler mit einem Satz. */
    async function dateiEinlesen(datei) { return opt.einlesen(await datei.text(), { quelle: "datei" }); }

    const stand = () => speicher.lies(S.stand, null);
    return { kannOrdner, geraet, benenne, eigeneDatei, ordner, jetzt, waehlen, vergessen, starte, dateiSichern, dateiEinlesen,
      dateiInhalt, stand };
  }

  KERN.abgleich = Object.assign(abgleich, { summe });
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/anmeldung.js ---- */
/* Kern — Anmeldung und Sitzung im Tab (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.11).
   Herkunft: eulenpfad/spiele/gemeinsam/spiel.js (Anmeldung L1 a: gewählte Person, Aufsicht nur im Tab) und
   lernsteig/gemeinsam/konten.js (aktives Konto, mit PIN nur im Tab; Aufsicht nur im Tab).

   Ein Platz hält, wer an diesem Gerät angemeldet ist. Gemerkt wird die Kennung der gewählten Person im Speicher der App
   (localStorage, bleibt über das Schliessen des Browsers). Wer im Tab angemeldet sein muss (Standard: eine Aufsicht oder
   wer eine PIN hat), gilt nur, solange derselbe Browser-Tab offen ist (sessionStorage): Schliesst man ihn, ist die Person
   abgemeldet, und wer danach das Gerät nimmt, erbt ihre Rechte nicht. Die PIN prüft KERN.geheimnis.
   Grenze (DS1 a): schützt vor Versehen und Neugier am Gerät, nicht vor Entwicklerwerkzeugen. */
"use strict";

(function (KERN) {
  // Über den globalen Namen (wie speicher.js): Ersatz-DOMs legen sessionStorage als Variable an; der Zugriff kann werfen.
  const tabAblage = () => { try { return typeof sessionStorage !== "undefined" ? sessionStorage : null; } catch (e) { return null; } };

  /** Muss die Person im Tab angemeldet sein? Standard für alle Apps: eine Aufsicht oder wer eine PIN hat. */
  const standardImTab = p => !!p && (p.rolle === "aufsicht" || !!p.pin);

  /**
   * Ein Anmelde-Platz.
   * opt.speicher  KERN.speicher der App (sein Präfix gilt auch für den Tab-Schlüssel)
   * opt.gewaehlt  Schlüssel der gewählten Person im Speicher, oder null: nur im Tab (nichts wird über den Tab hinaus gemerkt)
   * opt.tab       Schlüssel im Tab (ohne Präfix), z. B. "aufsicht"
   * opt.finde     Wert → Person oder null (Kennung; ältere Stände der App auch über den Namen)
   * opt.imTab     Person → muss sie im Tab angemeldet sein? (Standard: Aufsicht oder mit PIN)
   * opt.gast      { tab: "gast", erlaubt: () → bool } — Gast (Entscheid C2 a): nur in diesem Tab, ohne Person; die App
   *               speichert für ihn nichts. Ohne opt.gast gibt es keinen Gast.
   * Liefert { aktiv, waehle, anmelden, abmelden, alsGast, istGast, imTab }.
   */
  function platz(opt) {
    const { speicher, gewaehlt = null, tab, gast = null } = opt || {};
    if (!speicher || typeof speicher.lies !== "function") throw new Error("anmeldung: speicher fehlt");
    if (typeof tab !== "string" || !tab) throw new Error("anmeldung: tab fehlt");
    if (typeof opt.finde !== "function") throw new Error("anmeldung: finde fehlt");
    // Eine gesperrte Person (DF4 a: auf einem anderen Gerät mit PIN geschützt, hier noch nicht freigeschaltet) gibt es
    // für die Anmeldung nicht: weder wählen noch anmelden, und eine frühere Anmeldung gilt nicht mehr.
    const finde = w => { const p = opt.finde(w); return p && KERN.person && KERN.person.gesperrt(p) ? null : p; };
    if (gast && (typeof gast.tab !== "string" || !gast.tab || gast.tab === tab)) throw new Error("anmeldung: gast.tab fehlt oder ist der Tab der Person");
    const imTab = typeof opt.imTab === "function" ? opt.imTab : standardImTab;
    const tabSchluessel = speicher.praefix + tab;
    const gastSchluessel = gast ? speicher.praefix + gast.tab : null;
    const gastErlaubt = () => !!gast && (typeof gast.erlaubt !== "function" || !!gast.erlaubt());

    const tabWert = s => { try { return tabAblage()?.getItem(s) ?? null; } catch (e) { return null; } };
    function tabWertSetze(s, w) {
      try { const a = tabAblage(); if (!a) return false; if (w) a.setItem(s, w); else a.removeItem(s); return true; }
      catch (e) { return false; } // ohne sessionStorage: niemand ist im Tab angemeldet, auch kein Gast
    }
    const tabLies = () => tabWert(tabSchluessel);
    const tabSetze = id => { tabWertSetze(tabSchluessel, id); if (gastSchluessel) tabWertSetze(gastSchluessel, null); };
    /** Steht diese Person im Tab? Auch ein älterer Stand mit ihrem Namen gilt (finde löst ihn auf). */
    const imTabAngemeldet = p => { const w = tabLies(); return !!w && (w === p.id || finde(w)?.id === p.id); };

    /**
     * Die angemeldete Person oder null. Die Anmeldung dieses Tabs geht vor der gewählten Person des Geräts: Meldet sich
     * in einem zweiten Tab eine Aufsicht an, bleibt der Jugendliche mit PIN im ersten Tab angemeldet (vor kern 1.14.1
     * war er dort abgemeldet, gefunden mit den Seitentests im Ersatz-DOM, LERN_Session17).
     */
    function aktiv() {
      const imDiesemTab = finde(tabLies());
      if (imDiesemTab && (gewaehlt === null || imTab(imDiesemTab))) return imDiesemTab;
      if (gewaehlt === null) return null;
      const p = finde(speicher.lies(gewaehlt, null));
      if (!p) return null;
      return imTab(p) ? null : p; // im Tab angemeldet wäre sie oben schon gefunden
    }
    /** Person ohne PIN wählen (merken, Tab leeren); false, wenn sie im Tab angemeldet sein muss oder unbekannt ist. */
    function waehle(wert) {
      const p = finde(wert);
      if (!p || imTab(p) || gewaehlt === null) return false;
      speicher.schreibe(gewaehlt, p.id);
      tabSetze(null);
      return true;
    }
    /**
     * Anmelden; mit PIN muss sie stimmen. Wer im Tab angemeldet sein muss, braucht eine gesetzte PIN.
     * Gibt die Person zurück oder null (unbekannt, PIN falsch oder fehlt).
     */
    async function anmelden(wert, pin) {
      const p = finde(wert);
      if (!p) return null;
      if (p.pin) { if (!(await KERN.geheimnis.pinStimmt(pin, p.pin))) return null; }
      else if (imTab(p)) return null;
      if (gewaehlt !== null) speicher.schreibe(gewaehlt, p.id);
      tabSetze(imTab(p) ? p.id : null);
      return p;
    }
    /** Abmelden: nichts mehr gewählt, Tab leer, kein Gast. */
    function abmelden() {
      if (gewaehlt !== null) speicher.schreibe(gewaehlt, null);
      tabSetze(null);
    }
    /** Als Gast weiter (nur in diesem Tab): meldet eine Person ab. false, wenn die App keinen Gast erlaubt. */
    function alsGast() {
      if (!gastErlaubt()) return false;
      abmelden();
      return tabWertSetze(gastSchluessel, "ja");
    }
    /** Ist in diesem Tab der Gast unterwegs (und noch erlaubt)? */
    const istGast = () => gastErlaubt() && tabWert(gastSchluessel) === "ja" && !aktiv();
    return { aktiv, waehle, anmelden, abmelden, alsGast, istGast, imTab };
  }

  KERN.anmeldung = { platz, standardImTab };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/entwicklung.js ---- */
/* Kern — Entwickler-Modus (Entscheide E1 a, E2 a, E3 a; Plan docs/plan_angleich_reihe.md B, C6; docs/kern/rahmen.md 4.12).
   Herkunft: eulenpfad/spiele/gemeinsam/entwicklung.js (LERN_Session6).

   Die Aufsicht schaltet ihn mit dem Entwickler-Schlüssel frei; danach blendet ein eigener Schalter die Zusätze ein.
   Dauerhaft geschrieben wird nur über den Entwickler-Server (tools/entwickler_server.py) im lokalen Repo: Prüfstand und
   Bemerkungen der App, die `app` nennt. Ohne Server melden die Aufrufe, dass er fehlt.
   Ein Schlüssel für das ganze Repo: im Klartext nur in entwickler.key (von Git ausgeschlossen), hier sein Hash
   SHA-256(„eulenpfad-entwickler:<Schlüssel>“) — dieselbe Rechnung wie KERN.geheimnis.hash(schlüssel, SALZ).
   Neu gesetzt von: python tools/entwickler_server.py --neuer-schluessel (trägt den Hash hier ein und verteilt). */
"use strict";

(function (KERN) {
  const SCHLUESSEL_HASH = "a1fb5dbb5d54c6de3acc1d372cdef564fedf87e2e349aa1bc4bbddf3be702035";
  const SALZ = "eulenpfad-entwickler"; // seit LERN_Session6; bleibt, damit der bestehende Schlüssel gilt
  /**
   * Öffentlicher Schlüssel des Servers der Entwicklung (Plan C12, NS2 a): SPKI, Base64, ECDSA P-256. Eingetragen von
   * python tools/entwickler_server.py --neues-schluesselpaar; leer = noch kein Paar (dann ist kein Server „echt“).
   */
  const SERVER_SCHLUESSEL = "";
  const UNTERSCHRIFT_ZWECK = "lernspiele-entwicklung"; // wie tools/entwickler_server.py
  const b64 = t => Uint8Array.from(atob(t), c => c.charCodeAt(0));
  /** Zufallszahl als Hex (16 Byte) für die Unterschrift. */
  const zufallHex = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), x => x.toString(16).padStart(2, "0")).join("");
  /**
   * Hat der Server die Zufallszahl mit dem Schlüssel der Entwicklung unterschrieben? st: Antwort von /status (mit
   * unterschrift und server). schluessel: SPKI Base64. false ohne Schlüssel, ohne Unterschrift oder ohne WebCrypto.
   */
  async function unterschriftEcht(st, zufall, schluessel) {
    try {
      if (!schluessel || !st || !st.unterschrift || !globalThis.crypto || !crypto.subtle) return false;
      const k = await crypto.subtle.importKey("spki", b64(schluessel), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
      const text = new TextEncoder().encode(`${UNTERSCHRIFT_ZWECK}|${zufall}|${st.server || ""}`);
      return await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, k, b64(st.unterschrift), text);
    } catch (e) { return false; }
  }
  /**
   * Protokoll des Austauschs mit dem Server (Plan C12, NS3 a): eine ganze Zahl, die genau dann steigt, wenn sich Anfragen
   * oder Antworten so ändern, dass ein älterer Server oder eine ältere App sie falsch läse. Der Server nennt unter
   * /entwicklung/status die Protokolle, die er versteht ({ protokoll: [von, bis] }); ein Server ohne die Angabe (vor
   * LERN_Session27) versteht 1. Jede Anfrage trägt das Protokoll und die Versionen von App und Kern.
   */
  const PROTOKOLL = 1;
  /** Versteht der Server dieses Protokoll? st: Antwort von /entwicklung/status. */
  const verstehtProtokoll = st => {
    const [von, bis] = Array.isArray(st?.protokoll) && st.protokoll.length === 2 ? st.protokoll : [1, 1];
    return PROTOKOLL >= von && PROTOKOLL <= bis;
  };

  /**
   * Entwickler-Modus einer App.
   * opt.app        "eulenpfad" | "lernsteig" | … — der Server schreibt in Prüfstand und Bemerkungen dieser App
   * opt.speicher   KERN.speicher der App (Zustand unter „entwickler“: { schluessel, an, name }, nur auf diesem Gerät)
   * opt.aufsicht   () → ist gerade eine Aufsicht angemeldet? (nur sie sieht die Zusätze)
   * opt.name       () → Name für „von“, wenn keiner gesetzt ist (die angemeldete Aufsicht)
   * opt.pruefstand Objekt des Prüfstands der App (z. B. PRUEFSTAND); nach jeder Änderung auf den Stand des Servers gebracht
   * opt.arten      Bereiche des Prüfstands (Eulenpfad ["spiele", "listen"], Lernsteig ["uebungen", "listen"])
   * opt.melde      (text) → Meldung an die Person (die App zeigt sie; Standard: nichts)
   * opt.start      Pfad der App für die Meldung „Server fehlt“ (z. B. "eulenpfad/")
   * opt.adresse    () → Adresse des Entwickler-Servers, "" = dieselbe Seite (Standard; C11-3 a: nur localhost und
   *                127.0.0.1, siehe entwicklung.adresseGueltig). Der Server antwortet dafür mit CORS.
   * opt.version    () → Version der App (APP_VERSION.version aus <app>/version.js, NS3 a); geht mit jeder Anfrage mit
   * opt.serverSchluessel  öffentlicher Schlüssel, gegen den die Unterschrift geprüft wird (Standard SERVER_SCHLUESSEL der
   *                Entwicklung; später für einen Abgleich-Server mit dem Schlüssel seiner Aufsicht, docs/konzept_gruppen.md 5c)
   */
  function entwicklung(opt) {
    const o = opt || {};
    if (typeof o.app !== "string" || !/^[a-z]+$/.test(o.app)) throw new Error("entwicklung: app fehlt");
    if (!o.speicher || typeof o.speicher.lies !== "function") throw new Error("entwicklung: speicher fehlt");
    if (typeof o.aufsicht !== "function") throw new Error("entwicklung: aufsicht fehlt");
    const arten = Array.isArray(o.arten) && o.arten.length ? o.arten : ["listen"];
    const melde = typeof o.melde === "function" ? o.melde : () => {};
    /** Adresse des Servers ohne Schrägstrich am Ende; "" = dieselbe Seite. Eine ungültige Angabe gilt als "". */
    const basis = () => adresseGueltig(typeof o.adresse === "function" ? o.adresse() : "") || "";
    const SERVER_FEHLT_HIER = "Entwickler-Server nicht gefunden.\n\nDer Entwickler-Modus funktioniert nur im lokalen Repo mit laufendem Server:\n"
      + `python tools/entwickler_server.py\ndanach http://localhost:8765/${o.start || ""} öffnen.`;
    const serverFehltBei = a => (!a ? SERVER_FEHLT_HIER
      : /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(a)
        ? `Entwickler-Server unter ${a} nicht erreichbar.\n\nLäuft python tools/entwickler_server.py auf diesem Gerät mit diesem Port? `
          + "Die Adresse steht unter Verwaltung → Einstellungen."
        : `Meldungsserver unter ${a} nicht erreichbar.\n\nStimmt die Adresse (Verwaltung → Einstellungen)? Ist das Gerät mit dem `
          + "Internet verbunden? Bis er wieder erreichbar ist, gehen Meldungen per E-Mail oder als Text.");
    const serverFehlt = () => serverFehltBei(basis());
    const FREMDER_SERVER = "Hier antwortet ein anderer Server ohne Entwickler-Funktionen (z. B. ein noch laufendes "
      + "python -m http.server auf demselben Port).\n\nDiesen beenden, dann python tools/entwickler_server.py starten "
      + "und die Seite mit Strg+F5 neu laden.";
    let fremd = false; // Auf der Adresse läuft ein Server, aber nicht der Entwickler-Server
    let unpassend = null; // Antwort eines Entwickler-Servers, der dieses Protokoll nicht versteht
    /** Versionen dieser Seite, mit jeder Anfrage an den Server (NS3 a). */
    const versionen = () => ({ app: (typeof o.version === "function" ? o.version() : "") || "", kern: KERN.version || "",
      protokoll: PROTOKOLL });
    const unpassendText = (st, z) => {
      const [von, bis] = Array.isArray(st?.protokoll) ? st.protokoll : [1, 1];
      const v = versionen();
      return `Der Entwickler-Server${st?.server ? ` ${st.server}` : ""} unter ${z} versteht Protokoll ${von === bis ? von : `${von}–${bis}`}, `
        + `diese Seite spricht Protokoll ${PROTOKOLL} (${o.app} ${v.app || "ohne Version"}, Kern ${v.kern || "?"}).\n\n`
        + "App und Server auf denselben Stand bringen (neu laden, Server aktualisieren); bis dahin gehen Meldungen per E-Mail "
        + "oder als Text.";
    };
    const unechtText = (st, z) => `Der Server unter ${z} weist sich nicht als Server der Entwicklung aus (${st?.unterschrift
      ? "Unterschrift passt nicht" : "keine Unterschrift"}). An ihn geht nichts. Stimmt die Adresse? Ist es der richtige Server?`;
    const serverMeldung = () => (unecht ? unechtText(unecht, ziel(basis())) : unpassend ? unpassendText(unpassend, ziel(basis()))
      : fremd ? FREMDER_SERVER : serverFehlt());

    const zustand = () => ({ schluessel: null, an: false, name: "", ...(o.speicher.lies("entwickler", null) || {}) });
    const speichere = daten => o.speicher.schreibe("entwickler", { ...zustand(), ...daten });
    const freigeschaltet = () => !!zustand().schluessel;
    /** Sind die Entwickler-Zusätze sichtbar? Nur für die angemeldete Aufsicht, freigeschaltet und eingeschaltet. */
    const aktiv = () => !!o.aufsicht() && freigeschaltet() && zustand().an;
    const name = () => zustand().name || (typeof o.name === "function" ? o.name() : "") || "";

    /**
     * Schlüssel prüfen und auf diesem Gerät merken: der Schlüssel der Entwicklung gegen den Hash (ohne Server), der einer
     * zugelassenen Aufsicht beim Server (Plan C12, ES1 a, ES2 a). true bei Erfolg, false wenn er nicht passt, null wenn
     * der Server nicht erreichbar ist (dann schon gemeldet).
     */
    async function freischalten(schluessel) {
      const s = String(schluessel ?? "").trim();
      if (!s) return false;
      if ((await KERN.geheimnis.hash(s, SALZ)) === SCHLUESSEL_HASH) {
        speichere({ schluessel: s, an: true, rolle: "entwicklung" });
        return true;
      }
      if (!(await server())) { melde(serverMeldung()); return null; }
      try {
        const r = await fetch(basis() + "/entwicklung/freischalten", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schluessel: s, app: o.app, versionen: versionen(), protokoll: PROTOKOLL }) });
        const a = await r.json();
        if (!r.ok || !a.ok) return false;
        speichere({ schluessel: s, an: true, rolle: a.rolle === "aufsicht" ? "aufsicht" : "entwicklung", name: a.name || "" });
        return true;
      } catch (e) {
        serverDa = null;
        melde(serverMeldung());
        return null;
      }
    }
    /** „entwicklung“, „aufsicht“ (zugelassen, reicht Prüfvermerke nur ein) oder null; ältere Stände ohne Rolle: Entwicklung. */
    const rolle = () => (freigeschaltet() ? (zustand().rolle === "aufsicht" ? "aufsicht" : "entwicklung") : null);
    const sperren = () => o.speicher.schreibe("entwickler", null);
    const setzeAn = an => speichere({ an: !!an });
    const benenne = n => speichere({ name: String(n ?? "").trim().slice(0, 40) });

    // ----- Entwickler-Server -----
    let serverDa = null, serverBasis = null; // gemerkt je Adresse
    let unecht = null; // Antwort eines Servers im Netz, der sich nicht mit dem Schlüssel der Entwicklung ausweist (NS2 a)
    const lokal = () => typeof location !== "undefined" && String(location.protocol).startsWith("http")
      && ["localhost", "127.0.0.1"].includes(location.hostname);
    const schluesselDesServers = () => (typeof o.serverSchluessel === "string" ? o.serverSchluessel : SERVER_SCHLUESSEL);
    /** Liegt die Adresse im Netz (nicht dieses Gerät)? Dann muss der Server unterschreiben (NS2 a). */
    const imNetz = a => !!a && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(a);
    /** Status einer Adresse mit Zufallszahl abfragen: { r, st, echt } (st und echt nur bei lesbarer Antwort). */
    async function frageStatus(a) {
      const zufall = zufallHex();
      const r = await fetch(`${a}/entwicklung/status?zufall=${zufall}`, { cache: "no-store" });
      if (!r.ok) return { r, st: null, echt: false };
      const st = await r.json();
      return { r, st, echt: await unterschriftEcht(st, zufall, schluesselDesServers()) };
    }
    /**
     * Läuft ein Entwickler-Server, der dieses Protokoll versteht — im Netz zudem mit gültiger Unterschrift (NS2 a)?
     * { ok, schluessel, server?, protokoll?, echt } oder null (dann sagt serverMeldung warum). Erfolg wird gemerkt.
     */
    async function server() {
      if (serverDa && serverBasis === basis()) return serverDa;
      serverDa = null; unpassend = null; unecht = null; serverBasis = basis();
      try {
        const { r, st, echt } = await frageStatus(basis());
        fremd = !r.ok && (!!basis() || lokal());
        if (st) {
          if (!verstehtProtokoll(st)) unpassend = st;
          else if (imNetz(basis()) && !echt) unecht = st;
          else serverDa = { ...st, echt };
        }
      } catch (e) { /* kein Server */ }
      return serverDa;
    }
    /** Volle Adresse für die Anzeige: "" = diese Seite, mit ihrem Ursprung, wenn sie über http läuft. */
    const ziel = a => (a || (typeof location !== "undefined" && String(location.protocol).startsWith("http")
      ? `${location.origin} (diese Seite)` : "diese Seite"));
    /**
     * Verbindung zu einer Adresse prüfen, ohne sie zu speichern und ohne Gemerktes (C11-3 a; LERN_Session27: „Verbindung
     * prüfen“ prüfte die gespeicherte Adresse, nicht die im Feld, und sagte nicht, welche). text wie im Feld
     * ("" = diese Seite), ohne Angabe die eingestellte. → { ok, fremd, ungueltig, adresse, ziel, text }; adresse ist die
     * bereinigte Adresse (null, wenn nicht erlaubt), ziel die angezeigte, text die fertige Meldung mit ziel.
     */
    async function verbindungPruefen(text) {
      const roh = text === undefined ? basis() : String(text ?? "").trim();
      const a = adresseGueltig(roh);
      if (a === null) {
        return { ok: false, fremd: false, ungueltig: true, adresse: null, ziel: roh,
          text: `Nicht geprüft: ${roh} ist nicht erlaubt. ${ADRESSE_REGEL}` };
      }
      let ok = false, andere = false, st = null, echt = false;
      try {
        const f = await frageStatus(a);
        andere = !f.r.ok && (!!a || lokal());
        if (f.st) { st = f.st; ok = true; echt = f.echt; }
      } catch (e) { /* kein Server oder keine lesbare Antwort */ }
      const z = ziel(a);
      const protokollPasst = ok && verstehtProtokoll(st);
      const passt = protokollPasst && (echt || !imNetz(a));
      const zusatz = echt ? ", Unterschrift der Entwicklung geprüft" : st?.unterschrift ? ", Unterschrift passt nicht" : ", ohne Unterschrift";
      const meldung = passt ? `✓ Entwickler-Server${st.server ? ` ${st.server}` : ""} erreichbar: ${z}, Protokoll ${PROTOKOLL}${zusatz}.`
        : protokollPasst ? unechtText(st, z)
          : ok ? unpassendText(st, z)
            : andere ? FREMDER_SERVER.replace(/^Hier/, `Unter ${z}`)
              : a ? serverFehltBei(a) : `Kein Entwickler-Server unter ${z}.\n\n${SERVER_FEHLT_HIER}`;
      return { ok: passt, fremd: andere, unpassend: ok && !protokollPasst, unecht: protokollPasst && !passt, echt, ungueltig: false,
        adresse: a, ziel: z, server: st?.server || "", protokoll: st?.protokoll || null, text: meldung };
    }
    /** An den Server schicken (mit App und Schlüssel); meldet selbst, was schiefging, und gibt dann null zurück. */
    async function sende(pfad, daten) {
      if (!(await server())) { melde(serverMeldung()); return null; }
      try {
        const r = await fetch(basis() + pfad, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...daten, app: o.app, versionen: versionen(), protokoll: PROTOKOLL, schluessel: zustand().schluessel }) });
        const antwort = await r.json();
        if (!r.ok) { melde(`Entwickler-Server: ${antwort.fehler || r.status}`); return null; }
        return antwort;
      } catch (e) {
        serverDa = null;
        melde(serverMeldung());
        return null;
      }
    }
    /** Prüfstand der App auf den Stand des Servers bringen (dasselbe Objekt, damit die Freigabe es sieht). */
    function uebernimm(stand) {
      if (!o.pruefstand || !stand) return;
      for (const a of arten) o.pruefstand[a] = stand[a] || {};
    }

    /**
     * Antwort auf einen Prüfvermerk übernehmen. Eine zugelassene Aufsicht reicht nur ein (ES3 a): Der Server antwortet
     * { eingereicht, nr, stand } mit dem unveränderten Prüfstand, und die Person erfährt, dass es noch nicht wirkt.
     */
    function nachVermerk(antwort) {
      if (!antwort) return false;
      if (antwort.eingereicht) {
        if (antwort.stand) uebernimm(antwort.stand); // ein Server im Netz kennt den Prüfstand nicht und schickt keinen
        melde(`Eingereicht (Nr. ${antwort.nr}). Es wirkt, sobald die Entwicklung es übernimmt — bis dahin bleibt es wie bisher.`);
        return true;
      }
      uebernimm(antwort);
      return true;
    }
    /** Inhalt als angesehen bzw. Liste als geprüft setzen (geprueft false: aufheben). art aus opt.arten. */
    async function setzeGeprueft(art, id, geprueft) {
      if (!arten.includes(art)) throw new Error(`entwicklung: unbekannte Art ${art}`);
      return nachVermerk(await sende("/entwicklung/pruefstand", { art, id, geprueft, von: name() }));
    }
    /** Haken je Eintrag einer Liste (Prüfansicht, LP2 a): { liste, setzen, entfernen, komplett, hash }. */
    async function setzeEintraege(daten) {
      return nachVermerk(await sende("/entwicklung/eintraege", { ...daten, von: name() }));
    }
    /**
     * mailto-Link „Entwicklermodus anfordern“ (ES4 a, ES5-S a) an die Adresse der Entwicklung, mit Vorlage; null ohne
     * Adresse. name: angemeldete Aufsicht, titel: Name der App („Eulenpfad“). Keine Angaben über Kinder.
     */
    function anforderungLink(an, { name: wer = "", titel = o.app } = {}) {
      if (!an) return null;
      const v = versionen();
      const text = [
        "Guten Tag", "",
        "Ich möchte im Entwicklermodus Spiele und Inhaltslisten prüfen und freigeben.", "",
        `Name: ${wer}`,
        "Ich bin: Lehrperson / Elternteil / anderes: ____",
        "Schule oder Organisation, oder woher wir uns kennen: ____",
        "Was ich prüfen möchte: ____",
        `App: ${titel}${v.app ? ` ${v.app}` : ""}`, "",
        "Der Schlüssel wird aus meinem Namen und dieser E-Mail-Adresse erzeugt und nur an diese Adresse geschickt.", "",
        "Freundliche Grüsse", wer,
      ].join("\n");
      return `mailto:${an}?subject=${encodeURIComponent("Anforderung Entwicklermodus")}&body=${encodeURIComponent(text)}`;
    }
    /** Status einer Bemerkung setzen (z. B. „erledigt …“). */
    const bemerkungStatus = async (nr, status) => !!(await sende("/entwicklung/bemerkung-status", { nr, status }));
    /** Bemerkung für die Entwicklung: { text, spiel?|inhalt?, stufe?, liste?, eintrag?, schluessel?, aufgabe? }. */
    const bemerkung = daten => sende("/entwicklung/bemerkung",
      { von: name(), seite: typeof location !== "undefined" ? location.pathname : "", ...daten });
    /**
     * Bestätigte Meldung an den Server, ohne Entwickler-Schlüssel (Plan C12, NS1 a: Meldungen gehen für alle). Nur an
     * einen Server, den server() annimmt (im Netz mit gültiger Unterschrift). { nr } oder null (dann gemeldet).
     */
    async function meldung(daten) {
      if (!(await server())) { melde(serverMeldung()); return null; }
      try {
        const r = await fetch(basis() + "/entwicklung/meldung", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...daten, app: o.app, versionen: versionen(), protokoll: PROTOKOLL }) });
        const antwort = await r.json();
        if (!r.ok) { melde(`Server: ${antwort.fehler || r.status}`); return null; }
        return antwort;
      } catch (e) {
        serverDa = null;
        melde(serverMeldung());
        return null;
      }
    }
    /** Alle Bemerkungen der App (über den Server) oder null. */
    async function bemerkungen() {
      if (!(await server())) return null;
      try { return await (await fetch(`${basis()}/entwicklung/bemerkungen?app=${o.app}`, { cache: "no-store" })).json(); } catch (e) { return null; }
    }

    return { app: o.app, adresse: basis, freigeschaltet, aktiv, freischalten, rolle, anforderungLink, sperren, setzeAn, benenne, name, zustand, server, serverMeldung, verbindungPruefen, versionen,
      /** Antwortet auf der Adresse ein anderer Server (nach server())? */ fremd: () => fremd,
      setzeGeprueft, setzeEintraege, bemerkung, meldung, bemerkungen, bemerkungStatus };
  }
  /** Was als Adresse erlaubt ist, für Meldungen an die Person (eine Stelle für Kern und Apps). */
  const ADRESSE_REGEL = "Erlaubt ist ein Entwickler-Server auf diesem Gerät (http://localhost:<Port> oder http://127.0.0.1:<Port>) "
    + "oder ein Server im Netz über https (https://name.beispiel.ch), leer für diese Seite.";
  /**
   * Adresse eines Entwickler-Servers prüfen: "" (dieselbe Seite), http(s)://localhost bzw. 127.0.0.1 mit Port (C11-3 a)
   * oder — seit Kern 1.39.0, Plan C12 NS1 a — ein Name im Netz nur über https (https://name.beispiel.ch[:Port]); dort
   * nimmt server() nur einen Server mit gültiger Unterschrift der Entwicklung an (NS2 a). Ergebnis ohne Schrägstrich
   * am Ende, oder null, wenn die Adresse nicht erlaubt ist (http im Netz, IP-Adressen im Netz, Pfade, andere Protokolle).
   */
  function adresseGueltig(text) {
    const t = String(text ?? "").trim();
    if (!t) return "";
    const port = p => !p || (Number(p) >= 1 && Number(p) <= 65535);
    const lokal = t.match(/^(https?):\/\/(localhost|127\.0\.0\.1)(?::(\d{1,5}))?\/?$/i);
    if (lokal) return port(lokal[3]) ? `${lokal[1].toLowerCase()}://${lokal[2].toLowerCase()}${lokal[3] ? `:${Number(lokal[3])}` : ""}` : null;
    const netz = t.match(/^https:\/\/((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63})(?::(\d{1,5}))?\/?$/i);
    if (!netz || !port(netz[2])) return null;
    return `https://${netz[1].toLowerCase()}${netz[2] ? `:${Number(netz[2])}` : ""}`;
  }
  entwicklung.adresseGueltig = adresseGueltig;
  entwicklung.ADRESSE_REGEL = ADRESSE_REGEL;
  entwicklung.PROTOKOLL = PROTOKOLL;
  entwicklung.SERVER_SCHLUESSEL = SERVER_SCHLUESSEL;
  entwicklung.unterschriftEcht = unterschriftEcht;
  entwicklung.UNTERSCHRIFT_ZWECK = UNTERSCHRIFT_ZWECK;
  entwicklung.verstehtProtokoll = verstehtProtokoll;
  entwicklung.SALZ = SALZ;
  entwicklung.SCHLUESSEL_HASH = SCHLUESSEL_HASH;

  KERN.entwicklung = entwicklung;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/meldungen.js ---- */
/* Kern — Fehlermeldungen und Anregungen an die Entwicklung (Plan C11, Entscheide C11-1 a, C11-2 a, C11-3 a;
   docs/kern/rahmen.md 4.28). Herkunft: eulenpfad/spiele/gemeinsam/spiel.js (LERN_Session9, M1 a; Anregungen
   LERN_Session11; Korrekturen LP4 a).

   Speicher <app>:meldungen = [{ id, typ?, name, person?, zeit, stand, status, verlauf: [{ zeit, status, von, notiz? }],
   <inhalt>, stufe, klasse?, aufgabeNr, aufgabe, loesung, eingabe, ergebnis, art, text, antwort?, gelesen, … }].
   Was die App verschieden macht (Wort und Feld für den Inhalt, Stufe im Text, wer meldet, Zusatzzeilen, Arten und
   Status mit Texten, Kontakt), gibt sie als Option; die Oberfläche baut sie selbst.

   Zusammenführen (Abgleich, Einlesen): je Kennung gewinnt der bessere Stand, nicht der jüngere (Patrik, C11-1 a) —
   der weiter fortgeschrittene Status, bei gleichem Status der mit Antwort, dann der mit längerem Verlauf, zuletzt
   der jüngere; die Verläufe beider Seiten werden vereinigt, damit nichts verloren geht.

   Weg zur Entwicklung (austauschbar, damit später ein Server dazukommen kann): der Entwickler-Server (lokal, über
   KERN.entwicklung), die E-Mail aus dem eigenen Mailprogramm (Adresse aus <app>/kontakt.js) oder der Text zum
   Kopieren. Nichts davon trägt den Namen der Person. */
"use strict";

(function (KERN) {
  // Fortschritt eines Status: weiter hinten ist besser. „kein-fehler“ ist wie „behoben“ ein Abschluss.
  const RANG = { neu: 0, bestaetigt: 1, weitergeleitet: 2, geplant: 3, behoben: 4, "kein-fehler": 4 };
  const rang = m => RANG[m?.status] ?? 0;
  const WEITERGEGEBEN = ["weitergeleitet", "geplant", "behoben", "kein-fehler"];
  const WEGE = ["auto", "server", "mail", "text"];

  /** Ist b besser als a? (gleicher Kennung; siehe Kopf) */
  function besser(a, b) {
    if (rang(b) !== rang(a)) return rang(b) > rang(a);
    if (b.status === a.status) {
      if (!!b.antwort !== !!a.antwort) return !!b.antwort;
      const lb = (b.verlauf || []).length, la = (a.verlauf || []).length;
      if (lb !== la) return lb > la;
    }
    return String(b.stand || "") > String(a.stand || "");
  }

  /** Zwei Fassungen derselben Meldung zu einer: Grundlage die bessere, Verläufe vereinigt. */
  function vereinige(a, b) {
    const [gut, schwach] = besser(a, b) ? [b, a] : [a, b];
    const schluessel = v => `${v.zeit}|${v.status}|${v.von || ""}|${v.notiz || ""}`;
    const verlauf = new Map();
    for (const v of [...(gut.verlauf || []), ...(schwach.verlauf || [])]) if (v && typeof v === "object") verlauf.set(schluessel(v), v);
    const n = { ...gut, verlauf: [...verlauf.values()].sort((x, y) => (String(x.zeit) < String(y.zeit) ? -1 : String(x.zeit) > String(y.zeit) ? 1 : 0)) };
    // Antwort derselben Stufe nicht verlieren; gesehen ist sie, wenn eine Seite sie gesehen hat
    if (schwach.status === gut.status && (schwach.antwort || "") === (gut.antwort || "")) n.gelesen = !!(gut.gelesen || schwach.gelesen);
    else if (schwach.status === gut.status && !gut.antwort && schwach.antwort) n.antwort = schwach.antwort;
    // Stand bleibt der der besseren Fassung: Eine jüngere, aber schwächere Fassung ändert sonst nichts Sichtbares und
    // zählte trotzdem als geändert. Beide Geräte kommen so zum selben Ergebnis (gleiche Grundlage, gleicher Verlauf).
    return n;
  }

  /**
   * Meldungen zweier Geräte oder einer Datei zusammenführen: { wert, neu } (neu = hinzugekommen oder geändert).
   * ctx.umbiegen(id) → Kennung einer zusammengeführten Person; ctx.personVon(id) → { id, name } oder null.
   */
  function zusammenfuehren(eigene, fremde, ctx = {}) {
    const mitPerson = m => {
      if (!m || typeof m !== "object" || m.typ === "anregung" || !m.person) return m;
      const p = ctx.personVon ? ctx.personVon(m.person) : null;
      return p ? { ...m, person: p.id, name: p.name } : { ...m, person: ctx.umbiegen ? ctx.umbiegen(m.person) : m.person };
    };
    const da = new Map((Array.isArray(eigene) ? eigene : []).filter(m => m && m.id).map(m => [m.id, mitPerson(m)]));
    let neu = 0;
    for (const roh of Array.isArray(fremde) ? fremde : []) {
      if (!roh || typeof roh !== "object" || !roh.id) continue;
      const m = mitPerson(roh), alt = da.get(m.id);
      const n = alt ? vereinige(alt, m) : m;
      if (!alt || JSON.stringify(n) !== JSON.stringify(alt)) { da.set(m.id, n); neu++; }
    }
    return { wert: [...da.values()].sort((a, b) => (a.zeit < b.zeit ? -1 : a.zeit > b.zeit ? 1 : 0)), neu };
  }

  /** Status einer Bemerkung (bemerkungen.json) als Status einer Meldung; offen = noch keine Antwort (null). */
  function statusAusBemerkung(text = "") {
    const t = String(text || "").toLowerCase();
    if (t.startsWith("erledigt")) return "behoben";
    if (t.startsWith("kein fehler")) return "kein-fehler";
    if (t.startsWith("geplant") || t.startsWith("in arbeit")) return "geplant";
    return null;
  }

  /**
   * Meldungen einer App.
   * opt.app, opt.titel   „eulenpfad“, „Eulenpfad“ (Betreff der E-Mail)
   * opt.version()        → Version der App (APP_VERSION.version, NS3 a); jede neue Meldung merkt sich
   *                      versionen = { app, kern } — die Fassung, in der es geschah —, Text und Betreff nennen sie
   * opt.speicher         { lies, schreibe } der App; opt.schluessel (Standard „meldungen“)
   * opt.person(name)     → { id } oder null (Kennung der Person in der Meldung)
   * opt.inhalt           { feld: „spiel“ | „uebung“, wort: „Spiel“ | „Übung“, name: id → Anzeigename }
   * opt.stufe            { text: stufe → Text nach „Stufe “, aus: Text → stufe oder null } (Standard: unverändert)
   * opt.wer(m)           → Text in Klammern nach der Kennung („Kind, 3. Klasse“)
   * opt.zusatz(m)        → weitere Zeilen nach der Zeile mit dem Inhalt (Lernsteig: Niveau) oder []
   * opt.woerter          { eingaben, notiz } — Anfang der Zeilen (Eulenpfad: „Eingaben des Kindes“, „Notiz der Aufsicht“)
   * opt.arten, opt.anregungArten  { wert: Text }
   * opt.status           { status: { text, … } } (bekannte Status der App)
   * opt.kontakt()        → { meldungen?: E-Mail, server?: Adresse des Entwickler-Servers } (Vorgabe der Entwicklung,
   *                      <app>/kontakt.js; je Gerät abweichend über setzeMeldeweg, C11-3 a)
   * opt.entwicklung      KERN.entwicklung der App, eine Funktion, die sie liefert (später geladen), oder null
   * opt.standDatei       Pfad der veröffentlichten Antworten (Standard „meldungen-stand.json“)
   */
  function meldungen(opt) {
    const o = opt || {};
    if (!o.speicher || typeof o.speicher.lies !== "function") throw new Error("meldungen: speicher fehlt");
    if (!o.inhalt || !o.inhalt.feld) throw new Error("meldungen: inhalt fehlt");
    const S = o.schluessel || "meldungen";
    const feld = o.inhalt.feld;
    const inhaltName = id => (o.inhalt.name ? o.inhalt.name(id) : null) || id;
    const stufeText = s => (o.stufe && o.stufe.text ? o.stufe.text(s) : String(s));
    const stufeAus = t => (o.stufe && o.stufe.aus ? o.stufe.aus(t) : t);
    const arten = o.arten || {}, anregungArten = o.anregungArten || {}, status = o.status || {};
    const tag = iso => (KERN.zeit ? KERN.zeit.tag(iso) : String(iso).slice(0, 10));
    const woerter = { eingaben: "Eingaben", notiz: "Notiz", ...(o.woerter || {}) };
    const entwicklung = () => (typeof o.entwicklung === "function" ? o.entwicklung() : o.entwicklung) || null;

    const istAnregung = m => m?.typ === "anregung";
    const alle = () => { const l = o.speicher.lies(S, []); return Array.isArray(l) ? l : []; };
    const schreibe = l => o.speicher.schreibe(S, l);
    const von = name => alle().filter(m => m.name === name && !istAnregung(m));
    const anregungen = () => alle().filter(istAnregung);
    const korrekturen = () => anregungen().filter(m => m.art === "korrektur");
    const gefunden = name => von(name).filter(m => m.status === "behoben").length;
    const ungelesen = name => von(name).filter(m => !m.gelesen);

    function neu(daten) {
      const jetzt = new Date().toISOString();
      const id = `M-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      const p = o.person ? o.person(daten.name) : null;
      const v = { app: (typeof o.version === "function" ? o.version() : "") || "", kern: KERN.version || "" };
      const m = { id, zeit: jetzt, stand: jetzt, status: "neu", gelesen: true, ...(v.app || v.kern ? { versionen: v } : {}),
        ...daten, ...(p ? { person: p.id } : {}), verlauf: [{ zeit: jetzt, status: "neu", von: daten.name }] };
      schreibe([...alle(), m]);
      return m;
    }
    const neueAnregung = daten => neu({ ...daten, typ: "anregung" });
    const neueKorrektur = daten => neueAnregung({ ...daten, art: "korrektur" });
    /** Eigene, noch nicht gesendete Meldung oder Anregung löschen. */
    const entferne = id => schreibe(alle().filter(m => m.id !== id));

    /** Ändern (Status, Antwort …): ein neuer Status kommt in den Verlauf; neuer Status oder neue Antwort = ungelesen. */
    function setze(id, aenderung, { von: wer = "", notiz = "" } = {}) {
      const jetzt = new Date().toISOString();
      schreibe(alle().map(m => {
        if (m.id !== id) return m;
        const n = { ...m, ...aenderung, stand: jetzt };
        if (aenderung.status && aenderung.status !== m.status) n.verlauf = [...(m.verlauf || []), { zeit: jetzt, status: aenderung.status, von: wer, ...(notiz ? { notiz } : {}) }];
        if ((aenderung.status && aenderung.status !== m.status) || (aenderung.antwort && aenderung.antwort !== m.antwort)) n.gelesen = false;
        return n;
      }));
    }
    /** Die Person hat ihre Rückmeldungen gesehen. */
    function gelesen(name) {
      if (!ungelesen(name).length) return;
      schreibe(alle().map(m => (m.name === name ? { ...m, gelesen: true } : m)));
    }

    /** „Eulenpfad 1.0.0 · Kern 1.36.0“ aus den Versionen einer Meldung, "" bei älteren ohne (NS3 a). */
    const versionText = m => {
      const v = m?.versionen;
      if (!v || (!v.app && !v.kern)) return "";
      return [v.app ? `${o.titel || o.app} ${v.app}` : null, v.kern ? `Kern ${v.kern}` : null].filter(Boolean).join(" · ");
    };
    /** Text für die Entwicklung: ohne Namen, mit Kennung. */
    function alsText(m) {
      const id = m[feld];
      const version = versionText(m) ? `Version: ${versionText(m)}` : null;
      if (istAnregung(m)) return [
        `Anregung ${m.id} (Aufsicht), ${tag(m.zeit)}`,
        version,
        `Art: ${anregungArten[m.art] || m.art}`,
        id ? `${o.inhalt.wort}: ${inhaltName(id)} (${id})` : null,
        m.liste ? `Liste: ${m.liste}` : null,
        m.eintrag ? `Eintrag: ${m.eintrag}${m.schluessel ? ` [${m.schluessel}]` : ""}` : null,
        `Anregung: ${m.text}`,
      ].filter(Boolean).join("\n");
      return [
        `Meldung ${m.id} (${o.wer ? o.wer(m) : "Person"}), ${tag(m.zeit)}`,
        version,
        `${o.inhalt.wort}: ${inhaltName(id)} (${id}), Stufe ${stufeText(m.stufe)}, Aufgabe ${m.aufgabeNr ?? "?"}`,
        ...(o.zusatz ? o.zusatz(m) || [] : []),
        `Art: ${arten[m.art] || m.art}`,
        `Aufgabe: ${m.aufgabe || "—"}`,
        m.loesung ? `Erwartete Lösung: ${m.loesung}` : null,
        m.eingabe ? `${woerter.eingaben}: ${m.eingabe}` : null,
        m.ergebnis ? `Gewertet: ${m.ergebnis}` : null,
        `Begründung: ${m.text}`,
        ...(m.verlauf || []).filter(v => v.notiz).map(v => `${woerter.notiz}: ${v.notiz}`),
      ].filter(Boolean).join("\n");
    }
    /** Eine per E-Mail angekommene Meldung wieder lesen: { meldung, <feld>?, stufe? } oder null ohne Kennung. */
    function ausText(text) {
      const id = String(text || "").match(/(?:Meldung|Anregung) (M-[a-z0-9]+-[a-z0-9]+)/)?.[1];
      if (!id) return null;
      const ort = String(text).match(/\(([a-z0-9-]+)\), Stufe ([a-z0-9-]+)/);
      const stufe = ort ? stufeAus(ort[2]) : null;
      return { meldung: id, ...(ort && stufe ? { [feld]: ort[1], stufe } : {}) };
    }

    // ----- Weg zur Entwicklung -----
    const adresse = () => (o.kontakt ? o.kontakt()?.meldungen : "") || "";
    /**
     * Weg je Gerät (C11-3 a), Speicher <app>:meldeweg = { weg, server? }: weg „auto“ (Server, sonst E-Mail, sonst Text),
     * „server“, „mail“ oder „text“; server = Adresse des Entwickler-Servers ("" = dieselbe Seite), ohne Angabe die
     * Vorgabe der Entwicklung aus <app>/kontakt.js (Feld server). Nur auf diesem Gerät, reist nicht mit.
     */
    function meldeweg() {
      const e = o.speicher.lies("meldeweg", null) || {};
      const vorgabe = (o.kontakt ? o.kontakt()?.server : "") || "";
      const eigen = typeof e.server === "string";
      return { weg: WEGE.includes(e.weg) ? e.weg : "auto", server: eigen ? e.server : vorgabe, eigeneAdresse: eigen, vorgabe };
    }
    /** Weg setzen; server null = Vorgabe der Entwicklung. Wirft bei einer nicht erlaubten Adresse. */
    function setzeMeldeweg({ weg = "auto", server = null } = {}) {
      if (!WEGE.includes(weg)) throw new Error(`Unbekannter Weg ${weg}`);
      const pruefe = KERN.entwicklung && KERN.entwicklung.adresseGueltig ? KERN.entwicklung.adresseGueltig : t => String(t || "");
      let s = null;
      if (server !== null) {
        s = pruefe(server);
        if (s === null) throw new Error(`Diese Adresse ist nicht erlaubt. ${KERN.entwicklung && KERN.entwicklung.ADRESSE_REGEL ? KERN.entwicklung.ADRESSE_REGEL : ""}`.trim());
      }
      o.speicher.schreibe("meldeweg", { weg, ...(s !== null ? { server: s } : {}) });
      return meldeweg();
    }
    /** mailto-Link mit Betreff und Text oder null ohne Adresse. */
    function mailLink(m) {
      const an = adresse();
      if (!an) return null;
      // Lernprogramm mit Version, Kennung (Ticket) und Thema im Betreff (NS1 a, Zusatz Patrik)
      const app = `${o.titel}${m.versionen?.app ? ` ${m.versionen.app}` : ""}`;
      const betreff = istAnregung(m) ? `${app}: Anregung ${m.id}${m[feld] ? ` (${m[feld]})` : ""}`
        : `${app}: Fehlermeldung ${m.id} (${m[feld]}, Stufe ${stufeText(m.stufe)})`;
      return `mailto:${an}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(alsText(m))}`;
    }
    /** Daten einer Bemerkung für den Entwickler-Server. */
    const bemerkungDaten = m => ({ text: alsText(m), [feld === "spiel" ? "spiel" : "inhalt"]: m[feld] || undefined, stufe: m.stufe,
      aufgabe: m.aufgabe ? `Aufgabe ${m.aufgabeNr}: ${m.aufgabe}` : undefined, meldung: m.id,
      fassung: versionText(m) || undefined });

    /**
     * Weitergeben nach dem Weg des Geräts (meldeweg): „auto“ Entwickler-Server, sonst E-Mail, sonst Text; „server“, „mail“,
     * „text“ nur diesen Weg. ui: { von, bestaetigen(„meldung“ | „anregung“) → bool, oeffne(url), kopiere(text) → Promise,
     * melde(text) }. Setzt den Status „weitergeleitet“ mit Notiz; gibt den Weg zurück („server“, „mail“, „text“) oder null,
     * wenn abgebrochen oder der gewählte Weg nicht geht (dann mit melde begründet).
     */
    async function weitergeben(m, ui = {}) {
      const e = entwicklung();
      const { weg } = meldeweg();
      const sag = text => { if (ui.melde) ui.melde(text); return null; };
      if (weg === "auto" || weg === "server") {
        // Meldungen gehen für alle, ohne Entwickler-Schlüssel (Plan C12, NS1 a), aber nur an einen Server, den der Kern
        // annimmt: auf diesem Gerät, oder im Netz mit gültiger Unterschrift der Entwicklung (NS2 a)
        const da = e && (await e.server());
        if (da) {
          const b = await (e.meldung ? e.meldung(bemerkungDaten(m)) : e.bemerkung(bemerkungDaten(m)));
          if (!b) return null;
          setze(m.id, { status: "weitergeleitet" }, { von: ui.von, notiz: `Bemerkung Nr. ${b.nr}` });
          return "server";
        }
        if (weg === "server") return sag(!e ? "Gewählt ist der Entwickler-Server, aber diese Seite kennt keinen." : e.serverMeldung());
      }
      const mail = weg === "text" ? null : mailLink(m);
      if (weg === "mail" && !mail) return sag("Gewählt ist E-Mail, aber die Entwicklung hat noch keine Adresse eingetragen.");
      if (mail) {
        if (ui.bestaetigen && !ui.bestaetigen(istAnregung(m) ? "anregung" : "meldung")) return null;
        if (ui.oeffne) ui.oeffne(mail);
        setze(m.id, { status: "weitergeleitet" }, { von: ui.von, notiz: "per E-Mail" });
        return "mail";
      }
      if (ui.kopiere) await ui.kopiere(alsText(m));
      setze(m.id, { status: "weitergeleitet" }, { von: ui.von, notiz: "als Text kopiert" });
      return "text";
    }

    /**
     * Antworten übernehmen: { <id>: { status, antwort? } } mit status geplant | behoben | kein-fehler; nur für schon
     * weitergegebene Meldungen. Gibt die Zahl der geänderten zurück.
     */
    function standAnwenden(stand) {
      let n = 0;
      for (const m of alle()) {
        const s = stand?.[m.id];
        if (!s || !status[s.status] || !WEITERGEGEBEN.includes(m.status)) continue;
        if (s.status === m.status && (s.antwort || "") === (m.antwort || "")) continue;
        setze(m.id, { status: s.status, ...(s.antwort ? { antwort: s.antwort } : {}) }, { von: "Entwicklung" });
        n++;
      }
      return n;
    }
    /** Antworten holen: veröffentlichte Datei und, mit Entwickler-Server, die Bemerkungen. Gibt die Zahl zurück. */
    async function abfragen() {
      const stand = {};
      try {
        const r = await fetch(o.standDatei || "meldungen-stand.json", { cache: "no-store" });
        if (r.ok) Object.assign(stand, await r.json());
      } catch (e) { /* offline oder ohne Datei */ }
      const e = entwicklung();
      const b = e && e.freigeschaltet() ? await e.bemerkungen() : null;
      for (const x of b || []) {
        const s = statusAusBemerkung(x.status);
        if (x.meldung && s) stand[x.meldung] = { status: s, ...(x.antwort ? { antwort: x.antwort } : {}) };
      }
      return standAnwenden(stand);
    }

    /** Teil für KERN.daten (Sichern, Einlesen, Abgleich): Meldungen der gewählten Personen, Zusammenführen wie oben. */
    const teil = {
      schluessel: S,
      sichern: (ids, eigene) => (Array.isArray(eigene) ? eigene : []).filter(m => m && (!ids || ids.includes(m.person))),
      zusammenfuehren: (eigene, fremde, ctx) => zusammenfuehren(eigene, fremde, ctx),
    };

    return { app: o.app, istAnregung, alle, von, anregungen, korrekturen, gefunden, ungelesen, neu, neueAnregung,
      neueKorrektur, entferne, setze, gelesen, alsText, ausText, adresse, mailLink, bemerkungDaten, weitergeben, meldeweg, setzeMeldeweg, WEGE,
      standAnwenden, abfragen, statusAusBemerkung, teil };
  }
  meldungen.besser = besser;
  meldungen.vereinige = vereinige;
  meldungen.zusammenfuehren = zusammenfuehren;
  meldungen.statusAusBemerkung = statusAusBemerkung;
  meldungen.RANG = RANG;

  KERN.meldungen = meldungen;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/einladung.js ---- */
/* Kern — Einladung in eine andere App (Entscheid EL1 a, Notiz EP1; Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.13).
   Herkunft: lernsteig/gemeinsam/konten.js (LST_Session1).

   Beim Übertritt (Eulenpfad nach der 6. Klasse → Lernsteig, später Lernsteig → Gratwanderung) gibt die Aufsicht der
   Person eine Einladung mit: nur Stammdaten, kein Verlauf, keine PIN. Zwei Wege mit demselben Inhalt:
   - Link mit Fragment „…/<ziel>/#einladung=<base64url(JSON)>“ — das Fragment geht nicht an den Server; die Ziel-App
     liest es und löscht es aus der Adresse;
   - Datei „<ziel>-einladung.json“ mit demselben JSON.
   Format: { format: "einladung", v: 1, ziel?, von?, name, geboren?, klasse?, niveau?, lehrplan? }. Ältere Einladungen des
   Lernsteigs ({ v: 1, … } ohne format) gelten weiter. Was eine Klasse, ein Niveau, ein Lehrplan ist, prüft die Ziel-App. */
"use strict";

(function (KERN) {
  const FORMAT = "einladung";
  const FELDER = ["name", "geboren", "klasse", "niveau", "lehrplan"];

  // UTF-8 ↔ base64url ohne escape/unescape: über Bytes (btoa und atob gibt es im Browser und in Node)
  function b64url(text) {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function vonB64url(s) {
    const t = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(t + "===".slice((t.length + 3) % 4));
    return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
  }

  /** Inhalt einer Einladung aus Stammdaten (leere Felder fallen weg). ziel und von: Apps ("lernsteig", "eulenpfad"). */
  function erstellen(daten, { ziel, von } = {}) {
    const d = { format: FORMAT, v: 1 };
    if (ziel) d.ziel = String(ziel);
    if (von) d.von = String(von);
    for (const f of FELDER) if (daten && daten[f] !== undefined && daten[f] !== null && daten[f] !== "") d[f] = daten[f];
    if (!KERN.person.nameRein(d.name || "")) throw new Error("Einladung: Vorname fehlt");
    return d;
  }
  /** Fragment für den Link: „#einladung=…“. */
  const fragment = einladung => "#einladung=" + b64url(JSON.stringify(einladung));
  /** Dateiname für die Datei: „lernsteig-einladung.json“. */
  const dateiname = ziel => `${ziel || "app"}-einladung.json`;

  /**
   * Liest eine Einladung aus einem Fragment („#einladung=…“, auch eine ganze Adresse) oder einem Objekt (Datei).
   * opt.ziel: diese App — eine Einladung für eine andere App gilt nicht. opt.klasse, opt.niveau, opt.lehrplan:
   * Prüfungen der App (Wert → bereinigter Wert oder null). Ungültige Felder fallen weg (Befund D12); ohne gültigen
   * Vornamen oder bei fremdem Format null.
   */
  function lesen(eingabe, opt = {}) {
    let d = eingabe;
    if (typeof eingabe === "string") {
      const m = eingabe.match(/einladung=([A-Za-z0-9_-]+)/);
      if (!m) return null;
      try { d = JSON.parse(vonB64url(m[1])); } catch (e) { return null; }
    }
    if (!d || typeof d !== "object" || Array.isArray(d) || d.v !== 1) return null;
    if (d.format !== undefined && d.format !== FORMAT) return null;
    if (opt.ziel && d.ziel !== undefined && d.ziel !== opt.ziel) return null;
    const erg = {};
    const name = typeof d.name === "string" ? KERN.person.nameRein(d.name) : "";
    if (!name) return null;
    erg.name = name;
    const g = KERN.person.geburtsdatumLies(d.geboren); if (g) erg.geboren = g; // auch ohne Tag (B3)
    for (const f of ["klasse", "niveau", "lehrplan"]) {
      if (d[f] === undefined || typeof opt[f] !== "function") continue;
      const w = opt[f](d[f]);
      if (w !== null && w !== undefined) erg[f] = w;
    }
    if (typeof d.von === "string") erg.von = d.von;
    return erg;
  }

  KERN.einladung = { FORMAT, erstellen, fragment, dateiname, lesen };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/auswertung.js ---- */
/* Kern — Auswertung ohne App-Bezug (Entscheide AW1 a, AW2 a, LERN_Session16; Plan docs/plan_angleich_reihe.md B;
   docs/kern/rahmen.md 4.14). Herkunft: eulenpfad/spiele/gemeinsam/auswertung.js und erfolge.js (Sitzungen, Lernzeiten,
   Wochenziel, Bedarf, Ziehen), lernsteig/gemeinsam/werkzeug.js und rahmen.js (Wochenserie, Kompetenzstand).

   Reine Rechnungen auf Runden im gemeinsamen Format (kern/runden.js: zeit, dauer …) und auf Listen von Aufgaben.
   Was an Katalog, Lernzielen und Ton einer App hängt (Fazit, Vorschläge, Texte), bleibt in der App; sie gibt hier nur
   ihre Schwellen mit. Testrunden filtert die App vorher heraus. */
"use strict";

(function (KERN) {
  const TAG_MS = 24 * 3600 * 1000;
  const WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const mittel = xs => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);
  const median = xs => { if (!xs.length) return null; const a = [...xs].sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };

  /** Pearson-Korrelation zweier gleich langer Reihen; null bei weniger als drei Werten oder ohne Streuung. */
  function korrelation(xs, ys) {
    const n = xs.length;
    if (n < 3) return null;
    const mx = mittel(xs), my = mittel(ys);
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
    return sxx && syy ? sxy / Math.sqrt(sxx * syy) : null;
  }

  /** Runden zu Sitzungen: mehr als pauseMin Minuten (plus Dauer der Runde) zwischen zwei Enden = neue Sitzung. */
  function sitzungen(runden, { pauseMin = 20 } = {}) {
    const sortiert = [...runden].sort((a, b) => a.zeit.localeCompare(b.zeit));
    const ergebnis = [];
    let letzte = null;
    for (const e of sortiert) {
      const t = Date.parse(e.zeit);
      if (!letzte || t - letzte > pauseMin * 60000 + (e.dauer || 0) * 1000) ergebnis.push([]);
      ergebnis[ergebnis.length - 1].push(e);
      letzte = t;
    }
    return ergebnis;
  }

  /** Wann wird gelernt: Minuten und Runden je Wochentag (Mo–So), je Tageszeit und je Tag der letzten 14 Tage. */
  function lernzeiten(runden, jetzt = Date.now()) {
    const wochentage = WOCHENTAGE.map(t => ({ name: t, minuten: 0, runden: 0 }));
    const fenster = [
      { name: "vor 9", von: 0, bis: 9 }, { name: "9–12", von: 9, bis: 12 }, { name: "12–14", von: 12, bis: 14 },
      { name: "14–17", von: 14, bis: 17 }, { name: "17–20", von: 17, bis: 20 }, { name: "ab 20", von: 20, bis: 24 },
    ].map(f => ({ ...f, minuten: 0, runden: 0 }));
    const tage = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(jetzt - (13 - i) * TAG_MS);
      return { datum: d.toDateString(), name: String(d.getDate()), lang: d.toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "numeric" }), minuten: 0, runden: 0 };
    });
    for (const e of runden) {
      const d = new Date(e.zeit);
      const min = (e.dauer || 0) / 60;
      const w = wochentage[(d.getDay() + 6) % 7];
      w.minuten += min; w.runden++;
      const f = fenster.find(x => d.getHours() >= x.von && d.getHours() < x.bis);
      f.minuten += min; f.runden++;
      const t = tage.find(x => x.datum === d.toDateString());
      if (t) { t.minuten += min; t.runden++; }
    }
    return { wochentage, fenster, tage, uebungstage14: tage.filter(t => t.runden > 0).length };
  }

  // ---------- Wochen und Wochenziel ----------
  /** Montag 0:00 der Woche, in der `zeit` liegt (Ortszeit). */
  function wochenStart(zeit) {
    const d = new Date(zeit);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
  }
  const tageSpaeter = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  /**
   * Wochen seit der ersten Runde bis heute, älteste zuerst, mindestens eine: { wochen, aktuelle, serie, erfuellt }.
   * ziel: { tage, minuten } oder null. Ein Tag ist erfüllt, wenn die Runden des Tages zusammen die Minuten erreichen
   * (minuten 0 oder ohne Ziel: wenn geübt wurde); eine Woche, wenn genug Tage erfüllt sind (nur mit Ziel).
   * serie: erfüllte Wochen in Folge bis heute; die laufende Woche zählt, sobald sie erfüllt ist, und bricht die Serie
   * nicht, solange sie läuft. erfuellt: Zahl der erfüllten Wochen.
   * Je Woche { von, bis, tage: [{ name, datum, minuten, runden, heute, zukunft, erfuellt }], erfuellteTage, erfuellt, laufend }.
   */
  function wochen(runden, ziel = null, jetzt = Date.now()) {
    const plan = ziel && ziel.tage > 0 ? { tage: ziel.tage, minuten: ziel.minuten || 0 } : null;
    const start = wochenStart(jetzt);
    const erste = runden.length ? wochenStart(Math.min(...runden.map(e => Date.parse(e.zeit)))) : start;
    const liste = [];
    for (let von = erste; von <= start; von = tageSpaeter(von, 7)) {
      const bis = tageSpaeter(von, 7);
      const tage = WOCHENTAGE.map((name, i) => ({ name, datum: tageSpaeter(von, i), minuten: 0, runden: 0, heute: false, zukunft: false }));
      for (const t of tage) { t.heute = t.datum.toDateString() === new Date(jetzt).toDateString(); t.zukunft = t.datum > jetzt && !t.heute; }
      for (const e of runden) {
        const z = new Date(e.zeit);
        if (z < von || z >= bis) continue;
        const t = tage[(z.getDay() + 6) % 7];
        t.minuten += (e.dauer || 0) / 60;
        t.runden++;
      }
      for (const t of tage) t.erfuellt = plan && plan.minuten > 0 ? t.minuten >= plan.minuten : t.runden > 0;
      const erfuellteTage = tage.filter(t => t.erfuellt).length;
      liste.push({ von, bis, tage, erfuellteTage, erfuellt: !!plan && erfuellteTage >= plan.tage, laufend: von.getTime() === start.getTime() });
    }
    let serie = 0;
    for (let i = liste.length - 1; i >= 0; i--) {
      if (liste[i].erfuellt) serie++;
      else if (!liste[i].laufend) break;
    }
    return { plan, wochen: liste, aktuelle: liste[liste.length - 1], serie, erfuellt: liste.filter(w => w.erfuellt).length };
  }

  // ---------- Stand und Bedarf (AW2 a: eine Regel, Schwellen je App) ----------
  /**
   * Stand aus den letzten Aufgaben: aufgaben = [{ anhieb: Ja/Nein, gezeigt?: Ja/Nein }], älteste zuerst.
   * opt: { fenster (letzte n Aufgaben), mindestens (Aufgaben insgesamt für „sicher“), schwelle (Anteil auf Anhieb),
   * ohneGezeigt (im Fenster keine gezeigte Lösung für „sicher“, Standard ja) }.
   * Liefert { n, imFenster, anhieb, quote (null ohne Aufgaben), sicher }.
   */
  function stand(aufgaben, { fenster = 10, mindestens = 1, schwelle = 0.7, ohneGezeigt = true } = {}) {
    const liste = Array.isArray(aufgaben) ? aufgaben : [];
    const letzte = liste.slice(-fenster);
    const anhieb = letzte.filter(a => a && a.anhieb && !a.gezeigt).length;
    const quote = letzte.length ? anhieb / letzte.length : null;
    const sicher = liste.length >= mindestens && quote !== null && quote >= schwelle && (!ohneGezeigt || letzte.every(a => !a.gezeigt));
    return { n: liste.length, imFenster: letzte.length, anhieb, quote, sicher };
  }

  /**
   * Bedarf als Gewicht für Zufallswahlen (Eulenpfad LERN_Session10): noch nie geübt 2 (ausprobieren); unter der Schwelle
   * 1 + 4 · (1 − quote) (wackelt); sonst kürzlich geübt 0.5, über sieben Tage her 2 (verteiltes Üben).
   * quote: Anteil auf Anhieb (stand(…).quote) oder null; tageSeit: Tage seit dem letzten Üben.
   */
  function bedarf(quote, tageSeit, { schwelle = 0.7 } = {}) {
    if (quote === null || quote === undefined) return 2;
    return quote < schwelle ? 1 + 4 * (1 - quote) : tageSeit >= 7 ? 2 : 0.5;
  }

  /** Zufällig nach Gewicht ziehen: ohne n ein Element, mit n eine Liste ohne Zurücklegen (höchstens n). */
  function ziehe(kandidaten, gewicht, n, zufall = Math.random) {
    const rest = kandidaten.map(x => ({ x, g: Math.max(0, gewicht(x)) }));
    const aus = [];
    while (rest.length && aus.length < (n ?? 1)) {
      let r = zufall() * rest.reduce((a, e) => a + e.g, 0);
      let i = rest.findIndex(e => (r -= e.g) < 0);
      if (i < 0) i = rest.length - 1;
      aus.push(rest.splice(i, 1)[0].x);
    }
    return n === undefined ? aus[0] : aus;
  }

  KERN.auswertung = { TAG_MS, WOCHENTAGE, mittel, median, korrelation, sitzungen, lernzeiten, wochenStart, wochen, stand, bedarf, ziehe };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/rolleiste.js ---- */
/* Kern — Rollleiste: eine Zeile, die seitlich rollt, mit Pfeilen nur bei Bedarf (docs/kern/rahmen.md 4.15).
   Für die Tab-Leiste der Apps (Wunsch Patrik, LERN_Session17: die Leiste bleibt einzeilig, statt umzubrechen).
   KERN.rolleiste(inhalt, { aktiv, schritt, links, rechts }) → Hülle div.rolleiste mit
     button.rolle-pfeil.links · inhalt (bekommt die Klasse rolle-inhalt) · button.rolle-pfeil.rechts
   Ein Pfeil steht nur da, wo noch etwas verborgen ist (Attribut hidden); ein Tippen rollt um einen Teil der
   sichtbaren Breite. Die Pfeile dürfen neben der Rollfläche stehen (sie machen sie dann schmaler) oder darüber.
   Beim Einhängen rollt das aktive Element (Standard [aria-selected="true"]) ganz ins Bild.
   Aussehen und die nötigen Regeln (overflow-x, keine Umbrüche, [hidden]) gibt die App in ihrem CSS.
   KERN.rolleiste.zustand(links, breite, sichtbar) → { links, rechts }: welche Pfeile nötig sind (rein, getestet).
   Greift erst beim Aufruf auf document zu, nie beim Laden (in Node ladbar). */
"use strict";

(function (KERN) {
  const TOLERANZ = 1; // Pixel: gebrochene Rollwerte bei Zoom zählen nicht als „noch etwas verborgen“

  /** Welche Pfeile nötig sind: links, wenn schon gerollt; rechts, wenn rechts noch etwas verborgen ist. */
  function zustand(links, breite, sichtbar) {
    const rest = breite - sichtbar - links;
    return { links: links > TOLERANZ, rechts: rest > TOLERANZ };
  }

  function rolleiste(inhalt, opt = {}) {
    const { aktiv = '[aria-selected="true"]', schritt = 0.7, links = "◀", rechts = "▶" } = opt;
    const pfeil = (richtung, text) => KERN.el("button", {
      type: "button", class: "rolle-pfeil " + richtung, text, hidden: true, tabindex: "-1", "aria-hidden": "true",
      // Mit der Tastatur rollt der Fokus die Leiste selbst; die Pfeile sind nur für Finger und Maus.
      onclick: () => inhalt.scrollBy({ left: (richtung === "links" ? -1 : 1) * inhalt.clientWidth * schritt, behavior: "smooth" }),
    });
    const l = pfeil("links", links), r = pfeil("rechts", rechts);
    inhalt.classList.add("rolle-inhalt");
    const huelle = KERN.el("div", { class: "rolleiste" }, l, inhalt, r);

    const nachfuehren = () => {
      const z = zustand(inhalt.scrollLeft, inhalt.scrollWidth, inhalt.clientWidth);
      l.hidden = !z.links;
      r.hidden = !z.rechts;
    };
    inhalt.addEventListener("scroll", nachfuehren, { passive: true });
    if (typeof ResizeObserver === "function") new ResizeObserver(nachfuehren).observe(inhalt);
    else addEventListener("resize", nachfuehren);

    // Aktives Element ganz ins Bild rollen (nur seitlich, die Seite rollt nicht); true, wenn gerollt wurde.
    const insBild = () => {
      const a = aktiv && inhalt.querySelector(aktiv);
      if (!a) return false;
      const ra = a.getBoundingClientRect(), ri = inhalt.getBoundingClientRect();
      const vorn = ra.left - ri.left + inhalt.scrollLeft, hinten = vorn + ra.width, vorher = inhalt.scrollLeft;
      if (vorn < inhalt.scrollLeft) inhalt.scrollLeft = vorn;
      else if (hinten > inhalt.scrollLeft + inhalt.clientWidth) inhalt.scrollLeft = hinten - inhalt.clientWidth;
      return Math.abs(inhalt.scrollLeft - vorher) > TOLERANZ;
    };
    // Nach dem Einhängen: erst die Pfeile setzen (stehen sie neben der Rollfläche, machen sie sie schmaler), dann ins
    // Bild rollen; wiederholen, bis nichts mehr rollt (ein neuer Pfeil kann den Platz noch einmal ändern).
    requestAnimationFrame(() => {
      for (let i = 0; i < 3; i++) { nachfuehren(); if (!insBild()) break; }
      nachfuehren();
    });
    return huelle;
  }
  rolleiste.zustand = zustand;

  KERN.rolleiste = rolleiste;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/personenmenue.js ---- */
/* Kern — Personen-Knopf mit Menü: wer angemeldet ist, wechseln, abmelden (docs/kern/rahmen.md 4.16, Entscheid PA1 a).
   Ein Knopf mit Bild und Name; ein Tippen öffnet ein Menü mit den anderen Personen des Geräts und, getrennt darunter,
   dem Schluss-Eintrag (Abmelden, beim Gast Anmelden). Personen und Aktion stehen nicht in derselben Auswahlliste:
   eine Pfeiltaste wählt nichts aus, erst Enter oder ein Tippen.
   KERN.personenMenue({ ich, personen, waehle, schluss, titel }) → Hülle div.personen-menue mit
     button.personen-knopf · div.personen-liste[role=menu] (Einträge button.personen-eintrag, button.personen-schluss)
     ich       { name, bild }            bild: Element oder null (die App zeichnet ihr Bild)
     personen  [{ id, name, bild, zusatz, aria }]   ohne die angemeldete Person; zusatz z. B. „🔒“
     waehle    id => …                   die App meldet an (oder fragt die PIN)
     schluss   { text, aktion }          „↩ Abmelden“ bzw. „Anmelden“
     titel     Text für Bildschirmleser („Angemeldet als“)
   Tastatur: Pfeil ab/auf auf dem Knopf öffnet; im Menü Pfeil ab/auf, Pos1/Ende; Esc schliesst und gibt den Fokus dem
   Knopf zurück; Tab oder ein Tippen daneben schliesst. Aussehen gibt die App ([hidden] muss ausblenden; die Liste
   steht bündig rechts am Knopf, mit der Klasse nach-rechts, die der Kern bei zu wenig Platz links setzt, bündig links).
   KERN.personenMenue.naechster(i, n, taste) → Index nach einer Taste (rein, getestet).
   Greift erst beim Aufruf auf document zu, nie beim Laden (in Node ladbar). */
"use strict";

(function (KERN) {
  /** Index des Eintrags nach einer Taste; -1 = keiner fokussiert. Unbekannte Taste: unverändert. */
  function naechster(i, n, taste) {
    if (n <= 0) return -1;
    if (taste === "ArrowDown") return i < 0 ? 0 : (i + 1) % n;
    if (taste === "ArrowUp") return i < 0 ? n - 1 : (i - 1 + n) % n;
    if (taste === "Home") return 0;
    if (taste === "End") return n - 1;
    return i;
  }

  function personenMenue({ ich, personen = [], waehle, schluss, titel = "Angemeldet als" }) {
    const el = KERN.el;
    const knopf = el("button", { type: "button", class: "personen-knopf", "aria-haspopup": "menu", "aria-expanded": "false",
      "aria-label": `${titel}: ${ich.name}`, title: titel },
      ich.bild || null, el("span", { class: "personen-name", text: ich.name }), el("span", { class: "personen-pfeil", "aria-hidden": "true", text: "▾" }));
    const eintrag = (klasse, inhalt, aria, aktion) => el("button", { type: "button", class: klasse, role: "menuitem", tabindex: "-1",
      "aria-label": aria || null, onclick: () => { schliesse(false); aktion(); } }, inhalt);
    const eintraege = [
      ...personen.map(p => eintrag("personen-eintrag", [p.bild || null, el("span", { class: "personen-name", text: p.name }),
        p.zusatz ? el("span", { class: "personen-zusatz", text: p.zusatz }) : null], p.aria, () => waehle(p.id))),
      ...(schluss ? [eintrag("personen-schluss", schluss.text, null, schluss.aktion)] : []),
    ];
    const trenner = personen.length && schluss ? el("div", { class: "personen-trenner", role: "separator" }) : null;
    const liste = el("div", { class: "personen-liste", role: "menu", "aria-label": titel, hidden: true },
      eintraege.slice(0, personen.length), trenner, eintraege.slice(personen.length));
    const huelle = el("div", { class: "personen-menue" }, knopf, liste);

    const offen = () => !liste.hidden;
    const fokus = i => { if (eintraege[i]) eintraege[i].focus(); };
    const aussen = e => { if (!huelle.isConnected || !huelle.contains(e.target)) schliesse(false); };
    function oeffne(erster = 0) {
      liste.classList.remove("nach-rechts");
      liste.hidden = false;
      // Bündig rechts am Knopf; reicht der Platz links nicht (Knopf am linken Rand, etwa auf dem Handy), nach rechts.
      if (liste.getBoundingClientRect().left < 0) liste.classList.add("nach-rechts");
      knopf.setAttribute("aria-expanded", "true");
      document.addEventListener("pointerdown", aussen, true);
      fokus(erster);
    }
    function schliesse(fokusZurueck) {
      if (!offen()) return;
      liste.hidden = true;
      knopf.setAttribute("aria-expanded", "false");
      document.removeEventListener("pointerdown", aussen, true);
      if (fokusZurueck) knopf.focus();
    }
    knopf.addEventListener("click", () => (offen() ? schliesse(false) : oeffne()));
    knopf.addEventListener("keydown", e => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      oeffne(naechster(-1, eintraege.length, e.key));
    });
    liste.addEventListener("keydown", e => {
      if (e.key === "Escape") { e.preventDefault(); return schliesse(true); }
      if (e.key === "Tab") return schliesse(false);
      const i = eintraege.indexOf(document.activeElement), j = naechster(i, eintraege.length, e.key);
      if (j !== i) { e.preventDefault(); fokus(j); }
    });
    return huelle;
  }
  personenMenue.naechster = naechster;

  KERN.personenMenue = personenMenue;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/tastenfeld.js ---- */
/* Kern — Tastenfeld: Tasten, die in ein gewähltes Eingabefeld schreiben, ohne ihm den Fokus zu nehmen (Entscheid TF1 a,
   LERN_Session20; docs/kern/rahmen.md 4.24). Herkunft: das Ziffernfeld des Notizblocks (kern/notizblock.js, LERN_Session14).
   KERN.tastenfeld({ tasten, ziel, klasse, label, ton, leer }) → { element, tippe(taste), ziel() }
     tasten  Liste: eine Zeichenkette ist eine Taste, die sich selbst schreibt („7“, „x“, „·“); „⌫“ löscht vor der
             Schreibmarke. Ein Objekt { text, label, klasse, wert, tue(feld) } schreibt wert (Standard text) oder tut
             selbst etwas (tue, etwa das Vorzeichen wechseln).
     ziel()  das Feld, in das geschrieben wird (die App entscheidet; null = nichts tun)
     klasse  Klassen des Felds (Standard „tastenfeld“), label die Beschriftung für Vorleser
     ton(art) Ton beim Tippen (Standard still); leer(feld) ruft ⌫ in einem leeren Feld (Notizblock: ein Häuschen zurück)
   Ein Feld mit maxlength 1 (Häuschen) wird ersetzt, sonst wird an der Schreibmarke eingefügt, höchstens bis maxlength.
   Nach jedem Tippen meldet das Feld „input“ wie beim Schreiben mit der Tastatur. Aussehen gibt jede App in ihrem CSS.
   einfuegen() ist die Regel ohne DOM (für die Prüfung). Greift erst beim Aufruf auf document zu. */
"use strict";

(function (KERN) {
  const LOESCHEN = "⌫";

  /**
   * Was nach einem Tipp im Feld steht: { wert, pos } oder null (nichts geändert).
   * wert, von, bis: Inhalt und Auswahl; was: das Zeichen oder LOESCHEN; max: maxlength (0 = ohne Grenze).
   */
  function einfuegen(wert, von, bis, was, max = 0) {
    wert = String(wert ?? "");
    von = Math.max(0, Math.min(von ?? wert.length, wert.length));
    bis = Math.max(von, Math.min(bis ?? von, wert.length));
    if (was === LOESCHEN) {
      if (von !== bis) return { wert: wert.slice(0, von) + wert.slice(bis), pos: von };
      if (!von) return null;
      return { wert: wert.slice(0, von - 1) + wert.slice(von), pos: von - 1 };
    }
    if (max === 1) return { wert: was, pos: was.length }; // ein Häuschen, ein Zeichen
    const neu = wert.slice(0, von) + was + wert.slice(bis);
    if (max && neu.length > max) return null;
    return { wert: neu, pos: von + was.length };
  }

  function tastenfeld({ tasten, ziel, klasse = "tastenfeld", label = "Tasten", ton = () => {}, leer = null }) {
    const el = KERN.el;
    const tippe = taste => {
      const f = ziel();
      if (!f) return;
      const t = typeof taste === "string" ? { text: taste } : taste;
      f.focus();
      if (t.tue) { t.tue(f); f.dispatchEvent(new Event("input", { bubbles: true })); return; }
      const was = t.wert ?? t.text;
      if (was === LOESCHEN && !f.value && leer) { leer(f); return; }
      const max = Number(f.getAttribute("maxlength")) || 0;
      // Ohne Schreibmarke (Ersatz-DOM, nie gewählt) wird hinten angefügt
      const von = typeof f.selectionStart === "number" ? f.selectionStart : f.value.length;
      const bis = typeof f.selectionEnd === "number" ? f.selectionEnd : von;
      const r = einfuegen(f.value, von, bis, was, max);
      if (!r) return;
      f.value = r.wert;
      try { f.setSelectionRange?.(r.pos, r.pos); } catch { /* Felder ohne Schreibmarke */ }
      if (was !== LOESCHEN) ton("tipp");
      f.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const knopf = taste => {
      const t = typeof taste === "string" ? { text: taste } : taste;
      const name = t.label || (t.text === LOESCHEN ? "Löschen" : t.text);
      return el("button", { type: "button", text: t.text, class: t.klasse || null, "aria-label": name, onclick: () => tippe(taste) });
    };
    const element = el("div", { class: klasse, role: "group", "aria-label": label }, ...tasten.map(knopf));
    // Fokus bleibt im gewählten Feld (sonst ginge die Schreibmarke verloren und die Tastatur des Geräts käme)
    element.addEventListener("pointerdown", e => e.preventDefault());
    element.addEventListener("mousedown", e => e.preventDefault());
    return { element, tippe, ziel };
  }

  KERN.tastenfeld = Object.assign(tastenfeld, { einfuegen, LOESCHEN });
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/notizblock.js ---- */
/* Kern — Notizblock für schriftliches Rechnen (Entscheide NB1–NB4 a im Eulenpfad, LERN_Session14; NB1 a–NB4 a für die
   Reihe, LERN_Session19; docs/kern/rahmen.md 4.23). Herkunft: eulenpfad/spiele/gemeinsam/notizblock.js (SCHRIFTLICH).
   KERN.notizblock({ stellen, dezimal, ton, vorn }) → { ziffern, rechne, raster, oeffne, schliessen, verkleinern, knopf, VORLAGEN,
     GLEICHUNG, istOffen, istKlein }
     stellen  Stellen von gross nach klein [{ k, name }] (Standard M … E); dezimal() → "." oder ","; ton(art) (Standard still);
     vorn()  wird gerufen, wenn der Block gross erscheint (geöffnet oder aus „klein“ zurückgeholt) — damit eine App ein
     anderes Feld am selben Platz verkleinern kann (Lernsteig RP1 a: Rechner und Notizblock teilen sich den Platz)
   • verkleinern() — auf die Kopfzeile verkleinern, Inhalt bleibt (wie der Knopf ▁); istKlein() fragt es ab.
   • raster(n, { links, rechts, komma }) — Stellenwerttabelle mit n Stellen (Einer = Spalte 0), links eine Spalte
     für das Rechenzeichen, rechts weitere (× und Faktor). Zeilen: kopf(), zahl(z), reihe(mache), strich().
   • rechne(art, zahlen) — spaltenweise wie auf Papier: Ergebnisziffern und Überträge (+, −, × einstellig). Subtraktion:
     Übertrag wie beim Ergänzen, er kommt unten dazu (mit dem Lehrmittel abzugleichen).
   • oeffne({ beiEingabe, vorlagen, gleichung }) — Notizblock als Feld am Bildrand: Vorlage wählen (+, −, ×, :, Häuschen),
     Zahlen eintippen, darunter rechnen. Nichts wird geprüft, nichts übernommen, nichts gespeichert (NB3 a Eulenpfad);
     schliessen() leert ihn. vorlagen: Kennungen der angebotenen Vorlagen in ihrer Reihenfolge (Standard + − × : frei).
   Mal mit Komma in der zweiten Zahl (NB3 a, LERN_Session19): gerechnet wird ohne Komma, darunter die Kommaregel als Zeile.
   Vorlage „=“ Gleichung (GL1 a, LERN_Session20): Zeilen untereinander, je Zeile die Gleichung und rechts vom Strich die
   Umformung („−3“, „:5“); oben steht gleichung (die der Aufgabe; eine Liste bei einem System, je Gleichung eine Zeile),
   „＋ Zeile“ schreibt die letzte Zeile ab. Nur wer sie in
   vorlagen nennt, bietet sie an. Die Ziffern tippt das Tastenfeld (KERN.tastenfeld), bei einer Gleichung dazu die Zeichen.
   Aussehen (Klassen .schriftlich, .notizblock, .nb-*) gibt jede App in ihrem CSS. Greift erst beim Aufruf auf document zu. */
"use strict";

(function (KERN) {
  const STELLEN_STANDARD = [
    { k: "M", name: "Millionen" }, { k: "HT", name: "Hunderttausender" }, { k: "ZT", name: "Zehntausender" },
    { k: "T", name: "Tausender" }, { k: "H", name: "Hunderter" }, { k: "Z", name: "Zehner" }, { k: "E", name: "Einer" },
  ];
  /** Ziffern einer Zahl, Einer zuerst: 347 → [7, 4, 3]. */
  const ziffern = n => String(n).split("").reverse().map(Number);
  const MAX_STELLEN = 7; // bis zur Million
  const MAX_NACHKOMMA = 3;
  const MAX_SCHRITTE = 6; // Rechnungen auf einem Blatt
  const PLUS_MINUS = new Set(["+", "−"]);

  /**
   * Rechnet spaltenweise wie auf Papier: Ziffern des Ergebnisses r (Einer zuerst) und Überträge
   * ueber[i] = Übertrag, der in Spalte i ankommt (ueber[0] = 0). Bei − kommt der Übertrag unten dazu.
   */
  function rechne(art, zahlen) {
    const ergebnis = art === "+" ? zahlen.reduce((s, z) => s + z, 0) : art === "−" ? zahlen[0] - zahlen[1] : zahlen[0] * zahlen[1];
    const n = String(Math.max(ergebnis, 0)).length;
    const r = [];
    const ueber = [0];
    for (let i = 0; i < n; i++) {
      const c = ueber[i];
      if (art === "+") {
        const s = zahlen.reduce((t, z) => t + (ziffern(z)[i] || 0), 0) + c;
        r.push(s % 10); ueber.push(Math.floor(s / 10));
      } else if (art === "−") {
        const s = (ziffern(zahlen[0])[i] || 0) - (ziffern(zahlen[1])[i] || 0) - c;
        r.push((s + 10) % 10); ueber.push(s < 0 ? 1 : 0);
      } else {
        const s = (ziffern(zahlen[0])[i] || 0) * zahlen[1] + c;
        r.push(s % 10); ueber.push(Math.floor(s / 10));
      }
    }
    return { ergebnis, r, ueber };
  }

  /** Zahl aus einem Eingabefeld: { ganz, nach } (Ziffern vor und nach Punkt oder Komma), höchstens 7 und 3; sonst null. */
  const zahlAus = t => {
    const m = /^(\d{1,7})(?:[.,](\d{1,3}))?$/.exec(String(t).replace(/[\s ]/g, ""));
    return m ? { ganz: m[1], nach: m[2] || "" } : null;
  };
  /** Ganze Zahl mit k Nachkommastellen: 129.4 bei k = 2 → 12940 (so stehen alle Zahlen am Komma untereinander). */
  const mitStellen = (z, k) => Number(z.ganz + z.nach.padEnd(k, "0"));
  /** Stellen, die das Raster einer Vorlage braucht (höchstens MAX_STELLEN, so weit reichen die Stellen E … M). */
  const spalten = (art, zahlen) => {
    const len = z => String(z).length;
    return PLUS_MINUS.has(art) ? Math.max(...zahlen.map(len)) + 1 : art === "×" ? len(zahlen[0]) + len(zahlen[1]) : len(zahlen[0]);
  };
  /** Kommaregel des Malrechnens als Satz (NB3 a): „2 + 1 = 3 Stellen nach dem Komma“. */
  const kommaregel = (ka, kb) => `${ka} + ${kb} = ${ka + kb} ${ka + kb === 1 ? "Stelle" : "Stellen"} nach dem Komma`;

  // Plus und Minus lassen sich in einer Spalte mischen (Wunsch Patrik, LERN_Session15): jede Zahl trägt ihr Zeichen,
  // Antippen wechselt es. Die Vorlage bestimmt nur, mit welchem Zeichen eine neue Zahl beginnt.
  const VORLAGEN = [
    { id: "+", text: "+ Plus", zahlen: [2, 4], hinweis: "Zahlen untereinander, dann von rechts rechnen. Tipp aufs Zeichen, dann wird aus + ein −." },
    { id: "−", text: "− Minus", zahlen: [2, 4], hinweis: "Oben die grösste Zahl. Tipp aufs Zeichen, dann wird aus − ein +." },
    { id: "×", text: "× Mal", zahlen: [2, 2], hinweis: "Mit einer mehrstelligen Zahl: je Ziffer eine Zeile, dann zusammenzählen. Mit Komma: zuerst ohne Komma rechnen." },
    { id: ":", text: ": Geteilt", zahlen: [2, 2], hinweis: "Rechts das Ergebnis, darunter Platz für die Schritte." },
    { id: "frei", text: "▦ Häuschen", zahlen: [0, 0], hinweis: "Häuschenpapier: schreib hin, was dir hilft." },
  ];
  // Gleichung umformen (GL1 a): nicht unter den Standard-Vorlagen, die App nennt sie (Lernsteig je Übung im Katalog)
  const GLEICHUNG = { id: "=", text: "= Gleichung", zahlen: [0, 0],
    hinweis: "Rechts vom Strich, was du auf beiden Seiten tust (−3, :5). „＋ Zeile“ schreibt die letzte Zeile ab." };
  const MAX_ZEILEN = 10; // Zeilen einer Gleichung
  /** Lösung in der letzten Zeile einer Gleichung („x = 2.5“) als Zahl zum Weiterrechnen, sonst "". */
  const loesungAus = t => {
    const m = /^\s*[a-z]\s*=\s*(\d[\d\s]*(?:[.,]\d+)?)\s*$/.exec(String(t));
    return m && zahlAus(m[1]) ? m[1].replace(/\s/g, "") : "";
  };

  function notizblock({ stellen = STELLEN_STANDARD, dezimal = () => ".", ton = () => {}, vorn = () => {} } = {}) {
    const el = KERN.el;
    const STELLEN_RECHTS = stellen.slice().reverse(); // E, Z, H, T, ZT, HT, M
    const kommaZeichen = () => (dezimal() === "," ? "," : ".");

    // Stellen nach dem Komma (Hinweis Patrik, LERN_Session14): z, h, t wie in der Schule, in neutraler Farbe — die
    // Farben der Stellen (Eulenpfad: Calcularis) gehören den Stellen E … M, ein „z“ in Blau sähe aus wie die Zehner.
    const NACHKOMMA = [{ k: "z", name: "Zehntel" }, { k: "h", name: "Hundertstel" }, { k: "t", name: "Tausendstel" }];

    /**
     * Stellenwerttabelle (Klasse schriftlich); --spalten setzt sie selbst. komma: so viele Spalten rechts stehen nach dem
     * Komma (Spalte 0 ist dann die letzte Nachkommastelle); eine senkrechte Linie trennt sie von den Einern.
     */
    function raster(n, { links = 1, rechts = 0, beschriftung = "Stellenwerttabelle", komma = 0 } = {}) {
      const box = el("div", { class: "schriftlich", role: "group", "aria-label": beschriftung });
      box.style.setProperty("--spalten", links + n + rechts);
      // Häuschen: breiter als die Stellen, dann ohne Namen
      const stelle = i => (i < komma ? NACHKOMMA[komma - 1 - i] : STELLEN_RECHTS[i - komma]) || { k: "", name: `Spalte ${i + 1}` };
      const stKlasse = i => (i < komma ? "st-nk" : `st st-${stelle(i).k}`);
      const leer = () => el("div", {});
      /** Eine Zeile: links die Zeichen, je Stelle eine Zelle aus mache(i) (von links nach rechts gesetzt), rechts weitere. */
      const zeile = (mache, { zeichen = [], rechts: r = [] } = {}) => {
        for (let j = 0; j < links; j++) box.append(typeof zeichen[j] === "object" && zeichen[j] ? zeichen[j] : el("div", { class: "zeichen", text: zeichen[j] ?? "" }));
        const zellen = [];
        for (let i = n - 1; i >= 0; i--) {
          zellen[i] = mache(i) || leer();
          if (komma && i === komma - 1) zellen[i].classList.add("nach-komma"); // Kommalinie links davon
          box.append(zellen[i]);
        }
        for (let j = 0; j < rechts; j++) box.append(typeof r[j] === "object" && r[j] ? r[j] : el("div", { class: "zeichen", text: r[j] ?? "" }));
        return zellen;
      };
      return {
        element: box, stelle, stKlasse,
        kopf: () => zeile(i => el("div", { class: `kopfzelle ${stKlasse(i)}`, text: stelle(i).k })),
        zahl: (z, optionen = {}) => {
          const zf = ziffern(z);
          // Mit Komma steht vor ihm mindestens die Null: 0.45, nicht .45
          const ziffer = i => (zf[i] !== undefined ? zf[i] : komma && i <= komma ? 0 : undefined);
          return zeile(i => (ziffer(i) === undefined ? null : el("div", { class: `ziffer ${stKlasse(i)}`, text: String(ziffer(i)) })),
            { ...optionen, zeichen: [optionen.zeichen ?? ""] });
        },
        reihe: (mache, optionen = {}) => zeile(mache, { ...optionen, zeichen: Array.isArray(optionen.zeichen) ? optionen.zeichen : [optionen.zeichen ?? ""] }),
        strich: () => { const s = el("div", { class: "strich" }); box.append(s); return s; },
      };
    }

    let offen = null; // { panel, beiEingabe }

    /** Ein Häuschen zum Eintippen: eine Ziffer (oder ein Zeichen), danach geht es weiter nach links oder rechts. */
    function feld(klasse, richtung, label) {
      return el("input", { class: "nb-feld " + klasse, type: "text", inputmode: "numeric", maxlength: "1", autocomplete: "off",
        "aria-label": label, "data-richtung": richtung });
    }
    /** Weitergehen: im selben Raster das nächste Feld derselben Zeile in Schreibrichtung. */
    function weiter(f, vorwaerts) {
      const zeile = [...f.parentElement.querySelectorAll(`.nb-feld[data-zeile="${f.dataset.zeile}"]`)];
      const i = zeile.indexOf(f);
      const nach = f.dataset.richtung === "links" ? (vorwaerts ? -1 : 1) : (vorwaerts ? 1 : -1);
      zeile[i + nach]?.focus();
    }

    /**
     * Raster zur gewählten Vorlage mit den Zahlen; Eingabefelder für Überträge, Zwischenzeilen, Ergebnis.
     * vorzeichen: bei Plus und Minus das Zeichen jeder Zahl (die erste ohne), sonst ungenutzt.
     * regel: bei Mal mit Komma in der zweiten Zahl die Kommaregel { ka, kb } — dann ohne Komma gerechnet (NB3 a).
     */
    function baueRaster(art, zahlen, komma = 0, vorzeichen = [], regel = null) {
      let zeilenNr = 0;
      const reiheFelder = (r, klasse, label, { ab = 0, richtung = "links", zeichen = "" } = {}) => {
        const nr = zeilenNr++;
        return r.reihe(i => {
          if (i < ab) return null;
          const f = feld(klasse, richtung, `${label}, ${r.stelle(i).name || r.stelle(i).k}`);
          f.dataset.zeile = nr;
          return f;
        }, { zeichen });
      };
      if (art === "frei") {
        const r = raster(10, { links: 0, beschriftung: "Häuschenpapier" });
        for (let z = 0; z < 8; z++) reiheFelder(r, "karo", `Häuschen Zeile ${z + 1}`, { richtung: "rechts" });
        return r.element;
      }
      if (PLUS_MINUS.has(art)) {
        const n = Math.max(spalten(art, zahlen), komma + 1);
        const r = raster(n, { komma });
        r.kopf();
        zahlen.forEach((z, j) => r.zahl(z, { zeichen: j ? vorzeichen[j] || art : "" }));
        reiheFelder(r, "uebertrag", "Übertrag");
        r.strich();
        reiheFelder(r, "erg", "Ergebnis");
        return r.element;
      }
      if (art === "×") {
        const [a, b] = zahlen;
        const k = String(b).length;
        // mit Kommaregel mindestens eine Spalte vor den Stellen nach dem Komma (0.47 · 0.8 = 0.376: Platz für die 0)
        const n = Math.max(spalten(art, zahlen), komma + 1, regel ? regel.ka + regel.kb + 1 : 0);
        const r = raster(n, { links: 1, rechts: 1 + k, komma });
        r.kopf();
        r.zahl(a, { rechts: ["×", ...String(b).split("")] });
        if (k === 1) {
          reiheFelder(r, "uebertrag", "Übertrag");
          r.strich();
          reiheFelder(r, "erg", "Ergebnis");
        } else {
          r.strich();
          // Je Ziffer des zweiten Faktors eine Zeile, um eine Stelle versetzt wie auf dem Blatt (höchste Ziffer zuerst).
          for (let j = 0; j < k; j++) reiheFelder(r, "teil", `Teilprodukt ${j + 1}`, { ab: k - 1 - j, zeichen: j ? "+" : "" });
          reiheFelder(r, "uebertrag", "Übertrag");
          r.strich();
          reiheFelder(r, "erg", "Ergebnis");
        }
        if (!regel) return r.element;
        // Mit Komma in beiden Zahlen: oben ohne Komma gerechnet, darunter die Kommaregel (NB3 a)
        return el("div", { class: "nb-mal-komma" }, r.element, el("p", { class: "nb-kommaregel", text: kommaregel(regel.ka, regel.kb) }));
      }
      // Geteilt: a : b = Ergebnis in einer Zeile, darunter Häuschen unter a für die Schritte (mit Zeichenspalte).
      const [a, b] = zahlen;
      const n = Math.max(String(a).length, komma + 1);
      const ergFelder = Array.from({ length: n }, (_, i) => { const f = feld("erg", "rechts", `Ergebnis Ziffer ${i + 1}`); f.dataset.zeile = "q"; return f; });
      const r = raster(n, { links: 1, rechts: 2 + String(b).length + n, beschriftung: "Schriftlich teilen", komma });
      r.kopf();
      r.zahl(a, { rechts: [":", ...String(b).split(""), "=", ...ergFelder] });
      for (let z = 0; z < 2 * n; z++) {
        const zeichen = feld("teil", "rechts", `Zeichen Zeile ${z + 1}`);
        zeichen.dataset.zeile = `t${z}`;
        zeichen.inputMode = "text";
        const nr = `t${z}`;
        r.reihe(i => { const f = feld("teil", "rechts", `Schritt Zeile ${z + 1}, ${r.stelle(i).k}`); f.dataset.zeile = nr; return f; }, { zeichen: [zeichen] });
      }
      return r.element;
    }

    /**
     * Was ins Ergebnis einer Rechnung geschrieben wurde, als Zahl zum Weiterrechnen ("" bei Lücken oder ohne Ergebnis).
     * Plus, Minus, Mal: Felder rechtsbündig, die letzten komma stehen nach dem Komma. Geteilt: von links.
     */
    function geschrieben(element, art, komma) {
      const t = [...element.querySelectorAll(".nb-feld.erg")].map(f => f.value.trim());
      if (art === ":" && komma) return ""; // Komma im Ergebnis der Division steht nirgends fest
      const erste = t.findIndex(Boolean);
      if (erste < 0) return "";
      let ende = t.length;
      if (art === ":") while (ende > erste && !t[ende - 1]) ende--;
      if (art !== ":" && komma && erste > t.length - komma - 1) return ""; // keine Ziffer vor dem Komma
      const z = t.slice(erste, ende);
      if (z.some(c => !/^\d$/.test(c))) return "";
      const ganz = (art === ":" || !komma ? z : z.slice(0, z.length - komma)).join("").replace(/^0+(?=\d)/, "");
      return art === ":" || !komma ? ganz : `${ganz}${kommaZeichen()}${z.slice(z.length - komma).join("")}`;
    }

    /**
     * Den Notizblock öffnen (oder nach vorn holen). beiEingabe: wird gerufen, sobald etwas hineingeschrieben wird.
     * Ein Blatt mit bis zu MAX_SCHRITTE Rechnungen untereinander (Wunsch Patrik, LERN_Session15): Unter jede geschriebene
     * Rechnung lässt sich eine neue hängen, ihre erste Zahl ist das, was als Ergebnis geschrieben wurde.
     */
    function oeffne({ beiEingabe, vorlagen = null, gleichung = "" } = {}) {
      if (offen) { gross(true); offen.panel.querySelector("button, input")?.focus(); return; }
      const ALLE = [...VORLAGEN, GLEICHUNG];
      const startZeilen = [].concat(gleichung || []); // eine Gleichung oder ein System (je Gleichung eine Zeile)
      const angeboten = vorlagen ? vorlagen.map(id => ALLE.find(v => v.id === id)).filter(Boolean) : VORLAGEN;
      const blatt = el("div", { class: "nb-blatt" });
      const wahl = el("div", { class: "nb-vorlagen", role: "group", "aria-label": "Rechnung wählen" });
      const wahlTitel = el("b", { class: "nb-wahl-titel", text: "Rechnung wählen:" });
      const wahlBox = el("div", { class: "nb-wahl" }, wahlTitel, wahl);
      const schritte = []; // { vorlage, box, fertig, ergebnis() }

      const aktualisiereWahl = () => {
        const letzter = schritte.at(-1);
        wahlTitel.textContent = schritte.some(s => s.fertig) ? "Weiterrechnen:" : "Rechnung wählen:";
        wahlBox.hidden = schritte.length >= MAX_SCHRITTE && !!letzter?.fertig;
        wahl.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(!!letzter && !letzter.fertig && b.dataset.vorlage === letzter.vorlage.id)));
        schritte.forEach((s, j) => { s.nr.textContent = `${j + 1}.`; });
      };
      const entferne = s => { s.box.remove(); schritte.splice(schritte.indexOf(s), 1); aktualisiereWahl(); };

      /** Gleichung umformen (GL1 a): Zeilen „Gleichung | Umformung“, oben die Gleichung der Aufgabe. */
      const baueGleichung = v => {
        const liste = el("div", { class: "nb-gleichung", role: "group", "aria-label": "Gleichung umformen" });
        const eingabe = (klasse, label, platz) => el("input", { class: `feld ${klasse}`, type: "text", inputmode: "none", autocomplete: "off",
          spellcheck: "false", "aria-label": label, placeholder: platz });
        const zeile = text => {
          const n = liste.children.length + 1;
          const gl = eingabe("nb-gl", `Gleichung Zeile ${n}`, "… = …");
          gl.value = text || "";
          liste.append(el("div", { class: "nb-gl-zeile" }, gl, el("span", { class: "nb-strich", text: "|", "aria-hidden": "true" }),
            eingabe("nb-umf", `Umformung nach Zeile ${n}`, "−3")));
          return gl;
        };
        if (startZeilen.length) startZeilen.forEach(zeile); else zeile("");
        const mehr = el("button", { type: "button", class: "knopf hell klein", text: "＋ Zeile", onclick: () => {
          const f = zeile([...liste.querySelectorAll(".nb-gl")].pop().value);
          f.focus();
          zeigeZeichen();
          try { f.setSelectionRange?.(f.value.length, f.value.length); } catch { /* ohne Schreibmarke */ }
          if (liste.children.length >= MAX_ZEILEN) mehr.disabled = true;
          beiEingabe?.();
        } });
        return el("div", {}, liste, el("div", { class: "nb-zahlen-knoepfe" }, mehr), el("p", { class: "leise-text nb-hinweis", text: v.hinweis }));
      };

      const neuerSchritt = v => {
        // Eine Rechnung, die noch nicht untereinander steht, wird durch die neue Wahl ersetzt
        if (schritte.at(-1) && !schritte.at(-1).fertig) entferne(schritte.at(-1));
        const vorher = schritte.at(-1);
        const start = v.id !== "frei" && vorher ? vorher.ergebnis() : "";
        const nr = el("b", { class: "nb-nr" });
        const titel = el("span", { class: "nb-schritt-titel", text: v.text });
        const s = { vorlage: v, fertig: false, nr, ergebnis: () => "" };
        const weg = el("button", { type: "button", class: "nb-zu nb-weg", text: "✕", "aria-label": "Diese Rechnung wegnehmen", title: "Diese Rechnung wegnehmen", onclick: () => entferne(s) });
        const flaeche = el("div", { class: "nb-flaeche" });
        s.box = el("section", { class: "nb-schritt" }, el("div", { class: "nb-schritt-kopf" }, nr, titel, weg), flaeche);
        schritte.push(s);
        blatt.append(s.box);
        if (v.id === "frei") {
          flaeche.append(baueRaster("frei", []));
          s.fertig = true;
          aktualisiereWahl();
          flaeche.querySelector(".nb-feld")?.focus();
          return;
        }
        if (v.id === "=") {
          flaeche.append(baueGleichung(v));
          s.fertig = true;
          s.ergebnis = () => loesungAus([...flaeche.querySelectorAll(".nb-gl")].pop()?.value);
          aktualisiereWahl();
          const erste = flaeche.querySelector(".nb-gl");
          if (erste.value) flaeche.querySelector(".nb-umf").focus(); else erste.focus();
          zeigeZeichen(); // auch ohne focusin (Ersatz-DOM)
          s.box.scrollIntoView?.({ block: "nearest" });
          return;
        }
        const felder = [];
        const zeichen = []; // je Zahl ihr Zeichen (die erste ohne)
        const zeile = el("div", { class: "nb-zahlen-zeile" });
        const neuesFeld = () => {
          const j = felder.length;
          const f = el("input", { class: "feld nb-zahl", type: "text", inputmode: "none", maxlength: String(MAX_STELLEN + 1 + MAX_NACHKOMMA), autocomplete: "off",
            "aria-label": `Zahl ${j + 1}`, placeholder: "Zahl" });
          felder.push(f);
          zeichen.push(j ? v.id : "");
          if (j) {
            zeile.append(PLUS_MINUS.has(v.id)
              ? el("button", { type: "button", class: "nb-op nb-op-wechsel", text: v.id, "aria-label": `Zeichen vor Zahl ${j + 1}: ${v.id === "+" ? "Plus" : "Minus"}, antippen wechselt`,
                onclick: e => {
                  zeichen[j] = zeichen[j] === "+" ? "−" : "+";
                  e.currentTarget.textContent = zeichen[j];
                  e.currentTarget.setAttribute("aria-label", `Zeichen vor Zahl ${j + 1}: ${zeichen[j] === "+" ? "Plus" : "Minus"}, antippen wechselt`);
                } })
              : el("span", { class: "nb-op", text: v.id }));
          }
          zeile.append(f);
          return f;
        };
        for (let j = 0; j < v.zahlen[0]; j++) neuesFeld();
        if (start) felder[0].value = start;
        const mehr = v.zahlen[1] > v.zahlen[0] ? el("button", { type: "button", class: "knopf hell klein", text: "＋ Zahl", onclick: () => {
          neuesFeld().focus();
          if (felder.length >= v.zahlen[1]) mehr.remove();
        } }) : null;
        const meldung = el("span", { class: "leise-text", "aria-live": "polite" });
        const eingabe = el("div", { class: "nb-zahlen" });
        const los = el("button", { type: "button", class: "knopf klein", text: "Untereinander schreiben ➜", onclick: () => {
          const roh = felder.map(f => zahlAus(f.value));
          if (roh.some(z => z === null)) { meldung.textContent = "Bitte jede Zahl eintippen (höchstens 7 Ziffern, 3 nach dem Komma)."; return; }
          // Plus und Minus: alle Zahlen am Komma ausrichten. Geteilt: nur die erste Zahl darf ein Komma haben.
          // Mal (NB3 a): hat die zweite Zahl ein Komma, wird ohne Komma gerechnet und die Kommaregel darunter geschrieben.
          const mitKomma = PLUS_MINUS.has(v.id);
          if (v.id === ":" && roh[1].nach) { meldung.textContent = "Beim Teilen darf nur die erste Zahl ein Komma haben."; return; }
          const regel = v.id === "×" && roh[1].nach ? { ka: roh[0].nach.length, kb: roh[1].nach.length } : null;
          const komma = regel ? 0 : mitKomma ? Math.max(...roh.map(z => z.nach.length)) : roh[0].nach.length;
          const zahlen = regel ? roh.map(z => Number(z.ganz + z.nach))
            : roh.map((z, j) => (mitKomma || j === 0 ? mitStellen(z, komma) : Number(z.ganz)));
          if (mitKomma && zahlen.reduce((t, z, j) => (j && zeichen[j] === "−" ? t - z : t + z), 0) < 0) {
            meldung.textContent = "Das Ergebnis wäre kleiner als 0: Oben muss mehr stehen, als weggenommen wird."; return;
          }
          if (v.id === ":" && zahlen[1] === 0) { meldung.textContent = "Durch 0 kann man nicht teilen."; return; }
          if (spalten(v.id, zahlen) - komma > MAX_STELLEN) { meldung.textContent = "Das wird zu breit: Der Notizblock geht bis zur Million."; return; }
          const raster = baueRaster(v.id, zahlen, komma, zeichen, regel);
          eingabe.remove();
          flaeche.append(raster);
          titel.textContent = felder.map((f, j) => (j ? ` ${zeichen[j]} ` : "") + f.value.replace(/\s/g, "")).join("");
          s.fertig = true;
          // Weiterrechnen mit dem Ergebnis: bei der Kommaregel stehen ka + kb Stellen nach dem Komma
          s.ergebnis = () => geschrieben(raster, v.id, regel ? regel.ka + regel.kb : komma);
          aktualisiereWahl();
          if (v.id === ":") raster.querySelector(".nb-feld.erg")?.focus();
          else [...raster.querySelectorAll(".nb-feld.erg")].pop()?.focus(); // Einer zuerst
          s.box.scrollIntoView?.({ block: "nearest" });
          beiEingabe?.();
        } });
        eingabe.append(zeile, el("div", { class: "nb-zahlen-knoepfe" }, mehr, los, meldung), el("p", { class: "leise-text nb-hinweis", text: start
          ? "Oben steht dein Ergebnis von eben. Du kannst es ändern." : v.hinweis }));
        flaeche.before(eingabe);
        aktualisiereWahl();
        (start ? felder[1] : felder[0]).focus();
        s.box.scrollIntoView?.({ block: "nearest" });
      };

      // Eigenes Ziffernfeld (Hinweis Patrik, LERN_Session14): Die Ziffern der App sind neben dem Block teils verdeckt,
      // und in die Zahlenfelder schrieben sie nicht. Es schreibt in das gewählte Feld des Blocks — Zahl oder Häuschen —,
      // ohne ihm den Fokus zu nehmen; ohne Wahl in das erste leere Zahlenfeld. Es steht fest unten im Block (LERN_Session15).
      let zuletzt = null;
      const ziel = () => {
        const a = document.activeElement;
        if (a && panel.contains(a) && a.matches("input")) return a;
        if (zuletzt?.isConnected) return zuletzt;
        return [...panel.querySelectorAll(".nb-zahl")].find(f => !f.value) || panel.querySelector(".nb-zahl, .nb-feld, .nb-gl");
      };
      // Das Tastenfeld des Kerns (TF1 a): Ziffern wie bisher; ⌫ im leeren Häuschen geht eines zurück
      const tasten = KERN.tastenfeld({ klasse: "nb-tasten", label: "Ziffern für den Notizblock", ziel, ton,
        leer: f => { if (f.classList.contains("nb-feld")) weiter(f, false); },
        tasten: ["1", "2", "3", "4", "5", { text: kommaZeichen(), label: "Komma" }, "6", "7", "8", "9", "0", "⌫"] }).element;
      // Bei einer Gleichung dazu die Zeichen, nur solange ein Feld der Gleichung gewählt ist (GL1 a): ihre Variablen
      // (ohne Gleichung x), Rechenzeichen, Klammern, =; ² und / nur, wenn die Gleichung sie hat (x², 3/x)
      const text = startZeilen.join(" ");
      const variablen = [...new Set(text.match(/[a-z]/g) || ["x"])];
      const zeichenFeld = angeboten.includes(GLEICHUNG) ? KERN.tastenfeld({ klasse: "nb-tasten nb-zeichen", label: "Zeichen für die Gleichung", ziel, ton,
        tasten: [...variablen, "+", { text: "−", label: "Minus" }, { text: "·", label: "Mal" }, { text: ":", label: "Geteilt" }, "(", ")", "=",
          ...(/²/.test(text) ? ["²"] : []), ...(/\//.test(text) ? [{ text: "/", label: "Bruchstrich" }] : [])] }).element : null;
      if (zeichenFeld) zeichenFeld.hidden = true;
      const zeigeZeichen = () => { if (zeichenFeld) zeichenFeld.hidden = !ziel()?.matches?.(".nb-gl, .nb-umf"); };
      for (const v of angeboten) wahl.append(el("button", { type: "button", class: "chip", "data-vorlage": v.id, "aria-pressed": "false", text: v.text,
        onclick: () => neuerSchritt(v) }));
      const zu = el("button", { type: "button", class: "nb-zu", "aria-label": "Notizblock schliessen", title: "Schliessen (leert den Block)", text: "✕", onclick: schliessen });
      const klein = el("button", { type: "button", class: "nb-zu", "aria-label": "Notizblock verkleinern", title: "Verkleinern", text: "▁",
        onclick: () => gross(panel.classList.contains("klein")) });
      const panel = el("aside", { class: "notizblock", role: "dialog", "aria-label": "Notizblock" },
        el("div", { class: "nb-kopf" }, el("b", { text: "📝 Notizblock" }), el("span", { class: "leise-text", text: "wird nicht bewertet" }), klein, zu),
        el("div", { class: "nb-inhalt" }, blatt, wahlBox),
        el("div", { class: "nb-fuss" }, zeichenFeld, tasten));
      // Ziffer getippt: weiter in Schreibrichtung; Rücktaste im leeren Feld: zurück. Erstes Hineinschreiben meldet beiEingabe.
      panel.addEventListener("focusin", e => { if (e.target.matches?.("input")) { zuletzt = e.target; e.target.inputMode = "none"; zeigeZeichen(); } });
      panel.addEventListener("input", e => {
        const f = e.target;
        if (f.classList?.contains("nb-feld") && f.value) weiter(f, true);
        if (f.value) beiEingabe?.();
      });
      panel.addEventListener("keydown", e => {
        const f = e.target;
        if (f.classList?.contains("nb-feld") && e.key === "Backspace" && !f.value) { e.preventDefault(); weiter(f, false); }
        e.stopPropagation(); // Kurztasten der App und Enter der Rückmeldung nicht auslösen, solange hier getippt wird
      });
      document.body.append(panel);
      document.body.classList.add("mit-notizblock");
      offen = { panel, beiEingabe };
      vorn();
      wahl.querySelector("button").focus();
    }

    /** Gross (true) oder auf die Kopfzeile verkleinert (false); gross meldet vorn(). */
    function gross(an) {
      if (!offen) return;
      offen.panel.classList.toggle("klein", !an);
      document.body.classList.toggle("notizblock-klein", !an);
      if (an) vorn();
    }
    const verkleinern = () => gross(false);

    /** Schliessen und leeren (Knopf ✕ oder neue Aufgabe). */
    function schliessen() {
      offen?.panel.remove();
      if (typeof document !== "undefined") document.body.classList.remove("mit-notizblock", "notizblock-klein");
      offen = null;
    }

    /** Knopf „📝 Notizblock“; beiEingabe wie bei oeffne. klasse: Klassen des Knopfs in der App. */
    const knopf = (beiEingabe, { klasse = "knopf hell klein", vorlagen = null, gleichung = "" } = {}) => el("button", { type: "button", class: `${klasse} nb-knopf`, text: "📝 Notizblock",
      title: "Schriftlich rechnen wie auf einem Blatt — wird nicht bewertet", onclick: () => oeffne({ beiEingabe, vorlagen, gleichung }) });

    return { ziffern, rechne, raster, oeffne, schliessen, verkleinern, knopf, VORLAGEN, GLEICHUNG, istOffen: () => !!offen,
      istKlein: () => !!offen && offen.panel.classList.contains("klein") };
  }

  KERN.notizblock = Object.assign(notizblock, { rechne, ziffern, zahlAus, kommaregel, loesungAus, VORLAGEN, GLEICHUNG, STELLEN: STELLEN_STANDARD, MAX_STELLEN, MAX_NACHKOMMA, MAX_ZEILEN });
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/uebersicht.js ---- */
/* Kern — Bausteine einer Übersicht mit Kacheln (Entscheid KT1 a, LERN_Session23; docs/kern/rahmen.md 4.26).
   Herkunft: Tab Spiele des Eulenpfads (eulenpfad/start/spiele.js) und Tab Übungen des Lernsteigs
   (lernsteig/start/uebungen.js), wo dieselbe Bedienung zweimal stand und schon auseinanderlief.
   KERN.uebersicht.gruppen({ zu, merke })        → { gruppe({ id, kopf, anzahl }, …inhalt), zu() }
     aufklappbare Gruppe details.gruppe[data-gruppe]; was zugeklappt ist, sammelt eine Menge je Zeichnen und geht
     über merke(liste) an die App (Profil, Konto) — nur wenn sich etwas ändert.
   KERN.uebersicht.filterBlock({ titel, aktiv, leer, zeilen, zu, merke, schmal }) → details.filter-klapp
     Kopfzeile nennt, was gilt; zu (true/false/undefined) aus der App, merke(zuBool) beim Auf- und Zuklappen.
   KERN.uebersicht.filterOffen(zu, schmal)       → offen? (ohne Wahl der Person auf dem Handy zu, sonst offen)
   KERN.uebersicht.schmal()                      → Handy-Breite (max-width: 560px)?
   KERN.uebersicht.suche()                       → { text, feld({ neu, attr, beiEingabe }) }
     Suchtext, der das Neuzeichnen überlebt (nicht gespeichert), und ein Feld, das danach den Fokus zurückholt.
   KERN.uebersicht.aehnlich                      → { id(search), schliessen() } für „?aehnlich=<id>“
   KERN.uebersicht.sortWahl({ arten, wahl, pfeile, setze, knopf, beschriftung, feld }) → label.sortier-wahl
   KERN.uebersicht.umschalten(liste, id)         → neue Liste mit id dazu (hinten) oder ohne id (Favoriten)
   KERN.uebersicht.stern(an), STERN              → Favoriten-Stern svg.symbol.stern(.an), Form als Pfad
   Speichern, Knöpfe (chip) und Aussehen gibt die App; der Kern kennt keine App. Nötige Klassen im CSS der App:
   .gruppe, .gruppe > summary .anzahl, .filter-klapp, .filter-titel, .filter-aktiv, .filter, .sortier-wahl.
   Greift erst beim Aufruf auf document, location, history und matchMedia zu, nie beim Laden (in Node ladbar). */
"use strict";

(function (KERN) {
  const STERN = '<path d="M12 2.6l2.85 6 6.55.82-4.85 4.55 1.27 6.5L12 17.3l-5.82 3.17 1.27-6.5L2.6 9.42l6.55-.82z"/>';
  const SCHMAL = "(max-width: 560px)";

  /** Neue Liste: id dazu (hinten), wenn sie fehlt, sonst ohne id. Die Eingabe bleibt unverändert. */
  function umschalten(liste, id) {
    const l = Array.isArray(liste) ? liste : [];
    return l.includes(id) ? l.filter(x => x !== id) : l.concat(id);
  }

  /** Kopf einer Gruppe: Text wird ein span, Elemente und Listen bleiben. */
  const kopfTeile = kopf => [].concat(kopf).map(k => (typeof k === "string" ? KERN.el("span", { text: k }) : k));

  /**
   * Gruppen eines Zeichnens. zu: Liste der zugeklappten Gruppen-Ids aus dem Speicher der App; merke(liste) speichert.
   * Eine Gruppe ist offen, wenn ihre Id nicht in zu steht; das Umschalten führt die Menge nach und meldet sie nur bei
   * einer Änderung (der Browser meldet „toggle“ auch, wenn das Zeichnen open setzt).
   */
  function gruppen({ zu = [], merke } = {}) {
    if (typeof merke !== "function") throw new Error("gruppen: merke fehlt");
    const menge = new Set(Array.isArray(zu) ? zu : []);
    function gruppe({ id, kopf, anzahl = null }, ...inhalt) {
      if (!id) throw new Error("gruppe: id fehlt");
      const d = KERN.el("details", { class: "gruppe", "data-gruppe": id },
        KERN.el("summary", {}, ...kopfTeile(kopf), anzahl === null ? null : KERN.el("span", { class: "anzahl", text: `${anzahl}` })),
        ...inhalt);
      d.open = !menge.has(id);
      d.addEventListener("toggle", () => {
        if (d.open !== menge.has(id)) return; // unverändert
        if (d.open) menge.delete(id); else menge.add(id);
        merke([...menge]);
      });
      return d;
    }
    return { gruppe, zu: () => [...menge] };
  }

  /** Offen? Eine gemerkte Wahl der Person gilt; ohne Wahl auf dem Handy zu, sonst offen. */
  const filterOffen = (zu, schmal) => (typeof zu === "boolean" ? !zu : !schmal);
  const schmal = () => typeof matchMedia === "function" && matchMedia(SCHMAL).matches;

  /**
   * Einklappbarer Filter: Kopfzeile mit titel und dem, was gilt (aktiv, Liste von Texten; leer, wenn nichts gilt),
   * darunter die Zeilen der App. zu und merke wie bei filterOffen; schmal ohne Angabe aus der Breite des Bildschirms.
   */
  function filterBlock({ titel = "Filter", aktiv = [], leer = "", zeilen = [], zu, merke, schmal: istSchmal } = {}) {
    if (typeof merke !== "function") throw new Error("filterBlock: merke fehlt");
    const liste = aktiv.filter(Boolean);
    const d = KERN.el("details", { class: "filter-klapp" },
      KERN.el("summary", {}, KERN.el("span", { class: "filter-titel", text: titel }),
        KERN.el("span", { class: "filter-aktiv", text: liste.length ? liste.join(" · ") : leer })),
      KERN.el("div", { class: "filter" }, ...zeilen));
    const offen = filterOffen(zu, istSchmal === undefined ? schmal() : istSchmal);
    d.open = offen;
    let war = offen;
    d.addEventListener("toggle", () => { if (d.open === war) return; war = d.open; merke(!d.open); });
    return d;
  }

  /**
   * Suche, deren Text das Neuzeichnen überlebt (nicht gespeichert). feld() baut das Eingabefeld; jede Eingabe setzt
   * den Text, ruft beiEingabe (etwa: die Liste der Ähnlichen verlassen) und neu(); nach dem Neuzeichnen hat das neue
   * Feld den Fokus mit der Schreibmarke am Ende.
   */
  function suche() {
    let text = "", tippt = false;
    function feld({ neu, attr = {}, beiEingabe } = {}) {
      if (typeof neu !== "function") throw new Error("suche: neu fehlt");
      const f = KERN.el("input", Object.assign({ type: "search" }, attr, { value: text }));
      f.addEventListener("input", () => { text = f.value; tippt = true; if (beiEingabe) beiEingabe(); neu(); });
      if (tippt) {
        tippt = false;
        requestAnimationFrame(() => { f.focus(); f.setSelectionRange(f.value.length, f.value.length); });
      }
      return f;
    }
    return { get text() { return text; }, set text(t) { text = String(t); }, feld };
  }

  /** „?aehnlich=<id>“: Id aus der Adresse (oder einem gegebenen search-Text), und verlassen, ohne den Tab zu wechseln. */
  const aehnlich = {
    id: (search = location.search) => new URLSearchParams(search).get("aehnlich"),
    schliessen() { if (aehnlich.id()) history.replaceState(null, "", location.pathname + location.hash); },
  };

  /**
   * Sortierwahl: Auswahlliste der arten ([{ wert, text }]) und ein Knopf für die Richtung. wahl = { art, ab };
   * pfeile[art] = [Text aufsteigend, Text absteigend]; setze({ art, ab }) speichert und zeichnet neu.
   * knopf(text, an, onclick) baut den Knopf im Aussehen der App; beschriftung ist ein Element davor; feld sind
   * Attribute der Auswahlliste (Klasse, aria-label, name).
   */
  function sortWahl({ arten, wahl, pfeile = {}, setze, knopf, beschriftung = null, feld = {} }) {
    if (typeof setze !== "function" || typeof knopf !== "function") throw new Error("sortWahl: setze oder knopf fehlt");
    const p = pfeile[wahl.art] || ["↑", "↓"];
    return KERN.el("label", { class: "sortier-wahl" }, beschriftung,
      KERN.el("select", Object.assign({}, feld, { onchange: e => setze({ art: e.target.value, ab: false }) }),
        ...arten.map(a => KERN.el("option", { value: a.wert, text: a.text, selected: a.wert === wahl.art }))),
      knopf((wahl.ab ? "↓ " : "↑ ") + p[wahl.ab ? 1 : 0], !!wahl.ab, () => setze({ art: wahl.art, ab: !wahl.ab })));
  }

  /** Favoriten-Stern: Umriss aus, gefüllt an (Farbe aus dem CSS der App). */
  function stern(an) {
    const box = document.createElement("span");
    box.innerHTML = `<svg class="symbol stern${an ? " an" : ""}" viewBox="0 0 24 24" aria-hidden="true">${STERN}</svg>`;
    return box.firstChild;
  }

  KERN.uebersicht = { gruppen, filterBlock, filterOffen, schmal, suche, aehnlich, sortWahl, umschalten, stern, STERN };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/listenpruefung.js ---- */
/* Kern — Prüfansicht der Inhaltslisten (Entscheid LK1 a, LERN_Session24; docs/kern/rahmen.md 4.27).
   Herkunft: eulenpfad/spiele/gemeinsam/listenpruefung.js (Entscheide LP1 a–LP5 a, LERN_Session11; Eulenpfad rahmen.md 17).

   Eine Inhalts-Id (Spiel oder Übung) meldet ihre Listen mit einer Prüfdefinition:
     { <liste>: { beschreibung, abschnitte: [{ id, titel, hinweis?, spalten: ["Wort", …],
                  eintraege: () => [ … ], zeile: e => ["…", …], gruppe?: e => "A", bild?: e => SVG-Element }] } }
   Haken je Eintrag hängen am Fingerabdruck von Abschnitt und Rohdaten (LP2 a, KERN.runden.fingerabdruck): Ändert sich
   ein Eintrag, ist sein Haken weg. Die Entwicklung (Entwickler-Modus, KERN.entwicklung) schreibt über den Entwickler-
   Server <app>/…/pruefstand-eintraege.json und, wenn alles abgehakt ist, die Liste mit dem Fingerabdruck der ganzen
   Liste in den Prüfstand. Eine Aufsicht hakt für sich ab (lokal) und gibt die Liste auf ihrem Gerät frei (LP4 a).
   Korrekturvorschläge der Aufsicht (✏️) nur, wenn die App sie anbietet (opt.korrektur; beide Apps über ihre Meldungen,
   der Lernsteig seit LERN_Session25, LK2 a).

   KERN.listenpruefung.eintraegeVon(def)  → [{ roh, abschnitt, schluessel, zellen, gruppe }]
   KERN.listenpruefung.listenHash(liste)  → Fingerabdruck der ganzen Liste (alle Schlüssel)
   KERN.listenpruefung.inhaltVon(eintrag) → { zeile, zellen, bild } als Fingerabdrücke (ÜB1 a, seit 1.45.0)
   KERN.listenpruefung.ansicht(opt)       → { oeffne(defs, id, listeId, nachher?) } — Dialog; false ohne Definition;
                                            nachher() nach dem Schliessen, wenn alles gespeichert ist (seit 1.44.0)
     opt.el            KERN.el (Standard)
     opt.eintraegeUrl  Adresse von pruefstand-eintraege.json (relativ zur Seite)
     opt.entwicklung   () → KERN.entwicklung-Objekt der App oder null
     opt.ich           () → Name der Aufsicht (für „von“ ohne Entwickler-Modus)
     opt.lokal         { lies(quelle) → haken, schreibe(quelle, haken), alle?() → { quelle: haken } } — Haken der Aufsicht auf
                       diesem Gerät; alle() für „schon geprüft“ aus anderen Listen (ÜB1 a, seit 1.45.0)

   Schon geprüft (ÜB1 a, seit 1.45.0): Jeder Haken trägt Fingerabdrücke — „zeile“ (Spalten, Prüffrage des Abschnitts,
   Zellen und Bild zusammen) und „zellen“ (je Zelle und das Bild) —, nie den Wortlaut. Zellen, die dieselbe Person schon
   in einer anderen Zeile oder Liste abgehakt hat, stehen grau mit „schon geprüft“; eine Zeile, die sie genau so (gleiche
   Spalten, gleiche Prüffrage, gleiche Zellen, gleiches Bild) schon abgehakt hat, gilt als geprüft („✓ übernommen“) und
   lässt sich wieder aufheben. Bekannte Zellen allein haken nie ab: Eine Zeile sagt etwas über ihren Zusammenhang.
     opt.setzeFrei     (id, listeId, wert) — Freigabe je Gerät (true, null)
     opt.liste         (id, listeId) → { name, geprueft } aus dem Katalog
     opt.titel         id → Text vor dem Listennamen (etwa das Bild des Spiels); Standard ""
     opt.zelle         (text, klasse) → <td>; Standard: Text
     opt.feld          Name des Felds der Inhalts-Id in Bemerkungen ("spiel" im Eulenpfad, "inhalt" im Lernsteig)
     opt.wer           wer übt, für die Meldung nach der Freigabe ("Kinder", "Jugendliche")
     opt.korrektur     null oder { liste(quelle) → [{ id, text, schluessel, eintrag, status }], neu(daten) → { id },
                       entferne(id), gespeichert: Text nach dem Speichern }
*/
"use strict";

(function (KERN) {
  const fingerabdruck = wert => KERN.runden.fingerabdruck(wert);

  /** Alle Einträge einer Liste mit Schlüssel, Zellen, Abschnitt und Gruppe. */
  function eintraegeVon(def) {
    return def.abschnitte.flatMap(a => a.eintraege().map(e => ({
      roh: e, abschnitt: a, schluessel: `${a.id}:${fingerabdruck(e)}`, zellen: a.zeile(e).map(z => (z == null ? "" : String(z))),
      gruppe: a.gruppe ? String(a.gruppe(e)) : null,
    })));
  }
  /** Fingerabdruck der ganzen Liste (alle Schlüssel): ändert sich ein Eintrag, passt er nicht mehr zum Prüfstand. */
  const listenHash = eintraege => fingerabdruck(eintraege.map(e => e.schluessel).sort());
  /**
   * Was ein Haken über seinen Eintrag festhält (ÜB1 a, seit 1.45.0): { zeile, zellen, bild } als Fingerabdrücke — zeile aus
   * Spalten, Prüffrage (hinweis), Zellen und Bild; zellen je Zelle und das Bild. Merkt sich Bild und Ergebnis am Eintrag
   * (e.bildEl, e.inhalt). Auch für tools/haken_nachtragen.js, damit beide gleich rechnen.
   */
  function inhaltVon(e) {
    if (e.inhalt) return e.inhalt;
    const bild = e.abschnitt.bild ? e.abschnitt.bild(e.roh) : null;
    const bildFp = bild ? fingerabdruck(bild.outerHTML ?? bild.innerHTML ?? "") : null;
    const zellen = e.zellen.map(z => fingerabdruck(z));
    e.bildEl = bild;
    e.inhalt = { zeile: fingerabdruck([e.abschnitt.spalten, e.abschnitt.hinweis || "", e.zellen, bildFp]),
      zellen: bildFp ? [...zellen, bildFp] : zellen, bild: bildFp };
    return e.inhalt;
  }

  function ansicht(opt) {
    const o = opt || {};
    const el = o.el || KERN.el;
    const zelle = o.zelle || ((text, klasse) => el("td", { class: klasse || "", text }));
    const feld = o.feld || "inhalt";
    let eintraegeDaten = null; // Haken der Entwicklung je Liste: { "<id>/<liste>": { "<schlüssel>": { am, von } } }

    async function ladeEintraege() {
      if (eintraegeDaten) return eintraegeDaten;
      try { eintraegeDaten = await (await fetch(o.eintraegeUrl, { cache: "no-store" })).json(); }
      catch { eintraegeDaten = {}; }
      return eintraegeDaten;
    }

    async function oeffne(defs, id, listeId, nachher) {
      const def = defs?.[listeId];
      if (!def) return false;
      const ent = typeof o.entwicklung === "function" ? o.entwicklung() : null;
      const entwickler = !!ent?.aktiv?.();
      const ich = entwickler ? ent.name() || "Entwicklung" : (typeof o.ich === "function" ? o.ich() : "") || "Aufsicht";
      const quelle = `${id}/${listeId}`;
      const katalog = typeof o.liste === "function" ? o.liste(id, listeId) : null;
      const alle = eintraegeVon(def);
      const entw = { ...((await ladeEintraege())[quelle] || {}) };
      const lokal = o.lokal.lies(quelle);
      const meine = entwickler ? entw : lokal;
      const kor = o.korrektur || null;

      // Schon geprüft (ÜB1 a): Fingerabdrücke je Zeile und Zelle aus den Haken derselben Person in allen Listen
      const vonAnderen = entwickler ? (await ladeEintraege()) : (typeof o.lokal.alle === "function" ? o.lokal.alle() : {});
      const bekannteZellen = new Set(), bekannteZeilen = new Set();
      for (const [q, haken] of Object.entries(vonAnderen || {})) {
        for (const h of Object.values(haken || {})) {
          if (entwickler ? h?.von !== ich : (h?.von && h.von !== ich)) continue; // nur dieselbe Person
          for (const z of h?.zellen || []) bekannteZellen.add(z);
          if (h?.zeile) bekannteZeilen.add(h.zeile);
        }
        void q;
      }
      const istBekannt = (text, fp) => text.trim().length > 3 && bekannteZellen.has(fp); // „ja“, „—“ zählen nicht
      // Bemerkungen: Entwicklung aus bemerkungen.json (Server), Aufsicht ihre Korrekturen (wenn die App sie kennt)
      let bemerkungen = [];
      if (entwickler && (await ent.server())) {
        bemerkungen = ((await ent.bemerkungen()) || []).filter(b => b.liste === quelle && !String(b.status || "").startsWith("erledigt"))
          .map(b => ({ text: b.text, schluessel: b.schluessel || null, eintrag: b.eintrag || null, entfernen: async () => ent.bemerkungStatus(b.nr, `erledigt ${KERN.zeit.tag()} (in der Prüfansicht entfernt)`) }));
      } else if (!entwickler && kor) {
        bemerkungen = kor.liste(quelle).map(k => ({ text: k.text, schluessel: k.schluessel, eintrag: k.eintrag,
          status: k.status, entfernen: k.status === "neu" ? async () => { kor.entferne(k.id); return true; } : null }));
      }
      const bemerkungZu = e => bemerkungen.filter(b => b.schluessel ? b.schluessel === e.schluessel : b.eintrag === e.zellen.join(" | "));
      const mitKnopf = entwickler || !!kor; // 📝 der Entwicklung oder ✏️ der Aufsicht

      const dialog = el("dialog", { class: "listen-dialog pruef-dialog" });
      const schliessen = () => { dialog.close(); dialog.remove(); };
      const stand = el("p", { class: "pruef-stand" });
      const meldung = el("p", { class: "leise", "aria-live": "polite" });
      const zaehle = () => {
        const n = alle.filter(e => meine[e.schluessel]).length;
        const m = alle.filter(e => entw[e.schluessel]).length;
        stand.textContent = entwickler ? `${n} von ${alle.length} Einträgen geprüft.`
          : `Von mir geprüft: ${n} von ${alle.length} · von der Entwicklung: ${m} von ${alle.length}${katalog?.geprueft ? " (Liste freigegeben)" : ""}`;
      };

      // Speichern: Entwicklung gebündelt an den Server, Aufsicht sofort im Browser
      let offen = { setzen: new Set(), entfernen: new Set() };
      let timer = null;
      let laufend = Promise.resolve(); // das letzte Speichern — nachher() wartet darauf
      const sichern = () => (laufend = laufend.then(speichern).catch(() => {})); // ein Fehler hält die Kette nicht an
      const speichern = async () => {
        const komplett = alle.every(e => meine[e.schluessel]);
        if (entwickler) {
          const setzen = [...offen.setzen];
          const inhalt = Object.fromEntries(setzen.map(s => [s, { zeile: meine[s]?.zeile, zellen: meine[s]?.zellen }]));
          const ok = await ent.setzeEintraege({ liste: quelle, setzen, entfernen: [...offen.entfernen], komplett, hash: listenHash(alle), inhalt });
          if (ok && eintraegeDaten) eintraegeDaten[quelle] = { ...meine }; // für die nächste Liste auf dieser Seite
          offen = { setzen: new Set(), entfernen: new Set() };
          meldung.textContent = ok ? (komplett ? "✓ Liste vollständig geprüft — im Prüfstand eingetragen." : "✓ gespeichert") : "⚠ nicht gespeichert (Entwickler-Server?)";
        } else {
          o.lokal.schreibe(quelle, meine);
          // Ganz geprüft: auf diesem Gerät freigeben; sonst zurück auf den Prüfstand der Entwicklung (LP4 a)
          o.setzeFrei(id, listeId, komplett ? true : null);
          meldung.textContent = komplett ? `✓ Alles geprüft — die Liste ist auf diesem Gerät für ${o.wer || "Lernende"} frei.` : "✓ gespeichert";
        }
        zaehle();
      };
      const merke = () => { clearTimeout(timer); timer = setTimeout(sichern, entwickler ? 500 : 0); };
      function setze(e, an) {
        if (an) {
          const { zeile, zellen } = inhaltVon(e);
          meine[e.schluessel] = { am: KERN.zeit.tag(), von: ich, zeile, zellen };
          offen.setzen.add(e.schluessel); offen.entfernen.delete(e.schluessel);
        }
        else { delete meine[e.schluessel]; offen.entfernen.add(e.schluessel); offen.setzen.delete(e.schluessel); }
      }

      // Zeilen und Gruppen
      const kaestchen = [];
      const spaltenZahl = e => 2 + (mitKnopf ? 1 : 0) + e.zellen.length + (e.abschnitt.bild ? 1 : 0) - 1;
      const uebernommen = new Set(); // Zeilen, die genau so schon abgehakt waren (ÜB1 a)
      const bekanntMarke = td => { td.classList.add("pruef-bekannt"); td.title = "schon geprüft (in einer anderen Zeile oder Liste)"; return td; };
      function zeileEl(e) {
        const inhalt = inhaltVon(e);
        if (!meine[e.schluessel] && bekannteZeilen.has(inhalt.zeile) && !bemerkungZu(e).length) { setze(e, true); uebernommen.add(e.schluessel); }
        const box = el("input", { type: "checkbox", "aria-label": `Geprüft: ${e.zellen.join(", ")}` });
        box.checked = !!meine[e.schluessel];
        box.addEventListener("change", () => { setze(e, box.checked); aktualisiereGruppen(); merke(); });
        kaestchen.push({ e, box });
        const bild = e.bildEl ? el("td", { class: "pruef-bild" }, e.bildEl) : null;
        if (bild && bekannteZellen.has(inhalt.bild)) bekanntMarke(bild);
        const zeile = el("tr", { class: bemerkungZu(e).length ? "mit-bemerkung" : "" },
          el("td", { class: "pruef-haken" }, box, !entwickler && entw[e.schluessel] ? el("span", { class: "pruef-e", title: "von der Entwicklung geprüft", text: "✓E" }) : null,
            uebernommen.has(e.schluessel) ? el("span", { class: "pruef-e", title: "genau so schon in einer anderen Liste geprüft", text: "✓ übernommen" }) : null),
          // Kurze Zellen so breit wie ihr Inhalt, lange (Sätze) umbrechen; schon geprüfte grau
          bild, ...e.zellen.map((z, i) => {
            const td = zelle(z, z.length > 24 ? "lang" : "");
            return istBekannt(z, inhalt.zellen[i]) ? bekanntMarke(td) : td;
          }),
          mitKnopf ? el("td", {}, el("button", { type: "button", class: "knopf hell klein", text: entwickler ? "📝" : "✏️", title: entwickler ? "Bemerkung zu diesem Eintrag" : "Korrektur vorschlagen",
            onclick: () => bemerkeEintrag(e, zeile) })) : null);
        const zeilen = [zeile];
        for (const b of bemerkungZu(e)) zeilen.push(bemerkungsZeile(b, e));
        return zeilen;
      }
      function bemerkungsZeile(b, e) {
        const tr = el("tr", { class: "pruef-bemerkung" }, el("td", { colspan: String(spaltenZahl(e) + 1) },
          el("span", { text: `📝 ${b.text}${b.status && b.status !== "neu" ? ` (${b.status === "weitergeleitet" ? "an die Entwicklung gesendet" : b.status})` : ""}` }),
          b.entfernen ? el("button", { type: "button", class: "knopf hell klein", text: "✕ entfernen", onclick: async () => {
            if (await b.entfernen()) {
              tr.remove();
              if (bemerkungen.includes(b)) bemerkungen.splice(bemerkungen.indexOf(b), 1); // der Eintrag lässt sich wieder abhaken
              meldung.textContent = "✓ Bemerkung entfernt";
            }
          } }) : null));
        return tr;
      }
      function bemerkeEintrag(e, zeile) {
        dialog.querySelector(".pruef-feld")?.remove();
        const text = el("textarea", { class: "feld", rows: "2", placeholder: entwickler ? "Bemerkung zu diesem Eintrag" : "Was stimmt nicht, und wie wäre es richtig?" });
        const box = el("tr", { class: "pruef-feld" }, el("td", { colspan: String(spaltenZahl(e) + 1) }, text,
          el("button", { type: "button", class: "knopf gruen klein", text: "Speichern", onclick: async () => {
            const t = text.value.trim();
            if (!t) return text.focus();
            const daten = { liste: quelle, eintrag: e.zellen.join(" | "), schluessel: e.schluessel, text: t };
            let b;
            if (entwickler) {
              const r = await ent.bemerkung({ [feld]: id, ...daten });
              if (!r) return;
              b = { text: t, schluessel: e.schluessel, entfernen: async () => ent.bemerkungStatus(r.nr, `erledigt ${KERN.zeit.tag()} (in der Prüfansicht entfernt)`) };
            } else {
              const k = kor.neu({ [feld]: id, ...daten });
              b = { text: t, schluessel: e.schluessel, status: "neu", entfernen: async () => { kor.entferne(k.id); return true; } };
              meldung.textContent = kor.gespeichert || "✓ Korrektur gespeichert";
            }
            // Mit Bemerkung bleibt der Eintrag offen, bis sie erledigt ist — auch für „Ganze Liste geprüft“ und „✓ alle“.
            bemerkungen.push(b);
            const k = kaestchen.find(x => x.e === e);
            if (k?.box.checked) { k.box.checked = false; setze(e, false); merke(); }
            box.replaceWith(bemerkungsZeile(b, e));
            aktualisiereGruppen();
          } })));
        zeile.after(box);
        text.focus();
      }

      // Gruppen (Abschnitte, Untergruppen): zugeklappt, wenn ich sie ganz geprüft habe (LP1 a)
      const gruppen = [];
      function gruppeEl(titel, eintraege, inhalt) {
        const alleBox = el("button", { type: "button", class: "knopf hell klein", text: "✓ alle" });
        const zahl = el("span", { class: "pruef-zahl" });
        const d = el("details", { class: "pruef-gruppe" }, el("summary", {}, el("b", { text: titel }), zahl, alleBox), ...inhalt);
        const g = { d, eintraege, zahl, alleBox };
        alleBox.addEventListener("click", ev => {
          ev.preventDefault();
          const an = !eintraege.every(e => meine[e.schluessel]);
          for (const e of eintraege) if (!(an && bemerkungZu(e).length)) setze(e, an);
          for (const k of kaestchen) if (eintraege.includes(k.e)) k.box.checked = !!meine[k.e.schluessel];
          // Aufgehoben: aufklappen, auch die Untergruppen — sonst sieht man die Einträge nicht (Hinweis Patrik LERN_Session38)
          if (!an) { d.open = true; for (const u of d.querySelectorAll("details")) u.open = true; }
          aktualisiereGruppen(); merke();
        });
        gruppen.push(g);
        d.open = !eintraege.every(e => meine[e.schluessel]);
        return d;
      }
      function aktualisiereGruppen() {
        for (const g of gruppen) {
          const n = g.eintraege.filter(e => meine[e.schluessel]).length;
          g.zahl.textContent = ` ${n} von ${g.eintraege.length} ✓`;
          g.alleBox.textContent = n === g.eintraege.length ? "↺ alle aufheben" : "✓ alle";
          g.d.classList.toggle("fertig", n === g.eintraege.length);
        }
        zaehle();
      }
      const tabelle = (a, eintraege) => el("div", { class: "pruef-rahmen" }, el("table", { class: "pruef-tabelle" },
        el("thead", {}, el("tr", {}, el("th", { text: "✓" }), a.bild ? el("th", { text: "Bild" }) : null, ...a.spalten.map(s => el("th", { text: s })), mitKnopf ? el("th") : null)),
        el("tbody", {}, ...eintraege.flatMap(zeileEl))));
      const abschnitte = def.abschnitte.map(a => {
        const eintraege = alle.filter(e => e.abschnitt === a);
        const inhalt = [a.hinweis ? el("p", { class: "leise", text: a.hinweis }) : null];
        if (a.gruppe) {
          const schluessel = [...new Set(eintraege.map(e => e.gruppe))];
          inhalt.push(...schluessel.map(g => gruppeEl(g, eintraege.filter(e => e.gruppe === g), [tabelle(a, eintraege.filter(e => e.gruppe === g))])));
        } else inhalt.push(tabelle(a, eintraege));
        return gruppeEl(a.titel, eintraege, inhalt);
      });

      const knopf = (text, onclick, art = "hell") => el("button", { type: "button", class: `knopf ${art} klein`, text, onclick });
      const kopf = el("div", { class: "knopfzeile" },
        knopf("✓ Ganze Liste geprüft", () => {
          // übernimmt die gesetzten Haken und hakt den Rest ab — Einträge mit offener Bemerkung bleiben offen
          for (const e of alle) if (!bemerkungZu(e).length) setze(e, true);
          for (const k of kaestchen) k.box.checked = !!meine[k.e.schluessel];
          aktualisiereGruppen(); merke();
        }, "gruen"),
        entwickler ? knopf("📝 Bemerkung zur Liste", () => {
          const text = el("textarea", { class: "feld", rows: "2", placeholder: "Bemerkung zur ganzen Liste" });
          kopf.after(el("div", {}, text, knopf("Speichern", async () => {
            if (text.value.trim() && (await ent.bemerkung({ [feld]: id, liste: quelle, text: text.value.trim() }))) { text.parentElement.remove(); meldung.textContent = "✓ Bemerkung gespeichert"; }
          }, "gruen")));
        }) : null,
        knopf("Schliessen", schliessen));
      const vorTitel = typeof o.titel === "function" ? o.titel(id) || "" : "";
      dialog.append(el("h2", { text: `${vorTitel ? vorTitel + " " : ""}${katalog?.name || listeId}` }),
        def.beschreibung ? el("p", { text: def.beschreibung }) : null,
        el("p", { class: "leise", text: entwickler ? "Entwickler-Modus: Haken gelten für alle (Prüfstand)."
          : `Ihre Haken gelten auf diesem Gerät. ✓E = von der Entwicklung geprüft.${kor ? " ✏️ schlägt der Entwicklung eine Korrektur vor." : ""}` }),
        el("p", { class: "leise", text: "Grau: schon in einer anderen Zeile oder Liste geprüft. ✓ übernommen: genau diese Zeile ist schon geprüft." }),
        stand, kopf, meldung, ...abschnitte);
      aktualisiereGruppen();
      if (uebernommen.size) {
        meldung.textContent = `✓ ${uebernommen.size} ${uebernommen.size === 1 ? "Zeile" : "Zeilen"} übernommen — genau so schon geprüft.`;
        merke();
      }
      // Beim Schliessen Offenes sofort speichern; nachher() erst danach, damit die App den neuen Prüfstand zeigt (die
      // Entwickler-Leiste des Eulenpfads zeichnete ihre Listen vorher erst beim Neuladen neu, Hinweis Patrik LERN_Session38)
      dialog.addEventListener("close", async () => {
        clearTimeout(timer);
        if (offen.setzen.size || offen.entfernen.size) sichern();
        dialog.remove();
        await laufend;
        nachher?.();
      });
      document.body.append(dialog);
      dialog.showModal();
      return true;
    }

    return { oeffne };
  }

  KERN.listenpruefung = { ansicht, eintraegeVon, listenHash, inhaltVon };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/farben.js ---- */
/* Kern — Farben anwenden (Entscheide DM1 a, DM2 a, DM2-S a, docs/konzept_darkmode.md; docs/kern/rahmen.md 4.29).
   Die Farben selbst stehen in farben.css (--k-*, hell unter :root, dunkel unter :root[data-farben="dunkel"]). Hier nur, wie
   die Wahl zur Seite kommt: Werte WAHLEN; dunkel(wahl) entscheidet (bei "geraet" nach prefers-color-scheme); anwenden
   setzt oder nimmt data-farben an <html> und folgt bei "geraet" dem Gerät, solange die Seite offen ist; merke legt die
   aufgelöste Wahl im Speicher der App ab, damit farben.kopf.js sie auf der nächsten Seite vor dem ersten Bild setzt.
   Welche Wahl gilt (Gerät, „Für mich“ einer Aufsicht, Person im Lernsteig), entscheidet die App. */
"use strict";

(function (KERN) {
  const WAHLEN = ["hell", "dunkel", "geraet"];
  const ABFRAGE = "(prefers-color-scheme: dark)";
  const geraetDunkel = () => typeof matchMedia === "function" && matchMedia(ABFRAGE).matches;
  /** Dunkel für diese Wahl? Unbekannte Werte: hell. */
  const dunkel = wahl => wahl === "dunkel" || (wahl === "geraet" && geraetDunkel());

  let folgt = null; // Abfrage, der die Seite bei "geraet" folgt
  /** data-farben an <html> setzen; bei "geraet" auch später dem Gerät folgen. */
  function anwenden(wahl) {
    if (typeof document === "undefined") return;
    const setze = () => {
      if (dunkel(wahl)) document.documentElement.setAttribute("data-farben", "dunkel");
      else document.documentElement.removeAttribute("data-farben");
    };
    setze();
    if (folgt) { folgt.m.removeEventListener?.("change", folgt.f); folgt = null; }
    if (wahl === "geraet" && typeof matchMedia === "function") {
      const m = matchMedia(ABFRAGE), f = () => setze();
      m.addEventListener?.("change", f);
      folgt = { m, f };
    }
  }
  /** Die aufgelöste Wahl im Speicher der App ablegen (KERN.speicher: speicher.schreibe) — für farben.kopf.js. */
  function merke(speicher, wahl) { speicher.schreibe("farben", WAHLEN.includes(wahl) ? wahl : "hell"); }

  KERN.farben = { WAHLEN, dunkel, anwenden, merke };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- erzeugt: Version des Kerns (kern/VERSION) ---- */
globalThis.KERN.version = "1.45.1";
