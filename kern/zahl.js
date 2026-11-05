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
