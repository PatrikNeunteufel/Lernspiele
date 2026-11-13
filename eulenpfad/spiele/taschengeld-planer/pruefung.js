/* Prüfansicht des Taschengeld-Planers (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „waren“ (woerter.js, TASCHEN_WAREN), ein Abschnitt: je Ware Bild, Name, Preis und ob es sie im
   Mehrfachpack gibt. Der Preis steht so, wie das Kind ihn sieht (LS.geldText mit der Klasse der ersten Stufe, in der
   die Ware vorkommt). Gruppiert nach Bedarf, Wunsch und „je nach Lage“ (Grenzfälle, nie zum Sortieren), so dass die
   Zuordnung je Gruppe auf einen Blick zu prüfen ist. Die Spalte „Stufen und Rolle“ liest die Stufentabelle des Spiels
   (STUFE) mit seiner Auswahl je Aufgabenart und Rolle (NIMMT, auf die Ware wie im Spiel: wareAus). */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Punkt am Ende, wo kein Satzzeichen steht. */
  const satz = t => (/[.?!]$/.test(t) ? t : `${t}.`);
  /** Rollen einer Ware in den Aufgaben (Schlüssel in NIMMT des Spiels) in Worten. */
  const ROLLE = {
    kaufen: "kaufen", regal: "im Regal", sparziel: "Sparziel", fest: "feste Ausgabe", wunsch: "Wunsch zur Wahl",
    sortieren: "Bedarf oder Wunsch?", angebot: "Angebote vergleichen", pack: "einzeln oder Pack",
  };
  /** Je Stufe die Rollen, in denen die Aufgabenarten der Stufe (STUFE) die Ware nehmen können (ohne Freigabe). */
  const rollenJeStufe = w => Object.keys(STUFE).map(s => [s, [...new Set(STUFE[s].flatMap(art =>
    Object.entries(NIMMT[art]).filter(([, nimmt]) => nimmt(w)).map(([rolle]) => ROLLE[rolle] || rolle)))]])
    .filter(([, rollen]) => rollen.length);
  /** „1 kaufen · 3 im Regal · 5 feste Ausgabe, Bedarf oder Wunsch?“ */
  const stufenText = w => rollenJeStufe(w).map(([s, rollen]) => `${nummer(s)} ${rollen.join(", ")}`).join(" · ") || "— (in keiner Stufe)";
  /** Preis wie im Spiel, mit der Klasse der ersten Stufe, in der die Ware vorkommt. */
  const preisText = w => LS.geldText(w.rp, LS.klasseDerStufe(ID, rollenJeStufe(w)[0]?.[0] || "s1"));
  const GRUPPE = { bedarf: "🧰 Bedarf (brauche ich)", wunsch: "💭 Wunsch (hätte ich gern)", "": "je nach Lage (nie zum Sortieren)" };

  LS.listenPruefung("taschengeld-planer", {
    waren: {
      beschreibung: "Waren und Ausgaben mit Preis, Bedarf oder Wunsch und Mehrfachpack. Das Kind rechnet mit dem Geld, "
        + "plant ein Budget, spart auf etwas, legt eine Ware in den Korb „Bedarf“ oder „Wunsch“ und vergleicht Angebote. "
        + `${satz(Object.entries(STUFEN_TEXT).map(([s, t]) => `Stufe ${nummer(s)}: ${t}`).join(" · "))} `
        + "Die Spalte „Stufen und Rolle“ zeigt je Ware, wo und wie sie vorkommt — die Aufgabenarten nehmen nur Waren in "
        + "ihrem Preisbereich; feste Ausgaben sind nur Bedarf, zum Wählen stehen nur Wünsche.",
      abschnitte: [{
        id: "ware", titel: "Waren", spalten: ["Bild", "Name", "Preis", "Mehrfachpack", "Stufen und Rolle"],
        hinweis: "Je Art eine Gruppe. Ist die Zuordnung für ein Kind der 4. bis 6. Klasse eindeutig — Bedarf: Schule, "
          + "Gesundheit, Sicherheit, Schulweg, Znüni; Wunsch: Süsses, Spiel, Freizeit? Was beides sein kann, gehört zu "
          + "„je nach Lage“ und wird nie sortiert. Ist der Preis für ein Kind in der Schweiz heute realistisch (Kiosk, "
          + "Papeterie, Sportgeschäft, Kino)? Gibt es die Ware wirklich im Mehrfachpack (Stufe 6 vergleicht Packungen "
          + "bis 10 Stück)? Zeigt das Bild eindeutig die Ware, und ist der Name in Schweizer Schreibweise?",
        eintraege: () => TASCHEN_WAREN,
        gruppe: e => GRUPPE[wareAus(e).art] ?? wareAus(e).art,
        zeile: e => {
          const w = wareAus(e);
          return [w.bild, w.name, preisText(w), w.stueck ? "ja" : "—", stufenText(w)];
        },
      }],
    },
  });
}
