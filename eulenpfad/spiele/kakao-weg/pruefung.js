/* Prüfansicht des Kakao-Wegs (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „wege“ (woerter.js, WEGE) mit zwei Inhalten, je für sich abzuhaken: die Produkte mit Rohstoff, Herkunft und
   Transport (Stufe 4) und die Schritte jedes Wegs in ihrer Reihenfolge (Stufen 1–3 und 6), je Produkt eine Gruppe mit dem
   Namen wie im Spiel („Weg: Schoggi“). Was das Spiel daraus macht, zeigt die Ansicht mit seinen Funktionen und
   Tabellen: Herkunft (HERKUNFT), Lösung zum Transport (transportText), wer einen Schritt macht (WER; gefragt nur bei
   werSchritte), aus welchen Wegen die falschen Schritte bei „Welcher Schritt fehlt?“ kommen (fremdeSchritte). Die Stufen
   liest die Beschreibung aus der Stufentabelle des Spiels (STUFE, MIT_LISTE). Der Wirtschaftskreislauf (Stufen 5 und 6)
   steht fest im Spiel und ist keine Liste. */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Aufgabenarten mit der Liste (MIT_LISTE) in Worten; ordnen mit der Zahl Schritte aus STUFE. */
  const ART = {
    ordnen: n => (n === "alle" ? "den ganzen Weg ordnen" : `${n} Schritte ordnen`),
    fehlt: () => "Welcher Schritt fehlt?",
    wer: () => "Wer macht das? (Körbe Landwirtschaft, Fabrik, Transport, Grossverteiler, Laden, Haushalt)",
    herkunft: () => "Woher kommt der Rohstoff? (Schweiz oder fernes Land)",
    transport: () => "Wie kommt es zu uns? (Schiff, kurzer Weg oder Flugzeug)",
    verschoben: () => "Welcher Schritt steht am falschen Platz?",
  };
  /** „Stufe 1: 3 Schritte ordnen · Stufe 3: …“ — nur die Arten mit der Liste. */
  const STUFEN_TEXT = Object.entries(STUFE)
    .map(([s, { arten, schritte }]) => [s, arten.filter(a => MIT_LISTE.has(a)).map(a => ART[a](schritte))])
    .filter(([, texte]) => texte.length).map(([s, texte]) => `Stufe ${nummer(s)}: ${texte.join("; ")}`).join(" · ");
  const produktVon = schritt => WEGE.find(p => p.schritte.includes(schritt));
  const kopf = p => `${p.bild} Weg: ${p.name}`;
  /** Wege, aus denen das Spiel falsche Schritte nimmt (fremdeSchritte: nicht derselbe, nicht verwandt). */
  const fremdeWege = p => [...new Set(fremdeSchritte(p).map(f => f.produkt))].map(id => produkt(id).name).join(", ");

  LS.listenPruefung("kakao-weg", {
    wege: {
      beschreibung: "Wege von Produkten vom Rohstoff bis zum Kauf (NMG.6.3): Das Kind ordnet Schritte, ergänzt den fehlenden "
        + "Schritt, sagt, wer einen Schritt macht, woher der Rohstoff kommt und wie er zu uns kommt, und findet den Schritt "
        + `am falschen Platz (${STUFEN_TEXT}). Beim Ordnen mit fünf Schritten sind der erste und der letzte immer dabei. `
        + "Bei „Welcher Schritt fehlt?“ kommen die zwei falschen Antworten aus anderen Wegen, von einer ähnlichen Stelle.",
      abschnitte: [
        { id: "produkt", titel: "Produkte: Rohstoff, Herkunft und Transport (Stufe 4)",
          spalten: ["Produkt", "Rohstoff", "Warum (nach der Antwort)", "Wie kommt es zu uns? (Lösung)", "falsche Schritte aus"],
          hinweis: "Je Herkunft eine Gruppe (Antwort auf „Woher kommt der Rohstoff?“). Kommt der Rohstoff auf diesem Weg eindeutig aus der Schweiz oder aus einem fernen "
            + "Land, und stimmt der Grund? Passt der Transport (das Spiel bietet auch „mit dem Flugzeug“ als falsche Antwort an)? "
            + "Bei „Wie kommt es zu uns?“ steht der erste Schritt des Wegs als Hinweis darunter — nennt er bei fernen Ländern das "
            + "Land? Die letzte Spalte nennt die Wege, aus denen falsche Schritte kommen: verwandte Wege (Milch und Käse) sind "
            + "ausgenommen — fehlt ein Weg, dessen Schritte ebenso passen könnten?",
          eintraege: () => WEGE, gruppe: p => HERKUNFT[p.herkunft]?.text || p.herkunft,
          zeile: p => [`${p.bild} ${p.name}`, p.rohstoff, p.grund, transportText(p.transport), fremdeWege(p)] },
        { id: "schritt", titel: "Schritte der Wege", spalten: ["Nr.", "Bild", "Schritt", "Wer macht das?"],
          hinweis: "Je Produkt eine Gruppe, die Schritte in der richtigen Reihenfolge. Ist die Reihenfolge eindeutig (kein Schritt "
            + "könnte ebenso gut vor oder nach seinem Nachbarn stehen)? Stimmt die Sache, und nennt jeder Satz sein Produkt oder "
            + "seinen Rohstoff, so dass er in keinem anderen Weg passt? „Wer macht das?“: Ist der Korb eindeutig? „—“ heisst: Das "
            + "Spiel fragt bei diesem Schritt nicht. Passt das Bild zum Satz?",
          eintraege: () => WEGE.flatMap(p => p.schritte), gruppe: s => kopf(produktVon(s)),
          zeile: s => {
            const p = produktVon(s), i = p.schritte.indexOf(s);
            const wer = werSchritte(p).includes(i) ? `${WER[s[1]].bild} ${WER[s[1]].text}` : "—";
            return [`${i + 1}.`, s[2], s[0], wer];
          } },
      ],
    },
  });
}
