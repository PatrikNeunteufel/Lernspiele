/* König in der Falle — kleine Schach-Regel-Maschine (ohne Abhängigkeit, LERN_Session11).
   Kann: legale Züge aller Figuren mit Schach-Prüfung (der eigene König darf nach dem Zug nicht im Schach
   stehen), Schach, Matt, Patt, alle Mattzüge in 1, Matt in 2 mit der zähesten Verteidigung.
   Kann bewusst nicht: Rochade, en passant, Umwandlung. Stellungen, in denen eines davon möglich wäre,
   weist SCHACH.maengel ab — so kommen sie in den Rätseln nie vor (Regelseite: „kommt hier nicht vor“).
   Brett: Liste mit 64 Feldern, Index = Reihe · 8 + Linie (a1 = 0, h1 = 7, a8 = 56); Figuren wie in der
   FEN-Schreibweise: KQRBNP Weiss, kqrbnp Schwarz. Weiss zieht immer nach oben.
   Benutzt von index.html (Spiel, aufgabeErzeugen, pruefeAufgabe) und vom Bauwerkzeug der Stellungen. */
"use strict";

const SCHACH = (() => {
  const NAME = { K: "König", Q: "Dame", R: "Turm", B: "Läufer", N: "Springer", P: "Bauer" };
  /** Mit Artikel im Nominativ und Akkusativ: „der Turm“, „den Turm“, „die Dame“. */
  const DER = { K: "der", Q: "die", R: "der", B: "der", N: "der", P: "der" };
  const DEN = { K: "den", Q: "die", R: "den", B: "den", N: "den", P: "den" };
  /** Gefüllte Zeichen für beide Farben; die Farbe gibt der Stil (U+FE0E: als Schrift, nicht als Emoji). */
  const ZEICHEN = { K: "♚︎", Q: "♛︎", R: "♜︎", B: "♝︎", N: "♞︎", P: "♟︎" };

  const istWeiss = p => !!p && p === p.toUpperCase();
  const farbe = p => (p ? (istWeiss(p) ? "w" : "b") : null);
  const gegner = c => (c === "w" ? "b" : "w");
  const linie = i => i & 7;
  const reihe = i => i >> 3;
  const feld = i => "abcdefgh"[linie(i)] + (reihe(i) + 1);
  const index = s => (s.charCodeAt(0) - 97) + 8 * (Number(s[1]) - 1);
  /** Feld neben i um (dl, dr), oder −1 ausserhalb des Bretts. */
  const neben = (i, dl, dr) => {
    const l = linie(i) + dl, r = reihe(i) + dr;
    return l >= 0 && l < 8 && r >= 0 && r < 8 ? r * 8 + l : -1;
  };

  const SPRUNG = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
  const NACHBAR = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const GERADE = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  const SCHRAEG = [[1, 1], [-1, 1], [-1, -1], [1, -1]];

  /** FEN (nur Figurenteil und Seite am Zug) → { brett, amZug }. Wirft bei kaputter FEN. */
  function ausFen(fen) {
    const [teil, zug = "w"] = String(fen).trim().split(/\s+/);
    const reihen = teil.split("/");
    if (reihen.length !== 8) throw new Error("FEN braucht 8 Reihen");
    const brett = new Array(64).fill(null);
    reihen.forEach((txt, k) => {
      const r = 7 - k;
      let l = 0;
      for (const c of txt) {
        if (/[1-8]/.test(c)) l += Number(c);
        else if ("KQRBNPkqrbnp".includes(c)) { if (l > 7) throw new Error("Reihe zu lang"); brett[r * 8 + l++] = c; }
        else throw new Error(`unbekanntes Zeichen ${c}`);
      }
      if (l !== 8) throw new Error(`Reihe ${r + 1} hat ${l} statt 8 Felder`);
    });
    if (zug !== "w" && zug !== "b") throw new Error("Seite am Zug muss w oder b sein");
    return { brett, amZug: zug };
  }

  /** Brett → Figurenteil der FEN. */
  function zuFen(brett) {
    const reihen = [];
    for (let r = 7; r >= 0; r--) {
      let txt = "", leer = 0;
      for (let l = 0; l < 8; l++) {
        const p = brett[r * 8 + l];
        if (!p) { leer++; continue; }
        if (leer) { txt += leer; leer = 0; }
        txt += p;
      }
      reihen.push(txt + (leer || ""));
    }
    return reihen.join("/");
  }

  /** Greift eine Figur der Farbe c das Feld i an? */
  function angegriffen(brett, i, c) {
    const w = c === "w";
    const [P, N, B, R, Q, K] = w ? ["P", "N", "B", "R", "Q", "K"] : ["p", "n", "b", "r", "q", "k"];
    // Ein weisser Bauer greift schräg nach oben an, steht also eine Reihe tiefer.
    for (const dl of [-1, 1]) { const j = neben(i, dl, w ? -1 : 1); if (j >= 0 && brett[j] === P) return true; }
    for (const [a, b] of SPRUNG) { const j = neben(i, a, b); if (j >= 0 && brett[j] === N) return true; }
    for (const [a, b] of NACHBAR) { const j = neben(i, a, b); if (j >= 0 && brett[j] === K) return true; }
    for (const [richtungen, fig] of [[GERADE, R], [SCHRAEG, B]]) {
      for (const [a, b] of richtungen) {
        for (let j = neben(i, a, b); j >= 0; j = neben(j, a, b)) {
          const p = brett[j];
          if (!p) continue;
          if (p === fig || p === Q) return true;
          break;
        }
      }
    }
    return false;
  }

  /** Alle Züge der Farbe c ohne Schach-Prüfung: { von, nach, fig, schlag? }. Ohne Rochade, en passant, Umwandlung. */
  function rohZuege(brett, c) {
    const z = [];
    for (let i = 0; i < 64; i++) {
      const p = brett[i];
      if (!p || farbe(p) !== c) continue;
      const fig = p.toUpperCase();
      const dazu = j => {
        if (j < 0) return false;
        const q = brett[j];
        if (!q) { z.push({ von: i, nach: j, fig }); return true; }
        if (farbe(q) !== c) z.push({ von: i, nach: j, fig, schlag: q.toUpperCase() });
        return false;
      };
      if (fig === "P") {
        const d = c === "w" ? 1 : -1;
        const j = neben(i, 0, d);
        if (j >= 0 && !brett[j]) {
          z.push({ von: i, nach: j, fig });
          const j2 = neben(i, 0, 2 * d);
          if (reihe(i) === (c === "w" ? 1 : 6) && j2 >= 0 && !brett[j2]) z.push({ von: i, nach: j2, fig });
        }
        for (const dl of [-1, 1]) {
          const k = neben(i, dl, d);
          if (k >= 0 && brett[k] && farbe(brett[k]) !== c) z.push({ von: i, nach: k, fig, schlag: brett[k].toUpperCase() });
        }
      } else if (fig === "N" || fig === "K") {
        for (const [a, b] of fig === "N" ? SPRUNG : NACHBAR) dazu(neben(i, a, b));
      } else {
        const richtungen = fig === "R" ? GERADE : fig === "B" ? SCHRAEG : [...GERADE, ...SCHRAEG];
        for (const [a, b] of richtungen) for (let j = neben(i, a, b); j >= 0 && dazu(j); j = neben(j, a, b));
      }
    }
    return z;
  }

  const ziehe = (brett, z) => { const b = brett.slice(); b[z.nach] = b[z.von]; b[z.von] = null; return b; };
  const koenig = (brett, c) => brett.indexOf(c === "w" ? "K" : "k");
  const imSchach = (brett, c) => angegriffen(brett, koenig(brett, c), gegner(c));
  /** Legale Züge: Danach steht der eigene König nicht im Schach. */
  const zuege = (brett, c) => rohZuege(brett, c).filter(z => !imSchach(ziehe(brett, z), c));
  const matt = (brett, c) => imSchach(brett, c) && zuege(brett, c).length === 0;
  const patt = (brett, c) => !imSchach(brett, c) && zuege(brett, c).length === 0;
  /** Züge von Weiss, nach denen Schwarz matt ist. */
  const mattZuege = brett => zuege(brett, "w").filter(z => matt(ziehe(brett, z), "b"));
  const gleich = (a, b) => !!a && !!b && a.von === b.von && a.nach === b.nach;

  /**
   * Matt in 2 für Weiss: erste Züge, nach denen jede Antwort von Schwarz ein Matt zulässt (Schwarz muss
   * dabei ziehen können — sonst wäre der erste Zug schon Matt oder Patt).
   */
  function mattInZwei(brett) {
    const erste = [];
    for (const z of zuege(brett, "w")) {
      const b1 = ziehe(brett, z);
      const antworten = zuege(b1, "b");
      if (!antworten.length) continue;
      if (antworten.every(a => mattZuege(ziehe(b1, a)).length > 0)) erste.push(z);
    }
    return erste;
  }

  /**
   * Die zäheste Antwort von Schwarz auf den Zug z: wenn möglich eine, nach der Weiss kein Matt hat
   * (der Zug war dann nicht der richtige), sonst eine mit möglichst wenigen Mattzügen; bei Gleichstand
   * zuerst Schlagen, dann ein Königszug. Ohne Antwort null. Gibt { zug, matt: Anzahl Mattzüge danach }.
   */
  function verteidigung(brett, z) {
    const b1 = ziehe(brett, z);
    let beste = null;
    for (const a of zuege(b1, "b")) {
      const n = mattZuege(ziehe(b1, a)).length;
      const rang = n * 4 + (a.schlag ? 0 : a.fig === "K" ? 1 : 2);
      if (!beste || rang < beste.rang) beste = { zug: a, matt: n, rang };
    }
    return beste && { zug: beste.zug, matt: beste.matt };
  }

  /**
   * Warum der Zug z von Weiss kein Matt ist und wie die Eule antwortet: { art, antwort? }.
   * art: "patt" (Schwarz kann nicht ziehen, steht nicht im Schach), "flucht" (König zieht weg),
   * "schlagen" (die Schach gebende Figur wird geschlagen), "dazwischen" (eine Figur stellt sich
   * dazwischen), "kein-schach" (Schwarz zieht einfach weiter). Für Matt in 2 (zwei = true) die Antwort,
   * nach der kein Matt mehr folgt.
   */
  function warumNicht(brett, z, zwei = false) {
    const b1 = ziehe(brett, z);
    const antworten = zuege(b1, "b");
    if (!antworten.length) return { art: imSchach(b1, "b") ? "matt" : "patt" };
    let antwort;
    if (zwei) antwort = verteidigung(brett, z).zug;
    else {
      // Zuerst schlagen, dann fliehen, dann dazwischen — so sieht das Kind den Grund am deutlichsten.
      const nachRang = a => (a.nach === z.nach ? 0 : a.fig === "K" ? 1 : 2);
      antwort = antworten.slice().sort((a, b) => nachRang(a) - nachRang(b))[0];
    }
    const schach = imSchach(b1, "b");
    const art = !schach ? "kein-schach" : antwort.nach === z.nach ? "schlagen" : antwort.fig === "K" ? "flucht" : "dazwischen";
    return { art, antwort, schach };
  }

  /** Zug als Text: „Turm a1 → a8“, beim Schlagen „Turm a1 schlägt auf a8“. */
  const zugText = (brett, z) => `${NAME[brett[z.von].toUpperCase()]} ${feld(z.von)} ${brett[z.nach] ? "schlägt auf" : "→"} ${feld(z.nach)}`;

  /**
   * Allgemeine Mängel einer Stellung (Liste, leer = in Ordnung): FEN lesbar, Weiss am Zug, je ein König,
   * Könige nicht nebeneinander, keiner im Schach, Bauern nicht auf der ersten oder letzten Reihe; dazu
   * nichts, was Rochade, en passant oder Umwandlung ins Spiel bringen könnte. zwei: Matt in 2 (Weiss zieht
   * zweimal, Schwarz einmal) — dann schärfere Grenzen für Bauern.
   */
  function maengel(fen, zwei = false) {
    let s;
    try { s = ausFen(fen); } catch (e) { return [`FEN nicht lesbar: ${e.message}`]; }
    const m = [];
    const { brett } = s;
    if (s.amZug !== "w") m.push("Weiss ist nicht am Zug");
    const zahl = p => brett.filter(x => x === p).length;
    if (zahl("K") !== 1 || zahl("k") !== 1) { m.push("nicht genau ein König je Farbe"); return m; }
    const wk = koenig(brett, "w"), sk = koenig(brett, "b");
    if (Math.max(Math.abs(linie(wk) - linie(sk)), Math.abs(reihe(wk) - reihe(sk))) < 2) m.push("Könige stehen nebeneinander");
    if (imSchach(brett, "b")) m.push("Schwarz steht vor dem Zug im Schach (unmöglich, Weiss ist am Zug)");
    if (imSchach(brett, "w")) m.push("Weiss steht vor dem Zug im Schach");
    if (zahl("P") > 8 || zahl("p") > 8) m.push("mehr als acht Bauern");
    // Nicht mehr Figuren als in der Grundstellung, Läufer auf verschiedenen Farben — sonst wäre eine
    // Umwandlung vorausgegangen.
    for (const [p, n] of [["Q", 1], ["R", 2], ["B", 2], ["N", 2]]) {
      for (const q of [p, p.toLowerCase()]) if (zahl(q) > n) m.push(`mehr als ${n} ${NAME[p]} einer Farbe`);
    }
    for (const q of ["B", "b"]) {
      const felder = brett.map((x, i) => (x === q ? (linie(i) + reihe(i)) % 2 : -1)).filter(x => x >= 0);
      if (felder.length === 2 && felder[0] === felder[1]) m.push("zwei Läufer einer Farbe auf gleichfarbigen Feldern");
    }
    for (let i = 0; i < 64; i++) {
      const p = brett[i];
      if (p === "P") {
        // Umwandlung: Ein weisser Bauer darf die letzte Reihe nicht erreichen können (Matt in 2: in zwei Zügen).
        if (reihe(i) === 0 || reihe(i) >= (zwei ? 5 : 6)) m.push(`weisser Bauer auf ${feld(i)} (Reihe 1 oder Umwandlung möglich)`);
        // en passant: Zieht Weiss den Bauern zwei Felder vor, dürfte ein schwarzer Bauer daneben ihn schlagen.
        if (reihe(i) === 1) for (const dl of [-1, 1]) { const j = neben(i, dl, 2); if (j >= 0 && brett[j] === "p") m.push(`en passant möglich nach ${feld(i)}–${feld(neben(i, 0, 2))}`); }
      }
      if (p === "p") {
        // Schwarz zieht höchstens einmal; der Bauer darf dabei nicht umwandeln.
        if (reihe(i) <= 1 || reihe(i) === 7) m.push(`schwarzer Bauer auf ${feld(i)} (Reihe 8 oder Umwandlung möglich)`);
        if (zwei && reihe(i) === 6) for (const dl of [-1, 1]) { const j = neben(i, dl, -2); if (j >= 0 && brett[j] === "P") m.push(`en passant möglich nach ${feld(i)}–${feld(neben(i, 0, -2))}`); }
      }
    }
    // Rochade: König und Turm auf den Ausgangsfeldern sähen nach Rochade aus.
    if (brett[4] === "K" && (brett[0] === "R" || brett[7] === "R")) m.push("weisse Rochade denkbar (König e1, Turm a1/h1)");
    if (brett[60] === "k" && (brett[56] === "r" || brett[63] === "r")) m.push("schwarze Rochade denkbar (König e8, Turm a8/h8)");
    return m;
  }

  /** Figuren einer Farbe ohne König, gezählt: { R: 2, B: 1 }. */
  function material(brett, c) {
    const n = {};
    for (const p of brett) if (p && farbe(p) === c && p.toUpperCase() !== "K") n[p.toUpperCase()] = (n[p.toUpperCase()] || 0) + 1;
    return n;
  }
  const summe = n => Object.values(n).reduce((a, b) => a + b, 0);
  const nur = (n, erlaubt) => Object.keys(n).every(k => erlaubt.includes(k));
  const amRand = i => linie(i) === 0 || linie(i) === 7 || reihe(i) === 0 || reihe(i) === 7;
  const abstand = (i, j) => Math.max(Math.abs(linie(i) - linie(j)), Math.abs(reihe(i) - reihe(j)));
  /** Felder um i, die auf dem Brett liegen. */
  const umgebung = i => NACHBAR.map(([a, b]) => neben(i, a, b)).filter(j => j >= 0);
  /** Ist nach dem Zug z noch Matt, wenn die Figur auf Feld j fehlt? */
  const mattOhne = (brett, z, j) => { const b = ziehe(brett, z); b[j] = null; return matt(b, "b"); };

  /**
   * Rätsel einer Stufe prüfen (Inhaltsliste stellungen.js, Spiel und Testskript): { maengel, loesung }.
   * loesung: s1–s5 der eine Mattzug; s6 { erster, antwort, matt } — erster Zug, zäheste Antwort der Eule,
   * ein Mattzug danach. Bedingungen je Stufe stehen in der Vorlage (strategie_raetsel.md, Abschnitt 2.3).
   */
  function pruefeRaetsel(fen, stufe) {
    const zwei = stufe === "s6";
    const m = maengel(fen, zwei);
    if (m.length) return { maengel: m, loesung: null };
    const { brett } = ausFen(fen);
    const w = material(brett, "w"), s = material(brett, "b");
    const sk = koenig(brett, "b");
    if (zwei) {
      if (mattZuege(brett).length) m.push("schon Matt in 1 möglich");
      const erste = mattInZwei(brett);
      if (erste.length !== 1) { m.push(`${erste.length} erste Züge für Matt in 2 statt genau einer`); return { maengel: m, loesung: null }; }
      const erster = erste[0];
      const b1 = ziehe(brett, erster);
      // Still (kein Schach) oder ein Opfer (Schwarz kann die gezogene Figur schlagen).
      const opfer = zuege(b1, "b").some(a => a.nach === erster.nach);
      if (imSchach(b1, "b") && !opfer) m.push("erster Zug gibt Schach und ist kein Opfer");
      if (summe(w) < 1 || summe(w) > 3) m.push("Weiss braucht 1 bis 3 Figuren neben dem König");
      if (summe(s) > 4) m.push("Schwarz hat mehr als 4 Figuren neben dem König");
      const antwort = verteidigung(brett, erster).zug;
      const matt2 = mattZuege(ziehe(b1, antwort))[0];
      return { maengel: m, loesung: { erster, antwort, matt: matt2, opfer, still: !imSchach(b1, "b") } };
    }
    const loesungen = mattZuege(brett);
    if (loesungen.length !== 1) { m.push(`${loesungen.length} Mattzüge statt genau einer`); return { maengel: m, loesung: null }; }
    const z = loesungen[0];
    if (z.fig === "K") m.push("Matt durch einen Königszug (Abzugsschach ist für diese Stufen zu versteckt)");
    const neben_ = umgebung(sk).includes(z.nach);
    const bn = Object.keys(w).filter(k => k === "B" || k === "N");
    switch (stufe) {
      case "s1":
        if (!(w.R === 1 && summe(w) === 1) || summe(s)) m.push("s1: nur König und Turm gegen König");
        if (!amRand(sk)) m.push("s1: schwarzer König nicht am Rand");
        break;
      case "s2":
        if (!(w.Q === 1 && summe(w) === 1) || summe(s)) m.push("s2: nur König und Dame gegen König");
        if (neben_) m.push("s2: Dame setzt direkt neben den König (gehört nach s3)");
        break;
      case "s3": {
        const tuerme = w.R === 2 && summe(w) === 2 && amRand(sk);
        const dame = w.Q === 1 && summe(w) === 1 && neben_;
        if (summe(s) || !(tuerme || dame)) m.push("s3: zwei Türme gegen König am Rand oder Dame mit Deckung direkt neben dem König");
        break;
      }
      case "s4": {
        if (!bn.length || w.P || summe(w) < 2 || summe(w) > 3) m.push("s4: Weiss mit Läufer oder Springer und 1–2 weiteren Figuren, ohne Bauern");
        if (!nur(s, ["P"]) || summe(s) > 2) m.push("s4: Schwarz höchstens zwei Bauern");
        if (umgebung(sk).length < 5) m.push("s4: schwarzer König in der Ecke");
        // Läufer oder Springer zählt: Er setzt selbst matt, oder ohne ihn wäre es kein Matt.
        const braucht = bn.includes(z.fig) || brett.some((p, j) => (p === "B" || p === "N") && j !== z.von && !mattOhne(brett, z, j));
        if (!braucht) m.push("s4: Läufer oder Springer spielt keine Rolle");
        break;
      }
      case "s5": {
        if (summe(s) < 2 || summe(s) > 5) m.push("s5: Schwarz braucht 2–5 Figuren neben dem König");
        if (summe(w) < 1 || summe(w) > 3) m.push("s5: Weiss mit 1–3 Figuren neben dem König");
        const eigene = umgebung(sk).filter(j => brett[j] && farbe(brett[j]) === "b");
        if (eigene.length < 2) m.push("s5: weniger als zwei eigene Figuren neben dem schwarzen König");
        // Verstellen: Ohne eine der eigenen Figuren neben dem König wäre es kein Matt.
        if (!eigene.some(j => j !== z.nach && !mattOhne(brett, z, j))) m.push("s5: die eigenen Figuren verstellen nichts");
        break;
      }
      default: m.push(`unbekannte Stufe ${stufe}`);
    }
    return { maengel: m, loesung: z };
  }

  return {
    NAME, DER, DEN, ZEICHEN, istWeiss, farbe, linie, reihe, feld, index, neben, ausFen, zuFen,
    angegriffen, zuege, zuegeOhneSchach: rohZuege, ziehe, koenig, imSchach, matt, patt, mattZuege, mattInZwei, verteidigung, warumNicht,
    zugText, gleich, maengel, material, amRand, umgebung, abstand, pruefeRaetsel,
  };
})();
