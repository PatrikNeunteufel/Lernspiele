/* Übung „Grössen umwandeln“ — MA.3.A.2, Stufen h, i, j, k (Entscheid UE1 a). Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.3.A.2:
   h  (GA Z2) Geld, Längen, Gewicht/Masse, Zeit, Volumen [l] in benachbarte Einheiten umwandeln, zweifach benannt
   i  (OP) Flächen und Volumen [m³] in benachbarte Einheiten umwandeln
   j  (GA) SI-System; Vorsätze Mega, Kilo, Dezi, Centi, Milli den Zehnerpotenzen zuordnen
   k  mit zusammengesetzten Masszahlen rechnen, Einheiten umrechnen; Geschwindigkeiten (200 m/10 s = 72 km/h)
   Nicht in dieser Übung (eigene Übungen später): Grössen schätzen und messen, relative Vergleiche (Stufe i).
   Annahmen, mit Patrik abzustimmen: Hektare und Are gehören zu den Flächeneinheiten; Geld zweifach benannt
   („4 Fr. 35 Rp.“) nur in Stufe h, wie der Lehrplantext „zweifach benannt schreiben“. */
"use strict";

const UEBUNG = {
  id: "groessen",
  einleitung: "Wandle in die verlangte Einheit um.",
  stufen: {
    h: "Länge, Masse, Zeit, Liter, Geld — benachbarte Einheiten, zweifach benannt",
    i: "Flächen und Volumen in benachbarte Einheiten",
    j: "Vorsätze Mega, Kilo, Dezi, Centi, Milli und Zehnerpotenzen",
    k: "Zusammengesetzte Einheiten: km/h und m/s, g/cm³ und kg/m³",
    challenge: "Gemischte Einheiten addieren, Weg und Zeit bei gegebener Geschwindigkeit",
  },
};

const M = "−";
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
// Zahl mit höchstens `st` Nachkommastellen, ohne Null
const wert = (max, st) => { let x = 0; while (x === 0) x = LST.zufall(1, max * 10 ** st) / 10 ** st; return x; };

// Ketten benachbarter Einheiten: [Einheit, Faktor zur nächstkleineren]
const KETTEN = {
  laenge: [["km", 1000], ["m", 10], ["dm", 10], ["cm", 10], ["mm", null]],
  masse: [["t", 1000], ["kg", 1000], ["g", 1000], ["mg", null]],
  zeit: [["d", 24], ["h", 60], ["min", 60], ["s", null]],
  liter: [["hl", 100], ["l", 10], ["dl", 10], ["cl", 10], ["ml", null]],
  flaeche: [["km²", 100], ["ha", 100], ["a", 100], ["m²", 100], ["dm²", 100], ["cm²", 100], ["mm²", null]],
  volumen: [["m³", 1000], ["dm³", 1000], ["cm³", 1000], ["mm³", null]],
};

function fertig(stufe, typ, text, antwort, einheit, weg) {
  return { art: "zahl", stufe, typ, text, einheit, antwort: rund(antwort), loesung: `${dez(antwort)}${einheit ? " " + einheit : ""}`, weg, kennung: `${text} [${einheit}]` };
}

// Benachbart umwandeln: grosse → kleine Einheit (mal) oder kleine → grosse (geteilt)
function benachbart(stufe, art) {
  const kette = KETTEN[art];
  const i = LST.zufall(0, kette.length - 2);
  const [gross, f] = kette[i], [klein] = kette[i + 1];
  if (art === "zeit") {
    // Zeit: nur Viertel (0.25 h = 15 min, 0.25 d = 6 h), damit das Ergebnis aufgeht
    const viertel = LST.zufall(1, 4 * 30);
    if (LST.zufall(0, 1)) return fertig(stufe, "zeit-runter", `${dez(viertel / 4)} ${gross} =`, viertel / 4 * f, klein, `1 ${gross} = ${f} ${klein}, also ${dez(viertel / 4)} · ${f} = ${dez(viertel / 4 * f)}`);
    const x = viertel * f / 4;
    return fertig(stufe, "zeit-hoch", `${dez(x)} ${klein} =`, x / f, gross, `${f} ${klein} = 1 ${gross}, also ${dez(x)} : ${f} = ${dez(x / f)}`);
  }
  if (LST.zufall(0, 1)) {
    const x = wert(f >= 100 ? 99 : 999, LST.waehle([0, 1, 2]));
    return fertig(stufe, `${art}-runter`, `${dez(x)} ${gross} =`, x * f, klein, `1 ${gross} = ${dez(f)} ${klein}, also ${dez(x)} · ${dez(f)} = ${dez(x * f)}`);
  }
  const x = LST.zufall(1, 99) * LST.waehle([1, 10, f]) + LST.waehle([0, 0, LST.zufall(1, f - 1)]);
  return fertig(stufe, `${art}-hoch`, `${dez(x)} ${klein} =`, x / f, gross, `${dez(f)} ${klein} = 1 ${gross}, also ${dez(x)} : ${dez(f)} = ${dez(x / f)}`);
}

// Zweifach benannt → eine Einheit („3 m 45 cm = … cm“, „2 h 15 min = … min“, „4 Fr. 35 Rp. = … Rp.“)
function zweifach() {
  const art = LST.waehle(["laenge", "masse", "zeit", "geld"]);
  if (art === "geld") {
    const fr = LST.zufall(1, 99), rp = LST.zufall(1, 19) * 5;
    return fertig("h", "zweifach", `${fr} Fr. ${rp} Rp. =`, fr * 100 + rp, "Rp.", `${fr} · 100 + ${rp} = ${dez(fr * 100 + rp)}`);
  }
  const paare = { laenge: [["m", "cm", 100], ["km", "m", 1000]], masse: [["kg", "g", 1000], ["t", "kg", 1000]], zeit: [["h", "min", 60], ["min", "s", 60]] }[art];
  const [g, k, f] = LST.waehle(paare);
  const a = LST.zufall(1, 20), b = LST.zufall(1, f - 1);
  return fertig("h", "zweifach", `${a} ${g} ${b} ${k} =`, a * f + b, k, `${a} · ${dez(f)} + ${b} = ${dez(a * f + b)}`);
}

// ---------- Stufe j: Vorsätze ----------
const VORSATZ = { M: ["Mega", 6], k: ["Kilo", 3], d: ["Dezi", -1], c: ["Centi", -2], m: ["Milli", -3] };
const VORSATZ_EINHEITEN = { m: ["k", "d", "c", "m"], g: ["k", "m"], l: ["d", "c", "m"], W: ["M", "k"], J: ["M", "k"], Hz: ["M", "k"] };
function stufeJ() {
  if (LST.zufall(0, 3) === 0) {
    const v = LST.waehle(Object.keys(VORSATZ));
    return fertig("j", "vorsatz", `${VORSATZ[v][0]} (${v}) steht für 10 hoch`, VORSATZ[v][1], "", `${VORSATZ[v][0]} = 10 hoch ${dez(VORSATZ[v][1])}`);
  }
  const e = LST.waehle(Object.keys(VORSATZ_EINHEITEN));
  const moegl = ["", ...VORSATZ_EINHEITEN[e]];
  let a, b;
  do { a = LST.waehle(moegl); b = LST.waehle(moegl); } while (a === b);
  const pa = a ? VORSATZ[a][1] : 0, pb = b ? VORSATZ[b][1] : 0;
  const x = wert(99, LST.waehle([0, 1, 2]));
  const erg = x * 10 ** (pa - pb);
  if (erg > 1e7 || !(Math.abs(rund(erg * 1e4) - Math.round(erg * 1e4)) < 1e-9)) return stufeJ();
  return fertig("j", "vorsatz-umrechnen", `${dez(x)} ${a}${e} =`, erg, `${b}${e}`, `1 ${a}${e} = 10 hoch ${dez(pa - pb)} ${b}${e}, also ${dez(x)} ${a}${e} = ${dez(erg)} ${b}${e}`);
}

// ---------- Stufe k: zusammengesetzte Einheiten ----------
function stufeK() {
  const typ = LST.waehle(["ms-kmh", "kmh-ms", "weg-zeit", "dichte"]);
  if (typ === "ms-kmh") { const v = LST.zufall(1, 60) / LST.waehle([1, 2]); return fertig("k", typ, `${dez(v)} m/s =`, v * 3.6, "km/h", `1 m/s = 3.6 km/h, also ${dez(v)} · 3.6 = ${dez(v * 3.6)}`); }
  if (typ === "kmh-ms") { const v = LST.zufall(1, 15) * 18; return fertig("k", typ, `${dez(v)} km/h =`, v / 3.6, "m/s", `${dez(v)} : 3.6 = ${dez(v / 3.6)}`); }
  if (typ === "weg-zeit") {
    const s = LST.zufall(1, 40) * LST.waehle([10, 25, 50]), t = LST.waehle([5, 10, 20, 25, 40, 50]);
    const v = s / t * 3.6;
    if (!(Math.abs(rund(v * 100) - Math.round(v * 100)) < 1e-9)) return stufeK();
    return fertig("k", typ, `${dez(s)} m in ${t} s. Geschwindigkeit =`, v, "km/h", `${dez(s)} : ${t} = ${dez(s / t)} m/s, ${dez(s / t)} · 3.6 = ${dez(v)}`);
  }
  const rho = LST.zufall(1, 200) / 10 / LST.waehle([1, 10]);
  if (LST.zufall(0, 1)) return fertig("k", typ, `${dez(rho)} g/cm³ =`, rho * 1000, "kg/m³", `1 g/cm³ = 1'000 kg/m³, also ${dez(rho)} · 1'000 = ${dez(rho * 1000)}`);
  return fertig("k", typ, `${dez(rho * 1000)} kg/m³ =`, rho, "g/cm³", `${dez(rho * 1000)} : 1'000 = ${dez(rho)}`);
}

// ---------- Challenge ----------
function challenge() {
  const typ = LST.waehle(["flaeche-summe", "zeit-summe", "volumen-liter", "weg-in-zeit"]);
  if (typ === "flaeche-summe") {
    const ha = wert(9, 1), m2 = LST.zufall(1, 99) * 100;
    const a = ha * 100 + m2 / 100;
    return fertig("challenge", typ, `${dez(ha)} ha + ${dez(m2)} m² =`, a, "a", `${dez(ha)} ha = ${dez(ha * 100)} a, ${dez(m2)} m² = ${dez(m2 / 100)} a, zusammen ${dez(a)}`);
  }
  if (typ === "zeit-summe") {
    const h1 = LST.zufall(1, 5), m1 = LST.zufall(1, 59), h2 = LST.zufall(1, 5), m2 = LST.zufall(1, 59);
    const min = (h1 + h2) * 60 + m1 + m2;
    return fertig("challenge", typ, `${h1} h ${m1} min + ${h2} h ${m2} min =`, min, "min", `${h1 + h2} h = ${(h1 + h2) * 60} min, ${(h1 + h2) * 60} + ${m1} + ${m2} = ${dez(min)}`);
  }
  if (typ === "volumen-liter") {
    const m3 = wert(9, 2), l = LST.zufall(1, 9) * LST.waehle([10, 50, 100]);
    const dm3 = m3 * 1000 - l;
    if (dm3 <= 0) return challenge();
    return fertig("challenge", typ, `${dez(m3)} m³ ${M} ${dez(l)} l =`, dm3, "dm³", `${dez(m3)} m³ = ${dez(m3 * 1000)} dm³, 1 l = 1 dm³, ${dez(m3 * 1000)} ${M} ${dez(l)} = ${dez(dm3)}`);
  }
  const v = LST.zufall(2, 24) * 15, min = LST.zufall(1, 20);
  const m = v * 1000 / 60 * min;
  if (!Number.isInteger(rund(m))) return challenge();
  return fertig("challenge", typ, `Mit ${dez(v)} km/h unterwegs. Weg in ${min} min =`, m, "m", `${dez(v)} km/h = ${dez(v * 1000 / 60)} m pro min, · ${min} = ${dez(m)}`);
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "h") return LST.zufall(0, 2) ? benachbart("h", LST.waehle(["laenge", "masse", "zeit", "liter"])) : zweifach();
  if (stufe === "i") return benachbart("i", LST.waehle(["flaeche", "volumen"]));
  if (stufe === "j") return stufeJ();
  if (stufe === "k") return stufeK();
  if (stufe === "challenge") return challenge();
  throw new Error(`groessen: keine Stufe ${stufe}`);
}

/** Hinweis zu einer falschen Eingabe — nennt die Lösung nie. */
function hinweis(a, eingabe) {
  if (eingabe !== null && a.antwort !== 0 && [10, 100, 1000, 0.1, 0.01, 0.001].some(f => Math.abs(rund(eingabe * f) - a.antwort) < 1e-9)) return "Die Ziffern stimmen, der Faktor nicht. Wie viele kleine Einheiten sind eine grosse?";
  const t = a.typ;
  if (t.startsWith("flaeche")) return "Bei Flächen ist der Faktor zwischen benachbarten Einheiten 100 (10 · 10).";
  if (t.startsWith("volumen")) return "Bei Volumen ist der Faktor zwischen benachbarten Einheiten 1'000 (10 · 10 · 10).";
  if (t.startsWith("zeit")) return "Zeit rechnet mit 60 (h, min, s) und 24 (Tag), nicht mit 10.";
  if (t.endsWith("-hoch")) return "In die grössere Einheit: Es werden weniger, also teilen.";
  if (t.endsWith("-runter")) return "In die kleinere Einheit: Es werden mehr, also malnehmen.";
  if (t === "zweifach") return "Wandle zuerst die grössere Einheit um, dann zähle die kleinere dazu.";
  if (t.startsWith("vorsatz")) return "Kilo = 10³, Mega = 10⁶, Dezi = 10⁻¹, Centi = 10⁻², Milli = 10⁻³. Vergleiche die beiden Vorsätze.";
  if (t === "ms-kmh" || t === "kmh-ms" || t === "weg-zeit" || t === "weg-in-zeit") return "Eine Stunde hat 3'600 Sekunden, ein Kilometer hat tausend Meter. Rechne Weg und Zeit einzeln um.";
  if (t === "dichte") return "Rechne Gramm in Kilogramm und Kubikzentimeter in Kubikmeter einzeln um.";
  return "Wandle zuerst alles in dieselbe Einheit um.";
}

// ---------- Prüfung: über Grundeinheiten, eigene Tabelle (unabhängig von KETTEN) ----------
const B = KERN.bruch;
// Faktor jeder Einheit zur Grundeinheit ihrer Grösse
const GRUND = {
  km: ["L", "1000"], m: ["L", "1"], dm: ["L", "0.1"], cm: ["L", "0.01"], mm: ["L", "0.001"],
  t: ["G", "1000000"], kg: ["G", "1000"], g: ["G", "1"], mg: ["G", "0.001"],
  d: ["Z", "86400"], h: ["Z", "3600"], min: ["Z", "60"], s: ["Z", "1"],
  hl: ["V", "100"], l: ["V", "1"], dl: ["V", "0.1"], cl: ["V", "0.01"], ml: ["V", "0.001"],
  "m³": ["V", "1000"], "dm³": ["V", "1"], "cm³": ["V", "0.001"], "mm³": ["V", "0.000001"],
  "km²": ["F", "1000000"], ha: ["F", "10000"], a: ["F", "100"], "m²": ["F", "1"], "dm²": ["F", "0.01"], "cm²": ["F", "0.0001"], "mm²": ["F", "0.000001"],
  "Fr.": ["Geld", "100"], "Rp.": ["Geld", "1"],
  W: ["P", "1"], kW: ["P", "1000"], MW: ["P", "1000000"], J: ["E", "1"], kJ: ["E", "1000"], MJ: ["E", "1000000"],
  Hz: ["H", "1"], kHz: ["H", "1000"], MHz: ["H", "1000000"],
  "m/s": ["v", "1"], "km/h": ["v", "0.2777777777777777777777"], "g/cm³": ["rho", "1000"], "kg/m³": ["rho", "1"],
};
const faktor = e => { if (e === "km/h") return B.bruch(1000n, 3600n); const g = GRUND[e]; if (!g) throw new Error(`Einheit ${e}`); return B.zahl(g[1]); };
const groesse = e => (GRUND[e] || [null])[0];
const zahlTeil = t => { const neg = t.startsWith(M); const b = B.zahl(neg ? t.slice(1) : t); return neg ? B.neg(b) : b; };

/** Liest „3.5 km + 4'500 m² …“ als Summe von Grössen (in Grundeinheiten). */
function leseGroessen(text) {
  const re = /(− )?(\d+(?:'\d{3})*(?:\.\d+)?) ([A-Za-z²³/.]+)/g;
  let sum = B.bruch(0n), art = null, n = 0, m;
  while ((m = re.exec(text))) {
    const e = m[3];
    if (!GRUND[e] && e !== "km/h") throw new Error(`Einheit ${e}`);
    const g = groesse(e);
    if (art && g !== art) throw new Error(`gemischte Grössen ${art}/${g}`);
    art = g;
    const w = B.mal(B.zahl(m[2]), faktor(e));
    sum = m[1] ? B.minus(sum, w) : B.plus(sum, w);
    n++;
  }
  return { sum, art, n };
}

function pruefeAufgabe(a, stufe, niveau) {
  const maengel = [];
  if (a.stufe !== stufe) maengel.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  if (/\d{4}/.test(a.text.replace(/\.\d+/g, ""))) maengel.push(`Tausender ohne Apostroph: ${a.text}`);
  if ((a.loesung.split(" ")[0].split(".")[1] || "").length > 4) maengel.push(`mehr als 4 Nachkommastellen: ${a.loesung}`);
  let soll;
  try {
    if (a.typ === "vorsatz") {
      const v = a.text.match(/\((\w)\)/)[1];
      soll = B.bruch(BigInt({ M: 6, k: 3, d: -1, c: -2, m: -3 }[v]));
    } else if (a.typ === "weg-zeit") {
      const m = a.text.match(/^(\S+) m in (\d+) s/);
      soll = B.mal(B.durch(B.zahl(m[1]), B.zahl(m[2])), B.bruch(3600n, 1000n));
    } else if (a.typ === "weg-in-zeit") {
      const m = a.text.match(/Mit (\S+) km\/h .* in (\d+) min/);
      soll = B.durch(B.mal(B.mal(B.zahl(m[1]), B.bruch(1000n)), B.zahl(m[2])), B.bruch(60n));
    } else {
      const links = a.text.replace(/ =$/, "");
      const g = leseGroessen(links);
      if (!g.n) throw new Error("keine Grösse gefunden");
      if (groesse(a.einheit) !== g.art) throw new Error(`Zieleinheit ${a.einheit} passt nicht zu ${g.art}`);
      soll = B.durch(g.sum, faktor(a.einheit));
      if (["h", "i"].includes(a.stufe) && a.typ !== "zweifach") {
        // benachbart: Faktor 10, 100, 1000, 60 oder 24 (bzw. 100 bei ha/a/km²)
        const f = B.durch(faktor(links.split(" ").pop()), faktor(a.einheit));
        const fz = f.n === 1n ? f.z : f.n;
        if (![10n, 24n, 60n, 100n, 1000n].includes(fz)) maengel.push(`nicht benachbart (Faktor ${B.text(f)}): ${a.text} ${a.einheit}`);
      }
      if (a.stufe === "h" && ["F", "rho", "v"].includes(g.art)) maengel.push("Stufe h mit Fläche oder zusammengesetzter Einheit");
      if (a.stufe === "i" && !["F", "V"].includes(g.art)) maengel.push(`Stufe i nicht Fläche/Volumen: ${a.text}`);
      if (a.stufe === "i" && ["l", "dl", "cl", "ml", "hl"].includes(a.einheit)) maengel.push("Stufe i mit Liter statt m³-Kette");
    }
  } catch (e) { return maengel.concat(`nicht auswertbar: ${e.message} in „${a.text}“`); }
  if (!B.gleich(soll, B.vonZahl(a.antwort))) maengel.push(`Lösung ${a.antwort}, nachgerechnet ${B.text(soll)}: ${a.text} ${a.einheit}`);
  if (!B.endlich(soll)) maengel.push(`Ergebnis keine endliche Dezimalzahl: ${a.text}`);
  if (a.antwort <= 0 && a.typ !== "vorsatz") maengel.push(`Ergebnis nicht positiv: ${a.text}`);
  return maengel;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
