/* Übung „Brüche rechnen“ — MA.1.A.3, Stufen f, g, i; dazu MA.1.A.1.h (umschreiben). Aufgaben als Daten, ohne DOM.
   Inhalte am Wortlaut (docs/lernsteig/abdeckung.md, Plan E 1):
   MA.1.A.3.f  (GA Z2) Dezimalzahlen bis 5 Wertziffern addieren und subtrahieren (30.8 + 5.6); Brüche mit den Nennern
               2, 3, 4, 5, 6, 8, 10, 20, 50, 100 am Rechteckmodell kürzen, erweitern, addieren und subtrahieren;
               Grundoperationen mit dem Rechner (Typ rechner, die einzige Aufgabe der Stufe mit Rechner, E1-4 a)
   MA.1.A.3.g  Brüche mit denselben Nennern am Rechteckmodell multiplizieren; wie oft ein Stammbruch in einer ganzen
               Zahl enthalten ist (2 : ⅕)
   MA.1.A.3.i  (OP) Grundoperationen mit rationalen Zahlen; Erweiterung: Grundoperationen mit gewöhnlichen Brüchen mit
               Variablen ausführen (2a/3 + a/4) und mit Zahlen belegen (a/b + c/d mit a = 2, b = 3, …), ein Viertel der
               Aufgaben der Stufe, für alle Niveaus (E1-3 a, E1-5 a); Variablen nur im Zähler (der Term-Leser teilt nur
               durch Zahlen, kern 1.29.0)
   MA.1.A.1.h  Brüche (Nenner der Liste und 1'000), Dezimalzahlen und Prozentzahlen je in die beiden anderen
               Schreibweisen übertragen — alle sechs Richtungen; 3 und 6 erst mit periodischen Dezimalzahlen (RZ1 a)
   Antwort: ein vollständig gekürzter Bruch oder eine ganze Zahl (art: "term", form: "bruch"), beim Erweitern der Zähler,
   bei Dezimal- und Prozentzahlen eine Zahl (art: "zahl"). Jede Bruch-Aufgabe in f und g zeigt ihr Rechteckmodell
   (darstellung "rechteck", E1-6 a, Plan E 1 Schritt 8). Annahmen, mit Patrik abzustimmen: Brüche als „3/4“
   geschrieben, unechte Brüche erlaubt (keine gemischten Zahlen); „Dezimalzahlen bis 5 Wertziffern“ wie RZ2 a (beide
   Zahlen zusammen); beim Addieren und Subtrahieren der gemeinsame Nenner höchstens 100, beim Multiplizieren das
   Produkt der Nenner höchstens 100 (am Rechteckmodell darstellbar). */
"use strict";

const UEBUNG = {
  id: "brueche",
  einleitung: "Gib Brüche vollständig gekürzt ein, zum Beispiel 3/4.",
  stufen: {
    f: "Kürzen, erweitern, addieren und subtrahieren; Dezimalzahlen addieren; Bruch, Dezimalzahl und Prozent umschreiben",
    g: "Brüche multiplizieren, mit ganzen Zahlen und Stammbrüchen",
    i: "Alle Grundoperationen, auch dividieren und mit negativen Brüchen; Brüche mit Variablen",
    challenge: "Mehrere Rechenschritte mit Klammern",
  },
};

const M = "−", MAL = " · ";
const B = KERN.bruch;
const z = (a, b) => LST.zufall(a, b);
// Nenner nach dem Wortlaut von MA.1.A.3 f und g; beim Umschreiben (MA.1.A.1.h) dazu 1'000, ohne 3 und 6 (RZ1 a).
// Bis LERN_Session23 dazu 12 und 25 (aus einer Zusammenfassung „Nenner bis 100“).
const NENNER = [2, 3, 4, 5, 6, 8, 10, 20, 50, 100];
const NENNER_UMSCHREIBEN = [2, 4, 5, 8, 10, 20, 50, 100, 1000];
const NENNER_MAX = 100; // gemeinsamer Nenner (plus, minus) und Produkt der Nenner (mal), Annahme oben
const ggt = (a, b) => (b ? ggt(b, a % b) : a);
const kgv = (a, b) => a / ggt(a, b) * b;
/** Paare (Nenner, Faktor), deren erweiterter Nenner wieder in der Liste steht: 1/2 → 50/100, 3/4 → 15/20. */
const ERWEITERBAR = NENNER.flatMap(n => NENNER.filter(m => m > n && m % n === 0).map(m => [n, m / n]));
/** Echter Bruch mit Nenner n, schon gekürzt (Zähler teilerfremd zu n). */
function teilerfremd(n) { let zz; do zz = z(1, n - 1); while (ggt(zz, n) !== 1); return B.bruch(BigInt(zz), BigInt(n)); }
/**
 * Rechteckmodell (E1-6 a): Raster mit höchstens 100 Feldern. Ein Bruch z/n mit n·f Feldern (n, f bis 10) als n Spalten
 * zu f Feldern, z Spalten gefärbt — so steht das Kürzen und Erweitern im Bild; sonst ein fast quadratisches Raster mit
 * den ersten Feldern gefärbt (spaltenweise).
 */
const raster = K => { let r = Math.floor(Math.sqrt(K)); while (K % r) r--; return [K / r, r]; }; // [spalten, zeilen]
const felderModell = (K, anzahl, farbe) => { const [spalten, zeilen] = raster(K); return { spalten, zeilen, faerben: [{ art: "felder", anzahl, farbe }] }; };
const bandModell = (n, f, zz, farbe) => (n <= 10 && f <= 10
  ? { spalten: n, zeilen: f, faerben: [{ art: "spalten", anzahl: zz, farbe }] } : felderModell(n * f, zz * f, farbe));
/** plus, minus: beide Brüche im Raster des gemeinsamen Nenners — wenn möglich der erste als Spalten, der zweite als Zeilen. */
function summenModell(a, b, op) {
  const n1 = Number(a.n), n2 = Number(b.n), K = kgv(n1, n2);
  const [m1, m2] = n1 * n2 === K && n1 <= 10 && n2 <= 10
    ? [{ spalten: n1, zeilen: n2, faerben: [{ art: "spalten", anzahl: Number(a.z), farbe: 1 }] },
       { spalten: n1, zeilen: n2, faerben: [{ art: "zeilen", anzahl: Number(b.z), farbe: 2 }] }]
    : [felderModell(K, Number(a.z) * K / n1, 1), felderModell(K, Number(b.z) * K / n2, 2)];
  return { art: "rechteck", teile: [m1, op, m2] };
}
/** mal: Überlappungsmodell — Spalten für den ersten Bruch, Zeilen für den zweiten, das Produkt in beiden Farben. */
const malModell = (a, b) => ({ art: "rechteck", teile: [{ spalten: Number(a.n), zeilen: Number(b.n),
  faerben: [{ art: "spalten", anzahl: Number(a.z), farbe: 1 }, { art: "zeilen", anzahl: Number(b.z), farbe: 2 }] }] });
/** ganze Zahl mal Bruch: so viele Modelle des Bruchs, wie die ganze Zahl sagt, mit „+“ dazwischen (klein). */
const ganzMalModell = (g, b) => ({ art: "rechteck", klein: true,
  teile: Array.from({ length: g }, () => felderModell(Number(b.n), Number(b.z), 1)).flatMap((m, i) => (i ? ["+", m] : [m])) });

const rund9 = x => Number(x.toFixed(9)); // über den Text: x · 1e9 verliert ab Millionen Stellen (4337840.860000001)
const dez = x => LST.dezimalText(rund9(x));
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
/** Zahl-Aufgabe (Dezimal- oder Prozentzahl, Zähler beim Erweitern). */
const zahlAufgabe = (stufe, typ, text, antwort, weg, kennung, daten) =>
  ({ art: "zahl", stufe, typ, text, antwort: rund9(antwort), loesung: dez(antwort), weg, kennung, daten });

/**
 * MA.1.A.1.h: Bruch, Dezimalzahl und Prozentzahl je in die beiden anderen Schreibweisen — sechs Richtungen gleich oft.
 * Der Bruch ist gekürzt und hat einen Nenner der Liste.
 */
const RICHTUNGEN = [["bruch", "dezimal"], ["bruch", "prozent"], ["dezimal", "bruch"], ["prozent", "bruch"], ["dezimal", "prozent"], ["prozent", "dezimal"]];
function umschreiben() {
  const [von, nach] = LST.waehle(RICHTUNGEN), b = teilerfremd(LST.waehle(NENNER_UMSCHREIBEN));
  const wert = Number(b.z) / Number(b.n);
  const zeige = { bruch: bt(b), dezimal: dez(wert), prozent: `${dez(wert * 100)} %` }[von];
  const daten = { von, nach, z: Number(b.z), n: Number(b.n) };
  if (nach === "bruch") return fertig("f", "umschreiben", `Schreibe als Bruch: ${zeige}`, b, `${zeige} = ${bt(b)}`, { aufgabeTerm: von === "prozent" ? `${dez(wert * 100)}/100` : dez(wert), daten });
  if (nach === "dezimal") return zahlAufgabe("f", "umschreiben", `Schreibe als Dezimalzahl: ${zeige} =`, wert, `${zeige} = ${dez(wert)}`, `${zeige} dezimal`, daten);
  return zahlAufgabe("f", "umschreiben", `Schreibe in Prozent: ${zeige} = □ %`, wert * 100, `${zeige} = ${dez(wert * 100)} %`, `${zeige} prozent`, daten);
}

/**
 * MA.1.A.3.f „Grundoperationen mit dem Rechner ausführen“ (E1-4 a): Zahlen, die man nicht im Kopf rechnet (1'000.00 bis
 * 9'999.99 und 10.00 bis 999.99); mal und geteilt auf zwei Nachkommastellen gerundet. Die Aufgabe trägt rechner: "mit",
 * die übrige Stufe bleibt ohne Rechner. Gerundet wird exakt (Bruch), halbe Hundertstel auf.
 */
const RECHNER_OP = { "+": B.plus, [M]: B.minus, "·": B.mal, ":": B.durch };
function aufHundertstel(w) { const h = (2n * w.z * 100n + w.n) / (2n * w.n); return Number(h) / 100; } // w positiv
function mitRechner() {
  const op = LST.waehle(Object.keys(RECHNER_OP));
  const a = z(100000, 999999) / 100, b = z(1000, 99999) / 100;
  const w = RECHNER_OP[op](B.vonZahl(a), B.vonZahl(b)), runden = op === "·" || op === ":";
  const antwort = runden ? aufHundertstel(w) : Number(w.z) / Number(w.n);
  const t = `${dez(a)} ${op} ${dez(b)}`;
  return Object.assign(zahlAufgabe("f", "rechner", `Mit dem Rechner${runden ? ", auf zwei Nachkommastellen gerundet" : ""}: ${t} =`,
    antwort, `${t} ${runden ? "≈" : "="} ${dez(antwort)}`, t, { a, b, op }), { rechner: "mit" });
}

/** MA.1.A.3.f: Dezimalzahlen bis 5 Wertziffern addieren und subtrahieren (30.8 + 5.6), beide zusammen wie RZ2 a. */
function dezimalPlusMinus() {
  const [x, y] = LST.aufteilung(5);
  let a = LST.dezimalZahl(x), b = LST.zufall(0, 1) ? LST.dezimalZahl(y) : LST.ganzeZahl(y);
  const plus = LST.zufall(0, 1) === 1;
  if (!plus && a < b) [a, b] = [b, a];
  if (!plus && a === b) return dezimalPlusMinus();
  const w = plus ? a + b : a - b;
  const t = `${dez(a)} ${plus ? "+" : M} ${dez(b)}`;
  return zahlAufgabe("f", "dezimal-plus-minus", `${t} =`, w, `${t} = ${dez(w)}`, t, { a, b, plus });
}

function stufeF() {
  const typ = LST.waehle(["kuerzen", "erweitern", "plus", "minus", "umschreiben", "dezimal-plus-minus", "rechner"]);
  if (typ === "umschreiben") return umschreiben();
  if (typ === "rechner") return mitRechner();
  if (typ === "dezimal-plus-minus") return dezimalPlusMinus();
  if (typ === "kuerzen") {
    const [n, f] = LST.waehle(ERWEITERBAR), b = teilerfremd(n);
    const t = `${b.z * BigInt(f)}/${b.n * BigInt(f)}`;
    return fertig("f", typ, `Kürze vollständig: ${t}`, b, `${t} = ${b.z * BigInt(f)} : ${f} / ${b.n * BigInt(f)} : ${f}`,
      { aufgabeTerm: t, darstellung: { art: "rechteck", teile: [bandModell(n, f, Number(b.z), 1)] } });
  }
  if (typ === "erweitern") {
    const [n, f] = LST.waehle(ERWEITERBAR), b = teilerfremd(n), ziel = n * f, zz = Number(b.z) * f;
    return Object.assign(zahlAufgabe("f", typ, `${bt(b)} = □/${ziel}. Zähler =`, zz, `mit ${f} erweitern: ${b.z} · ${f} = ${zz}`, `${bt(b)} ${ziel}`,
      { z: Number(b.z), n, ziel }), { darstellung: { art: "rechteck", teile: [bandModell(n, f, Number(b.z), 1)] } });
  }
  // neu ziehen innerhalb des Typs, damit jeder Typ gleich oft vorkommt (ein neuer Typ bevorzugte die anderen)
  // (bei minus nie zweimal derselbe Bruch: 1/2 − 1/2 hat nichts zu rechnen)
  let n1, n2, a, b;
  do {
    do { n1 = LST.waehle(NENNER); n2 = LST.waehle(NENNER); } while (kgv(n1, n2) > NENNER_MAX);
    a = teilerfremd(n1); b = teilerfremd(n2);
  } while (typ === "minus" && B.minus(a, b).z === 0n);
  if (typ === "minus" && B.minus(a, b).z < 0n) [a, b] = [b, a]; // f: positive Ergebnisse
  const w = typ === "plus" ? B.plus(a, b) : B.minus(a, b);
  return fertig("f", typ, `${bt(a)} ${typ === "plus" ? "+" : M} ${bt(b)} =`, w, `gleichnamig machen`,
    { aufgabeTerm: `${bt(a)} ${typ === "plus" ? "+" : "-"} ${bt(b)}`, darstellung: summenModell(a, b, typ === "plus" ? "+" : M) });
}

// ---------- g ----------
function stufeG() {
  const typ = LST.waehle(["mal", "mal", "ganz-mal", "stammbruch"]);
  if (typ === "mal") {
    let n1, n2;
    do { n1 = LST.waehle(NENNER); n2 = LST.waehle(NENNER); } while (n1 * n2 > NENNER_MAX);
    const a = teilerfremd(n1), b = teilerfremd(n2);
    return fertig("g", typ, `${bt(a)}${MAL}${bt(b)} =`, B.mal(a, b), `Zähler mal Zähler, Nenner mal Nenner`,
      { aufgabeTerm: `${bt(a)} * ${bt(b)}`, darstellung: malModell(a, b) });
  }
  if (typ === "ganz-mal") {
    const g = z(2, 12), b = teilerfremd(LST.waehle(NENNER));
    return fertig("g", typ, `${g}${MAL}${bt(b)} =`, B.mal(B.bruch(BigInt(g)), b), `${g} · ${b.z} = ${zt(g * Number(b.z))}, Nenner ${zt(b.n)}`, { aufgabeTerm: `${g} * ${bt(b)}`, darstellung: ganzMalModell(g, b) });
  }
  const g = z(1, 12), n = z(2, 10);
  return fertig("g", typ, `${g} : 1/${n} =`, B.bruch(BigInt(g * n)), `1/${n} passt ${n}-mal in 1, also ${g} · ${n}`, { aufgabeTerm: `${g} * ${n}` });
}

// ---------- i ----------
function zufallsBruch(neg) {
  const b = echt(LST.waehle([2, 3, 4, 5, 6, 8, 9, 10, 12]));
  return neg && LST.zufall(0, 1) ? B.neg(b) : b;
}
/** Bruch mit Variable im Zähler in der Schreibweise des Lehrplans: „2a/3“, „a/4“, „−5x/6“, „3a“. */
function bv(k, v) {
  const s = k.z < 0n ? M : "", z = k.z < 0n ? -k.z : k.z;
  return `${s}${z === 1n ? "" : z}${v}${k.n === 1n ? "" : `/${k.n}`}`;
}
const NENNER_I = [2, 3, 4, 5, 6, 8, 10];
const koeff = () => echt(LST.waehle(NENNER_I));
/** Erweiterung MA.1.A.3.i: Grundoperationen mit Brüchen mit Variablen (2a/3 + a/4; 2a/3 · 4/5; 2a/3 : 4/5). */
function variablenBruch() {
  const v = LST.waehle(["a", "b", "x", "y"]), op = LST.waehle(["+", M, "·", ":"]);
  const a = koeff(), b = koeff();
  const w = op === "+" ? B.plus(a, b) : op === M ? B.minus(a, b) : op === "·" ? B.mal(a, b) : B.durch(a, b);
  if (w.z === 0n) return variablenBruch();
  const zweiter = op === "+" || op === M ? bv(b, v) : bt(b);
  const loes = bv(w, v);
  return { art: "term", stufe: "i", typ: "variablen-bruch", text: `${bv(a, v)} ${op} ${zweiter} =`, antwortTerm: loes.replace(M, "-"),
    form: "bruchterm", tasten: ["/"], loesung: loes, weg: `${op === ":" ? "mit dem Kehrwert malnehmen" : op === "·" ? "Zähler mal Zähler, Nenner mal Nenner" : "gleichnamig machen"} = ${loes}`,
    kennung: `${bv(a, v)} ${op} ${zweiter}` };
}
/** Erweiterung MA.1.A.3.i: die Formeln des Lehrplans (formel6a–6d) mit Zahlen belegen. */
const FORMELN = [
  { text: "a/b + c/d", wert: (a, b, c, d) => B.plus(B.bruch(a, b), B.bruch(c, d)) },
  { text: "a/b − c/d", wert: (a, b, c, d) => B.minus(B.bruch(a, b), B.bruch(c, d)) },
  { text: "a/b · c/d", wert: (a, b, c, d) => B.mal(B.bruch(a, b), B.bruch(c, d)) },
  { text: "a : c/b : d", wert: (a, b, c, d) => B.mal(B.bruch(a, c), B.bruch(b, d)) }, // formel6d: = a/c · b/d
];
function belegen() {
  const f = LST.waehle(FORMELN), [a, b, c, d] = [z(1, 9), z(2, 9), z(1, 9), z(2, 9)].map(BigInt);
  const w = f.wert(a, b, c, d);
  const t = `a = ${a}, b = ${b}, c = ${c}, d = ${d}: ${f.text} =`;
  const eingesetzt = f.text.replace(/[abcd]/g, x => ({ a, b, c, d })[x]);
  // ausdruck: das Tastenfeld nimmt seine Variablen daraus, nicht aus dem Text mit a, b, c, d
  return fertig("i", "belegen", t, w, eingesetzt, { ausdruck: eingesetzt, daten: { formel: f.text, a: Number(a), b: Number(b), c: Number(c), d: Number(d) } });
}

function stufeI() {
  // ein Viertel der Aufgaben die Erweiterung (Brüche mit Variablen, mit Zahlen belegen)
  const typ = LST.waehle(["geteilt", "plus-minus-negativ", "mal-negativ", "erweiterung"]);
  if (typ === "erweiterung") return LST.zufall(0, 1) ? variablenBruch() : belegen();
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
    umschreiben: "Prozent heisst Hundertstel. Vom Bruch zur Dezimalzahl: Zähler durch Nenner teilen.",
    "dezimal-plus-minus": "Schreibe die Zahlen so untereinander, dass die Kommas genau untereinander stehen.",
    rechner: "Tippe die Rechnung genau ab. Runden: Ist die dritte Nachkommastelle 5 oder mehr, wird aufgerundet.",
    mal: "Zähler mal Zähler, Nenner mal Nenner. Vorher kürzen spart Arbeit.",
    "ganz-mal": "Die ganze Zahl nur mit dem Zähler multiplizieren.",
    stammbruch: "Wie oft passt der Stammbruch in eins? So oft mal die ganze Zahl.",
    geteilt: "Durch einen Bruch teilen heisst: mit dem Kehrwert multiplizieren.",
    "plus-minus-negativ": "Gleichnamig machen. Minus eine negative Zahl ist plus ihre Gegenzahl.",
    "mal-negativ": "Zuerst das Vorzeichen: gleiche Vorzeichen geben plus, verschiedene minus.",
    "variablen-bruch": "Rechne mit den Zahlen vor der Variable wie mit gewöhnlichen Brüchen; die Variable bleibt stehen.",
    belegen: "Setze die Zahlen für die Buchstaben ein und rechne dann wie mit gewöhnlichen Brüchen.",
    "klammer-mal": "Zuerst die Klammer ausrechnen, dann multiplizieren.",
    "klammer-geteilt": "Zuerst die Klammer, dann mit dem Kehrwert multiplizieren.",
  };
  return h[a.typ] || "Schritt für Schritt.";
}

/** Rechteckmodell gegen die Aufgabe: gefärbte Anteile ergeben die Brüche und die Lösung (E1-6 a). */
const MIT_MODELL = ["kuerzen", "erweitern", "plus", "minus", "mal", "ganz-mal"];
function anteil(m, farbe) {
  let n = 0;
  for (let sp = 0; sp < m.spalten; sp++) for (let ze = 0; ze < m.zeilen; ze++) {
    const k = sp * m.zeilen + ze, an = f => (f.art === "spalten" ? sp < f.anzahl : f.art === "zeilen" ? ze < f.anzahl : k < f.anzahl);
    const fs = new Set(m.faerben.filter(an).map(f => f.farbe));
    if (farbe === 12 ? fs.size === 2 : fs.has(farbe)) n++;
  }
  return B.bruch(BigInt(n), BigInt(m.spalten * m.zeilen));
}
function pruefeModell(a) {
  const m = [], dar = a.darstellung;
  if (!MIT_MODELL.includes(a.typ)) return dar ? [`Rechteckmodell bei ${a.typ}`] : [];
  if (!dar || dar.art !== "rechteck") return [`Rechteckmodell fehlt: ${a.text}`];
  const modelle = dar.teile.filter(t => typeof t !== "string");
  for (const t of modelle) if (t.spalten * t.zeilen > NENNER_MAX || t.spalten < 1 || t.zeilen < 1) m.push(`Raster ${t.spalten} × ${t.zeilen}`);
  const soll = a.art === "zahl" ? B.bruch(BigInt(a.daten.z), BigInt(a.daten.n)) : LST_TERME.lies(a.antwortTerm).poly.get("") || B.bruch(0n);
  const ist = a.typ === "mal" ? anteil(modelle[0], 12)
    : a.typ === "minus" ? B.minus(anteil(modelle[0], 1), anteil(modelle[1], 2))
    : a.typ === "plus" ? B.plus(anteil(modelle[0], 1), anteil(modelle[1], 2))
    : modelle.reduce((s, t) => B.plus(s, anteil(t, 1)), B.bruch(0n));
  if (!B.gleich(ist, soll)) m.push(`Rechteckmodell zeigt ${B.text(ist)}, Lösung ${B.text(soll)}: ${a.text}`);
  if ((a.typ === "plus" || a.typ === "minus") && modelle[0].spalten * modelle[0].zeilen !== modelle[1].spalten * modelle[1].zeilen) m.push(`Modelle nicht im selben Raster: ${a.text}`);
  return m;
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const T = LST_TERME;
  const d = a.daten || {};
  m.push(...pruefeModell(a));
  // Nenner nach dem Wortlaut (MA.1.A.3 f, g; beim Umschreiben MA.1.A.1.h)
  if (a.typ === "umschreiben") {
    if (!NENNER_UMSCHREIBEN.includes(d.n)) m.push(`Nenner ${d.n} nicht in der Liste (MA.1.A.1.h): ${a.text}`);
    if (ggt(d.z, d.n) !== 1) m.push(`Bruch nicht gekürzt: ${d.z}/${d.n}`);
  } else if (!["stammbruch", "dezimal-plus-minus", "rechner"].includes(a.typ) && ["f", "g"].includes(a.stufe)) {
    const nenner = [...a.text.matchAll(/\/(\d+)/g)].map(x => Number(x[1]));
    const fremd = nenner.filter(n => !NENNER.includes(n));
    if (fremd.length) m.push(`Nenner ${fremd.join(", ")} nicht in der Liste des Lehrplans: ${a.text}`);
    if ((a.typ === "plus" || a.typ === "minus") && nenner.length === 2 && kgv(nenner[0], nenner[1]) > NENNER_MAX) m.push(`gemeinsamer Nenner über ${NENNER_MAX}: ${a.text}`);
    if (a.typ === "mal" && nenner.length === 2 && nenner[0] * nenner[1] > NENNER_MAX) m.push(`Produkt der Nenner über ${NENNER_MAX}: ${a.text}`);
  }
  if (a.art === "zahl") {
    // exakt in Hundertsteln eines Tausendstels nachrechnen (höchstens 3 Nachkommastellen in Aufgabe und Ergebnis)
    const ganz = x => Math.round(x * 1e5);
    let soll;
    if (a.typ === "erweitern") {
      soll = d.z * d.ziel / d.n;
      if (d.ziel % d.n !== 0) m.push("Zielnenner kein Vielfaches");
    } else if (a.typ === "umschreiben") soll = d.z / d.n * (d.nach === "prozent" ? 100 : 1);
    else if (a.typ === "dezimal-plus-minus") {
      soll = (ganz(d.a) + (d.plus ? 1 : -1) * ganz(d.b)) / 1e5;
      if (LST.wertziffern(d.a) + LST.wertziffern(d.b) > 5) m.push(`zusammen mehr als 5 Wertziffern: ${a.text}`);
      if (soll <= 0) m.push(`Ergebnis nicht positiv: ${a.text}`);
    } else if (a.typ === "rechner") {
      const w = RECHNER_OP[d.op](B.vonZahl(d.a), B.vonZahl(d.b));
      soll = d.op === "·" || d.op === ":" ? Math.round(Number(w.z) * 100 / Number(w.n) + 1e-9) / 100 : Number(w.z) / Number(w.n);
      if (a.rechner !== "mit") m.push("Rechner-Aufgabe ohne rechner: mit");
    } else return [...m, `unbekannter Zahl-Typ ${a.typ}`];
    if (ganz(soll) !== ganz(a.antwort)) m.push(`Lösung ${a.antwort}, nachgerechnet ${soll}: ${a.text}`);
    if (LST.leseZahl(a.loesung) !== a.antwort) m.push(`Lösungstext ${a.loesung} passt nicht zu ${a.antwort}`);
    return m;
  }
  if (a.typ === "belegen") {
    const F = FORMELN.find(f => f.text === d.formel);
    if (!F) return [...m, `unbekannte Formel ${d.formel}`];
    const soll = F.wert(...[d.a, d.b, d.c, d.d].map(BigInt));
    if (!T.gleich(T.lies(a.antwortTerm).poly, T.lies(B.text(soll)).poly)) m.push(`Lösung ${a.antwortTerm}, nachgerechnet ${B.text(soll)}: ${a.text}`);
    // die Formel steht wörtlich im Text, die eingesetzten Zahlen ebenso
    if (!a.text.includes(d.formel) || !a.text.startsWith(`a = ${d.a}, b = ${d.b}, c = ${d.c}, d = ${d.d}:`)) m.push(`Text passt nicht zu den Daten: ${a.text}`);
    if (!T.bewerte(a.antwortTerm, a).ok) m.push(`Lösung nicht gekürzt: ${a.antwortTerm}`);
    return m;
  }
  // Aufgabe unabhängig aus dem angezeigten Text lesen (Zeichen übersetzt) und mit der Lösung vergleichen
  let ausText;
  try {
    let t = a.text.replace(/^(Kürze vollständig|Schreibe als Bruch): /, "").replace(/ =$/, "").replace(/·/g, "*").replace(/−/g, "-").replace(/^(.*) %$/, "$1 * 1/100");
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
