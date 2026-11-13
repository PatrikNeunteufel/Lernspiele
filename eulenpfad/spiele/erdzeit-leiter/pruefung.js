/* Prüfansicht der Erdzeit-Leiter (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „ereignisse“ (woerter.js, ERDZEIT_EREIGNISSE), ein Abschnitt: je Ereignis Bild, Satz und alles, was das Spiel
   daraus rechnet und dem Kind zeigt — die Zeit „vor etwa …“ (vorText), der Abschnitt der gestauchten Leiter (abschnitt,
   ABSCHNITT_TEXT) und die Uhrzeit auf dem Erd-Tag (tagText). Gruppiert nach dem Zeitalter, mit der Spanne, wie sie auf
   den Körben steht (ZEITALTER, zeitalterSpanne), so dass Zeit und Zeitalter je Gruppe auf einen Blick zu vergleichen
   sind. Beschreibung und Spalte „Stufen“ lesen die Stufentabelle des Spiels (STUFE_ARTEN) mit seiner Auswahl je Art
   (NIMMT; beim Abstand ABSTAND_FAKTOR und abstandVon). */
"use strict";
{
  const nummer = s => s.slice(1);
  const mal = r => `${LS.dezimalText(r)}-mal`;
  /** Aufgabenarten des Spiels (STUFE_ARTEN) in Worten, mit ihren Angaben. */
  const ART = {
    frueher: r => `zwei Ereignisse: „Was war früher?“ (Zeiten mindestens ${mal(r)} so weit zurück)`,
    ordnen: (k, r, zahlen) => `${k} Ereignisse ordnen, das älteste zuerst (${zahlen ? "mit" : "ohne"} Zeit, mindestens ${mal(r)} so weit zurück)`,
    leiter: zahl => `auf der Erdzeit-Leiter einordnen (${zahl ? "mit" : "ohne"} Zeit)`,
    zeitalter: zahl => `in den Korb des Zeitalters legen (${zahl ? "mit Zeit und Spannen" : "ohne Zeit"})`,
    tag: r => `Erd-Tag: „Um wie viel Uhr?“ (falsche Uhrzeiten zu Ereignissen mindestens ${mal(r)} so weit zurück oder näher)`,
    tagRueck: () => "Erd-Tag: „Was geschieht um …?“",
    abstand: () => "„Wie viel Zeit liegt dazwischen?“ schätzen",
  };
  const STUFEN_TEXT = Object.entries(STUFE_ARTEN)
    .map(([s, arten]) => `Stufe ${nummer(s)}: ${[...new Set(arten.map(([art, ...angaben]) => ART[art](...angaben)))].join("; ")}`)
    .join(" · ");
  const juengerZuletzt = (a, b) => (jahreVon(a) >= jahreVon(b) ? [a, b] : [b, a]);
  /** Kommt das Ereignis beim Abstand vor: ein anderes weit genug weg (ABSTAND_FAKTOR) mit Abstand, den das Spiel nimmt. */
  const imAbstand = e => ERDZEIT_EREIGNISSE.some(f => f !== e && verhaeltnis(e, f) >= ABSTAND_FAKTOR && abstandVon(...juengerZuletzt(e, f)) !== null);
  /** Stufen, in denen eine Art das Ereignis nimmt (NIMMT des Spiels, fehlt: alle; ohne Freigabe). */
  const stufenVon = e => Object.keys(STUFE_ARTEN)
    .filter(s => STUFE_ARTEN[s].some(([art]) => (art === "abstand" ? imAbstand(e) : NIMMT[art] ? NIMMT[art](e) : true)))
    .map(nummer).join(", ") || "—";
  const zeitalterText = name => {
    const z = ZEITALTER.find(x => x.name === name);
    return z ? `${z.bild} ${z.name} (${zeitalterSpanne(z)})` : `${name} (kein Zeitalter des Spiels)`;
  };
  const leiterText = e => {
    const i = abschnitt(jahreVon(e));
    return i < 0 ? "auf einer Sprosse: nicht gefragt" : ABSCHNITT_TEXT(i);
  };

  LS.listenPruefung("erdzeit-leiter", {
    ereignisse: {
      beschreibung: "Ereignisse der Erdgeschichte vor der Schrift, mit ungefährer Zeit und Zeitalter. Das Kind sieht die Zeit als "
        + `„vor etwa … Millionen Jahren“ (nie als Dezimalzahl). ${STUFEN_TEXT}. Ereignisse an der Grenze zweier Zeitalter kommen `
        + "beim Zeitalter nicht vor, Ereignisse genau auf einer Sprosse nicht auf der Leiter, Ereignisse unter 100 000 Jahren nicht "
        + "auf dem Erd-Tag. Die Spalte „Stufen“ zeigt je Ereignis, wo es vorkommt.",
      abschnitte: [{
        id: "ereignis", titel: "Ereignisse",
        spalten: ["Bild", "Ereignis", "Zeit", "Grenze", "Leiter", "Erd-Uhr", "Stufen"],
        hinweis: "Je Zeitalter eine Gruppe, mit der Spanne wie auf den Körben. Stimmt die Zeit (gerundeter, gängiger Wert, mit einem "
          + "Lehrmittel abzugleichen), und liegt sie in der Spanne des Zeitalters? Steht ein Ereignis an der Grenze zweier "
          + "Zeitalter, muss „Grenze“ gesetzt sein. Ist der Satz sachlich richtig und für Kinder der 4. bis 6. Klasse verständlich? "
          + "Lebten die genannten Lebewesen wirklich zu dieser Zeit (keine Dinosaurier mit Menschen; Säugetiere und Urvögel schon "
          + "neben den Dinosauriern)? Ist die Reihenfolge zweier Ereignisse eindeutig, wenn sie zusammen vorkommen können (das Spiel "
          + "hält dafür Abstand, siehe Beschreibung)? Zeigt das Bild das Gemeinte — und nicht ein heutiges Tier, das anders ist?",
        eintraege: () => ERDZEIT_EREIGNISSE,
        gruppe: e => zeitalterText(e.zeitalter),
        zeile: e => [e.bild, e.text, vorText(e), e.grenze ? "ja" : "—", leiterText(e), tagText(jahreVon(e)), stufenVon(e)],
      }],
    },
  });
}
