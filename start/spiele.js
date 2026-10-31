/* Tab „Spiele“: Favoriten, dann je Fach und Thema auf- und zuklappbar; Kacheln oder kompakt.
   Kinder sehen nur freigegebene Spiele (Entscheid L4 a); die Aufsicht sieht alle mit Prüfstand. */
"use strict";

const FAECHER = [...new Set(THEMEN.map(t => t.fach))];

// Symbole der Karten-Schalter: aus = grauer Umriss, an = gold mit Verlauf wie der Favoriten-Stern.
// Der Verlauf steht einmal im Dokument (#gold-verlauf).
const SCHALTER_SYMBOL = {
  stern: '<path d="M12 2.6l2.85 6 6.55.82-4.85 4.55 1.27 6.5L12 17.3l-5.82 3.17 1.27-6.5L2.6 9.42l6.55-.82z"/>',
  endlos: '<path class="linie" d="M7.6 8.2C5.3 8.2 3.5 9.9 3.5 12s1.8 3.8 4.1 3.8c3.6 0 5.2-7.6 8.8-7.6 2.3 0 4.1 1.7 4.1 3.8s-1.8 3.8-4.1 3.8c-3.6 0-5.2-7.6-8.8-7.6z"/>',
  uhr: '<rect x="10.2" y="1.8" width="3.6" height="2.6" rx="1"/><circle cx="12" cy="13.6" r="7.6"/><path class="zeiger" d="M12 13.6V9.2M12 13.6l3 2"/>',
};
function schalterSymbol(art, an) {
  if (!document.getElementById("gold-verlauf")) {
    const defs = document.createElement("div");
    defs.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="gold-verlauf" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#ffe27a"/><stop offset=".55" stop-color="#ffc107"/><stop offset="1" stop-color="#f29a00"/></linearGradient></defs></svg>';
    document.body.append(defs.firstChild);
  }
  const box = document.createElement("span");
  box.innerHTML = `<svg class="symbol ${art}${an ? " an" : ""}" viewBox="0 0 24 24" aria-hidden="true">${SCHALTER_SYMBOL[art]}</svg>`;
  return box.firstChild;
}

function zeichneSpiele(box, neu) {
  const { el } = LS;
  const name = LS.aktuellerSpieler();
  const p = LS.profil(name);
  const aufsicht = LS.aufsichtAngemeldet();
  const fokus = p.fokus;
  // Filter merkt sich der Browser (nur Bequemlichkeit); Ansicht, Favoriten und Zuklappen das Profil.
  const filter = { fach: "alle", thema: "alle", stufe: "alle", fokus: false, ...LS.lies("filter", {}) };
  const setze = (k, v) => () => { filter[k] = v; if (k === "fach") filter.thema = "alle"; LS.schreibe("filter", filter); neu(); };
  const speichere = daten => { LS.speichereProfil(name, daten); neu(); };
  const zu = new Set(p.zu);
  const chip = (text, aktiv, onclick, tipp, klasse = "") =>
    el("button", { type: "button", class: "chip " + klasse, "aria-pressed": String(aktiv), onclick }, text, tipp ? el("span", { class: "tipp", text: tipp }) : null);

  // ----- Filter: Fach, dann die Themen dieses Fachs; Stufe -----
  const empfohlen = LS.empfohleneStufe(name);
  const faecher = el("div", { class: "filter-zeile" }, el("span", { text: "Fach" }),
    chip("Alle", filter.fach === "alle", setze("fach", "alle")),
    ...FAECHER.map(f => chip(f, filter.fach === f, setze("fach", f))));
  if (fokus.length) faecher.append(chip("⭐ Mein Fokus", filter.fokus, setze("fokus", !filter.fokus)));
  const zeilen = [faecher];
  if (filter.fach !== "alle") {
    zeilen.push(el("div", { class: "filter-zeile" }, el("span", { text: "Thema" }),
      chip("Alle", filter.thema === "alle", setze("thema", "alle"), null, "klein"),
      ...THEMEN.filter(t => t.fach === filter.fach).map(t => chip(t.name, filter.thema === t.id, setze("thema", t.id), null, "klein"))));
  }
  zeilen.push(el("div", { class: "filter-zeile" }, el("span", { text: "Stufe" }),
    chip("Alle", filter.stufe === "alle", setze("stufe", "alle")),
    ...LS.SKALA.map(s => chip(`${s.icon} ${s.nr} ${s.name}`, filter.stufe === s.id, setze("stufe", s.id), s.id === empfohlen ? "👍" : ""))));
  box.append(el("div", { class: "filter" }, ...zeilen));

  // ----- Spiele auswählen -----
  const passt = s => LS.spielSichtbar(s.id)
    && (filter.fach === "alle" || THEMEN.find(t => t.id === s.thema)?.fach === filter.fach)
    && (filter.thema === "alle" || s.thema === filter.thema)
    && (filter.stufe === "alle" || s.stufen.includes(filter.stufe))
    && (!filter.fokus || s.lernziele.some(l => fokus.includes(l.lz)));
  const imFokus = s => s.lernziele.some(l => fokus.includes(l.lz));
  // Fokus-Spiele zuerst, sonst Katalog-Reihenfolge.
  const auswahl = SPIELE.filter(passt).sort((a, b) => Number(imFokus(b)) - Number(imFokus(a)));

  // ----- Werkzeuge: Ansicht und alle auf/zu -----
  const gruppenIds = ["favoriten", ...FAECHER.map(f => "fach:" + f), ...THEMEN.map(t => "thema:" + t.id)];
  box.append(el("div", { class: "werkzeuge" },
    chip("▦ Kacheln", p.ansicht !== "kompakt", () => speichere({ ansicht: "kacheln" }), null, "klein"),
    chip("☰ Kompakt", p.ansicht === "kompakt", () => speichere({ ansicht: "kompakt" }), null, "klein"),
    chip("Alle auf", false, () => speichere({ zu: [] }), null, "klein"),
    chip("Alle zu", false, () => speichere({ zu: gruppenIds }), null, "klein")));

  /** Auf- und zuklappbare Gruppe; der Zustand landet im Profil. */
  function gruppe(id, titel, anzahl, ...inhalt) {
    const d = el("details", { class: "gruppe" }, el("summary", {}, el("span", { text: titel }), el("span", { class: "anzahl", text: `${anzahl}` })), ...inhalt);
    d.open = !zu.has(id);
    d.addEventListener("toggle", () => {
      d.open ? zu.delete(id) : zu.add(id);
      LS.speichereProfil(name, { zu: [...zu] });
    });
    return d;
  }

  const gitter = spiele => el("div", { class: "spiele" + (p.ansicht === "kompakt" ? " kompakt" : "") }, ...spiele.map(karte));

  function karte(s) {
    const favorit = p.favoriten.includes(s.id);
    const frei = LS.fuerKinderSichtbar(s.id);
    // Schalter je Spiel (Wunsch Patrik 2026-10-31): ⏱ Timer und ♾ Endlos leuchten wie der Favoriten-Stern;
    // die Stufenknöpfe starten dann mit Timer bzw. im Endlos-Modus. Der Timer ist dieselbe Einstellung wie im Spiel.
    const timerAn = s.stufen.some(st => LS.timerFuer(name, s.id, st).an);
    const endlosAn = !!s.endlos?.length && p.endlosAn.includes(s.id);
    const k = el("div", { class: "spielkarte" + (frei ? "" : " gesperrt") + (endlosAn ? " endlos-an" : ""), title: "Antippen: Startbild des Spiels" });
    k.style.setProperty("--f", s.farbe);
    // Freie Stellen der Karte öffnen das Startbild des Spiels (dort Stufen, Endlos und Timer mit Erklärung).
    k.addEventListener("click", e => { if (!e.target.closest("a, button")) location.href = s.pfad; });
    const ziel = lz => LERNZIELE.find(x => x.lz === lz)?.text || "";
    // Lernziel-Kürzel: Antippen oder Zeigen blendet den Klartext ein (auch auf dem Tablet, wo es kein title gibt).
    const marken = s.lernziele.map(l => el("button", { type: "button", class: "marke tipp" + (fokus.includes(l.lz) ? " fokus" : ""),
      "data-tipp": `${l.lz}: ${ziel(l.lz)}`, "aria-label": `Lernziel ${l.lz}: ${ziel(l.lz)}`, text: (fokus.includes(l.lz) ? "⭐ " : "") + l.lz }));
    if (aufsicht && !frei) marken.unshift(el("span", { class: "marke warnung", text: "🔒 für Kinder nicht sichtbar" }));
    const schalter = (an, art, text, onclick) => el("button", { type: "button", class: "karten-schalter" + (an ? " an" : ""), "aria-pressed": String(an),
      "aria-label": text, title: text, onclick }, schalterSymbol(art, an));
    // Schalter in einer eigenen schmalen Leiste oben rechts; darunter hat der Name die volle Breite.
    const schalterZeile = el("div", { class: "karten-schalter-zeile" },
        schalter(timerAn, "uhr", timerAn ? "Timer aus" : "Timer ein: jede Aufgabe hat eine Zeit", () => { LS.setzeTimerSpiel(name, s.id, !timerAn); neu(); }),
        s.endlos?.length ? schalter(endlosAn, "endlos", endlosAn ? "Endlos aus" : "Endlos ein: so viele wie möglich ohne Fehler",
          () => speichere({ endlosAn: endlosAn ? p.endlosAn.filter(x => x !== s.id) : [...p.endlosAn, s.id] })) : null,
        schalter(favorit, "stern", favorit ? "Aus den Favoriten nehmen" : "Zu den Favoriten",
          () => speichere({ favoriten: favorit ? p.favoriten.filter(x => x !== s.id) : [...p.favoriten, s.id] })));
    k.append(
      schalterZeile,
      el("div", { class: "kopfzeile" }, el("div", { class: "spiel-bild", text: s.bild }), el("b", { class: "name", text: s.name })),
      el("div", { class: "ziel", text: s.beschreibung }),
      el("div", { class: "marken" }, ...marken));
    const knoepfe = el("div", { class: "stufenknoepfe" });
    const empf = LS.empfohleneStufe(name, s.id);
    const gross = filter.stufe !== "alle";
    // Endlos an: nur die Endlos-Stufen, mit dem Rekord statt der Sterne.
    const stufen = LS.SKALA.filter(st => s.stufen.includes(st.id) && (!gross || filter.stufe === st.id) && (!endlosAn || s.endlos.includes(st.id)));
    for (const st of stufen) {
      const timer = LS.timerFuer(name, s.id, st.id);
      const rekord = endlosAn ? LS.besterRekord(name, s.id, st.id, timer.an) : 0;
      const sterne = endlosAn ? "" : "★".repeat(LS.besteSterne(name, s.id, st.id));
      const a = el("a", {
        class: "stufenknopf" + (gross ? " gross" : "") + (st.id === empf && !gross ? " empfohlen" : ""),
        href: `${s.pfad}?stufe=${st.id}${endlosAn ? "&endlos=1" : ""}`,
        title: `${endlosAn ? "♾ Endlos · " : ""}Stufe ${st.nr} · ${st.name} (${LS.stufeFuer(s.id, st.id)})${timer.an ? " · ⏱ mit Timer" : ""}`,
      }, el("span", { class: "stufen-text" }, endlosAn ? schalterSymbol("endlos", true) : st.icon, gross ? ` Stufe ${st.nr} spielen` : `${st.nr}`),
         el("span", { class: "s", text: endlosAn ? (rekord ? `🏆${rekord}` : "") : sterne }));
      a.style.setProperty("--sf", st.farbe);
      knoepfe.append(a);
    }
    k.append(knoepfe);
    return k;
  }

  // ----- Favoriten, dann Fach → Thema -----
  const favoriten = auswahl.filter(s => p.favoriten.includes(s.id));
  if (favoriten.length) box.append(gruppe("favoriten", "⭐ Favoriten", favoriten.length, gitter(favoriten)));
  for (const fach of FAECHER) {
    const themen = THEMEN.filter(t => t.fach === fach)
      .map(t => ({ t, spiele: auswahl.filter(s => s.thema === t.id) }))
      .filter(x => x.spiele.length);
    if (!themen.length) continue;
    const anzahl = themen.reduce((n, x) => n + x.spiele.length, 0);
    box.append(gruppe("fach:" + fach, fach, anzahl,
      ...themen.map(({ t, spiele }) => gruppe("thema:" + t.id, t.titel, spiele.length, gitter(spiele)))));
  }
  if (!auswahl.length) {
    box.append(el("div", { class: "karte leer-hinweis",
      text: SPIELE.some(s => LS.spielSichtbar(s.id)) ? "Für diese Auswahl gibt es noch kein Spiel. 🌱"
        : "Noch ist kein Spiel freigegeben. Die Aufsicht kann Spiele in der Verwaltung freigeben. 🌱" }));
  }
}
