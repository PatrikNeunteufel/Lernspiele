/* Erfolge (Entscheid L1 a und Wunsch Patrik, LERN_Session10): Lernplan mit Wochenziel und Abzeichen.
   Alles wird aus dem Protokoll (LS.protokoll), den Endlos-Rekorden (LS.rekorde) und den Meldungen berechnet;
   gespeichert wird nur der Lernplan im Profil (lernplan: { tage, minuten }, gesetzt von der Aufsicht) und
   welche Abzeichen das Kind schon gesehen hat (Profil erfolgeGesehen: [ids]). Beschreibung: rahmen.md Abschnitt 15. */
const ERFOLGE = (() => {
  "use strict";

  const TAG_MS = 24 * 3600 * 1000;
  const WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  /** Vorgabe, wenn die Aufsicht einen Lernplan einschaltet, ohne Zahlen zu wählen. */
  const LERNPLAN_VORGABE = { tage: 3, minuten: 10 };
  const LERNPLAN_TAGE = [1, 2, 3, 4, 5, 6, 7];
  const LERNPLAN_MINUTEN = [5, 10, 15, 20, 30];

  /** Montag 0:00 der Woche, in der `zeit` liegt (lokale Zeit). */
  function wochenStart(zeit) {
    const d = new Date(zeit);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
  }
  const tageSpaeter = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  /**
   * Wochenziel eines Kindes: { plan, wochen, aktuelle, serie, sterne }.
   * plan: { tage, minuten } oder null (kein Ziel gesetzt). Ein Tag ist erfüllt, wenn die Runden des Tages zusammen
   * die Minuten erreichen (ohne Plan: wenn gespielt wurde). Eine Woche ist erfüllt, wenn genug Tage erfüllt sind;
   * jede erfüllte Woche gibt einen Wochenstern 🌟, unabhängig von Fehlern und Tempo (Dranbleiben zählt).
   * serie: erfüllte Wochen in Folge bis heute (die laufende Woche zählt, sobald sie erfüllt ist, und bricht
   * die Serie nicht, solange sie läuft). wochen: alle seit der ersten Runde, mindestens eine, älteste zuerst.
   */
  function lernplan(profil, runden, jetzt = Date.now()) {
    const plan = profil?.lernplan && profil.lernplan.tage > 0 ? { ...LERNPLAN_VORGABE, ...profil.lernplan } : null;
    const echte = runden.filter(e => !e.test);
    const start = wochenStart(jetzt);
    const erste = echte.length ? wochenStart(Math.min(...echte.map(e => Date.parse(e.zeit)))) : start;
    const wochen = [];
    for (let von = erste; von <= start; von = tageSpaeter(von, 7)) {
      const bis = tageSpaeter(von, 7);
      const tage = WOCHENTAGE.map((name, i) => ({ name, datum: tageSpaeter(von, i), minuten: 0, runden: 0, heute: false, zukunft: false }));
      for (const t of tage) { t.heute = t.datum.toDateString() === new Date(jetzt).toDateString(); t.zukunft = t.datum > jetzt && !t.heute; }
      for (const e of echte) {
        const z = new Date(e.zeit);
        if (z < von || z >= bis) continue;
        const t = tage[(z.getDay() + 6) % 7];
        t.minuten += (e.dauer || 0) / 60;
        t.runden++;
      }
      for (const t of tage) t.erfuellt = plan ? t.minuten >= plan.minuten : t.runden > 0;
      const erfuellteTage = tage.filter(t => t.erfuellt).length;
      wochen.push({ von, bis, tage, erfuellteTage, erfuellt: !!plan && erfuellteTage >= plan.tage, laufend: von.getTime() === start.getTime() });
    }
    let serie = 0;
    for (let i = wochen.length - 1; i >= 0; i--) {
      if (wochen[i].erfuellt) serie++;
      else if (!wochen[i].laufend) break;
    }
    return { plan, wochen, aktuelle: wochen[wochen.length - 1], serie, sterne: wochen.filter(w => w.erfuellt).length };
  }

  // ---------- Abzeichen ----------
  // Jedes Abzeichen: id, bild, titel, text (was es braucht), pruefe(k) → { ist, soll, wann }: ist/soll der Fortschritt,
  // wann die Zeit (ISO) der Runde, mit der es erreicht wurde, sonst null. k = { runden (echte Runden des Kindes,
  // zeitlich sortiert, mit Mix), rekorde, profil, plan (lernplan-Ergebnis), fehler (gefundene Fehler), fachVon(spielId) }.
  const nte = (liste, n) => (liste.length >= n ? liste[n - 1].zeit : null);
  const zaehler = (liste, soll) => ({ ist: Math.min(liste.length, soll), soll, wann: nte(liste, soll) });
  const anhieb = e => e.aufgaben > 0 && !e.fehlerAufgaben?.length && !e.tipps;
  const dreiSterne = e => e.sterne === 3;
  /** Spiele, in denen alle sechs Stufen gespielt (bzw. mit 3 Sternen) sind: Zeit der Runde, die das Set vollendet. */
  function alleStufen(runden, nurDrei) {
    const je = {};
    for (const e of runden) {
      if (e.mix || (nurDrei && !dreiSterne(e))) continue;
      const s = (je[e.spiel] ||= {});
      if (!s[e.stufe]) s[e.stufe] = e.zeit;
    }
    const fertig = Object.values(je).filter(s => Object.keys(s).length >= 6).map(s => Object.values(s).sort().pop()).sort();
    return fertig;
  }
  const ABZEICHEN = [
    { id: "erste-runde", bild: "🐣", titel: "Erste Runde", text: "Eine Runde zu Ende gespielt.", pruefe: k => zaehler(k.runden, 1) },
    { id: "zehn-runden", bild: "🎒", titel: "Zehn Runden", text: "10 Runden gespielt.", pruefe: k => zaehler(k.runden, 10) },
    { id: "fuenfzig-runden", bild: "🏃", titel: "Fünfzig Runden", text: "50 Runden gespielt.", pruefe: k => zaehler(k.runden, 50) },
    { id: "hundert-runden", bild: "💯", titel: "Hundert Runden", text: "100 Runden gespielt.", pruefe: k => zaehler(k.runden, 100) },
    { id: "drei-sterne", bild: "⭐", titel: "Drei Sterne", text: "Eine Runde mit drei Sternen.", pruefe: k => zaehler(k.runden.filter(dreiSterne), 1) },
    { id: "sternensammler", bild: "🌠", titel: "Sternensammler", text: "25 Runden mit drei Sternen.", pruefe: k => zaehler(k.runden.filter(dreiSterne), 25) },
    { id: "perfekt", bild: "🏆", titel: "Perfekt!", text: "Eine Runde ohne Fehler und ohne Tipp.", pruefe: k => zaehler(k.runden.filter(e => anhieb(e) && e.aufgaben >= 5), 1) },
    { id: "ohne-tipp", bild: "🧠", titel: "Aus eigener Kraft", text: "10 Runden ohne Tipp und mit mindestens zwei Sternen.", pruefe: k => zaehler(k.runden.filter(e => !e.tipps && e.sterne >= 2), 10) },
    { id: "koenigsstufe", bild: "👑", titel: "Königsstufe", text: "Eine Königsstufe mit mindestens zwei Sternen.", pruefe: k => zaehler(k.runden.filter(e => e.stufe === "s6" && e.sterne >= 2), 1) },
    { id: "alle-stufen", bild: "🪜", titel: "Alle sechs Stufen", text: "In einem Spiel alle sechs Stufen gespielt.", pruefe: k => { const f = alleStufen(k.runden, false); return { ist: Math.min(f.length, 1), soll: 1, wann: f[0] || null }; } },
    { id: "meister", bild: "🎓", titel: "Spiel-Meister", text: "In einem Spiel alle sechs Stufen mit drei Sternen.", pruefe: k => { const f = alleStufen(k.runden, true); return { ist: Math.min(f.length, 1), soll: 1, wann: f[0] || null }; } },
    { id: "entdecker", bild: "🧭", titel: "Entdecker", text: "10 verschiedene Spiele gespielt.", pruefe: k => verschiedene(k.runden, e => e.spiel, 10) },
    { id: "weltreisender", bild: "🌍", titel: "Weltreisender", text: "50 verschiedene Spiele gespielt.", pruefe: k => verschiedene(k.runden, e => e.spiel, 50) },
    { id: "vielseitig", bild: "🎨", titel: "Vielseitig", text: "Spiele aus vier verschiedenen Fächern gespielt.", pruefe: k => verschiedene(k.runden, e => k.fachVon(e.spiel), 4) },
    { id: "mathe-ass", bild: "🔢", titel: "Mathe-Ass", text: "10 Mathe-Runden mit drei Sternen.", pruefe: k => zaehler(k.runden.filter(e => dreiSterne(e) && k.fachVon(e.spiel) === "Mathe"), 10) },
    { id: "deutsch-ass", bild: "📚", titel: "Deutsch-Ass", text: "10 Deutsch-Runden mit drei Sternen.", pruefe: k => zaehler(k.runden.filter(e => dreiSterne(e) && k.fachVon(e.spiel) === "Deutsch"), 10) },
    { id: "forscher", bild: "🔬", titel: "Forscherin, Forscher", text: "10 NMG-Runden mit drei Sternen.", pruefe: k => zaehler(k.runden.filter(e => dreiSterne(e) && k.fachVon(e.spiel) === "NMG"), 10) },
    { id: "sprachtalent", bild: "🗣️", titel: "Sprachtalent", text: "10 Runden Englisch oder Französisch mit drei Sternen.", pruefe: k => zaehler(k.runden.filter(e => dreiSterne(e) && ["Englisch", "Französisch"].includes(k.fachVon(e.spiel))), 10) },
    { id: "endlos", bild: "♾️", titel: "Endlos-Läufer", text: "20 Aufgaben am Stück im Endlos-Modus.", pruefe: k => zaehler(k.rekorde.filter(r => (r.punkte || 0) >= 20), 1) },
    { id: "mix", bild: "🎲", titel: "Mix-Meister", text: "5 Runden im Zufallsmix gespielt.", pruefe: k => { const m = [...new Set(k.runden.filter(e => e.mix).map(e => e.zeit))].sort(); return { ist: Math.min(m.length, 5), soll: 5, wann: m[4] || null }; } },
    { id: "wochenstern", bild: "🌟", titel: "Wochenstern", text: "Das Wochenziel des Lernplans einmal erreicht.", pruefe: k => wochen(k.plan, 1) },
    { id: "dranbleiber", bild: "📅", titel: "Dranbleiber", text: "Das Wochenziel vier Wochen in Folge erreicht.", pruefe: k => ({ ist: Math.min(k.plan.serie, 4), soll: 4, wann: k.plan.serie >= 4 ? wochenEnde(k.plan) : null }) },
    { id: "fehlerfinder", bild: "🏅", titel: "Fehlerfinder", text: "Einen echten Fehler im Programm gemeldet, den die Entwicklung behoben hat.", pruefe: k => ({ ist: Math.min(k.fehler, 1), soll: 1, wann: k.fehler ? k.fehlerWann : null }) },
    { id: "fruehaufsteher", bild: "🌅", titel: "Frühaufsteher", text: "5 Runden vor 8 Uhr morgens gespielt.", pruefe: k => zaehler(k.runden.filter(e => new Date(e.zeit).getHours() < 8), 5) },
  ];
  function verschiedene(runden, schluessel, soll) {
    const gesehen = new Set();
    let wann = null;
    for (const e of runden) {
      const s = schluessel(e);
      if (!s || gesehen.has(s)) continue;
      gesehen.add(s);
      if (gesehen.size === soll) wann = e.zeit;
    }
    return { ist: Math.min(gesehen.size, soll), soll, wann };
  }
  function wochen(plan, soll) {
    const erfuellte = plan.wochen.filter(w => w.erfuellt);
    const w = erfuellte[soll - 1];
    return { ist: Math.min(erfuellte.length, soll), soll, wann: w ? tageSpaeter(w.von, 6).toISOString() : null };
  }
  const wochenEnde = plan => tageSpaeter(plan.aktuelle.von, 6).toISOString();

  /**
   * Alle Abzeichen eines Kindes: [{ id, bild, titel, text, ist, soll, erreicht (ISO oder null), neu }].
   * neu: erreicht, aber noch nicht im Profil erfolgeGesehen. runden: LS.protokoll() dieses Kindes; rekorde: LS.rekorde().
   */
  function abzeichen(name, profil, runden, rekorde, fehler = 0, fehlerWann = null, jetzt = Date.now()) {
    const echte = runden.filter(e => e.name === name && !e.test).sort((a, b) => a.zeit.localeCompare(b.zeit));
    const fachVon = id => (typeof SPIELE !== "undefined" && typeof THEMEN !== "undefined"
      ? THEMEN.find(t => t.id === SPIELE.find(s => s.id === id)?.thema)?.fach : null);
    const k = { runden: echte, rekorde: rekorde.filter(r => r.name === name && !r.test), profil, plan: lernplan(profil, echte, jetzt), fehler, fehlerWann, fachVon };
    const gesehen = new Set(profil?.erfolgeGesehen || []);
    return ABZEICHEN.map(a => {
      const f = a.pruefe(k);
      const erreicht = f.ist >= f.soll ? f.wann || new Date(jetzt).toISOString() : null;
      return { id: a.id, bild: a.bild, titel: a.titel, text: a.text, ist: f.ist, soll: f.soll, erreicht, neu: !!erreicht && !gesehen.has(a.id) };
    });
  }

  return { LERNPLAN_VORGABE, LERNPLAN_TAGE, LERNPLAN_MINUTEN, WOCHENTAGE, wochenStart, lernplan, ABZEICHEN, abzeichen };
})();
