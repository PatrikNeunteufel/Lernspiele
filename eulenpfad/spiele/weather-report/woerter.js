/* Weather-Report: kurze englische Durchsagen — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS1E.1.A.1.c (Englisch, Hörverstehen): kurze, einfache Texte und Durchsagen verstehen;
   Beispiele im Lehrplan: Wettervorhersage, Sportresultat, Wegbeschreibung.
   Britisches Englisch, selbst geschrieben. Gehört wird über die Stimme des Geräts (en-GB bevorzugt).
   Die Mannschaften sind erfundene Schulteams. Temperaturen in Grad Celsius.

   Inhaltsliste (Entscheid L4 a): alles in dieser Datei gehört zur Liste „durchsagen“ (Katalog,
   Spiel „weather-report“, Feld listen).

   WR_WETTER:   Wetterwort → [Bild, deutsch] — die Wetterbilder der Antworten.
   WR_WOERTER:  Wörter für Stufe 1 (4. Klasse): [englisch, Wetterwort].
   WR_TEAMS:    Team → Bild.
   WR_ORTE:     englischer Ortsname / Zeitangabe → deutsch (für die Frage auf Deutsch).
   WR_GEBAEUDE: [englisch, Bild] — die Häuser auf dem Plan (Stufe 5), je Aufgabe neu verteilt.
   WR_DURCHSAGEN: { id, art, text, … }
     art "wetter": angaben [{ wann | wo, wetter, grad? }], futur: Vorhersage (will be); eine Angabe = Stufe 2,
                   zwei = Stufe 3, drei und mehr = Königsstufe.
     art "sport":  spiele [{ sport, teams: [A, B], tore: [a, b] }] — Stufe 4.
     art "weg":    Wegbeschreibung auf dem Plan, ziel: „1L-r“ = erste Strasse links, Haus rechts;
                   „ende“ = am Ende der Strasse. Das Spiel liest den Weg selbst aus dem Text und
                   vergleicht mit ziel. Erlaubte Sätze: siehe WEG_SAETZE im Spiel.
     art "lang":   längere Durchsage mit Wetter und/oder Sport (Königsstufe), zwei Fragen. */

const WR_LISTEN = ["durchsagen"];

const WR_WETTER = {
  sunny: ["☀️", "sonnig"], cloudy: ["☁️", "bewölkt"], rainy: ["🌧️", "Regen"], windy: ["🌬️", "windig"],
  snowy: ["🌨️", "Schnee"], foggy: ["🌫️", "Nebel"], stormy: ["⛈️", "Sturm"], hot: ["🥵", "heiss"], cold: ["🥶", "kalt"],
};

const WR_WOERTER = [
  ["sunny", "sunny"], ["cloudy", "cloudy"], ["rainy", "rainy"], ["windy", "windy"], ["snowy", "snowy"],
  ["foggy", "foggy"], ["stormy", "stormy"], ["hot", "hot"], ["cold", "cold"],
  ["It’s sunny.", "sunny"], ["It’s cloudy.", "cloudy"], ["It’s rainy.", "rainy"], ["It’s windy.", "windy"],
  ["It’s snowy.", "snowy"], ["It’s foggy.", "foggy"], ["It’s stormy.", "stormy"], ["It’s hot.", "hot"], ["It’s cold.", "cold"],
];

const WR_TEAMS = { Lions: "🦁", Tigers: "🐯", Bears: "🐻", Wolves: "🐺", Eagles: "🦅", Sharks: "🦈", Foxes: "🦊" };

const WR_ORTE = {
  today: "heute", tomorrow: "morgen", tonight: "heute Abend",
  "on Friday": "am Freitag", "on Saturday": "am Samstag", "on Sunday": "am Sonntag",
  "in the morning": "am Morgen", "in the afternoon": "am Nachmittag",
  Bern: "Bern", Basel: "Basel", Zurich: "Zürich", Geneva: "Genf", Lucerne: "Luzern", Lugano: "Lugano", Davos: "Davos",
  "the mountains": "den Bergen",
};

const WR_GEBAEUDE = [
  ["school", "🏫"], ["hospital", "🏥"], ["museum", "🏛️"], ["cinema", "🎬"], ["post office", "📮"], ["bank", "🏦"],
  ["supermarket", "🛒"], ["swimming pool", "🏊"], ["library", "📚"], ["bakery", "🥐"], ["café", "☕"], ["station", "🚉"],
];

const WR_DURCHSAGEN = [
  // ---- Stufe 2: ein Wetter ----
  { id: "w1", art: "wetter", futur: true, text: "Good morning! Here is the weather for today. It will be sunny all day. It will be warm, about twenty-four degrees.",
    angaben: [{ wann: "today", wetter: "sunny", grad: 24 }] },
  { id: "w2", art: "wetter", text: "Hello! Today it is rainy. Don’t forget your umbrella! It is cool, about twelve degrees.",
    angaben: [{ wann: "today", wetter: "rainy", grad: 12 }] },
  { id: "w3", art: "wetter", text: "Good morning, everyone. Today it is cloudy. The temperature is fifteen degrees.",
    angaben: [{ wann: "today", wetter: "cloudy", grad: 15 }] },
  { id: "w4", art: "wetter", text: "Here is the weather. Today it is very windy. Hold on to your hat! It is ten degrees.",
    angaben: [{ wann: "today", wetter: "windy", grad: 10 }] },
  { id: "w5", art: "wetter", futur: true, text: "Good morning! It will snow all day today. It is very cold, minus three degrees.",
    angaben: [{ wann: "today", wetter: "snowy", grad: -3 }] },
  { id: "w6", art: "wetter", futur: true, text: "Hello, here is the weather. It will be foggy all day today. It is eight degrees.",
    angaben: [{ wann: "today", wetter: "foggy", grad: 8 }] },
  { id: "w7", art: "wetter", futur: true, text: "Good afternoon! Today there will be storms, with thunder and lightning. Please stay inside. It is twenty-six degrees.",
    angaben: [{ wann: "today", wetter: "stormy", grad: 26 }] },
  { id: "w8", art: "wetter", futur: true, text: "Good morning! It’s a lovely day today. It will be sunny and hot: thirty degrees!",
    angaben: [{ wann: "today", wetter: "sunny", grad: 30 }] },
  { id: "w9", art: "wetter", futur: true, text: "Here is the weather. On Saturday it will be rainy all day. It will be cold, only nine degrees.",
    angaben: [{ wann: "on Saturday", wetter: "rainy", grad: 9 }] },
  { id: "w10", art: "wetter", text: "Good morning! Today it is cloudy and grey. It is fourteen degrees.",
    angaben: [{ wann: "today", wetter: "cloudy", grad: 14 }] },
  { id: "w11", art: "wetter", text: "Hello! Today is a windy day. It is good weather for flying a kite. It is thirteen degrees.",
    angaben: [{ wann: "today", wetter: "windy", grad: 13 }] },
  { id: "w12", art: "wetter", futur: true, text: "Good evening! Tomorrow it will be sunny and warm. The temperature will be twenty-one degrees.",
    angaben: [{ wann: "tomorrow", wetter: "sunny", grad: 21 }] },
  { id: "w13", art: "wetter", text: "Good morning! Today there is lots of snow. It’s a great day for sledging! It is minus five degrees.",
    angaben: [{ wann: "today", wetter: "snowy", grad: -5 }] },

  // ---- Stufe 3: zwei Tage oder zwei Orte ----
  { id: "d1", art: "wetter", text: "Good morning! Today it is rainy and eleven degrees. But tomorrow it will be sunny and eighteen degrees.",
    angaben: [{ wann: "today", wetter: "rainy", grad: 11 }, { wann: "tomorrow", wetter: "sunny", grad: 18, futur: true }] },
  { id: "d2", art: "wetter", futur: true, text: "Here is the weather for the weekend. On Saturday it will be cloudy, fifteen degrees. On Sunday it will be sunny and warm, twenty-two degrees.",
    angaben: [{ wann: "on Saturday", wetter: "cloudy", grad: 15 }, { wann: "on Sunday", wetter: "sunny", grad: 22 }] },
  { id: "d3", art: "wetter", text: "Good morning! In Geneva it is sunny and twenty degrees. In Zurich it is foggy and only twelve degrees.",
    angaben: [{ wo: "Geneva", wetter: "sunny", grad: 20 }, { wo: "Zurich", wetter: "foggy", grad: 12 }] },
  { id: "d4", art: "wetter", text: "Hello! In Lugano it is sunny and hot, thirty degrees. In Basel there is a storm, with thunder. It is twenty-four degrees there.",
    angaben: [{ wo: "Lugano", wetter: "sunny", grad: 30 }, { wo: "Basel", wetter: "stormy", grad: 24 }] },
  { id: "d5", art: "wetter", futur: true, text: "Good evening. Tomorrow it will snow in Davos, minus four degrees. In Bern it will be rainy and three degrees.",
    angaben: [{ wo: "Davos", wetter: "snowy", grad: -4 }, { wo: "Bern", wetter: "rainy", grad: 3 }] },
  { id: "d6", art: "wetter", text: "Here is the weather. Today it is windy, but it is not cold: sixteen degrees. Tomorrow it will be rainy and thirteen degrees.",
    angaben: [{ wann: "today", wetter: "windy", grad: 16 }, { wann: "tomorrow", wetter: "rainy", grad: 13, futur: true }] },
  { id: "d7", art: "wetter", text: "Good morning! In Lucerne it is cloudy, fourteen degrees. In Lugano it is sunny, nineteen degrees.",
    angaben: [{ wo: "Lucerne", wetter: "cloudy", grad: 14 }, { wo: "Lugano", wetter: "sunny", grad: 19 }] },
  { id: "d8", art: "wetter", futur: true, text: "Hello! On Saturday it will snow. On Sunday it will be sunny, but cold: minus one degree.",
    angaben: [{ wann: "on Saturday", wetter: "snowy" }, { wann: "on Sunday", wetter: "sunny", grad: -1 }] },
  { id: "d9", art: "wetter", text: "Good morning! Today it is foggy in the morning and cloudy in the afternoon.",
    angaben: [{ wann: "in the morning", wetter: "foggy" }, { wann: "in the afternoon", wetter: "cloudy" }] },
  { id: "d10", art: "wetter", futur: true, text: "Here is the weather for tomorrow. In Basel it will be windy, seventeen degrees. In Geneva there will be storms, twenty-five degrees.",
    angaben: [{ wo: "Basel", wetter: "windy", grad: 17 }, { wo: "Geneva", wetter: "stormy", grad: 25 }] },
  { id: "d11", art: "wetter", text: "Good morning! Today it is sunny in Bern, twenty-three degrees. In Zurich it is rainy, seventeen degrees.",
    angaben: [{ wo: "Bern", wetter: "sunny", grad: 23 }, { wo: "Zurich", wetter: "rainy", grad: 17 }] },
  { id: "d12", art: "wetter", text: "Hello! Today it is snowy, minus two degrees. Tomorrow it will be cloudy, two degrees.",
    angaben: [{ wann: "today", wetter: "snowy", grad: -2 }, { wann: "tomorrow", wetter: "cloudy", grad: 2, futur: true }] },

  // ---- Stufe 4: Sportresultate ----
  { id: "s1", art: "sport", text: "And now the football results. Lions three, Tigers one.",
    spiele: [{ sport: "football", teams: ["Lions", "Tigers"], tore: [3, 1] }] },
  { id: "s2", art: "sport", text: "Here are the football results. Eagles nil, Sharks two.",
    spiele: [{ sport: "football", teams: ["Eagles", "Sharks"], tore: [0, 2] }] },
  { id: "s3", art: "sport", text: "Ice hockey: Bears four, Wolves five. What a game!",
    spiele: [{ sport: "ice hockey", teams: ["Bears", "Wolves"], tore: [4, 5] }] },
  { id: "s4", art: "sport", text: "Football: Foxes two, Lions two. It was a draw.",
    spiele: [{ sport: "football", teams: ["Foxes", "Lions"], tore: [2, 2] }] },
  { id: "s5", art: "sport", text: "In the school football match, the Tigers beat the Eagles four to one.",
    spiele: [{ sport: "football", teams: ["Tigers", "Eagles"], tore: [4, 1] }] },
  { id: "s6", art: "sport", text: "Ice hockey: Sharks six, Bears three.",
    spiele: [{ sport: "ice hockey", teams: ["Sharks", "Bears"], tore: [6, 3] }] },
  { id: "s7", art: "sport", text: "Football: Wolves one, Foxes nil.",
    spiele: [{ sport: "football", teams: ["Wolves", "Foxes"], tore: [1, 0] }] },
  { id: "s8", art: "sport", text: "Here is the ice hockey result. Lions two, Eagles three.",
    spiele: [{ sport: "ice hockey", teams: ["Lions", "Eagles"], tore: [2, 3] }] },
  { id: "s9", art: "sport", text: "Football: Bears nil, Tigers nil. Nobody scored. It was a draw.",
    spiele: [{ sport: "football", teams: ["Bears", "Tigers"], tore: [0, 0] }] },
  { id: "s10", art: "sport", text: "In the handball match, the Foxes won against the Sharks, twenty-five to twenty-two.",
    spiele: [{ sport: "handball", teams: ["Foxes", "Sharks"], tore: [25, 22] }] },
  { id: "s11", art: "sport", text: "Football: Eagles five, Wolves two. Well done, Eagles!",
    spiele: [{ sport: "football", teams: ["Eagles", "Wolves"], tore: [5, 2] }] },
  { id: "s12", art: "sport", text: "Ice hockey: Tigers one, Bears two.",
    spiele: [{ sport: "ice hockey", teams: ["Tigers", "Bears"], tore: [1, 2] }] },

  // ---- Stufe 5: Wegbeschreibungen (Start beim Stern, Blick die Hauptstrasse hinauf) ----
  { id: "r1", art: "weg", ziel: "1L-r", text: "Start at the star. Go straight on. Take the first street on the left. It’s on your right." },
  { id: "r2", art: "weg", ziel: "2R-l", text: "Start at the star. Take the second street on the right. It’s on your left." },
  { id: "r3", art: "weg", ziel: "ende", text: "Go straight on to the end of the street. It’s in front of you." },
  { id: "r4", art: "weg", ziel: "1R-r", text: "Take the first turning on the right. It’s on your right." },
  { id: "r5", art: "weg", ziel: "2L-l", text: "Go straight on. Take the second turning on the left. It’s on your left." },
  { id: "r6", art: "weg", ziel: "1L-l", text: "Turn left into the first street. The place is on your left." },
  { id: "r7", art: "weg", ziel: "2R-r", text: "Turn right into the second street. It’s the building on your right." },
  { id: "r8", art: "weg", ziel: "1R-l", text: "Go straight on and take the first street on the right. It’s on your left." },
  { id: "r9", art: "weg", ziel: "2L-r", text: "Take the second street on the left. It’s on your right." },
  { id: "r10", art: "weg", ziel: "ende", text: "Start at the star. Walk to the end of the street. It’s right in front of you." },
  { id: "r11", art: "weg", ziel: "2L-l", text: "Turn left into the second street. It’s on your left." },
  { id: "r12", art: "weg", ziel: "1R-l", text: "Turn right into the first street. It’s the building on your left." },
  { id: "r13", art: "weg", ziel: "2R-r", text: "Go straight on past the first street. Take the second street on the right. It’s on your right." },
  { id: "r14", art: "weg", ziel: "1L-l", text: "Take the first street on the left. It’s the building on your left." },

  // ---- Königsstufe: längere Durchsagen, zwei Angaben heraushören ----
  { id: "l1", art: "lang", futur: true, text: "Good morning and welcome to the news. First, the weather. Today it will be sunny in Geneva, twenty-two degrees. In Zurich it will be cloudy, seventeen degrees. And in the mountains it will snow, minus one degree.",
    angaben: [{ wo: "Geneva", wetter: "sunny", grad: 22 }, { wo: "Zurich", wetter: "cloudy", grad: 17 }, { wo: "the mountains", wetter: "snowy", grad: -1 }] },
  { id: "l2", art: "lang", futur: true, text: "Here is the weather for the weekend. On Friday it will be rainy and twelve degrees. On Saturday it will be windy, fourteen degrees. On Sunday it will be sunny, nineteen degrees. Have a nice weekend!",
    angaben: [{ wann: "on Friday", wetter: "rainy", grad: 12 }, { wann: "on Saturday", wetter: "windy", grad: 14 }, { wann: "on Sunday", wetter: "sunny", grad: 19 }] },
  { id: "l3", art: "lang", futur: true, text: "Good evening. Now the sport. Football: Lions two, Eagles one. Ice hockey: Bears three, Wolves three. And now the weather for tomorrow. It will be foggy in the morning and sunny in the afternoon.",
    spiele: [{ sport: "football", teams: ["Lions", "Eagles"], tore: [2, 1] }, { sport: "ice hockey", teams: ["Bears", "Wolves"], tore: [3, 3] }],
    angaben: [{ wann: "in the morning", wetter: "foggy" }, { wann: "in the afternoon", wetter: "sunny" }] },
  { id: "l4", art: "lang", text: "Good morning! Here is the weather. In Basel it is rainy, ten degrees. In Lugano it is sunny and warm, twenty-five degrees. In Lucerne it is windy, thirteen degrees.",
    angaben: [{ wo: "Basel", wetter: "rainy", grad: 10 }, { wo: "Lugano", wetter: "sunny", grad: 25 }, { wo: "Lucerne", wetter: "windy", grad: 13 }] },
  { id: "l5", art: "lang", futur: true, text: "Here is the news for children. In the school football tournament, the Tigers beat the Sharks three to nil. Tomorrow there will be storms in the afternoon. It will be twenty-seven degrees.",
    spiele: [{ sport: "football", teams: ["Tigers", "Sharks"], tore: [3, 0] }],
    angaben: [{ wann: "tomorrow", wetter: "stormy", grad: 27 }] },
  { id: "l6", art: "lang", text: "Good morning. Here is the weather. Today it is cloudy and fifteen degrees. Tomorrow it will be rainy and eleven degrees. On Saturday it will be sunny, eighteen degrees.",
    angaben: [{ wann: "today", wetter: "cloudy", grad: 15 }, { wann: "tomorrow", wetter: "rainy", grad: 11, futur: true }, { wann: "on Saturday", wetter: "sunny", grad: 18, futur: true }] },
  { id: "l7", art: "lang", futur: true, text: "And now the sport. Handball: Foxes twenty-eight, Eagles thirty. Football: Wolves one, Tigers nil. And the weather: tonight it will be windy and four degrees.",
    spiele: [{ sport: "handball", teams: ["Foxes", "Eagles"], tore: [28, 30] }, { sport: "football", teams: ["Wolves", "Tigers"], tore: [1, 0] }],
    angaben: [{ wann: "tonight", wetter: "windy", grad: 4 }] },
  { id: "l8", art: "lang", text: "Hello and good morning. In Bern it is foggy and seven degrees. In Geneva it is cloudy and nine degrees. In Lugano it is sunny and sixteen degrees. Have a nice day!",
    angaben: [{ wo: "Bern", wetter: "foggy", grad: 7 }, { wo: "Geneva", wetter: "cloudy", grad: 9 }, { wo: "Lugano", wetter: "sunny", grad: 16 }] },
];
