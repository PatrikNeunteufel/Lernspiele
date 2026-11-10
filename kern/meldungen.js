/* Kern — Fehlermeldungen und Anregungen an die Entwicklung (Plan C11, Entscheide C11-1 a, C11-2 a, C11-3 a;
   docs/kern/rahmen.md 4.28). Herkunft: eulenpfad/spiele/gemeinsam/spiel.js (LERN_Session9, M1 a; Anregungen
   LERN_Session11; Korrekturen LP4 a).

   Speicher <app>:meldungen = [{ id, typ?, name, person?, zeit, stand, status, verlauf: [{ zeit, status, von, notiz? }],
   <inhalt>, stufe, klasse?, aufgabeNr, aufgabe, loesung, eingabe, ergebnis, art, text, antwort?, gelesen, … }].
   Was die App verschieden macht (Wort und Feld für den Inhalt, Stufe im Text, wer meldet, Zusatzzeilen, Arten und
   Status mit Texten, Kontakt), gibt sie als Option; die Oberfläche baut sie selbst.

   Zusammenführen (Abgleich, Einlesen): je Kennung gewinnt der bessere Stand, nicht der jüngere (Patrik, C11-1 a) —
   der weiter fortgeschrittene Status, bei gleichem Status der mit Antwort, dann der mit längerem Verlauf, zuletzt
   der jüngere; die Verläufe beider Seiten werden vereinigt, damit nichts verloren geht.

   Weg zur Entwicklung (austauschbar, damit später ein Server dazukommen kann): der Entwickler-Server (lokal, über
   KERN.entwicklung), die E-Mail aus dem eigenen Mailprogramm (Adresse aus <app>/kontakt.js) oder der Text zum
   Kopieren. Nichts davon trägt den Namen der Person. */
"use strict";

(function (KERN) {
  // Fortschritt eines Status: weiter hinten ist besser. „kein-fehler“ ist wie „behoben“ ein Abschluss.
  const RANG = { neu: 0, bestaetigt: 1, weitergeleitet: 2, geplant: 3, behoben: 4, "kein-fehler": 4 };
  const rang = m => RANG[m?.status] ?? 0;
  const WEITERGEGEBEN = ["weitergeleitet", "geplant", "behoben", "kein-fehler"];
  const WEGE = ["auto", "server", "mail", "text"];

  /** Ist b besser als a? (gleicher Kennung; siehe Kopf) */
  function besser(a, b) {
    if (rang(b) !== rang(a)) return rang(b) > rang(a);
    if (b.status === a.status) {
      if (!!b.antwort !== !!a.antwort) return !!b.antwort;
      const lb = (b.verlauf || []).length, la = (a.verlauf || []).length;
      if (lb !== la) return lb > la;
    }
    return String(b.stand || "") > String(a.stand || "");
  }

  /** Zwei Fassungen derselben Meldung zu einer: Grundlage die bessere, Verläufe vereinigt. */
  function vereinige(a, b) {
    const [gut, schwach] = besser(a, b) ? [b, a] : [a, b];
    const schluessel = v => `${v.zeit}|${v.status}|${v.von || ""}|${v.notiz || ""}`;
    const verlauf = new Map();
    for (const v of [...(gut.verlauf || []), ...(schwach.verlauf || [])]) if (v && typeof v === "object") verlauf.set(schluessel(v), v);
    const n = { ...gut, verlauf: [...verlauf.values()].sort((x, y) => (String(x.zeit) < String(y.zeit) ? -1 : String(x.zeit) > String(y.zeit) ? 1 : 0)) };
    // Antwort derselben Stufe nicht verlieren; gesehen ist sie, wenn eine Seite sie gesehen hat
    if (schwach.status === gut.status && (schwach.antwort || "") === (gut.antwort || "")) n.gelesen = !!(gut.gelesen || schwach.gelesen);
    else if (schwach.status === gut.status && !gut.antwort && schwach.antwort) n.antwort = schwach.antwort;
    // Stand bleibt der der besseren Fassung: Eine jüngere, aber schwächere Fassung ändert sonst nichts Sichtbares und
    // zählte trotzdem als geändert. Beide Geräte kommen so zum selben Ergebnis (gleiche Grundlage, gleicher Verlauf).
    return n;
  }

  /**
   * Meldungen zweier Geräte oder einer Datei zusammenführen: { wert, neu } (neu = hinzugekommen oder geändert).
   * ctx.umbiegen(id) → Kennung einer zusammengeführten Person; ctx.personVon(id) → { id, name } oder null.
   */
  function zusammenfuehren(eigene, fremde, ctx = {}) {
    const mitPerson = m => {
      if (!m || typeof m !== "object" || m.typ === "anregung" || !m.person) return m;
      const p = ctx.personVon ? ctx.personVon(m.person) : null;
      return p ? { ...m, person: p.id, name: p.name } : { ...m, person: ctx.umbiegen ? ctx.umbiegen(m.person) : m.person };
    };
    const da = new Map((Array.isArray(eigene) ? eigene : []).filter(m => m && m.id).map(m => [m.id, mitPerson(m)]));
    let neu = 0;
    for (const roh of Array.isArray(fremde) ? fremde : []) {
      if (!roh || typeof roh !== "object" || !roh.id) continue;
      const m = mitPerson(roh), alt = da.get(m.id);
      const n = alt ? vereinige(alt, m) : m;
      if (!alt || JSON.stringify(n) !== JSON.stringify(alt)) { da.set(m.id, n); neu++; }
    }
    return { wert: [...da.values()].sort((a, b) => (a.zeit < b.zeit ? -1 : a.zeit > b.zeit ? 1 : 0)), neu };
  }

  /** Status einer Bemerkung (bemerkungen.json) als Status einer Meldung; offen = noch keine Antwort (null). */
  function statusAusBemerkung(text = "") {
    const t = String(text || "").toLowerCase();
    if (t.startsWith("erledigt")) return "behoben";
    if (t.startsWith("kein fehler")) return "kein-fehler";
    if (t.startsWith("geplant") || t.startsWith("in arbeit")) return "geplant";
    return null;
  }

  /**
   * Meldungen einer App.
   * opt.app, opt.titel   „eulenpfad“, „Eulenpfad“ (Betreff der E-Mail)
   * opt.version()        → Version der App (APP_VERSION.version, NS3 a); jede neue Meldung merkt sich
   *                      versionen = { app, kern } — die Fassung, in der es geschah —, Text und Betreff nennen sie
   * opt.speicher         { lies, schreibe } der App; opt.schluessel (Standard „meldungen“)
   * opt.person(name)     → { id } oder null (Kennung der Person in der Meldung)
   * opt.inhalt           { feld: „spiel“ | „uebung“, wort: „Spiel“ | „Übung“, name: id → Anzeigename }
   * opt.stufe            { text: stufe → Text nach „Stufe “, aus: Text → stufe oder null } (Standard: unverändert)
   * opt.wer(m)           → Text in Klammern nach der Kennung („Kind, 3. Klasse“)
   * opt.zusatz(m)        → weitere Zeilen nach der Zeile mit dem Inhalt (Lernsteig: Niveau) oder []
   * opt.woerter          { eingaben, notiz } — Anfang der Zeilen (Eulenpfad: „Eingaben des Kindes“, „Notiz der Aufsicht“)
   * opt.arten, opt.anregungArten  { wert: Text }
   * opt.status           { status: { text, … } } (bekannte Status der App)
   * opt.kontakt()        → { meldungen?: E-Mail, server?: Adresse des Entwickler-Servers } (Vorgabe der Entwicklung,
   *                      <app>/kontakt.js; je Gerät abweichend über setzeMeldeweg, C11-3 a)
   * opt.entwicklung      KERN.entwicklung der App, eine Funktion, die sie liefert (später geladen), oder null
   * opt.standDatei       Pfad der veröffentlichten Antworten (Standard „meldungen-stand.json“)
   */
  function meldungen(opt) {
    const o = opt || {};
    if (!o.speicher || typeof o.speicher.lies !== "function") throw new Error("meldungen: speicher fehlt");
    if (!o.inhalt || !o.inhalt.feld) throw new Error("meldungen: inhalt fehlt");
    const S = o.schluessel || "meldungen";
    const feld = o.inhalt.feld;
    const inhaltName = id => (o.inhalt.name ? o.inhalt.name(id) : null) || id;
    const stufeText = s => (o.stufe && o.stufe.text ? o.stufe.text(s) : String(s));
    const stufeAus = t => (o.stufe && o.stufe.aus ? o.stufe.aus(t) : t);
    const arten = o.arten || {}, anregungArten = o.anregungArten || {}, status = o.status || {};
    const tag = iso => (KERN.zeit ? KERN.zeit.tag(iso) : String(iso).slice(0, 10));
    const woerter = { eingaben: "Eingaben", notiz: "Notiz", ...(o.woerter || {}) };
    const entwicklung = () => (typeof o.entwicklung === "function" ? o.entwicklung() : o.entwicklung) || null;

    const istAnregung = m => m?.typ === "anregung";
    const alle = () => { const l = o.speicher.lies(S, []); return Array.isArray(l) ? l : []; };
    const schreibe = l => o.speicher.schreibe(S, l);
    const von = name => alle().filter(m => m.name === name && !istAnregung(m));
    const anregungen = () => alle().filter(istAnregung);
    const korrekturen = () => anregungen().filter(m => m.art === "korrektur");
    const gefunden = name => von(name).filter(m => m.status === "behoben").length;
    const ungelesen = name => von(name).filter(m => !m.gelesen);

    function neu(daten) {
      const jetzt = new Date().toISOString();
      const id = `M-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      const p = o.person ? o.person(daten.name) : null;
      const v = { app: (typeof o.version === "function" ? o.version() : "") || "", kern: KERN.version || "" };
      const m = { id, zeit: jetzt, stand: jetzt, status: "neu", gelesen: true, ...(v.app || v.kern ? { versionen: v } : {}),
        ...daten, ...(p ? { person: p.id } : {}), verlauf: [{ zeit: jetzt, status: "neu", von: daten.name }] };
      schreibe([...alle(), m]);
      return m;
    }
    const neueAnregung = daten => neu({ ...daten, typ: "anregung" });
    const neueKorrektur = daten => neueAnregung({ ...daten, art: "korrektur" });
    /** Eigene, noch nicht gesendete Meldung oder Anregung löschen. */
    const entferne = id => schreibe(alle().filter(m => m.id !== id));

    /** Ändern (Status, Antwort …): ein neuer Status kommt in den Verlauf; neuer Status oder neue Antwort = ungelesen. */
    function setze(id, aenderung, { von: wer = "", notiz = "" } = {}) {
      const jetzt = new Date().toISOString();
      schreibe(alle().map(m => {
        if (m.id !== id) return m;
        const n = { ...m, ...aenderung, stand: jetzt };
        if (aenderung.status && aenderung.status !== m.status) n.verlauf = [...(m.verlauf || []), { zeit: jetzt, status: aenderung.status, von: wer, ...(notiz ? { notiz } : {}) }];
        if ((aenderung.status && aenderung.status !== m.status) || (aenderung.antwort && aenderung.antwort !== m.antwort)) n.gelesen = false;
        return n;
      }));
    }
    /** Die Person hat ihre Rückmeldungen gesehen. */
    function gelesen(name) {
      if (!ungelesen(name).length) return;
      schreibe(alle().map(m => (m.name === name ? { ...m, gelesen: true } : m)));
    }

    /** „Eulenpfad 1.0.0 · Kern 1.36.0“ aus den Versionen einer Meldung, "" bei älteren ohne (NS3 a). */
    const versionText = m => {
      const v = m?.versionen;
      if (!v || (!v.app && !v.kern)) return "";
      return [v.app ? `${o.titel || o.app} ${v.app}` : null, v.kern ? `Kern ${v.kern}` : null].filter(Boolean).join(" · ");
    };
    /** Text für die Entwicklung: ohne Namen, mit Kennung. */
    function alsText(m) {
      const id = m[feld];
      const version = versionText(m) ? `Version: ${versionText(m)}` : null;
      if (istAnregung(m)) return [
        `Anregung ${m.id} (Aufsicht), ${tag(m.zeit)}`,
        version,
        `Art: ${anregungArten[m.art] || m.art}`,
        id ? `${o.inhalt.wort}: ${inhaltName(id)} (${id})` : null,
        m.liste ? `Liste: ${m.liste}` : null,
        m.eintrag ? `Eintrag: ${m.eintrag}${m.schluessel ? ` [${m.schluessel}]` : ""}` : null,
        `Anregung: ${m.text}`,
      ].filter(Boolean).join("\n");
      return [
        `Meldung ${m.id} (${o.wer ? o.wer(m) : "Person"}), ${tag(m.zeit)}`,
        version,
        `${o.inhalt.wort}: ${inhaltName(id)} (${id}), Stufe ${stufeText(m.stufe)}, Aufgabe ${m.aufgabeNr ?? "?"}`,
        ...(o.zusatz ? o.zusatz(m) || [] : []),
        `Art: ${arten[m.art] || m.art}`,
        `Aufgabe: ${m.aufgabe || "—"}`,
        m.loesung ? `Erwartete Lösung: ${m.loesung}` : null,
        m.eingabe ? `${woerter.eingaben}: ${m.eingabe}` : null,
        m.ergebnis ? `Gewertet: ${m.ergebnis}` : null,
        `Begründung: ${m.text}`,
        ...(m.verlauf || []).filter(v => v.notiz).map(v => `${woerter.notiz}: ${v.notiz}`),
      ].filter(Boolean).join("\n");
    }
    /** Eine per E-Mail angekommene Meldung wieder lesen: { meldung, <feld>?, stufe? } oder null ohne Kennung. */
    function ausText(text) {
      const id = String(text || "").match(/(?:Meldung|Anregung) (M-[a-z0-9]+-[a-z0-9]+)/)?.[1];
      if (!id) return null;
      const ort = String(text).match(/\(([a-z0-9-]+)\), Stufe ([a-z0-9-]+)/);
      const stufe = ort ? stufeAus(ort[2]) : null;
      return { meldung: id, ...(ort && stufe ? { [feld]: ort[1], stufe } : {}) };
    }

    // ----- Weg zur Entwicklung -----
    const adresse = () => (o.kontakt ? o.kontakt()?.meldungen : "") || "";
    /**
     * Weg je Gerät (C11-3 a), Speicher <app>:meldeweg = { weg, server? }: weg „auto“ (Server, sonst E-Mail, sonst Text),
     * „server“, „mail“ oder „text“; server = Adresse des Entwickler-Servers ("" = dieselbe Seite), ohne Angabe die
     * Vorgabe der Entwicklung aus <app>/kontakt.js (Feld server). Nur auf diesem Gerät, reist nicht mit.
     */
    function meldeweg() {
      const e = o.speicher.lies("meldeweg", null) || {};
      const vorgabe = (o.kontakt ? o.kontakt()?.server : "") || "";
      const eigen = typeof e.server === "string";
      return { weg: WEGE.includes(e.weg) ? e.weg : "auto", server: eigen ? e.server : vorgabe, eigeneAdresse: eigen, vorgabe };
    }
    /** Weg setzen; server null = Vorgabe der Entwicklung. Wirft bei einer nicht erlaubten Adresse. */
    function setzeMeldeweg({ weg = "auto", server = null } = {}) {
      if (!WEGE.includes(weg)) throw new Error(`Unbekannter Weg ${weg}`);
      const pruefe = KERN.entwicklung && KERN.entwicklung.adresseGueltig ? KERN.entwicklung.adresseGueltig : t => String(t || "");
      let s = null;
      if (server !== null) {
        s = pruefe(server);
        if (s === null) throw new Error(`Diese Adresse ist nicht erlaubt. ${KERN.entwicklung && KERN.entwicklung.ADRESSE_REGEL ? KERN.entwicklung.ADRESSE_REGEL : ""}`.trim());
      }
      o.speicher.schreibe("meldeweg", { weg, ...(s !== null ? { server: s } : {}) });
      return meldeweg();
    }
    /** mailto-Link mit Betreff und Text oder null ohne Adresse. */
    function mailLink(m) {
      const an = adresse();
      if (!an) return null;
      // Lernprogramm mit Version, Kennung (Ticket) und Thema im Betreff (NS1 a, Zusatz Patrik)
      const app = `${o.titel}${m.versionen?.app ? ` ${m.versionen.app}` : ""}`;
      const betreff = istAnregung(m) ? `${app}: Anregung ${m.id}${m[feld] ? ` (${m[feld]})` : ""}`
        : `${app}: Fehlermeldung ${m.id} (${m[feld]}, Stufe ${stufeText(m.stufe)})`;
      return `mailto:${an}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(alsText(m))}`;
    }
    /** Daten einer Bemerkung für den Entwickler-Server. */
    const bemerkungDaten = m => ({ text: alsText(m), [feld === "spiel" ? "spiel" : "inhalt"]: m[feld] || undefined, stufe: m.stufe,
      aufgabe: m.aufgabe ? `Aufgabe ${m.aufgabeNr}: ${m.aufgabe}` : undefined, meldung: m.id,
      fassung: versionText(m) || undefined });

    /**
     * Weitergeben nach dem Weg des Geräts (meldeweg): „auto“ Entwickler-Server, sonst E-Mail, sonst Text; „server“, „mail“,
     * „text“ nur diesen Weg. ui: { von, bestaetigen(„meldung“ | „anregung“) → bool, oeffne(url), kopiere(text) → Promise,
     * melde(text) }. Setzt den Status „weitergeleitet“ mit Notiz; gibt den Weg zurück („server“, „mail“, „text“) oder null,
     * wenn abgebrochen oder der gewählte Weg nicht geht (dann mit melde begründet).
     */
    async function weitergeben(m, ui = {}) {
      const e = entwicklung();
      const { weg } = meldeweg();
      const sag = text => { if (ui.melde) ui.melde(text); return null; };
      if (weg === "auto" || weg === "server") {
        // Meldungen gehen für alle, ohne Entwickler-Schlüssel (Plan C12, NS1 a), aber nur an einen Server, den der Kern
        // annimmt: auf diesem Gerät, oder im Netz mit gültiger Unterschrift der Entwicklung (NS2 a)
        const da = e && (await e.server());
        if (da) {
          const b = await (e.meldung ? e.meldung(bemerkungDaten(m)) : e.bemerkung(bemerkungDaten(m)));
          if (!b) return null;
          setze(m.id, { status: "weitergeleitet" }, { von: ui.von, notiz: `Bemerkung Nr. ${b.nr}` });
          return "server";
        }
        if (weg === "server") return sag(!e ? "Gewählt ist der Entwickler-Server, aber diese Seite kennt keinen." : e.serverMeldung());
      }
      const mail = weg === "text" ? null : mailLink(m);
      if (weg === "mail" && !mail) return sag("Gewählt ist E-Mail, aber die Entwicklung hat noch keine Adresse eingetragen.");
      if (mail) {
        if (ui.bestaetigen && !ui.bestaetigen(istAnregung(m) ? "anregung" : "meldung")) return null;
        if (ui.oeffne) ui.oeffne(mail);
        setze(m.id, { status: "weitergeleitet" }, { von: ui.von, notiz: "per E-Mail" });
        return "mail";
      }
      if (ui.kopiere) await ui.kopiere(alsText(m));
      setze(m.id, { status: "weitergeleitet" }, { von: ui.von, notiz: "als Text kopiert" });
      return "text";
    }

    /**
     * Antworten übernehmen: { <id>: { status, antwort? } } mit status geplant | behoben | kein-fehler; nur für schon
     * weitergegebene Meldungen. Gibt die Zahl der geänderten zurück.
     */
    function standAnwenden(stand) {
      let n = 0;
      for (const m of alle()) {
        const s = stand?.[m.id];
        if (!s || !status[s.status] || !WEITERGEGEBEN.includes(m.status)) continue;
        if (s.status === m.status && (s.antwort || "") === (m.antwort || "")) continue;
        setze(m.id, { status: s.status, ...(s.antwort ? { antwort: s.antwort } : {}) }, { von: "Entwicklung" });
        n++;
      }
      return n;
    }
    /** Antworten holen: veröffentlichte Datei und, mit Entwickler-Server, die Bemerkungen. Gibt die Zahl zurück. */
    async function abfragen() {
      const stand = {};
      try {
        const r = await fetch(o.standDatei || "meldungen-stand.json", { cache: "no-store" });
        if (r.ok) Object.assign(stand, await r.json());
      } catch (e) { /* offline oder ohne Datei */ }
      const e = entwicklung();
      const b = e && e.freigeschaltet() ? await e.bemerkungen() : null;
      for (const x of b || []) {
        const s = statusAusBemerkung(x.status);
        if (x.meldung && s) stand[x.meldung] = { status: s, ...(x.antwort ? { antwort: x.antwort } : {}) };
      }
      return standAnwenden(stand);
    }

    /** Teil für KERN.daten (Sichern, Einlesen, Abgleich): Meldungen der gewählten Personen, Zusammenführen wie oben. */
    const teil = {
      schluessel: S,
      sichern: (ids, eigene) => (Array.isArray(eigene) ? eigene : []).filter(m => m && (!ids || ids.includes(m.person))),
      zusammenfuehren: (eigene, fremde, ctx) => zusammenfuehren(eigene, fremde, ctx),
    };

    return { app: o.app, istAnregung, alle, von, anregungen, korrekturen, gefunden, ungelesen, neu, neueAnregung,
      neueKorrektur, entferne, setze, gelesen, alsText, ausText, adresse, mailLink, bemerkungDaten, weitergeben, meldeweg, setzeMeldeweg, WEGE,
      standAnwenden, abfragen, statusAusBemerkung, teil };
  }
  meldungen.besser = besser;
  meldungen.vereinige = vereinige;
  meldungen.zusammenfuehren = zusammenfuehren;
  meldungen.statusAusBemerkung = statusAusBemerkung;
  meldungen.RANG = RANG;

  KERN.meldungen = meldungen;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
