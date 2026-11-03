/* Tab „🏅 Erfolge“ (Entscheid L1 a und Wunsch Patrik, LERN_Session10): Wochenziel des Lernplans, Wochensterne,
   Abzeichen mit Fortschritt und „Teilen“ als Bild. Rechnen tut ERFOLGE (spiele/gemeinsam/erfolge.js). */
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
  const karte = el("div", { class: "woche" + (kompakt ? " kompakt" : "") },
    el("div", { class: "woche-kopf" }, el("b", { text: "📅 Deine Woche" }), plan.plan ? el("span", { class: "leise-text", text: `Ziel: ${plan.plan.tage} Tage × ${plan.plan.minuten} min` }) : null),
    tage, el("p", { class: "woche-text", text }));
  return karte;
}

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
  g.textAlign = "center"; g.fillStyle = farbe("--text");
  g.font = "140px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif"; g.fillText(a.bild, 400, 215);
  g.font = "900 44px 'Nunito', 'Segoe UI', sans-serif"; g.fillText(a.titel, 400, 290);
  g.font = "600 24px 'Nunito', 'Segoe UI', sans-serif"; g.fillStyle = "#5b6080";
  g.fillText(a.text, 400, 332, 680);
  const datum = new Date(a.erreicht).toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" });
  g.font = "800 26px 'Nunito', 'Segoe UI', sans-serif"; g.fillStyle = farbe("--text");
  g.fillText(`${name} hat das geschafft · ${datum}`, 400, 390, 680);
  g.font = "800 20px 'Nunito', 'Segoe UI', sans-serif"; g.fillStyle = farbe("--deko-1");
  g.fillText("🦉 Eulenpfad", 400, 436);
  const blob = await new Promise(f => c.toBlob(f, "image/png"));
  const datei = new File([blob], `eulenpfad-${a.id}.png`, { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [datei] })) {
    try { await navigator.share({ files: [datei], title: `Eulenpfad: ${a.titel}`, text: `${name} hat das Abzeichen „${a.titel}“ geschafft!` }); return; } catch { /* abgebrochen → speichern anbieten */ }
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

  // Abzeichen: erreichte zuerst (neueste oben), dann offene mit Fortschritt
  const datum = iso => new Date(iso).toLocaleDateString("de-CH", { day: "numeric", month: "numeric", year: "numeric" });
  const kachel = a => {
    const k = el("div", { class: "abzeichen" + (a.erreicht ? " erreicht" : " offen") + (a.neu ? " neu" : "") },
      el("div", { class: "abzeichen-bild", text: a.bild }),
      el("b", { text: a.titel }),
      el("p", { text: a.text }),
      a.erreicht ? el("span", { class: "abzeichen-datum", text: (a.neu ? "🆕 " : "") + datum(a.erreicht) })
        : el("span", { class: "abzeichen-stand", text: `${a.ist} von ${a.soll}` }));
    if (!a.erreicht) k.append(el("div", { class: "abzeichen-balken" }, el("span", { style: `width:${Math.round(100 * a.ist / a.soll)}%` })));
    if (a.erreicht) k.append(el("button", { type: "button", class: "knopf hell klein", text: "📤 Teilen", onclick: () => teileAbzeichen(a, name) }));
    return k;
  };
  seite.append(karte(el("h2", { text: `🏅 Abzeichen: ${erreicht.length} von ${liste.length}` }),
    erreicht.length ? el("div", { class: "abzeichen-raster" }, ...erreicht.sort((a, b) => b.erreicht.localeCompare(a.erreicht)).map(kachel))
      : el("p", { class: "leise-text", text: "Noch kein Abzeichen — das erste gibt es für die erste Runde!" }),
    offen.length ? el("h3", { text: "Noch zu holen" }) : null,
    offen.length ? el("div", { class: "abzeichen-raster" }, ...offen.map(kachel)) : null));
  LS.langDruecken(seite);

  // Gesehen: Das Kind selbst merkt sich die erreichten Abzeichen; 🆕 verschwindet beim nächsten Zeichnen.
  if (!aufsicht && erreicht.some(a => a.neu)) LS.speichereProfil(name, { erfolgeGesehen: erreicht.map(a => a.id) });
}

/** Für den Tab Spiele und die Tab-Leiste: gibt es neue Abzeichen fürs Kind? */
function neueAbzeichen(name) {
  const p = LS.profil(name);
  const runden = LS.protokoll().filter(e => e.name === name && !e.test);
  return ERFOLGE.abzeichen(name, p, runden, LS.rekorde(), LS.gefundeneFehler(name)).filter(a => a.neu).length;
}
