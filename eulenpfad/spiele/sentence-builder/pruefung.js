/* Prüfansicht des Sentence-Builders (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Liste (SATZ_LISTEN in saetze.js) ein Abschnitt mit den Sätzen aus SAETZE, so wie sie dort stehen. Die Karten
   zerlegt das Spiel selbst (woerterVon), die falsche Karte rechnet es mit verwechsler aus VERWECHSLER — beides zeigt
   die Ansicht mit diesen Funktionen, so wie das Kind die Karten sieht. Die Spalte „Stufen“ liest die Stufentabelle
   STUFE des Spiels mit seiner Bedingung inStufe (Listen, höchste und kleinste Wortzahl, falsche Karte) — dieselbe, die
   vorrat nimmt, dort zusätzlich mit der Freigabe.
   Zu prüfen: Ist der Satz grammatisch richtig, natürlich und britisches Englisch, stimmt die deutsche Bedeutung, und
   lassen sich die Karten nur in einer Reihenfolge richtig legen? Die falsche Karte darf den Satz nicht auch richtig
   machen. */
"use strict";
{
  const NR = { s1: 1, s2: 2, s3: 3, s4: 4, s5: 5, s6: 6 };
  // inStufe ist die Bedingung des Spiels (dieselbe nimmt vorrat, dort zusätzlich mit der Freigabe)
  const stufenVon = e => Object.keys(STUFE).filter(s => inStufe(e, s));
  const stufenText = e => stufenVon(e).map(s => NR[s]).join(", ") || "— (in keiner Stufe)";
  /** Falsche Karte nur, wo eine Stufe mit falscher Karte den Satz nimmt. */
  const falscheKarte = e => (stufenVon(e).some(s => STUFE[s].verwechsler) ? verwechsler(woerterVon(e[0])) : "—");
  const spalten = ["Satz (englisch)", "Deutsch", "Karten", "Falsche Karte", "Stufen"];
  const zeile = e => [e[0], e[1], woerterVon(e[0]).join(" · "), falscheKarte(e), stufenText(e)];
  /** Listen, die eine Stufe nimmt, als Text „1, 2, 3“ — gelesen aus STUFE. */
  const stufenDerListe = liste => Object.keys(STUFE).filter(s => STUFE[s].listen.includes(liste)).map(s => NR[s]).join(", ");
  const HINWEIS = "Das Kind sieht den deutschen Satz und tippt die englischen Karten der Reihe nach an. "
    + "Grammatisch richtig, natürlich, britisches Englisch (have got)? Stimmt die deutsche Bedeutung? "
    + "Gibt es eine zweite richtige Reihenfolge der Karten (grosser Anfang und Satzzeichen legen erstes und letztes Wort fest)? "
    + "Die falsche Karte (Stufen 4 und 6) muss im Satz falsch sein.";
  const abschnitt = (liste, titel, gruppe, extra = "") => ({
    id: liste, titel, spalten, hinweis: HINWEIS + extra,
    eintraege: () => SAETZE.filter(e => e[2] === liste), zeile, ...(gruppe ? { gruppe } : {}),
  });
  /** Untergruppen: Satzmuster aus den ersten Wörtern, Fragewort, Verneinungswort. */
  const muster = e => { const w = woerterVon(e[0]); return w[1] === "have" ? "I have got …" : `${w[0]} ${w[1]} …`; };
  const fragewort = e => `${woerterVon(e[0])[0]} …?`;
  const verneinung = e => woerterVon(e[0]).map(w => w.replace(/[.?!]$/, "")).find(w => /n't$|^not$/.test(w)) || "?";
  LS.listenPruefung("sentence-builder", {
    "ich-saetze": {
      beschreibung: `Sätze mit I like …, I have got …, I can …, I am … (Stufen ${stufenDerListe("ich-saetze")}). Stufe 1 nur Sätze mit höchstens drei Karten, Stufen 2 und 3 alle, Stufe 6 Sätze ab vier Karten mit einer falschen Karte dazu.`,
      abschnitte: [abschnitt("ich-saetze", "Ich-Sätze", muster, " Je Satzmuster eine Gruppe.")],
    },
    "er-sie-saetze": {
      beschreibung: `Sätze in der 3. Person: She has got …, He likes …, Tom is … (Stufen ${stufenDerListe("er-sie-saetze")}). Stufe 3 alle Sätze, Stufe 4 Sätze, zu denen es eine falsche Form gibt (has statt have, likes statt like), mit dieser als überzähliger Karte; Stufe 6 ebenso, ab vier Karten.`,
      abschnitte: [abschnitt("er-sie-saetze", "Sätze in der 3. Person", null, " Sätze mit can haben keine falsche Form und fehlen in den Stufen 4 und 6.")],
    },
    "fragen": {
      beschreibung: `Fragesätze: Do you …? Have you got …? Can you …? What …? (Stufen ${stufenDerListe("fragen")}). Stufe 5 alle, Stufe 6 Fragen ab vier Karten mit einer falschen Karte dazu.`,
      abschnitte: [abschnitt("fragen", "Fragesätze", fragewort, " Je Fragewort eine Gruppe.")],
    },
    "verneinung": {
      beschreibung: `Verneinte Sätze: I don't …, She doesn't …, It isn't … (Stufen ${stufenDerListe("verneinung")}). Stufe 5 alle, Stufe 6 Sätze ab vier Karten mit einer falschen Karte dazu.`,
      abschnitte: [abschnitt("verneinung", "Verneinung", verneinung, " Je Verneinungswort eine Gruppe.")],
    },
  });
}
