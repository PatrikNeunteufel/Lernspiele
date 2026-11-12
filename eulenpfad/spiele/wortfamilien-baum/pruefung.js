/* Prüfansicht des Wortfamilien-Baums (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Drei Listen aus den Spalten der Familien (WORTFAMILIEN, Zuordnung Spalte → Liste in WORTFAMILIEN_LISTEN): abgeleitet
   (einfach), umlaut-aehnlich (umlaut und falsch), zusammengesetzt (zusammen). Die Liste „umlaut-aehnlich“ trägt zwei
   gegensätzliche Inhalte und hat deshalb zwei Abschnitte: Wörter mit Umlaut, die zur Familie GEHÖREN, und Wörter, die nur
   ähnlich aussehen und NICHT dazugehören. Ein Eintrag ist ein Wort mit Familienwort und Stamm (so ändert ein neuer Stamm
   den Fingerabdruck); gruppiert je Familie. Den Stamm im Wort sucht die Ansicht wie das Spiel (norm, hatStamm, markiert).
   Zu prüfen: Gehört jedes Wort ohne Zweifel zur Familie (gleicher Stamm, gleiche Bedeutung), steckt der Stamm sichtbar
   darin — und hat jedes nur ähnliche Wort wirklich nichts mit der Familie zu tun? */
"use strict";
{
  /** Einträge einer Spalte: [Wort, Familienwort, Stamm] (bei falsch dazu die Bedeutung), in der Reihenfolge der Familien. */
  const woerterDer = spalte => () => WORTFAMILIEN.flatMap(f => f[spalte].map(w =>
    (Array.isArray(w) ? [w[0], f.wort, f.stamm, w[1]] : [w, f.wort, f.stamm])));
  /** Stamm im Wort in Klammern, gefunden wie im Spiel (markiert): Fähre → [Fähr]e, Gebäude → Ge[bäu]de. */
  const stammIm = (wort, stamm) => {
    const i = norm(wort).indexOf(norm(stamm));
    return i < 0 ? `${wort} (Stamm fehlt)` : `${wort.slice(0, i)}[${wort.slice(i, i + stamm.length)}]${wort.slice(i + stamm.length)}`;
  };
  const familie = ([, wort, stamm]) => `${wort} (Stamm ${stamm})`;
  const SPALTEN = ["Wort", "Stamm im Wort", "Familie", "Stamm"];
  const zeile = ([wort, fam, stamm]) => [wort, stammIm(wort, stamm), fam, stamm];
  /** Abschnitt für eine Spalte der Familien mit zugehörigen Wörtern. */
  const mitglieder = (spalte, titel, hinweis) => ({
    id: spalte, titel, hinweis, spalten: SPALTEN, eintraege: woerterDer(spalte), zeile, gruppe: familie,
  });
  LS.listenPruefung("wortfamilien-baum", {
    abgeleitet: {
      beschreibung: "Abgeleitete Wörter, in denen der Stamm unverändert steckt (Fahrer, Abfahrt): in Stufe 1 das dritte Wort zur Familie finden, in Stufe 2 den Ausreisser aus einer anderen Familie, in Stufe 3 das Wort an den richtigen Baum hängen oder den Stamm in drei Wörtern finden; in Stufe 4–6 stehen sie als Familienwörter neben Umlaut-Wörtern, zusammengesetzten Nomen und Fallen.",
      abschnitte: [mitglieder("einfach", "Abgeleitete Wörter (Stamm unverändert)",
        "Je Familie eine Gruppe. Der Stamm in [ ] muss buchstabengleich im Wort stehen und dieselbe Bedeutung tragen (kein Wort, das nur über die Herkunft dazugehört). Andere Familien und Stämme sind die falschen Wahlen — kein Wort darf auch den Stamm einer anderen Familie enthalten.")],
    },
    "umlaut-aehnlich": {
      beschreibung: "Zwei Inhalte, die ab Stufe 4 dazukommen: Wörter mit Umlaut im Stamm (Fähre) gehören zur Familie — in Stufe 4 an den richtigen Baum hängen, in Stufe 4–6 neben anderen Familienwörtern. Wörter, die nur ähnlich aussehen (Fahne), gehören NICHT dazu — in Stufe 4 und 5 ist eines davon der Ausreisser unter drei Familienwörtern, in Stufe 6 höchstens eines unter den Karten.",
      abschnitte: [
        mitglieder("umlaut", "Wörter mit Umlaut im Stamm (gehören dazu)",
          "Je Familie eine Gruppe. Aus a, o, u, au wird ä, ö, ü, äu — sonst bleibt der Stamm gleich, und das Wort gehört ohne Zweifel zur Familie."),
        { id: "falsch", titel: "Nur ähnliche Wörter (gehören NICHT dazu)",
          spalten: ["Wort", "Bedeutung", "Familie", "Stamm", "Stamm steckt darin"],
          hinweis: "Je Familie eine Gruppe. Die Bedeutung zeigt das Spiel als Erklärung („Fahne passt nicht: ein Tuch an einer Stange“). Das Wort darf mit der Familie nichts zu tun haben, auch nicht über die Herkunft. Steckt der Stamm sichtbar darin (Schlange, lang), ist es eine besonders starke Falle.",
          eintraege: woerterDer("falsch"), gruppe: familie,
          zeile: ([wort, fam, stamm, bedeutung]) => [wort, bedeutung, fam, stamm, hatStamm(wort, { stamm }) ? `ja: ${stammIm(wort, stamm)}` : "nein"] },
      ],
    },
    zusammengesetzt: {
      beschreibung: "Zusammengesetzte Nomen mit dem Stamm vorn oder hinten (Fahrrad, Wasserfall): in Stufe 5 das Wort zerlegen und an den richtigen von vier Bäumen hängen oder neben dem Ausreisser stehen, in Stufe 6 unter den Karten der Familie.",
      abschnitte: [mitglieder("zusammen", "Zusammengesetzte Nomen",
        "Je Familie eine Gruppe. Einer der Teile ist das Familienwort oder sein Stamm (unverändert); der andere Teil darf den Stamm keiner anderen Familie enthalten.")],
    },
  });
}
