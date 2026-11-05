/* Abgleich zwischen Geräten im Haushalt (Entscheid S1 a, LERN_Session6).
   Jedes Gerät schreibt seine Daten in einen gemeinsamen Ordner, den die Aufsicht wählt (Netzwerkordner
   oder der Ordner eines Cloud-Dienstes), und zwar nur in seine eigene Datei lernspiele-sync-<gerät>.json.
   Beim Öffnen einer Seite liest es die Dateien der anderen Geräte und führt sie mit LS.zusammenfuehren
   zusammen. So überschreiben sich zwei Geräte nie, auch wenn ein Cloud-Dienst verzögert abgleicht.
   Den Ordner kann der Browser nur mit File System Access (heute Chrome und Edge auf dem Computer); sonst
   bleibt derselbe Abgleich über eine Datei (sichern / einlesen). Ziel: vollständige Endlos-Ranglisten
   und Statistiken auf jedem Gerät. Die PIN reist nie mit (LS.abgleichDaten). */
"use strict";

LS.abgleich = (() => {
  const PRAEFIX = "lernspiele-sync-";
  // Was abgeglichen wird; alles andere (Anmeldung, Filter, Gerät) bleibt auf dem Gerät.
  const GETEILT = new Set(["personen", "protokoll", "rekorde", "freigabe", "geloescht", "meldungen"]); // personen seit LERN_Session15 (vorher profile)
  const kannOrdner = typeof window !== "undefined" && typeof window.showDirectoryPicker === "function"
    && typeof indexedDB !== "undefined";
  // Im Zufallsmix laufen die Spiele im iframe; dort gleicht nur die Mix-Seite selbst ab.
  const imRahmen = typeof window !== "undefined" && window.parent !== window;

  /** Dieses Gerät: zufällige Kennung und ein Name, den die Aufsicht vergibt. */
  function geraet() {
    let g = LS.lies("geraet", null);
    if (!g?.id) {
      g = { id: [...crypto.getRandomValues(new Uint8Array(4))].map(b => b.toString(16).padStart(2, "0")).join(""), name: "" };
      LS.schreibe("geraet", g);
    }
    return g;
  }
  const eigeneDatei = () => `${PRAEFIX}${geraet().id}.json`;
  const dateiInhalt = () => JSON.stringify({ ...LS.abgleichDaten(), geraet: geraet() });

  // ----- Ordner merken (IndexedDB: der Browser kann den Zugriff nur dort aufbewahren) -----
  function speicher(art, wert) {
    return new Promise((ok, fehler) => {
      const auf = indexedDB.open("lernspiele", 1);
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
  }
  const ordner = async () => (kannOrdner ? speicher("lies").catch(() => null) : null);

  /** Darf die Seite in den Ordner schreiben? fragen = der Browser darf nachfragen (nur nach einem Tippen). */
  async function erlaubt(h, fragen) {
    const art = { mode: "readwrite" };
    if ((await h.queryPermission(art)) === "granted") return true;
    return fragen && (await h.requestPermission(art)) === "granted";
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
   * Gibt { status: "ok" | "kein-ordner" | "keine-erlaubnis" | "fehler", neu, geraete } zurück. Kam etwas
   * dazu, meldet das Ereignis „lernspiele:abgeglichen“ es der Seite.
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
      const neu = { runden: 0, kinder: 0, rekorde: 0, profile: 0, meldungen: 0, freigabe: false };
      const geraete = [];
      still = true;
      try {
        for await (const [name, eintrag] of h.entries()) {
          if (eintrag.kind !== "file" || !name.startsWith(PRAEFIX) || !name.endsWith(".json") || name === eigeneDatei()) continue;
          try {
            const daten = JSON.parse(await (await eintrag.getFile()).text());
            const r = LS.zusammenfuehren(daten);
            for (const k of ["runden", "kinder", "rekorde", "profile", "meldungen"]) neu[k] += r[k] || 0;
            neu.freigabe ||= r.freigabe;
            geraete.push({ id: daten.geraet?.id, name: daten.geraet?.name || "", gesichert: daten.gesichert });
          } catch { geraete.push({ datei: name, fehler: true }); }
        }
      } finally { still = false; }
      await schreibeEigene(h);
      LS.schreibe("abgleichStand", { zuletzt: new Date().toISOString(), ordner: h.name, geraete });
      if (neu.runden || neu.kinder || neu.rekorde || neu.profile || neu.meldungen || neu.freigabe) {
        dispatchEvent(new CustomEvent("lernspiele:abgeglichen", { detail: neu }));
      }
      return { status: "ok", neu, geraete };
    } catch (fehler) {
      return { status: "fehler", fehler: String(fehler?.message || fehler) };
    }
  }

  /** Ordner wählen (nur nach einem Tippen) und gleich abgleichen. */
  async function waehlen() {
    const h = await window.showDirectoryPicker({ id: "lernspiele-abgleich", mode: "readwrite" });
    await speicher("schreib", h);
    return jetzt(true);
  }

  async function vergessen() {
    if (kannOrdner) await speicher("loesch").catch(() => null);
    LS.schreibe("abgleichStand", null);
  }

  // Nach jeder Änderung die eigene Datei nachziehen (gesammelt), ohne zu fragen: Fehlt die Erlaubnis,
  // holt der nächste Abgleich mit einem Tippen alles nach.
  let geplant = null;
  async function eigeneNachziehen() {
    geplant = null;
    const h = await ordner();
    if (h && (await h.queryPermission({ mode: "readwrite" }).catch(() => "denied")) === "granted") await schreibeEigene(h).catch(() => null);
  }
  if (kannOrdner && !imRahmen) {
    LS.beiAenderung(schluessel => {
      if (still || !GETEILT.has(schluessel)) return;
      clearTimeout(geplant);
      geplant = setTimeout(eigeneNachziehen, 1500);
    });
    addEventListener("pagehide", () => { if (geplant) { clearTimeout(geplant); eigeneNachziehen(); } });
    // Beim Öffnen der Seite und wenn sie wieder in den Vordergrund kommt: still abgleichen.
    addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") jetzt(false); });
    jetzt(false);
  }

  /** Abgleich ohne Ordner: dieselben Daten als Datei, die man auf dem anderen Gerät einliest. */
  function dateiSichern() {
    const g = geraet();
    const a = LS.el("a", {
      href: URL.createObjectURL(new Blob([dateiInhalt()], { type: "application/json" })),
      download: `${PRAEFIX}${g.id}.json`, // Muster lernspiele-*.json: .gitignore hält es aus dem Repo
    });
    document.body.append(a);
    a.click();
    a.remove();
  }

  /** Gesicherte oder Abgleich-Datei einlesen und zusammenführen; wirft bei unlesbarer Datei. */
  async function dateiEinlesen(datei) {
    const daten = JSON.parse(await datei.text());
    if (!daten.profile || !Array.isArray(daten.protokoll)) throw new Error("Format");
    return LS.zusammenfuehren(daten);
  }

  /** Was beim Zusammenführen dazukam, in einem Satz. */
  function ergebnisText(r) {
    const teile = [
      r.runden && `${r.runden} neue Runde${r.runden === 1 ? "" : "n"}`,
      r.rekorde && `${r.rekorde} Endlos-Rekord${r.rekorde === 1 ? "" : "e"}`,
      r.kinder && `${r.kinder} neue${r.kinder === 1 ? "s Kind" : " Kinder"}`,
      r.profile && `${r.profile} geänderte${r.profile === 1 ? "s Profil" : " Profile"}`,
      r.meldungen && `${r.meldungen} neue oder geänderte Fehlermeldung${r.meldungen === 1 ? "" : "en"}`,
      r.freigabe && "die Freigaben",
    ].filter(Boolean);
    return teile.length ? `Dazugekommen: ${teile.join(", ")}.` : "Nichts Neues — alles war schon da.";
  }

  const stand = () => LS.lies("abgleichStand", null);
  const benenne = name => LS.schreibe("geraet", { ...geraet(), name: String(name).trim().slice(0, 30) });

  return { kannOrdner, ordner, jetzt, waehlen, vergessen, dateiSichern, dateiEinlesen, ergebnisText, stand, geraet, benenne };
})();
