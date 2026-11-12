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
  const wochenStart = zeit => KERN.auswertung.wochenStart(zeit);

  /**
   * Wochenziel eines Kindes: { plan, wochen, aktuelle, serie, sterne }.
   * plan: { tage, minuten } oder null (kein Ziel gesetzt). Ein Tag ist erfüllt, wenn die Runden des Tages zusammen
   * die Minuten erreichen (ohne Plan: wenn gespielt wurde). Eine Woche ist erfüllt, wenn genug Tage erfüllt sind;
   * jede erfüllte Woche gibt einen Wochenstern 🌟, unabhängig von Fehlern und Tempo (Dranbleiben zählt).
   * serie: erfüllte Wochen in Folge bis heute (die laufende Woche zählt, sobald sie erfüllt ist, und bricht
   * die Serie nicht, solange sie läuft). wochen: alle seit der ersten Runde, mindestens eine, älteste zuerst.
   */
  // Wochen, erfüllte Tage und Serie rechnet der Kern (KERN.auswertung.wochen, AW1 a) — dieselbe Rechnung wie die
  // Wochenserie des Lernsteigs; hier nur der Lernplan des Kindes und die Gefahr für die Serie.
  function lernplan(profil, runden, jetzt = Date.now()) {
    const plan = profil?.lernplan && profil.lernplan.tage > 0 ? { ...LERNPLAN_VORGABE, ...profil.lernplan } : null;
    const w = KERN.auswertung.wochen(runden.filter(e => !e.test), plan, jetzt);
    return { plan, wochen: w.wochen, aktuelle: w.aktuelle, serie: w.serie, sterne: w.erfuellt, gefahr: gefahr(plan, w.aktuelle, w.serie) };
  }
  /**
   * Droht die Serie zu brechen? (Wunsch Patrik, LERN_Session11.) Nur mit Plan, laufender Serie aus den Vorwochen und
   * noch nicht erfüllter Woche: { fehlt (Tage), bleiben (Tage ab heute, die noch zählen können), knapp, verloren }.
   * knapp: es reicht nur noch, wenn an jedem verbleibenden Tag geübt wird; verloren: es reicht nicht mehr. Sonst null.
   */
  function gefahr(plan, woche, serie) {
    if (!plan || !serie || woche.erfuellt) return null;
    const fehlt = plan.tage - woche.erfuellteTage;
    const bleiben = woche.tage.filter(t => !t.erfuellt && (t.heute || t.zukunft)).length;
    if (fehlt < bleiben) return null;
    return { fehlt, bleiben, knapp: fehlt === bleiben, verloren: fehlt > bleiben };
  }

  // ---------- Abzeichen ----------
  // Jedes Abzeichen hat Stufen (Wunsch Patrik, LERN_Session11): Bronze, Silber, Gold, Platin, Diamant, je Abzeichen mit
  // eigener Abstufung (stufen: die Mengen, z. B. 1, 10, 50, 100, 500 Runden). Felder: id, bild, titel, text(n) (was
  // Stufe n braucht), stufen, pruefe(k, n) → { ist, soll: n, wann }: ist/soll der Fortschritt, wann die Zeit (ISO) der
  // Runde, mit der die Menge n erreicht wurde, sonst null. k = { runden (echte Runden des Kindes, zeitlich sortiert,
  // mit Mix), rekorde, profil, plan (lernplan-Ergebnis), fehler (gefundene Fehler), fehlerWann, fachVon(spielId) }.
  const RAENGE = [
    { id: "bronze", name: "Bronze", zeichen: "🥉" },
    { id: "silber", name: "Silber", zeichen: "🥈" },
    { id: "gold", name: "Gold", zeichen: "🥇" },
    { id: "platin", name: "Platin", zeichen: "🏆" },
    { id: "diamant", name: "Diamant", zeichen: "💎" },
  ];
  const nte = (liste, n) => (liste.length >= n ? liste[n - 1].zeit : null);
  const zaehler = (liste, soll) => ({ ist: Math.min(liste.length, soll), soll, wann: nte(liste, soll) });
  const anhieb = e => e.aufgaben > 0 && !KERN.runde.mitFehler(e).length && !e.tipps;
  const dreiSterne = e => e.sterne === 3;
  /** Spiele, in denen alle sechs Stufen gespielt (bzw. mit 3 Sternen) sind: Zeit der Runde, die das Set vollendet. */
  function alleStufen(runden, nurDrei) {
    const je = {};
    for (const e of runden) {
      if (e.mix || (nurDrei && !dreiSterne(e))) continue;
      const s = (je[e.inhalt] ||= {});
      if (!s[e.stufe]) s[e.stufe] = e.zeit;
    }
    const fertig = Object.values(je).filter(s => Object.keys(s).length >= 6).map(s => Object.values(s).sort().pop()).sort();
    return fertig;
  }
  /** Liste von Zeiten (ISO, aufsteigend): Fortschritt zur Menge n. */
  const zeiten = (liste, n) => ({ ist: Math.min(liste.length, n), soll: n, wann: liste[n - 1] || null });
  /** Mehrzahl im Text: eine Runde, 10 Runden. */
  const mal = (n, eins, viele) => (n === 1 ? eins : `${n} ${viele}`);
  const ABZEICHEN = [
    { id: "runden", bild: "🎒", titel: "Fleissig", stufen: [1, 10, 50, 100, 500],
      text: n => `${mal(n, "Eine Runde", "Runden")} zu Ende gespielt.`, pruefe: (k, n) => zaehler(k.runden, n) },
    { id: "drei-sterne", bild: "⭐", titel: "Sternensammler", stufen: [1, 10, 25, 100, 250],
      text: n => `${mal(n, "Eine Runde", "Runden")} mit drei Sternen.`, pruefe: (k, n) => zaehler(k.runden.filter(dreiSterne), n) },
    { id: "perfekt", bild: "🎯", titel: "Perfekt!", stufen: [1, 5, 25, 50, 100],
      text: n => `${mal(n, "Eine Runde", "Runden")} ohne Fehler und ohne Tipp.`, pruefe: (k, n) => zaehler(k.runden.filter(e => anhieb(e) && e.aufgaben >= 5), n) },
    { id: "ohne-tipp", bild: "🧠", titel: "Aus eigener Kraft", stufen: [10, 25, 50, 100, 250],
      text: n => `${n} Runden ohne Tipp und mit mindestens zwei Sternen.`, pruefe: (k, n) => zaehler(k.runden.filter(e => !e.tipps && e.sterne >= 2), n) },
    { id: "koenigsstufe", bild: "👑", titel: "Königsstufe", stufen: [1, 5, 10, 25, 50],
      text: n => `${mal(n, "Eine Königsstufe", "Königsstufen")} mit mindestens zwei Sternen.`, pruefe: (k, n) => zaehler(k.runden.filter(e => e.stufe === "s6" && e.sterne >= 2), n) },
    { id: "alle-stufen", bild: "🪜", titel: "Alle sechs Stufen", stufen: [1, 3, 10, 25, 50],
      text: n => `In ${mal(n, "einem Spiel", "Spielen")} alle sechs Stufen gespielt.`, pruefe: (k, n) => zeiten(alleStufen(k.runden, false), n) },
    { id: "meister", bild: "🎓", titel: "Spiel-Meister", stufen: [1, 3, 5, 10, 25],
      text: n => `In ${mal(n, "einem Spiel", "Spielen")} alle sechs Stufen mit drei Sternen.`, pruefe: (k, n) => zeiten(alleStufen(k.runden, true), n) },
    { id: "entdecker", bild: "🧭", titel: "Entdecker", stufen: [10, 25, 50, 100, 150],
      text: n => `${n} verschiedene Spiele gespielt.`, pruefe: (k, n) => verschiedene(k.runden, e => e.inhalt, n) },
    { id: "vielseitig", bild: "🎨", titel: "Vielseitig", stufen: [2, 3, 4, 5, 7],
      text: n => `Spiele aus ${n} verschiedenen Fächern gespielt.`, pruefe: (k, n) => verschiedene(k.runden, e => k.fachVon(e.inhalt), n) },
    { id: "mathe-ass", bild: "🔢", titel: "Mathe-Ass", stufen: [10, 25, 50, 100, 250],
      text: n => `${n} Mathe-Runden mit drei Sternen.`, pruefe: (k, n) => zaehler(k.runden.filter(e => dreiSterne(e) && k.fachVon(e.inhalt) === "Mathe"), n) },
    { id: "deutsch-ass", bild: "📚", titel: "Deutsch-Ass", stufen: [10, 25, 50, 100, 250],
      text: n => `${n} Deutsch-Runden mit drei Sternen.`, pruefe: (k, n) => zaehler(k.runden.filter(e => dreiSterne(e) && k.fachVon(e.inhalt) === "Deutsch"), n) },
    { id: "forscher", bild: "🔬", titel: "Forscherin, Forscher", stufen: [10, 25, 50, 100, 250],
      text: n => `${n} NMG-Runden mit drei Sternen.`, pruefe: (k, n) => zaehler(k.runden.filter(e => dreiSterne(e) && k.fachVon(e.inhalt) === "NMG"), n) },
    { id: "sprachtalent", bild: "🗣️", titel: "Sprachtalent", stufen: [10, 25, 50, 100, 250],
      text: n => `${n} Runden Englisch oder Französisch mit drei Sternen.`, pruefe: (k, n) => zaehler(k.runden.filter(e => dreiSterne(e) && ["Englisch", "Französisch"].includes(k.fachVon(e.inhalt))), n) },
    { id: "endlos", bild: "♾️", titel: "Endlos-Läufer", stufen: [10, 20, 30, 50, 100],
      text: n => `${n} Aufgaben am Stück im Endlos-Modus.`, pruefe: (k, n) => endlosBis(k.rekorde, n) },
    { id: "mix", bild: "🎲", titel: "Mix-Meister", stufen: [5, 10, 25, 50, 100],
      text: n => `${n} Runden im Zufallsmix gespielt.`, pruefe: (k, n) => zeiten([...new Set(k.runden.filter(e => e.mix).map(e => e.zeit))].sort(), n) },
    { id: "wochenstern", bild: "🌟", titel: "Wochenstern", stufen: [1, 4, 10, 25, 52],
      text: n => (n === 1 ? "Das Wochenziel des Lernplans einmal erreicht." : `Das Wochenziel des Lernplans ${n}-mal erreicht.`), pruefe: (k, n) => wochen(k.plan, n, k.runden) },
    { id: "dranbleiber", bild: "📅", titel: "Dranbleiber", stufen: [2, 4, 8, 12, 26],
      text: n => `Das Wochenziel ${n} Wochen in Folge erreicht.`, pruefe: (k, n) => serieBis(k.plan, n, k.runden) },
    { id: "fehlerfinder", bild: "🏅", titel: "Fehlerfinder", stufen: [1, 3, 5, 10, 25],
      text: n => (n === 1 ? "Einen echten Fehler im Programm gemeldet, den die Entwicklung behoben hat."
        : `${n} echte Fehler im Programm gemeldet, die die Entwicklung behoben hat.`),
      pruefe: (k, n) => ({ ist: Math.min(k.fehler, n), soll: n, wann: k.fehler >= n ? k.fehlerWann : null }) },
    { id: "fruehaufsteher", bild: "🌅", titel: "Frühaufsteher", stufen: [5, 10, 25, 50, 100],
      text: n => `${n} Runden vor 8 Uhr morgens gespielt.`, pruefe: (k, n) => zaehler(k.runden.filter(e => new Date(e.zeit).getHours() < 8), n) },
    // Probe-Stempel (Wunsch Patrik, LERN_Session13): Passt die Endziffer, wäre „nicht sicher“ richtig — wer nachrechnet und
    // sicher stempelt, bekommt dafür ein Abzeichen statt mehr Sterne
    { id: "nachgerechnet", bild: "🔎", titel: "Ganz sicher", stufen: [5, 10, 25, 50, 100],
      text: n => `${n}-mal bei passender Endziffer nachgerechnet und sicher gestempelt.`,
      pruefe: (k, n) => zaehler(k.runden.flatMap(e => (e.liste || []).filter(a => a.vorgehen?.endprobe === "nachgerechnet" && !a.versuche)
        .map(() => ({ zeit: e.zeit }))), n) },
    // NZ1 a mit Zusatz Patrik (LERN_Session13): Aufgaben mit Notizfeldern im Kopf und auf Anhieb gelöst
    { id: "kopfrechner", bild: "🧠", titel: "Kopfrechner", stufen: [10, 25, 50, 100, 250],
      text: n => `${n} Aufgaben mit mehreren Rechenschritten ganz im Kopf gelöst — die Notizen blieben leer.`,
      pruefe: (k, n) => zaehler(k.runden.flatMap(e => (e.liste || [])
        .filter(a => a.vorgehen?.notiz === "ohne" && KERN.runde.aufAnhieb(a)).map(() => ({ zeit: e.zeit }))), n) },
    // Klassenaufstieg durch die Aufsicht (Wunsch Patrik, LERN_Session14): je Schuljahr eine Stufe, aus Profil aufstiege
    { id: "aufgestiegen", bild: "🏫", titel: "Aufgestiegen", stufen: [1, 2, 3, 4, 5],
      text: n => (n === 1 ? "In die nächste Klasse aufgestiegen." : `${n}-mal in die nächste Klasse aufgestiegen.`),
      pruefe: (k, n) => zeiten((k.profil?.aufstiege || []).map(a => a.zeit).sort(), n) },
  ];
  // Frühere Abzeichen (LERN_Session10, ohne Stufen) → Abzeichen und Stufe heute, damit Gesehenes gesehen bleibt.
  const FRUEHER = { "erste-runde": "runden:1", "zehn-runden": "runden:2", "fuenfzig-runden": "runden:3", "hundert-runden": "runden:4",
    "drei-sterne": "drei-sterne:1", "sternensammler": "drei-sterne:3", "weltreisender": "entdecker:3", "vielseitig": "vielseitig:3",
    "endlos": "endlos:2", "dranbleiber": "dranbleiber:2" };
  /** Bestwert im Endlos-Modus bis zur Menge n; erreicht mit dem ersten Rekord, der n schafft. */
  function endlosBis(rekorde, n) {
    const best = Math.max(0, ...rekorde.map(r => r.punkte || 0));
    const erster = rekorde.filter(r => (r.punkte || 0) >= n).map(r => r.zeit).sort()[0] || null;
    return { ist: Math.min(best, n), soll: n, wann: erster };
  }
  /** Längste Serie erfüllter Wochen bis n; erreicht am Sonntag der Woche, die die Serie auf n bringt. */
  /**
   * Zeit (ISO) der Runde, mit der die Woche w ihr Ziel erreicht hat — wie bei den übrigen Abzeichen die Runde, mit der
   * die Menge erreicht war: der Tag, mit dem genug Tage erfüllt waren, und darin die Runde, mit der seine Minuten
   * erreicht waren. Vorher galt der Sonntag der Woche; in der laufenden Woche stand dann ein Datum, das noch kommt
   * (LERN_Session33). runden: zeitlich sortiert (k.runden). Ohne passende Runde der Beginn jenes Tages.
   */
  function erfuelltAm(w, plan, runden) {
    const ziel = plan.plan;
    const tag = ziel && w.tage.filter(t => t.erfuellt)[ziel.tage - 1];
    if (!tag) return null;
    let minuten = 0;
    for (const e of runden) {
      if (new Date(e.zeit).toDateString() !== tag.datum.toDateString()) continue;
      minuten += (e.dauer || 0) / 60;
      if (!(ziel.minuten > 0) || minuten >= ziel.minuten) return e.zeit;
    }
    return tag.datum.toISOString();
  }

  function serieBis(plan, n, runden = []) {
    let lauf = 0, laengste = 0, wann = null;
    for (const w of plan.wochen) {
      if (w.erfuellt) { lauf++; if (lauf === n && !wann) wann = erfuelltAm(w, plan, runden); }
      else if (!w.laufend) lauf = 0;
      laengste = Math.max(laengste, lauf);
    }
    return { ist: Math.min(laengste, n), soll: n, wann };
  }
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
  function wochen(plan, soll, runden = []) {
    const erfuellte = plan.wochen.filter(w => w.erfuellt);
    const w = erfuellte[soll - 1];
    return { ist: Math.min(erfuellte.length, soll), soll, wann: w ? erfuelltAm(w, plan, runden) : null };
  }

  /**
   * Alle Abzeichen eines Kindes: [{ id, bild, titel, rang, stufe, stufen, text, ist, soll, erreicht, neu, schluessel, naechste }].
   * stufe: wie viele Stufen erreicht (0 = noch keine); rang: RAENGE[stufe - 1] oder null; text, erreicht (ISO): die
   * erreichte Stufe, sonst die erste. naechste: { rang, text, ist, soll } der nächsten Stufe oder null (Diamant).
   * neu: die erreichte Stufe steht noch nicht im Profil erfolgeGesehen (schluessel = "<id>:<stufe>").
   * runden: LS.protokoll() dieses Kindes; rekorde: LS.rekorde().
   */
  function abzeichen(name, profil, runden, rekorde, fehler = 0, fehlerWann = null, jetzt = Date.now()) {
    const echte = runden.filter(e => e.name === name && !e.test).sort((a, b) => a.zeit.localeCompare(b.zeit));
    const fachVon = id => (typeof SPIELE !== "undefined" && typeof THEMEN !== "undefined"
      ? THEMEN.find(t => t.id === SPIELE.find(s => s.id === id)?.thema)?.fach : null);
    const k = { runden: echte, rekorde: rekorde.filter(r => r.name === name && !r.test), profil, plan: lernplan(profil, echte, jetzt), fehler, fehlerWann, fachVon };
    const gesehen = new Set((profil?.erfolgeGesehen || []).map(s => FRUEHER[s] || s));
    // Gesehen gilt auch für tiefere Stufen: wer Gold gesehen hat, sieht Silber nicht nochmals als neu.
    const gesehenBis = id => Math.max(0, ...[...gesehen].filter(s => s.startsWith(`${id}:`)).map(s => Number(s.split(":")[1])));
    return ABZEICHEN.map(a => {
      const je = a.stufen.map(n => a.pruefe(k, n));
      const stufe = je.filter(f => f.ist >= f.soll).length;
      const jetztF = je[Math.max(0, stufe - 1)];
      const erreicht = stufe ? jetztF.wann || new Date(jetzt).toISOString() : null;
      const nf = je[stufe];
      const naechste = nf ? { rang: RAENGE[stufe], text: a.text(a.stufen[stufe]), ist: nf.ist, soll: nf.soll } : null;
      return { id: a.id, bild: a.bild, titel: a.titel, rang: stufe ? RAENGE[stufe - 1] : null, stufe, stufen: a.stufen.length,
        text: a.text(a.stufen[Math.max(0, stufe - 1)]), ist: jetztF.ist, soll: jetztF.soll, erreicht,
        neu: stufe > 0 && gesehenBis(a.id) < stufe, schluessel: `${a.id}:${stufe}`, naechste };
    });
  }
  /** Titel mit Stufe: „Fleissig · 🥇 Gold“. */
  const titelMitRang = a => (a.rang ? `${a.titel} · ${a.rang.zeichen} ${a.rang.name}` : a.titel);

  /**
   * Was die Abzeichen für den Avatar freischalten (Entscheide AV5 a, AV6 a, LERN_Session12): das Symbol jedes
   * Abzeichens ab Gold (Kennung „abz-<id>“ in avatare.js) und je einen Rahmen ab dem ersten Abzeichen in Gold, Platin,
   * Diamant. liste: Ergebnis von abzeichen(). Schlüssel „motiv:<id>“ und „rahmen:<id>“ (für „neu freigeschaltet“).
   */
  function freischaltungen(liste) {
    const GOLD = RAENGE.findIndex(r => r.id === "gold") + 1;
    const motive = liste.filter(a => a.stufe >= GOLD).map(a => ({ id: `abz-${a.id}`, titel: a.titel, schluessel: `motiv:abz-${a.id}` }));
    const hoechste = liste.reduce((m, a) => Math.max(m, a.stufe), 0);
    const rahmen = RAENGE.slice(GOLD - 1).filter((r, i) => hoechste >= GOLD + i).map(r => ({ id: r.id, titel: r.name, schluessel: `rahmen:${r.id}` }));
    return { motive, rahmen, schluessel: [...motive, ...rahmen].map(x => x.schluessel) };
  }

  return { LERNPLAN_VORGABE, LERNPLAN_TAGE, LERNPLAN_MINUTEN, WOCHENTAGE, wochenStart, lernplan, RAENGE, ABZEICHEN, abzeichen, titelMitRang, freischaltungen };
})();
