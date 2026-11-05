/* Inhaltsliste „Aussagen prüfen“ (MA.1.B.2) — zum Durchsehen ohne Code. UNGEPRÜFT (LST_Session1), bis Patrik sie
   durchgesehen hat (Regel wie im Eulenpfad: jede neue Liste gilt als ungeprüft).
   Je Aussage: text (so, wie sie erscheint) und pruefung (maschinell nachrechenbar, damit „wahr“ nicht behauptet,
   sondern belegt ist):
     { art: "gleich", links, rechts }            stimmt, wenn beide Terme für alle Werte gleich sind
     { art: "teilbar", term, durch, var? }       stimmt, wenn term für alle natürlichen Zahlen (1–40) durch „durch“ teilbar ist
     { art: "ungerade", term } / { art: "gerade", term }  stimmt, wenn term für alle natürlichen Zahlen ungerade/gerade ist
   Variablen: a, b, n (natürliche Zahlen ab 1). Terme in der Schreibweise von lernsteig/gemeinsam/terme.js. */
"use strict";

const AUSSAGEN = {
  // h: arithmetische Gesetzmässigkeiten begründen oder widerlegen
  h: [
    { text: "Die Summe zweier gerader Zahlen ist immer gerade.", pruefung: { art: "gerade", term: "2a + 2b" } },
    { text: "Die Summe zweier ungerader Zahlen ist immer ungerade.", pruefung: { art: "ungerade", term: "(2a - 1) + (2b - 1)" } },
    { text: "Eine gerade plus eine ungerade Zahl ergibt immer eine ungerade Zahl.", pruefung: { art: "ungerade", term: "2a + (2b - 1)" } },
    { text: "Eine gerade plus eine ungerade Zahl ergibt immer eine gerade Zahl.", pruefung: { art: "gerade", term: "2a + (2b - 1)" } },
    { text: "Das Produkt zweier ungerader Zahlen ist immer ungerade.", pruefung: { art: "ungerade", term: "(2a - 1)(2b - 1)" } },
    { text: "Das Produkt einer geraden und einer ungeraden Zahl ist immer ungerade.", pruefung: { art: "ungerade", term: "2a(2b - 1)" } },
    { text: "Das Produkt zweier aufeinanderfolgender Zahlen ist immer gerade.", pruefung: { art: "gerade", term: "n(n + 1)" } },
    { text: "Das Produkt dreier aufeinanderfolgender Zahlen ist immer durch 6 teilbar.", pruefung: { art: "teilbar", term: "n(n + 1)(n + 2)", durch: 6 } },
    { text: "Das Produkt dreier aufeinanderfolgender Zahlen ist immer durch 4 teilbar.", pruefung: { art: "teilbar", term: "n(n + 1)(n + 2)", durch: 4 } },
    { text: "Das Produkt von vier aufeinanderfolgenden Zahlen ist immer durch 24 teilbar.", pruefung: { art: "teilbar", term: "n(n + 1)(n + 2)(n + 3)", durch: 24 } },
    { text: "Das Produkt von vier aufeinanderfolgenden Zahlen ist immer durch 48 teilbar.", pruefung: { art: "teilbar", term: "n(n + 1)(n + 2)(n + 3)", durch: 48 } },
    { text: "Die Summe dreier aufeinanderfolgender Zahlen ist immer durch 3 teilbar.", pruefung: { art: "teilbar", term: "n + (n + 1) + (n + 2)", durch: 3 } },
    { text: "Die Summe von vier aufeinanderfolgenden Zahlen ist immer durch 4 teilbar.", pruefung: { art: "teilbar", term: "n + (n + 1) + (n + 2) + (n + 3)", durch: 4 } },
    { text: "Die Summe zweier aufeinanderfolgender Zahlen ist immer ungerade.", pruefung: { art: "ungerade", term: "n + (n + 1)" } },
  ],
  // j: algebraische Aussagen durch Einsetzen prüfen (a³ + 5a durch 6 teilbar; a²ᵇ = (a²)ᵇ; 2⁶ = (2²)³ = 4³)
  j: [
    { text: "2⁶ = 4³", pruefung: { art: "gleich", links: "2^6", rechts: "4^3" } },
    { text: "2⁶ = 6²", pruefung: { art: "gleich", links: "2^6", rechts: "6^2" } },
    { text: "3⁴ = 9²", pruefung: { art: "gleich", links: "3^4", rechts: "9^2" } },
    { text: "2¹⁰ = 10²", pruefung: { art: "gleich", links: "2^10", rechts: "10^2" } },
    { text: "a³ + 5a ist für jede natürliche Zahl a durch 6 teilbar.", pruefung: { art: "teilbar", term: "a^3 + 5a", durch: 6 } },
    { text: "a² + a ist für jede natürliche Zahl a gerade.", pruefung: { art: "gerade", term: "a^2 + a" } },
    { text: "a² + 1 ist für jede natürliche Zahl a ungerade.", pruefung: { art: "ungerade", term: "a^2 + 1" } },
    { text: "(a²)³ = a⁶", pruefung: { art: "gleich", links: "(a^2)^3", rechts: "a^6" } },
    { text: "(a²)³ = a⁵", pruefung: { art: "gleich", links: "(a^2)^3", rechts: "a^5" } },
    { text: "a² · a³ = a⁶", pruefung: { art: "gleich", links: "a^2 a^3", rechts: "a^6" } },
    { text: "a² · a³ = a⁵", pruefung: { art: "gleich", links: "a^2 a^3", rechts: "a^5" } },
    { text: "(a + b)² = a² + b²", pruefung: { art: "gleich", links: "(a + b)^2", rechts: "a^2 + b^2" } },
    { text: "2a + 3a = 5a", pruefung: { art: "gleich", links: "2a + 3a", rechts: "5a" } },
    { text: "2a · 3a = 6a", pruefung: { art: "gleich", links: "2a · 3a", rechts: "6a" } },
  ],
  // k: durch Verallgemeinern begründen (a² − 1 = (a − 1)(a + 1)); Term- und Äquivalenzumformungen prüfen
  k: [
    { text: "a² − 1 = (a − 1)(a + 1)", pruefung: { art: "gleich", links: "a^2 - 1", rechts: "(a - 1)(a + 1)" } },
    { text: "a² − 1 = (a − 1)²", pruefung: { art: "gleich", links: "a^2 - 1", rechts: "(a - 1)^2" } },
    { text: "(a − b)² = a² − 2ab + b²", pruefung: { art: "gleich", links: "(a - b)^2", rechts: "a^2 - 2ab + b^2" } },
    { text: "(a − b)² = a² − b²", pruefung: { art: "gleich", links: "(a - b)^2", rechts: "a^2 - b^2" } },
    { text: "(a + b)(a − b) = a² − b²", pruefung: { art: "gleich", links: "(a + b)(a - b)", rechts: "a^2 - b^2" } },
    { text: "−(a − b) = b − a", pruefung: { art: "gleich", links: "-(a - b)", rechts: "b - a" } },
    { text: "−(a − b) = −a − b", pruefung: { art: "gleich", links: "-(a - b)", rechts: "-a - b" } },
    { text: "3(a + 2) − 2(a + 3) = a", pruefung: { art: "gleich", links: "3(a + 2) - 2(a + 3)", rechts: "a" } },
    { text: "3(a + 2) − 2(a + 3) = a + 12", pruefung: { art: "gleich", links: "3(a + 2) - 2(a + 3)", rechts: "a + 12" } },
    { text: "(n + 1)² − n² = 2n + 1", pruefung: { art: "gleich", links: "(n + 1)^2 - n^2", rechts: "2n + 1" } },
    { text: "(n + 1)² − n² = 1", pruefung: { art: "gleich", links: "(n + 1)^2 - n^2", rechts: "1" } },
    { text: "Das Quadrat einer ungeraden Zahl ist immer ungerade.", pruefung: { art: "ungerade", term: "(2n - 1)^2" } },
    { text: "Das Quadrat einer ungeraden Zahl ist immer durch 4 teilbar.", pruefung: { art: "teilbar", term: "(2n - 1)^2", durch: 4 } },
    { text: "Die Differenz der Quadrate zweier aufeinanderfolgender Zahlen ist immer ungerade.", pruefung: { art: "ungerade", term: "(n + 1)^2 - n^2" } },
  ],
};

if (typeof module !== "undefined") module.exports = AUSSAGEN;
