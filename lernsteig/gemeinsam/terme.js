/* Lernsteig — Terme lesen, vergleichen und ihre Form prüfen (für Übungen mit Term-Antworten, Rahmen und Testskript).
   Ohne DOM. Ein Term wird exakt als Polynom gelesen: Variablen a–z (ein Buchstabe), Zahlen „1'234.5“, Brüche „5/8“,
   + − - · * : ( ), implizites Mal („3a“, „2(x + 1)“, „ab“), Potenzen „^2“ oder „²³⁴“. Baut auf bruch.js auf.
   Ein Polynom ist eine Map „Monom → Bruch“, das Monom als Schlüssel „a2b1“ (Variablen sortiert, mit Exponent). */
"use strict";

var LST_TERME = (function () {
  const B = LST_BRUCH;
  const HOCH = { "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9 };

  // ---------- Polynome ----------
  const konst = b => new Map([["", b]]);
  const variable = v => new Map([[`${v}1`, B.bruch(1n)]]);
  function aufraeumen(p) { for (const [k, w] of p) if (w.z === 0n) p.delete(k); return p; }
  function plus(p, q) { const r = new Map(p); for (const [k, w] of q) r.set(k, r.has(k) ? B.plus(r.get(k), w) : w); return aufraeumen(r); }
  const neg = p => new Map([...p].map(([k, w]) => [k, B.neg(w)]));
  function monomMal(k1, k2) {
    const e = {};
    for (const k of [k1, k2]) for (const [, v, n] of k.matchAll(/([a-z])(\d+)/g)) e[v] = (e[v] || 0) + Number(n);
    return Object.keys(e).sort().map(v => `${v}${e[v]}`).join("");
  }
  function mal(p, q) {
    const r = new Map();
    for (const [k1, w1] of p) for (const [k2, w2] of q) { const k = monomMal(k1, k2); r.set(k, r.has(k) ? B.plus(r.get(k), B.mal(w1, w2)) : B.mal(w1, w2)); }
    return aufraeumen(r);
  }
  function hoch(p, n) { let r = konst(B.bruch(1n)); for (let i = 0; i < n; i++) r = mal(r, p); return r; }
  function durch(p, q) {
    if (q.size !== 1 || !q.has("")) throw new Error("nur durch Zahlen teilen");
    const d = q.get("");
    if (d.z === 0n) throw new Error("Division durch 0");
    return new Map([...p].map(([k, w]) => [k, B.durch(w, d)]));
  }
  function gleich(p, q) {
    const d = plus(p, neg(q));
    return d.size === 0;
  }

  // ---------- Lesen ----------
  /** Liest einen Term; liefert { poly, info } oder wirft. info: Zählungen für die Formprüfung. */
  function lies(text) {
    const s = String(text).replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/\*/g, "·").replace(/'/g, "").replace(/,/g, ".");
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
        if (HOCH[s[i]]) { info.potenzen++; w = hoch(w, HOCH[s[i++]]); continue; }
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

  /** Anzahl Glieder auf oberster Ebene (ohne Klammern) eines Eingabetexts. */
  function glieder(roh) {
    let tiefe = 0, n = 1;
    for (let i = 0; i < roh.length; i++) {
      const c = roh[i];
      if (c === "(") tiefe++; else if (c === ")") tiefe--;
      else if ((c === "+" || c === "-") && tiefe === 0 && i > 0 && roh[i - 1] !== "^") n++;
    }
    return n;
  }

  /**
   * Bewertet eine Eingabe gegen eine Aufgabe { antwortTerm, form }.
   * form: "vereinfacht" (keine Klammern, jedes Monom einmal), "potenz" (als Potenz geschrieben),
   *       "ausgeklammert" (Zahl mal Klammer, grösster gemeinsamer Teiler ausgeklammert), "frei".
   * Liefert { ok, gleichwertig, meldung }.
   */
  function bewerte(eingabe, a) {
    let e;
    try { e = lies(eingabe); } catch (err) { return { ok: false, gleichwertig: false, lesbar: false, meldung: "Den Term kann ich nicht lesen. Beispiel: 3a + 4b oder 2(x + 5)." }; }
    const ziel = lies(a.antwortTerm).poly;
    const gw = gleich(e.poly, ziel);
    if (!gw) return { ok: false, gleichwertig: false, lesbar: true };
    const form = a.form || "frei";
    if (form === "vereinfacht") {
      if (e.info.klammern > 0) return { ok: false, gleichwertig: true, lesbar: true, meldung: "Der Wert stimmt. Löse noch die Klammern auf." };
      if (glieder(e.roh) > ziel.size + 0) return { ok: false, gleichwertig: true, lesbar: true, meldung: "Der Wert stimmt. Fasse gleichartige Glieder noch zusammen." };
      if (/\d[·:]\d|:/.test(e.roh) || e.info.potenzen > 0 && /\d\^|\d[²-³⁴-⁹]/.test(e.roh)) return { ok: false, gleichwertig: true, lesbar: true, meldung: "Der Wert stimmt. Rechne die Zahlen noch aus." };
    }
    if (form === "bruch") {
      // eine ganze Zahl oder ein vollständig gekürzter Bruch „z/n“ (auch negativ), kein Dezimalbruch
      const m = e.roh.match(/^(-?)(\d+)(?:\/(\d+))?$/);
      if (!m) return { ok: false, gleichwertig: true, lesbar: true, meldung: "Der Wert stimmt. Schreibe als Bruch, zum Beispiel 3/4." };
      if (m[3]) {
        const ggt = (x, y) => (y ? ggt(y, x % y) : x);
        if (ggt(Number(m[2]), Number(m[3])) !== 1) return { ok: false, gleichwertig: true, lesbar: true, meldung: "Der Wert stimmt. Kürze den Bruch noch vollständig." };
        if (m[3] === "1") return { ok: false, gleichwertig: true, lesbar: true, meldung: "Der Wert stimmt. Schreibe die ganze Zahl ohne Nenner." };
      }
    }
    if (form === "potenz" && !(e.info.potenzen === 1 && e.info.mal === 0 && glieder(e.roh) === 1)) {
      return { ok: false, gleichwertig: true, lesbar: true, meldung: "Der Wert stimmt. Schreibe als eine Potenz, zum Beispiel 5^3." };
    }
    if (form === "ausgeklammert") {
      const m = e.roh.match(/^(-?\d*)(?:·)?\((.*)\)$/);
      if (!m) return { ok: false, gleichwertig: true, lesbar: true, meldung: "Der Wert stimmt. Schreibe als Zahl mal Klammer: 3(…)." };
      const innen = lies(m[2]).poly;
      const ggt = (x, y) => (y ? ggt(y, x % y) : (x < 0n ? -x : x));
      let g = 0n; for (const [, w] of innen) { if (w.n !== 1n) return { ok: false, gleichwertig: true, lesbar: true, meldung: "Klammere so aus, dass in der Klammer ganze Zahlen stehen." }; g = ggt(g, w.z); }
      if (g !== 1n) return { ok: false, gleichwertig: true, lesbar: true, meldung: "Der Wert stimmt. In der Klammer steckt noch ein gemeinsamer Faktor." };
    }
    return { ok: true, gleichwertig: true, lesbar: true };
  }

  // ---------- Schreiben (für Lösungen) ----------
  const ZAHL_HOCH = n => String(n).split("").map(c => ({ 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" }[c] || c)).join("");
  function bruchText(b) {
    if (b.n === 1n) return LST.zahlText(Number(b.z));
    if (B.endlich(b) && b.n <= 1000n) { /* Brüche mit Nenner bleiben Brüche, wie im Lehrplanbeispiel ¼ + ⅜ */ }
    return `${b.z < 0n ? "−" : ""}${(b.z < 0n ? -b.z : b.z)}/${b.n}`;
  }
  /** Polynom als Text in fester Ordnung: höchster Grad zuerst, dann alphabetisch, Konstante zuletzt. */
  function text(p) {
    const grad = k => [...k.matchAll(/\d+/g)].reduce((s, m) => s + Number(m[0]), 0);
    const schluessel = [...p.keys()].sort((x, y) => (grad(y) - grad(x)) || (x === "" ? 1 : y === "" ? -1 : x.localeCompare(y)));
    if (!schluessel.length) return "0";
    return schluessel.map((k, i) => {
      const w = p.get(k);
      const negativ = w.z < 0n;
      const betrag = negativ ? B.neg(w) : w;
      const vars = [...k.matchAll(/([a-z])(\d+)/g)].map(([, v, n]) => v + (n === "1" ? "" : ZAHL_HOCH(n))).join("");
      let t = vars && betrag.z === 1n && betrag.n === 1n ? vars : `${bruchText(betrag)}${vars}`;
      if (i === 0) return (negativ ? "−" : "") + t;
      return ` ${negativ ? "−" : "+"} ${t}`;
    }).join("");
  }

  return { lies, bewerte, gleich, text, plus, mal, neg, hoch, konst, variable, glieder };
})();

if (typeof module !== "undefined") module.exports = LST_TERME;
