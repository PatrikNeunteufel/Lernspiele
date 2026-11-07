/* Startseite des Lernsteigs: zuerst die Anmeldung (Plan C1: Jugendliche, Aufsicht, „Ich bin neu“, Gast C2 a), dann
   eine Seite mit Tabs wie im Eulenpfad (Plan C2): Übungen je Fach mit Kompetenzstand (BF1 a), Profil mit Konto (AU1 a,
   KT1 a, GE1 b, EL1 a) und Einstellungen, Statistik, Erfolge, Verwaltung (nur Aufsicht). */
"use strict";

/** Tab-Inhalte der anderen Dateien (start/statistik.js, start/aufsicht.js) und Neuzeichnen der Seite. */
var LST_START = typeof LST_START === "object" ? LST_START : {};

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

  let meldungNachFrist = false;
  function anmeldung(karte) {
    const konten = KO.alle(), aufsichten = KO.aufsichten();
    // Zurücksetzen mit Frist (RL2 a): für alle sichtbar, abbrechen mit PIN oder Code einer Aufsicht
    const frist = KO.fristStand();
    if (frist) dazu(karte, el("p", { class: "meldung", "data-frist": frist.ab },
      `⚠️ Die Aufsichten dieses Geräts werden am ${new Date(frist.ab).toLocaleString("de-CH", { weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })} entfernt. Wer eine PIN oder einen Code einer Aufsicht kennt, kann es abbrechen. `,
      el("button", { type: "button", class: "knopf klein", "data-aktion": "frist-abbrechen-oeffnen", text: "Abbrechen", onclick: () => { ansicht = { art: "frist" }; zeichne(); } })));
    if (meldungNachFrist) dazu(karte, el("p", { class: "meldung", text: "Die Aufsichten wurden zurückgesetzt. Mit „Ich bin neu“ → „Ich bin erwachsen“ legen Sie eine neue an." }));
    dazu(karte,el("h3", { text: konten.length || aufsichten.length ? "Wer übt?" : "Willkommen im Lernsteig" }),
      el("p", { class: "leise", text: konten.length || aufsichten.length
        ? "Tippe auf deinen Namen. Mit 🔒 fragt der Lernsteig nach der PIN."
        : "Lege ein Konto an, damit der Lernsteig deinen Stand kennt. Oder übe als Gast: Dann wird nichts gespeichert." }));
    // Gesperrt (DF4 a): kam mit PIN von einem anderen Gerät, hier noch ohne eigene — erst freischalten
    const zuPin = k => (KO.gesperrt(k.id) ? "freischalten" : "pin");
    if (konten.length) dazu(karte,el("div", { class: "konto-liste" }, konten.map(k => el("button", { type: "button", class: "knopf konto-knopf", "data-konto": k.id,
      text: k.pin || KO.gesperrt(k.id) ? `${k.name} \u{1F512}` : k.name, "aria-label": KO.gesperrt(k.id) ? `${k.name}, gesperrt` : k.pin ? `${k.name}, mit PIN` : k.name,
      onclick: async () => { if (k.pin || KO.gesperrt(k.id)) { ansicht = { art: zuPin(k), id: k.id }; zeichne(); } else { await KO.anmelden(k.id); ansicht = { art: "start" }; zeichne(); } } }))));
    if (aufsichten.length) dazu(karte,el("p", { class: "leise", text: "Aufsicht (Eltern, Lehrpersonen):" }),
      el("div", { class: "konto-liste" }, aufsichten.map(a => el("button", { type: "button", class: "knopf konto-knopf", "data-aufsicht": a.id,
        text: `${KO.gesperrt(a.id) ? "\u{1F512} " : ""}\u{1F511} ${a.name}`, "aria-label": KO.gesperrt(a.id) ? `${a.name}, Aufsicht, gesperrt` : `${a.name}, Aufsicht, mit PIN`,
        onclick: () => { ansicht = { art: zuPin(a), id: a.id }; zeichne(); } }))));
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
    // Sicherheitsfrage (Stufe 3 von „PIN vergessen“, RL2 a), Pflicht wie im Eulenpfad
    const frage = feld("Sicherheitsfrage", { type: "text", maxlength: "120", name: "frage", autocomplete: "off", placeholder: "z. B. Name des ersten Haustiers?" }, "Falls Sie PIN und Code vergessen. Wählen Sie eine Frage, deren Antwort die Jugendlichen nicht kennen.");
    const antwort = feld("Antwort", { type: "text", maxlength: "60", name: "antwort", autocomplete: "off" }, "Gross/Klein und Leerzeichen zählen nicht.");
    // Gibt es schon eine Aufsicht mit PIN, bestätigt eine von ihnen (Kern KERN.rollen, KR2 a; Befund D5).
    const bestehende = KO.aufsichten().filter(a => a.pin);
    const wer = bestehende.length ? auswahl("Bestätigt von", bestehende.map(a => ({ id: a.id, name: a.name })), bestehende[0].id, () => {}) : null;
    if (wer) wer.querySelector("select").name = "bestaetigt-von";
    const werPin = bestehende.length ? feld("Deren PIN", { type: "password", inputmode: "numeric", maxlength: "6", name: "bestaetigung-pin", autocomplete: "off" }, "Eine Aufsicht dieses Geräts bestätigt die neue.") : null;
    const wert = (knoten, sel) => knoten.querySelector(sel).value.trim();
    dazu(karte,el("h3", { text: "Neue Aufsicht" }), name, rolle, pin, frage, antwort, wer, werPin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Aufsicht anlegen", "data-aktion": "anlegen", onclick: async () => {
        try {
          const bestaetigung = wer ? { id: wert(wer, "select"), pin: wert(werPin, "input") } : null;
          const r = await KO.aufsichtAnlegen({ name: wert(name, "input"), art: wert(rolle, "select"), pin: wert(pin, "input"), bestaetigung,
            frage: wert(frage, "input"), antwort: wert(antwort, "input") });
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
      // An- und Abmelden steht in der Leiste über den Tabs
      dazu(karte,el("p", { class: "konto-zeile" }, el("b", { text: "Gast" }), el("span", { class: "leise", text: "nichts wird gespeichert" })));
      return karte;
    }
    if (wer === "aufsicht") {
      const a = KO.aufsichtAktiv();
      dazu(karte,el("p", { class: "konto-zeile" }, el("b", { text: `\u{1F511} ${a.name}` }), el("span", { class: "leise", text: `Aufsicht · ${rolleName(a.art)}` })),
        el("p", { class: "leise", text: "Du siehst alle Übungen, auch gesperrte zum Prüfen. Deine Runden zählen als Test." }),
        el("div", { class: "knopf-zeile" },
          el("a", { class: "knopf haupt", href: "#verwaltung", text: "Zur Verwaltung" })));
      return karte;
    }
    const aktiv = KO.aktiv();
    if (ansicht.art === "profil") return profilForm(karte, aktiv);
    const alter = KO.alter(aktiv.geboren);
    // null herausfiltern: das eingebaute append schreibt es sonst als Text „null“ (ohne Wochenziel)
    dazu(karte,...[el("p", { class: "konto-zeile" }, el("b", { text: aktiv.name }),
      el("span", { class: "leise", text: [alter !== null ? `${alter} Jahre` : "", aktiv.klasse ? (KLASSEN.find(k => k.id === String(aktiv.klasse)) || {}).name : "", aktiv.pin ? "mit PIN" : "ohne PIN"].filter(Boolean).join(" · ") })),
      el("div", { class: "knopf-zeile" },
        el("button", { type: "button", class: "knopf", text: "Bearbeiten", "data-aktion": "bearbeiten", onclick: () => { ansicht = { art: "profil" }; zeichne(); } })),
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

  /**
   * PIN vergessen. Jugendliche: mit dem Code. Aufsicht (RL2 a, Kern KERN.rollen): Code, Sicherheitsfrage oder die PIN
   * einer anderen Aufsicht dieses Geräts — dazu die neue PIN; ohne alles das Zurücksetzen mit Frist.
   */
  function vergessenForm(karte) {
    const aufsicht = KO.aufsichtFinde(ansicht.id);
    const k = aufsicht || KO.finde(ansicht.id);
    const w = k.wiederherstellung || {};
    const andere = aufsicht ? KO.aufsichten().filter(a => a.id !== k.id && a.pin) : [];
    const code = feld("Wiederherstellungscode", { type: "text", autocomplete: "off", maxlength: "14", name: "code", placeholder: "XXXX-XXXX-XXXX" }, aufsicht ? "Den Code haben Sie beim Anlegen bekommen." : "Den Code hast du beim Anlegen der PIN bekommen.");
    const antwort = aufsicht && w.frage ? feld(`Oder die Sicherheitsfrage: ${w.frage}`, { type: "text", autocomplete: "off", maxlength: "60", name: "antwort" }) : null;
    const wer = andere.length ? auswahl("Oder: eine andere Aufsicht erlaubt es", andere.map(a => ({ id: a.id, name: a.name })), andere[0].id, () => {}) : null;
    if (wer) wer.querySelector("select").name = "bestaetigt-von";
    const werPin = andere.length ? feld("Deren PIN", { type: "password", inputmode: "numeric", maxlength: "6", name: "bestaetigung-pin", autocomplete: "off" }) : null;
    const pin = feld("Neue PIN (4–6 Ziffern)", { type: "password", inputmode: "numeric", maxlength: "6", name: "neuepin" });
    const wert = (knoten, sel) => (knoten ? knoten.querySelector(sel).value.trim() : "");
    const frist = KO.fristStand();
    dazu(karte,el("h3", { text: `PIN vergessen: ${k.name}` }), code, antwort, wer, werPin, pin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Neue PIN setzen", "data-aktion": "zuruecksetzen", onclick: async () => {
        try {
          const neuePin = wert(pin, "input"), c = wert(code, "input"), a = wert(antwort, "input"), wp = wert(werPin, "input");
          let neu;
          if (!aufsicht) { neu = await KO.neuePinMitCode(k.id, c, neuePin); await KO.anmelden(k.id, neuePin); }
          else {
            if (!c && !a && !wp) throw new Error("Bitte den Code, die Antwort oder die PIN einer anderen Aufsicht eingeben.");
            neu = await KO.aufsichtPinVergessen(k.id, neuePin, c ? { code: c } : a ? { antwort: a } : { bestaetigung: { id: wert(wer, "select"), pin: wp } });
          }
          ansicht = { art: "code", code: neu, aufsicht: !!aufsicht }; zeichne();
        } catch (e) { zeigeFehler(e.message); }
      } }),
      el("button", { type: "button", class: "knopf", text: "Zurück", onclick: () => { ansicht = { art: "start" }; zeichne(); } })),
      aufsicht && !frist ? el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf", "data-aktion": "frist", text: `⏳ Zurücksetzen (dauert ${KO.FRIST_TAGE} Tage)`,
        onclick: () => { if (confirm(`Nach ${KO.FRIST_TAGE} Tagen werden alle Aufsichten auf diesem Gerät entfernt, samt ihren Verbindungen zu den Konten. Danach legt „Ich bin neu“ eine neue Aufsicht an. Die Konten der Jugendlichen bleiben. Bis dahin sehen alle den Termin auf der Anmeldung, und wer eine PIN oder einen Code einer Aufsicht kennt, bricht es ab.`)) { KO.fristAnfordern(); ansicht = { art: "start" }; zeichne(); } } })) : null,
      el("small", { class: "leise", text: aufsicht ? "Ohne Code, Antwort und andere Aufsicht bleibt das Zurücksetzen mit Frist." : "Ohne Code lässt sich die PIN nicht zurücksetzen." }));
    return karte;
  }

  /** Laufende Frist abbrechen (RL2 a): PIN oder Code einer Aufsicht dieses Geräts. */
  function fristForm(karte) {
    const feldPin = feld("PIN oder Wiederherstellungscode einer Aufsicht", { type: "password", autocomplete: "off", maxlength: "20", name: "frist-abbrechen" });
    dazu(karte, el("h3", { text: "⏳ Zurücksetzen abbrechen" }), feldPin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Abbrechen", "data-aktion": "frist-abbrechen", onclick: async () => {
        if (await KO.fristAbbrechenMit(feldPin.querySelector("input").value.trim())) { ansicht = { art: "start" }; zeichne(); }
        else zeigeFehler("Weder eine PIN noch ein Code stimmt.");
      } }), zurueck()));
    return karte;
  }

  /**
   * Gesperrte Person freischalten (DF4 a): mit dem Wiederherstellungscode und einer neuen PIN; eine Aufsicht auch mit der
   * PIN einer anderen Aufsicht dieses Geräts. Der Code bleibt derselbe.
   */
  function freischaltenForm(karte) {
    const aufsicht = KO.aufsichtFinde(ansicht.id);
    const k = aufsicht || KO.finde(ansicht.id);
    const andere = aufsicht ? KO.aufsichten().filter(a => a.id !== k.id && !KO.gesperrt(a.id)) : [];
    // Der Code reicht für eine Aufsicht nur, solange das Gerät keine Aufsicht mit PIN hat (OA1 a, Kern)
    const mitCode = !!(k.wiederherstellung && k.wiederherstellung.code) && KO.codeReicht(k.id);
    dazu(karte, el("h3", { text: `\u{1F512} ${aufsicht ? "\u{1F511} " : ""}${k.name}` }),
      el("p", { text: aufsicht ? "Diese Aufsicht ist auf einem anderen Gerät mit einer PIN geschützt. Die PIN reist nicht mit — hier braucht sie zuerst eine eigene."
        : "Dein Konto ist auf einem anderen Gerät mit einer PIN geschützt. Die PIN reist nicht mit — hier legst du zuerst eine neue fest." }));
    if (!mitCode && !andere.length) {
      dazu(karte, el("p", { class: "leise", text: aufsicht ? "Freischalten geht mit dem Wiederherstellungscode oder mit der PIN einer anderen Aufsicht dieses Geräts. Hier gibt es beides nicht." : "Ohne Wiederherstellungscode lässt sich das Konto hier nicht freischalten." }),
        el("div", { class: "knopf-zeile" }, zurueck()));
      return karte;
    }
    const code = mitCode ? feld("Wiederherstellungscode", { type: "text", autocomplete: "off", maxlength: "14", name: "code", placeholder: "XXXX-XXXX-XXXX" }, aufsicht ? "Den Code hat die Aufsicht beim Anlegen bekommen." : "Den Code hast du beim Anlegen der PIN bekommen.") : null;
    if (aufsicht && !mitCode && andere.length) dazu(karte, el("p", { class: "leise", text: "Hier gibt es schon eine Aufsicht. Eine von ihnen bestätigt mit ihrer PIN — der Code allein reicht dafür nicht." }));
    const wer = andere.length ? auswahl(mitCode ? "Oder: bestätigt von" : "Bestätigt von", andere.map(a => ({ id: a.id, name: a.name })), andere[0].id, () => {}) : null;
    if (wer) wer.querySelector("select").name = "bestaetigt-von";
    const werPin = andere.length ? feld("Deren PIN", { type: "password", inputmode: "numeric", maxlength: "6", name: "bestaetigung-pin", autocomplete: "off" }) : null;
    const pin = feld("Neue PIN für dieses Gerät (4–6 Ziffern)", { type: "password", inputmode: "numeric", maxlength: "6", name: "neuepin", autocomplete: "new-password" });
    const wert = (knoten, sel) => (knoten ? knoten.querySelector(sel).value.trim() : "");
    dazu(karte, code, wer, werPin, pin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Freischalten", "data-aktion": "freischalten", onclick: async () => {
        try {
          const c = wert(code, "input"), wp = wert(werPin, "input");
          if (!c && !wp) throw new Error(andere.length && mitCode ? "Bitte den Code eingeben oder eine andere Aufsicht ihre PIN." : mitCode ? "Bitte den Wiederherstellungscode eingeben." : "Bitte die PIN der anderen Aufsicht eingeben.");
          await KO.freischalten(k.id, wert(pin, "input"), c ? { code: c } : { bestaetigung: { id: wert(wer, "select"), pin: wp } });
          ansicht = { art: "start" }; zeichne();
        } catch (e) { zeigeFehler(e.message); }
      } }), zurueck()));
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
    const f = { "neu-wer": neuWer, neu: neuForm, "neu-aufsicht": neuAufsicht, pin: pinForm, vergessen: vergessenForm, code: codeAnzeige, freischalten: freischaltenForm, frist: fristForm }[ansicht.art] || anmeldung;
    wurzel.replaceChildren(f(karte),
      el("p", { class: "fuss", text: "Alles bleibt im Browser auf diesem Gerät. Keine Anmeldung bei einem Server, keine Werbung." }));
  }

  function zeichneUebungen(box) {
    const k = LST.konto();
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
    box.replaceChildren(faecher);
  }

  function zeichneProfil(box) {
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
      geraetHinweis(),
      LST.werUebt() === "lernend" ? null : el("small", { class: "leise", text: "Diese Einstellungen gelten nur, bis du den Tab schliesst." }));
    box.replaceChildren(el("h2", { class: "abschnitt", text: "Konto" }), kontoKarte(),
      el("h2", { class: "abschnitt", text: "Einstellungen" }), einstellungen);
  }

  // ---------- Tabs (Plan C2, wie Eulenpfad L3 a) ----------
  // Eine Seite mit Tabs in derselben Reihenfolge wie im Eulenpfad; der Tab steht in der Adresse (#uebungen, #profil,
  // #statistik, #statistik/<Konto> für die Aufsicht, #erfolge, #verwaltung). Statistik, Erfolge und Verwaltung zeichnen
  // start/statistik.js und start/aufsicht.js (LST_START).
  const TABS = [
    { id: "uebungen", text: "📚 Übungen", zeichne: zeichneUebungen },
    { id: "profil", text: "👤 Profil", zeichne: zeichneProfil },
    { id: "statistik", text: "📊 Statistik", zeichne: (box, teil) => LST_START.statistik(box, teil) },
    { id: "erfolge", text: "🏅 Erfolge", zeichne: box => LST_START.erfolge(box) },
    { id: "verwaltung", text: "⚙️ Verwaltung", zeichne: box => LST_START.verwaltung(box), nurAufsicht: true },
  ];
  function aktuellerTab() {
    const [id, teil] = location.hash.slice(1).split("/");
    const tab = TABS.find(t => t.id === id && (!t.nurAufsicht || LST.werUebt() === "aufsicht")) || TABS[0];
    return { tab, teil: tab.id === id ? teil || null : null };
  }
  /**
   * Personen-Knopf wie im Eulenpfad (KERN.personenMenue, Entscheid PA1 a, LERN_Session17): das Menü nennt die anderen
   * Konten und Aufsichten des Geräts (mit PIN über die PIN-Abfrage; „Zurück“ dort lässt die Person angemeldet) und,
   * getrennt darunter, „↩ Abmelden“ — beim Gast „Anmelden“.
   */
  function personenKnopf(wer) {
    const ich = wer === "lernend" ? KO.aktiv() : wer === "aufsicht" ? KO.aufsichtAktiv() : null;
    const name = ich ? (wer === "aufsicht" ? `\u{1F511} ${ich.name}` : ich.name) : "\u{1F440} Gast";
    const personen = [
      ...KO.alle().map(k => ({ id: k.id, name: k.name, zusatz: k.pin || KO.gesperrt(k.id) ? "\u{1F512}" : "", aria: KO.gesperrt(k.id) ? `${k.name}, gesperrt` : k.pin ? `${k.name}, mit PIN` : k.name, pin: !!k.pin || KO.gesperrt(k.id) })),
      ...KO.aufsichten().map(a => ({ id: a.id, name: `${KO.gesperrt(a.id) ? "\u{1F512} " : ""}\u{1F511} ${a.name}`, aria: KO.gesperrt(a.id) ? `${a.name}, Aufsicht, gesperrt` : `${a.name}, Aufsicht, mit PIN`, pin: true })),
    ].filter(p => !ich || p.id !== ich.id);
    return KERN.personenMenue({
      titel: "Angemeldet als",
      ich: { name, bild: null },
      personen,
      waehle: async id => {
        if (personen.find(p => p.id === id).pin) { ansicht = { art: KO.gesperrt(id) ? "freischalten" : "pin", id }; return zeichne(); }
        await KO.anmelden(id);
        ansicht = { art: "start" };
        zeichne();
      },
      schluss: { text: wer === "gast" ? "Anmelden" : "\u21A9 Abmelden",
        aktion: () => { KO.abmelden(); ansicht = { art: "start" }; history.replaceState(null, "", location.pathname); zeichne(); } },
    });
  }
  function leiste(tab) {
    const wer = LST.werUebt();
    // Tabs in einer Zeile mit Pfeilen bei Bedarf (KERN.rolleiste, LERN_Session17), rechts der Personen-Knopf
    return el("div", { class: "leiste" },
      KERN.rolleiste(el("nav", { class: "tabs", role: "tablist", "aria-label": "Bereiche" },
        TABS.filter(t => !t.nurAufsicht || wer === "aufsicht").map(t => el("a", { class: "tab", role: "tab", href: "#" + t.id, "aria-selected": String(t === tab), text: t.text })))),
      personenKnopf(wer));
  }

  function zeichne() {
    // Frist abgelaufen (RL2 a): die Aufsichten des Geräts sind entfernt, „Ich bin neu“ legt ohne Bestätigung eine an
    if (KO.fristFaellig()) meldungNachFrist = true;
    if (LST.werUebt() === "niemand" || ["neu-wer", "neu", "neu-aufsicht", "pin", "vergessen", "freischalten", "frist"].includes(ansicht.art)) return zeichneAnmeldung();
    // Ein neuer Wiederherstellungscode steht im Profil (nur jetzt sichtbar)
    if (ansicht.art === "code" && !location.hash.startsWith("#profil")) history.replaceState(null, "", "#profil");
    const { tab, teil } = aktuellerTab();
    const inhalt = el("div", { class: "tab-inhalt", role: "tabpanel" });
    wurzel.replaceChildren(leiste(tab), inhalt,
      el("p", { class: "fuss", text: "Alles bleibt im Browser auf diesem Gerät. Keine Anmeldung bei einem Server, keine Werbung." }));
    tab.zeichne(inhalt, teil);
  }
  LST_START.neu = zeichne;
  addEventListener("hashchange", () => { if (!/einladung=/.test(location.hash)) zeichne(); });
  // Kam beim Abgleich über den Ordner etwas dazu (Konten, Runden): neu zeichnen, ausser jemand tippt gerade etwas ein
  // (wie im Eulenpfad)
  addEventListener("lernsteig:abgeglichen", () => {
    if (!document.activeElement || !document.activeElement.matches || !document.activeElement.matches("input, select, textarea")) zeichne();
  });

  zeichne();
})();
