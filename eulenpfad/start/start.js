/* Startseite: Tabs und angemeldete Person. Die Tabs zeichnen start/<tab>.js in #inhalt. */
"use strict";

const START_TABS = [
  { id: "spiele", text: "🎮 Spiele", zeichne: zeichneSpiele },
  { id: "profil", text: "👤 Profil", zeichne: zeichneProfil },
  { id: "statistik", text: "📊 Statistik", zeichne: zeichneStatistik },
  { id: "erfolge", text: "🏅 Erfolge", zeichne: zeichneErfolge },
  { id: "verwaltung", text: "⚙️ Verwaltung", zeichne: zeichneVerwaltung, nurAufsicht: true },
];

{
  const h1 = document.querySelector(".titel h1");
  // Name der Sammlung (Entscheid N1 a, LERN_Session5; Swissreg ohne Treffer am 2026-11-01)
  for (const b of "Eulenpfad") h1.append(LS.el("span", { text: b, "aria-hidden": "true" }));
}

/** Gewählter Tab aus der Adresse; Verwaltung nur für die Aufsicht. */
function aktuellerTab() {
  const id = location.hash.slice(1).split("/")[0]; // #verwaltung/konten: Untertab nach dem Schrägstrich
  const tab = START_TABS.find(t => t.id === id && (!t.nurAufsicht || LS.aufsichtAngemeldet()));
  return tab || START_TABS[0];
}

/** Auswahl oben rechts: angemeldet als … — wechseln oder abmelden. */
function werWahl() {
  const { el } = LS;
  const jetzt = LS.aktuellerSpieler();
  const wahl = el("select", { "aria-label": "Angemeldet als" },
    ...LS.kinderListe().map(n => el("option", { value: n, text: n })),
    ...LS.aufsichtListe().map(n => el("option", { value: "aufsicht:" + n, text: LS.spielerName(n) })),
    el("option", { value: "abmelden", text: "↩ Abmelden" }));
  wahl.value = LS.istAufsicht(jetzt) ? "aufsicht:" + jetzt : jetzt;
  wahl.addEventListener("change", () => {
    const v = wahl.value;
    if (v === "abmelden") { LS.abmelden(); return zeichneStart(); }
    // Die Aufsicht braucht die PIN: über die Anmeldung, dort gleich mit dem gewählten Namen.
    if (v.startsWith("aufsicht:")) { LS.abmelden(); return zeichneStart(v.slice(9)); }
    LS.setzeSpieler(v);
    zeichneStart();
  });
  return el("label", { class: "wer" }, el("span", { text: "Angemeldet:" }), wahl);
}

/** Ganze Seite neu zeichnen; mitAufsicht: in der Anmeldung gleich die PIN dieser Aufsicht abfragen. */
function zeichneStart(mitAufsicht = null) {
  const { el } = LS;
  const leiste = document.getElementById("leiste");
  const inhalt = document.getElementById("inhalt");
  leiste.innerHTML = "";
  inhalt.innerHTML = "";
  if (location.hash === "#anmelden") { LS.abmelden(); history.replaceState(null, "", location.pathname); }
  if (!LS.aktuellerSpieler()) return zeichneAnmeldung(inhalt, mitAufsicht, () => zeichneStart());

  const tab = aktuellerTab();
  const tabs = el("nav", { class: "tabs", role: "tablist" });
  // Fehlermeldungen (LERN_Session9): neue Antwort fürs Kind 🔔 bei der Statistik, neue Meldung 🙋 bei der Verwaltung.
  const ich = LS.aktuellerSpieler();
  const zeichen = {
    statistik: !LS.istAufsicht(ich) && LS.ungeleseneMeldungen(ich).length ? " 🔔" : "",
    verwaltung: LS.meldungen().some(m => m.status === "neu") ? " 🙋" : "",
    erfolge: !LS.istAufsicht(ich) && neueAbzeichen(ich) ? " 🆕" : "", // neue Abzeichen (LERN_Session10)
  };
  for (const t of START_TABS) {
    if (t.nurAufsicht && !LS.aufsichtAngemeldet()) continue;
    tabs.append(el("a", { class: "tab", role: "tab", href: "#" + t.id, "aria-selected": String(t === tab), text: t.text + (zeichen[t.id] || "") }));
  }
  leiste.append(tabs, werWahl());
  abgleichKnopf(leiste);
  tab.zeichne(inhalt, zeichneStart);
}

/**
 * Abgleich (Entscheid S1 a): Ist ein Ordner gewählt, aber der Browser will vor dem Zugriff gefragt werden,
 * steht oben ein Knopf — die Erlaubnis gibt es nur nach einem Tippen.
 */
async function abgleichKnopf(leiste) {
  const h = await LS.abgleich.ordner();
  if (!h || (await h.queryPermission({ mode: "readwrite" }).catch(() => "denied")) === "granted") return;
  const k = LS.el("button", { type: "button", class: "knopf hell klein", text: "🔄 Abgleichen",
    title: "Daten der anderen Geräte holen und die eigenen dorthin schreiben",
    onclick: async () => { const r = await LS.abgleich.jetzt(true); if (r.status === "ok") k.remove(); } });
  leiste.append(k);
}

addEventListener("hashchange", () => zeichneStart());
// Kam beim Abgleich etwas dazu (Runden, Rekorde, Kinder): neu zeichnen, ausser jemand tippt gerade etwas ein.
addEventListener("lernspiele:abgeglichen", () => {
  if (!document.activeElement?.matches("input, select, textarea")) zeichneStart();
});
zeichneStart();
