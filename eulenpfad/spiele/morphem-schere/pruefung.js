/* Prüfansicht der Morphem-Schere (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Zwei Listen (MORPHEM_LISTEN[<liste>]). Die Bausteine werden so zerlegt wie im Spiel (zerlegeBausteine, ROLLE: vor dem
   Stamm Vorsilbe, danach Endung); gruppiert nach dem Aufbau, die Stufen je Wort aus STUFE des Spiels. Die Liste
   „stamm-ea“ trägt zwei Arten von Wörtern und hat deshalb zwei Abschnitte: ä oder äu mit verwandtem Wort, e oder eu ohne
   verwandtes Wort; die Lücke wird zerlegt wie im Spiel (zerlegeLuecke).
   Zu prüfen: Liegen die Schnitte an den Morphemgrenzen, ist der markierte Teil der Stamm (kehrt in der Wortfamilie
   wieder) — und ist bei e/ä das verwandte Wort wirklich verwandt, bei e/eu wirklich keins da? */
"use strict";
{
  const nummern = pruefe => Object.entries(STUFE).filter(([, p]) => pruefe(p)).map(([s]) => s.slice(1));
  const stufenText = nr => nr.join(", ") || "—";
  /** Teile einer Rolle („Vorsilbe“, „Endung“) eines zerlegten Worts. */
  const teileMit = (t, rolle) => t.teile.filter((_, i) => ROLLE(t, i) === rolle);
  const aufbau = t => {
    const v = teileMit(t, "vorsilbe").length, e = teileMit(t, "endung").length;
    return [v ? "Vorsilbe" : "", "Stamm", e === 1 ? "Endung" : e ? `${e} Endungen` : ""].filter(Boolean).join(" + ");
  };
  const ea = text => zerlegeLuecke(text);
  const mitA = ([text]) => /^ä/i.test(ea(text).richtig);
  /** „Stufe 4 mit Regelkarte; Stufen 5, 6 mit Begründung“ — aus STUFE des Spiels. */
  const eaStufen = () => [[nummern(p => p.ea?.regel), "mit Regelkarte"], [nummern(p => p.ea?.begruenden), "ohne Regelkarte, mit Begründung über das verwandte Wort"]]
    .filter(([nr]) => nr.length).map(([nr, wie]) => `${nr.length > 1 ? "Stufen" : "Stufe"} ${nr.join(", ")} ${wie}`).join("; ");
  const eaZellen = text => { const l = ea(text); return [l.ganz, `${l.vor}_${l.nach}`, l.richtig, l.falsch, l.vor + l.falsch + l.nach]; };
  const EA_SPALTEN = ["Wort", "Lücke", "richtig", "falsch", "falsch geschrieben"];
  LS.listenPruefung("morphem-schere", {
    bausteine: {
      beschreibung: "Wörter aus Vorsilbe, Stamm und Endung (alle Stufen; welche Wörter eine Stufe zieht, hängt vom Aufbau ab: Stufe 1 Stamm + Endung, Stufe 2 mit Vorsilbe bis drei Bausteine, Stufe 3 bis drei, Stufe 4 ab drei, Stufe 5 ab drei mit Vorsilbe, Stufe 6 vier Bausteine). Das Kind schneidet das Wort zwischen den Buchstaben in seine Bausteine und tippt ab Stufe 3 den Stamm an.",
      abschnitte: [{
        id: "bausteine", titel: "Wörter mit Bausteinen", spalten: ["Wort", "Bausteine", "Vorsilbe", "Stamm", "Endung", "Stufen"],
        hinweis: "Je Aufbau eine Gruppe. Das Spiel sagt „Endung“ auch für Nachsilben wie -ung, -lich, -keit. Mit Umlaut zählt der Stamm als derselbe (Verkäufer: käuf zu kaufen).",
        eintraege: () => MORPHEM_LISTEN.bausteine,
        gruppe: text => aufbau(zerlegeBausteine(text)),
        zeile: text => {
          const t = zerlegeBausteine(text);
          return [t.wort, t.teile.join(" | "), teileMit(t, "vorsilbe").join(" + ") || "—", t.teile[t.stamm],
            teileMit(t, "endung").join(" + ") || "—", stufenText(nummern(p => p.schneiden(t)))];
        },
      }],
    },
    "stamm-ea": {
      beschreibung: `Stammregel e oder ä, eu oder äu (${eaStufen()}). Das Kind wählt die Schreibweise für die Lücke; mit Begründung wählt es danach das verwandte Wort unter vier Antworten (eine davon „kein Wort mit a oder au“).`,
      abschnitte: [
        { id: "ae", titel: "ä oder äu: verwandtes Wort mit a oder au", spalten: [...EA_SPALTEN, "verwandt mit"],
          hinweis: "Je Schreibweise eine Gruppe. Das verwandte Wort muss denselben Stamm haben. Mit Begründung sind die verwandten Wörter der anderen Einträge die falschen Antworten — keines davon darf auch zum Wort passen. Die falsche Schreibweise darf kein anderes Wort ergeben.",
          eintraege: () => MORPHEM_LISTEN["stamm-ea"].filter(mitA), gruppe: ([text]) => ea(text).richtig.toLowerCase(),
          zeile: ([text, verwandt]) => [...eaZellen(text), verwandt || "—"] },
        { id: "e", titel: "e oder eu: kein verwandtes Wort mit a oder au", spalten: EA_SPALTEN,
          hinweis: "Je Schreibweise eine Gruppe. Es darf kein verwandtes Wort mit a oder au geben, und die falsche Schreibweise darf kein anderes Wort ergeben.",
          eintraege: () => MORPHEM_LISTEN["stamm-ea"].filter(e => !mitA(e)), gruppe: ([text]) => ea(text).richtig.toLowerCase(),
          zeile: ([text]) => eaZellen(text) },
      ],
    },
  });
}
