/* Kern — Prüfansicht der Inhaltslisten (Entscheid LK1 a, LERN_Session24; docs/kern/rahmen.md 4.27).
   Herkunft: eulenpfad/spiele/gemeinsam/listenpruefung.js (Entscheide LP1 a–LP5 a, LERN_Session11; Eulenpfad rahmen.md 17).

   Eine Inhalts-Id (Spiel oder Übung) meldet ihre Listen mit einer Prüfdefinition:
     { <liste>: { beschreibung, abschnitte: [{ id, titel, hinweis?, spalten: ["Wort", …],
                  eintraege: () => [ … ], zeile: e => ["…", …], gruppe?: e => "A", bild?: e => SVG-Element }] } }
   Haken je Eintrag hängen am Fingerabdruck von Abschnitt und Rohdaten (LP2 a, KERN.runden.fingerabdruck): Ändert sich
   ein Eintrag, ist sein Haken weg. Die Entwicklung (Entwickler-Modus, KERN.entwicklung) schreibt über den Entwickler-
   Server <app>/…/pruefstand-eintraege.json und, wenn alles abgehakt ist, die Liste mit dem Fingerabdruck der ganzen
   Liste in den Prüfstand. Eine Aufsicht hakt für sich ab (lokal) und gibt die Liste auf ihrem Gerät frei (LP4 a).
   Korrekturvorschläge der Aufsicht (✏️) nur, wenn die App sie anbietet (opt.korrektur; Lernsteig noch nicht, LK2 a).

   KERN.listenpruefung.eintraegeVon(def)  → [{ roh, abschnitt, schluessel, zellen, gruppe }]
   KERN.listenpruefung.listenHash(liste)  → Fingerabdruck der ganzen Liste (alle Schlüssel)
   KERN.listenpruefung.ansicht(opt)       → { oeffne(defs, id, listeId) } — Dialog; false ohne Definition
     opt.el            KERN.el (Standard)
     opt.eintraegeUrl  Adresse von pruefstand-eintraege.json (relativ zur Seite)
     opt.entwicklung   () → KERN.entwicklung-Objekt der App oder null
     opt.ich           () → Name der Aufsicht (für „von“ ohne Entwickler-Modus)
     opt.lokal         { lies(quelle) → haken, schreibe(quelle, haken) } — Haken der Aufsicht auf diesem Gerät
     opt.setzeFrei     (id, listeId, wert) — Freigabe je Gerät (true, null)
     opt.liste         (id, listeId) → { name, geprueft } aus dem Katalog
     opt.titel         id → Text vor dem Listennamen (etwa das Bild des Spiels); Standard ""
     opt.zelle         (text, klasse) → <td>; Standard: Text
     opt.feld          Name des Felds der Inhalts-Id in Bemerkungen ("spiel" im Eulenpfad, "inhalt" im Lernsteig)
     opt.wer           wer übt, für die Meldung nach der Freigabe ("Kinder", "Jugendliche")
     opt.korrektur     null oder { liste(quelle) → [{ id, text, schluessel, eintrag, status }], neu(daten) → { id },
                       entferne(id), gespeichert: Text nach dem Speichern }
*/
"use strict";

(function (KERN) {
  const fingerabdruck = wert => KERN.runden.fingerabdruck(wert);

  /** Alle Einträge einer Liste mit Schlüssel, Zellen, Abschnitt und Gruppe. */
  function eintraegeVon(def) {
    return def.abschnitte.flatMap(a => a.eintraege().map(e => ({
      roh: e, abschnitt: a, schluessel: `${a.id}:${fingerabdruck(e)}`, zellen: a.zeile(e).map(z => (z == null ? "" : String(z))),
      gruppe: a.gruppe ? String(a.gruppe(e)) : null,
    })));
  }
  /** Fingerabdruck der ganzen Liste (alle Schlüssel): ändert sich ein Eintrag, passt er nicht mehr zum Prüfstand. */
  const listenHash = eintraege => fingerabdruck(eintraege.map(e => e.schluessel).sort());

  function ansicht(opt) {
    const o = opt || {};
    const el = o.el || KERN.el;
    const zelle = o.zelle || ((text, klasse) => el("td", { class: klasse || "", text }));
    const feld = o.feld || "inhalt";
    let eintraegeDaten = null; // Haken der Entwicklung je Liste: { "<id>/<liste>": { "<schlüssel>": { am, von } } }

    async function ladeEintraege() {
      if (eintraegeDaten) return eintraegeDaten;
      try { eintraegeDaten = await (await fetch(o.eintraegeUrl, { cache: "no-store" })).json(); }
      catch { eintraegeDaten = {}; }
      return eintraegeDaten;
    }

    async function oeffne(defs, id, listeId) {
      const def = defs?.[listeId];
      if (!def) return false;
      const ent = typeof o.entwicklung === "function" ? o.entwicklung() : null;
      const entwickler = !!ent?.aktiv?.();
      const ich = entwickler ? ent.name() || "Entwicklung" : (typeof o.ich === "function" ? o.ich() : "") || "Aufsicht";
      const quelle = `${id}/${listeId}`;
      const katalog = typeof o.liste === "function" ? o.liste(id, listeId) : null;
      const alle = eintraegeVon(def);
      const entw = { ...((await ladeEintraege())[quelle] || {}) };
      const lokal = o.lokal.lies(quelle);
      const meine = entwickler ? entw : lokal;
      const kor = o.korrektur || null;
      // Bemerkungen: Entwicklung aus bemerkungen.json (Server), Aufsicht ihre Korrekturen (wenn die App sie kennt)
      let bemerkungen = [];
      if (entwickler && (await ent.server())) {
        bemerkungen = ((await ent.bemerkungen()) || []).filter(b => b.liste === quelle && !String(b.status || "").startsWith("erledigt"))
          .map(b => ({ text: b.text, schluessel: b.schluessel || null, eintrag: b.eintrag || null, entfernen: async () => ent.bemerkungStatus(b.nr, `erledigt ${KERN.zeit.tag()} (in der Prüfansicht entfernt)`) }));
      } else if (!entwickler && kor) {
        bemerkungen = kor.liste(quelle).map(k => ({ text: k.text, schluessel: k.schluessel, eintrag: k.eintrag,
          status: k.status, entfernen: k.status === "neu" ? async () => { kor.entferne(k.id); return true; } : null }));
      }
      const bemerkungZu = e => bemerkungen.filter(b => b.schluessel ? b.schluessel === e.schluessel : b.eintrag === e.zellen.join(" | "));
      const mitKnopf = entwickler || !!kor; // 📝 der Entwicklung oder ✏️ der Aufsicht

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
          const ok = await ent.setzeEintraege({ liste: quelle, setzen: [...offen.setzen], entfernen: [...offen.entfernen], komplett, hash: listenHash(alle) });
          offen = { setzen: new Set(), entfernen: new Set() };
          meldung.textContent = ok ? (komplett ? "✓ Liste vollständig geprüft — im Prüfstand eingetragen." : "✓ gespeichert") : "⚠ nicht gespeichert (Entwickler-Server?)";
        } else {
          o.lokal.schreibe(quelle, meine);
          // Ganz geprüft: auf diesem Gerät freigeben; sonst zurück auf den Prüfstand der Entwicklung (LP4 a)
          o.setzeFrei(id, listeId, komplett ? true : null);
          meldung.textContent = komplett ? `✓ Alles geprüft — die Liste ist auf diesem Gerät für ${o.wer || "Lernende"} frei.` : "✓ gespeichert";
        }
        zaehle();
      };
      const merke = () => { clearTimeout(timer); timer = setTimeout(sichern, entwickler ? 500 : 0); };
      function setze(e, an) {
        if (an) { meine[e.schluessel] = { am: KERN.zeit.tag(), von: ich }; offen.setzen.add(e.schluessel); offen.entfernen.delete(e.schluessel); }
        else { delete meine[e.schluessel]; offen.entfernen.add(e.schluessel); offen.setzen.delete(e.schluessel); }
      }

      // Zeilen und Gruppen
      const kaestchen = [];
      const spaltenZahl = e => 2 + (mitKnopf ? 1 : 0) + e.zellen.length + (e.abschnitt.bild ? 1 : 0) - 1;
      function zeileEl(e) {
        const box = el("input", { type: "checkbox", "aria-label": `Geprüft: ${e.zellen.join(", ")}` });
        box.checked = !!meine[e.schluessel];
        box.addEventListener("change", () => { setze(e, box.checked); aktualisiereGruppen(); merke(); });
        kaestchen.push({ e, box });
        const bild = e.abschnitt.bild ? el("td", { class: "pruef-bild" }, e.abschnitt.bild(e.roh)) : null;
        const zeile = el("tr", { class: bemerkungZu(e).length ? "mit-bemerkung" : "" },
          el("td", { class: "pruef-haken" }, box, !entwickler && entw[e.schluessel] ? el("span", { class: "pruef-e", title: "von der Entwicklung geprüft", text: "✓E" }) : null),
          // Kurze Zellen so breit wie ihr Inhalt, lange (Sätze) umbrechen
          bild, ...e.zellen.map(z => zelle(z, z.length > 24 ? "lang" : "")),
          mitKnopf ? el("td", {}, el("button", { type: "button", class: "knopf hell klein", text: entwickler ? "📝" : "✏️", title: entwickler ? "Bemerkung zu diesem Eintrag" : "Korrektur vorschlagen",
            onclick: () => bemerkeEintrag(e, zeile) })) : null);
        const zeilen = [zeile];
        for (const b of bemerkungZu(e)) zeilen.push(bemerkungsZeile(b, e));
        return zeilen;
      }
      function bemerkungsZeile(b, e) {
        const tr = el("tr", { class: "pruef-bemerkung" }, el("td", { colspan: String(spaltenZahl(e) + 1) },
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
        const text = el("textarea", { class: "feld", rows: "2", placeholder: entwickler ? "Bemerkung zu diesem Eintrag" : "Was stimmt nicht, und wie wäre es richtig?" });
        const box = el("tr", { class: "pruef-feld" }, el("td", { colspan: String(spaltenZahl(e) + 1) }, text,
          el("button", { type: "button", class: "knopf gruen klein", text: "Speichern", onclick: async () => {
            const t = text.value.trim();
            if (!t) return text.focus();
            const daten = { liste: quelle, eintrag: e.zellen.join(" | "), schluessel: e.schluessel, text: t };
            let b;
            if (entwickler) {
              const r = await ent.bemerkung({ [feld]: id, ...daten });
              if (!r) return;
              b = { text: t, schluessel: e.schluessel, entfernen: async () => ent.bemerkungStatus(r.nr, `erledigt ${KERN.zeit.tag()} (in der Prüfansicht entfernt)`) };
            } else {
              const k = kor.neu({ [feld]: id, ...daten });
              b = { text: t, schluessel: e.schluessel, status: "neu", entfernen: async () => { kor.entferne(k.id); return true; } };
              meldung.textContent = kor.gespeichert || "✓ Korrektur gespeichert";
            }
            // Mit Bemerkung bleibt der Eintrag offen, bis sie erledigt ist — auch für „Ganze Liste geprüft“ und „✓ alle“.
            bemerkungen.push(b);
            const k = kaestchen.find(x => x.e === e);
            if (k?.box.checked) { k.box.checked = false; setze(e, false); merke(); }
            box.replaceWith(bemerkungsZeile(b, e));
            aktualisiereGruppen();
          } })));
        zeile.after(box);
        text.focus();
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
        el("thead", {}, el("tr", {}, el("th", { text: "✓" }), a.bild ? el("th", { text: "Bild" }) : null, ...a.spalten.map(s => el("th", { text: s })), mitKnopf ? el("th") : null)),
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
          const text = el("textarea", { class: "feld", rows: "2", placeholder: "Bemerkung zur ganzen Liste" });
          kopf.after(el("div", {}, text, knopf("Speichern", async () => {
            if (text.value.trim() && (await ent.bemerkung({ [feld]: id, liste: quelle, text: text.value.trim() }))) { text.parentElement.remove(); meldung.textContent = "✓ Bemerkung gespeichert"; }
          }, "gruen")));
        }) : null,
        knopf("Schliessen", schliessen));
      const vorTitel = typeof o.titel === "function" ? o.titel(id) || "" : "";
      dialog.append(el("h2", { text: `${vorTitel ? vorTitel + " " : ""}${katalog?.name || listeId}` }),
        def.beschreibung ? el("p", { text: def.beschreibung }) : null,
        el("p", { class: "leise", text: entwickler ? "Entwickler-Modus: Haken gelten für alle (Prüfstand)."
          : `Ihre Haken gelten auf diesem Gerät. ✓E = von der Entwicklung geprüft.${kor ? " ✏️ schlägt der Entwicklung eine Korrektur vor." : ""}` }),
        stand, kopf, meldung, ...abschnitte);
      aktualisiereGruppen();
      dialog.addEventListener("close", () => { if (offen.setzen.size || offen.entfernen.size) sichern(); dialog.remove(); });
      document.body.append(dialog);
      dialog.showModal();
      return true;
    }

    return { oeffne };
  }

  KERN.listenpruefung = { ansicht, eintraegeVon, listenHash };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
