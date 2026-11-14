/* Sudoku-Familie (LERN-56; Entscheide SU1 a–SU3 a, LERN_Session13; gebaut ab LERN_Session40). Gemeinsamer Baustein für
   Bilder-, Zahlen-, Gebiets-, Vergleichs- und Käfig-Sudoku und das Sudoku-Duell: Raster mit beliebigen Gebieten, Löser,
   Generator und die Bedienung im Spiel. Beschreibung in docs/eulenpfad/rahmen.md, Abschnitt 26.

   Raster: n × n Felder, Zahlen 1 … n, Feld i = Zeile · n + Spalte. Jede Zahl steht in jeder Einheit (Zeile, Spalte,
   Gebiet) genau einmal. Gebiete sind beim gewöhnlichen Sudoku Kästen (2 × 2, 2 × 3, 3 × 3), beim Gebiets-Sudoku
   unregelmässig — für den Löser ist das dasselbe.

   Werte: Array der Länge n², 0 = leer. Kandidaten als Bitmaske, Zahl v ↔ Bit 1 << (v − 1).

   Schwierigkeit (SU3 a, „💡 zeigt ein Feld, in das nur eine Zahl passt“): Der Generator stellt nur Rätsel, die sich mit
   den erlaubten Schritten des menschlichen Lösers ganz lösen lassen — „einer“ (in dieses Feld passt nur noch eine Zahl)
   und „versteckt“ (diese Zahl passt in der Einheit nur noch an einen Platz). Ein so lösbares Rätsel hat genau eine
   Lösung, denn jeder Schritt folgt zwingend aus den Vorgaben; pruefeAufgabe zählt die Lösungen trotzdem unabhängig mit
   dem Löser durch Probieren nach. */
"use strict";

const SUDOKU = (() => {
  const bits = n => (1 << n) - 1;
  const zaehleBits = m => { let k = 0; while (m) { m &= m - 1; k++; } return k; };
  const einzigeZahl = m => 31 - Math.clz32(m) + 1; // nur für Masken mit genau einem Bit

  /** Gebiete als Kästen kh × kb (Höhe × Breite): je Feld die Nummer seines Kastens. */
  function kaesten(n, kh, kb) {
    if ((n % kh) || (n % kb) || kh * kb !== n) throw new Error(`Kästen ${kh} × ${kb} passen nicht zu ${n} × ${n}`);
    return Array.from({ length: n * n }, (_, i) => Math.floor(Math.floor(i / n) / kh) * (n / kb) + Math.floor((i % n) / kb));
  }

  /** Felder rechts, links, unten, oben von i im n × n. */
  const nachbarnVon = (n, i) => {
    const z = Math.floor(i / n), s = i % n, aus = [];
    if (s + 1 < n) aus.push(i + 1); if (s > 0) aus.push(i - 1); if (z + 1 < n) aus.push(i + n); if (z > 0) aus.push(i - n);
    return aus;
  };
  /** Hängen die Felder des Gebiets g über Kanten zusammen? */
  function zusammenhaengend(n, gebiete, g) {
    const felder = gebiete.map((x, i) => (x === g ? i : -1)).filter(i => i >= 0);
    if (!felder.length) return false;
    const gesehen = new Set([felder[0]]), offen = [felder[0]];
    while (offen.length) for (const k of nachbarnVon(n, offen.pop())) if (gebiete[k] === g && !gesehen.has(k)) { gesehen.add(k); offen.push(k); }
    return gesehen.size === felder.length;
  }
  /** Ist das Gebiet ein volles Rechteck (Kasten, Zeile, Spalte)? */
  function rechteck(n, gebiete, g) {
    const felder = gebiete.map((x, i) => (x === g ? i : -1)).filter(i => i >= 0);
    const z = felder.map(i => Math.floor(i / n)), s = felder.map(i => i % n);
    return (Math.max(...z) - Math.min(...z) + 1) * (Math.max(...s) - Math.min(...s) + 1) === felder.length;
  }
  /**
   * Mängel einer Einteilung in Gebiete (Gebiets-Sudoku): n Gebiete zu je n Feldern, jedes zusammenhängend und keins ein
   * Rechteck — sonst wäre es ein Kasten, eine Zeile oder eine Spalte (Zusatz Patrik zu SU1 a: „nicht als Quadrate“).
   */
  function gebieteMaengel(n, gebiete) {
    const m = [];
    if (gebiete.length !== n * n) return ["Gebiete passen nicht zum Raster"];
    const ids = [...new Set(gebiete)];
    if (ids.length !== n) m.push(`${ids.length} Gebiete statt ${n}`);
    for (const g of ids) {
      const k = gebiete.filter(x => x === g).length;
      if (k !== n) m.push(`Gebiet ${g} hat ${k} statt ${n} Felder`);
      else if (!zusammenhaengend(n, gebiete, g)) m.push(`Gebiet ${g} hängt nicht zusammen`);
      else if (rechteck(n, gebiete, g)) m.push(`Gebiet ${g} ist ein Rechteck`);
    }
    return m;
  }
  /**
   * Kästen, mit denen ein Gebiets-Sudoku beginnt (4, 6, 8, 9); bei 5 und 7 gibt es keine, dort sind es die Zeilen.
   */
  const startGebiete = n => {
    const k = { 4: [2, 2], 6: [2, 3], 8: [2, 4], 9: [3, 3] }[n];
    return k ? kaesten(n, ...k) : Array.from({ length: n * n }, (_, i) => Math.floor(i / n));
  };
  /**
   * Zufällige unregelmässige Gebiete zu einer vollen Lösung, die zu startGebiete(n) passt: viele Male ein Randfeld von A
   * an das Nachbargebiet B geben und dafür das Feld von B mit derselben Zahl an A, wenn es an A grenzt und beide danach
   * noch zusammenhängen. So behält jedes Gebiet jede Zahl genau einmal, und die Lösung bleibt gültig — ohne Suche. (Zuerst
   * die Gebiete und dann eine Lösung dazu zu suchen, gelang beim 9 × 9 nur bei einem Teil der Einteilungen, LERN_Session40.)
   * Zwei benachbarte Felder direkt zu tauschen ginge nie: jedes verlöre damit seinen Anschluss. Am Ende ist kein Gebiet
   * ein Rechteck. → Array oder null. zufall() in [0, 1).
   */
  function gebieteZufall(n, loesung, zufall, { tausche = 10 * n * n, versuche = 40 } = {}) {
    for (let v = 0; v < versuche; v++) {
      const g = startGebiete(n);
      for (let t = 0; t < tausche; t++) {
        const a = Math.floor(zufall() * n * n);
        const fremd = nachbarnVon(n, a).filter(k => g[k] !== g[a]);
        if (!fremd.length) continue;
        const ga = g[a], gb = g[fremd[Math.floor(zufall() * fremd.length)]];
        // das Feld von B mit derselben Zahl, wenn es an A grenzt (nicht über a allein)
        const c = g.findIndex((x, i) => x === gb && loesung[i] === loesung[a]);
        if (c < 0 || !nachbarnVon(n, c).some(k => k !== a && g[k] === ga)) continue;
        g[a] = gb; g[c] = ga;
        if (!zusammenhaengend(n, g, ga) || !zusammenhaengend(n, g, gb)) { g[a] = ga; g[c] = gb; }
      }
      if (!gebieteMaengel(n, g).length) return g;
    }
    return null;
  }

  /**
   * Raster aus Grösse und Gebieten. → { n, gebiete, einheiten: [{ art, felder }], vonFeld: [[Einheit …]], voll }
   * art: "zeile", "spalte", "kasten" oder "gebiet" (für die Sätze der Eule).
   */
  function raster(n, gebiete, gebietArt = "kasten", vergleiche = []) {
    if (gebiete.length !== n * n) throw new Error("Gebiete passen nicht zum Raster");
    const einheiten = [];
    for (let r = 0; r < n; r++) einheiten.push({ art: "zeile", felder: Array.from({ length: n }, (_, c) => r * n + c) });
    for (let c = 0; c < n; c++) einheiten.push({ art: "spalte", felder: Array.from({ length: n }, (_, r) => r * n + c) });
    const ids = [...new Set(gebiete)];
    if (ids.length !== n) throw new Error(`${ids.length} Gebiete statt ${n}`);
    for (const g of ids) {
      const felder = gebiete.map((x, i) => (x === g ? i : -1)).filter(i => i >= 0);
      if (felder.length !== n) throw new Error(`Gebiet ${g} hat ${felder.length} statt ${n} Felder`);
      einheiten.push({ art: gebietArt, felder });
    }
    const vonFeld = Array.from({ length: n * n }, () => []);
    einheiten.forEach((e, u) => e.felder.forEach(i => vonFeld[i].push(u)));
    // Vergleichs-Sudoku: [klein, gross] je Zeichen zwischen zwei Nachbarfeldern (Wert klein < Wert gross)
    const kleiner = Array.from({ length: n * n }, () => []), groesser = Array.from({ length: n * n }, () => []);
    for (const [a, b] of vergleiche) { kleiner[a].push(b); groesser[b].push(a); }
    return { n, gebiete, einheiten, vonFeld, voll: bits(n), vergleiche, kleiner, groesser };
  }

  /**
   * Zeichen zwischen allen Nachbarn im selben Gebiet, aus der Lösung: [klein, gross] (wie im üblichen Vergleichs-Sudoku
   * steht an jeder Kante innerhalb eines Kastens ein Zeichen).
   */
  function vergleicheAus(n, gebiete, loesung) {
    const aus = [];
    for (let i = 0; i < n * n; i++) for (const k of [i + 1, i + n]) {
      if ((k === i + 1 && (i % n) === n - 1) || k >= n * n || gebiete[k] !== gebiete[i]) continue;
      aus.push(loesung[i] < loesung[k] ? [i, k] : [k, i]);
    }
    return aus;
  }

  /** Masken je Einheit: welche Zahlen dort schon stehen. */
  const einheitsMasken = (r, werte) => r.einheiten.map(e => e.felder.reduce((m, i) => (werte[i] ? m | (1 << (werte[i] - 1)) : m), 0));
  /** Was die Zeichen zu schon gefüllten Nachbarn erlauben: kleiner als jeder grössere, grösser als jeder kleinere. */
  function vergleichMaske(r, werte, i) {
    let m = r.voll;
    for (const j of r.kleiner[i]) if (werte[j]) m &= (1 << (werte[j] - 1)) - 1;
    for (const j of r.groesser[i]) if (werte[j]) m &= ~((1 << werte[j]) - 1);
    return m;
  }
  /** Kandidaten eines Felds aus den Einheiten; mit werte auch aus den Zeichen zu gefüllten Nachbarn (Vergleichs-Sudoku). */
  const kandidaten = (r, masken, i, werte = null) => {
    const m = r.voll & ~r.vonFeld[i].reduce((x, u) => x | masken[u], 0);
    return werte && r.vergleiche.length ? m & vergleichMaske(r, werte, i) : m;
  };

  /**
   * Widersprüche der Werte: je Einheit doppelte Zahlen → [{ einheit, zahl, felder }]; dazu verletzte Zeichen zwischen
   * zwei gefüllten Feldern → [{ vergleich: [klein, gross], felder }].
   */
  function widersprueche(r, werte) {
    const aus = [];
    r.einheiten.forEach((e, u) => {
      const je = {};
      for (const i of e.felder) if (werte[i]) (je[werte[i]] = je[werte[i]] || []).push(i);
      for (const [z, f] of Object.entries(je)) if (f.length > 1) aus.push({ einheit: u, zahl: Number(z), felder: f });
    });
    for (const [a, b] of r.vergleiche) if (werte[a] && werte[b] && werte[a] >= werte[b]) aus.push({ vergleich: [a, b], felder: [a, b] });
    return aus;
  }

  /**
   * Lösungen durch Probieren zählen, höchstens bis grenze (2 genügt für „genau eine“). Nimmt immer das Feld mit den
   * wenigsten Kandidaten. → Zahl der Lösungen (≤ grenze); mit ziel = [] auch die erste Lösung darin.
   */
  function zaehleLoesungen(r, vorgabe, grenze = 2, ziel = null) {
    const werte = vorgabe.slice();
    const masken = einheitsMasken(r, werte);
    if (widersprueche(r, werte).length) return 0;
    let anzahl = 0;
    const setze = (i, v) => { werte[i] = v; for (const u of r.vonFeld[i]) masken[u] |= 1 << (v - 1); };
    const nimm = (i, v) => { werte[i] = 0; for (const u of r.vonFeld[i]) masken[u] &= ~(1 << (v - 1)); };
    (function suche() {
      let best = -1, bestMaske = 0, bestZahl = 99;
      for (let i = 0; i < werte.length; i++) {
        if (werte[i]) continue;
        const m = kandidaten(r, masken, i, werte), k = zaehleBits(m);
        if (k < bestZahl) { best = i; bestMaske = m; bestZahl = k; if (k <= 1) break; }
      }
      if (best < 0) { anzahl++; if (ziel && anzahl === 1) ziel.push(...werte); return; }
      for (let m = bestMaske; m && anzahl < grenze; m &= m - 1) {
        const v = einzigeZahl(m & -m);
        setze(best, v); suche(); nimm(best, v);
      }
    })();
    return anzahl;
  }

  /**
   * Volles, gültiges Raster in zufälliger Ordnung (für den Generator); mische(liste) mischt. → Werte oder null, wenn es
   * keins gibt oder die Suche mehr als grenze Schritte braucht (nicht jede Einteilung in Gebiete lässt sich füllen).
   */
  function fuelle(r, mische, grenze = Infinity) {
    const leer = Array(r.n * r.n).fill(0);
    const werte = leer.slice(), masken = einheitsMasken(r, werte);
    let schritte = 0;
    const ok = (function suche() {
      if (++schritte > grenze) return false;
      let best = -1, bestMaske = 0, bestZahl = 99;
      for (let i = 0; i < werte.length; i++) {
        if (werte[i]) continue;
        const m = kandidaten(r, masken, i, werte), k = zaehleBits(m);
        if (k < bestZahl) { best = i; bestMaske = m; bestZahl = k; if (k <= 1) break; }
      }
      if (best < 0) return true;
      const zahlen = [];
      for (let m = bestMaske; m; m &= m - 1) zahlen.push(einzigeZahl(m & -m));
      for (const v of mische(zahlen)) {
        werte[best] = v; for (const u of r.vonFeld[best]) masken[u] |= 1 << (v - 1);
        if (suche()) return true;
        werte[best] = 0; for (const u of r.vonFeld[best]) masken[u] &= ~(1 << (v - 1));
        if (schritte > grenze) return false;
      }
      return false;
    })();
    return ok ? werte : null;
  }

  /**
   * Nächster Schritt des menschlichen Lösers: { feld, zahl, art: "einer" | "versteckt", einheit } oder null.
   * techniken: Set aus "einer", "versteckt", dazu im Vergleichs-Sudoku „vergleich“ (ein Zeichen zu einem gefüllten
   * Nachbarn: „grösser als die 2“) und „kette“ (ein Zeichen zwischen zwei leeren Feldern: „kleiner als ein Feld, in das
   * höchstens 3 passt“ — so lange, bis sich nichts mehr ändert). Die Zeichen engen die Kandidaten ein; gefunden wird
   * zuerst „einer“ (ein Feld), dann „versteckt“ (eine Einheit).
   */
  function schritt(r, werte, techniken, masken = einheitsMasken(r, werte)) {
    const mitVergleich = r.vergleiche.length > 0 && techniken.has("vergleich");
    let kand = i => kandidaten(r, masken, i, mitVergleich ? werte : null);
    if (mitVergleich && techniken.has("kette")) {
      const c = werte.map((v, i) => (v ? 0 : kandidaten(r, masken, i, werte)));
      const maske = i => (werte[i] ? 1 << (werte[i] - 1) : c[i]);
      for (let neu = true; neu;) {
        neu = false;
        for (const [a, b] of r.vergleiche) {
          const ma = maske(a), mb = maske(b);
          if (!ma || !mb) continue; // Widerspruch: das zeigt der Löser nicht hier
          if (!werte[a]) { const x = c[a] & ((1 << (31 - Math.clz32(mb))) - 1); if (x !== c[a]) { c[a] = x; neu = true; } }      // a < höchstes b
          if (!werte[b]) { const x = c[b] & ~(((ma & -ma) << 1) - 1); if (x !== c[b]) { c[b] = x; neu = true; } }               // b > tiefstes a
        }
      }
      kand = i => c[i];
    }
    if (techniken.has("einer")) {
      for (let i = 0; i < werte.length; i++) {
        if (werte[i]) continue;
        const m = kand(i);
        if (m && !(m & (m - 1))) return { feld: i, zahl: einzigeZahl(m), art: "einer", einheit: null };
      }
    }
    if (techniken.has("versteckt")) {
      for (let u = 0; u < r.einheiten.length; u++) {
        let einmal = 0, mehrmals = 0;
        const felder = r.einheiten[u].felder;
        for (const i of felder) {
          if (werte[i]) continue;
          const m = kand(i);
          mehrmals |= einmal & m; einmal |= m;
        }
        const nur = einmal & ~mehrmals & ~masken[u];
        if (nur) {
          const bit = nur & -nur;
          const feld = felder.find(i => !werte[i] && (kand(i) & bit));
          return { feld, zahl: einzigeZahl(bit), art: "versteckt", einheit: u };
        }
      }
    }
    return null;
  }

  /** Lässt sich das Rätsel mit den Techniken ganz lösen? → { geloest, arten: { einer, versteckt } } */
  function mitTechnikLoesen(r, vorgabe, techniken) {
    const werte = vorgabe.slice();
    const masken = einheitsMasken(r, werte);
    const arten = { einer: 0, versteckt: 0 };
    let offen = werte.filter(v => !v).length;
    while (offen) {
      const s = schritt(r, werte, techniken, masken);
      if (!s) return { geloest: false, arten };
      werte[s.feld] = s.zahl;
      for (const u of r.vonFeld[s.feld]) masken[u] |= 1 << (s.zahl - 1);
      arten[s.art]++;
      offen--;
    }
    return { geloest: true, arten };
  }

  /**
   * Rätsel erzeugen: volles Raster, dann Felder in zufälliger Reihenfolge leeren, solange es mit den Techniken lösbar
   * bleibt, bis leer Felder leer sind. → { loesung, vorgabe } oder null nach versuche Fehlschlägen.
   * opt: { leer, techniken: Set, mische, versuche = 30, braucht: "versteckt" (mindestens ein solcher Schritt nötig),
   *        loesung: eine schon gegebene volle Lösung (Gebiets-Sudoku: die Gebiete sind zu ihr gebaut) }
   */
  function erzeuge(r, opt) {
    const { leer, techniken, mische, versuche = 30, braucht = null } = opt;
    for (let v = 0; v < versuche; v++) {
      const loesung = opt.loesung ? opt.loesung.slice() : fuelle(r, mische);
      if (!loesung) return null;
      const vorgabe = loesung.slice();
      let geleert = 0;
      for (const i of mische(loesung.map((_, k) => k))) {
        if (geleert === leer) break;
        vorgabe[i] = 0;
        if (mitTechnikLoesen(r, vorgabe, techniken).geloest) geleert++;
        else vorgabe[i] = loesung[i];
      }
      if (geleert !== leer) continue;
      if (braucht && mitTechnikLoesen(r, vorgabe, new Set([...techniken].filter(t => t !== braucht))).geloest) continue;
      return { loesung, vorgabe };
    }
    return null;
  }

  /**
   * Mängel eines Rätsels für pruefeAufgabe: Lösung gültig, Vorgaben passen zur Lösung, genau eine Lösung (unabhängig
   * durch Probieren gezählt), mit den Techniken lösbar, so viele leere Felder wie verlangt, Zahlen 1 … n.
   */
  function maengel(r, a, { leer, techniken, braucht = null }) {
    const m = [];
    const N = r.n * r.n;
    if (a.loesung.length !== N || a.vorgabe.length !== N) return ["Raster hat die falsche Grösse"];
    if (a.loesung.some(v => !Number.isInteger(v) || v < 1 || v > r.n)) m.push(`Lösung mit Zahl ausserhalb 1 … ${r.n}`);
    if (widersprueche(r, a.loesung).length) m.push("Lösung verletzt eine Einheit");
    if (a.vorgabe.some((v, i) => v && v !== a.loesung[i])) m.push("Vorgabe passt nicht zur Lösung");
    const n0 = a.vorgabe.filter(v => !v).length;
    if (n0 !== leer) m.push(`${n0} statt ${leer} leere Felder`);
    const ziel = [];
    const k = zaehleLoesungen(r, a.vorgabe, 2, ziel);
    if (k !== 1) m.push(`${k} Lösungen statt genau einer`);
    else if (ziel.some((v, i) => v !== a.loesung[i])) m.push("Löser findet eine andere Lösung");
    if (!mitTechnikLoesen(r, a.vorgabe, techniken).geloest) m.push("mit den Schritten der Stufe nicht lösbar");
    if (braucht && mitTechnikLoesen(r, a.vorgabe, new Set([...techniken].filter(t => t !== braucht))).geloest)
      m.push(`braucht keinen Schritt „${braucht}“`);
    return m;
  }

  /**
   * Ton 0 … 3 je Gebiet, so dass Gebiete mit gemeinsamer Kante verschieden sind (vier Farben reichen für jede Karte; hier
   * mit Probieren gefunden, höchstens neun Gebiete). → { gebiet: ton }
   */
  function toene(r) {
    const n = r.n, ids = [...new Set(r.gebiete)];
    const nachbar = Object.fromEntries(ids.map(g => [g, new Set()]));
    r.gebiete.forEach((g, i) => nachbarnVon(n, i).forEach(k => { if (r.gebiete[k] !== g) nachbar[g].add(r.gebiete[k]); }));
    const ton = {};
    (function setze(k) {
      if (k === ids.length) return true;
      for (let t = 0; t < 4; t++) {
        if ([...nachbar[ids[k]]].some(h => ton[h] === t)) continue;
        ton[ids[k]] = t;
        if (setze(k + 1)) return true;
        delete ton[ids[k]];
      }
      return false;
    })(0);
    return ton;
  }

  // ----- Bedienung im Spiel -----

  const EINHEIT_SATZ = { zeile: "in dieser Zeile", spalte: "in dieser Spalte", kasten: "in diesem Kasten", gebiet: "in diesem Gebiet" };

  /**
   * Das Rätsel als Aufgabe in ctx.flaeche: Felder, Zahlenleiste, ✏️ Notizen, ⌫, „✓ Fertig“.
   * opt: { raster, vorgabe, loesung, zeichen(v) → Text des Werts (Standard die Zahl), name(v) → Wort für Knöpfe und
   *        Felder („Hund“), nennung(v) → mit Artikel für die Eule („der Hund“, Standard „die 4“), tipps: drei eigene
   *        Tipp-Texte (der dritte zeigt ein Feld), notizText: Erklärung am ✏️-Knopf, auftrag: Text über dem Raster }
   * Fehler nach SU3 a: Ein Widerspruch (die Zahl steht schon in derselben Einheit) wird sofort gezeigt, das Feld wackelt
   * und die Zahl bleibt nicht stehen — das zählt als Fehler. Falsch ohne Widerspruch zeigt erst „✓ Fertig“: die Felder
   * leuchten, das zählt als Fehler, das Kind korrigiert sie. Notizen werden nie bewertet. Ist das letzte Feld richtig
   * gefüllt, ist die Aufgabe gelöst.
   */
  function spiel(ctx, opt) {
    const { el } = LS;
    const r = opt.raster, n = r.n;
    const zeichen = opt.zeichen || (v => String(v));
    const name = opt.name || (v => String(v));
    const nennung = opt.nennung || (v => `die ${name(v)}`);
    const gross = t => t.charAt(0).toUpperCase() + t.slice(1);
    const werte = opt.vorgabe.slice();
    const notizen = Array.from({ length: n * n }, () => new Set());
    const falschMarke = new Set();
    let gewaehlt = opt.vorgabe.findIndex(v => !v);
    let notizModus = false;
    const zeile = i => `Zeile ${Math.floor(i / n) + 1}, Spalte ${(i % n) + 1}`;
    const gebietWort = r.einheiten[2 * n].art === "gebiet" ? "sein Gebiet" : "seinen Kasten";

    ctx.loesung(Array.from({ length: n }, (_, z) => opt.loesung.slice(z * n, z * n + n).map(zeichen).join(" ")).join(" | "));
    // Handgriffe (HG1 a): je leeres Feld antippen und die Zahl wählen; das erste leere Feld ist schon gewählt, und das
    // letzte richtige Feld löst die Aufgabe ohne „✓ Fertig“
    ctx.schritte(2 * opt.vorgabe.filter(v => !v).length - 1);
    // Tipps: der dritte zeigt ein Feld (beiTipp). Bilder-Sudoku gibt eigene Texte mit („welches Tier“ statt „welche Zahl“).
    ctx.tipp(opt.tipps || [
      "Nicht sicher? Schreib die möglichen Zahlen klein ins Feld (✏️).",
      `Such ein Feld, in das nur noch eine Zahl passt: Schau seine Zeile, seine Spalte und ${gebietWort} an. Oder such für eine Zahl den einzigen Platz, wo sie noch hin kann.`,
      "Schau dir das Feld an, das jetzt leuchtet: Welche Zahl fehlt dort noch?",
    ], (i) => { if (i === 2) zeigeSchritt(); });

    const brett = el("div", { class: "sd-brett", role: "grid", "aria-label": `Sudoku ${n} mal ${n}` });
    brett.style.setProperty("--sd-n", String(n));
    brett.style.setProperty("--sd-nk", n <= 4 ? "2" : "3"); // Notizen: 2 × 2 beim 4 × 4, sonst drei Spalten
    // Unregelmässige Gebiete zusätzlich leicht eingefärbt, Nachbarn verschieden (Kästen sieht man an den Linien)
    const ton = r.einheiten[2 * n].art === "gebiet" ? toene(r) : null;
    const felder = [];
    for (let i = 0; i < n * n; i++) {
      const z = Math.floor(i / n), s = i % n;
      const g = r.gebiete[i];
      const kl = ["sd-feld"];
      if (ton) kl.push(`sd-ton${ton[g]}`);
      if (opt.vorgabe[i]) kl.push("sd-vorgabe");
      if (z === 0 || r.gebiete[i - n] !== g) kl.push("sd-oben");
      if (s === 0 || r.gebiete[i - 1] !== g) kl.push("sd-links");
      if (z === n - 1) kl.push("sd-unten");
      if (s === n - 1) kl.push("sd-rechts");
      const f = el("button", { type: "button", class: kl.join(" "), "data-feld": String(i) });
      if (opt.vorgabe[i]) { f.disabled = true; f.textContent = zeichen(opt.vorgabe[i]); }
      else f.addEventListener("click", () => waehle(i));
      felder.push(f);
      brett.append(f);
    }

    const zahlen = el("div", { class: "sd-zahlen" + (opt.zeichen ? " sd-bildtasten" : "") }); // Bilder gross (Kindergarten)
    const zahlKnoepfe = [];
    for (let v = 1; v <= n; v++) {
      const k = el("button", { type: "button", class: "knopf hell sd-zahl", text: zeichen(v), "aria-label": name(v) });
      k.addEventListener("click", () => tippe(v));
      zahlKnoepfe.push(k);
      zahlen.append(k);
    }
    const notizKnopf = el("button", { type: "button", class: "knopf hell klein sd-werkzeug", text: "✏️ Notizen", "aria-pressed": "false",
      title: opt.notizText || "Kleine Zahlen als Notiz ins Feld schreiben" });
    notizKnopf.addEventListener("click", () => {
      notizModus = !notizModus;
      notizKnopf.setAttribute("aria-pressed", String(notizModus));
      notizKnopf.classList.toggle("an", notizModus);
      brett.classList.toggle("sd-notizmodus", notizModus);
    });
    const loeschKnopf = el("button", { type: "button", class: "knopf hell klein sd-werkzeug", text: "⌫", "aria-label": "Feld leeren" });
    loeschKnopf.addEventListener("click", () => leere());
    const fertigKnopf = el("button", { type: "button", class: "knopf gruen klein sd-werkzeug", text: "✓ Fertig" });
    fertigKnopf.addEventListener("click", () => fertig());
    const werkzeuge = el("div", { class: "sd-werkzeuge" }, notizKnopf, loeschKnopf, fertigKnopf);
    zahlen.style.setProperty("--sd-n", String(n));
    zahlen.style.setProperty("--sd-tasten", n <= 4 ? "2" : "3"); // Tastenblock breit: 2 × 2 oder 3 Spalten

    // Zeichen zwischen Nachbarn (Vergleichs-Sudoku): auf der Kante, die Spitze zeigt zur kleineren Zahl
    for (const [a, b] of r.vergleiche) {
      const [x, y] = [Math.min(a, b), Math.max(a, b)], waag = y === x + 1;
      // senkrecht dasselbe < und >, um 90° gedreht (sudoku.css): Spitze nach oben, wenn das obere Feld kleiner ist
      const marke = a === x ? "<" : ">";
      const z = Math.floor(x / n), s = x % n;
      const sp = el("span", { class: `sd-zeichen ${waag ? "sd-waag" : "sd-senk"}`, text: marke, "aria-hidden": "true" });
      sp.style.left = `${((waag ? s + 1 : s + 0.5) / n) * 100}%`;
      sp.style.top = `${((waag ? z + 0.5 : z + 1) / n) * 100}%`;
      brett.append(sp);
    }
    ctx.flaeche.append(el("div", { class: "frage sd-auftrag", text: opt.auftrag }),
      el("div", { class: "sd-spiel" }, brett, el("div", { class: "sd-steuerung" }, zahlen, werkzeuge)));
    LS.kurztasten(zahlen, zahlKnoepfe);
    zeichne();

    function waehle(i) {
      if (ctx.vorbei() || opt.vorgabe[i]) return;
      gewaehlt = i;
      zeichne();
    }
    function tippe(v) {
      if (ctx.vorbei()) return;
      if (gewaehlt < 0 || opt.vorgabe[gewaehlt]) { ctx.sag("Tipp zuerst auf ein leeres Feld.", "hinweis"); return; }
      const i = gewaehlt;
      if (notizModus) {
        if (werte[i]) return;
        if (notizen[i].has(v)) notizen[i].delete(v); else notizen[i].add(v);
        zeichne();
        return;
      }
      if (werte[i] === v) return;
      // Widerspruch: steht die Zahl schon in einer Einheit dieses Felds?
      for (const u of r.vonFeld[i]) {
        const dort = r.einheiten[u].felder.find(k => k !== i && werte[k] === v);
        if (dort !== undefined) {
          wackle(felder[i]); wackle(felder[dort]);
          ctx.falsch(`${gross(nennung(v))} steht schon ${EINHEIT_SATZ[r.einheiten[u].art]}.`);
          return;
        }
      }
      // Widerspruch zu einem Zeichen (Vergleichs-Sudoku, SU3 a): der gefüllte Nachbar ist nicht grösser bzw. kleiner
      const wo = j => (Math.floor(j / n) === Math.floor(i / n) ? "daneben" : j < i ? "darüber" : "darunter");
      for (const [nachbarn, soll, passt] of [[r.kleiner[i], "kleiner", w => v < w], [r.groesser[i], "grösser", w => v > w]]) {
        const j = nachbarn.find(k => werte[k] && !passt(werte[k]));
        if (j !== undefined) {
          wackle(felder[i]); wackle(felder[j]);
          ctx.falsch(`${gross(nennung(v))} muss ${soll} sein als ${nennung(werte[j])} ${wo(j)}.`);
          return;
        }
      }
      werte[i] = v;
      notizen[i].clear();
      falschMarke.delete(i);
      LS.ton("tipp");
      zeichne();
      if (werte.every((x, k) => x === opt.loesung[k])) { ctx.richtig(opt.lob || "Gelöst! 🎉"); zeichne(); }
    }
    function leere() {
      if (ctx.vorbei() || gewaehlt < 0 || opt.vorgabe[gewaehlt]) return;
      werte[gewaehlt] = 0;
      notizen[gewaehlt].clear();
      falschMarke.delete(gewaehlt);
      zeichne();
    }
    function fertig() {
      if (ctx.vorbei()) return;
      const leerFelder = werte.filter(v => !v).length;
      if (leerFelder) { ctx.sag(leerFelder === 1 ? "Ein Feld ist noch leer." : `${leerFelder} Felder sind noch leer.`, "hinweis"); return; }
      const falsch = werte.map((v, k) => (v !== opt.loesung[k] ? k : -1)).filter(k => k >= 0);
      if (!falsch.length) { ctx.richtig(opt.lob || "Gelöst! 🎉"); zeichne(); return; }
      falsch.forEach(k => falschMarke.add(k));
      zeichne();
      ctx.falsch(falsch.length === 1 ? "Ein Feld stimmt noch nicht — es leuchtet. Schau es dir nochmals an."
        : `${falsch.length} Felder stimmen noch nicht — sie leuchten. Schau sie dir nochmals an.`);
    }
    /** Tipp 3: ein Feld zeigen, in das nach den richtigen Zahlen nur eine Zahl passt (nie die Zahl selbst). */
    function zeigeSchritt() {
      const sicher = werte.map((v, k) => (v === opt.loesung[k] ? v : 0));
      const s = schritt(r, sicher, new Set(["einer", "versteckt", "vergleich", "kette"]));
      const feld = s ? s.feld : sicher.findIndex(v => !v);
      if (feld < 0) return;
      gewaehlt = feld;
      zeichne();
      felder[feld].classList.add("sd-tipp");
    }
    function wackle(f) { f.classList.remove("falsch"); void f.offsetWidth; f.classList.add("falsch"); }
    function zeichne() {
      const zahl = gewaehlt >= 0 ? werte[gewaehlt] : 0;
      const nachbarn = new Set(gewaehlt >= 0 ? r.vonFeld[gewaehlt].flatMap(u => r.einheiten[u].felder) : []);
      felder.forEach((f, i) => {
        f.classList.toggle("sd-gewaehlt", i === gewaehlt);
        f.classList.toggle("sd-nachbar", i !== gewaehlt && nachbarn.has(i));
        f.classList.toggle("sd-gleich", !!zahl && werte[i] === zahl && i !== gewaehlt);
        f.classList.toggle("sd-leuchtet", falschMarke.has(i));
        f.classList.remove("sd-tipp");
        if (opt.vorgabe[i]) return;
        f.classList.toggle("sd-eigen", !!werte[i]);
        if (werte[i]) { f.textContent = zeichen(werte[i]); f.setAttribute("aria-label", `Feld ${zeile(i)}, ${name(werte[i])}`); }
        else if (notizen[i].size) {
          f.replaceChildren(el("span", { class: "sd-notizen" }, ...Array.from({ length: n }, (_, k) =>
            el("span", { text: notizen[i].has(k + 1) ? zeichen(k + 1) : "" }))));
          f.setAttribute("aria-label", `Feld ${zeile(i)}, Notizen ${[...notizen[i]].sort().map(name).join(", ")}`);
        } else { f.textContent = ""; f.setAttribute("aria-label", `Feld ${zeile(i)}, leer`); }
      });
      if (ctx.vorbei()) brett.classList.add("sd-geloest");
    }
  }

  return { kaesten, startGebiete, gebieteZufall, gebieteMaengel, vergleicheAus, raster, widersprueche, zaehleLoesungen, fuelle, schritt, mitTechnikLoesen, erzeuge, maengel, spiel };
})();

if (typeof module !== "undefined") module.exports = SUDOKU;
