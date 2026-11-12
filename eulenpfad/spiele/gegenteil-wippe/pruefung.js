/* Prüfansicht der Gegenteil-Wippe (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „gegenteile“ mit drei Inhalten, je für sich abzuhaken: Bildpaare, gezeichnete Dinge (das Bild zeigt alle
   vier Fassungen, wie das Spiel sie zeichnet: zeichnungSvg) und Reihen zum Ordnen. Zu prüfen: Ist für jedes Kind ohne
   Zweifel klar, welches Ding mehr davon hat (bei „vorher“: was zuerst kommt)? */
"use strict";
{
  const ding = ([bild, name]) => `${bild} ${name}`;
  const merkmalName = m => (MERKMAL[m]?.a ? `${MERKMAL[m].a} – ${MERKMAL[m].b}` : "vorher – nachher");
  /** Die vier Fassungen eines gezeichneten Dings nebeneinander, von wenig (1) bis viel (4). */
  const fassungen = ([merkmal, art]) => LS.el("span", { style: "display:flex;gap:6px",
    html: [1, 2, 3, 4].map(s => zeichnungSvg({ art, merkmal, s }).replace("<svg ", '<svg style="width:56px" ')).join("") });
  const quelle = () => GEGENTEIL_LISTEN.gegenteile;
  LS.listenPruefung("gegenteil-wippe", {
    gegenteile: {
      beschreibung: "Gegensätze (gross – klein, schwer – leicht, lang – kurz, schnell – langsam, dick – dünn, breit – schmal, vorher – nachher): vergleichen (Stufen 1, 2), Gegenteil finden (3), steigern (4), ordnen (5) und auf der Wippe ordnen (6).",
      abschnitte: [
        { id: "paar", titel: "Bildpaare", spalten: ["mehr / zuerst", "weniger / danach"],
          hinweis: "Je Merkmal eine Gruppe. Das erste Ding hat mehr davon (bei vorher: kommt zuerst). Bewusst andere Paare als die Schätz-Waage.",
          eintraege: () => quelle().paare, gruppe: ([m]) => merkmalName(m), zeile: ([, a, b]) => [ding(a), ding(b)] },
        { id: "gezeichnet", titel: "Gezeichnete Dinge (Stufen 2–6)", spalten: ["Ding", "Merkmal"], bild: fassungen,
          hinweis: "Dasselbe Ding in vier Fassungen. Ist der Unterschied von einer Fassung zur nächsten deutlich, und zeigt er nur das Merkmal?",
          eintraege: () => quelle().gezeichnet || [], gruppe: ([m]) => merkmalName(m), zeile: ([m, , name]) => [name, merkmalName(m)] },
        { id: "reihe", titel: "Reihen zum Ordnen (Stufen 4–6)", spalten: ["Reihe vom wenigsten zum meisten"],
          hinweis: "Je Merkmal eine Gruppe. Jeder Schritt der Reihe muss klar sein.",
          eintraege: () => quelle().reihen || [], gruppe: ([m]) => merkmalName(m), zeile: ([, dinge]) => [dinge.map(ding).join(" → ")] },
      ],
    },
  });
}
