/* Tab „Verwaltung“ (nur Aufsicht): Spiele und Inhaltslisten freigeben oder sperren (Entscheid L4 a),
   Konten anlegen, Rollen und PIN (Entscheid L1 a, L2 a). Alles gilt für dieses Gerät. */
"use strict";

// Suche in der Freigabe (wie im Tab Spiele, KERN.uebersicht.suche, Aussehen suchAttr aus start/spiele.js); bleibt beim
// Neuzeichnen erhalten.
const FREIGABE_SUCHE = KERN.uebersicht.suche();
// Ohne Abgleich-Ordner erinnert die Verwaltung nach so vielen Tagen ohne Sicherung (konzept_gruppen.md 5a; wie im Lernsteig)
const ERINNERUNG_TAGE = 14;

function zeichneVerwaltung(box, neu) {
  const { el } = LS;
  if (!LS.aufsichtAngemeldet()) return;
  const seite = el("div", { class: "verwaltung" });
  box.append(seite);
  const karte = (...inhalt) => el("section", { class: "karte" }, ...inhalt);
  const knopf = (text, onclick, klasse = "hell") => el("button", { type: "button", class: `knopf ${klasse} klein`, text, onclick });
  const zeile = (...k) => el("div", { class: "knopfzeile", style: "justify-content:flex-start;flex-wrap:wrap" }, ...k);
  const stand = g => g
    ? el("span", { class: "pruefstand ok", text: `✓ geprüft ${g.am}${g.von ? " · " + g.von : ""}` })
    : el("span", { class: "pruefstand offen", text: "ungeprüft" });
  /** Schalter mit drei Zuständen: frei, gesperrt, „nach Prüfstand“ (kein eigener Eintrag). */
  function schalter(frei, eigen, setze) {
    return el("div", { class: "zeile-knoepfe" },
      el("button", { type: "button", class: "schalter " + (frei ? "frei" : "gesperrt"), text: frei ? "✓ frei" : "🔒 gesperrt", onclick: () => { setze(!frei); neu(); } }),
      eigen ? el("button", { type: "button", class: "schalter", text: "↺ wie Prüfstand", title: "Eigene Einstellung entfernen", onclick: () => { setze(null); neu(); } }) : null);
  }

  // Neue Fehlermeldungen der Kinder (Anregungen der Aufsicht zählen nicht: die hat sie selbst geschrieben).
  const neueMeldungen = () => LS.meldungen().filter(m => m.status === "neu" && !LS.istAnregung(m)).length;
  // Untertabs (Wunsch Patrik, LERN_Session6), in der Adresse #verwaltung/<id>; ohne Angabe Konten.
  const UNTER = [
    { id: "konten", text: "👥 Konten", zeichne: konten },
    { id: "freigabe", text: "✓ Freigabe", zeichne: freigabeTeil },
    { id: "abgleich", text: "🔄 Abgleich", zeichne: abgleich },
    { id: "einstellungen", text: "⚙️ Einstellungen", zeichne: einstellungen },
    { id: "meldungen", text: `🙋 Meldungen${neueMeldungen() ? ` (${neueMeldungen()})` : ""}`, zeichne: meldungenTeil },
    { id: "entwicklung", text: "🛠 Entwicklung", zeichne: entwicklung },
  ];
  const dev = LS.entwicklung.aktiv();
  /** Entwickler: Prüfstand setzen oder aufheben, danach neu zeichnen (meldet selbst, wenn der Server fehlt). */
  const pruefKnopf = (art, id, g, text) => el("button", { type: "button", class: "schalter", text: g ? "aufheben" : text,
    onclick: async () => { if (await LS.entwicklung.setzeGeprueft(art, id, !g)) neu(); } });
  const unter = UNTER.find(u => u.id === location.hash.split("/")[1]) || UNTER[0];
  const erinnerung = sichernErinnerung();
  if (erinnerung) seite.append(erinnerung);
  seite.append(el("nav", { class: "tabs untertabs", role: "tablist" }, ...UNTER.map(u =>
    el("a", { class: "tab", role: "tab", href: `#verwaltung/${u.id}`, "aria-selected": String(u === unter), text: u.text }))));
  unter.zeichne();

  // ----- Spiele und Listen -----
  function freigabeTeil() {
    const f = LS.freigabe();
    const sichtbar = SPIELE.filter(s => LS.fuerKinderSichtbar(s.id)).length;
    /** Alle Spiele und ihre Listen (Verweise gelten über ihre Quelle) auf einmal setzen. */
    const alleSetzen = wert => {
      for (const s of SPIELE) {
        LS.setzeSpielFrei(s.id, wert);
        for (const l of LS.spielListen(s.id)) if (!l.von) LS.setzeListeFrei(s.id, l.id, wert);
      }
      neu();
    };
    /** Zeilen eines Spiels: das Spiel, darunter seine Inhaltslisten; grund: warum es zur Suche passt. */
    function spielZeilen(s, grund) {
      const g = LS.spielGeprueft(s.id);
      const zeilen = [el("tr", {},
        el("td", {}, `${s.bild} ${s.name}`, grund ? el("div", { class: "marke such-grund", text: `🔍 gefunden ${grund}` }) : null),
        el("td", {}, el("div", { class: "zeile-knoepfe" },
          g || s.neu ? stand(g) : el("span", { class: "pruefstand ok", text: "nichts zu prüfen" }),
          dev ? pruefKnopf("spiele", s.id, g, "✓ angesehen") : null)),
        el("td", {}, schalter(LS.spielFrei(s.id), s.id in f.spiele, w => LS.setzeSpielFrei(s.id, w))))];
      for (const l of LS.spielListen(s.id)) {
        // Verweis auf die Liste eines anderen Spiels: dort freigeben, hier nur zeigen.
        const quelle = l.von ? SPIELE.find(x => x.id === l.von.split("/")[0]) : null;
        // Entwickler: Der Listenname öffnet die Liste; geprüft wird erst dort, nach dem Ansehen.
        zeilen.push(el("tr", {},
          el("td", { style: "padding-left:36px" }, "↳ ", dev && !quelle
            ? el("button", { type: "button", class: "liste-link" + (l.geprueft ? " geprueft" : ""), text: l.name, title: "Liste ansehen", onclick: () => zeigeListe(s, l) })
            : l.name,
            // Prüfansicht je Eintrag im Spiel selbst (LP1 a, LP4 a): für Aufsicht und Lehrperson, auch online
            quelle ? null : el("a", { class: "knopf hell klein", style: "margin-left:8px", href: `${s.pfad}?pruefen=${l.id}`, text: "🔍 prüfen",
              title: "Liste Eintrag für Eintrag prüfen (öffnet das Spiel)" })),
          el("td", {}, stand(l.geprueft)),
          el("td", {}, quelle
            ? el("span", { class: "leise-text", text: `${LS.listeFrei(s.id, l.id) ? "✓ frei" : "🔒 gesperrt"} — wie bei ${quelle.name}` })
            : schalter(LS.listeFrei(s.id, l.id), `${s.id}/${l.id}` in f.listen, w => LS.setzeListeFrei(s.id, l.id, w)))));
      }
      return zeilen;
    }
    const tabelle = zeilen => el("div", { class: "tabelle-rahmen" }, el("table", {},
      el("thead", {}, el("tr", {}, ...["Spiel / Liste", "Prüfstand", "für Kinder"].map(t => el("th", { text: t })))),
      el("tbody", {}, ...zeilen)));
    const gruppen = [];
    const freigabeSuche = FREIGABE_SUCHE.text;
    const treffer = freigabeSuche.trim() ? LS.suche(freigabeSuche) || [] : null;
    if (treffer) {
      // Suche (Entscheid SU1 a): eine Liste, beste Treffer zuerst, je mit Grund, wenn er nicht sichtbar ist.
      if (treffer.length) gruppen.push(el("div", {}, el("h3", { text: `🔍 ${treffer.length} Treffer, beste zuerst` }),
        tabelle(treffer.flatMap(t => spielZeilen(SPIELE.find(s => s.id === t.id), t.grund)))));
    } else {
      // Je Fach eine zuklappbare Gruppe, zu Beginn zu; welche offen sind, merkt sich das Gerät (nicht abgeglichen).
      const offen = new Set(LS.lies("verwaltungOffen", []));
      for (const fach of [...new Set(THEMEN.map(t => t.fach))]) {
        const spiele = SPIELE.filter(s => THEMEN.find(t => t.id === s.thema)?.fach === fach);
        if (!spiele.length) continue;
        const frei = spiele.filter(s => LS.fuerKinderSichtbar(s.id)).length;
        const zuPruefen = spiele.filter(s => LS.spielZuPruefen(s.id) || LS.spielListen(s.id).some(l => !l.von && !l.geprueft)).length;
        const gruppe = el("details", { class: "gruppe" },
          el("summary", {}, el("span", { text: fach }),
            el("span", { class: "anzahl", text: `${frei} von ${spiele.length} frei${zuPruefen ? ` · ${zuPruefen} zu prüfen` : ""}` })),
          tabelle(spiele.flatMap(s => spielZeilen(s, null))));
        gruppe.open = offen.has(fach);
        gruppe.addEventListener("toggle", () => {
          gruppe.open ? offen.add(fach) : offen.delete(fach);
          LS.schreibe("verwaltungOffen", [...offen]);
        });
        gruppen.push(gruppe);
      }
    }
    seite.append(karte(
      el("h2", { text: "Spiele und Inhalte freigeben" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: `Kinder sehen ${sichtbar} von ${SPIELE.length} Spielen. Frei ist, was nichts mehr zu prüfen hat: Neue Spiele sind gesperrt, bis sie angesehen sind, Inhaltslisten, bis sie geprüft sind (Prüfstand im Repo, gesetzt im Entwickler-Modus). Hier lässt sich das anders setzen; mit Abgleich gilt es für alle Geräte. Ein Spiel mit Inhaltslisten braucht mindestens eine freie Liste; die Kinder üben nur die freien Listen.` }),
      zeile(knopf("✓ Alles freigeben", () => alleSetzen(true)), knopf("🔒 Alles sperren", () => alleSetzen(false)), knopf("↺ Alles wie Prüfstand", () => alleSetzen(null))),
      zeile(FREIGABE_SUCHE.feld({ neu, attr: suchAttr("🔍 Spiel oder Inhaltsliste suchen") })),
      ...gruppen,
      gruppen.length ? null : el("p", { class: "leise-text", text: "Kein Spiel passt zur Suche." })));
  }

  // ----- Konten -----
  /** Lernplan je Kind (Entscheid L1 a, LERN_Session10): Tage pro Woche und Minuten je Tag, „aus“ = kein Wochenziel. */
  function lernplanWahl(n, p) {
    const plan = p.lernplan || { tage: 0, minuten: ERFOLGE.LERNPLAN_VORGABE.minuten };
    const tage = el("select", { "aria-label": `Lernplan für ${n}: Tage pro Woche` },
      el("option", { value: "0", text: "aus" }), ...ERFOLGE.LERNPLAN_TAGE.map(t => el("option", { value: String(t), text: `${t} Tag${t === 1 ? "" : "e"}/Woche` })));
    const minuten = el("select", { "aria-label": `Lernplan für ${n}: Minuten je Tag` },
      ...ERFOLGE.LERNPLAN_MINUTEN.map(m => el("option", { value: String(m), text: `${m} min/Tag` })));
    tage.value = String(plan.tage || 0);
    minuten.value = String(plan.minuten || ERFOLGE.LERNPLAN_VORGABE.minuten);
    minuten.disabled = !(plan.tage > 0);
    const setze = () => { LS.speichereProfil(n, { lernplan: { tage: Number(tage.value), minuten: Number(minuten.value) } }); neu(); };
    tage.addEventListener("change", setze);
    minuten.addEventListener("change", setze);
    return el("span", { class: "zeile-knoepfe", title: "Wochenziel: so viele Tage mit so vielen Minuten — jede erfüllte Woche gibt einen Wochenstern" }, el("span", { text: "📅" }), tage, minuten);
  }

  /**
   * Sortierung im Tab Spiele je Kind (Entscheide SO1 a, SO2 a, LERN_Session11): Art (oder „wie Vorgabe“) und ob das
   * Kind selbst wählt (oder „nach Klasse“, Einstellung sortierungWahl).
   */
  function sortierungWahl(n, p) {
    const art = el("select", { "aria-label": `Sortierung für ${n}` },
      el("option", { value: "", text: "wie Vorgabe" }),
      ...Object.entries(LS.EINSTELLUNGEN.sortierung.werte).map(([w, t]) => el("option", { value: w, text: t })));
    art.value = p.sortierung?.art || "";
    const wahl = el("select", { "aria-label": `Darf ${n} die Sortierung selbst wählen?` },
      el("option", { value: "", text: "wählt selbst: nach Einstellung" }),
      el("option", { value: "ja", text: "wählt selbst: ja" }), el("option", { value: "nein", text: "wählt selbst: nein" }));
    wahl.value = p.sortierungWahl === true ? "ja" : p.sortierungWahl === false ? "nein" : "";
    art.addEventListener("change", () => { LS.speichereProfil(n, { sortierung: art.value ? { art: art.value, ab: false } : null }); neu(); });
    wahl.addEventListener("change", () => { LS.speichereProfil(n, { sortierungWahl: wahl.value === "ja" ? true : wahl.value === "nein" ? false : null }); neu(); });
    return el("span", { class: "zeile-knoepfe", title: "Wie das Kind die Spiele im Tab Spiele sortiert sieht, und ob es das selbst ändern darf" }, el("span", { text: "🔀" }), art, wahl);
  }

  /**
   * Wiederherstellung der eigenen PIN (PIN1 a, LERN_Session13): Code neu erzeugen (einmal angezeigt) und
   * Sicherheitsfrage setzen — nur für sich selbst, die Antwort kennt nur, wer sie wählt.
   */
  function meineWiederherstellung() {
    const ich = LS.aktuellerSpieler();
    if (!LS.istAufsicht(ich)) return "";
    const w = LS.wiederherstellung(ich);
    const ausgabe = el("div", { class: "meldung", style: "text-align:left", "aria-live": "polite" });
    const frage = el("input", { class: "feld", type: "text", maxlength: "120", placeholder: "Sicherheitsfrage", "aria-label": "Sicherheitsfrage", value: w.frage || "", style: "min-width:min(100%, 320px);font-size:16px" });
    const antwort = el("input", { class: "feld", type: "text", maxlength: "60", placeholder: "Antwort", "aria-label": "Antwort", autocomplete: "off", style: "font-size:16px" });
    return el("div", { class: "einstellung" },
      el("h3", { text: "🔑 Falls Sie Ihre PIN vergessen" }),
      el("p", { class: "leise-text", style: "margin:0 0 6px", text: `Wiederherstellungscode: ${w.code ? "eingerichtet" : "fehlt"} · Sicherheitsfrage: ${w.frage ? `„${w.frage}“` : "fehlt"}. Bei „PIN vergessen?“ auf der Anmeldung führen sie zu einer neuen PIN; ohne beides bleibt nur eine zweite Aufsicht oder das Zurücksetzen mit Frist (${LS.ZURUECKSETZEN_TAGE} Tage).` }),
      el("div", { class: "zeile-knoepfe" },
        el("button", { type: "button", class: "schalter", text: w.code ? "Neuen Code erzeugen" : "Code erzeugen", onclick: async () => {
          if (w.code && !confirm("Einen neuen Code erzeugen? Der bisherige gilt dann nicht mehr.")) return;
          const code = LS.neuerCode();
          await LS.setzeWiederherstellung(ich, { code });
          ausgabe.replaceChildren(el("span", { text: "Ihr neuer Code (erscheint nur jetzt — aufschreiben, fern von den Kindern aufbewahren): " }),
            el("b", { text: code, style: "font-family:ui-monospace,Consolas,monospace;font-size:20px;letter-spacing:1px;user-select:all" }));
        } })),
      el("div", { class: "zeile-knoepfe", style: "margin-top:6px" }, frage, antwort,
        el("button", { type: "button", class: "schalter", text: "Sicherheitsfrage speichern", onclick: async () => {
          if (frage.value.trim().length < 5 || antwort.value.trim().length < 2) return (ausgabe.textContent = "Bitte Frage und Antwort eingeben.");
          await LS.setzeWiederherstellung(ich, { frage: frage.value, antwort: antwort.value });
          antwort.value = "";
          ausgabe.textContent = "✓ Sicherheitsfrage gespeichert. Wählen Sie eine, deren Antwort Ihre Kinder nicht kennen.";
        } })),
      ausgabe);
  }

  /**
   * Neues Schuljahr (Wunsch Patrik, LERN_Session14): mehrere Kinder auf einmal aufsteigen lassen, nach Klasse geordnet.
   * Bis die Gruppen gebaut sind (LERN-48), ist das die Klassenorganisation der Lehrperson; einzeln geht es im Profil.
   */
  function schuljahr() {
    const letzte = LS.KLASSEN[LS.KLASSEN.length - 1];
    const kinder = LS.kinderListe().map(n => ({ n, k: LS.klasseVon(LS.profil(n)) })).filter(x => x.k !== null && x.k < letzte)
      .sort((a, b) => a.k - b.k || a.n.localeCompare(b.n, "de"));
    if (!kinder.length) return "";
    const wahl = kinder.map(x => {
      const cb = el("input", { type: "checkbox" });
      cb.checked = true;
      return { ...x, cb };
    });
    const klassen = [...new Set(kinder.map(x => x.k))];
    return el("details", { class: "timer-details" },
      el("summary", { text: "⬆️ Neues Schuljahr: Kinder aufsteigen lassen" }),
      el("p", { class: "leise-text", text: "Die angekreuzten Kinder kommen eine Klasse höher; jedes sieht beim nächsten Anmelden eine Nachricht und bekommt das Abzeichen „Aufgestiegen“. Wer die Klasse wiederholt: Haken weg. Zurücknehmen geht im Profil des Kindes." }),
      ...klassen.map(k => el("div", { class: "fokus-liste" }, el("b", { text: `${LS.klasseText(k)} → ${LS.klasseText(k + 1)}` }),
        ...wahl.filter(x => x.k === k).map(x => el("label", {}, x.cb, el("span", { text: LS.spielerName(x.n) }))))),
      el("div", { class: "knopfzeile", style: "justify-content:flex-start" }, knopf("⬆️ Angekreuzte aufsteigen lassen", () => {
        const los = wahl.filter(x => x.cb.checked);
        if (!los.length || !confirm(`${los.length} Kind${los.length === 1 ? "" : "er"} eine Klasse höher setzen?`)) return;
        for (const x of los) LS.aufsteigen(x.n);
        neu();
      }, "gruen")));
  }

  function konten() {
    const meldung = el("div", { class: "meldung", style: "text-align:left", "aria-live": "polite" });
    const kontoZeilen = LS.spielerListe().map(n => {
      const p = LS.profil(n);
      const pin = el("input", { class: "feld", type: "password", inputmode: "numeric", maxlength: "6", placeholder: "neue PIN", "aria-label": `Neue PIN für ${n}`, style: "width:120px;font-size:16px" });
      const ich = n === LS.aktuellerSpieler();
      return el("tr", {},
        el("td", {}, el("b", { text: LS.spielerName(n) }), LS.klasseVon(p) !== null ? el("span", { class: "leise-text", text: ` · ${LS.klasseText(LS.klasseVon(p))}` }) : null),
        el("td", { text: (p.rolle === "aufsicht" ? (p.pin ? "Aufsicht" : LS.gesperrt(n) ? "Aufsicht (🔒 von einem anderen Gerät)" : "Aufsicht (ohne PIN)") : "Kind")
          + (LS.istAusgeblendet(n) ? " · ausgeblendet" : "") }),
        el("td", {}, p.rolle === "aufsicht" ? null : lernplanWahl(n, p)),
        el("td", {}, p.rolle === "aufsicht" ? null : sortierungWahl(n, p)),
        el("td", {}, el("div", { class: "zeile-knoepfe" },
          p.rolle === "aufsicht" ? el("span", { class: "zeile-knoepfe" }, pin,
            el("button", { type: "button", class: "schalter", text: "PIN setzen", onclick: async () => {
              meldung.textContent = (await LS.setzePin(n, pin.value)) ? `✓ PIN für ${n} gesetzt.` : "Die PIN hat 4 bis 6 Ziffern.";
            } })) : null,
          ich ? null : el("button", { type: "button", class: "schalter", text: p.rolle === "aufsicht" ? "→ Kind" : "→ Aufsicht", onclick: () => {
            LS.speichereProfil(n, p.rolle === "aufsicht" ? { rolle: "lernend", pin: null, wiederherstellung: null } : { rolle: "aufsicht" });
            neu();
          } }),
          // Eine gesperrte Aufsicht (von einem anderen Gerät) wird nicht gelöscht, sondern hier ausgeblendet (KE1 a): ein
          // Löschvermerk nähme sie im Abgleich auch auf ihrem eigenen Gerät mit
          ich ? null : LS.istAusgeblendet(n)
            ? el("button", { type: "button", class: "schalter", "data-zeigen": n, text: "👁 wieder zeigen", onclick: () => { LS.zeigen(n); neu(); } })
            : LS.darfAusblenden(n)
              ? el("button", { type: "button", class: "schalter", "data-ausblenden": n, text: "🙈 auf diesem Gerät ausblenden",
                title: "Nicht mehr auf der Anmeldung; auf ihrem eigenen Gerät bleibt sie", onclick: () => { LS.ausblenden(n); neu(); } })
              : el("button", { type: "button", class: "schalter gesperrt", text: "🗑 löschen", onclick: () => {
                if (confirm(`${n} mit Profil und allen Runden löschen? Vorher in der Statistik sichern.`)) { LS.loescheSpieler(n); neu(); }
              } }))));
    });
    const neuName = el("input", { class: "feld", type: "text", maxlength: "20", placeholder: "Name", "aria-label": "Name des neuen Kindes" });
    const neuKlasse = el("select", { "aria-label": "Klasse" }, el("option", { value: "", text: "Klasse —" }),
      ...LS.KLASSEN.map(k => el("option", { value: String(k), text: LS.klasseText(k) })));
    const anlegen = () => {
      const n = LS.neuerSpieler(neuName.value, { klasse: neuKlasse.value !== "" ? Number(neuKlasse.value) : null });
      if (!n) return (meldung.textContent = "Bitte einen neuen, noch nicht vergebenen Namen eingeben.");
      neu();
    };
    seite.append(karte(
      el("h2", { text: "Konten" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Kinder melden sich ohne PIN an. Die Aufsicht braucht ihre PIN, sieht alle Spiele und Statistiken und spielt als Tester (Runden zählen nicht in der Statistik, im Spiel gibt es Testhilfen). Eine neue Aufsicht: auf der Anmeldung „🐣 Ich bin neu“ → „Ich bin erwachsen“ (eine Aufsicht bestätigt mit ihrer PIN), oder hier als Kind anlegen, „→ Aufsicht“ und PIN setzen." }),
      el("div", { class: "tabelle-rahmen" }, el("table", {},
        el("thead", {}, el("tr", {}, ...["Name", "Rolle", "📅 Lernplan", "🔀 Sortierung", ""].map(t => el("th", { text: t })))),
        el("tbody", {}, ...kontoZeilen))),
      meineWiederherstellung(),
      schuljahr(),
      el("h3", { text: "Neues Kind" }),
      el("div", { class: "pin-zeile", style: "justify-content:flex-start" }, neuName, neuKlasse, knopf("＋ Anlegen", anlegen, "gruen")),
      meldung));
  }

  // ----- Abgleich zwischen Geräten (Entscheid S1 a) -----
  function abgleich() {
    const ab = LS.abgleich;
    const abMeldung = el("div", { class: "meldung", style: "text-align:left", "aria-live": "polite" });
    const melde = r => {
      abMeldung.textContent = r.status === "ok" ? `✓ Abgeglichen. ${ab.ergebnisText(r.neu)}`
        : r.status === "keine-erlaubnis" ? "Der Browser hat den Zugriff auf den Ordner nicht erlaubt."
        : r.status === "kein-ordner" ? "Noch kein Ordner gewählt."
        : `Das ging nicht: ${r.fehler}`;
    };
    const geraetName = el("input", { class: "feld", type: "text", maxlength: "30", placeholder: "z. B. Laptop Wohnzimmer", "aria-label": "Name dieses Geräts", value: ab.geraet().name });
    const abDatei = el("input", { type: "file", accept: "application/json", style: "display:none" });
    abDatei.addEventListener("change", async () => {
      const f = abDatei.files[0];
      if (!f) return;
      try { abMeldung.textContent = `✓ Eingelesen. ${ab.ergebnisText(await ab.dateiEinlesen(f))}`; }
      catch (e) { abMeldung.textContent = e?.message || "Diese Datei kann ich nicht lesen."; }
      finally { abDatei.value = ""; }
    });
    const st = ab.stand();
    const zeit = iso => new Date(iso).toLocaleString("de-CH", { dateStyle: "short", timeStyle: "short" });
    const ordnerTeil = ab.kannOrdner
      ? [st?.ordner
          ? el("p", { style: "margin:0 0 6px" }, "Ordner ", el("b", { text: st.ordner }),
            `, zuletzt abgeglichen ${zeit(st.zuletzt)}. Andere Geräte: ${st.geraete.length
              ? st.geraete.map(g => (g.fehler ? `${g.datei} (unlesbar)` : `${g.name || g.id} (Stand ${zeit(g.gesichert)})`)).join(", ")
              : "noch keine"}.`)
          : el("p", { style: "margin:0 0 6px", text: "Noch kein Ordner gewählt." }),
        zeile(
          knopf(st?.ordner ? "📁 Anderer Ordner" : "📁 Ordner wählen", async () => {
            try { melde(await ab.waehlen()); } catch { abMeldung.textContent = "Kein Ordner gewählt."; return; }
            neu();
          }, st?.ordner ? "hell" : "gruen"),
          st?.ordner ? knopf("🔄 Jetzt abgleichen", async () => { melde(await ab.jetzt(true)); neu(); }) : null,
          st?.ordner ? knopf("Ordner vergessen", async () => { await ab.vergessen(); neu(); }) : null)]
      : [el("p", { class: "leise-text", style: "margin:0 0 6px", text: "Dieser Browser kann keinen Ordner verwenden — das geht heute in Chrome und Edge auf dem Computer. Abgleichen geht hier über eine Datei: unten sichern, auf dem anderen Gerät einlesen, und umgekehrt." })];
    seite.append(karte(
      el("h2", { text: "Abgleich zwischen Geräten" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Haben die Kinder und die Aufsicht eigene Geräte, wählt man auf jedem denselben Ordner — einen Netzwerkordner oder den Ordner eines Cloud-Dienstes. Jedes Gerät schreibt dort seine eigene Datei und liest die der anderen: Runden, Endlos-Rekorde, Kinder, Einstellungen und Freigaben. So sind Ranglisten und Statistik überall vollständig. Die PIN bleibt auf dem Gerät." }),
      el("div", { class: "pin-zeile", style: "justify-content:flex-start" }, geraetName,
        knopf("Gerät benennen", () => { ab.benenne(geraetName.value); abMeldung.textContent = "✓ Name gespeichert."; })),
      ...ordnerTeil,
      zeile(knopf("💾 Abgleich-Datei sichern", () => ab.dateiSichern()), knopf("📂 Abgleich-Datei einlesen", () => abDatei.click())),
      abDatei, abMeldung));
  }

  // ----- Weg der Meldungen und Adresse des Entwickler-Servers (Plan C11, C11-3 a; KERN.meldungen.meldeweg) -----
  // Nur auf diesem Gerät. Erlaubt ist nur ein Entwickler-Server auf diesem Gerät (localhost, 127.0.0.1).
  function meldewegTeil() {
    const w = LS.meldeweg();
    const WEGE = [["auto", "Automatisch: Entwickler-Server, sonst E-Mail, sonst Text"], ["server", "Nur Entwickler-Server"],
      ["mail", "Nur E-Mail aus dem eigenen Mailprogramm"], ["text", "Nur Text kopieren"]];
    const hinweis = el("p", { class: "leise-text", "aria-live": "polite" });
    const adresse = el("input", { type: "text", class: "feld", name: "server-adresse", value: w.eigeneAdresse ? w.server : "", style: "width:100%;box-sizing:border-box",
      placeholder: `Vorgabe: ${w.vorgabe || "diese Seite"}`, "aria-label": "Adresse des Entwickler-Servers", autocomplete: "off" });
    const setze = daten => { try { LS.setzeMeldeweg(daten); neu(); } catch (e) { hinweis.textContent = e.message; } };
    return el("div", { class: "einstellung" },
      el("h3", { text: "Meldungen an die Entwicklung" }),
      el("p", { class: "leise-text", style: "margin:0 0 6px", text: `Wie bestätigte Meldungen und Anregungen weitergehen. E-Mail an: ${LS.meldungAdresse() || "— noch keine Adresse eingetragen (kontakt.js)"}.` }),
      el("div", { class: "zeile-knoepfe" }, ...WEGE.map(([wert, text]) => el("button", { type: "button", class: "schalter" + (wert === w.weg ? " frei" : ""),
        "aria-pressed": String(wert === w.weg), "data-meldeweg": wert, text: (wert === w.weg ? "✓ " : "") + text,
        onclick: () => setze({ weg: wert, server: w.eigeneAdresse ? w.server : null }) }))),
      el("label", { class: "leise-text", text: "Adresse des Entwickler-Servers (leer: diese Seite; nur http://localhost:<Port> oder http://127.0.0.1:<Port>)" }),
      adresse,
      zeile(knopf("Adresse speichern", () => setze({ weg: w.weg, server: adresse.value })),
        knopf("↺ Vorgabe", () => setze({ weg: w.weg, server: null })),
        // Prüft die Adresse im Feld (was „Adresse speichern“ speichern würde) und nennt sie (Rückmeldung Patrik LERN_Session27)
        knopf("Verbindung prüfen", async () => {
          hinweis.textContent = "Prüfe …";
          const p = await LS.entwicklung.verbindungPruefen(adresse.value);
          hinweis.textContent = p.text + (!p.ungueltig && p.adresse !== LS.meldeweg().server ? " Die Adresse ist noch nicht gespeichert." : "");
        })),
      hinweis);
  }

  // ----- Speicher (docs/konzept_gruppen.md 5a, D11 a, Kern 1.34.0; wie im Lernsteig) -----
  /** Ohne Abgleich-Ordner erinnert die Seite ans Sichern, wenn es Runden gibt und seit 14 Tagen keine Sicherung war. */
  function sichernErinnerung() {
    if ((LS.abgleich.stand() || {}).ordner) return null;
    const runden = LS.protokoll();
    if (!runden.length) return null;
    // Gezählt ab der letzten Sicherung aller Kinder, ohne Sicherung ab der ältesten Runde (erst nach 14 Tagen Spielen erinnern)
    const letzte = LS.lies("letzteSicherung", null);
    const seit = letzte || runden.map(r => r && r.zeit).filter(Boolean).sort()[0];
    const tage = seit ? Math.floor((Date.now() - Date.parse(seit)) / 864e5) : 0;
    if (!(tage >= ERINNERUNG_TAGE)) return null;
    return el("p", { class: "meldung", role: "status", "data-erinnerung": "sichern",
      text: `${letzte ? `Die letzte Sicherung ist ${tage} Tage alt` : `Seit ${tage} Tagen wird hier gespielt und noch nie gesichert`}, und es ist kein Abgleich-Ordner gewählt. `
        + "Bitte unter 📊 Statistik „💾 Alle sichern“ tippen oder unter 🔄 Abgleich einen Ordner wählen. "
        + "Safari löscht die Daten einer Seite, die sieben Tage lang nicht geöffnet wurde." });
  }
  const mb = byte => `${(byte / 1048576).toFixed(byte < 10485760 ? 1 : 0)} MB`;
  /** Belegung und „dauerhaft“ (KERN.speicher.belegung), mit Warnung ab 80 %; gemessen nach dem Zeichnen. */
  function speicherTeil() {
    const ausgabe = el("div", { "data-speicher": "", class: "leise-text", text: "Wird gemessen …" });
    const hinweis = el("p", { class: "leise-text", "aria-live": "polite" });
    KERN.speicher.belegung().then(b => {
      const zeilen = [
        `Kleiner Speicher (localStorage, alle Apps unter dieser Adresse): ${mb(b.lokal.byte)} von 5 MB (${Math.round(b.lokal.anteil * 100)} %)`,
        b.ablage ? `Ablage für Runden, Rekorde und Meldungen (IndexedDB): ${mb(b.ablage.belegt)} belegt, ${mb(b.ablage.verfuegbar)} verfügbar` : "Ablage (IndexedDB): keine Angabe des Browsers",
        LS.SPEICHER.modus() === "idb" ? "Runden und Rekorde liegen in der Ablage." : "Runden und Rekorde liegen im kleinen Speicher (dieser Browser hat keine Ablage).",
        b.dauerhaft === true ? "Der Browser hält die Daten dauerhaft (löscht nicht von selbst)." : "Der Browser darf die Daten bei Platzmangel von selbst löschen.",
      ];
      ausgabe.replaceChildren(...[
        b.warnen ? el("p", { class: "meldung", role: "alert", text: "Der Speicher ist fast voll (über 80 %). Bitte in der Statistik sichern und alte Runden löschen." }) : null,
        ...zeilen.map(t => el("p", { style: "margin:0 0 4px", text: t })),
        b.dauerhaft === true ? null : zeile(el("button", { type: "button", class: "knopf hell klein", "data-aktion": "dauerhaft", text: "Browser bitten, nichts von selbst zu löschen",
          onclick: async () => {
            const ok = await KERN.speicher.dauerhaftBitten();
            if (ok) neu(); else hinweis.textContent = "Der Browser hat abgelehnt oder fragt später; regelmässig sichern bleibt der Schutz.";
          } })),
      ].filter(Boolean));
    });
    return el("div", { class: "einstellung" },
      el("h3", { text: "Speicher" }),
      el("p", { class: "leise-text", style: "margin:0 0 6px", text: "Alles bleibt in diesem Browser. Runden, Rekorde und Meldungen liegen in einer eigenen Ablage, die viel mehr fasst als der kleine Speicher." }),
      ausgabe, hinweis);
  }

  // ----- Einstellungen für alle auf diesem Gerät (LERN_Session7; später je Klasse durch die Lehrperson) -----
  function einstellungen() {
    /** Ein Knopf je Wahl; gewählt ist, was 'aktuell' gleicht (null = „wie global“). */
    const wahlKnoepfe = (wahlen, aktuell, setze) => el("div", { class: "zeile-knoepfe" }, ...wahlen.map(([wert, text]) =>
      el("button", { type: "button", class: "schalter" + (wert === aktuell ? " frei" : ""), "aria-pressed": String(wert === aktuell),
        text: (wert === aktuell ? "✓ " : "") + text, onclick: () => { setze(wert); neu(); } })));
    const zeilen = Object.entries(LS.EINSTELLUNGEN).map(([name, e]) => {
      const global = LS.einstellung(name, null);
      // Spiele, die die Einstellung nutzen (Katalog, Feld einstellungen): je Spiel „wie global“ oder ein eigener Wert
      // spieleWie: gilt in denselben Spielen wie eine andere Einstellung (Notizblock wie Notizen, NB2 a)
      const spiele = SPIELE.filter(s => s.einstellungen?.includes(e.spieleWie || name));
      return el("div", { class: "einstellung" },
        el("h3", { text: e.titel }),
        el("p", { class: "leise-text", style: "margin:0 0 6px", text: e.erklaerung }),
        wahlKnoepfe(Object.entries(e.werte).map(([w, t]) => [w, t + (w === e.standard ? " (Standard)" : "")]), global, w => LS.setzeEinstellung(name, w)),
        spiele.length ? el("details", { class: "einstellung-spiele" },
          el("summary", { text: `Je Spiel (${spiele.length})` }),
          ...spiele.map(s => el("div", { class: "einstellung-spiel" },
            el("span", { text: `${s.bild} ${s.name}` }),
            wahlKnoepfe([[null, `wie global (${e.werte[global].split(":")[0]})`], ...Object.entries(e.werte).map(([w, t]) => [w, t.split(":")[0]])],
              LS.einstellungSpiel(name, s.id), w => LS.setzeEinstellung(name, w, s.id))))) : null);
    });
    seite.append(karte(
      el("h2", { text: "Einstellungen" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Gelten für alle Kinder auf diesem Gerät, je Spiel auch abweichend. „Alles auf Standard“ setzt auch die Spiele zurück." }),
      ...zeilen,
      zeile(knopf("↺ Alles auf Standard", () => { LS.einstellungenZuruecksetzen(); neu(); })),
      meldewegTeil(),
      speicherTeil(),
      // Freiwillige Beiträge (LERN-50): nur hier für die Aufsicht und nur, wenn ein Link eingetragen ist
      typeof unterstuetzenAktiv === "function" && unterstuetzenAktiv().length
        ? el("p", { class: "leise-text", style: "margin-top:14px" }, el("a", { href: "../portal/unterstuetzen.html", text: "☕ Eulenpfad unterstützen" }),
          document.createTextNode(" — freiwillig; alle Spiele bleiben für alle gleich."))
        : null,
      // Impressum und Datenschutz (Plan C12, IM1 a): für die Aufsicht, nie in Tabs der Kinder
      el("p", { class: "leise-text", style: "margin-top:14px" }, el("a", { href: "../portal/impressum.html", text: "Impressum und Datenschutz" }),
        document.createTextNode(" — wer dahintersteht und wann Daten das Gerät verlassen."))));
  }

  // ----- Entwicklung (Entscheide E1 a, E2 a) -----
  function entwicklung() {
    const en = LS.entwicklung;
    const meldung = el("div", { class: "meldung", style: "text-align:left", "aria-live": "polite" });
    const status = el("p", { style: "margin:0 0 8px", text: "Entwickler-Server: wird gesucht …" });
    en.server().then(s => {
      status.textContent = s ? `Entwickler-Server: verbunden${s.schluessel ? "" : " — aber entwickler.key fehlt (python tools/entwickler_server.py --neuer-schluessel)"}.`
        : `${en.serverMeldung().replace(/\n+/g, " ")} Freischalten geht trotzdem; prüfen und Bemerkungen speichern erst mit laufendem Entwickler-Server.`;
    });
    const teile = [];
    if (!en.freigeschaltet()) {
      const feld = el("input", { class: "feld", type: "password", autocomplete: "off", placeholder: "Entwickler-Schlüssel", "aria-label": "Entwickler-Schlüssel" });
      const los = async () => {
        if (await en.freischalten(feld.value)) return neu();
        meldung.textContent = "Dieser Schlüssel passt nicht.";
        feld.value = "";
      };
      feld.addEventListener("keydown", e => { if (e.key === "Enter") los(); });
      teile.push(el("div", { class: "pin-zeile", style: "justify-content:flex-start" }, feld, knopf("Freischalten", los, "gruen")));
    } else {
      const an = en.zustand().an;
      const name = el("input", { class: "feld", type: "text", maxlength: "40", placeholder: "Name für „geprüft von“", "aria-label": "Name für geprüft von", value: en.zustand().name });
      teile.push(
        zeile(knopf(an ? "🛠 Entwickler-Zusätze an" : "Entwickler-Zusätze aus", () => { en.setzeAn(!an); neu(); }, an ? "gruen" : "hell"),
          knopf("Schlüssel auf diesem Gerät vergessen", () => { en.sperren(); neu(); })),
        el("div", { class: "pin-zeile", style: "justify-content:flex-start" }, name,
          knopf("Name speichern", () => { en.benenne(name.value); meldung.textContent = "✓ Name gespeichert."; })));
      // Bemerkungen: offene zuerst; ich arbeite sie ab und setze sie in bemerkungen.json auf „erledigt“.
      const liste = el("div", { text: "Bemerkungen werden geladen …", class: "leise-text" });
      const neueBemerkung = el("div");
      // Per E-Mail angekommene Fehlermeldung (Entscheid M1 a): Text einfügen → Bemerkung mit derselben Kennung.
      const einfuegen = () => {
        neueBemerkung.innerHTML = "";
        const feld = el("textarea", { rows: "6", class: "feld", style: "width:100%;box-sizing:border-box;font-size:15px", placeholder: "Text der E-Mail hier einfügen (ab „Meldung M-…“)", "aria-label": "Text der Meldung" });
        const hinweis = el("span", { class: "leise-text" });
        neueBemerkung.append(feld, zeile(knopf("Als Bemerkung speichern", async () => {
          const kennung = LS.meldungAusText(feld.value);
          if (!kennung) return (hinweis.textContent = "Keine Kennung „Meldung M-…“ gefunden.");
          const b = await en.bemerkung({ text: feld.value.trim(), ...kennung });
          if (b) { hinweis.textContent = `✓ Bemerkung Nr. ${b.nr} (${kennung.meldung}).`; setTimeout(neu, 900); }
        }, "gruen"), knopf("Abbrechen", () => (neueBemerkung.innerHTML = "")), hinweis));
        feld.focus();
      };
      teile.push(el("h3", { text: "Bemerkungen" }),
        zeile(knopf("📝 Allgemeine Bemerkung", () => {
          neueBemerkung.innerHTML = "";
          neueBemerkung.append(en.bemerkungsFeld(() => ({}), () => neu()));
        }), knopf("🙋 Meldung aus E-Mail einfügen", einfuegen)),
        el("p", { class: "klein", text: LS.meldungAdresse()
          ? `Meldungen per E-Mail an: ${LS.meldungAdresse()} (eulenpfad/kontakt.js)`
          : "Noch keine Adresse für Meldungen: in eulenpfad/kontakt.js bei „meldungen“ eintragen. Bis dahin kann die Aufsicht Meldungen nur als Text kopieren." }),
        neueBemerkung, liste);
      en.bemerkungen().then(b => {
        liste.innerHTML = "";
        if (!b) return (liste.textContent = "Nur mit laufendem Entwickler-Server sichtbar.");
        if (!b.length) return (liste.textContent = "Noch keine Bemerkungen.");
        const sortiert = [...b].sort((x, y) => (x.status === y.status ? y.nr - x.nr : x.status === "offen" ? -1 : 1));
        liste.append(el("div", { class: "tabelle-rahmen" }, el("table", {},
          el("thead", {}, el("tr", {}, ...["Nr.", "Stand", "Wo", "Bemerkung"].map(t => el("th", { text: t })))),
          el("tbody", {}, ...sortiert.map(x => el("tr", {},
            el("td", { text: String(x.nr) }),
            el("td", { text: x.status === "offen" ? "offen" : `✓ ${x.status}` }),
            el("td", { text: [x.spiel, x.stufe, x.liste, x.eintrag].filter(Boolean).join(" · ") || "allgemein" }),
            el("td", { text: x.text + (x.aufgabe ? ` (${x.aufgabe})` : "") })))))));
      });
    }
    seite.append(karte(
      el("h2", { text: "Entwicklung" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Der Entwickler-Modus funktioniert nur im lokalen Repo mit laufendem Entwickler-Server: python tools/entwickler_server.py, dann http://localhost:8765/eulenpfad/ öffnen. Freigeschaltet wird er mit dem Schlüssel aus entwickler.key. Dann gibt es in den Spielen eine Leiste mit „Spiel angesehen“ und „Bemerkung“, und in der Freigabe „geprüft“ und „ansehen“ je Spiel und Inhaltsliste. Was hier geprüft wird, gilt nach Commit und Push für alle; eine lokale Sperre der Aufsicht gilt weiter." }),
      status, ...teile, meldung));
  }

  /** Inhaltsliste ansehen (Entscheid E3 a); danach die Seite neu zeichnen. */
  function zeigeListe(s, l) { LS.entwicklung.zeigeListe(s, l, neu); }

  // ----- Fehlermeldungen der Kinder (Wunsch Patrik, LERN_Session9) -----
  // Die Aufsicht prüft jede Meldung: kein Fehler (mit Erklärung ans Kind) oder bestätigt; Bestätigtes gibt
  // sie an die Entwicklung weiter, ohne den Namen. Antworten der Entwicklung holt „Antworten abfragen“.
  function meldungenTeil() {
    const ich = LS.aktuellerSpieler();
    const REIHE = ["neu", "bestaetigt", "weitergeleitet", "geplant", "behoben", "kein-fehler"];
    const alle = LS.meldungen().filter(m => !LS.istAnregung(m)).sort((a, b) => REIHE.indexOf(a.status) - REIHE.indexOf(b.status) || (a.zeit < b.zeit ? 1 : -1));
    const meldung = el("p", { class: "leise-text", "aria-live": "polite" });
    const spielName = id => SPIELE.find(s => s.id === id)?.name || id;
    const datum = iso => new Date(iso).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" });

    /**
     * An die Entwicklung: mit Entwickler-Server direkt in die Bemerkungen; sonst per E-Mail aus dem eigenen
     * Mailprogramm (Entscheid M1 a; die Aufsicht sieht den Text und sendet selbst); ohne Adresse als Text.
     */
    async function weitergeben(m) {
      const weg = await LS.meldungWeitergeben(m, {
        von: ich,
        bestaetigen: art => confirm(art === "anregung" ? "Das Mailprogramm öffnet sich mit der Anregung. Bitte ansehen und senden."
          : "Das Mailprogramm öffnet sich mit der Meldung — ohne den Namen des Kindes. Bitte ansehen und senden."),
        oeffne: url => { location.href = url; },
        kopiere: async text => { try { await navigator.clipboard.writeText(text); } catch { prompt("Diesen Text an die Entwicklung schicken:", text); } },
        melde: text => alert(text), // gewählter Weg geht nicht (Verwaltung → Einstellungen, C11-3 a)
      });
      if (weg) neu();
    }
    /** Antworten der Entwicklung holen: Bemerkungen (Entwickler-Server) und die veröffentlichte Datei. */
    async function abfragen() {
      const n = await LS.meldungenAbfragen();
      neu();
      setTimeout(() => alert(n ? `${n} Antwort${n === 1 ? "" : "en"} der Entwicklung übernommen.` : "Keine neuen Antworten der Entwicklung."), 0);
    }

    function eintrag(m) {
      const st = LS.MELDUNG_STATUS[m.status] || { text: m.status };
      const antwortFeld = el("textarea", { rows: "2", class: "feld", placeholder: "Nachricht an das Kind (freundlich, ohne Fachsprache)", "aria-label": "Nachricht an das Kind" });
      antwortFeld.value = m.antwort || "";
      const aktionen = [];
      if (m.status === "neu") {
        aktionen.push(knopf("✓ Ist ein Fehler", () => { LS.setzeMeldung(m.id, { status: "bestaetigt", antwort: antwortFeld.value.trim() || undefined }, { von: ich }); neu(); }, "gruen"),
          knopf("✗ Kein Fehler", () => {
            if (!antwortFeld.value.trim()) { antwortFeld.focus(); meldung.textContent = "Bitte dem Kind kurz erklären, warum es kein Fehler ist."; return; }
            LS.setzeMeldung(m.id, { status: "kein-fehler", antwort: antwortFeld.value.trim() }, { von: ich }); neu();
          }));
      }
      if (m.status === "bestaetigt") aktionen.push(knopf("📤 An die Entwicklung", () => weitergeben(m), "gruen"));
      aktionen.push(knopf("💬 Nachricht speichern", () => { LS.setzeMeldung(m.id, { antwort: antwortFeld.value.trim() }, { von: ich }); meldung.textContent = "✓ Nachricht gespeichert."; }),
        knopf("📋 Text kopieren", async () => { try { await navigator.clipboard.writeText(LS.meldungFuerEntwicklung(m)); meldung.textContent = "✓ Kopiert."; } catch { prompt("Text:", LS.meldungFuerEntwicklung(m)); } }));
      const zeilen = [
        ["Art", LS.MELDUNG_ARTEN[m.art] || m.art], ["Aufgabe", m.aufgabe], ["Erwartete Lösung", m.loesung],
        ["Eingaben des Kindes", m.eingabe], ["Gewertet", m.ergebnis], ["Begründung", m.text],
      ].filter(([, w]) => w);
      return el("details", { class: `meldung-eintrag status-${m.status}`, ...(["neu", "bestaetigt"].includes(m.status) ? { open: "" } : {}) },
        el("summary", {}, el("b", { text: `${m.name} · ${spielName(m.spiel)} · Stufe ${String(m.stufe).slice(1)}` }),
          el("span", { class: "leise-text", text: ` · ${datum(m.zeit)} · ${st.text}` })),
        el("dl", {}, ...zeilen.flatMap(([k, w]) => [el("dt", { text: k }), el("dd", { text: w })])),
        (m.verlauf || []).length > 1 ? el("p", { class: "leise-text", text: "Verlauf: " + m.verlauf.map(v => `${datum(v.zeit)} ${LS.MELDUNG_STATUS[v.status]?.text || v.status}${v.von ? ` (${v.von})` : ""}${v.notiz ? `: ${v.notiz}` : ""}`).join(" → ") }) : null,
        antwortFeld, zeile(...aktionen));
    }

    const offen = alle.filter(m => ["neu", "bestaetigt"].includes(m.status)).length;
    seite.append(karte(
      el("h2", { text: "🙋 Fehlermeldungen der Kinder" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Kinder melden mit „🙋 Melden“ im Spiel einen Fehler in der Aufgabe oder der Aufgabe davor (Einstellungen: ab welcher Klasse). Bitte jede Meldung ansehen: Ist es ein Fehler, bestätigen und an die Entwicklung weitergeben — dabei reist der Name nicht mit. Ist es keiner, dem Kind kurz erklären, warum. Ein echter Fehler, den die Entwicklung behebt, zählt in der Statistik des Kindes als „🏅 Fehlerfinder“." }),
      zeile(knopf("🔄 Antworten der Entwicklung abfragen", abfragen)),
      meldung,
      alle.length ? el("div", { class: "meldungen" }, ...alle.map(eintrag))
        : el("p", { class: "leise-text", text: "Noch keine Meldungen." }),
      alle.length ? el("p", { class: "leise-text", text: `${offen} offen, ${alle.length - offen} weitergegeben oder abgeschlossen.` }) : null));

    // ----- Anregungen an die Entwicklung (Wunsch Patrik, LERN_Session11) -----
    // Die Aufsicht schlägt neue Spiele, Verbesserungen oder Inhalte vor; derselbe Weg wie bei Meldungen, ohne Daten
    // über ein Kind. Gesendet wird gleich beim Speichern; die Antwort kommt mit „Antworten abfragen“.
    const art = el("select", { class: "feld", "aria-label": "Art der Anregung" },
      ...Object.entries(LS.ANREGUNG_ARTEN).map(([w, t]) => el("option", { value: w, text: t })));
    const spiel = el("select", { class: "feld", "aria-label": "Spiel (falls es um eines geht)" },
      el("option", { value: "", text: "— kein bestimmtes Spiel —" }),
      ...[...SPIELE].sort((a, b) => a.name.localeCompare(b.name, "de")).map(s => el("option", { value: s.id, text: `${s.bild} ${s.name}` })));
    const text = el("textarea", { class: "feld", rows: "4", placeholder: "Was wünschen Sie sich? Bitte keine Namen von Kindern.", "aria-label": "Anregung" });
    const hinweis = el("p", { class: "leise-text", "aria-live": "polite" });
    const senden = async () => {
      const t = text.value.trim();
      if (t.split(/\s+/).length < 4) { hinweis.textContent = "Bitte in ein paar Worten beschreiben, worum es geht."; text.focus(); return; }
      const a = LS.neueAnregung({ name: ich, art: art.value, spiel: spiel.value || undefined, text: t });
      await weitergeben(a);
      neu(); // auch wenn das Senden abgebrochen wurde: die Anregung steht dann mit „📤 Senden“ in der Liste
    };
    const STATUS_REIHE = ["neu", "weitergeleitet", "geplant", "behoben", "kein-fehler"];
    const eigene = LS.anregungen().sort((a, b) => STATUS_REIHE.indexOf(a.status) - STATUS_REIHE.indexOf(b.status) || (a.zeit < b.zeit ? 1 : -1));
    const anregungEintrag = m => el("details", { class: `meldung-eintrag status-${m.status}` },
      el("summary", {}, el("b", { text: `${LS.ANREGUNG_ARTEN[m.art] || m.art}${m.spiel ? ` · ${spielName(m.spiel)}` : ""}` }),
        el("span", { class: "leise-text", text: ` · ${datum(m.zeit)} · ${LS.ANREGUNG_STATUS[m.status] || m.status}` })),
      el("p", { text: m.text }),
      m.antwort ? el("p", {}, el("b", { text: "Antwort der Entwicklung: " }), document.createTextNode(m.antwort)) : null,
      m.status === "neu" ? zeile(knopf("📤 Senden", () => weitergeben(m), "gruen")) : null);
    seite.append(karte(
      el("h2", { text: "💡 Anregungen an die Entwicklung" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Ein Spiel fehlt, eines liesse sich verbessern, ein Lehrmittel schreibt anders? Schreiben Sie es hier. Es geht wie eine Fehlermeldung an die Entwicklung — per E-Mail aus Ihrem Mailprogramm oder, wo eingerichtet, direkt. Die Antwort holen Sie oben mit „Antworten der Entwicklung abfragen“." }),
      el("div", { class: "anregung-formular" }, art, spiel, text),
      zeile(knopf("💡 Anregung senden", senden, "gruen")),
      hinweis,
      eigene.length ? el("div", { class: "meldungen" }, ...eigene.map(anregungEintrag)) : null));
  }
}
