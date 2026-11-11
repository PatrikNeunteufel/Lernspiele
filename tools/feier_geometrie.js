/* Prüfungen der Abschluss-Animationen (feier.js). Lage und Schrift: Prüfer-Kandidat aus LERN_Session28, gebaut
   LERN_Session29. Dazu seit LERN_Session31 (Prüfer-Kandidaten aus LERN_Session29 bis 31):
   - Schmuck über Text: Funken, Glanz, Fähnchen … (data-schmuck) dürfen keinen Text und kein Bildzeichen überdecken —
     zweimal von Hand gefunden (LERN_Session30).
   - Bewegt gegen ruhig: das Endbild der Bewegung (die SMIL-Animationen bis zum Ende gerechnet) zeigt dieselben Texte am
     selben Ort wie das ruhige Bild („Bewegung reduzieren“) — der Stellen-Detektiv war bewegt kräftig, ruhig zart.
   - Animationen, die der Browser still übergeht: keySplines und keyTimes stimmig, attributeName passt zum Element.
   - Bildzeichen aus mehreren Zeichen (👩‍🏫, ☀️ mit Variantenzeichen) zählen als eines (Intl.Segmenter).

   Rechnet ohne Layout — der Ersatz-DOM des Tests kennt keines. Lage und Schrift am ruhigen Endbild (alle Teile an ihrem
   Platz, Transformationen als Attribute): Texte kleiner als minSchrift Einheiten der viewBox (nach allen
   Verkleinerungen) und Teile, die über den Rand ragen. Ausgelassen: Unsichtbares (opacity 0), Inhalte mit clip-path (die
   Karte ist absichtlich grösser als das Bild), Verläufe und Zuschnitte selbst. Textbreite geschätzt (Breite je Zeichen
   wie system-ui fett, Bildzeichen 1.1); Bögen über den Mittelpunkt (ohne Drehung der Ellipse).

   Alles steht in feierPruefungen() ohne Abhängigkeiten, damit pruefe_spiele.js und pruefe_feier.js es als Quelltext in
   den Ersatz-DOM geben können. */
"use strict";

function feierPruefungen() {
  const mal = (a, b) => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
  const EINS = [1, 0, 0, 1, 0, 0];
  function matrixVon(tr) {
    let m = EINS;
    const re = /(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g;
    let t;
    while ((t = re.exec(tr || ""))) {
      const z = t[2].split(/[\s,]+/).filter(Boolean).map(Number);
      let n = EINS;
      if (t[1] === "matrix") n = z;
      else if (t[1] === "translate") n = [1, 0, 0, 1, z[0], z[1] || 0];
      else if (t[1] === "scale") n = [z[0], 0, 0, z.length > 1 ? z[1] : z[0], 0, 0];
      else if (t[1] === "rotate") {
        const w = (z[0] * Math.PI) / 180, c = Math.cos(w), s = Math.sin(w);
        n = [c, s, -s, c, 0, 0];
        if (z.length >= 3) n = mal(mal([1, 0, 0, 1, z[1], z[2]], n), [1, 0, 0, 1, -z[1], -z[2]]);
      } else if (t[1] === "skewX") n = [1, 0, Math.tan((z[0] * Math.PI) / 180), 1, 0, 0];
      else n = [1, Math.tan((z[0] * Math.PI) / 180), 0, 1, 0, 0];
      m = mal(m, n);
    }
    return m;
  }
  const punkt = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const skala = m => Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]));
  const zahl = (e, n, vor = 0) => { const v = parseFloat(e.getAttribute(n)); return Number.isFinite(v) ? v : vor; };
  const name = e => (e.localName || "").toLowerCase();

  /**
   * Punkte eines Pfads: Endpunkte, bei Kurven Punkte auf der Kurve (nicht die Stützpunkte: der Stützpunkt eines
   * Bogens über zwei Teilern liegt doppelt so hoch wie sein Scheitel), bei Bögen die äussersten Punkte des Bogens.
   */
  function pfadPunkte(d) {
    const tok = (d || "").match(/[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || [];
    const pts = [], N = { M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7 };
    let i = 0, cmd = "", x = 0, y = 0, sx = 0, sy = 0, stuetze = null, vorher = "";
    // Bézierkurve durch die Kontrollpunkte k (3 oder 4), in 16 Schritten
    const kurve = k => {
      for (let s = 1; s <= 16; s++) {
        const t = s / 16, u = 1 - t;
        pts.push(k.length === 3
          ? [u * u * k[0][0] + 2 * u * t * k[1][0] + t * t * k[2][0], u * u * k[0][1] + 2 * u * t * k[1][1] + t * t * k[2][1]]
          : [0, 1].map(j => u * u * u * k[0][j] + 3 * u * u * t * k[1][j] + 3 * u * t * t * k[2][j] + t * t * t * k[3][j]));
      }
    };
    while (i < tok.length) {
      if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
      const C = cmd.toUpperCase(), rel = cmd !== C;
      if (C === "Z") { x = sx; y = sy; if (i < tok.length && !/[a-zA-Z]/.test(tok[i])) break; continue; }
      const n = N[C];
      if (!n) break;
      const a = tok.slice(i, i + n).map(Number);
      i += n;
      if (a.length < n || a.some(Number.isNaN)) break;
      if (C === "H") { x = rel ? x + a[0] : a[0]; pts.push([x, y]); }
      else if (C === "V") { y = rel ? y + a[0] : a[0]; pts.push([x, y]); }
      else if (C === "A") {
        const nx = rel ? x + a[5] : a[5], ny = rel ? y + a[6] : a[6];
        pts.push([x, y], [nx, ny], ...bogenRand(x, y, Math.abs(a[0]), Math.abs(a[1]), a[3], a[4], nx, ny));
        x = nx; y = ny;
      } else {
        const p = [];
        for (let k = 0; k < n; k += 2) p.push([rel ? x + a[k] : a[k], rel ? y + a[k + 1] : a[k + 1]]);
        // S und T spiegeln den letzten Stützpunkt der Kurve davor (sonst gilt der aktuelle Punkt)
        const spiegel = (art) => (stuetze && art.includes(vorher) ? [2 * x - stuetze[0], 2 * y - stuetze[1]] : [x, y]);
        if (C === "Q") { kurve([[x, y], p[0], p[1]]); stuetze = p[0]; }
        else if (C === "T") { const s1 = spiegel("QT"); kurve([[x, y], s1, p[0]]); stuetze = s1; }
        else if (C === "C") { kurve([[x, y], p[0], p[1], p[2]]); stuetze = p[1]; }
        else if (C === "S") { kurve([[x, y], spiegel("CS"), p[0], p[1]]); stuetze = p[0]; }
        else pts.push(...p);
        [x, y] = p[p.length - 1];
      }
      vorher = C;
      if (C === "M") { sx = x; sy = y; cmd = rel ? "l" : "L"; }
    }
    return pts;
  }
  /** Äusserste Punkte (links, rechts, oben, unten) eines Bogens, die auf ihm liegen (Mittelpunkt nach SVG 1.1 F.6.5). */
  function bogenRand(x1, y1, rx, ry, gross, sweep, x2, y2) {
    if (!rx || !ry) return [];
    const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
    const l = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
    if (l > 1) { rx *= Math.sqrt(l); ry *= Math.sqrt(l); }
    const zaehler = rx * rx * ry * ry - rx * rx * dy * dy - ry * ry * dx * dx, nenner = rx * rx * dy * dy + ry * ry * dx * dx;
    let f = nenner ? Math.sqrt(Math.max(0, zaehler / nenner)) : 0;
    if (Number(gross) === Number(sweep)) f = -f;
    const cx = f * ((rx * dy) / ry) + (x1 + x2) / 2, cy = f * (-(ry * dx) / rx) + (y1 + y2) / 2;
    const winkel = (px, py) => Math.atan2((py - cy) / ry, (px - cx) / rx);
    const a1 = winkel(x1, y1), a2 = winkel(x2, y2), voll = 2 * Math.PI;
    // Lauf von a1 nach a2 in Richtung sweep (1: wachsender Winkel)
    const lauf = Number(sweep) ? (((a2 - a1) % voll) + voll) % voll : -((((a1 - a2) % voll) + voll) % voll);
    const drin = w => {
      const d = Number(sweep) ? (((w - a1) % voll) + voll) % voll : (((a1 - w) % voll) + voll) % voll;
      return d <= Math.abs(lauf) + 1e-9;
    };
    return [0, Math.PI / 2, Math.PI, -Math.PI / 2].filter(drin).map(w => [cx + rx * Math.cos(w), cy + ry * Math.sin(w)]);
  }

  /** Zeichen, wie man sie sieht: ein Bildzeichen aus mehreren Codepunkten (👩‍🏫, ☀️ mit Variantenzeichen) ist eines. */
  const zeichenVon = t => (typeof Intl !== "undefined" && Intl.Segmenter ? [...new Intl.Segmenter("de", { granularity: "grapheme" }).segment(t)].map(s => s.segment) : [...t]);
  // Breite je Zeichen in em, wie die Schrift system-ui fett (im Browser gegen getBBox abgeglichen, LERN_Session29):
  // Leerzeichen und Satzzeichen schmal, schmales Leerzeichen der Tausendertrennung schmaler, Bildzeichen breit
  // (schmale Leerzeichen als   und   geschrieben: von Hand getippt wurden sie einmal still zu gewöhnlichen)
  const em = z => (/^[  ]$/.test(z) ? 0.2 : /^[ .,:;'!|il]$/.test(z) ? 0.28
    : [...z].some(c => c.codePointAt(0) > 0x2000 && !/[−→×·≈²³–—„“…‑  ]/.test(c)) ? 1.1 : 0.58);

  const AUSLASSEN = /^(clippath|lineargradient|radialgradient|defs|animate|animatemotion|animatetransform|set|stop|title|desc)$/i;

  /**
   * Lage und Schrift am ruhigen Endbild, dazu Schmuck über Text. → Funde [{ art, text }]; funde.texte: sichtbare Texte
   * { inhalt, x, y, schmuck } (Mitte, nach allen Transformationen) für den Vergleich bewegt gegen ruhig.
   */
  function pruefeFeierBild(svg, { minSchrift = 9, toleranz = 1.5, ueberdeckung = 0.25 } = {}) {
    const funde = [], texte = [], schmuckKasten = new Map();
    const [vx, vy, vw, vh] = (svg.getAttribute("viewBox") || "0 0 320 150").split(/[\s,]+/).map(Number);
    function textPunkte(e, m) {
      const fs = zahl(e, "font-size", 16), wahr = fs * skala(m);
      const inhalt = (e.textContent || "").trim();
      if (!inhalt) return [];
      if (wahr < minSchrift - 1e-6) funde.push({ art: "schrift", text: `Text „${inhalt.slice(0, 30)}“ nur ${wahr.toFixed(1)} Einheiten hoch` });
      const breite = zeichenVon(inhalt).reduce((s, z) => s + em(z), 0) * fs;
      const x = zahl(e, "x"), y = zahl(e, "y"), anker = e.getAttribute("text-anchor") || "start";
      const links = anker === "middle" ? x - breite / 2 : anker === "end" ? x - breite : x;
      return [[links, y - fs * 0.75], [links + breite, y - fs * 0.75], [links, y + fs * 0.2], [links + breite, y + fs * 0.2]];
    }
    (function lauf(e, m, schmuck, deck = 1) {
      for (const k of e.children || []) {
        const d = deck * (k.getAttribute("opacity") === null ? 1 : Number(k.getAttribute("opacity")));
        const n = name(k);
        if (AUSLASSEN.test(n) || k.getAttribute("opacity") === "0" || k.getAttribute("clip-path")) continue;
        const mk = mal(m, matrixVon(k.getAttribute("transform")));
        // in einer Richtung auf fast nichts gestaucht (eine Karte, die sich umdreht): unsichtbar wie opacity 0
        if (Math.min(Math.hypot(mk[0], mk[1]), Math.hypot(mk[2], mk[3])) < 0.05) continue;
        const sk = schmuck || (k.getAttribute("data-schmuck") ? k : null);
        let pts = [];
        if (n === "g" || n === "svg") { lauf(k, mk, sk, d); continue; }
        if (n === "rect") { const x = zahl(k, "x"), y = zahl(k, "y"), w = zahl(k, "width"), h = zahl(k, "height"); pts = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]; }
        else if (n === "circle" || n === "ellipse") {
          const cx = zahl(k, "cx"), cy = zahl(k, "cy"), rx = n === "circle" ? zahl(k, "r") : zahl(k, "rx"), ry = n === "circle" ? rx : zahl(k, "ry");
          // bei Drehung reichen die vier Achsenpunkte nicht ganz; die Toleranz fängt das bei kleinen Kreisen auf
          pts = [[cx - rx, cy], [cx + rx, cy], [cx, cy - ry], [cx, cy + ry]];
        } else if (n === "line") pts = [[zahl(k, "x1"), zahl(k, "y1")], [zahl(k, "x2"), zahl(k, "y2")]];
        else if (n === "path") pts = pfadPunkte(k.getAttribute("d"));
        else if (n === "polygon" || n === "polyline") {
          const z = (k.getAttribute("points") || "").split(/[\s,]+/).filter(Boolean).map(Number);
          for (let i = 0; i + 1 < z.length; i += 2) pts.push([z[i], z[i + 1]]);
        } else if (n === "text") pts = textPunkte(k, mk);
        const breit = n === "line" || n === "path" ? zahl(k, "stroke-width", 0) / 2 : 0;
        const echt = pts.map(p => punkt(mk, p));
        for (const [px, py] of echt) {
          const r = breit * skala(mk);
          const ueber = Math.max(vx - (px - r), px + r - (vx + vw), vy - (py - r), py + r - (vy + vh));
          if (ueber > toleranz) {
            const was = n === "text" ? `Text „${(k.textContent || "").trim().slice(0, 30)}“` : n + (k.getAttribute("data-stueck") ? ` (${k.getAttribute("data-stueck")})` : "");
            funde.push({ art: "rand", text: `${was} ragt ${ueber.toFixed(1)} Einheiten über den Rand (bei ${px.toFixed(0)}, ${py.toFixed(0)})` });
            break;
          }
        }
        if (!echt.length) continue;
        const kasten = [Math.min(...echt.map(p => p[0])), Math.min(...echt.map(p => p[1])), Math.max(...echt.map(p => p[0])), Math.max(...echt.map(p => p[1]))];
        // je Teil des Schmucks ein Kasten: ein Funkenring um ein Bildzeichen überdeckt es nicht, ein Funke darauf schon
        // ein Ring ohne Füllung (Rahmen um einen Buchstaben) und ein durchscheinendes Licht (Scheinwerfer) überdecken nichts
        if (sk && k.getAttribute("fill") !== "none" && d >= 0.5) schmuckKasten.set(k, { kasten, sk });
        if (n === "text") {
          const inhalt = (k.textContent || "").trim();
          // ein Bildzeichen ist rund: seine Ecken sind leer (sonst träfe ein Funkenring um den Pokal dessen Ecken)
          const bildzeichen = zeichenVon(inhalt).every(z => em(z) === 1.1), ein = bildzeichen ? 0.15 : 0;
          const [a, b, c, d] = kasten, innen = [a + (c - a) * ein, b + (d - b) * ein, c - (c - a) * ein, d - (d - b) * ein];
          texte.push({ inhalt, x: (a + c) / 2, y: (b + d) / 2, kasten: innen, schmuck: !!sk });
        }
      }
    })(svg, EINS, null);
    // Schmuck über Text: ein Teil des Schmucks liegt zu mehr als einem Viertel (des kleineren der beiden) auf einem Text
    // oder Bildzeichen; je Text und Schmuck eine Meldung
    const gemeldet = new Set();
    for (const { kasten: s, sk } of schmuckKasten.values()) for (const tx of texte) {
      if (tx.schmuck || gemeldet.has(tx) ) continue;
      const [a, b, c, d] = tx.kasten, w = Math.min(c, s[2]) - Math.max(a, s[0]), h = Math.min(d, s[3]) - Math.max(b, s[1]);
      const flaeche = Math.max(1, Math.min((c - a) * (d - b), (s[2] - s[0]) * (s[3] - s[1])));
      if (w > 0 && h > 0 && (w * h) / flaeche > ueberdeckung) {
        gemeldet.add(tx);
        funde.push({ art: "schmuck", text: `Schmuck (${sk.getAttribute("data-schmuck")}★) über „${tx.inhalt.slice(0, 20)}“ bei ${tx.x.toFixed(0)}, ${tx.y.toFixed(0)}` });
      }
    }
    funde.texte = texte;
    return funde;
  }

  // Attribute, die eine animate- oder set-Anweisung ändern darf, und an welchen Elementen ("*" = an allen)
  const ATTRIBUTE = {
    opacity: "*", "fill-opacity": "*", "stroke-opacity": "*", fill: "*", stroke: "*", "stroke-width": "*", "stroke-dashoffset": "*",
    "stroke-dasharray": "*", visibility: "*", d: ["path"], points: ["polygon", "polyline"], x: ["rect", "text", "image", "use", "svg"],
    y: ["rect", "text", "image", "use", "svg"], width: ["rect", "image", "use", "svg"], height: ["rect", "image", "use", "svg"],
    r: ["circle"], cx: ["circle", "ellipse"], cy: ["circle", "ellipse"], rx: ["ellipse", "rect"], ry: ["ellipse", "rect"],
    x1: ["line"], y1: ["line"], x2: ["line"], y2: ["line"], "font-size": ["text", "g"],
  };
  /** Animationen, die der Browser still übergehen würde: falsches Attribut, keySplines und keyTimes nicht stimmig. */
  function pruefeAnimationen(svg) {
    const funde = [];
    (function lauf(e) {
      for (const k of e.children || []) {
        const n = name(k);
        if (/^(animate|set|animatetransform|animatemotion)$/.test(n)) {
          const attr = k.getAttribute("attributeName"), ziel = name(e);
          if (n === "animatetransform" && attr !== "transform") funde.push({ art: "attribut", text: `animateTransform an ${ziel} mit attributeName „${attr}“ statt transform` });
          if (n === "animate" || n === "set") {
            const erlaubt = ATTRIBUTE[attr];
            if (!erlaubt || (erlaubt !== "*" && !erlaubt.includes(ziel))) funde.push({ art: "attribut", text: `${n} an ${ziel} ändert „${attr}“, das es dort nicht gibt` });
          }
          if (n === "animatemotion" && !k.getAttribute("path")) funde.push({ art: "attribut", text: `animateMotion an ${ziel} ohne path` });
          const zeiten = k.getAttribute("keyTimes"), werte = k.getAttribute("values"), punkte = k.getAttribute("keyPoints");
          const nz = zeiten ? zeiten.split(";").length : 0;
          if (zeiten) {
            const z = zeiten.split(";").map(Number);
            if (z.some(Number.isNaN) || z.some((v, i) => i && v < z[i - 1]) || (k.getAttribute("calcMode") !== "discrete" && (z[0] !== 0 || z[z.length - 1] !== 1)))
              funde.push({ art: "zeiten", text: `${n} an ${ziel}: keyTimes „${zeiten}“ nicht von 0 bis 1 aufsteigend` });
            if (werte && werte.split(";").length !== nz) funde.push({ art: "zeiten", text: `${n} an ${ziel}: ${werte.split(";").length} values, aber ${nz} keyTimes` });
            if (punkte && punkte.split(";").length !== nz) funde.push({ art: "zeiten", text: `${n} an ${ziel}: ${punkte.split(";").length} keyPoints, aber ${nz} keyTimes` });
          }
          if (k.getAttribute("calcMode") === "spline") {
            const s = (k.getAttribute("keySplines") || "").split(";").filter(t => t.trim());
            const soll = nz ? nz - 1 : werte ? werte.split(";").length - 1 : 1;
            if (s.length !== soll || !s.every(t => { const z = t.trim().split(/[\s,]+/).map(Number); return z.length === 4 && z.every(v => v >= 0 && v <= 1); }))
              funde.push({ art: "zeiten", text: `${n} an ${ziel}: keySplines „${k.getAttribute("keySplines") || ""}“ passen nicht (${soll} nötig, je vier Zahlen von 0 bis 1)` });
          }
        } else lauf(k);
      }
    })(svg);
    return funde;
  }

  /**
   * Das bewegte Bild in seinen Endzustand bringen (verändert es): jede Animation mit fill="freeze" setzt ihren letzten
   * Wert, set seinen; animateTransform ersetzt den Wert (additive="sum" hängt an), animateMotion verschiebt ans Ende des
   * Wegs (mit rotate="auto" in seiner Richtung) vor dem eigenen transform — wie SMIL nach dem Ende aller Animationen.
   */
  function endZustand(svg) {
    (function lauf(e) {
      let tr = e.getAttribute ? e.getAttribute("transform") : null, bewegung = "";
      for (const k of [...(e.children || [])]) {
        const n = name(k);
        if (!/^(animate|set|animatetransform|animatemotion)$/.test(n)) { lauf(k); continue; }
        const letzter = () => k.getAttribute("to") ?? (k.getAttribute("values") || "").split(";").pop().trim();
        if (n === "set") { e.setAttribute(k.getAttribute("attributeName"), k.getAttribute("to")); continue; }
        if (k.getAttribute("fill") !== "freeze") continue;
        if (n === "animate") e.setAttribute(k.getAttribute("attributeName"), letzter());
        else if (n === "animatetransform") {
          const wert = `${k.getAttribute("type")}(${letzter()})`;
          tr = k.getAttribute("additive") === "sum" ? `${tr || ""} ${wert}` : wert;
        } else {
          const p = pfadPunkte(k.getAttribute("path")), ende = p[p.length - 1] || [0, 0];
          let w = 0;
          if (k.getAttribute("rotate") === "auto") {
            const vor = [...p].reverse().find(q => Math.hypot(q[0] - ende[0], q[1] - ende[1]) > 0.01) || ende;
            w = (Math.atan2(ende[1] - vor[1], ende[0] - vor[0]) * 180) / Math.PI;
          }
          bewegung = `translate(${ende[0]} ${ende[1]})${w ? ` rotate(${w})` : ""} `;
        }
      }
      if (e.setAttribute && (tr || bewegung)) e.setAttribute("transform", `${bewegung}${tr || ""}`.trim());
    })(svg);
    return svg;
  }

  /**
   * Alle Prüfungen einer Abschluss-Animation: feier aus LS.spiel, stufen ["s1" …]. → [{ text, schluessel }] (der
   * Schlüssel fasst gleiche Meldungen zusammen). Je Stufe ein Bild, Schmuck passend zu 1–3 Sternen, ruhig ohne, bewegt
   * mit Bewegung, gültige Animationen, Mengen, Zahlenmauer, Lage, Schrift und Schmuck im ruhigen Endbild, dazu das
   * bewegte Endbild gleich dem ruhigen.
   */
  function pruefeFeier(LS_FEIER, feier, stufen) {
    const meldungen = [], melde = (text, schluessel) => meldungen.push({ text, schluessel });
    const alle = e => [e, ...e.querySelectorAll("*")];
    for (const st of stufen) for (const n of [1, 2, 3]) {
      const bilder = {};
      for (const ruhig of [false, true]) {
        const f = LS_FEIER.zeige(feier, { stufe: st, sterne: n, ruhig });
        const teile = f ? alle(f) : [];
        if (!teile.some(t => t.localName === "svg")) { melde("Stufe " + st + ": keine Animation", "feier-" + st); continue; }
        // localName ohne Gross/klein: der Ersatz-DOM schreibt klein, der Browser behält „animateMotion“
        const bewegt = teile.filter(t => /^(animate|animatemotion|animatetransform|set)$/i.test(t.localName || "")).length;
        if (ruhig && bewegt) melde("Stufe " + st + ": Bewegung trotz Bewegung reduzieren", "feier-ruhig");
        if (!ruhig && !bewegt) melde("Stufe " + st + ": keine Bewegung", "feier-still");
        // eine ungültige Art übergeht der Browser still — die Tür des Tresors blieb so zu (Rückmeldung Patrik nach M1)
        for (const a of teile.filter(e => /^animatetransform$/i.test(e.localName || ""))) {
          const art = a.getAttribute("type");
          if (!["translate", "scale", "rotate", "skewX", "skewY"].includes(art)) melde("Stufe " + st + ": animateTransform mit ungültiger Art „" + art + "“", "feier-art");
        }
        // Schmuck der Stufe 2 (Fähnchen, Funkeln …) ab 2 Sternen, der Stufe 3 (Funken, Sternschnuppe …) bei 3 Sternen
        const schmuck = w => teile.filter(t => t.getAttribute && t.getAttribute("data-schmuck") === w).length;
        if ((n >= 2) !== (schmuck("2") > 0) || (n >= 3) !== (schmuck("3") > 0)) melde("Stufe " + st + ", " + n + " Stern(e): Schmuck passt nicht zu den Sternen", "feier-sterne");
        // Mengen (AUFTRITT, SAMMELN, KARTE): so viele Stücke im Bild, wie es angibt
        const bild = teile.find(t => t.localName === "svg");
        const anzahl = bild.getAttribute("data-anzahl"), stuecke = teile.filter(t => t.getAttribute && t.getAttribute("data-stueck")).length;
        if (anzahl !== null && anzahl !== undefined && Number(anzahl) !== stuecke) melde("Stufe " + st + ": " + stuecke + " Stücke im Bild statt " + anzahl, "feier-anzahl");
        if (!ruhig) for (const a of pruefeAnimationen(bild)) melde("Stufe " + st + ": " + a.text, "feier-" + a.art + ":" + st + ":" + a.text);
        // Lage, Schrift und Schmuck im Endbild mit allem Schmuck (LERN_Session29, LERN_Session31)
        if (ruhig && n === 3) for (const g of pruefeFeierBild(bild)) melde("Stufe " + st + ": " + g.text, "feier-" + g.art + ":" + st + ":" + g.text);
        // Zahlenmauer (BAUEN): jeder Stein die Summe der beiden darunter, die Zahl im Stein gleich seinem Wert
        const steine = new Map(teile.filter(t => t.getAttribute && t.getAttribute("data-stein")).map(t => [t.getAttribute("data-stein"), t]));
        for (const [pos, t] of steine) {
          const [r, i] = pos.split(",").map(Number), wert = Number(t.getAttribute("data-wert"));
          const text = (t.textContent || "").replace(/\s/g, "");
          if (text !== String(wert)) melde("Stufe " + st + ": Stein " + pos + " zeigt " + text + " statt " + wert, "feier-stein");
          if (r > 0) {
            const a = steine.get((r - 1) + "," + i), b = steine.get((r - 1) + "," + (i + 1));
            if (!a || !b || wert !== Number(a.getAttribute("data-wert")) + Number(b.getAttribute("data-wert")))
              melde("Stufe " + st + ": Stein " + pos + " ist nicht die Summe der beiden darunter", "feier-mauer");
          }
        }
        bilder[ruhig ? "ruhig" : "bewegt"] = bild;
      }
      // Bewegt gegen ruhig: dieselben Texte am selben Ort (Toleranz 3 Einheiten), mit allem Schmuck
      if (n === 3 && bilder.ruhig && bilder.bewegt) {
        const tR = pruefeFeierBild(bilder.ruhig).texte, tB = pruefeFeierBild(endZustand(bilder.bewegt)).texte;
        const offen = [...tB];
        for (const r of tR) {
          const i = offen.findIndex(b => b.inhalt === r.inhalt && Math.hypot(b.x - r.x, b.y - r.y) <= 3);
          if (i >= 0) { offen.splice(i, 1); continue; }
          const b = tB.find(q => q.inhalt === r.inhalt);
          melde(`Stufe ${st}: „${r.inhalt.slice(0, 20)}“ ruhig bei ${r.x.toFixed(0)}, ${r.y.toFixed(0)}, bewegt ${b ? `bei ${b.x.toFixed(0)}, ${b.y.toFixed(0)}` : "nicht zu sehen"}`,
            `feier-ruhig-bewegt:${st}:${r.inhalt}`);
        }
        for (const b of offen) melde(`Stufe ${st}: „${b.inhalt.slice(0, 20)}“ bewegt am Ende bei ${b.x.toFixed(0)}, ${b.y.toFixed(0)}, ruhig nicht`, `feier-ruhig-bewegt:${st}:${b.inhalt}`);
      }
    }
    return meldungen;
  }

  return { pruefeFeierBild, pruefeAnimationen, endZustand, pruefeFeier };
}

if (typeof module !== "undefined") module.exports = { ...feierPruefungen(), feierPruefungen };
