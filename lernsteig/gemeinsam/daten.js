/* Lernsteig — Sichern und Einlesen als Datei (nur auf Knopfdruck, wie im Eulenpfad: Entscheid LERN-5 b dort).
   Format: { format: "lernsteig-sicherung", version: 1, erstellt, konten: [ohne PIN, Code, Verbindungen], runden, rekorde }
   Einlesen (Befund D4): zuerst wird die ganze Datei geprüft — jedes Konto mit KERN.person.maengel, jede Runde und
   jeder Rekord mit einem eigenen Schema; Ungültiges wird abgewiesen und gezählt, nie gespeichert. Dann wird im
   Speicher zusammengeführt und erst am Ende geschrieben; scheitert ein Schreiben (Speicher voll), wird der alte Stand
   zurückgeschrieben: alles oder nichts.
   Zusammenführen: Konten mit KERN.person.zusammenfuehren (P1 a: gleiche Kennung, sonst gleicher Name; je Feld der
   jüngere Stand; PIN, Code und Verbindungen bleiben die des Geräts); Runden nach Kennung (gleiche zählt einmal),
   Rekorde nach Kennung (der höhere Stand); Verweise auf eine zusammengeführte Kennung werden umgebogen.
   Abgeschaut vom Eulenpfad (LS.zusammenfuehren, docs/eulenpfad/rahmen.md 10), Zeile in docs/gemeinsame_mechaniken.md. */
"use strict";

var LST_DATEN = (function () {
  const FORMAT = "lernsteig-sicherung";
  const P = KERN.person;

  /** Sicherung für die Konten mit den Kennungen ids. */
  function sichern(ids) {
    const menge = new Set(ids);
    const konten = LST_KONTEN.alle().filter(k => menge.has(k.id)).map(LST_KONTEN.ohneGeheimnis);
    return {
      format: FORMAT, version: 1, erstellt: new Date().toISOString(), konten,
      runden: LST.lies("runden", []).filter(r => menge.has(r.konto)),
      rekorde: LST.lies("rekorde", []).filter(r => menge.has(r.konto)),
    };
  }

  /** Dateiname: lernsteig-<vorname>-<datum>.json (in .gitignore, EP4). */
  function dateiname(name) {
    const n = String(name || "sicherung").toLowerCase().replace(/[^a-z0-9äöü]+/g, "-").replace(/^-|-$/g, "") || "sicherung";
    return `lernsteig-${n}-${new Date().toISOString().slice(0, 10)}.json`;
  }

  // ---------- Schema der Runden und Rekorde ----------
  const istText = x => typeof x === "string" && x.length > 0 && x.length <= 200;
  const istZeit = x => typeof x === "string" && !Number.isNaN(Date.parse(x));
  const istZahl = x => typeof x === "number" && Number.isFinite(x) && x >= 0;
  const istUebung = id => typeof LST_KATALOG === "undefined" || !!LST_KATALOG.uebung(id);
  /** Ist die Runde lesbar für Statistik, Kompetenzstand und Aufsicht? */
  function rundeGueltig(r) {
    return !!r && typeof r === "object" && istText(r.id) && istText(r.konto) && istZeit(r.zeit) && istText(r.uebung)
      && istUebung(r.uebung) && istText(r.stufe) && ["aufgaben", "fehler", "dauer"].every(f => r[f] === undefined || istZahl(r[f]))
      && (r.liste === undefined || (Array.isArray(r.liste) && r.liste.every(x => x && typeof x === "object")))
      && (r.zeiten === undefined || Array.isArray(r.zeiten)) && (r.falsch === undefined || Array.isArray(r.falsch));
  }
  function rekordGueltig(r) {
    return !!r && typeof r === "object" && istText(r.id) && istText(r.konto) && istZeit(r.zeit) && istText(r.uebung)
      && istUebung(r.uebung) && istText(r.stufe) && istZahl(r.punkte) && (r.dauer === undefined || istZahl(r.dauer));
  }

  /**
   * Liest eine Sicherung ein und führt sie zusammen. Liefert { konten, runden, rekorde } (Anzahl neu oder geändert),
   * abgewiesen (ungültige Einträge), neu (Kennungen der Konten, die neu auf das Gerät kamen) und ids (alle Konten der
   * Datei nach dem Zusammenführen). Fehler, wenn die Datei keine Sicherung ist oder nicht gespeichert werden kann.
   */
  function einlesen(obj) {
    if (!obj || typeof obj !== "object" || obj.format !== FORMAT || obj.version !== 1) throw new Error("Das ist keine Sicherung des Lernsteigs.");
    for (const f of ["konten", "runden", "rekorde"]) if (obj[f] !== undefined && !Array.isArray(obj[f])) throw new Error("Die Sicherung ist beschädigt.");
    const erg = { konten: 0, runden: 0, rekorde: 0, abgewiesen: 0, neu: [], ids: [] };

    // 1. Konten: nur Lernende (eine Sicherung trägt keine Aufsichten), im Speicher zusammenführen
    const LISTE = LST_KONTEN.LISTE;
    const vorher = { personen: roheListe("personen"), runden: roheListe("runden"), rekorde: roheListe("rekorde") };
    const fremd = [];
    for (const k of obj.konten || []) {
      if (k && typeof k === "object" && (k.rolle === undefined || k.rolle === "lernend")) fremd.push(umdeuten(k));
      else erg.abgewiesen++;
    }
    const bekannt = new Set(LISTE.alle().map(p => p.id));
    const z = P.zusammenfuehren(LISTE.alle(), fremd, { geraetFelder: LST_KONTEN.GERAET });
    erg.konten = z.neu + z.geaendert; erg.abgewiesen += z.abgewiesen;
    const umbiegen = id => z.kennungen[id] || id;
    const imErgebnis = new Set(z.personen.map(p => p.id));
    for (const k of fremd) {
      const id = umbiegen(k && k.id);
      if (imErgebnis.has(id) && !erg.ids.includes(id)) { erg.ids.push(id); if (!bekannt.has(id)) erg.neu.push(id); }
    }

    // 2. Runden und Rekorde: prüfen, Verweise umbiegen, nur zu Konten der Datei oder des Geräts
    // „gast“: Runden des Gastkontos eines Geräts (rahmen.js) reisen mit, ohne Konto (bis Gast nach C2 a nichts speichert)
    const kontoDa = id => id === "gast" || imErgebnis.has(id);
    const runden = vorher.runden.map(r => ({ ...r, konto: umbiegen(r.konto) }));
    const da = new Set(runden.map(r => r.id));
    for (const roh of obj.runden || []) {
      if (!rundeGueltig(roh) || !kontoDa(umbiegen(roh.konto))) { erg.abgewiesen++; continue; }
      if (da.has(roh.id)) continue;
      runden.push({ ...roh, konto: umbiegen(roh.konto) }); da.add(roh.id); erg.runden++;
    }
    runden.sort((a, b) => String(a.zeit).localeCompare(String(b.zeit)));
    const rekorde = vorher.rekorde.map(r => ({ ...r, konto: umbiegen(r.konto) }));
    for (const roh of obj.rekorde || []) {
      if (!rekordGueltig(roh) || !kontoDa(umbiegen(roh.konto))) { erg.abgewiesen++; continue; }
      const r = { ...roh, konto: umbiegen(roh.konto) };
      const i = rekorde.findIndex(x => x.id === r.id);
      if (i < 0) { rekorde.push(r); erg.rekorde++; } else if (r.punkte > (rekorde[i].punkte || 0)) { rekorde[i] = r; erg.rekorde++; }
    }

    // 3. Schreiben: alles oder nichts; ist nichts neu oder geändert, bleibt der Speicher unberührt
    if (!erg.konten && !erg.runden && !erg.rekorde) return erg;
    const ok = LST.schreibe("personen", z.personen) && LST.schreibe("runden", runden) && LST.schreibe("rekorde", rekorde);
    if (!ok) {
      LST.schreibe("personen", vorher.personen); LST.schreibe("runden", vorher.runden); LST.schreibe("rekorde", vorher.rekorde);
      throw new Error("Der Speicher des Browsers ist voll oder gesperrt; nichts wurde eingelesen.");
    }
    return erg;
  }
  // Rohe Liste aus dem Speicher (auch Einträge, die ältere Fassungen geschrieben haben), immer eine Liste.
  function roheListe(schluessel) { const v = LST.lies(schluessel, []); return Array.isArray(v) ? v : []; }
  /**
   * Konto einer älteren Sicherung (bis LERN_Session15: erstellt, geaendert als eine Zeit, ohne Rolle) in die Form des
   * Kerns: angelegt, geaendert je Feld, rolle „lernend“. Neuere Konten bleiben, wie sie sind.
   */
  function umdeuten(k) {
    const { erstellt, ...rest } = k;
    const p = { ...rest, rolle: "lernend" };
    if (!p.angelegt && erstellt) p.angelegt = erstellt;
    if (typeof p.geaendert === "string" || p.geaendert === undefined) {
      const t = typeof k.geaendert === "string" ? k.geaendert : (p.angelegt || "");
      p.geaendert = {};
      for (const f of Object.keys(p)) if (!["id", "angelegt", "geaendert", "frueher"].includes(f)) p.geaendert[f] = t;
    }
    return p;
  }

  /** Datei im Browser speichern (Download). */
  function herunterladen(obj, name) {
    const blob = new Blob([JSON.stringify(obj, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  return { FORMAT, sichern, dateiname, einlesen, herunterladen, rundeGueltig, rekordGueltig };
})();

if (typeof module !== "undefined") module.exports = LST_DATEN;
