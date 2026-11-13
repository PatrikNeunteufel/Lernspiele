// Inhalte für „Wetter und Jahreszeiten“ (Lehrplan SG NMG.4.4: Wetterphänomene beobachten, den
// Jahreszeiten zuordnen, messen; Wetterbericht). Gemeint ist das Wetter im Schweizer Mittelland.
// Bewusst weggelassen, weil es zu mehr als einer Jahreszeit passt: Nebel (Herbst und Winter),
// Drachen steigen lassen, Erdbeeren, Glace.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).
//
// Inhaltslisten (Entscheid L4 a), einzeln freizugeben. Der Prüfstand steht im Katalog
// (spiele/gemeinsam/katalog.js, Spiel „wetter-jahreszeiten“, Feld listen); Kinder sehen nur Inhalte
// aus freien Listen. Das Thermometer braucht keine Liste (Zahlen).
//   jahreszeiten  WJ_JAHRESZEITEN  Zu welcher Jahreszeit passt das am besten?
//   kleidung      WJ_KLEIDUNG      Was ziehst du bei diesem Wetter an?
//   symbole       WJ_SYMBOLE       Wettersymbole benennen, Wetterbericht lesen
//   fragen        WJ_FRAGEN        Wetterwissen: Nebel, Hagel, Messgeräte, längster Tag
const WJ_LISTEN = ["jahreszeiten", "kleidung", "symbole", "fragen"];

// [ab Stufe, Bild, Beobachtung, Jahreszeit] — Liste jahreszeiten. Stufe 1: Alltag, Stufe 3: Natur genauer.
const WJ_JAHRESZEITEN = [
  [1, "⛄", "Einen Schneemann bauen", "Winter"],
  [1, "🛷", "Schlitteln", "Winter"],
  [1, "⛷️", "Ski fahren im Schnee", "Winter"],
  [1, "🌷", "Die Tulpen blühen", "Frühling"],
  [1, "🌸", "Die Kirschbäume blühen", "Frühling"],
  [1, "🏊", "Im See baden", "Sommer"],
  [1, "🥵", "Es ist sehr heiss", "Sommer"],
  [1, "🍂", "Die Blätter werden bunt und fallen", "Herbst"],
  [1, "🌰", "Kastanien sammeln", "Herbst"],
  [1, "🎃", "Kürbisse ernten", "Herbst"],
  [3, "⛈️", "Am Nachmittag gibt es oft heftige Gewitter", "Sommer"],
  [3, "🍒", "Die Kirschen sind reif", "Sommer"],
  [3, "🌅", "Die Tage sind am längsten", "Sommer"],
  [3, "🐦", "Die Schwalben kommen aus dem Süden zurück", "Frühling"],
  [3, "🌿", "Die Bäume bekommen neue Blätter", "Frühling"],
  [3, "🐸", "Die Frösche wandern zum Weiher", "Frühling"],
  [3, "🐿️", "Die Eichhörnchen verstecken Vorräte", "Herbst"],
  [3, "🍇", "Die Trauben werden geerntet", "Herbst"],
  [3, "🌙", "Die Nächte sind am längsten", "Winter"],
  [3, "🦔", "Der Igel hält Winterschlaf", "Winter"],
  [3, "svg:baumKahl", "Die Laubbäume sind kahl", "Winter"],
];

// [Bild, Wetter, richtig, falsch, falsch] — Liste kleidung; Kleidung als „Bild Name“.
const WJ_KLEIDUNG = [
  ["🌧️", "Es regnet stark.", "☂️ Regenschirm", "🕶️ Sonnenbrille", "🩳 kurze Hosen"],
  ["🌧️", "Es regnet. Du gehst zur Schule.", "🧥 Regenjacke", "🩱 Badekleid", "🩴 Flipflops"],
  ["☀️", "Die Sonne scheint, es ist heiss.", "🧴 Sonnencreme", "🧤 Handschuhe", "🧣 Schal"],
  ["🥵", "Ein heisser Sommertag.", "🩳 kurze Hosen", "🧤 Handschuhe", "🧣 Schal"],
  ["😎", "Du bist lange draussen an der Sonne.", "👒 Sonnenhut", "🧤 Handschuhe", "🧣 Schal"],
  ["🌨️", "Es schneit und ist kalt.", "🧤 Handschuhe", "🩳 kurze Hosen", "🩴 Flipflops"],
  ["🥶", "Es ist eisig kalt.", "🧣 Schal und Mütze", "👕 nur ein T-Shirt", "🩱 Badekleid"],
  ["🌬️", "Es ist windig und kühl.", "🧥 Jacke", "🩱 Badekleid", "🩴 Flipflops"],
];

// [Bild, Name] — Liste symbole (auch für den Wetterbericht)
const WJ_SYMBOLE = [
  ["☀️", "sonnig"], ["⛅", "teilweise bewölkt"], ["☁️", "bedeckt"], ["🌧️", "Regen"],
  ["⛈️", "Gewitter"], ["🌨️", "Schnee"], ["🌫️", "Nebel"], ["🌬️", "Wind"],
];

// [ab Stufe, Bild, Frage, richtig, falsch, falsch, Erklärung] — Liste fragen
const WJ_FRAGEN = [
  [5, "🌫️", "Woraus besteht Nebel?", "aus winzigen Wassertröpfchen", "aus Rauch", "aus Staub", "Nebel ist eine Wolke am Boden: viele winzige Wassertröpfchen in der Luft."],
  [5, "🧊", "Was ist Hagel?", "Körner aus Eis", "grosse Regentropfen", "Schneeflocken", "Hagelkörner sind Eis. Sie entstehen in hohen Gewitterwolken."],
  [5, "⚡", "Warum hört man den Donner erst nach dem Blitz?", "Licht ist schneller als Schall.", "Der Donner ist leiser.", "Der Donner kommt erst am Boden an.", "Das Licht des Blitzes ist fast sofort da, der Schall braucht für einen Kilometer etwa drei Sekunden."],
  [5, "🌈", "Wann kannst du einen Regenbogen sehen?", "wenn die Sonne scheint und es regnet", "wenn es schneit", "in der Nacht", "Die Sonne scheint von hinten auf die Regentropfen vor dir."],
  [5, "🌡️", "Womit misst man die Temperatur?", "mit dem Thermometer", "mit dem Regenmesser", "mit dem Kompass", "Das Thermometer zeigt die Temperatur in Grad Celsius (°C)."],
  [5, "🌧️", "Womit misst man, wie viel es geregnet hat?", "mit dem Regenmesser", "mit dem Thermometer", "mit der Waage", "Im Regenmesser sammelt sich das Wasser. Man liest ab, wie hoch es steht."],
  [5, "🧊", "Bei welcher Temperatur gefriert Wasser zu Eis?", "bei 0 °C", "bei 10 °C", "bei 100 °C", "Unter 0 °C wird Wasser zu Eis, darum ist es dann draussen glatt."],
  [5, "⛈️", "Ein Gewitter kommt. Wo bist du am sichersten?", "in einem Haus", "unter einem einzelnen Baum", "auf einem Hügel", "Blitze schlagen gern in hohe, einzeln stehende Dinge ein. Im Haus bist du geschützt."],
  [6, "☀️", "Warum ist es im Sommer wärmer als im Winter?", "Die Sonne steht höher und scheint länger.", "Die Erde ist dann näher bei der Sonne.", "Im Sommer gibt es mehr Wolken.", "Im Sommer steht die Sonne hoch am Himmel, und die Tage sind lang."],
  [6, "📅", "Wann ist bei uns der längste Tag des Jahres?", "um den 21. Juni", "um den 21. Dezember", "um den 1. Januar", "Um den 21. Juni ist es am längsten hell. Dann beginnt der Sommer."],
  [6, "📅", "Wann ist bei uns der kürzeste Tag des Jahres?", "um den 21. Dezember", "um den 21. Juni", "um den 21. März", "Um den 21. Dezember ist es am kürzesten hell. Dann beginnt der Winter."],
  [6, "🏔️", "Was ist der Föhn?", "ein warmer, trockener Wind von den Bergen herab", "ein kalter Wind vom Meer", "ein Regenwind aus dem Norden", "Beim Föhn fällt die Luft von den Alpen herab und wird dabei warm und trocken."],
  [6, "💧", "Was geschieht mit einer Pfütze, wenn lange die Sonne scheint?", "Das Wasser verdunstet.", "Das Wasser gefriert.", "Das Wasser wird mehr.", "Die Wärme macht aus dem Wasser Wasserdampf. Er steigt in die Luft."],
  [6, "☁️", "Woraus bestehen Wolken?", "aus winzigen Wassertröpfchen oder Eiskristallen", "aus Rauch", "aus Watte", "Wolken sind wie Nebel hoch oben am Himmel."],
];
