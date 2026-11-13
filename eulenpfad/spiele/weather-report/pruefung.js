/* Prüfansicht des Weather-Reports (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „durchsagen“ (alles in woerter.js) mit mehreren Inhalten, je für sich abzuhaken: die Wetterwörter von
   Stufe 1, die Wetterbilder, die Durchsagen zum Vorlesen, die Fragen dazu, die Wegbeschreibungen, die Mannschaften, die
   Orte und Zeiten (deutsch für die Frage) und die Häuser auf dem Plan.
   Wie beim Hör-Reporter stehen die Durchsagen getrennt von ihren Fragen: Eine Durchsage hat bis zu sechs Fragen; jede
   Frage steht in der Gruppe ihrer Durchsage. Der Fingerabdruck einer Frage nimmt die Durchsage mit: Ändert sich der
   Text, ist auch der Haken seiner Fragen weg.
   Die Fragen rechnet das Spiel selbst (fakten, frageZu, enZahl, gradText, wegZiel, planEl in index.html). Das Spiel
   zieht und mischt die Ablenker teils zufällig (hier in fester Reihenfolge); die Spalte „mögliche Ablenker“ zeigt darum alles, was frageZu ziehen kann (beim
   Wetter alle Wetterbilder, beim Resultat alle Nachbarresultate), bei Temperatur und Sieger genau die drei bzw. zwei,
   die das Spiel immer zeigt. In welcher Stufe eine Frage drankommt, liest die Spalte
   „gestellt in“ aus STUFE: Art und Filter der Durchsagen (eins, zweiAngaben, jede), dieselben, die der Erzeuger nimmt.
   Zu prüfen: Ist die Durchsage gut zu verstehen, folgt die Antwort aus dem Gehörten, und ist kein Ablenker auch richtig? */
"use strict";
{
  const nr = stufen => (stufen.length ? stufen.map(s => s.slice(1)).join(", ") : "—");
  /** Stufen, deren Erzeuger diese Art tragen (aus STUFE). */
  const stufenDerArt = art => Object.keys(STUFE).filter(s => STUFE[s].some(([a]) => a === art));
  /** Stufen, in denen eine Frage zu diesem Fakt drankommt — Art und Filter der Durchsagen aus STUFE des Spiels. */
  function gestelltIn(d, typ) {
    if (d.art === "lang") return stufenDerArt("zwei");
    return Object.keys(STUFE).filter(s => STUFE[s].some(([a, , filter]) => a === `${d.art}-${typ}` && (!filter || filter(d))));
  }
  /** Zahl der Möglichkeiten wie im Spiel; bei zufällig gezogenen Ablenkern alle möglichen. */
  const ALLE = 99;
  const moeglichkeiten = typ => (typ === "sieger" ? 3 : typ === "grad" ? 4 : ALLE);
  const wetter = w => `${WR_WETTER[w][0]} ${w}`;
  /** Antwort, wie sie auf dem Knopf steht (inhaltFuer im Spiel). */
  const knopf = (q, o) => { const c = inhaltFuer(q)(o); return typeof c === "string" ? c : [c.bild, c.text].filter(Boolean).join(" "); };
  /** Ablenker in fester Reihenfolge (das Spiel mischt sie): Wetter wie HAUPT_WETTER, Zahlen aufsteigend, Resultate nach Text;
      beim Sieger wie im Spiel (Teams, dann draw). */
  const ablenker = q => q.optionen.filter(o => o !== q.richtig).sort((a, b) => (q.inhalt === "team" ? 0 : q.inhalt === "wetter"
    ? HAUPT_WETTER.indexOf(a) - HAUPT_WETTER.indexOf(b) : typeof a === "number" ? a - b : String(a).localeCompare(String(b), "en", { numeric: true })));
  const ARTNAME = { wetter: "Wetter", sport: "Sport", lang: "Lange Durchsage", weg: "Weg" };
  const gruppeDurchsage = d => {
    if (d.art === "lang") return "Lange Durchsagen (Stufe 6)";
    if (d.art === "sport") return `Sportresultate (Stufe ${nr(stufenDerArt("sport-sieger"))})`;
    return eins(d) ? "Wetter, eine Angabe (Stufe 2)" : "Wetter, zwei Tage oder Orte (Stufe 3)";
  };
  /** Angaben einer Durchsage in Kurzform, damit man sie neben dem Text vergleichen kann. */
  const angabenText = d => [
    ...(d.angaben || []).map(x => `${label(x)}: ${wetter(x.wetter)}${x.grad !== undefined ? `, ${gradText(x.grad)}` : ""}`),
    ...(d.spiele || []).map(s => `${s.sport}: ${s.teams[0]} ${s.tore[0]} : ${s.tore[1]} ${s.teams[1]}`),
  ].join(" · ");
  const ZIEL_TEXT = z => (z === "ende" ? "am Ende der Strasse"
    : `${z[0] === "1" ? "erste" : "zweite"} Strasse ${z[1] === "L" ? "links" : "rechts"}, Haus ${z[3] === "l" ? "links" : "rechts"}`);
  /** Plan wie im Spiel (planEl), Häuser in der Reihenfolge der Liste, das Ziel grün. */
  function plan(d) {
    const belegung = Object.fromEntries(Object.keys(PLATZ).map((p, i) => [p, WR_GEBAEUDE[i]]));
    const p = planEl(belegung, () => {});
    p.style.cssText = "width:220px;font-size:10px;margin:0";
    const ziel = [...p.querySelectorAll(".wr-haus")].find(k => k.getAttribute("aria-label") === belegung[d.ziel][0]);
    if (ziel) ziel.classList.add("richtig");
    return p;
  }
  /** Stufen mit Wetterbildern als Antwort: Wort, Wetterfrage, lange Durchsage. */
  const WETTER_STUFEN = [...new Set(["wort", "wetter-wetter", "zwei"].flatMap(stufenDerArt))].sort();
  /** Wie ein Ort oder eine Zeit in den Durchsagen gebraucht wird (wo oder wann). */
  const gebrauch = en => (WR_DURCHSAGEN.some(d => (d.angaben || []).some(x => x.wo === en)) ? { wo: en }
    : WR_DURCHSAGEN.some(d => (d.angaben || []).some(x => x.wann === en)) ? { wann: en } : null);
  const durchsagen = arten => WR_DURCHSAGEN.filter(d => arten.includes(d.art));

  LS.listenPruefung("weather-report", {
    durchsagen: {
      beschreibung: "Kurze englische Durchsagen zum Hören (Wetter, Sportresultat, Weg). Die Eule liest vor, das Kind tippt "
        + "auf die Antwort. Stufe 1: ein Wetterwort oder „It’s sunny.“ → Wetterbild. Stufe 2: eine kurze Wettermeldung, "
        + "Frage nach dem Wetter. Stufe 3: zwei Tage oder Orte, Frage nach Wetter oder Temperatur. Stufe 4: Sportresultat, "
        + "Frage nach Sieger oder Resultat. Stufe 5: Wegbeschreibung, das Kind tippt auf das Haus auf dem Plan. Stufe 6: "
        + "lange Durchsage mit zwei Fragen nacheinander. Die Frage steht englisch und darunter deutsch.",
      abschnitte: [{
        id: "woerter", titel: "Wetterwörter (Stufe 1)", spalten: ["gehört", "Bild", "deutsch"],
        hinweis: "Passt das Bild eindeutig zum Wort, und ist unter den anderen Wetterbildern keins ebenso richtig (hot 🥵 und "
          + "sunny ☀️, stormy ⛈️ und rainy 🌧️)? „It’s …“ mit typografischem Apostroph; die Stimme liest ihn gerade.",
        eintraege: () => WR_WOERTER,
        zeile: ([en, w]) => [en, WR_WETTER[w][0], WR_WETTER[w][1]],
      }, {
        id: "wetter", titel: "Wetterbilder", spalten: ["Wetter", "Bild", "deutsch", "Antwort in"],
        hinweis: "Zeigt das Bild das Wetter eindeutig? hot und cold kommen nur in Stufe 1 vor (in den Durchsagen wären sie "
          + "neben sunny und snowy mehrdeutig).",
        eintraege: () => Object.entries(WR_WETTER),
        zeile: ([w, [bild, de]]) => [w, bild, de, `Stufe${HAUPT_WETTER.includes(w) ? "n" : ""} ${nr(HAUPT_WETTER.includes(w) ? WETTER_STUFEN : stufenDerArt("wort"))}`],
      }, {
        id: "texte", titel: "Durchsagen", spalten: ["Id", "Durchsage", "Angaben"],
        hinweis: "Je Stufe eine Gruppe. Ist die Durchsage gut zu verstehen, wenn man sie nur hört (natürliches britisches "
          + "Englisch, Zahlen als Wörter, „nil“ für null Tore)? Stimmt jede Angabe rechts mit dem Text überein, und kommt "
          + "kein weiteres Wetter vor? Die Fragen dazu stehen im Abschnitt „Fragen“.",
        eintraege: () => durchsagen(["wetter", "sport", "lang"]),
        gruppe: gruppeDurchsage,
        zeile: d => [d.id, d.text, angabenText(d)],
      }, {
        id: "fragen", titel: "Fragen zu den Durchsagen", spalten: ["Frage", "deutsch", "richtig", "mögliche Ablenker", "gestellt in"],
        hinweis: "Je Durchsage eine Gruppe; den Text dazu im Abschnitt „Durchsagen“ nachlesen. Folgt die richtige Antwort "
          + "eindeutig aus dem Gehörten — auch wenn die Frage nach einem von zwei Tagen oder Orten fragt? Ist kein Ablenker "
          + "ebenso richtig (etwa ein zweites Wetter am selben Tag)? Ist die englische Frage natürlich (will bei einer "
          + "Vorhersage)? Fragen, die keine Stufe stellt (Temperatur in Stufe 2), fehlen.",
        eintraege: () => durchsagen(["wetter", "sport", "lang"]).flatMap(d => fakten(d)
          .filter(f => gestelltIn(d, f.typ).length).map(fakt => ({ durchsage: d, fakt }))),
        gruppe: ({ durchsage: d }) => `${d.id} · ${ARTNAME[d.art]}`,
        zeile: ({ durchsage: d, fakt }) => {
          const q = frageZu(d, fakt, moeglichkeiten(fakt.typ));
          return [q.en, q.de, knopf(q, q.richtig), ablenker(q).map(o => knopf(q, o)).join(" · "),
            nr(gestelltIn(d, fakt.typ))];
        },
      }, {
        id: "wege", titel: "Wegbeschreibungen (Stufe 5)", spalten: ["Id", "Wegbeschreibung", "Ziel", "aus dem Text gelesen"],
        bild: plan,
        hinweis: "Start beim Stern, Blick die Hauptstrasse hinauf; links und rechts gelten so, wie man geht. Führt der Weg "
          + "eindeutig zum grünen Haus? Das Spiel liest das Ziel selbst aus dem Text (rechte Spalte) und verteilt die Häuser "
          + "je Aufgabe neu. Ist jeder Satz natürliches britisches Englisch?",
        eintraege: () => durchsagen(["weg"]),
        zeile: d => { const z = wegZiel(d.text); return [d.id, d.text, ZIEL_TEXT(d.ziel), z ? ZIEL_TEXT(z) : "kein Weg erkannt"]; },
      }, {
        id: "teams", titel: "Mannschaften (Stufen 4 und 6)", spalten: ["Team", "Bild"],
        hinweis: "Erfundene Schulteams. Ist das Tier am Bild gut zu erkennen und passt es zum Namen?",
        eintraege: () => Object.entries(WR_TEAMS),
        zeile: ([team, bild]) => [team, bild],
      }, {
        id: "orte", titel: "Orte und Zeiten (für die deutsche Frage)", spalten: ["englisch", "deutsch", "in der Frage"],
        hinweis: "Stimmt die deutsche Übersetzung, und passt sie in „Wie ist das Wetter …?“ (Orte mit „in“)?",
        eintraege: () => Object.entries(WR_ORTE),
        zeile: ([en, de]) => { const x = gebrauch(en); return [en, de, x ? `Wie ist das Wetter ${labelDe(x)}?` : "in keiner Durchsage"]; },
      }, {
        id: "haeuser", titel: "Häuser auf dem Plan (Stufe 5)", spalten: ["Haus", "Bild"],
        hinweis: "Ist das Haus am Bild zu erkennen? Die Häuser werden je Aufgabe neu verteilt; der Name steht auf dem Plan unter dem Bild.",
        eintraege: () => WR_GEBAEUDE,
        zeile: ([haus, bild]) => [haus, bild],
      }],
    },
  });
}
