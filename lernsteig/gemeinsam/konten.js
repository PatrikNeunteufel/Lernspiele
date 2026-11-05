/* Lernsteig — Konten der Jugendlichen (Entscheide AU1 a, KT1 a, GE1 b, EL1 a, DS1 a). Alles nur im Browser.
   Konto: { id, name (Vorname), geboren ("JJJJ-MM-TT"), klasse (7–9), lehrplan { land, kanton }, niveau { <fach>: n },
            pruefungsziel, rechnerModell, pin?: { salz, hash }, wiederherstellung?: { salz, hash }, erstellt, geaendert }
   Speicher: lernsteig:konten (Liste), lernsteig:aktiv (zuletzt gewähltes Konto). Ein Konto mit PIN gilt nur im
   geöffneten Tab als angemeldet (sessionStorage lernsteig:angemeldet), wie die Aufsicht im Eulenpfad.
   PIN und Wiederherstellungscode werden nur als Salz und SHA-256-Hash gespeichert und reisen nie in Sicherungen
   (ohneGeheimnis).
   Aufsicht (AU1 a): { id, name, rolle (eltern | lehrperson), pin, wiederherstellung, erstellt } in lernsteig:aufsichten,
   PIN Pflicht, angemeldet nur im Tab (sessionStorage lernsteig:aufsicht). Verbindung im Konto: aufsicht [Ids], offene
   Anfragen anfragen [Ids]; entsteht nur, wenn die Aufsicht das Konto anlegt oder der Jugendliche angemeldet zustimmt.
   Abgeschaut vom Eulenpfad (docs/eulenpfad/rahmen.md 6), Zeile in docs/gemeinsame_mechaniken.md. */
"use strict";

var LST_KONTEN = (function () {
  // Oberstufe SG: 1. bis 3. Oberstufe = 7. bis 9. Schuljahr (docs/lernsteig/lehrplan/lehrplan_sg_sek1.md 1)
  const KLASSEN = [{ id: "7", name: "1. Oberstufe (7. Schuljahr)" }, { id: "8", name: "2. Oberstufe (8. Schuljahr)" }, { id: "9", name: "3. Oberstufe (9. Schuljahr)" }];
  const alle = () => LST.lies("konten", []);
  const speichereAlle = l => LST.schreibe("konten", l);
  const neueId = () => "k-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e9).toString(36);
  const hex = bytes => [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
  const neuesSalz = () => hex(crypto.getRandomValues(new Uint8Array(16)));
  async function hash(text, salz) {
    const daten = new TextEncoder().encode(`${salz}:${text}`);
    return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", daten)));
  }
  // Wiederherstellungscode: 12 Zeichen ohne verwechselbare (0/O, 1/I), gegliedert „K7QM-2XRA-9TPL“
  function neuerCode() {
    const Z = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const r = crypto.getRandomValues(new Uint8Array(12));
    const s = [...r].map(b => Z[b % Z.length]).join("");
    return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8)}`;
  }
  const normCode = c => String(c).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const pinGueltig = p => /^\d{4,6}$/.test(String(p));

  /** Legt ein Konto an. Mit PIN liefert es zusätzlich den Wiederherstellungscode (nur jetzt sichtbar). */
  async function anlegen(daten) {
    const jetzt = new Date().toISOString();
    const k = {
      id: neueId(), name: String(daten.name || "").trim(), geboren: daten.geboren || null, klasse: daten.klasse || null,
      lehrplan: daten.lehrplan || { land: "CH", kanton: null }, niveau: daten.niveau || {}, pruefungsziel: daten.pruefungsziel || "keins",
      rechnerModell: daten.rechnerModell || "allgemein", erstellt: jetzt, geaendert: jetzt,
    };
    if (!k.name) throw new Error("Vorname fehlt");
    let code = null;
    if (daten.pin) {
      if (!pinGueltig(daten.pin)) throw new Error("Die PIN hat 4 bis 6 Ziffern.");
      const s = neuesSalz(); k.pin = { salz: s, hash: await hash(daten.pin, s) };
      code = neuerCode();
      const s2 = neuesSalz(); k.wiederherstellung = { salz: s2, hash: await hash(normCode(code), s2) };
    }
    const l = alle(); l.push(k); speichereAlle(l);
    return { konto: k, code };
  }

  const finde = id => alle().find(k => k.id === id) || null;
  function aendern(k) {
    const l = alle(); const i = l.findIndex(x => x.id === k.id);
    if (i < 0) return;
    // Verbindungen zur Aufsicht ändern nur die Funktionen der Aufsicht (unten), nie eine ältere Kopie des Kontos
    const verbindung = {}; for (const f of ["aufsicht", "anfragen"]) if (l[i][f]) verbindung[f] = l[i][f];
    const neu = Object.assign({}, l[i], k, { geaendert: new Date().toISOString() });
    delete neu.aufsicht; delete neu.anfragen;
    l[i] = Object.assign(neu, verbindung);
    speichereAlle(l);
  }
  async function pinStimmt(k, pin) { return !!k.pin && (await hash(String(pin), k.pin.salz)) === k.pin.hash; }
  async function codeStimmt(k, code) { return !!k.wiederherstellung && (await hash(normCode(code), k.wiederherstellung.salz)) === k.wiederherstellung.hash; }

  /** PIN vergessen: mit dem Code eine neue PIN setzen; es gibt gleich einen neuen Code. */
  async function neuePinMitCode(id, code, neuePin) {
    const k = finde(id);
    if (!k || !(await codeStimmt(k, code))) throw new Error("Der Code stimmt nicht.");
    if (!pinGueltig(neuePin)) throw new Error("Die PIN hat 4 bis 6 Ziffern.");
    const s = neuesSalz(); k.pin = { salz: s, hash: await hash(neuePin, s) };
    const neu = neuerCode(); const s2 = neuesSalz(); k.wiederherstellung = { salz: s2, hash: await hash(normCode(neu), s2) };
    aendern(k);
    return neu;
  }
  /** PIN setzen oder entfernen (für das angemeldete Konto). */
  async function setzePin(id, pin) {
    const k = finde(id); if (!k) return null;
    if (!pin) { delete k.pin; delete k.wiederherstellung; const l = alle(); l[l.findIndex(x => x.id === id)] = k; speichereAlle(l); return null; }
    if (!pinGueltig(pin)) throw new Error("Die PIN hat 4 bis 6 Ziffern.");
    const s = neuesSalz(); k.pin = { salz: s, hash: await hash(pin, s) };
    const code = neuerCode(); const s2 = neuesSalz(); k.wiederherstellung = { salz: s2, hash: await hash(normCode(code), s2) };
    aendern(k);
    return code;
  }

  // ---------- Anmeldung ----------
  const sitzung = {
    lies() { try { return sessionStorage.getItem("lernsteig:angemeldet"); } catch (e) { return null; } },
    setze(id) { try { if (id) sessionStorage.setItem("lernsteig:angemeldet", id); else sessionStorage.removeItem("lernsteig:angemeldet"); } catch (e) { /* ohne sessionStorage */ } },
  };
  /** Das aktive Konto: zuletzt gewählt; mit PIN nur, wenn in diesem Tab angemeldet. Sonst null (Gast). */
  function aktiv() {
    const id = LST.lies("aktiv", null);
    const k = id && finde(id);
    if (!k) return null;
    if (k.pin && sitzung.lies() !== k.id) return null;
    return k;
  }
  /** Wählt ein Konto. Mit PIN muss pin stimmen. */
  async function anmelden(id, pin) {
    const k = finde(id);
    if (!k) throw new Error("Konto nicht gefunden");
    if (k.pin && !(await pinStimmt(k, pin))) throw new Error("Die PIN stimmt nicht.");
    LST.schreibe("aktiv", id);
    sitzung.setze(k.pin ? id : null);
    return k;
  }
  function abmelden() { LST.schreibe("aktiv", null); sitzung.setze(null); }

  /** Alter in ganzen Jahren am Stichtag (GE1 b: aus dem Geburtsdatum). */
  function alter(geboren, heute = new Date()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(geboren || "")) return null;
    const [j, m, t] = geboren.split("-").map(Number);
    let a = heute.getFullYear() - j;
    if (heute.getMonth() + 1 < m || (heute.getMonth() + 1 === m && heute.getDate() < t)) a--;
    return a;
  }

  /** Felder, die nur auf diesem Gerät gelten: Geheimnisse (PIN, Code) und Verbindungen zu Aufsichten des Geräts. */
  const GERAET = ["pin", "wiederherstellung", "aufsicht", "anfragen"];
  /** Kopie ohne Geheimnisse und Gerätebezüge für Sicherungen, Abgleich und Einladungen. */
  function ohneGeheimnis(k) { const c = Object.assign({}, k); for (const f of GERAET) delete c[f]; return c; }

  // ---------- Aufsicht (AU1 a) ----------
  // Freiwillig, für Eltern und Lehrpersonen. Sieht nur verbundene Konten; der Jugendliche sieht, wer mitliest.
  // Grenze (Annahme, in rahmen.md 5d): Alles liegt im Browser; die PIN schützt vor Versehen und Neugier am selben Gerät,
  // nicht vor jemandem, der die Entwicklerwerkzeuge des Browsers öffnet. Echter Schutz braucht den Server (DS1 a).
  const ROLLEN = [{ id: "eltern", name: "Eltern" }, { id: "lehrperson", name: "Lehrperson" }];
  const aufsichten = () => LST.lies("aufsichten", []);
  const aufsichtFinde = id => aufsichten().find(a => a.id === id) || null;
  const aufsichtSitzung = {
    lies() { try { return sessionStorage.getItem("lernsteig:aufsicht"); } catch (e) { return null; } },
    setze(id) { try { if (id) sessionStorage.setItem("lernsteig:aufsicht", id); else sessionStorage.removeItem("lernsteig:aufsicht"); } catch (e) { /* ohne sessionStorage */ } },
  };
  async function geheimnis(text) { const salz = neuesSalz(); return { salz, hash: await hash(text, salz) }; }

  /** Legt eine Aufsicht an (PIN Pflicht) und meldet sie im Tab an. Liefert { aufsicht, code }. */
  async function aufsichtAnlegen(daten) {
    const name = String(daten.name || "").trim();
    if (!name) throw new Error("Name fehlt");
    if (!ROLLEN.some(r => r.id === daten.rolle)) throw new Error("Rolle fehlt");
    if (!pinGueltig(daten.pin)) throw new Error("Die PIN hat 4 bis 6 Ziffern.");
    const code = neuerCode();
    const a = { id: "a-" + neueId().slice(2), name, rolle: daten.rolle, pin: await geheimnis(String(daten.pin)), wiederherstellung: await geheimnis(normCode(code)), erstellt: new Date().toISOString() };
    LST.schreibe("aufsichten", aufsichten().concat(a));
    aufsichtSitzung.setze(a.id);
    return { aufsicht: a, code };
  }
  async function aufsichtAnmelden(id, pin) {
    const a = aufsichtFinde(id);
    if (!a) throw new Error("Aufsicht nicht gefunden");
    if (!(await pinStimmt(a, pin))) throw new Error("Die PIN stimmt nicht.");
    aufsichtSitzung.setze(id);
    return a;
  }
  function aufsichtAbmelden() { aufsichtSitzung.setze(null); }
  function aufsichtAktiv() { const id = aufsichtSitzung.lies(); return (id && aufsichtFinde(id)) || null; }
  async function aufsichtNeuePinMitCode(id, code, neuePin) {
    const l = aufsichten(); const a = l.find(x => x.id === id);
    if (!a || !(await codeStimmt(a, code))) throw new Error("Der Code stimmt nicht.");
    if (!pinGueltig(neuePin)) throw new Error("Die PIN hat 4 bis 6 Ziffern.");
    const neu = neuerCode();
    a.pin = await geheimnis(String(neuePin)); a.wiederherstellung = await geheimnis(normCode(neu));
    LST.schreibe("aufsichten", l);
    return neu;
  }

  // Verbindungen: im Konto aufsicht [Ids] und anfragen [Ids]
  const hat = (k, feld, aid) => (k[feld] || []).includes(aid);
  function setzeFeld(kontoId, feld, f) {
    const l = alle(); const k = l.find(x => x.id === kontoId); if (!k) return;
    k[feld] = f(k[feld] || []); if (!k[feld].length) delete k[feld];
    speichereAlle(l);
  }
  const verbundene = aid => alle().filter(k => hat(k, "aufsicht", aid));
  const angefragt = aid => alle().filter(k => hat(k, "anfragen", aid) && !hat(k, "aufsicht", aid));
  /** Wer bei einem Konto mitliest (für den Jugendlichen sichtbar) und wer angefragt hat. */
  function mitleser(kontoId) {
    const k = finde(kontoId) || {};
    const info = id => { const a = aufsichtFinde(id); return a ? { id, name: a.name, rolle: a.rolle } : null; };
    return { verbunden: (k.aufsicht || []).map(info).filter(Boolean), anfragen: (k.anfragen || []).filter(id => !hat(k, "aufsicht", id)).map(info).filter(Boolean) };
  }
  function brauchtAufsicht() { const a = aufsichtAktiv(); if (!a) throw new Error("Keine Aufsicht angemeldet."); return a; }
  function brauchtKonto(kontoId) { const k = aktiv(); if (!k || k.id !== kontoId) throw new Error("Nur das angemeldete Konto kann zustimmen."); return k; }
  /** Die angemeldete Aufsicht bittet ein Konto um Mitlesen; verbunden erst nach Zustimmung. */
  function anfragen(kontoId) {
    const a = brauchtAufsicht();
    setzeFeld(kontoId, "anfragen", l => l.includes(a.id) ? l : l.concat(a.id));
  }
  /** Der angemeldete Jugendliche nimmt eine Anfrage an oder lehnt ab. Zulassen nur mit PIN: sonst könnte jeder am
      Gerät das Konto öffnen und zustimmen, auch die Aufsicht selbst. */
  function antworten(kontoId, aid, ja) {
    const k = brauchtKonto(kontoId);
    if (ja && !k.pin) throw new Error("Lege zuerst im Profil eine PIN fest, damit nur du zustimmen kannst.");
    setzeFeld(kontoId, "anfragen", l => l.filter(x => x !== aid));
    if (ja && aufsichtFinde(aid)) setzeFeld(kontoId, "aufsicht", l => l.includes(aid) ? l : l.concat(aid));
  }
  /** Verbindung lösen: der angemeldete Jugendliche oder die Aufsicht selbst (AF1 a). */
  function loesen(kontoId, aid) {
    const a = aufsichtAktiv(), k = aktiv();
    if (!(a && a.id === aid) && !(k && k.id === kontoId)) throw new Error("Lösen kann nur der Jugendliche oder die Aufsicht selbst.");
    setzeFeld(kontoId, "aufsicht", l => l.filter(x => x !== aid));
  }
  /** Die Aufsicht legt ein Konto für einen Jugendlichen an; es ist gleich verbunden. PIN setzt der Jugendliche selbst. */
  async function kontoFuerAufsicht(daten) {
    const a = brauchtAufsicht();
    const { konto } = await anlegen(Object.assign({}, daten, { pin: null }));
    setzeFeld(konto.id, "aufsicht", () => [a.id]);
    return finde(konto.id);
  }
  /** Konten aus einer Sicherung, die die Aufsicht selbst einliest, werden mit ihr verbunden (AF2 a). */
  function verbindeEingelesene(ids) {
    const a = brauchtAufsicht();
    for (const id of ids) if (finde(id)) setzeFeld(id, "aufsicht", l => l.includes(a.id) ? l : l.concat(a.id));
  }
  /** Einstellungen des Geräts (TR1 a: Rechner; Dezimalzeichen) setzt nur eine angemeldete Aufsicht. */
  function setzeGeraeteEinstellung(feld, wert) {
    brauchtAufsicht();
    if (!["rechner", "dezimal"].includes(feld)) throw new Error("Unbekannte Einstellung");
    const e = LST.lies("einstellungen", {}); e[feld] = wert; LST.schreibe("einstellungen", e);
  }

  // ---------- Einladung (EL1 a) ----------
  // Link „…/lernsteig/#einladung=<base64url(JSON)>“: nur Stammdaten { v: 1, name, geboren, klasse, niveau, lehrplan }.
  // Das Fragment geht nicht an den Server; der Lernsteig liest es und löscht es aus der Adresse.
  function b64url(text) { return btoa(unescape(encodeURIComponent(text))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function vonB64url(s) { const t = s.replace(/-/g, "+").replace(/_/g, "/"); return decodeURIComponent(escape(atob(t + "===".slice((t.length + 3) % 4)))); }
  const EINLADUNG_FELDER = ["name", "geboren", "klasse", "niveau", "lehrplan"];
  function einladungErstellen(daten) {
    const d = { v: 1 }; for (const f of EINLADUNG_FELDER) if (daten[f] !== undefined && daten[f] !== null) d[f] = daten[f];
    return "#einladung=" + b64url(JSON.stringify(d));
  }
  /** Liest eine Einladung aus dem Fragment (oder null). Unbekannte Felder werden verworfen. */
  function einladungLesen(fragment) {
    const m = String(fragment || "").match(/einladung=([A-Za-z0-9_-]+)/);
    if (!m) return null;
    try {
      const d = JSON.parse(vonB64url(m[1]));
      if (d.v !== 1) return null;
      const erg = {};
      if (typeof d.name === "string") erg.name = d.name.slice(0, 40);
      if (/^\d{4}-\d{2}-\d{2}$/.test(d.geboren || "")) erg.geboren = d.geboren;
      if ([7, 8, 9].includes(d.klasse)) erg.klasse = d.klasse;
      if (d.niveau && typeof d.niveau === "object") erg.niveau = Object.fromEntries(Object.entries(d.niveau).filter(([, n]) => LST.NIVEAUS.some(x => x.id === n)));
      if (d.lehrplan && typeof d.lehrplan.land === "string") erg.lehrplan = { land: d.lehrplan.land, kanton: d.lehrplan.kanton || null };
      return erg;
    } catch (e) { return null; }
  }

  return {
    KLASSEN, alle, finde, anlegen, aendern, pinStimmt, codeStimmt, neuePinMitCode, setzePin, aktiv, anmelden, abmelden, alter, GERAET, ohneGeheimnis,
    einladungErstellen, einladungLesen, pinGueltig,
    ROLLEN, aufsichten, aufsichtFinde, aufsichtAnlegen, aufsichtAnmelden, aufsichtAbmelden, aufsichtAktiv, aufsichtNeuePinMitCode,
    verbundene, mitleser, angefragt, anfragen, antworten, loesen, kontoFuerAufsicht, verbindeEingelesene, setzeGeraeteEinstellung,
  };
})();

if (typeof module !== "undefined") module.exports = LST_KONTEN;
