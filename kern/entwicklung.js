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
   * Protokoll des Austauschs mit dem Server (Plan C12, NS3 a): eine ganze Zahl, die genau dann steigt, wenn sich Anfragen
   * oder Antworten so ändern, dass ein älterer Server oder eine ältere App sie falsch läse. Der Server nennt unter
   * /entwicklung/status die Protokolle, die er versteht ({ protokoll: [von, bis] }); ein Server ohne die Angabe (vor
   * LERN_Session27) versteht 1. Jede Anfrage trägt das Protokoll und die Versionen von App und Kern.
   */
  const PROTOKOLL = 1;
  /** Versteht der Server dieses Protokoll? st: Antwort von /entwicklung/status. */
  const verstehtProtokoll = st => {
    const [von, bis] = Array.isArray(st?.protokoll) && st.protokoll.length === 2 ? st.protokoll : [1, 1];
    return PROTOKOLL >= von && PROTOKOLL <= bis;
  };

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
   * opt.adresse    () → Adresse des Entwickler-Servers, "" = dieselbe Seite (Standard; C11-3 a: nur localhost und
   *                127.0.0.1, siehe entwicklung.adresseGueltig). Der Server antwortet dafür mit CORS.
   * opt.version    () → Version der App (APP_VERSION.version aus <app>/version.js, NS3 a); geht mit jeder Anfrage mit
   */
  function entwicklung(opt) {
    const o = opt || {};
    if (typeof o.app !== "string" || !/^[a-z]+$/.test(o.app)) throw new Error("entwicklung: app fehlt");
    if (!o.speicher || typeof o.speicher.lies !== "function") throw new Error("entwicklung: speicher fehlt");
    if (typeof o.aufsicht !== "function") throw new Error("entwicklung: aufsicht fehlt");
    const arten = Array.isArray(o.arten) && o.arten.length ? o.arten : ["listen"];
    const melde = typeof o.melde === "function" ? o.melde : () => {};
    /** Adresse des Servers ohne Schrägstrich am Ende; "" = dieselbe Seite. Eine ungültige Angabe gilt als "". */
    const basis = () => adresseGueltig(typeof o.adresse === "function" ? o.adresse() : "") || "";
    const SERVER_FEHLT_HIER = "Entwickler-Server nicht gefunden.\n\nDer Entwickler-Modus funktioniert nur im lokalen Repo mit laufendem Server:\n"
      + `python tools/entwickler_server.py\ndanach http://localhost:8765/${o.start || ""} öffnen.`;
    const serverFehltBei = a => (a ? `Entwickler-Server unter ${a} nicht erreichbar.\n\nLäuft python tools/entwickler_server.py `
      + "auf diesem Gerät mit diesem Port? Die Adresse steht unter Verwaltung → Einstellungen." : SERVER_FEHLT_HIER);
    const serverFehlt = () => serverFehltBei(basis());
    const FREMDER_SERVER = "Hier antwortet ein anderer Server ohne Entwickler-Funktionen (z. B. ein noch laufendes "
      + "python -m http.server auf demselben Port).\n\nDiesen beenden, dann python tools/entwickler_server.py starten "
      + "und die Seite mit Strg+F5 neu laden.";
    let fremd = false; // Auf der Adresse läuft ein Server, aber nicht der Entwickler-Server
    let unpassend = null; // Antwort eines Entwickler-Servers, der dieses Protokoll nicht versteht
    /** Versionen dieser Seite, mit jeder Anfrage an den Server (NS3 a). */
    const versionen = () => ({ app: (typeof o.version === "function" ? o.version() : "") || "", kern: KERN.version || "",
      protokoll: PROTOKOLL });
    const unpassendText = (st, z) => {
      const [von, bis] = Array.isArray(st?.protokoll) ? st.protokoll : [1, 1];
      const v = versionen();
      return `Der Entwickler-Server${st?.server ? ` ${st.server}` : ""} unter ${z} versteht Protokoll ${von === bis ? von : `${von}–${bis}`}, `
        + `diese Seite spricht Protokoll ${PROTOKOLL} (${o.app} ${v.app || "ohne Version"}, Kern ${v.kern || "?"}).\n\n`
        + "App und Server auf denselben Stand bringen (neu laden, Server aktualisieren); bis dahin gehen Meldungen per E-Mail "
        + "oder als Text.";
    };
    const serverMeldung = () => (unpassend ? unpassendText(unpassend, ziel(basis())) : fremd ? FREMDER_SERVER : serverFehlt());

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
    let serverDa = null, serverBasis = null; // gemerkt je Adresse
    const lokal = () => typeof location !== "undefined" && String(location.protocol).startsWith("http")
      && ["localhost", "127.0.0.1"].includes(location.hostname);
    /**
     * Läuft ein Entwickler-Server, der dieses Protokoll versteht? { ok, schluessel, server?, protokoll? } oder null
     * (dann sagt serverMeldung warum). Erfolg wird gemerkt.
     */
    async function server() {
      if (serverDa && serverBasis === basis()) return serverDa;
      serverDa = null; unpassend = null; serverBasis = basis();
      try {
        const r = await fetch(`${basis()}/entwicklung/status`, { cache: "no-store" });
        fremd = !r.ok && (!!basis() || lokal());
        if (r.ok) {
          const st = await r.json();
          if (verstehtProtokoll(st)) serverDa = st; else unpassend = st;
        }
      } catch (e) { /* kein Server */ }
      return serverDa;
    }
    /** Volle Adresse für die Anzeige: "" = diese Seite, mit ihrem Ursprung, wenn sie über http läuft. */
    const ziel = a => (a || (typeof location !== "undefined" && String(location.protocol).startsWith("http")
      ? `${location.origin} (diese Seite)` : "diese Seite"));
    /**
     * Verbindung zu einer Adresse prüfen, ohne sie zu speichern und ohne Gemerktes (C11-3 a; LERN_Session27: „Verbindung
     * prüfen“ prüfte die gespeicherte Adresse, nicht die im Feld, und sagte nicht, welche). text wie im Feld
     * ("" = diese Seite), ohne Angabe die eingestellte. → { ok, fremd, ungueltig, adresse, ziel, text }; adresse ist die
     * bereinigte Adresse (null, wenn nicht erlaubt), ziel die angezeigte, text die fertige Meldung mit ziel.
     */
    async function verbindungPruefen(text) {
      const roh = text === undefined ? basis() : String(text ?? "").trim();
      const a = adresseGueltig(roh);
      if (a === null) {
        return { ok: false, fremd: false, ungueltig: true, adresse: null, ziel: roh,
          text: `Nicht geprüft: ${roh} ist nicht erlaubt. Erlaubt ist nur http://localhost:<Port> oder http://127.0.0.1:<Port>, leer für diese Seite.` };
      }
      let ok = false, andere = false, st = null;
      try {
        const r = await fetch(`${a}/entwicklung/status`, { cache: "no-store" });
        andere = !r.ok && (!!a || lokal());
        if (r.ok) { st = await r.json(); ok = true; }
      } catch (e) { /* kein Server oder keine lesbare Antwort */ }
      const z = ziel(a);
      const passt = ok && verstehtProtokoll(st);
      const meldung = passt ? `✓ Entwickler-Server${st.server ? ` ${st.server}` : ""} erreichbar: ${z}, Protokoll ${PROTOKOLL}.`
        : ok ? unpassendText(st, z)
          : andere ? FREMDER_SERVER.replace(/^Hier/, `Unter ${z}`)
            : a ? serverFehltBei(a) : `Kein Entwickler-Server unter ${z}.\n\n${SERVER_FEHLT_HIER}`;
      return { ok: passt, fremd: andere, unpassend: ok && !passt, ungueltig: false, adresse: a, ziel: z,
        server: st?.server || "", protokoll: st?.protokoll || null, text: meldung };
    }
    /** An den Server schicken (mit App und Schlüssel); meldet selbst, was schiefging, und gibt dann null zurück. */
    async function sende(pfad, daten) {
      if (!(await server())) { melde(serverMeldung()); return null; }
      try {
        const r = await fetch(basis() + pfad, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...daten, app: o.app, versionen: versionen(), protokoll: PROTOKOLL, schluessel: zustand().schluessel }) });
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
      try { return await (await fetch(`${basis()}/entwicklung/bemerkungen?app=${o.app}`, { cache: "no-store" })).json(); } catch (e) { return null; }
    }

    return { app: o.app, adresse: basis, freigeschaltet, aktiv, freischalten, sperren, setzeAn, benenne, name, zustand, server, serverMeldung, verbindungPruefen, versionen,
      /** Antwortet auf der Adresse ein anderer Server (nach server())? */ fremd: () => fremd,
      setzeGeprueft, setzeEintraege, bemerkung, bemerkungen, bemerkungStatus };
  }
  /**
   * Adresse eines Entwickler-Servers prüfen (C11-3 a): "" (dieselbe Seite) oder http(s)://localhost bzw. 127.0.0.1 mit
   * Port; Ergebnis ohne Schrägstrich am Ende, oder null, wenn die Adresse nicht erlaubt ist. Ein Server im Netz braucht
   * einen eigenen Entscheid (später nur verschlüsselt und mit geheimer Kennung).
   */
  function adresseGueltig(text) {
    const t = String(text ?? "").trim();
    if (!t) return "";
    const m = t.match(/^(https?):\/\/(localhost|127\.0\.0\.1)(?::(\d{1,5}))?\/?$/i);
    if (!m || (m[3] && (Number(m[3]) < 1 || Number(m[3]) > 65535))) return null;
    return `${m[1].toLowerCase()}://${m[2].toLowerCase()}${m[3] ? `:${Number(m[3])}` : ""}`;
  }
  entwicklung.adresseGueltig = adresseGueltig;
  entwicklung.PROTOKOLL = PROTOKOLL;
  entwicklung.verstehtProtokoll = verstehtProtokoll;
  entwicklung.SALZ = SALZ;
  entwicklung.SCHLUESSEL_HASH = SCHLUESSEL_HASH;

  KERN.entwicklung = entwicklung;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
