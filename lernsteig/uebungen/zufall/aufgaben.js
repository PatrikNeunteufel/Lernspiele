/* Übung „Daten und Zufall“ — MA.3.C.1, Stufen f, h, i. Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.3.C.1:
   f  (GA Z2) Datensätze auswerten, Mittelwert, Maximum, Minimum
   h  mehrstufige Zufallsexperimente, Baumdiagramm (dreimal Münze)
   i  (OP, E) Erweiterung: Wahrscheinlichkeiten ermitteln (zweimal gleiche Farbe ziehen); Wahrscheinlichkeit aus
      relativer Häufigkeit (88 von 2750 Zügen verspätet)
   Annahmen, mit Patrik abzustimmen: Wahrscheinlichkeit als gekürzter Bruch, aus relativer Häufigkeit in Prozent;
   „Wie oft erwartest du …“ meint den Erwartungswert (Würfe mal Wahrscheinlichkeit); Kugeln sind gut gemischt.
   pruefeAufgabe zählt jede Wahrscheinlichkeit unabhängig durch Aufzählen aller Ziehungen nach (Kugeln einzeln). */
"use strict";

const UEBUNG = {
  id: "zufall",
  einleitung: "Werte Daten aus und bestimme Wahrscheinlichkeiten. Brüche gibst du gekürzt an, etwa 3/8.",
  stufen: {
    f: "Mittelwert, grösster und kleinster Wert",
    h: "Baumdiagramm: dreimal Münze, zweimal ziehen mit Zurücklegen",
    i: "Ziehen ohne Zurücklegen, Wahrscheinlichkeit aus Häufigkeiten",
    challenge: "Drei Stufen, Gegenereignis, fehlender Wert zum Mittelwert",
  },
};

const B = KERN.bruch;
const z = (a, b) => LST.zufall(a, b);
const zt = n => LST.zahlText(n);
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
const bt = b => (b.n === 1n ? `${b.z}` : `${b.z}/${b.n}`);

function zahlAufgabe(stufe, typ, text, antwort, einheit, weg, daten) {
  const loes = Number.isInteger(antwort) ? zt(antwort) : dez(antwort);
  return { art: "zahl", stufe, typ, text, antwort: rund(antwort), einheit, loesung: `${loes}${einheit ? " " + einheit : ""}`, weg: `${weg} = ${loes}${einheit ? " " + einheit : ""}`, kennung: text, daten };
}
function bruchAufgabe(stufe, typ, text, z0, n0, weg, daten) {
  const loes = bt(B.bruch(BigInt(z0), BigInt(n0)));
  return { art: "term", stufe, typ, text: `${text} (als gekürzter Bruch)`, antwortTerm: loes, form: "bruch", loesung: loes, tasten: ["/"], weg: weg.endsWith(loes) ? weg : `${weg} = ${loes}`, kennung: text, daten };
}

// ---------- f ----------
const DATEN = [
  { was: "Punkte im Test", von: 4, bis: 30, einheit: "" },
  { was: "Temperaturen um 7 Uhr in °C", von: -8, bis: 12, einheit: "°C" },
  { was: "Sprungweiten in cm", von: 250, bis: 480, einheit: "cm" },
  { was: "Minuten Schulweg", von: 3, bis: 40, einheit: "min" },
];
function datensatz(n) {
  for (;;) {
    const d = LST.waehle(DATEN);
    const werte = Array.from({ length: n }, () => z(d.von, d.bis));
    const s = werte.reduce((a, b) => a + b, 0);
    if (Number.isInteger(rund(s * 10 / n))) return { d, werte, s }; // Mittelwert mit höchstens einer Nachkommastelle
  }
}
function stufeF() {
  const typ = LST.waehle(["mittelwert", "mittelwert", "spanne"]);
  const { d, werte, s } = datensatz(z(5, 7));
  const liste = werte.map(zt).join(", ");
  if (typ === "mittelwert") {
    return zahlAufgabe("f", typ, `${d.was}: ${liste}. Wie gross ist der Mittelwert?`, s / werte.length, d.einheit,
      `(${werte.map(zt).join(" + ").replace(/\+ −/g, "− ")}) : ${werte.length} = ${zt(s)} : ${werte.length}`, { werte });
  }
  const max = Math.max(...werte), min = Math.min(...werte);
  return zahlAufgabe("f", typ, `${d.was}: ${liste}. Wie gross ist der Unterschied zwischen dem grössten und dem kleinsten Wert?`, max - min, d.einheit,
    `${zt(max)} − ${min < 0 ? `(${zt(min)})` : zt(min)}`, { werte, spanne: true });
}

// ---------- Kugeln ----------
const FARBEN = [["rote", "blaue", "rot", "blau"], ["gelbe", "grüne", "gelb", "grün"], ["schwarze", "weisse", "schwarz", "weiss"]];
function urne(r, b) { const f = LST.waehle(FARBEN); return { r, b, f, text: `In einer Urne liegen ${r} ${f[0]} und ${b} ${f[1]} Kugeln.` }; }

// ---------- h ----------
function stufeH() {
  const typ = LST.waehle(["drei-muenzen", "drei-muenzen", "pfade", "urne-mit", "urne-mit"]);
  if (typ === "drei-muenzen") {
    const [e, t, g, w] = LST.waehle([
      ["k0", "keinmal Kopf", 1, 0], ["k1", "genau einmal Kopf", 3, 1], ["k2", "genau zweimal Kopf", 3, 2], ["k3", "dreimal Kopf", 1, 3],
      ["kmin2", "mindestens zweimal Kopf", 4, 2], ["zmin1", "mindestens einmal Zahl", 7, 1],
    ]);
    return bruchAufgabe("h", typ, `Du wirfst dreimal eine Münze. Wie gross ist die Wahrscheinlichkeit für ${t}?`, g, 8, `${g} von 2 · 2 · 2 = 8 Pfaden passen: ${g}/8`, { stufen: ["muenze", "muenze", "muenze"], ereignis: e, wert: w });
  }
  if (typ === "pfade") {
    const [t, stufen, weg] = LST.waehle([
      ["zweimal würfeln", ["wuerfel", "wuerfel"], "6 · 6"], ["eine Münze und einen Würfel werfen", ["muenze", "wuerfel"], "2 · 6"],
      ["dreimal würfeln", ["wuerfel", "wuerfel", "wuerfel"], "6 · 6 · 6"], ["viermal eine Münze werfen", ["muenze", "muenze", "muenze", "muenze"], "2 · 2 · 2 · 2"],
      ["fünfmal eine Münze werfen", Array(5).fill("muenze"), "2 · 2 · 2 · 2 · 2"], ["zweimal würfeln und eine Münze werfen", ["wuerfel", "wuerfel", "muenze"], "6 · 6 · 2"],
    ]);
    const n = stufen.reduce((a, s) => a * (s === "muenze" ? 2 : 6), 1);
    return zahlAufgabe("h", typ, `Du willst ${t}. Wie viele Pfade (Ergebnisse) hat das vollständige Baumdiagramm?`, n, "", weg, { stufen, pfade: true });
  }
  const u = urne(z(1, 7), z(1, 7)), n = u.r + u.b;
  const [e, t, g] = LST.waehle([
    ["aa", `zweimal ${u.f[2]}`, u.r * u.r], ["bb", `zweimal ${u.f[3]}`, u.b * u.b], ["ab", `zuerst ${u.f[2]}, dann ${u.f[3]}`, u.r * u.b],
    ["verschieden", "zwei verschiedene Farben (Reihenfolge egal)", 2 * u.r * u.b],
  ]);
  return bruchAufgabe("h", "urne-mit", `${u.text} Du ziehst eine Kugel, legst sie zurück und ziehst noch einmal. Wie gross ist die Wahrscheinlichkeit für ${t}?`, g, n * n,
    `${g} von ${n} · ${n} = ${n * n} Fällen: ${g}/${n * n}`, { kugeln: [u.r, u.b], zuruecklegen: true, zuege: 2, ereignis: e });
}

// ---------- i ----------
const HAEUFIG = [
  ["Von {N} Zügen waren {a} verspätet. Schätze die Wahrscheinlichkeit, dass ein Zug verspätet ist.", [500, 1000, 1250, 2000, 2500, 2750]],
  ["Ein Reissnagel wurde {N}-mal geworfen und landete {a}-mal auf dem Rücken. Schätze die Wahrscheinlichkeit für „Rücken“.", [200, 250, 400, 500]],
  ["Von {N} geprüften Lampen waren {a} defekt. Schätze die Wahrscheinlichkeit, dass eine Lampe defekt ist.", [400, 500, 1000, 2000]],
];
function stufeI() {
  const typ = LST.waehle(["urne-ohne", "urne-ohne", "relativ", "erwartet"]);
  if (typ === "relativ") {
    const [satz, ns] = LST.waehle(HAEUFIG), N = LST.waehle(ns);
    let a; do { a = z(1, Math.floor(N * 0.6)); } while ((a * 1000) % N !== 0);
    const p = a * 100 / N;
    return zahlAufgabe("i", typ, satz.replace("{N}", zt(N)).replace("{a}", zt(a)) + " Angabe in %", p, "%", `${zt(a)} : ${zt(N)} = ${dez(a / N)}`, { a, N });
  }
  if (typ === "erwartet") {
    const [t, p, q, schritt] = LST.waehle([["einen Würfel", "eine Sechs", 6, 6], ["eine Münze", "Kopf", 2, 2], ["einen Würfel", "eine gerade Zahl", 2, 6], ["einen Würfel", "eine Eins oder eine Zwei", 3, 6]]);
    const N = z(5, 100) * schritt; // Vielfaches von q
    return zahlAufgabe("i", typ, `Du wirfst ${t} ${zt(N)}-mal. Wie oft erwartest du ungefähr ${p}?`, N / q, "", `${zt(N)} : ${q}`, { N, q });
  }
  const u = urne(z(2, 7), z(2, 7)), n = u.r + u.b, alle = n * (n - 1);
  const [e, t, g] = LST.waehle([
    ["aa", `zweimal ${u.f[2]}`, u.r * (u.r - 1)], ["bb", `zweimal ${u.f[3]}`, u.b * (u.b - 1)],
    ["gleich", "zweimal dieselbe Farbe", u.r * (u.r - 1) + u.b * (u.b - 1)], ["verschieden", "zwei verschiedene Farben", 2 * u.r * u.b],
  ]);
  return bruchAufgabe("i", "urne-ohne", `${u.text} Du ziehst nacheinander zwei Kugeln, ohne die erste zurückzulegen. Wie gross ist die Wahrscheinlichkeit für ${t}?`, g, alle,
    `${g} von ${n} · ${n - 1} = ${alle} Fällen: ${g}/${alle}`, { kugeln: [u.r, u.b], zuruecklegen: false, zuege: 2, ereignis: e });
}

// ---------- Challenge ----------
function challenge() {
  const typ = LST.waehle(["drei-ohne", "drei-wuerfel", "fehlend"]);
  if (typ === "drei-ohne") {
    const u = urne(z(3, 6), z(2, 6)), n = u.r + u.b, alle = n * (n - 1) * (n - 2), g = u.r * (u.r - 1) * (u.r - 2);
    return bruchAufgabe("challenge", typ, `${u.text} Du ziehst drei Kugeln nacheinander ohne Zurücklegen. Wie gross ist die Wahrscheinlichkeit, dass alle drei ${u.f[2]} sind?`, g, alle,
      `${u.r}/${n} · ${u.r - 1}/${n - 1} · ${u.r - 2}/${n - 2} = ${zt(g)}/${zt(alle)}`, { kugeln: [u.r, u.b], zuruecklegen: false, zuege: 3, ereignis: "aaa" });
  }
  if (typ === "drei-wuerfel") {
    const [e, t, g, weg] = LST.waehle([
      ["sechs-min1", "mindestens eine Sechs", 91, "Gegenereignis keine Sechs: 5 · 5 · 5 = 125 von 216, also 216 − 125 = 91 günstige: 91/216"],
      ["sechs-keine", "keine Sechs", 125, "5 · 5 · 5 = 125 von 6 · 6 · 6 = 216: 125/216"],
      ["drei-gleich", "dreimal dieselbe Augenzahl", 6, "6 günstige von 216: 6/216"],
    ]);
    return bruchAufgabe("challenge", typ, `Du wirfst dreimal einen Würfel. Wie gross ist die Wahrscheinlichkeit für ${t}?`, g, 216, weg, { stufen: ["wuerfel", "wuerfel", "wuerfel"], ereignis: e });
  }
  for (;;) {
    const n = z(4, 6), werte = Array.from({ length: n }, () => z(2, 30)), m = z(6, 20), fehlt = m * n - werte.slice(0, -1).reduce((a, b) => a + b, 0);
    if (fehlt < 1 || fehlt > 40) continue;
    const bekannt = werte.slice(0, -1);
    return zahlAufgabe("challenge", "fehlend", `Ein Datensatz hat ${n} Werte, ihr Mittelwert ist ${m}. Bekannt sind ${bekannt.join(", ")}. Wie gross ist der fehlende Wert?`,
      fehlt, "", `${m} · ${n} − (${bekannt.join(" + ")}) = ${m * n} − ${m * n - fehlt}`, { bekannt, mittel: m, n });
  }
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "f") return stufeF();
  if (stufe === "h") return stufeH();
  if (stufe === "i") return stufeI();
  if (stufe === "challenge") return challenge();
  throw new Error(`zufall: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    mittelwert: "Addiere alle Werte und teile durch die Anzahl der Werte. Negative Werte ziehen die Summe nach unten.",
    spanne: "Suche den grössten und den kleinsten Wert und subtrahiere. Minus eine negative Zahl ist plus.",
    "drei-muenzen": "Zeichne das Baumdiagramm: drei Würfe, je zwei Äste. Zähle die Pfade, die passen.",
    pfade: "Jede Stufe vervielfacht die Zahl der Pfade: Münze zwei Äste, Würfel sechs.",
    "urne-mit": "Mit Zurücklegen bleibt die Urne gleich. Multipliziere die Wahrscheinlichkeiten entlang des Pfades; bei „Reihenfolge egal“ zählen zwei Pfade.",
    "urne-ohne": "Ohne Zurücklegen fehlt beim zweiten Zug eine Kugel. Multipliziere entlang des Pfades und addiere passende Pfade.",
    relativ: "Teile die Anzahl der Treffer durch die Anzahl der Versuche und rechne in Prozent um.",
    erwartet: "Multipliziere die Anzahl Würfe mit der Wahrscheinlichkeit für das Ereignis.",
    "drei-ohne": "Multipliziere die drei Brüche entlang des Pfades. Nach jedem Zug ist eine Kugel weniger in der Urne.",
    "drei-wuerfel": "Drei Würfe ergeben sechs mal sechs mal sechs Fälle. Manchmal hilft das Gegenereignis.",
    fehlend: "Mittelwert mal Anzahl Werte gibt die Summe aller Werte. Davon ziehst du die bekannten ab.",
  };
  return h[a.typ] || "Schreibe alle gleich wahrscheinlichen Fälle auf.";
}

// ---------- Prüfung: alles durch Aufzählen nachzählen ----------
function folgen(menge, laenge, wiederholung) {
  const erg = [];
  const geh = f => { if (f.length === laenge) { erg.push(f); return; } for (const x of menge) if (wiederholung || !f.includes(x)) geh(f.concat(x)); };
  geh([]);
  return erg;
}
const ERGEBNISSE = { muenze: ["K", "Z"], wuerfel: [1, 2, 3, 4, 5, 6] };
const zaehle = (f, x) => f.filter(y => y === x).length;
const EREIGNIS = {
  k0: f => zaehle(f, "K") === 0, k1: f => zaehle(f, "K") === 1, k2: f => zaehle(f, "K") === 2, k3: f => zaehle(f, "K") === 3,
  kmin2: f => zaehle(f, "K") >= 2, zmin1: f => zaehle(f, "Z") >= 1,
  "sechs-min1": f => f.includes(6), "sechs-keine": f => !f.includes(6), "drei-gleich": f => f.every(x => x === f[0]),
};
// Kugeln einzeln: „a3“ = vierte Kugel der ersten Farbe
const KUGEL = {
  aa: f => f.every(k => k[0] === "a"), bb: f => f.every(k => k[0] === "b"), aaa: f => f.every(k => k[0] === "a"), ab: f => f[0][0] === "a" && f[1][0] === "b",
  verschieden: f => f[0][0] !== f[1][0], gleich: f => f[0][0] === f[1][0],
};

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  if (a.art === "term") {
    let alle, g;
    if (d.kugeln) {
      const kugeln = [...Array.from({ length: d.kugeln[0] }, (_, i) => "a" + i), ...Array.from({ length: d.kugeln[1] }, (_, i) => "b" + i)];
      alle = folgen(kugeln, d.zuege, d.zuruecklegen);
      g = alle.filter(KUGEL[d.ereignis]).length;
      if (!a.text.includes(`${d.kugeln[0]} `) || !a.text.includes(`und ${d.kugeln[1]} `)) m.push("Kugeln nicht im Text");
      if (/ohne/.test(a.text) === d.zuruecklegen) m.push("Text sagt das Zurücklegen falsch");
    } else {
      alle = d.stufen.reduce((acc, s) => acc.flatMap(f => ERGEBNISSE[s].map(x => f.concat(x))), [[]]);
      g = alle.filter(EREIGNIS[d.ereignis]).length;
    }
    const soll = bt(B.bruch(BigInt(g), BigInt(alle.length)));
    if (soll !== a.antwortTerm) m.push(`Wahrscheinlichkeit ${a.antwortTerm} statt ${soll}: ${a.text}`);
    if (!LST_TERME.bewerte(a.antwortTerm, a).ok) m.push(`Lösung nicht in der Form: ${a.antwortTerm}`);
    return m;
  }
  let ok;
  if (d.pfade) ok = d.stufen.reduce((acc, s) => acc.flatMap(f => ERGEBNISSE[s].map(x => f.concat(x))), [[]]).length === a.antwort;
  else if (d.spanne) ok = d.werte.reduce((x, y) => Math.max(x, y)) - d.werte.reduce((x, y) => Math.min(x, y)) === a.antwort;
  else if (d.werte) ok = Math.round(a.antwort * 10) * d.werte.length === 10 * d.werte.reduce((x, y) => x + y, 0);
  else if (d.N && d.a !== undefined) ok = Math.round(a.antwort * 10) * d.N === d.a * 1000;
  else if (d.N) ok = a.antwort * d.q === d.N;
  else ok = d.bekannt.reduce((x, y) => x + y, 0) + a.antwort === d.mittel * d.n && d.bekannt.length === d.n - 1;
  if (!ok) m.push(`Antwort ${a.antwort} falsch: ${a.text}`);
  if (d.werte && !d.werte.every(w => a.text.includes(zt(w)))) m.push("Werte nicht im Text");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
