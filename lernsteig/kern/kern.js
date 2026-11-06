/* kern 1.12.0 · Prüfsumme sha256:675df77377b3ffe116878a85572e823e2cd8f25ba929bfb8b961d70aa7e370c4 · erzeugt von tools/kern_verteilen.py aus kern/ — nicht von Hand ändern, sondern kern/ ändern und neu verteilen. */
/* ---- kern/zahl.js ---- */
/* Kern — Zahlschreibung (Entscheide KB1 a, KB2 a; Plan docs/plan_angleich_reihe.md B).
   Die Schreibweise ist eine Einstellung der App, der Kern kennt keine App:
     { tausender: Zeichen der Gliederung, abStellen: ab so vielen Ziffern vor dem Komma wird gegliedert,
       minus: Minuszeichen, dezimal: Dezimalzeichen }
   Eulenpfad: schmales Leerzeichen ab 5 Stellen („30 400“, „4500“); Lernsteig: Apostroph ab 4 Stellen (Z1 a, „1'000“).
   Ohne DOM und ohne Speicher; im Browser und in Node gleich. */
"use strict";

(function (KERN) {
  const STANDARD = { tausender: " ", abStellen: 5, minus: "−", dezimal: "." };
  const mit = sw => Object.assign({}, STANDARD, sw || {});

  /** Ziffernfolge vor dem Komma gliedern („30400“ → „30 400“), kürzere bleiben ungegliedert. */
  function gliedere(ziffern, sw) {
    return ziffern.length < sw.abStellen ? ziffern : ziffern.replace(/\B(?=(\d{3})+(?!\d))/g, sw.tausender);
  }

  /** Betrag als Dezimaltext ohne Exponent und ohne Rundungsreste („0.00000004485“, 0.1 + 0.2 → „0.3“). */
  function klartext(x) {
    return Number(Math.abs(x).toPrecision(15)).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 });
  }

  /**
   * Zahl mit dem Dezimalzeichen der Schreibweise; vor dem Komma gegliedert. stellen: feste Anzahl Nachkommastellen,
   * ohne Angabe so viele wie nötig. Das Minus steht nur, wenn eine Ziffer ungleich 0 sichtbar ist (kein „−0“).
   */
  function dezimalText(x, stellen, sw) {
    sw = mit(sw);
    if (!Number.isFinite(x)) return String(x);
    // Ganze Zahlen exakt (auch 16 Stellen), sonst über klartext; mit stellen gerundet.
    const roh = stellen !== undefined ? Math.abs(x).toFixed(stellen)
      : Number.isSafeInteger(x) ? String(Math.abs(x)) : klartext(x);
    const [ganz, rest] = roh.split(".");
    const t = gliedere(ganz, sw) + (rest ? sw.dezimal + rest : "");
    return x < 0 && /[1-9]/.test(roh) ? sw.minus + t : t;
  }

  /** Zahl in der Schreibweise der App. Ganze Zahlen ohne Komma; andere wie dezimalText (nur der ganze Teil gegliedert). */
  function text(n, sw) {
    return dezimalText(n, undefined, sw);
  }

  /**
   * Eingabe einer Zahl lesen: „−“, „-“, „–“ als Minus, Punkt oder Komma als Dezimalzeichen, Leerzeichen und Apostroph
   * als Gliederung. Eine Zahl oder null, wenn die Eingabe keine Zahl ist.
   */
  function lies(eingabe) {
    const t = String(eingabe).trim().replace(/[\s  '’]/g, "").replace(/[−–]/g, "-").replace(",", ".");
    if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t)) return null;
    return Number(t);
  }

  KERN.zahl = { STANDARD, text, dezimalText, lies, klartext };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/bruch.js ---- */
/* Kern — exakte Bruchrechnung mit BigInt (Entscheide KB1 a, KB2 a; Herkunft lernsteig/gemeinsam/bruch.js, LST_Session1).
   Für Prüffunktionen: Lösungen werden unabhängig vom Generator nachgerechnet. Ohne DOM, ohne Speicher.
   Ein Bruch ist { z, n } (BigInt) mit n > 0, gekürzt. */
"use strict";

(function (KERN) {
  const ggt = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
  function bruch(z, n = 1n) {
    z = BigInt(z); n = BigInt(n);
    if (n === 0n) throw new Error("Division durch 0");
    if (n < 0n) { z = -z; n = -n; }
    const g = ggt(z, n) || 1n;
    return { z: z / g, n: n / g };
  }
  const plus = (a, b) => bruch(a.z * b.n + b.z * a.n, a.n * b.n);
  const minus = (a, b) => bruch(a.z * b.n - b.z * a.n, a.n * b.n);
  const mal = (a, b) => bruch(a.z * b.z, a.n * b.n);
  const durch = (a, b) => bruch(a.z * b.n, a.n * b.z);
  const neg = a => bruch(-a.z, a.n);
  function hoch(a, e) { let r = bruch(1n); for (let i = 0; i < e; i++) r = mal(r, a); return r; }

  /** Ganzzahlige k-te Wurzel von x ≥ 0, exakt auch über 2^53 (Bisektion auf BigInt); null, wenn nicht ganz. */
  function wurzelGanz(x, k) {
    if (x < 0n) return null;
    if (x < 2n) return x;
    const K = BigInt(k);
    let lo = 0n, hi = 1n;
    while (hi ** K <= x) hi *= 2n;
    while (lo + 1n < hi) { const m = (lo + hi) / 2n; if (m ** K <= x) lo = m; else hi = m; }
    return lo ** K === x ? lo : null;
  }
  /** Exakte k-te Wurzel, sonst Fehler. */
  function wurzel(a, k) {
    const z = wurzelGanz(a.z, k), n = wurzelGanz(a.n, k);
    if (z === null || n === null) throw new Error("Wurzel nicht exakt");
    return bruch(z, n);
  }
  /** Dezimaltext („1'234.56“, „30 400“, „0,5“, „-3“) → Bruch; keine Zahl → Fehler „keine Zahl: …“. */
  function zahl(text) {
    const t = String(text).replace(/['’\s  ]/g, "").replace(/−/g, "-").replace(",", ".");
    const m = /^([+-]?)(\d*)(?:\.(\d*))?$/.exec(t);
    if (!m || !(m[2] + (m[3] || ""))) throw new Error(`keine Zahl: ${text}`);
    const d = m[3] || "";
    const b = bruch(BigInt((m[2] || "0") + d), 10n ** BigInt(d.length));
    return m[1] === "-" ? neg(b) : b;
  }
  /** JavaScript-Zahl → Bruch über den Dezimaltext mit 15 gültigen Ziffern (exakt für grosse und sehr kleine Zahlen). */
  function vonZahl(x) {
    if (!Number.isFinite(x)) throw new Error(`keine endliche Zahl: ${x}`);
    const s = Number.isSafeInteger(x) ? String(Math.abs(x))
      : Number(Math.abs(x).toPrecision(15)).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 });
    const b = zahl(s);
    return x < 0 ? neg(b) : b;
  }
  const gleich = (a, b) => a.z === b.z && a.n === b.n;
  /** Vergleich: negativ, 0 oder positiv wie a − b. */
  const vergleich = (a, b) => { const d = a.z * b.n - b.z * a.n; return d < 0n ? -1 : d > 0n ? 1 : 0; };
  /** Ist der Bruch eine endliche Dezimalzahl? */
  function endlich(a) { let n = a.n; for (const p of [2n, 5n]) while (n % p === 0n) n /= p; return n === 1n; }
  const text = a => (a.n === 1n ? String(a.z) : `${a.z}/${a.n}`);
  const alsZahl = a => Number(a.z) / Number(a.n);

  KERN.bruch = { bruch, plus, minus, mal, durch, neg, hoch, wurzel, wurzelGanz, zahl, vonZahl, gleich, vergleich, endlich, text, alsZahl };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/speicher.js ---- */
/* Kern — Speicher im Browser mit Präfix der App (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.3).
   Alle Apps teilen den Ursprung patrikneunteufel.github.io und damit localStorage; darum schreibt jede App nur unter
   ihrem Präfix („lernspiele:“, „lernsteig:“, „gratwanderung:“). Der Kern kennt keine Schlüssel der Apps.
   Darf fehlen (privates Fenster, gesperrter Speicher, Node): dann gilt beim Lesen der Ersatz, Schreiben meldet false. */
"use strict";

(function (KERN) {
  // Über den globalen Namen, nicht über globalThis: Ersatz-DOMs der Testskripte (tools/pruef_dom.js) legen
  // localStorage als Variable an. Der Zugriff selbst kann werfen (gesperrte Cookies).
  const ablage = () => { try { return typeof localStorage !== "undefined" ? localStorage : null; } catch (e) { return null; } };

  /**
   * Speicher für ein Präfix: { praefix, lies(schluessel, ersatz), schreibe(schluessel, wert) → true|false,
   * entferne(schluessel), schluessel() → Liste der Schlüssel ohne Präfix }. Werte als JSON.
   */
  function speicher(praefix) {
    if (typeof praefix !== "string" || !/^[a-z][a-z0-9-]*:$/.test(praefix)) throw new Error(`ungültiges Präfix: ${praefix}`);
    function lies(schluessel, ersatz) {
      try {
        const v = ablage()?.getItem(praefix + schluessel);
        return v === null || v === undefined ? ersatz : JSON.parse(v);
      } catch (e) { return ersatz; }
    }
    function schreibe(schluessel, wert) {
      try {
        const a = ablage();
        if (!a) return false;
        a.setItem(praefix + schluessel, JSON.stringify(wert));
        return true;
      } catch (e) { return false; } // voll oder gesperrt: der Aufrufer entscheidet, ob er warnt
    }
    function entferne(schluessel) { try { ablage()?.removeItem(praefix + schluessel); } catch (e) { /* fehlt */ } }
    function schluessel() {
      const a = ablage(), liste = [];
      try { for (let i = 0; a && i < a.length; i++) { const k = a.key(i); if (k && k.startsWith(praefix)) liste.push(k.slice(praefix.length)); } }
      catch (e) { /* fehlt */ }
      return liste;
    }
    return { praefix, lies, schreibe, entferne, schluessel };
  }

  KERN.speicher = speicher;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/zufall.js ---- */
/* Kern — Zufall über eine austauschbare Quelle (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.4).
   Standard ist Math.random, erst beim Aufruf gelesen: So greift auch ein Testskript, das Math.random ersetzt
   (Eulenpfad, tools/pruef_dom.js). Ein Testskript kann stattdessen KERN.zufall.quelle.zufall setzen (Lernsteig) oder
   eine Quelle mit Startwert von KERN.zufall.mitStartwert(seed) nehmen. */
"use strict";

(function (KERN) {
  const quelle = { zufall: () => Math.random() };
  /** Ganze Zahl von min bis max (beide eingeschlossen). */
  function zufall(min, max) { return min + Math.floor(quelle.zufall() * (max - min + 1)); }
  /** Ein Element der Liste. */
  function waehle(liste) { return liste[Math.floor(quelle.zufall() * liste.length)]; }
  /** Gemischte Kopie der Liste (Fisher-Yates). */
  function mische(liste) {
    const a = liste.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(quelle.zufall() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  /** Wiederholbare Zahlenfolge in [0, 1) aus einem Startwert (mulberry32), für Testskripte. */
  function mitStartwert(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  KERN.zufall = { quelle, zufall, waehle, mische, mitStartwert };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/el.js ---- */
/* Kern — Element bauen (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.5).
   Greift erst beim Aufruf auf document zu, nie beim Laden (in Node ladbar).
   el("button", { class, text, onclick, "aria-label": …, … }, kinder…)
   - text → textContent (immer für Daten: Namen, eingelesene Dateien, Eingaben)
   - html → innerHTML, nur für festen Text aus dem Code, nie für Daten
   - on… → addEventListener
   - undefined, null, false → Attribut weglassen; true → leeres Attribut (disabled, hidden)
   - Kinder: verschachtelte Listen werden flach gemacht; undefined, null, false fallen weg. */
"use strict";

(function (KERN) {
  function el(tag, attr, ...kinder) {
    const e = document.createElement(tag); // globaler Name (auch der Ersatz-DOM tools/pruef_dom.js)
    for (const [k, v] of Object.entries(attr || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "class") e.className = v;
      else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (const kind of kinder.flat(Infinity)) if (kind !== undefined && kind !== null && kind !== false) e.append(kind);
    return e;
  }

  KERN.el = el;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/geheimnis.js ---- */
/* Kern — PIN, Wiederherstellungscode und Sicherheitsfrage als Prüfwerte (Entscheide PIN1 a, PIN1-R a, AU1 a, P2 a;
   Herkunft eulenpfad/spiele/gemeinsam/spiel.js und lernsteig/gemeinsam/konten.js, beide mit derselben Rechnung).
   Gespeichert werden nur Salz und SHA-256 von „salz:wert“, nie die PIN, der Code oder die Antwort selbst.
   Grenze (DS1 a): Das schützt vor Versehen und Neugier am selben Gerät, nicht vor jemandem mit Entwicklerwerkzeugen.
   crypto.subtle gibt es nur in einem sicheren Kontext (https, localhost, Datei); fehlt es (etwa http über das Netz),
   melden die Funktionen das mit einem Satz statt eines Laufzeitfehlers (Befund D6). */
"use strict";

(function (KERN) {
  const CODE_ZEICHEN = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // ohne 0/O und 1/I, die man verwechselt
  const OHNE_KRYPTO = "Auf dieser Adresse kann der Browser keine PIN prüfen (nur über https, localhost oder als Datei "
    + "geöffnet). Bitte die Seite so öffnen.";

  const krypto = () => (typeof crypto !== "undefined" ? crypto : null);
  /** Kann dieses Fenster Prüfwerte rechnen? */
  const verfuegbar = () => !!krypto()?.subtle && typeof krypto().getRandomValues === "function";
  function brauche() { if (!verfuegbar()) throw new Error(OHNE_KRYPTO); }

  const hex = bytes => [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
  function salz() { brauche(); return hex(krypto().getRandomValues(new Uint8Array(16))); }
  async function hash(text, s) {
    brauche();
    const daten = new TextEncoder().encode(`${s}:${text}`);
    return hex(new Uint8Array(await krypto().subtle.digest("SHA-256", daten)));
  }
  /** Prüfwert { salz, hash } zu einem Wert. */
  async function pruefwert(text) { const s = salz(); return { salz: s, hash: await hash(text, s) }; }
  /** Stimmt der Wert zum Prüfwert? Ohne Prüfwert nie. */
  async function stimmt(text, wert) { return !!wert?.salz && !!wert?.hash && (await hash(text, wert.salz)) === wert.hash; }

  const pinGueltig = pin => /^\d{4,6}$/.test(String(pin ?? ""));
  /** Code ohne Gliederung und in Grossbuchstaben („k7qm 2xra-9tpl“ → „K7QM2XRA9TPL“). */
  const codeRein = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  /** Antwort der Sicherheitsfrage: Gross/Klein, ß/ss und mehrfache Leerzeichen zählen nicht. */
  const antwortRein = a => String(a || "").trim().toLowerCase().replace(/ß/g, "ss").replace(/\s+/g, " ");
  /** Neuer Wiederherstellungscode, 12 Zeichen in drei Gruppen („K7QM-2XRA-9TPL“). */
  function neuerCode() {
    brauche();
    const z = [...krypto().getRandomValues(new Uint8Array(12))].map(b => CODE_ZEICHEN[b % CODE_ZEICHEN.length]).join("");
    return `${z.slice(0, 4)}-${z.slice(4, 8)}-${z.slice(8)}`;
  }

  /** Prüfwert der PIN (4–6 Ziffern), sonst Fehler. */
  async function pin(p) {
    if (!pinGueltig(p)) throw new Error("Die PIN hat 4 bis 6 Ziffern.");
    return pruefwert(String(p));
  }
  const pinStimmt = (p, wert) => stimmt(String(p ?? ""), wert);
  /**
   * Wiederherstellung { code: Prüfwert, frage?, antwort?: Prüfwert } (Format des Eulenpfads, PIN1 a).
   * Ohne code wird einer erzeugt; zurück kommt { wiederherstellung, code } — der Code ist nur jetzt sichtbar.
   */
  async function wiederherstellung({ code, frage, antwort } = {}, alt = {}) {
    const c = code || neuerCode();
    const w = { ...alt, code: await pruefwert(codeRein(c)) };
    if (frage && antwort) { w.frage = String(frage).trim().slice(0, 120); w.antwort = await pruefwert(antwortRein(antwort)); }
    return { wiederherstellung: w, code: c };
  }
  const codeStimmt = (c, w) => stimmt(codeRein(c), w?.code);
  const antwortStimmt = (a, w) => !!antwortRein(a) && stimmt(antwortRein(a), w?.antwort);

  KERN.geheimnis = {
    OHNE_KRYPTO, verfuegbar, salz, hash, pruefwert, stimmt, pinGueltig, pin, pinStimmt,
    codeRein, antwortRein, neuerCode, wiederherstellung, codeStimmt, antwortStimmt,
  };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/person.js ---- */
/* Kern — Personen einer App: Kennung, Name, Rolle, Geburtsdatum, Liste und Zusammenführen
   (Entscheide P1 a, P2 a, Vorgabe B3; Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.7).

   Person: { id, name, rolle: "lernend" | "aufsicht", art?: "eltern" | "lehrperson" (nur Aufsicht),
             gruppenleitung?: true (G2 a), geboren: "JJJJ-MM-TT" | "JJJJ-MM" | null, klasse, frueher?: [ids],
             angelegt: ISO, geaendert: { <feld>: ISO }, pin?, wiederherstellung?, … Felder der App }
   - Die Kennung entsteht beim Anlegen und ändert sich nie; sie reist bei einer Übernahme in eine andere App mit (C9).
   - Der Name ist je App und Gerät eindeutig (ohne Gross/Klein und Leerzeichen am Rand) und nur Anzeige.
   - geaendert hält je Feld die Zeit der letzten Änderung: Beim Zusammenführen gewinnt je Feld der jüngere Stand.
   - pin und wiederherstellung (kern/geheimnis.js) bleiben auf dem Gerät: ohneGeheimnis nimmt sie aus Sicherungen,
     Abgleich und Einladungen. Eine App kann weitere Gerätefelder nennen (geraetFelder). */
"use strict";

(function (KERN) {
  const ROLLEN = ["lernend", "aufsicht"];
  const AUFSICHT_ARTEN = ["eltern", "lehrperson"];
  const GEHEIM = ["pin", "wiederherstellung"];
  const VERWALTUNG = new Set(["id", "frueher", "angelegt", "geaendert"]);
  const NAME_MAX = 40;

  // ---------- Kennung ----------
  function zufallHex(n) {
    const c = typeof crypto !== "undefined" && crypto.getRandomValues ? crypto : null;
    const b = c ? c.getRandomValues(new Uint8Array(n)) : Array.from({ length: n }, () => Math.floor(Math.random() * 256));
    return [...b].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  /** Neue Kennung „p-<Zeit>-<Zufall>“, eindeutig über Geräte und Apps. */
  const neueId = () => `p-${Date.now().toString(36)}-${zufallHex(5)}`;

  // ---------- Name ----------
  const nameRein = n => String(n ?? "").trim().replace(/\s+/g, " ").slice(0, NAME_MAX);
  const nameSchluessel = n => nameRein(n).toLocaleLowerCase("de-CH");
  const nameGleich = (a, b) => nameSchluessel(a) === nameSchluessel(b) && nameSchluessel(a) !== "";

  // ---------- Geburtsdatum (B3) ----------
  const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober",
    "November", "Dezember"];
  const zwei = z => String(z).padStart(2, "0");
  function gueltigesDatum(j, m, t) {
    if (j < 1900 || j > 2100 || m < 1 || m > 12) return false;
    if (t === undefined) return true;
    const d = new Date(Date.UTC(j, m - 1, t));
    return d.getUTCFullYear() === j && d.getUTCMonth() === m - 1 && d.getUTCDate() === t;
  }
  /**
   * Eingabe → gespeicherte Form: „TT.MM.JJJJ“, „T.M.JJJJ“, „JJJJ-MM-TT“ → „JJJJ-MM-TT“; „MM.JJJJ“, „JJJJ-MM“ → „JJJJ-MM“
   * (Tag fehlt, Profile des Eulenpfads seit LERN_Session14). Kein gültiges Datum → null.
   */
  function geburtsdatumLies(text) {
    const t = String(text ?? "").trim();
    let m;
    if ((m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(t))) return gueltigesDatum(+m[3], +m[2], +m[1]) ? `${m[3]}-${zwei(m[2])}-${zwei(m[1])}` : null;
    if ((m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t))) return gueltigesDatum(+m[1], +m[2], +m[3]) ? t : null;
    if ((m = /^(\d{1,2})\.(\d{4})$/.exec(t))) return gueltigesDatum(+m[2], +m[1]) ? `${m[2]}-${zwei(m[1])}` : null;
    if ((m = /^(\d{4})-(\d{2})$/.exec(t))) return gueltigesDatum(+m[1], +m[2]) ? t : null;
    return null;
  }
  /** Gespeicherte Form → Anzeige: „07.03.2014“, ohne Tag „März 2014“; sonst "". */
  function geburtsdatumText(g) {
    const s = geburtsdatumLies(g);
    if (!s) return "";
    const [j, m, t] = s.split("-");
    return t ? `${t}.${m}.${j}` : `${MONATE[+m - 1]} ${j}`;
  }
  const tagFehlt = g => /^\d{4}-\d{2}$/.test(geburtsdatumLies(g) || "");
  /**
   * Alter in ganzen Jahren am Tag heute (Ortszeit). Ohne Tag zählt das neue Lebensjahr ab dem Ersten des
   * Geburtsmonats (höchstens einen Monat zu früh, wie bisher im Eulenpfad). Kein Datum → null.
   */
  function alter(g, heute = new Date()) {
    const s = geburtsdatumLies(g);
    if (!s) return null;
    const [j, m, t = 1] = s.split("-").map(Number);
    let a = heute.getFullYear() - j;
    const mh = heute.getMonth() + 1, th = heute.getDate();
    if (mh < m || (mh === m && th < t)) a--;
    return a >= 0 ? a : null;
  }

  // ---------- Prüfen (für Einlesen, Abgleich, Einladung; Befund D4) ----------
  /** Mängel einer Person als Liste von Sätzen; leer heisst gültig. */
  function maengel(p) {
    const m = [];
    if (!p || typeof p !== "object" || Array.isArray(p)) return ["keine Person"];
    if (typeof p.id !== "string" || !/^[A-Za-z0-9_-]{3,64}$/.test(p.id)) m.push("Kennung fehlt oder ungültig");
    if (typeof p.name !== "string" || !nameRein(p.name)) m.push("Name fehlt");
    if (!ROLLEN.includes(p.rolle)) m.push(`unbekannte Rolle ${p.rolle}`);
    if (p.art !== undefined && p.art !== null && !AUFSICHT_ARTEN.includes(p.art)) m.push(`unbekannte Art ${p.art}`);
    if (p.geboren !== undefined && p.geboren !== null && !geburtsdatumLies(p.geboren)) m.push("Geburtsdatum ungültig");
    if (p.frueher !== undefined && !(Array.isArray(p.frueher) && p.frueher.every(x => typeof x === "string"))) m.push("frühere Kennungen ungültig");
    if (p.geaendert !== undefined && (typeof p.geaendert !== "object" || p.geaendert === null || Array.isArray(p.geaendert))) m.push("Änderungszeiten ungültig");
    return m;
  }
  /** Kopie ohne Geheimnisse und Gerätefelder (Sicherung, Abgleich, Einladung, Übernahme). */
  function ohneGeheimnis(p, geraetFelder = []) {
    const c = { ...p };
    for (const f of GEHEIM.concat(geraetFelder)) delete c[f];
    return c;
  }

  // ---------- Liste im Speicher der App ----------
  /**
   * Personen einer App im Speicher (KERN.speicher(praefix)) unter einem Schlüssel (Standard „personen“).
   * felder: Vorgaben der App für neue Personen (etwa { klasse: null, fokus: [] }).
   */
  function liste(speicher, { schluessel = "personen", felder = {} } = {}) {
    const alle = () => (speicher.lies(schluessel, []) || []).filter(p => !maengel(p).length);
    const speichere = l => speicher.schreibe(schluessel, l);
    const finde = id => alle().find(p => p.id === id || (p.frueher || []).includes(id)) || null;
    const findeName = name => alle().find(p => nameGleich(p.name, name)) || null;
    const nameFrei = (name, ausserId = null) => !!nameRein(name) && !alle().some(p => p.id !== ausserId && nameGleich(p.name, name));

    /** Neue Person anlegen; Fehler, wenn der Name fehlt oder vergeben ist. Gibt die Person zurück. */
    function anlegen(daten = {}) {
      const name = nameRein(daten.name);
      if (!name) throw new Error("Der Name fehlt.");
      if (!nameFrei(name)) throw new Error(`Den Namen „${name}“ gibt es schon.`);
      const jetzt = new Date().toISOString();
      const p = { ...felder, ...daten, id: daten.id || neueId(), name, rolle: daten.rolle || "lernend", angelegt: jetzt, geaendert: {} };
      if (p.geboren !== undefined && p.geboren !== null) p.geboren = geburtsdatumLies(p.geboren);
      // Zeit nur für gesetzte Felder (und Name, Rolle), nicht für Vorgaben der App: sonst überschriebe eine leere
      // Vorgabe beim Zusammenführen den echten Wert eines anderen Geräts.
      for (const k of new Set([...Object.keys(daten), "name", "rolle"])) if (!VERWALTUNG.has(k)) p.geaendert[k] = jetzt;
      const fehler = maengel(p);
      if (fehler.length) throw new Error(fehler.join(", "));
      if (!speichere(alle().concat(p))) throw new Error("Der Speicher des Browsers ist voll oder gesperrt.");
      return p;
    }
    /** Felder ändern; jedes geänderte Feld bekommt seine Zeit. Gibt die Person zurück (oder null). */
    function aendere(id, daten) {
      const l = alle(); const i = l.findIndex(p => p.id === id);
      if (i < 0) return null;
      const jetzt = new Date().toISOString();
      const p = { ...l[i], geaendert: { ...(l[i].geaendert || {}) } };
      for (const [k, v] of Object.entries(daten)) {
        if (VERWALTUNG.has(k)) continue;
        if (k === "name") {
          const n = nameRein(v);
          if (!nameFrei(n, id)) throw new Error(`Den Namen „${n}“ gibt es schon.`);
          p.name = n;
        } else p[k] = k === "geboren" && v !== null ? geburtsdatumLies(v) : v;
        p.geaendert[k] = jetzt;
      }
      const fehler = maengel(p);
      if (fehler.length) throw new Error(fehler.join(", "));
      l[i] = p;
      if (!speichere(l)) throw new Error("Der Speicher des Browsers ist voll oder gesperrt.");
      return p;
    }
    function entferne(id) { speichere(alle().filter(p => p.id !== id)); }
    return { schluessel, alle, finde, findeName, nameFrei, anlegen, aendere, entferne, speichere };
  }

  // ---------- Zusammenführen (Sicherung einlesen, Abgleich zwischen Geräten) ----------
  const zeit = (p, k) => (p.geaendert && p.geaendert[k]) || "";
  /** Ältere Person zuerst (angelegt, dann Kennung): ihre Kennung bleibt. */
  const aelter = (a, b) => ((a.angelegt || "") < (b.angelegt || "") || ((a.angelegt || "") === (b.angelegt || "") && a.id <= b.id) ? a : b);
  /** Zwei Fassungen derselben Person verbinden: je Feld der jüngere Stand, Geheimnisse und Gerätefelder von hier. */
  function verbinde(hier, dort, geraetFelder) {
    const bleibt = aelter(hier, dort), andere = bleibt === hier ? dort : hier;
    const neu = { ...hier, id: bleibt.id, angelegt: bleibt.angelegt, geaendert: { ...(hier.geaendert || {}) } };
    for (const k of Object.keys(dort)) {
      if (VERWALTUNG.has(k) || GEHEIM.includes(k) || geraetFelder.includes(k)) continue;
      if (!(k in hier) || zeit(dort, k) > zeit(hier, k)) { neu[k] = dort[k]; neu.geaendert[k] = zeit(dort, k); }
    }
    const frueher = new Set([...(hier.frueher || []), ...(dort.frueher || [])]);
    if (andere.id !== bleibt.id) frueher.add(andere.id);
    frueher.delete(bleibt.id);
    if (frueher.size) neu.frueher = [...frueher]; else delete neu.frueher;
    return { neu, alt: andere.id !== bleibt.id ? andere.id : null };
  }
  /**
   * Fremde Personen in die eigenen führen (P1 a): gleiche Kennung (auch eine frühere) → verbinden; sonst gleicher
   * Name → verbinden, die ältere Kennung bleibt, die andere wird frühere Kennung; sonst neu. Ungültige werden
   * abgewiesen. Gibt { personen, neu, geaendert, abgewiesen, kennungen: { <alt>: <neu> } } — mit kennungen biegt die
   * App Verweise (Protokoll, Rekorde) auf die bleibende Kennung um.
   */
  function zusammenfuehren(eigene, fremde, { geraetFelder = [] } = {}) {
    const personen = eigene.map(p => ({ ...p }));
    const erg = { personen, neu: 0, geaendert: 0, abgewiesen: 0, kennungen: {} };
    for (const roh of Array.isArray(fremde) ? fremde : []) {
      if (maengel(roh).length) { erg.abgewiesen++; continue; }
      const f = ohneGeheimnis(roh, geraetFelder);
      const ids = new Set([f.id, ...(f.frueher || [])]);
      let i = personen.findIndex(p => ids.has(p.id) || (p.frueher || []).some(x => ids.has(x)));
      if (i < 0) i = personen.findIndex(p => nameGleich(p.name, f.name));
      if (i < 0) { personen.push(f); erg.neu++; continue; }
      const vorher = JSON.stringify(personen[i]);
      const { neu, alt } = verbinde(personen[i], f, geraetFelder);
      // Ein jüngerer Name von dort, den hier schon jemand anders trägt, gilt nicht (Namen bleiben eindeutig).
      if (!nameGleich(neu.name, personen[i].name) && personen.some((p, j) => j !== i && nameGleich(p.name, neu.name))) {
        neu.name = personen[i].name; neu.geaendert.name = zeit(personen[i], "name");
      }
      if (alt) erg.kennungen[alt] = neu.id;
      if (personen[i].id !== neu.id) erg.kennungen[personen[i].id] = neu.id;
      personen[i] = neu;
      if (JSON.stringify(neu) !== vorher) erg.geaendert++;
    }
    return erg;
  }

  /**
   * Übernahme einer Aufsicht in eine andere App (Plan C9; Entscheide Ü1 a, Ü2 b, LERN_Session16). Alle Apps teilen den
   * Speicher des Browsers; ziel ist die Personenliste der Ziel-App (liste(KERN.speicher("<präfix>"), …)), keine App lädt
   * die andere. Mit reisen Kennung, Name, Rolle, PIN-Prüfwert (gleiche PIN) sowie Sicherheitsfrage und Antwort-Prüfwert;
   * der Wiederherstellungscode ist je App ein eigener Einmal-Schlüssel und wird neu ausgegeben. Verlauf, Verbindungen
   * und Einstellungen reisen nicht. Keine Bestätigung in der Ziel-App (Ü2 b: in der Quell-App schon geprüft).
   * zusatz: Felder, die die Ziel-App verlangt (Lernsteig: art). Nichts wird überschrieben.
   * Liefert { status: "neu" | "schon" | "name", person, code }: „schon“ = dieselbe Kennung ist dort, „name“ = der Name ist
   * dort an jemand anderen vergeben.
   */
  async function uebernehmen(quelle, ziel, zusatz = {}) {
    if (!quelle || quelle.rolle !== "aufsicht") throw new Error("Übernommen wird nur eine Aufsicht.");
    if (!quelle.pin) throw new Error("Die Aufsicht hat noch keine PIN.");
    const da = [quelle.id, ...(quelle.frueher || [])].map(ziel.finde).find(Boolean);
    if (da) return { status: "schon", person: da, code: null };
    if (!ziel.nameFrei(quelle.name)) return { status: "name", person: ziel.findeName(quelle.name), code: null };
    const alt = quelle.wiederherstellung || {};
    const behalten = alt.frage && alt.antwort ? { frage: alt.frage, antwort: alt.antwort } : {};
    const w = await KERN.geheimnis.wiederherstellung({}, behalten);
    // Die Art (Eltern, Lehrperson) reist mit, wenn die Quelle sie kennt; die Ziel-App kann sie über zusatz setzen.
    const person = ziel.anlegen({ ...(quelle.art ? { art: quelle.art } : {}), ...zusatz, id: quelle.id, name: quelle.name, rolle: "aufsicht", pin: quelle.pin, wiederherstellung: w.wiederherstellung });
    return { status: "neu", person, code: w.code };
  }

  KERN.person = {
    ROLLEN, AUFSICHT_ARTEN, GEHEIM, NAME_MAX, neueId, nameRein, nameGleich,
    geburtsdatumLies, geburtsdatumText, tagFehlt, alter, maengel, ohneGeheimnis, liste, zusammenfuehren, uebernehmen,
  };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/freigabe.js ---- */
/* Kern — Freigabe nach Prüfstand (Entscheide L4 a, E1 a, FG1 a; Herkunft eulenpfad/spiele/gemeinsam/spiel.js;
   docs/kern/rahmen.md 4.8).
   Prüfstand im Repo, Freigabe auf dem Gerät. Frei ist, was nichts mehr zu prüfen hat:
   - Ein Inhalt (Spiel, Übung) mit `neu` im Katalog ist gesperrt, bis der Prüfstand ihn als angesehen führt.
   - Eine Inhaltsliste (Katalog `listen: { <liste>: { name, zusatz?, von? } }`) ist gesperrt, bis sie geprüft ist.
     `von: "<inhalt>/<liste>"` verweist auf die Liste eines anderen Inhalts: Prüfstand und Freigabe gelten an der
     Quelle. `zusatz: true` ergibt allein keine Aufgabe und macht einen Inhalt nicht sichtbar.
   - Die Aufsicht kann je Gerät anders entscheiden: Speicher „freigabe“ = { <art>: { <id>: bool }, listen: { … } };
     ohne Eintrag entscheidet der Prüfstand. „freigabeStand“ hält die Zeit der letzten Änderung (Abgleich: der jüngste
     Stand gewinnt).
   Die App gibt alles mit: wo der Katalog und der Prüfstand stehen, wie ihr Inhalt heisst (art), ihren Speicher und
   ob gerade eine Aufsicht angemeldet ist (sie sieht alles). */
"use strict";

(function (KERN) {
  /**
   * opt: { art: "spiele" | "uebungen", eintrag: id → Katalogeintrag | null, pruefstand: () → { <art>, listen },
   *        speicher: { lies, schreibe }, aufsicht: () → bool }
   */
  function freigabe(opt) {
    const { art, eintrag, speicher } = opt;
    const aufsicht = opt.aufsicht || (() => false);
    const stand = () => ({ ...(speicher.lies("freigabe", {}) || {}) });
    const geraet = () => { const f = stand(); return { ...f, [art]: { ...(f[art] || {}) }, listen: { ...(f.listen || {}) } }; };
    function setze(bereich, schluessel, wert) {
      const f = geraet();
      if (wert === null) delete f[bereich][schluessel]; else f[bereich][schluessel] = !!wert;
      // Stand vor der Freigabe schreiben: Der Abgleich nimmt die Freigabe des Geräts mit dem jüngsten Stand.
      speicher.schreibe("freigabeStand", new Date().toISOString());
      speicher.schreibe("freigabe", f);
    }
    /** Prüfstand { am, von } oder null; bereich = art oder "listen". */
    const pruefstand = (bereich, schluessel) => (opt.pruefstand() || {})[bereich]?.[schluessel] || null;
    /** Schlüssel "<inhalt>/<liste>" der Quelle einer Liste (folgt dem Verweis von). */
    const listenQuelle = (id, listeId) => eintrag(id)?.listen?.[listeId]?.von || `${id}/${listeId}`;
    function quellEintrag(schluessel) { const [i, l] = schluessel.split("/"); return eintrag(i)?.listen?.[l] || null; }
    /** Inhaltslisten: [{ id, quelle, name, geprueft, von, zusatz }] — Name und Prüfstand von der Quelle. */
    const listen = id => Object.entries(eintrag(id)?.listen || {}).map(([lid, l]) => {
      const quelle = l.von || `${id}/${lid}`;
      const q = l.von ? quellEintrag(l.von) : l;
      return { id: lid, quelle, name: q?.name ?? l.name, geprueft: pruefstand("listen", quelle), von: l.von || null, zusatz: !!q?.zusatz };
    });
    /** Liste für Lernende frei? */
    const listeFrei = (id, listeId) => { const s = listenQuelle(id, listeId); return geraet().listen[s] ?? !!pruefstand("listen", s); };
    const setzeListeFrei = (id, listeId, wert) => setze("listen", listenQuelle(id, listeId), wert);
    /** Listen, die die angemeldete Person üben darf (die Aufsicht alle). */
    const freieListen = id => listen(id).filter(l => aufsicht() || listeFrei(id, l.id)).map(l => l.id);
    /** Muss der Inhalt als Ganzes noch angesehen werden (neu und nicht im Prüfstand)? */
    const zuPruefen = id => !!eintrag(id)?.neu && !pruefstand(art, id);
    const geprueft = id => pruefstand(art, id);
    /** Inhalt als Ganzes frei (ohne Blick auf die Listen)? */
    const frei = id => geraet()[art][id] ?? !zuPruefen(id);
    const setzeFrei = (id, wert) => setze(art, id, wert);
    /** Sehen Lernende den Inhalt? Frei und, falls er Listen hat, mindestens eine eigenständige Liste frei. */
    const fuerLernendeSichtbar = id => frei(id) && (!listen(id).length || listen(id).some(l => !l.zusatz && listeFrei(id, l.id)));
    const sichtbar = id => aufsicht() || fuerLernendeSichtbar(id);
    /** Warum Lernende den Inhalt nicht sehen, oder null. */
    function sperrGrund(id) {
      if (!eintrag(id)) return "unbekannt";
      if (fuerLernendeSichtbar(id)) return null;
      if (geraet()[art][id] === false) return "auf diesem Gerät gesperrt";
      if (!frei(id)) return "noch nicht angesehen";
      const l = listen(id).filter(x => !x.zusatz);
      if (l.some(x => geraet().listen[x.quelle] === false)) return "Inhaltslisten gesperrt";
      return l.length === 1 ? "Inhaltsliste noch nicht geprüft" : `keine der ${l.length} Inhaltslisten geprüft`;
    }
    return { art, geraet, setze, pruefstand, listenQuelle, listen, listeFrei, setzeListeFrei, freieListen, zuPruefen,
      geprueft, frei, setzeFrei, fuerLernendeSichtbar, sichtbar, sperrGrund };
  }

  KERN.freigabe = freigabe;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/suche.js ---- */
/* Kern — Suche mit Relevanz und persönlicher Passung (Entscheid SU1 a, Wunsch Patrik LERN_Session10; Herkunft
   eulenpfad/spiele/gemeinsam/spiel.js; docs/kern/rahmen.md 4.9).
   Kleine Volltextsuche mit Rangfolge: je Suchwort der beste Treffer über alle Felder, gewichtet nach Feld und Art
   des Treffers; jedes Suchwort muss passen. Passt ein Eintrag nur über ein Feld, das auf der Karte nicht steht,
   nennt `grund` es. Die Passung (0–1, von der App gerechnet) wirkt als Faktor 1 + faktor · Passung auf die
   Textrelevanz — der Text bleibt massgebend. Ohne DOM; die App gibt Einträge, Felder, Gewichte und Passung mit. */
"use strict";

(function (KERN) {
  const falte = t => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  /** Wörter eines Texts, klein; Punkte nur im Wort („MA.1.A.3“ bleibt ganz). */
  const woerter = t => String(t || "").toLowerCase().split(/[^\p{L}\p{N}.]+/u).map(w => w.replace(/^\.+|\.+$/g, "")).filter(Boolean);
  /** Höchstens ein Zeichen Unterschied (einfügen, löschen, ersetzen)? */
  function einTippfehler(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, fehler = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++fehler > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return fehler + (a.length - i) + (b.length - j) <= 1;
  }
  /**
   * Wie gut passt das Suchwort q zum Wort w (0 bis 1)? Ganz 1, Wortanfang 0.8, mit ä = a 0.7 / 0.6, Wortteil ab 4
   * Zeichen 0.4 / 0.3, ein Tippfehler (nur wenn tippfehler, ab 5 Zeichen, nie mit Ziffern) 0.25.
   */
  function wortWert(q, w, tippfehler = false) {
    if (w === q) return 1;
    if (w.startsWith(q)) return 0.8;
    const fq = falte(q), fw = falte(w);
    if (fw === fq) return 0.7;
    if (fw.startsWith(fq)) return 0.6;
    if (q.length >= 4 && w.includes(q)) return 0.4;
    if (q.length >= 4 && fw.includes(fq)) return 0.3;
    if (tippfehler && q.length >= 5 && !/\d/.test(q)
      && (einTippfehler(fq, fw.slice(0, fq.length)) || einTippfehler(fq, fw.slice(0, fq.length + 1)))) return 0.25;
    return 0;
  }
  const mitPassung = (wert, p, faktor = 0.5) => (p === null || p === undefined ? wert : wert * (1 + faktor * p));
  /** Nähe zweier Klassen oder Stufen für die Passung: gleich 1, eine daneben 0.6, zwei 0.2, sonst 0; unbekannt 0.5. */
  const naehe = (a, b) => (a == null || b == null ? 0.5 : ([1, 0.6, 0.2][Math.abs(a - b)] ?? 0));

  /**
   * Einträge zur Suche, beste zuerst: [{ id, wert, passung, grund }]; leere Suche: null.
   * opt: { felder: e → { <feld>: [Texte] }, gewicht: { <feld>: Zahl }, sichtbar: [Felder auf der Karte],
   *        tippfehler: [Felder mit Tippfehler], grund: (feld, text) → Satz, passung: e → 0–1 | null, faktor }
   * Bei gleichem Wert bleibt die Reihenfolge der Einträge.
   */
  function suche(text, eintraege, opt) {
    const qs = woerter(text);
    if (!qs.length) return null;
    const sichtbar = new Set(opt.sichtbar || []), tipp = new Set(opt.tippfehler || []);
    const treffer = [];
    (eintraege || []).forEach((e, rang) => {
      const felder = opt.felder(e);
      let wert = 0;
      const gruende = [];
      for (const q of qs) {
        let best = 0, wo = null;
        for (const [feld, texte] of Object.entries(felder)) for (const t of texte || []) for (const w of woerter(t)) {
          const x = wortWert(q, w, tipp.has(feld)) * (opt.gewicht[feld] || 0);
          if (x > best) { best = x; wo = { feld, t }; }
        }
        if (!best) return;
        wert += best;
        if (!sichtbar.has(wo.feld) && opt.grund) gruende.push(opt.grund(wo.feld, wo.t));
      }
      const p = opt.passung ? opt.passung(e) : null;
      treffer.push({ id: e.id, wert: mitPassung(wert, p, opt.faktor), passung: p, rang, grund: gruende.length ? [...new Set(gruende)].join("; ") : null });
    });
    return treffer.sort((a, b) => b.wert - a.wert || a.rang - b.rang).map(({ rang, ...t }) => t);
  }

  /**
   * Ähnliche Einträge, ähnlichste zuerst: [{ id, wert, passung, grund }].
   * opt: { vergleich: (eintrag, anderer) → { wert, grund } | null (null = nicht ähnlich), passung, faktor }
   */
  function aehnlich(id, eintraege, opt) {
    const e = (eintraege || []).find(x => x.id === id);
    if (!e) return [];
    const liste = [];
    eintraege.forEach((x, rang) => {
      if (x.id === id) return;
      const v = opt.vergleich(e, x);
      if (!v) return;
      const p = opt.passung ? opt.passung(x) : null;
      liste.push({ id: x.id, wert: mitPassung(v.wert, p, opt.faktor), passung: p, rang, grund: v.grund || "" });
    });
    return liste.sort((a, b) => b.wert - a.wert || a.rang - b.rang).map(({ rang, ...t }) => t);
  }

  KERN.suche = { woerter, falte, einTippfehler, wortWert, mitPassung, naehe, suche, aehnlich };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/runden.js ---- */
/* Kern — Runden und Rekorde in einem Format für alle Apps (Entscheid R1 a; docs/kern/rahmen.md 4.10).
   Runde:  { id, person, zeit, inhalt, stufe, aufgaben?, fehler?, dauer?, test?, … Felder der App }
   Rekord: { id, person, zeit, inhalt, stufe, punkte, dauer?, test?, abgebrochen?, … Felder der App }
   - inhalt ist die Kennung des Spiels (Eulenpfad) oder der Übung (Lernsteig); die Oberfläche sagt weiter Spiel/Übung.
   - Die Kernfelder prüft der Kern; die Felder der App prüft er nach dem Schema, das die App meldet
     ({ <feld>: "zahl" | "text" | "bool" | "liste" | "objekt" | "zahlOderNull" | "textOderNull" }). Unbekannte Felder
     bleiben (eine neuere Fassung der App darf mehr schreiben).
   - Kennung: neue Runden „r-<Zeit>-<Zufall>“; ältere Runden ohne Kennung bekommen eine aus ihrem Inhalt
     (kennungAus), damit dieselbe alte Runde auf jedem Gerät dieselbe Kennung bekommt. */
"use strict";

(function (KERN) {
  /** Kurzer Fingerabdruck eines Werts (cyrb53 über JSON): gleich bei gleichem Inhalt, sonst fast sicher verschieden. */
  function fingerabdruck(wert) {
    const s = typeof wert === "string" ? wert : JSON.stringify(wert);
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  function zufallHex(n) {
    const c = typeof crypto !== "undefined" && crypto.getRandomValues ? crypto : null;
    const b = c ? c.getRandomValues(new Uint8Array(n)) : Array.from({ length: n }, () => Math.floor(Math.random() * 256));
    return [...b].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  /** Neue Kennung einer Runde oder eines Rekords. */
  const neueId = () => `r-${Date.now().toString(36)}-${zufallHex(5)}`;
  /** Feste Kennung für eine ältere Runde ohne Kennung: aus Person (oder Name), Zeit, Inhalt und Stufe. */
  const kennungAus = (wer, zeit, inhalt, stufe) => `r-alt-${fingerabdruck([wer, zeit, inhalt, stufe])}`;

  const istText = x => typeof x === "string" && x.length > 0 && x.length <= 200;
  const istZeit = x => typeof x === "string" && !Number.isNaN(Date.parse(x));
  const istZahl = x => typeof x === "number" && Number.isFinite(x) && x >= 0;
  const ARTEN = {
    zahl: istZahl, text: x => typeof x === "string", bool: x => typeof x === "boolean", liste: Array.isArray,
    objekt: x => !!x && typeof x === "object" && !Array.isArray(x),
    zahlOderNull: x => x === null || istZahl(x), textOderNull: x => x === null || typeof x === "string",
  };

  /**
   * Mängel einer Runde (art "runde") oder eines Rekords (art "rekord") als Liste; leer = gültig.
   * opt: { zusatz: Schema der App-Felder, pflicht: [Felder, die da sein müssen], inhaltBekannt: id → bool,
   *        personBekannt: id → bool }
   */
  function maengel(e, art = "runde", opt = {}) {
    if (!e || typeof e !== "object" || Array.isArray(e)) return ["kein Eintrag"];
    const m = [];
    if (!istText(e.id)) m.push("Kennung fehlt");
    if (!istText(e.person)) m.push("Person fehlt");
    else if (opt.personBekannt && !opt.personBekannt(e.person)) m.push("unbekannte Person");
    if (!istZeit(e.zeit)) m.push("Zeit fehlt oder ungültig");
    if (!istText(e.inhalt)) m.push("Inhalt fehlt");
    else if (opt.inhaltBekannt && !opt.inhaltBekannt(e.inhalt)) m.push(`unbekannter Inhalt ${e.inhalt}`);
    if (!istText(e.stufe)) m.push("Stufe fehlt");
    for (const f of ["aufgaben", "fehler", "dauer"]) if (e[f] !== undefined && !istZahl(e[f])) m.push(`${f} keine Zahl`);
    if (e.test !== undefined && typeof e.test !== "boolean") m.push("test kein Ja/Nein");
    if (art === "rekord" && !istZahl(e.punkte)) m.push("Punkte fehlen");
    for (const f of opt.pflicht || []) if (e[f] === undefined || e[f] === null) m.push(`${f} fehlt`);
    for (const [f, a] of Object.entries(opt.zusatz || {})) if (e[f] !== undefined && !(ARTEN[a] || (() => true))(e[f])) m.push(`${f} ist nicht ${a}`);
    return m;
  }

  /**
   * Eintrag eines älteren Formats umdeuten: Felder umbenennen (felder = { alt: neu }, etwa { spiel: "inhalt" }) und,
   * falls die Kennung fehlt, eine feste aus dem Inhalt geben. Gibt einen neuen Eintrag (der alte bleibt).
   */
  function umdeuten(e, felder = {}) {
    if (!e || typeof e !== "object") return e;
    const n = { ...e };
    for (const [alt, neu] of Object.entries(felder)) if (alt in n && !(neu in n)) { n[neu] = n[alt]; delete n[alt]; }
    // Name vor Kennung: Ältere Einträge tragen den Namen auf jedem Gerät gleich, die Kennung der Person aber erst
    // seit dem Umzug je Gerät verschieden — so bekommt dieselbe alte Runde überall dieselbe Kennung.
    if (!n.id) n.id = kennungAus(n.name || n.person || "", n.zeit, n.inhalt, n.stufe);
    return n;
  }

  /**
   * Einträge zusammenführen (Sicherung einlesen, Abgleich): nach Kennung; bei Rekorden gilt der höhere Stand
   * (Zwischenstand → Endstand). Fremde, ungültige werden abgewiesen; eigene bleiben, wie sie sind (nur `behalten`
   * entscheidet, etwa nach einem Löschvermerk). Ergebnis nach Zeit sortiert: { eintraege, neu, ersetzt, abgewiesen }.
   * opt: { art: "runde" | "rekord", pruefung (wie maengel), umbiegen: person → bleibende Kennung, behalten: e → bool }
   */
  function zusammenfuehren(eigene, fremde, opt = {}) {
    const art = opt.art || "runde";
    const biege = e => (opt.umbiegen && e && e.person ? { ...e, person: opt.umbiegen(e.person) } : e);
    const behalten = opt.behalten || (() => true);
    const nach = new Map();
    let ohneKennung = 0;
    for (const e of (eigene || []).map(biege)) if (e && behalten(e)) nach.set(e.id || `ohne-${ohneKennung++}`, e);
    const erg = { neu: 0, ersetzt: 0, abgewiesen: 0 };
    for (const roh of fremde || []) {
      const e = biege(roh);
      if (maengel(e, art, opt.pruefung).length) { erg.abgewiesen++; continue; }
      if (!behalten(e)) continue;
      const da = nach.get(e.id);
      if (!da) { nach.set(e.id, e); erg.neu++; }
      else if (art === "rekord" && e.punkte > (da.punkte || 0)) { nach.set(e.id, e); erg.ersetzt++; }
    }
    erg.eintraege = [...nach.values()].sort((a, b) => String(a.zeit || "").localeCompare(String(b.zeit || "")));
    return erg;
  }

  KERN.runden = { fingerabdruck, neueId, kennungAus, maengel, umdeuten, zusammenfuehren, ARTEN };
  KERN.fingerabdruck = fingerabdruck;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/anmeldung.js ---- */
/* Kern — Anmeldung und Sitzung im Tab (Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.11).
   Herkunft: eulenpfad/spiele/gemeinsam/spiel.js (Anmeldung L1 a: gewählte Person, Aufsicht nur im Tab) und
   lernsteig/gemeinsam/konten.js (aktives Konto, mit PIN nur im Tab; Aufsicht nur im Tab).

   Ein Platz hält, wer an diesem Gerät angemeldet ist. Gemerkt wird die Kennung der gewählten Person im Speicher der App
   (localStorage, bleibt über das Schliessen des Browsers). Wer im Tab angemeldet sein muss (Standard: eine Aufsicht oder
   wer eine PIN hat), gilt nur, solange derselbe Browser-Tab offen ist (sessionStorage): Schliesst man ihn, ist die Person
   abgemeldet, und wer danach das Gerät nimmt, erbt ihre Rechte nicht. Die PIN prüft KERN.geheimnis.
   Grenze (DS1 a): schützt vor Versehen und Neugier am Gerät, nicht vor Entwicklerwerkzeugen. */
"use strict";

(function (KERN) {
  // Über den globalen Namen (wie speicher.js): Ersatz-DOMs legen sessionStorage als Variable an; der Zugriff kann werfen.
  const tabAblage = () => { try { return typeof sessionStorage !== "undefined" ? sessionStorage : null; } catch (e) { return null; } };

  /** Muss die Person im Tab angemeldet sein? Standard für alle Apps: eine Aufsicht oder wer eine PIN hat. */
  const standardImTab = p => !!p && (p.rolle === "aufsicht" || !!p.pin);

  /**
   * Ein Anmelde-Platz.
   * opt.speicher  KERN.speicher der App (sein Präfix gilt auch für den Tab-Schlüssel)
   * opt.gewaehlt  Schlüssel der gewählten Person im Speicher, oder null: nur im Tab (nichts wird über den Tab hinaus gemerkt)
   * opt.tab       Schlüssel im Tab (ohne Präfix), z. B. "aufsicht"
   * opt.finde     Wert → Person oder null (Kennung; ältere Stände der App auch über den Namen)
   * opt.imTab     Person → muss sie im Tab angemeldet sein? (Standard: Aufsicht oder mit PIN)
   * opt.gast      { tab: "gast", erlaubt: () → bool } — Gast (Entscheid C2 a): nur in diesem Tab, ohne Person; die App
   *               speichert für ihn nichts. Ohne opt.gast gibt es keinen Gast.
   * Liefert { aktiv, waehle, anmelden, abmelden, alsGast, istGast, imTab }.
   */
  function platz(opt) {
    const { speicher, gewaehlt = null, tab, finde, gast = null } = opt || {};
    if (!speicher || typeof speicher.lies !== "function") throw new Error("anmeldung: speicher fehlt");
    if (typeof tab !== "string" || !tab) throw new Error("anmeldung: tab fehlt");
    if (typeof finde !== "function") throw new Error("anmeldung: finde fehlt");
    if (gast && (typeof gast.tab !== "string" || !gast.tab || gast.tab === tab)) throw new Error("anmeldung: gast.tab fehlt oder ist der Tab der Person");
    const imTab = typeof opt.imTab === "function" ? opt.imTab : standardImTab;
    const tabSchluessel = speicher.praefix + tab;
    const gastSchluessel = gast ? speicher.praefix + gast.tab : null;
    const gastErlaubt = () => !!gast && (typeof gast.erlaubt !== "function" || !!gast.erlaubt());

    const tabWert = s => { try { return tabAblage()?.getItem(s) ?? null; } catch (e) { return null; } };
    function tabWertSetze(s, w) {
      try { const a = tabAblage(); if (!a) return false; if (w) a.setItem(s, w); else a.removeItem(s); return true; }
      catch (e) { return false; } // ohne sessionStorage: niemand ist im Tab angemeldet, auch kein Gast
    }
    const tabLies = () => tabWert(tabSchluessel);
    const tabSetze = id => { tabWertSetze(tabSchluessel, id); if (gastSchluessel) tabWertSetze(gastSchluessel, null); };
    /** Steht diese Person im Tab? Auch ein älterer Stand mit ihrem Namen gilt (finde löst ihn auf). */
    const imTabAngemeldet = p => { const w = tabLies(); return !!w && (w === p.id || finde(w)?.id === p.id); };

    /** Die angemeldete Person oder null. */
    function aktiv() {
      if (gewaehlt === null) {
        const p = finde(tabLies());
        return p && imTabAngemeldet(p) ? p : null;
      }
      const p = finde(speicher.lies(gewaehlt, null));
      if (!p) return null;
      return imTab(p) && !imTabAngemeldet(p) ? null : p;
    }
    /** Person ohne PIN wählen (merken, Tab leeren); false, wenn sie im Tab angemeldet sein muss oder unbekannt ist. */
    function waehle(wert) {
      const p = finde(wert);
      if (!p || imTab(p) || gewaehlt === null) return false;
      speicher.schreibe(gewaehlt, p.id);
      tabSetze(null);
      return true;
    }
    /**
     * Anmelden; mit PIN muss sie stimmen. Wer im Tab angemeldet sein muss, braucht eine gesetzte PIN.
     * Gibt die Person zurück oder null (unbekannt, PIN falsch oder fehlt).
     */
    async function anmelden(wert, pin) {
      const p = finde(wert);
      if (!p) return null;
      if (p.pin) { if (!(await KERN.geheimnis.pinStimmt(pin, p.pin))) return null; }
      else if (imTab(p)) return null;
      if (gewaehlt !== null) speicher.schreibe(gewaehlt, p.id);
      tabSetze(imTab(p) ? p.id : null);
      return p;
    }
    /** Abmelden: nichts mehr gewählt, Tab leer, kein Gast. */
    function abmelden() {
      if (gewaehlt !== null) speicher.schreibe(gewaehlt, null);
      tabSetze(null);
    }
    /** Als Gast weiter (nur in diesem Tab): meldet eine Person ab. false, wenn die App keinen Gast erlaubt. */
    function alsGast() {
      if (!gastErlaubt()) return false;
      abmelden();
      return tabWertSetze(gastSchluessel, "ja");
    }
    /** Ist in diesem Tab der Gast unterwegs (und noch erlaubt)? */
    const istGast = () => gastErlaubt() && tabWert(gastSchluessel) === "ja" && !aktiv();
    return { aktiv, waehle, anmelden, abmelden, alsGast, istGast, imTab };
  }

  KERN.anmeldung = { platz, standardImTab };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/entwicklung.js ---- */
/* Kern — Entwickler-Modus (Entscheide E1 a, E2 a, E3 a; Plan docs/plan_angleich_reihe.md B, C6; docs/kern/rahmen.md 4.12).
   Herkunft: eulenpfad/spiele/gemeinsam/entwicklung.js (LERN_Session6).

   Die Aufsicht schaltet ihn mit dem Entwickler-Schlüssel frei; danach blendet ein eigener Schalter die Zusätze ein.
   Dauerhaft geschrieben wird nur über den Entwickler-Server (tools/entwickler_server.py) im lokalen Repo: Prüfstand und
   Bemerkungen der App, die `app` nennt. Ohne Server melden die Aufrufe, dass er fehlt.
   Ein Schlüssel für das ganze Repo: im Klartext nur in entwickler.key (von Git ausgeschlossen), hier sein Hash
   SHA-256(„eulenpfad-entwickler:<Schlüssel>“) — dieselbe Rechnung wie KERN.geheimnis.hash(schlüssel, SALZ).
   Neu gesetzt von: python tools/entwickler_server.py --neuer-schluessel (trägt den Hash hier ein und verteilt). */
"use strict";

(function (KERN) {
  const SCHLUESSEL_HASH = "a1fb5dbb5d54c6de3acc1d372cdef564fedf87e2e349aa1bc4bbddf3be702035";
  const SALZ = "eulenpfad-entwickler"; // seit LERN_Session6; bleibt, damit der bestehende Schlüssel gilt

  /**
   * Entwickler-Modus einer App.
   * opt.app        "eulenpfad" | "lernsteig" | … — der Server schreibt in Prüfstand und Bemerkungen dieser App
   * opt.speicher   KERN.speicher der App (Zustand unter „entwickler“: { schluessel, an, name }, nur auf diesem Gerät)
   * opt.aufsicht   () → ist gerade eine Aufsicht angemeldet? (nur sie sieht die Zusätze)
   * opt.name       () → Name für „von“, wenn keiner gesetzt ist (die angemeldete Aufsicht)
   * opt.pruefstand Objekt des Prüfstands der App (z. B. PRUEFSTAND); nach jeder Änderung auf den Stand des Servers gebracht
   * opt.arten      Bereiche des Prüfstands (Eulenpfad ["spiele", "listen"], Lernsteig ["uebungen", "listen"])
   * opt.melde      (text) → Meldung an die Person (die App zeigt sie; Standard: nichts)
   * opt.start      Pfad der App für die Meldung „Server fehlt“ (z. B. "eulenpfad/")
   */
  function entwicklung(opt) {
    const o = opt || {};
    if (typeof o.app !== "string" || !/^[a-z]+$/.test(o.app)) throw new Error("entwicklung: app fehlt");
    if (!o.speicher || typeof o.speicher.lies !== "function") throw new Error("entwicklung: speicher fehlt");
    if (typeof o.aufsicht !== "function") throw new Error("entwicklung: aufsicht fehlt");
    const arten = Array.isArray(o.arten) && o.arten.length ? o.arten : ["listen"];
    const melde = typeof o.melde === "function" ? o.melde : () => {};
    const SERVER_FEHLT = "Entwickler-Server nicht gefunden.\n\nDer Entwickler-Modus funktioniert nur im lokalen Repo mit laufendem Server:\n"
      + `python tools/entwickler_server.py\ndanach http://localhost:8765/${o.start || ""} öffnen.`;
    const FREMDER_SERVER = "Hier antwortet ein anderer Server ohne Entwickler-Funktionen (z. B. ein noch laufendes "
      + "python -m http.server auf demselben Port).\n\nDiesen beenden, dann python tools/entwickler_server.py starten "
      + "und die Seite mit Strg+F5 neu laden.";
    let fremd = false; // Auf der Adresse läuft ein Server, aber nicht der Entwickler-Server
    const serverMeldung = () => (fremd ? FREMDER_SERVER : SERVER_FEHLT);

    const zustand = () => ({ schluessel: null, an: false, name: "", ...(o.speicher.lies("entwickler", null) || {}) });
    const speichere = daten => o.speicher.schreibe("entwickler", { ...zustand(), ...daten });
    const freigeschaltet = () => !!zustand().schluessel;
    /** Sind die Entwickler-Zusätze sichtbar? Nur für die angemeldete Aufsicht, freigeschaltet und eingeschaltet. */
    const aktiv = () => !!o.aufsicht() && freigeschaltet() && zustand().an;
    const name = () => zustand().name || (typeof o.name === "function" ? o.name() : "") || "";

    /** Schlüssel prüfen (gegen den Hash) und auf diesem Gerät merken; true bei Erfolg. */
    async function freischalten(schluessel) {
      const s = String(schluessel ?? "").trim();
      if (!s || (await KERN.geheimnis.hash(s, SALZ)) !== SCHLUESSEL_HASH) return false;
      speichere({ schluessel: s, an: true });
      return true;
    }
    const sperren = () => o.speicher.schreibe("entwickler", null);
    const setzeAn = an => speichere({ an: !!an });
    const benenne = n => speichere({ name: String(n ?? "").trim().slice(0, 40) });

    // ----- Entwickler-Server -----
    let serverDa = null;
    const lokal = () => typeof location !== "undefined" && String(location.protocol).startsWith("http")
      && ["localhost", "127.0.0.1"].includes(location.hostname);
    /** Läuft die Seite über den Entwickler-Server? { ok, schluessel } oder null. Erfolg wird gemerkt. */
    async function server() {
      if (serverDa) return serverDa;
      try {
        const r = await fetch("/entwicklung/status", { cache: "no-store" });
        fremd = !r.ok && lokal();
        if (r.ok) serverDa = await r.json();
      } catch (e) { /* kein Server */ }
      return serverDa;
    }
    /** An den Server schicken (mit App und Schlüssel); meldet selbst, was schiefging, und gibt dann null zurück. */
    async function sende(pfad, daten) {
      if (!(await server())) { melde(serverMeldung()); return null; }
      try {
        const r = await fetch(pfad, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...daten, app: o.app, schluessel: zustand().schluessel }) });
        const antwort = await r.json();
        if (!r.ok) { melde(`Entwickler-Server: ${antwort.fehler || r.status}`); return null; }
        return antwort;
      } catch (e) {
        serverDa = null;
        melde(serverMeldung());
        return null;
      }
    }
    /** Prüfstand der App auf den Stand des Servers bringen (dasselbe Objekt, damit die Freigabe es sieht). */
    function uebernimm(stand) {
      if (!o.pruefstand || !stand) return;
      for (const a of arten) o.pruefstand[a] = stand[a] || {};
    }

    /** Inhalt als angesehen bzw. Liste als geprüft setzen (geprueft false: aufheben). art aus opt.arten. */
    async function setzeGeprueft(art, id, geprueft) {
      if (!arten.includes(art)) throw new Error(`entwicklung: unbekannte Art ${art}`);
      const stand = await sende("/entwicklung/pruefstand", { art, id, geprueft, von: name() });
      if (!stand) return false;
      uebernimm(stand);
      return true;
    }
    /** Haken je Eintrag einer Liste (Prüfansicht, LP2 a): { liste, setzen, entfernen, komplett, hash }. */
    async function setzeEintraege(daten) {
      const stand = await sende("/entwicklung/eintraege", { ...daten, von: name() });
      if (!stand) return false;
      uebernimm(stand);
      return true;
    }
    /** Status einer Bemerkung setzen (z. B. „erledigt …“). */
    const bemerkungStatus = async (nr, status) => !!(await sende("/entwicklung/bemerkung-status", { nr, status }));
    /** Bemerkung für die Entwicklung: { text, spiel?|inhalt?, stufe?, liste?, eintrag?, schluessel?, aufgabe? }. */
    const bemerkung = daten => sende("/entwicklung/bemerkung",
      { von: name(), seite: typeof location !== "undefined" ? location.pathname : "", ...daten });
    /** Alle Bemerkungen der App (über den Server) oder null. */
    async function bemerkungen() {
      if (!(await server())) return null;
      try { return await (await fetch(`/entwicklung/bemerkungen?app=${o.app}`, { cache: "no-store" })).json(); } catch (e) { return null; }
    }

    return { app: o.app, freigeschaltet, aktiv, freischalten, sperren, setzeAn, benenne, name, zustand, server, serverMeldung,
      /** Antwortet auf der Adresse ein anderer Server (nach server())? */ fremd: () => fremd,
      setzeGeprueft, setzeEintraege, bemerkung, bemerkungen, bemerkungStatus };
  }
  entwicklung.SALZ = SALZ;
  entwicklung.SCHLUESSEL_HASH = SCHLUESSEL_HASH;

  KERN.entwicklung = entwicklung;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/einladung.js ---- */
/* Kern — Einladung in eine andere App (Entscheid EL1 a, Notiz EP1; Plan docs/plan_angleich_reihe.md B; docs/kern/rahmen.md 4.13).
   Herkunft: lernsteig/gemeinsam/konten.js (LST_Session1).

   Beim Übertritt (Eulenpfad nach der 6. Klasse → Lernsteig, später Lernsteig → Gratwanderung) gibt die Aufsicht der
   Person eine Einladung mit: nur Stammdaten, kein Verlauf, keine PIN. Zwei Wege mit demselben Inhalt:
   - Link mit Fragment „…/<ziel>/#einladung=<base64url(JSON)>“ — das Fragment geht nicht an den Server; die Ziel-App
     liest es und löscht es aus der Adresse;
   - Datei „<ziel>-einladung.json“ mit demselben JSON.
   Format: { format: "einladung", v: 1, ziel?, von?, name, geboren?, klasse?, niveau?, lehrplan? }. Ältere Einladungen des
   Lernsteigs ({ v: 1, … } ohne format) gelten weiter. Was eine Klasse, ein Niveau, ein Lehrplan ist, prüft die Ziel-App. */
"use strict";

(function (KERN) {
  const FORMAT = "einladung";
  const FELDER = ["name", "geboren", "klasse", "niveau", "lehrplan"];

  // UTF-8 ↔ base64url ohne escape/unescape: über Bytes (btoa und atob gibt es im Browser und in Node)
  function b64url(text) {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function vonB64url(s) {
    const t = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(t + "===".slice((t.length + 3) % 4));
    return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
  }

  /** Inhalt einer Einladung aus Stammdaten (leere Felder fallen weg). ziel und von: Apps ("lernsteig", "eulenpfad"). */
  function erstellen(daten, { ziel, von } = {}) {
    const d = { format: FORMAT, v: 1 };
    if (ziel) d.ziel = String(ziel);
    if (von) d.von = String(von);
    for (const f of FELDER) if (daten && daten[f] !== undefined && daten[f] !== null && daten[f] !== "") d[f] = daten[f];
    if (!KERN.person.nameRein(d.name || "")) throw new Error("Einladung: Vorname fehlt");
    return d;
  }
  /** Fragment für den Link: „#einladung=…“. */
  const fragment = einladung => "#einladung=" + b64url(JSON.stringify(einladung));
  /** Dateiname für die Datei: „lernsteig-einladung.json“. */
  const dateiname = ziel => `${ziel || "app"}-einladung.json`;

  /**
   * Liest eine Einladung aus einem Fragment („#einladung=…“, auch eine ganze Adresse) oder einem Objekt (Datei).
   * opt.ziel: diese App — eine Einladung für eine andere App gilt nicht. opt.klasse, opt.niveau, opt.lehrplan:
   * Prüfungen der App (Wert → bereinigter Wert oder null). Ungültige Felder fallen weg (Befund D12); ohne gültigen
   * Vornamen oder bei fremdem Format null.
   */
  function lesen(eingabe, opt = {}) {
    let d = eingabe;
    if (typeof eingabe === "string") {
      const m = eingabe.match(/einladung=([A-Za-z0-9_-]+)/);
      if (!m) return null;
      try { d = JSON.parse(vonB64url(m[1])); } catch (e) { return null; }
    }
    if (!d || typeof d !== "object" || Array.isArray(d) || d.v !== 1) return null;
    if (d.format !== undefined && d.format !== FORMAT) return null;
    if (opt.ziel && d.ziel !== undefined && d.ziel !== opt.ziel) return null;
    const erg = {};
    const name = typeof d.name === "string" ? KERN.person.nameRein(d.name) : "";
    if (!name) return null;
    erg.name = name;
    const g = KERN.person.geburtsdatumLies(d.geboren); if (g) erg.geboren = g; // auch ohne Tag (B3)
    for (const f of ["klasse", "niveau", "lehrplan"]) {
      if (d[f] === undefined || typeof opt[f] !== "function") continue;
      const w = opt[f](d[f]);
      if (w !== null && w !== undefined) erg[f] = w;
    }
    if (typeof d.von === "string") erg.von = d.von;
    return erg;
  }

  KERN.einladung = { FORMAT, erstellen, fragment, dateiname, lesen };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;

/* ---- kern/auswertung.js ---- */
/* Kern — Auswertung ohne App-Bezug (Entscheide AW1 a, AW2 a, LERN_Session16; Plan docs/plan_angleich_reihe.md B;
   docs/kern/rahmen.md 4.14). Herkunft: eulenpfad/spiele/gemeinsam/auswertung.js und erfolge.js (Sitzungen, Lernzeiten,
   Wochenziel, Bedarf, Ziehen), lernsteig/gemeinsam/werkzeug.js und rahmen.js (Wochenserie, Kompetenzstand).

   Reine Rechnungen auf Runden im gemeinsamen Format (kern/runden.js: zeit, dauer …) und auf Listen von Aufgaben.
   Was an Katalog, Lernzielen und Ton einer App hängt (Fazit, Vorschläge, Texte), bleibt in der App; sie gibt hier nur
   ihre Schwellen mit. Testrunden filtert die App vorher heraus. */
"use strict";

(function (KERN) {
  const TAG_MS = 24 * 3600 * 1000;
  const WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const mittel = xs => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);
  const median = xs => { if (!xs.length) return null; const a = [...xs].sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };

  /** Pearson-Korrelation zweier gleich langer Reihen; null bei weniger als drei Werten oder ohne Streuung. */
  function korrelation(xs, ys) {
    const n = xs.length;
    if (n < 3) return null;
    const mx = mittel(xs), my = mittel(ys);
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
    return sxx && syy ? sxy / Math.sqrt(sxx * syy) : null;
  }

  /** Runden zu Sitzungen: mehr als pauseMin Minuten (plus Dauer der Runde) zwischen zwei Enden = neue Sitzung. */
  function sitzungen(runden, { pauseMin = 20 } = {}) {
    const sortiert = [...runden].sort((a, b) => a.zeit.localeCompare(b.zeit));
    const ergebnis = [];
    let letzte = null;
    for (const e of sortiert) {
      const t = Date.parse(e.zeit);
      if (!letzte || t - letzte > pauseMin * 60000 + (e.dauer || 0) * 1000) ergebnis.push([]);
      ergebnis[ergebnis.length - 1].push(e);
      letzte = t;
    }
    return ergebnis;
  }

  /** Wann wird gelernt: Minuten und Runden je Wochentag (Mo–So), je Tageszeit und je Tag der letzten 14 Tage. */
  function lernzeiten(runden, jetzt = Date.now()) {
    const wochentage = WOCHENTAGE.map(t => ({ name: t, minuten: 0, runden: 0 }));
    const fenster = [
      { name: "vor 9", von: 0, bis: 9 }, { name: "9–12", von: 9, bis: 12 }, { name: "12–14", von: 12, bis: 14 },
      { name: "14–17", von: 14, bis: 17 }, { name: "17–20", von: 17, bis: 20 }, { name: "ab 20", von: 20, bis: 24 },
    ].map(f => ({ ...f, minuten: 0, runden: 0 }));
    const tage = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(jetzt - (13 - i) * TAG_MS);
      return { datum: d.toDateString(), name: String(d.getDate()), lang: d.toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "numeric" }), minuten: 0, runden: 0 };
    });
    for (const e of runden) {
      const d = new Date(e.zeit);
      const min = (e.dauer || 0) / 60;
      const w = wochentage[(d.getDay() + 6) % 7];
      w.minuten += min; w.runden++;
      const f = fenster.find(x => d.getHours() >= x.von && d.getHours() < x.bis);
      f.minuten += min; f.runden++;
      const t = tage.find(x => x.datum === d.toDateString());
      if (t) { t.minuten += min; t.runden++; }
    }
    return { wochentage, fenster, tage, uebungstage14: tage.filter(t => t.runden > 0).length };
  }

  // ---------- Wochen und Wochenziel ----------
  /** Montag 0:00 der Woche, in der `zeit` liegt (Ortszeit). */
  function wochenStart(zeit) {
    const d = new Date(zeit);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
  }
  const tageSpaeter = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  /**
   * Wochen seit der ersten Runde bis heute, älteste zuerst, mindestens eine: { wochen, aktuelle, serie, erfuellt }.
   * ziel: { tage, minuten } oder null. Ein Tag ist erfüllt, wenn die Runden des Tages zusammen die Minuten erreichen
   * (minuten 0 oder ohne Ziel: wenn geübt wurde); eine Woche, wenn genug Tage erfüllt sind (nur mit Ziel).
   * serie: erfüllte Wochen in Folge bis heute; die laufende Woche zählt, sobald sie erfüllt ist, und bricht die Serie
   * nicht, solange sie läuft. erfuellt: Zahl der erfüllten Wochen.
   * Je Woche { von, bis, tage: [{ name, datum, minuten, runden, heute, zukunft, erfuellt }], erfuellteTage, erfuellt, laufend }.
   */
  function wochen(runden, ziel = null, jetzt = Date.now()) {
    const plan = ziel && ziel.tage > 0 ? { tage: ziel.tage, minuten: ziel.minuten || 0 } : null;
    const start = wochenStart(jetzt);
    const erste = runden.length ? wochenStart(Math.min(...runden.map(e => Date.parse(e.zeit)))) : start;
    const liste = [];
    for (let von = erste; von <= start; von = tageSpaeter(von, 7)) {
      const bis = tageSpaeter(von, 7);
      const tage = WOCHENTAGE.map((name, i) => ({ name, datum: tageSpaeter(von, i), minuten: 0, runden: 0, heute: false, zukunft: false }));
      for (const t of tage) { t.heute = t.datum.toDateString() === new Date(jetzt).toDateString(); t.zukunft = t.datum > jetzt && !t.heute; }
      for (const e of runden) {
        const z = new Date(e.zeit);
        if (z < von || z >= bis) continue;
        const t = tage[(z.getDay() + 6) % 7];
        t.minuten += (e.dauer || 0) / 60;
        t.runden++;
      }
      for (const t of tage) t.erfuellt = plan && plan.minuten > 0 ? t.minuten >= plan.minuten : t.runden > 0;
      const erfuellteTage = tage.filter(t => t.erfuellt).length;
      liste.push({ von, bis, tage, erfuellteTage, erfuellt: !!plan && erfuellteTage >= plan.tage, laufend: von.getTime() === start.getTime() });
    }
    let serie = 0;
    for (let i = liste.length - 1; i >= 0; i--) {
      if (liste[i].erfuellt) serie++;
      else if (!liste[i].laufend) break;
    }
    return { plan, wochen: liste, aktuelle: liste[liste.length - 1], serie, erfuellt: liste.filter(w => w.erfuellt).length };
  }

  // ---------- Stand und Bedarf (AW2 a: eine Regel, Schwellen je App) ----------
  /**
   * Stand aus den letzten Aufgaben: aufgaben = [{ anhieb: Ja/Nein, gezeigt?: Ja/Nein }], älteste zuerst.
   * opt: { fenster (letzte n Aufgaben), mindestens (Aufgaben insgesamt für „sicher“), schwelle (Anteil auf Anhieb),
   * ohneGezeigt (im Fenster keine gezeigte Lösung für „sicher“, Standard ja) }.
   * Liefert { n, imFenster, anhieb, quote (null ohne Aufgaben), sicher }.
   */
  function stand(aufgaben, { fenster = 10, mindestens = 1, schwelle = 0.7, ohneGezeigt = true } = {}) {
    const liste = Array.isArray(aufgaben) ? aufgaben : [];
    const letzte = liste.slice(-fenster);
    const anhieb = letzte.filter(a => a && a.anhieb && !a.gezeigt).length;
    const quote = letzte.length ? anhieb / letzte.length : null;
    const sicher = liste.length >= mindestens && quote !== null && quote >= schwelle && (!ohneGezeigt || letzte.every(a => !a.gezeigt));
    return { n: liste.length, imFenster: letzte.length, anhieb, quote, sicher };
  }

  /**
   * Bedarf als Gewicht für Zufallswahlen (Eulenpfad LERN_Session10): noch nie geübt 2 (ausprobieren); unter der Schwelle
   * 1 + 4 · (1 − quote) (wackelt); sonst kürzlich geübt 0.5, über sieben Tage her 2 (verteiltes Üben).
   * quote: Anteil auf Anhieb (stand(…).quote) oder null; tageSeit: Tage seit dem letzten Üben.
   */
  function bedarf(quote, tageSeit, { schwelle = 0.7 } = {}) {
    if (quote === null || quote === undefined) return 2;
    return quote < schwelle ? 1 + 4 * (1 - quote) : tageSeit >= 7 ? 2 : 0.5;
  }

  /** Zufällig nach Gewicht ziehen: ohne n ein Element, mit n eine Liste ohne Zurücklegen (höchstens n). */
  function ziehe(kandidaten, gewicht, n, zufall = Math.random) {
    const rest = kandidaten.map(x => ({ x, g: Math.max(0, gewicht(x)) }));
    const aus = [];
    while (rest.length && aus.length < (n ?? 1)) {
      let r = zufall() * rest.reduce((a, e) => a + e.g, 0);
      let i = rest.findIndex(e => (r -= e.g) < 0);
      if (i < 0) i = rest.length - 1;
      aus.push(rest.splice(i, 1)[0].x);
    }
    return n === undefined ? aus[0] : aus;
  }

  KERN.auswertung = { TAG_MS, WOCHENTAGE, mittel, median, korrelation, sitzungen, lernzeiten, wochenStart, wochen, stand, bedarf, ziehe };
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
