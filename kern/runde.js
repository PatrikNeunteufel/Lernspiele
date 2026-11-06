/* Kern — Ablauf einer Runde (AR1 a, LERN_Session18; Einzelentscheide RA1–RA8 a, LERN_Session19; docs/kern/rahmen.md 4.22).
   Erster Schritt: die reinen Hilfen, ohne Oberfläche und ohne Zeitgeber — Gedächtnis gegen Wiederholungen (RA5 a),
   Auswahl der nächsten Aufgabe mit Serienbremse und Kürzen bei erschöpfter Stufe (RA6 a), Rekord nach Kennung,
   Bestwert und Bestzeit, Wächter des Zwischenstands beim Verlassen, Dauer in Sekunden auf 0,1 s (RA2 a).
   Herkunft: eulenpfad/spiele/gemeinsam/spiel.js (Gedächtnis seit LERN_Session11, Serienbremse, Suche in fünf Stufen) und
   lernsteig/gemeinsam/rahmen.js (Rekord, Bestzeit, Zwischenstand). Die Kennung einer Aufgabe bildet die App (Eulenpfad aus
   der Fläche, Lernsteig aus dem Generator); der Kern vergleicht nur. */
"use strict";

(function (KERN) {
  /** Merkmale aus ctx.serie (Eulenpfad) höchstens so oft gleich hintereinander (Vorgabe Patrik 2026-11-01). */
  const SERIE_MAX = 3;
  /**
   * Suche nach einer neuen Aufgabe in fünf Stufen, je bis zu dieser Zahl von Zügen (LERN_Session11):
   *   1. weder in dieser Runde noch im Gedächtnis, ohne zu lange Serie;
   *   2. aus einer früheren Runde, wenn sonst ein Muster entstünde (die Serienbremse geht vor, der Durchgang bleibt);
   *   3. ungestellt, Serie notfalls erzwungen;
   *   4. aus früheren Runden: (fast) alle waren dran → neuer Durchgang, das Gedächtnis beginnt neu;
   *   5. eine Wiederholung dieser Runde, nie zweimal und nie direkt hintereinander (nicht in einer Serie).
   * Danach ist die Stufe erschöpft: die Runde endet früher (gekuerzt), die Serie mit „alles geschafft“.
   */
  const VERSUCHE = { serie: 40, gedaechtnis: 70, erzwingen: 90, durchgang: 105, ende: 120 };
  /** Höchstens so viele Fingerabdrücke je Gedächtnis (Person, Inhalt, Stufe). */
  const GEDAECHTNIS_MAX = 400;

  const fingerabdruck = wert => KERN.runden.fingerabdruck(wert);

  /**
   * Gedächtnis über Runden (RA5 a): je Schlüssel die Fingerabdrücke der gestellten Aufgaben in speicher.lies(feld, {}).
   * Eine Aufgabe kommt erst wieder, wenn (fast) alle verschiedenen einmal dran waren; dann beginnt ein neuer Durchgang.
   * alt: frühere Schlüssel desselben Gedächtnisses (etwa nach Name statt Kennung); sie werden beim ersten Merken
   * übernommen und entfernt.
   */
  function gedaechtnis({ speicher, schluessel, feld = "gestellt", alt = [], max = GEDAECHTNIS_MAX } = {}) {
    if (!speicher || typeof speicher.lies !== "function") throw new Error("gedaechtnis: speicher fehlt");
    if (!schluessel) throw new Error("gedaechtnis: schluessel fehlt");
    const alle = () => { const a = speicher.lies(feld, {}); return a && typeof a === "object" && !Array.isArray(a) ? a : {}; };
    const start = alle();
    const altDa = alt.filter(s => Array.isArray(start[s]));
    const menge = new Set(Array.isArray(start[schluessel]) ? start[schluessel] : altDa.flatMap(s => start[s]));
    function sichere() {
      const a = { ...alle() };
      for (const s of altDa) delete a[s];
      a[schluessel] = [...menge].slice(-max);
      speicher.schreibe(feld, a);
    }
    return {
      hat: fp => menge.has(fp),
      merke(fp) { menge.delete(fp); menge.add(fp); sichere(); },
      /** Neuer Durchgang: nur diese Fingerabdrücke bleiben (die der laufenden Runde). */
      beginneNeu(fps = []) { menge.clear(); for (const f of fps) menge.add(f); },
      get groesse() { return menge.size; },
    };
  }

  /**
   * Auswahl der Aufgaben einer Runde oder Serie (RA5 a, RA6 a). Die App zieht zufällig und fragt je Zug mit
   * pruefe(kennung, serien, versuch): { nehmen, serieErzwungen } — dann ist die Aufgabe gestellt —, { erschoepft } nach
   * VERSUCHE.ende Zügen ohne passende, sonst { weiter }. neueSuche() vor dem ersten Zug jeder Aufgabe.
   * kennung: Text, an dem man die Aufgabe wiedererkennt, oder null (dann gilt sie als neu); serien: { Merkmal: Wert }.
   */
  function auswahl({ gedaechtnis: gd = null, endlos = false, serieMax = SERIE_MAX, versuche = VERSUCHE } = {}) {
    const gestellt = new Map(); // Kennung → wie oft in dieser Runde
    const verlauf = {};         // Merkmal → Werte der gestellten Aufgaben
    let wiederholt = false, letzte = null, sahUngestellt = false;
    const serieZuLang = serien => Object.entries(serien || {}).some(([name, wert]) => {
      const bisher = verlauf[name] || [];
      return bisher.length >= serieMax && bisher.slice(-serieMax).every(w => w === String(wert));
    });
    const stufeDer = v => (v < versuche.serie ? 1 : v < versuche.gedaechtnis ? 2 : v < versuche.erzwingen ? 3 : v < versuche.durchgang ? 4 : 5);
    return {
      neueSuche() { sahUngestellt = false; },
      pruefe(kennung, serien = {}, versuch = 0) {
        const k = kennung || null;
        const n = k ? gestellt.get(k) || 0 : 0;
        const zuLang = serieZuLang(serien);
        const fp = k ? fingerabdruck(k) : null;
        const ungestellt = n === 0 && (!fp || !gd || !gd.hat(fp));
        if (ungestellt) sahUngestellt = true;
        const stufe = stufeDer(versuch);
        const passt = stufe === 1 ? ungestellt && !zuLang
          : stufe === 2 ? n === 0 && !zuLang
          : stufe === 3 ? ungestellt
          : stufe === 4 ? n === 0
          : !endlos && n === 1 && !wiederholt && k !== letzte;
        if (!passt) return versuch >= versuche.ende ? { erschoepft: true } : { weiter: true };
        if (gd && fp) {
          // Neuer Durchgang, wenn keine ungestellte Aufgabe mehr zu finden war (Stufe 4, oder Stufe 2 ohne eine einzige
          // ungestellte); in Stufe 2 mit gesperrten ungestellten ist es nur eine Ausnahme gegen ein Muster.
          if (gd.hat(fp) && (stufe === 4 || (stufe === 2 && !sahUngestellt))) gd.beginneNeu([...gestellt.keys()].map(fingerabdruck));
          gd.merke(fp);
        }
        if (n) wiederholt = true;
        if (k) gestellt.set(k, n + 1);
        letzte = k;
        for (const [name, wert] of Object.entries(serien || {})) (verlauf[name] ||= []).push(String(wert));
        return { nehmen: true, serieErzwungen: zuLang && stufe >= 3, wiederholung: n > 0 };
      },
      get gestellt() { return gestellt.size; },
    };
  }

  /** Rekord in die Liste eintragen: gleiche Kennung = Zwischenstand derselben Serie, wird ersetzt. Neue Liste. */
  function rekordEintragen(liste, eintrag) {
    const l = (Array.isArray(liste) ? liste : []).filter(r => !(r && eintrag.id && r.id === eintrag.id));
    l.push(eintrag);
    return l;
  }
  /** Höchster Punktestand der passenden Rekorde, 0 ohne. */
  const bestwert = (rekorde, passt = () => true) => (rekorde || []).filter(r => r && passt(r)).reduce((m, r) => Math.max(m, r.punkte || 0), 0);
  /** Kürzeste Dauer der passenden Runden — nur volle Runden ohne gezeigte Lösung, keine Serie (RA6 a); null ohne. */
  function bestzeit(runden, passt = () => true) {
    const z = (runden || []).filter(r => r && passt(r) && !r.endlos && !r.gekuerzt && !r.gezeigt && typeof r.dauer === "number").map(r => r.dauer);
    return z.length ? Math.min(...z) : null;
  }

  /** Dauer in Sekunden mit einer Nachkommastelle (RA2 a). */
  const sekunden = ms => Math.round(Math.max(0, ms) / 100) / 10;

  /**
   * Wächter des Zwischenstands: ruft beimVerlassen() auf, wenn die Seite verlassen wird (pagehide) oder verschwindet
   * (visibilitychange auf hidden; auf Tablets zuverlässiger). aus() nimmt ihn weg. fenster/dokument: für Tests.
   */
  function waechter(beimVerlassen, { fenster = globalThis, dokument = globalThis.document } = {}) {
    const verstecken = () => { if (dokument && dokument.visibilityState === "hidden") beimVerlassen(); };
    if (fenster && fenster.addEventListener) fenster.addEventListener("pagehide", beimVerlassen);
    if (dokument && dokument.addEventListener) dokument.addEventListener("visibilitychange", verstecken);
    let an = true;
    return {
      aus() {
        if (!an) return;
        an = false;
        if (fenster && fenster.removeEventListener) fenster.removeEventListener("pagehide", beimVerlassen);
        if (dokument && dokument.removeEventListener) dokument.removeEventListener("visibilitychange", verstecken);
      },
      get an() { return an; },
    };
  }

  KERN.runde = { SERIE_MAX, VERSUCHE, GEDAECHTNIS_MAX, gedaechtnis, auswahl, rekordEintragen, bestwert, bestzeit, sekunden, waechter };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
