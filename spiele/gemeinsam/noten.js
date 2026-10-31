/* Noten zeichnen (SVG) und Töne spielen (WebAudio) für die Musikspiele. Braucht spiel.js davor.
   Tonhöhe als Position im Violinschlüssel: p = 0 ist die unterste Linie (e'), jede Stufe ein
   Ton weiter (Linie, Zwischenraum, Linie …): p = −2 ist c' mit Hilfslinie, p = 8 die oberste Linie (f'').
   Notennamen deutsch: c d e f g a h; mit Vorzeichen cis, fis … und b, es, as … (b = h mit ♭).
   Notenwerte in Vierteln: 4 Ganze, 2 Halbe, 1 Viertel, 0.5 Achtel, 0.25 Sechzehntel. */

const NOTEN = (() => {
  "use strict";
  const { el } = LS;
  const SVG = "http://www.w3.org/2000/svg";

  const NAMEN = ["c", "d", "e", "f", "g", "a", "h"];
  const HALBTOENE = [0, 2, 4, 5, 7, 9, 11];
  const mod = (n, m) => ((n % m) + m) % m;

  /** Stufe ab c' (0 = c', 7 = c''). */
  const stufeVon = p => p + 2;

  /** Deutscher Notenname ohne Oktave: c, fis, b, es … (vorzeichen +1 = ♯, −1 = ♭). */
  function name(p, vorzeichen = 0) {
    const n = NAMEN[mod(stufeVon(p), 7)];
    if (vorzeichen > 0) return n + "is";
    if (vorzeichen < 0) return n === "h" ? "b" : n === "e" ? "es" : n === "a" ? "as" : n + "es";
    return n;
  }

  /** MIDI-Nummer (c' = 60). */
  function midi(p, vorzeichen = 0) {
    const s = stufeVon(p);
    return 60 + 12 * Math.floor(s / 7) + HALBTOENE[mod(s, 7)] + vorzeichen;
  }
  const frequenz = m => 440 * 2 ** ((m - 69) / 12);

  // ---------- Zeichnen ----------

  const ABSTAND = 12; // Linienabstand in SVG-Einheiten

  function svgEl(tag, attr = {}, text) {
    const e = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attr)) e.setAttribute(k, v);
    if (text != null) e.textContent = text;
    return e;
  }

  /** Wie breit eine Note mit diesem Wert in einem Rhythmus steht (länger = breiter, aber gedämpft). */
  const breiteFuer = wert => 30 + 14 * Math.sqrt(wert);

  /**
   * Notenzeile als SVG.
   * opt.noten: [{ p, wert = 1, punkt, vorzeichen }]; ohne p: Rhythmus auf einer Linie
   * opt.linien: 5 (Notensystem) oder 1 (Rhythmuslinie); opt.schluessel: Violinschlüssel zeigen
   * opt.takt: „4/4“ als Taktangabe; opt.taktstrich: Schlussstrich am Ende
   * opt.luecke: Breite (in Vierteln) eines leeren Platzes am Ende, markiert mit „?“
   */
  function zeile(opt) {
    const linien = opt.linien ?? 5;
    const mitte = 70;                       // y der mittleren Linie
    const unten = linien === 5 ? mitte + 2 * ABSTAND : mitte;
    const yVon = p => (linien === 5 ? unten - p * ABSTAND / 2 : mitte);
    const teile = [];
    let x = 14;
    if (opt.schluessel && linien === 5) {
      teile.push(svgEl("text", { x, y: unten + 9, class: "schluessel", "font-size": 76 }, "𝄞"));
      x += 44;
    }
    if (opt.takt) {
      const [oben, unter] = opt.takt.split("/");
      const yo = linien === 5 ? mitte - 2 : mitte - 6, yu = linien === 5 ? mitte + 22 : mitte + 18;
      teile.push(svgEl("text", { x: x + 10, y: yo, class: "takt", "text-anchor": "middle" }, oben),
        svgEl("text", { x: x + 10, y: yu, class: "takt", "text-anchor": "middle" }, unter));
      x += 30;
    }
    x += 10;
    for (const n of opt.noten) {
      const breite = n.p === undefined ? breiteFuer(n.wert ?? 1) : 46;
      teile.push(...note(x + 10, yVon(n.p ?? 4), n, linien === 5 ? n.p : 0, unten));
      x += breite;
    }
    if (opt.luecke) {
      const b = breiteFuer(opt.luecke);
      teile.push(svgEl("rect", { x: x - 2, y: mitte - 30, width: b - 4, height: 50, rx: 8, class: "luecke" }),
        svgEl("text", { x: x - 2 + (b - 4) / 2, y: mitte + 7, class: "luecke-text", "text-anchor": "middle" }, "?"));
      x += b;
    }
    const breite = Math.max(x + 10, opt.mindestBreite || 0);
    if (opt.taktstrich) teile.push(svgEl("line", { x1: breite - 8, x2: breite - 8, y1: linien === 5 ? unten - 4 * ABSTAND : mitte - 12, y2: linien === 5 ? unten : mitte + 12, class: "strich" }));
    const zeilen = linien === 5 ? [0, 1, 2, 3, 4].map(i => unten - i * ABSTAND) : [mitte];
    // Rhythmuslinie braucht weniger Höhe; höchstens doppelt so gross zeichnen wie entworfen.
    const svg = svgEl("svg", { viewBox: linien === 5 ? `0 0 ${breite} 130` : `0 20 ${breite} 90`, class: "noten-zeile", role: "img", "aria-label": "Noten" });
    svg.style.maxWidth = `${breite * 2}px`;
    for (const y of zeilen) svg.append(svgEl("line", { x1: 4, x2: breite - 4, y1: y, y2: y, class: "linie" }));
    svg.append(...teile);
    return svg;
  }

  /** Teile einer Note: Hilfslinien, Vorzeichen, Kopf, Hals, Fähnchen, Punkt. */
  function note(x, y, n, p, unten) {
    const wert = n.wert ?? 1;
    const grund = n.punkt ? wert / 1.5 : wert; // Wert ohne Punkt bestimmt die Form
    const t = [];
    // Hilfslinien unter und über dem System
    for (let q = -2; q >= p; q -= 2) t.push(svgEl("line", { x1: x - 11, x2: x + 11, y1: unten - q * ABSTAND / 2, y2: unten - q * ABSTAND / 2, class: "linie" }));
    for (let q = 10; q <= p; q += 2) t.push(svgEl("line", { x1: x - 11, x2: x + 11, y1: unten - q * ABSTAND / 2, y2: unten - q * ABSTAND / 2, class: "linie" }));
    if (n.vorzeichen) t.push(svgEl("text", { x: x - 22, y: y + 7, class: "vorzeichen", "text-anchor": "middle" }, n.vorzeichen > 0 ? "♯" : "♭"));
    const hohl = grund >= 2;
    t.push(svgEl("ellipse", { cx: x, cy: y, rx: 7.2, ry: 5.2, transform: `rotate(-20 ${x} ${y})`, class: hohl ? "kopf hohl" : "kopf" }));
    if (grund < 4) {
      const hoch = p < 4; // unter der Mitte: Hals nach oben, rechts
      const hx = hoch ? x + 6.4 : x - 6.4;
      const ende = hoch ? y - 36 : y + 36;
      t.push(svgEl("line", { x1: hx, x2: hx, y1: y, y2: ende, class: "hals" }));
      const faehnchen = grund <= 0.25 ? 2 : grund <= 0.5 ? 1 : 0;
      for (let i = 0; i < faehnchen; i++) {
        const fy = ende + (hoch ? 1 : -1) * i * 9;
        const d = hoch ? `M${hx},${fy} q12,8 9,22 q-1,-12 -9,-14` : `M${hx},${fy} q12,-8 9,-22 q-1,12 -9,14`;
        t.push(svgEl("path", { d, class: "faehnchen" }));
      }
    }
    if (n.punkt) t.push(svgEl("circle", { cx: x + 12, cy: y - (p % 2 === 0 ? 3 : 0), r: 2.6, class: "punkt" }));
    return t;
  }

  // ---------- Hören ----------

  let audio = null;
  /** Ist der Ton im Rahmen eingeschaltet? (Knopf oben rechts) */
  const tonAn = () => LS.lies("ton", true);

  /**
   * Töne nacheinander spielen: [{ midi, dauer (s) }], midi null = Pause, klick = nur ein Klick
   * (für Rhythmen). Gibt die Gesamtdauer in Sekunden zurück; ohne Ton oder WebAudio 0.
   */
  function spiele(folge) {
    if (!tonAn()) return 0;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      let t = audio.currentTime + 0.05;
      for (const ton of folge) {
        if (ton.midi != null) {
          const osc = audio.createOscillator();
          const gain = audio.createGain();
          osc.type = ton.klick ? "square" : "triangle";
          osc.frequency.value = frequenz(ton.midi);
          const klang = ton.klick ? 0.08 : Math.max(0.12, ton.dauer * 0.9);
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + klang);
          osc.connect(gain).connect(audio.destination);
          osc.start(t);
          osc.stop(t + klang + 0.02);
        }
        t += ton.dauer;
      }
      return t - audio.currentTime;
    } catch { return 0; }
  }

  /** Knopf „Anhören“: spielt die Folge; bei ausgeschaltetem Ton sagt die Eule Bescheid. */
  function hoerKnopf(ctx, folgeFn, text = "🔊 Anhören") {
    return el("button", {
      type: "button", class: "knopf hell hoer-knopf", text,
      onclick: () => { if (!spiele(folgeFn())) ctx.sag("Der Ton ist aus. Schalte ihn oben rechts ein: 🔊", "hinweis"); },
    });
  }

  return { NAMEN, name, midi, frequenz, zeile, spiele, hoerKnopf, breiteFuer };
})();
