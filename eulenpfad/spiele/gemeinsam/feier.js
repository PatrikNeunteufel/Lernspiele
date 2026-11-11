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
    // bis zur eigenen Deckkraft des Elements (ein Scheinwerfer mit 0.16 bleibt zart), sonst 1 — vorher immer 1, das
    // machte bewegt kräftig, was ruhig zart war (Stellen-Detektiv, Scheinwerfer; Entscheid Patrik LERN_Session29, a)
    const ziel = e.getAttribute("opacity") ?? 1;
    e.setAttribute("opacity", "0");
    e.appendChild(s("animate", { attributeName: "opacity", from: 0, to: ziel, begin: t(ab), dur: `${dauer}s`, fill: "freeze" }));
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

  /** Frosch, hellgrün mit dunklem Rand: auf der Seerose (#4f9d47) gut zu sehen (Bemerkung 39, LERN_Session31). */
  function frosch() {
    const haut = { fill: "#a6dd55", stroke: "#2d5a27", "stroke-width": 1 };
    return s("g", { "data-figur": "frosch" },
      s("ellipse", { cx: 0, cy: -5, rx: 9, ry: 6, ...haut }), s("ellipse", { cx: 0, cy: -3, rx: 5.5, ry: 3.5, fill: "#f1f8d8" }),
      s("circle", { cx: -4, cy: -11, r: 3, ...haut }), s("circle", { cx: 4, cy: -11, r: 3, ...haut }),
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
          // zart wie die Stellentafel im Spiel, bewegt wie ruhig: fill-opacity, weil erscheine opacity auf 1 bewegt
          // (Entscheid Patrik LERN_Session29, a: vorher bewegt voll farbig)
          svg.appendChild(erscheine(s("rect", { x: tf.x(k) + 2, y: tf.feldY + 1, width: tf.sb - 4, height: tf.feldH - 2, rx: 3, style: `fill:${stellenFarbe(k)}`, "fill-opacity": 0.18 }), i * je, ruhig, 0.25));
          svg.appendChild(erscheine(zifferText(tf.mitte(k), cy + 6, d[k], 18), i * je, ruhig, 0.25));
        });
        svg.appendChild(erscheine(zeileUnten(ganzText(n), 120), DAUER, ruhig));
        const lx = tf.mitte(keys[0]);
        svg.appendChild(bewege(lupe(), `M${tf.mitte("E") + 40},${cy} L${lx},${cy}`, { x: lx, y: cy, winkel: 0 }, ruhig, { drehen: false }));
        if (sterne >= 2) svg.appendChild(glanz(lx - 6, cy - 8, ruhig));
        if (sterne >= 3) svg.appendChild(funken(BREITE - 28, 122, ruhig)); // unten rechts, nicht auf den Köpfen der Tafel
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
        // das Schild des Spiels mit dem Schritt der Stufe (orange wie --hinweis): so zeigt das Bild, was die Stufe ändert —
        // die Zahl der Sprünge ist im Spiel immer gleich (Bemerkung 37, Entscheid Patrik a, LERN_Session31)
        const schild = `${z.schritt < 0 ? "−" : "+"} ${ganzText(Math.abs(z.schritt))}`, sb = schild.length * 8.6 + 18;
        svg.appendChild(s("g", { "data-schild": z.schritt }, s("rect", { x: BREITE / 2 - sb / 2, y: 10, width: sb, height: 26, rx: 8, fill: HINWEIS }),
          s("text", { x: BREITE / 2, y: 28.5, fill: "#ffffff", "font-size": 15, "font-weight": "900", "font-family": SCHRIFT, "text-anchor": "middle" }, schild)));
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
        // ganze Zahlen (Bemerkung 40, LERN_Session31): oben links der Kopf der Stelle, auf die gerundet wird, in ihrer
        // Stellenfarbe; in der Zahl leuchtet die Ziffer, die entscheidet (die Stelle rechts davon) — so zeigt jede Stufe,
        // was gerundet wird und warum die Kugel rollt, nicht nur andere Zahlen
        const auf = ganz ? STELLE_ZU[Math.round(Math.log10(z.auf))] : null, entscheidet = ganz ? STELLE_ZU[Math.round(Math.log10(z.auf)) - 1] : null;
        if (auf && entscheidet && 10 ** EXPONENT[auf] === z.auf)
          svg.appendChild(s("g", { "data-stelle": auf }, s("rect", { x: 12, y: 10, width: 34, height: 22, rx: 4, style: `fill:${stellenFarbe(auf)}` }),
            s("text", { x: 29, y: 26, fill: "#ffffff", "font-size": 14, "font-weight": "bold", "font-family": SCHRIFT, "text-anchor": "middle" }, auf)));
        /** Zahl über dem Hang; ganz: die entscheidende Ziffer gross in ihrer Farbe. */
        const wertText = (w, attr) => {
          const t0 = s("text", attr);
          if (!ganz || !entscheidet) { t0.appendChild(document.createTextNode(text(w, z.wertStellen ?? nachkomma(w)))); return t0; }
          const zeichen = [...ganzText(w)];
          let stelle = 0;
          const stellen = zeichen.map(c => (/\d/.test(c) ? 1 : 0)).reverse().map(d => (d ? stelle++ : -1)).reverse();
          zeichen.forEach((c, i) => t0.appendChild(stellen[i] === EXPONENT[entscheidet]
            ? s("tspan", { style: `fill:${stellenFarbe(entscheidet)}`, "font-size": 15, "font-weight": "bold", "data-entscheidet": c }, c) : s("tspan", {}, c)));
          if (z.einheit) t0.appendChild(s("tspan", {}, ` ${z.einheit}`));
          return t0;
        };
        faelle.forEach((f, i) => {
          const sx = x(f.w), sy = hoehe(f.w), ex = x(f.ziel) + (imTal(f.ziel) > 1 ? (f.w < f.ziel ? -11 : 11) : 0);
          svg.appendChild(s("g", {}, s("line", { x1: sx, y1: sy - 18, x2: sx, y2: sy - 4, stroke: "#6b7089", "stroke-width": 1, "stroke-dasharray": "2 2" }),
            wertText(f.w, { x: sx, y: sy - 22, fill: "#2d3047", "font-size": ganz ? 12 : 10, "font-family": SCHRIFT, "text-anchor": "middle" })));
          const wg = feier.figur === "kugel" ? kugel() : wagen();
          wg.setAttribute("data-stueck", "wagen");
          svg.appendChild(bewege(wg, `M${sx},${sy} L${ex},${grundY}`, { x: ex, y: grundY, winkel: 0 }, ruhig, { drehen: false, ab: i * 0.3, dauer: DAUER - i * 0.3 }));
          if (gezeigt.has(f.ziel)) return;
          gezeigt.add(f.ziel);
          // ganz im Bild: „≈ 7 000 000“ ragte unter dem rechten Tal 4 Einheiten hinaus (Prüfung Lage, LERN_Session29)
          const ergebnis = "≈ " + text(f.ziel, z.stellen), halb = ergebnis.length * 3.6;
          svg.appendChild(erscheine(s("text", { x: Math.min(Math.max(x(f.ziel), halb + 4), BREITE - halb - 4), y: grundY + 32, fill: "#2d3047", "font-size": 13,
            "font-weight": "bold", "font-family": SCHRIFT, "text-anchor": "middle" }, ergebnis), DAUER, ruhig));
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
        if (sterne >= 3) svg.appendChild(funken(BREITE - 26, 128, ruhig)); // unten rechts, nicht auf den Köpfen der Tafel
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
    // Funken, wo neben der Tafel Platz ist (nicht auf ihren Zahlen): darüber, sonst rechts daneben
    if (sterne >= 3) svg.appendChild(y0 - 6 >= 30 ? funken(BREITE / 2, Math.max(19, (y0 - 6) / 2), ruhig)
      : BREITE - (x0 + B + 6) >= 40 ? funken(x0 + B + 6 + (BREITE - (x0 + B + 6)) / 2, 26, ruhig) : funken(19, 19, ruhig)); // sonst auf der Ecke des Rahmens
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

  // ---------- Bilder Block M3: Rechnen (AR1 a, LERN_Session28) ----------
  // Wie M2: jedes Bild folgt den Stufen seines Spiels und rechnet nach, was es zeigt; ohne stimmige Angabe kein Bild.

  /** Wert einer Rechnung aus Zahlen und Zeichen, Punkt vor Strich (× · : vor + − -): [9, "×", 6, "−", 6] → 48. */
  function wertVon(teile) {
    if (!Array.isArray(teile) || teile.length % 2 === 0 || teile.some((x, i) => (i % 2 ? typeof x !== "string" : !Number.isFinite(x)))) return NaN;
    const stapel = [teile[0]];
    for (let i = 1; i < teile.length; i += 2) {
      const op = teile[i], b = teile[i + 1];
      if (op === "×" || op === "·") stapel[stapel.length - 1] *= b;
      else if (op === ":") stapel[stapel.length - 1] /= b;
      else if (op === "+" || op === "−" || op === "-") stapel.push(op, b);
      else return NaN;
    }
    let w = stapel[0];
    for (let i = 1; i < stapel.length; i += 2) w = stapel[i] === "+" ? w + stapel[i + 1] : w - stapel[i + 1];
    return w;
  }
  /** Rechnung als Text: Zahlen wie im Lehrmittel, „-“ als Minuszeichen. */
  const termText = teile => teile.map(x => (typeof x === "number" ? ganzText(x) : x === "-" ? "−" : x)).join(" ");
  /** Guetzli um x, y. */
  const guetzli = (x, y, r = 4.6) => s("g", {}, s("circle", { cx: x, cy: y, r, fill: "#d9a35b", stroke: "#8a5a2b", "stroke-width": 0.8 }),
    ...[[-1.6, -1.2], [1.5, -0.4], [-0.3, 1.8]].map(([dx, dy]) => s("circle", { cx: x + dx * r / 4.6, cy: y + dy * r / 4.6, r: r * 0.17, fill: "#5e3417" })));

  // ----- Einmaleins-Blitz (BAUEN · punktfeld) -----
  /**
   * Punktefeld Reihe um Reihe wie im Spiel (3 × 5, 7 × 8; 56 : 8 = 7 sind 7 Reihen zu 8); mit einheit 10 Zehnerstangen
   * (30 × 7: 7 Reihen zu 3 Stangen), mit einheit 100 Hunderterplatten (40 × 60: 4 Reihen zu 6 Platten). Die Rechnung muss
   * zum Feld passen. luecke: die gesuchte Zahl (Stufe 5) leuchtet in der Rechnung.
   */
  function punktfeld(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || ![z.zeilen, z.spalten].every(v => Number.isInteger(v) && v >= 1 && v <= 10) || !Array.isArray(z.rechnung) || z.rechnung.length !== 3) return null;
    const einheit = z.einheit || 1, gesamt = z.zeilen * z.spalten * einheit;
    if (![1, 10, 100].includes(einheit)) return null;
    const [a, op, b] = z.rechnung, c = wertVon(z.rechnung);
    if (!Number.isInteger(c) || (op === ":" ? a !== gesamt : c !== gesamt)) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "punktfeld", "data-anzahl": z.zeilen * z.spalten });
    svg.appendChild(tagGrund());
    const zw = einheit === 1 ? Math.min(14, 104 / z.zeilen, 250 / z.spalten) : einheit === 10 ? 11 : 22;
    const sw = einheit === 1 ? zw : einheit === 10 ? Math.min(46, 284 / z.spalten) : 22, sl = sw - 6; // sl: Länge einer Zehnerstange
    const x0 = (BREITE - z.spalten * sw) / 2 + sw / 2, y0 = 14 + (108 - z.zeilen * zw) / 2 + zw / 2;
    // Division (Bemerkung 38, LERN_Session31): aufteilen statt malnehmen — die Punkte kommen grau als ein Haufen, dann
    // bekommt jede Gruppe (eine Reihe zu b) ihren Rahmen in einer eigenen Farbe und ihre Nummer, die Punkte färben sich
    // mit; die Zahl der Gruppen leuchtet in der Rechnung
    const teilen = op === ":" && einheit === 1, GRUPPE = ["#8e5bd6", "#e0569a", "#f07c2a", "#e9b300", "#14b8a6", "#6366f1", "#64748b", "#2f8fe0", "#c8553d", "#2fb36b"];
    const je = (DAUER * (teilen ? 0.3 : 0.65)) / z.zeilen, jeG = (DAUER * 0.45) / z.zeilen, abG = DAUER * 0.35;
    for (let r = 0; r < z.zeilen; r++) {
      const reihe = s("g", {});
      if (teilen) {
        const y = y0 + r * zw, ab = abG + r * jeG;
        svg.appendChild(erscheine(s("rect", { x: x0 - sw / 2 - 1, y: y - zw / 2 + 0.5, width: z.spalten * sw + 2, height: zw - 1, rx: zw / 2, fill: GRUPPE[r], "fill-opacity": 0.18,
          stroke: GRUPPE[r], "stroke-width": 1.4, "data-gruppe": r + 1 }), ab, ruhig, 0.2));
        svg.appendChild(erscheine(text(x0 - sw / 2 - 10, y + 3.5, r + 1, { gross: 10, farbe: GRUPPE[r] }), ab, ruhig, 0.2));
      }
      for (let c0 = 0; c0 < z.spalten; c0++) {
        const x = x0 + c0 * sw, y = y0 + r * zw;
        let e;
        if (teilen) {
          e = s("circle", { cx: x, cy: y, r: zw * 0.36, fill: ruhig ? GRUPPE[r] : "#9aa0b4" });
          if (!ruhig) e.appendChild(s("animate", { attributeName: "fill", from: "#9aa0b4", to: GRUPPE[r], begin: t(abG + r * jeG), dur: "0.25s", fill: "freeze" }));
        } else if (einheit === 1) e = s("circle", { cx: x, cy: y, r: zw * 0.36, style: "fill:var(--deko-6)" });
        else if (einheit === 10) e = s("g", {}, s("rect", { x: x - sl / 2, y: y - 3.5, width: sl, height: 7, rx: 1, style: "fill:var(--st-Z)" }),
          s("path", { d: Array.from({ length: 9 }, (_, i) => `M${(x - sl / 2 + ((i + 1) * sl) / 10).toFixed(2)},${y - 3.5} v7`).join(" "), stroke: "#ffffff", "stroke-width": 0.5, "stroke-opacity": 0.8 }));
        else e = s("g", {}, s("rect", { x: x - 9.5, y: y - 9.5, width: 19, height: 19, rx: 1, style: "fill:var(--st-H)" }),
          s("path", { d: Array.from({ length: 9 }, (_, i) => `M${x - 9.5 + (i + 1) * 1.9},${y - 9.5} v19 M${x - 9.5},${y - 9.5 + (i + 1) * 1.9} h19`).join(" "), stroke: "#ffffff", "stroke-width": 0.3, "stroke-opacity": 0.8 }));
        e.setAttribute("data-stueck", einheit === 1 ? "punkt" : einheit === 10 ? "Z" : "H");
        reihe.appendChild(e);
      }
      svg.appendChild(erscheine(reihe, r * je, ruhig, 0.2));
    }
    // Rechnung; die gesuchte Zahl in Farbe
    const teile = [ganzText(a), OP_TEXT[op] || op, ganzText(b), "=", ganzText(c)];
    const zeile = s("text", { x: BREITE / 2, y: 140, fill: "#2d3047", "font-size": 14, "font-weight": "bold", "font-family": SCHRIFT, "text-anchor": "middle", "data-zeile": "unten" });
    const leuchtet = z.luecke ?? (teilen ? 4 : undefined); // beim Aufteilen: die Zahl der Gruppen
    teile.forEach((t0, i) => zeile.appendChild(s("tspan", i === leuchtet ? { style: "fill:var(--deko-2)" } : {}, (i ? " " : "") + t0)));
    svg.appendChild(erscheine(zeile, DAUER * 0.75, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 30, 22, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 24, ruhig));
    return svg;
  }

  // ----- Rest-Rätsel (SAMMELN · reste) -----
  /**
   * Die Dinge werden reihum auf die Teller verteilt (eins je Teller und Runde), was nicht mehr für alle reicht, kommt ins
   * Glas: 7 : 2 = 3 Rest 1. Kommen mehr als sechs auf einen Teller (grosse Zahlen), steht die Zahl auf dem Teller.
   */
  function reste(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Number.isInteger(z.zahl) || !Number.isInteger(z.teiler) || z.teiler < 2 || z.teiler > 8 || z.zahl < z.teiler) return null;
    const q = Math.floor(z.zahl / z.teiler), r = z.zahl % z.teiler, n = z.teiler, mitDingen = q <= 6;
    if (r > 12) return null;
    const ding = z.ding === "apfel" ? (x, y) => apfel(x, y + 2) : (x, y) => guetzli(x, y, 5.6);
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "reste", "data-anzahl": (mitDingen ? q * n : 0) + r, "data-wert": `${q},${r}` });
    svg.appendChild(tagGrund());
    const pw = Math.min(76, 236 / n), xs = Array.from({ length: n }, (_, i) => 12 + pw / 2 + i * pw), ty = 104, sp = 13;
    xs.forEach(x => svg.appendChild(s("ellipse", { cx: x, cy: ty + 9, rx: pw / 2 - 3, ry: 8, fill: "#ffffff", stroke: "#b8a98a", "stroke-width": 1.2 })));
    // Glas rechts, gross genug für den Rest
    const gx = 284;
    svg.appendChild(s("path", { d: `M${gx - 22},${ty - 52} L${gx - 18},${ty + 16} L${gx + 18},${ty + 16} L${gx + 22},${ty - 52}`, fill: "#e8f4fb", stroke: "#8ab4cc", "stroke-width": 1.6 }));
    const spaltenJe = Math.max(2, Math.min(3, Math.floor((pw - 4) / sp)));
    const platz = (k, x, spalten = spaltenJe) => [x + ((k % spalten) - (spalten - 1) / 2) * sp, ty + 2 - Math.floor(k / spalten) * sp];
    const runden = mitDingen ? q : 1, je = (DAUER * 0.7) / (runden * n + 1);
    if (mitDingen) {
      for (let k = 0; k < q; k++) for (let i = 0; i < n; i++) {
        const [x, y] = platz(k, xs[i]), e = ding(x, y);
        e.setAttribute("data-stueck", "ding");
        svg.appendChild(vonOben(e, (k * n + i) * je, ruhig, 50, 0.3));
      }
    } else xs.forEach((x, i) => svg.appendChild(erscheine(text(x, ty + 3, ganzText(q), { gross: pw < 40 ? 13 : 16 }), i * je, ruhig, 0.2)));
    for (let k = 0; k < r; k++) {
      const [x, y] = [gx + ((k % 3) - 1) * sp, ty + 6 - Math.floor(k / 3) * sp], e = ding(x, y);
      e.setAttribute("data-stueck", "ding");
      svg.appendChild(vonOben(e, DAUER * 0.72 + k * 0.08, ruhig, 50, 0.3));
    }
    svg.appendChild(erscheine(zeileUnten(`${ganzText(z.zahl)} : ${n} = ${ganzText(q)} Rest ${r}`, 138), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(gx + 14, ty - 40, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 22, ruhig));
    return svg;
  }

  // ----- Zehner-Ergänzer (BAUEN · ergaenzen) -----
  /**
   * Was da ist (blau) und was zur runden Zahl fehlt (orange, kommt dazu): im Zehnerfeld (bis 20), in Hunderterfeldern
   * (bis 400, je Feld 100) oder auf einem Rechenstrich von von bis ziel (grosse Zahlen).
   */
  function ergaenzen(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Number.isInteger(z.start) || !Number.isInteger(z.ziel) || !(z.start > 0 && z.start < z.ziel)) return null;
    const dazu = z.ziel - z.start;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "ergaenzen", "data-wert": dazu });
    svg.appendChild(tagGrund());
    const DA = "var(--deko-6)", NEU = "var(--deko-3)";
    if (z.art === "zehnerfeld" || z.art === "hunderter") {
      const proFeld = z.art === "zehnerfeld" ? 10 : 100, felder = Math.ceil(z.ziel / proFeld), spalten = z.art === "zehnerfeld" ? 5 : 10;
      if (felder > 4 || z.ziel % (z.art === "zehnerfeld" ? 10 : 10)) return null;
      const zeilen = proFeld / spalten, c = z.art === "zehnerfeld" ? 18 : Math.min(9.5, 270 / (felder * 10 + (felder - 1) * 1.5));
      const fb = spalten * c, abst = z.art === "zehnerfeld" ? 14 : c * 1.5, x0 = (BREITE - felder * fb - (felder - 1) * abst) / 2, y0 = z.art === "zehnerfeld" ? 40 : 14;
      const neuJe = (DAUER * 0.6) / dazu;
      for (let f = 0; f < felder; f++) {
        const fx = x0 + f * (fb + abst);
        svg.appendChild(s("rect", { x: fx - 2, y: y0 - 2, width: fb + 4, height: zeilen * c + 4, rx: 3, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.2 }));
        for (let i = 0; i < proFeld; i++) {
          const n = f * proFeld + i, x = fx + (i % spalten) * c + c / 2, y = y0 + Math.floor(i / spalten) * c + c / 2;
          if (n >= z.ziel) { svg.appendChild(s("circle", { cx: x, cy: y, r: c * 0.36, fill: "none", stroke: "#dfe3ef", "stroke-width": 0.8 })); continue; }
          const p = s("circle", { cx: x, cy: y, r: c * 0.38, style: `fill:${n < z.start ? DA : NEU}`, ...(n >= z.start ? { "data-stueck": "dazu" } : {}) });
          svg.appendChild(n < z.start ? erscheine(p, 0, ruhig, 0.3) : erscheine(p, 0.4 + (n - z.start) * neuJe, ruhig, 0.12));
        }
      }
      svg.setAttribute("data-anzahl", dazu);
    } else if (z.art === "balken") {
      const von = z.von ?? 0;
      if (!(von <= z.start)) return null;
      const L = 30, R = 290, px = v => L + ((v - von) / (z.ziel - von)) * (R - L), y = 64;
      svg.append(s("rect", { x: L, y: y - 12, width: R - L, height: 24, rx: 4, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.2 }),
        erscheine(s("rect", { x: L, y: y - 12, width: px(z.start) - L, height: 24, rx: 4, style: `fill:${DA}` }), 0, ruhig));
      const neu = s("rect", { x: px(z.start), y: y - 12, width: R - px(z.start), height: 24, rx: 4, style: `fill:${NEU}`, "data-stueck": "dazu" });
      if (!ruhig) neu.appendChild(s("animate", { attributeName: "width", from: 0, to: R - px(z.start), begin: t(0.5), dur: `${DAUER * 0.6}s`, fill: "freeze" }));
      svg.appendChild(neu);
      for (const [v, gross] of [[von, 10], [z.start, 11], [z.ziel, 11]]) svg.appendChild(text(px(v), y + 30, ganzText(v), { gross }));
      svg.setAttribute("data-anzahl", 1);
    } else return null;
    const zeile = s("text", { x: BREITE / 2, y: 140, fill: "#2d3047", "font-size": 14, "font-weight": "bold", "font-family": SCHRIFT, "text-anchor": "middle", "data-zeile": "unten" },
      `${ganzText(z.start)} + `, s("tspan", { style: `fill:${NEU}` }, ganzText(dazu)), ` = ${ganzText(z.ziel)}`);
    svg.appendChild(erscheine(zeile, DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 24, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 20, ruhig));
    return svg;
  }

  // ----- Zahlenhaus (BAUEN · haus) -----
  /** Das Dach trägt die Zahl, Stockwerk um Stockwerk kommen ihre Zerlegungen dazu (zwei oder drei Zahlen, wie im Spiel). */
  function haus(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Number.isInteger(z.dach) || !Array.isArray(z.stockwerke) || !z.stockwerke.length || z.stockwerke.length > 5) return null;
    if (z.stockwerke.some(w => !Array.isArray(w) || w.length < 2 || w.length > 3 || w.reduce((a, b) => a + b, 0) !== z.dach || w.some(v => !Number.isInteger(v) || v < 0))) return null;
    const n = z.stockwerke.length, hb = 156, sh = Math.min(22, 92 / n), x0 = (BREITE - hb) / 2, unten = 140, dachH = 34;
    const oben = unten - n * sh;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "haus", "data-anzahl": n });
    svg.append(tagGrund(), boden());
    svg.appendChild(erscheine(s("g", {}, s("path", { d: `M${x0 - 8},${oben} L${BREITE / 2},${oben - dachH} L${x0 + hb + 8},${oben} Z`, style: "fill:var(--deko-2)" }),
      text(BREITE / 2, oben - 9, ganzText(z.dach), { gross: 15, farbe: "#ffffff" })), 0, ruhig));
    const je = (DAUER * 0.75) / n;
    z.stockwerke.forEach((w, i) => {
      const y = oben + i * sh, g = s("g", { "data-stueck": "stockwerk", "data-wert": w.join("+") },
        s("rect", { x: x0, y, width: hb, height: sh, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 2 }));
      w.forEach((v, k) => {
        const cw = hb / w.length;
        if (k) g.appendChild(s("line", { x1: x0 + k * cw, y1: y, x2: x0 + k * cw, y2: y + sh, stroke: "#2d3047", "stroke-width": 1.4 }));
        g.appendChild(text(x0 + k * cw + cw / 2, y + sh / 2 + 4.5, ganzText(v), { gross: 13 }));
      });
      svg.appendChild(vonOben(g, 0.3 + i * je, ruhig, 30, 0.3));
    });
    if (sterne >= 2) svg.appendChild(erscheine(s("g", { "data-schmuck": "2" }, s("rect", { x: x0 + hb - 30, y: oben - dachH + 4, width: 10, height: 18, fill: "#8a5a32" }),
      s("circle", { cx: x0 + hb - 22, cy: oben - dachH - 4, r: 5, fill: "#dfe3ef", opacity: 0.8 })), DAUER, ruhig));
    if (sterne >= 3) {
      const e = euleSitzend(0.26);
      e.setAttribute("transform", `translate(${x0 + 30} ${oben - dachH * 0.45})`);
      e.setAttribute("data-schmuck", "3");
      svg.append(erscheine(e, DAUER, ruhig), funken(BREITE - 34, 24, ruhig));
    }
    return svg;
  }

  // ----- Doppel-Spiegel (WACHSEN · spiegel) -----
  /**
   * Links liegen die Dinge, rechts erscheint ihr Spiegelbild: zusammen das Doppelte (3 + 3 = 6). halb: alles liegt da, der
   * Spiegel teilt es in zwei gleiche Hälften (16 : 2 = 8). Bis 20 je Seite Punkte in Fünferreihen, darüber
   * Dienes-Material in den Stellenfarben.
   */
  function spiegel(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Number.isInteger(z.zahl) || z.zahl < 1 || z.zahl > 999 || (z.halb && z.zahl % 2)) return null;
    const n = z.halb ? z.zahl / 2 : z.zahl, punkte = n <= 20, mx = BREITE / 2;
    const svg = neuesBild("wachsen", stufe, { "data-bilder": "spiegel", "data-anzahl": punkte ? 2 * n : 0 });
    svg.appendChild(tagGrund());
    const links = s("g", {});
    if (punkte) {
      // in der Mitte der Spiegelhöhe, Fünferreihen
      const reihen = Math.ceil(n / 5);
      for (let i = 0; i < n; i++) links.appendChild(s("circle", { cx: mx - 18 - (i % 5) * 16, cy: 62 - (reihen - 1) * 8 + Math.floor(i / 5) * 16, r: 6, style: "fill:var(--deko-6)", "data-stueck": "punkt" }));
    } else {
      // Dienes von der Mitte weg: Einer nahe am Spiegel, dann Zehner, Hunderter; so gross, wie der Platz erlaubt
      const d = ziffernJeStelle(n), gross = s("g", {});
      let x = mx - 14;
      for (const k of ["E", "Z", "H"]) {
        if (!d[k]) continue;
        const versatz = k === "H" ? 5 : 9, breite = BAUSTEIN_BREITE[k] + (d[k] - 1) * versatz;
        x -= breite;
        for (let i = 0; i < d[k]; i++) gross.appendChild(baustein(k, x + i * versatz, k === "H" ? 80 - i * 4 : 80));
        x -= 12;
      }
      const k = Math.min(1.4, (mx - 8) / (mx - x));
      if (k < 0.6) return null;
      gross.setAttribute("transform", `translate(${mx} 80) scale(${k.toFixed(3)}) translate(${-mx} -80)`);
      links.appendChild(gross);
    }
    const rechts = links.cloneNode(true);
    rechts.setAttribute("transform", `translate(${2 * mx} 0) scale(-1 1)`);
    const spiegelG = s("g", {}, s("rect", { x: mx - 3, y: 14, width: 6, height: 98, rx: 2, fill: "#cfe9f8", stroke: "#8ab4cc", "stroke-width": 1 }),
      s("line", { x1: mx - 1, y1: 20, x2: mx - 1, y2: 60, stroke: "#ffffff", "stroke-width": 1.4 }));
    if (z.halb) {
      // das Ganze liegt da, der Spiegel kommt dazwischen: zwei gleiche Hälften
      svg.append(erscheine(links, 0, ruhig, 0.3), erscheine(rechts, 0, ruhig, 0.3), vonOben(spiegelG, DAUER * 0.35, ruhig, 100, 0.5));
    } else {
      svg.append(spiegelG, erscheine(links, 0, ruhig, 0.4));
      // das Spiegelbild taucht langsam auf
      const bild = s("g", {}, rechts);
      if (!ruhig) {
        bild.setAttribute("opacity", "0");
        bild.appendChild(s("animate", { attributeName: "opacity", from: 0, to: 1, begin: t(DAUER * 0.35), dur: `${DAUER * 0.45}s`, fill: "freeze" }));
      }
      svg.appendChild(bild);
    }
    svg.appendChild(erscheine(zeileUnten(z.halb ? `${ganzText(z.zahl)} : 2 = ${ganzText(n)}` : `${ganzText(n)} + ${ganzText(n)} = ${ganzText(2 * n)}`, 138), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(mx + 8, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 28, 24, ruhig));
    return svg;
  }

  // ----- Zahlen-Waage (BAUEN · waage) -----
  /**
   * Links kommt die erste Rechnung in die Schale, die Waage neigt sich; rechts die zweite, und die Waage steht wieder
   * gerade: beide Seiten sind gleich viel (6 + 3 = 5 + 4). Die Gleichheit wird nachgerechnet.
   */
  function waage(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.links) || !Array.isArray(z.rechts)) return null;
    const lw = wertVon(z.links), rw = wertVon(z.rechts);
    if (!Number.isFinite(lw) || lw !== rw) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "waage", "data-wert": lw });
    svg.appendChild(tagGrund());
    const px = 160, py = 46, arm = 104, neig = 10, sinN = Math.sin((neig * Math.PI) / 180) * arm;
    svg.append(s("path", { d: `M${px},${py} L${px - 22},${118} L${px + 22},${118} Z`, fill: "#8a94a6" }), s("rect", { x: px - 40, y: 118, width: 80, height: 6, rx: 3, fill: "#6b7089" }));
    // Zeitplan: links landet (0.25), Waage neigt sich links (bis 0.4), rechts landet (0.6), Waage gerade (bis 0.8)
    const kt = "0;0.25;0.4;0.6;0.8;1", werte = d => `0 0;0 0;0 ${d};0 ${d};0 0;0 0`;
    const balken = s("g", {}, s("rect", { x: px - arm - 4, y: py - 3, width: 2 * arm + 8, height: 6, rx: 3, fill: "#4f5668" }), s("circle", { cx: px, cy: py, r: 5, fill: "#2d3047" }));
    if (!ruhig) balken.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", values: `0 ${px} ${py};0 ${px} ${py};${-neig} ${px} ${py};${-neig} ${px} ${py};0 ${px} ${py};0 ${px} ${py}`, keyTimes: kt, begin: t(0), dur: `${DAUER}s`, fill: "freeze" }));
    const schale = (x, teile, dy, ab) => {
      const g = s("g", {}, s("path", { d: `M${x},${py} L${x - 30},${py + 44} M${x},${py} L${x + 30},${py + 44}`, stroke: "#8a8fa8", "stroke-width": 1 }),
        s("path", { d: `M${x - 38},${py + 44} Q${x},${py + 64} ${x + 38},${py + 44} Z`, fill: "#c9ccd3", stroke: "#6b7089", "stroke-width": 1.2 }));
      const karte = s("g", {}, s("rect", { x: x - 36, y: py + 18, width: 72, height: 24, rx: 5, fill: "#ffffff", stroke: "#6b7089", "stroke-width": 1.2 }),
        text(x, py + 35, termText(teile), { gross: 13 }));
      g.appendChild(vonOben(karte, ab, ruhig, 60, 0.35));
      if (!ruhig) g.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", values: werte(dy), keyTimes: kt, begin: t(0), dur: `${DAUER}s`, fill: "freeze" }));
      return g;
    };
    svg.append(schale(px - arm, z.links, sinN, 0.1), schale(px + arm, z.rechts, -sinN, DAUER * 0.45), balken);
    svg.appendChild(erscheine(zeileUnten(`${termText(z.links)} = ${termText(z.rechts)}`, 142), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(px + 14, py - 12, ruhig));
    if (sterne >= 3) svg.appendChild(funken(px, 18, ruhig));
    return svg;
  }

  // ----- Schriftlich-Werkstatt (BAUEN · schriftlich) -----
  /**
   * Die Rechnung untereinander; von rechts nach links kommt Spalte um Spalte die Ziffer des Ergebnisses, ein Übertrag
   * klein über dem Strich in der Spalte links davon — beim Minus wie im Spiel ergänzend (der Übertrag kommt unten dazu).
   * Über den Spalten ihre Stelle in der Stellenfarbe.
   */
  function schriftlich(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.zahlen) || z.zahlen.length < 2 || z.zahlen.some(v => !Number.isInteger(v) || v < 0) || !["+", "−", "×"].includes(z.op)) return null;
    if (z.op !== "+" && z.zahlen.length !== 2) return null;
    if (z.op === "×" && z.zahlen[1] > 9) return null;
    const ziff = (v, i) => Math.floor(v / 10 ** i) % 10;
    const ergebnis = z.op === "+" ? z.zahlen.reduce((a, b) => a + b, 0) : z.op === "−" ? z.zahlen[0] - z.zahlen[1] : z.zahlen[0] * z.zahlen[1];
    if (ergebnis < 0) return null;
    const spalten = Math.max(...z.zahlen.map(v => String(v).length), String(ergebnis).length);
    if (spalten > 7) return null;
    // je Spalte Ziffer und Übertrag in die nächste
    const ueber = [0], erg = [];
    for (let i = 0; i < spalten; i++) {
      let w;
      if (z.op === "+") w = z.zahlen.reduce((a, v) => a + ziff(v, i), 0) + ueber[i];
      else if (z.op === "×") w = ziff(z.zahlen[0], i) * z.zahlen[1] + ueber[i];
      else { w = ziff(z.zahlen[0], i) - ziff(z.zahlen[1], i) - ueber[i]; if (w < 0) { erg.push(w + 10); ueber.push(1); continue; } erg.push(w); ueber.push(0); continue; }
      erg.push(w % 10); ueber.push(Math.floor(w / 10));
    }
    if (ueber[spalten] || erg.reduce((a, d, i) => a + d * 10 ** i, 0) !== ergebnis) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "schriftlich", "data-wert": ergebnis });
    svg.appendChild(tagGrund());
    const cw = 26, rechts = BREITE / 2 + ((spalten - 1) * cw) / 2 + 8, xs = i => rechts - i * cw, zeilen = z.zahlen.length, zh = 22, y0 = 44;
    // Spaltenköpfe in Stellenfarben
    for (let i = 0; i < spalten; i++) {
      const k = GANZE[GANZE.length - 1 - i];
      svg.appendChild(s("rect", { x: xs(i) - cw / 2 + 1, y: 8, width: cw - 2, height: 14, rx: 2, style: `fill:${stellenFarbe(k)}` }));
      svg.appendChild(text(xs(i), 19, k, { gross: 9, farbe: "#ffffff" }));
    }
    z.zahlen.forEach((v, r) => {
      const y = y0 + r * zh;
      [...String(v)].reverse().forEach((d, i) => svg.appendChild(text(xs(i), y, d, { gross: 18 })));
      if (r === zeilen - 1) svg.appendChild(text(xs(spalten) - 2, y, z.op, { gross: 18 }));
    });
    const linie = y0 + (zeilen - 1) * zh + 12;
    svg.appendChild(s("line", { x1: xs(spalten) - 14, y1: linie, x2: rechts + cw / 2, y2: linie, stroke: "#2d3047", "stroke-width": 1.8 }));
    const je = (DAUER * 0.8) / String(ergebnis).length;
    for (let i = 0; i < String(ergebnis).length; i++) {
      svg.appendChild(erscheine(text(xs(i), linie + 23, erg[i], { gross: 18, farbe: "#1f5fbf" }), i * je, ruhig, 0.2));
      if (ueber[i + 1]) svg.appendChild(erscheine(text(xs(i + 1) + 7, linie - 3, ueber[i + 1], { gross: 10, farbe: "#c0392b" }), i * je + 0.1, ruhig, 0.2));
    }
    if (sterne >= 2) svg.appendChild(glanz(rechts + 26, linie + 12, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 40, 30, ruhig));
    return svg;
  }

  // ----- Malkreuz (BAUEN · malkreuz) -----
  /** Zahl nach Stellen zerlegt: 254 → [200, 50, 4] (ohne Nullen). */
  const stellenteile = v => [...String(v)].map((d, i, a) => Number(d) * 10 ** (a.length - 1 - i)).filter(Boolean);
  /**
   * Das Malkreuz der Stufe füllt sich Feld um Feld (Zeile mal Spalte), darunter das Ergebnis. raetsel (Stufe 6): eine
   * Randzahl steht erst als „?“ und wird dann gefunden.
   */
  function malkreuz(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Number.isInteger(z.a) || !Number.isInteger(z.b) || z.a < 2 || z.b < 2) return null;
    const oben = stellenteile(z.a), links = stellenteile(z.b);
    if (oben.length > 3 || links.length > 3) return null;
    const cw = Math.min(66, 280 / (oben.length + 1)), ch = 30, x0 = (BREITE - cw * (oben.length + 1)) / 2, y0 = (122 - ch * (links.length + 1)) / 2;
    const summe = oben.reduce((a, o) => a + links.reduce((b, l) => b + o * l, 0), 0);
    if (summe !== z.a * z.b) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "malkreuz", "data-anzahl": oben.length * links.length, "data-wert": summe });
    svg.appendChild(tagGrund());
    const zelle = (c, r, inhalt, art) => {
      const g = s("g", {}, s("rect", { x: x0 + c * cw + 1, y: y0 + r * ch + 1, width: cw - 2, height: ch - 2, rx: 3,
        fill: art === "kopf" ? "#fff3d6" : art === "ecke" ? "#eef0fa" : "#ffffff", stroke: "#b8a98a", "stroke-width": 1 }));
      if (inhalt !== null) g.appendChild(text(x0 + c * cw + cw / 2, y0 + r * ch + ch / 2 + 5, inhalt, { gross: 15 }));
      return g;
    };
    svg.appendChild(zelle(0, 0, "×", "ecke"));
    oben.forEach((o, c) => {
      if (z.raetsel && c === oben.length - 1) {
        svg.appendChild(zelle(c + 1, 0, null, "kopf"));
        svg.appendChild(kurz(text(x0 + (c + 1) * cw + cw / 2, y0 + ch / 2 + 5, "?", { gross: 15, farbe: "#c0392b" }), 0, DAUER * 0.75, ruhig));
        svg.appendChild(erscheine(text(x0 + (c + 1) * cw + cw / 2, y0 + ch / 2 + 5, ganzText(o), { gross: 15 }), DAUER * 0.78, ruhig));
      } else svg.appendChild(zelle(c + 1, 0, ganzText(o), "kopf"));
    });
    links.forEach((l, r) => svg.appendChild(zelle(0, r + 1, ganzText(l), "kopf")));
    const je = (DAUER * 0.65) / (oben.length * links.length);
    let k = 0;
    links.forEach((l, r) => oben.forEach((o, c) => {
      const g = zelle(c + 1, r + 1, ganzText(o * l), "feld");
      g.setAttribute("data-stueck", "feld");
      g.setAttribute("data-wert", o * l);
      svg.appendChild(erscheine(g, 0.2 + k++ * je, ruhig, 0.2));
    }));
    svg.appendChild(erscheine(zeileUnten(`${ganzText(z.a)} × ${ganzText(z.b)} = ${ganzText(summe)}`, 138), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(x0 + cw * (oben.length + 1) + 6, y0 + 4, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 120, ruhig));
    return svg;
  }

  // ----- Rechentrick-Detektiv (SAMMELN · trick) -----
  /**
   * Die Lupe untersucht die Rechnung, darunter erscheint der Trick (Tauschen, Nachbaraufgabe, Verdoppeln und Halbieren,
   * anders Zusammenfassen) und das Ergebnis. Jede Zeile wird nachgerechnet: alle gleich viel.
   */
  function trick(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.zeilen) || z.zeilen.length < 2 || z.zeilen.length > 3) return null;
    const werte = z.zeilen.map(wertVon);
    if (!werte.every(w => Number.isFinite(w) && w === werte[0])) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "trick", "data-wert": werte[0] });
    svg.appendChild(tagGrund());
    const ys = [40, 76, 116];
    z.zeilen.forEach((teile, i) => {
      const letzte = i === z.zeilen.length - 1;
      const zeile = text(BREITE / 2, ys[i], (i ? "= " : "") + termText(teile), { gross: letzte && i ? 22 : 18, farbe: i === 1 && !letzte ? "#2f7a50" : "#2d3047" });
      svg.appendChild(i ? erscheine(zeile, 1.0 + (i - 1) * 0.7, ruhig) : zeile);
    });
    // die Lupe fährt über die Rechnung
    svg.appendChild(bewege(lupe(), `M60,${ys[0] - 4} L${BREITE - 60},${ys[0] - 4}`, { x: BREITE - 60, y: ys[0] - 4, winkel: 0 }, ruhig, { drehen: false, dauer: 0.95 }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 34, ys[0] - 22, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 126, ruhig));
    return svg;
  }

  // ----- Rechen-Maschine (BAUEN · maschine) -----
  const rechne1 = (w, [op, b]) => (op === "+" ? w + b : op === "−" || op === "-" ? w - b : op === "·" || op === "×" ? w * b : op === ":" ? w / b : NaN);
  /**
   * Eine Zahl läuft durch die Kästen der Maschine und kommt verändert heraus (15 → + 7 → 22). weiche (Stufe 6): erst die
   * Frage „gerade?“, dann der Weg ✓ oder ✗ mit seinem Kasten. Alle Zwischenzahlen ganz.
   */
  function maschine(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Number.isInteger(z.start) || !Array.isArray(z.kaesten) || !z.kaesten.length) return null;
    let kaesten = z.kaesten, w = z.start, zweig = null;
    if (z.weiche) {
      const gerade = z.start % 2 === 0;
      zweig = gerade ? "ja" : "nein";
      kaesten = [z.weiche[zweig], ...z.kaesten];
    }
    const zahlen = [w];
    for (const k of kaesten) { w = rechne1(w, k); if (!Number.isInteger(w) || w < 0) return null; zahlen.push(w); }
    const svg = neuesBild("bauen", stufe, { "data-bilder": "maschine", "data-wert": w, "data-anzahl": kaesten.length });
    svg.appendChild(tagGrund());
    // Grössen: Kästen so breit, wie Platz ist; die Weiche hat ihren eigenen Plan
    const n = kaesten.length, y = 70, kh = 46, ein = 20, aus = BREITE - 22;
    const kw = z.weiche ? 56 : Math.min(70, 200 / n - 10);
    const yWeg = zweig === "ja" ? 36 : 112;
    const xsK = z.weiche ? kaesten.map((_, i) => 168 + i * 66) : kaesten.map((_, i) => 62 + ((i + 0.5) * 196) / n);
    const ysK = z.weiche ? kaesten.map(() => yWeg) : kaesten.map(() => y);
    const kasten = (x, yy, inhalt, stueck = true, breit = kw) => {
      const zx = x + breit / 2 - 9, zy = yy - kh / 2 + 9;
      const zahnrad = s("g", {}, s("circle", { cx: zx, cy: zy, r: 5, fill: "none", stroke: "#8a94a6", "stroke-width": 2.4, "stroke-dasharray": "2.4 1.8" }));
      if (!ruhig) zahnrad.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `0 ${zx} ${zy}`, to: `360 ${zx} ${zy}`, begin: t(0), dur: `${DAUER}s`, fill: "freeze" }));
      return s("g", stueck ? { "data-stueck": "kasten" } : {}, s("rect", { x: x - breit / 2, y: yy - kh / 2, width: breit, height: kh, rx: 7, fill: "#e3e6f3", stroke: "#4f5668", "stroke-width": 1.8 }),
        zahnrad, text(x, yy + 6, inhalt, { gross: 16 }));
    };
    // Förderband vom Eingang zum Ausgang
    const band = d => s("path", { d, fill: "none", stroke: "#c4c9dc", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" });
    if (z.weiche) {
      // Weiche: die Frage, zwei Wege (✓ gerade, ✗ ungerade); der gewählte trägt die Kästen, der andere ist blass
      const wx = 84;
      svg.append(band(`M${ein},${y} H${wx}`), band(`M${wx},${y} L${xsK[0] - 34},${yWeg} H${aus}`),
        s("path", { d: `M${wx},${y} L${xsK[0] - 34},${zweig === "ja" ? 112 : 36} H${xsK[0] + 30}`, fill: "none", stroke: "#e3e6f3", "stroke-width": 7, "stroke-linecap": "round" }),
        kasten(wx, y, "gerade?", false, 76),
        text(xsK[0] - 44, 30, "✓", { gross: 14, farbe: "#2fb36b" }), text(xsK[0] - 44, 132, "✗", { gross: 14, farbe: "#c0392b" }));
      const anders = zweig === "ja" ? "nein" : "ja";
      svg.appendChild(s("g", { opacity: 0.35 }, kasten(xsK[0], anders === "ja" ? 36 : 112, termText(z.weiche[anders]), false)));
    } else svg.appendChild(band(`M${ein},${y} H${aus}`));
    kaesten.forEach((k, i) => svg.appendChild(kasten(xsK[i], ysK[i], termText(k))));
    // die Zahl reist: vor jedem Kasten, dahinter mit dem neuen Wert; die Startzahl bleibt am Eingang stehen
    const punkte = z.weiche ? [[ein, y], [84, y], ...xsK.map((x, i) => [x, ysK[i]]), [aus, yWeg]] : [[ein, y], ...xsK.map(x => [x, y]), [aus, y]];
    const werteAn = z.weiche ? [zahlen[0], zahlen[0], ...zahlen.slice(1)] : zahlen;
    const marke = (wert, x, yy, attr = {}) => s("g", { "data-zahl": wert, ...attr }, s("circle", { cx: x, cy: yy, r: 17, fill: "#ffffff", stroke: "var(--knopf)", "stroke-width": 2.2 }),
      text(x, yy + 5, ganzText(wert), { gross: String(wert).length >= 4 ? 11 : 15 }));
    svg.appendChild(marke(z.start, ein, y, { opacity: 0.55 }));
    const strecken = punkte.length - 1, je = (DAUER * 0.9) / strecken;
    for (let i = 0; i < strecken; i++) {
      const [x1, y1] = punkte[i], [x2, y2] = punkte[i + 1];
      const m = marke(werteAn[i], 0, 0), letzte = i === strecken - 1;
      // die letzte Strecke trägt das Ergebnis zum Ausgang und bleibt dort stehen
      if (ruhig) { if (letzte) { m.setAttribute("transform", `translate(${x2} ${y2})`); svg.appendChild(m); } continue; }
      m.setAttribute("opacity", "0");
      m.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(i * je), fill: "freeze" }));
      m.appendChild(s("animateMotion", { path: `M${x1},${y1} L${x2},${y2}`, begin: t(i * je), dur: `${je}s`, fill: "freeze" }));
      if (!letzte) m.appendChild(s("set", { attributeName: "opacity", to: 0, begin: t((i + 1) * je), fill: "freeze" }));
      svg.appendChild(m);
    }
    svg.appendChild(erscheine(zeileUnten([z.start, ...kaesten.map(k => termText(k))].map((v, i) => (i ? v : ganzText(v))).join(" → ") + ` → ${ganzText(w)}`, 144), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(aus, ysK[ysK.length - 1] - 26, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 26, ruhig)); // oben links: oben in der Mitte stehen in s6 die Kästen
    return svg;
  }

  // ----- Zielzahl-Jagd (ZOOM · zielscheibe) -----
  /**
   * Die Karten legen sich zur Rechnung (die nicht gebrauchten bleiben blass liegen), dann trifft der Pfeil die
   * Zielscheibe mit der Zielzahl. alle: jede Karte muss in die Rechnung (Stufe 6). Nachgerechnet, jede Karte höchstens einmal.
   */
  function zielscheibe(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.karten) || !Array.isArray(z.rechnung) || wertVon(z.rechnung) !== z.ziel) return null;
    const zahlen = z.rechnung.filter((_, i) => i % 2 === 0), frei = [...z.karten];
    for (const v of zahlen) { const i = frei.indexOf(v); if (i < 0) return null; frei.splice(i, 1); }
    if (z.alle && frei.length) return null;
    const svg = neuesBild("zoom", z.ziel, { "data-bilder": "zielscheibe", "data-wert": z.ziel });
    svg.appendChild(tagGrund());
    // Zielscheibe rechts oben
    const cx = 258, cy = 50;
    [[40, "#e5484d"], [31, "#ffffff"], [22, "#e5484d"], [14, "#ffffff"]].forEach(([r, f]) => svg.appendChild(s("circle", { cx, cy, r, fill: f, stroke: "#c0392b", "stroke-width": 0.8 })));
    svg.appendChild(text(cx, cy + 5, ganzText(z.ziel), { gross: z.ziel >= 100 ? 11 : 13 }));
    // Karten oben links, dann in die Zeile der Rechnung
    const kb = 28, ky0 = 20, zeileY = 100;
    const teile = z.rechnung.map(x => (typeof x === "number" ? ganzText(x) : x === "-" ? "−" : x));
    const breite = teile.map(t0 => (/^\d/.test(t0) ? kb + 4 : 14));
    const gesamt = breite.reduce((a, b) => a + b, 0) + 52;
    let x = (BREITE - gesamt) / 2;
    const benutzt = new Set();
    const kartenX = z.karten.map((_, i) => 16 + i * (kb + 6) + kb / 2);
    z.rechnung.forEach((v, i) => {
      const w = breite[i];
      const mx = x + w / 2;
      if (typeof v === "number") {
        const k = z.karten.findIndex((q, j) => q === v && !benutzt.has(j));
        benutzt.add(k);
        const karte = s("g", { "data-stueck": "karte" }, s("rect", { x: mx - kb / 2, y: zeileY - 22, width: kb, height: 32, rx: 4, fill: "#ffffff", stroke: "#6b7089", "stroke-width": 1.4 }),
          text(mx, zeileY, teile[i], { gross: v >= 100 ? 10 : 13 }));
        // die Karte liegt zuerst oben bei den Karten und fliegt an ihren Platz in der Rechnung
        if (!ruhig) {
          karte.setAttribute("transform", `translate(${kartenX[k] - mx} ${ky0 + 22 - zeileY})`);
          karte.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: `${kartenX[k] - mx} ${ky0 + 22 - zeileY}`, to: "0 0", begin: t(0.2 + (i / 2) * 0.3), dur: "0.5s", fill: "freeze" }));
        }
        svg.appendChild(karte);
      } else svg.appendChild(erscheine(text(mx, zeileY, teile[i], { gross: 14 }), 0.5 + (i / 2) * 0.3, ruhig));
      x += w;
    });
    // nicht gebrauchte Karten bleiben blass oben liegen
    z.karten.forEach((v, j) => { if (!benutzt.has(j)) svg.appendChild(s("g", { opacity: 0.35 }, s("rect", { x: kartenX[j] - kb / 2, y: ky0, width: kb, height: 32, rx: 4, fill: "#ffffff", stroke: "#6b7089", "stroke-width": 1.4 }), text(kartenX[j], ky0 + 22, ganzText(v), { gross: 13 }))); });
    svg.appendChild(erscheine(text(x + 26, zeileY, `= ${ganzText(z.ziel)}`, { gross: 14 }), DAUER * 0.6, ruhig));
    // der Pfeil trifft den inneren Ring knapp neben der Zahl (sonst verdeckte er sie)
    const tx = cx - 13, ty0 = cy - 10, kx = cx - 70, ky = cy - 40;
    svg.appendChild(bewege(pfeil(), `M${cx - 130},${cy + 50} Q${kx},${ky} ${tx},${ty0}`, { x: tx, y: ty0, winkel: (Math.atan2(ty0 - ky, tx - kx) * 180) / Math.PI }, ruhig,
      { ab: DAUER * 0.65, dauer: DAUER * 0.35 }));
    if (sterne >= 2) svg.appendChild(glanz(cx + 30, cy - 34, ruhig));
    if (sterne >= 3) svg.appendChild(funken(cx, cy, ruhig));
    return svg;
  }

  // ----- Probe-Stempel (SAMMELN · probe) -----
  const UMKEHR = { "+": "−", "−": "+", "-": "+", "·": ":", "×": ":", ":": "·" };
  /**
   * Im Heft steht die Rechnung, darunter die Probe der Stufe — Umkehraufgabe, Endziffer oder Überschlag —, dann kommt der
   * Stempel. Alles nachgerechnet; bei der Endziffer leuchten die letzten Ziffern.
   */
  function probe(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.rechnung) || z.rechnung.length !== 3) return null;
    const [a, op, b] = z.rechnung, c = wertVon(z.rechnung);
    if (!Number.isInteger(c) || c < 0) return null;
    let zeile2;
    if (z.art === "umkehr") {
      const zurueck = [c, UMKEHR[op], b];
      if (wertVon(zurueck) !== a) return null;
      zeile2 = [termText(zurueck), "=", ganzText(a)];
    } else if (z.art === "endziffer") {
      if (!["+", "·", "×"].includes(op)) return null;
      const e = wertVon([a % 10, op, b % 10]);
      if (e % 10 !== c % 10) return null;
      zeile2 = [termText([a % 10, op, b % 10]), "=", ganzText(e)];
    } else if (z.art === "ueberschlag") {
      const u = wertVon([z.ra, op, z.rb]);
      if (!Number.isFinite(u) || Math.abs(c - u) > 0.15 * u) return null;
      zeile2 = ["≈", termText([z.ra, op, z.rb]), "=", ganzText(u)];
    } else return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "probe", "data-wert": c });
    svg.appendChild(tagGrund());
    // Heftseite: Linien, roter Rand
    svg.append(s("rect", { x: 34, y: 10, width: 252, height: 126, rx: 4, fill: "#fffdf6", stroke: "#d8d2c0", "stroke-width": 1 }),
      ...[40, 66, 92, 118].map(y => s("line", { x1: 34, y1: y, x2: 286, y2: y, stroke: "#cfe2f7", "stroke-width": 1 })),
      s("line", { x1: 58, y1: 10, x2: 58, y2: 136, stroke: "#f0a0a0", "stroke-width": 1.2 }));
    const endF = "#e5484d";
    // Rechnung, bei der Endziffer die letzte Ziffer farbig
    const zeile1 = s("text", { x: 70, y: 36, fill: "#2d3047", "font-size": 15, "font-weight": "bold", "font-family": SCHRIFT, "text-anchor": "start" });
    const mitEnde = (v, farbig) => { const t0 = ganzText(v); return farbig ? [t0.slice(0, -1), s("tspan", { fill: endF }, t0.slice(-1))] : [t0]; };
    const endz = z.art === "endziffer";
    [...mitEnde(a, endz), ` ${OP_TEXT[op] || op} `, ...mitEnde(b, endz), " = ", ...mitEnde(c, endz)].forEach(x => zeile1.appendChild(typeof x === "string" ? document.createTextNode(x) : x));
    svg.appendChild(zeile1);
    const z2 = text(70, 62, zeile2.join(" "), { gross: 15, anker: "start", farbe: "#2f7a50" });
    svg.appendChild(erscheine(z2, DAUER * 0.35, ruhig));
    // Stempel: kommt von oben und drückt auf
    const stempel = s("g", { "data-teil": "stempel" }, s("circle", { cx: 242, cy: 100, r: 22, fill: "none", stroke: "#2fb36b", "stroke-width": 3 }),
      s("path", { d: "M231,100 l8,8 l14,-16", stroke: "#2fb36b", "stroke-width": 4, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }));
    // um die Mitte des Stempels skaliert: aussen an die Mitte verschoben, innen zurück, dazwischen die Skalierung
    const druck = s("g", {}, s("g", { transform: "translate(-242 -100)" }, stempel));
    if (!ruhig) {
      stempel.setAttribute("opacity", "0");
      stempel.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(DAUER * 0.75), fill: "freeze" }));
      druck.appendChild(s("animateTransform", { attributeName: "transform", type: "scale", values: "1.5;0.95;1", keyTimes: "0;0.7;1", begin: t(DAUER * 0.75), dur: "0.4s", fill: "freeze" }));
    }
    svg.appendChild(s("g", { transform: "translate(242 100)" }, druck));
    if (sterne >= 2) svg.appendChild(glanz(272, 72, ruhig));
    if (sterne >= 3) svg.appendChild(funken(160, 120, ruhig));
    return svg;
  }

  // ----- Gerecht-Teiler (SAMMELN · teller) -----
  /**
   * Die Guetzli wandern von vollen Tellern zu leeren, bis alle gleich viel haben; was nicht aufgeht, liegt in der Schale
   * (ab Stufe 5; in Stufe 6 kommen auch Guetzli aus der Schale auf die Teller). Unter jedem Teller zum Schluss seine Zahl.
   */
  function teller(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.teller) || z.teller.length < 2 || z.teller.length > 4 || z.teller.some(v => !Number.isInteger(v) || v < 0)) return null;
    const mitSchale = Number.isInteger(z.schale), schale0 = mitSchale ? z.schale : 0, n = z.teller.length;
    const gesamt = z.teller.reduce((a, b) => a + b, 0) + schale0, ziel = Math.floor(gesamt / n), rest = gesamt % n;
    if (rest && !mitSchale) return null;
    if (Math.max(...z.teller, ziel) > 15) return null;
    // Züge: je ein Guetzli von einem Überschuss (Teller über dem Ziel, Schale über dem Rest) zu einem Mangel
    const stand = [...z.teller, schale0], soll = [...Array(n).fill(ziel), rest], zuege = [];
    for (;;) {
      const von = stand.findIndex((v, i) => v > soll[i]), nach = stand.findIndex((v, i) => v < soll[i]);
      if (von < 0 || nach < 0) break;
      zuege.push([von, nach, stand[von] - 1, stand[nach]]);
      stand[von]--; stand[nach]++;
    }
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "teller", "data-anzahl": gesamt, "data-wert": ziel });
    svg.appendChild(tagGrund());
    const breiteT = mitSchale ? 236 : 290, tw = breiteT / n, xs = [...Array.from({ length: n }, (_, i) => 15 + tw / 2 + i * tw), 280], ty = 96;
    xs.slice(0, n).forEach(x => svg.appendChild(s("ellipse", { cx: x, cy: ty + 12, rx: Math.min(46, tw / 2 - 4), ry: 10, fill: "#ffffff", stroke: "#b8a98a", "stroke-width": 1.4 })));
    if (mitSchale) svg.appendChild(s("path", { d: `M252,${ty - 6} Q280,${ty + 30} 308,${ty - 6} Z`, fill: "#fff6d6", style: "stroke:var(--deko-4)", "stroke-width": 2.5 }));
    // grosse Guetzli, in Reihen zu höchstens fünf: zählbar wie im Spiel
    const sp = 13, spalten = i => (i === n ? 3 : Math.max(2, Math.min(5, Math.floor((tw - 8) / sp))));
    const platz = (i, k) => [xs[i] + ((k % spalten(i)) - (spalten(i) - 1) / 2) * sp, ty + 4 - Math.floor(k / spalten(i)) * sp];
    // Guetzli an ihren Plätzen; die wandernden bekommen ihren Weg
    const wandert = new Map(zuege.map(([von, nach, kVon, kNach], j) => [`${von}:${kVon}`, { nach, kNach, j }]));
    const je = zuege.length ? (DAUER * 0.75) / zuege.length : 0;
    [...z.teller, schale0].forEach((anzahl, i) => {
      for (let k = 0; k < anzahl; k++) {
        const [x, y] = platz(i, k), g = guetzli(x, y, 6.2);
        g.setAttribute("data-stueck", "guetzli");
        const w = wandert.get(`${i}:${k}`);
        if (w) {
          const [x2, y2] = platz(w.nach, w.kNach);
          svg.appendChild(schiebe(g, x2 - x, y2 - y, 0.2 + w.j * je, ruhig, { dauer: Math.max(0.35, je), bogen: 26 }));
        } else svg.appendChild(g);
      }
    });
    xs.slice(0, n).forEach(x => svg.appendChild(erscheine(text(x, ty + 40, ziel, { gross: 16 }), DAUER * 0.9, ruhig)));
    if (rest) svg.appendChild(erscheine(text(280, ty + 40, rest, { gross: 14, farbe: "#6b7089" }), DAUER * 0.9, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 20, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 22, ruhig));
    return svg;
  }

  BILDER.zoom.zielscheibe = zielscheibe;
  Object.assign(BILDER.sammeln, { reste, trick, probe, teller });
  Object.assign(BILDER.bauen, { punktfeld, ergaenzen, haus, waage, schriftlich, malkreuz, maschine });
  BILDER.wachsen = { spiegel };

  // ---------- Bilder Block M4: Sachrechnen, Grössen (AR1 a, LERN_Session29) ----------
  // Wie M2 und M3: jedes Bild folgt den Stufen seines Spiels und rechnet nach, was es zeigt (Uhrzeiten, Geld,
  // Umwandlungen, Gleichungen); ohne stimmige Angabe kein Bild. Dinge, die das Spiel als Bildzeichen (Emoji) zeigt,
  // zeigt das Bild ebenso (Schätz-Waage, Gegenteil-Wippe, Rechengeschichten).

  const EMOJI = "\"Segoe UI Emoji\", \"Apple Color Emoji\", \"Noto Color Emoji\", system-ui, sans-serif";
  /** Bildzeichen wie im Spiel (Emoji), Mitte bei x, y. */
  const bildzeichen = (x, y, z, gross = 24) => s("text", { x, y: (y + gross * 0.36).toFixed(1), "font-size": gross, "font-family": EMOJI, "text-anchor": "middle" }, z);
  /** Zahl auf neun Stellen gerundet (Gleitkomma: 21.6 : 3 = 7.2, nicht 7.199…). */
  const rund = x => Math.round(x * 1e9) / 1e9;
  /** Grösse als Text: „3.25 m“, „300 000 cm“ (Dezimalzeichen nach Einstellung). */
  const groesse = (wert, einheit) => `${zahlGeschrieben(rund(wert))} ${einheit}`;
  // Einheiten je Familie in der kleinsten Einheit, wie die Treppen der Spiele (Masse-Umwandler, Flächenmass-Treppe)
  const EINHEITEN = {
    laenge: { mm: 1, cm: 10, dm: 100, m: 1000, km: 1e6 },
    hohl: { ml: 1, cl: 10, dl: 100, l: 1000 },
    gewicht: { mg: 1, g: 1000, kg: 1e6, t: 1e9 },
    zeit: { s: 1, min: 60, h: 3600 },
    geld: { "Rp.": 1, "Fr.": 100 },
    flaeche: { "mm²": 1, "cm²": 100, "dm²": 1e4, "m²": 1e6, a: 1e8, ha: 1e10, "km²": 1e12 },
  };
  const familie = e => Object.keys(EINHEITEN).find(f => e in EINHEITEN[f]);
  /** Wert einer Grösse in der kleinsten Einheit ihrer Familie. */
  const basis = (wert, einheit) => wert * EINHEITEN[familie(einheit)][einheit];
  /** Klasse einer Stufe aus der Basisklasse des Spiels (feier.klasse; LS.SKALA: s1 eine tiefer, s5 und s6 eine höher). */
  function klasseDer(feier, stufe) {
    const st = typeof LS !== "undefined" && LS.SKALA ? LS.SKALA.find(x => x.id === stufe) : null;
    return feier.klasse ? feier.klasse + (st ? st.rel ?? 1 : 0) : 4;
  }
  /** Geld wie die Klasse der Stufe es schreibt (LS.geldText): bis 3. Klasse „7 Fr. 40 Rp.“, ab 4. Klasse „7.40 Fr.“. */
  const geldIn = (rp, klasse) => (typeof LS !== "undefined" && LS.geldText ? LS.geldText(rp, klasse) : geld(rp));
  /** Dauer in Minuten wie in den Spielen: „2 h 33 min“, „35 min“, „1 h“. */
  const dauerText = d => (d >= 60 ? `${Math.floor(d / 60)} h${d % 60 ? ` ${d % 60} min` : ""}` : `${d} min`);
  /** „8:47“ → Minuten seit Mitternacht (null, wenn ungültig). */
  function minutenVon(zeit) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(typeof zeit === "string" ? zeit : "");
    if (!m || +m[1] > 23 || +m[2] > 59) return null;
    return +m[1] * 60 + +m[2];
  }
  /** Uhrzeit wie in den Spielen: „7:05“, „0:21“ (über Mitternacht von vorn). */
  const uhrzeitText = m => `${Math.floor((m % 1440) / 60)}:${String(m % 60).padStart(2, "0")}`;
  /** Dezimalstunden mit höchstens zwei Stellen (90 min → „1.5 h“); null, wenn sie nicht aufgehen. */
  function stundenText(min) {
    const h = rund(min / 60);
    return Math.abs(h * 100 - Math.round(h * 100)) > 1e-6 ? null : `${zahlText(h, nachkomma(h))} h`;
  }
  /** Gleichung mit einer Lücke „?“ prüfen: [28, "+", "?", "=", 50] mit wert 22 → wahr. */
  function gleichungGilt(gl, wert) {
    if (!Array.isArray(gl) || gl.filter(x => x === "=").length !== 1 || gl.filter(x => x === "?").length !== 1 || !Number.isFinite(wert)) return false;
    const voll = gl.map(x => (x === "?" ? wert : x)), i = voll.indexOf("=");
    const l = wertVon(voll.slice(0, i)), r = wertVon(voll.slice(i + 1));
    return Number.isFinite(l) && Math.abs(l - r) < 1e-9;
  }
  /** Raster für n Dinge im Rechteck x, y, b, h: Mitten der Plätze, Zeile um Zeile. */
  function rasterIn(n, x, y, b, h) {
    const spalten = Math.max(1, Math.ceil(Math.sqrt((n * b) / h))), zeilen = Math.ceil(n / spalten);
    const sx = b / spalten, sy = h / zeilen;
    return { zelle: Math.min(sx, sy), plaetze: Array.from({ length: n }, (_, i) => [x + sx * ((i % spalten) + 0.5), y + sy * (Math.floor(i / spalten) + 0.5)]) };
  }

  // ----- Uhr-Werkstatt, Zeit-Schätzer (ZYKLUS · uhr) -----
  /** Zifferblatt wie in der Uhr-Werkstatt (60 Striche, Zahlen 1–12); stoppuhr: 5 bis 60 und eine Krone oben. */
  function zifferblatt(cx, cy, r, stoppuhr) {
    const g = s("g", {});
    if (stoppuhr) g.append(s("rect", { x: cx - 5, y: cy - r - 9, width: 10, height: 7, rx: 2, fill: "#6b7089" }), s("rect", { x: cx - 8, y: cy - r - 12, width: 16, height: 4, rx: 2, fill: "#4f5668" }));
    g.appendChild(s("circle", { cx, cy, r, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 3 }));
    let klein = "", gross = "";
    for (let i = 0; i < 60; i++) {
      const w = (i * 6 * Math.PI) / 180, lang = i % 5 === 0, r1 = r * (lang ? 0.8 : 0.88), r2 = r * 0.95;
      const d = `M${(cx + Math.sin(w) * r1).toFixed(2)},${(cy - Math.cos(w) * r1).toFixed(2)} L${(cx + Math.sin(w) * r2).toFixed(2)},${(cy - Math.cos(w) * r2).toFixed(2)} `;
      if (lang) gross += d; else klein += d;
    }
    g.append(s("path", { d: klein, stroke: "#2d3047", "stroke-width": 1 }), s("path", { d: gross, stroke: "#2d3047", "stroke-width": 2.4 }));
    for (let z = 1; z <= 12; z++) {
      const w = (z * 30 * Math.PI) / 180;
      g.appendChild(text(cx + Math.sin(w) * r * 0.64, cy - Math.cos(w) * r * 0.64 + 3.6, stoppuhr ? z * 5 : z, { gross: stoppuhr ? 9 : 10.5 }));
    }
    return g;
  }
  /** Zeiger um cx, cy (Winkel im Uhrzeigersinn ab 12 Uhr), dreht von a1 nach a2. */
  function zeiger(cx, cy, laenge, breite, farbe, a1, a2, ruhig, ab, dauer) {
    const g = s("g", { transform: `rotate(${ruhig ? a2 : a1} ${cx} ${cy})` },
      s("line", { x1: cx, y1: cy + laenge * 0.12, x2: cx, y2: cy - laenge, style: `stroke:${farbe}`, "stroke-width": breite, "stroke-linecap": "round" }));
    if (!ruhig) g.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `${a1} ${cx} ${cy}`, to: `${a2} ${cx} ${cy}`, begin: t(ab), dur: `${dauer}s`,
      fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }));
    return g;
  }
  /** Überstrichener Teil des Zifferblatts als Torte (Kreis mit breitem, gestricheltem Rand), wächst mit dem Zeiger. */
  function torte(cx, cy, r, a1, a2, farbe, ruhig, ab, dauer) {
    const rr = r / 2, u = 2 * Math.PI * rr, l = (Math.min(a2 - a1, 360) / 360) * u;
    // Deckkraft fürs Ganze, nicht für den Strich: sonst zeigen sich die Stösse des breiten Strichs als Nähte
    const c = s("circle", { cx, cy, r: rr, fill: "none", style: `stroke:${farbe}`, "stroke-width": r, opacity: 0.3,
      transform: `rotate(${a1 - 90} ${cx} ${cy})`, "stroke-dasharray": `${(ruhig ? l : 0).toFixed(2)} ${u.toFixed(2)}`, "data-torte": a2 - a1 });
    if (!ruhig) c.appendChild(s("animate", { attributeName: "stroke-dasharray", from: `0 ${u.toFixed(2)}`, to: `${l.toFixed(2)} ${u.toFixed(2)}`, begin: t(ab), dur: `${dauer}s`,
      fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }));
    return c;
  }
  /**
   * Die Zeiger drehen wie im Spiel: zeit (von → zeit, die Uhrzeit der Stufe; digital: daneben die Digitalanzeige),
   * dauer (von + dauer Minuten, die überstrichene Zeit als Torte; zerlegen: „135 min = 2 h 15 min“), bis (Zeitspanne
   * von → bis), sekunden oder minuten (Stoppuhr: ein Zeiger überstreicht die Dauer, 60 s = 1 min, 60 min = 1 h).
   */
  function uhr(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    // die Stoppuhr etwas tiefer und kleiner: ihre Krone ragte sonst 2 Einheiten über den Rand (Prüfung Lage)
    const stopp = z.sekunden !== undefined || z.minuten !== undefined;
    const cx = 160, cy = stopp ? 68 : 64, r = stopp ? 52 : 54, ab = 0.15, dauer = DAUER * 0.75;
    const svg = neuesBild("zyklus", stufe, { "data-bilder": "uhr" });
    svg.appendChild(tagGrund());
    let zeile = null, digital = null;
    if (z.sekunden !== undefined || z.minuten !== undefined) {
      const sek = z.sekunden !== undefined, n = sek ? z.sekunden : z.minuten;
      if (!Number.isInteger(n) || n < 1 || n > 60) return null;
      svg.append(zifferblatt(cx, cy, r, true), torte(cx, cy, r * 0.9, 0, n * 6, sek ? "#e5484d" : "var(--knopf)", ruhig, ab, dauer),
        zeiger(cx, cy, r * 0.84, sek ? 1.8 : 3.5, sek ? "#e5484d" : "var(--knopf)", 0, n * 6, ruhig, ab, dauer));
      svg.setAttribute("data-wert", sek ? n : n * 60);
      zeile = n === 60 ? (sek ? "60 s = 1 min" : "60 min = 1 h") : `${n} ${sek ? "s" : "min"}`;
    } else {
      const von = minutenVon(z.von);
      if (von === null) return null;
      let d;
      if (z.zeit !== undefined) { const m = minutenVon(z.zeit); if (m === null) return null; d = (m - von + 1440) % 1440; }
      else if (z.bis !== undefined) { const m = minutenVon(z.bis); if (m === null) return null; d = (m - von + 1440) % 1440; }
      else d = z.dauer;
      if (!Number.isInteger(d) || d < 1 || d > 600) return null;
      const bis = von + d, aM = (von % 60) * 6, aH = ((von / 60) % 12) * 30;
      svg.appendChild(zifferblatt(cx, cy, r, false));
      if (z.zeit === undefined && d <= 60) svg.appendChild(torte(cx, cy, r * 0.9, aM, aM + d * 6, "var(--deko-3)", ruhig, ab, dauer));
      svg.append(zeiger(cx, cy, r * 0.5, 5, "#2d3047", aH, aH + d * 0.5, ruhig, ab, dauer),
        zeiger(cx, cy, r * 0.8, 3.5, "var(--knopf)", aM, aM + d * 6, ruhig, ab, dauer));
      svg.setAttribute("data-wert", uhrzeitText(bis));
      if (z.zeit !== undefined) { if (z.digital) digital = uhrzeitText(bis); }
      else if (z.bis !== undefined) zeile = `${uhrzeitText(von)} → ${uhrzeitText(bis)} = ${dauerText(d)}`;
      else zeile = z.zerlegen ? `${d} min = ${dauerText(d)}` : `${uhrzeitText(von)} + ${dauerText(d)} = ${uhrzeitText(bis)}`;
    }
    svg.appendChild(s("circle", { cx, cy, r: 3.5, fill: "#2d3047" }));
    if (digital) svg.appendChild(erscheine(s("g", { "data-zeile": "digital" }, s("rect", { x: 236, y: 50, width: 62, height: 28, rx: 5, fill: "#2d3047" }),
      text(267, 70, digital, { gross: 17, farbe: "#9ff0b4" })), DAUER * 0.8, ruhig));
    if (zeile) svg.appendChild(erscheine(zeileUnten(zeile, 142), DAUER * 0.8, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(cx + r * 0.8, cy - r * 0.8, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 40, 28, ruhig));
    return svg;
  }

  // ----- Kiosk-Kasse (SAMMELN · kasse) -----
  // Münzen und Noten wie im Spiel: Münzen silbern (5 Rp. golden), die Grösse nach dem Spiel; Noten in den Farben des
  // Spiels, nur mit dem Wert (keine echten Notenbilder).
  const GELD = { 5: { r: 11.3, gelb: true }, 10: { r: 12.4 }, 20: { r: 13.5 }, 50: { r: 11.9 }, 100: { r: 14.6 }, 200: { r: 16.2 }, 500: { r: 17.8 },
    1000: { note: "#f7d64a" }, 2000: { note: "#ef6f6f", hell: true }, 5000: { note: "#6cc77c" }, 10000: { note: "#6aa4e6", hell: true } };
  const geldBreite = rp => (GELD[rp].note ? 48 : 2 * GELD[rp].r + 4);
  /** Münze oder Note, Mitte bei 0,0. */
  function geldStueck(rp) {
    const d = GELD[rp];
    if (d.note) return s("g", {}, s("rect", { x: -23, y: -13, width: 46, height: 26, rx: 3, fill: d.note, stroke: "#2d3047", "stroke-opacity": 0.25, "stroke-width": 1.2 }),
      text(0, 4, `${rp / 100} Fr.`, { gross: 11, farbe: d.hell ? "#ffffff" : "#3b3b3b" }));
    const fr = rp >= 100;
    return s("g", {}, s("circle", { cx: 0, cy: 0, r: d.r, fill: d.gelb ? "#e8c75a" : "#d5d9de", stroke: d.gelb ? "#b8962a" : "#9aa1ab", "stroke-width": 1.6 }),
      text(0, -0.5, fr ? rp / 100 : rp, { gross: Math.min(12, d.r * 0.85), farbe: "#3b3b3b" }), text(0, 8.5, fr ? "Fr." : "Rp.", { gross: 9, farbe: "#3b3b3b", fett: false }));
  }
  /** So wenige Stücke wie möglich (gierig; das Schweizer Geld lässt das zu). */
  const wenigsteStuecke = rp => [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5].reduce(([n, rest], w) => [n + Math.floor(rest / w), rest % w], [0, rp])[0];
  /**
   * Geld fällt in die Kasse wie im Spiel: legen (Stücke legen, darunter der Betrag) oder Rückgeld (links die Preise, das
   * bezahlte Stück, das Rückgeld fällt in die Kasse; preise, menge, bezahlt, zurueck — nachgerechnet; wenig: das
   * Rückgeld mit so wenigen Stücken wie möglich). Beträge schreibt die Klasse der Stufe (feier.klasse).
   */
  function kasse(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const klasse = klasseDer(feier, stufe), g = rp => geldIn(rp, klasse), summe = a => a.reduce((x, y) => x + y, 0);
    const gueltig = a => Array.isArray(a) && a.length >= 1 && a.length <= 6 && a.every(rp => GELD[rp]);
    let zeile, stuecke, preise = null;
    if (z.legen) {
      if (!gueltig(z.legen)) return null;
      stuecke = z.legen;
      zeile = g(summe(stuecke));
    } else {
      if (!gueltig(z.zurueck) || !GELD[z.bezahlt] || !Array.isArray(z.preise) || !z.preise.length || z.preise.length > 3) return null;
      if (!z.preise.every(p => Number.isInteger(p) && p > 0 && p % 5 === 0)) return null;
      const menge = z.menge || 1, kosten = menge * summe(z.preise);
      if (kosten + summe(z.zurueck) !== z.bezahlt) return null;
      if (z.wenig && wenigsteStuecke(summe(z.zurueck)) !== z.zurueck.length) return null;
      stuecke = z.zurueck;
      preise = z.preise.map(p => (menge > 1 ? `${menge} × ${g(p)}` : g(p)));
      zeile = `${g(z.bezahlt)} − ${menge > 1 ? `${menge} × ${g(z.preise[0])}` : g(kosten)} = ${g(summe(z.zurueck))}`;
    }
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "kasse", "data-anzahl": stuecke.length, "data-wert": summe(stuecke) });
    svg.appendChild(tagGrund());
    // Kasse wie im Spiel: helles Feld mit gestricheltem Rand
    const kx = preise ? 118 : 20, kb = BREITE - 12 - kx, ky = 38, kh = 76;
    svg.appendChild(s("rect", { x: kx, y: ky, width: kb, height: kh, rx: 12, fill: "#f6f7fd", stroke: "#c9cde0", "stroke-width": 2, "stroke-dasharray": "6 4" }));
    let ab = 0.1;
    if (preise) {
      preise.forEach((p, i) => svg.appendChild(erscheine(s("g", {}, s("rect", { x: 8, y: 14 + i * 24, width: 102, height: 20, rx: 6, fill: "#fff8e1", stroke: "#f5c451", "stroke-width": 1.6 }),
        text(59, 28 + i * 24, p, { gross: 10.5 })), 0, ruhig)));
      // das bezahlte Stück kommt von links auf die Theke
      const bez = s("g", { "data-bezahlt": z.bezahlt }, s("g", { transform: `translate(58 ${Math.max(100, 32 + preise.length * 24)})` }, geldStueck(z.bezahlt)));
      if (!ruhig) bez.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "-70 0", to: "0 0", begin: t(0.2), dur: "0.5s", fill: "freeze" }));
      svg.appendChild(erscheine(bez, 0.2, ruhig));
      ab = 0.75;
    }
    // Stücke in einer oder zwei Reihen in der Kasse, nacheinander hineinfallend
    const breiten = stuecke.map(geldBreite), reihen = summe(breiten) > kb - 16 ? 2 : 1, jeReihe = Math.ceil(stuecke.length / reihen);
    const je = (DAUER * 0.85 - ab) / stuecke.length;
    stuecke.forEach((rp, i) => {
      const r0 = Math.floor(i / jeReihe), inReihe = stuecke.slice(r0 * jeReihe, (r0 + 1) * jeReihe), k = i - r0 * jeReihe;
      const b = summe(inReihe.map(geldBreite)), x = kx + (kb - b) / 2 + summe(inReihe.slice(0, k).map(geldBreite)) + geldBreite(rp) / 2;
      const y = ky + (reihen === 1 ? kh / 2 : kh / 4 + r0 * (kh / 2));
      const e = s("g", { "data-stueck": "geld", "data-wert": rp }, s("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, geldStueck(rp)));
      svg.appendChild(vonOben(e, ab + i * je, ruhig, 50, 0.35));
    });
    svg.appendChild(erscheine(zeileUnten(zeile, 140), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 24, 22, ruhig));
    if (sterne >= 3) svg.appendChild(funken(preise ? 210 : BREITE / 2, 18, ruhig));
    return svg;
  }

  // ----- Masse-Umwandler, Flächenmass-Treppe (BAUEN · treppe) -----
  const DEKO = i => `var(--deko-${(i % 6) + 1})`;
  /**
   * Einheiten-Treppe wie in den Spielen (grosse Einheit oben links, je Stufe der Faktor): eine Karte mit der Zahl
   * springt Stufe um Stufe zur gesuchten Einheit (von: Teile [[3, "m"], [25, "cm"]], nach), die letzte Karte trägt das
   * Ganze; darunter die Umwandlung. auslegen: ["dm²", "cm²"] legt das grosse Quadrat mit 10 × 10 kleinen aus; lineal:
   * [35, 27] (mm) legt zwei Längen auf das Lineal (3 cm 5 mm + 2 cm 7 mm = 62 mm).
   */
  function treppe(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    if (z.auslegen) return auslegen(z, { stufe, sterne, ruhig });
    if (z.lineal) return lineal(z, { stufe, sterne, ruhig });
    const teile = z.von;
    if (!Array.isArray(teile) || !teile.length || teile.some(x => !Array.isArray(x) || !Number.isFinite(x[0]) || x[0] < 0 || !familie(x[1]))) return null;
    const fam = familie(teile[0][1]);
    if (familie(z.nach) !== fam || teile.some(x => familie(x[1]) !== fam)) return null;
    const liste = Object.keys(EINHEITEN[fam]).reverse(); // gross → klein, wie die Treppe im Spiel
    const i0 = liste.indexOf(teile[0][1]), i1 = liste.indexOf(z.nach);
    const einheiten = liste.slice(Math.min(i0, i1), Math.max(i0, i1) + 1), n = einheiten.length;
    if (n < 2 || n > 5) return null;
    const ergebnis = rund(teile.reduce((a, [w, e]) => a + basis(w, e), 0) / EINHEITEN[fam][z.nach]);
    const runter = i0 < i1; // zur kleineren Einheit: die Zahl wird grösser
    const lauf = runter ? einheiten : einheiten.slice().reverse();
    // die Karten tragen den ersten Teil Stufe um Stufe; die übrigen Teile kommen auf der letzten Karte dazu („300 + 25“)
    const werte = lauf.map(e => rund(basis(teile[0][0], teile[0][1]) / EINHEITEN[fam][e]));
    const rest = rund(ergebnis - werte[n - 1]);
    const kartenText = k => (k === n - 1 && rest ? `${zahlGeschrieben(werte[k])} + ${zahlGeschrieben(rest)}` : zahlGeschrieben(werte[k]));
    const svg = neuesBild("bauen", stufe, { "data-bilder": "treppe", "data-wert": ergebnis });
    svg.appendChild(tagGrund());
    const w = Math.min(64, 272 / n), dh = Math.min(14, 44 / (n - 1)), x0 = (BREITE - n * w) / 2, oben = 52, grund = 124;
    const xs = einheiten.map((_, i) => x0 + i * w), ys = einheiten.map((_, i) => oben + i * dh);
    einheiten.forEach((e, i) => {
      const farbe = DEKO(Object.keys(EINHEITEN[fam]).indexOf(e));
      svg.append(s("rect", { x: xs[i] + 1, y: ys[i], width: w - 2, height: grund - ys[i], rx: 4, style: `fill:${farbe}` }),
        text(xs[i] + w / 2, ys[i] + 17, e, { gross: 13, farbe: "#ffffff" }));
    });
    svg.appendChild(s("rect", { x: x0 - 6, y: grund, width: n * w + 12, height: 4, rx: 2, fill: "#8a94a6" }));
    // Karten Stufe um Stufe; Bogen mit dem Faktor von einer zur nächsten
    const je = (DAUER * 0.8) / n;
    lauf.forEach((e, k) => {
      const i = einheiten.indexOf(e), cx = xs[i] + w / 2, cy = ys[i] - 13;
      if (k) {
        const j = einheiten.indexOf(lauf[k - 1]), px = xs[j] + w / 2, py = ys[j] - 13, hoch = Math.min(ys[i], ys[j]) - 36;
        const f = EINHEITEN[fam][einheiten[Math.min(i, j)]] / EINHEITEN[fam][einheiten[Math.max(i, j)]];
        const bogen = s("g", {}, s("path", { d: `M${px},${py - 11} Q${(px + cx) / 2},${hoch} ${cx},${cy - 12}`, fill: "none", stroke: "#6b7089", "stroke-width": 1.3 }),
          s("path", { d: `M${cx},${cy - 11} l-4,-5 m4,5 l3,-6`, stroke: "#6b7089", "stroke-width": 1.3, fill: "none" }),
          text((px + cx) / 2, hoch + 5, `${runter ? "×" : ":"}${ganzText(f)}`, { gross: 10, farbe: "#4f5668" }));
        svg.appendChild(erscheine(bogen, k * je - 0.15, ruhig, 0.2));
      }
      const kb = w - 6, karte = s("g", { "data-stueck": "karte", "data-wert": k === n - 1 ? ergebnis : werte[k] },
        s("rect", { x: cx - kb / 2, y: cy - 10, width: kb, height: 20, rx: 5, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 1.2 }),
        text(cx, cy + 4.5, kartenText(k), { gross: kartenText(k).length > 8 ? 10 : 11.5 }));
      svg.appendChild(vonOben(karte, k * je, ruhig, 24, 0.3));
    });
    const links = teile.map(([w0, e]) => groesse(w0, e)).join(" ");
    svg.appendChild(erscheine(zeileUnten(`${links} = ${groesse(ergebnis, z.nach)}`, 142), DAUER * 0.8, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 22, 20, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 24, ruhig));
    return svg;
  }
  /** Auslegen (Flächenmass-Treppe, Stufe 1): das grosse Quadrat füllt sich Reihe um Reihe mit 10 × 10 kleinen. */
  function auslegen(z, { stufe, sterne, ruhig }) {
    const [gross, klein] = z.auslegen;
    if (familie(gross) !== "flaeche" || familie(klein) !== "flaeche" || EINHEITEN.flaeche[gross] / EINHEITEN.flaeche[klein] !== 100) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "treppe", "data-wert": 100, "data-anzahl": 10 });
    svg.appendChild(tagGrund());
    const c = 10, x0 = BREITE / 2 - 5 * c, y0 = 12, je = (DAUER * 0.75) / 10;
    for (let r = 0; r < 10; r++) {
      const reihe = s("g", { "data-stueck": "reihe" });
      for (let i = 0; i < 10; i++) reihe.appendChild(s("rect", { x: x0 + i * c, y: y0 + r * c, width: c, height: c, style: "fill:var(--deko-6)", stroke: "#ffffff", "stroke-width": 0.8 }));
      svg.appendChild(erscheine(reihe, r * je, ruhig, 0.15));
    }
    svg.appendChild(s("rect", { x: x0, y: y0, width: 10 * c, height: 10 * c, fill: "none", stroke: "#2d3047", "stroke-width": 2 }));
    svg.appendChild(erscheine(zeileUnten(`1 ${gross} = 100 ${klein}`, 138), DAUER * 0.8, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(x0 + 10 * c + 14, 20, ruhig));
    if (sterne >= 3) svg.appendChild(funken(40, 30, ruhig));
    return svg;
  }
  /** Länge in mm als „3 cm 5 mm“ (wie der Masse-Umwandler schreibt). */
  const cmMm = v => (v >= 10 ? `${Math.floor(v / 10)} cm${v % 10 ? ` ${v % 10} mm` : ""}` : `${v} mm`);
  /** Zwei Längen (in mm) nacheinander auf dem Lineal: zusammen die Summe in mm. */
  function lineal(z, { stufe, sterne, ruhig }) {
    const l = z.lineal;
    if (!Array.isArray(l) || l.length < 1 || l.length > 3 || !l.every(v => Number.isInteger(v) && v > 0)) return null;
    const ganz = l.reduce((a, b) => a + b, 0);
    if (ganz > 100) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "treppe", "data-wert": ganz });
    svg.appendChild(tagGrund());
    const L = 30, R = 290, px = mm => L + (mm / 100) * (R - L), ly = 74;
    // Lineal: cm mit Zahl, mm als kleine Striche
    svg.appendChild(s("rect", { x: L - 10, y: ly, width: R - L + 20, height: 30, rx: 3, fill: "#f7e3a1", stroke: "#b8962a", "stroke-width": 1.2 }));
    let striche = "";
    for (let mm = 0; mm <= 100; mm++) striche += `M${px(mm).toFixed(2)},${ly} v${mm % 10 ? (mm % 5 ? 5 : 8) : 11} `;
    svg.appendChild(s("path", { d: striche, stroke: "#2d3047", "stroke-width": 0.8 }));
    for (let cm = 0; cm <= 10; cm++) svg.appendChild(text(px(cm * 10), ly + 23, cm, { gross: 9.5 }));
    let start = 0;
    const je = (DAUER * 0.75) / l.length;
    l.forEach((v, i) => {
      const balken = s("rect", { x: px(start), y: ly - 16 + i * 0, width: px(v) - L, height: 12, rx: 2, style: `fill:${i % 2 ? "var(--deko-3)" : "var(--deko-6)"}`, "data-stueck": "laenge" });
      if (!ruhig) {
        balken.setAttribute("opacity", "0");
        balken.append(s("set", { attributeName: "opacity", to: 1, begin: t(i * je), fill: "freeze" }),
          s("animate", { attributeName: "width", from: 0, to: px(v) - L, begin: t(i * je), dur: `${je * 0.9}s`, fill: "freeze" }));
      }
      svg.appendChild(balken);
      svg.appendChild(erscheine(text(px(start + v / 2), ly - 22, cmMm(v), { gross: 10 }), i * je + je * 0.6, ruhig, 0.2));
      start += v;
    });
    svg.appendChild(erscheine(zeileUnten(`${l.map(cmMm).join(" + ")} = ${ganz} mm`, 140), DAUER * 0.8, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(Math.min(px(ganz) + 12, BREITE - 14), 34, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 34, 24, ruhig));
    return svg;
  }

  // ----- Komma-Messband (ZOOM · messband) -----
  /**
   * Messband wie ein Zahlenstrahl in der Einheit: je Stelle nach dem Komma eine Lupe tiefer, der Zeiger landet auf dem
   * Wert; darunter die Umwandlung (wert, einheit, nach; rueck: andersherum geschrieben, „75 cm = 0.75 m“; plus: eine
   * zweite Grösse dazu, „1.25 kg + 750 g = 2 kg“). Zahlen über LS.dezimalText.
   */
  function messband(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Number.isFinite(z.wert) || z.wert < 0 || z.wert >= 10 || !familie(z.einheit) || familie(z.nach) !== familie(z.einheit)) return null;
    const fam = familie(z.einheit), stellen = nachkomma(z.wert), inNach = (w, e) => rund(basis(w, e) / EINHEITEN[fam][z.nach]);
    if (stellen < 1 || stellen > 3) return null;
    let zeile;
    if (z.plus) {
      if (!Array.isArray(z.plus) || !Number.isFinite(z.plus[0]) || familie(z.plus[1]) !== fam) return null;
      zeile = `${groesse(z.wert, z.einheit)} + ${groesse(z.plus[0], z.plus[1])} = ${groesse(rund(inNach(z.wert, z.einheit) + inNach(z.plus[0], z.plus[1])), z.nach)}`;
    } else {
      const links = groesse(z.wert, z.einheit), rechts = groesse(inNach(z.wert, z.einheit), z.nach);
      zeile = z.rueck ? `${rechts} = ${links}` : `${links} = ${rechts}`;
    }
    const svg = neuesBild("zoom", z.wert, { "data-bilder": "messband", "data-wert": z.wert });
    svg.appendChild(tagGrund());
    const L = 30, R = 290, oben = 16, unten = 108, abstand = (unten - oben) / stellen, zeileY = k => unten - (stellen - k) * abstand;
    let von = 0, schritt = 1, landeX = L;
    for (let k = 0; k <= stellen; k++) {
      const y = zeileY(k), bis = von + 10 * schritt, pos = x => L + ((x - von) / (bis - von)) * (R - L);
      const g = s("g", { "data-zeile": k }, s("rect", { x: L - 4, y: y - 6, width: R - L + 8, height: 12, rx: 2, fill: "#f7d64a", stroke: "#b8962a", "stroke-width": 1 }));
      let d = "";
      for (let i = 0; i <= 10; i++) d += `M${(L + (i / 10) * (R - L)).toFixed(2)},${y - 6} v${i % 5 ? 4 : 7} `;
      g.append(s("path", { d, stroke: "#2d3047", "stroke-width": 1 }),
        text(L, y + 15, zahlText(rund(von), k), { gross: 9.5, fett: false }), text(R, y + 15, `${zahlText(rund(bis), k)}${k ? "" : ` ${z.einheit}`}`, { gross: 9.5, fett: false }));
      if (k < stellen) {
        const a = rund(von + Math.floor((z.wert - von) / schritt + 1e-9) * schritt), xa = pos(a), xb = pos(a + schritt);
        g.append(s("rect", { x: xa, y: y - 6, width: xb - xa, height: 12, fill: "#2fb36b", opacity: 0.45 }),
          s("path", { d: `M${xa},${y + 6} L${L},${zeileY(k + 1) - 7} M${xb},${y + 6} L${R},${zeileY(k + 1) - 7}`, stroke: "#2fb36b", "stroke-width": 0.9, "stroke-dasharray": "3 2", fill: "none" }));
        von = a; schritt /= 10;
      } else {
        landeX = pos(z.wert);
        g.appendChild(s("circle", { cx: landeX, cy: y, r: 3, fill: "#e5484d", "data-landung": z.wert }));
      }
      svg.appendChild(erscheine(g, (k / (stellen + 1)) * DAUER * 0.75, ruhig));
    }
    // Zeiger von oben auf den Wert
    const yz = zeileY(stellen) - 7, spitze = s("g", { "data-figur": "zeiger" }, s("path", { d: "M0,0 L-7,-12 L7,-12 Z", fill: "#e5484d", stroke: "#2d3047", "stroke-width": 0.8 }));
    svg.appendChild(bewege(spitze, `M${landeX},-14 L${landeX},${yz}`, { x: landeX, y: yz, winkel: 0 }, ruhig, { drehen: false, ab: DAUER * 0.55, dauer: DAUER * 0.4 }));
    svg.appendChild(erscheine(zeileUnten(zeile, 142), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(fahne(Math.min(landeX + 10, BREITE - 16), yz - 4, ruhig));
    if (sterne >= 3) svg.appendChild(funken(Math.min(Math.max(landeX, 24), BREITE - 24), zeileY(stellen), ruhig)); // um die Landestelle
    return svg;
  }

  // ----- Fahrplan-Rechner (REISE · zug) -----
  /** Zug nach rechts, Mitte unten auf 0,0. */
  function zugFigur(farbe) {
    return s("g", { "data-figur": "zug" },
      s("path", { d: "M-20,-2 L-20,-16 Q-20,-19 -17,-19 L12,-19 Q20,-19 22,-10 L22,-2 Z", style: `fill:${farbe}`, stroke: "#2d3047", "stroke-width": 0.8 }),
      s("rect", { x: -16, y: -16, width: 7, height: 6, rx: 1, fill: "#e8f4fb" }), s("rect", { x: -6, y: -16, width: 7, height: 6, rx: 1, fill: "#e8f4fb" }),
      s("path", { d: "M5,-16 L13,-16 Q17,-16 18,-10 L5,-10 Z", fill: "#e8f4fb" }),
      s("circle", { cx: -12, cy: -1, r: 2.6, fill: "#2d3047" }), s("circle", { cx: 12, cy: -1, r: 2.6, fill: "#2d3047" }));
  }
  /**
   * Der Zug fährt von Halt zu Halt, über jedem Halt die Zeit (beim Umsteigen Ankunft und Abfahrt); halte: ["7:42"] oder
   * ["8:19", "8:31"]; über Mitternacht weiter (Nachthimmel). Darunter die Rechnung: Zeitspanne, mit summe die Fahrzeiten
   * zusammengezählt (formate je Strecke "dauer" oder "dez"), in: "min" die Summe in Minuten, dezimal: dazu in Stunden.
   */
  function zug(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.halte) || z.halte.length < 2 || z.halte.length > 5) return null;
    const zeiten = z.halte.map(h => (Array.isArray(h) ? h : [h]).map(minutenVon));
    if (zeiten.some(h => !h.length || h.length > 2 || h.some(m => m === null))) return null;
    let letzte = null;
    const lauf = zeiten.map(h => h.map(m => { let x = m; if (letzte !== null) while (x < letzte) x += 1440; letzte = x; return x; }));
    const ankunft = h => h[0], abfahrt = h => h[h.length - 1];
    const start = abfahrt(lauf[0]), ende = ankunft(lauf[lauf.length - 1]), gesamt = ende - start;
    if (gesamt <= 0 || gesamt > 600) return null;
    const strecken = lauf.slice(1).map((h, i) => ankunft(h) - abfahrt(lauf[i]));
    if (strecken.some(d => d <= 0)) return null;
    let zeile;
    if (z.summe) {
      const teil = (d, i) => ((z.formate || [])[i] === "dez" ? stundenText(d) : dauerText(d));
      if (strecken.some((d, i) => teil(d, i) === null)) return null;
      zeile = `${strecken.map(teil).join(" + ")} = ${z.in === "min" ? `${gesamt} min` : dauerText(gesamt)}`;
    } else zeile = `${uhrzeitText(start)} → ${uhrzeitText(ende)} = ${dauerText(gesamt)}`;
    if (z.dezimal) { const h = stundenText(gesamt); if (!h) return null; zeile += ` = ${h}`; }
    const nacht = lauf.flat().some(m => m % 1440 >= 20 * 60 || m % 1440 < 6 * 60);
    const svg = neuesBild("reise", stufe, { "data-bilder": "zug", "data-wert": gesamt });
    if (nacht) svg.append(himmelGrund(), himmel(), mondphase(300, 15, 8, 0.75)); // über den Tafeln, nicht davor
    else svg.append(tagGrund(), boden());
    const n = lauf.length, xs = lauf.map((_, i) => 40 + (i * 240) / (n - 1)), gy = 104;
    // Gleis mit Schwellen
    let schwellen = "";
    for (let x = 16; x <= 304; x += 8) schwellen += `M${x},${gy - 1} v5 `;
    svg.append(s("path", { d: schwellen, stroke: "#8a5a32", "stroke-width": 2 }), s("line", { x1: 12, y1: gy, x2: 308, y2: gy, stroke: "#4f5668", "stroke-width": 2.4 }));
    // Zeitplan der Animation nach den Minuten (Fahrt und Warten)
    const T = DAUER * 0.85, zeitpunkt = m => ((m - start) / gesamt) * T;
    const farbeTafel = nacht ? "#e8e9f5" : "#2d3047";
    lauf.forEach((h, i) => {
      const x = xs[i], tafel = s("g", { "data-halt": h.map(uhrzeitText).join("-") },
        s("line", { x1: x, y1: gy - 2, x2: x, y2: h.length > 1 ? 70 : 54, stroke: "#8a94a6", "stroke-width": 1.4 }),
        s("rect", { x: x - 6, y: gy + 4, width: 12, height: 5, rx: 1, fill: "#8a94a6" }));
      h.forEach((m, k) => tafel.append(s("rect", { x: x - 21, y: 30 + k * 22, width: 42, height: 18, rx: 4, fill: nacht ? "#2d3266" : "#ffffff", stroke: farbeTafel, "stroke-width": 1 }),
        text(x, 43 + k * 22, uhrzeitText(m), { gross: 11, farbe: farbeTafel })));
      svg.appendChild(erscheine(tafel, i ? zeitpunkt(ankunft(h)) : 0, ruhig, 0.25));
    });
    // je Fahrt (bis zum nächsten Umsteigen) ein Zug; ein Halt mit zwei Zeiten ist ein Umsteigen
    const fahrten = [];
    let a = 0;
    for (let i = 1; i < n; i++) if (i === n - 1 || lauf[i].length > 1) { fahrten.push([a, i]); a = i; }
    fahrten.forEach(([i, j], f) => {
      const zf = zugFigur(DEKO(f + 1)), letzte0 = f === fahrten.length - 1;
      const g = bewege(zf, `M${xs[i]},${gy - 2} L${xs[j]},${gy - 2}`, { x: xs[j], y: gy - 2, winkel: 0 }, ruhig,
        { drehen: false, linear: true, ab: zeitpunkt(abfahrt(lauf[i])), dauer: Math.max(0.2, zeitpunkt(ankunft(lauf[j])) - zeitpunkt(abfahrt(lauf[i]))) });
      // der Zug davor fährt nach dem Umsteigen weg (im ruhigen Bild nur der letzte)
      svg.appendChild(letzte0 ? g : verschwinde(g, zeitpunkt(abfahrt(lauf[j])), ruhig, 0.2));
    });
    svg.appendChild(erscheine(s("text", { x: BREITE / 2, y: 140, fill: nacht ? "#ffffff" : "#2d3047", "font-size": zeile.length > 36 ? 11.5 : 13, "font-weight": "bold",
      "font-family": SCHRIFT, "text-anchor": "middle", "data-zeile": "unten" }, zeile), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(fahne(xs[n - 1] + 8, gy - 22, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 26, 118, ruhig)); // unten rechts: oben stehen die Zeiten
    return svg;
  }

  // ----- Sachaufgaben-Kompass (REISE · kompass) -----
  function kompassFigur() {
    return s("g", { "data-figur": "kompass" }, s("circle", { cx: 0, cy: 0, r: 10, fill: "#ffffff", stroke: "#4f5668", "stroke-width": 2 }),
      s("path", { d: "M0,-8 L3,0 L-3,0 Z", fill: "#e5484d" }), s("path", { d: "M0,8 L3,0 L-3,0 Z", fill: "#4f5668" }), s("circle", { cx: 0, cy: 0, r: 1.4, fill: "#2d3047" }));
  }
  /**
   * Der Kompass geht den Rechenweg ab: Karte um Karte ein Schritt (Rechnung mit Einheit, nachgerechnet), am Ziel das
   * Ergebnis mit Einheit. schritte: [{ r: [[21.6, "Fr."], ":", 3], e: "Fr." }], Teile mit Einheit als [wert, einheit];
   * unwichtig: eine Angabe, die man nicht braucht (durchgestrichen); saeulen: Werte eines kleinen Säulendiagramms, aus
   * dem die Angaben stammen. Franken schreibt die Klasse der Stufe (feier.klasse).
   */
  function kompass(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.schritte) || !z.schritte.length) return null;
    const klasse = klasseDer(feier, stufe);
    const mitEinheit = (v, e) => (e === "Fr." ? geldIn(Math.round(v * 100), klasse) : e ? groesse(v, e) : zahlGeschrieben(rund(v)));
    const karten = [];
    for (const st of z.schritte) {
      if (!st || !Array.isArray(st.r)) return null;
      const zahlen = st.r.map(x => (Array.isArray(x) ? x[0] : x)), w = rund(wertVon(zahlen));
      if (!Number.isFinite(w) || w < 0) return null;
      if (st.e === "Fr." && Math.abs(w * 100 - Math.round(w * 100)) > 1e-6) return null;
      const links = st.r.map(x => (Array.isArray(x) ? mitEinheit(x[0], x[1]) : typeof x === "number" ? ganzText(x) : x === "-" ? "−" : x)).join(" ");
      karten.push({ text: `${links} = ${mitEinheit(w, st.e)}`, wert: w, e: st.e });
    }
    if ((z.saeulen && !(Array.isArray(z.saeulen) && z.saeulen.length >= 2 && z.saeulen.length <= 4 && z.saeulen.every(v => Number.isFinite(v) && v > 0))) || karten.length + !!z.unwichtig + !!z.saeulen > 5) return null;
    const ziel = karten[karten.length - 1];
    const svg = neuesBild("reise", stufe, { "data-bilder": "kompass", "data-wert": ziel.wert });
    svg.append(tagGrund(), boden());
    // Stationen: Säulen, unwichtige Angabe, Schritte — untereinander, der Weg führt daran vorbei zum Ziel
    const stationen = [];
    if (z.saeulen) stationen.push({ art: "saeulen" });
    if (z.unwichtig) stationen.push({ art: "unwichtig", text: mitEinheit(z.unwichtig[0], z.unwichtig[1]) });
    karten.forEach(k => stationen.push({ art: "schritt", text: k.text }));
    const hoehe = st => (st.art === "saeulen" ? 44 : 21), luecke = 5;
    let y = 8;
    const punkte = [];
    stationen.forEach(st => {
      const h = hoehe(st), b = st.art === "saeulen" ? 84 : Math.min(240, st.text.length * 6.4 + 14), x = 10;
      let e;
      if (st.art === "saeulen") {
        // kleines Säulendiagramm mit den Werten über den Säulen, wie die Angaben im Spiel
        const max = Math.max(...z.saeulen), sb = (b - 8) / z.saeulen.length, hs = h - 18;
        e = s("g", { "data-station": "saeulen" }, s("rect", { x, y, width: b, height: h, rx: 4, fill: "#ffffff", stroke: "#6b7089", "stroke-width": 1 }),
          ...z.saeulen.flatMap((v, i) => [s("rect", { x: x + 4 + i * sb + 2, y: y + h - 3 - (v / max) * hs, width: sb - 4, height: (v / max) * hs, style: `fill:${DEKO(i)}` }),
            text(x + 4 + (i + 0.5) * sb, y + h - 6 - (v / max) * hs, ganzText(v), { gross: 9 })]));
      } else {
        e = s("g", { "data-station": st.art }, s("rect", { x, y, width: b, height: h, rx: 5, fill: st.art === "unwichtig" ? "#f2f2f7" : "#ffffff", stroke: "#6b7089", "stroke-width": 1 }),
          text(x + b / 2, y + 15, st.text, { gross: 11.5, farbe: st.art === "unwichtig" ? "#8a8fa8" : "#2d3047" }));
        if (st.art === "unwichtig") e.appendChild(s("line", { x1: x + 4, y1: y + h / 2, x2: x + b - 4, y2: y + h / 2, stroke: "#e5484d", "stroke-width": 1.6 }));
      }
      punkte.push([x + b + 14, y + h / 2]);
      st.e = e;
      y += h + luecke;
    });
    // Ziel unten rechts: Fähnchenmast und das Ergebnis
    const zx = 262, zy = 114;
    punkte.push([zx - 40, zy]);
    const weg = "M" + punkte.map(([x, y0]) => `${x.toFixed(1)},${y0.toFixed(1)}`).join(" L");
    svg.appendChild(s("path", { d: weg, fill: "none", stroke: "#a8743f", "stroke-width": 2, "stroke-dasharray": "4 3" }));
    const T = DAUER * 0.8, je = T / stationen.length;
    stationen.forEach((st, i) => svg.appendChild(erscheine(st.e, i * je, ruhig, 0.25)));
    svg.appendChild(erscheine(s("g", { "data-zeile": "ergebnis" }, s("rect", { x: zx - 44, y: zy - 16, width: 92, height: 28, rx: 6, fill: "#fff8e1", stroke: "#f5c451", "stroke-width": 1.8 }),
      text(zx + 2, zy + 4, mitEinheit(ziel.wert, ziel.e), { gross: 15 })), T, ruhig));
    svg.appendChild(bewege(kompassFigur(), weg, { x: zx - 40, y: zy, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T + 0.1 }));
    if (sterne >= 2) svg.appendChild(fahne(zx + 40, zy - 16, ruhig));
    if (sterne >= 3) svg.appendChild(funken(zx, 30, ruhig));
    return svg;
  }

  // ----- Rechengeschichten (SAMMELN · buch) -----
  /** Gleichung als Text, die Lücke als „?“ (später die Zahl). */
  const gleichungText = (gl, wert) => gl.map(x => (x === "?" ? (wert === undefined ? "?" : ganzText(wert)) : typeof x === "number" ? ganzText(x) : x === "-" ? "−" : x)).join(" ");
  /**
   * Bilderbuch: links die Geschichte mit den Bildzeichen des Spiels (dazu, weg, mal, luecke, teilen; angaben: die
   * Zahlen der Geschichte, eine braucht man nicht), rechts die Rechnung, die Lücke „?“ wird zur Zahl.
   * gleichung mit „?“ und wert werden nachgerechnet; die Bilder folgen den Zahlen der Gleichung.
   */
  function buch(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !gleichungGilt(z.gleichung, z.wert)) return null;
    const gl = z.gleichung.map(x => (x === "?" ? z.wert : x)), bild = z.bild || "🍎";
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "buch", "data-wert": z.wert });
    svg.appendChild(tagGrund());
    svg.append(s("rect", { x: 8, y: 8, width: 304, height: 122, rx: 8, fill: "#a8743f" }),
      s("path", { d: "M14,14 Q86,8 158,16 L158,124 Q86,116 14,122 Z", fill: "#fffdf6" }), s("path", { d: "M162,16 Q234,8 306,14 L306,122 Q234,116 162,124 Z", fill: "#fffdf6" }),
      s("line", { x1: 160, y1: 14, x2: 160, y2: 126, stroke: "#c9b98f", "stroke-width": 1.4 }));
    // linke Seite: die Geschichte
    const seite = [22, 22, 128, 92], T = DAUER * 0.7;
    const stueck = (x, y, gross, extra = {}) => { const e = bildzeichen(x, y, bild, gross); Object.entries({ "data-stueck": "ding", ...extra }).forEach(([k, v]) => e.setAttribute(k, v)); return e; };
    let anzahl = 0;
    const [a, op, b] = gl;
    if (z.art === "dazu" || z.art === "weg" || z.art === "luecke") {
      const c = z.art === "weg" ? a : z.art === "dazu" ? a + b : gl[4];
      if (c > 30 || (z.art === "luecke" && gl[2] !== z.wert)) return null;
      const { zelle, plaetze } = rasterIn(c, ...seite), gross = Math.min(22, zelle * 0.82);
      plaetze.forEach(([x, y], i) => {
        const neu = z.art === "weg" ? false : i >= a;
        if (z.art === "luecke" && neu) svg.appendChild(s("circle", { cx: x, cy: y, r: gross * 0.55, fill: "none", stroke: "#8a8fa8", "stroke-width": 1, "stroke-dasharray": "2 2" }));
        const geht = z.art === "weg" && i >= a - b;
        let e = stueck(x, y, gross);
        if (geht) { e.removeAttribute("data-stueck"); e.setAttribute("data-geht", "weg"); } // zählt nicht mehr (data-anzahl)
        if (neu) {
          // kommt von rechts oben dazu
          const ab = T * 0.35 + (i - a) * ((T * 0.5) / Math.max(1, c - a));
          e = erscheine(s("g", {}, e), ab, ruhig, 0.2);
          if (!ruhig) e.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "40 -30", to: "0 0", begin: t(ab), dur: "0.35s", fill: "freeze" }));
        } else if (geht) {
          // geht weg: steigt auf und verblasst
          const ab = T * 0.45 + (i - a + b) * 0.12;
          e = verschwinde(erscheine(s("g", {}, e), (i / c) * T * 0.3, ruhig, 0.2), ab, ruhig, 0.35);
          if (!ruhig) e.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "0 0", to: "0 -24", begin: t(ab), dur: "0.35s", fill: "freeze" }));
        } else e = erscheine(e, (i / c) * T * 0.3, ruhig, 0.2);
        if (!geht) anzahl++;
        svg.appendChild(e);
      });
    } else if (z.art === "mal") {
      if (op !== "·" || a * b > 30) return null;
      const mitte = seite[0] + seite[2] / 2, zh = 92 / a, zb = Math.min((seite[2] - 8) / b, zh * 1.6), gross = Math.min(20, zh * 0.8, zb * 0.85);
      for (let r = 0; r < a; r++) {
        const reihe = s("g", {}, s("rect", { x: mitte - (b * zb) / 2 - 3, y: 22 + r * zh + 1, width: b * zb + 6, height: zh - 2, rx: 4, fill: "none", stroke: "#c9b98f", "stroke-width": 1 }));
        for (let i = 0; i < b; i++) { reihe.appendChild(stueck(mitte - (b * zb) / 2 + (i + 0.5) * zb, 22 + (r + 0.5) * zh, gross)); anzahl++; }
        svg.appendChild(erscheine(reihe, (r / a) * T * 0.8, ruhig, 0.2));
      }
    } else if (z.art === "teilen") {
      const n = b, je = gl[4];
      if (op !== ":" || n > 6 || je > 6 || a !== n * je) return null;
      // Teller in einer oder zwei Reihen (höchstens drei je Reihe), die Guetzli reihum darauf, drei nebeneinander
      const proReihe = Math.min(n, 3), reihen = Math.ceil(n / proReihe), pw = seite[2] / proReihe, rh = seite[3] / reihen;
      const gross = Math.min(14, pw / 3.4, rh / 3.4), tx = p => seite[0] + ((p % proReihe) + 0.5) * pw, ty = p => seite[1] + (Math.floor(p / proReihe) + 1) * rh - 6;
      for (let p = 0; p < n; p++) svg.appendChild(s("ellipse", { cx: tx(p), cy: ty(p), rx: pw / 2 - 4, ry: 5, fill: "#ffffff", stroke: "#b8a98a", "stroke-width": 1.2 }));
      const schritt = (T * 0.85) / a;
      for (let k = 0; k < je; k++) for (let p = 0; p < n; p++) {
        const x = tx(p) + ((k % 3) - 1) * gross * 1.05, y = ty(p) - 6 - Math.floor(k / 3) * gross * 1.05;
        svg.appendChild(vonOben(stueck(x, y, gross), (k * n + p) * schritt, ruhig, 40, 0.25));
        anzahl++;
      }
    } else if (z.art === "angaben") {
      // die Zahlen der Geschichte; die unwichtige wird durchgestrichen
      const zahlen = z.zahlen;
      if (!Array.isArray(zahlen) || zahlen.length < 2 || zahlen.length > 4 || !zahlen.includes(z.unwichtig)) return null;
      zahlen.forEach((v, i) => {
        const y = 26 + i * 24, g = s("g", { "data-angabe": v }, s("rect", { x: 34, y, width: 104, height: 18, rx: 9, fill: "#eef3fb", stroke: "#8ab4cc", "stroke-width": 1 }),
          text(86, y + 13.5, ganzText(v), { gross: 12 }));
        if (v === z.unwichtig) g.appendChild(erscheine(s("line", { x1: 38, y1: y + 9, x2: 134, y2: y + 9, stroke: "#e5484d", "stroke-width": 2 }), T * 0.7, ruhig));
        svg.appendChild(erscheine(g, (i / zahlen.length) * T * 0.6, ruhig, 0.2));
      });
    } else return null;
    if (z.art !== "angaben") svg.setAttribute("data-anzahl", anzahl);
    // rechte Seite: die Rechnung; „?“ wird zur Zahl
    const frage = s("g", {}, text(234, 76, gleichungText(z.gleichung), { gross: 15 })), loesung = s("g", { "data-zeile": "unten" }, text(234, 76, gleichungText(z.gleichung, z.wert), { gross: 15 }));
    svg.append(kurz(frage, 0.1, DAUER * 0.75, ruhig), erscheine(loesung, DAUER * 0.78, ruhig, 0.25));
    if (sterne >= 2) svg.appendChild(glanz(290, 30, ruhig));
    if (sterne >= 3) svg.appendChild(funken(234, 104, ruhig));
    return svg;
  }

  // ----- Platzhalter-Geschichten (SAMMELN · platzhalter) -----
  /**
   * Die Gleichung der Stufe als Karten; die Karte mit „?“ dreht sich um und zeigt die Zahl, darunter die Probe mit der
   * Umkehrrechnung (umkehr). gleichungen: eine oder zwei (Königsstufe: zwei Lücken nacheinander), jede nachgerechnet.
   */
  function platzhalter(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    const liste = z?.gleichungen;
    if (!Array.isArray(liste) || !liste.length || liste.length > 2) return null;
    for (const g of liste) {
      if (!gleichungGilt(g.gl, g.wert)) return null;
      if (g.umkehr && !(Math.abs(wertVon(g.umkehr) - g.wert) < 1e-9)) return null;
    }
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "platzhalter", "data-wert": liste.map(g => g.wert).join(",") });
    svg.appendChild(tagGrund());
    const zeilenY = liste.length === 1 ? [52] : [36, 92], T = DAUER * 0.85, je = T / liste.length;
    liste.forEach((g, n) => {
      const y = zeilenY[n], b = x => (typeof x === "number" || x === "?" ? Math.max(30, String(x === "?" ? g.wert : x).length * 10 + 12) : 18);
      const breite = g.gl.reduce((a, x) => a + b(x) + 6, -6);
      let x = (BREITE - breite) / 2;
      const ab = n * je;
      g.gl.forEach(tok => {
        const w = b(tok), mx = x + w / 2;
        if (typeof tok === "number") svg.appendChild(erscheine(s("g", {}, s("rect", { x, y: y - 16, width: w, height: 32, rx: 6, fill: "#ffffff", stroke: "var(--deko-6)", "stroke-width": 2, style: "stroke:var(--deko-6)" }),
          text(mx, y + 6, ganzText(tok), { gross: 16 })), ab, ruhig, 0.2));
        else if (tok === "?") {
          const vorn = s("g", {}, s("rect", { x, y: y - 16, width: w, height: 32, rx: 6, fill: "#fff8e1", stroke: "#f5c451", "stroke-width": 2, "stroke-dasharray": "4 3" }), text(mx, y + 6, "?", { gross: 18, farbe: "#b8962a" }));
          const hinten = s("g", { "data-stueck": "loesung", "data-wert": g.wert }, s("rect", { x, y: y - 16, width: w, height: 32, rx: 6, fill: "#e6f6ec", stroke: "#2fb36b", "stroke-width": 2 }),
            text(mx, y + 6, ganzText(g.wert), { gross: 16 }));
          // umdrehen: die Karte wird um ihre Mitte schmal, dann kommt die Zahl ebenso breit
          const drehbar = (inhalt, von, bis, beginn) => {
            const mitte = s("g", { transform: `scale(${von} 1)` }, s("g", { transform: `translate(${-mx} 0)` }, inhalt));
            mitte.appendChild(s("animateTransform", { attributeName: "transform", type: "scale", from: `${von} 1`, to: `${bis} 1`, begin: t(beginn), dur: "0.2s", fill: "freeze" }));
            return s("g", { transform: `translate(${mx} 0)` }, mitte);
          };
          const dreh = ab + je * 0.55;
          if (ruhig) svg.appendChild(hinten);
          else svg.append(erscheine(drehbar(vorn, 1, 0.01, dreh), ab, ruhig, 0.2), drehbar(hinten, 0.01, 1, dreh + 0.2));
        } else svg.appendChild(erscheine(text(mx, y + 6, tok === "-" ? "−" : tok, { gross: 17 }), ab, ruhig, 0.2));
        x += w + 6;
      });
      if (g.umkehr) {
        const probeText = `${termText(g.umkehr)} = ${ganzText(g.wert)}`, hx = BREITE / 2 - 8 + probeText.length * 3.9 + 10; // Haken hinter der Probe
        const probe = s("g", { "data-zeile": "probe" }, text(BREITE / 2 - 8, 114, probeText, { gross: 14, farbe: "#4f5668" }),
          s("path", { d: `M${hx},108 l4,5 l9,-11`, stroke: "#2fb36b", "stroke-width": 2.6, fill: "none", "stroke-linecap": "round" }));
        svg.appendChild(erscheine(probe, ab + je * 0.85, ruhig, 0.3));
      }
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 22, 20, ruhig));
    if (sterne >= 3) svg.appendChild(funken(28, 22, ruhig));
    return svg;
  }

  // ----- Schätz-Waage, Gegenteil-Wippe: Wippe und Reihen mit den Bildzeichen der Spiele -----
  /**
   * Wippe aus Holz wie in der Gegenteil-Wippe, Drehpunkt px, py: links und rechts je ein Inhalt (Element, Mitte unten auf
   * 0,0 auf dem Balken); sie neigt sich zur schweren Seite (schwer: "links" | "rechts").
   */
  function wippeMit(px, py, arm, links, rechts, schwer, ab, ruhig, neig = 12) {
    const w = schwer === "links" ? -neig : neig;
    const balken = s("g", { "data-wippe": schwer, transform: `rotate(${ruhig ? w : 0} ${px} ${py})` },
      s("line", { x1: px - arm, y1: py, x2: px + arm, y2: py, stroke: "#c08a4f", "stroke-width": 7, "stroke-linecap": "round" }));
    const auf = (e, x) => s("g", { transform: `translate(${x} ${py - 4})` }, e);
    balken.append(auf(links, px - arm * 0.72), auf(rechts, px + arm * 0.72));
    if (!ruhig) balken.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `0 ${px} ${py}`, to: `${w} ${px} ${py}`, begin: t(ab), dur: "0.7s",
      fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.5 0 0.3 1" })); // keySplines nur 0 … 1, sonst verwirft der Browser die Animation
    return s("g", {}, s("path", { d: `M${px},${py} L${px - 14},${py + 30} L${px + 14},${py + 30} Z`, fill: "#8a5a32" }), balken);
  }
  /** Bildzeichen, unten Mitte auf 0,0. */
  const dingAuf = (z, gross) => { const g = s("g", { "data-stueck": "ding" }); g.appendChild(bildzeichen(0, -gross * 0.5, z, gross)); return g; };
  /**
   * Dinge der Reihe nach von wenig zu viel: jedes auf einem Sockel, der von links nach rechts höher wird (merkmal
   * "gross": die Bildzeichen selbst werden grösser); hervor: "max" hebt das letzte hervor (am grössten).
   */
  function dingReihe(svg, dinge, { merkmal, hervor, ruhig, T }) {
    const n = dinge.length, abst = Math.min(72, 260 / n), x0 = BREITE / 2 - ((n - 1) * abst) / 2, boden0 = 122;
    dinge.forEach((d, i) => {
      const x = x0 + i * abst, sockel = merkmal === "gross" ? 8 : 10 + i * 14, gross = merkmal === "gross" ? 16 + i * (28 / Math.max(1, n - 1)) : 28;
      const g = s("g", {}, s("rect", { x: x - abst * 0.36, y: boden0 - sockel, width: abst * 0.72, height: sockel, rx: 3, fill: "#d8c6a4", stroke: "#a9773f", "stroke-width": 1 }));
      const e = dingAuf(d, gross);
      e.setAttribute("transform", `translate(${x} ${boden0 - sockel})`);
      g.appendChild(e);
      if (hervor === "max" && i === n - 1) g.appendChild(erscheine(s("ellipse", { cx: x, cy: boden0 - sockel - gross * 0.5, rx: gross * 0.75, ry: gross * 0.7, fill: "none", stroke: "#f5b301", "stroke-width": 2.4 }), T + 0.1, ruhig));
      svg.appendChild(vonOben(g, (i / n) * T, ruhig, 30, 0.3));
    });
    svg.appendChild(erscheine(s("path", { d: `M${x0 - 10},136 L${x0 + (n - 1) * abst + 10},136 m-6,-4 l6,4 l-6,4`, stroke: "#6b7089", "stroke-width": 2, fill: "none" }), T, ruhig));
  }

  // ----- Schätz-Waage (BAUEN · schaetzen) -----
  /**
   * Je Stufe wie im Spiel: waage (zwei Dinge, die Wippe neigt sich zum schwereren), reihe (drei oder vier Dinge von
   * leicht zu schwer, kurz zu lang), ding mit Grösse (lineal: ein Lineal wächst bis zur Länge; waage: auf der Waage
   * erscheint das Gewicht). Bildzeichen und Werte aus den Inhaltslisten des Spiels.
   */
  function schaetzen(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "schaetzen" });
    svg.appendChild(tagGrund());
    const T = DAUER * 0.75;
    if (z.waage) {
      if (!Array.isArray(z.waage) || z.waage.length !== 2) return null;
      svg.appendChild(s("rect", { x: 0, y: 122, width: BREITE, height: 28, rx: 14, fill: "#86c46f" }));
      const [schwer, leicht] = z.waage;
      svg.appendChild(wippeMit(160, 92, 110, vonOben(dingAuf(schwer, 40), 0.1, ruhig, 40), vonOben(dingAuf(leicht, 22), 0.5, ruhig, 40), "links", T * 0.6, ruhig));
      svg.setAttribute("data-anzahl", 2);
    } else if (z.reihe) {
      if (!Array.isArray(z.reihe) || z.reihe.length < 2 || z.reihe.length > 4) return null;
      dingReihe(svg, z.reihe, { ruhig, T });
      svg.setAttribute("data-anzahl", z.reihe.length);
    } else if (z.ding) {
      if (!Number.isFinite(z.wert) || z.wert <= 0 || !familie(z.einheit)) return null;
      const wert = groesse(z.wert, z.einheit);
      if (z.mass === "lineal") {
        if (familie(z.einheit) !== "laenge" || basis(z.wert, z.einheit) > 200) return null;
        const L = 40, R = 280, px = mm => L + (mm / 200) * (R - L), ly = 82;
        svg.append(s("rect", { x: L - 8, y: ly, width: R - L + 16, height: 26, rx: 3, fill: "#f7e3a1", stroke: "#b8962a", "stroke-width": 1.2 }));
        let d = "";
        for (let cm = 0; cm <= 20; cm++) d += `M${px(cm * 10).toFixed(2)},${ly} v${cm % 5 ? 6 : 10} `;
        svg.appendChild(s("path", { d, stroke: "#2d3047", "stroke-width": 1 }));
        for (let cm = 0; cm <= 20; cm += 5) svg.appendChild(text(px(cm * 10), ly + 22, cm, { gross: 9.5 }));
        const mm = basis(z.wert, z.einheit), balken = s("rect", { x: L, y: ly - 14, width: px(mm) - L, height: 9, rx: 2, style: "fill:var(--deko-6)" });
        if (!ruhig) balken.appendChild(s("animate", { attributeName: "width", from: 0, to: px(mm) - L, begin: t(0.4), dur: `${T}s`, fill: "freeze" }));
        svg.append(balken, vonOben(s("g", {}, s("g", { transform: `translate(${(L + px(mm)) / 2} ${ly - 16})` }, dingAuf(z.ding, 34))), 0.05, ruhig, 40));
      } else if (z.mass === "waage") {
        // Waage mit Anzeige: das Ding fällt auf die Platte, die Anzeige zeigt das Gewicht
        svg.append(s("rect", { x: 100, y: 96, width: 120, height: 30, rx: 6, fill: "#c9ccd3", stroke: "#6b7089", "stroke-width": 1.4 }),
          s("rect", { x: 92, y: 88, width: 136, height: 8, rx: 3, fill: "#8a94a6" }), s("rect", { x: 126, y: 102, width: 68, height: 19, rx: 3, fill: "#2d3047" }));
        svg.appendChild(erscheine(text(160, 116, wert, { gross: 13, farbe: "#9ff0b4" }), T, ruhig));
        svg.appendChild(vonOben(s("g", {}, s("g", { transform: "translate(160 88)" }, dingAuf(z.ding, 44))), 0.1, ruhig, 60, 0.4));
      } else return null;
      svg.setAttribute("data-wert", wert);
      svg.setAttribute("data-anzahl", 1);
      // die Waage zeigt das Gewicht selbst an; unter dem Lineal steht die Länge
      if (z.mass === "lineal") svg.appendChild(erscheine(zeileUnten(wert, 142), T, ruhig));
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 22, 20, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 24, ruhig));
    return svg;
  }

  // ----- Gegenteil-Wippe (SAMMELN · wippe) -----
  /** Paket wie im Spiel (Farbe und weisses Zeichen), Mitte unten auf 0,0, Seite k. */
  const PAKET = {
    stern: "M30,14 L34,25 L46,25 L36.5,32 L40,44 L30,37 L20,44 L23.5,32 L14,25 L26,25 Z",
    kreis: "M30,18 A12,12 0 1,1 29.99,18 Z",
    dreieck: "M30,16 L44,42 L16,42 Z",
    viereck: "M19,19 L41,19 L41,41 L19,41 Z",
  };
  function paket(zeichen0, farbe, k = 26) {
    const f = k / 52;
    return s("g", { "data-stueck": "paket", "data-paket": zeichen0 }, s("g", { transform: `translate(${-k / 2} ${-k}) scale(${f.toFixed(3)}) translate(-4 -4)` },
      s("rect", { x: 4, y: 4, width: 52, height: 52, rx: 6, style: `fill:${farbe}`, stroke: "#2d3047", "stroke-opacity": 0.25, "stroke-width": 2 }), s("path", { d: PAKET[zeichen0], fill: "#ffffff" })));
  }
  /**
   * Je Stufe wie im Spiel: wippe (das Schwere drückt seine Seite hinunter), paar (lang: Balken darunter, schnell: ein
   * Wettlauf, gross: Grössen), reihe (Dinge von klein nach gross; hervor: "max" das grösste), pakete (zwei Wippen
   * vergleichen je zwei Pakete, das schwerste leuchtet). Bildzeichen aus der Inhaltsliste des Spiels.
   */
  function wippe(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "wippe" });
    svg.appendChild(tagGrund());
    const T = DAUER * 0.75;
    if (z.wippe) {
      if (!Array.isArray(z.wippe) || z.wippe.length !== 2) return null;
      svg.appendChild(s("rect", { x: 0, y: 122, width: BREITE, height: 28, rx: 14, fill: "#86c46f" }));
      svg.appendChild(wippeMit(160, 92, 112, vonOben(dingAuf(z.wippe[0], 34), 0.1, ruhig, 40), vonOben(dingAuf(z.wippe[1], 28), 0.5, ruhig, 40), "links", T * 0.6, ruhig));
      svg.setAttribute("data-anzahl", 2);
    } else if (z.paar) {
      if (!Array.isArray(z.paar) || z.paar.length !== 2 || !["lang", "schnell", "gross"].includes(z.merkmal)) return null;
      const [mehr, weniger] = z.paar;
      if (z.merkmal === "gross") dingReihe(svg, [weniger, mehr], { merkmal: "gross", ruhig, T });
      else {
        // zwei Bahnen: lang — der Balken darunter, schnell — wie weit jedes in derselben Zeit kommt
        [[mehr, 250, 46], [weniger, z.merkmal === "lang" ? 110 : 96, 104]].forEach(([d, bis, y], i) => {
          svg.appendChild(s("line", { x1: 30, y1: y + 8, x2: 290, y2: y + 8, stroke: "#c9cde0", "stroke-width": 1.4, "stroke-dasharray": "4 3" }));
          if (z.merkmal === "lang") {
            const balken = s("rect", { x: 40, y: y + 4, width: bis - 40, height: 8, rx: 3, style: `fill:${DEKO(i + 2)}` });
            if (!ruhig) balken.appendChild(s("animate", { attributeName: "width", from: 0, to: bis - 40, begin: t(0.3), dur: `${T}s`, fill: "freeze" }));
            svg.append(balken, erscheine(s("g", { transform: `translate(${(40 + bis) / 2} ${y + 2})` }, dingAuf(d, 30)), 0.1, ruhig));
          } else {
            const e = dingAuf(d, 30);
            svg.appendChild(bewege(s("g", {}, s("g", { transform: "scale(-1 1)" }, e)), `M40,${y + 4} L${bis},${y + 4}`, { x: bis, y: y + 4, winkel: 0 }, ruhig, { drehen: false, linear: true, ab: 0.1, dauer: T }));
          }
        });
        if (z.merkmal === "schnell") svg.appendChild(s("path", { d: "M290,30 v96 M290,30 l12,4 l-12,4", stroke: "#2d3047", "stroke-width": 1.6, fill: "#2fb36b" }));
      }
      svg.setAttribute("data-anzahl", 2);
    } else if (z.reihe) {
      if (!Array.isArray(z.reihe) || z.reihe.length < 3 || z.reihe.length > 4) return null;
      dingReihe(svg, z.reihe, { merkmal: "gross", hervor: z.hervor, ruhig, T });
      svg.setAttribute("data-anzahl", z.reihe.length);
    } else if (z.pakete) {
      // vom leichtesten zum schwersten; je zwei Nachbarn auf einer Wippe
      if (!Array.isArray(z.pakete) || z.pakete.length !== 3 || !z.pakete.every(p => PAKET[p])) return null;
      const farben = ["var(--deko-1)", "var(--deko-6)", "var(--deko-3)"];
      svg.appendChild(s("rect", { x: 0, y: 110, width: BREITE, height: 40, rx: 14, fill: "#d6ecf8" }));
      [[0, 1, 82, 0.1], [1, 2, 238, T * 0.45]].forEach(([i, j, px, ab]) => {
        svg.appendChild(erscheine(wippeMit(px, 70, 62, paket(z.pakete[i], farben[i]), paket(z.pakete[j], farben[j]), "rechts", ab + 0.3, ruhig), ab, ruhig, 0.2));
      });
      const sieger = s("g", { transform: "translate(160 136)" }, paket(z.pakete[2], farben[2], 30),
        s("ellipse", { cx: 0, cy: -15, rx: 24, ry: 19, fill: "none", stroke: "#f5b301", "stroke-width": 2.4 }));
      svg.appendChild(erscheine(sieger, T + 0.1, ruhig, 0.3));
      svg.setAttribute("data-anzahl", 5);
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 22, 20, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 24, ruhig));
    return svg;
  }

  BILDER.zyklus = { uhr };
  Object.assign(BILDER.reise, { zug, kompass });
  Object.assign(BILDER.zoom, { messband });
  Object.assign(BILDER.sammeln, { kasse, buch, platzhalter, wippe });
  Object.assign(BILDER.bauen, { treppe, schaetzen });

  // ---------- Bilder Block M5: Geometrie (AR1 a, LERN_Session29) ----------
  // Wie M2 bis M4: jedes Bild folgt den Stufen seines Spiels und prüft, was es zeigt (Spiegelbilder im Raster, Lücken
  // und Überlappungen im Puzzle, Würfelzahlen, Kipplagen, Fläche und Umfang); ohne stimmige Angabe kein Bild.

  /** Feld im Raster: Mitte der Zelle x, y. */
  const zelle = (x0, y0, c) => ([x, y]) => [x0 + (x + 0.5) * c, y0 + (y + 0.5) * c];
  /** Gitter b × h mit Zellen der Grösse c ab x0, y0. */
  function gitter(x0, y0, b, h, c, farbe = "#c9cde0") {
    let d = "";
    for (let i = 0; i <= b; i++) d += `M${x0 + i * c},${y0} v${h * c} `;
    for (let j = 0; j <= h; j++) d += `M${x0},${y0 + j * c} h${b * c} `;
    return s("path", { d, stroke: farbe, "stroke-width": 0.8, fill: "none" });
  }
  /** Linie zeichnet sich (pathLength 1, Strichversatz 1 → 0); im ruhigen Bild gleich ganz. */
  function zeichne(e, ab, ruhig, dauer = 0.4) {
    if (ruhig) return e;
    // eine gestrichelte Linie behielte ihre Striche nicht (der Strichversatz braucht die Strichelung): sie blendet ein
    if (e.getAttribute("stroke-dasharray")) return erscheine(e, ab, ruhig, dauer);
    e.setAttribute("pathLength", 1);
    e.setAttribute("stroke-dasharray", "1 1");
    e.setAttribute("stroke-dashoffset", 1);
    e.appendChild(s("animate", { attributeName: "stroke-dashoffset", from: 1, to: 0, begin: t(ab), dur: `${dauer}s`, fill: "freeze" }));
    return e;
  }
  const schluessel = ([x, y]) => `${x},${y}`;

  // ----- Spiegel-Raster (BAUEN · spiegelraster) -----
  /**
   * Die Figur der Stufe im Raster, Kästchen um Kästchen kommt ihr Bild dazu: an der senkrechten, waagrechten oder
   * schrägen Achse (bei: die Achse liegt vor Spalte bzw. Zeile bei), an zwei Achsen zugleich (vier Teile) oder verschoben
   * (schub). Geprüft: jedes Bild im Raster und nicht auf der Figur.
   */
  function spiegelraster(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.zellen) || !z.zellen.length || !(z.breite > 0 && z.hoehe > 0)) return null;
    const B = z.breite, H = z.hoehe;
    const spiegle = ([x, y], a) => (a.art === "senkrecht" ? [2 * a.bei - 1 - x, y] : a.art === "waagrecht" ? [x, 2 * a.bei - 1 - y] : a.art === "schraeg" ? [y, x] : null);
    let bilder;
    if (z.schub) bilder = [z.zellen.map(([x, y]) => [x + z.schub[0], y + z.schub[1]])];
    else if (Array.isArray(z.achsen) && z.achsen.length === 2) {
      const b1 = z.zellen.map(p => spiegle(p, z.achsen[0])), b2 = z.zellen.map(p => spiegle(p, z.achsen[1]));
      bilder = [b1, b2, b1.map(p => spiegle(p, z.achsen[1]))];
    } else if (z.achse) bilder = [z.zellen.map(p => spiegle(p, z.achse))];
    else return null;
    if ((z.achse?.art === "schraeg" || z.achsen?.some(a => a.art === "schraeg")) && B !== H) return null;
    const alle = [z.zellen, ...bilder].flat();
    if (alle.some(p => !p || p[0] < 0 || p[1] < 0 || p[0] >= B || p[1] >= H) || new Set(alle.map(schluessel)).size !== alle.length) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "spiegelraster", "data-anzahl": bilder.flat().length });
    svg.appendChild(tagGrund());
    const c = Math.min(22, 128 / H, 280 / B), x0 = (BREITE - B * c) / 2, y0 = (HOEHE - H * c) / 2, mitte = zelle(x0, y0, c);
    svg.appendChild(s("rect", { x: x0, y: y0, width: B * c, height: H * c, fill: "#ffffff" }));
    const feld = (p, farbe, extra = {}) => s("rect", { x: x0 + p[0] * c + 1, y: y0 + p[1] * c + 1, width: c - 2, height: c - 2, rx: 2, style: `fill:${farbe}`, ...extra });
    z.zellen.forEach(p => svg.appendChild(feld(p, "var(--deko-6)")));
    svg.appendChild(gitter(x0, y0, B, H, c));
    // Achsen rot wie ein Spiegel, die Verschiebung als Pfeil
    const achse = a => (a.art === "senkrecht" ? s("line", { x1: x0 + a.bei * c, y1: y0 - 4, x2: x0 + a.bei * c, y2: y0 + H * c + 4 })
      : a.art === "waagrecht" ? s("line", { x1: x0 - 4, y1: y0 + a.bei * c, x2: x0 + B * c + 4, y2: y0 + a.bei * c })
        : s("line", { x1: x0 - 3, y1: y0 - 3, x2: x0 + B * c + 3, y2: y0 + H * c + 3 }));
    for (const a of z.achsen || (z.achse ? [z.achse] : [])) { const l = achse(a); l.setAttribute("stroke", "#e5484d"); l.setAttribute("stroke-width", 2.4); svg.appendChild(l); }
    if (z.schub) {
      const [ax, ay] = mitte(z.zellen[0]), [bx, by] = mitte(bilder[0][0]);
      svg.appendChild(zeichne(s("path", { d: `M${ax},${ay} L${bx},${by} m-6,-2 l6,2 l-3,5`, stroke: "#e5484d", "stroke-width": 2, fill: "none", "stroke-linecap": "round" }), 0.1, ruhig, 0.5));
    }
    const liste = bilder.flat(), je = (DAUER * 0.8) / liste.length;
    liste.forEach((p, i) => svg.appendChild(erscheine(feld(p, "var(--deko-3)", { "data-stueck": "bild" }), 0.3 + i * je, ruhig, 0.15)));
    if (sterne >= 2) svg.appendChild(glanz(x0 + B * c + 12, y0 + 6, ruhig));
    if (sterne >= 3) svg.appendChild(funken(Math.max(x0 - 22, 24), 26, ruhig));
    return svg;
  }

  // ----- Koordinaten-Schatzsuche (REISE · koordinaten) -----
  /** Schatztruhe, Mitte unten auf 0,0. */
  const truhe = () => s("g", { "data-figur": "truhe" }, s("rect", { x: -9, y: -11, width: 18, height: 11, rx: 1.5, fill: "#a8743f", stroke: "#6b4a2b", "stroke-width": 1 }),
    s("path", { d: "M-9,-11 Q0,-19 9,-11 Z", fill: "#c08a4f", stroke: "#6b4a2b", "stroke-width": 1 }), s("rect", { x: -1.6, y: -9, width: 3.2, height: 4, fill: "#f5b301" }));
  const punktText = ([x, y]) => `(${x}|${y})`; // wie im Spiel
  /**
   * Wie im Spiel: tafel [E, Z] — auf der Hundertertafel zuerst die Zeile der Zehner, dann die Spalte der Einer
   * (2 E 5 Z = 52); punkt — im Koordinatensystem zuerst nach rechts, dann nach oben zum Schatz; figur mit schub
   * (verschieben), figur allein (aus Koordinaten zeichnen), figur mit fehlt (die fehlende Ecke des Quadrats).
   */
  function koordinaten(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "koordinaten" });
    svg.appendChild(s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#f6ecd2" }));
    let zielX, zielY;
    if (z.tafel) {
      const [e, zz] = z.tafel, n = zz * 10 + e;
      if (!(Number.isInteger(e) && Number.isInteger(zz) && e >= 1 && e <= 9 && zz >= 0 && zz <= 9)) return null;
      const c = 11, x0 = 105, y0 = 13, r = Math.floor((n - 1) / 10), k = (n - 1) % 10;
      svg.append(s("rect", { x: x0, y: y0, width: 10 * c, height: 10 * c, fill: "#ffffff" }), gitter(x0, y0, 10, 10, c, "#b8a98a"));
      // fill-opacity: erscheine bewegt opacity von 0 nach 1 und überginge ein opacity am Element
      svg.appendChild(erscheine(s("rect", { x: x0, y: y0 + r * c, width: 10 * c, height: c, style: "fill:var(--st-Z)", "fill-opacity": 0.25 }), 0.2, ruhig));
      svg.appendChild(erscheine(s("rect", { x: x0 + k * c, y: y0, width: c, height: 10 * c, style: "fill:var(--st-E)", "fill-opacity": 0.2 }), 0.9, ruhig));
      svg.appendChild(erscheine(s("g", { "data-stueck": "feld", "data-wert": n }, s("rect", { x: x0 + k * c, y: y0 + r * c, width: c, height: c, fill: "#f5b301" }),
        text(x0 + (k + 0.5) * c, y0 + (r + 0.5) * c + 3.3, n, { gross: 9 })), 1.6, ruhig));
      const zeile = s("text", { x: BREITE / 2, y: 142, fill: "#2d3047", "font-size": 13, "font-weight": "bold", "font-family": SCHRIFT, "text-anchor": "middle", "data-zeile": "unten" },
        s("tspan", { style: "fill:var(--st-E)" }, `${e} E`), " ", s("tspan", { style: "fill:var(--st-Z)" }, `${zz} Z`), ` = ${n}`);
      svg.appendChild(erscheine(zeile, DAUER * 0.8, ruhig));
      zielX = x0 + (k + 0.5) * c; zielY = y0 + r * c;
    } else {
      // Koordinatensystem 0 … 10, x nach rechts, y nach oben
      const c = 11, ox = 46, oy = 132, P = ([x, y]) => [ox + x * c, oy - y * c];
      const im = p => Array.isArray(p) && p.every(v => Number.isInteger(v) && v >= 0 && v <= 10);
      svg.append(gitter(ox, oy - 10 * c, 10, 10, c, "#d9cdb0"),
        s("path", { d: `M${ox},${oy} h${10 * c + 6} m-5,-3 l5,3 l-5,3 M${ox},${oy} v${-10 * c - 6} m-3,5 l3,-5 l3,5`, stroke: "#6b4a2b", "stroke-width": 1.4, fill: "none" }));
      for (const v of [0, 5, 10]) svg.append(text(ox + v * c, oy + 11, v, { gross: 9, fett: false }), ...(v ? [text(ox - 7, oy - v * c + 3, v, { gross: 9, fett: false })] : []));
      // Beschriftung rechts über dem Punkt; links unter ihm, wo rechts die Figur liegt (verschieben)
      const beschrift = (p, ab, farbe = "#2d3047", links = false) => { const [x, y] = P(p);
        return erscheine(links ? text(x - 4, y + 13, punktText(p), { gross: 10, farbe, anker: "end" }) : text(Math.min(x + 22, 300), y - 5, punktText(p), { gross: 10, farbe }), ab, ruhig); };
      if (z.punkt) {
        if (!im(z.punkt)) return null;
        const [px, py] = P(z.punkt), weg = `M${ox},${oy} L${px},${oy} L${px},${py}`;
        svg.append(zeichne(s("path", { d: weg, stroke: "#e5484d", "stroke-width": 2, "stroke-dasharray": "4 3", fill: "none" }), 0.1, ruhig, DAUER * 0.7),
          erscheine(s("g", { transform: `translate(${px} ${py})`, "data-stueck": "schatz", "data-wert": punktText(z.punkt) }, truhe()), DAUER * 0.75, ruhig), beschrift(z.punkt, DAUER * 0.8));
        zielX = px; zielY = py - 12;
      } else if (Array.isArray(z.figur) && z.figur.length >= 3 && z.figur.every(im)) {
        const eckenD = pts => "M" + pts.map(p => P(p).join(",")).join(" L") + " Z";
        if (z.schub) {
          const neu = z.figur.map(([x, y]) => [x + z.schub[0], y + z.schub[1]]);
          if (!neu.every(im)) return null;
          svg.appendChild(s("path", { d: eckenD(z.figur), style: "fill:var(--deko-6)", "fill-opacity": 0.5, stroke: "#2d3047", "stroke-width": 1.2 }));
          const [ax, ay] = P(z.figur[0]), [bx, by] = P(neu[0]);
          svg.append(zeichne(s("path", { d: `M${ax},${ay} L${bx},${ay} L${bx},${by}`, stroke: "#e5484d", "stroke-width": 1.8, "stroke-dasharray": "4 3", fill: "none" }), 0.2, ruhig, 0.9));
          const kopie = s("path", { d: eckenD(z.figur), style: "fill:var(--deko-3)", "fill-opacity": 0.8, stroke: "#2d3047", "stroke-width": 1.2, "data-stueck": "figur" });
          svg.appendChild(schiebe(erscheine(kopie, 0.2, ruhig), bx - ax, by - ay, 0.3, ruhig, { dauer: DAUER * 0.6 }));
          svg.appendChild(beschrift(neu[0], DAUER * 0.85, "#c96d1c", true));
          [zielX, zielY] = P(neu[0]);
        } else {
          // aus Koordinaten zeichnen; mit fehlt: die vierte Ecke eines Quadrats (Seiten gleich, rechte Winkel)
          const pts = z.fehlt ? [...z.figur, z.fehlt] : z.figur;
          if (z.fehlt) {
            if (!im(z.fehlt) || pts.length !== 4) return null;
            const d = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2, [a, b, c0] = z.figur;
            if (!(d(a, b) === d(b, c0) && d(a, b) * 2 === d(a, c0) && d(c0, z.fehlt) === d(a, b) && d(z.fehlt, a) === d(a, b))) return null;
          }
          const je = (DAUER * 0.75) / pts.length;
          pts.forEach((p, i) => {
            const [x, y] = P(p), letzt = z.fehlt && i === pts.length - 1;
            svg.append(erscheine(letzt ? s("g", { transform: `translate(${x} ${y + 6})`, "data-stueck": "schatz" }, truhe()) : s("circle", { cx: x, cy: y, r: 3, fill: "#2d3047", "data-stueck": "punkt" }), i * je, ruhig, 0.2),
              beschrift(p, i * je + 0.1, letzt ? "#c96d1c" : "#2d3047"));
            const q = P(pts[(i + 1) % pts.length]);
            svg.appendChild(zeichne(s("line", { x1: x, y1: y, x2: q[0], y2: q[1], stroke: "var(--deko-6)", style: "stroke:var(--deko-6)", "stroke-width": 2 }), (i + 0.6) * je, ruhig, je * 0.8));
          });
          [zielX, zielY] = P(pts[pts.length - 1]);
        }
      } else return null;
    }
    if (sterne >= 2) svg.appendChild(fahne(Math.max(zielX - 16, 6), Math.max(zielY, 24), ruhig)); // links: rechts steht die Beschriftung
    if (sterne >= 3) svg.appendChild(funken(BREITE - 34, 26, ruhig));
    return svg;
  }

  // ----- Formen-Detektiv (BAUEN · formen) -----
  /** Form oder Körper um x, y (Grösse g), mit Farbe; gedreht um w Grad. */
  function form(art, x, y, g, farbe, w = 0) {
    const st = { style: `fill:${farbe}`, stroke: "#2d3047", "stroke-width": 1.4, "stroke-linejoin": "round" };
    const h = g / 2, dreh = w ? { transform: `rotate(${w} ${x} ${y})` } : {};
    const ecken = { dreieck: [[x, y - h], [x + h, y + h * 0.8], [x - h, y + h * 0.8]], quadrat: [[x - h * 0.85, y - h * 0.85], [x + h * 0.85, y - h * 0.85], [x + h * 0.85, y + h * 0.85], [x - h * 0.85, y + h * 0.85]],
      rechteck: [[x - h * 1.1, y - h * 0.6], [x + h * 1.1, y - h * 0.6], [x + h * 1.1, y + h * 0.6], [x - h * 1.1, y + h * 0.6]] };
    if (ecken[art]) return { e: s("polygon", { points: ecken[art].map(p => p.join(",")).join(" "), ...st, ...dreh }), ecken: ecken[art] };
    if (art === "kreis") return { e: s("circle", { cx: x, cy: y, r: h * 0.9, ...st }), ecken: [] };
    // Körper im Schrägbild: sichtbare Kanten durchgezogen
    const k = h * 0.75, t = h * 0.35;
    if (art === "wuerfel" || art === "quader") {
      const b = art === "quader" ? k * 1.5 : k, hh = art === "quader" ? k * 0.85 : k, l = x - b, o = y - hh + t / 2;
      return { e: s("g", {}, s("rect", { x: l, y: o, width: 2 * b, height: 2 * hh, ...st }), s("path", { d: `M${l},${o} l${t},${-t} h${2 * b} l${-t},${t} Z`, ...st, "fill-opacity": 0.7 }),
        s("path", { d: `M${l + 2 * b},${o} l${t},${-t} v${2 * hh} l${-t},${t} Z`, ...st, "fill-opacity": 0.85 })), ecken: [] };
    }
    if (art === "kugel") return { e: s("g", {}, s("circle", { cx: x, cy: y, r: h * 0.85, ...st }), s("ellipse", { cx: x, cy: y, rx: h * 0.85, ry: h * 0.25, fill: "none", stroke: "#2d3047", "stroke-width": 0.8, "stroke-dasharray": "3 2" }),
      s("circle", { cx: x - h * 0.3, cy: y - h * 0.35, r: h * 0.16, fill: "#ffffff", opacity: 0.7 })), ecken: [] };
    if (art === "zylinder") return { e: s("g", {}, s("path", { d: `M${x - k},${y - k} v${2 * k} a${k},${k * 0.3} 0 0,0 ${2 * k},0 v${-2 * k} Z`, ...st }),
      s("ellipse", { cx: x, cy: y - k, rx: k, ry: k * 0.3, ...st, "fill-opacity": 0.7 })), ecken: [] };
    if (art === "pyramide") return { e: s("g", {}, s("path", { d: `M${x - k},${y + k * 0.8} L${x + k * 0.6},${y + k * 0.8} L${x},${y - k * 1.2} Z`, ...st }),
      s("path", { d: `M${x + k * 0.6},${y + k * 0.8} L${x + k * 1.1},${y + k * 0.35} L${x},${y - k * 1.2} Z`, ...st, "fill-opacity": 0.75 })), ecken: [] };
    return null;
  }
  const FORMEN_ARTEN = ["kreis", "dreieck", "quadrat", "rechteck", "wuerfel", "quader", "kugel", "zylinder", "pyramide"];
  /**
   * Die Formen oder Körper der Stufe erscheinen nacheinander (gedreht: schräg hingelegt; ecken: die Ecken leuchten,
   * darunter ihre Zahl). eigenschaften: ein Rechteck mit rechten Winkeln, Symmetrieachsen und Ecken (Stufe 6).
   */
  function formen(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "formen" });
    svg.appendChild(tagGrund());
    if (z.eigenschaften === "rechteck") {
      const x0 = 90, y0 = 32, b = 140, h = 80, r = 9;
      svg.appendChild(erscheine(s("rect", { x: x0, y: y0, width: b, height: h, style: "fill:var(--deko-4)", stroke: "#2d3047", "stroke-width": 2 }), 0, ruhig));
      const ecken = [[x0, y0, 1, 1], [x0 + b, y0, -1, 1], [x0 + b, y0 + h, -1, -1], [x0, y0 + h, 1, -1]];
      // rechter Winkel als Viertelkreis mit Punkt, wie im Begriffs-Geodreieck
      ecken.forEach(([x, y, dx, dy], i) => svg.appendChild(erscheine(s("g", { "data-stueck": "rechter-winkel" },
        s("path", { d: `M${x + dx * r},${y} A${r},${r} 0 0,${dx * dy > 0 ? 1 : 0} ${x},${y + dy * r}`, stroke: "#e5484d", "stroke-width": 1.4, fill: "none" }),
        s("circle", { cx: x + dx * r * 0.4, cy: y + dy * r * 0.4, r: 1.3, fill: "#e5484d" })), 0.4 + i * 0.2, ruhig)));
      svg.append(zeichne(s("line", { x1: x0 + b / 2, y1: y0 - 10, x2: x0 + b / 2, y2: y0 + h + 10, stroke: "#e5484d", "stroke-width": 1.6, "stroke-dasharray": "5 3" }), 1.3, ruhig, 0.4),
        zeichne(s("line", { x1: x0 - 10, y1: y0 + h / 2, x2: x0 + b + 10, y2: y0 + h / 2, stroke: "#e5484d", "stroke-width": 1.6, "stroke-dasharray": "5 3" }), 1.7, ruhig, 0.4));
      // parallele Seiten: gleiche Pfeilzeichen
      for (const [x, y, w] of [[x0 + b / 2 - 30, y0, 0], [x0 + b / 2 - 30, y0 + h, 0], [x0, y0 + h / 2 - 22, 90], [x0 + b, y0 + h / 2 - 22, 90]])
        svg.appendChild(erscheine(s("path", { d: w ? `M${x - 3},${y - 3} l3,4 l3,-4 M${x - 3},${y + 2} l3,4 l3,-4` : `M${x - 3},${y - 3} l4,3 l-4,3 M${x + 2},${y - 3} l4,3 l-4,3`, stroke: "#2f62a0", "stroke-width": 1.4, fill: "none" }), 2.0, ruhig));
      svg.setAttribute("data-anzahl", 4);
    } else {
      if (!Array.isArray(z.formen) || !z.formen.length || z.formen.length > 5 || !z.formen.every(f => FORMEN_ARTEN.includes(f))) return null;
      const n = z.formen.length, abst = Math.min(66, 280 / n), x0 = BREITE / 2 - ((n - 1) * abst) / 2, g = Math.min(54, abst * 0.85), je = (DAUER * 0.75) / n;
      let anzahl = 0;
      z.formen.forEach((art, i) => {
        const x = x0 + i * abst, { e, ecken } = form(art, x, 62, g, DEKO(i + 1), z.gedreht ? [20, -25, 35, 15, -15][i] : 0);
        e.setAttribute("data-stueck", art); anzahl++;
        const gr = s("g", {}, e);
        if (z.ecken && ecken.length) {
          const w = z.gedreht ? [20, -25, 35, 15, -15][i] : 0, rad = (w * Math.PI) / 180;
          for (const [ex, ey] of ecken) gr.appendChild(s("circle", { cx: x + (ex - x) * Math.cos(rad) - (ey - 62) * Math.sin(rad), cy: 62 + (ex - x) * Math.sin(rad) + (ey - 62) * Math.cos(rad), r: 2.8, fill: "#e5484d" }));
          gr.appendChild(text(x, 122, ecken.length, { gross: 14 }));
        }
        svg.appendChild(vonOben(gr, i * je, ruhig, 40, 0.35));
      });
      svg.setAttribute("data-anzahl", anzahl);
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 22, 20, ruhig));
    if (sterne >= 3) svg.appendChild(funken(28, 24, ruhig));
    return svg;
  }

  // ----- Flächen-Pixel (BAUEN · pixel) -----
  /** Umfang einer Figur aus Häuschen: Seiten, an die kein anderes Häuschen grenzt (wie im Spiel). */
  function randKanten(zellen) {
    const da = new Set(zellen.map(schluessel)), k = [];
    for (const [x, y] of zellen) {
      if (!da.has(`${x},${y - 1}`)) k.push([x, y, x + 1, y]);
      if (!da.has(`${x + 1},${y}`)) k.push([x + 1, y, x + 1, y + 1]);
      if (!da.has(`${x},${y + 1}`)) k.push([x, y + 1, x + 1, y + 1]);
      if (!da.has(`${x - 1},${y}`)) k.push([x, y, x, y + 1]);
    }
    return k;
  }
  /**
   * Häuschen füllen sich eines nach dem anderen, darunter ihre Zahl; zwei Figuren: die grössere leuchtet. umfang: die
   * Umfangslinie läuft um die Figur herum, daneben ihre Länge in Häuschen-Seiten (wie im Spiel).
   */
  function pixel(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.figuren) || !z.figuren.length || z.figuren.length > 2) return null;
    if (z.figuren.some(f => !Array.isArray(f) || !f.length || new Set(f.map(schluessel)).size !== f.length || f.some(p => !p.every(v => Number.isInteger(v) && v >= 0 && v < 10)))) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "pixel", "data-anzahl": z.figuren.flat().length });
    svg.appendChild(tagGrund());
    const n = z.figuren.length, flaechen = z.figuren.map(f => f.length);
    // Raster um die Figuren mit einem Häuschen Rand, für beide Figuren gleich gross (gleiche Häuschen zum Vergleichen)
    const alleZ = z.figuren.flat(), x1 = Math.min(...alleZ.map(p => p[0])) - 1, y1 = Math.min(...alleZ.map(p => p[1])) - 1;
    const RB = Math.max(...alleZ.map(p => p[0])) - x1 + 2, RH = Math.max(...alleZ.map(p => p[1])) - y1 + 2;
    const c = Math.min(16, 112 / RH, (n === 1 ? 200 : 120) / RB), rb = RB * c;
    const je = (DAUER * 0.75) / alleZ.length;
    let k0 = 0;
    z.figuren.forEach((f, i) => {
      const bx = n === 1 ? BREITE / 2 - rb / 2 : BREITE / 2 + (i ? 20 : -20 - rb), by = 8 + (112 - RH * c) / 2;
      svg.append(s("rect", { x: bx, y: by, width: rb, height: RH * c, fill: "#ffffff" }), gitter(bx, by, RB, RH, c));
      f.forEach(([x, y]) => svg.appendChild(erscheine(s("rect", { x: bx + (x - x1) * c + 0.6, y: by + (y - y1) * c + 0.6, width: c - 1.2, height: c - 1.2, style: `fill:${DEKO(i * 2 + 5)}`, "data-stueck": "haeuschen" }), (k0++) * je, ruhig, 0.12)));
      const gross = n === 2 && f.length === Math.max(...flaechen) && flaechen[0] !== flaechen[1];
      if (gross) svg.appendChild(erscheine(s("rect", { x: bx - 3, y: by - 3, width: rb + 6, height: RH * c + 6, rx: 4, fill: "none", stroke: "#f5b301", "stroke-width": 2.4 }), DAUER * 0.85, ruhig));
      if (z.umfang) {
        // Umfangslinie: Kante um Kante im Kreis um die Mitte herum
        const kanten = randKanten(f), mx = f.reduce((a, p) => a + p[0] + 0.5, 0) / f.length, my = f.reduce((a, p) => a + p[1] + 0.5, 0) / f.length;
        kanten.sort((a, b) => Math.atan2((a[1] + a[3]) / 2 - my, (a[0] + a[2]) / 2 - mx) - Math.atan2((b[1] + b[3]) / 2 - my, (b[0] + b[2]) / 2 - mx));
        const kj = (DAUER * 0.5) / kanten.length;
        kanten.forEach(([ax, ay, ex, ey], j) => svg.appendChild(erscheine(s("line", { x1: bx + (ax - x1) * c, y1: by + (ay - y1) * c, x2: bx + (ex - x1) * c, y2: by + (ey - y1) * c, stroke: "#e5484d", "stroke-width": 2.6, "stroke-linecap": "round" }), DAUER * 0.45 + j * kj, ruhig, 0.08)));
        svg.appendChild(erscheine(text(bx + rb + 22, by + (RH * c) / 2 + 6, kanten.length, { gross: 16, farbe: "#e5484d" }), DAUER * 0.95, ruhig));
        svg.setAttribute("data-wert", `${f.length},${kanten.length}`);
      }
      svg.appendChild(erscheine(text(bx + rb / 2, 140, f.length, { gross: 15 }), DAUER * 0.8, ruhig));
    });
    if (n === 2 && flaechen[0] !== flaechen[1]) svg.appendChild(erscheine(text(BREITE / 2, 140, flaechen[0] < flaechen[1] ? "<" : ">", { gross: 16 }), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 26, ruhig));
    return svg;
  }

  // ----- Pentomino-Puzzle (BAUEN · pentomino) -----
  /** Die Teile der Stufe fallen in den Umriss; geprüft: sie füllen ihn genau, ohne Lücke und ohne Überlappung. */
  function pentomino(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.teile) || !z.teile.length || !(z.breite > 0 && z.hoehe > 0)) return null;
    const alle = z.teile.flat();
    if (alle.length !== z.breite * z.hoehe || new Set(alle.map(schluessel)).size !== alle.length || alle.some(([x, y]) => x < 0 || y < 0 || x >= z.breite || y >= z.hoehe)) return null;
    // jedes Teil zusammenhängend und gleich gross (Vierlinge oder Fünflinge)
    const zusammen = f => { const da = new Set(f.map(schluessel)), weg = [f[0]], ges = new Set([schluessel(f[0])]);
      while (weg.length) { const [x, y] = weg.pop(); for (const q of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) if (da.has(schluessel(q)) && !ges.has(schluessel(q))) { ges.add(schluessel(q)); weg.push(q); } }
      return ges.size === f.length; };
    if (!z.teile.every(f => f.length === z.teile[0].length && zusammen(f))) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "pentomino", "data-anzahl": z.teile.length });
    svg.appendChild(tagGrund());
    const c = Math.min(28, 124 / z.hoehe, 270 / z.breite), x0 = (BREITE - z.breite * c) / 2, y0 = (HOEHE - z.hoehe * c) / 2 + 2;
    svg.appendChild(s("rect", { x: x0, y: y0, width: z.breite * c, height: z.hoehe * c, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 1.4, "stroke-dasharray": "4 3" }));
    const je = (DAUER * 0.8) / z.teile.length;
    z.teile.forEach((f, i) => {
      const da = new Set(f.map(schluessel)), farbe = DEKO(i);
      const g = s("g", { "data-stueck": "teil" });
      for (const [x, y] of f) g.appendChild(s("rect", { x: x0 + x * c, y: y0 + y * c, width: c, height: c, style: `fill:${farbe};stroke:${farbe}`, "stroke-width": 0.6 }));
      // Umriss des Teils
      const kanten = randKanten(f).map(([x1, y1, x2, y2]) => `M${x0 + x1 * c},${y0 + y1 * c} L${x0 + x2 * c},${y0 + y2 * c}`).join(" ");
      g.appendChild(s("path", { d: kanten, stroke: "#2d3047", "stroke-width": 1.6, "stroke-linecap": "round" }));
      g.setAttribute("data-zellen", da.size);
      svg.appendChild(vonOben(g, i * je, ruhig, 40, 0.35));
    });
    if (sterne >= 2) svg.appendChild(glanz(x0 + z.breite * c + 10, y0 + 6, ruhig));
    if (sterne >= 3) svg.appendChild(funken(Math.max(x0 - 22, 24), 26, ruhig));
    return svg;
  }

  // ----- Würfelgebäude (Würfelbau-Blick, Würfel-Zähler, Quader-Volumen) -----
  // Wie im Würfelbau-Blick: von vorne rechts oben gesehen; c Spalte (links → rechts), r Reihe (vorne 0 → hinten),
  // z Höhe. Sichtbar sind Oberseite, Vorderseite und rechte Seite.
  const BLAU = ["#b7d2f2", "#5b8fd6", "#3d6db5"], ORANGE = ["#fbd3a6", "#f0913a", "#c96d1c"];
  const isoProj = (a, ox, oy) => (c, r, z) => [ox + (c + r) * a * 0.866, oy + (c - r) * a * 0.5 - z * a];
  function wuerfelIso(P, c, r, z, farben) {
    const f = pts => pts.map(p => P(...p).map(v => v.toFixed(2)).join(",")).join(" "), rand = { stroke: "#2d3047", "stroke-width": 0.8, "stroke-linejoin": "round" };
    return s("g", { "data-stueck": "wuerfel" },
      s("polygon", { points: f([[c, r, z + 1], [c + 1, r, z + 1], [c + 1, r + 1, z + 1], [c, r + 1, z + 1]]), fill: farben[0], ...rand }),
      s("polygon", { points: f([[c, r, z], [c + 1, r, z], [c + 1, r, z + 1], [c, r, z + 1]]), fill: farben[1], ...rand }),
      s("polygon", { points: f([[c + 1, r, z], [c + 1, r + 1, z], [c + 1, r + 1, z + 1], [c + 1, r, z + 1]]), fill: farben[2], ...rand }));
  }
  /** Würfel aus einem Bauplan (Zeilen hinten → vorne wie im Spiel, Zahl = Würfel übereinander). */
  const wuerfelAusPlan = (plan, farben = BLAU) => plan.flatMap((zeile, i) => zeile.flatMap((h, c) => Array.from({ length: h }, (_, z) => [c, plan.length - 1 - i, z, farben])));
  const planGueltig = plan => Array.isArray(plan) && plan.length && plan.every(z => Array.isArray(z) && z.length === plan[0].length && z.every(h => Number.isInteger(h) && h >= 0 && h <= 6));
  /**
   * Gebäude in das Feld [bx, by, bw, bh] einpassen und Würfel um Würfel bauen (hinten vor vorne, unten vor oben).
   * wuerfel: [[c, r, z, farben, ab?], …]; ab: eigener Zeitpunkt (dazukommende Würfel).
   */
  function gebaeudeMasse(wuerfel) {
    const P1 = isoProj(1, 0, 0), ecken = wuerfel.flatMap(([c, r, z]) => [[c, r, z], [c + 1, r + 1, z + 1], [c + 1, r, z], [c, r + 1, z + 1], [c + 1, r, z + 1], [c, r + 1, z]].map(e => P1(...e)));
    return { minX: Math.min(...ecken.map(p => p[0])), maxX: Math.max(...ecken.map(p => p[0])), minY: Math.min(...ecken.map(p => p[1])), maxY: Math.max(...ecken.map(p => p[1])) };
  }
  /** Grösste Würfelkante, mit der das Gebäude ins Feld passt (mehrere Gebäude im selben Bild: die kleinste davon). */
  const gebaeudeKante = (wuerfel, [, , bw, bh], aMax = 20) => { const m = gebaeudeMasse(wuerfel); return Math.min(aMax, bw / (m.maxX - m.minX), bh / (m.maxY - m.minY)); };
  function gebaeude(wuerfel, [bx, by, bw, bh], { aMax = 20, a: kante, ab = 0, je = 0.1, ruhig, fallen = true } = {}) {
    const { minX, maxX, minY, maxY } = gebaeudeMasse(wuerfel);
    // kante: fester Massstab, damit Gebäude im selben Bild vergleichbar sind
    const a = kante ?? Math.min(aMax, bw / (maxX - minX), bh / (maxY - minY)), ox = bx + (bw - (maxX - minX) * a) / 2 - minX * a, oy = by + bh - maxY * a;
    const P = isoProj(a, ox, oy), g = s("g", {});
    // von hinten nach vorne zeichnen (Tiefe c − r wie im Spiel), unten vor oben
    [...wuerfel].sort((p, q) => (p[0] - p[1]) - (q[0] - q[1]) || p[2] - q[2])
      .forEach((w, i) => { const e = wuerfelIso(P, w[0], w[1], w[2], w[3] || BLAU); g.appendChild(fallen ? vonOben(e, w[4] ?? ab + i * je, ruhig, 24, 0.25) : erscheine(e, w[4] ?? ab + i * je, ruhig, 0.2)); });
    return { g, P, a, mitte: ox + ((maxX + minX) / 2) * a, unten: oy + maxY * a };
  }
  /** Ansicht eines Bauplans wie im Spiel: oben (Grundriss, hinten oben), vorne (je Spalte die höchste), rechts (je Reihe). */
  function ansichtVon(plan, seite) {
    const n = plan[0].length, m = plan.length, h = (c, r) => plan[m - 1 - r][c];
    if (seite === "oben") return plan.map(z => z.map(v => v > 0));
    const hoehen = seite === "vorne" ? [...Array(n).keys()].map(c => Math.max(...[...Array(m).keys()].map(r => h(c, r)))) : [...Array(m).keys()].map(r => Math.max(...[...Array(n).keys()].map(c => h(c, r))));
    const H = Math.max(...hoehen);
    return [...Array(H).keys()].map(z => hoehen.map(v => v >= H - z));
  }
  function ansichtBild(raster, x, y, c, farbe) {
    const g = s("g", { "data-ansicht": raster.map(z => z.map(v => (v ? 1 : 0)).join("")).join("/") });
    raster.forEach((zeile, j) => zeile.forEach((v, i) => g.appendChild(s("rect", { x: x + i * c, y: y + j * c, width: c, height: c, fill: v ? farbe : "#ffffff", stroke: "#2d3047", "stroke-width": 0.8 }))));
    return g;
  }

  // ----- Würfelbau-Blick (BAUEN · wuerfelbau) -----
  /** Das Gebäude der Stufe wächst Würfel um Würfel; dann seine Ansichten (oben, vorne, rechts) oder der Bauplan mit Zahlen. */
  function wuerfelbau(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !planGueltig(z.plan)) return null;
    const wuerfel = wuerfelAusPlan(z.plan), n = wuerfel.length;
    if (!n || n > 30) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "wuerfelbau", "data-anzahl": n, "data-wert": n });
    svg.appendChild(tagGrund());
    const rechts = (z.ansichten?.length || z.zahlen) ? 1 : 0;
    const { g } = gebaeude(wuerfel, rechts ? [16, 14, 150, 112] : [60, 14, 200, 112], { je: (DAUER * 0.6) / n, ruhig, aMax: 24 });
    svg.appendChild(g);
    const spalte = 186;
    if (z.zahlen) {
      // Bauplan von oben: hinten oben, vorne unten, die Zahl = Würfel übereinander
      const c = Math.min(22, 100 / z.plan.length, 110 / z.plan[0].length), y0 = 70 - (z.plan.length * c) / 2;
      const plan = s("g", { "data-plan": z.plan.map(r => r.join("")).join("/") });
      z.plan.forEach((zeile, j) => zeile.forEach((h, i) => plan.append(s("rect", { x: spalte + i * c, y: y0 + j * c, width: c, height: c, fill: h ? "#e8f0fb" : "#ffffff", stroke: "#2d3047", "stroke-width": 1 }),
        ...(h ? [text(spalte + (i + 0.5) * c, y0 + (j + 0.5) * c + 4.5, h, { gross: 12 })] : []))));
      svg.appendChild(erscheine(plan, DAUER * 0.7, ruhig, 0.3));
    } else if (z.ansichten?.length) {
      const zeilenGesamt = z.ansichten.reduce((a, seite) => a + ansichtVon(z.plan, seite).length, 0);
      const c = Math.min(12, (120 - 10 * (z.ansichten.length - 1)) / zeilenGesamt), je = 0.25;
      let y = 10;
      z.ansichten.forEach((seite, k) => {
        if (!["oben", "vorne", "rechts"].includes(seite)) return;
        const r = ansichtVon(z.plan, seite);
        // ein Zeichen für die Blickrichtung: Auge mit Pfeil (oben ↓, vorne ↗, rechts ↖)
        const pfeil = { oben: "M0,-6 v10 m-3,-3 l3,3 l3,-3", vorne: "M-5,5 l8,-8 m-5,0 h5 v5", rechts: "M5,5 l-8,-8 m5,0 h-5 v5" }[seite];
        svg.appendChild(erscheine(s("g", { "data-seite": seite }, s("path", { d: pfeil, transform: `translate(${spalte + 6} ${y + 8})`, stroke: "#e5484d", "stroke-width": 1.6, fill: "none" }),
          ansichtBild(r, spalte + 20, y, c, BLAU[1])), DAUER * 0.65 + k * je, ruhig, 0.25));
        y += r.length * c + 10;
      });
    }
    svg.appendChild(erscheine(text(rechts ? 90 : BREITE / 2, 142, n, { gross: 14 }), DAUER * 0.8, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(28, 24, ruhig));
    return svg;
  }

  // ----- Netz-Falter (BAUEN · netz) -----
  // Würfelnetze wie im Spiel als Felder; Quadernetz als Rechtecke; Pyramide aus Quadrat und vier Dreiecken.
  const WUERFELNETZE = { kreuz: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], treppe: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]] };
  const AUGEN_FELD = { 1: [[0.5, 0.5]], 2: [[0.25, 0.25], [0.75, 0.75]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
    5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], 6: [[0.25, 0.22], [0.25, 0.5], [0.25, 0.78], [0.75, 0.22], [0.75, 0.5], [0.75, 0.78]] };
  function augen(x, y, c, zahl) {
    return s("g", { "data-augen": zahl }, ...AUGEN_FELD[zahl].map(([u, v]) => s("circle", { cx: x + u * c, cy: y + v * c, r: c * (zahl === 1 ? 0.13 : 0.09), fill: zahl === 1 ? "#e5484d" : "#2d3047" })));
  }
  /**
   * Links das Netz, Fläche um Fläche; rechts der Körper, der daraus entsteht. gegenueber: Gegenflächen gleich gefärbt
   * (Würfel aus drei Farben); augen: Spielwürfel, Gegenseiten zusammen 7 (geprüft); quader: Netz eines Quaders l × b × h;
   * pyramide: Netz einer Pyramide mit quadratischer Grundfläche.
   */
  function netz(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "netz" });
    svg.appendChild(tagGrund());
    const flaechen = []; // { d | rect, farbe, inhalt }
    let koerper;
    const c = 24, x0 = 20, y0 = 30;
    if (z.wuerfel) {
      const netzF = WUERFELNETZE[z.wuerfel];
      if (!netzF) return null;
      // Gegenflächen im Kreuz: oben ↔ unten in der Spalte, links ↔ Mitte+2 in der Zeile (nur fürs Kreuz)
      const paar = { "1,0": 0, "1,2": 0, "0,1": 1, "2,1": 1, "1,1": 2, "3,1": 2 };
      if ((z.gegenueber || z.augen) && z.wuerfel !== "kreuz") return null;
      if (z.augen) {
        const a = z.augen; // Augen je Feld des Kreuzes
        if (!Array.isArray(a) || a.length !== 6 || new Set(a).size !== 6) return null;
        const zuFeld = Object.fromEntries(netzF.map((p, i) => [schluessel(p), a[i]]));
        if (zuFeld["1,0"] + zuFeld["1,2"] !== 7 || zuFeld["0,1"] + zuFeld["2,1"] !== 7 || zuFeld["1,1"] + zuFeld["3,1"] !== 7) return null;
      }
      netzF.forEach((p, i) => flaechen.push({ rect: [x0 + p[0] * c, y0 + p[1] * c, c, c], farbe: z.gegenueber ? DEKO([1, 3, 5][paar[schluessel(p)]]) : "var(--deko-4)", augen: z.augen?.[i] }));
      koerper = z.gegenueber ? "farbig" : z.augen ? "augen" : "wuerfel";
    } else if (z.quader) {
      const [l, b, h] = z.quader, e = 16;
      if (![l, b, h].every(v => Number.isInteger(v) && v >= 1 && v <= 4) || (2 * h + 2 * l) * e > 160) return null;
      // Rechtecke: hinten, links, Boden, rechts, Deckel, vorne
      [[h, 0, l, h], [0, h, h, b], [h, h, l, b], [h + l, h, h, b], [2 * h + l, h, l, b], [h, h + b, l, h]]
        .forEach(([x, y, w, hh], i) => flaechen.push({ rect: [x0 + x * e, y0 - 10 + y * e, w * e, hh * e], farbe: DEKO([1, 3, 5, 3, 5, 1][i]) }));
      koerper = "quader";
    } else if (z.pyramide) {
      const q = 34, mx = x0 + 60, my = y0 + 42, hh = 30;
      flaechen.push({ d: `M${mx - q / 2},${my - q / 2} h${q} v${q} h${-q} Z`, farbe: "var(--deko-4)" });
      for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const ax = mx + (dx ? dx * q / 2 : -q / 2), ay = my + (dy ? dy * q / 2 : -q / 2), bx = mx + (dx ? dx * q / 2 : q / 2), by = my + (dy ? dy * q / 2 : q / 2);
        flaechen.push({ d: `M${ax},${ay} L${bx},${by} L${mx + dx * (q / 2 + hh)},${my + dy * (q / 2 + hh)} Z`, farbe: "var(--deko-3)" });
      }
      koerper = "pyramide";
    } else return null;
    const je = (DAUER * 0.55) / flaechen.length;
    flaechen.forEach((f, i) => {
      const g = s("g", { "data-stueck": "flaeche" }, f.rect ? s("rect", { x: f.rect[0], y: f.rect[1], width: f.rect[2], height: f.rect[3], style: `fill:${f.farbe}`, stroke: "#2d3047", "stroke-width": 1.2 })
        : s("path", { d: f.d, style: `fill:${f.farbe}`, stroke: "#2d3047", "stroke-width": 1.2, "stroke-linejoin": "round" }));
      if (f.augen) g.appendChild(augen(f.rect[0], f.rect[1], c, f.augen));
      svg.appendChild(erscheine(g, i * je, ruhig, 0.2));
    });
    svg.setAttribute("data-anzahl", flaechen.length);
    // Pfeil und Körper rechts
    svg.appendChild(erscheine(s("path", { d: "M176,72 h22 m-6,-5 l6,5 l-6,5", stroke: "#6b7089", "stroke-width": 2, fill: "none" }), DAUER * 0.6, ruhig));
    const kx = 254, ky = 74, k = 26, t = 14, st = { stroke: "#2d3047", "stroke-width": 1.4, "stroke-linejoin": "round" };
    const box = (b, hh, farben) => s("g", { "data-koerper": koerper }, s("rect", { x: kx - b, y: ky - hh + t / 2, width: 2 * b, height: 2 * hh, style: `fill:${farben[0]}`, ...st }),
      s("path", { d: `M${kx - b},${ky - hh + t / 2} l${t},${-t} h${2 * b} l${-t},${t} Z`, style: `fill:${farben[1]}`, ...st }),
      s("path", { d: `M${kx + b},${ky - hh + t / 2} l${t},${-t} v${2 * hh} l${-t},${t} Z`, style: `fill:${farben[2]}`, ...st }));
    let kg;
    if (koerper === "wuerfel") kg = box(k, k, ["var(--deko-4)", "var(--deko-4)", "var(--deko-4)"]);
    // gefaltet ist das Kreuz ein westlicher Spielwürfel: 1 oben, 2 vorne, 3 rechts — so gezeichnet wie im Würfel-Kipper
    else if (koerper === "augen") kg = s("g", { "data-koerper": "augen", transform: `translate(${kx - 30} ${ky + 34})` }, spielwuerfel({ o: 1, u: 6, v: 2, h: 5, r: 3, l: 4 }, 52));
    else if (koerper === "farbig") kg = box(k, k, [DEKO(1), DEKO(5), DEKO(3)]);
    // Quader in den Farben seiner Gegenflächen im Netz: vorne wie hinten, Deckel wie Boden, rechts wie links
    else if (koerper === "quader") { const [l, , h] = z.quader, f = 34 / Math.max(l, h); kg = box((l * f) / 2 + 6, (h * f) / 2 + 4, [DEKO(1), DEKO(5), DEKO(3)]); }
    else kg = s("g", { "data-koerper": "pyramide" }, s("path", { d: `M${kx - 34},${ky + 26} L${kx + 18},${ky + 26} L${kx + 4},${ky - 34} Z`, style: "fill:var(--deko-3)", ...st }),
      s("path", { d: `M${kx + 18},${ky + 26} L${kx + 38},${ky + 10} L${kx + 4},${ky - 34} Z`, style: "fill:var(--deko-3)", "fill-opacity": 0.7, ...st }));
    svg.appendChild(erscheine(kg, DAUER * 0.7, ruhig, 0.35));
    if (z.augen) svg.appendChild(erscheine(zeileUnten("1 + 6 = 2 + 5 = 3 + 4 = 7", 142), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 60, 26, ruhig));
    return svg;
  }

  // ----- Rechteck-Labor (BAUEN · rechtecke) -----
  /**
   * Rechtecke der Stufe auf Häuschenpapier (1 Häuschen = 1 cm), eines nach dem anderen; darunter Fläche (l · b) oder
   * Umfang (l + b + l + b); hervor: das Rechteck mit der grössten Fläche leuchtet (geprüft).
   */
  function rechtecke(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.rechtecke) || !z.rechtecke.length || z.rechtecke.length > 4 || !z.rechtecke.every(r => r.every(v => Number.isInteger(v) && v >= 1 && v <= 12))) return null;
    const flaeche = ([l, b]) => l * b, umfang = ([l, b]) => 2 * (l + b);
    if (z.hervor !== undefined && flaeche(z.rechtecke[z.hervor]) !== Math.max(...z.rechtecke.map(flaeche))) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "rechtecke", "data-anzahl": z.rechtecke.length });
    svg.appendChild(tagGrund());
    const n = z.rechtecke.length, breiten = z.rechtecke.map(r => r[0]), c = Math.min(n === 1 ? 18 : 12, (280 - (n - 1) * 14) / breiten.reduce((a, b) => a + b, 0), 92 / Math.max(...z.rechtecke.map(r => r[1])));
    let x = (BREITE - (breiten.reduce((a, b) => a + b, 0) * c + (n - 1) * 14)) / 2;
    const je = (DAUER * 0.75) / n;
    z.rechtecke.forEach(([l, b], i) => {
      const y = 104 - b * c, g = s("g", { "data-stueck": "rechteck", "data-wert": `${l}x${b}` },
        s("rect", { x, y, width: l * c, height: b * c, style: `fill:${i === z.hervor ? "var(--deko-4)" : "var(--deko-6)"}`, "fill-opacity": 0.75 }), gitter(x, y, l, b, c, "#ffffff"),
        s("rect", { x, y, width: l * c, height: b * c, fill: "none", stroke: "#2d3047", "stroke-width": 1.6 }));
      if (i === z.hervor) g.appendChild(erscheine(s("rect", { x: x - 3, y: y - 3, width: l * c + 6, height: b * c + 6, rx: 3, fill: "none", stroke: "#f5b301", "stroke-width": 2.4 }), DAUER * 0.85, ruhig));
      // mehrere Rechtecke: Fläche und Umfang unter jedem; eines allein: die Rechnung als Zeile darunter
      const zeilen = [];
      if (n > 1 && z.zeige !== "umfang") zeilen.push(`${flaeche([l, b])} cm²`);
      if (n > 1 && z.zeige !== "flaeche") zeilen.push(`${umfang([l, b])} cm`);
      zeilen.forEach((zt, k) => g.appendChild(text(x + (l * c) / 2, 118 + k * 14, zt, { gross: n > 2 ? 10 : 12, farbe: k ? "#c96d1c" : "#2d3047" })));
      svg.appendChild(vonOben(g, i * je, ruhig, 30, 0.35));
      x += l * c + 14;
    });
    if (n === 1) {
      const [l, b] = z.rechtecke[0], fl = `${l} cm · ${b} cm = ${flaeche([l, b])} cm²`, um = `${l} + ${b} + ${l} + ${b} = ${umfang([l, b])} cm`;
      if (z.zeige === "beide") svg.append(erscheine(text(BREITE / 2, 124, fl, { gross: 12 }), DAUER * 0.8, ruhig), erscheine(text(BREITE / 2, 140, um, { gross: 12, farbe: "#c96d1c" }), DAUER * 0.9, ruhig));
      else svg.appendChild(erscheine(zeileUnten(z.zeige === "umfang" ? um : fl, 136), DAUER * 0.8, ruhig));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 24, ruhig));
    return svg;
  }

  // ----- Würfel-Kipper (REISE · kipper) -----
  // Wie im Spiel: Seiten o, u, v, h, r, l; kippen = Seiten tauschen (KIPP); Start 1 oben, 2 vorne, 3 rechts (1, 2, 3 um
  // ihre gemeinsame Ecke gegen den Uhrzeigersinn, westlicher Spielwürfel).
  const KIPP = {
    rechts: { r: "o", u: "r", l: "u", o: "l", v: "v", h: "h" }, links: { l: "o", u: "l", r: "u", o: "r", v: "v", h: "h" },
    vorne: { v: "o", u: "v", h: "u", o: "h", r: "r", l: "l" }, hinten: { h: "o", u: "h", v: "u", o: "v", r: "r", l: "l" },
  };
  const kippe = (lage, d) => Object.fromEntries(Object.keys(lage).map(k => [k, lage[KIPP[d][k]]]));
  const SCHRITT_KARTE = { rechts: [1, 0], links: [-1, 0], hinten: [0, -1], vorne: [0, 1] };
  /** Spielwürfel im Schrägbild wie im Spiel (Vorderseite, Oberseite und rechte Seite nach hinten oben), Ecke links unten auf 0,0. */
  function spielwuerfel(lage, k) {
    const t = k / 2, st = { stroke: "#2d3047", "stroke-width": 1.2, "stroke-linejoin": "round" };
    const g = s("g", { "data-oben": lage.o, "data-vorne": lage.v, "data-rechts": lage.r },
      s("rect", { x: 0, y: -k, width: k, height: k, fill: "#ffffff", ...st }), s("path", { d: `M0,${-k} l${t},${-t} h${k} l${-t},${t} Z`, fill: "#f2f2f7", ...st }),
      s("path", { d: `M${k},${-k} l${t},${-t} v${k} l${-t},${t} Z`, fill: "#dfe3ef", ...st }));
    g.appendChild(augen(0, -k, k, lage.v));
    // Augen auf Oberseite und rechter Seite schräg: mit Matrix in die Fläche gelegt
    const oben = augen(0, 0, 1, lage.o), rechts = augen(0, 0, 1, lage.r);
    oben.setAttribute("transform", `matrix(${k} 0 ${-t} ${t} ${t} ${-k - t})`);
    rechts.setAttribute("transform", `matrix(${t} ${-t} 0 ${k} ${k} ${-k})`);
    g.append(oben, rechts);
    return g;
  }
  /**
   * Links die Wegkarte von oben (hinten oben, vorne unten) mit dem Weg der Stufe, ein Stein läuft ihn ab; rechts der
   * Würfel nach jedem Kipp. gegen: ohne Weg, die Gegenseiten oben und unten ergeben 7. oben: die Zahl, die am Ende oben
   * liegen soll (geprüft).
   */
  function kipper(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.weg) || z.weg.length > 6 || !z.weg.every(d => KIPP[d])) return null;
    const start = { o: 1, u: 6, v: 2, h: 5, r: 3, l: 4 };
    const lagen = z.weg.reduce((l, d) => [...l, kippe(l[l.length - 1], d)], [start]), ende = lagen[lagen.length - 1];
    if (z.oben !== undefined && ende.o !== z.oben) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "kipper", "data-wert": ende.o });
    svg.appendChild(tagGrund());
    const T = DAUER * 0.8, je = z.weg.length ? T / z.weg.length : T;
    if (z.weg.length) {
      // Karte: Felder des Wegs
      let p = [0, 0];
      const felder = [p];
      for (const d of z.weg) { p = [p[0] + SCHRITT_KARTE[d][0], p[1] + SCHRITT_KARTE[d][1]]; felder.push(p); }
      const xs = felder.map(f => f[0]), ys = felder.map(f => f[1]), c = Math.min(32, 130 / (Math.max(...xs) - Math.min(...xs) + 1), 110 / (Math.max(...ys) - Math.min(...ys) + 1));
      const kx = 20 + (130 - (Math.max(...xs) - Math.min(...xs) + 1) * c) / 2 - Math.min(...xs) * c, ky = 18 + (110 - (Math.max(...ys) - Math.min(...ys) + 1) * c) / 2 - Math.min(...ys) * c;
      felder.forEach(([x, y], i) => svg.appendChild(s("rect", { x: kx + x * c + 1, y: ky + y * c + 1, width: c - 2, height: c - 2, rx: 3, fill: i === felder.length - 1 ? "#e6f6ec" : "#ffffff", stroke: "#8a94a6", "stroke-width": 1 })));
      const weg = "M" + felder.map(([x, y]) => `${kx + (x + 0.5) * c},${ky + (y + 0.5) * c}`).join(" L");
      svg.appendChild(s("path", { d: weg, stroke: "#c9cde0", "stroke-width": 2, fill: "none", "stroke-dasharray": "3 2" }));
      const [lx, ly] = felder[felder.length - 1];
      svg.appendChild(bewege(s("g", { "data-figur": "stein" }, s("rect", { x: -c * 0.32, y: -c * 0.32, width: c * 0.64, height: c * 0.64, rx: 2, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 1.2 })),
        weg, { x: kx + (lx + 0.5) * c, y: ky + (ly + 0.5) * c, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T }));
    }
    // rechts der Würfel nach jedem Kipp (die Lage davor verschwindet)
    const wx = z.weg.length ? 196 : 118, wy = 112, k = 52;
    lagen.forEach((l, i) => {
      const w = s("g", { transform: `translate(${wx} ${wy})` }, spielwuerfel(l, k));
      const g = s("g", { "data-lage": i }, w);
      if (i === lagen.length - 1) svg.appendChild(erscheine(g, i * je, ruhig, 0.15));
      else if (!ruhig) svg.appendChild(kurz(g, i * je, (i + 1) * je, ruhig));
    });
    if (!z.weg.length) svg.appendChild(erscheine(zeileUnten(`${ende.o} + ${ende.u} = 7`, 142), DAUER * 0.6, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 50, 30, ruhig));
    return svg;
  }

  // ----- Begriffs-Geodreieck (BAUEN · geo) -----
  /**
   * Die Figur der Stufe zeichnet sich Linie um Linie, Fachbegriffe als Zeichen wie im Lehrmittel: Ecken als Punkte,
   * rechte Winkel als Viertelkreis mit Punkt, gleich lange Strecken mit Strichen, Mittelpunkt und Radius.
   */
  function geo(feier, { stufe, sterne, ruhig }) {
    const art = feier.ziele?.[stufe];
    const FIGUREN = ["rechteck-kreis", "sechseck-kreis", "parallel-senkrecht", "schnittpunkt", "quadrat-diagonalen", "alles"];
    if (!FIGUREN.includes(art)) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "geo", "data-ziel": art });
    svg.appendChild(tagGrund());
    const teile = []; // [element, zeit]
    const linie = (x1, y1, x2, y2, farbe = "#2d3047", breit = 2, extra = {}) => s("line", { x1, y1, x2, y2, stroke: farbe, "stroke-width": breit, "stroke-linecap": "round", ...extra });
    const punkt = (x, y, farbe = "#2d3047") => s("circle", { cx: x, cy: y, r: 3, fill: farbe });
    const rechterWinkel = (x, y, ux, uy, vx, vy, r = 9) => s("g", { "data-stueck": "rechter-winkel" }, s("path", { d: `M${x + ux * r},${y + uy * r} A${r},${r} 0 0,${ux * vy - uy * vx > 0 ? 1 : 0} ${x + vx * r},${y + vy * r}`, stroke: "#e5484d", "stroke-width": 1.4, fill: "none" }),
      s("circle", { cx: x + (ux + vx) * r * 0.4, cy: y + (uy + vy) * r * 0.4, r: 1.3, fill: "#e5484d" }));
    const strich = (x1, y1, x2, y2, n = 1) => { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, l = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / l * 4, ny = (x2 - x1) / l * 4, tx = (x2 - x1) / l * 2.5, ty = (y2 - y1) / l * 2.5;
      return s("path", { d: [...Array(n).keys()].map(i => `M${mx - nx + (i - (n - 1) / 2) * tx},${my - ny + (i - (n - 1) / 2) * ty} l${2 * nx},${2 * ny}`).join(" "), stroke: "#2f62a0", "stroke-width": 1.4 }); };
    let zt = 0;
    const neu = (e, dauer = 0.3, zeichnen = true) => { teile.push([zeichnen ? zeichne(e, zt, ruhig, dauer) : erscheine(e, zt, ruhig, 0.2), zt]); zt += dauer * 0.8; };
    const rechteck = (x, y, b, h, mitEcken = true, winkel = false) => {
      neu(s("rect", { x, y, width: b, height: h, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 2 }), 0.5);
      if (mitEcken) for (const [ex, ey] of [[x, y], [x + b, y], [x + b, y + h], [x, y + h]]) neu(punkt(ex, ey, "#e5484d"), 0.1, false);
      if (winkel) for (const [ex, ey, ux, uy, vx, vy] of [[x, y, 1, 0, 0, 1], [x + b, y, 0, 1, -1, 0], [x + b, y + h, -1, 0, 0, -1], [x, y + h, 0, -1, 1, 0]]) neu(rechterWinkel(ex, ey, ux, uy, vx, vy), 0.15, false);
    };
    const kreis = (x, y, r, radien = 1, durchmesser = false) => {
      neu(s("circle", { cx: x, cy: y, r, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 2 }), 0.5);
      neu(punkt(x, y, "#e5484d"), 0.1, false);
      for (let i = 0; i < radien; i++) { const w = -Math.PI / 4 + (i * 2 * Math.PI) / Math.max(radien, 1) ; neu(linie(x, y, x + r * Math.cos(w), y + r * Math.sin(w), "var(--deko-6)", 2, { style: "stroke:var(--deko-6)" }), 0.25); }
      if (durchmesser) neu(linie(x - r, y, x + r, y, "var(--deko-3)", 2, { style: "stroke:var(--deko-3)" }), 0.3);
    };
    if (art === "rechteck-kreis") { rechteck(36, 30, 130, 80); neu(linie(36, 30, 166, 110, "var(--deko-6)", 2, { style: "stroke:var(--deko-6)" }), 0.4); kreis(242, 70, 40, 0); }
    else if (art === "sechseck-kreis") {
      const ecken = [...Array(6).keys()].map(i => [100 + 46 * Math.cos((i * Math.PI) / 3), 72 + 46 * Math.sin((i * Math.PI) / 3)]);
      neu(s("polygon", { points: ecken.map(p => p.map(v => v.toFixed(1)).join(",")).join(" "), fill: "#ffffff", stroke: "#2d3047", "stroke-width": 2 }), 0.5);
      for (const i of [2, 3, 4]) neu(linie(...ecken[0], ...ecken[i], "var(--deko-6)", 1.8, { style: "stroke:var(--deko-6)" }), 0.25);
      kreis(240, 72, 42, 1, true);
    } else if (art === "parallel-senkrecht") {
      neu(linie(30, 46, 290, 46), 0.4); neu(linie(30, 100, 290, 100), 0.4);
      for (const y of [46, 100]) neu(s("path", { d: `M${70 - 3},${y - 3} l4,3 l-4,3 M${74},${y - 3} l4,3 l-4,3`, stroke: "#2f62a0", "stroke-width": 1.4, fill: "none" }), 0.1, false);
      neu(linie(200, 24, 200, 124, "#e5484d", 2), 0.4);
      neu(rechterWinkel(200, 46, -1, 0, 0, 1), 0.15, false); neu(rechterWinkel(200, 100, -1, 0, 0, 1), 0.15, false);
    } else if (art === "schnittpunkt") {
      // gedrehtes Rechteck mit beiden Diagonalen, ihr Schnittpunkt
      const g = s("g", { transform: "rotate(-18 160 72)" });
      g.appendChild(s("rect", { x: 95, y: 40, width: 130, height: 64, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 2 }));
      teile.push([erscheine(g, 0, ruhig, 0.3), 0]); zt = 0.4;
      const w = (-18 * Math.PI) / 180, dreh = (x, y) => [160 + (x - 160) * Math.cos(w) - (y - 72) * Math.sin(w), 72 + (x - 160) * Math.sin(w) + (y - 72) * Math.cos(w)];
      neu(linie(...dreh(95, 40), ...dreh(225, 104), "var(--deko-6)", 2, { style: "stroke:var(--deko-6)" }), 0.4);
      neu(linie(...dreh(225, 40), ...dreh(95, 104), "var(--deko-3)", 2, { style: "stroke:var(--deko-3)" }), 0.4);
      neu(punkt(160, 72, "#e5484d"), 0.1, false);
    } else if (art === "quadrat-diagonalen") {
      const x = 110, y = 22, a = 100;
      neu(s("rect", { x, y, width: a, height: a, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 2 }), 0.5);
      neu(linie(x, y, x + a, y + a, "var(--deko-6)", 2, { style: "stroke:var(--deko-6)" }), 0.4);
      neu(linie(x + a, y, x, y + a, "var(--deko-3)", 2, { style: "stroke:var(--deko-3)" }), 0.4);
      const m = [x + a / 2, y + a / 2];
      neu(rechterWinkel(...m, 0.707, -0.707, 0.707, 0.707), 0.15, false);
      // halbiert und gleich lang: alle vier Hälften mit demselben Strich
      for (const [ex, ey] of [[x, y], [x + a, y], [x + a, y + a], [x, y + a]]) neu(strich(ex, ey, ...m, 1), 0.1, false);
    } else {
      rechteck(30, 28, 140, 84, true, true);
      neu(linie(30, 28, 170, 112, "var(--deko-6)", 2, { style: "stroke:var(--deko-6)" }), 0.3); neu(linie(170, 28, 30, 112, "var(--deko-6)", 2, { style: "stroke:var(--deko-6)" }), 0.3);
      kreis(244, 70, 40, 4);
    }
    // die Zeit auf die Dauer der Animation strecken
    const f = zt > DAUER * 0.9 ? (DAUER * 0.9) / zt : 1;
    for (const [e] of teile) {
      if (!ruhig && f !== 1) for (const a of e.querySelectorAll ? e.querySelectorAll("animate,set") : []) { const b = parseFloat(a.getAttribute("begin")); if (Number.isFinite(b)) a.setAttribute("begin", `${(START + (b - START) * f).toFixed(2)}s`); }
      svg.appendChild(e);
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Merk-Blick (SAMMELN · merken) -----
  // Formen der Stufen 5 und 6 wie im Spiel (keine sieht nach einer Vierteldrehung gleich aus)
  const MERK_FORMEN = {
    dreieck: "M0,-36 L34,30 L-34,30 Z", pfeil: "M-32,-11 L4,-11 L4,-30 L34,0 L4,30 L4,11 L-32,11 Z",
    herz: "M0,32 C-42,6 -38,-32 -16,-32 C-6,-32 0,-24 0,-16 C0,-24 6,-32 16,-32 C38,-32 42,6 0,32 Z", halbkreis: "M-36,14 A36,36 0 0 1 36,14 Z",
    tropfen: "M0,-38 C14,-14 28,2 28,14 A28,28 0 0 1 -28,14 C-28,2 -14,-14 0,-38 Z", haus: "M-28,32 L-28,-4 L0,-34 L28,-4 L28,32 Z",
    stueck: "M-30,30 L-30,-30 A60,60 0 0 1 30,30 Z",
  };
  /**
   * Die Dinge der Stufe liegen da (Bildzeichen oder Formen in Farben wie im Spiel), dann geschieht, was das Spiel fragt:
   * fehlt (eines verschwindet und kommt leuchtend zurück), neu (eines kommt dazu), tausch (zwei tauschen den Platz), dreh
   * oder farbe (eine Form dreht sich oder färbt sich um); aenderungen: mehrere davon (Königsstufe).
   */
  function merken(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.dinge) || z.dinge.length < 2 || z.dinge.length > 12) return null;
    const formen = z.dinge.every(d => Array.isArray(d) && MERK_FORMEN[d[0]]);
    const aenderungen = z.aenderungen || [z];
    if (!aenderungen.every(a => ["fehlt", "neu", "tausch", "dreh", "farbe"].includes(a.art) && Number.isInteger(a.i) && a.i >= 0 && a.i < z.dinge.length)) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "merken", "data-anzahl": z.dinge.length });
    svg.appendChild(tagGrund());
    const n = z.dinge.length, spalten = n <= 4 ? n : n <= 6 ? 3 : n <= 9 ? (n === 7 ? 4 : 3) : 4, zeilen = Math.ceil(n / spalten);
    const zb = Math.min(64, 260 / spalten), zh = Math.min(56, 124 / zeilen), x0 = BREITE / 2 - (spalten * zb) / 2, y0 = 12 + (124 - zeilen * zh) / 2;
    const platz = i => [x0 + ((i % spalten) + 0.5) * zb, y0 + (Math.floor(i / spalten) + 0.5) * zh], gross = Math.min(30, zh * 0.62);
    const ding = (d, farbe) => (formen ? s("path", { d: MERK_FORMEN[d[0]], transform: `scale(${(gross / 70).toFixed(3)})`, style: `fill:var(--${farbe || d[1]})`, stroke: "#2d3047", "stroke-width": 2.5 }) : bildzeichen(0, 0, d, gross));
    const T0 = 0.5, T1 = DAUER * 0.55; // anschauen, dann ändert sich etwas
    const plaetze = z.dinge.map((_, i) => platz(i));
    z.dinge.forEach((d, i) => {
      const a = aenderungen.find(x => x.i === i);
      const g = s("g", { transform: `translate(${plaetze[i][0]} ${plaetze[i][1]})` });
      const innen = s("g", { "data-stueck": "ding" }, ding(d));
      g.appendChild(innen);
      if (a?.art === "fehlt") { g.appendChild(s("circle", { r: gross * 0.75, fill: "none", stroke: "#f5b301", "stroke-width": 2.4, opacity: 0 }));
        if (!ruhig) { innen.appendChild(s("animate", { attributeName: "opacity", values: "1;0;0;1", keyTimes: "0;0.15;0.7;1", begin: t(T0), dur: `${T1}s`, fill: "freeze" }));
          g.lastChild.appendChild(s("animate", { attributeName: "opacity", from: 0, to: 1, begin: t(T0 + T1), dur: "0.3s", fill: "freeze" })); } else g.lastChild.setAttribute("opacity", 1); }
      if (a?.art === "dreh" && formen) {
        const dreh = s("g", {}, ...innen.childNodes);
        innen.appendChild(dreh);
        if (ruhig) dreh.setAttribute("transform", "rotate(90)");
        else dreh.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: "0", to: "90", begin: t(T1), dur: "0.5s", fill: "freeze" }));
      }
      // umfärben: die Form in der neuen Farbe blendet darüber ein (style lässt sich mit SMIL nicht bewegen)
      if (a?.art === "farbe" && formen) innen.appendChild(erscheine(ding(d, a.zu), T1 + 0.2, ruhig, 0.4));
      if (a?.art === "neu") erscheine(g, T1, ruhig, 0.4);
      if (a?.art === "tausch") {
        const j = a.mit, [x1, y1] = plaetze[i], [x2, y2] = plaetze[j];
        if (!Number.isInteger(j) || j === i || j >= n) return;
        schiebe(innen, x2 - x1, y2 - y1, T1, ruhig, { dauer: 0.6, bogen: 14 });
      } else if (aenderungen.some(x => x.art === "tausch" && x.mit === i)) {
        const x = aenderungen.find(q => q.art === "tausch" && q.mit === i), [x1, y1] = plaetze[i], [x2, y2] = plaetze[x.i];
        schiebe(innen, x2 - x1, y2 - y1, T1, ruhig, { dauer: 0.6, bogen: -14 });
      }
      // Ring um das Veränderte, beim Tausch um beide Plätze
      if ((a && a.art !== "fehlt") || aenderungen.some(x => x.art === "tausch" && x.mit === i))
        g.appendChild(erscheine(s("circle", { r: gross * 0.78, fill: "none", stroke: "#f5b301", "stroke-width": 2.4 }), T1 + 0.7, ruhig));
      svg.appendChild(g);
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 16, 16, ruhig));
    if (sterne >= 3) svg.appendChild(funken(24, 22, ruhig));
    return svg;
  }

  // ----- Würfel-Zähler (BAUEN · zaehler) -----
  /**
   * Gebäude der Stufe nebeneinander, darunter ihre Würfelzahl und das Zeichen (<, >, =); dazu: Würfel, die zum
   * zweiten Gebäude kommen (gleich viele bauen); kiste: Quader l × b × h, die fehlenden Würfel kommen orange dazu.
   */
  function zaehler(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "zaehler" });
    svg.appendChild(tagGrund());
    const zeichen = (a, b) => (a < b ? "<" : a > b ? ">" : "=");
    if (z.kiste) {
      const [l, b, h] = z.kiste, da = z.da;
      if (![l, b, h].every(v => Number.isInteger(v) && v >= 1 && v <= 4) || !Number.isInteger(da) || da < 1 || da >= l * b * h) return null;
      // die vorhandenen Würfel füllen die Kiste von unten, Schicht um Schicht; die fehlenden kommen dazu
      const alle = [];
      for (let zz = 0; zz < h; zz++) for (let r = b - 1; r >= 0; r--) for (let c = 0; c < l; c++) alle.push([c, r, zz]);
      const w = alle.map((p, i) => [...p, i < da ? BLAU : ORANGE, i < da ? 0.1 + i * 0.04 : DAUER * 0.5 + (i - da) * 0.06]);
      const { g } = gebaeude(w, [70, 10, 180, 110], { ruhig, aMax: 22 });
      svg.appendChild(g);
      svg.setAttribute("data-anzahl", l * b * h);
      svg.appendChild(erscheine(zeileUnten(`${l * b * h} − ${da} = ${l * b * h - da}`, 142), DAUER * 0.85, ruhig));
    } else {
      const plaene = z.plaene;
      if (!Array.isArray(plaene) || plaene.length < 2 || plaene.length > 3 || !plaene.every(planGueltig)) return null;
      const n = plaene.length, breite = 280 / n, zahlen = plaene.map(p => wuerfelAusPlan(p).length);
      if (z.dazu !== undefined && !(Number.isInteger(z.dazu) && zahlen[1] + z.dazu === zahlen[0])) return null;
      // zuerst alle Würfel je Gebäude, beim zweiten die dazukommenden oben auf den niedrigsten Stellen
      const gebaeudeW = plaene.map((p, k) => {
        const w = wuerfelAusPlan(p);
        if (!(z.dazu && k === 1)) return w;
        const hoehe = p.map(r => r.slice());
        for (let i = 0; i < z.dazu; i++) {
          let best = null;
          hoehe.forEach((r, ri) => r.forEach((v, c) => { if (!best || v < hoehe[best[0]][best[1]]) best = [ri, c]; }));
          w.push([best[1], p.length - 1 - best[0], hoehe[best[0]][best[1]]++, ORANGE, DAUER * 0.55 + i * 0.15]);
        }
        return w;
      });
      // alle Gebäude im selben Massstab (sonst sähe ein Turm aus 5 Würfeln so hoch aus wie einer aus 3)
      const kante = Math.min(...gebaeudeW.map(w => gebaeudeKante(w, [0, 0, breite - 20, 104])));
      plaene.forEach((p, k) => {
        const w = gebaeudeW[k];
        const { g } = gebaeude(w, [20 + k * breite, 10, breite - 20, 104], { ruhig, a: kante, je: (DAUER * 0.45) / w.length, ab: k * 0.15 });
        svg.appendChild(g);
        svg.appendChild(erscheine(text(20 + k * breite + (breite - 20) / 2, 140, k === 1 && z.dazu ? `${zahlen[1]} + ${z.dazu}` : zahlen[k], { gross: 14 }), DAUER * 0.8, ruhig));
      });
      const gesamt = zahlen.map((v, k) => (k === 1 && z.dazu ? v + z.dazu : v));
      for (let k = 0; k < n - 1; k++) svg.appendChild(erscheine(text(20 + (k + 1) * breite - 10, 140, zeichen(gesamt[k], gesamt[k + 1]), { gross: 16, farbe: "#e5484d" }), DAUER * 0.85, ruhig));
      svg.setAttribute("data-anzahl", gesamt.reduce((a, b) => a + b, 0));
      svg.setAttribute("data-wert", gesamt.join(","));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Quader-Volumen (BAUEN · quader) -----
  /**
   * Quader aus Würfeln Schicht um Schicht (masse [l, b, h], bis 6 × 5 × 4; fehlen: so viele Würfel sind schon da, die
   * übrigen kommen orange dazu); gross: ein Quader mit Massen und Einheit, Wasser steigt (liter) — darunter die Rechnung
   * mit Einheiten, nachgerechnet über die Einheiten der Grössen-Spiele.
   */
  function quader(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "quader" });
    svg.appendChild(tagGrund());
    if (z.masse) {
      const [l, b, h] = z.masse;
      if (![l, b, h].every(v => Number.isInteger(v) && v >= 1) || l > 6 || b > 5 || h > 4) return null;
      const V = l * b * h, da = z.da ?? V;
      if (!(Number.isInteger(da) && da >= 1 && da <= V)) return null;
      const alle = [];
      for (let zz = 0; zz < h; zz++) for (let r = b - 1; r >= 0; r--) for (let c = 0; c < l; c++) alle.push([c, r, zz]);
      const je = (DAUER * 0.7) / V;
      const { g } = gebaeude(alle.map((p, i) => [...p, i < da ? BLAU : ORANGE, i < da ? i * je * (da < V ? 0.5 : 1) : DAUER * 0.5 + (i - da) * 0.08]), [40, 8, 240, 112], { ruhig, aMax: 22 });
      svg.appendChild(g);
      svg.setAttribute("data-anzahl", V);
      const e = z.einheit ? ` ${z.einheit}` : "";
      svg.appendChild(erscheine(zeileUnten(`${l}${e} · ${b}${e} · ${h}${e} = ${V}${z.einheit ? ` ${z.einheit}³` : ""}`, 142), DAUER * 0.85, ruhig));
    } else if (z.gross) {
      // [[wert, einheit] × 3], ergebnis in einheit³, dazu Liter
      const [kl, kb, kh] = z.gross;
      if (![kl, kb, kh].every(k => Array.isArray(k) && Number.isFinite(k[0]) && familie(k[1]) === "laenge") || familie(z.in) !== "laenge") return null;
      const inE = ([w, e]) => rund(basis(w, e) / EINHEITEN.laenge[z.in]), V = rund(inE(kl) * inE(kb) * inE(kh));
      const ml = rund((basis(kl[0], kl[1]) * basis(kb[0], kb[1]) * basis(kh[0], kh[1])) / 1e3); // mm³ → cm³ (= ml)
      const liter = rund(ml / 1000);
      // Quader im Schrägbild, Seitenverhältnis nach den Massen
      // so hoch, dass oben die Rechnung frei bleibt (Oberkante bei y 36)
      const L = inE(kl), Bt = inE(kb), Ht = inE(kh), f = Math.min(150 / (L + Bt * 0.5), 82 / (Ht + Bt * 0.5)), w = L * f, hh = Ht * f, t = Bt * f * 0.5;
      const x0 = 160 - (w + t) / 2, y0 = 118, st = { stroke: "#2d3047", "stroke-width": 1.4, "stroke-linejoin": "round" };
      const kanten = s("g", { "data-quader": `${L}x${Bt}x${Ht}` },
        s("rect", { x: x0, y: y0 - hh, width: w, height: hh, fill: "#e8f4fb", "fill-opacity": 0.6, ...st }),
        s("path", { d: `M${x0},${y0 - hh} l${t},${-t} h${w} l${-t},${t} Z`, fill: "#e8f4fb", "fill-opacity": 0.5, ...st }),
        s("path", { d: `M${x0 + w},${y0 - hh} l${t},${-t} v${hh} l${-t},${t} Z`, fill: "#d6ecf8", "fill-opacity": 0.6, ...st }));
      svg.appendChild(kanten);
      if (z.wasser) {
        // Wasser steigt in fünf Schichten
        const schicht = hh / 5;
        for (let i = 0; i < 5; i++) {
          const y = y0 - (i + 1) * schicht;
          svg.appendChild(erscheine(s("g", { "data-stueck": "wasser" }, s("rect", { x: x0, y, width: w, height: schicht, fill: "#5aa9dc", "fill-opacity": 0.55 }),
            s("path", { d: `M${x0 + w},${y} l${t},${-t} v${schicht} l${-t},${t} Z`, fill: "#3f8fc4", "fill-opacity": 0.5 }),
            ...(i === 4 ? [s("path", { d: `M${x0},${y} l${t},${-t} h${w} l${-t},${t} Z`, fill: "#8cc6ea", "fill-opacity": 0.6 })] : [])), 0.3 + i * 0.35, ruhig, 0.3));
        }
        svg.setAttribute("data-anzahl", 5);
      } else if (z.gitter) {
        // 10 × 10 × 10: auf jeder Seite das Raster der cm³
        let d = "";
        for (let i = 1; i < 10; i++) d += `M${x0 + (i * w) / 10},${y0} v${-hh} l${t},${-t} M${x0},${y0 - (i * hh) / 10} h${w} l${t},${-t} M${x0 + (i * t) / 10},${y0 - hh - (i * t) / 10} h${w} v${hh} `;
        svg.appendChild(erscheine(s("path", { d, stroke: "#5b8fd6", "stroke-width": 0.5, fill: "none" }), 0.4, ruhig, 0.6));
      }
      // Masse an den Kanten
      svg.append(erscheine(text(x0 + w / 2, y0 + 12, groesse(kl[0], kl[1]), { gross: 10 }), 0.6, ruhig), erscheine(text(x0 - 4, y0 - hh / 2 + 4, groesse(kh[0], kh[1]), { gross: 10, anker: "end" }), 0.8, ruhig),
        erscheine(text(x0 + w + t / 2 + 4, y0 - t / 2 + 4, groesse(kb[0], kb[1]), { gross: 10, anker: "start" }), 1.0, ruhig));
      const zeile = z.zeile === "gleich" ? `${groesse(V, `${z.in}³`)} = ${ganzText(ml)} cm³ = ${groesse(liter, "l")}` : `${groesse(V, `${z.in}³`)}${z.wasser || z.liter ? ` = ${groesse(liter, "l")}` : ""}`;
      svg.setAttribute("data-wert", V);
      svg.appendChild(erscheine(zeileUnten(zeile, 22), DAUER * 0.8, ruhig));
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 40, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 44, ruhig));
    return svg;
  }

  Object.assign(BILDER.bauen, { spiegelraster, formen, pixel, pentomino, wuerfelbau, netz, rechtecke, geo, zaehler, quader });
  Object.assign(BILDER.reise, { koordinaten, kipper });
  Object.assign(BILDER.sammeln, { merken });

  // ---------- Bilder Block A: Mathe M6 (Daten, Kombinatorik, Brüche) und Deutsch Teil 1 (LERN_Session29) ----------
  // Wie die Blöcke davor: jedes Bild folgt den Stufen seines Spiels und prüft, was es zeigt. In Deutsch ohne Lesetext
  // (wie der Wortfamilien-Baum): Wörter als leere Kärtchen, Silben als Bögen; Buchstaben nur, wo sie selbst der Inhalt
  // sind (ABC, Gross und klein).

  const ggT = (a, b) => (b ? ggT(b, a % b) : Math.abs(a));
  const kgV = (a, b) => (a / ggT(a, b)) * b;
  const bruchOk = b => Array.isArray(b) && b.length === 2 && Number.isInteger(b[0]) && Number.isInteger(b[1]) && b[0] >= 0 && b[1] >= 1;
  /** Bruch übereinander: Zähler, Strich, Nenner; Mitte bei x, Bruchstrich auf y. */
  function bruchBild(x, y, [z, n], gross = 13, farbe = "#2d3047") {
    const b = Math.max(String(z).length, String(n).length) * gross * 0.62 + 4;
    return s("g", { "data-bruch": `${z}/${n}` }, text(x, y - 3, z, { gross, farbe }), s("line", { x1: x - b / 2, y1: y, x2: x + b / 2, y2: y, stroke: farbe, "stroke-width": 1.4 }),
      text(x, y + gross * 0.95, n, { gross, farbe }));
  }
  /** Zeile aus Zahlen, Zeichen und Brüchen ([z, n]), mittig um cx; Bruchstriche auf y. */
  function zeileMitBruechen(teile, y, { cx = BREITE / 2, gross = 13 } = {}) {
    const breite = t => (Array.isArray(t) ? Math.max(String(t[0]).length, String(t[1]).length) * gross * 0.62 + 6 : String(t).length * gross * 0.6 + 6);
    const ges = teile.reduce((a, t) => a + breite(t), 0);
    let x = cx - ges / 2;
    const g = s("g", { "data-zeile": "unten" });
    for (const t of teile) { const b = breite(t); g.appendChild(Array.isArray(t) ? bruchBild(x + b / 2, y, t, gross) : text(x + b / 2, y + gross * 0.35, t, { gross })); x += b; }
    return g;
  }
  const vergleichsZeichen = (a, b) => (Math.abs(a - b) < 1e-9 ? "=" : a < b ? "<" : ">");

  // ----- Bruch-Pizzeria (BAUEN · pizza) -----
  /** Pizza in n gleiche Stücke, z Stücke belegt, Stück um Stück. */
  function pizzaBild(cx, cy, r, [z, n], ab, je, ruhig) {
    const g = s("g", { "data-stueck": "pizza", "data-wert": `${z}/${n}` }, s("circle", { cx, cy, r, fill: "#f6dfa0", stroke: "#c48a3a", "stroke-width": 3 }));
    const p = w => [cx + r * Math.sin(w), cy - r * Math.cos(w)];
    for (let i = 0; i < z; i++) {
      const w1 = (i * 2 * Math.PI) / n, w2 = ((i + 1) * 2 * Math.PI) / n, [x1, y1] = p(w1), [x2, y2] = p(w2);
      const stueck = n === 1 ? s("circle", { cx, cy, r: r - 1.5, fill: "#e5484d" }) : s("path", { d: `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${w2 - w1 > Math.PI ? 1 : 0},1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`, fill: "#e5484d", stroke: "#c48a3a", "stroke-width": 1 });
      g.appendChild(erscheine(stueck, ab + i * je, ruhig, 0.15));
    }
    if (n > 1) for (let i = 0; i < n; i++) { const [x, y] = p((i * 2 * Math.PI) / n); g.appendChild(s("line", { x1: cx, y1: cy, x2: x, y2: y, stroke: "#c48a3a", "stroke-width": 1.4 })); }
    return g;
  }
  /** Pizzen der Stufe nebeneinander, darunter der Bruch, dazwischen das Zeichen (nachgerechnet): ablesen, vergleichen, ordnen, gleich grosse. */
  function pizza(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.brueche) || !z.brueche.length || z.brueche.length > 4 || !z.brueche.every(b => bruchOk(b) && b[0] <= b[1] && b[1] <= 12)) return null;
    const werte = z.brueche.map(([a, b]) => a / b), n = werte.length;
    if (n > 1 && !werte.slice(1).every((w, i) => (z.gleich ? Math.abs(w - werte[i]) < 1e-9 : w > werte[i]))) return null; // geordnet oder gleich gross
    const svg = neuesBild("bauen", stufe, { "data-bilder": "pizza", "data-anzahl": n });
    svg.appendChild(tagGrund());
    const abst = 280 / n, r = Math.min(40, abst * 0.36), T = DAUER * 0.75, je = T / z.brueche.reduce((a, b) => a + b[0], 0);
    let k = 0;
    z.brueche.forEach((b, i) => {
      const cx = 20 + abst * (i + 0.5);
      svg.appendChild(pizzaBild(cx, 60, r, b, k * je, je, ruhig)); k += b[0];
      svg.appendChild(erscheine(bruchBild(cx, 124, b, 13), T, ruhig));
      if (i) svg.appendChild(erscheine(text(20 + abst * i, 128, vergleichsZeichen(werte[i - 1], werte[i]), { gross: 16, farbe: "#e5484d" }), T + 0.1, ruhig));
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Schoggi-Brüche (BAUEN · schoggi) -----
  /**
   * Schoggitafel mit dem gemeinsamen Nenner als Stücke: der erste Bruch dunkel, der zweite hell dazu (plus) oder wieder
   * weg (minus); über 1 eine zweite Tafel. Darunter die Rechnung mit dem gemeinsamen Nenner und dem gekürzten Ergebnis.
   */
  function schoggi(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !bruchOk(z.a) || !bruchOk(z.b) || !["+", "−"].includes(z.op)) return null;
    const L = kgV(z.a[1], z.b[1]), za = (z.a[0] * L) / z.a[1], zb = (z.b[0] * L) / z.b[1], ze = z.op === "+" ? za + zb : za - zb;
    if (L > 100 || ze < 0 || ze > 2 * L) return null;
    const tafeln = Math.max(1, Math.ceil(Math.max(za, ze) / L));
    // Raster der Tafel: r Reihen × c Spalten mit r · c = L, möglichst quadratisch
    let r = 1;
    for (let i = 1; i * i <= L; i++) if (L % i === 0) r = i;
    const c = L / r, tb = Math.min(tafeln === 1 ? 220 : 130, 110 * (c / r)), zel = Math.min(tb / c, 80 / r);
    const svg = neuesBild("bauen", stufe, { "data-bilder": "schoggi", "data-wert": `${ze}/${L}` });
    svg.appendChild(tagGrund());
    const T = DAUER * 0.7, x0 = (BREITE - tafeln * c * zel - (tafeln - 1) * 14) / 2, y0 = 14;
    const pos = i => { const t0 = Math.floor(i / L), j = i % L; return [x0 + t0 * (c * zel + 14) + (j % c) * zel, y0 + Math.floor(j / c) * zel]; };
    for (let t0 = 0; t0 < tafeln; t0++) svg.appendChild(s("rect", { x: x0 + t0 * (c * zel + 14) - 3, y: y0 - 3, width: c * zel + 6, height: r * zel + 6, rx: 3, fill: "#c9ccd3" }));
    const je = T / Math.max(1, za + zb);
    for (let i = 0; i < tafeln * L; i++) {
      const [x, y] = pos(i), dunkel = i < za, hell = z.op === "+" && i >= za && i < za + zb, weg = z.op === "−" && i >= ze && i < za;
      const st = s("rect", { x: x + 0.8, y: y + 0.8, width: zel - 1.6, height: zel - 1.6, rx: 1.5, fill: "#e4e6ec", stroke: "#b8bcc8", "stroke-width": 0.6 });
      svg.appendChild(st);
      if (dunkel || hell) {
        const stueck = s("rect", { x: x + 0.8, y: y + 0.8, width: zel - 1.6, height: zel - 1.6, rx: 1.5, fill: dunkel ? "#6b3e22" : "#b8743f", stroke: "#4a2a16", "stroke-width": 0.6, "data-stueck": "stueck" });
        const e = erscheine(stueck, (dunkel ? i : i) * je, ruhig, 0.12);
        svg.appendChild(weg ? verschwinde(e, T * 0.6 + (i - ze) * 0.05, ruhig, 0.25) : e);
      }
    }
    const gek = [ze / ggT(ze, L), L / ggT(ze, L)], teile = [z.a, z.op, z.b, "="];
    if (z.a[1] !== z.b[1]) teile.push([za, L], z.op, [zb, L], "=");
    teile.push([ze, L]);
    if (gek[1] !== L) teile.push("=", gek);
    // über einem Ganzen als gemischte Zahl, wie das Spiel in Stufe 5 übt: 5/4 = 1 1/4
    if (ze > L && ze % L) { const r0 = ze % L, g0 = ggT(r0, L); teile.push("=", String(Math.floor(ze / L)), [r0 / g0, L / g0]); }
    svg.setAttribute("data-anzahl", z.op === "+" ? za + zb : za); // beim Minus zählen auch die weggegessenen Stücke
    svg.appendChild(erscheine(zeileMitBruechen(teile, 124, { gross: 12 }), DAUER * 0.8, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Prozent-Brücke (BAUEN · prozent) -----
  /**
   * Streifen oder Hunderterfeld füllt sich, darunter die Brücke zwischen Bruch, Dezimalzahl und Prozent (nachgerechnet);
   * von: p % von einem Betrag (in Rappen) — der Streifen in Teilen des Betrags; teil: k von n als Prozent.
   */
  function prozent(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "prozent" });
    svg.appendChild(tagGrund());
    const T = DAUER * 0.6, L = 30, R = 290;
    const streifen = (n, k, y, h = 22) => {
      const w = (R - L) / n, g = s("g", {});
      for (let i = 0; i < n; i++) {
        g.appendChild(s("rect", { x: L + i * w, y, width: w, height: h, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 1 }));
        if (i < k) g.appendChild(erscheine(s("rect", { x: L + i * w + 0.8, y: y + 0.8, width: w - 1.6, height: h - 1.6, style: "fill:var(--deko-6)", "data-stueck": "teil" }), (i / Math.max(k, 1)) * T, ruhig, 0.1));
      }
      return g;
    };
    let zeile, wert;
    if (z.bruch) {
      if (!bruchOk(z.bruch) || z.bruch[0] > z.bruch[1]) return null;
      const [k, n] = z.bruch, p = rund((k / n) * 100);
      if (z.feld === "hundert") {
        if (n !== 100) return null;
        const c = 8, x0 = BREITE / 2 - 40, y0 = 8, g = s("g", {});
        for (let i = 0; i < 100; i++) g.append(s("rect", { x: x0 + (i % 10) * c, y: y0 + Math.floor(i / 10) * c, width: c, height: c, fill: "#ffffff", stroke: "#b8bcc8", "stroke-width": 0.5 }),
          ...(i < k ? [erscheine(s("rect", { x: x0 + (i % 10) * c + 0.5, y: y0 + Math.floor(i / 10) * c + 0.5, width: c - 1, height: c - 1, style: "fill:var(--deko-6)", "data-stueck": "teil" }), (i / k) * T, ruhig, 0.05)] : []));
        svg.appendChild(g);
      } else svg.appendChild(streifen(n, k, 34));
      const teile = z.folge || ["bruch", "dezimal", "prozent"];
      const stueck = { bruch: [k, n], dezimal: zahlText(rund(k / n), nachkomma(rund(k / n))), prozent: `${ganzText(p)} %` };
      if (!Number.isInteger(p * 100) && teile.includes("prozent")) return null;
      zeile = teile.flatMap((t0, i) => (i ? ["=", stueck[t0]] : [stueck[t0]]));
      wert = p;
    } else if (z.von) {
      const [p, rp] = z.von, teil = rund((p / 100) * rp);
      if (!(p > 0 && p <= 100 && Number.isInteger(teil) && 100 % p === 0)) return null;
      const n = 100 / p;
      svg.appendChild(streifen(n, 1, 34));
      for (let i = 0; i < n; i++) svg.appendChild(text(L + ((i + 0.5) * (R - L)) / n, 72, geld(teil), { gross: 10, farbe: "#4f5668" }));
      zeile = [`${p} % von ${geld(rp)} = ${geld(teil)}`];
      wert = teil;
    } else if (z.teil) {
      const [k, n] = z.teil, p = rund((k / n) * 100);
      if (!(k <= n && n <= 40 && Number.isInteger(p))) return null;
      svg.appendChild(streifen(Math.min(n, 20), Math.min(k, 20), 20, 18));
      if (n > 20) svg.appendChild(streifen(n - 20, Math.max(0, k - 20), 44, 18));
      zeile = [`${k} von ${n} = ${p} %`];
      wert = p;
    } else return null;
    svg.setAttribute("data-wert", wert);
    // Brücke: flacher Bogen unter der Zeile (die Brüche bleiben frei)
    svg.append(erscheine(s("path", { d: "M40,142 Q160,122 280,142", fill: "none", stroke: "#a8743f", "stroke-width": 3 }), T, ruhig),
      erscheine(zeileMitBruechen(zeile, 104, { gross: 14 }), DAUER * 0.8, ruhig));
    if (sterne >= 2) svg.appendChild(fahne(40, 142, ruhig));
    if (sterne >= 3) { svg.appendChild(fahne(280, 142, ruhig, "3")); svg.appendChild(funken(BREITE - 24, 22, ruhig)); }
    return svg;
  }

  // ----- Mittelwert-Türme (BAUEN · mittelwert) -----
  /**
   * Türme (bis 20 als Klötze, darüber als Säulen): spanne (am meisten, am wenigsten, Unterschied), ausgleich (Klötze
   * wandern vom höchsten zu den niedrigen, bis alle gleich sind), mittel (die Linie des Mittelwerts, die Rechnung);
   * fehlt: ein Turm wächst, bis der Mittelwert stimmt. Alles nachgerechnet.
   */
  function mittelwert(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.werte) || z.werte.length < 2 || z.werte.length > 6 || !z.werte.every(v => Number.isInteger(v) && v >= 0)) return null;
    const n = z.werte.length, summe = z.werte.reduce((a, b) => a + b, 0), m = summe / n;
    if (z.art !== "spanne" && !Number.isInteger(m)) return null;
    if (z.fehlt !== undefined && z.mittel !== m) return null;
    const max = Math.max(...z.werte, m), kloetze = max <= 20, einheit = kloetze ? Math.min(14, 96 / max) : 96 / max;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "mittelwert", "data-wert": m });
    svg.appendChild(tagGrund());
    const abst = Math.min(46, 260 / n), x0 = BREITE / 2 - (n * abst) / 2, unten = 116, T = DAUER * 0.6;
    const turmX = i => x0 + i * abst + abst * 0.18, tb = abst * 0.64;
    svg.appendChild(s("line", { x1: x0 - 6, y1: unten, x2: x0 + n * abst + 6, y2: unten, stroke: "#6b7089", "stroke-width": 2 }));
    const hoch = (i, v, ab, farbe = `var(--deko-${(i % 6) + 1})`) => {
      if (kloetze) { const g = s("g", {}); for (let k = 0; k < v; k++) g.appendChild(erscheine(s("rect", { x: turmX(i), y: unten - (k + 1) * einheit, width: tb, height: einheit - 0.8, rx: 1, style: `fill:${farbe}`, "data-stueck": "klotz" }), ab + k * 0.03, ruhig, 0.1)); return g; }
      const r = s("rect", { x: turmX(i), y: unten - v * einheit, width: tb, height: v * einheit, style: `fill:${farbe}`, "data-stueck": "saeule" });
      return erscheine(r, ab, ruhig, 0.3);
    };
    if (z.art === "ausgleich") {
      // Klötze über dem Mittel wandern auf die Türme darunter
      const ueber = [], unter = [];
      z.werte.forEach((v, i) => { for (let k = m; k < v; k++) ueber.push([i, k]); for (let k = v; k < m; k++) unter.push([i, k]); });
      z.werte.forEach((v, i) => { const g = s("g", {}); for (let k = 0; k < Math.min(v, m); k++) g.appendChild(s("rect", { x: turmX(i), y: unten - (k + 1) * einheit, width: tb, height: einheit - 0.8, rx: 1, style: `fill:var(--deko-${(i % 6) + 1})` })); svg.appendChild(g); });
      ueber.forEach(([i, k], j) => {
        const [zi, zk] = unter[j], klotz = s("rect", { x: turmX(i), y: unten - (k + 1) * einheit, width: tb, height: einheit - 0.8, rx: 1, style: `fill:var(--deko-${(i % 6) + 1})`, "data-stueck": "klotz" });
        svg.appendChild(schiebe(s("g", {}, klotz), turmX(zi) - turmX(i), (k - zk) * einheit, 0.3 + j * (T / ueber.length), ruhig, { dauer: 0.5, bogen: 20 }));
      });
    } else z.werte.forEach((v, i) => svg.appendChild(hoch(i, v, i * (T / n), z.fehlt === i ? "var(--deko-3)" : undefined)));
    // Beschriftung unter den Türmen
    // beim fehlenden Turm erst „?“, dann die Zahl, die der Mittelwert verrät
    z.werte.forEach((v, i) => svg.appendChild(z.fehlt === i ? kurz(text(turmX(i) + tb / 2, unten + 12, "?", { gross: 10 }), 0.1, T + 0.3, ruhig)
      : erscheine(text(turmX(i) + tb / 2, unten + 12, ganzText(v), { gross: 10 }), 0.1, ruhig)));
    if (z.fehlt !== undefined) svg.appendChild(erscheine(text(turmX(z.fehlt) + tb / 2, unten + 12, ganzText(z.werte[z.fehlt]), { gross: 10, farbe: "#c96d1c" }), T + 0.3, ruhig));
    let zeile;
    if (z.art === "spanne") {
      const hi = z.werte.indexOf(Math.max(...z.werte)), lo = z.werte.indexOf(Math.min(...z.werte));
      for (const i of [hi, lo]) svg.appendChild(erscheine(s("rect", { x: turmX(i) - 3, y: unten - z.werte[i] * einheit - 3, width: tb + 6, height: z.werte[i] * einheit + 3, rx: 3, fill: "none", stroke: "#f5b301", "stroke-width": 2 }), T, ruhig));
      zeile = `${ganzText(z.werte[hi])} − ${ganzText(z.werte[lo])} = ${ganzText(z.werte[hi] - z.werte[lo])}`;
    } else {
      const ym = unten - m * einheit;
      svg.appendChild(erscheine(s("line", { x1: x0 - 8, y1: ym, x2: x0 + n * abst + 8, y2: ym, stroke: "#e5484d", "stroke-width": 1.8, "stroke-dasharray": "5 3" }), T + 0.2, ruhig));
      // ausgleichen: zusammen gleich viel wie n gleich hohe Türme
      zeile = z.art === "ausgleich" ? `${z.werte.map(ganzText).join(" + ")} = ${ganzText(summe)} = ${n} · ${ganzText(m)}`
        : `(${z.werte.map(ganzText).join(" + ")}) : ${n} = ${ganzText(m)}`;
    }
    svg.appendChild(erscheine(zeileUnten(zeile, 143), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Daten-Detektiv, Diagramm-Wahl (WACHSEN · diagramm) -----
  /** Strichliste: je Wert Fünferbündel (vier Striche, der fünfte quer), Strich um Strich. */
  function strichliste(werte, { x0 = 70, y0 = 22, zh = 30, ab = 0, je = 0.04, ruhig }) {
    const g = s("g", {});
    werte.forEach((v, i) => {
      const y = y0 + i * zh;
      g.appendChild(s("rect", { x: x0 - 34, y: y - 2, width: 20, height: 20, rx: 4, style: `fill:var(--deko-${(i % 6) + 1})` }));
      for (let k = 0; k < v; k++) {
        const bund = Math.floor(k / 5), im = k % 5, bx = x0 + bund * 30;
        const st = im < 4 ? s("line", { x1: bx + im * 5, y1: y, x2: bx + im * 5, y2: y + 16, stroke: "#2d3047", "stroke-width": 1.8, "data-stueck": "strich" })
          : s("line", { x1: bx - 3, y1: y + 13, x2: bx + 19, y2: y + 3, stroke: "#2d3047", "stroke-width": 1.8, "data-stueck": "strich" });
        g.appendChild(erscheine(st, ab + k * je, ruhig, 0.08));
      }
    });
    return g;
  }
  /**
   * Diagramme der Stufen: strich (Strichliste), saeulen (Säulen mit Achse in Schritten, fehlt: eine Säule wächst
   * gestrichelt nach, differenz: der Unterschied zweier Säulen, mittel: Linie des Durchschnitts, gruppen: zwei Säulen
   * je Kategorie), kreis (Kreisdiagramm in Teilen, prozent: mit Prozent), linie (Liniendiagramm). Werte nachgerechnet.
   */
  function diagramm(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const svg = neuesBild("wachsen", stufe, { "data-bilder": "diagramm" });
    svg.appendChild(tagGrund());
    const T = DAUER * 0.7;
    let zeile = null, hoechste = null; // Spitze der höchsten Säule (3 Sterne: Fähnchen darauf)
    if (z.art === "strich") {
      if (!Array.isArray(z.werte) || !z.werte.every(v => Number.isInteger(v) && v >= 0 && v <= 15) || z.werte.length > 4) return null;
      svg.appendChild(strichliste(z.werte, { y0: 18, zh: Math.min(30, 110 / z.werte.length), je: T / z.werte.reduce((a, b) => a + b, 0), ruhig }));
      z.werte.forEach((v, i) => svg.appendChild(erscheine(text(270, 18 + i * Math.min(30, 110 / z.werte.length) + 14, v, { gross: 14 }), T, ruhig)));
      svg.setAttribute("data-anzahl", z.werte.reduce((a, b) => a + b, 0));
    } else if (z.art === "saeulen") {
      const reihen = z.gruppen ? z.werte : z.werte.map(v => [v]);
      if (!Array.isArray(reihen) || !reihen.length || reihen.length > 6 || !reihen.every(r => r.every(v => Number.isFinite(v) && v >= 0))) return null;
      const alle = reihen.flat(), max = Math.max(...alle, z.mittel || 0), schritt = z.schritt || 1, oben = Math.ceil(max / schritt) * schritt;
      if (oben / schritt > 12) return null;
      // oben Platz für das Fähnchen auf der höchsten Säule
      const L = 40, R = 290, U = 118, O = 26, py = v => U - ((U - O) * v) / oben, n = reihen.length, kw = (R - L) / n;
      let d = "";
      for (let v = 0; v <= oben; v += schritt) d += `M${L},${py(v).toFixed(1)} h${R - L} `;
      svg.append(s("path", { d, stroke: "#c9cde0", "stroke-width": 0.8 }), s("path", { d: `M${L},${O - 4} V${U} H${R + 4}`, stroke: "#2d3047", "stroke-width": 1.6, fill: "none" }));
      for (let v = 0; v <= oben; v += schritt * (oben / schritt > 6 ? 2 : 1)) svg.appendChild(text(L - 5, py(v) + 3.5, ganzText(v), { gross: 9, anker: "end", fett: false }));
      reihen.forEach((r, i) => r.forEach((v, j) => {
        const sb = (kw * 0.7) / r.length, x = L + i * kw + kw * 0.15 + j * sb, fehlt = z.fehlt === i;
        if (!hoechste || v > hoechste[2]) hoechste = [x + sb / 2, py(v), v];
        const saeule = s("rect", { x: x + 1, y: py(v), width: sb - 2, height: U - py(v), style: `fill:var(--deko-${(z.gruppen ? j * 2 + 3 : i) % 6 + 1})`, "data-stueck": "saeule",
          ...(fehlt ? { "fill-opacity": 0.45, stroke: "#2d3047", "stroke-width": 1, "stroke-dasharray": "3 2" } : {}) });
        if (!ruhig) saeule.append(s("animate", { attributeName: "height", from: 0, to: U - py(v), begin: t((fehlt ? T : 0) + i * 0.15), dur: "0.6s", fill: "freeze" }),
          s("animate", { attributeName: "y", from: U, to: py(v), begin: t((fehlt ? T : 0) + i * 0.15), dur: "0.6s", fill: "freeze" }));
        svg.appendChild(saeule);
      }));
      if (z.differenz) {
        const [a, b] = z.differenz, va = reihen[a][0], vb = reihen[b][0], x = L + Math.max(a, b) * kw + kw * 0.9;
        svg.appendChild(erscheine(s("g", {}, s("path", { d: `M${L + a * kw + kw * 0.5},${py(va)} H${x} M${L + b * kw + kw * 0.5},${py(vb)} H${x} M${x - 3},${py(va)} V${py(vb)}`, stroke: "#e5484d", "stroke-width": 1.6, "stroke-dasharray": "3 2", fill: "none" }),
          text(x + 3, (py(va) + py(vb)) / 2 + 4, ganzText(Math.abs(va - vb)), { gross: 12, farbe: "#e5484d", anker: "start" })), T + 0.2, ruhig));
      }
      if (z.mittel !== undefined) {
        const werte = reihen.map(r => r[0]), m = werte.reduce((a, b) => a + b, 0) / werte.length;
        if (Math.abs(m - z.mittel) > 1e-9) return null;
        svg.appendChild(erscheine(s("line", { x1: L, y1: py(m), x2: R, y2: py(m), stroke: "#e5484d", "stroke-width": 1.8, "stroke-dasharray": "5 3" }), T + 0.2, ruhig));
        zeile = `(${werte.map(ganzText).join(" + ")}) : ${werte.length} = ${ganzText(m)}`;
      }
      if (z.total !== undefined) { if (alle.reduce((a, b) => a + b, 0) !== z.total) return null; zeile = `${alle.map(ganzText).join(" + ")} = ${ganzText(z.total)}`; }
      svg.setAttribute("data-anzahl", alle.length);
    } else if (z.art === "kreis") {
      if (!Array.isArray(z.teile) || !z.teile.every(bruchOk)) return null;
      const summe = z.teile.reduce((a, [k, n]) => a + k / n, 0);
      if (Math.abs(summe - 1) > 1e-9) return null;
      const cx = 110, cy = 70, r = 52;
      let w = 90;
      z.teile.forEach(([k, n], i) => {
        const dw = (360 * k) / n, farbe = `var(--deko-${(i * 2) % 6 + 1})`;
        const tort = dw >= 359.9 ? s("circle", { cx, cy, r, style: `fill:${farbe}` }) : sektor(cx, cy, r, w - dw, w, farbe);
        tort.setAttribute("data-stueck", "teil");
        svg.appendChild(erscheine(tort, (i * T) / z.teile.length, ruhig, 0.3));
        const mw = ((w - dw / 2) * Math.PI) / 180, lx = cx + r * 0.6 * Math.cos(mw), ly = cy - r * 0.6 * Math.sin(mw);
        svg.appendChild(erscheine(z.prozent ? text(lx, ly + 4, `${rund((100 * k) / n)} %`, { gross: 10, farbe: "#ffffff" }) : bruchBild(lx, ly, [k, n], 10, "#ffffff"), T, ruhig));
        w -= dw;
      });
      svg.appendChild(s("circle", { cx, cy, r, fill: "none", stroke: "#2d3047", "stroke-width": 1.6 }));
      svg.setAttribute("data-anzahl", z.teile.length);
      // Legende: Farbe und Anteil
      z.teile.forEach(([k, n], i) => svg.appendChild(erscheine(s("g", {}, s("rect", { x: 200, y: 30 + i * 26, width: 16, height: 16, rx: 3, style: `fill:var(--deko-${(i * 2) % 6 + 1})` }),
        z.prozent ? text(224, 43 + i * 26, `${rund((100 * k) / n)} %`, { gross: 12, anker: "start" }) : bruchBild(236, 38 + i * 26, [k, n], 10)), T + 0.1, ruhig)));
    } else if (z.art === "linie") {
      if (!Array.isArray(z.werte) || z.werte.length < 2 || z.werte.length > 8) return null;
      const max = Math.max(...z.werte), schritt = z.schritt || 1, oben = Math.ceil(max / schritt) * schritt, L = 40, R = 290, U = 118, O = 14;
      const px = i => L + 10 + (i * (R - L - 20)) / (z.werte.length - 1), py = v => U - ((U - O) * v) / oben;
      let d = "";
      for (let v = 0; v <= oben; v += schritt) d += `M${L},${py(v).toFixed(1)} h${R - L} `;
      svg.append(s("path", { d, stroke: "#c9cde0", "stroke-width": 0.8 }), s("path", { d: `M${L},${O - 4} V${U} H${R + 4}`, stroke: "#2d3047", "stroke-width": 1.6, fill: "none" }));
      for (let v = 0; v <= oben; v += schritt) svg.appendChild(text(L - 5, py(v) + 3.5, ganzText(v), { gross: 9, anker: "end", fett: false }));
      const linie = s("path", { d: "M" + z.werte.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" L"), fill: "none", style: "stroke:var(--deko-6)", "stroke-width": 2.6, "stroke-linejoin": "round" });
      svg.appendChild(zeichne(linie, 0.1, ruhig, T));
      z.werte.forEach((v, i) => svg.appendChild(erscheine(s("circle", { cx: px(i), cy: py(v), r: 3, fill: "#2d3047", "data-stueck": "punkt" }), 0.1 + (i * T) / (z.werte.length - 1), ruhig, 0.1)));
      svg.setAttribute("data-anzahl", z.werte.length);
    } else return null;
    if (zeile) svg.appendChild(erscheine(zeileUnten(zeile, 142), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 12, ruhig));
    // 3 Sterne: Fähnchen auf der höchsten Säule; sonst Funken, wo das Diagramm Platz lässt
    if (sterne >= 3) svg.appendChild(hoechste ? fahne(hoechste[0], hoechste[1], ruhig, "3")
      : funken(...({ strich: [296, 120], kreis: [290, 124], linie: [272, 96] }[z.art] || [BREITE - 30, 120]), ruhig));
    return svg;
  }

  // ----- Zufalls-Skala (SAMMELN · zufall) -----
  // Stufen wie im Spiel: drei (unmöglich, möglich, sicher) oder fünf (dazu unwahrscheinlich ab 5k ≤ n, wahrscheinlich ab
  // 5k ≥ 4n), Bildzeichen des Spiels.
  const ZUFALL = { unmoeglich: "🚫", unwahrscheinlich: "🐢", moeglich: "🤷", wahrscheinlich: "👍", sicher: "✅" };
  function zufallStufe(k, n, fuenf) {
    if (k === 0) return "unmoeglich";
    if (k === n) return "sicher";
    if (!fuenf) return "moeglich";
    if (5 * k <= n) return "unwahrscheinlich";
    if (5 * k >= 4 * n) return "wahrscheinlich";
    return 5 * k > 2 * n && 5 * k < 3 * n ? "moeglich" : null;
  }
  const KUGELFARBE = { r: "#e5484d", b: "#2f6fd6", g: "#2fb36b", y: "#f5b301" };
  function zufallsSack(x, y, kugeln) {
    const g = s("g", {}, s("path", { d: `M${x - 34},${y + 30} Q${x - 42},${y - 14} ${x - 16},${y - 26} L${x + 16},${y - 26} Q${x + 42},${y - 14} ${x + 34},${y + 30} Z`, fill: "#e8d7b0", stroke: "#b8a98a", "stroke-width": 1.4 }));
    const { plaetze } = rasterIn(kugeln.length, x - 28, y - 18, 56, 44);
    kugeln.forEach((f, i) => g.appendChild(s("circle", { cx: plaetze[i][0], cy: plaetze[i][1], r: 5, fill: KUGELFARBE[f], stroke: "#2d3047", "stroke-width": 0.6, "data-stueck": "kugel" })));
    return g;
  }
  function gluecksrad(x, y, r, felder) {
    const g = s("g", {});
    felder.forEach((f, i) => g.appendChild(sektor(x, y, r, 90 - ((i + 1) * 360) / felder.length, 90 - (i * 360) / felder.length, KUGELFARBE[f])));
    g.append(s("circle", { cx: x, cy: y, r, fill: "none", stroke: "#2d3047", "stroke-width": 1.4 }), s("path", { d: `M${x},${y - r - 8} l-5,-8 h10 Z`, fill: "#2d3047" }));
    return g;
  }
  /**
   * Links das Säckchen, Glücksrad oder die Würfel der Stufe, rechts die Skala mit den Bildzeichen des Spiels; der Zeiger
   * fällt auf die Stufe des Ereignisses (Anteil k von n, nachgerechnet). vergleich: zwei Räder, das mit der grösseren
   * Chance leuchtet; zahl: dazu „3 von 10“; summe: zwei Würfel und die Zahl der Möglichkeiten.
   */
  function zufall(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "zufall" });
    svg.appendChild(tagGrund());
    const T = DAUER * 0.65;
    if (z.vergleich) {
      const [a, b] = z.vergleich, k = r => r.filter(f => f === z.ziel).length / r.length;
      if (!Array.isArray(a) || !Array.isArray(b) || k(a) === k(b)) return null;
      [[a, 90], [b, 230]].forEach(([rad, x]) => { const g = gluecksrad(x, 66, 42, rad); svg.appendChild(erscheine(g, x === 90 ? 0 : 0.4, ruhig)); });
      const gew = k(a) > k(b) ? 90 : 230;
      svg.appendChild(erscheine(s("circle", { cx: gew, cy: 66, r: 50, fill: "none", stroke: "#f5b301", "stroke-width": 3 }), T, ruhig));
      svg.appendChild(erscheine(text(160, 72, k(a) > k(b) ? ">" : "<", { gross: 20, farbe: "#e5484d" }), T, ruhig));
      svg.setAttribute("data-wert", k(a) > k(b) ? "links" : "rechts");
    } else if (z.summe) {
      // zwei Würfel: alle Paare mit der Augensumme
      const paare = [];
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === z.summe) paare.push([a, b]);
      if (!paare.length) return null;
      const w = (x, y, n) => s("g", {}, s("rect", { x, y, width: 20, height: 20, rx: 4, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 1.2 }), augen(x, y, 20, n));
      // je Paar ein Feld, damit die beiden Würfel zusammen gelesen werden
      const pb = Math.min(50, 300 / paare.length), x0 = BREITE / 2 - (paare.length * pb) / 2;
      paare.forEach(([a, b], i) => svg.appendChild(erscheine(s("g", { "data-stueck": "paar" }, s("rect", { x: x0 + i * pb + 2, y: 44, width: pb - 4, height: 32, rx: 6, fill: "#eef3fb", stroke: "#8ab4cc", "stroke-width": 1 }),
        w(x0 + i * pb + pb / 2 - 21, 50, a), w(x0 + i * pb + pb / 2 + 1, 50, b)), (i * T) / paare.length, ruhig, 0.2)));
      svg.setAttribute("data-anzahl", paare.length);
      svg.appendChild(erscheine(zeileUnten(`${paare.length} von 36`, 120), T + 0.2, ruhig));
      svg.setAttribute("data-wert", paare.length);
    } else {
      const inhalt = z.sack || z.rad;
      if (!Array.isArray(inhalt) || !inhalt.length || !inhalt.every(f => KUGELFARBE[f])) return null;
      const k = inhalt.filter(f => f === z.ziel).length, n = inhalt.length, st = zufallStufe(k, n, z.fuenf);
      if (!st) return null;
      svg.appendChild(erscheine(z.sack ? zufallsSack(70, 70, inhalt) : gluecksrad(70, 72, 44, inhalt), 0, ruhig));
      // die gezogene Farbe: eine Kugel über dem Säckchen
      svg.appendChild(erscheine(s("g", {}, s("circle", { cx: 70, cy: 18, r: 8, fill: KUGELFARBE[z.ziel], stroke: "#2d3047", "stroke-width": 1 }), text(84, 22, "?", { gross: 13, anker: "start" })), 0.3, ruhig));
      // Skala
      const stufen = z.fuenf ? ["unmoeglich", "unwahrscheinlich", "moeglich", "wahrscheinlich", "sicher"] : ["unmoeglich", "moeglich", "sicher"];
      const L = 150, R = 300, y = 96, px = i => L + (i * (R - L)) / (stufen.length - 1);
      svg.appendChild(s("line", { x1: L, y1: y, x2: R, y2: y, stroke: "#2d3047", "stroke-width": 2 }));
      stufen.forEach((st0, i) => svg.append(s("line", { x1: px(i), y1: y - 5, x2: px(i), y2: y + 5, stroke: "#2d3047", "stroke-width": 1.6 }), bildzeichen(px(i), y + 20, ZUFALL[st0], 16)));
      const ix = stufen.indexOf(st), zeiger = s("g", { "data-figur": "zeiger", "data-wert": st }, s("path", { d: "M0,0 L-7,-12 L7,-12 Z", fill: "#e5484d", stroke: "#2d3047", "stroke-width": 0.8 }));
      svg.appendChild(bewege(zeiger, `M${L},${y - 30} Q${(L + px(ix)) / 2},${y - 70} ${px(ix)},${y - 7}`, { x: px(ix), y: y - 7, winkel: 0 }, ruhig, { drehen: false, ab: 0.5, dauer: T }));
      svg.appendChild(erscheine(s("circle", { cx: px(ix), cy: y + 20, r: 13, fill: "none", stroke: "#f5b301", "stroke-width": 2.4 }), T + 0.5, ruhig));
      if (z.zahl) svg.appendChild(erscheine(text(225, 40, `${k} von ${n}`, { gross: 15 }), T + 0.5, ruhig));
      svg.setAttribute("data-wert", st);
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 22, ruhig));
    return svg;
  }

  // ----- Sortier-Kiste (SAMMELN · sortieren) -----
  const FORM_D = { kreis: r => `M${-r},0 a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 Z`, dreieck: r => `M0,${-r} L${r},${r * 0.8} L${-r},${r * 0.8} Z`, quadrat: r => `M${-r * 0.85},${-r * 0.85} h${r * 1.7} v${r * 1.7} h${-r * 1.7} Z` };
  /**
   * Die Klötze der Stufe springen in ihre Kisten nach der Regel (farbe, form, groesse oder farbe-form: die passenden in
   * eine Kiste, die übrigen daneben); zaehlen: die Zahl auf jeder Kiste; strichliste: dazu die Strichliste. Geprüft:
   * jeder Klotz in genau einer Kiste.
   */
  function sortieren(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.teile) || !z.teile.length || z.teile.length > 12 || !Array.isArray(z.kisten) || z.kisten.length < 2 || z.kisten.length > 3) return null;
    const passt = (t, k) => (z.regel === "farbe" ? t[1] === k : z.regel === "form" ? t[0] === k : z.regel === "groesse" ? t[2] === k : z.regel === "farbe-form" ? (k === "rest" ? !(t[0] === z.ziel[0] && t[1] === z.ziel[1]) : t[0] === z.ziel[0] && t[1] === z.ziel[1]) : false);
    const kiste = z.teile.map(t => z.kisten.filter(k => passt(t, k)));
    if (kiste.some(k => k.length !== 1) || !z.teile.every(t => FORM_D[t[0]] && KUGELFARBE[t[1]])) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "sortieren", "data-anzahl": z.teile.length });
    svg.appendChild(tagGrund());
    const nk = z.kisten.length, kb = Math.min(92, 270 / nk), kx = i => BREITE / 2 + (i - (nk - 1) / 2) * (kb + 8), ky = 92, T = DAUER * 0.75;
    const zahl = z.kisten.map(() => 0);
    z.kisten.forEach((k, i) => {
      const x = kx(i);
      svg.append(s("path", { d: `M${x - kb / 2},${ky} L${x - kb / 2 + 6},${ky + 40} H${x + kb / 2 - 6} L${x + kb / 2},${ky} Z`, fill: "#c08a4f", stroke: "#6b4a2b", "stroke-width": 1.4 }));
      // Zeichen der Kiste: die Farbe, die Form, gross/klein oder der gesuchte Klotz
      const zeichen = z.regel === "farbe" ? s("circle", { cx: x, cy: ky + 22, r: 7, fill: KUGELFARBE[k] }) : z.regel === "form" ? s("path", { d: FORM_D[k](7), transform: `translate(${x} ${ky + 22})`, fill: "#ffffff" })
        : z.regel === "groesse" ? s("path", { d: FORM_D.quadrat(k === "gross" ? 9 : 5), transform: `translate(${x} ${ky + 22})`, fill: "#ffffff" })
          : k === "rest" ? null : s("path", { d: FORM_D[z.ziel[0]](7), transform: `translate(${x} ${ky + 22})`, fill: KUGELFARBE[z.ziel[1]] });
      if (zeichen) svg.appendChild(zeichen);
    });
    const je = T / z.teile.length;
    z.teile.forEach((t0, i) => {
      const k = z.kisten.indexOf(kiste[i][0]), n0 = zahl[k]++, r = t0[2] === "klein" ? 5.5 : 9;
      const zx = kx(k) + ((n0 % 4) - 1.5) * (kb / 4.6), zy = ky - 8 - Math.floor(n0 / 4) * 18, sx = 30 + (i % 6) * 48, sy = 24 + Math.floor(i / 6) * 22;
      const e = s("path", { d: FORM_D[t0[0]](r), fill: KUGELFARBE[t0[1]], stroke: "#2d3047", "stroke-width": 0.8, transform: `translate(${sx} ${sy})`, "data-stueck": "klotz" });
      svg.appendChild(schiebe(s("g", {}, e), zx - sx, zy - sy, i * je, ruhig, { dauer: 0.4, bogen: 16 }));
    });
    if (z.zaehlen) z.kisten.forEach((k, i) => svg.appendChild(erscheine(s("g", {}, s("circle", { cx: kx(i) + kb / 2 - 4, cy: ky + 4, r: 10, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 1.2 }),
      text(kx(i) + kb / 2 - 4, ky + 8.5, zahl[i], { gross: 12 })), T + 0.2, ruhig)));
    svg.setAttribute("data-wert", zahl.join(","));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 50, 58, ruhig));
    return svg;
  }

  // ----- Möglichkeiten-Finder (SAMMELN · kombinationen) -----
  const SORTEN = ["#7a4a2a", "#f08aa8", "#f4e3a1", "#7cc576", "#c9a2e8"]; // Schoggi, Erdbeer, Vanille, Pistazie, Heidelbeer
  /**
   * Alle Möglichkeiten der Stufe erscheinen der Reihe nach, am Ende ihre Zahl: kleider (Hosen × Shirts [× Hüte]) oder
   * glace (Sorten, Kugeln, mit oder ohne Reihenfolge und Wiederholung, im Becher, im Cornet oder beides) — erzeugt und
   * gezählt wie im Spiel.
   */
  function kombinationen(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    let liste;
    if (z.art === "kleider") {
      const [h, s0, hut = 1] = z.anzahl;
      liste = [];
      for (let a = 0; a < h; a++) for (let b = 0; b < s0; b++) for (let c = 0; c < hut; c++) liste.push({ hose: a, shirt: b, hut: hut > 1 ? c : -1 });
    } else if (z.art === "glace") {
      const { sorten, kugeln, reihenfolge, wiederholung } = z;
      if (!(sorten >= 2 && sorten <= 5 && kugeln >= 1 && kugeln <= 3)) return null;
      const wahl = (start, rest, bisher) => {
        if (!rest) return [bisher];
        const aus = [];
        for (let i = reihenfolge ? 0 : start; i < sorten; i++) { if (!wiederholung && bisher.includes(i)) continue; aus.push(...wahl(wiederholung ? i : i + 1, rest - 1, [...bisher, i])); }
        return aus;
      };
      const kombi = wahl(0, kugeln, []);
      liste = (z.gefaess === "beides" ? ["becher", "cornet"] : [z.gefaess || "becher"]).flatMap(g => kombi.map(k => ({ gefaess: g, kugeln: k })));
    } else return null;
    if (liste.length < 1 || liste.length > 24 || (z.zahl !== undefined && liste.length !== z.zahl)) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "kombinationen", "data-anzahl": liste.length, "data-wert": liste.length });
    svg.appendChild(tagGrund());
    // Grösse nach der Höhe der Figur (ein Cornet mit drei Kugeln ist höher als ein Becher)
    const hoehe = z.art === "kleider" ? (z.anzahl[2] ? 50 : 42) : 30 + 10 * z.kugeln;
    const { zelle: c, plaetze } = rasterIn(liste.length, 10, 6, 300, 118), k = Math.min(1, (c * 0.95) / hoehe), je = (DAUER * 0.8) / liste.length;
    const HOSEN = ["#2f6fd6", "#4f5668", "#a8743f"], SHIRTS = ["#e5484d", "#2fb36b", "#f5b301", "#c9a2e8"], HUETE = ["#2d3047", "#e0569a", "#2fb36b", "#f0913a"];
    liste.forEach((m, i) => {
      // die Figur steht mittig in ihrer Zelle: Glace von der Spitze des Cornets bis zur obersten Kugel
      const mitte = m.hose !== undefined ? 0 : (22 - (10 * (z.kugeln - 1) + 7)) / 2;
      const [x, y] = plaetze[i], g = s("g", { "data-stueck": "moeglichkeit", transform: `translate(${x.toFixed(1)} ${(y - mitte * k).toFixed(1)}) scale(${k.toFixed(3)})` });
      if (m.hose !== undefined) {
        g.append(s("path", { d: "M-9,2 h18 l2,16 h-8 l-2,-10 l-2,10 h-8 Z", fill: HOSEN[m.hose] }), s("path", { d: "M-10,-14 l6,-4 h8 l6,4 l5,6 l-4,3 l-3,-3 v12 h-14 v-12 l-3,3 l-4,-3 Z", fill: SHIRTS[m.shirt] }));
        if (m.hut >= 0) g.append(s("ellipse", { cx: 0, cy: -20, rx: 8, ry: 2, fill: HUETE[m.hut] }), s("rect", { x: -5, y: -27, width: 10, height: 7, rx: 2, fill: HUETE[m.hut] }));
      } else {
        g.appendChild(m.gefaess === "becher" ? s("path", { d: "M-10,4 L-7,18 H7 L10,4 Z", fill: "#f2f2f7", stroke: "#8a8fa8", "stroke-width": 1 }) : s("path", { d: "M-9,4 L0,22 L9,4 Z", fill: "#d9a35b", stroke: "#8a5a2b", "stroke-width": 1 }));
        // Kugeln: im Becher nebeneinander, im Cornet übereinander (Turm, die Reihenfolge zählt)
        m.kugeln.forEach((sorte, j) => g.appendChild(s("circle", m.gefaess === "becher" && m.kugeln.length > 1 ? { cx: (j - (m.kugeln.length - 1) / 2) * 9, cy: 0 - (j % 2) * 3, r: 6, fill: SORTEN[sorte], stroke: "#8a5a2b", "stroke-width": 0.6 }
          : { cx: 0, cy: 0 - j * 10, r: 6.5, fill: SORTEN[sorte], stroke: "#8a5a2b", "stroke-width": 0.6 })));
      }
      svg.appendChild(erscheine(g, i * je, ruhig, 0.15));
    });
    svg.appendChild(erscheine(zeileUnten(z.rechnung || String(liste.length), 142), DAUER * 0.85, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 40, 128, ruhig));
    return svg;
  }

  // ----- Silben-Klatscher (AUFTRITT · silben) -----
  /**
   * Das Bild des Worts (aus der Liste des Spiels), darunter ein leeres Kärtchen in Silben geteilt; Silbe um Silbe ein
   * Bogen und ein Klatschen, am Ende die Zahl. ordnen: die Silben liegen erst durcheinander und rutschen an ihren Platz.
   */
  function silben(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Number.isInteger(z.silben) || z.silben < 1 || z.silben > 5 || !z.bild) return null;
    const n = z.silben, svg = neuesBild("auftritt", stufe, { "data-bilder": "silben", "data-anzahl": n, "data-wert": n });
    svg.appendChild(tagGrund());
    svg.appendChild(erscheine(bildzeichen(54, 72, z.bild, 46), 0, ruhig));
    // Kärtchen und Zahl ganz im Bild, auch bei fünf Silben
    const sb = Math.min(42, 168 / n), x0 = 102, y = 62, T = DAUER * 0.8, je = T / n;
    const reihe = z.ordnen ? [...Array(n).keys()].reverse() : [...Array(n).keys()];
    for (let i = 0; i < n; i++) {
      const farbe = `var(--deko-${(i % 6) + 1})`, x = x0 + i * sb;
      // leeres Silbenkärtchen: zwei Striche statt Buchstaben
      const karte = s("g", { "data-stueck": "silbe" }, s("rect", { x: x + 1, y, width: sb - 2, height: 22, rx: 4, fill: "#ffffff", style: `stroke:${farbe}`, "stroke-width": 2 }),
        s("path", { d: `M${x + 6},${y + 9} h${sb - 12} M${x + 6},${y + 15} h${(sb - 12) * 0.6}`, stroke: "#c9cde0", "stroke-width": 2, "stroke-linecap": "round" }));
      if (z.ordnen && !ruhig) {
        // durcheinander: die Silbe liegt erst am Platz einer anderen und rutscht dann an ihren
        const von = x0 + reihe.indexOf(i) * sb, w = s("g", { transform: `translate(${von - x} -18)` }, karte);
        w.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: `${von - x} -18`, to: "0 0", begin: t(0.2 + i * 0.15), dur: "0.5s", fill: "freeze" }));
        svg.appendChild(w);
      } else svg.appendChild(karte);
      const ab = (z.ordnen ? T * 0.4 : 0) + i * (z.ordnen ? (T * 0.6) / n : je);
      svg.appendChild(zeichne(s("path", { d: `M${x + 3},${y + 28} Q${x + sb / 2},${y + 46} ${x + sb - 3},${y + 28}`, fill: "none", stroke: "#e5484d", "stroke-width": 2.4, "stroke-linecap": "round" }), ab, ruhig, 0.3));
      svg.appendChild(kurz(bildzeichen(x + sb / 2, y - 14, "👏", 16), ab, ab + 0.3, ruhig));
    }
    svg.appendChild(erscheine(text(x0 + n * sb + 20, y + 19, n, { gross: 22, farbe: "#e5484d" }), T, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 124, ruhig));
    return svg;
  }

  // ----- Reim-Paare (SAMMELN · reime) -----
  /** Die Paare aus der Liste des Spiels springen zusammen; nicht: ein Bild, das sich nicht reimt, wird durchgestrichen. */
  function reime(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.paare) || !z.paare.length || z.paare.length > 6 || !z.paare.every(p => Array.isArray(p) && p.length === 2)) return null;
    const n = z.paare.length, mitNicht = !!z.nicht, svg = neuesBild("sammeln", stufe, { "data-bilder": "reime", "data-anzahl": n });
    svg.appendChild(tagGrund());
    const spalten = n <= 3 ? n + (mitNicht ? 1 : 0) : 3, zeilen = Math.ceil((n + (mitNicht ? 1 : 0)) / spalten), zb = 300 / spalten, zh = 128 / zeilen, gross = Math.min(30, zh * 0.5), T = DAUER * 0.75;
    const platz = i => [10 + ((i % spalten) + 0.5) * zb, 10 + (Math.floor(i / spalten) + 0.5) * zh];
    z.paare.forEach(([a, b], i) => {
      const [x, y] = platz(i), g = s("g", { "data-stueck": "paar" }), d = gross * 0.62;
      const l = s("g", {}, bildzeichen(x - d, y, a, gross)), r = s("g", {}, bildzeichen(x + d, y, b, gross));
      g.append(schiebe(l, 0, 0, 0, true), schiebe(r, 0, 0, 0, true));
      if (!ruhig) { l.setAttribute("transform", "translate(-30 0)"); r.setAttribute("transform", "translate(30 0)");
        l.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "-30 0", to: "0 0", begin: t((i * T) / n), dur: "0.45s", fill: "freeze" }));
        r.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "30 0", to: "0 0", begin: t((i * T) / n), dur: "0.45s", fill: "freeze" })); }
      g.appendChild(erscheine(s("rect", { x: x - d * 2 - 4, y: y - gross * 0.7, width: d * 4 + 8, height: gross * 1.4, rx: 10, fill: "none", stroke: "#f5b301", "stroke-width": 2 }), (i * T) / n + 0.45, ruhig));
      svg.appendChild(erscheine(g, (i * T) / n, ruhig, 0.15));
    });
    if (mitNicht) {
      const [x, y] = platz(n);
      svg.appendChild(erscheine(s("g", { "data-nicht": z.nicht }, bildzeichen(x, y, z.nicht, gross), s("path", { d: `M${x - gross * 0.6},${y - gross * 0.6} l${gross * 1.2},${gross * 1.2} M${x + gross * 0.6},${y - gross * 0.6} l${-gross * 1.2},${gross * 1.2}`, stroke: "#e5484d", "stroke-width": 3, "stroke-linecap": "round" })), T, ruhig));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(24, 22, ruhig));
    return svg;
  }

  // ----- Buchstaben-Zwillinge (SAMMELN · zwillinge) -----
  /** Sockenpaare an der Wäscheleine, auf jeder Socke der Buchstabe gross und klein; Paar um Paar. */
  function zwillinge(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.paare) || !z.paare.length || z.paare.length > 6 || !z.paare.every(p => p.length === 2 && p[0].toLowerCase() === p[1].toLowerCase())) return null;
    const n = z.paare.length, svg = neuesBild("sammeln", stufe, { "data-bilder": "zwillinge", "data-anzahl": n });
    svg.appendChild(tagGrund());
    svg.appendChild(s("path", { d: "M8,30 Q160,48 312,30", fill: "none", stroke: "#8a8fa8", "stroke-width": 1.6 }));
    const pb = 300 / n, T = DAUER * 0.8;
    z.paare.forEach(([gr, kl], i) => {
      const x = 10 + (i + 0.5) * pb, g = s("g", { "data-stueck": "paar" }), farbe = `var(--deko-${(i % 6) + 1})`;
      [[gr, -1], [kl, 1]].forEach(([b, seite]) => {
        const sx = x + seite * Math.min(14, pb * 0.22), sy = 30 + 18 * (1 - ((sx - 160) / 152) ** 2) - 2;
        g.append(s("path", { d: `M${sx - 8},${sy} v36 q0,10 10,10 h6 q6,0 6,-6 q0,-6 -6,-6 h-4 v-34 Z`, style: `fill:${farbe}`, stroke: "#2d3047", "stroke-width": 1 }),
          s("rect", { x: sx - 3, y: sy - 4, width: 5, height: 8, rx: 1, fill: "#a8743f" }), text(sx, sy + 26, b, { gross: Math.min(16, pb * 0.3), farbe: "#ffffff" }));
      });
      svg.appendChild(vonOben(g, (i * T) / n, ruhig, 30, 0.35));
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 118, ruhig));
    return svg;
  }

  // ----- Blitzlesen (SAMMELN · laternen) -----
  /** Laternenkette: so viele Laternen, wie die Stufe zählt, leuchten nacheinander auf. */
  function laternen(feier, { stufe, sterne, ruhig }) {
    const n = feier.ziele?.[stufe];
    if (!Number.isInteger(n) || n < 1 || n > 6) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "laternen", "data-anzahl": n });
    svg.append(himmelGrund(), himmel(), s("path", { d: "M6,34 Q160,64 314,34", fill: "none", stroke: "#8a8fa8", "stroke-width": 1.4 }));
    const T = DAUER * 0.8;
    for (let i = 0; i < 6; i++) {
      const x = 30 + i * 52, y = 34 + 30 * (1 - ((x - 160) / 154) ** 2), an = i < n, farbe = ["#f5b301", "#e0569a", "#2fb36b", "#2f8fe0", "#f0913a", "#c9a2e8"][i];
      svg.append(s("line", { x1: x, y1: y - 4, x2: x, y2: y + 4, stroke: "#8a8fa8", "stroke-width": 1 }), s("ellipse", { cx: x, cy: y + 20, rx: 13, ry: 16, fill: "#3a3f5c", stroke: "#5a607e", "stroke-width": 1 }));
      if (an) svg.append(erscheine(s("g", { "data-stueck": "laterne" }, s("ellipse", { cx: x, cy: y + 20, rx: 22, ry: 24, fill: farbe, opacity: 0.25 }), s("ellipse", { cx: x, cy: y + 20, rx: 13, ry: 16, fill: farbe }),
        s("ellipse", { cx: x - 4, cy: y + 14, rx: 3, ry: 5, fill: "#ffffff", opacity: 0.5 })), (i * T) / n, ruhig, 0.3));
    }
    if (sterne >= 2) svg.appendChild(funkeln(ruhig));
    if (sterne >= 3) svg.appendChild(sternschnuppe(ruhig));
    return svg;
  }

  // ----- Lese-Detektiv, Sachtext-Spurensuche (ZOOM · lupenzoom) -----
  // Ein Bild, in das je Stufe tiefer hineingezoomt wird (Ziel: Rechteck x, y, b, h im Bild).
  function zoomSzene(svg, szene, [zx, zy, zb, zh], ruhig, T) {
    const k = Math.min(BREITE / zb, HOEHE / zh), dx = BREITE / 2 - k * (zx + zb / 2), dy = HOEHE / 2 - k * (zy + zh / 2);
    const innen = s("g", { transform: `scale(${ruhig ? k : 1})` }, szene), aussen = s("g", { transform: `translate(${ruhig ? dx : 0} ${ruhig ? dy : 0})`, "data-zoom": k.toFixed(2) }, innen);
    if (!ruhig) {
      aussen.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: "0 0", to: `${dx} ${dy}`, begin: t(0.3), dur: `${T}s`, fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }));
      innen.appendChild(s("animateTransform", { attributeName: "transform", type: "scale", from: "1", to: `${k}`, begin: t(0.3), dur: `${T}s`, fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }));
    }
    const clip = `feier-zoom-${Math.round(zx * 10)}-${Math.round(zy * 10)}`;
    svg.append(s("clipPath", { id: clip }, s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14 })), s("g", { "clip-path": `url(#${clip})` }, aussen));
  }
  // je Stufe deutlich näher: Haus, Fenster mit Hauswand, Katze, Halsband, Glöckchen, der Marienkäfer darauf (in der Mitte)
  const LESE_ZIELE = { haus: [100, 28, 120, 106], fenster: [122, 56, 52, 44], katze: [139, 70, 16, 19], halsband: [141, 82, 10, 8], gloeckchen: [144, 84.5, 3.2, 3.2], kaefer: [144.95, 84.65, 0.8, 0.8] };
  function leseSzene() {
    return s("g", {}, s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, fill: "#d6ecf8" }), s("rect", { x: 0, y: 120, width: BREITE, height: 30, fill: "#86c46f" }),
      s("path", { d: "M104,60 L160,28 L216,60 Z", fill: "#c8553d" }), s("rect", { x: 108, y: 60, width: 104, height: 70, fill: "#f3e3c3", stroke: "#a8743f", "stroke-width": 1 }),
      s("rect", { x: 180, y: 92, width: 20, height: 38, fill: "#8a5a32" }), s("rect", { x: 131, y: 64, width: 34, height: 28, fill: "#bfe1f5", stroke: "#6b4a2b", "stroke-width": 1.2 }),
      // Katze im Fenster mit Halsband, Glöckchen und einem Marienkäfer darauf
      s("ellipse", { cx: 147, cy: 88, rx: 8, ry: 5, fill: "#f0a050" }), s("circle", { cx: 147, cy: 77, r: 6.5, fill: "#f0a050" }),
      s("path", { d: "M141.5,73 l1,-5 l3,4 Z M152.5,73 l-1,-5 l-3,4 Z", fill: "#f0a050" }), s("circle", { cx: 145, cy: 76, r: 0.9, fill: "#2d3047" }), s("circle", { cx: 149, cy: 76, r: 0.9, fill: "#2d3047" }),
      s("path", { d: "M141.6,82.6 Q147,85 152.4,82.6", stroke: "#e5484d", "stroke-width": 1.4, fill: "none" }), s("circle", { cx: 145.6, cy: 85.4, r: 1.3, fill: "#f5b301", stroke: "#b8962a", "stroke-width": 0.2 }),
      s("g", { transform: "translate(145.35 85.15) scale(0.045)" }, marienkaefer()), s("rect", { x: 131, y: 64, width: 34, height: 28, fill: "none", stroke: "#6b4a2b", "stroke-width": 1.2 }), s("line", { x1: 148, y1: 64, x2: 148, y2: 72, stroke: "#6b4a2b", "stroke-width": 0.8 }));
  }
  const FERN_ZIELE = { huegel: [20, 30, 280, 120], baum: [150, 26, 90, 84], ast: [196, 34, 40, 30], nest: [208, 40, 20, 14], ei: [214, 42, 8, 6], vogel: [214, 42, 8, 6] };
  function fernSzene(geschluepft) {
    const g = s("g", {}, s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, fill: "#d6ecf8" }), s("path", { d: "M0,150 L0,110 Q90,60 190,96 Q260,70 320,96 L320,150 Z", fill: "#86c46f" }),
      s("rect", { x: 190, y: 56, width: 8, height: 46, fill: "#8a5a32" }), s("circle", { cx: 194, cy: 46, r: 26, fill: "#4f9d47" }), s("circle", { cx: 178, cy: 56, r: 16, fill: "#5aa84f" }),
      s("path", { d: "M198,52 L228,46", stroke: "#8a5a32", "stroke-width": 2.4 }), s("path", { d: "M210,46 Q218,54 226,46 Z", fill: "#a8743f", stroke: "#6b4a2b", "stroke-width": 0.4 }));
    if (geschluepft) g.append(s("path", { d: "M215.5,46.2 l1.5,-1.6 l1,1.4 l1,-1.4 l1.5,1.6 Z", fill: "#f4ecc8" }), s("circle", { cx: 218, cy: 44, r: 1.8, fill: "#f5d04a" }), s("path", { d: "M219.6,44 l1,0.3 l-1,0.3 Z", fill: "#f0913a" }), s("circle", { cx: 218.6, cy: 43.6, r: 0.25, fill: "#2d3047" }));
    else g.appendChild(s("ellipse", { cx: 218, cy: 45, rx: 1.6, ry: 2, fill: "#f4ecc8", stroke: "#c9b98f", "stroke-width": 0.2 }));
    return g;
  }
  /**
   * Hinein zoomen bis zum Ziel der Stufe; am Ende ein Lupenring (lese) oder ein Fernglas (fern) mit zwei Gläsern.
   * lese: haus, fenster, katze, halsband, gloeckchen, kaefer; fern: huegel, baum, ast, nest, ei, vogel (der Vogel schlüpft).
   */
  function lupenzoom(feier, { stufe, sterne, ruhig }) {
    const ziel = feier.ziele?.[stufe], fern = feier.szene === "fern", Z = fern ? FERN_ZIELE : LESE_ZIELE;
    if (!Z[ziel]) return null;
    const svg = neuesBild("zoom", ziel, { "data-bilder": "lupenzoom" });
    svg.appendChild(tagGrund());
    const T = DAUER * 0.75;
    zoomSzene(svg, fern ? fernSzene(ziel === "vogel") : leseSzene(), Z[ziel], ruhig, T);
    // Fernglas: zwei Gläser, die sich in der Mitte überlappen (dort liegt das Ziel); das Loch ist ihre gemeinsame Form
    if (fern) svg.appendChild(erscheine(s("path", { d: `M0,0 H${BREITE} V${HOEHE} H0 Z M160,21.9 A62,62 0 1,0 160,128.1 A62,62 0 1,0 160,21.9 Z`, fill: "#2d3047", "fill-rule": "evenodd", "fill-opacity": 0.55 }), T + 0.3, ruhig));
    else svg.appendChild(erscheine(s("g", {}, s("circle", { cx: 160, cy: 72, r: 62, fill: "none", stroke: "#2d3047", "stroke-width": 6 }), s("line", { x1: 205, y1: 115, x2: 232, y2: 142, stroke: "#7a4f26", "stroke-width": 9, "stroke-linecap": "round" })), T + 0.3, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Wort-Spürnase (KARTE · spurweg) -----
  /** Die Spürnase folgt der Fährte Abschnitt um Abschnitt (so viele, wie die Stufe zählt); am letzten Abschnitt das Buch. */
  function spurweg(feier, { stufe, sterne, ruhig }) {
    const n = feier.ziele?.[stufe];
    if (!Number.isInteger(n) || n < 1 || n > 6) return null;
    const svg = neuesBild("karte", stufe, { "data-bilder": "spurweg", "data-anzahl": n });
    svg.appendChild(s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#f6ecd2" }));
    const pts = [[24, 120], [74, 92], [124, 116], [176, 84], [224, 110], [270, 72], [300, 40]];
    for (let i = 0; i < 6; i++) svg.appendChild(s("path", { d: `M${pts[i].join(",")} L${pts[i + 1].join(",")}`, stroke: i < n ? "#a8743f" : "#d9cdb0", "stroke-width": 2, "stroke-dasharray": "4 3", fill: "none" }));
    for (let i = 0; i < n; i++) svg.appendChild(erscheine(s("circle", { cx: pts[i + 1][0], cy: pts[i + 1][1], r: 4, fill: "#e5484d", "data-stueck": "abschnitt" }), ((i + 1) * DAUER * 0.8) / n, ruhig, 0.2));
    if (n === 6) svg.appendChild(erscheine(s("g", { transform: "translate(300 40)" }, s("path", { d: "M-14,-6 L0,-2 L14,-6 V8 L0,12 L-14,8 Z", fill: "#e8f0fb", stroke: "#2f62a0", "stroke-width": 1.2 }), s("line", { x1: 0, y1: -2, x2: 0, y2: 12, stroke: "#2f62a0", "stroke-width": 1 })), DAUER * 0.8, ruhig));
    const weg = "M" + pts.slice(0, n + 1).map(p => p.join(",")).join(" L"), [lx, ly] = pts[n];
    svg.appendChild(bewege(s("g", {}, s("g", { transform: "scale(0.85) translate(0 -14)" }, hund())), weg, { x: lx, y: ly, winkel: 0 }, ruhig, { drehen: false, linear: true }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(40, 30, ruhig));
    return svg;
  }

  // ----- Figuren-Spiegel (AUFTRITT · theater) -----
  /** Puppentheater: Figur um Figur tritt auf, jede mit einem Gefühl (Bildzeichen); am Ende verbeugen sich alle. */
  function theater(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!Array.isArray(z) || !z.length || z.length > 6) return null;
    const svg = neuesBild("auftritt", stufe, { "data-bilder": "theater", "data-anzahl": z.length },
      s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#3a1f3d" }));
    svg.append(s("rect", { x: 30, y: 20, width: 260, height: 96, fill: "#1f1230" }),
      s("path", { d: "M30,20 L80,20 C70,60 76,90 60,116 L30,116 Z", fill: "#8c2f4b" }), s("path", { d: "M290,20 L240,20 C250,60 244,90 260,116 L290,116 Z", fill: "#8c2f4b" }),
      s("rect", { x: 20, y: 116, width: 280, height: 26, rx: 4, fill: "#b07a45" }), s("rect", { x: 20, y: 10, width: 280, height: 12, rx: 3, fill: "#c94a6a" }));
    const n = z.length, je = (DAUER * 0.75) / n;
    z.forEach((gefuehl, i) => {
      const x = 160 + (i - (n - 1) / 2) * Math.min(36, 170 / n), g = s("g", { "data-stueck": "figur" }, s("rect", { x: x - 2, y: 104, width: 4, height: 14, fill: "#a8743f" }), bildzeichen(x, 90, gefuehl, 26));
      const innen = s("g", {}, g);
      if (!ruhig) { innen.setAttribute("opacity", "0"); innen.append(s("set", { attributeName: "opacity", to: 1, begin: t(i * je), fill: "freeze" }),
        s("animateTransform", { attributeName: "transform", type: "translate", values: "0 30;0 0", begin: t(i * je), dur: "0.35s", fill: "freeze" }),
        s("animateTransform", { attributeName: "transform", type: "translate", values: "0 0;0 5;0 0", begin: t(DAUER + 0.1), dur: "0.6s", additive: "sum", fill: "freeze" })); }
      svg.appendChild(innen);
    });
    if (sterne >= 2) svg.appendChild(erscheine(s("g", { "data-schmuck": "2", fill: "#fff6c8", opacity: 0.16 }, s("path", { d: "M100,22 L114,22 L180,116 L110,116 Z" })), DAUER, ruhig, 0.5));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 40, ruhig));
    return svg;
  }

  // ----- Regel-Lücke (BAUEN · steg) -----
  /** Steg über den Bach mit sechs Lücken: so viele Bretter, wie die Stufe zählt, fallen hinein; ganz: die Eule läuft hinüber. */
  function steg(feier, { stufe, sterne, ruhig }) {
    const n = feier.ziele?.[stufe];
    if (!Number.isInteger(n) || n < 1 || n > 6) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "steg", "data-anzahl": n });
    svg.append(tagGrund(), s("path", { d: "M0,100 L320,100 L320,136 Q320,150 306,150 L14,150 Q0,150 0,136 Z", fill: "#5aa9dc" }),
      s("path", { d: "M0,80 L50,80 L50,150 L0,150 Z M270,80 L320,80 L320,150 L270,150 Z", fill: "#86c46f" }));
    // sechs Lücken zwischen sieben festen Brettern
    const bw = 220 / 13, x0 = 50, y = 86;
    for (let i = 0; i < 13; i++) {
      const luecke = i % 2 === 1, nr = (i - 1) / 2;
      if (!luecke) svg.appendChild(s("rect", { x: x0 + i * bw, y, width: bw - 1, height: 8, fill: "#a8743f", stroke: "#6b4a2b", "stroke-width": 0.8 }));
      else if (nr < n) svg.appendChild(vonOben(s("rect", { x: x0 + i * bw, y, width: bw - 1, height: 8, fill: "#c08a4f", stroke: "#6b4a2b", "stroke-width": 0.8, "data-stueck": "brett" }), (nr * DAUER * 0.6) / n, ruhig, 40, 0.3));
      if (!luecke || nr < n) svg.appendChild(s("rect", { x: x0 + i * bw + bw / 2 - 1.5, y: y + 8, width: 3, height: 18, fill: "#6b4a2b" }));
    }
    if (n === 6) svg.appendChild(bewege(s("g", {}, euleSitzend(0.24)), `M30,80 L290,80`, { x: 290, y: 80, winkel: 0 }, ruhig, { drehen: false, ab: DAUER * 0.6, dauer: DAUER * 0.4 }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.append(fahne(300, 80, ruhig, "3"), funken(40, 30, ruhig));
    return svg;
  }

  // ----- ABC-Sortierer (REISE · abc) -----
  /** Die Eule hüpft über die Steine des ABC bis zum Buchstaben der Stufe; die Steine tragen die Buchstaben. */
  function abc(feier, { stufe, sterne, ruhig }) {
    const n = feier.ziele?.[stufe];
    if (!Number.isInteger(n) || n < 1 || n > 26) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "abc", "data-wert": String.fromCharCode(64 + n) });
    svg.append(tagGrund(), boden());
    const pos = i => { const r = Math.floor(i / 13), k = i % 13; return [22 + (r ? 12 - k : k) * 23, r ? 128 : 74]; };
    for (let i = 0; i < 26; i++) {
      const [x, y] = pos(i), dran = i < n;
      svg.append(s("ellipse", { cx: x, cy: y, rx: 10.5, ry: 7, fill: dran ? "#c9ccd3" : "#e4e6ec", stroke: "#8a94a6", "stroke-width": 1 }),
        text(x, y + 3.6, String.fromCharCode(65 + i), { gross: 10, farbe: dran ? "#2d3047" : "#8a8fa8" }));
    }
    const weg = "M" + [...Array(n).keys()].map(i => pos(i).map((v, j) => (j ? v - 10 : v)).join(",")).join(" L"), [lx, ly] = pos(n - 1);
    svg.appendChild(bewege(s("g", {}, euleSitzend(0.2)), weg, { x: lx, y: ly - 10, winkel: 0 }, ruhig, { drehen: false, linear: true }));
    if (sterne >= 2) svg.appendChild(erscheine(s("g", { "data-schmuck": "2" }, s("ellipse", { cx: lx, cy: ly, rx: 14, ry: 10, fill: "none", stroke: "#f5b301", "stroke-width": 2 })), DAUER, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 30, ruhig));
    return svg;
  }

  // ----- Morphem-Schere (BAUEN · morphem) -----
  /** Bausteine Vorsilbe (orange), Stamm (blau), Endung (grün) stecken sich zusammen — leer wie im Wortfamilien-Baum. */
  function morphem(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!Array.isArray(z) || !z.length || z.length > 4 || !z.every(w => Array.isArray(w) && w.length >= 1 && w.length <= 4 && w.every(t0 => ["v", "s", "e"].includes(t0)) && w.filter(t0 => t0 === "s").length >= 1)) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "morphem", "data-anzahl": z.flat().length });
    svg.appendChild(tagGrund());
    const FARBE = { v: "var(--deko-3)", s: "var(--deko-6)", e: "var(--deko-5)" }, BR = { v: 40, s: 56, e: 34 }, zh = Math.min(30, 120 / z.length), T = DAUER * 0.8, je = T / z.flat().length;
    let k = 0;
    z.forEach((wort, i) => {
      const breite = wort.reduce((a, t0) => a + BR[t0], 0), y = 14 + i * zh + (124 - z.length * zh) / 2;
      let x = BREITE / 2 - breite / 2;
      wort.forEach(t0 => {
        const b = BR[t0], g = s("g", { "data-stueck": t0 }, s("rect", { x: x + 1, y, width: b - 2, height: zh - 6, rx: 4, style: `fill:${FARBE[t0]}`, stroke: "#2d3047", "stroke-width": 1 }),
          s("path", { d: `M${x + 8},${y + (zh - 6) / 2} h${b - 16}`, stroke: "#ffffff", "stroke-width": 2.4, "stroke-linecap": "round", opacity: 0.8 }));
        svg.appendChild(schiebe(s("g", {}, g), 0, 0, 0, true));
        if (!ruhig) { const w = svg.lastChild; w.setAttribute("transform", `translate(0 -30)`); w.setAttribute("opacity", "0");
          w.append(s("set", { attributeName: "opacity", to: 1, begin: t(k * je), fill: "freeze" }), s("animateTransform", { attributeName: "transform", type: "translate", from: `${t0 === "v" ? -30 : t0 === "e" ? 30 : 0} -30`, to: "0 0", begin: t(k * je), dur: "0.35s", fill: "freeze" })); }
        x += b; k++;
      });
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Trenn-Schere (SAMMELN · streifen) -----
  /** Ein Papierstreifen wird an den Trennstellen geschnitten, die Teile rücken als Kette auseinander. */
  function streifen(feier, { stufe, sterne, ruhig }) {
    const n = feier.ziele?.[stufe];
    if (!Number.isInteger(n) || n < 2 || n > 8) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "streifen", "data-anzahl": n });
    svg.appendChild(tagGrund());
    const L = 30, R = 290, tb = (R - L - (n - 1) * 8) / n, voll = (R - L) / n, T = DAUER * 0.8;
    for (let i = 0; i < n; i++) {
      const ziel = L + i * (tb + 8), start = L + i * voll + (voll - tb) / 2, farbe = `var(--deko-${(i % 6) + 1})`;
      const g = s("g", { "data-stueck": "teil" }, s("rect", { x: ziel, y: 58, width: tb, height: 28, rx: 3, fill: "#ffffff", style: `stroke:${farbe}`, "stroke-width": 2.4 }),
        s("path", { d: `M${ziel + 6},${68} h${tb - 12} M${ziel + 6},${76} h${(tb - 12) * 0.6}`, stroke: "#c9cde0", "stroke-width": 2, "stroke-linecap": "round" }));
      // erst ein ganzer Streifen (Teile Kante an Kante), nach dem Schneiden rücken sie auseinander
      const w = s("g", ruhig ? {} : { transform: `translate(${start - ziel} 0)` }, g);
      if (!ruhig) w.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", from: `${start - ziel} 0`, to: "0 0", begin: t(T * 0.5), dur: "0.5s", fill: "freeze" }));
      svg.appendChild(w);
      if (i && !ruhig) svg.appendChild(kurz(bildzeichen(L + i * voll, 46, "✂️", 18), ((i - 1) * T * 0.5) / (n - 1), ((i - 1) * T * 0.5) / (n - 1) + 0.3, ruhig));
    }
    // Kettenglieder zwischen den Teilen
    for (let i = 1; i < n; i++) svg.appendChild(erscheine(s("line", { x1: L + i * (tb + 8) - 8, y1: 72, x2: L + i * (tb + 8), y2: 72, stroke: "#8a8fa8", "stroke-width": 2 }), T * 0.5 + 0.5, ruhig));
    svg.appendChild(erscheine(text(BREITE / 2, 120, n, { gross: 18, farbe: "#e5484d" }), T + 0.2, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 18, 18, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Tipp-Trainer (REISE · tastatur) -----
  /**
   * Tastatur ohne Beschriftung (Schweizer Anordnung: Zahlen, drei Buchstabenreihen, Leerschlag); die Eule läuft über die
   * Tasten der Stufe, sie leuchten nach: grund (Grundreihe), wort (eine Folge über die Reihen), satz (mit Leerschlag und
   * Punkt).
   */
  function tastatur(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!Array.isArray(z) || !z.length || z.length > 14 || !z.every(p => Array.isArray(p) && p.length === 2)) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "tastatur", "data-anzahl": z.length });
    svg.appendChild(tagGrund());
    // Tasten so gross, dass die Tastatur samt Rahmen ganz im Bild bleibt
    const REIHEN = [12, 11, 11, 10], k = 19, x0 = 36, y0 = 26, versatz = [0, 10, 14, 22];
    const taste = (r, i) => (r === 4 ? [x0 + 70, y0 + 4 * (k + 3), 130, k] : [x0 + versatz[r] + i * (k + 2), y0 + r * (k + 3), k, k]);
    svg.appendChild(s("rect", { x: x0 - 8, y: y0 - 8, width: 12 * (k + 2) + 14, height: 5 * (k + 3) + 12, rx: 8, fill: "#4f5668" }));
    for (let r = 0; r < 4; r++) for (let i = 0; i < REIHEN[r]; i++) { const [x, y, b, h] = taste(r, i); svg.appendChild(s("rect", { x, y, width: b, height: h, rx: 3, fill: "#e4e6ec" })); }
    { const [x, y, b, h] = taste(4, 0); svg.appendChild(s("rect", { x, y, width: b, height: h, rx: 3, fill: "#e4e6ec" })); }
    if (!z.every(([r, i]) => (r === 4 ? i === 0 : r >= 0 && r < 4 && i >= 0 && i < REIHEN[r]))) return null;
    const je = (DAUER * 0.8) / z.length, mitte = ([r, i]) => { const [x, y, b, h] = taste(r, i); return [x + b / 2, y + h / 2]; };
    z.forEach(([r, i], j) => { const [x, y, b, h] = taste(r, i); svg.appendChild(erscheine(s("rect", { x, y, width: b, height: h, rx: 3, style: "fill:var(--deko-4)", "data-stueck": "taste" }), j * je + 0.1, ruhig, 0.15)); });
    const weg = "M" + z.map(p => mitte(p).map((v, j) => (j ? v - 6 : v)).join(",")).join(" L"), [lx, ly] = mitte(z[z.length - 1]);
    svg.appendChild(bewege(s("g", {}, euleSitzend(0.16)), z.length > 1 ? weg : `M${lx},${ly - 30} L${lx},${ly - 6}`, { x: lx, y: ly - 6, winkel: 0 }, ruhig, { drehen: false, linear: true }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(24, 18, ruhig));
    return svg;
  }

  // ----- Geschichten-Ordner (BAUEN · bildstreifen) -----
  /** Bildstreifen der Stufe (3 bis 6 Bilder) in der richtigen Reihenfolge: die Eule baut Bild um Bild einen Schneemann. */
  function bildstreifen(feier, { stufe, sterne, ruhig }) {
    const n = feier.ziele?.[stufe];
    if (!Number.isInteger(n) || n < 3 || n > 6) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "bildstreifen", "data-anzahl": n });
    svg.appendChild(tagGrund());
    const fb = Math.min(60, 296 / n - 6), x0 = BREITE / 2 - (n * (fb + 6) - 6) / 2, y0 = 30, fh = fb * 1.3, je = (DAUER * 0.8) / n;
    // Stand je Bild: wie weit der Schneemann ist (bei weniger Bildern in grösseren Schritten bis fertig)
    const STUFEN = ["schnee", "kugel", "zwei", "kopf", "nase", "hut"];
    for (let i = 0; i < n; i++) {
      const st = Math.round((i * 5) / (n - 1)), x = x0 + i * (fb + 6), cx = x + fb / 2, boden0 = y0 + fh - 6, k = fb / 60;
      const g = s("g", { "data-stueck": "bild", "data-stand": STUFEN[st] }, s("rect", { x, y: y0, width: fb, height: fh, rx: 4, fill: "#e8f4fb", stroke: "#8ab4cc", "stroke-width": 1.4 }),
        s("rect", { x, y: boden0, width: fb, height: 6, fill: "#ffffff" }));
      for (const [fx, fy] of [[0.2, 0.15], [0.7, 0.25], [0.45, 0.4], [0.85, 0.55], [0.15, 0.6]]) g.appendChild(s("circle", { cx: x + fx * fb, cy: y0 + fy * fh, r: 1.6 * k, fill: "#ffffff" }));
      if (st >= 1) g.appendChild(s("circle", { cx, cy: boden0 - 12 * k, r: 12 * k, fill: "#ffffff", stroke: "#b8c4d6", "stroke-width": 1 }));
      if (st >= 2) g.appendChild(s("circle", { cx, cy: boden0 - 30 * k, r: 9 * k, fill: "#ffffff", stroke: "#b8c4d6", "stroke-width": 1 }));
      if (st >= 3) g.append(s("circle", { cx, cy: boden0 - 44 * k, r: 6.5 * k, fill: "#ffffff", stroke: "#b8c4d6", "stroke-width": 1 }), s("circle", { cx: cx - 2 * k, cy: boden0 - 45 * k, r: 0.9 * k, fill: "#2d3047" }), s("circle", { cx: cx + 2 * k, cy: boden0 - 45 * k, r: 0.9 * k, fill: "#2d3047" }));
      if (st >= 4) g.appendChild(s("path", { d: `M${cx},${boden0 - 43 * k} l${6 * k},${1.2 * k} l${-6 * k},${1.2 * k} Z`, fill: "#f0913a" }));
      if (st >= 5) g.append(s("rect", { x: cx - 5 * k, y: boden0 - 56 * k, width: 10 * k, height: 7 * k, fill: "#2d3047" }), s("rect", { x: cx - 7.5 * k, y: boden0 - 50 * k, width: 15 * k, height: 2 * k, fill: "#2d3047" }));
      g.appendChild(text(cx, y0 + fh + 14, i + 1, { gross: 11 }));
      svg.appendChild(vonOben(g, i * je, ruhig, 30, 0.35));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(24, 18, ruhig));
    return svg;
  }

  Object.assign(BILDER.bauen, { pizza, schoggi, prozent, mittelwert, steg, morphem, bildstreifen });
  BILDER.wachsen.diagramm = diagramm;
  Object.assign(BILDER.sammeln, { zufall, sortieren, kombinationen, reime, zwillinge, laternen, streifen });
  Object.assign(BILDER.reise, { abc, tastatur });
  BILDER.zoom.lupenzoom = lupenzoom;
  BILDER.auftritt = { silben, theater };
  BILDER.karte = { spurweg };

  // ---------- Bilder Block B: Deutsch Teil 2 (Sätze, Wortarten, Gedichte) und NMG Teil 1 (LERN_Session30) ----------
  // Wie Block A: jedes Bild folgt den Stufen seines Spiels und prüft, was es zeigt. Deutsch ohne Lesetext: Wörter als
  // leere Kärtchen; Zeichen nur, wo sie selbst der Inhalt sind (Satzzeichen, Kommas, Fragewörter des Verben-Fächers,
  // Reimschema, Hilfsverben). Bildzeichen (Emoji) wie in den Inhaltslisten der Spiele.

  /** Leeres Wortkärtchen: Rahmen und zwei Striche statt Buchstaben. */
  const leerKarte = (x, y, b, h, { rand = "#8a8fa8", grund = "#ffffff", breit = 1.6 } = {}) => s("g", {},
    s("rect", { x, y, width: b, height: h, rx: 3, fill: grund, style: `stroke:${rand}`, "stroke-width": breit }),
    s("path", { d: `M${x + 4},${y + h / 2 - 2} h${Math.max(2, b - 8)} M${x + 4},${y + h / 2 + 2.5} h${Math.max(2, (b - 8) * 0.6)}`, stroke: "#c9cde0", "stroke-width": 1.4, "stroke-linecap": "round" }));
  const LAENGEN = [1, 0.7, 1.3, 0.9, 1.1, 0.8, 1.2, 1, 0.75, 1.25, 0.95, 1.05];
  /** Breiten von n Wortkärtchen in einer Zeile der Breite b mit Abstand a — verschieden lang wie Wörter. */
  function wortBreiten(n, b, a = 4) {
    const l = [...Array(n).keys()].map(i => LAENGEN[i % LAENGEN.length]), summe = l.reduce((p, q) => p + q, 0);
    return l.map(v => ((b - (n - 1) * a) * v) / summe);
  }
  /** Ein Teil steht am Ziel und kommt um dx, dy versetzt herein (im ruhigen Bild gleich am Ziel). */
  function herein(e, dx, dy, ab, ruhig, dauer = 0.4) {
    const w = s("g", {}, e);
    if (ruhig) return w;
    w.setAttribute("transform", `translate(${dx} ${dy})`);
    w.setAttribute("opacity", "0");
    w.append(s("set", { attributeName: "opacity", to: 1, begin: t(ab), fill: "freeze" }),
      s("animateTransform", { attributeName: "transform", type: "translate", from: `${dx} ${dy}`, to: "0 0", begin: t(ab), dur: `${dauer}s`, fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }));
    return w;
  }
  /** Ankunftszeiten an den Punkten eines Wegs, den animateMotion gleichmässig (nach der Länge, „paced“) abfährt. */
  function ankunft(punkte, dauer) {
    const l = [0];
    for (let i = 1; i < punkte.length; i++) l.push(l[i - 1] + Math.hypot(punkte[i][0] - punkte[i - 1][0], punkte[i][1] - punkte[i - 1][1]));
    const ges = l[l.length - 1] || 1;
    return l.map(v => (v / ges) * dauer);
  }
  const haken = (x, y, gross = 14) => text(x, y, "✓", { gross, farbe: "#2fbf71" });
  const kreuz = (x, y, gross = 14) => text(x, y, "✗", { gross, farbe: "#ff9f1c" });
  const GUT = "#2fbf71", HINWEIS = "#ff9f1c", KNOPF = "#5b6cff"; // wie --gut, --hinweis, --knopf in stil.css

  // ----- Satz-Reparatur (BAUEN · satzzug) -----
  /**
   * Je Satz ein Zug aus leeren Wortwagen, gross geschriebene Wörter mit einem Dach (deko-3), am Schluss ein Wagen mit dem
   * Satzzeichen. Angabe: Liste von { woerter, zeichen: "." | "?" | "!", gross? } (gross: Stellen der grossen Wörter, die
   * erste immer dabei).
   */
  function satzzug(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    const ok = zg => zg && Number.isInteger(zg.woerter) && zg.woerter >= 2 && zg.woerter <= 10 && [".", "?", "!"].includes(zg.zeichen)
      && (zg.gross ?? [0]).every(i => Number.isInteger(i) && i >= 0 && i < zg.woerter) && (zg.gross ?? [0]).includes(0);
    if (!Array.isArray(z) || !z.length || z.length > 3 || !z.every(ok)) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "satzzug", "data-anzahl": z.length });
    svg.append(tagGrund(), boden());
    const zh = 114 / z.length, h = Math.min(32, zh - 16), T = DAUER * 0.8, alle = z.reduce((a, zg) => a + zg.woerter + 1, 0), je = T / alle;
    let k = 0;
    z.forEach((zg, r) => {
      const y = 12 + r * zh + (zh - h - 6) / 2, n = zg.woerter + 1, wb = Math.min(40, (284 - (n - 1) * 5) / n), x0 = BREITE / 2 - (n * wb + (n - 1) * 5) / 2; // mittig
      const zug = s("g", { "data-stueck": "zug", "data-zeichen": zg.zeichen, "data-woerter": zg.woerter });
      zug.appendChild(s("line", { x1: 10, y1: y + h + 6, x2: 310, y2: y + h + 6, stroke: "#6b4a2b", "stroke-width": 1.4 }));
      for (let i = 0; i < n; i++) {
        const x = x0 + i * (wb + 5), schluss = i === n - 1, w = s("g", {});
        if (i) w.appendChild(s("line", { x1: x - 5, y1: y + h * 0.6, x2: x, y2: y + h * 0.6, stroke: "#2d3047", "stroke-width": 1.4 }));
        if (schluss) w.append(s("rect", { x, y, width: wb, height: h, rx: 4, fill: "#fff8e1", stroke: "#f5b301", "stroke-width": 2 }),
          text(x + wb / 2, y + h / 2 + Math.min(18, h) * 0.36, zg.zeichen, { gross: Math.min(18, h), farbe: "#2d3047" }));
        else {
          w.appendChild(leerKarte(x, y, wb, h, { rand: KNOPF, grund: "#eef0ff" }));
          if ((zg.gross ?? [0]).includes(i)) w.appendChild(s("rect", { x: x + 2, y: y - 5, width: wb - 4, height: 5, rx: 2, style: "fill:var(--deko-3)", "data-gross": i }));
        }
        w.append(s("circle", { cx: x + wb * 0.28, cy: y + h + 3, r: 2.6, fill: "#2d3047" }), s("circle", { cx: x + wb * 0.72, cy: y + h + 3, r: 2.6, fill: "#2d3047" }));
        zug.appendChild(herein(w, -36, 0, k++ * je, ruhig, 0.35));
      }
      svg.appendChild(zug);
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 131, ruhig));
    return svg;
  }

  // ----- Wörter-Trenner (SAMMELN · girlande) -----
  /** Die Schlange ohne Lücken wird an den Wortgrenzen geschnitten (orange wie im Spiel); die Wörter hängen als Fähnchen. */
  function girlande(feier, { stufe, sterne, ruhig }) {
    const n = feier.ziele?.[stufe];
    if (!Number.isInteger(n) || n < 2 || n > 16) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "girlande", "data-anzahl": n });
    svg.appendChild(tagGrund());
    const L = 16, R = 304, br = wortBreiten(n, R - L, 0), T = DAUER * 0.8;
    const schlange = s("g", {}, s("rect", { x: L, y: 18, width: R - L, height: 18, rx: 3, fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 1.4 }));
    for (let x = L + 5; x < R - 3; x += 7) schlange.appendChild(s("line", { x1: x, y1: 23, x2: x, y2: 31, stroke: "#c9cde0", "stroke-width": 1.6, "stroke-linecap": "round" }));
    svg.appendChild(verschwinde(schlange, T * 0.55, ruhig));
    let x = L;
    for (let i = 1; i < n; i++) {
      x += br[i - 1];
      svg.appendChild(kurz(s("line", { x1: x, y1: 14, x2: x, y2: 40, stroke: HINWEIS, "stroke-width": 2.4, "stroke-linecap": "round" }), ((i - 1) * T * 0.5) / (n - 1), T * 0.6, ruhig));
    }
    const bogen = u => [L + u * (R - L), 56 + 34 * (1 - (2 * u - 1) ** 2)];
    svg.appendChild(erscheine(s("path", { d: `M${L},56 Q160,124 ${R},56`, fill: "none", stroke: "#8a8fa8", "stroke-width": 1.4 }), T * 0.55, ruhig));
    x = L;
    br.forEach((b, i) => {
      const [x1, y1] = bogen((x - L) / (R - L)), [x2, y2] = bogen((x + b - L) / (R - L));
      const fahn = s("path", { d: `M${x1 + 1},${y1} L${x2 - 1},${y2} L${(x1 + x2) / 2},${(y1 + y2) / 2 + Math.min(28, 10 + b * 0.5)} Z`, style: `fill:var(--deko-${(i % 6) + 1})`, stroke: "#2d3047", "stroke-width": 0.6, "data-stueck": "wort" });
      svg.appendChild(vonOben(fahn, T * 0.55 + (i * T * 0.45) / n, ruhig, 30, 0.3));
      x += b;
    });
    svg.appendChild(erscheine(text(BREITE / 2, 140, n, { gross: 14, farbe: "#e5484d" }), T + 0.2, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 52, ruhig));
    if (sterne >= 3) svg.appendChild(funken(24, 110, ruhig));
    return svg;
  }

  // ----- Fehler-Lupe (ZOOM · fehlersuche) -----
  /**
   * Sätze als leere Wortkärtchen; die Lupe geht Wort um Wort und bleibt beim Fehler (genau einer je Satz, wie im Spiel):
   * er leuchtet gelb auf und wird grün repariert. Ein fehlerfreier Satz (s6) bekommt am Ende einen Haken.
   * Angabe: Liste von { woerter, fehler } (fehler: Stelle oder null).
   */
  function fehlersuche(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    const ok = sz => sz && Number.isInteger(sz.woerter) && sz.woerter >= 3 && sz.woerter <= 12 && (sz.fehler === null || (Number.isInteger(sz.fehler) && sz.fehler >= 0 && sz.fehler < sz.woerter));
    if (!Array.isArray(z) || !z.length || z.length > 2 || !z.every(ok) || !z.some(sz => sz.fehler !== null)) return null;
    const svg = neuesBild("zoom", stufe, { "data-bilder": "fehlersuche", "data-anzahl": z.filter(sz => sz.fehler !== null).length });
    svg.appendChild(tagGrund());
    const T = DAUER * 0.85, weg = [], spaeter = [];
    z.forEach((sz, r) => {
      const y = z.length === 1 ? 62 : 40 + r * 50, br = wortBreiten(sz.woerter, 270);
      let x = 18;
      br.forEach((b, i) => {
        svg.appendChild(leerKarte(x, y, b, 22));
        if (sz.fehler === null || i <= sz.fehler) weg.push({ x: x + b / 2, y: y + 11, fehler: i === sz.fehler, rahmen: [x, y, b] });
        x += b + 4;
      });
      if (sz.fehler === null) spaeter.push(y);
    });
    // Weg der Lupe: Wort um Wort (bei nur einem Wort von oben her), am Ende hebt sie ab und gibt das Wort frei
    const letzt = weg[weg.length - 1], punkte = [...(weg.length > 1 ? [] : [[letzt.x, letzt.y - 30]]), ...weg.map(p => [p.x, p.y]), [Math.min(letzt.x + 22, 296), letzt.y - 24]];
    const zeiten = ankunft(punkte, T), versatz = weg.length > 1 ? 0 : 1;
    weg.forEach((p, i) => {
      if (!p.fehler) return;
      const [x, y, b] = p.rahmen, ab = zeiten[i + versatz];
      svg.append(erscheine(s("rect", { x, y, width: b, height: 22, rx: 3, fill: "#fff1c2", stroke: "#f5b301", "stroke-width": 2 }), ab, ruhig, 0.2),
        erscheine(s("g", { "data-stueck": "fehler" }, s("rect", { x, y, width: b, height: 22, rx: 3, fill: "#d9f5e5", stroke: GUT, "stroke-width": 2 }), haken(x + b / 2, y + 16, 13)), ab + 0.45, ruhig, 0.25));
    });
    for (const y of spaeter) svg.appendChild(erscheine(haken(304, y + 16, 16), T + 0.3, ruhig));
    const [ex, ey] = punkte[punkte.length - 1];
    svg.appendChild(bewege(s("g", {}, s("g", { transform: "scale(0.8)" }, lupe())), "M" + punkte.map(p => p.join(",")).join(" L"), { x: ex, y: ey, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Komma-Jagd (SAMMELN · kommas) -----
  /**
   * Sätze als leere Wortkärtchen mit kleinen grauen Lücken wie im Spiel; die Kommas fliegen in ihre Lücken (blau wie
   * gesetzt) und werden grün. Ein Satz ohne Komma bekommt einen Haken. Angabe: Liste von { woerter, kommas: [Stellen] } —
   * ein Komma an Stelle i steht zwischen Wort i − 1 und Wort i.
   */
  function kommas(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    const ok = sz => sz && Number.isInteger(sz.woerter) && sz.woerter >= 3 && sz.woerter <= 12 && Array.isArray(sz.kommas)
      && sz.kommas.every((p, i) => Number.isInteger(p) && p >= 1 && p < sz.woerter && (!i || p > sz.kommas[i - 1]));
    if (!Array.isArray(z) || !z.length || z.length > 2 || !z.every(ok)) return null;
    const anzahl = z.reduce((a, sz) => a + sz.kommas.length, 0);
    if (!anzahl) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "kommas", "data-anzahl": anzahl });
    svg.appendChild(tagGrund());
    const T = DAUER * 0.8, je = T / anzahl;
    let k = 0;
    z.forEach((sz, r) => {
      const y = z.length === 1 ? 62 : 38 + r * 52, br = wortBreiten(sz.woerter, 290, 16);
      let x = 15;
      br.forEach((b, i) => {
        svg.appendChild(leerKarte(x, y, b, 22));
        if (i < sz.woerter - 1) {
          const lx = x + b + 8;
          svg.appendChild(s("line", { x1: lx, y1: y + 16, x2: lx, y2: y + 22, stroke: "#c9cde0", "stroke-width": 1.6, "stroke-linecap": "round" }));
          if (sz.kommas.includes(i + 1)) {
            svg.appendChild(vonOben(text(lx, y + 21, ",", { gross: 34, farbe: KNOPF }), k * je, ruhig, 50, 0.35));
            svg.appendChild(erscheine(s("g", { "data-stueck": "komma" }, text(lx, y + 21, ",", { gross: 34, farbe: GUT })), k * je + 0.5, ruhig, 0.2));
            k++;
          }
        }
        x += b + 16;
      });
      if (!sz.kommas.length) svg.appendChild(erscheine(haken(160, y + 44, 16), T + 0.2, ruhig));
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 20, ruhig));
    return svg;
  }

  // ----- Rede-Zeichen (AUFTRITT · rede) -----
  // Begleitsatz (B) und Rede (R) als Kästchen wie im Spiel, dazwischen die Zeichen der wörtlichen Rede.
  const AUF = "„", ZU = "“";
  const REDE = {
    vorne: zc => ["B", ":", AUF, "R", zc, ZU],
    // „Ich komme“, sagt er. — „Kommst du?“, fragt sie. (das Komma steht auch nach ? und !)
    hinten: zc => [AUF, "R", ...(zc === "." ? [] : [zc]), ZU, ",", "B", "."],
    // „Ich komme“, sagt er, „gleich nach Hause.“
    mitte: zc => [AUF, "R", ZU, ",", "B", ",", AUF, "R", zc, ZU],
  };
  /**
   * Angabe: Liste von { art: "vorne" | "hinten" | "mitte", zeichen: "." | "?" | "!" } oder { art: "erkennen", woerter,
   * rede: [Stellen] } (s1: die gesprochenen Wörter leuchten auf). Die Kästchen erscheinen, dann fallen die Zeichen ein.
   */
  function rede(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    const ok = r => r && ((REDE[r.art] && [".", "?", "!"].includes(r.zeichen))
      || (r.art === "erkennen" && Number.isInteger(r.woerter) && r.woerter >= 3 && r.woerter <= 9 && Array.isArray(r.rede) && r.rede.length && r.rede.every(i => Number.isInteger(i) && i >= 0 && i < r.woerter)));
    if (!Array.isArray(z) || !z.length || z.length > 2 || !z.every(ok)) return null;
    const folgen = z.map(r => (r.art === "erkennen" ? null : REDE[r.art](r.zeichen)));
    const anzahl = z.reduce((a, r, i) => a + (folgen[i] ? folgen[i].filter(x => x !== "B" && x !== "R").length : r.rede.length), 0);
    const svg = neuesBild("auftritt", stufe, { "data-bilder": "rede", "data-anzahl": anzahl });
    svg.appendChild(tagGrund());
    const T = DAUER * 0.8, je = (T * 0.75) / anzahl;
    let k = 0;
    z.forEach((r, zeile) => {
      const y = z.length === 1 ? 60 : 36 + zeile * 54;
      if (!folgen[zeile]) {
        const br = wortBreiten(r.woerter, 280);
        let x = 20;
        br.forEach((b, i) => {
          svg.appendChild(leerKarte(x, y, b, 24));
          if (r.rede.includes(i)) svg.appendChild(erscheine(s("g", { "data-stueck": "rede" }, leerKarte(x, y, b, 24, { grund: "#ffe9c7", rand: "var(--deko-2)", breit: 2 })), T * 0.25 + k++ * je, ruhig, 0.25));
          x += b + 4;
        });
        return;
      }
      const folge = folgen[zeile], breite = x0 => (x0 === "B" ? 50 : x0 === "R" ? 58 : 12), ges = folge.reduce((a, x0) => a + breite(x0) + 2, -2);
      let x = BREITE / 2 - ges / 2;
      folge.forEach(x0 => {
        const b = breite(x0);
        if (x0 === "B") svg.appendChild(erscheine(leerKarte(x, y, b, 24, { grund: "#e8ecff", rand: "var(--deko-6)", breit: 2 }), 0, ruhig));
        else if (x0 === "R") svg.appendChild(erscheine(leerKarte(x, y, b, 24, { grund: "#ffffff", rand: "var(--deko-2)", breit: 2 }), 0.1, ruhig));
        else {
          const unten = x0 === AUF || x0 === "," || x0 === ".";
          svg.appendChild(vonOben(s("g", { "data-stueck": "zeichen", "data-zeichen": x0 }, text(x + b / 2, x0 === AUF ? y + 30 : unten ? y + 23 : x0 === ZU ? y + 12 : y + 20, x0, { gross: 18, farbe: "#2d3047" })), T * 0.25 + k++ * je, ruhig, 40, 0.3));
        }
        x += b + 2;
      });
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 20, ruhig));
    return svg;
  }

  // ----- Korrektur-Stift (BAUEN · korrektur) -----
  /**
   * Ein Text im Kasten (#fffdf5 wie im Spiel) aus leeren Wörtern, Satz um Satz mit Punkt; der Stift geht zu den Fehlern,
   * jeder leuchtet gelb auf und wird grün. Angabe: { saetze: 3–7, fehler: 1–5 }; unten die Zahl der Verbesserungen.
   */
  function korrektur(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Number.isInteger(z.saetze) || z.saetze < 3 || z.saetze > 7 || !Number.isInteger(z.fehler) || z.fehler < 1 || z.fehler > 5) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "korrektur", "data-anzahl": z.fehler });
    svg.appendChild(tagGrund());
    // Wörter je Satz verschieden, Zeilen bis zum rechten Rand; Zeilenhöhe nach der Zahl der Zeilen, der Kasten so hoch
    // wie der Text
    const LAENGE = [5, 6, 4, 7, 5, 6, 4], woerter = [];
    for (let sz = 0; sz < z.saetze; sz++) for (let i = 0; i < LAENGE[sz]; i++) woerter.push({ b: 18 + 16 * LAENGEN[(sz * 3 + i) % LAENGEN.length], ende: i === LAENGE[sz] - 1 });
    const platz = [];
    let x = 28, zeile = 0;
    for (const w of woerter) { if (x + w.b > 292) { x = 28; zeile++; } platz.push([x, zeile]); x += w.b + (w.ende ? 9 : 4); }
    const zh = Math.min(22, 104 / (zeile + 1)), y0 = Math.max(16, 66 - ((zeile + 1) * zh) / 2), T = DAUER * 0.85;
    svg.appendChild(s("rect", { x: 18, y: y0 - 8, width: 284, height: (zeile + 1) * zh + 10, rx: 6, fill: "#fffdf5", stroke: "#d9cdb0", "stroke-width": 1.4 }));
    const stellen = [...Array(z.fehler).keys()].map(k => Math.floor(((k + 0.5) * woerter.length) / z.fehler));
    woerter.forEach((w, i) => {
      const [wx, r] = platz[i], y = y0 + r * zh;
      svg.appendChild(s("rect", { x: wx, y, width: w.b, height: zh * 0.62, rx: 2, fill: "#e4e6ec" }));
      if (w.ende) svg.appendChild(s("circle", { cx: wx + w.b + 3, cy: y + zh * 0.55, r: 1.4, fill: "#2d3047" }));
    });
    const weg = stellen.map(i => { const [wx, r] = platz[i]; return [wx + woerter[i].b / 2, y0 + r * zh + zh * 0.31]; });
    const zeiten = weg.length > 1 ? ankunft(weg, T) : [T]; // der Stift fährt gleichmässig: Ankunft nach der Weglänge
    stellen.forEach((i, k) => {
      const [wx, r] = platz[i], y = y0 + r * zh, ab = zeiten[k];
      svg.append(erscheine(s("rect", { x: wx - 1, y: y - 1, width: woerter[i].b + 2, height: zh * 0.62 + 2, rx: 2, fill: "#fff1c2", stroke: "#f5b301", "stroke-width": 1.4 }), ab, ruhig, 0.2),
        erscheine(s("rect", { x: wx - 1, y: y - 1, width: woerter[i].b + 2, height: zh * 0.62 + 2, rx: 2, fill: "#d9f5e5", stroke: GUT, "stroke-width": 1.4, "data-stueck": "fehler" }), ab + 0.4, ruhig, 0.2));
    });
    const [lx, ly] = weg[weg.length - 1];
    svg.appendChild(bewege(s("g", {}, bildzeichen(8, -10, "✏️", 18)), weg.length > 1 ? "M" + weg.map(p => p.join(",")).join(" L") : `M${lx},${ly - 30} L${lx},${ly}`, { x: lx, y: ly, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T }));
    svg.appendChild(erscheine(s("g", {}, haken(146, 142, 15), text(170, 142, z.fehler, { gross: 15, farbe: GUT })), T + 0.4, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 138, ruhig));
    if (sterne >= 3) svg.appendChild(funken(40, 128, ruhig));
    return svg;
  }

  // ----- Wortarten-Sortierer (SAMMELN · wortkoerbe) -----
  /**
   * Die drei Körbe des Spiels (Nomen 🏠 deko-6, Verb 🏃 deko-3, Adjektiv 🎨 deko-5); Wortkärtchen fliegen hinein, am Ende
   * die Zahl je Korb. Angabe: { koerbe: [N, V, A], aus: "karte" | "satz", jeSatz? } — aus dem Satz: das markierte
   * Wort (gelb wie im Spiel) fliegt aus dem Satzstreifen; jeSatz: so viele Wörter nacheinander aus einem Satz (s6).
   */
  function wortkoerbe(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.koerbe) || z.koerbe.length !== 3 || !z.koerbe.every(n => Number.isInteger(n) && n >= 0 && n <= 4) || !["karte", "satz"].includes(z.aus)) return null;
    const summe = z.koerbe.reduce((a, b) => a + b, 0);
    if (!summe || summe > 10) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "wortkoerbe", "data-anzahl": summe });
    svg.appendChild(tagGrund());
    const KORB = [["🏠", "var(--deko-6)", 60], ["🏃", "var(--deko-3)", 160], ["🎨", "var(--deko-5)", 260]];
    // Reihenfolge der Karten: reihum Nomen, Verb, Adjektiv
    const folge = [], rest = [...z.koerbe];
    while (folge.length < summe) for (let k = 0; k < 3; k++) if (rest[k]) { folge.push(k); rest[k]--; }
    const satzX = i => 40 + i * 42;
    if (z.aus === "satz") for (let i = 0; i < 6; i++) svg.appendChild(leerKarte(satzX(i) - 18, 12, 36, 16));
    const T = DAUER * 0.8, je = T / summe, zaehler = [0, 0, 0];
    // erst die Körbe, dann die Karten: sie stecken im Korb und schauen oben heraus
    KORB.forEach(([bild, farbe, kx], k) => {
      svg.append(s("path", { d: `M${kx - 30},${104} L${kx + 30},${104} L${kx + 24},${138} L${kx - 24},${138} Z`, fill: "#ffffff", style: `stroke:${farbe}`, "stroke-width": 2.4 }),
        bildzeichen(kx - 12, 124, bild, 15), erscheine(text(kx + 12, 129, z.koerbe[k], { gross: 14, farbe: "#2d3047" }), T + 0.3, ruhig));
    });
    folge.forEach((k, j) => {
      const [, farbe, kx] = KORB[k], n = zaehler[k]++, zx = kx - 15, zy = 98 - n * 7;
      const sx = z.aus === "satz" ? satzX(z.jeSatz ? (Math.floor(j / z.jeSatz) * 2 + (j % z.jeSatz)) % 6 : (j * 2) % 6) - 15 : 145, sy = z.aus === "satz" ? 15 : 22;
      if (z.aus === "satz") svg.appendChild(kurz(s("rect", { x: sx - 3, y: 12, width: 36, height: 16, rx: 3, fill: "#fff1c2", stroke: "#f5b301", "stroke-width": 1.6 }), j * je, j * je + 0.45, ruhig));
      svg.appendChild(herein(s("g", { "data-stueck": "wort" }, leerKarte(zx, zy, 30, 12, { rand: farbe, breit: 1.4 })), sx - zx, sy - zy, j * je + 0.1, ruhig, 0.45));
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 26, 60, ruhig));
    return svg;
  }

  // ----- Nomen-Puzzle (BAUEN · wortpuzzle) -----
  /**
   * Bildkarten der Teile wie im Spiel (Bild aus der Liste), dazwischen + und =, darunter das zusammengesetzte Nomen als
   * ein Puzzle. Angabe: { teile: [Bild …] (2–3), art: "zusammen" | "zerlegen" | "legen", fuge?: "n" | "e" | "s",
   * artikel?: [Artikel je Teil], ganz?: Artikel } — der Artikel des Ganzen ist der des letzten Teils (Grundwort, geprüft).
   */
  function wortpuzzle(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], ART = ["der", "die", "das"];
    if (!z || !Array.isArray(z.teile) || z.teile.length < 2 || z.teile.length > 3 || !["zusammen", "zerlegen", "legen"].includes(z.art)) return null;
    if (z.fuge !== undefined && !["n", "e", "s"].includes(z.fuge)) return null;
    if (z.artikel && (!Array.isArray(z.artikel) || z.artikel.length !== z.teile.length || !z.artikel.every(a => ART.includes(a)) || z.ganz !== z.artikel[z.artikel.length - 1])) return null;
    const n = z.teile.length, svg = neuesBild("bauen", stufe, { "data-bilder": "wortpuzzle", "data-anzahl": n, "data-wert": z.ganz || "" });
    svg.appendChild(tagGrund());
    const kb = 44, kh = 40, fb = z.fuge ? 14 : 0, T = DAUER * 0.8;
    // oben die einzelnen Teile mit + (bei „zerlegen“ unten), unten das Ganze aus aneinander gefügten Teilen
    const einzelY = z.art === "zerlegen" ? 92 : 16, ganzY = z.art === "zerlegen" ? 16 : 92, abstand = 22;
    const einzelX = i => BREITE / 2 - (n * kb + (n - 1) * abstand) / 2 + i * (kb + abstand);
    const ganzB = n * kb + fb, ganzX = i => BREITE / 2 - ganzB / 2 + i * kb + (i >= 1 && z.fuge ? fb : 0);
    const karte = (x, y, bild, i) => s("g", { "data-stueck": "teil", "data-bild": bild },
      s("rect", { x, y, width: kb, height: kh, rx: 5, fill: "#ffffff", style: `stroke:var(--deko-${(i % 6) + 1})`, "stroke-width": 2 }),
      i < n - 1 ? s("circle", { cx: x + kb, cy: y + kh / 2, r: 5, fill: "#ffffff", style: `stroke:var(--deko-${(i % 6) + 1})`, "stroke-width": 2 }) : null,
      bildzeichen(x + kb / 2, y + kh / 2, bild, 24));
    // oben: die Teile (bei „legen“ erst vertauscht, dann an ihrem Platz)
    for (let i = 0; i < n; i++) {
      const x = einzelX(i);
      if (z.art !== "zerlegen") {
        const von = z.art === "legen" ? einzelX(n - 1 - i) - x : 0;
        svg.appendChild(herein(s("g", {}, s("rect", { x, y: einzelY, width: kb, height: kh, rx: 5, fill: "#f4f5fa", stroke: "#c9cde0", "stroke-width": 1.4 }), bildzeichen(x + kb / 2, einzelY + kh / 2, z.teile[i], 24)), von, 0, 0, ruhig, 0.5));
      } else svg.appendChild(erscheine(karte(x, einzelY, z.teile[i], i), T * 0.5 + i * 0.15, ruhig));
      if (i < n - 1) svg.appendChild(erscheine(text(x + kb + abstand / 2, einzelY + kh / 2 + 6, "+", { gross: 16 }), z.art === "zerlegen" ? T * 0.6 : 0.1, ruhig));
      if (z.artikel) svg.appendChild(erscheine(text(x + kb / 2, einzelY - (z.art === "zerlegen" ? 3 : -kh - 11), z.artikel[i], { gross: 10, farbe: i === n - 1 ? "#e5484d" : "#6b7089" }), 0.2, ruhig));
    }
    // das Ganze: Teile fügen sich zusammen (bei „zerlegen“ steht es von Anfang an da)
    for (let i = 0; i < n; i++) {
      const x = ganzX(i), k = karte(x, ganzY, z.teile[i], i);
      if (z.art === "zerlegen") { k.removeAttribute("data-stueck"); svg.appendChild(k); }
      else svg.appendChild(herein(k, einzelX(i) - x, einzelY - ganzY, T * 0.35 + i * 0.2, ruhig, 0.5));
    }
    if (z.fuge) svg.appendChild(erscheine(s("g", { "data-fuge": z.fuge }, s("rect", { x: ganzX(0) + kb, y: ganzY + 8, width: fb, height: kh - 16, rx: 3, style: "fill:var(--deko-1)" }),
      text(ganzX(0) + kb + fb / 2, ganzY + kh / 2 + 4, z.fuge, { gross: 12, farbe: "#ffffff" })), z.art === "zerlegen" ? 0 : T * 0.35 + n * 0.2 + 0.3, ruhig));
    if (z.ganz) svg.appendChild(erscheine(text(ganzX(0) - 16, ganzY + kh / 2 + 4, z.ganz, { gross: 12, farbe: "#e5484d", anker: "end" }), T + 0.2, ruhig));
    if (z.art !== "zerlegen") svg.appendChild(erscheine(text(BREITE / 2, 76, "=", { gross: 16 }), T * 0.3, ruhig));
    else svg.appendChild(erscheine(text(BREITE / 2, 76, "=", { gross: 16 }), 0, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 20, ruhig));
    return svg;
  }

  // ----- Zeitreise-Verben (REISE · zeitband) -----
  // Das Zielband des Spiels (deko-1): früher ⏳ links (Präteritum, Perfekt), jetzt 🕐 rechts (Präsens).
  const ZONEN = { praeteritum: [24, 112, "Präteritum"], perfekt: [116, 204, "Perfekt"], praesens: [208, 296, "Präsens"] };
  /**
   * Das Verb (gelb markiert wie im Spiel) reist auf dem Band in seine Zeit; im Perfekt kommt das Hilfsverb dazu (Lücke in
   * --knopf). Angabe: { ziel, von?, hilfsverb?: "hat" | "ist", wahl? } — von: erst dort erkannt (Schritt 1), dann gebildet
   * (Schritt 2, s6); wahl: hat und ist stehen zur Wahl, das passende bleibt (s5).
   */
  function zeitband(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !ZONEN[z.ziel] || (z.von !== undefined && !ZONEN[z.von]) || (z.ziel === "perfekt") !== ["hat", "ist"].includes(z.hilfsverb) || (z.wahl && z.ziel !== "perfekt")) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "zeitband", "data-ziel": z.ziel, "data-wert": z.hilfsverb || "" });
    svg.appendChild(tagGrund());
    svg.append(s("rect", { x: 20, y: 100, width: 280, height: 24, rx: 6, style: "fill:var(--deko-1)" }), s("line", { x1: 206, y1: 98, x2: 206, y2: 126, stroke: "#ffffff", "stroke-width": 2.4 }),
      s("line", { x1: 114, y1: 102, x2: 114, y2: 122, stroke: "#ffffff", "stroke-width": 1, "stroke-dasharray": "3 2" }),
      bildzeichen(68, 140, "⏳", 12), bildzeichen(160, 140, "⏳", 12), bildzeichen(252, 140, "🕐", 12));
    for (const [a, b, name] of Object.values(ZONEN)) svg.appendChild(text((a + b) / 2, 116, name, { gross: 10, farbe: "#ffffff" }));
    const mitte = k => (ZONEN[k][0] + ZONEN[k][1]) / 2, T = DAUER * 0.8, vb = 42;
    const verb = s("g", { "data-stueck": "verb" }, leerKarte(-vb / 2, -10, vb, 20, { grund: "#fff1c2", rand: "#f5b301", breit: 2 }));
    const startX = z.von ? mitte(z.von) : 160, startY = z.von ? 86 : 30, zielX = mitte(z.ziel) + (z.ziel === "perfekt" ? 12 : 0), zielY = 86;
    // Schritt 1 (erkennen): erst in der Zeit, in der es steht; Schritt 2: von dort in die neue Zeit
    if (z.von) {
      svg.appendChild(erscheine(s("g", {}, s("circle", { cx: mitte(z.von), cy: 62, r: 8, style: "fill:var(--deko-4)" }), text(mitte(z.von), 66, "1", { gross: 11 })), 0, ruhig));
      svg.appendChild(erscheine(s("g", {}, s("circle", { cx: mitte(z.ziel), cy: 62, r: 8, style: "fill:var(--deko-4)" }), text(mitte(z.ziel), 66, "2", { gross: 11 })), T * 0.5, ruhig));
    }
    const ab = z.von ? T * 0.4 : 0.1;
    svg.appendChild(bewege(verb, `M${startX},${startY} C${startX},${startY + 30} ${zielX},${zielY - 40} ${zielX},${zielY}`, { x: zielX, y: zielY, winkel: 0 }, ruhig, { drehen: false, ab, dauer: T * 0.5 }));
    if (z.ziel === "perfekt") {
      const hx = zielX - vb / 2 - 18;
      if (z.wahl) {
        const anders = z.hilfsverb === "hat" ? "ist" : "hat";
        svg.appendChild(verschwinde(s("g", {}, s("rect", { x: 220, y: 22, width: 30, height: 18, rx: 4, fill: "#e4e6ec" }), text(235, 35, anders, { gross: 11 })), T * 0.7, ruhig));
        // die gewählte Karte liegt bereit, bis sie zum Verb fliegt
        svg.appendChild(kurz(s("g", {}, s("rect", { x: 70, y: 22, width: 30, height: 18, rx: 4, fill: "#e4e6ec" }), text(85, 35, z.hilfsverb, { gross: 11, farbe: "#8a8fa8" })), 0, ab + T * 0.5, ruhig));
      }
      svg.appendChild(herein(s("g", { "data-stueck": "hilfsverb" }, s("rect", { x: hx - 15, y: zielY - 10, width: 30, height: 20, rx: 4, fill: KNOPF }), text(hx, zielY + 4, z.hilfsverb, { gross: 11, farbe: "#ffffff" })),
        z.wahl ? 85 - hx : 0, z.wahl ? 31 - zielY : -30, ab + T * 0.5, ruhig, 0.4));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 20, ruhig));
    return svg;
  }

  // ----- Verben-Fächer (BAUEN · faecher) -----
  const FRAGEN_FAECHER = ["Wer?", "Wen?", "Wem?", "Wo?", "Wohin?"];
  /**
   * Der Fächer des Spiels: am Griff (deko-6) das Verb, die Blätter öffnen sich mit den Fragen der Stufe. Angabe:
   * { fragen: [Frage …], falsch?: 0–2, zeit?: "praesens" | "praeteritum" | "perfekt" } — ohne Fragen (s1): das Verb
   * wird im Satz gefunden und fliegt an den Griff; falsch: Wortkarten, die nicht passen, fallen weg.
   */
  function faecher(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.fragen) || z.fragen.length > 5 || !z.fragen.every(f => FRAGEN_FAECHER.includes(f)) || new Set(z.fragen).size !== z.fragen.length) return null;
    if ((z.falsch ?? 0) < 0 || (z.falsch ?? 0) > 2 || (z.zeit !== undefined && !ZONEN[z.zeit])) return null;
    const n = z.fragen.length, svg = neuesBild("bauen", stufe, { "data-bilder": "faecher", "data-anzahl": n || 1 });
    svg.appendChild(tagGrund());
    const px = 160, py = 128, T = DAUER * 0.8;
    // Blätter von links nach rechts, je 32° auseinander (der Fächer geht so weit auf, wie er Blätter hat)
    const spreiz = Math.min(128, (n - 1) * 32), winkel = i => (n > 1 ? -spreiz / 2 + (spreiz * i) / (n - 1) : 0);
    z.fragen.forEach((f, i) => {
      const a = winkel(i), blatt = s("g", { "data-stueck": "blatt", "data-frage": f },
        s("path", { d: `M${px - 4},${py - 8} L${px - 15},${py - 102} Q${px},${py - 110} ${px + 15},${py - 102} L${px + 4},${py - 8} Z`, fill: "#fff8e1", style: "stroke:var(--deko-6)", "stroke-width": 1.6 }),
        text(px, py - 84, f, { gross: 10, farbe: "#2d3047" }));
      if (ruhig) blatt.setAttribute("transform", `rotate(${a} ${px} ${py})`);
      else blatt.append(s("animateTransform", { attributeName: "transform", type: "rotate", from: `0 ${px} ${py}`, to: `${a} ${px} ${py}`, begin: t(0.2 + (i * T * 0.6) / Math.max(1, n)), dur: "0.5s", fill: "freeze" }));
      svg.appendChild(blatt);
    });
    // der Griff mit dem Verb (Infinitiv, leer)
    const griff = s("g", n ? {} : { "data-stueck": "verb" }, s("rect", { x: px - 22, y: py - 10, width: 44, height: 20, rx: 6, style: "fill:var(--deko-6)" }),
      s("path", { d: `M${px - 14},${py - 2} h28 M${px - 14},${py + 3} h16`, stroke: "#ffffff", "stroke-width": 1.6, "stroke-linecap": "round", opacity: 0.8 }));
    if (!n) {
      // s1: das Verb wird im Satz gefunden und fliegt an den Griff
      for (let i = 0; i < 5; i++) svg.appendChild(leerKarte(40 + i * 50, 30, 42, 18));
      svg.appendChild(erscheine(s("rect", { x: 140, y: 30, width: 42, height: 18, rx: 3, fill: "#ffe9c7", style: "stroke:var(--deko-6)", "stroke-width": 2 }), 0.2, ruhig));
      svg.appendChild(herein(griff, 161 - px, 39 - py, T * 0.5, ruhig, 0.6));
    } else svg.appendChild(griff);
    if (z.zeit) svg.appendChild(erscheine(bildzeichen(px + 34, py, z.zeit === "praesens" ? "🕐" : "⏳", 14), T, ruhig));
    for (let i = 0; i < (z.falsch ?? 0); i++) {
      const x = 46 + i * 228;
      svg.appendChild(verschwinde(s("g", {}, leerKarte(x - 20, 60, 40, 18), kreuz(x + 26, 74, 13)), T + 0.1, ruhig));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 20, ruhig));
    return svg;
  }

  // ----- Wortarten-Probe (SAMMELN · labor) -----
  // Proben des Spiels mit ihren Bildzeichen; jede trifft genau eine Wortart (Nomen, Verb, Adjektiv, Pronomen, Partikel)
  const PROBEN_LABOR = [["🏷️", "N"], ["👤", "V"], ["📈", "A"], ["📋", "P"], ["🔒", "T"]];
  const WORTART_NAME = { N: "Nomen", V: "Verb", A: "Adjektiv", P: "Pronomen", T: "Partikel" };
  const PARTIKEL_ART = { praeposition: "Präposition", konjunktion: "Konjunktion", andere: "andere Partikel" };
  /**
   * Reagenzgläser im Ständer: Probe um Probe füllt sich ein Glas; die passende Probe färbt sich (deko-5) mit ✓, die
   * anderen bleiben blass mit ✗ — darunter die Wortart. Angabe: { wortart, proben: 3 | 5, art? } (art: welche
   * Partikel, s6).
   */
  function labor(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !WORTART_NAME[z.wortart] || ![3, 5].includes(z.proben) || (z.proben === 3 && !["N", "V", "A"].includes(z.wortart)) || (z.art !== undefined && (z.wortart !== "T" || !PARTIKEL_ART[z.art]))) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "labor", "data-wert": z.wortart, "data-anzahl": 1 });
    svg.appendChild(tagGrund());
    const proben = PROBEN_LABOR.slice(0, z.proben), gb = 56, x0 = BREITE / 2 - ((z.proben - 1) * gb) / 2, T = DAUER * 0.75;
    svg.appendChild(s("rect", { x: x0 - 34, y: 76, width: (z.proben - 1) * gb + 68, height: 8, rx: 3, fill: "#a8743f" }));
    proben.forEach(([bild, art], i) => {
      const x = x0 + i * gb, passt = art === z.wortart, ab = (i * T) / z.proben, hoch = passt ? 46 : 12;
      const fuellung = s("rect", { x: x - 8, y: 76 - hoch, width: 16, height: hoch, style: passt ? "fill:var(--deko-5)" : "fill:#d9dce8", ...(passt ? { "data-stueck": "treffer" } : {}) });
      if (!ruhig) { fuellung.setAttribute("height", 0); fuellung.setAttribute("y", 76);
        fuellung.append(s("animate", { attributeName: "height", from: 0, to: hoch, begin: t(ab), dur: "0.4s", fill: "freeze" }), s("animate", { attributeName: "y", from: 76, to: 76 - hoch, begin: t(ab), dur: "0.4s", fill: "freeze" })); }
      svg.append(fuellung, s("path", { d: `M${x - 9},20 L${x - 9},70 Q${x - 9},80 ${x},80 Q${x + 9},80 ${x + 9},70 L${x + 9},20`, fill: "none", stroke: "#8a8fa8", "stroke-width": 1.6 }),
        bildzeichen(x, 98, bild, 14), erscheine(passt ? haken(x, 120, 14) : kreuz(x, 120, 13), ab + 0.4, ruhig, 0.2));
    });
    svg.appendChild(erscheine(text(BREITE / 2, 142, z.art ? `${WORTART_NAME[z.wortart]}: ${PARTIKEL_ART[z.art]}` : WORTART_NAME[z.wortart], { gross: 12, farbe: "#2d3047" }), T + 0.3, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 20, ruhig));
    return svg;
  }

  // ----- Gedicht-Baukasten (BAUEN · gedicht) -----
  const SCHEMATA = ["aa", "aabb", "abab", "abba"];
  /**
   * Verse als Balken, das Reimwort am Ende farbig (a deko-1, b deko-2), Bögen verbinden die Reime, rechts das Schema.
   * Angabe: { schema, strophen?: 1 | 2, ordnen?, zaehlen?, luecke? } — ordnen: die Verse rutschen an ihren Platz (der
   * erste steht wie im Spiel); zaehlen: die Verse werden gezählt; luecke: das letzte Reimwort ist erst „?“.
   */
  function gedicht(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !SCHEMATA.includes(z.schema) || ![1, 2].includes(z.strophen ?? 1) || ((z.strophen ?? 1) === 2 && z.schema.length !== 4)) return null;
    const strophen = z.strophen ?? 1, v = z.schema.length, alle = v * strophen;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "gedicht", "data-anzahl": alle, "data-wert": z.schema });
    svg.appendChild(s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#fffaf0" }));
    const zh = Math.min(26, 126 / (alle + strophen - 1)), y0 = 12 + (126 - zh * (alle + strophen - 1)) / 2, T = DAUER * 0.8, je = (T * 0.7) / alle;
    const FARBE = { a: "var(--deko-1)", b: "var(--deko-2)" }, LANG = [180, 160, 172, 150];
    const zeileY = (st, i) => y0 + (st * (v + 1) + i) * zh;
    for (let st = 0; st < strophen; st++) {
      for (let i = 0; i < v; i++) {
        const nr = st * v + i, y = zeileY(st, i), b = LANG[i % 4], buchst = z.schema[i];
        const vers = s("g", { "data-stueck": "vers", "data-reim": buchst }, s("rect", { x: 70, y, width: b - 34, height: zh * 0.5, rx: 3, fill: "#e4e6ec" }),
          s("rect", { x: 70 + b - 30, y, width: 30, height: zh * 0.5, rx: 3, style: `fill:${FARBE[buchst]}` }));
        const letzte = z.luecke && nr === alle - 1;
        if (letzte) vers.appendChild(kurz(s("g", {}, s("rect", { x: 70 + b - 30, y, width: 30, height: zh * 0.5, rx: 3, fill: "#fffaf0", style: "stroke:var(--deko-1)", "stroke-width": 1.4 }),
          text(70 + b - 15, y + zh * 0.5 - 1, "?", { gross: Math.max(9, zh * 0.5), farbe: "#8e5bd6" })), 0, T * 0.8, ruhig));
        // ordnen: der erste Vers steht, die übrigen kommen vertauscht und rutschen an ihren Platz
        const von = z.ordnen && i ? zeileY(st, v - i) - y : 0;
        svg.appendChild(herein(vers, von ? 0 : -24, von, nr * je, ruhig, 0.4));
        svg.appendChild(erscheine(text(276, y + zh * 0.5 - 1, buchst, { gross: Math.max(9, Math.min(13, zh * 0.6)), farbe: "#2d3047" }), T * 0.7 + 0.2, ruhig));
        if (z.zaehlen) svg.appendChild(erscheine(text(54, y + zh * 0.5 - 1, nr + 1, { gross: Math.max(9, Math.min(12, zh * 0.55)), farbe: "#6b7089" }), nr * je + 0.3, ruhig));
      }
      // Reimbögen rechts der Verse: jedes Paar gleicher Buchstaben
      for (const buchst of ["a", "b"]) {
        const idx = [...z.schema].map((c, i) => (c === buchst ? i : -1)).filter(i => i >= 0);
        if (idx.length !== 2) continue;
        const [i1, i2] = idx, ya = zeileY(st, i1) + zh * 0.25, yb = zeileY(st, i2) + zh * 0.25, w = 10 + (i2 - i1) * 6;
        svg.appendChild(zeichne(s("path", { d: `M${258},${ya} C${258 + w},${ya} ${258 + w},${yb} ${258},${yb}`, fill: "none", style: `stroke:${FARBE[buchst]}`, "stroke-width": 1.8 }), T * 0.75, ruhig, 0.4));
      }
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 20, ruhig));
    return svg;
  }

  // ----- Gattungs-Kenner (SAMMELN · regal) -----
  const GATTUNGEN = ["🏰", "⛰️", "🦊", "📜", "📰", "📖", "🎭"]; // Märchen, Sage, Fabel, Gedicht, Bericht, Kurzgeschichte, Theater
  /**
   * Das Bücherregal füllt sich mit den Gattungen der Stufe (Bildzeichen wie im Spiel); die Eule liest. Angabe:
   * { buecher: [Bild …], gut?, fremd? } — gut: beim Märchen gut 😇 und böse 😈 (s1); fremd: ein Buch, das nicht passt,
   * wird mit der Lupe gefunden und fällt hinaus (s6).
   */
  function regal(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.buecher) || !z.buecher.length || z.buecher.length > 7 || !z.buecher.every(b => GATTUNGEN.includes(b)) || new Set(z.buecher).size !== z.buecher.length) return null;
    if (z.fremd !== undefined && (!GATTUNGEN.includes(z.fremd) || 32 + (z.buecher.length + 1) * 32 > 256)) return null;
    const n = z.buecher.length, svg = neuesBild("sammeln", stufe, { "data-bilder": "regal", "data-anzahl": n });
    svg.append(tagGrund(), s("rect", { x: 20, y: 102, width: 244, height: 8, rx: 2, fill: "#a8743f" }), s("rect", { x: 20, y: 14, width: 6, height: 96, fill: "#a8743f" }), s("rect", { x: 258, y: 14, width: 6, height: 96, fill: "#a8743f" }));
    const bb = 30, T = DAUER * 0.8, je = (T * 0.75) / n, x0 = 32;
    z.buecher.forEach((b, i) => {
      const x = x0 + i * (bb + 2), h = 60 + (i % 3) * 8;
      svg.appendChild(herein(s("g", { "data-stueck": "buch", "data-gattung": b }, s("rect", { x, y: 102 - h, width: bb, height: h, rx: 2, style: `fill:var(--deko-${(i % 6) + 1})`, stroke: "#2d3047", "stroke-width": 0.8 }),
        s("rect", { x: x + 4, y: 102 - h + 14, width: bb - 8, height: 24, rx: 2, fill: "#ffffff" }), bildzeichen(x + bb / 2, 102 - h + 26, b, 16)), 40, 0, i * je, ruhig, 0.35));
    });
    if (z.gut) svg.appendChild(erscheine(s("g", {}, bildzeichen(60, 126, "😇", 16), bildzeichen(88, 126, "😈", 16), haken(118, 132, 14)), T, ruhig));
    if (z.fremd) {
      const x = x0 + n * (bb + 2);
      const buch = s("g", { "data-fremd": z.fremd }, s("rect", { x, y: 42, width: bb, height: 60, rx: 2, fill: "#c9cde0", stroke: "#2d3047", "stroke-width": 0.8 }), s("rect", { x: x + 4, y: 56, width: bb - 8, height: 24, rx: 2, fill: "#ffffff" }), bildzeichen(x + bb / 2, 68, z.fremd, 16));
      svg.append(kurz(s("g", {}, s("g", { transform: `translate(${x + bb / 2} 72) scale(0.9)` }, lupe())), T * 0.75, T + 0.2, ruhig), verschwinde(buch, T + 0.2, ruhig, 0.4));
    }
    svg.appendChild(bewege(s("g", {}, euleSitzend(0.26)), "M300,40 L292,98", { x: 292, y: 98, winkel: 0 }, ruhig, { drehen: false, dauer: 0.8 }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 50, 30, ruhig));
    return svg;
  }

  // ----- Hör-Reporter (AUFTRITT · reporter) -----
  const REPORTER_FRAGEN = { wer: "Wer?", wo: "Wo?", wann: "Wann?", was: "Was?", warum: "Warum?", schluss: "💡", zahl: "🔢", kern: "🎯" };
  /**
   * Die Eule hört mit Kopfhörern den Bericht (📻); Frage um Frage der Stufe kommt eine Karte auf die Tafel und bekommt
   * ihren Haken. Angabe: { fragen: [wer, wo, wann, was, warum, schluss, zahl, kern] } (schluss 💡, zahl 🔢, kern 🎯).
   */
  function reporter(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.fragen) || !z.fragen.length || z.fragen.length > 4 || !z.fragen.every(f => REPORTER_FRAGEN[f])) return null;
    const n = z.fragen.length, svg = neuesBild("auftritt", stufe, { "data-bilder": "reporter", "data-anzahl": n });
    svg.append(tagGrund(), boden());
    // die Eule mit Kopfhörern (Bügel und zwei Muscheln an den Ohren)
    svg.appendChild(s("g", { transform: "translate(52 98)" }, euleSitzend(0.36), s("path", { d: "M-16,-32 Q0,-52 16,-32", fill: "none", stroke: "#2d3047", "stroke-width": 3 }),
      s("rect", { x: -18, y: -38, width: 8, height: 12, rx: 3, fill: "#2d3047" }), s("rect", { x: 10, y: -38, width: 8, height: 12, rx: 3, fill: "#2d3047" })));
    svg.appendChild(bildzeichen(18, 120, "📻", 18));
    for (let i = 0; i < 3; i++) svg.appendChild(zeichne(s("path", { d: `M${84 + i * 8},${56 - i * 4} Q${92 + i * 8},${70} ${84 + i * 8},${84 + i * 4}`, fill: "none", stroke: "#8a8fa8", "stroke-width": 1.6 }), i * 0.2, ruhig, 0.3));
    const zh = Math.min(28, 112 / n), T = DAUER * 0.8, je = (T * 0.8) / n;
    z.fragen.forEach((f, i) => {
      const y = 12 + i * zh + (112 - n * zh) / 2, ab = 0.3 + i * je;
      svg.appendChild(herein(s("g", { "data-stueck": "frage", "data-frage": f }, s("rect", { x: 120, y, width: 176, height: zh - 6, rx: 5, fill: "#ffffff", style: "stroke:var(--deko-6)", "stroke-width": 1.6 }),
        REPORTER_FRAGEN[f].endsWith("?") ? text(150, y + (zh - 6) / 2 + 4, REPORTER_FRAGEN[f], { gross: 11 }) : bildzeichen(150, y + (zh - 6) / 2, REPORTER_FRAGEN[f], 13),
        s("path", { d: `M182,${y + (zh - 6) / 2} h70`, stroke: "#c9cde0", "stroke-width": 2, "stroke-linecap": "round" })), 30, 0, ab, ruhig, 0.35));
      svg.appendChild(erscheine(haken(276, y + (zh - 6) / 2 + 5, 14), ab + 0.4, ruhig, 0.2));
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(100, 20, ruhig));
    return svg;
  }

  // ----- Gefühle-Radar (AUFTRITT · gefuehle) -----
  const GEFUEHLE_BILDER = ["😀", "😢", "😠", "😨", "😲", "😴", "😌", "😞", "🤔", "😬", "🥱", "😮‍💨", "😒", "😳", "😄", "😊", "😭", "😡", "😱", "😮", "😪"];
  /**
   * Der Radarschirm dreht sich; wo der Strahl vorbeikommt, taucht ein Gesicht der Stufe auf (Gefühle der Liste des
   * Spiels). Angabe: { gefuehle: [Bild …] (1–4), paar?: [Bild, Bild] } — paar: zwei Gefühle zugleich in der Mitte (s6).
   */
  function gefuehle(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.gefuehle) || z.gefuehle.length > 4 || !z.gefuehle.every(g => GEFUEHLE_BILDER.includes(g))) return null;
    if (z.paar !== undefined && (!Array.isArray(z.paar) || z.paar.length !== 2 || !z.paar.every(g => GEFUEHLE_BILDER.includes(g)))) return null;
    const n = z.gefuehle.length + (z.paar ? 2 : 0);
    if (!n) return null;
    const svg = neuesBild("auftritt", stufe, { "data-bilder": "gefuehle", "data-anzahl": n });
    const cx = 160, cy = 76, R = 66, T = DAUER * 0.85;
    svg.append(tagGrund(), s("circle", { cx, cy, r: R, fill: "#123b2e", stroke: GUT, "stroke-width": 2 }), s("circle", { cx, cy, r: 44, fill: "none", stroke: GUT, "stroke-width": 0.8, opacity: 0.6 }),
      s("circle", { cx, cy, r: 22, fill: "none", stroke: GUT, "stroke-width": 0.8, opacity: 0.6 }), s("path", { d: `M${cx - R},${cy} H${cx + R} M${cx},${cy - R} V${cy + R}`, stroke: GUT, "stroke-width": 0.6, opacity: 0.5 }));
    // der Strahl: ein Keil, der einmal herumgeht (im ruhigen Bild nicht da)
    if (!ruhig) {
      const strahl = s("path", { d: `M${cx},${cy} L${cx},${cy - R} A${R},${R} 0 0,1 ${cx + R * Math.sin(0.5)},${cy - R * Math.cos(0.5)} Z`, fill: GUT, opacity: 0.35 });
      strahl.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `0 ${cx} ${cy}`, to: `360 ${cx} ${cy}`, begin: t(0), dur: `${T}s`, fill: "freeze" }));
      svg.appendChild(verschwinde(strahl, T, false, 0.3));
    }
    z.gefuehle.forEach((g, i) => {
      const w = 40 + (i * 300) / Math.max(1, z.gefuehle.length), b = (w * Math.PI) / 180, x = cx + 42 * Math.sin(b), y = cy - 42 * Math.cos(b);
      svg.appendChild(erscheine(s("g", { "data-stueck": "gefuehl" }, s("circle", { cx: x, cy: y, r: 15, fill: "#ffffff", opacity: 0.85 }), bildzeichen(x, y, g, 22)), (w / 360) * T, ruhig, 0.3));
    });
    if (z.paar) z.paar.forEach((g, i) => svg.appendChild(erscheine(s("g", { "data-stueck": "gefuehl" }, s("circle", { cx: cx - 14 + i * 28, cy, r: 13, fill: "#ffffff" }), bildzeichen(cx - 14 + i * 28, cy, g, 20)), T + 0.1, ruhig, 0.3)));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(40, 30, ruhig));
    return svg;
  }

  // ----- Hör-Geschichte (AUFTRITT · lagerfeuer) -----
  /**
   * Die Eule erzählt am Lagerfeuer; je Frage der Stufe setzt sich eine Figur der Geschichte (Bilder der Antworten im
   * Spiel) dazu. Angabe: { zuhoerer: [Bild …] (1–4), titel? } — titel: das Buch mit dem Titel geht auf (s6).
   */
  function lagerfeuer(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.zuhoerer) || !z.zuhoerer.length || z.zuhoerer.length > 4 || !z.zuhoerer.every(b => typeof b === "string" && b.length)) return null;
    const n = z.zuhoerer.length, svg = neuesBild("auftritt", stufe, { "data-bilder": "lagerfeuer", "data-anzahl": n });
    svg.append(himmelGrund(), himmel(), s("path", { d: `M0,112 Q160,100 ${BREITE},112 L${BREITE},136 Q${BREITE},${HOEHE} ${BREITE - 14},${HOEHE} L14,${HOEHE} Q0,${HOEHE} 0,136 Z`, fill: "#2b3a2a" }));
    svg.append(s("circle", { cx: 160, cy: 112, r: 26, fill: "#f5b301", opacity: 0.18 }), s("path", { d: "M146,122 L174,114 M146,114 L174,122", stroke: "#6b4a2b", "stroke-width": 4, "stroke-linecap": "round" }));
    const flamme = s("path", { d: "M160,92 Q170,104 166,114 Q160,120 154,114 Q150,104 160,92 Z", fill: "#f0913a" });
    if (!ruhig) flamme.appendChild(s("animateTransform", { attributeName: "transform", type: "scale", values: "1 1;1 1.08;1 1", additive: "sum", begin: t(0), dur: "0.8s", repeatCount: 3 }));
    svg.append(flamme, s("path", { d: "M160,102 Q165,108 163,114 Q160,117 157,114 Q155,108 160,102 Z", fill: "#f5d04a" }));
    svg.appendChild(s("g", { transform: "translate(70 112)" }, euleSitzend(0.32)));
    for (let i = 0; i < 2; i++) svg.appendChild(zeichne(s("path", { d: `M${92 + i * 7},${84 - i * 3} Q${100 + i * 7},92 ${92 + i * 7},${100 + i * 3}`, fill: "none", stroke: "#c9ccd3", "stroke-width": 1.4 }), 0.2 + i * 0.2, ruhig, 0.3));
    const PLAETZE = [[214, 110], [250, 104], [286, 112], [118, 100]], T = DAUER * 0.8;
    z.zuhoerer.forEach((b, i) => { const [x, y] = PLAETZE[i]; svg.appendChild(vonOben(s("g", { "data-stueck": "zuhoerer" }, bildzeichen(x, y, b, 24)), 0.3 + (i * T * 0.7) / n, ruhig, 30, 0.35)); });
    if (z.titel) svg.appendChild(erscheine(s("g", {}, s("circle", { cx: 160, cy: 46, r: 20, fill: "#fff6c8", opacity: 0.2 }), bildzeichen(160, 46, "📖", 24)), T, ruhig, 0.4));
    if (sterne >= 2) svg.appendChild(funkeln(ruhig));
    if (sterne >= 3) svg.appendChild(sternschnuppe(ruhig));
    return svg;
  }

  // ----- Jahreskreis-Ordner (ZYKLUS · jahresrad) -----
  const TAGE_KURZ = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  // Jahreszeit nur für die eindeutigen Monate wie im Spiel (März, Juni, September, Dezember fragt es nicht); Farben des Spiels
  const MONAT_ZEIT = { 0: ["#74a7e0", "❄️"], 1: ["#74a7e0", "❄️"], 3: ["#7ccf6b", "🌷"], 4: ["#7ccf6b", "🌷"], 6: ["#f5b301", "☀️"], 7: ["#f5b301", "☀️"], 9: ["#e07a3f", "🍂"], 10: ["#e07a3f", "🍂"] };
  /**
   * Rad der Wochentage (Mo … So) oder der Monate (1 … 12, die Zahl wie „n. Monat“ im Spiel): der Zeiger dreht vom
   * Starttag um so viele Felder, wie die Stufe rechnet (auch mehrmals herum); ordnen: Felder leuchten der Reihe nach auf.
   * Angabe: { ring: "tage" | "monate", von, schritt } oder { ring, ordnen: [Feld …] }.
   */
  function jahresrad(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !["tage", "monate"].includes(z.ring)) return null;
    const n = z.ring === "tage" ? 7 : 12, feld = i => Number.isInteger(i) && i >= 0 && i < n;
    const mitZeiger = feld(z.von) && Number.isInteger(z.schritt) && z.schritt !== 0 && Math.abs(z.schritt) <= 40;
    const mitOrdnen = Array.isArray(z.ordnen) && z.ordnen.length >= 2 && z.ordnen.every(feld);
    if (mitZeiger === mitOrdnen) return null;
    const ende = mitZeiger ? (((z.von + z.schritt) % n) + n) % n : z.ordnen[z.ordnen.length - 1];
    const svg = neuesBild("zyklus", stufe, { "data-bilder": "jahresrad", "data-wert": ende, ...(mitOrdnen ? { "data-anzahl": z.ordnen.length } : {}) });
    svg.appendChild(tagGrund());
    const cx = 160, cy = 76, R = 64, r = 34, T = DAUER * 0.8;
    const punkt = (w, rad) => [cx + rad * Math.sin((w * Math.PI) / 180), cy - rad * Math.cos((w * Math.PI) / 180)];
    const sektor = (i, farbe, extra = {}) => {
      const a = (i * 360) / n, b = ((i + 1) * 360) / n, [x1, y1] = punkt(a, R), [x2, y2] = punkt(b, R), [x3, y3] = punkt(b, r), [x4, y4] = punkt(a, r);
      return s("path", { d: `M${x1},${y1} A${R},${R} 0 0,1 ${x2},${y2} L${x3},${y3} A${r},${r} 0 0,0 ${x4},${y4} Z`, fill: farbe, stroke: "#ffffff", "stroke-width": 1.4, ...extra });
    };
    for (let i = 0; i < n; i++) {
      const zeit = z.ring === "monate" ? MONAT_ZEIT[i] : null, [lx, ly] = punkt(((i + 0.5) * 360) / n, (R + r) / 2);
      svg.append(sektor(i, zeit ? zeit[0] : "#e8eaf2"), text(lx, ly + 3.5, z.ring === "tage" ? TAGE_KURZ[i] : i + 1, { gross: 10, farbe: "#2d3047" }));
    }
    if (z.ring === "monate") for (const i of [0, 3, 6, 9]) { const [ex, ey] = punkt(((i + 1) * 360) / n, R + 9); svg.appendChild(bildzeichen(ex, ey, MONAT_ZEIT[i][1], 11)); }
    if (mitZeiger) {
      const a0 = ((z.von + 0.5) * 360) / n, a1 = a0 + (z.schritt * 360) / n;
      svg.append(sektor(z.von, "none", { stroke: "#2d3047", "stroke-width": 2.4 }), erscheine(sektor(ende, "#fff1c2", { stroke: "#f5b301", "stroke-width": 2.4, "data-ende": ende }), T + 0.1, ruhig));
      { const [lx, ly] = punkt(((ende + 0.5) * 360) / n, (R + r) / 2); svg.appendChild(erscheine(text(lx, ly + 3.5, z.ring === "tage" ? TAGE_KURZ[ende] : ende + 1, { gross: 10, farbe: "#2d3047" }), T + 0.1, ruhig)); }
      const zeiger = s("g", {}, s("line", { x1: cx, y1: cy, x2: cx, y2: cy - r + 4, stroke: "#2d3047", "stroke-width": 3, "stroke-linecap": "round" }), s("path", { d: `M${cx - 5},${cy - r + 10} L${cx},${cy - r + 2} L${cx + 5},${cy - r + 10} Z`, fill: "#2d3047" }));
      if (ruhig) zeiger.setAttribute("transform", `rotate(${a1} ${cx} ${cy})`);
      else { zeiger.setAttribute("transform", `rotate(${a0} ${cx} ${cy})`);
        zeiger.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `${a0} ${cx} ${cy}`, to: `${a1} ${cx} ${cy}`, begin: t(0.2), dur: `${T}s`, fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" })); }
      svg.append(zeiger, s("circle", { cx, cy, r: 4, fill: "#2d3047" }), text(268, 30,(z.schritt > 0 ? "+" : "−") + Math.abs(z.schritt), { gross: 16, farbe: "#e5484d" }));
    } else z.ordnen.forEach((i, k) => svg.appendChild(erscheine(s("g", { "data-stueck": "feld" }, sektor(i, "#fff1c2", { stroke: "#f5b301", "stroke-width": 2 }),
      text(...punkt(((i + 0.5) * 360) / n, (R + r) / 2).map((v, j) => (j ? v + 3.5 : v)), z.ring === "tage" ? TAGE_KURZ[i] : i + 1, { gross: 10, farbe: "#2d3047" })), (k * T) / z.ordnen.length, ruhig, 0.25)));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(40, 120, ruhig));
    return svg;
  }

  // ----- Früher und heute (REISE · zeitreise) -----
  /**
   * Dinge aus den Listen des Spiels auf dem Weg durch die Zeit (vom ältesten zum neusten, 🕰️ → ✨). Angabe:
   * { reihe: [Bild …], rueck? } (rueck: von heute zurück, s4), { korb: { frueher: [...], heute: [...] } } (s1) oder
   * { jahr, ja: [...], nein: [...] } (Gab es das vor 60 Jahren? s5).
   */
  function zeitreise(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], bilder = a => Array.isArray(a) && a.every(b => typeof b === "string" && b.length);
    const T = DAUER * 0.8;
    if (z && bilder(z.reihe) && z.reihe.length >= 2 && z.reihe.length <= 5) {
      const n = z.reihe.length, svg = neuesBild("reise", stufe, { "data-bilder": "zeitreise", "data-anzahl": n });
      svg.append(tagGrund(), s("line", { x1: 30, y1: 104, x2: 286, y2: 104, stroke: "#6b7089", "stroke-width": 2.4 }), s("path", { d: "M286,98 L298,104 L286,110 Z", fill: "#6b7089" }),
        bildzeichen(20, 124, "🕰️", 14), bildzeichen(296, 124, "✨", 14));
      const x = i => 56 + (i * 220) / (n - 1), folge = z.rueck ? [...Array(n).keys()].reverse() : [...Array(n).keys()];
      folge.forEach((i, k) => svg.appendChild(vonOben(s("g", { "data-stueck": "ding" }, s("circle", { cx: x(i), cy: 64, r: 20, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.4 }), bildzeichen(x(i), 64, z.reihe[i], 26),
        s("line", { x1: x(i), y1: 86, x2: x(i), y2: 102, stroke: "#c9cde0", "stroke-width": 1.4 })), (k * T * 0.8) / n, ruhig, 30, 0.35)));
      const a = folge[0], b = folge[n - 1];
      svg.appendChild(bewege(s("g", {}, euleSitzend(0.2)), `M${x(a)},102 L${x(b)},102`, { x: x(b), y: 102, winkel: 0 }, ruhig, { drehen: false, linear: true }));
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
      if (sterne >= 3) svg.appendChild(funken(30, 24, ruhig));
      return svg;
    }
    if (z && z.korb && bilder(z.korb.frueher) && bilder(z.korb.heute) && z.korb.frueher.length + z.korb.heute.length >= 2 && Math.max(z.korb.frueher.length, z.korb.heute.length) <= 3) {
      const svg = neuesBild("reise", stufe, { "data-bilder": "zeitreise", "data-anzahl": z.korb.frueher.length + z.korb.heute.length });
      svg.appendChild(tagGrund());
      let k = 0;
      [["frueher", "🕰️", 86], ["heute", "✨", 234]].forEach(([art, zeichen, kx]) => {
        svg.append(s("path", { d: `M${kx - 56},84 L${kx + 56},84 L${kx + 46},136 L${kx - 46},136 Z`, fill: "#ffffff", stroke: "#a8743f", "stroke-width": 2.4 }), bildzeichen(kx, 146 - 4, zeichen, 12));
        z.korb[art].forEach((b, i) => { const x = kx - 30 + i * 30; svg.appendChild(herein(s("g", { "data-stueck": "ding" }, bildzeichen(x, 106, b, 24)), 160 - x, -76, 0.2 + k++ * 0.5, ruhig, 0.5)); });
      });
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
      if (sterne >= 3) svg.appendChild(funken(160, 40, ruhig));
      return svg;
    }
    if (z && Number.isInteger(z.jahr) && bilder(z.ja) && bilder(z.nein) && z.ja.length + z.nein.length >= 2 && z.ja.length + z.nein.length <= 5) {
      const alle = [...z.ja.map(b => [b, true]), ...z.nein.map(b => [b, false])], n = alle.length;
      const svg = neuesBild("reise", stufe, { "data-bilder": "zeitreise", "data-anzahl": n, "data-wert": z.jahr });
      svg.append(tagGrund(), s("rect", { x: 18, y: 40, width: 62, height: 56, rx: 5, fill: "#ffffff", stroke: "#6b7089", "stroke-width": 1.4 }), s("rect", { x: 18, y: 40, width: 62, height: 14, rx: 5, fill: "#e5484d" }),
        text(49, 82, z.jahr, { gross: 15 }));
      alle.forEach(([b, gab], i) => {
        const x = 110 + (i * 186) / Math.max(1, n - 1), ab = (i * T * 0.8) / n;
        svg.append(erscheine(s("g", { "data-stueck": "ding", "data-gab": String(gab) }, bildzeichen(x, 60, b, 26)), ab, ruhig, 0.3), erscheine(bildzeichen(x, 100, gab ? "✅" : "❌", 16), ab + 0.4, ruhig, 0.2));
      });
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
      if (sterne >= 3) svg.appendChild(funken(48, 126, ruhig));
      return svg;
    }
    return null;
  }

  // ----- Zeitstrahl-Sortierer (WACHSEN · lebenslinie) -----
  /**
   * Ohne Zahlen: { reihe: [Bild …] } — ein Leben (oder die Generationen) wächst auf dem Pfeil von links nach rechts, jedes
   * Bild ein wenig grösser. Mit Zahlen: { von, bis, klein, gross, marken: [[Jahr, Bild] …], alter?: [Geburt, Jahr],
   * jahrhundert?: Jahr } — der Zeitstrahl wie im Spiel (Striche je klein, Zahl je gross), die Marken fallen der Zeit nach
   * an ihr Jahr; alter rechnet, jahrhundert nennt das Jahrhundert eines Jahrs.
   */
  function lebenslinie(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (z && Array.isArray(z.reihe) && z.reihe.length >= 2 && z.reihe.length <= 6) {
      const n = z.reihe.length, svg = neuesBild("wachsen", stufe, { "data-bilder": "lebenslinie", "data-anzahl": n });
      svg.append(tagGrund(), s("line", { x1: 24, y1: 112, x2: 288, y2: 112, stroke: "#6b7089", "stroke-width": 2.4 }), s("path", { d: "M288,106 L300,112 L288,118 Z", fill: "#6b7089" }));
      z.reihe.forEach((b, i) => {
        const x = 46 + (i * 222) / (n - 1), g = 20 + (i * 14) / (n - 1);
        svg.appendChild(vonOben(s("g", { "data-stueck": "bild" }, bildzeichen(x, 104 - g * 0.6, b, g), s("line", { x1: x, y1: 106, x2: x, y2: 118, stroke: "#6b7089", "stroke-width": 1.6 })), (i * T) / n, ruhig, 24, 0.35));
      });
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
      if (sterne >= 3) svg.appendChild(funken(30, 24, ruhig));
      return svg;
    }
    if (!z || ![z.von, z.bis, z.klein, z.gross].every(Number.isInteger) || z.bis <= z.von || z.klein <= 0 || z.gross % z.klein || (z.bis - z.von) % z.gross || (z.bis - z.von) / z.klein > 60) return null;
    if (!Array.isArray(z.marken) || !z.marken.length || z.marken.length > 4 || !z.marken.every(([j, b]) => Number.isInteger(j) && j >= z.von && j <= z.bis && typeof b === "string")) return null;
    const svg = neuesBild("wachsen", stufe, { "data-bilder": "lebenslinie", "data-anzahl": z.marken.length });
    svg.appendChild(tagGrund());
    const L = 24, R = 290, y = 92, X = j => L + ((j - z.von) / (z.bis - z.von)) * (R - L);
    svg.append(s("line", { x1: L - 6, y1: y, x2: R + 8, y2: y, stroke: "#2d3047", "stroke-width": 1.8 }), s("path", { d: `M${R + 8},${y - 4} L${R + 15},${y} L${R + 8},${y + 4} Z`, fill: "#2d3047" }));
    for (let j = z.von; j <= z.bis; j += z.klein) {
      const lang = (j - z.von) % z.gross === 0;
      svg.appendChild(s("line", { x1: X(j), y1: y - (lang ? 6 : 3), x2: X(j), y2: y + (lang ? 6 : 3), stroke: "#2d3047", "stroke-width": lang ? 1.4 : 0.8 }));
      if (lang) svg.appendChild(text(X(j), y + 18, j, { gross: 9, farbe: "#2d3047", fett: false }));
    }
    const sortiert = [...z.marken].sort((a, b) => a[0] - b[0]);
    // Marken, die näher als ein Bild beieinander liegen, gibt es nicht (geprüft); die Zahl steht über dem Bild
    if (sortiert.some(([j], i) => i && X(j) - X(sortiert[i - 1][0]) < 26)) return null;
    sortiert.forEach(([j, b], i) => svg.appendChild(vonOben(s("g", { "data-stueck": "marke", "data-jahr": j }, s("line", { x1: X(j), y1: 62, x2: X(j), y2: y, style: "stroke:var(--deko-1)", "stroke-width": 1.6 }),
      s("circle", { cx: X(j), cy: y, r: 3, style: "fill:var(--deko-1)" }), bildzeichen(X(j), 48, b, 20), text(X(j), 26, j, { gross: 10, farbe: "#8e5bd6" })), (i * T * 0.8) / z.marken.length, ruhig, 30, 0.35)));
    if (z.alter) {
      const [geb, jahr] = z.alter;
      if (!Number.isInteger(geb) || !Number.isInteger(jahr) || jahr < geb) return null;
      svg.appendChild(erscheine(text(BREITE / 2, 138, `${jahr} − ${geb} = ${jahr - geb}`, { gross: 13, farbe: "#e5484d" }), T + 0.2, ruhig));
    }
    if (z.jahrhundert !== undefined) {
      if (!Number.isInteger(z.jahrhundert) || z.jahrhundert < 1) return null;
      svg.appendChild(erscheine(text(BREITE / 2, 138, `${z.jahrhundert} → ${Math.floor((z.jahrhundert - 1) / 100) + 1}. Jahrhundert`, { gross: 13, farbe: "#e5484d" }), T + 0.2, ruhig));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 130, ruhig));
    return svg;
  }

  // ----- Erdzeit-Leiter (REISE · erdleiter) -----
  const ERDE_ALTER = 4.6e9;
  /**
   * Die Leiter der Erdgeschichte liegt quer: links die Entstehung der Erde (vor 4600 Millionen Jahren), Sprossen bei 10⁹
   * bis 10⁴ Jahren wie im Spiel (logarithmisch), rechts heute. Die Eule klettert, die Ereignisse der Stufe erscheinen in
   * der Folge der Zeit. Angabe: { ereignisse: [[Jahre vor heute, Bild] …], zahlen? } oder { tag: [Jahre, Bild] } — die
   * Erdgeschichte als ein Tag (die Erde um 0 Uhr, Mitternacht ist heute, wie im Spiel).
   */
  function erdleiter(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8, ok = ([j, b]) => Number.isFinite(j) && j >= 1e4 && j <= ERDE_ALTER && typeof b === "string";
    const millionen = j => (j >= 1e6 ? `${ganzText(Math.round(j / 1e6))} Mio.` : ganzText(j));
    if (z && Array.isArray(z.tag) && ok(z.tag)) {
      const [j, b] = z.tag, minuten = Math.round(1440 * (1 - j / ERDE_ALTER)), hh = Math.floor(minuten / 60) % 24, mm = minuten % 60;
      const svg = neuesBild("reise", stufe, { "data-bilder": "erdleiter", "data-wert": `${hh}:${String(mm).padStart(2, "0")}`, "data-anzahl": 1 });
      const cx = 120, cy = 72, R = 54;
      svg.append(tagGrund(), s("circle", { cx, cy, r: R, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 2 }));
      for (let h = 0; h < 24; h++) { const w = (h * Math.PI) / 12, l = h % 6 ? 4 : 8; svg.appendChild(s("line", { x1: cx + (R - l) * Math.sin(w), y1: cy - (R - l) * Math.cos(w), x2: cx + R * Math.sin(w), y2: cy - R * Math.cos(w), stroke: "#2d3047", "stroke-width": h % 6 ? 1 : 2 })); }
      for (const h of [0, 6, 12, 18]) { const w = (h * Math.PI) / 12; svg.appendChild(text(cx + (R - 17) * Math.sin(w), cy - (R - 17) * Math.cos(w) + 4, h, { gross: 10 })); }
      svg.appendChild(bildzeichen(cx, cy - R - 2, "🌍", 12));
      const winkel = (minuten / 1440) * 360, zeiger = s("g", {}, s("line", { x1: cx, y1: cy, x2: cx, y2: cy - R + 12, stroke: "#e5484d", "stroke-width": 2.6, "stroke-linecap": "round" }));
      if (ruhig) zeiger.setAttribute("transform", `rotate(${winkel} ${cx} ${cy})`);
      else zeiger.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `0 ${cx} ${cy}`, to: `${winkel} ${cx} ${cy}`, begin: t(0.2), dur: `${T}s`, fill: "freeze", calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }));
      svg.append(zeiger, s("circle", { cx, cy, r: 3.5, fill: "#2d3047" }), erscheine(s("g", { "data-stueck": "ereignis" }, bildzeichen(238, 56, b, 34), text(238, 104, `${hh}:${String(mm).padStart(2, "0")} Uhr`, { gross: 15 })), T + 0.1, ruhig, 0.3));
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
      if (sterne >= 3) svg.appendChild(funken(238, 130, ruhig));
      return svg;
    }
    if (!z || !Array.isArray(z.ereignisse) || z.ereignisse.length < 2 || z.ereignisse.length > 5 || !z.ereignisse.every(ok)) return null;
    const n = z.ereignisse.length, svg = neuesBild("reise", stufe, { "data-bilder": "erdleiter", "data-anzahl": n });
    svg.appendChild(tagGrund());
    const L = 26, R = 296, oben = Math.log10(ERDE_ALTER), X = j => L + ((oben - Math.log10(j)) / (oben - 4)) * (R - L);
    svg.append(s("line", { x1: L, y1: 92, x2: R, y2: 92, stroke: "#a8743f", "stroke-width": 3 }), s("line", { x1: L, y1: 108, x2: R, y2: 108, stroke: "#a8743f", "stroke-width": 3 }), bildzeichen(L - 10, 100, "🌍", 12));
    for (let e = 9; e >= 4; e--) {
      svg.appendChild(s("line", { x1: X(10 ** e), y1: 92, x2: X(10 ** e), y2: 108, stroke: "#a8743f", "stroke-width": 2.4 }));
      if (z.zahlen) svg.appendChild(text(X(10 ** e), 124, millionen(10 ** e), { gross: 9, fett: false }));
    }
    const sortiert = [...z.ereignisse].sort((a, b) => b[0] - a[0]);
    // die Bilder gleichmässig in der Folge der Zeit, eine Linie führt jedes genau an seine Stelle auf der Leiter (dort
    // liegen nahe Zeiten dicht beieinander, der Abstand ist logarithmisch)
    const bildX = i => 50 + (n > 1 ? (i * 220) / (n - 1) : 110);
    sortiert.forEach(([j, b], i) => svg.appendChild(vonOben(s("g", { "data-stueck": "ereignis", "data-jahre": j }, s("path", { d: `M${bildX(i)},${70} L${X(j)},${90}`, stroke: "#6b7089", "stroke-width": 1.2, "stroke-dasharray": "2 2", fill: "none" }),
      s("circle", { cx: X(j), cy: 92, r: 2.6, fill: "#e5484d" }), bildzeichen(bildX(i), 56, b, 22), z.zahlen ? text(bildX(i), 34, millionen(j), { gross: 9 }) : null), (i * T * 0.85) / n, ruhig, 24, 0.3)));
    const a = X(sortiert[0][0]), b = X(sortiert[n - 1][0]);
    svg.appendChild(bewege(s("g", {}, euleSitzend(0.16)), `M${a},90 L${b},90`, { x: b, y: 90, winkel: 0 }, ruhig, { drehen: false, linear: true }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(b, 86, ruhig)); // um die Eule: unten stehen die Zahlen der Leiter
    return svg;
  }

  // ----- Tageslauf-Sonne (ZYKLUS · sonnenbogen) -----
  // Plätze der Sonne auf dem Bogen wie im Spiel: links geht sie auf, rechts unter; die Nacht unter dem Horizont
  const SONNE_WINKEL = { morgen: 162, mittag: 90, nachmittag: 52, abend: 16 };
  /**
   * Die Sonne zieht über den Bogen bis zur letzten Tageszeit der Stufe, an jedem Platz erscheint das Bild der Tätigkeit
   * (Liste des Spiels); mit der Nacht geht sie rechts unter, Mond und Sterne kommen. Angabe: { zeiten: [Tageszeit …],
   * bilder: [Bild …], fremd? } (fremd: ein Bild, das nicht passt, wird gestrichen, s6) oder { woche: −2 … 2 } (Wochenplan
   * mit fünf Blättern, 🌞 über heute, s5).
   */
  function sonnenbogen(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (z && Number.isInteger(z.woche) && z.woche && Math.abs(z.woche) <= 2) {
      const svg = neuesBild("zyklus", stufe, { "data-bilder": "sonnenbogen", "data-wert": z.woche, "data-anzahl": 1 });
      svg.appendChild(tagGrund());
      const PLAN = ["🤸", "🏊", "🌲", "✂️", "🎵"], x = i => 40 + i * 60;
      PLAN.forEach((b, i) => {
        svg.append(s("rect", { x: x(i) - 24, y: 56, width: 48, height: 56, rx: 5, fill: "#ffffff", stroke: "#6b7089", "stroke-width": 1.4 }), s("rect", { x: x(i) - 24, y: 56, width: 48, height: 10, rx: 4, fill: "#e5484d" }), bildzeichen(x(i), 90, b, 22));
      });
      const ziel = 2 + z.woche;
      svg.append(bildzeichen(x(2), 34, "🌞", 20), erscheine(s("rect", { x: x(ziel) - 26, y: 54, width: 52, height: 60, rx: 6, fill: "none", stroke: "#f5b301", "stroke-width": 3, "data-stueck": "tag" }), T, ruhig),
        zeichne(s("path", { d: `M${x(2)},124 Q${(x(2) + x(ziel)) / 2},${146} ${x(ziel)},124`, fill: "none", stroke: "#e5484d", "stroke-width": 2 }), 0.3, ruhig, T * 0.7),
        erscheine(text((x(2) + x(ziel)) / 2, 140, (z.woche > 0 ? "+" : "−") + Math.abs(z.woche), { gross: 12, farbe: "#e5484d" }), T, ruhig));
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
      if (sterne >= 3) svg.appendChild(funken(30, 24, ruhig));
      return svg;
    }
    const ORTE = [...Object.keys(SONNE_WINKEL), "nacht"];
    if (!z || !Array.isArray(z.zeiten) || !z.zeiten.length || !z.zeiten.every((o, i) => ORTE.includes(o) && (!i || ORTE.indexOf(o) > ORTE.indexOf(z.zeiten[i - 1]))) || !Array.isArray(z.bilder) || z.bilder.length !== z.zeiten.length) return null;
    const svg = neuesBild("zyklus", stufe, { "data-bilder": "sonnenbogen", "data-anzahl": z.zeiten.length, "data-ziel": z.zeiten[z.zeiten.length - 1] });
    const cx = 160, cy = 108, r = 86, pos = (w, rad = r) => [cx + rad * Math.cos((w * Math.PI) / 180), cy - rad * Math.sin((w * Math.PI) / 180)];
    // Morgenrot links, Abendrot rechts als weiche Bögen am Horizont (Farben des Spiels)
    svg.append(tagGrund(), s("path", { d: `M0,${cy} L0,62 Q56,66 92,${cy} Z`, fill: "#ffe3c4", opacity: 0.8 }), s("path", { d: `M${BREITE},${cy} L${BREITE},62 Q264,66 228,${cy} Z`, fill: "#ffcfa3", opacity: 0.8 }),
      s("path", { d: `M0,${cy} H${BREITE} V136 Q${BREITE},${HOEHE} ${BREITE - 14},${HOEHE} H14 Q0,${HOEHE} 0,136 Z`, fill: "#26315f" }),
      s("path", { d: `M${cx - r},${cy} A${r},${r} 0 0,1 ${cx + r},${cy}`, fill: "none", stroke: "#f5b301", "stroke-width": 1.6, "stroke-dasharray": "4 3" }));
    for (const [sx, sy] of [[30, 124], [70, 138], [110, 120], [210, 128], [250, 140], [292, 122]]) svg.appendChild(s("circle", { cx: sx, cy: sy, r: 1.2, fill: "#fff6c8" }));
    const tag = z.zeiten.filter(o => o !== "nacht"), nacht = z.zeiten.includes("nacht");
    const letzter = nacht ? 0 : SONNE_WINKEL[tag[tag.length - 1]], [ex, ey] = pos(letzter);
    const sonneG = s("g", {}, s("circle", { cx: 0, cy: 0, r: 11, fill: "#f5b301" }), ...[...Array(8).keys()].map(i => s("line", { x1: 14 * Math.cos(i * 0.785), y1: 14 * Math.sin(i * 0.785), x2: 18 * Math.cos(i * 0.785), y2: 18 * Math.sin(i * 0.785), stroke: "#f5b301", "stroke-width": 2, "stroke-linecap": "round" })));
    const dauer = nacht ? T * 0.75 : T * ((180 - letzter) / 180);
    const sonneBild = bewege(sonneG, `M${cx - r},${cy} A${r},${r} 0 0,1 ${ex},${ey}`, { x: ex, y: ey, winkel: 0 }, ruhig, { drehen: false, dauer: Math.max(0.6, dauer), linear: true });
    svg.appendChild(nacht ? verschwinde(sonneBild, T * 0.75, ruhig) : sonneBild);
    z.zeiten.forEach((o, i) => {
      const [bx, by] = o === "nacht" ? [cx, 128] : pos(SONNE_WINKEL[o], r - 30), ab = o === "nacht" ? T * 0.8 : Math.max(0.1, dauer * ((180 - SONNE_WINKEL[o]) / Math.max(1, 180 - letzter)));
      svg.appendChild(erscheine(s("g", { "data-stueck": "tageszeit", "data-zeit": o }, bildzeichen(bx, by, z.bilder[i], 20)), o === "nacht" ? ab : Math.min(ab, dauer), ruhig, 0.3));
    });
    if (nacht) svg.appendChild(erscheine(bildzeichen(206, 128, "🌙", 16), T * 0.8, ruhig));
    if (z.fremd) svg.appendChild(erscheine(s("g", { "data-fremd": z.fremd }, bildzeichen(34, 30, z.fremd, 20), s("path", { d: "M22,18 L46,42 M46,18 L22,42", stroke: "#e5484d", "stroke-width": 2.6, "stroke-linecap": "round" })), T, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(sternschnuppe(ruhig));
    return svg;
  }

  // ----- Kulturen-Koffer (SAMMELN · koffer) -----
  // Dinge je Kultur aus der Liste des Spiels (dinge.js, nur die mit Bildzeichen)
  const KULTUR_DINGE = {
    pfahlbauer: ["🛶", "🪵", "🧺", "🏞️", "🪨"], roemer: ["🏺", "🧩", "⚔️", "🏛️"], aegypten: ["📜", "🌊", "🦁", "🪲", "🐈"],
    china: ["🧱", "🧵", "📄", "🍵", "🍚"], griechen: ["🏛️", "🏅", "🎭", "⚡"],
  };
  /** Zeichen der Kultur auf dem Deckel: Pfahlbau, Schild, Pyramiden, Drache, Tempel (wie die Körbe im Spiel). */
  function kulturZeichen(kultur, x, y) {
    if (kultur === "roemer") return bildzeichen(x, y, "🛡️", 14);
    if (kultur === "china") return bildzeichen(x, y, "🐉", 14);
    if (kultur === "pfahlbauer") return s("g", {}, s("path", { d: `M${x - 9},${y - 1} L${x},${y - 9} L${x + 9},${y - 1} Z`, fill: "#a8743f" }), s("rect", { x: x - 7, y: y - 1, width: 14, height: 5, fill: "#c08a4f" }),
      s("path", { d: `M${x - 5},${y + 4} v6 M${x},${y + 4} v6 M${x + 5},${y + 4} v6`, stroke: "#6b4a2b", "stroke-width": 1.2 }), s("line", { x1: x - 11, y1: y + 8, x2: x + 11, y2: y + 8, stroke: "#5aa9dc", "stroke-width": 1.4 }));
    if (kultur === "aegypten") return s("path", { d: `M${x - 11},${y + 8} L${x - 3},${y - 6} L${x + 5},${y + 8} Z M${x + 1},${y + 8} L${x + 6},${y - 1} L${x + 11},${y + 8} Z`, fill: "#e3c77a", stroke: "#b8962a", "stroke-width": 0.6 });
    return s("g", {}, s("path", { d: `M${x - 11},${y - 3} L${x},${y - 9} L${x + 11},${y - 3} Z`, fill: "#e4e6ec", stroke: "#8a8fa8", "stroke-width": 0.6 }),
      s("path", { d: `M${x - 8},${y - 2} v9 M${x - 3},${y - 2} v9 M${x + 3},${y - 2} v9 M${x + 8},${y - 2} v9`, stroke: "#8a8fa8", "stroke-width": 1.6 }), s("rect", { x: x - 11, y: y + 7, width: 22, height: 2, fill: "#8a8fa8" }));
  }
  /**
   * Der Koffer geht auf, Fach um Fach (je Kultur ein Fach mit ihrem Zeichen auf dem Deckel) fallen die Dinge hinein.
   * Angabe: { faecher: [{ kultur, dinge: [Bild …] }] } (jedes Ding geprüft gegen die Liste), dazu gab?: { kultur,
   * dinge: [[Bild, ja/nein] …] } (Gab es das? s4) und zu? (der Koffer klappt zu, s6).
   */
  function koffer(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    const fachOk = f => f && KULTUR_DINGE[f.kultur] && Array.isArray(f.dinge) && f.dinge.length >= 1 && f.dinge.length <= 3 && f.dinge.every(d => KULTUR_DINGE[f.kultur].includes(d));
    const gabOk = g => g && KULTUR_DINGE[g.kultur] && Array.isArray(g.dinge) && g.dinge.length >= 2 && g.dinge.length <= 4 && g.dinge.every(([b, ja]) => typeof b === "string" && typeof ja === "boolean");
    if (!z || (z.faecher === undefined) === (z.gab === undefined)) return null;
    if (z.faecher && (!Array.isArray(z.faecher) || !z.faecher.length || z.faecher.length > 5 || !z.faecher.every(fachOk))) return null;
    if (z.gab && !gabOk(z.gab)) return null;
    const faecher = z.faecher || [{ kultur: z.gab.kultur, dinge: z.gab.dinge.map(d => d[0]) }], anzahl = faecher.reduce((a, f) => a + f.dinge.length, 0);
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "koffer", "data-anzahl": anzahl });
    // der offene Deckel oben (mit den Zeichen der Kulturen), darunter der Koffer mit den Fächern
    const deckelOffen = s("g", {}, s("rect", { x: 30, y: 8, width: 260, height: 40, rx: 6, fill: "#b8743a", stroke: "#6b4a2b", "stroke-width": 1.4 }));
    svg.append(tagGrund(), deckelOffen, s("rect", { x: 30, y: 54, width: 260, height: 84, rx: 6, fill: "#9a5b2a", stroke: "#6b4a2b", "stroke-width": 1.4 }),
      s("rect", { x: 36, y: 60, width: 248, height: 72, rx: 4, fill: "#f3e3c3" }));
    const fb = 248 / faecher.length;
    let k = 0;
    faecher.forEach((f, i) => {
      const x0 = 36 + i * fb, mx = x0 + fb / 2;
      if (i) svg.appendChild(s("line", { x1: x0, y1: 60, x2: x0, y2: 132, stroke: "#9a5b2a", "stroke-width": 2 }));
      deckelOffen.append(s("circle", { cx: mx, cy: 28, r: 13, fill: "#f3e3c3" }), kulturZeichen(f.kultur, mx, 28));
      f.dinge.forEach((d, j) => {
        const x = mx + (j - (f.dinge.length - 1) / 2) * Math.min(28, fb / f.dinge.length), y = z.gab ? 82 : 98, ja = z.gab?.dinge[j][1];
        svg.appendChild(vonOben(s("g", { "data-stueck": "ding", ...(z.gab ? { "data-gab": String(ja) } : {}) }, bildzeichen(x, y, d, 20)), 0.2 + (k++ * T * 0.7) / anzahl, ruhig, 60, 0.4));
        if (z.gab) svg.appendChild(erscheine(bildzeichen(x, 116, ja ? "✅" : "❌", 13), 0.6 + ((k - 1) * T * 0.7) / anzahl, ruhig, 0.2));
      });
    });
    if (z.zu) {
      // der Deckel klappt zu: der geschlossene Koffer mit den Zeichen als Aufkleber
      const deckel = s("g", { "data-zu": "ja" }, s("rect", { x: 30, y: 54, width: 260, height: 84, rx: 6, fill: "#b8743a", stroke: "#6b4a2b", "stroke-width": 1.4 }), s("rect", { x: 148, y: 46, width: 24, height: 10, rx: 4, fill: "none", stroke: "#6b4a2b", "stroke-width": 3 }),
        s("rect", { x: 154, y: 56, width: 12, height: 8, rx: 2, fill: "#e3b341" }));
      faecher.forEach((f, i) => deckel.append(s("circle", { cx: 66 + i * 47, cy: 100, r: 15, fill: "#f3e3c3" }), kulturZeichen(f.kultur, 66 + i * 47, 100)));
      svg.appendChild(vonOben(deckel, T + 0.2, ruhig, 46, 0.4));
      verschwinde(deckelOffen, T + 0.2, ruhig, 0.2); // der Deckel ist zugeklappt
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 20, 140 - 18, ruhig));
    return svg;
  }

  // ----- Echt oder erfunden? (SAMMELN · wolkenschloss) -----
  // Merkmale des Erfundenen wie im Spiel: Tier spricht, Ding bewegt sich von selbst, Fabelwesen, Zauber, Unmögliches
  const MERKMAL_BILD = { spricht: "💬", bewegt: "💨", fabelwesen: "🦄", zauber: "✨", unmoeglich: "🦸" };
  /**
   * Links die Erde 🌍 (kann es geben), rechts das Wolkenschloss (erfunden); die Bilder der Aussagen fliegen an ihren Ort,
   * beim Erfundenen mit dem Merkmal. Angabe: { echt: [Bild …], erfunden: [Bild | [Bild, Merkmal] …] }.
   */
  function wolkenschloss(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], bild = b => typeof b === "string" && b.length;
    if (!z || !Array.isArray(z.echt) || !Array.isArray(z.erfunden) || z.echt.length > 4 || z.erfunden.length > 4 || !z.echt.every(bild)
      || !z.erfunden.every(e => bild(e) || (Array.isArray(e) && e.length === 2 && bild(e[0]) && MERKMAL_BILD[e[1]]))) return null;
    const anzahl = z.echt.length + z.erfunden.length;
    if (!anzahl) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "wolkenschloss", "data-anzahl": anzahl });
    svg.append(tagGrund(), boden(), s("circle", { cx: 72, cy: 104, r: 34, fill: "#2f7fd6" }), s("path", { d: "M50,86 Q62,78 70,92 Q78,104 66,114 Q56,108 50,96 Z M80,80 Q96,84 98,100 Q90,112 84,100 Z", fill: "#86c46f" }));
    // das Wolkenschloss: Wolke mit Türmen in Rosa
    svg.append(s("path", { d: "M200,100 Q196,84 214,84 Q218,68 238,74 Q252,62 266,76 Q290,74 290,94 Q300,104 286,110 L206,110 Q194,108 200,100 Z", fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.4 }),
      s("path", { d: "M222,84 v-26 h10 v26 M258,84 v-34 h12 v34 M238,76 v-16 h14 v16", fill: "#f8c8dc", stroke: "#e0569a", "stroke-width": 1 }), s("path", { d: "M220,58 L227,46 L234,58 Z M256,50 L264,36 L272,50 Z", fill: "#e0569a" }));
    const T = DAUER * 0.8;
    let k = 0;
    z.echt.forEach((b, i) => { const x = 56 + (i % 2) * 32, y = 96 + Math.floor(i / 2) * 22 - 14; svg.appendChild(herein(s("g", { "data-stueck": "echt" }, bildzeichen(x, y, b, 20)), 160 - x, 20 - y, 0.2 + (k++ * T * 0.8) / anzahl, ruhig, 0.45)); });
    z.erfunden.forEach((e, i) => {
      const [b, m] = Array.isArray(e) ? e : [e, null], x = 222 + (i % 2) * 42, y = 92 + Math.floor(i / 2) * 18 - 30;
      svg.appendChild(herein(s("g", { "data-stueck": "erfunden", ...(m ? { "data-merkmal": m } : {}) }, bildzeichen(x, y, b, 20), m ? bildzeichen(x + 16, y - 10, MERKMAL_BILD[m], 11) : null), 160 - x, 20 - y, 0.2 + (k++ * T * 0.8) / anzahl, ruhig, 0.45));
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(150, 30, ruhig));
    return svg;
  }

  // ----- Gemeinde-Helfer (KARTE · dorfplan) -----
  // Plätze auf dem Dorfplan: das Gemeindehaus in der Mitte, die Einrichtungen der Liste rundherum
  const DORF_PLATZ = {
    "🏛️": [160, 66], "🚒": [56, 36], "🏥": [264, 36], "📚": [110, 112], "📮": [210, 112], "🏫": [40, 104], "🏊": [282, 104],
    "🚜": [112, 30], "👮": [208, 30], "♻️": [24, 66], "🧤": [296, 66], "⚖️": [160, 126], "🥐": [80, 70], "💇": [240, 70], "🔧": [128, 86], "🛒": [192, 86],
  };
  const PRIVAT = ["🥐", "💇", "🔧", "🛒"];
  /**
   * Die Eule fliegt über den Dorfplan zu den Einrichtungen der Stufe, sie leuchten auf; private Betriebe mit
   * orangem Dach (🏪 wie im Spiel). Angabe: { orte: [Bild …], notruf?: [Nummer, Bild] } (notruf: die Nummer am Ort, s3),
   * { ebenen: true } (Gemeinde 🏘️, Kanton 🏞️, Bund 🇨🇭, s5) oder { ablauf: [Bild …] } (fünf Schritte, s6).
   */
  function dorfplan(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (z && z.ebenen === true) {
      const svg = neuesBild("karte", stufe, { "data-bilder": "dorfplan", "data-anzahl": 3 });
      svg.appendChild(tagGrund());
      // die Ringe von aussen nach innen, das Zeichen je Ebene in ihrem Ring rechts der Mitte
      [["🇨🇭", 140, 64, "#fbe3e3", 280], ["🏞️", 96, 44, "#e3f1dc", 236], ["🏘️", 52, 24, "#fff1c2", 192]].forEach(([b, rx, ry, farbe, bx], i) =>
        svg.appendChild(erscheine(s("g", { "data-stueck": "ebene" }, s("ellipse", { cx: 160, cy: 76, rx, ry, fill: farbe, stroke: "#8a8fa8", "stroke-width": 1.4 }), bildzeichen(bx, 76, b, 16)), (i * T) / 3, ruhig, 0.4)));
      svg.appendChild(bildzeichen(160, 80, "🏛️", 18));
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
      if (sterne >= 3) svg.appendChild(funken(30, 24, ruhig));
      return svg;
    }
    if (z && Array.isArray(z.ablauf) && z.ablauf.length === 5 && z.ablauf.every(b => typeof b === "string" && b.length)) {
      const svg = neuesBild("karte", stufe, { "data-bilder": "dorfplan", "data-anzahl": 5 });
      svg.appendChild(tagGrund());
      const x = i => 34 + i * 63;
      z.ablauf.forEach((b, i) => {
        svg.appendChild(erscheine(s("g", { "data-stueck": "schritt" }, s("rect", { x: x(i) - 22, y: 52, width: 44, height: 44, rx: 8, fill: "#ffffff", style: `stroke:var(--deko-${(i % 6) + 1})`, "stroke-width": 2 }), bildzeichen(x(i), 74, b, 24),
          text(x(i), 112, i + 1, { gross: 11 })), (i * T * 0.85) / 5, ruhig, 0.3));
        if (i < 4) svg.appendChild(erscheine(s("path", { d: `M${x(i) + 25},74 l12,0 m-4,-4 l4,4 l-4,4`, stroke: "#6b7089", "stroke-width": 1.6, fill: "none" }), ((i + 0.6) * T * 0.85) / 5, ruhig));
      });
      svg.appendChild(bewege(s("g", {}, euleSitzend(0.16)), `M${x(0)},50 L${x(4)},50`, { x: x(4), y: 50, winkel: 0 }, ruhig, { drehen: false, linear: true }));
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
      if (sterne >= 3) svg.appendChild(funken(30, 26, ruhig));
      return svg;
    }
    if (!z || !Array.isArray(z.orte) || !z.orte.length || z.orte.length > 6 || !z.orte.every(o => DORF_PLATZ[o]) || new Set(z.orte).size !== z.orte.length) return null;
    if (z.notruf !== undefined && (!Array.isArray(z.notruf) || ![117, 118, 144, 112].includes(z.notruf[0]) || !z.orte.includes(z.notruf[1]))) return null;
    const svg = neuesBild("karte", stufe, { "data-bilder": "dorfplan", "data-anzahl": z.orte.length });
    svg.append(s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#cfe8b8" }), s("path", { d: "M4,50 H316 M4,96 H316 M140,4 V146 M180,4 V146", stroke: "#f4f1e6", "stroke-width": 7 }));
    // Häuser der übrigen Plätze ohne Bild, damit es ein Dorf ist
    for (const [b, [x, y]] of Object.entries(DORF_PLATZ)) if (!z.orte.includes(b)) svg.appendChild(s("path", { d: `M${x - 7},${y + 6} V${y - 1} L${x},${y - 7} L${x + 7},${y - 1} V${y + 6} Z`, fill: "#e4e6ec", stroke: "#a8adbf", "stroke-width": 0.8 }));
    const je = (T * 0.85) / z.orte.length;
    z.orte.forEach((b, i) => {
      const [x, y] = DORF_PLATZ[b], privat = PRIVAT.includes(b);
      svg.append(s("path", { d: `M${x - 13},${y + 11} V${y - 2} L${x},${y - 13} L${x + 13},${y - 2} V${y + 11} Z`, fill: "#ffffff", stroke: privat ? "#f07c2a" : "#6b7089", "stroke-width": 1.4 }),
        s("path", { d: `M${x - 15},${y - 1} L${x},${y - 14} L${x + 15},${y - 1}`, fill: "none", stroke: privat ? "#f07c2a" : "#6b7089", "stroke-width": 3 }), bildzeichen(x, y + 2, b, 14),
        erscheine(s("circle", { cx: x, cy: y, r: 17, fill: "#f5b301", opacity: 0.35, "data-stueck": "ort" }), (i + 0.8) * je, ruhig, 0.25));
    });
    if (z.notruf) {
      // das Schild mit der Nummer unter dem Haus (dort liegt die Strasse, kein Nachbarhaus)
      const [nr, b] = z.notruf, [x, y] = DORF_PLATZ[b], ly = y + 22;
      svg.appendChild(erscheine(s("g", { "data-notruf": nr }, s("rect", { x: x - 22, y: ly - 9, width: 44, height: 18, rx: 6, fill: "#e5484d" }), text(x, ly + 4.5, `☎ ${nr}`, { gross: 12, farbe: "#ffffff" })), T + 0.1, ruhig));
    }
    const weg = "M" + [[0, 140], ...z.orte.map(b => DORF_PLATZ[b].map((v, j) => (j ? v - 18 : v)))].map(p => p.join(",")).join(" L"), [lx, ly] = DORF_PLATZ[z.orte[z.orte.length - 1]];
    svg.appendChild(bewege(s("g", {}, euleSitzend(0.15)), weg, { x: lx, y: ly - 18, winkel: 0 }, ruhig, { drehen: false, linear: true }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 138, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 126, ruhig));
    return svg;
  }

  // ----- Schulweg-Profi (KARTE · schulweg) -----
  const WEG_TEILE = ["trottoir", "randstein", "streifen", "auto", "ampel", "velo", "schule"];
  /**
   * Von oben: Trottoir, Strasse, Trottoir, rechts das Schulhaus. Das Kind geht auf dem Trottoir, wartet am Randstein, am
   * gelben Fussgängerstreifen (gelb wie in der Schweiz) erscheinen ✋ 👀 👂 🚶 (warte, luege, lose, laufe), ein Auto von
   * links hält an (das Rad steht), das Lichtsignal wird grün, ein Velo fährt rechts. Angabe: Liste der Teile der Stufe.
   */
  function schulweg(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!Array.isArray(z) || !z.length || !z.every(x => WEG_TEILE.includes(x)) || new Set(z).size !== z.length) return null;
    const hat = x => z.includes(x), ueber = hat("streifen") || hat("ampel");
    const svg = neuesBild("karte", stufe, { "data-bilder": "schulweg", "data-wert": z.join(",") });
    svg.append(s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#a8d68a" }), s("rect", { x: 0, y: 40, width: BREITE, height: 16, fill: "#dfe2ea" }),
      s("rect", { x: 0, y: 56, width: BREITE, height: 44, fill: "#6b7089" }), s("rect", { x: 0, y: 100, width: BREITE, height: 16, fill: "#dfe2ea" }),
      s("line", { x1: 0, y1: 78, x2: BREITE, y2: 78, stroke: "#ffffff", "stroke-width": 1.6, "stroke-dasharray": "10 8" }));
    if (hat("streifen")) for (let i = 0; i < 5; i++) svg.appendChild(s("rect", { x: 150, y: 58 + i * 8.6, width: 30, height: 5, fill: "#f5d000" }));
    if (hat("schule") || z.length === 1) svg.appendChild(bildzeichen(292, 130, "🏫", 24));
    const T = DAUER * 0.85, kurb = 148;
    // Weg des Kinds: auf dem Trottoir bis zum Randstein, über den Streifen, dann zur Schule
    const punkte = [[18, 48], [hat("randstein") || ueber ? kurb : 120, 48]];
    if (ueber) punkte.push([165, 108]);
    if (hat("schule")) punkte.push([270, 108]);
    const warten = hat("randstein") || ueber ? 0.35 : 0, teil1 = ueber ? T * 0.4 : T, weg1 = `M${punkte[0]} L${punkte[1]}`;
    const kind = s("g", {}, bildzeichen(0, -8, "🧒", 22));
    const ende = punkte[punkte.length - 1];
    if (ruhig) svg.appendChild(bewege(kind, weg1, { x: ende[0], y: ende[1], winkel: 0 }, true));
    else {
      kind.setAttribute("opacity", "0");
      kind.append(s("set", { attributeName: "opacity", to: 1, begin: t(0), fill: "freeze" }), s("animateMotion", { path: weg1, begin: t(0), dur: `${teil1}s`, fill: "freeze" }));
      if (punkte.length > 2) kind.appendChild(s("animateMotion", { path: `M${punkte.slice(1).map(p => p.join(",")).join(" L")}`, begin: t(teil1 + warten + (ueber ? T * 0.4 : 0)), dur: `${T * 0.4}s`, fill: "freeze" }));
      svg.appendChild(kind);
    }
    if (hat("randstein")) svg.appendChild(erscheine(s("rect", { x: kurb + 8, y: 54, width: 3, height: 4, fill: "#2d3047", "data-randstein": "ja" }), teil1, ruhig));
    if (hat("streifen")) ["✋", "👀", "👂", "🚶"].forEach((b, i) => svg.appendChild(erscheine(bildzeichen(98 + i * 22, 22, b, 15), teil1 + (i * T * 0.4) / 4, ruhig, 0.2)));
    if (hat("auto")) {
      // das Auto kommt von links des Kinds (Spur oben fährt nach links) und hält vor dem Streifen
      const auto = s("g", {}, bildzeichen(0, 0, "🚗", 20));
      svg.appendChild(bewege(auto, `M${BREITE + 20},67 L196,67`, { x: 196, y: 67, winkel: 0 }, ruhig, { drehen: false, dauer: teil1 + 0.3 }));
    }
    if (hat("ampel")) {
      // das Lichtsignal für Fussgänger rechts neben dem Streifen (oben rot, unten grün wie im Spiel)
      svg.append(s("rect", { x: 188, y: 4, width: 18, height: 34, rx: 3, fill: "#2d3047" }), kurz(s("circle", { cx: 197, cy: 13, r: 6, fill: "#e5322d" }), 0, teil1 + 0.2, ruhig),
        erscheine(s("circle", { cx: 197, cy: 29, r: 6, fill: "#1fa84f", "data-gruen": "ja" }), teil1 + 0.2, ruhig, 0.2));
    }
    if (hat("velo")) {
      // Velo mit Helm auf der rechten Strassenseite (in Fahrtrichtung rechts: die untere Spur fährt nach rechts)
      svg.appendChild(bewege(s("g", {}, s("g", { transform: "scale(-1 1)" }, bildzeichen(0, -2, "🚴", 24))), "M-20,90 L150,90", { x: 150, y: 90, winkel: 0 }, ruhig, { drehen: false, dauer: T }));
    }
    if (z.length === 1 && hat("trottoir")) svg.appendChild(erscheine(bildzeichen(150, 22, "✅", 16), T, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 40, 24, ruhig));
    return svg;
  }

  Object.assign(BILDER.bauen, { satzzug, korrektur, wortpuzzle, faecher, gedicht });
  Object.assign(BILDER.sammeln, { girlande, kommas, wortkoerbe, labor, regal, koffer, wolkenschloss });
  Object.assign(BILDER.zoom, { fehlersuche });
  Object.assign(BILDER.reise, { zeitband, zeitreise, erdleiter });
  Object.assign(BILDER.auftritt, { rede, reporter, gefuehle, lagerfeuer });
  Object.assign(BILDER.zyklus, { jahresrad, sonnenbogen });
  Object.assign(BILDER.wachsen, { lebenslinie });
  Object.assign(BILDER.karte, { dorfplan, schulweg });

  // ---------- Bilder Block C: NMG Rest (Forschen, Körper, Orientierung, Tiere, Wetter, Wirtschaft; LERN_Session30) ----------
  // Wie die Blöcke davor: jedes Bild folgt den Stufen seines Spiels und prüft, was es zeigt; Bildzeichen und Farben wie
  // in den Spielen (Nordpol rot, Südpol grün; sauerstoffreiches Blut rot, armes blau; Braille-Punkte nach der Tafel).

  // ----- Magnet-Labor (SAMMELN · magnet) -----
  const POL_FARBE = { N: "#e5484d", S: "#2fbf71" }; // wie im Spiel: Nordpol rot, Südpol grün
  const MAGNET_AN = ["📎", "🔩", "✂️", "🧷"], MAGNET_NICHT = ["🪵", "📄", "✏️", "🏀", "🪶", "🍎", "🧶", "🥛"];
  /** Stabmagnet aus zwei Feldern (Pole a, b), Mitte bei x, y; „?“ = noch leeres Feld wie im Spiel. */
  function stabmagnet(x, y, [a, b]) {
    const feld = (dx, p) => s("g", {}, s("rect", { x: x + dx, y: y - 11, width: 30, height: 22, fill: p === "?" ? "#c9ccd6" : POL_FARBE[p], stroke: "#2d3047", "stroke-width": 0.8 }),
      text(x + dx + 15, y + 4.5, p, { gross: 12, farbe: "#ffffff" }));
    return s("g", { "data-pole": a + b }, feld(-30, a), feld(0, b));
  }
  /**
   * { an: [Bild …], nicht: [Bild …] } — der Hufeisenmagnet zieht an, was aus Eisen ist (Liste des Spiels); { pole:
   * [[a, b], [c, d]], wahl? } — zwei Stabmagnete: verschiedene Pole in der Mitte ziehen sich an, gleiche stossen sich
   * ab (geprüft); wahl: das Feld rechts in der Mitte ist erst leer und wird zum Pol, der anzieht; { durch: Bild } — der
   * Magnet wirkt durch Papier; { kompass: true } — die Nadel dreht nach Norden; { strom: true } — ein Elektromagnet.
   */
  function magnet(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "magnet" });
    svg.appendChild(tagGrund());
    const hufeisen = (x, y) => s("g", {}, s("path", { d: `M${x - 22},${y} V${y - 18} A22,22 0 0,1 ${x + 22},${y - 18} V${y}`, fill: "none", stroke: "#e5484d", "stroke-width": 10 }),
      s("rect", { x: x - 27, y: y - 2, width: 10, height: 8, fill: "#c9ccd3" }), s("rect", { x: x + 17, y: y - 2, width: 10, height: 8, fill: "#c9ccd3" }));
    if (Array.isArray(z.an) && Array.isArray(z.nicht)) {
      if (!z.an.length || !z.an.every(d => MAGNET_AN.includes(d)) || !z.nicht.every(d => MAGNET_NICHT.includes(d)) || z.an.length + z.nicht.length > 6) return null;
      svg.setAttribute("data-anzahl", z.an.length);
      svg.append(s("rect", { x: 20, y: 120, width: 280, height: 8, rx: 3, fill: "#a8743f" }), hufeisen(160, 44));
      const alle = [...z.an.map(d => [d, true]), ...z.nicht.map(d => [d, false])];
      alle.forEach(([d, an], i) => {
        const x = 50 + (i * 220) / Math.max(1, alle.length - 1), zx = 150 + (z.an.indexOf(d) * 20) - (z.an.length - 1) * 10 + 10, ab = 0.3 + (i * T * 0.6) / alle.length;
        const g = s("g", an ? { "data-stueck": "zieht" } : {}, bildzeichen(an ? zx : x, an ? 60 : 108, d, 20));
        svg.appendChild(an ? herein(g, x - zx, 48, ab, ruhig, 0.4) : g);
        if (!an) svg.appendChild(erscheine(bildzeichen(x + 13, 96, "🚫", 10), T, ruhig));
      });
    } else if (Array.isArray(z.pole)) {
      const ok = p => Array.isArray(p) && p.length === 2 && ((p[0] === "N" && p[1] === "S") || (p[0] === "S" && p[1] === "N"));
      if (z.pole.length !== 2 || !ok(z.pole[0]) || !ok(z.pole[1])) return null;
      const anziehen = z.pole[0][1] !== z.pole[1][0], rechts = z.wahl ? ["?", z.pole[1][1]] : z.pole[1];
      svg.setAttribute("data-wert", anziehen ? "anziehen" : "abstossen");
      const L = s("g", {}, stabmagnet(100, 76, z.pole[0])), Rg = s("g", {}, stabmagnet(222, 76, rechts));
      if (z.wahl) Rg.appendChild(erscheine(s("g", {}, s("rect", { x: 192, y: 65, width: 30, height: 22, fill: POL_FARBE[z.pole[1][0]], stroke: "#2d3047", "stroke-width": 0.8 }),
        text(207, 80.5, z.pole[1][0], { gross: 12, farbe: "#ffffff" })), T * 0.35, ruhig, 0.3));
      // anziehen: beide rücken zusammen; abstossen: sie rücken auseinander
      const d = anziehen ? 26 : -22;
      svg.append(schiebe(L, d, 0, T * 0.5, ruhig, { dauer: 0.5 }), schiebe(Rg, -d, 0, T * 0.5, ruhig, { dauer: 0.5 }));
      svg.appendChild(erscheine(bildzeichen(160, 122, anziehen ? "🤝" : "↔️", 22), T + 0.1, ruhig));
    } else if (z.durch) {
      if (z.durch !== "📄") return null;
      svg.append(hufeisen(160, 52), s("rect", { x: 112, y: 70, width: 96, height: 6, fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 1 }),
        herein(s("g", { "data-stueck": "zieht" }, bildzeichen(160, 88, "📎", 20)), 0, 28, 0.4, ruhig, 0.5), s("rect", { x: 20, y: 120, width: 280, height: 8, rx: 3, fill: "#a8743f" }));
    } else if (z.kompass) {
      svg.append(s("circle", { cx: 160, cy: 74, r: 50, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 2 }), text(160, 36, "N", { gross: 12 }), text(160, 122, "S", { gross: 12 }),
        text(122, 78, "W", { gross: 12 }), text(198, 78, "O", { gross: 12 }));
      const nadel = s("g", {}, s("path", { d: "M160,40 L166,74 L154,74 Z", fill: "#e5484d" }), s("path", { d: "M160,108 L166,74 L154,74 Z", fill: "#8a8fa8" }), s("circle", { cx: 160, cy: 74, r: 3, fill: "#2d3047" }));
      if (ruhig) svg.appendChild(nadel);
      else { nadel.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", values: "110 160 74;-25 160 74;12 160 74;0 160 74", keyTimes: "0;0.5;0.8;1", begin: t(0.2), dur: `${T}s`, fill: "freeze" })); svg.appendChild(nadel); }
    } else if (z.strom) {
      // Elektromagnet: Batterie, Draht um einen Nagel; mit Strom hängen Büroklammern am Nagel
      svg.append(s("rect", { x: 40, y: 60, width: 30, height: 40, rx: 3, fill: "#2d3047" }), s("rect", { x: 49, y: 54, width: 12, height: 6, fill: "#8a8fa8" }),
        s("rect", { x: 130, y: 66, width: 110, height: 10, rx: 2, fill: "#9aa1ab" }), s("path", { d: "M244,71 L254,71", stroke: "#9aa1ab", "stroke-width": 4 }));
      for (let i = 0; i < 9; i++) svg.appendChild(s("ellipse", { cx: 140 + i * 11, cy: 71, rx: 3, ry: 9, fill: "none", stroke: "#c8553d", "stroke-width": 1.6 }));
      svg.appendChild(zeichne(s("path", { d: "M55,54 V36 H140 V62 M232,80 V112 H55 V100", fill: "none", stroke: "#c8553d", "stroke-width": 2 }), 0.1, ruhig, 0.6));
      for (let i = 0; i < 3; i++) svg.appendChild(herein(s("g", { "data-stueck": "zieht" }, bildzeichen(170 + i * 24, 92, "📎", 16)), 0, 30, 0.8 + i * 0.25, ruhig, 0.35));
      svg.appendChild(erscheine(bildzeichen(55, 120, "⚡", 14), 0.6, ruhig));
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Schwimmt oder sinkt? (SAMMELN · wanne) -----
  const SCHWIMMT = ["🪵", "🍎", "🍃", "🕯️", "🏓", "🪶", "🧊", "🍌"], SINKT = ["🪨", "🔩", "🔑", "🪙", "🥄", "🥔", "💍", "🔨"];
  /**
   * Die Dinge fallen in die Wanne: was schwimmt (Liste des Spiels), bleibt oben, was sinkt, geht zu Boden; 🛟 und ⬇️ wie
   * die Körbe. Angabe: { dinge: [Bild …] } (2–8), schiff?: ein Schiff aus Metall schwimmt und trägt die Eule (s5).
   */
  function wanne(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.dinge) || z.dinge.length > 8 || !z.dinge.every(d => SCHWIMMT.includes(d) || SINKT.includes(d)) || (!z.dinge.length && !z.schiff)) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "wanne", "data-anzahl": z.dinge.length });
    svg.append(tagGrund(), s("path", { d: "M26,52 L294,52 L280,134 Q278,142 268,142 L52,142 Q42,142 40,134 Z", fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 2 }),
      s("path", { d: "M33,66 L287,66 L279,132 Q277,138 268,138 L52,138 Q43,138 41,132 Z", fill: "#7fc4ec", opacity: 0.85 }), bildzeichen(18, 66, "🛟", 12), bildzeichen(18, 128, "⬇️", 12));
    const n = z.dinge.length, T = DAUER * 0.8;
    z.dinge.forEach((d, i) => {
      const oben = SCHWIMMT.includes(d), x = 60 + (n > 1 ? (i * (z.schiff ? 120 : 200)) / (n - 1) : 100), y = oben ? 64 : 126;
      const g = s("g", { "data-stueck": oben ? "schwimmt" : "sinkt" }, bildzeichen(x, y, d, 20));
      svg.appendChild(herein(g, 0, -(y - 20), 0.2 + (i * T * 0.7) / Math.max(1, n), ruhig, oben ? 0.5 : 0.9));
    });
    if (z.schiff) {
      const schiff = s("g", { "data-schiff": "metall" }, s("path", { d: "M222,60 L290,60 L280,74 L232,74 Z", fill: "#8a8fa8", stroke: "#4f5668", "stroke-width": 1.2 }), s("g", { transform: "translate(256 60)" }, euleSitzend(0.18)));
      svg.appendChild(herein(schiff, 60, 0, T * 0.6, ruhig, 0.6));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(40, 24, ruhig));
    return svg;
  }

  // ----- Stromkreis-Bauer (BAUEN · stromkreis) -----
  /** Glühlampe an x, y (Kreis mit Kreuz wie im Schaltbild des Spiels); brennt: gelb mit acht Strahlen. */
  function lampe(x, y, brennt, ab, ruhig) {
    const g = s("g", {}, s("circle", { cx: x, cy: y, r: 11, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 1.6 }),
      s("path", { d: `M${x - 7.8},${y - 7.8} L${x + 7.8},${y + 7.8} M${x + 7.8},${y - 7.8} L${x - 7.8},${y + 7.8}`, stroke: "#2d3047", "stroke-width": 1.2 }));
    if (brennt) g.appendChild(erscheine(s("g", { "data-stueck": "lampe" }, s("circle", { cx: x, cy: y, r: 11, fill: "#ffd43b", stroke: "#2d3047", "stroke-width": 1.6 }),
      ...[...Array(8).keys()].map(i => { const w = (i * Math.PI) / 4; return s("line", { x1: x + 14 * Math.cos(w), y1: y + 14 * Math.sin(w), x2: x + 19 * Math.cos(w), y2: y + 19 * Math.sin(w), stroke: "#f5b301", "stroke-width": 2, "stroke-linecap": "round" }); })), ab, ruhig, 0.3));
    return g;
  }
  /**
   * Schaltbild wie im Spiel: Batterie links (lange Platte Plus), Drähte, Lampen. Was den Kreis schliesst, kommt zuletzt
   * (Draht, Schalter, ein Gegenstand, der leitet), dann brennen die Lampen. Angabe: { lampen: 1–3, art?: "serie" |
   * "parallel", schliesst?: "draht" | "schalter" | Bild, kurz?: Nummer der Lampe in Serie, die ein Draht überbrückt —
   * sie bleibt dunkel, die anderen brennen (geprüft: nur in Serie, in parallel wäre es ein Kurzschluss der Batterie) }.
   */
  function stromkreis(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || ![1, 2, 3].includes(z.lampen) || !["serie", "parallel"].includes(z.art ?? "serie")) return null;
    const parallel = z.art === "parallel";
    if (z.kurz !== undefined && (parallel || !Number.isInteger(z.kurz) || z.kurz < 1 || z.kurz > z.lampen || z.lampen < 2)) return null;
    const brennen = z.lampen - (z.kurz ? 1 : 0), svg = neuesBild("bauen", stufe, { "data-bilder": "stromkreis", "data-anzahl": brennen });
    svg.appendChild(tagGrund());
    const L = 60, R = 260, O = 30, U = 120, T = DAUER * 0.8, zu = T * 0.55, draht = { fill: "none", stroke: "#2d3047", "stroke-width": 2 };
    // Batterie links in der Mitte: oben die lange dünne Platte (Plus), unten die kurze dicke (Minus)
    svg.append(s("path", { d: `M${L},${O} V68 M${L},82 V${U}`, ...draht }), s("line", { x1: L - 14, y1: 70, x2: L + 14, y2: 70, stroke: "#2d3047", "stroke-width": 2 }),
      s("line", { x1: L - 7, y1: 80, x2: L + 7, y2: 80, stroke: "#2d3047", "stroke-width": 5 }), text(L - 22, 66, "+", { gross: 11 }));
    // unten und links der Draht; rechts schliesst sich der Kreis (Lücke y 64–86)
    svg.appendChild(s("path", { d: `M${L},${U} H${R} V86`, ...draht }));
    if (!parallel) {
      const xs = [...Array(z.lampen).keys()].map(i => L + ((i + 1) * (R - L)) / (z.lampen + 1));
      let d = `M${L},${O}`;
      xs.forEach(x => { d += ` H${x - 11} M${x + 11},${O}`; });
      svg.appendChild(s("path", { d: d + ` H${R} V64`, ...draht }));
      xs.forEach((x, i) => {
        svg.appendChild(lampe(x, O, z.kurz !== i + 1, zu + 0.3, ruhig));
        if (z.kurz === i + 1) svg.appendChild(s("path", { d: `M${x - 18},${O} V${O + 18} H${x + 18} V${O}`, fill: "none", style: "stroke:var(--deko-3)", "stroke-width": 2.4, "data-kurz": i + 1 }));
      });
    } else {
      // parallel: jede Lampe in einem eigenen Zweig zwischen dem Draht oben und unten
      svg.appendChild(s("path", { d: `M${L},${O} H${R} V64`, ...draht }));
      for (let i = 0; i < z.lampen; i++) {
        const x = L + 50 + i * 60;
        svg.append(s("path", { d: `M${x},${O} V${75 - 11} M${x},${75 + 11} V${U}`, ...draht }), s("circle", { cx: x, cy: O, r: 2.4, fill: "#2d3047" }), s("circle", { cx: x, cy: U, r: 2.4, fill: "#2d3047" }), lampe(x, 75, true, zu + 0.3, ruhig));
      }
    }
    // was den Kreis schliesst
    const schl = z.schliesst ?? "draht";
    if (schl === "draht") svg.appendChild(zeichne(s("path", { d: `M${R},64 V86`, ...draht }), zu - 0.3, ruhig, 0.3));
    else if (schl === "schalter") {
      svg.append(s("circle", { cx: R, cy: 64, r: 2.6, fill: "#2d3047" }), s("circle", { cx: R, cy: 86, r: 2.6, fill: "#2d3047" }));
      const hebelS = s("line", { x1: R, y1: 86, x2: R, y2: 64, stroke: "#2d3047", "stroke-width": 2.4, "data-schalter": "zu" });
      if (ruhig) svg.appendChild(hebelS);
      else { hebelS.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `40 ${R} 86`, to: `0 ${R} 86`, begin: t(zu - 0.4), dur: "0.4s", fill: "freeze" })); svg.appendChild(hebelS); }
    } else {
      // ein Gegenstand aus Metall überbrückt die Lücke (Klemmen deko-7 wie im Spiel)
      svg.append(s("rect", { x: R - 5, y: 60, width: 10, height: 6, style: "fill:var(--deko-7)" }), s("rect", { x: R - 5, y: 84, width: 10, height: 6, style: "fill:var(--deko-7)" }),
        herein(s("g", { "data-leiter": schl }, bildzeichen(R + 2, 75, schl, 20)), 40, 0, zu - 0.5, ruhig, 0.5));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(300, 120, ruhig));
    return svg;
  }

  // ----- Hebel-Wippe (BAUEN · hebel) -----
  /**
   * Die Wippe des Spiels (Balken deko-3, Drehpunkt deko-7, Klötze deko-6) mit den Plätzen 1–5 je Seite; Moment = kg ×
   * Platz, nachgerechnet: gleich → sie kommt waagrecht zur Ruhe, sonst sinkt die schwerere Seite (9° wie im Spiel).
   * Angabe: { links: [[kg, Platz] …], rechts: [[kg, Platz] …] } oder { stein, a, b } (Stange: der Stein auf Platz a,
   * das Kind drückt auf Platz b mit stein · a : b kg, ganzzahlig, s5).
   */
  function hebel(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    const seiteOk = a => Array.isArray(a) && a.length >= 1 && a.length <= 3 && a.every(([kg, p]) => Number.isInteger(kg) && kg > 0 && kg <= 30 && Number.isInteger(p) && p >= 1 && p <= 5);
    const svg = neuesBild("bauen", stufe, { "data-bilder": "hebel" });
    svg.appendChild(tagGrund());
    const cx = 160, cy = 100, ab = 24; // Abstand der Plätze
    if (z && Number.isInteger(z.stein) && Number.isInteger(z.a) && Number.isInteger(z.b)) {
      if (z.a < 1 || z.a > 3 || z.b < z.a + 2 || z.b > 10 || (z.stein * z.a) % z.b) return null;
      const kraft = (z.stein * z.a) / z.b, sb = 14;
      svg.setAttribute("data-wert", kraft);
      const stange = s("g", {}, s("rect", { x: cx - z.a * sb - 10, y: cy - 4, width: (z.a + z.b) * sb + 20, height: 7, rx: 3, style: "fill:var(--deko-3)" }),
        s("rect", { x: cx - z.a * sb - 18, y: cy - 30, width: 30, height: 26, rx: 12, style: "fill:var(--deko-7)" }), text(cx - z.a * sb - 3, cy - 13, `${z.stein} kg`, { gross: 9, farbe: "#ffffff" }),
        s("path", { d: `M${cx + z.b * sb},${cy - 40} V${cy - 8} m-5,-7 l5,7 l5,-7`, fill: "none", style: "stroke:var(--deko-2)", "stroke-width": 2.6 }), text(cx + z.b * sb, cy - 46, `${kraft} kg`, { gross: 11, farbe: "#e0569a" }));
      if (ruhig) svg.appendChild(stange);
      else { stange.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", values: `-9 ${cx} ${cy};3 ${cx} ${cy};0 ${cx} ${cy}`, keyTimes: "0;0.7;1", begin: t(0.3), dur: `${T}s`, fill: "freeze" })); svg.appendChild(stange); }
      svg.append(s("path", { d: `M${cx},${cy + 3} L${cx - 10},${cy + 22} L${cx + 10},${cy + 22} Z`, style: "fill:var(--deko-7)" }),
        erscheine(text(cx, 140, `${z.stein} · ${z.a} = ${kraft} · ${z.b}`, { gross: 13, farbe: "#2fbf71" }), T + 0.1, ruhig));
    } else {
      if (!z || !seiteOk(z.links) || !seiteOk(z.rechts)) return null;
      const ml = z.links.reduce((a, [kg, p]) => a + kg * p, 0), mr = z.rechts.reduce((a, [kg, p]) => a + kg * p, 0), neigung = ml === mr ? 0 : ml > mr ? -9 : 9;
      svg.setAttribute("data-wert", ml === mr ? "gerade" : ml > mr ? "links" : "rechts");
      const balken = s("g", {}, s("rect", { x: cx - 5.5 * ab, y: cy - 4, width: 11 * ab, height: 7, rx: 3, style: "fill:var(--deko-3)" }));
      for (let p = 1; p <= 5; p++) for (const sg of [-1, 1]) balken.appendChild(s("line", { x1: cx + sg * p * ab, y1: cy + 3, x2: cx + sg * p * ab, y2: cy + 7, stroke: "#6b4a2b", "stroke-width": 1.2 }));
      for (const [seite, sg] of [[z.links, -1], [z.rechts, 1]]) {
        const hoehe = {};
        seite.forEach(([kg, p]) => {
          const h = Math.min(30, 10 + kg * 2.2), y0 = cy - 4 - (hoehe[p] || 0) - h;
          hoehe[p] = (hoehe[p] || 0) + h;
          balken.append(s("rect", { x: cx + sg * p * ab - 10, y: y0, width: 20, height: h, rx: 3, style: "fill:var(--deko-6)", "data-kg": kg, "data-platz": p * sg }), text(cx + sg * p * ab, y0 + h / 2 + 3.5, kg, { gross: 9, farbe: "#ffffff" }));
        });
      }
      if (ruhig) { balken.setAttribute("transform", `rotate(${neigung} ${cx} ${cy})`); svg.appendChild(balken); }
      else {
        // erst schwankt die Wippe, dann kommt sie zur Ruhe (waagrecht oder auf der schwereren Seite)
        balken.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", values: `${neigung ? -neigung * 0.6 : 7} ${cx} ${cy};${neigung ? neigung * 1.1 : -4} ${cx} ${cy};${neigung} ${cx} ${cy}`, keyTimes: "0;0.6;1", begin: t(0.3), dur: `${T}s`, fill: "freeze" }));
        svg.appendChild(balken);
      }
      svg.append(s("path", { d: `M${cx},${cy + 3} L${cx - 10},${cy + 22} L${cx + 10},${cy + 22} Z`, style: "fill:var(--deko-7)" }));
      const teil = seite => seite.map(([kg, p]) => `${kg} · ${p}`).join(" + ");
      svg.appendChild(erscheine(text(cx, 142, `${teil(z.links)} ${ml === mr ? "=" : ml > mr ? ">" : "<"} ${teil(z.rechts)}`, { gross: 12, farbe: ml === mr ? "#2fbf71" : "#2d3047" }), T + 0.1, ruhig));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Wassertropfen-Reise (ZYKLUS · wasserkreis) -----
  // Stationen der beiden Wege des Spiels (Kreise) mit ihrem Platz im Bild
  const WASSER_WEG = {
    boden: [["🌊", 40, 118], ["♨️", 52, 74], ["☁️", 128, 26], ["🌧️", 178, 52], ["🟫", 196, 128], ["⛲", 250, 108], ["🏞️", 120, 118]],
    berg: [["🌊", 40, 118], ["♨️", 52, 74], ["☁️", 128, 26], ["🌨️", 236, 26], ["💧", 262, 70], ["🏔️", 222, 96], ["🏞️", 120, 118]],
  };
  const KLAERANLAGE = ["🗑️", "⏳", "🟤", "🦠", "🫧", "🏞️"];
  /**
   * { weg: "boden" | "berg", bis: 3–7, nummern? } — der Tropfen reist die Stationen des Wegs ab (Meer, Wasserdampf,
   * Wolke, …), sie erscheinen der Reihe nach, nummern: mit Nummern; { zustaende: true } — Eis schmilzt bei 0 °C, Wasser
   * verdunstet bei 100 °C (s1); { klaer: 3–6 } — die Kläranlage Stufe um Stufe, das Wasser wird klar.
   */
  function wasserkreis(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z) return null;
    const tropfen = () => s("path", { d: "M0,-9 Q7,0 6,4 A6,6 0 0,1 -6,4 Q-7,0 0,-9 Z", fill: "#2f8fe0", stroke: "#ffffff", "stroke-width": 1 });
    if (z.zustaende === true) {
      const svg = neuesBild("zyklus", stufe, { "data-bilder": "wasserkreis", "data-anzahl": 3 });
      svg.appendChild(tagGrund());
      [["🧊", 60], ["💧", 160], ["♨️", 260]].forEach(([b, x], i) => {
        svg.appendChild(erscheine(s("g", { "data-stueck": "zustand" }, bildzeichen(x, 64, b, 34)), (i * T) / 3, ruhig, 0.4));
        if (i < 2) svg.appendChild(erscheine(s("g", {}, s("path", { d: `M${x + 26},64 h48 m-6,-5 l6,5 l-6,5`, fill: "none", stroke: "#6b7089", "stroke-width": 2 }), text(x + 50, 54, i ? "100 °C" : "0 °C", { gross: 11, farbe: "#e5484d" })), ((i + 0.6) * T) / 3, ruhig));
      });
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
      if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
      return svg;
    }
    if (Number.isInteger(z.klaer)) {
      if (z.klaer < 3 || z.klaer > 6) return null;
      const svg = neuesBild("zyklus", stufe, { "data-bilder": "wasserkreis", "data-anzahl": z.klaer });
      svg.appendChild(tagGrund());
      // die letzten Stufen der Anlage bis in den Fluss (bei weniger Stufen die ersten weggelassen, der Fluss bleibt)
      const teile = [...KLAERANLAGE.slice(0, z.klaer - 1), "🏞️"], bw = 280 / teile.length;
      teile.forEach((b, i) => {
        const x = 20 + i * bw + bw / 2, klar = i / (teile.length - 1), farbe = `rgb(${Math.round(150 - 103 * klar)},${Math.round(110 + 33 * klar)},${Math.round(70 + 154 * klar)})`;
        svg.appendChild(erscheine(s("g", { "data-stueck": "stufe" }, s("rect", { x: x - bw / 2 + 3, y: 80, width: bw - 6, height: 36, rx: 4, fill: farbe, stroke: "#6b7089", "stroke-width": 1 }), bildzeichen(x, 60, b, 20), text(x, 134, i + 1, { gross: 10 })), (i * T * 0.8) / teile.length, ruhig, 0.3));
      });
      svg.appendChild(bewege(s("g", {}, tropfen()), `M${20 + bw / 2},92 H${20 + (teile.length - 0.5) * bw}`, { x: 20 + (teile.length - 0.5) * bw, y: 92, winkel: 0 }, ruhig, { drehen: false, linear: true }));
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
      if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
      return svg;
    }
    const weg = WASSER_WEG[z.weg];
    if (!weg || !Number.isInteger(z.bis) || z.bis < 3 || z.bis > 7) return null;
    const svg = neuesBild("zyklus", stufe, { "data-bilder": "wasserkreis", "data-anzahl": z.bis, "data-ziel": z.weg });
    // die Landschaft des Spiels: Himmel, Sonne, Berg, Meer, Boden mit Grundwasser
    svg.append(s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#cfe9ff" }), sonne(292, 26, 12),
      s("path", { d: "M180,112 L240,40 L300,112 Z", fill: "#8d9aa8" }), s("path", { d: "M228,54 L240,40 L252,54 L246,58 L240,54 L234,58 Z", fill: "#ffffff" }),
      s("path", { d: `M0,108 H${BREITE} V136 Q${BREITE},${HOEHE} ${BREITE - 14},${HOEHE} H14 Q0,${HOEHE} 0,136 Z`, fill: "#a0784f" }), s("rect", { x: 150, y: 124, width: 170, height: 10, fill: "#7fb0d6" }),
      s("path", { d: `M0,108 H90 V136 Q90,140 80,140 H14 Q0,140 0,126 Z`, fill: "#3b82c4" }), s("rect", { x: 90, y: 104, width: 230, height: 5, fill: "#5cb85c" }));
    const teil = weg.slice(0, z.bis), zeiten = ankunft(teil.map(([, x, y]) => [x, y]), T);
    teil.forEach(([b, x, y], i) => {
      svg.appendChild(erscheine(s("g", { "data-stueck": "station" }, s("circle", { cx: x, cy: y, r: 13, fill: "#ffffff", opacity: 0.75 }), bildzeichen(x, y, b, 18),
        z.nummern ? text(x + 13, y - 9, i + 1, { gross: 10, farbe: "#e0569a" }) : null), zeiten[i], ruhig, 0.25));
    });
    const [lx, ly] = [teil[teil.length - 1][1], teil[teil.length - 1][2]];
    svg.appendChild(bewege(s("g", {}, s("g", { transform: "translate(10 -12)" }, tropfen())), "M" + teil.map(([, x, y]) => `${x},${y}`).join(" L"), { x: lx, y: ly, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 46, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(176, 90, ruhig));
    return svg;
  }

  // ----- Energie-Wandler (REISE · energiekette) -----
  const ENERGIE_FORM = ["⚡", "🏃", "🔥", "🌟", "🧪", "⛰️", "⚛️"]; // elektrisch, Bewegung, Wärme, Licht, chemisch, Lage, Kern
  /**
   * Die Kette des Spiels: Energieform (Rahmen deko-4) → Wandler (Rahmen deko-6) → Energieform …; Glied um Glied, ein
   * Funke läuft mit. Angabe: { kette: [Bild …] } — die Glieder abwechselnd Form und Wandler, die Formen geprüft gegen die
   * sieben Formen des Spiels (lange Ketten in zwei Zeilen).
   */
  function energiekette(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.kette) || z.kette.length < 2 || z.kette.length > 10) return null;
    const istForm = (b, i) => (i % 2 === 0) === ENERGIE_FORM.includes(b);
    const start = ENERGIE_FORM.includes(z.kette[0]) ? 0 : 1;
    if (!z.kette.every((b, i) => istForm(b, i + start))) return null;
    const n = z.kette.length, svg = neuesBild("reise", stufe, { "data-bilder": "energiekette", "data-anzahl": n });
    svg.appendChild(tagGrund());
    // lange Ketten in zwei Zeilen als Schlange: die zweite läuft von rechts nach links zurück
    const proZeile = n > 5 ? Math.ceil(n / 2) : n, gb = 40, abst = Math.min(62, 300 / proZeile), T = DAUER * 0.85;
    const pts = z.kette.map((_, i) => {
      const zeile = Math.floor(i / proZeile), k = i % proZeile, xk = zeile ? proZeile - 1 - k : k;
      return [BREITE / 2 + (xk - (proZeile - 1) / 2) * abst, n > 5 ? 44 + zeile * 62 : 72];
    });
    z.kette.forEach((b, i) => {
      const [x, y] = pts[i], form = ENERGIE_FORM.includes(b);
      svg.appendChild(erscheine(s("g", { "data-stueck": form ? "form" : "wandler" }, s("rect", { x: x - gb / 2, y: y - gb / 2, width: gb, height: gb, rx: form ? 20 : 8, fill: "#ffffff", style: `stroke:var(${form ? "--deko-4" : "--deko-6"})`, "stroke-width": 2.4 }),
        bildzeichen(x, y, b, 22)), (i * T) / n, ruhig, 0.25));
      if (i < n - 1) {
        // Pfeil zum nächsten Glied, an den Rahmen gekürzt
        const [x2, y2] = pts[i + 1], l = Math.hypot(x2 - x, y2 - y), ux = (x2 - x) / l, uy = (y2 - y) / l, a = gb / 2 + 2, w = (Math.atan2(uy, ux) * 180) / Math.PI, ex = x2 - ux * a, ey = y2 - uy * a;
        svg.appendChild(erscheine(s("g", {}, s("line", { x1: x + ux * a, y1: y + uy * a, x2: ex, y2: ey, stroke: "#6b7089", "stroke-width": 1.6 }), s("path", { d: `M${ex},${ey} l-6,-3.5 l0,7 Z`, fill: "#6b7089", transform: `rotate(${w} ${ex} ${ey})` })), ((i + 0.5) * T) / n, ruhig));
      }
    });
    const funke = s("g", {}, s("circle", { cx: 0, cy: 0, r: 4, fill: "#ffd43b", stroke: "#f5b301", "stroke-width": 1 }));
    const [ex, ey] = pts[n - 1];
    svg.appendChild(bewege(funke, "M" + pts.map(p => p.map((v, j) => (j ? v - 24 : v)).join(",")).join(" L"), { x: ex, y: ey - 24, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Bionik-Paare (SAMMELN · bionik) -----
  const BIONIK = [["🌿", "👟"], ["🪷", "🏠"], ["🦈", "🛩️"], ["🦉", "🌀"], ["🐦", "✈️"], ["🐦", "🚄"], ["🦎", "🩹"], ["🍁", "🚁"], ["🕷️", "🧵"], ["🐝", "⬢"],
    ["⛰️", "🏢"], ["🍃", "🏛️"], ["🌱", "🧂"], ["🐙", "🦾"], ["🐘", "🤖"], ["🐟", "✋"], ["🐋", "🌬️"], ["🦪", "🧴"], ["🌲", "🏗️"], ["🐍", "🔎"]];
  /**
   * Album: je Paar das Vorbild aus der Natur (Rahmen deko-5) und die Erfindung (deko-6) klicken zusammen; mit
   * abgeschaut (s3, s6) dazwischen die Lupe 🔍 wie die Karte im Spiel. Angabe: { paare: [[Vorbild, Erfindung] …],
   * abgeschaut? } — jedes Paar aus der Liste des Spiels.
   */
  function bionik(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.paare) || !z.paare.length || z.paare.length > 4 || !z.paare.every(([a, b]) => BIONIK.some(([x, y]) => x === a && y === b))) return null;
    const n = z.paare.length, svg = neuesBild("sammeln", stufe, { "data-bilder": "bionik", "data-anzahl": n });
    svg.append(tagGrund(), s("rect", { x: 14, y: 10, width: 292, height: 130, rx: 8, fill: "#fffaf0", stroke: "#d9cdb0", "stroke-width": 1.4 }), s("line", { x1: 160, y1: 14, x2: 160, y2: 136, stroke: "#d9cdb0", "stroke-width": 1.4 }));
    const T = DAUER * 0.8, spalten = n > 2 ? 2 : 1, zeilen = Math.ceil(n / spalten);
    z.paare.forEach(([a, b], i) => {
      const sp = i % spalten, ze = Math.floor(i / spalten), cx = spalten === 1 ? 160 : 87 + sp * 146, cy = 20 + ((ze + 0.5) * 120) / zeilen, k = 34, d = z.abgeschaut ? 26 : 20;
      const karte = (x, bild, farbe) => s("g", {}, s("rect", { x: x - k / 2, y: cy - k / 2, width: k, height: k, rx: 6, fill: "#ffffff", style: `stroke:var(${farbe})`, "stroke-width": 2.2 }), bildzeichen(x, cy, bild, 20));
      const ab = (i * T * 0.8) / n;
      svg.appendChild(s("g", { "data-stueck": "paar" }, schiebe(karte(cx - d - 14, a, "--deko-5"), 14, 0, ab, ruhig, { dauer: 0.4 }), schiebe(karte(cx + d + 14, b, "--deko-6"), -14, 0, ab, ruhig, { dauer: 0.4 })));
      if (z.abgeschaut) svg.appendChild(erscheine(s("g", {}, s("rect", { x: cx - 9, y: cy - 9, width: 18, height: 18, rx: 4, fill: "#ffffff", style: "stroke:var(--deko-3)", "stroke-width": 1.6 }), bildzeichen(cx, cy, "🔍", 11)), ab + 0.4, ruhig));
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 30, 128, ruhig));
    return svg;
  }

  // ----- Körper-Puzzle (REISE · koerperweg) -----
  const KOERPER_TEILE = { "👁️": [154, 30], "👂": [170, 34], "👃": [160, 38], "👄": [160, 44], "👅": [160, 46], "🦷": [156, 44], "✋": [118, 86], "💪": [130, 66], "🦵": [150, 112], "🦶": [146, 138] };
  /**
   * Ein Kind von vorn. { teile: [Bild …] } — die Körperteile der Stufe (Bilder des Spiels) kommen an ihren Platz und
   * zeigen mit einer Linie hin; { gelenke: true } — Schulter, Ellbogen, Hüfte, Knie leuchten auf; { weg: "essen" |
   * "luft" } — der Weg des Essens (Mund, Speiseröhre, Magen, Dünndarm, Dickdarm) oder der Luft (Nase, Luftröhre, Lunge),
   * ein Apfel oder ein Lufthauch geht ihn ab.
   */
  function koerperweg(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "koerperweg" });
    svg.appendChild(tagGrund());
    const haut = { fill: "#f9d3b0", stroke: "#a8714a", "stroke-width": 1.2 };
    // Kopf mit Gesicht (Augen, Nase, Mund, Ohren dort, wohin die Linien der Teile zeigen)
    svg.append(s("circle", { cx: 144, cy: 36, r: 3.5, ...haut }), s("circle", { cx: 176, cy: 36, r: 3.5, ...haut }), s("circle", { cx: 160, cy: 36, r: 16, ...haut }),
      s("circle", { cx: 154, cy: 31, r: 1.8, fill: "#2d3047" }), s("circle", { cx: 166, cy: 31, r: 1.8, fill: "#2d3047" }), s("path", { d: "M160,34 v5", stroke: "#a8714a", "stroke-width": 1.2 }),
      s("path", { d: "M154,44 Q160,48 166,44", fill: "none", stroke: "#c8553d", "stroke-width": 1.4 }));
    svg.append(s("rect", { x: 140, y: 54, width: 40, height: 50, rx: 10, fill: "#7fb6e6", stroke: "#4f86b8", "stroke-width": 1.2 }),
      s("path", { d: "M140,60 L120,86 M180,60 L200,86", stroke: "#f9d3b0", "stroke-width": 9, "stroke-linecap": "round" }), s("path", { d: "M150,104 L148,136 M170,104 L172,136", stroke: "#4f5668", "stroke-width": 10, "stroke-linecap": "round" }));
    if (Array.isArray(z.teile)) {
      if (!z.teile.length || z.teile.length > 6 || !z.teile.every(b => KOERPER_TEILE[b])) return null;
      svg.setAttribute("data-anzahl", z.teile.length);
      z.teile.forEach((b, i) => {
        const [px, py] = KOERPER_TEILE[b], links = i % 2 === 0, x = links ? 60 : 260, y = 24 + Math.floor(i / 2) * 44, ab = (i * T) / z.teile.length;
        svg.appendChild(erscheine(s("g", { "data-stueck": "teil" }, s("circle", { cx: x, cy: y, r: 16, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.2 }), bildzeichen(x, y, b, 20),
          s("line", { x1: x + (links ? 17 : -17), y1: y, x2: px, y2: py, stroke: "#e0569a", "stroke-width": 1.2, "stroke-dasharray": "3 2" }), s("circle", { cx: px, cy: py, r: 2.4, fill: "#e0569a" })), ab, ruhig, 0.3));
      });
    } else if (z.gelenke === true) {
      const G = [[140, 60], [180, 60], [128, 74], [192, 74], [150, 104], [170, 104], [149, 120], [171, 120]];
      svg.setAttribute("data-anzahl", G.length);
      G.forEach(([x, y], i) => svg.appendChild(erscheine(s("circle", { cx: x, cy: y, r: 5, fill: "#f5b301", stroke: "#ffffff", "stroke-width": 1.4, "data-stueck": "gelenk" }), (i * T) / G.length, ruhig, 0.25)));
      svg.appendChild(erscheine(s("g", {}, s("path", { d: "M146,24 Q160,12 174,24", fill: "none", stroke: "#8a8fa8", "stroke-width": 3 })), T, ruhig));
    } else if (z.weg === "essen" || z.weg === "luft") {
      // die Organe als einfache Formen im Körper; der Weg führt hindurch
      const organe = z.weg === "essen"
        ? [["mund", "M152,44 h16", [160, 44]], ["speiseroehre", "M160,46 V66", [160, 58]], ["magen", "M156,66 q14,-2 14,8 q0,8 -12,6 q-6,-1 -2,-14 z", [163, 72]],
          ["duenndarm", "M150,84 q10,-6 20,0 q-10,6 -20,0 q10,6 20,0", [160, 86]], ["dickdarm", "M146,96 V80 H174 V98", [174, 96]]]
        : [["nase", "M160,34 v6", [160, 38]], ["luftroehre", "M160,52 V64", [160, 58]], ["lunge", "M150,64 q-8,4 -6,22 q8,2 12,-4 z M170,64 q8,4 6,22 q-8,2 -12,-4 z", [166, 76]]];
      svg.setAttribute("data-anzahl", organe.length);
      const zeiten = ankunft(organe.map(o => o[2]), T);
      organe.forEach(([name, d, p], i) => svg.appendChild(erscheine(s("path", { d, fill: name === "magen" || name === "lunge" ? "#f4a8b5" : "none", stroke: "#c8553d", "stroke-width": 2, "data-stueck": name }), zeiten[i], ruhig, 0.25)));
      const [ex, ey] = organe[organe.length - 1][2];
      svg.appendChild(bewege(s("g", {}, bildzeichen(0, 0, z.weg === "essen" ? "🍎" : "💨", 11)), "M" + organe.map(o => o[2].join(",")).join(" L"), { x: ex, y: ey, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T }));
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 140, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 128, ruhig));
    return svg;
  }

  // ----- Znüni-Teller (SAMMELN · znueni) -----
  const LEBENSMITTEL_BILD = ["💧", "🍵", "🍎", "🍐", "🍌", "🍒", "🍓", "🍇", "🍊", "🥕", "🥦", "🥬", "🧅", "🧄", "🍞", "🍝", "🍚", "🥔", "🥛", "🧀", "🥚", "🐟", "🍗", "🍫", "🍬", "🍩", "🥤", "🍪", "🍟"];
  const AUSGEWOGEN = [["🍎", "🍞", "💧"], ["🥕", "🧀", "🍞"], ["🍌", "🥛"], ["🍐", "🥚", "💧"]]; // Teller des Spiels
  /**
   * { koerbe: [[Korbzeichen, [Bild …]] …] } — die Lebensmittel (Liste des Spiels) fallen in die Körbe (☀️ jeden Tag,
   * 🎉 ab und zu, die Gruppen 💧 🍎 🥕 🍞 🥚 🍬); { teller: [Bild …] } — ein ausgewogener Teller des Spiels füllt sich
   * (geprüft), mit Glas Wasser und Serviette.
   */
  function znueni(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "znueni" });
    svg.appendChild(tagGrund());
    if (Array.isArray(z.teller)) {
      if (!AUSGEWOGEN.some(t0 => t0.length === z.teller.length && t0.every((b, i) => b === z.teller[i]))) return null;
      svg.setAttribute("data-anzahl", z.teller.length);
      svg.append(s("ellipse", { cx: 160, cy: 90, rx: 92, ry: 42, fill: "#eef0fa", stroke: "#c9cde0", "stroke-width": 1.4 }), s("ellipse", { cx: 160, cy: 88, rx: 70, ry: 30, fill: "#ffffff" }));
      z.teller.forEach((b, i) => svg.appendChild(vonOben(s("g", { "data-stueck": "essen" }, bildzeichen(160 + (i - (z.teller.length - 1) / 2) * 42, 84, b, 30)), (i * T) / z.teller.length, ruhig, 60, 0.4)));
    } else if (Array.isArray(z.koerbe)) {
      if (!z.koerbe.length || z.koerbe.length > 6 || !z.koerbe.every(([k, d]) => typeof k === "string" && Array.isArray(d) && d.length >= 1 && d.length <= 3 && d.every(b => LEBENSMITTEL_BILD.includes(b)))) return null;
      const n = z.koerbe.length, kb = Math.min(90, 296 / n), alle = z.koerbe.reduce((a, [, d]) => a + d.length, 0);
      svg.setAttribute("data-anzahl", alle);
      let k = 0;
      z.koerbe.forEach(([zeichen, dinge], i) => {
        const kx = BREITE / 2 + (i - (n - 1) / 2) * kb;
        svg.append(s("path", { d: `M${kx - kb / 2 + 4},96 H${kx + kb / 2 - 4} L${kx + kb / 2 - 10},134 H${kx - kb / 2 + 10} Z`, fill: "#f3e3c3", stroke: "#a8743f", "stroke-width": 1.6 }), bildzeichen(kx, 120, zeichen, 14));
        dinge.forEach((b, j) => {
          const x = kx + (j - (dinge.length - 1) / 2) * Math.min(24, (kb - 8) / dinge.length), y = 88;
          svg.appendChild(herein(s("g", { "data-stueck": "essen" }, bildzeichen(x, y, b, Math.min(20, kb / 3))), 160 - x, 20 - y, 0.2 + (k++ * T * 0.8) / alle, ruhig, 0.45));
        });
      });
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Blutkreislauf-Lotse (REISE · blut) -----
  const BLUT_REICH = "#d62839", BLUT_ARM = "#2b59c3"; // Farben des Spiels
  // Stationen des grossen und kleinen Kreislaufs wie im Spiel (Sicht von vorn: die rechte Herzhälfte links im Bild)
  const BLUT_HAELFTEN = [["koerper", 160, 134, "arm"], ["hohlvene", 92, 104, "arm"], ["rechts", 148, 78, "arm"], ["lungenarterie", 100, 46, "arm"], ["lunge", 160, 20, "reich"],
    ["lungenvene", 220, 46, "reich"], ["links", 172, 78, "reich"], ["aorta", 228, 104, "reich"]];
  /**
   * Herz in der Mitte (zwei Hälften, mit kammern: Vorhof und Kammer je Seite), oben die Lunge 🫁, unten der Körper;
   * das Blutkörperchen geht die Stationen ab: arm blau, ab der Lunge reich rot, im Körper gibt es den Sauerstoff ab.
   * Angabe: { bis: 3–8, kammern?, spaet? } (spaet: die Gefässe färben sich erst, wenn das Blut durchfliesst, s6) oder
   * { organe: true } (Gehirn, Lunge, Herz, Magen, Darm, s1).
   */
  function blut(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.9;
    if (!z) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "blut" });
    svg.appendChild(tagGrund());
    if (z.organe === true) {
      const O = [["🧠", 160, 22], ["🫁", 160, 58], ["❤️", 172, 70], ["🍲", 160, 92], ["🌀", 160, 112]];
      svg.append(s("circle", { cx: 160, cy: 24, r: 18, fill: "#f9d3b0" }), s("rect", { x: 128, y: 44, width: 64, height: 84, rx: 18, fill: "#f9d3b0" }));
      svg.setAttribute("data-anzahl", O.length);
      O.forEach(([b, x, y], i) => svg.appendChild(erscheine(s("g", { "data-stueck": "organ" }, bildzeichen(x, y, b, b === "❤️" ? 14 : 18)), (i * T) / O.length, ruhig, 0.3)));
    } else {
      if (!Number.isInteger(z.bis) || z.bis < 3 || z.bis > 8) return null;
      svg.setAttribute("data-anzahl", z.bis);
      const st = BLUT_HAELFTEN.slice(0, z.bis), weg = [...st.map(([, x, y]) => [x, y]), ...(z.bis === 8 ? [[160, 134]] : [])];
      // Gefässe: arm blau, reich rot (bei spaet grau, bis das Blut sie erreicht)
      for (let i = 0; i < weg.length - 1; i++) {
        const farbe = st[i][3] === "reich" ? BLUT_REICH : BLUT_ARM; // das Gefäss trägt das Blut der Station, von der es kommt
        const linie = s("path", { d: `M${weg[i].join(",")} L${weg[i + 1].join(",")}`, stroke: z.spaet ? "#b4b8cc" : farbe, "stroke-width": 4, "stroke-linecap": "round", fill: "none" });
        svg.appendChild(linie);
      }
      const zeiten = ankunft(weg, T);
      if (z.spaet) for (let i = 0; i < weg.length - 1; i++) {
        const farbe = st[i][3] === "reich" ? BLUT_REICH : BLUT_ARM;
        svg.appendChild(erscheine(s("path", { d: `M${weg[i].join(",")} L${weg[i + 1].join(",")}`, stroke: farbe, "stroke-width": 4, "stroke-linecap": "round", fill: "none" }), zeiten[i + 1], ruhig, 0.2));
      }
      // Herz: zwei Hälften, mit kammern je Vorhof und Kammer
      svg.append(s("path", { d: "M160,92 C130,76 132,62 146,62 Q156,62 160,70 Q164,62 174,62 C188,62 190,76 160,92 Z", fill: "#f4a8b5", stroke: "#c8553d", "stroke-width": 1.4 }), s("line", { x1: 160, y1: 70, x2: 160, y2: 92, stroke: "#c8553d", "stroke-width": 1.2 }));
      if (z.kammern) svg.appendChild(s("path", { d: "M140,72 H180", stroke: "#c8553d", "stroke-width": 1, "stroke-dasharray": "2 2" }));
      svg.append(bildzeichen(160, 18, "🫁", 18), bildzeichen(160, 138, "💪", 14));
      st.forEach(([name, x, y], i) => svg.appendChild(erscheine(s("circle", { cx: x, cy: y, r: 3.4, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 1, "data-stueck": name }), zeiten[i], ruhig, 0.2)));
      // das Blutkörperchen: Farbe wechselt in der Lunge zu rot und im Körper zu blau
      const zelle = s("circle", { cx: 0, cy: 0, r: 6, fill: BLUT_ARM, stroke: "#ffffff", "stroke-width": 1.4 });
      const iLunge = st.findIndex(x => x[0] === "lunge");
      const endeFarbe = z.bis === 8 ? BLUT_ARM : iLunge >= 0 ? BLUT_REICH : BLUT_ARM;
      if (ruhig) zelle.setAttribute("fill", endeFarbe);
      else {
        if (iLunge >= 0) zelle.appendChild(s("set", { attributeName: "fill", to: BLUT_REICH, begin: t(zeiten[iLunge]), fill: "freeze" }));
        if (z.bis === 8) zelle.appendChild(s("set", { attributeName: "fill", to: BLUT_ARM, begin: t(zeiten[zeiten.length - 1]), fill: "freeze" }));
      }
      const [ex, ey] = weg[weg.length - 1];
      svg.appendChild(bewege(s("g", {}, zelle), "M" + weg.map(p => p.join(",")).join(" L"), { x: ex, y: ey, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T }));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 24, ruhig));
    return svg;
  }

  // ----- Braille-Finger (BAUEN · braille) -----
  // Punkte je Buchstabe nach der Tafel des Spiels (Punkt 1–3 links von oben, 4–6 rechts)
  const BRAILLE = { a: "1", b: "12", c: "14", d: "145", e: "15", f: "124", g: "1245", h: "125", i: "24", j: "245", k: "13", l: "123", m: "134", n: "1345", o: "135",
    p: "1234", q: "12345", r: "1235", s: "234", t: "2345", u: "136", v: "1236", w: "2456", x: "1346", y: "13456", z: "1356" };
  /**
   * Zelle um Zelle erscheinen die erhabenen Punkte (gesetzt deko-5 wie im Spiel), darunter der Buchstabe; zaehlen: die
   * Punkte werden gezählt (s1); finger: ein Finger tastet über das Wort. Angabe: { text: "eule", zaehlen?, finger? }
   * (Buchstaben a–z, 1–5).
   */
  function braille(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || typeof z.text !== "string" || z.text.length < 1 || z.text.length > 5 || ![...z.text].every(c => BRAILLE[c])) return null;
    const n = z.text.length, punkte = [...z.text].reduce((a, c) => a + BRAILLE[c].length, 0);
    const svg = neuesBild("bauen", stufe, { "data-bilder": "braille", "data-anzahl": punkte, "data-wert": z.text });
    svg.appendChild(tagGrund());
    const zb = Math.min(46, 270 / n), zh = zb * 1.4, x0 = BREITE / 2 - (n * (zb + 8) - 8) / 2, y0 = 18, T = DAUER * 0.8, je = T / punkte;
    let k = 0;
    [...z.text].forEach((c, i) => {
      const x = x0 + i * (zb + 8);
      svg.appendChild(s("rect", { x, y: y0, width: zb, height: zh, rx: zb * 0.2, fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 1.4 }));
      for (let p = 1; p <= 6; p++) {
        const px = x + (p <= 3 ? 0.3 : 0.7) * zb, py = y0 + (0.2 + 0.3 * ((p - 1) % 3)) * zh, an = BRAILLE[c].includes(String(p));
        svg.appendChild(s("circle", { cx: px, cy: py, r: zb * 0.09, fill: "#e4e6ec" }));
        if (an) {
          svg.appendChild(erscheine(s("circle", { cx: px, cy: py, r: zb * 0.12, style: "fill:var(--deko-5)", "data-stueck": "punkt", "data-nr": p }), k * je, ruhig, 0.2));
          if (z.zaehlen) svg.appendChild(erscheine(text(px + zb * 0.17, py - zb * 0.1, BRAILLE[c].indexOf(String(p)) + 1, { gross: 9, farbe: "#6b7089" }), k * je + 0.1, ruhig, 0.2));
          k++;
        }
      }
      svg.appendChild(erscheine(text(x + zb / 2, y0 + zh + 20, c.toUpperCase(), { gross: Math.min(18, zb * 0.45), farbe: "#14b8a6" }), T + 0.1 + i * 0.1, ruhig));
    });
    // der Finger tastet über die Punkte (die Spitze auf der Zelle), nicht über die Buchstaben darunter
    if (z.finger) svg.appendChild(bewege(s("g", {}, bildzeichen(4, 12, "👆", 18)), `M${x0 + zb / 2},${y0 + zh * 0.55} H${x0 + (n - 1) * (zb + 8) + zb / 2}`, { x: x0 + (n - 1) * (zb + 8) + zb / 2, y: y0 + zh * 0.55, winkel: 0 }, ruhig, { drehen: false, linear: true }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Auge-Entdecker (ZOOM · auge) -----
  /**
   * { teile: 1–8 } — das Auge von vorn wie im Spiel (Iris deko-5, Pupille), die Teile leuchten der Reihe nach auf
   * (Augenbraue, Augenlid, Wimpern, Pupille, Iris, das Weisse, Tränen, Hornhaut); { pupille: "hell" | "dunkel" } — die
   * Pupille wird im Hellen klein (r 14 → im Bild 7), im Dunkeln weit; { schnitt: 1–5 } — das Auge im Schnitt mit
   * Hornhaut, Linse, Glaskörper, Netzhaut, Sehnerv; { lichtweg: true } — das Licht geht von links durch bis ins Gehirn 🧠.
   */
  function auge(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z) return null;
    const svg = neuesBild("zoom", stufe, { "data-bilder": "auge" });
    svg.appendChild(tagGrund());
    const ring = (el, ab) => erscheine(s("g", { "data-stueck": "teil" }, el), ab, ruhig, 0.3);
    if (Number.isInteger(z.teile) || z.pupille) {
      if (z.teile !== undefined && (z.teile < 1 || z.teile > 8)) return null;
      if (z.pupille !== undefined && !["hell", "dunkel"].includes(z.pupille)) return null;
      const cx = 160, cy = 80;
      svg.append(s("path", { d: `M${cx - 80},${cy} Q${cx},${cy - 56} ${cx + 80},${cy} Q${cx},${cy + 56} ${cx - 80},${cy} Z`, fill: "#ffffff", stroke: "#a8714a", "stroke-width": 1.6 }),
        s("circle", { cx, cy, r: 26, style: "fill:var(--deko-5)" }), s("path", { d: `M${cx - 74},${cy - 48} Q${cx},${cy - 76} ${cx + 74},${cy - 48}`, fill: "none", stroke: "#6b4a2b", "stroke-width": 6, "stroke-linecap": "round" }));
      for (let i = 0; i < 9; i++) { const x = cx - 64 + i * 16, y = cy - 24 - 14 * (1 - ((i - 4) / 4) ** 2); svg.appendChild(s("line", { x1: x, y1: y, x2: x - 2, y2: y - 8, stroke: "#2d3047", "stroke-width": 1.4 })); }
      const pupille = s("circle", { cx, cy, r: z.pupille === "hell" ? 7 : z.pupille === "dunkel" ? 16 : 11, fill: "#1d2140", "data-pupille": z.pupille || "mittel" });
      if (z.pupille && !ruhig) pupille.appendChild(s("animate", { attributeName: "r", from: z.pupille === "hell" ? 16 : 7, to: z.pupille === "hell" ? 7 : 16, begin: t(0.4), dur: `${T * 0.6}s`, fill: "freeze" }));
      svg.append(pupille, s("circle", { cx: cx + 9, cy: cy - 9, r: 4, fill: "#ffffff", opacity: 0.85 }));
      if (z.pupille) svg.append(z.pupille === "hell" ? sonne(286, 30, 14) : s("g", {}, s("rect", { x: 0, y: 0, width: BREITE, height: HOEHE, rx: 14, fill: "#1d2140", opacity: 0.35 }), bildzeichen(290, 28, "🌙", 18)));
      // die Teile des Spiels, die aufleuchten (deko-4): Augenbraue, Augenlid, Wimpern, Pupille, Iris, das Weisse, Tränen, Hornhaut
      const TEILE = [s("path", { d: `M${cx - 74},${cy - 48} Q${cx},${cy - 76} ${cx + 74},${cy - 48}`, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 3 }),
        s("path", { d: `M${cx - 80},${cy} Q${cx},${cy - 56} ${cx + 80},${cy}`, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 3 }),
        s("path", { d: `M${cx - 66},${cy - 30} Q${cx},${cy - 66} ${cx + 66},${cy - 30}`, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 2, "stroke-dasharray": "2 3" }),
        s("circle", { cx, cy, r: 13, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 2.6 }), s("circle", { cx, cy, r: 28, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 2.6 }),
        s("path", { d: `M${cx - 74},${cy} Q${cx - 50},${cy - 20} ${cx - 30},${cy} Q${cx - 50},${cy + 20} ${cx - 74},${cy} Z`, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 2.4 }),
        s("ellipse", { cx: cx - 78, cy: cy + 4, rx: 3, ry: 5, fill: "#7fc4ec" }), s("path", { d: `M${cx - 30},${cy - 22} Q${cx},${cy - 34} ${cx + 30},${cy - 22}`, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 2 })];
      const n = z.teile ?? 0;
      svg.setAttribute("data-anzahl", n);
      TEILE.slice(0, n).forEach((el, i) => svg.appendChild(ring(el, (i * T) / Math.max(1, n))));
    } else if (Number.isInteger(z.schnitt) || z.lichtweg === true) {
      const n = z.lichtweg ? 5 : z.schnitt;
      if (n < 1 || n > 5) return null;
      svg.setAttribute("data-anzahl", n);
      const cx = 150, cy = 76;
      svg.append(s("circle", { cx, cy, r: 50, fill: "#ffffff", stroke: "#a8714a", "stroke-width": 1.6 }), s("path", { d: `M${cx + 46},${cy - 8} Q${cx + 80},${cy - 6} ${cx + 110},${cy + 6}`, fill: "none", stroke: "#f0c050", "stroke-width": 7 }), bildzeichen(286, 92, "🧠", 26));
      // Hornhaut, Linse, Glaskörper, Netzhaut, Sehnerv (Licht kommt von links, wie im Schnitt des Spiels)
      const INNEN = [s("path", { d: `M${cx - 44},${cy - 24} Q${cx - 64},${cy} ${cx - 44},${cy + 24}`, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 4 }),
        s("ellipse", { cx: cx - 30, cy, rx: 7, ry: 17, style: "fill:var(--deko-4)", opacity: 0.8 }), s("circle", { cx: cx + 8, cy, r: 34, style: "fill:var(--deko-4)", opacity: 0.18 }),
        s("path", { d: `M${cx + 20},${cy - 46} A50,50 0 0,1 ${cx + 20},${cy + 46}`, fill: "none", stroke: "#e5484d", "stroke-width": 4 }), s("path", { d: `M${cx + 50},${cy - 2} H${cx + 62}`, style: "stroke:var(--deko-4)", "stroke-width": 7 })];
      INNEN.slice(0, n).forEach((el, i) => svg.appendChild(ring(el, (i * T) / n)));
      if (z.lichtweg) {
        // das Licht von der Lampe links: durch Hornhaut und Pupille, in der Linse gebündelt, auf die Netzhaut, dann ins Gehirn
        svg.append(bildzeichen(22, cy, "💡", 20), zeichne(s("path", { d: `M36,${cy - 10} L${cx - 30},${cy - 8} L${cx + 48},${cy + 6} M36,${cy + 10} L${cx - 30},${cy + 8} L${cx + 48},${cy - 6}`, fill: "none", stroke: "#f5b301", "stroke-width": 2 }), T * 0.3, ruhig, T * 0.5),
          zeichne(s("path", { d: `M${cx + 62},${cy - 2} Q${cx + 96},${cy} ${270},${cy + 10}`, fill: "none", stroke: "#f5b301", "stroke-width": 2, "stroke-dasharray": "4 3" }), T * 0.85, ruhig, 0.3));
      }
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 130, ruhig));
    return svg;
  }

  // ----- Lärm-Wächter (REISE · schall) -----
  const LAERM = { "🤫": 1, "🌧️": 2, "🧹": 3, "🚜": 4, "🚁": 5, "🎸": 5 }; // Lärm-Skala 1–5 der Liste des Spiels
  const SCHUTZ = { "👂": 2, "🎧": 2, "🔉": 2, "🚶": 2, "🪟": 2, "🧱": 2, "🙉": 1, "🕶️": 0, "🙈": 0, "🧤": 0 }; // wie gut es hilft
  /** Schallbögen von x, y nach rechts (n Bögen, ab Zeitpunkt), Grösse g. */
  function schallBoegen(x, y, n, ab, ruhig, { g = 14, farbe = "#6b7089", schritt = 9 } = {}) {
    const e = s("g", {});
    for (let i = 0; i < n; i++) e.appendChild(zeichne(s("path", { d: `M${x + i * schritt},${y - g / 2 - i * 2} Q${x + i * schritt + 6},${y} ${x + i * schritt},${y + g / 2 + i * 2}`, fill: "none", stroke: farbe, "stroke-width": 2, "stroke-linecap": "round" }), ab + i * 0.15, ruhig, 0.2));
    return e;
  }
  /**
   * { leise: [Bild …], laut: [Bild …] } — in die Körbe 🔈 und 🔊 (leise ≤ 2, laut ≥ 4 auf der Lärm-Skala, geprüft);
   * { skala: [Bild …] } — die Geräusche auf der Skala 1–5 des Spiels (bis 2 deko-5, sonst deko-3); { quelle, schutz } —
   * der Schall trifft auf den Schutz (💪 hilft gut: kein Bogen kommt durch, 🤏 hilft etwas: kleinere Bögen); { ohr: true }
   * — der Schall läuft durch den Gehörgang, das Trommelfell schwingt; { echo: true } — der Ruf hallt von der Felswand zurück.
   */
  function schall(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "schall" });
    svg.appendChild(tagGrund());
    if (Array.isArray(z.leise) && Array.isArray(z.laut)) {
      if (!z.leise.every(b => LAERM[b] <= 2) || !z.laut.every(b => LAERM[b] >= 4) || !z.leise.length || !z.laut.length || z.leise.length + z.laut.length > 6) return null;
      svg.setAttribute("data-anzahl", z.leise.length + z.laut.length);
      let k = 0;
      [[z.leise, "🔈", 86], [z.laut, "🔊", 234]].forEach(([dinge, zeichen, kx]) => {
        svg.append(s("path", { d: `M${kx - 56},84 H${kx + 56} L${kx + 46},136 H${kx - 46} Z`, fill: "#ffffff", stroke: "#a8743f", "stroke-width": 2.2 }), bildzeichen(kx, 124, zeichen, 14));
        dinge.forEach((b, j) => { const x = kx + (j - (dinge.length - 1) / 2) * 32; svg.appendChild(herein(s("g", { "data-stueck": "geraeusch" }, bildzeichen(x, 100, b, 22)), 160 - x, -76, 0.2 + k++ * 0.5, ruhig, 0.5)); });
      });
    } else if (Array.isArray(z.skala)) {
      if (!z.skala.length || z.skala.length > 5 || !z.skala.every(b => LAERM[b])) return null;
      svg.setAttribute("data-anzahl", z.skala.length);
      const fx = w => 30 + (w - 1) * 54;
      for (let w = 1; w <= 5; w++) svg.append(s("rect", { x: fx(w), y: 100, width: 50, height: 22, rx: 4, style: `fill:var(${w <= 2 ? "--deko-5" : "--deko-3"})`, opacity: 0.35 + w * 0.13 }), text(fx(w) + 25, 116, w, { gross: 12, farbe: "#ffffff" }));
      [...z.skala].sort((a, b) => LAERM[a] - LAERM[b]).forEach((b, i) => {
        const x = fx(LAERM[b]) + 25;
        svg.appendChild(vonOben(s("g", { "data-stueck": "geraeusch", "data-wert": LAERM[b] }, bildzeichen(x, 70, b, 26), s("path", { d: `M${x},86 V98`, stroke: "#6b7089", "stroke-width": 1.4 })), (i * T) / z.skala.length, ruhig, 40, 0.35));
      });
    } else if (z.quelle && z.schutz) {
      if (!LAERM[z.quelle] || SCHUTZ[z.schutz] === undefined) return null;
      const w = SCHUTZ[z.schutz];
      svg.setAttribute("data-wert", w);
      svg.append(bildzeichen(46, 76, z.quelle, 32), schallBoegen(70, 76, 4, 0.1, ruhig, { g: 24 }), bildzeichen(268, 80, "🧒", 34));
      svg.appendChild(herein(s("g", { "data-stueck": "schutz" }, bildzeichen(176, 76, z.schutz, 30)), 0, -60, 0.3, ruhig, 0.5));
      if (w < 2) svg.appendChild(schallBoegen(206, 76, 3, T * 0.6, ruhig, { g: w ? 10 : 24, farbe: w ? "#a8adbf" : "#6b7089" }));
      svg.appendChild(erscheine(bildzeichen(176, 122, w === 2 ? "💪" : w === 1 ? "🤏" : "🚫", 18), T, ruhig));
    } else if (z.ohr === true) {
      // das Ohr im Schnitt wie im Spiel: Ohrmuschel, Gehörgang als Tunnel, das Trommelfell am Ende
      // der Kopf von der Seite (rechts), davor die Ohrmuschel, der Gehörgang führt hinein bis zum Trommelfell
      svg.append(s("rect", { x: 150, y: 8, width: 160, height: 134, rx: 30, fill: "#f9d3b0" }),
        s("path", { d: "M152,26 Q112,30 116,64 Q118,80 134,84 Q122,98 130,114 Q140,128 152,124", fill: "#f4c29a", stroke: "#a8714a", "stroke-width": 1.8 }),
        s("path", { d: "M146,40 Q128,44 130,62", fill: "none", stroke: "#a8714a", "stroke-width": 1.2 }),
        s("rect", { x: 150, y: 70, width: 110, height: 16, fill: "#fbe3cf" }), s("path", { d: "M150,70 H260 M150,86 H260", stroke: "#a8714a", "stroke-width": 1.6 }));
      const fell = s("ellipse", { cx: 262, cy: 78, rx: 3, ry: 12, style: "fill:var(--deko-2)", "data-stueck": "trommelfell" });
      if (!ruhig) fell.appendChild(s("animate", { attributeName: "rx", values: "3;6;2;5;3", begin: t(T * 0.75), dur: "0.6s", fill: "freeze" }));
      svg.append(fell, schallBoegen(30, 78, 3, 0.1, ruhig, { g: 30 }), schallBoegen(170, 78, 4, T * 0.4, ruhig, { g: 8, schritt: 20 }), text(292, 82, "→", { gross: 14, farbe: "#6b7089" }));
      svg.setAttribute("data-anzahl", 1);
    } else if (z.echo === true) {
      svg.append(s("path", { d: "M262,10 L300,14 L312,140 L250,140 L256,90 Z", fill: "#8a8f99" }), bildzeichen(40, 98, "🧒", 34), bildzeichen(66, 70, "🗣️", 16),
        schallBoegen(80, 80, 6, 0.1, ruhig, { g: 20, schritt: 28 }));
      // zurück: gespiegelte Bögen von der Wand zum Kind
      const zurueck = s("g", { "data-stueck": "echo" });
      for (let i = 0; i < 4; i++) zurueck.appendChild(zeichne(s("path", { d: `M${240 - i * 36},${70 - i * 2} Q${234 - i * 36},80 ${240 - i * 36},${90 + i * 2}`, fill: "none", stroke: "#a8adbf", "stroke-width": 2, "stroke-dasharray": "3 2" }), T * 0.55 + i * 0.2, ruhig, 0.2));
      svg.appendChild(zurueck);
      svg.setAttribute("data-anzahl", 1);
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Kompass-Spiel (KARTE · kompassweg) -----
  const RICHTUNG = { N: [0, -1], NO: [1, -1], O: [1, 0], SO: [1, 1], S: [0, 1], SW: [-1, 1], W: [-1, 0], NW: [-1, -1] }; // O wie im Spiel
  /**
   * Plan 6 × 6 wie im Spiel; die Eule geht die Teilstücke von der Schule 🏫 zum Ziel, die Kompassrose daneben (mit acht
   * Richtungen ab s4). dreh: die Karte ist um so viele Vierteldrehungen gedreht — der Nordpfeil und die Nadel zeigen
   * weiter nach Norden der Karte. Angabe: { start: [Spalte, Zeile], schritte: [[Richtung, Felder] …], ziel, acht?, dreh? }.
   */
  function kompassweg(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.start) || !Array.isArray(z.schritte) || !z.schritte.length || z.schritte.length > 4 || typeof z.ziel !== "string" || ![0, 1, 2, 3].includes(z.dreh ?? 0)) return null;
    let [c, r] = z.start;
    const felder = [[c, r]];
    for (const [ri, n] of z.schritte) {
      if (!RICHTUNG[ri] || !Number.isInteger(n) || n < 1 || n > 4) return null;
      c += RICHTUNG[ri][0] * n; r += RICHTUNG[ri][1] * n;
      if (c < 0 || c > 5 || r < 0 || r > 5) return null;
      felder.push([c, r]);
    }
    const svg = neuesBild("karte", stufe, { "data-bilder": "kompassweg", "data-wert": `${c},${r}`, "data-anzahl": z.schritte.length });
    svg.appendChild(tagGrund());
    const fz = 19, mx = 112, my = 76, k = z.dreh ?? 0, T = DAUER * 0.85;
    // ein Feld in Bildkoordinaten; gedreht um k Vierteldrehungen im Uhrzeigersinn um die Mitte des Plans
    const punkt = (cc, rr) => { let dx = (cc - 2.5) * fz, dy = (rr - 2.5) * fz; for (let i = 0; i < k; i++) [dx, dy] = [-dy, dx]; return [mx + dx, my + dy]; };
    svg.appendChild(s("rect", { x: mx - 3 * fz, y: my - 3 * fz, width: 6 * fz, height: 6 * fz, fill: "#eef7e6", stroke: "#8a8fa8", "stroke-width": 1.2 }));
    for (let i = 1; i < 6; i++) svg.append(s("line", { x1: mx - 3 * fz + i * fz, y1: my - 3 * fz, x2: mx - 3 * fz + i * fz, y2: my + 3 * fz, stroke: "#cfd8c4", "stroke-width": 0.8 }),
      s("line", { x1: mx - 3 * fz, y1: my - 3 * fz + i * fz, x2: mx + 3 * fz, y2: my - 3 * fz + i * fz, stroke: "#cfd8c4", "stroke-width": 0.8 }));
    const pts = felder.map(([cc, rr]) => punkt(cc, rr));
    svg.append(bildzeichen(...pts[0], "🏫", 14), bildzeichen(...pts[pts.length - 1], z.ziel, 14));
    // Nordpfeil der Karte (oben am Plan, mit der Karte gedreht)
    const [nx, ny] = punkt(2.5, -0.9), winkel = k * 90;
    svg.appendChild(s("g", { transform: `rotate(${winkel} ${nx} ${ny})` }, s("path", { d: `M${nx},${ny - 9} L${nx + 5},${ny + 3} L${nx - 5},${ny + 3} Z`, fill: "#e5484d" }), text(nx, ny + 12, "N", { gross: 9 })));
    const zeiten = ankunft(pts, T);
    for (let i = 1; i < pts.length; i++) svg.appendChild(zeichne(s("path", { d: `M${pts[i - 1].join(",")} L${pts[i].join(",")}`, fill: "none", stroke: "#e0569a", "stroke-width": 2.4, "stroke-linecap": "round", "data-stueck": "teilstueck" }), zeiten[i - 1], ruhig, zeiten[i] - zeiten[i - 1]));
    const [ex, ey] = pts[pts.length - 1];
    svg.appendChild(bewege(s("g", {}, euleSitzend(0.14)), "M" + pts.map(p => p.join(",")).join(" L"), { x: ex, y: ey - 6, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T }));
    // Kompassrose rechts: Buchstaben gedreht wie die Karte, die Nadel zeigt nach Norden der Karte
    const rx = 252, ry = 76, RR = 40, namen = z.acht ? ["N", "NO", "O", "SO", "S", "SW", "W", "NW"] : ["N", "O", "S", "W"];
    svg.append(s("circle", { cx: rx, cy: ry, r: RR, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 1.6 }));
    namen.forEach((nm, i) => { const w = ((winkel + (i * 360) / namen.length) * Math.PI) / 180; svg.appendChild(text(rx + (RR - 11) * Math.sin(w), ry - (RR - 11) * Math.cos(w) + 3.5, nm, { gross: nm.length > 1 ? 9 : 11, farbe: nm === "N" ? "#e5484d" : "#2d3047" })); });
    const nadel = s("g", {}, s("path", { d: `M${rx},${ry - 22} L${rx + 5},${ry} L${rx - 5},${ry} Z`, fill: "#e5484d" }), s("path", { d: `M${rx},${ry + 22} L${rx + 5},${ry} L${rx - 5},${ry} Z`, fill: "#8a8fa8" }));
    if (ruhig || !k) nadel.setAttribute("transform", `rotate(${winkel} ${rx} ${ry})`);
    else nadel.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `0 ${rx} ${ry}`, to: `${winkel} ${rx} ${ry}`, begin: t(0.2), dur: "0.8s", fill: "freeze" }));
    svg.append(nadel, s("circle", { cx: rx, cy: ry, r: 3, fill: "#2d3047" }));
    if (k) svg.appendChild(bildzeichen(rx + RR - 2, ry + RR - 4, "🔄", 12));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 130, ruhig));
    return svg;
  }

  // ----- Plan-Leser (KARTE · planweg) -----
  // Quartierplan mit Legendenzeichen wie im Spiel (Form und Farbe), feste Plätze auf dem Plan 6 × 6
  const PLAN_ZEICHEN = [["schule", "Schule", 1, 1], ["kirche", "Kirche", 4, 0], ["baeckerei", "Bäckerei", 5, 3], ["post", "Post", 2, 4], ["spielplatz", "Spielplatz", 0, 3],
    ["baum", "Baum", 3, 2], ["baum", "Baum", 4, 5], ["baum", "Baum", 1, 5], ["haus", "Wohnhaus", 3, 4], ["haus", "Wohnhaus", 5, 1]];
  function planZeichen(art, x, y, g = 6) {
    if (art === "schule") return s("rect", { x: x - g, y: y - g, width: 2 * g, height: 2 * g, style: "fill:var(--deko-6)" });
    if (art === "kirche") return s("path", { d: `M${x - g},${y} H${x + g} M${x},${y - g} V${y + g}`, style: "stroke:var(--deko-1)", "stroke-width": 3 });
    if (art === "baeckerei") return s("circle", { cx: x, cy: y, r: g, style: "fill:var(--deko-3)" });
    if (art === "post") return s("path", { d: [...Array(10).keys()].map(i => { const w = (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? g * 0.45 : g * 1.1; return `${i ? "L" : "M"}${x + rr * Math.cos(w)},${y + rr * Math.sin(w)}`; }).join(" ") + " Z", style: "fill:var(--deko-4)" });
    if (art === "spielplatz") return s("path", { d: `M${x},${y - g} L${x + g},${y + g} L${x - g},${y + g} Z`, style: "fill:var(--deko-5)" });
    if (art === "baum") return s("g", {}, s("circle", { cx: x, cy: y - 1.5, r: g * 0.8, style: "fill:var(--deko-5)" }), s("rect", { x: x - 1, y: y + 2, width: 2, height: g * 0.8, fill: "#6b4a2b" }));
    return s("path", { d: `M${x - g},${y + g} V${y - 1} L${x},${y - g} L${x + g},${y - 1} V${y + g} Z`, style: "fill:var(--deko-7)" });
  }
  /**
   * Plan mit Legende und Massstab „1 Feld = … m“ wie im Spiel. { finde: Zeichen } — das Zeichen leuchtet auf dem Plan und
   * in der Legende (s1); { zaehle: Zeichen } — die Zeichen werden gezählt (s2); { start, weg: [[n | s | o | w, Felder] …],
   * massstab } — der gestrichelte Weg mit Pfeil, darunter die Länge: Felder · Massstab (nachgerechnet).
   */
  function planweg(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z) return null;
    const svg = neuesBild("karte", stufe, { "data-bilder": "planweg" });
    svg.appendChild(tagGrund());
    const fz = 18, x0 = 16, y0 = 16, feld = (cc, rr) => [x0 + (cc + 0.5) * fz, y0 + (rr + 0.5) * fz];
    svg.appendChild(s("rect", { x: x0, y: y0, width: 6 * fz, height: 6 * fz, fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 1.2 }));
    for (let i = 1; i < 6; i++) svg.append(s("line", { x1: x0 + i * fz, y1: y0, x2: x0 + i * fz, y2: y0 + 6 * fz, stroke: "#e4e6ec", "stroke-width": 0.8 }), s("line", { x1: x0, y1: y0 + i * fz, x2: x0 + 6 * fz, y2: y0 + i * fz, stroke: "#e4e6ec", "stroke-width": 0.8 }));
    PLAN_ZEICHEN.forEach(([art, , cc, rr]) => svg.appendChild(planZeichen(art, ...feld(cc, rr))));
    // Legende rechts: jedes Zeichen einmal
    const arten = [...new Map(PLAN_ZEICHEN.map(([a, n]) => [a, n])).entries()];
    svg.append(s("rect", { x: 140, y: 10, width: 166, height: 100, rx: 5, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1 }), text(150, 22, "Legende", { gross: 10, anker: "start" }));
    const zeileY = i => 34 + i * 11;
    arten.forEach(([a, n], i) => svg.append(planZeichen(a, 154, zeileY(i) - 3, 4), text(166, zeileY(i), n, { gross: 9, anker: "start", fett: false })));
    if (z.finde || z.zaehle) {
      const art = z.finde || z.zaehle, treffer = PLAN_ZEICHEN.filter(p => p[0] === art), li = arten.findIndex(([a]) => a === art);
      if (!treffer.length || (z.finde && treffer.length !== 1)) return null;
      svg.setAttribute("data-anzahl", treffer.length);
      svg.appendChild(erscheine(s("rect", { x: 146, y: zeileY(li) - 10, width: 150, height: 12, rx: 3, fill: "none", stroke: "#f5b301", "stroke-width": 1.6 }), 0.2, ruhig));
      treffer.forEach(([, , cc, rr], i) => { const [x, y] = feld(cc, rr); svg.appendChild(erscheine(s("g", { "data-stueck": "zeichen" }, s("circle", { cx: x, cy: y, r: 9, fill: "none", stroke: "#f5b301", "stroke-width": 2 }),
        z.zaehle ? text(x + 9, y - 6, i + 1, { gross: 10, farbe: "#e0569a" }) : null), 0.4 + (i * T * 0.7) / treffer.length, ruhig, 0.25)); });
      if (z.zaehle) svg.appendChild(erscheine(text(220, 132, treffer.length, { gross: 16, farbe: "#e0569a" }), T + 0.1, ruhig));
    } else {
      const SCHRITT = { n: [0, -1], s: [0, 1], o: [1, 0], w: [-1, 0] };
      if (!Array.isArray(z.start) || !Array.isArray(z.weg) || !z.weg.length || z.weg.length > 4 || !Number.isInteger(z.massstab) || z.massstab < 1) return null;
      let [c, r] = z.start;
      const pts = [feld(c, r)];
      for (const [ri, n] of z.weg) {
        if (!SCHRITT[ri] || !Number.isInteger(n) || n < 1 || n > 3) return null;
        c += SCHRITT[ri][0] * n; r += SCHRITT[ri][1] * n;
        if (c < 0 || c > 5 || r < 0 || r > 5) return null;
        pts.push(feld(c, r));
      }
      const felder = z.weg.reduce((a, [, n]) => a + n, 0), meter = felder * z.massstab;
      svg.setAttribute("data-wert", meter);
      svg.setAttribute("data-anzahl", z.weg.length);
      const zeiten = ankunft(pts, T);
      svg.appendChild(s("circle", { cx: pts[0][0], cy: pts[0][1], r: 6, fill: "none", stroke: "#e0569a", "stroke-width": 2 }));
      for (let i = 1; i < pts.length; i++) svg.appendChild(erscheine(s("path", { d: `M${pts[i - 1].join(",")} L${pts[i].join(",")}`, fill: "none", stroke: "#e0569a", "stroke-width": 2.4, "stroke-dasharray": "4 3", "data-stueck": "wegstueck" }), zeiten[i - 1], ruhig, Math.max(0.2, zeiten[i] - zeiten[i - 1])));
      const [ax, ay] = pts[pts.length - 1], [bx, by] = pts[pts.length - 2], w = (Math.atan2(ay - by, ax - bx) * 180) / Math.PI;
      svg.appendChild(erscheine(s("path", { d: `M${ax},${ay} l-7,-4 l0,8 Z`, fill: "#e0569a", transform: `rotate(${w} ${ax} ${ay})` }), T, ruhig));
      const teile = z.weg.map(([, n]) => n);
      svg.append(s("rect", { x: 150, y: 116, width: 40, height: 4, fill: "#2d3047" }), text(196, 121, `1 Feld = ${z.massstab} m`, { gross: 9, anker: "start", fett: false }),
        erscheine(text(BREITE / 2 + 66, 140, `${teile.length > 1 ? `(${teile.join(" + ")})` : teile[0]} · ${z.massstab} m = ${meter} m`, { gross: 12, farbe: "#e0569a" }), T + 0.2, ruhig));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(22, 22, ruhig)); // oben links im Plan, dort ist kein Zeichen
    return svg;
  }

  // ----- Teddy-Versteck (REISE · teddy) -----
  // Plätze im Zimmer (Tisch links, Kiste in der Mitte, Stuhl rechts): wo der Teddy sitzt
  const TEDDY_PLATZ = { "auf-tisch": [80, 82], "unter-tisch": [80, 118], "ueber-tisch": [80, 64], "links-tisch": [34, 118], "zwischen": [132, 118], "in-kiste": [182, 106],
    "vor-kiste": [182, 136], "neben-kiste": [226, 118], "auf-stuhl": [272, 94] };
  /** Der Teddy (wie im Spiel gezeichnet), Füsse bei 0,0. */
  const teddyFigur = () => s("g", { "data-figur": "teddy" }, s("circle", { cx: -6, cy: -24, r: 3.5, fill: "#a8743f" }), s("circle", { cx: 6, cy: -24, r: 3.5, fill: "#a8743f" }),
    s("ellipse", { cx: 0, cy: -8, rx: 8, ry: 9, fill: "#a8743f" }), s("circle", { cx: 0, cy: -20, r: 7, fill: "#a8743f" }), s("ellipse", { cx: 0, cy: -18, rx: 3, ry: 2.2, fill: "#e8c79b" }),
    s("circle", { cx: -2.5, cy: -22, r: 0.9, fill: "#2d3047" }), s("circle", { cx: 2.5, cy: -22, r: 0.9, fill: "#2d3047" }));
  /**
   * Der Teddy hüpft von Platz zu Platz (auf, unter, über dem Tisch, in der Kiste, zwischen Tisch und Kiste, links und
   * rechts neben …), über dem Tisch mit Ballon (deko-2) wie im Spiel. Angabe: [Platz …] oder { regal: [[Bild, Fach 0–8] …] }
   * — die Spielsachen kommen ins Regal 3 × 3 (s6).
   */
  function teddy(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "teddy" });
    svg.append(tagGrund(), s("rect", { x: 0, y: 120, width: BREITE, height: 30, rx: 14, fill: "#eadfcb" }));
    if (z.regal) {
      if (!Array.isArray(z.regal) || !z.regal.length || z.regal.length > 9 || !z.regal.every(([b, f]) => typeof b === "string" && Number.isInteger(f) && f >= 0 && f <= 8) || new Set(z.regal.map(r => r[1])).size !== z.regal.length) return null;
      svg.setAttribute("data-anzahl", z.regal.length);
      const fz = 34, x0 = 160 - 1.5 * fz, y0 = 16;
      svg.appendChild(s("rect", { x: x0 - 4, y: y0 - 4, width: 3 * fz + 8, height: 3 * fz + 8, rx: 4, fill: "#a8743f" }));
      for (let f = 0; f < 9; f++) svg.appendChild(s("rect", { x: x0 + (f % 3) * fz + 2, y: y0 + Math.floor(f / 3) * fz + 2, width: fz - 4, height: fz - 4, fill: "#f3e3c3" }));
      z.regal.forEach(([b, f], i) => { const x = x0 + (f % 3 + 0.5) * fz, y = y0 + (Math.floor(f / 3) + 0.5) * fz; svg.appendChild(vonOben(s("g", { "data-stueck": "ding", "data-fach": f }, bildzeichen(x, y, b, 20)), (i * T) / z.regal.length, ruhig, 40, 0.35)); });
    } else {
      if (!Array.isArray(z) || !z.length || z.length > 4 || !z.every(p => TEDDY_PLATZ[p])) return null;
      svg.setAttribute("data-anzahl", z.length);
      svg.setAttribute("data-wert", z[z.length - 1]);
      // Tisch, Kiste (hinten), Stuhl
      svg.append(s("rect", { x: 48, y: 84, width: 64, height: 6, fill: "#a8743f" }), s("path", { d: "M54,90 V120 M106,90 V120", stroke: "#6b4a2b", "stroke-width": 4 }),
        s("rect", { x: 154, y: 92, width: 56, height: 28, fill: "#c08a4f" }), s("rect", { x: 258, y: 94, width: 30, height: 5, fill: "#a8743f" }),
        s("path", { d: "M262,99 V120 M284,99 V120 M286,94 V66", stroke: "#6b4a2b", "stroke-width": 3 }));
      const pts = z.map(p => TEDDY_PLATZ[p]), weg = pts.slice(1).reduce((d, [x, y], i) => { const [px, py] = pts[i]; return d + ` Q${(px + x) / 2},${Math.min(py, y) - 34} ${x},${y}`; }, `M${pts[0][0]},${pts[0][1] - 30} L${pts[0][0]},${pts[0][1]}`);
      const [ex, ey] = pts[pts.length - 1], figur = s("g", {}, teddyFigur());
      if (z[z.length - 1] === "ueber-tisch") figur.append(s("line", { x1: 5, y1: -14, x2: 12, y2: -38, stroke: "#6b7089", "stroke-width": 1 }), s("ellipse", { cx: 12, cy: -46, rx: 7, ry: 9, style: "fill:var(--deko-2)" }));
      svg.appendChild(bewege(figur, weg, { x: ex, y: ey, winkel: 0 }, ruhig, { drehen: false, dauer: T }));
      // die Vorderwand der Kiste: der Teddy in der Kiste schaut nur oben heraus
      svg.appendChild(s("rect", { x: 154, y: 104, width: 56, height: 16, fill: "#a8743f" }));
      z.forEach((p, i) => { const [x, y] = TEDDY_PLATZ[p]; svg.appendChild(erscheine(s("circle", { cx: x, cy: y + 1, r: 2.4, fill: "#e0569a", "data-stueck": "platz" }), (T * (i + 0.5)) / z.length, ruhig, 0.2)); });
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Tier-Sortierer (SAMMELN · album) -----
  const TIER_BILD = ["🦌", "🐗", "🦊", "🦡", "🐺", "🐻", "🐿️", "🐁", "🐇", "🦔", "🦇", "🦫", "🐄", "🐑", "🐐", "🐖", "🐎", "🫏", "🦓", "🐕", "🐈", "🐰", "🐹", "🐀", "🐋", "🐬",
    "🦉", "🦆", "🦢", "🦅", "🐦‍⬛", "🐔", "🦜", "🐧", "🐟", "🐠", "🦈", "🦎", "🐍", "🐢", "🐊", "🐸", "🐜", "🪲", "🦗", "🦋", "🐞", "🐝", "🪰", "🦟", "🕷️", "🐌", "🪱"];
  /**
   * Das Album füllt sich, je Korb des Spiels eine Spalte mit seinem Zeichen (🌳 🚜 🏠, 🍼 🪶 🫧 🛡️ 💧 6️⃣ 8️⃣, 🦷 👂 🥩 ✌️ …);
   * falle: ein kniffliges Tier landet erst im falschen Korb (✗) und rückt dann in den richtigen (Fledermaus kein Vogel).
   * Angabe: { seiten: [[Korbzeichen, [Tier …]] …], falle?: [[Tier, falsch, richtig] …] }.
   */
  function album(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z || !Array.isArray(z.seiten) || !z.seiten.length || z.seiten.length > 6 || !z.seiten.every(([k, t0]) => typeof k === "string" && Array.isArray(t0) && t0.length <= 3 && t0.every(b => TIER_BILD.includes(b)))) return null;
    const korb = z.seiten.map(([k]) => k), falle = z.falle ?? [];
    if (!falle.every(([b, f, r]) => TIER_BILD.includes(b) && korb.includes(f) && korb.includes(r) && f !== r)) return null;
    const anzahl = z.seiten.reduce((a, [, t0]) => a + t0.length, 0) + falle.length;
    if (!anzahl) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "album", "data-anzahl": anzahl });
    svg.append(tagGrund(), s("rect", { x: 14, y: 8, width: 292, height: 134, rx: 8, fill: "#fffaf0", stroke: "#d9cdb0", "stroke-width": 1.4 }));
    const n = korb.length, sb = 292 / n, spX = i => 14 + (i + 0.5) * sb, zeilen = z.seiten.map(([, t0]) => t0.length);
    z.seiten.forEach(([k], i) => { svg.append(s("circle", { cx: spX(i), cy: 26, r: 13, fill: "#ffffff", style: `stroke:var(--deko-${(i % 6) + 1})`, "stroke-width": 2 }), bildzeichen(spX(i), 26, k, 14)); if (i) svg.appendChild(s("line", { x1: 14 + i * sb, y1: 14, x2: 14 + i * sb, y2: 136, stroke: "#ece3cc", "stroke-width": 1 })); });
    let k = 0;
    z.seiten.forEach(([, tiere], i) => tiere.forEach((b, j) => svg.appendChild(vonOben(s("g", { "data-stueck": "tier" }, bildzeichen(spX(i), 58 + j * 28, b, 22)), (k++ * T * 0.7) / anzahl, ruhig, 30, 0.35))));
    falle.forEach(([b, f, r]) => {
      const fi = korb.indexOf(f), ri = korb.indexOf(r), y = 58 + zeilen[ri]++ * 28, ab = (k++ * T * 0.7) / anzahl;
      svg.appendChild(kurz(s("g", {}, bildzeichen(spX(fi), 58 + (zeilen[fi]) * 28, b, 22), kreuz(spX(fi) + 14, 50 + zeilen[fi] * 28, 12)), ab, ab + 0.6, ruhig));
      svg.appendChild(erscheine(s("g", { "data-stueck": "tier", "data-falle": f }, bildzeichen(spX(ri), y, b, 22), haken(spX(ri) + 14, y - 8, 11)), ab + 0.6, ruhig, 0.25));
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 140, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 128, ruhig));
    return svg;
  }

  // ----- Lebensraum-Zuordnung (REISE · lebensraeume) -----
  const RAUM = { wald: ["🌲", "#2f7d4f"], wiese: ["🌼", "#7cb342"], weiher: ["💧", "#2f8fe0"], gebirge: ["🏔️", "#7a6f9b"] }; // Farben des Spiels
  /**
   * { raeume: [[Raum, [Tier …]] …] } — die Eule fliegt über die Lebensräume (Farben und Zeichen des Spiels), die Tiere
   * schauen hervor; { kette: [Bild …] } — Nahrungskette, der Pfeil heisst „wird gefressen von“ wie im Spiel; { netz:
   * [[Futter, Fresser] …] } — mehrere Ketten zusammen (die Feldmaus fressen Fuchs und Waldkauz).
   */
  function lebensraeume(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "lebensraeume" });
    svg.appendChild(tagGrund());
    if (Array.isArray(z.raeume)) {
      if (!z.raeume.length || z.raeume.length > 4 || !z.raeume.every(([r, t0]) => RAUM[r] && Array.isArray(t0) && t0.length >= 1 && t0.length <= 3 && t0.every(b => TIER_BILD.includes(b)))) return null;
      const n = z.raeume.length, rb = 300 / n, anzahl = z.raeume.reduce((a, [, t0]) => a + t0.length, 0);
      svg.setAttribute("data-anzahl", anzahl);
      let k = 0;
      z.raeume.forEach(([r, tiere], i) => {
        const x = 10 + i * rb, [zeichen, farbe] = RAUM[r];
        svg.append(s("rect", { x: x + 2, y: 40, width: rb - 4, height: 100, rx: 8, fill: farbe, opacity: 0.85 }), bildzeichen(x + rb / 2, 56, zeichen, 18));
        tiere.forEach((b, j) => svg.appendChild(erscheine(s("g", { "data-stueck": "tier" }, bildzeichen(x + rb / 2 + (j - (tiere.length - 1) / 2) * Math.min(30, (rb - 10) / tiere.length), 104, b, 22)), 0.3 + ((i + j / 3) * T * 0.8) / n, ruhig, 0.3)));
        k += tiere.length;
      });
      svg.appendChild(bewege(s("g", {}, euleSitzend(0.16)), `M10,24 L${10 + (n - 0.5) * rb},24`, { x: 10 + (n - 0.5) * rb, y: 24, winkel: 0 }, ruhig, { drehen: false, linear: true }));
    } else {
      // Kette als Netz mit einer Kante je Paar; die Ebenen von links nach rechts (Futter links, Fresser rechts)
      const kanten = Array.isArray(z.kette) ? z.kette.slice(1).map((b, i) => [z.kette[i], b]) : z.netz;
      if (!Array.isArray(kanten) || !kanten.length || kanten.length > 6 || !kanten.every(k0 => Array.isArray(k0) && k0.length === 2 && k0.every(b => typeof b === "string" && b.length))) return null;
      const knoten = [...new Set(kanten.flat())], ebene = new Map(knoten.map(b => [b, 0]));
      for (let r = 0; r < knoten.length; r++) for (const [a, b] of kanten) if (ebene.get(b) <= ebene.get(a)) ebene.set(b, ebene.get(a) + 1);
      if ([...ebene.values()].some(e => e >= knoten.length)) return null; // kein Kreis in der Kette
      const tiefe = Math.max(...ebene.values()) + 1, jeEbene = new Map();
      const pos = new Map(knoten.map(b => { const e = ebene.get(b), i = jeEbene.get(e) || 0; jeEbene.set(e, i + 1); return [b, [e, i]]; }));
      const xy = b => { const [e, i] = pos.get(b), m = jeEbene.get(e); return [40 + (tiefe > 1 ? (e * 240) / (tiefe - 1) : 120), 75 + (i - (m - 1) / 2) * 46]; };
      svg.setAttribute("data-anzahl", kanten.length);
      knoten.forEach(b => { const [x, y] = xy(b); svg.appendChild(erscheine(s("g", {}, s("circle", { cx: x, cy: y, r: 18, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.4 }), bildzeichen(x, y, b, 22)), (ebene.get(b) * T * 0.8) / tiefe, ruhig, 0.3)); });
      kanten.forEach(([a, b]) => {
        const [x1, y1] = xy(a), [x2, y2] = xy(b), l = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / l, uy = (y2 - y1) / l, w = (Math.atan2(uy, ux) * 180) / Math.PI;
        const sx = x1 + ux * 20, sy = y1 + uy * 20, zx = x2 - ux * 21, zy = y2 - uy * 21;
        svg.appendChild(erscheine(s("g", { "data-stueck": "frisst" }, s("line", { x1: sx, y1: sy, x2: zx, y2: zy, stroke: "#2fbf71", "stroke-width": 2.2 }), s("path", { d: `M${zx},${zy} l-7,-4 l0,8 Z`, fill: "#2fbf71", transform: `rotate(${w} ${zx} ${zy})` })),
          ((ebene.get(a) + 0.6) * T * 0.8) / tiefe, ruhig, 0.3));
      });
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 130, ruhig));
    return svg;
  }

  // ----- Fledermaus-Forscher (ZYKLUS · fledermaus) -----
  /** Fledermaus mit ausgebreiteten Flügeln (Flughaut), Mitte bei 0,0, Grösse k. */
  const fledermausFigur = (k = 1) => s("g", { transform: `scale(${k})`, "data-figur": "fledermaus" },
    // heller als die Nacht, mit hellem Rand: auf dem Nachthimmel gut zu sehen
    s("path", { d: "M0,-3 Q-8,-12 -24,-8 Q-19,-2 -22,5 Q-14,1 -9,7 Q-5,2 0,6 Q5,2 9,7 Q14,1 22,5 Q19,-2 24,-8 Q8,-12 0,-3 Z", fill: "#6b5a80", stroke: "#d9cdf0", "stroke-width": 0.6 }),
    s("path", { d: "M-4,-5 L-6,-12 L-1,-7 Z M4,-5 L6,-12 L1,-7 Z", fill: "#6b5a80", stroke: "#d9cdf0", "stroke-width": 0.5 }), s("circle", { cx: -2, cy: -4, r: 0.9, fill: "#fff6c8" }), s("circle", { cx: 2, cy: -4, r: 0.9, fill: "#fff6c8" }));
  // das Jahr der Fledermaus wie im Spiel; ohne Jahreszeit (s6) zeigt jede Station, was sie tut
  const FLEDER_JAHR = [["❄️", "💤"], ["🌱", "🦟"], ["☀️", "🍼"], ["☀️", "🦇"], ["🍂", "🐛"]];
  /**
   * { echo: true } — sie ruft, das Echo kommt von der Mücke zurück (grosse Ohren, s1); { jagd: 1–4 } — sie fängt nachts
   * Insekten; { wochenstube: true } — Mutter und Junges hängen kopfüber in der Wochenstube; { jahr: true, ohneZeit? } — das
   * Jahr im Kreis (Winterschlaf, Aufwachen, Junges, Fliegen lernen, Fett anfressen); { anpassungen: 1–4 } — Ohren,
   * Flughaut, Krallen, Zähne leuchten auf.
   */
  function fledermaus(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z) return null;
    const svg = neuesBild("zyklus", stufe, { "data-bilder": "fledermaus" });
    svg.append(himmelGrund(), himmel());
    if (z.echo === true) {
      svg.append(s("g", { transform: "translate(80 70)" }, fledermausFigur(1.4)), bildzeichen(250, 70, "🦟", 16));
      for (let i = 0; i < 4; i++) svg.appendChild(zeichne(s("path", { d: `M${112 + i * 30},${58 - i * 2} Q${120 + i * 30},70 ${112 + i * 30},${82 + i * 2}`, fill: "none", stroke: "#9fd8e0", "stroke-width": 2 }), 0.1 + i * 0.2, ruhig, 0.2));
      const zurueck = s("g", { "data-stueck": "echo" });
      for (let i = 0; i < 4; i++) zurueck.appendChild(zeichne(s("path", { d: `M${228 - i * 30},${62 + i * 1.5} Q${222 - i * 30},70 ${228 - i * 30},${78 - i * 1.5}`, fill: "none", stroke: "#f5b301", "stroke-width": 1.8, "stroke-dasharray": "3 2" }), T * 0.55 + i * 0.18, ruhig, 0.2));
      svg.appendChild(zurueck);
      svg.setAttribute("data-anzahl", 1);
    } else if (Number.isInteger(z.jagd)) {
      if (z.jagd < 1 || z.jagd > 4) return null;
      svg.setAttribute("data-anzahl", z.jagd);
      const pts = [[30, 100], ...[...Array(z.jagd).keys()].map(i => [80 + i * 60, i % 2 ? 90 : 46])], zeiten = ankunft(pts, T);
      pts.slice(1).forEach(([x, y], i) => svg.append(kurz(bildzeichen(x, y, "🦟", 14), 0, zeiten[i + 1], ruhig), erscheine(s("circle", { cx: x, cy: y, r: 3, fill: "#f5b301", "data-stueck": "gefangen" }), zeiten[i + 1], ruhig, 0.2)));
      const [ex, ey] = pts[pts.length - 1];
      svg.appendChild(bewege(s("g", {}, fledermausFigur(1)), "M" + pts.map(p => p.join(",")).join(" L"), { x: ex, y: ey, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T }));
    } else if (z.wochenstube === true) {
      svg.append(s("path", { d: "M40,10 H280 V22 Q160,30 40,22 Z", fill: "#5e4a3a" }));
      const haengend = (x, k, ab) => herein(s("g", { "data-stueck": "fledermaus" }, s("line", { x1: x, y1: 22, x2: x, y2: 30, stroke: "#3a2f45", "stroke-width": 1.4 }), s("g", { transform: `translate(${x} ${30 + 14 * k}) rotate(180) scale(${k * 0.5} ${k})` }, fledermausFigur(1))), 0, -20, ab, ruhig, 0.4);
      svg.append(haengend(130, 1, 0.2), haengend(160, 0.6, T * 0.5), haengend(200, 1, 0.5), erscheine(bildzeichen(160, 90, "🍼", 18), T, ruhig));
      svg.setAttribute("data-anzahl", 3);
    } else if (z.jahr === true) {
      const cx = 160, cy = 76, R = 52;
      svg.setAttribute("data-anzahl", FLEDER_JAHR.length);
      svg.appendChild(s("circle", { cx, cy, r: R, fill: "none", stroke: "#5a607e", "stroke-width": 1.6, "stroke-dasharray": "3 3" }));
      const pts = FLEDER_JAHR.map((_, i) => { const w = (i * 2 * Math.PI) / 5 - Math.PI / 2; return [cx + R * Math.cos(w), cy + R * Math.sin(w)]; });
      FLEDER_JAHR.forEach(([zeit, tut], i) => svg.appendChild(erscheine(s("g", { "data-stueck": "station" }, s("circle", { cx: pts[i][0], cy: pts[i][1], r: 15, fill: "#2b2f52", stroke: "#9aa0c4", "stroke-width": 1 }),
        bildzeichen(pts[i][0], pts[i][1], z.ohneZeit ? tut : zeit, 16)), (i * T) / 5, ruhig, 0.3)));
      svg.appendChild(bewege(s("g", {}, fledermausFigur(0.6)), `M${pts[0][0]},${pts[0][1] - 22} A${R + 22},${R + 22} 0 1,1 ${pts[4][0] - 18},${pts[4][1] - 14}`, { x: pts[4][0] - 18, y: pts[4][1] - 14, winkel: 0 }, ruhig, { drehen: false, dauer: T }));
    } else if (Number.isInteger(z.anpassungen)) {
      if (z.anpassungen < 1 || z.anpassungen > 4) return null;
      svg.setAttribute("data-anzahl", z.anpassungen);
      svg.appendChild(s("g", { transform: "translate(160 80)" }, fledermausFigur(4)));
      // grosse Ohren, Flughaut, Krallen, spitze Zähne (deko-4 wie die markierten Teile im Spiel)
      const TEILE = [s("circle", { cx: 160, cy: 52, r: 16, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 2.4 }), s("ellipse", { cx: 228, cy: 76, rx: 30, ry: 22, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 2.4 }),
        s("circle", { cx: 160, cy: 106, r: 12, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 2.4 }), s("circle", { cx: 160, cy: 72, r: 8, fill: "none", style: "stroke:var(--deko-4)", "stroke-width": 2.4 })];
      TEILE.slice(0, z.anpassungen).forEach((e, i) => { e.setAttribute("data-stueck", "teil"); svg.appendChild(erscheine(e, (i * T) / z.anpassungen, ruhig, 0.3)); });
    } else return null;
    if (sterne >= 2) svg.appendChild(funkeln(ruhig));
    if (sterne >= 3) svg.appendChild(sternschnuppe(ruhig));
    return svg;
  }

  // ----- Lebenszyklus-Puzzle (ZYKLUS · lebenszyklus) -----
  // Stadien ohne Bildzeichen im Spiel, hier gezeichnet (Mitte bei 0,0)
  const STADIUM = {
    puppe: () => s("g", {}, s("line", { x1: 0, y1: -14, x2: 0, y2: -9, stroke: "#6b4a2b", "stroke-width": 1 }), s("ellipse", { cx: 0, cy: 0, rx: 5, ry: 10, fill: "#a8743f" }), s("path", { d: "M-4,-3 h8 M-4,3 h8", stroke: "#6b4a2b", "stroke-width": 0.8 })),
    larve: () => s("g", {}, ...[-8, -3, 2, 7].map(x => s("circle", { cx: x, cy: 0, r: 4, fill: "#4f5668" })), s("circle", { cx: -3, cy: -1, r: 1.1, fill: "#f07c2a" }), s("circle", { cx: 7, cy: -1, r: 1.1, fill: "#f07c2a" })),
    kaulquappe: () => s("g", {}, s("ellipse", { cx: -4, cy: 0, rx: 6, ry: 5, fill: "#3a3f5c" }), s("path", { d: "M1,0 Q8,-4 13,1 Q8,2 1,2 Z", fill: "#3a3f5c" })),
    beine: () => s("g", {}, s("ellipse", { cx: -4, cy: 0, rx: 6, ry: 5, fill: "#4f6b3a" }), s("path", { d: "M1,0 Q8,-4 13,1 Q8,2 1,2 Z", fill: "#4f6b3a" }), s("path", { d: "M-2,4 l-3,5 M2,4 l3,5", stroke: "#4f6b3a", "stroke-width": 1.6 })),
    jungfrosch: () => s("g", {}, s("ellipse", { cx: -2, cy: 0, rx: 7, ry: 5, fill: "#6cc77c" }), s("path", { d: "M5,1 Q10,0 12,3", stroke: "#6cc77c", "stroke-width": 2, fill: "none" }), s("path", { d: "M-7,3 l-3,4 M2,4 l2,4 M-5,-3 l-4,-2", stroke: "#6cc77c", "stroke-width": 1.6 }), s("circle", { cx: -5, cy: -3, r: 1, fill: "#2d3047" })),
  };
  const GEBURT = { ei: "🥚", beutel: "👜", lebend: "🍼" };
  /**
   * { stadien: [Bild | Zeichnung …], kreis? } — die Stadien des Zyklus (Liste des Spiels) erscheinen im Kreis mit Pfeilen,
   * kreis: der Pfeil führt vom letzten zurück zum ersten; { geburt: [[Tier, ei | beutel | lebend] …] } — die Tiere in die
   * Körbe 🥚 👜 🍼.
   */
  function lebenszyklus(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z) return null;
    const svg = neuesBild("zyklus", stufe, { "data-bilder": "lebenszyklus" });
    svg.appendChild(tagGrund());
    if (Array.isArray(z.geburt)) {
      if (!z.geburt.length || z.geburt.length > 6 || !z.geburt.every(([b, a]) => typeof b === "string" && GEBURT[a])) return null;
      svg.setAttribute("data-anzahl", z.geburt.length);
      const KX = { ei: 70, beutel: 160, lebend: 250 }, zaehl = { ei: 0, beutel: 0, lebend: 0 };
      for (const [a, kx] of Object.entries(KX)) svg.append(s("path", { d: `M${kx - 40},84 H${kx + 40} L${kx + 32},134 H${kx - 32} Z`, fill: "#ffffff", stroke: "#a8743f", "stroke-width": 2 }), bildzeichen(kx, 122, GEBURT[a], 14));
      z.geburt.forEach(([b, a], i) => { const x = KX[a] + (zaehl[a]++ - 0.5) * 26; svg.appendChild(herein(s("g", { "data-stueck": "tier", "data-geburt": a }, bildzeichen(x, 100, b, 22)), 160 - x, -76, 0.2 + i * 0.4, ruhig, 0.45)); });
    } else {
      if (!Array.isArray(z.stadien) || z.stadien.length < 3 || z.stadien.length > 6 || !z.stadien.every(b => typeof b === "string" && (STADIUM[b] || !/^[a-z]+$/.test(b)))) return null;
      const n = z.stadien.length, cx = 160, cy = 76, R = 50;
      svg.setAttribute("data-anzahl", n);
      const pts = z.stadien.map((_, i) => { const w = (i * 2 * Math.PI) / n - Math.PI / 2; return [cx + R * Math.cos(w) * 1.6, cy + R * Math.sin(w)]; });
      z.stadien.forEach((b, i) => {
        const [x, y] = pts[i], bild = STADIUM[b] ? s("g", { transform: `translate(${x} ${y}) scale(1.3)` }, STADIUM[b]()) : bildzeichen(x, y, b, 24);
        svg.appendChild(erscheine(s("g", { "data-stueck": "stadium" }, s("circle", { cx: x, cy: y, r: 19, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.4 }), bild), (i * T) / n, ruhig, 0.3));
        if (i < n - 1 || z.kreis) {
          const [x2, y2] = pts[(i + 1) % n], l = Math.hypot(x2 - x, y2 - y), ux = (x2 - x) / l, uy = (y2 - y) / l, w = (Math.atan2(uy, ux) * 180) / Math.PI, ax = x2 - ux * 22, ay = y2 - uy * 22;
          svg.appendChild(erscheine(s("g", {}, s("line", { x1: x + ux * 22, y1: y + uy * 22, x2: ax, y2: ay, stroke: "#2fbf71", "stroke-width": 2 }), s("path", { d: `M${ax},${ay} l-6,-3.5 l0,7 Z`, fill: "#2fbf71", transform: `rotate(${w} ${ax} ${ay})` })), ((i + 0.6) * T) / n, ruhig, 0.25));
        }
      });
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 22, ruhig));
    return svg;
  }

  // ----- Pflanzen-Bestimmer (WACHSEN · pflanze) -----
  /** Blattform an x, y (Länge l): oval, herz, lanzett, gefingert (fünf Fingerblätter wie die Rosskastanie), gesägt? */
  function blatt(form, x, y, l = 30, { gesaegt = false, farbe = "#4f9d47" } = {}) {
    const f = { fill: farbe, stroke: "#2f6b2a", "stroke-width": 1 };
    if (form === "gefingert") return s("g", {}, ...[-60, -30, 0, 30, 60].map(w => s("ellipse", { cx: x, cy: y - l * 0.35, rx: l * 0.12, ry: l * 0.35, ...f, transform: `rotate(${w} ${x} ${y})` })), s("line", { x1: x, y1: y, x2: x, y2: y + l * 0.4, stroke: "#2f6b2a", "stroke-width": 1.4 }));
    const b = form === "lanzett" ? 0.18 : form === "herz" ? 0.42 : 0.32;
    let d;
    if (form === "herz") d = `M${x},${y + l / 2} C${x - l * 0.6},${y} ${x - l * 0.5},${y - l / 2} ${x},${y - l * 0.3} C${x + l * 0.5},${y - l / 2} ${x + l * 0.6},${y} ${x},${y + l / 2} Z`;
    else if (gesaegt) { const pz = []; for (let i = 0; i <= 8; i++) { const v = -l / 2 + (i * l) / 8, r = b * l * Math.sqrt(Math.max(0, 1 - (2 * v / l) ** 2)) * (i % 2 ? 1.12 : 0.92); pz.push([x + r, y + v]); }
      d = "M" + [...pz, ...pz.slice().reverse().map(([px, py]) => [2 * x - px, py])].map(p => p.join(",")).join(" L") + " Z"; }
    else d = `M${x},${y - l / 2} Q${x + b * l * 1.4},${y} ${x},${y + l / 2} Q${x - b * l * 1.4},${y} ${x},${y - l / 2} Z`;
    return s("g", {}, s("path", { d, ...f }), s("line", { x1: x, y1: y - l / 2, x2: x, y2: y + l / 2 + 4, stroke: "#2f6b2a", "stroke-width": 1 }));
  }
  const BLATTFORMEN = ["oval", "herz", "lanzett", "gefingert"];
  /**
   * { baeume: true } — Laubbaum und Nadelbaum wachsen (s1); { blaetter: [Form …] } — Blattformen des Spiels (s2); { rand:
   * true } — Rand glatt und gesägt, Blätter gegenständig und wechselständig am Zweig (s3); { schluessel: true } — zwei
   * Ja/Nein-Fragen, bis von vier Blättern eines bleibt (s4); { bluete: 4 | 9 } — Blüte im Längsschnitt wie im Spiel:
   * Kelchblatt, Blütenblatt, Staubblatt, Stempel; mit 9 dazu Staubbeutel, Staubfaden, Narbe, Griffel, Fruchtknoten.
   */
  function pflanze(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z) return null;
    const svg = neuesBild("wachsen", stufe, { "data-bilder": "pflanze" });
    svg.append(tagGrund(), boden());
    // wächst aus dem Fusspunkt cx, cy: aussen dorthin verschieben, in der Mitte skalieren, innen zurück
    const wachse = (e, ab, cx, cy) => {
      if (ruhig) return e;
      const mitte = s("g", { transform: "scale(0.05)" }, s("g", { transform: `translate(${-cx} ${-cy})` }, e));
      mitte.appendChild(s("animateTransform", { attributeName: "transform", type: "scale", from: "0.05", to: "1", begin: t(ab), dur: "0.7s", fill: "freeze" }));
      return s("g", { transform: `translate(${cx} ${cy})` }, mitte);
    };
    if (z.baeume === true) {
      svg.setAttribute("data-anzahl", 2);
      const laub = s("g", { "data-stueck": "laubbaum" }, s("rect", { x: 96, y: 86, width: 8, height: 44, fill: "#8a5a32" }), s("circle", { cx: 100, cy: 66, r: 30, fill: "#5aa84f" }), blatt("oval", 152, 70, 26));
      const nadel = s("g", { "data-stueck": "nadelbaum" }, s("rect", { x: 216, y: 106, width: 8, height: 24, fill: "#8a5a32" }), s("path", { d: "M220,26 L250,108 L190,108 Z", fill: "#2f7d4f" }),
        s("path", { d: "M262,60 l6,16 M268,60 l0,17 M274,60 l-6,16", stroke: "#2f7d4f", "stroke-width": 1.6 }));
      svg.append(wachse(laub, 0.1, 100, 130), wachse(nadel, T * 0.5, 220, 130));
    } else if (Array.isArray(z.blaetter)) {
      if (!z.blaetter.length || z.blaetter.length > 4 || !z.blaetter.every(f => BLATTFORMEN.includes(f))) return null;
      svg.setAttribute("data-anzahl", z.blaetter.length);
      z.blaetter.forEach((f, i) => { const x = 160 + (i - (z.blaetter.length - 1) / 2) * 70; svg.appendChild(wachse(s("g", { "data-stueck": "blatt", "data-form": f }, blatt(f, x, 66, 56)), (i * T) / z.blaetter.length, x, 100)); });
    } else if (z.rand === true) {
      svg.setAttribute("data-anzahl", 4);
      svg.append(wachse(s("g", { "data-stueck": "rand" }, blatt("oval", 50, 64, 54)), 0.1, 50, 96), wachse(s("g", { "data-stueck": "rand" }, blatt("oval", 110, 64, 54, { gesaegt: true })), T * 0.25, 110, 96));
      // Zweige: gegenständig (Paare) und wechselständig (abwechselnd)
      const zweig = (x, gegen, ab) => { const g = s("g", { "data-stueck": "stellung" }, s("line", { x1: x, y1: 120, x2: x, y2: 24, stroke: "#6b4a2b", "stroke-width": 2 }));
        for (let i = 0; i < 3; i++) { const y = 104 - i * 30; for (const sg of gegen ? [-1, 1] : [i % 2 ? 1 : -1]) g.appendChild(s("g", { transform: `rotate(${sg * 60} ${x} ${y + (gegen ? 0 : sg * 5)})` }, blatt("oval", x, y - 12 + (gegen ? 0 : sg * 5), 22))); }
        return wachse(g, ab, x, 120); };
      svg.append(zweig(200, true, T * 0.5), zweig(270, false, T * 0.75));
    } else if (z.schluessel === true) {
      svg.setAttribute("data-anzahl", 1);
      const xs = [70, 130, 190, 250], formen = ["oval", "herz", "lanzett", "gefingert"];
      formen.forEach((f, i) => svg.appendChild(blatt(f, xs[i], 104, 34)));
      // Frage 1 „gefingert oder gefiedert?“ streicht zwei, Frage 2 streicht noch eins
      svg.append(s("path", { d: "M130,22 l10,-8 l10,8 l-10,8 Z", style: "fill:var(--deko-4)" }), text(140, 26, "?", { gross: 10 }), s("path", { d: "M190,48 l10,-8 l10,8 l-10,8 Z", style: "fill:var(--deko-4)" }), text(200, 52, "?", { gross: 10 }));
      const streiche = (i, ab) => svg.appendChild(erscheine(s("path", { d: `M${xs[i] - 14},${90} l28,28 M${xs[i] + 14},${90} l-28,28`, stroke: "#ff9f1c", "stroke-width": 2.6 }), ab, ruhig, 0.2));
      streiche(0, T * 0.3); streiche(1, T * 0.4); streiche(2, T * 0.75);
      svg.appendChild(erscheine(s("g", { "data-stueck": "bestimmt" }, s("circle", { cx: 250, cy: 104, r: 24, fill: "none", stroke: "#2fbf71", "stroke-width": 2.4 }), haken(276, 84, 16)), T, ruhig));
    } else if (z.bluete === 4 || z.bluete === 9) {
      svg.setAttribute("data-anzahl", z.bluete);
      // Längsschnitt: zwei Kelchblätter, zwei Blütenblätter (rosa), vier Staubblätter, in der Mitte der Stempel
      svg.append(s("line", { x1: 120, y1: 132, x2: 120, y2: 92, stroke: "#2f6b2a", "stroke-width": 3 }), s("path", { d: "M120,92 Q100,92 92,78 Q108,84 120,86 Q132,84 148,78 Q140,92 120,92 Z", fill: "#5aa84f" }),
        s("path", { d: "M118,86 Q80,70 82,36 Q104,52 116,80 Z M122,86 Q160,70 158,36 Q136,52 124,80 Z", fill: "#f5a3c7" }));
      for (const x of [108, 114, 126, 132]) svg.append(s("line", { x1: 120 + (x - 120) * 0.3, y1: 86, x2: x, y2: 52, stroke: "#c9a43a", "stroke-width": 1.2 }), s("ellipse", { cx: x, cy: 50, rx: 2.4, ry: 3.4, fill: "#f5b301" }));
      svg.append(s("ellipse", { cx: 120, cy: 80, rx: 6, ry: 7, fill: "#8ac46f" }), s("line", { x1: 120, y1: 73, x2: 120, y2: 46, stroke: "#8ac46f", "stroke-width": 2.4 }), s("ellipse", { cx: 120, cy: 44, rx: 4, ry: 2.4, fill: "#6ba35a" }));
      const TEILE = [["Kelchblatt", 96, 84], ["Blütenblatt", 88, 46], ["Staubblatt", 132, 56], ["Stempel", 120, 60], ["Staubbeutel", 108, 50], ["Staubfaden", 111, 68], ["Narbe", 120, 44], ["Griffel", 120, 56], ["Fruchtknoten", 120, 80]];
      TEILE.slice(0, z.bluete).forEach(([name, x, y], i) => {
        const ty = 18 + i * (z.bluete > 4 ? 13 : 26);
        svg.appendChild(erscheine(s("g", { "data-stueck": "teil" }, s("line", { x1: x, y1: y, x2: 196, y2: ty - 3, stroke: "#8a8fa8", "stroke-width": 0.8 }), s("circle", { cx: x, cy: y, r: 2, style: "fill:var(--deko-4)" }),
          text(200, ty, name, { gross: z.bluete > 4 ? 9 : 11, anker: "start" })), (i * T) / z.bluete, ruhig, 0.25));
      });
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(300, 108, ruhig));
    return svg;
  }

  // ----- Wetter und Jahreszeiten (ZYKLUS · wetter) -----
  const WETTER_SYMBOL = ["☀️", "⛅", "☁️", "🌧️", "⛈️", "🌨️", "🌫️", "🌬️"];
  /** Thermometer wie im Spiel: rote Säule mit Kugel, Striche je strich, Zahl je 10, gestrichelte 0-Linie im Minus. */
  function thermometer(svg, [von, bis, strich], werte, ruhig, T, x = 50) {
    const oben = 18, unten = 118, Y = v => unten - ((v - von) / (bis - von)) * (unten - oben);
    svg.append(s("rect", { x: x - 6, y: oben - 6, width: 12, height: unten - oben + 12, rx: 6, fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 1.4 }), s("circle", { cx: x, cy: unten + 12, r: 9, fill: "#e5322d" }));
    for (let v = von; v <= bis; v += strich) {
      const zahl = v % 10 === 0;
      svg.appendChild(s("line", { x1: x + 7, y1: Y(v), x2: x + (zahl ? 15 : 11), y2: Y(v), stroke: "#2d3047", "stroke-width": zahl ? 1.2 : 0.6 }));
      if (zahl) svg.appendChild(text(x + 18, Y(v) + 3, v, { gross: 9, anker: "start", fett: false }));
    }
    if (von < 0) svg.appendChild(s("line", { x1: x - 10, y1: Y(0), x2: x + 34, y2: Y(0), stroke: "#2f8fe0", "stroke-width": 1, "stroke-dasharray": "3 2" }));
    const saeule = s("rect", { x: x - 3, y: Y(werte[0]), width: 6, height: unten + 6 - Y(werte[0]), fill: "#e5322d", "data-wert": werte[werte.length - 1] });
    if (!ruhig) {
      const ys = werte.map(Y);
      saeule.setAttribute("y", unten); saeule.setAttribute("height", 6);
      saeule.append(s("animate", { attributeName: "y", values: [unten, ...ys].join(";"), begin: t(0.2), dur: `${T}s`, fill: "freeze" }), s("animate", { attributeName: "height", values: [6, ...ys.map(y => unten + 6 - y)].join(";"), begin: t(0.2), dur: `${T}s`, fill: "freeze" }));
    } else { saeule.setAttribute("y", Y(werte[werte.length - 1])); saeule.setAttribute("height", unten + 6 - Y(werte[werte.length - 1])); }
    svg.appendChild(saeule);
    return Y;
  }
  const gradText = v => `${v < 0 ? "−" : ""}${Math.abs(v)} °C`;
  /**
   * { jahr: true } — der Baum durchs Jahr mit den Körben des Spiels 🌼 🌞 🍁 🧊; { thermo: [von, bis, strich], wert,
   * symbol?, kleidung? } — das Thermometer der Stufe steigt auf den Wert (auf dem Strich, geprüft); { thermo, differenz:
   * [Morgen, Mittag] } — es steigt vom Morgen auf den Mittag, daneben der Unterschied; { bericht: [[Tag, Symbol, °C] …] }
   * — der Wetterbericht über vier Tage.
   */
  function wetter(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z) return null;
    const svg = neuesBild("zyklus", stufe, { "data-bilder": "wetter" });
    svg.appendChild(tagGrund());
    if (z.jahr === true) {
      svg.appendChild(boden());
      const ZEITEN = [["🌼", "#f8c8dc"], ["🌞", "#4f9d47"], ["🍁", "#e07a3f"], ["🧊", "#ffffff"]];
      svg.setAttribute("data-anzahl", 4);
      ZEITEN.forEach(([b, krone], i) => {
        const x = 46 + i * 76;
        svg.appendChild(erscheine(s("g", { "data-stueck": "jahreszeit" }, s("rect", { x: x - 3, y: 96, width: 6, height: 34, fill: "#8a5a32" }), s("circle", { cx: x, cy: 80, r: 22, fill: krone, stroke: i === 3 ? "#c9cde0" : "none", "stroke-width": 1.2 }), bildzeichen(x, 28, b, 20)), (i * T) / 4, ruhig, 0.35));
        if (i < 3) svg.appendChild(erscheine(s("path", { d: `M${x + 28},82 h18 m-4,-4 l4,4 l-4,4`, fill: "none", stroke: "#6b7089", "stroke-width": 1.6 }), ((i + 0.6) * T) / 4, ruhig));
      });
    } else if (Array.isArray(z.bericht)) {
      if (z.bericht.length !== 4 || !z.bericht.every(([tag, sym, gr]) => typeof tag === "string" && WETTER_SYMBOL.includes(sym) && Number.isInteger(gr))) return null;
      svg.setAttribute("data-anzahl", 4);
      z.bericht.forEach(([tag, sym, gr], i) => {
        const x = 46 + i * 76;
        svg.appendChild(erscheine(s("g", { "data-stueck": "tag" }, s("rect", { x: x - 32, y: 22, width: 64, height: 104, rx: 8, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.4 }), text(x, 42, tag, { gross: 12 }), bildzeichen(x, 74, sym, 30), text(x, 112, gradText(gr), { gross: 13, farbe: gr < 0 ? "#2f8fe0" : "#e5322d" })), (i * T) / 4, ruhig, 0.3));
      });
    } else if (Array.isArray(z.thermo)) {
      const [von, bis, strich] = z.thermo, aufStrich = v => Number.isInteger(v) && v >= von && v <= bis && (v - von) % strich === 0;
      if (![von, bis, strich].every(Number.isInteger) || bis <= von || strich < 1 || (bis - von) / strich > 60) return null;
      if (z.differenz) {
        const [a, b] = z.differenz;
        if (!aufStrich(a) || !aufStrich(b) || b <= a) return null;
        svg.setAttribute("data-wert", b - a);
        const Y = thermometer(svg, z.thermo, [a, a, b], ruhig, T);
        svg.append(erscheine(s("g", {}, s("line", { x1: 40, y1: Y(a), x2: 120, y2: Y(a), stroke: "#2f8fe0", "stroke-width": 1.4 }), bildzeichen(136, Y(a), "🌅", 14), text(156, Y(a) + 4, gradText(a), { gross: 11, anker: "start", farbe: "#2f8fe0" })), 0.4, ruhig),
          erscheine(s("g", {}, s("line", { x1: 40, y1: Y(b), x2: 120, y2: Y(b), stroke: "#e5322d", "stroke-width": 1.4 }), bildzeichen(136, Y(b), "☀️", 14), text(156, Y(b) + 4, gradText(b), { gross: 11, anker: "start", farbe: "#e5322d" })), T, ruhig),
          erscheine(s("g", { "data-stueck": "unterschied" }, s("path", { d: `M110,${Y(a) - 2} V${Y(b) + 6} m-4,4 l4,-4 l4,4`, fill: "none", stroke: "#2fbf71", "stroke-width": 2 }), text(250, (Y(a) + Y(b)) / 2 + 5, `+${b - a} °C`, { gross: 16, farbe: "#2fbf71" })), T + 0.2, ruhig));
        svg.setAttribute("data-anzahl", 1);
      } else {
        if (!aufStrich(z.wert) || (z.symbol && !WETTER_SYMBOL.includes(z.symbol))) return null;
        svg.setAttribute("data-wert", z.wert);
        thermometer(svg, z.thermo, [z.wert], ruhig, T);
        svg.appendChild(erscheine(text(160, 80, gradText(z.wert), { gross: 20, farbe: z.wert < 0 ? "#2f8fe0" : "#e5322d" }), T, ruhig));
        if (z.symbol) svg.appendChild(erscheine(bildzeichen(240, 56, z.symbol, 40), 0.3, ruhig));
        if (z.kleidung) svg.appendChild(herein(s("g", { "data-stueck": "kleidung" }, bildzeichen(240, 112, z.kleidung, 28)), 40, 0, T * 0.6, ruhig, 0.4));
        svg.setAttribute("data-anzahl", z.kleidung ? 1 : 0);
      }
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 30, 132, ruhig));
    return svg;
  }

  // ----- Taschengeld-Planer (SAMMELN · kaesseli) -----
  /**
   * Beträge über LS.geldText wie im Spiel („25.60 Fr.“), nachgerechnet. { reicht: Budget, waren: [[Bild, Rp] …] } —
   * 👛 genügt das Geld? 👍 oder ✋; { rest: Budget, waren } — was übrig bleibt; { woche: Budget, waren, wahl: [Stellen] }
   * — aus fünf Waren die gewählten in den Korb, zusammen höchstens das Budget; { sparen: { ziel, rate, schon } } — das
   * Kässeli 🐷 füllt sich Woche um Woche, bis das Ziel 🎯 erreicht ist; { bedarf: [Bild …], wunsch: [Bild …] } — 🧰 und
   * 💭; { vergleich: [[Stück, Rp], [Stück, Rp]] } — der Preis je Stück, das günstigere Pack bekommt 🏷️.
   */
  function kaesseli(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8, rp = x => Number.isInteger(x) && x >= 0 && x % 5 === 0;
    if (!z) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "kaesseli" });
    svg.appendChild(tagGrund());
    const warenOk = w => Array.isArray(w) && w.length >= 1 && w.length <= 5 && w.every(([b, p]) => typeof b === "string" && rp(p) && p > 0);
    const preisschild = (x, y, b, p, ab) => erscheine(s("g", { "data-stueck": "ware" }, bildzeichen(x, y, b, 26), s("rect", { x: x - 26, y: y + 16, width: 52, height: 15, rx: 4, fill: "#fff8e1", stroke: "#f5b301", "stroke-width": 1 }), text(x, y + 27, geld(p), { gross: 9 })), ab, ruhig, 0.3);
    if (rp(z.reicht) || rp(z.rest)) {
      if (!warenOk(z.waren)) return null;
      const budget = z.reicht ?? z.rest, summe = z.waren.reduce((a, [, p]) => a + p, 0);
      if (z.rest !== undefined && summe > budget) return null;
      svg.setAttribute("data-wert", z.reicht !== undefined ? (summe <= budget ? "reicht" : "reicht-nicht") : budget - summe);
      svg.setAttribute("data-anzahl", z.waren.length);
      svg.append(bildzeichen(50, 56, "👛", 34), text(50, 92, geld(budget), { gross: 11 }));
      z.waren.forEach(([b, p], i) => svg.appendChild(preisschild(140 + i * 70, 44, b, p, 0.2 + (i * T * 0.5) / z.waren.length)));
      const zeile = z.reicht !== undefined ? `${z.waren.map(([, p]) => geld(p)).join(" + ")} ${summe <= budget ? "≤" : ">"} ${geld(budget)}` : `${geld(budget)} − ${z.waren.map(([, p]) => geld(p)).join(" − ")} = ${geld(budget - summe)}`;
      svg.appendChild(erscheine(text(BREITE / 2, 116, zeile, { gross: 11 }), T * 0.7, ruhig));
      if (z.reicht !== undefined) svg.appendChild(erscheine(bildzeichen(BREITE / 2, 136, summe <= budget ? "👍" : "✋", 18), T, ruhig));
    } else if (rp(z.woche)) {
      if (!warenOk(z.waren) || z.waren.length !== 5 || !Array.isArray(z.wahl) || z.wahl.length < 2 || z.wahl.length > 3 || !z.wahl.every(i => Number.isInteger(i) && i >= 0 && i < 5)) return null;
      const summe = z.wahl.reduce((a, i) => a + z.waren[i][1], 0);
      if (summe > z.woche) return null;
      svg.setAttribute("data-anzahl", z.wahl.length);
      svg.append(bildzeichen(28, 24, "📅", 16), text(48, 28, geld(z.woche), { gross: 11, anker: "start" }));
      z.waren.forEach(([b, p], i) => { const x = 40 + i * 60, gew = z.wahl.includes(i); svg.appendChild(gew ? preisschild(x, 60, b, p, 0) : s("g", { opacity: 0.5 }, bildzeichen(x, 60, b, 26), text(x, 87, geld(p), { gross: 9 }))); if (gew) svg.appendChild(erscheine(haken(x + 18, 46, 13), 0.3 + (z.wahl.indexOf(i) * T * 0.6) / z.wahl.length, ruhig)); });
      svg.appendChild(erscheine(text(BREITE / 2, 128, `${z.wahl.map(i => geld(z.waren[i][1])).join(" + ")} = ${geld(summe)}`, { gross: 12, farbe: "#2fbf71" }), T, ruhig));
    } else if (z.sparen) {
      const { ziel, rate, schon } = z.sparen;
      if (!rp(ziel) || !rp(rate) || !rp(schon) || rate <= 0 || schon >= ziel || !GELD[rate]) return null;
      const wochen = Math.ceil((ziel - schon) / rate);
      if (wochen < 2 || wochen > 12) return null;
      svg.setAttribute("data-wert", wochen);
      svg.setAttribute("data-anzahl", wochen);
      svg.append(bildzeichen(60, 84, "🐷", 60), bildzeichen(294, 30, "🎯", 20), text(292, 58, geld(ziel), { gross: 10 }), text(60, 136, geld(schon), { gross: 10, farbe: "#6b7089" }));
      // je Woche ein Stück der Rate in voller Grösse (die Schrift auf der Münze bleibt lesbar), fünf je Reihe
      for (let i = 0; i < wochen; i++) { const x = 118 + (i % 5) * 34, y = 36 + Math.floor(i / 5) * 34; svg.appendChild(erscheine(s("g", { "data-stueck": "woche", transform: `translate(${x} ${y})` }, geldStueck(rate)), (i * T) / wochen, ruhig, 0.2)); }
      svg.appendChild(erscheine(text(200, 128, `${wochen} Wochen: ${geld(schon)} + ${wochen} · ${geld(rate)} ≥ ${geld(ziel)}`, { gross: 10, farbe: "#2fbf71" }), T + 0.1, ruhig));
    } else if (Array.isArray(z.bedarf) && Array.isArray(z.wunsch)) {
      const alle = [...z.bedarf.map(b => [b, "🧰", 86]), ...z.wunsch.map(b => [b, "💭", 234])];
      if (!alle.length || alle.length > 6) return null;
      svg.setAttribute("data-anzahl", alle.length);
      for (const [k, kx] of [["🧰", 86], ["💭", 234]]) svg.append(s("path", { d: `M${kx - 56},84 H${kx + 56} L${kx + 46},136 H${kx - 46} Z`, fill: "#ffffff", stroke: "#a8743f", "stroke-width": 2 }), bildzeichen(kx, 124, k, 14));
      const zaehl = { "🧰": 0, "💭": 0 };
      alle.forEach(([b, k, kx], i) => { const x = kx - 30 + zaehl[k]++ * 30; svg.appendChild(herein(s("g", { "data-stueck": "ware" }, bildzeichen(x, 100, b, 22)), 160 - x, -76, 0.2 + i * 0.4, ruhig, 0.45)); });
    } else if (Array.isArray(z.vergleich)) {
      if (z.vergleich.length !== 2 || !z.vergleich.every(([n, p]) => Number.isInteger(n) && n >= 1 && n <= 10 && rp(p) && p > 0)) return null;
      const je = z.vergleich.map(([n, p]) => p / n), besser = je[0] === je[1] ? -1 : je[0] < je[1] ? 0 : 1;
      if (!z.vergleich.every(([n, p]) => (p / n) % 5 === 0)) return null; // der Preis je Stück in ganzen 5 Rappen
      svg.setAttribute("data-wert", besser < 0 ? "gleich" : "AB"[besser]);
      svg.setAttribute("data-anzahl", 2);
      z.vergleich.forEach(([n, p], i) => {
        const x = 90 + i * 140;
        svg.appendChild(erscheine(s("g", { "data-stueck": "pack" }, s("rect", { x: x - 50, y: 16, width: 100, height: 56, rx: 8, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.4 }), text(x - 38, 32, "AB"[i], { gross: 12, farbe: "#6366f1" }),
          ...[...Array(n).keys()].map(j => bildzeichen(x - 24 + (j % 5) * 12, 40 + Math.floor(j / 5) * 14, "📓", 11)), text(x, 88, `${n} Stück: ${geld(p)}`, { gross: 10 }), text(x, 104, `1 Stück: ${geld(p / n)}`, { gross: 11, farbe: "#2fbf71" })), (i * T) / 2, ruhig, 0.3));
      });
      svg.appendChild(erscheine(bildzeichen(besser < 0 ? 160 : 90 + besser * 140, 128, besser < 0 ? "🤝" : "🏷️", 20), T, ruhig));
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(26, 130, ruhig));
    return svg;
  }

  // ----- Kakao-Weg (REISE · kakao) -----
  // die acht Schritte des Wegs der Schoggi wie im Spiel, mit ihrem Platz auf der Karte (Westafrika links, Meer, Schweiz rechts)
  const KAKAO = [["🌳", 30, 110], ["☀️", 64, 84], ["🚢", 112, 116], ["🚆", 170, 78], ["🏭", 212, 52], ["🍫", 252, 74], ["🏬", 272, 108], ["🛍️", 300, 132]];
  const KAKAO_WER = { 0: "🧑‍🌾", 3: "🚚", 4: "🏭", 6: "🏬", 7: "🏠" };
  /**
   * { schritte: [Stelle …], fehlt?, wer?, herkunft? } — der Weg Schritt um Schritt (Stellen aus den acht, in ihrer
   * Reihenfolge), fehlt: ein Schritt ist erst ein „?“; wer: wer ihn macht (🧑‍🌾 🚚 🏭 🏬 🏠); herkunft: 🌍 am Anfang, 🇨🇭 am Ende;
   * { kreislauf: true } — Haushalte und Unternehmen: Arbeit und Waren (deko-5), Lohn und Geld (deko-4) fliessen in der
   * Reihenfolge des Spiels, das Geld immer in die andere Richtung.
   */
  function kakao(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "kakao" });
    svg.appendChild(tagGrund());
    if (z.kreislauf === true) {
      svg.setAttribute("data-anzahl", 4);
      svg.append(s("rect", { x: 20, y: 46, width: 76, height: 58, rx: 8, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.4 }), bildzeichen(58, 75, "🏠", 30),
        s("rect", { x: 224, y: 46, width: 76, height: 58, rx: 8, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.4 }), bildzeichen(262, 75, "🏭", 30));
      // Arbeit (Haushalt → Unternehmen), Lohn (zurück), Waren (Unternehmen → Haushalt), Geld für Waren (zurück)
      const FLUSS = [["🛠️", 1, 30, "--deko-5"], ["💵", -1, 58, "--deko-4"], ["📦", -1, 96, "--deko-5"], ["🪙", 1, 124, "--deko-4"]];
      FLUSS.forEach(([b, richtung, y, farbe], i) => {
        const x1 = richtung > 0 ? 100 : 220, x2 = richtung > 0 ? 220 : 100, ab = (i * T) / 4;
        svg.appendChild(erscheine(s("g", { "data-stueck": "fluss" }, s("line", { x1, y1: y, x2: x2 - richtung * 8, y2: y, style: `stroke:var(${farbe})`, "stroke-width": 3 }),
          s("path", { d: `M${x2},${y} l${-richtung * 9},-5 l0,10 Z`, style: `fill:var(${farbe})` }), bildzeichen(160, y - 2, b, 16), s("circle", { cx: 124, cy: y - 9, r: 6, fill: "#2d3047" }), text(124, y - 5.5, i + 1, { gross: 9, farbe: "#ffffff" })), ab, ruhig, 0.3));
      });
    } else {
      if (!Array.isArray(z.schritte) || z.schritte.length < 3 || !z.schritte.every((i, k) => Number.isInteger(i) && i >= 0 && i < 8 && (!k || i > z.schritte[k - 1]))) return null;
      if (z.fehlt !== undefined && !z.schritte.includes(z.fehlt)) return null;
      svg.setAttribute("data-anzahl", z.schritte.length);
      // Karte: Land in Westafrika, das Meer, Europa mit der Schweiz
      svg.append(s("path", { d: "M0,90 Q40,80 90,96 L96,150 H14 Q0,150 0,136 Z", fill: "#cdb37a" }), s("path", { d: "M90,96 Q120,130 150,100 L160,150 H96 Z", fill: "#7fc4ec" }),
        s("path", { d: "M150,100 Q170,40 230,30 Q300,30 320,70 V136 Q320,150 306,150 H160 Z", fill: "#b5d99c" }));
      const pts = z.schritte.map(i => [KAKAO[i][1], KAKAO[i][2]]), zeiten = ankunft(pts, T);
      for (let k = 1; k < pts.length; k++) svg.appendChild(erscheine(s("path", { d: `M${pts[k - 1].join(",")} L${pts[k].join(",")}`, stroke: "#8a5a32", "stroke-width": 1.6, "stroke-dasharray": "3 3", fill: "none" }), zeiten[k - 1], ruhig, 0.2));
      z.schritte.forEach((i, k) => {
        const [b, x, y] = KAKAO[i];
        const karte = s("g", { "data-stueck": "schritt", "data-nr": i + 1 }, s("circle", { cx: x, cy: y, r: 13, fill: "#ffffff", stroke: "#8a5a32", "stroke-width": 1.4 }), bildzeichen(x, y, b, 16));
        if (z.fehlt === i) svg.appendChild(kurz(s("g", {}, s("circle", { cx: x, cy: y, r: 13, fill: "#ffffff", stroke: "#8a5a32", "stroke-width": 1.4, "stroke-dasharray": "3 2" }), text(x, y + 4.5, "?", { gross: 13 })), 0, T * 0.8, ruhig));
        svg.appendChild(erscheine(karte, z.fehlt === i ? T * 0.8 : zeiten[k], ruhig, 0.25));
        if (z.wer && KAKAO_WER[i]) svg.appendChild(erscheine(bildzeichen(x + 14, y - 13, KAKAO_WER[i], 11), zeiten[k] + 0.2, ruhig));
      });
      if (z.herkunft) svg.append(erscheine(bildzeichen(28, 24, "🌍", 18), 0.2, ruhig), erscheine(bildzeichen(300, 22, "🇨🇭", 16), T, ruhig), erscheine(s("path", { d: "M44,24 Q160,4 284,22", fill: "none", stroke: "#6b7089", "stroke-width": 1.2, "stroke-dasharray": "4 3" }), 0.4, ruhig));
      const [ex, ey] = pts[pts.length - 1];
      svg.appendChild(bewege(s("g", {}, bildzeichen(0, -18, "🫘", 12)), "M" + pts.map(p => p.join(",")).join(" L"), { x: ex, y: ey, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T }));
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 46, 14, ruhig));
    if (sterne >= 3) svg.appendChild(z.kreislauf ? funken(298, 128, ruhig) : funken(160, 24, ruhig)); // im Kreislauf nicht auf den Pfeilen
    return svg;
  }

  Object.assign(BILDER.sammeln, { magnet, wanne, bionik, znueni, album, kaesseli });
  Object.assign(BILDER.bauen, { stromkreis, hebel, braille });
  Object.assign(BILDER.zyklus, { wasserkreis, fledermaus, lebenszyklus, wetter });
  Object.assign(BILDER.reise, { energiekette, koerperweg, blut, schall, teddy, lebensraeume, kakao });
  Object.assign(BILDER.zoom, { auge });
  Object.assign(BILDER.karte, { kompassweg, planweg });
  Object.assign(BILDER.wachsen, { pflanze });

  // ---------- Bilder Block D: Englisch, Französisch, Musik, Medien und Informatik (LERN_Session31) ----------
  // Wie die Blöcke davor: jedes Bild folgt den Stufen seines Spiels (der Entwurf in Abschnitt 8 des Konzepts passte hier
  // meist nicht) und prüft, was es zeigt. Wörter der Fremdsprachen als leere Kärtchen; Zeichen nur, wo sie selbst der
  // Inhalt sind (Artikel, Laute, Buchstaben beim Buchstabieren, Notennamen, Endungen, Einheiten, Uhrzeiten, Zahlen).
  // Bildzeichen und Farben wie in den Spielen.

  /** Eule mit Kopfhörern (Füsse bei 0,0, Grösse k wie euleSitzend). */
  function euleKopfhoerer(k) {
    const g = euleSitzend(k);
    g.appendChild(s("g", { transform: `scale(${k})` },
      s("path", { d: "M-31,-50 C-31,-102 31,-102 31,-50", fill: "none", stroke: "#2d3047", "stroke-width": 5 }),
      s("rect", { x: -38, y: -62, width: 12, height: 22, rx: 5, fill: "#e5484d" }), s("rect", { x: 26, y: -62, width: 12, height: 22, rx: 5, fill: "#e5484d" })));
    return g;
  }
  /** Schallbögen nach rechts ab x, y (drei, nacheinander). */
  function schallAus(x, y, ruhig, ab = 0, gross = 1) {
    const g = s("g", {});
    [8, 15, 22].forEach((r, i) => g.appendChild(erscheine(s("path", { d: `M${x + r * gross * 0.5},${y - r * gross} Q${x + r * gross * 1.1},${y} ${x + r * gross * 0.5},${y + r * gross}`,
      fill: "none", stroke: KNOPF, "stroke-width": 2, "stroke-linecap": "round" }), ab + i * 0.15, ruhig, 0.2)));
    return g;
  }
  /** Bildkarte (weiss, gerundet) mit Bildzeichen, Mitte x, y. */
  function bildKarte(x, y, b, bild, { rand = "#c9cde0", gross } = {}) {
    return s("g", {}, s("rect", { x: x - b / 2, y: y - b / 2, width: b, height: b, rx: 6, fill: "#ffffff", style: `stroke:${rand}`, "stroke-width": 1.6 }),
      bild ? bildzeichen(x, y, bild, gross ?? b * 0.62) : null);
  }
  /** Ring, der das Antippen zeigt (grün, wie --gut), ab Zeitpunkt. */
  const tippRing = (x, y, r, ab, ruhig) => erscheine(s("circle", { cx: x, cy: y, r, fill: "none", stroke: GUT, "stroke-width": 3 }), ab, ruhig, 0.25);
  /** Sprechblase (leer, zwei Striche), Spitze nach links oder rechts. */
  function sprechblase(x, y, b, h, { links = true, rand = "#8a8fa8", grund = "#ffffff", gestrichelt = false } = {}) {
    const sx = links ? x + 10 : x + b - 10, d = links ? -8 : 8;
    return s("g", {},
      s("path", { d: `M${x + 6},${y} H${x + b - 6} Q${x + b},${y} ${x + b},${y + 6} V${y + h - 6} Q${x + b},${y + h} ${x + b - 6},${y + h} H${sx + 5} L${sx + d},${y + h + 6} L${sx - 2},${y + h} H${x + 6} Q${x},${y + h} ${x},${y + h - 6} V${y + 6} Q${x},${y} ${x + 6},${y} Z`,
        fill: grund, style: `stroke:${rand}`, "stroke-width": 1.4, ...(gestrichelt ? { "stroke-dasharray": "4 3" } : {}) }));
  }
  const blasenStriche = (x, y, b, h) => s("path", { d: `M${x + 6},${y + h / 2 - 2} h${b - 12} M${x + 6},${y + h / 2 + 2.5} h${(b - 12) * 0.6}`, stroke: "#c9cde0", "stroke-width": 1.4, "stroke-linecap": "round" });

  // ----- Hören und antippen (AUFTRITT · hoerbild): Listen & Tap, Mots-Match (nur hören), Sound-Sorter (s1, s6) -----
  /**
   * Links die Eule mit Kopfhörern, aus dem Lautsprecher kommen Schallbögen; rechts die Bilder der Aufgabe (2–6, so viele
   * wie im Spiel). Das gehörte Bild wird angetippt und bekommt den Haken; mit anders hüpft das eine Bild heraus, das
   * anders klingt (Sound-Sorter s6). Mit wo: Tisch und Kiste wie im Spiel, das Tier läuft an seinen Ort (on, under,
   * next, in). Angabe: { bilder: [Bild …], ziel: Stelle, anders? } oder { wo: [{ tier, ort, ding }] }.
   */
  const WO_TIERE = ["🐱", "🐶", "🐭", "🐸", "🐦", "🦆"];
  function hoerbild(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z) return null;
    const svg = neuesBild("auftritt", stufe, { "data-bilder": "hoerbild" });
    svg.appendChild(tagGrund());
    const eule = euleKopfhoerer(0.56);
    eule.setAttribute("transform", "translate(42 132)");
    svg.append(eule, bildzeichen(42, 40, "🔊", 18), schallAus(56, 40, ruhig, 0.1, 0.8));
    if (Array.isArray(z.wo)) {
      // Tisch (deko-7) und Kiste (deko-3) wie im Spiel; Orte: on, under, next (links neben dem Tisch, rechts neben der Kiste), in
      const ORTE = { table: { on: [160, 76], under: [160, 124], next: [112, 124] }, box: { in: [262, 108], on: [262, 86], next: [304, 124] } };
      if (!z.wo.length || z.wo.length > 2 || !z.wo.every(w => WO_TIERE.includes(w.tier) && ORTE[w.ding]?.[w.ort])) return null;
      svg.setAttribute("data-anzahl", z.wo.length);
      svg.append(s("rect", { x: 122, y: 86, width: 76, height: 7, rx: 2, style: "fill:var(--deko-7)" }),
        s("rect", { x: 128, y: 93, width: 5, height: 41, style: "fill:var(--deko-7)" }), s("rect", { x: 187, y: 93, width: 5, height: 41, style: "fill:var(--deko-7)" }),
        s("line", { x1: 96, y1: 135, x2: 316, y2: 135, stroke: "#8a8fa8", "stroke-width": 1.4 }));
      const kisteHinten = s("rect", { x: 236, y: 98, width: 52, height: 37, rx: 2, style: "fill:var(--deko-3)", opacity: 0.6 });
      const kisteVorn = s("rect", { x: 236, y: 112, width: 52, height: 23, rx: 2, style: "fill:var(--deko-3)" });
      svg.appendChild(kisteHinten);
      const tiere = s("g", {});
      svg.append(tiere, kisteVorn);
      z.wo.forEach((w, i) => {
        const [x, y] = ORTE[w.ding][w.ort], ab = 0.4 + i * T * 0.45;
        const tier = s("g", { "data-stueck": `${w.ort}-${w.ding}` }, bildzeichen(0, -9, w.tier, 20));
        tiere.appendChild(bewege(tier, `M80,124 Q${(80 + x) / 2},${Math.min(y, 124) - 30} ${x},${y}`, { x, y, winkel: 0 }, ruhig, { drehen: false, ab, dauer: T * 0.45 }));
      });
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 16, ruhig));
      if (sterne >= 3) svg.appendChild(funken(160, 30, ruhig));
      return svg;
    }
    const b = z.bilder;
    if (!Array.isArray(b) || b.length < 2 || b.length > 6 || !Number.isInteger(z.ziel) || z.ziel < 0 || z.ziel >= b.length) return null;
    svg.setAttribute("data-wert", b[z.ziel]);
    svg.setAttribute("data-anzahl", b.length);
    // eine Reihe bis 4 Bilder, sonst zwei Reihen zu 3
    const reihen = b.length <= 4 ? [b.length] : [Math.ceil(b.length / 2), Math.floor(b.length / 2)], k = b.length <= 4 ? 46 : 40;
    let i = 0;
    reihen.forEach((n, r) => {
      const y = reihen.length === 1 ? 78 : 50 + r * 54;
      for (let j = 0; j < n; j++, i++) {
        const x = 96 + (216 - (n * k + (n - 1) * 10)) / 2 + k / 2 + j * (k + 10), ziel = i === z.ziel;
        const karte = s("g", { "data-stueck": ziel ? "gehoert" : "bild" }, bildKarte(x, y, k, b[i]));
        svg.appendChild(erscheine(karte, 0.2 + (i * T * 0.3) / b.length, ruhig));
        if (ziel) {
          if (z.anders) svg.lastChild.appendChild(s("g", {}));
          svg.append(tippRing(x, y, k / 2 + 3, T * 0.75, ruhig), erscheine(haken(x + k / 2 - 2, y - k / 2 + 6, 15), T * 0.85, ruhig));
          if (z.anders && !ruhig) karte.appendChild(s("animateTransform", { attributeName: "transform", type: "translate", values: "0 0;0 -8;0 0", begin: t(T * 0.75), dur: "0.5s", fill: "freeze" }));
        }
      }
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(86, 100, ruhig));
    return svg;
  }

  // ----- English Word-Match, Mots-Match (SAMMELN · themenkarten) -----
  /**
   * Bild → Wort: je Thema der Stufe eine Bildkarte, darunter das (leere) Wortkärtchen, ein Strich verbindet sie. ton: "an"
   * (🔊, die Wörter werden vorgelesen) oder "aus" (🔇); richtung "wort": zuerst das Wort, dann das Bild. wendung: dazu
   * eine Sprechblase (kleine Sätze, Word-Match s4). artikel: { bild, richtig, falsch } — am Wort steckt erst der falsche
   * Artikel und fällt weg, dann der richtige (Mots-Match s5). Angabe: { themen: [Bild …] } (2–8).
   */
  function themenkarten(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "themenkarten" });
    svg.appendChild(tagGrund());
    if (z.artikel) {
      const a = z.artikel, ART = ["le", "la", "l’", "les"];
      if (!ART.includes(a.richtig) || !ART.includes(a.falsch) || a.richtig === a.falsch || !a.bild) return null;
      svg.setAttribute("data-wert", a.richtig);
      svg.append(bildKarte(96, 74, 64, a.bild), s("line", { x1: 130, y1: 74, x2: 160, y2: 74, stroke: "#8a8fa8", "stroke-width": 1.4 }));
      svg.appendChild(leerKarte(206, 60, 90, 28, { rand: "var(--deko-2)", grund: "#fdeef5" }));
      const schild = (art, farbe) => s("g", {}, s("rect", { x: 162, y: 62, width: 38, height: 24, rx: 5, fill: "#ffffff", style: `stroke:${farbe}`, "stroke-width": 2 }), text(181, 79, art, { gross: 14 }));
      const falsch = s("g", {}, schild(a.falsch, HINWEIS));
      svg.appendChild(ruhig ? s("g", { opacity: 0 }, falsch) : falsch);
      if (!ruhig) {
        falsch.setAttribute("opacity", "0");
        falsch.append(s("set", { attributeName: "opacity", to: 1, begin: t(0.2), fill: "freeze" }),
          s("animateTransform", { attributeName: "transform", type: "translate", values: "0 0;0 0;4 60", keyTimes: "0;0.5;1", begin: t(0.2), dur: `${T * 0.5}s`, fill: "freeze" }),
          s("animate", { attributeName: "opacity", from: 1, to: 0, begin: t(0.2 + T * 0.45), dur: "0.2s", fill: "freeze" }));
        svg.appendChild(kurz(kreuz(214, 52, 16), T * 0.25, T * 0.55, ruhig));
      }
      svg.append(s("g", { "data-stueck": a.richtig }, herein(schild(a.richtig, GUT), 0, -50, T * 0.6, ruhig, 0.4)), erscheine(haken(282, 54, 16), T, ruhig));
      svg.setAttribute("data-anzahl", 1);
    } else {
      const th = z.themen;
      if (!Array.isArray(th) || th.length < 2 || th.length > 8 || (z.ton && !["an", "aus"].includes(z.ton))) return null;
      svg.setAttribute("data-anzahl", th.length);
      const oben = z.wendung ? 30 : 46, unten = oben + 46, b = Math.min(40, (290 - (th.length - 1) * 6) / th.length);
      const x0 = BREITE / 2 - (th.length * b + (th.length - 1) * 6) / 2;
      if (z.ton) svg.appendChild(bildzeichen(18, 16, z.ton === "an" ? "🔊" : "🔇", 14));
      th.forEach((bild, i) => {
        const x = x0 + b / 2 + i * (b + 6), ab = 0.2 + (i * T * 0.75) / th.length;
        const paar = s("g", { "data-stueck": bild },
          s("line", { x1: x, y1: oben + b / 2, x2: x, y2: unten - 7, stroke: "#8a8fa8", "stroke-width": 1.2 }),
          bildKarte(x, oben, b, bild), leerKarte(x - b / 2, unten - 7, b, 14, { rand: "var(--deko-6)", grund: "#eef0ff" }));
        if (z.ton === "an") paar.appendChild(schallAus(x + b / 2 - 4, unten - 14, ruhig, ab + 0.15, 0.3));
        svg.appendChild(z.richtung === "wort" ? herein(paar, 0, 30, ab, ruhig, 0.35) : herein(paar, 0, -30, ab, ruhig, 0.35));
      });
      if (z.wendung) {
        svg.append(erscheine(s("g", {}, sprechblase(90, 104, 140, 26, { rand: "var(--deko-6)", grund: "#eef0ff" }), blasenStriche(90, 104, 140, 26), text(220, 122, "?", { gross: 14 })), T, ruhig));
        if (z.wendung && th.length) svg.appendChild(erscheine(bildzeichen(66, 118, "🧒", 20), T, ruhig));
      }
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(z.wendung ? 274 : 160, z.wendung ? 118 : 128, ruhig));
    return svg;
  }

  // ----- Buchstabieren (BAUEN · buchstaben): Word-Match s5, s6, Spelling-Bee -----
  /** Biene (Mitte 0,0). */
  function biene() {
    return s("g", { "data-figur": "biene" },
      s("ellipse", { cx: -3, cy: -8, rx: 5, ry: 3.4, fill: "#cfe9f8", opacity: 0.9 }), s("ellipse", { cx: 4, cy: -8, rx: 5, ry: 3.4, fill: "#cfe9f8", opacity: 0.9 }),
      s("ellipse", { cx: 0, cy: 0, rx: 8, ry: 5.5, fill: "#f5b301", stroke: "#2d3047", "stroke-width": 0.8 }),
      s("path", { d: "M-3,-5 v10 M2,-5.4 v10.8", stroke: "#2d3047", "stroke-width": 2 }), s("circle", { cx: 8.5, cy: -1, r: 3, fill: "#2d3047" }));
  }
  /** Sechseck (Wabe) um x, y mit Radius r. */
  const wabe = (x, y, r, attr) => s("path", { d: "M" + [0, 1, 2, 3, 4, 5].map(i => { const w = ((60 * i - 30) * Math.PI) / 180; return `${(x + r * Math.cos(w)).toFixed(1)},${(y + r * Math.sin(w)).toFixed(1)}`; }).join(" L") + " Z", ...attr });
  /**
   * Das Wort wird aus Buchstaben gelegt (wie im Spiel: genau die Buchstaben des Worts, dazu extra überzählige, die am
   * Ende wegfallen). hilfe zeigt, was das Spiel gibt: "wort" (Bild und das Wort zum Abschreiben), "bild", "deutsch" (nur
   * das deutsche Wort, als leeres Kärtchen), "hoeren" (nichts, nur der Ton). waben: als Wabe mit der Biene (Spelling-Bee),
   * sonst Kacheln (Word-Match). Angabe: { wort, bild?, hilfe, extra?: [Buchstabe …] }.
   */
  function buchstaben(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z || !/^[a-z]{2,11}$/.test(z.wort || "") || !["wort", "bild", "deutsch", "hoeren"].includes(z.hilfe)) return null;
    const extra = z.extra || [];
    if (extra.length > 3 || !extra.every(b => /^[a-z]$/.test(b)) || (["wort", "bild"].includes(z.hilfe) && !z.bild)) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "buchstaben", "data-wert": z.wort, "data-anzahl": z.wort.length });
    svg.appendChild(tagGrund());
    const waben = !!feier.waben, n = z.wort.length;
    // Hilfe links, die Buchstaben rechts: oben gemischt (Vorrat), unten der Platz im Wort
    if (z.hilfe === "wort" || z.hilfe === "bild") svg.appendChild(bildKarte(34, 54, 44, z.bild));
    if (z.hilfe === "wort") svg.appendChild(text(34, 96, z.wort, { gross: 11, farbe: "#8a8fa8" }));
    if (z.hilfe === "deutsch") svg.appendChild(leerKarte(8, 46, 52, 18));
    if (z.hilfe === "hoeren") svg.append(bildzeichen(34, 54, "🔊", 22), schallAus(46, 54, ruhig, 0.1, 0.6));
    const L = 70, R = 312, alle = n + extra.length;
    const r = Math.min(13, (R - L) / (alle * 1.8)), schritt = Math.min(2 * r * 1.0 + 3, (R - L) / Math.max(n, 1));
    const platz = i => L + (R - L - (n - 1) * schritt) / 2 + i * schritt;
    // Vorrat: die Buchstaben gemischt (fest: jeder zweite von hinten), die überzähligen dazwischen
    const vorrat = [...z.wort].map((b, i) => ({ b, i })).sort((p, q) => ((p.i * 7) % n) - ((q.i * 7) % n));
    extra.forEach((b, k) => vorrat.splice(Math.min(vorrat.length, 1 + k * 3), 0, { b, i: -1 }));
    const vs = Math.min(2 * r + 3, (R - L) / alle), vx = j => L + (R - L - (alle - 1) * vs) / 2 + j * vs, vy = 44, py = 108;
    const zeichen = (x, y, b, platzhalter) => s("g", {},
      waben ? wabe(x, y, r, { fill: platzhalter ? "#fff3c4" : "#f5c542", stroke: "#b88a1f", "stroke-width": 1.2 })
        : s("rect", { x: x - r, y: y - r, width: 2 * r, height: 2 * r, rx: 3, fill: platzhalter ? "#eef0ff" : "#ffffff", style: `stroke:${KNOPF}`, "stroke-width": 1.4 }),
      b ? text(x, y + r * 0.42, b, { gross: Math.max(10, r * 1.15) }) : null);
    for (let i = 0; i < n; i++) svg.appendChild(zeichen(platz(i), py, null, true));
    const je = (T * 0.8) / n;
    vorrat.forEach((v, j) => {
      if (v.i < 0) {
        // überzählig: bleibt liegen, wird am Ende durchgestrichen und blendet aus
        svg.appendChild(verschwinde(s("g", {}, zeichen(vx(j), vy, v.b), erscheine(kreuz(vx(j) + r, vy - r, 11), T * 0.85, ruhig)), T + 0.3, ruhig, 0.4));
        return;
      }
      const g = s("g", { "data-stueck": v.b }, zeichen(platz(v.i), py, v.b));
      svg.appendChild(herein(g, vx(j) - platz(v.i), vy - py, 0.2 + v.i * je, ruhig, 0.35));
    });
    if (waben) {
      const pts = [[L - 6, 20], ...[...Array(n).keys()].map(i => [platz(i), py - r - 8])];
      svg.appendChild(bewege(biene(), "M" + pts.map(p => p.join(",")).join(" L"), { x: platz(n - 1), y: py - r - 8, winkel: 0 }, ruhig, { drehen: false, linear: true, ab: 0.2, dauer: T * 0.8 + 0.3 }));
    }
    svg.appendChild(erscheine(haken(Math.min(platz(n - 1) + r + 8, BREITE - 10), py + r + 12, 15), T + 0.1, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(200, 26, ruhig)); // oben, wo am Ende kein Buchstabe mehr liegt
    return svg;
  }

  // ----- Wort-Zwillinge (SAMMELN · wortzwillinge) -----
  /**
   * Je Paar eine englische Karte (Rand deko-6 wie im Spiel) und ihr deutscher Zwilling; sie rücken zusammen, gleich lange
   * Karten bei „gleich“ (hand – Hand), fast gleich lange bei „ähnlich“ (house – Haus), dazu 👯. Ein falscher Freund (Karte
   * deko-3) rückt zur deutschen Falle, die wegfällt (⚠️); dann kommt die richtige Bedeutung. bild: das Bildzeichen des
   * Spiels links (nur, wo das Spiel ein Bild zeigt). Angabe: Liste von { art: "gleich" | "aehnlich" | "falsch", bild? } (1–5).
   */
  function wortzwillinge(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!Array.isArray(z) || !z.length || z.length > 5 || !z.every(p => ["gleich", "aehnlich", "falsch"].includes(p.art))) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "wortzwillinge", "data-anzahl": z.length });
    svg.appendChild(tagGrund());
    const zh = Math.min(30, 136 / z.length), h = Math.min(20, zh - 6), je = T / z.length;
    z.forEach((p, i) => {
      const y = 8 + (136 - z.length * zh) / 2 + i * zh, ab = 0.15 + i * je, falsch = p.art === "falsch";
      const g = s("g", { "data-stueck": p.art });
      if (p.bild) g.appendChild(bildzeichen(22, y + h / 2, p.bild, Math.min(18, h)));
      const en = leerKarte(40, y, 80, h, { rand: falsch ? "var(--deko-3)" : "var(--deko-6)", grund: falsch ? "#fff1e6" : "#eef0ff" });
      const de = leerKarte(0, y, p.art === "gleich" ? 80 : 70, h);
      g.appendChild(herein(en, -40, 0, ab, ruhig, 0.35));
      if (falsch) {
        // die deutsche Falle (sieht gleich aus) kommt heran und fällt weg, dann die richtige Bedeutung
        const falle = s("g", { transform: "translate(128 0)" }, leerKarte(0, y, 80, h, { rand: HINWEIS }));
        if (!ruhig) {
          falle.setAttribute("opacity", "0");
          falle.append(s("set", { attributeName: "opacity", to: 1, begin: t(ab), fill: "freeze" }),
            s("animate", { attributeName: "opacity", from: 1, to: 0, begin: t(ab + je * 0.6), dur: "0.25s", fill: "freeze" }));
          g.appendChild(falle);
        }
        g.appendChild(herein(s("g", { transform: "translate(128 0)" }, leerKarte(0, y, 66, h)), 60, 0, ab + je * 0.7, ruhig, 0.3));
        g.appendChild(erscheine(bildzeichen(222, y + h / 2, "⚠️", Math.min(16, h)), ab + je * 0.5, ruhig));
      } else {
        g.appendChild(herein(s("g", { transform: "translate(128 0)" }, de), 60, 0, ab + 0.1, ruhig, 0.35));
        g.appendChild(erscheine(bildzeichen(p.art === "gleich" ? 226 : 216, y + h / 2, "👯", Math.min(16, h)), ab + je * 0.6, ruhig));
      }
      svg.appendChild(g);
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 16, ruhig));
    if (sterne >= 3) svg.appendChild(funken(282, 120, ruhig));
    return svg;
  }

  // ----- Sentence-Builder (BAUEN · wortzug) -----
  /**
   * Wie die Satz-Reparatur: je Satz ein Zug aus leeren Wortwagen (das Satzzeichen hängt am letzten Wort, darum kein
   * eigener Wagen), grosse Wörter mit Dach (am Anfang, „I“); falsch: dazu eine Verwechsler-Karte (has statt have), die
   * nicht in den Zug passt und herunterfällt. nicht: eine Karte der Verneinung (don’t) mit einem Strich. Angabe: Liste von
   * { woerter, zeichen: "." | "?", gross?, falsch?, nicht? } (1–2 Sätze).
   */
  function wortzug(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    const ok = zg => zg && Number.isInteger(zg.woerter) && zg.woerter >= 3 && zg.woerter <= 6 && [".", "?"].includes(zg.zeichen)
      && (zg.gross ?? [0]).every(i => Number.isInteger(i) && i >= 0 && i < zg.woerter) && (zg.nicht === undefined || (Number.isInteger(zg.nicht) && zg.nicht < zg.woerter));
    if (!Array.isArray(z) || !z.length || z.length > 2 || !z.every(ok)) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "wortzug", "data-anzahl": z.length });
    svg.append(tagGrund(), boden());
    const zh = 116 / z.length, h = Math.min(28, zh - 22), alle = z.reduce((a, zg) => a + zg.woerter, 0), je = (T * 0.75) / alle;
    let k = 0;
    z.forEach((zg, r) => {
      const y = 16 + r * zh + (zh - h - 6) / 2 + (zg.falsch ? 6 : 0), n = zg.woerter, wb = Math.min(44, (250 - (n - 1) * 5) / n), x0 = BREITE / 2 - (n * wb + (n - 1) * 5) / 2;
      const zug = s("g", { "data-stueck": "satz", "data-zeichen": zg.zeichen, "data-woerter": n });
      zug.appendChild(s("line", { x1: 10, y1: y + h + 6, x2: 310, y2: y + h + 6, stroke: "#6b4a2b", "stroke-width": 1.4 }));
      for (let i = 0; i < n; i++) {
        const x = x0 + i * (wb + 5), w = s("g", {});
        if (i) w.appendChild(s("line", { x1: x - 5, y1: y + h * 0.6, x2: x, y2: y + h * 0.6, stroke: "#2d3047", "stroke-width": 1.4 }));
        w.appendChild(leerKarte(x, y, wb, h, { rand: "var(--deko-1)", grund: "#f4eefc" }));
        if ((zg.gross ?? [0]).includes(i)) w.appendChild(s("rect", { x: x + 2, y: y - 5, width: wb - 4, height: 5, rx: 2, style: "fill:var(--deko-3)", "data-gross": i }));
        if (zg.nicht === i) w.appendChild(s("path", { d: `M${x + 4},${y + h - 4} L${x + wb - 4},${y + 4}`, stroke: "#e5484d", "stroke-width": 1.6 }));
        if (i === n - 1) w.appendChild(text(x + wb + 6, y + h * 0.78, zg.zeichen, { gross: 16 }));
        w.append(s("circle", { cx: x + wb * 0.28, cy: y + h + 3, r: 2.6, fill: "#2d3047" }), s("circle", { cx: x + wb * 0.72, cy: y + h + 3, r: 2.6, fill: "#2d3047" }));
        zug.appendChild(herein(w, -36, 0, 0.15 + k++ * je, ruhig, 0.35));
      }
      svg.appendChild(zug);
      if (zg.falsch) {
        // die Verwechsler-Karte schwebt über dem Zug, passt nicht und fällt herab
        const fx = x0 + n * (wb + 5) - wb - 5, karte = s("g", {}, leerKarte(fx, y - h - 4, wb, h, { rand: HINWEIS, grund: "#fff1e6" }), kreuz(fx + wb + 6, y - 6, 12));
        svg.appendChild(ruhig ? s("g", { opacity: 0 }, karte) : karte);
        if (!ruhig) {
          karte.append(s("animateTransform", { attributeName: "transform", type: "translate", values: "0 0;0 0;10 90", keyTimes: "0;0.6;1", begin: t(0.2), dur: `${T}s`, fill: "freeze" }),
            s("animate", { attributeName: "opacity", from: 1, to: 0, begin: t(0.2 + T * 0.9), dur: "0.2s", fill: "freeze" }));
        }
      }
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 14, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 26, ruhig));
    return svg;
  }

  // ----- Sound-Sorter, Le ou la ?, Son-Lauscher, Datei-Typen (SAMMELN · koerbe) -----
  /**
   * Körbe in den Farben des Spiels, beschriftet mit dem, was sortiert wird (Artikel, Laut, Bildzeichen); die Karten
   * fallen von oben in ihren Korb. Gemeinsam für die Sortier-Spiele; jedes Spiel prüft vorher, was es sortiert.
   * koerbe: [{ zeichen, farbe, strich?: "kurz" | "lang", bild? }], dinge: [{ bild?, text?, mal?, korb }], kopf: Zeichen oben
   * links (🔇 ohne Ton, 👂 nur hören).
   */
  function korbBild(stufe, name, { koerbe, dinge, kopf }, sterne, ruhig) {
    const T = DAUER * 0.8, k = koerbe.length, kb = Math.min(92, (300 - (k - 1) * 8) / k), x0 = BREITE / 2 - (k * kb + (k - 1) * 8) / 2;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": name, "data-anzahl": dinge.length });
    svg.appendChild(tagGrund());
    if (kopf) svg.appendChild(bildzeichen(18, 16, kopf, 14));
    const kx = i => x0 + i * (kb + 8);
    const vorn = s("g", {});
    koerbe.forEach((kb_, i) => {
      const x = kx(i);
      svg.appendChild(s("path", { d: `M${x},${98} L${x + kb},${98} L${x + kb - 6},${142} L${x + 6},${142} Z`, style: `fill:${kb_.farbe}`, opacity: 0.22 }));
      vorn.appendChild(s("path", { d: `M${x},${110} L${x + kb},${110} L${x + kb - 4},${142} L${x + 4},${142} Z`, style: `fill:${kb_.farbe}`, opacity: 0.9 }));
      if (kb_.bild) vorn.appendChild(bildzeichen(x + kb / 2, 126, kb_.bild, 20));
      else vorn.appendChild(text(x + kb / 2, kb_.strich ? 127 : 131, kb_.zeichen, { gross: 15, farbe: "#ffffff" }));
      if (kb_.strich) vorn.appendChild(kb_.strich === "kurz" ? s("circle", { cx: x + kb / 2, cy: 135, r: 2, fill: "#ffffff" })
        : s("rect", { x: x + kb / 2 - 9, y: 133.5, width: 18, height: 3, rx: 1.5, fill: "#ffffff" }));
    });
    const imKorb = koerbe.map(() => 0), proKorb = koerbe.map((_, i) => dinge.filter(d => d.korb === i).length);
    dinge.forEach((d, j) => {
      const i = d.korb, n = proKorb[i], p = imKorb[i]++, kw = Math.min(30, (kb - 6) / Math.max(n, 1));
      const x = kx(i) + kb / 2 + (p - (n - 1) / 2) * kw, y = 96, ab = 0.2 + (j * T * 0.8) / dinge.length;
      const g = s("g", { "data-stueck": koerbe[i].zeichen });
      if (d.mal === 3) [-5, 0, 5].forEach((dx, m) => g.appendChild(bildzeichen(x + dx, y - 4 + (m === 1 ? -4 : 0), d.bild, Math.min(14, kw * 0.55))));
      else if (d.bild) g.appendChild(bildzeichen(x, y - 4, d.bild, Math.min(22, kw * 0.8)));
      // eine Datei ohne Bild: Kärtchen mit der Endung darin (orange wie im Spiel), sonst ein leeres Wortkärtchen
      else if (d.text) g.append(s("rect", { x: x - kw / 2 + 1, y: y - 13, width: kw - 2, height: 16, rx: 3, fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 1 }),
        text(x, y - 1.5, d.text, { gross: 9, farbe: "#c25e12" }));
      else g.appendChild(leerKarte(x - kw / 2 + 1, y - 12, kw - 2, 14));
      if (d.text && d.bild) g.appendChild(text(x, y + 9, d.text, { gross: 9, farbe: "#c25e12" }));
      // Startplatz oben, der Reihe nach von links
      const sx = 40 + (j * 240) / Math.max(1, dinge.length - 1 || 1);
      svg.appendChild(herein(g, sx - x, 24 - y + 30, ab, ruhig, 0.45));
    });
    svg.appendChild(vorn);
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE / 2, 26, ruhig));
    return svg;
  }

  // Sound-Sorter: Laute mit den Bildzeichen der Liste des Spiels (woerter.js, Auswahl)
  const LAUTE_EN = {
    "i-kurz": ["🐟", "🐷", "🚢", "6️⃣", "🎁", "🎤"], "i-lang": ["🚲", "5️⃣", "🪁", "9️⃣", "🧊", "🦁"],
    "a-kurz": ["🐱", "🎩", "🗺️", "🧢", "🦇"], "a-lang": ["🎂", "✈️", "🐍", "🐋", "🚆"],
    "o-kurz": ["🐶", "📦", "🐸", "🧦", "🦊"], "o-lang": ["🏠", "👃", "🦴", "📱", "⛵"],
    ee: ["🌳", "🌊", "🐑", "🐝", "🔑"], "oo-lang": ["🌙", "🥄", "👟", "🧃"],
  };
  const lautVon = bild => Object.keys(LAUTE_EN).find(l => LAUTE_EN[l].includes(bild));
  /**
   * s2–s4: Körbe kurz (Punkt) und lang (Strich) je Buchstabe, die Karten nach ihrem Laut; s5: Körbe „wie in tree, bike,
   * cake“ (Bildzeichen), gleicher Laut in anderer Schrift. Angabe: { koerbe: ["i-kurz", …], dinge: [Bild …], ohneTon? }.
   */
  function lautkoerbe(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z || !Array.isArray(z.koerbe) || !Array.isArray(z.dinge) || !z.dinge.length || z.dinge.length > 8) return null;
    // Körbe „wie in“: der lange Laut des Beispiels (tree = ee, bike = i lang, cake = a lang)
    const WIE = { "🌳": "ee", "🚲": "i-lang", "🎂": "a-lang", "🏠": "o-lang", "🌙": "oo-lang" };
    const laute = z.koerbe.map(k => WIE[k] || k);
    if (!laute.every(l => LAUTE_EN[l]) || new Set(laute).size !== laute.length) return null;
    const FARBEN = ["var(--deko-6)", "var(--deko-3)", "var(--deko-5)", "var(--deko-2)", "var(--deko-1)", "var(--deko-4)"];
    const koerbe = z.koerbe.map((k, i) => WIE[k] ? { zeichen: k, bild: k, farbe: FARBEN[i] } : { zeichen: k.split("-")[0], strich: k.split("-")[1], farbe: FARBEN[i] });
    const dinge = [];
    for (const d of z.dinge) {
      const i = laute.indexOf(lautVon(d));
      if (i < 0 || z.koerbe.includes(d)) return null;
      dinge.push({ bild: d, korb: i });
    }
    return korbBild(stufe, "lautkoerbe", { koerbe, dinge, kopf: z.ohneTon ? "🔇" : "👂" }, sterne, ruhig);
  }

  // ----- Weather-Report (AUFTRITT · wetterbericht) -----
  const WETTER_EN = ["☀️", "☁️", "🌧️", "🌬️", "🌨️", "🌫️", "⛈️", "🥵", "🥶"], TEAMS_EN = ["🦁", "🐯", "🐻", "🐺", "🦅", "🦈", "🦊"];
  /**
   * Das Radio 📻 sendet, rechts erscheint, was die Durchsage sagt (so viel, wie die Stufe heraushören lässt): wetter (ein
   * Wort), meldung { wetter, grad }, tage: [[Wetter, Grad] …] (heute und morgen, oder zwei Orte), sport: [[Team, Tore] …]
   * (der Sieger bekommt den Pokal, bei Gleichstand 🤝), weg: { strasse: 1 | 2, seite: "links" | "rechts", ziel } (Plan wie
   * im Spiel: Start ⭐, Hauptstrasse, zwei Querstrassen).
   */
  function wetterbericht(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z) return null;
    const svg = neuesBild("auftritt", stufe, { "data-bilder": "wetterbericht" });
    svg.appendChild(tagGrund());
    svg.append(bildzeichen(32, 76, "📻", 34), schallAus(52, 70, ruhig, 0.1, 0.9));
    const tafeln = [];
    const wetterTafel = (x, y, w, grad) => {
      const g = s("g", { "data-stueck": w }, s("rect", { x: x - 32, y: y - 34, width: 64, height: 68, rx: 8, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.4 }), bildzeichen(x, y - 8, w, 30));
      if (grad !== undefined) g.appendChild(text(x, y + 26, `${grad} °C`, { gross: 12, farbe: grad < 0 ? "#2f7fd6" : "#c8553d" }));
      return g;
    };
    if (z.wetter || z.meldung) {
      const w = z.wetter || z.meldung.wetter;
      if (!WETTER_EN.includes(w) || (z.meldung && (!Number.isInteger(z.meldung.grad) || z.meldung.grad < -5 || z.meldung.grad > 30 || WETTER_EN.indexOf(w) > 6))) return null;
      tafeln.push(wetterTafel(z.sport ? 116 : 190, 74, w, z.meldung?.grad));
    }
    if (z.tage) {
      if (z.tage.length !== 2 || !z.tage.every(([w, g]) => WETTER_EN.indexOf(w) >= 0 && WETTER_EN.indexOf(w) <= 6 && Number.isInteger(g) && g >= -5 && g <= 30)) return null;
      tafeln.push(wetterTafel(150, 74, ...z.tage[0]), wetterTafel(250, 74, ...z.tage[1]));
      svg.appendChild(erscheine(s("path", { d: "M188,74 h22 m-6,-5 l6,5 l-6,5", stroke: "#8a8fa8", "stroke-width": 2, fill: "none" }), T * 0.5, ruhig));
    }
    if (z.sport) {
      const [[a, ta], [b, tb]] = z.sport;
      if (!TEAMS_EN.includes(a) || !TEAMS_EN.includes(b) || a === b || ![ta, tb].every(n => Number.isInteger(n) && n >= 0 && n <= 9)) return null;
      const x = z.meldung ? 236 : 200, g = s("g", { "data-stueck": "sport", "data-wert": `${ta}:${tb}` },
        s("rect", { x: x - 62, y: 40, width: 124, height: 70, rx: 8, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.4 }),
        bildzeichen(x - 34, 64, a, 26), bildzeichen(x + 34, 64, b, 26), text(x, 100, `${ta} : ${tb}`, { gross: 15 }));
      tafeln.push(g);
      const sieg = ta === tb ? null : ta > tb ? x - 34 : x + 34;
      svg.appendChild(erscheine(bildzeichen(sieg ?? x, 28, ta === tb ? "🤝" : "🏆", 18), T + 0.1, ruhig)); // über der Tafel, nicht dahinter
    }
    if (z.weg) {
      const { strasse, seite, ziel } = z.weg;
      const GEB = ["🏫", "🏥", "🏛️", "🎬", "📮", "🏦", "🛒", "🏊", "📚", "🥐", "☕", "🚉"];
      if (![1, 2].includes(strasse) || !["links", "rechts"].includes(seite) || !GEB.includes(ziel)) return null;
      // Plan: Hauptstrasse senkrecht, Querstrassen auf 98 (1st) und 58 (2nd); Start ⭐ unten
      const hx = 200, qy = strasse === 1 ? 98 : 58, zx = seite === "links" ? 136 : 264;
      svg.append(s("rect", { x: 100, y: 14, width: 200, height: 128, rx: 8, fill: "#e8f5e3" }),
        s("rect", { x: hx - 7, y: 14, width: 14, height: 128, style: "fill:var(--deko-7)" }),
        s("rect", { x: 100, y: 91, width: 200, height: 14, style: "fill:var(--deko-7)" }), s("rect", { x: 100, y: 51, width: 200, height: 14, style: "fill:var(--deko-7)" }),
        bildzeichen(hx, 132, "⭐", 14));
      for (const [x, y] of [[136, 32], [264, 32], [136, 76], [264, 76], [136, 122], [264, 122]]) if (!(x === zx && y === qy - 22)) svg.appendChild(s("rect", { x: x - 16, y: y - 9, width: 32, height: 18, rx: 3, fill: "#ffffff", style: "stroke:var(--deko-4)", "stroke-width": 1.2 }));
      tafeln.push(s("g", { "data-stueck": "ziel" }, bildzeichen(zx, qy - 22, ziel, 18)));
      const weg = `M${hx},122 L${hx},${qy} L${zx},${qy}`;
      svg.appendChild(zeichne(s("path", { d: weg, fill: "none", stroke: GUT, "stroke-width": 3, "stroke-linecap": "round" }), 0.2, ruhig, T * 0.7));
      svg.appendChild(bewege(s("g", {}, s("circle", { cx: 0, cy: 0, r: 5, fill: "#e5484d", stroke: "#ffffff", "stroke-width": 1.4 })), weg, { x: zx, y: qy, winkel: 0 }, ruhig, { drehen: false, ab: 0.2, dauer: T * 0.7, linear: true }));
    }
    if (!tafeln.length) return null;
    svg.setAttribute("data-anzahl", tafeln.length);
    tafeln.forEach((g, i) => svg.appendChild(erscheine(g, 0.4 + i * T * 0.35, ruhig, 0.35)));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(34, 124, ruhig));
    return svg;
  }

  // ----- Hello-Dialog, Au café (AUFTRITT · gespraech) -----
  /**
   * Zwei Sprecher (Bildzeichen des Spiels), ihre Sprechblasen erscheinen Zug um Zug abwechselnd (links a, rechts b in
   * --gut-hell wie im Spiel). antwort: Bildzeichen in der letzten Blase (s1: der Gruss als Bild, s2: das Gesicht); ort:
   * Bildzeichen des Orts oben; fremd: eine Blase passt nicht und fällt heraus; luecke: eine gestrichelte Blase (deko-1)
   * füllt sich; ordnen: die Blasen kommen gemischt und rücken an ihren Platz, mit Nummer. Angabe: { a, b, zuege (2–6), … }.
   */
  function gespraech(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z || !z.a || !z.b || !Number.isInteger(z.zuege) || z.zuege < 2 || z.zuege > 6) return null;
    const n = z.zuege, alle = n + (z.fremd !== undefined ? 1 : 0);
    if (z.fremd !== undefined && !(Number.isInteger(z.fremd) && z.fremd > 0 && z.fremd < n)) return null;
    if (z.luecke !== undefined && !(Number.isInteger(z.luecke) && z.luecke > 0 && z.luecke < n - 1)) return null;
    const svg = neuesBild("auftritt", stufe, { "data-bilder": "gespraech", "data-anzahl": n });
    svg.appendChild(tagGrund());
    svg.append(bildzeichen(26, 120, z.a, 30), bildzeichen(294, 120, z.b, 30));
    if (z.ort) svg.appendChild(bildzeichen(160, 14, z.ort, 14));
    const oben = z.ort ? 26 : 12, zh = Math.min(30, (138 - oben) / alle), h = Math.min(22, zh - 5), je = T / alle;
    let reihe = 0;
    for (let i = 0; i < n; i++) {
      if (z.fremd === i) {
        // die fremde Zeile: erscheint an ihrem Platz, wird durchgestrichen und fällt heraus; die übrigen rücken nach
        const y = oben + reihe * zh, f = s("g", {}, sprechblase(110, y, 100, h, { links: false, rand: HINWEIS }), blasenStriche(110, y, 100, h), kreuz(218, y + h * 0.75, 13));
        svg.appendChild(ruhig ? s("g", { opacity: 0 }, f) : f);
        if (!ruhig) {
          f.setAttribute("opacity", "0");
          f.append(s("set", { attributeName: "opacity", to: 1, begin: t(0.15 + reihe * je), fill: "freeze" }),
            s("animateTransform", { attributeName: "transform", type: "translate", values: "0 0;0 0;0 140", keyTimes: "0;0.6;1", begin: t(0.15 + reihe * je), dur: `${je * 2.2}s`, fill: "freeze" }),
            // am Ende auch unsichtbar (nicht nur unter dem Bild), wie im ruhigen Bild
            s("animate", { attributeName: "opacity", from: 1, to: 0, begin: t(0.15 + reihe * je + je * 2), dur: "0.2s", fill: "freeze" }));
        }
        reihe++;
      }
      const a = i % 2 === 0, y = oben + (ruhig || z.fremd === undefined || i < z.fremd ? i : i) * zh + (z.fremd !== undefined && i >= z.fremd ? 0 : 0);
      const b = 150, x = a ? 50 : 120, letzte = i === n - 1, luecke = z.luecke === i;
      const blase = s("g", { "data-stueck": a ? "a" : "b" },
        sprechblase(x, y, b, h, { links: a, rand: luecke ? "var(--deko-1)" : a ? "#8a8fa8" : GUT, grund: a ? "#ffffff" : "#e3f7ec", gestrichelt: luecke }));
      if (letzte && z.antwort) blase.appendChild(bildzeichen(x + b / 2, y + h / 2, z.antwort, Math.min(18, h - 2)));
      else if (luecke) blase.appendChild(erscheine(blasenStriche(x, y, b, h), 0.15 + (i + 1) * je + 0.3, ruhig));
      else blase.appendChild(blasenStriche(x, y, b, h));
      if (z.ordnen) blase.appendChild(text(a ? x - 8 : x + b + 8, y + h * 0.72, i + 1, { gross: 10, farbe: "var(--deko-1)" }));
      // geordnet: kommt von der Seite her an ihren Platz (vorher in anderer Reihenfolge), sonst einfach nacheinander
      const ab = 0.15 + reihe * je;
      svg.appendChild(z.ordnen ? herein(blase, a ? -60 : 60, ((n - 1 - i) - i) * zh * 0.5, ab, ruhig, 0.4) : erscheine(blase, ab, ruhig, 0.3));
      reihe++;
    }
    if (z.hoeflich) svg.appendChild(erscheine(haken(160, 140, 14), T + 0.1, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(20, 22, ruhig)); // oben links, nicht auf den Nummern beim Ordnen
    return svg;
  }

  // ----- Wörter-Brücke (BAUEN · bruecke) -----
  /**
   * Die Brücke zwischen Französisch (links, Kärtchen deko-5 wie im Spiel) und Deutsch (rechts): ein Wort geht hinüber und
   * kommt drüben als deutsches Kärtchen an, mit dem Bild, wo das Spiel eins zeigt. falle: ein falscher Freund (Karte
   * deko-3) bleibt am ⚠️ in der Mitte stehen und fällt ins Wasser. satz: ein kurzer Satz (Kärtchen als Zug) geht hinüber,
   * drüben erscheint, wovon die Rede ist. Angabe: Liste von { bild? , falle? , satz?: Wörter } (1–4).
   */
  function bruecke(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.9;
    if (!Array.isArray(z) || !z.length || z.length > 4 || !z.every(w => !w.satz || (Number.isInteger(w.satz) && w.satz >= 3 && w.satz <= 6 && w.bild))) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "bruecke", "data-anzahl": z.length });
    svg.append(tagGrund(), s("path", { d: `M0,112 H${BREITE} V136 Q${BREITE},${HOEHE} ${BREITE - 14},${HOEHE} H14 Q0,${HOEHE} 0,136 Z`, fill: "#5aa9dc" }),
      s("path", { d: "M0,80 H62 V150 H0 Z M258,80 H320 V150 H258 Z", fill: "#86c46f" }));
    // Brücke mit vier Bögen
    let bogen = "M62,80 H258 V88 ";
    for (let i = 4; i > 0; i--) { const x = 62 + i * 49; bogen += `L${x},88 Q${x - 24.5},104 ${x - 49},88 `; }
    svg.append(s("path", { d: bogen + "Z", fill: "#c9b08a", stroke: "#8a6a3f", "stroke-width": 1.2 }), s("rect", { x: 62, y: 74, width: 196, height: 6, fill: "#a8743f" }));
    const je = T / z.length;
    z.forEach((w, i) => {
      const ab = 0.15 + i * je, y = 66;
      const karte = w.satz
        ? s("g", {}, ...[...Array(w.satz).keys()].map(k => leerKarte(-w.satz * 7 + k * 14, y - 8, 12, 12, { rand: "var(--deko-5)", grund: "#e6f7f5", breit: 1.2 })))
        : s("g", {}, leerKarte(-18, y - 9, 36, 16, { rand: w.falle ? "var(--deko-3)" : "var(--deko-5)", grund: w.falle ? "#fff1e6" : "#e6f7f5" }));
      const g = s("g", { "data-stueck": w.falle ? "falle" : w.satz ? "satz" : "wort" });
      if (w.falle) {
        g.appendChild(erscheine(bildzeichen(160, 52, "⚠️", 16), ab + je * 0.35, ruhig));
        if (ruhig) g.appendChild(s("g", { transform: "translate(160 70)" }, karte));
        else {
          karte.append(s("set", { attributeName: "opacity", to: 1, begin: t(ab), fill: "freeze" }),
            s("animateMotion", { path: "M30,0 L160,0 L166,58", keyPoints: "0;0.8;1", keyTimes: "0;0.6;1", calcMode: "linear", begin: t(ab), dur: `${je * 0.95}s`, fill: "freeze" }));
          karte.setAttribute("opacity", "0");
          g.appendChild(karte);
        }
      } else {
        const ende = w.satz ? BREITE - 8 - w.satz * 7 : 290;
        g.appendChild(bewege(karte, `M30,0 L${ende},0`, { x: ende, y: 0, winkel: 0 }, ruhig, { drehen: false, ab, dauer: je * 0.8, linear: true }));
        if (w.bild) g.appendChild(erscheine(bildzeichen(290, 40, w.bild, 18), ab + je * 0.8, ruhig));
      }
      // im Endbild nur das letzte Wort drüben, die früheren sind weitergegangen
      if (i < z.length - 1 && !w.falle) svg.appendChild(verschwinde(g, ab + je * 0.98, ruhig, 0.15));
      else svg.appendChild(g);
    });
    // die früheren Wörter zählen im Endbild als Häkchen am Ufer
    z.forEach((w, i) => svg.appendChild(erscheine(w.falle ? s("g", {}, bildzeichen(276 + (i - 1.5) * 12, 98, "⚠️", 9)) : haken(276 + (i - 1.5) * 12, 102, 11), 0.15 + (i + 1) * je - 0.1, ruhig)));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(30, 30, ruhig));
    return svg;
  }

  // ----- Le ou la ? (SAMMELN · artikel) -----
  // Wörter der Liste des Spiels: Geschlecht m/f, Anfang mit Vokal oder stummem h (v), Mehrzahl-Endung
  const NOMEN_FR = {
    "🐱": ["m", "", "s"], "🐶": ["m", "", "s"], "🐴": ["m", "", "aux"], "🍰": ["m", "", "x"], "⛵": ["m", "", "x"], "🎩": ["m", "", "x"],
    "🎁": ["m", "", "x"], "🏰": ["m", "", "x"], "🎲": ["m", "", "x"], "🔥": ["m", "", "x"], "🚆": ["m", "", "s"], "☀️": ["m", "", "s"],
    "🐄": ["f", "", "s"], "🍎": ["f", "", "s"], "🍌": ["f", "", "s"], "🏠": ["f", "", "s"], "🚗": ["f", "", "s"], "🌸": ["f", "", "s"],
    "🌙": ["f", "", "s"], "🔑": ["f", "", "s"], "🎸": ["f", "", "s"], "👗": ["f", "", "s"],
    "🐦": ["m", "v", "x"], "🐘": ["m", "v", "s"], "🌳": ["m", "v", "s"], "✈️": ["m", "v", "s"], "🏨": ["m", "v", "s"], "🏥": ["m", "v", "aux"],
    "🍊": ["f", "v", "s"], "🐝": ["f", "v", "s"], "⭐": ["f", "v", "s"], "🏫": ["f", "v", "s"],
  };
  /** Artikel nach der Regel des Spiels: bestimmt (le, la, l’, les) oder unbestimmt (un, une, des). */
  function artikelVon(bild, { mehr = false, unbestimmt = false } = {}) {
    const n = NOMEN_FR[bild];
    if (!n) return null;
    if (unbestimmt) return mehr ? "des" : n[0] === "m" ? "un" : "une";
    return mehr ? "les" : n[1] === "v" ? "l’" : n[0] === "m" ? "le" : "la";
  }
  // Körbe in fester Reihenfolge wie im Spiel: le/un deko-6, la/une deko-3, l’/des deko-5, les deko-2
  const ARTIKEL_FARBE = { le: "var(--deko-6)", un: "var(--deko-6)", la: "var(--deko-3)", une: "var(--deko-3)", "l’": "var(--deko-5)", des: "var(--deko-5)", les: "var(--deko-2)" };
  /**
   * Die Bilder fallen in den Korb ihres Artikels (Körbe wie im Spiel); in der Mehrzahl zeigt das Spiel das Bild dreimal.
   * mehrzahl: ein Bild wird zu dreien, dazu der Artikel le/la → les und die Endung (‑s, ‑x, ‑aux; s5). Angabe:
   * { koerbe: [Artikel …], dinge: [[Bild, mehr?] …] } oder { mehrzahl: [Bild …] }.
   */
  function artikel(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe];
    if (!z) return null;
    if (Array.isArray(z.mehrzahl)) {
      if (!z.mehrzahl.length || z.mehrzahl.length > 3 || !z.mehrzahl.every(b => NOMEN_FR[b])) return null;
      const svg = neuesBild("sammeln", stufe, { "data-bilder": "artikel", "data-anzahl": z.mehrzahl.length }), T = DAUER * 0.8, je = T / z.mehrzahl.length;
      svg.appendChild(tagGrund());
      z.mehrzahl.forEach((b, i) => {
        const y = 28 + i * (110 / z.mehrzahl.length) + (3 - z.mehrzahl.length) * 14, ab = 0.15 + i * je, ein = artikelVon(b), mehr = "les";
        const schild = (art, x) => s("g", {}, s("rect", { x: x - 18, y: y - 11, width: 36, height: 22, rx: 5, fill: "#ffffff", style: `stroke:${ARTIKEL_FARBE[art]}`, "stroke-width": 2 }), text(x + 0, y + 5, art, { gross: 13 }));
        const g = s("g", { "data-stueck": NOMEN_FR[b][2] }, schild(ein, 40), bildzeichen(82, y, b, 20),
          s("path", { d: `M108,${y} h40 m-6,-5 l6,5 l-6,5`, stroke: "#8a8fa8", "stroke-width": 2, fill: "none" }));
        svg.appendChild(erscheine(g, ab, ruhig));
        svg.appendChild(erscheine(s("g", {}, schild(mehr, 172), ...[0, 1, 2].map(k => bildzeichen(206 + k * 15, y + (k === 1 ? -3 : 0), b, 15)),
          text(252, y + 5, `‑${NOMEN_FR[b][2]}`, { gross: 13, farbe: "#c25e12", anker: "start" })), ab + je * 0.5, ruhig));
      });
      if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
      if (sterne >= 3) svg.appendChild(funken(296, 128, ruhig));
      return svg;
    }
    if (!Array.isArray(z.koerbe) || !z.koerbe.every(a => ARTIKEL_FARBE[a]) || !Array.isArray(z.dinge) || !z.dinge.length || z.dinge.length > 8) return null;
    const unbestimmt = z.koerbe.some(a => ["un", "une", "des"].includes(a)), dinge = [];
    for (const [b, mehr] of z.dinge) {
      const a = artikelVon(b, { mehr, unbestimmt }), korb = z.koerbe.indexOf(a);
      if (korb < 0) return null;
      dinge.push(z.ohneBild ? { korb } : { bild: b, korb, mal: mehr ? 3 : 1 });
    }
    return korbBild(stufe, "artikel", { koerbe: z.koerbe.map(a => ({ zeichen: a, farbe: ARTIKEL_FARBE[a] })), dinge }, sterne, ruhig);
  }

  // ----- Son-Lauscher (SAMMELN · laute) -----
  // Wörter der Liste des Spiels mit ihrem Laut (Auswahl mit Bild)
  const LAUTE_FR = {
    ou: ["🐺", "🍲", "🐔", "🛞", "🐭", "🐻", "🦉", "🔴"], au: ["💧", "🎂", "⛵", "🎁", "🖼️", "🔨", "🟡"],
    on: ["⚽", "🍈", "✏️", "🍋", "🌉", "🏠", "🧼", "🦁", "🎻"], an: ["🧒", "⚪", "🦷", "🌬️", "🦵", "💡", "🍊", "🐍", "🧤", "💃"],
    in: ["🐰", "🍞", "✋", "🎄", "5️⃣", "🚆", "🛁", "🐒", "🦈"], ch: ["🐱", "🪑", "🐴", "🐮", "👔"],
    "é": ["☕", "👶", "🏫", "🚲", "🎲", "🍵", "🔑", "🚀", "🦎"], "è": ["🎉", "🌲", "📏"], oi: ["3️⃣", "👑", "⚫", "🍐", "🚗", "☝️"],
  };
  const lautFr = b => Object.keys(LAUTE_FR).find(l => LAUTE_FR[l].includes(b));
  /**
   * gleich: zwei Wörter klingen am Schluss gleich (zwei Bilder, Schallbögen, „=“; s1). koerbe: Körbe mit dem Laut, die
   * Bilder fallen in ihren Korb (s2–s5); lesen: ohne Ton (📖 statt 👂, s4). luecke: { bild, wort, laut } — die Lücke im
   * Wort füllt sich mit der Schreibweise (s5); tippen: dazu die Tasten des Spiels, die Lautgruppe wird getippt (s6).
   */
  function laute(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z) return null;
    if (Array.isArray(z.koerbe)) {
      if (!z.koerbe.every(l => LAUTE_FR[l]) || !Array.isArray(z.dinge) || !z.dinge.length || z.dinge.length > 8) return null;
      const FARBEN = ["var(--deko-6)", "var(--deko-3)", "var(--deko-5)", "var(--deko-2)"], dinge = [];
      for (const b of z.dinge) { const k = z.koerbe.indexOf(lautFr(b)); if (k < 0) return null; dinge.push({ bild: b, korb: k }); }
      return korbBild(stufe, "laute", { koerbe: z.koerbe.map((l, i) => ({ zeichen: l, farbe: FARBEN[i] })), dinge, kopf: z.lesen ? "📖" : "👂" }, sterne, ruhig);
    }
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "laute" });
    svg.appendChild(tagGrund());
    if (Array.isArray(z.gleich)) {
      const [a, b] = z.gleich;
      if (!lautFr(a) || lautFr(a) !== lautFr(b) || a === b) return null;
      svg.setAttribute("data-wert", lautFr(a));
      svg.setAttribute("data-anzahl", 2);
      [[90, a], [230, b]].forEach(([x, bild], i) => svg.appendChild(s("g", { "data-stueck": "wort" }, erscheine(bildKarte(x, 70, 60, bild), 0.2 + i * T * 0.35, ruhig),
        bildzeichen(x - 18, 118, "🔊", 14), schallAus(x - 8, 118, ruhig, 0.3 + i * T * 0.35, 0.5))));
      svg.appendChild(erscheine(text(160, 80, "=", { gross: 30, farbe: GUT }), T, ruhig));
    } else if (z.luecke) {
      const { bild, wort, laut } = z.luecke;
      // die Schreibweise muss zum Laut des Bildes passen (bateau: au wird „eau“ geschrieben)
      const SCHRIFT_LAUT = { "é": "é", "è": "è", "ê": "è", eau: "au", au: "au", ou: "ou", on: "on", an: "an", en: "an", in: "in", ain: "in" };
      if (lautFr(bild) !== SCHRIFT_LAUT[laut] || !/^[a-zâàçéèêîôûœ’ ]{2,12}$/.test(wort || "")) return null;
      svg.setAttribute("data-wert", laut);
      svg.setAttribute("data-anzahl", 1);
      svg.append(bildKarte(60, 58, 64, bild), bildzeichen(60, 112, "🔊", 14), schallAus(70, 112, ruhig, 0.1, 0.5));
      const breite = [...wort].length * 9.5 + 8, x = 112;
      svg.appendChild(text(x, 66, wort, { gross: 17, anker: "start", fett: false }));
      const lx = x + breite, lw = [...laut].length * 10 + 10;
      svg.appendChild(s("rect", { x: lx, y: 46, width: lw, height: 28, rx: 4, fill: "#fff1e6", style: "stroke:var(--deko-3)", "stroke-width": 1.6, "stroke-dasharray": "4 3" }));
      if (z.tippen) {
        // Tasten des Spiels: a e i o u n m c h é è ê
        const TASTEN = ["a", "e", "i", "o", "u", "n", "m", "c", "h", "é", "è", "ê"];
        if (![...laut].every(b => TASTEN.includes(b))) return null;
        TASTEN.forEach((b, i) => {
          const tx = 112 + (i % 6) * 32, ty = 96 + Math.floor(i / 6) * 26;
          const taste = s("g", {}, s("rect", { x: tx, y: ty, width: 28, height: 22, rx: 4, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.2 }), text(tx + 14, ty + 15.5, b, { gross: 12 }));
          svg.appendChild(taste);
          [...laut].forEach((l, k) => { if (l === b) svg.appendChild(kurz(s("rect", { x: tx, y: ty, width: 28, height: 22, rx: 4, style: "fill:var(--deko-3)", opacity: 0.4 }), 0.3 + k * T * 0.25, 0.3 + k * T * 0.25 + 0.3, ruhig)); });
        });
      }
      [...laut].forEach((l, k) => svg.appendChild(s("g", { "data-stueck": k ? "" : laut }, erscheine(text(lx + 5 + k * 10 + 5, 66, l, { gross: 17, farbe: "#c25e12" }), 0.35 + k * T * 0.25, ruhig))));
      svg.appendChild(erscheine(haken(lx + lw + 12, 60, 15), T + 0.1, ruhig));
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(z.gleich ? 160 : 250, z.gleich ? 30 : 26, ruhig)); // nicht auf den Tasten
    return svg;
  }

  // ----- Nombres-Rallye (REISE · rallye) -----
  /** Rallye-Auto nach rechts, Mitte unten auf 0,0. */
  const rallyeAuto = () => s("g", { "data-figur": "auto" },
    s("path", { d: "M-16,-6 L-14,-13 L-4,-14 L2,-20 L10,-20 L14,-13 L18,-11 L18,-6 Z", style: "fill:var(--deko-4)", stroke: "#2d3047", "stroke-width": 0.8 }),
    s("rect", { x: 3, y: -18, width: 6, height: 4, fill: "#cfe9f8" }), s("circle", { cx: -9, cy: -5, r: 4, fill: "#2d3047" }), s("circle", { cx: 11, cy: -5, r: 4, fill: "#2d3047" }));
  /**
   * Das Auto fährt an Zahltafeln vorbei, die Tafeln leuchten auf, wenn es dort ist (ankunft). tafeln: Zahlen (im Raum der
   * Stufe: von, bis), { geld: Rappen } (Preise wie im Spiel, s5, s6), { telefon: [Paare] } (s5: drei, s6: vier Paare),
   * { ch: Zahl } (die Westschweizer Form septante, huitante, nonante: Tafel mit Schweizer Kreuz). ziel: Zielflagge.
   */
  function rallye(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.9;
    if (!z || !Array.isArray(z.tafeln) || !z.tafeln.length || z.tafeln.length > 5) return null;
    const ok = w => (Number.isInteger(w) && w >= z.von && w <= z.bis)
      || (w && Number.isInteger(w.geld) && w.geld >= 100 && w.geld <= 9995 && w.geld % 5 === 0)
      || (w && Array.isArray(w.telefon) && [3, 4].includes(w.telefon.length) && w.telefon.every(p => Number.isInteger(p) && p >= 10 && p <= 99))
      || (w && [70, 71, 75, 80, 87, 90, 99].includes(w.ch) && w.ch >= z.von && w.ch <= z.bis);
    if (!Number.isInteger(z.von) || !Number.isInteger(z.bis) || !z.tafeln.every(ok)) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "rallye", "data-anzahl": z.tafeln.length });
    svg.append(tagGrund(), s("rect", { x: 0, y: 112, width: BREITE, height: 24, fill: "#8a8fa8" }), s("path", { d: "M0,124 H320", stroke: "#ffffff", "stroke-width": 1.6, "stroke-dasharray": "10 8" }),
      s("path", { d: `M0,136 H${BREITE} V136 Q${BREITE},${HOEHE} ${BREITE - 14},${HOEHE} H14 Q0,${HOEHE} 0,136 Z`, fill: "#86c46f" }));
    const n = z.tafeln.length, xs = z.tafeln.map((_, i) => 46 + ((i + 0.5) * (z.ziel ? 236 : 260)) / n);
    const ende = z.ziel ? 290 : xs[n - 1] + 12, zeiten = ankunft([[-10, 124], ...xs.map(x => [x, 124]), [ende, 124]], T);
    z.tafeln.forEach((w, i) => {
      const inhalt = Number.isInteger(w) ? ganzText(w) : w.geld ? geld(w.geld) : w.telefon ? w.telefon.join(" ") : ganzText(w.ch);
      const breit = Math.max(30, [...inhalt].length * (inhalt.length > 7 ? 6 : 7.2) + 10), x = xs[i], g = s("g", { "data-stueck": "tafel" },
        s("rect", { x: x - 1.5, y: 70, width: 3, height: 42, fill: "#6b7089" }),
        s("rect", { x: x - breit / 2, y: 46, width: breit, height: 26, rx: 4, fill: "#ffffff", style: "stroke:var(--deko-4)", "stroke-width": 2 }),
        text(x, 64, inhalt, { gross: inhalt.length > 7 ? 10 : 13 }));
      if (w.ch) g.append(s("rect", { x: x + breit / 2 - 6, y: 36, width: 14, height: 14, rx: 2, fill: "#e5484d" }),
        s("path", { d: `M${x + breit / 2 + 1},${39} v8 M${x + breit / 2 - 3},${43} h8`, stroke: "#ffffff", "stroke-width": 2.4 }));
      g.appendChild(kurz(s("rect", { x: x - breit / 2 - 3, y: 43, width: breit + 6, height: 32, rx: 6, fill: "none", stroke: GUT, "stroke-width": 2.4 }), zeiten[i + 1], zeiten[i + 1] + 0.5, ruhig));
      svg.appendChild(erscheine(g, Math.max(0, zeiten[i + 1] - 0.35), ruhig));
    });
    if (z.ziel) {
      const fl = s("g", {}, s("rect", { x: 302, y: 80, width: 2, height: 32, fill: "#2d3047" }));
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) fl.appendChild(s("rect", { x: 304 + c * 3.5, y: 80 + r * 3.5, width: 3.5, height: 3.5, fill: (r + c) % 2 ? "#ffffff" : "#2d3047" }));
      svg.appendChild(fl);
    }
    svg.appendChild(bewege(rallyeAuto(), `M-10,124 L${ende},124`, { x: ende, y: 124, winkel: 0 }, ruhig, { drehen: false, linear: true, dauer: T }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(ende, 96, ruhig));
    return svg;
  }

  // ----- Quelle heure ? (ZYKLUS · uhren) -----
  /**
   * Eine bis drei Uhren wie im Spiel (Stundenzeiger --text, Minutenzeiger --knopf); die Zeiger drehen von 12 Uhr zur
   * Zeit der Stufe. Zeiten „h:mm“ (0–23 Uhr): ab 13 Uhr dazu die 24-Stunden-Form darunter, tag ☀️/🌙 für midi und minuit
   * (s5). hoeren: 👂 statt Lesen (s1, s6). Angabe: { zeiten: ["3:00", …], tag?: [Zeichen …], hoeren? }.
   */
  function uhren(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    const min = Array.isArray(z?.zeiten) ? z.zeiten.map(minutenVon) : null;
    if (!min || !min.length || min.length > 3 || min.some(m => m === null)) return null;
    const svg = neuesBild("zyklus", stufe, { "data-bilder": "uhren", "data-anzahl": min.length });
    svg.appendChild(tagGrund());
    if (z.hoeren) svg.append(bildzeichen(18, 18, "👂", 14), schallAus(28, 18, ruhig, 0.1, 0.5));
    const n = min.length, r = n === 1 ? 48 : n === 2 ? 42 : 36, digital = min.some(m => m >= 13 * 60) || !!z.tag;
    min.forEach((m, i) => {
      const cx = BREITE / 2 + (i - (n - 1) / 2) * (n === 3 ? 100 : 130), cy = digital ? 62 : 72, h = Math.floor(m / 60), mm = m % 60, ab = 0.2 + i * 0.25;
      const g = s("g", { "data-stueck": z.zeiten[i] }, zifferblatt(cx, cy, r),
        zeiger(cx, cy, r * 0.5, 4, "#2d3047", 0, (h % 12) * 30 + mm * 0.5, ruhig, ab, T * 0.8),
        zeiger(cx, cy, r * 0.78, 2.6, "var(--knopf)", 0, mm * 6 + (z.hoeren ? 360 : 0), ruhig, ab, T * 0.8), s("circle", { cx, cy, r: 3, fill: "#2d3047" }));
      if (digital) g.appendChild(erscheine(text(cx, cy + r + 20, uhrzeitText(m), { gross: 14 }), T, ruhig));
      if (z.tag?.[i]) g.appendChild(erscheine(bildzeichen(cx + r - 4, cy - r + 6, z.tag[i], 16), T, ruhig));
      svg.appendChild(g);
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(n === 2 ? 160 : 24, n === 2 ? 72 : 130, ruhig));
    return svg;
  }

  // ----- Calendrier (ZYKLUS · kalenderfr) -----
  /**
   * woche: die sieben Tage ordnen sich (Montag zuerst, Samstag und Sonntag deko-2 wie im Monatsblatt des Spiels; s1);
   * heute: Index des Tags (0 = Montag), dazu Pfeile zu morgen und gestern (s2). monate: die zwölf Monate im Kreis, mit
   * der Jahreszeit für die Monate, die das Spiel fragt (s3). blaetter: Kalenderblätter [Tag, Monat] (s4). blatt:
   * { jahr, monat, tag, geburtstag? } — Monatsblatt, der Tag wird angetippt (s5); wechsel: { jahr, monat } — vom letzten
   * Tag des Monats auf den ersten des nächsten (s6).
   */
  function kalenderfr(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z) return null;
    const svg = neuesBild("zyklus", stufe, { "data-bilder": "kalenderfr" });
    svg.appendChild(tagGrund());
    const tageIm = (j, m) => new Date(j, m, 0).getDate(); // m 1–12
    const blattBild = (x, y, tag, monat, b = 46) => s("g", {}, s("rect", { x: x - b / 2, y: y - b / 2, width: b, height: b * 1.05, rx: 5, fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 1.2 }),
      s("rect", { x: x - b / 2, y: y - b / 2, width: b, height: b * 0.28, rx: 5, style: "fill:var(--deko-2)" }), text(x, y - b / 2 + b * 0.22, `${monat}.`, { gross: 10, farbe: "#ffffff" }),
      text(x, y + b * 0.34, tag, { gross: b * 0.42 }));
    if (z.woche || Number.isInteger(z.heute)) {
      if (z.heute !== undefined && !(z.heute >= 1 && z.heute <= 5)) return null; // heute mit morgen und gestern in derselben Woche
      svg.setAttribute("data-anzahl", 7);
      for (let i = 0; i < 7; i++) {
        const x = 34 + i * 42, ende = i >= 5, g = s("g", { "data-stueck": `tag-${i}` },
          s("rect", { x: x - 18, y: 50, width: 36, height: 40, rx: 5, fill: ende ? "#fdeef5" : "#ffffff", style: `stroke:${ende ? "var(--deko-2)" : "#8a8fa8"}`, "stroke-width": 1.6 }),
          s("path", { d: `M${x - 11},68 h22 M${x - 11},74 h14`, stroke: "#c9cde0", "stroke-width": 1.6, "stroke-linecap": "round" }));
        svg.appendChild(z.woche ? herein(g, ((i * 3) % 7 - i) * 42, -30, 0.15 + (i * T * 0.7) / 7, ruhig, 0.35) : g);
      }
      if (Number.isInteger(z.heute)) {
        const x = 34 + z.heute * 42;
        svg.append(erscheine(bildzeichen(x, 36, "☀️", 16), 0.2, ruhig),
          erscheine(s("rect", { x: x - 20, y: 48, width: 40, height: 44, rx: 6, fill: "none", stroke: KNOPF, "stroke-width": 2.4 }), 0.3, ruhig));
        svg.append(erscheine(s("path", { d: `M${x + 6},104 Q${x + 21},118 ${x + 36},104 m-6,0 l6,0 l0,6`, fill: "none", stroke: GUT, "stroke-width": 2 }), T * 0.5, ruhig),
          erscheine(s("path", { d: `M${x - 6},104 Q${x - 21},118 ${x - 36},104 m6,0 l-6,0 l0,6`, fill: "none", stroke: HINWEIS, "stroke-width": 2 }), T * 0.75, ruhig),
          erscheine(tippRing(x + 42, 70, 22, T * 0.55, ruhig), T * 0.5, ruhig));
      }
    } else if (z.monate) {
      svg.setAttribute("data-anzahl", 12);
      for (let m = 0; m < 12; m++) {
        const w = ((m * 30 - 90) * Math.PI) / 180, x = 160 + Math.cos(w) * 54, y = 76 + Math.sin(w) * 54, zeit = MONAT_ZEIT[m];
        const g = s("g", { "data-stueck": `monat-${m + 1}` }, s("circle", { cx: x, cy: y, r: 11, fill: zeit ? zeit[0] : "#ffffff", stroke: "#8a8fa8", "stroke-width": 1 }), text(x, y + 4, m + 1, { gross: 10 }));
        svg.appendChild(erscheine(g, 0.15 + (m * T * 0.6) / 12, ruhig, 0.2));
        if (zeit) svg.appendChild(erscheine(bildzeichen(160 + Math.cos(w) * 80, 76 + Math.sin(w) * 64, zeit[1], 12), T * 0.7 + (m * 0.03), ruhig));
      }
    } else if (Array.isArray(z.blaetter)) {
      if (!z.blaetter.length || z.blaetter.length > 3 || !z.blaetter.every(([d, m]) => m >= 1 && m <= 12 && d >= 1 && d <= tageIm(2026, m))) return null;
      svg.setAttribute("data-anzahl", z.blaetter.length);
      z.blaetter.forEach(([d, m], i) => svg.appendChild(s("g", { "data-stueck": `${d}.${m}.` }, vonOben(blattBild(BREITE / 2 + (i - (z.blaetter.length - 1) / 2) * 90, 72, d, m, 56), 0.2 + i * T * 0.3, ruhig, 50))));
    } else if (z.blatt || z.wechsel) {
      const { jahr, monat } = z.blatt || z.wechsel;
      if (!(jahr >= 2026 && jahr <= 2028 && monat >= 1 && monat <= 12)) return null;
      const n = tageIm(jahr, monat), tag = z.blatt ? z.blatt.tag : n, versatz = (new Date(jahr, monat - 1, 1).getDay() + 6) % 7; // Montag zuerst
      if (!(tag >= 1 && tag <= n)) return null;
      svg.setAttribute("data-wert", `${tag}.${monat}.${jahr}`);
      const c = 15, x0 = z.wechsel ? 18 : 108, y0 = 30;
      svg.append(s("rect", { x: x0 - 4, y: y0 - 18, width: 7 * c + 8, height: 6 * c + 26, rx: 5, fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 1.2 }),
        s("rect", { x: x0 - 4, y: y0 - 18, width: 7 * c + 8, height: 14, rx: 5, style: "fill:var(--deko-2)" }), text(x0 + 3.5 * c, y0 - 7.5, `${monat}.${jahr}`, { gross: 9, farbe: "#ffffff" }));
      for (let d = 1; d <= n; d++) {
        const k = versatz + d - 1, x = x0 + (k % 7) * c + c / 2, y = y0 + Math.floor(k / 7) * c + c / 2 + 4;
        svg.appendChild(text(x, y + 3, d, { gross: 9, farbe: k % 7 >= 5 ? "#c0367a" : "#2d3047", fett: d === tag }));
      }
      const k = versatz + tag - 1, tx = x0 + (k % 7) * c + c / 2, ty = y0 + Math.floor(k / 7) * c + c / 2 + 4;
      svg.appendChild(s("g", { "data-stueck": "tag" }, tippRing(tx, ty, 8, T * 0.5, ruhig)));
      svg.setAttribute("data-anzahl", 1);
      if (z.blatt?.geburtstag) svg.appendChild(erscheine(bildzeichen(64, 76, "🎂", 34), T * 0.7, ruhig));
      if (z.wechsel) {
        // vom letzten Tag des Monats geht es zum ersten des nächsten: das Blatt fällt, darunter der 1.
        const nm = monat % 12 + 1;
        svg.append(s("path", { d: "M152,76 h30 m-6,-5 l6,5 l-6,5", stroke: "#8a8fa8", "stroke-width": 2, fill: "none" }),
          s("g", {}, blattBild(244, 74, 1, nm, 60)));
        svg.appendChild(verschwinde(s("g", {}, blattBild(244, 74, n, monat, 60)), T * 0.7, ruhig, 0.4));
        svg.appendChild(erscheine(bildzeichen(244, 126, "👂", 14), 0.1, ruhig));
      }
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(z.monate ? 270 : 28, z.monate ? 120 : 126, ruhig));
    return svg;
  }

  // ----- Au café: Bestellen (AUFTRITT · bestellung) -----
  const CAFE = ["☕", "🥐", "🍊", "🍦", "🍨", "🥞", "🍵", "💧", "🥪", "🥧", "🍋"];
  /**
   * Am Tisch des Cafés: die Kellnerin 👩 bringt, was bestellt wird (Bildzeichen des Spiels), der Preis in ganzen Franken
   * erscheint am Tisch; anrede: Personen mit tu oder vous (wie im Spiel: Kinder tu, Erwachsene vous); hoeren: 👂.
   * Angabe: { sachen: [Bild …], preis, anrede?: [[Person, "tu" | "vous"] …], hoeren? }.
   */
  function bestellung(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    const TU = ["👧", "👦", "🧒"], VOUS = ["👩", "👨", "👵", "👮"];
    if (!z || !Array.isArray(z.sachen) || !z.sachen.length || z.sachen.length > 3 || !z.sachen.every(b => CAFE.includes(b))
      || !Number.isInteger(z.preis) || z.preis < 2 || z.preis > 20) return null;
    if (z.anrede && !z.anrede.every(([p, a]) => (a === "tu" && TU.includes(p)) || (a === "vous" && VOUS.includes(p)))) return null;
    const svg = neuesBild("auftritt", stufe, { "data-bilder": "bestellung", "data-anzahl": z.sachen.length });
    svg.appendChild(tagGrund());
    svg.append(s("rect", { x: 60, y: 96, width: 150, height: 8, rx: 3, fill: "#a8743f" }), s("rect", { x: 131, y: 104, width: 8, height: 34, fill: "#7a4f26" }),
      bildzeichen(36, 100, "👧", 34), bildzeichen(268, 92, "👩", 34));
    if (z.hoeren) svg.append(bildzeichen(36, 56, "👂", 16));
    svg.appendChild(erscheine(s("g", {}, sprechblase(16, 18, 76, 24, { links: true }), blasenStriche(16, 18, 76, 24)), 0.1, ruhig));
    z.sachen.forEach((b, i) => svg.appendChild(s("g", { "data-stueck": b }, bewege(s("g", {}, bildzeichen(0, -12, b, 22)), `M262,70 Q200,40 ${110 + i * 28},96`, { x: 110 + i * 28, y: 96, winkel: 0 }, ruhig,
      { drehen: false, ab: 0.4 + i * T * 0.25, dauer: 0.7 }))));
    svg.appendChild(erscheine(s("g", { "data-wert": z.preis }, s("rect", { x: 160, y: 112, width: 48, height: 20, rx: 4, fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 1.2 }),
      text(184, 126.5, `${z.preis} Fr.`, { gross: 11 })), T, ruhig));
    (z.anrede || []).forEach(([p, a], i) => {
      const x = 236 + i * 40;
      svg.appendChild(erscheine(s("g", {}, bildzeichen(x, 130, p, 18), text(x, 147, a, { gross: 10, farbe: a === "tu" ? "var(--deko-6)" : "var(--deko-3)" })), T * 0.6 + i * 0.2, ruhig));
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(134, 60, ruhig));
    return svg;
  }

  // ----- Musik: Notenzeile wie gemeinsam/noten.js (p = 0 ist e′ auf der untersten Linie, p = −2 c′, Schritt = eine Linie
  // oder ein Zwischenraum; Hilfslinien ab p ≤ −2 und p ≥ 10; deutsche Namen c d e f g a h, ♯ = -is, ♭: b, es, as …) -----
  const STAMM = ["c", "d", "e", "f", "g", "a", "h"], STAMM_HALB = [0, 2, 4, 5, 7, 9, 11];
  /** MIDI-Nummer eines Tons (p, Vorzeichen +1/−1): c′ = 60. */
  function midiVon(p, vz = 0) {
    const i = p + 2, okt = Math.floor(i / 7);
    return 60 + okt * 12 + STAMM_HALB[((i % 7) + 7) % 7] + vz;
  }
  /** Deutscher Name (fis, cis, b, es, as, des …); Oktave nicht angegeben, wie im Spiel. */
  function tonName(p, vz = 0) {
    const n = STAMM[(((p + 2) % 7) + 7) % 7];
    if (vz > 0) return n + "is";
    if (vz < 0) return n === "h" ? "b" : n === "e" ? "es" : n === "a" ? "as" : n + "es";
    return n;
  }
  const hz = m => 440 * 2 ** ((m - 69) / 12);
  const LINIE = 7; // Linienabstand im Bild
  /** Fünf Linien von x0 bis x1, unterste Linie auf y; mit Violinschlüssel. → Funktion p → y. */
  function notenLinien(svg, x0, x1, y, schluessel = true) {
    for (let i = 0; i < 5; i++) svg.appendChild(s("line", { x1: x0, y1: y - i * LINIE, x2: x1, y2: y - i * LINIE, stroke: "#2d3047", "stroke-width": 1 }));
    if (schluessel) svg.appendChild(s("text", { x: x0 + 2, y: y + LINIE * 1.15, "font-size": LINIE * 6.3, "font-family": "\"Segoe UI Symbol\", \"Noto Music\", serif", fill: "#2d3047" }, "𝄞"));
    return p => y - (p * LINIE) / 2;
  }
  /** Notenkopf (Viertel, gefüllt) mit Hals, Hilfslinien und Vorzeichen an x für Ton p. */
  function notenKopf(x, py, p, vz = 0, { hohl = false, hals = true } = {}) {
    const y = py(p), g = s("g", {});
    for (let q = -2; q >= p; q -= 2) g.appendChild(s("line", { x1: x - 7, y1: py(q), x2: x + 7, y2: py(q), stroke: "#2d3047", "stroke-width": 1 }));
    for (let q = 10; q <= p; q += 2) g.appendChild(s("line", { x1: x - 7, y1: py(q), x2: x + 7, y2: py(q), stroke: "#2d3047", "stroke-width": 1 }));
    g.appendChild(s("ellipse", { cx: x, cy: y, rx: 4.4, ry: 3.2, transform: `rotate(-20 ${x} ${y})`, fill: hohl ? "#ffffff" : "#2d3047", stroke: "#2d3047", "stroke-width": 1.2 }));
    if (hals) g.appendChild(p < 4 ? s("line", { x1: x + 4, y1: y, x2: x + 4, y2: y - 22, stroke: "#2d3047", "stroke-width": 1.2 })
      : s("line", { x1: x - 4, y1: y, x2: x - 4, y2: y + 22, stroke: "#2d3047", "stroke-width": 1.2 }));
    if (vz) g.appendChild(text(x - 11, y + 4, vz > 0 ? "♯" : "♭", { gross: 12, fett: false }));
    return g;
  }

  // ----- Noten-Namen (AUFTRITT · notennamen) -----
  /**
   * Die Töne der Stufe erscheinen Note um Note im Violinschlüssel, darunter ihr Name (wie im Spiel deutsch); mit Ton an
   * klingt jede Note. Angabe: { toene: [p | [p, ±1] …] } (2–9), p von −5 (g) bis 12 (c‴).
   */
  function notennamen(feier, { stufe, sterne, ruhig, klang, plane }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    const toene = (z?.toene || []).map(x => (Array.isArray(x) ? x : [x, 0]));
    if (toene.length < 2 || toene.length > 9 || !toene.every(([p, v]) => Number.isInteger(p) && p >= -5 && p <= 12 && [-1, 0, 1].includes(v))) return null;
    const svg = neuesBild("auftritt", stufe, { "data-bilder": "notennamen", "data-anzahl": toene.length });
    svg.appendChild(tagGrund());
    const py = notenLinien(svg, 12, 308, 92), x0 = 66, dx = Math.min(30, 236 / toene.length), je = T / toene.length;
    toene.forEach(([p, v], i) => {
      const x = x0 + dx / 2 + i * dx + (v ? 4 : 0), ab = 0.15 + i * je;
      const g = s("g", { "data-stueck": tonName(p, v), "data-midi": midiVon(p, v) }, notenKopf(x, py, p, v), text(x, 138, tonName(p, v), { gross: 12, farbe: "var(--deko-6)" }));
      svg.appendChild(vonOben(g, ab, ruhig, 24, 0.3));
      if (klang && plane) plane(START + (ruhig ? 0 : ab), () => klang([[hz(midiVon(p, v)), 0.22]]));
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(250, 24, ruhig));
    return svg;
  }

  // ----- Rhythmus: Notenwerte auf einer Linie (Werte in Vierteln: 4 Ganze, 3 punktierte Halbe, 2 Halbe, 1.5 punktierte
  // Viertel, 1 Viertel, 0.5 Achtel, 0.25 Sechzehntel; wie im Spiel einzeln mit Fähnchen) -----
  const WERTE = [4, 3, 2, 1.5, 1, 0.5, 0.25];
  /** Note mit Wert w an x, Kopf auf der Linie y. */
  function rhythmusNote(x, y, w) {
    const g = s("g", { "data-wert": w });
    const hohl = w >= 2, hals = w < 4, punkt = w === 3 || w === 1.5, faehnchen = w === 0.5 ? 1 : w === 0.25 ? 2 : 0;
    g.appendChild(s("ellipse", { cx: x, cy: y, rx: 4.6, ry: 3.3, transform: `rotate(-20 ${x} ${y})`, fill: hohl ? "#ffffff" : "#2d3047", stroke: "#2d3047", "stroke-width": 1.3 }));
    if (hals) g.appendChild(s("line", { x1: x + 4.2, y1: y, x2: x + 4.2, y2: y - 24, stroke: "#2d3047", "stroke-width": 1.3 }));
    for (let f = 0; f < faehnchen; f++) g.appendChild(s("path", { d: `M${x + 4.2},${y - 24 + f * 5} q6,4 5,11`, fill: "none", stroke: "#2d3047", "stroke-width": 1.4 }));
    if (punkt) g.appendChild(s("circle", { cx: x + 8, cy: y - 1, r: 1.6, fill: "#2d3047" }));
    return g;
  }
  /**
   * Rhythmus-Leser: Takte auf der Rhythmuslinie, mit Taktangabe; die Noten erscheinen der Reihe nach (mit Ton an je ein
   * Schlag), luecke: [Takt, Stelle] — die Lücke (gestrichelt, deko-4 wie im Spiel) füllt sich zuletzt. Jeder Takt geht
   * auf (Summe der Werte = Zähler über 4). Angabe: { takte: [{ art: 2 | 3 | 4, noten: [Wert …] } …], luecke? }.
   */
  function rhythmus(feier, { stufe, sterne, ruhig, klang, plane }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z || !Array.isArray(z.takte) || !z.takte.length || z.takte.length > 3) return null;
    if (!z.takte.every(tk => [2, 3, 4].includes(tk.art) && Array.isArray(tk.noten) && tk.noten.every(w => WERTE.includes(w))
      && Math.abs(tk.noten.reduce((a, w) => a + w, 0) - tk.art) < 1e-9)) return null;
    const alle = z.takte.reduce((a, tk) => a + tk.noten.length, 0);
    const svg = neuesBild("auftritt", stufe, { "data-bilder": "rhythmus", "data-anzahl": alle });
    svg.appendChild(tagGrund());
    const y = 96, breiten = z.takte.map(tk => 26 + tk.noten.length * 22), gesamt = breiten.reduce((a, b) => a + b, 0) + 8;
    const f = Math.min(1, 296 / gesamt);
    const g0 = s("g", { transform: `translate(${(BREITE - gesamt * f) / 2} 0) scale(${f} 1)` });
    let x = 0, k = 0;
    const je = T / alle;
    g0.appendChild(s("line", { x1: 0, y1: y, x2: gesamt, y2: y, stroke: "#2d3047", "stroke-width": 1.2 }));
    z.takte.forEach((tk, ti) => {
      g0.append(text(x + 9, y - 6, tk.art, { gross: 13, fett: true }), text(x + 9, y + 12, 4, { gross: 13, fett: true }));
      let nx = x + 30;
      tk.noten.forEach((w, ni) => {
        const luecke = z.luecke && z.luecke[0] === ti && z.luecke[1] === ni, ab = luecke ? T : 0.15 + k * je;
        const note = s("g", { "data-stueck": String(w) }, rhythmusNote(nx, y, w));
        if (luecke) g0.appendChild(s("rect", { x: nx - 9, y: y - 32, width: 22, height: 42, rx: 4, fill: "#fff8e1", style: "stroke:var(--deko-4)", "stroke-width": 1.6, "stroke-dasharray": "4 3" }));
        g0.appendChild(luecke ? vonOben(note, ab, ruhig, 30, 0.35) : erscheine(note, ab, ruhig, 0.2));
        if (klang && plane) plane(START + (ruhig ? 0 : ab), () => klang([[523, Math.min(0.3, w * 0.25)]]));
        nx += 22; k++;
      });
      x += breiten[ti];
      g0.appendChild(s("line", { x1: x, y1: y - 14, x2: x, y2: y + 14, stroke: "#2d3047", "stroke-width": ti === z.takte.length - 1 ? 2.6 : 1.2 }));
    });
    svg.appendChild(g0);
    svg.appendChild(bildzeichen(28, 32, "🥁", 20));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(160, 30, ruhig));
    return svg;
  }

  // ----- Rhythmus-Diktat (BAUEN · diktat) -----
  // Notenkarten des Spiels: Dauer in Vierteln und Noten (Wert je Kopf; die Balken wie im Spiel)
  const KARTEN_DIKTAT = {
    "4": { d: 1, n: [1] }, "88": { d: 1, n: [0.5, 0.5] }, "2": { d: 2, n: [2] }, "p": { d: 1, n: [] }, "16": { d: 1, n: [0.25, 0.25, 0.25, 0.25] },
    "8-16-16": { d: 1, n: [0.5, 0.25, 0.25] }, "16-16-8": { d: 1, n: [0.25, 0.25, 0.5] }, "4.8": { d: 2, n: [1.5, 0.5] }, "8.16": { d: 1, n: [0.75, 0.25] },
    "16-8-16": { d: 1, n: [0.25, 0.5, 0.25] },
  };
  /** Notenkarte k an x (Breite je Viertel q), Linie y; Achtel und Sechzehntel mit Balken. */
  function diktatKarte(k, x, y, q) {
    const kt = KARTEN_DIKTAT[k], g = s("g", { "data-karte": k });
    g.appendChild(s("rect", { x: x + 2, y: y - 36, width: kt.d * q - 4, height: 48, rx: 5, fill: "#ffffff", style: "stroke:var(--deko-5)", "stroke-width": 1.6 }));
    if (k === "p") { g.appendChild(s("path", { d: `M${x + q / 2 - 3},${y - 22} l6,7 l-5,5 l5,7 q-7,-3 -4,4`, fill: "none", stroke: "#2d3047", "stroke-width": 2.2, "stroke-linejoin": "round" })); return g; }
    const n = kt.n.length, xs = kt.n.map((_, i) => x + 6 + ((i + 0.5) * (kt.d * q - 14)) / n - 2); // Köpfe innerhalb der Karte
    kt.n.forEach((w, i) => {
      const hohl = w >= 2;
      g.appendChild(s("ellipse", { cx: xs[i], cy: y, rx: 4.2, ry: 3, transform: `rotate(-20 ${xs[i]} ${y})`, fill: hohl ? "#ffffff" : "#2d3047", stroke: "#2d3047", "stroke-width": 1.2 }));
      g.appendChild(s("line", { x1: xs[i] + 3.8, y1: y, x2: xs[i] + 3.8, y2: y - 24, stroke: "#2d3047", "stroke-width": 1.2 }));
      if (w === 1.5 || w === 0.75) g.appendChild(s("circle", { cx: xs[i] + 8, cy: y - 1, r: 1.5, fill: "#2d3047" }));
    });
    const kurzeNoten = kt.n.map((w, i) => [w, i]).filter(([w]) => w < 1);
    if (kurzeNoten.length === 1) {
      // eine Achtel allein (nach der punktierten Viertel): Fähnchen
      const i = kurzeNoten[0][1];
      g.appendChild(s("path", { d: `M${xs[i] + 3.8},${y - 24} q6,4 5,11`, fill: "none", stroke: "#2d3047", "stroke-width": 1.4 }));
    } else if (kurzeNoten.length > 1) {
      const a = kurzeNoten[0][1], b = kurzeNoten[kurzeNoten.length - 1][1];
      g.appendChild(s("rect", { x: xs[a] + 3.2, y: y - 25, width: xs[b] - xs[a] + 1.2, height: 3.6, fill: "#2d3047" }));
      // zweiter Balken für Sechzehntel: zwischen benachbarten, sonst ein kurzer Stummel
      kt.n.forEach((w, i) => {
        if (w !== 0.25) return;
        const nb = kt.n[i + 1] === 0.25 ? i + 1 : null;
        if (nb !== null) g.appendChild(s("rect", { x: xs[i] + 3.2, y: y - 20, width: xs[nb] - xs[i] + 1.2, height: 3.6, fill: "#2d3047" }));
        else if (kt.n[i - 1] !== 0.25) g.appendChild(s("rect", { x: i ? xs[i] - 3 : xs[i] + 3.2, y: y - 20, width: 7, height: 3.6, fill: "#2d3047" }));
      });
    }
    return g;
  }
  /**
   * Die Notenkarten der Stufe fallen der Reihe nach in die Taktleiste (4/4 wie im Spiel; höchstens eine Viertelpause je
   * Takt, jeder Takt voll). Angabe: { takte: [[Karte …] …] } (1–2 Takte).
   */
  function diktat(feier, { stufe, sterne, ruhig, klang, plane }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z || !Array.isArray(z.takte) || !z.takte.length || z.takte.length > 2) return null;
    if (!z.takte.every(tk => Array.isArray(tk) && tk.every(k => KARTEN_DIKTAT[k]) && tk.reduce((a, k) => a + KARTEN_DIKTAT[k].d, 0) === 4 && tk.filter(k => k === "p").length <= 1)) return null;
    const alle = z.takte.flat();
    const svg = neuesBild("bauen", stufe, { "data-bilder": "diktat", "data-anzahl": alle.length });
    svg.appendChild(tagGrund());
    // ein Takt in der Mitte, zwei Takte untereinander (sonst würden die Sechzehntel zu eng)
    const q = 56, x0 = BREITE / 2 - (4 * q) / 2 + 8, je = T / alle.length, zeileY = z.takte.length === 1 ? [96] : [70, 132];
    let k = 0;
    z.takte.forEach((tk, ti) => {
      const y = zeileY[ti];
      let x = x0;
      if (!ti) svg.append(text(x0 - 12, y - 4, 4, { gross: 13 }), text(x0 - 12, y + 12, 4, { gross: 13 }));
      svg.appendChild(s("line", { x1: x, y1: y, x2: x + 4 * q, y2: y, stroke: "#2d3047", "stroke-width": 1.2 }));
      for (const karte of tk) {
        const ab = 0.15 + k++ * je;
        svg.appendChild(s("g", { "data-stueck": karte }, falle(diktatKarte(karte, x, y, q), ab, ruhig)));
        let tz = 0;
        if (klang && plane) for (const w of KARTEN_DIKTAT[karte].n) { const zeit = ab + tz * 0.25; plane(START + (ruhig ? 0 : zeit), () => klang([[523, Math.min(0.25, w * 0.2)]])); tz += w; }
        x += KARTEN_DIKTAT[karte].d * q;
      }
      svg.appendChild(s("line", { x1: x, y1: y - 40, x2: x, y2: y + 16, stroke: "#2d3047", "stroke-width": ti === z.takte.length - 1 ? 2.6 : 1.2 }));
    });
    svg.appendChild(bildzeichen(28, 26, "🥁", 18));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(z.takte.length === 1 ? funken(160, 132, ruhig) : funken(26, 104, ruhig));
    return svg;
  }

  // ----- Hoch-Tief-Ohr (REISE · melodie) -----
  /**
   * Ein Vogel hüpft die Töne entlang (Noten im Violinschlüssel), mit Ton an klingt jeder Ton. vergleich: von zwei Tönen
   * leuchtet der höhere auf, gleich: beide gleich hoch (=); pfeile: Richtung zwischen den Tönen (↗ ↘); schritte: über
   * jedem Schritt ½ oder 1 (Halbton, Ganzton; geprüft an den Halbtönen e–f und h–c). Angabe: { toene: [p …] (2–4), … }.
   */
  function melodie(feier, { stufe, sterne, ruhig, klang, plane }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85, p = z?.toene;
    if (!Array.isArray(p) || p.length < 2 || p.length > 4 || !p.every(x => Number.isInteger(x) && x >= -2 && x <= 9)) return null;
    const m = p.map(x => midiVon(x));
    if (z.gleich && !(p.length === 2 && p[0] === p[1])) return null;
    if (z.vergleich && !(p.length === 2 && p[0] !== p[1])) return null;
    if (z.schritte && !(z.schritte.length === p.length - 1 && z.schritte.every((sch, i) => Math.abs(p[i + 1] - p[i]) === 1 && Math.abs(m[i + 1] - m[i]) === (sch === "½" ? 1 : sch === "1" ? 2 : -1)))) return null;
    const svg = neuesBild("reise", stufe, { "data-bilder": "melodie", "data-anzahl": p.length });
    svg.appendChild(tagGrund());
    const py = notenLinien(svg, 12, 308, 104), xs = p.map((_, i) => 96 + (i * 190) / Math.max(1, p.length - 1));
    const hoch = Math.max(...m);
    // der Vogel hüpft gleichmässig von Note zu Note; jede Note erscheint und klingt, wenn er bei ihr ankommt (ankunft)
    const punkte = p.map((x, i) => [xs[i], py(x) - 8]), start = [punkte[0][0] - 40, punkte[0][1] - 30];
    const an = ankunft([start, ...punkte], T).slice(1).map(z => 0.05 + Math.max(0, z - 0.1));
    p.forEach((x, i) => {
      const g = s("g", { "data-stueck": tonName(x) }, notenKopf(xs[i], py, x, 0, { hals: false }));
      if (z.vergleich && m[i] === hoch) g.appendChild(erscheine(s("circle", { cx: xs[i], cy: py(x), r: 9, fill: "none", stroke: GUT, "stroke-width": 2.4 }), T, ruhig));
      svg.appendChild(erscheine(g, an[i], ruhig, 0.15));
      if (klang && plane) plane(START + (ruhig ? 0 : an[i]), () => klang([[hz(m[i]), 0.3]]));
      const je = an[i] - (an[i - 1] ?? 0);
      if (i && (z.pfeile || z.schritte)) {
        const mx = (xs[i] + xs[i - 1]) / 2, y1 = py(p[i - 1]), y2 = py(x), my = Math.min(y1, y2) - 18;
        if (z.pfeile) svg.appendChild(erscheine(s("path", { d: `M${mx - 10},${my + (y2 < y1 ? 6 : -6)} L${mx + 10},${my + (y2 < y1 ? -6 : 6)}`, stroke: y2 < y1 ? GUT : HINWEIS, "stroke-width": 2.4,
          "marker-end": "none", "stroke-linecap": "round" }), an[i] - je * 0.4, ruhig));
        if (z.schritte) svg.appendChild(erscheine(text(mx, my, z.schritte[i - 1], { gross: 13, farbe: z.schritte[i - 1] === "½" ? "#c25e12" : "var(--deko-6)" }), an[i], ruhig));
      }
    });
    if (z.gleich) svg.appendChild(erscheine(text(160, py(p[0]) + 4, "=", { gross: 18, farbe: GUT }), T, ruhig));
    // Weg des Vogels: gerade Stücke (ankunft rechnet mit ihnen), sitzt am Ende auf der letzten Note
    const weg = "M" + [start, ...punkte].map(q => q.map(v => v.toFixed(1)).join(",")).join(" L");
    const vogel = s("g", {}, s("ellipse", { cx: 0, cy: -5, rx: 6, ry: 4.4, fill: "#3f7fc8" }), s("circle", { cx: 5, cy: -9, r: 3.2, fill: "#3f7fc8" }),
      s("path", { d: "M8,-10 l3.5,1 l-3.5,1 Z", fill: "#f5a623" }), s("circle", { cx: 6, cy: -10, r: 0.8, fill: "#ffffff" }));
    svg.appendChild(bewege(vogel, weg, { x: punkte[p.length - 1][0], y: punkte[p.length - 1][1], winkel: 0 }, ruhig, { drehen: false, ab: 0.05, dauer: T, linear: true }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(36, 30, ruhig));
    return svg;
  }

  // ----- Klang-Wichtel (AUFTRITT · klangwichtel) -----
  /**
   * Der Wichtel 🧝 spielt, rechts erscheint, worauf zu achten ist — mit den Zeichen des Spiels: laut 🦁 / leise 🐭 als
   * grosser und kleiner Punkt, kurz und lang als Strich, schnell 🐇 / langsam 🐢 als Schläge; vergleich: zwei Klänge,
   * der längere (oder lautere) bekommt den Haken; schrift: die Klangschrift der Stufe (Striche k/l oder Punkte g/k);
   * karten: Bildkarten mit zwei Merkmalen, die richtige (ziel) bekommt den Haken.
   */
  function klangwichtel(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z) return null;
    const svg = neuesBild("auftritt", stufe, { "data-bilder": "klangwichtel" });
    svg.appendChild(tagGrund());
    svg.append(bildzeichen(40, 96, "🧝", 44), bildzeichen(72, 112, "🔔", 18));
    const strich = (x, y, lang, ab) => {
      const b = lang ? 66 : 18, r = s("rect", { x, y: y - 5, width: b, height: 10, rx: 5, style: "fill:var(--deko-7)" });
      if (!ruhig) { r.setAttribute("width", "0"); r.appendChild(s("animate", { attributeName: "width", from: 0, to: b, begin: t(ab), dur: `${lang ? 0.9 : 0.2}s`, fill: "freeze" })); }
      return r;
    };
    const punkt = (x, y, gross, ab) => erscheine(s("circle", { cx: x, cy: y, r: gross ? 18 : 7, style: "fill:var(--deko-7)" }), ab, ruhig, 0.2);
    const stuecke = [];
    if (z.gegensatz) {
      const A = { laut: ["🦁", "🐭"], lang: ["", ""], schnell: ["🐇", "🐢"] }[z.gegensatz];
      if (!A) return null;
      [0, 1].forEach(i => {
        const y = 46 + i * 56, g = s("g", { "data-stueck": i ? "zweites" : "erstes" });
        if (A[i]) g.appendChild(bildzeichen(124, y, A[i], 24));
        if (z.gegensatz === "laut") g.appendChild(punkt(184, y, i === 0, 0.2 + i * T * 0.45));
        if (z.gegensatz === "lang") g.appendChild(strich(150, y, i === 1, 0.2 + i * T * 0.45));
        if (z.gegensatz === "schnell") {
          const n = i ? 4 : 6, abst = i ? 34 : 16;
          for (let k = 0; k < n; k++) g.appendChild(erscheine(s("circle", { cx: 160 + k * abst, cy: y, r: 4, style: "fill:var(--deko-7)" }), 0.2 + i * T * 0.45 + k * (i ? 0.25 : 0.08), ruhig, 0.1));
        }
        stuecke.push(g);
      });
    } else if (Array.isArray(z.vergleich)) {
      const [art, a, b] = z.vergleich;
      if (!["lang", "laut"].includes(art) || !(a > 0 && b > 0 && a !== b)) return null;
      [a, b].forEach((w, i) => {
        const y = 46 + i * 56, g = s("g", { "data-stueck": String(w) }, text(124, y + 5, i + 1, { gross: 14 }));
        g.appendChild(art === "lang" ? strich(146, y, false, 0) : punkt(180, y, false, 0));
        const el = g.lastChild;
        if (art === "lang") { el.setAttribute("width", String(Math.round(140 * w / Math.max(a, b)))); el.querySelector("animate")?.setAttribute("to", String(Math.round(140 * w / Math.max(a, b)))); }
        else el.setAttribute("r", String(Math.round(20 * w / Math.max(a, b))));
        if (w === Math.max(a, b)) g.appendChild(erscheine(haken(300, y, 15), T, ruhig));
        stuecke.push(erscheine(g, 0.2 + i * T * 0.4, ruhig));
      });
    } else if (Array.isArray(z.schrift)) {
      const st = z.schrift.every(c => c === "k" || c === "l"), pu = z.schrift.every(c => c === "g" || c === "kl");
      if (z.schrift.length < 3 || z.schrift.length > 4 || (!st && !pu)) return null;
      let x = 116;
      z.schrift.forEach((c, i) => {
        const ab = 0.2 + i * (T / z.schrift.length);
        stuecke.push(s("g", { "data-stueck": c }, st ? strich(x, 74, c === "l", ab) : punkt(x + 18, 74, c === "g", ab)));
        x += st ? (c === "l" ? 76 : 28) : 46;
      });
    } else if (Array.isArray(z.karten)) {
      if (z.karten.length !== 2 || !z.karten.every(k => k.length === 2) || ![0, 1].includes(z.ziel)) return null;
      z.karten.forEach(([dauer, staerke], i) => {
        const x = 150 + i * 96, g = s("g", { "data-stueck": `${dauer}-${staerke}` }, s("rect", { x: x - 40, y: 34, width: 80, height: 80, rx: 8, fill: "#ffffff", stroke: "#c9cde0", "stroke-width": 1.6 }));
        g.append(strich(x - (dauer === "lang" ? 33 : 9), 58, dauer === "lang", 0.2 + i * 0.4), punkt(x, 92, staerke === "laut", 0.3 + i * 0.4));
        if (i === z.ziel) g.append(tippRing(x, 74, 44, T * 0.7, ruhig), erscheine(haken(x + 34, 40, 15), T, ruhig));
        stuecke.push(g);
      });
    } else return null;
    svg.setAttribute("data-anzahl", stuecke.length);
    stuecke.forEach(g => svg.appendChild(g));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(40, 30, ruhig));
    return svg;
  }

  // ----- Tonleiter-Treppe (BAUEN · tonleiter) -----
  // Leitern des Spiels: Namen von unten nach oben; Dur 2-2-1-2-2-2-1, natürliches Moll 2-1-2-2-1-2-2 (in Halbtönen)
  const LEITERN = {
    C: ["c", "d", "e", "f", "g", "a", "h", "c"], G: ["g", "a", "h", "c", "d", "e", "fis", "g"], F: ["f", "g", "a", "b", "c", "d", "e", "f"],
    D: ["d", "e", "fis", "g", "a", "h", "cis", "d"], B: ["b", "c", "d", "es", "f", "g", "a", "b"],
    a: ["a", "h", "c", "d", "e", "f", "g", "a"], e: ["e", "fis", "g", "a", "h", "c", "d", "e"], d: ["d", "e", "f", "g", "a", "b", "c", "d"],
  };
  const KLASSE = { c: 0, cis: 1, d: 2, es: 3, e: 4, f: 5, fis: 6, g: 7, a: 9, b: 10, h: 11 };
  /**
   * Die Treppe der Leiter wie im Spiel (Ganzton hohe, Halbton halbe Stufe; Name im Block): die Eule steigt hinauf (oder
   * hinunter), die Halbtonschritte leuchten (deko-4) mit ½; Dur ☀️, Moll 🌧️ wie im Spiel. klaviatur: [[Taste, Taste] …]
   * auf der Klaviatur c′–h′ mit ½ oder 1 (s3). Die Schritte rechnet das Bild aus den Namen und prüft sie gegen Dur bzw. Moll.
   */
  function tonleiter(feier, { stufe, sterne, ruhig, klang, plane }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.9;
    if (!z) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "tonleiter" });
    svg.appendChild(tagGrund());
    if (Array.isArray(z.klaviatur)) {
      const WEISS = ["c", "d", "e", "f", "g", "a", "h"], SCHWARZ = { cis: 0, es: 1, fis: 3, gis: 4, b: 5 }, KL = { ...KLASSE, gis: 8 };
      if (!z.klaviatur.length || z.klaviatur.length > 2 || !z.klaviatur.every(([a, b]) => a in KL && b in KL && [1, 2].includes(Math.abs(KL[b] - KL[a])))) return null;
      svg.setAttribute("data-anzahl", z.klaviatur.length);
      const x0 = 62, w = 28, y0 = 30, tx = n => (n in SCHWARZ ? x0 + (SCHWARZ[n] + 1) * w - 8 + 8 : x0 + WEISS.indexOf(n) * w + w / 2);
      WEISS.forEach((n, i) => svg.appendChild(s("rect", { x: x0 + i * w, y: y0, width: w, height: 92, fill: "#ffffff", stroke: "#2d3047", "stroke-width": 1.2 })));
      Object.values(SCHWARZ).forEach(i => svg.appendChild(s("rect", { x: x0 + (i + 1) * w - 8, y: y0, width: 16, height: 60, fill: "#2d3047" })));
      z.klaviatur.forEach(([a, b], k) => {
        const ab = 0.2 + k * T * 0.45, g = s("g", { "data-stueck": `${a}-${b}` });
        for (const n of [a, b]) g.appendChild(erscheine(s("circle", { cx: tx(n), cy: n in SCHWARZ ? y0 + 50 : y0 + 80, r: 7, style: `fill:${n === a ? "var(--deko-4)" : GUT}` }), ab + (n === b ? 0.3 : 0), ruhig));
        const schritt = Math.abs(KL[b] - KL[a]) === 1 ? "½" : "1";
        g.appendChild(erscheine(text((tx(a) + tx(b)) / 2, y0 + 110, schritt, { gross: 13, farbe: schritt === "½" ? "#c25e12" : "var(--deko-6)" }), ab + 0.5, ruhig));
        svg.appendChild(g);
        if (klang && plane) [a, b].forEach((n, j) => plane(START + (ruhig ? 0 : ab + j * 0.3), () => klang([[hz(60 + KL[n]), 0.3]])));
      });
    } else {
      const namen = LEITERN[z.leiter];
      if (!namen) return null;
      const moll = z.leiter === z.leiter.toLowerCase(), MUSTER_HT = moll ? [2, 1, 2, 2, 1, 2, 2] : [2, 2, 1, 2, 2, 2, 1];
      const schritte = namen.slice(1).map((n, i) => (KLASSE[n] - KLASSE[namen[i]] + 12) % 12);
      if (schritte.join() !== MUSTER_HT.join()) return null;
      svg.setAttribute("data-anzahl", 8);
      svg.setAttribute("data-wert", z.leiter);
      const bw = 34, x0 = 24, unten = 138, halb = 6.5;
      let h = 16;
      const bloecke = namen.map((n, i) => { if (i) h += schritte[i - 1] * halb; return { n, x: x0 + i * bw, top: unten - h }; });
      const ab = (i, dauer) => 0.15 + ((z.richtung === "ab" ? 7 - i : i) * dauer) / 8;
      bloecke.forEach((b, i) => {
        const halbton = z.halbtoene && ((i < 7 && schritte[i] === 1) || (i > 0 && schritte[i - 1] === 1));
        const g = s("g", { "data-stueck": b.n }, s("rect", { x: b.x, y: b.top, width: bw - 2, height: unten - b.top, rx: 3, fill: halbton ? "#fff3c4" : "#ffffff",
          style: `stroke:${halbton ? "var(--deko-4)" : "var(--deko-6)"}`, "stroke-width": 1.6 }), text(b.x + bw / 2 - 1, b.top + 14, b.n, { gross: 11 }));
        svg.appendChild(erscheine(g, ab(i, T * 0.5), ruhig, 0.2));
        if (z.halbtoene && i < 7 && schritte[i] === 1) svg.appendChild(erscheine(text(b.x + bw - 1, b.top - 14, "½", { gross: 12, farbe: "#c25e12" }), T * 0.7, ruhig));
      });
      svg.appendChild(bildzeichen(150, 22, moll ? "🌧️" : "☀️", 18)); // über den unteren Stufen, nicht auf der Eule oben
      // die Eule steigt Stufe um Stufe
      const reihe = z.richtung === "ab" ? [...bloecke].reverse() : bloecke;
      let weg = `M${reihe[0].x + bw / 2},${reihe[0].top}`;
      for (let i = 1; i < 8; i++) weg += ` Q${(reihe[i - 1].x + reihe[i].x) / 2 + bw / 2},${Math.min(reihe[i - 1].top, reihe[i].top) - 12} ${reihe[i].x + bw / 2},${reihe[i].top}`;
      const ende = reihe[7];
      svg.appendChild(bewege(euleSitzend(0.22), weg, { x: ende.x + bw / 2, y: ende.top, winkel: 0 }, ruhig, { drehen: false, ab: 0.15, dauer: T }));
      // Ton der Stufe j: Grundton (Oktave über c′) plus die Schritte bis dahin
      if (klang && plane) reihe.forEach((_, i) => {
        const j = z.richtung === "ab" ? 7 - i : i, m = 60 + KLASSE[namen[0]] + MUSTER_HT.slice(0, j).reduce((a, x) => a + x, 0);
        plane(START + (ruhig ? 0 : 0.15 + (i * T) / 8), () => klang([[hz(m), 0.25]]));
      });
    }
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 44, ruhig));
    if (sterne >= 3) svg.appendChild(funken(50, 30, ruhig));
    return svg;
  }

  // ----- Roboter-Pfad (KARTE · roboter) -----
  const RICHTUNG_XY = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // 0 oben, 1 rechts, 2 unten, 3 links
  /** Roboter mit Blickrichtung (oranges Dreieck deko-3 wie im Spiel), Mitte 0,0. */
  const roboterFigur = c => s("g", { "data-figur": "roboter" }, bildzeichen(0, 0, "🤖", c * 0.7),
    s("path", { d: `M0,${-c * 0.5} l-${c * 0.14},${c * 0.16} h${c * 0.28} Z`, style: "fill:var(--deko-3)", class: "blick" }));
  /**
   * Das Programm der Stufe läuft im Raster wie im Spiel (4×4, 5×5, 6×6; Steine 🪨, Ziel ⭐): unten die Karten (⬆️ vor,
   * ↺ links, ↻ rechts, Wiederholung „n×“ deko-1, Bedingung „wenn frei“), der Roboter fährt, die Spur wird grün (--gut-hell).
   * Das Bild rechnet den Weg und gibt kein Bild, wenn er durch einen Stein oder aus dem Raster ginge; das Ziel liegt am
   * Ende des Wegs. Angabe: { raster, start: [x, y, Richtung], steine: [[x, y] …], programm: [Karte …] } mit Karte "V",
   * "L", "R", { mal: n, karten: [ … ] } oder { solange: n } (Wiederhole n-mal: wenn vorne frei vor, sonst links drehen).
   */
  function roboter(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.9;
    if (!z || ![4, 5, 6].includes(z.raster) || !Array.isArray(z.programm) || !Array.isArray(z.start)) return null;
    const n = z.raster, stein = new Set((z.steine || []).map(schluessel));
    let [x, y, r] = z.start;
    const pfad = [[x, y, r]], frei = (a, b) => a >= 0 && b >= 0 && a < n && b < n && !stein.has(`${a},${b}`);
    let ok = frei(x, y);
    const fuehre = k => {
      if (k === "V") { const [dx, dy] = RICHTUNG_XY[r]; if (!frei(x + dx, y + dy)) ok = false; else { x += dx; y += dy; } }
      else if (k === "L") r = (r + 3) % 4;
      else if (k === "R") r = (r + 1) % 4;
      else if (k && Number.isInteger(k.mal)) { for (let i = 0; i < k.mal; i++) k.karten.forEach(fuehre); return; }
      else if (k && Number.isInteger(k.solange)) {
        for (let i = 0; i < k.solange; i++) { const [dx, dy] = RICHTUNG_XY[r]; if (frei(x + dx, y + dy)) { x += dx; y += dy; } else r = (r + 3) % 4; pfad.push([x, y, r]); }
        return;
      } else ok = false;
      pfad.push([x, y, r]);
    };
    z.programm.forEach(fuehre);
    if (!ok || pfad.length < 2 || pfad.length > 40) return null;
    const svg = neuesBild("karte", stufe, { "data-bilder": "roboter", "data-wert": `${x},${y}` });
    svg.appendChild(tagGrund());
    const c = Math.min(22, 104 / n), x0 = 16, y0 = (HOEHE - n * c) / 2, mz = zelle(x0, y0, c);
    svg.append(s("rect", { x: x0, y: y0, width: n * c, height: n * c, fill: "#ffffff" }), gitter(x0, y0, n, n, c, "#8a8fa8"));
    for (const st of z.steine || []) svg.appendChild(bildzeichen(...mz(st), "🪨", c * 0.66));
    // Spur: Feld um Feld (nur die Fahrten, nicht die Drehungen am Ort)
    const felder = pfad.filter((p, i) => !i || p[0] !== pfad[i - 1][0] || p[1] !== pfad[i - 1][1]);
    const zeiten = ankunft(felder.map(p => mz(p)), T);
    felder.forEach((p, i) => svg.appendChild(erscheine(s("rect", { x: x0 + p[0] * c + 1, y: y0 + p[1] * c + 1, width: c - 2, height: c - 2, fill: "#c9f0d8" }), zeiten[i], ruhig, 0.15)));
    svg.appendChild(s("g", { "data-stueck": "ziel" }, bildzeichen(...mz([x, y]), "⭐", c * 0.66)));
    // der Roboter fährt die Felder ab und dreht sich, wohin er schaut
    const robo = roboterFigur(c);
    const weg = "M" + felder.map(p => mz(p).map(v => v.toFixed(1)).join(",")).join(" L");
    const aussen = s("g", {}, robo);
    if (ruhig) aussen.setAttribute("transform", `translate(${mz([x, y]).join(" ")})`);
    else {
      aussen.appendChild(s("animateMotion", { path: weg, begin: t(0), dur: `${T}s`, fill: "freeze" }));
      // Drehung zu den Zeitpunkten der Schritte (je Eintrag im Pfad gleich lang)
      const werte = pfad.map(p => p[2] * 90), keyTimes = pfad.map((_, i) => (i / (pfad.length - 1)).toFixed(3));
      robo.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", values: werte.join(";"), keyTimes: keyTimes.join(";"), calcMode: "discrete", begin: t(0), dur: `${T}s`, fill: "freeze" }));
    }
    if (ruhig) robo.setAttribute("transform", `rotate(${r * 90})`);
    svg.appendChild(aussen);
    // Karten rechts in Zeilen
    const karten = [];
    const karte = (k, tiefe = 0) => {
      if (typeof k === "string") karten.push({ z: { V: "⬆️", L: "↺", R: "↻" }[k], tiefe });
      else if (k.mal) { karten.push({ z: `${k.mal}×`, tiefe, block: true }); k.karten.forEach(q => karte(q, tiefe + 1)); }
      else karten.push({ z: `${k.solange}×`, tiefe, block: true }, { z: "❓", tiefe: tiefe + 1, wenn: true }, { z: "⬆️", tiefe: tiefe + 2 }, { z: "↺", tiefe: tiefe + 2 });
    };
    z.programm.forEach(q => karte(q));
    const kx = x0 + n * c + 18, kb = 20, proZeile = Math.floor((BREITE - kx - 8) / (kb + 4));
    karten.forEach((k, i) => {
      const xx = kx + (i % proZeile) * (kb + 4), yy = 20 + Math.floor(i / proZeile) * (kb + 6);
      const g = s("g", {}, s("rect", { x: xx, y: yy, width: kb, height: kb, rx: 4, fill: k.block ? "#f4eefc" : "#ffffff", style: `stroke:${k.block ? "var(--deko-1)" : "var(--deko-6)"}`, "stroke-width": 1.4 }),
        /[0-9]/.test(k.z) ? text(xx + kb / 2, yy + kb * 0.7, k.z, { gross: 10 }) : ["↺", "↻"].includes(k.z) ? text(xx + kb / 2, yy + kb * 0.72, k.z, { gross: 13 }) : bildzeichen(xx + kb / 2, yy + kb / 2, k.z, 12));
      svg.appendChild(erscheine(g, (i * 0.4) / karten.length, ruhig, 0.15));
    });
    svg.setAttribute("data-anzahl", 1);
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, HOEHE - 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(BREITE - 40, 112, ruhig)); // unter den Karten, nicht auf den Steinen am Ziel
    return svg;
  }

  // ----- Speicher-Leiter (BAUEN · speicher) -----
  // Dinge und Grössen des Spiels (Faktor 1000, wie im Spiel; Byte zu bit 8)
  const SPEICHER_DINGE = { "🔤": 1, "💬": 140, "📄": 2e3, "📕": 5e5, "📷": 3e6, "🎵": 4e6, "🎥": 1e8, "🍿": 2e9 };
  const STUFEN_SP = ["GB", "MB", "kB", "Byte", "bit"], FAKTOR = { GB: 1e9, MB: 1e6, kB: 1e3, Byte: 1, bit: 1 / 8 };
  const SP_FARBE = { GB: "var(--deko-1)", MB: "var(--deko-2)", kB: "var(--deko-3)", Byte: "var(--deko-4)", bit: "var(--deko-5)" };
  /**
   * dinge: Bildzeichen des Spiels ordnen sich nach Grösse (ohne Einheiten, Säulen mit dem Logarithmus der Grösse; s1);
   * bits: acht Lämpchen 0/1 werden ein Byte (s2); leiter: die Kästchen der Leiter wie im Spiel (GB → MB → kB … mit ×1000 und
   * ×8; s3); umrechnen: [Zahl, Einheit, Zahl, Einheit] — nachgerechnet (s4); karte: { gb, mb, bild } — so viele Stücke
   * passen auf die Speicherkarte (s5); laden: { mb, mbits } — die Datei kommt in mb·8 : mbits Sekunden (s6).
   */
  function speicher(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.85;
    if (!z) return null;
    const svg = neuesBild("bauen", stufe, { "data-bilder": "speicher" });
    svg.appendChild(tagGrund());
    const kaestchen = (x, y, e, b = 44) => s("g", {}, s("rect", { x, y, width: b, height: 24, rx: 5, style: `fill:${SP_FARBE[e]}` }), text(x + b / 2, y + 16.5, e, { gross: 11, farbe: "#ffffff" }));
    if (Array.isArray(z.dinge)) {
      if (z.dinge.length < 2 || z.dinge.length > 5 || !z.dinge.every(d => SPEICHER_DINGE[d])) return null;
      const sortiert = [...z.dinge].sort((a, b) => SPEICHER_DINGE[a] - SPEICHER_DINGE[b]);
      svg.setAttribute("data-anzahl", sortiert.length);
      sortiert.forEach((d, i) => {
        const x = 70 + (i * 200) / Math.max(1, sortiert.length - 1), h = 10 + Math.log10(SPEICHER_DINGE[d]) * 9, von = 70 + (z.dinge.indexOf(d) * 200) / Math.max(1, z.dinge.length - 1);
        const g = s("g", { "data-stueck": d }, s("rect", { x: x - 14, y: 128 - h, width: 28, height: h, rx: 3, style: "fill:var(--deko-2)", opacity: 0.85 }), bildzeichen(x, 128 - h - 14, d, 22));
        svg.appendChild(herein(g, von - x, 0, 0.2 + i * 0.15, ruhig, 0.7)); // von der gemischten Reihenfolge an den Platz nach Grösse
      });
      svg.appendChild(s("line", { x1: 30, y1: 128, x2: 300, y2: 128, stroke: "#2d3047", "stroke-width": 1.4 }));
    } else if (typeof z.bits === "string") {
      if (!/^[01]{8}$/.test(z.bits)) return null;
      svg.setAttribute("data-anzahl", 8);
      [...z.bits].forEach((b, i) => {
        const x = 36 + i * 30, an = b === "1", g = s("g", { "data-stueck": b }, s("circle", { cx: x, cy: 50, r: 11, fill: an ? "#f5b301" : "#c9cde0", stroke: "#2d3047", "stroke-width": 1 }),
          text(x, 80, b, { gross: 13 }));
        svg.appendChild(erscheine(g, 0.15 + (i * T * 0.6) / 8, ruhig, 0.15));
      });
      svg.append(erscheine(s("path", { d: "M24,92 Q160,112 296,92", fill: "none", stroke: "#8a8fa8", "stroke-width": 1.6 }), T * 0.7, ruhig),
        erscheine(s("g", {}, kaestchen(30, 110, "bit", 60), text(160, 127, "8 bit = 1 Byte", { gross: 12 }), kaestchen(230, 110, "Byte", 60)), T * 0.8, ruhig));
    } else if (Array.isArray(z.leiter)) {
      if (z.leiter.length < 2 || !z.leiter.every((e, i) => STUFEN_SP.includes(e) && (!i || STUFEN_SP.indexOf(e) === STUFEN_SP.indexOf(z.leiter[i - 1]) + 1))) return null;
      svg.setAttribute("data-anzahl", z.leiter.length);
      const b = 44, ab = 30, gesamt = z.leiter.length * b + (z.leiter.length - 1) * ab, x0 = BREITE / 2 - gesamt / 2;
      z.leiter.forEach((e, i) => {
        const x = x0 + i * (b + ab);
        svg.appendChild(s("g", { "data-stueck": e }, erscheine(kaestchen(x, 62, e, b), 0.15 + i * T * 0.2, ruhig)));
        if (i) svg.appendChild(erscheine(s("g", {}, text(x - ab / 2, 56, e === "bit" ? "×8" : "×1000", { gross: 9.5 }),
          s("path", { d: `M${x - ab + 4},74 h${ab - 8} m-4,-3 l4,3 l-4,3`, stroke: "#2d3047", "stroke-width": 1.4, fill: "none" })), 0.15 + i * T * 0.2, ruhig));
      });
    } else if (Array.isArray(z.umrechnen)) {
      const [a, ea, b, eb] = z.umrechnen;
      if (!(FAKTOR[ea] && FAKTOR[eb] && Math.abs(a * FAKTOR[ea] - b * FAKTOR[eb]) < 1e-9 * Math.max(1, a * FAKTOR[ea]))) return null;
      svg.setAttribute("data-anzahl", 2);
      svg.append(s("g", { "data-stueck": ea }, kaestchen(60, 40, ea), text(82, 92, ganzText(a), { gross: 18 })));
      svg.appendChild(erscheine(s("path", { d: "M120,52 h70 m-6,-5 l6,5 l-6,5", stroke: "#2d3047", "stroke-width": 1.6, fill: "none" }), 0.3, ruhig));
      svg.appendChild(erscheine(text(155, 44, FAKTOR[ea] / FAKTOR[eb] === 8 ? "×8" : `×${ganzText(FAKTOR[ea] / FAKTOR[eb])}`, { gross: 10 }), 0.3, ruhig));
      svg.appendChild(s("g", { "data-stueck": eb }, erscheine(s("g", {}, kaestchen(212, 40, eb), text(234, 92, ganzText(b), { gross: 18 })), T * 0.6, ruhig)));
      svg.appendChild(erscheine(text(160, 128, `${ganzText(a)} ${ea} = ${ganzText(b)} ${eb}`, { gross: 13 }), T, ruhig));
    } else if (z.karte) {
      const { gb, mb, bild } = z.karte;
      if (!(Number.isInteger(gb) && gb >= 1 && gb <= 64 && Number.isInteger(mb) && mb >= 2 && mb <= 500 && SPEICHER_DINGE[bild])) return null;
      const anzahl = Math.floor((gb * 1000) / mb);
      svg.setAttribute("data-wert", anzahl);
      svg.setAttribute("data-anzahl", 1);
      svg.append(s("path", { d: "M30,30 h60 l14,14 v84 h-74 Z", fill: "#2d3047" }), text(66, 70, `${gb} GB`, { gross: 13, farbe: "#ffffff" }));
      for (let i = 0; i < 4; i++) svg.appendChild(s("rect", { x: 40 + i * 14, y: 36, width: 8, height: 12, fill: "#e3b341" }));
      for (let i = 0; i < 12; i++) svg.appendChild(herein(bildzeichen(128 + (i % 6) * 28, 48 + Math.floor(i / 6) * 30, bild, 18), -70, 0, 0.15 + i * (T * 0.6) / 12, ruhig, 0.3));
      svg.append(s("g", { "data-stueck": "rechnung" }, erscheine(text(206, 128, `${ganzText(gb * 1000)} MB : ${ganzText(mb)} MB = ${ganzText(anzahl)}`, { gross: 12 }), T, ruhig)));
    } else if (z.laden) {
      const { mb, mbits } = z.laden, sek = (mb * 8) / mbits;
      if (!(Number.isInteger(mb) && mb > 0 && Number.isInteger(mbits) && mbits >= 2 && mbits <= 100 && Number.isInteger(sek))) return null;
      svg.setAttribute("data-wert", sek);
      svg.setAttribute("data-anzahl", 1);
      svg.append(bildzeichen(40, 52, "📶", 26), bildzeichen(280, 52, "📱", 26), s("rect", { x: 70, y: 46, width: 180, height: 14, rx: 7, fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 1.2 }));
      const balken = s("rect", { x: 70, y: 46, width: 180, height: 14, rx: 7, style: "fill:var(--deko-5)" });
      if (!ruhig) { balken.setAttribute("width", "0"); balken.appendChild(s("animate", { attributeName: "width", from: 0, to: 180, begin: t(0.15), dur: `${T * 0.8}s`, fill: "freeze" })); }
      svg.append(balken, s("g", { "data-stueck": "rechnung" }, erscheine(text(160, 98, `${ganzText(mb)} MB = ${ganzText(mb * 8)} Mbit`, { gross: 12 }), T * 0.5, ruhig),
        erscheine(text(160, 124, `${ganzText(mb * 8)} Mbit : ${mbits} Mbit/s = ${ganzText(sek)} s`, { gross: 12 }), T, ruhig)));
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(28, 132, ruhig));
    return svg;
  }

  // ----- Geheimschrift-Knacker (ZYKLUS · scheibe) -----
  const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const verschiebe = (w, k) => [...w].map(b => ABC[(ABC.indexOf(b) + k + 26) % 26]).join("");
  /**
   * Die Schlüsselscheibe wie im Spiel: aussen der Klartext, innen die Geheimbuchstaben (deko-1); die innere Scheibe dreht
   * um den Schlüssel der Stufe, dann wird das Wort Buchstabe für Buchstabe ver- oder entschlüsselt (Caesar über A–Z,
   * nach Z mit A weiter). knacken: zuerst passen andere Schlüssel nicht (✗), dann der richtige (s5, s6). Angabe:
   * { wort, schluessel (1–25), richtung: "ver" | "ent", knacken?: [falsche Schlüssel …] }.
   */
  function scheibe(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.9;
    if (!z || !/^[A-Z]{1,7}$/.test(z.wort || "") || !Number.isInteger(z.schluessel) || z.schluessel < 1 || z.schluessel > 25 || !["ver", "ent"].includes(z.richtung)) return null;
    const k = z.schluessel, klar = z.richtung === "ver" ? z.wort : verschiebe(z.wort, -k), geheim = verschiebe(klar, k);
    const svg = neuesBild("zyklus", stufe, { "data-bilder": "scheibe", "data-wert": `${klar}:${geheim}`, "data-anzahl": z.wort.length });
    svg.appendChild(tagGrund());
    const cx = 74, cy = 76, ra = 68, ri = 50;
    svg.append(s("circle", { cx, cy, r: ra, fill: "#fbf3dc", stroke: "#b89a6a", "stroke-width": 1.2 }));
    [...ABC].forEach((b, i) => { const w = ((i * 360) / 26 - 90) * Math.PI / 180; svg.appendChild(text(cx + Math.cos(w) * (ra - 9), cy + Math.sin(w) * (ra - 9) + 3.4, b, { gross: 9.5 })); });
    const innen = s("g", {}, s("circle", { cx, cy, r: ri, fill: "#ffffff", style: "stroke:var(--deko-1)", "stroke-width": 1.6 }));
    // innen steht unter jedem Klartext-Buchstaben sein Geheimbuchstabe: um k verschoben
    [...ABC].forEach((b, i) => { const w = ((i * 360) / 26 - 90) * Math.PI / 180; innen.appendChild(text(cx + Math.cos(w) * (ri - 9), cy + Math.sin(w) * (ri - 9) + 3.4, b, { gross: 9, farbe: "var(--deko-1)" })); });
    innen.appendChild(bildzeichen(cx, cy - 4, "🔑", 14));
    innen.appendChild(text(cx, cy + 16, k, { gross: 11, farbe: "var(--deko-1)" }));
    const winkel = (-k * 360) / 26, falsch = Array.isArray(z.knacken) ? z.knacken.filter(f => Number.isInteger(f) && f !== k && f >= 1 && f <= 25) : [];
    if (ruhig) innen.setAttribute("transform", `rotate(${winkel} ${cx} ${cy})`);
    else {
      const stationen = [0, ...falsch.map(f => (-f * 360) / 26), winkel];
      innen.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", values: stationen.map(w => `${w.toFixed(1)} ${cx} ${cy}`).join(";"),
        keyTimes: stationen.map((_, i) => (i / (stationen.length - 1)).toFixed(3)).join(";"), begin: t(0.1), dur: `${T * 0.5}s`, fill: "freeze" }));
    }
    svg.appendChild(innen);
    svg.appendChild(s("path", { d: `M${cx - 4},${cy - ra - 4} l4,8 l4,-8 Z`, fill: "#e5484d" }));
    // das Wort: oben Klartext, unten das Geheimwort (je nach Richtung von oben nach unten oder umgekehrt)
    const von = z.richtung === "ver" ? klar : geheim, nach = z.richtung === "ver" ? geheim : klar, bx = 168, b = Math.min(20, 140 / z.wort.length);
    falsch.forEach((f, i) => svg.appendChild(kurz(s("g", {}, text(bx + 62, 30, `${f}?`, { gross: 11 }), kreuz(bx + 84, 30, 11)), 0.1 + ((i + 1) * T * 0.5) / (falsch.length + 1), 0.1 + ((i + 2) * T * 0.5) / (falsch.length + 1), ruhig)));
    [...von].forEach((ch, i) => {
      const x = bx + i * b + b / 2;
      svg.appendChild(text(x, 64, ch, { gross: 15, farbe: z.richtung === "ver" ? "#2d3047" : "var(--deko-1)" }));
      svg.appendChild(s("g", { "data-stueck": nach[i] }, erscheine(text(x, 108, nach[i], { gross: 15, farbe: z.richtung === "ver" ? "var(--deko-1)" : "#2d3047" }), T * 0.55 + (i * T * 0.4) / z.wort.length, ruhig)));
      svg.appendChild(erscheine(s("path", { d: `M${x},72 v20 m-3,-4 l3,4 l3,-4`, stroke: "#8a8fa8", "stroke-width": 1.2, fill: "none" }), T * 0.55 + (i * T * 0.4) / z.wort.length, ruhig));
    });
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(240, 26, ruhig)); // über dem Wort, nicht auf den Buchstaben
    return svg;
  }

  // ----- Datei-Typen (SAMMELN · dateien) -----
  const ENDUNG_ART = { txt: 0, docx: 0, pdf: 0, jpg: 1, jpeg: 1, png: 1, gif: 1, bmp: 1, mp3: 2, wav: 2, m4a: 2, mp4: 3, mov: 3, avi: 3 };
  const DATEI_KORB = [["📄", "var(--deko-1)"], ["🖼️", "var(--deko-2)"], ["🎵", "var(--deko-3)"], ["🎬", "var(--deko-4)"]];
  const DINGE_ART = { "✉️": 0, "📷": 1, "🎵": 2 };
  const PROGRAMM = { txt: "🗒️", docx: "📝", pdf: "📕", jpg: "🖼️", png: "🖼️", mp3: "🎧", mp4: "📺", mov: "📽️", pptx: "📽️", xlsx: "📊", zip: "📦", html: "🌐" };
  const DATEI_GROESSE = { "txt": [2, "kB"], "jpg": [3, "MB"], "mp3": [4, "MB"], "mp4-video": [100, "MB"], "mp4-film": [2, "GB"] };
  /**
   * Körbe Text, Bild, Ton, Video (Farben des Spiels); dinge: Bildzeichen ✉️ 📷 🎵 in drei Körbe (s1); endungen: Dateien
   * mit ihrer Endung (orange wie im Spiel) in ihren Korb (s2, s3), falle: der Name sagt etwas anderes (🎵 durchgestrichen,
   * .jpg ist ein Bild; s6). programme: Endung → Programm (s4). groessen: drei Dateien als Stapel, die grösste oben mit Haken
   * (s5). Angabe je nach Stufe.
   */
  function dateien(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.8;
    if (!z) return null;
    if (Array.isArray(z.dinge) || Array.isArray(z.endungen)) {
      const dinge = [];
      for (const d of z.dinge || []) { if (!(d in DINGE_ART)) return null; dinge.push({ bild: d, korb: DINGE_ART[d] }); }
      for (const e of z.endungen || []) {
        const [endung, name] = Array.isArray(e) ? e : [e, null];
        if (!(endung in ENDUNG_ART)) return null;
        dinge.push({ text: `.${endung}`, korb: ENDUNG_ART[endung], ...(name ? { bild: name } : {}) });
      }
      if (!dinge.length || dinge.length > 8) return null;
      const k = z.dinge ? 3 : 4;
      const svg = korbBild(stufe, "dateien", { koerbe: DATEI_KORB.slice(0, k).map(([b, f]) => ({ zeichen: b, bild: b, farbe: f })), dinge }, sterne, ruhig);
      // ein Name, der täuscht: durchgestrichen
      if (svg && (z.endungen || []).some(Array.isArray)) svg.querySelectorAll("[data-stueck]").forEach(g => {
        const bild = g.querySelector("text"), tx = g.querySelectorAll("text")[1];
        if (bild && tx && /^\./.test(tx.textContent)) g.appendChild(s("line", { x1: Number(bild.getAttribute("x")) - 8, y1: Number(bild.getAttribute("y")) - 12, x2: Number(bild.getAttribute("x")) + 8, y2: Number(bild.getAttribute("y")) + 2, stroke: "#e5484d", "stroke-width": 2 }));
      });
      return svg;
    }
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "dateien" });
    svg.appendChild(tagGrund());
    if (Array.isArray(z.programme)) {
      if (!z.programme.length || z.programme.length > 4 || !z.programme.every(e => PROGRAMM[e])) return null;
      svg.setAttribute("data-anzahl", z.programme.length);
      z.programme.forEach((e, i) => {
        const y = 22 + i * (112 / z.programme.length) + (4 - z.programme.length) * 7, ab = 0.15 + (i * T) / z.programme.length;
        svg.appendChild(s("g", { "data-stueck": e }, s("rect", { x: 60, y: y - 11, width: 70, height: 22, rx: 4, fill: "#ffffff", stroke: "#8a8fa8", "stroke-width": 1.2 }),
          text(95, y + 5, `.${e}`, { gross: 12, farbe: "#c25e12" }),
          erscheine(s("path", { d: `M138,${y} h60 m-6,-5 l6,5 l-6,5`, stroke: "#8a8fa8", "stroke-width": 1.6, fill: "none" }), ab, ruhig),
          herein(bildzeichen(226, y, PROGRAMM[e], 20), 30, 0, ab + 0.2, ruhig, 0.3)));
      });
    } else if (Array.isArray(z.groessen)) {
      if (z.groessen.length !== 3 || !z.groessen.every(g => DATEI_GROESSE[g])) return null;
      const bytes = g => DATEI_GROESSE[g][0] * { kB: 1e3, MB: 1e6, GB: 1e9 }[DATEI_GROESSE[g][1]], gross = z.groessen.reduce((a, g) => (bytes(g) > bytes(a) ? g : a));
      svg.setAttribute("data-wert", gross);
      svg.setAttribute("data-anzahl", 3);
      z.groessen.forEach((g, i) => {
        const x = 70 + i * 90, h = 6 + Math.log10(bytes(g)) * 8, [zahl, einheit] = DATEI_GROESSE[g], endung = g.split("-")[0];
        const stapel = s("g", { "data-stueck": g }, s("rect", { x: x - 24, y: 116 - h, width: 48, height: h, rx: 3, style: `fill:${DATEI_KORB[ENDUNG_ART[endung]][1]}`, opacity: 0.85 }),
          text(x, 132, `.${endung}`, { gross: 11, farbe: "#c25e12" }), text(x, 110 - h, `${zahl} ${einheit}`, { gross: 11 }));
        svg.appendChild(vonOben(stapel, 0.15 + i * T * 0.3, ruhig, 40));
        if (g === gross) svg.appendChild(erscheine(haken(x + 30, 96 - h, 15), T, ruhig));
      });
    } else return null;
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(28, 30, ruhig));
    return svg;
  }

  // ----- Stein-Duell (SAMMELN · nim) -----
  /**
   * Nim wie im Spiel: eine bis drei Reihen grauer Steine; abwechselnd nehmen das Kind (Rand deko-6) und die Eule (🦉) —
   * genommene Steine werden blass und klein. Das Kind spielt richtig (eine Reihe mit höchstens max: es lässt ein Vielfaches
   * von max + 1; mehrere Reihen: es macht die Summe ohne Übertrag, XOR, zu null), die Eule nimmt einen Stein aus der
   * längsten Reihe. Wer den letzten nimmt, gewinnt: das Kind, sonst gibt das Bild keines. eule: die Eule beginnt (s4, wenn
   * die Zahl schon ein Vielfaches ist). Angabe: { reihen: [n …], max?, eule? }.
   */
  function nim(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.95;
    if (!z || !Array.isArray(z.reihen) || !z.reihen.length || z.reihen.length > 3 || !z.reihen.every(n => Number.isInteger(n) && n >= 1 && n <= 25)) return null;
    if (z.reihen.length === 1 && !(Number.isInteger(z.max) && z.max >= 2 && z.max <= 5)) return null;
    const reihen = [...z.reihen], zuege = [];
    let kind = !z.eule;
    while (reihen.some(n => n > 0) && zuege.length < 30) {
      let r, n;
      if (kind) {
        if (reihen.length === 1) { r = 0; n = reihen[0] % (z.max + 1); }
        else {
          const x = reihen.reduce((a, b) => a ^ b, 0);
          r = reihen.findIndex(q => (q ^ x) < q); n = r >= 0 ? reihen[r] - (reihen[r] ^ x) : 0;
        }
        if (!n || r < 0) return null; // das Kind stünde auf Verlust
      } else {
        r = reihen.indexOf(Math.max(...reihen)); n = 1;
      }
      zuege.push({ kind, r, von: reihen[r] - n, n });
      reihen[r] -= n;
      kind = !kind;
    }
    if (!zuege.length || !zuege[zuege.length - 1].kind) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "nim", "data-anzahl": z.reihen.reduce((a, b) => a + b, 0) });
    svg.appendChild(tagGrund());
    // Reihen bis vor den Pokal rechts
    const R = Math.min(7, 226 / (Math.max(...z.reihen) * 2.4)), dx = R * 2.4, zh = Math.min(40, 118 / z.reihen.length), je = T / zuege.length;
    const stein = z.reihen.map((n, r) => [...Array(n).keys()].map(i => {
      const x = 40 + R + i * dx, y = 20 + (130 - z.reihen.length * zh) / 2 + r * zh + zh / 2;
      return s("circle", { cx: x, cy: y, r: R, style: "fill:var(--deko-7)", "data-stueck": "stein" });
    }));
    stein.forEach((reihe, r) => { if (z.reihen.length > 1) svg.appendChild(text(22, Number(reihe[0].getAttribute("cy")) + 4, r + 1, { gross: 11, farbe: "var(--deko-1)" })); reihe.forEach(c => svg.appendChild(c)); });
    zuege.forEach((zg, k) => {
      const ab = 0.15 + k * je;
      for (let i = zg.von; i < zg.von + zg.n; i++) {
        const c = stein[zg.r][i];
        c.setAttribute("stroke", zg.kind ? "var(--deko-6)" : "#8e6b4f");
        c.setAttribute("stroke-width", "2");
        if (ruhig) c.setAttribute("fill-opacity", "0.15");
        else c.append(s("animate", { attributeName: "fill-opacity", from: 1, to: 0.15, begin: t(ab), dur: "0.3s", fill: "freeze" }),
          s("animate", { attributeName: "r", from: R, to: R * 0.6, begin: t(ab), dur: "0.3s", fill: "freeze" }));
        if (ruhig) c.setAttribute("r", String(R * 0.6));
      }
      const c0 = stein[zg.r][zg.von];
      svg.appendChild(kurz(bildzeichen(Number(c0.getAttribute("cx")), Number(c0.getAttribute("cy")) - R - 9, zg.kind ? "👆" : "🦉", 12), ab, ab + je, ruhig));
    });
    svg.appendChild(erscheine(bildzeichen(292, 76, "🏆", 26), T + 0.1, ruhig));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(292, 76, ruhig));
    return svg;
  }

  // ----- Steine fangen (SAMMELN · atari) -----
  /**
   * Atari-Go wie im Spiel (Holz, Schwarz = du, Weiss = die Eule): die Züge der Stufe werden gespielt, eine weisse Gruppe
   * ohne Freiheit wird gefangen und rollt in die Schale (nachgerechnet; ohne Fang kein Bild, ausser freiheiten oder
   * retten). freiheiten: die freien Nachbarpunkte des weissen Steins leuchten (s1); retten: die schwarze Gruppe im Atari
   * verlängert und hat danach so viele Freiheiten (s4); falle: ein Zug, der nicht geht, erscheint zuerst blass mit ✗ (s6).
   * Angabe: { brett, weiss: [[x, y] …], schwarz: [[x, y] …], zuege: [["s" | "w", x, y] …], freiheiten?, retten?, falle? }.
   */
  function atari(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.9;
    if (!z || !(z.brett >= 5 && z.brett <= 9)) return null;
    const n = z.brett, feld = new Map(), key = (x, y) => `${x},${y}`, im = (x, y) => x >= 0 && y >= 0 && x < n && y < n;
    for (const [x, y] of z.weiss || []) feld.set(key(x, y), "w");
    for (const [x, y] of z.schwarz || []) { if (feld.has(key(x, y))) return null; feld.set(key(x, y), "s"); }
    const nachbarn = (x, y) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].filter(([a, b]) => im(a, b));
    function gruppe(x, y) {
      const f = feld.get(key(x, y)), g = [[x, y]], ges = new Set([key(x, y)]), frei = new Set();
      for (let i = 0; i < g.length; i++) for (const [a, b] of nachbarn(...g[i])) {
        const v = feld.get(key(a, b));
        if (!v) frei.add(key(a, b)); else if (v === f && !ges.has(key(a, b))) { ges.add(key(a, b)); g.push([a, b]); }
      }
      return { g, frei };
    }
    const gefangen = [], ereignisse = [];
    for (const [farbe, x, y] of z.zuege || []) {
      if (!im(x, y) || feld.has(key(x, y)) || !["s", "w"].includes(farbe)) return null;
      feld.set(key(x, y), farbe);
      const weg = [];
      for (const [a, b] of nachbarn(x, y)) {
        if (feld.get(key(a, b)) && feld.get(key(a, b)) !== farbe && !gruppe(a, b).frei.size) for (const p of gruppe(a, b).g) { weg.push(p); }
      }
      for (const p of weg) feld.delete(key(...p));
      if (!weg.length && !gruppe(x, y).frei.size) return null; // Selbstmord ist verboten
      ereignisse.push({ farbe, x, y, weg });
      if (farbe === "s") gefangen.push(...weg);
    }
    const zielW = z.freiheiten ? (z.weiss || [])[0] : null, retten = z.retten ? ereignisse[ereignisse.length - 1] : null;
    if (z.freiheiten && !zielW) return null;
    if (!z.freiheiten && !z.retten && !gefangen.length) return null;
    if (z.retten && !(retten && retten.farbe === "s" && gruppe(retten.x, retten.y).frei.size >= 2)) return null;
    const svg = neuesBild("sammeln", stufe, { "data-bilder": "atari" });
    svg.appendChild(tagGrund());
    const c = Math.min(16, 128 / n), x0 = 20 + c / 2, y0 = (HOEHE - (n - 1) * c) / 2, P = (x, y) => [x0 + x * c, y0 + (n - 1 - y) * c]; // y von unten wie im Spiel
    svg.appendChild(s("rect", { x: x0 - c * 0.7, y: y0 - c * 0.7, width: (n - 1) * c + c * 1.4, height: (n - 1) * c + c * 1.4, rx: 4, fill: "#e8c88c" }));
    let d = "";
    for (let i = 0; i < n; i++) d += `M${x0 + i * c},${y0} v${(n - 1) * c} M${x0},${y0 + i * c} h${(n - 1) * c} `;
    svg.appendChild(s("path", { d, stroke: "#6b5235", "stroke-width": 0.9 }));
    const steinBild = (x, y, f, attr = {}) => s("circle", { cx: P(x, y)[0], cy: P(x, y)[1], r: c * 0.44, fill: f === "s" ? "#23263a" : "#ffffff", stroke: f === "s" ? "#23263a" : "#6b6f8a", "stroke-width": 1, ...attr });
    const steine = new Map();
    for (const [x, y] of z.weiss || []) { const e = steinBild(x, y, "w"); steine.set(key(x, y), e); svg.appendChild(e); }
    for (const [x, y] of z.schwarz || []) svg.appendChild(steinBild(x, y, "s"));
    // Schale rechts für die Gefangenen
    const sx = 262, sy = 104;
    svg.append(s("ellipse", { cx: sx, cy: sy, rx: 40, ry: 16, fill: "#a8743f" }), s("ellipse", { cx: sx, cy: sy - 4, rx: 34, ry: 11, fill: "#7a4f26" }));
    const je = T / Math.max(1, ereignisse.length + (z.falle ? 1 : 0));
    let k = 0;
    if (z.falle) {
      const [x, y] = z.falle;
      if (!im(x, y) || feld.has(key(x, y)) && !ereignisse.length) return null;
      svg.appendChild(kurz(s("g", {}, steinBild(x, y, "s", { opacity: 0.4 }), kreuz(P(x, y)[0] + c * 0.6, P(x, y)[1] - c * 0.4, 11)), 0.15, 0.15 + je * 0.9, ruhig));
      k++;
    }
    let inSchale = 0;
    ereignisse.forEach(ev => {
      const ab = 0.15 + k++ * je, e = steinBild(ev.x, ev.y, ev.farbe);
      svg.appendChild(vonOben(e, ab, ruhig, 16, 0.25));
      steine.set(key(ev.x, ev.y), e);
      for (const p of ev.weg) {
        const alt = steine.get(key(...p)), [px, py] = P(...p), ziel = [sx - 16 + (inSchale % 4) * 10, sy - 6 - Math.floor(inSchale / 4) * 5];
        inSchale++;
        // der gefangene Stein rollt in die Schale (bleibt auf dem Brett unsichtbar zurück)
        if (alt) svg.appendChild(verschwinde(alt, ab + 0.3, ruhig, 0.1));
        const roll = s("g", { "data-stueck": "gefangen" }, s("circle", { cx: 0, cy: 0, r: c * 0.4, fill: ev.farbe === "s" ? "#ffffff" : "#23263a", stroke: "#6b6f8a", "stroke-width": 1 }));
        svg.appendChild(bewege(roll, `M${px},${py} Q${(px + ziel[0]) / 2},${Math.min(py, ziel[1]) - 30} ${ziel[0]},${ziel[1]}`, { x: ziel[0], y: ziel[1], winkel: 0 }, ruhig, { drehen: false, ab: ab + 0.3, dauer: 0.6 }));
      }
    });
    svg.setAttribute("data-anzahl", gefangen.length);
    if (zielW) {
      const { frei } = gruppe(...zielW);
      svg.setAttribute("data-wert", frei.size);
      [...frei].forEach((p, i) => { const [a, b] = p.split(",").map(Number); svg.appendChild(erscheine(s("circle", { cx: P(a, b)[0], cy: P(a, b)[1], r: c * 0.22, fill: GUT }), 0.3 + i * 0.3, ruhig)); });
      svg.appendChild(erscheine(text(sx, 68, frei.size, { gross: 26, farbe: GUT }), T, ruhig));
    }
    if (retten) {
      const { frei } = gruppe(retten.x, retten.y);
      svg.setAttribute("data-wert", frei.size);
      [...frei].forEach((p, i) => { const [a, b] = p.split(",").map(Number); svg.appendChild(erscheine(s("circle", { cx: P(a, b)[0], cy: P(a, b)[1], r: c * 0.22, fill: GUT }), T * 0.6 + i * 0.15, ruhig)); });
    }
    svg.appendChild(text(sx, 140, "⚫ ⚪", { gross: 10 }));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(sx, 26, ruhig));
    return svg;
  }

  // ----- König in der Falle (REISE · schach) -----
  const FIGUR = { K: "♚︎", D: "♛︎", T: "♜︎", L: "♝︎", S: "♞︎", B: "♟︎" };
  /**
   * Matt-Rätsel wie im Spiel (8×8, helle und dunkle Felder des Spiels, Weiss am Zug): die Züge der Stufe werden gespielt;
   * am Ende steht der schwarze König im Schach (rot umrandet wie --hinweis) und kann auf kein Feld ziehen, das nicht
   * besetzt oder angegriffen ist — das rechnet das Bild nach (ohne Gegenzug-Schlagen, das die Stellungen des Spiels
   * ausschliessen); er kippt um. Felder „e4“. Angabe: { weiss: { e1: "K", … }, schwarz: { … }, zuege: [["h1", "h8"] …] }.
   */
  function schach(feier, { stufe, sterne, ruhig }) {
    const z = feier.ziele?.[stufe], T = DAUER * 0.9;
    if (!z || !z.weiss || !z.schwarz || !Array.isArray(z.zuege) || !z.zuege.length || z.zuege.length > 3) return null;
    const pos = f => /^[a-h][1-8]$/.test(f) ? [f.charCodeAt(0) - 97, Number(f[1]) - 1] : null;
    const brett = new Map();
    for (const [f, fig] of Object.entries(z.weiss)) { if (!pos(f) || !FIGUR[fig]) return null; brett.set(f, ["w", fig]); }
    for (const [f, fig] of Object.entries(z.schwarz)) { if (!pos(f) || !FIGUR[fig] || brett.has(f)) return null; brett.set(f, ["s", fig]); }
    const name = ([x, y]) => String.fromCharCode(97 + x) + (y + 1);
    const frei = (a, b) => { const [x1, y1] = pos(a), [x2, y2] = pos(b), dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1); for (let x = x1 + dx, y = y1 + dy; x !== x2 || y !== y2; x += dx, y += dy) if (brett.has(name([x, y]))) return false; return true; };
    /** Greift die Figur auf a das Feld b an (Gangart und freier Weg)? */
    function greift(a, b) {
      const [farbe, fig] = brett.get(a), [x1, y1] = pos(a), [x2, y2] = pos(b), dx = x2 - x1, dy = y2 - y1, ax = Math.abs(dx), ay = Math.abs(dy);
      if (!ax && !ay) return false;
      if (fig === "K") return ax <= 1 && ay <= 1;
      if (fig === "S") return (ax === 1 && ay === 2) || (ax === 2 && ay === 1);
      if (fig === "T") return (!ax || !ay) && frei(a, b);
      if (fig === "L") return ax === ay && frei(a, b);
      if (fig === "D") return (!ax || !ay || ax === ay) && frei(a, b);
      if (fig === "B") return ax === 1 && dy === (farbe === "w" ? 1 : -1);
      return false;
    }
    const angegriffen = (f, von) => [...brett].some(([a, [farbe]]) => farbe === von && a !== f && greift(a, f));
    const ablauf = [];
    for (const [a, b] of z.zuege) {
      if (!brett.has(a) || !pos(b) || (brett.get(b) && brett.get(b)[0] === brett.get(a)[0])) return null;
      const fig = brett.get(a), geschlagen = brett.get(b);
      // Zug nach der Gangart (geschlagen werden darf, was dort steht)
      if (!(greift(a, b) || (fig[1] === "B" && !geschlagen && pos(a)[0] === pos(b)[0] && pos(b)[1] - pos(a)[1] === (fig[0] === "w" ? 1 : -1)))) return null;
      brett.delete(a); brett.set(b, fig);
      ablauf.push({ a, b, fig, geschlagen });
    }
    // Matt: der schwarze König steht im Schach, und jedes Nachbarfeld ist besetzt (von Schwarz) oder angegriffen
    const k = [...brett].find(([, [f, fig]]) => f === "s" && fig === "K")?.[0];
    if (!k || !angegriffen(k, "w")) return null;
    const [kx, ky] = pos(k);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const x = kx + dx, y = ky + dy;
      if ((!dx && !dy) || x < 0 || y < 0 || x > 7 || y > 7) continue;
      const f = name([x, y]), da = brett.get(f);
      if (da && da[0] === "s") continue;
      const sicher = (() => { const alt = brett.get(f); brett.delete(k); brett.set(f, ["s", "K"]); const an = angegriffen(f, "w"); brett.delete(f); if (alt) brett.set(f, alt); brett.set(k, ["s", "K"]); return !an; })();
      if (sicher) return null;
    }
    const svg = neuesBild("reise", stufe, { "data-bilder": "schach", "data-wert": k, "data-anzahl": 1 });
    svg.appendChild(tagGrund());
    const c = 16, x0 = 18, y0 = 11, P = f => { const [x, y] = pos(f); return [x0 + x * c + c / 2, y0 + (7 - y) * c + c / 2]; };
    for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) svg.appendChild(s("rect", { x: x0 + x * c, y: y0 + (7 - y) * c, width: c, height: c, fill: (x + y) % 2 ? "#f3e3c3" : "#c49a6c" }));
    const figurBild = (f, [farbe, fig]) => s("text", { x: P(f)[0], y: P(f)[1] + 5.8, "font-size": 17, "text-anchor": "middle", "font-family": "\"Segoe UI Symbol\", \"DejaVu Sans\", serif",
      fill: farbe === "w" ? "#ffffff" : "#2d3047", stroke: farbe === "w" ? "#2d3047" : "none", "stroke-width": 0.8 }, FIGUR[fig]);
    // Ausgangsstellung zeichnen, dann die Züge
    const start = new Map([...Object.entries(z.weiss).map(([f, fig]) => [f, ["w", fig]]), ...Object.entries(z.schwarz).map(([f, fig]) => [f, ["s", fig]])]);
    const bilder = new Map();
    for (const [f, v] of start) { const e = s("g", {}, figurBild(f, v)); bilder.set(f, e); svg.appendChild(e); }
    const je = (T * 0.7) / ablauf.length;
    ablauf.forEach((zg, i) => {
      const ab = 0.25 + i * je, e = bilder.get(zg.a), [ax, ay] = P(zg.a), [bx, by] = P(zg.b);
      if (zg.geschlagen) svg.appendChild(verschwinde(bilder.get(zg.b), ab + 0.35, ruhig, 0.1));
      svg.appendChild(schiebe(e, bx - ax, by - ay, ab, ruhig, { dauer: 0.4 }));
      bilder.delete(zg.a); bilder.set(zg.b, e);
      svg.appendChild(erscheine(s("rect", { x: bx - c / 2, y: by - c / 2, width: c, height: c, fill: "none", stroke: zg.fig[0] === "w" ? GUT : "var(--deko-6)", "stroke-width": 2 }), ab + 0.4, ruhig));
    });
    // der König im Matt: rot umrandet, kippt um
    const [kpx, kpy] = P(k), konig = bilder.get(k);
    svg.appendChild(erscheine(s("rect", { x: kpx - c / 2, y: kpy - c / 2, width: c, height: c, fill: "none", stroke: HINWEIS, "stroke-width": 2.4 }), T * 0.8, ruhig));
    if (ruhig) konig.setAttribute("transform", `rotate(70 ${kpx} ${kpy + 5})`);
    else konig.appendChild(s("animateTransform", { attributeName: "transform", type: "rotate", from: `0 ${kpx} ${kpy + 5}`, to: `70 ${kpx} ${kpy + 5}`, begin: t(T * 0.85), dur: "0.4s", fill: "freeze" }));
    svg.appendChild(s("g", { "data-stueck": "matt" }, erscheine(text(230, 82, "#", { gross: 40, farbe: GUT }), T, ruhig)));
    if (sterne >= 2) svg.appendChild(glanz(BREITE - 12, 14, ruhig));
    if (sterne >= 3) svg.appendChild(funken(230, 30, ruhig)); // über dem Zeichen #, nicht darauf
    return svg;
  }

  Object.assign(BILDER.auftritt, { hoerbild, wetterbericht, gespraech, bestellung, notennamen, rhythmus, klangwichtel });
  Object.assign(BILDER.sammeln, { themenkarten, wortzwillinge, lautkoerbe, artikel, laute, dateien, nim, atari });
  Object.assign(BILDER.bauen, { buchstaben, wortzug, bruecke, diktat, tonleiter, speicher });
  Object.assign(BILDER.reise, { rallye, melodie, schach });
  Object.assign(BILDER.zyklus, { uhren, kalenderfr, scheibe });
  Object.assign(BILDER.karte, { roboter });

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
    zyklus(feier, opt) {
      if (feier.bilder && BILDER.zyklus?.[feier.bilder]) return BILDER.zyklus[feier.bilder](feier, opt);
      const { stufe, sterne, ruhig } = opt;
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
    wachsen(feier, opt) {
      if (feier.bilder && BILDER.wachsen?.[feier.bilder]) return BILDER.wachsen[feier.bilder](feier, opt);
      const { stufe, sterne, ruhig } = opt;
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
    auftritt(feier, opt) {
      if (feier.bilder && BILDER.auftritt?.[feier.bilder]) return BILDER.auftritt[feier.bilder](feier, opt);
      const { stufe, sterne, ruhig, klang, plane } = opt;
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
    karte(feier, opt) {
      if (feier.bilder && BILDER.karte?.[feier.bilder]) return BILDER.karte[feier.bilder](feier, opt);
      const { stufe, sterne, ruhig } = opt;
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
