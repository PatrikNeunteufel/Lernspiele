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
  function lies(text) {
    const s = ohneGliederung(String(text)).replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/\*/g, "·").replace(/,/g, ".");
    let i = 0;
    const info = { klammern: 0, potenzen: 0, mal: 0 };
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

  /**
   * Bewertet eine Eingabe gegen eine Aufgabe { antwortTerm, form }.
   * form: "vereinfacht" (keine Klammern, jedes Monom einmal, Zahlen ausgerechnet), "bruch" (ganze Zahl oder gekürzter
   *       Bruch), "potenz" (als eine Potenz geschrieben), "ausgeklammert" (Zahl mal Klammer, ggT ausgeklammert), "frei".
   * Liefert { ok, gleichwertig, lesbar, meldung }. Eine unlesbare Eingabe wirft nie (D3); ein unlesbarer antwortTerm
   * ist ein Fehler der Aufgabe und wirft.
   */
  function bewerte(eingabe, a) {
    let e;
    try { e = lies(eingabe); } catch (err) {
      const meldung = /zu gross/.test(err.message) ? `Der Term ist zu gross: ${err.message}.`
        : err.message === GLIEDERUNG ? "Den Apostroph nur zwischen Dreiergruppen, zum Beispiel 12'340."
        : "Den Term kann ich nicht lesen. Beispiel: 3a + 4b oder 2(x + 5).";
      return { ok: false, gleichwertig: false, lesbar: false, meldung };
    }
    const ziel = lies(a.antwortTerm).poly;
    if (!gleich(e.poly, ziel)) return { ok: false, gleichwertig: false, lesbar: true };
    const form = a.form || "frei";
    if (form === "vereinfacht") {
      if (e.info.klammern > 0) return formFehler("Der Wert stimmt. Löse noch die Klammern auf.");
      if (glieder(e.roh) > ziel.size) return formFehler("Der Wert stimmt. Fasse gleichartige Glieder noch zusammen.");
      if (/\d[·:]\d|:/.test(e.roh) || e.info.potenzen > 0 && /\d\^|\d[²-³⁴-⁹]/.test(e.roh)) return formFehler("Der Wert stimmt. Rechne die Zahlen noch aus.");
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
