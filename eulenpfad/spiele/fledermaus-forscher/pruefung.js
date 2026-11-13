/* Prüfansicht des Fledermaus-Forschers (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Vier Listen aus fakten.js, je ein Abschnitt: Aussagen „Stimmt das?“ (gruppiert nach stimmt / stimmt nicht, wie die
   beiden Knöpfe im Spiel), Fragen mit Auswahl, das Jahr einer Fledermaus (in der Reihenfolge, die das Spiel verlangt)
   und Merkmal mit Nutzen. Die Spalte „Stufen“ liest die Stufentabelle des Spiels (STUFE_ARTEN, aus der es auch seine
   Aufgaben baut) mit seiner Auswahl je Stufe (passend, bei Fragen fragenFuer), die Beschreibungen nennen die Stufen
   je Art aus derselben Tabelle. Zu prüfen vor allem: Stimmt die Sachangabe für die Fledermäuse der Schweiz, ist die
   Erklärung richtig, und ist keine falsche Antwort ebenso richtig? */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Stufen, in denen eine Art vorkommt (STUFE_ARTEN des Spiels). */
  const stufenMit = art => Object.keys(STUFE_ARTEN).filter(s => STUFE_ARTEN[s].some(([a]) => a === art)).map(nummer);
  const liste = nr => (nr.length > 1 ? `Stufen ${nr.slice(0, -1).join(", ")} und ${nr.at(-1)}` : `Stufe ${nr[0]}`);
  /** Stufen, in denen das Spiel einen Eintrag ziehen kann: Art in der Stufe und Auswahl des Spiels (ohne Freigabe). */
  const stufenVon = (art, waehlt) => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([a, n]) => a === art && waehlt(n))).map(nummer).join(", ");
  /** Alle Fragen so, wie fragenFuer sie liest (Feld ab), mit dem Rohdatensatz. */
  const alleFragen = () => FLEDERMAUS_FRAGEN.map(e => ({ ab: e[0], e }));
  const ohneZeit = nummer(JAHR_OHNE_ZEIT);

  LS.listenPruefung("fledermaus-forscher", {
    aussagen: {
      beschreibung: `Aussagen über Fledermäuse (${liste(stufenMit("aussage"))}): Das Kind hört oder liest die Aussage `
        + "und tippt „Stimmt“ oder „Stimmt nicht“; danach zeigt das Spiel die Erklärung. Je Stufe vor allem die Aussagen "
        + "dieser Stufe und der Stufe davor, in der Königsstufe nur die schweren (ab Stufe 4).",
      abschnitte: [{
        id: "aussage", titel: "Aussagen", spalten: ["Aussage", "Erklärung", "Stufen"],
        hinweis: "Je Gruppe stimmt oder stimmt nicht. Stimmt die Aussage für die Fledermäuse der Schweiz wirklich so (oder "
          + "ist sie wirklich falsch) — ohne Ausnahme, die ein Kind kennen könnte? Ist die Erklärung sachlich richtig und "
          + "für die 1. bis 3. Klasse verständlich?",
        eintraege: () => FLEDERMAUS_AUSSAGEN,
        gruppe: ([, , stimmt]) => (stimmt ? "👍 Stimmt" : "👎 Stimmt nicht"),
        zeile: ([ab, text, , erklaerung]) => [text, erklaerung, stufenVon("aussage", n => passend([{ ab }], n).length > 0)],
      }],
    },
    fragen: {
      beschreibung: `Fragen mit drei Antworten (${liste(stufenMit("frage"))}): Das Kind wählt die richtige Antwort; `
        + "danach zeigt das Spiel die Erklärung. Je Stufe vor allem die Fragen dieser Stufe und der Stufe davor, in der "
        + "Königsstufe nur die schweren (ab Stufe 4).",
      abschnitte: [{
        id: "frage", titel: "Fragen", spalten: ["Frage", "Richtig", "Falsch", "Falsch", "Erklärung", "Stufen"],
        hinweis: "Ist die Antwort richtig für die Fledermäuse der Schweiz, und sind die beiden anderen eindeutig falsch — "
          + "auch für einzelne Arten? Stimmt die Erklärung?",
        eintraege: () => FLEDERMAUS_FRAGEN,
        zeile: e => {
          const [, frage, richtig, f1, f2, erklaerung] = e;
          return [frage, richtig, f1, f2, erklaerung, stufenVon("frage", n => fragenFuer(alleFragen(), n).some(x => x.e === e))];
        },
      }],
    },
    jahr: {
      beschreibung: `Das Jahr einer Fledermaus (${liste(stufenMit("jahr"))}): Das Kind tippt die Karten der Reihe nach `
        + `an, angefangen beim Winter. In Stufe ${ohneZeit} stehen auf den Karten keine Jahreszeiten, nur was passiert.`,
      abschnitte: [{
        id: "jahr", titel: "Das Jahr, in dieser Reihenfolge", spalten: ["Nr.", "Jahreszeit", "Was passiert"],
        hinweis: "Stimmt jede Jahreszeit zu dem, was die Fledermäuse in der Schweiz dann tun, und ist die Reihenfolge "
          + `eindeutig — auch in Stufe ${ohneZeit} ohne die Jahreszeit auf der Karte?`,
        eintraege: () => FLEDERMAUS_JAHR,
        zeile: e => [String(FLEDERMAUS_JAHR.indexOf(e) + 1), e[0], e[1]],
      }],
    },
    anpassungen: {
      beschreibung: `Merkmal und Nutzen (${liste(stufenMit("anpassung"))}): „Wozu helfen der Fledermaus: …?“ — das `
        + "Kind wählt den Nutzen; die beiden falschen Antworten sind Nutzen anderer Merkmale dieser Liste.",
      abschnitte: [{
        id: "anpassung", titel: "Merkmale", spalten: ["Merkmal", "Nutzen"],
        hinweis: "Stimmt der Nutzen? Jeder Nutzen darf nur zu seinem Merkmal passen, denn die Nutzen der anderen Merkmale "
          + "stehen als falsche Antworten daneben. Passt das Merkmal in die Frage „Wozu helfen der Fledermaus: …?“",
        eintraege: () => FLEDERMAUS_ANPASSUNGEN,
        zeile: ([merkmal, nutzen]) => [merkmal, nutzen],
      }],
    },
  });
}
