/* Prüfansicht der Rede-Zeichen (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Zwei Listen: Begleitsatz vorne (REDE_SAETZE.vorne) und hinten (REDE_SAETZE.hinten). Jeder Satz wird so zerlegt wie
   im Spiel (zerlegeSatz, redeIndizes): Begleitsatz, gesprochene Wörter und die Zeichen, die das Kind setzt. Die Liste
   „hinten“ trägt zwei Aufbauten und hat deshalb zwei Abschnitte: Sätze ohne „|“ und Sätze mit „|“, aus denen das Spiel
   in Stufe 6 den Begleitsatz in die Mitte stellt (inDieMitte) — beide Fassungen stehen nebeneinander. Gruppiert nach
   der Satzart der Rede (typVon); die Stufen je Satzart rechnet die Ansicht aus STUFE des Spiels.
   Zu prüfen: Ist der Satz richtig geschrieben (Doppelpunkt, „ unten, “ oben, Komma, Satzzeichen), ist klar, wer spricht
   und was gesagt wird — und klingt der Satz mit dem Begleitsatz in der Mitte natürlich? */
"use strict";
{
  const SATZART = { aussage: "Aussagesätze", frage: "Fragesätze", ausruf: "Ausrufesätze" };
  /** Stufen, die Sätze dieser Art und Satzart ziehen — aus STUFE des Spiels. */
  const stufen = (art, typ) => Object.entries(STUFE).filter(([, p]) => p.arten.includes(art) && p.typen.includes(typ)).map(([s]) => s.slice(1));
  const stufenText = nr => `${nr.length > 1 ? "Stufen" : "Stufe"} ${nr.join(", ")}`;
  const gruppeFuer = art => satz => {
    const typ = typVon(satz);
    return `${SATZART[typ]} (${stufenText(stufen(art, typ))})`;
  };
  /** Begleitsatz, Rede und die zu setzenden Zeichen eines Satzes, wie das Spiel ihn zerlegt. */
  const teile = satz => {
    const { woerter, luecken } = zerlegeSatz(satz);
    const rede = redeIndizes(luecken, woerter.length);
    return {
      begleit: woerter.filter((_, i) => !rede.includes(i)).join(" ") || "—",
      rede: woerter.filter((_, i) => rede.includes(i)).join(" ") || "—",
      zeichen: luecken.filter(Boolean).join("  ") || "—",
    };
  };
  const SPALTEN = ["Satz", "Begleitsatz", "Rede (gesprochene Wörter)", "Zeichen zu setzen"];
  const zeile = satz => { const t = teile(satz); return [satz, t.begleit, t.rede, t.zeichen]; };
  const was = "In Stufe 1 tippt das Kind im Satz ohne Anführungszeichen die gesprochenen Wörter an, sonst setzt es Doppelpunkt, Anführungszeichen, Komma und Satzzeichen in die Lücken.";
  const stufenArt = art => stufenText(Object.entries(STUFE).filter(([, p]) => p.arten.includes(art)).map(([s]) => s.slice(1)));
  LS.listenPruefung("rede-zeichen", {
    vorne: {
      beschreibung: `Direkte Rede mit vorangestelltem Begleitsatz: Lea sagt: „Ich komme mit.“ (${stufenArt("vorne")}; Frage- und Ausrufesätze erst ab Stufe 5, in Stufe 1 alle). ${was}`,
      abschnitte: [{
        id: "vorne", titel: "Begleitsatz vorne", spalten: SPALTEN,
        hinweis: "Je Satzart eine Gruppe. Nach dem Begleitsatz ein Doppelpunkt, die Rede zwischen „ und “, ihr Satzzeichen vor dem “. In der Rede kein Komma.",
        eintraege: () => REDE_SAETZE.vorne, zeile, gruppe: gruppeFuer("vorne"),
      }],
    },
    hinten: {
      beschreibung: `Direkte Rede mit nachgestelltem Begleitsatz: „Ich komme mit“, sagt Lea. (${stufenArt("hinten")}; Frage- und Ausrufesätze erst ab Stufe 5, in Stufe 1 alle). Sätze mit „|“ stellt das Spiel in Stufe 6 zusätzlich mit dem Begleitsatz in der Mitte (${stufenArt("mitte")}). ${was}`,
      abschnitte: [
        { id: "hinten", titel: "Begleitsatz hinten", spalten: SPALTEN,
          hinweis: "Je Satzart eine Gruppe. Die Rede zwischen „ und “, danach ein Komma; der Punkt am Ende der Rede fällt weg, ? und ! bleiben. Der Punkt steht am Ende des Begleitsatzes.",
          eintraege: () => REDE_SAETZE.hinten.filter(roh => !roh.includes("|")), zeile, gruppe: gruppeFuer("hinten") },
        { id: "mitte", titel: "Begleitsatz hinten, auch in der Mitte (Stufe 6)",
          spalten: ["Satz (Begleitsatz hinten)", "Satz mit Begleitsatz in der Mitte", "Begleitsatz", "Rede (gesprochene Wörter)"],
          hinweis: "Das „|“ in der Liste markiert, wo der Begleitsatz eingeschoben wird; das Spiel zeigt es nie. Ist die Trennung an dieser Stelle natürlich, und stimmen beide Fassungen? In der Mitte steht der Begleitsatz zwischen zwei Kommas, jeder Teil der Rede hat sein eigenes „ und “.",
          eintraege: () => REDE_SAETZE.hinten.filter(roh => roh.includes("|")),
          gruppe: roh => gruppeFuer("hinten")(ohneStrich(roh)),
          zeile: roh => {
            const satz = ohneStrich(roh);
            const t = teile(satz);
            return [satz, inDieMitte(roh) ?? "⚠ lässt sich nicht umstellen", t.begleit, t.rede];
          } },
      ],
    },
  });
}
