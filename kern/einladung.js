/* Kern — Einladung in eine andere App (Entscheid EL1 a, Notiz EP1; Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.13).
   Herkunft: lernsteig/gemeinsam/konten.js (LST_Session1).

   Beim Übertritt (Eulenpfad nach der 6. Klasse → Lernsteig, später Lernsteig → Gratwanderung) gibt die Aufsicht der
   Person eine Einladung mit: nur Stammdaten, kein Verlauf, keine PIN. Zwei Wege mit demselben Inhalt:
   - Link mit Fragment „…/<ziel>/#einladung=<base64url(JSON)>“ — das Fragment geht nicht an den Server; die Ziel-App
     liest es und löscht es aus der Adresse;
   - Datei „<ziel>-einladung.json“ mit demselben JSON.
   Format: { format: "einladung", v: 1, ziel?, von?, name, geboren?, klasse?, niveau?, lehrplan? }. Ältere Einladungen des
   Lernsteigs ({ v: 1, … } ohne format) gelten weiter. Was eine Klasse, ein Niveau, ein Lehrplan ist, prüft die Ziel-App. */
"use strict";

(function (KERN) {
  const FORMAT = "einladung";
  const FELDER = ["name", "geboren", "klasse", "niveau", "lehrplan"];

  // UTF-8 ↔ base64url ohne escape/unescape: über Bytes (btoa und atob gibt es im Browser und in Node)
  function b64url(text) {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function vonB64url(s) {
    const t = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(t + "===".slice((t.length + 3) % 4));
    return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
  }

  /** Inhalt einer Einladung aus Stammdaten (leere Felder fallen weg). ziel und von: Apps ("lernsteig", "eulenpfad"). */
  function erstellen(daten, { ziel, von } = {}) {
    const d = { format: FORMAT, v: 1 };
    if (ziel) d.ziel = String(ziel);
    if (von) d.von = String(von);
    for (const f of FELDER) if (daten && daten[f] !== undefined && daten[f] !== null && daten[f] !== "") d[f] = daten[f];
    if (!KERN.person.nameRein(d.name || "")) throw new Error("Einladung: Vorname fehlt");
    return d;
  }
  /** Fragment für den Link: „#einladung=…“. */
  const fragment = einladung => "#einladung=" + b64url(JSON.stringify(einladung));
  /** Dateiname für die Datei: „lernsteig-einladung.json“. */
  const dateiname = ziel => `${ziel || "app"}-einladung.json`;

  /**
   * Liest eine Einladung aus einem Fragment („#einladung=…“, auch eine ganze Adresse) oder einem Objekt (Datei).
   * opt.ziel: diese App — eine Einladung für eine andere App gilt nicht. opt.klasse, opt.niveau, opt.lehrplan:
   * Prüfungen der App (Wert → bereinigter Wert oder null). Ungültige Felder fallen weg (Befund D12); ohne gültigen
   * Vornamen oder bei fremdem Format null.
   */
  function lesen(eingabe, opt = {}) {
    let d = eingabe;
    if (typeof eingabe === "string") {
      const m = eingabe.match(/einladung=([A-Za-z0-9_-]+)/);
      if (!m) return null;
      try { d = JSON.parse(vonB64url(m[1])); } catch (e) { return null; }
    }
    if (!d || typeof d !== "object" || Array.isArray(d) || d.v !== 1) return null;
    if (d.format !== undefined && d.format !== FORMAT) return null;
    if (opt.ziel && d.ziel !== undefined && d.ziel !== opt.ziel) return null;
    const erg = {};
    const name = typeof d.name === "string" ? KERN.person.nameRein(d.name) : "";
    if (!name) return null;
    erg.name = name;
    const g = KERN.person.geburtsdatumLies(d.geboren); if (g) erg.geboren = g; // auch ohne Tag (B3)
    for (const f of ["klasse", "niveau", "lehrplan"]) {
      if (d[f] === undefined || typeof opt[f] !== "function") continue;
      const w = opt[f](d[f]);
      if (w !== null && w !== undefined) erg[f] = w;
    }
    if (typeof d.von === "string") erg.von = d.von;
    return erg;
  }

  KERN.einladung = { FORMAT, erstellen, fragment, dateiname, lesen };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
