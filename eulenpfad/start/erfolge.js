/* Tab „🏅 Erfolge“ (Entscheid L1 a und Wunsch Patrik, LERN_Session10): Wochenziel des Lernplans, Wochensterne,
   Abzeichen mit Stufen Bronze bis Diamant (LERN_Session11), Fortschritt und „Teilen“ als Bild. Rechnen tut ERFOLGE
   (spiele/gemeinsam/erfolge.js). */
"use strict";

/** Wochenkarte: sieben Tage als Punkte, Stand zum Ziel. kompakt: eine Zeile für den Tab Spiele. */
function wochenKarte(plan, kompakt = false) {
  const { el } = LS;
  const w = plan.aktuelle;
  const tage = el("div", { class: "woche-tage" }, ...w.tage.map(t => el("span", {
    class: "woche-tag" + (t.erfuellt ? " erfuellt" : t.runden ? " etwas" : "") + (t.heute ? " heute" : "") + (t.zukunft ? " zukunft" : ""),
    title: `${t.name}: ${Math.round(t.minuten)} min, ${t.runden} Runde${t.runden === 1 ? "" : "n"}`,
  }, el("b", { text: t.name }), el("i", { text: t.erfuellt ? "★" : t.runden ? "•" : "" }))));
  let text;
  if (!plan.plan) text = "Noch kein Wochenziel. Die Aufsicht kann in der Verwaltung eines setzen.";
  else if (w.erfuellt) text = `Wochenziel geschafft! 🌟${plan.serie > 1 ? ` ${plan.serie} Wochen in Folge.` : ""}`;
  else {
    const fehlt = plan.plan.tage - w.erfuellteTage;
    text = `${w.erfuellteTage} von ${plan.plan.tage} Tagen geschafft — noch ${fehlt} Tag${fehlt === 1 ? "" : "e"} mit ${plan.plan.minuten} Minuten bis zum Wochenstern.`;
  }
  // Warnung, wenn die Serie zu brechen droht (Wunsch Patrik, LERN_Session11); freundlich, ohne Druck.
  const g = plan.gefahr;
  const wochenText = n => `${n} Woche${n === 1 ? "" : "n"}`;
  const warnung = !g ? null : el("p", { class: "woche-warnung" + (g.verloren ? " verloren" : ""), text: g.verloren
    ? `Diese Woche reicht es nicht mehr für den Wochenstern. Deine ${wochenText(plan.serie)} in Folge bleiben gezählt — nächste Woche startest du neu! 💪`
    : g.bleiben === 1 ? `⚠️ Achtung: Nur noch heute! Übe ${plan.plan.minuten} Minuten, dann hält deine Serie von ${wochenText(plan.serie)}.`
      : `⚠️ Achtung: Deine Serie von ${wochenText(plan.serie)} hält nur, wenn du an jedem der ${g.bleiben} restlichen Tage ${plan.plan.minuten} Minuten übst.` });
  const karte = el("div", { class: "woche" + (kompakt ? " kompakt" : "") + (g && !g.verloren ? " warnt" : "") },
    el("div", { class: "woche-kopf" }, el("b", { text: "📅 Deine Woche" }), plan.plan ? el("span", { class: "leise-text", text: `Ziel: ${plan.plan.tage} Tage × ${plan.plan.minuten} min` }) : null),
    tage, el("p", { class: "woche-text", text }), warnung);
  return karte;
}

/** Farbe der Stufe für das geteilte Bild; dieselben Töne wie .abzeichen.rang-* in start.css. */
const RANG_FARBE = { bronze: "#b8743c", silber: "#8d97a5", gold: "#d9a400", platin: "#5fa8b5", diamant: "#3b9ee8" };

/** Abzeichen als Bild (PNG) teilen oder speichern; nur auf Knopfdruck, der Vorname reist mit (Annahme B1, rahmen.md 15). */
async function teileAbzeichen(a, name) {
  const css = getComputedStyle(document.documentElement);
  const farbe = v => css.getPropertyValue(v).trim() || "#5b6cff";
  const c = document.createElement("canvas");
  c.width = 800; c.height = 500;
  const g = c.getContext("2d");
  const verlauf = g.createLinearGradient(0, 0, 800, 500);
  verlauf.addColorStop(0, farbe("--deko-6")); verlauf.addColorStop(1, farbe("--deko-2"));
  g.fillStyle = verlauf; g.fillRect(0, 0, 800, 500);
  g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(40, 40, 720, 420, 36); g.fill();
  if (a.rang) { g.strokeStyle = RANG_FARBE[a.rang.id]; g.lineWidth = 10; g.beginPath(); g.roundRect(55, 55, 690, 390, 28); g.stroke(); }
  g.textAlign = "center"; g.fillStyle = farbe("--text");
  g.font = "140px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif"; g.fillText(a.bild, 400, 215);
  g.font = "900 44px 'Nunito', 'Segoe UI', sans-serif"; g.fillText(ERFOLGE.titelMitRang(a), 400, 290, 680);
  g.font = "600 24px 'Nunito', 'Segoe UI', sans-serif"; g.fillStyle = "#5b6080";
  g.fillText(a.text, 400, 332, 680);
  const datum = new Date(a.erreicht).toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" });
  g.font = "800 26px 'Nunito', 'Segoe UI', sans-serif"; g.fillStyle = farbe("--text");
  g.fillText(`${name} hat das geschafft · ${datum}`, 400, 390, 680);
  g.font = "800 20px 'Nunito', 'Segoe UI', sans-serif"; g.fillStyle = farbe("--deko-1");
  g.fillText("🦉 Eulenpfad", 400, 436);
  const blob = await new Promise(f => c.toBlob(f, "image/png"));
  const datei = new File([blob], `eulenpfad-${a.id}${a.rang ? `-${a.rang.id}` : ""}.png`, { type: "image/png" });
  const titel = ERFOLGE.titelMitRang(a);
  if (navigator.canShare && navigator.canShare({ files: [datei] })) {
    try { await navigator.share({ files: [datei], title: `Eulenpfad: ${titel}`, text: `${name} hat das Abzeichen „${titel}“ geschafft!` }); return; } catch { /* abgebrochen → speichern anbieten */ }
  }
  const url = URL.createObjectURL(blob);
  const link = LS.el("a", { href: url, download: datei.name });
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function zeichneErfolge(box, neu) {
  const { el } = LS;
  const ich = LS.aktuellerSpieler();
  const aufsicht = LS.aufsichtAngemeldet();
  const karte = (...inhalt) => el("section", { class: "karte" }, ...inhalt);
  const seite = el("div", { class: "erfolge" });
  box.append(seite);

  // Wessen Erfolge? Das Kind seine eigenen, die Aufsicht wählt ein Kind (wie in der Statistik, statistikVon).
  const kinder = aufsicht ? LS.kinderListe() : [ich];
  if (aufsicht && !kinder.includes(statistikVon)) statistikVon = kinder[0] || null;
  const name = aufsicht ? statistikVon : ich;
  const kopf = el("div", { class: "chips" });
  if (aufsicht) for (const n of kinder) kopf.append(el("button", { type: "button", class: "chip", "aria-pressed": String(n === name), text: n, onclick: () => { statistikVon = n; neu(); } }));
  if (!name) { seite.append(karte(kopf, el("p", { text: "Noch keine Kinder. In der Verwaltung ein Kind anlegen." }))); return; }

  const p = LS.profil(name);
  const runden = LS.protokoll().filter(e => e.name === name && !e.test);
  const plan = ERFOLGE.lernplan(p, runden);
  const fehlerWann = LS.meldungenVon(name).filter(m => m.status === "behoben").map(m => m.zeit).sort().pop() || null;
  const liste = ERFOLGE.abzeichen(name, p, runden, LS.rekorde(), LS.gefundeneFehler(name), fehlerWann);
  const erreicht = liste.filter(a => a.erreicht);
  const offen = liste.filter(a => !a.erreicht);

  // Wochenziel
  seite.append(karte(kopf, wochenKarte(plan),
    plan.plan ? el("div", { class: "kacheln" },
      el("div", { class: "kachel" }, el("div", { class: "zahl", text: `${plan.sterne} 🌟` }), el("div", { class: "was", text: "Wochensterne" })),
      el("div", { class: "kachel" }, el("div", { class: "zahl", text: String(plan.serie) }), el("div", { class: "was", text: "Wochen in Folge" }))) : null));

  // Abzeichen: erreichte zuerst (neueste oben), dann offene mit Fortschritt. Jedes hat Stufen Bronze … Diamant: die
  // Kachel zeigt die erreichte Stufe (Rahmenfarbe, Zeichen) und darunter den Weg zur nächsten.
  const datum = iso => new Date(iso).toLocaleDateString("de-CH", { day: "numeric", month: "numeric", year: "numeric" });
  const balken = (ist, soll) => el("div", { class: "abzeichen-balken" }, el("span", { style: `width:${Math.round(100 * ist / soll)}%` }));
  const kachel = a => {
    const k = el("div", { class: "abzeichen" + (a.erreicht ? ` erreicht rang-${a.rang.id}` : " offen") + (a.neu ? " neu" : "") },
      el("div", { class: "abzeichen-bild", text: a.bild }),
      el("b", { text: a.titel }),
      a.rang ? el("span", { class: "abzeichen-rang", text: `${a.rang.zeichen} ${a.rang.name}` }) : null,
      el("p", { text: a.text }),
      a.erreicht ? el("span", { class: "abzeichen-datum", text: (a.neu ? "🆕 " : "") + datum(a.erreicht) })
        : el("span", { class: "abzeichen-stand", text: `${a.ist} von ${a.soll} bis ${a.naechste.rang.zeichen} ${a.naechste.rang.name}` }));
    if (!a.erreicht) k.append(balken(a.ist, a.soll));
    else if (a.naechste) k.append(el("span", { class: "abzeichen-naechste", text: `Nächste Stufe ${a.naechste.rang.zeichen} ${a.naechste.rang.name}: ${a.naechste.ist} von ${a.naechste.soll}` }),
      balken(a.naechste.ist, a.naechste.soll));
    else k.append(el("span", { class: "abzeichen-naechste", text: "Höchste Stufe erreicht!" }));
    if (a.erreicht) k.append(el("button", { type: "button", class: "knopf hell klein", text: "📤 Teilen", onclick: () => teileAbzeichen(a, name) }));
    return k;
  };
  const stufenErreicht = liste.reduce((s, a) => s + a.stufe, 0);
  const stufenAlle = liste.reduce((s, a) => s + a.stufen, 0);
  seite.append(karte(el("h2", { text: `🏅 Abzeichen: ${erreicht.length} von ${liste.length}` }),
    el("p", { class: "leise-text", text: `Jedes Abzeichen hat Stufen: 🥉 Bronze, 🥈 Silber, 🥇 Gold, 🏆 Platin, 💎 Diamant. Geschafft: ${stufenErreicht} von ${stufenAlle} Stufen.` }),
    erreicht.length ? el("div", { class: "abzeichen-raster" }, ...erreicht.sort((a, b) => b.erreicht.localeCompare(a.erreicht)).map(kachel))
      : el("p", { class: "leise-text", text: "Noch kein Abzeichen — das erste gibt es für die erste Runde!" }),
    offen.length ? el("h3", { text: "Noch zu holen" }) : null,
    offen.length ? el("div", { class: "abzeichen-raster" }, ...offen.map(kachel)) : null));
  LS.langDruecken(seite);

  // Gesehen: Das Kind selbst merkt sich die erreichten Abzeichen; 🆕 verschwindet beim nächsten Zeichnen.
  if (!aufsicht && erreicht.some(a => a.neu)) LS.speichereProfil(name, { erfolgeGesehen: erreicht.map(a => a.schluessel) });
}

/** Für den Tab Spiele und die Tab-Leiste: gibt es neue Abzeichen fürs Kind? */
function neueAbzeichen(name) {
  const p = LS.profil(name);
  const runden = LS.protokoll().filter(e => e.name === name && !e.test);
  return ERFOLGE.abzeichen(name, p, runden, LS.rekorde(), LS.gefundeneFehler(name)).filter(a => a.neu).length;
}
