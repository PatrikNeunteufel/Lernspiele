/* Lernsteig — Piktogramme der Übungen (Entscheid SY1 a, LERN_Session21): einfarbige Strichzeichnungen, sachlich, ohne
   Figuren. Raster 24 × 24, Strich 1.8 mit runden Enden; Farbe und Strich setzt stil.css (.piktogramm), hier nur Formen.
   Klasse "voll" füllt eine Form in der Strichfarbe, "flaeche" leicht getönt. Kein Text in den Zeichnungen (Schriften
   zeichnen je Gerät verschieden). Der Katalog nennt je Übung ein Piktogramm (Feld symbol); tools/pruefe_uebungen.js
   prüft, dass es hier steht. */
"use strict";

var LST_SYMBOLE = (function () {
  const BILDER = {
    // Zahlengerade mit Null in der Mitte, links minus, rechts plus
    zahlengerade: '<path d="M2 16h19.5M18.8 13.4l2.7 2.6-2.7 2.6"/><path d="M5 14.2v3.6M11 12.6v6.8M16.5 14.2v3.6"/>'
      + '<path d="M2.5 7.5h5M14 7.5h5M16.5 5v5"/>',
    // Waage im Gleichgewicht
    waage: '<path d="M12 4v15.5M7.5 19.5h9M5 7h14"/><circle class="voll" cx="12" cy="4" r="1.3"/>'
      + '<path d="M5 7 2.4 13.2h5.2zM19 7l-2.6 6.2h5.2z"/><path d="M2.4 13.2a2.6 1.6 0 0 0 5.2 0M16.4 13.2a2.6 1.6 0 0 0 5.2 0"/>',
    // Würfel (Körper, Volumen) mit getönter Vorderfläche
    wuerfel: '<path class="flaeche" d="M4 8.5h11v11H4z"/><path d="M4 8.5 8.5 4h11L15 8.5M15 19.5l4.5-4.5V4"/><path d="M4 8.5h11v11H4z"/>',
    // Stromkreis: Batterie links, Lampe rechts
    stromkreis: '<path d="M4 10.5V4h16v5M4 13.5V20h16v-5"/><path d="M1 10.5h6M2.6 13.5h2.8"/>'
      + '<circle cx="20" cy="12" r="3"/><path d="m17.9 9.9 4.2 4.2M22.1 9.9l-4.2 4.2"/>',
    // Satzglieder: Bausteine eines Satzes, einer hervorgehoben
    satzbau: '<rect x="2.5" y="6" width="7" height="5" rx="1.2"/><rect class="flaeche" x="11.5" y="6" width="10" height="5" rx="1.2"/>'
      + '<rect x="2.5" y="13.5" width="11" height="5" rx="1.2"/><rect x="15.5" y="13.5" width="6" height="5" rx="1.2"/>',
    // Zwei Sprechblasen: Fremdsprache im Gespräch
    gespraech: '<path d="M3 4.5h11a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H8l-3.2 2.8V12.5H3A1.5 1.5 0 0 1 1.5 11V6A1.5 1.5 0 0 1 3 4.5z"/>'
      + '<path class="flaeche" d="M10.5 13.5V15a1.5 1.5 0 0 0 1.5 1.5h4.5l3.2 2.8v-2.8H21a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 21 8.5h-3.5"/>',
    // ---------- Mathematik ----------
    // Massstab mit Teilstrichen (Grössen umwandeln)
    massstab: '<rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M6 8v4.5M10 8v3M14 8v4.5M18 8v3"/>',
    // Prozentzeichen aus zwei Kreisen und Schrägstrich
    prozent: '<circle cx="7" cy="7" r="2.6"/><circle cx="17" cy="17" r="2.6"/><path d="M18.5 4.5 5.5 19.5"/>',
    // Klammern um einen Teil (Terme)
    klammern: '<path d="M7.5 3.5c-3.6 3-3.6 14 0 17M16.5 3.5c3.6 3 3.6 14 0 17"/>'
      + '<rect class="flaeche" x="9" y="9.5" width="6" height="5" rx="1"/><rect x="9" y="9.5" width="6" height="5" rx="1"/>',
    // Grosses Quadrat mit Hochzahl (Zehnerpotenzen)
    potenz: '<rect x="3" y="9" width="12" height="12" rx="1.2"/><rect class="flaeche" x="16.5" y="3" width="5" height="5" rx="1"/>'
      + '<rect x="16.5" y="3" width="5" height="5" rx="1"/>',
    // Balken der Grösse nach (Überschlagen und Ordnen)
    ordnen: '<path d="M2.5 20.5h19"/><rect x="4" y="14.5" width="4" height="6" rx="1"/><rect x="10" y="10.5" width="4" height="10" rx="1"/>'
      + '<rect class="flaeche" x="16" y="5.5" width="4" height="15" rx="1"/><rect x="16" y="5.5" width="4" height="15" rx="1"/>',
    // Säulen mit gestrichelter Mittellinie (Mittelwert, Häufigkeit)
    mittelwert: '<path d="M3 3v18h18"/><rect x="6" y="12" width="3" height="9"/><rect x="11" y="7" width="3" height="14"/>'
      + '<rect x="16" y="14" width="3" height="7"/><path d="M4.5 11h17" stroke-dasharray="2 2"/>',
    // Baumdiagramm (Möglichkeiten zählen)
    baum: '<path d="M4 12 12 6.5M4 12l8 5.5M12 6.5 20 3.5M12 6.5l8 4M12 17.5l8-4M12 17.5l8 3"/>'
      + '<circle class="voll" cx="4" cy="12" r="1.7"/><circle class="voll" cx="12" cy="6.5" r="1.4"/><circle class="voll" cx="12" cy="17.5" r="1.4"/>',
    // Würfel mit drei Augen (Zufall)
    wuerfelaugen: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle class="voll" cx="8.5" cy="8.5" r="1.4"/>'
      + '<circle class="voll" cx="12" cy="12" r="1.4"/><circle class="voll" cx="15.5" cy="15.5" r="1.4"/>',
    // Winkel mit Bogen (Körper, Winkel, Ähnlichkeit)
    winkel: '<path d="M4 19h16M4 19 15 6"/><path d="M10.5 19a6.5 6.5 0 0 0-2.3-5"/>',
    // Wahr oder falsch: Kästchen mit Haken (Aussagen prüfen)
    haken: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="m8 12.5 2.8 2.8L16.5 9"/>',
    // wachsendes Punktmuster (Folgen und Muster)
    muster: '<circle class="voll" cx="5" cy="18" r="1.8"/><circle class="voll" cx="11" cy="18" r="1.8"/><circle class="voll" cx="11" cy="12.5" r="1.8"/>'
      + '<circle class="voll" cx="17" cy="18" r="1.8"/><circle class="voll" cx="17" cy="12.5" r="1.8"/><circle class="voll" cx="17" cy="7" r="1.8"/>',
    // Klemmbrett mit Aufgabentext (Sachsituationen)
    sachaufgabe: '<rect x="5" y="4" width="14" height="17" rx="2"/><rect class="flaeche" x="9" y="2.5" width="6" height="3.5" rx="1"/>'
      + '<rect x="9" y="2.5" width="6" height="3.5" rx="1"/><path d="M8.5 10.5h7M8.5 14h7M8.5 17.5h4"/>',
    // Achsen mit einem Punkt (Koordinaten)
    koordinaten: '<path d="M4 21V3.5M3 21h17.5M2 5.5l2-2 2 2M18.5 19l2 2-2 2"/><path d="M14 9v12M14 9H4" stroke-dasharray="1.5 2"/>'
      + '<circle class="voll" cx="14" cy="9" r="1.8"/>',
    // Kreis in Vierteln, eines getönt (Brüche)
    bruch: '<path class="flaeche" d="M12 12V3.5a8.5 8.5 0 0 1 8.5 8.5z"/><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M3.5 12h17"/>',
    // Achsen mit einer Geraden (Lineare Funktionen)
    gerade: '<path d="M4 21V3.5M3 21h17.5"/><path d="M5.5 18.5 20 5"/><circle class="voll" cx="9" cy="15.2" r="1.4"/><circle class="voll" cx="15.5" cy="9.2" r="1.4"/>',
    // Quadrat in a², ab, ab, b² geteilt (Binome)
    binom: '<rect class="flaeche" x="3" y="3" width="10" height="10"/><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M13 3v18M3 13h18"/>',
    // ---------- Deutsch ----------
    // Bleistift über einer Zeile (Rechtschreibung)
    stift: '<path d="M15.5 3.5 20 8 9 19l-5.5 1.5L5 15z"/><path d="m13.5 5.5 4.5 4.5"/><path d="M13 21h8"/>',
    // ---------- Natur und Technik ----------
    // Herz (Stoffwechsel: Organe und Vorgänge)
    herz: '<path d="M12 20.5 4.6 13.2a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 0 1 6.5 6.5z"/>',
    // Atom mit drei Bahnen (Atombau)
    atom: '<ellipse cx="12" cy="12" rx="9.5" ry="3.6"/><ellipse cx="12" cy="12" rx="9.5" ry="3.6" transform="rotate(60 12 12)"/>'
      + '<ellipse cx="12" cy="12" rx="9.5" ry="3.6" transform="rotate(-60 12 12)"/><circle class="voll" cx="12" cy="12" r="1.7"/>',
    // Hebel auf einem Drehpunkt mit Kraftpfeil (Kräfte und einfache Maschinen)
    hebel: '<path d="M2.5 14 21.5 10"/><path class="flaeche" d="M13 12.1 10 18.5h6z"/><path d="M13 12.1 10 18.5h6zM8 20.5h10"/>'
      + '<path d="M5 3.5v7M3 8.5l2 2 2-2"/>',
  };

  /** Piktogramm als SVG-Text (fester Text aus diesem Code, nie aus Daten); unbekannt → leer. */
  function svg(id, groesse = 24) {
    const b = BILDER[id];
    return b ? `<svg class="piktogramm" viewBox="0 0 24 24" width="${groesse}" height="${groesse}" aria-hidden="true">${b}</svg>` : "";
  }

  return { BILDER, svg, gibt: id => Object.prototype.hasOwnProperty.call(BILDER, id) };
})();

if (typeof module !== "undefined") module.exports = LST_SYMBOLE;
