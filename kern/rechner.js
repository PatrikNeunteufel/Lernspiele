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
