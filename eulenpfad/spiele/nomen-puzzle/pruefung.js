/* Prüfansicht des Nomen-Puzzles (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Liste (KOMPOSITA in woerter.js) ein Abschnitt. Die Spalte „umgedreht“ setzt die Teile mit der Funktion des Spiels
   (zusammen) in falscher Reihenfolge zusammen — so erscheint sie als Ablenker beim Zusammensetzen und Zerlegen. Die
   Spalte „Fuge“ liest aus dem ganzen Wort, was zwischen den Teilen dazukommt oder wegfällt. Zu prüfen: Passen die
   Bilder zu den Teilen, ist das zusammengesetzte Wort richtig geschrieben und hat es den Artikel des letzten Teils,
   ist kein Ablenker auch ein richtiges Wort? */
"use strict";
{
  const bilder = k => k.teile.map(t => t[2]).join(" + ");
  const teile = k => k.teile.map(([artikel, wort]) => `${artikel} ${wort}`).join(" + ");
  const ganz = k => `${k.ganz[0]} ${k.ganz[1]}`;
  /** Was zwischen den Teilen steht: „-n-“ (Fugenlaut), „Schule → Schul-“ (verkürzt); leer, wenn die Teile nur aneinanderhängen. */
  function fugen(k) {
    const g = k.ganz[1].toLowerCase(), w = woerter(k).map(x => x.toLowerCase()), funde = [];
    let pos = 0;
    w.forEach((p, i) => {
      if (g.startsWith(p, pos)) pos += p.length;
      else {
        let n = 0;
        while (n < p.length && g[pos + n] === p[n]) n++;
        funde.push(`${woerter(k)[i]} → ${woerter(k)[i].slice(0, n)}-`);
        pos += n;
      }
      if (i === w.length - 1) return;
      const naechster = g.indexOf(w[i + 1].slice(0, 3), pos);
      if (naechster < 0) { funde.push("?"); return; }
      if (naechster > pos) funde.push(`-${g.slice(pos, naechster)}-`);
      pos = naechster;
    });
    return funde;
  }
  const fugeText = k => fugen(k).join(", ") || "keine";
  const umgedreht = k => zusammen([...woerter(k)].reverse());
  LS.listenPruefung("nomen-puzzle", {
    "zwei-teile": {
      beschreibung: "Nomen aus zwei Teilen, die einfach aneinanderhängen (Haus + Tür = Haustür). Das Kind setzt sie zusammen (Stufe 1), legt die Teile in der richtigen Reihenfolge (2), zerlegt sie (3) und wählt den Artikel (4, auch 5).",
      abschnitte: [{
        id: "zwei-teile", titel: "Zwei Teile ohne Fugenlaut", spalten: ["Bilder", "Teile", "zusammengesetzt", "umgedreht (Ablenker)"],
        hinweis: "Je Artikel des ganzen Worts eine Gruppe; er muss der Artikel des hinteren Teils sein. Das umgedrehte Wort darf kein richtiges Wort sein, sonst ist es als Ablenker fragwürdig.",
        eintraege: () => KOMPOSITA["zwei-teile"], gruppe: k => `${k.ganz[0]} …`,
        zeile: k => [bilder(k), teile(k), ganz(k), umgedreht(k)],
      }],
    },
    fugenlaut: {
      beschreibung: "Nomen aus zwei Teilen mit Fugenlaut oder verkürztem ersten Teil (Sonnenblume, Schultasche). Das Kind wählt die richtige Schreibweise unter den falschen Formen (Stufen 5, 6) und den Artikel (5, 6).",
      abschnitte: [{
        id: "fugenlaut", titel: "Zwei Teile mit Fugenlaut", spalten: ["Bilder", "Teile", "zusammengesetzt", "Fuge", "falsche Formen"],
        hinweis: "Die Spalte „Fuge“ zeigt, was zwischen den Teilen dazukommt oder wegfällt. Die falschen Formen müssen falsch sein und sich doch wie das Wort anhören können.",
        eintraege: () => KOMPOSITA.fugenlaut,
        zeile: k => [bilder(k), teile(k), ganz(k), fugeText(k), (k.falsch || []).join(", ")],
      }],
    },
    "drei-teile": {
      beschreibung: "Nomen aus drei Teilen (Fussballschuh). Das Kind legt die Teile in der richtigen Reihenfolge (Stufen 5, 6), zerlegt sie unter vertauschten Reihenfolgen (6) und wählt den Artikel (5, 6). Wörter mit falschen Formen kommen dazu in der Schreibweise-Aufgabe (5, 6).",
      abschnitte: [{
        id: "drei-teile", titel: "Drei Teile", spalten: ["Bilder", "Teile", "zusammengesetzt", "Fuge", "falsche Formen"],
        hinweis: "Gruppen ohne und mit Fugenlaut. Der Artikel ist der des letzten Teils; die falschen Formen müssen falsch sein.",
        eintraege: () => KOMPOSITA["drei-teile"], gruppe: k => (fugen(k).length ? "mit Fugenlaut" : "ohne Fugenlaut"),
        zeile: k => [bilder(k), teile(k), ganz(k), fugeText(k), (k.falsch || []).join(", ") || "–"],
      }],
    },
  });
}
