// Inhalte für das Magnet-Labor (Lehrplan SG NMG.5.2, NMG.3.3.d).
// Bewusst weggelassen, weil es auf das Material ankommt: Schlüssel (oft Messing), Löffel
// (Edelstahl ist oft nicht magnetisch), Dosen, Münzen, Steine — und ein zweiter Magnet, der je
// nach Lage auch abstösst.
// UNGEPRÜFT — bitte von Eltern oder Lehrperson prüfen lassen (Prüfliste docs/pruefung/).

// [Bild, Ding, zieht der Magnet es an?]
const MAGNET_DINGE = [
  ["📎", "Büroklammer", true], ["🔩", "Schraube aus Eisen", true], ["✂️", "Schere", true], ["🧷", "Sicherheitsnadel", true],
  ["🪵", "Holzklotz", false], ["📄", "Papier", false], ["✏️", "Bleistift", false], ["🏀", "Ball", false],
  ["🪶", "Feder", false], ["🍎", "Apfel", false], ["🧶", "Wolle", false], ["🥛", "Glas", false],
];

// Fragen: [ab Stufe, Frage, richtig, falsch, falsch] — Stufe = Spielstufe s1–s6 (Skala mit Königsstufe)
const MAGNET_FRAGEN = [
  [3, "Zieht der Magnet die Büroklammer auch durch ein Blatt Papier an?", "Ja, der Magnet wirkt durch Papier.", "Nein, nie.", "Nur wenn das Papier nass ist."],
  [3, "Zieht der Magnet eine Büroklammer unter Wasser an?", "Ja, der Magnet wirkt auch im Wasser.", "Nein, Wasser stoppt den Magneten.", "Nur warmes Wasser."],
  [3, "Wann zieht der Magnet die Büroklammer stärker an?", "wenn sie näher beim Magneten ist", "wenn sie weiter weg ist", "wenn es dunkel ist"],
  [4, "Wohin zeigt eine Kompassnadel?", "nach Norden", "immer zur Sonne", "nach unten"],
  [4, "Warum zeigt die Kompassnadel nach Norden?", "Die Erde ist wie ein riesiger Magnet.", "Der Wind dreht die Nadel.", "Die Nadel ist schwer."],
  [4, "Wie viele Pole hat ein Magnet?", "zwei: Nordpol und Südpol", "einen", "keinen"],
  // Stufe 5: Kompass und Pole, schwerer — NEU in LERN_Session2, UNGEPRÜFT
  [5, "Ein Stabmagnet zerbricht in der Mitte. Wie viele Pole hat jedes Stück?", "zwei: wieder einen Nordpol und einen Südpol", "nur einen", "keinen mehr"],
  [5, "Wo zieht ein Stabmagnet am stärksten an?", "an seinen beiden Enden, den Polen", "genau in der Mitte", "überall gleich stark"],
  [5, "Du hältst einen Magneten nahe an einen Kompass. Was passiert?", "Die Kompassnadel dreht sich.", "Nichts, der Kompass merkt es nicht.", "Der Kompass wird warm."],
  [5, "Du drehst dich mit dem Kompass in der Hand um. Wohin zeigt die Nadel jetzt?", "immer noch nach Norden", "mit dir mit nach hinten", "nach unten"],
  // Stufe 6 (Königsstufe): Strom
  [6, "Welches Material leitet elektrischen Strom?", "Metall, zum Beispiel ein Kupferdraht", "Holz", "Kunststoff"],
  [6, "Wann leuchtet die Lampe im Stromkreis?", "wenn der Stromkreis geschlossen ist", "wenn der Stromkreis offen ist", "wenn die Batterie fehlt"],
  [6, "Wie heissen die beiden Pole einer Batterie?", "Plus und Minus", "Nord und Süd", "oben und unten"],
  [6, "Was passiert, wenn Strom durch einen Draht um eine Schraube fliesst?", "Die Schraube wird zum Magneten.", "Die Schraube schmilzt sofort.", "Nichts, nie."],
  [6, "Darf man mit dem Strom aus der Steckdose experimentieren?", "Nein, das ist lebensgefährlich.", "Ja, das ist ungefährlich.", "Ja, mit nassen Händen."],
  // NEU in LERN_Session2, UNGEPRÜFT
  [6, "Was macht ein Schalter im Stromkreis?", "Er öffnet und schliesst den Stromkreis.", "Er macht die Batterie voll.", "Er macht den Strom stärker."],
  [6, "Was braucht ein Elektromagnet, damit er gut anzieht?", "Strom, der durch den Draht fliesst", "Wasser im Draht", "Sonnenlicht"],
];
