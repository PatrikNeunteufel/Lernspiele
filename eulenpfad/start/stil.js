/* Stil der Startseite (Einstellung stil: glatt | hand; Wunsch Patrik LERN_Session32, docs/eulenpfad/konzept_gestaltung.md).

   „hand“: alles wie von Hand gezeichnet, in denselben Farben wie glatt —
   - Rahmen: Über Spielkarten, Weiterspielen, den Filter und die Karten in Profil, Erfolge und Statistik legt STIL ein SVG
     (svg.hand-rahmen): eine gefüllte Fläche zwischen zwei leicht krummen Linien, auf der Kopfseite dick (wo die glatte
     Karte ihren Farbstreifen hat: Spielkarte oben, kompakt und Weiterspielen links), sonst dünn; die Dicke wechselt
     langsam. Farbe --f der Karte, sonst eine helle Linie. Die Form hängt an der Kennung des Elements (Zufall mit
     Startwert) und wird neu gerechnet, wenn sich die Grösse ändert.
   - Raster: Spielkarten in den Kacheln leicht verschoben, mal etwas höher oder tiefer, etwas grösser oder kleiner, mit
     wechselndem Abstand; ab und zu eine Lücke (start/spiele.js gitter, STIL.luecke). Je Spiel immer gleich.
   - Knöpfe, Chips, Tabs, Felder: unregelmässige Ecken und Linien in start/start.css (.stil-hand …), ohne SVG.
   Umgeschaltet über die Klasse stil-hand an body. */
"use strict";

const STIL = (() => {
  const NS = "http://www.w3.org/2000/svg";
  // Was einen Rahmen bekommt, und wo seine dicke Seite ist (null = überall dünn)
  const RAHMEN = [
    [".spielkarte", k => (k.closest(".spiele.kompakt") ? "links" : "oben")],
    [".weiter-karte", () => "links"],
    [".filter-klapp", () => null],
    ["#inhalt .karte", () => null],
  ];
  const an = () => typeof LS !== "undefined" && LS.einstellung("stil") === "hand";

  /** Zufall mit Startwert (mulberry32): dasselbe Element bekommt dieselbe Form. */
  function zufallAus(text) {
    let h = 2166136261;
    for (const c of String(text)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => { h = (h + 0x6d2b79f5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  /** Pfad der handgezeichneten Fläche für b × h mit Eckradius r; kopf "oben", "links" oder null. */
  function pfad(b, h, id, kopf, r = 18) {
    const z = zufallAus(id), schritt = 10;
    r = Math.max(4, Math.min(r, b / 2, h / 2));
    const pkt = [];
    const gerade = (x0, y0, x1, y1, nx, ny, seite) => {
      const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / schritt));
      for (let i = 0; i < n; i++) pkt.push({ x: x0 + ((x1 - x0) * i) / n, y: y0 + ((y1 - y0) * i) / n, nx, ny, seite });
    };
    const bogen = (cx, cy, a0, seite) => {
      for (let i = 0; i < 4; i++) { const a = a0 + (i * Math.PI) / 8; pkt.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a), seite }); }
    };
    gerade(r, 0, b - r, 0, 0, -1, "oben"); bogen(b - r, r, -Math.PI / 2, "oben");
    gerade(b, r, b, h - r, 1, 0, "rechts"); bogen(b - r, h - r, 0, "unten");
    gerade(b - r, h, r, h, 0, 1, "unten"); bogen(r, h - r, Math.PI / 2, "unten");
    gerade(0, h - r, 0, r, -1, 0, "links"); bogen(r, r, Math.PI, "oben");
    // lange Wellen (krumm und gebogen, nicht zittrig): Lage bis ±2.6 px; Kopfseite 7–11 px, sonst 1.8–4 px
    const welle = (f1, f2) => { const p1 = z() * 6.3, p2 = z() * 6.3, a = 0.6 + 0.3 * z(); return t => a * Math.sin(t * f1 + p1) + (1 - a) * Math.sin(t * f2 + p2); };
    const lage = welle(2 + z() * 2, 6 + z() * 3), dicke = welle(2 + z() * 2, 7 + z() * 4);
    const n = pkt.length, aussen = [], innen = [];
    pkt.forEach((q, i) => {
      const t = (i / n) * Math.PI * 2;
      const istKopf = kopf === "links" ? q.seite === "links" : kopf === "oben" && q.seite === "oben" && Math.abs(q.ny) > 0.3;
      const w = istKopf ? 9 + 2 * dicke(t) : 2.9 + 1.1 * dicke(t);
      const d = 2.6 * lage(t);
      aussen.push([q.x + q.nx * d, q.y + q.ny * d]);
      innen.push([q.x + q.nx * (d - w), q.y + q.ny * (d - w)]);
    });
    const zug = ps => "M" + ps.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L") + " Z";
    return zug(aussen) + " " + zug(innen.reverse());
  }

  /** Kennung eines Elements für den Zufall: Spiel, sonst Titel oder Text am Anfang. */
  const kennung = k => k.dataset.spiel || k.getAttribute("href") || k.querySelector("h2, summary, b")?.textContent?.slice(0, 40) || k.className;

  /** Rahmen eines Elements (neu) zeichnen, in seiner heutigen Grösse. */
  function zeichne(k) {
    const b = k.offsetWidth, h = k.offsetHeight;
    if (!b || !h || !k.isConnected) return;
    const eintrag = RAHMEN.find(([sel]) => k.matches(sel));
    if (!eintrag) return;
    let svg = k.querySelector(":scope > svg.hand-rahmen");
    if (!svg) {
      svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "hand-rahmen");
      svg.setAttribute("aria-hidden", "true");
      const p = document.createElementNS(NS, "path");
      p.setAttribute("fill-rule", "evenodd");
      svg.appendChild(p);
      k.appendChild(svg);
    }
    const r = parseFloat(getComputedStyle(k).borderTopLeftRadius) || 18;
    svg.setAttribute("viewBox", `0 0 ${b} ${h}`);
    svg.firstChild.setAttribute("d", pfad(b, h, kennung(k), eintrag[1](k), r));
  }
  const beobachter = typeof ResizeObserver === "function" ? new ResizeObserver(e => e.forEach(x => zeichne(x.target))) : null;

  /** Raster: Spielkarte in den Kacheln leicht verschieben und skalieren (CSS-Variablen, start.css). */
  function raster(k) {
    if (!k.dataset.spiel || k.dataset.raster) return;
    const z = zufallAus("raster:" + k.dataset.spiel), um = (a, b) => a + (b - a) * z();
    k.dataset.raster = "1";
    k.style.setProperty("--rx", `${um(-4, 4).toFixed(1)}px`);
    k.style.setProperty("--ry", `${um(-4, 4).toFixed(1)}px`);
    k.style.setProperty("--rm", `${um(0, 12).toFixed(1)}px`);
    k.style.setProperty("--rs", um(0.975, 1.02).toFixed(3));
  }

  /** Ein Element einbinden: Rahmen beobachten, Raster setzen. */
  function binde(k) {
    if (k.dataset.stil) return;
    k.dataset.stil = "1";
    if (k.matches(".spielkarte")) raster(k);
    if (beobachter) beobachter.observe(k); else zeichne(k);
  }
  const auswahl = RAHMEN.map(([sel]) => sel).join(", ");
  /** Alle passenden Elemente in wurzel (und wurzel selbst) einbinden. */
  function bindeAlle(wurzel) {
    if (wurzel.nodeType !== 1) return;
    if (wurzel.matches(auswahl)) binde(wurzel);
    wurzel.querySelectorAll(auswahl).forEach(binde);
  }
  let neues = null;

  /** Stil der Seite setzen (bei jedem Zeichnen der Startseite): Klasse an body, neue Elemente einbinden. */
  function anwenden() {
    const hand = an();
    document.body.classList.toggle("stil-hand", hand);
    if (!hand) { neues?.disconnect(); neues = null; return; }
    bindeAlle(document.body);
    if (!neues && typeof MutationObserver === "function") {
      neues = new MutationObserver(m => m.forEach(x => x.addedNodes.forEach(bindeAlle)));
      neues.observe(document.body, { childList: true, subtree: true });
    }
  }

  /** Lücke im Raster nach dieser Karte? Nur im Stil „hand“, ab und zu (etwa jede zwölfte Karte), je Spiel gleich. */
  const luecke = id => an() && zufallAus("luecke:" + id)() < 0.085;

  return { an, anwenden, pfad, luecke, zeichne };
})();
