/* Prüfansicht von Mots-Match (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Thema-Liste ein Abschnitt mit den Wörtern aus woerter.js (THEMEN_FR), so wie das Spiel sie zeigt: Bild,
   französisches Wort mit Artikel (frText des Spiels: „l’oiseau“, „les frites“), deutsches Wort, dazu das Wort mit
   dem anderen Artikel, das das Spiel in den Stufen mit ähnlichen Wörtern als falsche Antwort danebenstellt
   (andererArtikel des Spiels). Die Stufen in den Beschreibungen liest die Ansicht aus der Stufentabelle des Spiels
   (STUFE_ARTEN, aus der es auch seine Aufgaben baut): welche Themen eine Stufe nimmt und welche Aufgabenarten sie stellt.
   Zu prüfen: Stimmt die Übersetzung (Schweizer Schreibweise), stimmen Artikel und Akzente, zeigt das Bild eindeutig
   dieses Wort und kein anderes desselben Themas? */
"use strict";
{
  /** Aufgabenarten des Spiels (STUFE_ARTEN, erstes Feld) in Worten. */
  const ART = {
    bildZuFr: "Bild → französisches Wort",
    frZuBild: "französisches Wort → Bild",
    deZuFr: "deutsches Wort → französisches Wort",
    hoerZuBild: "nur hören → Bild",
    aehnlich: "Bild → französisches Wort unter ähnlichen Wörtern aus allen Themen, dazu dasselbe Wort mit dem anderen Artikel",
    deZuFrAehnlich: "deutsches Wort → französisches Wort unter ähnlichen Wörtern aus allen Themen",
  };
  /** Zusatz einer Art (viertes Feld): Ton bei bildZuFr und frZuBild, alleThemen bei hoerZuBild. */
  const zusatzText = (art, zusatz) => (art === "hoerZuBild" ? (zusatz ? ", Bilder aus allen Themen" : ", Bilder aus dem Thema")
    : zusatz === "auto" ? ", vorgelesen" : zusatz === "knopf" ? ", mit 🔊" : "");
  const artText = ([art, , n, zusatz]) => `${ART[art]} (${n} Antworten${zusatzText(art, zusatz)})`;
  const nummer = s => s.slice(1);
  /** Nimmt die Art Wörter dieses Themas? Ohne Themen (ähnliche Wörter) nimmt sie alle. */
  const nimmtThema = (thema, [, themen]) => !themen || themen.includes(thema);
  /** Stammen die falschen Antworten aus demselben Thema? */
  const gleichesThema = ([art, themen, , zusatz]) => !!themen && !(art === "hoerZuBild" && zusatz);
  const stufenMit = pruef => Object.keys(STUFE_ARTEN).filter(s => STUFE_ARTEN[s].some(pruef)).map(nummer);
  /** „Stufe 1: Bild → französisches Wort (3 Antworten, vorgelesen); Stufe 2: …“ für die Stufen, die das Thema nehmen. */
  const stufenText = thema => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(a => nimmtThema(thema, a)))
    .map(s => `Stufe ${nummer(s)}: ${STUFE_ARTEN[s].filter(a => nimmtThema(thema, a)).map(artText).join("; ")}`)
    .join(" · ");
  const artikelStufen = stufenMit(([art]) => art === "aehnlich").join(", ");
  const hoerStufen = stufenMit(([art, , , zusatz]) => art === "hoerZuBild" || zusatz === "auto" || zusatz === "knopf").join(", ");
  const themaStufen = stufenMit(gleichesThema).join(", ");
  const alleStufen = stufenMit(a => !gleichesThema(a)).join(", ");

  /** Wort des Spiels (ALLE: mit thema und fr) zum Eintrag aus THEMEN_FR. */
  const wortVon = (thema, e) => ALLE.find(w => w.thema === thema && w.wort === e[1]);
  const SPALTEN = ["Bild", "Französisch", "Deutsch", `Anderer Artikel (falsche Antwort, Stufe ${artikelStufen})`];
  const HINWEIS = "Stimmt die Übersetzung (Schweizer Schreibweise, ss statt ß)? Stimmt der Artikel (le männlich, la weiblich, "
    + "l’ vor Vokal und stummem h, les Mehrzahl) und stehen die Akzente richtig (é, è, ê, à, ç, œ)? Zeigt das Bild eindeutig "
    + `dieses Wort? In Stufe ${themaStufen} nimmt das Spiel die falschen Antworten aus demselben Thema (Bilder und französische `
    + `Wörter) — keines davon darf ebenso passen. In Stufe ${alleStufen} kommen sie aus allen Themen. Die letzte Spalte ist mit `
    + `Absicht falsch: Sie darf kein anderes richtiges französisches Wort ergeben (darum fehlt sie bei „${ARTIKEL_DOPPELT_FR.join("“, „")}“: `
    + "dort ergibt der andere Artikel ein anderes Wort; bei Farben, l’ und les gibt es sie nicht).";

  /** Liste = ein Thema von THEMEN_FR (Id wie im Katalog). */
  function themenListe(thema) {
    const { name } = THEMEN_FR[thema];
    return {
      beschreibung: `Französische Wörter mit Artikel und Bild (${name}). ${stufenText(thema)}. `
        + `In Stufe ${hoerStufen} spricht das Gerät das Wort mit französischer Stimme (fr-CH, sonst fr-FR) beim Zeigen oder `
        + "auf 🔊, in jeder Stufe nach der richtigen Antwort — es muss sich vorgelesen eindeutig verstehen lassen.",
      abschnitte: [{
        id: thema, titel: `Wörter: ${name}`, spalten: SPALTEN, hinweis: HINWEIS,
        eintraege: () => THEMEN_FR[thema].woerter,
        zeile: e => {
          const w = wortVon(thema, e);
          return [w.bild, w.fr, w.de, andererArtikel(w) || "—"];
        },
      }],
    };
  }

  LS.listenPruefung("mots-match", Object.fromEntries(Object.keys(THEMEN_FR).map(t => [t, themenListe(t)])));
}
