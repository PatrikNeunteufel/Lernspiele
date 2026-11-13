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

  /**
   * Raster aus Grösse und Gebieten. → { n, gebiete, einheiten: [{ art, felder }], vonFeld: [[Einheit …]], voll }
   * art: "zeile", "spalte", "kasten" oder "gebiet" (für die Sätze der Eule).
   */
  function raster(n, gebiete, gebietArt = "kasten") {
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
    return { n, gebiete, einheiten, vonFeld, voll: bits(n) };
  }

  /** Masken je Einheit: welche Zahlen dort schon stehen. */
  const einheitsMasken = (r, werte) => r.einheiten.map(e => e.felder.reduce((m, i) => (werte[i] ? m | (1 << (werte[i] - 1)) : m), 0));
  const kandidaten = (r, masken, i) => r.voll & ~r.vonFeld[i].reduce((m, u) => m | masken[u], 0);

  /** Widersprüche der Werte: je Einheit doppelte Zahlen → [{ einheit, zahl, felder }]. */
  function widersprueche(r, werte) {
    const aus = [];
    r.einheiten.forEach((e, u) => {
      const je = {};
      for (const i of e.felder) if (werte[i]) (je[werte[i]] = je[werte[i]] || []).push(i);
      for (const [z, f] of Object.entries(je)) if (f.length > 1) aus.push({ einheit: u, zahl: Number(z), felder: f });
    });
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
        const m = kandidaten(r, masken, i), k = zaehleBits(m);
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

  /** Volles, gültiges Raster in zufälliger Ordnung (für den Generator). zufallsFolge(liste) mischt. */
  function fuelle(r, mische) {
    const leer = Array(r.n * r.n).fill(0);
    const werte = leer.slice(), masken = einheitsMasken(r, werte);
    const ok = (function suche() {
      let best = -1, bestMaske = 0, bestZahl = 99;
      for (let i = 0; i < werte.length; i++) {
        if (werte[i]) continue;
        const m = kandidaten(r, masken, i), k = zaehleBits(m);
        if (k < bestZahl) { best = i; bestMaske = m; bestZahl = k; if (k <= 1) break; }
      }
      if (best < 0) return true;
      const zahlen = [];
      for (let m = bestMaske; m; m &= m - 1) zahlen.push(einzigeZahl(m & -m));
      for (const v of mische(zahlen)) {
        werte[best] = v; for (const u of r.vonFeld[best]) masken[u] |= 1 << (v - 1);
        if (suche()) return true;
        werte[best] = 0; for (const u of r.vonFeld[best]) masken[u] &= ~(1 << (v - 1));
      }
      return false;
    })();
    if (!ok) throw new Error("Raster lässt sich nicht füllen");
    return werte;
  }

  /**
   * Nächster Schritt des menschlichen Lösers: { feld, zahl, art: "einer" | "versteckt", einheit } oder null.
   * techniken: Set aus "einer", "versteckt". Zuerst „einer“ (ein Feld), dann „versteckt“ (eine Einheit).
   */
  function schritt(r, werte, techniken, masken = einheitsMasken(r, werte)) {
    if (techniken.has("einer")) {
      for (let i = 0; i < werte.length; i++) {
        if (werte[i]) continue;
        const m = kandidaten(r, masken, i);
        if (m && !(m & (m - 1))) return { feld: i, zahl: einzigeZahl(m), art: "einer", einheit: null };
      }
    }
    if (techniken.has("versteckt")) {
      for (let u = 0; u < r.einheiten.length; u++) {
        let einmal = 0, mehrmals = 0;
        const felder = r.einheiten[u].felder;
        for (const i of felder) {
          if (werte[i]) continue;
          const m = kandidaten(r, masken, i);
          mehrmals |= einmal & m; einmal |= m;
        }
        const nur = einmal & ~mehrmals & ~masken[u];
        if (nur) {
          const bit = nur & -nur;
          const feld = felder.find(i => !werte[i] && (kandidaten(r, masken, i) & bit));
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
   * opt: { leer, techniken: Set, mische, versuche = 30, braucht: "versteckt" (mindestens ein solcher Schritt nötig) }
   */
  function erzeuge(r, opt) {
    const { leer, techniken, mische, versuche = 30, braucht = null } = opt;
    for (let v = 0; v < versuche; v++) {
      const loesung = fuelle(r, mische);
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
    const felder = [];
    for (let i = 0; i < n * n; i++) {
      const z = Math.floor(i / n), s = i % n;
      const g = r.gebiete[i];
      const kl = ["sd-feld"];
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
      const s = schritt(r, sicher, new Set(["einer", "versteckt"]));
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

  return { kaesten, raster, widersprueche, zaehleLoesungen, fuelle, schritt, mitTechnikLoesen, erzeuge, maengel, spiel };
})();

if (typeof module !== "undefined") module.exports = SUDOKU;
