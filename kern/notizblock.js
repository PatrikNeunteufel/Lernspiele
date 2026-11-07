/* Kern — Notizblock für schriftliches Rechnen (Entscheide NB1–NB4 a im Eulenpfad, LERN_Session14; NB1 a–NB4 a für die
   Reihe, LERN_Session19; docs/kern/rahmen.md 4.23). Herkunft: eulenpfad/spiele/gemeinsam/notizblock.js (SCHRIFTLICH).
   KERN.notizblock({ stellen, dezimal, ton, vorn }) → { ziffern, rechne, raster, oeffne, schliessen, verkleinern, knopf, VORLAGEN,
     GLEICHUNG, istOffen, istKlein }
     stellen  Stellen von gross nach klein [{ k, name }] (Standard M … E); dezimal() → "." oder ","; ton(art) (Standard still);
     vorn()  wird gerufen, wenn der Block gross erscheint (geöffnet oder aus „klein“ zurückgeholt) — damit eine App ein
     anderes Feld am selben Platz verkleinern kann (Lernsteig RP1 a: Rechner und Notizblock teilen sich den Platz)
   • verkleinern() — auf die Kopfzeile verkleinern, Inhalt bleibt (wie der Knopf ▁); istKlein() fragt es ab.
   • raster(n, { links, rechts, komma }) — Stellenwerttabelle mit n Stellen (Einer = Spalte 0), links eine Spalte
     für das Rechenzeichen, rechts weitere (× und Faktor). Zeilen: kopf(), zahl(z), reihe(mache), strich().
   • rechne(art, zahlen) — spaltenweise wie auf Papier: Ergebnisziffern und Überträge (+, −, × einstellig). Subtraktion:
     Übertrag wie beim Ergänzen, er kommt unten dazu (mit dem Lehrmittel abzugleichen).
   • oeffne({ beiEingabe, vorlagen, gleichung }) — Notizblock als Feld am Bildrand: Vorlage wählen (+, −, ×, :, Häuschen),
     Zahlen eintippen, darunter rechnen. Nichts wird geprüft, nichts übernommen, nichts gespeichert (NB3 a Eulenpfad);
     schliessen() leert ihn. vorlagen: Kennungen der angebotenen Vorlagen in ihrer Reihenfolge (Standard + − × : frei).
   Mal mit Komma in der zweiten Zahl (NB3 a, LERN_Session19): gerechnet wird ohne Komma, darunter die Kommaregel als Zeile.
   Vorlage „=“ Gleichung (GL1 a, LERN_Session20): Zeilen untereinander, je Zeile die Gleichung und rechts vom Strich die
   Umformung („−3“, „:5“); oben steht gleichung (die der Aufgabe; eine Liste bei einem System, je Gleichung eine Zeile),
   „＋ Zeile“ schreibt die letzte Zeile ab. Nur wer sie in
   vorlagen nennt, bietet sie an. Die Ziffern tippt das Tastenfeld (KERN.tastenfeld), bei einer Gleichung dazu die Zeichen.
   Aussehen (Klassen .schriftlich, .notizblock, .nb-*) gibt jede App in ihrem CSS. Greift erst beim Aufruf auf document zu. */
"use strict";

(function (KERN) {
  const STELLEN_STANDARD = [
    { k: "M", name: "Millionen" }, { k: "HT", name: "Hunderttausender" }, { k: "ZT", name: "Zehntausender" },
    { k: "T", name: "Tausender" }, { k: "H", name: "Hunderter" }, { k: "Z", name: "Zehner" }, { k: "E", name: "Einer" },
  ];
  /** Ziffern einer Zahl, Einer zuerst: 347 → [7, 4, 3]. */
  const ziffern = n => String(n).split("").reverse().map(Number);
  const MAX_STELLEN = 7; // bis zur Million
  const MAX_NACHKOMMA = 3;
  const MAX_SCHRITTE = 6; // Rechnungen auf einem Blatt
  const PLUS_MINUS = new Set(["+", "−"]);

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

  /** Zahl aus einem Eingabefeld: { ganz, nach } (Ziffern vor und nach Punkt oder Komma), höchstens 7 und 3; sonst null. */
  const zahlAus = t => {
    const m = /^(\d{1,7})(?:[.,](\d{1,3}))?$/.exec(String(t).replace(/[\s ]/g, ""));
    return m ? { ganz: m[1], nach: m[2] || "" } : null;
  };
  /** Ganze Zahl mit k Nachkommastellen: 129.4 bei k = 2 → 12940 (so stehen alle Zahlen am Komma untereinander). */
  const mitStellen = (z, k) => Number(z.ganz + z.nach.padEnd(k, "0"));
  /** Stellen, die das Raster einer Vorlage braucht (höchstens MAX_STELLEN, so weit reichen die Stellen E … M). */
  const spalten = (art, zahlen) => {
    const len = z => String(z).length;
    return PLUS_MINUS.has(art) ? Math.max(...zahlen.map(len)) + 1 : art === "×" ? len(zahlen[0]) + len(zahlen[1]) : len(zahlen[0]);
  };
  /** Kommaregel des Malrechnens als Satz (NB3 a): „2 + 1 = 3 Stellen nach dem Komma“. */
  const kommaregel = (ka, kb) => `${ka} + ${kb} = ${ka + kb} ${ka + kb === 1 ? "Stelle" : "Stellen"} nach dem Komma`;

  // Plus und Minus lassen sich in einer Spalte mischen (Wunsch Patrik, LERN_Session15): jede Zahl trägt ihr Zeichen,
  // Antippen wechselt es. Die Vorlage bestimmt nur, mit welchem Zeichen eine neue Zahl beginnt.
  const VORLAGEN = [
    { id: "+", text: "+ Plus", zahlen: [2, 4], hinweis: "Zahlen untereinander, dann von rechts rechnen. Tipp aufs Zeichen, dann wird aus + ein −." },
    { id: "−", text: "− Minus", zahlen: [2, 4], hinweis: "Oben die grösste Zahl. Tipp aufs Zeichen, dann wird aus − ein +." },
    { id: "×", text: "× Mal", zahlen: [2, 2], hinweis: "Mit einer mehrstelligen Zahl: je Ziffer eine Zeile, dann zusammenzählen. Mit Komma: zuerst ohne Komma rechnen." },
    { id: ":", text: ": Geteilt", zahlen: [2, 2], hinweis: "Rechts das Ergebnis, darunter Platz für die Schritte." },
    { id: "frei", text: "▦ Häuschen", zahlen: [0, 0], hinweis: "Häuschenpapier: schreib hin, was dir hilft." },
  ];
  // Gleichung umformen (GL1 a): nicht unter den Standard-Vorlagen, die App nennt sie (Lernsteig je Übung im Katalog)
  const GLEICHUNG = { id: "=", text: "= Gleichung", zahlen: [0, 0],
    hinweis: "Rechts vom Strich, was du auf beiden Seiten tust (−3, :5). „＋ Zeile“ schreibt die letzte Zeile ab." };
  const MAX_ZEILEN = 10; // Zeilen einer Gleichung
  /** Lösung in der letzten Zeile einer Gleichung („x = 2.5“) als Zahl zum Weiterrechnen, sonst "". */
  const loesungAus = t => {
    const m = /^\s*[a-z]\s*=\s*(\d[\d\s]*(?:[.,]\d+)?)\s*$/.exec(String(t));
    return m && zahlAus(m[1]) ? m[1].replace(/\s/g, "") : "";
  };

  function notizblock({ stellen = STELLEN_STANDARD, dezimal = () => ".", ton = () => {}, vorn = () => {} } = {}) {
    const el = KERN.el;
    const STELLEN_RECHTS = stellen.slice().reverse(); // E, Z, H, T, ZT, HT, M
    const kommaZeichen = () => (dezimal() === "," ? "," : ".");

    // Stellen nach dem Komma (Hinweis Patrik, LERN_Session14): z, h, t wie in der Schule, in neutraler Farbe — die
    // Farben der Stellen (Eulenpfad: Calcularis) gehören den Stellen E … M, ein „z“ in Blau sähe aus wie die Zehner.
    const NACHKOMMA = [{ k: "z", name: "Zehntel" }, { k: "h", name: "Hundertstel" }, { k: "t", name: "Tausendstel" }];

    /**
     * Stellenwerttabelle (Klasse schriftlich); --spalten setzt sie selbst. komma: so viele Spalten rechts stehen nach dem
     * Komma (Spalte 0 ist dann die letzte Nachkommastelle); eine senkrechte Linie trennt sie von den Einern.
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

    let offen = null; // { panel, beiEingabe }

    /** Ein Häuschen zum Eintippen: eine Ziffer (oder ein Zeichen), danach geht es weiter nach links oder rechts. */
    function feld(klasse, richtung, label) {
      return el("input", { class: "nb-feld " + klasse, type: "text", inputmode: "numeric", maxlength: "1", autocomplete: "off",
        "aria-label": label, "data-richtung": richtung });
    }
    /** Weitergehen: im selben Raster das nächste Feld derselben Zeile in Schreibrichtung. */
    function weiter(f, vorwaerts) {
      const zeile = [...f.parentElement.querySelectorAll(`.nb-feld[data-zeile="${f.dataset.zeile}"]`)];
      const i = zeile.indexOf(f);
      const nach = f.dataset.richtung === "links" ? (vorwaerts ? -1 : 1) : (vorwaerts ? 1 : -1);
      zeile[i + nach]?.focus();
    }

    /**
     * Raster zur gewählten Vorlage mit den Zahlen; Eingabefelder für Überträge, Zwischenzeilen, Ergebnis.
     * vorzeichen: bei Plus und Minus das Zeichen jeder Zahl (die erste ohne), sonst ungenutzt.
     * regel: bei Mal mit Komma in der zweiten Zahl die Kommaregel { ka, kb } — dann ohne Komma gerechnet (NB3 a).
     */
    function baueRaster(art, zahlen, komma = 0, vorzeichen = [], regel = null) {
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
        // mit Kommaregel mindestens eine Spalte vor den Stellen nach dem Komma (0.47 · 0.8 = 0.376: Platz für die 0)
        const n = Math.max(spalten(art, zahlen), komma + 1, regel ? regel.ka + regel.kb + 1 : 0);
        const r = raster(n, { links: 1, rechts: 1 + k, komma });
        r.kopf();
        r.zahl(a, { rechts: ["×", ...String(b).split("")] });
        if (k === 1) {
          reiheFelder(r, "uebertrag", "Übertrag");
          r.strich();
          reiheFelder(r, "erg", "Ergebnis");
        } else {
          r.strich();
          // Je Ziffer des zweiten Faktors eine Zeile, um eine Stelle versetzt wie auf dem Blatt (höchste Ziffer zuerst).
          for (let j = 0; j < k; j++) reiheFelder(r, "teil", `Teilprodukt ${j + 1}`, { ab: k - 1 - j, zeichen: j ? "+" : "" });
          reiheFelder(r, "uebertrag", "Übertrag");
          r.strich();
          reiheFelder(r, "erg", "Ergebnis");
        }
        if (!regel) return r.element;
        // Mit Komma in beiden Zahlen: oben ohne Komma gerechnet, darunter die Kommaregel (NB3 a)
        return el("div", { class: "nb-mal-komma" }, r.element, el("p", { class: "nb-kommaregel", text: kommaregel(regel.ka, regel.kb) }));
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
     * Was ins Ergebnis einer Rechnung geschrieben wurde, als Zahl zum Weiterrechnen ("" bei Lücken oder ohne Ergebnis).
     * Plus, Minus, Mal: Felder rechtsbündig, die letzten komma stehen nach dem Komma. Geteilt: von links.
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
     * Den Notizblock öffnen (oder nach vorn holen). beiEingabe: wird gerufen, sobald etwas hineingeschrieben wird.
     * Ein Blatt mit bis zu MAX_SCHRITTE Rechnungen untereinander (Wunsch Patrik, LERN_Session15): Unter jede geschriebene
     * Rechnung lässt sich eine neue hängen, ihre erste Zahl ist das, was als Ergebnis geschrieben wurde.
     */
    function oeffne({ beiEingabe, vorlagen = null, gleichung = "" } = {}) {
      if (offen) { gross(true); offen.panel.querySelector("button, input")?.focus(); return; }
      const ALLE = [...VORLAGEN, GLEICHUNG];
      const startZeilen = [].concat(gleichung || []); // eine Gleichung oder ein System (je Gleichung eine Zeile)
      const angeboten = vorlagen ? vorlagen.map(id => ALLE.find(v => v.id === id)).filter(Boolean) : VORLAGEN;
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

      /** Gleichung umformen (GL1 a): Zeilen „Gleichung | Umformung“, oben die Gleichung der Aufgabe. */
      const baueGleichung = v => {
        const liste = el("div", { class: "nb-gleichung", role: "group", "aria-label": "Gleichung umformen" });
        const eingabe = (klasse, label, platz) => el("input", { class: `feld ${klasse}`, type: "text", inputmode: "none", autocomplete: "off",
          spellcheck: "false", "aria-label": label, placeholder: platz });
        const zeile = text => {
          const n = liste.children.length + 1;
          const gl = eingabe("nb-gl", `Gleichung Zeile ${n}`, "… = …");
          gl.value = text || "";
          liste.append(el("div", { class: "nb-gl-zeile" }, gl, el("span", { class: "nb-strich", text: "|", "aria-hidden": "true" }),
            eingabe("nb-umf", `Umformung nach Zeile ${n}`, "−3")));
          return gl;
        };
        if (startZeilen.length) startZeilen.forEach(zeile); else zeile("");
        const mehr = el("button", { type: "button", class: "knopf hell klein", text: "＋ Zeile", onclick: () => {
          const f = zeile([...liste.querySelectorAll(".nb-gl")].pop().value);
          f.focus();
          zeigeZeichen();
          try { f.setSelectionRange?.(f.value.length, f.value.length); } catch { /* ohne Schreibmarke */ }
          if (liste.children.length >= MAX_ZEILEN) mehr.disabled = true;
          beiEingabe?.();
        } });
        return el("div", {}, liste, el("div", { class: "nb-zahlen-knoepfe" }, mehr), el("p", { class: "leise-text nb-hinweis", text: v.hinweis }));
      };

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
        if (v.id === "=") {
          flaeche.append(baueGleichung(v));
          s.fertig = true;
          s.ergebnis = () => loesungAus([...flaeche.querySelectorAll(".nb-gl")].pop()?.value);
          aktualisiereWahl();
          const erste = flaeche.querySelector(".nb-gl");
          if (erste.value) flaeche.querySelector(".nb-umf").focus(); else erste.focus();
          zeigeZeichen(); // auch ohne focusin (Ersatz-DOM)
          s.box.scrollIntoView?.({ block: "nearest" });
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
          // Plus und Minus: alle Zahlen am Komma ausrichten. Geteilt: nur die erste Zahl darf ein Komma haben.
          // Mal (NB3 a): hat die zweite Zahl ein Komma, wird ohne Komma gerechnet und die Kommaregel darunter geschrieben.
          const mitKomma = PLUS_MINUS.has(v.id);
          if (v.id === ":" && roh[1].nach) { meldung.textContent = "Beim Teilen darf nur die erste Zahl ein Komma haben."; return; }
          const regel = v.id === "×" && roh[1].nach ? { ka: roh[0].nach.length, kb: roh[1].nach.length } : null;
          const komma = regel ? 0 : mitKomma ? Math.max(...roh.map(z => z.nach.length)) : roh[0].nach.length;
          const zahlen = regel ? roh.map(z => Number(z.ganz + z.nach))
            : roh.map((z, j) => (mitKomma || j === 0 ? mitStellen(z, komma) : Number(z.ganz)));
          if (mitKomma && zahlen.reduce((t, z, j) => (j && zeichen[j] === "−" ? t - z : t + z), 0) < 0) {
            meldung.textContent = "Das Ergebnis wäre kleiner als 0: Oben muss mehr stehen, als weggenommen wird."; return;
          }
          if (v.id === ":" && zahlen[1] === 0) { meldung.textContent = "Durch 0 kann man nicht teilen."; return; }
          if (spalten(v.id, zahlen) - komma > MAX_STELLEN) { meldung.textContent = "Das wird zu breit: Der Notizblock geht bis zur Million."; return; }
          const raster = baueRaster(v.id, zahlen, komma, zeichen, regel);
          eingabe.remove();
          flaeche.append(raster);
          titel.textContent = felder.map((f, j) => (j ? ` ${zeichen[j]} ` : "") + f.value.replace(/\s/g, "")).join("");
          s.fertig = true;
          // Weiterrechnen mit dem Ergebnis: bei der Kommaregel stehen ka + kb Stellen nach dem Komma
          s.ergebnis = () => geschrieben(raster, v.id, regel ? regel.ka + regel.kb : komma);
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

      // Eigenes Ziffernfeld (Hinweis Patrik, LERN_Session14): Die Ziffern der App sind neben dem Block teils verdeckt,
      // und in die Zahlenfelder schrieben sie nicht. Es schreibt in das gewählte Feld des Blocks — Zahl oder Häuschen —,
      // ohne ihm den Fokus zu nehmen; ohne Wahl in das erste leere Zahlenfeld. Es steht fest unten im Block (LERN_Session15).
      let zuletzt = null;
      const ziel = () => {
        const a = document.activeElement;
        if (a && panel.contains(a) && a.matches("input")) return a;
        if (zuletzt?.isConnected) return zuletzt;
        return [...panel.querySelectorAll(".nb-zahl")].find(f => !f.value) || panel.querySelector(".nb-zahl, .nb-feld, .nb-gl");
      };
      // Das Tastenfeld des Kerns (TF1 a): Ziffern wie bisher; ⌫ im leeren Häuschen geht eines zurück
      const tasten = KERN.tastenfeld({ klasse: "nb-tasten", label: "Ziffern für den Notizblock", ziel, ton,
        leer: f => { if (f.classList.contains("nb-feld")) weiter(f, false); },
        tasten: ["1", "2", "3", "4", "5", { text: kommaZeichen(), label: "Komma" }, "6", "7", "8", "9", "0", "⌫"] }).element;
      // Bei einer Gleichung dazu die Zeichen, nur solange ein Feld der Gleichung gewählt ist (GL1 a): ihre Variablen
      // (ohne Gleichung x), Rechenzeichen, Klammern, =; ² und / nur, wenn die Gleichung sie hat (x², 3/x)
      const text = startZeilen.join(" ");
      const variablen = [...new Set(text.match(/[a-z]/g) || ["x"])];
      const zeichenFeld = angeboten.includes(GLEICHUNG) ? KERN.tastenfeld({ klasse: "nb-tasten nb-zeichen", label: "Zeichen für die Gleichung", ziel, ton,
        tasten: [...variablen, "+", { text: "−", label: "Minus" }, { text: "·", label: "Mal" }, { text: ":", label: "Geteilt" }, "(", ")", "=",
          ...(/²/.test(text) ? ["²"] : []), ...(/\//.test(text) ? [{ text: "/", label: "Bruchstrich" }] : [])] }).element : null;
      if (zeichenFeld) zeichenFeld.hidden = true;
      const zeigeZeichen = () => { if (zeichenFeld) zeichenFeld.hidden = !ziel()?.matches?.(".nb-gl, .nb-umf"); };
      for (const v of angeboten) wahl.append(el("button", { type: "button", class: "chip", "data-vorlage": v.id, "aria-pressed": "false", text: v.text,
        onclick: () => neuerSchritt(v) }));
      const zu = el("button", { type: "button", class: "nb-zu", "aria-label": "Notizblock schliessen", title: "Schliessen (leert den Block)", text: "✕", onclick: schliessen });
      const klein = el("button", { type: "button", class: "nb-zu", "aria-label": "Notizblock verkleinern", title: "Verkleinern", text: "▁",
        onclick: () => gross(panel.classList.contains("klein")) });
      const panel = el("aside", { class: "notizblock", role: "dialog", "aria-label": "Notizblock" },
        el("div", { class: "nb-kopf" }, el("b", { text: "📝 Notizblock" }), el("span", { class: "leise-text", text: "wird nicht bewertet" }), klein, zu),
        el("div", { class: "nb-inhalt" }, blatt, wahlBox),
        el("div", { class: "nb-fuss" }, zeichenFeld, tasten));
      // Ziffer getippt: weiter in Schreibrichtung; Rücktaste im leeren Feld: zurück. Erstes Hineinschreiben meldet beiEingabe.
      panel.addEventListener("focusin", e => { if (e.target.matches?.("input")) { zuletzt = e.target; e.target.inputMode = "none"; zeigeZeichen(); } });
      panel.addEventListener("input", e => {
        const f = e.target;
        if (f.classList?.contains("nb-feld") && f.value) weiter(f, true);
        if (f.value) beiEingabe?.();
      });
      panel.addEventListener("keydown", e => {
        const f = e.target;
        if (f.classList?.contains("nb-feld") && e.key === "Backspace" && !f.value) { e.preventDefault(); weiter(f, false); }
        e.stopPropagation(); // Kurztasten der App und Enter der Rückmeldung nicht auslösen, solange hier getippt wird
      });
      document.body.append(panel);
      document.body.classList.add("mit-notizblock");
      offen = { panel, beiEingabe };
      vorn();
      wahl.querySelector("button").focus();
    }

    /** Gross (true) oder auf die Kopfzeile verkleinert (false); gross meldet vorn(). */
    function gross(an) {
      if (!offen) return;
      offen.panel.classList.toggle("klein", !an);
      document.body.classList.toggle("notizblock-klein", !an);
      if (an) vorn();
    }
    const verkleinern = () => gross(false);

    /** Schliessen und leeren (Knopf ✕ oder neue Aufgabe). */
    function schliessen() {
      offen?.panel.remove();
      if (typeof document !== "undefined") document.body.classList.remove("mit-notizblock", "notizblock-klein");
      offen = null;
    }

    /** Knopf „📝 Notizblock“; beiEingabe wie bei oeffne. klasse: Klassen des Knopfs in der App. */
    const knopf = (beiEingabe, { klasse = "knopf hell klein", vorlagen = null, gleichung = "" } = {}) => el("button", { type: "button", class: `${klasse} nb-knopf`, text: "📝 Notizblock",
      title: "Schriftlich rechnen wie auf einem Blatt — wird nicht bewertet", onclick: () => oeffne({ beiEingabe, vorlagen, gleichung }) });

    return { ziffern, rechne, raster, oeffne, schliessen, verkleinern, knopf, VORLAGEN, GLEICHUNG, istOffen: () => !!offen,
      istKlein: () => !!offen && offen.panel.classList.contains("klein") };
  }

  KERN.notizblock = Object.assign(notizblock, { rechne, ziffern, zahlAus, kommaregel, loesungAus, VORLAGEN, GLEICHUNG, STELLEN: STELLEN_STANDARD, MAX_STELLEN, MAX_NACHKOMMA, MAX_ZEILEN });
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
