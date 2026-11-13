// Ladeprüfung der Prüfansicht eines Spiels (pruefung.js, LP5 a, LERN-51; rahmen.md 17), wie tools/listen_fingerabdruck.js:
// lädt die Spielseite als Aufsicht im vm-Kontext, dann listenpruefung.js und pruefung.js, und prüft je Liste und
// Abschnitt jede Zeile: Zahl der Zellen = Zahl der Spalten, keine Zelle undefined/null/leer, gruppe() und bild() werfen
// nicht, jede eigene Liste des Katalogs hat eine Definition (und umgekehrt); gibt Einträge und Fingerabdruck je Liste aus.
// Entstanden in LERN_Session37 für die Agenten der Blöcke (docs/eulenpfad/auftrag_pruefansicht.md).
// Aufruf: node tools/pruefe_pruefansicht.js <spiel-id> [<spiel-id> …]
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { skripte } = require("./listen_fingerabdruck.js");

const WURZEL = path.join(__dirname, "..");
const SPIELE = path.join(WURZEL, "eulenpfad", "spiele");

/** Prüft die Prüfansicht eines Spiels; gibt { fehler: [Text], zahlen: [Text] } zurück. */
function pruefeSpiel(spiel) {
  const seite = path.join(SPIELE, spiel, "index.html");
  if (!fs.existsSync(path.join(SPIELE, spiel, "pruefung.js"))) return { fehler: [`${spiel}: keine pruefung.js`], zahlen: [] };
  const html = fs.readFileSync(seite, "utf8");
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1].replace(/<script[\s\S]*?<\/script>/g, "");
  const k = vm.createContext({ __seite: { html: body, search: "?stufe=s1", seed: 1 }, console, URL, URLSearchParams, structuredClone });
  const lauf = (code, name) => vm.runInContext(code, k, { filename: name, timeout: 5000 });
  lauf(fs.readFileSync(path.join(__dirname, "pruef_dom.js"), "utf8"), "pruef_dom.js");
  lauf(`localStorage.setItem("lernspiele:profile", JSON.stringify({ Testlauf: { rolle: "aufsicht" } }));
    localStorage.setItem("lernspiele:spieler", JSON.stringify("Testlauf")); sessionStorage.setItem("lernspiele:aufsicht", "Testlauf");`, "vorbereitung");
  for (const s of skripte(seite, html)) lauf(s.code, s.name);
  lauf(fs.readFileSync(path.join(SPIELE, "gemeinsam", "listenpruefung.js"), "utf8"), "listenpruefung.js");
  lauf(fs.readFileSync(path.join(SPIELE, spiel, "pruefung.js"), "utf8"), "pruefung.js");
  return lauf(`(() => {
    const spiel = ${JSON.stringify(spiel)};
    const defs = LS.pruefungDefinition(spiel) || {};
    const fehler = [], zahlen = [];
    const eigene = LS.spielListen(spiel).filter(l => !l.von).map(l => l.id);
    for (const liste of eigene) if (!defs[liste]) fehler.push(spiel + ": Liste ohne Definition: " + liste);
    for (const [liste, def] of Object.entries(defs)) {
      if (!eigene.includes(liste)) fehler.push(spiel + ": Definition ohne Liste im Katalog: " + liste);
      if (!def.beschreibung) fehler.push(spiel + "/" + liste + ": ohne beschreibung");
      for (const a of def.abschnitte) {
        const wo = spiel + "/" + liste + "/" + a.id;
        const e = a.eintraege();
        if (!e.length) fehler.push(wo + ": keine Einträge");
        const gruppen = new Set();
        e.forEach((x, i) => {
          let z;
          try { z = a.zeile(x); } catch (f) { fehler.push(wo + " Zeile " + i + ": zeile() wirft " + f.message); return; }
          if (!Array.isArray(z) || z.length !== a.spalten.length) fehler.push(wo + " Zeile " + i + ": " + (z && z.length) + " Zellen, " + a.spalten.length + " Spalten");
          else z.forEach((c, j) => {
            if (c === undefined || c === null || (typeof c === "string" && !c.trim() && c !== "")) fehler.push(wo + " Zeile " + i + " Spalte " + a.spalten[j] + ": " + c);
            if (typeof c === "string" && /undefined|NaN|\\[object/.test(c)) fehler.push(wo + " Zeile " + i + " Spalte " + a.spalten[j] + ": " + c);
            // Jede Zeichnung „svg:<name>“ in der Zelle so, wie die Prüfansicht sie zerlegt, und in der Bildersammlung
            if (typeof c === "string") String(c).split(LS.ZEICHNUNG_IM_TEXT).filter((t, n) => n % 2).forEach(t => {
              if (typeof BILDER === "undefined" || !BILDER[t.slice(4)]) fehler.push(wo + " Zeile " + i + " Spalte " + a.spalten[j] + ": Zeichnung " + t + " fehlt");
            });
            if (typeof c === "string" && String(c).split(LS.ZEICHNUNG_IM_TEXT).some((t, n) => !(n % 2) && /svg:/.test(t))) fehler.push(wo + " Zeile " + i + " Spalte " + a.spalten[j] + ": svg-Name nicht erkannt: " + c);
          });
          if (a.gruppe) { try { gruppen.add(a.gruppe(x)); } catch (f) { fehler.push(wo + " Zeile " + i + ": gruppe() wirft " + f.message); } }
          if (a.bild) { try { a.bild(x); } catch (f) { fehler.push(wo + " Zeile " + i + ": bild() wirft " + f.message); } }
        });
        zahlen.push(wo + ": " + e.length + " Einträge, " + a.spalten.length + " Spalten" + (a.gruppe ? ", " + gruppen.size + " Gruppen" : ""));
      }
      zahlen.push(spiel + "/" + liste + " Fingerabdruck " + LISTENPRUEFUNG.listenHash(LISTENPRUEFUNG.eintraegeVon(def)));
    }
    return { fehler, zahlen };
  })()`, "pruefung");
}

if (require.main === module) {
  const spiele = process.argv.slice(2);
  if (!spiele.length) { console.log("Aufruf: node tools/pruefe_pruefansicht.js <spiel-id> [<spiel-id> …]"); process.exit(2); }
  const fehler = [];
  for (const s of spiele) {
    let e;
    try { e = pruefeSpiel(s); } catch (f) { e = { fehler: [`${s}: lädt nicht — ${f.message}`], zahlen: [] }; }
    console.log(e.zahlen.join("\n"));
    fehler.push(...e.fehler);
  }
  for (const f of fehler) console.log(`    FEHLER  ${f}`);
  const schluss = fehler.length ? `${fehler.length} Fehler.` : "Keine Fehler.";
  console.log(schluss);
  require("./testausgabe.js").merke("pruefe_pruefansicht", schluss); // HK1 a
  process.exitCode = fehler.length ? 1 : 0;
}

module.exports = { pruefeSpiel };
