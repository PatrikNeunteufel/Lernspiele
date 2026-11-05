/* Schriftlich rechnen: Raster der Verfahren und Notizblock (Entscheide NB1–NB4 a, Wunsch Patrik, LERN_Session14).
   Vertrag: docs/eulenpfad/rahmen.md Abschnitt 21. Lädt nach spiel.js; der Rahmen öffnet den Notizblock, die
   Schriftlich-Werkstatt baut ihr Raster mit SCHRIFTLICH.raster.

   • SCHRIFTLICH.raster(n, { links, rechts }) — Stellenwerttabelle mit n Stellen (Einer = Spalte 0), links eine Spalte
     für das Rechenzeichen, rechts weitere (× und Faktor). Zeilen: kopf() (Stellen in Calcularis-Farben), zahl(z),
     reihe(mache) (eigene Zellen je Stelle, etwa Eingaben), strich(). Jede Zeilenfunktion gibt die Zellen je Stelle.
   • SCHRIFTLICH.rechne(art, zahlen) — spaltenweise wie auf Papier: Ergebnisziffern und Überträge (+, −, × einstellig).
     Subtraktion: Übertrag wie beim Ergänzen, er kommt unten dazu (mit dem Lehrmittel abzugleichen).
   • SCHRIFTLICH.oeffne({ beiEingabe }) — Notizblock als Feld am Bildrand. Das Kind wählt die Vorlage (+, −, ×, :,
     Häuschen), tippt seine Zahlen ein und rechnet darunter. Nichts wird geprüft, nichts übernommen, nichts gespeichert
     (NB3 a); schliessen() leert ihn, der Rahmen tut das bei jeder neuen Aufgabe. */
const SCHRIFTLICH = (() => {
  "use strict";
  const { el, STELLEN } = LS;
  const STELLEN_RECHTS = STELLEN.slice().reverse(); // E, Z, H, T, ZT, HT, M
  /** Ziffern einer Zahl, Einer zuerst: 347 → [7, 4, 3]. */
  const ziffern = n => String(n).split("").reverse().map(Number);
  const MAX_STELLEN = 7; // bis zur Million, wie die Spiele

  /**
   * Rechnet spaltenweise wie auf Papier: Ziffern des Ergebnisses r (Einer zuerst) und Überträge
   * ueber[i] = Übertrag, der in Spalte i ankommt (ueber[0] = 0). Bei − kommt der Übertrag unten dazu.
   */
  function rechne(art, zahlen) {
    const ergebnis = art === "+" ? zahlen.reduce((s, z) => s + z, 0) : art === "−" ? zahlen[0] - zahlen[1] : zahlen[0] * zahlen[1];
    const n = String(Math.max(ergebnis, 0)).length;
    const r = [];
    const ueber = [0];
    for (let i = 0; i < n; i++) {
      const c = ueber[i];
      if (art === "+") {
        const s = zahlen.reduce((t, z) => t + (ziffern(z)[i] || 0), 0) + c;
        r.push(s % 10); ueber.push(Math.floor(s / 10));
      } else if (art === "−") {
        const s = (ziffern(zahlen[0])[i] || 0) - (ziffern(zahlen[1])[i] || 0) - c;
        r.push((s + 10) % 10); ueber.push(s < 0 ? 1 : 0);
      } else {
        const s = (ziffern(zahlen[0])[i] || 0) * zahlen[1] + c;
        r.push(s % 10); ueber.push(Math.floor(s / 10));
      }
    }
    return { ergebnis, r, ueber };
  }

  // Stellen nach dem Komma (Hinweis Patrik, LERN_Session14): z, h, t wie in der Schule, in neutraler Farbe — die
  // Calcularis-Farben gehören den Stellen E … M, ein „z“ in Blau sähe aus wie die Zehner.
  const NACHKOMMA = [{ k: "z", name: "Zehntel" }, { k: "h", name: "Hundertstel" }, { k: "t", name: "Tausendstel" }];

  /**
   * Stellenwerttabelle (CSS-Klasse schriftlich in stil.css); --spalten setzt sie selbst. komma: so viele Spalten rechts
   * stehen nach dem Komma (Spalte 0 ist dann die letzte Nachkommastelle); eine senkrechte Linie trennt sie von den Einern.
   */
  function raster(n, { links = 1, rechts = 0, beschriftung = "Stellenwerttabelle", komma = 0 } = {}) {
    const box = el("div", { class: "schriftlich", role: "group", "aria-label": beschriftung });
    box.style.setProperty("--spalten", links + n + rechts);
    // Häuschen: breiter als die Stellen, dann ohne Namen
    const stelle = i => (i < komma ? NACHKOMMA[komma - 1 - i] : STELLEN_RECHTS[i - komma]) || { k: "", name: `Spalte ${i + 1}` };
    const stKlasse = i => (i < komma ? "st-nk" : `st st-${stelle(i).k}`);
    const leer = () => el("div", {});
    /** Eine Zeile: links die Zeichen, je Stelle eine Zelle aus mache(i) (von links nach rechts gesetzt), rechts weitere. */
    const zeile = (mache, { zeichen = [], rechts: r = [] } = {}) => {
      for (let j = 0; j < links; j++) box.append(typeof zeichen[j] === "object" && zeichen[j] ? zeichen[j] : el("div", { class: "zeichen", text: zeichen[j] ?? "" }));
      const zellen = [];
      for (let i = n - 1; i >= 0; i--) {
        zellen[i] = mache(i) || leer();
        if (komma && i === komma - 1) zellen[i].classList.add("nach-komma"); // Kommalinie links davon
        box.append(zellen[i]);
      }
      for (let j = 0; j < rechts; j++) box.append(typeof r[j] === "object" && r[j] ? r[j] : el("div", { class: "zeichen", text: r[j] ?? "" }));
      return zellen;
    };
    return {
      element: box, stelle, stKlasse,
      kopf: () => zeile(i => el("div", { class: `kopfzelle ${stKlasse(i)}`, text: stelle(i).k })),
      zahl: (z, optionen = {}) => {
        const zf = ziffern(z);
        // Mit Komma steht vor ihm mindestens die Null: 0.45, nicht .45
        const ziffer = i => (zf[i] !== undefined ? zf[i] : komma && i <= komma ? 0 : undefined);
        return zeile(i => (ziffer(i) === undefined ? null : el("div", { class: `ziffer ${stKlasse(i)}`, text: String(ziffer(i)) })),
          { ...optionen, zeichen: [optionen.zeichen ?? ""] });
      },
      reihe: (mache, optionen = {}) => zeile(mache, { ...optionen, zeichen: Array.isArray(optionen.zeichen) ? optionen.zeichen : [optionen.zeichen ?? ""] }),
      strich: () => { const s = el("div", { class: "strich" }); box.append(s); return s; },
    };
  }

  // ---------- Notizblock ----------
  // Plus und Minus lassen sich in einer Spalte mischen (Wunsch Patrik, LERN_Session15): jede Zahl trägt ihr Zeichen,
  // Antippen wechselt es. Die Vorlage bestimmt nur, mit welchem Zeichen eine neue Zahl beginnt.
  const VORLAGEN = [
    { id: "+", text: "+ Plus", zahlen: [2, 4], hinweis: "Zahlen untereinander, dann von rechts rechnen. Tipp aufs Zeichen, dann wird aus + ein −." },
    { id: "−", text: "− Minus", zahlen: [2, 4], hinweis: "Oben die grösste Zahl. Tipp aufs Zeichen, dann wird aus − ein +." },
    { id: "×", text: "× Mal", zahlen: [2, 2], hinweis: "Mit einer mehrstelligen Zahl: je Ziffer eine Zeile, dann zusammenzählen." },
    { id: ":", text: ": Geteilt", zahlen: [2, 2], hinweis: "Rechts das Ergebnis, darunter Platz für die Schritte." },
    { id: "frei", text: "▦ Häuschen", zahlen: [0, 0], hinweis: "Häuschenpapier: schreib hin, was dir hilft." },
  ];

  const PLUS_MINUS = new Set(["+", "−"]);
  const MAX_SCHRITTE = 6; // Rechnungen auf einem Blatt

  let offen = null; // { panel, beiEingabe }

  /** Ein Häuschen zum Eintippen: eine Ziffer (oder ein Zeichen), danach geht es weiter nach links oder rechts. */
  function feld(klasse, richtung, label) {
    const f = el("input", { class: "nb-feld " + klasse, type: "text", inputmode: "numeric", maxlength: "1", autocomplete: "off",
      "aria-label": label, "data-richtung": richtung });
    return f;
  }
  /** Weitergehen: im selben Raster das nächste Feld derselben Zeile in Schreibrichtung. */
  function weiter(f, vorwaerts) {
    const zeile = [...f.parentElement.querySelectorAll(`.nb-feld[data-zeile="${f.dataset.zeile}"]`)];
    const i = zeile.indexOf(f);
    const nach = f.dataset.richtung === "links" ? (vorwaerts ? -1 : 1) : (vorwaerts ? 1 : -1);
    zeile[i + nach]?.focus();
  }

  /** Zahl aus einem Eingabefeld: { ganz, nach } (Ziffern vor und nach Punkt oder Komma), höchstens 7 und 3; sonst null. */
  const zahlAus = t => {
    const m = /^(\d{1,7})(?:[.,](\d{1,3}))?$/.exec(String(t).replace(/[\s ]/g, ""));
    return m ? { ganz: m[1], nach: m[2] || "" } : null;
  };
  /** Ganze Zahl mit k Nachkommastellen: 129.4 bei k = 2 → 12940 (so stehen alle Zahlen am Komma untereinander). */
  const mitStellen = (z, k) => Number(z.ganz + z.nach.padEnd(k, "0"));
  const MAX_NACHKOMMA = 3;
  /** Das Dezimalzeichen, das die Aufsicht eingestellt hat (wie LS.dezimalText); zahlAus liest beide. */
  const kommaZeichen = () => (LS.einstellung("dezimal") === "komma" ? "," : ".");

  /** Stellen, die das Raster einer Vorlage braucht (höchstens MAX_STELLEN, so weit reichen die Stellen E … M). */
  const spalten = (art, zahlen) => {
    const len = z => String(z).length;
    return PLUS_MINUS.has(art) ? Math.max(...zahlen.map(len)) + 1 : art === "×" ? len(zahlen[0]) + len(zahlen[1]) : len(zahlen[0]);
  };

  /**
   * Raster zur gewählten Vorlage mit den Zahlen des Kindes; Eingabefelder für Überträge, Zwischenzeilen, Ergebnis.
   * vorzeichen: bei Plus und Minus das Zeichen jeder Zahl (die erste ohne), sonst ungenutzt.
   */
  function baueRaster(art, zahlen, komma = 0, vorzeichen = []) {
    let zeilenNr = 0;
    const reiheFelder = (r, klasse, label, { ab = 0, richtung = "links", zeichen = "" } = {}) => {
      const nr = zeilenNr++;
      return r.reihe(i => {
        if (i < ab) return null;
        const f = feld(klasse, richtung, `${label}, ${r.stelle(i).name || r.stelle(i).k}`);
        f.dataset.zeile = nr;
        return f;
      }, { zeichen });
    };
    if (art === "frei") {
      const r = raster(10, { links: 0, beschriftung: "Häuschenpapier" });
      for (let z = 0; z < 8; z++) reiheFelder(r, "karo", `Häuschen Zeile ${z + 1}`, { richtung: "rechts" });
      return r.element;
    }
    if (PLUS_MINUS.has(art)) {
      const n = Math.max(spalten(art, zahlen), komma + 1);
      const r = raster(n, { komma });
      r.kopf();
      zahlen.forEach((z, j) => r.zahl(z, { zeichen: j ? vorzeichen[j] || art : "" }));
      reiheFelder(r, "uebertrag", "Übertrag");
      r.strich();
      reiheFelder(r, "erg", "Ergebnis");
      return r.element;
    }
    if (art === "×") {
      const [a, b] = zahlen;
      const k = String(b).length;
      const n = Math.max(spalten(art, zahlen), komma + 1);
      const r = raster(n, { links: 1, rechts: 1 + k, komma });
      r.kopf();
      r.zahl(a, { rechts: ["×", ...String(b).split("")] });
      if (k === 1) {
        reiheFelder(r, "uebertrag", "Übertrag");
        r.strich();
        reiheFelder(r, "erg", "Ergebnis");
        return r.element;
      }
      r.strich();
      // Je Ziffer des zweiten Faktors eine Zeile, um eine Stelle versetzt wie auf dem Blatt (höchste Ziffer zuerst).
      for (let j = 0; j < k; j++) reiheFelder(r, "teil", `Teilprodukt ${j + 1}`, { ab: k - 1 - j, zeichen: j ? "+" : "" });
      reiheFelder(r, "uebertrag", "Übertrag");
      r.strich();
      reiheFelder(r, "erg", "Ergebnis");
      return r.element;
    }
    // Geteilt: a : b = Ergebnis in einer Zeile, darunter Häuschen unter a für die Schritte (mit Zeichenspalte).
    const [a, b] = zahlen;
    const n = Math.max(String(a).length, komma + 1);
    const ergFelder = Array.from({ length: n }, (_, i) => { const f = feld("erg", "rechts", `Ergebnis Ziffer ${i + 1}`); f.dataset.zeile = "q"; return f; });
    const r = raster(n, { links: 1, rechts: 2 + String(b).length + n, beschriftung: "Schriftlich teilen", komma });
    r.kopf();
    r.zahl(a, { rechts: [":", ...String(b).split(""), "=", ...ergFelder] });
    for (let z = 0; z < 2 * n; z++) {
      const zeichen = feld("teil", "rechts", `Zeichen Zeile ${z + 1}`);
      zeichen.dataset.zeile = `t${z}`;
      zeichen.inputMode = "text";
      const nr = `t${z}`;
      r.reihe(i => { const f = feld("teil", "rechts", `Schritt Zeile ${z + 1}, ${r.stelle(i).k}`); f.dataset.zeile = nr; return f; }, { zeichen: [zeichen] });
    }
    return r.element;
  }

  /**
   * Was das Kind ins Ergebnis einer Rechnung geschrieben hat, als Zahl zum Weiterrechnen ("" bei Lücken oder ohne
   * Ergebnis). Plus, Minus, Mal: Felder rechtsbündig, die letzten komma stehen nach dem Komma. Geteilt: von links.
   */
  function geschrieben(element, art, komma) {
    const t = [...element.querySelectorAll(".nb-feld.erg")].map(f => f.value.trim());
    if (art === ":" && komma) return ""; // Komma im Ergebnis der Division steht nirgends fest
    const erste = t.findIndex(Boolean);
    if (erste < 0) return "";
    let ende = t.length;
    if (art === ":") while (ende > erste && !t[ende - 1]) ende--;
    if (art !== ":" && komma && erste > t.length - komma - 1) return ""; // keine Ziffer vor dem Komma
    const z = t.slice(erste, ende);
    if (z.some(c => !/^\d$/.test(c))) return "";
    const ganz = (art === ":" || !komma ? z : z.slice(0, z.length - komma)).join("").replace(/^0+(?=\d)/, "");
    return art === ":" || !komma ? ganz : `${ganz}${kommaZeichen()}${z.slice(z.length - komma).join("")}`;
  }

  /**
   * Den Notizblock öffnen (oder nach vorn holen). beiEingabe: wird gerufen, sobald das Kind etwas hineinschreibt.
   * Ein Blatt mit bis zu MAX_SCHRITTE Rechnungen untereinander (Wunsch Patrik, LERN_Session15): Unter jede geschriebene
   * Rechnung lässt sich eine neue hängen, ihre erste Zahl ist das, was das Kind als Ergebnis geschrieben hat.
   */
  function oeffne({ beiEingabe } = {}) {
    if (offen) { offen.panel.classList.remove("klein"); document.body.classList.remove("notizblock-klein"); offen.panel.querySelector("button, input")?.focus(); return; }
    const blatt = el("div", { class: "nb-blatt" });
    const wahl = el("div", { class: "nb-vorlagen", role: "group", "aria-label": "Rechnung wählen" });
    const wahlTitel = el("b", { class: "nb-wahl-titel", text: "Rechnung wählen:" });
    const wahlBox = el("div", { class: "nb-wahl" }, wahlTitel, wahl);
    const schritte = []; // { vorlage, box, fertig, ergebnis() }

    const aktualisiereWahl = () => {
      const letzter = schritte.at(-1);
      wahlTitel.textContent = schritte.some(s => s.fertig) ? "Weiterrechnen:" : "Rechnung wählen:";
      wahlBox.hidden = schritte.length >= MAX_SCHRITTE && !!letzter?.fertig;
      wahl.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(!!letzter && !letzter.fertig && b.dataset.vorlage === letzter.vorlage.id)));
      schritte.forEach((s, j) => { s.nr.textContent = `${j + 1}.`; });
    };
    const entferne = s => { s.box.remove(); schritte.splice(schritte.indexOf(s), 1); aktualisiereWahl(); };

    const neuerSchritt = v => {
      // Eine Rechnung, die noch nicht untereinander steht, wird durch die neue Wahl ersetzt
      if (schritte.at(-1) && !schritte.at(-1).fertig) entferne(schritte.at(-1));
      const vorher = schritte.at(-1);
      const start = v.id !== "frei" && vorher ? vorher.ergebnis() : "";
      const nr = el("b", { class: "nb-nr" });
      const titel = el("span", { class: "nb-schritt-titel", text: v.text });
      const s = { vorlage: v, fertig: false, nr, ergebnis: () => "" };
      const weg = el("button", { type: "button", class: "nb-zu nb-weg", text: "✕", "aria-label": "Diese Rechnung wegnehmen", title: "Diese Rechnung wegnehmen", onclick: () => entferne(s) });
      const flaeche = el("div", { class: "nb-flaeche" });
      s.box = el("section", { class: "nb-schritt" }, el("div", { class: "nb-schritt-kopf" }, nr, titel, weg), flaeche);
      schritte.push(s);
      blatt.append(s.box);
      if (v.id === "frei") {
        flaeche.append(baueRaster("frei", []));
        s.fertig = true;
        aktualisiereWahl();
        flaeche.querySelector(".nb-feld")?.focus();
        return;
      }
      const felder = [];
      const zeichen = []; // je Zahl ihr Zeichen (die erste ohne)
      const zeile = el("div", { class: "nb-zahlen-zeile" });
      const neuesFeld = () => {
        const j = felder.length;
        const f = el("input", { class: "feld nb-zahl", type: "text", inputmode: "none", maxlength: String(MAX_STELLEN + 1 + MAX_NACHKOMMA), autocomplete: "off",
          "aria-label": `Zahl ${j + 1}`, placeholder: "Zahl" });
        felder.push(f);
        zeichen.push(j ? v.id : "");
        if (j) {
          zeile.append(PLUS_MINUS.has(v.id)
            ? el("button", { type: "button", class: "nb-op nb-op-wechsel", text: v.id, "aria-label": `Zeichen vor Zahl ${j + 1}: ${v.id === "+" ? "Plus" : "Minus"}, antippen wechselt`,
              onclick: e => {
                zeichen[j] = zeichen[j] === "+" ? "−" : "+";
                e.currentTarget.textContent = zeichen[j];
                e.currentTarget.setAttribute("aria-label", `Zeichen vor Zahl ${j + 1}: ${zeichen[j] === "+" ? "Plus" : "Minus"}, antippen wechselt`);
              } })
            : el("span", { class: "nb-op", text: v.id }));
        }
        zeile.append(f);
        return f;
      };
      for (let j = 0; j < v.zahlen[0]; j++) neuesFeld();
      if (start) felder[0].value = start;
      const mehr = v.zahlen[1] > v.zahlen[0] ? el("button", { type: "button", class: "knopf hell klein", text: "＋ Zahl", onclick: () => {
        neuesFeld().focus();
        if (felder.length >= v.zahlen[1]) mehr.remove();
      } }) : null;
      const meldung = el("span", { class: "leise-text", "aria-live": "polite" });
      const eingabe = el("div", { class: "nb-zahlen" });
      const los = el("button", { type: "button", class: "knopf klein", text: "Untereinander schreiben ➜", onclick: () => {
        const roh = felder.map(f => zahlAus(f.value));
        if (roh.some(z => z === null)) { meldung.textContent = "Bitte jede Zahl eintippen (höchstens 7 Ziffern, 3 nach dem Komma)."; return; }
        // Plus und Minus: alle Zahlen am Komma ausrichten. Mal und Geteilt: nur die erste Zahl darf ein Komma haben.
        const mitKomma = PLUS_MINUS.has(v.id);
        if (!mitKomma && roh.slice(1).some(z => z.nach)) { meldung.textContent = "Bei Mal und Geteilt darf nur die erste Zahl ein Komma haben."; return; }
        const komma = mitKomma ? Math.max(...roh.map(z => z.nach.length)) : roh[0].nach.length;
        const zahlen = roh.map((z, j) => (mitKomma || j === 0 ? mitStellen(z, komma) : Number(z.ganz)));
        if (mitKomma && zahlen.reduce((t, z, j) => (j && zeichen[j] === "−" ? t - z : t + z), 0) < 0) {
          meldung.textContent = "Das Ergebnis wäre kleiner als 0: Oben muss mehr stehen, als weggenommen wird."; return;
        }
        if (v.id === ":" && zahlen[1] === 0) { meldung.textContent = "Durch 0 kann man nicht teilen."; return; }
        if (spalten(v.id, zahlen) - komma > MAX_STELLEN) { meldung.textContent = "Das wird zu breit: Der Notizblock geht bis zur Million."; return; }
        const raster = baueRaster(v.id, zahlen, komma, zeichen);
        eingabe.remove();
        flaeche.append(raster);
        titel.textContent = felder.map((f, j) => (j ? ` ${zeichen[j]} ` : "") + f.value.replace(/\s/g, "")).join("");
        s.fertig = true;
        s.ergebnis = () => geschrieben(raster, v.id, komma);
        aktualisiereWahl();
        if (v.id === ":") raster.querySelector(".nb-feld.erg")?.focus();
        else [...raster.querySelectorAll(".nb-feld.erg")].pop()?.focus(); // Einer zuerst
        s.box.scrollIntoView?.({ block: "nearest" });
        beiEingabe?.();
      } });
      eingabe.append(zeile, el("div", { class: "nb-zahlen-knoepfe" }, mehr, los, meldung), el("p", { class: "leise-text nb-hinweis", text: start
        ? "Oben steht dein Ergebnis von eben. Du kannst es ändern." : v.hinweis }));
      flaeche.before(eingabe);
      aktualisiereWahl();
      (start ? felder[1] : felder[0]).focus();
      s.box.scrollIntoView?.({ block: "nearest" });
    };

    // Eigenes Ziffernfeld (Hinweis Patrik, LERN_Session14): Die Ziffern des Spiels sind neben dem Block teils verdeckt,
    // und in die Zahlenfelder schrieben sie nicht. Es schreibt in das gewählte Feld des Blocks — Zahl oder Häuschen —,
    // ohne ihm den Fokus zu nehmen; ohne Wahl in das erste leere Zahlenfeld. Es steht fest unten im Block, damit es bei
    // mehreren Rechnungen nicht wegscrollt (LERN_Session15).
    let zuletzt = null;
    const ziel = () => {
      const a = document.activeElement;
      if (a && panel.contains(a) && a.matches("input")) return a;
      if (zuletzt?.isConnected) return zuletzt;
      return [...panel.querySelectorAll(".nb-zahl")].find(f => !f.value) || panel.querySelector(".nb-zahl, .nb-feld");
    };
    const tippe = was => {
      const f = ziel();
      if (!f) return;
      f.focus();
      if (was === "⌫") {
        if (!f.value && f.classList.contains("nb-feld")) { weiter(f, false); return; }
        f.value = f.value.slice(0, -1);
      } else {
        const max = Number(f.getAttribute("maxlength")) || 99;
        if (f.classList.contains("nb-feld")) f.value = was; // ein Häuschen, eine Ziffer
        else if (f.value.length < max) f.value += was;
        else return;
        LS.ton?.("tipp");
      }
      f.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const tasten = el("div", { class: "nb-tasten", role: "group", "aria-label": "Ziffern für den Notizblock" },
      ...["1", "2", "3", "4", "5", kommaZeichen(), "6", "7", "8", "9", "0", "⌫"].map(z => el("button", { type: "button", text: z,
        "aria-label": z === "⌫" ? "Löschen" : z === kommaZeichen() ? "Komma" : z, onclick: () => tippe(z) })));
    tasten.addEventListener("pointerdown", e => e.preventDefault()); // Fokus bleibt im gewählten Feld
    tasten.addEventListener("mousedown", e => e.preventDefault());
    for (const v of VORLAGEN) wahl.append(el("button", { type: "button", class: "chip", "data-vorlage": v.id, "aria-pressed": "false", text: v.text,
      onclick: () => neuerSchritt(v) }));
    const zu = el("button", { type: "button", class: "nb-zu", "aria-label": "Notizblock schliessen", title: "Schliessen (leert den Block)", text: "✕", onclick: schliessen });
    const klein = el("button", { type: "button", class: "nb-zu", "aria-label": "Notizblock verkleinern", title: "Verkleinern", text: "▁",
      onclick: () => document.body.classList.toggle("notizblock-klein", panel.classList.toggle("klein")) });
    const panel = el("aside", { class: "notizblock", role: "dialog", "aria-label": "Notizblock" },
      el("div", { class: "nb-kopf" }, el("b", { text: "📝 Notizblock" }), el("span", { class: "leise-text", text: "wird nicht bewertet" }), klein, zu),
      el("div", { class: "nb-inhalt" }, blatt, wahlBox),
      el("div", { class: "nb-fuss" }, tasten));
    // Ziffer getippt: weiter in Schreibrichtung; Rücktaste im leeren Feld: zurück. Erstes Hineinschreiben meldet beiEingabe.
    panel.addEventListener("focusin", e => { if (e.target.matches?.("input")) { zuletzt = e.target; e.target.inputMode = "none"; } });
    panel.addEventListener("input", e => {
      const f = e.target;
      if (f.classList?.contains("nb-feld") && f.value) weiter(f, true);
      if (f.value) beiEingabe?.();
    });
    panel.addEventListener("keydown", e => {
      const f = e.target;
      if (f.classList?.contains("nb-feld") && e.key === "Backspace" && !f.value) { e.preventDefault(); weiter(f, false); }
      e.stopPropagation(); // Kurztasten des Spiels und Enter der Rückmeldung nicht auslösen, solange hier getippt wird
    });
    document.body.append(panel);
    document.body.classList.add("mit-notizblock");
    offen = { panel, beiEingabe };
    wahl.querySelector("button").focus();
  }

  /** Schliessen und leeren (Knopf ✕ oder neue Aufgabe). */
  function schliessen() {
    offen?.panel.remove();
    document.body.classList.remove("mit-notizblock", "notizblock-klein");
    offen = null;
  }

  /** Knopf „📝 Notizblock“ für eine Spielfläche; beiEingabe wie bei oeffne. */
  const knopf = beiEingabe => el("button", { type: "button", class: "knopf hell klein nb-knopf", text: "📝 Notizblock",
    title: "Schriftlich rechnen wie auf einem Blatt — wird nicht bewertet", onclick: () => oeffne({ beiEingabe }) });

  return { ziffern, rechne, raster, oeffne, schliessen, knopf, VORLAGEN, istOffen: () => !!offen };
})();
