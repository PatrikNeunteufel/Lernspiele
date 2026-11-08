// Wortlaut der Kompetenzstufen aus den gesicherten Seiten von sg.lehrplan.ch (LERN_Session23, Plan E 1).
//
// Quellen: docs/lernsteig/lehrplan/quellen_*/<Code ohne ersten Punkt>.html (Roh-HTML, Fassung „Lehrplan Volksschule
// August 2025“). Jede Datei wird an ihrer Kennung erkannt (`font_ganzercode`), nicht am Dateinamen.
// Je Stufe: Zyklus (`marker_z…`), Grundanspruch (Zeilenklasse `mindestanspruch`), Orientierungspunkt (`tooltip op`)
// und die Punkte der Stufe als Text. Formeln sind auf den Seiten Bilder und stehen als „[Bild <datei>]“ im Text.
//
//   node tools/lehrplan_wortlaut.js MA.1.A.3 [h]   zeigt den Wortlaut einer Kompetenz oder Stufe
"use strict";
const fs = require("fs");
const path = require("path");

const ORDNER = path.join(__dirname, "..", "docs", "lernsteig", "lehrplan");

// Benannte Entitäten, die in den gesicherten Seiten vorkommen (dazu die üblichen); eine unbekannte bleibt stehen.
const ENTITAETEN = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', middot: "·" };
const entitaeten = s => s.replace(/&([a-z]+);/gi, (x, e) => ENTITAETEN[e] ?? x)
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&#0*(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/​/g, ""); // Leerstelle ohne Breite (auf den NT-Seiten vor Begriffslisten)
const alsText = html => entitaeten(html
  .replace(/<img[^>]*src="([^"]*)"[^>]*>/g, (_, s) => ` [Bild ${s.split("/").pop()}] `)
  .replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").replace(/\] ([.,;:)])/g, "]$1").trim(); // nur nach einem Bild

/** Stufen einer gesicherten Seite: Map Stufe → {zyklus, ga, op, punkte}. */
function stufenDerSeite(html) {
  const stufen = {};
  for (const zeile of html.split('<div class="twelve columns komp_row').slice(1)) {
    const m = zeile.match(/kompetenz_lit" title="[^"]+\.([a-z])"/);
    if (!m) continue;
    const text = (zeile.split("kompetenz_text")[1] || "").split("kompetenz_querverw")[0];
    stufen[m[1]] = {
      zyklus: +(zeile.match(/marker_z(\d)/) || [])[1],
      ga: /^[^>]*mindestanspruch/.test(zeile),
      op: /tooltip op/.test(zeile),
      punkte: [...text.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(x => alsText(x[1])).filter(Boolean),
    };
  }
  return stufen;
}

let seiten = null;
/** Alle gesicherten Seiten: Map Kennung (etwa „MA.1.A.3“) → {datei, stufen}. */
function alle() {
  if (seiten) return seiten;
  seiten = {};
  for (const ordner of fs.readdirSync(ORDNER).filter(d => d.startsWith("quellen_"))) {
    for (const datei of fs.readdirSync(path.join(ORDNER, ordner)).filter(d => d.endsWith(".html"))) {
      const html = fs.readFileSync(path.join(ORDNER, ordner, datei), "utf8");
      const kennung = (html.match(/font_ganzercode">([^<]+)</) || [])[1];
      if (!kennung) continue;
      if (seiten[kennung]) throw new Error(`${kennung} zweimal gesichert: ${seiten[kennung].datei}, ${ordner}/${datei}`);
      seiten[kennung] = { datei: `${ordner}/${datei}`, stufen: stufenDerSeite(html) };
    }
  }
  return seiten;
}

/** Wortlaut einer Stufe ({zyklus, ga, op, punkte, datei}) oder null, wenn die Seite nicht gesichert ist. */
function stufe(kompetenz, buchstabe) {
  const seite = alle()[kompetenz];
  const st = seite && seite.stufen[buchstabe];
  return st ? { ...st, datei: seite.datei } : null;
}

module.exports = { alle, stufe, stufenDerSeite, alsText };

if (require.main === module) {
  const [kompetenz, buchstabe] = process.argv.slice(2);
  const seite = alle()[kompetenz];
  if (!seite) { console.log(`${kompetenz || "(keine Kennung)"}: keine gesicherte Seite. Gesichert: ${Object.keys(alle()).join(", ")}`); process.exit(1); }
  for (const [b, st] of Object.entries(seite.stufen)) {
    if (buchstabe && b !== buchstabe) continue;
    console.log(`${kompetenz}.${b} (Zyklus ${st.zyklus}${st.ga ? ", GA" : ""}${st.op ? ", OP" : ""})`);
    for (const p of st.punkte) console.log(`  - ${p}`);
  }
}
