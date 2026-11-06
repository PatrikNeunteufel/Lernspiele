/* Kern — Rollen der Aufsicht: Bestätigung durch eine bestehende Aufsicht, PIN vergessen, Zurücksetzen mit Frist
   (Entscheide KR2 a, PIN1 a, PIN1-R a, D5; RL2 a für alle Apps, LERN_Session18; docs/kern/rahmen.md 4.21).
   Herkunft: eulenpfad/spiele/gemeinsam/spiel.js (PIN vergessen in vier Stufen, Frist) und lernsteig/gemeinsam/konten.js
   (Bestätigung einer weiteren Aufsicht). Die Gruppenleitung (G2 a) kommt mit den Gruppen (RL1 a, LERN-48).
   PIN vergessen, für Aufsichten in allen Apps gleich: (1) eine andere Aufsicht des Geräts bestätigt mit ihrer PIN,
   (2) Wiederherstellungscode, (3) Sicherheitsfrage, danach eine neue PIN und gleich ein neuer Code; (4) Zurücksetzen
   mit Frist (3 Tage, auf der Anmeldung für alle sichtbar, mit PIN oder Code einer Aufsicht abzubrechen). Nach Ablauf
   verlieren die Aufsichten des Geräts ihre Rolle — was das heisst, sagt die App (Eulenpfad: Konto ohne PIN; Lernsteig:
   entfernt samt Verbindungen). Gearbeitet wird auf der Personenliste der App (KERN.person.liste). */
"use strict";

(function (KERN) {
  const TAGE = 3;
  const BESTAETIGEN = "Eine Aufsicht dieses Geräts muss mit ihrer PIN bestätigen.";
  const aufsichtenMitPin = personen => personen.alle().filter(p => p.rolle === "aufsicht" && p.pin);

  /**
   * Bestätigung durch eine bestehende Aufsicht (KR2 a, D5): { id, pin } einer Aufsicht dieses Geräts mit PIN, nicht die
   * Person selbst (ausser). Gibt die bestätigende Aufsicht zurück; sonst Fehler mit Klartext.
   */
  async function bestaetige(personen, { id, pin } = {}, { ausser = null } = {}) {
    const b = id ? personen.finde(id) : null;
    if (!b || b.rolle !== "aufsicht" || !b.pin || (ausser && b.id === ausser)) throw new Error(BESTAETIGEN);
    if (!(await KERN.geheimnis.pinStimmt(pin, b.pin))) throw new Error(BESTAETIGEN);
    return b;
  }
  /** Braucht eine neue Aufsicht eine Bestätigung? Ja, sobald es auf dem Gerät eine Aufsicht mit PIN gibt. */
  const brauchtBestaetigung = personen => aufsichtenMitPin(personen).length > 0;

  /**
   * PIN vergessen (Stufen 1–3): weg = { code } | { antwort } | { bestaetigung: { id, pin } }. Prüft den Weg, setzt die
   * neue PIN und gibt gleich einen neuen Code aus (der alte ist bekannt geworden oder verloren); Frage und Antwort
   * bleiben. Gibt { person, code } zurück; Fehler mit Klartext.
   */
  async function neuePin(personen, id, pin, weg = {}) {
    const G = KERN.geheimnis;
    const p = personen.finde(id);
    if (!p) throw new Error("Person nicht gefunden");
    const w = p.wiederherstellung || {};
    if (weg.bestaetigung) await bestaetige(personen, weg.bestaetigung, { ausser: p.id });
    else if (weg.code !== undefined) { if (!(await G.codeStimmt(weg.code, w))) throw new Error("Der Code stimmt nicht."); }
    else if (weg.antwort !== undefined) { if (!w.frage || !(await G.antwortStimmt(weg.antwort, w))) throw new Error("Die Antwort stimmt nicht."); }
    else throw new Error("Weg fehlt");
    const neu = await G.pin(pin);
    const behalten = w.frage && w.antwort ? { frage: w.frage, antwort: w.antwort } : {};
    const r = await G.wiederherstellung({}, behalten);
    return { person: personen.aendere(p.id, { pin: neu, wiederherstellung: r.wiederherstellung }), code: r.code };
  }

  /**
   * Zurücksetzen mit Frist (Stufe 4), je Gerät: speicher[schluessel] = { angefordert, ab } (ISO-Zeiten).
   * jetzt: für Tests.
   */
  function frist({ speicher, schluessel = "zuruecksetzen", tage = TAGE, jetzt = () => new Date() } = {}) {
    if (!speicher || typeof speicher.lies !== "function") throw new Error("frist: speicher fehlt");
    const stand = () => { const s = speicher.lies(schluessel, null); return s && typeof s.ab === "string" ? s : null; };
    function anfordern() {
      const t = jetzt();
      const s = { angefordert: t.toISOString(), ab: new Date(t.getTime() + tage * 24 * 3600 * 1000).toISOString() };
      speicher.schreibe(schluessel, s);
      return s;
    }
    const abbrechen = () => (typeof speicher.entferne === "function" ? speicher.entferne(schluessel) : speicher.schreibe(schluessel, null));
    /** Ist die Frist abgelaufen? Dann ist sie erledigt (entfernt) und die App setzt die Aufsichten zurück. */
    function abgelaufen() {
      const s = stand();
      if (!s || new Date(s.ab) > jetzt()) return false;
      abbrechen();
      return true;
    }
    return { TAGE: tage, stand, anfordern, abbrechen, abgelaufen };
  }
  /** Bricht eine Eingabe die Frist ab? Ja, wenn sie die PIN oder der Code einer Aufsicht mit PIN ist. */
  async function abbrechbarMit(personen, eingabe) {
    const G = KERN.geheimnis;
    for (const a of aufsichtenMitPin(personen)) {
      if ((await G.pinStimmt(eingabe, a.pin)) || (await G.codeStimmt(eingabe, a.wiederherstellung))) return true;
    }
    return false;
  }
  /**
   * Nach Ablauf der Frist: alle Aufsichten des Geräts verlieren ihre Rolle. art „lernend“: Konto ohne PIN, Code und
   * Frage (Eulenpfad); art „entfernen“: die Aufsicht wird auf diesem Gerät entfernt und aus den Feldern verweise der
   * anderen Personen gestrichen (Lernsteig: aufsicht, anfragen), ohne Löschvermerk — kennt sie ihre PIN auf einem anderen
   * Gerät, kommt sie über den Abgleich gesperrt zurück (DF4 a). Gibt die Kennungen der Aufsichten zurück.
   */
  function zuruecksetzen(personen, { art = "lernend", verweise = [] } = {}) {
    const ids = personen.alle().filter(p => p.rolle === "aufsicht").map(p => p.id);
    if (!ids.length) return [];
    if (art === "lernend") {
      for (const id of ids) personen.aendere(id, { rolle: "lernend", pin: null, wiederherstellung: null, gesperrt: undefined });
      return ids;
    }
    if (art !== "entfernen") throw new Error(`zuruecksetzen: unbekannte Art ${art}`);
    const bleibt = personen.alle().filter(p => !ids.includes(p.id)).map(p => {
      const q = { ...p };
      for (const f of verweise) if (Array.isArray(q[f])) { const l = q[f].filter(x => !ids.includes(x)); if (l.length) q[f] = l; else delete q[f]; }
      return q;
    });
    if (!personen.speichere(bleibt)) throw new Error("Der Speicher des Browsers ist voll oder gesperrt.");
    return ids;
  }

  KERN.rollen = { TAGE, BESTAETIGEN, bestaetige, brauchtBestaetigung, neuePin, frist, abbrechbarMit, zuruecksetzen };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
