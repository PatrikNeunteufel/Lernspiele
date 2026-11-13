/* Prüfansicht des Instrumenten-Kenners (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Die vier Instrumenten-Listen sind die Zeilen von INSTRUMENTE (instrumente.js) mit dieser Gruppe
   (INSTRUMENT_LISTE_JE_GRUPPE) — die Liste selbst ist also die Gruppe, nach der das Kind in Stufe 3 sortiert. Je
   Instrument Bild, Name, Spielweise und genauere Gruppe mit dem Bild des Korbs wie im Spiel (SPIELARTEN, GRUPPEN), die
   zwei Körbe für Holz/Blech oder Streichen/Zupfen (genauerPaar) und die Fallen (FALLEN). Saiten- und Blasinstrumente
   sind nach der genaueren Gruppe gruppiert. Die Fragen zu Ensembles und Klangerzeugung je mit richtiger und zwei
   falschen Antworten. Die Spalte „Stufen“ liest die Stufentabelle des Spiels (STUFE_ARTEN) mit seiner Auswahl je Art
   (NIMMT), am Instrument, wie das Spiel es aus den Rohdaten baut (instrumentVon). */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Aufgabenarten des Spiels (STUFE_ARTEN, erstes Feld) in Worten; zusatz = zweites Feld. */
  const ART = {
    name: () => "den Namen zum Bild wählen",
    spielart: mitBild => `die Spielweise wählen (drei Körbe${mitBild ? ", nur Instrumente mit Bild" : ""})`,
    gruppe: () => "Schlag-, Saiten-, Blas- oder Tasteninstrument",
    genauer: () => "Holz- oder Blechblasinstrument, Streich- oder Zupfinstrument (zwei Körbe)",
    genauerAlle: nurFallen => (nurFallen ? "die Fallen mit allen vier genaueren Gruppen" : "alle vier genaueren Gruppen"),
    frage: () => "Fragen zu Ensembles und Klangerzeugung (drei Antworten)",
  };
  /** „Stufe 1: … · Stufe 2: …“; mehrfach genannte Arten (häufiger) nur einmal; nurArten begrenzt auf diese Arten. */
  const stufenText = nurArten => Object.entries(STUFE_ARTEN)
    .map(([s, arten]) => [s, [...new Set(arten.filter(([art]) => !nurArten || nurArten.includes(art)).map(([art, zusatz]) => ART[art](zusatz)))]])
    .filter(([, texte]) => texte.length)
    .map(([s, texte]) => `Stufe ${nummer(s)}: ${texte.join("; ")}`).join(" · ");
  /** Stufen, in denen eine Art das Instrument nehmen kann (NIMMT des Spiels, ohne Freigabe). */
  const stufenVon = i => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([art, zusatz]) => NIMMT[art](i, zusatz))).map(nummer).join(", ") || "—";
  const FRAGE_STUFEN = Object.keys(STUFE_ARTEN).filter(s => STUFE_ARTEN[s].some(([art]) => art === "frage")).map(nummer).join(" und ");
  const mitBild = (bild, text) => (bild ? `${bild} ${text}` : text);
  const genauerText = i => (i.genauer ? `${mitBild(GRUPPEN[i.genauer], i.genauer)}${FALLEN.test(i.name) ? " (Falle)" : ""}` : "—");

  const instrumentListe = (liste, gruppe, hinweis) => ({
    beschreibung: `${gruppe}e aus instrumente.js; die Liste eines Instruments ergibt sich aus seiner Gruppe (Spalte 3). `
      + `Was das Kind mit dem Instrument tut: ${stufenText(Object.keys(ART).filter(a => a !== "frage"))}. Die Spalte „Stufen“ zeigt je Instrument, wo es `
      + "vorkommt: ohne Bild nicht beim Namen und nicht in der Spielweise mit Bild, ohne genauere Gruppe nicht bei Holz/Blech "
      + "oder Streichen/Zupfen, bei den Fallen nur Saxofon und Querflöte.",
    abschnitte: [{
      id: liste, titel: `${GRUPPEN[gruppe]} ${gruppe}e`,
      spalten: ["Bild", "Name", "Spielweise", "auch richtig", "Genauere Gruppe", "Zwei Körbe", "Stufen"],
      hinweis,
      eintraege: () => INSTRUMENTE.filter(e => INSTRUMENT_LISTE_JE_GRUPPE[e[2]] === liste),
      ...(liste === "saiten" || liste === "blas" ? { gruppe: e => genauerText(instrumentVon(e)).replace(" (Falle)", "") } : {}),
      zeile: e => {
        const i = instrumentVon(e);
        return [i.bild || "—", i.name, mitBild(SPIELARTEN[i.spielart], i.spielart), i.auch.join(", ") || "—", genauerText(i),
          i.genauer ? genauerPaar(i).join(" / ") : "—", stufenVon(i)];
      },
    }],
  });
  const ALLGEMEIN = "Zeigt das Bild eindeutig dieses Instrument (kein Bild: —)? Stimmt die Spielweise, und ist keine der anderen "
    + "Spielweisen (schlagen, zupfen, streichen, blasen, schütteln, Tasten drücken) ebenso richtig — sie stehen zufällig als Ablenker daneben, "
    + "ausser denen unter „auch richtig“?";
  const frageListe = (liste, worum) => ({
    beschreibung: `Fragen ${worum} (Stufen ${FRAGE_STUFEN}): Das Kind wählt aus der richtigen und zwei falschen Antworten.`,
    abschnitte: [{
      id: liste, titel: "Fragen", spalten: ["Frage", "Richtig", "Falsch", "Falsch"],
      hinweis: "Ist die Antwort fachlich richtig und für die 2. und 3. Klasse verständlich? Sind die beiden anderen eindeutig "
        + "falsch, und ist keine davon in einem anderen Sinn auch richtig?",
      eintraege: () => INSTRUMENT_FRAGEN.filter(f => f[4] === liste), zeile: ([frage, r, f1, f2]) => [frage, r, f1, f2],
    }],
  });

  LS.listenPruefung("instrumente", {
    schlag: instrumentListe("schlag", "Schlaginstrument", `${ALLGEMEIN} Gehört jedes zu den Schlaginstrumenten (auch Rasseln, die man schüttelt)?`),
    saiten: instrumentListe("saiten", "Saiteninstrument", `${ALLGEMEIN} Je genauere Gruppe eine Gruppe: Wird das Instrument `
      + "gestrichen (Streichinstrument) oder gezupft (Zupfinstrument) — passt das zur Spielweise?"),
    blas: instrumentListe("blas", "Blasinstrument", `${ALLGEMEIN} Je genauere Gruppe eine Gruppe: Zählt nicht das Material, `
      + "sondern wie der Ton entsteht (Lippen im Mundstück = Blechblasinstrument; Rohrblatt oder Anblaskante = "
      + "Holzblasinstrument)? Saxofon und Querflöte sind aus Metall und doch Holzblasinstrumente (Falle)."),
    tasten: instrumentListe("tasten", "Tasteninstrument", `${ALLGEMEIN} Ist das Instrument eindeutig ein Tasteninstrument `
      + "und nicht auch ein Saiten- oder Schlaginstrument (das Klavier hat Saiten und Hämmer)?"),
    ensembles: frageListe("ensembles", "zu Duo, Trio, Quartett, Quintett und Orchester"),
    klang: frageListe("klang", "zur Klangerzeugung: Was schwingt, wie entsteht der Ton, wie ändert sich die Tonhöhe"),
  });
}
