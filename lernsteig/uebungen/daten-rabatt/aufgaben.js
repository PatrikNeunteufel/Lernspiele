/* Übung „Mittelwert, Häufigkeit, Rabatt“ — MA.3.A.1, Stufen j, k, l. Aufgaben als Daten, ohne DOM.
   Geprüft an der Aufnahmeprüfung Gymnasium (i–k) und an der Einheitsaufnahmeprüfung (i–l), PA.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.3.A.1 (Begriffe, hier angewendet):
   j  arithmetisches Mittel; Währung (CHF, €, $)
   k  (OP) absolute und relative Häufigkeit; Wahrscheinlichkeit
   l  (GA) Rabatt, Brutto, Netto (Steigung und Zins übt „Prozent und Funktionswerte“). Lesart E2-1 a (LERN_Session24):
      beim Preis Bruttopreis − Rabatt = Nettopreis, beim Gewicht Bruttogewicht = Nettogewicht + Tara, brutto ist je
      100 % (Gewicht wie im Schweizer Skript oriesen.ch Prozent4S, S. 19: „Der Bruttowert ist grundsätzlich 100 %.“;
      Lesart des mathbuchs nicht nachgesehen)
   Annahmen, mit Patrik abzustimmen: Wechselkurse sind erfunden und stehen in der Aufgabe; Frankenbeträge gehen auf
   5 Rappen auf; Wahrscheinlichkeit als Dezimalzahl oder in Prozent, wie die Aufgabe verlangt. */
"use strict";

const UEBUNG = {
  id: "daten-rabatt",
  einleitung: "Rechne mit Daten, Häufigkeiten und Preisen.",
  stufen: {
    j: "Arithmetisches Mittel, Geld in andere Währungen umrechnen",
    k: "Absolute und relative Häufigkeit, Wahrscheinlichkeit",
    l: "Rabatt, Brutto und Netto (Preis und Gewicht)",
    challenge: "Fehlender Wert zum Mittelwert, Preis vor dem Rabatt",
  },
};

const MAL = " · ";
const z = (a, b) => LST.zufall(a, b);
const rund = x => Math.round(x * 1e9) / 1e9;
const dez = x => LST.dezimalText(rund(x));
const fr = x => (Number.isInteger(rund(x)) ? dez(x) : LST.dezimalText(rund(x), 2));
const auf5Rp = x => Math.abs(Math.round(x * 20) - x * 20) < 1e-6;

function fertig(stufe, typ, text, antwort, einheit, weg, daten) {
  const loes = einheit === "Fr." ? fr(antwort) : dez(antwort);
  return { art: "zahl", stufe, typ, text, einheit, antwort: rund(antwort), loesung: `${loes}${einheit ? " " + einheit : ""}`, weg, kennung: text, daten };
}

// ---------- j ----------
function stufeJ() {
  const typ = LST.waehle(["mittelwert", "mittelwert", "waehrung"]);
  if (typ === "mittelwert") {
    for (;;) {
      const n = z(4, 7), werte = Array.from({ length: n }, () => z(1, 60));
      const s = werte.reduce((a, b) => a + b, 0), m = s / n;
      if (!Number.isInteger(rund(m * 10))) continue; // höchstens eine Nachkommastelle
      return fertig("j", typ, `Arithmetisches Mittel von ${werte.join(", ")} =`, m, "", `(${werte.join(" + ")}) : ${n} = ${s} : ${n} = ${dez(m)}`, { werte });
    }
  }
  const [w, kurs] = LST.waehle([["€", LST.waehle([0.92, 0.94, 0.95, 0.96])], ["$", LST.waehle([0.8, 0.85, 0.88, 0.9])]]);
  const betrag = z(1, 60) * 5;
  if (LST.zufall(0, 1)) return fertig("j", typ, `Kurs: 1 ${w} = ${dez(kurs)} Fr. Wie viele Franken sind ${betrag} ${w}?`, betrag * kurs, "Fr.", `${betrag}${MAL}${dez(kurs)} = ${fr(betrag * kurs)}`, { betrag, kurs, richtung: "zu-fr" });
  const fr0 = betrag * kurs;
  return fertig("j", typ, `Kurs: 1 ${w} = ${dez(kurs)} Fr. Wie viele ${w} erhältst du für ${fr(fr0)} Fr.?`, betrag, w, `${fr(fr0)} : ${dez(kurs)} = ${betrag}`, { betrag, kurs, richtung: "von-fr", fr0 });
}

// ---------- k ----------
function stufeK() {
  const typ = LST.waehle(["relativ-prozent", "absolut", "wahrscheinlichkeit"]);
  if (typ === "relativ-prozent") {
    const n = LST.waehle([20, 25, 40, 50, 80, 100, 200, 250]), a = z(1, n - 1);
    return fertig("k", typ, `Von ${n} befragten Jugendlichen fahren ${a} mit dem Velo zur Schule. Relative Häufigkeit in % =`, a / n * 100, "%", `${a} : ${n} = ${dez(a / n)} = ${dez(a / n * 100)} %`, { a, n });
  }
  if (typ === "absolut") {
    const n = LST.waehle([20, 25, 40, 50, 80, 120, 200, 300, 400]), p = LST.waehle([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]);
    if (!Number.isInteger(n * p / 100)) return stufeK();
    return fertig("k", typ, `Bei ${n} Würfen zeigt der Würfel in ${p} % der Fälle eine Sechs. Absolute Häufigkeit =`, n * p / 100, "", `${p} % von ${n} = ${dez(n * p / 100)}`, { n, p });
  }
  const r = z(1, 9), b = z(1, 9), g = z(0, 6), tot = r + b + g;
  const p = r / tot;
  if (!Number.isInteger(rund(p * 1000))) return stufeK(); // aufgehend, höchstens drei Nachkommastellen
  return fertig("k", typ, `In einer Urne liegen ${r} rote, ${b} blaue${g ? ` und ${g} grüne` : ""} Kugeln. Wahrscheinlichkeit, blind eine rote zu ziehen (als Dezimalzahl) =`, p, "", `${r} : ${tot} = ${dez(p)}`, { r, b, g });
}

// ---------- l ----------
// E2-1 a: Preis (Bruttopreis − Rabatt = Nettopreis) und Gewicht (Bruttogewicht = Nettogewicht + Tara), je ein Viertel.
// Gewichte in kg mit höchstens einer Nachkommastelle; brutto ist 100 %.
const eineStelle = x => Number.isInteger(rund(x * 10));
function stufeL() {
  const typ = LST.waehle(["nettopreis", "rabatt-betrag", "nettogewicht", "bruttogewicht"]);
  for (;;) {
    if (typ === "nettopreis" || typ === "rabatt-betrag") {
      const preis = z(4, 400) * 5, p = LST.waehle([5, 10, 15, 20, 25, 30, 40, 50]);
      if (typ === "nettopreis") { const w = preis * (100 - p) / 100; if (!auf5Rp(w)) continue; return fertig("l", typ, `Ein Velo kostet brutto ${fr(preis)} Fr. Es gibt ${p} % Rabatt. Nettopreis =`, w, "Fr.", `${fr(preis)}${MAL}${dez((100 - p) / 100)} = ${fr(w)}`, { preis, p }); }
      const w = preis * p / 100; if (!auf5Rp(w)) continue;
      return fertig("l", typ, `${fr(preis)} Fr., davon ${p} % Rabatt. Wie viele Franken Rabatt?`, w, "Fr.", `${p} % von ${fr(preis)} = ${fr(w)}`, { preis, p });
    }
    const brutto = z(2, 400), t = LST.waehle([4, 5, 8, 10, 12, 15, 20, 25, 30]);
    const netto = brutto * (100 - t) / 100;
    if (!eineStelle(netto)) continue;
    if (typ === "nettogewicht") return fertig("l", typ, `Eine Sendung wiegt brutto ${brutto} kg, die Tara ist ${t} %. Nettogewicht =`, netto, "kg", `${brutto}${MAL}${dez((100 - t) / 100)} = ${dez(netto)}`, { brutto, t });
    return fertig("l", typ, `Bei ${t} % Tara wiegt eine Sendung netto ${dez(netto)} kg. Bruttogewicht =`, brutto, "kg", `${dez(netto)} : ${dez((100 - t) / 100)} = ${brutto}`, { netto: rund(netto), t });
  }
}

// ---------- Challenge ----------
function challenge() {
  if (LST.zufall(0, 1)) {
    const n = z(4, 6), m = z(10, 40), werte = Array.from({ length: n - 1 }, () => z(1, 60));
    const fehl = n * m - werte.reduce((a, b) => a + b, 0);
    if (fehl < 1 || fehl > 99) return challenge();
    return fertig("challenge", "fehlender-wert", `Das Mittel von ${n} Zahlen ist ${m}. ${n - 1} davon sind ${werte.join(", ")}. Die fehlende Zahl =`, fehl, "", `${n}${MAL}${m} = ${n * m}; ${n * m} − ${werte.reduce((a, b) => a + b, 0)} = ${fehl}`, { n, m, werte });
  }
  for (;;) {
    const vorher = z(4, 300) * 5, p = LST.waehle([10, 20, 25, 30, 40, 50]);
    const nachher = vorher * (100 - p) / 100;
    if (!auf5Rp(nachher)) continue;
    return fertig("challenge", "vor-rabatt", `Nach ${p} % Rabatt kostet eine Jacke ${fr(nachher)} Fr. Preis vor dem Rabatt =`, vorher, "Fr.", `${fr(nachher)} : ${dez((100 - p) / 100)} = ${fr(vorher)}`, { nachher, p });
  }
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "j") return stufeJ();
  if (stufe === "k") return stufeK();
  if (stufe === "l") return stufeL();
  if (stufe === "challenge") return challenge();
  throw new Error(`daten-rabatt: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    mittelwert: "Alle Werte addieren und durch die Anzahl der Werte teilen.",
    waehrung: "Der Kurs sagt, wie viele Franken eine Einheit der anderen Währung kostet. Mal oder geteilt?",
    "relativ-prozent": "Relative Häufigkeit: Anteil durch Gesamtzahl, dann mal hundert für Prozent.",
    absolut: "Absolute Häufigkeit: Wie viele Fälle sind das? Prozentsatz der Gesamtzahl.",
    wahrscheinlichkeit: "Günstige Fälle durch alle möglichen Fälle.",
    nettopreis: "Der Bruttopreis ist 100 %. Rabatt abziehen ergibt den Nettopreis, oder gleich mit dem verbleibenden Anteil rechnen.",
    "rabatt-betrag": "Der Rabatt ist der Prozentanteil des Preises.",
    nettogewicht: "Das Bruttogewicht ist 100 %. Bruttogewicht = Nettogewicht + Tara.",
    bruttogewicht: "Rückwärts: Das Nettogewicht ist weniger als 100 % des Bruttogewichts. Durch diesen Anteil teilen.",
    "fehlender-wert": "Mittel mal Anzahl ergibt die Summe aller Zahlen. Was fehlt noch?",
    "vor-rabatt": "Der neue Preis ist weniger als hundert Prozent des alten. Durch diesen Anteil teilen, nicht den Rabatt dazuzählen.",
  };
  return h[a.typ] || "Schritt für Schritt.";
}

const B = KERN.bruch, Z = x => B.vonZahl(x);
const summe = l => l.reduce((x, y) => x + y, 0);
/** Exakt nachrechnen aus Werten in der Form von a.daten (aus den Daten oder aus dem Text); null bei unbekanntem Typ. */
function sollAus(typ, d) {
  switch (typ) {
    case "mittelwert": return B.durch(Z(summe(d.werte)), Z(d.werte.length));
    case "waehrung": return d.richtung === "zu-fr" ? B.mal(Z(d.betrag), Z(d.kurs)) : B.durch(Z(d.fr0), Z(d.kurs));
    case "relativ-prozent": return B.mal(B.durch(Z(d.a), Z(d.n)), Z(100));
    case "absolut": return B.durch(B.mal(Z(d.n), Z(d.p)), Z(100));
    case "wahrscheinlichkeit": return B.durch(Z(d.r), Z(d.r + d.b + d.g));
    case "nettopreis": return B.durch(B.mal(Z(d.preis), Z(100 - d.p)), Z(100));
    case "rabatt-betrag": return B.durch(B.mal(Z(d.preis), Z(d.p)), Z(100));
    case "nettogewicht": return B.durch(B.mal(Z(d.brutto), Z(100 - d.t)), Z(100));
    case "bruttogewicht": return B.durch(B.mal(Z(d.netto), Z(100)), Z(100 - d.t));
    case "fehlender-wert": return B.minus(B.mal(Z(d.n), Z(d.m)), Z(summe(d.werte)));
    case "vor-rabatt": return B.durch(B.mal(Z(d.nachher), Z(100)), Z(100 - d.p));
    default: return null;
  }
}

/**
 * Den angezeigten Text lesen (Plan B2 Schritt 3, TD1 a), unabhängig vom Erzeuger: je Typ der Satz als Muster
 * (LST.zahlenImText, „#“ Zahl, „~“ Einheit, „#*“ Liste „12, 7, 30“). Die Richtung der Umrechnung folgt aus der Frage;
 * beim Umrechnen in die fremde Währung ist der Betrag der Frankenbetrag durch den Kurs. Liefert die Werte in der Form von
 * a.daten oder null.
 */
const muster = (text, m) => LST.zahlenImText(text, m);
const LESER = {
  mittelwert: a => { const z = muster(a.text, "Arithmetisches Mittel von #* ="); return z && { werte: z[0] }; },
  waehrung: a => {
    const zu = muster(a.text, "Kurs: 1 ~ = # Fr. Wie viele Franken sind # ~?");
    if (zu) return { betrag: zu[1], kurs: zu[0], richtung: "zu-fr" };
    const von = muster(a.text, "Kurs: 1 ~ = # Fr. Wie viele ~ erhältst du für # Fr.?");
    return von && { betrag: von[1] / von[0], kurs: von[0], richtung: "von-fr", fr0: von[1] };
  },
  "relativ-prozent": a => { const z = muster(a.text, "Von # befragten Jugendlichen fahren # mit dem Velo zur Schule. Relative Häufigkeit in % ="); return z && { a: z[1], n: z[0] }; },
  absolut: a => { const z = muster(a.text, "Bei # Würfen zeigt der Würfel in # % der Fälle eine Sechs. Absolute Häufigkeit ="); return z && { n: z[0], p: z[1] }; },
  wahrscheinlichkeit: a => {
    const ende = " Kugeln. Wahrscheinlichkeit, blind eine rote zu ziehen (als Dezimalzahl) =";
    const drei = muster(a.text, `In einer Urne liegen # rote, # blaue und # grüne${ende}`);
    if (drei) return { r: drei[0], b: drei[1], g: drei[2] };
    const zwei = muster(a.text, `In einer Urne liegen # rote, # blaue${ende}`);
    return zwei && { r: zwei[0], b: zwei[1], g: 0 };
  },
  nettopreis: a => { const z = muster(a.text, "Ein Velo kostet brutto # Fr. Es gibt # % Rabatt. Nettopreis ="); return z && { preis: z[0], p: z[1] }; },
  "rabatt-betrag": a => { const z = muster(a.text, "# Fr., davon # % Rabatt. Wie viele Franken Rabatt?"); return z && { preis: z[0], p: z[1] }; },
  nettogewicht: a => { const z = muster(a.text, "Eine Sendung wiegt brutto # kg, die Tara ist # %. Nettogewicht ="); return z && { brutto: z[0], t: z[1] }; },
  bruttogewicht: a => { const z = muster(a.text, "Bei # % Tara wiegt eine Sendung netto # kg. Bruttogewicht ="); return z && { netto: z[1], t: z[0] }; },
  "fehlender-wert": a => {
    const z = muster(a.text, "Das Mittel von # Zahlen ist #. # davon sind #*. Die fehlende Zahl =");
    // „n − 1 davon“: die genannte Anzahl muss zur Liste passen
    return z && z[2] === z[3].length ? { n: z[0], m: z[1], werte: z[3] } : null;
  },
  "vor-rabatt": a => { const z = muster(a.text, "Nach # % Rabatt kostet eine Jacke # Fr. Preis vor dem Rabatt ="); return z && { nachher: z[1], p: z[0] }; },
};
function liesText(a) {
  const l = LESER[a.typ];
  return (l && l(a)) || null;
}
/** Gleiche Werte: Zahlen auf Rundungsreste genau, Listen elementweise, Texte wörtlich. */
const gleichWert = (x, y) => (Array.isArray(x) ? Array.isArray(y) && x.length === y.length && x.every((v, i) => gleichWert(v, y[i]))
  : typeof x === "number" && typeof y === "number" ? Math.abs(x - y) < 1e-9 : x === y);

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  const soll = sollAus(a.typ, d);
  if (!soll) return [`unbekannter Typ ${a.typ}`];
  if (!B.gleich(soll, Z(a.antwort))) m.push(`Lösung ${a.antwort}, nachgerechnet ${B.text(soll)}: ${a.text}`);
  // Text gegen Prüfdaten (TD1 a): was der Jugendliche liest, sind dieselben Werte, und aus ihnen folgt dieselbe Lösung
  const t = liesText(a);
  if (!t) m.push(`Text folgt keinem Muster des Typs ${a.typ}: ${a.text}`);
  else {
    const anders = Object.keys(d).filter(k => !gleichWert(t[k], d[k]));
    if (anders.length) m.push(`Text zeigt ${anders.map(k => `${k} = ${t[k]}`).join(", ")}, Prüfdaten ${anders.map(k => `${k} = ${d[k]}`).join(", ")}: ${a.text}`);
    if (!B.gleich(sollAus(a.typ, t), Z(a.antwort))) m.push(`aus dem Text nachgerechnet ${B.text(sollAus(a.typ, t))}, Lösung ${a.antwort}: ${a.text}`);
  }
  if (!B.endlich(soll)) m.push(`Ergebnis geht nicht auf: ${a.text}`);
  if (a.einheit === "Fr." && !auf5Rp(a.antwort)) m.push(`Franken nicht auf 5 Rp.: ${a.loesung}`);
  if (a.typ === "wahrscheinlichkeit" && !(a.antwort > 0 && a.antwort < 1)) m.push("Wahrscheinlichkeit nicht zwischen 0 und 1");
  if (/\d{4}/.test(a.text.replace(/\.\d+/g, ""))) m.push(`Tausender ohne Apostroph: ${a.text}`);
  if ((a.loesung.split(" ")[0].split(".")[1] || "").length > 3) m.push(`mehr als drei Nachkommastellen: ${a.loesung}`);
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis, liesText };
