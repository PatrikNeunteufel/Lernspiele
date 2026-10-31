/* Didaktische Auswertung des Protokolls — reine Rechenfunktionen ohne Darstellung.
   Braucht spiel.js (LS) und katalog.js (SPIELE, LERNZIELE) davor.
   Eingabe sind Protokolleinträge eines Kindes (siehe spiel.js, Abschnitt Protokoll). */

const AUSWERTUNG = (() => {
  "use strict";

  const TAG_MS = 24 * 3600 * 1000;
  const SITZUNGS_PAUSE_MIN = 20;   // mehr Pause zwischen zwei Runden = neue Sitzung
  const QUOTE_UEBEN = 0.7;         // unter diesem Anteil „auf Anhieb richtig“ gilt ein Lernziel als „üben“

  const anhieb = e => (e.aufgaben - e.fehlerAufgaben.length) / e.aufgaben;
  const mittel = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
  const median = xs => { if (!xs.length) return null; const a = [...xs].sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
  const spielVon = id => SPIELE.find(s => s.id === id);
  const stufeNr = id => Number(String(id).slice(1));

  /** Runden zu einem Lernziel (Spiel + zugeordnete Stufen). */
  function rundenZuLernziel(runden, lz) {
    const zuordnung = SPIELE.flatMap(s => s.lernziele.filter(l => l.lz === lz).map(l => ({ spiel: s.id, stufen: l.stufen })));
    return runden.filter(e => zuordnung.some(z => z.spiel === e.spiel && z.stufen.includes(e.stufe)));
  }

  /** Runden zu Sitzungen gruppieren: Lücke > 20 min zwischen Ende und nächstem Ende = neue Sitzung. */
  function sitzungen(runden) {
    const sortiert = [...runden].sort((a, b) => a.zeit.localeCompare(b.zeit));
    const ergebnis = [];
    let letzte = null;
    for (const e of sortiert) {
      const t = Date.parse(e.zeit);
      if (!letzte || t - letzte > SITZUNGS_PAUSE_MIN * 60000 + (e.dauer || 0) * 1000) ergebnis.push([]);
      ergebnis[ergebnis.length - 1].push(e);
      letzte = t;
    }
    return ergebnis;
  }

  /** Wann wird gelernt: Minuten je Wochentag (Mo–So), je Tageszeit-Fenster und je Tag der letzten 14 Tage. */
  function lernzeiten(runden, jetzt = Date.now()) {
    const wochentage = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(t => ({ name: t, minuten: 0, runden: 0 }));
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

  /**
   * Konzentration: Zeit je Aufgabe im Verhältnis zur eigenen üblichen Zeit für dasselbe Spiel und
   * dieselbe Stufe (1.0 = wie üblich, 1.3 = 30 % langsamer), und Fehlerquote —
   * a) nach Position der Aufgabe in der Runde, b) nach Nummer der Runde in der Sitzung.
   */
  function konzentration(runden) {
    const mitZeiten = runden.filter(e => Array.isArray(e.aufgabenZeiten) && e.aufgabenZeiten.length);
    const ueblich = {};
    for (const e of mitZeiten) {
      const k = `${e.spiel}|${e.stufe}`;
      (ueblich[k] = ueblich[k] || []).push(...e.aufgabenZeiten.map(a => a.ms));
    }
    for (const k of Object.keys(ueblich)) ueblich[k] = median(ueblich[k]);

    const nachPosition = [];
    for (const e of mitZeiten) {
      const basis = ueblich[`${e.spiel}|${e.stufe}`] || 1;
      e.aufgabenZeiten.forEach((a, i) => {
        const p = (nachPosition[i] = nachPosition[i] || { pos: i + 1, verhaeltnis: [], fehler: [] });
        p.verhaeltnis.push(a.ms / basis);
        p.fehler.push(a.versuche > 0 || a.zeitUm ? 1 : 0);
      });
    }

    const nachRunde = [];
    for (const s of sitzungen(mitZeiten)) {
      s.forEach((e, i) => {
        const basis = ueblich[`${e.spiel}|${e.stufe}`] || 1;
        const idx = Math.min(i, 3); // 1., 2., 3., 4.+ Runde
        const r = (nachRunde[idx] = nachRunde[idx] || { runde: idx === 3 ? "4.+" : `${idx + 1}.`, verhaeltnis: [], anhieb: [] });
        r.verhaeltnis.push(median(e.aufgabenZeiten.map(a => a.ms)) / basis);
        r.anhieb.push(anhieb(e));
      });
    }

    const pos = nachPosition.filter(Boolean).map(p => ({ pos: p.pos, zeit: mittel(p.verhaeltnis), fehler: mittel(p.fehler), n: p.fehler.length }));
    const rnd = nachRunde.filter(Boolean).map(r => ({ runde: r.runde, zeit: mittel(r.verhaeltnis), anhieb: mittel(r.anhieb), n: r.anhieb.length }));

    // Befund: letztes Drittel der Runde gegen erstes Drittel; spätere Runden der Sitzung gegen die erste.
    const drittel = Math.max(1, Math.floor(pos.length / 3));
    const vorne = pos.slice(0, drittel), hinten = pos.slice(-drittel);
    const befunde = [];
    const genug = mitZeiten.length >= 3;
    if (genug && pos.length >= 6) {
      const dz = mittel(hinten.map(p => p.zeit)) / mittel(vorne.map(p => p.zeit));
      const df = mittel(hinten.map(p => p.fehler)) - mittel(vorne.map(p => p.fehler));
      if (dz > 1.25 || df > 0.15) befunde.push({ art: "runde", text: `Gegen Ende einer Runde ${dz > 1.25 ? `wird es langsamer (${Math.round((dz - 1) * 100)} % mehr Zeit)` : ""}${dz > 1.25 && df > 0.15 ? " und " : ""}${df > 0.15 ? `gibt es mehr Fehler (+${Math.round(df * 100)} Prozentpunkte)` : ""}.` });
    }
    const erste = rnd[0], spaeter = rnd.slice(1).filter(r => r.n >= 2);
    if (genug && erste && spaeter.length) {
      const schlechteste = spaeter.reduce((m, r) => (r.anhieb < m.anhieb ? r : m));
      if (erste.anhieb - schlechteste.anhieb > 0.15 || schlechteste.zeit / erste.zeit > 1.3) {
        befunde.push({ art: "sitzung", text: `Ab der ${schlechteste.runde} Runde einer Sitzung sinkt die Leistung (auf Anhieb richtig ${Math.round(erste.anhieb * 100)} % → ${Math.round(schlechteste.anhieb * 100)} %).` });
      }
    }
    return { nachPosition: pos, nachRunde: rnd, befunde, genug };
  }

  /**
   * Übungsvorschläge, wichtigste zuerst. Jeder Vorschlag: { art, prio, titel, text, link? }.
   * Regeln (didaktisch): Wackelndes zuerst wiederholen; Gekonntes nach einer Woche auffrischen
   * (verteiltes Üben); bei sicherem Können eine Stufe höher; Fokus-Lernziele regelmässig;
   * bei nachlassender Konzentration kürzere Einheiten; lieber oft kurz als selten lang.
   */
  function vorschlaege(name, runden, profil, jetzt = Date.now()) {
    const v = [];
    const link = (spiel, stufe) => `${spielVon(spiel)?.pfad}?stufe=${stufe}`;
    const empfohlen = LS.empfohleneStufe(name) || "s3";

    // 1. Wiederholen: Spiel+Stufe mit schwacher Quote in den letzten Runden
    const gruppen = {};
    for (const e of runden) (gruppen[`${e.spiel}|${e.stufe}`] = gruppen[`${e.spiel}|${e.stufe}`] || []).push(e);
    for (const [k, rs] of Object.entries(gruppen)) {
      const [spiel, stufe] = k.split("|");
      const letzte = rs.slice(-3);
      const q = mittel(letzte.map(anhieb));
      if (q < QUOTE_UEBEN) {
        const offen = letzte.flatMap(e => e.fehlerAufgaben.filter(f => !f.geloest)).length;
        v.push({ art: "wiederholen", prio: 1 + q, titel: `🔁 Wiederholen: ${spielVon(spiel)?.name} · Stufe ${stufeNr(stufe)}`,
          text: `In den letzten ${letzte.length} Runden nur ${Math.round(q * 100)} % auf Anhieb richtig${offen ? `, ${offen} Aufgabe${offen === 1 ? "" : "n"} nicht gelöst` : ""}. Lieber 2–3 kurze Runden an verschiedenen Tagen als viele am Stück.`,
          link: link(spiel, stufe) });
      }
    }

    // 2. Nächste Stufe: zweimal in Folge 3 Sterne, nächste Stufe noch nicht gemeistert
    for (const [k, rs] of Object.entries(gruppen)) {
      const [spiel, stufe] = k.split("|");
      const n = stufeNr(stufe);
      if (n >= 5 || rs.length < 2 || !rs.slice(-2).every(e => e.sterne === 3)) continue;
      const naechste = `s${n + 1}`;
      if (LS.besteSterne(name, spiel, naechste) === 3) continue;
      v.push({ art: "weiter", prio: 3, titel: `⬆️ Bereit für Stufe ${n + 1}: ${spielVon(spiel)?.name}`,
        text: `Stufe ${n} zweimal hintereinander mit 3 Sternen geschafft — Zeit für die nächste Herausforderung.`, link: link(spiel, naechste) });
    }

    // 3. Auffrischen (verteiltes Üben): Lernziel sass, wurde aber seit über 7 Tagen nicht geübt
    for (const lz of LERNZIELE) {
      const rs = rundenZuLernziel(runden, lz.lz);
      if (!rs.length) continue;
      const zuletzt = Date.parse(rs[rs.length - 1].zeit);
      const tage = Math.floor((jetzt - zuletzt) / TAG_MS);
      if (tage >= 7 && mittel(rs.slice(-3).map(anhieb)) >= QUOTE_UEBEN) {
        const e = rs[rs.length - 1];
        v.push({ art: "auffrischen", prio: 4, titel: `🌤 Auffrischen: ${lz.lz} ${lz.text}`,
          text: `Sass gut, ist aber ${tage} Tage her. Eine kurze Runde hilft, es nicht zu vergessen.`, link: link(e.spiel, e.stufe) });
      }
    }

    // 4. Fokus-Lernziele: in den letzten 3 Tagen nicht geübt
    for (const lzId of profil.fokus || []) {
      const lz = LERNZIELE.find(l => l.lz === lzId);
      if (!lz) continue;
      const rs = rundenZuLernziel(runden, lzId);
      const zuletzt = rs.length ? Date.parse(rs[rs.length - 1].zeit) : 0;
      if (jetzt - zuletzt < 3 * TAG_MS) continue;
      const s = SPIELE.find(x => x.lernziele.some(l => l.lz === lzId));
      const stufe = s.lernziele.find(l => l.lz === lzId).stufen.includes(empfohlen) ? empfohlen : s.lernziele.find(l => l.lz === lzId).stufen[0];
      v.push({ art: "fokus", prio: 2, titel: `⭐ Fokus: ${lz.lz} ${lz.text}`,
        text: rs.length ? `Seit ${Math.floor((jetzt - zuletzt) / TAG_MS)} Tagen nicht geübt.` : "Noch nie geübt — guter Startpunkt.", link: link(s.id, stufe) });
    }

    // 5. Konzentration
    const k = konzentration(runden);
    for (const b of k.befunde) {
      v.push({ art: "konzentration", prio: 2.5, titel: "🧠 Konzentration",
        text: `${b.text} ${b.art === "sitzung" ? "Tipp: nach 2 Runden eine kurze Bewegungspause." : "Tipp: lieber eine Runde weniger, dafür konzentriert."}` });
    }

    // 6. Regelmässigkeit
    const lz14 = lernzeiten(runden, jetzt);
    if (runden.length && lz14.uebungstage14 < 4) {
      v.push({ art: "rhythmus", prio: 5, titel: "📅 Lieber oft und kurz",
        text: `In den letzten 14 Tagen an ${lz14.uebungstage14} Tag${lz14.uebungstage14 === 1 ? "" : "en"} geübt. 3–4 Mal pro Woche 10 Minuten wirken besser als einmal lang.` });
    }

    // 7. Herausforderung Timer: sicher und ohne Timer → Timer vorschlagen
    for (const [kk, rs] of Object.entries(gruppen)) {
      const [spiel, stufe] = kk.split("|");
      const letzte = rs.slice(-3);
      if (letzte.length < 3 || letzte.some(e => e.timer) || mittel(letzte.map(anhieb)) < 0.9) continue;
      const vor = LS.zeitVorschlag(name, spiel, stufe);
      if (!vor) continue;
      v.push({ art: "timer", prio: 6, titel: `⏱ Herausforderung: ${spielVon(spiel)?.name} mit Timer`,
        text: `Stufe ${stufeNr(stufe)} sitzt sicher. Mit Timer (${vor.sekunden} s je Aufgabe, aus den eigenen Zeiten) wird es spannender.`, link: link(spiel, stufe) });
    }

    return v.sort((a, b) => a.prio - b.prio);
  }

  return { anhieb, mittel, median, sitzungen, lernzeiten, konzentration, vorschlaege, rundenZuLernziel, QUOTE_UEBEN };
})();
