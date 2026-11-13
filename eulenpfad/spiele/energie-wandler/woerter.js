/* Geräte und Energieformen für den Energie-Wandler — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG NMG.3.2.d/e (2. Zyklus): Energieformen und Energieumwandlungen; Energiewandler
   (Lehrplan-Beispiel: Generator, Bewegung → elektrische Energie); erneuerbare und nicht erneuerbare
   Energieträger. Schweizer Schreibweise (ss statt ß).

   Inhaltsliste (Entscheid L4 a): eine Liste, Id „geraete“ (Katalog, Eintrag „energie-wandler“).
   Dazu gehören alle drei Teile unten: ENERGIE_GERAETE, ENERGIE_KETTEN (aus diesen Geräten) und
   ENERGIE_FRAGEN (Kraftwerke und Energie in der Schweiz).

   Energieformen (Schlüssel in ENERGIEFORMEN): el = elektrische Energie, bew = Bewegungsenergie,
   waerme = Wärme, licht = Licht, chem = chemische Energie (in Nahrung, Holz, Benzin, Batterie),
   lage = Lageenergie, kern = Kernenergie (nur Kernkraftwerk, nur Stufe 5).

   Je Gerät: name, bild (Emoji oder „svg:…“ aus spiele/gemeinsam/bilder.js, BI1 a), strom (braucht es Strom aus Steckdose oder Batterie? true/false;
   null = Frage passt nicht und kommt in Stufe 1 nicht vor), von (Energieform vorher), zu (Formen
   nachher, die man nutzt), auch (Formen, die auch mitspielen — sie kommen nie als falsche Antwort vor,
   z. B. die Wärme, die fast jedes Gerät nebenbei abgibt), erneuerbar (nur bei Energiequellen),
   kraftwerk (macht Strom für viele), text (Erklärung nach der Antwort). */

const ENERGIEFORMEN = {
  el: { name: "elektrische Energie", bild: "⚡" },
  bew: { name: "Bewegungsenergie", bild: "🏃" },
  waerme: { name: "Wärme", bild: "🔥" },
  licht: { name: "Licht", bild: "🌟" },
  chem: { name: "chemische Energie", bild: "🧪" },
  lage: { name: "Lageenergie", bild: "⛰️" },
  kern: { name: "Kernenergie", bild: "⚛️" },
};

const ENERGIE_GERAETE = [
  // Geräte im Haushalt, mit Strom
  { name: "Föhn", bild: "svg:foehn", strom: true, von: "el", zu: ["waerme", "bew"],
    text: "Im Föhn wird ein Draht heiss, und ein kleiner Motor dreht den Ventilator: Warme Luft strömt hinaus." },
  { name: "Wasserkocher", bild: "🫖", strom: true, von: "el", zu: ["waerme"],
    text: "Eine Heizplatte im Boden wird heiss und erwärmt das Wasser." },
  { name: "Toaster", bild: "🍞", strom: true, von: "el", zu: ["waerme"], auch: ["licht"],
    text: "Die Drähte im Toaster glühen und rösten das Brot." },
  { name: "Bügeleisen", bild: "👔", strom: true, von: "el", zu: ["waerme"],
    text: "Die Platte des Bügeleisens wird heiss und glättet die Kleider." },
  // auch licht: eine Kochplatte kann rot glühen, wie die Drähte im Toaster (LERN_Session38)
  { name: "Elektroherd", bild: "🍳", strom: true, von: "el", zu: ["waerme"], auch: ["licht"],
    text: "Die Kochplatte macht aus elektrischer Energie Wärme zum Kochen." },
  { name: "LED-Lampe", bild: "💡", strom: true, von: "el", zu: ["licht"], auch: ["waerme"],
    text: "Die Lampe macht aus elektrischer Energie Licht. Ein kleiner Teil wird zu Wärme." },
  { name: "Bildschirm", bild: "📺", strom: true, von: "el", zu: ["licht"], auch: ["waerme"],
    text: "Der Bildschirm leuchtet: Aus elektrischer Energie wird Licht, ein wenig auch Wärme." },
  { name: "Taschenlampe", bild: "🔦", strom: true, von: "chem", zu: ["licht"], auch: ["el", "waerme"],
    text: "Die Batterie gibt aus ihrer chemischen Energie Strom ab. Die Lampe macht daraus Licht." },
  { name: "Staubsauger", bild: "svg:staubsauger", strom: true, von: "el", zu: ["bew"], auch: ["waerme"],
    text: "Ein Motor dreht ein Gebläse. Es saugt die Luft mit dem Staub an." },
  { name: "Ventilator", bild: "🌀", strom: true, von: "el", zu: ["bew"], auch: ["waerme"],
    text: "Ein Elektromotor dreht die Flügel und bewegt die Luft." },
  { name: "Mixer", bild: "🥤", strom: true, von: "el", zu: ["bew"], auch: ["waerme"],
    text: "Ein Elektromotor dreht die Messer." },
  { name: "Bohrmaschine", bild: "svg:bohrmaschine", strom: true, von: "el", zu: ["bew"], auch: ["waerme"],
    text: "Ein Elektromotor dreht den Bohrer." },
  { name: "Waschmaschine", bild: "🧺", strom: true, von: "el", zu: ["bew", "waerme"],
    text: "Der Motor dreht die Trommel, und eine Heizung wärmt das Wasser." },
  { name: "Zug der SBB", bild: "🚆", strom: true, von: "el", zu: ["bew"], auch: ["waerme"],
    text: "Die Züge der SBB fahren mit Strom aus der Fahrleitung. Elektromotoren treiben die Räder an." },
  { name: "Lift", bild: "🛗", strom: true, von: "el", zu: ["lage"], auch: ["bew", "waerme"],
    text: "Der Motor zieht die Kabine hoch. Oben hat sie mehr Lageenergie als unten." },
  { name: "Handy beim Laden", bild: "📱", strom: true, von: "el", zu: ["chem"], auch: ["waerme"],
    text: "Beim Laden wird die elektrische Energie im Akku als chemische Energie gespeichert." },

  // ohne Strom
  { name: "Kerze", bild: "🕯️", strom: false, von: "chem", zu: ["licht", "waerme"],
    text: "Das Wachs brennt. Dabei wird seine chemische Energie zu Licht und Wärme." },
  { name: "Holzofen", bild: "🪵", strom: false, von: "chem", zu: ["waerme"], auch: ["licht"], erneuerbar: true,
    text: "Holz brennt und gibt Wärme ab. Holz ist erneuerbar: Im Wald wachsen neue Bäume nach." },
  { name: "Batterie", bild: "🔋", strom: null, von: "chem", zu: ["el"],
    text: "Eine Batterie speichert chemische Energie. Im Stromkreis gibt sie elektrische Energie ab." },
  { name: "Velodynamo", bild: "🚲", strom: false, von: "bew", zu: ["el"], auch: ["waerme"],
    text: "Das Rad dreht den Dynamo. Er ist ein kleiner Generator und macht aus Bewegung Strom für die Velolampe." },
  { name: "Generator", bild: "svg:generator", strom: false, von: "bew", zu: ["el"], auch: ["waerme"],
    text: "Ein Generator macht aus einer Drehbewegung elektrische Energie. In jedem Kraftwerk dreht sich einer." },
  { name: "Velobremse beim Bremsen", bild: "svg:velobremse", strom: false, von: "bew", zu: ["waerme"],
    text: "Die Bremsklötze reiben am Rad. Aus Bewegungsenergie wird Wärme: Die Bremse wird warm." },
  { name: "Kuckucksuhr mit Gewichten", bild: "🕰️", strom: false, von: "lage", zu: ["bew"],
    text: "Die schweren Gewichte sinken langsam nach unten. Ihre Lageenergie treibt das Uhrwerk an." },
  { name: "Solarzelle", bild: "🔆", strom: false, von: "licht", zu: ["el"], auch: ["waerme"], erneuerbar: true, kraftwerk: true,
    text: "Die Solarzelle macht aus Sonnenlicht direkt elektrische Energie." },

  // Vorgänge und Lebewesen
  { name: "Muskeln", bild: "💪", strom: null, von: "chem", zu: ["bew"], auch: ["waerme"],
    text: "Die Muskeln gewinnen aus der Nahrung Energie für die Bewegung. Dabei wird dir auch warm." },
  { name: "Pflanze (Fotosynthese)", bild: "🌱", strom: null, von: "licht", zu: ["chem"],
    text: "Pflanzen speichern Sonnenlicht als chemische Energie in Zucker und Stärke. Darum geben dir Früchte und Brot Energie." },
  { name: "Glühwürmchen", bild: "✨", strom: null, von: "chem", zu: ["licht"],
    text: "Glühwürmchen leuchten mit Hilfe von Stoffen in ihrem Körper. Dabei entsteht fast keine Wärme." },
  { name: "Schlitten am Hang", bild: "🛷", strom: null, von: "lage", zu: ["bew"], auch: ["waerme"],
    text: "Oben am Hang hat der Schlitten Lageenergie. Beim Hinunterfahren wird sie zu Bewegungsenergie." },
  { name: "Hände reiben", bild: "🙌", strom: null, von: "bew", zu: ["waerme"],
    text: "Reibst du die Hände aneinander, wird aus Bewegung Wärme." },
  { name: "Automotor (Benzin)", bild: "🚗", strom: null, von: "chem", zu: ["bew"], auch: ["waerme"], erneuerbar: false,
    text: "Benzin verbrennt im Motor. Ein grosser Teil wird zu Wärme, der Rest bewegt das Auto. Benzin wird aus Erdöl gemacht, und Erdöl wächst nicht nach." },
  { name: "Gasherd (Erdgas)", bild: "🍲", strom: null, von: "chem", zu: ["waerme"], auch: ["licht"], erneuerbar: false,
    text: "Erdgas verbrennt in einer Flamme und gibt Wärme ab. Erdgas wächst nicht nach." },
  { name: "Ölheizung", bild: "🛢️", strom: null, von: "chem", zu: ["waerme"], erneuerbar: false,
    text: "Heizöl verbrennt im Heizkessel und wärmt das Wasser für die Heizung. Erdöl wächst nicht nach." },
  // auch waerme: man sagt auch „Sonnenwärme“ — Wärme ist darum bei „vorher?“ nie eine falsche Antwort (LERN_Session38)
  { name: "Sonnenkollektor", bild: "🌞", strom: null, von: "licht", zu: ["waerme"], auch: ["waerme"], erneuerbar: true,
    text: "Die Sonne erwärmt den Sonnenkollektor auf dem Dach. Er heizt damit Wasser." },

  // Kraftwerke
  { name: "Speicherkraftwerk (Stausee)", bild: "🧱", strom: null, von: "lage", zu: ["el"], auch: ["bew"], erneuerbar: true, kraftwerk: true,
    text: "Das Wasser aus dem hoch gelegenen Stausee schiesst durch Rohre hinunter, dreht die Turbine und den Generator." },
  // auch lage: am Wehr fällt das Wasser ein Stück hinunter — „Lageenergie“ ist darum nie eine falsche Antwort (LERN_Session38)
  { name: "Flusskraftwerk", bild: "🏞️", strom: null, von: "bew", zu: ["el"], auch: ["lage"], erneuerbar: true, kraftwerk: true,
    text: "Das fliessende Wasser des Flusses dreht die Turbine, und der Generator macht daraus Strom." },
  { name: "Windrad", bild: "🌬️", strom: null, von: "bew", zu: ["el"], erneuerbar: true, kraftwerk: true,
    text: "Der Wind dreht die Flügel, und ein Generator macht daraus Strom." },
  { name: "Kernkraftwerk", bild: "🏭", strom: null, von: "kern", zu: ["el"], auch: ["waerme"], erneuerbar: false, kraftwerk: true,
    text: "Im Kernkraftwerk wird Uran gespalten. Die Wärme macht Dampf, der eine Turbine und den Generator dreht. Uran wächst nicht nach." },
  { name: "Biogasanlage", bild: "🐄", strom: null, von: "chem", zu: ["el", "waerme"], erneuerbar: true, kraftwerk: true,
    text: "Aus Gülle und Grünabfällen entsteht Biogas. Ein Motor verbrennt es und treibt einen Generator an: Es gibt Strom und Wärme." },
  { name: "Kehrichtverbrennung", bild: "🗑️", strom: null, von: "chem", zu: ["waerme", "el"], kraftwerk: true,
    text: "Der Abfall wird verbrannt. Mit der Wärme heizt man Häuser, und ein Generator macht Strom." },
  { name: "Pumpspeicherwerk beim Hochpumpen", bild: "💧", strom: null, von: "el", zu: ["lage"], auch: ["bew", "waerme"],
    text: "Ist viel Strom übrig, pumpen Motoren Wasser in einen höher gelegenen See. Dort ist die Energie als Lageenergie gespeichert." },
];

// Ketten: Die Energie geht von einem Wandler zum nächsten (Namen wie oben).
const ENERGIE_KETTEN = [
  { anfang: "Wasser im Stausee", geraete: ["Speicherkraftwerk (Stausee)", "LED-Lampe"] },
  { anfang: "Sonne", geraete: ["Solarzelle", "Wasserkocher"] },
  { anfang: "Sonne", geraete: ["Solarzelle", "Zug der SBB"] },
  { anfang: "Sonne", geraete: ["Solarzelle", "Handy beim Laden"] },
  { anfang: "Wind", geraete: ["Windrad", "Staubsauger"] },
  { anfang: "Wind", geraete: ["Windrad", "Lift"] },
  { anfang: "Fluss", geraete: ["Flusskraftwerk", "Föhn"] },
  { anfang: "Wasser im Stausee", geraete: ["Speicherkraftwerk (Stausee)", "Elektroherd"] },
  { anfang: "In der Taschenlampe", geraete: ["Batterie", "LED-Lampe"] },
  { anfang: "Sonne", geraete: ["Pflanze (Fotosynthese)", "Muskeln"] },
  { anfang: "Sonne", geraete: ["Pflanze (Fotosynthese)", "Holzofen"] },
  { anfang: "Znüni", geraete: ["Muskeln", "Velobremse beim Bremsen"] },
  { anfang: "Znüni", geraete: ["Muskeln", "Velodynamo", "LED-Lampe"] },
  { anfang: "Sonne", geraete: ["Pflanze (Fotosynthese)", "Muskeln", "Velodynamo", "LED-Lampe"] },
  { anfang: "Wind", geraete: ["Windrad", "Pumpspeicherwerk beim Hochpumpen", "Speicherkraftwerk (Stausee)", "LED-Lampe"] },
  { anfang: "Uran", geraete: ["Kernkraftwerk", "Lift"], ab: 5 },
];

// Fragen zu Kraftwerken und Energie in der Schweiz: [Frage, richtig, falsch, falsch, Erklärung]
const ENERGIE_FRAGEN = [
  ["Woher kommt in der Schweiz der grösste Teil des Stroms?", "aus Wasserkraftwerken", "aus Windrädern", "aus Kohlekraftwerken",
    "Die Schweiz hat viele Berge, Flüsse und Stauseen. Mehr als die Hälfte des Stroms kommt aus Wasserkraft."],
  ["Wo liegen in der Schweiz die meisten Stauseen?", "in den Alpen", "im Mittelland", "im Jura",
    "Hoch oben in den Alpen staut man das Wasser hinter grossen Mauern."],
  ["Warum baut man Stauseen hoch oben in den Bergen?", "Das Wasser hat dort viel Lageenergie.", "Dort ist das Wasser wärmer.", "Dort regnet es nie.",
    "Je höher der See, desto mehr Lageenergie hat das Wasser. Es fällt tief hinunter zum Kraftwerk."],
  ["Was macht ein Pumpspeicherwerk, wenn viel Strom übrig ist?", "Es pumpt Wasser in einen höher gelegenen See.", "Es lässt den Stausee auslaufen.", "Es schaltet alle Lampen ein.",
    "So wird die Energie als Lageenergie gespeichert. Braucht man mehr Strom, lässt man das Wasser wieder hinunterfliessen."],
  ["Warum liefern Solarzellen im Winter weniger Strom als im Sommer?", "Die Tage sind kürzer, und die Sonne steht tiefer.", "Die Solarzellen frieren ein.", "Im Winter gibt es keine Sonne.",
    "Im Winter scheint die Sonne weniger lang und flacher. Liegt Schnee auf den Zellen, kommt gar kein Licht hin."],
  ["Was ist ein Problem von Erdöl, Erdgas und Kohle?", "Sie wachsen nicht nach, und beim Verbrennen entsteht viel Kohlendioxid.", "Sie sind zu schwer zum Transportieren.", "Sie brennen nicht.",
    "Erdöl, Erdgas und Kohle gehen irgendwann aus. Das Kohlendioxid aus der Verbrennung erwärmt das Klima."],
  ["Was heisst „erneuerbare Energie“?", "Die Energiequelle wächst nach oder geht nicht aus.", "Die Energie ist ganz neu erfunden.", "Die Energie kostet nichts.",
    "Sonne, Wind, Wasser und Holz sind erneuerbar: Die Sonne scheint wieder, der Wind weht wieder, Bäume wachsen nach."],
  ["Was dreht sich in fast jedem Kraftwerk und macht den Strom?", "ein Generator", "eine Batterie", "eine Solarzelle",
    "Wasser, Wind oder Dampf drehen eine Turbine. Sie treibt den Generator an, und er macht aus der Bewegung Strom."],
];
