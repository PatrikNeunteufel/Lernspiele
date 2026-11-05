/* Lernsteig — reiner Teil des Rahmens (ohne DOM). Wird von jeder Seite und vom Testskript
   (docs/lernsteig/werkzeuge/pruefe_uebungen.js) geladen. Vertrag: docs/lernsteig/rahmen.md.
   Keine Abhängigkeit zu eulenpfad/: Übernahmen stehen in docs/gemeinsame_mechaniken.md. */
"use strict";

var LST = (function () {
  const PRAEFIX = "lernsteig:"; // eigener Speicher (Entscheid SP1 a)

  /** Gespeicherten Wert lesen; ohne Speicher (privates Fenster, Node) gilt der Standard. */
  function lies(schluessel, standard) {
    try {
      const v = localStorage.getItem(PRAEFIX + schluessel);
      return v === null ? standard : JSON.parse(v);
    } catch (e) { return standard; }
  }
  function schreibe(schluessel, wert) {
    try { localStorage.setItem(PRAEFIX + schluessel, JSON.stringify(wert)); return true; } catch (e) { return false; }
  }

  // Zufall über eine austauschbare Quelle, damit das Testskript mit Seed laufen kann.
  const quelle = { zufall: Math.random };
  function zufall(min, max) { return min + Math.floor(quelle.zufall() * (max - min + 1)); }
  function waehle(liste) { return liste[Math.floor(quelle.zufall() * liste.length)]; }
  function mische(liste) {
    const a = liste.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(quelle.zufall() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Zahlschreibweise wie der Lehrplan SG (Entscheid Z1 a, docs/lernsteig/lehrplan/sg_oberstufe_praxis.md 5):
  // Tausender mit Apostroph ab vier Stellen („1'000“, „320'000“), Dezimalpunkt („0.725“). Zeichen wie im Lehrplantext
  // (ASCII-Apostroph). Das Minuszeichen ist nicht Teil von Z1 a; bis zum Entscheid gilt „−“ (U+2212), Frage MZ1.
  const TAUSENDER = "'";
  const MINUS = "−";

  /** Ganze Zahl in der Schreibweise des Lernsteigs: „1'000“, „−320'000“. */
  function zahlText(n) {
    const s = String(Math.abs(n));
    const text = s.length < 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, TAUSENDER);
    return n < 0 ? MINUS + text : text;
  }

  /** Dezimalzeichen: Punkt wie im Lehrplan (Z1 a). Eine Einstellung „komma“ bleibt für später möglich. */
  function dezimalZeichen() { return (lies("einstellungen", {}).dezimal === "komma") ? "," : "."; }

  /** Dezimalzahl mit dem eingestellten Zeichen, vor dem Komma in Schulschreibweise. */
  /** Zahl als Dezimaltext ohne Exponent („0.00000004485“), auf 15 gültige Ziffern (ohne Rundungsreste). */
  function klartext(x) {
    return Number(x.toPrecision(15)).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 });
  }
  function dezimalText(x, stellen) {
    const roh = stellen === undefined ? klartext(Math.abs(x)) : Math.abs(x).toFixed(stellen);
    const [ganz, rest] = roh.split(".");
    const g = ganz.length < 4 ? ganz : ganz.replace(/\B(?=(\d{3})+(?!\d))/g, TAUSENDER);
    const t = g + (rest ? dezimalZeichen() + rest : "");
    return x < 0 && /[1-9]/.test(roh) ? MINUS + t : t;
  }

  /**
   * Eingabe einer Zahl lesen: akzeptiert „−“, „-“, „–“, Punkt oder Komma, Leerzeichen als Gliederung.
   * Liefert eine Zahl oder null, wenn die Eingabe keine Zahl ist.
   */
  function leseZahl(text) {
    const t = String(text).trim().replace(/[\s\u202F\u00A0'\u2019]/g, "").replace(/[\u2212\u2013]/g, "-").replace(",", ".");
    if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t)) return null;
    return Number(t);
  }

  /**
   * Niveaus (Entscheid NV1 a): intern kantonsunabhängig, gespeichert je Fach im Profil. Angezeigt wird der
   * Name aus dem Lehrplan-Profil (lehrplaene.js).
   */
  // NV2 a: zwei Inhaltsniveaus nach Lehrplan (lehrplan/lehrplan_sg_sek1.md 2, A1). Ein Prüfungsziel
  // (Gymnasium, EAP, Stellwerk 8) ist eine eigene Achse im Profil, kein Niveau.
  const NIVEAUS = [
    { id: "n1", nr: 1, kurz: "bis Grundanspruch Zyklus 3" },
    { id: "n2", nr: 2, kurz: "Grundanspruch und Auftrag Zyklus 3" },
  ];
  const niveauNr = id => (NIVEAUS.find(n => n.id === id) || { nr: 0 }).nr;

  /**
   * Stufen einer Übung (Entscheide ST1 a, ST2 a): Jede Lehrplan-Stufe der Übung ist eine Referenzstufe (Id = Buchstabe
   * des Lehrplans, „h“), zwischen zwei benachbarten liegt ein Übergang (Id „h-i“, Aufgaben beider Stufen gemischt),
   * zuoberst die Challenge (Id „challenge“, überall gleich: alle Stufen gemischt, schwerste Varianten). Die Zahl der
   * Stufen hängt an der Übung; Namen und Verhalten sind in jeder Übung gleich.
   * eintrag: Katalog-Eintrag mit `stufen` (Buchstaben, aufsteigend).
   */
  function stufenListe(eintrag) {
    const lp = eintrag.stufen;
    const liste = [];
    lp.forEach((s, i) => {
      if (i > 0) liste.push({ id: `${lp[i - 1]}-${s}`, typ: "uebergang", lp: [lp[i - 1], s], name: `Übergang ${lp[i - 1]} → ${s}` });
      liste.push({ id: s, typ: "referenz", lp: [s], name: `Stufe ${s}` });
    });
    liste.push({ id: "challenge", typ: "challenge", lp: lp.slice(), name: "Challenge" });
    return liste;
  }
  const stufeVon = (eintrag, id) => stufenListe(eintrag).find(s => s.id === id) || null;

  /**
   * Zielstufe eines Niveaus in einer Kompetenz (NV2 a): n1 = Grundanspruch Z3 (ohne GA: Orientierungspunkt, sonst die
   * letzte Stufe), n2 = letzte Stufe des Zyklus 3. marken: LST_LEHRPLAENE.MARKEN[kompetenz].
   */
  function zielstufe(marken, niveau) {
    if (!marken) return null;
    const letzte = marken.stufen[marken.stufen.length - 1];
    return niveau === "n1" ? (marken.ga || marken.op || letzte) : letzte;
  }

  // ---------- Serie über Tage (BF1 a: selbst gesetzt, ohne Stern) ----------
  // Ein Übungstag ist ein Kalendertag (Ortszeit) mit mindestens einer Runde. Wochen beginnen am Montag.
  const tagText = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  function wochenbeginn(d) { const m = new Date(d.getFullYear(), d.getMonth(), d.getDate()); m.setDate(m.getDate() - ((m.getDay() + 6) % 7)); return m; }
  /**
   * Wochenziel: tage = Menge der Übungstage („JJJJ-MM-TT“), ziel = Tage je Woche (1–7).
   * Liefert { dieseWoche, ziel, erreicht, wochenInFolge }: wochenInFolge zählt die Wochen direkt vor dieser, die das
   * Ziel erreichten, dazu diese, wenn sie es schon erreicht hat. Eine laufende Woche unterbricht die Serie nicht.
   */
  function wochenSerie(tage, ziel, heute = new Date()) {
    const zaehle = beginn => { let n = 0; for (let i = 0; i < 7; i++) { const d = new Date(beginn); d.setDate(d.getDate() + i); if (tage.has(tagText(d))) n++; } return n; };
    const jetzt = wochenbeginn(heute);
    const dieseWoche = zaehle(jetzt);
    let folge = 0;
    const w = new Date(jetzt);
    for (let i = 0; i < 520; i++) { w.setDate(w.getDate() - 7); if (zaehle(w) >= ziel) folge++; else break; }
    const erreicht = dieseWoche >= ziel;
    return { dieseWoche, ziel, erreicht, wochenInFolge: folge + (erreicht ? 1 : 0) };
  }

  return {
    PRAEFIX, lies, schreibe, quelle, zufall, waehle, mische, tagText, wochenSerie,
    TAUSENDER, MINUS, zahlText, dezimalText, dezimalZeichen, leseZahl,
    NIVEAUS, niveauNr, stufenListe, stufeVon, zielstufe,
  };
})();

if (typeof module !== "undefined") module.exports = LST;
