// Prüft Konten, Aufsicht und Sichern/Einlesen des Lernsteigs ohne Browser (Plan docs/plan_angleich_reihe.md B2, D4, D5):
// Umzug der alten Listen, Anlegen und Anmelden, Bestätigung einer weiteren Aufsicht, Verbinden nur mit Zustimmung,
// Einlesen mit kaputten und fremden Dateien (alles oder nichts), voller Speicher, Einladung.
// Aufruf: node docs/lernsteig/werkzeuge/pruefe_konten.js — Ende mit Code 1 bei einem Fehler (auch von pruefe_uebungen.js gerufen).
"use strict";
const path = require("path");
const WURZEL = path.join(__dirname, "..");
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

const SF = { frage: "Erstes Haustier?", antwort: "Bello" }; // Sicherheitsfrage der Aufsichten (RL2 a)
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

  // Aufsicht: die erste ohne, jede weitere mit Bestätigung (D5); Sicherheitsfrage Pflicht (RL2 a)
  await wirft(() => KO.aufsichtAnlegen({ name: "Ohne", art: "eltern", pin: "5555" }), "Aufsicht ohne Sicherheitsfrage", "Sicherheitsfrage");
  const { aufsicht: vater, code: vaterCode } = await KO.aufsichtAnlegen({ ...SF,name: "Vater", art: "eltern", pin: "5555" });
  gleich(KO.aufsichtAktiv() && KO.aufsichtAktiv().id, vater.id, "erste Aufsicht angemeldet");
  await wirft(() => KO.aufsichtAnlegen({ ...SF,name: "Fremd", art: "lehrperson", pin: "6666" }), "zweite Aufsicht ohne Bestätigung", "bestätigen");
  await wirft(() => KO.aufsichtAnlegen({ ...SF,name: "Fremd", art: "lehrperson", pin: "6666", bestaetigung: { id: vater.id, pin: "0000" } }), "zweite Aufsicht mit falscher PIN", "bestätigen");
  const { aufsicht: lehrer } = await KO.aufsichtAnlegen({ ...SF,name: "Lehrer", art: "lehrperson", pin: "6666", bestaetigung: { id: vater.id, pin: "5555" } });
  gleich(lehrer.art, "lehrperson", "zweite Aufsicht mit Bestätigung");
  await wirft(() => KO.aufsichtAnlegen({ ...SF,name: "Mia", art: "eltern", pin: "7777", bestaetigung: { id: vater.id, pin: "5555" } }), "Aufsicht mit Namen eines Kontos", "gibt es schon");

  // Ein Platz (Plan C1): die Aufsicht und ein Jugendlicher schliessen sich aus
  gleich([KO.angemeldet()?.id, KO.aktiv()], [lehrer.id, null], "angelegte Aufsicht ist angemeldet, kein Jugendlicher");
  gleich(sessionStorage.getItem("lernsteig:angemeldet"), lehrer.id, "Aufsicht im Tab (lernsteig:angemeldet)");
  await KO.anmelden(mia.id, "2222");
  gleich([KO.aktiv()?.id, KO.aufsichtAktiv()], [mia.id, null], "Jugendlicher meldet die Aufsicht ab");
  await KO.aufsichtAnmelden(lehrer.id, "6666");
  gleich([KO.aufsichtAktiv()?.id, KO.aktiv()], [lehrer.id, null], "Aufsicht meldet den Jugendlichen ab");
  await wirft(() => KO.anmelden(lehrer.id, "6666"), "Aufsicht nicht als Jugendlicher", "nicht gefunden");
  await wirft(() => KO.aufsichtAnmelden(mia.id, "2222"), "Jugendlicher nicht als Aufsicht", "nicht gefunden");
  // Gast (C2 a): nur im Tab, nichts gespeichert, je Gerät abschaltbar
  gleich([KO.gastErlaubt(), KO.alsGast(), KO.istGast(), KO.angemeldet()], [true, true, true, null], "als Gast: niemand angemeldet");
  gleich(localStorage.getItem("lernsteig:aktiv"), "null", "Gast: keine Person gemerkt");
  await KO.aufsichtAnmelden(lehrer.id, "6666");
  gleich(KO.istGast(), false, "Anmelden beendet den Gast");
  KO.setzeGeraeteEinstellung("gast", "aus");
  KO.abmelden();
  gleich([KO.gastErlaubt(), KO.alsGast(), KO.istGast()], [false, false, false], "Gast abgeschaltet");
  await KO.aufsichtAnmelden(lehrer.id, "6666");
  KO.setzeGeraeteEinstellung("gast", "an");
  KO.abmelden();
  await wirft(() => KO.setzeGeraeteEinstellung("gast", "aus"), "Einstellung nur mit Aufsicht", "Aufsicht");
  await KO.aufsichtAnmelden(lehrer.id, "6666");

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
  gleich([sich.personen.length, "pin" in sich.personen[0], "aufsicht" in sich.personen[0], sich.runden.length], [1, false, false, 1], "Sicherung ohne PIN und Verbindungen");
  gleich([sich.format, sich.version, sich.app, sich.runden[0].person === mia.id, sich.runden[0].inhalt], ["reihe-daten", 1, "lernsteig", true, "brueche"], "Sicherung im Format der Reihe (DF1 a, R1 a)");
  gleich([sich.personen[0].geschuetzt, Object.keys(sich.personen[0].wiederherstellung || {})], [true, ["code"]], "Konto mit PIN reist geschützt, nur mit dem Prüfwert des Codes (DF4 a)");
  // gleiche Datei nochmals: nichts neu (Version 2 liest sich selbst)
  gleich(DA.einlesen(JSON.parse(JSON.stringify(sich))).runden, 0, "eigene Sicherung zweimal: nichts doppelt");
  const stand = () => JSON.stringify([localStorage.getItem("lernsteig:personen"), localStorage.getItem("lernsteig:runden"), localStorage.getItem("lernsteig:rekorde")]);
  await wirft(() => DA.einlesen({ format: "etwas", version: 1 }), "fremde Datei", "keine Sicherung");
  await wirft(() => DA.einlesen({ format: "lernsteig-sicherung", version: 1, runden: "abc" }), "beschädigte Liste", "beschädigt");
  await wirft(() => DA.einlesen({ format: "reihe-daten", version: 1, app: "lernsteig", runden: "abc" }), "beschädigte Liste (heutiges Format)", "beschädigt");
  await wirft(() => DA.einlesen({ format: "reihe-daten", version: 1, app: "eulenpfad", personen: [], runden: [], rekorde: [] }), "Datei des Eulenpfads", "des Eulenpfads");
  const vorher = stand();
  const kaputt = DA.einlesen({ format: "lernsteig-sicherung", version: 1,
    // bis LERN_Session19 stand hier eine gültige Aufsicht, die nur AS1 a abwies; nach OA2 a kommt eine solche mit (unten)
    konten: [{ id: 5, name: "" }, { id: "p-neu-x", name: "Neu", rolle: "chef" }],
    runden: [{ id: "r-k", konto: mia.id, zeit: 5, liste: "abc" }, { id: "r-f", konto: "p-gibts-nicht", zeit: "2026-11-05T09:00:00.000Z", uebung: "brueche", stufe: "g" }],
    rekorde: [{ id: "x", konto: mia.id, zeit: "2026-11-05T09:00:00.000Z", uebung: "nichts", stufe: "g", punkte: 3 }] });
  gleich([kaputt.konten, kaputt.runden, kaputt.rekorde, kaputt.abgewiesen], [0, 0, 0, 5], "kaputte Einträge abgewiesen, nichts übernommen");
  gleich(stand(), vorher, "kaputte Datei ändert den Speicher nicht");
  // danach geht ein gutes Einlesen weiter (früher vergiftete eine kaputte Runde jedes weitere Einlesen)
  const gut = DA.einlesen({ format: "lernsteig-sicherung", version: 1, konten: [{ id: "k-ben", name: "Ben", geboren: "2011-02", klasse: "9", erstellt: T, geaendert: T }],
    runden: [{ id: "r2", konto: "k-ben", zeit: "2026-11-05T10:00:00.000Z", uebung: "terme", stufe: "j", aufgaben: 8, dauer: 90, liste: [] }] });
  gleich([gut.konten, gut.runden, gut.neu], [1, 1, ["k-ben"]], "ältere Sicherung umgedeutet und eingelesen");
  gleich(KO.finde("k-ben").geboren, "2011-02", "Geburtsdatum ohne Tag bleibt (B3)");
  const gast = DA.einlesen({ format: "lernsteig-sicherung", version: 1, runden: [{ id: "r-gast", konto: "gast", zeit: "2026-11-05T11:00:00.000Z", uebung: "zufall", stufe: "f", aufgaben: 8, dauer: 60, liste: [] }] });
  gleich(LST.lies("runden", []).find(r => r.id === "r-gast")?.inhalt, "zufall", "Version 1 umgedeutet: uebung → inhalt");
  gleich(gast.runden, 1, "Runden des Gastkontos werden eingelesen");
  // D5: eine Datei mit der Kennung eines Kontos, das schon auf dem Gerät ist, verbindet nicht
  KO.aufsichtAbmelden(); await KO.aufsichtAnmelden(vater.id, "5555");
  const fremd = DA.einlesen({ format: "lernsteig-sicherung", version: 1, konten: [{ ...sich.personen[0] }] });
  KO.verbindeEingelesene(fremd.neu);
  gleich(KO.verbundene(vater.id).map(k => k.id), [], "bestehendes Konto aus einer Datei wird nicht verbunden");
  const neuKonto = DA.einlesen({ format: "lernsteig-sicherung", version: 1, konten: [{ id: "k-ida", name: "Ida", geaendert: T, erstellt: T }] });
  KO.verbindeEingelesene(neuKonto.neu);
  gleich(KO.verbundene(vater.id).map(k => k.id), ["k-ida"], "neues Konto aus der Datei wird verbunden (AF2 a)");
  // voller Speicher: alles oder nichts
  const vorVoll = stand();
  localStorage.voll = true;
  await wirft(() => DA.einlesen({ format: "lernsteig-sicherung", version: 1, konten: [{ id: "k-zoe", name: "Zoe", erstellt: T, geaendert: T }] }), "voller Speicher", "voll");
  localStorage.voll = false;
  gleich(stand(), vorVoll, "voller Speicher: nichts eingelesen");

  // Einladung (EL1 a, D12, B3)
  const e = KO.einladungErstellen({ name: "Lea", geboren: "2013-06", klasse: 7, niveau: { mathematik: "n2" }, lehrplan: { land: "CH", kanton: "SG" } });
  gleich(KO.einladungLesen(e), { name: "Lea", geboren: "2013-06", klasse: "7", niveau: { mathematik: "n2" }, lehrplan: { land: "CH", kanton: "SG" } }, "Einladung mit Geburtsmonat aus dem Eulenpfad");
  const schlecht = KO.einladungErstellen({ name: "X", lehrplan: { land: "CH", kanton: { boese: 1 } }, klasse: 12 });
  gleich(KO.einladungLesen(schlecht), { name: "X", lehrplan: { land: "CH", kanton: null } }, "ungültiger Kanton und Klasse verworfen");

  // Gesperrte Personen auf einem anderen Gerät (DF4 a) und Aufsichten in einer Datei (OA1 a, OA2 a; bis LERN_Session19 AS1 a)
  {
    await KO.aufsichtAnmelden(vater.id, "5555");
    const miaCode = await KO.setzePin(mia.id, "2222"); // neuer Code, den der Test kennt
    const vonHier = DA.sichern([mia.id]);
    const mitAufsicht = { ...vonHier, personen: [...vonHier.personen, KERN.person.fuerDatei(KO.aufsichtFinde(vater.id), KO.GERAET)] };
    // „anderes Gerät“: leerer Speicher; ein Jugendlicher liest ein — die Aufsicht kommt mit, gesperrt (OA2 a)
    localStorage.d.clear(); sessionStorage.d.clear();
    const e1 = DA.einlesen(mitAufsicht);
    gleich([e1.konten, e1.abgewiesen, KO.aufsichten().length, KO.gesperrt(vater.id)], [2, 0, 1, true], "ohne angemeldete Aufsicht: Aufsicht der Datei gesperrt übernommen (OA2 a)");
    // Gerät ohne Aufsicht mit PIN: ihr Code reicht (OA1 a) — wie die erste Aufsicht ohne Bestätigung angelegt wird (D5)
    gleich(KO.codeReicht(vater.id), true, "Gerät ohne Aufsicht mit PIN: Code reicht");
    gleich(KO.gesperrt(mia.id), true, "Konto mit PIN auf dem anderen Gerät gesperrt");
    await wirft(() => KO.anmelden(mia.id, "2222"), "gesperrt: keine Anmeldung mit der alten PIN", "PIN");
    await wirft(() => KO.freischalten(mia.id, "1357", { code: "AAAA-AAAA-AAAA" }), "falscher Code", "Code stimmt nicht");
    await KO.freischalten(mia.id, "1357", { code: miaCode });
    gleich([KO.gesperrt(mia.id), KO.aktiv()?.id, await KO.codeStimmt(KO.finde(mia.id), miaCode)], [false, mia.id, true], "mit dem Code freigeschaltet und angemeldet, Code bleibt");
    await KO.setzePin(mia.id, null);
    gleich(KO.gesperrt(mia.id), false, "PIN später entfernt: nicht wieder gesperrt");
    // mit angemeldeter Aufsicht kommt die Aufsicht der Datei mit, gesperrt; freischalten mit Bestätigung einer anderen
    localStorage.d.clear(); sessionStorage.d.clear();
    const { aufsicht: hier } = await KO.aufsichtAnlegen({ ...SF,name: "Hier", art: "eltern", pin: "8888" });
    const e2 = DA.einlesen(mitAufsicht);
    gleich([e2.abgewiesen, KO.gesperrt(vater.id)], [0, true], "mit angemeldeter Aufsicht: Aufsicht der Datei gesperrt übernommen");
    await wirft(() => KO.aufsichtAnmelden(vater.id, "5555"), "gesperrte Aufsicht: keine Anmeldung", "PIN");
    // OA1 a: Hier gibt es schon eine Aufsicht mit PIN — der (richtige) Code der Aufsicht aus der Datei reicht nicht
    gleich(KO.codeReicht(vater.id), false, "Gerät mit Aufsicht mit PIN: Code reicht nicht");
    await wirft(() => KO.freischalten(vater.id, "4321", { code: vaterCode }), "Aufsicht nur mit Code auf einem Gerät mit Aufsicht", "bestätigen");
    gleich(KO.gesperrt(vater.id), true, "nach dem abgewiesenen Code weiter gesperrt");
    // Gegenstück: der Code eines Jugendlichen reicht auch auf einem Gerät mit Aufsicht
    gleich(KO.codeReicht(mia.id), true, "Jugendlicher: Code reicht immer");
    await wirft(() => KO.freischalten(vater.id, "4321", { bestaetigung: { id: hier.id, pin: "0000" } }), "Bestätigung mit falscher PIN", "bestätigen");
    await KO.freischalten(vater.id, "4321", { bestaetigung: { id: hier.id, pin: "8888" } });
    gleich([KO.gesperrt(vater.id), KO.aufsichtAktiv()?.id], [false, vater.id], "Aufsicht mit Bestätigung freigeschaltet und angemeldet");
    await wirft(() => KO.freischalten(mia.id, "1111", { bestaetigung: { id: vater.id, pin: "4321" } }), "Jugendlicher nicht über Bestätigung", "bestätigen");
  }

  // Abgleich über einen Ordner (Plan C5, gemeinsam/abgleich.js über KERN.abgleich; OA1 a, OA2 a): die Datei eines Geräts
  // auf einem anderen einlesen, während dort niemand als Aufsicht angemeldet ist
  {
    global.LST_DATEN = DA;
    const AB = require(path.join(APP, "gemeinsam", "abgleich.js"));
    localStorage.d.clear(); sessionStorage.d.clear();
    const { aufsicht: mama } = await KO.aufsichtAnlegen({ ...SF, name: "Mama", art: "eltern", pin: "4444" });
    const { konto: ben } = await KO.anlegen({ name: "Ben", geboren: "2011-02-03", klasse: "9" });
    LST.schreibe("runden", [{ id: "r-ab-1", person: ben.id, zeit: "2026-11-07T08:00:00.000Z", inhalt: "brueche", stufe: "g", aufgaben: 8, fehler: 0, gezeigt: 0, dauer: 60, liste: [] }]);
    AB.benenne("Laptop");
    // Freigabe je Gerät (Plan C5): reist im Abgleich mit, die jüngste gewinnt (wie im Eulenpfad; KERN.freigabe)
    const FG = KERN.freigabe({ art: "uebungen", eintrag: id => LST_KATALOG.uebung(id), speicher: { lies: LST.lies, schreibe: LST.schreibe }, pruefstand: () => ({}) });
    FG.setzeFrei("terme", true);
    const text = AB.dateiInhalt();
    const kopf = JSON.parse(text);
    gleich([kopf.format, kopf.art, kopf.geraet.name, kopf.personen.length, kopf.runden.length], ["reihe-daten", "abgleich", "Laptop", 2, 1], "eigene Abgleich-Datei: Format, Art, Gerät, Konten, Runden");
    gleich(kopf.personen.some(p => "pin" in p || "aufsicht" in p), false, "Abgleich-Datei ohne PIN und Verbindungen");
    // anderes Gerät mit einer eigenen Aufsicht; angemeldet ist niemand
    localStorage.d.clear(); sessionStorage.d.clear();
    const { aufsicht: papa } = await KO.aufsichtAnlegen({ ...SF, name: "Papa", art: "eltern", pin: "5656" });
    KO.aufsichtAbmelden();
    gleich([kopf.freigabe, typeof kopf.freigabeStand], [{ uebungen: { terme: true }, listen: {} }, "string"], "Abgleich-Datei mit der Freigabe des Geräts");
    LST.schreibe("freigabeStand", "2000-01-01T00:00:00.000Z"); LST.schreibe("freigabe", { uebungen: { brueche: false }, listen: {} });
    const r = AB.datenEinlesen(text);
    gleich([r.konten, r.runden, r.abgewiesen], [2, 1, 0], "Abgleich ohne angemeldete Aufsicht: Konten und Runde dazu, nichts abgewiesen");
    gleich([r.freigabe, FG.frei("terme"), "brueche" in FG.geraet().uebungen], [true, true, false], "jüngere Freigabe des anderen Geräts übernommen, ganz");
    gleich(AB.datenEinlesen(text).freigabe, false, "dieselbe Freigabe ein zweites Mal: nichts Neues");
    FG.setzeFrei("terme", false);
    gleich([AB.datenEinlesen(text).freigabe, FG.frei("terme")], [false, false], "ältere Freigabe ersetzt die jüngere des Geräts nicht");
    gleich(AB.ergebnisText({ freigabe: true }), "Dazugekommen: die Freigabe.", "Ergebnis nennt die Freigabe");
    gleich([KO.gesperrt(mama.id), KO.codeReicht(mama.id), KO.verbundene(papa.id).length], [true, false, 0], "Mama gesperrt, Code reicht nicht (Papa ist Aufsicht), Ben mit niemandem verbunden");
    await KO.freischalten(mama.id, "4545", { bestaetigung: { id: papa.id, pin: "5656" } });
    gleich(KO.gesperrt(mama.id), false, "Mama mit Papas Bestätigung freigeschaltet");
    gleich(AB.ergebnisText({ konten: 1, runden: 2, abgewiesen: 1 }), "Dazugekommen: 1 neues oder geändertes Konto, 2 neue Runden. 1 ungültiger Eintrag nicht übernommen.", "Ergebnis in einem Satz");
  }

  // PIN vergessen der Aufsicht (RL2 a): Bestätigung, Code, Sicherheitsfrage; Zurücksetzen mit Frist
  {
    localStorage.d.clear(); sessionStorage.d.clear();
    const { aufsicht: a1, code: c1 } = await KO.aufsichtAnlegen({ ...SF, name: "Erste", art: "eltern", pin: "1111" });
    const { aufsicht: a2 } = await KO.aufsichtAnlegen({ ...SF, name: "Zweite", art: "lehrperson", pin: "2222", bestaetigung: { id: a1.id, pin: "1111" } });
    const k = (await KO.anlegen({ name: "Lu", klasse: 7 })).konto;
    KO.LISTE.aendere(k.id, { aufsicht: [a1.id], anfragen: [a2.id] }); // verbunden und angefragt
    KO.abmelden();
    await wirft(() => KO.aufsichtPinVergessen(a1.id, "3333", { bestaetigung: { id: a1.id, pin: "1111" } }), "sich selbst bestätigen", "bestätigen");
    const n1 = await KO.aufsichtPinVergessen(a1.id, "3333", { bestaetigung: { id: a2.id, pin: "2222" } });
    gleich([KO.aufsichtAktiv()?.id, typeof n1], [a1.id, "string"], "Stufe 1: andere Aufsicht, angemeldet, neuer Code");
    await wirft(() => KO.aufsichtPinVergessen(a1.id, "4444", { code: c1 }), "alter Code gilt nicht mehr", "Code stimmt nicht");
    await KO.aufsichtPinVergessen(a1.id, "4444", { code: n1 });
    await wirft(() => KO.aufsichtPinVergessen(a1.id, "5555", { antwort: "Mimi" }), "falsche Antwort", "Antwort stimmt nicht");
    await KO.aufsichtPinVergessen(a1.id, "5555", { antwort: "bello" });
    gleich(await KO.pinStimmt(KO.aufsichtFinde(a1.id), "5555"), true, "Stufen 2 und 3: Code, Sicherheitsfrage");
    // Frist: anfordern, mit falscher Eingabe nicht abbrechbar, mit PIN schon; danach ablaufen lassen
    KO.abmelden();
    const s = KO.fristAnfordern();
    gleich([await KO.fristAbbrechenMit("0000"), !!KO.fristStand()], [false, true], "Frist: falsche Eingabe bricht nicht ab");
    gleich([await KO.fristAbbrechenMit("2222"), KO.fristStand()], [true, null], "Frist: PIN einer Aufsicht bricht ab");
    KO.fristAnfordern();
    localStorage.setItem("lernsteig:zuruecksetzen", JSON.stringify({ ...s, ab: "2000-01-01T00:00:00.000Z" })); // abgelaufen
    gleich([KO.fristFaellig(), KO.aufsichten().length, "aufsicht" in KO.finde(k.id), "anfragen" in KO.finde(k.id), KO.fristStand()], [true, 0, false, false, null], "Frist abgelaufen: Aufsichten entfernt samt Verbindungen und Anfragen");
    const { aufsicht: neu } = await KO.aufsichtAnlegen({ ...SF, name: "Neu", art: "eltern", pin: "6666" });
    gleich(KO.aufsichtAktiv()?.id, neu.id, "danach neue Aufsicht ohne Bestätigung");
  }

  console.log(`  ${faelle} Fälle, ${fehler} Fehler.`);
  process.exit(fehler ? 1 : 0);
})().catch(e => { console.log(`    FEHLER  ${e.stack}`); process.exit(1); });
