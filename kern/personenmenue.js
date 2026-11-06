/* Kern — Personen-Knopf mit Menü: wer angemeldet ist, wechseln, abmelden (docs/kern/rahmen.md 4.16, Entscheid PA1 a).
   Ein Knopf mit Bild und Name; ein Tippen öffnet ein Menü mit den anderen Personen des Geräts und, getrennt darunter,
   dem Schluss-Eintrag (Abmelden, beim Gast Anmelden). Personen und Aktion stehen nicht in derselben Auswahlliste:
   eine Pfeiltaste wählt nichts aus, erst Enter oder ein Tippen.
   KERN.personenMenue({ ich, personen, waehle, schluss, titel }) → Hülle div.personen-menue mit
     button.personen-knopf · div.personen-liste[role=menu] (Einträge button.personen-eintrag, button.personen-schluss)
     ich       { name, bild }            bild: Element oder null (die App zeichnet ihr Bild)
     personen  [{ id, name, bild, zusatz, aria }]   ohne die angemeldete Person; zusatz z. B. „🔒“
     waehle    id => …                   die App meldet an (oder fragt die PIN)
     schluss   { text, aktion }          „↩ Abmelden“ bzw. „Anmelden“
     titel     Text für Bildschirmleser („Angemeldet als“)
   Tastatur: Pfeil ab/auf auf dem Knopf öffnet; im Menü Pfeil ab/auf, Pos1/Ende; Esc schliesst und gibt den Fokus dem
   Knopf zurück; Tab oder ein Tippen daneben schliesst. Aussehen gibt die App ([hidden] muss ausblenden; die Liste
   steht bündig rechts am Knopf, mit der Klasse nach-rechts, die der Kern bei zu wenig Platz links setzt, bündig links).
   KERN.personenMenue.naechster(i, n, taste) → Index nach einer Taste (rein, getestet).
   Greift erst beim Aufruf auf document zu, nie beim Laden (in Node ladbar). */
"use strict";

(function (KERN) {
  /** Index des Eintrags nach einer Taste; -1 = keiner fokussiert. Unbekannte Taste: unverändert. */
  function naechster(i, n, taste) {
    if (n <= 0) return -1;
    if (taste === "ArrowDown") return i < 0 ? 0 : (i + 1) % n;
    if (taste === "ArrowUp") return i < 0 ? n - 1 : (i - 1 + n) % n;
    if (taste === "Home") return 0;
    if (taste === "End") return n - 1;
    return i;
  }

  function personenMenue({ ich, personen = [], waehle, schluss, titel = "Angemeldet als" }) {
    const el = KERN.el;
    const knopf = el("button", { type: "button", class: "personen-knopf", "aria-haspopup": "menu", "aria-expanded": "false",
      "aria-label": `${titel}: ${ich.name}`, title: titel },
      ich.bild || null, el("span", { class: "personen-name", text: ich.name }), el("span", { class: "personen-pfeil", "aria-hidden": "true", text: "▾" }));
    const eintrag = (klasse, inhalt, aria, aktion) => el("button", { type: "button", class: klasse, role: "menuitem", tabindex: "-1",
      "aria-label": aria || null, onclick: () => { schliesse(false); aktion(); } }, inhalt);
    const eintraege = [
      ...personen.map(p => eintrag("personen-eintrag", [p.bild || null, el("span", { class: "personen-name", text: p.name }),
        p.zusatz ? el("span", { class: "personen-zusatz", text: p.zusatz }) : null], p.aria, () => waehle(p.id))),
      ...(schluss ? [eintrag("personen-schluss", schluss.text, null, schluss.aktion)] : []),
    ];
    const trenner = personen.length && schluss ? el("div", { class: "personen-trenner", role: "separator" }) : null;
    const liste = el("div", { class: "personen-liste", role: "menu", "aria-label": titel, hidden: true },
      eintraege.slice(0, personen.length), trenner, eintraege.slice(personen.length));
    const huelle = el("div", { class: "personen-menue" }, knopf, liste);

    const offen = () => !liste.hidden;
    const fokus = i => { if (eintraege[i]) eintraege[i].focus(); };
    const aussen = e => { if (!huelle.isConnected || !huelle.contains(e.target)) schliesse(false); };
    function oeffne(erster = 0) {
      liste.classList.remove("nach-rechts");
      liste.hidden = false;
      // Bündig rechts am Knopf; reicht der Platz links nicht (Knopf am linken Rand, etwa auf dem Handy), nach rechts.
      if (liste.getBoundingClientRect().left < 0) liste.classList.add("nach-rechts");
      knopf.setAttribute("aria-expanded", "true");
      document.addEventListener("pointerdown", aussen, true);
      fokus(erster);
    }
    function schliesse(fokusZurueck) {
      if (!offen()) return;
      liste.hidden = true;
      knopf.setAttribute("aria-expanded", "false");
      document.removeEventListener("pointerdown", aussen, true);
      if (fokusZurueck) knopf.focus();
    }
    knopf.addEventListener("click", () => (offen() ? schliesse(false) : oeffne()));
    knopf.addEventListener("keydown", e => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      oeffne(naechster(-1, eintraege.length, e.key));
    });
    liste.addEventListener("keydown", e => {
      if (e.key === "Escape") { e.preventDefault(); return schliesse(true); }
      if (e.key === "Tab") return schliesse(false);
      const i = eintraege.indexOf(document.activeElement), j = naechster(i, eintraege.length, e.key);
      if (j !== i) { e.preventDefault(); fokus(j); }
    });
    return huelle;
  }
  personenMenue.naechster = naechster;

  KERN.personenMenue = personenMenue;
})(typeof globalThis.KERN === "object" ? globalThis.KERN : (globalThis.KERN = {}));

if (typeof module !== "undefined") module.exports = globalThis.KERN;
