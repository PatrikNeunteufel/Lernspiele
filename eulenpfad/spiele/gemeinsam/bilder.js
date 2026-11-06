/* Bildersammlung (Entscheid B1 a, LERN_Session16; rahmen.md Abschnitt 22): einzige Quelle für Bilder, die es nicht als
   Emoji gibt. Inhaltslisten nennen sie wie ein Emoji, nur als „svg:<name>“ (z. B. ["Luchs", "svg:luchs", …]); der Rahmen
   zeichnet sie überall, wo ein Bild steht — Knöpfe, Karten, Körbe (LS.bild) und beide Prüfansichten.

   Je Bild: name (wofür es steht, für die Prüfung), box (viewBox), svg (Inhalt des <svg>, nur Formen mit eigenen Farben,
   keine Klassen und keine Skripte). Gezeichnet so, dass die Art an ihren Kennzeichen erkennbar ist (Ohrpinsel des
   Luchses, Kehlfleck des Baummarders, Kammfühler des Nachtfalters …); ein neues oder geändertes Bild gilt wie ein
   Listeneintrag als ungeprüft, bis es in der Prüfansicht abgehakt ist (E1 a).

   Nicht hierher gehören Zeichnungen, die ein Spiel aus Werten baut (Gegenteil-Wippe: Grösse je Stufe, Pakete). */
"use strict";
const BILDER = (() => {
  /** Kreisförmig wiederholte Form (Blütenblätter, Hüllblätter): n Kopien um (cx, cy). */
  const rund = (n, cx, cy, form, start = 0) => Array.from({ length: n }, (_, i) =>
    `<g transform="rotate(${start + (i * 360) / n} ${cx} ${cy})">${form}</g>`).join("");
  /** Spiegelbild an der senkrechten Mitte x = 50. */
  const gespiegelt = form => `<g transform="translate(100 0) scale(-1 1)">${form}</g>`;
  /** Salamander von oben: schwarzer Körper, flecken = Liste [cx, cy, rx, ry, winkel] der gelben Flecken; glanz für schwarz-glänzend. */
  function salamander(flecken, glanz) {
    const bein = (x, y, wx, wy) => `<path d="M${x} ${y} Q${x + wx * 0.6} ${y + wy * 0.3} ${x + wx} ${y + wy}" stroke="#1b1b1f" stroke-width="6" fill="none" stroke-linecap="round"/>`
      + `<path d="M${x + wx} ${y + wy} l${wx > 0 ? 4 : -4} ${wy > 0 ? 3 : -3} M${x + wx} ${y + wy} l${wx > 0 ? 5 : -5} 0 M${x + wx} ${y + wy} l0 ${wy > 0 ? 5 : -5}" stroke="#1b1b1f" stroke-width="2.4" stroke-linecap="round"/>`;
    return bein(64, 44, 8, -16) + bein(64, 56, 8, 16) + bein(30, 45, -8, -16) + bein(30, 55, -8, 16)
      + `<path d="M24 50 Q12 52 6 62 Q4 70 12 72" stroke="#1b1b1f" stroke-width="7" fill="none" stroke-linecap="round"/>`
      + `<ellipse cx="46" cy="50" rx="25" ry="10" fill="#1b1b1f"/>`
      + `<ellipse cx="78" cy="50" rx="13" ry="10.5" fill="#1b1b1f"/>`
      + `<circle cx="84" cy="42" r="3.4" fill="#2c2c33"/><circle cx="84" cy="58" r="3.4" fill="#2c2c33"/>`
      + `<circle cx="85" cy="41.5" r="1.1" fill="#fff"/><circle cx="85" cy="57.5" r="1.1" fill="#fff"/>`
      + flecken.map(([cx, cy, rx, ry, w]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${w} ${cx} ${cy})" fill="#f5c400"/>`).join("")
      + (glanz ? `<path d="M30 45 Q46 41 62 45" stroke="#7d7d88" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M72 44 Q78 41 84 45" stroke="#7d7d88" stroke-width="2" fill="none" stroke-linecap="round"/>` : "");
  }
  const WASSER = `<path d="M0 86 Q12 82 25 86 T50 86 T75 86 T100 86 V100 H0 Z" fill="#8cc8ee"/>`;
  const GRAS = `<path d="M0 92 L6 84 L9 92 L15 82 L19 92 L26 85 L30 92 L38 83 L41 92 L50 86 L54 92 L62 83 L66 92 L74 85 L77 92 L86 82 L90 92 L96 85 L100 92 V100 H0 Z" fill="#6aa84f"/>`;
  const ERDE = `<rect x="0" y="86" width="100" height="14" fill="#8b6a4a"/>`;
  const FELS = `<path d="M0 100 L0 88 Q14 80 30 86 Q44 78 62 86 Q80 80 100 88 V100 Z" fill="#a7a9ad"/>`;

  return {
    // ---------- Früher und heute (frueher-heute) ----------
    waschbrett: { name: "Waschbrett", box: "0 0 60 80",
      svg: `<rect x="8" y="2" width="44" height="76" rx="5" fill="#b7814f"/><rect x="14" y="18" width="32" height="52" rx="2" fill="#d4d9e0"/>`
        + Array.from({ length: 9 }, (_, i) => `<line x1="15" y1="${22 + i * 5.5}" x2="45" y2="${22 + i * 5.5}" stroke="#8d96a3" stroke-width="2.4"/>`).join("") },
    waschmaschine: { name: "Waschmaschine", box: "0 0 64 72",
      svg: `<rect x="4" y="4" width="56" height="64" rx="7" fill="#f4f6f9" stroke="#8a94a6" stroke-width="3"/><line x1="4" y1="18" x2="60" y2="18" stroke="#8a94a6" stroke-width="2"/><circle cx="14" cy="11" r="3.5" fill="#8a94a6"/><rect x="34" y="8" width="20" height="6" rx="2" fill="#cfd5de"/><circle cx="32" cy="43" r="17" fill="#cfe6ff" stroke="#8a94a6" stroke-width="4"/><path d="M19 47 q6.5 -6 13 0 q6.5 6 13 0" stroke="#4d93dc" fill="none" stroke-width="3"/>` },

    // ---------- Schulinstrumente (instrumente) ----------
    triangel: { name: "Triangel", box: "0 0 100 100",
      svg: `<path d="M50,12 L88,82 L16,82 L46,26" fill="none" stroke="#8a8fa8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><line x1="62" y1="40" x2="92" y2="20" stroke="#8a8fa8" stroke-width="4" stroke-linecap="round"/>` },
    klangstab: { name: "Klangstab", box: "0 0 100 100",
      svg: `<rect x="10" y="58" width="80" height="22" rx="4" fill="#c58b52" stroke="#7a4f26" stroke-width="3"/><rect x="18" y="40" width="64" height="14" rx="4" fill="#b9bfd6" stroke="#6b6f8a" stroke-width="3"/><line x1="70" y1="10" x2="52" y2="36" stroke="#8a8fa8" stroke-width="4" stroke-linecap="round"/><circle cx="72" cy="10" r="6" fill="#e0569a"/>` },
    schlagholz: { name: "Schlagholz", box: "0 0 100 100",
      svg: `<rect x="8" y="30" width="62" height="14" rx="7" transform="rotate(-20 39 37)" fill="#c58b52" stroke="#7a4f26" stroke-width="3"/><rect x="30" y="58" width="62" height="14" rx="7" transform="rotate(15 61 65)" fill="#c58b52" stroke="#7a4f26" stroke-width="3"/>` },

    // ---------- Tiere und Pflanzen ohne Emoji (tier-sortierer/tiere.js, lebensraum/nahrung.js) ----------
    luchs: { name: "Luchs (Kopf: Ohrpinsel, Backenbart, Tupfen)", box: "-4 -6 108 108",
      svg: `<path d="M29 9 L27 0" stroke="#1b1b1f" stroke-width="3.2" stroke-linecap="round"/><path d="M71 9 L73 0" stroke="#1b1b1f" stroke-width="3.2" stroke-linecap="round"/>`
        + `<path d="M20 34 L29 8 L42 28 Z" fill="#c99a62" stroke="#5a4127" stroke-width="2"/><path d="M80 34 L71 8 L58 28 Z" fill="#c99a62" stroke="#5a4127" stroke-width="2"/>`
        + `<path d="M25 25 L29 13 L35 25 Z" fill="#3a2c22"/><path d="M75 25 L71 13 L65 25 Z" fill="#3a2c22"/>`
        + `<path d="M16 48 L6 66 L20 70 L14 84 L32 82 L38 95 L50 87 L62 95 L68 82 L86 84 L80 70 L94 66 L84 48 Z" fill="#efdcb6" stroke="#b49568" stroke-width="1.5"/>`
        + `<ellipse cx="50" cy="52" rx="31" ry="29" fill="#d6a86d" stroke="#5a4127" stroke-width="2"/>`
        + `<ellipse cx="50" cy="68" rx="15" ry="11" fill="#f7ecd8"/>`
        + [[30, 40], [70, 40], [27, 55], [73, 55], [40, 31], [60, 31], [50, 28], [34, 64], [66, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.3" fill="#6e4b2c"/>`).join("")
        + `<ellipse cx="38" cy="48" rx="6.5" ry="5.5" fill="#e3b53a" stroke="#3a2c22" stroke-width="1.2"/><ellipse cx="38" cy="48" rx="1.7" ry="4.4" fill="#1b1b1f"/>`
        + `<ellipse cx="62" cy="48" rx="6.5" ry="5.5" fill="#e3b53a" stroke="#3a2c22" stroke-width="1.2"/><ellipse cx="62" cy="48" rx="1.7" ry="4.4" fill="#1b1b1f"/>`
        + `<path d="M45 59 L55 59 L50 65 Z" fill="#b8706a"/><path d="M50 65 Q45 71 40 68 M50 65 Q55 71 60 68" stroke="#5a4127" stroke-width="1.6" fill="none"/>` },
    maulwurf: { name: "Maulwurf (schwarz, Grabhände, rosa Rüssel)", box: "0 0 100 100",
      svg: ERDE + `<path d="M58 88 Q72 66 92 88 Z" fill="#6f5238"/>`
        + `<path d="M14 58 Q8 56 6 62" stroke="#e7a2ad" stroke-width="3" fill="none" stroke-linecap="round"/>`
        + `<ellipse cx="46" cy="64" rx="34" ry="19" fill="#2b2930"/>`
        + `<path d="M74 56 Q86 58 98 66 Q88 70 76 72 Z" fill="#2b2930"/><path d="M88 63 Q94 64 98 66 Q93 68 88 68 Z" fill="#e7a2ad"/>`
        + `<ellipse cx="74" cy="80" rx="10" ry="6" fill="#e7a2ad" transform="rotate(-20 74 80)"/><path d="M80 76 l5 -2 M82 79 l6 -1 M82 83 l5 1" stroke="#c97f8b" stroke-width="1.5" stroke-linecap="round"/>`
        + `<ellipse cx="28" cy="81" rx="7" ry="4" fill="#e7a2ad"/>`
        + `<path d="M26 56 Q44 50 62 54" stroke="#4a4752" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="80" cy="61" r="1.1" fill="#8a8893"/>` },
    murmeltier: { name: "Murmeltier (aufrecht, Nagezähne)", box: "0 0 100 100",
      svg: FELS + `<path d="M70 82 Q86 80 88 68" stroke="#6e4e30" stroke-width="7" fill="none" stroke-linecap="round"/>`
        + `<ellipse cx="50" cy="62" rx="23" ry="27" fill="#a77a4c"/><ellipse cx="50" cy="67" rx="13" ry="19" fill="#d8b27e"/>`
        + `<ellipse cx="50" cy="30" rx="16" ry="14" fill="#a77a4c"/><circle cx="37" cy="20" r="4" fill="#7e5a37"/><circle cx="63" cy="20" r="4" fill="#7e5a37"/>`
        + `<ellipse cx="50" cy="37" rx="9" ry="7" fill="#ecd7b6"/><ellipse cx="50" cy="33" rx="3" ry="2" fill="#3a2c22"/>`
        + `<rect x="47.2" y="39" width="2.6" height="4.5" fill="#fff" stroke="#c9b9a0" stroke-width=".5"/><rect x="50.2" y="39" width="2.6" height="4.5" fill="#fff" stroke="#c9b9a0" stroke-width=".5"/>`
        + `<circle cx="43" cy="27" r="2.2" fill="#1b1b1f"/><circle cx="57" cy="27" r="2.2" fill="#1b1b1f"/>`
        + `<ellipse cx="41" cy="50" rx="5" ry="3.5" fill="#7e5a37"/><ellipse cx="59" cy="50" rx="5" ry="3.5" fill="#7e5a37"/>`
        + `<ellipse cx="39" cy="88" rx="8" ry="4" fill="#7e5a37"/><ellipse cx="61" cy="88" rx="8" ry="4" fill="#7e5a37"/>` },
    steinbock: { name: "Steinbock (Kopf: grosse gebogene Hörner mit Wülsten, Bart)", box: "0 0 100 100",
      svg: `<path d="M42 34 C36 14 26 6 12 10" stroke="#8a7a62" stroke-width="10" fill="none" stroke-linecap="round"/>`
        + `<path d="M42 34 C36 14 26 6 12 10" stroke="#5c4f3e" stroke-width="10" fill="none" stroke-dasharray="1.6 4.4"/>`
        + `<path d="M58 34 C64 14 74 6 88 10" stroke="#8a7a62" stroke-width="10" fill="none" stroke-linecap="round"/>`
        + `<path d="M58 34 C64 14 74 6 88 10" stroke="#5c4f3e" stroke-width="10" fill="none" stroke-dasharray="1.6 4.4"/>`
        + `<ellipse cx="29" cy="42" rx="9" ry="4.5" transform="rotate(25 29 42)" fill="#8c7659"/><ellipse cx="71" cy="42" rx="9" ry="4.5" transform="rotate(-25 71 42)" fill="#8c7659"/>`
        + `<path d="M46 80 L54 80 L50 97 Z" fill="#4e4234"/>`
        + `<ellipse cx="50" cy="57" rx="16" ry="26" fill="#9b8364"/><ellipse cx="50" cy="75" rx="10" ry="8" fill="#c9b597"/>`
        + `<ellipse cx="46.5" cy="76" rx="1.6" ry="2.2" fill="#3a3028"/><ellipse cx="53.5" cy="76" rx="1.6" ry="2.2" fill="#3a3028"/>`
        + `<ellipse cx="42" cy="49" rx="3.4" ry="2.6" fill="#c9952e"/><ellipse cx="42" cy="49" rx="2.2" ry="1" fill="#1b1b1f"/>`
        + `<ellipse cx="58" cy="49" rx="3.4" ry="2.6" fill="#c9952e"/><ellipse cx="58" cy="49" rx="2.2" ry="1" fill="#1b1b1f"/>` },
    gaemse: { name: "Gämse (Kopf: weisses Gesicht mit schwarzen Streifen, kurze Hakenhörner)", box: "0 0 100 100",
      svg: `<path d="M34 72 L26 100 L74 100 L66 72 Z" fill="#6e4f35"/>`
        + `<path d="M44 30 C43 20 44 11 38 9 Q32 8 33 15" stroke="#1b1b1f" stroke-width="5.5" fill="none" stroke-linecap="round"/>`
        + `<path d="M56 30 C57 20 56 11 62 9 Q68 8 67 15" stroke="#1b1b1f" stroke-width="5.5" fill="none" stroke-linecap="round"/>`
        + `<ellipse cx="29" cy="32" rx="11" ry="4.6" transform="rotate(-40 29 32)" fill="#a27b52"/><ellipse cx="71" cy="32" rx="11" ry="4.6" transform="rotate(40 71 32)" fill="#a27b52"/>`
        + `<path d="M50 27 C67 27 71 46 65 66 Q59 85 50 87 Q41 85 35 66 C29 46 33 27 50 27 Z" fill="#f1ebdf" stroke="#c9b99f" stroke-width="1.2"/>`
        + `<path d="M43 31 Q36 48 44 74" stroke="#1b1b1f" stroke-width="7" fill="none" stroke-linecap="round"/>`
        + `<path d="M57 31 Q64 48 56 74" stroke="#1b1b1f" stroke-width="7" fill="none" stroke-linecap="round"/>`
        + `<circle cx="40.6" cy="47" r="1.6" fill="#fff"/><circle cx="59.4" cy="47" r="1.6" fill="#fff"/>`
        + `<ellipse cx="50" cy="81" rx="5.5" ry="3.6" fill="#3a3028"/>` },
    specht: { name: "Buntspecht (schwarz-weiss, roter Nacken und Steiss, am Stamm)", box: "0 0 100 100",
      svg: `<rect x="64" y="0" width="26" height="100" fill="#8d6b4b"/><path d="M70 6 v20 M78 30 v24 M72 60 v18 M84 70 v22 M82 8 v14" stroke="#6b4f36" stroke-width="2" stroke-linecap="round"/>`
        + `<path d="M50 70 L58 95 L62 94 L58 70 Z" fill="#1e1e22"/>`
        + `<ellipse cx="51" cy="50" rx="13" ry="23" transform="rotate(8 51 50)" fill="#1e1e22"/>`
        + `<ellipse cx="45" cy="50" rx="7" ry="16" transform="rotate(8 45 50)" fill="#efece4"/>`
        + `<ellipse cx="56" cy="40" rx="4.5" ry="9" transform="rotate(10 56 40)" fill="#f7f5ef"/>`
        + `<path d="M57 56 l-6 2 M58 61 l-6 2 M58 66 l-5 2" stroke="#f7f5ef" stroke-width="2"/>`
        + `<ellipse cx="53" cy="71" rx="5.5" ry="4.5" fill="#d6283a"/>`
        + `<circle cx="53" cy="24" r="10.5" fill="#1e1e22"/><ellipse cx="50" cy="27" rx="6" ry="4.5" fill="#f7f5ef"/>`
        + `<circle cx="60" cy="19" r="3.6" fill="#d6283a"/>`
        + `<path d="M61 23 L74 25 L61 28 Z" fill="#59595e"/><circle cx="56" cy="22.5" r="1.6" fill="#fff"/><circle cx="56" cy="22.5" r=".8" fill="#1b1b1f"/>`
        + `<path d="M58 45 l7 -2 M58 47 l7 1 M58 60 l7 -1 M58 62 l7 2" stroke="#59595e" stroke-width="1.8" stroke-linecap="round"/>` },
    graureiher: { name: "Graureiher (grau, langer Hals, gelber Schnabel, schwarzer Schopf)", box: "0 0 100 100",
      svg: WASSER + `<path d="M50 66 L47 96 M56 66 L58 96" stroke="#b7a36a" stroke-width="2.6" stroke-linecap="round"/>`
        + `<ellipse cx="55" cy="58" rx="22" ry="12" transform="rotate(-18 55 58)" fill="#a1aab4"/>`
        + `<path d="M50 52 Q64 46 78 62 Q66 66 52 62 Z" fill="#6d7783"/>`
        + `<path d="M42 54 Q30 42 40 32 Q48 24 40 17" stroke="#d8dde2" stroke-width="7" fill="none" stroke-linecap="round"/>`
        + `<path d="M38 40 Q34 46 40 52" stroke="#3b3f45" stroke-width="1.6" fill="none" stroke-dasharray="2 2"/>`
        + `<ellipse cx="42" cy="15" rx="7" ry="5" fill="#f3f4f5"/><path d="M41 12 L58 9 L46 15 Z" fill="#1e1e22"/>`
        + `<path d="M37 13 L12 17 L37 18 Z" fill="#e4b335"/><circle cx="40" cy="14" r="1.4" fill="#e4b335"/><circle cx="40" cy="14" r=".6" fill="#1b1b1f"/>` },
    feldlerche: { name: "Feldlerche (braun gestreift, kleine Haube, am Boden)", box: "0 0 100 100",
      svg: GRAS + `<path d="M48 72 L46 86 M56 72 L58 86" stroke="#9a7c5c" stroke-width="2" stroke-linecap="round"/>`
        + `<path d="M30 56 L6 60 L8 66 L30 66 Z" fill="#6e5338"/><path d="M6 60 L8 66" stroke="#f3efe6" stroke-width="2"/>`
        + `<ellipse cx="50" cy="60" rx="24" ry="15" fill="#b08a5e"/><ellipse cx="58" cy="65" rx="14" ry="9" fill="#ead9bb"/>`
        + `<path d="M36 52 l6 3 M44 50 l6 3 M38 60 l6 3 M46 58 l6 3 M30 58 l6 3 M54 62 l2 4 M60 60 l2 4 M64 64 l2 4" stroke="#5e4630" stroke-width="2" stroke-linecap="round"/>`
        + `<circle cx="72" cy="45" r="11" fill="#b08a5e"/><path d="M66 36 L62 26 L74 34 Z" fill="#6e5338"/>`
        + `<path d="M64 41 Q72 38 80 42" stroke="#f3efe6" stroke-width="2" fill="none"/><circle cx="74" cy="44" r="1.9" fill="#1b1b1f"/>`
        + `<path d="M82 45 L91 47 L82 50 Z" fill="#8a7a62"/><path d="M70 49 l3 2 M66 47 l3 2" stroke="#5e4630" stroke-width="1.6"/>` },
    hecht: { name: "Hecht (lang, Entenschnabel-Maul, Flossen weit hinten, helle Flecken)", box: "0 0 100 100",
      svg: `<path d="M3 50 L16 45 Q40 38 70 43 L78 47 L97 35 L92 50 L97 65 L78 53 L70 57 Q40 62 16 55 Z" fill="#6f8a4a" stroke="#3e5228" stroke-width="1.6"/>`
        + `<path d="M16 54.5 Q40 61 70 56.5 L72 51 Q40 55 16 51 Z" fill="#cfd8a2"/>`
        + `<path d="M60 43 L68 33 L73 45 Z" fill="#5c7438" stroke="#3e5228" stroke-width="1.2"/><path d="M60 57 L68 67 L73 55 Z" fill="#5c7438" stroke="#3e5228" stroke-width="1.2"/>`
        + `<path d="M3 50 L20 51" stroke="#2f3f1e" stroke-width="1.6"/><path d="M29 44 Q25 50 29 56" stroke="#3e5228" stroke-width="1.6" fill="none"/>`
        + `<circle cx="20" cy="47" r="3" fill="#e8d36a"/><circle cx="20" cy="47" r="1.3" fill="#1b1b1f"/>`
        + [[36, 46], [44, 44], [52, 47], [40, 51], [58, 45], [48, 50], [64, 48], [32, 50]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.3" fill="#d6dfa4"/>`).join("") },
    bergmolch: { name: "Bergmolch (blaugrau, orange Bauch, Flankenband mit Punkten)", box: "0 0 100 100",
      svg: WASSER + `<path d="M28 58 l-4 10 l-3 1 M36 59 l2 10 l3 1 M64 57 l-3 10 l-3 1 M72 56 l3 10 l3 1" stroke="#3f4d68" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<path d="M6 52 Q12 44 24 46 L62 46 Q80 45 97 38 Q86 54 62 57 L24 58 Q12 59 6 52 Z" fill="#46587c"/>`
        + `<path d="M20 57 Q40 61 64 56.5 L64 53 Q40 56.5 20 53.5 Z" fill="#f08a24"/>`
        + `<path d="M22 52 Q42 55 64 51 L64 49 Q42 52 22 50 Z" fill="#e9eef2"/>`
        + [26, 32, 38, 44, 50, 56, 62].map(x => `<circle cx="${x}" cy="${51.4 + (x % 12 ? 0.3 : -0.3)}" r="1" fill="#1b1b1f"/>`).join("")
        + `<path d="M66 47 Q82 44 94 40" stroke="#2f3c58" stroke-width="1.4" fill="none" stroke-dasharray="2 3"/>`
        + `<circle cx="14" cy="49" r="2.4" fill="#d9a73a"/><circle cx="14" cy="49" r="1" fill="#1b1b1f"/>` },
    feuersalamander: { name: "Feuersalamander (schwarz mit gelben Flecken)", box: "0 0 100 100",
      svg: salamander([[78, 44, 5, 2.6, -10], [78, 56, 5, 2.6, 10], [64, 46, 5, 3, 20], [52, 53, 6, 3, -15], [40, 46, 5, 3, 10],
        [30, 53, 4.5, 2.6, -20], [12, 62, 3.5, 2, 40], [56, 44, 3, 2, 0], [8, 69, 2.5, 1.6, 0]], false) },
    alpensalamander: { name: "Alpensalamander (ganz schwarz, glänzend)", box: "0 0 100 100",
      svg: FELS + salamander([], true) },
    libelle: { name: "Libelle (von oben: vier Flügel, langer blauer Hinterleib, grosse Augen)", box: "0 0 100 100",
      svg: `<ellipse cx="29" cy="31" rx="23" ry="5.5" transform="rotate(-8 29 31)" fill="#dceefc" fill-opacity=".85" stroke="#7b9fc0" stroke-width="1.2"/>`
        + `<ellipse cx="71" cy="31" rx="23" ry="5.5" transform="rotate(8 71 31)" fill="#dceefc" fill-opacity=".85" stroke="#7b9fc0" stroke-width="1.2"/>`
        + `<ellipse cx="29" cy="42" rx="21" ry="6.5" transform="rotate(10 29 42)" fill="#dceefc" fill-opacity=".85" stroke="#7b9fc0" stroke-width="1.2"/>`
        + `<ellipse cx="71" cy="42" rx="21" ry="6.5" transform="rotate(-10 71 42)" fill="#dceefc" fill-opacity=".85" stroke="#7b9fc0" stroke-width="1.2"/>`
        + `<path d="M10 31 L48 32 M12 43 L48 40 M90 31 L52 32 M88 43 L52 40" stroke="#9bb8d4" stroke-width=".8"/>`
        + `<rect x="47.5" y="42" width="5" height="54" rx="2.5" fill="#2f7fd0"/>`
        + [50, 57, 64, 71, 78, 85].map(y => `<line x1="47.5" y1="${y}" x2="52.5" y2="${y}" stroke="#1d4f86" stroke-width="1.2"/>`).join("")
        + `<ellipse cx="50" cy="35" rx="5.5" ry="9" fill="#2b6aa8"/><circle cx="45.5" cy="22" r="5" fill="#1f4e7a"/><circle cx="54.5" cy="22" r="5" fill="#1f4e7a"/>`
        + `<circle cx="44" cy="20.5" r="1.4" fill="#cfe6ff"/><circle cx="53" cy="20.5" r="1.4" fill="#cfe6ff"/>` },
    schilf: { name: "Schilf (hohe Halme, schmale Blätter, fedrige Rispen; kein Rohrkolben)", box: "0 0 100 100",
      svg: WASSER + `<path d="M30 98 L32 18 M52 98 L50 8 M72 98 L70 22" stroke="#b5ad6a" stroke-width="2.6" stroke-linecap="round"/>`
        + `<path d="M31 70 Q16 60 6 62 Q18 64 31 74 Z M31 50 Q44 40 54 44 Q42 44 31 54 Z M51 62 Q66 52 78 56 Q64 56 51 66 Z M51 36 Q36 28 26 32 Q38 32 51 40 Z M71 76 Q84 66 96 68 Q84 70 71 80 Z M71 46 Q60 38 52 50 Q62 44 71 50 Z" fill="#6f9a3c"/>`
        + `<path d="M32 18 Q24 22 22 34 Q28 26 32 24 Q26 30 26 40 Q32 30 33 26 Z" fill="#9c7f63"/>`
        + `<path d="M50 8 Q40 12 38 26 Q45 18 50 15 Q43 24 43 34 Q50 22 51 17 Z" fill="#8f6f55"/>`
        + `<path d="M70 22 Q62 26 60 38 Q66 30 70 28 Q64 34 64 44 Q70 34 71 30 Z" fill="#9c7f63"/>`
        + `<path d="M32 20 L24 30 M32 22 L27 36 M50 10 L41 22 M50 12 L45 30 M70 24 L62 34 M70 26 L65 40" stroke="#c9b199" stroke-width=".9"/>` },
    edelweiss: { name: "Edelweiss (weiss-wollige Hüllblätter als Stern, gelbliche Mitte)", box: "0 0 100 100",
      svg: `<path d="M50 54 L50 98" stroke="#8fa08a" stroke-width="3.4" stroke-linecap="round"/>`
        + `<path d="M50 84 Q36 76 30 80 Q40 84 50 88 Z M50 74 Q64 66 70 70 Q60 74 50 78 Z" fill="#a9b7a2"/>`
        + rund(9, 50, 44, `<path d="M50 44 Q44 30 50 12 Q56 30 50 44 Z" fill="#f6f6f1" stroke="#c3c8b9" stroke-width="1.2"/>`, 10)
        + rund(6, 50, 44, `<path d="M50 44 Q46 34 50 22 Q54 34 50 44 Z" fill="#fbfbf8" stroke="#d3d7ca" stroke-width=".8"/>`, 40)
        + [[50, 44], [44, 41], [56, 41], [46, 49], [54, 49], [50, 37]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#e6dfa8" stroke="#b9ad6c" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="1" fill="#a39550"/>`).join("") },
    enzian: { name: "Enzian (grosse tiefblaue Glocke, fünf Zipfel)", box: "0 0 100 100",
      svg: `<ellipse cx="34" cy="90" rx="16" ry="6" transform="rotate(-15 34 90)" fill="#4f8a3a"/><ellipse cx="66" cy="90" rx="16" ry="6" transform="rotate(15 66 90)" fill="#4f8a3a"/>`
        + `<path d="M42 92 L40 78 L60 78 L58 92 Z" fill="#5d9a45"/>`
        + `<path d="M40 80 Q34 52 28 32 L22 24 L34 24 L42 13 L50 22 L58 13 L66 24 L78 24 L72 32 Q66 52 60 80 Z" fill="#1f3fb5" stroke="#142a80" stroke-width="1.6" stroke-linejoin="round"/>`
        + `<ellipse cx="50" cy="28" rx="20" ry="5.5" fill="#132b85"/>`
        + `<path d="M50 30 L50 78 M41 32 Q42 56 45 78 M59 32 Q58 56 55 78" stroke="#16308f" stroke-width="1.4" fill="none"/>`
        + `<circle cx="45" cy="28" r="1.2" fill="#6fb85a"/><circle cx="52" cy="27" r="1.2" fill="#6fb85a"/><circle cx="57" cy="29" r="1.2" fill="#6fb85a"/>` },
    spitzmaus: { name: "Spitzmaus (lange spitze Schnauze, winzige Augen)", box: "0 0 100 100",
      svg: ERDE + `<path d="M26 64 Q14 70 4 74" stroke="#6e5a4c" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
        + `<ellipse cx="46" cy="66" rx="23" ry="14" fill="#6e5a4c"/><ellipse cx="48" cy="72" rx="16" ry="7" fill="#a8968a"/>`
        + `<path d="M62 56 Q78 56 96 66 Q80 72 62 76 Z" fill="#6e5a4c"/><circle cx="95" cy="66" r="2.2" fill="#e7a2ad"/>`
        + `<path d="M90 64 l6 -5 M90 66 l8 -1 M90 68 l6 4" stroke="#3a2f28" stroke-width=".8"/>`
        + `<circle cx="74" cy="61" r="1.3" fill="#1b1b1f"/><ellipse cx="67" cy="57" rx="3" ry="2.4" fill="#8a7464"/>`
        + `<ellipse cx="34" cy="80" rx="4" ry="2" fill="#e7a2ad"/><ellipse cx="62" cy="80" rx="4" ry="2" fill="#e7a2ad"/>` },
    meerschweinchen: { name: "Meerschweinchen (rundlich, ohne Schwanz, gefleckt)", box: "0 0 100 100",
      svg: `<ellipse cx="50" cy="62" rx="36" ry="23" fill="#fbf8f2" stroke="#c9bfae" stroke-width="1.4"/>`
        + `<path d="M14 62 Q14 40 40 38 Q46 52 40 84 Q18 82 14 62 Z" fill="#d98a3d"/>`
        + `<path d="M62 40 Q80 38 86 54 Q82 62 70 60 Q60 54 62 40 Z" fill="#2d2a2a"/>`
        + `<path d="M66 40 Q66 30 74 32 Q76 38 70 42 Z" fill="#e1a1a4" stroke="#8a6a5a" stroke-width="1"/>`
        + `<circle cx="76" cy="50" r="2.6" fill="#1b1b1f"/><circle cx="76.8" cy="49.2" r=".8" fill="#fff"/>`
        + `<path d="M84 60 Q87 62 85 65" stroke="#8a6a5a" stroke-width="1.4" fill="none"/><ellipse cx="85.5" cy="59" rx="2" ry="1.5" fill="#e1a1a4"/>`
        + `<path d="M84 61 l10 -3 M84 62 l10 1" stroke="#8a7d70" stroke-width=".8"/>`
        + `<ellipse cx="34" cy="85" rx="5" ry="2.6" fill="#e1a1a4"/><ellipse cx="70" cy="85" rx="5" ry="2.6" fill="#e1a1a4"/>` },
    blindschleiche: { name: "Blindschleiche (Echse ohne Beine, glänzend bronzebraun)", box: "0 0 100 100",
      svg: `<path d="M8 80 Q20 60 40 68 Q60 76 66 56 Q72 36 90 32" stroke="#a9773e" stroke-width="11" fill="none" stroke-linecap="round"/>`
        + `<path d="M10 82 Q22 64 40 71.5 Q61 80 68.5 57 Q74 40 90 36" stroke="#5a3d1e" stroke-width="1.6" fill="none"/>`
        + `<path d="M14 72 Q24 60 40 64 Q56 70 62 54 Q68 38 86 30" stroke="#e2bd84" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
        + `<ellipse cx="92" cy="31" rx="7" ry="5.4" transform="rotate(-14 92 31)" fill="#a9773e"/>`
        + `<circle cx="93" cy="29" r="1.5" fill="#1b1b1f"/><path d="M98 32 l2 -0.5 l-0.5 1.6" stroke="#4a3a6a" stroke-width="1" fill="none"/>` },
    erdkroete: { name: "Erdkröte (braun, warzig, kupferrote Augen mit querem Spalt)", box: "0 0 100 100",
      svg: ERDE + `<path d="M14 86 Q6 70 20 66 L30 80 Z" fill="#83592f"/><path d="M86 86 Q94 70 80 66 L70 80 Z" fill="#83592f"/>`
        + `<path d="M14 72 Q14 40 50 38 Q86 40 86 72 Q80 88 50 88 Q20 88 14 72 Z" fill="#9a6e44"/>`
        + `<ellipse cx="50" cy="78" rx="22" ry="9" fill="#c49a6c"/>`
        + `<path d="M30 86 L26 96 M34 86 L36 96 M66 86 L64 96 M70 86 L74 96" stroke="#83592f" stroke-width="4" stroke-linecap="round"/>`
        + `<ellipse cx="30" cy="46" rx="6" ry="3" transform="rotate(25 30 46)" fill="#b2865a"/><ellipse cx="70" cy="46" rx="6" ry="3" transform="rotate(-25 70 46)" fill="#b2865a"/>`
        + [[24, 58], [36, 54], [64, 54], [76, 58], [30, 66], [70, 66], [44, 60], [56, 60], [50, 52], [20, 68], [80, 68]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#7c5531"/>`).join("")
        + `<circle cx="38" cy="40" r="8" fill="#9a6e44"/><circle cx="62" cy="40" r="8" fill="#9a6e44"/>`
        + `<circle cx="38" cy="39" r="5" fill="#cf6a24"/><circle cx="62" cy="39" r="5" fill="#cf6a24"/>`
        + `<ellipse cx="38" cy="39" rx="3.6" ry="1.3" fill="#1b1b1f"/><ellipse cx="62" cy="39" rx="3.6" ry="1.3" fill="#1b1b1f"/>`
        + `<path d="M26 56 Q50 64 74 56" stroke="#5e3f22" stroke-width="1.8" fill="none"/>` },
    mueckenlarve: { name: "Mückenlarve (im Wasser, hängt mit dem Atemrohr an der Oberfläche)", box: "0 0 100 100",
      svg: `<rect x="0" y="18" width="100" height="82" fill="#d4ebf8"/><path d="M0 18 Q12 15 25 18 T50 18 T75 18 T100 18" stroke="#6aaedb" stroke-width="2" fill="none"/>`
        + [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const x = 46 + i * 2.4, y = 66 - i * 5.6; return `<rect x="${x - 3}" y="${y - 3}" width="6" height="5.4" rx="1.6" transform="rotate(25 ${x} ${y})" fill="#5d5b49"/><path d="M${x - 3} ${y} l-4 -1 M${x + 3} ${y} l4 1" stroke="#5d5b49" stroke-width=".7"/>`; }).join("")
        + `<path d="M64 26 L70 19" stroke="#5d5b49" stroke-width="2.4" stroke-linecap="round"/><path d="M63 25 l-5 -2 M63 25 l-1 -5" stroke="#5d5b49" stroke-width=".8"/>`
        + `<ellipse cx="42" cy="74" rx="8" ry="6.5" fill="#4d4b3c"/><circle cx="37" cy="83" r="4.5" fill="#3f3d31"/>`
        + `<path d="M34 86 l-4 3 M37 87 l-1 4 M40 86 l2 4 M36 72 l-6 -2 M48 72 l6 -2" stroke="#3f3d31" stroke-width=".9"/>` },
    baummarder: { name: "Baummarder (braun, gelber Kehlfleck, buschiger Schwanz, auf dem Ast)", box: "0 0 100 100",
      svg: `<path d="M0 78 L100 62" stroke="#7a5a3a" stroke-width="9" stroke-linecap="round"/>`
        + `<path d="M24 58 Q8 64 6 84" stroke="#4e301b" stroke-width="10" fill="none" stroke-linecap="round"/>`
        + `<path d="M34 64 L32 76 M44 64 L44 74 M62 62 L64 70 M70 60 L72 68" stroke="#4e301b" stroke-width="5" stroke-linecap="round"/>`
        + `<ellipse cx="48" cy="56" rx="28" ry="10.5" transform="rotate(-6 48 56)" fill="#6b4428"/>`
        + `<ellipse cx="80" cy="45" rx="11.5" ry="9" fill="#6b4428"/><circle cx="75" cy="36" r="4.4" fill="#6b4428"/><circle cx="86" cy="37" r="4.4" fill="#6b4428"/><circle cx="75" cy="36.6" r="2" fill="#a77d58"/><circle cx="86" cy="37.6" r="2" fill="#a77d58"/>`
        + `<path d="M74 50 Q78 62 70 62 Q66 54 74 50 Z" fill="#f1c75a"/><ellipse cx="76" cy="53" rx="6" ry="4.5" fill="#f1c75a"/>`
        + `<ellipse cx="91" cy="47" rx="2" ry="1.6" fill="#1b1b1f"/><circle cx="83" cy="42" r="1.8" fill="#1b1b1f"/><circle cx="83.6" cy="41.4" r=".6" fill="#fff"/>` },
    nachtfalter: { name: "Nachtfalter (graubraun, fedrige Kammfühler, pelziger Körper)", box: "0 0 100 100",
      svg: gespiegelt(`<path d="M46 40 L8 28 Q2 50 20 62 L46 56 Z" fill="#a38f78" stroke="#6d5a49" stroke-width="1.4"/><path d="M46 56 L22 64 Q20 82 40 78 L47 64 Z" fill="#8e7a64" stroke="#6d5a49" stroke-width="1.4"/><path d="M14 38 L22 44 L16 48 L26 52 M30 36 L34 46 L30 54" stroke="#6d5a49" stroke-width="1.2" fill="none"/><circle cx="28" cy="46" r="2.6" fill="#5e4c3d"/>`)
        + `<path d="M46 40 L8 28 Q2 50 20 62 L46 56 Z" fill="#a38f78" stroke="#6d5a49" stroke-width="1.4"/><path d="M46 56 L22 64 Q20 82 40 78 L47 64 Z" fill="#8e7a64" stroke="#6d5a49" stroke-width="1.4"/><path d="M14 38 L22 44 L16 48 L26 52 M30 36 L34 46 L30 54" stroke="#6d5a49" stroke-width="1.2" fill="none"/><circle cx="28" cy="46" r="2.6" fill="#5e4c3d"/>`
        + `<path d="M47 34 Q42 22 34 14 M53 34 Q58 22 66 14" stroke="#5e4c3d" stroke-width="1.6" fill="none"/>`
        + [[44.5, 27], [42, 23], [39, 19.5], [36, 16.5]].map(([x, y]) => `<path d="M${x} ${y} l-4 1.5 M${x} ${y} l1 -4.5 M${100 - x} ${y} l4 1.5 M${100 - x} ${y} l-1 -4.5" stroke="#5e4c3d" stroke-width="1"/>`).join("")
        + `<ellipse cx="50" cy="52" rx="5.5" ry="19" fill="#6d5a49"/><path d="M47 40 h6 M46.5 46 h7 M46.5 52 h7 M47 58 h6 M48 64 h4" stroke="#8e7a64" stroke-width="1.2"/>`
        + `<circle cx="50" cy="34" r="4.5" fill="#5e4c3d"/>` },
    sperber: { name: "Sperber (Greifvogel: grauer Rücken, quer gebänderte Brust, gelbe Augen, langer Schwanz)", box: "0 0 100 100",
      svg: `<path d="M0 80 L100 76" stroke="#7a5a3a" stroke-width="7" stroke-linecap="round"/>`
        + `<path d="M44 74 L40 98 L60 98 L56 74 Z" fill="#7a8796"/><path d="M41.5 82 h17 M41 88 h18 M40.5 94 h19" stroke="#46525f" stroke-width="2"/>`
        + `<ellipse cx="50" cy="52" rx="17" ry="25" fill="#f2e7d7"/>`
        + [38, 44, 50, 56, 62, 68].map(y => `<path d="M${38 + Math.abs(y - 53) / 4} ${y} Q50 ${y + 3} ${62 - Math.abs(y - 53) / 4} ${y}" stroke="#c9703a" stroke-width="2" fill="none"/>`).join("")
        + `<path d="M36 30 Q22 56 42 84 Q50 60 52 34 Z" fill="#5a6b80"/><path d="M38 44 Q34 60 42 76 M44 40 Q42 58 46 72" stroke="#46525f" stroke-width="1.4" fill="none"/>`
        + `<circle cx="51" cy="24" r="12" fill="#5a6b80"/><path d="M50 27 Q58 34 63 28 Q60 36 52 36 Z" fill="#f2e7d7"/>`
        + `<path d="M49 18 Q56 15 62 18" stroke="#f2e7d7" stroke-width="1.6" fill="none"/>`
        + `<circle cx="56" cy="22" r="4" fill="#f1c232"/><circle cx="56.6" cy="22" r="1.9" fill="#1b1b1f"/>`
        + `<path d="M61 22 Q70 21 69 30 L66 27 L62 28 Z" fill="#3a3f46"/><path d="M60.5 21 h3 v6 h-3 Z" fill="#f1c232"/>`
        + `<path d="M44 76 L44 80 M47 76 L46 81 M53 76 L54 81 M56 76 L56 80" stroke="#f1c232" stroke-width="2.4" stroke-linecap="round"/>` },
  };
})();
