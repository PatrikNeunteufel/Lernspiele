/* Prüfansicht des Gemeinde-Helfers (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „anliegen“ mit gemischtem Inhalt, darum ein Abschnitt je Inhalt, jeder für sich abzuhaken: Einrichtungen
   (mit öffentlich oder privat und Ebene), Anliegen je Ziel (Name wie auf dem Korb), Notrufnummern und ihre Situationen,
   zuständige Stellen mit ihren Anliegen, Gemeinde, Kanton oder Bund, und die Abläufe der Königsstufe. Die Stufen liest die
   Ansicht aus den Tabellen des Spiels (STUFE, ANLIEGEN_STUFE mit ihrem Filter); ob der nächstliegende Ablenker sicher als
   Korb daneben steht, sagt ablenkerAlsKorb wie im Aufgabenbau. */
"use strict";
{
  const nummer = s => s.slice(1);
  const liste = stufen => stufen.map(nummer).join(", ") || "—";
  const mitBild = x => `${x.bild} ${x.name}`;
  /** Stufen, in denen die Aufgabenart 'art' vorkommt (STUFE). */
  const stufenMit = art => Object.keys(STUFE).filter(s => STUFE[s].includes(art));
  const stufenText = art => { const s = stufenMit(art); return `${s.length === 1 ? "Stufe" : "Stufen"} ${liste(s)}`; };
  /** Stufen, deren Anliegen-Filter das Anliegen nimmt (nur Stufen mit Anliegen-Aufgaben). */
  const anliegenStufen = a => stufenMit("anliegen").filter(s => ANLIEGEN_STUFE[s].filter(a));
  /** „Stufe 1: 2 Körbe, Bild-Karte · …“ aus ANLIEGEN_STUFE. */
  const koerbeText = stufenMit("anliegen").map(s => {
    const p = ANLIEGEN_STUFE[s];
    return `Stufe ${nummer(s)}: ${p.n} Körbe${p.kurz ? ", Bild-Karte" : ""}${p.privat ? ", einer davon ein privater Laden" : ""}`;
  }).join(" · ");
  /** Stufen, in denen die Einrichtung als Korb stehen kann: im Vorrat der Stufe oder als privater Laden dazu. */
  const korbStufen = e => stufenMit("anliegen").filter(s => ANLIEGEN_STUFE[s].pool.includes(e.id)
    || (ANLIEGEN_STUFE[s].privat && PRIVAT.includes(e.id)));
  const ebeneName = ebene => (ebene ? GEMEINDE_EBENE_TEXT[ebene].name : "je Kanton verschieden (nicht gefragt)");
  const ebeneVon = e => (e.oeffentlich ? ebeneName(e.ebene) : "— (privat)");
  /** Stufen mit Bild-Karten (kurz) und mit nur eindeutigen Einrichtungen (Vorrat KLAR). */
  const kurzStufen = liste(stufenMit("anliegen").filter(s => ANLIEGEN_STUFE[s].kurz));
  const klarStufen = liste(stufenMit("anliegen").filter(s => ANLIEGEN_STUFE[s].pool === KLAR));
  const schwierigkeit = { 1: "einfach", 2: "mittel", 3: "Falle" };
  const nrVon = situation => GEMEINDE_NOTRUF.find(n => n.situationen.includes(situation));

  LS.listenPruefung("gemeinde-helfer", {
    anliegen: {
      beschreibung: `Das Kind legt ein Anliegen in den Korb der Einrichtung, die hilft (${koerbeText}; Stufe ${klarStufen} nur `
        + "eindeutige Einrichtungen). Zu den Körben gehört das Ziel, der nächstliegende Ablenker, wenn die Stufe ihn "
        + "kennt, und weitere zufällig. Bei einer Falle zeigt ein falscher Ablenker-Korb den eigenen Hinweis, sonst „Was "
        + `sie tut“. Weitere Aufgaben: Notrufnummern (${stufenText("notruf")}), öffentlich oder privat `
        + `(${stufenText("sphaere")}), zuständige Stellen in Schule und Gemeinde (${stufenText("stelle")}), `
        + `Gemeinde, Kanton oder Bund (${stufenText("ebene")}) und der Weg eines Anliegens (${stufenText("ablauf")}).`,
      abschnitte: [{
        id: "einrichtung", titel: "Einrichtungen", spalten: ["Bild", "Name", "Was sie tut", "Umschreibung (Tipp)", "Ebene", "Korb in Stufen"],
        hinweis: "Gruppen wie die Körbe bei „Öffentlich oder privat?“ "
          + `(${stufenText("sphaere")}, jede Einrichtung kommt dort vor). Gehört die Einrichtung in der Schweiz eindeutig `
          + "allen in der Gemeinde (öffentlich) oder einer Person oder Firma (privat)? Stimmt „Was sie tut“ (erscheint nach "
          + "einem falschen Korb) und nennt es keine andere Einrichtung? Nennt die Umschreibung den Namen nicht? Steht "
          + `Stufe ${klarStufen} unter „Korb in Stufen“, gilt die Einrichtung als eindeutig genug für die jüngsten Kinder: `
          + "Stimmt das? Zeigt das Bild eindeutig das Gemeinte?",
        eintraege: () => GEMEINDE_EINRICHTUNGEN,
        gruppe: e => SPHAERE[e.oeffentlich ? "oeffentlich" : "privat"].text,
        zeile: e => [e.bild, e.name, e.tut, e.umschreibung, ebeneVon(e), liste(korbStufen(e))],
      }, {
        id: "anliegen", titel: "Anliegen: Wer hilft?", spalten: ["Anliegen", `Bild-Karte (Stufe ${kurzStufen})`, "Art", "Ablenker", "Hinweis bei der Falle", "Stufen"],
        hinweis: "Je richtiger Einrichtung eine Gruppe. Gehört das Anliegen in der Schweiz eindeutig dorthin? Der Ablenker "
          + "steht in den Stufen in Klammern sicher als Korb daneben, weitere Körbe kommen zufällig aus den Einrichtungen der "
          + "Stufe dazu (Spalte „Korb in Stufen“ oben): Passt keiner davon ebenso (etwa die Sammelstelle beim Werkhof, "
          + "PET-Flaschen im Supermarkt)? Verrät der Hinweis bei der Falle das Ziel nicht? Zeigt die Bild-Karte das Anliegen?",
        eintraege: () => GEMEINDE_ANLIEGEN,
        gruppe: a => mitBild(E[a.ziel]),
        zeile: a => {
          const fest = anliegenStufen(a).filter(s => ablenkerAlsKorb(a, ANLIEGEN_STUFE[s]));
          const ablenker = mitBild(E[a.ablenker]) + (fest.length ? ` (sicher als Korb: ${fest.length === 1 ? "Stufe" : "Stufen"} ${liste(fest)})` : " (nie sicher als Korb)");
          return [a.satz, a.kurz || "—", schwierigkeit[a.schwierigkeit], ablenker, a.hinweis || "—", liste(anliegenStufen(a))];
        },
      }, {
        id: "notruf", titel: "Notrufnummern", spalten: ["Nummer", "Stelle", "Bild"],
        hinweis: `${stufenText("notruf")}. Stimmen Nummer und Stelle für die Schweiz? Die 112 fragt das Spiel nur `
          + "mit eigener Frage (sonst wäre sie immer auch richtig): Stimmt die Frage?",
        eintraege: () => [...GEMEINDE_NOTRUF, GEMEINDE_NOTRUF_EUROPA],
        zeile: n => [n.nummer, n.name || n.frage, n.bild || "—"],
      }, {
        id: "situation", titel: "Notruf: Welche Nummer rufst du?", spalten: ["Situation"],
        hinweis: "Je Nummer eine Gruppe; zur Wahl stehen immer 117, 118 und 144. Braucht die Situation eindeutig diese "
          + "Nummer und keine der beiden anderen (etwa bei einem Unfall mit Verletzten auch 144)? Ist sie für Kinder passend?",
        eintraege: () => GEMEINDE_NOTRUF.flatMap(n => n.situationen),
        gruppe: s => { const n = nrVon(s); return `${n.nummer} ${n.bild} ${n.name}`; },
        zeile: s => [s],
      }, {
        id: "stelle", titel: "Zuständige Stellen", spalten: ["Bild", "Name", "Was sie tut", "Umschreibung (Tipp)"],
        hinweis: `${stufenText("stelle")}. Stimmt „Was sie tut“ für Schule und Gemeinde, und nennt die Umschreibung `
          + "den Namen nicht?",
        eintraege: () => GEMEINDE_STELLEN,
        zeile: s => [s.bild, s.name, s.tut, s.umschreibung],
      }, {
        id: "stelle-anliegen", titel: "Wer ist zuständig?", spalten: ["Anliegen", "Ablenker (immer dabei)"],
        hinweis: "Je zuständiger Stelle eine Gruppe. Zur Wahl stehen die richtige Stelle, der Ablenker und zwei weitere "
          + "zufällig aus den fünf Stellen: Ist die Stelle eindeutig zuständig, und ist keine der anderen vier ebenso "
          + "richtig (etwa die Schulleitung, wenn ein Kind geärgert wird)?",
        eintraege: () => GEMEINDE_STELLEN_ANLIEGEN,
        gruppe: a => mitBild(S[a.ziel]),
        zeile: a => [a.satz, mitBild(S[a.ablenker])],
      }, {
        id: "ebene", titel: "Gemeinde, Kanton oder Bund?", spalten: ["Bild", "Name"],
        hinweis: `${stufenText("ebene")}. Je Ebene eine Gruppe. Ist die Ebene in der ganzen Schweiz eindeutig `
          + "zuständig (nicht je Kanton verschieden)? Zeigt das Bild eindeutig das Gemeinte?",
        eintraege: () => GEMEINDE_EBENEN,
        gruppe: x => ebeneName(x.ebene),
        zeile: x => [x.bild, x.name],
      }, {
        id: "ebene-text", titel: "Die drei Ebenen (Knöpfe)", spalten: ["Bild", "Ebene", "Erklärung"],
        hinweis: "Die Erklärung steht klein auf dem Knopf und im Hinweis. Stimmt sie, und versteht sie ein Kind dieser Stufe?",
        eintraege: () => Object.values(GEMEINDE_EBENE_TEXT),
        zeile: t => [t.bild, t.name, t.erklaerung],
      }, {
        id: "ablauf", titel: "Der Weg eines Anliegens", spalten: ["Bild", "Anliegen", "Schritte der Reihe nach", "Ablage (kurz)"],
        hinweis: `${stufenText("ablauf")}: Das Kind tippt die fünf Schritte der Reihe nach an. Ist die Reihenfolge `
          + "eindeutig, und stimmt der Weg vereinfacht für eine Schweizer Gemeinde (wer meldet, wer entscheidet, wer baut)? "
          + "Passt die Kurzform in der Ablage zum Schritt?",
        eintraege: () => GEMEINDE_ABLAEUFE,
        zeile: ab => [ab.bild, ab.titel, ab.schritte.map((s, i) => `${i + 1}. ${s.text}`).join(" "), ab.schritte.map(s => s.kurz).join(" → ")],
      }],
    },
  });
}
