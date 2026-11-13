/* Prüfansicht der Bionik-Paare (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „paare“ (woerter.js, BIONIK_PAARE) mit vier Inhalten, je für sich abzuhaken: das Paar Vorbild → Erfindung
   mit der Erklärung (Sachangaben, keine Legenden), was das Vorbild kann und was abgeschaut wurde (die Antworttexte der
   Stufen 1, 3 und 6), das Problem der Stufe 5 und die Gruppen ähnlicher Vorbilder, die nie zusammen in einer Aufgabe
   stehen. Jede Aufgabenart nimmt jedes Paar; die Ablenker sind zwei andere Paare, die mit dem richtigen nicht verwandt
   sind. Die Spalte „nie zusammen mit“ rechnet das mit der Regel des Spiels (verwandt), die Stufen in Spalten und
   Beschreibung liest die Stufentabelle des Spiels (STUFE).
   Zu prüfen: Entstand die Erfindung nachweislich nach diesem Vorbild (oder wird sie danach entwickelt, dann steht
   „in Entwicklung“ in der Erklärung)? Stimmen Namen, Orte und Jahreszahlen? Passt jeder Antworttext nur zu seinem
   Vorbild und nicht ebenso zu einem nicht verwandten? Zeigt das Bild eindeutig Vorbild oder Erfindung? */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Aufgabenarten des Spiels (STUFE.arten) in Worten. */
  const ART = {
    kann: "Vorbild gezeigt, das Kind wählt, was es besonders kann",
    erfindung: "Vorbild gezeigt, das Kind wählt die Erfindung",
    vorbild: "Erfindung gezeigt, das Kind wählt das Vorbild",
    eigenschaft: "Vorbild und Erfindung gezeigt, das Kind wählt, was abgeschaut wurde",
    paare: n => `${n} Paare Vorbild – Erfindung finden`,
    problem: "ein Problem gezeigt, das Kind wählt das Vorbild, das hilft",
    dreier: n => `${n} Dreier Vorbild – abgeschaut (kurz) – Erfindung finden`,
  };
  const artText = (art, p) => (typeof ART[art] === "function" ? ART[art](p.paare) : ART[art]);
  const STUFEN_TEXT = Object.entries(STUFE)
    .map(([s, p]) => `Stufe ${nummer(s)}: ${p.arten.map(a => artText(a, p)).join("; ")}`).join(" · ");
  /** „Stufe 1“ bzw. „Stufen 2, 4“: wo die Art vorkommt (STUFE). */
  const stufenMit = (...arten) => {
    const st = Object.keys(STUFE).filter(s => STUFE[s].arten.some(a => arten.includes(a))).map(nummer);
    return st.length ? `${st.length > 1 ? "Stufen" : "Stufe"} ${st.join(", ")}` : "keine Stufe";
  };
  const vorbildText = p => `${p.vbild} ${p.vorbild}`;
  const erfindungText = p => `${p.ebild} ${p.erfindung}`;
  /** Paare, die nie zusammen mit p in einer Aufgabe stehen (verwandt des Spiels). */
  const nieMit = p => BIONIK_PAARE.filter(q => q !== p && verwandt(p, q)).map(q => q.vorbild).join(", ") || "—";

  LS.listenPruefung("bionik-paare", {
    paare: {
      beschreibung: "Vorbilder aus der Natur und die Erfindungen, die danach entstanden. Bei jeder Aufgabe wählt das Kind aus "
        + `drei Antworten oder findet zusammengehörige Karten. ${STUFEN_TEXT}. Jede Aufgabenart nimmt jedes Paar; die zwei `
        + "Ablenker (und die übrigen Karten) sind Paare, die mit dem richtigen keine Gruppe teilen. Nach der Antwort steht die "
        + "Erklärung da.",
      abschnitte: [{
        id: "paare", titel: "Vorbild und Erfindung", spalten: ["Vorbild", "Erfindung", "Erklärung"],
        hinweis: `Vorbild → Erfindung kommt in ${stufenMit("erfindung", "vorbild", "paare", "dreier", "problem")} vor. `
          + "Entstand die Erfindung nachweislich nach diesem Vorbild — keine Legende als Tatsache (Fledermaus und Sonar, "
          + "Löwenzahn und Fallschirm sind bewusst weggelassen)? Wird sie erst entwickelt, steht „in Entwicklung“ in der "
          + "Erklärung. Stimmen Namen, Orte und Jahreszahlen? Zeigen die beiden Bilder eindeutig das Gemeinte (wo es kein "
          + "eigenes Zeichen gibt, steht ein allgemeines; der Name ist massgebend)?",
        eintraege: () => BIONIK_PAARE,
        zeile: p => [vorbildText(p), erfindungText(p), p.text],
      }, {
        id: "eigenschaften", titel: "Was das Vorbild kann und was abgeschaut wurde",
        spalten: ["Vorbild", `kann (${stufenMit("kann")})`, `abgeschaut (${stufenMit("eigenschaft")})`, `kurz (${stufenMit("dreier")})`],
        hinweis: "Die drei Texte sind Antworten auf Knöpfen und Karten; die Ablenker sind dieselben Texte nicht verwandter "
          + "Vorbilder (Abschnitt „Gruppen“). Stimmt jeder Text fachlich? Passt er nur zu diesem Vorbild und nicht ebenso zu "
          + "einem anderen? Sagen „abgeschaut“ und „kurz“ dasselbe, und ist das wirklich, was die Erfindung übernimmt?",
        eintraege: () => BIONIK_PAARE,
        zeile: p => [vorbildText(p), p.kann, p.eigenschaft, p.kurz],
      }, {
        id: "probleme", titel: `Probleme (${stufenMit("problem")})`, spalten: ["Problem", "Vorbild (richtig)", "Erfindung"],
        hinweis: "Das Kind liest das Problem und wählt unter drei Vorbildern das, das hilft; die anderen beiden sind nicht "
          + "verwandt. Führt das Problem eindeutig zu diesem Vorbild — hilft kein anderes Vorbild der Liste ebenso (auch eines "
          + "aus einer anderen Gruppe)? Ist das Problem für die 6. Klasse verständlich?",
        eintraege: () => BIONIK_PAARE,
        zeile: p => [p.problem, vorbildText(p), erfindungText(p)],
      }, {
        id: "gruppen", titel: "Gruppen ähnlicher Vorbilder", spalten: ["Vorbild", "Gruppen", "nie zusammen mit"],
        hinweis: "Vorbilder mit einer gemeinsamen Gruppe stehen nie zusammen in einer Aufgabe, damit die Antwort eindeutig "
          + "bleibt. Fehlt eine Gruppe — gibt es zwei Vorbilder, deren Erfindung, Eigenschaft oder Problem man verwechseln "
          + "könnte, die hier nicht zusammen genannt sind?",
        eintraege: () => BIONIK_PAARE,
        zeile: p => [vorbildText(p), p.gruppen.join(", "), nieMit(p)],
      }],
    },
  });
}
