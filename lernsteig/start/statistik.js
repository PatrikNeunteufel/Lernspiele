/* Statistik des Lernsteigs (BF1 a): Überblick, Kompetenzstand je Übung und Lehrplan-Stufe, letzte Runden, Sichern
   und Einlesen als Datei (LST_DATEN, nur auf Knopfdruck). Gilt für das angemeldete Konto; der Gast hat keinen Stand (C2 a).
   Mit ?konto=<id> für eine angemeldete Aufsicht, wenn das Konto mit ihr verbunden ist (AU1 a); dann ohne Einlesen. */
"use strict";

(function () {
  const KAT = LST_KATALOG;
  const el = LST.el;
  const wurzel = document.getElementById("statistik");
  const TAGE = 14;
  let meldung = "";

  const tag = iso => (iso || "").slice(0, 10);
  const datumText = iso => { const d = new Date(iso); return isNaN(d) ? "" : `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`; };
  const prozent = (a, b) => (b ? `${Math.round(100 * a / b)} %` : "–");

  function kachel(wert, titel) { return el("div", { class: "kachel" }, el("b", { text: String(wert) }), el("small", { text: titel })); }

  function ueberblick(r) {
    const aufgaben = r.reduce((s, x) => s + (x.aufgaben || 0), 0);
    const anhieb = r.reduce((s, x) => s + (x.aufAnhieb || 0), 0);
    const grenze = new Date(Date.now() - (TAGE - 1) * 864e5).toISOString().slice(0, 10);
    const tage = new Set(r.map(x => tag(x.zeit)).filter(t => t >= grenze)).size;
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

  // Konto der Seite: das eigene, oder für die Aufsicht ein verbundenes
  function kontoDerSeite() {
    const id = new URLSearchParams(location.search).get("konto");
    if (!id) return { k: LST.konto(), aufsicht: null };
    const a = LST_KONTEN.aufsichtAktiv();
    const k = a && LST_KONTEN.verbundene(a.id).find(x => x.id === id);
    return k ? { k, aufsicht: a } : { k: null, aufsicht: null };
  }

  function zeichne() {
    // Anmeldung zuerst (Plan C1); für den Gast wird nichts gespeichert (C2 a), also gibt es keinen Stand.
    const wer = LST.werUebt();
    if (wer === "niemand" || wer === "gast") {
      wurzel.replaceChildren(el("p", { class: "meldung", text: wer === "gast" ? "Als Gast wird nichts gespeichert, darum gibt es hier keinen Stand. Melde dich an, damit der Lernsteig deinen Stand kennt." : "Melde dich zuerst auf der Startseite an." }),
        el("a", { class: "knopf haupt", href: "index.html", text: wer === "gast" ? "Zur Startseite" : "Zur Anmeldung" }));
      return;
    }
    const { k, aufsicht } = kontoDerSeite();
    if (!k) { wurzel.replaceChildren(el("p", { class: "meldung", text: "Dieses Konto ist nicht mit der angemeldeten Aufsicht verbunden." }), el("a", { class: "knopf", href: "aufsicht.html", text: "Zur Aufsicht" })); return; }
    const r = LST.runden(x => x.person === k.id);
    wurzel.replaceChildren(
      el("p", { class: "konto-zeile" }, el("b", { text: k.id === "gast" ? "Gast" : k.name }),
        el("span", { class: "leise", text: aufsicht ? `Ansicht der Aufsicht ${aufsicht.name}` : k.id === "gast" ? "nicht angemeldet" : "angemeldet" })),
      el("h2", { class: "abschnitt", text: "Überblick" }), ueberblick(r),
      el("h2", { class: "abschnitt", text: "Wochenziel" }), zielKarte(k, !!aufsicht),
      el("h2", { class: "abschnitt", text: "Stand je Übung" }), standJeUebung(k, r),
      el("h2", { class: "abschnitt", text: "Letzte Runden" }), letzteRunden(r),
      aufsicht ? el("p", {}, el("a", { class: "knopf", href: "aufsicht.html", text: "← Zur Aufsicht" })) : el("h2", { class: "abschnitt", text: "Sichern und Einlesen" }),
      aufsicht ? null : datenKarte(k),
      el("p", { class: "fuss", text: "Alles bleibt im Browser auf diesem Gerät, ausser du sicherst es selbst als Datei." }));
  }

  zeichne();
})();
