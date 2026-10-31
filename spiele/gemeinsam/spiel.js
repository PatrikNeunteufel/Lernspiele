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

  function lies(schluessel, ersatz) {
    try {
      const v = localStorage.getItem("lernspiele:" + schluessel);
      return v === null ? ersatz : JSON.parse(v);
    } catch { return ersatz; }
  }

  function schreibe(schluessel, wert) {
    try { localStorage.setItem("lernspiele:" + schluessel, JSON.stringify(wert)); } catch { /* egal */ }
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
  const LEERES_PROFIL = {
    alter: null, klasse: null, fokus: [], rolle: "kind",
    reihenfolge: { global: "stufe", spiele: {} },
    timer: { an: false, faktor: 1, spiele: {} },
    favoriten: [], endlosAn: [], ansicht: "kacheln", zu: [],
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
   * zur kleinsten rechts? Einstellung je Spiel schlägt die globale; „stufe“ heisst: 1–3 geordnet.
   */
  function geordnet(name, spiel, stufe) {
    const r = profil(name).reihenfolge || LEERES_PROFIL.reihenfolge;
    const wert = [r.spiele?.[spiel], r.global].find(w => w && w !== "stufe") || "stufe";
    return wert === "stufe" ? ["s1", "s2", "s3"].includes(stufe) : wert === "geordnet";
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

  function speichereProfil(name, daten) {
    const alle = profile();
    alle[name] = { ...profil(name), ...daten };
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
  // angesehen ist (`geprueft`); eine Inhaltsliste (`listen: { <liste>: { name, geprueft } }`) ist
  // gesperrt, bis sie geprüft ist; geprueft = { am, von } oder null. Die Aufsicht kann auf dem Gerät
  // anders entscheiden: lernspiele:freigabe = { spiele: { <id>: bool }, listen: { "<id>/<liste>": bool } };
  // fehlt ein Eintrag, entscheidet der Prüfstand.
  const freigabe = () => ({ spiele: {}, listen: {}, ...lies("freigabe", {}) });
  function katalogEintrag(spielId) { return typeof SPIELE !== "undefined" ? SPIELE.find(s => s.id === spielId) : null; }
  function setzeFreigabe(art, schluessel, wert) {
    const f = freigabe();
    if (wert === null) delete f[art][schluessel]; else f[art][schluessel] = wert;
    schreibe("freigabe", f);
  }
  // Nutzt ein Spiel die Liste eines anderen (dieselben Wörter, dieselben Sätze), steht im Katalog
  // nur ein Verweis { von: "<spiel>/<liste>" }: Prüfstand und Freigabe gelten dann einmal, an der Quelle.
  /** Schlüssel "<spiel>/<liste>" der Quelle einer Liste (folgt dem Verweis von). */
  function listenQuelle(spielId, listeId) {
    const von = katalogEintrag(spielId)?.listen?.[listeId]?.von;
    return von || `${spielId}/${listeId}`;
  }
  /** Katalog-Eintrag der Quelle: { name, geprueft }. */
  function quellEintrag(schluessel) {
    const [spiel, liste] = schluessel.split("/");
    return katalogEintrag(spiel)?.listen?.[liste] || null;
  }
  /** Inhaltslisten eines Spiels aus dem Katalog: [{ id, name, geprueft, von }] — Name und Prüfstand von der Quelle. */
  const spielListen = spielId => Object.entries(katalogEintrag(spielId)?.listen || {}).map(([id, l]) => {
    const q = l.von ? quellEintrag(l.von) : l;
    return { id, name: q?.name ?? l.name, geprueft: q?.geprueft ?? null, von: l.von || null, zusatz: !!q?.zusatz };
  });
  /** Liste für Kinder frei? null als wert in setzeListeFrei = zurück auf den Prüfstand. */
  function listeFrei(spielId, listeId) {
    const schluessel = listenQuelle(spielId, listeId);
    return freigabe().listen[schluessel] ?? !!quellEintrag(schluessel)?.geprueft;
  }
  const setzeListeFrei = (spielId, listeId, wert) => setzeFreigabe("listen", listenQuelle(spielId, listeId), wert);
  /** Listen, die der angemeldete Spieler üben darf (die Aufsicht alle) — Spiele filtern ihre Inhalte danach. */
  const freieListen = spielId => spielListen(spielId).filter(l => aufsichtAngemeldet() || listeFrei(spielId, l.id)).map(l => l.id);
  /** Muss das Spiel als Ganzes noch angesehen werden (neu und nicht geprüft)? */
  const spielZuPruefen = spielId => { const e = katalogEintrag(spielId); return !!e?.neu && !e.geprueft; };
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

  function loescheSpieler(name) {
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
    const bleibt = e => e.name !== name || (spielId && e.spiel !== spielId);
    schreibe("protokoll", protokoll().filter(bleibt));
    schreibe("rekorde", rekorde().filter(bleibt));
  }

  /**
   * Gesicherte Daten eines anderen Geräts dazunehmen, ohne etwas zu verlieren: Runden, die schon da
   * sind (gleiches Kind, Zeit, Spiel, Stufe), zählen nur einmal; neue kommen dazu. Unbekannte Kinder
   * werden mit ihrem Profil angelegt, vorhandene Profile bleiben. Gibt die Anzahl neuer Runden und Kinder zurück.
   */
  function zusammenfuehren(daten) {
    const schluessel = e => `${e.name}|${e.zeit}|${e.spiel}|${e.stufe}`;
    const runden = protokoll();
    const bekannt = new Set(runden.map(schluessel));
    const neu = daten.protokoll.filter(e => e && e.name && e.zeit && !bekannt.has(schluessel(e)));
    schreibe("protokoll", [...runden, ...neu].sort((a, b) => (a.zeit < b.zeit ? -1 : a.zeit > b.zeit ? 1 : 0)));
    // Endlos-Rekorde ebenso: gleiche Runde (Kind, Zeit, Spiel, Stufe) zählt einmal.
    const alteRekorde = rekorde();
    const bekannteRekorde = new Set(alteRekorde.map(schluessel));
    schreibe("rekorde", [...alteRekorde, ...(daten.rekorde || []).filter(e => e && e.name && e.zeit && !bekannteRekorde.has(schluessel(e)))]);
    const alle = profile();
    const neueKinder = Object.keys(daten.profile).filter(n => !(n in alle));
    for (const n of neueKinder) alle[n] = { ...LEERES_PROFIL, ...daten.profile[n] };
    // Kinder, die nur in Runden vorkommen, bekommen ein leeres Profil
    for (const e of neu) if (!(e.name in alle)) { alle[e.name] = { ...LEERES_PROFIL }; neueKinder.push(e.name); }
    schreibe("profile", alle);
    return { runden: neu.length, kinder: neueKinder.length };
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
  function speichereRekord(eintrag) { schreibe("rekorde", [...rekorde(), eintrag]); }
  /** Stufen, die den Endlos-Modus anbieten (Katalog: endlos). */
  const endlosStufen = spielId => katalogEintrag(spielId)?.endlos || [];
  const gleicherModus = (e, spiel, stufe, mitTimer) => e.spiel === spiel && e.stufe === stufe && !!e.timer === !!mitTimer;
  /**
   * Endlos mit Timer (Wunsch Patrik 2026-10-31): je gelöste Aufgabe 4 % weniger Zeit, nie unter 40 % der
   * Startzeit und nie unter 3 s — spürbar schneller, aber nicht zu rasch und nicht unbegrenzt.
   */
  const ENDLOS_TEMPO = { faktor: 0.96, untergrenze: 0.4, minimum: 3 };
  const endlosSekunden = (start, geschafft) => Math.max(ENDLOS_TEMPO.minimum, Math.round(start * ENDLOS_TEMPO.untergrenze),
    Math.round(start * ENDLOS_TEMPO.faktor ** geschafft));
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
    const tonKnopf = document.querySelector(".kopf .ton");

    if (tonKnopf) {
      const setze = () => { tonKnopf.textContent = tonAn ? "🔊" : "🔇"; };
      tonKnopf.addEventListener("click", () => { tonAn = !tonAn; schreibe("ton", tonAn); setze(); ton("tipp"); });
      setze();
    }

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

    function stufenwahl() {
      if (!zugang()) return;
      buehne.innerHTML = "";
      const name = aktuellerSpieler();
      const karte = el("div", { class: "karte" });
      const eule = euleZeile();
      karte.append(spielerZeile(), eule.element, timerZeile(stufenwahl));
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
     */
    function runde(stufe, endlos = false) {
      if (!zugang()) return;
      const name = aktuellerSpieler();
      const timer = timerFuer(name, def.id, stufe.id);
      let nr = 0;
      let geschafft = 0; // Endlos: richtig gelöste Aufgaben
      const startSekunden = endlos ? vorgabeZeit(def.id, stufe.id) : timer.sekunden; // Endlos: für alle gleich
      let fehler = 0;
      const beginn = Date.now();
      const fehlerAufgaben = [];
      const aufgabenZeiten = []; // je Aufgabe: { ms, versuche, zeitUm, geloest }
      let uhr = null;            // laufender Timer der aktuellen Aufgabe
      // Wiederholungen (Vorgabe Patrik 2026-10-31): In einer Runde kommt höchstens eine Aufgabe ein
      // zweites Mal, nie direkt hintereinander. Gibt die Stufe nicht genug verschiedene Aufgaben her,
      // endet die Runde früher (anzahl wird kleiner). Endlos: keine der letzten 30 Aufgaben nochmal;
      // findet sich keine neue mehr, ist alles geschafft.
      let anzahl = endlos ? Infinity : def.anzahl;
      const gestellt = new Map(); // Kennung → wie oft gestellt
      let wiederholt = false;
      let letzte = null;
      const zuletzt = []; // Endlos: die letzten Kennungen
      let allesGeschafft = false;
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

      function naechste() {
        clearTimeout(uhr);
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

        // Endlos mit Timer: gleiche Startzeit für alle, je gelöste Aufgabe etwas knapper (ENDLOS_TEMPO).
        const sekunden = endlos ? endlosSekunden(startSekunden, geschafft) : timer.sekunden;
        if (timer.an) {
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
          if (endlos) punkte.textContent = `♾ ${geschafft} · ⏱ ${sekunden} s`;
        }

        /** Endlos: erste falsche Antwort oder Zeit um — Lösung zeigen, dann zum Ergebnis. */
        function endlosVorbei(text) {
          erledigt = true;
          abschliessen(false);
          const loesung = loesungVorab;
          eule.sag(`${text}${loesung ? ` Schau mal: ${loesung}` : ""}`, "hinweis");
          const weiter = el("button", { class: "knopf", type: "button", text: "Zum Ergebnis ➜", onclick: schlussEndlos });
          flaeche.append(el("div", { class: "knopfzeile" }, weiter));
          weiter.focus();
        }

        const ctx = {
          stufe: stufe.id,
          geordnet: geordnet(name, def.id, stufe.id),
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
        for (let versuch = 0; ; versuch++) {
          def.aufgabe(ctx);
          const k = kennung(flaeche, loesungVorab, eigeneKennung);
          const n = k ? gestellt.get(k) || 0 : 0;
          if (endlos ? !k || !zuletzt.includes(k) : n === 0 || (n === 1 && !wiederholt && k !== letzte)) {
            if (endlos && k) { zuletzt.push(k); if (zuletzt.length > 30) zuletzt.shift(); }
            if (n) wiederholt = true;
            if (k) gestellt.set(k, n + 1);
            letzte = k;
            pruefung.haken?.("gestellt", { nr, kennung: k });
            break;
          }
          if (versuch >= 60) {
            clearTimeout(uhr);
            anzahl = nr;
            if (endlos) { allesGeschafft = true; return schlussEndlos(); }
            return schluss();
          }
          flaeche.innerHTML = "";
          loesungVorab = null;
          eigeneKennung = null;
        }
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

      /** Endlos: Ergebnis speichern, Rekord und Rangliste zeigen. */
      function schlussEndlos() {
        clearTimeout(uhr);
        const mitTimer = timer.an ? startSekunden : null;
        const vorher = besterRekord(name, def.id, stufe.id, mitTimer);
        speichereRekord({
          name, zeit: new Date().toISOString(), spiel: def.id, stufe: stufe.id, timer: mitTimer, punkte: geschafft,
          dauer: Math.round((Date.now() - beginn) / 1000),
          ...(allesGeschafft ? { alles: true } : {}), ...(test ? { test: true } : {}), ...(hilfen ? { hilfe: hilfen } : {}),
        });
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

    /** Rangliste als kleine Tabelle: bester Wert je Spieler (ohne Testrunden), der eigene hervorgehoben. */
    function rangliste(spiel, stufeId, mitTimer, ich, hoechstens = 10) {
      const liste = ranglisteFuer(spiel, stufeId, mitTimer);
      if (!liste.length) return el("div");
      return el("div", { class: "rangliste" },
        el("b", { text: mitTimer ? "⏱ mit Timer" : "ohne Timer" }),
        el("ol", {}, ...liste.slice(0, hoechstens).map(r => el("li", { class: r.name === ich ? "ich" : "" },
          el("span", { text: r.name }), el("b", { text: String(r.punkte) })))));
    }

    // ?stufe=<id> startet direkt in dieser Stufe (Startseite verlinkt so ein erweitertes Lernziel),
    // mit &endlos=1 im Endlos-Modus, wenn die Stufe ihn anbietet.
    const adresse = new URLSearchParams(location.search);
    const direkt = stufenListe.find(st => st.id === adresse.get("stufe"));
    if (direkt) runde(direkt, adresse.get("endlos") === "1" && endlosStufen(def.id).includes(direkt.id));
    else stufenwahl();
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
      "stufen", "stufe", "fuer", "timer-zeile", "timer-schalter", "zeitleiste", "zeitbalken", "testhilfe",
      "endlos", "endlos-wahl", "endlos-knoepfe", "rangliste", "ranglisten", "ich"],
    bausteine: ["wahl", "wahl-knopf", "bild", "ablage", "pfeil", "korb-karte", "korb-reihe", "korb-knopf",
      "tastatur", "anzeige", "ok", "loeschen", "hoer-zeile", "hoer-knopf", "notenblatt", "noten-zeile"],
  };

  return {
    STELLEN, SKALA, zahlText, dativ, zufall, waehle, mische, zerlege, el, ton, konfetti, tastatur, spiel, lies, schreibe, sterneText,
    spielerListe, aktuellerSpieler, setzeSpieler, neuerSpieler, loescheSpieler, profil, speichereProfil, empfohleneStufe,
    istAufsicht, kinderListe, aufsichtListe, spielerName, aufsichtAngemeldet, abmelden, setzePin, meldeAufsichtAn, pinGueltig,
    freigabe, spielFrei, spielZuPruefen, setzeSpielFrei, spielSichtbar, fuerKinderSichtbar, spielListen, listeFrei, setzeListeFrei, freieListen,
    basisKlasse, stufeFuer, klasseText, loescheRunden, zusammenfuehren,
    REIHENFOLGEN, geordnet, vorgabeZeit, timerFuer, setzeTimerSpiel, zeitVorschlag,
    stimmeBereit, sprich, spielMitStimme, rekorde, besterRekord, ranglisteFuer, endlosStufen,
    protokoll, besteSterne, auswahl, reihenfolge, fliegen, koerbe, pruefung, RAHMEN_KLASSEN,
  };
})();
