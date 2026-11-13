/* Prüfansicht des Gefühle-Radars (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „situationen“ mit gemischtem Inhalt, darum ein Abschnitt je Vorrat aus situationen.js, jeder für sich
   abzuhaken: Gefühle (Gesichter und Ablenker), Bilder, Sätze, Situationen (Gruppe 3 und Gruppe 4 getrennt, weil sie in
   verschiedenen Stufen mit verschiedenen Gefühlen laufen), Körpersignale, Gespräche, Gefühlspaare, Antworten.
   Die Stufen je Abschnitt liest die Ansicht aus der Stufentabelle des Spiels (STUFE), die Gefühle zeigt sie mit
   gefuehlInhalt und paarInhalt wie auf den Knöpfen, die Tipps zum Gesicht und zum Satz aus GESICHT_TIPP und
   SIGNAL_TIPP. Zu prüfen: Passt das Gefühl eindeutig, lässt sich kein Ablenker ebenso begründen, und ist die
   Situation für Kinder der 2. bis 4. Klasse passend und nicht belastend? */
"use strict";
{
  const gf = id => { const g = gefuehlInhalt(id); return `${g.bild} ${g.text}`; };
  const gfListe = ids => ids.map(gf).join(", ");
  const paarText = paar => { const p = paarInhalt(paarKey(paar)); return `${p.bild} ${p.text}`; };
  /** Stufen, in denen eine Aufgabenart vorkommt (aus STUFE), als „Stufe 1“ oder „Stufen 1, 3“. */
  const stufenVon = (art, gruppe) => {
    const s = Object.entries(STUFE).filter(([, p]) => p.arten.includes(art) && (gruppe == null || p.gruppe === gruppe)).map(([k]) => k.slice(1));
    return `${s.length > 1 ? "Stufen" : "Stufe"} ${s.join(", ")}`;
  };
  const gruppeGrund = STUFE.s3.gruppe, gruppeFein = STUFE.s4.gruppe;
  const nachGefuehl = e => gf(e.gefuehl);

  LS.listenPruefung("gefuehle-radar", {
    situationen: {
      beschreibung: `Gefühle erkennen (D.1.C.1). ${stufenVon("gesicht")}: ein grosses Gesicht → Gefühl, oder → was passiert ist (Bild). `
        + `${stufenVon("satz")}: ein Satz zum Anhören → Gefühl. ${stufenVon("situation", gruppeGrund)}: zwei Sätze oder Körpersignale → Grundgefühl. `
        + `${stufenVon("situation", gruppeFein)}: zwei Personen, feinere Gefühle, gefragt ist eine von ihnen. `
        + `${stufenVon("gespraech")}: ein Gespräch → Stimmung der zweiten Person, dann was ihr hilft. `
        + `${stufenVon("paar")}: zwei Gefühle zugleich, oder die passende freundliche Antwort. Stufen 1–3 nur Grundgefühle.`,
      abschnitte: [
        { id: "gefuehl", titel: "Gefühle mit Gesichtern", spalten: ["Gefühl", "Gesichter (Stufe 1)", "klar unpassend (Ablenker Stufe 1)", "Tipp zum Gesicht", "Tipp zum Satz"],
          hinweis: "Zeigt jedes Gesicht dieses Gefühl und kein anderes? Passt jeder Ablenker klar nicht zum Gesicht? Die Tipps beschreiben, was man sieht oder tut, und nennen das Gefühl nicht. Grundgefühle laufen ab Stufe 1, feinere erst ab Stufe 4.",
          eintraege: () => GS_GEFUEHLE, gruppe: g => (g.gruppe === "grund" ? "Grundgefühle (ab Stufe 1)" : "feinere Gefühle (ab Stufe 4)"),
          zeile: g => [gf(g.id), g.gesichter.join(" "), gfListe(g.ablenker), GESICHT_TIPP[g.id] || "–", SIGNAL_TIPP[g.id] || "–"] },
        { id: "bild", titel: `Was ist passiert? Bilder (${stufenVon("bild")})`, spalten: ["Bild", "Wort", "Gefühl"],
          hinweis: "Je Gefühl eine Gruppe. Das Kind sieht ein Gesicht und wählt eins von drei Bildern; die beiden anderen stammen von Gefühlen, die zu diesem Gesicht klar nicht passen. Weckt das Bild bei fast jedem Kind genau dieses Gefühl? Ist nichts darunter, das ängstigt, über eine Alltagsangst hinaus?",
          eintraege: () => GS_BILDER, gruppe: nachGefuehl, zeile: b => [b.bild, b.text, gf(b.gefuehl)] },
        { id: "satz", titel: `Sätze zum Anhören (${stufenVon("satz")})`, spalten: ["Satz", "Gefühl", "Ablenker"],
          hinweis: "Je Gefühl eine Gruppe. Der Satz wird vorgesprochen; das Kind wählt aus drei Gefühlen. Zeigt der Satz das Gefühl eindeutig (Tun oder Sagen), und passt kein Ablenker ebenso?",
          eintraege: () => GS_SAETZE, gruppe: nachGefuehl, zeile: s => [s.satz, gf(s.gefuehl), gfListe(s.ablenker)] },
        { id: "situation3", titel: `Situationen mit einem Kind (${stufenVon("situation", gruppeGrund)})`, spalten: ["Situation", "Gefühl", "Ablenker", "dritter Tipp"],
          hinweis: "Je Gefühl eine Gruppe. Zwei Sätze, Grundgefühle, vier Knöpfe. Ist das Gefühl eindeutig, lässt sich kein Ablenker ebenso begründen? Ist die Situation für Kinder der 3. Klasse passend und nicht belastend? Der Tipp nennt das Gefühl nicht.",
          eintraege: () => GS_SITUATIONEN.filter(s => s.gruppe === gruppeGrund), gruppe: nachGefuehl,
          zeile: s => [s.text, gf(s.gefuehl), gfListe(s.ablenker), s.tipp] },
        { id: "koerper", titel: `Körpersignale (${stufenVon("koerper")})`, spalten: ["Satz", "Gefühl", "Ablenker"],
          hinweis: "Je Gefühl eine Gruppe. Das Kind liest oder hört, was der Körper tut, und wählt aus vier Grundgefühlen. Zeigen die Signale nur dieses Gefühl (Zittern etwa auch bei Kälte, Zusammenzucken auch bei Angst)?",
          eintraege: () => GS_KOERPER, gruppe: nachGefuehl, zeile: s => [s.satz, gf(s.gefuehl), gfListe(s.ablenker)] },
        { id: "situation4", titel: `Situationen mit zwei Personen (${stufenVon("situation", gruppeFein)})`, spalten: ["Situation", "gefragt ist", "Gefühl", "Ablenker", "dritter Tipp"],
          hinweis: "Je Gefühl eine Gruppe. Feinere Gefühle, gefragt ist eine der beiden Personen. Ist das feinere Gefühl eindeutig (stolz statt froh, erleichtert statt froh, nervös statt ängstlich)? Lässt sich kein Ablenker ebenso begründen? Der Tipp nennt das Gefühl nicht.",
          eintraege: () => GS_SITUATIONEN.filter(s => s.gruppe === gruppeFein), gruppe: nachGefuehl,
          zeile: s => [s.text, s.wer, gf(s.gefuehl), gfListe(s.ablenker), s.tipp] },
        { id: "gespraech", titel: `Gespräche (${stufenVon("gespraech")})`, spalten: ["Gespräch", "Stimmung der zweiten Person", "Ablenker", "Frage im 2. Schritt", "passt", "nett, aber unpassend"],
          hinweis: "Zuerst die Stimmung der zweiten Person (vier Knöpfe), dann was ihr hilft oder zu ihr passt. Ist die Stimmung eindeutig? Hilft die richtige Antwort wirklich, und sind die beiden anderen nett, aber klar unpassend, nie gemein?",
          eintraege: () => GS_GESPRAECHE,
          zeile: g => [`${g.a[0]}: ${g.a[1]} — ${g.b[0]}: ${g.b[1]}`, gf(g.gefuehl), gfListe(g.ablenker),
            // Wortlaut wie im Spiel (ZEICHNE.gespraech, Schritt 2): nach dem Feld positiv des Gefühls
            GEFUEHL[g.gefuehl].positiv ? `Was passt jetzt zu ${g.b[0]}?` : `Was könnte ${g.b[0]} jetzt helfen?`,
            g.hilfe.richtig, g.hilfe.falsch.join(" / ")] },
        { id: "paar", titel: `Zwei Gefühle zugleich (${stufenVon("paar")})`, spalten: ["Geschichte", "richtiges Paar", "Ablenker-Paare", "dritter Tipp"],
          hinweis: "Passen beide Gefühle des Paars, und ist keins der drei anderen Paare ebenso begründbar? Jedes Ablenker-Paar soll mindestens ein klar unpassendes Gefühl enthalten. Der Tipp nennt kein Gefühl.",
          eintraege: () => GS_PAARE, zeile: p => [p.text, paarText(p.paar), p.ablenker.map(paarText).join(" / "), p.tipp] },
        { id: "reaktion", titel: `Passende Antwort (${stufenVon("reaktion")})`, spalten: ["Situation", "passende Antwort", "unpassend"],
          hinweis: "Geht die passende Antwort auf Stimmung und Inhalt ein? Sind die beiden anderen klar unpassend, aber nicht gemein? Ist die Situation für Kinder dieses Alters nicht belastend?",
          eintraege: () => GS_REAKTIONEN, zeile: r => [r.text, r.richtig, r.falsch.join(" / ")] },
      ],
    },
  });
}
