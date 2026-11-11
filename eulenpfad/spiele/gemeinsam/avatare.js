/* Avatare (Entscheide AV1 a, AV2 a, AV3 a, LERN_Session12; docs/eulenpfad/konzept_profil_kind.md).
   Ein Kind wählt sein Bild selbst: ein gezeichnetes Motiv (Tiere, Weltall und Technik, Fantasie, aus den Spielen; ab
   Gold eines Abzeichens auch dessen Symbol, AV4 a, AV5 a) auf einer Hintergrundfarbe, dazu einen Rahmen (AV6 a). Eigene SVG statt Emoji, damit es
   auf jedem Gerät gleich aussieht (auch im geteilten Abzeichen-Bild). Gespeichert wird nur die Kennung „<motiv>-<farbe>[-<rahmen>]“
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

  // Weitere Sätze (Entscheid AV4 a, LERN_Session12): gezeichnet wie die Tiere, dieselben Farben.
  const eck = (x, y, b, h, r, f, extra = "") => `<rect x="${x}" y="${y}" width="${b}" height="${h}" rx="${r}" fill="${f}"${extra}/>`;
  const schrift = (x, y, t, groesse, f = DUNKEL) => `<text x="${x}" y="${y}" font-family="Nunito, 'Segoe UI', Arial, sans-serif" font-weight="900" font-size="${groesse}" text-anchor="middle" fill="${f}">${t}</text>`;
  /** Stern mit fünf Zacken um (x, y). */
  const stern = (x, y, r, f, extra = "") => `<polygon points="${[...Array(10)].map((_, i) => {
    const w = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
    return `${(x + rr * Math.cos(w)).toFixed(1)},${(y + rr * Math.sin(w)).toFixed(1)}`; }).join(" ")}" fill="${f}" stroke-linejoin="round"${extra}/>`;
  const funkeln = (x, y, r, f = "#fff") => pfad(`M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`, f);

  const WELTALL = [
    { id: "rakete", name: "Rakete", zeichne: () =>
      pfad("M38 58 L26 74 L38 70 Z", "#e5484d") + pfad("M62 58 L74 74 L62 70 Z", "#e5484d")
      + pfad("M43 70 L50 90 L57 70 Z", "#f5a623") + pfad("M46 70 L50 82 L54 70 Z", "#ffe27a")
      + pfad("M50 12 C64 24 66 46 62 70 L38 70 C34 46 36 24 50 12 Z", "#f1f3f8", ' stroke="#c3c9d8" stroke-width="2"')
      + kreis(50, 40, 9, "#6ec6ff", ' stroke="#8a94a8" stroke-width="3"') + kreis(47, 37, 2.5, "#fff") + pfad("M44 22 Q50 14 56 22 Z", "#e5484d") },
    { id: "roboter", name: "Roboter", zeichne: () =>
      linie("M50 28 V18", 3, "#8a94a8") + kreis(50, 16, 4, "#e5484d")
      + eck(18, 44, 8, 16, 3, "#8a94a8") + eck(74, 44, 8, 16, 3, "#8a94a8")
      + eck(24, 28, 52, 46, 10, "#b8c2d6", ' stroke="#8a94a8" stroke-width="2"')
      + kreis(39, 46, 7, "#fff") + kreis(61, 46, 7, "#fff") + kreis(39, 46, 3.5, "#2f8fe0") + kreis(61, 46, 3.5, "#2f8fe0")
      + eck(36, 60, 28, 7, 2, DUNKEL) + linie("M43 60v7M50 60v7M57 60v7", 1.6, "#b8c2d6") + eck(30, 76, 40, 16, 6, "#b8c2d6") },
    { id: "ufo", name: "Ufo", zeichne: () =>
      pfad("M34 52 Q34 28 50 28 Q66 28 66 52 Z", "#9fe3ff", ' opacity=".9"') + kreis(50, 44, 7, "#7ad66b") + kreis(47.5, 43, 1.8, DUNKEL) + kreis(52.5, 43, 1.8, DUNKEL)
      + oval(50, 58, 34, 11, "#8e9bb5") + oval(50, 55, 26, 6, "#b8c2d6")
      + [26, 38, 50, 62, 74].map(x => kreis(x, 60, 2.8, "#ffd23f")).join("") + pfad("M40 68 L34 86 H66 L60 68 Z", "#fff6b0", ' opacity=".55"') },
    { id: "planet", name: "Planet", zeichne: () =>
      funkeln(22, 24, 5) + funkeln(78, 78, 4) + kreis(78, 22, 2, "#fff") + kreis(50, 52, 22, "#f39a3b")
      + linie("M30 46 Q50 52 70 44M29 58 Q50 64 71 56", 4, "#d9822b")
      + `<ellipse cx="50" cy="52" rx="38" ry="10" fill="none" stroke="#ffd166" stroke-width="5" transform="rotate(-18 50 52)"/>` },
    { id: "astronaut", name: "Astronaut", zeichne: () =>
      pfad("M20 92 Q22 70 50 70 Q78 70 80 92 Z", "#f1f3f8", ' stroke="#c3c9d8" stroke-width="2"') + kreis(50, 46, 28, "#f1f3f8", ' stroke="#c3c9d8" stroke-width="3"')
      + oval(50, 47, 20, 16, "#2d3a6b") + pfad("M36 42 Q40 34 48 33", "none", ' stroke="#9fe3ff" stroke-width="4" stroke-linecap="round"')
      + kreis(76, 34, 4, "#e5484d") + eck(42, 78, 16, 8, 2, "#6ec6ff") },
    { id: "satellit", name: "Satellit", zeichne: () =>
      funkeln(80, 20, 4) + funkeln(20, 82, 4)
      + eck(10, 40, 26, 20, 2, "#2f6fd6", ' stroke="#9fc3ff" stroke-width="1.5"') + eck(64, 40, 26, 20, 2, "#2f6fd6", ' stroke="#9fc3ff" stroke-width="1.5"')
      + linie("M19 40v20M27 40v20M73 40v20M81 40v20M10 50h26M64 50h26", 1, "#9fc3ff") + linie("M36 50h6M58 50h6", 3, "#8a94a8")
      + eck(42, 38, 16, 24, 3, "#f2c14e", ' stroke="#c98400" stroke-width="1.5"') + linie("M50 38 V28", 2.4, "#8a94a8") + pfad("M42 28 Q50 18 58 28 Z", "#d9dbe6") },
  ];

  const FANTASIE = [
    { id: "drache", name: "Drache", zeichne: () =>
      pfad("M32 34 L28 16 L42 28 Z", "#ffd23f") + pfad("M68 34 L72 16 L58 28 Z", "#ffd23f")
      + kreis(50, 54, 28, "#4cbf73") + oval(50, 70, 18, 12, "#9be3a8") + pfad("M44 28 L50 18 L56 28 Z", "#2f9e5a")
      + augen(48, 12) + kreis(45, 68, 2, "#2f7a48") + kreis(55, 68, 2, "#2f7a48") + linie("M40 76 q10 6 20 0", 2.4, "#2f7a48") + wangen(60, 22) },
    { id: "einhorn", name: "Einhorn", zeichne: () =>
      pfad("M22 70 Q14 44 30 30 Q26 50 34 62 Z", "#e0569a") + pfad("M26 76 Q18 58 30 46 Q30 62 36 70 Z", "#8e5bd6")
      + pfad("M52 30 L58 4 L64 30 Z", "#ffd23f") + linie("M54 22l8-3M55 15l6-2", 1.6, "#e6a800")
      + oval(56, 56, 24, 28, "#fff", ' stroke="#e3e0ea" stroke-width="1.5"') + pfad("M40 36 L36 24 L48 32 Z", "#fff")
      + oval(62, 76, 14, 10, "#fbdcea") + kreis(58, 76, 1.6, "#c06090") + kreis(66, 76, 1.6, "#c06090")
      + linie("M50 52 q4 4 8 0", 2.6) + oval(66, 62, 5, 3.2, "#f7a8b8", ' opacity=".7"') },
    { id: "monster", name: "Monster", zeichne: () =>
      pfad("M32 30 L28 14 L42 26 Z", "#ffd23f") + pfad("M68 30 L72 14 L58 26 Z", "#ffd23f")
      + pfad("M20 82 Q18 30 50 26 Q82 30 80 82 Q72 76 65 82 Q58 76 50 82 Q42 76 35 82 Q28 76 20 82 Z", "#8e5bd6")
      + kreis(50, 48, 13, "#fff") + kreis(51, 49, 6, DUNKEL) + kreis(53, 46, 2, "#fff")
      + pfad("M38 66 Q50 74 62 66 Z", DUNKEL) + pfad("M42 66 L45 71 L48 67 Z", "#fff") + pfad("M52 67 L55 71 L58 66 Z", "#fff") },
    { id: "gespenst", name: "Gespenst", zeichne: () =>
      pfad("M24 84 L24 46 Q24 20 50 20 Q76 20 76 46 L76 84 Q70 78 63 84 Q56 78 50 84 Q44 78 37 84 Q30 78 24 84 Z", "#fff", ' stroke="#d9dbe6" stroke-width="2"')
      + oval(41, 46, 4.5, 6, DUNKEL) + oval(59, 46, 4.5, 6, DUNKEL) + oval(50, 60, 4, 5, DUNKEL) + wangen(54, 18) },
    { id: "zauberer", name: "Zauberhut", zeichne: () =>
      pfad("M50 10 L74 70 L26 70 Z", "#6366f1") + oval(50, 72, 36, 9, "#4b4fd0") + pfad("M31 60 L69 60 L72 68 L28 68 Z", "#ffd23f")
      + stern(48, 36, 6, "#ffd23f") + stern(58, 50, 4, "#fff") + kreis(42, 52, 2, "#fff") + funkeln(80, 26, 5, "#ffd23f") + funkeln(20, 38, 4, "#ffd23f") },
    { id: "nessie", name: "Seeungeheuer", zeichne: () =>
      pfad("M10 72 Q20 66 30 72 T50 72 T70 72 T90 72 V96 H10 Z", "#6ec6ff")
      + pfad("M60 72 Q60 56 70 56 Q80 56 80 72 Z", "#14b8a6") + pfad("M26 72 Q26 30 44 26 Q56 24 58 34 Q60 42 50 42 Q40 44 40 72 Z", "#14b8a6")
      + kreis(48, 32, 2.6, DUNKEL) + kreis(49, 31, 0.9, "#fff") + kreis(54, 37, 1.3, "#0d7a6e") + pfad("M38 30 L34 22 L42 26 Z", "#0d7a6e") },
  ];

  const AUS_DEN_SPIELEN = [
    { id: "zahlina", name: "Eule Zahlina", zeichne: () =>
      oval(50, 58, 28, 30, "#8e6b4f") + oval(50, 68, 16, 14, "#d8b98f")
      + kreis(38, 52, 10, "#fff", ' stroke="#2d3047" stroke-width="2.5"') + kreis(62, 52, 10, "#fff", ' stroke="#2d3047" stroke-width="2.5"') + linie("M48 52h4", 2.5)
      + kreis(39, 53, 4.5, DUNKEL) + kreis(61, 53, 4.5, DUNKEL) + pfad("M46 62 L54 62 L50 69 Z", "#f5a623")
      + pfad("M22 28 L50 18 L78 28 L50 38 Z", DUNKEL) + eck(38, 30, 24, 8, 2, DUNKEL) + linie("M74 28 v14", 2, "#ffd23f") + kreis(74, 44, 2.6, "#ffd23f") },
    { id: "lupe", name: "Lupe", zeichne: () =>
      linie("M60 62 L80 82", 10, "#8a5a32") + kreis(44, 44, 22, "#cfeeff", ' stroke="#5b6080" stroke-width="7"') + pfad("M32 38 Q36 28 46 28", "none", ' stroke="#fff" stroke-width="4" stroke-linecap="round"') },
    { id: "schatzkiste", name: "Schatzkiste", zeichne: () =>
      kreis(40, 40, 6, "#ffd23f") + kreis(52, 36, 6, "#ffd23f") + kreis(62, 41, 5, "#ffe27a")
      + pfad("M20 46 Q20 30 50 30 Q80 30 80 46 Z", "#a0714a") + eck(20, 46, 60, 34, 4, "#8a5a32")
      + linie("M20 46h60M34 30v50M66 30v50", 4, "#f2c14e") + eck(44, 50, 12, 12, 2, "#f2c14e") + kreis(50, 56, 2, DUNKEL) },
    { id: "bausteine", name: "Bausteine", zeichne: () =>
      eck(18, 56, 30, 18, 3, "#f07c2a", ' stroke="#c0581a" stroke-width="2"') + eck(52, 56, 30, 18, 3, "#f07c2a", ' stroke="#c0581a" stroke-width="2"')
      + eck(35, 36, 30, 18, 3, "#f07c2a", ' stroke="#c0581a" stroke-width="2"') + schrift(50, 50, "3 T", 12, "#fff") + schrift(33, 70, "4 H", 12, "#fff") + schrift(67, 70, "5 E", 12, "#fff") },
    { id: "pentomino", name: "Pentomino", zeichne: () =>
      [[40, 22], [22, 40], [40, 40], [58, 40], [40, 58]].map(([x, y]) => eck(x, y, 18, 18, 3, "#4cbf73", ' stroke="#2f7a48" stroke-width="2.5"')).join("") },
    { id: "ziffernkarte", name: "Ziffernkarte", zeichne: () =>
      `<g transform="rotate(-10 50 52)">` + eck(28, 20, 44, 62, 7, "#fff", ' stroke="#c3c9d8" stroke-width="2.5"') + kreis(36, 28, 3, "#8e5bd6") + kreis(64, 74, 3, "#8e5bd6") + schrift(50, 64, "7", 40) + `</g>` },
  ];

  // Abzeichen-Symbole (Entscheid AV5 a): ersetzen die Emoji der Abzeichen (Tab Erfolge, Teilen) und sind ab Gold des
  // jeweiligen Abzeichens als Avatar wählbar. Kennung „abz-<abzeichen>“.
  const ABZEICHEN = [
    { id: "abz-runden", name: "Fleissig", zeichne: () =>
      linie("M38 30 Q38 16 50 16 Q62 16 62 30", 4, "#a8401f") + eck(26, 28, 48, 56, 12, "#e5484d") + eck(34, 56, 32, 20, 6, "#f07c2a") + linie("M34 44h32", 3, "#a8401f") + kreis(50, 66, 2.5, "#ffd23f") },
    { id: "abz-drei-sterne", name: "Sternensammler", zeichne: () => stern(28, 58, 14, "#ffd23f", ' stroke="#e6a800" stroke-width="2"') + stern(72, 58, 14, "#ffd23f", ' stroke="#e6a800" stroke-width="2"') + stern(50, 40, 18, "#ffd23f", ' stroke="#e6a800" stroke-width="2"') },
    { id: "abz-perfekt", name: "Perfekt!", zeichne: () =>
      kreis(46, 54, 30, "#e5484d") + kreis(46, 54, 22, "#fff") + kreis(46, 54, 14, "#e5484d") + kreis(46, 54, 6, "#fff")
      + linie("M46 54 L78 22", 4, "#5b6080") + pfad("M78 22 L80 12 L86 18 L88 24 L78 22 Z", "#2f8fe0") },
    { id: "abz-ohne-tipp", name: "Aus eigener Kraft", zeichne: () =>
      oval(38, 50, 18, 22, "#f7a8c4") + oval(62, 50, 18, 22, "#f7a8c4") + linie("M50 30 V72", 2.4, "#c06090")
      + linie("M30 42 q6 -4 10 2M28 56 q8 2 12 -4M60 40 q6 -2 8 4M58 58 q8 4 12 -4", 2.2, "#c06090") },
    { id: "abz-koenigsstufe", name: "Königsstufe", zeichne: () =>
      pfad("M20 70 L16 32 L34 48 L50 24 L66 48 L84 32 L80 70 Z", "#ffd23f", ' stroke="#c98400" stroke-width="2.5" stroke-linejoin="round"')
      + eck(20, 70, 60, 10, 3, "#f2c14e", ' stroke="#c98400" stroke-width="2"') + kreis(50, 56, 5, "#e5484d") + kreis(34, 60, 3.5, "#2f8fe0") + kreis(66, 60, 3.5, "#4cbf73") },
    { id: "abz-alle-stufen", name: "Alle sechs Stufen", zeichne: () =>
      linie("M32 14 V88M68 14 V88", 6, "#8a5a32") + ["#14b8a6", "#6366f1", "#e9b300", "#f07c2a", "#8e5bd6", "#e0569a"].map((f, i) => linie(`M32 ${80 - i * 12}H68`, 5, f)).join("") },
    { id: "abz-meister", name: "Spiel-Meister", zeichne: () =>
      pfad("M34 52 V66 Q50 76 66 66 V52 Z", "#3a3f63") + pfad("M14 40 L50 26 L86 40 L50 54 Z", DUNKEL) + linie("M78 43 V62", 2.4, "#ffd23f") + kreis(78, 64, 3.5, "#ffd23f") },
    { id: "abz-entdecker", name: "Entdecker", zeichne: () =>
      kreis(50, 50, 32, "#f2c14e", ' stroke="#c98400" stroke-width="2"') + kreis(50, 50, 25, "#fff") + pfad("M50 26 L57 50 L50 50 Z", "#e5484d") + pfad("M50 26 L43 50 L50 50 Z", "#f06a6e")
      + pfad("M50 74 L43 50 L50 50 Z", "#5b6080") + pfad("M50 74 L57 50 L50 50 Z", "#8a94a8") + kreis(50, 50, 3, DUNKEL) + schrift(50, 23, "N", 7, "#e5484d") },
    { id: "abz-vielseitig", name: "Vielseitig", zeichne: () =>
      pfad("M50 18 Q86 18 84 52 Q82 70 66 66 Q56 64 58 74 Q60 86 46 84 Q16 80 16 50 Q16 18 50 18 Z", "#f1e3c8", ' stroke="#c9a46b" stroke-width="2"')
      + kreis(34, 40, 6, "#e5484d") + kreis(50, 32, 6, "#ffd23f") + kreis(66, 38, 6, "#4cbf73") + kreis(70, 54, 6, "#2f8fe0") + kreis(30, 60, 6, "#8e5bd6") + kreis(44, 70, 4, "#fff") },
    { id: "abz-mathe-ass", name: "Mathe-Ass", zeichne: () =>
      eck(20, 22, 60, 58, 12, "#2f8fe0") + schrift(50, 50, "1 2 3", 17, "#fff") + schrift(50, 72, "+ − ×", 15, "#cfe6ff") },
    { id: "abz-deutsch-ass", name: "Deutsch-Ass", zeichne: () =>
      eck(18, 64, 64, 12, 3, "#e5484d") + eck(22, 50, 58, 12, 3, "#2f8fe0") + eck(20, 36, 60, 12, 3, "#4cbf73")
      + `<rect x="34" y="14" width="12" height="22" rx="2" fill="#ffd23f" transform="rotate(12 40 25)"/>` + linie("M26 70h48M30 56h44M28 42h46", 1.4, "#fff") },
    { id: "abz-forscher", name: "Forschen", zeichne: () =>
      pfad("M42 18 H58 V40 L76 76 Q78 84 70 84 H30 Q22 84 24 76 L42 40 Z", "#e8f6ff", ' stroke="#8a94a8" stroke-width="3"')
      + pfad("M32 62 H68 L75 77 Q76 81 71 81 H29 Q24 81 25 77 Z", "#4cbf73") + kreis(44, 70, 3, "#c8f5d2") + kreis(56, 66, 2, "#c8f5d2") + kreis(52, 52, 2.5, "#9be3a8") + linie("M40 18h20", 3, "#8a94a8") },
    { id: "abz-sprachtalent", name: "Sprachtalent", zeichne: () =>
      pfad("M14 22 H58 Q64 22 64 28 V48 Q64 54 58 54 H30 L20 64 V54 H20 Q14 54 14 48 V28 Q14 22 20 22 Z", "#6366f1") + schrift(39, 45, "Hi", 18, "#fff")
      + pfad("M42 46 H80 Q86 46 86 52 V70 Q86 76 80 76 H76 V86 L66 76 H48 Q42 76 42 70 V52 Q42 46 48 46 Z", "#e0569a") + schrift(64, 68, "Salut", 12, "#fff") },
    { id: "abz-endlos", name: "Endlos-Läufer", zeichne: () =>
      `<path d="M30 36 C16 36 10 44 10 50 C10 56 16 64 30 64 C46 64 54 36 70 36 C84 36 90 44 90 50 C90 56 84 64 70 64 C54 64 46 36 30 36 Z" fill="none" stroke="#8e5bd6" stroke-width="9" stroke-linejoin="round"/>`
      + stern(50, 50, 6, "#ffd23f") },
    { id: "abz-mix", name: "Mix-Meister", zeichne: () =>
      `<g transform="rotate(-14 50 50)">` + eck(24, 24, 52, 52, 10, "#fff", ' stroke="#c3c9d8" stroke-width="3"')
      + [[36, 36], [64, 36], [50, 50], [36, 64], [64, 64]].map(([x, y]) => kreis(x, y, 5, y === 50 ? "#e5484d" : DUNKEL)).join("") + `</g>` },
    { id: "abz-wochenstern", name: "Wochenstern", zeichne: () => stern(50, 52, 32, "#ffd23f", ' stroke="#e6a800" stroke-width="2.5"') + funkeln(18, 22, 7, "#ffd23f") + funkeln(84, 30, 6, "#ffd23f") + funkeln(78, 82, 5, "#ffd23f") + kreis(44, 44, 4, "#fff3b0") },
    { id: "abz-dranbleiber", name: "Dranbleiber", zeichne: () =>
      eck(18, 22, 64, 62, 8, "#fff", ' stroke="#c3c9d8" stroke-width="2.5"') + pfad("M18 30 Q18 22 26 22 H74 Q82 22 82 30 V38 H18 Z", "#e5484d") + linie("M34 16 v12M66 16 v12", 4, "#5b6080")
      + [[30, 50], [50, 50], [70, 50], [30, 68], [50, 68]].map(([x, y]) => linie(`M${x - 6} ${y} l4 5 l8 -9`, 3, "#4cbf73")).join("") + kreis(70, 68, 4, "#d9dbe6") },
    { id: "abz-fehlerfinder", name: "Fehlerfinder", zeichne: () =>
      pfad("M36 10 L44 36 L50 30 L56 36 L64 10 Z", "#2f8fe0") + kreis(50, 60, 26, "#f2c14e", ' stroke="#c98400" stroke-width="3"')
      + oval(50, 62, 13, 15, "#e5484d") + kreis(50, 48, 6, DUNKEL) + linie("M50 50 V77", 1.6) + kreis(44, 58, 2.4, DUNKEL) + kreis(56, 58, 2.4, DUNKEL) + kreis(45, 68, 2.4, DUNKEL) + kreis(55, 68, 2.4, DUNKEL) },
    { id: "abz-fruehaufsteher", name: "Frühaufsteher", zeichne: () =>
      eck(0, 0, 100, 64, 0, "#ffd9b0") + [...Array(7)].map((_, i) => { const w = Math.PI + (i + 0.5) * Math.PI / 7; return linie(`M${50 + 26 * Math.cos(w)} ${64 + 26 * Math.sin(w)} L${50 + 38 * Math.cos(w)} ${64 + 38 * Math.sin(w)}`, 4, "#f5a623"); }).join("")
      + pfad("M28 64 A22 22 0 0 1 72 64 Z", "#ffd23f") + eck(0, 64, 100, 36, 0, "#4cbf73") + linie("M10 76 q20 -6 40 0 t40 0", 3, "#2f9e5a") },
    // Probe-Stempel (LERN_Session13): nachgerechnet statt „nicht sicher“ — Lupe über einem Häkchen
    { id: "abz-nachgerechnet", name: "Ganz sicher", zeichne: () =>
      linie("M24 52 L40 68 L72 30", 9, "#4cbf73") + kreis(62, 58, 18, "rgba(255,255,255,.35)", ' stroke="#5b6080" stroke-width="5"')
      + linie("M75 71 L88 84", 7, "#5b6080") },
    // NZ1 a (LERN_Session13): im Kopf gerechnet, wo Notizen angeboten waren — Kopf mit Rechenzeichen, Notizzettel durchgestrichen
    { id: "abz-kopfrechner", name: "Kopfrechner", zeichne: () =>
      kreis(50, 50, 32, "#ffd9a8", ' stroke="#d9925a" stroke-width="2.5"') + schrift(38, 50, "+", 22, "#2f8fe0") + schrift(62, 50, "×", 22, "#e5484d")
      + schrift(38, 72, "−", 22, "#4cbf73") + schrift(62, 72, ":", 22, "#8e5bd6")
      + eck(70, 12, 20, 24, 3, "#fffbea", ' stroke="#c9b87a" stroke-width="2"') + linie("M70 36 L90 12", 3, "#e5484d") },
    // Klassenaufstieg (LERN_Session14): Schulhaus mit Glocke, daneben ein Pfeil nach oben
    { id: "abz-aufgestiegen", name: "Aufgestiegen", zeichne: () =>
      pfad("M12 46 L40 24 L68 46 Z", "#e5484d", ' stroke="#a8401f" stroke-width="2" stroke-linejoin="round"')
      + eck(18, 46, 44, 38, 2, "#f2c14e", ' stroke="#c98400" stroke-width="2"') + eck(34, 62, 12, 22, 2, "#8a5a32")
      + eck(22, 52, 9, 9, 1, "#cfe6ff") + eck(49, 52, 9, 9, 1, "#cfe6ff") + kreis(40, 36, 4, "#ffd23f")
      + linie("M82 80 V22", 6, "#14b8a6") + linie("M70 34 L82 20 L94 34", 6, "#14b8a6") },
  ];

  // Sätze im Profil; abzeichen: erst wählbar, wenn das Abzeichen Gold hat (AV5 a, freigeschaltet bestimmt erfolge.js).
  const SAETZE = [
    { id: "tiere", name: "Tiere", motive: TIERE },
    { id: "weltall", name: "Weltall und Technik", motive: WELTALL },
    { id: "fantasie", name: "Fantasie", motive: FANTASIE },
    { id: "spiele", name: "Aus den Spielen", motive: AUS_DEN_SPIELEN },
    { id: "abzeichen", name: "Abzeichen", motive: ABZEICHEN, freischalten: true },
  ];
  // Rahmen (Entscheid AV6 a): einfach immer; Gold, Platin und Diamant ab dem ersten Abzeichen in diesem Rang.
  const RAHMEN = [
    { id: "einfach", name: "Einfach" },
    { id: "gold", name: "Gold", rang: "gold" },
    { id: "platin", name: "Platin", rang: "platin" },
    { id: "diamant", name: "Diamant", rang: "diamant" },
  ];
  // Form des Rahmens (Wunsch Patrik LERN_Session32): das Kind wählt sie im Profil; rund ist die Vorgabe. ecken: Zahl der
  // Ecken, dreh: Winkel der ersten Ecke, k: wie stark die Ecken gegenüber dem Kreis hervortreten (sonst würde das Motiv
  // im Dreieck zu stark beschnitten). In der Kennung nur, wenn nicht rund.
  const FORMEN = [
    { id: "rund", name: "Rund", ecken: 0 },
    { id: "quadrat", name: "Quadrat", ecken: 4, dreh: -Math.PI / 4, k: 0.8 },
    { id: "spitzoben", name: "Dreieck, Spitze oben", ecken: 3, dreh: -Math.PI / 2, k: 0.55 },
    { id: "spitzunten", name: "Dreieck, Spitze unten", ecken: 3, dreh: Math.PI / 2, k: 0.55 },
    { id: "fuenfeck", name: "Fünfeck", ecken: 5, dreh: -Math.PI / 2, k: 0.7 },
  ];
  const ALLE = SAETZE.flatMap(s => s.motive.map(m => ({ ...m, satz: s.id })));
  const motiv = id => ALLE.find(m => m.id === id);
  const farbe = id => FARBEN.find(f => f.id === id);
  const rahmen = id => RAHMEN.find(r => r.id === id);
  const formVon = id => FORMEN.find(f => f.id === id);
  /** Kennung „<motiv>-<farbe>[-<rahmen>][-<form>]“ zerlegen (Motive dürfen Bindestriche haben); null, wenn unbekannt. */
  function zerlege(kennung) {
    const teile = String(kennung || "").split("-");
    const fo = formVon(teile.at(-1)) ? formVon(teile.pop()) : FORMEN[0];
    const r = rahmen(teile.at(-1)) ? rahmen(teile.pop()) : RAHMEN[0];
    const f = farbe(teile.pop());
    const m = motiv(teile.join("-"));
    return m && f ? { motiv: m, farbe: f, rahmen: r, form: fo } : null;
  }
  const kennung = (motivId, farbId, rahmenId = "einfach", formId = "rund") =>
    `${motivId}-${farbId}${rahmenId && rahmenId !== "einfach" ? `-${rahmenId}` : ""}${formId && formId !== "rund" ? `-${formId}` : ""}`;

  let zaehler = 0; // je Bild eigene Ids für Zuschnitt und Verläufe (mehrere Avatare auf einer Seite)

  // ----- Form zeichnen: Kreis oder Vieleck, im Stil „wie von Hand gezeichnet“ leicht verformt -----
  // form.r(w) ist der Abstand der Mitte des Bandes von (50, 50) im Winkel w, form.d(w) seine Dicke. Vielecke: zwischen
  // Kreis (46.5) und Vieleck (Umkreis 54) gemischt, damit die Ecken gerundet bleiben und das Motiv sichtbar. „hand“: der
  // Rand wellt sich langsam, das Band ist mal dicker, mal dünner (je Motiv und Farbe gleich).
  const KREIS = { r: () => 47, d: (_, d) => d, pfad: false };
  function formFuer(fo, hand, saat) {
    if (!hand && !fo.ecken) return KREIS;
    const vieleck = w => {
      if (!fo.ecken) return 46.5;
      const teil = (2 * Math.PI) / fo.ecken, phi = ((((w - fo.dreh) % teil) + teil) % teil) - teil / 2;
      return (1 - fo.k) * 46.5 + fo.k * (54 * Math.cos(Math.PI / fo.ecken)) / Math.cos(phi);
    };
    // Ecken höchstens 48 von der Mitte: mit Band und Schmuck (der grosse Diamant auf der Spitze oben) bleibt alles im
    // Bild (Radius 56; gemessen LERN_Session32)
    if (!hand) return { r: w => Math.min(48, vieleck(w)), d: (_, d) => d, pfad: true };
    let h = 2166136261;
    for (const c of saat) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    const z = () => { h = (h + 0x6d2b79f5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const p1 = z() * 6.3, p2 = z() * 6.3, p3 = z() * 6.3, f1 = 2 + Math.floor(z() * 2), f2 = 5 + Math.floor(z() * 3);
    return {
      pfad: true,
      r: w => Math.min(50, vieleck(w)) + 1.6 * Math.sin(f1 * w + p1) + 0.8 * Math.sin(f2 * w + p2),
      d: (w, d) => d * (1 + 0.45 * Math.sin(f1 * w + p3)),
    };
  }
  /** Geschlossener Pfad im Abstand r(w) + versatz(w) um (50, 50). */
  const umrissPfad = (r, versatz = () => 0, n = 96) => "M" + [...Array(n)].map((_, i) => {
    const w = (i / n) * 2 * Math.PI, q = r(w) + versatz(w);
    return `${(50 + q * Math.cos(w)).toFixed(2)},${(50 + q * Math.sin(w)).toFixed(2)}`;
  }).join(" L") + " Z";
  /** Band des Rahmens: Fläche zwischen aussen und innen, Dicke d (je Winkel veränderlich bei „hand“). */
  const band = (form, d, fuellung) => form.pfad
    ? `<path d="${umrissPfad(form.r, w => form.d(w, d) / 2)} ${umrissPfad(form.r, w => -form.d(w, d) / 2)}" fill="${fuellung}" fill-rule="evenodd"/>`
    : `<circle cx="50" cy="50" r="47" fill="none" stroke="${fuellung}" stroke-width="${d}"/>`;

  /** Rahmen um die Form: einfach in der Farbe, sonst Gold, Platin oder Diamant. */
  function rahmenSvg(r, f, id, form = KREIS) {
    const verlauf = (stopps) => `<linearGradient id="${id}-v" x1="0" y1="0" x2="1" y2="1">${stopps.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;
    const ring = breite => band(form, breite, `url(#${id}-v)`);
    // Schmuck auf dem Band: im Winkel w im Abstand r(w) (+ aussen) von der Mitte
    const auf = (w, aussen = 0) => [50 + (form.r(w) + aussen) * Math.cos(w), 50 + (form.r(w) + aussen) * Math.sin(w)];
    const rund = (n, fn) => [...Array(n)].map((_, i) => fn(-Math.PI / 2 + i * 2 * Math.PI / n)).join("");
    if (r.id === "gold") return `<defs>${verlauf([[0, "#fff3b0"], [0.45, "#ffc107"], [1, "#c98400"]])}</defs>` + ring(7)
      + rund(12, w => { const [x, y] = auf(w); return kreis(x.toFixed(1), y.toFixed(1), 2.8, "#fff7cc", ' stroke="#c98400" stroke-width="1"'); });
    if (r.id === "platin") return `<defs>${verlauf([[0, "#ffffff"], [0.5, "#cfd6e3"], [1, "#8a94a8"]])}</defs>` + ring(7)
      + [-1, 1].map(s => [...Array(6)].map((_, i) => {
        const w = Math.PI / 2 + s * (0.35 + i * 0.32), [x, y] = auf(w, 3);
        return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.4" ry="7" fill="#e6ebf3" stroke="#8a94a8" stroke-width="1" transform="rotate(${(w * 180 / Math.PI + 90 + s * 35).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      }).join("")).join("");
    if (r.id === "diamant") return `<defs>${verlauf([[0, "#ffffff"], [0.4, "#9fe3ff"], [1, "#2f8fe0"]])}</defs>` + ring(6)
      + rund(8, w => { const [x, y] = auf(w), g = w === -Math.PI / 2 ? 8 : 5;
        return `<polygon points="${x.toFixed(1)},${(y - g).toFixed(1)} ${(x + g * 0.75).toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${(y + g).toFixed(1)} ${(x - g * 0.75).toFixed(1)},${y.toFixed(1)}" fill="#e0f7ff" stroke="#2f8fe0" stroke-width="1.2"/>`; });
    return band(form, 4, f.rand);
  }
  /**
   * SVG als Text; ohne gültige Kennung null. Form aus der Kennung (rund, Quadrat, Dreiecke, Fünfeck); opt.hand: leicht
   * verformt (Stil „wie von Hand gezeichnet“), ohne Angabe nach der Einstellung stil (STIL in spiel.js).
   */
  function svg(k, groesse = 48, opt = {}) {
    const a = zerlege(k);
    if (!a) return null;
    const id = `avatar-${++zaehler}`;
    const hand = opt.hand ?? (typeof STIL !== "undefined" && STIL.an());
    const form = formFuer(a.form, hand, `${a.motiv.id}-${a.farbe.id}`);
    const flaeche = form.pfad ? `<path d="${umrissPfad(form.r)}" fill="${a.farbe.hell}"/>` : kreis(50, 50, 47, a.farbe.hell);
    const zuschnitt = form.pfad ? `<path d="${umrissPfad(form.r, () => -1)}"/>` : `<circle cx="50" cy="50" r="46"/>`;
    return `<svg class="avatar-bild" viewBox="-6 -6 112 112" width="${groesse}" height="${groesse}" role="img" aria-label="${a.motiv.name}">`
      + `<defs><clipPath id="${id}-rund">${zuschnitt}</clipPath></defs>`
      + flaeche + `<g clip-path="url(#${id}-rund)">${a.motiv.zeichne()}</g>` + rahmenSvg(a.rahmen, a.farbe, id, form) + `</svg>`;
  }
  /** Nur das Motiv ohne Kreis (Abzeichen-Symbol im Tab Erfolge); null, wenn unbekannt. */
  function motivSvg(id, groesse = 48) {
    const m = motiv(id);
    return m ? `<svg class="motiv-bild" viewBox="0 0 100 100" width="${groesse}" height="${groesse}" role="img" aria-label="${m.name}">${m.zeichne()}</svg>` : null;
  }
  return { SAETZE, FARBEN, RAHMEN, FORMEN, zerlege, kennung, svg, motivSvg, motiv, name: k => zerlege(k)?.motiv.name || null };
})();
