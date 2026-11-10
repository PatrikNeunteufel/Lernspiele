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
   * Öffentlicher Schlüssel des Servers der Entwicklung (Plan C12, NS2 a): SPKI, Base64, ECDSA P-256. Eingetragen von
   * python tools/entwickler_server.py --neues-schluesselpaar; leer = noch kein Paar (dann ist kein Server „echt“).
   */
  const SERVER_SCHLUESSEL = "";
  const UNTERSCHRIFT_ZWECK = "lernspiele-entwicklung"; // wie tools/entwickler_server.py
  const b64 = t => Uint8Array.from(atob(t), c => c.charCodeAt(0));
  /** Zufallszahl als Hex (16 Byte) für die Unterschrift. */
  const zufallHex = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), x => x.toString(16).padStart(2, "0")).join("");
  /**
   * Hat der Server die Zufallszahl mit dem Schlüssel der Entwicklung unterschrieben? st: Antwort von /status (mit
   * unterschrift und server). schluessel: SPKI Base64. false ohne Schlüssel, ohne Unterschrift oder ohne WebCrypto.
   */
  async function unterschriftEcht(st, zufall, schluessel) {
    try {
      if (!schluessel || !st || !st.unterschrift || !globalThis.crypto || !crypto.subtle) return false;
      const k = await crypto.subtle.importKey("spki", b64(schluessel), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
      const text = new TextEncoder().encode(`${UNTERSCHRIFT_ZWECK}|${zufall}|${st.server || ""}`);
      return await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, k, b64(st.unterschrift), text);
    } catch (e) { return false; }
  }
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
   * opt.serverSchluessel  öffentlicher Schlüssel, gegen den die Unterschrift geprüft wird (Standard SERVER_SCHLUESSEL der
   *                Entwicklung; später für einen Abgleich-Server mit dem Schlüssel seiner Aufsicht, docs/konzept_gruppen.md 5c)
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
    const serverFehltBei = a => (!a ? SERVER_FEHLT_HIER
      : /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(a)
        ? `Entwickler-Server unter ${a} nicht erreichbar.\n\nLäuft python tools/entwickler_server.py auf diesem Gerät mit diesem Port? `
          + "Die Adresse steht unter Verwaltung → Einstellungen."
        : `Meldungsserver unter ${a} nicht erreichbar.\n\nStimmt die Adresse (Verwaltung → Einstellungen)? Ist das Gerät mit dem `
          + "Internet verbunden? Bis er wieder erreichbar ist, gehen Meldungen per E-Mail oder als Text.");
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
    const unechtText = (st, z) => `Der Server unter ${z} weist sich nicht als Server der Entwicklung aus (${st?.unterschrift
      ? "Unterschrift passt nicht" : "keine Unterschrift"}). An ihn geht nichts. Stimmt die Adresse? Ist es der richtige Server?`;
    const serverMeldung = () => (unecht ? unechtText(unecht, ziel(basis())) : unpassend ? unpassendText(unpassend, ziel(basis()))
      : fremd ? FREMDER_SERVER : serverFehlt());

    const zustand = () => ({ schluessel: null, an: false, name: "", ...(o.speicher.lies("entwickler", null) || {}) });
    const speichere = daten => o.speicher.schreibe("entwickler", { ...zustand(), ...daten });
    const freigeschaltet = () => !!zustand().schluessel;
    /** Sind die Entwickler-Zusätze sichtbar? Nur für die angemeldete Aufsicht, freigeschaltet und eingeschaltet. */
    const aktiv = () => !!o.aufsicht() && freigeschaltet() && zustand().an;
    const name = () => zustand().name || (typeof o.name === "function" ? o.name() : "") || "";

    /**
     * Schlüssel prüfen und auf diesem Gerät merken: der Schlüssel der Entwicklung gegen den Hash (ohne Server), der einer
     * zugelassenen Aufsicht beim Server (Plan C12, ES1 a, ES2 a). true bei Erfolg, false wenn er nicht passt, null wenn
     * der Server nicht erreichbar ist (dann schon gemeldet).
     */
    async function freischalten(schluessel) {
      const s = String(schluessel ?? "").trim();
      if (!s) return false;
      if ((await KERN.geheimnis.hash(s, SALZ)) === SCHLUESSEL_HASH) {
        speichere({ schluessel: s, an: true, rolle: "entwicklung" });
        return true;
      }
      if (!(await server())) { melde(serverMeldung()); return null; }
      try {
        const r = await fetch(basis() + "/entwicklung/freischalten", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schluessel: s, app: o.app, versionen: versionen(), protokoll: PROTOKOLL }) });
        const a = await r.json();
        if (!r.ok || !a.ok) return false;
        speichere({ schluessel: s, an: true, rolle: a.rolle === "aufsicht" ? "aufsicht" : "entwicklung", name: a.name || "" });
        return true;
      } catch (e) {
        serverDa = null;
        melde(serverMeldung());
        return null;
      }
    }
    /** „entwicklung“, „aufsicht“ (zugelassen, reicht Prüfvermerke nur ein) oder null; ältere Stände ohne Rolle: Entwicklung. */
    const rolle = () => (freigeschaltet() ? (zustand().rolle === "aufsicht" ? "aufsicht" : "entwicklung") : null);
    const sperren = () => o.speicher.schreibe("entwickler", null);
    const setzeAn = an => speichere({ an: !!an });
    const benenne = n => speichere({ name: String(n ?? "").trim().slice(0, 40) });

    // ----- Entwickler-Server -----
    let serverDa = null, serverBasis = null; // gemerkt je Adresse
    let unecht = null; // Antwort eines Servers im Netz, der sich nicht mit dem Schlüssel der Entwicklung ausweist (NS2 a)
    const lokal = () => typeof location !== "undefined" && String(location.protocol).startsWith("http")
      && ["localhost", "127.0.0.1"].includes(location.hostname);
    const schluesselDesServers = () => (typeof o.serverSchluessel === "string" ? o.serverSchluessel : SERVER_SCHLUESSEL);
    /** Liegt die Adresse im Netz (nicht dieses Gerät)? Dann muss der Server unterschreiben (NS2 a). */
    const imNetz = a => !!a && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(a);
    /** Status einer Adresse mit Zufallszahl abfragen: { r, st, echt } (st und echt nur bei lesbarer Antwort). */
    async function frageStatus(a) {
      const zufall = zufallHex();
      const r = await fetch(`${a}/entwicklung/status?zufall=${zufall}`, { cache: "no-store" });
      if (!r.ok) return { r, st: null, echt: false };
      const st = await r.json();
      return { r, st, echt: await unterschriftEcht(st, zufall, schluesselDesServers()) };
    }
    /**
     * Läuft ein Entwickler-Server, der dieses Protokoll versteht — im Netz zudem mit gültiger Unterschrift (NS2 a)?
     * { ok, schluessel, server?, protokoll?, echt } oder null (dann sagt serverMeldung warum). Erfolg wird gemerkt.
     */
    async function server() {
      if (serverDa && serverBasis === basis()) return serverDa;
      serverDa = null; unpassend = null; unecht = null; serverBasis = basis();
      try {
        const { r, st, echt } = await frageStatus(basis());
        fremd = !r.ok && (!!basis() || lokal());
        if (st) {
          if (!verstehtProtokoll(st)) unpassend = st;
          else if (imNetz(basis()) && !echt) unecht = st;
          else serverDa = { ...st, echt };
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
          text: `Nicht geprüft: ${roh} ist nicht erlaubt. ${ADRESSE_REGEL}` };
      }
      let ok = false, andere = false, st = null, echt = false;
      try {
        const f = await frageStatus(a);
        andere = !f.r.ok && (!!a || lokal());
        if (f.st) { st = f.st; ok = true; echt = f.echt; }
      } catch (e) { /* kein Server oder keine lesbare Antwort */ }
      const z = ziel(a);
      const protokollPasst = ok && verstehtProtokoll(st);
      const passt = protokollPasst && (echt || !imNetz(a));
      const zusatz = echt ? ", Unterschrift der Entwicklung geprüft" : st?.unterschrift ? ", Unterschrift passt nicht" : ", ohne Unterschrift";
      const meldung = passt ? `✓ Entwickler-Server${st.server ? ` ${st.server}` : ""} erreichbar: ${z}, Protokoll ${PROTOKOLL}${zusatz}.`
        : protokollPasst ? unechtText(st, z)
          : ok ? unpassendText(st, z)
            : andere ? FREMDER_SERVER.replace(/^Hier/, `Unter ${z}`)
              : a ? serverFehltBei(a) : `Kein Entwickler-Server unter ${z}.\n\n${SERVER_FEHLT_HIER}`;
      return { ok: passt, fremd: andere, unpassend: ok && !protokollPasst, unecht: protokollPasst && !passt, echt, ungueltig: false,
        adresse: a, ziel: z, server: st?.server || "", protokoll: st?.protokoll || null, text: meldung };
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

    /**
     * Antwort auf einen Prüfvermerk übernehmen. Eine zugelassene Aufsicht reicht nur ein (ES3 a): Der Server antwortet
     * { eingereicht, nr, stand } mit dem unveränderten Prüfstand, und die Person erfährt, dass es noch nicht wirkt.
     */
    function nachVermerk(antwort) {
      if (!antwort) return false;
      if (antwort.eingereicht) {
        if (antwort.stand) uebernimm(antwort.stand); // ein Server im Netz kennt den Prüfstand nicht und schickt keinen
        melde(`Eingereicht (Nr. ${antwort.nr}). Es wirkt, sobald die Entwicklung es übernimmt — bis dahin bleibt es wie bisher.`);
        return true;
      }
      uebernimm(antwort);
      return true;
    }
    /** Inhalt als angesehen bzw. Liste als geprüft setzen (geprueft false: aufheben). art aus opt.arten. */
    async function setzeGeprueft(art, id, geprueft) {
      if (!arten.includes(art)) throw new Error(`entwicklung: unbekannte Art ${art}`);
      return nachVermerk(await sende("/entwicklung/pruefstand", { art, id, geprueft, von: name() }));
    }
    /** Haken je Eintrag einer Liste (Prüfansicht, LP2 a): { liste, setzen, entfernen, komplett, hash }. */
    async function setzeEintraege(daten) {
      return nachVermerk(await sende("/entwicklung/eintraege", { ...daten, von: name() }));
    }
    /**
     * mailto-Link „Entwicklermodus anfordern“ (ES4 a, ES5-S a) an die Adresse der Entwicklung, mit Vorlage; null ohne
     * Adresse. name: angemeldete Aufsicht, titel: Name der App („Eulenpfad“). Keine Angaben über Kinder.
     */
    function anforderungLink(an, { name: wer = "", titel = o.app } = {}) {
      if (!an) return null;
      const v = versionen();
      const text = [
        "Guten Tag", "",
        "Ich möchte im Entwicklermodus Spiele und Inhaltslisten prüfen und freigeben.", "",
        `Name: ${wer}`,
        "Ich bin: Lehrperson / Elternteil / anderes: ____",
        "Schule oder Organisation, oder woher wir uns kennen: ____",
        "Was ich prüfen möchte: ____",
        `App: ${titel}${v.app ? ` ${v.app}` : ""}`, "",
        "Der Schlüssel wird aus meinem Namen und dieser E-Mail-Adresse erzeugt und nur an diese Adresse geschickt.", "",
        "Freundliche Grüsse", wer,
      ].join("\n");
      return `mailto:${an}?subject=${encodeURIComponent("Anforderung Entwicklermodus")}&body=${encodeURIComponent(text)}`;
    }
    /** Status einer Bemerkung setzen (z. B. „erledigt …“). */
    const bemerkungStatus = async (nr, status) => !!(await sende("/entwicklung/bemerkung-status", { nr, status }));
    /** Bemerkung für die Entwicklung: { text, spiel?|inhalt?, stufe?, liste?, eintrag?, schluessel?, aufgabe? }. */
    const bemerkung = daten => sende("/entwicklung/bemerkung",
      { von: name(), seite: typeof location !== "undefined" ? location.pathname : "", ...daten });
    /**
     * Bestätigte Meldung an den Server, ohne Entwickler-Schlüssel (Plan C12, NS1 a: Meldungen gehen für alle). Nur an
     * einen Server, den server() annimmt (im Netz mit gültiger Unterschrift). { nr } oder null (dann gemeldet).
     */
    async function meldung(daten) {
      if (!(await server())) { melde(serverMeldung()); return null; }
      try {
        const r = await fetch(basis() + "/entwicklung/meldung", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...daten, app: o.app, versionen: versionen(), protokoll: PROTOKOLL }) });
        const antwort = await r.json();
        if (!r.ok) { melde(`Server: ${antwort.fehler || r.status}`); return null; }
        return antwort;
      } catch (e) {
        serverDa = null;
        melde(serverMeldung());
        return null;
      }
    }
    /** Alle Bemerkungen der App (über den Server) oder null. */
    async function bemerkungen() {
      if (!(await server())) return null;
      try { return await (await fetch(`${basis()}/entwicklung/bemerkungen?app=${o.app}`, { cache: "no-store" })).json(); } catch (e) { return null; }
    }

    return { app: o.app, adresse: basis, freigeschaltet, aktiv, freischalten, rolle, anforderungLink, sperren, setzeAn, benenne, name, zustand, server, serverMeldung, verbindungPruefen, versionen,
      /** Antwortet auf der Adresse ein anderer Server (nach server())? */ fremd: () => fremd,
      setzeGeprueft, setzeEintraege, bemerkung, meldung, bemerkungen, bemerkungStatus };
  }
  /** Was als Adresse erlaubt ist, für Meldungen an die Person (eine Stelle für Kern und Apps). */
  const ADRESSE_REGEL = "Erlaubt ist ein Entwickler-Server auf diesem Gerät (http://localhost:<Port> oder http://127.0.0.1:<Port>) "
    + "oder ein Server im Netz über https (https://name.beispiel.ch), leer für diese Seite.";
  /**
   * Adresse eines Entwickler-Servers prüfen: "" (dieselbe Seite), http(s)://localhost bzw. 127.0.0.1 mit Port (C11-3 a)
   * oder — seit Kern 1.39.0, Plan C12 NS1 a — ein Name im Netz nur über https (https://name.beispiel.ch[:Port]); dort
   * nimmt server() nur einen Server mit gültiger Unterschrift der Entwicklung an (NS2 a). Ergebnis ohne Schrägstrich
   * am Ende, oder null, wenn die Adresse nicht erlaubt ist (http im Netz, IP-Adressen im Netz, Pfade, andere Protokolle).
   */
  function adresseGueltig(text) {
    const t = String(text ?? "").trim();
    if (!t) return "";
    const port = p => !p || (Number(p) >= 1 && Number(p) <= 65535);
    const lokal = t.match(/^(https?):\/\/(localhost|127\.0\.0\.1)(?::(\d{1,5}))?\/?$/i);
    if (lokal) return port(lokal[3]) ? `${lokal[1].toLowerCase()}://${lokal[2].toLowerCase()}${lokal[3] ? `:${Number(lokal[3])}` : ""}` : null;
    const netz = t.match(/^https:\/\/((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63})(?::(\d{1,5}))?\/?$/i);
    if (!netz || !port(netz[2])) return null;
    return `https://${netz[1].toLowerCase()}${netz[2] ? `:${Number(netz[2])}` : ""}`;
  }
  entwicklung.adresseGueltig = adresseGueltig;
  entwicklung.ADRESSE_REGEL = ADRESSE_REGEL;
  entwicklung.PROTOKOLL = PROTOKOLL;
  entwicklung.SERVER_SCHLUESSEL = SERVER_SCHLUESSEL;
  entwicklung.unterschriftEcht = unterschriftEcht;
  entwicklung.UNTERSCHRIFT_ZWECK = UNTERSCHRIFT_ZWECK;
  entwicklung.verstehtProtokoll = verstehtProtokoll;
  entwicklung.SALZ = SALZ;
  entwicklung.SCHLUESSEL_HASH = SCHLUESSEL_HASH;

  KERN.entwicklung = entwicklung;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
