// Motive für die Lücken im Kachelraster (Entscheid LU1 a mit Zusatz und Nachtrag, docs/eulenpfad/konzept_gestaltung.md,
// LERN_Session34). Im Stil „hand“ bleibt ab und zu eine Zelle frei (STIL.luecke); dort steht eine kleine Zeichnung passend
// zum Fach, ohne Text und nicht antippbar. Je Fach zwei bis vier Motive, der Reihe nach über die Lücken des Fachs verteilt
// (die erste Lücke das erste Motiv …), damit jedes vorkommt — bei jedem Laden gleich, solange die Spiele gleich bleiben.
//
// Einige Motive ziehen die Nachbarkacheln derselben Zeile leicht in Mitleidenschaft (wirkung, start/start.css .luecke-nb):
// sog (schwarzes Loch als Ring: zu sich hin gedreht und kleiner), zieht (schwarzes Loch als Scheibe: die Mitte der Kante
// einer Nachbarkachel wird zum Schlauch ins Loch, STIL.schlauch), heben (Maulwurf: schief angehoben), ecke (Elster,
// Radiergummi: eine Ecke fehlt), loch (Bücherwurm: kleines Loch).
//
// Jedes Motiv bewegt sich dezent (Klassen lu-* in start/start.css, ruhig bei „weniger Bewegung“ des Geräts), die Wirkung
// auf die Kacheln ebenso. Die Zeichnung liegt auf einem hellen Fleck mit weichem Rand (--k-bildgrund, DM3 a), Linien in
// --k-bildtext; die schwarzen Löcher auf einem dunklen Grund, der fein in den Hintergrund ausläuft. viewBox 0 0 200 200.
// Bildfarben: feste Töne der Zeichnungen, in beiden Modi gleich (DM3 a).
"use strict";

const LUECKEN = (() => {
  const T = "var(--k-bildtext)";
  const fleck = '<path d="M38 52 C60 18 140 16 166 46 C192 78 186 146 156 170 C122 196 62 190 36 160 C12 132 18 82 38 52 Z" fill="var(--k-bildgrund)" filter="url(#lid-rand)"/>';
  const randFilter = '<filter id="lid-rand" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.5"/></filter>';
  const svg = (inhalt, mitFleck = true) =>
    `<svg viewBox="0 0 200 200" class="luecke-motiv" aria-hidden="true">${mitFleck ? `<defs>${randFilter}</defs>${fleck}` : ""}${inhalt}</svg>`;

  // Dunkler Grund der schwarzen Löcher: läuft in vielen Stufen fein aus, damit er wirkt, als gehöre er hierher
  const weltraum = id => `<radialGradient id="${id}">
      <stop offset="0" stop-color="#06070d" stop-opacity=".97"/><stop offset=".3" stop-color="#06070d" stop-opacity=".9"/>
      <stop offset=".5" stop-color="#06070d" stop-opacity=".66"/><stop offset=".66" stop-color="#06070d" stop-opacity=".38"/>
      <stop offset=".8" stop-color="#06070d" stop-opacity=".16"/><stop offset=".92" stop-color="#06070d" stop-opacity=".05"/>
      <stop offset="1" stop-color="#06070d" stop-opacity="0"/></radialGradient>`;
  // Wenige, blasse Sterne nahe der Mitte, die nach aussen verschwinden; einige funkeln langsam
  const sterne = `<g fill="#fff">
      <circle cx="62" cy="70" r="1" opacity=".55" class="lu-funkel"/><circle cx="142" cy="62" r=".8" opacity=".45"/>
      <circle cx="136" cy="136" r="1" opacity=".5" class="lu-funkel" style="animation-delay:-2.2s"/>
      <circle cx="70" cy="132" r=".7" opacity=".4"/><circle cx="112" cy="50" r=".7" opacity=".35" class="lu-funkel" style="animation-delay:-1.1s"/>
      <circle cx="44" cy="102" r=".6" opacity=".25"/><circle cx="158" cy="104" r=".6" opacity=".25"/></g>`;

  const MOTIVE = {
    // ---------- Mathe ----------
    // Zwei schwarze Löcher, möglichst wie echte Bilder (Wunsch Patrik, LERN_Session34): der Ring wie die erste Aufnahme
    // eines schwarzen Lochs (heller Ring, unten heller, dunkler Schatten in der Mitte), die Scheibe wie in Filmen (flache
    // leuchtende Scheibe vor dem Schatten, darüber und darunter ihr gekrümmtes Bild). Je eigene Wirkung.
    "schwarzes-loch-ring": { wirkung: "sog", svg: svg(`
      <defs>${weltraum("lid-all-a")}
        <radialGradient id="lid-ring"><stop offset="0" stop-color="#000"/><stop offset=".38" stop-color="#000"/><stop offset=".5" stop-color="#7a2400"/>
          <stop offset=".62" stop-color="#ff8c1a"/><stop offset=".7" stop-color="#ffc35a"><animate attributeName="stop-color" dur="5s" values="#ffc35a;#ffe39a;#ffb040;#ffc35a" repeatCount="indefinite"/></stop><stop offset=".8" stop-color="#d9580a"/><stop offset=".92" stop-color="#3d0f00"/><stop offset="1" stop-color="#3d0f00" stop-opacity="0"/></radialGradient>
        <filter id="lid-weich" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="lid-weich-fein" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
        <filter id="lid-wabern-a" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="3"><animate attributeName="baseFrequency" dur="11s" values="0.018;0.03;0.018" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="7"/></filter>
      </defs>
      <circle cx="100" cy="100" r="99" fill="url(#lid-all-a)"/>${sterne}
      <g filter="url(#lid-wabern-a)"><g class="lu-dreht-langsam">
        <circle cx="100" cy="100" r="62" fill="url(#lid-ring)" filter="url(#lid-weich)" class="lu-gluet"/>
        <path d="M58 118 A46 46 0 0 0 142 118" fill="none" stroke="#ffe7a8" stroke-width="9" stroke-linecap="round" filter="url(#lid-weich)" opacity=".9"/>
        <path d="M70 76 A38 38 0 0 1 112 62" fill="none" stroke="#ff9a30" stroke-width="5" stroke-linecap="round" filter="url(#lid-weich-fein)" opacity=".6"/>
      </g></g>
      <circle cx="100" cy="100" r="24" fill="#000" filter="url(#lid-weich-fein)"/>`, false) },
    "schwarzes-loch-scheibe": { wirkung: "zieht", svg: svg(`
      <defs>${weltraum("lid-all-b")}
        <linearGradient id="lid-scheibe" x1="0" x2="1"><animateTransform attributeName="gradientTransform" type="translate" values="-0.12 0;0.12 0;-0.12 0" dur="7s" repeatCount="indefinite"/><stop offset="0" stop-color="#ff7a1a" stop-opacity="0"/><stop offset=".18" stop-color="#ff8a2a"/>
          <stop offset=".42" stop-color="#ffd9a0"/><stop offset=".5" stop-color="#fff6e0"/><stop offset=".58" stop-color="#ffd9a0"/><stop offset=".82" stop-color="#ff8a2a"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></linearGradient>
        <filter id="lid-glut" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
        <filter id="lid-glut-fein" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.2"/></filter>
        <filter id="lid-wabern-b" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7"><animate attributeName="baseFrequency" dur="13s" values="0.018;0.03;0.018" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="7"/></filter>
      </defs>
      <circle cx="100" cy="100" r="99" fill="url(#lid-all-b)"/>${sterne}
      <g filter="url(#lid-wabern-b)"><g class="lu-gluet">
        <path d="M52 100 C52 52 148 52 148 100" fill="none" stroke="#ffb35a" stroke-width="12" filter="url(#lid-glut)" opacity=".85"/>
        <path d="M58 100 C58 60 142 60 142 100" fill="none" stroke="#fff0d0" stroke-width="3" filter="url(#lid-glut-fein)"/>
        <path d="M66 104 C70 128 130 128 134 104" fill="none" stroke="#ffb35a" stroke-width="5" filter="url(#lid-glut)" opacity=".7"/>
      </g></g>
      <circle cx="100" cy="100" r="31" fill="#000"/>
      <circle cx="100" cy="100" r="32" fill="none" stroke="#ffe7c0" stroke-width="1.3" opacity=".9"/>
      <g class="lu-flimmer"><g class="lu-kippt">
        <ellipse cx="100" cy="102" rx="96" ry="8" fill="url(#lid-scheibe)" filter="url(#lid-glut)"/>
        <ellipse cx="100" cy="102" rx="90" ry="3.2" fill="url(#lid-scheibe)" filter="url(#lid-glut-fein)"/>
      </g></g>`, false) },
    "ziffern-loch": { wirkung: null, svg: svg(`
      <ellipse cx="100" cy="148" rx="56" ry="16" fill="#3a3324"/>
      <ellipse cx="100" cy="144" rx="56" ry="12" fill="#10132a"/>
      <g class="lu-sinkt"><text x="86" y="150" font-size="56" font-weight="900" fill="#d93a40" transform="rotate(14 100 130)">5</text></g>
      <rect x="40" y="148" width="120" height="30" fill="var(--k-bildgrund)"/>
      <ellipse cx="100" cy="148" rx="56" ry="10" fill="none" stroke="#3a3324" stroke-width="4"/>
      <g class="lu-wippe"><text x="58" y="70" font-size="34" font-weight="900" fill="#1f74c0" transform="rotate(-20 70 60)">2</text></g>
      <path d="M78 40 q6 -10 12 0 M120 52 q6 -10 12 0" fill="none" stroke="${T}" stroke-width="3" stroke-linecap="round" opacity=".5" class="lu-blink"/>`) },
    "radiergummi": { wirkung: "ecke", svg: svg(`
      <g class="lu-reibe"><g transform="rotate(-24 100 100)">
        <rect x="52" y="78" width="96" height="44" rx="8" fill="#ef77b0"/>
        <rect x="52" y="78" width="38" height="44" rx="8" fill="#4ea6f0"/>
        <rect x="52" y="78" width="96" height="44" rx="8" fill="none" stroke="${T}" stroke-width="4"/>
      </g></g>
      <g fill="#ef77b0" stroke="${T}" stroke-width="2"><circle cx="150" cy="150" r="5" class="lu-hoch"/><circle cx="134" cy="164" r="4"/>
        <circle cx="160" cy="132" r="3.5" class="lu-hoch" style="animation-delay:-1.4s"/><circle cx="118" cy="156" r="3"/></g>`) },
    // ---------- Deutsch ----------
    "buecherwurm": { wirkung: "loch", svg: svg(`
      <rect x="44" y="104" width="112" height="56" rx="6" fill="#b65e20" stroke="${T}" stroke-width="4"/>
      <path d="M50 112 H150" stroke="#f6f1e7" stroke-width="6"/>
      <circle cx="122" cy="122" r="14" fill="#10132a"/>
      <g class="lu-wurm">
        <path d="M122 122 C122 96 102 86 92 70 C84 56 96 44 108 50" fill="none" stroke="#2fb36b" stroke-width="16" stroke-linecap="round"/>
        <circle cx="104" cy="46" r="13" fill="#2fb36b" stroke="${T}" stroke-width="3"/>
        <circle cx="100" cy="43" r="3" fill="${T}"/><circle cx="110" cy="43" r="3" fill="${T}"/>
        <circle cx="98" cy="43" r="7" fill="none" stroke="${T}" stroke-width="2"/><circle cx="111" cy="43" r="7" fill="none" stroke="${T}" stroke-width="2"/>
      </g>`) },
    "tintenklecks": { wirkung: null, svg: svg(`
      <g class="lu-puls"><path d="M100 70 C120 60 150 76 146 100 C162 106 160 128 142 130 C144 152 118 160 104 146 C90 162 62 150 66 130 C46 126 48 100 66 98 C62 76 84 62 100 70 Z" fill="#1f3f8a"/></g>
      <circle cx="160" cy="80" r="7" fill="#1f3f8a"/><circle cx="44" cy="150" r="6" fill="#1f3f8a"/><circle cx="150" cy="162" r="4" fill="#1f3f8a"/>
      <g class="lu-tupft"><g transform="rotate(35 60 60)"><rect x="54" y="18" width="14" height="56" rx="5" fill="#8e5bd6" stroke="${T}" stroke-width="3"/>
        <path d="M54 74 L61 96 L68 74 Z" fill="#c9cbd8" stroke="${T}" stroke-width="3" stroke-linejoin="round"/></g></g>`) },
    "buchstaben-purzeln": { wirkung: null, svg: svg(`
      <g class="lu-wippe"><text x="44" y="96" font-size="48" font-weight="900" fill="#d93a40" transform="rotate(-24 60 80)">A</text></g>
      <g class="lu-wippe" style="animation-delay:-1.3s"><text x="96" y="132" font-size="44" font-weight="900" fill="#1f74c0" transform="rotate(32 110 120)">b</text></g>
      <g class="lu-wippe" style="animation-delay:-2.1s"><text x="120" y="80" font-size="40" font-weight="900" fill="#157f45" transform="rotate(-10 130 70)">C</text></g>
      <g class="lu-wippe" style="animation-delay:-.6s"><text x="66" y="166" font-size="34" font-weight="900" fill="#8e5bd6" transform="rotate(70 76 156)">d</text></g>
      <path d="M150 120 q10 8 4 20 M40 130 q-8 8 0 18" fill="none" stroke="${T}" stroke-width="3" stroke-linecap="round" opacity=".5"/>`) },
    // ---------- NMG ----------
    "elster": { wirkung: "ecke", svg: svg(`
      <g class="lu-nickt">
        <path d="M58 120 C50 92 72 70 100 72 C128 74 140 96 132 118 C126 136 92 142 76 136 Z" fill="#1b1d2b"/>
        <path d="M72 116 C80 100 104 98 118 110 C110 128 86 132 72 116 Z" fill="#f6f1e7"/>
        <path d="M60 120 L18 150 L28 156 L66 132 Z" fill="#2b3f8a"/>
        <circle cx="128" cy="76" r="18" fill="#1b1d2b"/><circle cx="134" cy="72" r="4" fill="#f6f1e7"/><circle cx="135" cy="72" r="2" fill="#10132a"/>
        <path d="M144 78 L170 84 L144 88 Z" fill="#c98400"/>
        <path d="M160 70 L196 76 L188 104 L166 96 Z" fill="#8587f5" stroke="${T}" stroke-width="3" stroke-linejoin="round"/>
      </g>
      <path d="M96 140 L92 160 M110 140 L112 160" stroke="#1b1d2b" stroke-width="4" stroke-linecap="round"/>`) },
    "maulwurf": { wirkung: "heben", svg: svg(`
      <g class="lu-guckt">
        <ellipse cx="100" cy="96" rx="30" ry="24" fill="#3a3340"/>
        <ellipse cx="100" cy="106" rx="12" ry="8" fill="#ef77b0"/>
        <path d="M84 90 q6 -5 12 0 M104 90 q6 -5 12 0" fill="none" stroke="#f6f1e7" stroke-width="3" stroke-linecap="round"/>
        <path d="M70 116 q-12 -2 -16 8 M130 116 q12 -2 16 8" fill="none" stroke="#ef77b0" stroke-width="7" stroke-linecap="round"/>
      </g>
      <path d="M30 168 C46 122 70 112 78 114 C90 118 110 118 122 114 C132 112 156 124 170 168 Z" fill="#7a5230"/>
      <g fill="#5a3b20"><circle cx="70" cy="146" r="5"/><circle cx="130" cy="152" r="6"/><circle cx="104" cy="134" r="4"/></g>`) },
    "schnecke": { wirkung: null, svg: svg(`
      <g class="lu-kriecht">
        <path d="M36 150 C60 150 140 152 168 148 C176 146 178 136 168 134 L150 134" fill="#e0b46a" stroke="${T}" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="104" cy="108" r="38" fill="#b65e20" stroke="${T}" stroke-width="4"/>
        <path d="M104 108 m0 -24 a24 24 0 1 1 -22 14 a14 14 0 1 1 14 -6" fill="none" stroke="#f6f1e7" stroke-width="5" stroke-linecap="round"/>
        <g class="lu-wippe"><path d="M156 134 L162 104 M168 134 L178 108" stroke="${T}" stroke-width="3" stroke-linecap="round"/>
          <circle cx="162" cy="102" r="4" fill="${T}"/><circle cx="178" cy="106" r="4" fill="${T}"/></g>
      </g>`) },
    // ---------- Englisch, Französisch ----------
    "koffer": { wirkung: null, svg: svg(`
      <g class="lu-schwebt">
        <g class="lu-fluegel"><path d="M70 92 C40 70 30 92 22 80 C36 110 58 104 70 106 Z" fill="#f6f1e7" stroke="${T}" stroke-width="3"/></g>
        <g class="lu-fluegel lu-fluegel-r"><path d="M130 92 C160 70 170 92 178 80 C164 110 142 104 130 106 Z" fill="#f6f1e7" stroke="${T}" stroke-width="3"/></g>
        <rect x="64" y="82" width="72" height="56" rx="8" fill="#c24a85" stroke="${T}" stroke-width="4"/>
        <path d="M88 82 V72 H112 V82" fill="none" stroke="${T}" stroke-width="4"/>
        <path d="M64 108 H136" stroke="#f0c63a" stroke-width="5"/>
      </g>
      <path d="M70 160 q30 -12 60 0" fill="none" stroke="${T}" stroke-width="3" stroke-dasharray="6 8" stroke-linecap="round" opacity=".5"/>`) },
    "papierflieger": { wirkung: null, svg: svg(`
      <path d="M30 150 C70 160 90 120 110 112" fill="none" stroke="${T}" stroke-width="3" stroke-dasharray="6 8" stroke-linecap="round" opacity=".55" class="lu-spur"/>
      <g class="lu-schwebt"><path d="M108 112 L172 62 L132 136 L124 116 Z" fill="#4ea6f0" stroke="${T}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M124 116 L172 62" stroke="${T}" stroke-width="3"/></g>`) },
    // ---------- Musik ----------
    "pause": { wirkung: null, svg: svg(`
      <g stroke="${T}" stroke-width="2.5" opacity=".45"><path d="M28 70 H172 M28 86 H172 M28 102 H172 M28 118 H172 M28 134 H172"/></g>
      <path d="M86 62 L104 82 L90 98 L106 118 C92 112 82 120 94 136 C72 126 76 106 92 108 L80 92 L94 80 Z" fill="${T}"/>
      <rect x="128" y="102" width="22" height="9" fill="${T}"/>
      <g class="lu-atmet"><path d="M60 46 q40 -26 80 0" fill="none" stroke="${T}" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="42" r="5" fill="${T}"/></g>`) },
    "noten-schlafen": { wirkung: null, svg: svg(`
      <g class="lu-atmet">
        <ellipse cx="76" cy="136" rx="20" ry="14" fill="#8e5bd6" transform="rotate(-20 76 136)"/>
        <path d="M94 130 V64 C110 70 120 80 118 96" fill="none" stroke="${T}" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="136" cy="150" rx="18" ry="12" fill="#0e8578" transform="rotate(-20 136 150)"/>
        <path d="M152 144 V90" stroke="${T}" stroke-width="5" stroke-linecap="round"/>
        <path d="M64 132 q5 3 10 0 M128 148 q5 3 10 0" fill="none" stroke="#f6f1e7" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g fill="none" stroke="${T}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
        <path d="M150 50 h14 l-14 16 h14" class="lu-steigt"/><path d="M168 30 h10 l-10 12 h10" class="lu-steigt" style="animation-delay:-1.6s"/></g>`) },
    // ---------- Medien und Informatik ----------
    "pixel-loch": { wirkung: null, svg: svg(`
      <g fill="#10132a"><rect x="76" y="76" width="16" height="16"/><rect x="92" y="76" width="16" height="16"/><rect x="108" y="92" width="16" height="16"/>
        <rect x="76" y="92" width="16" height="16"/><rect x="92" y="92" width="16" height="16"/><rect x="92" y="108" width="16" height="16"/><rect x="76" y="108" width="16" height="16"/></g>
      <g fill="#8587f5"><rect x="128" y="64" width="12" height="12" class="lu-driftet"/><rect x="150" y="48" width="9" height="9" class="lu-driftet" style="animation-delay:-1.2s"/>
        <rect x="56" y="132" width="10" height="10" class="lu-driftet lu-links" style="animation-delay:-2s"/></g>
      <g fill="#2cc9b6"><rect x="140" y="128" width="12" height="12" class="lu-driftet" style="animation-delay:-.7s"/><rect x="44" y="60" width="9" height="9" class="lu-driftet lu-links" style="animation-delay:-2.6s"/></g>
      <g fill="#ef77b0"><rect x="162" y="100" width="8" height="8" class="lu-driftet" style="animation-delay:-1.8s"/><rect x="64" y="40" width="7" height="7" class="lu-driftet lu-links"/></g>`) },
    "stecker": { wirkung: null, svg: svg(`
      <path d="M20 150 C60 150 60 110 82 108" fill="none" stroke="${T}" stroke-width="6" stroke-linecap="round"/>
      <g class="lu-zuckt"><rect x="80" y="94" width="30" height="28" rx="5" fill="#64748b" stroke="${T}" stroke-width="3"/>
        <path d="M110 100 H124 M110 116 H124" stroke="${T}" stroke-width="5" stroke-linecap="round"/></g>
      <rect x="146" y="80" width="36" height="56" rx="8" fill="#f6f1e7" stroke="${T}" stroke-width="4"/>
      <path d="M160 98 V104 M168 98 V104 M160 112 V118 M168 112 V118" stroke="${T}" stroke-width="4" stroke-linecap="round"/>
      <path d="M130 70 l6 10 l-8 2 l8 12" fill="none" stroke="#f0a020" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" class="lu-blink"/>`) },
  };

  const JE_FACH = {
    "Mathe": ["schwarzes-loch-ring", "schwarzes-loch-scheibe", "ziffern-loch", "radiergummi"],
    "Deutsch": ["buecherwurm", "tintenklecks", "buchstaben-purzeln"],
    "NMG": ["elster", "maulwurf", "schnecke"],
    "Englisch": ["koffer", "papierflieger"],
    "Französisch": ["koffer", "papierflieger"],
    "Musik": ["pause", "noten-schlafen"],
    "Medien und Informatik": ["pixel-loch", "stecker"],
  };
  const ALLE = Object.keys(MOTIVE);

  let laufend = 0;
  /**
   * Motiv für die nr-te Lücke (ab 0) im Fach fach: { id, wirkung, svg }. Die Kennungen im SVG (lid-…, Verläufe und
   * Filter) bekommen je Lücke eine eigene Endung: läge die erste Lücke mit derselben Kennung in einem zugeklappten Block,
   * zeichnete der Browser die Verläufe der anderen nicht.
   */
  function waehle(fach, nr) {
    const liste = JE_FACH[fach] || ALLE;
    const name = liste[nr % liste.length], n = ++laufend;
    const ruhig = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    let bild = MOTIVE[name].svg.replace(/lid-([\w-]+)/g, `lid-$1-${n}`);
    if (ruhig) bild = bild.replace(/<animate(Transform)?\b[^>]*\/>/g, ""); // bei „weniger Bewegung“ auch SMIL weglassen
    return { id: name, wirkung: MOTIVE[name].wirkung, svg: bild };
  }

  return { MOTIVE, JE_FACH, waehle };
})();
