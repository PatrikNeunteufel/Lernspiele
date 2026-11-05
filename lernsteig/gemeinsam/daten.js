/* Lernsteig — Sichern und Einlesen als Datei (nur auf Knopfdruck, wie im Eulenpfad: Entscheid LERN-5 b dort).
   Format: { format: "lernsteig-sicherung", version: 1, erstellt, konten: [ohne PIN und Code], runden: [...], rekorde: [...] }
   Einlesen führt zusammen: Runden und Rekorde nach Kennung (gleiche Runde zählt einmal, bei Rekorden der höhere Stand),
   Konten nach Kennung (jüngeres „geaendert“ gewinnt je Konto; PIN, Code und Verbindungen zur Aufsicht bleiben die des
   Geräts, nie aus der Datei: LST_KONTEN.GERAET).
   Abgeschaut vom Eulenpfad (LS.zusammenfuehren, docs/eulenpfad/rahmen.md 10), Zeile in docs/gemeinsame_mechaniken.md. */
"use strict";

var LST_DATEN = (function () {
  const FORMAT = "lernsteig-sicherung";

  /** Sicherung für die Konten mit den Kennungen ids (Gast: "gast"). */
  function sichern(ids) {
    const menge = new Set(ids);
    const konten = LST_KONTEN.alle().filter(k => menge.has(k.id)).map(LST_KONTEN.ohneGeheimnis);
    return {
      format: FORMAT, version: 1, erstellt: new Date().toISOString(), konten,
      runden: LST.lies("runden", []).filter(r => menge.has(r.konto)),
      rekorde: LST.lies("rekorde", []).filter(r => menge.has(r.konto)),
    };
  }

  /** Dateiname: lernsteig-<vorname>-<datum>.json (Repo-.gitignore: Vorschlag EP4). */
  function dateiname(name) {
    const n = String(name || "sicherung").toLowerCase().replace(/[^a-z0-9äöü]+/g, "-").replace(/^-|-$/g, "") || "sicherung";
    return `lernsteig-${n}-${new Date().toISOString().slice(0, 10)}.json`;
  }

  /** Liest eine Sicherung ein und führt sie zusammen. Liefert { konten, runden, rekorde } (Anzahl neu oder geändert)
      und ids (Kennungen der Konten in der Datei). */
  function einlesen(obj) {
    if (!obj || obj.format !== FORMAT || obj.version !== 1) throw new Error("Das ist keine Sicherung des Lernsteigs.");
    const erg = { konten: 0, runden: 0, rekorde: 0, ids: [] };
    // Konten
    const konten = LST_KONTEN.alle();
    for (const k of obj.konten || []) {
      if (!k || typeof k.id !== "string" || typeof k.name !== "string") continue;
      const sauber = LST_KONTEN.ohneGeheimnis(k);
      erg.ids.push(k.id);
      const i = konten.findIndex(x => x.id === k.id);
      if (i < 0) { konten.push(sauber); erg.konten++; }
      else if ((sauber.geaendert || "") > (konten[i].geaendert || "")) {
        const geraet = {}; for (const f of LST_KONTEN.GERAET) if (konten[i][f] !== undefined) geraet[f] = konten[i][f];
        konten[i] = Object.assign({}, sauber, geraet);
        erg.konten++;
      }
    }
    LST.schreibe("konten", konten);
    // Runden: gleiche Kennung zählt einmal
    const runden = LST.lies("runden", []);
    const da = new Set(runden.map(r => r.id));
    for (const r of obj.runden || []) if (r && r.id && !da.has(r.id)) { runden.push(r); da.add(r.id); erg.runden++; }
    runden.sort((a, b) => (a.zeit || "").localeCompare(b.zeit || ""));
    LST.schreibe("runden", runden);
    // Rekorde: gleiche Kennung → höherer Stand
    const rekorde = LST.lies("rekorde", []);
    for (const r of obj.rekorde || []) {
      if (!r || !r.id) continue;
      const i = rekorde.findIndex(x => x.id === r.id);
      if (i < 0) { rekorde.push(r); erg.rekorde++; } else if ((r.punkte || 0) > (rekorde[i].punkte || 0)) { rekorde[i] = r; erg.rekorde++; }
    }
    LST.schreibe("rekorde", rekorde);
    return erg;
  }

  /** Datei im Browser speichern (Download). */
  function herunterladen(obj, name) {
    const blob = new Blob([JSON.stringify(obj, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  return { FORMAT, sichern, dateiname, einlesen, herunterladen };
})();

if (typeof module !== "undefined") module.exports = LST_DATEN;
