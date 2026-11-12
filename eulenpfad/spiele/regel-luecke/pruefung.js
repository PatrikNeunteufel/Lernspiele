/* Prüfansicht der Regel-Lücke (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Regel eine Liste (REGELN[<liste>].woerter), dazu die Ausnahmen der ie-Regel als eigene Liste
   (REGELN["ie-i"].ausnahmen, AUSNAHMEN_LISTE im Spiel). Die Liste „ck-tz“ trägt zwei Regeln und hat deshalb zwei
   Abschnitte: ck oder k, tz oder z. Jedes Wort wird so zerlegt wie im Spiel (zerlegeWort); gruppiert nach der richtigen
   Schreibweise. Die Stufen der Beschreibung rechnet die Ansicht aus STUFE des Spiels.
   Zu prüfen: Passt das Bild eindeutig zum Wort (ohne Bild wären Haken/Hacken, viel/fiel, Rose/Rosse mehrdeutig), gilt
   die Regel für dieses Wort ohne Ausnahme — und ist die falsche Schreibweise sicher falsch? */
"use strict";
{
  const SPALTEN = ["Bild", "Wort", "Lücke", "richtig", "falsch", "falsch geschrieben"];
  const zeile = ([text, bild]) => {
    const w = zerlegeWort(text);
    return [bild || "—", w.ganz, `${w.vor}_${w.nach}`, w.richtig, w.falsch, w.vor + w.falsch + w.nach];
  };
  const richtig = ([text]) => zerlegeWort(text).richtig.toLowerCase();
  /** Stufen, die eine Regel ziehen (Ausnahmen: nur Stufen mit ausnahmen). */
  const nummern = (regelId, ausnahmen, sichtbar) => Object.entries(STUFE)
    .filter(([, p]) => p.regeln.includes(regelId) && (!ausnahmen || p.ausnahmen) && !!p.sichtbar === sichtbar).map(([s]) => s.slice(1));
  const stufenText = nr => `${nr.length > 1 ? "Stufen" : "Stufe"} ${nr.join(", ")}`;
  /** „Stufen 1, 2 mit Regelkarte; Stufe 6 ohne Regelkarte, die Regel erst beim Fehler“ — aus STUFE des Spiels. */
  const stufenVon = (regelId, ausnahmen = false) => [
    [nummern(regelId, ausnahmen, true), "mit Regelkarte"], [nummern(regelId, ausnahmen, false), "ohne Regelkarte, die Regel erst beim Fehler"],
  ].filter(([nr]) => nr.length).map(([nr, wie]) => `${stufenText(nr)} ${wie}`).join("; ");
  const was = "Das Kind sieht das Bild und das Wort mit Lücke und tippt die richtige von zwei Schreibweisen an.";
  /** Gruppe nach der richtigen Schreibweise, mit dem Grund aus der Regel. */
  const nachRichtig = namen => (typeof namen === "function" ? namen : e => namen[richtig(e)] || richtig(e));
  /** Eine Liste mit einem Abschnitt: alle Wörter der Regel. */
  const regelListe = (id, titel, gruppen) => ({
    beschreibung: `${titel} (${stufenVon(id)}). ${was}`,
    abschnitte: [{
      id, titel, spalten: SPALTEN, hinweis: `Regel im Spiel: ${REGELN[id].regel}`,
      eintraege: () => REGELN[id].woerter, zeile, gruppe: nachRichtig(gruppen),
    }],
  });
  /** Wörter der ck/tz-Liste, die zu einer der beiden Regeln gehören (nach den zwei Schreibweisen der Lücke). */
  const ckTz = buchstaben => () => REGELN["ck-tz"].woerter.filter(([text]) => {
    const w = zerlegeWort(text);
    return [w.richtig, w.falsch].every(s => buchstaben.includes(s.toLowerCase()));
  });
  LS.listenPruefung("regel-luecke", {
    "sp-st": regelListe("sp-st", "sp oder schp, st oder scht am Wortanfang", { sp: "sp", st: "st" }),
    "ie-i": regelListe("ie-i", "ie oder i (ohne Ausnahmen)", { ie: "ie (langes i)", i: "i (kurzes i)" }),
    "ie-ausnahmen": {
      beschreibung: `Ausnahmen zur ie-Regel: langes i ohne e (${stufenVon("ie-i", true)}; in Stufe 6 häufiger gezogen). ${was}`,
      abschnitte: [{
        id: "ie-ausnahmen", titel: "Ausnahmen: langes i ohne e", spalten: SPALTEN,
        hinweis: "Jedes Wort muss lang gesprochen werden und trotzdem nur i haben. Die falsche Wahl ist ie.",
        eintraege: () => REGELN["ie-i"].ausnahmen, zeile,
      }],
    },
    "ck-tz": {
      beschreibung: `ck oder k und tz oder z (${stufenVon("ck-tz")}). ${was}`,
      abschnitte: [
        { id: "ck", titel: "ck oder k", spalten: SPALTEN, hinweis: `Regel im Spiel: ${REGELN["ck-tz"].regel}`,
          eintraege: ckTz(["ck", "k"]), zeile,
          gruppe: nachRichtig({ ck: "ck (nach kurzem Vokal)", k: "k (nach langem Vokal, au, ei, eu, l, n, r)" }) },
        { id: "tz", titel: "tz oder z", spalten: SPALTEN, hinweis: `Regel im Spiel: ${REGELN["ck-tz"].regel}`,
          eintraege: ckTz(["tz", "z"]), zeile,
          gruppe: nachRichtig({ tz: "tz (nach kurzem Vokal)", z: "z (nach langem Vokal, au, ei, eu, l, n, r)" }) },
      ],
    },
    "f-v": regelListe("f-v", "f oder v", { v: "v (Merkwort)", f: "f" }),
    "e-ae": regelListe("e-ae", "e oder ä (Ableitung von a)", { "ä": "ä (verwandtes Wort mit a)", e: "e (kein verwandtes Wort mit a)" }),
    doppel: regelListe("doppel", "Doppelkonsonant nach kurzem Vokal",
      e => (/^(.)\1$/.test(richtig(e)) ? "doppelt (kurzer Vokal)" : "einfach (langer Vokal)")),
  });
}
