/* Kern — Sichern, Einlesen und Abgleich in einem Dateiformat für alle Apps (Entscheide DF1 a, DF2 a, DF4 a, R1 a, P1 a;
   Befund D4; docs/kern/rahmen.md 4.19). Herkunft: eulenpfad/spiele/gemeinsam/spiel.js (LS.zusammenfuehren,
   LS.abgleichDaten, Löschvermerke) und lernsteig/gemeinsam/daten.js (Prüfung vor dem Schreiben, alles oder nichts).

   Datei: { format: "reihe-daten", version: 1, app, art: "sicherung" | "abgleich", gesichert, geraet?, personen, runden,
            rekorde, geloescht?, freigabe?, freigabeStand?, … Teile der App unter eigenem Namen }
   - Personen ohne PIN und Gerätefelder; wer geschützt ist, reist mit dem Vermerk geschuetzt und nur dem Prüfwert seines
     Wiederherstellungscodes (KERN.person.fuerDatei, DF4 a).
   - Runden und Rekorde im Format von KERN.runden, je mit der Kennung ihrer Person.
   - geloescht (nur im Abgleich): { personen: { <id>: ISO }, namen: { <name>: ISO }, runden: [{ person?, name?, inhalt, bis }] }
     — ein Vermerk entfernt auf jedem Gerät, was bis zu seinem Zeitpunkt entstand; später Entstandenes bleibt (DF2 a).
   - freigabe, freigabeStand (nur im Abgleich, wenn die App sie teilt): die Freigabe des Geräts mit dem jüngsten Stand gilt.
   Ältere Dateien (eulenpfad-daten 1–3 und ohne format, lernsteig-sicherung 1–2) deutet lesen() um.

   Einlesen: erst die ganze Datei lesen und jeden Eintrag prüfen (Ungültiges wird gezählt und nie gespeichert), dann im
   Speicher zusammenführen, am Ende nur die geänderten Schlüssel schreiben — scheitert ein Schreiben (Speicher voll),
   wird der alte Stand zurückgeschrieben: alles oder nichts. */
"use strict";

(function (KERN) {
  const FORMAT = "reihe-daten";
  const VERSION = 1;
  // Formate der Reihe: alte Formatnamen und ihre App; Anzeige der App in Meldungen
  const ALTE_FORMATE = { "eulenpfad-daten": "eulenpfad", "lernsteig-sicherung": "lernsteig" };
  const APP_TEXT = { eulenpfad: "des Eulenpfads", lernsteig: "des Lernsteigs", gratwanderung: "der Gratwanderung" };
  const appText = a => APP_TEXT[a] || `der App „${a}“`;
  const KOPF = new Set(["format", "version", "app", "art", "gesichert", "geraet", "personen", "runden", "rekorde",
    "geloescht", "freigabe", "freigabeStand"]);
  const BESCHAEDIGT = "Die Datei ist beschädigt.";
  const SPEICHER_VOLL = "Der Speicher des Browsers ist voll oder gesperrt; nichts wurde eingelesen.";

  const istObjekt = x => !!x && typeof x === "object" && !Array.isArray(x);
  const liste = x => (Array.isArray(x) ? x : []);
  const juengste = werte => werte.filter(w => typeof w === "string" && w).sort().pop() || "";
  const kennungen = p => [p.id, ...(p.frueher || [])];

  // ---------- Löschvermerke (DF2 a) ----------
  /** Vermerke in der Form des Kerns; liest auch die des Eulenpfads bis LERN_Session18 (spieler nach Namen, spiel). */
  function vermerkeRein(g) {
    const v = istObjekt(g) ? g : {};
    const zeiten = o => Object.fromEntries(Object.entries(istObjekt(o) ? o : {}).filter(([k, t]) => k && typeof t === "string" && t));
    return {
      personen: zeiten(v.personen),
      namen: { ...zeiten(v.spieler), ...zeiten(v.namen) },
      runden: liste(v.runden).filter(r => istObjekt(r) && (r.person || r.name) && typeof r.bis === "string" && r.bis)
        .map(r => ({ ...(r.person ? { person: String(r.person) } : {}), ...(r.name ? { name: String(r.name) } : {}),
          inhalt: r.inhalt ?? r.spiel ?? null, bis: r.bis })),
    };
  }
  /** Vermerke beider Seiten gelten zusammen: je Person und Name der spätere, Runden-Vermerke vereint. */
  function vermerkeVereinen(a, b) {
    const g = vermerkeRein(a), f = vermerkeRein(b);
    for (const feld of ["personen", "namen"]) for (const [k, t] of Object.entries(f[feld])) if (!(g[feld][k] >= t)) g[feld][k] = t;
    const schl = r => `${r.person || ""}|${r.name || ""}|${r.inhalt || ""}|${r.bis}`;
    const da = new Set(g.runden.map(schl));
    for (const r of f.runden) if (!da.has(schl(r))) { g.runden.push(r); da.add(schl(r)); }
    return g;
  }
  /** Jüngster Stand einer Person (über ihre Änderungszeiten). */
  const personStand = p => juengste(Object.values(p?.geaendert || {}));
  /** Seit wann ist die Person gelöscht? Über alle ihre Kennungen und den Namen; "" = nicht. */
  const geloeschtSeit = (p, g) => juengste(kennungen(p).map(id => g.personen[id]).concat(g.namen[p.name]));
  /**
   * Gelöscht und seither weder geändert noch gespielt? aktiv: Zeit der jüngsten Runde der Person (beide Seiten) — wer
   * nach dem Vermerk gespielt hat (auf einem anderen Gerät), bleibt, wie bisher im Eulenpfad („neu gespielt bleibt“).
   */
  const personWeg = (p, g, aktiv = "") => { const s = geloeschtSeit(p, g); return !!s && juengste([personStand(p), aktiv]) <= s; };
  /** Ist der Eintrag durch einen Vermerk gelöscht? p: seine Person (oder null, dann gilt seine Kennung). */
  function eintragWeg(e, p, g) {
    const ids = p ? kennungen(p) : [e.person];
    const name = p ? p.name : e.name;
    const seit = juengste(ids.map(id => g.personen[id]).concat(name ? g.namen[name] : ""));
    if (seit && e.zeit <= seit) return true;
    return g.runden.some(r => (r.person ? ids.includes(r.person) : !!name && r.name === name)
      && (!r.inhalt || r.inhalt === e.inhalt) && e.zeit <= r.bis);
  }

  // ---------- Ältere Dateien ----------
  /** Profil nach Namen (Eulenpfad version 1, 2) → Person; die App kann es mit opt.altePerson genauer. */
  function altePersonStandard(name, profil) {
    const { geaendert = {}, ...rest } = profil;
    const { angelegt = "", ...zeiten } = istObjekt(geaendert) ? geaendert : {};
    const geboren = rest.geboren == null ? null : KERN.person.geburtsdatumLies(rest.geboren);
    return { ...rest, geboren, id: rest.id || KERN.person.neueId(), name: KERN.person.nameRein(name),
      rolle: rest.rolle === "aufsicht" ? "aufsicht" : "lernend", angelegt, geaendert: zeiten };
  }
  function ausEulenpfad(d, altePerson) {
    if (d.version !== undefined && ![1, 2, 3].includes(d.version)) throw new Error(BESCHAEDIGT);
    if (d.personen !== undefined && !Array.isArray(d.personen)) throw new Error(BESCHAEDIGT);
    for (const f of ["protokoll", "rekorde"]) if (d[f] !== undefined && !Array.isArray(d[f])) throw new Error(BESCHAEDIGT);
    const personen = Array.isArray(d.personen) ? d.personen.slice()
      : Object.entries(istObjekt(d.profile) ? d.profile : {}).filter(([, p]) => istObjekt(p)).map(([n, p]) => altePerson(n, p));
    const umd = l => liste(l).map(e => (istObjekt(e) ? KERN.runden.umdeuten(e, { spiel: "inhalt" }) : e));
    const runden = umd(d.protokoll), rekorde = umd(d.rekorde);
    // Einträge von vor LERN_Session15 tragen nur den Namen: Person der Datei mit diesem Namen, sonst eine neue
    // (ein Kind, das nur in Runden vorkommt)
    for (const e of runden.concat(rekorde)) {
      if (!istObjekt(e) || e.person || !e.name) continue;
      let p = personen.find(q => istObjekt(q) && KERN.person.nameGleich(q.name, e.name));
      if (!p) {
        p = { id: KERN.person.neueId(), name: KERN.person.nameRein(e.name), rolle: "lernend", angelegt: e.zeit || "", geaendert: {} };
        if (KERN.person.maengel(p).length) continue;
        personen.push(p);
      }
      e.person = p.id;
    }
    const { format, version, profile, protokoll, personen: _p, rekorde: _r, ...rest } = d;
    return { ...rest, format: FORMAT, version: VERSION, app: "eulenpfad", art: d.geloescht ? "abgleich" : "sicherung",
      personen, runden, rekorde };
  }
  /** Konto einer Sicherung des Lernsteigs bis LERN_Session15 (erstellt, geaendert als eine Zeit, ohne Rolle) → Person. */
  function lernsteigKonto(k) {
    if (!istObjekt(k)) return k;
    const { erstellt, ...rest } = k;
    const p = { ...rest, rolle: k.rolle || "lernend" };
    if (!p.angelegt && erstellt) p.angelegt = erstellt;
    if (typeof p.geaendert === "string" || p.geaendert === undefined) {
      const t = typeof k.geaendert === "string" ? k.geaendert : (p.angelegt || "");
      p.geaendert = {};
      for (const f of Object.keys(p)) if (!["id", "angelegt", "geaendert", "frueher"].includes(f)) p.geaendert[f] = t;
    }
    return p;
  }
  function ausLernsteig(d) {
    if (![1, 2].includes(d.version)) throw new Error(BESCHAEDIGT);
    for (const f of ["konten", "runden", "rekorde"]) if (d[f] !== undefined && !Array.isArray(d[f])) throw new Error(BESCHAEDIGT);
    const umd = l => liste(l).map(e => (istObjekt(e) ? KERN.runden.umdeuten(e, { konto: "person", uebung: "inhalt" }) : e));
    return { format: FORMAT, version: VERSION, app: "lernsteig", art: "sicherung", gesichert: d.erstellt || d.gesichert || "",
      personen: liste(d.konten).map(lernsteigKonto), runden: umd(d.runden), rekorde: umd(d.rekorde) };
  }

  /**
   * Datei lesen (Text oder Objekt) und in die heutige Form bringen. Fehler mit Klartext: kein gültiger Inhalt, keine
   * Datei der Reihe, Datei einer anderen App, neuere Fassung, beschädigt.
   */
  function lesen(eingabe, app, { altePerson = altePersonStandard } = {}) {
    let d = eingabe;
    if (typeof d === "string") { try { d = JSON.parse(d); } catch (e) { throw new Error("Diese Datei kann ich nicht lesen."); } }
    if (!istObjekt(d)) throw new Error("Diese Datei kann ich nicht lesen.");
    const alteEulenpfad = !d.format && (istObjekt(d.profile) || Array.isArray(d.personen)) && Array.isArray(d.protokoll);
    const von = d.format === FORMAT ? d.app : ALTE_FORMATE[d.format] || (alteEulenpfad ? "eulenpfad" : null);
    if (!von || typeof von !== "string") throw new Error("Das ist keine Sicherung und keine Abgleich-Datei.");
    if (von !== app) throw new Error(`Das ist eine Datei ${appText(von)}; hier lässt sie sich nicht einlesen.`);
    let n;
    if (d.format === FORMAT) {
      if (!Number.isInteger(d.version) || d.version < 1) throw new Error(BESCHAEDIGT);
      if (d.version > VERSION) throw new Error("Die Datei stammt aus einer neueren Fassung. Bitte die Seite neu laden und noch einmal einlesen.");
      n = d;
    } else n = von === "lernsteig" ? ausLernsteig(d) : ausEulenpfad(d, altePerson);
    for (const f of ["personen", "runden", "rekorde"]) if (n[f] !== undefined && !Array.isArray(n[f])) throw new Error(BESCHAEDIGT);
    if (n.geloescht !== undefined && n.geloescht !== null && !istObjekt(n.geloescht)) throw new Error(BESCHAEDIGT);
    return n;
  }

  // ---------- Daten einer App ----------
  /**
   * opt:
   *   app           "eulenpfad" | "lernsteig" | … — steht in der Datei; Dateien anderer Apps werden abgewiesen
   *   speicher      KERN.speicher(<präfix>) der App
   *   schluessel    Speicherschlüssel { personen, runden, rekorde, geloescht, freigabe, freigabeStand } (Standard
   *                 gleichnamig; Eulenpfad runden: "protokoll")
   *   dateiPraefix  Anfang der Dateinamen („lernspiele“, „lernsteig“: .gitignore hält <präfix>-*.json aus dem Repo)
   *   geraetFelder  Felder der Personen, die auf dem Gerät bleiben (Lernsteig: Verbindungen)
   *   pruefung      { runde, rekord } — Schema der App wie bei KERN.runden.maengel (zusatz, pflicht, inhaltBekannt)
   *   ohnePerson    Kennungen, denen Runden ohne Person gehören dürfen (Lernsteig: „gast“ bis LERN_Session16)
   *   freigabe      true: die Freigabe des Geräts reist im Abgleich mit (KERN.freigabe, jüngster Stand gewinnt)
   *   teile         { <name>: { schluessel, sichern(ids | null, eigene) → wert, zusammenfuehren(eigene, fremde, hilfe)
   *                 → { wert, neu }, entferne?(eigene, ids) → wert } } — Daten nur dieser App (Eulenpfad: meldungen);
   *                 hilfe = { umbiegen, personVon }
   *   altePerson    (name, profil) → Person — Profile nach Namen älterer Dateien des Eulenpfads
   */
  function daten(opt = {}) {
    const { app, speicher } = opt;
    if (typeof app !== "string" || !/^[a-z][a-z0-9-]*$/.test(app)) throw new Error("daten: app fehlt");
    if (!speicher || typeof speicher.lies !== "function") throw new Error("daten: speicher fehlt");
    const S = { personen: "personen", runden: "runden", rekorde: "rekorde", geloescht: "geloescht", freigabe: "freigabe",
      freigabeStand: "freigabeStand", ...(opt.schluessel || {}) };
    const dateiPraefix = opt.dateiPraefix || app;
    const geraetFelder = opt.geraetFelder || [];
    const pruefung = { runde: {}, rekord: {}, ...(opt.pruefung || {}) };
    const ohnePerson = new Set(opt.ohnePerson || []);
    const teile = opt.teile || {};
    const altePerson = opt.altePerson || altePersonStandard;
    for (const n of Object.keys(teile)) if (KOPF.has(n)) throw new Error(`daten: Teil ${n} heisst wie ein Feld des Kerns`);

    const KEIN = {}; // Marke für „Schlüssel fehlt“ beim Zurückschreiben
    const roh = k => speicher.lies(k, KEIN);
    const rohListe = k => liste(speicher.lies(k, []));
    const personenAlle = () => rohListe(S.personen).filter(p => !KERN.person.maengel(p).length);
    const vermerke = () => vermerkeRein(speicher.lies(S.geloescht, {}));

    /**
     * Neue Werte schreiben, nur geänderte Schlüssel; scheitert eines, wird alles zurückgeschrieben (Fehler mit Klartext).
     * Gibt die geschriebenen Schlüssel zurück.
     */
    function schreibeAlle(neu, meldung = SPEICHER_VOLL) {
      const vorher = {}, geschrieben = [];
      for (const [k, w] of Object.entries(neu)) {
        const alt = roh(k);
        if (alt !== KEIN && JSON.stringify(alt) === JSON.stringify(w)) continue;
        vorher[k] = alt;
        if (!speicher.schreibe(k, w)) {
          for (const g of geschrieben) { if (vorher[g] === KEIN) speicher.entferne(g); else speicher.schreibe(g, vorher[g]); }
          throw new Error(meldung);
        }
        geschrieben.push(k);
      }
      return geschrieben;
    }

    /**
     * Sicherung (art „sicherung“: die genannten Personen und ihre Einträge) oder Abgleich (art „abgleich“: alles, dazu
     * Löschvermerke und Freigabe). ids: Kennungen der Personen, null = alle; filter: e → bool für Runden und Rekorde
     * (etwa ohne Testrunden); geraet: { id, name } im Abgleich.
     */
    function sichern({ ids = null, art = "sicherung", filter = null, geraet = null } = {}) {
      if (!["sicherung", "abgleich"].includes(art)) throw new Error(`daten: unbekannte Art ${art}`);
      const alle = personenAlle();
      const auswahl = ids ? alle.filter(p => kennungen(p).some(id => ids.includes(id))) : alle;
      const menge = new Set(auswahl.flatMap(kennungen));
      const waehle = k => rohListe(k).filter(e => istObjekt(e) && menge.has(e.person) && (!filter || filter(e)));
      const d = { format: FORMAT, version: VERSION, app, art, gesichert: new Date().toISOString(), ...(geraet ? { geraet } : {}),
        personen: auswahl.map(p => KERN.person.fuerDatei(p, geraetFelder)), runden: waehle(S.runden), rekorde: waehle(S.rekorde) };
      if (art === "abgleich") {
        d.geloescht = vermerke();
        if (opt.freigabe) { d.freigabe = speicher.lies(S.freigabe, null); d.freigabeStand = speicher.lies(S.freigabeStand, null); }
      }
      for (const [name, t] of Object.entries(teile)) d[name] = t.sichern(ids ? [...menge] : null, speicher.lies(t.schluessel, null));
      return d;
    }

    /**
     * Datei einlesen und zusammenführen (Text oder Objekt). Ergebnis: { personen: { neu, geaendert }, runden, rekorde,
     * teile: { <name>: neu }, freigabe, abgewiesen, kennungen, ids (Personen der Datei nach dem Zusammenführen), neueIds
     * (davon neu auf dem Gerät), geschrieben (Schlüssel), datei: { art, gesichert, geraet } }. Fehler mit Klartext.
     */
    function einlesen(eingabe) {
      const d = lesen(eingabe, app, { altePerson });
      const erg = { personen: { neu: 0, geaendert: 0 }, runden: 0, rekorde: 0, teile: {}, freigabe: false, abgewiesen: 0,
        kennungen: {}, ids: [], neueIds: [], geschrieben: [], datei: { art: d.art, gesichert: d.gesichert || "", geraet: d.geraet || null } };

      // 1. Löschvermerke beider Seiten
      const g = vermerkeVereinen(speicher.lies(S.geloescht, {}), d.geloescht);

      // 2. Personen (P1 a, DF4 a): zusammenführen, dann fällt weg, wer gelöscht ist und seither weder geändert wurde
      //    noch gespielt hat (Runden beider Seiten); mit ihr ihre Runden
      const eigene = personenAlle();
      const bekannt = new Set(eigene.flatMap(kennungen));
      const fremde = liste(d.personen);
      const z = KERN.person.zusammenfuehren(eigene, fremde, { geraetFelder, schutz: true });
      erg.abgewiesen += z.abgewiesen;
      erg.kennungen = z.kennungen;
      const umbiegen = id => z.kennungen[id] || id;
      const findeIn = (l, id) => l.find(p => p.id === umbiegen(id) || (p.frueher || []).includes(id)) || null;
      const zuletzt = {}; // jüngste Runde je bleibender Kennung
      for (const e of rohListe(S.runden).concat(rohListe(S.rekorde), liste(d.runden), liste(d.rekorde))) {
        if (!istObjekt(e) || typeof e.person !== "string" || typeof e.zeit !== "string") continue;
        const p = findeIn(z.personen, e.person);
        if (p && !(zuletzt[p.id] >= e.zeit)) zuletzt[p.id] = e.zeit;
      }
      const personen = z.personen.filter(p => !personWeg(p, g, zuletzt[p.id]));
      const entfallen = z.personen.filter(p => !personen.includes(p));
      erg.personen = { neu: z.neu, geaendert: z.geaendert };
      const personVon = id => findeIn(personen, id);
      for (const f of fremde) {
        const p = istObjekt(f) && personVon(f.id);
        if (p && !erg.ids.includes(p.id)) { erg.ids.push(p.id); if (!kennungen(p).some(id => bekannt.has(id))) erg.neueIds.push(p.id); }
      }

      // 3. Runden und Rekorde (R1 a): fremde geprüft, nur zu einer Person des Ergebnisses; Vermerke gelten für beide Seiten
      const personDa = id => !!personVon(id) || ohnePerson.has(id);
      // Einträge einer jetzt entfallenen Person gehen mit ihr; Einträge ohne bekannte Person (ältere Fassungen) bleiben,
      // wie sie sind, soweit kein Vermerk sie trifft
      const behalten = e => !findeIn(entfallen, e.person) && !eintragWeg(e, personVon(e.person), g);
      const zr = KERN.runden.zusammenfuehren(rohListe(S.runden), liste(d.runden),
        { art: "runde", pruefung: { ...pruefung.runde, personBekannt: personDa }, umbiegen, behalten });
      const zk = KERN.runden.zusammenfuehren(rohListe(S.rekorde), liste(d.rekorde),
        { art: "rekord", pruefung: { ...pruefung.rekord, personBekannt: personDa }, umbiegen, behalten });
      erg.runden = zr.neu; erg.rekorde = zk.neu + zk.ersetzt; erg.abgewiesen += zr.abgewiesen + zk.abgewiesen;

      const neu = { [S.geloescht]: g, [S.personen]: personen, [S.runden]: zr.eintraege, [S.rekorde]: zk.eintraege };
      // Wer schon da war und gelöscht wurde, ist weg; ohne Vermerk und ohne Änderung bleibt der Schlüssel unberührt
      if (roh(S.geloescht) === KEIN && !g.runden.length && !Object.keys(g.personen).length && !Object.keys(g.namen).length) delete neu[S.geloescht];

      // 4. Freigabe: die des Geräts mit dem jüngsten Stand
      if (opt.freigabe && istObjekt(d.freigabe) && typeof d.freigabeStand === "string" && d.freigabeStand > speicher.lies(S.freigabeStand, "")) {
        neu[S.freigabe] = d.freigabe; neu[S.freigabeStand] = d.freigabeStand; erg.freigabe = true;
      }

      // 5. Teile der App
      for (const [name, t] of Object.entries(teile)) {
        if (d[name] === undefined) continue;
        const r = t.zusammenfuehren(speicher.lies(t.schluessel, null), d[name], { umbiegen, personVon });
        neu[t.schluessel] = r.wert; erg.teile[name] = r.neu || 0;
      }

      // 6. Schreiben: alles oder nichts
      erg.geschrieben = schreibeAlle(neu);
      return erg;
    }

    /** Person löschen (mit Vermerk, damit kein Abgleich sie zurückholt); false, wenn es sie nicht gibt. */
    function loeschePerson(id) {
      const p = personenAlle().find(q => kennungen(q).includes(id));
      if (!p) return false;
      const jetzt = new Date().toISOString();
      const g = vermerke();
      g.personen[p.id] = jetzt; g.namen[p.name] = jetzt;
      const ids = kennungen(p);
      const neu = { [S.geloescht]: g, [S.personen]: rohListe(S.personen).filter(q => !(istObjekt(q) && ids.includes(q.id))),
        [S.runden]: rohListe(S.runden).filter(e => !ids.includes(e?.person)), [S.rekorde]: rohListe(S.rekorde).filter(e => !ids.includes(e?.person)) };
      for (const t of Object.values(teile)) if (t.entferne) neu[t.schluessel] = t.entferne(speicher.lies(t.schluessel, null), ids);
      schreibeAlle(neu, "Der Speicher des Browsers ist voll oder gesperrt; nichts wurde gelöscht.");
      return true;
    }
    /** Runden einer Person löschen — alle oder die eines Inhalts; Person und Profil bleiben. */
    function loescheRunden(id, inhalt = null) {
      const p = personenAlle().find(q => kennungen(q).includes(id));
      const ids = p ? kennungen(p) : [id];
      const g = vermerke();
      g.runden.push({ person: p ? p.id : id, ...(p ? { name: p.name } : {}), inhalt, bis: new Date().toISOString() });
      const weg = e => istObjekt(e) && ids.includes(e.person) && (!inhalt || e.inhalt === inhalt);
      schreibeAlle({ [S.geloescht]: g, [S.runden]: rohListe(S.runden).filter(e => !weg(e)), [S.rekorde]: rohListe(S.rekorde).filter(e => !weg(e)) },
        "Der Speicher des Browsers ist voll oder gesperrt; nichts wurde gelöscht.");
    }

    /** Dateiname: <präfix>-<teil>-<JJJJ-MM-TT>.json; teil aus Buchstaben und Ziffern (Namen mit „-“ verbunden). */
    function dateiname(teil = "", datum = new Date()) {
      const t = String(teil).replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
      return `${dateiPraefix}-${t ? t + "-" : ""}${datum.toISOString().slice(0, 10)}.json`;
    }

    return { app, schluessel: S, sichern, einlesen, lesen: e => lesen(e, app, { altePerson }), loeschePerson, loescheRunden,
      vermerke, dateiname };
  }

  KERN.daten = Object.assign(daten, { FORMAT, VERSION, lesen, vermerkeRein, vermerkeVereinen, personWeg, eintragWeg });
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
