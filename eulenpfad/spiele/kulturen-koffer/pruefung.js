/* Prüfansicht des Kulturen-Koffers (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „dinge“ mit gemischtem Inhalt, darum ein Abschnitt je Inhalt, jeder für sich abzuhaken: Kulturen, Dinge je
   Kultur, Dinge von heute, Erzählsätze, Aussagen, „Gab es das schon?“, Quellenarten, Quellen und Rätsel. Die Stufen der
   Dinge rechnet das Spiel selbst (dingPool je Stufe aus ZUORDNEN, ALT und ROEMER_BILD für Stufe 1), Aussagen und Fragen
   nach China und den Griechen kulturInStufe, die Frage gabFrage — alles wie im Spiel. Die Körbe daneben sind die übrigen
   Kulturen der Stufe ohne die in „auch“; die Spalte „Passt auch zu“ zeigt diese Ausnahmen. */
"use strict";
{
  const nummer = s => s.slice(1);
  const liste = stufen => stufen.map(nummer).join(", ") || "—";
  const kulturName = id => K[id]?.name || id;
  /** Stufen, in denen die Aufgabenart 'art' vorkommt (STUFE). */
  const stufenMit = art => Object.keys(STUFE).filter(s => STUFE[s].includes(art));
  const stufenText = art => { const s = stufenMit(art); return `${s.length === 1 ? "Stufe" : "Stufen"} ${liste(s)}`; };
  /** Stufen, in denen das Ding vorkommt: Stufe 1 (früher oder heute, Römer-Wahl) und Zuordnen nach dingPool. */
  const dingStufen = d => {
    const teile = [];
    const eins = [ALT.includes(d) && "früher/heute", ROEMER_BILD.includes(d) && "Römer-Wahl"].filter(Boolean);
    if (eins.length) teile.push(`1 (${eins.join(", ")})`);
    const zuordnen = stufenMit("zuordnen").filter(s => dingPool(s).includes(d)).map(nummer);
    if (zuordnen.length) teile.push(zuordnen.join(", "));
    return teile.join(", ") || "—";
  };
  /** „Stufe 2: Pfahlbauer, Römer (2 Körbe, nur mit Bild) · …“ aus ZUORDNEN. */
  const zuordnenText = Object.entries(ZUORDNEN).filter(([s]) => STUFE[s].includes("zuordnen"))
    .map(([s, p]) => `Stufe ${nummer(s)}: ${p.kulturen.map(kulturName).join(", ")} (${p.n} Körbe${p.nurBild ? ", nur Dinge mit Bild" : ""})`)
    .join(" · ");
  const jaNein = b => (b ? "ja" : "nein");
  const abNeu = nummer(Object.keys(STUFE).find(s => NEU.every(kultur => kulturInStufe({ kultur }, s))));
  const inStufen = x => liste(stufenMit(x.ding ? "gab" : "aussage").filter(s => kulturInStufe(x, s)));

  LS.listenPruefung("kulturen-koffer", {
    dinge: {
      beschreibung: "Das Kind ordnet Dinge, Bauten, Berufe und Begriffe alten Kulturen zu: in Stufe 1 „Früher oder heute?“ "
        + `und „Was gehört zu den Römern?“, beim Zuordnen ${zuordnenText}. Dazu Erzählsätze „Wer erzählt hier?“ (`
        + `${stufenText("erzaehl")}), Aussagen „Stimmt das?“ (${stufenText("aussage")}), „Gab es das schon?“ (`
        + `${stufenText("gab")}), Quellenarten (${stufenText("quelle")}) und „Welche Kultur bin ich?“ (`
        + `${stufenText("raetsel")}). ${NEU.map(kulturName).join(" und ")} kommen erst ab Stufe ${abNeu}.`,
      abschnitte: [{
        id: "kultur", titel: "Kulturen (Körbe)", spalten: ["Bild", "Name", "Kurz (Tipp und Hinweis)", "Ort in Fragen", "Wer", "In der Schweiz"],
        hinweis: "„Kurz“ erscheint nach einem falschen Korb und als Tipp. Stimmen Ort und Zeit („vor über 2000 Jahren“, "
          + "„vor mehreren tausend Jahren“)? Ist der Satz respektvoll und ohne Klischee oder Verallgemeinerung? Nennt er keine "
          + "andere Kultur? Zeigt das Bild die Kultur eindeutig und ohne Klischee?",
        eintraege: () => KK_KULTUREN,
        zeile: k => [k.bild, k.name, k.kurz, k.bei, k.leute, jaNein(k.schweiz)],
      }, {
        id: "ding", titel: "Dinge zuordnen", spalten: ["Bild", "Name", "Umschreibung (Tipp)", "Passt auch zu", "Stufen"],
        hinweis: "Je Kultur eine Gruppe. Gehört das Ding eindeutig zu dieser Kultur? Alle anderen Kulturen der Stufe ausser "
          + "denen in „Passt auch zu“ können als falsche Körbe daneben stehen: Passt das Ding zu keiner davon ebenso? "
          + "Stimmt die Umschreibung, nennt sie weder Ding noch Kultur? Zeigt das Bild das Ding so, wie es damals aussah? "
          + "Stufe 1: Ist das Ding eindeutig „von früher“?",
        eintraege: () => KK_DINGE,
        gruppe: d => kulturName(d.kultur),
        zeile: d => [d.bild || "—", d.name, d.umschreibung, (d.auch || []).map(kulturName).join(", ") || "—",
          dingStufen(d)],
      }, {
        id: "heute", titel: `Dinge von heute (${stufenText("altHeute")})`, spalten: ["Bild", "Name", "Umschreibung (Tipp)"],
        hinweis: "Korb „Heute“ bei „Früher oder heute?“ und falscher Knopf bei „Was gehört zu den Römern?“. Braucht das Ding "
          + "eindeutig Strom oder einen Motor, gab es also damals sicher nicht? Zeigt das Bild es eindeutig?",
        eintraege: () => KK_HEUTE,
        zeile: d => [d.bild, d.name, d.umschreibung],
      }, {
        id: "satz", titel: "Wer erzählt hier?", spalten: ["Satz"],
        hinweis: `${stufenText("erzaehl")}, Körbe immer ${ZUORDNEN.s3.kulturen.map(kulturName).join(", ")}. Je Kultur `
          + "eine Gruppe. Passt der Satz eindeutig nur zu dieser Kultur, ohne ihren Namen zu nennen? Stimmt die Sache?",
        eintraege: () => KK_SAETZE,
        gruppe: s => kulturName(s.kultur),
        zeile: s => [s.satz],
      }, {
        id: "aussage", titel: "Stimmt das?", spalten: ["Aussage", "Stimmt", "Begründung", "Stufen"],
        hinweis: "Je Kultur eine Gruppe. Ist die Aussage eindeutig wahr oder falsch, und stimmt die Begründung (erscheint "
          + "nach der Antwort)? Verallgemeinert sie nicht über die Menschen einer Kultur? Stimmen die Zeitangaben "
          + "(„seit etwa 150 Jahren“)?",
        eintraege: () => KK_AUSSAGEN,
        gruppe: x => kulturName(x.kultur),
        zeile: x => [x.text, jaNein(x.wahr), x.grund, inStufen(x)],
      }, {
        id: "gab", titel: "Gab es das schon?", spalten: ["Bild", "Ding", "Frage", "Antwort", "Begründung", "Stufen"],
        hinweis: "Je Kultur eine Gruppe. Ist Ja oder Nein eindeutig, und stimmt die Begründung? Zeigt das Bild das Ding, ohne "
          + "die Antwort vorwegzunehmen?",
        eintraege: () => KK_GAB,
        gruppe: g => kulturName(g.kultur),
        zeile: g => [g.bild, g.ding, gabFrage(g), jaNein(g.ja), g.grund, inStufen(g)],
      }, {
        id: "quellenart", titel: "Quellenarten (Knöpfe)", spalten: ["Bild", "Name", "Erklärung"],
        hinweis: `${stufenText("quelle")}; die Erklärung steht klein auf dem Knopf. Sind die vier Arten klar `
          + "voneinander getrennt?",
        eintraege: () => Object.values(KK_QUELLENARTEN),
        zeile: q => [q.bild, q.name, q.erklaerung],
      }, {
        id: "quelle", titel: "Woher wissen wir das?", spalten: ["Bild", "Quelle", "Kultur", "passt auch (nie zur Wahl)"],
        hinweis: `${stufenText("quelle")}. Je Quellenart eine Gruppe. Ist die Quelle eindeutig von dieser Art und von `
          + "keiner anderen? Passt eine zweite Art ebenso (etwa die Malerei auf einer Vase: Bild und Fundstück), steht sie unter "
          + "„passt auch“ und nie zur Wahl. Nennt der Text die Art nicht? Stimmt die Sache, und gehört sie zur Kultur?",
        eintraege: () => KK_QUELLEN,
        gruppe: q => KK_QUELLENARTEN[q.art]?.name || q.art,
        zeile: q => [q.bild, q.text, kulturName(q.kultur), (q.auch || []).map(id => KK_QUELLENARTEN[id].name).join(", ") || "—"],
      }, {
        id: "raetsel", titel: "Welche Kultur bin ich?", spalten: ["Hinweis 1", "Hinweis 2", "Hinweis 3"],
        hinweis: `${stufenText("raetsel")}, zur Wahl alle fünf Kulturen. Je Kultur eine Gruppe. Gehen die Hinweise `
          + "vom Allgemeinen zum Konkreten, passt der dritte nur zu dieser Kultur, und nennt keiner ihren Namen? Stimmen "
          + "die Sachangaben, ohne Klischee?",
        eintraege: () => KK_RAETSEL,
        gruppe: r => kulturName(r.kultur),
        zeile: r => [...r.hinweise],
      }],
    },
  });
}
