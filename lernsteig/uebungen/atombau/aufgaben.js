/* Übung „Atombau und Periodensystem“ — NT.3.2, Stufen a, c, d. Aufgaben als Daten, ohne DOM.
   Inhalte sinngemäss nach docs/lernsteig/lehrplan/nt_zyklus3.md, NT.3.2:
   a  Informationen zu den Elementen aus dem PSE herauslesen. VI: Metalle, Nichtmetalle, Edelgase
   c  Atome mit dem Kern-Hülle-Modell darstellen, Protonen und Neutronen als Kernbausteine. VI: Ordnungszahl, Atommasse,
      Hauptgruppen; Isotop
   d  Zusammenhänge zwischen Schalenmodell und PSE. VI: Schalenmodell, Wertigkeit, Edelgasregel
   Stufe b (GA, OP: Reaktion im Teilchenmodell, Energiediagramme) braucht Bilder und folgt später; e (Bindungsarten)
   ebenso. Elementdaten in pse.js (ungeprüft). Annahmen, mit dem Lehrmittel abzugleichen: Massenzahl statt Atommasse
   (ganzzahlig); Schalen für die Elemente 1 bis 20 mit 2, 8, 8, 2 Plätzen; Ionen nach der Edelgasregel für die
   Hauptgruppen I bis III und V bis VII, ohne Be²⁺ und B³⁺ (Plan E 6: keine einfachen Ionen in der Schulchemie).
   E6-1 (LERN_Session24): Bor und Silicium sind Halbmetalle; Stufe a fragt nur Metall, Nichtmetall, Edelgas (Lehrplan
   NT.3.2.a) und lässt sie aus, die Challenge fragt auch nach Halbmetallen (B, Si, Ge, As, Sb, Te). */
"use strict";

const UEBUNG = {
  id: "atombau",
  einleitung: "Lies aus dem Periodensystem: Elemente 1 bis 20.",
  stufen: {
    a: "Metall, Nichtmetall oder Edelgas? Welches der drei ist …?",
    c: "Protonen, Neutronen, Elektronen; Isotope",
    d: "Schalenmodell, Aussenelektronen, Edelgasregel",
    challenge: "Ionen nach der Edelgasregel; Metall, Nichtmetall, Halbmetall oder Edelgas?",
  },
};

const ARTEN = ["Metall", "Nichtmetall", "Edelgas"];
const ARTEN4 = ["Metall", "Nichtmetall", "Halbmetall", "Edelgas"]; // Challenge (E6-1)
const ARTID = { Metall: "metall", Nichtmetall: "nichtmetall", Halbmetall: "halbmetall", Edelgas: "edelgas" };
const el = () => LST.waehle(PSE.elemente);
// Stufe a nach dem Lehrplan: nur Metalle, Nichtmetalle, Edelgase (E6-1 a)
const OHNE_HALBMETALL = () => PSE.elemente.filter(x => x.art !== "halbmetall");
// kein einfaches Ion: Wasserstoff, Edelgase, Halbmetalle, Hauptgruppe IV, Beryllium (Plan E 6)
const OHNE_ION = new Set([4]);
const nenn = e => `${e.name} (${e.symbol}, Ordnungszahl ${e.oz})`;

function zahl(stufe, typ, text, antwort, weg, daten) {
  const t = (typ === "ladung" && antwort > 0 ? "+" : "") + LST.zahlText(antwort); // Minus als „−“ (MZ1 a), Ladung mit Vorzeichen
  return { art: "zahl", stufe, typ, text, antwort, loesung: t, weg: `${weg} = ${t}`, kennung: text, daten };
}

// Vorrat nach VF1 a (Plan E 9, LERN_Session21): dazu die Umkehrfrage „Welches dieser Elemente ist ein …?“ mit drei
// Elementen aus derselben Liste, genau eines von der gesuchten Art — keine neuen Elemente, keine neuen Angaben.
const ART_TEXT = { metall: "ein Metall", nichtmetall: "ein Nichtmetall", edelgas: "ein Edelgas" };
function stufeAWelches() {
  const gesucht = LST.waehle(Object.keys(ART_TEXT));
  const treffer = LST.waehle(OHNE_HALBMETALL().filter(x => x.art === gesucht));
  const andere = OHNE_HALBMETALL().filter(x => x.art !== gesucht);
  const zwei = []; while (zwei.length < 2) { const x = LST.waehle(andere); if (!zwei.includes(x)) zwei.push(x); }
  const liste = zwei.slice(); liste.splice(LST.zufall(0, 2), 0, treffer); // der Treffer an zufälliger Stelle
  const optionen = liste.map(x => `${x.name} (${x.symbol})`);
  const richtig = liste.indexOf(treffer);
  return { art: "auswahl", stufe: "a", typ: "welches", text: `Welches dieser Elemente ist ${ART_TEXT[gesucht]}?`, optionen, richtig,
    loesung: optionen[richtig], weg: `${treffer.name}: ${ART_TEXT[gesucht]}`, kennung: `${gesucht}:${liste.map(x => x.oz).join(",")}`,
    daten: { gesucht, oz: liste.map(x => x.oz) } };
}
function stufeA() {
  if (LST.zufall(0, 1)) return stufeAWelches();
  const e = LST.waehle(OHNE_HALBMETALL());
  const optionen = ARTEN.slice();
  const richtig = optionen.findIndex(o => ARTID[o] === e.art);
  return { art: "auswahl", stufe: "a", typ: "art", text: `Ist ${e.name} (${e.symbol}) ein Metall, ein Nichtmetall oder ein Edelgas?`, optionen, richtig,
    loesung: optionen[richtig], weg: `${e.name}: ${optionen[richtig]}`, kennung: e.symbol, daten: { oz: e.oz } };
}

function stufeC() {
  const typ = LST.waehle(["protonen", "elektronen", "neutronen", "neutronen", "isotop"]);
  if (typ === "isotop") {
    const i = LST.waehle(PSE.isotope), e = PSE.elemente.find(x => x.oz === i.oz);
    return zahl("c", typ, `Das Isotop ${e.name}-${i.masse} hat die Massenzahl ${i.masse}. Wie viele Neutronen hat es im Kern?`, i.masse - e.oz, `${i.masse} − ${e.oz}`, { oz: e.oz, masse: i.masse });
  }
  const e = el();
  if (typ === "protonen") return zahl("c", typ, `Wie viele Protonen hat ein Atom ${nenn(e).replace(/, Ordnungszahl \d+/, "")}?`, e.oz, `Ordnungszahl von ${e.symbol}`, { oz: e.oz });
  if (typ === "elektronen") return zahl("c", typ, `Wie viele Elektronen hat ein ungeladenes Atom ${e.name} (${e.symbol})?`, e.oz, `so viele wie Protonen: Ordnungszahl`, { oz: e.oz });
  return zahl("c", typ, `${nenn(e)} hat die Massenzahl ${e.masse}. Wie viele Neutronen hat der Kern?`, e.masse - e.oz, `${e.masse} − ${e.oz}`, { oz: e.oz, masse: e.masse });
}

// Schalen nach Regel (2, 8, 8, …) — Generator; die Prüfung rechnet unabhängig über Perioden nach
const EDELGASE = [2, 10, 18]; // Helium, Neon, Argon
function schalen(oz) { const plaetze = [2, 8, 8, 2]; const s = []; let rest = oz; for (const p of plaetze) { if (rest <= 0) break; s.push(Math.min(p, rest)); rest -= p; } return s; }

function stufeD() {
  const typ = LST.waehle(["aussen", "aussen", "schalen", "gruppe"]);
  const e = el();
  const s = schalen(e.oz);
  if (typ === "aussen") return zahl("d", typ, `Wie viele Aussenelektronen hat ein Atom ${e.name} (${e.symbol}, Ordnungszahl ${e.oz})?`, s[s.length - 1], `Besetzung ${s.join(", ")}, auf der äussersten Schale`, { oz: e.oz, was: "aussen" });
  if (typ === "schalen") return zahl("d", typ, `Auf wie viele Schalen verteilen sich die Elektronen von ${e.name} (${e.symbol}, Ordnungszahl ${e.oz})?`, s.length, `Besetzung ${s.join(", ")}, Anzahl Schalen`, { oz: e.oz, was: "anzahl" });
  const hg = e.art === "edelgas" ? 8 : s[s.length - 1];
  return zahl("d", typ, `In welcher Hauptgruppe steht ${e.name} (${e.symbol}, Ordnungszahl ${e.oz})? Gib die Nummer an.`, hg, e.art === "edelgas" ? "Edelgase: Hauptgruppe VIII" : `${s[s.length - 1]} Aussenelektronen, Hauptgruppe`, { oz: e.oz, was: "gruppe" });
}

function challenge() {
  // E6-1: ein Viertel der Challenge fragt nach der Art mit Halbmetall, über die Elemente 1 bis 20 und die weiteren Halbmetalle
  if (LST.zufall(1, 4) === 1) {
    const e = LST.waehle(PSE.elemente.concat(PSE.weitere));
    const optionen = ARTEN4.slice();
    return { art: "auswahl", stufe: "challenge", typ: "halbmetall", text: `Ist ${e.name} (${e.symbol}) ein Metall, ein Nichtmetall, ein Halbmetall oder ein Edelgas?`,
      optionen, richtig: optionen.findIndex(o => ARTID[o] === e.art), loesung: optionen.find(o => ARTID[o] === e.art), weg: `${e.name}: ${optionen.find(o => ARTID[o] === e.art)}`,
      kennung: `halbmetall:${e.symbol}`, daten: { oz: e.oz } };
  }
  for (;;) {
    const e = el(), s = schalen(e.oz), a = s[s.length - 1];
    if (e.art === "edelgas" || e.art === "halbmetall" || e.oz === 1 || a === 4 || OHNE_ION.has(e.oz)) continue;
    const ladung = a <= 3 ? a : a - 8;
    // Vorrat nach VF1 a (E 9): dazu, welches Edelgas gleich viele Elektronen hat wie das Ion (Edelgasregel)
    const typ = LST.waehle(["ladung", "ionen-elektronen", "edelgas-gleich"]);
    if (typ === "edelgas-gleich") {
      const optionen = EDELGASE.map(o => PSE.elemente.find(x => x.oz === o).name);
      const ziel = PSE.elemente.find(x => x.oz === e.oz - ladung);
      return { art: "auswahl", stufe: "challenge", typ, text: `Das Ion von ${e.name} (${e.symbol}, Ordnungszahl ${e.oz}) hat nach der Edelgasregel gleich viele Elektronen wie ein Edelgas. Wie heisst es?`,
        optionen, richtig: optionen.indexOf(ziel.name), loesung: ziel.name, weg: `${e.oz} ${ladung > 0 ? "−" : "+"} ${Math.abs(ladung)} = ${ziel.oz} Elektronen wie ${ziel.name}`,
        kennung: `edelgas:${e.oz}`, daten: { oz: e.oz, was: "edelgas" } };
    }
    if (typ === "ladung") return zahl("challenge", typ, `Welche Ladung hat das Ion von ${e.name} (${e.symbol}, Ordnungszahl ${e.oz}) nach der Edelgasregel? Gib die Zahl mit Vorzeichen an.`,
      ladung, `${a} Aussenelektronen: ${ladung > 0 ? `${a} abgeben` : `${8 - a} aufnehmen`}, Ladung`, { oz: e.oz, was: "ladung" });
    return zahl("challenge", typ, `Wie viele Elektronen hat das Ion von ${e.name} (${e.symbol}, Ordnungszahl ${e.oz}) nach der Edelgasregel?`,
      e.oz - ladung, `${e.oz} ${ladung > 0 ? "−" : "+"} ${Math.abs(ladung)}`, { oz: e.oz, was: "ionen-e" });
  }
}

function aufgabeErzeugen(stufe, niveau) {
  if (stufe === "a") return stufeA();
  if (stufe === "c") return stufeC();
  if (stufe === "d") return stufeD();
  if (stufe === "challenge") return challenge();
  throw new Error(`atombau: keine Stufe ${stufe}`);
}

function hinweis(a, eingabe) {
  const h = {
    art: "Metalle stehen links und in der Mitte, Nichtmetalle rechts oben (Wasserstoff aber ganz links oben), Edelgase ganz rechts.",
    halbmetall: "Metalle links und in der Mitte, Nichtmetalle rechts oben (Wasserstoff ganz links oben), Edelgase ganz rechts; Halbmetalle an der Treppenlinie dazwischen.",
    protonen: "Die Ordnungszahl sagt, wie viele Protonen im Kern sind.",
    elektronen: "Ein ungeladenes Atom hat gleich viele Elektronen wie Protonen.",
    neutronen: "Massenzahl minus Ordnungszahl gibt die Neutronen.",
    isotop: "Isotope haben gleich viele Protonen, aber verschieden viele Neutronen: Massenzahl minus Ordnungszahl.",
    aussen: "Verteile die Elektronen: erste Schale höchstens zwei, dann je acht. Zähle die auf der äussersten.",
    schalen: "Erste Schale höchstens zwei, die nächsten je acht. Wie viele Schalen werden gebraucht?",
    gruppe: "Die Hauptgruppe entspricht der Zahl der Aussenelektronen; Edelgase stehen in der letzten.",
    ladung: "Wenige Aussenelektronen werden abgegeben (positiv), fast volle Schalen nehmen auf (negativ).",
    "ionen-elektronen": "Zuerst die Ladung nach der Edelgasregel; abgegebene Elektronen fehlen, aufgenommene kommen dazu.",
    welches: "Metalle stehen links und in der Mitte, Nichtmetalle rechts oben (Wasserstoff aber ganz links oben), Edelgase ganz rechts. Prüfe jedes der drei.",
    "edelgas-gleich": "Zuerst die Elektronen des Ions nach der Edelgasregel; dann das Edelgas mit dieser Ordnungszahl.",
  };
  return h[a.typ] || "Schau im Periodensystem nach.";
}

// Prüfung: Periode und Stellung unabhängig vom Generator (Periodenlängen 2, 8, 8, …)
function lage(oz) { const laengen = [2, 8, 8, 18]; let start = 0; for (let p = 0; p < laengen.length; p++) { if (oz <= start + laengen[p]) return { periode: p + 1, stelle: oz - start, laenge: laengen[p] }; start += laengen[p]; } }
function pruefeAufgabe(a, stufe, niveau) {
  const m = [];
  if (a.stufe !== stufe) m.push(`Aufgabe aus Stufe ${a.stufe}, verlangt ${stufe}`);
  const d = a.daten;
  const edelLage = oz => { const l = lage(oz); return (l.periode === 1 && l.stelle === 2) || (l.periode > 1 && l.stelle === 8); };
  if (a.typ === "welches") {
    // aus dem Text: die gesuchte Art und die drei Elemente; je Element die Art aus der Liste und aus der Stellung
    const gesucht = Object.keys(ART_TEXT).find(k => a.text === `Welches dieser Elemente ist ${ART_TEXT[k]}?`);
    if (!gesucht || gesucht !== d.gesucht) m.push(`Text nennt ${gesucht}, Daten ${d.gesucht}: ${a.text}`);
    const els = a.optionen.map(o => PSE.elemente.find(x => `${x.name} (${x.symbol})` === o));
    if (els.some(x => !x)) return m.concat(`Option nicht in pse.js: ${a.optionen.join(", ")}`);
    if (els.some(x => x.art === "halbmetall")) m.push(`Halbmetall in Stufe a (E6-1 a): ${a.optionen.join(", ")}`);
    for (const x of els) if (edelLage(x.oz) !== (x.art === "edelgas")) m.push(`Edelgas-Kennzeichnung passt nicht zur Stellung: ${x.name}`);
    const passend = els.filter(x => x.art === gesucht);
    if (passend.length !== 1) m.push(`${passend.length} Optionen sind ${ART_TEXT[gesucht]}: ${a.optionen.join(", ")}`);
    else if (els[a.richtig] !== passend[0]) m.push(`Auswahl ${a.optionen[a.richtig]} statt ${passend[0].name}`);
    if (JSON.stringify(els.map(x => x.oz)) !== JSON.stringify(d.oz)) m.push("Optionen passen nicht zu den Daten");
    return m;
  }
  if (a.typ === "halbmetall") {
    // Challenge (E6-1): Art mit vier Antworten, Elemente 1 bis 20 und die weiteren Halbmetalle
    const e = PSE.elemente.concat(PSE.weitere).find(x => x.oz === d.oz);
    if (!e) return m.concat("Element fehlt in pse.js");
    if (a.text !== `Ist ${e.name} (${e.symbol}) ein Metall, ein Nichtmetall, ein Halbmetall oder ein Edelgas?`) m.push(`Text passt nicht zu den Daten: ${a.text}`);
    if (a.optionen.join(",") !== ARTEN4.join(",")) m.push(`Optionen ${a.optionen.join(", ")}`);
    if (ARTID[a.optionen[a.richtig]] !== e.art) m.push(`Auswahl passt nicht zur Liste: ${e.name}`);
    if (e.oz <= 20 && edelLage(e.oz) !== (e.art === "edelgas")) m.push(`Edelgas-Kennzeichnung passt nicht zur Stellung: ${e.name}`);
    return m;
  }
  const e = PSE.elemente.find(x => x.oz === d.oz);
  if (!e) return ["Element fehlt in pse.js"];
  const l = lage(d.oz);
  // Aussenelektronen = Stellung in der Periode (Hauptgruppenelemente 1 bis 20; K und Ca am Anfang von Periode 4)
  const aussen = l.stelle;
  // kein einfaches Ion (Plan E 6): Wasserstoff, Edelgase, Halbmetalle, Hauptgruppe IV, Beryllium
  if (["ladung", "ionen-elektronen", "edelgas-gleich"].includes(a.typ) && (d.oz === 1 || d.oz === 4 || aussen === 4 || e.art === "edelgas" || e.art === "halbmetall")) {
    m.push(`Ion von ${e.name} in der Challenge (kein einfaches Ion, Plan E 6)`);
  }
  if (a.typ === "art" && e.art === "halbmetall") m.push(`Halbmetall in Stufe a (E6-1 a): ${e.name}`);
  if (a.typ === "edelgas-gleich") {
    // Elektronen des Ions aus der Stellung; das Edelgas mit dieser Ordnungszahl, aus dem Text gelesen
    const r = /^Das Ion von (\S+) \((\S+), Ordnungszahl (\d+)\) hat nach der Edelgasregel gleich viele Elektronen wie ein Edelgas\. Wie heisst es\?$/.exec(a.text);
    if (!r || Number(r[3]) !== d.oz || r[1] !== e.name || r[2] !== e.symbol) m.push(`Text passt nicht zu den Daten: ${a.text}`);
    const elektronen = d.oz - (aussen <= 3 ? aussen : aussen - 8);
    const soll = PSE.elemente.find(x => x.oz === elektronen && x.art === "edelgas" && edelLage(x.oz));
    if (!soll) m.push(`kein Edelgas mit ${elektronen} Elektronen: ${e.name}`);
    else if (a.optionen[a.richtig] !== soll.name) m.push(`Auswahl ${a.optionen[a.richtig]} statt ${soll.name}: ${e.name}`);
    if (a.optionen.join(",") !== "Helium,Neon,Argon") m.push(`Optionen ${a.optionen.join(", ")}`);
    return m;
  }
  if (a.art === "auswahl") {
    const edel = edelLage(d.oz);
    if (edel !== (e.art === "edelgas")) m.push(`Edelgas-Kennzeichnung passt nicht zur Stellung: ${e.name}`);
    if (ARTID[a.optionen[a.richtig]] !== e.art) m.push(`Auswahl passt nicht zur Liste: ${e.name}`);
    return m;
  }
  const soll = {
    protonen: () => d.oz, elektronen: () => d.oz, neutronen: () => d.masse - d.oz, isotop: () => d.masse - d.oz,
    aussen: () => aussen, schalen: () => l.periode, gruppe: () => (e.art === "edelgas" ? 8 : aussen),
    ladung: () => (aussen <= 3 ? aussen : aussen - 8), "ionen-elektronen": () => d.oz - (aussen <= 3 ? aussen : aussen - 8),
  }[a.typ];
  if (!soll) return [`unbekannter Typ ${a.typ}`];
  if (soll() !== a.antwort) m.push(`Antwort ${a.antwort}, nachgerechnet ${soll()}: ${a.text}`);
  if (a.typ === "isotop" && d.masse === e.masse) m.push("Isotop gleich dem häufigsten");
  if (d.masse !== undefined && d.masse <= d.oz && d.oz > 1) m.push("Massenzahl zu klein");
  return m;
}

if (typeof module !== "undefined") module.exports = { UEBUNG, aufgabeErzeugen, pruefeAufgabe, hinweis };
