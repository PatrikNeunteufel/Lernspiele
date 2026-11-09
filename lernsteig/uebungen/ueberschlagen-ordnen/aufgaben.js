/* Übung „Überschlagen und Ordnen“ — MA.1.A.2, Stufen h, i, j (Gymnasium und EAP prüfen h, i, j; PA). Ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.1.A.2:
   h  Summen und Differenzen mit Dezimalzahlen überschlagen (0.723 − 0.04, 23'268 + 4'785 ≈ 28'000: Zahlen unter 1,
      bis 999 und über 1'000); Ergebnisse von Prozentrechnungen überschlagen (263 von 830 ≈ 30 %; 45 % von 13'000 sind
      mehr als 5'000)
   i  (Erweiterung) Produkte und Quotienten von Dezimalzahlen überschlagen (0.382 : 42.8 → 0.4 : 40 = 0.01)
   j  (GA, OP) positive und negative rationale Zahlen ordnen (auf dem Zahlenstrahl)
   Antworten zum Auswählen (art: "auswahl"). Plan E 3 (E3-1 a, E3-2 a, LERN_Session24): Der Überschlag kommt aus
   gerundeten Zahlen — Summe und Differenz: alle auf die zweite Stelle der grössten Zahl (23'268 → 23'000,
   4'785 → 5'000); Produkt und Quotient: jede auf eine Ziffer. Daneben ein oder zwei Ablenker aus einer falsch
   gerundeten Zahl (falsche Richtung, eine Stelle zu grob, Komma verschoben), 10–30 % neben dem genauen Wert und
   mindestens 5 % weiter weg als die richtige Antwort; der Rest um Zehnerpotenzen daneben. Prozentsatz: zwei oder drei
   Sätze 10–30 % daneben. Prozentwert: „mehr als / weniger als“ eine Schwelle 10–40 % neben dem genauen Wert. */
"use strict";

const UEBUNG = {
  id: "ueberschlagen-ordnen",
  einleitung: "Wähle die passende Antwort. Taste 1 bis 4 wählt auch.",
  stufen: {
    h: "Summen, Differenzen, Prozentsätze und Prozentwerte überschlagen",
    i: "Produkte und Quotienten von Dezimalzahlen überschlagen",
    j: "Positive und negative Zahlen ordnen, auch Brüche",
    challenge: "Nahe beieinander liegende Zahlen ordnen, Überschlag in mehreren Schritten",
  },
};

const M = "−", MAL = " · ";
const z = (a, b) => LST.zufall(a, b);
const dez = x => LST.dezimalText(x);
const dezZ = (min, max, st) => z(min * 10 ** st, max * 10 ** st) / 10 ** st;
const nb = x => Number(Number(x).toPrecision(12)); // Rechenreste weg
const stelle = x => Math.floor(Math.log10(Math.abs(x)) + 1e-12);
const aufStelle = (x, e) => nb(Math.round(nb(x / 10 ** e)) * 10 ** e);
const abStelle = (x, e) => nb(Math.trunc(nb(x / 10 ** e)) * 10 ** e);
const hochStelle = (x, e) => nb(Math.ceil(nb(x / 10 ** e)) * 10 ** e);
// Runde auf eine gültige Ziffer (für Überschläge)
const eineStelle = x => aufStelle(x, stelle(x));
// Ergebnis eines Produkts oder Quotienten aus gerundeten Zahlen: höchstens zwei Ziffern, sonst auf eine gerundet
const kurz = x => (Number(x.toPrecision(2)) === x ? x : eineStelle(x));

// Abstand zum genauen Wert und Ablenker aus falschem Runden (E3-1 a): 10–30 % daneben, 5 % weiter weg als die richtige
const abstand = (v, genau) => Math.abs(Math.log(v / genau));
const imBand = (v, genau) => { const q = v / genau; return (q >= 0.7 - 1e-9 && q <= 0.9 + 1e-9) || (q >= 1.1 - 1e-9 && q <= 1.3 + 1e-9); };
const MARGE = Math.log(1.05);
const SAETZE = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100];

// fest: Reihenfolge der Antworten bleibt (mehr als / weniger als)
function auswahl(stufe, typ, text, optionen, richtigWert, weg, daten, fest) {
  const gemischt = fest ? optionen : LST.mische(optionen);
  const texte = gemischt.map(o => o.text);
  return { art: "auswahl", stufe, typ, text, optionen: texte, richtig: gemischt.findIndex(o => o.richtig), loesung: optionen.find(o => o.richtig).text, weg, kennung: `${text} | ${texte.slice().sort().join(" | ")}`, daten: Object.assign({ werte: gemischt.map(o => o.wert), fehler: gemischt.map(o => o.fehler || null) }, daten), antwort: richtigWert };
}

/** Eine Zahl falsch gerundet (Regel: Stelle e): richtung | grob | komma10 | komma01; null, wenn es nichts ändert. */
function falschGerundet(v, e, art) {
  const richtig = aufStelle(v, e);
  let w;
  if (art === "richtung") w = richtig === abStelle(v, e) ? hochStelle(v, e) : abStelle(v, e);
  else if (art === "grob") w = aufStelle(v, e + 1);
  else if (art === "komma10") w = nb(richtig * 10);
  else if (art === "komma01") w = nb(richtig / 10);
  else return null;
  return w === richtig ? null : w;
}
/** Für Produkt und Quotient: jede Zahl auf eine Ziffer; falsch ist die andere Richtung. */
const falscheRichtung = v => falschGerundet(v, stelle(v), "richtung");

/**
 * Antworten zum Überschlag R: ein oder zwei Ablenker aus den Kandidaten { i, art, wert } (im Band, um MARGE weiter weg
 * als R), der Rest Zehnerpotenzen von R. null, wenn kein Kandidat passt.
 */
function optionenMitRundung(genau, R, kandidaten) {
  const text = v => `etwa ${dez(v)}`;
  const gesehen = new Set([text(R)]);
  const rund = [];
  for (const k of LST.mische(kandidaten)) {
    if (!(k.wert > 0) || !imBand(k.wert, genau) || abstand(k.wert, genau) - abstand(R, genau) < MARGE || gesehen.has(text(k.wert))) continue;
    gesehen.add(text(k.wert));
    rund.push(k);
    if (rund.length === 2) break;
  }
  if (!rund.length) return null;
  const potenzen = LST.mische([10, 0.1, 100, 0.01]).map(f => nb(R * f)).filter(v => !gesehen.has(text(v))).slice(0, 3 - rund.length);
  return [{ wert: R, richtig: true, text: text(R) },
    ...rund.map(k => ({ wert: k.wert, richtig: false, text: text(k.wert), fehler: { i: k.i, art: k.art } })),
    ...potenzen.map(v => ({ wert: v, richtig: false, text: text(v), fehler: { art: "potenz" } }))];
}

// ---------- h ----------
const regelStelle = zahlen => stelle(Math.max(...zahlen)) - 1;
const summeMit = (typ, l) => nb(typ === "summe" ? l.reduce((s, x) => s + x, 0) : l.slice(1).reduce((s, x) => s - x, l[0]));
/** Wert einer falsch gerundeten Zahl i im Überschlag (für Erzeugen und Prüfen). */
function ueberschlagMitFehler(typ, zahlen, f) {
  if (typ === "summe" || typ === "differenz") {
    const e = regelStelle(zahlen), w = falschGerundet(zahlen[f.i], e, f.art);
    return w === null ? null : summeMit(typ, zahlen.map((u, j) => (j === f.i ? w : aufStelle(u, e))));
  }
  if (f.art !== "richtung") return null;
  const w = falscheRichtung(zahlen[f.i]);
  if (w === null) return null;
  const r = zahlen.map((u, j) => (j === f.i ? w : eineStelle(u)));
  return kurz(nb(typ === "produkt" ? r[0] * r[1] : typ === "quotient" ? r[0] / r[1] : r[0] * r[1] / r[2]));
}
function stufeH() {
  const typ = LST.waehle(["summe", "differenz", "prozent", "prozentwert"]);
  if (typ === "prozent") return prozentSatz();
  if (typ === "prozentwert") return prozentWert();
  for (;;) {
    // Zahlbereiche der Beispiele (E3-2 a): unter 1 (0.723 − 0.04), bis 999, über 1'000 (23'268 + 4'785)
    const bereich = LST.waehle(["klein", "mittel", "gross"]);
    const n = typ === "differenz" ? 2 : z(2, 3);
    const zahl = () => (bereich === "klein" ? z(1, 999) / 1000 : bereich === "gross" ? z(1000, 99999) : dezZ(1, LST.waehle([99, 999]), LST.waehle([1, 2])));
    const zahlen = Array.from({ length: n }, zahl);
    if (typ === "differenz") zahlen.sort((x, y) => y - x);
    const e = regelStelle(zahlen);
    const genau = summeMit(typ, zahlen), R = summeMit(typ, zahlen.map(v => aufStelle(v, e)));
    if (!(genau > 0) || !(R > 0)) continue;
    const kand = [];
    zahlen.forEach((v, i) => {
      for (const art of ["richtung", "grob", "komma10", "komma01"]) {
        const w = ueberschlagMitFehler(typ, zahlen, { i, art });
        if (w !== null) kand.push({ i, art, wert: w });
      }
    });
    const opt = optionenMitRundung(genau, R, kand);
    if (!opt) continue;
    const zeichen = typ === "summe" ? " + " : ` ${M} `;
    return auswahl("h", typ, `Überschlage: ${zahlen.map(dez).join(zeichen)}`, opt, R,
      `${zahlen.map(v => dez(aufStelle(v, e))).join(zeichen)} = ${dez(R)} (genau ${dez(genau)})`, { zahlen });
  }
}
// Prozentsatz überschlagen (263 von 830 ≈ 30 %): zwei oder drei Ablenker 10–30 % neben dem genauen Satz
function prozentSatz() {
  for (;;) {
    const p = LST.waehle([10, 20, 25, 30, 40, 50, 60, 70, 75, 80]);
    const g = z(120, 990), w = Math.round(g * (p + LST.waehle([-3, -2, -1, 1, 2, 3])) / 100);
    const genauP = w / g * 100;
    const nah = LST.mische(SAETZE.filter(v => v !== p && imBand(v, genauP) && abstand(v, genauP) - abstand(p, genauP) >= MARGE));
    if (nah.length < 2) continue;
    const fern = LST.mische(SAETZE.filter(v => !nah.includes(v) && abstand(v, genauP) >= Math.log(1.3)));
    const falsch = nah.slice(0, LST.waehle([2, 3])).concat(fern).slice(0, 3);
    if (falsch.length < 3) continue;
    const opt = [{ wert: p, richtig: true, text: `etwa ${p} %` }, ...falsch.map(v => ({ wert: v, richtig: false, text: `etwa ${v} %`, fehler: { art: "satz" } }))];
    return auswahl("h", "prozent", `${dez(w)} von ${dez(g)} sind …`, opt, p, `${dez(w)} : ${dez(g)} ≈ ${dez(Math.round(w / g * 1000) / 10)} % ≈ ${p} %`, { w, g });
  }
}
// Prozentwert überschlagen (45 % von 13'000 sind mehr als 5'000): Schwelle 10–40 % neben dem genauen Wert
function prozentWert() {
  for (;;) {
    const p = LST.waehle([15, 22, 27, 35, 45, 48, 52, 55, 65, 73, 78, 85]);
    const G = z(11, 99) * 10 ** z(2, 3), genau = p * G / 100;
    const S = eineStelle(genau * LST.waehle([0.75, 0.8, 0.85, 1.15, 1.2, 1.25]));
    const q = Math.abs(genau / S - 1);
    if (q < 0.1 || q > 0.4) continue;
    const mehr = genau > S;
    const opt = [{ wert: S, richtig: mehr, text: `mehr als ${dez(S)}` }, { wert: S, richtig: !mehr, text: `weniger als ${dez(S)}` }];
    return auswahl("h", "prozentwert", `${p} % von ${dez(G)} sind …`, opt, genau, `${p} % von ${dez(G)} = ${dez(genau)}, also ${mehr ? "mehr" : "weniger"} als ${dez(S)}`, { p, G, S }, true);
  }
}

// ---------- i ----------
function stufeI() {
  const typ = LST.waehle(["produkt", "quotient"]); // vor der Schleife: Neuziehen ändert die Anteile nicht
  for (;;) {
    const a = Number((dezZ(1, 9.9, 1) * 10 ** z(-3, 2)).toPrecision(3)), b = Number((dezZ(1, 9.9, 1) * 10 ** z(-2, 2)).toPrecision(3));
    const zahlen = [a, b];
    const genau = typ === "produkt" ? a * b : a / b;
    const roh = nb(typ === "produkt" ? eineStelle(a) * eineStelle(b) : eineStelle(a) / eineStelle(b));
    const R = kurz(roh);
    if (Math.max(R / genau, genau / R) > 1.55) continue; // Überschlag muss als solcher taugen
    const kand = [0, 1].map(i => ({ i, art: "richtung", wert: ueberschlagMitFehler(typ, zahlen, { i, art: "richtung" }) })).filter(k => k.wert !== null);
    const opt = optionenMitRundung(genau, R, kand);
    if (!opt) continue;
    const zeichen = typ === "produkt" ? MAL : " : ";
    const rohText = dez(Number(roh.toPrecision(6)));
    return auswahl("i", typ, `Überschlage: ${dez(a)}${zeichen}${dez(b)}`, opt, R,
      `${dez(eineStelle(a))}${zeichen}${dez(eineStelle(b))} = ${rohText}${roh === R ? "" : ` ≈ ${dez(R)}`}`, { a, b });
  }
}

// ---------- j: ordnen ----------
const B = () => KERN.bruch;
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
  if (LST.zufall(0, 1)) return stufeJ(true);
  for (;;) {
    // Überschlag in zwei Schritten: (a · b) : c, Ablenker aus falschem Runden wie in i
    const a = Number((dezZ(1, 9.9, 1) * 10 ** z(0, 2)).toPrecision(3)), b = Number((dezZ(1, 9.9, 1) * 10 ** z(-1, 1)).toPrecision(3)), c = Number((dezZ(1, 9.9, 1) * 10 ** z(-1, 1)).toPrecision(3));
    const zahlen = [a, b, c];
    const genau = a * b / c;
    const R = kurz(nb(eineStelle(a) * eineStelle(b) / eineStelle(c)));
    if (Math.max(R / genau, genau / R) > 1.55) continue;
    const kand = [0, 1, 2].map(i => ({ i, art: "richtung", wert: ueberschlagMitFehler("zwei-schritte", zahlen, { i, art: "richtung" }) })).filter(k => k.wert !== null);
    const opt = optionenMitRundung(genau, R, kand);
    if (!opt) continue;
    return auswahl("challenge", "zwei-schritte", `Überschlage: (${dez(a)}${MAL}${dez(b)}) : ${dez(c)}`, opt, R, `(${dez(eineStelle(a))}${MAL}${dez(eineStelle(b))}) : ${dez(eineStelle(c))} ≈ ${dez(R)}`, { a, b, c });
  }
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "h") return stufeH();
  if (stufe === "i") return stufeI();
  if (stufe === "j") return stufeJ(false);
  if (stufe === "challenge") return challenge();
  throw new Error(`ueberschlagen-ordnen: keine Stufe ${stufe}`);
}

const zahlenDer = d => d.zahlen || [d.a, d.b, d.c].filter(x => x !== undefined);
function hinweis(a, gewaehlt) {
  // Gewählte Antwort aus falschem Runden (E3-1 a): die Zahl nennen, die anders gerundet wurde
  const i = a.optionen ? a.optionen.indexOf(gewaehlt) : -1;
  const f = i >= 0 && a.daten && a.daten.fehler ? a.daten.fehler[i] : null;
  if (f && f.i !== undefined) {
    const zt = dez(zahlenDer(a.daten)[f.i]);
    if (f.art === "richtung") return `Prüfe, wie du ${zt} gerundet hast: auf- oder abrunden?`;
    if (f.art === "grob") return `${zt} ist zu grob gerundet. Runde alle Zahlen auf dieselbe Stelle.`;
    return `Prüfe die Stellen von ${zt}: eine Stelle zu viel oder zu wenig?`;
  }
  if (f && f.art === "potenz") return "Die Ziffern passen, aber das Ergebnis ist viel zu gross oder zu klein. Zähle die Stellen.";
  const h = {
    summe: "Runde alle Zahlen auf dieselbe Stelle, die zweite Stelle der grössten Zahl, und addiere im Kopf.",
    differenz: "Runde beide Zahlen auf dieselbe Stelle, die zweite Stelle der grösseren Zahl, und subtrahiere im Kopf.",
    prozent: "Teil durch Ganzes: Wie oft passt der Teil ungefähr ins Ganze? Ein Zehntel sind 10 %.",
    prozentwert: "Denk an bequeme Anteile: 50 % ist die Hälfte, 25 % ein Viertel, 10 % ein Zehntel.",
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
  const anzahl = a.typ === "prozentwert" ? 2 : 4;
  if (a.optionen.length !== anzahl) m.push(`nicht ${anzahl} Antworten`);
  if (new Set(a.optionen).size !== a.optionen.length) m.push(`doppelte Antworten: ${a.optionen.join(" | ")}`);
  if (!(a.richtig >= 0 && a.richtig < a.optionen.length)) return m.concat("keine richtige Antwort");
  if (a.optionen[a.richtig] !== a.loesung) m.push("Lösung passt nicht zur richtigen Antwort");
  const d = a.daten;
  if (a.typ === "prozentwert") {
    // genauer Prozentwert gegen die Schwelle: mindestens 10 % Abstand, richtig ist die Seite, auf der er liegt
    const genau = d.p * d.G / 100, mehr = genau > d.S;
    if (a.text !== `${d.p} % von ${dez(d.G)} sind …`) m.push(`Text passt nicht zu den Prüfdaten: ${a.text}`);
    if (Math.abs(genau / d.S - 1) < 0.1 - 1e-9) m.push(`Schwelle ${d.S} zu nahe beim genauen Wert ${genau}`);
    if (JSON.stringify(a.optionen) !== JSON.stringify([`mehr als ${dez(d.S)}`, `weniger als ${dez(d.S)}`])) m.push(`Antworten ${a.optionen.join(" | ")}`);
    if (a.loesung !== `${mehr ? "mehr" : "weniger"} als ${dez(d.S)}`) m.push(`richtig wäre „${mehr ? "mehr" : "weniger"} als“: ${a.text} (genau ${genau})`);
  } else if (["summe", "differenz", "prozent", "produkt", "quotient", "zwei-schritte"].includes(a.typ)) {
    // genauer Wert unabhängig nachrechnen; richtig liegt am nächsten, jede andere Antwort mindestens 10 % daneben und
    // mindestens 5 % weiter weg als die richtige (E3-1 a); jeder Ablenker aus seinem Fehler nachgerechnet
    let genau;
    if (a.typ === "summe") genau = d.zahlen.reduce((s, x) => s + x, 0);
    else if (a.typ === "differenz") genau = d.zahlen.slice(1).reduce((s, x) => s - x, d.zahlen[0]);
    else if (a.typ === "prozent") genau = d.w / d.g * 100;
    else if (a.typ === "produkt") genau = d.a * d.b;
    else if (a.typ === "quotient") genau = d.a / d.b;
    else genau = d.a * d.b / d.c;
    const abst = v => Math.abs(Math.log(v / genau));
    const R = d.werte[a.richtig];
    const text = v => (a.typ === "prozent" ? `etwa ${v} %` : `etwa ${dez(v)}`);
    let rundung = 0;
    d.werte.forEach((v, i) => {
      if (!(v > 0)) m.push(`Antwort nicht positiv: ${a.optionen[i]}`);
      if (a.optionen[i] !== text(v)) m.push(`Antwort „${a.optionen[i]}“ zeigt nicht den Wert ${v}`);
      if (i === a.richtig) return;
      if (abst(v) < Math.log(1.1) - 1e-9) m.push(`Antwort ${a.optionen[i]} liegt zu nahe beim genauen Wert ${genau}`);
      if (abst(v) - abst(R) < MARGE - 1e-9) m.push(`Antwort ${a.optionen[i]} liegt nicht klar weiter weg als die richtige (genau ${genau})`);
      const f = d.fehler[i];
      if (!f) { m.push(`Antwort ${a.optionen[i]} ohne Herkunft`); return; }
      if (f.art === "potenz") {
        const q = Math.log10(v / R);
        if (Math.abs(q - Math.round(q)) > 1e-9 || Math.round(q) === 0) m.push(`Antwort ${a.optionen[i]} ist keine Zehnerpotenz von ${a.loesung}`);
      } else if (f.art === "satz") {
        if (!SAETZE.includes(v)) m.push(`Prozentsatz ${v} nicht aus der Liste`);
        if (imBand(v, genau)) rundung++;
      } else {
        const w = ueberschlagMitFehler(a.typ, zahlenDer(d), f);
        if (w === null || Math.abs(w - v) > 1e-9 * Math.abs(v)) m.push(`Antwort ${a.optionen[i]} folgt nicht aus „${f.art}“ bei Zahl ${f.i + 1} (nachgerechnet ${w})`);
        if (!imBand(v, genau)) m.push(`Antwort ${a.optionen[i]} liegt nicht 10–30 % neben ${genau}`);
        rundung++;
      }
    });
    if (rundung < (a.typ === "prozent" ? 2 : 1)) m.push(`zu wenige Ablenker 10–30 % daneben (${rundung}): ${a.text} ${a.optionen.join(" | ")}`);
    if (a.typ === "summe" || a.typ === "differenz") {
      const e = regelStelle(d.zahlen), soll = summeMit(a.typ, d.zahlen.map(v => aufStelle(v, e)));
      if (soll !== R) m.push(`Überschlag nach der Regel ${soll}, richtig steht ${R}`);
    }
    if (abst(R) > Math.log(1.6)) m.push(`Überschlag ${a.loesung} weicht zu stark ab (genau ${genau})`);
  } else {
    // ordnen: Werte aus dem angezeigten Text exakt lesen
    const br = KERN.bruch;
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
