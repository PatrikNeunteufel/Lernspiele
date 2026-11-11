/* Abschluss-Animationen (docs/konzept_abschluss_animationen.md; Entscheide AN1 a, AN2 a, AN3 a, LERN_Session27).

   Ein Spiel beschreibt seine Animation in LS.spiel({ …, feier: { muster, … } }) und lädt diese Datei nach spiel.js. Der
   Rahmen spielt sie im Schlussbild ab (LS_FEIER.zeige), wenn die Einstellung „Abschluss-Animation“ an ist; ohne feier
   oder ohne diese Datei bleibt das bisherige Schlussbild mit Konfetti.

   Regeln (Konzept, Abschnitt 3): fachlich treu, 2–4 Sekunden, ein Tippen springt ans Ende, „Bewegung reduzieren“ des
   Geräts zeigt gleich das Schlussbild, nie strafend (1 Stern bekommt die Animation der Stufe, mehr Sterne schmücken aus:
   Schmuck der Stufe 2 und 3, data-schmuck="2"/"3"), ohne Text ausser Zahlen, die zum Inhalt gehören, SVG ohne
   Bibliothek. Die Animation ist Schmuck (aria-hidden); die Knöpfe des Schlussbilds sind sofort bedienbar.

   Muster (Konzept, Abschnitt 5): REISE, ZOOM, ZYKLUS, SZENE, WACHSEN, BAUEN, AUFTRITT, SAMMELN, KARTE.
   Eine Stufe darf ein anderes Muster nehmen: ziele.sX = { muster: "…", ziel: …, … } (Himmels-Forscher s5, s6).

   REISE  { muster: "reise", reisender: "rakete" | "sonde", ziele: { s1 … s6 } } — je Stufe ein Ziel:
            "mond", "mars", "jupiter", "saturn" (von der Erde dorthin), { um: "erde" } (einmal herum),
            { rand: true } (an den acht Planeten vorbei bis an den Rand des Sonnensystems)
   ZOOM   { muster: "zoom", ziele: { s1: 4, s2: 4.6, … } } — Landung auf dem Zahlenstrahl; je Stelle nach dem Komma eine
            Zeile tiefer, wie unter einer Lupe (stellen: { sX: n } überschreibt die Zahl der Stellen)
   ZYKLUS { muster: "zyklus", bilder: "mond", ziele: { s1: ["neu"], … } } — die Phasen der Reihe nach bis zur Phase der
            Stufe; Mond zunehmend, rechts beleuchtet (Sicht von der Nordhalbkugel)
   SZENE  { muster: "szene", szene: "eule-vollmond" }
   WACHSEN { muster: "wachsen", bilder: "baum", ziele: { s1: "stamm", … } } — der Baum wächst Teil um Teil bis zum Teil
            der Stufe: stamm, ast, aeste, blaetter, blueten, fruechte (aus den Blüten werden Früchte, die Eule setzt sich
            in die Krone); Wörter sind nur als leere Kärtchen angedeutet
   BAUEN  { muster: "bauen", bilder: "mauer", ziele: { s1: [2, 3, 4], … } } — Zahlenmauer aus den Grundsteinen der
            Stufe, Stein um Stein von unten; jeder Stein trägt die Summe der beiden darunter (data-stein, data-wert)
   AUFTRITT { muster: "auftritt", bilder: "musik", ziele: { s1: 1, … s5: 5, s6: "orchester" } } — Eulen treten mit ihren
            Instrumenten auf (Trommel, Querflöte, Geige, Trompete, Cello; Orchester mit Streichern dahinter), richtig
            gehalten; je Auftritt ein kurzer Ton über klang (der Ton des Rahmens, nur mit Ton an, Regel 8)
   SAMMELN { muster: "sammeln", bilder: "angel", ziele: { s1: 1, … } } — die Eule angelt so viele Fische in den Eimer
   KARTE  { muster: "karte", karte: KARTE, ziele: { sX: { flaechen: [d …] | punkte: [[x, y] …], umriss: [d …],
            ausschnitt: true } } } — die Eule fliegt von West nach Ost über die stumme Karte (Daten des Spiels), was sie
            überfliegt, leuchtet auf; ausschnitt zeigt nur die Gegend der Ziele
   Mengen (Musiker, Fische) zählt der Test: data-anzahl am Bild, data-stueck je Stück. */
"use strict";

var LS_FEIER = (function () {
  const NS = "http://www.w3.org/2000/svg";
  const START = 0.15; // kurz warten, bis das Schlussbild aufgebaut ist (Rückmeldung Patrik: ohne hakte der Anfang)
  const DAUER = 2.4; // Sekunden für die Bewegung; der Schmuck danach
  const BREITE = 320, HOEHE = 150;
  const t = s => `${(START + s).toFixed(2)}s`; // Zeitpunkt ab dem Start der Animation

  /** SVG-Element bauen. */
  function s(tag, attr = {}, ...kinder) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attr)) e.setAttribute(k, String(v));
    for (const k of kinder) if (k) e.appendChild(typeof k === "string" ? document.createTextNode(k) : k);
    return e;
  }
  /** Erscheinen ab Zeitpunkt ab (Sekunden) — im ruhigen Bild gleich sichtbar. */
  function erscheine(e, ab, ruhig, dauer = 0.3) {
    if (ruhig) return e;
    e.setAttribute("opacity", "0");
    e.appendChild(s("animate", { attributeName: "opacity", from: 0, to: 1, begin: t(ab), dur: `${dauer}s`, fill: "freeze" }));
    return e;
  }
  const himmelGrund = () => s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#1d2140" });
  /** Zahl in der Schreibweise des Geräts (Dezimalzeichen nach Einstellung, LS.dezimalText). */
  const zahlText = (x, stellen) => (typeof LS !== "undefined" && LS.dezimalText ? LS.dezimalText(x, stellen) : x.toFixed(stellen));

  // ---------- Bilder ----------
  // Farben der Himmelskörper wie in Wirklichkeit (Regel 1: Mars rötlich, Jupiter mit Streifen, Saturn mit Ring);
  // Grössen und Abstände nicht massstäblich.
  const KOERPER = {
    merkur: { farbe: "#a8a29a", r: 2 },
    venus: { farbe: "#e6c27a", r: 3 },
    erde: { farbe: "#2f7fd6", r: 4 },
    mond: { farbe: "#c9ccd3", r: 14 },
    mars: { farbe: "#c8553d", r: 16 },
    jupiter: { farbe: "#d9b38c", r: 28 },
    saturn: { farbe: "#e3c77a", r: 20 },
    uranus: { farbe: "#9fd8e0", r: 5 },
    neptun: { farbe: "#4062c8", r: 5 },
  };

  function himmel() {
    // feste Punkte statt Zufall: jedes Mal dasselbe Bild
    const g = s("g", { fill: "#ffffff", opacity: "0.7" });
    [[18, 20], [64, 12], [110, 30], [150, 8], [196, 22], [238, 12], [290, 28], [30, 120], [92, 138], [210, 132], [300, 118], [262, 92]]
      .forEach(([x, y], i) => g.appendChild(s("circle", { cx: x, cy: y, r: i % 3 ? 0.9 : 1.4 })));
    return g;
  }

  /** Himmelskörper an x, y mit Radius r (ohne r: Grösse aus KOERPER). */
  function koerper(name, x, y, r = KOERPER[name].r) {
    const f = KOERPER[name].farbe;
    const g = s("g", { "data-koerper": name });
    if (name === "erde") {
      g.append(s("circle", { cx: x, cy: y, r, fill: f }),
        s("ellipse", { cx: x - r * 0.3, cy: y - r * 0.2, rx: r * 0.35, ry: r * 0.25, fill: "#3aa35b" }),
        s("ellipse", { cx: x + r * 0.35, cy: y + r * 0.3, rx: r * 0.25, ry: r * 0.18, fill: "#3aa35b" }));
    } else if (name === "mond") {
      g.append(s("circle", { cx: x, cy: y, r, fill: f }),
        s("circle", { cx: x - r * 0.3, cy: y - r * 0.25, r: r * 0.2, fill: "#aeb2ba" }),
        s("circle", { cx: x + r * 0.35, cy: y + r * 0.3, r: r * 0.14, fill: "#aeb2ba" }));
    } else if (name === "mars") {
      g.append(s("circle", { cx: x, cy: y, r, fill: f }), s("circle", { cx: x + r * 0.3, cy: y - r * 0.2, r: r * 0.22, fill: "#a33f2c" }));
    } else if (name === "jupiter") {
      const id = `feier-j${Math.round(x)}`;
      g.append(s("clipPath", { id }, s("circle", { cx: x, cy: y, r })), s("circle", { cx: x, cy: y, r, fill: f }));
      for (const dy of [-0.45, -0.1, 0.25, 0.55]) {
        g.appendChild(s("rect", { x: x - r, y: y + dy * r, width: 2 * r, height: r * 0.13, fill: "#b9875e", "clip-path": `url(#${id})` }));
      }
    } else if (name === "saturn") {
      g.append(s("circle", { cx: x, cy: y, r, fill: f }),
        s("ellipse", { cx: x, cy: y, rx: r * 1.8, ry: r * 0.45, fill: "none", stroke: "#c9a85a", "stroke-width": Math.max(1, r * 0.18),
          transform: `rotate(-15 ${x} ${y})` }));
    } else {
      g.appendChild(s("circle", { cx: x, cy: y, r, fill: f }));
    }
    return g;
  }

  function sonne(x, y, r) {
    return s("g", { "data-koerper": "sonne" },
      s("circle", { cx: x, cy: y, r: r * 2.2, fill: "#ffcf3a", opacity: "0.25" }),
      s("circle", { cx: x, cy: y, r, fill: "#ffcf3a" }));
  }

  /** Rakete, nach rechts zeigend, um 0,0 (Spitze bei x = 22); mitEule: die Eule schaut aus dem Fenster (3 Sterne). */
  function rakete(mitEule) {
    const g = s("g", { "data-reisender": "rakete" },
      s("path", { d: "M-16,-5 L-24,-12 L-12,-5 Z", fill: "#e0569a" }),
      s("path", { d: "M-16,5 L-24,12 L-12,5 Z", fill: "#e0569a" }),
      s("ellipse", { cx: 0, cy: 0, rx: 17, ry: 7, fill: "#f2f2f7", stroke: "#8a8fa8", "stroke-width": 1 }),
      s("path", { d: "M12,-5 Q22,0 12,5 Z", fill: "#e5484d" }),
      s("circle", { cx: 2, cy: 0, r: 3.6, fill: mitEule ? "#c58b4c" : "#7cc7f0", stroke: "#8a8fa8", "stroke-width": 0.8 }),
      s("path", { d: "M-19,-3 L-28,0 L-19,3 Z", fill: "#f5b301" }));
    if (mitEule) g.append(s("circle", { cx: 0.8, cy: -0.6, r: 1, fill: "#ffffff" }), s("circle", { cx: 3.2, cy: -0.6, r: 1, fill: "#ffffff" }));
    return g;
  }

  /** Raumsonde, nach rechts fliegend, um 0,0: Körper mit Antenne und zwei Solarflächen. */
  function sonde() {
    return s("g", { "data-reisender": "sonde" },
      s("rect", { x: -14, y: -9, width: 8, height: 18, fill: "#2f6fb0", stroke: "#9fb4d8", "stroke-width": 0.6 }),
      s("rect", { x: 6, y: -9, width: 8, height: 18, fill: "#2f6fb0", stroke: "#9fb4d8", "stroke-width": 0.6 }),
      s("line", { x1: -6, y1: 0, x2: 6, y2: 0, stroke: "#c9ccd3", "stroke-width": 1.2 }),
      s("rect", { x: -4, y: -4, width: 8, height: 8, rx: 1.5, fill: "#e3c77a" }),
      s("path", { d: "M0,-4 L0,-9 M-3,-11 Q0,-7 3,-11", stroke: "#f2f2f7", "stroke-width": 1, fill: "none" }));
  }
  const REISENDE = { rakete, sonde };

  /** Fähnchen (Schmuck ab 2 Sternen; schmuck "3", wo es zum Schmuck der 3 Sterne gehört), erscheint nach der Bewegung. */
  function fahne(x, y, ruhig, schmuck = "2") {
    return erscheine(s("g", { "data-schmuck": schmuck },
      s("line", { x1: x, y1: y, x2: x, y2: y - 18, stroke: "#6b7089", "stroke-width": 1.5 }),
      s("path", { d: `M${x},${y - 18} L${x + 12},${y - 14} L${x},${y - 10} Z`, fill: "#2fb36b" })), DAUER, ruhig);
  }

  /** Funken (Schmuck bei 3 Sternen) um x, y. */
  function funken(x, y, ruhig) {
    const g = s("g", { "data-schmuck": "3" });
    for (let i = 0; i < 8; i++) {
      const w = (i / 8) * 2 * Math.PI, fx = x + Math.cos(w) * 16, fy = y + Math.sin(w) * 16;
      const c = s("circle", { cx: fx, cy: fy, r: 2, fill: ["#f5b301", "#e0569a", "#2fb36b", "#2f8fe0"][i % 4], opacity: ruhig ? 1 : 0 });
      if (!ruhig) {
        c.appendChild(s("animate", { attributeName: "opacity", values: "0;1;0.6", begin: t(DAUER + 0.1), dur: "0.8s", fill: "freeze" }));
        c.appendChild(s("animate", { attributeName: "r", values: "0.5;2.6;2", begin: t(DAUER + 0.1), dur: "0.8s", fill: "freeze" }));
      }
      g.appendChild(c);
    }
    return g;
  }

  /** Funkelnde Sterne (Schmuck ab 2 Sternen, am Himmel statt des Fähnchens). */
  function funkeln(ruhig) {
    const g = s("g", { "data-schmuck": "2", fill: "#fff6c8" });
    for (const [x, y] of [[40, 22], [92, 14], [140, 30], [228, 18], [286, 34], [308, 70]]) {
      const c = s("circle", { cx: x, cy: y, r: 1.8 });
      if (!ruhig) c.appendChild(s("animate", { attributeName: "r", values: "1.2;2.6;1.6", begin: t(DAUER), dur: "0.9s", fill: "freeze" }));
      g.appendChild(c);
    }
    return g;
  }

  /** Sternschnuppe (Schmuck bei 3 Sternen, am Himmel statt der Funken). */
  function sternschnuppe(ruhig) {
    // heller Kopf vorn, der Schweif verblasst nach hinten — so ist sie als Sternschnuppe zu erkennen (ein blosser
    // Strich war es nicht, Rückmeldung Patrik)
    const strich = s("g", {},
      // links oben im freien Himmel (rechts stehen Mond und Ziele)
      s("linearGradient", { id: "feier-schweif", gradientUnits: "userSpaceOnUse", x1: 96, y1: 32, x2: 144, y2: 8 },
        s("stop", { offset: 0, "stop-color": "#ffffff", "stop-opacity": 1 }), s("stop", { offset: 1, "stop-color": "#ffffff", "stop-opacity": 0 })),
      s("path", { d: "M96,30.5 L144,7 L144,9 L96,33.5 Z", fill: "url(#feier-schweif)" }),
      s("circle", { cx: 96, cy: 32, r: 3.4, fill: "#fff6c8", opacity: 0.5 }),
      s("circle", { cx: 96, cy: 32, r: 2, fill: "#ffffff" }));
    const g = s("g", { "data-schmuck": "3" }, strich);
    if (!ruhig) {
      strich.setAttribute("opacity", "0");
      strich.appendChild(s("animate", { attributeName: "opacity", values: "0;1;0.7", begin: t(DAUER + 0.1), dur: "0.7s", fill: "freeze" }));
      strich.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "40 -20", to: "0 0", begin: t(DAUER + 0.1), dur: "0.7s", fill: "freeze" }));
    }
    return g;
  }

  /**
   * Eine Figur einen Weg entlang bewegen. weg: SVG-Pfad; ende: { x, y, winkel } für das stehende Bild („Bewegung
   * reduzieren“). Die Bewegung endet und bleibt stehen (fill freeze).
   */
  function bewege(figur, weg, ende, ruhig, { drehen = true, ab = 0, dauer = DAUER, linear = false } = {}) {
    if (ruhig) {
      figur.setAttribute("transform", `translate(${ende.x} ${ende.y}) rotate(${ende.winkel})`);
      return figur;
    }
    // linear: gleichmässig, wo etwas im Takt der Figur erscheint (Hund und Knochen, Velo und Tabelle)
    figur.appendChild(s("animateMotion", { path: weg, begin: t(ab), dur: `${dauer}s`, ...(drehen ? { rotate: "auto" } : {}), fill: "freeze",
      ...(linear ? {} : { calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }) }));
    // vor dem Start noch nicht im Bild (sonst stünde die Figur kurz bei 0,0)
    figur.setAttribute("opacity", "0");
    figur.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(ab), fill: "freeze" }));
    return figur;
  }

  /** Mondphase an x, y: hell = beleuchteter Anteil 0 (Neumond) … 1 (Vollmond), zunehmend rechts hell (Nordhalbkugel). */
  function mondphase(x, y, r, hell) {
    const g = s("g", { "data-mond": String(hell) });
    g.appendChild(s("circle", { cx: x, cy: y, r, fill: "#3a3f5c", stroke: "#5a607e", "stroke-width": 0.8 }));
    if (hell >= 0.999) g.appendChild(s("circle", { cx: x, cy: y, r, fill: "#f4ecc8" }));
    else if (hell > 0.001) {
      // rechte Hälfte als Halbkreis, die Schattengrenze als Ellipsenbogen: bei Sichel nach rechts, bei Dreiviertel nach links
      const rx = Math.abs(1 - 2 * hell) * r, ueberHalb = hell > 0.5 ? 1 : 0;
      g.appendChild(s("path", { d: `M${x},${y - r} A${r},${r} 0 0,1 ${x},${y + r} A${rx},${r} 0 0,${ueberHalb} ${x},${y - r} Z`, fill: "#f4ecc8" }));
    }
    return g;
  }
  const MONDPHASEN = { neu: 0, sichel: 0.25, halb: 0.5, dreiviertel: 0.75, voll: 1 };

  /** Eule als Silhouette mit ausgebreiteten Flügeln, um 0,0. */
  function euleSilhouette() {
    const f = "#151830";
    return s("g", { "data-figur": "eule" },
      s("path", { d: "M-2,-2 C-14,-14 -30,-10 -36,-2 C-26,-4 -16,0 -4,4 Z", fill: f }),
      s("path", { d: "M2,-2 C14,-14 30,-10 36,-2 C26,-4 16,0 4,4 Z", fill: f }),
      s("ellipse", { cx: 0, cy: 2, rx: 6, ry: 9, fill: f }),
      s("circle", { cx: 0, cy: -8, r: 5.5, fill: f }),
      s("path", { d: "M-4.5,-11 L-3,-17 L-1,-12 Z M4.5,-11 L3,-17 L1,-12 Z", fill: f }));
  }

  // ---------- Bilder am Tag (WACHSEN, BAUEN) ----------
  const tagGrund = () => s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#d6ecf8" });
  /** Wiese unten, mit den runden Ecken des Bildes. */
  const boden = () => s("path", { d: `M0,130 Q160,120 ${BREITE},130 L${BREITE},136 Q${BREITE},${HOEHE} ${BREITE - 14},${HOEHE} L14,${HOEHE} Q0,${HOEHE} 0,136 Z`, fill: "#86c46f" });

  /** Sitzende Eule (Farben wie der Avatar „Eule“), Füsse bei 0,0; k = Grösse (1 = 100 Einheiten hoch). */
  function euleSitzend(k) {
    const innen = s("g", { transform: `scale(${k}) translate(-50 -90)` },
      s("path", { d: "M26 30 L22 12 L40 24 Z", fill: "#7a5a40" }), s("path", { d: "M74 30 L78 12 L60 24 Z", fill: "#7a5a40" }),
      s("ellipse", { cx: 50, cy: 56, rx: 30, ry: 32, fill: "#8e6b4f" }), s("ellipse", { cx: 50, cy: 66, rx: 18, ry: 16, fill: "#d8b98f" }),
      s("circle", { cx: 37, cy: 46, r: 12, fill: "#ffffff" }), s("circle", { cx: 63, cy: 46, r: 12, fill: "#ffffff" }),
      s("circle", { cx: 38, cy: 47, r: 6, fill: "#2d3047" }), s("circle", { cx: 62, cy: 47, r: 6, fill: "#2d3047" }),
      s("path", { d: "M45 56 L55 56 L50 65 Z", fill: "#f5a623" }),
      s("ellipse", { cx: 41, cy: 88, rx: 6, ry: 3, fill: "#f5a623" }), s("ellipse", { cx: 59, cy: 88, rx: 6, ry: 3, fill: "#f5a623" }));
    // äussere Gruppe für die Bewegung, innere für die Grösse (bewege setzt im ruhigen Bild transform der äusseren)
    return s("g", { "data-figur": "eule" }, innen);
  }

  /** Eine Figur nach der Hauptbewegung einen Weg entlang (Schmuck); im ruhigen Bild gleich am Ende. */
  function nachher(figur, weg, ende, ruhig, dauer = 1.2) {
    if (ruhig) { figur.setAttribute("transform", `translate(${ende.x} ${ende.y})`); return figur; }
    figur.setAttribute("opacity", "0");
    figur.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(DAUER), fill: "freeze" }));
    figur.appendChild(s("animateMotion", { path: weg, begin: t(DAUER), dur: `${dauer}s`, fill: "freeze" }));
    return figur;
  }

  /** Schmetterling (Schmuck ab 2 Sternen) flattert heran. */
  function schmetterling(x, y, ruhig) {
    const fluegel = s("g", {},
      s("ellipse", { cx: -4, cy: -2, rx: 4, ry: 5, fill: "#f0a030" }), s("ellipse", { cx: 4, cy: -2, rx: 4, ry: 5, fill: "#f0a030" }),
      s("ellipse", { cx: -3, cy: 4, rx: 3, ry: 3, fill: "#e0569a" }), s("ellipse", { cx: 3, cy: 4, rx: 3, ry: 3, fill: "#e0569a" }),
      s("rect", { x: -0.8, y: -5, width: 1.6, height: 11, rx: 0.8, fill: "#2d3047" }));
    if (!ruhig) fluegel.appendChild(s("animateTransform", { attributeName: "transform", type: "scale", values: "1 1;0.4 1;1 1", dur: "0.3s", repeatCount: 6, begin: t(DAUER) }));
    return nachher(s("g", { "data-schmuck": "2" }, fluegel), `M${BREITE + 10},20 C${x + 60},0 ${x + 30},${y + 30} ${x},${y}`, { x, y }, ruhig);
  }

  /** Vogel auf der Wiese, zwei Noten steigen auf (Schmuck bei 3 Sternen). */
  function vogelSingt(x, y, ruhig) {
    const g = s("g", { "data-schmuck": "3" },
      s("ellipse", { cx: x, cy: y - 6, rx: 7, ry: 5, fill: "#3f7fc8" }), s("circle", { cx: x + 6, cy: y - 11, r: 3.6, fill: "#3f7fc8" }),
      s("path", { d: `M${x + 9},${y - 12} l4,1 l-4,1 Z`, fill: "#f5a623" }), s("circle", { cx: x + 7, cy: y - 12, r: 0.8, fill: "#ffffff" }),
      s("path", { d: `M${x - 7},${y - 7} l-5,-3 l1,5 Z`, fill: "#2f62a0" }),
      s("path", { d: `M${x - 1},${y - 1} l0,2 M${x + 2},${y - 1} l0,2`, stroke: "#6b4a2b", "stroke-width": 1 }));
    // Noten als Zeichen (kein Text): Kopf und Hals
    [[x + 14, y - 22, 0], [x + 24, y - 30, 0.35]].forEach(([nx, ny, spaet]) => {
      const note = s("g", { fill: "#2d3047" }, s("ellipse", { cx: nx, cy: ny, rx: 2.6, ry: 2, transform: `rotate(-20 ${nx} ${ny})` }),
        s("rect", { x: nx + 1.8, y: ny - 9, width: 1, height: 9 }));
      if (!ruhig) {
        note.setAttribute("opacity", "0");
        note.appendChild(s("animate", { attributeName: "opacity", values: "0;1;1", begin: t(DAUER + 0.2 + spaet), dur: "0.8s", fill: "freeze" }));
        note.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "0 8", to: "0 0", begin: t(DAUER + 0.2 + spaet), dur: "0.8s", fill: "freeze" }));
      }
      g.appendChild(note);
    });
    return erscheine(g, DAUER, ruhig);
  }

  /** Leeres Wortkärtchen (ein Wort, nur angedeutet: zwei graue Striche statt Text). */
  function kaertchen(x, y, b = 22) {
    return s("g", { "data-kaertchen": "" },
      s("rect", { x: x - b / 2, y: y - 6, width: b, height: 12, rx: 3, fill: "#fbf3dc", stroke: "#b89a6a", "stroke-width": 0.6 }),
      s("path", { d: `M${x - b / 2 + 4},${y - 1.5} h${b - 8} M${x - b / 2 + 4},${y + 2} h${(b - 8) * 0.6}`, stroke: "#a8a092", "stroke-width": 1.2, "stroke-linecap": "round" }));
  }

  // Baum des Wortfamilien-Baums: Teile in der Reihenfolge, in der sie wachsen
  const BAUM_TEILE = ["stamm", "ast", "aeste", "blaetter", "blueten", "fruechte"];
  const ASTE = [[160, 100, 114, 78], [160, 90, 206, 66], [160, 74, 150, 42]];
  const LAUB = [[114, 74, 16], [96, 86, 12], [134, 66, 13], [206, 62, 16], [224, 76, 12], [188, 56, 13], [150, 38, 16], [130, 46, 12],
    [172, 42, 13], [180, 80, 12], [138, 88, 11]];
  const BLUETEN = [[98, 72], [128, 56], [222, 62], [194, 46], [166, 32], [138, 32], [230, 84], [104, 94]];

  /** Ein Teil des Baums wachsen lassen: ab = Beginn, dauer = Zeit für diesen Teil; ebenen = { laub, holz, vorn }. */
  const BAUM = {
    stamm(ebenen, ab, dauer, ruhig) {
      const stamm = s("rect", { x: 154, y: 70, width: 12, height: 62, rx: 2, fill: "#8b5a2b" });
      if (!ruhig) {
        stamm.setAttribute("y", "132"); stamm.setAttribute("height", "0");
        stamm.appendChild(s("animate", { attributeName: "y", from: 132, to: 70, begin: t(ab), dur: `${dauer}s`, fill: "freeze" }));
        stamm.appendChild(s("animate", { attributeName: "height", from: 0, to: 62, begin: t(ab), dur: `${dauer}s`, fill: "freeze" }));
      }
      // am Holz das Familienwort (wie im Spiel), nur angedeutet
      ebenen.holz.append(stamm, erscheine(kaertchen(160, 112, 26), ab + dauer * 0.8, ruhig));
    },
    ast(ebenen, ab, dauer, ruhig) { ast(ebenen, ASTE[0], ab, dauer, ruhig); },
    aeste(ebenen, ab, dauer, ruhig) { ast(ebenen, ASTE[1], ab, dauer / 2, ruhig); ast(ebenen, ASTE[2], ab + dauer / 2, dauer / 2, ruhig); },
    blaetter(ebenen, ab, dauer, ruhig) {
      LAUB.forEach(([x, y, r], i) => {
        const blatt = s("circle", { cx: 0, cy: 0, r, fill: i % 2 ? "#4f9d47" : "#64b25a" });
        const innen = s("g", {}, blatt);
        if (!ruhig) innen.appendChild(s("animateTransform", { attributeName: "transform", type: "scale", from: 0, to: 1,
          begin: t(ab + (i / LAUB.length) * dauer * 0.7), dur: `${dauer * 0.4}s`, fill: "freeze" }));
        if (!ruhig) innen.setAttribute("transform", "scale(0)");
        ebenen.laub.appendChild(s("g", { transform: `translate(${x} ${y})` }, innen));
      });
    },
    blueten(ebenen, ab, dauer, ruhig) {
      const g = s("g", { "data-teil": "blueten" });
      BLUETEN.forEach(([x, y], i) => {
        const bl = s("g", {});
        for (let k = 0; k < 5; k++) {
          const w = (k / 5) * 2 * Math.PI;
          bl.appendChild(s("circle", { cx: x + Math.cos(w) * 3, cy: y + Math.sin(w) * 3, r: 2.4, fill: "#fbe1ec" }));
        }
        bl.appendChild(s("circle", { cx: x, cy: y, r: 1.6, fill: "#f5b301" }));
        g.appendChild(erscheine(bl, ab + (i / BLUETEN.length) * dauer, ruhig, 0.25));
      });
      ebenen.vorn.appendChild(g);
      ebenen.blueten = g;
    },
    fruechte(ebenen, ab, dauer, ruhig) {
      // aus den Blüten werden Früchte: die Blüten vergehen, an ihrer Stelle reifen Äpfel
      if (ebenen.blueten) {
        if (ruhig) ebenen.blueten.setAttribute("opacity", "0");
        else ebenen.blueten.appendChild(s("animate", { attributeName: "opacity", from: 1, to: 0, begin: t(ab), dur: "0.4s", fill: "freeze" }));
      }
      BLUETEN.forEach(([x, y], i) => {
        const apfel = s("g", { "data-frucht": "" }, s("circle", { cx: x, cy: y + 2, r: 4, fill: "#d8433a" }),
          s("path", { d: `M${x},${y - 2} q2,-3 4,-2`, stroke: "#3f7a2c", "stroke-width": 1.2, fill: "none" }));
        ebenen.vorn.appendChild(erscheine(apfel, ab + 0.2 + (i / BLUETEN.length) * dauer * 0.5, ruhig, 0.25));
      });
      // die Eule fliegt in die Krone und setzt sich auf den rechten Ast
      ebenen.vorn.appendChild(bewege(euleSitzend(0.3), "M330,10 C280,0 230,30 186,74", { x: 186, y: 74, winkel: 0 }, ruhig,
        { drehen: false, ab, dauer: Math.max(dauer, 0.8) }));
    },
  };
  function ast(ebenen, [x1, y1, x2, y2], ab, dauer, ruhig) {
    const laenge = Math.hypot(x2 - x1, y2 - y1);
    const linie = s("line", { x1, y1, x2, y2, stroke: "#8b5a2b", "stroke-width": 6, "stroke-linecap": "round" });
    if (!ruhig) {
      linie.setAttribute("stroke-dasharray", `${laenge} ${laenge}`);
      linie.setAttribute("stroke-dashoffset", String(laenge));
      linie.appendChild(s("animate", { attributeName: "stroke-dashoffset", from: laenge, to: 0, begin: t(ab), dur: `${dauer}s`, fill: "freeze" }));
    }
    ebenen.holz.append(linie, erscheine(kaertchen(x2, y2), ab + dauer * 0.85, ruhig));
  }

  /** Stein fällt von oben an seinen Platz (BAUEN). */
  function falle(stein, ab, ruhig) {
    if (ruhig) return stein;
    stein.setAttribute("opacity", "0");
    stein.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(ab), fill: "freeze" }));
    stein.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "0 -40", to: "0 0", begin: t(ab), dur: "0.35s",
      fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.5 0 1 1" }));
    return stein;
  }
  /** Ganze Zahl in der Schreibweise des Lehrmittels (LS.zahlText: ab fünf Stellen mit schmalem Leerzeichen). */
  const ganzText = x => (typeof LS !== "undefined" && LS.zahlText ? LS.zahlText(x) : String(x));
  /** Nachkommastellen einer Zahl, wie sie geschrieben ist (3.75 → 2). */
  const nachkomma = x => ((String(x).split(".")[1] || "").length);
  /** Zahl mit ihren Nachkommastellen in der Schreibweise des Geräts (ganze Zahlen mit Tausendertrennung). */
  const zahlGeschrieben = x => (Number.isInteger(x) ? ganzText(x) : zahlText(x, nachkomma(x)));

  // ---------- Stellentafel (Block M1: Stellen-Detektiv, Tabellen-Post, Punkte-Schieber, Stufenzahl-Schieber) ----------
  // Stellenfarben wie im Spiel, aus stil.css (--st-*: Einer rot, Zehner blau, Hunderter grün, ab T wiederholt); nach dem
  // Komma neutral (--deko-7) mit der Kommalinie links der Zehntel (stil.css, „Nach dem Komma“).
  const SCHRIFT = "system-ui, sans-serif";
  const GANZE = ["M", "HT", "ZT", "T", "H", "Z", "E"];
  const WERT = { M: 1e6, HT: 1e5, ZT: 1e4, T: 1e3, H: 100, Z: 10, E: 1 };
  const EXPONENT = { M: 6, HT: 5, ZT: 4, T: 3, H: 2, Z: 1, E: 0, z: -1, h: -2, t: -3 };
  const STELLE_ZU = Object.fromEntries(Object.entries(EXPONENT).map(([k, e]) => [e, k]));
  const stellenFarbe = k => (GANZE.includes(k) ? `var(--st-${k})` : "var(--deko-7)");
  /** Ziffern einer ganzen Zahl je Stelle: 402 → { H: 4, Z: 0, E: 2 }. */
  function ziffernJeStelle(n) {
    const d = {};
    [...String(Math.round(n))].reverse().forEach((z, i) => { d[GANZE[GANZE.length - 1 - i]] = Number(z); });
    return d;
  }
  /** Die letzten anzahl ganzen Stellen bis E: 3 → ["H", "Z", "E"]. */
  const stellenBis = anzahl => GANZE.slice(GANZE.length - anzahl);
  /** Stellentafel: Kopf mit dem Kürzel in der Stellenfarbe, darunter ein Feld. */
  function stellentafel(keys, { y = 40, sb = 36, kopf = 16, feld = 34, cx = BREITE / 2 } = {}) {
    const x0 = cx - (keys.length * sb) / 2;
    const g = s("g", { "data-tafel": keys.join(" ") });
    keys.forEach((k, i) => {
      const x = x0 + i * sb;
      g.append(s("rect", { x: x + 1, y, width: sb - 2, height: kopf, rx: 3, style: `fill:${stellenFarbe(k)}` }),
        s("text", { x: x + sb / 2, y: y + kopf - 4, fill: "#ffffff", "font-size": 10, "font-weight": "bold", "font-family": SCHRIFT, "text-anchor": "middle" }, k),
        s("rect", { x: x + 1, y: y + kopf + 1, width: sb - 2, height: feld, rx: 3, fill: "#ffffff", style: `stroke:${stellenFarbe(k)}`, "stroke-width": 1.4 }));
    });
    const iz = keys.indexOf("z");
    if (iz > 0) g.appendChild(s("line", { x1: x0 + iz * sb, y1: y - 3, x2: x0 + iz * sb, y2: y + kopf + feld + 4, style: "stroke:var(--deko-1)", "stroke-width": 3 }));
    return { g, x: k => x0 + keys.indexOf(k) * sb, mitte: k => x0 + keys.indexOf(k) * sb + sb / 2, feldY: y + kopf + 1, feldH: feld, sb, unten: y + kopf + feld + 1 };
  }
  const zifferText = (x, y, z, gross = 16, farbe = "#2d3047") => s("text", { x, y, fill: farbe, "font-size": gross, "font-weight": "bold",
    "font-family": SCHRIFT, "text-anchor": "middle" }, String(z));
  /** Zeile unter dem Bild (die Zahl oder Rechnung der Stufe). */
  const zeileUnten = (text, y = 138) => s("text", { x: BREITE / 2, y, fill: "#2d3047", "font-size": 13, "font-weight": "bold", "font-family": SCHRIFT,
    "text-anchor": "middle", "data-zeile": "unten" }, text);
  /** Teil von oben in seinen Platz fallen lassen (dy über dem Ziel). */
  function vonOben(e, ab, ruhig, dy = 60, dauer = 0.4) {
    if (ruhig) return e;
    e.setAttribute("opacity", "0");
    e.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(ab), fill: "freeze" }));
    e.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: `0 ${-dy}`, to: "0 0", begin: t(ab), dur: `${dauer}s`,
      fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.5 0 1 1" }));
    return e;
  }
  /** Ausblenden ab Zeitpunkt (im ruhigen Bild gleich weg). */
  function verschwinde(e, ab, ruhig, dauer = 0.3) {
    if (ruhig) { e.setAttribute("opacity", "0"); return e; }
    e.appendChild(s("animate", { attributeName: "opacity", from: 1, to: 0, begin: t(ab), dur: `${dauer}s`, fill: "freeze" }));
    return e;
  }

  function lupe() {
    return s("g", { "data-figur": "lupe" }, s("circle", { cx: 0, cy: 0, r: 14, fill: "#ffffff", opacity: 0.3 }),
      s("circle", { cx: 0, cy: 0, r: 14, fill: "none", stroke: "#2d3047", "stroke-width": 3 }),
      s("line", { x1: 10, y1: 10, x2: 21, y2: 21, stroke: "#7a4f26", "stroke-width": 5, "stroke-linecap": "round" }));
  }
  function marienkaefer() {
    return s("g", { "data-figur": "marienkaefer" },
      s("ellipse", { cx: 0, cy: 0, rx: 7, ry: 5.5, fill: "#d8433a", stroke: "#2d3047", "stroke-width": 0.8 }),
      s("line", { x1: 0, y1: -5.5, x2: 0, y2: 5.5, stroke: "#2d3047", "stroke-width": 0.8 }),
      s("circle", { cx: -3, cy: -1.5, r: 1.2, fill: "#2d3047" }), s("circle", { cx: 3, cy: 1.5, r: 1.2, fill: "#2d3047" }),
      s("circle", { cx: 2.6, cy: -2.4, r: 1, fill: "#2d3047" }), s("circle", { cx: 0, cy: -7, r: 2.6, fill: "#2d3047" }));
  }
  /** Funkelnder Glanz (Schmuck ab 2 Sternen) an x, y. */
  function glanz(x, y, ruhig) {
    return erscheine(s("path", { d: `M${x},${y - 7} L${x + 2},${y - 2} L${x + 7},${y} L${x + 2},${y + 2} L${x},${y + 7} L${x - 2},${y + 2} L${x - 7},${y} L${x - 2},${y - 2} Z`,
      fill: "#fff6c8", stroke: "#e9b300", "stroke-width": 0.8, "data-schmuck": "2" }), DAUER, ruhig);
  }

  // Dienes-Bausteine (Zahlen-Baukasten): E Würfelchen, Z Stange, H Platte, T Würfel; ZT, HT, M dieselben Formen aus
  // Tausenderwürfeln (Stange, Platte, grosser Würfel) — wie im Baukasten, die Farben wiederholen sich ab T.
  function baustein(k, x, y) {
    const f = stellenFarbe(k), linie = { stroke: "#ffffff", "stroke-width": 0.5, "stroke-opacity": 0.8 };
    const g = s("g", { "data-baustein": k });
    // Würfel mit Vorderseite w × h und schräger Tiefe (Deckel und Seite heller)
    const wuerfel = (bx, by, w, h, tiefe) => g.append(
      s("path", { d: `M${bx},${by - h} l${tiefe},${-tiefe} l${w},0 l${-tiefe},${tiefe} Z`, style: `fill:${f}`, "fill-opacity": 0.6 }),
      s("path", { d: `M${bx + w},${by} l${tiefe},${-tiefe} l0,${-h} l${-tiefe},${tiefe} Z`, style: `fill:${f}`, "fill-opacity": 0.8 }),
      s("rect", { x: bx, y: by - h, width: w, height: h, style: `fill:${f}` }));
    const teile = (n, l) => Array.from({ length: n - 1 }, (_, i) => ((i + 1) * l) / n);
    if (k === "E") g.appendChild(s("rect", { x, y: y - 7, width: 7, height: 7, style: `fill:${f}` }));
    else if (k === "Z") { g.appendChild(s("rect", { x, y: y - 28, width: 7, height: 28, style: `fill:${f}` })); for (const v of teile(10, 28)) g.appendChild(s("path", { d: `M${x},${y - v} h7`, ...linie })); }
    else if (k === "H") { g.appendChild(s("rect", { x, y: y - 28, width: 28, height: 28, style: `fill:${f}` })); for (const v of teile(10, 28)) g.appendChild(s("path", { d: `M${x + v},${y - 28} v28 M${x},${y - v} h28`, ...linie })); }
    else if (k === "T") wuerfel(x, y, 20, 20, 7);
    else if (k === "ZT") { wuerfel(x, y, 20, 44, 7); for (const v of teile(10, 44)) g.appendChild(s("path", { d: `M${x},${y - v} h20`, ...linie })); }
    else if (k === "HT") { wuerfel(x, y, 44, 44, 7); for (const v of teile(10, 44)) g.appendChild(s("path", { d: `M${x + v},${y - 44} v44 M${x},${y - v} h44`, ...linie })); }
    else if (k === "M") { wuerfel(x, y, 44, 44, 18); for (const v of teile(10, 44)) g.appendChild(s("path", { d: `M${x + v},${y - 44} v44 M${x},${y - v} h44`, ...linie })); }
    return g;
  }
  const BAUSTEIN_BREITE = { E: 7, Z: 7, H: 28, T: 27, ZT: 27, HT: 51, M: 62 };

  const KARTENFARBEN_DEKO = ["var(--deko-1)", "var(--deko-2)", "var(--deko-3)", "var(--deko-5)", "var(--deko-6)", "var(--deko-4)", "var(--deko-7)"];

  function frosch() {
    return s("g", { "data-figur": "frosch" },
      s("ellipse", { cx: 0, cy: -5, rx: 9, ry: 6, fill: "#4f9d47" }), s("ellipse", { cx: 0, cy: -3, rx: 5.5, ry: 3.5, fill: "#b8e08a" }),
      s("circle", { cx: -4, cy: -11, r: 3, fill: "#4f9d47" }), s("circle", { cx: 4, cy: -11, r: 3, fill: "#4f9d47" }),
      s("circle", { cx: -4, cy: -11.5, r: 1.3, fill: "#2d3047" }), s("circle", { cx: 4, cy: -11.5, r: 1.3, fill: "#2d3047" }));
  }
  function libelle(x, y, ruhig) {
    return erscheine(s("g", { "data-schmuck": "2" },
      s("ellipse", { cx: x - 5, cy: y - 3, rx: 6, ry: 2, fill: "#cfe9f8", opacity: 0.9 }), s("ellipse", { cx: x + 5, cy: y - 3, rx: 6, ry: 2, fill: "#cfe9f8", opacity: 0.9 }),
      s("rect", { x: x - 1, y: y - 6, width: 2, height: 14, rx: 1, fill: "#2f62a0" })), DAUER, ruhig);
  }
  /** Kugel der Runden-Rutsche (Farbe der Kugel im Spiel), unten auf 0,0. */
  function kugel() {
    return s("g", { "data-figur": "kugel" },
      s("circle", { cx: 0, cy: -8, r: 8, style: "fill:var(--knopf)" }), s("circle", { cx: -2.6, cy: -10.6, r: 2.2, fill: "#ffffff", opacity: 0.7 }));
  }
  function wagen() {
    return s("g", { "data-figur": "wagen" },
      s("rect", { x: -9, y: -12, width: 18, height: 8, rx: 2, style: "fill:var(--deko-3)" }),
      s("circle", { cx: -5, cy: -3, r: 3, fill: "#2d3047" }), s("circle", { cx: 5, cy: -3, r: 3, fill: "#2d3047" }));
  }

  /** Ziffern einer Zahl nach Exponent (0.25 → { 0: 0, -1: 2, -2: 5 }); ganz mit E, gebrochen bis zur letzten Ziffer. */
  function ziffernNachExponent(x) {
    const [ganz, bruch = ""] = String(Number(x.toFixed(6))).split(".");
    const d = {};
    [...ganz].reverse().forEach((z, i) => { d[i] = Number(z); });
    [...bruch].forEach((z, i) => { d[-(i + 1)] = Number(z); });
    return d;
  }

  // ---------- AUFTRITT: Instrumente in der Hand einer Eule ----------
  // Koordinaten um die Füsse der Eule (0,0), Eule Grösse 0.42: Kopf bis etwa −38, Schnabel bei −12, Bauch um −15.
  // Die Eule schaut uns an: ihre linke Seite ist im Bild rechts (Konzept: Geige an der linken Schulter, Bogen in der
  // rechten Hand; Querflöte zeigt nach rechts der Spielerin, im Bild also nach links).
  const HOLZ = "#9a5b2a", HOLZ_DUNKEL = "#5e3417", MESSING = "#e3b341", SILBER = "#c9ccd3";
  const INSTRUMENTE = {
    trommel: () => s("g", { "data-instrument": "trommel" },
      s("rect", { x: -12, y: -14, width: 24, height: 12, fill: "#d8433a", stroke: "#7a2620", "stroke-width": 1 }),
      s("ellipse", { cx: 0, cy: -14, rx: 12, ry: 3.4, fill: "#f4ecd8", stroke: "#7a2620", "stroke-width": 1 }),
      s("path", { d: "M-12,-12 l6,8 l6,-8 l6,8 l6,-8", stroke: "#f4ecd8", "stroke-width": 0.8, fill: "none" }),
      s("line", { x1: -14, y1: -26, x2: -4, y2: -16, stroke: HOLZ_DUNKEL, "stroke-width": 1.6, "stroke-linecap": "round" }),
      s("line", { x1: 14, y1: -26, x2: 4, y2: -16, stroke: HOLZ_DUNKEL, "stroke-width": 1.6, "stroke-linecap": "round" })),
    // quer vor dem Schnabel, das Mundloch an der Unterlippe, das Rohr zur rechten Seite der Spielerin (im Bild links)
    floete: () => s("g", { "data-instrument": "querfloete" },
      s("line", { x1: 4, y1: -11, x2: -21, y2: -14, stroke: SILBER, "stroke-width": 2.2, "stroke-linecap": "round" }),
      s("path", { d: "M-6,-12.8 l0,0.01 M-11,-13.4 l0,0.01 M-16,-14 l0,0.01", stroke: "#6b7089", "stroke-width": 1.6, "stroke-linecap": "round" })),
    // auf der linken Schulter (im Bild rechts), unter dem Kinn; der Bogen in der rechten Hand (im Bild links)
    geige: () => s("g", { "data-instrument": "geige" },
      s("g", { transform: "rotate(-28 8 -14)" },
        s("ellipse", { cx: 6, cy: -14, rx: 5, ry: 3.4, fill: HOLZ }), s("ellipse", { cx: 12, cy: -14, rx: 4, ry: 2.8, fill: HOLZ }),
        s("rect", { x: 15, y: -14.8, width: 9, height: 1.6, fill: HOLZ_DUNKEL })),
      s("line", { x1: -14, y1: -6, x2: 14, y2: -22, stroke: "#d9c9a3", "stroke-width": 1.1, "stroke-linecap": "round" })),
    // nach vorn aus dem Mund, mit Ventilen; der Schalltrichter vorne (im Bild nach rechts gedreht)
    trompete: () => s("g", { "data-instrument": "trompete" },
      s("line", { x1: 2, y1: -12, x2: 16, y2: -12, stroke: MESSING, "stroke-width": 2, "stroke-linecap": "round" }),
      s("path", { d: "M16,-12 L21,-15.5 L21,-8.5 Z", fill: MESSING }),
      s("path", { d: "M8,-12 v-3 M10.5,-12 v-3 M13,-12 v-3", stroke: "#b88a1f", "stroke-width": 1.2 })),
    // steht vor der Spielerin zwischen den Knien, der Hals an ihrer linken Schulter (im Bild rechts), Bogen waagrecht
    cello: () => s("g", { "data-instrument": "cello" },
      s("line", { x1: 0, y1: 0, x2: 0, y2: 3, stroke: "#6b7089", "stroke-width": 1 }),
      s("ellipse", { cx: 0, cy: -8, rx: 7.5, ry: 9, fill: HOLZ }), s("ellipse", { cx: 0.5, cy: -19, rx: 6, ry: 6.5, fill: HOLZ }),
      s("line", { x1: 1, y1: -24, x2: 7, y2: -40, stroke: HOLZ_DUNKEL, "stroke-width": 1.8, "stroke-linecap": "round" }),
      s("line", { x1: -18, y1: -11, x2: 10, y2: -11, stroke: "#d9c9a3", "stroke-width": 1.1, "stroke-linecap": "round" })),
  };
  const BESETZUNG = ["trommel", "floete", "geige", "trompete", "cello"];
  const NOTEN = [262, 330, 392, 523, 659]; // c' e' g' c'' e'' — je Auftritt ein Ton des C-Dur-Dreiklangs

  /** Eine Musikerin: Eule mit Instrument an x, y (Füsse). */
  function musikerin(instrument, x, y, k) {
    const g = s("g", { transform: `translate(${x} ${y}) scale(${k / 0.42})`, "data-stueck": instrument });
    g.append(euleSitzend(0.42), INSTRUMENTE[instrument]());
    return g;
  }

  // ---------- SAMMELN: Angel ----------
  const FISCHFARBEN = ["#f07c2a", "#14b8a6", "#8e5bd6", "#e9b300", "#e0569a", "#6366f1"];
  function fisch(farbe) {
    return s("g", {},
      s("ellipse", { cx: 0, cy: 0, rx: 8, ry: 4.4, fill: farbe }), s("path", { d: "M-7,0 L-13,-4.5 L-13,4.5 Z", fill: farbe }),
      s("circle", { cx: 4.4, cy: -1, r: 1, fill: "#2d3047" }));
  }

  // ---------- KARTE ----------
  /** Punkte eines SVG-Pfads (nur M/L mit absoluten Zahlen, wie karte.js sie schreibt). */
  function pfadPunkte(d) {
    const z = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number), p = [];
    for (let i = 0; i + 1 < z.length; i += 2) p.push([z[i], z[i + 1]]);
    return p;
  }
  function mitte(punkte) {
    const n = punkte.length || 1;
    return [punkte.reduce((a, q) => a + q[0], 0) / n, punkte.reduce((a, q) => a + q[1], 0) / n];
  }
  const KARTENFARBEN = ["#8e5bd6", "#e0569a", "#f07c2a", "#e9b300", "#14b8a6", "#6366f1"];

  // ---------- Muster ----------
  // ---------- Bilder je Spiel (Block M1, AR1 a): je Muster ein Satz, gewählt mit feier.bilder ----------
  // Jedes Bild folgt den Stufen seines Spiels (Zahlenraum, Stellen, Schritte), nicht nur der Idee im Konzept.
  const neuesBild = (muster, ziel, extra = {}) => s("svg", { viewBox: `0 0 ${BREITE} ${HOEHE}`, "data-muster": muster, "data-ziel": String(ziel), ...extra });

  const BILDER = {
    reise: {
      /** Stellen-Detektiv: die Lupe wandert von E nach links über die Zahl der Stufe; unter ihr leuchten die Ziffern auf. */
      stellen(feier, { stufe, sterne, ruhig }) {
        const n = feier.ziele?.[stufe];
        if (!Number.isInteger(n) || n < 1 || n >= 1e7) return null;
        const d = ziffernJeStelle(n), keys = stellenBis(String(n).length);
        const svg = neuesBild("reise", n, { "data-bilder": "stellen" });
        svg.appendChild(tagGrund());
        const tf = stellentafel(keys, { y: 34, sb: Math.min(40, 280 / keys.length) });
        svg.appendChild(tf.g);
        const je = (DAUER * 0.9) / keys.length, cy = tf.feldY + tf.feldH / 2;
        [...keys].reverse().forEach((k, i) => {
          svg.appendChild(erscheine(s("rect", { x: tf.x(k) + 2, y: tf.feldY + 1, width: tf.sb - 4, height: tf.feldH - 2, rx: 3, style: `fill:${stellenFarbe(k)}`, opacity: 0.18 }), i * je, ruhig, 0.25));
          svg.appendChild(erscheine(zifferText(tf.mitte(k), cy + 6, d[k], 18), i * je, ruhig, 0.25));
        });
        svg.appendChild(erscheine(zeileUnten(ganzText(n), 120), DAUER, ruhig));
        const lx = tf.mitte(keys[0]);
        svg.appendChild(bewege(lupe(), `M${tf.mitte("E") + 40},${cy} L${lx},${cy}`, { x: lx, y: cy, winkel: 0 }, ruhig, { drehen: false }));
        if (sterne >= 2) svg.appendChild(glanz(lx - 6, cy - 8, ruhig));
        if (sterne >= 3) svg.appendChild(funken(Math.max(lx, 24), 22, ruhig));
        return svg;
      },

      /** Zahlen-Hüpfer: der Frosch hüpft in den Schritten der Stufe über Seerosen; jede trägt ihre Zahl. */
      seerosen(feier, { stufe, sterne, ruhig }) {
        const z = feier.ziele?.[stufe];
        if (!z || !Number.isInteger(z.start) || !Number.isInteger(z.schritt)) return null;
        const anzahl = z.anzahl || 4, zahlen = Array.from({ length: anzahl + 1 }, (_, i) => z.start + i * z.schritt);
        const svg = neuesBild("reise", stufe, { "data-bilder": "seerosen", "data-anzahl": zahlen.length });
        svg.append(tagGrund(), s("path", { d: `M0,70 L${BREITE},70 L${BREITE},136 Q${BREITE},${HOEHE} ${BREITE - 14},${HOEHE} L14,${HOEHE} Q0,${HOEHE} 0,136 Z`, fill: "#5aa9dc" }));
        const ab = (BREITE - 60) / anzahl, y = 104, xs = zahlen.map((_, i) => 30 + i * ab);
        zahlen.forEach((n, i) => svg.appendChild(s("g", { "data-stueck": "seerose", "data-wert": n },
          s("ellipse", { cx: xs[i], cy: y, rx: 25, ry: 8, fill: "#4f9d47" }), s("path", { d: `M${xs[i]},${y} l18,-5 l0,6 Z`, fill: "#5aa9dc" }),
          s("text", { x: xs[i], y: y + 22, fill: "#ffffff", "font-size": 10, "font-weight": "bold", "font-family": SCHRIFT, "text-anchor": "middle" }, ganzText(n)))));
        const weg = "M" + xs[0] + "," + y + xs.slice(1).map((x, i) => ` Q${(xs[i] + x) / 2},${y - 46} ${x},${y}`).join("");
        svg.appendChild(bewege(frosch(), weg, { x: xs[anzahl], y, winkel: 0 }, ruhig, { drehen: false }));
        if (sterne >= 2) svg.appendChild(libelle(xs[anzahl] - 30, 40, ruhig));
        if (sterne >= 3) svg.appendChild(funken(Math.min(xs[anzahl], BREITE - 24), 72, ruhig));
        return svg;
      },

      /**
       * Dezimal-Rutsche: zwischen den beiden Nachbarn der Stufe steht ein Hügel, sein Gipfel ist die Mitte (x.5). Der Wagen
       * steht an der Zahl und rollt auf die Seite, auf die sie gerundet wird; genau auf dem Gipfel rollt er nach oben weiter.
       */
      rutsche(feier, { stufe, sterne, ruhig }) {
        const z = feier.ziele?.[stufe];
        // ganze Zahlen (Runden-Rutsche, Block M2): auf: der Zehner, Hunderter … auf den gerundet wird
        const ganz = Number.isInteger(z?.auf) && z.auf > 0;
        if (!z || !Array.isArray(z.werte) || !z.werte.length || !(ganz || Number.isInteger(z.stellen))) return null;
        if (ganz && z.werte.some(w => !Number.isInteger(w) || w % z.auf === 0)) return null;
        const schritt = ganz ? z.auf : 10 ** -z.stellen, rund = v => (ganz ? Math.round(v) : Number(v.toFixed(z.stellen + 4)));
        const faelle = z.werte.map(w => {
          // ganz: w / schritt ist genau (6 500 000 / 1 000 000 = 6.5 darf nicht vorher auf 7 gerundet werden)
          const a = rund(Math.floor(ganz ? w / schritt : rund(w / schritt)) * schritt), b = rund(a + schritt), mitte = rund(a + schritt / 2);
          return { w, a, b, ziel: w >= mitte ? b : a };
        });
        const lo = Math.min(...faelle.map(f => f.a)), hi = Math.max(...faelle.map(f => f.b));
        const x = v => 30 + ((v - lo) / (hi - lo)) * (BREITE - 60), grundY = 108, gipfel = 52;
        const svg = neuesBild("reise", stufe, { "data-bilder": "rutsche" });
        svg.append(tagGrund(), boden());
        const taeler = [...new Set(faelle.flatMap(f => [f.a, f.b]))].sort((p, q) => p - q);
        let bahn = `M${x(taeler[0])},${grundY}`;
        for (let i = 1; i < taeler.length; i++) bahn += ` L${(x(taeler[i - 1]) + x(taeler[i])) / 2},${gipfel} L${x(taeler[i])},${grundY}`;
        svg.appendChild(s("path", { d: bahn, fill: "none", stroke: "#8a5a32", "stroke-width": 4, "stroke-linejoin": "round" }));
        const text = (v, st) => (ganz ? ganzText(v) : zahlText(v, st)) + (z.einheit ? ` ${z.einheit}` : "");
        for (const v of taeler) svg.appendChild(s("text", { x: x(v), y: grundY + 16, fill: "#2d3047", "font-size": 11, "font-family": SCHRIFT, "text-anchor": "middle" }, text(v, z.stellen)));
        const hoehe = v => { // auf dem Hang zwischen Tal und Gipfel
          const f = faelle.find(q => v >= q.a && v <= q.b);
          const xa = x(f.a), xb = x(f.b), xm = (xa + xb) / 2, xv = x(v);
          return grundY - (grundY - gipfel) * (1 - Math.abs(xv - xm) / ((xb - xa) / 2));
        };
        // landen zwei Wagen im selben Tal (s6: 4.45 und 4.54 ≈ 4.5), bleibt jeder auf seiner Seite stehen
        const imTal = v => faelle.filter(q => q.ziel === v).length;
        const gezeigt = new Set();
        faelle.forEach((f, i) => {
          const sx = x(f.w), sy = hoehe(f.w), ex = x(f.ziel) + (imTal(f.ziel) > 1 ? (f.w < f.ziel ? -11 : 11) : 0);
          svg.appendChild(s("g", {}, s("line", { x1: sx, y1: sy - 18, x2: sx, y2: sy - 4, stroke: "#6b7089", "stroke-width": 1, "stroke-dasharray": "2 2" }),
            s("text", { x: sx, y: sy - 22, fill: "#2d3047", "font-size": 10, "font-family": SCHRIFT, "text-anchor": "middle" }, text(f.w, z.wertStellen ?? nachkomma(f.w)))));
          const wg = feier.figur === "kugel" ? kugel() : wagen();
          wg.setAttribute("data-stueck", "wagen");
          svg.appendChild(bewege(wg, `M${sx},${sy} L${ex},${grundY}`, { x: ex, y: grundY, winkel: 0 }, ruhig, { drehen: false, ab: i * 0.3, dauer: DAUER - i * 0.3 }));
          if (gezeigt.has(f.ziel)) return;
          gezeigt.add(f.ziel);
          svg.appendChild(erscheine(s("text", { x: x(f.ziel), y: grundY + 32, fill: "#2d3047", "font-size": 13, "font-weight": "bold", "font-family": SCHRIFT, "text-anchor": "middle" },
            "≈ " + text(f.ziel, z.stellen)), DAUER, ruhig));
        });
        const letzt = x(faelle[faelle.length - 1].ziel);
        if (sterne >= 2) svg.appendChild(fahne(Math.min(letzt + 12, BREITE - 16), grundY - 4, ruhig));
        if (sterne >= 3) svg.appendChild(funken(Math.min(Math.max(letzt, 24), BREITE - 24), 30, ruhig));
        return svg;
      },

      /**
       * Stufenzahl-Schieber: die Ziffern rutschen in der Stellentafel um so viele Stellen, wie die Rechnung verlangt; das
       * Komma bleibt stehen. Führende Nullen gehen, neue Nullen kommen dazu; darunter die Rechnung.
       */
      komma(feier, { stufe, sterne, ruhig }) {
        const z = feier.ziele?.[stufe];
        if (!z || typeof z.von !== "number" || typeof z.faktor !== "number") return null;
        const k = Math.round(Math.log10(z.faktor)) * (z.durch ? -1 : 1);
        const ergebnis = Number((z.von * 10 ** k).toFixed(6));
        const vor = ziffernNachExponent(z.von), nach = ziffernNachExponent(ergebnis);
        // tragende Ziffern: von der ersten Nicht-Null bis zur letzten Ziffer
        const exp = d => Object.keys(d).map(Number);
        const tragend = Object.entries(vor).map(([e, v]) => [Number(e), v]).filter(([e]) => e <= Math.max(...exp(vor).filter(q => vor[q] !== 0)));
        const alle = [...exp(vor), ...exp(nach), 0, -1];
        const keys = [];
        for (let e = Math.max(...alle); e >= Math.min(...alle); e--) keys.push(STELLE_ZU[e]);
        const svg = neuesBild("reise", stufe, { "data-bilder": "komma", "data-wert": String(ergebnis) });
        svg.appendChild(tagGrund());
        const tf = stellentafel(keys, { y: 30, sb: Math.min(38, 280 / keys.length) });
        svg.appendChild(tf.g);
        const cy = tf.feldY + tf.feldH / 2 + 6, xe = e => tf.mitte(STELLE_ZU[e]);
        // Startziffern; die nicht tragenden (führende Null) gehen beim Schieben
        for (const [e, v] of Object.entries(vor).map(([q, w]) => [Number(q), w])) {
          const zt = zifferText(xe(e), cy, v, 17);
          if (!tragend.some(([q]) => q === e)) { svg.appendChild(verschwinde(zt, 0.4, ruhig)); continue; }
          if (ruhig) zt.setAttribute("transform", `translate(${xe(e + k) - xe(e)} 0)`);
          else zt.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "0 0", to: `${xe(e + k) - xe(e)} 0`,
            begin: t(0.5), dur: `${DAUER * 0.6}s`, fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }));
          zt.setAttribute("data-ziffer", String(e + k));
          // eine Null, die hinter das Komma rutscht und im Ergebnis nicht steht, geht (7200 : 10 = 720)
          if (!(e + k in nach)) verschwinde(zt, DAUER * 0.9, ruhig);
          svg.appendChild(zt);
        }
        // neue Nullen des Ergebnisses
        const belegt = new Set(tragend.map(([e]) => e + k));
        for (const [e, v] of Object.entries(nach).map(([q, w]) => [Number(q), w])) if (!belegt.has(e)) svg.appendChild(erscheine(zifferText(xe(e), cy, v, 17), DAUER * 0.9, ruhig));
        svg.appendChild(erscheine(zeileUnten(`${zahlGeschrieben(z.von)} ${z.durch ? ":" : "·"} ${zahlGeschrieben(z.faktor)} = ${zahlGeschrieben(ergebnis)}`, 118), DAUER, ruhig));
        if (sterne >= 2) svg.appendChild(glanz(tf.mitte("E") + tf.sb / 2, tf.feldY - 6, ruhig));
        if (sterne >= 3) svg.appendChild(funken(BREITE - 28, 22, ruhig));
        return svg;
      },
    },

    sammeln: {
      /**
       * Tabellen-Post: Briefe mit den Ziffern fallen in die Fächer ihrer Stelle; leere Fächer bekommen die Null. Steht
       * mehr als 9 in einem Fach (Stufe 6), wandert ein Zehnerbündel als Brief in das Fach links davon.
       */
      post(feier, { stufe, sterne, ruhig }) {
        const z = feier.ziele?.[stufe];
        let teile;
        if (Number.isInteger(z) && z > 0) teile = ziffernJeStelle(z);
        else if (z && typeof z === "object" && Object.keys(z).every(k => k in WERT)) teile = { ...z };
        else return null;
        const ergebnis = Object.entries(teile).reduce((a, [k, v]) => a + v * WERT[k], 0);
        const keys = stellenBis(String(ergebnis).length);
        const briefe = keys.filter(k => teile[k] > 0);
        const buendel = keys.filter(k => (teile[k] || 0) > 9);
        const svg = neuesBild("sammeln", ergebnis, { "data-bilder": "post", "data-anzahl": briefe.length + buendel.length });
        svg.appendChild(tagGrund());
        const tf = stellentafel(keys, { y: 30, sb: Math.min(40, 280 / keys.length), feld: 44 });
        svg.appendChild(tf.g);
        const brief = (k, text) => s("g", { "data-stueck": "brief" },
          s("rect", { x: tf.mitte(k) - 12, y: tf.feldY + 3, width: 24, height: 15, rx: 2, fill: "#fffdf3", style: `stroke:${stellenFarbe(k)}`, "stroke-width": 1.2 }),
          s("path", { d: `M${tf.mitte(k) - 12},${tf.feldY + 3} l12,8 l12,-8`, fill: "none", style: `stroke:${stellenFarbe(k)}`, "stroke-width": 1 }),
          s("text", { x: tf.mitte(k), y: tf.feldY + 15, fill: "#2d3047", "font-size": 9, "font-weight": "bold", "font-family": SCHRIFT, "text-anchor": "middle" }, String(text)));
        const je = (DAUER * 0.6) / Math.max(1, briefe.length);
        briefe.forEach((k, i) => svg.appendChild(vonOben(brief(k, teile[k]), i * je, ruhig, 50)));
        // Bündeln: zehn Teile sind einer der nächsten Stelle
        for (const k of buendel) {
          const links = GANZE[GANZE.indexOf(k) - 1];
          const b = brief(k, Math.floor(teile[k] / 10));
          const dx = tf.mitte(links) - tf.mitte(k);
          if (ruhig) b.setAttribute("transform", `translate(${dx} 0)`);
          else {
            b.setAttribute("opacity", "0");
            b.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(DAUER * 0.65), fill: "freeze" }));
            b.appendChild(s("animateMotion", { path: `M0,0 Q${dx / 2},-30 ${dx},0`, begin: t(DAUER * 0.65), dur: "0.5s", fill: "freeze" }));
          }
          svg.appendChild(b);
        }
        // die Ziffern der Zahl in jedem Fach (auch die Nullen)
        const d = ziffernJeStelle(ergebnis);
        for (const k of keys) svg.appendChild(erscheine(zifferText(tf.mitte(k), tf.feldY + 38, d[k], 15, d[k] === 0 ? "#6b7089" : "#2d3047"), DAUER, ruhig));
        svg.appendChild(erscheine(zeileUnten(ganzText(ergebnis), 126), DAUER, ruhig));
        if (sterne >= 2) svg.appendChild(glanz(tf.x(keys[0]) - 4, tf.feldY - 6, ruhig));
        if (sterne >= 3) svg.appendChild(funken(BREITE - 30, 22, ruhig));
        return svg;
      },

      /** Punkte-Schieber: so viele Punkte, wie die Ziffer sagt (höchstens 9), rollen in die Spalte ihrer Stelle. */
      punkte(feier, { stufe, sterne, ruhig }) {
        const n = feier.ziele?.[stufe];
        if (!Number.isInteger(n) || n < 1 || n >= 1e7) return null;
        const d = ziffernJeStelle(n), keys = stellenBis(String(n).length);
        const summe = keys.reduce((a, k) => a + d[k], 0);
        const svg = neuesBild("sammeln", n, { "data-bilder": "punkte", "data-anzahl": summe });
        svg.appendChild(tagGrund());
        const tf = stellentafel(keys, { y: 24, sb: Math.min(40, 280 / keys.length), feld: 44 });
        svg.appendChild(tf.g);
        const je = (DAUER * 0.85) / Math.max(1, summe);
        let i = 0;
        for (const k of keys) for (let p = 0; p < d[k]; p++) {
          const cx = tf.mitte(k) + ((p % 3) - 1) * 10, cy = tf.feldY + 9 + Math.floor(p / 3) * 13;
          svg.appendChild(vonOben(s("circle", { cx, cy, r: 4.4, style: `fill:${stellenFarbe(k)}`, "data-stueck": "punkt" }), i++ * je, ruhig, 40, 0.3));
        }
        for (const k of keys) svg.appendChild(erscheine(zifferText(tf.mitte(k), tf.unten + 16, d[k], 15), DAUER, ruhig));
        svg.appendChild(erscheine(zeileUnten(ganzText(n), 132), DAUER, ruhig));
        if (sterne >= 2) svg.appendChild(glanz(tf.x(keys[0]) - 4, tf.feldY - 4, ruhig));
        if (sterne >= 3) svg.appendChild(funken(BREITE - 30, 20, ruhig));
        return svg;
      },

      /**
       * Zahlenrätsel-Tresor: das Rad dreht sich, die Tür schwingt an der Angel auf, und darin liegt je Stufe etwas
       * Wertvolleres: Münze, Münzstapel, Goldbarren, Perlenkette, Krone, grosser Diamant (s6 dazu die Eule, die
       * hineinschaut). Rückmeldung Patrik nach M1: die Tür ging nie auf (animateTransform „matrix“ gibt es nicht).
       */
      tresor(feier, { stufe, sterne, ruhig }) {
        const stufeNr = feier.ziele?.[stufe];
        if (!Number.isInteger(stufeNr) || stufeNr < 1 || stufeNr > 6) return null;
        const svg = neuesBild("sammeln", stufeNr, { "data-bilder": "tresor" });
        // Gehäuse und Innenraum (Angel links bei x = 108)
        const L = 108, O = 30, B = 104, H = 88, cx = L + B / 2, unten = O + H - 6;
        svg.append(tagGrund(), boden(),
          s("rect", { x: L - 8, y: O - 8, width: B + 16, height: H + 16, rx: 7, fill: "#6b7089" }),
          s("rect", { x: L, y: O, width: B, height: H, rx: 3, fill: "#3a3f5c" }),
          s("rect", { x: L + 8, y: unten, width: B - 16, height: 4, rx: 2, fill: "#2a2e45" }));
        svg.appendChild(erscheine(s("rect", { x: L, y: O, width: B, height: H, rx: 3, fill: "#fff2b3", "fill-opacity": 0.22 }), DAUER * 0.5, ruhig, 0.4));
        const gold = { fill: "#e9b300", stroke: "#b88a1f", "stroke-width": 1.2 };
        const muenze = (x, y, r = 12) => s("g", {}, s("circle", { cx: x, cy: y, r, ...gold }), s("circle", { cx: x, cy: y, r: r * 0.62, fill: "none", stroke: "#b88a1f", "stroke-width": 1 }));
        const stapel = (x, y, n) => s("g", {}, ...Array.from({ length: n }, (_, i) => s("ellipse", { cx: x, cy: y - i * 5, rx: 13, ry: 4.5, ...gold })));
        const barren = (x, y) => s("path", { d: `M${x - 16},${y} l5,-11 h22 l5,11 Z`, ...gold });
        const SCHATZ = [
          () => muenze(cx, unten - 13),
          () => s("g", {}, stapel(cx - 16, unten - 4, 4), stapel(cx + 14, unten - 4, 6)),
          () => s("g", {}, barren(cx - 17, unten), barren(cx + 17, unten), barren(cx, unten - 11)),
          () => s("g", {}, ...Array.from({ length: 13 }, (_, i) => s("circle", { cx: cx - 30 + i * 5, cy: O + 22 + Math.sin((i / 12) * Math.PI) * 26, r: 3.2,
            fill: "#f4f0f8", stroke: "#b0a8c8", "stroke-width": 0.6 })), s("path", { d: `M${cx},${O + 50} l6,7 l-6,9 l-6,-9 Z`, style: "fill:var(--deko-2)" })),
          () => s("g", {}, s("path", { d: `M${cx - 24},${unten} l-4,-28 l12,12 l16,-22 l16,22 l12,-12 l-4,28 Z`, ...gold }),
            ...[-14, 0, 14].map((dx, i) => s("circle", { cx: cx + dx, cy: unten - 7, r: 3, style: `fill:var(--deko-${[2, 5, 6][i]})` }))),
          () => s("g", {}, s("ellipse", { cx, cy: unten - 4, rx: 30, ry: 7, style: "fill:var(--deko-2)" }),
            s("path", { d: `M${cx - 18},${unten - 26} l8,-10 h20 l8,10 l-18,24 Z`, fill: "#d8f3ff", stroke: "#5aa9dc", "stroke-width": 1.4 }),
            s("path", { d: `M${cx - 18},${unten - 26} h36 M${cx - 10},${unten - 36} l4,10 l4,-10 l4,10 l4,-10 M${cx},${unten - 2} l-6,-24 M${cx},${unten - 2} l6,-24`,
              stroke: "#5aa9dc", "stroke-width": 0.8, fill: "none" })),
        ];
        // je Stufe das eine Stück dieser Stufe — immer wertvoller als das der Stufe davor
        const schatz = SCHATZ[stufeNr - 1]();
        schatz.setAttribute("data-stueck", ["muenze", "muenzstapel", "goldbarren", "perlenkette", "krone", "diamant"][stufeNr - 1]);
        svg.appendChild(vonOben(schatz, DAUER * 0.62, ruhig, 8, 0.35));
        // Tür mit Rad: das Rad dreht (entriegeln), dann schwingt die Tür an der linken Angel auf (scale um die Angel)
        const rad = s("g", {}, s("circle", { cx, cy: O + H / 2, r: 16, fill: "none", stroke: "#4f5668", "stroke-width": 3 }),
          s("path", { d: `M${cx},${O + H / 2 - 16} v32 M${cx - 16},${O + H / 2} h32`, stroke: "#4f5668", "stroke-width": 2.4 }));
        if (!ruhig) rad.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `0 ${cx} ${O + H / 2}`, to: `270 ${cx} ${O + H / 2}`,
          begin: t(0), dur: `${DAUER * 0.3}s`, fill: "freeze" }));
        const tuerBlatt = s("g", { transform: `translate(${-L} 0)` },
          s("rect", { x: L, y: O, width: B, height: H, rx: 3, fill: "#8a94a6", stroke: "#4f5668", "stroke-width": 1.2 }), rad);
        const schwingen = s("g", {}, tuerBlatt);
        if (ruhig) schwingen.setAttribute("transform", "scale(0.1 1)");
        else schwingen.appendChild(s("animateTransform", { attributeName: "transform", type: "scale", from: "1 1", to: "0.1 1",
          begin: t(DAUER * 0.32), dur: `${DAUER * 0.3}s`, fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }));
        svg.appendChild(s("g", { transform: `translate(${L} 0)`, "data-teil": "tuer" }, schwingen));
        if (stufeNr === 6) { const e = euleSitzend(0.42); e.setAttribute("transform", `translate(${L + B + 36} 126)`); svg.appendChild(erscheine(e, DAUER, ruhig)); }
        if (sterne >= 2) svg.appendChild(glanz(cx + 26, O + 14, ruhig));
        if (sterne >= 3) svg.appendChild(funken(cx, 19, ruhig));
        return svg;
      },
    },

    bauen: {
      /** Zahlen-Baukasten: die Bausteine der Stufe fallen zum Turm je Stelle; darunter die Rechnung mit der Zahl. */
      baukasten(feier, { stufe, sterne, ruhig }) {
        const z = feier.ziele?.[stufe];
        if (!z || typeof z !== "object" || !Object.keys(z).length || !Object.entries(z).every(([k, v]) => k in WERT && Number.isInteger(v) && v > 0 && v <= 19)) return null;
        const keys = GANZE.filter(k => z[k]);
        const ergebnis = keys.reduce((a, k) => a + z[k] * WERT[k], 0);
        const anzahl = keys.reduce((a, k) => a + z[k], 0);
        const svg = neuesBild("bauen", ergebnis, { "data-bilder": "baukasten", "data-anzahl": anzahl });
        svg.append(tagGrund(), boden());
        // Gruppen nebeneinander, je Gruppe ein Stapel (etwas versetzt, damit man zählen kann)
        const versatz = k => (k === "E" || k === "Z" ? 9 : 4);
        const breite = k => BAUSTEIN_BREITE[k] + (z[k] - 1) * versatz(k);
        const gesamt = keys.reduce((a, k) => a + breite(k), 0) + (keys.length - 1) * 14;
        let x = (BREITE - gesamt) / 2, i = 0;
        const je = (DAUER * 0.85) / anzahl;
        for (const k of keys) {
          for (let n = 0; n < z[k]; n++) {
            const b = baustein(k, x + n * versatz(k), 112 - (k === "E" || k === "Z" ? 0 : n * 2));
            b.setAttribute("data-stueck", k);
            svg.appendChild(vonOben(b, i++ * je, ruhig, 70, 0.3));
          }
          x += breite(k) + 14;
        }
        const rechnung = keys.map(k => `${z[k]} ${k}`).join(" + ") + " = " + ganzText(ergebnis);
        svg.appendChild(erscheine(zeileUnten(rechnung, 136), DAUER, ruhig));
        if (sterne >= 2) svg.appendChild(fahne(BREITE - 26, 112, ruhig));
        if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 24, ruhig));
        return svg;
      },

      /** Ziffernkarten: die Karten der Stufe legen sich nacheinander zur Zahl, ab fünf Stellen mit Lücke je drei. */
      karten(feier, { stufe, sterne, ruhig }) {
        const ziffern = feier.ziele?.[stufe];
        if (typeof ziffern !== "string" || !/^\d{2,7}$/.test(ziffern)) return null;
        const n = ziffern.length, kb = 26, abstand = 4, luecke = n >= 5 ? 8 : 0;
        const gruppe = i => Math.floor((n - 1 - i) / 3); // von rechts gezählt
        const breiteGesamt = n * kb + (n - 1) * abstand + (n >= 5 ? (gruppe(0)) * luecke : 0);
        const x0 = (BREITE - breiteGesamt) / 2;
        const xi = i => x0 + i * (kb + abstand) + (n >= 5 ? (gruppe(0) - gruppe(i)) * luecke : 0);
        const svg = neuesBild("bauen", ziffern, { "data-bilder": "karten", "data-anzahl": n });
        svg.append(tagGrund(), boden());
        const je = (DAUER * 0.85) / n;
        [...ziffern].forEach((zf, i) => {
          const karte = s("g", { "data-stueck": "karte" },
            s("rect", { x: xi(i), y: 48, width: kb, height: 38, rx: 4, fill: "#ffffff", style: `stroke:${KARTENFARBEN_DEKO[i % KARTENFARBEN_DEKO.length]}`, "stroke-width": 2 }),
            zifferText(xi(i) + kb / 2, 74, zf, 20));
          const dx = 20 - xi(i), dy = 70;
          if (ruhig) svg.appendChild(karte);
          else {
            karte.setAttribute("opacity", "0");
            karte.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(i * je), fill: "freeze" }));
            karte.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: `${dx} ${dy}`, to: "0 0", begin: t(i * je), dur: "0.4s",
              fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }));
            svg.appendChild(karte);
          }
        });
        if (sterne >= 2) svg.appendChild(glanz(xi(n - 1) + kb + 6, 46, ruhig));
        if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 26, ruhig));
        return svg;
      },
    },
  };

  // ---------- Bilder Block M2: Zahlen, Teiler, Begründen (AR1 a, LERN_Session28) ----------
  // Wie in M1 folgt jedes Bild den Stufen seines Spiels. Jedes prüft die Zahlen, die es zeigt (Teiler teilen, Preise
  // sind proportional, der Überschlag liegt nahe …), und gibt ohne stimmige Angabe kein Bild — dann meldet der Test
  // „keine Animation“ statt einer falschen.

  /** Text im Bild (Zahlen, Rechnungen). */
  const text = (x, y, inhalt, { gross = 11, farbe = "#2d3047", anker = "middle", fett = true } = {}) =>
    s("text", { x, y, fill: farbe, "font-size": gross, ...(fett ? { "font-weight": "bold" } : {}), "font-family": SCHRIFT, "text-anchor": anker }, String(inhalt));
  const RECHNEN = { "+": (a, b) => a + b, "-": (a, b) => a - b, "·": (a, b) => a * b, ":": (a, b) => a / b };
  const OP_TEXT = { "+": "+", "-": "−", "·": "·", ":": ":" };
  /** Geld wie ab der 4. Klasse (LS.geldText): „7.20 Fr.“, ganze Franken „12 Fr.“. */
  const geld = rp => (typeof LS !== "undefined" && LS.geldText ? LS.geldText(rp, 4) : (rp % 100 ? `${(rp / 100).toFixed(2)} Fr.` : `${rp / 100} Fr.`));
  /** Verschieben ab Zeitpunkt, gerade oder im Bogen (im ruhigen Bild gleich am Ziel). */
  function schiebe(e, dx, dy, ab, ruhig, { dauer = 0.6, bogen = 0 } = {}) {
    if (ruhig) { e.setAttribute("transform", `translate(${dx} ${dy})`); return e; }
    if (bogen) e.appendChild(s("animateMotion", { path: `M0,0 Q${dx / 2},${Math.min(0, dy) - bogen} ${dx},${dy}`, begin: t(ab), dur: `${dauer}s`, fill: "freeze" }));
    else e.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "0 0", to: `${dx} ${dy}`, begin: t(ab), dur: `${dauer}s`,
      fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }));
    return e;
  }
  /** Sichtbar nur bis zum Zeitpunkt bis (danach weg; im ruhigen Bild gar nicht). */
  function kurz(e, ab, bis, ruhig) {
    if (ruhig) { e.setAttribute("opacity", "0"); return e; }
    e.setAttribute("opacity", "0");
    e.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(ab), fill: "freeze" }));
    e.appendChild(s("animate", { attributeName: "opacity", from: 1, to: 0, begin: t(bis), dur: "0.25s", fill: "freeze" }));
    return e;
  }

  // ----- Zahlenstrahl-Pfeil (ZOOM · strahl) -----
  /** Pfeil, Spitze bei 0,0, nach rechts (die Bewegung dreht ihn in die Flugrichtung). */
  function pfeil() {
    return s("g", { "data-figur": "pfeil" },
      s("line", { x1: -36, y1: 0, x2: -7, y2: 0, stroke: "#7a4f26", "stroke-width": 2.2 }),
      s("path", { d: "M0,0 L-10,-4.5 L-10,4.5 Z", fill: "#4f5668" }),
      s("path", { d: "M-36,0 l-6,-5 M-36,0 l-6,5 M-32,0 l-6,-5 M-32,0 l-6,5", stroke: "#e5484d", "stroke-width": 1.6, fill: "none" }));
  }
  /** Zahlenstrahl in zehn Abschnitten von a bis b auf der Höhe y, mit den Zahlen am Anfang und am Ende. */
  function strahlLinie(y, a, b, L = 30, R = 290) {
    const g = s("g", {}, s("line", { x1: L, y1: y, x2: R, y2: y, stroke: "#2d3047", "stroke-width": 1.6 }));
    for (let i = 0; i <= 10; i++) {
      const x = L + (i / 10) * (R - L), h = i === 0 || i === 10 ? 8 : i === 5 ? 6 : 4;
      g.appendChild(s("line", { x1: x, y1: y - h, x2: x, y2: y + h, stroke: "#2d3047", "stroke-width": 1.2 }));
    }
    g.append(text(L, y + 19, ganzText(a), { gross: 10 }), text(R, y + 19, ganzText(b), { gross: 10 }));
    return g;
  }
  /**
   * Der Pfeil fliegt im Bogen und trifft die Zahl der Stufe auf dem Strahl von von bis bis (zehn Abschnitte wie im
   * Spiel). Mit ganz ([a, b], Ausschnitte ab Stufe 4) steht darüber der grössere Strahl mit dem markierten Ausschnitt.
   */
  function strahl(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || ![z.von, z.bis, z.wert].every(Number.isFinite) || !(z.von < z.bis && z.von <= z.wert && z.wert <= z.bis)) return null;
    if (z.ganz && !(z.ganz[0] <= z.von && z.bis <= z.ganz[1] && z.ganz[0] < z.ganz[1])) return null;
    const L = 30, R = 290, y = z.ganz ? 100 : 88;
    const px = (v, a, b) => L + ((v - a) / (b - a)) * (R - L);
    const svg = neuesBild("zoom", z.wert, { "data-bilder": "strahl", "data-wert": z.wert });
    svg.appendChild(tagGrund());
    let ab = 0.1;
    if (z.ganz) {
      const oben = 30, [a, b] = z.ganz, xa = px(z.von, a, b), xb = Math.max(px(z.bis, a, b), xa + 3);
      svg.appendChild(strahlLinie(oben, a, b));
      svg.appendChild(erscheine(s("g", {},
        s("rect", { x: xa, y: oben - 5, width: xb - xa, height: 10, fill: "#f5b301", opacity: 0.6 }),
        s("path", { d: `M${xa},${oben + 5} L${L},${y - 10} M${xb},${oben + 5} L${R},${y - 10}`, stroke: "#f5b301", "stroke-width": 1, "stroke-dasharray": "3 2", fill: "none" })), 0.05, ruhig));
      ab = 0.45;
    }
    svg.appendChild(erscheine(strahlLinie(y, z.von, z.bis), z.ganz ? 0.3 : 0, ruhig));
    const xw = px(z.wert, z.von, z.bis), kx = (xw - 20) / 2, ky = z.ganz ? 20 : -10;
    const winkel = (Math.atan2(y - ky, xw - kx) * 180) / Math.PI;
    svg.appendChild(bewege(pfeil(), `M-20,${y - 40} Q${kx},${ky} ${xw},${y}`, { x: xw, y, winkel }, ruhig, { ab, dauer: DAUER - ab }));
    svg.appendChild(erscheine(s("circle", { cx: xw, cy: y, r: 3, fill: "#2fb36b", "data-treffer": z.wert }), DAUER, ruhig));
    svg.appendChild(erscheine(text(Math.min(Math.max(xw, 34), BREITE - 34), y + 38, ganzText(z.wert), { gross: 13 }), DAUER, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(Math.min(xw + 14, BREITE - 10), y - 16, ruhig));
    if (sterne >= 3) {
      const ringe = s("g", { "data-schmuck": "3", fill: "none", stroke: "#f5b301", "stroke-width": 1.4 });
      for (const r of [7, 12]) {
        const c = s("circle", { cx: xw, cy: y, r });
        if (!ruhig) { c.setAttribute("opacity", "0"); c.appendChild(s("animate", { attributeName: "opacity", values: "0;1;0.5", begin: t(DAUER + (r - 7) * 0.04), dur: "0.7s", fill: "freeze" })); }
        ringe.appendChild(c);
      }
      svg.append(ringe, funken(Math.min(Math.max(xw, 24), BREITE - 24), 20, ruhig));
    }
    return svg;
  }

  // ----- Überschlags-Radar (ZOOM · radar) -----
  /**
   * Der Strahl des Radars dreht einmal, der Punkt leuchtet auf — je Stufe schärfer —, daneben die Rechnung der Stufe,
   * ihr Überschlag und das Ergebnis; in Stufe 5 der Anteil in Prozent (263 von 830 ≈ 30 %, wie im Spiel).
   */
  function radar(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    let zeilen;
    if (z.teil !== undefined) {
      if (![z.teil, z.ganz, z.prozent].every(Number.isFinite) || Math.abs((z.teil / z.ganz) * 100 - z.prozent) > 3) return null;
      zeilen = [`${ganzText(z.teil)} von ${ganzText(z.ganz)}`, `≈ ${z.prozent} %`];
    } else {
      if (!RECHNEN[z.op] || ![z.a, z.b, z.ra, z.rb].every(Number.isFinite)) return null;
      // überschlagen wie im Spiel: jede Zahl auf ihre erste Ziffer gerundet; bei der Division der Teiler so und der
      // Dividend auf ein passendes Vielfaches (kompatible Zahlen); das genaue Ergebnis 0.6- bis 1.6-mal der Überschlag
      const rund1 = x => { const p = 10 ** Math.floor(Math.log10(x)); return Math.round(x / p) * p; };
      const passt = z.op === ":" ? z.rb === rund1(z.b) && z.ra === rund1(z.a / z.rb) * z.rb : z.ra === rund1(z.a) && z.rb === rund1(z.b);
      const erg = RECHNEN[z.op](z.ra, z.rb), genau = RECHNEN[z.op](z.a, z.b);
      if (!passt || !Number.isInteger(erg) || !(erg >= 1) || genau / erg < 0.6 || genau / erg > 1.6) return null;
      const op = OP_TEXT[z.op];
      zeilen = [`${ganzText(z.a)} ${op} ${ganzText(z.b)}`, `≈ ${ganzText(z.ra)} ${op} ${ganzText(z.rb)}`, `= ${ganzText(erg)}`];
    }
    const nr = Number(String(stufe).slice(1)) || 1;
    const svg = neuesBild("zoom", stufe, { "data-bilder": "radar" });
    svg.appendChild(tagGrund());
    const cx = 70, cy = 75, r = 54;
    svg.append(s("circle", { cx, cy, r, fill: "#12382c", stroke: "#2fb36b", "stroke-width": 2 }),
      ...[0.33, 0.66].map(k => s("circle", { cx, cy, r: r * k, fill: "none", stroke: "#2fb36b", "stroke-width": 0.8, opacity: 0.6 })),
      s("path", { d: `M${cx - r},${cy} H${cx + r} M${cx},${cy - r} V${cy + r}`, stroke: "#2fb36b", "stroke-width": 0.6, opacity: 0.5 }));
    // Strahl: dreht einmal im Uhrzeigersinn und beginnt oben; der helle Fächer folgt ihm
    const runde = DAUER * 0.75;
    const strahlG = s("g", {},
      s("path", { d: `M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 0,0 ${cx - r * Math.sin(0.5)},${cy - r * Math.cos(0.5)} Z`, fill: "#6ee7a8", opacity: 0.25 }),
      s("line", { x1: cx, y1: cy, x2: cx, y2: cy - r, stroke: "#6ee7a8", "stroke-width": 1.6 }));
    if (!ruhig) strahlG.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `0 ${cx} ${cy}`, to: `360 ${cx} ${cy}`, begin: t(0), dur: `${runde}s`, fill: "freeze" }));
    svg.appendChild(strahlG);
    // der Punkt bei 60° nach oben: dort kommt der Strahl nach einem Sechstel der Runde vorbei
    const w = Math.PI / 3, bx = cx + 0.55 * r * Math.sin(w), by = cy - 0.55 * r * Math.cos(w);
    const unscharf = Math.max(0, 6 - nr); // Stufe 1: fünf Teile unscharf … Stufe 6: scharf
    svg.appendChild(erscheine(s("g", { "data-punkt": nr },
      s("circle", { cx: bx, cy: by, r: 3 + unscharf * 1.6, fill: "#b7f5d0", opacity: 0.25 }),
      s("circle", { cx: bx, cy: by, r: 2.6 + unscharf * 0.5, fill: "#e9fff2" })), runde / 6, ruhig, 0.2));
    const zx = 138, ys = zeilen.length === 3 ? [50, 76, 108] : [62, 102];
    zeilen.forEach((zeile, i) => {
      const letzte = i === zeilen.length - 1;
      svg.appendChild(erscheine(text(zx, ys[i], zeile, { gross: letzte ? 17 : 12, anker: "start", farbe: !letzte && i === 1 ? "#2f7a50" : "#2d3047" }),
        (i / zeilen.length) * DAUER * 0.9, ruhig));
    });
    if (sterne >= 2) svg.appendChild(glanz(cx + r - 6, cy - r + 8, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 30, 24, ruhig));
    return svg;
  }

  // ----- Hundertertafel-Detektiv (SAMMELN · tafel) -----
  /**
   * Die Tafel füllt sich Zeile um Zeile — bis 20 und bis 50 mit den Zahlen in den Feldern, ab der ganzen Tafel mit der
   * Reihe der Stufe als Muster (5er-Reihe: zwei Spalten, 3er-Reihe: schräge Linien); ab Stufe 5 eine Seite des
   * Tausenderbuchs. Gezählt (data-stueck) werden die Felder, mit Reihe ihre Vielfachen.
   */
  function tafel(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Number.isInteger(z.von) || !Number.isInteger(z.bis)) return null;
    const anzahl = z.bis - z.von + 1;
    if (anzahl % 10 || anzahl < 10 || anzahl > 100 || (z.von - 1) % 10 || (z.reihe !== undefined && !(Number.isInteger(z.reihe) && z.reihe > 1))) return null;
    if (z.finde !== undefined && !(Number.isInteger(z.finde) && z.finde >= z.von && z.finde <= z.bis)) return null;
    const zeilen = anzahl / 10, mitZahlen = zeilen <= 5;
    const cw = mitZahlen ? 26 : 11.5, ch = mitZahlen ? 22 : 11.5, B = 10 * cw, H = zeilen * ch;
    const x0 = (BREITE - B) / 2, y0 = mitZahlen ? (HOEHE - H) / 2 - 2 : 18;
    const werte = Array.from({ length: anzahl }, (_, i) => z.von + i);
    const vielfache = z.reihe ? werte.filter(v => v % z.reihe === 0) : [];
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "tafel", "data-anzahl": z.reihe ? vielfache.length : anzahl });
    svg.appendChild(tagGrund());
    const buch = z.von > 100; // Seite im Tausenderbuch: Blätter dahinter
    if (buch) for (const d of [6, 3]) svg.appendChild(s("rect", { x: x0 - 6 + d, y: y0 - 6 + d, width: B + 12, height: H + 12, rx: 3, fill: "#efe6cf", stroke: "#b8a98a", "stroke-width": 0.8 }));
    svg.appendChild(s("rect", { x: x0 - 6, y: y0 - 6, width: B + 12, height: H + 12, rx: 3, fill: buch ? "#fbf6e8" : "#ffffff", stroke: "#b8a98a", "stroke-width": 0.8 }));
    const je = (DAUER * 0.5) / zeilen;
    for (let r = 0; r < zeilen; r++) {
      const zeile = s("g", {});
      for (let c = 0; c < 10; c++) {
        const v = z.von + r * 10 + c, x = x0 + c * cw, y = y0 + r * ch;
        const feld = s("g", z.reihe ? {} : { "data-stueck": "feld", "data-wert": v },
          s("rect", { x: x + 0.6, y: y + 0.6, width: cw - 1.2, height: ch - 1.2, rx: mitZahlen ? 3 : 1.5, fill: mitZahlen ? "#eaf4ff" : "#cfe2f7" }));
        if (mitZahlen) feld.appendChild(text(x + cw / 2, y + ch / 2 + 3.5, v, { gross: 10, farbe: "#4a5a7a" }));
        zeile.appendChild(feld);
      }
      svg.appendChild(erscheine(zeile, r * je, ruhig, 0.2));
    }
    if (!mitZahlen) svg.append(text(x0 - 10, y0 + 9, ganzText(z.von), { gross: 10, anker: "end" }), text(x0 + B + 10, y0 + H - 1, ganzText(z.bis), { gross: 10, anker: "start" }));
    const jeV = (DAUER * 0.35) / Math.max(1, vielfache.length);
    vielfache.forEach((v, k) => {
      const i = v - z.von, x = x0 + (i % 10) * cw, y = y0 + Math.floor(i / 10) * ch;
      svg.appendChild(erscheine(s("rect", { x: x + 0.6, y: y + 0.6, width: cw - 1.2, height: ch - 1.2, rx: 1.5, style: "fill:var(--deko-2)", "data-stueck": "vielfaches", "data-wert": v }),
        DAUER * 0.6 + k * jeV, ruhig, 0.15));
    });
    if (z.finde !== undefined) {
      // der Detektiv sucht eine Zahl (Stufen mit „Zahlen auf der Tafel finden“): das Feld leuchtet, die Lupe kommt
      const i = z.finde - z.von, fx = x0 + (i % 10) * cw + cw / 2, fy = y0 + Math.floor(i / 10) * ch + ch / 2;
      svg.appendChild(erscheine(s("rect", { x: fx - cw / 2 + 0.6, y: fy - ch / 2 + 0.6, width: cw - 1.2, height: ch - 1.2, rx: 2, style: "fill:var(--deko-5)", "data-gefunden": z.finde }), DAUER * 0.85, ruhig, 0.2));
      if (!mitZahlen) svg.appendChild(erscheine(text(x0 + B + 10, fy + 4, ganzText(z.finde), { gross: 13, anker: "start" }), DAUER * 0.85, ruhig));
      svg.appendChild(bewege(lupe(), `M${BREITE + 20},${fy - 40} Q${fx + 60},${fy - 50} ${fx},${fy}`, { x: fx, y: fy, winkel: 0 }, ruhig, { drehen: false, ab: DAUER * 0.45, dauer: DAUER * 0.45 }));
    }
    if (sterne >= 2) svg.appendChild(glanz(x0 + B + 4, y0 - 4, ruhig));
    if (sterne >= 3) svg.appendChild(funken(Math.min(x0 + B + 34, BREITE - 24), 26, ruhig));
    return svg;
  }

  // ----- Teiler-Spürnase (SAMMELN · spuernase) -----
  /** Hund nach rechts, Füsse auf 0,0, die Nase bei x = 24. */
  function hund() {
    const f = "#c58b4c", d = "#7a4f26";
    return s("g", { "data-figur": "hund" },
      s("path", { d: "M-17,-14 q-6,-8 -2,-13", stroke: f, "stroke-width": 2.4, fill: "none", "stroke-linecap": "round" }),
      ...[-15, -8, 2, 9].map(x => s("rect", { x, y: -8, width: 3, height: 8, fill: d })),
      s("ellipse", { cx: -3, cy: -12, rx: 15, ry: 6.5, fill: f }),
      s("circle", { cx: 13, cy: -14, r: 6, fill: f }), s("ellipse", { cx: 19, cy: -10.5, rx: 5, ry: 3, fill: f }),
      s("circle", { cx: 23.5, cy: -11, r: 1.6, fill: "#2d3047" }), s("circle", { cx: 14.5, cy: -16, r: 1.1, fill: "#2d3047" }),
      s("path", { d: "M9,-19 q-4,2 -3,9 q3,-1 5,-6 Z", fill: d }));
  }
  /** Knochen der Breite b um x, y mit der Zahl darauf. */
  function knochen(x, y, b, zahl) {
    const h = 4.5, e = 3.6;
    return s("g", {},
      ...[[x - b / 2, y - h], [x - b / 2, y + h], [x + b / 2, y - h], [x + b / 2, y + h]].map(([cx, cy]) => s("circle", { cx, cy, r: e, fill: "#f4ecd8", stroke: "#b8a98a", "stroke-width": 0.8 })),
      s("rect", { x: x - b / 2, y: y - h - 0.5, width: b, height: 2 * h + 1, fill: "#f4ecd8" }),
      text(x, y + 3.6, ganzText(zahl), { gross: zahl >= 1000 ? 9 : 10 }));
  }
  /**
   * Der Hund läuft die Reihe ab, unter seiner Nase tauchen die Teiler der Zahl als Knochen auf. Mit paare (alle Teiler,
   * ab Stufe 3) verbinden Bögen die Teilerpaare (2 · 12 = 24); ein Teiler, der mit sich selbst die Zahl gibt (7 · 7 = 49),
   * bleibt allein im Ring — darum hat 49 eine ungerade Anzahl Teiler (Stufe 6).
   */
  function spuernase(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Number.isInteger(z.zahl) || z.zahl < 2 || !Array.isArray(z.teiler) || !z.teiler.length) return null;
    const teiler = [...z.teiler].sort((a, b) => a - b);
    if (teiler.some(d => !Number.isInteger(d) || d < 1 || z.zahl % d) || new Set(teiler).size !== teiler.length) return null;
    if (z.paare) {
      const alle = [];
      for (let d = 1; d <= z.zahl; d++) if (z.zahl % d === 0) alle.push(d);
      if (alle.join() !== teiler.join()) return null;
    }
    const n = teiler.length;
    const svg = neuesBild("sammeln", z.zahl, { "data-bilder": "spuernase", "data-anzahl": n, "data-zahl": z.zahl });
    svg.append(tagGrund(), boden(),
      s("rect", { x: 10, y: 22, width: 62, height: 32, rx: 6, fill: "#ffffff", stroke: "#6b7089", "stroke-width": 1.4 }),
      text(41, 44, ganzText(z.zahl), { gross: 16 }));
    // die Knochen liegen über dem Weg des Hundes (er verdeckt sonst den letzten), die Bögen darüber
    const links = 86, rechts = 308, schritt = (rechts - links) / n, bw = Math.min(30, schritt - 9), ky = 86;
    const xs = teiler.map((_, i) => links + schritt * (i + 0.5));
    // der Hund läuft gleichmässig; ein Knochen taucht auf, wenn die Nase (24 vor den Füssen) bei ihm ist
    const start = 40, ende = rechts - 26, lauf = DAUER * 0.8;
    const zeitBei = x => Math.max(0, Math.min(lauf, ((x - 24 - start) / (ende - start)) * lauf));
    teiler.forEach((d, i) => {
      const k = knochen(xs[i], ky, bw, d);
      k.setAttribute("data-stueck", "teiler");
      k.setAttribute("data-wert", d);
      svg.appendChild(erscheine(k, zeitBei(xs[i]), ruhig, 0.2));
    });
    svg.appendChild(bewege(hund(), `M${start},130 L${ende},130`, { x: ende, y: 130, winkel: 0 }, ruhig, { drehen: false, dauer: lauf, linear: true }));
    if (z.paare) {
      const farben = ["#e0569a", "#2f8fe0", "#f07c2a", "#2fb36b", "#8e5bd6"];
      let k = 0;
      teiler.forEach((d, i) => {
        const p = z.zahl / d;
        if (p < d) return;
        const ab = lauf + 0.1 + k * 0.15, farbe = farben[k++ % farben.length];
        if (p === d) {
          svg.appendChild(erscheine(s("circle", { cx: xs[i], cy: ky, r: bw / 2 + 7, fill: "none", stroke: "#e9b300", "stroke-width": 2, "data-paar": `${d}·${d}` }), ab, ruhig));
          return;
        }
        const x1 = xs[i], x2 = xs[teiler.indexOf(p)], h = Math.min(52, 8 + (x2 - x1) * 0.25);
        svg.appendChild(erscheine(s("path", { d: `M${x1},${ky - 9} Q${(x1 + x2) / 2},${ky - 9 - 2 * h} ${x2},${ky - 9}`, fill: "none", stroke: farbe, "stroke-width": 1.6, "data-paar": `${d}·${p}` }), ab, ruhig));
      });
    }
    if (sterne >= 2) svg.appendChild(glanz(68, 22, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 30, 22, ruhig));
    return svg;
  }

  // ----- Velo-Tabelle (REISE · velo) -----
  /** Velo nach rechts mit der Eule im Sattel, Räder auf 0,0; farbe des Rahmens. */
  function veloFigur(farbe = "var(--deko-3)") {
    return s("g", { "data-figur": "velo" },
      s("circle", { cx: -10, cy: -6, r: 6, fill: "none", stroke: "#2d3047", "stroke-width": 1.6 }),
      s("circle", { cx: 10, cy: -6, r: 6, fill: "none", stroke: "#2d3047", "stroke-width": 1.6 }),
      s("path", { d: "M-10,-6 L-2,-6 L6,-15 L-5,-15 Z M-2,-6 L-6,-18 M10,-6 L6,-18 L9,-19", style: `stroke:${farbe}`, "stroke-width": 1.8, fill: "none", "stroke-linejoin": "round" }),
      s("path", { d: "M-9,-19 h5", stroke: "#2d3047", "stroke-width": 2, "stroke-linecap": "round" }),
      s("ellipse", { cx: -4, cy: -25, rx: 4.5, ry: 6, fill: "#8e6b4f" }), s("circle", { cx: -2, cy: -33, r: 4.2, fill: "#8e6b4f" }),
      s("circle", { cx: -0.4, cy: -33.6, r: 1.5, fill: "#ffffff" }), s("path", { d: "M0,-31.5 l2,1 l-2,1 Z", fill: "#f5a623" }),
      s("path", { d: "M-2,-24 L7,-18", stroke: "#8e6b4f", "stroke-width": 1.6 }));
  }
  const zeitText = (min, stunden) => (stunden && min % 60 === 0 ? `${min / 60} h` : `${min} min`);
  /**
   * Das Velo fährt gleichmässig, und die Tabelle Zeit → Weg füllt sich, wenn es die Marke erreicht (Weg =
   * Geschwindigkeit · Zeit). frage: diese Zeit kommt zuletzt (Stufe 4, rückwärts); fehler: ein falscher Weg wird
   * gestrichen und berichtigt (Stufe 6); vergleich: zwei Velos gleich lang unterwegs, das schnellere kommt weiter (Stufe 5).
   */
  function velo(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !(z.v > 0) || !Array.isArray(z.zeiten) || !z.zeiten.length) return null;
    const weg = (v, min) => Number(((v * min) / 60).toFixed(6));
    const eineStelle = w => Number.isInteger(Number((w * 10).toFixed(6)));
    const kmText = w => `${zahlGeschrieben(w)} km`;
    const svg = neuesBild("reise", stufe, { "data-bilder": "velo" });
    svg.append(tagGrund(), boden());
    const strasse = y => s("rect", { x: 14, y: y - 1, width: BREITE - 28, height: 5, rx: 2, fill: "#8a8fa8" });
    if (z.vergleich) {
      const min = z.zeiten[0], v2 = z.vergleich, w1 = weg(z.v, min), w2 = weg(v2, min);
      if (!(v2 > 0) || v2 === z.v || ![w1, w2].every(eineStelle)) return null;
      const max = Math.max(w1, w2), px = w => 26 + (w / max) * 228;
      svg.appendChild(text(BREITE / 2, 20, zeitText(min, z.stunden), { gross: 13 }));
      [[w1, 72, "var(--deko-3)"], [w2, 124, "var(--deko-6)"]].forEach(([w, y, farbe]) => {
        svg.appendChild(strasse(y));
        const v = veloFigur(farbe);
        v.setAttribute("data-weg", w);
        svg.appendChild(bewege(v, `M26,${y} L${px(w)},${y}`, { x: px(w), y, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: DAUER * 0.85 }));
        svg.appendChild(erscheine(text(px(w) + 22, y - 4, kmText(w), { gross: 11, anker: "start" }), DAUER * 0.85, ruhig));
      });
      if (sterne >= 2) svg.appendChild(glanz(px(max), (w1 > w2 ? 72 : 124) - 44, ruhig));
      if (sterne >= 3) svg.appendChild(funken(BREITE - 30, 22, ruhig));
      return svg;
    }
    const zeiten = z.zeiten, wege = zeiten.map(m => weg(z.v, m)), n = zeiten.length;
    if (!wege.every(eineStelle) || wege.some((w, i) => i && w <= wege[i - 1])) return null;
    const f = z.fehler;
    if (f && !(Number.isInteger(f.index) && f.index < n && Number.isFinite(f.falsch) && f.falsch !== wege[f.index])) return null;
    if (z.frage !== undefined && !(Number.isInteger(z.frage) && z.frage < n)) return null;
    const cw = Math.min(62, 292 / n), x0 = (BREITE - n * cw) / 2, ys = [10, 33], ch = 22, ry = 126;
    const max = wege[n - 1], px = w => 30 + (w / max) * 250, lauf = DAUER * 0.8;
    const zeitBei = w => ((px(w) - 30) / 250) * lauf;
    svg.appendChild(strasse(ry));
    zeiten.forEach((m, i) => {
      const x = x0 + i * cw, w = wege[i];
      for (const y of ys) svg.appendChild(s("rect", { x: x + 1, y, width: cw - 2, height: ch - 1, rx: 3, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1 }));
      svg.appendChild(s("path", { d: `M${px(w)},${ry - 2} v-9 l6,2 l-6,2`, stroke: "#6b7089", "stroke-width": 1.2, fill: "#6b7089" }));
      const zt = text(x + cw / 2, ys[0] + 15, zeitText(m, z.stunden), { gross: 11 });
      const wt = text(x + cw / 2, ys[1] + 15, kmText(f?.index === i ? f.falsch : w), { gross: 11, farbe: f?.index === i ? "#c0392b" : "#2d3047" });
      wt.setAttribute("data-zelle", `weg-${i}`);
      if (z.frage === i) {
        // rückwärts gefragt: der Weg steht, die Zeit kommt, wenn das Velo ankommt
        svg.append(wt, erscheine(zt, zeitBei(w), ruhig, 0.2),
          erscheine(s("rect", { x: x + 1, y: ys[0], width: cw - 2, height: ch - 1, rx: 3, fill: "none", stroke: "#f5b301", "stroke-width": 2 }), zeitBei(w), ruhig, 0.2));
      } else if (f) svg.append(zt, f.index === i ? verschwinde(wt, DAUER * 0.85, ruhig) : wt);
      else svg.append(zt, erscheine(wt, zeitBei(w), ruhig, 0.2));
    });
    if (f) {
      // der falsche Wert wird gestrichen, an seiner Stelle steht der richtige
      const x = x0 + f.index * cw;
      svg.append(kurz(s("path", { d: `M${x + 8},${ys[1] + 15} L${x + cw - 8},${ys[1] + 5}`, stroke: "#c0392b", "stroke-width": 1.8 }), DAUER * 0.55, DAUER * 0.85, ruhig),
        erscheine(text(x + cw / 2, ys[1] + 15, kmText(wege[f.index]), { gross: 11 }), DAUER * 0.9, ruhig));
    }
    svg.appendChild(bewege(veloFigur(), `M30,${ry} L${px(max)},${ry}`, { x: px(max), y: ry, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: lauf }));
    if (sterne >= 2) svg.appendChild(fahne(Math.min(px(max) + 16, BREITE - 18), ry - 2, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 80, ruhig));
    return svg;
  }

  // ----- Vergleichs-Krokodil (REISE · krokodil) -----
  /** Krokodil nach rechts, Gelenk des Mauls bei 0,0; { g, oben, unten } — die Kiefer drehen um das Gelenk. */
  function krokodilFigur() {
    const gruen = "#4f9d47", dunkel = "#3f7f39";
    const zaehne = (y, h) => `M8,${y} ` + Array.from({ length: 11 }, (_, i) => `l2.5,${i % 2 ? -h : h}`).join(" ");
    const oben = s("g", {}, s("path", { d: "M0,0 L0,-8 Q18,-12 40,-4 L40,0 Z", fill: gruen }), s("path", { d: zaehne(0, 3.5), fill: "#ffffff" }),
      s("circle", { cx: 6, cy: -9, r: 3.4, fill: "#ffffff", stroke: dunkel, "stroke-width": 0.8 }), s("circle", { cx: 7, cy: -9.4, r: 1.5, fill: "#2d3047" }),
      s("circle", { cx: 37, cy: -6, r: 0.9, fill: dunkel }));
    const unten = s("g", {}, s("path", { d: "M0,0 L40,0 L40,3 Q20,9 0,8 Z", fill: dunkel }), s("path", { d: zaehne(0, -3.5), fill: "#ffffff" }));
    const koerper = s("g", {}, s("path", { d: "M2,-8 Q-20,-12 -46,-2 Q-60,4 -72,0 Q-58,10 -40,10 Q-16,12 2,8 Z", fill: gruen }),
      s("path", { d: "M-10,-10 l3,-3 l3,3 M-22,-9 l3,-3 l3,3 M-34,-6 l3,-3 l3,3", stroke: dunkel, "stroke-width": 1, fill: "none" }));
    return { g: s("g", { "data-figur": "krokodil" }, koerper, unten, oben), oben, unten };
  }
  /**
   * Zwei Zahlen (ab Stufe 5 Rechnungen mit ihrem Ergebnis) auf Karten; das Krokodil taucht auf und öffnet das Maul zur
   * grösseren — offen ist es das Zeichen < oder >, das am Schluss darunter im Wasser steht.
   */
  function krokodil(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    const wert = q => (typeof q === "number" ? q : q && RECHNEN[q.op] && Number.isFinite(q.a) && Number.isFinite(q.b) ? RECHNEN[q.op](q.a, q.b) : NaN);
    if (!z) return null;
    const lw = wert(z.links), rw = wert(z.rechts);
    if (!Number.isFinite(lw) || !Number.isFinite(rw) || lw === rw) return null;
    const zeichen = lw < rw ? "<" : ">";
    const svg = neuesBild("reise", stufe, { "data-bilder": "krokodil", "data-zeichen": zeichen });
    svg.append(tagGrund(), s("path", { d: `M0,104 Q80,98 160,104 T${BREITE},104 L${BREITE},136 Q${BREITE},${HOEHE} ${BREITE - 14},${HOEHE} L14,${HOEHE} Q0,${HOEHE} 0,136 Z`, fill: "#5aa9dc" }));
    // Rechnungen (Stufe 5–6) mit dem Ergebnis in der Karte: darunter braucht das Maul Platz
    const term = typeof z.links !== "number" || typeof z.rechts !== "number";
    const karte = (cx, q) => {
      svg.append(s("rect", { x: cx - 58, y: 8, width: 116, height: term ? 44 : 32, rx: 6, fill: "#ffffff", stroke: "#6b7089", "stroke-width": 1.4 }),
        text(cx, 29, typeof q === "number" ? ganzText(q) : `${ganzText(q.a)} ${OP_TEXT[q.op]} ${ganzText(q.b)}`, { gross: 14 }));
      if (typeof q !== "number") svg.appendChild(erscheine(text(cx, 46, `= ${ganzText(wert(q))}`, { gross: 11, farbe: "#4f5668" }), DAUER * 0.3, ruhig));
    };
    karte(70, z.links);
    karte(250, z.rechts);
    const { g, oben, unten } = krokodilFigur();
    // nach rechts offen, wenn rechts die grössere Zahl steht; sonst gespiegelt. Weit offen: das Maul ist das Zeichen.
    const rechtsGroesser = lw < rw, auf = 30, k = 1.35;
    svg.appendChild(s("g", { transform: `translate(${rechtsGroesser ? 184 : 136} 96) scale(${rechtsGroesser ? k : -k} ${k})` }, g));
    if (ruhig) {
      oben.setAttribute("transform", `rotate(${-auf})`);
      unten.setAttribute("transform", `rotate(${auf})`);
    } else {
      // auftauchen, das Maul öffnen, einmal zuschnappen, wieder auf
      g.setAttribute("opacity", "0");
      g.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(0), fill: "freeze" }));
      g.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "0 34", to: "0 0", begin: t(0), dur: `${DAUER * 0.3}s`, fill: "freeze" }));
      const kt = "0;0.3;0.45;0.62;0.72;0.84;1";
      oben.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", values: `0;0;${-auf};${-auf};-3;${-auf};${-auf}`, keyTimes: kt, begin: t(0), dur: `${DAUER}s`, fill: "freeze" }));
      unten.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", values: `0;0;${auf};${auf};3;${auf};${auf}`, keyTimes: kt, begin: t(0), dur: `${DAUER}s`, fill: "freeze" }));
    }
    svg.appendChild(erscheine(text(160, 136, zeichen, { gross: 24, farbe: "#ffffff" }), DAUER * 0.9, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(rechtsGroesser ? 302 : 18, 12, ruhig));
    if (sterne >= 3) svg.appendChild(funken(160, 52, ruhig));
    return svg;
  }

  // ----- Punkte-Blitz (SAMMELN · blitz) -----
  const WUERFELBILD = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  /**
   * Das Bild der Stufe blitzt auf wie im Spiel — Würfelbild, Zehnerfeld, zwei Zehnerfelder, Zehnerstangen und
   * Einerwürfel, Hunderterplatten (Stellenfarben aus stil.css) —, dann steht die Anzahl darunter.
   */
  function punkteBlitz(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const bild = s("g", {});
    let n, stuecke = 0;
    if (Number.isInteger(z.wuerfel) && WUERFELBILD[z.wuerfel]) {
      n = z.wuerfel;
      const x = 128, y = 20, g = 64;
      bild.appendChild(s("rect", { x, y, width: g, height: g, rx: 11, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 3 }));
      for (const i of WUERFELBILD[n]) { bild.appendChild(s("circle", { cx: x + 14 + (i % 3) * 18, cy: y + 14 + Math.floor(i / 3) * 18, r: 6, fill: "#2d3047", "data-stueck": "punkt" })); stuecke++; }
    } else if (Number.isInteger(z.zehner) && z.zehner >= 1 && z.zehner <= 20) {
      // Zehnerfeld 2 × 5, gefüllt zeilenweise (Kraft der Fünf); ab 11 zwei Felder
      n = z.zehner;
      const felder = Math.ceil(n / 10), fb = 108, fh = 48, gap = 16, x0 = (BREITE - felder * fb - (felder - 1) * gap) / 2;
      for (let f = 0; f < felder; f++) {
        const fx = x0 + f * (fb + gap), fy = 30;
        bild.appendChild(s("rect", { x: fx, y: fy, width: fb, height: fh, rx: 6, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 2 }));
        for (let i = 0; i < 10; i++) {
          const voll = f * 10 + i < n, cx = fx + 14 + (i % 5) * 20, cy = fy + 14 + Math.floor(i / 5) * 20;
          bild.appendChild(s("circle", { cx, cy, r: 7.5, ...(voll ? { style: "fill:var(--deko-6)", "data-stueck": "punkt" } : { fill: "none", stroke: "#c9cde0", "stroke-width": 1.4 }) }));
          if (voll) stuecke++;
        }
      }
    } else if (Number.isInteger(z.stellen) && z.stellen > 0 && z.stellen < 1000) {
      n = z.stellen;
      const d = ziffernJeStelle(n), keys = ["H", "Z", "E"].filter(k => d[k]);
      const versatz = k => (k === "H" ? 5 : 9), breite = k => BAUSTEIN_BREITE[k] + (d[k] - 1) * versatz(k);
      const gesamt = keys.reduce((a, k) => a + breite(k), 0) + (keys.length - 1) * 18;
      let x = (BREITE - gesamt) / 2;
      // grösser als im Baukasten (Einerwürfel im Spiel 13 px): sonst sind die Einer nicht zu zählen
      const gross = s("g", { transform: "translate(160 92) scale(1.6) translate(-160 -92)" });
      bild.appendChild(gross);
      for (const k of keys) {
        for (let i = 0; i < d[k]; i++) {
          const b = baustein(k, x + i * versatz(k), k === "H" ? 90 - i * 4 : 90);
          b.setAttribute("data-stueck", k);
          gross.appendChild(b);
          stuecke++;
        }
        x += breite(k) + 18;
      }
    } else return null;
    const svg = neuesBild("sammeln", n, { "data-bilder": "blitz", "data-anzahl": stuecke });
    svg.appendChild(tagGrund());
    // Blitz: das Bild ist mit einem Schlag da, ein heller Schein vergeht
    if (!ruhig) {
      bild.setAttribute("opacity", "0");
      bild.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(0.2), fill: "freeze" }));
    }
    svg.appendChild(bild);
    if (!ruhig) {
      const schein = s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#ffffff", opacity: 0 });
      schein.appendChild(s("animate", { attributeName: "opacity", values: "0;0.85;0", keyTimes: "0;0.15;1", begin: t(0.2), dur: "0.6s", fill: "freeze" }));
      svg.appendChild(schein);
    }
    svg.appendChild(erscheine(text(BREITE / 2, 128, ganzText(n), { gross: 20 }), DAUER * 0.55, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 40, 30, ruhig));
    if (sterne >= 3) svg.appendChild(funken(40, 30, ruhig));
    return svg;
  }

  // ----- Muster-Fortsetzer (BAUEN · kette) -----
  const PERLEN = { r: "#e5484d", b: "#2f7fd6", g: "#f5b301" }; // wie 🔴 🔵 🟡 im Spiel
  /**
   * Die Kette der Stufe fädelt sich Perle um Perle auf, dann fällt die nächste an ihren Platz: Bildmuster in den Farben
   * des Spiels, Zahlenfolgen mit der Zahl auf der Perle (regel "quadrat": 1, 4, 9, 16 …; sonst gleich viel mehr).
   */
  function kette(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.folge) || z.folge.length < 3) return null;
    const f = z.folge, zahlen = f.every(Number.isFinite);
    if (zahlen) {
      if (z.regel === "quadrat") {
        const k = Math.round(Math.sqrt(f[0]));
        if (f.some((v, i) => v !== (k + i) ** 2) || z.weiter !== (k + f.length) ** 2) return null;
      } else {
        const d = f[1] - f[0];
        if (f.some((v, i) => i && v - f[i - 1] !== d) || z.weiter !== f[f.length - 1] + d) return null;
      }
    } else {
      if (!f.every(c => PERLEN[c])) return null;
      // kleinste Länge q, mit der sich die Folge (mindestens zweimal) wiederholt; die nächste Perle setzt sie fort
      const q = [1, 2, 3, 4].find(p => f.length >= 2 * p && f.every((c, i) => i < p || c === f[i - p]));
      if (!q || z.weiter !== f[f.length - q]) return null;
    }
    const alle = [...f, z.weiter], n = alle.length, r = zahlen ? 14 : 12;
    const xs = alle.map((_, i) => 34 + (i * (BREITE - 68)) / (n - 1));
    const ys = xs.map((_, i) => 60 + 26 * Math.sin((Math.PI * i) / (n - 1)));
    const svg = neuesBild("bauen", stufe, { "data-bilder": "kette", "data-anzahl": n });
    svg.append(tagGrund(),
      s("path", { d: `M12,34 L${xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" L")} L${BREITE - 12},34`, fill: "none", stroke: "#8a8fa8", "stroke-width": 1.4, "stroke-linejoin": "round" }),
      s("circle", { cx: 12, cy: 34, r: 2.6, fill: "#6b7089" }), s("circle", { cx: BREITE - 12, cy: 34, r: 2.6, fill: "#6b7089" }));
    const je = (DAUER * 0.55) / f.length;
    alle.forEach((c, i) => {
      const perle = s("g", { "data-stueck": "perle", "data-wert": c },
        zahlen ? s("circle", { cx: xs[i], cy: ys[i], r, fill: "#ffffff", style: "stroke:var(--deko-4)", "stroke-width": 2.2 })
          : s("circle", { cx: xs[i], cy: ys[i], r, fill: PERLEN[c], stroke: "#2d3047", "stroke-opacity": 0.25, "stroke-width": 1 }),
        zahlen ? text(xs[i], ys[i] + 4, ganzText(c), { gross: c >= 100 ? 9 : 11 })
          : s("circle", { cx: xs[i] - r * 0.35, cy: ys[i] - r * 0.35, r: r * 0.25, fill: "#ffffff", opacity: 0.6 }));
      if (i < f.length) { svg.appendChild(erscheine(perle, i * je, ruhig, 0.2)); return; }
      svg.appendChild(erscheine(s("circle", { cx: xs[i], cy: ys[i], r: r + 5, fill: "none", stroke: "#f5b301", "stroke-width": 2 }), DAUER, ruhig));
      svg.appendChild(vonOben(perle, DAUER * 0.68, ruhig, 70, 0.45));
    });
    if (sterne >= 2) svg.appendChild(glanz(xs[n - 1] + r + 4, ys[n - 1] - r - 4, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 120, ruhig));
    return svg;
  }

  // ----- Preis-Tabelle (SAMMELN · korb) -----
  function apfel(x, y) {
    return s("g", {}, s("circle", { cx: x, cy: y, r: 6, fill: "#e5484d" }), s("path", { d: `M${x},${y - 5} q1,-3 3,-4`, stroke: "#6b4a2b", "stroke-width": 1, fill: "none" }),
      s("ellipse", { cx: x + 3.4, cy: y - 8, rx: 2.4, ry: 1.2, fill: "#4f9d47" }));
  }
  function muenzeKlein(x, y, r = 6) {
    return s("g", {}, s("circle", { cx: x, cy: y, r, fill: "#e9b300", stroke: "#b88a1f", "stroke-width": 1 }), s("circle", { cx: x, cy: y, r: r * 0.6, fill: "none", stroke: "#b88a1f", "stroke-width": 0.8 }));
  }
  /** Kalenderblatt (Woche) um x, y. */
  const kalender = (x, y) => s("g", {}, s("rect", { x: x - 7, y: y - 7, width: 14, height: 14, rx: 2, fill: "#ffffff", stroke: "#6b7089", "stroke-width": 1 }),
    s("rect", { x: x - 7, y: y - 7, width: 14, height: 4, fill: "#e5484d" }), s("path", { d: `M${x - 4},${y - 9} v4 M${x + 4},${y - 9} v4`, stroke: "#6b7089", "stroke-width": 1.2 }));
  /** Gewichtsstein (Gramm) um x, y. */
  const gewicht = (x, y) => s("g", {}, s("path", { d: `M${x - 7},${y + 7} L${x - 4},${y - 4} L${x + 4},${y - 4} L${x + 7},${y + 7} Z`, fill: "#6b7089" }),
    s("circle", { cx: x, cy: y - 6, r: 2.4, fill: "none", stroke: "#6b7089", "stroke-width": 1.4 }));
  /** Säckchen, unten Mitte auf 0,0. */
  const saeckchen = () => s("g", {}, s("path", { d: "M-16,0 Q-20,-22 -8,-30 L8,-30 Q20,-22 16,0 Z", fill: "#e8d7b0", stroke: "#b8a98a", "stroke-width": 1.2 }),
    s("path", { d: "M-9,-30 Q0,-36 9,-30 M-6,-34 l-3,-5 M6,-34 l3,-5", stroke: "#b8a98a", "stroke-width": 1.4, fill: "none" }));
  /**
   * Die Tabelle der Stufe füllt sich Spalte um Spalte (oben Woche, Stück oder Gramm, unten der Preis; links je ein
   * Zeichen statt eines Worts). Dazu fallen Münzen neben das Sparschwein (Folge: jede Woche gleich viel mehr), Äpfel in
   * den Korb (Stückpreis) oder das Säckchen wird voller (Preis nach Gewicht). Geprüft: Folge gleichmässig, Preise
   * proportional.
   */
  function korb(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !["spar", "stueck", "gramm"].includes(z.art) || !Array.isArray(z.x) || !Array.isArray(z.rp) || z.x.length !== z.rp.length || z.x.length < 2) return null;
    if (![...z.x, ...z.rp].every(v => Number.isInteger(v) && v > 0)) return null;
    if (z.art === "spar") {
      const d = z.rp[1] - z.rp[0];
      if (z.x.some((v, i) => i && v - z.x[i - 1] !== 1) || z.rp.some((v, i) => i && v - z.rp[i - 1] !== d)) return null;
    } else if (z.x.some((v, i) => i && v <= z.x[i - 1]) || z.rp.some((p, i) => p * z.x[0] !== z.rp[0] * z.x[i])) return null;
    const n = z.x.length, letzte = z.x[n - 1];
    if (z.art === "stueck" && letzte > 8) return null;
    const anzahl = z.art === "spar" ? n : z.art === "stueck" ? letzte : null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "korb", ...(anzahl ? { "data-anzahl": anzahl } : {}) });
    svg.appendChild(tagGrund());
    const ib = 26, cw = Math.min(58, (BREITE - 24 - ib) / n), x0 = (BREITE - ib - n * cw) / 2, ys = [8, 31], ch = 22;
    svg.append(z.art === "spar" ? kalender(x0 + ib / 2, ys[0] + 11) : z.art === "stueck" ? apfel(x0 + ib / 2, ys[0] + 12) : gewicht(x0 + ib / 2, ys[0] + 11),
      muenzeKlein(x0 + ib / 2, ys[1] + 11));
    const je = (DAUER * 0.8) / n;
    z.x.forEach((x, i) => {
      const cx = x0 + ib + i * cw;
      const spalte = s("g", {});
      for (const y of ys) spalte.appendChild(s("rect", { x: cx + 1, y, width: cw - 2, height: ch - 1, rx: 3, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1 }));
      spalte.append(text(cx + cw / 2, ys[0] + 15, z.art === "gramm" ? `${x} g` : x, { gross: 11 }),
        text(cx + cw / 2, ys[1] + 15, geld(z.rp[i]), { gross: 10.5 }));
      spalte.setAttribute("data-spalte", `${x}:${z.rp[i]}`);
      svg.appendChild(erscheine(spalte, i * je, ruhig, 0.2));
    });
    if (z.art === "spar") {
      // Sparschwein, daneben wächst der Münzstapel: je Woche eine Münze
      svg.append(s("ellipse", { cx: 140, cy: 108, rx: 30, ry: 21, fill: "#f4a6b8", stroke: "#c9708a", "stroke-width": 1.2 }),
        s("ellipse", { cx: 170, cy: 106, rx: 7, ry: 6, fill: "#f4a6b8", stroke: "#c9708a", "stroke-width": 1.2 }),
        s("circle", { cx: 168, cy: 105, r: 1, fill: "#c9708a" }), s("circle", { cx: 172, cy: 105, r: 1, fill: "#c9708a" }),
        s("path", { d: "M124,90 l4,-8 l5,7 Z", fill: "#f4a6b8", stroke: "#c9708a", "stroke-width": 1 }),
        s("rect", { x: 132, y: 87, width: 14, height: 3, rx: 1.5, fill: "#9a4f63" }), s("circle", { cx: 152, cy: 100, r: 1.4, fill: "#2d3047" }),
        ...[118, 132, 150, 162].map(x => s("rect", { x, y: 124, width: 6, height: 9, rx: 2, fill: "#f4a6b8", stroke: "#c9708a", "stroke-width": 1 })));
      z.x.forEach((_, i) => {
        const m = s("g", { "data-stueck": "muenze" }, s("ellipse", { cx: 214, cy: 128 - i * 6, rx: 12, ry: 4.5, fill: "#e9b300", stroke: "#b88a1f", "stroke-width": 1 }));
        svg.appendChild(vonOben(m, i * je, ruhig, 50, 0.35));
      });
    } else if (z.art === "stueck") {
      // Korb, die Äpfel jeder Spalte fallen hinein
      // die Äpfel schauen über den Rand: zählbar wie im Spiel
      const platz = k => [160 - ((Math.min(letzte, 4) - 1) * 14) / 2 + (k % 4) * 14, 100 - Math.floor(k / 4) * 12];
      let k = 0;
      z.x.forEach((x, i) => {
        for (; k < x; k++) {
          const [ax, ay] = platz(k), a = apfel(ax, ay);
          a.setAttribute("data-stueck", "apfel");
          svg.appendChild(vonOben(a, i * je + (k - (i ? z.x[i - 1] : 0)) * 0.08, ruhig, 50, 0.35));
        }
      });
      svg.append(s("path", { d: "M118,104 L202,104 L192,134 L128,134 Z", fill: "#c58b4c", stroke: "#7a4f26", "stroke-width": 1.4 }),
        s("path", { d: "M124,114 h72 M127,124 h66", stroke: "#7a4f26", "stroke-width": 0.8 }),
        s("path", { d: "M126,104 Q160,66 194,104", stroke: "#7a4f26", "stroke-width": 2.4, fill: "none" }));
    } else {
      // Waage: das Säckchen wächst mit der Menge der Spalten
      svg.append(s("rect", { x: 120, y: 130, width: 80, height: 6, rx: 2, fill: "#6b7089" }), s("rect", { x: 156, y: 122, width: 8, height: 8, fill: "#6b7089" }),
        s("rect", { x: 128, y: 118, width: 64, height: 4, rx: 2, fill: "#8a94a6" }));
      const sack = s("g", {}, saeckchen());
      const masse = z.x.map(x => (0.35 + (0.65 * x) / letzte).toFixed(3));
      if (ruhig) sack.setAttribute("transform", "scale(1)");
      else {
        sack.setAttribute("transform", `scale(${masse[0]})`);
        sack.appendChild(s("animateTransform", { attributeName: "transform", type: "scale", values: masse.map(m => `${m} ${m}`).join(";"),
          keyTimes: masse.map((_, i) => (n > 1 ? i / (n - 1) : 0).toFixed(3)).join(";"), begin: t(0), dur: `${(n - 1) * je + 0.01}s`, fill: "freeze" }));
      }
      svg.appendChild(s("g", { transform: "translate(160 118)" }, sack));
    }
    if (sterne >= 2) svg.appendChild(glanz(x0 + ib + n * cw + 4, ys[0], ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 34, 100, ruhig));
    return svg;
  }

  // ----- Finger-Zähler (SAMMELN · haende) -----
  // Hand wie im Spiel: linke Hand von hinten (Daumen rechts), die rechte gespiegelt; 160 × 170 Einheiten je Hand.
  const FINGER_LAGE = { 4: [14, 44], 3: [37, 58], 2: [60, 64], 1: [83, 58] };
  const HAUT = { fill: "#f9d3b0", stroke: "#a8714a", "stroke-width": 3 }, HAUT_ZU = { fill: "#efbf96", stroke: "#a8714a", "stroke-width": 3 };
  /** Finger f (0 Daumen … 4 kleiner Finger), offen oder eingeklappt; geist: nur der gestrichelte Umriss des offenen. */
  function finger(f, offen, geist = false) {
    const art = geist ? { fill: "none", style: "stroke:var(--knopf)", "stroke-width": 3, "stroke-dasharray": "6 5" } : offen ? HAUT : HAUT_ZU;
    if (f === 0) return offen || geist ? s("rect", { x: 104, y: 86, width: 22, height: 56, rx: 11, transform: "rotate(25 112 140)", ...art })
      : s("rect", { x: 46, y: 112, width: 64, height: 24, rx: 12, ...art });
    const [x, l] = FINGER_LAGE[f];
    return offen || geist ? s("rect", { x, y: 92 - l, width: 22, height: l + 10, rx: 11, ...art }) : s("rect", { x, y: 76, width: 22, height: 26, rx: 11, ...art });
  }
  /**
   * Die Finger strecken sich ab dem Daumen, wie Kinder in der Schweiz zählen (die zweite Hand beginnt wieder beim
   * Daumen); dann steht die Zahl darunter. vergleich: daneben Würfelbild und Zehnerfeld mit gleich vielen (Stufe 4);
   * rest: die fehlenden Finger bis 10 als gestrichelter Umriss, darunter n + Rest = 10 (Kraft der Fünf, Stufe 5); blitz:
   * die Hände sind kurz zu sehen, dann zugedeckt, am Schluss wieder offen mit der Zahl (Stufe 6).
   */
  function haende(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    const n = z?.n;
    if (!Number.isInteger(n) || n < 1 || n > 10 || (z.vergleich && !WUERFELBILD[n]) || (z.rest && n >= 10)) return null;
    // so gross wie möglich; mit Würfel und Zehnerfeld daneben (vergleich) kleiner
    const zwei = n > 5 || z.rest || z.blitz || z.vergleich, k = z.vergleich ? 0.5 : 0.62, breite = (zwei ? 2 : 1) * 160 * k;
    const hx = z.vergleich ? 12 : (BREITE - breite) / 2, hy = z.vergleich ? 10 : 6;
    const svg = neuesBild("sammeln", n, { "data-bilder": "haende", "data-anzahl": n });
    svg.appendChild(tagGrund());
    const flaeche = s("g", { transform: `translate(${hx} ${hy}) scale(${k})` });
    const offen = [Math.min(5, n), Math.max(0, n - 5)]; // je Hand so viele Finger, ab dem Daumen
    const je = (DAUER * 0.7) / n;
    for (let h = 0; h < (zwei ? 2 : 1); h++) {
      const hand = s("g", h === 1 ? { transform: "translate(320 0) scale(-1 1)" } : {});
      hand.appendChild(s("rect", { x: 12, y: 86, width: 96, height: 74, rx: 28, ...HAUT }));
      // gezeichnet wie im Spiel: kleiner Finger bis Zeigefinger, dann der Daumen obenauf
      for (const f of [4, 3, 2, 1, 0]) {
        if (f >= offen[h]) {
          hand.appendChild(finger(f, false));
          if (z.rest) hand.appendChild(erscheine(finger(f, false, true), DAUER * 0.8, ruhig));
          continue;
        }
        const auf = finger(f, true);
        auf.setAttribute("data-stueck", "finger");
        if (ruhig || z.blitz) { hand.appendChild(auf); continue; }
        const ab = (h * 5 + f) * je; // gezählt: Daumen zuerst, die zweite Hand nach der ersten
        hand.append(verschwinde(finger(f, false), ab + 0.1, ruhig, 0.12), erscheine(auf, ab, ruhig, 0.15));
      }
      flaeche.appendChild(hand);
    }
    svg.appendChild(flaeche);
    const mx = hx + breite / 2;
    if (z.blitz) {
      // kurz zu sehen (wie im Spiel 1,5 s), dann zugedeckt; am Schluss wieder offen
      if (!ruhig) {
        flaeche.setAttribute("opacity", "0");
        flaeche.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(0.15), fill: "freeze" }));
      }
      // Decke mit Streifen wie im Spiel (.fz-feld.verdeckt)
      const dx = hx - 6, dy = hy - 4, db = breite + 12, dh = 170 * k + 8;
      const decke = s("g", {}, s("clipPath", { id: "feier-decke" }, s("rect", { x: dx, y: dy, width: db, height: dh, rx: 10 })),
        s("rect", { x: dx, y: dy, width: db, height: dh, rx: 10, fill: "#f7f8fd" }),
        s("path", { d: Array.from({ length: Math.ceil((db + dh) / 17) }, (_, i) => `M${dx + i * 17 - dh},${dy + dh} l${dh},${-dh}`).join(" "),
          stroke: "#eef0fa", "stroke-width": 8, "clip-path": "url(#feier-decke)" }));
      svg.appendChild(kurz(decke, 1.2, DAUER * 0.8, ruhig));
    }
    if (z.vergleich) {
      // gleich viele: Würfelbild und Zehnerfeld daneben
      const wx = 196, wy = 26, g = 44;
      const vgl = s("g", {}, text(184, 58, "=", { gross: 18 }),
        s("rect", { x: wx, y: wy, width: g, height: g, rx: 8, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 2.4 }),
        ...WUERFELBILD[n].map(i => s("circle", { cx: wx + 10 + (i % 3) * 12, cy: wy + 10 + Math.floor(i / 3) * 12, r: 4, fill: "#2d3047" })),
        text(250, 58, "=", { gross: 18 }),
        s("rect", { x: 260, y: 34, width: 54, height: 26, rx: 4, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.6 }),
        ...Array.from({ length: 10 }, (_, i) => s("circle", { cx: 266 + (i % 5) * 10.5, cy: 41 + Math.floor(i / 5) * 12, r: 4,
          ...(i < n ? { style: "fill:var(--deko-6)" } : { fill: "none", stroke: "#c9cde0", "stroke-width": 1 }) })));
      svg.appendChild(erscheine(vgl, DAUER * 0.75, ruhig));
    }
    svg.appendChild(erscheine(text(mx, z.vergleich ? 134 : 141, z.rest ? `${n} + ${10 - n} = 10` : ganzText(n), { gross: z.rest ? 17 : 20 }), DAUER * (z.blitz ? 0.85 : 0.8), ruhig));
    if (sterne >= 2) svg.appendChild(glanz(Math.min(hx + breite + 8, BREITE - 12), 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(z.vergleich ? 286 : 34, z.vergleich ? 108 : 30, ruhig));
    return svg;
  }

  // ----- Stimmt immer? (BAUEN · beweis) -----
  const stein = (x, y, farbe, r = 6.5) => s("circle", { cx: x, cy: y, r, style: `fill:${farbe}`, stroke: "#2d3047", "stroke-opacity": 0.3, "stroke-width": 1 });
  /** Kreissektor um cx, cy von Winkel a1 bis a2 (Grad, gegen den Uhrzeigersinn wie in der Mathematik). */
  function sektor(cx, cy, r, a1, a2, farbe) {
    const p = a => [cx + r * Math.cos((a * Math.PI) / 180), cy - r * Math.sin((a * Math.PI) / 180)];
    const [x1, y1] = p(a1), [x2, y2] = p(a2);
    return s("path", { d: `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${a2 - a1 > 180 ? 1 : 0},0 ${x2.toFixed(2)},${y2.toFixed(2)} Z`,
      style: `fill:${farbe}`, "fill-opacity": 0.85 });
  }
  /** Richtung von a nach b als Winkel in Grad (0 = rechts, gegen den Uhrzeigersinn, 0 … 360). */
  const richtung = ([ax, ay], [bx, by]) => ((Math.atan2(ay - by, bx - ax) * 180) / Math.PI + 360) % 360;
  /**
   * „Stimmt immer?“ übt Begründen; das Bild zeigt je Stufe eine Begründung aus dem Spiel, mit Steinen und Figuren wie dort:
   * paare (s1, zwei ungerade Zahlen: die beiden übrigen Steine bilden ein Paar), gruppen (s2, ein Vielfaches von 6 ist eines
   * von 3), verdoppeln (s3, 4 · 6 = 2 · 12), ausgleich (s4, drei aufeinanderfolgende Zahlen), quadrat (s5, doppelte Seite →
   * vierfache Fläche), winkel (s6, die drei Winkel eines Dreiecks ergeben zusammen eine Gerade: 180°).
   */
  function beweis(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !z.art) return null;
    const svg = neuesBild("bauen", z.art, { "data-bilder": "beweis" });
    svg.appendChild(tagGrund());
    const A = "var(--deko-6)", Bf = "var(--deko-3)", C = "var(--deko-2)";
    let unten = null;
    if (z.art === "paare") {
      if (!(z.a % 2 && z.b % 2)) return null;
      const lage = (x0, i) => [x0 + Math.floor(i / 2) * 20, 54 + (i % 2) * 20];
      const gruppe = (x0, anzahl, farbe) => Array.from({ length: anzahl }, (_, i) => stein(...lage(x0, i), farbe, 8));
      const xa = 64, xb = 190;
      gruppe(xa, z.a, A).forEach((e, i) => svg.appendChild(erscheine(e, i * 0.08, ruhig, 0.15)));
      const steineB = gruppe(xb, z.b, Bf);
      steineB.forEach((e, i) => { if (i < z.b - 1) svg.appendChild(erscheine(e, 0.3 + i * 0.08, ruhig, 0.15)); });
      // die beiden übrigen Steine: Ring, dann wandert der von B zu dem von A — ein Paar
      const [ax, ay] = lage(xa, z.a - 1), [bx, by] = lage(xb, z.b - 1);
      // die Ringe zeigen die beiden übrigen Steine, bis sie ein Paar sind
      svg.appendChild(kurz(s("g", { fill: "none", stroke: "#f5b301", "stroke-width": 1.6 }, s("circle", { cx: ax, cy: ay, r: 12 }), s("circle", { cx: bx, cy: by, r: 12 })), 0.8, 1.3, ruhig));
      svg.appendChild(erscheine(schiebe(s("g", {}, steineB[z.b - 1]), ax - bx, ay + 20 - by, 1.3, ruhig, { dauer: 0.8, bogen: 30 }), 0.3 + (z.b - 1) * 0.08, ruhig, 0.15));
      unten = `${z.a} + ${z.b} = ${z.a + z.b}`;
    } else if (z.art === "gruppen") {
      if (!(z.zahl % z.gross === 0 && z.gross % z.klein === 0)) return null;
      const xs = Array.from({ length: z.zahl }, (_, i) => 160 - ((z.zahl - 1) * 18) / 2 + i * 18), y = 68;
      xs.forEach((x, i) => svg.appendChild(erscheine(stein(x, y, A), i * 0.05, ruhig, 0.15)));
      const rahmen = (von, anzahl, innen, farbe, ab) => svg.appendChild(erscheine(s("rect", { x: xs[von] - (innen ? 8 : 11), y: y - (innen ? 10 : 15), width: (anzahl - 1) * 18 + (innen ? 16 : 22),
        height: innen ? 20 : 30, rx: 7, fill: "none", style: `stroke:${farbe}`, "stroke-width": innen ? 1.6 : 2, ...(innen ? { "stroke-dasharray": "3 2" } : {}) }), ab, ruhig));
      for (let i = 0; i < z.zahl / z.gross; i++) rahmen(i * z.gross, z.gross, false, Bf, 0.8 + i * 0.15);
      for (let i = 0; i < z.zahl / z.klein; i++) rahmen(i * z.klein, z.klein, true, C, 1.5 + i * 0.12);
      unten = `${z.zahl} = ${z.zahl / z.gross} · ${z.gross} = ${z.zahl / z.klein} · ${z.klein}`;
    } else if (z.art === "verdoppeln") {
      if (!(z.zeilen % 2 === 0 && z.spalten > 0)) return null;
      const d = 12, x0 = 160 - z.spalten * d + d / 2, y0 = 40, halb = z.zeilen / 2;
      for (let r = 0; r < z.zeilen; r++) {
        const reihe = s("g", {});
        for (let c = 0; c < z.spalten; c++) reihe.appendChild(s("circle", { cx: x0 + c * d, cy: y0 + r * d, r: 4.5, style: `fill:${r < halb ? Bf : A}` }));
        // die obere Hälfte rutscht neben die untere: halb so hoch, doppelt so lang
        svg.appendChild(erscheine(r < halb ? schiebe(reihe, z.spalten * d, halb * d, 1.0, ruhig, { dauer: 0.9 }) : reihe, r * 0.12, ruhig, 0.2));
      }
      unten = `${z.zeilen} · ${z.spalten} = ${halb} · ${2 * z.spalten}`;
    } else if (z.art === "ausgleich") {
      const [a, b, c] = z.zahlen || [];
      if (!(Number.isInteger(a) && b === a + 1 && c === a + 2 && c <= 7)) return null;
      const xs = [110, 160, 210], boden0 = 116, h = 13;
      svg.appendChild(s("rect", { x: 88, y: boden0 + 1, width: 144, height: 3, rx: 1.5, fill: "#8a8fa8" }));
      [a, b, c].forEach((anzahl, t0) => {
        for (let j = 0; j < anzahl; j++) {
          const e = s("rect", { x: xs[t0] - 9, y: boden0 - (j + 1) * h + 1, width: 18, height: h - 2, rx: 3, style: `fill:${[A, Bf, C][t0]}` });
          // der oberste Stein des höchsten Turms wandert auf den niedrigsten: alle gleich hoch
          svg.appendChild(erscheine(t0 === 2 && j === c - 1 ? schiebe(s("g", {}, e), xs[0] - xs[2], h, 1.1, ruhig, { dauer: 0.9, bogen: 26 }) : e, (t0 * 3 + j) * 0.04, ruhig, 0.15));
        }
      });
      unten = `${a} + ${b} + ${c} = 3 · ${b}`;
    } else if (z.art === "quadrat") {
      // Seite 1 → Seite 2: vier kleine Quadrate füllen das grosse, die Fläche wird viermal so gross
      const kq = 28;
      svg.appendChild(erscheine(s("rect", { x: 50, y: 58, width: kq, height: kq, style: `fill:${A}`, stroke: "#2d3047", "stroke-width": 1 }), 0, ruhig));
      svg.appendChild(text(64, 102, "1", { gross: 11 }));
      svg.appendChild(erscheine(s("path", { d: "M92,72 h40 m-6,-5 l6,5 l-6,5", stroke: "#6b7089", "stroke-width": 1.6, fill: "none" }), 0.3, ruhig));
      const gx = 160, gy = 30;
      svg.appendChild(erscheine(s("rect", { x: gx, y: gy, width: 2 * kq, height: 2 * kq, fill: "none", stroke: "#2d3047", "stroke-width": 1.4 }), 0.5, ruhig));
      svg.appendChild(erscheine(text(gx + kq, gy + 2 * kq + 16, "2", { gross: 11 }), 0.5, ruhig));
      [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j], k) => {
        const q = s("rect", { x: gx + i * kq, y: gy + j * kq, width: kq, height: kq, style: `fill:${A}`, stroke: "#2d3047", "stroke-width": 1, "data-stueck": "quadrat" });
        svg.appendChild(vonOben(q, 0.8 + k * 0.3, ruhig, 40, 0.3));
      });
      svg.setAttribute("data-anzahl", 4);
      unten = "2 · 2 = 4";
    } else if (z.art === "winkel") {
      // Dreieck; seine drei Winkel wandern an einen Punkt auf der Geraden und füllen dort den gestreckten Winkel
      const P = { a: [36, 118], b: [150, 118], c: [76, 32] }, Q = [244, 108], r = 22;
      svg.appendChild(s("path", { d: `M${P.a} L${P.b} L${P.c} Z`, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 1.6 }));
      const ecken = [["a", "b", "c"], ["b", "c", "a"], ["c", "a", "b"]].map(([e, n1, n2]) => {
        let s1 = richtung(P[e], P[n1]), s2 = richtung(P[e], P[n2]);
        let [von, bis] = [s1, s2].sort((x, y) => x - y);
        if (bis - von > 180) [von, bis] = [bis, von + 360];
        return { e, von, gross: bis - von };
      });
      const summe = ecken.reduce((a, q) => a + q.gross, 0);
      if (Math.abs(summe - 180) > 0.01) return null;
      svg.appendChild(s("path", { d: `M174,${Q[1]} H310`, stroke: "#2d3047", "stroke-width": 1.6 }));
      // an der Geraden: β rechts, γ in der Mitte, α links — wie die Ecken im Dreieck liegen
      const folge = { b: 0, c: ecken.find(q => q.e === "b").gross, a: 180 - ecken.find(q => q.e === "a").gross };
      const farben = { a: A, b: Bf, c: C };
      ecken.forEach((q, i) => {
        svg.appendChild(sektor(...P[q.e], r, q.von, q.von + q.gross, farben[q.e]));
        const drehen = folge[q.e] - q.von; // um so viel dreht der Winkel auf dem Weg zur Geraden
        const innen = s("g", {}, sektor(...Q, r, folge[q.e], folge[q.e] + q.gross, farben[q.e]));
        const aussen = s("g", {}, innen);
        if (!ruhig) {
          innen.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `${drehen} ${Q[0]} ${Q[1]}`, to: `0 ${Q[0]} ${Q[1]}`, begin: t(0.5 + i * 0.45), dur: "0.7s", fill: "freeze" }));
          aussen.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: `${P[q.e][0] - Q[0]} ${P[q.e][1] - Q[1]}`, to: "0 0", begin: t(0.5 + i * 0.45), dur: "0.7s", fill: "freeze" }));
          aussen.setAttribute("opacity", "0");
          aussen.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(0.5 + i * 0.45), fill: "freeze" }));
        }
        svg.appendChild(aussen);
      });
      svg.setAttribute("data-winkelsumme", summe.toFixed(2));
      unten = "180°";
    } else return null;
    svg.appendChild(erscheine(zeileUnten(unten, 138), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 26, 22, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 24, ruhig));
    return svg;
  }

  BILDER.zoom = { strahl, radar };
  Object.assign(BILDER.reise, { velo, krokodil });
  Object.assign(BILDER.sammeln, { tafel, spuernase, blitz: punkteBlitz, korb, haende });
  Object.assign(BILDER.bauen, { kette, beweis });

  const MUSTER = {
    /** REISE (Konzept 5): je Stufe ein Ziel weiter. */
    reise(feier, opt) {
      // nur ein eigenes Bild der Reise: eine Stufe mit anderem Muster erbt sonst das bilder des Spiels (Himmels-Forscher s5)
      if (feier.bilder && BILDER.reise[feier.bilder]) return BILDER.reise[feier.bilder](feier, opt);
      const { stufe, sterne, ruhig } = opt;
      const ziel = feier.ziele?.[stufe];
      if (!ziel) return null;
      const figur = () => (REISENDE[feier.reisender] || rakete)(sterne >= 3);
      const svg = s("svg", { viewBox: `0 0 ${BREITE} ${HOEHE}`, "data-muster": "reise", "data-ziel": typeof ziel === "string" ? ziel : ziel.um ? `um-${ziel.um}` : "rand" },
        himmelGrund(), himmel());
      let endeX, endeY;
      if (typeof ziel === "object" && ziel.um) {
        // einmal um den Körper: Ellipse, Start und Ende oben
        const cx = 160, cy = 78;
        svg.appendChild(koerper(ziel.um, cx, cy, 30));
        const weg = `M${cx},${cy - 44} A64,44 0 1,1 ${cx - 0.1},${cy - 44}`;
        svg.appendChild(bewege(figur(), weg, { x: cx, y: cy - 44, winkel: 0 }, ruhig));
        endeX = cx; endeY = cy - 50;
      } else if (typeof ziel === "object" && ziel.rand) {
        // Sonne als heller Punkt links, die acht Planeten in ihrer Reihenfolge, Reisender fliegt hinaus
        svg.appendChild(sonne(10, 78, 5));
        // Reihenfolge von der Sonne aus; Grössen untereinander grob stimmig (Jupiter am grössten), nicht massstäblich
        const reihe = [["merkur", 24, 2], ["venus", 36, 3], ["erde", 50, 3.2], ["mars", 66, 2.4], ["jupiter", 108, 9], ["saturn", 152, 7], ["uranus", 198, 4.5], ["neptun", 238, 4.4]];
        for (const [n, x, r] of reihe) svg.appendChild(koerper(n, x, 78, r));
        svg.appendChild(bewege(figur(), "M50,64 C120,40 220,40 300,58", { x: 300, y: 58, winkel: 10 }, ruhig));
        endeX = 300; endeY = 50;
      } else {
        // von der Erde zum Ziel
        svg.appendChild(koerper("erde", 46, 104, 22));
        const zx = 262, zy = 56;
        svg.appendChild(koerper(ziel, zx, zy));
        const r = KOERPER[ziel].r;
        const ax = zx - r - (ziel === "saturn" ? 26 : 16);
        // Bogen nach oben, am Ende waagrecht (zweiter Stützpunkt auf der Höhe des Ziels): die Rakete kommt gerade an
        svg.appendChild(bewege(figur(), `M76,96 C110,24 ${ax - 70},${zy} ${ax},${zy}`, { x: ax, y: zy, winkel: 0 }, ruhig));
        endeX = zx; endeY = zy - r;
      }
      if (sterne >= 2) svg.appendChild(fahne(endeX + 4, endeY, ruhig));
      // Funken über dem Ziel, aber ganz im Bild (der Kreis hat 16 Einheiten Radius)
      if (sterne >= 3) svg.appendChild(funken(Math.min(endeX, BREITE - 20), Math.max(endeY - 8, 20), ruhig));
      return svg;
    },

    /** ZOOM (Konzept 6, Dezimal-Rakete): Landung auf dem Zahlenstrahl, je Stelle nach dem Komma eine Zeile tiefer. */
    zoom(feier, opt) {
      if (feier.bilder && BILDER.zoom?.[feier.bilder]) return BILDER.zoom[feier.bilder](feier, opt);
      const { stufe, sterne, ruhig } = opt;
      const wert = feier.ziele?.[stufe];
      if (typeof wert !== "number") return null;
      const stellen = feier.stellen?.[stufe] ?? ((String(wert).split(".")[1] || "").length);
      const svg = s("svg", { viewBox: `0 0 ${BREITE} ${HOEHE}`, "data-muster": "zoom", "data-ziel": String(wert) }, himmelGrund());
      // die unterste Zeile (dort landet die Rakete) steht immer unten, damit die Rakete von oben Platz hat; die oberen
      // Zeilen verteilen sich darüber
      const links = 30, rechts = 290, oben = 26, unten = HOEHE - 26;
      const abstand = stellen ? (unten - oben) / stellen : 0;
      const zeileY = k => unten - (stellen - k) * abstand;
      let von = 0, schritt = 1; // Zeile 0: 0 bis 10 in Einern
      let landeX = links;
      for (let k = 0; k <= stellen; k++) {
        const y = zeileY(k), bis = von + 10 * schritt;
        const zeile = s("g", { "data-zeile": k });
        zeile.appendChild(s("line", { x1: links, y1: y, x2: rechts, y2: y, stroke: "#e8e9f5", "stroke-width": 1.4 }));
        for (let i = 0; i <= 10; i++) {
          const x = links + (i / 10) * (rechts - links);
          zeile.appendChild(s("line", { x1: x, y1: y - (i % 5 ? 3 : 5), x2: x, y2: y + (i % 5 ? 3 : 5), stroke: "#e8e9f5", "stroke-width": 1 }));
        }
        const schrift = { fill: "#e8e9f5", "font-size": 9, "font-family": "system-ui, sans-serif", "text-anchor": "middle" };
        zeile.appendChild(s("text", { x: links, y: y + 15, ...schrift }, zahlText(von, k)));
        zeile.appendChild(s("text", { x: rechts, y: y + 15, ...schrift }, zahlText(bis, k)));
        const pos = x => links + ((x - von) / (bis - von)) * (rechts - links);
        if (k < stellen) {
          // der Abschnitt, in dem die Zahl liegt, wird in der nächsten Zeile vergrössert (Lupe)
          const a = von + Math.floor((wert - von) / schritt + 1e-9) * schritt;
          const xa = pos(a), xb = pos(a + schritt);
          zeile.appendChild(s("rect", { x: xa, y: y - 4, width: xb - xa, height: 8, fill: "#f5b301", opacity: 0.5 }));
          zeile.appendChild(s("path", { d: `M${xa},${y + 4} L${links},${zeileY(k + 1) - 6} M${xb},${y + 4} L${rechts},${zeileY(k + 1) - 6}`,
            stroke: "#f5b301", "stroke-width": 0.8, "stroke-dasharray": "3 2", fill: "none" }));
          von = a; schritt /= 10;
        } else {
          landeX = pos(wert);
          zeile.appendChild(s("circle", { cx: landeX, cy: y, r: 3.2, fill: "#2fb36b", "data-landung": String(wert) }));
          // die Zahl unter der Linie: darüber setzt die Rakete auf
          zeile.appendChild(s("text", { x: landeX, y: y + 17, ...schrift, "font-size": 11, "font-weight": "bold", fill: "#ffffff" }, zahlText(wert, stellen)));
        }
        svg.appendChild(erscheine(zeile, (k / (stellen + 1)) * DAUER * 0.8, ruhig));
      }
      // Rakete senkrecht nach unten auf den Landeplatz (Spitze auf der Linie); mit figur "kaefer" (Zehntel-Lupe) fliegt
      // ein Marienkäfer im Bogen herab und setzt sich auf den Punkt
      let landeY = zeileY(stellen) - 24;
      if (feier.figur === "kaefer") {
        landeY = zeileY(stellen) - 6;
        svg.appendChild(bewege(marienkaefer(), `M${BREITE + 10},10 C${landeX + 80},0 ${landeX + 30},${landeY - 40} ${landeX},${landeY}`,
          { x: landeX, y: landeY, winkel: 0 }, ruhig, { drehen: false }));
      } else svg.appendChild(bewege(rakete(sterne >= 3), `M${landeX},-30 L${landeX},${landeY}`, { x: landeX, y: landeY, winkel: 90 }, ruhig));
      if (sterne >= 2) svg.appendChild(fahne(Math.min(landeX + 14, BREITE - 16), zeileY(stellen) - 2, ruhig));
      if (sterne >= 3) svg.appendChild(funken(Math.min(Math.max(landeX, 24), BREITE - 24), Math.max(landeY - 4, 20), ruhig));
      return svg;
    },

    /** ZYKLUS (Konzept 5): die Phasen der Reihe nach bis zur Phase der Stufe; die letzte gross. */
    zyklus(feier, { stufe, sterne, ruhig }) {
      const phasen = feier.ziele?.[stufe];
      if (feier.bilder !== "mond") return null;
      // eine Phase allein: der Mond dieser Phase steigt hinter dem Hügel auf und zieht im Bogen über den Himmel
      // (Rückmeldung Patrik: Stufe um Stufe zunehmend, wie die Sonde in Stufe 5)
      if (typeof phasen === "string" && phasen in MONDPHASEN) {
        const hell = MONDPHASEN[phasen], r = 20;
        const svg = s("svg", { viewBox: `0 0 ${BREITE} ${HOEHE}`, "data-muster": "zyklus", "data-ziel": phasen }, himmelGrund(), himmel());
        const mond = s("g", { "data-phase": phasen });
        if (hell) mond.appendChild(s("circle", { cx: 0, cy: 0, r: r + 8, fill: "#f4ecc8", opacity: 0.08 + 0.1 * hell }));
        mond.appendChild(mondphase(0, 0, r, hell));
        if (phasen === "neu") mond.appendChild(sonne(-r - 14, -r - 2, 6)); // Neumond steht bei der Sonne
        svg.appendChild(bewege(mond, "M20,150 C60,40 170,22 232,54", { x: 232, y: 54, winkel: 0 }, ruhig, { drehen: false }));
        svg.appendChild(s("path", { d: `M0,${HOEHE} L0,124 C60,108 120,130 180,118 C240,106 280,122 ${BREITE},112 L${BREITE},${HOEHE} Z`, fill: "#10132a" }));
        if (sterne >= 2) svg.appendChild(funkeln(ruhig));
        if (sterne >= 3) svg.appendChild(sternschnuppe(ruhig));
        return svg;
      }
      if (!Array.isArray(phasen) || !phasen.length) return null;
      const svg = s("svg", { viewBox: `0 0 ${BREITE} ${HOEHE}`, "data-muster": "zyklus", "data-ziel": phasen[phasen.length - 1] }, himmelGrund(), himmel());
      // kleine Phasen in gleichem Abstand, die letzte gross; die ganze Reihe mittig
      const n = phasen.length, klein = 13, gross = 26, abstand = 46;
      const xs = phasen.map((_, i) => (i < n - 1 ? i * abstand : (n - 1) * abstand + (n > 1 ? gross - klein : 0)));
      const links = -(n > 1 ? klein : gross), rechts = xs[n - 1] + gross;
      const verschiebung = (BREITE - (rechts - links)) / 2 - links;
      phasen.forEach((p, i) => {
        const letzte = i === n - 1, r = letzte ? gross : klein, y = letzte ? 74 : 80, x = xs[i] + verschiebung;
        const g = s("g", { "data-phase": p });
        if (letzte) g.appendChild(s("circle", { cx: x, cy: y, r: r + 8, fill: "#f4ecc8", opacity: MONDPHASEN[p] ? 0.12 : 0.05 }));
        g.appendChild(mondphase(x, y, r, MONDPHASEN[p]));
        if (p === "neu") g.appendChild(sonne(x - r - 10, y - r - 4, 4)); // Neumond steht bei der Sonne
        if (i < n - 1) g.appendChild(s("path", { d: `M${x + r + 6},${y} l8,0 m-3,-3 l3,3 l-3,3`, stroke: "#9aa0c4", "stroke-width": 1.2, fill: "none" }));
        svg.appendChild(erscheine(g, (i / n) * DAUER, ruhig, 0.4));
      });
      if (sterne >= 2) svg.appendChild(funkeln(ruhig));
      if (sterne >= 3) svg.appendChild(sternschnuppe(ruhig));
      return svg;
    },

    /** SZENE: ein festes Bild mit Bewegung (Himmels-Forscher s6). */
    szene(feier, { stufe, sterne, ruhig }) {
      const art = feier.ziele?.[stufe] ?? feier.szene;
      if (art !== "eule-vollmond") return null;
      // Vollmond über einer Hügelkante, die Eule fliegt als Silhouette davor (eigenes Bild, Regel 5)
      const svg = s("svg", { viewBox: `0 0 ${BREITE} ${HOEHE}`, "data-muster": "szene", "data-ziel": art }, himmelGrund(), himmel(),
        s("circle", { cx: 200, cy: 66, r: 52, fill: "#f4ecc8", opacity: 0.15 }),
        s("circle", { cx: 200, cy: 66, r: 40, fill: "#f4ecc8" }),
        s("path", { d: `M0,${HOEHE} L0,118 C60,100 110,124 170,112 C230,100 270,116 ${BREITE},106 L${BREITE},${HOEHE} Z`, fill: "#10132a" }));
      svg.appendChild(bewege(euleSilhouette(), "M-20,40 C60,70 130,40 200,64", { x: 200, y: 64, winkel: 0 }, ruhig, { drehen: false }));
      if (sterne >= 2) svg.appendChild(funkeln(ruhig));
      if (sterne >= 3) svg.appendChild(sternschnuppe(ruhig));
      return svg;
    },

    /** WACHSEN (Konzept 5, Wortfamilien-Baum): der Baum wächst Teil um Teil bis zum Teil der Stufe. */
    wachsen(feier, { stufe, sterne, ruhig }) {
      const ziel = feier.ziele?.[stufe], bis = BAUM_TEILE.indexOf(ziel);
      if (feier.bilder !== "baum" || bis < 0) return null;
      const teile = BAUM_TEILE.slice(0, bis + 1);
      // Ebenen: Laub hinter dem Holz (die Kärtchen bleiben sichtbar), Blüten, Früchte und Eule davor
      const ebenen = { laub: s("g", { "data-ebene": "laub" }), holz: s("g", { "data-ebene": "holz" }), vorn: s("g", { "data-ebene": "vorn" }) };
      const svg = s("svg", { viewBox: `0 0 ${BREITE} ${HOEHE}`, "data-muster": "wachsen", "data-ziel": ziel }, tagGrund(), boden(),
        ebenen.laub, ebenen.holz, ebenen.vorn);
      const je = DAUER / teile.length;
      teile.forEach((teil, i) => BAUM[teil](ebenen, i * je, je, ruhig));
      if (sterne >= 2) svg.appendChild(schmetterling(teile.length > 3 ? 240 : 206, teile.length > 3 ? 40 : 56, ruhig));
      if (sterne >= 3) svg.appendChild(vogelSingt(234, 132, ruhig));
      return svg;
    },

    /** BAUEN (Konzept 5, Zahlenmauer-Baumeister): die Mauer der Stufe, Stein um Stein von unten. */
    bauen(feier, opt) {
      if (feier.bilder !== "mauer") return BILDER.bauen[feier.bilder]?.(feier, opt) ?? null;
      const { stufe, sterne, ruhig } = opt;
      const grund = feier.ziele?.[stufe];
      if (feier.bilder !== "mauer" || !Array.isArray(grund) || grund.length < 2) return null;
      const n = grund.length, w = [grund.slice()];
      // wie im Spiel: w[r][i] = w[r-1][i] + w[r-1][i+1]
      for (let r = 1; r < n; r++) w.push(w[r - 1].slice(0, -1).map((x, i) => x + w[r - 1][i + 1]));
      const svg = s("svg", { viewBox: `0 0 ${BREITE} ${HOEHE}`, "data-muster": "bauen", "data-ziel": "mauer" }, tagGrund(), boden());
      const sb = Math.min(56, 270 / n), sh = n >= 5 ? 19 : 22, unten = 134, alle = (n * (n + 1)) / 2;
      let k = 0;
      w.forEach((reihe, r) => reihe.forEach((wert, i) => {
        const x = BREITE / 2 - (reihe.length * sb) / 2 + i * sb, y = unten - (r + 1) * sh;
        const stein = s("g", { "data-stein": `${r},${i}`, "data-wert": wert },
          s("rect", { x: x + 1, y: y + 1, width: sb - 2, height: sh - 2, rx: 3, fill: "#ecd3a4", stroke: "#a9773f", "stroke-width": 1 }),
          s("text", { x: x + sb / 2, y: y + sh / 2 + 4, fill: "#3b2a18", "font-size": n >= 5 ? 10 : 11, "font-weight": "bold",
            "font-family": "system-ui, sans-serif", "text-anchor": "middle" }, ganzText(wert)));
        svg.appendChild(falle(stein, (k++ / alle) * DAUER, ruhig));
      }));
      const oben = unten - n * sh;
      if (sterne >= 2) {
        const eule = euleSitzend(0.24);
        eule.setAttribute("data-schmuck", "2");
        eule.setAttribute("transform", `translate(${BREITE / 2 - 8} ${oben})`);
        svg.appendChild(erscheine(eule, DAUER, ruhig));
      }
      if (sterne >= 3) {
        svg.appendChild(fahne(BREITE / 2 + 10, oben, ruhig, "3"));
        svg.appendChild(funken(BREITE / 2, Math.max(oben - 14, 18), ruhig));
      }
      return svg;
    },

    /** AUFTRITT (Konzept 5, Instrumenten-Kenner): Solo, Duo, Trio, Quartett, Quintett, Orchester. */
    auftritt(feier, { stufe, sterne, ruhig, klang, plane }) {
      const ziel = feier.ziele?.[stufe];
      if (feier.bilder !== "musik" || !(ziel === "orchester" || (Number.isInteger(ziel) && ziel >= 1 && ziel <= BESETZUNG.length))) return null;
      const vorne = ziel === "orchester" ? BESETZUNG : BESETZUNG.slice(0, ziel);
      const hinten = ziel === "orchester" ? ["geige", "geige", "cello", "geige", "geige", "cello"] : [];
      const svg = s("svg", { viewBox: `0 0 ${BREITE} ${HOEHE}`, "data-muster": "auftritt", "data-ziel": String(ziel),
        "data-anzahl": vorne.length + hinten.length },
        s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#3a1f3d" }),
        // Vorhang links und rechts, Bühnenboden aus Holz
        s("path", { d: "M14,0 L40,0 C34,50 44,100 30,132 L0,132 L0,14 Q0,0 14,0 Z", fill: "#8c2f4b" }),
        s("path", { d: `M${BREITE - 14},0 L${BREITE - 40},0 C${BREITE - 34},50 ${BREITE - 44},100 ${BREITE - 30},132 L${BREITE},132 L${BREITE},14 Q${BREITE},0 ${BREITE - 14},0 Z`, fill: "#8c2f4b" }),
        s("path", { d: `M0,128 L${BREITE},128 L${BREITE},136 Q${BREITE},${HOEHE} ${BREITE - 14},${HOEHE} L14,${HOEHE} Q0,${HOEHE} 0,136 Z`, fill: "#b07a45" }));
      if (sterne >= 2) {
        // Scheinwerfer von oben (Schmuck ab 2 Sternen)
        const licht = s("g", { "data-schmuck": "2", fill: "#fff6c8", opacity: 0.16 },
          s("path", { d: "M90,0 L104,0 L170,128 L100,128 Z" }), s("path", { d: "M216,0 L230,0 L220,128 L150,128 Z" }));
        svg.appendChild(erscheine(licht, DAUER, ruhig, 0.5));
      }
      // vorne die Besetzung der Stufe (Abstand so, dass die Querflöte die Nachbarin nicht berührt), im Orchester
      // dahinter die Streicher, kleiner
      const alle = [...hinten.map((i, n) => ({ i, x: 84 + n * 30, y: 86, k: 0.42 })),
        ...vorne.map((i, n) => ({ i, x: BREITE / 2 + (n - (vorne.length - 1) / 2) * 56, y: 128, k: 0.6 }))];
      const je = DAUER / alle.length;
      alle.forEach(({ i, x, y, k }, n) => {
        const m = musikerin(i, x, y, k);
        // tritt auf: erscheint mit einem kleinen Hüpfer; bei 3 Sternen verbeugen sich alle am Schluss
        const innen = s("g", {}, m);
        if (!ruhig) {
          innen.setAttribute("opacity", "0");
          innen.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(n * je), fill: "freeze" }));
          innen.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", values: "0 -10;0 0", begin: t(n * je), dur: "0.3s", fill: "freeze" }));
          if (sterne >= 3) innen.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", values: "0 0;0 3;0 0",
            begin: t(DAUER + 0.2), dur: "0.6s", additive: "sum", fill: "freeze" }));
        }
        svg.appendChild(innen);
        // Ton nur mit Ton an: klang ist der Ton des Rahmens, der den Schalter 🔇 beachtet
        if (klang && plane) plane(START + (ruhig ? 0 : n * je), () => klang([[NOTEN[n % NOTEN.length], 0.18]]));
      });
      if (sterne >= 3) svg.appendChild(funken(BREITE / 2, ziel === "orchester" ? 26 : 50, ruhig));
      return svg;
    },

    /** SAMMELN (Konzept 5, Anlaut-Angel): die Eule angelt Fisch um Fisch in den Eimer. */
    sammeln(feier, opt) {
      if (feier.bilder !== "angel") return BILDER.sammeln[feier.bilder]?.(feier, opt) ?? null;
      const { stufe, sterne, ruhig } = opt;
      const zahl = feier.ziele?.[stufe];
      if (feier.bilder !== "angel" || !Number.isInteger(zahl) || zahl < 1 || zahl > FISCHFARBEN.length) return null;
      const svg = s("svg", { viewBox: `0 0 ${BREITE} ${HOEHE}`, "data-muster": "sammeln", "data-ziel": String(zahl), "data-anzahl": zahl },
        tagGrund(),
        s("path", { d: `M0,104 L${BREITE},104 L${BREITE},136 Q${BREITE},${HOEHE} ${BREITE - 14},${HOEHE} L14,${HOEHE} Q0,${HOEHE} 0,136 Z`, fill: "#5aa9dc" }),
        s("path", { d: "M10,116 q10,-4 20,0 M60,126 q10,-4 20,0 M200,122 q10,-4 20,0 M270,114 q10,-4 20,0", stroke: "#cfe9f8", "stroke-width": 1.2, fill: "none" }),
        // Steg mit Pfosten, die Eule sitzt vorne mit der Angel, der Eimer neben ihr
        s("rect", { x: 0, y: 92, width: 132, height: 7, fill: "#a8743f" }),
        s("rect", { x: 30, y: 99, width: 5, height: 26, fill: "#7a4f26" }), s("rect", { x: 110, y: 99, width: 5, height: 26, fill: "#7a4f26" }));
      const eule = euleSitzend(0.55);
      eule.setAttribute("transform", "translate(112 92)");
      svg.append(eule, s("path", { d: "M120,74 L196,30", stroke: "#6b4a2b", "stroke-width": 1.6, "stroke-linecap": "round" }),
        s("path", { d: "M196,30 L198,110", stroke: "#e8e9f5", "stroke-width": 0.6 }));
      // Eimer, breit genug für sechs Fische nebeneinander: die Kinder sollen sie zählen können
      const eimer = s("g", {}, s("path", { d: "M14,64 L78,64 L73,92 L19,92 Z", fill: "#8a94a6", stroke: "#4f5668", "stroke-width": 1.2 }),
        s("path", { d: "M14,64 Q46,40 78,64", stroke: "#4f5668", "stroke-width": 1.2, fill: "none" }));
      const imEimer = s("g", {});
      svg.append(imEimer, eimer);
      const je = DAUER / zahl;
      for (let n = 0; n < zahl; n++) {
        // springt aus dem Wasser an der Schnur und landet aufrecht im Eimer, der Kopf schaut über den Rand
        const f = fisch(FISCHFARBEN[n]);
        const platz = { x: 22 + n * 10, y: 55 };
        const g = s("g", { "data-stueck": "fisch" }, f);
        if (ruhig) {
          g.setAttribute("transform", `translate(${platz.x} ${platz.y}) rotate(-90)`);
        } else {
          g.setAttribute("opacity", "0");
          g.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(n * je), fill: "freeze" }));
          g.appendChild(s("animateMotion", { path: `M198,112 C190,20 90,10 ${platz.x},${platz.y}`, begin: t(n * je), dur: `${Math.max(je, 0.6)}s`, fill: "freeze" }));
          f.setAttribute("transform", "rotate(-90)");
        }
        imEimer.appendChild(g);
        if (sterne >= 2) {
          const ring = s("ellipse", { cx: 198, cy: 112, rx: 10, ry: 2.6, fill: "none", stroke: "#ffffff", "stroke-width": 1, "data-schmuck": "2" });
          if (!ruhig) {
            ring.setAttribute("opacity", "0");
            ring.appendChild(s("animate", { attributeName: "opacity", values: "0;0.9;0", begin: t(n * je), dur: "0.8s", fill: "freeze" }));
            ring.appendChild(s("animate", { attributeName: "rx", values: "4;16", begin: t(n * je), dur: "0.8s", fill: "freeze" }));
          } else ring.setAttribute("opacity", "0.6");
          svg.appendChild(ring);
        }
      }
      if (sterne >= 3) svg.appendChild(funken(46, 36, ruhig));
      return svg;
    },

    /** KARTE (Konzept 5, Schweiz-Karten-Suche): Flug über die stumme Karte, die Ziele leuchten der Reihe nach auf. */
    karte(feier, { stufe, sterne, ruhig }) {
      const ziel = feier.ziele?.[stufe], k = feier.karte;
      if (!k || !ziel || !(ziel.flaechen?.length || ziel.punkte?.length)) return null;
      // Stücke mit ihrer Mitte, von West nach Ost: in dieser Reihe fliegt die Eule darüber
      const stuecke = [...(ziel.flaechen || []).map(d => ({ d, m: mitte(pfadPunkte(d)) })), ...(ziel.punkte || []).map(p => ({ p, m: p }))]
        .sort((a, b) => a.m[0] - b.m[0]);
      // Ausschnitt: ganze Karte oder die Gegend der Ziele, eingepasst in das Bild
      let [x0, y0, x1, y1] = [0, 0, k.breite, k.hoehe];
      if (ziel.ausschnitt) {
        const alle = stuecke.flatMap(st => (st.d ? pfadPunkte(st.d) : [st.p]));
        x0 = Math.min(...alle.map(q => q[0])); x1 = Math.max(...alle.map(q => q[0]));
        y0 = Math.min(...alle.map(q => q[1])); y1 = Math.max(...alle.map(q => q[1]));
      }
      const rand = 10, fx = (BREITE - 2 * rand) / (x1 - x0), fy = (HOEHE - 2 * rand) / (y1 - y0), f = Math.min(fx, fy);
      const ox = (BREITE - f * (x1 - x0)) / 2 - f * x0, oy = (HOEHE - f * (y1 - y0)) / 2 - f * y0;
      const inBild = ([x, y]) => [ox + f * x, oy + f * y];
      const svg = s("svg", { viewBox: `0 0 ${BREITE} ${HOEHE}`, "data-muster": "karte", "data-ziel": stufe, "data-anzahl": stuecke.length }, tagGrund());
      const clip = `feier-karte-${stufe}`;
      svg.appendChild(s("clipPath", { id: clip }, s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14 })));
      // der Zuschnitt hängt an einer Gruppe ohne Verschiebung: sonst gälte das Rechteck in Kartenkoordinaten
      const karte = s("g", { transform: `translate(${ox} ${oy}) scale(${f})` });
      karte.appendChild(s("path", { d: k.land, fill: "#f3efe4", stroke: "#8a8fa8", "stroke-width": 1.2 / f }));
      // stumme Karte: nur Umrisse (Kantone, im Ausschnitt dazu der Umriss der Gegend)
      for (const d of [...(k.kantone || []).map(kt => kt.d), ...(ziel.umriss || [])])
        karte.appendChild(s("path", { d, fill: "none", stroke: "#c9c3b0", "stroke-width": 0.7 / f }));
      svg.appendChild(s("g", { "clip-path": `url(#${clip})` }, karte));
      const lw = stuecke.length > 1 ? stuecke.length - 1 : 1;
      const zeit = n => (n / lw) * DAUER * 0.9;
      stuecke.forEach((st, n) => {
        const farbe = KARTENFARBEN[n % KARTENFARBEN.length];
        const e = st.d
          ? s("path", { d: st.d, fill: farbe, "fill-opacity": 0.55, stroke: farbe, "stroke-width": 0.8 / f, "data-stueck": "flaeche" })
          : s("circle", { cx: st.p[0], cy: st.p[1], r: 2.6 / f, fill: "#2d3047", stroke: "#ffffff", "stroke-width": 0.8 / f, "data-stueck": "punkt" });
        karte.appendChild(erscheine(e, zeit(n), ruhig, 0.25));
      });
      // Flugweg der Eule über die Mitten (höchstens acht Stützpunkte, damit er ruhig bleibt)
      const schritt = Math.max(1, Math.ceil(stuecke.length / 8));
      const wegpunkte = stuecke.filter((_, n) => n % schritt === 0 || n === stuecke.length - 1).map(st => inBild(st.m));
      const [lx, ly] = wegpunkte[wegpunkte.length - 1];
      const weg = "M" + wegpunkte.map(([x, y]) => `${x.toFixed(1)},${(y - 6).toFixed(1)}`).join(" L");
      const eule = euleSilhouette();
      eule.setAttribute("data-figur", "eule");
      const flieger = s("g", {}, s("g", { transform: "scale(0.5)" }, eule));
      if (ruhig) flieger.setAttribute("transform", `translate(${lx} ${ly - 14})`);
      else {
        flieger.setAttribute("opacity", "0");
        flieger.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(0), fill: "freeze" }));
        flieger.appendChild(s("animateMotion", { path: weg, begin: t(0), dur: `${DAUER}s`, fill: "freeze" }));
        // am Ende etwas über dem letzten Ziel
        flieger.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "0 0", to: "0 -8", begin: t(DAUER), dur: "0.3s", additive: "sum", fill: "freeze" }));
      }
      svg.appendChild(flieger);
      if (sterne >= 2) svg.appendChild(fahne(lx, ly, ruhig));
      if (sterne >= 3) svg.appendChild(funken(Math.min(Math.max(lx, 24), BREITE - 24), Math.max(ly - 18, 20), ruhig));
      return svg;
    },
  };

  /** Soll das Gerät keine Bewegung zeigen (Einstellung „Bewegung reduzieren“)? */
  const bewegungReduziert = () => typeof matchMedia === "function" && !!matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Animation fürs Schlussbild: feier aus LS.spiel, stufe "s1"…"s6", sterne 1–3. → <div class="feier"> oder null (kein
   * Muster, keine Angabe für die Stufe). Eine Stufe mit eigenem Muster ({ muster, ziel, … }) nimmt dieses. Ein Tippen
   * springt ans Ende.
   */
  function zeige(feier, { stufe, sterne, ruhig = bewegungReduziert(), klang = null } = {}) {
    let f = feier;
    const eigen = feier?.ziele?.[stufe];
    if (eigen && typeof eigen === "object" && !Array.isArray(eigen) && eigen.muster) {
      const { muster, ziel, ...rest } = eigen;
      f = { ...feier, ...rest, muster, ziele: { [stufe]: ziel ?? rest.szene } };
    }
    const muster = MUSTER[f?.muster];
    if (!muster) return null;
    // Klänge zeitlich zur Animation; ein Tippen ans Ende bricht die ausstehenden ab
    const zeitgeber = [];
    const plane = (sekunden, fn) => { if (typeof setTimeout === "function") zeitgeber.push(setTimeout(fn, sekunden * 1000)); };
    const svg = muster(f, { stufe, sterne: Math.max(1, Math.min(3, sterne || 1)), ruhig, klang: typeof klang === "function" ? klang : null, plane });
    if (!svg) { zeitgeber.forEach(clearTimeout); return null; }
    const box = document.createElement("div");
    box.className = "feier" + (ruhig ? " ruhig" : "");
    box.setAttribute("aria-hidden", "true");
    box.appendChild(svg);
    box.addEventListener("click", () => {
      zeitgeber.forEach(clearTimeout);
      if (typeof svg.setCurrentTime === "function") { svg.setCurrentTime(START + DAUER + 2); svg.pauseAnimations(); }
    });
    return box;
  }

  return { zeige, MUSTER, DAUER, bewegungReduziert };
})();

if (typeof module !== "undefined") module.exports = LS_FEIER;
