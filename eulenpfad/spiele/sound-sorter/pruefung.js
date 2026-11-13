/* Prüfansicht des Sound-Sorters (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „woerter“ mit zwei Inhalten, je ein Abschnitt: die Wörter mit ihrem Laut (SOUND_WOERTER, gruppiert nach dem
   Laut) und die Laute mit Lautschrift und den Beispielwörtern der Körbe (SOUND_LAUTE). Was das Spiel aus einem Wort
   macht, rechnen die Funktionen des Spiels: Beschriftung der Körbe (korbInhalt mit beispielFuer), Regel vom stummen e
   in Stufe 4 (kurzOhneE, langMitE), Schreibfamilie der Königsstufe (FAMILIEN), Schreibung in Stufe 5 (S5_LAUTE).
   Welche Laute die Stufen 2, 3 und 5 nehmen, sagen HOEREN_VOKALE und inStufe5 des Spiels (dieselben nehmen STUFE und
   s5Woerter, dort nur aus der freien Liste). Zu prüfen: Hat das Wort in der britischen Standardaussprache genau diesen Laut, und keinen, der in eine
   andere Gruppe passt? Stimmen Lautschrift und Beispielwörter? */
"use strict";
{
  // Laute der Stufen 2 und 3 und der Filter der Stufe 5 mit den Angaben und der Funktion des Spiels
  const lauteVon = vokale => vokale.flatMap(v => [`${v}-kurz`, `${v}-lang`]);
  const LAUTE_S2 = lauteVon(HOEREN_VOKALE.s2), LAUTE_S3 = lauteVon(HOEREN_VOKALE.s3);
  const inS5 = inStufe5;
  const lautText = l => `${SOUND_LAUTE[l].buchstabe} ${SOUND_LAUTE[l].ipa}`;
  const stummesE = e => (langMitE(e) ? "lang, stummes e" : kurzOhneE(e) ? "kurz, ohne e" : "—");
  const familien = ([w, l]) => Object.entries(FAMILIEN).filter(([, f]) => f.laute.includes(l) && f.passt(w)).map(([f]) => f);
  function stufenVon(e) {
    const [, l, bild] = e, s = [];
    if (bild) s.push(1);
    if (LAUTE_S2.includes(l)) s.push(2);
    if (LAUTE_S3.includes(l)) s.push(3);
    if (stummesE(e) !== "—") s.push(4);
    if (inS5(e)) s.push(5);
    if (familien(e).length) s.push(6);
    return s.join(", ") || "— (in keiner Stufe!)";
  }
  /** Beschriftung der Körbe, wie das Spiel sie für dieses Wort zeigt (Stufen 2, 3 und 5). */
  function koerbe([w, l]) {
    const t = [];
    if (LAUTE_S3.includes(l)) t.push(korbInhalt({ art: "hoeren", wort: w }, l).text);
    if (inS5([w, l])) t.push(`${korbInhalt({ art: "gleicherLaut", wort: w }, l).text} (Stufe 5)`);
    return t.join(" · ") || "—";
  }
  const reihenfolge = Object.keys(SOUND_LAUTE);
  LS.listenPruefung("sound-sorter", {
    woerter: {
      beschreibung: "Englische Wörter mit ihrem Laut, britische Aussprache. Stufe 1: Wort hören, aus drei Bildern das passende wählen (nur Wörter mit Bild). Stufe 2: Wort hören (nicht sehen) und in den Korb legen — i wie in sit oder wie in bike; Stufe 3 dazu a und o. Stufe 4 ohne Ton: Wort lesen, kurz ohne e oder lang mit stummem e. Stufe 5: gleicher Laut, andere Schreibung (sea wie tree), drei Körbe. Stufe 6: von vier Wörtern gleicher Schreibung das eine finden, das anders klingt — nur nach der Schrift. Die Lautschrift sieht das Kind nicht.",
      abschnitte: [
        { id: "wort", titel: "Wörter und ihr Laut", spalten: ["Bild", "Wort", "Laut", "Stufen", "Korb im Spiel", "stummes e (Stufe 4)", "Familie (Stufe 6)"],
          hinweis: "Je Laut eine Gruppe. Hat das Wort in der britischen Standardaussprache (en-GB) genau diesen Laut — betont, nicht abgeschwächt — und keinen, der in eine andere Gruppe passt? Wörter mit zwei Aussprachen (live, read, wind) gehören nicht hinein. In Stufe 2 und 3 fragt das Spiel „Wie klingt das i/a/o?“: Steht der Buchstabe im Wort? Das Bild (Stufe 1) muss eindeutig zum Wort passen.",
          eintraege: () => SOUND_WOERTER,
          gruppe: ([, l]) => `${lautText(l)} wie in ${SOUND_LAUTE[l].beispiele.join(", ")}`,
          zeile: e => [e[2] || "—", e[0], lautText(e[1]), stufenVon(e), koerbe(e), stummesE(e), familien(e).join(", ") || "—"] },
        { id: "laut", titel: "Laute und Beispielwörter der Körbe", spalten: ["Laut", "Buchstabe", "Lautschrift", "Beispielwörter (Körbe Stufe 2, 3)", "Korb Stufe 5"],
          hinweis: "Stimmt die Lautschrift (britisch)? Haben beide Beispielwörter genau diesen Laut? Das Spiel zeigt am Korb das erste Beispielwort, ausser es ist das Wort der Karte — dann das zweite.",
          eintraege: () => reihenfolge.map(l => [l, SOUND_LAUTE[l]]),
          zeile: ([l, s]) => [l, s.buchstabe, s.ipa,
            s.beispiele.map(b => (SOUND_WOERTER.some(([w, lw]) => w === b && lw === l) ? b : `${b} (nicht mit diesem Laut in der Wortliste!)`)).join(", "),
            S5_LAUTE[l] ? `wie in ${S5_LAUTE[l].beispiel}` : "— (nicht in Stufe 5)"] },
      ],
    },
  });
}
