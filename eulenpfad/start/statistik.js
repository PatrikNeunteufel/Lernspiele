/* Tab „Statistik“. Ein Kind sieht vier Karten zu sich: was es als Nächstes übt, seine Woche, seine Runden, seine
   Meldungen (Entscheid ST1 a, LERN_Session12). Die Aufsicht wählt jedes
   Kind, sieht den Vergleich, sichert alle oder einzelne, liest ein und setzt zurück (Entscheid L3 a).
   Runden der Aufsicht tragen test: true und zählen nur auf Wunsch mit (Entscheid T1 a). */
"use strict";

let statistikVon = null;

function zeichneStatistik(box, neu) {
  const { el, SKALA } = LS;
  const { anhieb, mittel, rundenZuLernziel } = AUSWERTUNG;
  const ich = LS.aktuellerSpieler();
  const aufsicht = LS.aufsichtAngemeldet();
  const zeigeTest = aufsicht && LS.lies("statistikTest", false);
  const sichtbarerSpieler = n => zeigeTest || !LS.istAufsicht(n);
  const sichtbareRunde = e => zeigeTest || !e.test;

  const prozent = x => x == null ? "—" : `${Math.round(x * 100)} %`;
  const datum = iso => new Date(iso).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit" }) + " " +
    new Date(iso).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
  const spielName = id => (LS.istMix(id) ? LS.mixName(id) : SPIELE.find(s => s.id === id)?.name || id);
  // "passend": Zufallsmix mit der empfohlenen Stufe je Spiel
  const stufeName = id => { const s = SKALA.find(x => x.id === id); return s ? `${s.icon} ${s.nr}` : id === "passend" ? "👍 passend" : id; };
  const kachel = (zahl, was) => el("div", { class: "kachel" }, el("div", { class: "zahl", text: zahl }), el("div", { class: "was", text: was }));
  const karte = (...inhalt) => el("section", { class: "karte" }, ...inhalt);

  const seite = el("div", { class: "statistik" });
  box.append(seite);

  // ----- Wessen Statistik? -----
  const namen = aufsicht ? LS.spielerListe().filter(sichtbarerSpieler) : [ich];
  if (!aufsicht) statistikVon = ich;
  else if (!namen.includes(statistikVon)) statistikVon = namen.find(n => !LS.istAufsicht(n)) || namen[0] || null;
  const gewaehlt = statistikVon;
  const alle = LS.protokoll().filter(sichtbareRunde);

  const kopf = el("div", { class: "chips" });
  if (aufsicht) {
    for (const n of namen) kopf.append(el("button", { type: "button", class: "chip", "aria-pressed": String(n === gewaehlt), onclick: () => { statistikVon = n; neu(); } }, LS.avatarBild(n, 22), ` ${LS.spielerName(n)}`));
    kopf.append(el("button", { type: "button", class: "chip", "aria-pressed": String(zeigeTest), text: zeigeTest ? "🧪 Testrunden ausblenden" : "🧪 Testrunden zeigen",
      onclick: () => { LS.schreibe("statistikTest", !zeigeTest); neu(); } }));
  }
  if (!gewaehlt) {
    seite.append(karte(kopf, el("p", { text: "Noch keine Kinder. In der Verwaltung ein Kind anlegen." })));
    return;
  }

  const runden = alle.filter(e => e.name === gewaehlt);
  const p = LS.profil(gewaehlt);
  const minuten = Math.round(runden.reduce((s, e) => s + (e.dauer || 0), 0) / 60);
  const profilText = [LS.alterVon(p) !== null ? `${LS.alterVon(p)} Jahre` : null, LS.klasseVon(p) !== null ? LS.klasseText(LS.klasseVon(p)) : null].filter(Boolean).join(" · ") || "Profil noch ohne Alter und Klasse";

  const meine = LS.meldungenVon(gewaehlt);

  /** Vorschläge mit Knopf „Jetzt üben“. */
  function vorschlagListe(vorschlaege) {
    return vorschlaege.length
      ? el("div", { class: "vorschlaege" }, ...vorschlaege.map(v => el("div", { class: `vorschlag ${v.art}` },
          el("b", { text: v.titel }),
          el("p", { text: v.text }),
          v.link ? el("a", { class: "knopf gruen klein", href: v.link, text: "Jetzt üben ➜" }) : null)))
      : el("p", { class: "leise-text", text: runden.length ? "Alles im grünen Bereich — weiter so!" : "Sobald ein paar Runden gespielt sind, erscheinen hier Vorschläge." });
  }
  /** Fehlermeldungen und Fehlerfinder (LERN_Session9): das Kind sieht, was aus seinen Meldungen wurde. */
  function meldungenKarte() {
    const gefunden = LS.gefundeneFehler(gewaehlt);
    const spielName2 = id => SPIELE.find(s => s.id === id)?.name || id;
    const k = karte(
      el("h2", { text: aufsicht ? `🙋 Meldungen von ${gewaehlt}` : "🙋 Meine Meldungen" }),
      gefunden ? el("p", { class: "fehlerfinder", text: `🏅 Fehlerfinder: ${gefunden} echte${gefunden === 1 ? "n Fehler gefunden, den" : " Fehler gefunden, die"} die Entwicklung behoben hat. Danke fürs genaue Hinschauen!` }) : null,
      el("ul", { class: "meine-meldungen" }, ...[...meine].reverse().map(m => el("li", {},
        el("b", { text: `${m.gelesen ? "" : "🔔 "}${new Date(m.zeit).toLocaleDateString("de-CH")} · ${spielName2(m.spiel)}` }),
        el("div", { text: (aufsicht ? LS.MELDUNG_STATUS[m.status]?.text : LS.MELDUNG_STATUS[m.status]?.kind) || m.status }),
        m.antwort ? el("div", { class: "leise-text", text: `💬 ${m.antwort}` }) : null))),
      aufsicht ? el("p", { class: "leise-text", text: "Bearbeiten in der Verwaltung → 🙋 Meldungen." }) : null);
    // Neue Antworten sind markiert, bis das Kind sie hier gesehen hat.
    if (!aufsicht) LS.meldungenGelesen(gewaehlt);
    return k;
  }
  /** Lernplan (Entscheid L1 a, LERN_Session10): Wochenziel und die letzten zwölf Wochen. */
  function lernplanKarte(titel) {
    const plan = ERFOLGE.lernplan(p, runden);
    const letzte = plan.wochen.slice(-12);
    const wochenText = w => `${w.von.toLocaleDateString("de-CH", { day: "numeric", month: "numeric" })}`;
    return karte(
      el("h2", { text: titel }),
      // Ohne Wochenziel sagt es dem Kind die Wochenkarte selbst; die Aufsicht erfährt, wo sie eines setzt.
      plan.plan || aufsicht ? el("p", { class: "leise-text", style: "margin:0 0 8px", text: plan.plan
        ? `Wochenziel: ${plan.plan.tage} Tage × ${plan.plan.minuten} Minuten · ${plan.sterne} Wochenstern${plan.sterne === 1 ? "" : "e"}, ${plan.serie} in Folge.`
        : "Kein Wochenziel gesetzt (Verwaltung → Konten → 📅). Gezeigt werden die Tage mit Runden." }) : null,
      wochenKarte(plan),
      letzte.length > 1 ? el("div", { class: "wochen-reihe" }, ...letzte.map(w => el("span", {
        class: "wochen-punkt" + (w.erfuellt ? " erfuellt" : w.erfuellteTage ? " etwas" : "") + (w.laufend ? " laufend" : ""),
        title: `Woche ab ${wochenText(w)}: ${w.erfuellteTage} Tag${w.erfuellteTage === 1 ? "" : "e"}${plan.plan ? (w.erfuellt ? ", Ziel erreicht" : ", Ziel nicht erreicht") : ""}`,
      }, el("b", { text: wochenText(w) }), el("i", { text: w.erfuellt ? "🌟" : String(w.erfuellteTage) })))) : null);
  }
  /** Letzte Runden, die falsch gelösten Aufgaben aufklappbar. */
  function rundenKarte(titel, anzahl) {
    const letzte = runden.slice(-anzahl).reverse();
    const verlauf = el("div");
    if (!letzte.length) verlauf.append(el("p", { class: "leise-text", text: "Noch keine Runde gespielt." }));
    for (const e of letzte) {
      const d = el("details", {}, el("summary", { text: `${datum(e.zeit)} · ${spielName(e.spiel)} · Stufe ${stufeName(e.stufe)} · ${e.mix ? "🎲 im Zufallsmix" : "★".repeat(e.sterne)} · ${e.fehler} Fehler${e.tipps ? ` · 💡 ${e.tipps} Tipp${e.tipps === 1 ? "" : "s"}` : ""}${e.bedienhilfe ? " · ❓ Hilfe" : ""}${e.test ? " · 🧪 Test" : ""}${e.hilfe ? " · 🔑 mit Hilfe" : ""}` }));
      if (e.fehlerAufgaben.length) {
        d.append(el("ul", {}, ...e.fehlerAufgaben.map(f => el("li", {},
          el("div", { text: f.text || "(Aufgabe)" }),
          el("div", { class: "leise-text", text: `${f.versuche} Fehlversuch${f.versuche === 1 ? "" : "e"} · ${f.geloest ? "dann gelöst" : "Lösung gezeigt"}${f.loesung ? " · " + f.loesung : ""}` })))));
      } else {
        d.append(el("p", { class: "gut", text: "Alles auf Anhieb richtig!" }));
      }
      verlauf.append(d);
    }
    return karte(el("h2", { text: titel }), verlauf);
  }

  // ----- Ein Kind (Entscheid ST1 a, LERN_Session12) -----
  // Es sieht, worauf es selbst handeln kann: was es als Nächstes übt, seine Woche, seine Runden, seine Meldungen.
  // Auswertungen für Erwachsene (Lernzeiten, Konzentration, Vorgehen, Lernziele, Sterne, Daten) sieht nur die Aufsicht;
  // Endlos-Plätze stehen im Tab Erfolge (ST2 a).
  if (!aufsicht) {
    seite.append(karte(el("h2", { text: "🦉 Das übe ich als Nächstes" }),
      // Das freundliche Fazit erst, wenn die Aufsicht es freigegeben hat (Entscheid G3, Profil-Feld fazitFuerKind)
      p.fazitFuerKind ? el("ul", { class: "fazit-kind" }, ...AUSWERTUNG.fazitFuerKind(runden, p, Date.now(), meine).map(s => el("li", { text: s }))) : null,
      vorschlagListe(AUSWERTUNG.vorschlaege(gewaehlt, runden, p).slice(0, 4))));
    seite.append(lernplanKarte("📅 Meine Woche"), rundenKarte("🔁 Meine Runden", 15));
    if (meine.length) seite.append(meldungenKarte());
    return;
  }

  seite.append(karte(
    kopf,
    el("p", { class: "leise-text", style: "margin:0 0 12px", text: `${LS.spielerName(gewaehlt)} · ${profilText}` + (p.fokus.length ? ` · Fokus: ${p.fokus.join(", ")}` : "") }),
    el("div", { class: "kacheln" },
      kachel(String(runden.length), "Runden gespielt"),
      kachel(`${minuten} min`, "Spielzeit"),
      kachel(prozent(mittel(runden.map(anhieb))), "Aufgaben auf Anhieb richtig"),
      kachel(String(runden.reduce((s, e) => s + e.fehlerAufgaben.filter(f => !f.geloest).length, 0)), "Aufgaben mit Lösung gezeigt"))));

  // ----- Fazit in Worten (AUSWERTUNG.fazit, LERN_Session9) -----
  // Die Aufsicht sieht das ganze Fazit; dem Kind gibt sie eine freundliche Fassung frei (Entscheid G3,
  // Profil-Feld fazitFuerKind, Vorgabe aus).
  {
    const f = AUSWERTUNG.fazit(runden, p, Date.now(), meine);
    const freigabe = el("button", { type: "button", class: "chip", "aria-pressed": String(!!p.fazitFuerKind),
      text: p.fazitFuerKind ? `👀 ${LS.spielerName(gewaehlt)} sieht ein freundliches Fazit` : `👀 Fazit für ${LS.spielerName(gewaehlt)} freigeben`,
      onclick: () => { LS.speichereProfil(gewaehlt, { fazitFuerKind: !p.fazitFuerKind }); neu(); } });
    seite.append(karte(
      el("div", { class: "fazit-kopf" }, el("h2", { text: `Fazit — ${gewaehlt}` }), freigabe),
      el("p", { class: "fazit-kurz", text: f.kurz }),
      ...f.abschnitte.map(a => el("div", { class: "fazit-abschnitt" },
        el("h3", { text: a.titel }), el("ul", {}, ...a.saetze.map(s => el("li", { text: s }))))),
      f.genug ? el("p", { class: "leise-text", text: `Regelbasiert aus den gespielten Runden, ohne KI; jede Aussage nennt ihre Zahlen. Ein Thema braucht mindestens ${AUSWERTUNG.FAZIT.minAufgaben} Aufgaben in ${AUSWERTUNG.FAZIT.minRunden} Runden, bevor es beurteilt wird. Die Grenzen sind Annahmen, bis Erfahrungen mit Kindern vorliegen.` }) : null,
      p.fazitFuerKind ? el("details", {}, el("summary", { text: `So liest es ${LS.spielerName(gewaehlt)}` }),
        el("ul", {}, ...AUSWERTUNG.fazitFuerKind(runden, p, Date.now(), meine).map(s => el("li", { text: s })))) : null));
  }

  if (meine.length) seite.append(meldungenKarte());

  // ----- Auswertung und Vorschläge -----
  seite.append(karte(
    el("h2", { text: `Das empfehle ich für ${gewaehlt}` }),
    vorschlagListe(AUSWERTUNG.vorschlaege(gewaehlt, runden, p).slice(0, 8))));

  // ----- Wann wird gelernt -----
  const lz = AUSWERTUNG.lernzeiten(runden);
  const minFormat = m => m >= 1 ? `${Math.round(m)}′` : "<1′";
  seite.append(karte(
    el("h2", { text: "Wann wird gelernt?" }),
    el("p", { class: "leise-text", style: "margin-top:0", text: `Minuten Spielzeit. In den letzten 14 Tagen an ${lz.uebungstage14} Tag${lz.uebungstage14 === 1 ? "" : "en"} geübt.` }),
    el("div", { class: "diagramme" },
      el("div", {}, el("h3", { text: "Letzte 14 Tage" }), saeulen(lz.tage.map(t => ({ name: t.name, wert: t.minuten, titel: `${t.lang}: ${minFormat(t.minuten)} in ${t.runden} Runden` })), minFormat, { hoehe: 90 })),
      el("div", {}, el("h3", { text: "Wochentage (gesamt)" }), saeulen(lz.wochentage.map(t => ({ name: t.name, wert: t.minuten, titel: `${t.name}: ${minFormat(t.minuten)} in ${t.runden} Runden` })), minFormat, { hoehe: 90 })),
      el("div", {}, el("h3", { text: "Tageszeit (Uhr)" }), saeulen(lz.fenster.map(t => ({ name: t.name, wert: t.minuten, titel: `${t.name} Uhr: ${minFormat(t.minuten)} in ${t.runden} Runden` })), minFormat, { hoehe: 90 })))));

  // ----- Lernplan: Wochen — Regelmässigkeit -----
  seite.append(lernplanKarte("📅 Lernplan"));

  // ----- Konzentration -----
  const k = AUSWERTUNG.konzentration(runden);
  const zeitFormat = x => `${Math.round(x * 100)} %`;
  seite.append(karte(
    el("h2", { text: "Konzentration" }),
    !k.genug
      ? el("p", { class: "leise-text", text: "Dafür braucht es mindestens 3 Runden mit Zeitmessung." })
      : el("div", {},
          el("p", { class: "leise-text", style: "margin-top:0", text: "Zeit je Aufgabe im Vergleich zur eigenen üblichen Zeit im selben Spiel und derselben Stufe (100 % = wie üblich, höher = langsamer), und Anteil Aufgaben mit Fehler. Orange = auffällig, gestrichelt = übliche Zeit." }),
          k.befunde.length
            ? el("div", { class: "befund" }, ...k.befunde.map(b => el("p", { text: "⚠ " + b.text })))
            : el("p", { class: "gut", text: "✓ Keine Hinweise auf nachlassende Konzentration." }),
          el("div", { class: "diagramme" },
            el("div", {}, el("h3", { text: "Zeit nach Aufgabe in der Runde" }),
              saeulen(k.nachPosition.map(x => ({ name: `${x.pos}.`, wert: x.zeit, titel: `${x.pos}. Aufgabe: ${zeitFormat(x.zeit)} der üblichen Zeit (${x.n} Messungen)` })), zeitFormat, { hoehe: 90, referenz: 1, markiere: i => k.nachPosition[i].zeit > 1.2 })),
            el("div", {}, el("h3", { text: "Fehler nach Aufgabe in der Runde" }),
              saeulen(k.nachPosition.map(x => ({ name: `${x.pos}.`, wert: x.fehler, titel: `${x.pos}. Aufgabe: ${prozent(x.fehler)} mit Fehler` })), prozent, { hoehe: 90, markiere: i => k.nachPosition[i].fehler >= 0.3 })),
            el("div", {}, el("h3", { text: "Auf Anhieb richtig nach Runde der Sitzung" }),
              saeulen(k.nachRunde.map(x => ({ name: x.runde, wert: x.anhieb, titel: `${x.runde} Runde: ${prozent(x.anhieb)} auf Anhieb richtig (${x.n} Runden)` })), prozent, { hoehe: 90 }))))));

  // ----- Vorgehen (ctx.vorgehen; LERN_Session7) -----
  const vg = AUSWERTUNG.vorgehen(runden);
  if (vg.length) {
    const LETZTE = 12;
    seite.append(karte(
      el("h2", { text: "Vorgehen" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Wie Aufgaben angegangen werden — nicht nur ob richtig, sondern wie. Punkte: die letzten Aufgaben, die neueste rechts." }),
      ...vg.map(v => {
        const wert = id => v.werte.find(w => w.id === id);
        const letzte = v.folge.slice(-LETZTE);
        const gutZuletzt = letzte.filter(x => wert(x)?.ton === "gut").length;
        return el("div", { class: "vorgehen" },
          el("h3", { text: `${v.titel} (${v.spiele.map(spielName).join(", ")})` }),
          el("p", { class: "leise-text", style: "margin:0 0 6px", text: v.erklaerung }),
          el("div", { class: "vorgehen-punkte", "aria-label": `Letzte ${letzte.length}: ${letzte.map(x => wert(x)?.text || x).join(", ")}` },
            ...letzte.map(x => el("span", { class: `vorgehen-punkt vp-${wert(x)?.ton || "schwach"}`, title: wert(x)?.text || x }))),
          el("p", { style: "margin:6px 0 0", text: `Zuletzt ${gutZuletzt} von ${letzte.length} ${v.werte.filter(w => w.ton === "gut").map(w => w.text).join(" oder ")}. Insgesamt: ` +
            v.werte.filter(w => v.anzahl[w.id]).map(w => `${w.text} ${v.anzahl[w.id]}`).join(" · ") }));
      })));
  }

  // ----- Je Lernziel -----
  const zeilen = LERNZIELE.map(lz => {
    const r = rundenZuLernziel(runden, lz.lz);
    const q = mittel(r.map(anhieb));
    const beste = r.reduce((m, e) => Math.max(m, e.sterne), 0);
    const zuletzt = r.length ? datum(r[r.length - 1].zeit) : "—";
    const status = !r.length ? el("span", { class: "leise-text", text: "noch nicht geübt" })
      : q < 0.7 ? el("span", { class: "wackelt", text: "⚠ üben" })
      : el("span", { class: "gut", text: "✓ sitzt" });
    return el("tr", {},
      el("td", { html: `${p.fokus.includes(lz.lz) ? "⭐ " : ""}<b>${lz.lz}</b> ${lz.text}` }),
      el("td", { class: "zahl", text: String(r.length) }),
      el("td", { class: "zahl", text: prozent(q) }),
      el("td", { class: "sterne", text: beste ? "★".repeat(beste) : "" }),
      el("td", { text: zuletzt }),
      el("td", {}, status));
  });
  seite.append(karte(
    el("h2", { text: `Lernziele — ${gewaehlt}` }),
    el("p", { class: "leise-text", style: "margin-top:0", text: "Gezählt werden Runden in den Stufen, die zum Lernziel gehören (meist Stufe 3 und 4). „Üben“ heisst: weniger als 70 % auf Anhieb richtig." }),
    el("div", { class: "tabelle-rahmen" }, el("table", {},
      el("thead", {}, el("tr", {}, ...["Lernziel", "Runden", "Anhieb", "Beste", "Zuletzt", ""].map((t, i) => el("th", { class: i === 1 || i === 2 ? "zahl" : "", text: t })))),
      el("tbody", {}, ...zeilen)))));

  // ----- Je Spiel und Stufe (gespielte Spiele) -----
  const gespielteSpiele = SPIELE.filter(s => runden.some(e => e.spiel === s.id));
  const spielZeilen = gespielteSpiele.map(s => el("tr", {},
    el("td", { text: `${s.bild} ${s.name}` }),
    ...SKALA.map(st => {
      const r = runden.filter(e => e.spiel === s.id && e.stufe === st.id);
      const beste = r.reduce((m, e) => Math.max(m, e.sterne), 0);
      return el("td", { class: "sterne", title: `${r.length} Runde${r.length === 1 ? "" : "n"}`, html: beste ? "★".repeat(beste) : '<span class="leise-text">·</span>' });
    })));
  seite.append(karte(
    el("h2", { text: "Beste Sterne je Spiel und Stufe" }),
    gespielteSpiele.length ? el("div", { class: "tabelle-rahmen" }, el("table", {},
      el("thead", {}, el("tr", {}, el("th", { text: "Spiel" }), ...SKALA.map(st => el("th", { text: `${st.icon} ${st.nr}` })))),
      el("tbody", {}, ...spielZeilen))) : el("p", { class: "leise-text", text: "Noch keine Runde gespielt." })));

  // ----- Endlos-Rekorde und Rangliste (Vorgabe Patrik 2026-10-31) -----
  // Je Spiel, Stufe und Timer (ohne / mit Sekunden) der beste Wert und der Platz unter allen Kindern.
  const modi = new Map();
  for (const e of LS.rekorde()) {
    if (e.name !== gewaehlt || (!zeigeTest && e.test)) continue;
    const k = `${e.spiel}|${e.stufe}|${e.timer ?? ""}`;
    if (!modi.has(k) || e.punkte > modi.get(k).punkte) modi.set(k, e);
  }
  const rekordZeilen = [...modi.values()]
    .sort((a, b) => spielName(a.spiel).localeCompare(spielName(b.spiel), "de") || a.stufe.localeCompare(b.stufe))
    .map(e => {
      const rang = LS.ranglisteFuer(e.spiel, e.stufe, e.timer ?? null);
      const platz = rang.findIndex(r => r.name === gewaehlt) + 1;
      return el("tr", {},
        el("td", { text: spielName(e.spiel) }),
        el("td", { text: stufeName(e.stufe) }),
        // Zufallsmix: timer true (Startzeiten je Spiel verschieden), sonst die Startzeit in Sekunden
        el("td", { text: typeof e.timer === "number" ? `⏱ ${e.timer} s` : e.timer ? "⏱ an" : "ohne" }),
        el("td", { class: "zahl", text: String(e.punkte) }),
        el("td", { text: platz ? `${platz}. von ${rang.length}` : "—" }),
        el("td", { class: "leise-text", text: rang.slice(0, 3).map((r, i) => `${i + 1}. ${r.name} ${r.punkte}`).join(" · ") }));
    });
  seite.append(karte(
    el("h2", { text: "♾ Endlos-Rekorde" }),
    el("p", { class: "leise-text", style: "margin-top:0", text: "Im Endlos-Modus zählt, wie viele Aufgaben hintereinander ohne Fehler gelingen. Rangliste: bester Wert je Kind; verglichen wird nur bei gleicher Stufe und gleichem Timer." }),
    rekordZeilen.length
      ? el("div", { class: "tabelle-rahmen" }, el("table", {},
          el("thead", {}, el("tr", {}, ...["Spiel", "Stufe", "Timer", "Rekord", "Platz", "Beste"].map((t, i) => el("th", { class: i === 3 ? "zahl" : "", text: t })))),
          el("tbody", {}, ...rekordZeilen)))
      : el("p", { class: "leise-text", text: "Noch keine Endlos-Runde gespielt. Im Spiel unter den Stufen: ♾ Endlos." })));

  // ----- Vergleich (nur Aufsicht) -----
  const kinder = namen.filter(n => !LS.istAufsicht(n) || zeigeTest);
  if (aufsicht && kinder.length > 1) {
    const vergleich = LERNZIELE.map(lz => el("tr", {},
      el("td", { html: `<b>${lz.lz}</b> ${lz.text}` }),
      ...kinder.map(n => {
        const r = rundenZuLernziel(alle.filter(e => e.name === n), lz.lz);
        if (!r.length) return el("td", { class: "zelle", html: '<span class="leise-text">—</span>' });
        const q = mittel(r.map(anhieb));
        const i = Math.min(4, Math.floor(q * 5));
        const td = el("td", { class: "zelle" + (i >= 3 ? " hell-text" : ""), title: `${n}: ${prozent(q)} auf Anhieb richtig in ${r.length} Runde${r.length === 1 ? "" : "n"}` },
          prozent(q), el("small", { text: `${r.length} Runde${r.length === 1 ? "" : "n"}` }));
        td.style.background = `var(--seq-${i + 1})`;
        return td;
      })));
    const legende = el("div", { class: "legende" }, "Anteil auf Anhieb richtig:", "0 %",
      ...[1, 2, 3, 4, 5].map(i => { const x = el("i"); x.style.background = `var(--seq-${i})`; return x; }), "100 %");
    seite.append(karte(
      el("h2", { text: "Vergleich" }),
      el("div", { class: "tabelle-rahmen" }, el("table", {},
        el("thead", {}, el("tr", {}, el("th", { text: "Lernziel" }), ...kinder.map(n => el("th", { style: "text-align:center", text: LS.spielerName(n) })))),
        el("tbody", {}, ...vergleich))),
      legende));
  }

  seite.append(rundenKarte("Letzte Runden", 30));

  // ----- Daten (nur Aufsicht) -----
  const knopf = (text, onclick) => el("button", { class: "knopf hell klein", type: "button", text, onclick });
  const zeile = (...k) => el("div", { class: "knopfzeile", style: "justify-content:flex-start" }, ...k);
  const datei = el("input", { type: "file", accept: "application/json", style: "display:none" });
  datei.addEventListener("change", async () => {
    const f = datei.files[0];
    if (!f) return;
    // Zusammenführen: Was auf diesem Gerät gespielt wurde, bleibt; dazu kommt, was nur in der Datei steht.
    let r;
    try { r = await LS.abgleich.dateiEinlesen(f); } catch { alert("Diese Datei kann ich nicht lesen."); return; } finally { datei.value = ""; }
    alert(LS.abgleich.ergebnisText(r));
    neu();
  });
  const gespielt = [...new Set(LS.protokoll().filter(e => e.name === gewaehlt).map(e => e.spiel))]
    .map(id => SPIELE.find(s => s.id === id)).filter(Boolean);
  const welche = el("select", { "aria-label": "Welcher Spielstand" },
    el("option", { value: "", text: "alle Spiele" }),
    ...gespielt.map(s => el("option", { value: s.id, text: `${s.bild} ${s.name}` })));
  seite.append(karte(
    el("h2", { text: "Daten" }),
    el("p", { class: "leise-text", style: "margin-top:0", text: "Alles bleibt in diesem Browser auf diesem Gerät. Spielt ein Kind auf mehreren Geräten: auf dem einen sichern, die Datei hinüberschicken und auf dem anderen einlesen — die Runden werden zusammengeführt, nichts geht verloren. Von selbst geht es mit einem Abgleich-Ordner (Verwaltung)." + (zeigeTest ? "" : " Aufsicht-Konten und Testrunden werden nur mitgesichert, wenn die Testrunden eingeblendet sind.") }),
    zeile(
      knopf("💾 Alle sichern", () => sichern(LS.spielerListe().filter(sichtbarerSpieler))),
      knopf(`💾 Nur ${gewaehlt} sichern`, () => sichern([gewaehlt])),
      knopf("📂 Einlesen", () => datei.click())),
    el("h3", { text: `Spielstand von ${gewaehlt} zurücksetzen` }),
    el("p", { class: "leise-text", style: "margin-top:0", text: "Löscht die gespielten Runden und Sterne. Name, Klasse und Einstellungen bleiben. Tipp: vorher sichern." }),
    zeile(welche, knopf("↺ Zurücksetzen", () => {
      const spiel = SPIELE.find(s => s.id === welche.value);
      if (confirm(spiel ? `Alle Runden von ${gewaehlt} in «${spiel.name}» löschen?` : `Alle Runden von ${gewaehlt} löschen? Name und Einstellungen bleiben.`)) {
        LS.loescheRunden(gewaehlt, welche.value || null);
        neu();
      }
    })),
    datei));

  /** Profile und Runden der genannten Personen als JSON-Datei; PIN-Hashes bleiben auf dem Gerät. */
  function sichern(wer) {
    // Version 3 (LERN_Session15): Personen mit Kennung, ohne PIN und Wiederherstellung; Einträge über die Kennung
    const personen = wer.map(n => LS.person(n)).filter(Boolean).map(p => LS.ohneGeheimnis(p));
    const profile = Object.fromEntries(personen.map(p => [p.name, p]));
    const gehoert = e => personen.some(p => LS.gehoert(e, p));
    const daten = { version: 3, gesichert: new Date().toISOString(), personen,
      protokoll: LS.protokoll().filter(e => sichtbareRunde(e) && gehoert(e)),
      rekorde: LS.rekorde().filter(e => sichtbareRunde(e) && gehoert(e)),
      meldungen: LS.meldungen().filter(gehoert) };
    // Das Muster lernspiele-*.json hält .gitignore aus dem Repo heraus.
    const namen = Object.keys(profile).map(n => n.replace(/[^\p{L}\p{N}_-]+/gu, "_")).filter(Boolean).join("-");
    const dateiname = `lernspiele-${namen ? namen + "-" : ""}${new Date().toISOString().slice(0, 10)}.json`;
    const a = el("a", { href: URL.createObjectURL(new Blob([JSON.stringify(daten, null, 2)], { type: "application/json" })), download: dateiname });
    document.body.append(a);
    a.click();
    a.remove();
  }

  /**
   * Säulendiagramm (eine Farbe, eine Reihe): Werte als Säulen mit Beschriftung darunter und Wert darüber.
   * daten: [{ name, wert, titel }]; format: Wert → Text; markiere: Index → Säule hervorheben.
   */
  function saeulen(daten, format, { hoehe = 120, referenz = null, markiere = () => false } = {}) {
    const max = Math.max(...daten.map(d => d.wert || 0), referenz || 0) || 1;
    const sb = el("div", { class: "saeulen", style: `--h:${hoehe}px` });
    if (referenz != null) {
      const linie = el("div", { class: "referenz", title: `Üblich: ${format(referenz)}` });
      linie.style.bottom = `${(referenz / max) * hoehe + 22}px`;
      sb.append(linie);
    }
    for (const [i, d] of daten.entries()) {
      const h = d.wert ? Math.max(3, (d.wert / max) * hoehe) : 0;
      const saeule = el("div", { class: "saeule" + (markiere(i) ? " betont" : "") });
      saeule.style.height = `${h}px`;
      sb.append(el("div", { class: "spalte", title: d.titel || `${d.name}: ${format(d.wert)}` },
        el("div", { class: "wert", text: d.wert ? format(d.wert) : "" }),
        saeule,
        el("div", { class: "name", text: d.name })));
    }
    return sb;
  }
}
