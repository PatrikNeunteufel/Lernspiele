/* Lernsteig — exakte Bruchrechnung (BigInt) für die Prüffunktionen der Übungen (pruefeAufgabe): Lösungen werden
   unabhängig vom Generator nachgerechnet. Ohne DOM; geladen von Übungsseiten und Testskript.
   Ein Bruch ist { z, n } mit n > 0, gekürzt. */
"use strict";

var LST_BRUCH = (function () {
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
  function wurzelGanz(x, k) {
    if (x < 0n) return null;
    const r = BigInt(Math.round(Number(x) ** (1 / k)));
    for (const c of [r - 1n, r, r + 1n]) if (c >= 0n && c ** BigInt(k) === x) return c;
    return null;
  }
  /** Exakte k-te Wurzel, sonst Fehler. */
  function wurzel(a, k) {
    const z = wurzelGanz(a.z, k), n = wurzelGanz(a.n, k);
    if (z === null || n === null) throw new Error("Wurzel nicht exakt");
    return bruch(z, n);
  }
  /** "1'234.56" → Bruch (ohne Vorzeichen). */
  function zahl(text) {
    const t = String(text).replace(/'/g, "");
    const [g, d = ""] = t.split(".");
    return bruch(BigInt(g + d), 10n ** BigInt(d.length));
  }
  /** JavaScript-Zahl (endliche Dezimalzahl) → Bruch, auf 9 Nachkommastellen gerundet. */
  function vonZahl(x) {
    // über den Dezimaltext mit 15 gültigen Ziffern: exakt auch für grosse und sehr kleine Zahlen
    const s = Number(Math.abs(x).toPrecision(15)).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 });
    const b = zahl(s);
    return x < 0 ? neg(b) : b;
  }
  const gleich = (a, b) => a.z === b.z && a.n === b.n;
  /** Ist der Bruch eine endliche Dezimalzahl? */
  function endlich(a) { let n = a.n; for (const p of [2n, 5n]) while (n % p === 0n) n /= p; return n === 1n; }
  const text = a => (a.n === 1n ? String(a.z) : `${a.z}/${a.n}`);

  return { bruch, plus, minus, mal, durch, neg, hoch, wurzel, zahl, vonZahl, gleich, endlich, text };
})();

if (typeof module !== "undefined") module.exports = LST_BRUCH;
