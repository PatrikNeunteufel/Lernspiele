/* Prüfansicht der Inhaltslisten (Entscheide LP1 a–LP5 a, LERN_Session11; rahmen.md Abschnitt 17).
   Läuft auf der Seite des Spiels, das die Liste besitzt: Nur dort sind die Inhalte geladen und kann das Spiel Bilder
   zeichnen. Geladen erst beim Öffnen (LS.listenPruefen), zusammen mit spiele/<id>/pruefung.js.

   pruefung.js eines Spiels meldet seine Listen mit LS.listenPruefung(spielId, { <liste>: {
     beschreibung,                         wofür die Liste ist, in welchen Stufen
     abschnitte: [{ id, titel, hinweis?,   je Abschnitt eine Tabelle, einzeln aufklappbar und abzuhaken
       spalten: ["Wort", "Bild", …],       Köpfe; feste Bedeutung je Spalte
       eintraege: () => [ … ],             die Einträge, wie das Spiel sie benutzt (Rohdaten)
       zeile: e => ["…", "…"],             Zellen eines Eintrags (Text), so viele wie spalten
       gruppe?: e => "A",                  Untergruppen, einzeln aufklappbar (z. B. je Buchstabe)
       bild?: e => SVG-Element }] } })     Bild je Eintrag, vom Spiel gezeichnet (vor den Spalten)

   Haken je Eintrag hängen am Fingerabdruck (LS.fingerabdruck) von Abschnitt und Rohdaten (LP2 a): Ändert sich der
   Eintrag, ist der Haken weg. Die Entwicklung (Entwickler-Modus) schreibt sie über den Entwickler-Server in
   spiele/gemeinsam/pruefstand-eintraege.json und, wenn alle abgehakt sind, die Liste in pruefstand.js (mit dem
   Fingerabdruck der ganzen Liste). Eine Aufsicht oder Lehrperson hakt für sich ab (lernspiele:pruefungLokal); ist alles
   abgehakt, gibt sie die Liste auf ihrem Gerät frei (wie Verwaltung → Freigabe, LP4 a). Korrekturen gehen als Meldung
   der Art „korrektur“ an die Entwicklung. */
"use strict";
const LISTENPRUEFUNG = (() => {
  const { el } = LS;
  let eintraegeDaten = null; // Haken der Entwicklung je Liste: { "<spiel>/<liste>": { "<schlüssel>": { am, von } } }

  async function ladeEintraege() {
    if (eintraegeDaten) return eintraegeDaten;
    try { eintraegeDaten = await (await fetch("../gemeinsam/pruefstand-eintraege.json", { cache: "no-store" })).json(); }
    catch { eintraegeDaten = {}; }
    return eintraegeDaten;
  }

  /** Alle Einträge einer Liste mit Schlüssel, Zellen, Abschnitt und Gruppe. */
  function eintraegeVon(def) {
    return def.abschnitte.flatMap(a => a.eintraege().map(e => ({
      roh: e, abschnitt: a, schluessel: `${a.id}:${LS.fingerabdruck(e)}`, zellen: a.zeile(e).map(z => (z == null ? "" : String(z))),
      gruppe: a.gruppe ? String(a.gruppe(e)) : null,
    })));
  }
  /** Fingerabdruck der ganzen Liste (alle Schlüssel): ändert sich ein Eintrag, passt er nicht mehr zum Prüfstand. */
  const listenHash = eintraege => LS.fingerabdruck(eintraege.map(e => e.schluessel).sort());

  async function oeffne(spielId, listeId) {
    const defs = LS.pruefungDefinition(spielId);
    const def = defs?.[listeId];
    if (!def) return alert("Für diese Liste gibt es noch keine Prüfansicht (pruefung.js).");
    const entwickler = !!LS.entwicklung?.aktiv?.();
    const ich = entwickler ? LS.entwicklung.name() || "Entwicklung" : LS.spielerName(LS.aktuellerSpieler());
    const quelle = `${spielId}/${listeId}`;
    const katalog = LS.spielListen(spielId).find(l => l.id === listeId);
    const alle = eintraegeVon(def);
    const entw = { ...((await ladeEintraege())[quelle] || {}) };
    const lokal = LS.pruefungLokal(quelle);
    const meine = entwickler ? entw : lokal;
    // Bemerkungen: Entwicklung aus bemerkungen.json (Server), Aufsicht ihre Korrekturen
    let bemerkungen = [];
    if (entwickler && (await LS.entwicklung.server())) {
      bemerkungen = ((await LS.entwicklung.bemerkungen()) || []).filter(b => b.liste === quelle && !String(b.status || "").startsWith("erledigt"))
        .map(b => ({ text: b.text, schluessel: b.schluessel || null, eintrag: b.eintrag || null, entfernen: async () => LS.entwicklung.bemerkungStatus(b.nr, `erledigt ${KERN.zeit.tag()} (in der Prüfansicht entfernt)`) }));
    } else if (!entwickler) {
      bemerkungen = LS.korrekturen().filter(k => k.liste === quelle).map(k => ({ text: k.text, schluessel: k.schluessel, eintrag: k.eintrag,
        status: k.status, entfernen: k.status === "neu" ? async () => { LS.entferneMeldung(k.id); return true; } : null }));
    }
    const bemerkungZu = e => bemerkungen.filter(b => b.schluessel ? b.schluessel === e.schluessel : b.eintrag === e.zellen.join(" | "));

    const dialog = el("dialog", { class: "listen-dialog pruef-dialog" });
    const schliessen = () => { dialog.close(); dialog.remove(); };
    const stand = el("p", { class: "pruef-stand" });
    const meldung = el("p", { class: "leise", "aria-live": "polite" });
    const zaehle = () => {
      const n = alle.filter(e => meine[e.schluessel]).length;
      const m = alle.filter(e => entw[e.schluessel]).length;
      stand.textContent = entwickler ? `${n} von ${alle.length} Einträgen geprüft.`
        : `Von mir geprüft: ${n} von ${alle.length} · von der Entwicklung: ${m} von ${alle.length}${katalog?.geprueft ? " (Liste freigegeben)" : ""}`;
    };

    // Speichern: Entwicklung gebündelt an den Server, Aufsicht sofort im Browser
    let offen = { setzen: new Set(), entfernen: new Set() };
    let timer = null;
    const sichern = async () => {
      const komplett = alle.every(e => meine[e.schluessel]);
      if (entwickler) {
        const ok = await LS.entwicklung.setzeEintraege({ liste: quelle, setzen: [...offen.setzen], entfernen: [...offen.entfernen], komplett, hash: listenHash(alle) });
        offen = { setzen: new Set(), entfernen: new Set() };
        meldung.textContent = ok ? (komplett ? "✓ Liste vollständig geprüft — im Prüfstand eingetragen." : "✓ gespeichert") : "⚠ nicht gespeichert (Entwickler-Server?)";
      } else {
        LS.setzePruefungLokal(quelle, meine);
        // Ganz geprüft: auf diesem Gerät freigeben; sonst zurück auf den Prüfstand der Entwicklung (LP4 a)
        LS.setzeListeFrei(spielId, listeId, komplett ? true : null);
        meldung.textContent = komplett ? "✓ Alles geprüft — die Liste ist auf diesem Gerät für Kinder frei." : "✓ gespeichert";
      }
      zaehle();
    };
    const merke = () => { clearTimeout(timer); timer = setTimeout(sichern, entwickler ? 500 : 0); };
    function setze(e, an) {
      if (an) { meine[e.schluessel] = { am: KERN.zeit.tag(), von: ich }; // Tag des Geräts, nicht UTC offen.setzen.add(e.schluessel); offen.entfernen.delete(e.schluessel); }
      else { delete meine[e.schluessel]; offen.entfernen.add(e.schluessel); offen.setzen.delete(e.schluessel); }
    }

    // Zeilen und Gruppen
    const kaestchen = [];
    function zeileEl(e) {
      const box = el("input", { type: "checkbox", "aria-label": `Geprüft: ${e.zellen.join(", ")}` });
      box.checked = !!meine[e.schluessel];
      box.addEventListener("change", () => { setze(e, box.checked); aktualisiereGruppen(); merke(); });
      kaestchen.push({ e, box });
      const bild = e.abschnitt.bild ? el("td", { class: "pruef-bild" }, e.abschnitt.bild(e.roh)) : null;
      const zeile = el("tr", { class: bemerkungZu(e).length ? "mit-bemerkung" : "" },
        el("td", { class: "pruef-haken" }, box, !entwickler && entw[e.schluessel] ? el("span", { class: "pruef-e", title: "von der Entwicklung geprüft", text: "✓E" }) : null),
        // Kurze Zellen so breit wie ihr Inhalt, lange (Sätze) umbrechen
        // Eine Zelle „svg:<name>“ zeigt die Zeichnung aus der Bildersammlung (B1 a), dahinter den Namen fürs Abgleichen
        bild, ...e.zellen.map(z => LS.zelleMitBildern(z, z.length > 24 ? "lang" : "")),
        el("td", {}, el("button", { type: "button", class: "knopf hell klein", text: entwickler ? "📝" : "✏️", title: entwickler ? "Bemerkung zu diesem Eintrag" : "Korrektur vorschlagen",
          onclick: () => bemerkeEintrag(e, zeile) })));
      const zeilen = [zeile];
      for (const b of bemerkungZu(e)) zeilen.push(bemerkungsZeile(b, e));
      return zeilen;
    }
    function bemerkungsZeile(b, e) {
      const spalten = 3 + e.zellen.length + (e.abschnitt.bild ? 1 : 0);
      const tr = el("tr", { class: "pruef-bemerkung" }, el("td", { colspan: String(spalten) },
        el("span", { text: `📝 ${b.text}${b.status && b.status !== "neu" ? ` (${b.status === "weitergeleitet" ? "an die Entwicklung gesendet" : b.status})` : ""}` }),
        b.entfernen ? el("button", { type: "button", class: "knopf hell klein", text: "✕ entfernen", onclick: async () => {
          if (await b.entfernen()) {
            tr.remove();
            if (bemerkungen.includes(b)) bemerkungen.splice(bemerkungen.indexOf(b), 1); // der Eintrag lässt sich wieder abhaken
            meldung.textContent = "✓ Bemerkung entfernt";
          }
        } }) : null));
      return tr;
    }
    function bemerkeEintrag(e, zeile) {
      dialog.querySelector(".pruef-feld")?.remove();
      const feld = el("textarea", { class: "feld", rows: "2", placeholder: entwickler ? "Bemerkung zu diesem Eintrag" : "Was stimmt nicht, und wie wäre es richtig?" });
      const box = el("tr", { class: "pruef-feld" }, el("td", { colspan: String(3 + e.zellen.length + (e.abschnitt.bild ? 1 : 0)) }, feld,
        el("button", { type: "button", class: "knopf gruen klein", text: "Speichern", onclick: async () => {
          const text = feld.value.trim();
          if (!text) return feld.focus();
          const daten = { liste: quelle, eintrag: e.zellen.join(" | "), schluessel: e.schluessel, text };
          let b;
          if (entwickler) {
            const r = await LS.entwicklung.bemerkung({ spiel: spielId, ...daten });
            if (!r) return;
            b = { text, schluessel: e.schluessel, entfernen: async () => LS.entwicklung.bemerkungStatus(r.nr, `erledigt ${KERN.zeit.tag()} (in der Prüfansicht entfernt)`) };
          } else {
            const k = LS.neueKorrektur({ name: LS.aktuellerSpieler(), spiel: spielId, ...daten });
            b = { text, schluessel: e.schluessel, status: "neu", entfernen: async () => { LS.entferneMeldung(k.id); return true; } };
            meldung.textContent = "✓ Korrektur gespeichert — senden unter Verwaltung → Meldungen.";
          }
          // Mit Bemerkung bleibt der Eintrag offen, bis sie erledigt ist — auch für „Ganze Liste geprüft“ und „✓ alle“.
          bemerkungen.push(b);
          const k = kaestchen.find(x => x.e === e);
          if (k?.box.checked) { k.box.checked = false; setze(e, false); merke(); }
          box.replaceWith(bemerkungsZeile(b, e));
          aktualisiereGruppen();
        } })));
      zeile.after(box);
      feld.focus();
    }

    // Gruppen (Abschnitte, Untergruppen): zugeklappt, wenn ich sie ganz geprüft habe (LP1 a)
    const gruppen = [];
    function gruppeEl(titel, eintraege, inhalt) {
      const alleBox = el("button", { type: "button", class: "knopf hell klein", text: "✓ alle" });
      const zahl = el("span", { class: "pruef-zahl" });
      const d = el("details", { class: "pruef-gruppe" }, el("summary", {}, el("b", { text: titel }), zahl, alleBox), ...inhalt);
      const g = { d, eintraege, zahl, alleBox };
      alleBox.addEventListener("click", ev => {
        ev.preventDefault();
        const an = !eintraege.every(e => meine[e.schluessel]);
        for (const e of eintraege) if (!(an && bemerkungZu(e).length)) setze(e, an);
        for (const k of kaestchen) if (eintraege.includes(k.e)) k.box.checked = !!meine[k.e.schluessel];
        aktualisiereGruppen(); merke();
      });
      gruppen.push(g);
      d.open = !eintraege.every(e => meine[e.schluessel]);
      return d;
    }
    function aktualisiereGruppen() {
      for (const g of gruppen) {
        const n = g.eintraege.filter(e => meine[e.schluessel]).length;
        g.zahl.textContent = ` ${n} von ${g.eintraege.length} ✓`;
        g.alleBox.textContent = n === g.eintraege.length ? "↺ alle aufheben" : "✓ alle";
        g.d.classList.toggle("fertig", n === g.eintraege.length);
      }
      zaehle();
    }
    const tabelle = (a, eintraege) => el("div", { class: "pruef-rahmen" }, el("table", { class: "pruef-tabelle" },
      el("thead", {}, el("tr", {}, el("th", { text: "✓" }), a.bild ? el("th", { text: "Bild" }) : null, ...a.spalten.map(s => el("th", { text: s })), el("th"))),
      el("tbody", {}, ...eintraege.flatMap(zeileEl))));
    const abschnitte = def.abschnitte.map(a => {
      const eintraege = alle.filter(e => e.abschnitt === a);
      const inhalt = [a.hinweis ? el("p", { class: "leise", text: a.hinweis }) : null];
      if (a.gruppe) {
        const schluessel = [...new Set(eintraege.map(e => e.gruppe))];
        inhalt.push(...schluessel.map(g => gruppeEl(g, eintraege.filter(e => e.gruppe === g), [tabelle(a, eintraege.filter(e => e.gruppe === g))])));
      } else inhalt.push(tabelle(a, eintraege));
      return gruppeEl(a.titel, eintraege, inhalt);
    });

    const knopf = (text, onclick, art = "hell") => el("button", { type: "button", class: `knopf ${art} klein`, text, onclick });
    const kopf = el("div", { class: "knopfzeile" },
      knopf("✓ Ganze Liste geprüft", () => {
        // übernimmt die gesetzten Haken und hakt den Rest ab — Einträge mit offener Bemerkung bleiben offen
        for (const e of alle) if (!bemerkungZu(e).length) setze(e, true);
        for (const k of kaestchen) k.box.checked = !!meine[k.e.schluessel];
        aktualisiereGruppen(); merke();
      }, "gruen"),
      entwickler ? knopf("📝 Bemerkung zur Liste", () => {
        const feld = el("textarea", { class: "feld", rows: "2", placeholder: "Bemerkung zur ganzen Liste" });
        kopf.after(el("div", {}, feld, knopf("Speichern", async () => {
          if (feld.value.trim() && (await LS.entwicklung.bemerkung({ spiel: spielId, liste: quelle, text: feld.value.trim() }))) { feld.parentElement.remove(); meldung.textContent = "✓ Bemerkung gespeichert"; }
        }, "gruen")));
      }) : null,
      knopf("Schliessen", schliessen));
    dialog.append(el("h2", { text: `${LS.katalogEintrag?.(spielId)?.bild || ""} ${katalog?.name || listeId}` }),
      def.beschreibung ? el("p", { text: def.beschreibung }) : null,
      el("p", { class: "leise", text: entwickler ? "Entwickler-Modus: Haken gelten für alle (Prüfstand)." : "Ihre Haken gelten auf diesem Gerät. ✓E = von der Entwicklung geprüft. ✏️ schlägt der Entwicklung eine Korrektur vor." }),
      stand, kopf, meldung, ...abschnitte);
    aktualisiereGruppen();
    dialog.addEventListener("close", () => { if (offen.setzen.size || offen.entfernen.size) sichern(); dialog.remove(); });
    document.body.append(dialog);
    dialog.showModal();
  }

  return { oeffne, eintraegeVon, listenHash };
})();
