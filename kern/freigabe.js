/* Kern — Freigabe nach Prüfstand (Entscheide L4 a, E1 a, FG1 a; Herkunft eulenpfad/spiele/gemeinsam/spiel.js;
   docs/kern/rahmen.md 4.8).
   Prüfstand im Repo, Freigabe auf dem Gerät. Frei ist, was nichts mehr zu prüfen hat:
   - Ein Inhalt (Spiel, Übung) mit `neu` im Katalog ist gesperrt, bis der Prüfstand ihn als angesehen führt.
   - Eine Inhaltsliste (Katalog `listen: { <liste>: { name, zusatz?, von? } }`) ist gesperrt, bis sie geprüft ist.
     `von: "<inhalt>/<liste>"` verweist auf die Liste eines anderen Inhalts: Prüfstand und Freigabe gelten an der
     Quelle. `zusatz: true` ergibt allein keine Aufgabe und macht einen Inhalt nicht sichtbar.
   - Die Aufsicht kann je Gerät anders entscheiden: Speicher „freigabe“ = { <art>: { <id>: bool }, listen: { … } };
     ohne Eintrag entscheidet der Prüfstand. „freigabeStand“ hält die Zeit der letzten Änderung (Abgleich: der jüngste
     Stand gewinnt).
   Die App gibt alles mit: wo der Katalog und der Prüfstand stehen, wie ihr Inhalt heisst (art), ihren Speicher und
   ob gerade eine Aufsicht angemeldet ist (sie sieht alles). */
"use strict";

(function (KERN) {
  /**
   * opt: { art: "spiele" | "uebungen", eintrag: id → Katalogeintrag | null, pruefstand: () → { <art>, listen },
   *        speicher: { lies, schreibe }, aufsicht: () → bool }
   */
  function freigabe(opt) {
    const { art, eintrag, speicher } = opt;
    const aufsicht = opt.aufsicht || (() => false);
    const stand = () => ({ ...(speicher.lies("freigabe", {}) || {}) });
    const geraet = () => { const f = stand(); return { ...f, [art]: { ...(f[art] || {}) }, listen: { ...(f.listen || {}) } }; };
    function setze(bereich, schluessel, wert) {
      const f = geraet();
      if (wert === null) delete f[bereich][schluessel]; else f[bereich][schluessel] = !!wert;
      // Stand vor der Freigabe schreiben: Der Abgleich nimmt die Freigabe des Geräts mit dem jüngsten Stand.
      speicher.schreibe("freigabeStand", new Date().toISOString());
      speicher.schreibe("freigabe", f);
    }
    /** Prüfstand { am, von } oder null; bereich = art oder "listen". */
    const pruefstand = (bereich, schluessel) => (opt.pruefstand() || {})[bereich]?.[schluessel] || null;
    /** Schlüssel "<inhalt>/<liste>" der Quelle einer Liste (folgt dem Verweis von). */
    const listenQuelle = (id, listeId) => eintrag(id)?.listen?.[listeId]?.von || `${id}/${listeId}`;
    function quellEintrag(schluessel) { const [i, l] = schluessel.split("/"); return eintrag(i)?.listen?.[l] || null; }
    /** Inhaltslisten: [{ id, quelle, name, geprueft, von, zusatz }] — Name und Prüfstand von der Quelle. */
    const listen = id => Object.entries(eintrag(id)?.listen || {}).map(([lid, l]) => {
      const quelle = l.von || `${id}/${lid}`;
      const q = l.von ? quellEintrag(l.von) : l;
      return { id: lid, quelle, name: q?.name ?? l.name, geprueft: pruefstand("listen", quelle), von: l.von || null, zusatz: !!q?.zusatz };
    });
    /** Liste für Lernende frei? */
    const listeFrei = (id, listeId) => { const s = listenQuelle(id, listeId); return geraet().listen[s] ?? !!pruefstand("listen", s); };
    const setzeListeFrei = (id, listeId, wert) => setze("listen", listenQuelle(id, listeId), wert);
    /** Listen, die die angemeldete Person üben darf (die Aufsicht alle). */
    const freieListen = id => listen(id).filter(l => aufsicht() || listeFrei(id, l.id)).map(l => l.id);
    /** Muss der Inhalt als Ganzes noch angesehen werden (neu und nicht im Prüfstand)? */
    const zuPruefen = id => !!eintrag(id)?.neu && !pruefstand(art, id);
    const geprueft = id => pruefstand(art, id);
    /** Inhalt als Ganzes frei (ohne Blick auf die Listen)? */
    const frei = id => geraet()[art][id] ?? !zuPruefen(id);
    const setzeFrei = (id, wert) => setze(art, id, wert);
    /** Sehen Lernende den Inhalt? Frei und, falls er Listen hat, mindestens eine eigenständige Liste frei. */
    const fuerLernendeSichtbar = id => frei(id) && (!listen(id).length || listen(id).some(l => !l.zusatz && listeFrei(id, l.id)));
    const sichtbar = id => aufsicht() || fuerLernendeSichtbar(id);
    /** Warum Lernende den Inhalt nicht sehen, oder null. */
    function sperrGrund(id) {
      if (!eintrag(id)) return "unbekannt";
      if (fuerLernendeSichtbar(id)) return null;
      if (geraet()[art][id] === false) return "auf diesem Gerät gesperrt";
      if (!frei(id)) return "noch nicht angesehen";
      const l = listen(id).filter(x => !x.zusatz);
      if (l.some(x => geraet().listen[x.quelle] === false)) return "Inhaltslisten gesperrt";
      return l.length === 1 ? "Inhaltsliste noch nicht geprüft" : `keine der ${l.length} Inhaltslisten geprüft`;
    }
    return { art, geraet, setze, pruefstand, listenQuelle, listen, listeFrei, setzeListeFrei, freieListen, zuPruefen,
      geprueft, frei, setzeFrei, fuerLernendeSichtbar, sichtbar, sperrGrund };
  }

  KERN.freigabe = freigabe;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
