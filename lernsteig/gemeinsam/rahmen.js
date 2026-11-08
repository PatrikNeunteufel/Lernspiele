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
  // ---------- Entwickler-Modus (Kern kern/entwicklung.js seit 1.9.0; Plan C6, E1 a) ----------
  // Wie im Eulenpfad: die angemeldete Aufsicht schaltet ihn mit dem Entwickler-Schlüssel frei (Aufsichtsseite →
  // Entwicklung); in den Übungen dann eine Leiste mit „Übung angesehen“ und „Bemerkung“. Geschrieben wird nur über den
  // Entwickler-Server: Prüfstand nach gemeinsam/pruefstand.js, Bemerkungen nach docs/lernsteig/bemerkungen.json.
  const aufsichtDa = () => (typeof LST_KONTEN !== "undefined" ? LST_KONTEN.aufsichtAktiv() : null);
  const ENTWICKLUNG = KERN.entwicklung({
    app: "lernsteig", speicher: { praefix: LST.PRAEFIX, lies: LST.lies, schreibe: LST.schreibe },
    aufsicht: () => !!aufsichtDa(), name: () => (aufsichtDa() || {}).name || "",
    pruefstand: typeof LST_PRUEFSTAND !== "undefined" ? LST_PRUEFSTAND : null, arten: ["uebungen", "listen"],
    melde: text => alert(text), start: "lernsteig/",
  });
  /** Leiste der Entwicklung unten in einer Übung (nur wenn der Modus an ist). stufe() liefert die gewählte Stufe. */
  function entwicklerLeiste(id, stufe) {
    if (!ENTWICKLUNG.aktiv()) return;
    const leiste = el("aside", { class: "entwickler-leiste", "aria-label": "Entwicklung" });
    document.body.append(leiste);
    let feld = null;
    async function zeichne() {
      const da = await ENTWICKLUNG.server();
      const g = FREIGABE.geprueft(id), grund = sperrGrund(id);
      // null weglassen (ohne Bemerkungsfeld): das eingebaute replaceChildren schriebe es als Text „null“
      leiste.replaceChildren(...[el("b", { text: "🛠 Entwicklung" }),
        el("span", { class: "leise", text: da ? "Server verbunden" : ENTWICKLUNG.fremd() ? "⚠ falscher Server auf diesem Port" : "⚠ Server nicht gefunden" }),
        el("span", { text: g ? `✓ angesehen ${g.am}${g.von ? " · " + g.von : ""}` : "noch nicht angesehen" }),
        el("span", { class: "leise", text: grund ? `Jugendliche sehen sie nicht: ${grund}` : "für Jugendliche frei" }),
        el("button", { type: "button", class: "knopf", "data-aktion": "angesehen", text: g ? "Markierung aufheben" : "✓ Übung angesehen",
          onclick: async () => { if (await ENTWICKLUNG.setzeGeprueft("uebungen", id, !g)) zeichne(); } }),
        el("button", { type: "button", class: "knopf", "data-aktion": "bemerkung", text: "📝 Bemerkung", onclick: () => { feld = feld ? null : bemerkungsFeld(); zeichne(); } }),
        feld].filter(Boolean));
    }
    function bemerkungsFeld() {
      const text = el("textarea", { rows: "3", class: "textfeld", placeholder: "Was stimmt nicht oder soll anders werden?", "aria-label": "Bemerkung" });
      const meldung = el("span", { class: "leise", role: "status" });
      setTimeout(() => text.focus(), 0);
      return el("div", { class: "entwickler-feld" }, text, el("div", { class: "knopf-zeile" },
        el("button", { type: "button", class: "knopf haupt", "data-aktion": "senden", text: "Senden", onclick: async () => {
          if (!text.value.trim()) { meldung.textContent = "Bitte etwas eintragen."; return; }
          const b = await ENTWICKLUNG.bemerkung({ text: text.value, inhalt: id, stufe: stufe() || undefined });
          if (b) { meldung.textContent = `✓ Bemerkung Nr. ${b.nr} gespeichert.`; text.value = ""; setTimeout(() => { feld = null; zeichne(); }, 900); }
        } }),
        el("button", { type: "button", class: "knopf", text: "Abbrechen", onclick: () => { feld = null; zeichne(); } }), meldung));
    }
    zeichne();
  }

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
  const TAB_FELDER = ["niveau", "lehrplan", "pruefungsziel", "rechnerModell", "favoriten", "zu", "ansicht", "sortierung", "filterZu"]; // ab favoriten: Tab Übungen (Plan C3)
  function tabKonto() { try { return JSON.parse(sessionStorage.getItem(TAB_KONTO)) || null; } catch (e) { return null; } }
  function konto() {
    const wer = werUebt();
    const a = wer === "aufsicht" ? LST_KONTEN.aufsichtAktiv() : null;
    const standard = { id: a ? a.id : "gast", name: a ? a.name : "Gast", niveau: {}, lehrplan: { land: "CH", kanton: null }, pruefungsziel: "keins", rechnerModell: "allgemein", favoriten: [], zu: [], ansicht: "kacheln" };
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
  /** Aufgaben einer Lehrplan-Stufe aus dem Protokoll, älteste zuerst, je mit der Zeit ihrer Runde. */
  const stufenAufgaben = (kontoId, uebungId, lp) => runden(r => r.person === kontoId && r.inhalt === uebungId)
    .flatMap(r => (r.liste || []).filter(x => x.lp === lp).map(x => Object.assign({ zeit: r.zeit }, x)));
  const alsStand = l => l.map(x => ({ anhieb: x.versuche === 0, gezeigt: !!x.gezeigt }));
  // Wackel-Stufe (Entscheid W1 a, LERN_Session21): mindestens 5 Aufgaben, von den letzten (höchstens 10) weniger als 70 %
  // auf Anhieb — mit und ohne Rechner zusammen, auch wenn die Stufe früher sicher war. Misst Unsicherheit, nicht Neuheit.
  const WACKEL = { mindestens: 5, fenster: 10, schwelle: 0.7 };
  function wackelt(kontoId, uebungId, lp) {
    const s = KERN.auswertung.stand(alsStand(stufenAufgaben(kontoId, uebungId, lp)), { fenster: WACKEL.fenster });
    return s.n >= WACKEL.mindestens && s.quote < WACKEL.schwelle;
  }
  /** Bedarf einer Stufe (Kern-Regel wie im Eulenpfad): wackelnd hoch, nie geübt 2, sicher kürzlich 0.5, nach 7 Tagen 2. */
  function stufenBedarf(kontoId, uebungId, lp, jetzt = Date.now()) {
    const l = stufenAufgaben(kontoId, uebungId, lp);
    if (!l.length) return KERN.auswertung.bedarf(null, 0);
    const s = KERN.auswertung.stand(alsStand(l), { fenster: WACKEL.fenster });
    return KERN.auswertung.bedarf(s.quote, (jetzt - Date.parse(l[l.length - 1].zeit)) / KERN.auswertung.TAG_MS, { schwelle: WACKEL.schwelle });
  }
  function kompetenzstand(kontoId, uebungId, lp) {
    const liste = stufenAufgaben(kontoId, uebungId, lp);
    // Regel im Kern (KERN.auswertung.stand, AW2 a: eine Regel für beide Apps, Schwellen je App)
    const bewerte = l => {
      const s = KERN.auswertung.stand(l.map(x => ({ anhieb: x.versuche === 0, gezeigt: !!x.gezeigt })),
        { fenster: STAND.fenster, mindestens: STAND.minAufgaben, schwelle: STAND.anhieb, ohneGezeigt: true });
      return { n: s.n, anhieb: s.anhieb, fenster: s.imFenster, sicher: s.sicher };
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

  // Notizblock für eigene Rechenwege (NB1 a, NB2 a; Kern kern/notizblock.js): Dezimalzeichen wie in der Übung, ohne Ton
  // Rechner und Notizblock teilen sich den Platz am Bildrand (RP1 a): erscheint der eine gross, wird der andere auf seine
  // Kopfzeile verkleinert, nicht geschlossen — Inhalt und Ans bleiben.
  let rechnerFenster = null; // { verkleinern } der laufenden Runde
  const NOTIZBLOCK = KERN.notizblock({ dezimal: LST.dezimalZeichen, vorn: () => { if (rechnerFenster) rechnerFenster.verkleinern(); } });

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
  // Runden und Rekorde im gemeinsamen Format der Reihe (R1 a, kern/runden.js; Ablauf KERN.runde): { id, person, zeit (Ende,
  // RA1 a), inhalt, stufe, dauer (0,1 s), liste (je Aufgabe, RA4 a), … }; gespeicherte älterer Fassungen (konto/uebung bis
  // LERN_Session15; zeit = Beginn, zeiten/falsch bis LERN_Session18) werden beim Laden umgedeutet (LST.alteEintraegeUmdeuten).
  {
    const runden = LST.lies("runden", []), rekorde = LST.lies("rekorde", []);
    if (Array.isArray(runden) && Array.isArray(rekorde)) {
      const u = LST.alteEintraegeUmdeuten({ runden, rekorde });
      if (u.geaendert) { LST.schreibe("runden", u.runden); LST.schreibe("rekorde", u.rekorde); }
    }
  }
  // Gast: nichts gespeichert (C2 a). Aufsicht: Runde und Rekord als Test (zählen nicht für einen Jugendlichen).
  const merkt = () => werUebt() !== "gast";
  const alsTest = e => (werUebt() === "aufsicht" ? Object.assign(e, { test: true }) : e);
  /** Runde speichern; gleiche Kennung ersetzt einen Zwischenstand derselben Serie (RA3 a). */
  function protokolliere(runde) { if (!merkt()) return; LST.schreibe("runden", KERN.runde.eintragen(LST.lies("runden", []), alsTest(runde))); }
  function runden(filter) { return LST.lies("runden", []).filter(filter || (() => true)); }

  /** Rekord speichern oder ersetzen (gleiche Kennung = Zwischenstand derselben Serie; KERN.runde). */
  function speichereRekord(rekord) {
    if (!merkt()) return;
    LST.schreibe("rekorde", KERN.runde.rekordEintragen(LST.lies("rekorde", []), alsTest(rekord)));
  }
  // Die Aufgaben einer Stufe hängen nicht am Niveau (ST1 a); Rekord und Bestzeit gelten darum je Stufe.
  // Mit und ohne Rechner getrennt (RE1 a): mit = true/false wählt eine Seite, undefined nimmt beide.
  const passtRechner = (r, mit) => mit === undefined || !!r.mitRechner === mit;
  const gleicheStufe = (kontoId, uebung, stufe, mit) => r => r.person === kontoId && r.inhalt === uebung && r.stufe === stufe && passtRechner(r, mit);
  const bestwert = (kontoId, uebung, stufe, mit) => KERN.runde.bestwert(LST.lies("rekorde", []), gleicheStufe(kontoId, uebung, stufe, mit));
  /** Bestzeit: nur volle Runden ohne gezeigte Lösung, keine Serie (KERN.runde.bestzeit, RA6 a). */
  const bestzeit = (kontoId, uebung, stufe, mit) => KERN.runde.bestzeit(runden(), gleicheStufe(kontoId, uebung, stufe, mit));

  /**
   * Rechner einer Lehrplan-Stufe (TR1 a): Vorgabe der Übung, überstimmt von der Einstellung der Aufsicht
   * `einstellungen.rechner`: "uebung" (Standard), "ohne" (Rechner überall gesperrt), "erlaubt" (überall erlaubt).
   * Eine Aufgabe mit `rechner` ("mit") überstimmt die Vorgabe ihrer Stufe (E1-4 a), nicht aber die Sperre der Aufsicht.
   */
  function rechnerFuer(eintrag, lp, aufgabe) {
    if (!eintrag.rechner) return null; // Übung ohne Rechner-Angabe (etwa Deutsch): kein Rechner, kein Hinweis
    const vorgabe = (aufgabe && aufgabe.rechner) || eintrag.rechner[lp] || "frei";
    const aufsicht = LST.lies("einstellungen", {}).rechner || "uebung";
    if (aufsicht === "ohne") return "ohne";
    if (aufsicht === "erlaubt" && vorgabe === "ohne") return "frei";
    return vorgabe;
  }

  // Gedächtnis gegen Wiederholungen (RA5 a, KERN.runde.gedaechtnis): je Konto, Übung und Stufe ein Durchgang über Runden
  // und Serien — eine Aufgabe erst wieder, wenn alle der Stufe dran waren. Ohne Niveau (ST1 a). Nur dieses Gerät; der Gast
  // merkt sich nur in dieser Seite (C2 a: nichts gespeichert). Die Fenster der letzten 30 von vor LERN_Session19 (Schlüssel
  // „Konto/Übung/Stufe/Niveau“ mit den Kennungen selbst) gelten nicht mehr und werden entfernt.
  {
    const g = LST.lies("gestellt", {});
    if (g && typeof g === "object" && Object.keys(g).some(s => !s.includes("|"))) LST.schreibe("gestellt", Object.fromEntries(Object.entries(g).filter(([s]) => s.includes("|"))));
  }
  const nurHier = (() => { const d = {}; return { lies: (k, s) => (k in d ? d[k] : s), schreibe: (k, v) => { d[k] = v; } }; })();
  const gedaechtnisFuer = (kontoId, uebung, stufe) => KERN.runde.gedaechtnis({
    speicher: merkt() ? { lies: LST.lies, schreibe: LST.schreibe } : nurHier, schluessel: `${kontoId}|${uebung}/${stufe}` });

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
      el("a", { class: "zurueck", href: "../../index.html", text: "← Übersicht" }), titel, info,
      // Ähnliche Übungen (Plan C3 Schritt 3, wie „🔗 Ähnliche Spiele“ im Eulenpfad): die Liste im Tab Übungen
      el("a", { class: "zurueck aehnlich-link", href: `../../index.html?aehnlich=${encodeURIComponent(eintrag.id)}#uebungen`, text: "Ähnliche Übungen →" }));
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
    entwicklerLeiste(def.id, () => new URLSearchParams(location.search).get("stufe"));
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
      const anzahl = endlos ? Infinity : eintrag.anzahl;
      // Ablauf im Kern (KERN.runde.lauf, AR1 a): Versuche, Fehler, Lösung nach dem dritten Fehlversuch, Ende der Serie,
      // Zeit je Aufgabe, Eintrag und Rekord. Hier bleiben Oberfläche, Prüfen der Antwort und Rechner.
      const L = KERN.runde.lauf({ endlos, anzahl });
      // Auswahl der Aufgaben (RA5 a, RA6 a): keine zweimal, solange die Stufe neue hergibt; über Runden ein Durchgang.
      // Ist die Stufe erschöpft, endet die Runde früher (gekuerzt) bzw. die Serie mit „alles geschafft“.
      const wahl = KERN.runde.auswahl({ gedaechtnis: gedaechtnisFuer(k.id, def.id, st), endlos });
      // Bestwerte vor dieser Runde, für den Vergleich im Ergebnis
      const rekordVorher = { true: bestwert(k.id, def.id, st, true), false: bestwert(k.id, def.id, st, false) };
      const bestzeitVorher = { true: bestzeit(k.id, def.id, st, true), false: bestzeit(k.id, def.id, st, false) };
      let nr = 0, vorbei = false;
      const mitRechner = () => L.liste.some(x => x.rechner);
      const felder = () => ({ person: k.id, inhalt: def.id, stufe: st, niveau, mitRechner: mitRechner() });
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
      // Der Rechner steht wie der Notizblock am Bildrand (Hinweis Patrik, LERN_Session21; Platz NB4 a in stil.css): ab
      // 1100 px rechts neben der Aufgabe, auf dem Tablet quer schmaler rechts, sonst unten. Kopfzeile wie beim Block.
      const fenster = rechnerFenster = (() => {
        const panel = el("aside", { class: "rechner-fenster", role: "dialog", "aria-label": "Rechner", hidden: true });
        let knopf = null; // Knopf „Rechner“ der aktuellen Aufgabe
        const melde = () => { if (knopf) knopf.setAttribute("aria-pressed", String(!panel.hidden && !panel.classList.contains("klein"))); };
        const klasse = () => { document.body.classList.toggle("mit-rechner", !panel.hidden); document.body.classList.toggle("rechner-klein", !panel.hidden && panel.classList.contains("klein")); melde(); };
        const gross = () => {
          panel.hidden = false; panel.classList.remove("klein"); klasse(); rechnerBenutzt = true;
          if (NOTIZBLOCK.istOffen() && !NOTIZBLOCK.istKlein()) NOTIZBLOCK.verkleinern();
          rechnerEl.focus();
        };
        const verkleinern = () => { if (!panel.hidden) { panel.classList.add("klein"); klasse(); } };
        const schliessen = () => { panel.hidden = true; panel.classList.remove("klein"); klasse(); };
        panel.append(el("div", { class: "rf-kopf" }, el("b", { text: "🧮 Rechner" }),
          el("button", { type: "button", class: "rf-zu", "aria-label": "Rechner verkleinern", title: "Verkleinern", text: "▁", "data-aktion": "rechner-klein",
            onclick: () => (panel.classList.contains("klein") ? gross() : verkleinern()) }),
          el("button", { type: "button", class: "rf-zu", "aria-label": "Rechner schliessen", title: "Schliessen", text: "✕", "data-aktion": "rechner-zu", onclick: schliessen })),
          el("div", { class: "rf-inhalt" }, rechnerEl));
        document.body.append(panel);
        return { panel, gross, verkleinern, schliessen, offen: () => !panel.hidden, istGross: () => !panel.hidden && !panel.classList.contains("klein"),
          knopf: k => { knopf = k; melde(); }, weg: () => { panel.remove(); document.body.classList.remove("mit-rechner", "rechner-klein"); if (rechnerFenster === fenster) rechnerFenster = null; } };
      })();
      buehne.replaceChildren(fortschritt, aufgabeFeld, antwort, rueck);

      // Serie mitten drin verlassen: Stand bis dahin zählt (abgeschaut vom Eulenpfad, Entscheid E1 a dort), als Rekord und
      // Runde (RA3 a); das Ende ersetzt beide (gleiche Kennung).
      const zwischenstand = () => {
        if (!endlos || vorbei || L.geschafft === 0) return;
        speichereRekord(L.rekord(felder(), { abgebrochen: true }));
        protokolliere(L.eintrag({ ...felder(), fach: fach.id, aufAnhieb: L.liste.filter(KERN.runde.aufAnhieb).length, gruppe: null }, { abgebrochen: true }));
      };
      const waechter = KERN.runde.waechter(zwischenstand);
      const aufraeumen = () => waechter.aus();

      /** Nächste Aufgabe nach der Auswahl des Kerns, oder null, wenn die Stufe erschöpft ist. */
      function ziehe() {
        wahl.neueSuche();
        for (let v = 0; ; v++) {
          const a = fn.aufgabeErzeugen(lpStufe(), niveau);
          const r = wahl.pruefe(a.kennung, a.serien, v);
          if (r.nehmen) return a;
          if (r.erschoepft) return null;
        }
      }

      let auswahlAufraeumen = null;
      function naechste() {
        if (auswahlAufraeumen) { auswahlAufraeumen(); auswahlAufraeumen = null; }
        if (L.vorbei) return schluss();
        const a = ziehe();
        if (!a) { L.erschoepft(); return schluss(); }
        nr++;
        aktuell = a;
        let gelost = false;
        L.gestellt({ text: a.text, loesung: a.loesung });
        const rechner = rechnerFuer(eintrag, a.stufe, a);
        rechnerBenutzt = false;
        if (!rechner || rechner === "ohne") fenster.schliessen();
        fortschritt.textContent = (endlos ? `Serie: ${L.geschafft} richtig` : `Aufgabe ${nr} von ${anzahl}`) + (rechner ? ` · ${RECHNER_TEXT[rechner]}` : "");
        aufgabeFeld.replaceChildren(...[el("span", { class: a.text.length > 36 ? "term lang" : "term", text: a.text, lang: eintrag.sprache }), a.darstellung ? darstellung(a.darstellung) : null].filter(Boolean));
        rueck.replaceChildren();
        rueck.className = "rueckmeldung";
        // Die Tastatur des Geräts bleibt zu (inputmode none), getippt wird mit dem Tastenfeld darunter (TF1 a, KERN.tastenfeld);
        // eine echte Tastatur schreibt weiter ins Feld
        const feld = el("input", { class: "eingabe", type: "text", inputmode: "none", autocomplete: "off", spellcheck: "false", "aria-label": "Ergebnis" });
        const ok = el("button", { type: "button", class: "knopf haupt tf-pruefen", text: "Prüfen" });
        const termAntwort = a.art === "term";
        // Welche Tasten: LST.antwortTasten (Zahl: Ziffern, Komma, ⌫, ±; Term: dazu Variablen und Zeichen der Aufgabe)
        const tasten = LST.antwortTasten(a);
        const tastenfeld = KERN.tastenfeld({ tasten, ziel: () => feld, klasse: `tastenfeld antwort-tasten${termAntwort ? " term-tasten" : ""}`, label: "Tasten für die Antwort" }).element;
        tastenfeld.append(ok);
        aktuellesFeld = feld;
        const rechnerKnopf = rechnerFeld && rechner && rechner !== "ohne"
          ? el("button", { type: "button", class: "knopf rechner-knopf", text: "Rechner", onclick: () => (fenster.istGross() ? fenster.schliessen() : fenster.gross()) })
          : null;
        fenster.knopf(rechnerKnopf);
        if (fenster.istGross()) rechnerBenutzt = true;
        // Optional vor und nach dem Feld: „x =“, Einheit „m²“ (a.vor, a.einheit)
        const feldGruppe = el("span", { class: "feld-gruppe" },
          a.vor ? el("span", { class: "feld-vor", text: a.vor }) : null, feld, a.einheit ? el("span", { class: "feld-nach", text: a.einheit }) : null);
        // Auswahl (a.art === "auswahl"): Knöpfe statt Eingabefeld, Kurztasten 1 … n
        const auswahl = a.art === "auswahl";
        // Notizblock für eigene Rechenwege (NB2 a, KERN.notizblock): bei jeder Zahl-Antwort, mit und ohne Rechner, ausser
        // die Übung schaltet ihn im Katalog ab; jede Aufgabe beginnt mit leerem Block; nichts wird bewertet
        NOTIZBLOCK.schliessen();
        const mitBlock = !auswahl && !termAntwort && eintrag.notizblock !== false;
        let blockBenutzt = false;
        // Vorlagen je Übung (Katalog notizblock: […], GL1 a); die Gleichung der Aufgabe steht dann oben im Block
        const vorlagen = Array.isArray(eintrag.notizblock) ? eintrag.notizblock : null;
        const gleichung = vorlagen && vorlagen.includes("=") ? a.gleichung || "" : "";
        const blockKnopf = mitBlock ? NOTIZBLOCK.knopf(() => { blockBenutzt = true; }, { klasse: "knopf", vorlagen, gleichung }) : null;
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
          antwort.replaceChildren(...[feldGruppe, rechnerKnopf, blockKnopf, tastenfeld].filter(Boolean));
        }
        if (termAntwort) feld.classList.add("term-eingabe");
        if (!auswahl) feld.focus();
        const pruefe = (wahlIndex) => {
          if (gelost) return;
          let wert, richtig;
          if (auswahl) {
            if (typeof wahlIndex !== "number") return;
            wert = a.optionen[wahlIndex];
            richtig = wahlIndex === a.richtig;
            if (!richtig) { auswahlKnoepfe[wahlIndex].disabled = true; auswahlKnoepfe[wahlIndex].classList.add("falsch"); }
            else auswahlKnoepfe[wahlIndex].classList.add("richtig");
          } else {
            // Zahl oder Term (LST.antwortPruefen): unlesbar oder nur die Form falsch (Term gleichwertig) zählt nicht als
            // Fehlversuch
            const r = LST.antwortPruefen(a, feld.value);
            if (r.art === "unlesbar" || r.art === "form") { zeige("hinweis", r.meldung); feld.focus(); return; }
            wert = r.wert;
            richtig = r.art === "richtig";
          }
          // Felder des Lernsteigs je Aufgabe: Lehrplan-Stufe und ob der Rechner offen war (RE1 a)
          // dazu, wo der Notizblock angeboten war, ob er benutzt wurde (wie im Eulenpfad: notiz „block“ oder „ohne“)
          L.zusatz({ lp: a.stufe, rechner: rechnerBenutzt, ...(mitBlock ? { vorgehen: { notiz: blockBenutzt ? "block" : "ohne" } } : {}) });
          const eingabe = typeof wert === "number" ? LST.dezimalText(wert) : wert;
          if (richtig) {
            gelost = true;
            // RA8 a (wie LB1 a im Eulenpfad): auf Anhieb nur die Bestätigung, es geht von selbst weiter; nach einem
            // Fehlversuch der Weg mit „Weiter“, ohne Selbstlauf — vorher stand er auch dort nur 1,2 s da.
            if (L.richtig({ eingabe }).aufAnhieb) { zeige("gut", "Richtig."); weiterKnopf(endlos ? 700 : 1200); }
            else { zeige("gut", "Jetzt stimmt es.", a.weg); weiterKnopf(null); }
            return;
          }
          const f = L.falsch({ eingabe });
          if (f.vorbei) { gelost = true; zeige("hinweis", `Nicht ganz. Richtig wäre ${a.loesung}.`, a.weg); weiterKnopf(null, true); return; }
          if (f.loesungZeigen) {
            gelost = true;
            zeige("hinweis", `Die Lösung ist ${a.loesung}.`, a.weg);
            weiterKnopf(null);
            return;
          }
          zeige("hinweis", fn.hinweis(a, wert));
          if (!auswahl) feld.select();
        };
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

      let gespeichert = null; // der Eintrag dieser Runde, sobald sie gespeichert ist
      function speichereSerie() {
        if (vorbei) return;
        vorbei = true;
        aufraeumen();
        if (endlos && L.geschafft > 0) speichereRekord(L.rekord(felder()));
        gespeichert = L.eintrag({ ...felder(), fach: fach.id, aufAnhieb: L.liste.filter(KERN.runde.aufAnhieb).length, gruppe: null });
        protokolliere(gespeichert);
      }

      function schluss() {
        if (auswahlAufraeumen) { auswahlAufraeumen(); auswahlAufraeumen = null; }
        NOTIZBLOCK.schliessen();
        fenster.weg();
        speichereSerie();
        aktuell = null;
        const { dauer, aufAnhieb, gezeigt, gekuerzt } = gespeichert;
        const punkte = L.geschafft;
        fortschritt.textContent = "Ergebnis";
        aufgabeFeld.replaceChildren();
        rueck.className = "rueckmeldung";
        // Bestzeit zählt nur Runden ohne gezeigte Lösung; Rekord ist die längste Serie.
        // Verglichen wird mit derselben Seite: mit oder ohne Rechner (RE1 a).
        const mit = gespeichert.mitRechner, seite = mit ? " mit Rechner" : "";
        const bz = bestzeitVorher[mit], rk = rekordVorher[mit];
        // Eine gekürzte Runde (RA6 a) zählt nicht für die Bestzeit.
        const neueBestzeit = gezeigt === 0 && !gekuerzt && (bz === null || dauer < bz);
        const zeilen = endlos
          ? [`${punkte} richtig in Folge${seite}`, L.erschoepftIst ? "Alle Aufgaben dieser Stufe geschafft." : "", punkte > rk ? "Neuer Rekord." : `Rekord${seite}: ${rk}`]
          : [`${aufAnhieb} von ${nr} auf Anhieb richtig`, `Zeit${seite}: ${dauerText(dauer)}`,
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
   *               | { art: "rechteck", teile: [modell | "+" | …], klein?: true } — Rechteckmodell (E1-6 a), siehe rechteck.
   */
  function darstellung(d) {
    if (d.art === "rechteck") return rechteck(d);
    if (d.art === "tabelle") {
      const zelle = (w, kopf) => el(kopf ? "th" : "td", { text: w === null ? "?" : (typeof w === "number" ? LST.dezimalText(w) : w) });
      return el("table", { class: "werte-tabelle" },
        el("tbody", {}, d.kopf.map((k, i) => el("tr", {}, zelle(k, true), d.zeilen.map(z => zelle(z[i]))))));
    }
    if (d.art === "graph") return graph(d);
    return null;
  }

  /**
   * Rechteckmodell für Brüche (E1-6 a, Plan E 1 Schritt 8): je Modell ein Raster { spalten, zeilen, faerben: [{ art:
   * "spalten" | "zeilen" | "felder", anzahl, farbe: 1 | 2 }] }. Gefärbt werden die ersten Spalten von links, die ersten
   * Zeilen von oben oder die ersten Felder spaltenweise von links oben; ein Feld in beiden Farben (Überlappung beim
   * Multiplizieren) bekommt die dritte. Zwischen den Modellen stehen Zeichen („+“, „−“). klein: kleinere Modelle (viele).
   */
  const RECHTECK = { breite: 240, hoehe: 160, klein: 0.4 };
  function farbeVon(m, sp, ze) {
    const k = sp * m.zeilen + ze;
    const an = f => f.art === "spalten" ? sp < f.anzahl : f.art === "zeilen" ? ze < f.anzahl : k < f.anzahl;
    const farben = new Set((m.faerben || []).filter(an).map(f => f.farbe));
    return farben.size === 2 ? "rm-f12" : farben.has(1) ? "rm-f1" : farben.has(2) ? "rm-f2" : "";
  }
  function rechteck(d) {
    const NS = "http://www.w3.org/2000/svg";
    const s = (tag, attr) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attr)) e.setAttribute(k, v); return e; };
    const f = d.klein ? RECHTECK.klein : 1, B = RECHTECK.breite, H = RECHTECK.hoehe;
    const box = el("div", { class: "rechteckmodell", role: "img", "aria-label": "Rechteckmodell" });
    for (const t of d.teile) {
      if (typeof t === "string") { box.append(el("span", { class: "rm-zeichen", text: t })); continue; }
      const svg = s("svg", { viewBox: `-2 -2 ${B + 4} ${H + 4}`, class: "rm", style: `width: ${Math.round(B * f)}px` });
      const w = B / t.spalten, h = H / t.zeilen;
      for (let sp = 0; sp < t.spalten; sp++) for (let ze = 0; ze < t.zeilen; ze++)
        svg.append(s("rect", { x: sp * w, y: ze * h, width: w, height: h, class: `rm-feld ${farbeVon(t, sp, ze)}`.trim() }));
      svg.append(s("rect", { x: 0, y: 0, width: B, height: H, class: "rm-rahmen" }));
      box.append(svg);
    }
    return box;
  }

  /**
   * Höhe der Zeichenfläche eines Graphen (Breite GRAPH.breite): d.hoehe, sonst gleicher Massstab auf beiden Achsen, aber
   * höchstens quadratisch und mindestens halb so hoch wie breit — dann hat die y-Achse ihren eigenen Massstab, wie bei
   * Sachgraphen üblich. Bis LERN_Session19 ohne Grenze: Weg-Zeit-Diagramme (kraefte) wurden bis 2900 px hoch, Graphen in
   * prozent-funktionen bis 900 px, und die Aufgabe passte nicht mehr ins Bild.
   */
  const GRAPH = { breite: 300, rand: 28, minVerhaeltnis: 0.5, maxVerhaeltnis: 1 };
  function graphHoehe(d) {
    if (d.hoehe) return d.hoehe;
    const gleich = GRAPH.breite * (d.y[1] - d.y[0]) / (d.x[1] - d.x[0]);
    return Math.round(Math.min(GRAPH.breite * GRAPH.maxVerhaeltnis, Math.max(GRAPH.breite * GRAPH.minVerhaeltnis, gleich)));
  }

  function graph(d) {
    const NS = "http://www.w3.org/2000/svg";
    const s = (tag, attr, text) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attr)) e.setAttribute(k, v); if (text !== undefined) e.textContent = text; return e; };
    const [x0, x1] = d.x, [y0, y1] = d.y, schritt = d.schritt || 1, schrittY = d.schrittY || schritt; // schrittY, hoehe: eigener Massstab der y-Achse
    const rand = GRAPH.rand, breite = GRAPH.breite, hoehe = graphHoehe(d);
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

  Object.assign(LST, { GRAPH, graphHoehe, el, FREIGABE, ENTWICKLUNG, sperrGrund, uebungSichtbar, werUebt, konto, speichereKonto, kompetenzstand, wackelt, stufenBedarf, WACKEL, standMarke, serie: wochenSerie, serieText, niveauFuer, setzeNiveau, niveauName, stufeInfo, runden, bestwert, bestzeit, dauerText, uebung, pruefung });
})(LST);
