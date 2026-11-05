/* Startseite des Lernsteigs: Konto (AU1 a, KT1 a, GE1 b, EL1 a), Einstellungen, Übungen je Fach mit Kompetenzstand
   (BF1 a). Ohne Konto gilt alles für das Gastkonto dieses Geräts. */
"use strict";

(function () {
  const LP = LST_LEHRPLAENE;
  const KAT = LST_KATALOG;
  const KO = LST_KONTEN;
  const el = LST.el;
  const wurzel = document.getElementById("start");
  const KLASSEN = KO.KLASSEN;
  let ansicht = { art: "start" }; // start | neu | pin | vergessen | code | profil
  let einladung = KO.einladungLesen(location.hash);
  if (einladung) { history.replaceState(null, "", location.pathname + location.search); ansicht = { art: "neu", vorlage: einladung }; }

  function auswahl(titel, werte, aktuell, beiWahl, hilfe) {
    const s = el("select", { "aria-label": titel, onchange: e => beiWahl(e.target.value) },
      werte.map(w => el("option", { value: w.id, text: w.name, selected: w.id === aktuell })));
    return el("label", { class: "einstellung" }, el("span", { text: titel }), s, hilfe ? el("small", { class: "leise", text: hilfe }) : null);
  }
  const feld = (titel, attr, hilfe) => el("label", { class: "einstellung" }, el("span", { text: titel }), el("input", Object.assign({ class: "textfeld" }, attr)), hilfe ? el("small", { class: "leise", text: hilfe }) : null);
  const fehlerText = el("p", { class: "fehlertext", role: "alert" });
  const zeigeFehler = t => { fehlerText.textContent = t || ""; };

  // ---------- Konto ----------
  // Wer mitliest (AU1 a): sichtbar für den Jugendlichen, Anfragen annehmen oder ablehnen, Verbindung lösen (AF1 a)
  function mitleserTeil(k) {
    const m = KO.mitleser(k.id);
    const rolle = id => (KO.ROLLEN.find(r => r.id === id) || {}).name;
    const teil = el("div", { class: "mitleser" });
    if (!m.verbunden.length) teil.append(el("small", { class: "leise", text: "Deine Runden und Einstellungen gehören zu diesem Konto. Niemand sonst liest mit." }));
    else teil.append(el("p", { text: "Es lesen mit:" }), el("ul", { class: "mitleser-liste" }, m.verbunden.map(a => el("li", { "data-mitleser": a.id },
      `${a.name} (${rolle(a.rolle)}) `, el("button", { type: "button", class: "knopf klein", text: "Lösen", onclick: () => { KO.loesen(k.id, a.id); zeichne(); } })))));
    for (const a of m.anfragen) teil.append(el("div", { class: "anfrage", "data-anfrage": a.id },
      el("p", { text: `${a.name} (${rolle(a.rolle)}) möchte deinen Stand sehen: Runden und Kompetenzstand, keine PIN.` }),
      el("div", { class: "knopf-zeile" },
        k.pin ? el("button", { type: "button", class: "knopf haupt", text: "Zulassen", "data-aktion": "zulassen", onclick: () => { KO.antworten(k.id, a.id, true); zeichne(); } })
          : el("button", { type: "button", class: "knopf", text: "Erst PIN festlegen", onclick: () => { ansicht = { art: "profil" }; zeichne(); } }),
        el("button", { type: "button", class: "knopf", text: "Ablehnen", onclick: () => { KO.antworten(k.id, a.id, false); zeichne(); } })),
      k.pin ? null : el("small", { class: "leise", text: "Zustimmen geht nur mit PIN, damit niemand sonst für dich zustimmt." })));
    return teil;
  }

  function kontoKarte() {
    const aktiv = KO.aktiv();
    const karte = el("section", { class: "einstellungen konto" });
    zeigeFehler("");
    if (ansicht.art === "neu") return neuForm(karte);
    if (ansicht.art === "pin") return pinForm(karte);
    if (ansicht.art === "vergessen") return vergessenForm(karte);
    if (ansicht.art === "code") return codeAnzeige(karte);
    if (aktiv && ansicht.art === "profil") return profilForm(karte, aktiv);
    if (aktiv) {
      const alter = KO.alter(aktiv.geboren);
      karte.append(el("p", { class: "konto-zeile" }, el("b", { text: aktiv.name }),
        el("span", { class: "leise", text: [alter !== null ? `${alter} Jahre` : "", aktiv.klasse ? (KLASSEN.find(k => k.id === String(aktiv.klasse)) || {}).name : "", aktiv.pin ? "mit PIN" : "ohne PIN"].filter(Boolean).join(" · ") })),
        el("div", { class: "knopf-zeile" },
          el("button", { type: "button", class: "knopf", text: "Profil", onclick: () => { ansicht = { art: "profil" }; zeichne(); } }),
          el("button", { type: "button", class: "knopf", text: "Abmelden", onclick: () => { KO.abmelden(); ansicht = { art: "start" }; zeichne(); } })),
        LST.serie(aktiv) ? el("p", { class: "serie", text: "Wochenziel: " + LST.serieText(LST.serie(aktiv)) }) : null,
        mitleserTeil(aktiv));
      return karte;
    }
    const konten = KO.alle();
    karte.append(el("p", { text: konten.length ? "Wer übt?" : "Lege ein Konto an, damit der Lernsteig deinen Stand kennt. Oder übe als Gast." }));
    if (konten.length) karte.append(el("div", { class: "konto-liste" }, konten.map(k => el("button", { type: "button", class: "knopf konto-knopf", "data-konto": k.id,
      text: k.pin ? `${k.name} \u{1F512}` : k.name, "aria-label": k.pin ? `${k.name}, mit PIN` : k.name,
      onclick: async () => { if (k.pin) { ansicht = { art: "pin", id: k.id }; zeichne(); } else { await KO.anmelden(k.id); zeichne(); } } }))));
    karte.append(el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Neues Konto", onclick: () => { ansicht = { art: "neu" }; zeichne(); } }),
      el("span", { class: "leise", text: "Jetzt: als Gast" })));
    return karte;
  }

  function neuForm(karte) {
    const v = ansicht.vorlage || {};
    const gast = LST.konto(); // Einstellungen des Gasts übernehmen
    const name = feld("Vorname", { type: "text", maxlength: "40", autocomplete: "given-name", value: v.name || "", name: "vorname" });
    const geboren = feld("Geburtsdatum", { type: "date", value: v.geboren || "", name: "geboren", max: new Date().toISOString().slice(0, 10) }, "Damit dein Alter stimmt. Bleibt auf diesem Gerät.");
    const klasse = auswahl("Klasse", KLASSEN, String(v.klasse || "7"), () => {});
    const pin = feld("PIN (freiwillig, 4–6 Ziffern)", { type: "password", inputmode: "numeric", autocomplete: "new-password", maxlength: "6", name: "pin" }, "Mit PIN kann niemand sonst auf diesem Gerät dein Konto öffnen.");
    karte.append(el("h3", { text: v.name ? "Einladung zum Lernsteig" : "Neues Konto" }),
      v.name ? el("p", { class: "leise", text: "Die Angaben aus der Einladung sind schon eingetragen. Prüfe sie und lege eine PIN fest, wenn du willst." }) : null,
      name, geboren, klasse, pin, fehlerText,
      el("div", { class: "knopf-zeile" },
        el("button", { type: "button", class: "knopf haupt", text: "Konto anlegen", "data-aktion": "anlegen", onclick: async () => {
          try {
            const p = pin.querySelector("input").value.trim();
            const r = await KO.anlegen({ name: name.querySelector("input").value, geboren: geboren.querySelector("input").value || null,
              klasse: Number(klasse.querySelector("select").value), pin: p || null,
              lehrplan: v.lehrplan || gast.lehrplan, niveau: Object.assign({}, gast.niveau, v.niveau || {}), pruefungsziel: gast.pruefungsziel, rechnerModell: gast.rechnerModell });
            await KO.anmelden(r.konto.id, p || undefined);
            ansicht = r.code ? { art: "code", code: r.code } : { art: "start" };
            zeichne();
          } catch (e) { zeigeFehler(e.message); }
        } }),
        el("button", { type: "button", class: "knopf", text: "Abbrechen", onclick: () => { ansicht = { art: "start" }; zeichne(); } })));
    return karte;
  }

  function pinForm(karte) {
    const k = KO.finde(ansicht.id);
    const pin = feld(`PIN für ${k.name}`, { type: "password", inputmode: "numeric", autocomplete: "current-password", maxlength: "6", name: "pin" });
    const los = async () => { try { await KO.anmelden(k.id, pin.querySelector("input").value); ansicht = { art: "start" }; zeichne(); } catch (e) { zeigeFehler(e.message); } };
    pin.querySelector("input").addEventListener("keydown", e => { if (e.key === "Enter") los(); });
    karte.append(pin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Anmelden", "data-aktion": "anmelden", onclick: los }),
      el("button", { type: "button", class: "knopf", text: "PIN vergessen?", onclick: () => { ansicht = { art: "vergessen", id: k.id }; zeichne(); } }),
      el("button", { type: "button", class: "knopf", text: "Zurück", onclick: () => { ansicht = { art: "start" }; zeichne(); } })));
    setTimeout(() => pin.querySelector("input").focus(), 0);
    return karte;
  }

  function vergessenForm(karte) {
    const k = KO.finde(ansicht.id);
    const code = feld("Wiederherstellungscode", { type: "text", autocomplete: "off", maxlength: "14", name: "code", placeholder: "XXXX-XXXX-XXXX" }, "Den Code hast du beim Anlegen der PIN bekommen.");
    const pin = feld("Neue PIN (4–6 Ziffern)", { type: "password", inputmode: "numeric", maxlength: "6", name: "neuepin" });
    karte.append(el("h3", { text: `PIN vergessen: ${k.name}` }), code, pin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Neue PIN setzen", "data-aktion": "zuruecksetzen", onclick: async () => {
        try {
          const neu = await KO.neuePinMitCode(k.id, code.querySelector("input").value, pin.querySelector("input").value.trim());
          await KO.anmelden(k.id, pin.querySelector("input").value.trim());
          ansicht = { art: "code", code: neu }; zeichne();
        } catch (e) { zeigeFehler(e.message); }
      } }),
      el("button", { type: "button", class: "knopf", text: "Zurück", onclick: () => { ansicht = { art: "start" }; zeichne(); } })),
      el("small", { class: "leise", text: "Ohne Code lässt sich die PIN nicht zurücksetzen. Später kann das eine Aufsicht tun." }));
    return karte;
  }

  function codeAnzeige(karte) {
    karte.append(el("h3", { text: "Dein Wiederherstellungscode" }),
      el("p", { class: "code-anzeige", text: ansicht.code, "data-code": ansicht.code }),
      el("p", { text: "Schreib ihn auf und bewahre ihn gut auf. Damit setzt du eine neue PIN, falls du sie vergisst. Er wird nur jetzt angezeigt." }),
      el("button", { type: "button", class: "knopf haupt", text: "Aufgeschrieben", onclick: () => { ansicht = { art: "start" }; zeichne(); } }));
    return karte;
  }

  function profilForm(karte, k) {
    const geboren = feld("Geburtsdatum", { type: "date", value: k.geboren || "", name: "geboren" });
    const klasse = auswahl("Klasse", KLASSEN, String(k.klasse || "7"), () => {});
    const pin = feld(k.pin ? "Neue PIN (leer lassen: unverändert)" : "PIN festlegen (freiwillig)", { type: "password", inputmode: "numeric", maxlength: "6", name: "pin" });
    karte.append(el("h3", { text: `Profil: ${k.name}` }), geboren, klasse, pin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Speichern", onclick: async () => {
        try {
          KO.aendern({ id: k.id, geboren: geboren.querySelector("input").value || null, klasse: Number(klasse.querySelector("select").value) });
          const p = pin.querySelector("input").value.trim();
          if (p) { const code = await KO.setzePin(k.id, p); await KO.anmelden(k.id, p); ansicht = { art: "code", code }; }
          else ansicht = { art: "start" };
          zeichne();
        } catch (e) { zeigeFehler(e.message); }
      } }),
      k.pin ? el("button", { type: "button", class: "knopf", text: "PIN entfernen", onclick: async () => { await KO.setzePin(k.id, null); LST.schreibe("aktiv", k.id); ansicht = { art: "start" }; zeichne(); } }) : null,
      el("button", { type: "button", class: "knopf", text: "Abbrechen", onclick: () => { ansicht = { art: "start" }; zeichne(); } })));
    return karte;
  }

  // Einstellung der Aufsicht für das Gerät (TR1 a), sichtbar für alle
  function geraetHinweis() {
    const r = LST.lies("einstellungen", {}).rechner;
    const t = { ohne: "Die Aufsicht hat den Taschenrechner auf diesem Gerät überall gesperrt.", erlaubt: "Die Aufsicht hat den Taschenrechner auf diesem Gerät überall erlaubt." }[r];
    return t ? el("p", { class: "leise", "data-geraet": r, text: t }) : null;
  }

  // ---------- Seite ----------
  function zeichne() {
    const k = LST.konto();
    const lp = k.lehrplan;
    const kantonWerte = [{ id: "", name: "— bitte wählen —" }].concat(LP.KANTONE);
    const ziele = LP.pruefungszieleFuer(lp);
    if (!ziele.some(z => z.id === k.pruefungsziel)) k.pruefungsziel = "keins";
    const aendern = f => { const neu = LST.konto(); f(neu); LST.speichereKonto(neu); zeichne(); };

    const einstellungen = el("div", { class: "einstellungen" },
      auswahl("Land", LP.LAENDER, lp.land, v => aendern(x => { x.lehrplan = { land: v, kanton: v === "CH" ? x.lehrplan.kanton : null }; })),
      lp.land === "CH" ? auswahl("Kanton", kantonWerte, lp.kanton || "", v => aendern(x => { x.lehrplan.kanton = v || null; }),
        lp.kanton && !LP.KANTON[lp.kanton] ? "Für diesen Kanton sind noch keine Prüfungen hinterlegt." : null) : null,
      auswahl("Prüfungsziel", ziele, k.pruefungsziel, v => aendern(x => { x.pruefungsziel = v; }),
        (ziele.find(z => z.id === k.pruefungsziel) || {}).text),
      // Bedienung des eingebauten Rechners wie das eigene Modell (RM1 b, R11)
      auswahl("Mein Taschenrechner", Object.entries(LST_RECHNER.MODELLE).map(([id, m]) => ({ id, name: m.familie === "allgemein" ? "allgemein" : m.name })),
        k.rechnerModell, v => aendern(x => { x.rechnerModell = v; }), "Der eingebaute Rechner bedient sich dann wie dein Modell, mit Tipps dazu."),
      geraetHinweis());

    const faecher = el("div", { class: "faecher" });
    for (const f of KAT.FAECHER) {
      const uebungen = KAT.UEBUNGEN.filter(u => u.fach === f.id);
      const karte = el("section", { class: "fach" + (uebungen.length ? "" : " spaeter"), "aria-label": f.name },
        el("h3", { text: f.name }), el("p", { class: "bereich", text: f.bereich }));
      if (uebungen.length) {
        const niveau = LST.niveauFuer(f.id);
        karte.append(el("div", { class: "niveau-wahl", role: "group", "aria-label": `Niveau ${f.name}` },
          LST.NIVEAUS.map(n => el("button", {
            type: "button", class: "chip" + (n.id === niveau ? " an" : ""), "aria-pressed": String(n.id === niveau),
            text: LST.niveauName(n.id), title: n.kurz, onclick: () => { LST.setzeNiveau(f.id, n.id); zeichne(); },
          }))));
        // nach Themenbereich gegliedert; „wird geprüft“, wenn eine Stufe im gewählten Prüfungsziel vorkommt (NV2 a);
        // Kompetenzstand: wie viele Lehrplan-Stufen sicher sind (BF1 a)
        const geprueft = u => k.pruefungsziel !== "keins" && u.stufen.some(s => LP.geprueft(`${u.kompetenz}.${s}`, k.pruefungsziel, k.lehrplan).geprueft);
        const stand = u => { const st = u.stufen.map(s => LST.kompetenzstand(k.id, u.id, s).stand); const sicher = st.filter(s => s.startsWith("sicher")).length; return st.every(s => s === "offen") ? "" : `${sicher} von ${u.stufen.length} Stufen sicher`; };
        const themen = [...new Set(uebungen.map(u => u.thema))];
        for (const th of themen) {
          // Gesperrt (FG1 a): Jugendliche sehen die Übung ohne Verweis mit „noch nicht freigegeben“, die angemeldete
          // Aufsicht öffnet sie zum Prüfen.
          const inhalt = u => [
            el("b", {}, u.titel, geprueft(u) ? el("span", { class: "marke pruefung", text: "wird geprüft" }) : null,
              LST.sperrGrund(u.id) ? el("span", { class: "marke gesperrt", text: LST.uebungSichtbar(u.id) ? "für Jugendliche gesperrt" : "noch nicht freigegeben" }) : null),
            el("small", { text: [`${u.kompetenz}, Stufen ${u.stufen.join(", ")}`, stand(u)].filter(Boolean).join(" · ") })];
          const eintrag = u => LST.uebungSichtbar(u.id)
            ? el("a", { class: "uebung-link", href: `uebungen/${u.id}/index.html?niveau=${LST.niveauFuer(f.id, u.niveaus)}` }, inhalt(u))
            : el("span", { class: "uebung-link uebung-gesperrt" }, inhalt(u));
          karte.append(el("h4", { class: "thema", text: th }),
            el("ul", { class: "uebungen" }, uebungen.filter(u => u.thema === th).map(u => el("li", {}, eintrag(u)))));
        }
      } else {
        karte.append(el("small", { class: "leise", text: "später" }));
      }
      faecher.append(karte);
    }

    wurzel.replaceChildren(
      el("h2", { class: "abschnitt", text: "Konto" }), kontoKarte(),
      el("h2", { class: "abschnitt", text: "Einstellungen" }), einstellungen,
      el("h2", { class: "abschnitt", text: "Fächer" }), faecher,
      el("p", { class: "knopf-zeile" }, el("a", { class: "knopf", href: "statistik.html", text: "Mein Stand: Statistik, Sichern und Einlesen" }),
        el("a", { class: "knopf", href: "aufsicht.html", text: "Aufsicht (Eltern, Lehrpersonen)" })),
      el("p", { class: "fuss", text: "Alles bleibt im Browser auf diesem Gerät. Keine Anmeldung bei einem Server, keine Werbung." }));
  }

  zeichne();
})();
