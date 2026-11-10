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
  let teil = null; // Untertab aus der Adresse (#verwaltung/<teil>)
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
  const datumText = iso => KERN.zeit.tagAnzeige(iso) || "–";

  // ---------- angemeldet ----------
  function kontoZeile(a, k) {
    // Übungstage in Ortszeit (KERN.zeit): eine Runde um 00:30 Uhr zählt zu diesem Tag, nicht zum Vortag in UTC
    const grenze = KERN.zeit.vorTagen(TAGE - 1);
    const r = LST.runden(x => x.person === k.id);
    const tage = new Set(r.map(x => KERN.zeit.tag(x.zeit)).filter(t => t && t >= grenze)).size;
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
        el("button", { type: "button", class: "knopf", text: "Verbindung lösen", onclick: () => { KO.loesen(k.id, a.id); meldung = `Verbindung mit ${k.name} gelöst.`; zeichne(); } }),
        el("button", { type: "button", class: "knopf", "data-loeschen": k.id, text: "Konto löschen", onclick: () => { loeschFrage = k.id; zeichne(); } })),
      loeschFrage === k.id ? el("div", { class: "anfrage", "data-loeschfrage": k.id },
        el("p", { text: `${k.name} mit allen Runden und Rekorden löschen? Das gilt auch auf den anderen Geräten des Abgleichs und lässt sich nicht rückgängig machen.` }),
        el("div", { class: "knopf-zeile" },
          el("button", { type: "button", class: "knopf", text: "Zuerst sichern", onclick: () => LST_DATEN.herunterladen(LST_DATEN.sichern([k.id]), LST_DATEN.dateiname(k.name)) }),
          el("button", { type: "button", class: "knopf gefahr", "data-aktion": "loeschen-ja", text: "Ja, löschen", onclick: async () => {
            try { await KO.loeschen(k.id); meldung = `Konto ${k.name} gelöscht.`; } catch (e) { meldung = e.message; }
            loeschFrage = null; LST_START.neu();
          } }),
          el("button", { type: "button", class: "knopf", text: "Abbrechen", onclick: () => { loeschFrage = null; zeichne(); } }))) : null);
  }
  let loeschFrage = null; // Kennung des Kontos, dessen Löschen gerade gefragt wird

  /** Auf diesem Gerät ausblenden (KE1 a, KE2 a): Knopf für eine Person, die die Aufsicht ausblenden darf. */
  const ausblendKnopf = p => (KO.darfAusblenden(p.id) ? el("button", { type: "button", class: "knopf klein", "data-ausblenden": p.id, text: "Auf diesem Gerät ausblenden",
    onclick: () => { KO.ausblenden(p.id); meldung = `${p.name} ist auf diesem Gerät ausgeblendet.`; LST_START.neu(); } }) : null);
  // Ausblenden, Zeigen und Löschen ändern auch den Personen-Knopf in der Leiste: darum LST_START.neu (ganze Seite)

  // Untertabs wie im Eulenpfad (Plan C5), in der Adresse #verwaltung/<id>; ohne Angabe Konten.
  const UNTER = [
    { id: "konten", text: "👥 Konten", zeichne: kontenTeil },
    { id: "freigabe", text: "✓ Freigabe", zeichne: () => [el("h2", { class: "abschnitt", text: "Übungen freigeben" }), freigabeKarte()] },
    { id: "abgleich", text: "🔄 Abgleich", zeichne: () => [el("h2", { class: "abschnitt", text: "Abgleich zwischen Geräten" }), abgleichKarte()] },
    { id: "meldungen", text: "🙋 Meldungen", zeichne: meldungenTeil },
    { id: "einstellungen", text: "⚙️ Einstellungen", zeichne: einstellungenTeil },
    { id: "entwicklung", text: "🛠 Entwicklung", zeichne: () => [el("h2", { class: "abschnitt", text: "Entwicklung" }), entwicklungKarte()] },
  ];
  function angemeldet(a) {
    const unter = UNTER.find(u => u.id === teil) || UNTER[0];
    return [el("section", { class: "einstellungen konto" },
      el("p", { class: "konto-zeile" }, el("b", { text: a.name }), el("span", { class: "leise", text: rolleName(a.art) })),
      el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf", text: "Abmelden", onclick: () => { KO.aufsichtAbmelden(); history.replaceState(null, "", location.pathname); LST_START.neu(); } })),
      meldung ? el("p", { class: "meldung", role: "status", text: meldung }) : null, sichernErinnerung()),
      el("nav", { class: "tabs untertabs", role: "tablist", "aria-label": "Verwaltung" }, UNTER.map(u =>
        el("a", { class: "tab", role: "tab", href: `#verwaltung/${u.id}`, "aria-selected": String(u === unter), text: u.text }))),
      ...unter.zeichne(a)];
  }

  // ---------- Speicher (docs/konzept_gruppen.md 5a, D11 a, Kern 1.34.0) ----------
  const ERINNERUNG_TAGE = 14;
  /** Ohne Abgleich-Ort erinnert die Seite ans Sichern, wenn es Runden gibt und seit 14 Tagen keine Sicherung war. */
  function sichernErinnerung() {
    if (typeof LST_ABGLEICH !== "undefined" && (LST_ABGLEICH.stand() || {}).ordner) return null;
    const runden = LST.lies("runden", []) || [];
    if (!runden.length) return null;
    // Gezählt ab der letzten Sicherung, ohne Sicherung ab der ältesten Runde (erst nach 14 Tagen Übung erinnern)
    const letzte = LST.lies("letzteSicherung", null);
    const seit = letzte || runden.map(r => r && r.zeit).filter(Boolean).sort()[0];
    const tage = seit ? Math.floor((Date.now() - Date.parse(seit)) / 864e5) : 0;
    if (tage < ERINNERUNG_TAGE) return null;
    return el("p", { class: "meldung warnung", role: "status", "data-erinnerung": "sichern",
      text: `${letzte ? `Die letzte Sicherung ist ${tage} Tage alt` : `Seit ${tage} Tagen wird hier geübt und noch nie gesichert`}, und es ist kein Abgleich-Ordner gewählt. `
        + "Bitte unter 👥 Konten → „Sichern und Einlesen“ eine Sicherung anlegen oder unter 🔄 Abgleich einen Ordner wählen. "
        + "Safari löscht die Daten einer Seite, die sieben Tage lang nicht geöffnet wurde." });
  }
  const mb = byte => `${(byte / 1048576).toFixed(byte < 10485760 ? 1 : 0)} MB`;
  /** Belegung und „dauerhaft“ (KERN.speicher.belegung), mit Warnung ab 80 %; gemessen nach dem Zeichnen. */
  function speicherKarte() {
    const ausgabe = el("div", { "data-speicher": "", text: "Wird gemessen …" });
    const karte = el("section", { class: "einstellungen" }, ausgabe);
    KERN.speicher.belegung().then(b => {
      const zeilen = [
        `Kleiner Speicher (localStorage, alle Apps unter dieser Adresse): ${mb(b.lokal.byte)} von 5 MB (${Math.round(b.lokal.anteil * 100)} %)`,
        b.ablage ? `Ablage für Runden, Rekorde und Meldungen (IndexedDB): ${mb(b.ablage.belegt)} belegt, ${mb(b.ablage.verfuegbar)} verfügbar` : "Ablage (IndexedDB): keine Angabe des Browsers",
        LST.SPEICHER.modus() === "idb" ? "Runden und Rekorde liegen in der Ablage." : "Runden und Rekorde liegen im kleinen Speicher (dieser Browser hat keine Ablage).",
        b.dauerhaft === true ? "Der Browser hält die Daten dauerhaft (löscht nicht von selbst)." : "Der Browser darf die Daten bei Platzmangel von selbst löschen.",
      ];
      ausgabe.replaceChildren(...[
        b.warnen ? el("p", { class: "meldung warnung", role: "alert", text: "Der Speicher ist fast voll (über 80 %). Bitte sichern und alte Runden löschen." }) : null,
        ...zeilen.map(t => el("p", { text: t })),
        b.dauerhaft === true ? null : el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf", "data-aktion": "dauerhaft", text: "Browser bitten, nichts von selbst zu löschen",
          onclick: async () => { const ok = await KERN.speicher.dauerhaftBitten(); meldung = ok ? "Der Browser hält die Daten jetzt dauerhaft." : "Der Browser hat abgelehnt oder fragt später; regelmässig sichern bleibt der Schutz."; zeichne(); } })),
      ].filter(Boolean));
    });
    return karte;
  }

  // Meldungen (Plan C11, C11-2 a): die der verbundenen Konten (die Aufsicht kann sie ebenfalls senden, ohne Namen) und die
  // eigenen, gespeichert beim Ansehen und Prüfen einer Übung. Ansicht und Senden: LST_START.meldungenKarte (statistik.js).
  function meldungenTeil(a) {
    const verbunden = KO.verbundene(a.id);
    const ihre = verbunden.flatMap(k => LST.meldungenVon(k.id));
    const eigene = LST.meldungenVon(a.id);
    return [
      el("h2", { class: "abschnitt", text: "Meldungen verbundener Konten" }),
      verbunden.length ? LST_START.meldungenKarte(ihre, { ich: a.name, loeschen: false, mitPerson: true, neu: zeichne })
        : el("p", { class: "leise", text: "Noch kein Konto verbunden." }),
      el("h2", { class: "abschnitt", text: "Eigene Meldungen" }),
      LST_START.meldungenKarte(eigene, { ich: a.name, loeschen: true, neu: zeichne }),
      // Korrekturvorschläge aus der Prüfansicht (✏️, Plan C11 Schritt 4): von allen Aufsichten dieses Geräts
      el("h2", { class: "abschnitt", text: "Korrekturen an Inhaltslisten" }),
      LST_START.meldungenKarte(LST.MELDUNGEN.korrekturen(), { ich: a.name, loeschen: true, neu: zeichne,
        einleitung: "Mit ✏️ in der Prüfansicht einer Liste gespeichert (Freigabe → 🔍 prüfen). Senden geht ohne Namen an die Entwicklung; die Antwort kommt mit „Antworten abfragen“." }),
    ];
  }

  function kontenTeil(a) {
    const verbunden = KO.verbundene(a.id);
    const offen = KO.angefragt(a.id);
    const andere = KO.alleGezeigt().filter(k => !verbunden.some(v => v.id === k.id) && !offen.some(v => v.id === k.id));
    const teile = [];
    teile.push(el("h2", { class: "abschnitt", text: "Verbundene Konten" }),
      verbunden.length ? el("ul", { class: "stand-liste" }, verbunden.map(k => kontoZeile(a, k))) : el("p", { class: "leise", text: "Noch kein Konto verbunden." }));
    if (offen.length) teile.push(el("p", { class: "leise", text: `Wartet auf Zustimmung: ${offen.map(k => k.name).join(", ")}` }));

    if (andere.length) teile.push(el("h2", { class: "abschnitt", text: "Mitlesen anfragen" }), el("section", { class: "einstellungen" },
      el("p", { text: "Der Jugendliche sieht die Anfrage nach dem Anmelden und stimmt zu oder lehnt ab." }),
      el("ul", { class: "stand-liste" }, andere.map(k => el("li", {}, el("b", { text: k.name }), el("div", { class: "knopf-zeile" },
        el("button", { type: "button", class: "knopf", "data-anfrage": k.id, text: `${k.name} anfragen`,
          onclick: () => { KO.anfragen(k.id); meldung = `Anfrage an ${k.name} gestellt.`; zeichne(); } }),
        ausblendKnopf(k))))),
      el("small", { class: "leise", text: "Ein Konto, das nicht mit Ihnen verbunden ist, können Sie nicht löschen — nur auf diesem Gerät ausblenden. Es bleibt in den Daten und erscheint auf den anderen Geräten weiter." })));

    // Andere Aufsichten des Geräts; eine gesperrte (kam über den Abgleich, OA1 a) lässt sich ausblenden (KE1 a)
    const aufsichten = KO.aufsichtenGezeigt().filter(x => x.id !== a.id);
    if (aufsichten.length) teile.push(el("h2", { class: "abschnitt", text: "Andere Aufsichten" }), el("section", { class: "einstellungen" },
      el("ul", { class: "stand-liste" }, aufsichten.map(x => el("li", { "data-aufsicht": x.id },
        el("b", { text: x.name }), el("span", { class: "leise", text: ` ${rolleName(x.art)}${KO.gesperrt(x.id) ? " · 🔒 gesperrt, von einem anderen Gerät" : ""}` }),
        ausblendKnopf(x) ? el("div", { class: "knopf-zeile" }, ausblendKnopf(x)) : null))),
      el("small", { class: "leise", text: "Eine gesperrte Aufsicht ist auf ihrem eigenen Gerät echt. Ausblenden nimmt sie nur hier von der Anmeldung; auf den anderen Geräten bleibt sie, wie sie ist." })));

    const weg = KO.ausgeblendete();
    if (weg.length) teile.push(el("h2", { class: "abschnitt", text: "Ausgeblendet auf diesem Gerät" }), el("section", { class: "einstellungen" },
      el("ul", { class: "stand-liste" }, weg.map(x => el("li", { "data-ausgeblendet": x.id },
        el("b", { text: x.name }), el("span", { class: "leise", text: x.rolle === "aufsicht" ? ` Aufsicht · ${rolleName(x.art)}` : " Konto" }),
        el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf klein", "data-zeigen": x.id, text: "Wieder zeigen",
          onclick: () => { KO.zeigen(x.id); meldung = `${x.name} wird wieder gezeigt.`; LST_START.neu(); } })))))));

    const name = feld("Vorname", { type: "text", maxlength: "40", name: "vorname" });
    const geboren = feld("Geburtsdatum", { type: "date", name: "geboren", max: KERN.zeit.tag() });
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
    teile.push(el("h2", { class: "abschnitt", text: "In den Eulenpfad übernehmen" }), uebernahmeKarte(a));
    return teile;
  }

  function einstellungenTeil() {
    const e = LST.lies("einstellungen", {});
    const setze = (f, w) => { KO.setzeGeraeteEinstellung(f, w); meldung = "Einstellung gespeichert."; zeichne(); };
    return [el("h2", { class: "abschnitt", text: "Einstellungen für dieses Gerät" }), el("section", { class: "einstellungen" },
      auswahl("Taschenrechner", [
        { id: "uebung", name: "wie die Übung es vorsieht" }, { id: "ohne", name: "überall gesperrt" }, { id: "erlaubt", name: "überall erlaubt" },
      ], e.rechner || "uebung", w => setze("rechner", w), { name: "rechner" }),
      auswahl("Dezimalzeichen", [{ id: "punkt", name: "Punkt (3.5)" }, { id: "komma", name: "Komma (3,5)" }], e.dezimal || "punkt", w => setze("dezimal", w), { name: "dezimal" }),
      auswahl("Gast", [{ id: "an", name: "erlaubt (nichts wird gespeichert)" }, { id: "aus", name: "abgeschaltet" }], e.gast || "an", w => setze("gast", w), { name: "gast" }),
      el("small", { class: "leise", text: "Gilt für alle Konten auf diesem Gerät. Die Jugendlichen sehen die Einstellung in jeder Übung." })),
      el("h2", { class: "abschnitt", text: "Meldungen an die Entwicklung" }), meldewegKarte(),
      el("h2", { class: "abschnitt", text: "Speicher dieses Geräts" }), speicherKarte(),
      // Impressum und Datenschutz (Plan C12, IM1 a)
      el("p", { class: "leise" }, el("a", { href: "../portal/impressum.html", text: "Impressum und Datenschutz" }),
        document.createTextNode(" — wer dahintersteht und wann Daten das Gerät verlassen."))];
  }

  // Weg der Meldungen und Adresse des Entwickler-Servers (Plan C11, C11-3 a; KERN.meldungen.meldeweg): nur auf diesem
  // Gerät; erlaubt ist ein Entwickler-Server auf diesem Gerät (localhost, 127.0.0.1) oder ein Meldungsserver im Netz über
  // https, angenommen nur mit der Unterschrift der Entwicklung (Plan C12, NS1 a, NS2 a).
  function meldewegKarte() {
    const M = LST.MELDUNGEN, w = M.meldeweg();
    const hinweis = el("p", { class: "meldung", role: "status" });
    const setze = daten => { try { M.setzeMeldeweg(daten); meldung = "Einstellung gespeichert."; } catch (e) { meldung = e.message; } zeichne(); };
    const adresse = feld("Adresse des Entwickler-Servers", { type: "text", name: "server-adresse", value: w.eigeneAdresse ? w.server : "",
      placeholder: `Vorgabe: ${w.vorgabe || "diese Seite"}`, autocomplete: "off" }, KERN.entwicklung.ADRESSE_REGEL);
    return el("section", { class: "einstellungen" },
      auswahl("Weg", [
        { id: "auto", name: "automatisch (Server, E-Mail, Text)" }, { id: "server", name: "nur Entwickler-Server" },
        { id: "mail", name: "nur E-Mail" }, { id: "text", name: "nur Text kopieren" },
      ], w.weg, v => setze({ weg: v, server: w.eigeneAdresse ? w.server : null }), { name: "meldeweg" }),
      adresse,
      el("div", { class: "knopf-zeile" },
        el("button", { type: "button", class: "knopf", "data-aktion": "adresse-speichern", text: "Adresse speichern", onclick: () => setze({ weg: w.weg, server: wert(adresse, "input") }) }),
        el("button", { type: "button", class: "knopf", text: "↺ Vorgabe", onclick: () => setze({ weg: w.weg, server: null }) }),
        // Prüft die Adresse im Feld (was „Adresse speichern“ speichern würde) und nennt sie (Rückmeldung Patrik LERN_Session27)
        el("button", { type: "button", class: "knopf", "data-aktion": "server-pruefen", text: "Verbindung prüfen", onclick: async () => {
          hinweis.textContent = "Prüfe …";
          const p = await LST.ENTWICKLUNG.verbindungPruefen(wert(adresse, "input"));
          hinweis.textContent = p.text + (!p.ungueltig && p.adresse !== M.meldeweg().server ? " Die Adresse ist noch nicht gespeichert." : "");
        } })),
      hinweis,
      el("small", { class: "leise", text: `Automatisch: zuerst der Entwickler-Server, sonst E-Mail aus dem eigenen Mailprogramm, sonst Text zum Kopieren. E-Mail an: ${M.adresse() || "noch keine Adresse eingetragen (lernsteig/kontakt.js)"}. Gilt für alle Konten auf diesem Gerät; Meldungen tragen keinen Namen.` }));
  }

  // Freigabe je Gerät (Plan C5; Kern KERN.freigabe, docs/kern/rahmen.md 4.8), wie im Eulenpfad: Frei ist, was nichts mehr
  // zu prüfen hat (Prüfstand im Repo, FG1 a); die Aufsicht setzt es je Übung und Inhaltsliste anders. Mit Abgleich gilt
  // die Freigabe für alle Geräte (die jüngste gewinnt). Je Fach eine zuklappbare Gruppe; welche offen sind, merkt sich
  // das Gerät (lernsteig:verwaltungOffen, nicht abgeglichen).
  function freigabeKarte() {
    const F = LST.FREIGABE, E = LST.ENTWICKLUNG;
    const dev = E.aktiv();
    const eigen = F.geraet();
    const neuMit = text => { meldung = text; zeichne(); };
    const stand = (g, offenText) => g
      ? el("span", { class: "marke ok", text: `✓ ${g.am}${g.von ? " · " + g.von : ""}` })
      : el("span", { class: "marke gesperrt", text: offenText });
    /** Schalter frei/gesperrt, dazu „wie Prüfstand“, wenn das Gerät einen eigenen Eintrag hat. */
    const schalter = (frei, hatEigen, setze, name, attr) => el("div", { class: "knopf-zeile schalter-zeile" },
      el("button", Object.assign({ type: "button", class: "schalter " + (frei ? "frei" : "gesperrt"), text: frei ? "✓ frei" : "🔒 gesperrt",
        "aria-label": `${name}: ${frei ? "frei, sperren" : "gesperrt, freigeben"}`,
        onclick: () => { setze(!frei); neuMit(`${name} ${frei ? "gesperrt" : "freigegeben"}.`); } }, attr)),
      hatEigen ? el("button", { type: "button", class: "schalter", text: "↺ wie Prüfstand", title: "Eigene Einstellung entfernen",
        onclick: () => { setze(null); neuMit(`${name}: wieder nach Prüfstand.`); } }) : null);
    const zeilen = u => {
      const g = F.geprueft(u.id);
      const z = [el("tr", { "data-uebung": u.id },
        el("td", {}, el("b", { text: u.titel }), el("small", { class: "leise block", text: u.thema })),
        el("td", {}, u.neu || g ? stand(g, "nicht angesehen") : el("span", { class: "leise", text: "nichts zu prüfen" }),
          dev ? el("button", { type: "button", class: "schalter", text: g ? "aufheben" : "✓ angesehen",
            onclick: async () => { if (await E.setzeGeprueft("uebungen", u.id, !g)) zeichne(); } }) : null),
        el("td", {}, schalter(F.frei(u.id), u.id in eigen.uebungen, w => F.setzeFrei(u.id, w), u.titel, { "data-freigabe": u.id })))];
      for (const l of F.listen(u.id)) z.push(el("tr", { class: "liste-zeile", "data-liste": `${u.id}/${l.id}` },
        el("td", {}, `↳ ${l.name}`),
        // Prüfansicht je Eintrag auf der Seite der Übung (LK1 a): nur für eigene Listen, nicht für Verweise (von)
        el("td", {}, stand(l.geprueft, "ungeprüft"), l.von ? null : el("a", { class: "schalter", href: `uebungen/${u.id}/index.html?pruefen=${l.id}`, "data-pruefen": `${u.id}/${l.id}`, text: "🔍 prüfen" })),
        el("td", {}, l.von
          ? el("span", { class: "leise", text: `${F.listeFrei(u.id, l.id) ? "✓ frei" : "🔒 gesperrt"} — wie bei ${(KAT.uebung(l.von.split("/")[0]) || {}).titel || l.von}` })
          : schalter(F.listeFrei(u.id, l.id), l.quelle in eigen.listen, w => F.setzeListeFrei(u.id, l.id, w), `${u.titel}, ${l.name}`, { "data-freigabe": `${u.id}/${l.id}` }))));
      return z;
    };
    const tabelle = uebungen => el("div", { class: "tabelle-rahmen" }, el("table", { class: "freigabe-tabelle" },
      el("thead", {}, el("tr", {}, ["Übung / Liste", "Prüfstand", "für Jugendliche"].map(t => el("th", { text: t })))),
      el("tbody", {}, uebungen.flatMap(zeilen))));
    const offen = new Set(LST.lies("verwaltungOffen", []));
    const gruppen = KAT.FAECHER.map(f => {
      const uebungen = KAT.UEBUNGEN.filter(u => u.fach === f.id);
      if (!uebungen.length) return null;
      const frei = uebungen.filter(u => F.fuerLernendeSichtbar(u.id)).length;
      const zuPruefen = uebungen.filter(u => F.zuPruefen(u.id) || F.listen(u.id).some(l => !l.von && !l.geprueft)).length;
      const gruppe = el("details", { class: "freigabe-gruppe", "data-fach": f.id },
        el("summary", {}, el("span", { text: f.name }),
          el("span", { class: "leise", text: ` ${frei} von ${uebungen.length} frei${zuPruefen ? ` · ${zuPruefen} zu prüfen` : ""}` })),
        tabelle(uebungen));
      gruppe.open = offen.has(f.id);
      gruppe.addEventListener("toggle", () => { gruppe.open ? offen.add(f.id) : offen.delete(f.id); LST.schreibe("verwaltungOffen", [...offen]); });
      return gruppe;
    }).filter(Boolean);
    /** Alle Übungen und ihre eigenen Listen auf einmal setzen (Verweise gelten über ihre Quelle). */
    const alle = (wert, text) => {
      for (const u of KAT.UEBUNGEN) {
        F.setzeFrei(u.id, wert);
        for (const l of F.listen(u.id)) if (!l.von) F.setzeListeFrei(u.id, l.id, wert);
      }
      neuMit(text);
    };
    const sichtbar = KAT.UEBUNGEN.filter(u => F.fuerLernendeSichtbar(u.id)).length;
    return el("section", { class: "einstellungen" },
      el("p", { "data-sichtbar": String(sichtbar), text: `Jugendliche sehen ${sichtbar} von ${KAT.UEBUNGEN.length} Übungen. Frei ist, was nichts mehr zu prüfen hat: Neue Übungen sind gesperrt, bis sie angesehen sind, Inhaltslisten, bis sie geprüft sind (Prüfstand im Repo, gesetzt im Entwickler-Modus). Hier lässt sich das für dieses Gerät anders setzen; mit Abgleich gilt es für alle Geräte. Eine Übung mit Inhaltslisten braucht mindestens eine freie Liste.` }),
      el("div", { class: "knopf-zeile" },
        el("button", { type: "button", class: "knopf", "data-aktion": "alles-frei", text: "✓ Alles freigeben", onclick: () => alle(true, "Alle Übungen freigegeben.") }),
        el("button", { type: "button", class: "knopf", "data-aktion": "alles-gesperrt", text: "🔒 Alles sperren", onclick: () => alle(false, "Alle Übungen gesperrt.") }),
        el("button", { type: "button", class: "knopf", "data-aktion": "alles-pruefstand", text: "↺ Alles wie Prüfstand", onclick: () => alle(null, "Alles wieder nach Prüfstand.") })),
      ...gruppen,
      el("small", { class: "leise", text: "Sie sehen als Aufsicht jede Übung, auch gesperrte — zum Ansehen und Prüfen." }));
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
      el("p", { text: "Üben Jugendliche auf mehreren Geräten, wählt man auf jedem denselben Ordner — einen Netzwerkordner oder den Ordner eines Cloud-Dienstes. Jedes Gerät schreibt dort seine eigene Datei und liest die der anderen: Konten, Aufsichten, Runden, Rekorde und die Freigabe der Übungen. PIN, Code und Verbindungen bleiben auf dem Gerät." }),
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
      const s = feld("Entwickler-Schlüssel", { type: "password", name: "entwickler-schluessel", autocomplete: "off" }, "Schlüssel der Entwicklung (entwickler.key) oder Ihr persönlicher Schlüssel als zugelassene Aufsicht.");
      // Anforderung per E-Mail (Plan C12, ES4 a): Vorlage an die Adresse der Entwicklung
      const mail = E.anforderungLink(LST.MELDUNGEN.adresse(), { name: (KO.aufsichtAktiv() || {}).name || "", titel: "Lernsteig" });
      karte.append(s, el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf", "data-aktion": "freischalten", text: "Freischalten",
        onclick: async () => {
          const r = await E.freischalten(wert(s, "input"));
          meldung = r ? "Entwickler-Modus freigeschaltet." : r === null ? "Ohne Entwickler-Server lässt sich ein persönlicher Schlüssel nicht prüfen." : "Der Schlüssel stimmt nicht.";
          zeichne();
        } }),
        mail ? el("a", { class: "knopf", href: mail, "data-aktion": "entwicklermodus-anfordern", text: "✉️ Entwicklermodus anfordern" }) : null),
        el("small", { class: "leise", text: "Noch kein Schlüssel? „Entwicklermodus anfordern“ öffnet Ihr Mailprogramm mit einer Vorlage; der persönliche Schlüssel kommt an Ihre Absenderadresse." }));
      return karte;
    }
    if (E.rolle() === "aufsicht") karte.append(el("p", { "data-rolle": "aufsicht", text: `Freigeschaltet als zugelassene Aufsicht: ${E.zustand().name}. Was Sie als angesehen oder geprüft markieren, wird eingereicht und wirkt, sobald die Entwicklung es übernimmt.` }));
    const z = E.zustand();
    const name = feld("Name für Vermerke", { type: "text", name: "entwickler-name", maxlength: "40", value: z.name || "" }, "Steht bei „angesehen“ und bei Bemerkungen.");
    name.querySelector("input").addEventListener("change", e => E.benenne(e.target.value));
    karte.append(el("label", { class: "einstellung" }, el("span", { text: "Leiste in den Übungen" }),
        el("input", { type: "checkbox", name: "entwickler-an", checked: !!z.an, onchange: e => { E.setzeAn(e.target.checked); meldung = e.target.checked ? "Leiste eingeschaltet." : "Leiste ausgeschaltet."; zeichne(); } })),
      E.rolle() === "aufsicht" ? null : name, // eine zugelassene Aufsicht steht unter dem Namen ihrer Zulassung (ES2 a)
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

  LST_START.verwaltung = (box, unter) => { wurzel = box; teil = unter || null; zeichne(); };
})();
