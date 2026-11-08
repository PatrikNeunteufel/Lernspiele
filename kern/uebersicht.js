/* Kern — Bausteine einer Übersicht mit Kacheln (Entscheid KT1 a, LERN_Session23; docs/kern/rahmen.md 4.26).
   Herkunft: Tab Spiele des Eulenpfads (eulenpfad/start/spiele.js) und Tab Übungen des Lernsteigs
   (lernsteig/start/uebungen.js), wo dieselbe Bedienung zweimal stand und schon auseinanderlief.
   KERN.uebersicht.gruppen({ zu, merke })        → { gruppe({ id, kopf, anzahl }, …inhalt), zu() }
     aufklappbare Gruppe details.gruppe[data-gruppe]; was zugeklappt ist, sammelt eine Menge je Zeichnen und geht
     über merke(liste) an die App (Profil, Konto) — nur wenn sich etwas ändert.
   KERN.uebersicht.filterBlock({ titel, aktiv, leer, zeilen, zu, merke, schmal }) → details.filter-klapp
     Kopfzeile nennt, was gilt; zu (true/false/undefined) aus der App, merke(zuBool) beim Auf- und Zuklappen.
   KERN.uebersicht.filterOffen(zu, schmal)       → offen? (ohne Wahl der Person auf dem Handy zu, sonst offen)
   KERN.uebersicht.schmal()                      → Handy-Breite (max-width: 560px)?
   KERN.uebersicht.suche()                       → { text, feld({ neu, attr, beiEingabe }) }
     Suchtext, der das Neuzeichnen überlebt (nicht gespeichert), und ein Feld, das danach den Fokus zurückholt.
   KERN.uebersicht.aehnlich                      → { id(search), schliessen() } für „?aehnlich=<id>“
   KERN.uebersicht.sortWahl({ arten, wahl, pfeile, setze, knopf, beschriftung, feld }) → label.sortier-wahl
   KERN.uebersicht.umschalten(liste, id)         → neue Liste mit id dazu (hinten) oder ohne id (Favoriten)
   KERN.uebersicht.stern(an), STERN              → Favoriten-Stern svg.symbol.stern(.an), Form als Pfad
   Speichern, Knöpfe (chip) und Aussehen gibt die App; der Kern kennt keine App. Nötige Klassen im CSS der App:
   .gruppe, .gruppe > summary .anzahl, .filter-klapp, .filter-titel, .filter-aktiv, .filter, .sortier-wahl.
   Greift erst beim Aufruf auf document, location, history und matchMedia zu, nie beim Laden (in Node ladbar). */
"use strict";

(function (KERN) {
  const STERN = '<path d="M12 2.6l2.85 6 6.55.82-4.85 4.55 1.27 6.5L12 17.3l-5.82 3.17 1.27-6.5L2.6 9.42l6.55-.82z"/>';
  const SCHMAL = "(max-width: 560px)";

  /** Neue Liste: id dazu (hinten), wenn sie fehlt, sonst ohne id. Die Eingabe bleibt unverändert. */
  function umschalten(liste, id) {
    const l = Array.isArray(liste) ? liste : [];
    return l.includes(id) ? l.filter(x => x !== id) : l.concat(id);
  }

  /** Kopf einer Gruppe: Text wird ein span, Elemente und Listen bleiben. */
  const kopfTeile = kopf => [].concat(kopf).map(k => (typeof k === "string" ? KERN.el("span", { text: k }) : k));

  /**
   * Gruppen eines Zeichnens. zu: Liste der zugeklappten Gruppen-Ids aus dem Speicher der App; merke(liste) speichert.
   * Eine Gruppe ist offen, wenn ihre Id nicht in zu steht; das Umschalten führt die Menge nach und meldet sie nur bei
   * einer Änderung (der Browser meldet „toggle“ auch, wenn das Zeichnen open setzt).
   */
  function gruppen({ zu = [], merke } = {}) {
    if (typeof merke !== "function") throw new Error("gruppen: merke fehlt");
    const menge = new Set(Array.isArray(zu) ? zu : []);
    function gruppe({ id, kopf, anzahl = null }, ...inhalt) {
      if (!id) throw new Error("gruppe: id fehlt");
      const d = KERN.el("details", { class: "gruppe", "data-gruppe": id },
        KERN.el("summary", {}, ...kopfTeile(kopf), anzahl === null ? null : KERN.el("span", { class: "anzahl", text: `${anzahl}` })),
        ...inhalt);
      d.open = !menge.has(id);
      d.addEventListener("toggle", () => {
        if (d.open !== menge.has(id)) return; // unverändert
        if (d.open) menge.delete(id); else menge.add(id);
        merke([...menge]);
      });
      return d;
    }
    return { gruppe, zu: () => [...menge] };
  }

  /** Offen? Eine gemerkte Wahl der Person gilt; ohne Wahl auf dem Handy zu, sonst offen. */
  const filterOffen = (zu, schmal) => (typeof zu === "boolean" ? !zu : !schmal);
  const schmal = () => typeof matchMedia === "function" && matchMedia(SCHMAL).matches;

  /**
   * Einklappbarer Filter: Kopfzeile mit titel und dem, was gilt (aktiv, Liste von Texten; leer, wenn nichts gilt),
   * darunter die Zeilen der App. zu und merke wie bei filterOffen; schmal ohne Angabe aus der Breite des Bildschirms.
   */
  function filterBlock({ titel = "Filter", aktiv = [], leer = "", zeilen = [], zu, merke, schmal: istSchmal } = {}) {
    if (typeof merke !== "function") throw new Error("filterBlock: merke fehlt");
    const liste = aktiv.filter(Boolean);
    const d = KERN.el("details", { class: "filter-klapp" },
      KERN.el("summary", {}, KERN.el("span", { class: "filter-titel", text: titel }),
        KERN.el("span", { class: "filter-aktiv", text: liste.length ? liste.join(" · ") : leer })),
      KERN.el("div", { class: "filter" }, ...zeilen));
    const offen = filterOffen(zu, istSchmal === undefined ? schmal() : istSchmal);
    d.open = offen;
    let war = offen;
    d.addEventListener("toggle", () => { if (d.open === war) return; war = d.open; merke(!d.open); });
    return d;
  }

  /**
   * Suche, deren Text das Neuzeichnen überlebt (nicht gespeichert). feld() baut das Eingabefeld; jede Eingabe setzt
   * den Text, ruft beiEingabe (etwa: die Liste der Ähnlichen verlassen) und neu(); nach dem Neuzeichnen hat das neue
   * Feld den Fokus mit der Schreibmarke am Ende.
   */
  function suche() {
    let text = "", tippt = false;
    function feld({ neu, attr = {}, beiEingabe } = {}) {
      if (typeof neu !== "function") throw new Error("suche: neu fehlt");
      const f = KERN.el("input", Object.assign({ type: "search" }, attr, { value: text }));
      f.addEventListener("input", () => { text = f.value; tippt = true; if (beiEingabe) beiEingabe(); neu(); });
      if (tippt) {
        tippt = false;
        requestAnimationFrame(() => { f.focus(); f.setSelectionRange(f.value.length, f.value.length); });
      }
      return f;
    }
    return { get text() { return text; }, set text(t) { text = String(t); }, feld };
  }

  /** „?aehnlich=<id>“: Id aus der Adresse (oder einem gegebenen search-Text), und verlassen, ohne den Tab zu wechseln. */
  const aehnlich = {
    id: (search = location.search) => new URLSearchParams(search).get("aehnlich"),
    schliessen() { if (aehnlich.id()) history.replaceState(null, "", location.pathname + location.hash); },
  };

  /**
   * Sortierwahl: Auswahlliste der arten ([{ wert, text }]) und ein Knopf für die Richtung. wahl = { art, ab };
   * pfeile[art] = [Text aufsteigend, Text absteigend]; setze({ art, ab }) speichert und zeichnet neu.
   * knopf(text, an, onclick) baut den Knopf im Aussehen der App; beschriftung ist ein Element davor; feld sind
   * Attribute der Auswahlliste (Klasse, aria-label, name).
   */
  function sortWahl({ arten, wahl, pfeile = {}, setze, knopf, beschriftung = null, feld = {} }) {
    if (typeof setze !== "function" || typeof knopf !== "function") throw new Error("sortWahl: setze oder knopf fehlt");
    const p = pfeile[wahl.art] || ["↑", "↓"];
    return KERN.el("label", { class: "sortier-wahl" }, beschriftung,
      KERN.el("select", Object.assign({}, feld, { onchange: e => setze({ art: e.target.value, ab: false }) }),
        ...arten.map(a => KERN.el("option", { value: a.wert, text: a.text, selected: a.wert === wahl.art }))),
      knopf((wahl.ab ? "↓ " : "↑ ") + p[wahl.ab ? 1 : 0], !!wahl.ab, () => setze({ art: wahl.art, ab: !wahl.ab })));
  }

  /** Favoriten-Stern: Umriss aus, gefüllt an (Farbe aus dem CSS der App). */
  function stern(an) {
    const box = document.createElement("span");
    box.innerHTML = `<svg class="symbol stern${an ? " an" : ""}" viewBox="0 0 24 24" aria-hidden="true">${STERN}</svg>`;
    return box.firstChild;
  }

  KERN.uebersicht = { gruppen, filterBlock, filterOffen, schmal, suche, aehnlich, sortWahl, umschalten, stern, STERN };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
