// Prüft Konten, Aufsicht und Sichern/Einlesen des Lernsteigs ohne Browser (Plan docs/plan_angleich_reihe.md B2, D4, D5):
// Umzug der alten Listen, Anlegen und Anmelden, Bestätigung einer weiteren Aufsicht, Verbinden nur mit Zustimmung,
// Einlesen mit kaputten und fremden Dateien (alles oder nichts), voller Speicher, Einladung.
// Aufruf: node docs/lernsteig/werkzeuge/pruefe_konten.js — Ende mit Code 1 bei einem Fehler (auch von pruefe_uebungen.js gerufen).
"use strict";
const path = require("path");
const WURZEL = path.join(__dirname, "..", "..", "..");
const APP = path.join(WURZEL, "lernsteig");

let fehler = 0, faelle = 0;
const gleich = (ist, soll, was) => { faelle++; if (JSON.stringify(ist) !== JSON.stringify(soll)) { fehler++; console.log(`    FEHLER  ${was}: ${JSON.stringify(ist)} statt ${JSON.stringify(soll)}`); } };
async function wirft(f, was, text) {
  faelle++;
  try { await f(); fehler++; console.log(`    FEHLER  ${was}: kein Fehler`); }
  catch (e) { if (text && !e.message.includes(text)) { fehler++; console.log(`    FEHLER  ${was}: ${e.message}`); } }
}

// Ersatz für localStorage und sessionStorage (mit „voll“ zum Prüfen von D4/D11)
function ablage() {
  const d = new Map(); const a = { voll: false, d,
    getItem: k => (d.has(k) ? d.get(k) : null), setItem: (k, v) => { if (a.voll) throw new Error("QuotaExceededError"); d.set(k, String(v)); },
    removeItem: k => d.delete(k), key: i => [...d.keys()][i] ?? null, get length() { return d.size; } };
  return a;
}
global.localStorage = ablage();
global.sessionStorage = ablage();

// Alte Listen (bis LERN_Session15) vor dem Laden: der Umzug muss sie übernehmen
const T = "2026-11-04T10:00:00.000Z";
localStorage.setItem("lernsteig:konten", JSON.stringify([{ id: "k-alt-1", name: "Alt", geboren: "2012-05-01", klasse: "8", lehrplan: { land: "CH", kanton: "SG" },
  niveau: {}, pruefungsziel: "keins", rechnerModell: "allgemein", erstellt: T, geaendert: T, aufsicht: ["a-alt-1"], pin: { salz: "s", hash: "h" }, wiederherstellung: { salz: "s2", hash: "h2" } }]));
localStorage.setItem("lernsteig:aufsichten", JSON.stringify([{ id: "a-alt-1", name: "Mutter", rolle: "eltern", pin: { salz: "s", hash: "h" }, wiederherstellung: { salz: "s", hash: "h" }, erstellt: T }]));

require(path.join(APP, "kern", "kern.js"));
global.LST = require(path.join(APP, "gemeinsam", "werkzeug.js"));
global.LST_LEHRPLAENE = require(path.join(APP, "gemeinsam", "lehrplaene.js"));
global.LST_KATALOG = require(path.join(APP, "gemeinsam", "katalog.js"));
const KO = global.LST_KONTEN = require(path.join(APP, "gemeinsam", "konten.js"));
const DA = require(path.join(APP, "gemeinsam", "daten.js"));

(async () => {
  console.log("Konten, Aufsicht, Sichern und Einlesen");
  // Umzug
  gleich(localStorage.getItem("lernsteig:konten"), null, "alte Liste konten entfernt");
  gleich(localStorage.getItem("lernsteig:aufsichten"), null, "alte Liste aufsichten entfernt");
  const alt = KO.finde("k-alt-1");
  gleich(alt && [alt.rolle, alt.angelegt, alt.klasse, alt.aufsicht, alt.pin.salz, alt.wiederherstellung.code.salz], ["lernend", T, "8", ["a-alt-1"], "s", "s2"], "Konto umgezogen mit Kennung, Verbindung und PIN");
  const mutter = KO.aufsichtFinde("a-alt-1");
  gleich(mutter && [mutter.rolle, mutter.art], ["aufsicht", "eltern"], "Aufsicht umgezogen, Art aus der alten Rolle");

  // frisch anfangen
  localStorage.d.clear(); sessionStorage.d.clear();
  const { konto: mia, code } = await KO.anlegen({ name: "Mia", geboren: "07.03.2012", klasse: 7, pin: "4711" });
  gleich([mia.rolle, mia.geboren, mia.klasse, /^[A-Z0-9]{4}-/.test(code)], ["lernend", "2012-03-07", "7", true], "Konto mit PIN und Code");
  await wirft(() => KO.anlegen({ name: " mia " }), "doppelter Name", "gibt es schon");
  gleich(KO.aktiv(), null, "mit PIN nicht angemeldet");
  await wirft(() => KO.anmelden(mia.id, "1111"), "falsche PIN", "stimmt nicht");
  await KO.anmelden(mia.id, "4711");
  gleich(KO.aktiv() && KO.aktiv().id, mia.id, "angemeldet im Tab");
  const neuerCode = await KO.neuePinMitCode(mia.id, code, "2222");
  gleich(await KO.pinStimmt(KO.finde(mia.id), "2222"), true, "neue PIN über den Code");
  await wirft(() => KO.neuePinMitCode(mia.id, code, "3333"), "alter Code gilt nicht mehr", "Code");
  gleich(typeof neuerCode, "string", "neuer Code ausgegeben");

  // Aufsicht: die erste ohne, jede weitere mit Bestätigung (D5)
  const { aufsicht: vater } = await KO.aufsichtAnlegen({ name: "Vater", art: "eltern", pin: "5555" });
  gleich(KO.aufsichtAktiv() && KO.aufsichtAktiv().id, vater.id, "erste Aufsicht angemeldet");
  await wirft(() => KO.aufsichtAnlegen({ name: "Fremd", art: "lehrperson", pin: "6666" }), "zweite Aufsicht ohne Bestätigung", "bestätigen");
  await wirft(() => KO.aufsichtAnlegen({ name: "Fremd", art: "lehrperson", pin: "6666", bestaetigung: { id: vater.id, pin: "0000" } }), "zweite Aufsicht mit falscher PIN", "bestätigen");
  const { aufsicht: lehrer } = await KO.aufsichtAnlegen({ name: "Lehrer", art: "lehrperson", pin: "6666", bestaetigung: { id: vater.id, pin: "5555" } });
  gleich(lehrer.art, "lehrperson", "zweite Aufsicht mit Bestätigung");
  await wirft(() => KO.aufsichtAnlegen({ name: "Mia", art: "eltern", pin: "7777", bestaetigung: { id: vater.id, pin: "5555" } }), "Aufsicht mit Namen eines Kontos", "gibt es schon");

  // Verbinden nur mit Zustimmung
  KO.anfragen(mia.id);
  gleich(KO.verbundene(lehrer.id).length, 0, "Anfrage verbindet noch nicht");
  await KO.anmelden(mia.id, "2222");
  KO.antworten(mia.id, lehrer.id, true);
  gleich(KO.verbundene(lehrer.id).map(k => k.id), [mia.id], "verbunden nach Zustimmung mit PIN");
  gleich(KO.mitleser(mia.id).verbunden.map(a => a.art), ["lehrperson"], "Jugendliche sieht, wer mitliest");

  // Sichern und Einlesen (D4, D5)
  LST.schreibe("runden", [{ id: "r1", person: mia.id, zeit: "2026-11-05T08:00:00.000Z", inhalt: "brueche", stufe: "g", aufgaben: 8, fehler: 1, dauer: 120, liste: [] }]);
  const sich = DA.sichern([mia.id]);
  gleich([sich.konten.length, "pin" in sich.konten[0], "aufsicht" in sich.konten[0], sich.runden.length], [1, false, false, 1], "Sicherung ohne PIN und Verbindungen");
  gleich([sich.version, sich.runden[0].person === mia.id, sich.runden[0].inhalt], [2, true, "brueche"], "Sicherung Version 2 im gemeinsamen Format (R1 a)");
  // gleiche Datei nochmals: nichts neu (Version 2 liest sich selbst)
  gleich(DA.einlesen(JSON.parse(JSON.stringify(sich))).runden, 0, "eigene Sicherung zweimal: nichts doppelt");
  const stand = () => JSON.stringify([localStorage.getItem("lernsteig:personen"), localStorage.getItem("lernsteig:runden"), localStorage.getItem("lernsteig:rekorde")]);
  await wirft(() => DA.einlesen({ format: "etwas", version: 1 }), "fremde Datei", "keine Sicherung");
  await wirft(() => DA.einlesen({ format: DA.FORMAT, version: 1, runden: "abc" }), "beschädigte Liste", "beschädigt");
  const vorher = stand();
  const kaputt = DA.einlesen({ format: DA.FORMAT, version: 1,
    konten: [{ id: 5, name: "" }, { id: "p-neu-x", name: "Neu", rolle: "aufsicht" }],
    runden: [{ id: "r-k", konto: mia.id, zeit: 5, liste: "abc" }, { id: "r-f", konto: "p-gibts-nicht", zeit: "2026-11-05T09:00:00.000Z", uebung: "brueche", stufe: "g" }],
    rekorde: [{ id: "x", konto: mia.id, zeit: "2026-11-05T09:00:00.000Z", uebung: "nichts", stufe: "g", punkte: 3 }] });
  gleich([kaputt.konten, kaputt.runden, kaputt.rekorde, kaputt.abgewiesen], [0, 0, 0, 5], "kaputte Einträge abgewiesen, nichts übernommen");
  gleich(stand(), vorher, "kaputte Datei ändert den Speicher nicht");
  // danach geht ein gutes Einlesen weiter (früher vergiftete eine kaputte Runde jedes weitere Einlesen)
  const gut = DA.einlesen({ format: DA.FORMAT, version: 1, konten: [{ id: "k-ben", name: "Ben", geboren: "2011-02", klasse: "9", erstellt: T, geaendert: T }],
    runden: [{ id: "r2", konto: "k-ben", zeit: "2026-11-05T10:00:00.000Z", uebung: "terme", stufe: "j", aufgaben: 8, dauer: 90, liste: [] }] });
  gleich([gut.konten, gut.runden, gut.neu], [1, 1, ["k-ben"]], "ältere Sicherung umgedeutet und eingelesen");
  gleich(KO.finde("k-ben").geboren, "2011-02", "Geburtsdatum ohne Tag bleibt (B3)");
  const gast = DA.einlesen({ format: DA.FORMAT, version: 1, runden: [{ id: "r-gast", konto: "gast", zeit: "2026-11-05T11:00:00.000Z", uebung: "zufall", stufe: "f", aufgaben: 8, dauer: 60, liste: [] }] });
  gleich(LST.lies("runden", []).find(r => r.id === "r-gast")?.inhalt, "zufall", "Version 1 umgedeutet: uebung → inhalt");
  gleich(gast.runden, 1, "Runden des Gastkontos werden eingelesen");
  // D5: eine Datei mit der Kennung eines Kontos, das schon auf dem Gerät ist, verbindet nicht
  KO.aufsichtAbmelden(); await KO.aufsichtAnmelden(vater.id, "5555");
  const fremd = DA.einlesen({ format: DA.FORMAT, version: 1, konten: [{ ...sich.konten[0] }] });
  KO.verbindeEingelesene(fremd.neu);
  gleich(KO.verbundene(vater.id).map(k => k.id), [], "bestehendes Konto aus einer Datei wird nicht verbunden");
  const neuKonto = DA.einlesen({ format: DA.FORMAT, version: 1, konten: [{ id: "k-ida", name: "Ida", geaendert: T, erstellt: T }] });
  KO.verbindeEingelesene(neuKonto.neu);
  gleich(KO.verbundene(vater.id).map(k => k.id), ["k-ida"], "neues Konto aus der Datei wird verbunden (AF2 a)");
  // voller Speicher: alles oder nichts
  const vorVoll = stand();
  localStorage.voll = true;
  await wirft(() => DA.einlesen({ format: DA.FORMAT, version: 1, konten: [{ id: "k-zoe", name: "Zoe", erstellt: T, geaendert: T }] }), "voller Speicher", "voll");
  localStorage.voll = false;
  gleich(stand(), vorVoll, "voller Speicher: nichts eingelesen");

  // Einladung (EL1 a, D12, B3)
  const e = KO.einladungErstellen({ name: "Lea", geboren: "2013-06", klasse: 7, niveau: { mathematik: "n2" }, lehrplan: { land: "CH", kanton: "SG" } });
  gleich(KO.einladungLesen(e), { name: "Lea", geboren: "2013-06", klasse: "7", niveau: { mathematik: "n2" }, lehrplan: { land: "CH", kanton: "SG" } }, "Einladung mit Geburtsmonat aus dem Eulenpfad");
  const schlecht = KO.einladungErstellen({ name: "X", lehrplan: { land: "CH", kanton: { boese: 1 } }, klasse: 12 });
  gleich(KO.einladungLesen(schlecht), { name: "X", lehrplan: { land: "CH", kanton: null } }, "ungültiger Kanton und Klasse verworfen");

  console.log(`  ${faelle} Fälle, ${fehler} Fehler.`);
  process.exit(fehler ? 1 : 0);
})().catch(e => { console.log(`    FEHLER  ${e.stack}`); process.exit(1); });
