/* Anmeldung (Entscheid L1 a): Kinder tippen ihren Namen an, die Aufsicht braucht ihre PIN.
   Neue Kinder legt die Aufsicht in der Verwaltung an; solange es keine Aufsicht gibt, geht es auch hier. */
"use strict";

/** Zeichnet die Anmeldung in box; nachAnmeldung() wenn jemand angemeldet ist. */
function zeichneAnmeldung(box, vorgewaehlt, nachAnmeldung) {
  const { el } = LS;
  const karte = el("section", { class: "karte anmeldung" });
  box.append(karte);
  const kinder = LS.kinderListe();
  const aufsichten = LS.aufsichtListe();

  function uebersicht() {
    karte.innerHTML = "";
    karte.append(el("h2", { text: "Wer bist du?" }));
    const namen = el("div", { class: "namen" },
      ...kinder.map(n => el("button", { type: "button", class: "name-knopf", text: n,
        onclick: () => { LS.setzeSpieler(n); nachAnmeldung(); } })),
      ...aufsichten.map(n => el("button", { type: "button", class: "name-knopf aufsicht", text: LS.spielerName(n),
        onclick: () => pinFrage(n) })));
    karte.append(namen);
    if (!kinder.length && !aufsichten.length) karte.append(el("p", { class: "leise-text", style: "text-align:center", text: "Noch niemand da. Richte zuerst die Aufsicht ein — sie legt dann die Kinder an." }));
    if (!aufsichten.length) karte.append(einrichten(), neuesKind());
  }

  /** PIN-Abfrage; eine Aufsicht ohne PIN (frühere Testspieler) legt sie hier zuerst fest. */
  function pinFrage(name) {
    karte.innerHTML = "";
    const ohnePin = !LS.profil(name).pin;
    // Eine PIN festlegen darf hier nur, wer die erste Aufsicht einrichtet (frühere Testspieler);
    // gibt es schon eine Aufsicht mit PIN, setzt sie die PIN in der Verwaltung.
    if (ohnePin && LS.aufsichtListe().some(n => LS.profil(n).pin)) {
      karte.append(el("h2", { text: LS.spielerName(name) }),
        el("p", { style: "text-align:center", text: "Für dieses Konto gibt es noch keine PIN. Eine andere Aufsicht kann sie in der Verwaltung festlegen." }),
        el("div", { class: "pin-zeile" }, el("button", { type: "button", class: "knopf hell klein", text: "Zurück", onclick: uebersicht })));
      return;
    }
    const feld = el("input", { type: "password", inputmode: "numeric", maxlength: "6", autocomplete: "off", placeholder: "PIN", "aria-label": "PIN" });
    const zweit = el("input", { type: "password", inputmode: "numeric", maxlength: "6", autocomplete: "off", placeholder: "nochmal", "aria-label": "PIN wiederholen" });
    const meldung = el("div", { class: "meldung", "aria-live": "polite" });
    const los = async () => {
      if (ohnePin) {
        if (!LS.pinGueltig(feld.value)) return (meldung.textContent = "Die PIN hat 4 bis 6 Ziffern.");
        if (feld.value !== zweit.value) return (meldung.textContent = "Die beiden PINs sind nicht gleich.");
        await LS.setzePin(name, feld.value);
      }
      if (await LS.meldeAufsichtAn(name, feld.value)) return nachAnmeldung();
      meldung.textContent = "Diese PIN stimmt nicht.";
      feld.value = "";
      feld.focus();
    };
    feld.addEventListener("keydown", e => { if (e.key === "Enter") los(); });
    zweit.addEventListener("keydown", e => { if (e.key === "Enter") los(); });
    karte.append(
      el("h2", { text: `${LS.spielerName(name)}: ${ohnePin ? "PIN festlegen" : "PIN eingeben"}` }),
      ohnePin ? el("p", { class: "leise-text", style: "text-align:center", text: "Diese Aufsicht hat noch keine PIN. Lege jetzt eine fest (4 bis 6 Ziffern)." }) : null,
      el("div", { class: "pin-zeile" }, feld, ohnePin ? zweit : null,
        el("button", { type: "button", class: "knopf gruen klein", text: "Anmelden", onclick: los }),
        el("button", { type: "button", class: "knopf hell klein", text: "Zurück", onclick: uebersicht })),
      meldung);
    feld.focus();
  }

  /** Erste Aufsicht einrichten: Name und PIN. */
  function einrichten() {
    const name = el("input", { class: "feld", type: "text", maxlength: "20", placeholder: "Name", "aria-label": "Name der Aufsicht" });
    const pin = el("input", { class: "feld", type: "password", inputmode: "numeric", maxlength: "6", placeholder: "PIN", "aria-label": "PIN" });
    const meldung = el("div", { class: "meldung", "aria-live": "polite" });
    const los = async () => {
      const n = name.value.trim().slice(0, 20);
      if (!n || LS.spielerListe().includes(n)) return (meldung.textContent = "Bitte einen neuen Namen eingeben.");
      if (!LS.pinGueltig(pin.value)) return (meldung.textContent = "Die PIN hat 4 bis 6 Ziffern.");
      await LS.setzePin(n, pin.value);
      await LS.meldeAufsichtAn(n, pin.value);
      nachAnmeldung();
    };
    return el("details", { style: "margin-top:18px" },
      el("summary", { text: "🔑 Aufsicht einrichten (Eltern, Lehrperson)" }),
      el("div", { class: "pin-zeile" }, name, pin, el("button", { type: "button", class: "knopf gruen klein", text: "Einrichten", onclick: los })),
      meldung);
  }

  /** Kind anlegen — nur solange es keine Aufsicht gibt. */
  function neuesKind() {
    const name = el("input", { class: "feld", type: "text", maxlength: "20", placeholder: "Neuer Name", "aria-label": "Neuer Name" });
    const los = () => { const n = LS.neuerSpieler(name.value); if (n) { LS.setzeSpieler(n); nachAnmeldung(); } };
    name.addEventListener("keydown", e => { if (e.key === "Enter") los(); });
    return el("div", { class: "pin-zeile" }, name, el("button", { type: "button", class: "knopf hell klein", text: "＋ Neues Kind", onclick: los }));
  }

  if (vorgewaehlt && LS.istAufsicht(vorgewaehlt)) pinFrage(vorgewaehlt);
  else uebersicht();
}
