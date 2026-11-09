/* Kern — Speicher im Browser mit Präfix der App (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.3).
   Alle Apps teilen den Ursprung patrikneunteufel.github.io und damit localStorage; darum schreibt jede App nur unter
   ihrem Präfix („lernspiele:“, „lernsteig:“, „gratwanderung:“). Der Kern kennt keine Schlüssel der Apps.
   Darf fehlen (privates Fenster, gesperrter Speicher, Node): dann gilt beim Lesen der Ersatz, Schreiben meldet false.

   Grosse Schlüssel (seit 1.34.0; docs/konzept_gruppen.md 5a, Entscheide D11 a, D11-W a): Was wächst (Runden, Rekorde,
   Meldungen, Löschvermerke), liegt in IndexedDB statt in localStorage — localStorage hat je Ursprung nur 5 MiB für alle
   Apps zusammen, IndexedDB ein Vielfaches (MDN, Storage quotas and eviction criteria, Stand 5.1.2026). Lesen und Schreiben
   bleiben sofort (Zwischenspeicher als JSON-Text, dieselbe Bedeutung wie localStorage); die Seite wartet beim Start
   einmal auf bereit(). Beim ersten bereit() zieht ein Wert aus localStorage um und wird dort erst nach dem Schreiben in
   IndexedDB gelöscht. Andere Tabs derselben App erfahren Änderungen über BroadcastChannel und lesen neu. Ohne
   IndexedDB (Node, Ersatz-DOM, sehr alte oder gesperrte Browser) bleiben die grossen Schlüssel in localStorage. */
"use strict";

(function (KERN) {
  // Über den globalen Namen, nicht über globalThis: Ersatz-DOMs der Testskripte (tools/pruef_dom.js) legen
  // localStorage als Variable an. Der Zugriff selbst kann werfen (gesperrte Cookies).
  const ablage = () => { try { return typeof localStorage !== "undefined" ? localStorage : null; } catch (e) { return null; } };
  const idb = () => { try { return typeof indexedDB !== "undefined" && indexedDB ? indexedDB : null; } catch (e) { return null; } };
  const STORE = "werte";
  /** Grenze von localStorage je Ursprung laut MDN: 5 MiB; gezählt in UTF-16, also 2 Byte je Zeichen. */
  const LOKAL_GRENZE_BYTE = 5 * 1024 * 1024;

  /** IndexedDB-Anfrage als Versprechen. */
  const alsVersprechen = req => new Promise((ok, fehler) => { req.onsuccess = () => ok(req.result); req.onerror = () => fehler(req.error); });

  /**
   * Speicher für ein Präfix: { praefix, lies(schluessel, ersatz), schreibe(schluessel, wert) → true|false,
   * entferne(schluessel), schluessel() → Liste der Schlüssel ohne Präfix, bereit() → Versprechen, modus(),
   * beiFehler(f), beiFremdAenderung(f) }. Werte als JSON.
   * opt.gross      Schlüssel, die in IndexedDB liegen (Standard: keine — dann wie bis 1.33)
   * opt.datenbank  Name der IndexedDB (je App eigener Name; nicht die des Abgleichs)
   * opt.vereinen   (schluessel, wertIndexedDB, wertLocalStorage) → vereinigter Wert oder undefined, für den Umzug, wenn
   *                ein Schlüssel in beiden liegt (Standard: Listen nach id; sonst bleiben beide liegen)
   */
  function speicher(praefix, opt = {}) {
    if (typeof praefix !== "string" || !/^[a-z][a-z0-9-]*:$/.test(praefix)) throw new Error(`ungültiges Präfix: ${praefix}`);
    const gross = new Set(opt.gross || []);
    if (gross.size && (typeof opt.datenbank !== "string" || !opt.datenbank)) throw new Error("speicher: datenbank fehlt");
    // Modus der grossen Schlüssel: „warten“ (vor bereit), „idb“ oder „lokal“ (ohne IndexedDB wie bis 1.33)
    let modus = !gross.size || !idb() ? "lokal" : "warten";
    const zwischen = new Map(); // Schlüssel → JSON-Text
    let db = null, bereitVersprechen = null;
    const fehlerHoerer = [], fremdHoerer = [];
    const meldeFehler = (schluessel, e) => { for (const f of fehlerHoerer) try { f(schluessel, e); } catch (x) { /* Hörer stört nicht */ } };
    const istGross = s => gross.has(s) && modus !== "lokal";
    /**
     * Zwei Fassungen eines grossen Schlüssels vereinigen (IndexedDB a, alter Rest aus localStorage b): zuerst opt.vereinen
     * der App (Rückgabe undefined = nicht zuständig), sonst Listen nach Kennung (id; a gewinnt, was nur in b steht, kommt
     * dazu); sonst undefined — dann bleiben beide liegen.
     */
    function vereinigen(s, a, b) {
      if (typeof opt.vereinen === "function") { const v = opt.vereinen(s, a, b); if (v !== undefined) return v; }
      if (Array.isArray(a) && Array.isArray(b)) {
        const da = new Set(a.filter(e => e && e.id !== undefined).map(e => e.id));
        return a.concat(b.filter(e => !(e && e.id !== undefined && da.has(e.id))));
      }
      return undefined;
    }
    const pruefeBereit = s => { if (modus === "warten") throw new Error(`speicher: „${praefix}${s}“ vor bereit() gelesen oder geschrieben`); };

    // ----- localStorage (kleine Schlüssel; grosse ohne IndexedDB) -----
    function liesLokal(schluessel, ersatz) {
      try {
        const v = ablage()?.getItem(praefix + schluessel);
        return v === null || v === undefined ? ersatz : JSON.parse(v);
      } catch (e) { return ersatz; }
    }
    function schreibeLokal(schluessel, text) {
      try {
        const a = ablage();
        if (!a) return false;
        a.setItem(praefix + schluessel, text);
        return true;
      } catch (e) { return false; } // voll oder gesperrt: der Aufrufer entscheidet, ob er warnt
    }

    // ----- IndexedDB: Schreiben je Schlüssel der Reihe nach, der letzte Stand gewinnt -----
    let kanal = null;
    const offen = new Map(); // Schlüssel → { text | null (löschen) } noch nicht geschrieben
    let kette = Promise.resolve();
    function nachIdb(schluessel, text) {
      offen.set(schluessel, text);
      kette = kette.then(async () => {
        if (!offen.has(schluessel)) return;
        const t = offen.get(schluessel);
        offen.delete(schluessel);
        try {
          await new Promise((ok, fehler) => {
            const tx = db.transaction(STORE, "readwrite");
            const s = tx.objectStore(STORE);
            if (t === null) s.delete(schluessel); else s.put(t, schluessel);
            tx.oncomplete = () => ok();
            tx.onerror = () => fehler(tx.error);
            tx.onabort = () => fehler(tx.error || new Error("abgebrochen"));
          });
          if (kanal) try { kanal.postMessage({ schluessel }); } catch (e) { /* ohne Kanal kein Hinweis an andere Tabs */ }
        } catch (e) { meldeFehler(schluessel, e); }
      });
      return kette;
    }

    /** Einmal beim Start abwarten: öffnet IndexedDB, liest die grossen Schlüssel, zieht alte Werte aus localStorage um. */
    function bereit() {
      if (bereitVersprechen) return bereitVersprechen;
      if (modus === "lokal") return (bereitVersprechen = Promise.resolve());
      bereitVersprechen = (async () => {
        try {
          const anfrage = idb().open(opt.datenbank, 1);
          anfrage.onupgradeneeded = () => { const d = anfrage.result; if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE); };
          db = await alsVersprechen(anfrage);
          for (const s of gross) {
            const tx = db.transaction(STORE, "readonly");
            const text = await alsVersprechen(tx.objectStore(STORE).get(s));
            // Umzug bei jedem Start: Was noch in localStorage liegt (erster Start, oder ein Tab mit der alten Fassung hat
            // nach dem Umzug noch geschrieben), kommt nach IndexedDB — liegt der Schlüssel schon in beiden, werden die
            // Fassungen vereinigt (vereinigen). Erst nach dem Schreiben in IndexedDB wird localStorage geleert.
            const alt = ablage()?.getItem(praefix + s);
            if (alt === null || alt === undefined) { if (typeof text === "string") zwischen.set(s, text); continue; }
            let neu = alt;
            if (typeof text === "string") {
              const v = vereinigen(s, JSON.parse(text), JSON.parse(alt));
              if (v === undefined) { zwischen.set(s, text); continue; } // nicht vereinbar: beide bleiben, nichts geht verloren
              neu = JSON.stringify(v);
            }
            zwischen.set(s, neu);
            await new Promise((ok, fehler) => {
              const t2 = db.transaction(STORE, "readwrite");
              t2.objectStore(STORE).put(neu, s);
              t2.oncomplete = () => ok(); t2.onerror = () => fehler(t2.error);
            });
            try { ablage()?.removeItem(praefix + s); } catch (e) { /* bleibt liegen, beim nächsten Start wieder vereinigt */ }
          }
          modus = "idb";
          if (typeof BroadcastChannel !== "undefined") {
            kanal = new BroadcastChannel(`kern-speicher:${opt.datenbank}`);
            kanal.onmessage = async ev => {
              const s = ev.data && ev.data.schluessel;
              if (!gross.has(s) || offen.has(s)) return;
              try {
                const t = await alsVersprechen(db.transaction(STORE, "readonly").objectStore(STORE).get(s));
                if (typeof t === "string") zwischen.set(s, t); else zwischen.delete(s);
                for (const f of fremdHoerer) try { f(s); } catch (x) { /* Hörer stört nicht */ }
              } catch (e) { /* beim nächsten Start */ }
            };
          }
        } catch (e) {
          // IndexedDB geht nicht (gesperrt, privates Fenster älterer Browser): wie bis 1.33 in localStorage
          db = null; zwischen.clear(); modus = "lokal";
        }
      })();
      return bereitVersprechen;
    }

    function lies(schluessel, ersatz) {
      if (gross.has(schluessel)) pruefeBereit(schluessel);
      if (!istGross(schluessel)) return liesLokal(schluessel, ersatz);
      const t = zwischen.get(schluessel);
      if (t === undefined) return ersatz;
      try { return JSON.parse(t); } catch (e) { return ersatz; }
    }
    function schreibe(schluessel, wert) {
      if (gross.has(schluessel)) pruefeBereit(schluessel);
      let text;
      try { text = JSON.stringify(wert); } catch (e) { return false; }
      if (!istGross(schluessel)) return schreibeLokal(schluessel, text);
      zwischen.set(schluessel, text);
      nachIdb(schluessel, text);
      return true; // ob IndexedDB es behalten hat, meldet beiFehler
    }
    function entferne(schluessel) {
      if (istGross(schluessel)) { zwischen.delete(schluessel); nachIdb(schluessel, null); return; }
      try { ablage()?.removeItem(praefix + schluessel); } catch (e) { /* fehlt */ }
    }
    function schluessel() {
      const a = ablage(), liste = [];
      try { for (let i = 0; a && i < a.length; i++) { const k = a.key(i); if (k && k.startsWith(praefix)) liste.push(k.slice(praefix.length)); } }
      catch (e) { /* fehlt */ }
      for (const s of zwischen.keys()) if (!liste.includes(s)) liste.push(s);
      return liste;
    }
    /** Warten, bis alles Geschriebene in IndexedDB angekommen ist (Tests, vor dem Verlassen der Seite). */
    const geschrieben = () => kette;

    return { praefix, lies, schreibe, entferne, schluessel, bereit, geschrieben, modus: () => modus,
      beiFehler: f => fehlerHoerer.push(f), beiFremdAenderung: f => fremdHoerer.push(f) };
  }

  /**
   * Belegung des Speichers dieses Ursprungs (D11 a): { lokal: { zeichen, byte, anteil } — localStorage aller Apps
   * zusammen gegen 5 MiB —, ablage: { belegt, verfuegbar, anteil } | null — navigator.storage.estimate() —, dauerhaft:
   * true|false|null, warnen: true ab 80 % in einem der beiden }.
   */
  async function belegung() {
    let zeichen = 0;
    const a = ablage();
    try { for (let i = 0; a && i < a.length; i++) { const k = a.key(i); zeichen += k.length + (a.getItem(k) || "").length; } } catch (e) { /* fehlt */ }
    const byte = zeichen * 2;
    const lokal = { zeichen, byte, anteil: byte / LOKAL_GRENZE_BYTE };
    let ablageWerte = null, dauerhaft = null;
    try {
      const sp = typeof navigator !== "undefined" ? navigator.storage : null;
      if (sp && sp.estimate) { const e = await sp.estimate(); if (e && e.quota) ablageWerte = { belegt: e.usage || 0, verfuegbar: e.quota, anteil: (e.usage || 0) / e.quota }; }
      if (sp && sp.persisted) dauerhaft = await sp.persisted();
    } catch (e) { /* ohne Angabe */ }
    return { lokal, ablage: ablageWerte, dauerhaft, warnen: lokal.anteil >= 0.8 || (!!ablageWerte && ablageWerte.anteil >= 0.8) };
  }
  /** Den Browser bitten, die Daten nicht von selbst zu löschen (navigator.storage.persist); true, false oder null. */
  async function dauerhaftBitten() {
    try {
      const sp = typeof navigator !== "undefined" ? navigator.storage : null;
      return sp && sp.persist ? await sp.persist() : null;
    } catch (e) { return null; }
  }

  speicher.belegung = belegung;
  speicher.dauerhaftBitten = dauerhaftBitten;
  speicher.LOKAL_GRENZE_BYTE = LOKAL_GRENZE_BYTE;
  KERN.speicher = speicher;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
