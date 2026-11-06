/* Kern — Anmeldung und Sitzung im Tab (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.11).
   Herkunft: eulenpfad/spiele/gemeinsam/spiel.js (Anmeldung L1 a: gewählte Person, Aufsicht nur im Tab) und
   lernsteig/gemeinsam/konten.js (aktives Konto, mit PIN nur im Tab; Aufsicht nur im Tab).

   Ein Platz hält, wer an diesem Gerät angemeldet ist. Gemerkt wird die Kennung der gewählten Person im Speicher der App
   (localStorage, bleibt über das Schliessen des Browsers). Wer im Tab angemeldet sein muss (Standard: eine Aufsicht oder
   wer eine PIN hat), gilt nur, solange derselbe Browser-Tab offen ist (sessionStorage): Schliesst man ihn, ist die Person
   abgemeldet, und wer danach das Gerät nimmt, erbt ihre Rechte nicht. Die PIN prüft KERN.geheimnis.
   Grenze (DS1 a): schützt vor Versehen und Neugier am Gerät, nicht vor Entwicklerwerkzeugen. */
"use strict";

(function (KERN) {
  // Über den globalen Namen (wie speicher.js): Ersatz-DOMs legen sessionStorage als Variable an; der Zugriff kann werfen.
  const tabAblage = () => { try { return typeof sessionStorage !== "undefined" ? sessionStorage : null; } catch (e) { return null; } };

  /** Muss die Person im Tab angemeldet sein? Standard für alle Apps: eine Aufsicht oder wer eine PIN hat. */
  const standardImTab = p => !!p && (p.rolle === "aufsicht" || !!p.pin);

  /**
   * Ein Anmelde-Platz.
   * opt.speicher  KERN.speicher der App (sein Präfix gilt auch für den Tab-Schlüssel)
   * opt.gewaehlt  Schlüssel der gewählten Person im Speicher, oder null: nur im Tab (nichts wird über den Tab hinaus gemerkt)
   * opt.tab       Schlüssel im Tab (ohne Präfix), z. B. "aufsicht"
   * opt.finde     Wert → Person oder null (Kennung; ältere Stände der App auch über den Namen)
   * opt.imTab     Person → muss sie im Tab angemeldet sein? (Standard: Aufsicht oder mit PIN)
   * opt.gast      { tab: "gast", erlaubt: () → bool } — Gast (Entscheid C2 a): nur in diesem Tab, ohne Person; die App
   *               speichert für ihn nichts. Ohne opt.gast gibt es keinen Gast.
   * Liefert { aktiv, waehle, anmelden, abmelden, alsGast, istGast, imTab }.
   */
  function platz(opt) {
    const { speicher, gewaehlt = null, tab, finde, gast = null } = opt || {};
    if (!speicher || typeof speicher.lies !== "function") throw new Error("anmeldung: speicher fehlt");
    if (typeof tab !== "string" || !tab) throw new Error("anmeldung: tab fehlt");
    if (typeof finde !== "function") throw new Error("anmeldung: finde fehlt");
    if (gast && (typeof gast.tab !== "string" || !gast.tab || gast.tab === tab)) throw new Error("anmeldung: gast.tab fehlt oder ist der Tab der Person");
    const imTab = typeof opt.imTab === "function" ? opt.imTab : standardImTab;
    const tabSchluessel = speicher.praefix + tab;
    const gastSchluessel = gast ? speicher.praefix + gast.tab : null;
    const gastErlaubt = () => !!gast && (typeof gast.erlaubt !== "function" || !!gast.erlaubt());

    const tabWert = s => { try { return tabAblage()?.getItem(s) ?? null; } catch (e) { return null; } };
    function tabWertSetze(s, w) {
      try { const a = tabAblage(); if (!a) return false; if (w) a.setItem(s, w); else a.removeItem(s); return true; }
      catch (e) { return false; } // ohne sessionStorage: niemand ist im Tab angemeldet, auch kein Gast
    }
    const tabLies = () => tabWert(tabSchluessel);
    const tabSetze = id => { tabWertSetze(tabSchluessel, id); if (gastSchluessel) tabWertSetze(gastSchluessel, null); };
    /** Steht diese Person im Tab? Auch ein älterer Stand mit ihrem Namen gilt (finde löst ihn auf). */
    const imTabAngemeldet = p => { const w = tabLies(); return !!w && (w === p.id || finde(w)?.id === p.id); };

    /**
     * Die angemeldete Person oder null. Die Anmeldung dieses Tabs geht vor der gewählten Person des Geräts: Meldet sich
     * in einem zweiten Tab eine Aufsicht an, bleibt der Jugendliche mit PIN im ersten Tab angemeldet (vor kern 1.14.1
     * war er dort abgemeldet, gefunden mit den Seitentests im Ersatz-DOM, LERN_Session17).
     */
    function aktiv() {
      const imDiesemTab = finde(tabLies());
      if (imDiesemTab && (gewaehlt === null || imTab(imDiesemTab))) return imDiesemTab;
      if (gewaehlt === null) return null;
      const p = finde(speicher.lies(gewaehlt, null));
      if (!p) return null;
      return imTab(p) ? null : p; // im Tab angemeldet wäre sie oben schon gefunden
    }
    /** Person ohne PIN wählen (merken, Tab leeren); false, wenn sie im Tab angemeldet sein muss oder unbekannt ist. */
    function waehle(wert) {
      const p = finde(wert);
      if (!p || imTab(p) || gewaehlt === null) return false;
      speicher.schreibe(gewaehlt, p.id);
      tabSetze(null);
      return true;
    }
    /**
     * Anmelden; mit PIN muss sie stimmen. Wer im Tab angemeldet sein muss, braucht eine gesetzte PIN.
     * Gibt die Person zurück oder null (unbekannt, PIN falsch oder fehlt).
     */
    async function anmelden(wert, pin) {
      const p = finde(wert);
      if (!p) return null;
      if (p.pin) { if (!(await KERN.geheimnis.pinStimmt(pin, p.pin))) return null; }
      else if (imTab(p)) return null;
      if (gewaehlt !== null) speicher.schreibe(gewaehlt, p.id);
      tabSetze(imTab(p) ? p.id : null);
      return p;
    }
    /** Abmelden: nichts mehr gewählt, Tab leer, kein Gast. */
    function abmelden() {
      if (gewaehlt !== null) speicher.schreibe(gewaehlt, null);
      tabSetze(null);
    }
    /** Als Gast weiter (nur in diesem Tab): meldet eine Person ab. false, wenn die App keinen Gast erlaubt. */
    function alsGast() {
      if (!gastErlaubt()) return false;
      abmelden();
      return tabWertSetze(gastSchluessel, "ja");
    }
    /** Ist in diesem Tab der Gast unterwegs (und noch erlaubt)? */
    const istGast = () => gastErlaubt() && tabWert(gastSchluessel) === "ja" && !aktiv();
    return { aktiv, waehle, anmelden, abmelden, alsGast, istGast, imTab };
  }

  KERN.anmeldung = { platz, standardImTab };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
