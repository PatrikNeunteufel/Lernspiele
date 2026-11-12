/* Prüfansicht der Schätz-Waage (LP5 a, LERN_Session36; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Liste ein Abschnitt: Vergleiche nach Eigenschaft, Reihen nach Richtung und Länge, Schätzfragen nach Stufe. Die
   Schätzfragen gehören zur Liste der Einheit ihrer richtigen Antwort — dieselbe Zuordnung wie im Spiel (frageListe).
   Zu prüfen: Ist der Vergleich für jedes Kind eindeutig, stimmt die Reihenfolge, liegt die richtige Antwort nahe am
   echten Wert und die falschen weit genug daneben (mindestens das Zehnfache)? */
"use strict";
{
  const ding = ([bild, name]) => `${bild} ${name}`;
  const schaetzAbschnitt = (liste, titel) => ({
    id: liste, titel, spalten: ["Stufe", "Frage", "richtig", "falsch", "falsch"],
    hinweis: "Je Stufe eine Gruppe. Die richtige Antwort ist ein ungefährer Wert; die falschen liegen mindestens um das Zehnfache daneben, damit beim Schätzen genau eine sinnvoll ist.",
    eintraege: () => SCHAETZFRAGEN.filter(f => frageListe(f) === liste),
    gruppe: ([stufe]) => `Stufe ${stufe}`, zeile: f => f,
  });
  LS.listenPruefung("schaetz-waage", {
    vergleiche: {
      beschreibung: "Paare zum Vergleichen (Stufe 1, in Stufe 2 dazwischen): Das Kind tippt das Ding, das schwerer, länger oder grösser ist.",
      abschnitte: [{
        id: "vergleich", titel: "Vergleichen", spalten: ["Eigenschaft", "grösser", "kleiner"],
        hinweis: "Je Eigenschaft eine Gruppe. Jedes Kind soll ohne Zweifel sagen können, welches Ding mehr davon hat.",
        eintraege: () => VERGLEICHE, gruppe: ([eigenschaft]) => eigenschaft, zeile: ([e, a, b]) => [e, ding(a), ding(b)],
      }],
    },
    reihen: {
      beschreibung: "Reihen zum Ordnen vom kleinsten zum grössten: drei Dinge in Stufe 2, vier Dinge in Stufe 4.",
      abschnitte: [{
        id: "reihe", titel: "Ordnen", spalten: ["Richtung", "Reihe"],
        hinweis: "Je Länge der Reihe eine Gruppe. Jeder Schritt der Reihe muss klar sein — kein Paar, bei dem man zögert.",
        eintraege: () => REIHEN, gruppe: ([, dinge]) => `${dinge.length} Dinge (Stufe ${dinge.length === 3 ? 2 : 4})`,
        zeile: ([r, dinge]) => [r, dinge.map(ding).join(" → ")],
      }],
    },
    laenge: { beschreibung: "Schätzfragen zur Länge (Stufen 3, 4 cm und m; Stufe 6 km und mm): Das Kind wählt den passenden Wert.", abschnitte: [schaetzAbschnitt("laenge", "Länge (mm, cm, m, km)")] },
    gewicht: { beschreibung: "Schätzfragen zum Gewicht (Stufe 5 g und kg; Stufe 6 t).", abschnitte: [schaetzAbschnitt("gewicht", "Gewicht (g, kg, t)")] },
    hohlmass: { beschreibung: "Schätzfragen zum Hohlmass (Stufe 5 dl und l; Stufe 6 ml).", abschnitte: [schaetzAbschnitt("hohlmass", "Hohlmass (ml, dl, l)")] },
    zeit: { beschreibung: "Schätzfragen zur Zeit (Stufe 6: s, min, h).", abschnitte: [schaetzAbschnitt("zeit", "Zeit (s, min, h)")] },
  });
}
