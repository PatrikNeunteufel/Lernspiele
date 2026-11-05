/* Übung „Brüche rechnen“ — MA.1.A.3, Stufen f, g, i; dazu MA.1.A.1.h (umschreiben). Aufgaben als Daten, ohne DOM.
   Geprüft an der Aufnahmeprüfung Gymnasium: MA.1.A.3 g, h, i (PA, h und i ohne Erweiterung).
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md:
   MA.1.A.3.f  (GA Z2) Brüche (Nenner bis 100) kürzen, erweitern, addieren, subtrahieren (am Rechteckmodell)
   MA.1.A.3.g  Brüche multiplizieren (am Rechteckmodell); wie oft ein Stammbruch in einer ganzen Zahl steckt
   MA.1.A.3.i  (OP) Grundoperationen mit rationalen Zahlen (ohne die Erweiterung mit Variablen)
   MA.1.A.1.h  Brüche, Dezimal- und Prozentzahlen ineinander umschreiben
   Antwort ist ein vollständig gekürzter Bruch oder eine ganze Zahl (art: "term", form: "bruch"). Annahmen, mit Patrik
   abzustimmen: Brüche als „3/4“ geschrieben, unechte Brüche erlaubt (keine gemischten Zahlen); das Rechteckmodell
   als Bild folgt. */
"use strict";

const UEBUNG = {
  id: "brueche",
  einleitung: "Gib das Ergebnis als vollständig gekürzten Bruch ein, zum Beispiel 3/4.",
  stufen: {
    f: "Kürzen, erweitern, addieren und subtrahieren; Dezimalzahl und Prozent als Bruch",
    g: "Brüche multiplizieren, mit ganzen Zahlen und Stammbrüchen",
    i: "Alle Grundoperationen, auch dividieren und mit negativen Brüchen",
    challenge: "Mehrere Rechenschritte mit Klammern",
  },
};

const M = "−", MAL = " · ";
const B = LST_BRUCH;
const z = (a, b) => LST.zufall(a, b);
const NENNER = [2, 3, 4, 5, 6, 8, 10, 12, 20, 25, 50, 100];
// Zahlen mit Apostroph ab vier Stellen (Z1 a); terme.js liest den Apostroph beim Einlesen wieder heraus
const zt = x => LST.zahlText(Number(x));
const bt = b => (b.n === 1n ? `${b.z < 0n ? M : ""}${zt(b.z < 0n ? -b.z : b.z)}` : `${b.z < 0n ? M : ""}${zt(b.z < 0n ? -b.z : b.z)}/${zt(b.n)}`);
const kl = b => (b.z < 0n ? `(${bt(b)})` : bt(b));
const echt = n => B.bruch(BigInt(z(1, n - 1)), BigInt(n));

function fertig(stufe, typ, text, wert, weg, extra) {
  const loes = bt(wert);
  return Object.assign({ art: "term", stufe, typ, text, antwortTerm: loes.replace(M, "-"), form: "bruch", loesung: loes, tasten: ["/", "(", ")"],
    weg: weg ? `${weg} = ${loes}` : loes, kennung: text }, extra || {});
}

// ---------- f ----------
function stufeF() {
  const typ = LST.waehle(["kuerzen", "erweitern", "plus", "minus", "umschreiben"]);
  if (typ === "kuerzen") {
    const b = echt(LST.waehle(NENNER)), f = z(2, 9);
    if (b.n * BigInt(f) > 100n) return stufeF();
    const t = `${b.z * BigInt(f)}/${b.n * BigInt(f)}`;
    return fertig("f", typ, `Kürze vollständig: ${t}`, b, `${t} = ${b.z * BigInt(f)} : ${f} / ${b.n * BigInt(f)} : ${f}`, { aufgabeTerm: t });
  }
  if (typ === "erweitern") {
    const b = echt(LST.waehle([2, 3, 4, 5, 10])), f = z(2, 10), ziel = b.n * BigInt(f);
    return { art: "zahl", stufe: "f", typ, text: `${bt(b)} = □/${ziel}. Zähler =`, antwort: Number(b.z) * f, loesung: String(Number(b.z) * f),
      weg: `mit ${f} erweitern: ${b.z} · ${f} = ${Number(b.z) * f}`, kennung: `${bt(b)} ${ziel}`, daten: { z: Number(b.z), n: Number(b.n), ziel: Number(ziel) } };
  }
  if (typ === "umschreiben") {
    const n = LST.waehle([2, 4, 5, 10, 20, 25, 50, 100]), zz = z(1, n - 1), b = B.bruch(BigInt(zz), BigInt(n));
    if (LST.zufall(0, 1)) return fertig("f", typ, `Schreibe als Bruch: ${LST.dezimalText(zz / n)}`, b, `${LST.dezimalText(zz / n)} = ${Math.round(zz / n * 100)}/100`, { aufgabeTerm: String(zz / n) });
    if (!Number.isInteger(zz / n * 100)) return stufeF();
    return fertig("f", typ, `Schreibe als Bruch: ${zz / n * 100} %`, b, `${zz / n * 100} % = ${zz / n * 100}/100`, { aufgabeTerm: `${zz / n * 100}/100` });
  }
  const n1 = LST.waehle([2, 3, 4, 5, 6, 8, 10]), n2 = LST.waehle([2, 3, 4, 5, 6, 8, 10, 12]);
  const a = echt(n1), b = echt(n2);
  let w = typ === "plus" ? B.plus(a, b) : B.minus(a, b);
  if (w.z <= 0n) return stufeF(); // f: positive Ergebnisse
  return fertig("f", typ, `${bt(a)} ${typ === "plus" ? "+" : M} ${bt(b)} =`, w, `gleichnamig machen`, { aufgabeTerm: `${bt(a)} ${typ === "plus" ? "+" : "-"} ${bt(b)}` });
}

// ---------- g ----------
function stufeG() {
  const typ = LST.waehle(["mal", "mal", "ganz-mal", "stammbruch"]);
  if (typ === "mal") {
    const a = echt(LST.waehle([2, 3, 4, 5, 6, 8, 10])), b = echt(LST.waehle([2, 3, 4, 5, 6, 8, 10]));
    return fertig("g", typ, `${bt(a)}${MAL}${bt(b)} =`, B.mal(a, b), `Zähler mal Zähler, Nenner mal Nenner`, { aufgabeTerm: `${bt(a)} * ${bt(b)}` });
  }
  if (typ === "ganz-mal") {
    const g = z(2, 12), b = echt(LST.waehle([2, 3, 4, 5, 6, 8, 10, 12]));
    return fertig("g", typ, `${g}${MAL}${bt(b)} =`, B.mal(B.bruch(BigInt(g)), b), `${g} · ${b.z} = ${g * Number(b.z)}, Nenner ${b.n}`, { aufgabeTerm: `${g} * ${bt(b)}` });
  }
  const g = z(1, 12), n = z(2, 10);
  return fertig("g", typ, `${g} : 1/${n} =`, B.bruch(BigInt(g * n)), `1/${n} passt ${n}-mal in 1, also ${g} · ${n}`, { aufgabeTerm: `${g} * ${n}` });
}

// ---------- i ----------
function zufallsBruch(neg) {
  const b = echt(LST.waehle([2, 3, 4, 5, 6, 8, 9, 10, 12]));
  return neg && LST.zufall(0, 1) ? B.neg(b) : b;
}
function stufeI() {
  const typ = LST.waehle(["geteilt", "plus-minus-negativ", "mal-negativ"]);
  const a = zufallsBruch(typ !== "geteilt"), b = zufallsBruch(typ !== "geteilt");
  if (typ === "geteilt") return fertig("i", typ, `${bt(a)} : ${bt(b)} =`, B.durch(a, b), `${bt(a)} · ${b.n}/${b.z} (Kehrwert)`, { aufgabeTerm: `${bt(a)} * ${b.n}/${b.z}` });
  if (typ === "mal-negativ") return fertig("i", typ, `${bt(a)}${MAL}${kl(b)} =`, B.mal(a, b), `Vorzeichen, dann Zähler mal Zähler, Nenner mal Nenner`, { aufgabeTerm: `${bt(a).replace(M, "-")} * (${bt(b).replace(M, "-")})` });
  const op = LST.waehle(["+", M]);
  return fertig("i", typ, `${bt(a)} ${op} ${kl(b)} =`, op === "+" ? B.plus(a, b) : B.minus(a, b), `gleichnamig machen, Vorzeichen beachten`, { aufgabeTerm: `${bt(a).replace(M, "-")} ${op === "+" ? "+" : "-"} (${bt(b).replace(M, "-")})` });
}

// ---------- Challenge ----------
function challenge() {
  const a = zufallsBruch(true), b = zufallsBruch(false), c = zufallsBruch(true);
  const art = LST.zufall(0, 1);
  const w = art ? B.mal(B.plus(a, b), c) : B.durch(B.minus(a, b), c);
  if (w.z === 0n) return challenge();
  const t = art ? `(${bt(a)} + ${bt(b)})${MAL}${kl(c)} =` : `(${bt(a)} ${M} ${bt(b)}) : ${kl(c)} =`;
  return fertig("challenge", art ? "klammer-mal" : "klammer-geteilt", t, w, `${kl(art ? B.plus(a, b) : B.minus(a, b))}${art ? MAL : " : "}${kl(c)}`,
    { aufgabeTerm: art ? `(${bt(a).replace(M, "-")} + ${bt(b)}) * (${bt(c).replace(M, "-")})` : `(${bt(a).replace(M, "-")} - ${bt(b)}) * ${c.n < 0n ? "" : ""}(${String(c.n)}/${String(c.z).replace("-", "-")})` });
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "f") return stufeF();
  if (stufe === "g") return stufeG();
  if (stufe === "i") return stufeI();
  if (stufe === "challenge") return challenge();
  throw new Error(`brueche: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    kuerzen: "Teile Zähler und Nenner durch den grössten gemeinsamen Teiler.",
    erweitern: "Mit welcher Zahl wurde der Nenner multipliziert? Mit derselben Zahl den Zähler multiplizieren.",
    plus: "Bringe beide Brüche auf denselben Nenner, dann die Zähler addieren.",
    minus: "Bringe beide Brüche auf denselben Nenner, dann die Zähler subtrahieren.",
    umschreiben: "Dezimalzahl oder Prozent als Hundertstel schreiben, dann kürzen.",
    mal: "Zähler mal Zähler, Nenner mal Nenner. Vorher kürzen spart Arbeit.",
    "ganz-mal": "Die ganze Zahl nur mit dem Zähler multiplizieren.",
    stammbruch: "Wie oft passt der Stammbruch in eins? So oft mal die ganze Zahl.",
    geteilt: "Durch einen Bruch teilen heisst: mit dem Kehrwert multiplizieren.",
    "plus-minus-negativ": "Gleichnamig machen. Minus eine negative Zahl ist plus ihre Gegenzahl.",
    "mal-negativ": "Zuerst das Vorzeichen: gleiche Vorzeichen geben plus, verschiedene minus.",
    "klammer-mal": "Zuerst die Klammer ausrechnen, dann multiplizieren.",
    "klammer-geteilt": "Zuerst die Klammer, dann mit dem Kehrwert multiplizieren.",
  };
  return h[a.typ] || "Schritt für Schritt.";
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const T = LST_TERME;
  if (a.art === "zahl") {
    const d = a.daten;
    if (d.z * d.ziel / d.n !== a.antwort) m.push(`Erweitern falsch: ${a.text}`);
    if (d.ziel % d.n !== 0) m.push("Zielnenner kein Vielfaches");
    return m;
  }
  // Aufgabe unabhängig aus dem angezeigten Text lesen (Zeichen übersetzt) und mit der Lösung vergleichen
  let ausText;
  try {
    let t = a.text.replace(/^(Kürze vollständig|Schreibe als Bruch): /, "").replace(/ =$/, "").replace(/·/g, "*").replace(/−/g, "-").replace(/ %$/, "/100");
    // „a : b/c“ → mal Kehrwert (terme.js teilt nur durch Zahlen)
    t = t.replace(/:\s*\(?(-?)(\d+)\/(\d+)\)?/g, (_, s, zz, n) => `* (${s}${n}/${zz})`).replace(/:\s*(\d+)$/, (_, n) => `* 1/${n}`);
    ausText = T.lies(t).poly;
  } catch (e) { return [`Aufgabe nicht lesbar: ${e.message} in „${a.text}“`]; }
  const ziel = T.lies(a.antwortTerm).poly;
  if (!T.gleich(ausText, ziel)) m.push(`Lösung ${a.antwortTerm} passt nicht zu ${a.text}`);
  if (!T.bewerte(a.antwortTerm, a).ok) m.push(`Lösung nicht gekürzt: ${a.antwortTerm}`);
  if (/\d\/\d+/.test(a.text) && [...a.text.matchAll(/\/(\d+)/g)].some(x => Number(x[1]) > 100) && a.stufe === "f") m.push("Nenner über 100 in Stufe f");
  if (a.stufe === "f" && /−\d+\//.test(a.text.replace(/ − /g, " - "))) m.push("negative Brüche in Stufe f");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
