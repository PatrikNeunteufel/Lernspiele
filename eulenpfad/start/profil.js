/* Tab „Profil“: Alter, Klasse, Fokus, Reihenfolge der Teile, Timer. Ein Kind bearbeitet sein
   eigenes Profil, die Aufsicht wählt oben, wessen Profil. Rollen und PIN: Tab Verwaltung. */
"use strict";

let profilVon = null; // nur für die Aufsicht: wessen Profil gerade offen ist

function zeichneProfil(box, neu) {
  const { el } = LS;
  const ich = LS.aktuellerSpieler();
  const aufsicht = LS.aufsichtAngemeldet();
  if (!aufsicht || !LS.spielerListe().includes(profilVon)) profilVon = ich;
  const name = profilVon;
  const p = LS.profil(name);

  const karte = el("section", { class: "karte profil" });
  box.append(karte);
  if (aufsicht) {
    const wahl = el("select", { "aria-label": "Profil von" }, ...LS.spielerListe().map(n => el("option", { value: n, text: LS.spielerName(n) })));
    wahl.value = name;
    wahl.addEventListener("change", () => { profilVon = wahl.value; neu(); });
    karte.append(el("div", { class: "profil-felder" }, el("label", {}, "Profil von", wahl)));
  }

  const alter = el("input", { type: "number", min: "4", max: "14", value: p.alter ?? "", "aria-label": "Alter" });
  const klasse = el("select", { "aria-label": "Klasse" },
    el("option", { value: "", text: "—" }),
    ...LS.KLASSEN.map(k => el("option", { value: String(k), text: LS.klasseText(k) })));
  klasse.value = LS.klasseVon(p) ?? "";
  const vorlesen = el("select", { "aria-label": "Vorlesen" },
    ...Object.entries(LS.VORLESEN_ARTEN).map(([k, t]) => el("option", { value: k, text: t })));
  vorlesen.value = p.vorlesen ?? "";
  const fokus = el("div", { class: "fokus-liste" });
  for (const lz of LERNZIELE) {
    const cb = el("input", { type: "checkbox", value: lz.lz });
    cb.checked = p.fokus.includes(lz.lz);
    fokus.append(el("label", {}, cb, el("span", { html: `<b>${lz.lz}</b> ${lz.text}` })));
  }
  // Reihenfolge der Teile (Bausteine, Rätselteile): global und je Spiel, das sie beachtet.
  const reihenfolgeWahl = (wert, ohneVorgabe) => {
    const s = el("select", {},
      ...(ohneVorgabe ? [el("option", { value: "", text: "wie oben" })] : []),
      ...Object.entries(LS.REIHENFOLGEN).map(([k, t]) => el("option", { value: k, text: t })));
    s.value = wert ?? "";
    return s;
  };
  const reihenfolgeGlobal = reihenfolgeWahl(p.reihenfolge.global, false);
  const reihenfolgeSpiele = SPIELE.filter(s => s.reihenfolge).map(s => ({ s, wahl: reihenfolgeWahl(p.reihenfolge.spiele?.[s.id], true) }));

  // Timer: global ein/aus und Zeitfaktor; je Spiel ein/aus und Sekunden je Stufe (leer = Vorgabe × Faktor).
  const t = p.timer;
  const timerGlobal = el("select", {}, el("option", { value: "aus", text: "aus" }), el("option", { value: "an", text: "an" }));
  timerGlobal.value = t.an ? "an" : "aus";
  const faktor = el("select", {}, ...[[2, "viel Zeit (×2)"], [1.5, "mehr Zeit (×1.5)"], [1, "Vorgabe (×1)"], [0.75, "weniger Zeit (×0.75)"], [0.5, "knapp (×0.5)"]]
    .map(([w, txt]) => el("option", { value: String(w), text: txt })));
  faktor.value = String(t.faktor || 1);
  const timerSpiele = SPIELE.filter(s => LS.spielSichtbar(s.id)).map(s => {
    const an = el("select", {}, el("option", { value: "", text: "wie oben" }), el("option", { value: "an", text: "an" }), el("option", { value: "aus", text: "aus" }));
    const eigen = t.spiele?.[s.id] || {};
    an.value = eigen.an == null ? "" : eigen.an ? "an" : "aus";
    const sekunden = Object.fromEntries(LS.SKALA.map(st => {
      const vorschlag = LS.zeitVorschlag(name, s.id, st.id);
      const feld = el("input", {
        type: "number", min: "5", max: "600", class: "sek",
        placeholder: String(Math.round(LS.vorgabeZeit(s.id, st.id) * (t.faktor || 1))),
        title: vorschlag ? `Aus ${vorschlag.n} gemessenen Aufgaben vorgeschlagen: ${vorschlag.sekunden} s` : "Vorgabe × Faktor",
        "aria-label": `${s.name} Stufe ${st.nr} Sekunden`,
      });
      feld.value = eigen.sekunden?.[st.id] ?? "";
      return [st.id, { feld, vorschlag }];
    }));
    return { s, an, sekunden };
  });
  const timerTabelle = el("div", { class: "timer-tabelle" },
    el("span", {}), el("b", { text: "Timer" }), ...LS.SKALA.map(st => el("b", { text: `${st.icon}${st.nr}` })),
    ...timerSpiele.flatMap(({ s, an, sekunden }) => [
      el("span", { text: `${s.bild} ${s.name}` }), an,
      ...LS.SKALA.map(st => el("span", {}, sekunden[st.id].feld,
        sekunden[st.id].vorschlag ? el("small", { class: "vorschlag", text: `💡${sekunden[st.id].vorschlag.sekunden}` }) : null)),
    ]));

  const meldung = el("span", { class: "leise-text", "aria-live": "polite" });
  const speichern = () => {
    const spiele = {};
    for (const { s, wahl } of reihenfolgeSpiele) if (wahl.value) spiele[s.id] = wahl.value;
    const timerJeSpiel = { ...t.spiele };
    for (const { s, an, sekunden } of timerSpiele) {
      const sek = Object.fromEntries(Object.entries(sekunden).filter(([, x]) => x.feld.value).map(([k, x]) => [k, Number(x.feld.value)]));
      if (an.value || Object.keys(sek).length) timerJeSpiel[s.id] = { an: an.value ? an.value === "an" : null, sekunden: sek };
      else delete timerJeSpiel[s.id];
    }
    LS.speichereProfil(name, {
      alter: alter.value ? Number(alter.value) : null,
      klasse: klasse.value !== "" ? Number(klasse.value) : null,
      vorlesen: vorlesen.value || null,
      fokus: [...fokus.querySelectorAll("input:checked")].map(c => c.value),
      reihenfolge: { global: reihenfolgeGlobal.value, spiele },
      timer: { an: timerGlobal.value === "an", faktor: Number(faktor.value), spiele: timerJeSpiel },
    });
    meldung.textContent = "✓ Gespeichert";
  };
  karte.append(
    el("h2", { text: `Profil von ${LS.spielerName(name)}` }),
    el("div", { class: "profil-felder" }, el("label", {}, "Alter", alter), el("label", {}, "Klasse", klasse)),
    el("div", { html: "<b>Vorlesen</b> — die Eule liest Aufträge und Tipps vor (🗣️ neben der Eule; auch auf der Stufenwahl jedes Spiels einstellbar). „Nach Klasse“: im Kindergarten und in der 1. Klasse automatisch, sonst auf 🗣️. 🔇 in der Kopfzeile schaltet auch die Stimme stumm. Nicht im Lese-Detektiv, in Englisch und Französisch." }),
    el("div", { class: "profil-felder", style: "margin-top:8px" }, el("label", {}, "Vorlesen", vorlesen)),
    el("div", { html: "<b>Fokus</b> — was soll vermehrt geübt werden?" }),
    fokus,
    el("div", { html: "<b>Reihenfolge der Teile</b> — stehen Bausteine wie 3 ZT + 4 H geordnet (grösste Stelle links) oder gemischt?" }),
    el("div", { class: "profil-felder", style: "margin-top:8px" },
      el("label", {}, "Für alle Spiele", reihenfolgeGlobal),
      ...reihenfolgeSpiele.map(({ s, wahl }) => el("label", {}, `${s.bild} ${s.name}`, wahl))),
    el("div", { html: "<b>Timer</b> — jede Aufgabe hat eine Zeit; ist sie um, zählt es als Fehler. Das Kind kann ihn im Spiel auch selbst ein- und ausschalten." }),
    el("div", { class: "profil-felder", style: "margin-top:8px" },
      el("label", {}, "Für alle Spiele", timerGlobal), el("label", {}, "Zeit", faktor)),
    el("details", { class: "timer-details" },
      el("summary", { text: "Sekunden je Spiel und Stufe anpassen (leer = Vorgabe; 💡 = Vorschlag aus den eigenen Zeiten)" }),
      el("div", { class: "tabelle-rahmen" }, timerTabelle)),
    el("div", { class: "knopfzeile", style: "justify-content:flex-start;align-items:center" },
      el("button", { class: "knopf gruen klein", type: "button", text: "Speichern", onclick: speichern }), meldung));
}
