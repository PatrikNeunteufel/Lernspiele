/* Lernsteig — reiner Teil des Rahmens (ohne DOM). Wird von jeder Seite und vom Testskript
   (tools/pruefe_uebungen.js) geladen. Vertrag: docs/lernsteig/rahmen.md.
   Keine Abhängigkeit zu eulenpfad/: Übernahmen stehen in docs/gemeinsame_mechaniken.md. */
"use strict";

var LST = (function () {
  const PRAEFIX = "lernsteig:"; // eigener Speicher (Entscheid SP1 a)

  // Speicher und Zufall aus dem Kern (kern/speicher.js, kern/zufall.js, kern 1.1.0).
  const SPEICHER = KERN.speicher(PRAEFIX);
  /** Gespeicherten Wert lesen; ohne Speicher (privates Fenster, Node) gilt der Standard. */
  const lies = (schluessel, standard) => SPEICHER.lies(schluessel, standard);
  // Wer wissen will, dass etwas gespeichert wurde (der Abgleich über einen Ordner zieht danach die eigene Datei nach,
  // gemeinsam/abgleich.js; wie im Eulenpfad).
  const aenderungsHoerer = [];
  const beiAenderung = f => aenderungsHoerer.push(f);
  /** Speichern und die Hörer benachrichtigen; true, wenn es gespeichert ist (false: Speicher voll oder gesperrt). */
  function schreibe(schluessel, wert) {
    const ok = SPEICHER.schreibe(schluessel, wert);
    for (const f of aenderungsHoerer) try { f(schluessel); } catch (e) { /* ein Hörer darf das Speichern nicht stören */ }
    return ok;
  }

  /** Felder der Runden und Rekorde von vor LERN_Session15 und ihre Namen im gemeinsamen Format (R1 a, kern/runden.js). */
  const ALTE_FELDER = { konto: "person", uebung: "inhalt" };
  /**
   * Runden und Rekorde älterer Fassungen in die heutige Form (beim Laden und beim Einlesen): Felder von vor LERN_Session15,
   * und bis LERN_Session18 zeit = Beginn sowie zeiten/falsch/liste getrennt (RA1 a, RA4 a; KERN.runde.ausLernsteig). Der
   * Rekord einer solchen Runde (gleiche Kennung) trug ebenfalls den Beginn: zeit + dauer. Gibt { runden, rekorde, geaendert }.
   */
  function alteEintraegeUmdeuten({ runden = [], rekorde = [] } = {}) {
    let geaendert = false;
    const felder = e => (e && typeof e === "object" && ("konto" in e || "uebung" in e) ? (geaendert = true, KERN.runden.umdeuten(e, ALTE_FELDER)) : e);
    const verschoben = new Set();
    const r = runden.map(felder).map(e => {
      const n = KERN.runde.ausLernsteig(e);
      if (n !== e) { geaendert = true; if (n.endlos) verschoben.add(n.id); }
      return n;
    });
    const k = rekorde.map(felder).map(e => {
      if (!e || !verschoben.has(e.id) || typeof e.dauer !== "number" || Number.isNaN(Date.parse(e.zeit))) return e;
      geaendert = true;
      return { ...e, zeit: new Date(Date.parse(e.zeit) + Math.round(e.dauer * 1000)).toISOString() };
    });
    return { runden: r, rekorde: k, geaendert };
  }

  // Zufall über die austauschbare Quelle des Kerns, damit das Testskript mit Seed laufen kann (LST.quelle.zufall = …).
  const { quelle, zufall, waehle, mische } = KERN.zufall;

  // Zahlschreibweise wie der Lehrplan SG (Entscheid Z1 a, docs/lernsteig/lehrplan/sg_oberstufe_praxis.md 5):
  // Tausender mit Apostroph ab vier Stellen („1'000“, „320'000“), Dezimalpunkt („0.725“). Zeichen wie im Lehrplantext
  // (ASCII-Apostroph). Das Minuszeichen ist nicht Teil von Z1 a; bis zum Entscheid gilt „−“ (U+2212), Frage MZ1.
  // Die Rechenarbeit macht der Kern (kern/zahl.js, kern 1.0.0, docs/plan_angleich_reihe.md B); hier steht nur die
  // Schreibweise des Lernsteigs.
  const TAUSENDER = "'";
  const MINUS = "−";

  /** Dezimalzeichen: Punkt wie im Lehrplan (Z1 a). Eine Einstellung „komma“ bleibt für später möglich. */
  function dezimalZeichen() { return (lies("einstellungen", {}).dezimal === "komma") ? "," : "."; }
  const schreibweise = () => ({ tausender: TAUSENDER, abStellen: 4, minus: MINUS, dezimal: dezimalZeichen() });

  /** Zahl in der Schreibweise des Lernsteigs: „1'000“, „−320'000“, „1'234.5“ (nur der ganze Teil gegliedert). */
  const zahlText = n => KERN.zahl.text(n, schreibweise());
  /** Dezimalzahl mit dem eingestellten Zeichen, ohne Exponent und Rundungsreste; stellen: feste Nachkommastellen. */
  const dezimalText = (x, stellen) => KERN.zahl.dezimalText(x, stellen, schreibweise());
  // Zahlen nach Wertziffern (MA.1.A.3 f, g: „Dezimalzahlen bis 5 Wertziffern“; RZ2 a, RZ3 a, LERN_Session19). Bis
  // LERN_Session23 in rationale-zahlen/aufgaben.js, seither auch für brueche f (Dezimalzahlen addieren, subtrahieren).
  const rund9 = x => Math.round(x * 1e9) / 1e9;
  /** Wertziffern einer Zahl: alle Ziffern ohne Komma und ohne führende Nullen (0.3 → 1, 308 → 3, 23.56 → 4). */
  const wertziffern = z => String(z).replace(".", "").replace(/^0+/, "").length;
  /**
   * RZ3 a: Zwei Zahlen haben zusammen gleich oft 3, 4 oder 5 Wertziffern — die ganze Spanne bis zur Grenze, vom kleinen
   * Beispiel (12 · 0,3) bis zum grossen (308 · 52). Je Summe die Aufteilungen gleich oft.
   */
  const AUFTEILUNG = { 3: [[2, 1], [1, 2]], 4: [[3, 1], [2, 2]], 5: [[3, 2], [4, 1]] };
  const aufteilung = (max = 5) => waehle(AUFTEILUNG[zufall(3, max)]);
  /** Ganze Zahl mit n Stellen; einstellig 2 bis 9 (mal 1 übt nichts). */
  const ganzeZahl = n => (n === 1 ? zufall(2, 9) : zufall(10 ** (n - 1), 10 ** n - 1));
  /** Dezimalzahl mit n Wertziffern und 1 oder 2 Nachkommastellen (höchstens n), letzte Ziffer nicht 0: 0.3, 4.7, 0.47, 23.56. */
  function dezimalZahl(n) {
    const k = zufall(1, Math.min(2, n));
    let m;
    do m = ganzeZahl(n); while (m % 10 === 0);
    return rund9(m / 10 ** k);
  }

  /** Eingabe einer Zahl lesen („−“, „-“, „–“, Punkt oder Komma, Leerzeichen und Apostroph); Zahl oder null. */
  const leseZahl = text => KERN.zahl.lies(text);

  /**
   * Zahlen aus einem Aufgabentext lesen (Plan B2 Schritt 3, TD1 a: liesText der Übungen liest, was das Kind sieht, und
   * prüft es gegen die Prüfdaten). muster: der ganze Text, „#“ steht für eine Zahl in der Schreibweise des Lernsteigs
   * (Apostroph in Dreiergruppen, „−“, Punkt oder Komma), „~“ für eine Einheit (Buchstaben, ohne Ziffern), „#*“ (einmal je
   * Muster) für eine Liste „#, #, …“ mit 1 bis 20 Zahlen, die als ein Element (Array) zurückkommt; alles andere gilt
   * wörtlich. Liefert die Zahlen in ihrer Reihenfolge oder null, wenn der Text nicht so lautet.
   */
  function zahlenImText(text, muster) {
    const stern = muster.indexOf("#*");
    if (stern >= 0) {
      const vor = muster.slice(0, stern), nach = muster.slice(stern + 2), i = vor.split("#").length - 1;
      for (let n = 1; n <= 20; n++) {
        const z = zahlenImText(text, vor + Array(n).fill("#").join(", ") + nach);
        if (z) return [...z.slice(0, i), z.slice(i, i + n), ...z.slice(i + n)];
      }
      return null;
    }
    const ZAHL = "([−-]?(?:\\d{1,3}(?:'\\d{3})+|\\d+)(?:[.,]\\d+)?)";
    const EINHEIT = "(?:[A-Za-zÄÖÜäöü€$]+)";
    const woertlich = t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`^${muster.split("#").map(t => t.split("~").map(woertlich).join(EINHEIT)).join(ZAHL)}$`);
    const m = String(text).match(re);
    return m ? m.slice(1).map(leseZahl) : null;
  }

  /**
   * Antwort einer Zahl- oder Term-Aufgabe prüfen, ohne Seite (rahmen.js ruft es; tools/pruefe_uebungen.js prüft damit die
   * Annahme von Antworten, Plan B2 Schritt 3). Ergebnis { art, wert?, meldung? }: art „richtig“, „falsch“, „unlesbar“ oder
   * „form“ (Term gleichwertig, aber nicht in der verlangten Form) — die beiden letzten zählen nicht als Fehlversuch.
   * Zahl: richtig bis auf a.toleranz (gerundete Ergebnisse wie bei π), sonst bis auf Rundungsreste.
   */
  function antwortPruefen(a, eingabe) {
    if (a.art === "term") {
      const r = LST_TERME.bewerte(eingabe, a);
      if (!r.lesbar) return { art: "unlesbar", meldung: r.meldung };
      if (r.gleichwertig && !r.ok) return { art: "form", meldung: r.meldung };
      return { art: r.ok ? "richtig" : "falsch", wert: String(eingabe).trim() };
    }
    const wert = leseZahl(eingabe);
    // ZL1 a: Apostroph nur zwischen Dreiergruppen; steht er falsch, ein Hinweis und kein Fehlversuch
    if (wert === null) return { art: "unlesbar", meldung: KERN.zahl.gliederungFalsch(eingabe) ? "Den Apostroph nur zwischen Dreiergruppen, zum Beispiel 12'340." : "Bitte eine Zahl eingeben." };
    return { art: Math.abs(wert - a.antwort) <= (a.toleranz || 0) + rundungsrest(a.antwort) ? "richtig" : "falsch", wert };
  }
  /**
   * Was beim Vergleich mit der Lösung als Rundungsrest gilt (Plan D1, LERN_Session25): 1e-14 der Lösung — Gleitkomma-Reste
   * weniger Rechenschritte (je etwa 1e-16), aber weniger als eine Stelle bei 15 gültigen Ziffern; nie relativ zur Eingabe,
   * sonst wüchse er mit ihr. Bei der Lösung 0 gilt 1e-15. Bis LERN_Session25 absolut 1e-9: Dann galt in zehnerpotenzen k
   * „0.000000076“ für 7.62 · 10⁻⁸.
   */
  const rundungsrest = loesung => (loesung === 0 ? 1e-15 : 1e-14 * Math.abs(loesung));

  /**
   * Tasten für die Antwort einer Aufgabe (TF1 a, für KERN.tastenfeld). Zahl: Ziffern, Komma, ⌫, ± (Vorzeichen wechseln).
   * Term: Ziffern; die Variablen des Terms der Aufgabe (a.ausdruck, sonst a.text: einzelne Buchstaben, nicht Teil eines
   * Worts) und „/“ und „²“, wenn er sie hat; die Zeichen der Übung (a.tasten, etwa „^“, „(“); + − ·; ⌫. Seit die Tastatur
   * des Geräts zu bleibt, muss jedes Zeichen der Lösung hier eine Taste haben (Meldung Patrik, LERN_Session20: „b · b · b“
   * als Potenz ohne Taste b, „Fasse zusammen“ mit Brüchen ohne „/“) — tools/pruefe_uebungen.js prüft das je Aufgabe.
   */
  function antwortTasten(a) {
    const ZIFFERN = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    if (a.art !== "term") {
      const vorzeichen = { text: "±", label: "Vorzeichen wechseln", tue: f => {
        const v = f.value.trim();
        f.value = /^[-−]/.test(v) ? v.replace(/^[-−]\s*/, "") : MINUS + v;
      } };
      return ["1", "2", "3", "4", "5", { text: dezimalZeichen(), label: "Komma" }, "6", "7", "8", "9", "0", "⌫", vorzeichen];
    }
    const quelle = String(a.ausdruck || a.text);
    const variablen = [...new Set(quelle.match(/(?<![A-Za-zÄÖÜäöüß])[a-z](?![A-Za-zÄÖÜäöüß])/g) || [])].sort();
    const zeichen = [...variablen, ...(quelle.includes("/") ? ["/"] : []), ...(quelle.includes("²") ? ["²"] : []), ...(a.tasten || []), "+", MINUS, "·"];
    const NAME = { [MINUS]: "Minus", "·": "Mal", "/": "Bruchstrich" };
    return [...ZIFFERN, ...[...new Set(zeichen)].map(t => (NAME[t] ? { text: t, label: NAME[t] } : t)), "⌫"];
  }

  /**
   * Niveaus (Entscheid NV1 a): intern kantonsunabhängig, gespeichert je Fach im Profil. Angezeigt wird der
   * Name aus dem Lehrplan-Profil (lehrplaene.js).
   */
  // NV2 a: zwei Inhaltsniveaus nach Lehrplan (lehrplan/lehrplan_sg_sek1.md 2, A1). Ein Prüfungsziel
  // (Gymnasium, EAP, Stellwerk 8) ist eine eigene Achse im Profil, kein Niveau.
  const NIVEAUS = [
    { id: "n1", nr: 1, kurz: "bis Grundanspruch Zyklus 3" },
    { id: "n2", nr: 2, kurz: "Grundanspruch und Auftrag Zyklus 3" },
  ];
  const niveauNr = id => (NIVEAUS.find(n => n.id === id) || { nr: 0 }).nr;

  /**
   * Stufen einer Übung (Entscheide ST1 a, ST2 a): Jede Lehrplan-Stufe der Übung ist eine Referenzstufe (Id = Buchstabe
   * des Lehrplans, „h“), zwischen zwei benachbarten liegt ein Übergang (Id „h-i“, Aufgaben beider Stufen gemischt),
   * zuoberst die Challenge (Id „challenge“, überall gleich: alle Stufen gemischt, schwerste Varianten). Die Zahl der
   * Stufen hängt an der Übung; Namen und Verhalten sind in jeder Übung gleich.
   * eintrag: Katalog-Eintrag mit `stufen` (Buchstaben, aufsteigend).
   */
  function stufenListe(eintrag) {
    const lp = eintrag.stufen;
    const liste = [];
    lp.forEach((s, i) => {
      if (i > 0) liste.push({ id: `${lp[i - 1]}-${s}`, typ: "uebergang", lp: [lp[i - 1], s], name: `Übergang ${lp[i - 1]} → ${s}` });
      liste.push({ id: s, typ: "referenz", lp: [s], name: `Stufe ${s}` });
    });
    liste.push({ id: "challenge", typ: "challenge", lp: lp.slice(), name: "Challenge" });
    return liste;
  }
  const stufeVon = (eintrag, id) => stufenListe(eintrag).find(s => s.id === id) || null;

  /**
   * Zielstufe eines Niveaus in einer Kompetenz (NV2 a): n1 = Grundanspruch Z3 (ohne GA: Orientierungspunkt, sonst die
   * letzte Stufe), n2 = letzte Stufe des Zyklus 3. marken: LST_LEHRPLAENE.MARKEN[kompetenz].
   */
  function zielstufe(marken, niveau) {
    if (!marken) return null;
    const letzte = marken.stufen[marken.stufen.length - 1];
    return niveau === "n1" ? (marken.ga || marken.op || letzte) : letzte;
  }

  // ---------- Serie über Tage (BF1 a: selbst gesetzt, ohne Stern) ----------
  // Ein Übungstag ist ein Kalendertag (Ortszeit) mit mindestens einer Runde. Wochen beginnen am Montag.
  const tagText = d => KERN.zeit.tag(d);
  /**
   * Wochenziel: tage = Menge der Übungstage („JJJJ-MM-TT“), ziel = Tage je Woche (1–7).
   * Liefert { dieseWoche, ziel, erreicht, wochenInFolge }: wochenInFolge zählt die Wochen direkt vor dieser, die das
   * Ziel erreichten, dazu diese, wenn sie es schon erreicht hat. Eine laufende Woche unterbricht die Serie nicht.
   * Rechnung im Kern (KERN.auswertung.wochen, AW1 a; dieselbe wie das Wochenziel des Eulenpfads, ohne Minuten).
   */
  function wochenSerie(tage, ziel, heute = new Date()) {
    const runden = [...tage].map(t => { const [j, m, d] = t.split("-").map(Number); return { zeit: new Date(j, m - 1, d, 12).toISOString(), dauer: 0 }; });
    const w = KERN.auswertung.wochen(runden, { tage: ziel }, heute.getTime());
    return { dieseWoche: w.aktuelle.erfuellteTage, ziel, erreicht: w.aktuelle.erfuellt, wochenInFolge: w.serie };
  }

  return {
    PRAEFIX, ALTE_FELDER, alteEintraegeUmdeuten, lies, schreibe, beiAenderung, quelle, zufall, waehle, mische, tagText, wochenSerie,
    TAUSENDER, MINUS, schreibweise, zahlText, dezimalText, dezimalZeichen, leseZahl, antwortTasten, antwortPruefen, zahlenImText,
    wertziffern, aufteilung, ganzeZahl, dezimalZahl,
    NIVEAUS, niveauNr, stufenListe, stufeVon, zielstufe,
  };
})();

if (typeof module !== "undefined") module.exports = LST;
