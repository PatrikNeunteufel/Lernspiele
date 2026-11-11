/* Lage und Schrift einer Abschluss-Animation prüfen (Prüfer-Kandidat aus LERN_Session28, gebaut LERN_Session29).

   Rechnet am ruhigen Endbild (feier.js mit ruhig: alle Teile an ihrem Platz, Transformationen als Attribute) ohne
   Layout — der Ersatz-DOM des Tests kennt keines: Texte kleiner als minSchrift Einheiten der viewBox (nach allen
   Verkleinerungen) und Teile, die über den Rand der viewBox ragen. Ausgelassen: Unsichtbares (opacity 0), Inhalte mit
   clip-path (die Karte ist absichtlich grösser als das Bild), Verläufe und Zuschnitte selbst.

   Grössen von Text schätzt die Prüfung (Breite je Zeichen 0.56 der Schrift, Bildzeichen 1.1); Bögen in Pfaden rechnet
   sie über den Mittelpunkt (ohne Drehung der Ellipse). Die Funktion steht für sich (keine Abhängigkeiten), damit
   pruefe_spiele.js sie als Quelltext in den Ersatz-DOM geben kann. */
"use strict";

function pruefeFeierBild(svg, { minSchrift = 9, toleranz = 1.5 } = {}) {
  const funde = [];
  const [vx, vy, vw, vh] = (svg.getAttribute("viewBox") || "0 0 320 150").split(/[\s,]+/).map(Number);
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

  function text(e, m) {
    const fs = zahl(e, "font-size", 16), wahr = fs * skala(m);
    const inhalt = (e.textContent || "").trim();
    if (!inhalt) return [];
    if (wahr < minSchrift - 1e-6) funde.push({ art: "schrift", text: `Text „${inhalt.slice(0, 30)}“ nur ${wahr.toFixed(1)} Einheiten hoch` });
    // Breite je Zeichen in em, wie die Schrift system-ui fett (im Browser gegen getBBox abgeglichen, LERN_Session29):
    // Leerzeichen und Satzzeichen schmal, schmales Leerzeichen der Tausendertrennung schmaler, Bildzeichen breit
    const em = z => (/[  ]/.test(z) ? 0.2 : /[ .,:;'!|il]/.test(z) ? 0.28 : z.codePointAt(0) > 0x2000 && !/[−→×·≈²³–—„“…]/.test(z) ? 1.1 : 0.58);
    const breite = [...inhalt].reduce((s, z) => s + em(z), 0) * fs;
    const x = zahl(e, "x"), y = zahl(e, "y"), anker = e.getAttribute("text-anchor") || "start";
    const links = anker === "middle" ? x - breite / 2 : anker === "end" ? x - breite : x;
    return [[links, y - fs * 0.75], [links + breite, y - fs * 0.75], [links, y + fs * 0.2], [links + breite, y + fs * 0.2]];
  }

  const AUSLASSEN = /^(clippath|lineargradient|radialgradient|defs|animate|animatemotion|animatetransform|set|stop|title|desc)$/i;
  (function lauf(e, m) {
    for (const k of e.children || []) {
      const name = (k.localName || "").toLowerCase();
      if (AUSLASSEN.test(name) || k.getAttribute("opacity") === "0" || k.getAttribute("clip-path")) continue;
      const mk = mal(m, matrixVon(k.getAttribute("transform")));
      let pts = [];
      if (name === "g" || name === "svg") { lauf(k, mk); continue; }
      if (name === "rect") { const x = zahl(k, "x"), y = zahl(k, "y"), w = zahl(k, "width"), h = zahl(k, "height"); pts = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]; }
      else if (name === "circle" || name === "ellipse") {
        const cx = zahl(k, "cx"), cy = zahl(k, "cy"), rx = name === "circle" ? zahl(k, "r") : zahl(k, "rx"), ry = name === "circle" ? rx : zahl(k, "ry");
        // bei Drehung reichen die vier Achsenpunkte nicht ganz; die Toleranz fängt das bei kleinen Kreisen auf
        pts = [[cx - rx, cy], [cx + rx, cy], [cx, cy - ry], [cx, cy + ry]];
      } else if (name === "line") pts = [[zahl(k, "x1"), zahl(k, "y1")], [zahl(k, "x2"), zahl(k, "y2")]];
      else if (name === "path") pts = pfadPunkte(k.getAttribute("d"));
      else if (name === "polygon" || name === "polyline") {
        const z = (k.getAttribute("points") || "").split(/[\s,]+/).filter(Boolean).map(Number);
        for (let i = 0; i + 1 < z.length; i += 2) pts.push([z[i], z[i + 1]]);
      } else if (name === "text") pts = text(k, mk);
      const breit = name === "line" || name === "path" ? zahl(k, "stroke-width", 0) / 2 : 0;
      for (const p of pts) {
        const [px, py] = punkt(mk, p), r = breit * skala(mk);
        const ueber = Math.max(vx - (px - r), px + r - (vx + vw), vy - (py - r), py + r - (vy + vh));
        if (ueber > toleranz) {
          const was = name === "text" ? `Text „${(k.textContent || "").trim().slice(0, 30)}“` : name + (k.getAttribute("data-stueck") ? ` (${k.getAttribute("data-stueck")})` : "");
          funde.push({ art: "rand", text: `${was} ragt ${ueber.toFixed(1)} Einheiten über den Rand (bei ${px.toFixed(0)}, ${py.toFixed(0)})` });
          break;
        }
      }
    }
  })(svg, EINS);
  return funde;
}

if (typeof module !== "undefined") module.exports = { pruefeFeierBild };
