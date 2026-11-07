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
