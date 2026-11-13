/* Prüfansicht des Figuren-Spiegels (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „szenen“, ein Abschnitt je Szenengruppe (1 kurz, 2 mittel, 3 lang), weil jede Gruppe in anderen Stufen
   mit anderen Fragearten läuft. Szene und Fragen stehen in einem Eintrag wie beim Lese-Detektiv: Ob eine Antwort
   eindeutig folgt, lässt sich nur mit dem Text prüfen. Je Frageart eine Spalte mit fester Bedeutung („–“, wenn die
   Szene diese Frage nicht hat). Die Wortzahl rechnet das Spiel (woerter), die Fragen zerlegt es mit fragenVon, die
   Stufen je Gruppe und Frageart stehen in seiner Stufentabelle STUFE. Zu prüfen: Ist die Szene für die 5. bis 7. Klasse
   passend und nicht belastend, folgt die richtige Antwort eindeutig aus dem Text, und lässt sich keine falsche ebenso
   begründen (bei motiv ist die erste falsche bewusst zu wörtlich)? */
"use strict";
{
  const NAMEN = { gefuehl: "Gefühl", stimmung: "Stimmung", grund: "Grund", motiv: "Motiv", sicht: "Sicht der zweiten Figur",
    meinen: "Sagen ≠ Meinen", weiter: "Was als Nächstes?", ich: "An ihrer Stelle", lebenswelt: "Lebenswelt" };
  /** Stufen, die eine Szenengruppe (und darin eine Frageart) stellen — aus STUFE. */
  const stufenVon = (gruppe, art) => Object.entries(STUFE)
    .filter(([, p]) => p.gruppen.includes(gruppe) && (!art || p.bloecke.some(b => b.includes(art)))).map(([k]) => k.slice(1));
  const stufenText = s => `${s.length > 1 ? "Stufen" : "Stufe"} ${s.join(", ")}`;
  /** Fragearten einer Gruppe in der Reihenfolge von ARTEN, wie sie in den Szenen vorkommen. */
  const artenVon = gruppe => ARTEN.filter(art => SPIEGEL_SZENEN.some(s => s.gruppe === gruppe && fragenVon(s).some(f => f.art === art)));
  const frageZelle = f => `${f.frage} → ✓ ${f.richtig} ✗ ${f.falsch.join(" ✗ ")}`;

  const GRUPPEN = {
    1: { titel: "Kurze Szenen", hinweis: "Gefühl und Grund stehen so oder fast so im Text; die Stimmung (spannend, lustig, traurig, gemütlich, unheimlich) passt zur ganzen Szene. Keine falsche Antwort lässt sich aus dem Text begründen." },
    2: { titel: "Mittlere Szenen", hinweis: "Das Motiv steht nicht wörtlich da, folgt aber eindeutig; die erste falsche Antwort ist bewusst zu wörtlich (wiederholt den Text), die zweite passt nicht. Sicht: Was weiss die zweite Figur? Sagen ≠ Meinen: Das Tun verrät, was gemeint ist." },
    3: { titel: "Längere Szenen", hinweis: "Motiv aus Andeutungen, Fortsetzung passend zum Motiv, eigene Perspektive mit genau einer passenden Antwort, Alltagssituation mit demselben Kern. Ist keine falsche Antwort ebenso vertretbar (bei „An ihrer Stelle“ besonders genau lesen)?" },
  };

  const abschnitt = gruppe => {
    const arten = artenVon(gruppe);
    const [von, bis] = WOERTER[gruppe];
    return {
      id: `gruppe${gruppe}`, titel: `${GRUPPEN[gruppe].titel}, ${von}–${bis} Wörter (${stufenText(stufenVon(gruppe))})`,
      hinweis: `${GRUPPEN[gruppe].hinweis} Ist die Szene für das Alter passend und nicht belastend? Fragearten nach Stufe: `
        + arten.map(art => `${NAMEN[art]} ${stufenText(stufenVon(gruppe, art)).replace(/^Stufen? /, "")}`).join(", ") + ".",
      spalten: ["Titel", "Figuren", "Szene", "Wörter", ...arten.map(art => NAMEN[art])],
      eintraege: () => SPIEGEL_SZENEN.filter(s => s.gruppe === gruppe),
      zeile: s => {
        const fragen = fragenVon(s);
        return [s.titel, s.figuren.join(", "), s.text, String(woerter(s.text)),
          ...arten.map(art => fragen.filter(f => f.art === art).map(frageZelle).join(" · ") || "–")];
      },
    };
  };

  LS.listenPruefung("figuren-spiegel", {
    szenen: {
      beschreibung: `Kurze literarische Szenen mit Fragen zu den Figuren (D.2.C.1). Kurze Szenen in ${stufenText(stufenVon(1))}: `
        + `Gefühl (Stufe ${stufenVon(1, "gefuehl").join(", ")}), Stimmung oder Grund (Stufe ${stufenVon(1, "stimmung").join(", ")}). `
        + `Mittlere Szenen in ${stufenText(stufenVon(2))}: Motiv (Stufe 3), in Stufe 4 Sicht der zweiten Figur und danach Sagen ≠ Meinen oder Motiv. `
        + `Längere Szenen in ${stufenText(stufenVon(3))}: Fortsetzung oder eigene Perspektive (Stufe 5), in Stufe 6 drei Fragen nacheinander `
        + `(Motiv oder Sagen ≠ Meinen, Lebenswelt, Fortsetzung oder eigene Perspektive). Das Kind liest die Szene und wählt je Frage eine von drei Antworten.`,
      abschnitte: [1, 2, 3].map(abschnitt),
    },
  });
}
