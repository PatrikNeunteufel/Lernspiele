/* Lernsteig — reiner Teil des Rahmens (ohne DOM). Wird von jeder Seite und vom Testskript
   (tools/pruefe_uebungen.js) geladen. Vertrag: docs/lernsteig/rahmen.md.
   Keine Abhängigkeit zu eulenpfad/: Übernahmen stehen in docs/gemeinsame_mechaniken.md. */
"use strict";

var LST = (function () {
  const PRAEFIX = "lernsteig:"; // eigener Speicher (Entscheid SP1 a)

  // Speicher und Zufall aus dem Kern (kern/speicher.js, kern/zufall.js, kern 1.1.0).
  const SPEICHER = KERN.speicher(PRAEFIX);
  /** Gespeicherten Wert lesen; ohne Speicher (privates Fenster, Node) gilt der Standard. */
  const lies = (schluessel, standard) => SPEICHER.lies(schluessel, standard);
  /** Speichern; true, wenn es gespeichert ist (false: Speicher voll oder gesperrt). */
  const schreibe = (schluessel, wert) => SPEICHER.schreibe(schluessel, wert);

  /** Felder der Runden und Rekorde von vor LERN_Session15 und ihre Namen im gemeinsamen Format (R1 a, kern/runden.js). */
  const ALTE_FELDER = { konto: "person", uebung: "inhalt" };

  // Zufall über die austauschbare Quelle des Kerns, damit das Testskript mit Seed laufen kann (LST.quelle.zufall = …).
  const { quelle, zufall, waehle, mische } = KERN.zufall;

  // Zahlschreibweise wie der Lehrplan SG (Entscheid Z1 a, docs/lernsteig/lehrplan/sg_oberstufe_praxis.md 5):
  // Tausender mit Apostroph ab vier Stellen („1'000“, „320'000“), Dezimalpunkt („0.725“). Zeichen wie im Lehrplantext
  // (ASCII-Apostroph). Das Minuszeichen ist nicht Teil von Z1 a; bis zum Entscheid gilt „−“ (U+2212), Frage MZ1.
  // Die Rechenarbeit macht der Kern (kern/zahl.js, kern 1.0.0, docs/plan_angleich_reihe.md B); hier steht nur die
  // Schreibweise des Lernsteigs.
  const TAUSENDER = "'";
  const MINUS = "−";

  /** Dezimalzeichen: Punkt wie im Lehrplan (Z1 a). Eine Einstellung „komma“ bleibt für später möglich. */
  function dezimalZeichen() { return (lies("einstellungen", {}).dezimal === "komma") ? "," : "."; }
  const schreibweise = () => ({ tausender: TAUSENDER, abStellen: 4, minus: MINUS, dezimal: dezimalZeichen() });

  /** Zahl in der Schreibweise des Lernsteigs: „1'000“, „−320'000“, „1'234.5“ (nur der ganze Teil gegliedert). */
  const zahlText = n => KERN.zahl.text(n, schreibweise());
  /** Dezimalzahl mit dem eingestellten Zeichen, ohne Exponent und Rundungsreste; stellen: feste Nachkommastellen. */
  const dezimalText = (x, stellen) => KERN.zahl.dezimalText(x, stellen, schreibweise());
  /** Eingabe einer Zahl lesen („−“, „-“, „–“, Punkt oder Komma, Leerzeichen und Apostroph); Zahl oder null. */
  const leseZahl = text => KERN.zahl.lies(text);

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
  /**
   * Wochenziel: tage = Menge der Übungstage („JJJJ-MM-TT“), ziel = Tage je Woche (1–7).
   * Liefert { dieseWoche, ziel, erreicht, wochenInFolge }: wochenInFolge zählt die Wochen direkt vor dieser, die das
   * Ziel erreichten, dazu diese, wenn sie es schon erreicht hat. Eine laufende Woche unterbricht die Serie nicht.
   * Rechnung im Kern (KERN.auswertung.wochen, AW1 a; dieselbe wie das Wochenziel des Eulenpfads, ohne Minuten).
   */
  function wochenSerie(tage, ziel, heute = new Date()) {
    const runden = [...tage].map(t => { const [j, m, d] = t.split("-").map(Number); return { zeit: new Date(j, m - 1, d, 12).toISOString(), dauer: 0 }; });
    const w = KERN.auswertung.wochen(runden, { tage: ziel }, heute.getTime());
    return { dieseWoche: w.aktuelle.erfuellteTage, ziel, erreicht: w.aktuelle.erfuellt, wochenInFolge: w.serie };
  }

  return {
    PRAEFIX, ALTE_FELDER, lies, schreibe, quelle, zufall, waehle, mische, tagText, wochenSerie,
    TAUSENDER, MINUS, schreibweise, zahlText, dezimalText, dezimalZeichen, leseZahl,
    NIVEAUS, niveauNr, stufenListe, stufeVon, zielstufe,
  };
})();

if (typeof module !== "undefined") module.exports = LST;
