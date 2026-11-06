/* Lernsteig — Seitenteil des Rahmens: Konto (vorläufig Gast), Niveau, Stufenwahl, Runde, Endlos-Modus,
   Protokoll und Rekorde. Baut auf werkzeug.js, lehrplaene.js und katalog.js auf.
   Vertrag: docs/lernsteig/rahmen.md. Übernahmen aus dem Eulenpfad: docs/gemeinsame_mechaniken.md. */
"use strict";

(function (LST) {
  const LP = LST_LEHRPLAENE;
  const KAT = LST_KATALOG;

  // ---------- Elemente ----------
  /** Element bauen (kern/el.js): el("button", { class, text, onclick, … }, kinder…) */
  const el = KERN.el;

  // ---------- Freigabe nach Prüfstand (FG1 a, A1 a; Kern kern/freigabe.js seit 1.4.0) ----------
  // Wie im Eulenpfad (docs/eulenpfad/rahmen.md 6): Eine Übung mit `neu` im Katalog ist gesperrt, bis sie im
  // Prüfstand (gemeinsam/pruefstand.js) steht; mit Inhaltslisten braucht sie dazu eine geprüfte Liste. Die angemeldete
  // Aufsicht sieht alles (zum Ansehen und Prüfen). Freigabe je Gerät (lernsteig:freigabe) setzt später die Aufsicht in
  // der Verwaltung (docs/plan_angleich_reihe.md C6).
  const FREIGABE = KERN.freigabe({
    art: "uebungen", eintrag: id => KAT.uebung(id), speicher: { lies: LST.lies, schreibe: LST.schreibe },
    pruefstand: () => (typeof LST_PRUEFSTAND !== "undefined" ? LST_PRUEFSTAND : {}),
    aufsicht: () => typeof LST_KONTEN !== "undefined" && !!LST_KONTEN.aufsichtAktiv(),
  });
  /** Grund, warum Jugendliche die Übung nicht sehen, oder null, wenn sie frei ist. */
  const sperrGrund = id => FREIGABE.sperrGrund(id);
  /** Darf die Übung auf diesem Tab geöffnet werden? Frei oder angemeldete Aufsicht. */
  const uebungSichtbar = id => FREIGABE.sichtbar(id);

  // ---------- Konto ----------
  // Wer übt (Plan C1): ein angemeldeter Jugendlicher mit seinem Konto (Profilformat: id, name, niveau je Fach,
  // lehrplan { land, kanton }, pruefungsziel NV2 a, rechnerModell). Der Gast (C2 a) und die angemeldete Aufsicht haben
  // Einstellungen nur in diesem Tab (sessionStorage lernsteig:tab-konto): Für den Gast wird nichts gespeichert, auch keine
  // Runde; die Aufsicht übt zum Ansehen und Prüfen, ihre Runden tragen test (wie im Eulenpfad). Das frühere Gastkonto je
  // Gerät (lernsteig:gast) gilt nicht mehr; seine Runden (person „gast“) bleiben im Speicher und reisen in Sicherungen mit.
  /** "lernend" | "aufsicht" | "gast" | "niemand" */
  function werUebt() {
    if (typeof LST_KONTEN === "undefined") return "niemand";
    if (LST_KONTEN.aktiv()) return "lernend";
    if (LST_KONTEN.aufsichtAktiv()) return "aufsicht";
    return LST_KONTEN.istGast() ? "gast" : "niemand";
  }
  const TAB_KONTO = LST.PRAEFIX + "tab-konto";
  const TAB_FELDER = ["niveau", "lehrplan", "pruefungsziel", "rechnerModell"];
  function tabKonto() { try { return JSON.parse(sessionStorage.getItem(TAB_KONTO)) || null; } catch (e) { return null; } }
  function konto() {
    const wer = werUebt();
    const a = wer === "aufsicht" ? LST_KONTEN.aufsichtAktiv() : null;
    const standard = { id: a ? a.id : "gast", name: a ? a.name : "Gast", niveau: {}, lehrplan: { land: "CH", kanton: null }, pruefungsziel: "keins", rechnerModell: "allgemein" };
    let erg;
    if (wer === "lernend") erg = Object.assign(standard, LST_KONTEN.aktiv());
    else { erg = standard; const t = tabKonto() || {}; for (const f of TAB_FELDER) if (t[f] !== undefined) erg[f] = t[f]; }
    erg.niveau = Object.assign({}, erg.niveau);
    for (const f of Object.keys(erg.niveau)) if (!LST.NIVEAUS.some(n => n.id === erg.niveau[f])) delete erg.niveau[f]; // n3 aus NV1 a
    return erg;
  }
  function speichereKonto(k) {
    if (werUebt() === "lernend" && LST_KONTEN.finde(k.id)) { LST_KONTEN.aendern(k); return; }
    const t = {}; for (const f of TAB_FELDER) t[f] = k[f];
    try { sessionStorage.setItem(TAB_KONTO, JSON.stringify(t)); } catch (e) { /* ohne sessionStorage: gilt nur auf dieser Seite */ }
  }

  // ---------- Kompetenzstand (BF1 a) ----------
  // Je Lehrplan-Stufe einer Übung aus den letzten Aufgaben im Protokoll, regelbasiert und mit Zahlen begründet.
  // Annahme (mit Patrik abzustimmen): sicher = mindestens 10 Aufgaben, davon in den letzten 10 mindestens 85 % auf
  // Anhieb und keine gezeigte Lösung; am Üben = mindestens eine Aufgabe; offen = noch keine. Mit und ohne Rechner
  // getrennt (RE1 a): zählt zuerst ohne Rechner, „sicher mit Rechner“ nur, wenn es ohne noch nicht reicht.
  const STAND = { minAufgaben: 10, fenster: 10, anhieb: 0.85 };
  function kompetenzstand(kontoId, uebungId, lp) {
    const liste = runden(r => r.person === kontoId && r.inhalt === uebungId).flatMap(r => (r.liste || []).filter(x => x.lp === lp));
    const bewerte = l => {
      const letzte = l.slice(-STAND.fenster);
      const anhieb = letzte.filter(x => x.versuche === 0 && !x.gezeigt).length;
      return { n: l.length, anhieb, fenster: letzte.length, sicher: l.length >= STAND.minAufgaben && letzte.every(x => !x.gezeigt) && anhieb / letzte.length >= STAND.anhieb };
    };
    const ohne = bewerte(liste.filter(x => !x.rechner)), mit = bewerte(liste.filter(x => x.rechner));
    if (ohne.sicher) return Object.assign({ stand: "sicher", text: "sicher" }, ohne);
    if (mit.sicher) return Object.assign({ stand: "sicher-rechner", text: "sicher mit Rechner" }, mit);
    if (liste.length) { const b = bewerte(liste); return Object.assign({ stand: "ueben", text: "am Üben" }, b); }
    return { stand: "offen", text: "offen", n: 0, anhieb: 0, fenster: 0 };
  }

  /** Serie über Tage (BF1 a) zum selbst gesetzten Wochenziel des Kontos; null ohne Ziel. */
  function wochenSerie(k) {
    if (!k.wochenziel) return null;
    const tage = new Set(runden(r => r.person === k.id).map(r => LST.tagText(new Date(r.zeit))));
    return LST.wochenSerie(tage, k.wochenziel);
  }
  const serieText = s => `diese Woche ${s.dieseWoche} von ${s.ziel} Tagen` + (s.wochenInFolge ? ` · ${s.wochenInFolge} ${s.wochenInFolge === 1 ? "Woche" : "Wochen"} in Folge erreicht` : "");

  /** Niveau des Kontos in einem Fach; bietet die Übung es nicht an, das nächstliegende angebotene. */
  function niveauFuer(fach, angeboten) {
    const n = konto().niveau[fach] || "n1";
    if (!angeboten || angeboten.includes(n)) return n;
    return angeboten.reduce((best, x) => Math.abs(LST.niveauNr(x) - LST.niveauNr(n)) < Math.abs(LST.niveauNr(best) - LST.niveauNr(n)) ? x : best, angeboten[0]);
  }
  function setzeNiveau(fach, n) { const k = konto(); k.niveau[fach] = n; speichereKonto(k); }
  const niveauName = n => LP.niveauName(n, konto().lehrplan);

  const RECHNER_TEXT = { ohne: "ohne Taschenrechner", mit: "mit Taschenrechner", frei: "Taschenrechner erlaubt" };

  /**
   * Was eine Stufe für das Konto bedeutet (ST1 a, ST2 a, NV2 a): Marken des Lehrplans, Ziel des Niveaus, geprüft im
   * Prüfungsziel, Taschenrechner. Liefert eine Liste kurzer Texte für die Stufenwahl.
   */
  function stufeInfo(eintrag, st, niveau) {
    const k = konto();
    const texte = [];
    const m = LP.MARKEN[eintrag.kompetenz];
    const ziel = LST.zielstufe(m, niveau);
    if (st.typ === "referenz") {
      const mk = LP.marken(eintrag.kompetenz, st.id) || {};
      if (mk.gaZ2) texte.push("Grundanspruch Zyklus 2");
      if (mk.op) texte.push("Orientierungspunkt");
      if (mk.ga) texte.push("Grundanspruch");
      if (mk.e && !(eintrag.ohneE || []).includes(st.id)) texte.push("mit Erweiterung");
      if (ziel === st.id) texte.push(`Ziel ${niveauName(niveau)}`);
      else if (ziel && st.id > ziel) texte.push("weiterführend");
      if (k.pruefungsziel !== "keins") {
        const g = LP.geprueft(`${eintrag.kompetenz}.${st.id}`, k.pruefungsziel, k.lehrplan);
        if (g.geprueft) texte.push("wird geprüft" + (g.ohneE ? " (ohne Erweiterung)" : ""));
      }
    } else if (st.typ === "uebergang") {
      texte.push(`Aufgaben aus Stufe ${st.lp[0]} und ${st.lp[1]} gemischt`);
    } else {
      texte.push("über den Erwartungen");
    }
    const r = [...new Set((st.typ === "challenge" ? ["challenge"] : st.lp).map(s => rechnerFuer(eintrag, s)).filter(Boolean))];
    if (r.length === 1) texte.push(RECHNER_TEXT[r[0]]);
    return texte;
  }
  /** Marke zum Kompetenzstand, mit den Zahlen als Tooltip („9 von 10 zuletzt auf Anhieb, 14 Aufgaben“). */
  function standMarke(ks) {
    const titel = ks.n ? `${ks.anhieb} von ${ks.fenster} zuletzt auf Anhieb, ${ks.n} Aufgaben` : "noch keine Aufgabe";
    return el("span", { class: `stand stand-${ks.stand}`, text: ks.text, title: titel });
  }
  const endlosStufe = (eintrag, id) => eintrag.endlos === true || (Array.isArray(eintrag.endlos) && eintrag.endlos.includes(id));

  // ---------- Protokoll und Rekorde ----------
  const kennungNeu = () => Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e9).toString(36);
  // Runden und Rekorde im gemeinsamen Format der Reihe (R1 a, kern/runden.js): { id, person, zeit, inhalt, stufe, … };
  // gespeicherte von vor LERN_Session15 (konto, uebung) werden beim Laden umgedeutet (LST.ALTE_FELDER, werkzeug.js).
  for (const k of ["runden", "rekorde"]) {
    const l = LST.lies(k, []);
    if (Array.isArray(l) && l.some(e => e && ("konto" in e || "uebung" in e))) LST.schreibe(k, l.map(e => KERN.runden.umdeuten(e, LST.ALTE_FELDER)));
  }
  // Gast: nichts gespeichert (C2 a). Aufsicht: Runde und Rekord als Test (zählen nicht für einen Jugendlichen).
  const merkt = () => werUebt() !== "gast";
  const alsTest = e => (werUebt() === "aufsicht" ? Object.assign(e, { test: true }) : e);
  function protokolliere(runde) { if (!merkt()) return; const r = LST.lies("runden", []); r.push(alsTest(runde)); LST.schreibe("runden", r); }
  function runden(filter) { return LST.lies("runden", []).filter(filter || (() => true)); }

  /** Rekord speichern oder ersetzen (gleiche Kennung = Zwischenstand derselben Serie). */
  function speichereRekord(rekord) {
    if (!merkt()) return;
    alsTest(rekord);
    const liste = LST.lies("rekorde", []);
    const i = liste.findIndex(r => r.id === rekord.id);
    if (i >= 0) liste[i] = rekord; else liste.push(rekord);
    LST.schreibe("rekorde", liste);
  }
  // Die Aufgaben einer Stufe hängen nicht am Niveau (ST1 a); Rekord und Bestzeit gelten darum je Stufe.
  // Mit und ohne Rechner getrennt (RE1 a): mit = true/false wählt eine Seite, undefined nimmt beide.
  const passtRechner = (r, mit) => mit === undefined || !!r.mitRechner === mit;
  function bestwert(kontoId, uebung, stufe, mit) {
    return LST.lies("rekorde", []).filter(r => r.person === kontoId && r.inhalt === uebung && r.stufe === stufe && passtRechner(r, mit))
      .reduce((m, r) => Math.max(m, r.punkte), 0);
  }
  function bestzeit(kontoId, uebung, stufe, mit) {
    const z = runden(r => r.person === kontoId && r.inhalt === uebung && r.stufe === stufe && !r.endlos && r.gezeigt === 0 && passtRechner(r, mit))
      .map(r => r.dauer);
    return z.length ? Math.min(...z) : null;
  }

  /**
   * Rechner einer Lehrplan-Stufe (TR1 a): Vorgabe der Übung, überstimmt von der Einstellung der Aufsicht
   * `einstellungen.rechner`: "uebung" (Standard), "ohne" (Rechner überall gesperrt), "erlaubt" (überall erlaubt).
   */
  function rechnerFuer(eintrag, lp) {
    if (!eintrag.rechner) return null; // Übung ohne Rechner-Angabe (etwa Deutsch): kein Rechner, kein Hinweis
    const vorgabe = eintrag.rechner[lp] || "frei";
    const aufsicht = LST.lies("einstellungen", {}).rechner || "uebung";
    if (aufsicht === "ohne") return "ohne";
    if (aufsicht === "erlaubt" && vorgabe === "ohne") return "frei";
    return vorgabe;
  }

  // Zuletzt gestellte Aufgaben je Konto, Übung, Stufe und Niveau (nur dieses Gerät), gegen Wiederholungen.
  const GESTELLT_MAX = 30;
  function gestellt(schl) { return LST.lies("gestellt", {})[schl] || []; }
  function merkeGestellt(schl, kennung) {
    const alle = LST.lies("gestellt", {});
    alle[schl] = (alle[schl] || []).filter(k => k !== kennung).concat(kennung).slice(-GESTELLT_MAX);
    LST.schreibe("gestellt", alle);
  }

  const sekunden = ms => Math.round(ms / 100) / 10;
  const dauerText = s => (s < 60 ? `${LST.dezimalText(s, 1)} s` : `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`);

  // ---------- Übungsseite ----------
  /**
   * Startet eine Übungsseite. def = UEBUNG aus aufgaben.js; fn = { aufgabeErzeugen, pruefeAufgabe, hinweis }.
   * Adresse: ?niveau=n1&stufe=h[&endlos=1] startet direkt (Stufe „h“, Übergang „h-i“, „challenge“); ohne stufe
   * zeigt die Seite die Stufenwahl.
   */
  function uebung(def, fn) {
    const eintrag = KAT.uebung(def.id);
    if (!eintrag) throw new Error(`Übung ${def.id} fehlt im Katalog`);
    const fach = KAT.fach(eintrag.fach);
    document.title = `${eintrag.titel} · Lernsteig`;

    const titel = el("h1", { text: eintrag.titel });
    const info = el("span", { class: "kopf-info" });
    const kopf = el("header", { class: "kopf" },
      el("a", { class: "zurueck", href: "../../index.html", text: "← Übersicht" }), titel, info);
    const buehne = el("main", { class: "buehne" });
    document.body.append(kopf, buehne);

    // Anmeldung zuerst (Plan C1): ohne Person und ohne Gast nur der Weg zur Anmeldung (wie im Eulenpfad).
    if (werUebt() === "niemand") {
      buehne.append(el("section", { class: "karte" },
        el("h2", { text: "Zuerst anmelden" }),
        el("p", { text: "Melde dich auf der Startseite an oder übe als Gast." }),
        el("p", { class: "knopf-zeile" }, el("a", { class: "knopf haupt", href: "../../index.html", text: "Zur Anmeldung" }))));
      return;
    }
    // Gesperrt (FG1 a): Wer die Adresse direkt aufruft, sieht nur den Hinweis, keine Aufgabe.
    if (!uebungSichtbar(def.id)) {
      buehne.append(el("section", { class: "karte" },
        el("h2", { text: "Noch nicht freigegeben" }),
        el("p", { text: "Diese Übung wird noch geprüft. Auf der Übersicht findest du die Übungen, die schon bereit sind." }),
        el("p", { class: "knopf-zeile" }, el("a", { class: "knopf haupt", href: "../../index.html", text: "Zur Übersicht" }))));
      return;
    }
    // Die Aufsicht sieht Gesperrtes zum Prüfen, mit Vermerk über der Übung.
    if (sperrGrund(def.id)) kopf.after(el("p", { class: "gesperrt-vermerk", text: `Für Jugendliche gesperrt: ${sperrGrund(def.id)}. Du siehst die Übung als Aufsicht.` }));

    const p = new URLSearchParams(location.search);
    let niveau = eintrag.niveaus.includes(p.get("niveau")) ? p.get("niveau") : niveauFuer(fach.id, eintrag.niveaus);
    const stufe = LST.stufeVon(eintrag, p.get("stufe"));
    if (stufe) runde(stufe.id, p.get("endlos") === "1" && endlosStufe(eintrag, stufe.id)); else stufenwahl();

    function adresse(st, endlos) {
      const q = new URLSearchParams({ niveau });
      if (st) q.set("stufe", st);
      if (endlos) q.set("endlos", "1");
      history.replaceState(null, "", "?" + q.toString());
    }

    function stufenwahl() {
      adresse(null);
      info.textContent = niveauName(niveau);
      buehne.replaceChildren();
      buehne.append(el("p", { class: "einleitung", text: def.einleitung }));
      if (eintrag.niveaus.length > 1) {
        buehne.append(el("div", { class: "niveau-wahl", role: "group", "aria-label": "Niveau" },
          eintrag.niveaus.map(n => el("button", {
            type: "button", class: "chip" + (n === niveau ? " an" : ""), "aria-pressed": String(n === niveau),
            text: niveauName(n), onclick: () => { niveau = n; setzeNiveau(fach.id, n); stufenwahl(); },
          }))));
      }
      const k = konto();
      const liste = el("ol", { class: "stufen" });
      for (const st of LST.stufenListe(eintrag)) {
        const beschreibung = st.typ === "uebergang" ? "" : (def.stufen[st.id] || "");
        const zeit = bestzeit(k.id, def.id, st.id, false), zeitMit = bestzeit(k.id, def.id, st.id, true);
        const endlos = endlosStufe(eintrag, st.id);
        const rekord = endlos ? bestwert(k.id, def.id, st.id) : 0;
        const zeichen = st.typ === "referenz" ? st.id : (st.typ === "uebergang" ? "→" : "C");
        liste.append(el("li", { class: `stufe ${st.typ}` },
          el("button", { type: "button", class: "stufe-knopf", "data-stufe": st.id, onclick: () => runde(st.id, false) },
            el("span", { class: "stufe-nr", text: zeichen, "aria-hidden": "true" }),
            el("span", { class: "stufe-text" },
              el("b", {}, st.name, st.typ === "referenz" ? standMarke(kompetenzstand(k.id, def.id, st.id)) : null), el("small", { text: stufeInfo(eintrag, st, niveau).join(" · ") }),
              beschreibung ? el("span", { class: "leise", text: beschreibung }) : null),
            zeit !== null || zeitMit !== null ? el("span", { class: "bestwert", text: [zeit !== null ? `Bestzeit ${dauerText(zeit)}` : "", zeitMit !== null ? `mit Rechner ${dauerText(zeitMit)}` : ""].filter(Boolean).join(" · ") }) : null),
          endlos ? el("button", { type: "button", class: "endlos-knopf", "data-stufe": st.id, onclick: () => runde(st.id, true),
            "aria-label": `${st.name} als Serie`, text: rekord ? `Serie · Rekord ${rekord}` : "Serie" }) : null));
      }
      buehne.append(liste,
        el("p", { class: "leise klein", text: "Serie: Aufgaben, bis eine falsch ist. Gezählt werden die richtigen." }));
    }

    function runde(st, endlos) {
      adresse(st, endlos);
      const k = konto();
      const schluessel = `${k.id}/${def.id}/${st}/${niveau}`;
      const start = Date.now();
      const anzahl = endlos ? Infinity : eintrag.anzahl;
      const ergebnis = { aufAnhieb: 0, fehler: 0, gezeigt: 0, zeiten: [], falsch: [], liste: [], mitRechner: false };
      const rundeId = kennungNeu();
      // Bestwerte vor dieser Runde, für den Vergleich im Ergebnis
      const rekordVorher = { true: bestwert(k.id, def.id, st, true), false: bestwert(k.id, def.id, st, false) };
      const bestzeitVorher = { true: bestzeit(k.id, def.id, st, true), false: bestzeit(k.id, def.id, st, false) };
      const dieseRunde = new Set();
      let nr = 0, punkte = 0, vorbei = false;
      const stufeObj = LST.stufeVon(eintrag, st);
      const stName = stufeObj.name;
      // Welche Lehrplan-Stufe die nächste Aufgabe stellt: Übergang mischt beide, Challenge hat eigene Aufgaben.
      const lpStufe = () => (stufeObj.typ === "uebergang" ? LST.waehle(stufeObj.lp) : stufeObj.id);
      info.textContent = `${niveauName(niveau)} · ${stName}${endlos ? " · Serie" : ""}`;

      const fortschritt = el("div", { class: "fortschritt", "aria-live": "polite" });
      const aufgabeFeld = el("div", { class: "aufgabe" });
      const antwort = el("div", { class: "antwort" });
      const rueck = el("div", { class: "rueckmeldung", "aria-live": "polite" });
      // Eingebauter Rechner (RE1 a): ein Feld je Runde (Ans bleibt), sichtbar nur bei „mit“ oder „frei“.
      let aktuellesFeld = null, rechnerBenutzt = false;
      const rechnerFeld = typeof LST_RECHNER !== "undefined"
        ? LST_RECHNER.feld({ modell: konto().rechnerModell, modellGewaehlt: id => { const kk = konto(); kk.rechnerModell = id; speichereKonto(kk); }, uebernehmen: t => { if (aktuellesFeld) { aktuellesFeld.value = t; aktuellesFeld.focus(); } }, zu: () => aktuellesFeld && aktuellesFeld.focus() })
        : null;
      const rechnerEl = rechnerFeld ? rechnerFeld.element : el("div");
      rechnerEl.hidden = true;
      buehne.replaceChildren(fortschritt, aufgabeFeld, antwort, rechnerEl, rueck);

      // Serie mitten drin verlassen: Stand bis dahin zählt (abgeschaut vom Eulenpfad, Entscheid E1 a dort).
      const zwischenstand = () => {
        if (endlos && !vorbei && punkte > 0) speichereRekord({ id: rundeId, person: k.id, zeit: new Date(start).toISOString(), inhalt: def.id, stufe: st, niveau, punkte, dauer: sekunden(Date.now() - start), mitRechner: ergebnis.mitRechner, abgebrochen: true });
      };
      const beiVerstecken = () => { if (document.visibilityState === "hidden") zwischenstand(); };
      addEventListener("pagehide", zwischenstand);
      document.addEventListener("visibilitychange", beiVerstecken);
      const aufraeumen = () => { removeEventListener("pagehide", zwischenstand); document.removeEventListener("visibilitychange", beiVerstecken); };

      function ziehe() {
        const alt = endlos ? gestellt(schluessel) : [];
        let a = null;
        for (let v = 0; v < 40; v++) {
          a = fn.aufgabeErzeugen(lpStufe(), niveau);
          if (!dieseRunde.has(a.kennung) && !alt.includes(a.kennung)) break;
        }
        dieseRunde.add(a.kennung);
        merkeGestellt(schluessel, a.kennung);
        return a;
      }

      let auswahlAufraeumen = null;
      function naechste() {
        if (auswahlAufraeumen) { auswahlAufraeumen(); auswahlAufraeumen = null; }
        if (nr >= anzahl) return schluss();
        nr++;
        const a = ziehe();
        aktuell = a;
        let versuche = 0, gelost = false;
        const t0 = Date.now();
        const rechner = rechnerFuer(eintrag, a.stufe);
        rechnerBenutzt = false;
        if (!rechner || rechner === "ohne") rechnerEl.hidden = true;
        fortschritt.textContent = (endlos ? `Serie: ${punkte} richtig` : `Aufgabe ${nr} von ${anzahl}`) + (rechner ? ` · ${RECHNER_TEXT[rechner]}` : "");
        aufgabeFeld.replaceChildren(...[el("span", { class: a.text.length > 36 ? "term lang" : "term", text: a.text, lang: eintrag.sprache }), a.darstellung ? darstellung(a.darstellung) : null].filter(Boolean));
        rueck.replaceChildren();
        rueck.className = "rueckmeldung";
        const feld = el("input", { class: "eingabe", type: "text", inputmode: "text", autocomplete: "off", spellcheck: "false", "aria-label": "Ergebnis" });
        const ok = el("button", { type: "button", class: "knopf haupt", text: "Prüfen" });
        const termAntwort = a.art === "term";
        const minus = termAntwort ? null : el("button", { type: "button", class: "knopf", text: "±", "aria-label": "Vorzeichen wechseln", title: "Vorzeichen wechseln" });
        // Hilfstasten für Term-Antworten (a.tasten, etwa ["a", "b", "²", "(", ")"]): fügen an der Schreibmarke ein
        const hilfe = termAntwort && a.tasten ? el("div", { class: "term-tasten", role: "group", "aria-label": "Zeichen einfügen" },
          a.tasten.map(t => el("button", { type: "button", class: "knopf klein-knopf", text: t, onclick: () => {
            const p = feld.selectionStart ?? feld.value.length, q = feld.selectionEnd ?? p;
            feld.value = feld.value.slice(0, p) + t + feld.value.slice(q);
            feld.focus(); feld.setSelectionRange(p + t.length, p + t.length);
          } }))) : null;
        aktuellesFeld = feld;
        const rechnerKnopf = rechnerFeld && rechner && rechner !== "ohne"
          ? el("button", { type: "button", class: "knopf rechner-knopf", text: "Rechner", "aria-pressed": String(!rechnerEl.hidden), onclick: () => {
              rechnerEl.hidden = !rechnerEl.hidden;
              rechnerKnopf.setAttribute("aria-pressed", String(!rechnerEl.hidden));
              if (!rechnerEl.hidden) { rechnerBenutzt = true; rechnerEl.focus(); }
            } })
          : null;
        if (!rechnerEl.hidden) rechnerBenutzt = true;
        // Optional vor und nach dem Feld: „x =“, Einheit „m²“ (a.vor, a.einheit)
        const feldGruppe = el("span", { class: "feld-gruppe" },
          a.vor ? el("span", { class: "feld-vor", text: a.vor }) : null, feld, a.einheit ? el("span", { class: "feld-nach", text: a.einheit }) : null);
        // Auswahl (a.art === "auswahl"): Knöpfe statt Eingabefeld, Kurztasten 1 … n
        const auswahl = a.art === "auswahl";
        let auswahlKnoepfe = [];
        if (auswahl) {
          aktuellesFeld = null;
          auswahlKnoepfe = a.optionen.map((o, i) => el("button", { type: "button", class: "knopf wahl", "data-taste": String(i + 1), lang: eintrag.sprache, onclick: () => pruefe(i) },
            el("span", { class: "wahl-taste", text: String(i + 1), "aria-hidden": "true" }), el("span", { text: o })));
          antwort.replaceChildren(...[el("div", { class: "wahl-liste", role: "group", "aria-label": "Antworten" }, auswahlKnoepfe), rechnerKnopf].filter(Boolean));
          const taste = e => {
            if (gelost || e.target.closest(".rechner")) return;
            const n = Number(e.key);
            if (n >= 1 && n <= auswahlKnoepfe.length && !auswahlKnoepfe[n - 1].disabled) { e.preventDefault(); pruefe(n - 1); }
          };
          document.addEventListener("keydown", taste);
          const weg = () => document.removeEventListener("keydown", taste);
          auswahlAufraeumen = weg;
        } else {
          antwort.replaceChildren(...[minus, feldGruppe, ok, rechnerKnopf, hilfe].filter(Boolean));
        }
        if (termAntwort) feld.classList.add("term-eingabe");
        if (!auswahl) feld.focus();
        if (minus) minus.onclick = () => { const v = feld.value.trim(); feld.value = /^[-−]/.test(v) ? v.replace(/^[-−]\s*/, "") : LST.MINUS + v; feld.focus(); };
        const pruefe = (wahlIndex) => {
          if (gelost) return;
          let wert, richtig;
          if (auswahl) {
            if (typeof wahlIndex !== "number") return;
            wert = a.optionen[wahlIndex];
            richtig = wahlIndex === a.richtig;
            if (!richtig) { auswahlKnoepfe[wahlIndex].disabled = true; auswahlKnoepfe[wahlIndex].classList.add("falsch"); }
            else auswahlKnoepfe[wahlIndex].classList.add("richtig");
          } else if (termAntwort) {
            // Term: gleichwertig und in der verlangten Form (LST_TERME.bewerte). Stimmt nur die Form nicht,
            // zählt das nicht als Fehlversuch.
            const r = LST_TERME.bewerte(feld.value, a);
            if (!r.lesbar || (r.gleichwertig && !r.ok)) { zeige("hinweis", r.meldung); feld.focus(); return; }
            wert = feld.value.trim();
            richtig = r.ok;
          } else {
            wert = LST.leseZahl(feld.value);
            if (wert === null) { zeige("hinweis", "Bitte eine Zahl eingeben."); feld.focus(); return; }
            richtig = Math.abs(wert - a.antwort) <= (a.toleranz || 0) + 1e-9; // toleranz: gerundete Ergebnisse (π)
          }
          if (richtig) {
            gelost = true;
            ergebnis.zeiten.push(Date.now() - t0);
            if (versuche === 0) ergebnis.aufAnhieb++;
            if (endlos) punkte++;
            notiere(false);
            zeige("gut", versuche === 0 ? "Richtig." : "Jetzt stimmt es.", a.weg);
            weiterKnopf(endlos ? 700 : 1200);
            return;
          }
          versuche++;
          ergebnis.fehler++;
          const eintragFalsch = ergebnis.falsch.find(f => f.text === a.text) || (ergebnis.falsch.push({ text: a.text, eingaben: [] }), ergebnis.falsch[ergebnis.falsch.length - 1]);
          eintragFalsch.eingaben.push(typeof wert === "number" ? LST.dezimalText(wert) : wert);
          if (endlos) { gelost = true; notiere(false); zeige("hinweis", `Nicht ganz. Richtig wäre ${a.loesung}.`, a.weg); weiterKnopf(null, true); return; }
          if (versuche >= 3) {
            gelost = true;
            ergebnis.gezeigt++;
            ergebnis.zeiten.push(Date.now() - t0);
            notiere(true);
            zeige("hinweis", `Die Lösung ist ${a.loesung}.`, a.weg);
            weiterKnopf(null);
            return;
          }
          zeige("hinweis", fn.hinweis(a, wert));
          if (!auswahl) feld.select();
        };
        function notiere(gezeigt) {
          ergebnis.liste.push({ lp: a.stufe, versuche, gezeigt, rechner: rechnerBenutzt });
          if (rechnerBenutzt) ergebnis.mitRechner = true;
        }
        ok.onclick = () => pruefe();
        feld.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); pruefe(); } });
      }

      function zeige(art, text, weg) {
        rueck.className = "rueckmeldung " + art;
        rueck.replaceChildren(...[el("p", { text }), weg ? el("p", { class: "weg", text: weg }) : null].filter(Boolean));
      }

      function weiterKnopf(autoMs, ende) {
        const knopf = el("button", { type: "button", class: "knopf haupt weiter", text: ende ? "Zum Ergebnis" : "Weiter" });
        let timer = null;
        const los = () => { clearTimeout(timer); document.removeEventListener("keydown", taste); ende ? schluss() : naechste(); };
        const taste = e => { if (e.key === "Enter") { e.preventDefault(); los(); } };
        knopf.onclick = los;
        antwort.replaceChildren(knopf);
        knopf.focus();
        setTimeout(() => document.addEventListener("keydown", taste), 0);
        if (autoMs) timer = setTimeout(los, autoMs);
        if (ende) speichereSerie();
      }

      function speichereSerie() {
        if (vorbei) return;
        vorbei = true;
        aufraeumen();
        if (endlos && punkte > 0) speichereRekord({ id: rundeId, person: k.id, zeit: new Date(start).toISOString(), inhalt: def.id, stufe: st, niveau, punkte, dauer: sekunden(Date.now() - start), mitRechner: ergebnis.mitRechner });
        protokolliere({
          id: rundeId, person: k.id, zeit: new Date(start).toISOString(), inhalt: def.id, fach: fach.id, stufe: st, niveau,
          endlos, aufgaben: nr, aufAnhieb: ergebnis.aufAnhieb, fehler: ergebnis.fehler, gezeigt: ergebnis.gezeigt,
          dauer: sekunden(Date.now() - start), zeiten: ergebnis.zeiten, falsch: ergebnis.falsch, liste: ergebnis.liste, mitRechner: ergebnis.mitRechner, gruppe: null,
        });
      }

      function schluss() {
        if (auswahlAufraeumen) { auswahlAufraeumen(); auswahlAufraeumen = null; }
        speichereSerie();
        aktuell = null;
        const dauer = sekunden(Date.now() - start);
        fortschritt.textContent = "Ergebnis";
        aufgabeFeld.replaceChildren();
        rueck.className = "rueckmeldung";
        // Bestzeit zählt nur Runden ohne gezeigte Lösung; Rekord ist die längste Serie.
        // Verglichen wird mit derselben Seite: mit oder ohne Rechner (RE1 a).
        const mit = ergebnis.mitRechner, seite = mit ? " mit Rechner" : "";
        const bz = bestzeitVorher[mit], rk = rekordVorher[mit];
        const neueBestzeit = ergebnis.gezeigt === 0 && (bz === null || dauer < bz);
        const zeilen = endlos
          ? [`${punkte} richtig in Folge${seite}`, punkte > rk ? "Neuer Rekord." : `Rekord${seite}: ${rk}`]
          : [`${ergebnis.aufAnhieb} von ${nr} auf Anhieb richtig`, `Zeit${seite}: ${dauerText(dauer)}`,
            neueBestzeit ? "Neue Bestzeit." : (bz !== null ? `Bestzeit${seite}: ${dauerText(bz)}` : "")];
        rueck.replaceChildren(el("div", { class: "ergebnis" }, zeilen.filter(Boolean).map(t => el("p", { text: t }))));
        antwort.replaceChildren(
          el("button", { type: "button", class: "knopf haupt", text: "Nochmal", onclick: () => runde(st, endlos) }),
          el("button", { type: "button", class: "knopf", text: "Andere Stufe", onclick: stufenwahl }));
      }

      naechste();
    }
  }

  // ---------- Darstellungen zu einer Aufgabe (Tabelle, Graph) ----------
  /**
   * a.darstellung = { art: "tabelle", kopf: ["x", "y"], zeilen: [[0, 1], …] } (Werte als Zahlen, null = leer „?“)
   *               | { art: "graph", m, b, x: [min, max], y: [min, max], schritt?: 1 } — Gerade y = m·x + b im Gitter.
   */
  function darstellung(d) {
    if (d.art === "tabelle") {
      const zelle = (w, kopf) => el(kopf ? "th" : "td", { text: w === null ? "?" : (typeof w === "number" ? LST.dezimalText(w) : w) });
      return el("table", { class: "werte-tabelle" },
        el("tbody", {}, d.kopf.map((k, i) => el("tr", {}, zelle(k, true), d.zeilen.map(z => zelle(z[i]))))));
    }
    if (d.art === "graph") return graph(d);
    return null;
  }

  function graph(d) {
    const NS = "http://www.w3.org/2000/svg";
    const s = (tag, attr, text) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attr)) e.setAttribute(k, v); if (text !== undefined) e.textContent = text; return e; };
    const [x0, x1] = d.x, [y0, y1] = d.y, schritt = d.schritt || 1, schrittY = d.schrittY || schritt; // schrittY, hoehe: eigener Massstab der y-Achse
    const rand = 28, breite = 300, hoehe = d.hoehe || Math.round(breite * (y1 - y0) / (x1 - x0));
    const px = x => rand + (x - x0) / (x1 - x0) * breite, py = y => rand + (y1 - y) / (y1 - y0) * hoehe;
    const svg = s("svg", { viewBox: `0 0 ${breite + 2 * rand} ${hoehe + 2 * rand}`, class: "graph", role: "img", "aria-label": "Graph einer Geraden im Koordinatensystem" });
    for (let x = x0; x <= x1; x += schritt) svg.append(s("line", { x1: px(x), y1: py(y0), x2: px(x), y2: py(y1), class: "gitter" }));
    for (let y = y0; y <= y1; y += schrittY) svg.append(s("line", { x1: px(x0), y1: py(y), x2: px(x1), y2: py(y), class: "gitter" }));
    if (y0 <= 0 && y1 >= 0) svg.append(s("line", { x1: px(x0), y1: py(0), x2: px(x1), y2: py(0), class: "achse" }));
    if (x0 <= 0 && x1 >= 0) svg.append(s("line", { x1: px(0), y1: py(y0), x2: px(0), y2: py(y1), class: "achse" }));
    const beschr = Math.max(schritt, Math.ceil((x1 - x0) / 10 / schritt) * schritt);
    for (let x = x0; x <= x1; x += beschr) svg.append(s("text", { x: px(x), y: py(Math.max(y0, Math.min(y1, 0))) + 14, class: "beschriftung", "text-anchor": "middle" }, LST.zahlText(x)));
    for (let y = y0; y <= y1; y += (d.beschrY || beschr)) if (y !== 0) svg.append(s("text", { x: px(Math.max(x0, Math.min(x1, 0))) - 5, y: py(y) + 4, class: "beschriftung", "text-anchor": "end" }, LST.zahlText(y)));
    svg.append(s("text", { x: px(x1) - 2, y: py(Math.max(y0, Math.min(y1, 0))) - 5, class: "beschriftung achsname", "text-anchor": "end" }, d.xName || "x"));
    svg.append(s("text", { x: px(Math.max(x0, Math.min(x1, 0))) + 6, y: py(y1) + 12, class: "beschriftung achsname" }, d.yName || "y"));
    // Gerade, auf das Gitterfeld zugeschnitten
    const punkte = [];
    for (const x of [x0, x1]) punkte.push([x, d.m * x + d.b]);
    if (d.m !== 0) for (const y of [y0, y1]) punkte.push([(y - d.b) / d.m, y]);
    const innen = punkte.filter(([x, y]) => x >= x0 - 1e-9 && x <= x1 + 1e-9 && y >= y0 - 1e-9 && y <= y1 + 1e-9).sort((p, q) => p[0] - q[0]);
    if (typeof d.m === "number" && innen.length >= 2) svg.append(s("line", { x1: px(innen[0][0]), y1: py(innen[0][1]), x2: px(innen[innen.length - 1][0]), y2: py(innen[innen.length - 1][1]), class: "gerade" }));
    // Punkte mit Namen (d.punkte = [{ x, y, name }]), wahlweise als Vieleck verbunden (d.vieleck)
    if (d.punkte) {
      if (d.vieleck) svg.append(s("polygon", { points: d.punkte.map(p => `${px(p.x)},${py(p.y)}`).join(" "), class: "vieleck" }));
      for (const p of d.punkte) {
        svg.append(s("circle", { cx: px(p.x), cy: py(p.y), r: 4, class: "punkt" }));
        if (p.name) svg.append(s("text", { x: px(p.x) + 6, y: py(p.y) - 6, class: "punktname" }, p.name));
      }
    }
    return svg;
  }

  // Für das Testskript: die gerade gestellte Aufgabe (nur lesen).
  let aktuell = null;
  const pruefung = { aufgabe: () => aktuell };

  Object.assign(LST, { el, FREIGABE, sperrGrund, uebungSichtbar, werUebt, konto, speichereKonto, kompetenzstand, standMarke, serie: wochenSerie, serieText, niveauFuer, setzeNiveau, niveauName, stufeInfo, runden, bestwert, bestzeit, dauerText, uebung, pruefung });
})(LST);
