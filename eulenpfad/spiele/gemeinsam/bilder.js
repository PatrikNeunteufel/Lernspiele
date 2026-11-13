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
    // Körbe der Gruppen und Spielweisen (BI1 a, LERN_Session38): zeigen, wie der Ton entsteht, nie ein Instrument einer
    // Karte — sonst fände das Kind den Korb durch Vergleichen der Bilder (Trompete 🎺 → Blechblasinstrument 🎺).
    saiten: { name: "Saiten, eine schwingt (Saiteninstrument)", box: "0 0 100 100",
      svg: `<rect x="6" y="18" width="10" height="64" rx="3" fill="#b7814f"/><rect x="84" y="18" width="10" height="64" rx="3" fill="#b7814f"/>`
        + `<line x1="16" y1="30" x2="84" y2="30" stroke="#6b6f8a" stroke-width="3"/><line x1="16" y1="70" x2="84" y2="70" stroke="#6b6f8a" stroke-width="3"/>`
        + `<path d="M16 50 Q24 40 33 50 T50 50 T67 50 T84 50" fill="none" stroke="#d9822b" stroke-width="3.5"/>`
        + `<path d="M50 38 v-6 M44 39 l-3 -5 M56 39 l3 -5" stroke="#d9822b" stroke-width="2.4" stroke-linecap="round"/>` },
    // eine einzelne Taste mit drückendem Finger, keine Tastatur: sonst gliche sie dem Klavier der Karte 🎹
    taste: { name: "Finger drückt eine Taste (Tasteninstrument)", box: "0 0 100 100",
      svg: `<path d="M14 62 L86 62 L86 90 Q86 94 82 94 L18 94 Q14 94 14 90 Z" fill="#c9ced8"/>`
        + `<rect x="18" y="54" width="64" height="30" rx="6" fill="#ffffff" stroke="#3a3d4a" stroke-width="3.5"/>`
        + `<rect x="40" y="8" width="20" height="44" rx="10" fill="#f2c9a0" stroke="#b5835a" stroke-width="3"/>`
        + `<path d="M44 16 h12" stroke="#b5835a" stroke-width="2" stroke-linecap="round"/>`
        + `<path d="M22 18 v18 m-6 -6 l6 7 l6 -7 M78 18 v18 m-6 -6 l6 7 l6 -7" stroke="#4d93dc" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` },
    rohrblatt: { name: "Mundstück mit Rohrblatt (Holzblasinstrument)", box: "2 22 96 58",
      svg: `<path d="M8 40 L62 34 L92 38 L92 62 L62 66 L8 52 Z" fill="#2a2c35"/>`
        + `<path d="M8 53 L62 66 L62 72 L10 58 Z" fill="#e6c77a" stroke="#a88a3c" stroke-width="2"/>`
        + `<rect x="54" y="30" width="10" height="46" rx="3" fill="#c3c8d2" stroke="#7d8494" stroke-width="2"/>`
        + `<path d="M14 66 q4 6 8 0 q4 -6 8 0 q4 6 8 0" fill="none" stroke="#d9822b" stroke-width="2.6" stroke-linecap="round"/>` },
    mundstueck: { name: "Lippen am Kesselmundstück (Blechblasinstrument)", box: "2 24 96 52",
      svg: `<ellipse cx="18" cy="42" rx="12" ry="7" fill="#e2687a"/><ellipse cx="18" cy="58" rx="12" ry="7" fill="#d4566a"/>`
        + `<path d="M30 30 Q44 30 50 44 L92 46 L92 54 L50 56 Q44 70 30 70 Z" fill="#d7dbe3" stroke="#7d8494" stroke-width="3" stroke-linejoin="round"/>`
        + `<path d="M24 50 l4 -5 l4 10 l4 -10 l4 10" fill="none" stroke="#d9822b" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` },
    bogen: { name: "Bogen streicht über die Saiten (Streichinstrument, streichen)", box: "0 0 100 100",
      svg: `<line x1="40" y1="6" x2="40" y2="94" stroke="#6b6f8a" stroke-width="2.5"/><line x1="52" y1="6" x2="52" y2="94" stroke="#6b6f8a" stroke-width="2.5"/><line x1="64" y1="6" x2="64" y2="94" stroke="#6b6f8a" stroke-width="2.5"/>`
        + `<path d="M6 70 L92 34" stroke="#7a4f26" stroke-width="5" stroke-linecap="round"/>`
        + `<path d="M10 76 L90 43" stroke="#c9bd9e" stroke-width="3" stroke-linecap="round"/><path d="M10 76 L6 70 M90 43 L92 34" stroke="#7a4f26" stroke-width="3" stroke-linecap="round"/>`
        + `<rect x="2" y="66" width="12" height="12" rx="2" transform="rotate(-22 8 72)" fill="#2a2c35"/>` },

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

    // ---------- Geschichte (zeitstrahl-sortierer, kulturen-koffer; Bemerkungen 23–25, 29–32) ----------
    faustkeil: { name: "Faustkeil aus Feuerstein (Tropfenform, abgeschlagene Flächen)", box: "0 0 100 100",
      svg: `<path d="M50 5 C67 22 77 48 73 72 C70 88 59 95 50 95 C41 95 30 88 27 72 C23 48 33 22 50 5 Z" fill="#9a8a78" stroke="#5e5246" stroke-width="2.5"/>`
        + `<path d="M50 5 L43 31 L57 35 Z" fill="#b8a896"/><path d="M33 40 L50 45 L44 63 L29 58 Z" fill="#847462"/>`
        + `<path d="M57 35 L71 47 L63 61 L50 45 Z" fill="#ab9b89"/><path d="M44 63 L63 61 L67 79 L50 87 L33 79 Z" fill="#8e7e6c"/>`
        + `<path d="M43 31 L33 40 M50 45 L57 35 M44 63 L50 45 M63 61 L71 47" stroke="#5e5246" stroke-width="1.4"/>` },
    pfahlbau: { name: "Pfahlbau (Holzhaus mit Schilfdach auf Pfählen im See, Einbaum)", box: "0 0 100 100",
      svg: `<rect x="0" y="66" width="100" height="34" fill="#8cc8ee"/><path d="M4 76 q6 -3 12 0 M40 84 q6 -3 12 0 M70 74 q6 -3 12 0 M18 92 q6 -3 12 0" stroke="#5aa3d6" stroke-width="2" fill="none" stroke-linecap="round"/>`
        + [20, 32, 44, 56, 68, 80].map(x => `<line x1="${x}" y1="56" x2="${x}" y2="97" stroke="#6b4a2b" stroke-width="4" stroke-linecap="round"/>`).join("")
        + `<rect x="12" y="52" width="76" height="6" rx="1.5" fill="#8b5e34"/>`
        + `<rect x="22" y="32" width="56" height="20" fill="#b98a55"/>`
        + [30, 38, 62, 70].map(x => `<line x1="${x}" y1="33" x2="${x}" y2="51" stroke="#8b6238" stroke-width="1.6"/>`).join("")
        + `<rect x="45" y="38" width="10" height="14" fill="#4a3420"/>`
        + `<path d="M14 35 L50 8 L86 35 Z" fill="#cfa94e" stroke="#9a7a2c" stroke-width="1.6"/>`
        + `<path d="M26 31 L50 13 M38 33 L52 15 M62 33 L50 13 M74 31 L52 15" stroke="#a8862f" stroke-width="1.4"/>`
        + `<path d="M82 58 L88 58 L92 74 M86 63 L90 63 M87 68 L91 68" stroke="#6b4a2b" stroke-width="2" fill="none" stroke-linecap="round"/>`
        + `<path d="M60 78 Q74 84 94 78 L92 82 Q74 88 62 82 Z" fill="#7a5230"/>` },
    roemerstrasse: { name: "Römerstrasse (Steinplatten ohne Linien, Randsteine, Meilenstein, zu den Alpen)", box: "0 0 100 100",
      svg: `<path d="M0 46 L16 22 L28 34 L45 12 L62 33 L76 20 L100 42 V46 Z" fill="#a9b4c2"/>`
        + `<path d="M40 19 L45 12 L50 18 L47 17 L44 20 Z M12 28 L16 22 L20 26 L16 26 Z M72 24 L76 20 L81 25 L77 24 Z" fill="#fff"/>`
        + `<rect x="0" y="44" width="100" height="56" fill="#8fbf6a"/>`
        + `<path d="M41 44 L59 44 L97 100 L3 100 Z" fill="#bdb5a8" stroke="#7f776c" stroke-width="2.4"/>`
        + `<path d="M35.4 52 H64.6 M28.6 62 H71.4 M20.1 74 H79.9 M10.4 88 H89.6" stroke="#7f776c" stroke-width="1.6"/>`
        + `<path d="M46 44 V52 M54 44 V52 M41 52 L40 62 M50 52 V62 M60 52 L61 62 M35 62 L33 74 M46 62 L45 74 M56 62 L57 74 M66 62 L67 74`
        + ` M27 74 L24 88 M40 74 L39 88 M52 74 V88 M64 74 L65 88 M75 74 L77 88 M18 88 L15 100 M33 88 L31 100 M50 88 V100 M67 88 L69 100 M83 88 L86 100" stroke="#7f776c" stroke-width="1.4"/>`
        + `<rect x="82" y="48" width="10" height="28" rx="3" fill="#ded7c8" stroke="#8d857a" stroke-width="1.4"/><ellipse cx="87" cy="48" rx="5" ry="2" fill="#ece6d9" stroke="#8d857a" stroke-width="1.2"/>`
        + `<path d="M84.5 56 h5 M84.5 60 h5 M84.5 64 h3.5" stroke="#8d857a" stroke-width="1.3"/>` },
    pyramiden: { name: "Pyramiden am Nil (glatte Seiten, Palme, Fluss)", box: "0 0 100 100",
      svg: `<circle cx="82" cy="16" r="8" fill="#f6c343"/>`
        + `<rect x="0" y="78" width="100" height="22" fill="#e8cf8f"/>`
        + `<path d="M58 80 L78 46 L98 80 Z" fill="#d9a958"/><path d="M78 46 L98 80 L84 80 Z" fill="#b8873b"/>`
        + `<path d="M12 80 L46 22 L80 80 Z" fill="#e4bd6a"/><path d="M46 22 L80 80 L56 80 Z" fill="#c2913f"/>`
        + `<path d="M24 60 H62 M18 70 H70 M30 50 H58 M36 40 H54" stroke="#c9a05a" stroke-width="1"/>`
        + `<rect x="0" y="88" width="100" height="7" fill="#5aa3d6"/>`
        + `<path d="M10 86 Q9 66 12 54" stroke="#8b6238" stroke-width="3" fill="none" stroke-linecap="round"/>`
        + `<path d="M12 54 Q2 52 0 60 M12 54 Q4 46 2 44 M12 54 Q16 44 24 46 M12 54 Q22 52 26 60 M12 54 Q12 46 10 42" stroke="#4f8f3a" stroke-width="4" fill="none" stroke-linecap="round"/>` },
    tempel: { name: "Griechischer Tempel (Säulen, Giebeldreieck, Stufen)", box: "0 0 100 100",
      svg: `<path d="M12 27 L50 8 L88 27 Z" fill="#f1eee6" stroke="#a9a395" stroke-width="1.8"/><path d="M24 24 L50 13 L76 24 Z" fill="#e1dccf"/>`
        + `<rect x="12" y="27" width="76" height="8" fill="#e8e4da" stroke="#a9a395" stroke-width="1.6"/>`
        + [18, 30, 42, 54, 66, 78].map(x => `<rect x="${x - 1.5}" y="35" width="10" height="3.5" fill="#e8e4da" stroke="#a9a395" stroke-width="1"/>`
          + `<rect x="${x}" y="38.5" width="7" height="38" fill="#f6f3ec" stroke="#a9a395" stroke-width="1"/>`
          + `<path d="M${x + 2.3} 40 V75 M${x + 4.7} 40 V75" stroke="#cfc9bb" stroke-width="1"/>`).join("")
        + `<rect x="13" y="76.5" width="74" height="6" fill="#e1dccf" stroke="#a9a395" stroke-width="1.4"/>`
        + `<rect x="8" y="82.5" width="84" height="7" fill="#d4cebf" stroke="#a9a395" stroke-width="1.4"/>` },
    webgewicht: { name: "Webgewichte aus Ton (mit Loch, an Fäden des Webstuhls)", box: "0 0 100 100",
      svg: `<rect x="6" y="6" width="88" height="7" rx="3" fill="#8b5e34"/>`
        + [24, 50, 76].map(x => `<line x1="${x}" y1="13" x2="${x}" y2="42" stroke="#c8b48a" stroke-width="2"/>`
          + `<path d="M${x - 8} 44 Q${x} 36 ${x + 8} 44 L${x + 13} 90 Q${x} 95 ${x - 13} 90 Z" fill="#b07b52" stroke="#7d5232" stroke-width="1.6"/>`
          + `<circle cx="${x}" cy="50" r="3.2" fill="#4a3420"/>`).join("") },
    tonkrug: { name: "Tonkrug (gebrannter Ton, Henkel, eingeritzte Zickzacklinie)", box: "0 0 100 100",
      svg: `<path d="M66 34 C86 34 86 60 64 60" stroke="#a8622f" stroke-width="7" fill="none" stroke-linecap="round"/>`
        + `<path d="M38 14 H62 L60 26 C80 34 80 74 66 88 Q50 96 34 88 C20 74 20 34 40 26 Z" fill="#c47a45" stroke="#8d5229" stroke-width="2"/>`
        + `<ellipse cx="50" cy="14" rx="13" ry="3.5" fill="#8d5229"/>`
        + `<path d="M27 46 L33 40 L39 46 L45 40 L51 46 L57 40 L63 46 L69 40 L74 46" stroke="#7a4421" stroke-width="2" fill="none"/>`
        + `<path d="M26 54 H74" stroke="#7a4421" stroke-width="1.6"/>` },
    steinbeil: { name: "Steinbeil der Pfahlbauer (geschliffene Steinklinge in Hirschgeweih, Holzschaft)", box: "0 0 100 100",
      svg: `<path d="M24 94 Q30 60 52 30" stroke="#8b5e34" stroke-width="10" fill="none" stroke-linecap="round"/>`
        + `<path d="M28 84 Q33 64 46 44" stroke="#a8743f" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
        + `<path d="M40 28 Q52 18 66 22 L70 34 Q56 36 46 42 Z" fill="#e3d6bc" stroke="#9c8a68" stroke-width="2"/>`
        + `<path d="M48 28 l3 6 M56 25 l2 7" stroke="#b7a684" stroke-width="1.6" stroke-linecap="round"/>`
        + `<path d="M64 22 L88 10 Q96 22 88 36 L70 34 Z" fill="#6f8a78" stroke="#435a4b" stroke-width="2"/>`
        + `<path d="M76 18 Q86 16 90 26" stroke="#9fb7a6" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
    bronzebeil: { name: "Beil aus Bronze (goldbraune Metallklinge am Holzschaft)", box: "0 0 100 100",
      svg: `<path d="M22 92 L62 18" stroke="#8b5e34" stroke-width="9" stroke-linecap="round"/>`
        + `<path d="M48 26 L60 32 L58 40 L46 34 Z" fill="#6b4a2b"/>`
        + `<path d="M52 30 L80 14 Q92 20 90 36 Q86 46 74 48 L56 40 Z" fill="#c08a3e" stroke="#7d5a22" stroke-width="2"/>`
        + `<path d="M80 18 Q88 24 86 36" stroke="#e8c070" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
        + `<path d="M60 36 L76 28" stroke="#9c6e2c" stroke-width="1.6"/>` },
    mahlstein: { name: "Mahlstein (flacher Unterstein, Läufer zum Reiben, Körner und Mehl)", box: "0 0 100 100",
      svg: `<path d="M6 80 Q8 64 26 62 Q50 70 74 62 Q92 64 94 80 Q90 90 50 90 Q10 90 6 80 Z" fill="#9aa0a6" stroke="#636a71" stroke-width="2"/>`
        + `<path d="M20 68 Q50 76 80 68" stroke="#7d848b" stroke-width="2" fill="none"/>`
        + `<ellipse cx="54" cy="56" rx="20" ry="9" fill="#b3b8bd" stroke="#636a71" stroke-width="2"/>`
        + `<path d="M40 53 Q54 49 68 53" stroke="#d2d6da" stroke-width="2" fill="none"/>`
        + `<ellipse cx="26" cy="70" rx="9" ry="3" fill="#f3ead6"/>`
        + [[16, 66], [20, 63], [12, 70], [78, 66], [84, 69], [74, 70], [30, 64]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1.4" fill="#d9a93e"/>`).join("") },
    latein: { name: "Lateinische Inschrift (Steintafel mit dem Wort VILLA)", box: "0 0 100 100",
      svg: `<rect x="8" y="14" width="84" height="72" rx="3" fill="#ddd6c8" stroke="#8d857a" stroke-width="3"/>`
        + `<rect x="14" y="20" width="72" height="60" fill="none" stroke="#b5ad9f" stroke-width="1.6"/>`
        + `<path d="M17 30 L23 56 L29 30 M37 30 V56 M45 30 V56 H55 M60 30 V56 H70 M74 56 L80 30 L86 56 M76.4 47 H83.6" stroke="#5a5247" stroke-width="3.6" fill="none" stroke-linejoin="round"/>`
        + `<path d="M22 66 H78 M30 73 H70" stroke="#8d857a" stroke-width="2.4" stroke-dasharray="6 3"/>` },
    aventicum: { name: "Amphitheater von Aventicum (ovale Arena, Mauer mit Bögen)", box: "0 0 100 100",
      svg: `<ellipse cx="50" cy="52" rx="45" ry="22" fill="#cdbfa6" stroke="#8d7f66" stroke-width="2"/>`
        + `<ellipse cx="50" cy="52" rx="36" ry="16" fill="#b9aa8e"/><ellipse cx="50" cy="54" rx="26" ry="10" fill="#e8d9a8" stroke="#a8986f" stroke-width="1.6"/>`
        + `<path d="M5 52 A45 22 0 0 0 95 52 L95 70 A45 22 0 0 1 5 70 Z" fill="#c2b398" stroke="#8d7f66" stroke-width="2"/>`
        + [10, 18, 27, 36, 45, 55, 64, 73, 82, 90].map(x => { const y = 52 + 22 * Math.sqrt(Math.max(0, 1 - ((x - 50) / 45) ** 2)); return `<path d="M${x - 2.6} ${y + 14} v-5 a2.6 2.6 0 0 1 5.2 0 v5 Z" fill="#6f6250"/>`; }).join("") },
    wachstafel: { name: "Wachstafel und Griffel (Holzrahmen, dunkles Wachs mit eingeritzter Schrift)", box: "0 0 100 100",
      svg: `<rect x="10" y="16" width="70" height="70" rx="4" fill="#a8743f" stroke="#6b4a2b" stroke-width="2"/>`
        + `<rect x="18" y="24" width="54" height="54" rx="2" fill="#5a4630"/>`
        + `<path d="M24 34 h12 l4 -4 h10 M24 44 h22 l3 3 h12 M24 54 h8 l4 -3 h18 M24 64 h20" stroke="#c9b48c" stroke-width="2" fill="none" stroke-linecap="round"/>`
        + `<path d="M62 92 L92 22" stroke="#d6cdb8" stroke-width="4.5" stroke-linecap="round"/><path d="M92 22 L95 14" stroke="#8d857a" stroke-width="2.4" stroke-linecap="round"/>`
        + `<path d="M61 94 l2 -6 l4 2 Z" fill="#8d857a"/>` },
    kaiser: { name: "Römischer Kaiser (Lorbeerkranz, Purpurmantel)", box: "0 0 100 100",
      svg: `<path d="M18 100 Q22 72 50 68 Q78 72 82 100 Z" fill="#7a2a6e"/><path d="M50 68 Q40 80 34 100 H46 Q48 82 56 70 Z" fill="#f1ece0"/>`
        + `<rect x="44" y="56" width="12" height="14" fill="#d9a77f"/>`
        + `<ellipse cx="50" cy="40" rx="18" ry="21" fill="#e2b48c"/>`
        + `<path d="M32 36 Q34 18 50 17 Q66 18 68 36 Q60 26 50 27 Q40 26 32 36 Z" fill="#6b4a2b"/>`
        + [[33, 32, -60], [36, 25, -40], [41, 20, -20], [47, 18, 0], [53, 18, 0], [59, 20, 20], [64, 25, 40], [67, 32, 60]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.4" transform="rotate(${w} ${x} ${y})" fill="#4f8f3a" stroke="#356b25" stroke-width=".8"/>`).join("")
        + `<circle cx="43" cy="40" r="1.8" fill="#3a2c22"/><circle cx="57" cy="40" r="1.8" fill="#3a2c22"/>`
        + `<path d="M50 41 L47 50 H52" stroke="#b3835f" stroke-width="1.6" fill="none"/><path d="M44 54 Q50 57 56 54" stroke="#9a5a44" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
        + `<ellipse cx="32" cy="42" rx="3" ry="5" fill="#d9a77f"/><ellipse cx="68" cy="42" rx="3" ry="5" fill="#d9a77f"/>` },
    hieroglyphen: { name: "Hieroglyphen (Bildzeichen auf Stein: Auge, Vogel, Wasser, Lebenszeichen)", box: "0 0 100 100",
      svg: `<rect x="8" y="6" width="84" height="88" rx="3" fill="#e9d29b" stroke="#b39556" stroke-width="2"/>`
        + `<path d="M50 8 V92" stroke="#c9ad6e" stroke-width="1.4"/>`
        + `<path d="M16 26 Q29 14 42 26 Q29 34 16 26 Z" fill="none" stroke="#1f3b73" stroke-width="2.6"/><circle cx="29" cy="25" r="3.6" fill="#1f3b73"/>`
        + `<path d="M22 31 L20 40 M30 32 Q34 40 40 38" stroke="#1f3b73" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
        + `<path d="M58 34 Q60 22 70 20 Q76 18 78 22 L84 22 L78 26 Q80 34 72 38 L64 40 L60 46 M70 38 L70 46 M66 40 L64 46" stroke="#1f3b73" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<circle cx="74" cy="23" r="1.4" fill="#1f3b73"/>`
        + `<path d="M16 62 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 M16 70 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4" stroke="#1f3b73" stroke-width="2.2" fill="none"/>`
        + `<ellipse cx="71" cy="60" rx="6" ry="8" fill="none" stroke="#a8322a" stroke-width="3"/><path d="M71 68 V86 M62 70 H80" stroke="#a8322a" stroke-width="3.4" stroke-linecap="round"/>` },
    mumie: { name: "Mumie (in Leinenbinden gewickelt, im bemalten Sarg)", box: "0 0 100 100",
      svg: `<path d="M50 4 C70 4 76 18 74 34 C72 52 78 72 70 94 H30 C22 72 28 52 26 34 C24 18 30 4 50 4 Z" fill="#c9962f" stroke="#7d5a14" stroke-width="2"/>`
        + `<path d="M50 10 C64 10 68 20 67 34 C66 52 70 70 64 90 H36 C30 70 34 52 33 34 C32 20 36 10 50 10 Z" fill="#efe6d0"/>`
        + [22, 30, 38, 46, 54, 62, 70, 78].map((y, i) => `<path d="M${33 + (i % 2) * 2} ${y} L${67 - ((i + 1) % 2) * 2} ${y + 5}" stroke="#c8bb9a" stroke-width="2.4"/>`).join("")
        + `<path d="M40 22 Q50 18 60 22" stroke="#3a2c22" stroke-width="2" fill="none"/><path d="M42 26 h5 M53 26 h5" stroke="#3a2c22" stroke-width="2.4" stroke-linecap="round"/>`
        + `<path d="M26 34 Q50 42 74 34" stroke="#1f3b73" stroke-width="3" fill="none"/>` },
    schriftzeichen: { name: "Chinesisches Schriftzeichen (山, „Berg“, mit dem Pinsel auf Papier, roter Stempel)", box: "0 0 100 100",
      svg: `<rect x="12" y="6" width="76" height="88" fill="#f5efe0" stroke="#c9bb9a" stroke-width="2"/>`
        + `<path d="M50 20 V70" stroke="#1b1b1f" stroke-width="8" stroke-linecap="round"/>`
        + `<path d="M28 40 L29 72" stroke="#1b1b1f" stroke-width="7" stroke-linecap="round"/>`
        + `<path d="M72 36 L71 72" stroke="#1b1b1f" stroke-width="7" stroke-linecap="round"/>`
        + `<path d="M28 72 Q50 74 72 72" stroke="#1b1b1f" stroke-width="7" fill="none" stroke-linecap="round"/>`
        + `<rect x="70" y="80" width="10" height="10" fill="#c8312a"/><path d="M73 83 h4 M73 86 h4 M75 82 v6" stroke="#f5efe0" stroke-width="1.2"/>` },

    // ---------- Menschen der Urzeit (erdzeit-leiter; Bemerkung 28, Entscheid MF1 a) ----------
    // Seitenansicht nach rechts. Kennzeichen: Vormensch behaart mit langen Armen und Affengesicht; Frühmensch weniger
    // behaart mit Steinwerkzeug; früher Homo sapiens schlank in Fellkleidung mit Speer; Neandertaler gedrungen und
    // kräftig, Überaugenwulst, grosse Nase, Fellkleidung.
    vormensch: { name: "Vormensch (geht aufrecht, klein, ganz behaart, lange Arme, Affengesicht)", box: "0 0 100 100",
      svg: GRAS + `<path d="M48 62 L42 88 M54 62 L60 88" stroke="#4a3322" stroke-width="7" stroke-linecap="round"/>`
        + `<ellipse cx="40" cy="90" rx="5" ry="2.6" fill="#4a3322"/><ellipse cx="63" cy="90" rx="5" ry="2.6" fill="#4a3322"/>`
        + `<path d="M46 40 L40 74" stroke="#4f3624" stroke-width="6" stroke-linecap="round"/>`
        + `<ellipse cx="51" cy="50" rx="12" ry="17" fill="#5a3d27"/>`
        + `<path d="M56 40 L64 74" stroke="#5a3d27" stroke-width="6" stroke-linecap="round"/>`
        + `<ellipse cx="54" cy="25" rx="11" ry="10" fill="#5a3d27"/>`
        + `<path d="M56 22 Q68 20 68 30 Q68 37 58 36 Q54 30 56 22 Z" fill="#a87d5c"/>`
        + `<path d="M55 20 Q61 17 66 21" stroke="#3a281a" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
        + `<circle cx="61" cy="24" r="1.5" fill="#1b1b1f"/><path d="M62 33 Q65 34 67 32" stroke="#6e4a33" stroke-width="1.4" fill="none"/>`
        + `<path d="M44 38 l-3 3 M46 50 l-3 2 M50 60 l-2 3 M58 44 l3 2" stroke="#3a281a" stroke-width="1.4" stroke-linecap="round"/>` },
    fruehmensch: { name: "Frühmensch (aufrecht, weniger behaart, schlägt ein Steinwerkzeug)", box: "0 0 100 100",
      svg: GRAS + `<path d="M47 60 L43 90 M53 60 L59 90" stroke="#6e4630" stroke-width="7" stroke-linecap="round"/>`
        + `<ellipse cx="41" cy="91" rx="5" ry="2.6" fill="#5a3a26"/><ellipse cx="62" cy="91" rx="5" ry="2.6" fill="#5a3a26"/>`
        + `<path d="M46 38 Q40 50 46 58" stroke="#7a4e35" stroke-width="5.5" fill="none" stroke-linecap="round"/>`
        + `<ellipse cx="50" cy="47" rx="10" ry="16" fill="#8a5a3c"/>`
        + `<path d="M45 40 l-2 3 M48 52 l-2 3 M53 44 l2 2" stroke="#5a3a26" stroke-width="1.3" stroke-linecap="round"/>`
        + `<path d="M54 38 Q62 44 66 52" stroke="#8a5a3c" stroke-width="5.5" fill="none" stroke-linecap="round"/>`
        + `<ellipse cx="68" cy="54" rx="5" ry="4" fill="#8d8478" stroke="#5e5246" stroke-width="1.2"/>`
        + `<ellipse cx="48" cy="60" rx="5" ry="3.6" fill="#a39886" stroke="#5e5246" stroke-width="1.2"/>`
        + `<circle cx="52" cy="24" r="10" fill="#8a5a3c"/><path d="M42 22 Q44 12 54 13 Q62 14 62 20 Q54 16 44 24 Z" fill="#3a281a"/>`
        + `<path d="M55 21 Q59 19 62 21" stroke="#5a3a26" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
        + `<circle cx="58" cy="24" r="1.4" fill="#1b1b1f"/><path d="M61 25 L64 29 L60 29" fill="#7a4e35"/><path d="M57 31 Q60 32 62 31" stroke="#5a3a26" stroke-width="1.3" fill="none"/>` },
    "homo-sapiens-frueh": { name: "Früher Homo sapiens (schlank, aufrecht, Kleidung aus Fell, Speer mit Steinspitze)", box: "0 0 100 100",
      svg: GRAS + `<path d="M70 8 L70 92" stroke="#8b5e34" stroke-width="3.4" stroke-linecap="round"/><path d="M70 2 L74 10 L66 10 Z" fill="#8d8478"/>`
        + `<path d="M47 62 L44 90 M53 62 L57 90" stroke="#6b4129" stroke-width="6" stroke-linecap="round"/>`
        + `<ellipse cx="42" cy="91" rx="4.6" ry="2.4" fill="#4e2f1d"/><ellipse cx="60" cy="91" rx="4.6" ry="2.4" fill="#4e2f1d"/>`
        + `<path d="M46 38 Q40 50 44 60" stroke="#6b4129" stroke-width="5" fill="none" stroke-linecap="round"/>`
        + `<path d="M41 36 Q50 32 59 36 L62 66 Q50 70 38 66 Z" fill="#c19a6b" stroke="#8d6a40" stroke-width="1.6"/>`
        + `<path d="M40 64 l3 4 l3 -4 l3 4 l3 -4 l3 4 l3 -4 l3 4" stroke="#8d6a40" stroke-width="1.4" fill="none"/>`
        + `<path d="M56 40 Q64 42 68 46" stroke="#6b4129" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="69.5" cy="46" r="3" fill="#6b4129"/>`
        + `<rect x="47" y="30" width="7" height="6" fill="#6b4129"/>`
        + `<ellipse cx="51" cy="22" rx="8.5" ry="10" fill="#7a4b30"/><path d="M42 20 Q42 9 52 10 Q61 11 60 19 Q53 14 44 22 Z" fill="#1e1611"/>`
        + `<circle cx="55" cy="21" r="1.4" fill="#1b1b1f"/><path d="M58 22 L60.5 26 L57.5 26" fill="#6b4129"/><path d="M54 29 Q57 30 59 28" stroke="#4e2f1d" stroke-width="1.3" fill="none"/>` },
    neandertaler: { name: "Neandertaler (gedrungen und kräftig, Überaugenwulst, grosse Nase, Bart, Fellkleidung)", box: "0 0 100 100",
      svg: FELS + `<path d="M44 66 L41 88 M56 66 L59 88" stroke="#a7795a" stroke-width="9" stroke-linecap="round"/>`
        + `<ellipse cx="39" cy="90" rx="6" ry="3" fill="#6b4a2b"/><ellipse cx="62" cy="90" rx="6" ry="3" fill="#6b4a2b"/>`
        + `<path d="M36 42 Q28 54 34 64" stroke="#a7795a" stroke-width="8" fill="none" stroke-linecap="round"/>`
        + `<path d="M33 38 Q50 30 67 38 L70 68 Q50 74 30 68 Z" fill="#9c7448" stroke="#6b4a2b" stroke-width="1.8"/>`
        + `<path d="M31 66 Q50 72 69 66" stroke="#d8c3a0" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
        + `<path d="M64 42 Q72 50 70 62" stroke="#a7795a" stroke-width="8" fill="none" stroke-linecap="round"/>`
        + `<ellipse cx="51" cy="22" rx="14" ry="13" fill="#b5866a"/>`
        + `<path d="M37 22 Q36 6 52 7 Q66 8 66 18 Q56 12 40 24 Z" fill="#7a4a2a"/>`
        + `<path d="M50 17 Q58 13 66 17" stroke="#7d5640" stroke-width="4" fill="none" stroke-linecap="round"/>`
        + `<circle cx="59" cy="20" r="1.6" fill="#1b1b1f"/>`
        + `<path d="M63 20 Q70 24 67 29 L62 28 Z" fill="#9c6c52"/>`
        + `<path d="M44 26 Q46 40 56 38 Q64 36 64 30 Q58 34 52 30 Q48 30 44 26 Z" fill="#7a4a2a"/>` },

    // ---------- Aus der Zeit der Kultur statt in heutiger Form (Entscheid BZ1 a) ----------
    "zahlen-roemisch": { name: "Römische Zahlen (Steintafel mit I V X)", box: "0 0 100 100",
      svg: `<rect x="8" y="14" width="84" height="72" rx="3" fill="#ddd6c8" stroke="#8d857a" stroke-width="3"/>`
        + `<rect x="14" y="20" width="72" height="60" fill="none" stroke="#b5ad9f" stroke-width="1.6"/>`
        + `<path d="M24 30 V58 M20 30 H28 M20 58 H28" stroke="#5a5247" stroke-width="4"/>`
        + `<path d="M38 30 L48 58 L58 30 M35 30 H41 M55 30 H61" stroke="#5a5247" stroke-width="4" fill="none"/>`
        + `<path d="M66 30 L82 58 M82 30 L66 58 M63 30 H70 M78 30 H85 M63 58 H70 M78 58 H85" stroke="#5a5247" stroke-width="4"/>`
        + `<path d="M22 68 H78 M30 74 H70" stroke="#8d857a" stroke-width="2.4" stroke-dasharray="6 3"/>` },
    "helm-roemisch": { name: "Helm eines römischen Legionärs (Wangenklappen, Nackenschutz, roter Busch)", box: "0 0 100 100",
      svg: `<path d="M30 21 Q50 3 70 21 Q50 13 30 21 Z" fill="#c8312a"/><rect x="47" y="14" width="6" height="8" fill="#8d857a"/>`
        + `<path d="M74 50 Q92 56 95 68 Q82 66 72 61 Z" fill="#a3a8af" stroke="#5f656d" stroke-width="2"/>`
        + `<path d="M22 57 Q20 22 50 19 Q80 22 78 57 Z" fill="#b8bcc2" stroke="#5f656d" stroke-width="2"/>`
        + `<path d="M34 30 Q50 24 66 30" stroke="#d7dade" stroke-width="3" fill="none" stroke-linecap="round"/>`
        + `<path d="M20 53 Q50 45 80 53" stroke="#c99a3c" stroke-width="5" fill="none"/>`
        + `<path d="M25 56 Q21 76 34 87 Q41 74 41 59 Z" fill="#c99a3c" stroke="#8a6a24" stroke-width="2"/>`
        + `<path d="M75 56 Q79 76 66 87 Q59 74 59 59 Z" fill="#c99a3c" stroke="#8a6a24" stroke-width="2"/>`
        + `<circle cx="32" cy="70" r="1.8" fill="#8a6a24"/><circle cx="68" cy="70" r="1.8" fill="#8a6a24"/>` },
    "helm-griechisch": { name: "Griechischer Helm aus Bronze (Gesicht bedeckt, Nasenschutz, hoher Busch)", box: "0 0 100 100",
      svg: `<path d="M18 32 Q50 -6 84 30 Q50 15 18 32 Z" fill="#b02a2a"/><path d="M30 26 Q50 10 72 24" stroke="#8a1f1f" stroke-width="1.6" fill="none"/>`
        + `<path d="M24 60 Q22 27 50 23 Q78 27 76 60 L72 86 Q64 92 58 90 L56 67 L44 67 L42 90 Q36 92 28 86 Z" fill="#c8913a" stroke="#7d5a22" stroke-width="2"/>`
        + `<path d="M30 50 Q38 43 47 49 L47 55 Q38 53 30 57 Z" fill="#2a1d10"/><path d="M70 50 Q62 43 53 49 L53 55 Q62 53 70 57 Z" fill="#2a1d10"/>`
        + `<rect x="47" y="42" width="6" height="27" rx="2" fill="#c8913a" stroke="#7d5a22" stroke-width="1.4"/>`
        + `<path d="M32 34 Q50 28 68 34" stroke="#e2b45e" stroke-width="2.6" fill="none" stroke-linecap="round"/>` },
    nilboot: { name: "Boot auf dem Nil (aus Papyrus gebunden, viereckiges Segel)", box: "0 0 100 100",
      svg: `<rect x="0" y="78" width="100" height="22" fill="#5aa3d6"/><path d="M6 86 q6 -3 12 0 M46 92 q6 -3 12 0 M76 86 q6 -3 12 0" stroke="#8cc8ee" stroke-width="2" fill="none" stroke-linecap="round"/>`
        + `<line x1="50" y1="76" x2="50" y2="10" stroke="#6b4a2b" stroke-width="3"/>`
        + `<path d="M30 16 H70 V56 H30 Z" fill="#f1e8d0" stroke="#a8986f" stroke-width="2"/>`
        + `<path d="M27 15 H73 M27 57 H73" stroke="#6b4a2b" stroke-width="3" stroke-linecap="round"/>`
        + `<path d="M8 64 Q50 90 92 64 Q86 76 50 81 Q14 76 8 64 Z" fill="#c9a64a" stroke="#8a6f26" stroke-width="2"/>`
        + `<path d="M8 64 Q1 54 8 46 M92 64 Q99 54 92 46" stroke="#8a6f26" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
        + [22, 34, 46, 58, 70, 80].map(x => `<line x1="${x}" y1="${70 + Math.abs(50 - x) / 8}" x2="${x}" y2="${77 - Math.abs(50 - x) / 10}" stroke="#8a6f26" stroke-width="1.6"/>`).join("") },
    "stadion-antik": { name: "Stadion der Griechen (lange Laufbahn zwischen Erdwällen mit Steinsitzen)", box: "0 0 100 100",
      svg: `<path d="M0 32 Q20 22 40 30 L60 30 Q80 22 100 32 Z" fill="#a9b4a0"/>`
        + `<path d="M0 30 L40 30 L22 100 L0 100 Z" fill="#9ec27a"/><path d="M100 30 L60 30 L78 100 L100 100 Z" fill="#9ec27a"/>`
        + `<path d="M40 30 L60 30 L78 100 L22 100 Z" fill="#d9b98a"/>`
        + `<path d="M2 44 L36 44 M2 58 L33 58 M2 72 L29 72 M2 86 L26 86 M98 44 L64 44 M98 58 L67 58 M98 72 L71 72 M98 86 L74 86" stroke="#d6d0c2" stroke-width="3.4"/>`
        + [30, 40, 50, 60, 70].map(x => `<rect x="${x - 1.8}" y="84" width="3.6" height="9" fill="#e9e4d8" stroke="#8d857a" stroke-width="1"/>`).join("")
        + `<path d="M26 92 H74" stroke="#f3efe6" stroke-width="2"/><rect x="48.5" y="28" width="3" height="7" fill="#e9e4d8" stroke="#8d857a" stroke-width=".8"/>` },
    thermen: { name: "Römisches Bad (Becken mit warmem Wasser, Säulen, Dampf)", box: "0 0 100 100",
      svg: `<rect x="20" y="18" width="60" height="52" fill="#e9d9c0"/><path d="M40 50 V34 a10 10 0 0 1 20 0 V50 Z" fill="#a8c8e0"/>`
        + `<rect x="6" y="9" width="88" height="10" fill="#d8cfbd" stroke="#a9a395" stroke-width="1.4"/>`
        + `<rect x="12" y="19" width="9" height="52" fill="#f3eee4" stroke="#a9a395" stroke-width="1.2"/><rect x="79" y="19" width="9" height="52" fill="#f3eee4" stroke="#a9a395" stroke-width="1.2"/>`
        + `<path d="M4 70 H96 L99 94 H1 Z" fill="#c7bfae"/><path d="M14 74 H86 L90 90 H10 Z" fill="#6fb6e0"/><path d="M18 80 H82" stroke="#a9dbf3" stroke-width="2"/>`
        + `<path d="M34 68 q-4 -6 0 -12 q4 -6 0 -12 M50 68 q-4 -6 0 -12 q4 -6 0 -12 M66 68 q-4 -6 0 -12 q4 -6 0 -12" stroke="#b9c7d3" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
    hypokaust: { name: "Römische Bodenheizung (Boden auf kleinen Pfeilern, darunter warme Luft vom Feuer)", box: "0 0 100 100",
      svg: `<rect x="4" y="20" width="92" height="7" fill="#d9c8a8"/><path d="M16 20 v7 M30 20 v7 M44 20 v7 M58 20 v7 M72 20 v7 M86 20 v7" stroke="#b9a684" stroke-width="1.2"/>`
        + `<rect x="4" y="27" width="92" height="9" fill="#b5694a"/>`
        + [24, 40, 56, 72, 88].map(x => [0, 1, 2, 3].map(i => `<rect x="${x - 5}" y="${36 + i * 11}" width="10" height="11" fill="#c27b55" stroke="#8d4e30" stroke-width="1.2"/>`).join("")).join("")
        + `<rect x="0" y="80" width="100" height="10" fill="#8b6a4a"/>`
        + `<path d="M3 80 Q2 70 7 64 Q8 72 11 68 Q14 74 12 80 Z" fill="#f08a2a"/><path d="M5 80 Q5 74 8 71 Q10 76 10 80 Z" fill="#ffd34a"/>`
        + `<path d="M12 58 q6 -5 12 0 t16 0 t16 0 t16 0 t12 0" stroke="#e0503a" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M82 54 L88 58 L82 62" stroke="#e0503a" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
    aquaedukt: { name: "Aquädukt (Wasserleitung auf Bögen aus Stein)", box: "0 0 100 100",
      svg: GRAS + `<path fill="#cdb894" stroke="#9a8664" stroke-width="1.4" fill-rule="evenodd" d="M4 46 H96 V92 H4 Z`
        + [0, 1, 2, 3].map(i => ` M${9 + i * 22} 92 V62 a8 8 0 0 1 16 0 V92 Z`).join("") + `"/>`
        + `<path fill="#d8c5a1" stroke="#9a8664" stroke-width="1.4" fill-rule="evenodd" d="M4 24 H96 V46 H4 Z`
        + [0, 1, 2, 3, 4, 5, 6].map(i => ` M${7 + i * 13} 46 V36 a4.5 4.5 0 0 1 9 0 V46 Z`).join("") + `"/>`
        + `<rect x="4" y="17" width="92" height="7" fill="#c2ad88" stroke="#9a8664" stroke-width="1.4"/><rect x="4" y="18" width="92" height="2.4" fill="#5aa3d6"/>` },
    "muenze-roemisch": { name: "Römische Münze (Kopf des Kaisers im Profil mit Lorbeerkranz)", box: "0 0 100 100",
      svg: `<circle cx="50" cy="50" r="42" fill="#c9a24a" stroke="#8a6a24" stroke-width="3"/>`
        + `<circle cx="50" cy="50" r="34" fill="none" stroke="#a8842f" stroke-width="1.6" stroke-dasharray="2 3"/>`
        + rund(20, 50, 50, `<rect x="49" y="11" width="2.2" height="5" fill="#8a6a24"/>`)
        + `<path d="M44 26 Q58 24 62 36 L67 44 L62 46 Q64 52 60 54 Q62 60 56 62 L55 70 Q46 75 39 70 Q33 60 36 46 Q34 32 44 26 Z" fill="#b18a36" stroke="#7d5a22" stroke-width="1.8"/>`
        + [[40, 30, -50], [46, 26, -20], [53, 25, 10], [36, 37, -80], [35, 45, -95]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="1.8" transform="rotate(${w} ${x} ${y})" fill="#7d5a22"/>`).join("")
        + `<circle cx="56" cy="40" r="1.4" fill="#5a3e14"/>` },
    pharao: { name: "Pharao (gestreiftes Kopftuch, Kobra an der Stirn, Bart, breiter Halskragen)", box: "0 0 100 100",
      svg: `<path d="M18 94 L24 44 Q26 13 50 11 Q74 13 76 44 L82 94 L66 94 L62 56 L38 56 L34 94 Z" fill="#e8b830" stroke="#a87e14" stroke-width="1.6"/>`
        + [62, 70, 78, 86].map(y => `<path d="M${21 - (y - 60) / 10} ${y} L35 ${y} M${79 + (y - 60) / 10} ${y} L65 ${y}" stroke="#2b4fa0" stroke-width="3.2"/>`).join("")
        + `<path d="M28 26 Q50 14 72 26 M25 36 Q50 26 75 36" stroke="#2b4fa0" stroke-width="3" fill="none"/>`
        + `<ellipse cx="50" cy="45" rx="13" ry="16" fill="#c98e5f"/>`
        + `<path d="M36 34 Q50 27 64 34" stroke="#c79a1f" stroke-width="4" fill="none"/>`
        + `<path d="M50 32 q-3.5 -6 0 -11 q3.5 5 0 11 Z" fill="#d9a21a" stroke="#8a6a24" stroke-width="1"/>`
        + `<path d="M40 43 h7 M53 43 h7" stroke="#1b1b1f" stroke-width="2.4" stroke-linecap="round"/><path d="M38 43 l-3 1 M62 43 l3 1" stroke="#1b1b1f" stroke-width="1.6"/>`
        + `<path d="M50 45 v6 h2" stroke="#a8724a" stroke-width="1.4" fill="none"/>`
        + `<path d="M30 74 Q50 90 70 74 L73 84 Q50 101 27 84 Z" fill="#2f8f8a" stroke="#e8b830" stroke-width="2"/>`
        + `<rect x="46" y="59" width="8" height="19" rx="3" fill="#3b2a1a"/><path d="M46 64 h8 M46 69 h8 M46 74 h8" stroke="#6b4a2b" stroke-width="1.2"/>` },
    "schreiber-aegypten": { name: "Ägyptischer Schreiber (sitzt mit gekreuzten Beinen, Papyrusrolle auf dem Schoss)", box: "0 0 100 100",
      svg: `<ellipse cx="50" cy="84" rx="34" ry="11" fill="#f1ece0" stroke="#b9b09c" stroke-width="1.6"/>`
        + `<path d="M36 46 Q50 40 64 46 L66 76 H34 Z" fill="#b07a4f"/>`
        + `<rect x="24" y="68" width="52" height="9" rx="2" fill="#efe2b8" stroke="#b39556" stroke-width="1.4"/>`
        + `<circle cx="24" cy="72.5" r="5" fill="#e2d29e" stroke="#b39556" stroke-width="1.4"/><path d="M32 72 h10 M46 72 h8" stroke="#1f3b73" stroke-width="1.6"/>`
        + `<path d="M36 50 Q30 62 40 68 M64 50 Q70 60 62 66" stroke="#b07a4f" stroke-width="6" fill="none" stroke-linecap="round"/>`
        + `<path d="M62 66 L72 56" stroke="#6b4a2b" stroke-width="2" stroke-linecap="round"/>`
        + `<circle cx="50" cy="30" r="12" fill="#b07a4f"/><path d="M37 32 Q36 16 50 16 Q64 16 63 32 Q60 24 50 24 Q40 24 37 32 Z" fill="#1e1611"/>`
        + `<path d="M44 31 h4 M52 31 h4" stroke="#1b1b1f" stroke-width="2" stroke-linecap="round"/><path d="M46 37 Q50 39 54 37" stroke="#7a4e30" stroke-width="1.4" fill="none"/>` },
    "kompass-china": { name: "Chinesischer Kompass (Löffel aus Magnetstein auf einer Bronzeplatte)", box: "0 0 100 100",
      svg: `<rect x="8" y="16" width="84" height="74" rx="3" fill="#b9863e" stroke="#6b4a20" stroke-width="2"/>`
        + `<rect x="14" y="22" width="72" height="62" fill="none" stroke="#8a6228" stroke-width="1.4"/>`
        + `<circle cx="50" cy="53" r="25" fill="#d4a95a" stroke="#6b4a20" stroke-width="2"/>`
        + rund(24, 50, 53, `<rect x="49.2" y="22" width="1.6" height="5" fill="#6b4a20"/>`)
        + `<path d="M46 56 L76 36" stroke="#2e2b2a" stroke-width="4.5" stroke-linecap="round"/>`
        + `<ellipse cx="42" cy="58" rx="12" ry="9" transform="rotate(-30 42 58)" fill="#2e2b2a"/><ellipse cx="39" cy="57" rx="4" ry="2.4" transform="rotate(-30 39 57)" fill="#6d6a68"/>` },
    philosoph: { name: "Griechischer Philosoph (Bart, langes Gewand über der Schulter, Schriftrolle)", box: "0 0 100 100",
      svg: `<path d="M30 40 Q50 32 70 40 L76 94 H24 Z" fill="#f1ece0" stroke="#b9b09c" stroke-width="1.6"/>`
        + `<path d="M34 42 Q56 60 72 92 M30 56 Q40 70 36 92" stroke="#cfc6b2" stroke-width="3" fill="none"/>`
        + `<path d="M66 44 Q70 54 62 60" stroke="#d9a77f" stroke-width="6" fill="none" stroke-linecap="round"/>`
        + `<rect x="54" y="56" width="16" height="7" rx="2" transform="rotate(-20 62 59)" fill="#efe2b8" stroke="#b39556" stroke-width="1.2"/>`
        + `<circle cx="50" cy="23" r="11" fill="#d9a77f"/><path d="M39 22 Q40 10 50 10 Q60 10 61 22 Q56 15 50 15 Q44 15 39 22 Z" fill="#a8a39a"/>`
        + `<path d="M39 25 Q41 45 50 47 Q59 45 61 25 Q57 33 50 33 Q43 33 39 25 Z" fill="#a8a39a"/>`
        + `<circle cx="45.5" cy="22" r="1.4" fill="#1b1b1f"/><circle cx="54.5" cy="22" r="1.4" fill="#1b1b1f"/>` },
    // Kleinbuchstaben α β: die grossen Α Β sähen aus wie die lateinischen A B
    "alpha-beta": { name: "Griechische Buchstaben Alpha und Beta auf Stein (α β)", box: "0 0 100 100",
      svg: `<rect x="8" y="14" width="84" height="72" rx="3" fill="#ece8de" stroke="#a9a395" stroke-width="3"/>`
        + `<path d="M44 40 Q38 62 30 64 Q19 66 19 54 Q19 41 30 41 Q38 41 42 56 Q45 65 49 64" stroke="#3b4a6b" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<path d="M60 80 V36 Q60 24 70 25 Q79 26 78 35 Q77 43 68 45 Q81 46 81 56 Q81 66 70 66 Q63 66 60 61" stroke="#3b4a6b" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` },
    "vase-laeufer": { name: "Griechische Vase (schwarze Figuren auf rotem Ton: ein Läufer)", box: "0 0 100 100",
      svg: `<path d="M40 22 Q24 22 27 42 M60 22 Q76 22 73 42" stroke="#5a2e14" stroke-width="4" fill="none"/>`
        + `<path d="M38 8 H62 L60 20 Q80 30 78 56 Q76 80 60 90 L62 96 H38 L40 90 Q24 80 22 56 Q20 30 40 20 Z" fill="#d9823a" stroke="#5a2e14" stroke-width="2"/>`
        + `<path d="M28 28 H72 M23 72 H77" stroke="#1b1b1f" stroke-width="4"/>`
        + `<path d="M25 78 h6 v-4 h6 v4 h6 v-4 h6 v4 h6 v-4 h6 v4 h6 v-4 h5" stroke="#1b1b1f" stroke-width="1.6" fill="none"/>`
        + `<circle cx="46" cy="38" r="4" fill="#1b1b1f"/>`
        + `<path d="M47 42 L53 54 M53 54 L45 64 M53 54 L61 62 L66 60 M49 46 L40 43 M49 46 L59 44" stroke="#1b1b1f" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` },
    karavelle: { name: "Segelschiff von Kolumbus (Holzschiff mit hohem Heck, drei Masten, Segel mit rotem Kreuz)", box: "0 0 100 100",
      svg: `<rect x="0" y="78" width="100" height="22" fill="#5aa3d6"/><path d="M4 88 q6 -3 12 0 M70 90 q6 -3 12 0" stroke="#8cc8ee" stroke-width="2" fill="none" stroke-linecap="round"/>`
        + `<line x1="30" y1="64" x2="30" y2="20" stroke="#5a3a1e" stroke-width="2.4"/><line x1="52" y1="64" x2="52" y2="8" stroke="#5a3a1e" stroke-width="2.6"/><line x1="76" y1="56" x2="76" y2="24" stroke="#5a3a1e" stroke-width="2.2"/>`
        + `<path d="M22 28 Q30 26 38 28 L37 50 Q30 52 23 50 Z" fill="#f3ecd8" stroke="#b9ad8e" stroke-width="1.6"/>`
        + `<path d="M38 16 Q52 13 66 16 L64 50 Q52 53 40 50 Z" fill="#f3ecd8" stroke="#b9ad8e" stroke-width="1.6"/>`
        + `<path d="M52 21 V45 M43 32 H61" stroke="#c8312a" stroke-width="4"/>`
        + `<path d="M76 26 L90 52 L76 52 Z" fill="#f3ecd8" stroke="#b9ad8e" stroke-width="1.6"/>`
        + `<path d="M52 8 l8 2 l-8 2 Z" fill="#c8312a"/>`
        + `<path d="M6 60 L94 60 L84 80 Q50 86 16 80 Z" fill="#7a4a2a" stroke="#4e2f1d" stroke-width="2"/>`
        + `<path d="M70 50 H94 L94 60 H70 Z M6 54 H22 V60 H6 Z" fill="#8b5a34" stroke="#4e2f1d" stroke-width="1.6"/>`
        + `<path d="M14 68 H86" stroke="#4e2f1d" stroke-width="1.4"/><circle cx="30" cy="72" r="1.6" fill="#2a1a10"/><circle cx="50" cy="73" r="1.6" fill="#2a1a10"/><circle cx="70" cy="72" r="1.6" fill="#2a1a10"/>` },
    motorwagen: { name: "Erstes Auto von Carl Benz (drei Räder mit Speichen, Sitzbank, Lenkstange, ohne Dach)", box: "0 0 100 100",
      svg: `<rect x="0" y="88" width="100" height="6" fill="#c9b99a"/>`
        + `<circle cx="66" cy="68" r="20" fill="none" stroke="#2a2a2a" stroke-width="3.4"/>`
        + rund(12, 66, 68, `<line x1="66" y1="68" x2="66" y2="49" stroke="#6b6b6b" stroke-width="1.4"/>`)
        + `<circle cx="18" cy="76" r="12" fill="none" stroke="#2a2a2a" stroke-width="3"/>`
        + rund(8, 18, 76, `<line x1="18" y1="76" x2="18" y2="65" stroke="#6b6b6b" stroke-width="1.2"/>`)
        + `<path d="M18 76 Q28 58 46 58 L84 58" stroke="#2a2a2a" stroke-width="3.2" fill="none" stroke-linecap="round"/>`
        + `<rect x="44" y="47" width="24" height="9" rx="2" fill="#3b2a1a"/><path d="M66 47 V32" stroke="#3b2a1a" stroke-width="4" stroke-linecap="round"/>`
        + `<path d="M36 58 L30 38 M25 38 H35" stroke="#2a2a2a" stroke-width="2.6" stroke-linecap="round"/>`
        + `<ellipse cx="82" cy="54" rx="9" ry="3" fill="#8d857a" stroke="#4e4a44" stroke-width="1.4"/><rect x="74" y="56" width="10" height="8" fill="#6b6b6b"/>`
        + `<circle cx="66" cy="68" r="3" fill="#2a2a2a"/><circle cx="18" cy="76" r="2.4" fill="#2a2a2a"/>` },
    mondlandung: { name: "Mondlandung 1969 (Landefähre mit vier Beinen auf dem grauen Mondboden, Fussspuren, die Erde am schwarzen Himmel)", box: "0 0 100 100",
      svg: `<rect x="0" y="0" width="100" height="100" fill="#1b1d33"/><circle cx="16" cy="12" r="1" fill="#ffffff"/><circle cx="44" cy="8" r="0.8" fill="#ffffff"/><circle cx="90" cy="34" r="0.9" fill="#ffffff"/><circle cx="60" cy="20" r="0.7" fill="#ffffff"/>`
        + `<circle cx="80" cy="16" r="9" fill="#2f7fd6"/><path d="M74 12 Q78 9 81 14 Q83 19 78 22 Q75 19 74 15 Z M83 9 Q88 11 88 16 Q85 18 84 14 Z" fill="#86c46f"/>`
        + `<path d="M0 74 Q20 68 42 72 Q66 66 100 72 V100 H0 Z" fill="#a7a9ad"/>`
        + `<ellipse cx="18" cy="86" rx="7" ry="2.4" fill="#8d8f94"/><ellipse cx="82" cy="90" rx="9" ry="2.8" fill="#8d8f94"/>`
        + `<path d="M58 88 l3 -1 M64 90 l3 -1 M70 87 l3 -1 M76 89 l3 -1" stroke="#6f7176" stroke-width="2" stroke-linecap="round"/>`
        + `<path d="M28 62 L18 80 M72 62 L82 80 M38 64 L34 80 M62 64 L66 80" stroke="#c9ccd3" stroke-width="2.4"/>`
        + `<path d="M14 80 H22 M78 80 H86 M30 80 H38 M62 80 H70" stroke="#c9ccd3" stroke-width="2.4" stroke-linecap="round"/>`
        + `<path d="M26 50 H74 L70 66 H30 Z" fill="#e3b341" stroke="#9a7420" stroke-width="1.6"/>`
        + `<path d="M34 30 H66 L70 50 H30 Z" fill="#d7dade" stroke="#7b7f88" stroke-width="1.6"/>`
        + `<path d="M42 36 L48 36 L46 44 L40 44 Z M52 36 L58 36 L60 44 L54 44 Z" fill="#2a2d45"/>`
        + `<path d="M50 30 V20 M44 22 H56" stroke="#7b7f88" stroke-width="1.8"/><circle cx="50" cy="19" r="2.4" fill="#d7dade" stroke="#7b7f88" stroke-width="1.2"/>` },
    // Windows zeichnet keine Flaggen-Emoji (🇨🇭 erscheint als „CH“, LERN_Session32). Masse des Kreuzes: Arme 6 von 32
    // Teilen breit und je 7 über die Mitte hinaus — aus dem Gedächtnis (Anhang zum Wappengesetz), beim Prüfen belegen.
    schweiz: { name: "Schweizer Fahne (rotes Quadrat mit weissem Kreuz)", box: "0 0 100 100",
      svg: `<rect x="4" y="4" width="92" height="92" fill="#da291c"/>`
        + `<rect x="41.38" y="21.25" width="17.25" height="57.50" fill="#ffffff"/>`
        + `<rect x="21.25" y="41.38" width="57.50" height="17.25" fill="#ffffff"/>` },
    "wright-flyer": { name: "Flugzeug der Brüder Wright (zwei lange Flügel übereinander, aus Holz und Stoff, Pilot liegt)", box: "0 0 100 100",
      svg: `<path d="M0 86 Q30 78 60 84 Q80 88 100 82 V100 H0 Z" fill="#e8d6a0"/>`
        + `<rect x="18" y="24" width="70" height="8" rx="2" fill="#efe6cc" stroke="#9c8a68" stroke-width="1.6"/>`
        + `<rect x="18" y="56" width="70" height="8" rx="2" fill="#efe6cc" stroke="#9c8a68" stroke-width="1.6"/>`
        + [22, 33, 44, 55, 66, 77, 86].map(x => `<line x1="${x}" y1="32" x2="${x}" y2="56" stroke="#6b4a2b" stroke-width="1.8"/>`).join("")
        + `<path d="M22 32 L33 56 M33 32 L22 56 M77 32 L86 56 M86 32 L77 56" stroke="#9c8a68" stroke-width="1"/>`
        + `<rect x="1" y="36" width="13" height="4" fill="#efe6cc" stroke="#9c8a68" stroke-width="1.2"/><rect x="1" y="48" width="13" height="4" fill="#efe6cc" stroke="#9c8a68" stroke-width="1.2"/>`
        + `<path d="M14 38 L20 33 M14 50 L20 57 M7 40 V48" stroke="#6b4a2b" stroke-width="1.4"/>`
        + `<path d="M88 38 L95 38 M88 52 L95 52" stroke="#6b4a2b" stroke-width="1.4"/><rect x="94" y="30" width="4" height="28" fill="#efe6cc" stroke="#9c8a68" stroke-width="1.2"/>`
        + `<ellipse cx="42" cy="44" rx="2.6" ry="10" fill="#b9a684"/><ellipse cx="64" cy="44" rx="2.6" ry="10" fill="#b9a684"/>`
        + `<ellipse cx="53" cy="53" rx="8" ry="2.8" fill="#3b3b3b"/><circle cx="45" cy="52" r="2.8" fill="#3b3b3b"/>` },

    // ---------- Englisch: Parallelwörter (wort-zwillinge/woerter.js; Bemerkung 50) ----------
    // Je Bild etwas, das kein anderes Bild der Liste „aehnlich“ zeigt: kein Haus im Garten (house), das Glas leer (milk,
    // water), das Knie ohne Fuss (foot), das Haar von hinten ohne Gesicht (mother, sister), der Sommer ohne Sonne (sun)
    // und ohne Glace (ice).
    garten: { name: "Garten (Lattenzaun, Blumen, Baum; kein Haus)", box: "0 0 100 100",
      svg: `<rect x="74" y="34" width="8" height="44" fill="#8a5a33"/><circle cx="78" cy="26" r="17" fill="#5e9e3f"/><circle cx="68" cy="32" r="10" fill="#6aa84f"/><circle cx="88" cy="33" r="10" fill="#4f8f35"/>`
        + [[16, 26, "#e0569a"], [34, 18, "#f0a030"], [52, 28, "#8a6fd6"]].map(([x, y, f]) => `<path d="M${x} 80 V${y + 6}" stroke="#4f8f35" stroke-width="3"/><path d="M${x} ${y + 26} q8 -2 10 -9 q-8 0 -10 9" fill="#6aa84f"/>`
          + rund(6, x, y, `<ellipse cx="${x}" cy="${y - 7}" rx="4" ry="6.5" fill="${f}"/>`) + `<circle cx="${x}" cy="${y}" r="4.2" fill="#f5c400"/>`).join("")
        + `<rect x="2" y="61" width="96" height="5" fill="#c9ab78"/><rect x="2" y="76" width="96" height="5" fill="#c9ab78"/>`
        + Array.from({ length: 7 }, (_, i) => { const x = 4 + i * 13.5; return `<path d="M${x} 90 V56 L${x + 4.5} 50 L${x + 9} 56 V90 Z" fill="#f1e2bf" stroke="#8a6a3f" stroke-width="1.6"/>`; }).join("")
        + GRAS },
    glas: { name: "Glas (leeres Trinkglas, durchsichtig)", box: "0 0 100 100",
      svg: `<path d="M27 14 L73 14 L66 88 Q50 93 34 88 Z" fill="#e3f1fa" fill-opacity="0.6" stroke="#6f9fbf" stroke-width="3" stroke-linejoin="round"/>`
        + `<path d="M34.6 80 L65.4 80 L66 88 Q50 93 34 88 Z" fill="#c4def0" stroke="#6f9fbf" stroke-width="2" stroke-linejoin="round"/>`
        + `<ellipse cx="50" cy="14" rx="23" ry="4.5" fill="#f4fbff" stroke="#6f9fbf" stroke-width="2.5"/>`
        + `<path d="M35 24 L39.5 74" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/><path d="M44 24 L45 36" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>` },
    gras: { name: "Gras (Büschel hoher grüner Halme)", box: "0 0 100 100",
      svg: [[6, -6, 42, "#5e9e3f"], [13, 4, 22, "#77b84f"], [20, -8, 34, "#4f8f35"], [27, 6, 12, "#6aa84f"], [34, -4, 28, "#86c45a"],
        [41, 10, 18, "#5e9e3f"], [47, -6, 8, "#77b84f"], [53, 8, 24, "#4f8f35"], [59, -10, 16, "#6aa84f"], [65, 6, 30, "#86c45a"],
        [71, -4, 14, "#5e9e3f"], [77, 10, 26, "#77b84f"], [83, -6, 36, "#4f8f35"], [88, 4, 44, "#6aa84f"]]
        .map(([x, dx, top, f]) => `<path d="M${x} 94 Q${x + dx * 0.2} ${(94 + top) / 2} ${x + dx} ${top} Q${x + dx * 0.2 + 5} ${(94 + top) / 2} ${x + 7} 94 Z" fill="${f}"/>`).join("")
        + `<ellipse cx="50" cy="95" rx="48" ry="5" fill="#8b6a4a"/>` },
    knie: { name: "Knie (angewinkeltes Bein von der Seite, Pflaster auf dem Knie, Pfeil; ohne Fuss)", box: "0 0 100 100",
      svg: `<path d="M0 32 Q36 29 64 32 Q83 33 82 50 Q80 72 79 100 L62 100 Q60 90 56 80 Q52 68 60 58 Q30 61 0 60 Z" fill="#f1c27d" stroke="#b07a45" stroke-width="2.4" stroke-linejoin="round"/>`
        + `<path d="M0 29 L30 28 L32 62 L0 62 Z" fill="#4d7fd1" stroke="#2f5aa3" stroke-width="2.4" stroke-linejoin="round"/>`
        + `<g transform="rotate(-40 74 42)"><rect x="63" y="37.5" width="22" height="9" rx="3.5" fill="#efc59a" stroke="#c4956a" stroke-width="1.4"/><rect x="70" y="38.5" width="8" height="7" rx="1.5" fill="#fbe6cf"/></g>`
        + `<path d="M96 6 L83 22" stroke="#e0569a" stroke-width="4.5" stroke-linecap="round"/><path d="M78 27 L80 15 L89 21 Z" fill="#e0569a"/>` },
    haar: { name: "Haar (lange Haare von hinten mit Spange, ohne Gesicht)", box: "0 0 100 100",
      svg: `<path d="M0 100 Q8 80 30 78 L70 78 Q92 80 100 100 Z" fill="#e8a33d"/>`
        + `<ellipse cx="19" cy="50" rx="5" ry="8.5" fill="#f1c27d" stroke="#b07a45" stroke-width="1.6"/><ellipse cx="81" cy="50" rx="5" ry="8.5" fill="#f1c27d" stroke="#b07a45" stroke-width="1.6"/>`
        + `<path d="M50 8 C24 8 18 30 20 50 C21 70 16 86 12 98 L88 98 C84 86 79 70 80 50 C82 30 76 8 50 8 Z" fill="#8b5a2b" stroke="#5e3a18" stroke-width="2.4"/>`
        + [[36, 16, 30, 96], [44, 12, 40, 96], [50, 10, 50, 96], [56, 12, 60, 96], [64, 16, 70, 96]].map(([x1, y1, x2, y2]) =>
          `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 - 4} ${(y1 + y2) / 2} ${x2} ${y2}" stroke="#6b4220" stroke-width="2" fill="none"/>`).join("")
        + `<rect x="56" y="24" width="16" height="6" rx="3" transform="rotate(-20 64 27)" fill="#e0569a" stroke="#a83a72" stroke-width="1.4"/>` },
    sommer: { name: "Sommer (Strand mit Sonnenschirm, Meer, Sandburg; ohne Sonne und Glace)", box: "0 0 100 100",
      svg: `<rect x="0" y="56" width="100" height="18" fill="#8cc8ee"/><path d="M0 60 Q10 57 20 60 T40 60 T60 60 T80 60 T100 60" stroke="#ffffff" stroke-width="2" fill="none"/>`
        + `<path d="M0 72 Q25 66 50 71 Q75 76 100 70 V100 H0 Z" fill="#f2d48f"/>`
        + `<path d="M40 24 L46 94" stroke="#8a6a3f" stroke-width="3.5" stroke-linecap="round"/>`
        + `<path d="M10 36 Q40 0 72 34 Z" fill="#e2483d"/><path d="M41 18 Q30 22 24 35 L36 35 Z M41 18 Q52 22 58 34 L48 34 Z" fill="#ffffff"/>`
        + `<path d="M10 36 Q16 40 22 36 Q28 40 34 36 Q40 40 46 36 Q52 40 58 36 Q65 40 72 34" fill="none" stroke="#b8322a" stroke-width="1.6"/>`
        + `<rect x="12" y="84" width="24" height="9" rx="1.5" transform="rotate(-6 24 88)" fill="#4d93dc"/><rect x="18" y="84" width="5" height="9" transform="rotate(-6 24 88)" fill="#ffffff"/>`
        + `<rect x="68" y="72" width="24" height="16" fill="#e6c477" stroke="#b8934a" stroke-width="1.6"/>`
        + `<path d="M66 72 V62 h3 v3 h3 v-3 h3 V72 Z M85 72 V62 h3 v3 h3 v-3 h3 V72 Z" fill="#e6c477" stroke="#b8934a" stroke-width="1.6"/>`
        + `<path d="M77 82 a3 3 0 0 1 6 0 V88 h-6 Z" fill="#b8934a"/><path d="M80 72 V52" stroke="#6b4a2b" stroke-width="1.6"/><path d="M80 52 L90 55.5 L80 59 Z" fill="#e2483d"/>` },

    // ---------- Materialproben (schwimmt-sinkt, Körbe; BI1 a) ----------
    // Der Stoff selbst als Probe, kein Gegenstand — sonst gliche der Korb einer Karte (Holzklotz 🪵 → Korb 🪵 Holz)
    stoffHolz: { name: "Holz (Brett mit Maserung)", box: "4 18 92 64",
      svg: `<rect x="8" y="22" width="84" height="56" rx="4" fill="#c58b52" stroke="#7a4f26" stroke-width="3"/>`
        + `<path d="M8 36 Q30 30 50 37 T92 34 M8 52 Q28 46 46 53 Q60 58 92 50 M8 66 Q34 60 58 67 T92 64" fill="none" stroke="#8d5a2b" stroke-width="2.4"/>`
        + `<ellipse cx="62" cy="46" rx="7" ry="4" fill="none" stroke="#8d5a2b" stroke-width="2.4"/>` },
    stoffMetall: { name: "Metall (glänzende Platte mit Nieten)", box: "4 18 92 64",
      svg: `<rect x="8" y="22" width="84" height="56" rx="4" fill="#7f8794" stroke="#4a505b" stroke-width="3"/>`
        + `<path d="M20 70 L52 30 L64 30 L32 70 Z" fill="#e4e8ee"/><path d="M42 70 L74 30 L80 30 L48 70 Z" fill="#d3d8e0"/>`
        + [[16, 30], [84, 30], [16, 70], [84, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#5f6673"/>`).join("") },
    stoffGlas: { name: "Glas (durchsichtige Scheibe, ein Ball dahinter ist zu sehen)", box: "4 18 92 64",
      svg: `<circle cx="62" cy="52" r="16" fill="#e2483d"/><rect x="8" y="22" width="84" height="56" rx="4" fill="#d9f0fb" fill-opacity="0.45" stroke="#6fa8c8" stroke-width="3"/>`
        + `<path d="M22 66 L44 34 M32 66 L54 34" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>`
        + `<path d="M66 64 L80 44" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>` },
    stoffKunststoff: { name: "Kunststoff (bunte Plastikkügelchen)", box: "4 12 92 64",
      svg: [[24, 40, "#e2483d"], [44, 32, "#4d93dc"], [64, 40, "#f2c12e"], [80, 30, "#6aa84f"], [30, 62, "#6aa84f"], [52, 56, "#e0569a"],
        [72, 62, "#4d93dc"], [16, 24, "#f2c12e"], [86, 54, "#e2483d"]]
        .map(([x, y, f]) => `<circle cx="${x}" cy="${y}" r="9" fill="${f}" stroke="#3a3d4a" stroke-width="1.5"/><circle cx="${x - 3}" cy="${y - 3}" r="2.5" fill="#ffffff" fill-opacity="0.8"/>`).join("") },
    stoffPapier: { name: "Papier (Stapel Blätter)", box: "4 14 92 72",
      svg: `<rect x="16" y="34" width="70" height="46" fill="#e8e3d8" stroke="#9a9488" stroke-width="2" transform="rotate(-6 51 57)"/>`
        + `<rect x="14" y="26" width="70" height="46" fill="#f4f0e6" stroke="#9a9488" stroke-width="2" transform="rotate(4 49 49)"/>`
        + `<rect x="12" y="20" width="72" height="48" fill="#ffffff" stroke="#9a9488" stroke-width="2.4"/>` },

    // Korb „Altes Ägypten“ (kulturen-koffer, BI1 a): das Lebenszeichen Anch statt der Pyramiden einer Karte
    anch: { name: "Anch, ägyptisches Zeichen für Leben", box: "0 0 100 100",
      svg: `<ellipse cx="50" cy="28" rx="14" ry="18" fill="none" stroke="#d6a52a" stroke-width="9"/>`
        + `<path d="M22 50 H78 M50 46 V94" stroke="#d6a52a" stroke-width="10" stroke-linecap="round"/>`
        + `<path d="M22 50 H78 M50 46 V94" stroke="#a87b12" stroke-width="2" stroke-linecap="round" fill="none" transform="translate(2 2)" opacity="0.4"/>` },

    // ---------- Wasserkreislauf (wassertropfen-reise, Entscheid WT1 a) ----------
    // Wasserdampf ist unsichtbar: aufsteigende, gestrichelte Pfeile über dem Wasser, keine Wolke und kein Dampf
    wasserdampf: { name: "Wasserdampf steigt unsichtbar auf (gestrichelte Pfeile über dem Wasser)", box: "0 0 100 100",
      svg: WASSER
        + [22, 50, 78].map((x, i) => `<path d="M${x} ${76 - i % 2 * 6} V${22 + i % 2 * 6}" stroke="#6f9fc8" stroke-width="4" stroke-dasharray="7 6" stroke-linecap="round"/>`
          + `<path d="M${x - 9} ${32 + i % 2 * 6} L${x} ${20 + i % 2 * 6} L${x + 9} ${32 + i % 2 * 6}" fill="none" stroke="#6f9fc8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`).join("") },
  };
})();
