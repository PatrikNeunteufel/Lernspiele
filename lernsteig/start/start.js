/* Startseite des Lernsteigs: zuerst die Anmeldung (Plan C1: Jugendliche, Aufsicht, „Ich bin neu“, Gast C2 a), dann
   Konto (AU1 a, KT1 a, GE1 b, EL1 a), Einstellungen, Übungen je Fach mit Kompetenzstand (BF1 a). */
"use strict";

(function () {
  const LP = LST_LEHRPLAENE;
  const KAT = LST_KATALOG;
  const KO = LST_KONTEN;
  const el = LST.el;
  const wurzel = document.getElementById("start");
  const KLASSEN = KO.KLASSEN;
  let ansicht = { art: "start" }; // start | neu-wer | neu | neu-aufsicht | pin | vergessen | code | profil
  let einladung = KO.einladungLesen(location.hash);
  if (einladung) { history.replaceState(null, "", location.pathname + location.search); ansicht = { art: "neu", vorlage: einladung }; }

  function auswahl(titel, werte, aktuell, beiWahl, hilfe) {
    const s = el("select", { "aria-label": titel, onchange: e => beiWahl(e.target.value) },
      werte.map(w => el("option", { value: w.id, text: w.name, selected: w.id === aktuell })));
    return el("label", { class: "einstellung" }, el("span", { text: titel }), s, hilfe ? el("small", { class: "leise", text: hilfe }) : null);
  }
  const feld = (titel, attr, hilfe) => el("label", { class: "einstellung" }, el("span", { text: titel }), el("input", Object.assign({ class: "textfeld" }, attr)), hilfe ? el("small", { class: "leise", text: hilfe }) : null);
  /** Kinder anhängen ohne null, undefined und false (das eingebaute append schriebe sie als Text „null“). */
  const dazu = (knoten, ...kinder) => { knoten.append(...kinder.filter(k => k !== null && k !== undefined && k !== false)); return knoten; };
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
      `${a.name} (${rolle(a.art)}) `, el("button", { type: "button", class: "knopf klein", text: "Lösen", onclick: () => { KO.loesen(k.id, a.id); zeichne(); } })))));
    for (const a of m.anfragen) teil.append(el("div", { class: "anfrage", "data-anfrage": a.id },
      el("p", { text: `${a.name} (${rolle(a.art)}) möchte deinen Stand sehen: Runden und Kompetenzstand, keine PIN.` }),
      el("div", { class: "knopf-zeile" },
        k.pin ? el("button", { type: "button", class: "knopf haupt", text: "Zulassen", "data-aktion": "zulassen", onclick: () => { KO.antworten(k.id, a.id, true); zeichne(); } })
          : el("button", { type: "button", class: "knopf", text: "Erst PIN festlegen", onclick: () => { ansicht = { art: "profil" }; zeichne(); } }),
        el("button", { type: "button", class: "knopf", text: "Ablehnen", onclick: () => { KO.antworten(k.id, a.id, false); zeichne(); } })),
      k.pin ? null : el("small", { class: "leise", text: "Zustimmen geht nur mit PIN, damit niemand sonst für dich zustimmt." })));
    // Alle Aufsichten des Geräts (EF1 a): Eine Aufsicht legt man ohne Frage an — wer sie angelegt hat, sieht man hier.
    const alle = KO.aufsichten();
    if (alle.length) teil.append(el("details", { class: "aufsichten-geraet" },
      el("summary", { text: `Aufsichten auf diesem Gerät (${alle.length})` }),
      el("ul", { class: "mitleser-liste" }, alle.map(a => el("li", { "data-geraet-aufsicht": a.id, text: [`${a.name} (${rolle(a.art)})`,
        /^\d{4}-\d{2}-\d{2}/.test(a.angelegt || "") ? `angelegt am ${a.angelegt.slice(0, 10).split("-").reverse().join(".")}` : "",
        m.verbunden.some(v => v.id === a.id) ? "liest bei dir mit" : "liest bei dir nicht mit"].filter(Boolean).join(" · ") }))),
      el("small", { class: "leise", text: "Eine Aufsicht kann den Taschenrechner und den Gast auf diesem Gerät einstellen. Deinen Stand sieht sie nur, wenn du zustimmst. Kennst du eine nicht, sag es deinen Eltern oder deiner Lehrperson." })));
    return teil;
  }

  // ---------- Anmeldung zuerst (Plan C1, wie Eulenpfad L1 a) ----------
  // Ein Platz für alle (konten.js): Jugendliche und Aufsichten zum Antippen, „Ich bin neu“ (Jugendliche oder
  // Erwachsene), „Als Gast weiter“ (C2 a, wenn die Aufsicht ihn auf dem Gerät nicht abgeschaltet hat).
  const rolleName = id => (KO.ROLLEN.find(r => r.id === id) || {}).name || "";
  const zurueck = () => el("button", { type: "button", class: "knopf", text: "Zurück", onclick: () => { ansicht = { art: "start" }; zeichne(); } });

  function anmeldung(karte) {
    const konten = KO.alle(), aufsichten = KO.aufsichten();
    dazu(karte,el("h3", { text: konten.length || aufsichten.length ? "Wer übt?" : "Willkommen im Lernsteig" }),
      el("p", { class: "leise", text: konten.length || aufsichten.length
        ? "Tippe auf deinen Namen. Mit 🔒 fragt der Lernsteig nach der PIN."
        : "Lege ein Konto an, damit der Lernsteig deinen Stand kennt. Oder übe als Gast: Dann wird nichts gespeichert." }));
    if (konten.length) dazu(karte,el("div", { class: "konto-liste" }, konten.map(k => el("button", { type: "button", class: "knopf konto-knopf", "data-konto": k.id,
      text: k.pin ? `${k.name} \u{1F512}` : k.name, "aria-label": k.pin ? `${k.name}, mit PIN` : k.name,
      onclick: async () => { if (k.pin) { ansicht = { art: "pin", id: k.id }; zeichne(); } else { await KO.anmelden(k.id); ansicht = { art: "start" }; zeichne(); } } }))));
    if (aufsichten.length) dazu(karte,el("p", { class: "leise", text: "Aufsicht (Eltern, Lehrpersonen):" }),
      el("div", { class: "konto-liste" }, aufsichten.map(a => el("button", { type: "button", class: "knopf konto-knopf", "data-aufsicht": a.id,
        text: `\u{1F511} ${a.name}`, "aria-label": `${a.name}, Aufsicht, mit PIN`, onclick: () => { ansicht = { art: "pin", id: a.id }; zeichne(); } }))));
    dazu(karte,el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "\u{1F423} Ich bin neu", "data-aktion": "neu", onclick: () => { ansicht = { art: "neu-wer" }; zeichne(); } }),
      KO.gastErlaubt() ? el("button", { type: "button", class: "knopf", text: "\u{1F440} Als Gast weiter", "data-aktion": "gast",
        onclick: () => { KO.alsGast(); ansicht = { art: "start" }; zeichne(); } }) : null),
      KO.gastErlaubt() ? el("small", { class: "leise", text: "Als Gast wird nichts gespeichert: keine Runden, kein Stand. Die Einstellungen gelten, bis du den Tab schliesst." }) : null);
    return karte;
  }

  function neuWer(karte) {
    dazu(karte,el("h3", { text: "Ich bin neu" }), el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Ich übe (Jugendliche)", "data-aktion": "neu-jugend", onclick: () => { ansicht = { art: "neu" }; zeichne(); } }),
      el("button", { type: "button", class: "knopf", text: "\u{1F511} Ich bin erwachsen (Aufsicht)", "data-aktion": "neu-aufsicht", onclick: () => { ansicht = { art: "neu-aufsicht" }; zeichne(); } }),
      zurueck()),
      el("small", { class: "leise", text: "Eine Aufsicht (Eltern, Lehrperson) sieht den Stand verbundener Konten und stellt das Gerät ein. Verbunden wird ein Konto nur mit Zustimmung des Jugendlichen." }));
    return karte;
  }

  function neuAufsicht(karte) {
    const name = feld("Name", { type: "text", maxlength: "40", name: "name", autocomplete: "name" }, "So sehen die Jugendlichen, wer mitliest.");
    const rolle = auswahl("Rolle", KO.ROLLEN, "eltern", () => {});
    rolle.querySelector("select").name = "rolle";
    const pin = feld("PIN (4–6 Ziffern)", { type: "password", inputmode: "numeric", maxlength: "6", name: "pin", autocomplete: "new-password" }, "Pflicht für die Aufsicht.");
    // Gibt es schon eine Aufsicht, bestätigt eine von ihnen mit ihrer PIN (wie Eulenpfad KR2 a; Befund D5).
    const bestehende = KO.aufsichten();
    const wer = bestehende.length ? auswahl("Bestätigt von", bestehende.map(a => ({ id: a.id, name: a.name })), bestehende[0].id, () => {}) : null;
    if (wer) wer.querySelector("select").name = "bestaetigt-von";
    const werPin = bestehende.length ? feld("Deren PIN", { type: "password", inputmode: "numeric", maxlength: "6", name: "bestaetigung-pin", autocomplete: "off" }, "Eine Aufsicht dieses Geräts bestätigt die neue.") : null;
    const wert = (knoten, sel) => knoten.querySelector(sel).value.trim();
    dazu(karte,el("h3", { text: "Neue Aufsicht" }), name, rolle, pin, wer, werPin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Aufsicht anlegen", "data-aktion": "anlegen", onclick: async () => {
        try {
          const bestaetigung = wer ? { id: wert(wer, "select"), pin: wert(werPin, "input") } : null;
          const r = await KO.aufsichtAnlegen({ name: wert(name, "input"), art: wert(rolle, "select"), pin: wert(pin, "input"), bestaetigung });
          ansicht = { art: "code", code: r.code, aufsicht: true }; zeichne();
        } catch (e) { zeigeFehler(e.message); }
      } }), zurueck()));
    return karte;
  }

  /** Die angemeldete Person: Jugendlicher, Aufsicht oder Gast. */
  function kontoKarte() {
    const karte = el("section", { class: "einstellungen konto" });
    zeigeFehler("");
    if (ansicht.art === "code") return codeAnzeige(karte);
    const wer = LST.werUebt();
    if (wer === "gast") {
      dazu(karte,el("p", { class: "konto-zeile" }, el("b", { text: "Gast" }), el("span", { class: "leise", text: "nichts wird gespeichert" })),
        el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf", text: "Anmelden", "data-aktion": "abmelden",
          onclick: () => { KO.abmelden(); ansicht = { art: "start" }; zeichne(); } })));
      return karte;
    }
    if (wer === "aufsicht") {
      const a = KO.aufsichtAktiv();
      dazu(karte,el("p", { class: "konto-zeile" }, el("b", { text: `\u{1F511} ${a.name}` }), el("span", { class: "leise", text: `Aufsicht · ${rolleName(a.art)}` })),
        el("p", { class: "leise", text: "Du siehst alle Übungen, auch gesperrte zum Prüfen. Deine Runden zählen als Test." }),
        el("div", { class: "knopf-zeile" },
          el("a", { class: "knopf haupt", href: "aufsicht.html", text: "Zur Aufsicht" }),
          el("button", { type: "button", class: "knopf", text: "Abmelden", "data-aktion": "abmelden", onclick: () => { KO.abmelden(); ansicht = { art: "start" }; zeichne(); } })));
      return karte;
    }
    const aktiv = KO.aktiv();
    if (ansicht.art === "profil") return profilForm(karte, aktiv);
    const alter = KO.alter(aktiv.geboren);
    // null herausfiltern: das eingebaute append schreibt es sonst als Text „null“ (ohne Wochenziel)
    dazu(karte,...[el("p", { class: "konto-zeile" }, el("b", { text: aktiv.name }),
      el("span", { class: "leise", text: [alter !== null ? `${alter} Jahre` : "", aktiv.klasse ? (KLASSEN.find(k => k.id === String(aktiv.klasse)) || {}).name : "", aktiv.pin ? "mit PIN" : "ohne PIN"].filter(Boolean).join(" · ") })),
      el("div", { class: "knopf-zeile" },
        el("button", { type: "button", class: "knopf", text: "Profil", onclick: () => { ansicht = { art: "profil" }; zeichne(); } }),
        el("button", { type: "button", class: "knopf", text: "Abmelden", "data-aktion": "abmelden", onclick: () => { KO.abmelden(); ansicht = { art: "start" }; zeichne(); } })),
      LST.serie(aktiv) ? el("p", { class: "serie", text: "Wochenziel: " + LST.serieText(LST.serie(aktiv)) }) : null,
      mitleserTeil(aktiv)].filter(Boolean));
    return karte;
  }

  function neuForm(karte) {
    const v = ansicht.vorlage || {};
    const gast = LST.konto(); // Einstellungen des Gasts übernehmen
    const name = feld("Vorname", { type: "text", maxlength: "40", autocomplete: "given-name", value: v.name || "", name: "vorname" });
    // Eine Einladung aus dem Eulenpfad kann nur den Geburtsmonat tragen („JJJJ-MM“, B3): Das Datumsfeld zeigt ihn nicht,
    // darum steht er als Hinweis da und bleibt, wenn der Tag leer bleibt.
    const nurMonat = KERN.person.tagFehlt(v.geboren || "") ? v.geboren : null;
    const geboren = feld("Geburtsdatum", { type: "date", value: nurMonat ? "" : v.geboren || "", name: "geboren", max: new Date().toISOString().slice(0, 10) },
      nurMonat ? `Aus der Einladung: ${KERN.person.geburtsdatumText(nurMonat)}. Trag den Tag ein, wenn du willst.` : "Damit dein Alter stimmt. Bleibt auf diesem Gerät.");
    const klasse = auswahl("Klasse", KLASSEN, String(v.klasse || "7"), () => {});
    const pin = feld("PIN (freiwillig, 4–6 Ziffern)", { type: "password", inputmode: "numeric", autocomplete: "new-password", maxlength: "6", name: "pin" }, "Mit PIN kann niemand sonst auf diesem Gerät dein Konto öffnen.");
    // Einladung als Datei (EL1 a): „lernsteig-einladung.json“ aus dem Eulenpfad füllt das Formular vor.
    const datei = el("input", { type: "file", accept: "application/json,.json", hidden: true, "aria-label": "Einladung wählen", onchange: async e => {
      const f = e.target.files[0]; if (!f) return;
      let gelesen = null;
      try { gelesen = KO.einladungLesen(JSON.parse(await f.text())); } catch (err) { gelesen = null; }
      if (!gelesen) { zeigeFehler("Das ist keine Einladung zum Lernsteig."); return; }
      ansicht = { art: "neu", vorlage: gelesen }; zeichne();
    } });
    dazu(karte,el("h3", { text: v.name ? "Einladung zum Lernsteig" : "Neues Konto" }),
      v.name ? el("p", { class: "leise", text: "Die Angaben aus der Einladung sind schon eingetragen. Prüfe sie und lege eine PIN fest, wenn du willst." })
        : el("p", { class: "leise" }, "Hast du eine Einladung als Datei bekommen? ",
          el("button", { type: "button", class: "knopf klein", "data-aktion": "einladung-datei", text: "📨 Einladung öffnen", onclick: () => datei.click() }), datei),
      name, geboren, klasse, pin, fehlerText,
      el("div", { class: "knopf-zeile" },
        el("button", { type: "button", class: "knopf haupt", text: "Konto anlegen", "data-aktion": "anlegen", onclick: async () => {
          try {
            const p = pin.querySelector("input").value.trim();
            const r = await KO.anlegen({ name: name.querySelector("input").value, geboren: geboren.querySelector("input").value || nurMonat || null,
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
    const aufsicht = KO.aufsichtFinde(ansicht.id);
    const k = aufsicht || KO.finde(ansicht.id);
    const pin = feld(`PIN für ${k.name}`, { type: "password", inputmode: "numeric", autocomplete: "current-password", maxlength: "6", name: "pin" });
    const anmelden = (id, p) => (aufsicht ? KO.aufsichtAnmelden(id, p) : KO.anmelden(id, p));
    const los = async () => { try { await anmelden(k.id, pin.querySelector("input").value); ansicht = { art: "start" }; zeichne(); } catch (e) { zeigeFehler(e.message); } };
    pin.querySelector("input").addEventListener("keydown", e => { if (e.key === "Enter") los(); });
    dazu(karte,pin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Anmelden", "data-aktion": "anmelden", onclick: los }),
      el("button", { type: "button", class: "knopf", text: "PIN vergessen?", onclick: () => { ansicht = { art: "vergessen", id: k.id }; zeichne(); } }),
      el("button", { type: "button", class: "knopf", text: "Zurück", onclick: () => { ansicht = { art: "start" }; zeichne(); } })));
    setTimeout(() => pin.querySelector("input").focus(), 0);
    return karte;
  }

  function vergessenForm(karte) {
    const aufsicht = KO.aufsichtFinde(ansicht.id);
    const k = aufsicht || KO.finde(ansicht.id);
    const code = feld("Wiederherstellungscode", { type: "text", autocomplete: "off", maxlength: "14", name: "code", placeholder: "XXXX-XXXX-XXXX" }, "Den Code hast du beim Anlegen der PIN bekommen.");
    const pin = feld("Neue PIN (4–6 Ziffern)", { type: "password", inputmode: "numeric", maxlength: "6", name: "neuepin" });
    dazu(karte,el("h3", { text: `PIN vergessen: ${k.name}` }), code, pin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Neue PIN setzen", "data-aktion": "zuruecksetzen", onclick: async () => {
        try {
          const neuePin = pin.querySelector("input").value.trim();
          const neu = await (aufsicht ? KO.aufsichtNeuePinMitCode : KO.neuePinMitCode)(k.id, code.querySelector("input").value, neuePin);
          await (aufsicht ? KO.aufsichtAnmelden : KO.anmelden)(k.id, neuePin);
          ansicht = { art: "code", code: neu, aufsicht: !!aufsicht }; zeichne();
        } catch (e) { zeigeFehler(e.message); }
      } }),
      el("button", { type: "button", class: "knopf", text: "Zurück", onclick: () => { ansicht = { art: "start" }; zeichne(); } })),
      el("small", { class: "leise", text: "Ohne Code lässt sich die PIN nicht zurücksetzen. Später kann das eine Aufsicht tun." }));
    return karte;
  }

  function codeAnzeige(karte) {
    dazu(karte,el("h3", { text: ansicht.aufsicht ? "Wiederherstellungscode der Aufsicht" : "Dein Wiederherstellungscode" }),
      el("p", { class: "code-anzeige", text: ansicht.code, "data-code": ansicht.code }),
      el("p", { text: ansicht.aufsicht ? "Aufschreiben und gut aufbewahren. Damit setzen Sie eine neue PIN, falls Sie sie vergessen. Er wird nur jetzt angezeigt."
        : "Schreib ihn auf und bewahre ihn gut auf. Damit setzt du eine neue PIN, falls du sie vergisst. Er wird nur jetzt angezeigt." }),
      el("button", { type: "button", class: "knopf haupt", text: "Aufgeschrieben", onclick: () => { ansicht = { art: "start" }; zeichne(); } }));
    return karte;
  }

  function profilForm(karte, k) {
    const geboren = feld("Geburtsdatum", { type: "date", value: k.geboren || "", name: "geboren" });
    const klasse = auswahl("Klasse", KLASSEN, String(k.klasse || "7"), () => {});
    const pin = feld(k.pin ? "Neue PIN (leer lassen: unverändert)" : "PIN festlegen (freiwillig)", { type: "password", inputmode: "numeric", maxlength: "6", name: "pin" });
    dazu(karte,el("h3", { text: `Profil: ${k.name}` }), geboren, klasse, pin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Speichern", onclick: async () => {
        try {
          KO.aendern({ id: k.id, geboren: geboren.querySelector("input").value || null, klasse: Number(klasse.querySelector("select").value) });
          const p = pin.querySelector("input").value.trim();
          if (p) { const code = await KO.setzePin(k.id, p); await KO.anmelden(k.id, p); ansicht = { art: "code", code }; }
          else ansicht = { art: "start" };
          zeichne();
        } catch (e) { zeigeFehler(e.message); }
      } }),
      k.pin ? el("button", { type: "button", class: "knopf", text: "PIN entfernen", onclick: async () => { await KO.setzePin(k.id, null); await KO.anmelden(k.id); ansicht = { art: "start" }; zeichne(); } }) : null,
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
  /** Ohne Person und ohne Gast: nur die Anmeldung und ihre Schritte. */
  function zeichneAnmeldung() {
    const karte = el("section", { class: "einstellungen konto anmeldung" });
    zeigeFehler("");
    const f = { "neu-wer": neuWer, neu: neuForm, "neu-aufsicht": neuAufsicht, pin: pinForm, vergessen: vergessenForm, code: codeAnzeige }[ansicht.art] || anmeldung;
    wurzel.replaceChildren(f(karte),
      el("p", { class: "fuss", text: "Alles bleibt im Browser auf diesem Gerät. Keine Anmeldung bei einem Server, keine Werbung." }));
  }

  function zeichne() {
    if (LST.werUebt() === "niemand" || ["neu-wer", "neu", "neu-aufsicht", "pin", "vergessen"].includes(ansicht.art)) return zeichneAnmeldung();
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
        dazu(karte,el("div", { class: "niveau-wahl", role: "group", "aria-label": `Niveau ${f.name}` },
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
          dazu(karte,el("h4", { class: "thema", text: th }),
            el("ul", { class: "uebungen" }, uebungen.filter(u => u.thema === th).map(u => el("li", {}, eintrag(u)))));
        }
      } else {
        dazu(karte,el("small", { class: "leise", text: "später" }));
      }
      faecher.append(karte);
    }

    // null herausfiltern: das eingebaute replaceChildren schreibt es sonst als Text „null“
    wurzel.replaceChildren(...[
      el("h2", { class: "abschnitt", text: "Konto" }), kontoKarte(),
      el("h2", { class: "abschnitt", text: "Einstellungen" }), einstellungen,
      el("h2", { class: "abschnitt", text: "Fächer" }), faecher,
      LST.werUebt() === "lernend" ? el("p", { class: "knopf-zeile" }, el("a", { class: "knopf", href: "statistik.html", text: "Mein Stand: Statistik, Sichern und Einlesen" })) : null,
      el("p", { class: "fuss", text: "Alles bleibt im Browser auf diesem Gerät. Keine Anmeldung bei einem Server, keine Werbung." })].filter(Boolean));
  }

  zeichne();
})();
