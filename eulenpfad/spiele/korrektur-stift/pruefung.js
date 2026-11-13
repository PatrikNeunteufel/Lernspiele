/* Prüfansicht des Korrektur-Stifts (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „texte“ (KORREKTUR_TEXTE in woerter.js) mit zwei Arten Inhalt, deshalb mehrere Abschnitte:
   - „Texte“: jeder Text so, wie er mit lauter richtigen Formen dasteht (das verbesserte Ziel), die möglichen
     Fehlerstellen in „…“; je Länge eine Gruppe mit den Stufen, die ihn ziehen.
   - je Fehlerart ein Abschnitt mit ihren Fehlerstellen (wie die Fehler-Lupe je Regel): der Satz richtig und so, wie
     das Spiel ihn zeigt, wenn es diese Stelle wählt. Die Art rechnet das Spiel selbst (zerlege → artVon), die Sätze
     schneidet satzUm zu, die Stufen kommen aus STUFE und stellenVon des Spiels — nichts davon ist hier nachgebaut.
   Ein Eintrag einer Fehlerart ist [Text, Wortnummer]: der Text wie in woerter.js und die Stelle darin. Ändert sich
   der Text, sind seine Haken weg — die Art einer Stelle hängt vom Satz ab (Komma vor weil oder in einer Aufzählung).
   Zu prüfen: Ist der Text mit den richtigen Formen ganz richtig (Schweizer Schreibweise), ist jede gezeigte Form
   sicher falsch, gehört sie zur genannten Art, und gibt es genau eine richtige Verbesserung? */
"use strict";
{
  const LAENGE = { kurz: "kurze Texte", mittel: "mittlere Texte", lang: "lange Texte" };
  const stufenText = nr => (nr.length ? `${nr.length > 1 ? "Stufen" : "Stufe"} ${nr.join(", ")}` : "keine Stufe");
  /** Stufen, die den Text ziehen können (Länge passt, genug Stellen) — wie texteIn, aber ohne Freigabe-Filter. */
  const stufenVonText = t => Object.keys(STUFE)
    .filter(s => STUFE[s].laenge === t.laenge && stellenVon(t, s).length >= STUFE[s].fehler[1]).map(s => s.slice(1));
  /** Stufen, in denen die Stelle i des Texts als Fehler gezeigt werden kann. */
  const stufenVonStelle = (t, i) => stufenVonText(t).filter(nr => stellenVon(t, `s${nr}`).some(k => k.i === i));
  const woerterVon = t => KANDIDATEN.get(t.id);
  /** Satz um Wort i; die Stelle in „…“ — richtig oder so, wie das Spiel sie zeigt (falsch + Satzzeichen danach). */
  const satz = (t, i, zeigen) => {
    const woerter = woerterVon(t);
    const { anfang, ende } = satzUm(woerter, i);
    return woerter.slice(anfang, ende + 1).map((w, j) => (anfang + j === i ? `„${zeigen(w.stelle)}“${w.stelle.nach}` : w.text)).join(" ");
  };
  const stufeText = s => {
    const p = STUFE[s];
    const n = p.fehler[0] === p.fehler[1] ? `${p.fehler[0]} Fehler` : `${p.fehler[0]}–${p.fehler[1]} Fehler`;
    return `Stufe ${s.slice(1)}: ${LAENGE[p.laenge]}, ${n}${p.zaehlen ? "" : ", Zahl nicht genannt"}`;
  };

  /** Alle Fehlerstellen als [Text, Wortnummer], in der Reihenfolge der Texte. */
  const stellen = () => KORREKTUR_TEXTE.flatMap(t => woerterVon(t).map((w, i) => (w.stelle ? [t, i] : null)).filter(Boolean));
  const artVonStelle = ([t, i]) => woerterVon(t)[i].stelle.art;
  const ARTEN = [...Object.keys(ART_KURZ), null];
  const abschnittArt = art => ({
    id: `art-${art || "keine"}`,
    titel: art ? `Fehlerart: ${ART_KURZ[art]}` : "Stellen ohne Fehlerart (zeigt das Spiel nie)",
    hinweis: art
      ? `Regel im Spiel: ${REGELN[art]} Die Stelle in „…“ zeigt das Spiel so wie in „Satz wie gezeigt“; alle übrigen Wörter stehen richtig da. Ist die gezeigte Form sicher falsch und ein Fehler dieser Art, und ist „richtig“ die einzige richtige Verbesserung? Je Länge des Texts eine Gruppe mit den Stufen, die diese Art zeigen.`
      : "Diese Stellen passen zu keiner Fehlerart, die das Spiel erkennt — es wählt sie nie. Entweder die Stelle anpassen oder streichen.",
    spalten: ["Satz richtig", "Satz wie gezeigt", "richtig", "gezeigter Fehler", "weitere Wahl", "Text"],
    eintraege: () => stellen().filter(e => artVonStelle(e) === art),
    gruppe: ([t, i]) => `${LAENGE[t.laenge]} (${stufenText(stufenVonStelle(t, i))})`,
    zeile: ([t, i]) => {
      const s = woerterVon(t)[i].stelle;
      return [satz(t, i, x => x.richtig), satz(t, i, x => x.falsch), s.richtig + s.nach, s.falsch + s.nach, s.weitere.join(", ") || "—", t.id];
    },
  });

  LS.listenPruefung("korrektur-stift", {
    texte: {
      beschreibung: `Kurze Texte mit möglichen Fehlerstellen (${Object.keys(STUFE).map(stufeText).join("; ")}). Je Aufgabe wählt das Spiel einen Text der Länge und so viele Stellen, wie die Stufe verlangt, aus den Fehlerarten der Stufe; nur dort zeigt es die falsche Form, alles andere steht richtig da. Das Kind tippt ein falsches Wort an (bei fehlendem Komma oder Satzzeichen das Wort davor) und wählt die richtige Schreibweise.`,
      abschnitte: [
        {
          id: "texte", titel: "Texte (alle Stellen richtig)",
          hinweis: "Je Länge eine Gruppe mit den Stufen, die sie ziehen. So steht der Text da, wenn das Kind alles verbessert hat: Er muss ganz richtig sein (Gross und klein, Kommas, Satzzeichen, Schweizer Schreibweise) und darf keinen weiteren Fehler enthalten. In „…“ die Stellen, an denen das Spiel einen Fehler zeigen kann; sie werden je Fehlerart unten geprüft.",
          spalten: ["Text", "Text richtig (Stellen in „…“)", "Stellen", "Stufen"],
          eintraege: () => KORREKTUR_TEXTE,
          gruppe: t => LAENGE[t.laenge] || t.laenge,
          zeile: t => {
            const woerter = woerterVon(t);
            const text = woerter.map(w => (w.stelle ? `„${w.stelle.richtig}“${w.stelle.nach}` : w.text)).join(" ");
            return [t.id, text, woerter.filter(w => w.stelle).length, stufenText(stufenVonText(t))];
          },
        },
        ...ARTEN.filter(art => stellen().some(e => artVonStelle(e) === art)).map(abschnittArt),
      ],
    },
  });
}
