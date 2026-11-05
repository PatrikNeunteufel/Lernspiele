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
