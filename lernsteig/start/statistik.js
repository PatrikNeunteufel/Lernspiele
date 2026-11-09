/* Tabs Statistik und Erfolge des Lernsteigs (Plan C2, BF1 a). Statistik: Überblick, letzte Runden, Sichern und Einlesen
   als Datei (LST_DATEN, nur auf Knopfdruck). Erfolge: Wochenziel mit Serie über Tage, Kompetenzstand je Übung und
   Lehrplan-Stufe, Rekorde — keine Sterne. Gilt für das angemeldete Konto; der Gast hat keinen Stand (C2 a). Mit
   #statistik/<Konto> bzw. #erfolge/<Konto> für die angemeldete Aufsicht, wenn das Konto mit ihr verbunden ist (AU1 a);
   dann ohne Einlesen. Testrunden der Aufsicht zählen nicht. */
"use strict";

var LST_START = typeof LST_START === "object" ? LST_START : {};

(function () {
  const KAT = LST_KATALOG;
  const el = LST.el;
  const TAGE = 14;
  let meldung = "";

  // Tage in Ortszeit (KERN.zeit), wie das Wochenziel: eine Runde um 00:30 Uhr gehört zu diesem Tag
  const tag = iso => KERN.zeit.tag(iso || NaN);
  const datumText = iso => KERN.zeit.tagAnzeige(iso);
  const prozent = (a, b) => (b ? `${Math.round(100 * a / b)} %` : "–");

  function kachel(wert, titel) { return el("div", { class: "kachel" }, el("b", { text: String(wert) }), el("small", { text: titel })); }

  function ueberblick(r) {
    const aufgaben = r.reduce((s, x) => s + (x.aufgaben || 0), 0);
    const anhieb = r.reduce((s, x) => s + (x.aufAnhieb || 0), 0);
    const grenze = KERN.zeit.vorTagen(TAGE - 1);
    const tage = new Set(r.map(x => tag(x.zeit)).filter(t => t && t >= grenze)).size;
    return el("div", { class: "kacheln" },
      kachel(r.length, "Runden"), kachel(aufgaben, "Aufgaben"), kachel(prozent(anhieb, aufgaben), "auf Anhieb"),
      kachel(`${tage} von ${TAGE}`, "Übungstage zuletzt"));
  }

  function standJeUebung(k, r) {
    const gespielt = new Set(r.map(x => x.inhalt));
    const liste = KAT.UEBUNGEN.filter(u => gespielt.has(u.id));
    if (!liste.length) return el("p", { class: "leise", text: "Noch keine Übung gespielt." });
    return el("ul", { class: "stand-liste" }, liste.map(u => el("li", { "data-uebung": u.id },
      el("a", { href: `uebungen/${u.id}/index.html`, text: u.titel }),
      el("small", { class: "leise", text: ` ${u.kompetenz}` }),
      el("div", { class: "stufen-stand" }, u.stufen.map(s => el("span", { class: "stufe-stand" }, `Stufe ${s} `, LST.standMarke(LST.kompetenzstand(k.id, u.id, s))))))));
  }

  function letzteRunden(r) {
    if (!r.length) return el("p", { class: "leise", text: "Noch keine Runde." });
    const titel = id => (KAT.UEBUNGEN.find(u => u.id === id) || {}).titel || id;
    return el("table", { class: "runden-tabelle" },
      el("thead", {}, el("tr", {}, ["Datum", "Übung", "Stufe", "Aufgaben", "auf Anhieb", "Dauer"].map(t => el("th", { text: t })))),
      el("tbody", {}, r.slice(-10).reverse().map(x => el("tr", {},
        el("td", { text: datumText(x.zeit) }), el("td", { text: titel(x.inhalt) + (x.mitRechner ? " (Rechner)" : "") }),
        el("td", { text: x.stufe === "challenge" ? "Challenge" : String(x.stufe) }), el("td", { text: String(x.aufgaben || 0) + (x.endlos ? " Serie" : "") }),
        el("td", { text: String(x.aufAnhieb || 0) }), el("td", { text: LST.dauerText(x.dauer || 0) })))));
  }

  // Wochenziel (BF1 a): selbst gesetzt; die Aufsicht sieht es, ändert es nicht
  function zielKarte(k, nurLesen) {
    const s = LST.serie(k);
    const werte = [{ id: "0", name: "kein Ziel" }].concat([1, 2, 3, 4, 5, 6, 7].map(n => ({ id: String(n), name: `${n} ${n === 1 ? "Tag" : "Tage"} je Woche` })));
    return el("section", { class: "einstellungen" },
      nurLesen ? null : el("label", { class: "einstellung" }, el("span", { text: "Mein Wochenziel" }),
        el("select", { name: "wochenziel", "aria-label": "Mein Wochenziel", onchange: e => { const n = LST.konto(); n.wochenziel = Number(e.target.value) || null; LST.speichereKonto(n); zeichne(); } },
          werte.map(w => el("option", { value: w.id, text: w.name, selected: w.id === String(k.wochenziel || 0) })))),
      el("p", { class: "serie", text: s ? LST.serieText(s) : nurLesen ? "Kein Wochenziel gesetzt." : "Setz dir ein Ziel, an wie vielen Tagen je Woche du übst. Ein Übungstag ist ein Tag mit mindestens einer Runde." }));
  }

  function datenKarte(k) {
    const datei = el("input", { type: "file", accept: "application/json,.json", hidden: true, "aria-label": "Sicherung wählen",
      onchange: async e => {
        const f = e.target.files[0];
        if (!f) return;
        try {
          const erg = LST_DATEN.einlesen(JSON.parse(await f.text()));
          meldung = `Eingelesen: ${erg.runden} Runden, ${erg.rekorde} Rekorde, ${erg.konten} Konten neu oder ergänzt.`;
        } catch (err) { meldung = err instanceof SyntaxError ? "Die Datei ist kein lesbares JSON." : err.message; }
        zeichne();
      } });
    return el("section", { class: "einstellungen" },
      el("p", { text: "Sichere deinen Stand als Datei, etwa für ein anderes Gerät oder für deine Lehrperson. PIN und Code kommen nicht in die Datei." }),
      el("div", { class: "knopf-zeile" },
        el("button", { type: "button", class: "knopf haupt", text: "Sichern", onclick: () => LST_DATEN.herunterladen(LST_DATEN.sichern([k.id]), LST_DATEN.dateiname(k.id === "gast" ? "gast" : k.name)) }),
        el("button", { type: "button", class: "knopf", text: "Einlesen", onclick: () => datei.click() }), datei),
      el("small", { class: "leise", text: "Einlesen führt zusammen: Was schon da ist, bleibt; gleiche Runden zählen einmal." }),
      meldung ? el("p", { class: "meldung", role: "status", text: meldung }) : null);
  }

  // Rekorde (BF1 a): je Übung und Stufe die längste Serie, getrennt mit und ohne Rechner
  function rekordKarte(k) {
    const titel = id => (KAT.UEBUNGEN.find(u => u.id === id) || {}).titel || id;
    const beste = new Map();
    for (const r of LST.lies("rekorde", []).filter(x => x.person === k.id && !x.test)) {
      const s = `${r.inhalt}|${r.stufe}|${r.mitRechner ? 1 : 0}`;
      if (!beste.has(s) || r.punkte > beste.get(s).punkte) beste.set(s, r);
    }
    if (!beste.size) return el("p", { class: "leise", text: "Noch keine Serie. In jeder Übung lässt sich eine Stufe als Serie spielen: Aufgaben, bis eine falsch ist." });
    return el("ul", { class: "stand-liste" }, [...beste.values()].sort((a, b) => b.punkte - a.punkte).map(r => el("li", {},
      el("b", { text: `${r.punkte} richtig in Folge` }), ` · ${titel(r.inhalt)}, Stufe ${r.stufe === "challenge" ? "Challenge" : r.stufe}${r.mitRechner ? " (Rechner)" : ""}`,
      el("small", { class: "leise", text: ` · ${datumText(r.zeit)}` }))));
  }

  // ---------- Meldungen (Plan C11, C11-2 a) ----------
  // Gespeichert in der Übung („Fehler melden“), gesendet von hier: von der Person selbst oder von einer verbundenen
  // Aufsicht (Verwaltung → Meldungen) — über den Entwickler-Server, per E-Mail aus dem eigenen Mailprogramm oder als Text,
  // immer ohne Namen. Die Antwort holt „Antworten abfragen“ (lernsteig/meldungen-stand.json, Bemerkungen).
  const M = () => LST.MELDUNGEN;
  /**
   * Liste von Meldungen mit Senden, Löschen und Antworten. opt: { ich (Name für den Verlauf), loeschen (eigene, noch nicht
   * gesendete dürfen weg), ungelesen (Kennungen, die hervorgehoben werden), neu() (neu zeichnen), mitPerson (Name zeigen) }.
   */
  function meldungenKarte(liste, opt) {
    const titel = id => (KAT.uebung(id) || {}).titel || id;
    const status = m => (LST.MELDUNG_STATUS[m.status] || { text: m.status }).text;
    const hinweis = el("p", { class: "meldung", role: "status" });
    async function senden(m) {
      const weg = await M().weitergeben(m, {
        von: opt.ich,
        bestaetigen: () => confirm("Das Mailprogramm öffnet sich mit der Meldung — ohne Namen. Bitte ansehen und senden."),
        oeffne: url => { location.href = url; },
        kopiere: async text => { try { await navigator.clipboard.writeText(text); } catch (e) { prompt("Diesen Text an die Entwicklung schicken:", text); } },
      });
      if (weg) { opt.neu(); }
    }
    const eintrag = m => {
      const zeilen = [["Art", LST.MELDUNG_ARTEN[m.art] || m.art], ["Aufgabe", m.aufgabe], ["Erwartete Lösung", m.loesung], ["Eingaben", m.eingabe],
        ["Gewertet", m.ergebnis], ["Begründung", m.text], ["Antwort", m.antwort]].filter(([, w]) => w);
      const knoepfe = [];
      if (m.status === "neu") {
        knoepfe.push(el("button", { type: "button", class: "knopf haupt", "data-aktion": "meldung-senden", text: "Senden", onclick: () => senden(m) }));
        if (opt.loeschen) knoepfe.push(el("button", { type: "button", class: "knopf", "data-aktion": "meldung-loeschen", text: "Löschen", onclick: () => { M().entferne(m.id); opt.neu(); } }));
      }
      knoepfe.push(el("button", { type: "button", class: "knopf", text: "Text kopieren", onclick: async () => {
        try { await navigator.clipboard.writeText(M().alsText(m)); hinweis.textContent = "Kopiert."; } catch (e) { prompt("Text:", M().alsText(m)); }
      } }));
      return el("details", { class: `meldung-eintrag status-${m.status}${(opt.ungelesen || []).includes(m.id) ? " ungelesen" : ""}`, "data-meldung": m.id,
        ...(m.status === "neu" || (opt.ungelesen || []).includes(m.id) ? { open: "" } : {}) },
        el("summary", {}, el("b", { text: `${opt.mitPerson ? `${m.name} · ` : ""}${titel(m.uebung)} · Stufe ${m.stufe === "challenge" ? "Challenge" : m.stufe}` }),
          el("span", { class: "leise", text: ` · ${datumText(m.zeit)} · ${status(m)}` })),
        el("dl", {}, ...zeilen.flatMap(([k, w]) => [el("dt", { text: k }), el("dd", { text: w })])),
        el("div", { class: "knopf-zeile" }, ...knoepfe));
    };
    const offen = liste.filter(m => m.status === "neu").length;
    return el("section", { class: "einstellungen meldungen" },
      el("p", { class: "leise", text: "Mit „Fehler melden“ in einer Übung gespeichert. Senden geht ohne Namen an die Entwicklung; die Antwort kommt mit „Antworten abfragen“." }),
      el("div", { class: "knopf-zeile" }, el("button", { type: "button", class: "knopf", "data-aktion": "meldungen-abfragen", text: "Antworten abfragen", onclick: async () => {
        const n = await M().abfragen();
        opt.neu();
        setTimeout(() => alert(n ? `${n} Antwort${n === 1 ? "" : "en"} der Entwicklung übernommen.` : "Keine neuen Antworten der Entwicklung."), 0);
      } })),
      hinweis,
      liste.length ? el("div", {}, [...liste].sort((a, b) => (a.zeit < b.zeit ? 1 : -1)).map(eintrag)) : el("p", { class: "leise", text: "Noch keine Meldung." }),
      liste.length ? el("small", { class: "leise", text: `${offen} noch nicht gesendet, ${liste.length - offen} gesendet oder beantwortet.` }) : null);
  }
  LST_START.meldungenKarte = meldungenKarte;

  // Konto des Tabs: das eigene, oder für die Aufsicht ein verbundenes (#statistik/<Konto>)
  function kontoDerSeite(kontoId) {
    const a = LST_KONTEN.aufsichtAktiv();
    if (!kontoId) return { k: a ? null : LST.konto(), aufsicht: a };
    const k = a && LST_KONTEN.verbundene(a.id).find(x => x.id === kontoId);
    return { k: k || null, aufsicht: a };
  }
  /** Für Gast und Aufsicht ohne gewähltes Konto: ein Hinweis statt eines Stands. */
  function ohneStand(wurzel, aufsicht) {
    if (LST.werUebt() === "gast") {
      wurzel.replaceChildren(el("p", { class: "meldung", text: "Als Gast wird nichts gespeichert, darum gibt es hier keinen Stand. Melde dich an, damit der Lernsteig deinen Stand kennt." }));
      return true;
    }
    if (aufsicht) {
      const verbunden = LST_KONTEN.verbundene(aufsicht.id);
      wurzel.replaceChildren(el("p", { class: "meldung", text: verbunden.length ? "Wählen Sie ein verbundenes Konto:" : "Noch kein Konto mit Ihnen verbunden. Verbinden in der Verwaltung." }),
        el("div", { class: "konto-liste" }, verbunden.map(k => el("a", { class: "knopf", href: `#statistik/${encodeURIComponent(k.id)}`, text: k.name }))));
      return true;
    }
    return false;
  }

  /** Tab Statistik (Plan C2): Überblick, letzte Runden, Sichern und Einlesen; für die Aufsicht ein verbundenes Konto. */
  function statistik(wurzel, kontoId) {
    const { k, aufsicht } = kontoDerSeite(kontoId ? decodeURIComponent(kontoId) : null);
    if (!k && ohneStand(wurzel, aufsicht && !kontoId ? aufsicht : null)) return;
    if (!k) { wurzel.replaceChildren(el("p", { class: "meldung", text: "Dieses Konto ist nicht mit der angemeldeten Aufsicht verbunden." }), el("a", { class: "knopf", href: "#verwaltung", text: "Zur Verwaltung" })); return; }
    if (LST.werUebt() === "gast") { ohneStand(wurzel, null); return; }
    const r = LST.runden(x => x.person === k.id && !x.test);
    neuZeichnen = () => statistik(wurzel, kontoId);
    // Meldungen: neue Antworten hervorheben und für die Person selbst als gesehen merken (die Aufsicht liest nur mit)
    const meldungen = LST.meldungenVon(k.id);
    const ungelesen = LST.ungeleseneMeldungen(k.id).map(m => m.id);
    if (!aufsicht) LST.meldungenGelesen(k.id);
    const ich = aufsicht ? aufsicht.name : k.name;
    wurzel.replaceChildren(...[
      el("p", { class: "konto-zeile" }, el("b", { text: k.name }),
        el("span", { class: "leise", text: aufsicht ? `Ansicht der Aufsicht ${aufsicht.name}` : "angemeldet" })),
      el("h2", { class: "abschnitt", text: "Überblick" }), ueberblick(r),
      el("h2", { class: "abschnitt", text: "Letzte Runden" }), letzteRunden(r),
      meldungen.length ? el("h2", { class: "abschnitt", id: "meldungen", text: "Meldungen" }) : null,
      meldungen.length ? meldungenKarte(meldungen, { ich, loeschen: !aufsicht, ungelesen, neu: zeichne }) : null,
      aufsicht ? el("p", { class: "knopf-zeile" }, el("a", { class: "knopf", href: `#erfolge/${encodeURIComponent(k.id)}`, text: "Erfolge" }), el("a", { class: "knopf", href: "#verwaltung", text: "← Zur Verwaltung" }))
        : el("h2", { class: "abschnitt", text: "Sichern und Einlesen" }),
      aufsicht ? null : datenKarte(k)].filter(Boolean));
  }

  /** Tab Erfolge (Plan C2, BF1 a): Wochenziel mit Serie über Tage, Kompetenzstand je Übung, Rekorde — keine Sterne. */
  function erfolge(wurzel, kontoId) {
    const { k, aufsicht } = kontoDerSeite(kontoId ? decodeURIComponent(kontoId) : null);
    if (!k && ohneStand(wurzel, aufsicht && !kontoId ? aufsicht : null)) return;
    if (!k) { wurzel.replaceChildren(el("p", { class: "meldung", text: "Dieses Konto ist nicht mit der angemeldeten Aufsicht verbunden." })); return; }
    if (LST.werUebt() === "gast") { ohneStand(wurzel, null); return; }
    const r = LST.runden(x => x.person === k.id && !x.test);
    neuZeichnen = () => erfolge(wurzel, kontoId);
    wurzel.replaceChildren(...[
      aufsicht ? el("p", { class: "konto-zeile" }, el("b", { text: k.name }), el("span", { class: "leise", text: `Ansicht der Aufsicht ${aufsicht.name}` })) : null,
      el("h2", { class: "abschnitt", text: "Wochenziel" }), zielKarte(k, !!aufsicht),
      el("h2", { class: "abschnitt", text: "Stand je Übung" }), standJeUebung(k, r),
      el("h2", { class: "abschnitt", text: "Rekorde" }), rekordKarte(k)].filter(Boolean));
  }

  // Neu zeichnen nach einer Änderung (Wochenziel, Einlesen): der Tab, der gerade offen ist
  let neuZeichnen = () => {};
  const zeichne = () => neuZeichnen();
  LST_START.statistik = statistik;
  LST_START.erfolge = erfolge;
})();
