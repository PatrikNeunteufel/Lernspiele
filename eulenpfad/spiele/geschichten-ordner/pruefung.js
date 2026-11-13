/* Prüfansicht des Geschichten-Ordners (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „geschichten“ mit gemischtem Inhalt: Je Form einer Geschichte ein Abschnitt — drei Schritte mit Bild und
   Wort (Stufen 1, 2), vier Schritte mit Ablenker (Stufen 3, 4), fünf Schritte (Stufe 5 mit Zeitwörtern, Stufe 6
   Lücken) und sechs Schritte (Stufe 6 ordnen und Lücken). Eine Geschichte ist ein Eintrag mit all ihren Schritten: Ob
   die Reihenfolge zwingend ist, sieht man nur an der ganzen Geschichte. Welche Stufe eine Geschichte nimmt, steht in
   der Stufentabelle des Spiels (STUFE, schritteFuer); die Sätze mit Zeitwort und die Lücken bauen dieselben Funktionen
   wie die Aufgabe (zeitwortSaetze, lueckenVon). Eingetragen sind die Rohdaten (GESCHICHTEN aus geschichten.js), nicht
   der freigegebene Vorrat des Spiels.
   Zu prüfen: Ist die Reihenfolge logisch zwingend (ohne den vorigen Schritt geht der nächste nicht)? Gehört der
   Ablenker sicher nicht in den Ablauf? Lesen sich die umgestellten Sätze mit dem Zeitwort davor richtig? Verrät der
   Tipp den ersten Schritt nicht? */
"use strict";
{
  const pfeil = teile => teile.join(" → ");
  /** Stufen, die eine Geschichte nehmen — aus der Stufentabelle des Spiels. */
  const stufen = (gruppe, n) => {
    const liste = Object.keys(STUFE).filter(s => STUFE[s].gruppe === gruppe
      && STUFE[s].arten.some(art => schritteFuer(s, art) === null || schritteFuer(s, art) === n)).map(s => s.slice(1));
    return liste.length > 1 ? `Stufen ${liste.join(", ")}` : `Stufe ${liste[0]}`;
  };
  /** Sätze mit Zeitwort und die drei Lücken mit den Funktionen des Spiels (wie in aufgabeErzeugen). */
  const mitZeitwort = g => pfeil(zeitwortSaetze(g));
  const luecken = g => lueckenVon(g).map(l => `${l.wort} ${l.nach}`).join(" · ");
  const nachSchritten = n => () => GESCHICHTEN.filter(g => g.gruppe === 3 && g.schritte.length === n);
  const FUENF = STUFE.s5.schritte, SECHS = STUFE.s6.schritte;
  const TIPP = "Der dritte Tipp sagt etwas über den Anfang, ohne den ersten Schritt zu nennen.";
  LS.listenPruefung("geschichten-ordner", {
    geschichten: {
      beschreibung: "Kurze Geschichten in Schritten. Das Kind bringt die Teile in die richtige Reihenfolge: "
        + "Stufe 1 drei Bildkarten (Bild und Wort), Stufe 2 drei kurze Sätze mit Bild, Stufe 3 vier Sätze, Stufe 4 "
        + "fünf Sätze, von denen einer nicht dazugehört (zuerst aussortieren, dann ordnen), Stufe 5 fünf Sätze mit "
        + "Zeitwörtern (Zuerst, Dann, Danach, Später, Am Schluss), Stufe 6 sechs Sätze ohne Zeitwörter oder bei drei "
        + "Sätzen das passende Zeitwort in die Lücke setzen (Zuerst, Dann, Am Schluss).",
      abschnitte: [{
        id: "drei", titel: `Drei Schritte mit Bild (${stufen(1, STUFE.s1.schritte)})`,
        spalten: ["Titel", "Bildkarten (Stufe 1)", "Sätze (Stufe 2)", "dritter Tipp"],
        hinweis: "Die Schritte stehen in der richtigen Reihenfolge. Zeigt jedes Bild mit seinem Wort eindeutig den "
          + "Schritt, und unterscheiden sich die drei Bildkarten? Ist die Reihenfolge zwingend — oder ginge sie auch "
          + `anders? ${TIPP}`,
        eintraege: () => GESCHICHTEN.filter(g => g.gruppe === 1),
        zeile: g => [g.titel, pfeil(g.schritte.map(s => `${s.bild} ${s.kurz}`)), pfeil(g.schritte.map(s => s.satz)), g.tipp],
      }, {
        id: "vier", titel: `Vier Schritte und ein Ablenker (${stufen(2, STUFE.s3.schritte)})`,
        spalten: ["Titel", "Sätze (Stufen 3, 4)", "gehört nicht dazu (Stufe 4)", "dritter Tipp"],
        hinweis: "Die Sätze stehen in der richtigen Reihenfolge. Ist sie zwingend? Der Ablenker passt zum Thema, "
          + "aber darin geschieht nichts, das die Geschichte weiterführt — das Spiel sagt dem Kind: „Such den Satz, der "
          + `nur etwas beschreibt.“ Könnte ein Kind ihn doch in den Ablauf setzen? ${TIPP}`,
        eintraege: () => GESCHICHTEN.filter(g => g.gruppe === 2),
        zeile: g => [g.titel, pfeil(g.schritte.map(s => s.satz)), g.ablenker || "–", g.tipp],
      }, {
        id: "fuenf", titel: `${FUENF} Schritte mit Zeitwörtern (${stufen(3, FUENF)})`,
        spalten: ["Titel", "Sätze mit Zeitwörtern (Stufe 5)", "Lücken (Stufe 6)", "dritter Tipp"],
        hinweis: "So sieht das Kind die Sätze: das Zeitwort des Spiels vor dem umgestellten Satz, hier in der richtigen "
          + "Reihenfolge. Liest sich jeder Satz mit dem Zeitwort richtig? Ist die Reihenfolge auch ohne Zeitwörter "
          + "zwingend? In den Lücken der Stufe 6 kommen nur der erste, zweite und letzte Schritt vor, gemischt und "
          + "ohne Zeitwort; hier gelöst. Lässt sich aus diesen drei Sätzen allein sagen, welcher zuerst, welcher "
          + `danach und welcher am Schluss kommt? ${TIPP}`,
        eintraege: nachSchritten(FUENF),
        zeile: g => [g.titel, mitZeitwort(g), luecken(g), g.tipp],
      }, {
        id: "sechs", titel: `${SECHS} Schritte ohne Zeitwörter (${stufen(3, SECHS)})`,
        spalten: ["Titel", "Sätze (Stufe 6 ordnen)", "Lücken (Stufe 6)", "dritter Tipp"],
        hinweis: "Die Sätze stehen in der richtigen Reihenfolge; das Kind ordnet sie ohne jede Hilfe. Ist jeder Schritt "
          + "zwingend nach dem vorigen — oder liessen sich zwei tauschen? In den Lücken kommen der erste, zweite und "
          + "letzte Schritt vor (umgestellt, gemischt, ohne Zeitwort); hier gelöst. Lässt sich aus diesen drei Sätzen "
          + `allein sagen, welcher zuerst, welcher danach und welcher am Schluss kommt? ${TIPP}`,
        eintraege: nachSchritten(SECHS),
        zeile: g => [g.titel, pfeil(g.schritte.map(s => s.satz)), luecken(g), g.tipp],
      }],
    },
  });
}
