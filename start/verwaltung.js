/* Tab „Verwaltung“ (nur Aufsicht): Spiele und Inhaltslisten freigeben oder sperren (Entscheid L4 a),
   Konten anlegen, Rollen und PIN (Entscheid L1 a, L2 a). Alles gilt für dieses Gerät. */
"use strict";

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

  // ----- Spiele und Listen -----
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
  const zeilen = [];
  for (const fach of [...new Set(THEMEN.map(t => t.fach))]) {
    const spiele = SPIELE.filter(s => THEMEN.find(t => t.id === s.thema)?.fach === fach);
    if (!spiele.length) continue;
    zeilen.push(el("tr", {}, el("th", { colspan: "3", style: "padding-top:14px;font-size:15px;color:var(--text)", text: fach })));
    for (const s of spiele) {
      zeilen.push(el("tr", {},
        el("td", { text: `${s.bild} ${s.name}` }),
        el("td", {}, s.geprueft || s.neu ? stand(s.geprueft) : el("span", { class: "pruefstand ok", text: "nichts zu prüfen" })),
        el("td", {}, schalter(LS.spielFrei(s.id), s.id in f.spiele, w => LS.setzeSpielFrei(s.id, w)))));
      for (const l of LS.spielListen(s.id)) {
        // Verweis auf die Liste eines anderen Spiels: dort freigeben, hier nur zeigen.
        const quelle = l.von ? SPIELE.find(x => x.id === l.von.split("/")[0]) : null;
        zeilen.push(el("tr", {},
          el("td", { style: "padding-left:36px", text: `↳ ${l.name}` }),
          el("td", {}, stand(l.geprueft)),
          el("td", {}, quelle
            ? el("span", { class: "leise-text", text: `${LS.listeFrei(s.id, l.id) ? "✓ frei" : "🔒 gesperrt"} — wie bei ${quelle.name}` })
            : schalter(LS.listeFrei(s.id, l.id), `${s.id}/${l.id}` in f.listen, w => LS.setzeListeFrei(s.id, l.id, w)))));
      }
    }
  }
  seite.append(karte(
    el("h2", { text: "Spiele und Inhalte freigeben" }),
    el("p", { class: "leise-text", style: "margin-top:0", text: `Kinder sehen ${sichtbar} von ${SPIELE.length} Spielen. Frei ist, was nichts mehr zu prüfen hat: Neue Spiele sind gesperrt, bis sie angesehen sind, Inhaltslisten, bis sie geprüft sind (Eintrag im Katalog). Hier lässt sich das anders setzen; mit Abgleich gilt es für alle Geräte. Ein Spiel mit Inhaltslisten braucht mindestens eine freie Liste; die Kinder üben nur die freien Listen.` }),
    zeile(knopf("✓ Alles freigeben", () => alleSetzen(true)), knopf("🔒 Alles sperren", () => alleSetzen(false)), knopf("↺ Alles wie Prüfstand", () => alleSetzen(null))),
    el("div", { class: "tabelle-rahmen" }, el("table", {},
      el("thead", {}, el("tr", {}, ...["Spiel / Liste", "Prüfstand", "für Kinder"].map(t => el("th", { text: t })))),
      el("tbody", {}, ...zeilen)))));

  // ----- Konten -----
  const meldung = el("div", { class: "meldung", style: "text-align:left", "aria-live": "polite" });
  const kontoZeilen = LS.spielerListe().map(n => {
    const p = LS.profil(n);
    const pin = el("input", { class: "feld", type: "password", inputmode: "numeric", maxlength: "6", placeholder: "neue PIN", "aria-label": `Neue PIN für ${n}`, style: "width:120px;font-size:16px" });
    const ich = n === LS.aktuellerSpieler();
    return el("tr", {},
      el("td", {}, el("b", { text: LS.spielerName(n) }), p.klasse ? el("span", { class: "leise-text", text: ` · ${p.klasse}. Klasse` }) : null),
      el("td", { text: p.rolle === "aufsicht" ? (p.pin ? "Aufsicht" : "Aufsicht (ohne PIN)") : "Kind" }),
      el("td", {}, el("div", { class: "zeile-knoepfe" },
        p.rolle === "aufsicht" ? el("span", { class: "zeile-knoepfe" }, pin,
          el("button", { type: "button", class: "schalter", text: "PIN setzen", onclick: async () => {
            meldung.textContent = (await LS.setzePin(n, pin.value)) ? `✓ PIN für ${n} gesetzt.` : "Die PIN hat 4 bis 6 Ziffern.";
          } })) : null,
        ich ? null : el("button", { type: "button", class: "schalter", text: p.rolle === "aufsicht" ? "→ Kind" : "→ Aufsicht", onclick: () => {
          LS.speichereProfil(n, p.rolle === "aufsicht" ? { rolle: "kind", pin: null } : { rolle: "aufsicht" });
          neu();
        } }),
        ich ? null : el("button", { type: "button", class: "schalter gesperrt", text: "🗑 löschen", onclick: () => {
          if (confirm(`${n} mit Profil und allen Runden löschen? Vorher in der Statistik sichern.`)) { LS.loescheSpieler(n); neu(); }
        } }))));
  });
  const neuName = el("input", { class: "feld", type: "text", maxlength: "20", placeholder: "Name", "aria-label": "Name des neuen Kindes" });
  const neuKlasse = el("select", { "aria-label": "Klasse" }, el("option", { value: "", text: "Klasse —" }),
    ...[1, 2, 3, 4, 5, 6].map(k => el("option", { value: String(k), text: `${k}. Klasse` })));
  const anlegen = () => {
    const n = LS.neuerSpieler(neuName.value, { klasse: neuKlasse.value ? Number(neuKlasse.value) : null });
    if (!n) return (meldung.textContent = "Bitte einen neuen, noch nicht vergebenen Namen eingeben.");
    neu();
  };
  seite.append(karte(
    el("h2", { text: "Konten" }),
    el("p", { class: "leise-text", style: "margin-top:0", text: "Kinder melden sich ohne PIN an. Die Aufsicht braucht ihre PIN, sieht alle Spiele und Statistiken und spielt als Tester (Runden zählen nicht in der Statistik, im Spiel gibt es Testhilfen). Eine neue Aufsicht: als Kind anlegen, „→ Aufsicht“ und PIN setzen." }),
    el("div", { class: "tabelle-rahmen" }, el("table", {},
      el("thead", {}, el("tr", {}, ...["Name", "Rolle", ""].map(t => el("th", { text: t })))),
      el("tbody", {}, ...kontoZeilen))),
    el("h3", { text: "Neues Kind" }),
    el("div", { class: "pin-zeile", style: "justify-content:flex-start" }, neuName, neuKlasse, knopf("＋ Anlegen", anlegen, "gruen")),
    meldung));

  // ----- Abgleich zwischen Geräten (Entscheid S1 a) -----
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
    catch { abMeldung.textContent = "Diese Datei kann ich nicht lesen."; }
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
