// Erzeugt die Checkliste aller Spiele: Klasse → Fach → Thema → Spiel, gebaut oder nur Idee, und was
// je Spiel noch zu prüfen ist. Nichts davon wird von Hand gepflegt — die Quellen sind:
//   spiele/gemeinsam/katalog.js            gebaute Spiele, Basisklasse, Thema, Prüfstand (geprueft, listen)
//   docs/spielideen/lehrplan_sg_spielideen.md   Spielideen mit Klassenbereich und Lehrplan-Codes
//   docs/lernziele/*.md                    Annahmen, die mit dem Lehrmittel abzugleichen sind
// Abgehakt wird in den Quellen (z. B. geprueft im Katalog), danach die Liste neu erzeugen:
//   node tools/checkliste.js > docs/checkliste.md
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WURZEL = path.join(__dirname, "..");
const lies = p => fs.readFileSync(path.join(WURZEL, p), "utf8");

const katalog = vm.createContext({ LS: { SKALA: [] } });
vm.runInContext(lies("spiele/gemeinsam/katalog.js") + ";this.SPIELE = SPIELE; this.THEMEN = THEMEN;", katalog);
const { SPIELE, THEMEN } = katalog;

const norm = s => s.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "");

// Ideen, die unter anderem Namen gebaut sind: Name der Idee → Spiel-Id.
// „ersetzt“: die Idee wird nicht gebaut, weil ein anderes Spiel sie abdeckt (Begründung im Text).
const GEBAUT_ALS = {
  "Zahlenmauer-Baumeister": "zahlenmauer", "Malkreuz-Spiel": "malkreuz", "Koordinaten-Schatzsuche": "koordinaten-schatz",
  "Rechengeschichten-Match": "rechengeschichten", "ABC-Sortierer / Wörterbuch-Sprint": "abc-sortierer",
  "Lebensraum-Zuordnung": "lebensraum", "Tier-und-Pflanzen-Sortierer": "tier-sortierer", "Lebenszyklus-Puzzle": "lebenszyklus",
  "Schwimmt-oder-sinkt-Labor": "schwimmt-sinkt", "Magnet-Pole": "magnet-labor", "Mondphasen-Ordnen": "himmels-forscher",
  "Kompass-Spiel": "kompass", "Znüni-Teller": "znueni-teller", "Word-Match": "word-match", "Instrumenten-Memory": "instrumente",
  "Jahreskreis-Ordner": "jahreskreis", "Laut-Detektiv": "anlaut-angel",
  "Früher-heute-Paare": "frueher-heute", "Wetter-Jahreszeiten": "wetter-jahreszeiten",
};
const ERSETZT = {
  "Folgen-Fortsetzer": "ersetzt: Zahlenfolgen übt der Muster-Fortsetzer (Stufen 5–6), den OP 4. Klasse (MA.3.A.3.d) die Preis-Tabelle",
};

// ----- Spielideen lesen: nummerierte Einträge „N. **Name** — Codes … Klassen X–Y.“ je Fach -----
const FAECHER_IDEEN = { Mathematik: "Mathe", Deutsch: "Deutsch", NMG: "NMG", Englisch: "Englisch", "Französisch": "Französisch", Musik: "Musik", Medien: "Medien und Informatik" };
const ideen = [];
{
  let fach = null;
  let aktuell = null;
  for (const zeile of lies("docs/spielideen/lehrplan_sg_spielideen.md").split(/\r?\n/)) {
    const kopf = zeile.match(/^#{2,3} (?:Spielideen |\d+\. )?(.+)/);
    if (kopf) {
      aktuell = null;
      const f = Object.keys(FAECHER_IDEEN).find(k => kopf[1].startsWith(k));
      if (zeile.startsWith("## ")) fach = f ? FAECHER_IDEEN[f] : null;
      else if (f) fach = FAECHER_IDEEN[f];
      continue;
    }
    const m = zeile.match(/^\s*\d+\. \*\*([^*]+)\*\*(.*)/);
    if (m && fach) { aktuell = { name: m[1].trim(), fach, text: m[2] }; ideen.push(aktuell); continue; }
    if (aktuell && /^\s+\S/.test(zeile)) aktuell.text += " " + zeile.trim();
    else aktuell = null;
  }
  for (const i of ideen) {
    const k = i.text.match(/Klassen? (\d)(?:\s*[–-]\s*(\d))?/);
    i.von = k ? Number(k[1]) : null;
    i.bis = k ? Number(k[2] || k[1]) : null;
    i.codes = [...i.text.matchAll(/\b([A-Z]{2,4}\d?[A-Z]?\.\d+(?:\.[A-Z])?(?:\.\d+)?)/g)].map(c => c[1]);
  }
}

// ----- Annahmen je Lernziel-Dokument (Abschnitte „Annahmen“, „Weitere Annahmen“, „Bekannte Grenzen“) -----
const annahmen = fs.readdirSync(path.join(WURZEL, "docs/lernziele")).filter(f => f.endsWith(".md")).map(datei => {
  const text = [];
  let drin = false;
  for (const zeile of lies("docs/lernziele/" + datei).split(/\r?\n/)) {
    if (/^#{2,3} /.test(zeile)) drin = /Annahmen|Bekannte Grenzen/.test(zeile);
    else if (drin) text.push(zeile);
  }
  return { datei, text: text.join(" ") };
});
/** Lernziel-Dokumente, deren Annahmen dieses Spiel nennen (Name, ohne „-Spiel“). */
function annahmenZu(s) {
  const namen = [s.name, s.name.replace(/-Spiel$/, "")];
  return annahmen.filter(a => namen.some(n => a.text.includes(n))).map(a => a.datei);
}

// ----- Zuordnung -----
const themaVon = id => THEMEN.find(t => t.id === id);
/** Thema einer Idee: das Thema, dessen Lehrplan-Quelle einen ihrer Kompetenz-Codes nennt. */
function themaZuIdee(i) {
  for (const c of i.codes) {
    const kompetenz = c.split(".").slice(0, 3).join(".");
    const t = THEMEN.find(t => t.quelle.includes(kompetenz));
    if (t) return t.name;
  }
  return i.codes.length ? `neues Thema (${i.codes[0].split(".").slice(0, 3).join(".")})` : "neues Thema";
}

const eintraege = [];
const gebauteIdeen = new Set();
for (const s of SPIELE) {
  const t = themaVon(s.thema);
  const idee = ideen.find(i => GEBAUT_ALS[i.name] === s.id || norm(i.name) === norm(s.name));
  if (idee) gebauteIdeen.add(idee.name);
  // Verweis auf die Liste eines anderen Spiels: Name und Prüfstand von dort, geprüft wird sie dort.
  const listen = Object.values(s.listen || {}).map(l => {
    if (!l.von) return l;
    const [spiel, liste] = l.von.split("/");
    const quelle = SPIELE.find(x => x.id === spiel);
    return { ...quelle.listen[liste], name: `${quelle.listen[liste].name} (Liste von ${quelle.name})`, verweis: true };
  });
  eintraege.push({
    klasse: s.klasse, fach: t.fach, thema: t.name, name: s.name, gebaut: true, id: s.id,
    neu: s.neu, geprueft: s.geprueft, listen, annahmen: annahmenZu(s),
  });
}
for (const i of ideen) {
  if (gebauteIdeen.has(i.name) || GEBAUT_ALS[i.name]) continue;
  eintraege.push({
    klasse: Math.max(1, i.von ?? 1), fach: i.fach, thema: themaZuIdee(i), name: i.name, gebaut: false,
    bereich: i.von ? (i.von === i.bis ? `${i.von}. Klasse` : `Klassen ${i.von}–${i.bis}`) : "", ersetzt: ERSETZT[i.name],
  });
}

// ----- Ausgabe -----
const z = [];
const gebaut = eintraege.filter(e => e.gebaut);
const ideenOffen = eintraege.filter(e => !e.gebaut && !e.ersetzt);
const neue = gebaut.filter(e => e.neu);
const angesehen = neue.filter(e => e.geprueft).length;
const frei = gebaut.filter(e => !(e.neu && !e.geprueft) && (!e.listen.length || e.listen.some(l => !l.zusatz && l.geprueft))).length;
const listenAlle = gebaut.flatMap(e => e.listen).filter(l => !l.verweis); // jede Liste einmal, an ihrer Quelle
z.push("# Checkliste der Spiele", "",
  "Erzeugt mit `node tools/checkliste.js > docs/checkliste.md` — **nicht von Hand ändern**. Abgehakt",
  "wird in den Quellen: ein Spiel als angesehen bzw. eine Inhaltsliste als geprüft mit `geprueft: { am, von }`",
  "im Katalog (`spiele/gemeinsam/katalog.js`), Annahmen in `docs/lernziele/`, Ideen in",
  "`docs/spielideen/lehrplan_sg_spielideen.md`. Danach die Liste neu erzeugen.", "",
  `**Stand:** ${gebaut.length} Spiele gebaut, ${ideenOffen.length} Ideen offen · für Kinder frei: ${frei} von ${gebaut.length} · ` +
  `${angesehen} von ${neue.length} neuen Spielen angesehen · ${listenAlle.filter(l => l.geprueft).length} von ${listenAlle.length} Inhaltslisten geprüft.`, "",
  "Für Kinder frei ist, was nichts mehr zu prüfen hat: Neue Spiele sind gesperrt, bis sie angesehen sind, Spiele mit",
  "Inhaltslisten, bis mindestens eine Liste geprüft ist. Die Aufsicht kann das je Gerät in der Verwaltung anders setzen.", "",
  "Gliederung: **Klasse** (Basisklasse des Spiels, bei Ideen die unterste Klasse des Bereichs) → **Fach** → **Thema** → Spiel.",
  "Je gebautem Spiel:", "",
  "- *angesehen* (nur neue Spiele) — auf Desktop, Tablet (768 px) und Handy (375 px) durchgespielt;",
  "- *Inhalte* — Wort- und Inhaltslisten geprüft (Prüfliste `docs/pruefung/wortlisten_zur_pruefung.md`);",
  "- *Lehrmittel* — Annahmen, die mit dem Lehrmittel abzugleichen sind (Datei in `docs/lernziele/`).", "");

const haken = b => (b ? "[x]" : "[ ]");
for (const klasse of [...new Set(eintraege.map(e => e.klasse))].sort((a, b) => a - b)) {
  z.push(`## ${klasse}. Klasse`, "");
  const inKlasse = eintraege.filter(e => e.klasse === klasse);
  for (const fach of [...new Set(inKlasse.map(e => e.fach))]) {
    z.push(`### ${fach}`, "");
    const inFach = inKlasse.filter(e => e.fach === fach);
    for (const thema of [...new Set(inFach.map(e => e.thema))]) {
      z.push(`#### ${thema}`, "");
      for (const e of inFach.filter(e => e.thema === thema).sort((a, b) => Number(b.gebaut) - Number(a.gebaut) || a.name.localeCompare(b.name, "de"))) {
        if (!e.gebaut) {
          z.push(`- ${e.ersetzt ? "[x] ~~" + e.name + "~~ — " + e.ersetzt : `[ ] ${e.name} — Idee${e.bereich ? ", " + e.bereich : ""}`}`);
          continue;
        }
        // Für Kinder frei, wenn nichts mehr zu prüfen ist: ein neues Spiel erst angesehen, Listen erst geprüft
        // (eine geprüfte gewöhnliche Liste genügt, damit das Spiel erscheint).
        const sperre = [];
        if (e.neu && !e.geprueft) sperre.push("angesehen");
        const listenOk = !e.listen.length || e.listen.some(l => !l.zusatz && l.geprueft);
        if (!listenOk) sperre.push("eine Liste geprüft");
        z.push(`- [x] **${e.name}** (\`${e.id}\`) — für Kinder ${sperre.length ? "🔒 gesperrt, bis " + sperre.join(" und ") + " ist" : "frei"}`);
        if (e.neu) z.push(`  - ${haken(e.geprueft)} angesehen${e.geprueft ? ` ${e.geprueft.am}${e.geprueft.von ? " · " + e.geprueft.von : ""}` : ""}`);
        if (e.listen.length) {
          const ok = e.listen.filter(l => l.geprueft).length;
          z.push(`  - ${haken(ok === e.listen.length)} Inhalte geprüft: ${ok} von ${e.listen.length} Listen` +
            (ok < e.listen.length ? ` (offen: ${e.listen.filter(l => !l.geprueft).map(l => l.name).join("; ")})` : ""));
        }
        if (e.annahmen.length) z.push(`  - [ ] Lehrmittel: Annahmen abgleichen in ${e.annahmen.map(d => `\`${d}\``).join(", ")}`);
      }
      z.push("");
    }
  }
}
process.stdout.write(z.join("\n"));
