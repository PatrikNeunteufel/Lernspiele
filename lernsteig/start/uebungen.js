/* Tab „Übungen“ des Lernsteigs (Plan C3 Schritt 1, wie der Tab Spiele des Eulenpfads): Favoriten, dann je Fach und
   Thema auf- und zuklappbar; Kacheln oder kompakt. Jugendliche sehen gesperrte Übungen ohne Verweis (FG1 a), die
   Aufsicht öffnet sie zum Prüfen. Favoriten, Zuklappen und Ansicht stehen im Konto (Gast und Aufsicht: nur im Tab,
   rahmen.js TAB_FELDER). Filter, Sortierung und Suche folgen in Schritt 2, Passung in Schritt 3. */
"use strict";

var LST_START = typeof LST_START === "object" ? LST_START : {};

(function () {
  const LP = LST_LEHRPLAENE;
  const KAT = LST_KATALOG;
  const el = LST.el;
  /** Kinder anhängen ohne null, undefined und false. */
  const dazu = (knoten, ...kinder) => { knoten.append(...kinder.filter(k => k !== null && k !== undefined && k !== false)); return knoten; };

  // Favoriten-Stern wie im Eulenpfad (Umriss aus, gefüllt an), im sachlichen Aussehen in der Akzentfarbe
  const STERN = '<path d="M12 2.6l2.85 6 6.55.82-4.85 4.55 1.27 6.5L12 17.3l-5.82 3.17 1.27-6.5L2.6 9.42l6.55-.82z"/>';
  function stern(an) {
    const box = document.createElement("span");
    box.innerHTML = `<svg class="symbol stern${an ? " an" : ""}" viewBox="0 0 24 24" aria-hidden="true">${STERN}</svg>`;
    return box.firstChild;
  }

  /** Symbol einer Übung (Katalog-Feld `symbol`); fehlt es, das Kürzel des Fachs. */
  const FACH_KURZ = { mathematik: "M", deutsch: "D", englisch: "E", franzoesisch: "F", nt: "NT" };
  const symbolVon = u => el("span", { class: "uebung-symbol" + (u.symbol ? "" : " kuerzel"), "aria-hidden": "true", text: u.symbol || FACH_KURZ[u.fach] || "" });

  function zeichneUebungen(box) {
    const k = LST.konto();
    const neu = () => LST_START.neu();
    const speichere = daten => { LST.speichereKonto(Object.assign(LST.konto(), daten)); neu(); };
    const favoriten = k.favoriten || [];
    const zu = new Set(k.zu || []);
    const kompakt = k.ansicht === "kompakt";
    const chip = (text, aktiv, onclick, attr = {}) => el("button", Object.assign({ type: "button", class: "chip klein" + (aktiv ? " an" : ""), "aria-pressed": String(aktiv), onclick, text }, attr));

    // „wird geprüft“, wenn eine Stufe im gewählten Prüfungsziel vorkommt (NV2 a)
    const geprueft = u => k.pruefungsziel !== "keins" && u.stufen.some(s => LP.geprueft(`${u.kompetenz}.${s}`, k.pruefungsziel, k.lehrplan).geprueft);
    // Gast und Aufsicht haben keine Runden im Konto; ihr Stand bleibt leer
    const mitStand = LST.werUebt() === "lernend";

    // ----- Werkzeuge: Ansicht und alle auf/zu -----
    const gruppenIds = ["favoriten", ...KAT.FAECHER.map(f => "fach:" + f.id),
      ...KAT.FAECHER.flatMap(f => [...new Set(KAT.UEBUNGEN.filter(u => u.fach === f.id).map(u => u.thema))].map(t => `thema:${f.id}:${t}`))];
    box.replaceChildren(el("div", { class: "werkzeuge" },
      chip("▦ Kacheln", !kompakt, () => speichere({ ansicht: "kacheln" }), { "data-ansicht": "kacheln" }),
      chip("☰ Kompakt", kompakt, () => speichere({ ansicht: "kompakt" }), { "data-ansicht": "kompakt" }),
      chip("Alle auf", false, () => speichere({ zu: [] }), { "data-aktion": "alle-auf" }),
      chip("Alle zu", false, () => speichere({ zu: gruppenIds }), { "data-aktion": "alle-zu" })));

    /** Auf- und zuklappbare Gruppe; der Zustand landet im Konto. */
    function gruppe(id, kopf, anzahl, ...inhalt) {
      const d = dazu(el("details", { class: "gruppe", "data-gruppe": id },
        el("summary", {}, ...[].concat(kopf), anzahl === null ? null : el("span", { class: "anzahl", text: `${anzahl}` }))), ...inhalt);
      d.open = !zu.has(id);
      d.addEventListener("toggle", () => {
        d.open ? zu.delete(id) : zu.add(id);
        LST.speichereKonto(Object.assign(LST.konto(), { zu: [...zu] }));
      });
      return d;
    }

    function kachel(u) {
      const f = KAT.fach(u.fach);
      const sichtbar = LST.uebungSichtbar(u.id);
      const favorit = favoriten.includes(u.id);
      const href = `uebungen/${u.id}/index.html?niveau=${LST.niveauFuer(u.fach, u.niveaus)}`;
      // Freie Stellen der Kachel öffnen die Übung (dort Stufen, Serie, Rechner); gesperrt für Jugendliche: kein Verweis
      const karte = el("div", { class: "uebung-karte" + (sichtbar ? "" : " gesperrt"), "data-uebung": u.id,
        title: sichtbar ? `${u.titel} öffnen` : "noch nicht freigegeben" });
      if (sichtbar) karte.addEventListener("click", e => { if (!e.target.closest("a, button")) location.href = href; });
      const marken = [
        geprueft(u) ? el("span", { class: "marke pruefung", text: "wird geprüft" }) : null,
        LST.sperrGrund(u.id) ? el("span", { class: "marke gesperrt", text: sichtbar ? "für Jugendliche gesperrt" : "noch nicht freigegeben" }) : null,
      ].filter(Boolean);
      // Kompetenzstand je Lehrplan-Stufe (BF1 a): Buchstabe mit Farbe des Stands, Zahlen im Titel
      const stufen = el("div", { class: "stufen-marken", "aria-label": "Stufen" }, ...u.stufen.map(s => {
        const ks = mitStand ? LST.kompetenzstand(k.id, u.id, s) : { stand: "offen", text: "offen", n: 0 };
        const titel = `Stufe ${s}: ${ks.text}` + (ks.n ? ` (${ks.anhieb} von ${ks.fenster} zuletzt auf Anhieb, ${ks.n} Aufgaben)` : "");
        return el("span", { class: `stufe-marke stand-${ks.stand}`, title: titel, "aria-label": titel, text: s });
      }));
      const name = sichtbar ? el("a", { class: "uebung-link name", href, lang: u.sprache || null }, u.titel)
        : el("span", { class: "uebung-link uebung-gesperrt name", lang: u.sprache || null }, u.titel);
      return dazu(karte,
        el("button", { type: "button", class: "karten-schalter" + (favorit ? " an" : ""), "aria-pressed": String(favorit),
          "aria-label": favorit ? `${u.titel} aus den Favoriten nehmen` : `${u.titel} zu den Favoriten`, title: favorit ? "Aus den Favoriten nehmen" : "Zu den Favoriten",
          "data-favorit": u.id, onclick: () => speichere({ favoriten: favorit ? favoriten.filter(x => x !== u.id) : favoriten.concat(u.id) }) }, stern(favorit)),
        el("div", { class: "kopfzeile" }, symbolVon(u), name),
        el("small", { class: "kompetenz", text: `${u.kompetenz} · ${f ? f.name : ""}` }),
        marken.length ? el("div", { class: "marken" }, ...marken) : null,
        stufen);
    }
    const gitter = liste => el("div", { class: "uebung-gitter" + (kompakt ? " kompakt" : "") }, ...liste.map(kachel));

    // ----- Favoriten, dann Fach → Thema -----
    const favUebungen = KAT.UEBUNGEN.filter(u => favoriten.includes(u.id));
    if (favUebungen.length) box.append(gruppe("favoriten", "★ Favoriten", favUebungen.length, gitter(favUebungen)));
    for (const f of KAT.FAECHER) {
      const uebungen = KAT.UEBUNGEN.filter(u => u.fach === f.id);
      if (!uebungen.length) { box.append(el("section", { class: "fach spaeter", "aria-label": f.name }, el("h3", { text: f.name }), el("small", { class: "leise", text: "später" }))); continue; }
      const niveau = LST.niveauFuer(f.id);
      // Niveau je Fach (NV1 a) im Kopf der Gruppe: gilt für alle Übungen des Fachs
      const niveauWahl = el("div", { class: "niveau-wahl", role: "group", "aria-label": `Niveau ${f.name}` },
        el("span", { class: "leise klein", text: "Niveau" }),
        ...LST.NIVEAUS.map(n => el("button", {
          type: "button", class: "chip klein" + (n.id === niveau ? " an" : ""), "aria-pressed": String(n.id === niveau),
          text: LST.niveauName(n.id), title: n.kurz, onclick: () => { LST.setzeNiveau(f.id, n.id); neu(); },
        })));
      const themen = [...new Set(uebungen.map(u => u.thema))];
      box.append(gruppe("fach:" + f.id, [el("span", { text: f.name }), el("span", { class: "bereich", text: f.bereich })], uebungen.length,
        niveauWahl,
        ...themen.map(t => { const liste = uebungen.filter(u => u.thema === t); return gruppe(`thema:${f.id}:${t}`, el("span", { text: t }), liste.length, gitter(liste)); })));
    }
  }

  LST_START.uebungen = zeichneUebungen;
})();
