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
const MIX_VORGABE = { faecher: [], fokus: false, stufe: "passend", timer: false, laenge: 10, amStueck: 3, check: false };

/**
 * Übertritts-Check (Entscheid H1 a, LERN_Session9; docs/eulenpfad/spielideen/lehrplan_3_und_6.md, R1):
 * Mathematik und Deutsch — die Fächer, die beim Übertritt in die Oberstufe zählen (SG: Art. 24 des
 * Reglements über Beurteilung, Promotion und Übertritt) — je Spiel in der Stufe der 6. Klasse: das
 * Klassenziel (Stufe 3) der Spiele mit Basisklasse 6, Stufe 5 der Spiele mit Basisklasse 5. Mehr Spiele
 * je Runde, damit viele Teilgebiete vorkommen; am Ende ein Bericht je Thema.
 * Die Grenzen im Bericht sind Annahmen, bis Erfahrungen mit Kindern vorliegen.
 */
const UEBERTRITT = {
  klasse: 6, faecher: ["Mathe", "Deutsch"], spieleJeRunde: 8,
  stufeNachAbstand: { 0: "s3", 1: "s5" }, // Klasse 6 minus Basisklasse → Stufe
  sicher: 0.8, fast: 0.5,                 // Anteil auf Anhieb richtig je Thema
};

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
  if (e.check) return `uebertritt-${UEBERTRITT.klasse}`;
  const teile = [...(e.fokus ? ["fokus"] : []), ...[...e.faecher].sort()];
  return teile.length ? teile.join("+") : "alle";
}
const rekordKennung = e => LS.MIX_PRAEFIX + auswahlSchluessel(e);

/**
 * Spiele, die zur Einstellung passen, je mit ihrer Stufe: frei für das Kind, im gewählten Fach und Fokus,
 * die Stufe angeboten — „passend“ ist die empfohlene Stufe je Spiel (sonst 3). Der Endlos-Mix nimmt alle Spiele
 * (Wunsch Patrik, LERN_Session12): dasselbe Spiel folgt nur begrenzt aufeinander, ist es erschöpft, kommen die anderen.
 */
const fachVon = s => THEMEN.find(t => t.id === s.thema)?.fach;

function kandidaten(name, e, auchGesperrte = false) {
  // auchGesperrte: alle Spiele, die passen würden — um zu sagen, wie viele die Aufsicht noch freigeben kann.
  const sichtbar = s => auchGesperrte || LS.spielSichtbar(s.id);
  if (e.check) return SPIELE.filter(s => sichtbar(s) && UEBERTRITT.faecher.includes(fachVon(s)))
    .map(s => ({ s, stufe: UEBERTRITT.stufeNachAbstand[UEBERTRITT.klasse - s.klasse] }))
    .filter(x => x.stufe && x.s.stufen.includes(x.stufe));
  const fokus = LS.profil(name).fokus;
  return SPIELE.filter(s => sichtbar(s)
      && (!e.faecher.length || e.faecher.includes(fachVon(s)))
      && (!e.fokus || s.lernziele.some(l => fokus.includes(l.lz))))
    .map(s => ({ s, stufe: e.stufe === "passend" ? LS.empfohleneStufe(name, s.id) || "s3" : e.stufe }))
    .filter(x => x.s.stufen.includes(x.stufe));
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
  // Beim Übertritts-Check stehen Fächer und Stufe fest; die Zeilen dafür fallen weg.
  const auswahlZeilen = e.check ? [] : [
    zeile("Fächer", chip("Alle", !e.faecher.length, () => setze({ faecher: [] })),
      ...FAECHER.map(f => chip(f, e.faecher.includes(f), () => setze({ faecher: umschalten(e.faecher, f) }))),
      ...(fokus.length ? [chip("⭐ Mein Fokus", e.fokus, () => setze({ fokus: !e.fokus }))] : [])),
    zeile("Stufe", chip("👍 passend für mich", e.stufe === "passend", () => setze({ stufe: "passend" })),
      ...LS.SKALA.map(s => chip(`${s.icon} ${s.nr} ${s.name}`, e.stufe === s.id, () => setze({ stufe: s.id })))),
  ];
  karte.append(eule.element, el("div", { class: "filter mix-filter" },
    zeile("Mischung", chip("🎲 frei", !e.check, () => setze({ check: false })),
      chip(`🎒 Übertritts-Check ${UEBERTRITT.klasse}. Klasse`, e.check, () => setze({ check: true }))),
    ...auswahlZeilen,
    zeile("Timer", chip("aus", !e.timer, () => setze({ timer: false })), chip("⏱ an", e.timer, () => setze({ timer: true }))),
    zeile("Länge", ...MIX.laengen.map(l => chip(l === "endlos" ? "♾ Endlos" : `${l} Aufgaben`, e.laenge === l, () => setze({ laenge: l })))),
    zeile("Wechsel", ...MIX.amStueck.map(n => chip(n === 1 ? "nach jeder Aufgabe" : `nach ${n} Aufgaben`, e.amStueck === n, () => setze({ amStueck: n }))))));

  const n = kandidaten(name, e).length;
  const jeRunde = e.check ? UEBERTRITT.spieleJeRunde : MIX.spieleJeRunde;
  // Gesperrte Spiele, die passen würden (Hinweis Patrik, LERN_Session10: der Übertritts-Check „mischt nicht“, wenn
  // für das Kind erst ein Spiel der 5./6. Klasse freigegeben ist) — nur für Kinder, die Aufsicht sieht alle.
  const gesperrt = LS.aufsichtAngemeldet() ? 0 : kandidaten(name, e, true).length - n;
  karte.append(
    el("p", { class: "leise mitte", text: n
      ? `${n} Spiel${n === 1 ? " passt" : "e passen"}, gemischt ${n === 1 ? "wird es" : `werden ${Math.min(n, jeRunde)} davon`}.`
      : "Für diese Auswahl gibt es kein freigegebenes Spiel." }));
  if (gesperrt > 0 && n < jeRunde) karte.append(el("p", { class: "leise mitte",
    text: `${gesperrt} weitere${gesperrt === 1 ? "s" : ""} Spiel${gesperrt === 1 ? " ist" : "e sind"} noch nicht freigegeben — die Aufsicht gibt sie in der Verwaltung frei.` }));
  karte.append(
    el("div", { class: "knopfzeile" },
      el("button", { class: "knopf gruen", type: "button", text: "🎲 Los geht's", ...(n ? {} : { disabled: "" }), onclick: () => starte(name, e) })));
  if (istEndlos(e)) karte.append(LS.rangliste(rekordKennung(e), e.stufe, e.timer, name));
  buehne.append(karte);
  const rekord = istEndlos(e) ? LS.besterRekord(name, rekordKennung(e), e.stufe, e.timer) : 0;
  eule.sag(e.check
    ? `Der Übertritts-Check mischt Mathe und Deutsch auf dem Stand der ${UEBERTRITT.klasse}. Klasse. Am Schluss siehst du, was schon sitzt und was du noch üben kannst.${rekord ? ` Dein Rekord hier: ${rekord}.` : ""}`
    : `Ich mische dir Aufgaben aus verschiedenen Spielen. Stell ein, wie du spielen willst!${rekord ? ` Dein Rekord hier: ${rekord}.` : ""}`);
}

// ---------- Bericht des Übertritts-Checks ----------

// Auf Anhieb heisst: ohne Fehlversuch, ohne „Zeit um“ und ohne Tipp (Entscheid T1 a).
const anhiebRichtig = a => a.geloest && !a.versuche && !a.zeitUm && !a.tipps;

/**
 * Je Thema (Fach und Thema aus dem Katalog): wie viele Aufgaben auf Anhieb richtig waren, eingeteilt in
 * „sitzt“, „fast“ und „üben“ (Grenzen UEBERTRITT.sicher und .fast). Die schwächsten zuerst.
 */
function uebertrittsBericht(gespielt) {
  const { el } = LS;
  const je = new Map();
  for (const g of gespielt) {
    const t = THEMEN.find(x => x.id === g.s.thema);
    const eintrag = je.get(t.id) || { t, aufgaben: 0, anhieb: 0 };
    eintrag.aufgaben += g.aufgaben.length;
    eintrag.anhieb += g.aufgaben.filter(anhiebRichtig).length;
    je.set(t.id, eintrag);
  }
  const stand = x => (x.anhieb / x.aufgaben >= UEBERTRITT.sicher ? { text: "✅ sitzt", art: "gut" }
    : x.anhieb / x.aufgaben >= UEBERTRITT.fast ? { text: "🙂 fast", art: "mittel" } : { text: "💪 üben", art: "schwach" });
  const zeilen = [...je.values()].sort((a, b) => a.anhieb / a.aufgaben - b.anhieb / b.aufgaben);
  const ueben = zeilen.filter(x => stand(x).art === "schwach").map(x => x.t.name);
  return {
    element: el("ul", { class: "mix-bericht" }, ...zeilen.map(x => el("li", { class: stand(x).art },
      el("span", { text: `${x.t.fach}: ${x.t.name}` }), el("b", { text: `${x.anhieb} von ${x.aufgaben}` }), el("span", { text: stand(x).text })))),
    ueben,
  };
}

// ---------- Eine Runde ----------

function starte(name, e) {
  const { el } = LS;
  // Spiele der Runde nach Bedarf ziehen (Wunsch Patrik, LERN_Session10; AUSWERTUNG.bedarf): wackelnde und noch nie
  // gespielte Spiele kommen eher dran als sicher gekonnte. Der Übertritts-Check bleibt eine gleichmässige Stichprobe.
  const runden = LS.protokoll().filter(r => r.name === name);
  const fokusZiele = LS.profil(name).fokus;
  const moeglich = kandidaten(name, e);
  const auswahl = e.check ? LS.mische(moeglich).slice(0, UEBERTRITT.spieleJeRunde)
    : AUSWERTUNG.ziehe(moeglich, x => AUSWERTUNG.bedarf(x.s.id, x.stufe, runden, fokusZiele), MIX.spieleJeRunde);
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
    // ❓ Hilfe zum gerade laufenden Spiel (Entscheid T3 a): das Spiel im iframe zeigt sie und hält die Uhr an.
    el("button", { type: "button", class: "knopf hell klein", text: "❓", "aria-label": "Hilfe: So geht das Spiel",
      onclick: () => aktuell?.frame.contentWindow?.postMessage({ lern: "mix", typ: "hilfe" }, "*") }),
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
    id: zwischenstand?.id || KERN.runden.neueId(), // eine Kennung je Serie (R1 a)
    name, zeit: new Date().toISOString(), inhalt: kennung, stufe: e.stufe, timer: e.timer || null, punkte: geschafft,
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
      const tipps = g.aufgaben.reduce((n, a) => n + (a.tipps || 0), 0);
      LS.protokolliere({
        ...(tipps ? { tipps } : {}),
        name, zeit, inhalt: g.s.id, stufe: g.stufe, sterne: null, mix: auswahlSchluessel(e),
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
    const anhieb = summe(g => g.aufgaben.filter(anhiebRichtig).length);
    // Übertritts-Check: statt der Liste je Spiel der Bericht je Thema.
    const bericht = e.check ? uebertrittsBericht(gespielt) : null;
    const tipp = bericht?.ueben.length ? ` Üben lohnt sich bei: ${bericht.ueben.join(", ")}.` : bericht ? " Alles, was vorkam, sitzt schon recht gut." : "";
    if (grund === "beendet") {
      karte.append(el("div", { class: "auftrag", text: `${gestellt} Aufgabe${gestellt === 1 ? "" : "n"} gespielt` }), eule.element, bericht?.element || liste, knoepfe);
      buehne.append(karte);
      return eule.sag(`${anhieb} davon auf Anhieb richtig.${tipp || " Bis zum nächsten Mal!"}`, "gut");
    }
    // Ein Tipp zählt wie ein halber Fehler (Entscheid T1 a).
    const sterne = LS.sterneFuer(fehler + summe(g => g.aufgaben.reduce((n, a) => n + (a.tipps || 0), 0)) / 2);
    LS.konfetti();
    const st = el("div", { class: "sterne" });
    for (let i = 0; i < 3; i++) st.append(el("span", { class: i < sterne ? "" : "aus", style: i < sterne ? "color:#f5b301" : "", text: "★" }));
    karte.append(el("div", { class: "auftrag", text: `Geschafft, ${name}!` }), st, eule.element, bericht?.element || liste, knoepfe);
    buehne.append(karte);
    // „Perfekt“ nur, wenn wirklich alles auf Anhieb gelöst ist (übersprungene Aufgaben zählen nicht als Fehler).
    eule.sag((anhieb === gestellt ? "Perfekt! Alles auf Anhieb richtig! 🏆"
      : `${anhieb} von ${gestellt} auf Anhieb richtig — aus ${gespielt.length} verschiedenen Spielen!`) + tipp, "gut");
  }

  wechsle();
}

zeichneEinstellungen();
