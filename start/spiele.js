/* Tab „Spiele“: Favoriten, dann je Fach und Thema auf- und zuklappbar; Kacheln oder kompakt.
   Kinder sehen nur freigegebene Spiele (Entscheid L4 a); die Aufsicht sieht alle mit Prüfstand. */
"use strict";

const FAECHER = [...new Set(THEMEN.map(t => t.fach))];

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
    const k = el("div", { class: "spielkarte" + (frei ? "" : " gesperrt") });
    k.style.setProperty("--f", s.farbe);
    const marken = s.lernziele.map(l => el("span", { class: "marke" + (fokus.includes(l.lz) ? " fokus" : ""), text: (fokus.includes(l.lz) ? "⭐ " : "") + l.lz }));
    // Endlos startet im Startbild des Spiels (dort Stufe und Timer wählen); die Stufenknöpfe springen direkt in eine Runde.
    if (s.endlos?.length) marken.push(el("a", { class: "marke endlos-link", href: s.pfad, title: "Endlos-Modus: so viele wie möglich ohne Fehler — Stufe im Spiel wählen", text: "♾ Endlos spielen" }));
    if (aufsicht && !frei) marken.unshift(el("span", { class: "marke warnung", text: "🔒 für Kinder nicht sichtbar" }));
    k.append(
      el("button", { type: "button", class: "stern-knopf", "aria-pressed": String(favorit), "aria-label": favorit ? "Aus den Favoriten nehmen" : "Zu den Favoriten",
        text: favorit ? "⭐" : "☆", onclick: () => speichere({ favoriten: favorit ? p.favoriten.filter(x => x !== s.id) : [...p.favoriten, s.id] }) }),
      el("div", { class: "kopfzeile" }, el("div", { class: "spiel-bild", text: s.bild }), el("b", { class: "name", text: s.name })),
      el("div", { class: "ziel", text: s.beschreibung }),
      el("div", { class: "marken" }, ...marken));
    const knoepfe = el("div", { class: "stufenknoepfe" });
    const empf = LS.empfohleneStufe(name, s.id);
    const gross = filter.stufe !== "alle";
    for (const st of LS.SKALA.filter(st => s.stufen.includes(st.id) && (!gross || filter.stufe === st.id))) {
      const sterne = LS.besteSterne(name, s.id, st.id);
      const a = el("a", {
        class: "stufenknopf" + (gross ? " gross" : "") + (st.id === empf && !gross ? " empfohlen" : ""),
        href: `${s.pfad}?stufe=${st.id}`,
        title: `Stufe ${st.nr} · ${st.name} (${LS.stufeFuer(s.id, st.id)})`,
      }, el("span", { text: gross ? `${st.icon} Stufe ${st.nr} spielen` : `${st.icon}${st.nr}` }),
         el("span", { class: "s", text: sterne ? "★".repeat(sterne) : "" }));
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
