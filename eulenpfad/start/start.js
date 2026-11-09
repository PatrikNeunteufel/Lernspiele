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

/**
 * Personen-Knopf oben rechts (KERN.personenMenue, Entscheid PA1 a, LERN_Session17): Bild und Name der angemeldeten
 * Person; das Menü nennt die anderen Kinder und Aufsichten und, getrennt darunter, „↩ Abmelden“.
 */
function werWahl() {
  const jetzt = LS.aktuellerSpieler();
  const andere = [...LS.kinderListe(), ...LS.aufsichtListe()].filter(n => n !== jetzt && LS.angezeigt(n)); // ohne Ausgeblendete (KE1 a)
  return KERN.personenMenue({
    titel: "Angemeldet als",
    ich: { name: LS.spielerName(jetzt), bild: LS.avatarBild(jetzt, 34) },
    personen: andere.map(n => ({ id: n, name: LS.spielerName(n), bild: LS.avatarBild(n, 28),
      aria: LS.istAufsicht(n) ? `${n}, Aufsicht, mit PIN` : n })),
    waehle: n => {
      // Die Aufsicht braucht die PIN: über die Anmeldung, dort gleich mit dem gewählten Namen.
      if (LS.istAufsicht(n)) { LS.abmelden(); return zeichneStart(n); }
      LS.setzeSpieler(n);
      zeichneStart();
    },
    schluss: { text: "↩ Abmelden", aktion: () => { LS.abmelden(); zeichneStart(); } },
  });
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
    verwaltung: LS.meldungen().some(m => m.status === "neu" && !LS.istAnregung(m)) ? " 🙋" : "",
    erfolge: !LS.istAufsicht(ich) && neueAbzeichen(ich) ? " 🆕" : "", // neue Abzeichen (LERN_Session10)
  };
  for (const t of START_TABS) {
    if (t.nurAufsicht && !LS.aufsichtAngemeldet()) continue;
    tabs.append(el("a", { class: "tab", role: "tab", href: "#" + t.id, "aria-selected": String(t === tab), text: t.text + (zeichen[t.id] || "") }));
  }
  // Anleitung in der App (Wunsch Patrik, LERN_Session14): das Kind kommt zu seiner, die Aufsicht zu der für Erwachsene
  const anleitung = LS.istAufsicht(ich) ? "aufsicht.html" : "kinder.html";
  // Tabs in einer Zeile, Pfeile nur wenn nicht alle Platz haben (KERN.rolleiste, LERN_Session17)
  leiste.append(KERN.rolleiste(tabs), werWahl(), el("a", { class: "anleitung-knopf", href: `anleitung/${anleitung}?von=app`, title: "Anleitung",
    "aria-label": "Anleitung", "data-vorlesen": "Anleitung", text: "📖" }));
  abgleichKnopf(leiste);
  tab.zeichne(inhalt, zeichneStart);
  if (!LS.istAufsicht(ich) && LS.neuerAufstieg(ich)) aufstiegFeier(ich);
}

/**
 * Nachricht zum Klassenaufstieg (Wunsch Patrik, LERN_Session14): einmal nach dem Anmelden, mit Konfetti, bis das Kind
 * antippt. Das Abzeichen „Aufgestiegen“ steht danach wie jedes neue Abzeichen oben im Tab Spiele.
 */
function aufstiegFeier(name) {
  const { el } = LS;
  if (document.querySelector(".aufstieg-feier")) return; // zeichneStart läuft auch bei jedem Tabwechsel
  const a = LS.neuerAufstieg(name);
  const schliessen = () => { LS.speichereProfil(name, { aufstiegGesehen: a.zeit }); huelle.remove(); zeichneStart(); };
  const knopf = el("button", { type: "button", class: "knopf gruen", text: "Juhu! ➜", onclick: schliessen });
  const titel = `Du bist jetzt in der ${LS.klasseText(a.nach)}!`;
  const huelle = el("div", { class: "aufstieg-feier", role: "dialog", "aria-modal": "true", "aria-labelledby": "aufstieg-titel" },
    el("div", { class: "karte aufstieg-karte", "data-vorlesen": titel },
      el("div", { class: "aufstieg-bild", text: "🎉" }),
      el("h2", { id: "aufstieg-titel", text: titel }),
      el("p", { text: `Bravo, ${LS.spielerName(name)}! Die Spiele für deine neue Klasse sind jetzt markiert.` }),
      knopf));
  document.body.append(huelle);
  LS.konfetti(80);
  LS.ton?.("fertig");
  knopf.focus();
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

// Gezeichnet wird erst, wenn Runden, Rekorde, Meldungen und Löschvermerke geladen sind (Kern 1.34.0, IndexedDB)
addEventListener("hashchange", () => LS.nachBereit(() => zeichneStart()));
// Kam beim Abgleich etwas dazu (Runden, Rekorde, Kinder) oder hat ein anderer Tab Runden oder Meldungen gespeichert
// (IndexedDB): neu zeichnen, ausser jemand tippt gerade etwas ein.
const neuOhneTippen = () => { if (!document.activeElement?.matches("input, select, textarea")) zeichneStart(); };
addEventListener("lernspiele:abgeglichen", neuOhneTippen);
LS.SPEICHER.beiFremdAenderung(neuOhneTippen);
LS.nachBereit(() => zeichneStart());
