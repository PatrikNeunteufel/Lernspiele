/* Lernsteig — eingebauter Taschenrechner (Entscheide TR1 a, RE1 a, RM1 b; Recherche R11:
   docs/lernsteig/lehrplan/rechnermodelle_sg.md).
   Funktionen wie an der Aufnahmeprüfung SG vorausgesetzt (TR): Grundoperationen, Potenzieren, Wurzelziehen,
   Fliesskommadarstellung; dazu Klammern, Vorzeichen, π, Ans. Keine Prozent-Taste, keine Brüche, kein Gleichungslöser,
   kein Graph.
   Ansichten: „allgemein“ und je Modell die **Bedienlogik** (Tastenfolgen, Vorzeichen, Wurzel vor oder nach der Zahl,
   Index vor oder nach dem Radikanden, Ans) mit eigenem, sachlichem Aussehen, Modellname, Markenvermerk und Hinweis
   „nicht verbunden mit …“ (R11 Abschnitt 3 und F3: kein getreues Abbild, keine Fotos oder Logos).
   Teil 1 (ohne DOM, auch fürs Testskript): Eingabe als Liste von Tasten-Kennungen, Auswertung, Anzeige.
   Teil 2 (Seite): Tastenfeld mit Modellwahl und Bedienhilfe. */
"use strict";

var LST_RECHNER = (function () {
  const M = "−";
  // Kennungen der Tasten (stehen so in der Eingabe). Beschriftungen liefert das Modell.
  const VORZ = "(−)";        // Vorzeichen vor der Zahl (TI-30X Plus, Casio)
  const VORZ_NACH = "+⇔−"; // Vorzeichen nach der Zahl (TI-30 eco RS)
  const WURZEL_NACH = "√x";   // Quadratwurzel nach der Zahl (eco RS)
  const NTE_INDEX = "ⁿ√"; // n-te Wurzel, Index zuerst: 3 ⁿ√ 8000
  const NTE_RADIKAND = "ˣ√y"; // n-te Wurzel, Radikand zuerst: 8000 ˣ√y 3 (eco RS)

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
   * (wie in den Anleitungen, R11 Abschnitt 2). Liefert { wert } oder { fehler }.
   */
  function rechne(eingabe, ans) {
    const b = bausteine(eingabe);
    let i = 0;
    const ist = (t, w) => b[i] && b[i].t === t && (w === undefined || b[i].w === w);
    function ausdruck() {
      let w = glied();
      while (ist("op", "+") || ist("op", M)) { const op = b[i++].w; const g = glied(); w = op === "+" ? w + g : w - g; }
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
      if (!Number.isFinite(w)) return { fehler: "Ergebnis zu gross" };
      return { wert: w };
    } catch (e) { return { fehler: e.message }; }
  }

  const HOCH = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };

  /** Ergebnis in der Schreibweise des Lernsteigs, höchstens 10 gültige Ziffern; sehr gross oder klein wissenschaftlich. */
  function anzeige(w) {
    if (w === 0) return "0";
    const b = Math.abs(w);
    if (b >= 1e10 || b < 1e-6) {
      const [m, e] = w.toExponential(9).split("e");
      return `${LST.dezimalText(Number(m))} · 10${String(Number(e)).replace(/[-0-9]/g, c => HOCH[c])}`;
    }
    return LST.dezimalText(Number(w.toPrecision(10)));
  }

  // ---------- Modelle (R11 Abschnitt 1, 2, 5) ----------
  // Je Modell: Name, Familie, Tasten (Beschriftung → Kennung), Tipps zur Bedienung mit Beleg aus der Anleitung.
  const T = (label, kennung, klasse, aria) => ({ label, kennung, klasse: klasse || "", aria: aria || label });
  const ZIFFERN = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"].map(z => T(z, z));
  const GRUND = {
    mal: T("×", "·", "op", "mal"), geteilt: T("÷", ":", "op", "geteilt"),
    plus: T("+", "+", "op", "plus"), minus: T(M, M, "op", "minus"), punkt: T(".", ".", "", "Dezimalpunkt"),
    auf: T("(", "(", "fn"), zu: T(")", ")", "fn"), pi: T("π", "π", "fn", "Pi"),
  };
  const MODELLE = {
    allgemein: {
      name: "Allgemein", familie: "allgemein",
      tasten: [T("x²", "x²", "fn", "Quadrat"), T("xʸ", "^", "fn", "Potenz"), T("√", "√", "fn", "Quadratwurzel"),
        T("ⁿ√", NTE_INDEX, "fn", "n-te Wurzel: zuerst n, dann diese Taste, dann die Zahl"), GRUND.auf, GRUND.zu,
        T(VORZ, VORZ, "fn", "Vorzeichen"), T("Ans", "Ans", "fn", "letztes Ergebnis")],
      tipps: [
        "Negative Zahl: zuerst (−), dann die Zahl. Die Minustaste ist zum Rechnen.",
        "(−)2² ergibt −4. Für (−2)² setze Klammern.",
        "n-te Wurzel: zuerst den Index, dann ⁿ√, dann die Zahl (3 ⁿ√ 8000 = 20).",
        "Ans setzt das letzte Ergebnis ein. Eine Rechentaste direkt nach dem Ergebnis rechnet damit weiter.",
      ],
    },
    "ti30x-plus": {
      name: "TI-30X Plus MathPrint", familie: "TI", hersteller: "Texas Instruments",
      tasten: [T("x²", "x²", "fn", "Quadrat"), T("x^□", "^", "fn", "Potenz"), T("√", "√", "fn", "Quadratwurzel"),
        T("ˣ√", NTE_INDEX, "fn", "n-te Wurzel: zuerst n, dann diese Taste, dann die Zahl"), GRUND.auf, GRUND.zu,
        T("(−)", VORZ, "fn", "Vorzeichen"), T("ans", "Ans", "fn", "letztes Ergebnis")],
      tipps: [
        "Negative Zahl mit der Taste (−) vor der Zahl, nicht mit der Minustaste (Anleitung S. 10).",
        "⁻3² ergibt −9, (⁻3)² ergibt 9: Das Vorzeichen kommt nach der Potenz (S. 9–10).",
        "Quadratwurzel: 2nd √, dann die Zahl (S. 19). n-te Wurzel: zuerst der Index, dann 2nd ˣ√, dann die Zahl: 6 2nd ˣ√ 64 = 2 (S. 19).",
        "Potenz: Nach dem Exponenten mit der Pfeiltaste ► aus dem Exponenten heraus, sonst rechnet der Rechner im Exponenten weiter (S. 19).",
        "2^3^2 rechnet MathPrint von rechts (512), Classic von links (64) (S. 9). Setze lieber Klammern.",
        "Das letzte Ergebnis heisst ans (2nd ans). Beginnst du mit einer Rechentaste, setzt der Rechner ans davor (S. 8).",
        "◄► schaltet zwischen Bruch und Dezimalzahl, Wurzel und Näherung, π und Näherung (S. 8).",
      ],
    },
    "ti30-eco": {
      name: "TI-30 eco RS", familie: "TI", hersteller: "Texas Instruments",
      tasten: [T("x²", "x²", "fn", "Quadrat"), T("yˣ", "^", "fn", "Potenz"), T("√x", WURZEL_NACH, "fn", "Quadratwurzel"),
        T("ˣ√y", NTE_RADIKAND, "fn", "n-te Wurzel: zuerst die Zahl, dann diese Taste, dann n"), GRUND.auf, GRUND.zu,
        T("+⇔−", VORZ_NACH, "fn", "Vorzeichen"), T("", "", "leer", "")],
      tipps: [
        "Vorzeichen nach der Zahl: zuerst die Zahl, dann +⇔− (Anleitung S. 2).",
        "Quadratwurzel nach der Zahl, sie wird sofort ausgerechnet: 256 √x + 4 √x = 18 (S. 4).",
        "n-te Wurzel: zuerst die Zahl, dann 2nd ˣ√y, dann der Index: 8 2nd ˣ√y 3 = 2 (S. 4).",
        "Potenz: Basis, dann yˣ, dann Exponent: 5 yˣ 3 = 125 (S. 4).",
        "Der eco RS hat keine Ans-Taste. Schreib Zwischenergebnisse auf oder nutze den Speicher (S. 11–12).",
        "= schliesst alle offenen Klammern (S. 3).",
      ],
    },
    "casio-fx82de": {
      name: "Casio fx-82DE PLUS / fx-82DE X", familie: "Casio", hersteller: "CASIO",
      tasten: [T("x²", "x²", "fn", "Quadrat"), T("x^■", "^", "fn", "Potenz"), T("√■", "√", "fn", "Quadratwurzel"),
        T("■√□", NTE_INDEX, "fn", "n-te Wurzel: zuerst n, dann diese Taste, dann die Zahl"), GRUND.auf, GRUND.zu,
        T("(−)", VORZ, "fn", "Vorzeichen"), T("Ans", "Ans", "fn", "letztes Ergebnis")],
      tipps: [
        "Negative Zahl mit der Taste (−) vor der Zahl (Anleitung G-8).",
        "−2² ergibt −4. Beim Quadrieren einer negativen Zahl Klammern setzen: (−2)² = 4 (G-8).",
        "Quadratwurzel vor der Zahl; mit ► aus der Wurzel heraus: √2 ► + 2 (G-10).",
        "n-te Wurzel beim fx-82DE X: zuerst der Index (5√32 = 2).",
        "x², x³ und x^ nicht direkt hintereinander eingeben, sonst wird die zweite Eingabe ignoriert (G-16).",
        "Fehlt das Malzeichen vor einer Klammer, setzt der fx-82DE X Klammern: 6 ÷ 2(1 + 2) wird 6 ÷ (2(1 + 2)) = 1.",
        "S⇔D schaltet zwischen Bruch und Dezimalzahl (G-10). Die Anleitung zeigt ein Dezimalkomma; der Lernsteig schreibt den Punkt.",
      ],
    },
  };
  const modell = id => MODELLE[id] || MODELLE.allgemein;
  const vermerk = m => (m.hersteller ? `${m.name} ist eine Marke von ${m.hersteller}. Der Lernsteig ist nicht mit ${m.hersteller} verbunden; nachgebildet ist nur die Bedienung.` : "");

  /** Eingabezeile als Text, mit den Beschriftungen des Modells. */
  function zeile(eingabe, modellId) {
    const m = modell(modellId);
    const label = k => { const t = m.tasten.find(x => x.kennung === k && x.label); return k === "x²" ? "²" : (t && !/^[0-9]$/.test(k) && k !== "(" && k !== ")" ? t.label.replace(/[■□]/g, "") : k); };
    return eingabe.map(k => (["+", M, "·", ":"].includes(k) ? ` ${k} ` : label(k))).join("").replace(/\s+/g, " ").trim();
  }

  /** Tipp zu einem typischen Bedienfehler (R11 Abschnitt 2, „Typische Bedienfehler“), sonst null. */
  function tippZuFehler(eingabe, modellId, fehler) {
    const m = modell(modellId);
    if (eingabe[0] === M && m.familie !== "allgemein" || eingabe[0] === M && fehler) {
      return m.tasten.some(t => t.kennung === VORZ_NACH) ? "Für eine negative Zahl: Zahl eingeben, dann +⇔−." : "Für eine negative Zahl nimm (−), nicht die Minustaste.";
    }
    const i = eingabe.indexOf(VORZ);
    if (i >= 0 && eingabe[i + 2] === "x²") return "Achtung: (−)2² ergibt −4. Für das Quadrat einer negativen Zahl Klammern setzen.";
    return null;
  }

  // ---------- Teil 2: Seite ----------
  /**
   * Rechner-Feld. opt: { modell, uebernehmen(text), zu(), modellGewaehlt(id) }.
   * Tastatur: Ziffern, Punkt/Komma, + - * / ^ ( ), Enter = Ergebnis, Rücktaste, Esc schliesst.
   */
  function feld(opt) {
    const el = LST.el;
    let modellId = MODELLE[opt.modell] ? opt.modell : "allgemein";
    let eingabe = [], ans = null, ergebnis = null, fehler = null, tipp = null;
    const zeileEl = el("div", { class: "rechner-zeile", "aria-label": "Eingabe" });
    const ergEl = el("div", { class: "rechner-ergebnis", "aria-live": "polite" });
    const tippEl = el("div", { class: "rechner-tipp", "aria-live": "polite" });
    const zeichne = () => {
      zeileEl.textContent = zeile(eingabe, modellId) || " ";
      ergEl.textContent = fehler ? fehler : (ergebnis !== null ? "= " + anzeige(ergebnis) : " ");
      ergEl.classList.toggle("fehler", !!fehler);
      tippEl.textContent = tipp || "";
      tippEl.hidden = !tipp;
    };
    const tippe = z => {
      if (!z) return;
      if (ergebnis !== null && !fehler && /^[+−·:^]$/.test(z) && modell(modellId).tasten.some(t => t.kennung === "Ans")) eingabe = ["Ans"];
      else if (ergebnis !== null) eingabe = [];
      ergebnis = null; fehler = null; tipp = null; eingabe.push(z); zeichne();
    };
    const gleich = () => {
      const r = rechne(eingabe, ans);
      if (r.fehler) { fehler = r.fehler; ergebnis = null; } else { ergebnis = r.wert; ans = r.wert; fehler = null; }
      tipp = tippZuFehler(eingabe, modellId, !!r.fehler);
      zeichne();
    };
    const loesche = () => { if (ergebnis !== null) ergebnis = null; else eingabe.pop(); fehler = null; tipp = null; zeichne(); };
    const alles = () => { eingabe = []; ergebnis = null; fehler = null; tipp = null; zeichne(); };
    const knopf = (t, tun) => el("button", { type: "button", class: "rt " + t.klasse, text: t.label, "aria-label": t.aria || t.label, disabled: !t.label, onclick: tun || (() => tippe(t.kennung)) });

    const tastenBox = el("div", { class: "rechner-tasten" });
    const hilfeBox = el("div", { class: "rechner-hilfe", hidden: true });
    const vermerkEl = el("p", { class: "rechner-vermerk" });
    function baueTasten() {
      const m = modell(modellId);
      const Z = ZIFFERN.map(t => knopf(t));
      tastenBox.replaceChildren(...m.tasten.map(t => knopf(t)),
        Z[0], Z[1], Z[2], knopf(T("⌫", "", "fn", "Löschen"), loesche),
        Z[3], Z[4], Z[5], knopf(GRUND.geteilt),
        Z[6], Z[7], Z[8], knopf(GRUND.mal),
        Z[9], knopf(GRUND.punkt), knopf(GRUND.pi), knopf(GRUND.minus),
        knopf(T("AC", "", "fn", "alles löschen"), alles), knopf(T("=", "", "gleich", "gleich"), gleich), knopf(GRUND.plus),
        knopf(T("?", "", "fn hilfe", "Bedienhilfe"), () => { hilfeBox.hidden = !hilfeBox.hidden; }),
        el("button", { type: "button", class: "rt uebernehmen", text: "→ Antwort", "aria-label": "Ergebnis in die Antwort übernehmen", onclick: () => { if (ergebnis !== null && !fehler) opt.uebernehmen(anzeige(ergebnis)); } }));
      hilfeBox.replaceChildren(el("b", { text: `Bedienung ${m.name}` }), el("ul", {}, m.tipps.map(t => el("li", { text: t }))));
      vermerkEl.textContent = vermerk(m);
      vermerkEl.hidden = !m.hersteller;
    }
    const wahl = el("select", { class: "rechner-modell", "aria-label": "Rechnermodell", onchange: e => { modellId = e.target.value; alles(); baueTasten(); if (opt.modellGewaehlt) opt.modellGewaehlt(modellId); } },
      Object.entries(MODELLE).map(([id, m]) => el("option", { value: id, text: m.familie === "allgemein" ? "Rechner: allgemein" : `Bedienung wie ${m.name}`, selected: id === modellId })));
    const box = el("div", { class: "rechner", role: "group", "aria-label": "Taschenrechner", tabindex: "-1" },
      wahl, el("div", { class: "rechner-anzeige" }, zeileEl, ergEl), tippEl, tastenBox, hilfeBox, vermerkEl);
    box.addEventListener("keydown", e => {
      if (e.target === wahl) return;
      const k = e.key;
      const zuordnung = { "*": "·", "/": ":", "-": M, "+": "+", "^": "^", "(": "(", ")": ")", ",": ".", ".": "." };
      if (/^[0-9]$/.test(k)) tippe(k);
      else if (zuordnung[k]) tippe(zuordnung[k]);
      else if (k === "Enter" || k === "=") gleich();
      else if (k === "Backspace") loesche();
      else if (k === "Escape") { box.hidden = true; if (opt.zu) opt.zu(); }
      else return;
      e.preventDefault(); e.stopPropagation();
    });
    baueTasten();
    zeichne();
    return { element: box };
  }

  return { VORZ, VORZ_NACH, WURZEL_NACH, NTE_INDEX, NTE_RADIKAND, MODELLE, rechne, anzeige, zeile, tippZuFehler, feld };
})();

if (typeof module !== "undefined") module.exports = LST_RECHNER;
