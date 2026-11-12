/* Prüfansicht der Rechengeschichten (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Stufe eine Liste (GESCHICHTEN_LISTEN), je Liste ein Abschnitt, gruppiert nach der Rechenart der richtigen Rechnung.
   Neben der Vorlage stehen zwei Beispiele, vom Spiel ausgefüllt (geschichteText) — einmal mit den kleinsten, einmal mit
   den grössten Zahlen der Bereiche: So sieht man Einzahl und Mehrzahl ({b:wird|werden}) und den Zahlenraum.
   Zu prüfen: Passt die richtige Rechnung genau zur Geschichte, ist kein Ablenker auch richtig, stimmen die Sätze? */
"use strict";
{
  const RECHENART = { "+": "plus", "−": "minus", "·": "mal", ":": "geteilt" };
  /** Werte wie im Spiel (aufgabeErzeugen), aber mit dem unteren oder oberen Rand jedes Bereichs. */
  function werte(g, rand) {
    const w = Object.fromEntries(Object.entries(g.zahlen).map(([k, b]) => [k, b[rand]]));
    for (const [k, ausdruck] of Object.entries(g.abgeleitet || {})) w[k] = rechne(ausdruck, w);
    return w;
  }
  const beispiel = (g, rand) => {
    const w = werte(g, rand);
    return `${geschichteText(g.text, w)} → ${zahlText(rechne(g.ergebnis, w))}`;
  };
  const zahlen = g => Object.entries(g.zahlen).map(([k, [a, b]]) => `${k}: ${a}–${b}`)
    .concat(Object.entries(g.abgeleitet || {}).map(([k, v]) => `${k} = ${v}`)).join(", ");
  const STUFEN = {
    1: "mit Bild, bis 10 (dazu, weg)", 2: "Text bis 20 (plus, minus)", 3: "bis 100, auch mal", 4: "mit Platzhalter: Was fehlt noch?",
    5: "verteilen, Platzhalter mit mal und minus", 6: "ausrechnen, eine Angabe wird nicht gebraucht",
  };
  const defs = {};
  for (const [stufe, liste] of Object.entries(GESCHICHTEN_LISTEN)) {
    const sechs = Number(stufe) === 6;
    defs[liste] = {
      beschreibung: `Geschichten der Stufe ${stufe} (${STUFEN[stufe]}). ${sechs ? "Das Kind rechnet das Ergebnis aus; eine Zahl im Text braucht es nicht." : "Das Kind wählt die Rechnung, die zur Geschichte passt (_ ist die gesuchte Zahl)."}`,
      abschnitte: [{
        id: liste, titel: `Stufe ${stufe}: ${STUFEN[stufe]}`,
        spalten: [...(Number(stufe) === 1 ? ["Bild"] : []), "Vorlage", "Beispiel (kleinste Zahlen) → Lösung", "Beispiel (grösste Zahlen) → Lösung", "Zahlen",
          sechs ? "Rechnung" : "richtige Rechnung", sechs ? "nicht gebraucht" : "Ablenker"],
        hinweis: "Je Rechenart eine Gruppe. {a}, {b} … sind die Zahlen aus den Bereichen; {b:wird|werden} heisst „wird“, wenn b = 1 ist, sonst „werden“.",
        eintraege: () => GESCHICHTEN.filter(g => g.stufe === Number(stufe)),
        gruppe: g => RECHENART[rechenart(g)] || rechenart(g),
        zeile: g => [...(Number(stufe) === 1 ? [g.bild || ""] : []), g.text, beispiel(g, 0), beispiel(g, 1), zahlen(g),
          g.richtig || g.rechnung, sechs ? g.unwichtig : g.falsch.join("; ")],
      }],
    };
  }
  LS.listenPruefung("rechengeschichten", defs);
}
