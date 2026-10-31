"use strict";
/* Netz-Falter: Körper, Abwicklungen und das Zurückfalten — reine Geometrie, ohne DOM.
   Ein Körper ist { name, V: [[x, y, z]], F: [[Ecken-Nr., …]] } mit Flächen gegen den Uhrzeigersinn
   von aussen gesehen. Ein Netz ist eine Liste ebener Vielecke [[x, y], …], ebenfalls gegen den
   Uhrzeigersinn. Zwei Vielecke sind verklebt, wenn sie eine Kante genau teilen (wie beim Papier).
   falte(K, netz) sucht alle Zuordnungen Vieleck → Fläche, die beim Falten den Körper ergeben;
   ein Netz ist genau dann ein Netz von K, wenn es mindestens eine gibt. */

const NETZ = (() => {
  const EPS = 1e-4;
  const sub = (a, b) => a.map((x, i) => x - b[i]);
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const laenge = a => Math.sqrt(dot(a, a));
  const einheit = a => a.map(x => x / laenge(a));
  const abstand = (a, b) => laenge(sub(a, b));
  const runde = x => Math.round(x * 1e6) / 1e6 + 0; // + 0: aus −0 wird 0

  /** Flächen so drehen, dass sie von aussen gesehen gegen den Uhrzeigersinn laufen. */
  function koerper(name, V, F) {
    const mitte = V[0].map((_, i) => V.reduce((s, v) => s + v[i], 0) / V.length);
    F = F.map(f => {
      const n = kreuz(sub(V[f[1]], V[f[0]]), sub(V[f[2]], V[f[0]]));
      const fm = V[0].map((_, i) => f.reduce((s, k) => s + V[k][i], 0) / f.length);
      return dot(n, sub(fm, mitte)) > 0 ? f : f.slice().reverse();
    });
    const kante = new Map(); // "A>B" → Fläche mit der gerichteten Kante A→B
    F.forEach((f, i) => f.forEach((a, k) => kante.set(a + ">" + f[(k + 1) % f.length], i)));
    return { name, V, F, kante };
  }

  /** Quader a × b × c (Würfel: a = b = c). */
  function quader(a, b, c) {
    const V = [];
    for (const x of [0, a]) for (const y of [0, b]) for (const z of [0, c]) V.push([x, y, z]);
    const id = (x, y, z) => x * 4 + y * 2 + z;
    const F = [
      [id(0, 0, 0), id(0, 1, 0), id(0, 1, 1), id(0, 0, 1)], [id(1, 0, 0), id(1, 1, 0), id(1, 1, 1), id(1, 0, 1)],
      [id(0, 0, 0), id(1, 0, 0), id(1, 0, 1), id(0, 0, 1)], [id(0, 1, 0), id(1, 1, 0), id(1, 1, 1), id(0, 1, 1)],
      [id(0, 0, 0), id(1, 0, 0), id(1, 1, 0), id(0, 1, 0)], [id(0, 0, 1), id(1, 0, 1), id(1, 1, 1), id(0, 1, 1)],
    ];
    return koerper(a === b && b === c ? "Würfel" : "Quader", V, F);
  }

  /** Gerades Prisma mit gleichseitigem Dreieck (Seite 1) und Länge L. */
  function dreiecksprisma(L) {
    const d = [[0, 0], [1, 0], [0.5, Math.sqrt(3) / 2]];
    const V = [...d.map(([x, z]) => [x, 0, z]), ...d.map(([x, z]) => [x, L, z])];
    return koerper("Dreiecksprisma", V, [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]]);
  }

  /** Pyramide mit quadratischer Grundfläche (Seite s) und Höhe h. */
  function pyramide(s, h) {
    const V = [[0, 0, 0], [s, 0, 0], [s, s, 0], [0, s, 0], [s / 2, s / 2, h]];
    return koerper("Pyramide", V, [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]]);
  }

  /** Fläche f in ihrer eigenen Ebene: Koordinaten gegen den Uhrzeigersinn. */
  function eben(K, f) {
    const P = K.F[f].map(i => K.V[i]);
    const e1 = einheit(sub(P[1], P[0]));
    const n = einheit(kreuz(sub(P[1], P[0]), sub(P[2], P[0])));
    const e2 = kreuz(n, e1);
    return P.map(p => [dot(sub(p, P[0]), e1), dot(sub(p, P[0]), e2)]);
  }

  const flaeche2 = poly => poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2;

  /** Überlappen zwei konvexe Vielecke mit Fläche (Berühren zählt nicht)? */
  function ueberlappen(A, B) {
    for (const P of [A, B]) for (let i = 0; i < P.length; i++) {
      const p = P[i], q = P[(i + 1) % P.length];
      const ach = [q[1] - p[1], p[0] - q[0]];
      const proj = X => X.map(x => x[0] * ach[0] + x[1] * ach[1]);
      const a = proj(A), b = proj(B);
      if (Math.min(...a) >= Math.max(...b) - EPS || Math.min(...b) >= Math.max(...a) - EPS) return false;
    }
    return true;
  }

  // Gleiche Punkte: nach Drehungen weichen die Koordinaten um Millionstel ab.
  const NAH = 1e-4;
  const gleicherPunkt = (p, q) => Math.abs(p[0] - q[0]) < NAH && Math.abs(p[1] - q[1]) < NAH;

  /** Verklebte Kanten: [i, k, j, l] — Kante k von Vieleck i ist Kante l von j (umgekehrt). */
  function klebekanten(netz) {
    const kanten = [];
    netz.forEach((poly, i) => poly.forEach((p, k) => kanten.push({ i, k, p, q: poly[(k + 1) % poly.length] })));
    const liste = [];
    for (const e of kanten) for (const f of kanten) {
      if (e.i !== f.i && gleicherPunkt(e.p, f.q) && gleicherPunkt(e.q, f.p)) liste.push([e.i, e.k, f.i, f.k]);
    }
    return liste;
  }

  /**
   * Berühren sich zwei Vielecke entlang einer Strecke, ohne genau dieselbe Kante zu haben (oder
   * liegen zwei verschiedene Vielecke auf derselben Kante)? Solche Netze wären nicht eindeutig.
   */
  function unsauber(netz) {
    const kanten = [];
    netz.forEach((poly, i) => poly.forEach((p, k) => kanten.push({ i, p, q: poly[(k + 1) % poly.length] })));
    for (let x = 0; x < kanten.length; x++) for (let y = x + 1; y < kanten.length; y++) {
      const e = kanten[x], f = kanten[y];
      if (e.i === f.i) continue;
      const gleich = gleicherPunkt(e.p, f.q) && gleicherPunkt(e.q, f.p);
      if (gleich) continue;
      // auf einer Geraden und mit gemeinsamem Stück?
      const d = [e.q[0] - e.p[0], e.q[1] - e.p[1]], L = Math.hypot(...d);
      const quer = r => Math.abs((r[0] - e.p[0]) * d[1] - (r[1] - e.p[1]) * d[0]) / L;
      if (quer(f.p) > EPS || quer(f.q) > EPS) continue;
      const lang = r => ((r[0] - e.p[0]) * d[0] + (r[1] - e.p[1]) * d[1]) / L;
      const a = Math.min(lang(f.p), lang(f.q)), b = Math.max(lang(f.p), lang(f.q));
      if (Math.min(b, L) - Math.max(a, 0) > EPS) return true;
    }
    return false;
  }

  function gueltigeLage(netz) {
    for (let i = 0; i < netz.length; i++) for (let j = i + 1; j < netz.length; j++) if (ueberlappen(netz[i], netz[j])) return false;
    return !unsauber(netz);
  }

  /** Zufällige Abwicklung von K (zufälliger aufspannender Baum der Flächen). null, wenn sie überlappt. */
  function abwickeln(K) {
    const n = K.F.length;
    const pos = new Array(n).fill(null);
    const start = Math.floor(Math.random() * n);
    pos[start] = eben(K, start);
    for (let gelegt = 1; gelegt < n; gelegt++) {
      const moeglich = [];
      pos.forEach((P, f) => {
        if (!P) return;
        K.F[f].forEach((A, k) => {
          const B = K.F[f][(k + 1) % K.F[f].length];
          const g = K.kante.get(B + ">" + A);
          if (!pos[g]) moeglich.push({ f, k, g, A, B });
        });
      });
      const w = moeglich[Math.floor(Math.random() * moeglich.length)];
      if (pos[w.g]) { gelegt--; continue; }
      const L = eben(K, w.g);
      const iA = K.F[w.g].indexOf(w.A), iB = K.F[w.g].indexOf(w.B);
      const P = pos[w.f][w.k], Q = pos[w.f][(w.k + 1) % K.F[w.f].length];
      const th = Math.atan2(Q[1] - P[1], Q[0] - P[0]) - Math.atan2(L[iB][1] - L[iA][1], L[iB][0] - L[iA][0]);
      const c = Math.cos(th), s = Math.sin(th);
      pos[w.g] = L.map(([x, y]) => { const u = x - L[iA][0], v = y - L[iA][1]; return [runde(P[0] + c * u - s * v), runde(P[1] + s * u + c * v)]; });
    }
    const netz = pos.map(P => P.map(([x, y]) => [runde(x), runde(y)]));
    return gueltigeLage(netz) ? netz : null;
  }

  /** Ist Vieleck poly (Ecke u ↔ Ecke (o + u) der Fläche f) kongruent zur Fläche? */
  function kongruent(K, f, o, poly) {
    const F = K.F[f], m = F.length;
    if (poly.length !== m || flaeche2(poly) <= 0) return false;
    for (let u = 0; u < m; u++) for (let v = u + 1; v < m; v++) {
      if (Math.abs(abstand(poly[u], poly[v]) - abstand(K.V[F[(o + u) % m]], K.V[F[(o + v) % m]])) > 1e-4) return false;
    }
    return true;
  }

  /**
   * Alle Arten, das Netz zu K zu falten: Liste von Zuordnungen [Fläche je Vieleck]. Leer = kein Netz.
   * Vom ersten Vieleck aus wird jede passende Fläche und Drehung versucht; über jede verklebte Kante
   * ist die Nachbarfläche dann bestimmt (die andere Fläche an derselben Körperkante).
   */
  function falte(K, netz) {
    if (netz.length !== K.F.length) return [];
    const kleben = klebekanten(netz);
    const nachbarn = netz.map(() => []);
    for (const [i, k, j, l] of kleben) nachbarn[i].push([k, j, l]);
    const loesungen = [];
    for (let f0 = 0; f0 < K.F.length; f0++) for (let o0 = 0; o0 < K.F[f0].length; o0++) {
      if (!kongruent(K, f0, o0, netz[0])) continue;
      const zu = netz.map(() => null);
      zu[0] = { f: f0, o: o0 };
      const schlange = [0];
      let ok = true;
      while (schlange.length && ok) {
        const i = schlange.shift();
        const Fi = K.F[zu[i].f], mi = Fi.length;
        for (const [k, j, l] of nachbarn[i]) {
          const A = Fi[(zu[i].o + k) % mi], B = Fi[(zu[i].o + k + 1) % mi];
          const g = K.kante.get(B + ">" + A);
          const Fg = K.F[g], mg = Fg.length;
          if (netz[j].length !== mg) { ok = false; break; }
          const t = Fg.indexOf(B);
          const o = ((t - l) % mg + mg) % mg;
          if (zu[j]) { if (zu[j].f !== g || zu[j].o !== o) { ok = false; break; } continue; }
          if (!kongruent(K, g, o, netz[j])) { ok = false; break; }
          zu[j] = { f: g, o };
          schlange.push(j);
        }
      }
      if (!ok || zu.some(z => !z)) continue;
      if (new Set(zu.map(z => z.f)).size !== K.F.length) continue;
      loesungen.push(zu.map(z => z.f));
    }
    return loesungen;
  }

  /** Gegenüberliegende Fläche in K (Quader: Fläche mit entgegengesetzter Normale). */
  function gegenueber(K, f) {
    const normale = g => { const P = K.F[g].map(i => K.V[i]); return einheit(kreuz(sub(P[1], P[0]), sub(P[2], P[0]))); };
    const n = normale(f);
    return K.F.findIndex((_, g) => dot(normale(g), n) < -1 + 1e-9);
  }

  /** Netz um den Winkel w drehen und in die Ecke (0, 0) schieben. */
  function drehe(netz, w) {
    const c = Math.cos(w), s = Math.sin(w);
    const r = netz.map(P => P.map(([x, y]) => [c * x - s * y, s * x + c * y]));
    const alle = r.flat();
    const mx = Math.min(...alle.map(p => p[0])), my = Math.min(...alle.map(p => p[1]));
    return r.map(P => P.map(([x, y]) => [runde(x - mx), runde(y - my)]));
  }
  const groesse = netz => { const a = netz.flat(); return [Math.max(...a.map(p => p[0])), Math.max(...a.map(p => p[1]))]; };

  /** Ein Blatt (Fläche mit nur einer verklebten Kante) an eine andere freie Kante gleicher Länge hängen. */
  function umhaengen(netz) {
    const kleben = klebekanten(netz);
    const grad = netz.map((_, i) => kleben.filter(e => e[0] === i).length);
    const blaetter = netz.map((_, i) => i).filter(i => grad[i] === 1);
    const i = blaetter[Math.floor(Math.random() * blaetter.length)];
    const rest = netz.filter((_, j) => j !== i);
    const belegt = new Set(klebekanten(rest).map(([a, k]) => a + ":" + k));
    const ziele = [];
    rest.forEach((P, a) => P.forEach((p, k) => { if (!belegt.has(a + ":" + k)) ziele.push([a, k]); }));
    const B = netz[i];
    for (const [a, k] of ziele.sort(() => Math.random() - 0.5)) {
      const P = rest[a][k], Q = rest[a][(k + 1) % rest[a].length];
      for (let l = 0; l < B.length; l++) {
        const R = B[l], S = B[(l + 1) % B.length];
        if (Math.abs(abstand(P, Q) - abstand(R, S)) > 1e-4) continue;
        // Kante R→S von B auf Q→P legen
        const th = Math.atan2(P[1] - Q[1], P[0] - Q[0]) - Math.atan2(S[1] - R[1], S[0] - R[0]);
        const c = Math.cos(th), s = Math.sin(th);
        const neu = B.map(([x, y]) => { const u = x - R[0], v = y - R[1]; return [runde(Q[0] + c * u - s * v), runde(Q[1] + s * u + c * v)]; });
        const kandidat = [...rest, neu];
        if (gueltigeLage(kandidat) && klebekanten(kandidat).length === klebekanten(rest).length + 2) return kandidat;
      }
    }
    return null;
  }

  return { quader, dreiecksprisma, pyramide, abwickeln, falte, gegenueber, klebekanten, gueltigeLage, drehe, groesse, umhaengen, flaeche2, runde };
})();
