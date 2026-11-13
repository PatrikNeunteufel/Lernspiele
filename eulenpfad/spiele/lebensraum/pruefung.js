/* Prüfansicht der Lebensraum-Zuordnung (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Die vier Lebensraum-Listen sind die Zeilen von TIERE (tier-sortierer/tiere.js) mit diesem Lebensraum
   (LEBENSRAUM_LISTE_JE_RAUM), je Klasse eine Gruppe — Pflanzen und Pilze stehen neben den Tieren. Die Nahrungsketten
   (nahrung.js) in drei Abschnitten, je für sich abzuhaken: die Ketten, „Was frisst …?“ je Tier mit der Frage, dem Futter
   aus den Ketten und den Ablenkern, wie das Spiel sie bildet (wasFrisstFrage, frisstPaare, ablenkerFuer), und die beiden
   Ablenker-Listen selbst. Die Spalte „Stufen“ liest die Stufentabelle des Spiels (STUFE_ARTEN) mit seiner Auswahl je Art
   (NIMMT), an Lebewesen und Gliedern, wie das Spiel sie aus den Rohdaten baut (lebewesen, glieder). */
"use strict";
{
  const nummer = s => s.slice(1);
  const mitBild = ([name, bild]) => (bild ? `${bild} ${name}` : name);
  const raumName = r => RAEUME[r]?.name || r;
  /** Stufen, in denen die Art 'art' den Eintrag nimmt (NIMMT; ohne Freigabe). */
  const stufenVon = (art, eintrag) => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([a, ...angaben]) => a === art && NIMMT[art](eintrag, ...angaben))).map(nummer).join(", ") || "—";
  /** „Stufe 1: Wald, Wiese, Weiher und Bach, 2 Körbe, mit Bild · …“ für die Zuordnung, nur Stufen mit dem Raum 'raum'. */
  const zuordnenText = raum => Object.entries(STUFE_ARTEN)
    .flatMap(([s, arten]) => arten.filter(([a, raeume]) => a === "zuordnen" && raeume.includes(raum))
      .map(([, raeume, anzahl, bild]) => `Stufe ${nummer(s)}: ${raeume.map(raumName).join(", ")} (${anzahl} Körbe${bild ? ", jedes mit Bild" : ""})`))
    .join(" · ");
  /** „Stufe 4: 3 Glieder, alle mit Bild · …“ für die Ketten. */
  const kettenText = Object.entries(STUFE_ARTEN)
    .flatMap(([s, arten]) => arten.filter(([a]) => a === "kette")
      .map(([, laenge, bild]) => `Stufe ${nummer(s)}: ${laenge ? `${laenge} Glieder` : "jede Länge"}${bild ? ", alle mit Bild" : ""}`))
    .join(" · ");
  const wasFrisstStufen = Object.keys(STUFE_ARTEN).filter(s => STUFE_ARTEN[s].some(([a]) => a === "wasFrisst")).map(nummer).join(" und ");

  /** Lebensraum-Liste: Zeilen aus tiere.js mit diesem Raum. */
  const raumListe = (raum, hinweisRaum) => {
    const liste = LEBENSRAUM_LISTE_JE_RAUM[raum];
    return {
      beschreibung: `Lebensraum ${raumName(raum)}: Das Kind legt ein Tier oder eine Pflanze in den Lebensraum, wo man es am `
        + `meisten findet. ${zuordnenText(raum)}. Die Körbe sind der richtige Raum und weitere der genannten. `
        + "Die Spalte „Stufen“ zeigt je Lebewesen, wo es vorkommt.",
      abschnitte: [{
        id: "lebewesen", titel: `Tiere und Pflanzen: ${raumName(raum)}`, spalten: ["Bild", "Name", "Stufen"],
        hinweis: `Je Klasse eine Gruppe. Ist „${raumName(raum)}“ in der Schweiz der typische Lebensraum — und zwar eindeutig `
          + `gegen die anderen Körbe (Wald, Wiese, Weiher und Bach, Gebirge)? ${hinweisRaum} Lebt ein Lebewesen ebenso typisch in `
          + "einem zweiten Raum, gehört in tiere.js null (kommt dann nicht vor). Zeigt das Bild eindeutig dieses Lebewesen?",
        eintraege: () => TIERE.filter(z => LEBENSRAUM_LISTE_JE_RAUM[z[5]] === liste),
        gruppe: ([, , klasse]) => klasse,
        zeile: z => [z[1] || "—", z[0], stufenVon("zuordnen", lebewesen(z))],
      }],
    };
  };

  LS.listenPruefung("lebensraum", {
    wald: raumListe("Wald", "Achtung bei Tieren, die auch am Waldrand und auf Wiesen oder im Bergwald leben."),
    wiese: raumListe("Wiese", "Achtung bei Tieren, die ebenso im Wald oder in Gärten leben."),
    weiher: raumListe("Weiher", "Achtung bei Tieren, die nur zum Laichen ans Wasser kommen und sonst an Land leben."),
    gebirge: raumListe("Gebirge", "Achtung bei Lebewesen, die auch im Flachland häufig sind."),
    nahrungsketten: {
      beschreibung: "Nahrungsketten: Das Kind legt die Glieder einer Kette der Reihe nach (der Pfeil heisst „wird gefressen "
        + `von“; ${kettenText}) und wählt in „Was frisst …?“ (Stufen ${wasFrisstStufen}) aus drei Bildern das Futter eines `
        + "Tiers. Das Futter ist das Glied vor dem Tier in einer Kette; die zwei Ablenker sind grosse Räuber, wenn das Futter "
        + "eine Pflanze ist, sonst Pflanzen, die kein Fleischfresser frisst.",
      abschnitte: [{
        id: "kette", titel: "Ketten", spalten: ["Kette", "Stufen"],
        hinweis: "Je Länge eine Gruppe. Frisst jedes Tier wirklich das Glied davor (und zwar als wichtiges Futter, nicht nur "
          + "selten)? Ist das erste Glied eine Pflanze? Leben die Glieder einer Kette im selben Lebensraum in der Schweiz? "
          + "Zeigen die Bilder eindeutig das Gemeinte?",
        eintraege: () => NAHRUNGSKETTEN,
        gruppe: k => `${k.length} Glieder`,
        zeile: k => [k.map(mitBild).join(" → "), stufenVon("kette", glieder(k))],
      }, {
        id: "frisst", titel: "Was frisst …?", spalten: ["Frage", "Futter (richtig)", "Ablenker (zwei davon)"],
        hinweis: "Die Frage mit Artikel, wie das Spiel sie stellt. Ist das Futter richtig? Ist jeder Ablenker sicher kein "
          + "Futter für dieses Tier (auch nicht ab und zu, etwa Früchte und Nüsse bei Allesfressern)? Hat ein Tier mehrere "
          + "Futter, wird je Aufgabe eines gefragt.",
        eintraege: () => Object.entries(ARTIKEL),
        zeile: ([esser]) => {
          const paare = frisstPaare(NAHRUNGSKETTEN.map(glieder)).filter(p => p.esser === esser);
          const futter = [...new Set(paare.map(p => mitBild([p.futter.name, p.futter.bild])))];
          const ablenker = [...new Set(paare.flatMap(p => ablenkerFuer(esser, p.futter)))];
          return [wasFrisstFrage(esser), futter.join(", ") || "—", ablenker.join(", ") || "—"];
        },
      }, {
        id: "ablenker", titel: "Ablenker für „Was frisst …?“", spalten: ["Name"],
        hinweis: "Grosse Räuber: Sie werden in keiner Kette von einem Pflanzenfresser gefressen und sind darum bei "
          + "Pflanzenfressern sicher falsch. Kein Futter: Pflanzen, die keiner der Fleischfresser in den Ketten frisst. Stimmt das?",
        eintraege: () => [...GROSSE_RAEUBER, ...NICHT_FUTTER],
        gruppe: name => (GROSSE_RAEUBER.includes(name) ? "Grosse Räuber (bei Pflanzenfressern)" : "Kein Futter (bei Fleischfressern)"),
        zeile: name => [name],
      }],
    },
  });
}
