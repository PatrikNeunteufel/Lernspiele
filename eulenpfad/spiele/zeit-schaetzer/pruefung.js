/* Prüfansicht des Zeit-Schätzers (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Eine Liste „taetigkeiten“ mit drei Inhalten, je für sich abzuhaken: Tätigkeiten mit Dauer (nach Einheit gruppiert),
   Sätze mit Zeitpunkt und Sätze mit Zeitdauer (nach Gruppe klar / knifflig). Zu prüfen: Stimmen die Dauern für den
   Alltag eines Kindes, liegt die typische Dauer in der Spanne, nennt jeder Satz eindeutig einen Zeitpunkt oder eine
   Zeitdauer? */
"use strict";
{
  const EINHEIT = { s: "Sekunden", min: "Minuten", h: "Stunden", d: "Tage", w: "Wochen" };
  const zahl = n => (Number.isInteger(n) ? LS.zahlText(n) : LS.dezimalText(n, 1));
  /** Sekunden lesbar: „0.5 s“, „5 min“, „1 h 30 min“, „2 Tage“, „1 Woche“. */
  function dauer(sek) {
    if (sek < MIN) return `${zahl(sek)} s`;
    if (sek < H) return `${zahl(sek / MIN)} min`;
    if (sek < D) return sek % H ? `${Math.floor(sek / H)} h ${(sek % H) / MIN} min` : `${sek / H} h`;
    if (sek % W) return sek === D ? "1 Tag" : `${zahl(sek / D)} Tage`;
    return sek === W ? "1 Woche" : `${sek / W} Wochen`;
  }
  const GRUPPE = { 1: "klar (ab Stufe 2)", 2: "knifflig (ab Stufe 3)" };
  LS.listenPruefung("zeit-schaetzer", {
    taetigkeiten: {
      beschreibung: "Tätigkeiten mit ungefährer Dauer: länger oder kürzer (Stufe 1), Sekunden, Minuten oder Stunden (2), wie lange ungefähr (3), Zahl und Einheit und ordnen (4), gemischt ordnen (6); dazu Sätze, die einen Zeitpunkt oder eine Zeitdauer nennen (Stufen 2 und 3).",
      abschnitte: [
        { id: "taetigkeit", titel: "Tätigkeiten mit ungefährer Dauer", spalten: ["Bild", "Tätigkeit", "typische Dauer", "Spanne im Alltag"],
          hinweis: "Je Einheit eine Gruppe. Verglichen werden nur Tätigkeiten, deren Spannen sich nicht überlappen; die typische Dauer muss in der Spanne liegen. Tage und Wochen kommen nur beim Vergleichen und Ordnen vor.",
          eintraege: () => ZS_TAETIGKEITEN, gruppe: ([, , , einheit]) => EINHEIT[einheit] || einheit,
          zeile: ([bild, name, n, einheit, von, bis]) => [bild, name, einheit === "d" || einheit === "w" ? dauer(n * (einheit === "d" ? D : W)) : `${zahl(n)} ${einheit}`, von === bis ? `genau ${dauer(von)}` : `${dauer(von)} bis ${dauer(bis)}`] },
        { id: "zeitpunkt", titel: "Sätze mit Zeitpunkt (wann?)", spalten: ["Satz"],
          hinweis: "Je Gruppe eine Gruppe. Der Satz nennt einen Zeitpunkt, keine Dauer.",
          eintraege: () => ZS_ZEITPUNKTE, gruppe: ([g]) => GRUPPE[g] || `Gruppe ${g}`, zeile: ([, satz]) => [satz] },
        { id: "zeitdauer", titel: "Sätze mit Zeitdauer (wie lange?)", spalten: ["Satz"],
          hinweis: "Je Gruppe eine Gruppe. Der Satz nennt eine Dauer, keinen Zeitpunkt („In 5 Minuten geht es los.“ zählt als Dauer).",
          eintraege: () => ZS_DAUERN, gruppe: ([g]) => GRUPPE[g] || `Gruppe ${g}`, zeile: ([, satz]) => [satz] },
      ],
    },
  });
}
