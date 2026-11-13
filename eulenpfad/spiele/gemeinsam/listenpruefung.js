/* Prüfansicht der Inhaltslisten (Entscheide LP1 a–LP5 a, LERN_Session11; rahmen.md Abschnitt 17).
   Seit Kern 1.31.0 (LK1 a, LERN_Session24) steht die Ansicht im Kern (kern/listenpruefung.js, KERN.listenpruefung);
   hier nur die Anbindung an den Eulenpfad: Entwickler-Modus, Haken der Aufsicht, Freigabe je Gerät, Zellen mit Bildern
   und Korrekturvorschläge über die Meldungen.
   Läuft auf der Seite des Spiels, das die Liste besitzt: Nur dort sind die Inhalte geladen und kann das Spiel Bilder
   zeichnen. Geladen erst beim Öffnen (LS.listenPruefen), zusammen mit spiele/<id>/pruefung.js; die Definition meldet
   das Spiel mit LS.listenPruefung(spielId, { <liste>: … }) — Aufbau in kern/listenpruefung.js. */
"use strict";
const LISTENPRUEFUNG = (() => {
  const ansicht = KERN.listenpruefung.ansicht({
    el: LS.el,
    eintraegeUrl: "../gemeinsam/pruefstand-eintraege.json",
    entwicklung: () => LS.entwicklung || null,
    ich: () => LS.spielerName(LS.aktuellerSpieler()),
    lokal: { lies: LS.pruefungLokal, schreibe: LS.setzePruefungLokal, alle: LS.pruefungLokalAlle }, // alle: ÜB1 a
    setzeFrei: LS.setzeListeFrei,
    liste: (spielId, listeId) => LS.spielListen(spielId).find(l => l.id === listeId) || null,
    titel: spielId => LS.katalogEintrag?.(spielId)?.bild || "",
    zelle: LS.zelleMitBildern, // „svg:<name>“ zeigt die Zeichnung aus der Bildersammlung (B1 a)
    feld: "spiel",
    wer: "Kinder",
    korrektur: {
      liste: quelle => LS.korrekturen().filter(k => k.liste === quelle),
      neu: daten => LS.neueKorrektur({ name: LS.aktuellerSpieler(), ...daten }),
      entferne: LS.entferneMeldung,
      gespeichert: "✓ Korrektur gespeichert — senden unter Verwaltung → Meldungen.",
    },
  });
  /** nachher(): nach dem Schliessen, wenn gespeichert ist (Kern 1.44.0) — etwa die Entwickler-Leiste neu zeichnen. */
  async function oeffne(spielId, listeId, nachher) {
    const ok = await ansicht.oeffne(LS.pruefungDefinition(spielId), spielId, listeId, nachher);
    if (!ok) alert("Für diese Liste gibt es noch keine Prüfansicht (pruefung.js).");
    return ok;
  }
  return { oeffne, eintraegeVon: KERN.listenpruefung.eintraegeVon, listenHash: KERN.listenpruefung.listenHash, inhaltVon: KERN.listenpruefung.inhaltVon };
})();
