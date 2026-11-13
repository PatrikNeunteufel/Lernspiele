/* Prüfansicht des Blutkreislauf-Lotsen (LP5 a, LERN_Session38; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „fragen“ (woerter.js) mit zwei Inhalten, je für sich abzuhaken: die Fragen (KREISLAUF_FRAGEN) mit der
   richtigen Antwort, den beiden Ablenkern und der Erklärung, die nach der richtigen Antwort erscheint — und die Tipps je
   Thema (KREISLAUF_TIPPS), die nach einer falschen Antwort und vor dem Antworten kommen. Die Fragen stehen je Stufe und
   Thema in einer Gruppe, das Bild über der Frage aus dem Spiel (THEMA_BILD). Die Spalte „Stufen“ liest die
   Stufentabelle des Spiels (STUFE: Arten und Feld fragen) mit seiner Auswahl je Stufennummer (fragenFuer).
   Das Lotsen im Bild (Stationen, Organe, „Wo …?“) steht in index.html und gehört nicht zur Liste.
   Zu prüfen: Stimmen die Sachangaben (Herz, Blut, Lunge, Puls), ist die Antwort eindeutig richtig, ist kein Ablenker
   ebenso richtig, verrät der Tipp die Lösung nicht, passt alles zum Alter (4. Klasse in Stufe 1, 6. Klasse in Stufe 5)? */
"use strict";
{
  const nummer = s => s.slice(1);
  /** Stufen, in denen das Spiel die Frage stellen kann (STUFE mit Art „frage“, Auswahl fragenFuer; ohne Freigabe). */
  const stufenVon = f => Object.keys(STUFE)
    .filter(s => STUFE[s].arten.includes("frage") && fragenFuer(STUFE[s].fragen).includes(f)).map(nummer);
  const stufenText = f => stufenVon(f).join(", ") || "—";
  const themaName = t => `${THEMA_BILD[t] || ""} ${t[0].toUpperCase()}${t.slice(1)}`.trim();
  /** „Stufe 1 (4. Klasse): 1 von 2 Aufgabenarten · …“ aus STUFE. */
  const STUFEN_TEXT = Object.entries(STUFE).filter(([, p]) => p.arten.includes("frage"))
    .map(([s, p]) => `Stufe ${nummer(s)} (${LS.stufeFuer("blutkreislauf-lotse", s)}): `
      + `${p.arten.length > 1 ? `neben dem Antippen im Körperbild (${p.arten.length} Aufgabenarten)` : "nur Fragen"}, `
      + `${fragenFuer(p.fragen).length} Fragen`)
    .join(" · ");

  LS.listenPruefung("blutkreislauf-lotse", {
    fragen: {
      beschreibung: "Fragen zu Herz, Lunge, Blut und Kreislauf. Das Kind liest die Frage und tippt eine von drei Antworten an "
        + `(gemischt); nach der richtigen Antwort steht die Erklärung da, nach einer falschen der Tipp zum Thema. ${STUFEN_TEXT}. `
        + "Die übrigen Stufen lotsen das Blutkörperchen im Bild und nutzen die Liste nicht.",
      abschnitte: [{
        id: "fragen", titel: "Fragen", spalten: ["Bild", "Frage", "richtig", "Ablenker", "Erklärung", "Stufen"],
        hinweis: "Je Stufe und Thema eine Gruppe. Stimmt die Sachangabe in Antwort und Erklärung (Arterie = vom Herzen weg, "
          + "Vene = zum Herzen hin; Lungenarterie sauerstoffarm, Lungenvene sauerstoffreich; Zahlen zu Puls, Blutmenge und "
          + "Herzschlägen)? Ist die Antwort eindeutig richtig und keiner der beiden Ablenker auch richtig oder halb richtig? "
          + "Rechnet die Erklärung richtig? Passt die Frage zum Alter (Stufe 1: 4. Klasse, Stufe 5: 6. Klasse)? Kommt eine "
          + "Frage schon im Körper-Puzzle vor (Arterien, Venen, Puls am Handgelenk), gehört sie nicht hierher.",
        eintraege: () => KREISLAUF_FRAGEN,
        gruppe: f => {
          const st = stufenVon(f);
          const wo = st.length ? st.map(n => `Stufe ${n} (${LS.stufeFuer("blutkreislauf-lotse", `s${n}`)})`).join(", ") : `keine Stufe (Feld ${f[0]})`;
          return `${wo} · ${themaName(f[1])}`;
        },
        zeile: f => {
          const [, thema, frage, richtig, falsch1, falsch2, erklaerung] = f;
          return [THEMA_BILD[thema] || "—", frage, richtig, `${falsch1} · ${falsch2}`, erklaerung, stufenText(f)];
        },
      }, {
        id: "tipps", titel: "Tipps je Thema", spalten: ["Thema", "Tipp", "Fragen"],
        hinweis: "Der Tipp kommt nach einer falschen Antwort und als zweiter Tipp vor dem Antworten, bei jeder Frage des Themas. "
          + "Verrät er die Lösung nicht, hilft er aber bei allen Fragen des Themas (Spalte „Fragen“: wie viele)? Stimmt er fachlich?",
        eintraege: () => Object.entries(KREISLAUF_TIPPS),
        zeile: ([thema, tipp]) => [themaName(thema), tipp, String(KREISLAUF_FRAGEN.filter(f => f[1] === thema).length)],
      }],
    },
  });
}
