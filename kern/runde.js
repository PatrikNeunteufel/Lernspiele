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

  /**
   * Runde oder Rekord in die Liste eintragen: gleiche Kennung = Zwischenstand derselben Runde oder Serie, wird ersetzt
   * (RA3 a). Neue Liste. (rekordEintragen: derselbe Teil unter seinem Namen aus 1.19.0.)
   */
  function eintragen(liste, eintrag) {
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

  // ---------- Ablauf einer Runde (AR1 a; RA1–RA4 a, RA7 a) ----------
  /** So viele Fehlversuche, dann zeigt die App die Lösung (wenn sie eine nennt). */
  const LOESUNG_NACH = 3;
  /** Höchstens so viele Eingaben je Aufgabe im Eintrag (die letzten). */
  const EINGABEN_MAX = 6;
  const messuhrStandard = () => (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());

  /**
   * Ablauf einer Runde oder Serie ohne Oberfläche. Die App meldet je Aufgabe: gestellt(), bereit() (das Kind kann
   * antworten; ohne Meldung zählt die Zeit ab gestellt, RA7 a), pause()/weiter() (Hilfe, Melden: zählt nicht), eingabe(),
   * falsch(), zeitUm(), richtig(), uebersprungen(); zusatz() hängt Felder der App an die Aufgabe (tipps, vorgehen, lp,
   * rechner). Der Kern zählt Versuche und Fehler (Zeit um ist ein Fehler, die Aufgabe bleibt offen), sagt, wann die
   * Lösung zu zeigen ist (nach dem dritten Fehlversuch, wenn die App eine Lösung nennt), wann die Serie vorbei ist (erste
   * falsche Antwort oder Zeit um) und die Runde (anzahl Aufgaben oder erschoepft()), und baut Eintrag und Rekord.
   * opt: { endlos, anzahl, loesungNach, id, uhr: () => Date (Zeit des Eintrags), messuhr: () => ms (Dauer, Zeiten) }
   */
  function lauf({ endlos = false, anzahl = Infinity, loesungNach = LOESUNG_NACH, id = null,
    uhr = () => new Date(), messuhr = messuhrStandard } = {}) {
    const beginn = messuhr();
    // Kennung erst, wenn ein Eintrag oder Rekord sie braucht (dann fest für Zwischen- und Endstand): wie bisher beim
    // Speichern gezogen, damit die Zufallsfolge eines Testlaufs mit Startwert gleich bleibt
    let kennung = id;
    const kennungJetzt = () => (kennung ||= KERN.runden.neueId());
    const liste = [];
    let a = null; // offene Aufgabe
    let fehler = 0, geschafft = 0, gezeigt = 0, verloren = false, erschoepft = false;
    const offen = () => { if (!a) throw new Error("runde: keine Aufgabe offen"); return a; };

    function abschliessen(geloest, art = {}) {
      const x = offen(), jetzt = messuhr();
      if (x.pauseSeit !== null) { x.pausiert += jetzt - x.pauseSeit; x.pauseSeit = null; }
      // ab bereit; wer schon vorher antwortet (während Töne laufen), ab gestellt (RA7 a)
      const ab = x.bereit !== null && x.bereit <= jetzt ? x.bereit : x.gestellt;
      const e = { ms: Math.round(Math.max(0, jetzt - ab - x.pausiert)), versuche: x.versuche, geloest,
        ...(art.gezeigt ? { gezeigt: true } : {}), ...(art.uebersprungen ? { uebersprungen: true } : {}), ...(x.zeitUm ? { zeitUm: true } : {}) };
      // Angaben zur Aufgabe nur, wenn sie einen Fehler hatte (RA4 a)
      if (x.versuche > 0 || x.zeitUm) Object.assign(e, { text: x.text || "", loesung: x.loesung || "", eingaben: x.eingaben.slice(-EINGABEN_MAX) });
      Object.assign(e, x.zusatz);
      liste.push(e);
      a = null;
      return e;
    }
    const merke = ({ text, loesung, eingabe } = {}) => {
      const x = offen();
      if (text && !x.text) x.text = String(text);
      if (loesung && !x.loesung) x.loesung = String(loesung);
      if (eingabe !== undefined && eingabe !== null && eingabe !== "") x.eingaben.push(String(eingabe));
    };

    const r = {
      get id() { return kennungJetzt(); },
      /** Neue Aufgabe; text und loesung (Text) für den Eintrag, falls sie einen Fehler bekommt. */
      gestellt({ text = "", loesung = "" } = {}) {
        if (a) throw new Error("runde: vorige Aufgabe noch offen");
        if (r.vorbei) throw new Error("runde: vorbei");
        a = { gestellt: messuhr(), bereit: null, pauseSeit: null, pausiert: 0, versuche: 0, zeitUm: false,
          text: text ? String(text) : "", loesung: loesung ? String(loesung) : "", eingaben: [], zusatz: {} };
      },
      /** Ab jetzt kann das Kind antworten (Töne, „▶ Los!“, Vorlesen fertig); wirkt einmal. */
      bereit() { const x = offen(); if (x.bereit === null) x.bereit = messuhr(); },
      pause() { const x = offen(); if (x.pauseSeit === null) x.pauseSeit = messuhr(); },
      weiter() { const x = offen(); if (x.pauseSeit !== null) { x.pausiert += messuhr() - x.pauseSeit; x.pauseSeit = null; } },
      eingabe(t) { merke({ eingabe: t }); },
      zusatz(felder) { Object.assign(offen().zusatz, felder); },
      /**
       * Falsche Antwort ({ text, loesung, eingabe } für den Eintrag). Ergebnis: { versuche, loesungZeigen, vorbei }
       * — loesungZeigen nach dem dritten Fehlversuch mit Lösung (die Aufgabe ist dann abgeschlossen), vorbei in einer Serie.
       */
      falsch(angaben = {}) {
        const x = offen();
        merke(angaben);
        x.versuche++; fehler++;
        if (endlos) { verloren = true; abschliessen(false); return { versuche: x.versuche, loesungZeigen: false, vorbei: true }; }
        const zeigen = x.versuche >= loesungNach && !!x.loesung;
        if (zeigen) { gezeigt++; abschliessen(false, { gezeigt: true }); }
        return { versuche: x.versuche, loesungZeigen: zeigen, vorbei: false };
      },
      /** Zeit um: ein Fehler, die Aufgabe bleibt offen; in einer Serie ist sie vorbei. */
      zeitUm(angaben = {}) {
        const x = offen();
        merke(angaben);
        if (x.zeitUm) return { vorbei: false };
        x.zeitUm = true; fehler++;
        if (endlos) { verloren = true; abschliessen(false); return { vorbei: true }; }
        return { vorbei: false };
      },
      /** Richtige Antwort: { aufAnhieb } (ohne Fehlversuch; Zeit um zählt nicht dagegen). */
      richtig(angaben = {}) {
        merke(angaben);
        const e = abschliessen(true);
        geschafft++;
        return { aufAnhieb: e.versuche === 0 };
      },
      /** Übersprungen (Testhilfe): abgeschlossen, nicht gelöst. */
      uebersprungen() { abschliessen(false, { uebersprungen: true }); },
      /** Die Stufe gibt keine neue Aufgabe mehr her (KERN.runde.auswahl): die Runde ist gekürzt, die Serie geschafft. */
      erschoepft() { erschoepft = true; },
      get offen() { return !!a; },
      get versuche() { return a ? a.versuche : 0; },
      get aufgaben() { return liste.length; },
      get fehler() { return fehler; },
      get geschafft() { return geschafft; },
      get gezeigt() { return gezeigt; },
      get liste() { return liste.slice(); },
      get erschoepftIst() { return erschoepft; },
      get vorbei() { return erschoepft || verloren || (!endlos && liste.length >= anzahl); },
      /**
       * Protokolleintrag (R1 a, RA1–RA4 a): zeit = jetzt (Ende), dauer in s auf 0,1 s, aufgaben, fehler, gezeigt, liste;
       * endlos, gekuerzt (geplante Zahl), abgebrochen (Zwischenstand beim Verlassen; eine offene Aufgabe zählt nicht).
       * felder: person, inhalt, stufe und die Felder der App.
       */
      eintrag(felder = {}, { abgebrochen = false } = {}) {
        const e = { id: kennungJetzt(), zeit: uhr().toISOString(), ...felder, aufgaben: liste.length, fehler, gezeigt,
          dauer: sekunden(messuhr() - beginn), liste: liste.slice() };
        if (endlos) e.endlos = true;
        if (!endlos && erschoepft && Number.isFinite(anzahl) && liste.length < anzahl) e.gekuerzt = anzahl;
        if (abgebrochen) e.abgebrochen = true;
        return e;
      },
      /** Rekord einer Serie (gleiche Kennung wie der Eintrag): punkte = richtig in Folge; alles = Stufe erschöpft. */
      rekord(felder = {}, { abgebrochen = false } = {}) {
        return { id: kennungJetzt(), zeit: uhr().toISOString(), ...felder, punkte: geschafft, dauer: sekunden(messuhr() - beginn),
          ...(erschoepft ? { alles: true } : {}), ...(abgebrochen ? { abgebrochen: true } : {}) };
      },
    };
    return r;
  }

  /** Aufgaben eines Eintrags mit Fehler (Fehlversuch oder Zeit um) — was früher fehlerAufgaben (Eulenpfad) hiess. */
  const mitFehler = e => (Array.isArray(e && e.liste) ? e.liste : []).filter(x => x && (x.versuche > 0 || x.zeitUm));
  /** Auf Anhieb gelöst: ohne Fehlversuch, ohne Zeit um, ohne Tipp. */
  const aufAnhieb = x => !!x && x.geloest === true && !(x.versuche > 0) && !x.zeitUm && !x.tipps;

  // ---------- Ältere Einträge umdeuten (RA4 a; RA1 a im Lernsteig) ----------
  /**
   * Runde des Eulenpfads bis LERN_Session18: aufgabenZeiten (je Aufgabe) und fehlerAufgaben (nur mit Fehler, in derselben
   * Reihenfolge: angelegt beim ersten Fehlversuch oder bei Zeit um) → liste. Ohne aufgabenZeiten (Runden der ersten
   * Sitzungen): je Aufgabe mit Fehler ein Eintrag aus fehlerAufgaben, die übrigen ohne Zeit als auf Anhieb gelöst.
   * Andere Einträge bleiben, wie sie sind.
   */
  function ausEulenpfad(e) {
    if (!e || typeof e !== "object" || !("aufgabenZeiten" in e || "fehlerAufgaben" in e)) return e;
    const { aufgabenZeiten, fehlerAufgaben, ...rest } = e;
    const zeiten = Array.isArray(aufgabenZeiten) ? aufgabenZeiten : null;
    const fa = (Array.isArray(fehlerAufgaben) ? fehlerAufgaben : []).filter(f => f && typeof f === "object");
    const angaben = f => ({ text: String(f.text || ""), loesung: String(f.loesung || ""), eingaben: [] });
    let liste;
    if (zeiten) {
      let k = 0;
      liste = zeiten.map(z => {
        const x = { ...z };
        if (x.versuche > 0 || x.zeitUm) { const f = fa[k++]; Object.assign(x, angaben(f || {})); }
        if (!x.geloest && !x.uebersprungen && x.versuche > 0) x.gezeigt = true;
        return x;
      });
    } else {
      liste = fa.map(f => ({ versuche: Number(f.versuche) || 0, geloest: !!f.geloest, ...(f.zeitUm ? { zeitUm: true } : {}),
        ...(!f.geloest && f.versuche > 0 ? { gezeigt: true } : {}), ...angaben(f) }));
      const n = Math.max(0, (Number(e.aufgaben) || 0) - liste.length);
      for (let i = 0; i < n; i++) liste.push({ versuche: 0, geloest: true });
    }
    return { ...rest, liste, gezeigt: liste.filter(x => x.gezeigt).length };
  }
  /**
   * Runde des Lernsteigs bis LERN_Session18: zeit war der Beginn (RA1 a: jetzt das Ende, zeit + dauer), zeiten (ms der
   * gelösten oder aufgelösten Aufgaben), liste ({ lp, versuche, gezeigt, rechner }), falsch ([{ text, eingaben }] in der
   * Reihenfolge der Aufgaben mit Fehlversuch, gleiche Texte zusammen) → eine liste. Andere bleiben.
   */
  function ausLernsteig(e) {
    if (!e || typeof e !== "object" || !("zeiten" in e || "falsch" in e)) return e;
    const { zeiten, falsch, ...rest } = e;
    const ms = Array.isArray(zeiten) ? zeiten : [];
    const fa = (Array.isArray(falsch) ? falsch : []).filter(f => f && typeof f === "object");
    const alt = Array.isArray(e.liste) ? e.liste : [];
    let j = 0, k = 0;
    const liste = alt.map((x, i) => {
      // die letzte Aufgabe einer Serie, falsch beantwortet: ohne Zeit, nicht gelöst
      const serieVerloren = e.endlos && i === alt.length - 1 && x.versuche > 0 && !x.gezeigt;
      const n = { ...x, geloest: !x.gezeigt && !serieVerloren };
      if (!x.gezeigt) delete n.gezeigt;
      if (!serieVerloren && j < ms.length) n.ms = ms[j++];
      if (x.versuche > 0) { const f = fa[k++] || {}; Object.assign(n, { text: String(f.text || ""), loesung: "", eingaben: Array.isArray(f.eingaben) ? f.eingaben.map(String).slice(-EINGABEN_MAX) : [] }); }
      return n;
    });
    const n = { ...rest, liste };
    const beginn = Date.parse(e.zeit);
    if (!Number.isNaN(beginn) && typeof e.dauer === "number") n.zeit = new Date(beginn + Math.round(e.dauer * 1000)).toISOString();
    return n;
  }

  KERN.runde = { SERIE_MAX, VERSUCHE, GEDAECHTNIS_MAX, LOESUNG_NACH, gedaechtnis, auswahl, eintragen, rekordEintragen: eintragen,
    bestwert, bestzeit, sekunden, waechter, lauf, mitFehler, aufAnhieb, ausEulenpfad, ausLernsteig };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
