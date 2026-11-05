/* Übung „Aussagen prüfen“ — MA.1.B.2, Stufen h, j, k (Gymnasium und EAP prüfen h und j; PA). Ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/mathematik_zyklus3.md, MA.1.B.2:
   h  Aussagen zu arithmetischen Gesetzmässigkeiten begründen oder widerlegen
   j  (GA) algebraische Aussagen durch Einsetzen prüfen
   k  durch Verallgemeinern begründen; Term- und Äquivalenzumformungen prüfen
   Die Aussagen stehen in aussagen.js (Inhaltsliste, ungeprüft). Gefragt: „Welche Aussage stimmt?“ (genau eine wahr)
   oder „Welche Aussage stimmt nicht?“ (genau eine falsch). Ob eine Aussage stimmt, rechnet die Prüfung nach.
   Nicht in dieser Übung: Nachkommastellen bei Produkten erforschen (h), Äquivalenzumformungen mit Kontrollrechnung (i). */
"use strict";

const UEBUNG = {
  id: "aussagen",
  einleitung: "Prüfe die Aussagen: Setze Zahlen ein oder begründe allgemein.",
  stufen: {
    h: "Gerade, ungerade, teilbar: Gesetzmässigkeiten mit Zahlen",
    j: "Potenzen und Terme durch Einsetzen prüfen",
    k: "Termumformungen und Verallgemeinerungen prüfen",
    challenge: "Aussagen aus allen Stufen, auch: Welche stimmt nicht?",
  },
};

// Wahrheit einer Aussage, unabhängig vom Text: Terme exakt vergleichen oder alle Werte 1–40 einsetzen
function stimmt(p) {
  const T = LST_TERME;
  if (p.art === "gleich") return T.gleich(T.lies(p.links).poly, T.lies(p.rechts).poly);
  const poly = T.lies(p.term).poly;
  const vars = [...new Set([...poly.keys()].join("").match(/[a-z]/g) || [])];
  const werte = n => { // alle Belegungen der Variablen mit 1..n
    let b = [{}];
    for (const v of vars) b = b.flatMap(x => Array.from({ length: n }, (_, i) => Object.assign({}, x, { [v]: i + 1 })));
    return b;
  };
  for (const bel of werte(vars.length > 1 ? 20 : 40)) {
    let w = 0n;
    for (const [k, c] of poly) {
      let t = c.z;
      for (const [, v, e] of k.matchAll(/([a-z])(\d+)/g)) t *= BigInt(bel[v]) ** BigInt(e);
      if (c.n !== 1n) { if (t % c.n !== 0n) return false; t /= c.n; }
      w += t;
    }
    if (p.art === "teilbar" && w % BigInt(p.durch) !== 0n) return false;
    if (p.art === "gerade" && w % 2n !== 0n) return false;
    if (p.art === "ungerade" && (w % 2n + 2n) % 2n !== 1n) return false;
  }
  return true;
}

function aufgabe(stufe, liste, frageWahr) {
  const wahre = liste.filter(x => stimmt(x.pruefung)), falsche = liste.filter(x => !stimmt(x.pruefung));
  const [eins, drei] = frageWahr ? [wahre, falsche] : [falsche, wahre];
  const richtig = LST.waehle(eins);
  const andere = LST.mische(drei).slice(0, 3);
  const opt = LST.mische([richtig, ...andere]);
  const frage = frageWahr ? "Welche Aussage stimmt?" : "Welche Aussage stimmt nicht?";
  return {
    art: "auswahl", stufe, typ: frageWahr ? "wahr" : "falsch", text: frage, optionen: opt.map(x => x.text), richtig: opt.indexOf(richtig),
    loesung: richtig.text, weg: frageWahr ? `Es stimmt: ${richtig.text}` : `Es stimmt nicht: ${richtig.text}`,
    kennung: `${frage} | ${opt.map(x => x.text).sort().join(" | ")}`, daten: { pruefungen: opt.map(x => x.pruefung) },
  };
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "challenge") {
    const alle = AUSSAGEN.h.concat(AUSSAGEN.j, AUSSAGEN.k);
    return Object.assign(aufgabe("challenge", alle, LST.zufall(0, 1) === 1), { stufe: "challenge" });
  }
  if (!AUSSAGEN[stufe]) throw new Error(`aussagen: keine Stufe ${stufe}`);
  return aufgabe(stufe, AUSSAGEN[stufe], LST.zufall(0, 2) > 0);
}

function hinweis(a, gewaehlt) {
  return a.typ === "wahr"
    ? "Setze für die Variablen ein paar Zahlen ein (1, 2, 3). Ein einziges Gegenbeispiel widerlegt eine Aussage."
    : "Suche ein Gegenbeispiel: Eine Aussage, die für eine einzige Zahl nicht stimmt, ist falsch.";
}

function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  if (new Set(a.optionen).size !== 4) m.push("nicht vier verschiedene Aussagen");
  let w;
  try { w = a.daten.pruefungen.map(stimmt); } catch (e) { return [`Aussage nicht prüfbar: ${e.message}`]; }
  const gesucht = a.typ === "wahr";
  const treffer = w.map((x, i) => (x === gesucht ? i : -1)).filter(i => i >= 0);
  if (treffer.length !== 1) m.push(`${treffer.length} passende Aussagen statt einer: ${a.optionen.join(" | ")}`);
  if (treffer[0] !== a.richtig) m.push("richtige Antwort falsch markiert");
  if (/ß/.test(a.optionen.join(""))) m.push("ß im Text");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis, stimmt };
