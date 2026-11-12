/* Prüfansicht der Satz-Reparatur (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Stufe 1–5 eine Liste (SAETZE_LISTEN), je Liste ein Abschnitt mit den Sätzen aus saetze.js, so wie sie richtig
   stehen. Die Spalten rechnet das Spiel mit zerlege aus: Wörter, die ausser am Satzanfang gross stehen (Nomen und
   Namen), und die Zeichen, die am Satzende gelten (bei AUCH_PUNKT „! oder .“). Die Wortzahl braucht der Wörter-Trenner,
   der die Sätze danach auf seine Stufen verteilt; auch der Tipp-Trainer leiht die Listen.
   Zu prüfen: Steht jedes Nomen und jeder Name gross und nichts sonst, passt das Schlusszeichen (und gilt kein anderes
   ebenso), keine Kommas und Abkürzungen, Schweizer Schreibweise? */
"use strict";
{
  const ART = { ".": "Aussage (.)", "?": "Frage (?)", "!": "Ausruf (!)" };
  /** Wörter mit Satzanfang (erstes Wort und jedes nach einem Schlusszeichen), wie das Spiel sie zerlegt. */
  const woerter = satz => zerlege(satz).map((w, i, alle) => ({ ...w, anfang: i === 0 || !!alle[i - 1].ende }));
  const gross = w => w.soll[0] !== w.soll[0].toLowerCase();
  const nomen = satz => woerter(satz).filter(w => !w.anfang && gross(w)).map(w => w.soll).join(", ") || "—";
  const zeichen = satz => woerter(satz).filter(w => w.ende).map(w => w.erlaubt.join(" oder ")).join(" · ");
  const art = satz => woerter(satz).filter(w => w.ende).map(w => ART[w.ende]).join(" + ");
  const spalten = ["Satz (richtig geschrieben)", "Gross ausser Satzanfang", "Schlusszeichen", "Wörter"];
  const zeile = satz => [satz, nomen(satz), zeichen(satz), satz.split(" ").length];
  const HINWEIS = "Das Spiel zeigt den Satz klein und ohne Schlusszeichen; das Kind macht die Wörter gross und setzt das Zeichen. "
    + "Steht ein Nomen oder Name am Satzanfang, ist es nur in der ersten Spalte zu sehen.";
  const abschnitt = (gruppe, titel, mitArt) => ({
    id: SAETZE_LISTEN[gruppe], titel, spalten, hinweis: HINWEIS + (mitArt ? " Je Satzart eine Gruppe." : ""),
    eintraege: () => SAETZE[gruppe], zeile, ...(mitArt ? { gruppe: art } : {}),
  });
  const LEIHEN = "Der Wörter-Trenner nimmt die Sätze ohne Satzzeichen je nach Wortzahl (Stufe 1: 2–3 Wörter, 2: 4, 3: 5, 4: 6–7, 5: 8–20)";
  LS.listenPruefung("satz-reparatur", {
    "satzanfang": {
      beschreibung: `Sätze ohne Nomen (Stufe 1): nur der Satzanfang gross und ein Punkt am Ende. ${LEIHEN}; der Tipp-Trainer lässt die Sätze bis 4 Wörter in Stufe 4 abtippen.`,
      abschnitte: [abschnitt("s1", "Satzanfang und Punkt", false)],
    },
    "nomen-konkret": {
      beschreibung: `Sätze mit Namen und konkreten Nomen (Stufe 2): Satzanfang, Namen und Nomen gross, Punkt am Ende. ${LEIHEN}; der Tipp-Trainer nimmt sie in Stufe 4 (bis 4 Wörter) und 5 (ab 5 Wörtern).`,
      abschnitte: [abschnitt("s2", "Namen und konkrete Nomen", false)],
    },
    "nomen-abstrakt": {
      beschreibung: `Sätze mit abstrakten Nomen (Angst, Freude), Frage- und Ausrufesätze (Stufe 3, in der Königsstufe als dritter Satz zu einem Satzpaar). ${LEIHEN}; der Tipp-Trainer nimmt die Sätze ab 5 Wörtern in Stufe 5.`,
      abschnitte: [abschnitt("s3", "Abstrakte Nomen, ? und !", true)],
    },
    "lange-saetze": {
      beschreibung: `Längere Sätze mit mehreren Nomen und allen Schlusszeichen (Stufe 4, in der Königsstufe als dritter Satz zu einem Satzpaar). ${LEIHEN}, in der Königsstufe zwei lange Sätze aneinander (14–24 Wörter); der Tipp-Trainer nimmt sie in Stufe 5.`,
      abschnitte: [abschnitt("s4", "Längere Sätze", true)],
    },
    "satzpaare": {
      beschreibung: `Zwei Sätze hintereinander, zwei Satzanfänge und zwei Schlusszeichen (Stufe 5; die Königsstufe nimmt ein Satzpaar und einen Satz aus „nomen-abstrakt“ oder „lange-saetze“). ${LEIHEN}, in der Königsstufe zwei Sätze aneinander (14–24 Wörter); der Tipp-Trainer lässt sie in Stufe 6 abtippen.`,
      abschnitte: [abschnitt("s5", "Satzpaare", true)],
    },
  });
}
