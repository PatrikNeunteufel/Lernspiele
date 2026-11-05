/* Kern — Personen einer App: Kennung, Name, Rolle, Geburtsdatum, Liste und Zusammenführen
   (Entscheide P1 a, P2 a, Vorgabe B3; Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.7).

   Person: { id, name, rolle: "lernend" | "aufsicht", art?: "eltern" | "lehrperson" (nur Aufsicht),
             gruppenleitung?: true (G2 a), geboren: "JJJJ-MM-TT" | "JJJJ-MM" | null, klasse, frueher?: [ids],
             angelegt: ISO, geaendert: { <feld>: ISO }, pin?, wiederherstellung?, … Felder der App }
   - Die Kennung entsteht beim Anlegen und ändert sich nie; sie reist bei einer Übernahme in eine andere App mit (C9).
   - Der Name ist je App und Gerät eindeutig (ohne Gross/Klein und Leerzeichen am Rand) und nur Anzeige.
   - geaendert hält je Feld die Zeit der letzten Änderung: Beim Zusammenführen gewinnt je Feld der jüngere Stand.
   - pin und wiederherstellung (kern/geheimnis.js) bleiben auf dem Gerät: ohneGeheimnis nimmt sie aus Sicherungen,
     Abgleich und Einladungen. Eine App kann weitere Gerätefelder nennen (geraetFelder). */
"use strict";

(function (KERN) {
  const ROLLEN = ["lernend", "aufsicht"];
  const AUFSICHT_ARTEN = ["eltern", "lehrperson"];
  const GEHEIM = ["pin", "wiederherstellung"];
  const VERWALTUNG = new Set(["id", "frueher", "angelegt", "geaendert"]);
  const NAME_MAX = 40;

  // ---------- Kennung ----------
  function zufallHex(n) {
    const c = typeof crypto !== "undefined" && crypto.getRandomValues ? crypto : null;
    const b = c ? c.getRandomValues(new Uint8Array(n)) : Array.from({ length: n }, () => Math.floor(Math.random() * 256));
    return [...b].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  /** Neue Kennung „p-<Zeit>-<Zufall>“, eindeutig über Geräte und Apps. */
  const neueId = () => `p-${Date.now().toString(36)}-${zufallHex(5)}`;

  // ---------- Name ----------
  const nameRein = n => String(n ?? "").trim().replace(/\s+/g, " ").slice(0, NAME_MAX);
  const nameSchluessel = n => nameRein(n).toLocaleLowerCase("de-CH");
  const nameGleich = (a, b) => nameSchluessel(a) === nameSchluessel(b) && nameSchluessel(a) !== "";

  // ---------- Geburtsdatum (B3) ----------
  const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober",
    "November", "Dezember"];
  const zwei = z => String(z).padStart(2, "0");
  function gueltigesDatum(j, m, t) {
    if (j < 1900 || j > 2100 || m < 1 || m > 12) return false;
    if (t === undefined) return true;
    const d = new Date(Date.UTC(j, m - 1, t));
    return d.getUTCFullYear() === j && d.getUTCMonth() === m - 1 && d.getUTCDate() === t;
  }
  /**
   * Eingabe → gespeicherte Form: „TT.MM.JJJJ“, „T.M.JJJJ“, „JJJJ-MM-TT“ → „JJJJ-MM-TT“; „MM.JJJJ“, „JJJJ-MM“ → „JJJJ-MM“
   * (Tag fehlt, Profile des Eulenpfads seit LERN_Session14). Kein gültiges Datum → null.
   */
  function geburtsdatumLies(text) {
    const t = String(text ?? "").trim();
    let m;
    if ((m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(t))) return gueltigesDatum(+m[3], +m[2], +m[1]) ? `${m[3]}-${zwei(m[2])}-${zwei(m[1])}` : null;
    if ((m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t))) return gueltigesDatum(+m[1], +m[2], +m[3]) ? t : null;
    if ((m = /^(\d{1,2})\.(\d{4})$/.exec(t))) return gueltigesDatum(+m[2], +m[1]) ? `${m[2]}-${zwei(m[1])}` : null;
    if ((m = /^(\d{4})-(\d{2})$/.exec(t))) return gueltigesDatum(+m[1], +m[2]) ? t : null;
    return null;
  }
  /** Gespeicherte Form → Anzeige: „07.03.2014“, ohne Tag „März 2014“; sonst "". */
  function geburtsdatumText(g) {
    const s = geburtsdatumLies(g);
    if (!s) return "";
    const [j, m, t] = s.split("-");
    return t ? `${t}.${m}.${j}` : `${MONATE[+m - 1]} ${j}`;
  }
  const tagFehlt = g => /^\d{4}-\d{2}$/.test(geburtsdatumLies(g) || "");
  /**
   * Alter in ganzen Jahren am Tag heute (Ortszeit). Ohne Tag zählt das neue Lebensjahr ab dem Ersten des
   * Geburtsmonats (höchstens einen Monat zu früh, wie bisher im Eulenpfad). Kein Datum → null.
   */
  function alter(g, heute = new Date()) {
    const s = geburtsdatumLies(g);
    if (!s) return null;
    const [j, m, t = 1] = s.split("-").map(Number);
    let a = heute.getFullYear() - j;
    const mh = heute.getMonth() + 1, th = heute.getDate();
    if (mh < m || (mh === m && th < t)) a--;
    return a >= 0 ? a : null;
  }

  // ---------- Prüfen (für Einlesen, Abgleich, Einladung; Befund D4) ----------
  /** Mängel einer Person als Liste von Sätzen; leer heisst gültig. */
  function maengel(p) {
    const m = [];
    if (!p || typeof p !== "object" || Array.isArray(p)) return ["keine Person"];
    if (typeof p.id !== "string" || !/^[A-Za-z0-9_-]{3,64}$/.test(p.id)) m.push("Kennung fehlt oder ungültig");
    if (typeof p.name !== "string" || !nameRein(p.name)) m.push("Name fehlt");
    if (!ROLLEN.includes(p.rolle)) m.push(`unbekannte Rolle ${p.rolle}`);
    if (p.art !== undefined && p.art !== null && !AUFSICHT_ARTEN.includes(p.art)) m.push(`unbekannte Art ${p.art}`);
    if (p.geboren !== undefined && p.geboren !== null && !geburtsdatumLies(p.geboren)) m.push("Geburtsdatum ungültig");
    if (p.frueher !== undefined && !(Array.isArray(p.frueher) && p.frueher.every(x => typeof x === "string"))) m.push("frühere Kennungen ungültig");
    if (p.geaendert !== undefined && (typeof p.geaendert !== "object" || p.geaendert === null || Array.isArray(p.geaendert))) m.push("Änderungszeiten ungültig");
    return m;
  }
  /** Kopie ohne Geheimnisse und Gerätefelder (Sicherung, Abgleich, Einladung, Übernahme). */
  function ohneGeheimnis(p, geraetFelder = []) {
    const c = { ...p };
    for (const f of GEHEIM.concat(geraetFelder)) delete c[f];
    return c;
  }

  // ---------- Liste im Speicher der App ----------
  /**
   * Personen einer App im Speicher (KERN.speicher(praefix)) unter einem Schlüssel (Standard „personen“).
   * felder: Vorgaben der App für neue Personen (etwa { klasse: null, fokus: [] }).
   */
  function liste(speicher, { schluessel = "personen", felder = {} } = {}) {
    const alle = () => (speicher.lies(schluessel, []) || []).filter(p => !maengel(p).length);
    const speichere = l => speicher.schreibe(schluessel, l);
    const finde = id => alle().find(p => p.id === id || (p.frueher || []).includes(id)) || null;
    const findeName = name => alle().find(p => nameGleich(p.name, name)) || null;
    const nameFrei = (name, ausserId = null) => !!nameRein(name) && !alle().some(p => p.id !== ausserId && nameGleich(p.name, name));

    /** Neue Person anlegen; Fehler, wenn der Name fehlt oder vergeben ist. Gibt die Person zurück. */
    function anlegen(daten = {}) {
      const name = nameRein(daten.name);
      if (!name) throw new Error("Der Name fehlt.");
      if (!nameFrei(name)) throw new Error(`Den Namen „${name}“ gibt es schon.`);
      const jetzt = new Date().toISOString();
      const p = { ...felder, ...daten, id: daten.id || neueId(), name, rolle: daten.rolle || "lernend", angelegt: jetzt, geaendert: {} };
      if (p.geboren !== undefined && p.geboren !== null) p.geboren = geburtsdatumLies(p.geboren);
      // Zeit nur für gesetzte Felder (und Name, Rolle), nicht für Vorgaben der App: sonst überschriebe eine leere
      // Vorgabe beim Zusammenführen den echten Wert eines anderen Geräts.
      for (const k of new Set([...Object.keys(daten), "name", "rolle"])) if (!VERWALTUNG.has(k)) p.geaendert[k] = jetzt;
      const fehler = maengel(p);
      if (fehler.length) throw new Error(fehler.join(", "));
      if (!speichere(alle().concat(p))) throw new Error("Der Speicher des Browsers ist voll oder gesperrt.");
      return p;
    }
    /** Felder ändern; jedes geänderte Feld bekommt seine Zeit. Gibt die Person zurück (oder null). */
    function aendere(id, daten) {
      const l = alle(); const i = l.findIndex(p => p.id === id);
      if (i < 0) return null;
      const jetzt = new Date().toISOString();
      const p = { ...l[i], geaendert: { ...(l[i].geaendert || {}) } };
      for (const [k, v] of Object.entries(daten)) {
        if (VERWALTUNG.has(k)) continue;
        if (k === "name") {
          const n = nameRein(v);
          if (!nameFrei(n, id)) throw new Error(`Den Namen „${n}“ gibt es schon.`);
          p.name = n;
        } else p[k] = k === "geboren" && v !== null ? geburtsdatumLies(v) : v;
        p.geaendert[k] = jetzt;
      }
      const fehler = maengel(p);
      if (fehler.length) throw new Error(fehler.join(", "));
      l[i] = p;
      if (!speichere(l)) throw new Error("Der Speicher des Browsers ist voll oder gesperrt.");
      return p;
    }
    function entferne(id) { speichere(alle().filter(p => p.id !== id)); }
    return { schluessel, alle, finde, findeName, nameFrei, anlegen, aendere, entferne, speichere };
  }

  // ---------- Zusammenführen (Sicherung einlesen, Abgleich zwischen Geräten) ----------
  const zeit = (p, k) => (p.geaendert && p.geaendert[k]) || "";
  /** Ältere Person zuerst (angelegt, dann Kennung): ihre Kennung bleibt. */
  const aelter = (a, b) => ((a.angelegt || "") < (b.angelegt || "") || ((a.angelegt || "") === (b.angelegt || "") && a.id <= b.id) ? a : b);
  /** Zwei Fassungen derselben Person verbinden: je Feld der jüngere Stand, Geheimnisse und Gerätefelder von hier. */
  function verbinde(hier, dort, geraetFelder) {
    const bleibt = aelter(hier, dort), andere = bleibt === hier ? dort : hier;
    const neu = { ...hier, id: bleibt.id, angelegt: bleibt.angelegt, geaendert: { ...(hier.geaendert || {}) } };
    for (const k of Object.keys(dort)) {
      if (VERWALTUNG.has(k) || GEHEIM.includes(k) || geraetFelder.includes(k)) continue;
      if (!(k in hier) || zeit(dort, k) > zeit(hier, k)) { neu[k] = dort[k]; neu.geaendert[k] = zeit(dort, k); }
    }
    const frueher = new Set([...(hier.frueher || []), ...(dort.frueher || [])]);
    if (andere.id !== bleibt.id) frueher.add(andere.id);
    frueher.delete(bleibt.id);
    if (frueher.size) neu.frueher = [...frueher]; else delete neu.frueher;
    return { neu, alt: andere.id !== bleibt.id ? andere.id : null };
  }
  /**
   * Fremde Personen in die eigenen führen (P1 a): gleiche Kennung (auch eine frühere) → verbinden; sonst gleicher
   * Name → verbinden, die ältere Kennung bleibt, die andere wird frühere Kennung; sonst neu. Ungültige werden
   * abgewiesen. Gibt { personen, neu, geaendert, abgewiesen, kennungen: { <alt>: <neu> } } — mit kennungen biegt die
   * App Verweise (Protokoll, Rekorde) auf die bleibende Kennung um.
   */
  function zusammenfuehren(eigene, fremde, { geraetFelder = [] } = {}) {
    const personen = eigene.map(p => ({ ...p }));
    const erg = { personen, neu: 0, geaendert: 0, abgewiesen: 0, kennungen: {} };
    for (const roh of Array.isArray(fremde) ? fremde : []) {
      if (maengel(roh).length) { erg.abgewiesen++; continue; }
      const f = ohneGeheimnis(roh, geraetFelder);
      const ids = new Set([f.id, ...(f.frueher || [])]);
      let i = personen.findIndex(p => ids.has(p.id) || (p.frueher || []).some(x => ids.has(x)));
      if (i < 0) i = personen.findIndex(p => nameGleich(p.name, f.name));
      if (i < 0) { personen.push(f); erg.neu++; continue; }
      const vorher = JSON.stringify(personen[i]);
      const { neu, alt } = verbinde(personen[i], f, geraetFelder);
      // Ein jüngerer Name von dort, den hier schon jemand anders trägt, gilt nicht (Namen bleiben eindeutig).
      if (!nameGleich(neu.name, personen[i].name) && personen.some((p, j) => j !== i && nameGleich(p.name, neu.name))) {
        neu.name = personen[i].name; neu.geaendert.name = zeit(personen[i], "name");
      }
      if (alt) erg.kennungen[alt] = neu.id;
      if (personen[i].id !== neu.id) erg.kennungen[personen[i].id] = neu.id;
      personen[i] = neu;
      if (JSON.stringify(neu) !== vorher) erg.geaendert++;
    }
    return erg;
  }

  KERN.person = {
    ROLLEN, AUFSICHT_ARTEN, GEHEIM, NAME_MAX, neueId, nameRein, nameGleich,
    geburtsdatumLies, geburtsdatumText, tagFehlt, alter, maengel, ohneGeheimnis, liste, zusammenfuehren,
  };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
