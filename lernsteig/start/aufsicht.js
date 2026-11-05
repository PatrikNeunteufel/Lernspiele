/* Aufsicht des Lernsteigs (AU1 a, TR1 a): anlegen mit PIN und Wiederherstellungscode, anmelden nur im Tab, verbundene
   Konten mit Stand, Mitlesen anfragen (der Jugendliche stimmt in seinem Konto zu), Konto für einen Jugendlichen anlegen,
   Sicherung der verbundenen Konten, Einstellungen des Geräts (Taschenrechner, Dezimalzeichen). */
"use strict";

(function () {
  const KAT = LST_KATALOG;
  const KO = LST_KONTEN;
  const el = LST.el;
  const wurzel = document.getElementById("aufsicht");
  const TAGE = 14;
  let ansicht = { art: "start" }; // start | neu | pin | vergessen | code | (angemeldet)
  let meldung = "";

  const fehlerText = el("p", { class: "fehlertext", role: "alert" });
  const zeigeFehler = t => { fehlerText.textContent = t || ""; };
  const geh = a => { ansicht = a; meldung = ""; zeichne(); };
  const feld = (titel, attr, hilfe) => el("label", { class: "einstellung" }, el("span", { text: titel }), el("input", Object.assign({ class: "textfeld" }, attr)), hilfe ? el("small", { class: "leise", text: hilfe }) : null);
  function auswahl(titel, werte, aktuell, beiWahl, attr) {
    const s = el("select", Object.assign({ "aria-label": titel, onchange: e => beiWahl(e.target.value) }, attr || {}),
      werte.map(w => el("option", { value: w.id, text: w.name, selected: w.id === aktuell })));
    return el("label", { class: "einstellung" }, el("span", { text: titel }), s);
  }
  const wert = (knoten, sel) => knoten.querySelector(sel).value.trim();
  const rolleName = id => (KO.ROLLEN.find(r => r.id === id) || {}).name || "";
  const datumText = iso => { const d = new Date(iso); return isNaN(d) ? "–" : `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`; };

  // ---------- ohne Anmeldung ----------
  function startKarte(karte) {
    const liste = KO.aufsichten();
    karte.append(el("p", { text: "Eltern und Lehrpersonen können hier den Stand verbundener Konten sehen. Verbunden ist ein Konto nur, wenn die Aufsicht es angelegt oder der Jugendliche zugestimmt hat. Der Jugendliche sieht, wer mitliest." }));
    if (liste.length) karte.append(el("div", { class: "konto-liste" }, liste.map(a => el("button", { type: "button", class: "knopf konto-knopf", "data-aufsicht": a.id,
      text: `${a.name} (${rolleName(a.art)})`, onclick: () => geh({ art: "pin", id: a.id }) }))));
    karte.append(el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf haupt", text: "Neue Aufsicht", onclick: () => geh({ art: "neu" }) })));
    return karte;
  }
  function neuForm(karte) {
    const name = feld("Name", { type: "text", maxlength: "40", name: "name", autocomplete: "name" }, "So sehen die Jugendlichen, wer mitliest.");
    const rolle = auswahl("Rolle", KO.ROLLEN, "eltern", () => {}, { name: "rolle" });
    const pin = feld("PIN (4–6 Ziffern)", { type: "password", inputmode: "numeric", maxlength: "6", name: "pin", autocomplete: "new-password" }, "Pflicht für die Aufsicht.");
    // Gibt es schon eine Aufsicht, bestätigt eine von ihnen mit ihrer PIN (wie Eulenpfad KR2 a; Befund D5).
    const bestehende = KO.aufsichten();
    const wer = bestehende.length ? auswahl("Bestätigt von", bestehende.map(a => ({ id: a.id, name: a.name })), bestehende[0].id, () => {}, { name: "bestaetigt-von" }) : null;
    const werPin = bestehende.length ? feld("Deren PIN", { type: "password", inputmode: "numeric", maxlength: "6", name: "bestaetigung-pin", autocomplete: "off" }, "Eine Aufsicht dieses Geräts bestätigt die neue.") : null;
    karte.append(el("h3", { text: "Neue Aufsicht" }), name, rolle, pin, wer, werPin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Aufsicht anlegen", "data-aktion": "anlegen", onclick: async () => {
        try {
          const bestaetigung = wer ? { id: wert(wer, "select"), pin: wert(werPin, "input") } : null;
          const r = await KO.aufsichtAnlegen({ name: wert(name, "input"), art: wert(rolle, "select"), pin: wert(pin, "input"), bestaetigung });
          geh({ art: "code", code: r.code });
        }
        catch (e) { zeigeFehler(e.message); }
      } }),
      el("button", { type: "button", class: "knopf", text: "Abbrechen", onclick: () => geh({ art: "start" }) })));
    return karte;
  }
  function pinForm(karte) {
    const a = KO.aufsichtFinde(ansicht.id);
    const pin = feld(`PIN von ${a.name}`, { type: "password", inputmode: "numeric", maxlength: "6", name: "pin", autocomplete: "current-password" });
    const los = async () => { try { await KO.aufsichtAnmelden(a.id, wert(pin, "input")); geh({ art: "start" }); } catch (e) { zeigeFehler(e.message); } };
    pin.querySelector("input").addEventListener("keydown", e => { if (e.key === "Enter") los(); });
    karte.append(pin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Anmelden", "data-aktion": "anmelden", onclick: los }),
      el("button", { type: "button", class: "knopf", text: "PIN vergessen?", onclick: () => geh({ art: "vergessen", id: a.id }) }),
      el("button", { type: "button", class: "knopf", text: "Zurück", onclick: () => geh({ art: "start" }) })));
    return karte;
  }
  function vergessenForm(karte) {
    const a = KO.aufsichtFinde(ansicht.id);
    const code = feld("Wiederherstellungscode", { type: "text", autocomplete: "off", maxlength: "14", name: "code", placeholder: "XXXX-XXXX-XXXX" });
    const pin = feld("Neue PIN (4–6 Ziffern)", { type: "password", inputmode: "numeric", maxlength: "6", name: "neuepin" });
    karte.append(el("h3", { text: `PIN vergessen: ${a.name}` }), code, pin, fehlerText, el("div", { class: "knopf-zeile" },
      el("button", { type: "button", class: "knopf haupt", text: "Neue PIN setzen", "data-aktion": "zuruecksetzen", onclick: async () => {
        try {
          const neu = await KO.aufsichtNeuePinMitCode(a.id, wert(code, "input"), wert(pin, "input"));
          await KO.aufsichtAnmelden(a.id, wert(pin, "input"));
          geh({ art: "code", code: neu });
        } catch (e) { zeigeFehler(e.message); }
      } }),
      el("button", { type: "button", class: "knopf", text: "Zurück", onclick: () => geh({ art: "start" }) })));
    return karte;
  }
  function codeAnzeige(karte) {
    karte.append(el("h3", { text: "Wiederherstellungscode der Aufsicht" }),
      el("p", { class: "code-anzeige", text: ansicht.code, "data-code": ansicht.code }),
      el("p", { text: "Aufschreiben und gut aufbewahren. Damit setzen Sie eine neue PIN, falls Sie sie vergessen. Er wird nur jetzt angezeigt." }),
      el("button", { type: "button", class: "knopf haupt", text: "Aufgeschrieben", onclick: () => geh({ art: "start" }) }));
    return karte;
  }

  // ---------- angemeldet ----------
  function kontoZeile(a, k) {
    const grenze = new Date(Date.now() - (TAGE - 1) * 864e5).toISOString().slice(0, 10);
    const r = LST.runden(x => x.konto === k.id);
    const tage = new Set(r.map(x => (x.zeit || "").slice(0, 10)).filter(t => t >= grenze)).size;
    const gespielt = KAT.UEBUNGEN.filter(u => r.some(x => x.uebung === u.id));
    const sicher = gespielt.reduce((s, u) => s + u.stufen.filter(st => LST.kompetenzstand(k.id, u.id, st).stand.startsWith("sicher")).length, 0);
    const stufen = gespielt.reduce((s, u) => s + u.stufen.length, 0);
    const klasse = (KO.KLASSEN.find(x => x.id === String(k.klasse)) || {}).name;
    return el("li", { "data-konto": k.id },
      el("b", { text: k.name }), klasse ? el("small", { class: "leise", text: ` ${klasse}` }) : null,
      el("div", { class: "leise", text: [`${r.length} Runden`, `zuletzt ${r.length ? datumText(r[r.length - 1].zeit) : "–"}`, `${tage} von ${TAGE} Tagen geübt`, LST.serie(k) ? "Wochenziel: " + LST.serieText(LST.serie(k)) : "", stufen ? `${sicher} von ${stufen} Stufen sicher` : ""].filter(Boolean).join(" · ") }),
      el("div", { class: "knopf-zeile" },
        el("a", { class: "knopf", href: `statistik.html?konto=${encodeURIComponent(k.id)}`, text: "Stand ansehen" }),
        el("button", { type: "button", class: "knopf", text: "Verbindung lösen", onclick: () => { KO.loesen(k.id, a.id); meldung = `Verbindung mit ${k.name} gelöst.`; zeichne(); } })));
  }

  function angemeldet(a) {
    const verbunden = KO.verbundene(a.id);
    const offen = KO.angefragt(a.id);
    const andere = KO.alle().filter(k => !verbunden.some(v => v.id === k.id) && !offen.some(v => v.id === k.id));
    const teile = [];
    teile.push(el("section", { class: "einstellungen konto" },
      el("p", { class: "konto-zeile" }, el("b", { text: a.name }), el("span", { class: "leise", text: rolleName(a.art) })),
      el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf", text: "Abmelden", onclick: () => { KO.aufsichtAbmelden(); geh({ art: "start" }); } })),
      meldung ? el("p", { class: "meldung", role: "status", text: meldung }) : null));

    teile.push(el("h2", { class: "abschnitt", text: "Verbundene Konten" }),
      verbunden.length ? el("ul", { class: "stand-liste" }, verbunden.map(k => kontoZeile(a, k))) : el("p", { class: "leise", text: "Noch kein Konto verbunden." }));
    if (offen.length) teile.push(el("p", { class: "leise", text: `Wartet auf Zustimmung: ${offen.map(k => k.name).join(", ")}` }));

    if (andere.length) teile.push(el("h2", { class: "abschnitt", text: "Mitlesen anfragen" }), el("section", { class: "einstellungen" },
      el("p", { text: "Der Jugendliche sieht die Anfrage nach dem Anmelden und stimmt zu oder lehnt ab." }),
      el("div", { class: "konto-liste" }, andere.map(k => el("button", { type: "button", class: "knopf", "data-anfrage": k.id, text: `${k.name} anfragen`,
        onclick: () => { KO.anfragen(k.id); meldung = `Anfrage an ${k.name} gestellt.`; zeichne(); } })))));

    const name = feld("Vorname", { type: "text", maxlength: "40", name: "vorname" });
    const geboren = feld("Geburtsdatum", { type: "date", name: "geboren", max: new Date().toISOString().slice(0, 10) });
    const klasse = auswahl("Klasse", KO.KLASSEN, "7", () => {}, { name: "klasse" });
    teile.push(el("h2", { class: "abschnitt", text: "Konto anlegen" }), el("section", { class: "einstellungen" },
      el("p", { text: "Das Konto ist gleich mit Ihnen verbunden. Eine PIN legt der Jugendliche selbst im Profil fest." }),
      name, geboren, klasse, fehlerText,
      el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf haupt", text: "Konto anlegen", "data-aktion": "konto-anlegen", onclick: async () => {
        try {
          const k = await KO.kontoFuerAufsicht({ name: wert(name, "input"), geboren: wert(geboren, "input") || null, klasse: Number(wert(klasse, "select")), lehrplan: LST.konto().lehrplan });
          meldung = `Konto ${k.name} angelegt und verbunden.`; zeichne();
        } catch (e) { zeigeFehler(e.message); }
      } }))));

    const datei = el("input", { type: "file", accept: "application/json,.json", hidden: true, "aria-label": "Sicherung wählen", onchange: async e => {
      const f = e.target.files[0]; if (!f) return;
      try {
        const erg = LST_DATEN.einlesen(JSON.parse(await f.text()));
        KO.verbindeEingelesene(erg.neu); // nur Konten, die neu auf das Gerät kamen (D5)
        meldung = `Eingelesen: ${erg.runden} Runden, ${erg.rekorde} Rekorde; verbunden: ${erg.ids.map(id => (KO.finde(id) || {}).name).filter(Boolean).join(", ") || "keine Konten"}.`;
      } catch (err) { meldung = err instanceof SyntaxError ? "Die Datei ist kein lesbares JSON." : err.message; }
      zeichne();
    } });
    teile.push(el("h2", { class: "abschnitt", text: "Sichern und Einlesen" }), el("section", { class: "einstellungen" },
      el("p", { text: "Sichern: eine Datei mit den verbundenen Konten. Einlesen: Sicherungen, die Jugendliche Ihnen geben; die Konten darin werden mit Ihnen verbunden." }),
      el("div", { class: "knopf-zeile" },
        el("button", { type: "button", class: "knopf haupt", text: "Sichern", disabled: !verbunden.length,
          onclick: () => LST_DATEN.herunterladen(LST_DATEN.sichern(verbunden.map(k => k.id)), LST_DATEN.dateiname(`aufsicht-${a.name}`)) }),
        el("button", { type: "button", class: "knopf", text: "Einlesen", onclick: () => datei.click() }), datei)));

    const e = LST.lies("einstellungen", {});
    const setze = (f, w) => { KO.setzeGeraeteEinstellung(f, w); meldung = "Einstellung gespeichert."; zeichne(); };
    teile.push(el("h2", { class: "abschnitt", text: "Einstellungen für dieses Gerät" }), el("section", { class: "einstellungen" },
      auswahl("Taschenrechner", [
        { id: "uebung", name: "wie die Übung es vorsieht" }, { id: "ohne", name: "überall gesperrt" }, { id: "erlaubt", name: "überall erlaubt" },
      ], e.rechner || "uebung", w => setze("rechner", w), { name: "rechner" }),
      auswahl("Dezimalzeichen", [{ id: "punkt", name: "Punkt (3.5)" }, { id: "komma", name: "Komma (3,5)" }], e.dezimal || "punkt", w => setze("dezimal", w), { name: "dezimal" }),
      el("small", { class: "leise", text: "Gilt für alle Konten auf diesem Gerät. Die Jugendlichen sehen die Einstellung in jeder Übung." })));
    return teile;
  }

  function zeichne() {
    zeigeFehler("");
    const a = KO.aufsichtAktiv();
    if (a && !["code"].includes(ansicht.art)) { wurzel.replaceChildren(...angemeldet(a)); return; }
    const karte = el("section", { class: "einstellungen konto" });
    const f = { neu: neuForm, pin: pinForm, vergessen: vergessenForm, code: codeAnzeige }[ansicht.art] || startKarte;
    wurzel.replaceChildren(f(karte),
      el("p", { class: "fuss", text: "Grenze: Alles liegt im Browser dieses Geräts. Die PIN schützt vor Versehen und Neugier, nicht vor jemandem, der die Entwicklerwerkzeuge des Browsers öffnet." }));
  }

  zeichne();
})();
