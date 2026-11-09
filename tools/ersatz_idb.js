// Ersatz für IndexedDB in den Testskripten (Node kennt keine; keine Abhängigkeit, Entscheid LERN-1). Kann nur, was
// kern/speicher.js braucht: open mit onupgradeneeded, objectStoreNames.contains, createObjectStore, transaction mit
// objectStore().get/put/delete, oncomplete/onerror. Alles asynchron wie im Browser. Optionen: voll (put wirft
// QuotaExceededError), kaputt (open schlägt fehl). Die Daten liegen je Name in einer Map, über mehrere „Seiten“ teilbar.
// Als Text (ERSATZ_IDB_CODE) auch für die Ersatz-DOMs der Seitentests (vm-Kontext).
"use strict";

function ersatzIdb(daten = new Map(), opt = {}) {
  const spaeter = f => setTimeout(f, 0);
  const fehler = name => Object.assign(new Error(name), { name });
  function anfrage(arbeit) {
    const r = { result: undefined, error: null, onsuccess: null, onerror: null };
    spaeter(() => {
      try { r.result = arbeit(); if (r.onsuccess) r.onsuccess({ target: r }); }
      catch (e) { r.error = e; if (r.onerror) r.onerror({ target: r }); }
    });
    return r;
  }
  function datenbank(name) {
    if (!daten.has(name)) daten.set(name, new Map());
    const stores = daten.get(name);
    return {
      objectStoreNames: { contains: s => stores.has(s) },
      createObjectStore: s => { stores.set(s, new Map()); },
      transaction(s, modus) {
        const tx = { oncomplete: null, onerror: null, onabort: null, error: null, offen: 0 };
        const fertig = () => { if (--tx.offen === 0) spaeter(() => tx.oncomplete && tx.oncomplete()); };
        const scheitern = e => { tx.error = e; spaeter(() => tx.onerror && tx.onerror()); };
        const store = stores.get(s);
        tx.objectStore = () => ({
          get: k => { tx.offen++; const r = anfrage(() => (store.has(k) ? store.get(k) : undefined)); const ok = r; spaeter(() => fertig()); return ok; },
          put: (v, k) => {
            if (modus !== "readwrite") throw fehler("ReadOnlyError");
            tx.offen++;
            spaeter(() => { if (opt.voll) return scheitern(fehler("QuotaExceededError")); store.set(k, v); fertig(); });
          },
          delete: k => { tx.offen++; spaeter(() => { store.delete(k); fertig(); }); },
        });
        return tx;
      },
    };
  }
  return {
    open(name) {
      const r = { result: null, error: null, onsuccess: null, onerror: null, onupgradeneeded: null };
      spaeter(() => {
        if (opt.kaputt) { r.error = fehler("UnknownError"); return r.onerror && r.onerror({ target: r }); }
        const neu = !daten.has(name);
        r.result = datenbank(name);
        if (neu && r.onupgradeneeded) r.onupgradeneeded({ target: r });
        if (r.onsuccess) r.onsuccess({ target: r });
      });
      return r;
    },
  };
}

const ERSATZ_IDB_CODE = `globalThis.indexedDB = (${ersatzIdb.toString()})(globalThis.__idbDaten || new Map());`;
module.exports = { ersatzIdb, ERSATZ_IDB_CODE };
