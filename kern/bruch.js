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
