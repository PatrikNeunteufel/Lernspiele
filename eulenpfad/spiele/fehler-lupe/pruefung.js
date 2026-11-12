/* Prüfansicht der Fehler-Lupe (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Liste die Regeln, die über ihr Feld „liste“ zu ihr gehören (FEHLER_REGELN in woerter.js); trägt eine Liste zwei
   Regeln (nomen-gross, sp-st-sch, ae-aeu, kurzer-vokal), hat sie je Regel einen Abschnitt. Kurze und lange Sätze sind
   derselbe Inhalt (Satz mit genau einem Fehler) und stehen deshalb im selben Abschnitt, als Gruppen „kurze Sätze“ und
   „lange Sätze“ mit den Stufen, die sie ziehen (aus STUFE des Spiels). Jeder Satz wird so zerlegt wie im Spiel
   (zerlegeSatz): Satz richtig, Satz so, wie das Spiel ihn zeigt, und die Wahl beim Reparieren. Dazu die fehlerfreien
   Sätze der Königsstufe als eigene Liste.
   Zu prüfen: Ist der gezeigte Fehler sicher falsch und genau ein Fehler der Regel, sind alle übrigen Wörter richtig
   geschrieben (Schweizer Schreibweise) — und ist jeder fehlerfreie Satz wirklich ohne Fehler? */
"use strict";
{
  const SPALTEN = ["Satz richtig", "Satz wie gezeigt", "richtig", "gezeigter Fehler", "weitere Wahl"];
  const zeile = satz => {
    const woerter = zerlegeSatz(satz);
    const f = woerter.find(w => w.fehler).fehler;
    const markiert = zeigen => woerter.map(w => (w.fehler ? `„${zeigen(w.fehler)}“${w.fehler.nach}` : w.text)).join(" ");
    return [markiert(x => x.richtig), markiert(x => x.falsch), f.richtig, f.falsch, f.weitere.join(", ") || "—"];
  };
  /** Stufen, die Sätze dieser Länge einer Regel ziehen — aus STUFE des Spiels. */
  const stufenVon = (regelId, laenge) => Object.entries(STUFE)
    .filter(([, p]) => p.laenge === laenge && p.regeln.includes(regelId)).map(([s]) => s.slice(1));
  const stufenText = nr => (nr.length ? `${nr.length > 1 ? "Stufen" : "Stufe"} ${nr.join(", ")}` : "keine Stufe");
  const LAENGE = { kurz: "kurze Sätze", lang: "lange Sätze" };
  const was = "Das Kind tippt im Satz das falsch geschriebene Wort an und wählt dann die richtige Schreibweise.";
  /** Abschnitt einer Regel: kurze und lange Sätze, nach Länge gruppiert. */
  const abschnitt = regelId => {
    const r = FEHLER_REGELN[regelId];
    return {
      id: regelId, titel: r.name, spalten: SPALTEN,
      hinweis: `Regel im Spiel: ${r.regel} Das Wort in „…“ zeigt das Spiel falsch geschrieben; alle übrigen Wörter müssen richtig sein.`,
      eintraege: () => [...r.kurz, ...r.lang],
      gruppe: satz => {
        const laenge = r.kurz.includes(satz) ? "kurz" : "lang";
        return `${LAENGE[laenge]} (${stufenText(stufenVon(regelId, laenge))})`;
      },
      zeile,
    };
  };
  /** Regeln einer Liste in der Reihenfolge von FEHLER_REGELN. */
  const regelnVon = liste => Object.keys(FEHLER_REGELN).filter(id => FEHLER_REGELN[id].liste === liste);
  const regelListe = liste => {
    const regeln = regelnVon(liste);
    const teile = regeln.map(id => `${FEHLER_REGELN[id].name}: kurze Sätze ${stufenText(stufenVon(id, "kurz"))}, lange ${stufenText(stufenVon(id, "lang"))}`);
    return { beschreibung: `${teile.join("; ")}. ${was}`, abschnitte: regeln.map(abschnitt) };
  };
  const listen = [...new Set(Object.values(FEHLER_REGELN).map(r => r.liste))];
  LS.listenPruefung("fehler-lupe", {
    ...Object.fromEntries(listen.map(l => [l, regelListe(l)])),
    fehlerfrei: {
      beschreibung: `Sätze ganz ohne Fehler (nur ${stufenText(Object.keys(STUFE).filter(s => STUFE[s].zusatz).map(s => s.slice(1)))}): Einer steht vor oder nach dem Satz mit dem Fehler; das Kind muss in beiden Sätzen das einzige falsche Wort finden. Nie allein, nur neben einem Satz aus einer freien Regel-Liste.`,
      abschnitte: [{
        id: "fehlerfrei", titel: "Fehlerfreie Sätze (Königsstufe)", spalten: ["Satz"],
        hinweis: "Jedes Wort muss richtig geschrieben sein — sonst gäbe es zwei Fehler. Das Spiel nimmt keinen Satz, der das Lösungswort enthält.",
        eintraege: () => FEHLERFREIE_SAETZE, zeile: satz => [satz],
      }],
    },
  });
}
