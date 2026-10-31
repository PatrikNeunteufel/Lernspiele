/* Tab „Statistik“. Ein Kind sieht und sichert nur seine eigenen Runden. Die Aufsicht wählt jedes
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
  const spielName = id => SPIELE.find(s => s.id === id)?.name || id;
  const stufeName = id => { const s = SKALA.find(x => x.id === id); return s ? `${s.icon} ${s.nr}` : id; };
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
    for (const n of namen) kopf.append(el("button", { type: "button", class: "chip", "aria-pressed": String(n === gewaehlt), text: LS.spielerName(n), onclick: () => { statistikVon = n; neu(); } }));
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
  const profilText = [p.alter ? `${p.alter} Jahre` : null, p.klasse ? `${p.klasse}. Klasse` : null].filter(Boolean).join(" · ") || "Profil noch ohne Alter und Klasse";

  seite.append(karte(
    kopf,
    el("p", { class: "leise-text", style: "margin:0 0 12px", text: `${LS.spielerName(gewaehlt)} · ${profilText}` + (p.fokus.length ? ` · Fokus: ${p.fokus.join(", ")}` : "") }),
    el("div", { class: "kacheln" },
      kachel(String(runden.length), "Runden gespielt"),
      kachel(`${minuten} min`, "Spielzeit"),
      kachel(prozent(mittel(runden.map(anhieb))), "Aufgaben auf Anhieb richtig"),
      kachel(String(runden.reduce((s, e) => s + e.fehlerAufgaben.filter(f => !f.geloest).length, 0)), "Aufgaben mit Lösung gezeigt"))));

  // ----- Auswertung und Vorschläge -----
  const vorschlaege = AUSWERTUNG.vorschlaege(gewaehlt, runden, p);
  seite.append(karte(
    el("h2", { text: aufsicht ? `Das empfehle ich für ${gewaehlt}` : "Das empfehle ich dir" }),
    vorschlaege.length
      ? el("div", { class: "vorschlaege" }, ...vorschlaege.slice(0, 8).map(v => el("div", { class: `vorschlag ${v.art}` },
          el("b", { text: v.titel }),
          el("p", { text: v.text }),
          v.link ? el("a", { class: "knopf gruen klein", href: v.link, text: "Jetzt üben ➜" }) : null)))
      : el("p", { class: "leise-text", text: runden.length ? "Alles im grünen Bereich — weiter so!" : "Sobald ein paar Runden gespielt sind, erscheinen hier Vorschläge." })));

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

  // ----- Letzte Runden -----
  const letzte = runden.slice(-30).reverse();
  const verlauf = el("div");
  if (!letzte.length) verlauf.append(el("p", { class: "leise-text", text: "Noch keine Runde gespielt." }));
  for (const e of letzte) {
    const d = el("details", {}, el("summary", { text: `${datum(e.zeit)} · ${spielName(e.spiel)} · Stufe ${stufeName(e.stufe)} · ${"★".repeat(e.sterne)} · ${e.fehler} Fehler${e.test ? " · 🧪 Test" : ""}${e.hilfe ? " · 🔑 mit Hilfe" : ""}` }));
    if (e.fehlerAufgaben.length) {
      d.append(el("ul", {}, ...e.fehlerAufgaben.map(f => el("li", {},
        el("div", { text: f.text || "(Aufgabe)" }),
        el("div", { class: "leise-text", text: `${f.versuche} Fehlversuch${f.versuche === 1 ? "" : "e"} · ${f.geloest ? "dann gelöst" : "Lösung gezeigt"}${f.loesung ? " · " + f.loesung : ""}` })))));
    } else {
      d.append(el("p", { class: "gut", text: "Alles auf Anhieb richtig!" }));
    }
    verlauf.append(d);
  }
  seite.append(karte(el("h2", { text: "Letzte Runden" }), verlauf));

  // ----- Daten -----
  const knopf = (text, onclick) => el("button", { class: "knopf hell klein", type: "button", text, onclick });
  const zeile = (...k) => el("div", { class: "knopfzeile", style: "justify-content:flex-start" }, ...k);
  if (!aufsicht) {
    seite.append(karte(el("h2", { text: "Meine Daten" }),
      el("p", { class: "leise-text", style: "margin-top:0", text: "Alles bleibt in diesem Browser. Sichern speichert deine Runden in einer Datei." }),
      zeile(knopf("💾 Meine Daten sichern", () => sichern([ich])))));
    return;
  }
  const datei = el("input", { type: "file", accept: "application/json", style: "display:none" });
  datei.addEventListener("change", async () => {
    const f = datei.files[0];
    if (!f) return;
    let daten;
    try {
      daten = JSON.parse(await f.text());
      if (!daten.profile || !Array.isArray(daten.protokoll)) throw new Error("Format");
    } catch { alert("Diese Datei kann ich nicht lesen."); return; } finally { datei.value = ""; }
    // Zusammenführen: Was auf diesem Gerät gespielt wurde, bleibt; dazu kommt, was nur in der Datei steht.
    const { runden: r, kinder: k } = LS.zusammenfuehren(daten);
    alert(r || k
      ? `Eingelesen: ${r} neue Runde${r === 1 ? "" : "n"}${k ? `, ${k} neue${k === 1 ? "s Kind" : " Kinder"}` : ""}. Alles andere auf diesem Gerät bleibt.`
      : "Alles aus der Datei war auf diesem Gerät schon vorhanden.");
    neu();
  });
  const gespielt = [...new Set(LS.protokoll().filter(e => e.name === gewaehlt).map(e => e.spiel))]
    .map(id => SPIELE.find(s => s.id === id)).filter(Boolean);
  const welche = el("select", { "aria-label": "Welcher Spielstand" },
    el("option", { value: "", text: "alle Spiele" }),
    ...gespielt.map(s => el("option", { value: s.id, text: `${s.bild} ${s.name}` })));
  seite.append(karte(
    el("h2", { text: "Daten" }),
    el("p", { class: "leise-text", style: "margin-top:0", text: "Alles bleibt in diesem Browser auf diesem Gerät. Spielt ein Kind auf mehreren Geräten: auf dem einen sichern, die Datei hinüberschicken und auf dem anderen einlesen — die Runden werden zusammengeführt, nichts geht verloren." + (zeigeTest ? "" : " Aufsicht-Konten und Testrunden werden nur mitgesichert, wenn die Testrunden eingeblendet sind.") }),
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
    const profile = Object.fromEntries(wer.map(n => { const { pin, ...rest } = LS.lies("profile", {})[n] || {}; return [n, rest]; }));
    const daten = { version: 1, gesichert: new Date().toISOString(), profile, protokoll: LS.protokoll().filter(e => sichtbareRunde(e) && e.name in profile) };
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
