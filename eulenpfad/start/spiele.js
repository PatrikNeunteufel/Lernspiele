/* Tab „Spiele“: Favoriten, dann je Fach und Thema auf- und zuklappbar; Kacheln oder kompakt.
   Kinder sehen nur freigegebene Spiele (Entscheid L4 a); die Aufsicht sieht alle mit Prüfstand. */
"use strict";

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

// Suche im Tab Spiele (Wunsch Patrik, LERN_Session6): bleibt beim Neuzeichnen erhalten, nicht gespeichert.
let spielSuche = "";
let spielSucheTippt = false; // nach dem Neuzeichnen das Suchfeld wieder fokussieren

/** Suchfeld, das bei jeder Eingabe neu zeichnet und danach den Fokus zurückholt. */
function suchFeld(wert, setze, neu, platzhalter) {
  const feld = LS.el("input", { class: "feld suche", type: "search", placeholder: platzhalter, "aria-label": platzhalter, value: wert });
  feld.addEventListener("input", () => { setze(feld.value); spielSucheTippt = true; neu(); });
  if (spielSucheTippt) {
    spielSucheTippt = false;
    requestAnimationFrame(() => { feld.focus(); feld.setSelectionRange(feld.value.length, feld.value.length); });
  }
  return feld;
}

function zeichneSpiele(box, neu) {
  const { el } = LS;
  const name = LS.aktuellerSpieler();
  const p = LS.profil(name);
  const aufsicht = LS.aufsichtAngemeldet();
  const fokus = p.fokus;
  // Filter merkt sich der Browser (nur Bequemlichkeit); Ansicht, Favoriten und Zuklappen das Profil.
  // Thema und Stufe sind Mehrfachwahl (Wunsch Patrik, LERN_Session10): Listen von Ids, leer = keine Einschränkung.
  // Ältere Speicherungen hielten einen Wert oder "alle".
  const gespeichert = LS.lies("filter", {});
  const liste = v => (Array.isArray(v) ? v : !v || v === "alle" ? [] : [v]);
  const filter = { fach: "alle", fokus: false, ...gespeichert, thema: liste(gespeichert.thema), stufe: liste(gespeichert.stufe), klasse: liste(gespeichert.klasse) };
  const setze = (k, v) => () => { filter[k] = v; if (k === "fach") filter.thema = []; LS.schreibe("filter", filter); neu(); };
  /** Einen Chip der Mehrfachwahl an- oder abwählen. */
  const schalte = (k, id) => () => { const s = new Set(filter[k]); if (s.has(id)) s.delete(id); else s.add(id); setze(k, [...s])(); };
  const speichere = daten => { LS.speichereProfil(name, daten); neu(); };
  const zu = new Set(p.zu);
  const chip = (text, aktiv, onclick, tipp, klasse = "") =>
    el("button", { type: "button", class: "chip " + klasse, "aria-pressed": String(aktiv), onclick }, text, tipp ? el("span", { class: "tipp", text: tipp }) : null);
  /** „Alle“ der Mehrfachwahl: wählt alle an; sind schon alle an, wählt es alle ab. */
  const alleChip = (k, ids, klasse) => {
    const alle = ids.length > 0 && ids.every(id => filter[k].includes(id));
    return chip("Alle", alle, setze(k, alle ? [] : ids), null, klasse);
  };

  // ----- Filter: Fach, dann die Themen dieses Fachs; Stufe -----
  const empfohlen = LS.empfohleneStufe(name);
  const faecher = el("div", { class: "filter-zeile" }, el("span", { text: "Fach" }),
    chip("Alle", filter.fach === "alle", setze("fach", "alle")),
    ...FAECHER.map(f => chip(f, filter.fach === f, setze("fach", f))));
  // Eigene Zeile „Nur“ für Fokus, Meine Klasse und Zu prüfen — das sind keine Fächer (Hinweis Patrik, LERN_Session10).
  const nur = el("div", { class: "filter-zeile" }, el("span", { text: "Nur" }));
  if (fokus.length) nur.append(chip("⭐ Mein Fokus", filter.fokus, setze("fokus", !filter.fokus)));
  // Meine Klasse (Entscheide K1 a, K2 a, LERN_Session6): nur Spiele mit einer Stufe genau für die Klasse
  // des Kindes, also Basisklasse ±1. Für Kinder mit Klasse im Profil, vorgegeben an; das Kind darf ihn
  // ausschalten (Profil-Feld meineKlasse, je Kind statt je Browser).
  const klasse = LS.klasseVon(p); // 0 = Kindergarten
  const nurKlasse = !aufsicht && klasse !== null && p.meineKlasse !== false;
  if (!aufsicht && klasse !== null) nur.append(chip("🎒 Meine Klasse", nurKlasse, () => speichere({ meineKlasse: !nurKlasse }), LS.klasseText(klasse)));
  // Für die Aufsicht: nur, was noch zu prüfen ist — Spiel nicht angesehen oder eine eigene Inhaltsliste ungeprüft.
  const zuPruefen = s => LS.spielZuPruefen(s.id) || LS.spielListen(s.id).some(l => !l.von && !l.geprueft);
  const nurZuPruefen = aufsicht && filter.zuPruefen;
  if (aufsicht) nur.append(chip("🔍 Zu prüfen", nurZuPruefen, setze("zuPruefen", !filter.zuPruefen), `${SPIELE.filter(zuPruefen).length}`));
  // Klasse (Wunsch Patrik, LERN_Session10): Basisklasse des Spiels, Mehrfachwahl wie Thema und Stufe; für alle sichtbar,
  // gedacht vor allem für die Aufsicht. „🎒 Meine Klasse“ bleibt die Abkürzung des Kindes (Basisklasse ±1).
  const basisklassen = [...new Set(SPIELE.map(s => s.klasse))].sort((a, b) => a - b);
  const klassen = el("div", { class: "filter-zeile" }, el("span", { text: "Klasse" }),
    alleChip("klasse", basisklassen),
    ...basisklassen.map(k => chip(LS.klasseText(k), filter.klasse.includes(k), schalte("klasse", k))));
  const zeilen = [faecher, klassen];
  if (nur.childElementCount > 1) zeilen.push(nur);
  if (filter.fach !== "alle") {
    const themen = THEMEN.filter(t => t.fach === filter.fach);
    zeilen.push(el("div", { class: "filter-zeile" }, el("span", { text: "Thema" }),
      alleChip("thema", themen.map(t => t.id), "klein"),
      ...themen.map(t => chip(t.name, filter.thema.includes(t.id), schalte("thema", t.id), null, "klein"))));
  }
  zeilen.push(el("div", { class: "filter-zeile" }, el("span", { text: "Stufe" }),
    alleChip("stufe", LS.SKALA.map(s => s.id)),
    ...LS.SKALA.map(s => chip(`${s.icon} ${s.nr} ${s.name}`, filter.stufe.includes(s.id), schalte("stufe", s.id), s.id === empfohlen ? "👍" : ""))));
  box.append(el("div", { class: "filter" }, ...zeilen));

  // ----- Spiele auswählen -----
  const passt = s => LS.spielSichtbar(s.id)
    && (filter.fach === "alle" || THEMEN.find(t => t.id === s.thema)?.fach === filter.fach)
    && (!filter.thema.length || filter.thema.includes(s.thema))
    && (!filter.stufe.length || s.stufen.some(st => filter.stufe.includes(st)))
    && (!filter.fokus || s.lernziele.some(l => fokus.includes(l.lz)))
    && (!nurKlasse || Math.abs(s.klasse - klasse) <= 1)
    && (!filter.klasse.length || filter.klasse.includes(s.klasse))
    && (!nurZuPruefen || zuPruefen(s))
    && (!treffer || treffer.has(s.id));
  // Suche (Entscheid SU1 a): Treffer nach Relevanz, sonst Fokus-Spiele zuerst und Katalog-Reihenfolge.
  const treffer = spielSuche.trim() ? new Map((LS.suche(spielSuche) || []).map((t, i) => [t.id, { ...t, i }])) : null;
  const imFokus = s => s.lernziele.some(l => fokus.includes(l.lz));
  const auswahl = SPIELE.filter(passt).sort(treffer
    ? (a, b) => treffer.get(a.id).i - treffer.get(b.id).i
    : (a, b) => Number(imFokus(b)) - Number(imFokus(a)));

  // ----- Werkzeuge: Ansicht und alle auf/zu -----
  const gruppenIds = ["favoriten", ...FAECHER.map(f => "fach:" + f), ...THEMEN.map(t => "thema:" + t.id)];
  box.append(el("div", { class: "werkzeuge" },
    suchFeld(spielSuche, v => { spielSuche = v; }, neu, "🔍 Spiel suchen"),
    chip("▦ Kacheln", p.ansicht !== "kompakt", () => speichere({ ansicht: "kacheln" }), null, "klein"),
    chip("☰ Kompakt", p.ansicht === "kompakt", () => speichere({ ansicht: "kompakt" }), null, "klein"),
    chip("Alle auf", false, () => speichere({ zu: [] }), null, "klein"),
    chip("Alle zu", false, () => speichere({ zu: gruppenIds }), null, "klein")));

  // ----- Zufallsmix und Zufälliges Spiel: Karten wie die Spiele, ohne Thema (Wunsch Patrik, LERN_Session10) -----
  // Zufallsmix (Entscheid M1 a): Aufgaben aus mehreren Spielen, Einstellungen auf der Mix-Seite.
  // Zufälliges Spiel: die Eule zieht ein Spiel aus der gefilterten Auswahl; je Stufe ein Knopf.
  const gross = filter.stufe.length === 1;
  /** Karte ohne Thema; freie Stellen lösen `beiTipp` aus (wie bei den Spielkarten das Startbild). */
  function zufallsKarte({ bild, name: titel, ziel, farbe, knoepfe, beiTipp, titelText }) {
    const k = el("div", { class: "spielkarte zufall", title: titelText, "data-vorlesen": `${titel}. ${ziel}` });
    k.style.setProperty("--f", farbe);
    k.addEventListener("click", e => { if (!e.target.closest("a, button")) beiTipp(); });
    k.append(el("div", { class: "kopfzeile" }, el("div", { class: "spiel-bild", text: bild }), el("b", { class: "name", text: titel })),
      el("div", { class: "ziel", text: ziel }), el("div", { class: "stufenknoepfe" }, ...knoepfe));
    return k;
  }
  // Bedarf (Wunsch Patrik, LERN_Session10): der Zufall wählt, wo die Statistik Bedarf zeigt — AUSWERTUNG.bedarf,
  // dieselbe Gewichtung wie im Zufallsmix.
  const protokoll = LS.protokoll().filter(e => e.name === name);
  const bedarf = (s, stufeId) => AUSWERTUNG.bedarf(s.id, stufeId, protokoll, fokus);
  const ziehe = AUSWERTUNG.ziehe;
  const stufenZufall = st => auswahl.filter(s => s.stufen.includes(st.id));
  const zufallsSpiel = st => { const s = ziehe(stufenZufall(st), x => bedarf(x, st.id)); location.href = `${s.pfad}?stufe=${st.id}`; };
  const zufallsKnoepfe = LS.SKALA.filter(st => (!filter.stufe.length || filter.stufe.includes(st.id)) && stufenZufall(st).length).map(st => {
    const b = el("button", { type: "button", class: "stufenknopf" + (gross ? " gross" : "") + (st.id === empfohlen && !gross ? " empfohlen" : ""),
      "data-vorlesen": `Zufälliges Spiel, Stufe ${st.nr}, ${st.name}.`, title: `Stufe ${st.nr} · ${st.name}: ein zufälliges Spiel aus deiner Auswahl`,
      onclick: () => zufallsSpiel(st) }, el("span", { class: "stufen-text" }, st.icon, gross ? ` Stufe ${st.nr} spielen` : `${st.nr}`), el("span", { class: "s" }));
    b.style.setProperty("--sf", st.farbe);
    return b;
  });
  const zufallsKarten = [];
  if (SPIELE.some(s => LS.spielSichtbar(s.id))) zufallsKarten.push(zufallsKarte({ bild: "🎲", name: "Zufallsmix", farbe: "var(--deko-2)",
    ziel: "Aufgaben aus vielen Spielen gemischt — du stellst ein, wie schwer, wie lang und ob mit Timer.",
    titelText: "Antippen: zur Mix-Seite", beiTipp: () => { location.href = "mix.html"; },
    knoepfe: [el("a", { class: "stufenknopf gross", href: "mix.html", "data-vorlesen": "Zufallsmix einstellen und los." }, el("span", { class: "stufen-text", text: "🎲 Einstellen und los" }))] }));
  if (zufallsKnoepfe.length) zufallsKarten.push(zufallsKarte({ bild: "🎯", name: "Zufälliges Spiel", farbe: "var(--deko-6)",
    ziel: "Die Eule zieht ein Spiel aus deiner Auswahl — eher eines, das du noch üben solltest.",
    titelText: "Antippen: Startbild eines zufälligen Spiels", knoepfe: zufallsKnoepfe,
    beiTipp: () => { const st = LS.SKALA.find(x => x.id === (gross ? filter.stufe[0] : empfohlen)) || LS.SKALA[2]; const s = ziehe(auswahl, x => bedarf(x, st.id)); location.href = s.pfad; } }));
  if (zufallsKarten.length) box.append(el("div", { class: "spiele" + (p.ansicht === "kompakt" ? " kompakt" : "") }, ...zufallsKarten));

  /** Auf- und zuklappbare Gruppe; der Zustand landet im Profil. */
  function gruppe(id, titel, anzahl, ...inhalt) {
    const d = el("details", { class: "gruppe" }, el("summary", {}, el("span", { text: titel }), el("span", { class: "anzahl", text: `${anzahl}` })), ...inhalt);
    // Während einer Suche sind alle Gruppen mit Treffern offen; das ändert das gespeicherte Zuklappen nicht.
    d.open = spielSuche ? true : !zu.has(id);
    d.addEventListener("toggle", () => {
      if (spielSuche) return;
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
    // data-vorlesen: langes Drücken liest Name und Beschreibung vor (Kindergarten, 1. Klasse; LERN_Session8)
    const k = el("div", { class: "spielkarte" + (frei ? "" : " gesperrt") + (endlosAn ? " endlos-an" : ""), title: "Antippen: Startbild des Spiels",
      "data-vorlesen": `${s.name}. ${s.beschreibung}` });
    k.style.setProperty("--f", s.farbe);
    // Freie Stellen der Karte öffnen das Startbild des Spiels (dort Stufen, Endlos und Timer mit Erklärung).
    k.addEventListener("click", e => { if (!e.target.closest("a, button")) location.href = s.pfad; });
    const ziel = lz => LERNZIELE.find(x => x.lz === lz)?.text || "";
    // Lernziel-Kürzel: Antippen oder Zeigen blendet den Klartext ein (auch auf dem Tablet, wo es kein title gibt).
    const marken = s.lernziele.map(l => el("button", { type: "button", class: "marke tipp" + (fokus.includes(l.lz) ? " fokus" : ""),
      "data-tipp": `${l.lz}: ${ziel(l.lz)}`, "aria-label": `Lernziel ${l.lz}: ${ziel(l.lz)}`, text: (fokus.includes(l.lz) ? "⭐ " : "") + l.lz }));
    if (aufsicht && !frei) marken.unshift(el("span", { class: "marke warnung", text: `🔒 für Kinder nicht sichtbar: ${LS.sperrGrund(s.id)}` }));
    // Treffer über ein Feld, das nicht auf der Karte steht: sagen, wo (Entscheid SU1 a).
    const grund = treffer?.get(s.id)?.grund;
    if (grund) marken.push(el("span", { class: "marke such-grund", text: `🔍 gefunden ${grund}` }));
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
    // Endlos an: nur die Endlos-Stufen, mit dem Rekord statt der Sterne. Stufenfilter: nur die gewählten.
    const stufen = LS.SKALA.filter(st => s.stufen.includes(st.id) && (!filter.stufe.length || filter.stufe.includes(st.id)) && (!endlosAn || s.endlos.includes(st.id)));
    for (const st of stufen) {
      const timer = LS.timerFuer(name, s.id, st.id);
      const rekord = endlosAn ? LS.besterRekord(name, s.id, st.id, timer.an) : 0;
      const sterne = endlosAn ? "" : "★".repeat(LS.besteSterne(name, s.id, st.id));
      const a = el("a", {
        class: "stufenknopf" + (gross ? " gross" : "") + (st.id === empf && !gross ? " empfohlen" : ""),
        href: `${s.pfad}?stufe=${st.id}${endlosAn ? "&endlos=1" : ""}`,
        "data-vorlesen": `${s.name}, Stufe ${st.nr}, ${st.name}. ${LS.stufeFuer(s.id, st.id)}${st.id === empf ? ", für dich empfohlen" : ""}.`,
        title: `${endlosAn ? "♾ Endlos · " : ""}Stufe ${st.nr} · ${st.name} (${LS.stufeFuer(s.id, st.id)})${timer.an ? " · ⏱ mit Timer" : ""}`,
      }, el("span", { class: "stufen-text" }, endlosAn ? schalterSymbol("endlos", true) : st.icon, gross ? ` Stufe ${st.nr} spielen` : `${st.nr}`),
         el("span", { class: "s", text: endlosAn ? (rekord ? `🏆${rekord}` : "") : sterne }));
      a.style.setProperty("--sf", st.farbe);
      knoepfe.append(a);
    }
    k.append(knoepfe);
    return k;
  }

  // ----- Bei einer Suche: eine Liste, beste Treffer zuerst; sonst Favoriten, dann Fach → Thema -----
  if (treffer && auswahl.length) box.append(el("h2", { class: "treffer-titel", text: `🔍 ${auswahl.length} Treffer, beste zuerst` }), gitter(auswahl));
  const favoriten = treffer ? [] : auswahl.filter(s => p.favoriten.includes(s.id));
  if (favoriten.length) box.append(gruppe("favoriten", "⭐ Favoriten", favoriten.length, gitter(favoriten)));
  for (const fach of treffer ? [] : FAECHER) {
    const themen = THEMEN.filter(t => t.fach === fach)
      .map(t => ({ t, spiele: auswahl.filter(s => s.thema === t.id) }))
      .filter(x => x.spiele.length);
    if (!themen.length) continue;
    const anzahl = themen.reduce((n, x) => n + x.spiele.length, 0);
    box.append(gruppe("fach:" + fach, fach, anzahl,
      ...themen.map(({ t, spiele }) => gruppe("thema:" + t.id, t.titel, spiele.length, gitter(spiele)))));
  }
  // Langes Drücken auf eine Karte oder einen Stufenknopf liest vor (Kindergarten, 1. Klasse; LERN_Session8).
  LS.langDruecken(box);
  if (!auswahl.length) {
    box.append(el("div", { class: "karte leer-hinweis",
      text: SPIELE.some(s => LS.spielSichtbar(s.id)) ? "Für diese Auswahl gibt es noch kein Spiel. 🌱"
        : "Noch ist kein Spiel freigegeben. Die Aufsicht kann Spiele in der Verwaltung freigeben. 🌱" }));
  }
}
