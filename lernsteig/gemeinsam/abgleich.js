/* Lernsteig — Abgleich zwischen Geräten über einen Ordner (Plan C5; Kern KERN.abgleich, docs/kern/rahmen.md 4.20;
   Entscheide DF3 a, OA1 a, OA2 a, LERN_Session19). Wie im Eulenpfad: Jedes Gerät schreibt seine Daten in einen Ordner,
   den die Aufsicht in der Verwaltung wählt (Netzwerkordner oder der Ordner eines Cloud-Dienstes), und zwar nur in seine
   eigene Datei lernsteig-sync-<gerät>.json, und liest die der anderen. Selbsttätig beim Öffnen der Startseite, wenn sie
   wieder sichtbar wird, und nach Änderungen an Konten, Runden, Rekorden und der Freigabe (die jüngste gewinnt). Ohne Ordner (Browser ohne File System
   Access) derselbe Abgleich über eine Datei.
   - PIN, Code und Verbindungen bleiben auf dem Gerät; Konten und Aufsichten mit PIN reisen geschützt und kommen gesperrt
     an (DF4 a). Eine Aufsicht schaltet ihr Code nur auf einem Gerät ohne Aufsicht mit PIN frei, sonst bestätigt eine
     Aufsicht des Geräts (OA1 a) — darum dürfen Aufsichten mitreisen, auch wenn beim Abgleich ein Jugendlicher übt (OA2 a).
   - Neue Konten werden beim Abgleich mit niemandem verbunden (das tut nur das Einlesen durch die Aufsicht, AF2 a). */
"use strict";

var LST_ABGLEICH = (function () {
  const AB = KERN.abgleich({
    speicher: { praefix: LST.PRAEFIX, lies: LST.lies, schreibe: LST.schreibe },
    dateiPraefix: "lernsteig-sync-", datenbank: "lernsteig", ordnerId: "lernsteig-abgleich",
    ereignis: "lernsteig:abgeglichen",
    // Was abgeglichen wird; alles andere (Anmeldung, Einstellungen des Geräts, Gedächtnis, Gerät) bleibt hier
    geteilt: ["personen", "runden", "rekorde", "geloescht", "freigabe", "meldungen"],
    beiAenderung: LST.beiAenderung,
    sichern: geraet => LST_DATEN.abgleichDaten(geraet),
    einlesen: text => LST_DATEN.einlesen(text),
  });
  // Selbsttätig, sobald ein Ordner gewählt ist (ohne Ordner-Fähigkeit des Browsers tut starte nichts)
  AB.starte();

  /** Was beim Zusammenführen dazukam, in einem Satz. */
  function ergebnisText(r) {
    const teile = [
      r.konten && `${r.konten} ${r.konten === 1 ? "neues oder geändertes Konto" : "neue oder geänderte Konten"}`,
      r.runden && `${r.runden} neue Runde${r.runden === 1 ? "" : "n"}`,
      r.rekorde && `${r.rekorde} Rekord${r.rekorde === 1 ? "" : "e"}`,
      r.freigabe && "die Freigabe",
      r.meldungen && `${r.meldungen} neue oder geänderte Meldung${r.meldungen === 1 ? "" : "en"}`,
    ].filter(Boolean);
    const weg = r.abgewiesen ? ` ${r.abgewiesen} ungültige${r.abgewiesen === 1 ? "r Eintrag" : " Einträge"} nicht übernommen.` : "";
    return (teile.length ? `Dazugekommen: ${teile.join(", ")}.` : "Nichts Neues — alles war schon da.") + weg;
  }

  return { kannOrdner: AB.kannOrdner, ordner: AB.ordner, jetzt: AB.jetzt, waehlen: AB.waehlen, vergessen: AB.vergessen,
    starte: AB.starte, dateiSichern: AB.dateiSichern, dateiEinlesen: AB.dateiEinlesen, dateiInhalt: AB.dateiInhalt,
    datenEinlesen: text => LST_DATEN.einlesen(text), ergebnisText, stand: AB.stand, geraet: AB.geraet, benenne: AB.benenne };
})();

if (typeof module !== "undefined") module.exports = LST_ABGLEICH;
