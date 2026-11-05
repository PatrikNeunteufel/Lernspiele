/* Lernsteig — Sichern und Einlesen als Datei (nur auf Knopfdruck, wie im Eulenpfad: Entscheid LERN-5 b dort).
   Format: { format: "lernsteig-sicherung", version: 2, erstellt, konten: [ohne PIN, Code, Verbindungen], runden, rekorde }
   Runden und Rekorde im gemeinsamen Format der Reihe (R1 a, kern/runden.js: id, person, zeit, inhalt, stufe …);
   Version 1 (bis LERN_Session15: konto, uebung) wird beim Einlesen umgedeutet.
   Einlesen (Befund D4): zuerst wird die ganze Datei geprüft — jedes Konto mit KERN.person.maengel, jede Runde und
   jeder Rekord mit KERN.runden.maengel und dem Schema des Lernsteigs; Ungültiges wird abgewiesen und gezählt, nie
   gespeichert. Dann wird im Speicher zusammengeführt und erst am Ende geschrieben; scheitert ein Schreiben (Speicher
   voll), wird der alte Stand zurückgeschrieben: alles oder nichts.
   Zusammenführen: Konten mit KERN.person.zusammenfuehren (P1 a: gleiche Kennung, sonst gleicher Name; je Feld der
   jüngere Stand; PIN, Code und Verbindungen bleiben die des Geräts); Runden und Rekorde mit KERN.runden.zusammenfuehren
   (nach Kennung, bei Rekorden der höhere Stand); Verweise auf eine zusammengeführte Kennung werden umgebogen.
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
      format: FORMAT, version: 2, erstellt: new Date().toISOString(), konten,
      runden: LST.lies("runden", []).filter(r => menge.has(r.person)),
      rekorde: LST.lies("rekorde", []).filter(r => menge.has(r.person)),
    };
  }

  /** Dateiname: lernsteig-<vorname>-<datum>.json (in .gitignore, EP4). */
  function dateiname(name) {
    const n = String(name || "sicherung").toLowerCase().replace(/[^a-z0-9äöü]+/g, "-").replace(/^-|-$/g, "") || "sicherung";
    return `lernsteig-${n}-${new Date().toISOString().slice(0, 10)}.json`;
  }

  // ---------- Schema der Runden und Rekorde (Kern: KERN.runden.maengel; hier die Felder des Lernsteigs) ----------
  const istUebung = id => typeof LST_KATALOG === "undefined" || !!LST_KATALOG.uebung(id);
  const RUNDE = {
    pflicht: ["aufgaben", "dauer"], inhaltBekannt: istUebung,
    zusatz: { fach: "text", niveau: "text", endlos: "bool", aufAnhieb: "zahl", gezeigt: "zahl", zeiten: "liste", falsch: "liste",
      liste: "liste", mitRechner: "bool", gruppe: "textOderNull" },
  };
  const REKORD = { pflicht: ["dauer"], inhaltBekannt: istUebung, zusatz: { niveau: "text", mitRechner: "bool", abgebrochen: "bool" } };
  /** Ist die Runde lesbar für Statistik, Kompetenzstand und Aufsicht? (auch jedes Element der Liste ein Objekt) */
  const rundeGueltig = r => !KERN.runden.maengel(r, "runde", RUNDE).length && (r.liste || []).every(x => x && typeof x === "object");
  const rekordGueltig = r => !KERN.runden.maengel(r, "rekord", REKORD).length;

  /**
   * Liest eine Sicherung ein und führt sie zusammen. Liefert { konten, runden, rekorde } (Anzahl neu oder geändert),
   * abgewiesen (ungültige Einträge), neu (Kennungen der Konten, die neu auf das Gerät kamen) und ids (alle Konten der
   * Datei nach dem Zusammenführen). Fehler, wenn die Datei keine Sicherung ist oder nicht gespeichert werden kann.
   */
  function einlesen(obj) {
    if (!obj || typeof obj !== "object" || obj.format !== FORMAT || ![1, 2].includes(obj.version)) throw new Error("Das ist keine Sicherung des Lernsteigs.");
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

    // 2. Runden und Rekorde (Kern): Version 1 umdeuten, prüfen, Verweise umbiegen, nur zu Konten der Datei oder des Geräts
    // „gast“: Runden des Gastkontos eines Geräts (rahmen.js) reisen mit, ohne Konto (bis Gast nach C2 a nichts speichert)
    const kontoDa = id => id === "gast" || imErgebnis.has(id);
    const fremde = l => (l || []).map(e => (e && typeof e === "object" ? KERN.runden.umdeuten(e, LST.ALTE_FELDER) : e));
    const zuGeraet = (l, gueltig) => { const ok = []; for (const e of l) if (e && gueltig(e) && kontoDa(umbiegen(e.person))) ok.push(e); else erg.abgewiesen++; return ok; };
    const zr = KERN.runden.zusammenfuehren(vorher.runden, zuGeraet(fremde(obj.runden), rundeGueltig), { art: "runde", umbiegen });
    const zk = KERN.runden.zusammenfuehren(vorher.rekorde, zuGeraet(fremde(obj.rekorde), rekordGueltig), { art: "rekord", umbiegen });
    const runden = zr.eintraege, rekorde = zk.eintraege;
    erg.runden = zr.neu; erg.rekorde = zk.neu + zk.ersetzt;

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
