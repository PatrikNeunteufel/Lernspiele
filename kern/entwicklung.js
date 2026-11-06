/* Kern — Entwickler-Modus (Entscheide E1 a, E2 a, E3 a; Plan docs/plan_angleich_reihe.md B, C6; docs/kern/rahmen.md 4.12).
   Herkunft: eulenpfad/spiele/gemeinsam/entwicklung.js (LERN_Session6).

   Die Aufsicht schaltet ihn mit dem Entwickler-Schlüssel frei; danach blendet ein eigener Schalter die Zusätze ein.
   Dauerhaft geschrieben wird nur über den Entwickler-Server (tools/entwickler_server.py) im lokalen Repo: Prüfstand und
   Bemerkungen der App, die `app` nennt. Ohne Server melden die Aufrufe, dass er fehlt.
   Ein Schlüssel für das ganze Repo: im Klartext nur in entwickler.key (von Git ausgeschlossen), hier sein Hash
   SHA-256(„eulenpfad-entwickler:<Schlüssel>“) — dieselbe Rechnung wie KERN.geheimnis.hash(schlüssel, SALZ).
   Neu gesetzt von: python tools/entwickler_server.py --neuer-schluessel (trägt den Hash hier ein und verteilt). */
"use strict";

(function (KERN) {
  const SCHLUESSEL_HASH = "a1fb5dbb5d54c6de3acc1d372cdef564fedf87e2e349aa1bc4bbddf3be702035";
  const SALZ = "eulenpfad-entwickler"; // seit LERN_Session6; bleibt, damit der bestehende Schlüssel gilt

  /**
   * Entwickler-Modus einer App.
   * opt.app        "eulenpfad" | "lernsteig" | … — der Server schreibt in Prüfstand und Bemerkungen dieser App
   * opt.speicher   KERN.speicher der App (Zustand unter „entwickler“: { schluessel, an, name }, nur auf diesem Gerät)
   * opt.aufsicht   () → ist gerade eine Aufsicht angemeldet? (nur sie sieht die Zusätze)
   * opt.name       () → Name für „von“, wenn keiner gesetzt ist (die angemeldete Aufsicht)
   * opt.pruefstand Objekt des Prüfstands der App (z. B. PRUEFSTAND); nach jeder Änderung auf den Stand des Servers gebracht
   * opt.arten      Bereiche des Prüfstands (Eulenpfad ["spiele", "listen"], Lernsteig ["uebungen", "listen"])
   * opt.melde      (text) → Meldung an die Person (die App zeigt sie; Standard: nichts)
   * opt.start      Pfad der App für die Meldung „Server fehlt“ (z. B. "eulenpfad/")
   */
  function entwicklung(opt) {
    const o = opt || {};
    if (typeof o.app !== "string" || !/^[a-z]+$/.test(o.app)) throw new Error("entwicklung: app fehlt");
    if (!o.speicher || typeof o.speicher.lies !== "function") throw new Error("entwicklung: speicher fehlt");
    if (typeof o.aufsicht !== "function") throw new Error("entwicklung: aufsicht fehlt");
    const arten = Array.isArray(o.arten) && o.arten.length ? o.arten : ["listen"];
    const melde = typeof o.melde === "function" ? o.melde : () => {};
    const SERVER_FEHLT = "Entwickler-Server nicht gefunden.\n\nDer Entwickler-Modus funktioniert nur im lokalen Repo mit laufendem Server:\n"
      + `python tools/entwickler_server.py\ndanach http://localhost:8765/${o.start || ""} öffnen.`;
    const FREMDER_SERVER = "Hier antwortet ein anderer Server ohne Entwickler-Funktionen (z. B. ein noch laufendes "
      + "python -m http.server auf demselben Port).\n\nDiesen beenden, dann python tools/entwickler_server.py starten "
      + "und die Seite mit Strg+F5 neu laden.";
    let fremd = false; // Auf der Adresse läuft ein Server, aber nicht der Entwickler-Server
    const serverMeldung = () => (fremd ? FREMDER_SERVER : SERVER_FEHLT);

    const zustand = () => ({ schluessel: null, an: false, name: "", ...(o.speicher.lies("entwickler", null) || {}) });
    const speichere = daten => o.speicher.schreibe("entwickler", { ...zustand(), ...daten });
    const freigeschaltet = () => !!zustand().schluessel;
    /** Sind die Entwickler-Zusätze sichtbar? Nur für die angemeldete Aufsicht, freigeschaltet und eingeschaltet. */
    const aktiv = () => !!o.aufsicht() && freigeschaltet() && zustand().an;
    const name = () => zustand().name || (typeof o.name === "function" ? o.name() : "") || "";

    /** Schlüssel prüfen (gegen den Hash) und auf diesem Gerät merken; true bei Erfolg. */
    async function freischalten(schluessel) {
      const s = String(schluessel ?? "").trim();
      if (!s || (await KERN.geheimnis.hash(s, SALZ)) !== SCHLUESSEL_HASH) return false;
      speichere({ schluessel: s, an: true });
      return true;
    }
    const sperren = () => o.speicher.schreibe("entwickler", null);
    const setzeAn = an => speichere({ an: !!an });
    const benenne = n => speichere({ name: String(n ?? "").trim().slice(0, 40) });

    // ----- Entwickler-Server -----
    let serverDa = null;
    const lokal = () => typeof location !== "undefined" && String(location.protocol).startsWith("http")
      && ["localhost", "127.0.0.1"].includes(location.hostname);
    /** Läuft die Seite über den Entwickler-Server? { ok, schluessel } oder null. Erfolg wird gemerkt. */
    async function server() {
      if (serverDa) return serverDa;
      try {
        const r = await fetch("/entwicklung/status", { cache: "no-store" });
        fremd = !r.ok && lokal();
        if (r.ok) serverDa = await r.json();
      } catch (e) { /* kein Server */ }
      return serverDa;
    }
    /** An den Server schicken (mit App und Schlüssel); meldet selbst, was schiefging, und gibt dann null zurück. */
    async function sende(pfad, daten) {
      if (!(await server())) { melde(serverMeldung()); return null; }
      try {
        const r = await fetch(pfad, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...daten, app: o.app, schluessel: zustand().schluessel }) });
        const antwort = await r.json();
        if (!r.ok) { melde(`Entwickler-Server: ${antwort.fehler || r.status}`); return null; }
        return antwort;
      } catch (e) {
        serverDa = null;
        melde(serverMeldung());
        return null;
      }
    }
    /** Prüfstand der App auf den Stand des Servers bringen (dasselbe Objekt, damit die Freigabe es sieht). */
    function uebernimm(stand) {
      if (!o.pruefstand || !stand) return;
      for (const a of arten) o.pruefstand[a] = stand[a] || {};
    }

    /** Inhalt als angesehen bzw. Liste als geprüft setzen (geprueft false: aufheben). art aus opt.arten. */
    async function setzeGeprueft(art, id, geprueft) {
      if (!arten.includes(art)) throw new Error(`entwicklung: unbekannte Art ${art}`);
      const stand = await sende("/entwicklung/pruefstand", { art, id, geprueft, von: name() });
      if (!stand) return false;
      uebernimm(stand);
      return true;
    }
    /** Haken je Eintrag einer Liste (Prüfansicht, LP2 a): { liste, setzen, entfernen, komplett, hash }. */
    async function setzeEintraege(daten) {
      const stand = await sende("/entwicklung/eintraege", { ...daten, von: name() });
      if (!stand) return false;
      uebernimm(stand);
      return true;
    }
    /** Status einer Bemerkung setzen (z. B. „erledigt …“). */
    const bemerkungStatus = async (nr, status) => !!(await sende("/entwicklung/bemerkung-status", { nr, status }));
    /** Bemerkung für die Entwicklung: { text, spiel?|inhalt?, stufe?, liste?, eintrag?, schluessel?, aufgabe? }. */
    const bemerkung = daten => sende("/entwicklung/bemerkung",
      { von: name(), seite: typeof location !== "undefined" ? location.pathname : "", ...daten });
    /** Alle Bemerkungen der App (über den Server) oder null. */
    async function bemerkungen() {
      if (!(await server())) return null;
      try { return await (await fetch(`/entwicklung/bemerkungen?app=${o.app}`, { cache: "no-store" })).json(); } catch (e) { return null; }
    }

    return { app: o.app, freigeschaltet, aktiv, freischalten, sperren, setzeAn, benenne, name, zustand, server, serverMeldung,
      /** Antwortet auf der Adresse ein anderer Server (nach server())? */ fremd: () => fremd,
      setzeGeprueft, setzeEintraege, bemerkung, bemerkungen, bemerkungStatus };
  }
  entwicklung.SALZ = SALZ;
  entwicklung.SCHLUESSEL_HASH = SCHLUESSEL_HASH;

  KERN.entwicklung = entwicklung;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
