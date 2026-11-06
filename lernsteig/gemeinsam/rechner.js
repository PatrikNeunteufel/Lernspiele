/* Lernsteig — eingebauter Taschenrechner (Entscheide TR1 a, RE1 a, RM1 b; Recherche R11:
   docs/lernsteig/lehrplan/rechnermodelle_sg.md).
   Funktionen wie an der Aufnahmeprüfung SG vorausgesetzt (TR): Grundoperationen, Potenzieren, Wurzelziehen,
   Fliesskommadarstellung; dazu Klammern, Vorzeichen, π, Ans. Keine Prozent-Taste, keine Brüche, kein Gleichungslöser,
   kein Graph.
   Ansichten: „allgemein“ und je Modell die **Bedienlogik** (Tastenfolgen, Vorzeichen, Wurzel vor oder nach der Zahl,
   Index vor oder nach dem Radikanden, Ans) mit eigenem, sachlichem Aussehen, Modellname, Markenvermerk und Hinweis
   „nicht verbunden mit …“ (R11 Abschnitt 3 und F3: kein getreues Abbild, keine Fotos oder Logos).
   Teil 1, der Rechenkern (Tasten-Kennungen, Auswertung, Anzeige), steht im Kern (KERN.rechner); hier stehen die Modelle,
   die Eingabezeile mit ihren Beschriftungen, die Tipps zu Bedienfehlern und das Tastenfeld der Seite. */
"use strict";

var LST_RECHNER = (function () {
  // Rechenkern im Kern (KERN.rechner, docs/kern/rahmen.md 4.18, seit kern 1.14.0): Kennungen, rechne, anzeige.
  const RK = KERN.rechner;
  const { MINUS: M, VORZ, VORZ_NACH, WURZEL_NACH, NTE_INDEX, NTE_RADIKAND, rechne } = RK;
  /** Ergebnis in der Schreibweise des Lernsteigs, höchstens 10 gültige Ziffern; sehr gross oder klein wissenschaftlich. */
  const anzeige = w => RK.anzeige(w, LST.schreibweise());

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
