/* Kern — Suche mit Relevanz und persönlicher Passung (Entscheid SU1 a, Wunsch Patrik LERN_Session10; Herkunft
   eulenpfad/spiele/gemeinsam/spiel.js; docs/kern/rahmen.md 4.9).
   Kleine Volltextsuche mit Rangfolge: je Suchwort der beste Treffer über alle Felder, gewichtet nach Feld und Art
   des Treffers; jedes Suchwort muss passen. Passt ein Eintrag nur über ein Feld, das auf der Karte nicht steht,
   nennt `grund` es. Die Passung (0–1, von der App gerechnet) wirkt als Faktor 1 + faktor · Passung auf die
   Textrelevanz — der Text bleibt massgebend. Ohne DOM; die App gibt Einträge, Felder, Gewichte und Passung mit. */
"use strict";

(function (KERN) {
  const falte = t => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  /** Wörter eines Texts, klein; Punkte nur im Wort („MA.1.A.3“ bleibt ganz). */
  const woerter = t => String(t || "").toLowerCase().split(/[^\p{L}\p{N}.]+/u).map(w => w.replace(/^\.+|\.+$/g, "")).filter(Boolean);
  /** Höchstens ein Zeichen Unterschied (einfügen, löschen, ersetzen)? */
  function einTippfehler(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, fehler = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++fehler > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return fehler + (a.length - i) + (b.length - j) <= 1;
  }
  /**
   * Wie gut passt das Suchwort q zum Wort w (0 bis 1)? Ganz 1, Wortanfang 0.8, mit ä = a 0.7 / 0.6, Wortteil ab 4
   * Zeichen 0.4 / 0.3, ein Tippfehler (nur wenn tippfehler, ab 5 Zeichen, nie mit Ziffern) 0.25.
   */
  function wortWert(q, w, tippfehler = false) {
    if (w === q) return 1;
    if (w.startsWith(q)) return 0.8;
    const fq = falte(q), fw = falte(w);
    if (fw === fq) return 0.7;
    if (fw.startsWith(fq)) return 0.6;
    if (q.length >= 4 && w.includes(q)) return 0.4;
    if (q.length >= 4 && fw.includes(fq)) return 0.3;
    if (tippfehler && q.length >= 5 && !/\d/.test(q)
      && (einTippfehler(fq, fw.slice(0, fq.length)) || einTippfehler(fq, fw.slice(0, fq.length + 1)))) return 0.25;
    return 0;
  }
  const mitPassung = (wert, p, faktor = 0.5) => (p === null || p === undefined ? wert : wert * (1 + faktor * p));
  /** Nähe zweier Klassen oder Stufen für die Passung: gleich 1, eine daneben 0.6, zwei 0.2, sonst 0; unbekannt 0.5. */
  const naehe = (a, b) => (a == null || b == null ? 0.5 : ([1, 0.6, 0.2][Math.abs(a - b)] ?? 0));

  /**
   * Einträge zur Suche, beste zuerst: [{ id, wert, passung, grund }]; leere Suche: null.
   * opt: { felder: e → { <feld>: [Texte] }, gewicht: { <feld>: Zahl }, sichtbar: [Felder auf der Karte],
   *        tippfehler: [Felder mit Tippfehler], grund: (feld, text) → Satz, passung: e → 0–1 | null, faktor }
   * Bei gleichem Wert bleibt die Reihenfolge der Einträge.
   */
  function suche(text, eintraege, opt) {
    const qs = woerter(text);
    if (!qs.length) return null;
    const sichtbar = new Set(opt.sichtbar || []), tipp = new Set(opt.tippfehler || []);
    const treffer = [];
    (eintraege || []).forEach((e, rang) => {
      const felder = opt.felder(e);
      let wert = 0;
      const gruende = [];
      for (const q of qs) {
        let best = 0, wo = null;
        for (const [feld, texte] of Object.entries(felder)) for (const t of texte || []) for (const w of woerter(t)) {
          const x = wortWert(q, w, tipp.has(feld)) * (opt.gewicht[feld] || 0);
          if (x > best) { best = x; wo = { feld, t }; }
        }
        if (!best) return;
        wert += best;
        if (!sichtbar.has(wo.feld) && opt.grund) gruende.push(opt.grund(wo.feld, wo.t));
      }
      const p = opt.passung ? opt.passung(e) : null;
      treffer.push({ id: e.id, wert: mitPassung(wert, p, opt.faktor), passung: p, rang, grund: gruende.length ? [...new Set(gruende)].join("; ") : null });
    });
    return treffer.sort((a, b) => b.wert - a.wert || a.rang - b.rang).map(({ rang, ...t }) => t);
  }

  /**
   * Ähnliche Einträge, ähnlichste zuerst: [{ id, wert, passung, grund }].
   * opt: { vergleich: (eintrag, anderer) → { wert, grund } | null (null = nicht ähnlich), passung, faktor }
   */
  function aehnlich(id, eintraege, opt) {
    const e = (eintraege || []).find(x => x.id === id);
    if (!e) return [];
    const liste = [];
    eintraege.forEach((x, rang) => {
      if (x.id === id) return;
      const v = opt.vergleich(e, x);
      if (!v) return;
      const p = opt.passung ? opt.passung(x) : null;
      liste.push({ id: x.id, wert: mitPassung(v.wert, p, opt.faktor), passung: p, rang, grund: v.grund || "" });
    });
    return liste.sort((a, b) => b.wert - a.wert || a.rang - b.rang).map(({ rang, ...t }) => t);
  }

  KERN.suche = { woerter, falte, einTippfehler, wortWert, mitPassung, naehe, suche, aehnlich };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
