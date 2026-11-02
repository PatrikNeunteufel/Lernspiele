/* Didaktische Auswertung des Protokolls — reine Rechenfunktionen ohne Darstellung.
   Braucht spiel.js (LS) und katalog.js (SPIELE, LERNZIELE) davor.
   Eingabe sind Protokolleinträge eines Kindes (siehe spiel.js, Abschnitt Protokoll). */

const AUSWERTUNG = (() => {
  "use strict";

  const TAG_MS = 24 * 3600 * 1000;
  const SITZUNGS_PAUSE_MIN = 20;   // mehr Pause zwischen zwei Runden = neue Sitzung
  const QUOTE_UEBEN = 0.7;         // unter diesem Anteil „auf Anhieb richtig“ gilt ein Lernziel als „üben“

  // „Auf Anhieb“ heisst ohne Fehler und ohne Tipp (Entscheid T1 a, LERN_Session9): Aufgaben mit Fehler stehen in
  // fehlerAufgaben, Aufgaben, die nur ein Tipp brauchte, zählen dazu.
  const mitTippOhneFehler = e => (e.aufgabenZeiten || []).filter(a => a.tipps && !a.versuche && !a.zeitUm).length;
  const anhieb = e => (e.aufgaben - e.fehlerAufgaben.length - mitTippOhneFehler(e)) / e.aufgaben;
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

    // Eigener Schnitt „auf Anhieb“ je Spiel und Stufe: Der Befund vergleicht damit, nicht roh — sonst sähe
    // ein schwereres Spiel in der 2. Runde wie nachlassende Konzentration aus (LERN_Session9).
    const schnitt = {};
    for (const e of mitZeiten) (schnitt[`${e.spiel}|${e.stufe}`] ||= []).push(anhieb(e));
    for (const kk of Object.keys(schnitt)) schnitt[kk] = mittel(schnitt[kk]);

    const nachRunde = [];
    for (const s of sitzungen(mitZeiten)) {
      s.forEach((e, i) => {
        const basis = ueblich[`${e.spiel}|${e.stufe}`] || 1;
        const idx = Math.min(i, 3); // 1., 2., 3., 4.+ Runde
        const r = (nachRunde[idx] = nachRunde[idx] || { runde: idx === 3 ? "4.+" : `${idx + 1}.`, verhaeltnis: [], anhieb: [], relativ: [] });
        r.verhaeltnis.push(median(e.aufgabenZeiten.map(a => a.ms)) / basis);
        r.anhieb.push(anhieb(e));
        r.relativ.push(anhieb(e) - schnitt[`${e.spiel}|${e.stufe}`]);
      });
    }

    const pos = nachPosition.filter(Boolean).map(p => ({ pos: p.pos, zeit: mittel(p.verhaeltnis), fehler: mittel(p.fehler), n: p.fehler.length }));
    const rnd = nachRunde.filter(Boolean).map(r => ({ runde: r.runde, zeit: mittel(r.verhaeltnis), anhieb: mittel(r.anhieb), relativ: mittel(r.relativ), n: r.anhieb.length }));

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
      const schlechteste = spaeter.reduce((m, r) => (r.relativ < m.relativ ? r : m));
      const dAnhieb = erste.relativ - schlechteste.relativ;
      if (dAnhieb > 0.15 || schlechteste.zeit / erste.zeit > 1.3) {
        befunde.push({ art: "sitzung", text: `Ab der ${schlechteste.runde} Runde einer Sitzung sinkt die Leistung — gemessen am eigenen Schnitt im selben Spiel und derselben Stufe ${dAnhieb > 0.15 ? `${Math.round(dAnhieb * 100)} Prozentpunkte weniger auf Anhieb richtig` : `${Math.round((schlechteste.zeit / erste.zeit - 1) * 100)} % langsamer`}.` });
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
      if (n >= LS.SKALA.length || rs.length < 2 || !rs.slice(-2).every(e => e.sterne === 3)) continue;
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
      // Spiel mit der Basisklasse, die der Klasse des Kindes am nächsten liegt
      const kandidaten = SPIELE.filter(x => x.lernziele.some(l => l.lz === lzId));
      const klasse = LS.klasseVon(profil) ?? 0; // ohne Angabe wie Kindergarten: das leichteste Spiel
      const s = kandidaten.reduce((m, x) => (Math.abs((x.klasse || 0) - klasse) < Math.abs((m.klasse || 0) - klasse) ? x : m));
      const empfohlen = LS.empfohleneStufe(name, s.id) || "s3";
      const geuebt = s.lernziele.find(l => l.lz === lzId).stufen;
      const stufe = geuebt.includes(empfohlen) ? empfohlen : geuebt[0];
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

  // ---------- Vorgehen (ctx.vorgehen): wie ein Kind Aufgaben angeht (Wunsch Patrik, LERN_Session7) ----------
  // Je Art die Werte vom besten zum schwächsten; ton: gut | mittel | schwach (Farbe in der Statistik).
  const VORGEHEN = {
    systematik: {
      titel: "Systematisch kombinieren", spiele: ["glace-kombinator"],
      erklaerung: "Beim Legen aller Möglichkeiten: der Reihe nach wie ein Zählwerk (erst ein Stück mit allem, dann das nächste)?",
      werte: [
        { id: "streng", text: "der Reihe nach", ton: "gut" },
        { id: "geordnet", text: "geordnet, innen wechselnd", ton: "mittel" },
        { id: "durcheinander", text: "kreuz und quer", ton: "schwach" },
        { id: "hilfe", text: "mit Hilfe der geordneten Reihe", ton: "schwach" },
      ],
    },
    teilerpaare: {
      titel: "Teiler finden", spiele: ["teiler-detektiv"],
      erklaerung: "Beim Antippen aller Teiler: in Paaren (2 und 15 zu 30) oder der Reihe nach — dann geht keiner vergessen.",
      werte: [
        { id: "paare", text: "in Paaren", ton: "gut" },
        { id: "aufsteigend", text: "der Grösse nach", ton: "gut" },
        { id: "durcheinander", text: "durcheinander", ton: "schwach" },
      ],
    },
    ausgleichen: {
      titel: "Ausgleichen", spiele: ["mittelwert-waage", "gerecht-teiler"],
      erklaerung: "Beim Ausgleichen der Säulen oder Teller: mit so wenigen Zügen wie nötig — wer das schafft, hat das Ziel vorher im Kopf.",
      werte: [
        { id: "kuerzest", text: "ohne Umweg", ton: "gut" },
        { id: "umwege", text: "mit Umwegen", ton: "mittel" },
      ],
    },
  };

  /** Je Art mit Daten: Anzahl je Wert und die Folge der letzten Aufgaben (älteste zuerst). */
  function vorgehen(runden) {
    const sortiert = [...runden].sort((a, b) => a.zeit.localeCompare(b.zeit));
    return Object.entries(VORGEHEN).map(([art, d]) => {
      const folge = sortiert.flatMap(e => (e.aufgabenZeiten || []).filter(a => a.vorgehen?.[art]).map(a => a.vorgehen[art]));
      return { art, ...d, folge, anzahl: Object.fromEntries(d.werte.map(w => [w.id, folge.filter(x => x === w.id).length])) };
    }).filter(v => v.folge.length);
  }

  // ---------- Fazit in Worten (Wunsch Patrik, LERN_Session9) ----------
  // Regelbasiert und nachvollziehbar, keine KI: Jede Aussage beruht auf Zahlen aus dem Protokoll und nennt
  // sie; bei zu wenig Daten schweigt eine Regel. Alles bleibt im Browser (Entscheid LERN-5 b).
  // Die Grenzen sind Annahmen, bis Erfahrungen mit Kindern vorliegen.
  const FAZIT = {
    minAufgaben: 12,       // so viele Aufgaben braucht ein Thema, bevor es als Stärke oder Schwäche gilt
    minRunden: 2,          // … und so viele Runden
    stark: 0.85, schwach: 0.6, // Anteil auf Anhieb richtig
    abstand: 0.15,         // so viel besser oder schlechter als der eigene Schnitt gilt als auffällig
    ausreisser: 0.2,       // Thema gegen den Rest seines Fachs
    minRundenKorrelation: 12, korrelation: 0.35, // Zusammenhang über die Runden: ab |r| 0.35 erwähnt
    einseitig: 0.75,       // Anteil eines Fachs an allen Aufgaben
  };
  // Themen, die für die Regeln über Fächer hinweg zusammengehören (Katalog, THEMEN).
  const BEREICHE = {
    lesen: ["lesen"],
    zuhoeren: ["zuhoeren", "englisch-hoeren"],
    sachrechnen: ["sachrechnen"],
    rechnen: ["rechnen", "dezimal", "brueche", "teiler", "zahlen", "stellenwert"],
  };

  const themaVon = id => THEMEN.find(t => t.id === spielVon(id)?.thema);
  const anhiebAufgaben = e => e.aufgaben - e.fehlerAufgaben.length - mitTippOhneFehler(e);
  const pz = x => `${Math.round(x * 100)} %`;
  const aufgabenText = n => `${n} Aufgabe${n === 1 ? "" : "n"}`;

  /** Aufgaben und auf Anhieb richtige zusammenzählen: { aufgaben, anhieb, runden, quote }. */
  function summiere(rs) {
    const aufgaben = rs.reduce((s, e) => s + e.aufgaben, 0);
    const richtig = rs.reduce((s, e) => s + anhiebAufgaben(e), 0);
    return { aufgaben, anhieb: richtig, runden: rs.length, quote: aufgaben ? richtig / aufgaben : null };
  }
  const genugDaten = x => x.aufgaben >= FAZIT.minAufgaben && x.runden >= FAZIT.minRunden;

  /** Pearson-Korrelation zweier gleich langer Reihen; null bei zu wenig Streuung. */
  function korrelation(xs, ys) {
    const n = xs.length;
    if (n < 3) return null;
    const mx = mittel(xs), my = mittel(ys);
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
    return sxx && syy ? sxy / Math.sqrt(sxx * syy) : null;
  }

  /**
   * Fazit über die Runden eines Kindes: { genug, kurz, abschnitte: [{ titel, saetze }] }.
   * Abschnitte: Menge, Qualität, Konzentration, Stärken und Schwächen, Auffälligkeiten.
   * profil: für die Klasse des Kindes (Niveau der gespielten Stufen).
   */
  function fazit(runden, profil = {}, jetzt = Date.now(), meldungen = []) {
    const rs = [...runden].filter(e => e.aufgaben > 0 && spielVon(e.spiel)).sort((a, b) => a.zeit.localeCompare(b.zeit));
    const gesamt = summiere(rs);
    if (gesamt.aufgaben < FAZIT.minAufgaben) {
      return { genug: false, kurz: `Für ein Fazit braucht es mindestens ${FAZIT.minAufgaben} gelöste Aufgaben — bisher ${gesamt.aufgaben}.`, abschnitte: [] };
    }

    // Je Thema und je Fach
    const jeThema = new Map(), jeFach = new Map();
    for (const e of rs) {
      const t = themaVon(e.spiel);
      if (!t) continue;
      (jeThema.get(t.id) || jeThema.set(t.id, { t, runden: [] }).get(t.id)).runden.push(e);
      (jeFach.get(t.fach) || jeFach.set(t.fach, { fach: t.fach, runden: [] }).get(t.fach)).runden.push(e);
    }
    const themen = [...jeThema.values()].map(x => ({ ...x, ...summiere(x.runden) }));
    const faecher = [...jeFach.values()].map(x => ({ ...x, ...summiere(x.runden) }));
    const bereich = name => summiere(rs.filter(e => BEREICHE[name].includes(spielVon(e.spiel)?.thema)));

    // ----- Menge -----
    const menge = [];
    const minuten = Math.round(rs.reduce((s, e) => s + (e.dauer || 0), 0) / 60);
    const tage = new Set(rs.map(e => new Date(e.zeit).toDateString()));
    const erster = Date.parse(rs[0].zeit);
    const wochen = Math.max(1, (jetzt - erster) / (7 * TAG_MS));
    menge.push(`${rs.length} Runden mit ${aufgabenText(gesamt.aufgaben)} in ${minuten} Minuten, an ${tage.size} Tag${tage.size === 1 ? "" : "en"}${wochen >= 1.5 ? ` in ${Math.round(wochen)} Wochen` : ""}.`);
    const lz14 = lernzeiten(rs, jetzt);
    menge.push(lz14.uebungstage14 >= 4 ? `Regelmässig: in den letzten 14 Tagen an ${lz14.uebungstage14} Tagen geübt.`
      : `In den letzten 14 Tagen an ${lz14.uebungstage14} Tag${lz14.uebungstage14 === 1 ? "" : "en"} geübt — öfter und kürzer hilft beim Behalten.`);
    const groesstes = faecher.reduce((m, f) => (f.aufgaben > m.aufgaben ? f : m), faecher[0]);
    if (faecher.length > 1 && groesstes.aufgaben / gesamt.aufgaben >= FAZIT.einseitig) {
      menge.push(`Einseitig: ${pz(groesstes.aufgaben / gesamt.aufgaben)} der Aufgaben in ${groesstes.fach}.`);
    } else if (faecher.length > 1) {
      menge.push(`Verteilt auf ${faecher.length} Fächer: ${faecher.sort((a, b) => b.aufgaben - a.aufgaben).map(f => `${f.fach} ${pz(f.aufgaben / gesamt.aufgaben)}`).join(", ")}.`);
    }

    // ----- Qualität -----
    const qualitaet = [];
    qualitaet.push(`Insgesamt ${pz(gesamt.quote)} der Aufgaben auf Anhieb richtig.`);
    const gezeigt = rs.reduce((s, e) => s + e.fehlerAufgaben.filter(f => !f.geloest).length, 0);
    if (gezeigt) qualitaet.push(`Bei ${aufgabenText(gezeigt)} (${pz(gezeigt / gesamt.aufgaben)}) zeigte das Spiel nach drei Versuchen die Lösung.`);
    // Tipps (Entscheid T1 a): wie oft geholt, und wie viele Aufgaben dank Tipp ohne Fehler gelöst wurden
    const tippsGesamt = rs.reduce((s, e) => s + (e.tipps || 0), 0);
    const dankTipp = rs.reduce((s, e) => s + mitTippOhneFehler(e), 0);
    if (tippsGesamt) qualitaet.push(`${tippsGesamt} Tipp${tippsGesamt === 1 ? "" : "s"} geholt${dankTipp ? `; ${aufgabenText(dankTipp)} damit ohne Fehler gelöst` : ""}${tippsGesamt / gesamt.aufgaben > 0.3 ? " — oft: vielleicht ist die Stufe noch etwas schwer" : ""}.`);
    const bedien = rs.reduce((s, e) => s + (e.bedienhilfe || 0), 0);
    if (bedien) qualitaet.push(`❓ Bedienungshilfe ${bedien}-mal geöffnet.`);
    // Fortschritt: nur innerhalb desselben Spiels und derselben Stufe (frühere gegen neuere Hälfte), sonst
    // verwechselte ein Wechsel zu schwereren Spielen sich mit einem Rückschritt.
    const fruehSpaet = { frueh: [], spaet: [] };
    const jeSpielStufe = {};
    for (const e of rs) (jeSpielStufe[`${e.spiel}|${e.stufe}`] ||= []).push(e);
    for (const g of Object.values(jeSpielStufe).filter(g => g.length >= 4)) {
      const h = Math.floor(g.length / 2);
      fruehSpaet.frueh.push(...g.slice(0, h));
      fruehSpaet.spaet.push(...g.slice(g.length - h));
    }
    let fortschritt = null; // Differenz neuer gegen früher im selben Spiel und derselben Stufe
    if (fruehSpaet.frueh.length >= 4) {
      const a = summiere(fruehSpaet.frueh), b = summiere(fruehSpaet.spaet);
      const d = b.quote - a.quote;
      fortschritt = { frueher: a.quote, zuletzt: b.quote };
      const wo = `im selben Spiel und derselben Stufe (${fruehSpaet.frueh.length * 2} Runden)`;
      if (Math.abs(d) >= 0.1) qualitaet.push(d > 0 ? `Fortschritt ${wo}: zuletzt ${pz(b.quote)} statt ${pz(a.quote)} auf Anhieb richtig.`
        : `Rückschritt ${wo}: zuletzt ${pz(b.quote)} statt ${pz(a.quote)} auf Anhieb richtig — müde, lange nicht geübt oder Neues dazwischen?`);
      else qualitaet.push(`Gleichmässig ${wo}: früher ${pz(a.quote)}, zuletzt ${pz(b.quote)}.`);
    }
    // Mitdenken: Fehler im Programm gefunden (Meldungen, die die Entwicklung behoben hat; LERN_Session9)
    const gefunden = meldungen.filter(m => m.status === "behoben").length;
    const bestaetigt = meldungen.filter(m => ["bestaetigt", "weitergeleitet", "geplant"].includes(m.status)).length;
    if (gefunden) qualitaet.push(`🏅 Fehlerfinder: ${gefunden} echte${gefunden === 1 ? "n" : ""} Fehler im Programm gefunden und gemeldet — das zeigt genaues Hinschauen und Mitdenken.`);
    if (bestaetigt) qualitaet.push(`Dazu ${bestaetigt} bestätigte Fehlermeldung${bestaetigt === 1 ? "" : "en"}, noch nicht behoben.`);
    // Niveau: gespielte Stufen gegen die Klasse des Kindes (Stufe 1 = eine Klasse tiefer, 5 und 6 = höher)
    const klasse = LS.klasseVon(profil);
    if (klasse != null) {
      const stufenKlasse = e => (spielVon(e.spiel).klasse || 0) + ({ s1: -1, s5: 1, s6: 1 }[e.stufe] || 0);
      const tiefer = rs.filter(e => stufenKlasse(e) < klasse).length, hoeher = rs.filter(e => stufenKlasse(e) > klasse).length;
      if (tiefer / rs.length >= 0.5) qualitaet.push(`Geübt wird meist unter der eigenen Klasse (${pz(tiefer / rs.length)} der Runden) — die Zahlen sind deshalb eher zu gut.`);
      else if (hoeher / rs.length >= 0.5) qualitaet.push(`Geübt wird meist über der eigenen Klasse (${pz(hoeher / rs.length)} der Runden) — tiefere Werte sind dort normal.`);
    }

    // ----- Konzentration -----
    const k = konzentration(rs);
    const konz = k.genug ? (k.befunde.length ? k.befunde.map(b => b.text) : ["Keine Hinweise auf nachlassende Konzentration innerhalb einer Runde oder Sitzung."]) : [];
    const mitTimer = summiere(rs.filter(e => e.timer)), ohneTimer = summiere(rs.filter(e => !e.timer));
    if (genugDaten(mitTimer) && genugDaten(ohneTimer) && ohneTimer.quote - mitTimer.quote >= FAZIT.abstand) {
      konz.push(`Mit Timer deutlich schwächer (${pz(mitTimer.quote)} gegen ${pz(ohneTimer.quote)} ohne) — Zeitdruck stört eher, als dass er anspornt.`);
    }
    const imMix = summiere(rs.filter(e => e.mix)), einzeln = summiere(rs.filter(e => !e.mix));
    if (genugDaten(imMix) && genugDaten(einzeln) && einzeln.quote - imMix.quote >= FAZIT.abstand) {
      konz.push(`Im Zufallsmix schwächer als im einzelnen Spiel (${pz(imMix.quote)} gegen ${pz(einzeln.quote)}) — der Wechsel zwischen Aufgabenarten fällt noch schwer.`);
    }

    // ----- Stärken und Schwächen -----
    const sw = [];
    const belastbar = themen.filter(genugDaten);
    const staerken = belastbar.filter(x => x.quote >= FAZIT.stark && x.quote >= gesamt.quote + FAZIT.abstand / 2).sort((a, b) => b.quote - a.quote);
    const schwaechen = belastbar.filter(x => x.quote < FAZIT.schwach || x.quote <= gesamt.quote - FAZIT.abstand).sort((a, b) => a.quote - b.quote);
    const liste = xs => xs.map(x => `${x.t.name} (${x.t.fach}, ${pz(x.quote)} aus ${aufgabenText(x.aufgaben)})`).join(", ");
    if (staerken.length) sw.push(`Stärken: ${liste(staerken)}.`);
    if (schwaechen.length) sw.push(`Schwächen: ${liste(schwaechen)}.`);
    if (!staerken.length && !schwaechen.length && belastbar.length) sw.push("Keine deutlichen Stärken oder Schwächen — die Themen liegen nahe beieinander.");
    const duenn = themen.filter(x => !genugDaten(x)).map(x => x.t.name);
    if (duenn.length) sw.push(`Noch zu wenig geübt für ein Urteil: ${duenn.join(", ")}.`);

    // ----- Auffälligkeiten -----
    const auff = [];
    // a) Ausreisser im eigenen Fach (beide Richtungen). „Sonst unsicher“ nur, wenn der Rest des Fachs aus
    //    mindestens zwei Themen besteht — sonst wäre es bloss das Spiegelbild von „X fällt ab“.
    for (const x of belastbar) {
      const restRunden = rs.filter(e => themaVon(e.spiel)?.fach === x.t.fach && themaVon(e.spiel)?.id !== x.t.id);
      const rest = summiere(restRunden);
      if (!genugDaten(rest)) continue;
      const restThemen = new Set(restRunden.map(e => themaVon(e.spiel).id)).size;
      if (rest.quote >= FAZIT.stark - 0.05 && rest.quote - x.quote >= FAZIT.ausreisser) {
        auff.push(`In ${x.t.fach} sonst sicher (${pz(rest.quote)}), aber im Thema „${x.t.name}“ deutlich schwächer (${pz(x.quote)}) — hier gezielt üben.`);
      } else if (restThemen >= 2 && rest.quote <= FAZIT.schwach + 0.1 && x.quote - rest.quote >= FAZIT.ausreisser) {
        auff.push(`In ${x.t.fach} sonst eher unsicher (${pz(rest.quote)}), aber im Thema „${x.t.name}“ gut (${pz(x.quote)}) — darauf lässt sich aufbauen.`);
      }
    }
    // b) Über Fächer hinweg: Sachaufgaben brauchen Lesen und Rechnen
    const lesen = bereich("lesen"), sach = bereich("sachrechnen"), rechnen = bereich("rechnen"), hoeren = bereich("zuhoeren");
    if (genugDaten(lesen) && genugDaten(sach) && genugDaten(rechnen)) {
      const lesenSchwach = lesen.quote <= gesamt.quote - FAZIT.abstand || lesen.quote < FAZIT.schwach;
      const sachSchwach = sach.quote <= rechnen.quote - FAZIT.abstand;
      if (lesenSchwach && sachSchwach) auff.push(`Sachaufgaben (${pz(sach.quote)}) gelingen schlechter als das reine Rechnen (${pz(rechnen.quote)}), und auch das Lesen ist unsicher (${pz(lesen.quote)}) — die Sachaufgaben scheitern wohl eher am Verstehen des Textes als am Rechnen. Tipp: Aufgaben laut lesen, wichtige Zahlen markieren.`);
      else if (lesenSchwach && !sachSchwach) auff.push(`Lesen ist unsicher (${pz(lesen.quote)}), Sachaufgaben gelingen aber so gut wie das Rechnen (${pz(sach.quote)} gegen ${pz(rechnen.quote)}) — das Lesen bremst die Sachaufgaben nicht.`);
      else if (!lesenSchwach && sachSchwach) auff.push(`Lesen sitzt (${pz(lesen.quote)}), trotzdem fallen Sachaufgaben ab (${pz(sach.quote)} gegen ${pz(rechnen.quote)} beim Rechnen) — hier fehlt eher das Übersetzen in eine Rechnung: Was ist gefragt, welche Angaben braucht es?`);
    } else if (genugDaten(sach) && genugDaten(rechnen) && rechnen.quote - sach.quote >= FAZIT.ausreisser) {
      auff.push(`Sachaufgaben (${pz(sach.quote)}) gelingen deutlich schlechter als das reine Rechnen (${pz(rechnen.quote)}). Ob es am Lesen liegt, zeigt sich, wenn auch Lesespiele gespielt werden.`);
    }
    if (genugDaten(hoeren) && genugDaten(lesen) && hoeren.quote - lesen.quote >= FAZIT.ausreisser) {
      auff.push(`Gehörtes wird besser verstanden als Gelesenes (${pz(hoeren.quote)} gegen ${pz(lesen.quote)}) — Vorlesen und Hören können beim Lernen helfen, das Lesen selbst braucht Übung.`);
    }
    // c) Zusammenhänge über die Runden: Leistung gegenüber dem eigenen Schnitt im selben Spiel und derselben Stufe
    if (rs.length >= FAZIT.minRundenKorrelation) {
      const basis = {};
      for (const e of rs) (basis[`${e.spiel}|${e.stufe}`] ||= []).push(anhieb(e));
      const relVon = e => anhieb(e) - mittel(basis[`${e.spiel}|${e.stufe}`]);
      const rel = rs.map(relVon);
      const sitz = sitzungen(rs); // sortiert wie rs
      const imSitzung = sitz.flatMap(s => s.map((_, i) => i + 1));
      // Tageszeit und Pause je Sitzung, nicht je Runde: innerhalb einer Sitzung rückt die Uhr nur Minuten vor,
      // und nur die erste Runde folgt auf eine Pause — sonst spiegelten beide bloss die Runde in der Sitzung.
      const sitzRel = sitz.map(s => mittel(s.map(relVon)));
      const stunde = sitz.map(s => { const d = new Date(s[0].zeit); return d.getHours() + d.getMinutes() / 60; });
      // Tage seit der Sitzung davor (höchstens 14, damit lange Ferien nicht alles bestimmen)
      const pause = sitz.slice(1).map((s, i) => Math.min(14, (Date.parse(s[0].zeit) - Date.parse(sitz[i][sitz[i].length - 1].zeit)) / TAG_MS));
      // Erwähnt nur, was kaum Zufall sein kann: |r| ≥ 2/√n (ungefähr die übliche 5-%-Grenze), mindestens FAZIT.korrelation.
      const pruefe = (werte, bezug, einheit, positiv, negativ) => {
        if (werte.length < FAZIT.minRundenKorrelation) return;
        const r = korrelation(werte, bezug);
        if (r != null && Math.abs(r) >= Math.max(FAZIT.korrelation, 2 / Math.sqrt(werte.length))) auff.push(`${r > 0 ? positiv : negativ} (Zusammenhang r = ${r.toFixed(2).replace(".", ",")} über ${werte.length} ${einheit} — ein Zusammenhang, noch keine Ursache).`);
      };
      pruefe(stunde, sitzRel, "Sitzungen", "Später am Tag gelingt es besser als früh", "Früher am Tag gelingt es besser als später — müde Abende?");
      pruefe(pause, sitzRel.slice(1), "Sitzungen", "Nach längeren Pausen gelingt es sogar besser", "Nach längeren Pausen zwischen den Übungstagen sinkt die Leistung — regelmässiger üben hilft beim Behalten");
      if (Math.max(...imSitzung) >= 3) pruefe(imSitzung, rel, "Runden", "Mit jeder weiteren Runde einer Sitzung wird es besser — Aufwärmen hilft", "Mit jeder weiteren Runde einer Sitzung wird es schwächer — kürzere Sitzungen");
    }
    if (!auff.length) auff.push("Keine ungewöhnlichen Zusammenhänge — die Ergebnisse passen zueinander.");

    // ----- Kurzfassung -----
    const kurz = [
      `${pz(gesamt.quote)} auf Anhieb richtig in ${aufgabenText(gesamt.aufgaben)}.`,
      staerken.length ? `Stark in ${staerken.slice(0, 2).map(x => x.t.name).join(" und ")}.` : null,
      schwaechen.length ? `Üben lohnt sich bei ${schwaechen.slice(0, 2).map(x => x.t.name).join(" und ")}.` : null,
      k.befunde.length ? "Die Konzentration lässt mit der Zeit nach." : null,
    ].filter(Boolean).join(" ");

    return { genug: true, kurz, abschnitte: [
      { titel: "Menge", saetze: menge },
      { titel: "Qualität", saetze: qualitaet },
      ...(konz.length ? [{ titel: "Konzentration", saetze: konz }] : []),
      { titel: "Stärken und Schwächen", saetze: sw },
      { titel: "Auffälligkeiten", saetze: auff },
    ], daten: { quote: gesamt.quote, aufgaben: gesamt.aufgaben, tage: tage.size, uebungstage14: lz14.uebungstage14,
      staerken: staerken.map(x => x.t.name), schwaechen: schwaechen.map(x => x.t.name), fortschritt, gefunden } };
  }

  /**
   * Fazit für das Kind selbst (Entscheid G3, LERN_Session9: die Aufsicht gibt es frei, Profil fazitFuerKind):
   * freundlich und ermutigend — was gelingt, Fortschritt, höchstens zwei Hinweise „hier lohnt sich Üben“.
   * Keine Konzentration und keine Zusammenhänge; die sind für Erwachsene. Liste von Sätzen.
   */
  function fazitFuerKind(runden, profil = {}, jetzt = Date.now(), meldungen = []) {
    const f = fazit(runden, profil, jetzt, meldungen);
    if (!f.genug) return ["Spiel noch ein paar Runden — dann schreibt dir die Eule hier, was du schon gut kannst."];
    const d = f.daten;
    const s = [];
    s.push(d.quote >= 0.8 ? `Super! ${pz(d.quote)} deiner Aufgaben waren auf Anhieb richtig.`
      : `Du hast schon ${aufgabenText(d.aufgaben)} gelöst — ${pz(d.quote)} davon auf Anhieb richtig.`);
    if (d.staerken.length) s.push(`Das kannst du richtig gut: ${d.staerken.slice(0, 3).join(", ")}. 🌟`);
    if (d.fortschritt && d.fortschritt.zuletzt - d.fortschritt.frueher >= 0.1) s.push(`Du wirst besser: Zuletzt ${pz(d.fortschritt.zuletzt)} statt ${pz(d.fortschritt.frueher)} auf Anhieb richtig. 📈`);
    if (d.uebungstage14 >= 4) s.push(`Du übst regelmässig — an ${d.uebungstage14} Tagen in zwei Wochen. Das hilft beim Behalten!`);
    if (d.gefunden) s.push(`🏅 Du hast ${d.gefunden} echte${d.gefunden === 1 ? "n" : ""} Fehler im Spiel gefunden — danke fürs genaue Hinschauen!`);
    if (d.schwaechen.length) s.push(`Hier lohnt sich Üben: ${d.schwaechen.slice(0, 2).join(" und ")}. Jede Runde macht dich sicherer.`);
    return s;
  }

  return { anhieb, mittel, median, sitzungen, lernzeiten, konzentration, vorschlaege, rundenZuLernziel, QUOTE_UEBEN, VORGEHEN, vorgehen, FAZIT, fazit, fazitFuerKind, korrelation };
})();
