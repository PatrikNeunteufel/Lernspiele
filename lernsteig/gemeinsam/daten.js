/* Lernsteig — Sichern und Einlesen als Datei (nur auf Knopfdruck, wie im Eulenpfad: Entscheid LERN-5 b dort).
   Seit LERN_Session18 über den Kern (KERN.daten, docs/kern/rahmen.md 4.19; Entscheide DF1 a, DF2 a, DF4 a): ein
   Dateiformat reihe-daten für alle Apps; ältere Sicherungen des Lernsteigs (lernsteig-sicherung 1, 2) deutet der Kern um.
   - Konten ohne PIN und Verbindungen; ein Konto mit PIN reist geschützt (nur der Prüfwert seines Wiederherstellungscodes)
     und ist auf einem anderen Gerät gesperrt, bis es dort mit dem Code freigeschaltet ist (LST_KONTEN.freischalten).
   - Einlesen (Befund D4): erst wird jeder Eintrag geprüft — Konten mit KERN.person.maengel, Runden und Rekorde mit
     KERN.runden.maengel und dem Schema des Lernsteigs; Ungültiges wird gezählt, nie gespeichert; dann alles oder nichts.
   - Aufsichten reisen in Datei und Abgleich mit und kommen gesperrt an (Entscheid OA2 a, LERN_Session19; bis dahin AS1 a:
     nur eine angemeldete Aufsicht las sie ein). Geschützt wird beim Freischalten: Auf einem Gerät mit einer Aufsicht mit
     PIN reicht der Code nicht, eine von ihnen bestätigt (OA1 a, KERN.person.codeReicht) — sonst brächte eine selbst
     gebaute Datei mit bekanntem Code eine Aufsicht ohne Bestätigung auf das Gerät (Befund D5). */
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
    // die Freigabe je Gerät reist im Abgleich mit, die jüngste gewinnt (Plan C5, wie im Eulenpfad)
    freigabe: true,
    pruefung: { runde: RUNDE, rekord: REKORD },
    // eine liste, die keine Liste ist, weist schon das Schema ab
    gueltig: { runde: r => !Array.isArray(r.liste) || r.liste.every(x => x && typeof x === "object") },
    // Einträge älterer Fassungen (RA1 a, RA4 a) vor der Prüfung in die heutige Form
    umdeuten: d => LST.alteEintraegeUmdeuten(d),
  });

  /** Sicherung für die Konten mit den Kennungen ids. */
  const sichern = ids => DATEN.sichern({ ids });
  /**
   * Eigene Datei für den Abgleich über einen Ordner (gemeinsam/abgleich.js, KERN.abgleich): alle Konten und Aufsichten
   * (geschützt nach DF4 a, ohne Verbindungen), Runden, Rekorde, Löschvermerke und Freigabe dieses Geräts.
   */
  const abgleichDaten = (geraet = null) => DATEN.sichern({ art: "abgleich", geraet });

  /** Dateiname: lernsteig-<name>-<datum>.json (in .gitignore, EP4). */
  const dateiname = name => DATEN.dateiname(name || "sicherung");

  /**
   * Liest eine Sicherung ein (Objekt oder Text) und führt sie zusammen. Liefert { konten, runden, rekorde } (Anzahl neu
   * oder geändert), abgewiesen (ungültige Einträge), neu (Kennungen der Konten, die neu auf das Gerät kamen) und ids (alle
   * Konten der Datei nach dem Zusammenführen). Fehler mit Klartext, wenn die Datei keine Sicherung des Lernsteigs ist
   * oder nicht gespeichert werden kann.
   */
  function einlesen(obj) {
    const erg = DATEN.einlesen(obj);
    return { konten: erg.personen.neu + erg.personen.geaendert, runden: erg.runden, rekorde: erg.rekorde, freigabe: erg.freigabe, abgewiesen: erg.abgewiesen,
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

  /** Konto löschen mit Löschvermerk (DF2 a), samt Runden und Rekorden; die Regeln, wer darf, stehen in konten.js. */
  const loeschePerson = id => DATEN.loeschePerson(id);

  return { FORMAT, sichern, abgleichDaten, dateiname, einlesen, herunterladen, rundeGueltig, rekordGueltig, loeschePerson };
})();

if (typeof module !== "undefined") module.exports = LST_DATEN;
