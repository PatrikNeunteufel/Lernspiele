/* Abgleich zwischen Geräten im Haushalt (Entscheid S1 a, LERN_Session6), seit LERN_Session18 über den Kern
   (KERN.abgleich, docs/kern/rahmen.md 4.20; Entscheid DF3 a). Jedes Gerät schreibt seine Daten in einen gemeinsamen
   Ordner, den die Aufsicht wählt (Netzwerkordner oder der Ordner eines Cloud-Dienstes), und zwar nur in seine eigene
   Datei lernspiele-sync-<gerät>.json. Beim Öffnen einer Seite liest es die Dateien der anderen Geräte und führt sie
   mit LS.zusammenfuehren zusammen. Den Ordner kann der Browser nur mit File System Access (heute Chrome und Edge auf
   dem Computer); sonst bleibt derselbe Abgleich über eine Datei (sichern / einlesen). Die PIN reist nie mit
   (LS.abgleichDaten, KERN.person.fuerDatei). Hier steht nur, was der Eulenpfad anders hat: Schlüssel, Präfix,
   Ereignis und der Satz über das Ergebnis. */
"use strict";

LS.abgleich = (() => {
  // Im Zufallsmix laufen die Spiele im iframe; dort gleicht nur die Mix-Seite selbst ab.
  const imRahmen = typeof window !== "undefined" && window.parent !== window;
  const AB = KERN.abgleich({
    speicher: { praefix: "lernspiele:", lies: LS.lies, schreibe: LS.schreibe },
    dateiPraefix: "lernspiele-sync-", datenbank: "lernspiele", ordnerId: "lernspiele-abgleich",
    ereignis: "lernspiele:abgeglichen",
    // Was abgeglichen wird; alles andere (Anmeldung, Filter, Gerät) bleibt auf dem Gerät.
    geteilt: ["personen", "protokoll", "rekorde", "freigabe", "geloescht", "meldungen"],
    beiAenderung: LS.beiAenderung,
    sichern: geraet => LS.abgleichDaten(geraet),
    einlesen: text => LS.zusammenfuehren(text),
  });
  if (!imRahmen) AB.starte();

  /** Was beim Zusammenführen dazukam, in einem Satz. */
  function ergebnisText(r) {
    const teile = [
      r.runden && `${r.runden} neue Runde${r.runden === 1 ? "" : "n"}`,
      r.rekorde && `${r.rekorde} Endlos-Rekord${r.rekorde === 1 ? "" : "e"}`,
      r.kinder && `${r.kinder} neue${r.kinder === 1 ? "s Kind" : " Kinder"}`,
      r.profile && `${r.profile} geänderte${r.profile === 1 ? "s Profil" : " Profile"}`,
      r.meldungen && `${r.meldungen} neue oder geänderte Fehlermeldung${r.meldungen === 1 ? "" : "en"}`,
      r.freigabe && "die Freigaben",
    ].filter(Boolean);
    return teile.length ? `Dazugekommen: ${teile.join(", ")}.` : "Nichts Neues — alles war schon da.";
  }

  return { kannOrdner: AB.kannOrdner, ordner: AB.ordner, jetzt: AB.jetzt, waehlen: AB.waehlen, vergessen: AB.vergessen,
    dateiSichern: AB.dateiSichern, datenEinlesen: text => LS.zusammenfuehren(text), dateiEinlesen: AB.dateiEinlesen,
    ergebnisText, stand: AB.stand, geraet: AB.geraet, benenne: AB.benenne };
})();
