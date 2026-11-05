/* Übung „Möglichkeiten zählen“ — MA.3.B.2, Stufen d, f, g. Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.3.B.2:
   d  alle Möglichkeiten systematisch aufschreiben, mit und ohne Wiederholung (Ziffern 1, 2, 3)
   f  (GA) Wahrscheinlichkeiten prüfen und begründen (zweimal Kopf = 0.25)
   g  kombinatorische Probleme vergleichen, Analogien finden (Handshakes bei 5 Personen)
   Stufe e (OP, Häufigkeiten experimentell bestimmen) passt nicht in eine kurze Aufgabe mit eindeutiger Lösung.
   Annahmen, mit Patrik abzustimmen: Wahrscheinlichkeit als vollständig gekürzter Bruch („1/4“); Münzen und Würfel
   sind fair; Diagonalen im Vieleck zählen als Analogie zu den Handshakes.
   pruefeAufgabe zählt jede Antwort unabhängig durch Aufzählen aller Fälle nach. */
"use strict";

const UEBUNG = {
  id: "kombinatorik",
  einleitung: "Zähle alle Möglichkeiten. Wahrscheinlichkeiten gibst du als gekürzten Bruch an, etwa 1/4.",
  stufen: {
    d: "Alle Möglichkeiten zählen, mit und ohne Wiederholung",
    f: "Wahrscheinlichkeit bei zwei Münzen oder Würfeln",
    g: "Probleme vergleichen: Handshakes, Turniere, Strecken",
    challenge: "Mit Bedingung zählen, Gegenereignis, rückwärts rechnen",
  },
};

const B = LST_BRUCH;
const z = (a, b) => LST.zufall(a, b);
const zt = n => LST.zahlText(n);
const bt = b => (b.n === 1n ? `${b.z}` : `${b.z}/${b.n}`);
const fakultaet = n => (n <= 1 ? 1 : n * fakultaet(n - 1));
const ZIFFERN = n => Array.from({ length: n }, (_, i) => i + 1);

function zahlAufgabe(stufe, typ, text, antwort, weg, daten) {
  return { art: "zahl", stufe, typ, text, antwort, loesung: zt(antwort), weg: `${weg} = ${zt(antwort)}`, kennung: text, daten };
}
function bruchAufgabe(stufe, typ, text, z0, n0, weg, daten) {
  const b = B.bruch(BigInt(z0), BigInt(n0));
  const loes = bt(b);
  return { art: "term", stufe, typ, text: `${text} (als gekürzter Bruch)`, antwortTerm: loes, form: "bruch", loesung: loes, tasten: ["/"],
    weg: weg.endsWith(loes) ? weg : `${weg} = ${loes}`, kennung: text, daten };
}

// ---------- d ----------
const WOERTER = ["AST", "OHR", "HUT", "ADEN", "HAUS", "ROSE", "MAUS", "ZELT", "KINO", "PILZ", "BROT", "TIER", "LAMPE", "BIRNE", "TANGO"];
const KLEIDER = [
  { wer: "Jan hat", dinge: ["Hosen", "T-Shirts", "Mützen"], zwei: "Wie viele Kombinationen aus einer Hose und einem T-Shirt kann er anziehen?",
    drei: "Wie viele Kombinationen aus einer Hose, einem T-Shirt und einer Mütze kann er anziehen?" },
  { wer: "Ein Restaurant bietet", dinge: ["Vorspeisen", "Hauptgänge", "Desserts"], zwei: "Wie viele verschiedene Menüs aus einer Vorspeise und einem Hauptgang gibt es?",
    drei: "Wie viele verschiedene Menüs aus einer Vorspeise, einem Hauptgang und einem Dessert gibt es?" },
  { wer: "Der Kiosk hat", dinge: ["Glacesorten", "Becher", "Saucen"], zwei: "Wie viele verschiedene Coupes aus einer Glacesorte und einem Becher sind möglich?",
    drei: "Wie viele verschiedene Coupes aus einer Glacesorte, einem Becher und einer Sauce sind möglich?" },
];

function stufeD() {
  const typ = LST.waehle(["ziffern-ohne", "ziffern-mit", "wort", "wort", "kleider", "kleider", "schloss"]);
  if (typ === "ziffern-ohne") {
    const n = z(3, 5), k = z(2, n), w = fakultaet(n) / fakultaet(n - k);
    return zahlAufgabe("d", typ, `Wie viele ${k}-stellige Zahlen kannst du aus den Ziffern ${ZIFFERN(n).join(", ")} bilden, wenn jede Ziffer höchstens einmal vorkommt?`,
      w, Array.from({ length: k }, (_, i) => n - i).join(" · "), { menge: n, laenge: k, wiederholung: false });
  }
  if (typ === "ziffern-mit") {
    const n = z(2, 4), k = z(2, 3), w = n ** k;
    return zahlAufgabe("d", typ, `Wie viele ${k}-stellige Zahlen kannst du aus den Ziffern ${ZIFFERN(n).join(", ")} bilden, wenn sich Ziffern wiederholen dürfen?`,
      w, Array(k).fill(n).join(" · "), { menge: n, laenge: k, wiederholung: true });
  }
  if (typ === "schloss") {
    const k = z(2, 4), w = 10 ** k;
    return zahlAufgabe("d", typ, `Ein Veloschloss hat ${k} Rädchen mit den Ziffern 0 bis 9. Wie viele verschiedene Codes gibt es?`,
      w, Array(k).fill(10).join(" · "), { menge: 10, laenge: k, wiederholung: true });
  }
  if (typ === "wort") {
    const wort = LST.waehle(WOERTER), n = wort.length;
    return zahlAufgabe("d", typ, `Wie viele verschiedene Anordnungen der Buchstaben ${wort.split("").join(", ")} gibt es (zum Beispiel ${wort})?`,
      fakultaet(n), ZIFFERN(n).reverse().join(" · "), { buchstaben: wort.split("") });
  }
  const k = LST.waehle(KLEIDER), drei = LST.zufall(0, 1) === 1;
  const mengen = [z(2, 6), z(2, 6)].concat(drei ? [z(2, 4)] : []);
  const teile = mengen.map((m, i) => `${m} ${k.dinge[i]}`);
  const satz = drei ? k.drei : k.zwei;
  const w = mengen.reduce((a, b) => a * b, 1);
  return zahlAufgabe("d", "kleider", `${k.wer} ${teile.slice(0, -1).join(", ")} und ${teile[teile.length - 1]}. ${satz}`, w, mengen.join(" · "), { mengen });
}

// ---------- f ----------
// Ereignisse: Name, Text, günstige Fälle, alle Fälle (für den Lösungsweg)
function stufeF() {
  const typ = LST.waehle(["muenzen", "wuerfel-summe", "wuerfel-summe", "wuerfel-gleich", "muenze-wuerfel"]);
  if (typ === "muenzen") {
    const [e, t, g] = LST.waehle([["kk", "zweimal Kopf", 1], ["kz-beliebig", "einmal Kopf und einmal Zahl (Reihenfolge egal)", 2], ["k-min1", "mindestens einmal Kopf", 3], ["zz", "zweimal Zahl", 1]]);
    return bruchAufgabe("f", typ, `Du wirfst zwei Münzen. Wie gross ist die Wahrscheinlichkeit für ${t}?`, g, 4, `günstig: ${g} von 4 gleich wahrscheinlichen Fällen: ${g}/4`, { stufen: ["muenze", "muenze"], ereignis: e });
  }
  if (typ === "wuerfel-summe") {
    const s = z(2, 12), g = 6 - Math.abs(s - 7);
    return bruchAufgabe("f", typ, `Du wirfst zwei Würfel. Wie gross ist die Wahrscheinlichkeit, dass die Augensumme ${s} ist?`, g, 36, `günstig: ${g} von 36 Fällen: ${g}/36`, { stufen: ["wuerfel", "wuerfel"], ereignis: "summe", wert: s });
  }
  if (typ === "wuerfel-gleich") {
    const [e, t, g] = LST.waehle([["pasch", "zweimal dieselbe Augenzahl", 6], ["sechs-sechs", "zweimal eine Sechs", 1], ["verschieden", "zwei verschiedene Augenzahlen", 30]]);
    return bruchAufgabe("f", typ, `Du wirfst zwei Würfel. Wie gross ist die Wahrscheinlichkeit für ${t}?`, g, 36, `günstig: ${g} von 36 Fällen: ${g}/36`, { stufen: ["wuerfel", "wuerfel"], ereignis: e });
  }
  const [e, t, g] = LST.waehle([["k-gerade", "Kopf und eine gerade Augenzahl", 3], ["k-sechs", "Kopf und eine Sechs", 1], ["z-min5", "Zahl und mindestens eine Fünf", 2], ["z-max2", "Zahl und höchstens eine Zwei", 2], ["k-ungerade", "Kopf und eine ungerade Augenzahl", 3]]);
  return bruchAufgabe("f", "muenze-wuerfel", `Du wirfst eine Münze und einen Würfel. Wie gross ist die Wahrscheinlichkeit für ${t}?`, g, 12, `günstig: ${g} von 2 · 6 = 12 Fällen: ${g}/12`, { stufen: ["muenze", "wuerfel"], ereignis: e });
}

// ---------- g ----------
function stufeG() {
  const typ = LST.waehle(["handshake", "turnier-hin", "turnier-rueck", "strecken", "diagonalen", "teams"]);
  const n = typ === "diagonalen" ? z(4, 15) : z(4, 25);
  const paare = n * (n - 1) / 2;
  if (typ === "handshake") return zahlAufgabe("g", typ, `${n} Personen treffen sich. Jede gibt jeder anderen genau einmal die Hand. Wie viele Handshakes sind das?`, paare, `${n} · ${n - 1} : 2`, { n, art: "paare" });
  if (typ === "turnier-hin") return zahlAufgabe("g", typ, `An einem Turnier spielen ${n} Teams, jedes genau einmal gegen jedes andere. Wie viele Spiele gibt es?`, paare, `${n} · ${n - 1} : 2`, { n, art: "paare" });
  if (typ === "turnier-rueck") return zahlAufgabe("g", typ, `In einer Liga spielen ${n} Teams, jedes gegen jedes andere einmal zu Hause und einmal auswärts. Wie viele Spiele gibt es?`, n * (n - 1), `${n} · ${n - 1}`, { n, art: "geordnet" });
  if (typ === "strecken") return zahlAufgabe("g", typ, `${n} Punkte liegen so, dass nie drei auf einer Geraden liegen. Wie viele Strecken verbinden je zwei Punkte?`, paare, `${n} · ${n - 1} : 2`, { n, art: "paare" });
  if (typ === "teams") return zahlAufgabe("g", typ, `Aus ${n} Personen soll ein Zweierteam gebildet werden. Wie viele verschiedene Zweierteams sind möglich?`, paare, `${n} · ${n - 1} : 2`, { n, art: "paare" });
  return zahlAufgabe("g", typ, `Wie viele Diagonalen hat ein ${n}-Eck?`, n * (n - 3) / 2, `${n} · ${n - 3} : 2`, { n, art: "diagonalen" });
}

// ---------- Challenge ----------
function challenge() {
  const typ = LST.waehle(["gerade", "gegen", "summe-min", "rueckwaerts"]);
  if (typ === "gerade") {
    const n = z(4, 6), gerade = Math.floor(n / 2), w = gerade * (n - 1) * (n - 2);
    return zahlAufgabe("challenge", typ, `Wie viele dreistellige gerade Zahlen kannst du aus den Ziffern ${ZIFFERN(n).join(", ")} bilden, wenn jede Ziffer höchstens einmal vorkommt?`,
      w, `Einer gerade: ${gerade} Möglichkeiten, dann ${n - 1} · ${n - 2}: ${gerade} · ${n - 1} · ${n - 2}`, { menge: n, laenge: 3, wiederholung: false, bedingung: "gerade" });
  }
  if (typ === "gegen") {
    const [e, t, g, weg] = LST.waehle([
      ["sechs-min1", "mindestens eine Sechs", 11, "Gegenereignis keine Sechs: 25/36, also 1 − 25/36 = 11/36"],
      ["verschieden", "zwei verschiedene Augenzahlen", 30, "Gegenereignis Pasch: 6/36, also 1 − 6/36 = 30/36"],
      ["ungerade-min1", "mindestens eine ungerade Augenzahl", 27, "Gegenereignis beide gerade: 9/36, also 1 − 9/36 = 27/36"],
    ]);
    return bruchAufgabe("challenge", typ, `Du wirfst zwei Würfel. Wie gross ist die Wahrscheinlichkeit für ${t}?`, g, 36, weg, { stufen: ["wuerfel", "wuerfel"], ereignis: e });
  }
  if (typ === "summe-min") {
    const s = z(8, 11);
    let g = 0; for (let t = s; t <= 12; t++) g += 6 - Math.abs(t - 7);
    return bruchAufgabe("challenge", typ, `Du wirfst zwei Würfel. Wie gross ist die Wahrscheinlichkeit, dass die Augensumme mindestens ${s} ist?`, g, 36,
      `Summen ${s} bis 12 zusammen: ${g} von 36 Fällen: ${g}/36`, { stufen: ["wuerfel", "wuerfel"], ereignis: "summe-min", wert: s });
  }
  const n = z(5, 20), h = n * (n - 1) / 2;
  return zahlAufgabe("challenge", typ, `Bei einem Treffen gibt jede Person jeder anderen genau einmal die Hand. Es sind ${h} Handshakes. Wie viele Personen sind es?`,
    n, `n · (n − 1) : 2 = ${h}, also n · (n − 1) = ${2 * h} = ${n} · ${n - 1}`, { handshakes: h, art: "rueckwaerts" });
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "d") return stufeD();
  if (stufe === "f") return stufeF();
  if (stufe === "g") return stufeG();
  if (stufe === "challenge") return challenge();
  throw new Error(`kombinatorik: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    "ziffern-ohne": "Für die erste Stelle hast du alle Ziffern zur Wahl, für jede weitere eine weniger. Multipliziere.",
    "ziffern-mit": "Jede Stelle hat wieder alle Ziffern zur Wahl. Multipliziere so oft, wie es Stellen gibt.",
    schloss: "Jedes Rädchen hat zehn Möglichkeiten, unabhängig von den anderen.",
    wort: "Für den ersten Platz hast du alle Buchstaben, für den zweiten einen weniger, und so weiter.",
    kleider: "Zu jeder Wahl im ersten Teil passt jede Wahl im zweiten: Die Anzahlen werden multipliziert.",
    muenzen: "Schreibe alle Fälle auf: KK, KZ, ZK, ZZ. Wie viele davon passen?",
    "wuerfel-summe": "Zwei Würfel geben sechs mal sechs gleich wahrscheinliche Fälle. Zähle die Paare mit dieser Summe.",
    "wuerfel-gleich": "Zwei Würfel geben sechs mal sechs gleich wahrscheinliche Fälle. Zähle die passenden Paare.",
    "muenze-wuerfel": "Münze und Würfel geben zwei mal sechs Fälle. Zähle die passenden.",
    handshake: "Jede Person gibt allen anderen die Hand. So zählst du jeden Handshake doppelt.",
    "turnier-hin": "Jedes Team spielt gegen alle anderen. So zählst du jedes Spiel doppelt.",
    "turnier-rueck": "Jedes Team spielt gegen jedes andere zweimal: Hier zählt jede Paarung doppelt.",
    strecken: "Wie bei den Handshakes: Jeder Punkt mit jedem anderen, dann doppelt Gezähltes abziehen.",
    teams: "Wie bei den Handshakes: Jede Person mit jeder anderen, jedes Team doppelt gezählt.",
    diagonalen: "Von jeder Ecke gehen Diagonalen zu allen Ecken ausser sich selbst und den beiden Nachbarn. Jede Diagonale zählst du doppelt.",
    gerade: "Beginne mit der Einerstelle: Sie muss gerade sein. Dann die übrigen Stellen ohne die gewählte Ziffer.",
    gegen: "Rechne mit dem Gegenereignis: eins minus die Wahrscheinlichkeit, dass es nicht eintritt.",
    "summe-min": "Zähle die Paare für jede Summe ab dieser Zahl bis zwölf und addiere.",
    rueckwaerts: "Die Anzahl Personen mal eins weniger ergibt das Doppelte der Handshakes.",
  };
  return h[a.typ] || "Schreibe die Möglichkeiten systematisch auf.";
}

// ---------- Prüfung: alles durch Aufzählen nachzählen ----------
function folgen(menge, laenge, wiederholung) {
  const erg = [];
  const geh = f => {
    if (f.length === laenge) { erg.push(f); return; }
    for (const x of menge) if (wiederholung || !f.includes(x)) geh(f.concat(x));
  };
  geh([]);
  return erg;
}
const ERGEBNISSE = { muenze: ["K", "Z"], wuerfel: [1, 2, 3, 4, 5, 6] };
const EREIGNIS = {
  kk: f => f[0] === "K" && f[1] === "K", zz: f => f[0] === "Z" && f[1] === "Z", "kz-beliebig": f => f[0] !== f[1], "k-min1": f => f.includes("K"),
  summe: (f, w) => f[0] + f[1] === w, "summe-min": (f, w) => f[0] + f[1] >= w,
  pasch: f => f[0] === f[1], "sechs-sechs": f => f[0] === 6 && f[1] === 6, verschieden: f => f[0] !== f[1],
  "k-gerade": f => f[0] === "K" && f[1] % 2 === 0, "k-sechs": f => f[0] === "K" && f[1] === 6, "z-min5": f => f[0] === "Z" && f[1] >= 5,
  "z-max2": f => f[0] === "Z" && f[1] <= 2, "k-ungerade": f => f[0] === "K" && f[1] % 2 === 1,
  "sechs-min1": f => f.includes(6), "ungerade-min1": f => f.some(x => x % 2 === 1),
};
function produkt(stufen) { return stufen.reduce((acc, s) => acc.flatMap(f => ERGEBNISSE[s].map(x => f.concat(x))), [[]]); }

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  let soll;
  if (a.art === "term") {
    const alle = produkt(d.stufen);
    const p = EREIGNIS[d.ereignis];
    if (!p) return [`unbekanntes Ereignis ${d.ereignis}`];
    const g = alle.filter(f => p(f, d.wert)).length;
    const b = B.bruch(BigInt(g), BigInt(alle.length));
    if (bt(b) !== a.antwortTerm) m.push(`Wahrscheinlichkeit ${a.antwortTerm} statt ${bt(b)}: ${a.text}`);
    if (!LST_TERME.bewerte(a.antwortTerm, a).ok) m.push(`Lösung nicht in der Form: ${a.antwortTerm}`);
    return m;
  }
  if (d.buchstaben) soll = new Set(folgen(d.buchstaben, d.buchstaben.length, false).map(f => f.join(""))).size;
  else if (d.mengen) soll = d.mengen.reduce((acc, k) => acc.flatMap(f => Array.from({ length: k }, (_, i) => f.concat(i))), [[]]).length;
  else if (d.menge) {
    const menge = d.menge === 10 ? Array.from({ length: 10 }, (_, i) => i) : ZIFFERN(d.menge);
    let f = folgen(menge, d.laenge, d.wiederholung);
    if (d.bedingung === "gerade") f = f.filter(x => x[x.length - 1] % 2 === 0);
    soll = f.length;
    if (!a.text.includes(d.menge === 10 ? "0 bis 9" : menge.join(", "))) m.push("Ziffern nicht im Text");
  } else if (d.art === "rueckwaerts") {
    soll = null;
    for (let n = 2; n < 100 && soll === null; n++) if (folgen(ZIFFERN(n), 2, false).length / 2 === d.handshakes) soll = n;
    if (!a.text.includes(`${d.handshakes} Handshakes`)) m.push("Handshakes nicht im Text");
  } else {
    const paare = folgen(ZIFFERN(d.n), 2, false); // geordnete Paare verschiedener Elemente
    if (d.art === "paare") soll = paare.length / 2;
    else if (d.art === "geordnet") soll = paare.length;
    else soll = paare.filter(([i, j]) => { const ab = Math.abs(i - j); return ab !== 1 && ab !== d.n - 1; }).length / 2;
    if (!a.text.includes(`${d.n}`)) m.push("n nicht im Text");
  }
  if (soll !== a.antwort) m.push(`Antwort ${a.antwort} statt ${soll}: ${a.text}`);
  if (a.loesung !== LST.zahlText(a.antwort)) m.push(`Schreibweise der Lösung: ${a.loesung}`);
  if (a.stufe === "d" && a.antwort > 10000) m.push("Stufe d: mehr als 10'000 Möglichkeiten");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
