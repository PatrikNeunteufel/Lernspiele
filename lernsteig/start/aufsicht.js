/* Tab Verwaltung des Lernsteigs (Plan C2; nur für die angemeldete Aufsicht; AU1 a, TR1 a): verbundene Konten mit Stand, Mitlesen anfragen (der Jugendliche stimmt in
   seinem Konto zu), Konto für einen Jugendlichen anlegen, Sicherung der verbundenen Konten, Einstellungen des Geräts
   (Taschenrechner, Dezimalzeichen, Gast C2 a). Anlegen und Anmelden der Aufsicht auf der Startseite (Plan C1). */
"use strict";

var LST_START = typeof LST_START === "object" ? LST_START : {};

(function () {
  const KAT = LST_KATALOG;
  const KO = LST_KONTEN;
  const el = LST.el;
  let wurzel = null; // Inhalt des Tabs (start/start.js ruft LST_START.verwaltung)
  const TAGE = 14;
  let meldung = "";

  const fehlerText = el("p", { class: "fehlertext", role: "alert" });
  const zeigeFehler = t => { fehlerText.textContent = t || ""; };
  const feld = (titel, attr, hilfe) => el("label", { class: "einstellung" }, el("span", { text: titel }), el("input", Object.assign({ class: "textfeld" }, attr)), hilfe ? el("small", { class: "leise", text: hilfe }) : null);
  function auswahl(titel, werte, aktuell, beiWahl, attr) {
    const s = el("select", Object.assign({ "aria-label": titel, onchange: e => beiWahl(e.target.value) }, attr || {}),
      werte.map(w => el("option", { value: w.id, text: w.name, selected: w.id === aktuell })));
    return el("label", { class: "einstellung" }, el("span", { text: titel }), s);
  }
  const wert = (knoten, sel) => knoten.querySelector(sel).value.trim();
  const rolleName = id => (KO.ROLLEN.find(r => r.id === id) || {}).name || "";
  const datumText = iso => { const d = new Date(iso); return isNaN(d) ? "–" : `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`; };

  // ---------- angemeldet ----------
  function kontoZeile(a, k) {
    const grenze = new Date(Date.now() - (TAGE - 1) * 864e5).toISOString().slice(0, 10);
    const r = LST.runden(x => x.person === k.id);
    const tage = new Set(r.map(x => (x.zeit || "").slice(0, 10)).filter(t => t >= grenze)).size;
    const gespielt = KAT.UEBUNGEN.filter(u => r.some(x => x.inhalt === u.id));
    const sicher = gespielt.reduce((s, u) => s + u.stufen.filter(st => LST.kompetenzstand(k.id, u.id, st).stand.startsWith("sicher")).length, 0);
    const stufen = gespielt.reduce((s, u) => s + u.stufen.length, 0);
    const klasse = (KO.KLASSEN.find(x => x.id === String(k.klasse)) || {}).name;
    return el("li", { "data-konto": k.id },
      el("b", { text: k.name }), klasse ? el("small", { class: "leise", text: ` ${klasse}` }) : null,
      el("div", { class: "leise", text: [`${r.length} Runden`, `zuletzt ${r.length ? datumText(r[r.length - 1].zeit) : "–"}`, `${tage} von ${TAGE} Tagen geübt`, LST.serie(k) ? "Wochenziel: " + LST.serieText(LST.serie(k)) : "", stufen ? `${sicher} von ${stufen} Stufen sicher` : ""].filter(Boolean).join(" · ") }),
      el("div", { class: "knopf-zeile" },
        el("a", { class: "knopf", href: `#statistik/${encodeURIComponent(k.id)}`, text: "Stand ansehen" }),
        el("a", { class: "knopf", href: `#erfolge/${encodeURIComponent(k.id)}`, text: "Erfolge" }),
        el("button", { type: "button", class: "knopf", text: "Verbindung lösen", onclick: () => { KO.loesen(k.id, a.id); meldung = `Verbindung mit ${k.name} gelöst.`; zeichne(); } })));
  }

  function angemeldet(a) {
    const verbunden = KO.verbundene(a.id);
    const offen = KO.angefragt(a.id);
    const andere = KO.alle().filter(k => !verbunden.some(v => v.id === k.id) && !offen.some(v => v.id === k.id));
    const teile = [];
    teile.push(el("section", { class: "einstellungen konto" },
      el("p", { class: "konto-zeile" }, el("b", { text: a.name }), el("span", { class: "leise", text: rolleName(a.art) })),
      el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf", text: "Abmelden", onclick: () => { KO.aufsichtAbmelden(); history.replaceState(null, "", location.pathname); LST_START.neu(); } })),
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

    teile.push(el("h2", { class: "abschnitt", text: "Abgleich zwischen Geräten" }), abgleichKarte());

    const e = LST.lies("einstellungen", {});
    const setze = (f, w) => { KO.setzeGeraeteEinstellung(f, w); meldung = "Einstellung gespeichert."; zeichne(); };
    teile.push(el("h2", { class: "abschnitt", text: "Einstellungen für dieses Gerät" }), el("section", { class: "einstellungen" },
      auswahl("Taschenrechner", [
        { id: "uebung", name: "wie die Übung es vorsieht" }, { id: "ohne", name: "überall gesperrt" }, { id: "erlaubt", name: "überall erlaubt" },
      ], e.rechner || "uebung", w => setze("rechner", w), { name: "rechner" }),
      auswahl("Dezimalzeichen", [{ id: "punkt", name: "Punkt (3.5)" }, { id: "komma", name: "Komma (3,5)" }], e.dezimal || "punkt", w => setze("dezimal", w), { name: "dezimal" }),
      auswahl("Gast", [{ id: "an", name: "erlaubt (nichts wird gespeichert)" }, { id: "aus", name: "abgeschaltet" }], e.gast || "an", w => setze("gast", w), { name: "gast" }),
      el("small", { class: "leise", text: "Gilt für alle Konten auf diesem Gerät. Die Jugendlichen sehen die Einstellung in jeder Übung." })));
    teile.push(el("h2", { class: "abschnitt", text: "In den Eulenpfad übernehmen" }), uebernahmeKarte(a));
    teile.push(el("h2", { class: "abschnitt", text: "Entwicklung" }), entwicklungKarte());
    return teile;
  }

  // Abgleich über einen Ordner (Plan C5, DF3 a; gemeinsam/abgleich.js über KERN.abgleich), wie im Eulenpfad: den Ordner
  // wählt die Aufsicht, danach gleicht jedes Gerät selbsttätig ab. Aufsichten kommen gesperrt an (OA1 a, OA2 a).
  let abgleichMeldung = "";
  function abgleichKarte() {
    const ab = LST_ABGLEICH;
    const melde = r => {
      abgleichMeldung = r.status === "ok" ? `Abgeglichen. ${ab.ergebnisText(r.neu)}`
        : r.status === "keine-erlaubnis" ? "Der Browser hat den Zugriff auf den Ordner nicht erlaubt."
        : r.status === "kein-ordner" ? "Noch kein Ordner gewählt."
        : `Das ging nicht: ${r.fehler}`;
      zeichne();
    };
    const zeit = iso => new Date(iso).toLocaleString("de-CH", { dateStyle: "short", timeStyle: "short" });
    const st = ab.stand();
    const name = feld("Name dieses Geräts", { type: "text", name: "geraet-name", maxlength: "30", value: ab.geraet().name, placeholder: "z. B. Laptop Wohnzimmer" }, "Steht bei den anderen Geräten unter „Andere Geräte“.");
    name.querySelector("input").addEventListener("change", ev => { ab.benenne(ev.target.value); abgleichMeldung = "Name gespeichert."; zeichne(); });
    const datei = el("input", { type: "file", accept: "application/json", hidden: true, onchange: async ev => {
      const f = ev.target.files[0];
      if (!f) return;
      try { abgleichMeldung = `Eingelesen. ${ab.ergebnisText(await ab.dateiEinlesen(f))}`; }
      catch (err) { abgleichMeldung = err instanceof SyntaxError ? "Die Datei ist kein lesbares JSON." : err.message; }
      zeichne();
    } });
    const ordnerTeil = ab.kannOrdner
      ? [st && st.ordner
          ? el("p", {}, "Ordner ", el("b", { text: st.ordner }), `, zuletzt abgeglichen ${zeit(st.zuletzt)}. Andere Geräte: ${st.geraete.length
            ? st.geraete.map(g => (g.fehler ? `${g.datei} (unlesbar)` : `${g.name || g.id} (Stand ${zeit(g.gesichert)})`)).join(", ") : "noch keine"}.`)
          : el("p", { text: "Noch kein Ordner gewählt." }),
        el("div", { class: "knopf-zeile" },
          el("button", { type: "button", class: st && st.ordner ? "knopf" : "knopf haupt", "data-aktion": "ordner-waehlen", text: st && st.ordner ? "Anderer Ordner" : "Ordner wählen",
            onclick: async () => { try { melde(await ab.waehlen()); } catch (err) { abgleichMeldung = "Kein Ordner gewählt."; zeichne(); } } }),
          st && st.ordner ? el("button", { type: "button", class: "knopf", "data-aktion": "abgleichen", text: "Jetzt abgleichen", onclick: async () => melde(await ab.jetzt(true)) }) : null,
          st && st.ordner ? el("button", { type: "button", class: "knopf", text: "Ordner vergessen", onclick: async () => { await ab.vergessen(); abgleichMeldung = "Ordner vergessen."; zeichne(); } }) : null)]
      : [el("p", { class: "leise", text: "Dieser Browser kann keinen Ordner verwenden — das geht heute in Chrome und Edge auf dem Computer. Abgleichen geht hier über eine Datei: unten sichern, auf dem anderen Gerät einlesen, und umgekehrt." })];
    return el("section", { class: "einstellungen" },
      el("p", { text: "Üben Jugendliche auf mehreren Geräten, wählt man auf jedem denselben Ordner — einen Netzwerkordner oder den Ordner eines Cloud-Dienstes. Jedes Gerät schreibt dort seine eigene Datei und liest die der anderen: Konten, Aufsichten, Runden und Rekorde. PIN, Code und Verbindungen bleiben auf dem Gerät." }),
      el("p", { class: "leise", text: "Ein Konto mit PIN ist auf einem anderen Gerät gesperrt, bis es dort mit dem Wiederherstellungscode freigeschaltet ist. Für eine Aufsicht reicht der Code nur auf einem Gerät ohne Aufsicht; sonst bestätigt eine Aufsicht des Geräts mit ihrer PIN." }),
      name, ...ordnerTeil,
      el("div", { class: "knopf-zeile" },
        el("button", { type: "button", class: "knopf", text: "Abgleich-Datei sichern", onclick: () => ab.dateiSichern() }),
        el("button", { type: "button", class: "knopf", text: "Abgleich-Datei einlesen", onclick: () => datei.click() }), datei),
      abgleichMeldung ? el("p", { class: "meldung", role: "status", text: abgleichMeldung }) : null);
  }

  // Übernahme in den Eulenpfad (Plan C9, Ü1 a, Ü2 b; KERN.person.uebernehmen): legt die angemeldete Aufsicht im Eulenpfad
  // (Primarschule) an — gleiche Kennung, gleicher Name, gleiche PIN und Sicherheitsfrage, neuer Wiederherstellungscode.
  let uebernahme = null; // { text, code } nach dem Knopfdruck
  function uebernahmeKarte(a) {
    const karte = el("section", { class: "einstellungen" },
      el("p", { text: "Für Familien mit Kindern in der Primarschule: Legt Sie im Eulenpfad als Aufsicht an, mit derselben PIN. Den Wiederherstellungscode gibt es dort neu. Konten, Runden und Einstellungen bleiben hier." }),
      el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf", "data-aktion": "uebernehmen", text: "🔑 In den Eulenpfad übernehmen",
        onclick: async () => {
          try {
            const ziel = KERN.person.liste(KERN.speicher("lernspiele:"), { schluessel: "personen" });
            const r = await KERN.person.uebernehmen(KO.LISTE.finde(a.id), ziel);
            uebernahme = r.status === "schon" ? { text: "Sie sind im Eulenpfad schon als Aufsicht angelegt." }
              : r.status === "name" ? { text: `Im Eulenpfad gibt es schon jemanden mit dem Namen „${a.name}“. Nichts wurde geändert.` }
              : { text: "Übernommen. Ihr Wiederherstellungscode für den Eulenpfad — aufschreiben, er wird nur jetzt angezeigt:", code: r.code };
          } catch (e) { uebernahme = { text: e.message }; }
          zeichne();
        } })));
    if (uebernahme) karte.append(el("p", { class: "meldung", role: "status", text: uebernahme.text }),
      ...(uebernahme.code ? [el("p", { class: "code-anzeige", text: uebernahme.code, "data-code": uebernahme.code }),
        el("p", {}, el("a", { class: "knopf", href: "../eulenpfad/index.html", text: "Zum Eulenpfad" }))] : []));
    return karte;
  }

  // Entwickler-Modus (Plan C6, Kern kern/entwicklung.js): freischalten mit dem Entwickler-Schlüssel, dann ein Schalter
  // für die Leiste in den Übungen. Geschrieben wird nur über den Entwickler-Server im lokalen Repo.
  function entwicklungKarte() {
    const E = LST.ENTWICKLUNG;
    const karte = el("section", { class: "einstellungen" });
    if (!E.freigeschaltet()) {
      const s = feld("Entwickler-Schlüssel", { type: "password", name: "entwickler-schluessel", autocomplete: "off" }, "Nur für die Entwicklung der App. Steht in entwickler.key im Repo.");
      karte.append(s, el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf", "data-aktion": "freischalten", text: "Freischalten",
        onclick: async () => { meldung = (await E.freischalten(wert(s, "input"))) ? "Entwickler-Modus freigeschaltet." : "Der Schlüssel stimmt nicht."; zeichne(); } })));
      return karte;
    }
    const z = E.zustand();
    const name = feld("Name für Vermerke", { type: "text", name: "entwickler-name", maxlength: "40", value: z.name || "" }, "Steht bei „angesehen“ und bei Bemerkungen.");
    name.querySelector("input").addEventListener("change", e => E.benenne(e.target.value));
    karte.append(el("label", { class: "einstellung" }, el("span", { text: "Leiste in den Übungen" }),
        el("input", { type: "checkbox", name: "entwickler-an", checked: !!z.an, onchange: e => { E.setzeAn(e.target.checked); meldung = e.target.checked ? "Leiste eingeschaltet." : "Leiste ausgeschaltet."; zeichne(); } })),
      name,
      el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf", text: "Sperren", onclick: () => { E.sperren(); meldung = "Entwickler-Modus gesperrt."; zeichne(); } })),
      el("small", { class: "leise", text: "„Übung angesehen“ und Bemerkungen schreibt der Entwickler-Server (python tools/entwickler_server.py) ins Repo." }));
    return karte;
  }

  const GRENZE = "Grenze: Alles liegt im Browser dieses Geräts. Die PIN schützt vor Versehen und Neugier, nicht vor jemandem, der die Entwicklerwerkzeuge des Browsers öffnet.";
  function zeichne() {
    zeigeFehler("");
    const a = KO.aufsichtAktiv();
    if (a) { wurzel.replaceChildren(...angemeldet(a).filter(Boolean), el("p", { class: "fuss", text: GRENZE })); return; }
    // Der Tab erscheint nur für die Aufsicht; kommt man trotzdem hierher (alte Adresse), der Weg zur Anmeldung
    wurzel.replaceChildren(el("section", { class: "einstellungen konto" },
      el("p", { text: "Eltern und Lehrpersonen sehen hier den Stand verbundener Konten. Melde dich dafür als Aufsicht an (🔑), oder lege mit „Ich bin neu“ eine Aufsicht an." })),
      el("p", { class: "fuss", text: GRENZE }));
  }

  LST_START.verwaltung = box => { wurzel = box; zeichne(); };
})();
