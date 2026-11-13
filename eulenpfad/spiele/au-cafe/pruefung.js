/* Prüfansicht von Au café (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „dialoge“ für alle Tabellen in woerter.js — gemischter Inhalt, deshalb ein Abschnitt je Tabelle, jeder für
   sich abzuhaken: Sprecher, Situationen und Formeln der Stufe 1, Gesichter und Antworten auf „Ça va ?“ der Stufe 2,
   Dialoge, Bestellungen mit Preisen, Sachen im Café, Sätze und Personen für tu oder vous. Dazu ein Abschnitt „Welche
   Antwort passt?“: je Paar Replik → nächste Replik ein Eintrag mit allen Ablenkern, die das Spiel ziehen kann, denn ob
   eine Antwort passt und kein Ablenker ebenso, lässt sich nur zusammen prüfen.
   Nichts ist nachgebaut: Welche Stufen etwas nehmen, liest die Ansicht aus STUFE und den Angaben je Stufe des Spiels
   (ANTWORT_JE_STUFE, ORDNEN_JE_STUFE, TU_VOUS_JE_STUFE); Paare, Ablenker, Dialoge zum Ordnen, Personen je Stufe, Preise
   und ähnliche Preise rechnen die Funktionen des Spiels (paareVon, ablenkerFuer, zumOrdnen, personenBis, preisText,
   nahePreise) — über alle Dialoge, nicht nur die freigegebenen.
   Zu prüfen: Passt die richtige Antwort, ist kein Ablenker ebenso eine höfliche, passende Antwort, ist das Französisch
   alltagsnah (Akzente, Apostroph ’, Leerzeichen vor ? und !), stimmt tu oder vous, stimmen Preise und Summen? */
"use strict";
{
  const NR = { s1: 1, s2: 2, s3: 3, s4: 4, s5: 5, s6: 6 };
  const liste = stufen => (!stufen.length ? "keine Stufe" : stufen.length > 1 ? `Stufen ${stufen.join(", ")}` : `Stufe ${stufen[0]}`);
  /** Stufen, in denen das Spiel eine dieser Aufgabenarten zieht — aus STUFE. */
  const stufenMit = (...arten) => Object.keys(STUFE).filter(s => STUFE[s].some(([art]) => arten.includes(art))).map(s => NR[s]);
  const L = (...arten) => liste(stufenMit(...arten));
  const THEMA = { gruss: "Begrüssen, Befinden, Verabschieden", vorstellen: "Sich vorstellen", bestellen: "Bestellen und bezahlen" };
  /** Arten der Repliken (woerter.js, CAFE_DIALOGE) in Worten. */
  const ART = {
    gruss: "Gruss", "gruss-frage": "Gruss mit Frage nach dem Befinden", befinden: "Befinden", "name-frage": "Frage nach dem Namen",
    name: "Name", "alter-frage": "Frage nach dem Alter", alter: "Alter", "wohnort-frage": "Frage nach dem Wohnort", wohnort: "Wohnort",
    freude: "Freude", abschied: "Abschied", "bestell-frage": "Frage nach der Bestellung", bestellung: "Bestellung",
    "groesse-frage": "Frage nach der Grösse", groesse: "Grösse", "noch-frage": "Frage nach mehr", noch: "nichts mehr",
    bringen: "Bringen", "preis-frage": "Frage nach dem Preis", preis: "Preis", bezahlen: "Bezahlen", dank: "Dank",
  };
  const art = a => ART[a] || a;
  const wer = k => CAFE_SPRECHER[k].join(" ");
  const replik = r => `${wer(r[0])} [${art(r[3])}]: ${r[1]} (${r[2]})`;
  const formel = k => `${CAFE_FORMELN[k][0]} (${CAFE_FORMELN[k][1]})`;
  const sache = k => `${CAFE_SACHEN[k][1]} ${CAFE_SACHEN[k][0]}`;

  /** Stufen von „Welche Antwort passt?“, in denen ein Dialog dieses Themas vorkommt — aus ANTWORT_JE_STUFE. */
  const antwortStufen = thema => Object.keys(ANTWORT_JE_STUFE).filter(s => ANTWORT_JE_STUFE[s][1].includes(thema));
  /** Ablenker, die das Spiel zu einem Paar ziehen kann (ablenkerFuer über alle Dialoge), zusammengefasst nach Art:
      „Befinden (6)“ — die Sätze selbst stehen mit ihrer Art im Abschnitt Dialoge. Je Stufe nimmt das Spiel nur die
      Themen dieser Stufe (ANTWORT_JE_STUFE); hier die Themen aller Stufen, in denen das Paar vorkommt. */
  const ablenker = p => {
    const themen = [...new Set(antwortStufen(p.d.thema).flatMap(s => ANTWORT_JE_STUFE[s][1]))];
    const zahl = {};
    for (const r of ablenkerFuer(p, themen, CAFE_DIALOGE)) zahl[r[3]] = (zahl[r[3]] || 0) + 1;
    return Object.entries(zahl).map(([a, n]) => `${art(a)} (${n})`).join(" · ");
  };
  const antwortGruppe = p => {
    const stufen = antwortStufen(p.d.thema);
    const zahl = [...new Set(stufen.map(s => ANTWORT_JE_STUFE[s][0]))].join(" oder ");
    const hoeren = stufen.filter(s => ANTWORT_JE_STUFE[s][2]).map(s => NR[s]);
    return `${THEMA[p.d.thema]} (${liste(stufen.map(s => NR[s]))}; ${zahl} Antworten${hoeren.length ? `, in ${liste(hoeren)} nur gehört` : ""})`;
  };
  /** Themen je Stufe von „Welche Antwort passt?“ in Worten — aus ANTWORT_JE_STUFE. */
  const themenJeStufe = () => Object.keys(ANTWORT_JE_STUFE)
    .map(s => `Stufe ${NR[s]}: ${ANTWORT_JE_STUFE[s][1].map(t => THEMA[t]).join(" / ")}`).join("; ");
  /** Stufen, in denen das Spiel diesen Dialog ordnen lässt — mit zumOrdnen und ORDNEN_JE_STUFE. */
  const ordnenIn = d => liste(Object.keys(ORDNEN_JE_STUFE).filter(s => zumOrdnen(d, ...ORDNEN_JE_STUFE[s])).map(s => NR[s]));
  const bestellung = d => {
    if (!d.bestellung) return "—";
    const { sache: s, anzahl, preis } = d.bestellung;
    return `${anzahl} × ${sache(s)} = ${preisText(preis)}`;
  };
  /** Personen je Stufe — mit personenBis und TU_VOUS_JE_STUFE. */
  const personStufen = p => liste(Object.keys(TU_VOUS_JE_STUFE).filter(s => personenBis(TU_VOUS_JE_STUFE[s]).includes(p)).map(s => NR[s]));

  LS.listenPruefung("au-cafe", {
    dialoge: {
      beschreibung: `Alle französischen Zeilen des Spiels. ${L("formel")}: Das Kind sieht eine Situation (Bild und Satz) `
        + `und tippt die passende Formel (Bonjour !, Au revoir !, Merci !, S’il vous plaît.) oder hört eine Formel und `
        + `tippt, was sie heisst. ${L("befinden")}: Auf „Ça va ?“ die Antwort, die zum Gesicht passt (je Gefühl eine `
        + `zur Wahl). ${L("antwort", "antwortHoeren")}: „Welche Antwort passt?“ — eine Replik aus einem Dialog, das Kind `
        + `wählt die nächste (${L("antwortHoeren")} nur gehört). ${L("ordnen")}: ein ganzes Gespräch ordnen. `
        + `${L("bestellenWas", "bestellenPreis", "bestellenHoeren", "bestellenBeides")}: Bestellgespräche — was wird `
        + `bestellt (${L("bestellenWas")} gelesen, ${L("bestellenHoeren")} gehört), wie viel kostet es (${L("bestellenPreis")}), `
        + `beides zusammen nur gehört (${L("bestellenBeides")}). ${L("tuVous")}: tu oder vous — ein Satz in beiden Formen, `
        + `das Kind wählt die passende für eine Person.`,
      abschnitte: [
        { id: "sprecher", titel: "Sprecher", spalten: ["Kürzel", "Bild", "Name"],
          hinweis: "Passt das Bild zur Person (Lina, Noé, Madame Rochat, la serveuse, le serveur)? Die Namen sind erfunden.",
          eintraege: () => Object.entries(CAFE_SPRECHER), zeile: ([k, [bild, name]]) => [k, bild, name] },
        { id: "situationen", titel: `Situationen (${L("formel")})`, spalten: ["Bild", "Situation", "richtige Formel", "andere Knöpfe"],
          hinweis: "Je Formel eine Gruppe. Das Spiel zeigt immer alle vier Formeln: Passt die richtige eindeutig zur Situation, und "
            + "keine der anderen drei ebenso (etwa Merci ! beim Gehen)? Passen die Bilder zum Satz?",
          eintraege: () => CAFE_SITUATIONEN, gruppe: e => formel(e[2]),
          zeile: ([bild, text, k]) => [bild, text, formel(k), Object.keys(CAFE_FORMELN).filter(x => x !== k).map(x => CAFE_FORMELN[x][0]).join(" · ")] },
        { id: "formeln", titel: `Formeln (${L("formel", "formelHoeren")})`, spalten: ["französisch", "deutsch"],
          hinweis: "Beim Hören zeigt das Spiel die vier deutschen Bedeutungen als Knöpfe: Ist die Übersetzung richtig und von den "
            + "anderen klar verschieden? Akzente und Apostroph ’ richtig?",
          eintraege: () => Object.entries(CAFE_FORMELN), zeile: ([, [fr, de]]) => [fr, de] },
        { id: "gesichter", titel: `Gesichter (${L("befinden")})`, spalten: ["Gefühl", "Gesicht"],
          hinweis: "Zeigt das Gesicht das Gefühl so, dass ein Kind die passende Antwort findet?",
          eintraege: () => Object.entries(CAFE_GESICHTER), zeile: ([g, bild]) => [g, bild] },
        { id: "befinden", titel: `Antworten auf „Ça va ?“ (${L("befinden")})`, spalten: ["Gesicht", "Antwort", "deutsch"],
          hinweis: "Je Gefühl eine Gruppe. Das Spiel stellt je Gefühl eine Antwort zur Wahl: Gehört jede Antwort eindeutig zu "
            + "ihrem Gefühl (gut, mittel, schlecht) und nicht zu einem anderen? Ist das Französisch alltagsnah?",
          eintraege: () => CAFE_BEFINDEN, gruppe: e => `${CAFE_GESICHTER[e[0]]} ${e[0]}`,
          zeile: ([g, fr, de]) => [CAFE_GESICHTER[g], fr, de] },
        { id: "dialoge", titel: "Dialoge", spalten: ["Id", "Gespräch", "Bestellung", "ordnen in"],
          hinweis: "Je Thema eine Gruppe. Folgt jede Replik natürlich auf die vorige, so dass die Reihenfolge beim Ordnen eindeutig "
            + "ist? Stimmt tu (unter Kindern, Erwachsene zu Kindern) und vous (Kind zu fremden Erwachsenen, im Café)? Stimmt die "
            + "deutsche Übersetzung? Akzente, Apostroph ’ und Leerzeichen vor ? und ! richtig?",
          eintraege: () => CAFE_DIALOGE, gruppe: d => THEMA[d.thema],
          zeile: d => [d.id, d.repliken.map((r, i) => `${i + 1}. ${replik(r)}`).join("  "), bestellung(d), ordnenIn(d)] },
        { id: "antworten", titel: `Welche Antwort passt? (${L("antwort", "antwortHoeren")})`,
          spalten: ["Dialog", "Replik", "passende Antwort", "Ablenker aus diesen Arten (Zahl Sätze)"],
          hinweis: "Je Thema eine Gruppe. Das Spiel fragt „Was antwortet …?“ mit Bild und Name des Antwortenden und zieht die "
            + `Ablenker zufällig aus allen Repliken der Themen der Stufe (${themenJeStufe()}), deren Art in der letzten Spalte `
            + "steht (die Sätze mit ihrer Art: Abschnitt Dialoge). Passt die Antwort, und ist kein Satz dieser Arten ebenso eine höfliche, passende "
            + "Antwort (etwa ein Befinden wie „Super, merci !“ auf „Voilà votre croissant.“)? Stimmt die Art jeder Replik?",
          eintraege: () => paareVon(CAFE_DIALOGE), gruppe: antwortGruppe,
          zeile: p => [p.d.id, replik(p.frage), replik(p.antwort), ablenker(p)] },
        { id: "bestellungen", titel: `Bestellungen und Preise (${L("bestellenWas", "bestellenPreis", "bestellenHoeren", "bestellenBeides")})`,
          spalten: ["Id", "bestellt", "Anzahl", "Preis", "im Gespräch", "ähnliche Preise (Ablenker)"],
          hinweis: "Steht die bestellte Sache mit der Anzahl im Gespräch, und nennt die Bedienung genau diesen Preis in Worten? Passen "
            + "die Preise zueinander (gleiche Sache, gleicher Stückpreis) und ungefähr zu einem Schweizer Café? Die ähnlichen "
            + "Preise (deux / douze, six / seize) sind die falschen Möglichkeiten.",
          eintraege: () => CAFE_DIALOGE.filter(d => d.bestellung),
          zeile: d => [d.id, sache(d.bestellung.sache), d.bestellung.anzahl, preisText(d.bestellung.preis),
            d.repliken.filter(r => ["bestellung", "preis"].includes(r[3])).map(r => r[1]).join(" … "),
            nahePreise(d.bestellung.preis).map(preisText).join(" · ")] },
        { id: "sachen", titel: `Sachen im Café (${L("bestellenWas", "bestellenHoeren", "bestellenBeides")})`,
          spalten: ["Bild", "französisch", "Knopf (deutsch)"],
          hinweis: "Die Knöpfe zeigen Bild und deutschen Namen; die anderen Sachen sind die Ablenker. Passt das Bild, ist der "
            + "französische Name richtig (Akzente, Apostroph ’), und unterscheiden sich die Knöpfe klar?",
          eintraege: () => Object.entries(CAFE_SACHEN), zeile: ([, [fr, bild, de]]) => [bild, fr, de] },
        { id: "tu-vous", titel: `Sätze mit tu und vous (${L("tuVous")})`, spalten: ["was du sagen willst", "mit tu", "mit vous"],
          hinweis: "Das Spiel verbindet jeden Satz mit jeder Person: Sind beide Formen richtig (Verbform, te / vous), "
            + "unterscheiden sie sich nur in der Anrede, und passt der Satz zu jeder Person (auch Polizist, Bruder)?",
          eintraege: () => CAFE_TU_VOUS, zeile: ([tu, vous, was]) => [was, tu, vous] },
        { id: "personen", titel: `Personen für tu oder vous (${L("tuVous")})`, spalten: ["Bild", "Du sprichst …", "Form", "Stufen"],
          hinweis: "Je Form eine Gruppe. Kinder und Freunde tu; fremde Erwachsene, im Café und mehrere Personen vous. Ist die Form "
            + "eindeutig?",
          eintraege: () => CAFE_PERSONEN, gruppe: p => p[2],
          zeile: p => [p[0], p[1], p[2], personStufen(p)] },
      ],
    },
  });
}
