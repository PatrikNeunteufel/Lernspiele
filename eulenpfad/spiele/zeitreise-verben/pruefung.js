/* Prüfansicht der Zeitreise-Verben (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Zwei Listen (VERBEN_REGELMAESSIG, VERBEN_UNREGELMAESSIG), je Verb ein Eintrag. Die drei Sätze baut die Ansicht wie das
   Spiel (verb, teile, text); daneben die falschen Sätze, die das Spiel als Fallen zur Wahl stellt (falsches Hilfsverb,
   bei unregelmässigen Verben dazu Präteritum und ge-Form nach der Regel: regelForm). Gruppiert nach dem Hilfsverb.
   Zu prüfen: Sind die drei Sätze richtig und natürlich (Schweizer Schreibweise, er ass), passt das Hilfsverb ohne
   Zweifel — und ist jede Falle sicher falsch (kein echtes Wort, kein Satz, der auch richtig sein könnte)? */
"use strict";
{
  const satz = (v, zeit, variante) => text(teile(v, zeit, variante));
  const SAETZE = ["Grundform", "Präsens", "Präteritum", "Perfekt"];
  const saetze = v => [v.inf, satz(v, "praesens"), satz(v, "praeteritum"), satz(v, "perfekt")];
  const nachHilfsverb = ([, , , , hilf]) => `Perfekt mit „${hilf}“`;
  LS.listenPruefung("zeitreise-verben", {
    regelmaessig: {
      beschreibung: "Regelmässige Verben (Präteritum mit -te, ge-Form mit -t) mit Satz: jetzt oder früher? (Stufen 1, 2; Stufe 1 nur diese Verben), Zeitform erkennen und den Satz ins Präteritum oder Perfekt setzen (Stufe 3), hat oder ist, das Perfekt bilden und erkennen ohne Merkhilfe (Stufe 5), erkennen und in eine andere Zeit reisen (Stufe 6). Das Kind tippt die Zeit, das Hilfsverb oder den richtigen Satz an.",
      abschnitte: [{
        id: "regelmaessig", titel: "Regelmässige Verben",
        spalten: [...SAETZE, "Falle: falsches Hilfsverb"],
        hinweis: "Je Hilfsverb eine Gruppe. Das Spiel prüft die Formen nach der Regel nach; zu prüfen sind die Sätze. Die Falle (Stufen 5, 6) muss sicher falsch klingen.",
        eintraege: () => VERBEN_REGELMAESSIG, gruppe: nachHilfsverb,
        zeile: z => { const v = verb(z, true); return [...saetze(v), satz(v, "perfekt", "falschHilf")]; },
      }],
    },
    unregelmaessig: {
      beschreibung: "Unregelmässige Verben (Präteritum und ge-Form muss man sich merken) mit Satz: jetzt oder früher? (Stufe 2), Zeitform erkennen (Stufe 3), erkennen und den Satz ins Präteritum oder Perfekt setzen — mit der Form nach der Regel als Falle (Stufe 4), hat oder ist, das Perfekt bilden und erkennen ohne Merkhilfe (Stufe 5), erkennen und in eine andere Zeit reisen (Stufe 6).",
      abschnitte: [{
        id: "unregelmaessig", titel: "Unregelmässige Verben",
        spalten: [...SAETZE, "Falle: Präteritum nach Regel", "Falle: ge-Form nach Regel", "Falle: falsches Hilfsverb"],
        hinweis: "Je Hilfsverb eine Gruppe. Die Fallen bildet das Spiel nach der Regel (gehte, gegeht); jede muss sicher falsch sein und darf kein echtes Wort ergeben.",
        eintraege: () => VERBEN_UNREGELMAESSIG, gruppe: nachHilfsverb,
        zeile: z => {
          const v = verb(z, false);
          return [...saetze(v), satz(v, "praeteritum", "falschPraet"), satz(v, "perfekt", "falschPart"), satz(v, "perfekt", "falschHilf")];
        },
      }],
    },
  });
}
