/* Anmeldung (Entscheid L1 a): Kinder tippen ihren Namen an, die Aufsicht braucht ihre PIN.
   „🐣 Ich bin neu“ (Entscheide KR1 a, KR2 a mit Zusatz Patrik, LERN_Session13): Ein Kind legt sich selbst an, auch ohne
   Aufsicht (die Aufsicht kann das mit selbstAnlegen abschalten). Eine erwachsene Person wird Aufsicht: erst eine Frage
   über dem Stoff der Primarschule (eine Hürde, kein Schutz), dann — gibt es schon eine Aufsicht — die Bestätigung mit
   deren PIN, zuletzt Name und eigene PIN. */
"use strict";

// Schritte der Anmeldung stehen im Verlauf (#neu, #neu-kind, #neu-klasse, #neu-frage, #neu-bestaetigen, #neu-aufsicht,
// #pin), damit „Zurück“ im Browser einen Schritt zurückgeht statt die Seite zu verlassen (Meldung Patrik,
// LERN_Session13). Namen stehen nie in der Adresse, nur hier im Speicher der Seite.
// code und neuePin nur kurz, bis der Code angezeigt und die Aufsicht angemeldet ist (nie gespeichert).
const anmeldeMerk = { name: "", pin: null, frageGeloest: false, bestaetigt: false, darfNeuePin: false, code: null, neuePin: null };

/** Vorschläge für die Sicherheitsfrage (PIN1 a); eigene Fragen gehen auch. */
const SICHERHEITSFRAGEN = [
  "Wie hiess mein erstes Kuscheltier?",
  "In welcher Strasse wohnte ich als Kind?",
  "Wie hiess meine Lehrperson in der 1. Klasse?",
  "Welches Buch habe ich als Kind am liebsten gelesen?",
  "Wo habe ich meine erste Stelle angetreten?",
];

/**
 * Frage für Erwachsene (KR2, Zusatz Patrik): klar über dem Stoff der Primarschule (Lehrplan 21 bis 6. Klasse:
 * keine Wurzeln, Potenzen, negativen Zahlen, Gleichungen, kein Pythagoras), aber für Erwachsene leicht. Antwort immer
 * eine natürliche Zahl.
 */
function erwachsenenFrage() {
  const z = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const arten = [
    () => { const w = z(6, 15); return { text: `Wie viel ist √${w * w}?`, antwort: w }; },
    () => { const [b, e] = [[2, z(5, 10)], [3, z(3, 4)], [5, 3], [10, z(3, 5)]][z(0, 3)]; return { text: `Wie viel ist ${b} hoch ${e}?`, antwort: b ** e }; },
    () => { const a = z(3, 9), b = z(3, 9); return { text: `Wie viel ist (−${a}) · (−${b})?`, antwort: a * b }; },
    () => { const a = z(2, 9), x = z(2, 12), b = z(1, 20); return { text: `${a} · x + ${b} = ${a * x + b}. Wie gross ist x?`, antwort: x }; },
    // Punkt-vor-Strich-Falle (Wunsch Patrik), mit Potenz: Punkt vor Strich allein lernen schon Primarschüler (LP21,
    // Zyklus 2); erst die Potenz hebt sie darüber. Wer von links rechnet, kommt auf eine viel grössere Zahl.
    () => {
      const b = z(2, 9), c = z(2, 5);
      if (z(0, 1)) { const a = z(2, 20); return { text: `Wie viel ist ${a} + ${b} · ${c}²?`, antwort: a + b * c * c }; }
      const a = b * c * c + z(1, 30);
      return { text: `Wie viel ist ${a} − ${b} · ${c}²?`, antwort: a - b * c * c };
    },
    // Pythagoras (Wunsch Patrik): nur ganzzahlige Dreiecke, gefragt die lange oder eine kurze Seite
    () => {
      const [a, b, c] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25]][z(0, 6)];
      return z(0, 1)
        ? { text: `Ein rechtwinkliges Dreieck hat die kurzen Seiten ${a} cm und ${b} cm. Wie lang ist die lange Seite (in cm)?`, antwort: c }
        : { text: `Ein rechtwinkliges Dreieck hat die lange Seite ${c} cm und eine kurze Seite ${b} cm. Wie lang ist die andere kurze Seite (in cm)?`, antwort: a };
    },
  ];
  return arten[z(0, arten.length - 1)]();
}

/**
 * Links zu den Anleitungen (eulenpfad/anleitung/); ?von=app führt dort „Zurück“ in die App statt ins Portal.
 * beide: Kinder- und Erwachsenen-Anleitung (Anmeldung, Aufsicht), sonst nur die für Kinder.
 */
function anleitungLinks(beide) {
  const { el } = LS;
  const link = (datei, bild, text) => el("a", { class: "anleitung-link", href: `anleitung/${datei}?von=app` }, `${bild} ${text}`);
  return el("nav", { class: "anleitung-links", "aria-label": "Anleitungen" }, el("span", { text: "📖 Anleitung:" }),
    link("kinder.html", "🧒", "So spielst du"), beide ? link("aufsicht.html", "🧑‍🏫", "Für Erwachsene") : null);
}

/** Zeichnet die Anmeldung in box; nachAnmeldung() wenn jemand angemeldet ist. */
function zeichneAnmeldung(box, vorgewaehlt, nachAnmeldung) {
  const { el } = LS;
  const karte = el("section", { class: "karte anmeldung" });
  // Anleitungen auch in der App, nicht nur im Portal (Wunsch Patrik, LERN_Session14): unter der Anmeldung für alle
  box.append(karte, anleitungLinks(true));
  const zurueckgesetzt = LS.zuruecksetzenFaellig(); // Frist (Stufe 4) abgelaufen: Aufsichten sind jetzt Kinder ohne PIN
  // Ausgeblendete (KE1 a: gesperrte Aufsichten von anderen Geräten) stehen nicht auf der Anmeldung; die Regeln zum
  // Anlegen zählen weiter alle
  const kinder = LS.kinderListe().filter(LS.angezeigt);
  const aufsichten = LS.aufsichtListe();
  const aufsichtenGezeigt = aufsichten.filter(LS.angezeigt);
  const mitPin = aufsichten.filter(n => LS.profil(n).pin);
  const selbst = !aufsichten.length || LS.einstellung("selbstAnlegen", null) === "ja";
  const geheZu = schritt => { location.hash = schritt; }; // hashchange zeichnet die Startseite neu
  const zurueck = () => history.back();
  const zurueckKnopf = () => el("button", { type: "button", class: "knopf hell klein", text: "Zurück", onclick: zurueck });
  /** Angemeldet: den Schritt im Verlauf durch die Startseite ersetzen, damit „Zurück“ nicht in die Anmeldung führt. */
  const fertigAngemeldet = (ziel = "") => {
    Object.assign(anmeldeMerk, { name: "", pin: null, frageGeloest: false, bestaetigt: false, darfNeuePin: false, code: null, neuePin: null });
    history.replaceState(null, "", location.pathname + ziel);
    nachAnmeldung();
  };
  const pinFeld = (platzhalter, label) => el("input", { class: "feld", type: "password", inputmode: "numeric", maxlength: "6", autocomplete: "off", placeholder: platzhalter, "aria-label": label });
  const meldungFeld = () => el("div", { class: "meldung", "aria-live": "polite" });
  const beiEnter = (felder, fn) => felder.forEach(f => f.addEventListener("keydown", e => { if (e.key === "Enter") fn(); }));

  function uebersicht() {
    karte.innerHTML = "";
    karte.append(el("h2", { text: "Wer bist du?" }));
    const frist = LS.zuruecksetzenStand();
    if (frist) karte.append(el("div", { class: "meldung", style: "text-align:center;margin-bottom:10px" },
      `⚠️ Die Aufsicht wird am ${datum(frist.ab)} zurückgesetzt. Wer eine PIN oder den Wiederherstellungscode kennt, kann es abbrechen. `,
      el("button", { type: "button", class: "knopf hell klein", text: "Abbrechen", onclick: () => geheZu("frist-abbrechen") })));
    if (zurueckgesetzt) karte.append(el("p", { class: "meldung", style: "text-align:center", text: "Die Aufsicht wurde zurückgesetzt. Mit „🐣 Ich bin neu“ → „Ich bin erwachsen“ richten Sie eine neue ein." }));
    const namen = el("div", { class: "namen" },
      // Kachel mit Avatar und Namen darunter (AV3 a)
      ...kinder.map(n => el("button", { type: "button", class: "name-knopf",
        onclick: () => { LS.setzeSpieler(n); nachAnmeldung(); } }, LS.avatarBild(n, 64), el("span", { text: n }))),
      ...aufsichtenGezeigt.map(n => el("button", { type: "button", class: "name-knopf aufsicht", text: (LS.gesperrt(n) ? "🔒 " : "") + LS.spielerName(n),
        onclick: () => { anmeldeMerk.pin = n; geheZu("pin"); } })));
    karte.append(namen,
      el("div", { class: "pin-zeile" }, el("button", { type: "button", class: "knopf gruen", text: "🐣 Ich bin neu", onclick: () => geheZu("neu") })));
    if (!kinder.length && !aufsichtenGezeigt.length) karte.append(el("p", { class: "leise-text", style: "text-align:center", text: "Neu hier? Tipp auf 🐣 Ich bin neu." }));
  }

  /** Kind oder erwachsen? Ohne Erlaubnis zum Selbstanlegen nur der Weg für Erwachsene. */
  function werBistDu() {
    karte.innerHTML = "";
    karte.append(el("h2", { text: "🐣 Schön, dass du da bist!" }),
      el("div", { class: "namen" },
        selbst ? el("button", { type: "button", class: "name-knopf", onclick: () => { anmeldeMerk.name = ""; geheZu("neu-kind"); } },
          el("span", { text: "🧒", style: "font-size:40px" }), el("span", { text: "Ich bin ein Kind" })) : "",
        el("button", { type: "button", class: "name-knopf", onclick: () => { anmeldeMerk.frageGeloest = false; anmeldeMerk.bestaetigt = false; geheZu("neu-frage"); } },
          el("span", { text: "🔑", style: "font-size:40px" }), el("span", { text: "Ich bin erwachsen (Aufsicht)" }))),
      selbst ? "" : el("p", { class: "leise-text", style: "text-align:center", text: "Neue Kinder legt hier die Aufsicht an (Verwaltung → Konten)." }),
      el("div", { class: "pin-zeile" }, zurueckKnopf()));
  }

  /** PIN-Abfrage; eine Aufsicht ohne PIN (frühere Testspieler) legt sie hier zuerst fest. */
  function pinFrage(name) {
    karte.innerHTML = "";
    if (LS.gesperrt(name)) return freischalten(name);
    const ohnePin = !LS.profil(name).pin;
    // Eine PIN festlegen darf hier nur, wer die erste Aufsicht einrichtet (frühere Testspieler);
    // gibt es schon eine Aufsicht mit PIN, setzt sie die PIN in der Verwaltung.
    if (ohnePin && mitPin.length) {
      karte.append(el("h2", { text: LS.spielerName(name) }),
        el("p", { style: "text-align:center", text: "Für dieses Konto gibt es noch keine PIN. Eine andere Aufsicht kann sie in der Verwaltung festlegen." }),
        el("div", { class: "pin-zeile" }, zurueckKnopf()));
      return;
    }
    const feld = pinFeld("PIN", "PIN");
    const zweit = pinFeld("nochmal", "PIN wiederholen");
    const meldung = meldungFeld();
    const los = async () => {
      if (ohnePin) {
        if (!LS.pinGueltig(feld.value)) return (meldung.textContent = "Die PIN hat 4 bis 6 Ziffern.");
        if (feld.value !== zweit.value) return (meldung.textContent = "Die beiden PINs sind nicht gleich.");
        await LS.setzePin(name, feld.value);
      }
      if (await LS.meldeAufsichtAn(name, feld.value)) return vorgewaehlt ? nachAnmeldung() : fertigAngemeldet();
      meldung.textContent = "Diese PIN stimmt nicht.";
      feld.value = "";
      feld.focus();
    };
    beiEnter([feld, zweit], los);
    const vergessen = ohnePin ? "" : el("div", { class: "pin-zeile" }, el("button", { type: "button", class: "knopf hell klein", text: "PIN vergessen?",
      onclick: () => { anmeldeMerk.pin = name; anmeldeMerk.frageGeloest = false; geheZu("pin-vergessen"); } }));
    karte.append(
      el("h2", { text: `${LS.spielerName(name)}: ${ohnePin ? "PIN festlegen" : "PIN eingeben"}` }),
      // DOM-append schreibt null als Text hin (anders als LS.el) — deshalb leer statt null
      ...(ohnePin ? [el("p", { class: "leise-text", style: "text-align:center", text: "Diese Aufsicht hat noch keine PIN. Lege jetzt eine fest (4 bis 6 Ziffern)." })] : []),
      el("div", { class: "pin-zeile" }, feld, ohnePin ? zweit : "",
        el("button", { type: "button", class: "knopf gruen klein", text: "Anmelden", onclick: los }),
        vorgewaehlt ? el("button", { type: "button", class: "knopf hell klein", text: "Zurück", onclick: uebersicht }) : zurueckKnopf()),
      meldung, vergessen);
    feld.focus();
  }

  /**
   * Gesperrte Aufsicht (DF4 a): kam über den Abgleich oder eine Sicherung von einem Gerät, auf dem sie eine PIN hat; die
   * PIN reist nicht mit. Freischalten mit ihrem Wiederherstellungscode oder mit der PIN einer anderen Aufsicht dieses
   * Geräts, dazu eine neue PIN für dieses Gerät. Gibt es beides nicht, bleibt sie gesperrt.
   */
  function freischalten(name) {
    // Der Code reicht nur, solange das Gerät keine Aufsicht mit PIN hat; sonst bestätigt eine von ihnen (OA1 a, Kern)
    const codeReicht = KERN.person.codeReicht(LS.PERSONEN, LS.person(name)?.id);
    const mitCode = !!LS.wiederherstellung(name).code && codeReicht;
    const andere = mitPin.filter(n => n !== name);
    karte.append(el("h2", { text: `🔒 ${LS.spielerName(name)}` }),
      el("p", { style: "text-align:center", text: "Diese Aufsicht ist auf einem anderen Gerät mit einer PIN geschützt. Die PIN reist nicht mit — hier braucht sie zuerst eine eigene." }));
    if (!mitCode && !andere.length) {
      karte.append(el("p", { class: "leise-text", style: "text-align:center", text: "Freischalten geht mit dem Wiederherstellungscode dieser Aufsicht oder mit der PIN einer anderen Aufsicht dieses Geräts. Hier gibt es beides nicht: Richten Sie zuerst mit „🐣 Ich bin neu“ → „Ich bin erwachsen“ eine Aufsicht ein; sie kann diese dann freischalten." }),
        el("div", { class: "pin-zeile" }, zurueckKnopf()));
      return;
    }
    const code = el("input", { class: "feld", type: "text", maxlength: "16", autocomplete: "off", placeholder: "Code", "aria-label": "Wiederherstellungscode" });
    let wer = andere.length === 1 ? andere[0] : null;
    const vonPin = pinFeld("PIN", "PIN der anderen Aufsicht");
    const wahl = el("div", { class: "namen" }, ...andere.map(n => {
      const k = el("button", { type: "button", class: "name-knopf aufsicht" + (n === wer ? " an" : ""), "aria-pressed": String(n === wer), text: LS.spielerName(n),
        onclick: () => { wer = n; wahl.querySelectorAll("button").forEach(b => { b.classList.toggle("an", b === k); b.setAttribute("aria-pressed", String(b === k)); }); vonPin.focus(); } });
      return k;
    }));
    const pin = pinFeld("neue PIN", "Neue PIN");
    const zweit = pinFeld("nochmal", "Neue PIN wiederholen");
    const meldung = meldungFeld();
    const los = async () => {
      if (!code.value.trim() && !vonPin.value) return (meldung.textContent = mitCode && andere.length ? "Bitte den Code eingeben oder eine andere Aufsicht ihre PIN." : mitCode ? "Bitte den Wiederherstellungscode eingeben." : "Bitte die PIN der anderen Aufsicht eingeben.");
      if (!code.value.trim() && !wer) return (meldung.textContent = "Tipp zuerst an, welche Aufsicht es erlaubt.");
      if (!LS.pinGueltig(pin.value)) return (meldung.textContent = "Die neue PIN hat 4 bis 6 Ziffern.");
      if (pin.value !== zweit.value) return (meldung.textContent = "Die beiden PINs sind nicht gleich.");
      try {
        await LS.freischalten(name, pin.value, code.value.trim() ? { code: code.value } : { von: wer, vonPin: vonPin.value });
      } catch (e) { vonPin.value = ""; return (meldung.textContent = e.message); }
      if (await LS.meldeAufsichtAn(name, pin.value)) return vorgewaehlt ? nachAnmeldung() : fertigAngemeldet();
      meldung.textContent = "Freigeschaltet. Bitte jetzt mit der neuen PIN anmelden.";
    };
    beiEnter([code, vonPin, pin, zweit], los);
    karte.append(
      mitCode ? el("p", { class: "leise-text", style: "text-align:center;margin-bottom:0", text: "Mit dem Wiederherstellungscode dieser Aufsicht:" }) : "",
      mitCode ? el("div", { class: "pin-zeile" }, code) : "",
      andere.length ? el("p", { class: "leise-text", style: "text-align:center;margin-bottom:0", text: mitCode ? "Oder eine andere Aufsicht dieses Geräts erlaubt es mit ihrer PIN:"
        : "Hier gibt es schon eine Aufsicht. Eine von ihnen erlaubt es mit ihrer PIN (der Code allein reicht dafür nicht):" }) : "",
      andere.length > 1 ? wahl : "",
      andere.length === 1 ? el("p", { style: "text-align:center;font-weight:800;margin:4px 0", text: `Erlaubt von: ${LS.spielerName(wer)}` }) : "",
      andere.length ? el("div", { class: "pin-zeile" }, vonPin) : "",
      el("p", { class: "leise-text", style: "text-align:center;margin-bottom:0", text: "Neue PIN für dieses Gerät (4 bis 6 Ziffern):" }),
      el("div", { class: "pin-zeile" }, pin, zweit,
        el("button", { type: "button", class: "knopf gruen klein", text: "Freischalten", onclick: los }),
        vorgewaehlt ? el("button", { type: "button", class: "knopf hell klein", text: "Zurück", onclick: uebersicht }) : zurueckKnopf()),
      meldung);
    (mitCode ? code : vonPin).focus();
  }

  /** Erwachsene: eine Frage über dem Stoff der Primarschule. Falsch → eine andere Frage; richtig → Schritt weiter(). */
  function frageFuerErwachsene(weiter = () => (mitPin.length ? "neu-bestaetigen" : "neu-aufsicht")) {
    karte.innerHTML = "";
    let frage = erwachsenenFrage();
    const text = el("p", { style: "text-align:center;font-size:22px;font-weight:800", text: frage.text });
    const feld = el("input", { class: "feld", type: "text", inputmode: "numeric", maxlength: "8", autocomplete: "off", placeholder: "Antwort", "aria-label": "Antwort" });
    const meldung = meldungFeld();
    const los = () => {
      if (Number(feld.value.trim()) === frage.antwort) { anmeldeMerk.frageGeloest = true; return geheZu(weiter()); }
      frage = erwachsenenFrage();
      text.textContent = frage.text;
      feld.value = "";
      meldung.textContent = "Das stimmt nicht. Hier eine andere Frage.";
      feld.focus();
    };
    beiEnter([feld], los);
    karte.append(el("h2", { text: "🔑 Eine Frage für Erwachsene" }), text,
      el("div", { class: "pin-zeile" }, feld, el("button", { type: "button", class: "knopf gruen klein", text: "Weiter ➜", onclick: los }), zurueckKnopf()),
      el("p", { class: "leise-text", style: "text-align:center", text: "Die Aufsicht sieht alle Daten und stellt alles ein. Die Frage hält Kinder davon ab, ihre Rechte zu bekommen." }),
      meldung);
    feld.focus();
  }

  /** Gibt es schon eine Aufsicht, bestätigt eine von ihnen die neue mit ihrer PIN. */
  function bestaetigen() {
    karte.innerHTML = "";
    let wer = mitPin.length === 1 ? mitPin[0] : null;
    const feld = pinFeld("PIN", "PIN der bestehenden Aufsicht");
    const meldung = meldungFeld();
    const wahl = el("div", { class: "namen" }, ...mitPin.map(n => {
      const k = el("button", { type: "button", class: "name-knopf aufsicht" + (n === wer ? " an" : ""), "aria-pressed": String(n === wer), text: LS.spielerName(n),
        onclick: () => { wer = n; wahl.querySelectorAll("button").forEach(b => { b.classList.toggle("an", b === k); b.setAttribute("aria-pressed", String(b === k)); }); feld.focus(); } });
      return k;
    }));
    const los = async () => {
      if (!wer) return (meldung.textContent = "Tipp zuerst an, welche Aufsicht es erlaubt.");
      if (!(await LS.pinStimmt(wer, feld.value))) { feld.value = ""; return (meldung.textContent = "Diese PIN stimmt nicht."); }
      anmeldeMerk.bestaetigt = true;
      geheZu("neu-aufsicht");
    };
    beiEnter([feld], los);
    // Keine Anmeldung: Die bestehende Aufsicht erlaubt nur, dass eine neue angelegt wird (Hinweis Patrik, LERN_Session13).
    karte.append(el("h2", { text: "🔑 Neue Aufsicht erlauben" }),
      el("p", { style: "text-align:center", text: "Eine neue Aufsicht braucht die Erlaubnis einer bestehenden. Sie gibt hier ihre PIN ein — danach wählst du deinen eigenen Namen und deine eigene PIN." }),
      mitPin.length > 1 ? el("p", { class: "leise-text", style: "text-align:center;margin:0", text: "Wer erlaubt es?" }) : "",
      mitPin.length > 1 ? wahl : el("p", { style: "text-align:center;font-weight:800", text: `Erlaubt von: ${LS.spielerName(wer)}` }),
      el("div", { class: "pin-zeile" }, feld, el("button", { type: "button", class: "knopf gruen klein", text: "Erlauben", onclick: los }), zurueckKnopf()),
      meldung);
    if (wer) feld.focus();
  }

  /** Neue Aufsicht: Name und PIN (zweimal). */
  function neueAufsicht() {
    karte.innerHTML = "";
    const name = el("input", { class: "feld", type: "text", maxlength: "20", placeholder: "Name", "aria-label": "Name der Aufsicht", autocomplete: "off" });
    const pin = pinFeld("PIN", "PIN");
    const zweit = pinFeld("nochmal", "PIN wiederholen");
    const sf = sicherheitsfrageFelder();
    const meldung = meldungFeld();
    const los = async () => {
      const n = name.value.trim().slice(0, 20);
      if (!n || LS.spielerListe().includes(n)) return (meldung.textContent = "Bitte einen neuen Namen eingeben.");
      if (!LS.pinGueltig(pin.value)) return (meldung.textContent = "Die PIN hat 4 bis 6 Ziffern.");
      if (pin.value !== zweit.value) return (meldung.textContent = "Die beiden PINs sind nicht gleich.");
      if (!sf.gueltig()) return (meldung.textContent = "Bitte eine Sicherheitsfrage und ihre Antwort eingeben.");
      await LS.setzePin(n, pin.value);
      const code = LS.neuerCode();
      await LS.setzeWiederherstellung(n, { code, frage: sf.frage(), antwort: sf.antwort() });
      Object.assign(anmeldeMerk, { pin: n, code, neuePin: pin.value });
      location.replace("#neu-code"); // ersetzt den Schritt: zurück ins Formular ginge nicht mehr (das Konto steht)
    };
    beiEnter([name, pin, zweit], los);
    karte.append(el("h2", { text: "🔑 Aufsicht einrichten" }),
      el("div", { class: "pin-zeile" }, name, pin, zweit),
      el("p", { class: "leise-text", style: "text-align:center", text: "PIN mit 4 bis 6 Ziffern. Wählen Sie keine Zahl, die Kinder erraten können (Geburtstag, 1234)." }),
      sf.element,
      el("div", { class: "pin-zeile" }, el("button", { type: "button", class: "knopf gruen klein", text: "Einrichten", onclick: los }), zurueckKnopf()),
      meldung);
    name.focus();
  }

  /** Sicherheitsfrage (Stufe 3 von PIN1): Vorschlag wählen oder eigene schreiben, dazu die Antwort. */
  function sicherheitsfrageFelder() {
    const liste = el("datalist", { id: "sicherheitsfragen" }, ...SICHERHEITSFRAGEN.map(f => el("option", { value: f })));
    const frage = el("input", { class: "feld", type: "text", maxlength: "120", list: "sicherheitsfragen", placeholder: "Sicherheitsfrage (Vorschlag wählen oder eigene)",
      "aria-label": "Sicherheitsfrage", autocomplete: "off", style: "min-width:min(100%, 340px)" });
    const antwort = el("input", { class: "feld", type: "text", maxlength: "60", placeholder: "Antwort", "aria-label": "Antwort auf die Sicherheitsfrage", autocomplete: "off" });
    return {
      element: el("div", {},
        el("p", { style: "text-align:center;margin:12px 0 4px;font-weight:700", text: "Falls Sie die PIN vergessen: Sicherheitsfrage" }),
        el("div", { class: "pin-zeile" }, frage, antwort, liste),
        el("p", { class: "leise-text", style: "text-align:center", text: "Wählen Sie eine Frage, deren Antwort Ihre Kinder nicht kennen. Gross- und Kleinschreibung zählen nicht." })),
      gueltig: () => frage.value.trim().length >= 5 && antwort.value.trim().length >= 2,
      frage: () => frage.value,
      antwort: () => antwort.value,
    };
  }

  /** Wiederherstellungscode einmal zeigen (Stufe 2); erst nach „aufgeschrieben“ geht es weiter und die Aufsicht ist angemeldet. */
  function codeZeigen() {
    karte.innerHTML = "";
    const { pin: n, code, neuePin } = anmeldeMerk;
    const ok = el("input", { type: "checkbox", id: "code-ok" });
    const weiter = el("button", { type: "button", class: "knopf gruen klein", text: "Weiter ➜", disabled: true,
      onclick: async () => { await LS.meldeAufsichtAn(n, neuePin); fertigAngemeldet(); } });
    ok.addEventListener("change", () => { weiter.disabled = !ok.checked; });
    karte.append(el("h2", { text: "🔑 Ihr Wiederherstellungscode" }),
      el("p", { style: "text-align:center", text: "Mit diesem Code setzen Sie eine vergessene PIN neu. Er erscheint nur jetzt. Schreiben Sie ihn auf und bewahren Sie ihn fern von den Kindern auf." }),
      el("p", { style: "text-align:center;font:800 30px/1.3 ui-monospace,Consolas,monospace;letter-spacing:2px;user-select:all", text: code }),
      el("div", { class: "pin-zeile" }, el("label", { for: "code-ok", style: "display:flex;gap:8px;align-items:center;font-weight:700" }, ok, "Ich habe den Code aufgeschrieben"), weiter));
  }

  // ----- PIN vergessen (PIN1 a, PIN1-R a): nach der Frage für Erwachsene Code, Sicherheitsfrage oder Zurücksetzen -----

  const datum = iso => new Date(iso).toLocaleString("de-CH", { weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });

  /** Welche Wege gibt es für diese Aufsicht? Stufe 1 (zweite Aufsicht) steht als Hinweis dabei. */
  function pinWege() {
    karte.innerHTML = "";
    const n = anmeldeMerk.pin;
    const w = LS.wiederherstellung(n);
    const andere = mitPin.filter(x => x !== n);
    const weg = (text, schritt) => el("button", { type: "button", class: "name-knopf", onclick: () => geheZu(schritt) }, el("span", { text }));
    const frist = LS.zuruecksetzenStand();
    karte.append(el("h2", { text: `${LS.spielerName(n)}: PIN vergessen` }),
      andere.length ? el("p", { style: "text-align:center", text: `Am einfachsten: ${andere.map(LS.spielerName).join(" oder ")} setzt Ihre PIN in Verwaltung → Konten neu.` }) : "",
      el("div", { class: "namen" },
        w.code ? weg("🔑 Ich habe den Wiederherstellungscode", "pin-code") : "",
        w.frage ? weg("❓ Sicherheitsfrage beantworten", "pin-frage") : "",
        frist ? "" : weg(`⏳ Zurücksetzen (dauert ${LS.ZURUECKSETZEN_TAGE} Tage)`, "pin-frist")),
      frist ? el("p", { style: "text-align:center", text: `Das Zurücksetzen ist schon angefordert: am ${datum(frist.ab)}.` }) : "",
      el("div", { class: "pin-zeile" }, zurueckKnopf()));
  }

  /** Code (Stufe 2) oder Sicherheitsfrage (Stufe 3) prüfen; richtig → neue PIN. */
  function pinPruefen(art) {
    karte.innerHTML = "";
    const n = anmeldeMerk.pin;
    const feld = el("input", { class: "feld", type: "text", maxlength: art === "code" ? "20" : "60", autocomplete: "off",
      placeholder: art === "code" ? "XXXX-XXXX-XXXX" : "Antwort", "aria-label": art === "code" ? "Wiederherstellungscode" : "Antwort" });
    const meldung = meldungFeld();
    const los = async () => {
      const stimmt = art === "code" ? await LS.codeStimmt(n, feld.value) : await LS.antwortStimmt(n, feld.value);
      if (!stimmt) { feld.value = ""; return (meldung.textContent = art === "code" ? "Dieser Code stimmt nicht." : "Diese Antwort stimmt nicht."); }
      anmeldeMerk.darfNeuePin = true;
      location.replace("#pin-neu");
    };
    beiEnter([feld], los);
    karte.append(el("h2", { text: art === "code" ? "🔑 Wiederherstellungscode" : "❓ Sicherheitsfrage" }),
      art === "frage" ? el("p", { style: "text-align:center;font-size:20px;font-weight:800", text: LS.wiederherstellung(n).frage }) : "",
      el("div", { class: "pin-zeile" }, feld, el("button", { type: "button", class: "knopf gruen klein", text: "Weiter ➜", onclick: los }), zurueckKnopf()),
      meldung);
    feld.focus();
  }

  /** Neue PIN nach Code oder Sicherheitsfrage; danach gibt es gleich einen neuen Code. */
  function pinNeu() {
    karte.innerHTML = "";
    const n = anmeldeMerk.pin;
    const pin = pinFeld("neue PIN", "Neue PIN");
    const zweit = pinFeld("nochmal", "Neue PIN wiederholen");
    const meldung = meldungFeld();
    const los = async () => {
      if (!LS.pinGueltig(pin.value)) return (meldung.textContent = "Die PIN hat 4 bis 6 Ziffern.");
      if (pin.value !== zweit.value) return (meldung.textContent = "Die beiden PINs sind nicht gleich.");
      await LS.setzePin(n, pin.value);
      const code = LS.neuerCode(); // der alte Code ist bekannt geworden oder verloren: immer ein neuer
      await LS.setzeWiederherstellung(n, { code });
      LS.zuruecksetzenAbbrechen(); // eine laufende Frist braucht es nicht mehr
      Object.assign(anmeldeMerk, { code, neuePin: pin.value, darfNeuePin: false });
      location.replace("#neu-code");
    };
    beiEnter([pin, zweit], los);
    karte.append(el("h2", { text: `${LS.spielerName(n)}: neue PIN` }),
      el("div", { class: "pin-zeile" }, pin, zweit, el("button", { type: "button", class: "knopf gruen klein", text: "Speichern", onclick: los })),
      meldung);
    pin.focus();
  }

  /** Stufe 4: Zurücksetzen mit Frist anfordern. */
  function pinFrist() {
    karte.innerHTML = "";
    const tage = LS.ZURUECKSETZEN_TAGE;
    karte.append(el("h2", { text: "⏳ Aufsicht zurücksetzen" }),
      el("p", { style: "text-align:center", text: `Nach ${tage} Tagen verlieren alle Aufsichten auf diesem Gerät ihre Rolle und PIN. Danach richtet jemand mit „🐣 Ich bin neu“ eine neue Aufsicht ein. Die Daten der Kinder bleiben.` }),
      el("p", { style: "text-align:center", text: "Bis dahin steht auf der Anmeldung für alle sichtbar ein Hinweis. Wer eine PIN oder einen Wiederherstellungscode kennt, kann das Zurücksetzen abbrechen." }),
      el("div", { class: "pin-zeile" },
        el("button", { type: "button", class: "knopf gruen klein", text: "Zurücksetzen anfordern", onclick: () => { LS.zuruecksetzenAnfordern(); fertigUebersicht(); } }),
        zurueckKnopf()));
  }

  /** Laufende Frist abbrechen: PIN oder Code einer Aufsicht. */
  function fristAbbrechen() {
    karte.innerHTML = "";
    const feld = el("input", { class: "feld", type: "password", maxlength: "20", autocomplete: "off", placeholder: "PIN oder Code", "aria-label": "PIN oder Wiederherstellungscode" });
    const meldung = meldungFeld();
    const los = async () => {
      if (await LS.zuruecksetzenAbbrechenMit(feld.value)) return fertigUebersicht();
      feld.value = "";
      meldung.textContent = "Weder eine PIN noch ein Code stimmt.";
    };
    beiEnter([feld], los);
    karte.append(el("h2", { text: "⏳ Zurücksetzen abbrechen" }),
      el("p", { style: "text-align:center", text: "PIN oder Wiederherstellungscode einer Aufsicht eingeben." }),
      el("div", { class: "pin-zeile" }, feld, el("button", { type: "button", class: "knopf gruen klein", text: "Abbrechen", onclick: los }), zurueckKnopf()),
      meldung);
    feld.focus();
  }

  /** Zurück zur Übersicht und den Schritt im Verlauf ersetzen. */
  const fertigUebersicht = () => { history.replaceState(null, "", location.pathname); karte.remove(); zeichneAnmeldung(box, null, nachAnmeldung); };

  /** Kind: Vorname, dann die Klasse mit grossen Knöpfen, danach die Bildwahl im Profil (KR1 a). */
  function neuesKind() {
    karte.innerHTML = "";
    const name = el("input", { class: "feld", type: "text", maxlength: "20", placeholder: "Vorname", "aria-label": "Dein Vorname", autocomplete: "off" });
    name.value = anmeldeMerk.name; // zurück aus der Klassenwahl: der Name steht noch da
    const meldung = meldungFeld();
    const weiter = () => {
      const n = name.value.trim().slice(0, 20);
      if (!n) return (meldung.textContent = "Schreib zuerst deinen Vornamen.");
      if (LS.spielerListe().includes(n)) return (meldung.textContent = "Diesen Namen gibt es schon. Tipp oben auf deinen Namen oder schreib ihn anders.");
      anmeldeMerk.name = n;
      geheZu("neu-klasse");
    };
    beiEnter([name], weiter);
    karte.append(el("h2", { text: "🐣 Wie heisst du?" }),
      el("div", { class: "pin-zeile" }, name,
        el("button", { type: "button", class: "knopf gruen klein", text: "Weiter ➜", onclick: weiter }), zurueckKnopf()),
      el("p", { class: "leise-text", style: "text-align:center", text: "Nur den Vornamen. Er bleibt auf diesem Gerät." }),
      meldung);
    name.focus();
  }

  /** Klasse des neuen Kindes; daraus schlägt jedes Spiel die passende Stufe vor. Ohne Wahl bleibt sie leer. */
  function klasseWaehlen(n) {
    karte.innerHTML = "";
    const fertig = klasse => {
      if (!LS.neuerSpieler(n, { klasse })) return uebersicht();
      LS.setzeSpieler(n);
      // Gleich zum eigenen Bild (Profil des Kindes zeigt nur „Mein Bild“)
      fertigAngemeldet("#profil");
    };
    karte.append(el("h2", { text: `Hallo ${n}! In welche Klasse gehst du?` }),
      el("div", { class: "namen" }, ...LS.KLASSEN.map(k => el("button", { type: "button", class: "name-knopf",
        onclick: () => fertig(k) }, el("span", { text: k <= 0 ? "🧸" : String(k), style: "font-size:32px;font-weight:900" }), el("span", { text: LS.klasseText(k) })))),
      el("div", { class: "pin-zeile" },
        el("button", { type: "button", class: "knopf hell klein", text: "Weiss nicht", onclick: () => fertig(null) }), zurueckKnopf()));
  }

  // Jeder Schritt prüft, ob die Schritte davor erledigt sind; sonst beginnt es bei der Übersicht.
  const schritt = location.hash.slice(1);
  if (vorgewaehlt && LS.istAufsicht(vorgewaehlt)) pinFrage(vorgewaehlt);
  else if (schritt === "neu") werBistDu();
  else if (schritt === "neu-kind" && selbst) neuesKind();
  else if (schritt === "neu-klasse" && selbst && anmeldeMerk.name) klasseWaehlen(anmeldeMerk.name);
  else if (schritt === "neu-frage") frageFuerErwachsene();
  else if (schritt === "neu-bestaetigen" && anmeldeMerk.frageGeloest && mitPin.length) bestaetigen();
  else if (schritt === "neu-aufsicht" && anmeldeMerk.frageGeloest && (anmeldeMerk.bestaetigt || !mitPin.length)) neueAufsicht();
  else if (schritt === "pin" && anmeldeMerk.pin && aufsichten.includes(anmeldeMerk.pin)) pinFrage(anmeldeMerk.pin);
  else if (schritt === "neu-code" && anmeldeMerk.code && anmeldeMerk.neuePin) codeZeigen();
  // PIN vergessen: erst die Frage für Erwachsene, dann die Wege
  else if (schritt === "pin-vergessen" && mitPin.includes(anmeldeMerk.pin)) frageFuerErwachsene(() => "pin-wege");
  else if (schritt === "pin-wege" && anmeldeMerk.frageGeloest && mitPin.includes(anmeldeMerk.pin)) pinWege();
  else if (schritt === "pin-code" && anmeldeMerk.frageGeloest && LS.wiederherstellung(anmeldeMerk.pin || "").code) pinPruefen("code");
  else if (schritt === "pin-frage" && anmeldeMerk.frageGeloest && LS.wiederherstellung(anmeldeMerk.pin || "").frage) pinPruefen("frage");
  else if (schritt === "pin-neu" && anmeldeMerk.darfNeuePin && mitPin.includes(anmeldeMerk.pin)) pinNeu();
  else if (schritt === "pin-frist" && anmeldeMerk.frageGeloest && !LS.zuruecksetzenStand()) pinFrist();
  else if (schritt === "frist-abbrechen" && LS.zuruecksetzenStand()) fristAbbrechen();
  else uebersicht();
}
