/* Avatare (Entscheide AV1 a, AV2 a, AV3 a, LERN_Session12; docs/eulenpfad/konzept_profil_kind.md).
   Ein Kind wählt sein Bild selbst: ein gezeichnetes Tier auf einer Hintergrundfarbe. Eigene SVG statt Emoji, damit es
   auf jedem Gerät gleich aussieht (auch im geteilten Abzeichen-Bild). Gespeichert wird nur die Kennung „<tier>-<farbe>“
   im Profil (Feld avatar); keine Fotos, kein Hochladen. Die Farben sind die Deko-Farben (stil.css), nie Stellenfarben.
   Braucht nichts vom Rahmen; spiel.js nutzt AVATARE, wenn die Seite diese Datei geladen hat (LS.avatarBild). */
"use strict";
const AVATARE = (() => {
  const DUNKEL = "#2d3047";
  // Hintergrund hell (Kreis) und kräftig (Rand) je Deko-Farbe
  const FARBEN = [
    { id: "lila", name: "Lila", hell: "#e8dcf8", rand: "#8e5bd6" },
    { id: "pink", name: "Pink", hell: "#fbdcea", rand: "#e0569a" },
    { id: "orange", name: "Orange", hell: "#fde3cf", rand: "#f07c2a" },
    { id: "gelb", name: "Gelb", hell: "#fbf0c2", rand: "#e9b300" },
    { id: "tuerkis", name: "Türkis", hell: "#cff3ee", rand: "#14b8a6" },
    { id: "indigo", name: "Indigo", hell: "#dfe0fc", rand: "#6366f1" },
  ];

  // Bausteine (Zeichenfläche 100 × 100, Kopf um 50/55)
  const kreis = (x, y, r, f, extra = "") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${extra}/>`;
  const oval = (x, y, rx, ry, f, extra = "") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"${extra}/>`;
  const pfad = (d, f, extra = "") => `<path d="${d}" fill="${f}"${extra}/>`;
  const linie = (d, breite = 2.6, farbe = DUNKEL) => `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${breite}" stroke-linecap="round" stroke-linejoin="round"/>`;
  /** Punktaugen mit Glanz. */
  const augen = (y = 52, abstand = 12, r = 4.2) =>
    [50 - abstand, 50 + abstand].map(x => kreis(x, y, r, DUNKEL) + kreis(x + r * 0.35, y - r * 0.4, r * 0.32, "#fff")).join("");
  const laecheln = (y = 66, b = 6) => linie(`M${50 - b} ${y} q${b} ${b * 0.8} ${b * 2} 0`);
  const wangen = (y = 62, abstand = 20, f = "#f7a8b8") => oval(50 - abstand, y, 5, 3.2, f, ' opacity=".7"') + oval(50 + abstand, y, 5, 3.2, f, ' opacity=".7"');
  const schnurrhaare = y => linie(`M30 ${y}h-12M30 ${y + 5}l-11 3M70 ${y}h12M70 ${y + 5}l11 3`, 1.6, "#6b7085");
  const spiegel = (fn) => fn(1) + fn(-1); // zeichnet links und gespiegelt rechts

  const TIERE = [
    { id: "eule", name: "Eule", zeichne: () =>
      pfad("M26 30 L22 12 L40 24 Z", "#7a5a40") + pfad("M74 30 L78 12 L60 24 Z", "#7a5a40")
      + oval(50, 56, 30, 32, "#8e6b4f") + oval(50, 66, 18, 16, "#d8b98f")
      + kreis(37, 46, 12, "#fff") + kreis(63, 46, 12, "#fff") + kreis(38, 47, 6, DUNKEL) + kreis(62, 47, 6, DUNKEL)
      + kreis(40, 45, 2, "#fff") + kreis(64, 45, 2, "#fff") + pfad("M45 56 L55 56 L50 65 Z", "#f5a623") },
    { id: "fuchs", name: "Fuchs", zeichne: () =>
      pfad("M22 42 L24 12 L44 30 Z", "#e8702a") + pfad("M78 42 L76 12 L56 30 Z", "#e8702a")
      + pfad("M27 36 L28 20 L38 30 Z", DUNKEL) + pfad("M73 36 L72 20 L62 30 Z", DUNKEL)
      + pfad("M20 46 Q22 28 50 28 Q78 28 80 46 Q78 70 50 84 Q22 70 20 46 Z", "#f0873c")
      + pfad("M22 50 Q36 58 50 84 Q30 74 22 50 Z", "#fff") + pfad("M78 50 Q64 58 50 84 Q70 74 78 50 Z", "#fff")
      + augen(50, 13) + oval(50, 74, 4.5, 3.5, DUNKEL) },
    { id: "katze", name: "Katze", zeichne: () =>
      pfad("M22 44 L26 14 L46 30 Z", "#9aa3b5") + pfad("M78 44 L74 14 L54 30 Z", "#9aa3b5")
      + pfad("M28 36 L29 22 L39 30 Z", "#f7b6c8") + pfad("M72 36 L71 22 L61 30 Z", "#f7b6c8")
      + kreis(50, 56, 30, "#9aa3b5") + augen(52, 12) + pfad("M46 60 L54 60 L50 65 Z", "#f28aa5")
      + linie("M50 65 q-4 5 -8 2M50 65 q4 5 8 2", 2) + schnurrhaare(62) },
    { id: "hund", name: "Hund", zeichne: () =>
      kreis(50, 54, 29, "#c58b52")
      + oval(24, 52, 9, 19, "#8a5a32", ' transform="rotate(14 24 52)"') + oval(76, 52, 9, 19, "#8a5a32", ' transform="rotate(-14 76 52)"')
      + oval(50, 67, 15, 11, "#ecd0ae") + kreis(62, 42, 7, "#a87240", ' opacity=".6"')
      + augen(50, 11) + oval(50, 62, 5.5, 4, DUNKEL) + linie("M50 66 v4 M50 70 q-4 4 -8 1M50 70 q4 4 8 1", 2) },
    { id: "baer", name: "Bär", zeichne: () =>
      kreis(27, 31, 11, "#a0714a") + kreis(73, 31, 11, "#a0714a") + kreis(27, 31, 6, "#d6a77c") + kreis(73, 31, 6, "#d6a77c")
      + kreis(50, 56, 30, "#a0714a") + oval(50, 67, 14, 11, "#d6a77c")
      + augen(50, 12) + oval(50, 62, 5.5, 4, DUNKEL) + laecheln(68, 5) },
    { id: "panda", name: "Panda", zeichne: () =>
      kreis(26, 31, 11, DUNKEL) + kreis(74, 31, 11, DUNKEL) + kreis(50, 56, 30, "#fff", ' stroke="#d9dbe6" stroke-width="1.5"')
      + oval(37, 51, 8, 10, DUNKEL, ' transform="rotate(25 37 51)"') + oval(63, 51, 8, 10, DUNKEL, ' transform="rotate(-25 63 51)"')
      + kreis(38, 50, 3, "#fff") + kreis(62, 50, 3, "#fff") + oval(50, 63, 5, 3.6, DUNKEL) + laecheln(69, 4) + wangen(64, 21) },
    { id: "hase", name: "Hase", zeichne: () =>
      oval(38, 20, 7.5, 21, "#e9e4df", ' transform="rotate(-8 38 20)"') + oval(62, 20, 7.5, 21, "#e9e4df", ' transform="rotate(8 62 20)"')
      + oval(38, 21, 3.6, 15, "#f7b6c8", ' transform="rotate(-8 38 21)"') + oval(62, 21, 3.6, 15, "#f7b6c8", ' transform="rotate(8 62 21)"')
      + kreis(50, 60, 27, "#e9e4df") + augen(56, 11) + pfad("M46 63 L54 63 L50 67 Z", "#f28aa5")
      + `<rect x="46.5" y="69" width="7" height="7" rx="1.5" fill="#fff" stroke="#c9c3bd" stroke-width="1"/>` + wangen(66, 18) },
    { id: "maus", name: "Maus", zeichne: () =>
      kreis(26, 36, 16, "#b9b4c4") + kreis(74, 36, 16, "#b9b4c4") + kreis(26, 36, 10, "#f7b6c8") + kreis(74, 36, 10, "#f7b6c8")
      + kreis(50, 60, 25, "#b9b4c4") + augen(56, 10, 3.8) + kreis(50, 66, 4, "#f28aa5") + schnurrhaare(66) },
    { id: "frosch", name: "Frosch", zeichne: () =>
      kreis(34, 36, 13, "#5cb85c") + kreis(66, 36, 13, "#5cb85c") + kreis(34, 36, 8, "#fff") + kreis(66, 36, 8, "#fff")
      + kreis(35, 37, 4.5, DUNKEL) + kreis(65, 37, 4.5, DUNKEL) + kreis(36.5, 35, 1.5, "#fff") + kreis(66.5, 35, 1.5, "#fff")
      + oval(50, 62, 34, 24, "#6cc36c") + linie("M34 64 q16 12 32 0", 3) + wangen(60, 24, "#f6a5a5") },
    { id: "loewe", name: "Löwe", zeichne: () =>
      [...Array(12)].map((_, i) => { const w = i * Math.PI / 6; return kreis(50 + 30 * Math.cos(w), 55 + 30 * Math.sin(w), 12, "#d9822b"); }).join("")
      + kreis(50, 55, 30, "#d9822b") + kreis(31, 33, 7, "#f5c15c") + kreis(69, 33, 7, "#f5c15c")
      + kreis(50, 56, 24, "#f5c15c") + oval(50, 66, 11, 8, "#fbe3a6") + augen(51, 10)
      + pfad("M45 61 L55 61 L50 66 Z", "#8a4f1d") + linie("M50 66 q-4 5 -8 2M50 66 q4 5 8 2", 2) },
    { id: "tiger", name: "Tiger", zeichne: () =>
      kreis(27, 32, 10, "#f39a3b") + kreis(73, 32, 10, "#f39a3b") + kreis(27, 32, 5, "#fff")  + kreis(73, 32, 5, "#fff")
      + kreis(50, 56, 30, "#f39a3b") + oval(50, 67, 15, 11, "#fff")
      + spiegel(s => linie(`M${50 - s * 30} 50 h${s * 9}M${50 - s * 29} 60 h${s * 8}`, 3)) + linie("M50 28 v8M43 30 l2 6M57 30 l-2 6", 3)
      + augen(50, 12) + pfad("M46 61 L54 61 L50 66 Z", "#f28aa5") + linie("M50 66 q-4 5 -8 2M50 66 q4 5 8 2", 2) },
    { id: "pinguin", name: "Pinguin", zeichne: () =>
      kreis(50, 54, 32, DUNKEL) + kreis(40, 58, 17, "#fff") + kreis(60, 58, 17, "#fff") + oval(50, 70, 20, 14, "#fff")
      + augen(53, 10, 3.8) + pfad("M44 61 L56 61 L50 69 Z", "#f5a623") + wangen(65, 19) },
    { id: "igel", name: "Igel", zeichne: () =>
      pfad("M14 66 L18 50 L10 44 L22 38 L18 24 L32 28 L34 14 L44 24 L52 10 L58 24 L70 16 L70 30 L84 28 L78 42 L90 48 L80 56 L86 66 Z", "#7a5a40")
      + oval(52, 64, 28, 20, "#ecd5b4") + augen(60, 10, 3.6) + kreis(76, 64, 5.5, DUNKEL) + laecheln(72, 4) + wangen(68, 16) },
    { id: "koala", name: "Koala", zeichne: () =>
      kreis(22, 38, 16, "#9aa0a6") + kreis(78, 38, 16, "#9aa0a6") + kreis(22, 38, 9, "#e3e5e8") + kreis(78, 38, 9, "#e3e5e8")
      + kreis(50, 57, 28, "#9aa0a6") + augen(52, 13, 3.8) + oval(50, 63, 7, 9, DUNKEL) + kreis(48, 60, 1.8, "#fff") },
    { id: "affe", name: "Affe", zeichne: () =>
      kreis(22, 54, 10, "#8a5a3b") + kreis(78, 54, 10, "#8a5a3b") + kreis(22, 54, 5.5, "#e9c49f") + kreis(78, 54, 5.5, "#e9c49f")
      + kreis(50, 54, 29, "#8a5a3b") + kreis(41, 50, 11, "#e9c49f") + kreis(59, 50, 11, "#e9c49f") + oval(50, 66, 17, 12, "#e9c49f")
      + augen(50, 9, 3.8) + kreis(47, 62, 1.4, DUNKEL) + kreis(53, 62, 1.4, DUNKEL) + laecheln(68, 6) },
    { id: "kueken", name: "Küken", zeichne: () =>
      linie("M50 28 q-4 -8 2 -12M50 28 q4 -8 -2 -14", 3, "#e6a800") + kreis(50, 56, 29, "#ffd23f")
      + augen(52, 11) + pfad("M43 59 L57 59 L50 67 Z", "#f28a1e") + wangen(63, 18) },
  ];

  const tier = id => TIERE.find(t => t.id === id);
  const farbe = id => FARBEN.find(f => f.id === id);
  /** Kennung zerlegen; null, wenn Tier oder Farbe unbekannt. */
  function zerlege(kennung) {
    const [t, f] = String(kennung || "").split("-");
    return tier(t) && farbe(f) ? { tier: tier(t), farbe: farbe(f) } : null;
  }
  let zaehler = 0; // je Bild eine eigene Id für den Zuschnitt (mehrere Avatare auf einer Seite)
  /** SVG als Text; ohne gültige Kennung null. */
  function svg(kennung, groesse = 48) {
    const a = zerlege(kennung);
    if (!a) return null;
    const id = `avatar-rund-${++zaehler}`;
    return `<svg class="avatar-bild" viewBox="0 0 100 100" width="${groesse}" height="${groesse}" role="img" aria-label="${a.tier.name}">`
      + `<defs><clipPath id="${id}"><circle cx="50" cy="50" r="46"/></clipPath></defs>`
      + kreis(50, 50, 48, a.farbe.hell, ` stroke="${a.farbe.rand}" stroke-width="4"`)
      + `<g clip-path="url(#${id})">${a.tier.zeichne()}</g></svg>`;
  }
  return { TIERE, FARBEN, zerlege, svg, name: kennung => zerlege(kennung)?.tier.name || null };
})();
