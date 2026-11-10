/* Abschluss-Animationen (docs/konzept_abschluss_animationen.md; Entscheide AN1 a, AN2 a, AN3 a, LERN_Session27).

   Ein Spiel beschreibt seine Animation in LS.spiel({ …, feier: { muster, … } }) und lädt diese Datei nach spiel.js. Der
   Rahmen spielt sie im Schlussbild ab (LS_FEIER.zeige), wenn die Einstellung „Abschluss-Animation“ an ist; ohne feier
   oder ohne diese Datei bleibt das bisherige Schlussbild mit Konfetti.

   Regeln (Konzept, Abschnitt 3): fachlich treu, 2–4 Sekunden, ein Tippen springt ans Ende, „Bewegung reduzieren“ des
   Geräts zeigt gleich das Schlussbild, nie strafend (1 Stern bekommt die Animation der Stufe, mehr Sterne schmücken aus:
   Schmuck der Stufe 2 und 3, data-schmuck="2"/"3"), ohne Text ausser Zahlen, die zum Inhalt gehören, SVG ohne
   Bibliothek. Die Animation ist Schmuck (aria-hidden); die Knöpfe des Schlussbilds sind sofort bedienbar.

   Muster (Konzept, Abschnitt 5). Gebaut: REISE, ZOOM, ZYKLUS, SZENE. Folgen: WACHSEN, BAUEN, AUFTRITT, SAMMELN, KARTE.
   Eine Stufe darf ein anderes Muster nehmen: ziele.sX = { muster: "…", ziel: …, … } (Himmels-Forscher s5, s6).

   REISE  { muster: "reise", reisender: "rakete" | "sonde", ziele: { s1 … s6 } } — je Stufe ein Ziel:
            "mond", "mars", "jupiter", "saturn" (von der Erde dorthin), { um: "erde" } (einmal herum),
            { rand: true } (an den acht Planeten vorbei bis an den Rand des Sonnensystems)
   ZOOM   { muster: "zoom", ziele: { s1: 4, s2: 4.6, … } } — Landung auf dem Zahlenstrahl; je Stelle nach dem Komma eine
            Zeile tiefer, wie unter einer Lupe (stellen: { sX: n } überschreibt die Zahl der Stellen)
   ZYKLUS { muster: "zyklus", bilder: "mond", ziele: { s1: ["neu"], … } } — die Phasen der Reihe nach bis zur Phase der
            Stufe; Mond zunehmend, rechts beleuchtet (Sicht von der Nordhalbkugel)
   SZENE  { muster: "szene", szene: "eule-vollmond" } */
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

  /** Fähnchen (Schmuck ab 2 Sternen), erscheint nach der Bewegung. */
  function fahne(x, y, ruhig) {
    return erscheine(s("g", { "data-schmuck": "2" },
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
    const g = s("g", { "data-schmuck": "3" });
    const strich = s("line", { x1: 250, y1: 14, x2: 214, y2: 32, stroke: "#ffffff", "stroke-width": 1.6, "stroke-linecap": "round" });
    g.appendChild(strich);
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
  function bewege(figur, weg, ende, ruhig, { drehen = true } = {}) {
    if (ruhig) {
      figur.setAttribute("transform", `translate(${ende.x} ${ende.y}) rotate(${ende.winkel})`);
      return figur;
    }
    figur.appendChild(s("animateMotion", { path: weg, begin: t(0), dur: `${DAUER}s`, ...(drehen ? { rotate: "auto" } : {}), fill: "freeze",
      calcMode: "spline", keyTimes: "0;1", keySplines: "0.4 0 0.3 1" }));
    // vor dem Start noch nicht im Bild (sonst stünde die Figur kurz bei 0,0)
    figur.setAttribute("opacity", "0");
    figur.appendChild(s("set", { attributeName: "opacity", to: 1, begin: t(0), fill: "freeze" }));
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

  // ---------- Muster ----------
  const MUSTER = {
    /** REISE (Konzept 5): je Stufe ein Ziel weiter. */
    reise(feier, { stufe, sterne, ruhig }) {
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
    zoom(feier, { stufe, sterne, ruhig }) {
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
      // Rakete senkrecht nach unten auf den Landeplatz (Spitze auf der Linie)
      const landeY = zeileY(stellen) - 24;
      const r = rakete(sterne >= 3);
      svg.appendChild(bewege(r, `M${landeX},-30 L${landeX},${landeY}`, { x: landeX, y: landeY, winkel: 90 }, ruhig));
      if (sterne >= 2) svg.appendChild(fahne(Math.min(landeX + 14, BREITE - 16), zeileY(stellen) - 2, ruhig));
      if (sterne >= 3) svg.appendChild(funken(Math.min(Math.max(landeX, 24), BREITE - 24), Math.max(landeY - 4, 20), ruhig));
      return svg;
    },

    /** ZYKLUS (Konzept 5): die Phasen der Reihe nach bis zur Phase der Stufe; die letzte gross. */
    zyklus(feier, { stufe, sterne, ruhig }) {
      const phasen = feier.ziele?.[stufe];
      if (!Array.isArray(phasen) || !phasen.length || feier.bilder !== "mond") return null;
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
  };

  /** Soll das Gerät keine Bewegung zeigen (Einstellung „Bewegung reduzieren“)? */
  const bewegungReduziert = () => typeof matchMedia === "function" && !!matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Animation fürs Schlussbild: feier aus LS.spiel, stufe "s1"…"s6", sterne 1–3. → <div class="feier"> oder null (kein
   * Muster, keine Angabe für die Stufe). Eine Stufe mit eigenem Muster ({ muster, ziel, … }) nimmt dieses. Ein Tippen
   * springt ans Ende.
   */
  function zeige(feier, { stufe, sterne, ruhig = bewegungReduziert() } = {}) {
    let f = feier;
    const eigen = feier?.ziele?.[stufe];
    if (eigen && typeof eigen === "object" && !Array.isArray(eigen) && eigen.muster) {
      const { muster, ziel, ...rest } = eigen;
      f = { ...feier, ...rest, muster, ziele: { [stufe]: ziel ?? rest.szene } };
    }
    const muster = MUSTER[f?.muster];
    if (!muster) return null;
    const svg = muster(f, { stufe, sterne: Math.max(1, Math.min(3, sterne || 1)), ruhig });
    if (!svg) return null;
    const box = document.createElement("div");
    box.className = "feier" + (ruhig ? " ruhig" : "");
    box.setAttribute("aria-hidden", "true");
    box.appendChild(svg);
    box.addEventListener("click", () => {
      if (typeof svg.setCurrentTime === "function") { svg.setCurrentTime(START + DAUER + 2); svg.pauseAnimations(); }
    });
    return box;
  }

  return { zeige, MUSTER, DAUER, bewegungReduziert };
})();

if (typeof module !== "undefined") module.exports = LS_FEIER;
