/* Kern — Auswertung ohne App-Bezug (Entscheide AW1 a, AW2 a, LERN_Session16; Plan docs/plan_angleich_reihe.md B;
   docs/kern/rahmen.md 4.14). Herkunft: eulenpfad/spiele/gemeinsam/auswertung.js und erfolge.js (Sitzungen, Lernzeiten,
   Wochenziel, Bedarf, Ziehen), lernsteig/gemeinsam/werkzeug.js und rahmen.js (Wochenserie, Kompetenzstand).

   Reine Rechnungen auf Runden im gemeinsamen Format (kern/runden.js: zeit, dauer …) und auf Listen von Aufgaben.
   Was an Katalog, Lernzielen und Ton einer App hängt (Fazit, Vorschläge, Texte), bleibt in der App; sie gibt hier nur
   ihre Schwellen mit. Testrunden filtert die App vorher heraus. */
"use strict";

(function (KERN) {
  const TAG_MS = 24 * 3600 * 1000;
  const WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const mittel = xs => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);
  const median = xs => { if (!xs.length) return null; const a = [...xs].sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };

  /** Pearson-Korrelation zweier gleich langer Reihen; null bei weniger als drei Werten oder ohne Streuung. */
  function korrelation(xs, ys) {
    const n = xs.length;
    if (n < 3) return null;
    const mx = mittel(xs), my = mittel(ys);
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
    return sxx && syy ? sxy / Math.sqrt(sxx * syy) : null;
  }

  /** Runden zu Sitzungen: mehr als pauseMin Minuten (plus Dauer der Runde) zwischen zwei Enden = neue Sitzung. */
  function sitzungen(runden, { pauseMin = 20 } = {}) {
    const sortiert = [...runden].sort((a, b) => a.zeit.localeCompare(b.zeit));
    const ergebnis = [];
    let letzte = null;
    for (const e of sortiert) {
      const t = Date.parse(e.zeit);
      if (!letzte || t - letzte > pauseMin * 60000 + (e.dauer || 0) * 1000) ergebnis.push([]);
      ergebnis[ergebnis.length - 1].push(e);
      letzte = t;
    }
    return ergebnis;
  }

  /** Wann wird gelernt: Minuten und Runden je Wochentag (Mo–So), je Tageszeit und je Tag der letzten 14 Tage. */
  function lernzeiten(runden, jetzt = Date.now()) {
    const wochentage = WOCHENTAGE.map(t => ({ name: t, minuten: 0, runden: 0 }));
    const fenster = [
      { name: "vor 9", von: 0, bis: 9 }, { name: "9–12", von: 9, bis: 12 }, { name: "12–14", von: 12, bis: 14 },
      { name: "14–17", von: 14, bis: 17 }, { name: "17–20", von: 17, bis: 20 }, { name: "ab 20", von: 20, bis: 24 },
    ].map(f => ({ ...f, minuten: 0, runden: 0 }));
    const tage = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(jetzt - (13 - i) * TAG_MS);
      return { datum: d.toDateString(), name: String(d.getDate()), lang: d.toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "numeric" }), minuten: 0, runden: 0 };
    });
    for (const e of runden) {
      const d = new Date(e.zeit);
      const min = (e.dauer || 0) / 60;
      const w = wochentage[(d.getDay() + 6) % 7];
      w.minuten += min; w.runden++;
      const f = fenster.find(x => d.getHours() >= x.von && d.getHours() < x.bis);
      f.minuten += min; f.runden++;
      const t = tage.find(x => x.datum === d.toDateString());
      if (t) { t.minuten += min; t.runden++; }
    }
    return { wochentage, fenster, tage, uebungstage14: tage.filter(t => t.runden > 0).length };
  }

  // ---------- Wochen und Wochenziel ----------
  /** Montag 0:00 der Woche, in der `zeit` liegt (Ortszeit). */
  function wochenStart(zeit) {
    const d = new Date(zeit);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
  }
  const tageSpaeter = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  /**
   * Wochen seit der ersten Runde bis heute, älteste zuerst, mindestens eine: { wochen, aktuelle, serie, erfuellt }.
   * ziel: { tage, minuten } oder null. Ein Tag ist erfüllt, wenn die Runden des Tages zusammen die Minuten erreichen
   * (minuten 0 oder ohne Ziel: wenn geübt wurde); eine Woche, wenn genug Tage erfüllt sind (nur mit Ziel).
   * serie: erfüllte Wochen in Folge bis heute; die laufende Woche zählt, sobald sie erfüllt ist, und bricht die Serie
   * nicht, solange sie läuft. erfuellt: Zahl der erfüllten Wochen.
   * Je Woche { von, bis, tage: [{ name, datum, minuten, runden, heute, zukunft, erfuellt }], erfuellteTage, erfuellt, laufend }.
   */
  function wochen(runden, ziel = null, jetzt = Date.now()) {
    const plan = ziel && ziel.tage > 0 ? { tage: ziel.tage, minuten: ziel.minuten || 0 } : null;
    const start = wochenStart(jetzt);
    const erste = runden.length ? wochenStart(Math.min(...runden.map(e => Date.parse(e.zeit)))) : start;
    const liste = [];
    for (let von = erste; von <= start; von = tageSpaeter(von, 7)) {
      const bis = tageSpaeter(von, 7);
      const tage = WOCHENTAGE.map((name, i) => ({ name, datum: tageSpaeter(von, i), minuten: 0, runden: 0, heute: false, zukunft: false }));
      for (const t of tage) { t.heute = t.datum.toDateString() === new Date(jetzt).toDateString(); t.zukunft = t.datum > jetzt && !t.heute; }
      for (const e of runden) {
        const z = new Date(e.zeit);
        if (z < von || z >= bis) continue;
        const t = tage[(z.getDay() + 6) % 7];
        t.minuten += (e.dauer || 0) / 60;
        t.runden++;
      }
      for (const t of tage) t.erfuellt = plan && plan.minuten > 0 ? t.minuten >= plan.minuten : t.runden > 0;
      const erfuellteTage = tage.filter(t => t.erfuellt).length;
      liste.push({ von, bis, tage, erfuellteTage, erfuellt: !!plan && erfuellteTage >= plan.tage, laufend: von.getTime() === start.getTime() });
    }
    let serie = 0;
    for (let i = liste.length - 1; i >= 0; i--) {
      if (liste[i].erfuellt) serie++;
      else if (!liste[i].laufend) break;
    }
    return { plan, wochen: liste, aktuelle: liste[liste.length - 1], serie, erfuellt: liste.filter(w => w.erfuellt).length };
  }

  // ---------- Stand und Bedarf (AW2 a: eine Regel, Schwellen je App) ----------
  /**
   * Stand aus den letzten Aufgaben: aufgaben = [{ anhieb: Ja/Nein, gezeigt?: Ja/Nein }], älteste zuerst.
   * opt: { fenster (letzte n Aufgaben), mindestens (Aufgaben insgesamt für „sicher“), schwelle (Anteil auf Anhieb),
   * ohneGezeigt (im Fenster keine gezeigte Lösung für „sicher“, Standard ja) }.
   * Liefert { n, imFenster, anhieb, quote (null ohne Aufgaben), sicher }.
   */
  function stand(aufgaben, { fenster = 10, mindestens = 1, schwelle = 0.7, ohneGezeigt = true } = {}) {
    const liste = Array.isArray(aufgaben) ? aufgaben : [];
    const letzte = liste.slice(-fenster);
    const anhieb = letzte.filter(a => a && a.anhieb && !a.gezeigt).length;
    const quote = letzte.length ? anhieb / letzte.length : null;
    const sicher = liste.length >= mindestens && quote !== null && quote >= schwelle && (!ohneGezeigt || letzte.every(a => !a.gezeigt));
    return { n: liste.length, imFenster: letzte.length, anhieb, quote, sicher };
  }

  /**
   * Bedarf als Gewicht für Zufallswahlen (Eulenpfad LERN_Session10): noch nie geübt 2 (ausprobieren); unter der Schwelle
   * 1 + 4 · (1 − quote) (wackelt); sonst kürzlich geübt 0.5, über sieben Tage her 2 (verteiltes Üben).
   * quote: Anteil auf Anhieb (stand(…).quote) oder null; tageSeit: Tage seit dem letzten Üben.
   */
  function bedarf(quote, tageSeit, { schwelle = 0.7 } = {}) {
    if (quote === null || quote === undefined) return 2;
    return quote < schwelle ? 1 + 4 * (1 - quote) : tageSeit >= 7 ? 2 : 0.5;
  }

  /** Zufällig nach Gewicht ziehen: ohne n ein Element, mit n eine Liste ohne Zurücklegen (höchstens n). */
  function ziehe(kandidaten, gewicht, n, zufall = Math.random) {
    const rest = kandidaten.map(x => ({ x, g: Math.max(0, gewicht(x)) }));
    const aus = [];
    while (rest.length && aus.length < (n ?? 1)) {
      let r = zufall() * rest.reduce((a, e) => a + e.g, 0);
      let i = rest.findIndex(e => (r -= e.g) < 0);
      if (i < 0) i = rest.length - 1;
      aus.push(rest.splice(i, 1)[0].x);
    }
    return n === undefined ? aus[0] : aus;
  }

  KERN.auswertung = { TAG_MS, WOCHENTAGE, mittel, median, korrelation, sitzungen, lernzeiten, wochenStart, wochen, stand, bedarf, ziehe };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
