/* Gemeinsamer Rahmen aller Lernspiele: Stufenwahl, Runde mit Fortschritt, Eule mit
   Sprechblase, Bildschirmtastatur, Töne, Konfetti, Schluss mit Sternen.
   Ein Spiel ruft LS.spiel({...}) auf und zeichnet nur noch seine Aufgaben. */

const LS = (() => {
  "use strict";

  // Reihenfolge von gross nach klein, wie in der Stellenwerttabelle.
  const STELLEN = [
    { k: "M",  name: "Millionen",        wert: 1000000 },
    { k: "HT", name: "Hunderttausender", wert: 100000 },
    { k: "ZT", name: "Zehntausender",    wert: 10000 },
    { k: "T",  name: "Tausender",        wert: 1000 },
    { k: "H",  name: "Hunderter",        wert: 100 },
    { k: "Z",  name: "Zehner",           wert: 10 },
    { k: "E",  name: "Einer",            wert: 1 },
  ];

  const SCHMAL = " "; // schmales, nicht umbrechendes Leerzeichen

  /** Zahl in Schulschreibweise: ab fünf Stellen in Dreiergruppen („30 400“), sonst ungegliedert. */
  function zahlText(n) {
    const s = String(Math.abs(n));
    const text = s.length < 5 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, SCHMAL);
    return n < 0 ? "−" + text : text;
  }

  /** „bei den Zehnern“, „bei den Millionen“ */
  function dativ(stelle) { return stelle.name.endsWith("n") ? stelle.name : stelle.name + "n"; }

  function zufall(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
  function waehle(liste) { return liste[Math.floor(Math.random() * liste.length)]; }
  function mische(liste) {
    const a = liste.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Ziffern einer Zahl je Stelle, z. B. 30400 → {M:0, HT:0, ZT:3, T:0, H:4, Z:0, E:0}. */
  function zerlege(n) {
    const z = {};
    for (const st of STELLEN) z[st.k] = Math.floor(n / st.wert) % 10;
    return z;
  }

  function el(tag, attr = {}, ...kinder) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attr)) {
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (const kind of kinder) if (kind != null) e.append(kind);
    return e;
  }

  // ---------- Speicher (nur im Browser, darf fehlen) ----------

  // Wer wissen will, dass etwas gespeichert wurde (der Abgleich zwischen Geräten, abgleich.js).
  const aenderungsHoerer = [];
  const beiAenderung = f => aenderungsHoerer.push(f);

  function lies(schluessel, ersatz) {
    try {
      const v = localStorage.getItem("lernspiele:" + schluessel);
      return v === null ? ersatz : JSON.parse(v);
    } catch { return ersatz; }
  }

  function schreibe(schluessel, wert) {
    try { localStorage.setItem("lernspiele:" + schluessel, JSON.stringify(wert)); } catch { /* egal */ }
    for (const f of aenderungsHoerer) try { f(schluessel); } catch { /* ein Hörer darf das Speichern nicht stören */ }
  }

  // ---------- Spieler, Profil und Protokoll (nur auf diesem Gerät) ----------
  // Profil je Name: { alter, klasse, fokus: [Lernziel-Ids, z. B. "4.2-G3"],
  //   reihenfolge: { global, spiele: { <spiel-id>: … } } mit "stufe" | "geordnet" | "gemischt" }
  // Protokoll: je gespielte Runde ein Eintrag
  // { name, zeit (ISO), spiel, stufe, sterne, fehler, aufgaben, dauer (s), geordnet,
  //   fehlerAufgaben: [{ text, loesung, versuche, geloest }] }

  //   timer: { an, faktor, spiele: { <spiel-id>: { an (null = wie global), sekunden: { s1: … } } } }
  //   rolle: "kind" | "aufsicht" (Entscheid L2 a) — die Aufsicht meldet sich mit PIN an, verwaltet
  //     Konten und Freigaben und spielt als Tester: Runden mit test: true, im Spiel Testhilfen
  //   pin: { salz, hash } nur bei der Aufsicht (SHA-256, nie die PIN selbst)
  //   favoriten: [<spiel-id>], endlosAn: [<spiel-id>] (Karte startet Endlos-Runden), ansicht: "kacheln" | "kompakt",
  //   zu: [<Gruppen-Id>] (zugeklappt)
  //   mix: zuletzt gewählte Einstellungen des Zufallsmix (mix/mix.js) oder null
  //   meineKlasse: Filter „🎒 Meine Klasse“ im Tab Spiele (K2 a); fehlt = an
  //   optionen: { <spiel-id>: { <option>: Wert } } — Spieloptionen aus def.optionen (UE1 a); fehlt = "stufe"
  //   geaendert: { <feld>: ISO, angelegt: ISO } — setzt speichereProfil; beim Abgleich gewinnt je Feld der jüngere Stand
  const LEERES_PROFIL = {
    alter: null, klasse: null, fokus: [], rolle: "kind",
    reihenfolge: { global: "stufe", spiele: {} },
    timer: { an: false, faktor: 1, spiele: {} },
    favoriten: [], endlosAn: [], ansicht: "kacheln", zu: [], mix: null,
  };

  /** Vorgabezeit je Aufgabe aus dem Katalog (Sekunden), falls die Seite ihn geladen hat. */
  function vorgabeZeit(spiel, stufe) {
    const eintrag = typeof SPIELE !== "undefined" ? SPIELE.find(s => s.id === spiel) : null;
    return eintrag?.zeiten?.[stufe] ?? 30;
  }

  /**
   * Läuft für dieses Spiel und diese Stufe ein Timer, und wie viele Sekunden je Aufgabe?
   * Reihenfolge: Einstellung je Spiel → globale Einstellung; Sekunden je Spiel und Stufe →
   * Vorgabezeit × globaler Faktor.
   */
  function timerFuer(name, spiel, stufe) {
    const t = { ...LEERES_PROFIL.timer, ...(profil(name).timer || {}) };
    const s = t.spiele?.[spiel] || {};
    return {
      an: s.an ?? t.an,
      sekunden: s.sekunden?.[stufe] ?? Math.max(5, Math.round(vorgabeZeit(spiel, stufe) * (t.faktor || 1))),
    };
  }

  /**
   * Zeitvorschlag aus den eigenen Messungen: Median der auf Anhieb gelösten Aufgaben × 1.5,
   * erst ab 5 Messungen; sonst null.
   */
  function zeitVorschlag(name, spiel, stufe) {
    const ms = protokoll()
      .filter(e => e.name === name && e.spiel === spiel && e.stufe === stufe)
      .flatMap(e => (e.aufgabenZeiten || []).filter(a => a.geloest && a.versuche === 0 && !a.zeitUm).map(a => a.ms))
      .sort((a, b) => a - b);
    if (ms.length < 5) return null;
    return { sekunden: Math.max(5, Math.round(ms[Math.floor(ms.length / 2)] * 1.5 / 1000)), n: ms.length };
  }

  /** Timer eines Spiels für einen Spieler ein- oder ausschalten (null = wie global). */
  function setzeTimerSpiel(name, spiel, an) {
    const t = { ...LEERES_PROFIL.timer, ...(profil(name).timer || {}) };
    t.spiele = { ...t.spiele, [spiel]: { ...(t.spiele[spiel] || {}), an } };
    speichereProfil(name, { timer: t });
  }

  /** Reihenfolge-Werte für die Einstellung „Teile einer Aufgabe“. */
  const REIHENFOLGEN = {
    stufe: "nach Stufe (1–3 geordnet, 4–6 gemischt)",
    geordnet: "immer geordnet (gross links → klein rechts)",
    gemischt: "immer gemischt",
  };

  /**
   * Stehen die Teile einer Aufgabe (Bausteine, Rätselteile) geordnet von der grössten Stelle links
   * zur kleinsten rechts? „stufe“ heisst: 1–3 geordnet.
   */
  function geordnet(name, spiel, stufe) {
    const wert = reihenfolgeFuer(name, spiel);
    return wert === "stufe" ? ["s1", "s2", "s3"].includes(stufe) : wert === "geordnet";
  }

  /** Gültige Reihenfolge eines Spiels: Einstellung je Spiel schlägt die globale (auch „stufe“). */
  function reihenfolgeFuer(name, spiel) {
    const r = profil(name).reihenfolge || LEERES_PROFIL.reihenfolge;
    return r.spiele?.[spiel] || r.global || "stufe";
  }

  // Spieloptionen (Entscheid UE1 a, LERN_Session6): Ein Spiel beschreibt sie in def.optionen =
  // { <id>: { titel, werte: { stufe: "nach Stufe", …: Text }, erklaerung: { <wert>: Text }, nachStufe(stufe) → Wert } };
  // gespeichert wird je Spieler und Spiel im Profil (optionen: { <spiel>: { <id>: Wert } }), fehlt = "stufe".
  const optionFuer = (name, spiel, id) => profil(name).optionen?.[spiel]?.[id] || "stufe";
  function setzeOption(name, spiel, id, wert) {
    const o = { ...(profil(name).optionen || {}) };
    o[spiel] = { ...(o[spiel] || {}), [id]: wert };
    speichereProfil(name, { optionen: o });
  }
  /** Gültiger Wert einer Spieloption für eine Stufe: „stufe“ wird über nachStufe aufgelöst. */
  function optionWert(name, def, id, stufe) {
    const w = optionFuer(name, def.id, id);
    return w === "stufe" ? def.optionen[id].nachStufe(stufe) : w;
  }

  /** Reihenfolge eines Spiels für einen Spieler setzen (wie die Wahl je Spiel im Profil). */
  function setzeReihenfolgeSpiel(name, spiel, wert) {
    const r = { ...LEERES_PROFIL.reihenfolge, ...(profil(name).reihenfolge || {}) };
    r.spiele = { ...r.spiele, [spiel]: wert };
    speichereProfil(name, { reihenfolge: r });
  }

  /** Profile; frühere Testspieler (test: true, LERN_Session3) werden zur Aufsicht. */
  const profile = () => {
    const alle = lies("profile", {});
    for (const p of Object.values(alle)) if (p.test && !p.rolle) { p.rolle = "aufsicht"; delete p.test; }
    return alle;
  };
  const spielerListe = () => Object.keys(profile());
  function profil(name) { return { ...LEERES_PROFIL, ...(profile()[name] || {}) }; }
  const istAufsicht = name => !!name && profile()[name]?.rolle === "aufsicht";
  const kinderListe = () => spielerListe().filter(n => !istAufsicht(n));
  const aufsichtListe = () => spielerListe().filter(istAufsicht);
  /** Name mit 🔑 davor, wenn es eine Aufsicht ist — nur zur Anzeige. */
  const spielerName = name => (istAufsicht(name) ? `🔑 ${name}` : name);

  // Anmeldung (Entscheid L1 a): Kinder ohne PIN. Die Aufsicht gilt nur in diesem Browser-Tab
  // (sessionStorage) — schliesst man ihn, ist sie abgemeldet und kein Kind erbt ihre Rechte.
  function sitzung() { try { return sessionStorage.getItem("lernspiele:aufsicht"); } catch { return null; } }
  function setzeSitzung(name) { try { name ? sessionStorage.setItem("lernspiele:aufsicht", name) : sessionStorage.removeItem("lernspiele:aufsicht"); } catch { /* egal */ } }
  const aktuellerSpieler = () => {
    const n = lies("spieler", null);
    if (!spielerListe().includes(n)) return null;
    return istAufsicht(n) && sitzung() !== n ? null : n;
  };
  /** Ist gerade eine Aufsicht angemeldet? */
  const aufsichtAngemeldet = () => istAufsicht(aktuellerSpieler());
  /** Kind anmelden; eine Aufsicht nur über meldeAufsichtAn mit PIN. */
  function setzeSpieler(name) {
    if (istAufsicht(name)) return false;
    schreibe("spieler", name);
    setzeSitzung(null);
    return true;
  }
  function abmelden() { schreibe("spieler", null); setzeSitzung(null); }

  async function pinHash(pin, salz) {
    const daten = new TextEncoder().encode(`${salz}:${pin}`);
    return [...new Uint8Array(await crypto.subtle.digest("SHA-256", daten))].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  const pinGueltig = pin => /^\d{4,6}$/.test(pin);
  /** PIN einer Aufsicht setzen (4–6 Ziffern); gespeichert wird nur Salz und Hash. */
  async function setzePin(name, pin) {
    if (!pinGueltig(pin)) return false;
    const salz = [...crypto.getRandomValues(new Uint8Array(8))].map(b => b.toString(16).padStart(2, "0")).join("");
    speichereProfil(name, { rolle: "aufsicht", pin: { salz, hash: await pinHash(pin, salz) } });
    return true;
  }
  /** Aufsicht mit PIN anmelden; true bei Erfolg. Ohne gesetzte PIN geht es nicht. */
  async function meldeAufsichtAn(name, pin) {
    const p = profil(name);
    if (p.rolle !== "aufsicht" || !p.pin || (await pinHash(pin, p.pin.salz)) !== p.pin.hash) return false;
    schreibe("spieler", name);
    setzeSitzung(name);
    return true;
  }

  /**
   * Profilfelder ändern. Jedes geänderte Feld bekommt einen Zeitstempel (geaendert: { feld: ISO }), ein
   * neues Profil dazu „angelegt“: Beim Abgleich zwischen Geräten gewinnt je Feld der jüngere Stand.
   */
  function speichereProfil(name, daten) {
    const alle = profile();
    const jetzt = new Date().toISOString();
    const geaendert = { ...(alle[name]?.geaendert || {}), ...(alle[name] ? {} : { angelegt: jetzt }) };
    for (const k of Object.keys(daten)) geaendert[k] = jetzt;
    alle[name] = { ...profil(name), ...daten, geaendert };
    schreibe("profile", alle);
  }

  /** Neues Kind anlegen (ohne es anzumelden); gibt den Namen zurück oder null. */
  function neuerSpieler(name, daten = {}) {
    name = name.trim().slice(0, 20);
    if (!name || spielerListe().includes(name)) return null;
    speichereProfil(name, daten);
    return name;
  }

  // ---------- Freigabe (Entscheid L4 a) ----------
  // Prüfstand im Repo, Freigabe auf dem Gerät. Standardmässig frei ist alles, was nichts mehr zu
  // prüfen hat (Präzisierung Patrik 2026-10-31): Ein Spiel mit `neu` im Katalog ist gesperrt, bis es
  // angesehen ist; eine Inhaltsliste (`listen: { <liste>: { name } }`) ist gesperrt, bis sie geprüft
  // ist. Der Prüfstand steht in pruefstand.js (PRUEFSTAND, je { am, von }; Entscheid E1 a), getrennt
  // vom Katalog, damit der Entwickler-Server ihn schreiben kann. Die Aufsicht kann auf dem Gerät
  // anders entscheiden: lernspiele:freigabe = { spiele: { <id>: bool }, listen: { "<id>/<liste>": bool } };
  // fehlt ein Eintrag, entscheidet der Prüfstand.
  const freigabe = () => ({ spiele: {}, listen: {}, ...lies("freigabe", {}) });
  function katalogEintrag(spielId) { return typeof SPIELE !== "undefined" ? SPIELE.find(s => s.id === spielId) : null; }
  function setzeFreigabe(art, schluessel, wert) {
    const f = freigabe();
    if (wert === null) delete f[art][schluessel]; else f[art][schluessel] = wert;
    // Stand vor der Freigabe schreiben: Der Abgleich nimmt die Freigabe des Geräts mit dem jüngsten Stand.
    schreibe("freigabeStand", new Date().toISOString());
    schreibe("freigabe", f);
  }
  // Nutzt ein Spiel die Liste eines anderen (dieselben Wörter, dieselben Sätze), steht im Katalog
  // nur ein Verweis { von: "<spiel>/<liste>" }: Prüfstand und Freigabe gelten dann einmal, an der Quelle.
  /** Schlüssel "<spiel>/<liste>" der Quelle einer Liste (folgt dem Verweis von). */
  function listenQuelle(spielId, listeId) {
    const von = katalogEintrag(spielId)?.listen?.[listeId]?.von;
    return von || `${spielId}/${listeId}`;
  }
  /** Katalog-Eintrag der Quelle: { name, zusatz }. */
  function quellEintrag(schluessel) {
    const [spiel, liste] = schluessel.split("/");
    return katalogEintrag(spiel)?.listen?.[liste] || null;
  }
  /** Prüfstand aus pruefstand.js: { am, von } oder null; art "spiele" oder "listen". */
  const pruefstand = (art, schluessel) => (typeof PRUEFSTAND !== "undefined" ? PRUEFSTAND[art]?.[schluessel] : null) || null;
  /** Inhaltslisten eines Spiels aus dem Katalog: [{ id, quelle, name, geprueft, von }] — Name und Prüfstand von der Quelle. */
  const spielListen = spielId => Object.entries(katalogEintrag(spielId)?.listen || {}).map(([id, l]) => {
    const quelle = l.von || `${spielId}/${id}`;
    const q = l.von ? quellEintrag(l.von) : l;
    return { id, quelle, name: q?.name ?? l.name, geprueft: pruefstand("listen", quelle), von: l.von || null, zusatz: !!q?.zusatz };
  });
  /** Liste für Kinder frei? null als wert in setzeListeFrei = zurück auf den Prüfstand. */
  function listeFrei(spielId, listeId) {
    const schluessel = listenQuelle(spielId, listeId);
    return freigabe().listen[schluessel] ?? !!pruefstand("listen", schluessel);
  }
  const setzeListeFrei = (spielId, listeId, wert) => setzeFreigabe("listen", listenQuelle(spielId, listeId), wert);
  /** Listen, die der angemeldete Spieler üben darf (die Aufsicht alle) — Spiele filtern ihre Inhalte danach. */
  const freieListen = spielId => spielListen(spielId).filter(l => aufsichtAngemeldet() || listeFrei(spielId, l.id)).map(l => l.id);
  /** Muss das Spiel als Ganzes noch angesehen werden (neu und nicht geprüft)? */
  const spielZuPruefen = spielId => !!katalogEintrag(spielId)?.neu && !pruefstand("spiele", spielId);
  /** Wann und von wem das Spiel angesehen wurde ({ am, von }) oder null. */
  const spielGeprueft = spielId => pruefstand("spiele", spielId);
  /** Spiel als Ganzes für Kinder frei (ohne Blick auf die Listen)? */
  function spielFrei(spielId) {
    const f = freigabe().spiele[spielId];
    return f ?? !spielZuPruefen(spielId);
  }
  const setzeSpielFrei = (spielId, wert) => setzeFreigabe("spiele", spielId, wert);
  /**
   * Darf der angemeldete Spieler das Spiel sehen? Kinder: frei und mindestens eine Liste frei — eine
   * Zusatzliste (zusatz: true, z. B. fehlerfreie Sätze der Königsstufe) ergibt allein keine Aufgabe und zählt nicht.
   */
  const fuerKinderSichtbar = spielId => spielFrei(spielId) && (!spielListen(spielId).length
    || spielListen(spielId).some(l => !l.zusatz && listeFrei(spielId, l.id)));
  const spielSichtbar = spielId => aufsichtAngemeldet() || fuerKinderSichtbar(spielId);
  // ---------- Suche (Entscheid SU1 a, LERN_Session6) ----------
  // Kleine Volltextsuche mit Rangfolge: je Suchwort der beste Treffer über alle Felder, gewichtet nach Feld
  // und Art des Treffers; jedes Suchwort muss passen. Passt ein Spiel nur über ein Feld, das auf der Karte
  // nicht steht (Thema, Inhaltsliste), nennt `grund` es.
  const SUCH_GEWICHT = { name: 6, lernziele: 4, beschreibung: 3, listen: 2, thema: 1 };
  const SUCH_SICHTBAR = new Set(["name", "lernziele", "beschreibung"]);
  const falte = t => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const suchWoerter = t => String(t || "").toLowerCase().split(/[^\p{L}\p{N}.]+/u)
    .map(w => w.replace(/^\.+|\.+$/g, "")).filter(Boolean);
  /** Höchstens ein Zeichen Unterschied (einfügen, löschen, ersetzen)? */
  function einTippfehler(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, fehler = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++fehler > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return fehler + (a.length - i) + (b.length - j) <= 1;
  }
  /** Wie gut passt das Suchwort q zum Wort w (0 bis 1)? Tippfehler nur im Namen, nie bei Kürzeln mit Ziffern. */
  function wortWert(q, w, feld) {
    if (w === q) return 1;
    if (w.startsWith(q)) return 0.8;
    const fq = falte(q), fw = falte(w);
    if (fw === fq) return 0.7;
    if (fw.startsWith(fq)) return 0.6;
    if (q.length >= 4 && w.includes(q)) return 0.4;     // Teil eines zusammengesetzten Worts (Wortschatz)
    if (q.length >= 4 && fw.includes(fq)) return 0.3;
    if (feld === "name" && q.length >= 5 && !/\d/.test(q)
      && (einTippfehler(fq, fw.slice(0, fq.length)) || einTippfehler(fq, fw.slice(0, fq.length + 1)))) return 0.25;
    return 0;
  }
  /** Durchsuchbare Felder eines Spiels: je Feld eine Liste von Texten (Listen und Lernziele einzeln). */
  function suchFelder(e) {
    const thema = typeof THEMEN !== "undefined" ? THEMEN.find(t => t.id === e.thema) : null;
    return { name: [e.name], lernziele: e.lernziele.map(l => l.lz), beschreibung: [e.beschreibung],
      listen: spielListen(e.id).map(l => l.name), thema: thema ? [`${thema.name}: ${thema.titel}`] : [] };
  }
  /**
   * Spiele zur Suche, beste zuerst: [{ id, wert, grund }]; grund z. B. „im Thema Wortschatz: …“ oder null,
   * wenn alle Suchwörter auf der Karte stehen. Leere Suche: null.
   */
  function suche(text) {
    const qs = suchWoerter(text);
    if (!qs.length || typeof SPIELE === "undefined") return null;
    const treffer = [];
    SPIELE.forEach((e, rang) => {
      const felder = suchFelder(e);
      let wert = 0;
      const gruende = [];
      for (const q of qs) {
        let best = 0, wo = null;
        for (const [feld, texte] of Object.entries(felder)) for (const t of texte) for (const w of suchWoerter(t)) {
          const x = wortWert(q, w, feld) * SUCH_GEWICHT[feld];
          if (x > best) { best = x; wo = { feld, t }; }
        }
        if (!best) return;
        wert += best;
        if (!SUCH_SICHTBAR.has(wo.feld)) gruende.push(wo.feld === "thema" ? `im Thema ${wo.t}` : `in der Liste „${wo.t}“`);
      }
      treffer.push({ id: e.id, wert, rang, grund: gruende.length ? [...new Set(gruende)].join("; ") : null });
    });
    return treffer.sort((a, b) => b.wert - a.wert || a.rang - b.rang).map(({ rang, ...t }) => t);
  }
  /** Warum sehen Kinder das Spiel nicht? Kurzer Text oder null, wenn sie es sehen. */
  function sperrGrund(spielId) {
    if (fuerKinderSichtbar(spielId)) return null;
    if (freigabe().spiele[spielId] === false) return "auf diesem Gerät gesperrt";
    if (!spielFrei(spielId)) return "noch nicht angesehen";
    const listen = spielListen(spielId).filter(l => !l.zusatz);
    if (listen.some(l => freigabe().listen[l.quelle] === false)) return "Inhaltslisten gesperrt";
    return listen.length === 1 ? "Inhaltsliste noch nicht geprüft" : `keine der ${listen.length} Inhaltslisten geprüft`;
  }

  // Löschvermerke, damit der Abgleich Gelöschtes nicht von einem anderen Gerät zurückholt:
  // lernspiele:geloescht = { spieler: { <name>: ISO }, runden: [{ name, spiel (null = alle), bis: ISO }] }.
  // Ein Vermerk entfernt alles, was bis zu seinem Zeitpunkt entstand; Späteres (neu angelegt, neu gespielt) bleibt.
  const geloescht = () => ({ spieler: {}, runden: [], ...lies("geloescht", {}) });
  const rundeGeloescht = (e, g) => (g.spieler[e.name] && e.zeit <= g.spieler[e.name])
    || g.runden.some(r => r.name === e.name && (!r.spiel || r.spiel === e.spiel) && e.zeit <= r.bis);
  /** Jüngster Zeitstempel eines Profils (leer bei Profilen von vor LERN_Session6). */
  const profilStand = p => Object.values(p?.geaendert || {}).reduce((a, b) => (b > a ? b : a), "");

  function loescheSpieler(name) {
    const g = geloescht();
    g.spieler[name] = new Date().toISOString();
    schreibe("geloescht", g);
    const alle = profile();
    delete alle[name];
    schreibe("profile", alle);
    schreibe("protokoll", protokoll().filter(e => e.name !== name));
    schreibe("rekorde", rekorde().filter(e => e.name !== name));
    if (lies("spieler", null) === name) schreibe("spieler", null);
  }

  /** Spielstand zurücksetzen: die Runden eines Kindes löschen — alle oder nur die eines Spiels.
      Profil, Klasse, Fokus und Timer bleiben. */
  function loescheRunden(name, spielId = null) {
    const g = geloescht();
    g.runden.push({ name, spiel: spielId, bis: new Date().toISOString() });
    schreibe("geloescht", g);
    const bleibt = e => e.name !== name || (spielId && e.spiel !== spielId);
    schreibe("protokoll", protokoll().filter(bleibt));
    schreibe("rekorde", rekorde().filter(bleibt));
  }

  /**
   * Daten eines anderen Geräts dazunehmen (Sichern/Einlesen und Abgleich-Ordner, Entscheid S1 a):
   * - Runden und Rekorde: gleiche Runde (Kind, Zeit, Spiel, Stufe) zählt einmal. Bei Rekorden gilt der
   *   höhere Stand — ein Zwischenstand mitten in der Serie wird so vom Endstand ersetzt.
   * - Profile: unbekannte kommen dazu; bei bekannten gewinnt je Feld der jüngere Zeitstempel. Ohne
   *   Zeitstempel (ältere Dateien) bleibt das Profil auf diesem Gerät, wie es ist. Die PIN reist nie mit.
   * - Löschvermerke beider Seiten gelten zusammen; die Freigabe kommt vom Gerät mit dem jüngsten Stand.
   * Gibt zurück, wie viel neu kam: { runden, kinder, rekorde, profile, freigabe }.
   */
  function zusammenfuehren(daten) {
    const schluessel = e => `${e.name}|${e.zeit}|${e.spiel}|${e.stufe}`;
    const fremd = daten.geloescht || {};
    const g = geloescht();
    for (const [n, t] of Object.entries(fremd.spieler || {})) if (!(g.spieler[n] >= t)) g.spieler[n] = t;
    const vermerk = r => `${r.name}|${r.spiel}|${r.bis}`;
    const bekannteVermerke = new Set(g.runden.map(vermerk));
    g.runden.push(...(fremd.runden || []).filter(r => r && r.name && r.bis && !bekannteVermerke.has(vermerk(r))));
    schreibe("geloescht", g);
    const lebt = e => e && e.name && e.zeit && !rundeGeloescht(e, g);

    const runden = protokoll();
    const bekannt = new Set(runden.map(schluessel));
    const neu = (daten.protokoll || []).filter(e => lebt(e) && !bekannt.has(schluessel(e)));
    schreibe("protokoll", [...runden, ...neu].filter(lebt).sort((a, b) => (a.zeit < b.zeit ? -1 : a.zeit > b.zeit ? 1 : 0)));

    const rek = new Map(rekorde().filter(lebt).map(e => [schluessel(e), e]));
    let neueRekorde = 0;
    for (const e of (daten.rekorde || []).filter(lebt)) {
      const da = rek.get(schluessel(e));
      if (!da || (e.punkte || 0) > (da.punkte || 0)) { rek.set(schluessel(e), e); neueRekorde++; }
    }
    schreibe("rekorde", [...rek.values()]);

    const alle = profile();
    const neueKinder = [];
    let geaenderteProfile = 0;
    for (const [n, fp] of Object.entries(daten.profile || {})) {
      if (!fp) continue;
      const { pin, ...rein } = fp;
      if (g.spieler[n] && profilStand(rein) <= g.spieler[n]) continue;
      if (!(n in alle)) { alle[n] = { ...LEERES_PROFIL, ...rein }; neueKinder.push(n); continue; }
      const da = alle[n];
      const zeit = { ...(da.geaendert || {}) };
      let anders = false;
      for (const [k, t] of Object.entries(rein.geaendert || {})) {
        if (!(t > (zeit[k] || ""))) continue;
        if (k in rein) da[k] = rein[k];
        zeit[k] = t;
        anders = true;
      }
      if (anders) { da.geaendert = zeit; geaenderteProfile++; }
    }
    // Gelöschte Kinder auch hier entfernen, ausser sie wurden danach neu angelegt oder geändert.
    for (const [n, t] of Object.entries(g.spieler)) if (n in alle && profilStand(alle[n]) <= t) delete alle[n];
    // Kinder, die nur in Runden vorkommen, bekommen ein leeres Profil
    for (const e of neu) if (!(e.name in alle)) { alle[e.name] = { ...LEERES_PROFIL }; neueKinder.push(e.name); }
    schreibe("profile", alle);

    let neueFreigabe = false;
    if (daten.freigabe && daten.freigabeStand && daten.freigabeStand > lies("freigabeStand", "")) {
      schreibe("freigabeStand", daten.freigabeStand);
      schreibe("freigabe", daten.freigabe);
      neueFreigabe = true;
    }
    return { runden: neu.length, kinder: neueKinder.length, rekorde: neueRekorde, profile: geaenderteProfile, freigabe: neueFreigabe };
  }

  /** Alles, was ein Gerät für den Abgleich weitergibt: wie Sichern, aber vollständig und ohne PIN. */
  function abgleichDaten() {
    const ohnePin = Object.fromEntries(Object.entries(profile()).map(([n, { pin, ...rest }]) => [n, rest]));
    return { version: 2, gesichert: new Date().toISOString(), profile: ohnePin, protokoll: protokoll(), rekorde: rekorde(),
      geloescht: geloescht(), freigabe: lies("freigabe", null), freigabeStand: lies("freigabeStand", null) };
  }

  /** Basisklasse eines Spiels aus dem Katalog (null, wenn die Seite den Katalog nicht geladen hat). */
  function basisKlasse(spielId) {
    const eintrag = typeof SPIELE !== "undefined" ? SPIELE.find(s => s.id === spielId) : null;
    return eintrag?.klasse ?? null;
  }

  /**
   * Empfohlene Stufe aus der Klasse des Kindes und der Basisklasse des Spiels: gleiche Klasse →
   * Stufe 3, eine Klasse tiefer oder mehr → Stufe 1, eine höher → Stufe 5, zwei und mehr höher →
   * Königsstufe. Ohne Spiel (Filter auf der Startseite) gilt Stufe 3 = die eigene Klasse.
   */
  function empfohleneStufe(name, spielId) {
    const k = Number(profil(name).klasse);
    if (!k) return null;
    const b = spielId ? basisKlasse(spielId) : k;
    if (!b) return null;
    const d = k - b;
    return d < 0 ? "s1" : d === 0 ? "s3" : d === 1 ? "s5" : "s6";
  }

  const protokoll = () => lies("protokoll", []);
  function protokolliere(eintrag) { schreibe("protokoll", [...protokoll(), eintrag]); }

  // ---------- Endlos-Rekorde (Vorgabe Patrik 2026-10-31) ----------
  // lernspiele:rekorde = [{ name, zeit, spiel, stufe, timer (Startzeit in Sekunden oder null), punkte,
  //   dauer, alles?, test?, hilfe? }] — eine Zeile je Endlos-Runde, getrennt vom Protokoll der Runden.
  // Zwei Ranglisten je Stufe: ohne und mit Timer. Mit Timer starten alle mit der Vorgabezeit der Stufe
  // (Katalog, ohne persönlichen Faktor), und die Zeit wird je gelöste Aufgabe etwas kürzer
  // (ENDLOS_TEMPO) — so ist der Vergleich gerecht. Das Format ist
  // so gewählt, dass es später auch an einen Server gehen könnte (Rangliste nach Alter, Klasse, Region
  // — noch Idee); heute bleibt alles im Browser.
  const rekorde = () => lies("rekorde", []);
  /** Rekord anhängen; ersetzt: ein früher gespeicherter Zwischenstand derselben Runde, der wegfällt. */
  function speichereRekord(eintrag, ersetzt = null) {
    schreibe("rekorde", [...rekorde().filter(e => e !== ersetzt && !(ersetzt && e.name === ersetzt.name && e.zeit === ersetzt.zeit
      && e.spiel === ersetzt.spiel && e.stufe === ersetzt.stufe)), eintrag]);
  }
  /** Stufen, die den Endlos-Modus anbieten (Katalog: endlos). */
  const endlosStufen = spielId => katalogEintrag(spielId)?.endlos || [];
  const gleicherModus = (e, spiel, stufe, mitTimer) => e.spiel === spiel && e.stufe === stufe && !!e.timer === !!mitTimer;
  /**
   * Endlos mit Timer (Entscheide Patrik F1 a, F2 a, 2026-10-31): Die Zeit nähert sich einem Boden, der aus
   * den Handgriffen der Aufgabe folgt (ctx.schritte): grundzeit + schritte × jeSchritt, dazu die Zeit, in der
   * das Kind nur warten kann (ctx.wartezeit, z. B. eine vorgespielte Melodie). Je gelöste Aufgabe
   * fällt 8 % der restlichen Spanne weg — anfangs grosse Schritte, dann immer kleinere, ohne abrupten Halt.
   * Grundzeit und Schrittzeit sind Annahmen, bis gemessene Zeiten von Kindern vorliegen. Ohne Angabe der
   * Handgriffe (darf nicht vorkommen, das Testskript prüft es) gilt als Boden ersatzweise 40 % der Startzeit.
   */
  /**
   * Serienbremse (Vorgabe Patrik 2026-11-01): Ein zufällig gewähltes Merkmal (ctx.serie) kommt höchstens
   * SERIE_MAX-mal hintereinander; der Rahmen zieht dafür bis zu SERIE_VERSUCHE-mal neu.
   */
  const SERIE_MAX = 3;
  const SERIE_VERSUCHE = 40;

  const ENDLOS_TEMPO = { annaeherung: 0.92, grundzeit: 1.2, jeSchritt: 0.5, ersatzBoden: 0.4 };
  const endlosBoden = (start, schritte, warten) => Math.min(start,
    schritte > 0 ? ENDLOS_TEMPO.grundzeit + warten + schritte * ENDLOS_TEMPO.jeSchritt : start * ENDLOS_TEMPO.ersatzBoden);
  /** Sekunden für die nächste Endlos-Aufgabe, auf eine Zehntelsekunde gerundet. */
  function endlosSekunden(start, geschafft, schritte, warten = 0) {
    const boden = endlosBoden(start, schritte, warten);
    return Math.round((boden + (start - boden) * ENDLOS_TEMPO.annaeherung ** geschafft) * 10) / 10;
  }
  /** Anzeige der Zeit: unter 10 s mit einer Nachkommastelle (Komma), sonst ganze Sekunden. */
  const sekundenText = s => (s < 10 ? s.toFixed(1).replace(".", ",") : String(Math.round(s))) + " s";
  function besterRekord(name, spiel, stufe, timer) {
    return rekorde().filter(e => e.name === name && gleicherModus(e, spiel, stufe, timer)).reduce((m, e) => Math.max(m, e.punkte), 0);
  }
  /** Rangliste: bester Wert je Spieler, ohne Testrunden und ohne Aufsicht, absteigend. */
  function ranglisteFuer(spiel, stufe, timer) {
    const beste = new Map();
    for (const e of rekorde()) {
      if (e.test || istAufsicht(e.name) || !gleicherModus(e, spiel, stufe, timer)) continue;
      if (!beste.has(e.name) || e.punkte > beste.get(e.name).punkte) beste.set(e.name, e);
    }
    return [...beste.values()].sort((a, b) => b.punkte - a.punkte || (a.zeit < b.zeit ? -1 : 1));
  }

  /** Rangliste als kleine Tabelle: bester Wert je Spieler (ohne Testrunden), der eigene hervorgehoben. */
  function rangliste(spiel, stufeId, mitTimer, ich, hoechstens = 10) {
    const liste = ranglisteFuer(spiel, stufeId, mitTimer);
    if (!liste.length) return el("div");
    return el("div", { class: "rangliste" },
      el("b", { text: mitTimer ? "⏱ mit Timer" : "ohne Timer" }),
      el("ol", {}, ...liste.slice(0, hoechstens).map(r => el("li", { class: r.name === ich ? "ich" : "" },
        el("span", { text: r.name }), el("b", { text: String(r.punkte) })))));
  }

  function besteSterne(name, spiel, stufe) {
    return protokoll()
      .filter(e => e.name === name && e.spiel === spiel && e.stufe === stufe)
      .reduce((m, e) => Math.max(m, e.sterne), 0);
  }

  // ---------- Sprachausgabe (Entscheid G2 a) ----------
  // Offline nur über die Stimmen des Geräts (speechSynthesis); welche es gibt, hängt vom Gerät ab.

  // Bevorzugte Varianten: britisches Englisch wie im Schweizer Lehrmittel, Schweizer bzw. deutsches Deutsch.
  const BEVORZUGT = { en: ["en-gb", "en"], de: ["de-ch", "de-de", "de"] };
  /** Stimme für eine Sprache ("en", "de", …) oder null; zuerst die bevorzugte Variante. */
  function stimme(sprache) {
    try {
      const stimmen = speechSynthesis.getVoices();
      for (const lang of BEVORZUGT[sprache] || [sprache]) {
        const v = stimmen.find(s => (s.lang || "").toLowerCase().replace("_", "-").startsWith(lang));
        if (v) return v;
      }
      return null;
    } catch { return null; }
  }
  /** Gibt es eine Stimme für die Sprache? Wartet kurz, weil manche Browser die Stimmen erst nachladen. */
  function stimmeBereit(sprache) {
    if (stimme(sprache)) return Promise.resolve(true);
    return new Promise(fertig => {
      let erledigt = false;
      const ende = () => { if (!erledigt) { erledigt = true; fertig(!!stimme(sprache)); } };
      try { speechSynthesis.addEventListener("voiceschanged", ende, { once: true }); } catch { /* ohne Ereignis */ }
      setTimeout(ende, 1500);
    });
  }
  /** Text vorlesen (ruhiges Tempo); false, wenn es keine Stimme gibt. */
  function sprich(text, sprache = "en") {
    const v = stimme(sprache);
    if (!v) return false;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.voice = v;
      u.lang = v.lang;
      u.rate = 0.85;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
      return true;
    } catch { return false; }
  }
  /**
   * Spiel starten, das eine Stimme braucht: sofort, wenn sie schon da ist (so auch im Testskript),
   * sonst nach stimmeBereit. Ohne Stimme erklärt die Eule es und bietet keine Runde an.
   */
  function spielMitStimme(def, sprache = "en") {
    const ohne = () => spiel({ ...def, stufen: {},
      einleitung: "Oh! Dieses Gerät hat keine passende Stimme, darum kannst du hier nichts hören. Bitte einen Erwachsenen, eine Stimme einzuschalten, oder spiel ein anderes Spiel." });
    if (stimme(sprache)) spiel(def);
    else stimmeBereit(sprache).then(ok => (ok ? spiel(def) : ohne()));
  }

  // ---------- Töne ----------

  let audio = null;
  let tonAn = lies("ton", true);

  function ton(art) {
    if (!tonAn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const folgen = {
        tipp:    [[660, 0.05]],
        richtig: [[523, 0.10], [659, 0.10], [784, 0.16]],
        falsch:  [[330, 0.12], [262, 0.18]],
        huepf:   [[440, 0.06], [880, 0.08]],
        fertig:  [[523, 0.12], [659, 0.12], [784, 0.12], [1047, 0.3]],
      }[art] || [];
      let t = audio.currentTime;
      for (const [freq, dauer] of folgen) {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dauer);
        osc.connect(gain).connect(audio.destination);
        osc.start(t);
        osc.stop(t + dauer);
        t += dauer * 0.9;
      }
    } catch { /* ohne Ton weiter */ }
  }

  /** Knopf „Ton an/aus“ in der Kopfzeile; beimWechsel(an) erfährt jede Änderung (der Mix gibt sie an seine Spiele weiter). */
  function tonSchalter(knopf, beimWechsel = null) {
    if (!knopf) return;
    const setze = () => { knopf.textContent = tonAn ? "🔊" : "🔇"; };
    knopf.addEventListener("click", () => { tonAn = !tonAn; schreibe("ton", tonAn); setze(); ton("tipp"); beimWechsel?.(tonAn); });
    setze();
  }
  /** Ton an oder aus, ohne zu speichern (im Mix: Meldung der Mix-Seite). */
  const setzeTon = an => { tonAn = !!an; };

  // ---------- Eule ----------

  const EULE_SVG = `
<svg class="eule" viewBox="0 0 84 92" aria-hidden="true">
  <ellipse cx="42" cy="88" rx="26" ry="4" fill="rgba(0,0,0,.08)"/>
  <path d="M14 30 L10 10 L28 22 Z M70 30 L74 10 L56 22 Z" fill="#8a5a3c"/>
  <ellipse cx="42" cy="52" rx="32" ry="36" fill="#a8714d"/>
  <ellipse cx="42" cy="62" rx="20" ry="22" fill="#f3d9b8"/>
  <path d="M30 58 q4 4 8 0 M38 66 q4 4 8 0 M46 58 q4 4 8 0" stroke="#d9b48c" stroke-width="2" fill="none"/>
  <circle cx="29" cy="36" r="13" fill="#fff"/>
  <circle cx="55" cy="36" r="13" fill="#fff"/>
  <circle cx="31" cy="37" r="6" fill="#2d3047"/>
  <circle cx="53" cy="37" r="6" fill="#2d3047"/>
  <circle cx="33" cy="35" r="2" fill="#fff"/>
  <circle cx="55" cy="35" r="2" fill="#fff"/>
  <path d="M38 46 L46 46 L42 53 Z" fill="#ffb02e"/>
  <path d="M16 78 q-4 6 2 8 M68 78 q4 6 -2 8" stroke="#ffb02e" stroke-width="4" fill="none" stroke-linecap="round"/>
  <rect x="20" y="6" width="44" height="6" rx="2" fill="#2d3047"/>
  <rect x="34" y="0" width="16" height="8" rx="2" fill="#2d3047"/>
</svg>`;

  function euleZeile() {
    const zeile = el("div", { class: "eule-zeile" });
    zeile.innerHTML = EULE_SVG;
    const blase = el("div", { class: "blase", "aria-live": "polite" });
    zeile.append(blase);
    const eule = zeile.querySelector(".eule");
    return {
      element: zeile,
      sag(text, art = "") {
        blase.className = "blase" + (art ? " " + art : "");
        blase.textContent = text;
        eule.classList.remove("huepft");
        void eule.offsetWidth; // Animation neu starten
        eule.classList.add("huepft");
      },
    };
  }

  // ---------- Konfetti ----------

  function konfetti(anzahl = 60) {
    const farben = ["#8e5bd6", "#e0569a", "#f07c2a", "#e9b300", "#2fb36b", "#2f8fe0", "#e5484d"];
    for (let i = 0; i < anzahl; i++) {
      const k = el("div", { class: "konfetti" });
      k.style.left = Math.random() * 100 + "vw";
      k.style.background = waehle(farben);
      k.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
      k.style.animationDelay = Math.random() * 0.5 + "s";
      document.body.append(k);
      setTimeout(() => k.remove(), 4500);
    }
  }

  // ---------- Bildschirmtastatur ----------

  let aktiveTastatur = null;

  document.addEventListener("keydown", (e) => {
    if (!aktiveTastatur || !document.body.contains(aktiveTastatur.element)) return;
    if (/^[0-9]$/.test(e.key)) aktiveTastatur.tippe(e.key);
    else if (e.key === "Backspace") aktiveTastatur.loesche();
    else if (e.key === "Enter") aktiveTastatur.ok();
    else return;
    e.preventDefault();
  });

  /**
   * Zifferntastatur, die in ein Anzeigefeld schreibt.
   * opt.anzeige: Element, in dem die Zahl formatiert erscheint
   * opt.maxStellen: höchstens so viele Ziffern
   * opt.onOk(wert): beim Drücken von OK (wert als Zahl)
   */
  function tastatur(opt) {
    let ziffern = "";
    const max = opt.maxStellen || 7;
    const t = el("div", { class: "tastatur" });
    let okKnopf;

    function zeige() {
      opt.anzeige.classList.remove("richtig", "falsch");
      opt.anzeige.classList.toggle("leer", ziffern === "");
      opt.anzeige.textContent = ziffern === "" ? "" : zahlText(Number(ziffern));
      okKnopf.disabled = ziffern === "";
      if (opt.onAenderung) opt.onAenderung(ziffern === "" ? null : Number(ziffern));
    }

    const api = {
      element: t,
      tippe(z) {
        if (api.gesperrt || ziffern.length >= max) return;
        if (ziffern === "0") ziffern = "";
        ziffern += z;
        ton("tipp");
        zeige();
      },
      loesche() {
        if (api.gesperrt) return;
        ziffern = ziffern.slice(0, -1);
        zeige();
      },
      ok() {
        if (api.gesperrt || ziffern === "") return;
        opt.onOk(Number(ziffern));
      },
      leeren() { ziffern = ""; zeige(); },
      gesperrt: false,
    };

    for (const z of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]) {
      t.append(el("button", { type: "button", text: z, onclick: () => api.tippe(z) }));
    }
    t.append(el("button", { type: "button", class: "loeschen", text: "⌫", "aria-label": "Löschen", onclick: () => api.loesche() }));
    t.append(el("button", { type: "button", class: "loeschen", text: "✕", "aria-label": "Alles löschen", onclick: () => api.leeren() }));
    okKnopf = el("button", { type: "button", class: "ok", text: "OK ✓", onclick: () => api.ok() });
    t.append(okKnopf);

    aktiveTastatur = api;
    zeige();
    return api;
  }

  /** Handgriffe, um wert auf der Zifferntastatur einzutippen: je Ziffer ein Tipp, dazu OK (für ctx.schritte). */
  const tippSchritte = wert => String(Math.abs(wert)).length + 1;

  // ---------- Flug in einen Korb ----------

  /**
   * Eine Kopie von 'quelle' fliegt auf geradem, also meist schrägem Weg in die Mitte von 'ziel'
   * (den gewählten Korb). verstecken: die Quelle selbst dabei ausblenden (eine Karte, nicht ein
   * markiertes Wort im Satz).
   */
  function fliegen(quelle, ziel, verstecken = true) {
    const von = quelle.getBoundingClientRect();
    const nach = ziel.getBoundingClientRect();
    const stil = getComputedStyle(quelle);
    const flug = quelle.cloneNode(true);
    flug.classList.add("flug");
    Object.assign(flug.style, {
      left: `${von.left}px`, top: `${von.top}px`, width: `${von.width}px`, height: `${von.height}px`,
      fontSize: stil.fontSize, fontWeight: stil.fontWeight,
    });
    document.body.append(flug);
    if (verstecken) quelle.style.visibility = "hidden";
    const dx = nach.left + nach.width / 2 - (von.left + von.width / 2);
    const dy = nach.top + nach.height / 2 - (von.top + von.height / 2);
    void flug.offsetWidth; // Startpunkt festhalten, damit der Übergang greift
    flug.style.transform = `translate(${dx}px, ${dy}px) scale(.3)`;
    flug.style.opacity = "0";
    setTimeout(() => flug.remove(), 800);
  }

  // ---------- Auswahlknöpfe und Reihenfolge (für Spiele mit Antwort per Antippen) ----------

  /** Knopfinhalt: Text, Element oder { bild, text, klein }. */
  function wahlInhalt(knopf, inhalt) {
    if (inhalt instanceof Node || typeof inhalt !== "object") { knopf.append(inhalt); return; }
    if (inhalt.bild) knopf.append(el("span", { class: "bild", text: inhalt.bild }));
    if (inhalt.text) knopf.append(el("span", { text: inhalt.text }));
    if (inhalt.klein) knopf.append(el("small", { text: inhalt.klein }));
  }

  const wackeln = k => { k.classList.remove("falsch"); void k.offsetWidth; k.classList.add("falsch"); };

  /**
   * Auswahlknöpfe mit genau einer richtigen Antwort; hängt sie an ctx.flaeche an.
   * opt.optionen: Werte; opt.richtig: richtiger Wert (Vergleich mit ===)
   * opt.inhalt(wert): Knopfinhalt (Text, Element oder { bild, text, klein }), Vorgabe der Wert selbst
   * opt.hinweis(wert): Hinweis nach falscher Wahl (Text oder Funktion des gewählten Werts)
   * opt.loesung: Lösungstext nach dem dritten Fehlversuch
   * opt.lob: Text bei richtiger Antwort; opt.breite: Mindestbreite der Knöpfe (px)
   * opt.beiRichtig(knopf): zusätzlich bei richtiger Antwort, z. B. einen Ton vorspielen
   */
  /** Lösung für die Testhilfe: opt.loesung, sonst der richtige Wert, wenn er ein einfacher Wert ist. */
  const loesungFuer = (opt, wert) => opt.loesung || (["string", "number"].includes(typeof wert) ? String(wert) : null);

  function auswahl(ctx, opt) {
    ctx.loesung(loesungFuer(opt, opt.richtig));
    ctx.schritte(1);
    const box = el("div", { class: "wahl" });
    if (opt.breite) box.style.setProperty("--wahl-breite", opt.breite + "px");
    let fertig = false;
    for (const wert of opt.optionen) {
      const k = el("button", { type: "button", class: "wahl-knopf" });
      wahlInhalt(k, opt.inhalt ? opt.inhalt(wert) : String(wert));
      k.addEventListener("click", () => {
        if (fertig || k.classList.contains("gewaehlt")) return;
        if (wert === opt.richtig) {
          fertig = true;
          k.classList.add("richtig");
          if (opt.beiRichtig) opt.beiRichtig(k);
          ctx.richtig(opt.lob);
          return;
        }
        wackeln(k);
        k.classList.add("gewaehlt");
        ctx.falsch(typeof opt.hinweis === "function" ? opt.hinweis(wert) : opt.hinweis, opt.loesung);
        if (ctx.vorbei()) fertig = true;
      });
      box.append(k);
    }
    ctx.flaeche.append(box);
    return box;
  }

  /**
   * Teile der Reihe nach antippen; jedes richtig getippte Teil wandert in die Ablage.
   * opt.reihe: Werte in richtiger Reihenfolge (gezeigt werden sie gemischt)
   * opt.inhalt(wert), opt.hinweis(wert, erwartet), opt.loesung, opt.lob wie bei auswahl
   * opt.ablage(wert): Text des Teils in der Ablage, Vorgabe der Wert selbst
   * opt.pfeile: zwischen den gelegten Teilen „→“ zeigen; opt.beiRichtig() wie bei auswahl
   */
  function reihenfolge(ctx, opt) {
    ctx.loesung(opt.loesung || opt.reihe.map(w => (opt.ablage ? opt.ablage(w) : String(w))).join(" → "));
    ctx.schritte(opt.reihe.length);
    const ablage = el("div", { class: "ablage", "aria-live": "polite" });
    const box = el("div", { class: "wahl" });
    if (opt.breite) box.style.setProperty("--wahl-breite", opt.breite + "px");
    let pos = 0;
    let fertig = false;
    for (const wert of mische(opt.reihe)) {
      const k = el("button", { type: "button", class: "wahl-knopf" });
      wahlInhalt(k, opt.inhalt ? opt.inhalt(wert) : String(wert));
      k.addEventListener("click", () => {
        if (fertig || k.classList.contains("gewaehlt")) return;
        // Gleiche Werte dürfen mehrfach vorkommen: zählt, ob der Wert an der Reihe ist.
        if (wert === opt.reihe[pos]) {
          pos++;
          k.classList.add("gewaehlt");
          ton("tipp");
          if (opt.pfeile && pos > 1) ablage.append(el("span", { class: "pfeil", text: "→" }));
          ablage.append(el("span", { text: opt.ablage ? opt.ablage(wert) : String(wert) }));
          if (pos === opt.reihe.length) { fertig = true; if (opt.beiRichtig) opt.beiRichtig(); ctx.richtig(opt.lob); }
          return;
        }
        wackeln(k);
        ctx.falsch(typeof opt.hinweis === "function" ? opt.hinweis(wert, opt.reihe[pos]) : opt.hinweis, opt.loesung);
        if (ctx.vorbei()) fertig = true;
      });
      box.append(k);
    }
    ctx.flaeche.append(ablage, box);
    return { ablage, box };
  }

  const KORB_FARBEN = ["var(--deko-6)", "var(--deko-3)", "var(--deko-5)", "var(--deko-2)", "var(--deko-1)", "var(--deko-4)"];

  /**
   * Karte und Körbe: Die Karte (Bild und Name) gehört in genau einen Korb; bei richtiger Wahl
   * fliegt sie hinein. Hängt Karte und Körbe an ctx.flaeche an.
   * opt.karte: { bild, text } der Karte
   * opt.koerbe: Werte der Körbe; opt.korbInhalt(wert): { bild, text, klein }; opt.farbe(wert, i): CSS-Farbe
   * opt.richtig, opt.hinweis(wert), opt.loesung, opt.lob wie bei auswahl
   */
  function koerbe(ctx, opt) {
    ctx.loesung(opt.loesung || opt.korbInhalt?.(opt.richtig)?.text || loesungFuer(opt, opt.richtig));
    ctx.schritte(1);
    const karte = el("div", { class: "korb-karte" },
      opt.karte.bild ? el("span", { class: "bild", text: opt.karte.bild }) : null, el("b", { text: opt.karte.text }));
    const box = el("div", { class: "korb-reihe" });
    let fertig = false;
    opt.koerbe.forEach((wert, i) => {
      const k = el("button", { type: "button", class: "korb-knopf" });
      wahlInhalt(k, opt.korbInhalt ? opt.korbInhalt(wert) : String(wert));
      k.style.setProperty("--k", opt.farbe ? opt.farbe(wert, i) : KORB_FARBEN[i % KORB_FARBEN.length]);
      k.addEventListener("click", () => {
        if (fertig) return;
        if (wert === opt.richtig) {
          fertig = true;
          fliegen(karte, k);
          ctx.richtig(opt.lob);
          return;
        }
        wackeln(k);
        ctx.falsch(typeof opt.hinweis === "function" ? opt.hinweis(wert) : opt.hinweis, opt.loesung);
        if (ctx.vorbei()) fertig = true;
      });
      box.append(k);
    });
    ctx.flaeche.append(karte, box);
    return { karte, box };
  }

  // ---------- Rahmen eines Spiels ----------

  /** Schwierigkeitsskala, bezogen auf die Basisklasse des Spiels (Katalog, Feld 'klasse'):
      Stufe 3 ist das Lernziel der Basisklasse, 2 leichter und 4 schwerer in derselben Klasse,
      1 eine Klasse tiefer, 5 eine Klasse höher. Die Königsstufe ist der Endgegner: besonders
      herausfordernd, über alles hinweg. (Entscheid Patrik 2026-10-31) */
  const SKALA = [
    { id: "s1", nr: 1, icon: "🌱", name: "Einstieg",       rel: -1,  farbe: "var(--deko-5)" },
    { id: "s2", nr: 2, icon: "🌿", name: "Üben",           rel: 0,   zusatz: "leichter", farbe: "var(--deko-6)" },
    { id: "s3", nr: 3, icon: "🌳", name: "Klassenziel",    rel: 0,   farbe: "var(--deko-4)" },
    { id: "s4", nr: 4, icon: "⭐", name: "Knifflig",       rel: 0,   zusatz: "schwerer", farbe: "var(--deko-3)" },
    { id: "s5", nr: 5, icon: "🚀", name: "Nächste Klasse", rel: 1,   farbe: "var(--deko-1)" },
    { id: "s6", nr: 6, icon: "👑", name: "Königsstufe",    rel: null, farbe: "var(--deko-2)" },
  ];

  const klasseText = k => (k <= 0 ? "Kindergarten" : `${k}. Klasse`);

  // Was gerade gespielt wird ({ spiel, stufe?, nr?, aufgabe?() }), für die Bemerkungen im Entwickler-Modus.
  let spielStand = null;

  /** Für wen ist die Stufe? „2. Klasse, leichter“ — aus der Basisklasse des Spiels. */
  function stufeFuer(spielId, stufeId) {
    const st = SKALA.find(s => s.id === stufeId);
    if (!st) return "";
    if (st.rel === null) return "Endgegner";
    const b = basisKlasse(spielId);
    if (!b) return st.name;
    return klasseText(b + st.rel) + (st.zusatz ? `, ${st.zusatz}` : "");
  }

  const LOB = ["Super!", "Genau richtig!", "Toll gemacht!", "Prima!", "Stark!", "Richtig! 🎉", "Bravo!"];

  function sterneFuer(fehler) {
    if (fehler <= 1) return 3;
    if (fehler <= 4) return 2;
    return 1;
  }

  function sterneText(n) {
    return "★".repeat(n) + "☆".repeat(3 - n);
  }

  /**
   * Startet ein Spiel.
   * def.id, def.titel, def.einleitung
   * def.stufen: { s1: "Beschreibung", …, s6: "…" } — welche Stufen der SKALA das Spiel anbietet
   * def.anzahl: Aufgaben je Runde
   * def.aufgabe(ctx): zeichnet Aufgabe ctx.nr in ctx.flaeche. Ruft ctx.richtig() oder
   *   ctx.falsch(hinweis, loesungText) auf. ctx.sag(text) lässt die Eule sprechen.
   */
  function spiel(def) {
    const buehne = document.querySelector(".buehne");
    const stufenListe = SKALA.filter(s => def.stufen[s.id]).map(s => ({ ...s, text: def.stufen[s.id] }));
    spielStand = { spiel: def.id };
    tonSchalter(document.querySelector(".kopf .ton"));
    // Kam beim Abgleich etwas von einem anderen Gerät dazu: die Stufenwahl mit Sternen und Ranglisten neu zeichnen.
    addEventListener("lernspiele:abgeglichen", () => { if (buehne.querySelector(".stufen")) stufenwahl(); });

    // Angemeldet wird nur auf der Startseite (Entscheid L1 a); dorthin führt auch „wechseln“.
    const START = "../../index.html";

    /** Darf es losgehen? Sonst eine Karte: erst anmelden, oder das Spiel ist noch nicht freigegeben. */
    function zugang() {
      if (aktuellerSpieler() && spielSichtbar(def.id)) return true;
      buehne.innerHTML = "";
      const karte = el("div", { class: "karte mitte" });
      const eule = euleZeile();
      karte.append(eule.element, el("div", { class: "knopfzeile" },
        el("a", { class: "knopf", href: aktuellerSpieler() ? START : `${START}#anmelden`, text: "Zur Startseite" })));
      buehne.append(karte);
      eule.sag(aktuellerSpieler() ? "Dieses Spiel ist noch nicht freigegeben. Such dir auf der Startseite ein anderes aus!"
        : "Hallo! Melde dich zuerst auf der Startseite an.");
      return false;
    }

    function spielerZeile() {
      const name = aktuellerSpieler();
      return el("div", { class: "spieler-zeile" },
        el("span", { text: "Du spielst als " }),
        el("b", { text: spielerName(name) }),
        el("a", { class: "link", href: `${START}#anmelden`, text: "wechseln" }));
    }

    /** Schalter „Mit Timer“ für dieses Spiel; die Sekunden je Stufe stellt man im Profil ein. */
    function timerZeile(neuZeichnen) {
      const name = aktuellerSpieler();
      const an = stufenListe.some(st => timerFuer(name, def.id, st.id).an);
      return el("div", { class: "timer-zeile" },
        el("button", {
          type: "button", class: "timer-schalter" + (an ? " an" : ""), "aria-pressed": String(an),
          onclick: () => { setzeTimerSpiel(name, def.id, !an); ton("tipp"); neuZeichnen(); },
        }, an ? "⏱ Timer an" : "⏱ Timer aus"),
        el("span", { class: "leise", text: an ? "Jede Aufgabe hat eine Zeit. Ist sie um, zählt es als Fehler." : "Für mehr Spannung: Timer einschalten." }));
    }

    /**
     * Schalter „Teile: nach Stufe / geordnet / gemischt“ für Spiele mit `reihenfolge: true` im Katalog
     * (Entscheid R1 a, LERN_Session6); schreibt dieselbe Wahl je Spiel wie das Profil.
     */
    function reihenfolgeZeile(neuZeichnen) {
      if (typeof SPIELE === "undefined" || !SPIELE.find(s => s.id === def.id)?.reihenfolge) return null;
      const name = aktuellerSpieler();
      return optionsZeile({
        titel: "🔀 Teile:", wert: reihenfolgeFuer(name, def.id),
        werte: { stufe: "nach Stufe", geordnet: "geordnet", gemischt: "gemischt" },
        erklaerung: {
          stufe: "Stufe 1–3 geordnet, ab Stufe 4 gemischt.",
          geordnet: "Grösste Stelle links, kleinste rechts.",
          gemischt: "Die Teile stehen durcheinander. Das ist kniffliger.",
        },
      }, k => setzeReihenfolgeSpiel(name, def.id, k), neuZeichnen);
    }

    /** Eine Zeile mit Knöpfen je Wert, der gewählte gefüllt, darunter leise, was er heisst. */
    function optionsZeile(o, setze, neuZeichnen) {
      return el("div", { class: "option-zeile" },
        el("b", { text: o.titel }),
        ...Object.entries(o.werte).map(([k, text]) => el("button", {
          type: "button", class: "option-schalter" + (k === o.wert ? " an" : ""), "aria-pressed": String(k === o.wert),
          onclick: () => { setze(k); ton("tipp"); neuZeichnen(); },
        }, text)),
        el("span", { class: "leise", text: o.erklaerung[o.wert] }));
    }

    /** Spieloptionen aus def.optionen (z. B. Übertrag selbst schreiben), je eine Zeile auf der Stufenwahl. */
    function spielOptionsZeilen(neuZeichnen) {
      const name = aktuellerSpieler();
      return Object.entries(def.optionen || {}).map(([id, o]) => optionsZeile({ ...o, wert: optionFuer(name, def.id, id) },
        k => setzeOption(name, def.id, id, k), neuZeichnen));
    }

    function stufenwahl() {
      if (!zugang()) return;
      buehne.innerHTML = "";
      const name = aktuellerSpieler();
      const karte = el("div", { class: "karte" });
      const eule = euleZeile();
      karte.append(spielerZeile(), eule.element, timerZeile(stufenwahl), reihenfolgeZeile(stufenwahl) || "", ...spielOptionsZeilen(stufenwahl));
      eule.sag(def.einleitung);
      const stufen = el("div", { class: "stufen" });
      for (const st of stufenListe) {
        const beste = besteSterne(name, def.id, st.id);
        const timer = timerFuer(name, def.id, st.id);
        const knopf = el("button", { class: "stufe", type: "button", onclick: () => runde(st) },
          el("b", { text: `${st.icon} Stufe ${st.nr} · ${st.name}` }),
          el("div", { class: "fuer", text: stufeFuer(def.id, st.id) + (st.id === empfohleneStufe(name, def.id) ? " · 👍 für dich empfohlen" : "") }),
          el("span", { text: st.text }),
          timer.an ? el("div", { class: "fuer", style: "margin-top:6px", text: `⏱ ${timer.sekunden} s je Aufgabe` }) : null,
          el("div", { class: "sterne-klein", html: beste ? `<span style="color:#f5b301">${"★".repeat(beste)}</span><span class="aus">${"★".repeat(3 - beste)}</span>` : '<span class="leise" style="font-size:16px">noch nicht gespielt</span>' }));
        knopf.style.setProperty("--farbe", st.farbe);
        stufen.append(knopf);
      }
      karte.append(stufen);
      // Endlos: so viele wie möglich bis zum ersten Fehler — nur Stufen mit genug verschiedenen Aufgaben (Katalog).
      const endlosListe = stufenListe.filter(st => endlosStufen(def.id).includes(st.id));
      if (endlosListe.length) {
        const mitTimer = st => timerFuer(name, def.id, st.id).an;
        karte.append(el("div", { class: "endlos-wahl" },
          el("b", { text: "♾ Endlos — wie viele schaffst du ohne Fehler?" }),
          el("span", { class: "leise", text: "Mit Timer wird die Zeit nach jeder richtigen Aufgabe etwas knapper." }),
          el("div", { class: "endlos-knoepfe" }, ...endlosListe.map(st => {
            const rekord = besterRekord(name, def.id, st.id, mitTimer(st));
            const k = el("button", { class: "knopf hell klein", type: "button", onclick: () => runde(st, true) },
              `${st.icon} ${st.nr}`, el("small", { text: rekord ? ` · Rekord ${rekord}` : "" }));
            return k;
          })),
          // Vollständige Ranglisten je Endlos-Stufe, ohne und mit Timer (Wunsch Patrik 2026-10-31).
          ...endlosListe.filter(st => ranglisteFuer(def.id, st.id, false).length || ranglisteFuer(def.id, st.id, true).length)
            .map(st => el("div", { class: "ranglisten" }, el("b", { text: `${st.icon} Stufe ${st.nr}` }),
              rangliste(def.id, st.id, false, name, Infinity), rangliste(def.id, st.id, true, name, Infinity)))));
      }
      buehne.append(karte);
    }

    /** Text der Aufgabe, wie das Kind sie sieht — fürs Protokoll. */
    function aufgabenText(flaeche) {
      return [...flaeche.querySelectorAll(".auftrag, .vorgabe, .raetsel, .bausteine, .zahl-gross, .zahl-ziffern, .rechnung, .satz, .wortkarte, .lueckenwort, .frage, .ziel-zahl, .auf, .sachtext, .theke, .familie, .digital")]
        .map(e => e.innerText.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join(" · ")
        .slice(0, 240);
    }

    /**
     * Eine Runde. endlos (Vorgabe Patrik 2026-10-31): Aufgaben, bis die erste falsch ist oder die Zeit
     * um ist; gezählt werden die richtigen. Rekord je Spieler, Spiel, Stufe und mit/ohne Timer.
     * mix (Entscheid M1 a, LERN_Session5): Das Spiel läuft im iframe des Zufallsmix (mix.html) und stellt
     * eine Aufgabe nur, wenn der Mix sie verlangt; das Ergebnis meldet es zurück. Serie, Ende, Protokoll
     * und Rekord führt der Mix. mix = { timer: true/false }.
     */
    function runde(stufe, endlos = false, mix = null) {
      if (!zugang()) return;
      const name = aktuellerSpieler();
      const timer = mix ? { ...timerFuer(name, def.id, stufe.id), an: mix.timer } : timerFuer(name, def.id, stufe.id);
      let nr = 0;
      let geschafft = 0; // Endlos: richtig gelöste Aufgaben
      const startSekunden = endlos ? vorgabeZeit(def.id, stufe.id) : timer.sekunden; // Endlos: für alle gleich
      // Mix: Die Aufgabe darf erst gezeichnet werden, wenn der Mix sie verlangt (freigabe). Im Endlos-Mix
      // zählt für die knapper werdende Zeit die Serie über alle Spiele (mixGeschafft).
      let mixFreigabe = false;
      let mixGeschafft = 0;
      let mixGemeldet = 0;      // Aufgaben, deren Ergebnis schon an den Mix ging
      let mixBereit = false;
      let mixVorher = null;     // Stand von fehler, hilfen und fehlerAufgaben vor der Aufgabe
      const anMix = daten => parent.postMessage({ lern: "mix", spiel: def.id, ...daten }, "*");
      let fehler = 0;
      const beginn = Date.now();
      const fehlerAufgaben = [];
      const aufgabenZeiten = []; // je Aufgabe: { ms, versuche, zeitUm, geloest }
      let uhr = null;            // laufender Timer der aktuellen Aufgabe
      // Wiederholungen (Vorgabe Patrik 2026-10-31): In einer Runde kommt höchstens eine Aufgabe ein
      // zweites Mal, nie direkt hintereinander. Gibt die Stufe nicht genug verschiedene Aufgaben her,
      // endet die Runde früher (anzahl wird kleiner). Endlos: keine der letzten 30 Aufgaben nochmal;
      // findet sich keine neue mehr, ist alles geschafft.
      let anzahl = endlos || mix ? Infinity : def.anzahl;
      const gestellt = new Map(); // Kennung → wie oft gestellt
      let wiederholt = false;
      let letzte = null;
      const zuletzt = []; // Endlos: die letzten Kennungen
      let allesGeschafft = false;
      const serienVerlauf = {}; // je Merkmal (ctx.serie) die Werte der gestellten Aufgaben dieser Runde
      const mitTimer = timer.an ? startSekunden : null; // Endlos: Startzeit des Rekords oder null
      let rekordVorher = null; // Endlos: bisheriger Rekord, sobald diese Runde gespeichert ist
      let zwischenstand = null; // Endlos: beim Verlassen gespeicherter Eintrag, den das Ende ersetzt
      let rundeGespeichert = false;
      buehne.innerHTML = "";

      const punkte = el("div", { class: "fortschritt" + (endlos ? " endlos" : "") });
      if (endlos) punkte.textContent = "♾ 0";
      else for (let i = 0; i < def.anzahl; i++) punkte.append(el("span"));
      const karte = el("div", { class: "karte" });
      const flaeche = el("div");
      const eule = euleZeile();
      const zeitleiste = el("div", { class: "zeitleiste", "aria-hidden": "true" }, el("div", { class: "zeitbalken" }));
      // Testhilfen (Entscheid T2 a): nur beim Testspieler; wirken auf die gerade gezeigte Aufgabe.
      const test = istAufsicht(name);
      let hilfen = 0;
      let jetzt = null; // { loesung(): Text oder null, ueberspringen() } der aktuellen Aufgabe
      const loesungKnopf = el("button", { type: "button", class: "knopf hell klein", text: "🔑 Lösung zeigen", onclick: () => {
        const text = jetzt?.loesung();
        hilfen++;
        eule.sag(text ? `🔑 ${text}` : "🔑 Dieses Spiel nennt seine Lösung erst nach drei Fehlversuchen.", "hinweis");
      } });
      const weiterKnopf = el("button", { type: "button", class: "knopf hell klein", text: "⏭ Aufgabe überspringen", onclick: () => { hilfen++; jetzt?.ueberspringen(); } });
      // Eule oben, damit ihre Rückmeldung auch auf kleinen Bildschirmen neben der Aufgabe sichtbar bleibt.
      karte.append(eule.element);
      if (test) karte.append(el("div", { class: "testhilfe" }, el("span", { text: "🧪 Test" }), loesungKnopf, weiterKnopf));
      if (timer.an) karte.append(zeitleiste);
      karte.append(flaeche);
      buehne.append(punkte, karte);

      /** Mix: Ergebnis der letzten Aufgabe melden — oder, vor der ersten, dass das Spiel bereit ist. */
      function meldeMix() {
        const zeit = aufgabenZeiten[mixGemeldet];
        if (!zeit) {
          if (!mixBereit) { mixBereit = true; anMix({ typ: "bereit" }); }
          return;
        }
        mixGemeldet++;
        anMix({ typ: "ergebnis", zeit, fehler: fehler - mixVorher.fehler, hilfen: hilfen - mixVorher.hilfen,
          fehlerAufgabe: fehlerAufgaben[mixVorher.fehlerAufgaben] || null });
      }

      function naechste() {
        clearTimeout(uhr);
        if (mix && !mixFreigabe) return meldeMix();
        mixFreigabe = false;
        mixVorher = { fehler, hilfen, fehlerAufgaben: fehlerAufgaben.length };
        if (nr >= anzahl) return endlos ? schlussEndlos() : schluss();
        if (endlos) punkte.textContent = `♾ ${geschafft}`;
        else [...punkte.children].forEach((p, i) => {
          p.classList.toggle("fertig", i < nr);
          p.classList.toggle("aktiv", i === nr);
        });
        flaeche.innerHTML = "";
        let versuche = 0;
        let erledigt = false;
        let zeitUm = false;
        let eintrag = null; // Protokolleintrag, sobald die Aufgabe einen Fehler hatte
        let loesungVorab = null; // vom Spiel mit ctx.loesung() genannt, für die Testhilfe
        let eigeneKennung = null; // vom Spiel mit ctx.kennung() genannt, gegen Wiederholungen
        let schritte = 0; // Handgriffe der Aufgabe (ctx.schritte), für den Boden der Endlos-Zeit
        let warten = 0;   // Sekunden, in denen das Kind nur warten kann (ctx.wartezeit)
        let serien = {};  // Merkmale dieser Aufgabe (ctx.serie): Name → Wert
        const start = performance.now();
        pruefung.haken?.("aufgabe", { nr });

        const fehlerEintrag = (loesungText) => {
          if (!eintrag) {
            eintrag = { text: aufgabenText(flaeche), loesung: loesungText || "", versuche: 0, geloest: false, zeitUm: false };
            fehlerAufgaben.push(eintrag);
          }
          if (loesungText && !eintrag.loesung) eintrag.loesung = loesungText;
          return eintrag;
        };

        const abschliessen = (geloest, uebersprungen = false) => {
          clearTimeout(uhr);
          // Balken dort anhalten, wo er gerade steht.
          const balken = zeitleiste.firstChild;
          balken.style.width = getComputedStyle(balken).width;
          balken.style.transition = "none";
          aufgabenZeiten.push({ ms: Math.round(performance.now() - start), versuche, zeitUm, geloest, ...(uebersprungen ? { uebersprungen } : {}) });
        };

        jetzt = {
          loesung: () => loesungVorab,
          ueberspringen() {
            // Gelöst oder aufgelöst: es geht ohnehin gleich bzw. mit „Weiter“ weiter.
            if (erledigt) return;
            erledigt = true;
            abschliessen(false, true);
            nr++;
            naechste();
          },
        };

        // Timer erst, wenn die Aufgabe gezeichnet ist: im Endlos-Modus hängt die Zeit an ihren Handgriffen.
        // Gleiche Startzeit für alle, je gelöste Aufgabe knapper (ENDLOS_TEMPO).
        function starteUhr() {
          if (!timer.an) return;
          const sekunden = endlos ? endlosSekunden(startSekunden, mix ? mixGeschafft : geschafft, schritte, warten) : timer.sekunden;
          // Balken läuft per CSS-Übergang von voll auf leer; der Fehler zählt einmal, die Aufgabe bleibt offen.
          const balken = zeitleiste.firstChild;
          zeitleiste.classList.remove("um");
          balken.style.transition = "none";
          balken.style.width = "100%";
          void balken.offsetWidth;
          balken.style.transition = `width ${sekunden}s linear`;
          balken.style.width = "0%";
          uhr = setTimeout(() => {
            if (erledigt) return;
            zeitUm = true;
            fehler++;
            fehlerEintrag("").zeitUm = true;
            zeitleiste.classList.add("um");
            ton("falsch");
            if (endlos) return endlosVorbei("⏰ Die Zeit ist um!");
            eule.sag("⏰ Die Zeit ist um! Mach die Aufgabe trotzdem fertig.", "hinweis");
          }, sekunden * 1000);
          if (endlos) punkte.textContent = `♾ ${geschafft} · ⏱ ${sekundenText(sekunden)}`;
        }

        /** Endlos: erste falsche Antwort oder Zeit um — Lösung zeigen, dann zum Ergebnis. */
        function endlosVorbei(text) {
          erledigt = true;
          abschliessen(false);
          if (!mix) speichereEndlos(); // zählt sofort, auch wenn das Kind „Zum Ergebnis“ nicht mehr antippt
          const loesung = loesungVorab;
          eule.sag(`${text}${loesung ? ` Schau mal: ${loesung}` : ""}`, "hinweis");
          // Im Mix führt „Weiter“ zurück zum Mix; er zeigt das Ergebnis der ganzen Serie.
          const weiter = el("button", { class: "knopf", type: "button", text: mix ? "Weiter ➜" : "Zum Ergebnis ➜", onclick: mix ? naechste : schlussEndlos });
          flaeche.append(el("div", { class: "knopfzeile" }, weiter));
          weiter.focus();
        }

        spielStand = { spiel: def.id, stufe: stufe.id, nr, aufgabe: () => aufgabenText(flaeche) };
        const ctx = {
          stufe: stufe.id,
          geordnet: geordnet(name, def.id, stufe.id),
          /** Wert einer Spieloption aus def.optionen für diese Stufe („nach Stufe“ schon aufgelöst). */
          option: id => optionWert(name, def, id, stufe.id),
          nr,
          flaeche,
          sag: (t, art) => eule.sag(t, art),
          /** Lösung der Aufgabe gleich beim Zeichnen nennen (Text wie loesungText); zeigt sie nur die Testhilfe. */
          loesung(text) { loesungVorab = text || null; },
          /**
           * Woran diese Aufgabe zu erkennen ist, wenn man es nicht sieht (Hör-Aufgaben: die Melodie).
           * Ohne Angabe nimmt der Rahmen Text und Bilder der Fläche; dient der Regel gegen Wiederholungen.
           */
          kennung(wert) { eigeneKennung = wert == null ? null : String(wert); },
          /**
           * Ein zufällig gewähltes Merkmal der Aufgabe, das das Kind als Muster erkennen kann: Richtung,
           * Aufgabenart, Antwort bei wenigen festen Antworten (ja/nein, <, =, >). Der Rahmen zieht neu,
           * statt dasselbe Merkmal öfter als SERIE_MAX-mal hintereinander zu stellen. Nur angeben, wo die
           * Stufe wirklich mehrere Werte hat.
           */
          serie(name, wert) { serien[name] = String(wert); },
          /**
           * Diese Aufgabe braucht n Handgriffe mehr (Tipps, Ziffern samt OK, Züge) — wie viele mindestens,
           * wer sie fehlerfrei löst. Die Bausteine zählen ihre selbst; Pflicht in Endlos-Stufen.
           */
          schritte(n) { schritte += n; },
          /** Die Aufgabe hält das Kind s Sekunden auf, ohne dass es etwas tun kann (vorgespielte Töne). */
          wartezeit(s) { warten += s; },
          /** Ist die Aufgabe gelöst oder nach drei Fehlversuchen aufgelöst? Dann nimmt sie keine Antwort mehr an. */
          vorbei: () => erledigt,
          richtig(text) {
            if (erledigt) return;
            erledigt = true;
            if (eintrag) eintrag.geloest = true;
            pruefung.haken?.("richtig", { nr, vorab: loesungVorab });
            abschliessen(true);
            ton("richtig");
            eule.sag(text || waehle(LOB), "gut");
            nr++;
            if (endlos) { geschafft++; punkte.textContent = `♾ ${geschafft}`; }
            setTimeout(naechste, endlos ? 900 : 1300);
          },
          falsch(hinweis, loesungText) {
            if (erledigt) return;
            versuche++;
            fehler++;
            fehlerEintrag(loesungText).versuche = versuche;
            ton("falsch");
            const aufgeloest = endlos || (versuche >= 3 && !!loesungText);
            pruefung.haken?.("falsch", { nr, hinweis: hinweis || "", loesung: loesungText || "", aufgeloest, flaeche, vorab: loesungVorab });
            if (endlos) {
              if (loesungText && !loesungVorab) loesungVorab = loesungText;
              return endlosVorbei("Schade, das war nicht richtig.");
            }
            if (aufgeloest) {
              erledigt = true;
              abschliessen(false);
              eule.sag(`Schau mal: ${loesungText}`, "hinweis");
              const weiter = el("button", { class: "knopf", type: "button", text: "Weiter ➜", onclick: () => { nr++; naechste(); } });
              flaeche.append(el("div", { class: "knopfzeile" }, weiter));
              weiter.focus();
            } else {
              eule.sag(hinweis || "Fast! Versuch es nochmal.", "hinweis");
            }
          },
        };
        // Aufgabe zeichnen; ist sie in dieser Runde nicht mehr erlaubt, neu ziehen (die Spiele ziehen
        // in aufgabe() zufällig). Findet sich nach vielen Versuchen keine erlaubte, ist die Stufe erschöpft.
        // Serienbremse (Vorgabe Patrik 2026-11-01): Merkmale aus ctx.serie höchstens SERIE_MAX-mal
        // hintereinander. Findet sich nach SERIE_VERSUCHE Zügen keine passende Aufgabe, gilt die Aufgabe
        // trotzdem (die Stufe hat dann wohl nur diesen Wert) — das Testskript meldet es.
        const serieZuLang = () => Object.entries(serien).some(([name, wert]) => {
          const bisher = serienVerlauf[name] || [];
          return bisher.length >= SERIE_MAX && bisher.slice(-SERIE_MAX).every(w => w === wert);
        });
        for (let versuch = 0; ; versuch++) {
          def.aufgabe(ctx);
          const k = kennung(flaeche, loesungVorab, eigeneKennung);
          const n = k ? gestellt.get(k) || 0 : 0;
          const zuLang = serieZuLang();
          if ((endlos ? !k || !zuletzt.includes(k) : n === 0 || (n === 1 && !wiederholt && k !== letzte))
            && (!zuLang || versuch >= SERIE_VERSUCHE)) {
            if (endlos && k) { zuletzt.push(k); if (zuletzt.length > 30) zuletzt.shift(); }
            if (n) wiederholt = true;
            if (k) gestellt.set(k, n + 1);
            letzte = k;
            for (const [name, wert] of Object.entries(serien)) (serienVerlauf[name] ||= []).push(wert);
            pruefung.haken?.("gestellt", { nr, kennung: k, schritte, serien, serieErzwungen: zuLang && versuch >= SERIE_VERSUCHE });
            break;
          }
          if (versuch >= 60) {
            clearTimeout(uhr);
            // Mix: Das Spiel hat keine neue Aufgabe mehr; der Mix nimmt dann die anderen.
            if (mix) { flaeche.innerHTML = ""; return anMix({ typ: "erschoepft" }); }
            anzahl = nr;
            if (endlos) { allesGeschafft = true; return schlussEndlos(); }
            return schluss();
          }
          flaeche.innerHTML = "";
          loesungVorab = null;
          eigeneKennung = null;
          schritte = 0;
          warten = 0;
          serien = {};
        }
        starteUhr();
      }

      /**
       * Woran man eine Aufgabe wiedererkennt: der Text, den das Kind sieht, ohne die Antwortknöpfe
       * (deren Reihenfolge ist gemischt), dazu die Lösung. Leer, wenn es nichts zu vergleichen gibt.
       */
      function kennung(wurzel, loesung, eigeneKennung) {
        if (eigeneKennung != null) return `eigen|${eigeneKennung}|${loesung || ""}`;
        const teile = [];
        // Gezeichnete Bilder (Noten, Formen, Uhr) zählen mit ihren Formen und Lagen, ohne Stil-Angaben.
        const ZEICHNUNG = /^(circle|ellipse|line|path|polygon|polyline|rect|text|use)$/;
        const sammle = (k, imBild) => {
          if (k.nodeType === 3) { teile.push(k.data); return; }
          if (k.nodeType !== 1 || k.localName === "button" || k.localName === "input" || k.localName === "a") return;
          const bild = imBild || k.localName === "svg";
          if (bild && ZEICHNUNG.test(k.localName)) {
            teile.push(k.localName + ["cx", "cy", "r", "x", "y", "x1", "y1", "x2", "y2", "d", "points", "width", "height", "href"].map(a => k.getAttribute?.(a) ?? "").join(","));
          }
          for (const c of k.childNodes) sammle(c, bild);
        };
        sammle(wurzel, false);
        const text = teile.join(" ").replace(/\s+/g, " ").trim();
        return text || loesung ? `${text}|${loesung || ""}` : null;
      }

      function schluss() {
        const sterne = sterneFuer(fehler);
        protokolliere({
          name,
          zeit: new Date().toISOString(),
          spiel: def.id,
          stufe: stufe.id,
          sterne,
          fehler,
          aufgaben: anzahl,
          ...(anzahl < def.anzahl ? { gekuerzt: def.anzahl } : {}), // geplant waren mehr, die Stufe gab nicht genug her
          dauer: Math.round((Date.now() - beginn) / 1000),
          geordnet: geordnet(name, def.id, stufe.id),
          ...(def.optionen ? { optionen: Object.fromEntries(Object.keys(def.optionen).map(id => [id, optionWert(name, def, id, stufe.id)])) } : {}),
          timer: timer.an ? timer.sekunden : null,
          aufgabenZeiten,
          fehlerAufgaben,
          // Testrunden zählen nicht in der Statistik (Entscheid T1 a); hilfe = Testhilfen benutzt.
          ...(test ? { test: true } : {}),
          ...(hilfen ? { hilfe: hilfen } : {}),
        });
        ton("fertig");
        konfetti();
        buehne.innerHTML = "";
        const karte = el("div", { class: "karte schluss mitte" });
        const st = el("div", { class: "sterne" });
        for (let i = 0; i < 3; i++) st.append(el("span", { class: i < sterne ? "" : "aus", style: i < sterne ? "color:#f5b301" : "", text: "★" }));
        const eule = euleZeile();
        karte.append(
          el("div", { class: "auftrag", text: `Geschafft, ${name}!` }),
          st,
          eule.element,
          el("div", { class: "knopfzeile" },
            el("button", { class: "knopf gruen", type: "button", text: "Nochmal spielen", onclick: () => runde(stufe) }),
            el("button", { class: "knopf hell", type: "button", text: "Andere Stufe", onclick: stufenwahl })));
        buehne.append(karte);
        // Text nach der Fehlerzahl dieser Runde — 3 Sterne gibt es auch mit einem Fehler.
        eule.sag(fehler === 0 ? "Perfekt! Alles auf Anhieb richtig! 🏆"
          : fehler === 1 ? "Wow, fast alles auf Anhieb richtig!"
          : sterne === 2 ? "Gut gemacht! Mit etwas Übung schaffst du drei Sterne."
          : "Du hast durchgehalten! Spiel nochmal, dann wird es leichter.", "gut");
      }

      /**
       * Endlos: Rekord speichern, sobald die Runde vorbei ist (Fehler, Zeit um, alles geschafft) — nicht erst
       * beim Ergebnisbild. Endgültig nur einmal je Runde; gibt den bisherigen Rekord zurück.
       * abgebrochen (Entscheid Patrik E1 a): Das Kind verlässt die Seite mitten in der Serie, sie zählt bis
       * dahin. Kommt es zurück und spielt weiter, ersetzt der nächste Stand diesen Zwischenstand.
       */
      function speichereEndlos(abgebrochen = false) {
        if (rundeGespeichert) return rekordVorher;
        if (rekordVorher === null) rekordVorher = besterRekord(name, def.id, stufe.id, mitTimer);
        const eintrag = {
          name, zeit: new Date().toISOString(), spiel: def.id, stufe: stufe.id, timer: mitTimer, punkte: geschafft,
          dauer: Math.round((Date.now() - beginn) / 1000),
          ...(allesGeschafft ? { alles: true } : {}), ...(test ? { test: true } : {}), ...(hilfen ? { hilfe: hilfen } : {}),
          ...(abgebrochen ? { abgebrochen: true } : {}),
        };
        speichereRekord(eintrag, zwischenstand);
        zwischenstand = eintrag;
        if (!abgebrochen) {
          rundeGespeichert = true;
          removeEventListener("pagehide", beimVerlassen);
          document.removeEventListener("visibilitychange", beimVerstecken);
        }
        return rekordVorher;
      }
      // Verlassen: Tab zu, Zurück-Pfeil (pagehide); Tablet aus oder App gewechselt (visibilitychange, auf
      // Tablets zuverlässiger als pagehide). Eine Serie ohne richtige Aufgabe gibt keinen Eintrag.
      function beimVerlassen() { if (geschafft > 0) speichereEndlos(true); }
      function beimVerstecken() { if (document.visibilityState === "hidden") beimVerlassen(); }
      if (endlos && !mix) {
        addEventListener("pagehide", beimVerlassen);
        document.addEventListener("visibilitychange", beimVerstecken);
      }
      // Mix: Aufgaben nur auf Verlangen des Mix (mix.html), Nachrichten nur von ihm.
      if (mix) addEventListener("message", e => {
        if (e.source !== parent || e.data?.lern !== "mix") return;
        if (e.data.typ === "ton") return setzeTon(e.data.an);
        if (e.data.typ !== "aufgabe") return;
        mixGeschafft = e.data.geschafft || 0;
        mixFreigabe = true;
        naechste();
      });

      /** Endlos: Ergebnis speichern (falls noch nicht geschehen), Rekord und Rangliste zeigen. */
      function schlussEndlos() {
        clearTimeout(uhr);
        const vorher = speichereEndlos();
        const neuerRekord = geschafft > 0 && geschafft > vorher;
        ton("fertig");
        if (neuerRekord) konfetti();
        buehne.innerHTML = "";
        const karte = el("div", { class: "karte schluss mitte" });
        const eule = euleZeile();
        karte.append(
          el("div", { class: "auftrag", text: `♾ ${geschafft} richtig in Folge!` }),
          eule.element,
          rangliste(def.id, stufe.id, mitTimer, name),
          el("div", { class: "knopfzeile" },
            el("button", { class: "knopf gruen", type: "button", text: "♾ Nochmal", onclick: () => runde(stufe, true) }),
            el("button", { class: "knopf hell", type: "button", text: "Andere Stufe", onclick: stufenwahl })));
        buehne.append(karte);
        eule.sag(allesGeschafft ? "Unglaublich — du hast alle Aufgaben dieser Stufe geschafft! 🏆"
          : neuerRekord ? `Neuer Rekord, ${name}! 🎉` + (vorher ? ` Vorher waren es ${vorher}.` : "")
          : vorher ? `Dein Rekord bleibt ${vorher}. Gleich nochmal?` : "Gut gemacht! Schaffst du nächstes Mal mehr?", "gut");
      }

      naechste();
    }

    // ?stufe=<id> startet direkt in dieser Stufe (Startseite verlinkt so ein erweitertes Lernziel),
    // mit &endlos=1 im Endlos-Modus, wenn die Stufe ihn anbietet.
    const adresse = new URLSearchParams(location.search);
    const direkt = stufenListe.find(st => st.id === adresse.get("stufe"));
    // &mix=1 im iframe des Zufallsmix (Entscheid M1 a): ohne Kopfzeile, mit &timer=1 und &endlos=1 vom Mix.
    // Kann das Spiel die verlangte Stufe nicht stellen (nicht frei, keine Stimme), sagt es das dem Mix.
    if (adresse.get("mix") === "1" && parent !== window) {
      document.body.classList.add("im-mix");
      const endlos = adresse.get("endlos") === "1";
      if (!direkt || !aktuellerSpieler() || !spielSichtbar(def.id) || (endlos && !endlosStufen(def.id).includes(direkt.id)))
        return parent.postMessage({ lern: "mix", spiel: def.id, typ: "geht-nicht" }, "*");
      return runde(direkt, endlos, { timer: adresse.get("timer") === "1" });
    }
    if (direkt) runde(direkt, adresse.get("endlos") === "1" && endlosStufen(def.id).includes(direkt.id));
    else stufenwahl();
  }

  // ---------- Zufallsmix (Entscheid M1 a, LERN_Session5) ----------
  // Rekorde des Endlos-Mix stehen unter spiel "mix:<Auswahl>" (alle, fokus oder Fächer mit +), damit
  // Ranglisten nur gleiche Mischungen vergleichen; stufe ist eine Stufe der Skala oder "passend".
  const MIX_PRAEFIX = "mix:";
  const istMix = spielId => String(spielId).startsWith(MIX_PRAEFIX);
  /** Anzeigename einer Mix-Kennung: „🎲 Zufallsmix · ⭐ Fokus + Mathe“. */
  function mixName(spielId) {
    const auswahl = String(spielId).slice(MIX_PRAEFIX.length);
    return "🎲 Zufallsmix" + (auswahl === "alle" ? "" : " · " + auswahl.split("+").map(t => (t === "fokus" ? "⭐ Fokus" : t)).join(" + "));
  }

  /**
   * Nur für tools/pruefe_spiele.js: pruefung.haken(art, angaben) erfährt jede neue Aufgabe
   * (art "aufgabe", { nr }; nach der Wiederholungsprüfung art "gestellt", { nr, kennung })
   * und jede Antwort (art "richtig" oder "falsch";
   * angaben { nr, hinweis, loesung, aufgeloest, flaeche, vorab }).
   */
  const pruefung = { haken: null };

  /**
   * CSS-Klassen des Rahmens (Vertrag in docs/rahmen.md; einzige Liste, das Testskript liest sie hier).
   * reserviert: baut Startbild, Namenswahl, Runde und Schlusskarte — ein Spiel definiert sie im eigenen
   *   <style> nie auf oberster Ebene neu (Vergleichs-Krokodil: eigene .mitte liess die Schlusskarte schrumpfen).
   * bausteine: Teile der Bausteine (auswahl, reihenfolge, koerbe, tastatur, Noten), die ein Spiel anpassen darf.
   */
  const RAHMEN_KLASSEN = {
    reserviert: ["buehne", "kopf", "zurueck", "ton", "karte", "mitte", "schluss", "auftrag", "knopf", "knopfzeile", "hell", "gruen", "klein",
      "eule", "eule-zeile", "blase", "fortschritt", "sterne", "sterne-klein", "aus", "konfetti", "flug", "leise", "link",
      "spieler-zeile",
      "stufen", "stufe", "fuer", "timer-zeile", "timer-schalter", "option-zeile", "option-schalter", "entwickler-leiste", "entwickler-feld", "zeitleiste", "zeitbalken", "testhilfe",
      "endlos", "endlos-wahl", "endlos-knoepfe", "rangliste", "ranglisten", "ich"],
    bausteine: ["wahl", "wahl-knopf", "bild", "ablage", "pfeil", "korb-karte", "korb-reihe", "korb-knopf",
      "tastatur", "anzeige", "ok", "loeschen", "hoer-zeile", "hoer-knopf", "notenblatt", "noten-zeile"],
  };

  return {
    STELLEN, SKALA, zahlText, dativ, zufall, waehle, mische, zerlege, el, ton, konfetti, tastatur, tippSchritte, SERIE_MAX, spiel, lies, schreibe, sterneText, sterneFuer,
    MIX_PRAEFIX, istMix, mixName, speichereRekord, protokolliere, euleZeile, tonSchalter, rangliste,
    spielerListe, aktuellerSpieler, setzeSpieler, neuerSpieler, loescheSpieler, profil, speichereProfil, empfohleneStufe,
    beiAenderung, abgleichDaten, spielStand: () => spielStand,
    istAufsicht, kinderListe, aufsichtListe, spielerName, aufsichtAngemeldet, abmelden, setzePin, meldeAufsichtAn, pinGueltig,
    freigabe, spielFrei, spielZuPruefen, spielGeprueft, setzeSpielFrei, spielSichtbar, fuerKinderSichtbar, sperrGrund, suche, spielListen, listeFrei, setzeListeFrei, freieListen,
    basisKlasse, stufeFuer, klasseText, loescheRunden, zusammenfuehren,
    REIHENFOLGEN, geordnet, vorgabeZeit, timerFuer, setzeTimerSpiel, zeitVorschlag,
    stimmeBereit, sprich, spielMitStimme, rekorde, besterRekord, ranglisteFuer, endlosStufen,
    protokoll, besteSterne, auswahl, reihenfolge, fliegen, koerbe, pruefung, RAHMEN_KLASSEN,
  };
})();
