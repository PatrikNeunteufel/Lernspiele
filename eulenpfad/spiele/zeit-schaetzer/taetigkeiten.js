/* Tätigkeiten und Sätze für den Zeit-Schätzer — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan MA.3.A.1.e (2. Zyklus): Begriffe Zeitpunkt, Zeitdauer, Sekunde verstehen und verwenden,
   Referenzgrössen 1 h, 1 min; NMG.9.1.e: Zeitdauer von Handlungen schätzen und messen;
   NMG.9.1.c (1. Zyklus): Zeitdauer erleben und schätzen. Alle Dauern sind Schätzwerte aus dem
   Alltag eines Kindes, keine Messwerte; sie sollen plausibel und kindgerecht sein. Alles selbst
   geschrieben. Schweizer Schreibweise (ss). Uhrzeiten ohne führende Null („8:10“).

   Schreibweise je Tätigkeit: [Bild, Name, Zahl, Einheit, kürzeste, längste]
   - Name: kurz (1–3 Wörter), wie das Kind es sagt („Zähne putzen“, „eine Nacht schlafen“); steht
     auf grossen Bild-Knöpfen (Stufe 1) und in der Frage „Wie lange dauert … ungefähr?“.
   - Zahl und Einheit: die typische Dauer, die das Spiel als richtige Antwort nimmt
     (Einheit s Sekunden, min Minuten, h Stunden, d Tage, w Wochen).
   - kürzeste, längste: die Spanne in Sekunden, in der die Dauer im Alltag liegt. Verglichen und
     geordnet werden nur Tätigkeiten, deren Spannen sich nicht überlappen und die sich mindestens um
     den Faktor 3 unterscheiden (pruefeAufgabe); in Stufe 1 um den Faktor 30. Die typische Dauer
     muss in der Spanne liegen.
   Für „Sekunden, Minuten oder Stunden?“ und „Wie lange ungefähr?“ zählen nur Einheiten s, min, h;
   Tage und Wochen kommen beim Vergleichen und Ordnen vor.

   Sätze: [Gruppe, Satz] — Gruppe 1 klar (Stufe 2), Gruppe 2 knifflig (ab Stufe 3): ohne Ziffern,
   mit „in“, „seit“, „noch“, „lang“, Viertelstunde, halbe Stunde.
   Inhaltsliste im Katalog (spiele/gemeinsam/katalog.js, Eintrag zeit-schaetzer, Feld listen):
   „taetigkeiten“ — Tätigkeiten und beide Satzlisten gehören zu dieser einen Liste. */

const MIN = 60, H = 3600, D = 24 * 3600, W = 7 * 24 * 3600;

const ZS_TAETIGKEITEN = [
  // ---------- Sekunden ----------
  ["🤧", "einmal niesen", 1, "s", 0.5, 2],
  ["💡", "das Licht anmachen", 1, "s", 0.5, 2],
  ["🚪", "eine Tür öffnen", 2, "s", 1, 4],
  ["🫧", "einmal tief atmen", 3, "s", 2, 6],
  ["🐸", "zehnmal hüpfen", 10, "s", 5, 20],
  ["🔥", "ein Streichholz brennt", 10, "s", 5, 20],
  ["🎈", "einen Ballon aufblasen", 20, "s", 10, 40],
  ["👟", "die Schuhe binden", 20, "s", 10, 40],
  ["🏃", "100 Meter rennen", 20, "s", 15, 40],
  ["🧦", "Socken anziehen", 20, "s", 10, 40],
  ["🚦", "an der Ampel warten", 1, "min", 30, 2 * MIN],

  // ---------- Minuten ----------
  ["🪥", "Zähne putzen", 3, "min", 2 * MIN, 4 * MIN],
  ["🎵", "ein Lied hören", 3, "min", 2 * MIN, 5 * MIN],
  ["🥚", "ein Ei kochen", 5, "min", 4 * MIN, 10 * MIN],
  ["🚿", "duschen", 5, "min", 3 * MIN, 10 * MIN],
  ["🥪", "ein Sandwich essen", 5, "min", 3 * MIN, 10 * MIN],
  ["🌧️", "ein Regenschauer", 10, "min", 5 * MIN, 30 * MIN],
  ["📖", "ein Bilderbuch lesen", 10, "min", 5 * MIN, 20 * MIN],
  ["🚶", "der Schulweg", 15, "min", 5 * MIN, 30 * MIN],
  ["🍳", "Frühstück essen", 15, "min", 10 * MIN, 25 * MIN],
  ["🍕", "eine Pizza backen", 15, "min", 10 * MIN, 20 * MIN],
  ["☕", "die grosse Pause", 20, "min", 15 * MIN, 30 * MIN],
  ["🎹", "Klavier üben", 20, "min", 15 * MIN, 30 * MIN],
  ["🛁", "baden", 20, "min", 15 * MIN, 40 * MIN],
  ["🍽️", "Mittagessen", 30, "min", 20 * MIN, 45 * MIN],
  ["🦷", "beim Zahnarzt", 30, "min", 20 * MIN, 45 * MIN],
  ["🏫", "eine Schullektion", 45, "min", 40 * MIN, 50 * MIN],
  ["🧁", "einen Kuchen backen", 45, "min", 30 * MIN, 60 * MIN],
  ["⚽", "ein Fussballspiel", 90, "min", 80 * MIN, 120 * MIN],

  // ---------- Stunden ----------
  ["🏊", "das Schwimmtraining", 1, "h", 45 * MIN, 90 * MIN],
  ["🧱", "eine Lego-Burg bauen", 1, "h", 30 * MIN, 2 * H],
  ["🎬", "ein Kinofilm", 2, "h", 90 * MIN, 3 * H],
  ["🧊", "Eiswürfel gefrieren", 2, "h", 1 * H, 4 * H],
  ["🥾", "eine Wanderung", 3, "h", 2 * H, 5 * H],
  ["🎂", "ein Geburtstagsfest", 3, "h", 2 * H, 4 * H],
  ["📚", "ein Schulmorgen", 4, "h", 3 * H, 5 * H],
  ["🚗", "die Autofahrt in die Ferien", 5, "h", 3 * H, 8 * H],
  ["😴", "eine Nacht schlafen", 10, "h", 8 * H, 12 * H],

  // ---------- Tage und Wochen (nur Vergleichen und Ordnen) ----------
  ["🎉", "ein Wochenende", 2, "d", 2 * D, 2 * D],
  ["🏕️", "das Klassenlager", 5, "d", 4 * D, 7 * D],
  ["🌱", "bis ein Samen keimt", 1, "w", 5 * D, 14 * D],
  ["🎄", "die Weihnachtsferien", 2, "w", 2 * W, 2 * W],
  ["🏖️", "die Sommerferien", 5, "w", 4 * W, 6 * W],
];

/** Sätze, die einen Zeitpunkt nennen (wann?). */
const ZS_ZEITPUNKTE = [
  [1, "Die Schule beginnt um 8:00."],
  [1, "Der Zug fährt um 9:15 ab."],
  [1, "Wir essen um 18:30 zu Abend."],
  [1, "Das Training beginnt um 16:00."],
  [1, "Am Samstag ist mein Geburtstag."],
  [1, "Der Film beginnt um 20:15."],
  [1, "Ich gehe um 20:00 ins Bett."],
  [1, "Der Bus kommt um 7:42."],
  [1, "Am 1. August feiern wir."],
  [1, "Die Pause beginnt um 10:00."],
  [1, "Um 15:30 hole ich dich ab."],
  [1, "Der Wecker klingelt um 6:45."],
  [2, "Um 12:00 läutet es."],
  [2, "Wir treffen uns um Viertel vor drei."],
  [2, "Das Konzert fängt um halb acht an."],
  [2, "Mitternacht ist um 0:00."],
  [2, "Heute Abend um sieben schauen wir den Film."],
  [2, "Im Juli beginnen die Sommerferien."],
  [2, "Morgen früh um 7:00 fahren wir los."],
  [2, "Punkt zwölf gibt es Mittagessen."],
];

/** Sätze, die eine Zeitdauer nennen (wie lange?). */
const ZS_DAUERN = [
  [1, "Die Pause dauert 20 Minuten."],
  [1, "Der Film dauert 2 Stunden."],
  [1, "Ich schlafe 10 Stunden."],
  [1, "Die Fahrt dauert 45 Minuten."],
  [1, "Das Spiel dauert 90 Minuten."],
  [1, "Wir warten 5 Minuten."],
  [1, "Die Ferien dauern 2 Wochen."],
  [1, "Ein Niesen dauert 1 Sekunde."],
  [1, "Zähne putzen dauert 3 Minuten."],
  [1, "Das Lager dauert 5 Tage."],
  [1, "Die Lektion dauert 45 Minuten."],
  [1, "Der Schulweg dauert 15 Minuten."],
  [2, "In 5 Minuten geht es los."],
  [2, "Seit 3 Stunden regnet es."],
  [2, "Noch 2 Tage bis zum Fest."],
  [2, "Wir brauchen eine halbe Stunde bis zum See."],
  [2, "Das Ei kocht 5 Minuten lang."],
  [2, "Eine Viertelstunde später sind wir da."],
  [2, "Der Kuchen muss 45 Minuten in den Ofen."],
  [2, "Noch 10 Sekunden, dann ist das Rennen fertig."],
];
