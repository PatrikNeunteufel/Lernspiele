/* Kern — Abgleich zwischen Geräten über einen Ordner (Entscheide S1 a im Eulenpfad, DF3 a für alle Apps;
   docs/kern/rahmen.md 4.20). Herkunft: eulenpfad/spiele/gemeinsam/abgleich.js (LERN_Session6).
   Jedes Gerät schreibt seine Daten in einen Ordner, den die Aufsicht wählt (Netzwerkordner oder der Ordner eines
   Cloud-Dienstes), und zwar nur in seine eigene Datei <präfix><gerät>.json. Beim Abgleichen liest es die Dateien der
   anderen Geräte und führt sie zusammen (KERN.daten über die App), dann schreibt es seine eigene. So überschreiben sich
   zwei Geräte nie, auch wenn ein Cloud-Dienst verzögert abgleicht.
   Den Ordner kann der Browser nur mit File System Access (heute Chrome und Edge auf dem Computer); den Zugriff merkt er
   sich in IndexedDB. Ohne Ordner bleibt derselbe Abgleich über eine Datei (dateiSichern, dateiEinlesen).
   Browser-Schnittstellen (Ordnerwahl, IndexedDB, Ereignisse) erst beim Aufruf; Ordner und Ablage lassen sich für Tests
   ersetzen (opt.ordnerWahl, opt.ablage). */
"use strict";

(function (KERN) {
  /** Ablage für den gewählten Ordner in IndexedDB (der Browser kann den Zugriff nur dort aufbewahren). */
  function idbAblage(datenbank) {
    const tu = (art, wert) => new Promise((ok, fehler) => {
      const auf = indexedDB.open(datenbank, 1);
      auf.onupgradeneeded = () => auf.result.createObjectStore("abgleich");
      auf.onerror = () => fehler(auf.error);
      auf.onsuccess = () => {
        const tx = auf.result.transaction("abgleich", art === "lies" ? "readonly" : "readwrite");
        const st = tx.objectStore("abgleich");
        const r = art === "lies" ? st.get("ordner") : art === "schreib" ? st.put(wert, "ordner") : st.delete("ordner");
        r.onsuccess = () => ok(r.result ?? null);
        r.onerror = () => fehler(r.error);
      };
    });
    return { lies: () => tu("lies"), schreibe: h => tu("schreib", h), loesche: () => tu("loesch") };
  }
  /** Ergebnisse mehrerer Dateien zusammenzählen: Zahlen addieren, Ja/Nein verbinden; anderes fällt weg. */
  function summe(gesamt, r) {
    for (const [k, v] of Object.entries(r || {})) {
      if (typeof v === "number") gesamt[k] = (gesamt[k] || 0) + v;
      else if (typeof v === "boolean") gesamt[k] = !!gesamt[k] || v;
    }
    return gesamt;
  }
  const kennungZufall = () => {
    const c = typeof crypto !== "undefined" && crypto.getRandomValues ? crypto : null;
    const b = c ? c.getRandomValues(new Uint8Array(4)) : Array.from({ length: 4 }, () => Math.floor(Math.random() * 256));
    return [...b].map(x => x.toString(16).padStart(2, "0")).join("");
  };

  /**
   * opt:
   *   speicher      Speicher der App (Gerät „geraet“ und Stand „abgleichStand“; Schlüssel über opt.schluessel)
   *   dateiPraefix  Anfang der Dateien im Ordner („lernspiele-sync-“, „lernsteig-sync-“); .gitignore hält <app>-*.json fern
   *   datenbank     Name der IndexedDB für den gemerkten Ordner („lernspiele“, „lernsteig“, SP1 a)
   *   sichern       geraet → Objekt der eigenen Abgleich-Datei (App: KERN.daten.sichern({ art: "abgleich", geraet }))
   *   einlesen      (text, { quelle: "ordner" | "datei" }) → Ergebnis der App (Zahlen und Ja/Nein werden summiert)
   *   zaehltNicht   Felder des Ergebnisses, die nicht als „neu“ gelten (Standard ["abgewiesen"])
   *   ereignis      Name des Ereignisses, wenn etwas dazukam („lernspiele:abgeglichen“); detail = Summe
   *   geteilt       Schlüssel, nach deren Änderung die eigene Datei nachgezogen wird
   *   beiAenderung  f → registriert f(schluessel) bei jeder Speicheränderung der App
   *   ordnerWahl, ablage, kannOrdner   für Tests: Ordner wählen, Ordner merken, Fähigkeit des Browsers
   */
  function abgleich(opt = {}) {
    const { speicher } = opt;
    if (!speicher || typeof speicher.lies !== "function") throw new Error("abgleich: speicher fehlt");
    if (typeof opt.dateiPraefix !== "string" || !/^[a-z][a-z0-9-]*-$/.test(opt.dateiPraefix)) throw new Error("abgleich: dateiPraefix fehlt");
    if (typeof opt.sichern !== "function" || typeof opt.einlesen !== "function") throw new Error("abgleich: sichern und einlesen fehlen");
    const S = { geraet: "geraet", stand: "abgleichStand", ...(opt.schluessel || {}) };
    const praefix = opt.dateiPraefix;
    const zaehltNicht = new Set(opt.zaehltNicht || ["abgewiesen"]);
    const geteilt = new Set(opt.geteilt || []);
    const kannOrdner = opt.kannOrdner !== undefined ? !!opt.kannOrdner
      : typeof window !== "undefined" && typeof window.showDirectoryPicker === "function" && typeof indexedDB !== "undefined";
    let ablageObjekt = opt.ablage || null;
    const ablage = () => ablageObjekt || (ablageObjekt = idbAblage(opt.datenbank || "reihe"));
    // ordnerId: unter dieser Kennung merkt sich der Browser den zuletzt gewählten Ort der Ordnerwahl
    const ordnerWahl = opt.ordnerWahl || (() => window.showDirectoryPicker({ id: opt.ordnerId || `${praefix}ordner`, mode: "readwrite" }));

    /** Dieses Gerät: zufällige Kennung und ein Name, den die Aufsicht vergibt. */
    function geraet() {
      let g = speicher.lies(S.geraet, null);
      if (!g || !g.id) { g = { id: kennungZufall(), name: "" }; speicher.schreibe(S.geraet, g); }
      return g;
    }
    const benenne = name => speicher.schreibe(S.geraet, { ...geraet(), name: String(name).trim().slice(0, 30) });
    const eigeneDatei = () => `${praefix}${geraet().id}.json`;
    const dateiInhalt = () => JSON.stringify(opt.sichern(geraet()));
    const istNeu = r => Object.entries(r || {}).some(([k, v]) => !zaehltNicht.has(k) && (v === true || (typeof v === "number" && v > 0)));

    const ordner = async () => (kannOrdner ? ablage().lies().catch(() => null) : null);
    /** Darf die Seite in den Ordner schreiben? fragen = der Browser darf nachfragen (nur nach einem Tippen). */
    async function erlaubt(h, fragen) {
      const art = { mode: "readwrite" };
      if ((await h.queryPermission(art)) === "granted") return true;
      return !!fragen && (await h.requestPermission(art)) === "granted";
    }
    async function schreibeEigene(h) {
      const w = await (await h.getFileHandle(eigeneDatei(), { create: true })).createWritable();
      await w.write(dateiInhalt());
      await w.close();
    }

    let still = false; // während des Zusammenführens: die eigenen Schreibvorgänge lösen kein Schreiben aus
    let laeuft = null;
    /**
     * Jetzt abgleichen: die Dateien der anderen Geräte lesen und zusammenführen, dann die eigene schreiben.
     * Gibt { status: "ok" | "kein-ordner" | "keine-erlaubnis" | "fehler", neu (Summe), geraete } zurück; kam etwas dazu,
     * meldet opt.ereignis es der Seite. Ein zweiter Aufruf während eines laufenden wartet auf diesen.
     */
    function jetzt(fragen = false) {
      if (!laeuft) laeuft = abgleichen(fragen).finally(() => { laeuft = null; });
      return laeuft;
    }
    async function abgleichen(fragen) {
      const h = await ordner();
      if (!h) return { status: "kein-ordner" };
      try {
        if (!(await erlaubt(h, fragen))) return { status: "keine-erlaubnis" };
        const neu = {};
        const geraete = [];
        still = true;
        try {
          for await (const [name, eintrag] of h.entries()) {
            if (eintrag.kind !== "file" || !name.startsWith(praefix) || !name.endsWith(".json") || name === eigeneDatei()) continue;
            try {
              const text = await (await eintrag.getFile()).text();
              const r = opt.einlesen(text, { quelle: "ordner" });
              summe(neu, r);
              const kopf = (() => { try { const d = JSON.parse(text); return d && typeof d === "object" ? d : {}; } catch (e) { return {}; } })();
              geraete.push({ id: kopf.geraet?.id, name: kopf.geraet?.name || "", gesichert: kopf.gesichert });
            } catch (e) { geraete.push({ datei: name, fehler: true, meldung: String(e?.message || e) }); }
          }
        } finally { still = false; }
        await schreibeEigene(h);
        speicher.schreibe(S.stand, { zuletzt: new Date().toISOString(), ordner: h.name, geraete });
        if (istNeu(neu) && opt.ereignis && typeof dispatchEvent === "function" && typeof CustomEvent === "function") {
          dispatchEvent(new CustomEvent(opt.ereignis, { detail: neu }));
        }
        return { status: "ok", neu, geraete };
      } catch (fehler) {
        return { status: "fehler", fehler: String(fehler?.message || fehler) };
      }
    }
    /** Ordner wählen (nur nach einem Tippen) und gleich abgleichen. */
    async function waehlen() {
      const h = await ordnerWahl();
      await ablage().schreibe(h);
      return jetzt(true);
    }
    async function vergessen() {
      if (kannOrdner) await ablage().loesche().catch(() => null);
      speicher.schreibe(S.stand, null);
    }

    // Nach jeder Änderung die eigene Datei nachziehen (gesammelt), ohne zu fragen: Fehlt die Erlaubnis, holt der nächste
    // Abgleich mit einem Tippen alles nach.
    let geplant = null;
    async function eigeneNachziehen() {
      geplant = null;
      const h = await ordner();
      if (h && (await h.queryPermission({ mode: "readwrite" }).catch(() => "denied")) === "granted") await schreibeEigene(h).catch(() => null);
    }
    /** Selbsttätig abgleichen: beim Start, wenn die Seite wieder sichtbar wird, und nach Änderungen geteilter Daten. */
    function starte() {
      if (!kannOrdner) return false;
      if (typeof opt.beiAenderung === "function") opt.beiAenderung(schluessel => {
        if (still || !geteilt.has(schluessel)) return;
        clearTimeout(geplant);
        geplant = setTimeout(eigeneNachziehen, 1500);
      });
      if (typeof addEventListener === "function") {
        addEventListener("pagehide", () => { if (geplant) { clearTimeout(geplant); eigeneNachziehen(); } });
        addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") jetzt(false); });
      }
      jetzt(false);
      return true;
    }

    /** Abgleich ohne Ordner: dieselben Daten als Datei, die man auf dem anderen Gerät einliest. */
    function dateiSichern() {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([dateiInhalt()], { type: "application/json" }));
      a.download = eigeneDatei();
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
    /** Gesicherte oder Abgleich-Datei einlesen und zusammenführen; Fehler mit einem Satz. */
    async function dateiEinlesen(datei) { return opt.einlesen(await datei.text(), { quelle: "datei" }); }

    const stand = () => speicher.lies(S.stand, null);
    return { kannOrdner, geraet, benenne, eigeneDatei, ordner, jetzt, waehlen, vergessen, starte, dateiSichern, dateiEinlesen,
      dateiInhalt, stand };
  }

  KERN.abgleich = Object.assign(abgleich, { summe });
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
