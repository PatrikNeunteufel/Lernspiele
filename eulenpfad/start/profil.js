/* Tab „Profil“. Ein Kind sieht nur „Mein Bild“ und wählt seinen Avatar (Entscheid AV1 a, LERN_Session12); Timer,
   Vorlesen und Reihenfolge stellt es im Spiel um. Die Aufsicht wählt oben, wessen Profil, und setzt Geburtsmonat, Klasse (auch Aufsteigen),
   Fokus und die Vorgaben für Reihenfolge, Vorlesen und Timer — je Einstellung auch „fest“ (VR1 a). Rollen und PIN:
   Tab Verwaltung. */
"use strict";

let profilVon = null; // nur für die Aufsicht: wessen Profil gerade offen ist
let avatarSatz = null; // gewählter Reiter der Bildwahl (nur Anzeige)
let avatarNeu = null;  // { name, neu }: was beim ersten Öffnen neu freigeschaltet war; 🆕 bleibt bis zum Neuladen
/** Gruppe eines Lernziels für die Fokus-Liste: Lernzielblatt („4.2-G1“) oder Fach aus dem Lehrplan-Kürzel („MA.1.A.3“). */
const FOKUS_FAECHER = { MA: "Mathe", D: "Deutsch", NMG: "NMG", FS1E: "Englisch", FS2F: "Französisch", MU: "Musik", MI: "Medien und Informatik",
  BG: "Bildnerisches Gestalten", TTG: "Textiles und Technisches Gestalten", BS: "Bewegung und Sport" };
const fokusGruppe = lz => (/^\d/.test(lz) ? `Lernzielblatt ${lz.split("-")[0]}` : FOKUS_FAECHER[lz.split(".")[0]] || lz.split(".")[0]);
const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

/**
 * Avatar wählen (AV2 a, AV4 a–AV6 a): grosses Bild, Reiter je Satz (Tiere, Weltall und Technik, Fantasie, aus den
 * Spielen, Abzeichen), die Motive in der gewählten Farbe, die Farben und die Rahmen. Abzeichen-Bilder ab Gold des
 * Abzeichens, Rahmen ab dem ersten Abzeichen in Gold, Platin, Diamant; Gesperrtes steht mit 🔒 und dem Weg dahin.
 */
function avatarWahl(name, neu, alsKind) {
  const { el } = LS;
  const jetzt = AVATARE.zerlege(LS.profil(name).avatar);
  const motiv = jetzt?.motiv.id || null;
  const farbe = jetzt?.farbe.id || AVATARE.FARBEN[0].id;
  const rahmen = jetzt?.rahmen.id || "einfach";
  const frei = freischaltungenVon(name);
  const freiMotive = new Set(frei.motive.map(x => x.id));
  const freiRahmen = new Set(["einfach", ...frei.rahmen.map(x => x.id)]);
  // 🆕 für Neues: Öffnet das Kind die Bildwahl, gilt alles Freigeschaltete als gesehen (der Hinweis im Tab Spiele
  // verschwindet); die Marken bleiben bis zum Neuladen, auch wenn das Kind Reiter wechselt. Die Aufsicht ändert nichts.
  const gesehen = new Set(LS.profil(name).freiGesehen || []);
  if (alsKind && avatarNeu?.name !== name) avatarNeu = { name, neu: new Set(frei.schluessel.filter(s => !gesehen.has(s))) };
  if (alsKind && frei.schluessel.some(s => !gesehen.has(s))) LS.speichereProfil(name, { freiGesehen: frei.schluessel });
  const neuFrei = s => (alsKind ? avatarNeu.neu.has(s) : !gesehen.has(s));
  const setze = (m, f, r) => { LS.speichereProfil(name, { avatar: AVATARE.kennung(m, f, r) }); LS.ton?.("tipp"); neu(); };
  const satz = AVATARE.SAETZE.find(s => s.id === avatarSatz) || AVATARE.SAETZE.find(s => s.motive.some(m => m.id === motiv)) || AVATARE.SAETZE[0];
  const titelVon = id => ERFOLGE.ABZEICHEN.find(a => `abz-${a.id}` === id)?.titel || "";
  const knopf = (kennung, an, offen, text, onclick, neuMarke) => {
    const b = el("button", { type: "button", class: "avatar-knopf" + (an ? " an" : "") + (offen ? "" : " gesperrt"), "aria-pressed": String(an),
      "aria-label": text, title: text, onclick: offen ? onclick : () => LS.ton?.("falsch") });
    b.innerHTML = AVATARE.svg(kennung, 64);
    if (!offen) b.append(el("span", { class: "avatar-schloss", text: "🔒" }));
    else if (neuMarke) b.append(el("span", { class: "avatar-neu", text: "🆕" }));
    return b;
  };
  const motivKnopf = m => {
    const offen = !satz.freischalten || freiMotive.has(m.id);
    const text = offen ? m.name : `${m.name} — wählbar ab 🥇 Gold bei „${titelVon(m.id)}“`;
    return knopf(AVATARE.kennung(m.id, farbe, rahmen), m.id === motiv, offen, text, () => setze(m.id, farbe, rahmen), satz.freischalten && neuFrei(`motiv:${m.id}`));
  };
  const RAHMEN_WEG = { gold: "ab dem ersten Abzeichen in 🥇 Gold", platin: "ab dem ersten Abzeichen in 🏆 Platin", diamant: "ab dem ersten Abzeichen in 💎 Diamant" };
  return el("div", { class: "avatar-wahl" },
    el("div", { class: "avatar-jetzt" }, LS.avatarBild(name, 120),
      el("b", { text: jetzt ? `${LS.spielerName(name)} · ${jetzt.motiv.name}` : "Tipp ein Bild an!" })),
    el("div", { class: "avatar-saetze", role: "tablist" }, ...AVATARE.SAETZE.map(s => el("button", { type: "button", class: "chip", role: "tab",
      "aria-pressed": String(s === satz), onclick: () => { avatarSatz = s.id; neu(); } },
      s.freischalten ? `🏅 ${s.name}` : s.name, s.freischalten && s.motive.some(m => freiMotive.has(m.id) && neuFrei(`motiv:${m.id}`)) ? " 🆕" : ""))),
    satz.freischalten ? el("p", { class: "leise-text", style: "margin:0", text: `Ein Abzeichen in 🥇 Gold schaltet sein Bild frei. Frei: ${freiMotive.size} von ${satz.motive.length}.` }) : "",
    el("div", { class: "avatar-tiere" }, ...satz.motive.map(motivKnopf)),
    el("div", { class: "avatar-farben" }, ...AVATARE.FARBEN.map(f => {
      const b = el("button", { type: "button", class: "avatar-farbe" + (f.id === farbe ? " an" : ""), "aria-pressed": String(f.id === farbe),
        "aria-label": f.name, title: f.name, onclick: () => setze(motiv || AVATARE.SAETZE[0].motive[0].id, f.id, rahmen) });
      b.style.setProperty("--fh", f.hell);
      b.style.setProperty("--fr", f.rand);
      return b;
    })),
    el("b", { text: "Rahmen" }),
    el("div", { class: "avatar-rahmen" }, ...AVATARE.RAHMEN.map(r => {
      const offen = freiRahmen.has(r.id);
      return knopf(AVATARE.kennung(motiv || AVATARE.SAETZE[0].motive[0].id, farbe, r.id), r.id === rahmen, offen,
        offen ? `Rahmen ${r.name}` : `Rahmen ${r.name} — ${RAHMEN_WEG[r.id]}`, () => setze(motiv || AVATARE.SAETZE[0].motive[0].id, farbe, r.id), r.id !== "einfach" && neuFrei(`rahmen:${r.id}`));
    })));
}

function zeichneProfil(box, neu) {
  const { el } = LS;
  const ich = LS.aktuellerSpieler();
  const aufsicht = LS.aufsichtAngemeldet();
  if (!aufsicht || !LS.spielerListe().includes(profilVon)) profilVon = ich;
  const name = profilVon;
  const p = LS.profil(name);

  const karte = el("section", { class: "karte profil" });
  box.append(karte);
  if (!aufsicht) {
    // Alter und Klasse sieht das Kind auch selbst (Hinweis Patrik, LERN_Session14); ändern kann sie nur die Aufsicht.
    const alter = LS.alterVon(p), k = LS.klasseVon(p);
    const ueberMich = [alter !== null ? `${alter} Jahre alt` : null, k !== null ? LS.klasseText(k) : null].filter(Boolean).join(" · ");
    karte.append(el("h2", { text: `👤 ${LS.spielerName(name)}` }),
      ueberMich ? el("p", { class: "profil-ueber-mich", text: ueberMich }) : "",
      el("h3", { text: "🖼️ Mein Bild" }), avatarWahl(name, neu, true));
    return;
  }
  const wahl = el("select", { "aria-label": "Profil von" }, ...LS.spielerListe().map(n => el("option", { value: n, text: LS.spielerName(n) })));
  wahl.value = name;
  wahl.addEventListener("change", () => { profilVon = wahl.value; neu(); });
  karte.append(el("div", { class: "profil-felder" }, el("label", {}, "Profil von", wahl)));
  const istKind = !LS.istAufsicht(name);

  /** Je Einstellung: festlegen oder dem Kind lassen, und seine eigene Wahl zurücksetzen (VR1 a). Wirkt sofort. */
  const kindZeile = art => {
    if (!istKind) return null;
    const fest = LS.istFest(name, art);
    const n = LS.wahlAnzahl(name, art);
    const cb = el("input", { type: "checkbox" });
    cb.checked = fest;
    cb.addEventListener("change", () => { LS.setzeFest(name, art, cb.checked); neu(); });
    return el("div", { class: "kind-wahl" },
      el("label", {}, cb, el("span", { text: `🔒 fest — ${LS.spielerName(name)} kann es im Spiel nicht umstellen` })),
      !fest && n ? el("span", { class: "leise-text", text: art === "vorlesen" ? "Eigene Wahl im Spiel gesetzt. " : `Eigene Wahl in ${n} Spiel${n === 1 ? "" : "en"}. ` }) : null,
      !fest && n ? el("button", { type: "button", class: "knopf hell klein", text: "↺ Auf Vorgabe zurück", onclick: () => { LS.wahlZuruecksetzen(name, art); neu(); } }) : null);
  };

  // Geburtsmonat statt Alter (Wunsch Patrik, LERN_Session14): Jahr und Monat, ohne Tag; das Alter rechnet LS.alterVon.
  const heute = new Date();
  const [gJahr, gMonat] = (p.geboren || "").split("-");
  const jahr = el("select", { "aria-label": "Geburtsjahr" }, el("option", { value: "", text: "Jahr" }),
    ...Array.from({ length: 15 }, (_, i) => heute.getFullYear() - 2 - i).map(j => el("option", { value: String(j), text: String(j) })));
  jahr.value = gJahr || "";
  const monat = el("select", { "aria-label": "Geburtsmonat" }, el("option", { value: "", text: "Monat" }),
    ...MONATE.map((m, i) => el("option", { value: String(i + 1).padStart(2, "0"), text: m })));
  monat.value = gMonat || "";
  const alterText = el("span", { class: "leise-text", "aria-live": "polite" });
  const zeigeAlter = () => {
    const a = jahr.value && monat.value ? LS.alterVon({ geboren: `${jahr.value}-${monat.value}` }) : null;
    alterText.textContent = a !== null ? `${a} Jahre alt`
      : typeof p.alter === "number" ? `bisher „${p.alter} Jahre“ — bitte Geburtsmonat ergänzen` : "nur Monat und Jahr";
  };
  jahr.addEventListener("change", zeigeAlter);
  monat.addEventListener("change", zeigeAlter);
  zeigeAlter();
  const klasse = el("select", { "aria-label": "Klasse" },
    el("option", { value: "", text: "—" }),
    ...LS.KLASSEN.map(k => el("option", { value: String(k), text: LS.klasseText(k) })));
  klasse.value = LS.klasseVon(p) ?? "";
  // Aufsteigen lassen (Wunsch Patrik, LERN_Session14): zum neuen Schuljahr; das Kind bekommt eine Nachricht und das
  // Abzeichen „Aufgestiegen“. Die Klasse von Hand ändern bleibt die Korrektur eines Fehlers und zählt nicht als Aufstieg.
  // Knopf gleich neben der Klasse (Hinweis Patrik, LERN_Session14); vor dem Aufstieg wird gespeichert, was im Formular
  // geändert ist — sonst ginge es beim Neuzeichnen verloren.
  const aufstiegKnopf = () => {
    if (!istKind) return null;
    const k = LS.klasseVon(p);
    if (k === null) return el("span", { class: "leise-text", text: "Aufsteigen geht, sobald eine Klasse eingetragen ist." });
    if (k >= LS.KLASSEN[LS.KLASSEN.length - 1]) return einladungTeil();
    return el("button", { type: "button", class: "knopf gruen klein", text: `⬆️ In die ${LS.klasseText(k + 1)}`,
      title: `In die ${LS.klasseText(k + 1)} aufsteigen lassen`,
      onclick: () => {
        if (!confirm(`${LS.spielerName(name)} steigt in die ${LS.klasseText(k + 1)} auf. Beim nächsten Anmelden gibt es eine Nachricht und ein Abzeichen.`)) return;
        if (speichern() === false) return;
        LS.aufsteigen(name);
        neu();
      } });
  };
  // Einladung zum Lernsteig (Entscheid EL1 a, Notiz EP1; Kern kern/einladung.js): Nach der 6. Klasse gibt die Aufsicht dem
  // Kind eine Einladung mit — Link oder Datei, nur Vorname, Geburtsdatum und Klasse 7; kein Verlauf, keine PIN. Die Daten
  // verlassen den Browser nur auf diesen Knopfdruck (CLAUDE.md, Ausnahme Einladung).
  function einladungTeil() {
    const box = el("span", { class: "einladung" },
      el("span", { class: "leise-text", text: "Nach der 6. Klasse geht es im Lernsteig weiter. " }),
      el("button", { type: "button", class: "knopf hell klein", "data-aktion": "einladung", text: "📨 Einladung zum Lernsteig", onclick: () => {
        const einladung = KERN.einladung.erstellen({ name, geboren: p.geboren || null, klasse: "7" }, { ziel: "lernsteig", von: "eulenpfad" });
        const adresse = new URL("../lernsteig/index.html", location.href).href + KERN.einladung.fragment(einladung);
        const feld = el("input", { type: "text", readonly: true, value: adresse, "aria-label": "Link der Einladung", class: "einladung-link" });
        const meldung = el("span", { class: "leise-text", role: "status" });
        box.replaceChildren(
          el("span", { class: "leise-text", text: `Einladung für ${LS.spielerName(name)}: Vorname, ${p.geboren ? (KERN.person.tagFehlt(p.geboren) ? "Geburtsmonat, " : "Geburtsdatum, ") : ""}Klasse 7. Kein Verlauf, keine PIN. ` }),
          feld,
          el("button", { type: "button", class: "knopf hell klein", text: "🔗 Link kopieren", onclick: async () => {
            try { await navigator.clipboard.writeText(adresse); meldung.textContent = "Kopiert."; }
            catch { feld.select(); meldung.textContent = "Bitte mit Strg+C kopieren."; }
          } }),
          el("button", { type: "button", class: "knopf hell klein", text: "💾 Als Datei", onclick: () => {
            const a = el("a", { href: URL.createObjectURL(new Blob([JSON.stringify(einladung, null, 2)], { type: "application/json" })), download: KERN.einladung.dateiname("lernsteig") });
            document.body.append(a); a.click(); a.remove();
            meldung.textContent = "Gespeichert. Im Lernsteig unter „Ich bin neu“ → „Einladung öffnen“.";
          } }),
          meldung);
        feld.select();
      } }));
    return box;
  }
  // Übernahme in den Lernsteig (Plan C9, Ü1 a, Ü2 b; KERN.person.uebernehmen): nur das eigene Profil der angemeldeten
  // Aufsicht. Kennung, Name, PIN und Sicherheitsfrage reisen mit, der Wiederherstellungscode ist dort ein neuer.
  function uebernahmeTeil() {
    const box = el("div", { class: "profil-felder" });
    const art = el("select", { "aria-label": "Rolle im Lernsteig", name: "uebernahme-art" },
      el("option", { value: "eltern", text: "Eltern" }), el("option", { value: "lehrperson", text: "Lehrperson" }));
    if (p.art) art.value = p.art;
    const meldung = el("p", { class: "leise-text", role: "status" });
    box.append(el("p", { class: "leise-text", text: "Legt dich im Lernsteig (Oberstufe) als Aufsicht an: gleicher Name, gleiche PIN, gleiche Sicherheitsfrage. Den Wiederherstellungscode gibt es dort neu. Runden und Einstellungen bleiben hier." }),
      el("label", {}, "Rolle im Lernsteig", art),
      el("div", { class: "knopfzeile" }, el("button", { type: "button", class: "knopf hell klein", "data-aktion": "uebernehmen", text: "🔑 In den Lernsteig übernehmen",
        onclick: async () => {
          try {
            const ziel = KERN.person.liste(KERN.speicher("lernsteig:"), { schluessel: "personen" });
            const r = await KERN.person.uebernehmen(LS.person(name), ziel, { art: art.value });
            // Ü1 a: die Art bleibt auch hier als Feld der Person stehen (im Eulenpfad ohne Wirkung)
            if (r.status === "neu") LS.speichereProfil(name, { art: art.value });
            if (r.status === "schon") meldung.textContent = "Du bist im Lernsteig schon als Aufsicht angelegt.";
            else if (r.status === "name") meldung.textContent = `Im Lernsteig gibt es schon jemanden mit dem Namen „${name}“. Nichts wurde geändert.`;
            else meldung.replaceChildren(
              el("b", { text: "Übernommen. " }), "Dein Wiederherstellungscode für den Lernsteig — aufschreiben, er wird nur jetzt angezeigt: ",
              el("b", { class: "uebernahme-code", text: r.code, "data-code": r.code }), " ",
              el("a", { href: "../lernsteig/index.html", text: "Zum Lernsteig" }));
          } catch (e) { meldung.textContent = e.message; }
        } })),
      meldung);
    return box;
  }
  const aufstiegVerlauf = () => {
    const letzter = istKind ? (p.aufstiege || []).at(-1) : null;
    if (!letzter) return null;
    const datum = z => new Date(z).toLocaleDateString("de-CH");
    return el("div", { class: "kind-wahl" },
      el("span", { class: "leise-text", text: `Zuletzt aufgestiegen: ${LS.klasseText(letzter.von)} → ${LS.klasseText(letzter.nach)} am ${datum(letzter.zeit)}. ` }),
      el("button", { type: "button", class: "knopf hell klein", text: "↶ Zurücknehmen",
        onclick: () => { if (confirm(`Den Aufstieg in die ${LS.klasseText(letzter.nach)} zurücknehmen?`)) { LS.aufstiegZuruecknehmen(name); neu(); } } }));
  };
  const vorlesen = el("select", { "aria-label": "Vorlesen" },
    ...Object.entries(LS.VORLESEN_ARTEN).map(([k, t]) => el("option", { value: k, text: t })));
  vorlesen.value = p.vorlesen ?? "";
  // Fokus (Hinweis Patrik, LERN_Session14): ganz und je Gruppe einklappbar; die Kopfzeilen zählen, was gewählt ist.
  const fokus = el("details", { class: "timer-details fokus-klapp" });
  const fokusKopf = el("summary", {});
  fokus.append(fokusKopf);
  const gruppen = new Map();
  for (const lz of LERNZIELE) {
    const g = fokusGruppe(lz.lz);
    if (!gruppen.has(g)) gruppen.set(g, []);
    gruppen.get(g).push(lz);
  }
  const zaehle = () => {
    const n = fokus.querySelectorAll("input:checked").length;
    fokusKopf.textContent = n ? `${n} Lernziel${n === 1 ? "" : "e"} gewählt` : "Kein Fokus gewählt — antippen zum Wählen";
    for (const [s, liste] of fokusKoepfe) {
      const m = liste.filter(c => c.checked).length;
      s.textContent = `${s.dataset.titel} (${m ? `${m} von ` : ""}${liste.length})`;
    }
  };
  const fokusKoepfe = [];
  for (const [g, liste] of gruppen) {
    const boxen = liste.map(lz => { const cb = el("input", { type: "checkbox", value: lz.lz }); cb.checked = p.fokus.includes(lz.lz); cb.addEventListener("change", zaehle); return [lz, cb]; });
    const s = el("summary", { "data-titel": g });
    const d = el("details", { class: "fokus-gruppe" }, s,
      el("div", { class: "fokus-liste" }, ...boxen.map(([lz, cb]) => el("label", {}, cb, el("span", { html: `<b>${lz.lz}</b> ${lz.text}` })))));
    d.open = boxen.some(([, cb]) => cb.checked);
    fokusKoepfe.push([s, boxen.map(([, cb]) => cb)]);
    fokus.append(d);
  }
  zaehle();
  // Reihenfolge der Teile (Bausteine, Rätselteile): global und je Spiel, das sie beachtet.
  const reihenfolgeWahl = (wert, ohneVorgabe) => {
    const s = el("select", {},
      ...(ohneVorgabe ? [el("option", { value: "", text: "wie global" })] : []),
      ...Object.entries(LS.REIHENFOLGEN).map(([k, t]) => el("option", { value: k, text: t })));
    s.value = wert ?? "";
    return s;
  };
  const reihenfolgeGlobal = reihenfolgeWahl(p.reihenfolge.global, false);
  const reihenfolgeSpiele = SPIELE.filter(s => s.reihenfolge).map(s => ({ s, wahl: reihenfolgeWahl(p.reihenfolge.spiele?.[s.id], true) }));

  // Timer: global ein/aus und Zeitfaktor; je Spiel ein/aus und Sekunden je Stufe (leer = Vorgabe × Faktor).
  const t = p.timer;
  const timerGlobal = el("select", {}, el("option", { value: "aus", text: "aus" }), el("option", { value: "an", text: "an" }));
  timerGlobal.value = t.an ? "an" : "aus";
  const faktor = el("select", {}, ...[[2, "viel Zeit (×2)"], [1.5, "mehr Zeit (×1.5)"], [1, "Vorgabe (×1)"], [0.75, "weniger Zeit (×0.75)"], [0.5, "knapp (×0.5)"]]
    .map(([w, txt]) => el("option", { value: String(w), text: txt })));
  faktor.value = String(t.faktor || 1);
  const timerSpiele = SPIELE.filter(s => LS.spielSichtbar(s.id)).map(s => {
    const an = el("select", {}, el("option", { value: "", text: "wie global" }), el("option", { value: "an", text: "an" }), el("option", { value: "aus", text: "aus" }));
    const eigen = t.spiele?.[s.id] || {};
    an.value = eigen.an == null ? "" : eigen.an ? "an" : "aus";
    const sekunden = Object.fromEntries(LS.SKALA.map(st => {
      const vorschlag = LS.zeitVorschlag(name, s.id, st.id);
      const feld = el("input", {
        type: "number", min: "5", max: "600", class: "sek",
        placeholder: String(Math.round(LS.vorgabeZeit(s.id, st.id) * (t.faktor || 1))),
        title: vorschlag ? `Aus ${vorschlag.n} gemessenen Aufgaben vorgeschlagen: ${vorschlag.sekunden} s` : "Vorgabe × Faktor",
        "aria-label": `${s.name} Stufe ${st.nr} Sekunden`,
      });
      feld.value = eigen.sekunden?.[st.id] ?? "";
      return [st.id, { feld, vorschlag }];
    }));
    return { s, an, sekunden };
  });
  const timerTabelle = el("div", { class: "timer-tabelle" },
    el("span", {}), el("b", { text: "Timer" }), ...LS.SKALA.map(st => el("b", { text: `${st.icon}${st.nr}` })),
    ...timerSpiele.flatMap(({ s, an, sekunden }) => [
      el("span", { text: `${s.bild} ${s.name}` }), an,
      ...LS.SKALA.map(st => el("span", {}, sekunden[st.id].feld,
        sekunden[st.id].vorschlag ? el("small", { class: "vorschlag", text: `💡${sekunden[st.id].vorschlag.sekunden}` }) : null)),
    ]));

  const meldung = el("span", { class: "leise-text", "aria-live": "polite" });
  const speichern = () => {
    const spiele = {};
    for (const { s, wahl } of reihenfolgeSpiele) if (wahl.value) spiele[s.id] = wahl.value;
    const timerJeSpiel = { ...t.spiele };
    for (const { s, an, sekunden } of timerSpiele) {
      const sek = Object.fromEntries(Object.entries(sekunden).filter(([, x]) => x.feld.value).map(([k, x]) => [k, Number(x.feld.value)]));
      if (an.value || Object.keys(sek).length) timerJeSpiel[s.id] = { an: an.value ? an.value === "an" : null, sekunden: sek };
      else delete timerJeSpiel[s.id];
    }
    // Nur Jahr oder nur Monat: nicht speichern, sonst wäre das Alter falsch
    if (!jahr.value !== !monat.value) { meldung.textContent = "Bitte Jahr und Monat wählen (oder beide leer lassen)."; return false; }
    const geboren = jahr.value ? `${jahr.value}-${monat.value}` : null;
    LS.speichereProfil(name, {
      geboren,
      ...(geboren ? { alter: null } : {}),
      klasse: klasse.value !== "" ? Number(klasse.value) : null,
      vorlesen: vorlesen.value || null,
      fokus: [...fokus.querySelectorAll("input:checked")].map(c => c.value),
      reihenfolge: { global: reihenfolgeGlobal.value, spiele },
      timer: { an: timerGlobal.value === "an", faktor: Number(faktor.value), spiele: timerJeSpiel },
    });
    meldung.textContent = "✓ Gespeichert";
    return true;
  };
  // Aufbau (Hinweis Patrik, LERN_Session14): oben ein Formular mit allen Angaben und gleich darunter „Speichern“ —
  // erst die Person, dann die Vorgaben fürs Spielen, der Fokus eingeklappt. Darunter, was das Kind selbst umstellen darf:
  // diese Häkchen wirken sofort. Das Bild wählt das Kind; die Aufsicht sieht es nur (ihr eigenes wählt sie selbst).
  const abschnitt = (titel, ...inhalt) => el("div", { class: "profil-abschnitt" }, el("h3", { text: titel }), ...inhalt);
  const kindZeilen = ["vorlesen", "reihenfolge", "timer"].map(kindZeile).filter(Boolean);
  karte.append(
    el("h2", { text: `Profil von ${LS.spielerName(name)}` }),
    abschnitt("👤 Person",
      el("div", { class: "profil-person" },
        istKind ? el("span", { class: "profil-bild", title: "Das Bild wählt das Kind selbst" }, LS.avatarBild(name, 64))
          : el("details", { class: "timer-details" }, el("summary", {}, LS.avatarBild(name, 28), " Mein Bild"), avatarWahl(name, neu)),
        el("label", {}, "Geboren", el("span", { class: "geboren-wahl" }, monat, jahr), alterText),
        el("label", {}, "Klasse", el("span", { class: "klasse-wahl" }, klasse, aufstiegKnopf() || "")),
      ),
      aufstiegVerlauf() || ""),
    abschnitt("🎮 Vorgaben fürs Spielen",
      el("p", { class: "leise-text", html: "<b>Vorlesen</b> — die Eule liest Aufträge und Tipps vor (🗣️ neben der Eule). „Nach Klasse“: im Kindergarten und in der 1. Klasse automatisch, sonst auf 🗣️. 🔇 in der Kopfzeile schaltet auch die Stimme stumm. Nicht im Lese-Detektiv, in Englisch und Französisch." }),
      el("div", { class: "profil-felder" }, el("label", {}, "Vorlesen", vorlesen)),
      el("p", { class: "leise-text", html: "<b>Reihenfolge der Teile</b> — stehen Bausteine wie 3 ZT + 4 H geordnet (grösste Stelle links) oder gemischt?" }),
      el("div", { class: "profil-felder" }, el("label", {}, "Global (alle Spiele)", reihenfolgeGlobal)),
      el("details", { class: "timer-details" }, el("summary", { text: `Je Spiel (${reihenfolgeSpiele.length} Spiele)` }),
        el("div", { class: "profil-felder", style: "margin-top:8px" }, ...reihenfolgeSpiele.map(({ s, wahl }) => el("label", {}, `${s.bild} ${s.name}`, wahl)))),
      el("p", { class: "leise-text", html: "<b>Timer</b> — jede Aufgabe hat eine Zeit; ist sie um, zählt es als Fehler. Das Kind kann ihn auf der Spielkarte und im Spiel selbst ein- und ausschalten, ausser er ist fest." }),
      el("div", { class: "profil-felder" }, el("label", {}, "Global (alle Spiele)", timerGlobal), el("label", {}, "Zeit", faktor)),
      el("details", { class: "timer-details" },
        el("summary", { text: "Je Spiel: Timer und Sekunden je Stufe (leer = Vorgabe; 💡 = Vorschlag aus den eigenen Zeiten)" }),
        el("div", { class: "tabelle-rahmen" }, timerTabelle))),
    abschnitt("⭐ Fokus — was soll vermehrt geübt werden?", fokus),
    el("div", { class: "knopfzeile profil-speichern" },
      el("button", { class: "knopf gruen", type: "button", text: "Speichern", onclick: speichern }), meldung),
    !istKind && name === LS.aktuellerSpieler() ? abschnitt("🔁 In den Lernsteig übernehmen", uebernahmeTeil()) : "",
    kindZeilen.length ? abschnitt(`🔒 Was ${LS.spielerName(name)} selbst umstellen darf`,
      el("p", { class: "leise-text", text: "Diese Häkchen wirken sofort, ohne Speichern." }),
      ...["Vorlesen", "Reihenfolge der Teile", "Timer"].flatMap((titel, i) => (kindZeilen[i] ? [el("b", { text: titel }), kindZeilen[i]] : []))) : "");
}
