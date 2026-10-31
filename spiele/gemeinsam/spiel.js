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
  const LEERES_PROFIL = {
    alter: null, klasse: null, fokus: [],
    reihenfolge: { global: "stufe", spiele: {} },
    timer: { an: false, faktor: 1, spiele: {} },
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

  const profile = () => lies("profile", {});
  const spielerListe = () => Object.keys(profile());
  const aktuellerSpieler = () => { const n = lies("spieler", null); return spielerListe().includes(n) ? n : null; };
  function setzeSpieler(name) { schreibe("spieler", name); }

  function profil(name) { return { ...LEERES_PROFIL, ...(profile()[name] || {}) }; }

  function speichereProfil(name, daten) {
    const alle = profile();
    alle[name] = { ...profil(name), ...daten };
    schreibe("profile", alle);
  }

  function neuerSpieler(name) {
    name = name.trim().slice(0, 20);
    if (!name) return null;
    if (!spielerListe().includes(name)) speichereProfil(name, {});
    setzeSpieler(name);
    return name;
  }

  function loescheSpieler(name) {
    const alle = profile();
    delete alle[name];
    schreibe("profile", alle);
    schreibe("protokoll", protokoll().filter(e => e.name !== name));
    if (lies("spieler", null) === name) schreibe("spieler", null);
  }

  /** Spielstand zurücksetzen: die Runden eines Kindes löschen — alle oder nur die eines Spiels.
      Profil, Klasse, Fokus und Timer bleiben. */
  function loescheRunden(name, spielId = null) {
    schreibe("protokoll", protokoll().filter(e => e.name !== name || (spielId && e.spiel !== spielId)));
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

  function besteSterne(name, spiel, stufe) {
    return protokoll()
      .filter(e => e.name === name && e.spiel === spiel && e.stufe === stufe)
      .reduce((m, e) => Math.max(m, e.sterne), 0);
  }

  /** Auswahl „Wer spielt?“: Namen als Knöpfe, dazu ein Feld für einen neuen Namen. */
  function spielerWahl(onWahl) {
    const box = el("div", { class: "spielerwahl" });
    function zeichne() {
      box.innerHTML = "";
      const jetzt = aktuellerSpieler();
      box.append(el("span", { class: "spielerwahl-titel", text: "Wer spielt?" }));
      for (const n of spielerListe()) {
        box.append(el("button", {
          type: "button", class: "spieler" + (n === jetzt ? " aktiv" : ""), "aria-pressed": String(n === jetzt), text: n,
          onclick: () => { setzeSpieler(n); zeichne(); onWahl(n); },
        }));
      }
      const feld = el("input", { type: "text", maxlength: "20", placeholder: "Neuer Name", "aria-label": "Neuer Name", class: "spieler-neu" });
      const dazu = () => { const n = neuerSpieler(feld.value); if (n) { zeichne(); onWahl(n); } };
      feld.addEventListener("keydown", e => { if (e.key === "Enter") dazu(); e.stopPropagation(); });
      box.append(el("span", { class: "spieler-neu-zeile" }, feld, el("button", { type: "button", class: "spieler plus", text: "＋", "aria-label": "Name hinzufügen", onclick: dazu })));
    }
    zeichne();
    return box;
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
  function auswahl(ctx, opt) {
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

    /** Ohne gewählten Namen zuerst „Wer spielt?“, danach geht es mit 'weiter' los. */
    function namensWahl(weiter) {
      buehne.innerHTML = "";
      const karte = el("div", { class: "karte" });
      const eule = euleZeile();
      karte.append(eule.element, spielerWahl(() => weiter()));
      buehne.append(karte);
      eule.sag("Hallo! Wie heisst du? Tipp auf deinen Namen oder schreib ihn neu hin.");
    }

    function spielerZeile() {
      const name = aktuellerSpieler();
      return el("div", { class: "spieler-zeile" },
        el("span", { text: "Du spielst als " }),
        el("b", { text: name }),
        el("button", { type: "button", class: "link", text: "wechseln", onclick: () => namensWahl(stufenwahl) }));
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
      if (!aktuellerSpieler()) return namensWahl(stufenwahl);
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

    function runde(stufe) {
      if (!aktuellerSpieler()) return namensWahl(() => runde(stufe));
      const name = aktuellerSpieler();
      const timer = timerFuer(name, def.id, stufe.id);
      let nr = 0;
      let fehler = 0;
      const beginn = Date.now();
      const fehlerAufgaben = [];
      const aufgabenZeiten = []; // je Aufgabe: { ms, versuche, zeitUm, geloest }
      let uhr = null;            // laufender Timer der aktuellen Aufgabe
      buehne.innerHTML = "";

      const punkte = el("div", { class: "fortschritt" });
      for (let i = 0; i < def.anzahl; i++) punkte.append(el("span"));
      const karte = el("div", { class: "karte" });
      const flaeche = el("div");
      const eule = euleZeile();
      const zeitleiste = el("div", { class: "zeitleiste", "aria-hidden": "true" }, el("div", { class: "zeitbalken" }));
      // Eule oben, damit ihre Rückmeldung auch auf kleinen Bildschirmen neben der Aufgabe sichtbar bleibt.
      karte.append(eule.element);
      if (timer.an) karte.append(zeitleiste);
      karte.append(flaeche);
      buehne.append(punkte, karte);

      function naechste() {
        clearTimeout(uhr);
        if (nr >= def.anzahl) return schluss();
        [...punkte.children].forEach((p, i) => {
          p.classList.toggle("fertig", i < nr);
          p.classList.toggle("aktiv", i === nr);
        });
        flaeche.innerHTML = "";
        let versuche = 0;
        let erledigt = false;
        let zeitUm = false;
        let eintrag = null; // Protokolleintrag, sobald die Aufgabe einen Fehler hatte
        const start = performance.now();

        const fehlerEintrag = (loesungText) => {
          if (!eintrag) {
            eintrag = { text: aufgabenText(flaeche), loesung: loesungText || "", versuche: 0, geloest: false, zeitUm: false };
            fehlerAufgaben.push(eintrag);
          }
          if (loesungText && !eintrag.loesung) eintrag.loesung = loesungText;
          return eintrag;
        };

        const abschliessen = (geloest) => {
          clearTimeout(uhr);
          // Balken dort anhalten, wo er gerade steht.
          const balken = zeitleiste.firstChild;
          balken.style.width = getComputedStyle(balken).width;
          balken.style.transition = "none";
          aufgabenZeiten.push({ ms: Math.round(performance.now() - start), versuche, zeitUm, geloest });
        };

        if (timer.an) {
          // Balken läuft per CSS-Übergang von voll auf leer; der Fehler zählt einmal, die Aufgabe bleibt offen.
          const balken = zeitleiste.firstChild;
          zeitleiste.classList.remove("um");
          balken.style.transition = "none";
          balken.style.width = "100%";
          void balken.offsetWidth;
          balken.style.transition = `width ${timer.sekunden}s linear`;
          balken.style.width = "0%";
          uhr = setTimeout(() => {
            if (erledigt) return;
            zeitUm = true;
            fehler++;
            fehlerEintrag("").zeitUm = true;
            zeitleiste.classList.add("um");
            ton("falsch");
            eule.sag("⏰ Die Zeit ist um! Mach die Aufgabe trotzdem fertig.", "hinweis");
          }, timer.sekunden * 1000);
        }

        const ctx = {
          stufe: stufe.id,
          geordnet: geordnet(name, def.id, stufe.id),
          nr,
          flaeche,
          sag: (t, art) => eule.sag(t, art),
          /** Ist die Aufgabe gelöst oder nach drei Fehlversuchen aufgelöst? Dann nimmt sie keine Antwort mehr an. */
          vorbei: () => erledigt,
          richtig(text) {
            if (erledigt) return;
            erledigt = true;
            if (eintrag) eintrag.geloest = true;
            abschliessen(true);
            ton("richtig");
            eule.sag(text || waehle(LOB), "gut");
            nr++;
            setTimeout(naechste, 1300);
          },
          falsch(hinweis, loesungText) {
            if (erledigt) return;
            versuche++;
            fehler++;
            fehlerEintrag(loesungText).versuche = versuche;
            ton("falsch");
            if (versuche >= 3 && loesungText) {
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
        def.aufgabe(ctx);
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
          aufgaben: def.anzahl,
          dauer: Math.round((Date.now() - beginn) / 1000),
          geordnet: geordnet(name, def.id, stufe.id),
          timer: timer.an ? timer.sekunden : null,
          aufgabenZeiten,
          fehlerAufgaben,
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

      naechste();
    }

    // ?stufe=<id> startet direkt in dieser Stufe (Startseite verlinkt so ein erweitertes Lernziel).
    const direkt = stufenListe.find(st => st.id === new URLSearchParams(location.search).get("stufe"));
    if (direkt) runde(direkt);
    else stufenwahl();
  }

  return {
    STELLEN, SKALA, zahlText, dativ, zufall, waehle, mische, zerlege, el, ton, konfetti, tastatur, spiel, lies, schreibe, sterneText,
    spielerListe, aktuellerSpieler, setzeSpieler, neuerSpieler, loescheSpieler, profil, speichereProfil, empfohleneStufe,
    basisKlasse, stufeFuer, klasseText, loescheRunden, zusammenfuehren,
    REIHENFOLGEN, geordnet, vorgabeZeit, timerFuer, setzeTimerSpiel, zeitVorschlag,
    protokoll, besteSterne, spielerWahl, auswahl, reihenfolge, fliegen, koerbe,
  };
})();
