/* Prüfansicht der Platzhalter-Geschichten (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „geschichten“, gemischt aus vier Gruppen mit verschiedenem Aufbau — je Gruppe ein Abschnitt. In Gruppe 3
   ist jede der drei Varianten ein Eintrag (gruppiert nach ihrer Vorlage), weil das Kind in der Königsstufe die Varianten
   gegeneinander unterscheiden muss. Das Beispiel füllt das Spiel selbst aus (textMit, gleichung) — mit den kleinsten
   Zahlen der Bereiche. Zu prüfen: Fragt die Geschichte genau nach der Lücke, passt die Gleichung, stimmen die Sätze? */
"use strict";
{
  /** Werte wie im Spiel (zieheWerte), aber mit dem unteren Rand jedes Bereichs. */
  function kleinste(v) {
    const w = Object.fromEntries(Object.entries(v.zahlen).map(([k, [min]]) => [k, min]));
    for (const [k, ausdruck] of Object.entries(v.abgeleitet || {})) w[k] = wertVon(ausdruck, w);
    return w;
  }
  const gleichungen = gl => (Array.isArray(gl) ? gl : [gl]);
  const beispiel = (text, gl, w) => `${textMit(text, w)} → ${gleichungen(gl).map(g => {
    const x = gleichung(g, w);
    return `${gleichungText(x)} (${zahlText(x.zahlen[x.luecke])})`;
  }).join("; ")}`;
  const bereiche = v => [Object.entries(v.zahlen).map(([k, [a, b]]) => `${k}: ${a}–${b}`).join(", "),
    ...Object.entries(v.abgeleitet || {}).map(([k, a]) => `${k} = ${a}`)].join("; ");
  const vorlagen = g => PLATZHALTER_GESCHICHTEN.filter(v => v.g === g);
  const HINWEIS = "{a}, {b} … sind Zahlen aus den Bereichen, {geld a} ein Frankenbetrag; [x] in der Gleichung ist die Lücke, nach der die Geschichte fragt.";
  const OPS = { "+": "plus", "−": "minus", "·": "mal", ":": "geteilt" };
  const opVon = gl => OPS[gleichungen(gl)[0].match(/ ([+−·:]) /)?.[1]] || "?";
  const lueckeVon = gl => ["Lücke vorn", "Lücke in der Mitte", "Lücke am Ende"][parseGl(gleichungen(gl)[0]).luecke];
  /** Abschnitt einer Gruppe, in der jede Vorlage ein Eintrag ist; extra: weitere Spalten [Kopf, Zelle]. */
  const einfach = (g, titel, gruppe, extra = []) => ({
    id: `gruppe-${g}`, titel, hinweis: HINWEIS, ...(gruppe ? { gruppe } : {}),
    spalten: [...(g === 1 ? ["Bild"] : []), "Geschichte", "Gleichung", "Zahlen", ...extra.map(e => e[0]), "Beispiel (kleinste Zahlen) → Lücke"],
    eintraege: () => vorlagen(g),
    zeile: v => [...(g === 1 ? [v.bild || ""] : []), v.text, gleichungen(v.gl).join("; "), bereiche(v), ...extra.map(e => e[1](v)),
      beispiel(v.text, v.gl, kleinste(v))],
  });
  const g1 = einfach(1, "Gruppe 1: bis 20, mit Bild (Stufe 1)", v => opVon(v.gl));
  const g2 = einfach(2, "Gruppe 2: bis 100 (Stufen 2–4)", v => `${opVon(v.gl)}, ${lueckeVon(v.gl)}`,
    [["Stufe 4 grösser", v => (v.gross ? Object.entries(v.gross).map(([k, [a, b]]) => `${k}: ${a}–${b}`).join(", ") : "—")]]);
  const g4 = einfach(4, "Gruppe 4: zwei Schritte bis 10 000 (Stufe 6)", null);
  LS.listenPruefung("platzhalter-geschichten", {
    geschichten: {
      beschreibung: "Sachgeschichten mit Platzhalter-Gleichungen: Gruppe 1 bis 20 mit Bild (Stufe 1), Gruppe 2 bis 100 (Stufen 2–4, in Stufe 4 mit grösseren Zahlen), Gruppe 3 bis 1000 mit drei Varianten zu denselben Zahlen (Stufen 5 und 6), Gruppe 4 zwei Schritte bis 10 000 (Stufe 6). Das Kind stellt die Gleichung auf, wählt die Umkehrrechnung und rechnet die Lücke aus.",
      abschnitte: [g1, g2, {
        id: "gruppe-3", titel: "Gruppe 3: bis 1000, drei Varianten zu denselben Zahlen (Stufen 5 und 6)",
        hinweis: `${HINWEIS} Je Vorlage eine Gruppe. In der Königsstufe zeigt das Spiel die Gleichung einer Variante; die anderen zwei sind Ablenker — ihre Lösung muss sich unterscheiden.`,
        spalten: ["Geschichte", "Gleichung", "Beispiel (kleinste Zahlen) → Lücke"],
        eintraege: () => vorlagen(3).flatMap((v, i) => v.varianten.map((x, j) => ({ vorlage: i, variante: j, zahlen: v.zahlen, abgeleitet: v.abgeleitet, ...x }))),
        gruppe: e => `Vorlage ${e.vorlage + 1} (${bereiche(e)})`,
        zeile: e => [e.text, e.gl, beispiel(e.text, e.gl, kleinste(e))],
      }, g4],
    },
  });
}
