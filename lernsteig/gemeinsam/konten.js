/* Lernsteig — Personen: Jugendliche und Aufsichten in einer Liste (Entscheide AU1 a, KT1 a, GE1 b/B3, EL1 a, DS1 a,
   P1 a, P2 a). Alles nur im Browser. Baut auf dem Kern auf: KERN.person (Kennung, Name, Geburtsdatum, Liste,
   Zusammenführen) und KERN.geheimnis (PIN, Code); docs/kern/rahmen.md 4.6–4.7.
   Person (lernsteig:personen): { id, name (Vorname), rolle: "lernend" | "aufsicht", art (Aufsicht: eltern | lehrperson),
     geboren ("JJJJ-MM-TT", ohne Tag "JJJJ-MM"), klasse ("7"–"9"), lehrplan { land, kanton }, niveau { <fach>: n },
     pruefungsziel, rechnerModell, pin?, wiederherstellung?, aufsicht?: [Kennungen], anfragen?: [Kennungen],
     angelegt, geaendert: { <feld>: ISO } }
   Lernende: PIN freiwillig; mit PIN gilt die Anmeldung nur im geöffneten Tab (sessionStorage lernsteig:angemeldet).
   Anmeldung (Plan C1): ein Platz für alle — Jugendlicher, Aufsicht oder Gast (C2 a, nur im Tab, nichts gespeichert).
   Aufsicht: PIN Pflicht, angemeldet nur im Tab (sessionStorage lernsteig:angemeldet); eine weitere Aufsicht nur mit
   Bestätigung durch eine bestehende (wie Eulenpfad KR2 a; Befund D5). Sie sieht nur verbundene Konten; verbunden
   wird, wenn die Aufsicht das Konto anlegt, der Jugendliche angemeldet zustimmt oder die Aufsicht eine Sicherung mit
   einem neuen Konto einliest (AF2 a, nur neue Konten: D5).
   Umzug: lernsteig:konten und lernsteig:aufsichten (bis LERN_Session15) werden beim ersten Laden in
   lernsteig:personen übertragen, mit den bisherigen Kennungen (Runden und Rekorde verweisen weiter richtig). */
"use strict";

var LST_KONTEN = (function () {
  const P = KERN.person, G = KERN.geheimnis;
  // Oberstufe SG: 1. bis 3. Oberstufe = 7. bis 9. Schuljahr (docs/lernsteig/lehrplan/lehrplan_sg_sek1.md 1)
  const KLASSEN = [{ id: "7", name: "1. Oberstufe (7. Schuljahr)" }, { id: "8", name: "2. Oberstufe (8. Schuljahr)" }, { id: "9", name: "3. Oberstufe (9. Schuljahr)" }];
  const ROLLEN = [{ id: "eltern", name: "Eltern" }, { id: "lehrperson", name: "Lehrperson" }];
  /** Felder, die nur auf diesem Gerät gelten: Geheimnisse und Verbindungen zu Aufsichten des Geräts. */
  const GERAET = ["pin", "wiederherstellung", "aufsicht", "anfragen"];
  // Geschrieben über LST.schreibe, damit der Abgleich über einen Ordner Änderungen an Konten sieht (LST.beiAenderung)
  // Derselbe Speicher wie LST (grosse Schlüssel in IndexedDB, Kern 1.34.0), nicht eine zweite Instanz
  const SPEICHER = { ...LST.SPEICHER, lies: LST.lies, schreibe: LST.schreibe, entferne: LST.entferne };
  const LISTE = P.liste(SPEICHER, { schluessel: "personen" });

  // ---------- Umzug der alten Listen (einmal) ----------
  (function umzug() {
    const konten = SPEICHER.lies("konten", null), aufs = SPEICHER.lies("aufsichten", null);
    if (konten === null && aufs === null) return;
    const zeitVon = x => x.geaendert || x.erstellt || new Date().toISOString();
    const umgedeutet = (x, rolle, extra) => {
      const { erstellt, geaendert, wiederherstellung, rolle: alteRolle, ...rest } = x;
      const p = { ...rest, ...extra, rolle, angelegt: erstellt || zeitVon(x), geaendert: {} };
      if (wiederherstellung) p.wiederherstellung = wiederherstellung.code ? wiederherstellung : { code: wiederherstellung };
      for (const k of Object.keys(p)) if (!["id", "angelegt", "geaendert"].includes(k)) p.geaendert[k] = zeitVon(x);
      return p;
    };
    const neu = [...(konten || []).map(k => umgedeutet(k, "lernend", {})),
      ...(aufs || []).map(a => umgedeutet(a, "aufsicht", { art: a.rolle }))].filter(p => !P.maengel(p).length);
    const { personen } = P.zusammenfuehren(LISTE.alle(), neu, { geraetFelder: [] });
    // Geheimnisse und Verbindungen der alten Einträge bleiben (sie sind von diesem Gerät)
    for (const p of personen) { const alt = neu.find(x => x.id === p.id); if (alt) for (const f of GERAET) if (alt[f] !== undefined) p[f] = alt[f]; }
    if (LISTE.speichere(personen)) { SPEICHER.entferne("konten"); SPEICHER.entferne("aufsichten"); }
  })();

  // ---------- Lernende ----------
  const alle = () => LISTE.alle().filter(p => p.rolle === "lernend");
  const finde = id => { const p = LISTE.finde(id); return p && p.rolle === "lernend" ? p : null; };

  /** Legt ein Konto an. Mit PIN liefert es zusätzlich den Wiederherstellungscode (nur jetzt sichtbar). */
  async function anlegen(daten) {
    const felder = {
      // Klasse als Text wie in KLASSEN („7“–„9“); Formulare liefern teils Zahlen
      name: daten.name, rolle: "lernend", geboren: daten.geboren || null, klasse: daten.klasse ? String(daten.klasse) : null,
      lehrplan: daten.lehrplan || { land: "CH", kanton: null }, niveau: daten.niveau || {},
      pruefungsziel: daten.pruefungsziel || "keins", rechnerModell: daten.rechnerModell || "allgemein",
    };
    if (!P.nameRein(felder.name)) throw new Error("Vorname fehlt");
    let code = null;
    if (daten.pin) {
      felder.pin = await G.pin(daten.pin);
      const w = await G.wiederherstellung(); felder.wiederherstellung = w.wiederherstellung; code = w.code;
    }
    return { konto: LISTE.anlegen(felder), code };
  }
  /** Felder eines Kontos ändern (ohne Verbindungen, Geheimnisse, Kennung und Rolle — die ändern nur eigene Abläufe). */
  function aendern(k) {
    const vorher = LISTE.finde(k.id); if (!vorher) return;
    const daten = {};
    for (const [f, v] of Object.entries(k)) {
      if (["id", "rolle", "angelegt", "geaendert", "frueher"].includes(f) || GERAET.includes(f)) continue;
      if (JSON.stringify(v) !== JSON.stringify(vorher[f])) daten[f] = v;
    }
    if (Object.keys(daten).length) LISTE.aendere(k.id, daten);
  }
  const pinStimmt = (k, pin) => G.pinStimmt(pin, k && k.pin);
  const codeStimmt = (k, code) => G.codeStimmt(code, k && k.wiederherstellung);

  /** PIN vergessen: mit dem Code eine neue PIN setzen; es gibt gleich einen neuen Code. */
  async function neuePinMitCode(id, code, neuePin) {
    const k = LISTE.finde(id);
    if (!k || !(await codeStimmt(k, code))) throw new Error("Der Code stimmt nicht.");
    const pin = await G.pin(neuePin);
    const w = await G.wiederherstellung({}, k.wiederherstellung || {});
    LISTE.aendere(id, { pin, wiederherstellung: w.wiederherstellung });
    return w.code;
  }
  /** PIN setzen oder entfernen (für das angemeldete Konto); gibt den neuen Code oder null. */
  async function setzePin(id, pin) {
    if (!finde(id)) return null;
    if (!pin) { LISTE.aendere(id, { pin: null, wiederherstellung: null }); return null; }
    const p = await G.pin(pin);
    const w = await G.wiederherstellung();
    LISTE.aendere(id, { pin: p, wiederherstellung: w.wiederherstellung });
    return w.code;
  }

  // ---------- Anmeldung ----------
  // Ein Platz wie im Eulenpfad (Plan C1, Kern kern/anmeldung.js, docs/kern/rahmen.md 4.11): angemeldet ist eine Person —
  // ein Jugendlicher oder eine Aufsicht — oder der Gast. Gemerkt wird die Kennung in lernsteig:aktiv; wer eine PIN hat
  // (jede Aufsicht), gilt nur im geöffneten Tab (sessionStorage lernsteig:angemeldet). Der Gast (C2 a) gilt nur im Tab
  // (lernsteig:gast), für ihn wird nichts gespeichert; die Aufsicht schaltet ihn je Gerät ab (Einstellung gast „aus“).
  // Bis LERN_Session16 hatte die Aufsicht einen eigenen Tab-Schlüssel lernsteig:aufsicht; wer dort angemeldet war, meldet
  // sich einmal neu an.
  const gastErlaubt = () => LST.lies("einstellungen", {}).gast !== "aus";
  const PLATZ = KERN.anmeldung.platz({ speicher: SPEICHER, gewaehlt: "aktiv", tab: "angemeldet", finde: id => LISTE.finde(id),
    gast: { tab: "gast", erlaubt: gastErlaubt } });
  /** Wer angemeldet ist (Jugendlicher oder Aufsicht), sonst null. */
  const angemeldet = () => PLATZ.aktiv();
  /** Das aktive Konto eines Jugendlichen: zuletzt gewählt; mit PIN nur, wenn in diesem Tab angemeldet. Sonst null. */
  const aktiv = () => { const p = angemeldet(); return p && p.rolle === "lernend" ? p : null; };
  /** Meldet einen Jugendlichen an. Mit PIN muss pin stimmen. */
  async function anmelden(id, pin) {
    if (!finde(id)) throw new Error("Konto nicht gefunden");
    const k = await PLATZ.anmelden(id, pin);
    if (!k) throw new Error("Die PIN stimmt nicht.");
    return k;
  }
  /** Abmelden, wer auch immer angemeldet ist (auch der Gast). */
  const abmelden = () => PLATZ.abmelden();
  /** Als Gast weiter (nur in diesem Tab); false, wenn die Aufsicht den Gast auf diesem Gerät abgeschaltet hat. */
  const alsGast = () => PLATZ.alsGast();
  const istGast = () => PLATZ.istGast();

  /** Alter in ganzen Jahren (B3: auch ohne Tag). */
  const alter = (geboren, heute = new Date()) => P.alter(geboren, heute);
  /** Kopie ohne Geheimnisse und Gerätebezüge für Sicherungen, Abgleich und Einladungen. */
  const ohneGeheimnis = k => P.ohneGeheimnis(k, GERAET);

  // ---------- Aufsicht (AU1 a) ----------
  // Freiwillig, für Eltern und Lehrpersonen. Sieht nur verbundene Konten; der Jugendliche sieht, wer mitliest.
  // Grenze (Annahme, in rahmen.md 5d): Alles liegt im Browser; die PIN schützt vor Versehen und Neugier am selben Gerät,
  // nicht vor jemandem, der die Entwicklerwerkzeuge des Browsers öffnet. Echter Schutz braucht den Server (DS1 a).
  const aufsichten = () => LISTE.alle().filter(p => p.rolle === "aufsicht");
  const aufsichtFinde = id => { const p = LISTE.finde(id); return p && p.rolle === "aufsicht" ? p : null; };

  /**
   * Legt eine Aufsicht an (PIN Pflicht) und meldet sie im Tab an. Gibt es schon eine Aufsicht auf diesem Gerät,
   * bestätigt eine von ihnen mit ihrer PIN (daten.bestaetigung = { id, pin }; wie Eulenpfad KR2 a, Befund D5).
   * Liefert { aufsicht, code }.
   */
  async function aufsichtAnlegen(daten) {
    if (!ROLLEN.some(r => r.id === daten.art)) throw new Error("Rolle fehlt");
    // Bestätigung im Kern (KERN.rollen, KR2 a, D5): nötig, sobald es eine Aufsicht mit PIN gibt — eine gesperrte zählt
    // nicht, sie könnte nicht bestätigen
    if (KERN.rollen.brauchtBestaetigung(LISTE)) await KERN.rollen.bestaetige(LISTE, daten.bestaetigung || {});
    // Sicherheitsfrage (Stufe 3 von „PIN vergessen“, RL2 a): wie im Eulenpfad Pflicht beim Anlegen
    if (!String(daten.frage || "").trim() || !String(daten.antwort || "").trim()) throw new Error("Bitte eine Sicherheitsfrage und ihre Antwort eingeben.");
    const pin = await G.pin(daten.pin);
    const w = await G.wiederherstellung({ frage: daten.frage, antwort: daten.antwort });
    const a = LISTE.anlegen({ name: daten.name, rolle: "aufsicht", art: daten.art, pin, wiederherstellung: w.wiederherstellung });
    await PLATZ.anmelden(a.id, daten.pin);
    return { aufsicht: a, code: w.code };
  }
  async function aufsichtAnmelden(id, pin) {
    const a = aufsichtFinde(id);
    if (!a) throw new Error("Aufsicht nicht gefunden");
    if (!(await PLATZ.anmelden(a.id, pin))) throw new Error("Die PIN stimmt nicht.");
    return a;
  }
  const aufsichtAbmelden = () => PLATZ.abmelden();
  /** Die angemeldete Aufsicht oder null (derselbe Platz wie die Jugendlichen). */
  const aufsichtAktiv = () => { const p = angemeldet(); return p && p.rolle === "aufsicht" ? p : null; };
  // ---------- Gesperrte Personen (DF4 a, LERN_Session18) ----------
  // Kam ein Konto oder eine Aufsicht mit PIN über eine Sicherung von einem anderen Gerät, reist die PIN nicht mit: hier
  // ist die Person gesperrt (KERN.person.gesperrt), bis sie mit ihrem Wiederherstellungscode und einer neuen PIN
  // freigeschaltet ist — eine Aufsicht auch mit der Bestätigung einer anderen Aufsicht dieses Geräts. Der Code bleibt.
  const gesperrt = id => P.gesperrt(LISTE.finde(id));
  /** Reicht für diese gesperrte Person ihr Code? Eine Aufsicht nur, solange das Gerät keine Aufsicht mit PIN hat (OA1 a). */
  const codeReicht = id => P.codeReicht(LISTE, id);
  /** Gesperrte Person freischalten und anmelden. weg: { code } oder (nur Aufsicht) { bestaetigung: { id, pin } }. */
  async function freischalten(id, neuePin, weg = {}) {
    const p = LISTE.finde(id);
    if (!p) throw new Error("Konto nicht gefunden");
    if (weg.bestaetigung) {
      if (p.rolle !== "aufsicht") throw new Error(KERN.rollen.BESTAETIGEN);
      await KERN.rollen.bestaetige(LISTE, weg.bestaetigung, { ausser: p.id });
      await P.freischalten(LISTE, p.id, neuePin, { bestaetigt: true });
    } else await P.freischalten(LISTE, p.id, neuePin, { code: weg.code });
    return PLATZ.anmelden(p.id, neuePin);
  }
  /**
   * PIN vergessen für eine Aufsicht (Kern KERN.rollen.neuePin, RL2 a): weg = { code } | { antwort } | { bestaetigung:
   * { id, pin } } (eine andere Aufsicht dieses Geräts). Setzt die neue PIN, gibt gleich einen neuen Code aus, bricht eine
   * laufende Frist ab und meldet die Aufsicht an. Gibt den neuen Code zurück.
   */
  async function aufsichtPinVergessen(id, neuePin, weg) {
    if (!aufsichtFinde(id)) throw new Error("Aufsicht nicht gefunden");
    const { code } = await KERN.rollen.neuePin(LISTE, id, neuePin, weg);
    FRIST.abbrechen();
    await PLATZ.anmelden(id, neuePin);
    return code;
  }

  // ---------- Zurücksetzen mit Frist (Stufe 4, RL2 a) ----------
  // lernsteig:zuruecksetzen = { angefordert, ab }; auf der Anmeldung für alle sichtbar, mit PIN oder Code einer Aufsicht
  // abzubrechen. Nach Ablauf werden die Aufsichten auf diesem Gerät entfernt samt ihren Verbindungen zu den Konten,
  // ohne Löschvermerk; danach legt „Ich bin neu“ ohne Bestätigung eine neue an.
  const FRIST = KERN.rollen.frist({ speicher: SPEICHER });
  const fristStand = () => FRIST.stand();
  const fristAnfordern = () => FRIST.anfordern();
  /** Bricht die Eingabe (PIN oder Code einer Aufsicht) die Frist ab? Dann ist sie abgebrochen; true. */
  async function fristAbbrechenMit(eingabe) {
    if (!(await KERN.rollen.abbrechbarMit(LISTE, eingabe))) return false;
    FRIST.abbrechen();
    return true;
  }
  /** Ist die Frist abgelaufen, werden die Aufsichten entfernt; gibt dann true. */
  function fristFaellig() {
    if (!FRIST.abgelaufen()) return false;
    KERN.rollen.zuruecksetzen(LISTE, { art: "entfernen", verweise: ["aufsicht", "anfragen"] });
    return true;
  }

  // ---------- Verbindungen: im Konto aufsicht [Kennungen] und anfragen [Kennungen] ----------
  const hat = (k, feld, aid) => (k[feld] || []).includes(aid);
  function setzeFeld(kontoId, feld, f) {
    const k = finde(kontoId); if (!k) return;
    const neu = f(k[feld] || []);
    LISTE.aendere(kontoId, { [feld]: neu.length ? neu : undefined });
  }
  const verbundene = aid => alle().filter(k => hat(k, "aufsicht", aid));
  const angefragt = aid => alle().filter(k => hat(k, "anfragen", aid) && !hat(k, "aufsicht", aid));
  /** Wer bei einem Konto mitliest (für den Jugendlichen sichtbar) und wer angefragt hat. */
  function mitleser(kontoId) {
    const k = finde(kontoId) || {};
    const info = id => { const a = aufsichtFinde(id); return a ? { id: a.id, name: a.name, art: a.art } : null; };
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
  /**
   * Konten, die eine Sicherung beim Einlesen durch die Aufsicht **neu** auf das Gerät gebracht hat, werden mit ihr
   * verbunden (AF2 a: die Übergabe der Datei ist die Zustimmung). Konten, die schon auf dem Gerät waren, nicht — sonst
   * verbände eine Datei mit fremder Kennung ohne Zustimmung (Befund D5).
   */
  function verbindeEingelesene(neueIds) {
    const a = brauchtAufsicht();
    for (const id of neueIds || []) if (finde(id)) setzeFeld(id, "aufsicht", l => l.includes(a.id) ? l : l.concat(a.id));
  }
  // ---------- Ausblenden und Löschen (KE1 a, KE2 a, LERN_Session20) ----------
  // Ausblenden (KERN.person.ausgeblendet): nur auf diesem Gerät nicht zeigen, die Person bleibt in den Daten und reist im
  // Abgleich weiter. Die angemeldete Aufsicht blendet eine gesperrte Aufsicht aus (KE1 a: sie ist auf ihrem eigenen Gerät
  // echt, ein Löschvermerk nähme sie dort mit) und ein Konto, das nicht mit ihr verbunden ist (KE2 a: ohne Verbindung
  // kein Recht an seinen Daten). Löschen mit Löschvermerk (auf allen Geräten des Abgleichs): der Jugendliche selbst
  // (mit PIN, wenn er eine hat, und seinem Namen) oder eine Aufsicht, mit der das Konto verbunden ist.
  const AUSGEBLENDET = P.ausgeblendet(LISTE, SPEICHER);
  /** Konten und Aufsichten, die dieses Gerät zeigt (Anmeldung, Personen-Knopf, Anfragen). */
  const alleGezeigt = () => AUSGEBLENDET.gezeigt(alle());
  const aufsichtenGezeigt = () => AUSGEBLENDET.gezeigt(aufsichten());
  const ausgeblendete = () => AUSGEBLENDET.personen();
  /** Darf die angemeldete Aufsicht diese Person auf dem Gerät ausblenden? */
  function darfAusblenden(id) {
    const a = aufsichtAktiv(), p = LISTE.finde(id);
    if (!a || !p || p.id === a.id) return false;
    return p.rolle === "aufsicht" ? gesperrt(p.id) : !hat(p, "aufsicht", a.id);
  }
  function ausblenden(id) {
    brauchtAufsicht();
    if (!darfAusblenden(id)) throw new Error("Ausblenden lässt sich nur eine gesperrte Aufsicht oder ein Konto, das nicht mit Ihnen verbunden ist.");
    AUSGEBLENDET.ausblenden(id);
  }
  function zeigen(id) { brauchtAufsicht(); AUSGEBLENDET.zeigen(id); }
  /** Darf, wer angemeldet ist, dieses Konto löschen? Der Jugendliche sein eigenes, die Aufsicht ein verbundenes. */
  function darfLoeschen(id) {
    const k = finde(id); if (!k) return false;
    const a = aufsichtAktiv(), selbst = aktiv();
    return (selbst && selbst.id === k.id) || (!!a && hat(k, "aufsicht", a.id));
  }
  /**
   * Konto löschen mit Löschvermerk (KERN.daten, DF2 a): Konto, Runden und Rekorde, auf allen Geräten des Abgleichs.
   * Der Jugendliche bestätigt mit seinem Namen und, wenn er eine hat, seiner PIN: bestaetigung = { name, pin }.
   */
  async function loeschen(id, bestaetigung = {}) {
    const k = finde(id);
    if (!k) throw new Error("Konto nicht gefunden");
    if (!darfLoeschen(id)) throw new Error("Löschen kann nur der Jugendliche selbst oder eine Aufsicht, mit der das Konto verbunden ist.");
    const selbst = aktiv() && aktiv().id === id;
    if (selbst) {
      if (!P.nameGleich(bestaetigung.name || "", k.name)) throw new Error("Bitte deinen Vornamen genau so eintragen, wie er im Konto steht.");
      if (k.pin && !(await pinStimmt(k, bestaetigung.pin))) throw new Error("Die PIN stimmt nicht.");
    }
    LST_DATEN.loeschePerson(id);
    AUSGEBLENDET.zeigen(id);
    if (selbst) abmelden();
  }

  /** Einstellungen des Geräts (TR1 a: Rechner; Dezimalzeichen; Gast C2 a) setzt nur eine angemeldete Aufsicht. */
  function setzeGeraeteEinstellung(feld, wert) {
    brauchtAufsicht();
    if (!["rechner", "dezimal", "gast"].includes(feld)) throw new Error("Unbekannte Einstellung");
    const e = LST.lies("einstellungen", {}); e[feld] = wert; LST.schreibe("einstellungen", e);
  }

  // ---------- Einladung (EL1 a) ----------
  // Format im Kern (kern/einladung.js, docs/kern/rahmen.md 4.13): Link „…/lernsteig/#einladung=<base64url(JSON)>“ oder
  // Datei „lernsteig-einladung.json“, nur Stammdaten { name, geboren, klasse, niveau, lehrplan }. Das Fragment geht
  // nicht an den Server; der Lernsteig liest es und löscht es aus der Adresse. Hier prüft der Lernsteig seine Felder.
  const EINLADUNG_PRUEFUNG = {
    ziel: "lernsteig",
    klasse: k => (KLASSEN.some(x => x.id === String(k)) ? String(k) : null),
    niveau: n => (n && typeof n === "object" && !Array.isArray(n)
      ? Object.fromEntries(Object.entries(n).filter(([, w]) => LST.NIVEAUS.some(x => x.id === w))) : null),
    lehrplan(l) {
      const LP = typeof LST_LEHRPLAENE !== "undefined" ? LST_LEHRPLAENE : null;
      if (!l || typeof l.land !== "string" || (LP && !LP.LAENDER.some(x => x.id === l.land))) return null;
      const kanton = typeof l.kanton === "string" && (!LP || (LP.KANTONE || []).some(k => k.id === l.kanton)) ? l.kanton : null;
      return { land: l.land, kanton };
    },
  };
  /** Fragment „#einladung=…“ für eine Einladung in den Lernsteig. */
  const einladungErstellen = (daten, von) => KERN.einladung.fragment(KERN.einladung.erstellen(daten, { ziel: "lernsteig", von }));
  /** Liest eine Einladung aus Fragment oder Datei (Objekt), oder null. Unbekannte und ungültige Felder fallen weg (D12). */
  function einladungLesen(eingabe) {
    const e = KERN.einladung.lesen(eingabe, EINLADUNG_PRUEFUNG);
    if (e) delete e.von; // Herkunft nur zur Anzeige, nicht ins Konto
    return e;
  }

  return {
    KLASSEN, alle, finde, anlegen, aendern, pinStimmt, codeStimmt, neuePinMitCode, setzePin, aktiv, anmelden, abmelden, alter, GERAET, ohneGeheimnis,
    angemeldet, alsGast, istGast, gastErlaubt,
    einladungErstellen, einladungLesen, pinGueltig: G.pinGueltig,
    ROLLEN, aufsichten, aufsichtFinde, aufsichtAnlegen, aufsichtAnmelden, aufsichtAbmelden, aufsichtAktiv, aufsichtPinVergessen,
    gesperrt, codeReicht, freischalten, fristStand, fristAnfordern, fristAbbrechenMit, fristFaellig, FRIST_TAGE: KERN.rollen.TAGE,
    verbundene, mitleser, angefragt, anfragen, antworten, loesen, kontoFuerAufsicht, verbindeEingelesene, setzeGeraeteEinstellung,
    alleGezeigt, aufsichtenGezeigt, ausgeblendete, darfAusblenden, ausblenden, zeigen, darfLoeschen, loeschen,
    LISTE,
  };
})();

if (typeof module !== "undefined") module.exports = LST_KONTEN;
