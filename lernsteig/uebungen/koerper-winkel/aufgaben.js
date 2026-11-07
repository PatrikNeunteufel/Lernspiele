/* Übung „Körper, Winkel, Ähnlichkeit“ — MA.2.A.3, Stufen j, k. Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.2.A.3:
   j  Pyramide, Kegel, Kugel; Winkel über Winkelsummen, Satz des Thales, Ähnlichkeit, Kongruenz
   k  ähnliche Figuren und Körper: Längen, Flächen, Volumen
   Die Stufen f bis i übt „Längen, Flächen, Volumen berechnen“.
   Annahmen, mit Patrik abzustimmen: Pyramiden mit quadratischer Grundfläche; Kegel und Kugel mit der π-Taste, auf eine
   Nachkommastelle (Abweichung bis 0.05); Winkel in ganzen Grad; Ähnlichkeit mit Streckfaktoren 0.5 bis 4. */
"use strict";

const UEBUNG = {
  id: "koerper-winkel",
  einleitung: "Berechne. Einheiten stehen hinter dem Feld. Mit π rundest du auf eine Nachkommastelle.",
  stufen: {
    j: "Pyramide, Kegel, Kugel; Winkelsummen und Satz des Thales",
    k: "Ähnliche Figuren und Körper: Längen, Flächen, Volumen",
    challenge: "Rückwärts rechnen: Höhe, Anzahl Ecken, Gewicht ähnlicher Körper",
  },
};

const MAL = " · ";
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
const auf1 = x => Math.round(x * 10) / 10;
const z = (a, b) => LST.zufall(a, b);
const TOL = 0.05 + 1e-6;
const GRAD = "°";

function fertig(stufe, typ, text, antwort, einheit, weg, daten, extra) {
  const loes = `${dez(antwort)}${!einheit || einheit === GRAD ? "" : " "}${einheit || ""}`;
  const zeichen = extra && extra.toleranz ? "≈" : "=";
  return Object.assign({ art: "zahl", stufe, typ, text, einheit, antwort: rund(antwort), loesung: loes, weg: `${weg} ${zeichen} ${loes}`, kennung: text, daten }, extra || {});
}

// ---------- j ----------
function koerper() {
  const typ = LST.waehle(["pyramide", "kegel", "kugel-volumen", "kugel-oberflaeche"]);
  const e = LST.waehle(["cm", "m", "dm"]);
  if (typ === "pyramide") {
    let a, h; do { a = z(2, 15); h = z(2, 20); } while ((a * a * h) % 3 !== 0);
    return fertig("j", typ, `Pyramide mit quadratischer Grundfläche: Seite ${a} ${e}, Höhe ${h} ${e}. Volumen =`, a * a * h / 3, `${e}³`, `${a}²${MAL}${h} : 3 = ${LST.zahlText(a * a * h)} : 3`, { a, h });
  }
  if (typ === "kegel") {
    const r = z(1, 12), h = z(2, 20), v = auf1(Math.PI * r * r * h / 3);
    return fertig("j", typ, `Kegel mit Radius ${r} ${e} und Höhe ${h} ${e}. Volumen (auf eine Nachkommastelle) =`, v, `${e}³`, `${r}²${MAL}π${MAL}${h} : 3`, { r, h }, { toleranz: TOL });
  }
  const r = z(1, 12);
  if (typ === "kugel-volumen") {
    return fertig("j", typ, `Kugel mit Radius ${r} ${e}. Volumen (auf eine Nachkommastelle) =`, auf1(4 / 3 * Math.PI * r ** 3), `${e}³`, `4 : 3${MAL}π${MAL}${r}³`, { r }, { toleranz: TOL });
  }
  return fertig("j", typ, `Kugel mit Radius ${r} ${e}. Oberfläche (auf eine Nachkommastelle) =`, auf1(4 * Math.PI * r * r), `${e}²`, `4${MAL}π${MAL}${r}²`, { r }, { toleranz: TOL });
}
const REGELMAESSIG = [5, 6, 8, 9, 10, 12, 15, 18, 20];
function winkel() {
  const typ = LST.waehle(["dreieck", "viereck", "summe", "regelmaessig", "thales", "gleichschenklig"]);
  if (typ === "dreieck") {
    const a = z(20, 110), b = z(15, 160 - a);
    return fertig("j", typ, `In einem Dreieck ist α = ${a}${GRAD} und β = ${b}${GRAD}. γ =`, 180 - a - b, GRAD, `180${GRAD} − ${a}${GRAD} − ${b}${GRAD}`, { winkel: [a, b], summe: 180 });
  }
  if (typ === "viereck") {
    const a = z(50, 130), b = z(50, 130), c = z(Math.max(50, 190 - a - b), Math.min(130, 340 - a - b)); // vierter Winkel 20° bis 170° (konvex)
    return fertig("j", typ, `In einem Viereck sind drei Winkel ${a}${GRAD}, ${b}${GRAD} und ${c}${GRAD}. Der vierte Winkel =`, 360 - a - b - c, GRAD, `360${GRAD} − ${a}${GRAD} − ${b}${GRAD} − ${c}${GRAD}`, { winkel: [a, b, c], summe: 360 });
  }
  if (typ === "summe") {
    const n = z(5, 12);
    return fertig("j", typ, `Wie gross ist die Summe der Innenwinkel in einem ${n}-Eck?`, (n - 2) * 180, GRAD, `(${n} − 2)${MAL}180${GRAD}`, { n });
  }
  if (typ === "regelmaessig") {
    const n = LST.waehle(REGELMAESSIG);
    return fertig("j", typ, `Wie gross ist ein Innenwinkel in einem regelmässigen ${n}-Eck?`, (n - 2) * 180 / n, GRAD, `(${n} − 2)${MAL}180${GRAD} : ${n} = ${dez((n - 2) * 180)}${GRAD} : ${n}`, { n });
  }
  if (typ === "thales") {
    const a = z(15, 75);
    return fertig("j", typ, `Der Punkt C liegt auf dem Halbkreis über der Strecke AB (Thaleskreis). Im Dreieck ABC ist α = ${a}${GRAD}. β =`, 90 - a, GRAD, `Bei C ist ein rechter Winkel: 180${GRAD} − 90${GRAD} − ${a}${GRAD}`, { a });
  }
  const basis = z(20, 85);
  return fertig("j", typ, `In einem gleichschenkligen Dreieck ist jeder Basiswinkel ${basis}${GRAD}. Wie gross ist der Winkel an der Spitze?`, 180 - 2 * basis, GRAD, `180${GRAD} − 2${MAL}${basis}${GRAD}`, { basis });
}

// ---------- k ----------
const FAKTOREN = [0.5, 1.5, 2, 2.5, 3, 4];
function stufeK() {
  const typ = LST.waehle(["seite", "seite", "flaeche", "volumen", "faktor-flaeche", "faktor-volumen"]);
  if (typ === "seite") {
    for (;;) {
      const k = LST.waehle(FAKTOREN), a = z(2, 12), b = z(2, 14);
      if (a === b || !Number.isInteger(rund(a * k * 10)) || !Number.isInteger(rund(b * k * 10))) continue;
      return fertig("k", typ, `Zwei Dreiecke sind ähnlich. Im ersten sind a = ${a} cm und b = ${b} cm, im zweiten ist a = ${dez(a * k)} cm. Wie lang ist b im zweiten?`,
        b * k, "cm", `Faktor ${dez(a * k)} : ${a} = ${dez(k)}, also ${b}${MAL}${dez(k)}`, { a, b, k });
    }
  }
  if (typ === "flaeche") {
    const k = LST.waehle([2, 3, 4, 0.5, 1.5]), A = z(2, 40) * 4;
    return fertig("k", typ, `Eine Figur hat ${A} cm² Fläche. Alle Längen werden mit ${dez(k)} multipliziert. Neue Fläche =`, A * k * k, "cm²", `${A}${MAL}${dez(k)}²`, { A, k });
  }
  if (typ === "volumen") {
    const k = LST.waehle([2, 3, 0.5]), V = z(1, 30) * 8;
    return fertig("k", typ, `Ein Körper hat ${V} cm³ Volumen. Alle Längen werden mit ${dez(k)} multipliziert. Neues Volumen =`, V * k ** 3, "cm³", `${V}${MAL}${dez(k)}³`, { V, k });
  }
  const k = z(2, 5);
  if (typ === "faktor-flaeche") {
    return fertig("k", typ, `Eine Figur wird so vergrössert, dass ihre Fläche ${k * k}-mal so gross wird. Mit welchem Faktor wurden die Längen multipliziert?`, k, "", `√${k * k}`, { quadrat: k * k });
  }
  return fertig("k", typ, `Ein Würfel wird so vergrössert, dass sein Volumen ${k ** 3}-mal so gross wird. Mit welchem Faktor wurden die Kanten multipliziert?`, k, "", `³√${k ** 3}`, { kubik: k ** 3 });
}

// ---------- Challenge ----------
function challenge() {
  const typ = LST.waehle(["pyramide-hoehe", "ecken", "gewicht"]);
  if (typ === "pyramide-hoehe") {
    const a = z(2, 12), h = z(2, 20), v = a * a * h / 3;
    if (!Number.isInteger(v)) return challenge();
    return fertig("challenge", typ, `Eine Pyramide mit quadratischer Grundfläche (Seite ${a} cm) hat ${LST.zahlText(v)} cm³ Volumen. Wie hoch ist sie?`, h, "cm", `3${MAL}${LST.zahlText(v)} : ${a}²`, { a, v });
  }
  if (typ === "ecken") {
    const n = LST.waehle(REGELMAESSIG), w = (n - 2) * 180 / n;
    return fertig("challenge", typ, `In einem regelmässigen Vieleck ist jeder Innenwinkel ${dez(w)}${GRAD}. Wie viele Ecken hat es?`, n, "", `Aussenwinkel 180${GRAD} − ${dez(w)}${GRAD} = ${dez(180 - w)}${GRAD}, 360${GRAD} : ${dez(180 - w)}${GRAD}`, { w });
  }
  const k = LST.waehle([2, 3, 0.5]), g = z(1, 25) * 40, l = z(2, 10) * 2; // g durch 8 teilbar (Faktor 0.5)
  return fertig("challenge", typ, `Eine Figur aus Holz ist ${l} cm hoch und wiegt ${LST.zahlText(g)} g. Eine ähnliche Figur aus demselben Holz ist ${dez(l * k)} cm hoch. Wie schwer ist sie?`,
    g * k ** 3, "g", `Faktor ${dez(k)}, Gewicht wie Volumen: ${LST.zahlText(g)}${MAL}${dez(k)}³`, { g, k, l });
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "j") return LST.zufall(0, 1) ? koerper() : winkel();
  if (stufe === "k") return stufeK();
  if (stufe === "challenge") return challenge();
  throw new Error(`koerper-winkel: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    pyramide: "Volumen der Pyramide: Grundfläche mal Höhe, davon ein Drittel.",
    kegel: "Volumen des Kegels: Kreisfläche mal Höhe, davon ein Drittel.",
    "kugel-volumen": "Volumen der Kugel: vier Drittel mal π mal Radius hoch drei.",
    "kugel-oberflaeche": "Oberfläche der Kugel: vier mal π mal Radius im Quadrat.",
    dreieck: "Die Winkel im Dreieck ergeben zusammen 180 Grad.",
    viereck: "Die Winkel im Viereck ergeben zusammen 360 Grad.",
    summe: "Ein Vieleck lässt sich von einer Ecke aus in Dreiecke zerlegen: zwei weniger, als es Ecken hat.",
    regelmaessig: "Zuerst die Winkelsumme, dann durch die Anzahl der Ecken teilen.",
    thales: "Nach Thales ist der Winkel bei C ein rechter Winkel.",
    gleichschenklig: "Die beiden Basiswinkel sind gleich gross. Zusammen mit dem Winkel an der Spitze ergeben sie 180 Grad.",
    seite: "Suche den Streckfaktor: neue Länge geteilt durch alte. Alle Seiten wachsen mit demselben Faktor.",
    flaeche: "Flächen wachsen mit dem Quadrat des Streckfaktors.",
    volumen: "Volumen wachsen mit der dritten Potenz des Streckfaktors.",
    "faktor-flaeche": "Die Fläche wächst mit dem Quadrat des Faktors. Ziehe die Wurzel.",
    "faktor-volumen": "Das Volumen wächst mit der dritten Potenz des Faktors. Ziehe die dritte Wurzel.",
    "pyramide-hoehe": "Volumen mal drei, dann durch die Grundfläche teilen.",
    ecken: "Der Aussenwinkel ergänzt den Innenwinkel zu 180 Grad. Alle Aussenwinkel zusammen ergeben 360 Grad.",
    gewicht: "Das Gewicht wächst wie das Volumen: mit der dritten Potenz des Streckfaktors.",
  };
  return h[a.typ] || "Schreibe die passende Formel auf.";
}

/** Prüfung aus den Daten; Winkel über die Summe, Körper über Math.PI, Ähnlichkeit über den Faktor. */
/**
 * Den angezeigten Text lesen (Plan B2 Schritt 3, TD1 a): je Typ der Satz als Muster (LST.zahlenImText, „#“ Zahl,
 * „~“ Einheit), unabhängig vom Erzeuger geschrieben. Liefert die Werte in der Form von a.daten oder null. Zurückgerechnet:
 * die Winkelsumme aus der Figur (Dreieck 180°, Viereck 360°), der Ähnlichkeitsfaktor aus den beiden Längen.
 */
const LESER = {
  pyramide: [["Pyramide mit quadratischer Grundfläche: Seite # ~, Höhe # ~. Volumen =", ([a, h]) => ({ a, h })]],
  kegel: [["Kegel mit Radius # ~ und Höhe # ~. Volumen (auf eine Nachkommastelle) =", ([r, h]) => ({ r, h })]],
  "kugel-volumen": [["Kugel mit Radius # ~. Volumen (auf eine Nachkommastelle) =", ([r]) => ({ r })]],
  "kugel-oberflaeche": [["Kugel mit Radius # ~. Oberfläche (auf eine Nachkommastelle) =", ([r]) => ({ r })]],
  dreieck: [["In einem Dreieck ist α = #° und β = #°. γ =", ([a, b]) => ({ winkel: [a, b], summe: 180 })]],
  viereck: [["In einem Viereck sind drei Winkel #°, #° und #°. Der vierte Winkel =", ([a, b, c]) => ({ winkel: [a, b, c], summe: 360 })]],
  summe: [["Wie gross ist die Summe der Innenwinkel in einem #-Eck?", ([n]) => ({ n })]],
  regelmaessig: [["Wie gross ist ein Innenwinkel in einem regelmässigen #-Eck?", ([n]) => ({ n })]],
  thales: [["Der Punkt C liegt auf dem Halbkreis über der Strecke AB (Thaleskreis). Im Dreieck ABC ist α = #°. β =", ([a]) => ({ a })]],
  gleichschenklig: [["In einem gleichschenkligen Dreieck ist jeder Basiswinkel #°. Wie gross ist der Winkel an der Spitze?", ([basis]) => ({ basis })]],
  seite: [["Zwei Dreiecke sind ähnlich. Im ersten sind a = # cm und b = # cm, im zweiten ist a = # cm. Wie lang ist b im zweiten?", ([a, b, a2]) => ({ a, b, k: a2 / a })]],
  flaeche: [["Eine Figur hat # cm² Fläche. Alle Längen werden mit # multipliziert. Neue Fläche =", ([A, k]) => ({ A, k })]],
  volumen: [["Ein Körper hat # cm³ Volumen. Alle Längen werden mit # multipliziert. Neues Volumen =", ([V, k]) => ({ V, k })]],
  "faktor-flaeche": [["Eine Figur wird so vergrössert, dass ihre Fläche #-mal so gross wird. Mit welchem Faktor wurden die Längen multipliziert?", ([quadrat]) => ({ quadrat })]],
  "faktor-volumen": [["Ein Würfel wird so vergrössert, dass sein Volumen #-mal so gross wird. Mit welchem Faktor wurden die Kanten multipliziert?", ([kubik]) => ({ kubik })]],
  "pyramide-hoehe": [["Eine Pyramide mit quadratischer Grundfläche (Seite # cm) hat # cm³ Volumen. Wie hoch ist sie?", ([a, v]) => ({ a, v })]],
  ecken: [["In einem regelmässigen Vieleck ist jeder Innenwinkel #°. Wie viele Ecken hat es?", ([w]) => ({ w })]],
  gewicht: [["Eine Figur aus Holz ist # cm hoch und wiegt # g. Eine ähnliche Figur aus demselben Holz ist # cm hoch. Wie schwer ist sie?", ([l, g, l2]) => ({ g, k: l2 / l, l })]],
};
function liesText(a) {
  for (const [muster, werte] of LESER[a.typ] || []) {
    const z = LST.zahlenImText(a.text, muster);
    if (z) return werte(z);
  }
  return null;
}

/** Nachrechnen aus Werten in der Form von a.daten (aus den Daten oder aus dem Text). */
const P = Math.PI;
const SOLL = {
  pyramide: d => d.a * d.a * d.h / 3, kegel: d => P * d.r * d.r * d.h / 3, "kugel-volumen": d => 4 * P * d.r ** 3 / 3, "kugel-oberflaeche": d => 4 * P * d.r * d.r,
  dreieck: d => d.summe - d.winkel.reduce((x, y) => x + y), viereck: d => d.summe - d.winkel.reduce((x, y) => x + y),
  summe: d => 180 * d.n - 360, regelmaessig: d => 180 - 360 / d.n, thales: d => 180 - 90 - d.a, gleichschenklig: d => 180 - 2 * d.basis,
  seite: d => d.b * d.k, flaeche: d => d.A * d.k * d.k, volumen: d => d.V * d.k * d.k * d.k,
  "faktor-flaeche": d => Math.sqrt(d.quadrat), "faktor-volumen": d => Math.cbrt(d.kubik),
  "pyramide-hoehe": d => 3 * d.v / (d.a * d.a), ecken: d => 360 / (180 - d.w), gewicht: d => d.g * d.k ** 3,
};
/** Gleiche Werte (auch Listen wie die Winkel), auf Rundungsreste genau. */
const gleichWert = (x, y) => (Array.isArray(x) ? Array.isArray(y) && x.length === y.length && x.every((v, i) => gleichWert(v, y[i])) : Math.abs(x - y) < 1e-9);

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  const soll = SOLL[a.typ];
  if (!soll) return [`unbekannter Typ ${a.typ}`];
  const w = soll(d), tol = a.toleranz || 0;
  const passt = x => Math.abs(x - a.antwort) <= (tol ? 0.05 + 1e-9 : 1e-6);
  if (!passt(w)) m.push(`Lösung ${a.antwort}, nachgerechnet ${w}: ${a.text}`);
  // Text gegen Prüfdaten (TD1 a): was der Jugendliche liest, sind dieselben Werte, und aus ihnen folgt dieselbe Lösung
  const t = liesText(a);
  if (!t) m.push(`Text folgt keinem Muster des Typs ${a.typ}: ${a.text}`);
  else {
    const anders = Object.keys(d).filter(k => !gleichWert(t[k], d[k]));
    if (anders.length) m.push(`Text zeigt ${anders.map(k => `${k} = ${t[k]}`).join(", ")}, Prüfdaten ${anders.map(k => `${k} = ${d[k]}`).join(", ")}: ${a.text}`);
    if (!passt(soll(t))) m.push(`aus dem Text nachgerechnet ${soll(t)}, Lösung ${a.antwort}: ${a.text}`);
  }
  if (!tol && !Number.isInteger(rund(a.antwort * 10))) m.push(`exakte Lösung mit mehr als einer Nachkommastelle: ${a.text}`);
  if (tol && !/Nachkommastelle/.test(a.text)) m.push(`gerundete Lösung ohne Angabe im Text: ${a.text}`);
  if (a.antwort <= 0) m.push(`Ergebnis nicht positiv: ${a.text}`);
  if (a.einheit === GRAD && !Number.isInteger(a.antwort)) m.push(`Winkel nicht ganzzahlig: ${a.text}`);
  if (/\d{4}/.test((a.text + " " + a.weg).replace(/\.\d+/g, ""))) m.push(`Tausender ohne Apostroph: ${a.text}`);
  if (d.winkel && d.winkel.some(x => x <= 0)) m.push("Winkel nicht positiv");
  if (d.winkel && a.antwort >= 180) m.push(`Winkel ab 180°: ${a.text}`);
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis, liesText };
