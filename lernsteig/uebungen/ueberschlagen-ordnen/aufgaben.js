/* Übung „Überschlagen und Ordnen“ — MA.1.A.2, Stufen h, i, j (Gymnasium und EAP prüfen h, i, j; PA). Ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.1.A.2:
   h  Summen und Differenzen mit Dezimalzahlen überschlagen; Ergebnisse von Prozentrechnungen überschlagen
      (263 von 830 ≈ 30 %)
   i  (Erweiterung) Produkte und Quotienten von Dezimalzahlen überschlagen (0.382 : 42.8 → 0.4 : 40 = 0.01)
   j  (GA, OP) positive und negative rationale Zahlen ordnen (auf dem Zahlenstrahl)
   Antworten zum Auswählen (art: "auswahl"). Annahme: Beim Überschlagen liegen die falschen Antworten mindestens um den
   Faktor 1.8 neben dem genauen Wert, damit genau eine Antwort als Überschlag passt. */
"use strict";

const UEBUNG = {
  id: "ueberschlagen-ordnen",
  einleitung: "Wähle die passende Antwort. Taste 1 bis 4 wählt auch.",
  stufen: {
    h: "Summen, Differenzen und Prozent überschlagen",
    i: "Produkte und Quotienten von Dezimalzahlen überschlagen",
    j: "Positive und negative Zahlen ordnen, auch Brüche",
    challenge: "Nahe beieinander liegende Zahlen ordnen, Überschlag in mehreren Schritten",
  },
};

const M = "−", MAL = " · ";
const z = (a, b) => LST.zufall(a, b);
const dez = x => LST.dezimalText(x);
const dezZ = (min, max, st) => z(min * 10 ** st, max * 10 ** st) / 10 ** st;
// Runde auf eine gültige Ziffer (für Überschläge)
const eineStelle = x => { const e = Math.floor(Math.log10(Math.abs(x))); return Math.round(x / 10 ** e) * 10 ** e; };

function auswahl(stufe, typ, text, optionen, richtigWert, weg, daten) {
  const gemischt = LST.mische(optionen);
  const texte = gemischt.map(o => o.text);
  return { art: "auswahl", stufe, typ, text, optionen: texte, richtig: gemischt.findIndex(o => o.richtig), loesung: optionen.find(o => o.richtig).text, weg, kennung: `${text} | ${texte.slice().sort().join(" | ")}`, daten: Object.assign({ werte: gemischt.map(o => o.wert) }, daten), antwort: richtigWert };
}

// Überschlag-Auswahl: richtig ist der Überschlag R, daneben R·10, R/10 und R·2 oder R/2 (eindeutig)
function ueberschlagOptionen(R, formatiere) {
  // Grössenordnung: falsche Antworten um Zehnerpotenzen daneben (eindeutig, auch bei grober Rundung)
  const faktoren = [10, 0.1, LST.waehle([100, 0.01])];
  return [{ wert: R, richtig: true }, ...faktoren.map(f => ({ wert: R * f, richtig: false }))]
    .map(o => Object.assign(o, { text: formatiere(Number((o.wert).toPrecision(6))) }));
}

// ---------- h ----------
function stufeH() {
  const typ = LST.waehle(["summe", "differenz", "prozent"]);
  if (typ === "prozent") {
    const p = LST.waehle([10, 20, 25, 30, 40, 50, 60, 70, 75, 80]);
    const g = z(120, 990), w = Math.round(g * (p + LST.waehle([-3, -2, -1, 1, 2, 3])) / 100);
    // falsche Antworten: Prozentsätze bis 100, mindestens Faktor 1.8 neben dem genauen Wert
    const genauP = w / g * 100;
    const kandidaten = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100].filter(v => v !== p && Math.max(v / genauP, genauP / v) >= 1.8);
    const opt = [{ wert: p, richtig: true, text: `etwa ${p} %` }, ...LST.mische(kandidaten).slice(0, 3).map(v => ({ wert: v, richtig: false, text: `etwa ${v} %` }))];
    return auswahl("h", typ, `${dez(w)} von ${dez(g)} sind …`, opt, p, `${dez(w)} : ${dez(g)} ≈ ${dez(Math.round(w / g * 1000) / 10)} % ≈ ${p} %`, { w, g });
  }
  const n = z(2, 4), st = LST.waehle([1, 2]);
  const zahlen = Array.from({ length: n }, () => dezZ(1, LST.waehle([99, 999]), st));
  if (typ === "differenz") zahlen.sort((x, y) => y - x);
  const genau = typ === "summe" ? zahlen.reduce((s, x) => s + x, 0) : zahlen.slice(1).reduce((s, x) => s - x, zahlen[0]);
  if (genau <= 0) return stufeH();
  const R = eineStelle(genau);
  const opt = ueberschlagOptionen(R, v => `etwa ${dez(v)}`);
  const t = zahlen.map(dez).join(typ === "summe" ? " + " : ` ${M} `);
  return auswahl("h", typ, `Überschlage: ${t}`, opt, R, `gerundet etwa ${dez(R)} (genau ${dez(Math.round(genau * 100) / 100)})`, { zahlen });
}

// ---------- i ----------
function stufeI() {
  const typ = LST.waehle(["produkt", "quotient"]);
  const a = Number((dezZ(1, 9.9, 1) * 10 ** z(-3, 2)).toPrecision(3)), b = Number((dezZ(1, 9.9, 1) * 10 ** z(-2, 2)).toPrecision(3));
  const genau = typ === "produkt" ? a * b : a / b;
  const R = eineStelle(eineStelle(a) * (typ === "produkt" ? eineStelle(b) : 1 / eineStelle(b)));
  if (Math.max(R / genau, genau / R) > 1.55) return stufeI(); // Überschlag muss als solcher taugen
  const opt = ueberschlagOptionen(R, v => `etwa ${dez(v)}`);
  return auswahl("i", typ, `Überschlage: ${dez(a)}${typ === "produkt" ? MAL : " : "}${dez(b)}`, opt, R,
    (() => { const roh = Number((typ === "produkt" ? eineStelle(a) * eineStelle(b) : eineStelle(a) / eineStelle(b)).toPrecision(6));
      return `${dez(eineStelle(a))}${typ === "produkt" ? MAL : " : "}${dez(eineStelle(b))} = ${dez(roh)}${roh === R ? "" : ` ≈ ${dez(R)}`}`; })(), { a, b });
}

// ---------- j: ordnen ----------
const B = () => LST_BRUCH;
function rationaleZahl(nah) {
  // Dezimalzahl oder Bruch, positiv oder negativ; nah: Zahlen zwischen −1 und 1
  const vorz = LST.zufall(0, 1) ? -1 : 1;
  if (LST.zufall(0, 1)) {
    const n = LST.waehle([2, 3, 4, 5, 6, 8, 10]), zz = z(1, nah ? n - 1 : 3 * n);
    if (zz % n === 0) return rationaleZahl(nah); // kein Bruch, der eine ganze Zahl ist (6/6)
    return { wert: vorz * zz / n, text: `${vorz < 0 ? M : ""}${zz}/${n}`, b: [vorz * zz, n] };
  }
  const w = nah ? z(1, 99) / 100 : z(1, 300) / 10;
  return { wert: vorz * w, text: dez(vorz * w), b: null };
}
function stufeJ(challengeModus) {
  const typ = LST.waehle(["groesste", "kleinste", "naechste-null"]);
  const zahlen = [];
  while (zahlen.length < 4) {
    const x = rationaleZahl(challengeModus || LST.zufall(0, 1));
    if (zahlen.some(y => Math.abs(y.wert - x.wert) < (challengeModus ? 0.02 : 0.1))) continue;
    zahlen.push(x);
  }
  const ziel = typ === "groesste" ? Math.max(...zahlen.map(x => x.wert)) : typ === "kleinste" ? Math.min(...zahlen.map(x => x.wert)) : zahlen.reduce((m, x) => Math.abs(x.wert) < Math.abs(m.wert) ? x : m).wert;
  if (typ === "naechste-null" && zahlen.filter(x => Math.abs(Math.abs(x.wert) - Math.abs(ziel)) < 1e-9).length > 1) return stufeJ(challengeModus);
  const opt = zahlen.map(x => ({ wert: x.wert, richtig: x.wert === ziel, text: x.text }));
  const frage = { groesste: "Welche Zahl ist am grössten?", kleinste: "Welche Zahl ist am kleinsten?", "naechste-null": "Welche Zahl liegt am nächsten bei 0?" }[typ];
  const sortiert = zahlen.slice().sort((x, y) => x.wert - y.wert).map(x => x.text).join(" < ");
  return auswahl(challengeModus ? "challenge" : "j", typ, frage, opt, ziel, `Der Grösse nach: ${sortiert}`, { texte: zahlen.map(x => x.text) });
}

function challenge() {
  return LST.zufall(0, 1) ? stufeJ(true) : (() => {
    // Überschlag in zwei Schritten: (a · b) : c
    const a = Number((dezZ(1, 9.9, 1) * 10 ** z(0, 2)).toPrecision(3)), b = Number((dezZ(1, 9.9, 1) * 10 ** z(-1, 1)).toPrecision(3)), c = Number((dezZ(1, 9.9, 1) * 10 ** z(-1, 1)).toPrecision(3));
    const genau = a * b / c;
    const R = eineStelle(eineStelle(a) * eineStelle(b) / eineStelle(c));
    if (Math.max(R / genau, genau / R) > 1.55) return challenge();
    const opt = ueberschlagOptionen(R, v => `etwa ${dez(v)}`);
    return auswahl("challenge", "zwei-schritte", `Überschlage: (${dez(a)}${MAL}${dez(b)}) : ${dez(c)}`, opt, R, `(${dez(eineStelle(a))}${MAL}${dez(eineStelle(b))}) : ${dez(eineStelle(c))} ≈ ${dez(R)}`, { a, b, c });
  })();
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "h") return stufeH();
  if (stufe === "i") return stufeI();
  if (stufe === "j") return stufeJ(false);
  if (stufe === "challenge") return challenge();
  throw new Error(`ueberschlagen-ordnen: keine Stufe ${stufe}`);
}

function hinweis(a, gewaehlt) {
  const h = {
    summe: "Runde jede Zahl auf eine bequeme Zahl (Zehner, Hunderter) und addiere im Kopf.",
    differenz: "Runde beide Zahlen grob und subtrahiere im Kopf.",
    prozent: "Teil durch Ganzes: Wie oft passt der Teil ungefähr ins Ganze? Ein Zehntel sind 10 %.",
    produkt: "Runde beide Zahlen auf eine Ziffer ungleich null und achte auf die Stellenzahl.",
    quotient: "Runde beide Zahlen auf eine Ziffer ungleich null. Kleiner Divisor gibt ein grosses Ergebnis.",
    groesste: "Negative Zahlen sind kleiner als positive. Bei negativen Zahlen ist die mit dem kleineren Betrag grösser.",
    kleinste: "Negative Zahlen sind kleiner als positive. Bei negativen Zahlen ist die mit dem grösseren Betrag kleiner.",
    "naechste-null": "Vergleiche die Beträge, das Vorzeichen spielt keine Rolle. Brüche als Dezimalzahl denken.",
    "zwei-schritte": "Runde alle drei Zahlen auf eine Ziffer ungleich null und rechne im Kopf.",
  };
  return h[a.typ] || "Denk an den Zahlenstrahl.";
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  if (a.optionen.length !== 4) m.push("nicht vier Antworten");
  if (new Set(a.optionen).size !== a.optionen.length) m.push(`doppelte Antworten: ${a.optionen.join(" | ")}`);
  if (!(a.richtig >= 0 && a.richtig < a.optionen.length)) return m.concat("keine richtige Antwort");
  if (a.optionen[a.richtig] !== a.loesung) m.push("Lösung passt nicht zur richtigen Antwort");
  const d = a.daten;
  if (["summe", "differenz", "prozent", "produkt", "quotient", "zwei-schritte"].includes(a.typ)) {
    // genauer Wert unabhängig nachrechnen; richtig muss am nächsten liegen, die anderen um mindestens Faktor 1.8 daneben
    let genau;
    if (a.typ === "summe") genau = d.zahlen.reduce((s, x) => s + x, 0);
    else if (a.typ === "differenz") genau = d.zahlen.slice(1).reduce((s, x) => s - x, d.zahlen[0]);
    else if (a.typ === "prozent") genau = d.w / d.g * 100;
    else if (a.typ === "produkt") genau = d.a * d.b;
    else if (a.typ === "quotient") genau = d.a / d.b;
    else genau = d.a * d.b / d.c;
    const abst = v => Math.abs(Math.log(v / genau));
    d.werte.forEach((v, i) => {
      if (!(v > 0)) m.push(`Antwort nicht positiv: ${a.optionen[i]}`);
      if (i !== a.richtig && abst(v) < Math.log(1.8) - 1e-9) m.push(`Antwort ${a.optionen[i]} liegt zu nahe beim genauen Wert ${genau}`);
      if (i !== a.richtig && abst(v) <= abst(d.werte[a.richtig])) m.push(`Antwort ${a.optionen[i]} passt besser als die richtige`);
    });
    if (abst(d.werte[a.richtig]) > Math.log(1.6)) m.push(`Überschlag ${a.loesung} weicht zu stark ab (genau ${genau})`);
  } else {
    // ordnen: Werte aus dem angezeigten Text exakt lesen
    const br = LST_BRUCH;
    const lies = t => { const neg = t.startsWith(M); const s = neg ? t.slice(1) : t; const [zz, n] = s.split("/"); const b = n ? br.bruch(BigInt(zz), BigInt(n)) : br.zahl(s); return neg ? br.neg(b) : b; };
    const werte = a.optionen.map(lies);
    const vgl = (x, y) => { const d2 = br.minus(x, y); return d2.z > 0n ? 1 : d2.z < 0n ? -1 : 0; };
    const betrag = x => (x.z < 0n ? br.neg(x) : x);
    let best = 0;
    werte.forEach((w, i) => {
      if (a.typ === "groesste" && vgl(w, werte[best]) > 0) best = i;
      if (a.typ === "kleinste" && vgl(w, werte[best]) < 0) best = i;
      if (a.typ === "naechste-null" && vgl(betrag(w), betrag(werte[best])) < 0) best = i;
    });
    if (best !== a.richtig) m.push(`richtige Antwort wäre ${a.optionen[best]}: ${a.text} ${a.optionen.join(" | ")}`);
    const gleich = werte.filter((w, i) => i !== best && (a.typ === "naechste-null" ? vgl(betrag(w), betrag(werte[best])) === 0 : vgl(w, werte[best]) === 0));
    if (gleich.length) m.push(`mehrere gleich gute Antworten: ${a.optionen.join(" | ")}`);
  }
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
