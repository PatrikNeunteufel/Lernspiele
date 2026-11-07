/* Lernsteig — Sichern und Einlesen als Datei (nur auf Knopfdruck, wie im Eulenpfad: Entscheid LERN-5 b dort).
   Seit LERN_Session18 über den Kern (KERN.daten, docs/kern/rahmen.md 4.19; Entscheide DF1 a, DF2 a, DF4 a): ein
   Dateiformat reihe-daten für alle Apps; ältere Sicherungen des Lernsteigs (lernsteig-sicherung 1, 2) deutet der Kern um.
   - Konten ohne PIN und Verbindungen; ein Konto mit PIN reist geschützt (nur der Prüfwert seines Wiederherstellungscodes)
     und ist auf einem anderen Gerät gesperrt, bis es dort mit dem Code freigeschaltet ist (LST_KONTEN.freischalten).
   - Einlesen (Befund D4): erst wird jeder Eintrag geprüft — Konten mit KERN.person.maengel, Runden und Rekorde mit
     KERN.runden.maengel und dem Schema des Lernsteigs; Ungültiges wird gezählt, nie gespeichert; dann alles oder nichts.
   - Aufsichten in einer Datei liest nur eine angemeldete Aufsicht ein (Entscheid AS1 a, LERN_Session18); liest ein
     Jugendlicher ein, werden sie abgewiesen — sonst könnte eine selbst gebaute Datei mit bekanntem Code eine Aufsicht
     ohne Bestätigung auf das Gerät bringen (Befund D5). */
"use strict";

var LST_DATEN = (function () {
  const FORMAT = KERN.daten.FORMAT;

  // ---------- Schema der Runden und Rekorde (Kern: KERN.runden.maengel; hier die Felder des Lernsteigs) ----------
  const istUebung = id => typeof LST_KATALOG === "undefined" || !!LST_KATALOG.uebung(id);
  const RUNDE = {
    pflicht: ["aufgaben", "dauer"], inhaltBekannt: istUebung,
    // liste: je Aufgabe (KERN.runde, RA4 a); zeiten und falsch bis LERN_Session18, beim Einlesen umgedeutet
    zusatz: { fach: "text", niveau: "text", endlos: "bool", aufAnhieb: "zahl", gezeigt: "zahl", liste: "liste", mitRechner: "bool",
      gruppe: "textOderNull", gekuerzt: "zahl", abgebrochen: "bool" },
  };
  const REKORD = { pflicht: ["dauer"], inhaltBekannt: istUebung, zusatz: { niveau: "text", mitRechner: "bool", abgebrochen: "bool", alles: "bool" } };
  /** Ist die Runde lesbar für Statistik, Kompetenzstand und Aufsicht? (auch jedes Element der Liste ein Objekt) */
  const rundeGueltig = r => !KERN.runden.maengel(r, "runde", RUNDE).length && (r.liste || []).every(x => x && typeof x === "object");
  const rekordGueltig = r => !KERN.runden.maengel(r, "rekord", REKORD).length;

  // Speicher und Gerätefelder wie in den Konten; „gast“: Runden des früheren Gastkontos (bis LERN_Session16) reisen
  // ohne Konto mit, der Gast nach C2 a speichert nichts
  const DATEN = KERN.daten({
    app: "lernsteig", speicher: { praefix: LST.PRAEFIX, lies: LST.lies, schreibe: LST.schreibe, entferne: k => KERN.speicher(LST.PRAEFIX).entferne(k) },
    dateiPraefix: "lernsteig", geraetFelder: ["aufsicht", "anfragen"], ohnePerson: ["gast"],
    pruefung: { runde: RUNDE, rekord: REKORD },
    // eine liste, die keine Liste ist, weist schon das Schema ab
    gueltig: { runde: r => !Array.isArray(r.liste) || r.liste.every(x => x && typeof x === "object") },
    // Einträge älterer Fassungen (RA1 a, RA4 a) vor der Prüfung in die heutige Form
    umdeuten: d => LST.alteEintraegeUmdeuten(d),
  });

  /** Sicherung für die Konten mit den Kennungen ids. */
  const sichern = ids => DATEN.sichern({ ids });

  /** Dateiname: lernsteig-<name>-<datum>.json (in .gitignore, EP4). */
  const dateiname = name => DATEN.dateiname(name || "sicherung");

  /**
   * Liest eine Sicherung ein (Objekt oder Text) und führt sie zusammen. Liefert { konten, runden, rekorde } (Anzahl neu
   * oder geändert), abgewiesen (ungültige Einträge), neu (Kennungen der Konten, die neu auf das Gerät kamen) und ids (alle
   * Konten der Datei nach dem Zusammenführen). Fehler mit Klartext, wenn die Datei keine Sicherung des Lernsteigs ist
   * oder nicht gespeichert werden kann.
   */
  function einlesen(obj) {
    const mitAufsichten = typeof LST_KONTEN !== "undefined" && !!LST_KONTEN.aufsichtAktiv();
    const erg = DATEN.einlesen(obj, { rollen: mitAufsichten ? null : ["lernend"] });
    return { konten: erg.personen.neu + erg.personen.geaendert, runden: erg.runden, rekorde: erg.rekorde, abgewiesen: erg.abgewiesen,
      neu: erg.neueIds, ids: erg.ids };
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
