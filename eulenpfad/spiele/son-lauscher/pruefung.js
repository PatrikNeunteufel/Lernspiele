/* Prüfansicht des Son-Lauschers (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „woerter“ mit zwei Inhalten, je ein Abschnitt: die Wörter mit markierter Lautgruppe (SON_WOERTER,
   gruppiert nach dem Laut) und die Laute mit Schreibweisen, Lautschrift und den Beispielwörtern der Körbe (SON_LAUTE).
   Was das Spiel aus einem Eintrag macht, rechnen seine Funktionen: Zerlegen in Wort und Lautgruppe (zerlegeEintrag),
   hörbarer Schluss für Stufe 1 (endetMitLaut, S1_LAUTE), Beispielwort am Korb (beispielFuer), knifflige Schreibung
   beim Lesen (kniffligGeschrieben), Ablenker der Lücke (ABLENKER, ABLENKER_E, geprüft mit lautDerSchrift). Die Stufen
   liest die Stufentabelle des Spiels (STUFE_ARTEN, aus der es auch seine Aufgaben baut). Zu prüfen: Hat das Wort in
   der französischen Standardaussprache wirklich diesen Laut, und keinen, der in einen anderen Korb passt? Stimmen
   Schreibung, Akzente und Artikel? */
"use strict";
{
  // Ziel einer Art, wie die Arten des Spiels ihren Vorrat wählen: Stufe 1 nur Laute aus S1_LAUTE mit hörbarem Schluss,
  // beim Hören die Laute der Stufe, beim Lesen die Nasallaute, Lücke und Tippen alle Wörter.
  const ZIEL = {
    paar: w => S1_LAUTE.includes(w.laut) && endetMitLaut(w),
    hoeren: (w, laute) => laute.includes(w.laut),
    lesen: w => NASAL.includes(w.laut),
    luecke: () => true,
    tippen: () => true,
  };
  const stufen = test => Object.entries(STUFE_ARTEN).filter(([, arten]) => arten.some(test)).map(([s]) => s.slice(1)).join(", ");
  const stufenVon = w => stufen(([art, laute]) => ZIEL[art](w, laute)) || "— (in keiner Stufe!)";
  const stufenDesLauts = l => stufen(([art, laute]) => (art === "paar" ? S1_LAUTE : art === "hoeren" ? laute : art === "lesen" ? NASAL : [l]).includes(l));
  const lautText = l => `${SON_LAUTE[l].name} ${SON_LAUTE[l].ipa}`;
  /** Korb des Worts beim Hören, wie das Spiel ihn beschriftet (Name, darunter ein Beispielwort, nicht das Wort selbst). */
  const korb = w => `${SON_LAUTE[w.laut].name} (wie in ${beispielFuer(w.laut, w) || "— kein Beispiel!"})`;
  const lesen = w => (!NASAL.includes(w.laut) ? "—" : kniffligGeschrieben(w) ? "knifflig (kommt öfter)" : "erste Schreibweise");
  /** Mögliche Ablenker der Lücke; gleich klingende (lautDerSchrift) wären beim Hören nicht lösbar. */
  function ablenker(w) {
    const e = ABLENKER_E[w.laut];
    const moeglich = e ? [...e[0], e[1]] : ABLENKER[w.laut];
    const text = e ? `${e[0].join(" oder ")}, ${e[1]}` : `zwei aus ${moeglich.join(", ")}`;
    const gleich = moeglich.filter(o => o !== w.gr && lautDerSchrift(o) === w.laut);
    return gleich.length ? `${text} (klingt gleich: ${gleich.join(", ")}!)` : text;
  }
  const ART_TEXT = {
    paar: "zwei Wörter hören und sagen, ob sie am Schluss gleich klingen",
    hoeren: "Wort hören (nicht sehen) und in den Korb mit seinem Laut legen",
    lesen: "Wort lesen ohne Ton, Korb nach dem Beispielwort wählen",
    luecke: "Wort hören, die Lücke mit einer von drei Schreibweisen füllen",
    tippen: "Wort hören, die Lautgruppe selbst tippen",
  };
  const stufenText = Object.entries(STUFE_ARTEN).map(([s, arten]) => `Stufe ${s.slice(1)}: ` + arten.map(([art, laute, n]) =>
    `${ART_TEXT[art]}${laute ? ` (${n} Körbe aus ${laute.map(l => SON_LAUTE[l].name).join(", ")})` : ""}`).join("; ")).join(". ");
  const reihenfolge = Object.keys(SON_LAUTE);
  const ALLE_WOERTER = () => SON_WOERTER.map(zerlegeEintrag);

  LS.listenPruefung("son-lauscher", {
    woerter: {
      beschreibung: `Französische Wörter mit ihrem Laut; in eckigen Klammern die Buchstaben, die den Laut schreiben (dort steht die Lücke). ${stufenText}. Die Lautschrift sieht das Kind nicht.`,
      abschnitte: [
        { id: "wort", titel: "Wörter und ihr Laut", spalten: ["Bild", "Wort", "Lautgruppe", "Stufen", "Korb beim Hören", "Lesen (Nasallaut)", "Lücke", "Ablenker der Lücke"],
          hinweis: "Je Laut eine Gruppe. Hat das Wort in der französischen Standardaussprache genau diesen Laut — und keinen zweiten geübten Laut, der in einen anderen Korb passt (ou, au/eau, on, an/en, in/ain, ch, é, è/ê, oi)? Schreiben die markierten Buchstaben wirklich den Laut (nicht an, wo es nicht nasal ist, wie in la banane)? Stimmen Schreibung, Akzente und Artikel? Stufe 1 nimmt nur Wörter, die hörbar mit dem Laut enden. Das Bild (nur Hinweis auf der Karte und in Stufe 1) muss eindeutig zum Wort passen.",
          eintraege: () => SON_WOERTER,
          gruppe: e => { const l = e[1]; return `${lautText(l)} wie in ${SON_LAUTE[l].beispiele.join(", ")}`; },
          zeile: e => {
            const w = zerlegeEintrag(e);
            return [w.bild || "—", w.anzeige, w.gr, stufenVon(w), korb(w), lesen(w), `${w.vor}_${w.nach} → ${w.gr}`, ablenker(w)];
          } },
        { id: "laut", titel: "Laute und Beispielwörter der Körbe", spalten: ["Laut", "Korb", "Schreibweisen", "Lautschrift", "Beispielwörter", "Stufen"],
          hinweis: "Stimmt die Lautschrift? Gehören alle Schreibweisen zu diesem Laut (und keine zu einem anderen Korb)? Haben die Beispielwörter genau diesen Laut? Das Spiel zeigt am Korb das erste Beispielwort, ausser es ist das Wort der Karte — dann das nächste.",
          eintraege: () => reihenfolge.map(l => [l, SON_LAUTE[l]]),
          zeile: ([l, s]) => [l, s.name, s.schrift.join(", "), s.ipa,
            s.beispiele.map(b => (ALLE_WOERTER().some(w => nackt(w.anzeige) === b && w.laut === l) ? b : `${b} (nicht mit diesem Laut in der Wortliste!)`)).join(", "),
            stufenDesLauts(l)] },
      ],
    },
  });
}
