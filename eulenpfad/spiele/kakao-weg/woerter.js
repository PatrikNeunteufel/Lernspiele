/* Wege der Waren für den Kakao-Weg — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG NMG.6.3.d/e: den Weg von Gütern von der Herstellung bis zum Kauf beschreiben, Beteiligte
   nennen (Produktion, Transport, Handel, Konsum). Selbst geschriebene, vereinfachte Sätze für die
   5. Klasse; Schweizer Schreibweise (ss statt ß, Schoggi, Papeterie).

   Inhaltsliste (Liste-Id = „wege“; Prüfstand im Katalog, Eintrag „kakao-weg“, Feld listen):

   Je Produkt:
     name, bild      wie das Spiel es nennt
     rohstoff        woraus es gemacht wird
     herkunft        "schweiz" oder "ausland": woher der Rohstoff auf DIESEM Weg kommt
     grund           ein Satz, warum (zeigt das Spiel nach der Antwort zur Herkunft)
     transport       wie der Rohstoff oder die Ware in die Schweiz kommt:
                     "schiff" (über das Meer, dann Zug oder Lastwagen) oder "kurz" (kurzer Weg im Inland)
     verwandt        Produkte, deren Schritte sich ähneln (Milch und Käse): Das Spiel nimmt deren
                     Schritte nie als falsche Antwort bei „Welcher Schritt fehlt?“
     schritte        5–8 Schritte in RICHTIGER Reihenfolge: [Satz, wer, Bild]
                     wer = wer das macht: "hof" (Landwirtschaft: Bauer, Plantage, Wald),
                     "fabrik" (Fabrik oder Werkstatt: Mühle, Käserei, Bäckerei …), "transport",
                     "gross" (Grossverteiler: Lager, Verteilzentrum), "laden", "haushalt" (wir kaufen).
                     Leer (""), wenn es nicht eindeutig ist — dann fragt das Spiel dort nicht „Wer macht das?“.
   Jeder Satz nennt sein Produkt oder seinen Rohstoff, damit er in einem anderen Weg sicher nicht passt. */

const WEGE = [
  {
    id: "schoggi", name: "Schoggi", bild: "🍫", rohstoff: "Kakaobohnen", herkunft: "ausland", transport: "schiff",
    grund: "Kakaobäume wachsen nur, wo es das ganze Jahr warm und feucht ist — in Ländern nahe am Äquator.",
    schritte: [
      ["In Westafrika ernten Kakaobauern die Früchte vom Kakaobaum.", "hof", "🌳"],
      ["Die Kakaobohnen gären einige Tage und trocknen dann in der Sonne.", "hof", "☀️"],
      ["Ein Schiff bringt die Säcke mit Kakaobohnen über das Meer nach Europa.", "transport", "🚢"],
      ["Zug oder Lastwagen bringen die Kakaobohnen in eine Schoggifabrik in der Schweiz.", "transport", "🚆"],
      ["In der Schoggifabrik werden die Kakaobohnen geröstet und fein gemahlen.", "fabrik", "🏭"],
      ["Kakaomasse, Zucker und Milchpulver werden lange gerührt, zu Tafeln gegossen und verpackt.", "fabrik", "🍫"],
      ["Im Verteilzentrum des Grossverteilers werden die Schoggitafeln auf die Läden verteilt.", "gross", "🏬"],
      ["Wir kaufen im Laden eine Tafel Schoggi.", "haushalt", "🛍️"],
    ],
  },
  {
    id: "brot", name: "Brot", bild: "🍞", rohstoff: "Weizen", herkunft: "schweiz", transport: "kurz",
    grund: "Weizen wächst auf vielen Feldern im Schweizer Mittelland.",
    schritte: [
      ["Die Bäuerin sät Weizen auf ihrem Feld.", "hof", "🌱"],
      ["Im Sommer erntet ein Mähdrescher die reifen Weizenkörner.", "hof", "🌾"],
      ["Ein Lastwagen bringt die Weizenkörner in die Mühle.", "transport", "🚚"],
      ["In der Mühle werden die Weizenkörner zu Mehl gemahlen.", "fabrik", "⚙️"],
      ["In der Bäckerei knetet der Bäcker aus Mehl, Wasser, Hefe und Salz einen Brotteig.", "fabrik", "🧑‍🍳"],
      ["Im heissen Ofen wird der Teig zu Brot gebacken.", "fabrik", "🔥"],
      ["Frühmorgens bringt ein Lieferwagen das frische Brot in die Läden.", "transport", "🚐"],
      ["Wir kaufen im Laden ein Brot.", "haushalt", "🛍️"],
    ],
  },
  {
    id: "milch", name: "Milch", bild: "🥛", rohstoff: "Kuhmilch", herkunft: "schweiz", transport: "kurz", verwandt: ["kaese"],
    grund: "In der Schweiz gibt es viele Bauernhöfe mit Kühen.",
    schritte: [
      ["Der Bauer füttert seine Kühe mit Gras und Heu.", "hof", "🐄"],
      ["Zweimal am Tag melkt der Bauer die Kühe.", "hof", "🪣"],
      ["Ein Milchsammelwagen holt die Milch auf dem Bauernhof ab.", "transport", "🚛"],
      ["In der Molkerei wird die Milch kurz erhitzt, damit sie länger hält.", "fabrik", "🏭"],
      ["Maschinen füllen die Milch in Flaschen und Packungen ab.", "fabrik", "🥛"],
      ["Gekühlte Lastwagen bringen die Milchpackungen ins Verteilzentrum.", "transport", "🚚"],
      ["Im Laden stellt ein Verkäufer die Milch ins Kühlregal.", "laden", "🧊"],
      ["Wir kaufen eine Packung Milch.", "haushalt", "🛍️"],
    ],
  },
  {
    id: "kaese", name: "Käse", bild: "🧀", rohstoff: "Kuhmilch", herkunft: "schweiz", transport: "kurz", verwandt: ["milch"],
    grund: "Die Milch für den Käse kommt von Kühen auf Schweizer Bauernhöfen.",
    schritte: [
      ["Am Morgen und am Abend melkt die Bäuerin ihre Kühe für die Käserei.", "hof", "🐄"],
      ["Die frische Milch kommt in die Dorfkäserei.", "", "🥛"],
      ["Der Käser wärmt die Milch und gibt Lab dazu, so wird sie dick.", "fabrik", "🧑‍🍳"],
      ["Die Käsemasse wird in runde Formen gepresst.", "fabrik", "⭕"],
      ["Die Käselaibe liegen einige Zeit in einem Salzbad.", "fabrik", "🧂"],
      ["Im Käsekeller reift der Käse viele Wochen oder Monate lang.", "fabrik", "🕰️"],
      ["Im Käseladen schneidet die Verkäuferin ein Stück vom Käselaib ab.", "laden", "🔪"],
      ["Wir kaufen ein Stück Käse.", "haushalt", "🛍️"],
    ],
  },
  {
    id: "tshirt", name: "T-Shirt", bild: "👕", rohstoff: "Baumwolle", herkunft: "ausland", transport: "schiff",
    grund: "Baumwolle braucht viel Sonne und Wärme. In der Schweiz ist es dafür zu kalt.",
    schritte: [
      ["In Indien pflücken Bauern die weissen Baumwollbüschel.", "hof", "🌱"],
      ["Eine Maschine trennt die Samen von den Baumwollfasern.", "fabrik", "⚙️"],
      ["In der Spinnerei werden die Baumwollfasern zu Garn gesponnen.", "fabrik", "🧵"],
      ["Aus dem Baumwollgarn wird Stoff gestrickt und gefärbt.", "fabrik", "🎨"],
      ["In einer Näherei, zum Beispiel in Bangladesch, nähen Näherinnen den Stoff zu T-Shirts.", "fabrik", "🪡"],
      ["Ein Containerschiff bringt die T-Shirts über das Meer nach Europa.", "transport", "🚢"],
      ["Lastwagen bringen die T-Shirts in die Kleiderläden.", "transport", "🚚"],
      ["Wir kaufen im Kleiderladen ein T-Shirt.", "haushalt", "🛍️"],
    ],
  },
  {
    id: "apfelsaft", name: "Apfelsaft", bild: "🧃", rohstoff: "Äpfel", herkunft: "schweiz", transport: "kurz",
    grund: "Apfelbäume wachsen in der ganzen Schweiz, besonders viele im Thurgau.",
    schritte: [
      ["Im Herbst werden die reifen Mostäpfel von den Bäumen geschüttelt und aufgelesen.", "hof", "🍎"],
      ["Mit dem Traktor kommen die Äpfel in die Mosterei.", "", "🚜"],
      ["In der Mosterei werden die Äpfel gewaschen und zerkleinert.", "fabrik", "💧"],
      ["Eine Presse presst den Saft aus den Äpfeln.", "fabrik", "🧃"],
      ["Der Apfelsaft wird kurz erhitzt, damit er lange hält, und in Flaschen abgefüllt.", "fabrik", "🍶"],
      ["Lastwagen bringen die Apfelsaftflaschen ins Verteilzentrum des Grossverteilers.", "transport", "🚚"],
      ["Im Laden stehen die Apfelsaftflaschen im Getränkeregal.", "laden", "🏪"],
      ["Wir kaufen eine Flasche Apfelsaft.", "haushalt", "🛍️"],
    ],
  },
  {
    id: "papier", name: "Papier", bild: "📄", rohstoff: "Holz", herkunft: "schweiz", transport: "kurz",
    grund: "Ungefähr ein Drittel der Schweiz ist mit Wald bedeckt.",
    schritte: [
      ["Forstwarte fällen im Wald Bäume für Papierholz.", "hof", "🌲"],
      ["Ein Lastwagen bringt das Holz in die Papierfabrik.", "transport", "🚚"],
      ["Das Holz wird in feine Fasern zerlegt und mit Wasser zu einem Papierbrei gemischt.", "fabrik", "🪵"],
      ["Die Papiermaschine verteilt den Papierbrei auf einem Sieb, presst und trocknet ihn.", "fabrik", "⚙️"],
      ["Das lange Papierband wird in Blätter geschnitten und verpackt.", "fabrik", "✂️"],
      ["Im Verteilzentrum werden die Papierpakete für die Läden bereitgestellt.", "gross", "🏬"],
      ["In der Papeterie liegen die Papierpakete im Regal.", "laden", "🏪"],
      ["Wir kaufen ein Paket Zeichenpapier.", "haushalt", "🛍️"],
    ],
  },
  {
    id: "zucker", name: "Zucker", bild: "🍬", rohstoff: "Zuckerrüben", herkunft: "schweiz", transport: "kurz",
    grund: "Zuckerrüben wachsen auf Feldern im Schweizer Mittelland.",
    schritte: [
      ["Im Frühling sät die Bäuerin Zuckerrüben.", "hof", "🌱"],
      ["Im Herbst holt eine Erntemaschine die Zuckerrüben aus der Erde.", "hof", "🚜"],
      ["Lastwagen und Züge bringen die Zuckerrüben in die Zuckerfabrik in Aarberg oder Frauenfeld.", "transport", "🚆"],
      ["Die Zuckerrüben werden gewaschen und in Schnitzel geschnitten.", "fabrik", "🔪"],
      ["Heisses Wasser löst den Zucker aus den Rübenschnitzeln.", "fabrik", "💧"],
      ["Der Zuckersaft wird eingekocht, bis Zuckerkristalle entstehen.", "fabrik", "✨"],
      ["Lastwagen bringen die Zuckerpakete zu den Grossverteilern.", "transport", "🚚"],
      ["Wir kaufen ein Kilo Zucker.", "haushalt", "🛍️"],
    ],
  },
  {
    id: "banane", name: "Bananen", bild: "🍌", rohstoff: "Bananen", herkunft: "ausland", transport: "schiff",
    grund: "Bananen wachsen nur in warmen, tropischen Ländern. Bei uns ist es zu kalt.",
    schritte: [
      ["Auf einer Plantage in Ecuador schneiden Arbeiter die grünen Bananenstauden ab.", "hof", "🌴"],
      ["Die grünen Bananen werden gewaschen und in Kartons verpackt.", "", "📦"],
      ["Ein Kühlschiff bringt die grünen Bananen über das Meer nach Europa.", "transport", "🚢"],
      ["Zug oder Lastwagen bringen die Bananen in die Schweiz.", "transport", "🚆"],
      ["In warmen Reifekammern werden die Bananen langsam gelb.", "", "🌡️"],
      ["Im Laden liegen die gelben Bananen bei den Früchten.", "laden", "🏪"],
      ["Wir kaufen ein paar Bananen.", "haushalt", "🛍️"],
    ],
  },
  {
    id: "kaffee", name: "Kaffee", bild: "☕", rohstoff: "Kaffeebohnen", herkunft: "ausland", transport: "schiff",
    grund: "Kaffeesträucher wachsen nur in warmen Ländern nahe am Äquator.",
    schritte: [
      ["In Brasilien ernten Kaffeebauern die roten Kaffeekirschen.", "hof", "🍒"],
      ["Die Kaffeebohnen werden aus den Früchten gelöst und getrocknet.", "", "☀️"],
      ["Ein Schiff bringt die Säcke mit grünen Kaffeebohnen über das Meer nach Europa.", "transport", "🚢"],
      ["Zug oder Lastwagen bringen den Rohkaffee in die Schweiz.", "transport", "🚆"],
      ["In der Kaffeerösterei werden die grünen Bohnen braun geröstet.", "fabrik", "🔥"],
      ["Der geröstete Kaffee wird in Packungen abgefüllt, damit er frisch bleibt.", "fabrik", "📦"],
      ["Im Laden steht der Kaffee im Regal.", "laden", "🏪"],
      ["Erwachsene kaufen eine Packung Kaffee.", "haushalt", "🛍️"],
    ],
  },
];
