/* Prüfansicht des Stromkreis-Bauers (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Fünf Listen aus bauteile.js: vier Listen mit Schaltbildern (SCHALTUNGEN, je Liste ein Abschnitt) und die Liste
   „leiter“ mit zwei Inhalten, je für sich abzuhaken: die Gegenstände (GEGENSTAENDE) und die Schaltbilder mit Lücke.
   Ob eine Lampe brennt, steht nicht in den Daten, das Spiel rechnet es aus dem Schaltbild aus — die Ansicht zeigt es
   deshalb mit den Funktionen des Spiels: das Bild zeichnet schaltbild und lässt mit zeigeLicht die Lampen leuchten,
   die nach ergebnis brennen; „Lösungstext“ ist loesungText (bei einer Warum-Frage ist sein einziger Grund die Antwort,
   warumGrund; bei der Lücke steht er in einer eigenen Spalte), die Zeile unter der Frage zusatzText. Die Spalte „Stufen“ liest die Stufentabelle des Spiels (STUFE_ARTEN, aus der es
   auch seine Aufgaben baut) mit seiner Auswahl je Art (KANDIDATEN, über alle Einträge ohne Freigabe: VORRAT_ALLE).
   Zu prüfen: Stimmt jede Zuordnung Leiter / Nichtleiter, zeigt das Bild die Schaltung eindeutig, stimmt das Ergebnis
   (brennt, Kurzschluss, welche Lampen), und passt der Grund in der Warum-Frage als einziger. */
"use strict";
{
  /** Aufgabenarten des Spiels (STUFE_ARTEN, erstes Feld) in Worten, wie das Kind sie sieht. */
  const ART = {
    brennt: "Brennt die Lampe?",
    korb: "Korb: leitet / leitet nicht",
    warum: "Warum brennt die Lampe nicht?",
    kurz: "Brennt die Lampe? / Gibt es einen Kurzschluss?",
    welche: "Welche Lampen brennen?",
  };
  /** Kurz für die Spalte „Stufen“ (Kurzschluss = Art kurz: Brennt die Lampe? oder Gibt es einen Kurzschluss?). */
  const ART_KURZ = { brennt: "Brennt?", korb: "Korb", warum: "Warum?", kurz: "Kurzschluss", welche: "Welche?" };
  const nummer = s => s.slice(1);
  /** Je Stufe und Art die Auswahl des Spiels über alle Einträge — Paare, Gegenstände oder Schaltungen. */
  const AUSWAHL = Object.entries(STUFE_ARTEN).flatMap(([stufe, arten]) =>
    arten.map(([art, ...angaben]) => ({ stufe, art, nimmt: KANDIDATEN[art](VORRAT_ALLE, ...angaben) })));
  /** Nimmt diese Auswahl die Schaltung i oder den Gegenstand d? */
  const nimmtSchaltung = ({ art, nimmt }, i) => (art === "brennt" || art === "warum" ? nimmt.some(p => p[0] === i)
    : art === "korb" ? false : nimmt.some(s => s.i === i));
  const nimmtDing = ({ art, nimmt }, d) => (art === "brennt" || art === "warum" ? nimmt.some(p => p[1] === d)
    : art === "korb" ? nimmt.includes(d) : false);
  /** „2: Brennt? · 4: Warum?, Brennt?“ — je Stufe ihre Arten, jede nur einmal. */
  function stufenText(treffer) {
    const jeStufe = new Map();
    for (const a of AUSWAHL) if (treffer(a)) jeStufe.set(a.stufe, new Set([...(jeStufe.get(a.stufe) || []), ART_KURZ[a.art]]));
    return [...jeStufe].map(([stufe, arten]) => `${nummer(stufe)}: ${[...arten].join(", ")}`).join(" · ") || "—";
  }
  /** „Brennt die Lampe? (Stufen 1, 2); Warum …? (4, 6)“ für alle Einträge eines Abschnitts. */
  function stufenUeberblick(treffer) {
    const jeArt = new Map();
    for (const a of AUSWAHL) if (treffer(a)) jeArt.set(a.art, new Set([...(jeArt.get(a.art) || []), nummer(a.stufe)]));
    return [...jeArt].map(([art, st]) => `${ART[art]} (Stufe ${[...st].join(", ")})`).join("; ");
  }

  const schVon = e => SCH[SCHALTUNGEN.indexOf(e)];
  const dingVon = e => GEGENSTAENDE.indexOf(e);
  const roh = liste => () => SCHALTUNGEN.filter(e => e[0] === liste);
  const LEITER = GEGENSTAENDE.find(g => g[2]);
  const NICHTLEITER = GEGENSTAENDE.find(g => !g[2]);
  /** Platzhalter für die Lücke im Bild der Schaltungen der Liste leiter (der Gegenstand kommt erst in der Aufgabe). */
  const LUECKE = ["❔", "Gegenstand"];

  /** Schaltbild, wie das Spiel es zeichnet, mit leuchtenden Lampen nach seinem Ergebnis. */
  function bildVon(s, g, mitLicht = true) {
    const svg = schaltbild(s, g);
    svg.style.width = "200px";
    svg.style.margin = "0";
    if (mitLicht) zeigeLicht(svg, ergebnis(s, g).brennt);
    return svg;
  }
  /** Ergebnis in Worten: eine Lampe brennt / brennt nicht; mehrere: welcheText des Spiels. */
  function lampeText(s, g) {
    const e = ergebnis(s, g);
    const t = lampenVon(s).length === 1 ? (e.brennt.size ? "brennt" : "brennt nicht") : welcheText(e.brennt, lampenVon(s));
    return e.kurzschluss ? `${t} (Kurzschluss)` : t;
  }
  const warumText = (s, g) => { const k = warumGrund(s, g); return k ? GRUENDE[k] : "—"; };
  const aufbauText = s => s.text + (s.zusatz ? ` (${s.zusatz})` : "");
  /** Lösungstext der Frage „Brennt die Lampe?“ (Schaltungen mit einer Lampe). */
  const loesung = (s, g) => loesungText({ art: "brennt" }, s, g, ergebnis(s, g));

  const LEGENDE = "Aufbau: drei Plätze oben, rechts, unten (Batterie links); D Draht, L Lampe, S1 / S0 Schalter zu / offen, "
    + "X Draht lose, G Lücke; LA0 = Lampe A herausgedreht; [ … / … ] zwei Zweige. Zusatz: pol = beide Drähte am Pluspol, "
    + "umgekehrt = Batterie andersherum, kurz:<Platz> = zusätzlicher Draht (orange). ";
  const WARUM = `Steht „Warum?“ bei den Stufen, ist der Grund im Lösungstext (bei der Lücke: in der Spalte „Warum?“) die richtige Antwort; daneben stehen zwei andere aus ${Object.keys(GRUENDE).length} Gründen `
    + `(${Object.values(GRUENDE).map(t => `„${t}“`).join(", ")}), zufällig gewählt, zuerst solche, deren Teil (Schalter, Gegenstand, oranger Draht) im Bild vorkommt: Keiner davon darf auf das Bild auch passen.`;

  /** Abschnitt für eine Liste mit Schaltbildern ohne Lücke; mitKurz: mit der Kurzschluss-Frage. */
  const schaltAbschnitt = (liste, titel, hinweis, gruppe, mitKurz) => ({
    id: liste, titel, hinweis: LEGENDE + hinweis,
    spalten: ["Aufbau", ...(mitKurz ? ["Kurzschluss?"] : []), "Lösungstext (Brennt?)", "Stufen"],
    eintraege: roh(liste), bild: e => bildVon(schVon(e), null), gruppe: e => gruppe(schVon(e)),
    zeile: e => {
      const s = schVon(e);
      return [aufbauText(s), ...(mitKurz ? [ergebnis(s, null).kurzschluss ? "ja" : "nein"] : []), loesung(s, null),
        stufenText(a => nimmtSchaltung(a, s.i))];
    },
  });
  const listeTrifft = liste => a => SCH.some(s => s.liste === liste && nimmtSchaltung(a, s.i));

  const ZUSATZ = { "": "Batterie, Drähte an beiden Polen", pol: "beide Drähte am Pluspol", umgekehrt: "Batterie umgekehrt (Minuspol oben)" };
  const UEBER = { batterie: "über die Batterie", oben: "über den Platz oben", rechts: "über den Platz rechts", unten: "über den Platz unten" };
  const lampenGruppe = s => (s.kurz ? "mit zusätzlichem Draht (orange)"
    : `${lampenVon(s).length} Lampen, ${s.parallel ? "mit Verzweigung (parallel)" : "in Serie"}`);

  LS.listenPruefung("stromkreis-bauer", {
    einfach: {
      beschreibung: `Schaltbilder mit Batterie, einer Lampe und Drähten: geschlossen, ein Draht lose, beide Drähte am selben Pol, Batterie umgekehrt. ${stufenUeberblick(listeTrifft("einfach"))}. Stufe 1 nur ohne Zusatz.`,
      abschnitte: [schaltAbschnitt("einfach", "Schaltbilder: Batterie, Lampe, Drähte",
        `Brennt die Lampe so, wie der Lösungstext sagt, und zeigt das Bild es eindeutig (loser Draht, beide Drähte am Pluspol)? ${WARUM}`,
        s => ZUSATZ[s.zusatz], false)],
    },
    schalter: {
      beschreibung: `Schaltbilder mit einem Schalter, offen oder geschlossen, einige mit losem Draht. ${stufenUeberblick(listeTrifft("schalter"))}.`,
      abschnitte: [schaltAbschnitt("schalter", "Schaltbilder mit Schalter",
        `Ist im Bild klar, ob der Schalter offen oder zu ist? Mit offenem Schalter und losem Draht zugleich gibt es keine Warum-Frage (zwei Gründe). ${WARUM}`,
        s => (plaetze(s).includes("S0") ? "Schalter offen" : "Schalter geschlossen"), false)],
    },
    leiter: {
      beschreibung: `Gegenstände, die leiten oder nicht, und Schaltbilder mit einer Lücke, in die ein Gegenstand kommt. ${stufenUeberblick(a => GEGENSTAENDE.some((g, d) => nimmtDing(a, d)))}. Knifflige Gegenstände erst ab Stufe 4.`,
      abschnitte: [
        { id: "gegenstand", titel: "Gegenstände: leitet den Strom?", spalten: ["Gegenstand", "leitet", "knifflig", "Tipp 2", "Lösungstext", "Stufen"],
          hinweis: `Stimmt die Zuordnung ohne Zweifel für den Gegenstand, wie ihn ein Kind kennt (Bild und Name)? Knifflige kommen erst ab Stufe 4. Hinweis nach falscher Antwort im Korb: „${HINWEIS.korb}“ — passt er zu jedem Gegenstand?`,
          eintraege: () => GEGENSTAENDE, gruppe: g => ANTWORT.korb[g[2] ? "leitet" : "nicht"].text,
          zeile: g => [`${g[0]} ${g[1]}`, g[2] ? "ja" : "nein", g[3] ? "ja" : "—", tippsFuer({ art: "korb" }, null, g)[1],
            loesungText({ art: "korb" }, null, g, null), stufenText(a => nimmtDing(a, dingVon(g)))] },
        { id: "luecke", titel: "Schaltbilder mit Lücke", spalten: ["Aufbau", "Lampe mit Leiter / Nichtleiter", "Warum? (mit Nichtleiter)", "Stufen"],
          hinweis: `${LEGENDE}Im Bild steht ❔ für den Gegenstand, der in der Aufgabe in die Lücke kommt. Brennt die Lampe nur, wenn er leitet? ${WARUM}`,
          eintraege: roh("leiter"), bild: e => bildVon(schVon(e), LUECKE, false),
          zeile: e => {
            const s = schVon(e);
            return [aufbauText(s), `${lampeText(s, LEITER)} / ${lampeText(s, NICHTLEITER)}`, warumText(s, NICHTLEITER), stufenText(a => nimmtSchaltung(a, s.i))];
          } },
      ],
    },
    kurzschluss: {
      beschreibung: `Schaltbilder mit einem zusätzlichen Draht (orange) über die Batterie, die Lampe, einen Draht oder den Schalter. ${stufenUeberblick(listeTrifft("kurzschluss"))}.`,
      abschnitte: [schaltAbschnitt("kurzschluss", "Schaltbilder mit zusätzlichem Draht",
        `Unter der Frage steht immer „${zusatzText(SCH.find(s => s.liste === "kurzschluss"), null)}“ Kurzschluss heisst im Spiel: Plus- und Minuspol sind ohne Lampe verbunden. Stimmen Lösungstext und „Kurzschluss?“ zum Bild — auch dort, wo der Draht nur einen Draht oder einen offenen Schalter überbrückt (dann brennt die Lampe, kein Kurzschluss)? ${WARUM}`,
        s => UEBER[s.kurz], true)],
    },
    "serie-parallel": {
      beschreibung: `Schaltbilder mit zwei oder drei Lampen in Serie, parallel und gemischt; dazu herausgedrehte Lampen, Schalter und ein zusätzlicher Draht über eine Lampe oder einen Zweig. ${stufenUeberblick(listeTrifft("serie-parallel"))}. Stufe 5 nur zwei Lampen ohne zusätzlichen Draht.`,
      abschnitte: [{ id: "serie-parallel", titel: "Schaltbilder mit mehreren Lampen",
        hinweis: `${LEGENDE}Die Spalte „Lampen“ nennt die Antwort, wie das Kind sie wählt (die anderen Antworten: andere Auswahl der Lampen). Leuchten im Bild genau diese Lampen, und ist die herausgedrehte Lampe (gestrichelt) und der Weg je Zweig klar zu sehen?`,
        spalten: ["Aufbau", "unter der Frage", "Lampen", "Stufen"],
        eintraege: roh("serie-parallel"), bild: e => bildVon(schVon(e), null), gruppe: e => lampenGruppe(schVon(e)),
        zeile: e => {
          const s = schVon(e);
          return [aufbauText(s), zusatzText(s, null) || "—", lampeText(s, null), stufenText(a => nimmtSchaltung(a, s.i))];
        } }],
    },
  });
}
