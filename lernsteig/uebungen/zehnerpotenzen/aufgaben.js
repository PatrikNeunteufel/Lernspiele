/* Übung „Grosse Zahlen und Zehnerpotenzen“ — MA.1.A.1, Stufen i, j, k; Challenge mit MA.1.A.3.j. Ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md:
   MA.1.A.1.i  (OP) Begriffe hoch, Potenz, Zehnerpotenz; Zahlen bis 1 Milliarde lesen und schreiben
   MA.1.A.1.j  (GA) wissenschaftliche Schreibweise mit positiven Exponenten (1.32 · 10⁸ = 132 000 000)
   MA.1.A.1.k  wissenschaftliche Schreibweise auch mit negativen Exponenten
   MA.1.A.3.j  Zahlen in wissenschaftlicher Schreibweise multiplizieren und dividieren (Challenge)
   Annahmen, mit Patrik abzustimmen: Zahlwörter in Schweizer Schreibweise („dreissig“), „eine Million“ getrennt,
   Tausender zusammengeschrieben; gefragt wird je Aufgabe genau eine Zahl (Exponent oder Dezimalzahl). */
"use strict";

const UEBUNG = {
  id: "zehnerpotenzen",
  einleitung: "Grosse und kleine Zahlen schreiben und mit Zehnerpotenzen rechnen.",
  stufen: {
    i: "Zahlen bis eine Milliarde lesen und schreiben, Zehnerpotenzen",
    j: "Wissenschaftliche Schreibweise mit positiven Exponenten",
    k: "Wissenschaftliche Schreibweise mit negativen Exponenten",
    challenge: "Multiplizieren und dividieren in wissenschaftlicher Schreibweise",
  },
};

const M = "−", MAL = " · ";
const HOCH = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
const hoch = n => String(n).replace(/[-0-9]/g, c => HOCH[c]);
// Ganze Zahlen exakt, sonst auf 15 gültige Ziffern (ohne Rundungsreste der Fliesskommazahlen)
const dez = x => (Number.isInteger(x) ? LST.zahlText(x) : LST.dezimalText(Number(x.toPrecision(15))));
const stellen = n => `${n} ${n === 1 ? "Stelle" : "Stellen"}`;
const expText = e => (e < 0 ? `(${M}${-e})` : String(e));
const z = (a, b) => LST.zufall(a, b);

// ---------- Zahlwörter ----------
const EINER = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn"];
const ZEHNER = ["", "", "zwanzig", "dreissig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];
function unter100(n) { if (n < 20) return EINER[n]; const e = n % 10, t = Math.floor(n / 10); return (e ? EINER[e] + "und" : "") + ZEHNER[t]; }
function unter1000(n) { const h = Math.floor(n / 100), r = n % 100; return (h ? EINER[h] + "hundert" : "") + unter100(r); }
function unterMio(n) { const t = Math.floor(n / 1000), r = n % 1000; return (t ? unter1000(t) + "tausend" : "") + unter1000(r); }
/** Zahlwort bis 1 Milliarde: „drei Millionen vierhunderttausendzwölf“. */
function zahlWort(n) {
  if (n === 0) return "null";
  if (n === 1e9) return "eine Milliarde";
  const mio = Math.floor(n / 1e6), rest = n % 1e6;
  const teile = [];
  if (mio) teile.push(mio === 1 ? "eine Million" : `${unter1000(mio)} Millionen`);
  if (rest) teile.push(rest === 1 ? "eins" : unterMio(rest).replace(/ein$/, "eins"));
  return teile.join(" ");
}

function fertig(stufe, typ, text, antwort, weg, daten, extra) {
  return Object.assign({ art: "zahl", stufe, typ, text, antwort, loesung: dez(antwort), weg, kennung: text, daten }, extra || {});
}

// Mantisse 1 ≤ m < 10 mit höchstens drei Nachkommastellen
const mantisse = () => { const st = z(0, 3); let m; do { m = z(10 ** st, 10 ** (st + 1) - 1) / 10 ** st; } while (m >= 10); return m; };

// ---------- i ----------
function stufeI() {
  const typ = LST.waehle(["wort-zahl", "wort-zahl", "zahl-stellen", "zehnerpotenz"]);
  if (typ === "wort-zahl") {
    const n = LST.waehle([z(1, 999) * 1e6 + z(0, 999) * 1000 + z(0, 999), z(1, 999) * 1e6 + z(0, 99) * 1000, z(1000, 999999), z(1, 999) * 1e6]);
    return fertig("i", typ, `Schreibe als Zahl: ${zahlWort(n)}`, n, `${zahlWort(n)} = ${dez(n)}`, { n });
  }
  if (typ === "zahl-stellen") {
    const n = z(1, 999) * 1e6 + z(0, 999999);
    const stellen = [["Millionen", 1e6], ["Hunderttausender", 1e5], ["Zehntausender", 1e4], ["Tausender", 1e3]];
    const [name, f] = LST.waehle(stellen);
    const ziffer = Math.floor(n / f) % 10;
    if (name === "Millionen") return fertig("i", typ, `${dez(n)}: Wie viele ganze Millionen sind das?`, Math.floor(n / 1e6), `${dez(n)} = ${Math.floor(n / 1e6)} Millionen und ${dez(n % 1e6)}`, { n, f: 1e6, ganz: true });
    return fertig("i", typ, `${dez(n)}: Welche Ziffer steht bei den ${name}?`, ziffer, `${dez(n)}: ${name} ${ziffer}`, { n, f });
  }
  const e = z(2, 9);
  return fertig("i", typ, `10${hoch(e)} =`, 10 ** e, `10${hoch(e)} = 1 mit ${e} Nullen = ${dez(10 ** e)}`, { e });
}

// ---------- j: positive Exponenten ----------
function stufeJ() {
  const m = mantisse(), e = z(3, 12);
  const n = Math.round(m * 10 ** e);
  if (LST.zufall(0, 1)) return fertig("j", "exponent-positiv", `${dez(n)} = ${dez(m)}${MAL}10 hoch`, e, `Komma um ${stellen(e)} nach links: ${dez(m)}${MAL}10${hoch(e)}`, { m, e, n }, { vor: "", einheit: "" });
  return fertig("j", "ausschreiben-positiv", `${dez(m)}${MAL}10${hoch(e)} =`, n, `Komma um ${stellen(e)} nach rechts: ${dez(n)}`, { m, e, n });
}

// ---------- k: negative Exponenten ----------
function stufeK() {
  const m = mantisse(), e = -z(1, 8);
  const x = Math.round(m * 10 ** (3 - e)) / 10 ** (3 - e) * 10 ** e;
  const n = Number((m * 10 ** e).toFixed(3 - e + 3));
  void x;
  if (LST.zufall(0, 1)) return fertig("k", "exponent-negativ", `${dez(n)} = ${dez(m)}${MAL}10 hoch`, e, `Komma um ${stellen(-e)} nach rechts: ${dez(m)}${MAL}10${hoch(e)}`, { m, e, n });
  return fertig("k", "ausschreiben-negativ", `${dez(m)}${MAL}10${hoch(e)} =`, n, `Komma um ${stellen(-e)} nach links: ${dez(n)}`, { m, e, n });
}

// ---------- Challenge: rechnen (MA.1.A.3.j) ----------
function challenge() {
  const typ = LST.waehle(["mal", "geteilt"]);
  for (;;) {
    const a = z(11, 99) / 10, b = z(11, 99) / 10, e1 = z(-6, 9), e2 = z(-6, 9);
    let m, e;
    if (typ === "mal") { m = a * b; e = e1 + e2; } else { m = a / b; e = e1 - e2; }
    // normieren
    while (m >= 10) { m /= 10; e += 1; }
    while (m < 1) { m *= 10; e -= 1; }
    m = Math.round(m * 1e6) / 1e6;
    if (!Number.isInteger(Math.round(m * 1000) / 1000 * 1000) || Math.abs(m * 1000 - Math.round(m * 1000)) > 1e-6) continue; // höchstens drei Nachkommastellen
    const t = `(${dez(a)}${MAL}10${hoch(e1)})${typ === "mal" ? MAL : " : "}(${dez(b)}${MAL}10${hoch(e2)}) = ${dez(m)}${MAL}10 hoch`;
    return fertig("challenge", typ, t, e, `${dez(a)}${typ === "mal" ? MAL : " : "}${dez(b)} = ${dez(typ === "mal" ? a * b : a / b)}; Exponenten ${typ === "mal" ? `${expText(e1)} + ${expText(e2)}` : `${expText(e1)} ${M} ${expText(e2)}`}; normiert ${dez(m)}${MAL}10${hoch(e)}`, { a, b, e1, e2, m });
  }
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "i") return stufeI();
  if (stufe === "j") return stufeJ();
  if (stufe === "k") return stufeK();
  if (stufe === "challenge") return challenge();
  throw new Error(`zehnerpotenzen: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    "wort-zahl": "Schreibe zuerst die Millionen, dann die Tausender, dann den Rest — jede Gruppe mit drei Ziffern.",
    "zahl-stellen": "Gliedere die Zahl in Dreiergruppen von rechts: Einer, Tausender, Millionen.",
    zehnerpotenz: "Der Exponent sagt, wie viele Nullen hinter der Eins stehen.",
    "exponent-positiv": "Zähle, um wie viele Stellen das Komma nach links wandern muss, bis vor ihm nur eine Ziffer steht.",
    "ausschreiben-positiv": "Ein positiver Exponent schiebt das Komma nach rechts, so viele Stellen wie der Exponent sagt.",
    "exponent-negativ": "Kleine Zahl: Das Komma wandert nach rechts, der Exponent wird negativ.",
    "ausschreiben-negativ": "Ein negativer Exponent schiebt das Komma nach links. Fülle mit Nullen auf.",
    mal: "Mantissen malnehmen, Exponenten addieren, dann so normieren, dass vor dem Komma eine Ziffer steht.",
    geteilt: "Mantissen teilen, Exponenten subtrahieren, dann normieren.",
  };
  return h[a.typ] || "Achte auf die Stellung des Kommas.";
}

// ---------- Prüfung ----------
const WORT = {}; EINER.forEach((w, i) => { if (w) WORT[w] = i; }); WORT.eins = 1; WORT.eine = 1;
ZEHNER.forEach((w, i) => { if (w) WORT[w] = i * 10; });
function liesU100(s) {
  if (!s) return 0;
  if (s in WORT) return WORT[s];
  const m = s.match(/^([a-zäöü]+?)und([a-zäöü]+)$/);
  if (m && m[1] in WORT && m[2] in WORT && WORT[m[1]] < 10 && WORT[m[2]] >= 20) return WORT[m[1]] + WORT[m[2]];
  throw new Error(`Wort „${s}“`);
}
function liesU1000(s) { const i = s.indexOf("hundert"); if (i < 0) return liesU100(s); return (i ? liesU100(s.slice(0, i)) : 1) * 100 + liesU100(s.slice(i + 7)); }
function liesUMio(s) { const i = s.indexOf("tausend"); if (i < 0) return liesU1000(s); return (i ? liesU1000(s.slice(0, i)) : 1) * 1000 + liesU1000(s.slice(i + 7)); }
/** Zahlwort → Zahl, unabhängig von zahlWort. */
function liesWort(t) {
  if (t === "null") return 0;
  if (t === "eine Milliarde") return 1e9;
  const m = t.match(/^(?:(\S+) Million(?:en)?)?\s*(\S*)$/);
  if (!m) throw new Error(`Zahlwort „${t}“`);
  return (m[1] ? liesU1000(m[1] === "eine" ? "eins" : m[1]) * 1e6 : 0) + (m[2] ? liesUMio(m[2]) : 0);
}

/**
 * Den angezeigten Text lesen (Plan B2 Schritt 3, TD1 a), unabhängig vom Erzeuger: Hochzahlen („10⁻⁸“) werden zu „^-8“,
 * dann je Typ der Satz als Muster (LST.zahlenImText); Zahlwörter über liesWort. Der Exponent, nach dem gefragt ist, folgt
 * aus Zahl und Mantisse (und muss eine ganze Zahl sein), die ausgeschriebene Zahl aus Mantisse und Exponent. Liefert die
 * Werte in der Form von a.daten oder null.
 */
const AUS_HOCH = Object.fromEntries(Object.entries(HOCH).map(([k, v]) => [v, k]));
const ohneHoch = t => String(t).replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, s => "^" + [...s].map(c => AUS_HOCH[c]).join(""));
const muster = (text, mu) => LST.zahlenImText(ohneHoch(text), mu);
const STELLE = { Hunderttausender: 1e5, Zehntausender: 1e4, Tausender: 1e3 };
/** Exponent e mit n = m · 10^e, oder null, wenn es keinen ganzen gibt. */
function exponentAus(n, m) {
  const e = Math.round(Math.log10(n / m));
  return Math.abs(m * 10 ** e - n) <= 1e-9 * Math.abs(n) ? e : null;
}
const LESER = {
  "wort-zahl": a => { const w = a.text.startsWith("Schreibe als Zahl: ") && a.text.slice(19); return w ? { n: liesWort(w) } : null; },
  "zahl-stellen": a => {
    const g = muster(a.text, "#: Wie viele ganze Millionen sind das?");
    if (g) return { n: g[0], f: 1e6, ganz: true };
    const name = (a.text.match(/: Welche Ziffer steht bei den (\S+)\?$/) || [])[1];
    const z = name && STELLE[name] && muster(a.text, `#: Welche Ziffer steht bei den ${name}?`);
    return z ? { n: z[0], f: STELLE[name] } : null;
  },
  zehnerpotenz: a => { const z = muster(a.text, "10^# ="); return z && { e: z[0] }; },
  "exponent-positiv": a => { const z = muster(a.text, "# = # · 10 hoch"), e = z && exponentAus(z[0], z[1]); return e === null || !z ? null : { m: z[1], e, n: z[0] }; },
  "exponent-negativ": a => LESER["exponent-positiv"](a),
  "ausschreiben-positiv": a => { const z = muster(a.text, "# · 10^# ="); return z && { m: z[0], e: z[1], n: Number((z[0] * 10 ** z[1]).toPrecision(15)) }; },
  "ausschreiben-negativ": a => LESER["ausschreiben-positiv"](a),
  mal: a => { const z = muster(a.text, "(# · 10^#) · (# · 10^#) = # · 10 hoch"); return z && { a: z[0], b: z[2], e1: z[1], e2: z[3], m: z[4] }; },
  geteilt: a => { const z = muster(a.text, "(# · 10^#) : (# · 10^#) = # · 10 hoch"); return z && { a: z[0], b: z[2], e1: z[1], e2: z[3], m: z[4] }; },
};
function liesText(a) {
  const l = LESER[a.typ];
  try { return (l && l(a)) || null; } catch (e) { return null; }
}
/** Gleiche Werte, Zahlen relativ auf Rundungsreste genau (die Zahlen reichen bis 10¹²). */
const gleichWert = (x, y) => (typeof x === "number" && typeof y === "number" ? Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(y)) : x === y);

function pruefeAufgabe(a, stufe, niveau) {
  const mg = [];
  if (a.stufe !== stufe) mg.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  mg.push(...pruefeMit(a, a.daten));
  // Text gegen Prüfdaten (TD1 a): was der Jugendliche liest, sind dieselben Werte, und mit ihnen hält dieselbe Prüfung
  const t = liesText(a);
  if (!t) mg.push(`Text folgt keinem Muster des Typs ${a.typ}: ${a.text}`);
  else {
    const anders = Object.keys(a.daten).filter(k => !gleichWert(t[k], a.daten[k]));
    if (anders.length) mg.push(`Text zeigt ${anders.map(k => `${k} = ${t[k]}`).join(", ")}, Prüfdaten ${anders.map(k => `${k} = ${a.daten[k]}`).join(", ")}: ${a.text}`);
    mg.push(...pruefeMit(a, t).map(x => `aus dem Text: ${x}`));
  }
  if (/\d{4}/.test(a.text.replace(/\.\d+/g, ""))) mg.push(`Tausender ohne Apostroph: ${a.text}`);
  return mg;
}

/** Prüfung der Lösung aus Werten in der Form von a.daten (aus den Daten oder aus dem Text). */
function pruefeMit(a, d) {
  const mg = [];
  try {
    if (a.typ === "wort-zahl") {
      const w = a.text.replace("Schreibe als Zahl: ", "");
      if (liesWort(w) !== a.antwort) mg.push(`Zahlwort „${w}“ gelesen als ${liesWort(w)}, Lösung ${a.antwort}`);
      if (d.n !== a.antwort) mg.push(`Zahl ${d.n}, Lösung ${a.antwort}`);
      if (/ß/.test(w)) mg.push("ß im Zahlwort");
      if (a.antwort > 1e9) mg.push("über einer Milliarde");
    } else if (a.typ === "zahl-stellen") {
      const soll = d.ganz ? Math.floor(d.n / 1e6) : Math.floor(d.n / d.f) % 10;
      if (soll !== a.antwort) mg.push(`Stelle falsch: ${a.text}`);
    } else if (a.typ === "zehnerpotenz") {
      if (a.antwort !== 10 ** d.e) mg.push("Zehnerpotenz falsch");
    } else if (/exponent|ausschreiben/.test(a.typ)) {
      // n = m · 10^e, exakt über Ziffernfolgen
      const B = KERN.bruch;
      const n = B.vonZahl(d.n), m = B.vonZahl(d.m);
      const p = d.e >= 0 ? B.bruch(10n ** BigInt(d.e)) : B.bruch(1n, 10n ** BigInt(-d.e));
      if (!B.gleich(n, B.mal(m, p))) mg.push(`${dez(d.n)} ≠ ${dez(d.m)} · 10^${d.e}`);
      if (!(d.m >= 1 && d.m < 10)) mg.push(`Mantisse nicht zwischen 1 und 10: ${d.m}`);
      if (a.typ.startsWith("exponent") ? a.antwort !== d.e : Math.abs(a.antwort - d.n) > 1e-15 * Math.max(1, d.n)) mg.push(`Lösung passt nicht: ${a.text}`);
      if (a.stufe === "j" && d.e < 0) mg.push("Stufe j mit negativem Exponenten");
      if (a.stufe === "k" && d.e >= 0) mg.push("Stufe k ohne negativen Exponenten");
    } else if (a.typ === "mal" || a.typ === "geteilt") {
      const B = KERN.bruch;
      const p = e => (e >= 0 ? B.bruch(10n ** BigInt(e)) : B.bruch(1n, 10n ** BigInt(-e)));
      const x = B.mal(B.vonZahl(d.a), p(d.e1)), y = B.mal(B.vonZahl(d.b), p(d.e2));
      const w = a.typ === "mal" ? B.mal(x, y) : B.durch(x, y);
      if (!B.gleich(w, B.mal(B.vonZahl(d.m), p(a.antwort)))) mg.push(`Ergebnis falsch: ${a.text} ${a.antwort}`);
      if (!(d.m >= 1 && d.m < 10)) mg.push("Ergebnis nicht normiert");
    } else mg.push(`unbekannter Typ ${a.typ}`);
  } catch (e) { mg.push(`nicht prüfbar: ${e.message}`); }
  return mg;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis, zahlWort, liesWort, liesText };
