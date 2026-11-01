/* Zufallsmix (Entscheid M1 a, LERN_Session5): Aufgaben aus mehreren Spielen in einer Runde oder einer
   Endlos-Serie. Die Spiele laufen unverändert je in einem iframe (?mix=1) und stellen eine Aufgabe nur,
   wenn diese Seite sie verlangt; jedes Ergebnis melden sie zurück. Einstellungen, Wechsel zwischen den
   Spielen, Ende, Protokoll (je Spiel ein Eintrag mit mix) und Rekord (spiel "mix:<Auswahl>") führt allein
   diese Seite.
   Nachrichten { lern: "mix", typ, … } — Spiel → Mix: bereit, ergebnis { zeit, fehler, hilfen,
   fehlerAufgabe }, erschoepft, geht-nicht; Mix → Spiel: aufgabe { geschafft }, ton { an }. */
"use strict";

const MIX = {
  spieleJeRunde: 6,          // so viele Spiele mischt eine Runde, jedes in seinem iframe
  laengen: [10, 20, "endlos"], // Aufgaben je Runde; endlos = bis zum ersten Fehler
  amStueck: [1, 3],          // Aufgaben am Stück aus einem Spiel, bevor es wechselt
};
const MIX_VORGABE = { faecher: [], fokus: false, stufe: "passend", timer: false, laenge: 10, amStueck: 3 };

const buehne = document.querySelector(".buehne");
let laufend = null; // laufende Runde: { ton(an) }

LS.tonSchalter(document.querySelector(".kopf .ton"), an => laufend?.ton(an));

const istEndlos = e => e.laenge === "endlos";

/** Zuletzt gewählte Einstellungen des Kindes (Profil), ergänzt um die Vorgaben. */
function einstellungen(name) {
  const e = { ...MIX_VORGABE, ...(LS.profil(name).mix || {}) };
  if (!LS.profil(name).fokus.length) e.fokus = false;
  return e;
}

/** Auswahl als Teil der Rekord-Kennung: alle, fokus und/oder Fächer mit + (sortiert). */
function auswahlSchluessel(e) {
  const teile = [...(e.fokus ? ["fokus"] : []), ...[...e.faecher].sort()];
  return teile.length ? teile.join("+") : "alle";
}
const rekordKennung = e => LS.MIX_PRAEFIX + auswahlSchluessel(e);

/**
 * Spiele, die zur Einstellung passen, je mit ihrer Stufe: frei für das Kind, im gewählten Fach und Fokus,
 * die Stufe angeboten — „passend“ ist die empfohlene Stufe je Spiel (sonst 3) —, im Endlos-Mix nur
 * Stufen mit Endlos-Modus (Katalog endlos).
 */
function kandidaten(name, e) {
  const fokus = LS.profil(name).fokus;
  const fachVon = s => THEMEN.find(t => t.id === s.thema)?.fach;
  return SPIELE.filter(s => LS.spielSichtbar(s.id)
      && (!e.faecher.length || e.faecher.includes(fachVon(s)))
      && (!e.fokus || s.lernziele.some(l => fokus.includes(l.lz))))
    .map(s => ({ s, stufe: e.stufe === "passend" ? LS.empfohleneStufe(name, s.id) || "s3" : e.stufe }))
    .filter(x => x.s.stufen.includes(x.stufe) && (!istEndlos(e) || (x.s.endlos || []).includes(x.stufe)));
}

function ohneAnmeldung() {
  const karte = LS.el("div", { class: "karte mitte" });
  const eule = LS.euleZeile();
  karte.append(eule.element, LS.el("div", { class: "knopfzeile" },
    LS.el("a", { class: "knopf", href: "index.html#anmelden", text: "Zur Startseite" })));
  buehne.append(karte);
  eule.sag("Hallo! Melde dich zuerst auf der Startseite an.");
}

// ---------- Einstellungen ----------

function zeichneEinstellungen() {
  const { el } = LS;
  laufend = null;
  buehne.innerHTML = "";
  const name = LS.aktuellerSpieler();
  if (!name) return ohneAnmeldung();
  const e = einstellungen(name);
  const fokus = LS.profil(name).fokus;
  const setze = daten => { LS.speichereProfil(name, { mix: { ...e, ...daten } }); LS.ton("tipp"); zeichneEinstellungen(); };
  const chip = (text, aktiv, onclick) => el("button", { type: "button", class: "chip", "aria-pressed": String(aktiv), onclick }, text);
  const zeile = (titel, ...chips) => el("div", { class: "filter-zeile" }, el("span", { text: titel }), ...chips);
  const umschalten = (liste, wert) => (liste.includes(wert) ? liste.filter(x => x !== wert) : [...liste, wert]);

  const karte = el("div", { class: "karte" });
  const eule = LS.euleZeile();
  karte.append(eule.element, el("div", { class: "filter mix-filter" },
    zeile("Fächer", chip("Alle", !e.faecher.length, () => setze({ faecher: [] })),
      ...FAECHER.map(f => chip(f, e.faecher.includes(f), () => setze({ faecher: umschalten(e.faecher, f) }))),
      ...(fokus.length ? [chip("⭐ Mein Fokus", e.fokus, () => setze({ fokus: !e.fokus }))] : [])),
    zeile("Stufe", chip("👍 passend für mich", e.stufe === "passend", () => setze({ stufe: "passend" })),
      ...LS.SKALA.map(s => chip(`${s.icon} ${s.nr} ${s.name}`, e.stufe === s.id, () => setze({ stufe: s.id })))),
    zeile("Timer", chip("aus", !e.timer, () => setze({ timer: false })), chip("⏱ an", e.timer, () => setze({ timer: true }))),
    zeile("Länge", ...MIX.laengen.map(l => chip(l === "endlos" ? "♾ Endlos" : `${l} Aufgaben`, e.laenge === l, () => setze({ laenge: l })))),
    zeile("Wechsel", ...MIX.amStueck.map(n => chip(n === 1 ? "nach jeder Aufgabe" : `nach ${n} Aufgaben`, e.amStueck === n, () => setze({ amStueck: n }))))));

  const n = kandidaten(name, e).length;
  karte.append(
    el("p", { class: "leise mitte", text: n
      ? `${n} Spiel${n === 1 ? " passt" : "e passen"}, gemischt ${n === 1 ? "wird es" : `werden ${Math.min(n, MIX.spieleJeRunde)} davon`}.`
      : "Für diese Auswahl gibt es kein freigegebenes Spiel." }),
    el("div", { class: "knopfzeile" },
      el("button", { class: "knopf gruen", type: "button", text: "🎲 Los geht's", ...(n ? {} : { disabled: "" }), onclick: () => starte(name, e) })));
  if (istEndlos(e)) karte.append(LS.rangliste(rekordKennung(e), e.stufe, e.timer, name));
  buehne.append(karte);
  const rekord = istEndlos(e) ? LS.besterRekord(name, rekordKennung(e), e.stufe, e.timer) : 0;
  eule.sag(`Ich mische dir Aufgaben aus verschiedenen Spielen. Stell ein, wie du spielen willst!${rekord ? ` Dein Rekord hier: ${rekord}.` : ""}`);
}

// ---------- Eine Runde ----------

function starte(name, e) {
  const { el } = LS;
  const auswahl = LS.mische(kandidaten(name, e)).slice(0, MIX.spieleJeRunde);
  if (!auswahl.length) return zeichneEinstellungen();
  buehne.innerHTML = "";
  const endlos = istEndlos(e);
  const test = LS.istAufsicht(name);
  const kennung = rekordKennung(e);
  const beginn = Date.now();
  const spiele = auswahl.map(({ s, stufe }) => ({ s, stufe, bereit: false, weg: false, aufgaben: [], fehler: 0, hilfen: 0, fehlerAufgaben: [] }));
  let aktuell = null;
  let imStueck = 0;   // Aufgaben am Stück aus dem aktuellen Spiel
  let gestellt = 0;
  let geschafft = 0;  // richtig gelöste Aufgaben (Endlos: die Serie)
  let wartet = false; // das aktuelle Spiel lädt noch
  let vorbei = false;
  let zwischenstand = null; // Endlos: beim Verstecken gespeicherter Rekord, den das Ende ersetzt

  const punkte = el("div", { class: "fortschritt" + (endlos ? " endlos" : "") });
  if (endlos) punkte.textContent = "♾ 0";
  else for (let i = 0; i < e.laenge; i++) punkte.append(el("span"));
  for (const g of spiele) g.bild = el("span", { class: "mix-bild", title: g.s.name, text: g.s.bild });
  const rahmen = el("div", { class: "mix-rahmen" });
  buehne.append(el("div", { class: "mix-leiste" },
    el("div", { class: "mix-spiele" }, ...spiele.map(g => g.bild)), punkte,
    el("button", { type: "button", class: "knopf hell klein", text: "✕ Beenden", onclick: () => beende("beendet") })), rahmen);
  for (const g of spiele) {
    g.frame = el("iframe", { class: "mix-spiel", title: g.s.name,
      src: `${g.s.pfad}?stufe=${g.stufe}&mix=1&timer=${e.timer ? 1 : 0}${endlos ? "&endlos=1" : ""}` });
    g.frame.hidden = true;
    rahmen.append(g.frame);
  }
  laufend = { ton: an => { for (const g of spiele) g.frame.contentWindow?.postMessage({ lern: "mix", typ: "ton", an }, "*"); } };

  function zeigeFortschritt() {
    if (endlos) punkte.textContent = `♾ ${geschafft}`;
    else [...punkte.children].forEach((p, i) => { p.classList.toggle("fertig", i < gestellt); p.classList.toggle("aktiv", i === gestellt); });
    for (const g of spiele) { g.bild.classList.toggle("aktiv", g === aktuell); g.bild.classList.toggle("weg", g.weg); }
  }

  /** Nächstes Spiel: zufällig, nicht zweimal dasselbe hintereinander, solange es andere gibt. */
  function wechsle() {
    const frei = spiele.filter(g => !g.weg);
    if (!frei.length) return beende("leer");
    const andere = frei.filter(g => g !== aktuell);
    aktuell = LS.waehle(andere.length ? andere : frei);
    imStueck = 0;
    stelle();
  }

  /** Das aktuelle Spiel zeigen und eine Aufgabe verlangen — sobald es geladen ist. */
  function stelle() {
    if (vorbei) return;
    for (const g of spiele) g.frame.hidden = g !== aktuell;
    zeigeFortschritt();
    if (!aktuell.bereit) { wartet = true; return; }
    wartet = false;
    aktuell.frame.focus();
    aktuell.frame.contentWindow.postMessage({ lern: "mix", typ: "aufgabe", geschafft }, "*");
  }

  function buche(g, d) {
    g.aufgaben.push(d.zeit);
    g.fehler += d.fehler;
    g.hilfen += d.hilfen;
    if (d.fehlerAufgabe) g.fehlerAufgaben.push(d.fehlerAufgabe);
    gestellt++;
    if (d.zeit.geloest) geschafft++;
    // Endlos: Ende beim ersten Fehler oder „Zeit um“; Überspringen (Testhilfe) beendet die Serie nicht.
    if (endlos ? !d.zeit.geloest && !d.zeit.uebersprungen : gestellt >= e.laenge) return beende("fertig");
    if (++imStueck >= e.amStueck) wechsle(); else stelle();
  }

  // Nachrichten nur von den eigenen iframes.
  function nachricht(ev) {
    const g = spiele.find(x => x.frame.contentWindow === ev.source);
    const d = ev.data;
    if (!g || vorbei || d?.lern !== "mix") return;
    if (d.typ === "bereit") { g.bereit = true; if (g === aktuell && wartet) stelle(); }
    else if (d.typ === "geht-nicht" || d.typ === "erschoepft") { g.weg = true; zeigeFortschritt(); if (g === aktuell) wechsle(); }
    else if (d.typ === "ergebnis" && g === aktuell) buche(g, d);
  }

  const summe = (f) => spiele.reduce((n, g) => n + f(g), 0);
  const hilfen = () => summe(g => g.hilfen);
  const rekordEintrag = abgebrochen => ({
    name, zeit: new Date().toISOString(), spiel: kennung, stufe: e.stufe, timer: e.timer || null, punkte: geschafft,
    dauer: Math.round((Date.now() - beginn) / 1000), spiele: spiele.filter(g => g.aufgaben.length).map(g => g.s.id),
    ...(test ? { test: true } : {}), ...(hilfen() ? { hilfe: hilfen() } : {}), ...(abgebrochen ? { abgebrochen: true } : {}),
  });

  /**
   * Runde: je gespieltes Spiel ein Protokolleintrag mit mix (ohne Sterne, die gelten für ganze Runden).
   * Endlos: ein Rekord wie im Endlos-Modus der Spiele, nicht im Protokoll; verlassen ohne richtige
   * Aufgabe gibt keinen Eintrag (Entscheid E1 a).
   */
  function speichere(abgebrochen) {
    if (endlos) {
      if (abgebrochen && !geschafft) return;
      LS.speichereRekord(rekordEintrag(abgebrochen), zwischenstand);
      return;
    }
    const zeit = new Date().toISOString();
    for (const g of spiele.filter(x => x.aufgaben.length)) {
      LS.protokolliere({
        name, zeit, spiel: g.s.id, stufe: g.stufe, sterne: null, mix: auswahlSchluessel(e),
        fehler: g.fehler, aufgaben: g.aufgaben.length,
        dauer: Math.round(g.aufgaben.reduce((n, a) => n + a.ms, 0) / 1000),
        geordnet: LS.geordnet(name, g.s.id, g.stufe),
        timer: e.timer ? LS.timerFuer(name, g.s.id, g.stufe).sekunden : null,
        aufgabenZeiten: g.aufgaben, fehlerAufgaben: g.fehlerAufgaben,
        ...(abgebrochen ? { abgebrochen: true } : {}), ...(test ? { test: true } : {}), ...(g.hilfen ? { hilfe: g.hilfen } : {}),
      });
    }
  }

  // Verlassen mitten in der Runde: zählt bis dahin. Tablet aus (visibilitychange): im Endlos-Mix ein
  // Zwischenstand, den das Ende ersetzt; Seite weg (pagehide): endgültig.
  function beimVerstecken() {
    if (document.visibilityState !== "hidden" || vorbei || !endlos || !geschafft) return;
    const r = rekordEintrag(true);
    LS.speichereRekord(r, zwischenstand);
    zwischenstand = r;
  }
  function beimVerlassen() { if (!vorbei && gestellt) { vorbei = true; speichere(true); } }
  addEventListener("message", nachricht);
  addEventListener("pagehide", beimVerlassen);
  document.addEventListener("visibilitychange", beimVerstecken);

  function beende(grund) {
    if (vorbei) return;
    vorbei = true;
    removeEventListener("message", nachricht);
    removeEventListener("pagehide", beimVerlassen);
    document.removeEventListener("visibilitychange", beimVerstecken);
    laufend = null;
    const rekordVorher = endlos ? LS.besterRekord(name, kennung, e.stufe, e.timer) : 0;
    if (gestellt) speichere(grund === "beendet");
    rahmen.remove();
    schluss(grund, rekordVorher);
  }

  function schluss(grund, rekordVorher) {
    buehne.innerHTML = "";
    LS.ton("fertig");
    const karte = el("div", { class: "karte schluss mitte" });
    const eule = LS.euleZeile();
    const gespielt = spiele.filter(g => g.aufgaben.length);
    const liste = el("ul", { class: "mix-ergebnis" }, ...gespielt.map(g => el("li", {},
      el("span", { class: "mix-bild aktiv", text: g.s.bild }), el("span", { text: g.s.name }),
      el("b", { text: `${g.aufgaben.filter(a => a.geloest).length} von ${g.aufgaben.length}` }))));
    const knoepfe = el("div", { class: "knopfzeile" },
      el("button", { class: "knopf gruen", type: "button", text: endlos ? "♾ Nochmal" : "🎲 Nochmal", onclick: () => starte(name, e) }),
      el("button", { class: "knopf hell", type: "button", text: "Einstellungen", onclick: zeichneEinstellungen }));
    if (!gestellt) {
      karte.append(eule.element, knoepfe);
      buehne.append(karte);
      return eule.sag(grund === "leer" ? "Oh! Keines der Spiele konnte gerade eine Aufgabe stellen. Probier eine andere Einstellung." : "Bis bald!", "hinweis");
    }
    if (endlos) {
      const neuerRekord = geschafft > rekordVorher;
      if (neuerRekord) LS.konfetti();
      karte.append(el("div", { class: "auftrag", text: `♾ ${geschafft} richtig in Folge!` }), eule.element, liste,
        LS.rangliste(kennung, e.stufe, e.timer, name), knoepfe);
      buehne.append(karte);
      return eule.sag(neuerRekord ? `Neuer Rekord, ${name}! 🎉` + (rekordVorher ? ` Vorher waren es ${rekordVorher}.` : "")
        : rekordVorher ? `Dein Rekord bleibt ${rekordVorher}. Gleich nochmal?` : "Gut gemacht! Schaffst du nächstes Mal mehr?", "gut");
    }
    const fehler = summe(g => g.fehler);
    const anhieb = summe(g => g.aufgaben.filter(a => a.geloest && !a.versuche && !a.zeitUm).length);
    if (grund === "beendet") {
      karte.append(el("div", { class: "auftrag", text: `${gestellt} Aufgabe${gestellt === 1 ? "" : "n"} gespielt` }), eule.element, liste, knoepfe);
      buehne.append(karte);
      return eule.sag(`${anhieb} davon auf Anhieb richtig. Bis zum nächsten Mal!`, "gut");
    }
    const sterne = LS.sterneFuer(fehler);
    LS.konfetti();
    const st = el("div", { class: "sterne" });
    for (let i = 0; i < 3; i++) st.append(el("span", { class: i < sterne ? "" : "aus", style: i < sterne ? "color:#f5b301" : "", text: "★" }));
    karte.append(el("div", { class: "auftrag", text: `Geschafft, ${name}!` }), st, eule.element, liste, knoepfe);
    buehne.append(karte);
    eule.sag(fehler === 0 ? "Perfekt! Alles auf Anhieb richtig! 🏆"
      : `${anhieb} von ${gestellt} auf Anhieb richtig — aus ${gespielt.length} verschiedenen Spielen!`, "gut");
  }

  wechsle();
}

zeichneEinstellungen();
