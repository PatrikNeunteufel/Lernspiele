/* Kern — Runden und Rekorde in einem Format für alle Apps (Entscheid R1 a; docs/kern/rahmen.md 4.10).
   Runde:  { id, person, zeit, inhalt, stufe, aufgaben?, fehler?, dauer?, test?, … Felder der App }
   Rekord: { id, person, zeit, inhalt, stufe, punkte, dauer?, test?, abgebrochen?, … Felder der App }
   - inhalt ist die Kennung des Spiels (Eulenpfad) oder der Übung (Lernsteig); die Oberfläche sagt weiter Spiel/Übung.
   - Die Kernfelder prüft der Kern; die Felder der App prüft er nach dem Schema, das die App meldet
     ({ <feld>: "zahl" | "text" | "bool" | "liste" | "objekt" | "zahlOderNull" | "textOderNull" }). Unbekannte Felder
     bleiben (eine neuere Fassung der App darf mehr schreiben).
   - Kennung: neue Runden „r-<Zeit>-<Zufall>“; ältere Runden ohne Kennung bekommen eine aus ihrem Inhalt
     (kennungAus), damit dieselbe alte Runde auf jedem Gerät dieselbe Kennung bekommt. */
"use strict";

(function (KERN) {
  /** Kurzer Fingerabdruck eines Werts (cyrb53 über JSON): gleich bei gleichem Inhalt, sonst fast sicher verschieden. */
  function fingerabdruck(wert) {
    const s = typeof wert === "string" ? wert : JSON.stringify(wert);
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  function zufallHex(n) {
    const c = typeof crypto !== "undefined" && crypto.getRandomValues ? crypto : null;
    const b = c ? c.getRandomValues(new Uint8Array(n)) : Array.from({ length: n }, () => Math.floor(Math.random() * 256));
    return [...b].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  /** Neue Kennung einer Runde oder eines Rekords. */
  const neueId = () => `r-${Date.now().toString(36)}-${zufallHex(5)}`;
  /** Feste Kennung für eine ältere Runde ohne Kennung: aus Person (oder Name), Zeit, Inhalt und Stufe. */
  const kennungAus = (wer, zeit, inhalt, stufe) => `r-alt-${fingerabdruck([wer, zeit, inhalt, stufe])}`;

  const istText = x => typeof x === "string" && x.length > 0 && x.length <= 200;
  const istZeit = x => typeof x === "string" && !Number.isNaN(Date.parse(x));
  const istZahl = x => typeof x === "number" && Number.isFinite(x) && x >= 0;
  const ARTEN = {
    zahl: istZahl, text: x => typeof x === "string", bool: x => typeof x === "boolean", liste: Array.isArray,
    objekt: x => !!x && typeof x === "object" && !Array.isArray(x),
    zahlOderNull: x => x === null || istZahl(x), textOderNull: x => x === null || typeof x === "string",
  };

  /**
   * Mängel einer Runde (art "runde") oder eines Rekords (art "rekord") als Liste; leer = gültig.
   * opt: { zusatz: Schema der App-Felder, pflicht: [Felder, die da sein müssen], inhaltBekannt: id → bool,
   *        personBekannt: id → bool }
   */
  function maengel(e, art = "runde", opt = {}) {
    if (!e || typeof e !== "object" || Array.isArray(e)) return ["kein Eintrag"];
    const m = [];
    if (!istText(e.id)) m.push("Kennung fehlt");
    if (!istText(e.person)) m.push("Person fehlt");
    else if (opt.personBekannt && !opt.personBekannt(e.person)) m.push("unbekannte Person");
    if (!istZeit(e.zeit)) m.push("Zeit fehlt oder ungültig");
    if (!istText(e.inhalt)) m.push("Inhalt fehlt");
    else if (opt.inhaltBekannt && !opt.inhaltBekannt(e.inhalt)) m.push(`unbekannter Inhalt ${e.inhalt}`);
    if (!istText(e.stufe)) m.push("Stufe fehlt");
    for (const f of ["aufgaben", "fehler", "dauer"]) if (e[f] !== undefined && !istZahl(e[f])) m.push(`${f} keine Zahl`);
    if (e.test !== undefined && typeof e.test !== "boolean") m.push("test kein Ja/Nein");
    if (art === "rekord" && !istZahl(e.punkte)) m.push("Punkte fehlen");
    for (const f of opt.pflicht || []) if (e[f] === undefined || e[f] === null) m.push(`${f} fehlt`);
    for (const [f, a] of Object.entries(opt.zusatz || {})) if (e[f] !== undefined && !(ARTEN[a] || (() => true))(e[f])) m.push(`${f} ist nicht ${a}`);
    return m;
  }

  /**
   * Eintrag eines älteren Formats umdeuten: Felder umbenennen (felder = { alt: neu }, etwa { spiel: "inhalt" }) und,
   * falls die Kennung fehlt, eine feste aus dem Inhalt geben. Gibt einen neuen Eintrag (der alte bleibt).
   */
  function umdeuten(e, felder = {}) {
    if (!e || typeof e !== "object") return e;
    const n = { ...e };
    for (const [alt, neu] of Object.entries(felder)) if (alt in n && !(neu in n)) { n[neu] = n[alt]; delete n[alt]; }
    // Name vor Kennung: Ältere Einträge tragen den Namen auf jedem Gerät gleich, die Kennung der Person aber erst
    // seit dem Umzug je Gerät verschieden — so bekommt dieselbe alte Runde überall dieselbe Kennung.
    if (!n.id) n.id = kennungAus(n.name || n.person || "", n.zeit, n.inhalt, n.stufe);
    return n;
  }

  /**
   * Einträge zusammenführen (Sicherung einlesen, Abgleich): nach Kennung; bei Rekorden gilt der höhere Stand
   * (Zwischenstand → Endstand). Fremde, ungültige werden abgewiesen; eigene bleiben, wie sie sind (nur `behalten`
   * entscheidet, etwa nach einem Löschvermerk). Ergebnis nach Zeit sortiert: { eintraege, neu, ersetzt, abgewiesen }.
   * opt: { art: "runde" | "rekord", pruefung (wie maengel), umbiegen: person → bleibende Kennung, behalten: e → bool }
   */
  function zusammenfuehren(eigene, fremde, opt = {}) {
    const art = opt.art || "runde";
    const biege = e => (opt.umbiegen && e && e.person ? { ...e, person: opt.umbiegen(e.person) } : e);
    const behalten = opt.behalten || (() => true);
    const nach = new Map();
    let ohneKennung = 0;
    for (const e of (eigene || []).map(biege)) if (e && behalten(e)) nach.set(e.id || `ohne-${ohneKennung++}`, e);
    const erg = { neu: 0, ersetzt: 0, abgewiesen: 0 };
    for (const roh of fremde || []) {
      const e = biege(roh);
      if (maengel(e, art, opt.pruefung).length) { erg.abgewiesen++; continue; }
      if (!behalten(e)) continue;
      const da = nach.get(e.id);
      if (!da) { nach.set(e.id, e); erg.neu++; }
      else if (art === "rekord" && e.punkte > (da.punkte || 0)) { nach.set(e.id, e); erg.ersetzt++; }
    }
    erg.eintraege = [...nach.values()].sort((a, b) => String(a.zeit || "").localeCompare(String(b.zeit || "")));
    return erg;
  }

  KERN.runden = { fingerabdruck, neueId, kennungAus, maengel, umdeuten, zusammenfuehren, ARTEN };
  KERN.fingerabdruck = fingerabdruck;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
