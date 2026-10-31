/* Sätze für die Fehler-Lupe — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG D.4.F.1 (Rechtschreibung überarbeiten): b sch, sp/st, Abstrakta gross;
   c (Orientierungspunkt 4. Klasse) ie, e/ä, Komma bei Aufzählungen. Ab Stufe 5 (5. Klasse)
   weitere Regeln aus D.5.E.1: Doppelkonsonant, ck/tz, äu/eu, Dehnungs-h, Nomen aus Verben.

   In jedem Satz steht GENAU EIN Fehler, in geschweiften Klammern:
     {richtig|falsch|weitere falsche …}
   Das Spiel zeigt die falsche Schreibweise (das zweite Wort). Wer das Wort antippt, wählt die
   richtige aus der richtigen, der gezeigten und den weiteren falschen Schreibweisen.
   Beispiel: "Der {Stein|Schtein} ist schwer." zeigt „Der Schtein ist schwer.“
   Alle übrigen Wörter müssen richtig geschrieben sein. Schweizer Schreibweise (ss statt ß).

   kurz: Stufe 1–3 und 5; lang: Stufe 4–6. Die Regeltexte dürfen kein Lösungswort enthalten.

   Inhaltslisten (Entscheid L4 a): Jede Regel gehört über das Feld „liste“ zu einer Liste, die die
   Aufsicht einzeln freigibt. Der Prüfstand steht im Katalog (spiele/gemeinsam/katalog.js, Eintrag
   fehler-lupe, Feld listen). Listen:
     nomen-gross       Nomen gross, auch Gefühle (gross, abstrakt)
     sp-st-sch         sp und st, sch (spst, sch)
     ie-i              ie oder i (ie)
     ae-aeu            e oder ä, eu oder äu (eae, aeu)
     komma             Komma bei Aufzählungen (komma)
     kurzer-vokal      Doppelkonsonant, ck und tz (doppel, cktz)
     dehnungs-h        Dehnungs-h (dehnung)
     verben-als-nomen  Verben als Nomen (nominal)
   Die fehlerfreien Sätze (FEHLERFREIE_SAETZE, nur Königsstufe) gehören zu keiner Liste: Sie stehen
   nie allein, sondern nur neben einem Satz aus einer freien Liste, und gelten mit dem Spiel als
   Ganzem (Katalog-Feld geprueft beziehungsweise Freigabe des Spiels). */

const FEHLER_REGELN = {
  gross: {
    liste: "nomen-gross",
    name: "Nomen gross",
    regel: "Nomen schreibt man gross. Probe: Passt der, die oder das davor?",
    kurz: [
      "Der {Hund|hund} bellt laut.",
      "Lina hat eine rote {Tasche|tasche}.",
      "Im {Garten|garten} blüht eine Rose.",
      "Tim isst einen {Apfel|apfel}.",
      "Die {Katze|katze} schläft auf dem Sofa.",
      "Wir fahren mit dem {Velo|velo} zur Schule.",
      "Mein {Bruder|bruder} spielt Fussball.",
      "Der {Vogel|vogel} singt im Baum.",
      "Oma backt einen {Kuchen|kuchen}.",
      "Auf dem Tisch steht eine {Vase|vase}.",
    ],
    lang: [
      "Am Morgen packt Mia ihre {Schultasche|schultasche} und läuft zur Bushaltestelle.",
      "Nach dem Regen sammeln die Kinder bunte {Blätter|blätter} im Wald.",
      "Im Sommer baden wir gerne im kühlen {See|see} hinter dem Dorf.",
      "Der Bauer füttert am Abend die {Kühe|kühe} im Stall.",
    ],
  },
  abstrakt: {
    liste: "nomen-gross",
    name: "Nomen gross (auch Gefühle)",
    regel: "Auch Nomen, die man nicht anfassen kann, schreibt man gross — zum Beispiel Gefühle.",
    kurz: [
      "Ich habe keine {Angst|angst}.",
      "Das Geschenk macht mir grosse {Freude|freude}.",
      "Lea hat heute viel {Glück|glück}.",
      "Wir haben jetzt keine {Zeit|zeit}.",
      "Tim braucht viel {Mut|mut}.",
      "Nach dem Turnen habe ich grossen {Hunger|hunger}.",
    ],
    lang: [
      "Nach dem langen Spiel hatten alle Kinder grossen {Durst|durst} und tranken viel Wasser.",
      "Mit viel {Geduld|geduld} hat Noah das schwierige Puzzle gelöst.",
    ],
  },
  spst: {
    liste: "sp-st-sch",
    name: "sp und st",
    regel: "Am Wortanfang hört man «schp» und «scht» — man schreibt aber sp und st.",
    kurz: [
      "Der {Stein|Schtein} ist schwer.",
      "Wir {spielen|schpielen} im Hof.",
      "Am Himmel leuchtet ein {Stern|Schtern}.",
      "Die {Spinne|Schpinne} baut ein Netz.",
      "Lina {steht|schteht} am Fenster.",
      "Der Hund {springt|schpringt} über den Bach.",
      "Mein {Stift|Schtift} ist rot.",
      "Die {Strasse|Schtrasse} ist nass.",
    ],
    lang: [
      "Nach der Schule {spielen|schpielen} wir mit unseren Freunden auf dem grossen Platz.",
      "Der Junge {stellt|schtellt} seine Stiefel neben die Tür und zieht die Jacke aus.",
    ],
  },
  sch: {
    liste: "sp-st-sch",
    name: "sch",
    regel: "Den Laut «sch» schreibt man mit drei Buchstaben: s, c und h.",
    kurz: [
      "Die {Schule|Shule|Sule} beginnt um acht Uhr.",
      "Das {Schaf|Shaf|Saf} frisst Gras.",
      "Mama stellt die {Flasche|Flashe|Flase} auf den Tisch.",
      "Unter dem {Tisch|Tish|Tis} liegt ein Ball.",
      "Wir {waschen|washen|wasen} die Hände.",
      "Der {Schnee|Shnee|Snee} ist weiss.",
    ],
    lang: [
      "Nach dem Mittagessen {schaut|shaut|saut} Lea mit ihrer Grossmutter ein lustiges Bilderbuch an.",
      "Am Wochenende {schwimmen|shwimmen|swimmen} wir mit der ganzen Familie im warmen Hallenbad.",
    ],
  },
  ie: {
    liste: "ie-i",
    name: "ie oder i",
    regel: "Ein lang gesprochenes i schreibt man meistens ie, ein kurz gesprochenes nur i.",
    kurz: [
      "Die {Biene|Bine} fliegt zur Blume.",
      "Ich schreibe einen {Brief|Brif}.",
      "Das {Tier|Tir} schläft im Stall.",
      "Das {Kind|Kiend} lacht.",
      "Die {Ziege|Zige} meckert laut.",
      "Lina hat {vier|vir} Katzen.",
      "Auf der {Wiese|Wise} wachsen Blumen.",
    ],
    lang: [
      "Am Nachmittag {liegen|ligen} die Kinder im Schatten unter dem grossen Baum.",
      "Mein kleiner Bruder {fliegt|fligt} morgen zum ersten Mal mit dem Flugzeug nach Spanien.",
    ],
  },
  eae: {
    liste: "ae-aeu",
    name: "e oder ä",
    regel: "Gibt es ein verwandtes Wort mit a, schreibt man ä. Sonst schreibt man e.",
    kurz: [
      "Ich wasche meine {Hände|Hende}.",
      "Im Herbst fallen die {Äpfel|Epfel} vom Baum.",
      "Die {Gläser|Gleser} stehen im Schrank.",
      "Heute ist es {kälter|kelter} als gestern.",
      "Die {Männer|Menner} tragen schwere Kisten.",
      "Im {Bett|Bätt} liegt eine Puppe.",
    ],
    lang: [
      "Im Frühling blühen in allen {Gärten|Gerten} unserer Strasse bunte Tulpen.",
      "Der Bauer bringt die {Kälber|Kelber} am Abend zurück in den warmen Stall.",
    ],
  },
  komma: {
    liste: "komma",
    name: "Komma bei Aufzählungen",
    regel: "Bei einer Aufzählung trennt ein Komma die Teile — vor «und» steht kein Komma.",
    kurz: [
      "Wir kaufen {Äpfel,|Äpfel|Äpfel.} Birnen und Bananen.",
      "Lina hat einen {Hund,|Hund|Hund.} eine Katze und zwei Hasen.",
      "Im Rucksack sind {Brot,|Brot|Brot.} Käse und Wasser.",
      "Tim mag Rot, {Blau,|Blau|Blau.} Gelb und Grün.",
      "Wir {singen,|singen|singen.} tanzen und lachen.",
    ],
    lang: [
      "Für den Ausflug packt Noah ein {Sandwich,|Sandwich|Sandwich.} einen Apfel und eine Flasche Wasser ein.",
      "In unserem Zoo leben Löwen, {Affen,|Affen|Affen.} Zebras und viele bunte Vögel.",
    ],
  },
  // ---------- ab Stufe 5 (5. Klasse) ----------
  doppel: {
    liste: "kurzer-vokal",
    name: "Doppelkonsonant",
    regel: "Nach einem kurz gesprochenen Vokal folgt oft ein doppelter Konsonant.",
    kurz: [
      "Die {Sonne|Sone} scheint hell.",
      "Wir {kommen|komen} morgen zu Besuch.",
      "Im {Sommer|Somer} gehen wir baden.",
      "Mein {Teller|Teler} ist leer.",
      "Der {Koffer|Kofer} ist schwer.",
    ],
    lang: [
      "Am Abend {schwimmen|schwimen} die Enten langsam über den stillen See.",
    ],
  },
  cktz: {
    liste: "kurzer-vokal",
    name: "ck und tz",
    regel: "Nach einem kurz gesprochenen Vokal schreibt man ck und tz statt k und z.",
    kurz: [
      "Der {Zucker|Zuker} ist süss.",
      "Die {Katze|Kaze} miaut.",
      "Ich trage eine warme {Mütze|Müze}.",
      "Der {Rucksack|Ruksack} ist voll.",
      "Der {Blitz|Bliz} leuchtet hell.",
    ],
    lang: [
      "Nach dem Gewitter {sitzen|sizen} wir auf der Terrasse und schauen den Regenbogen an.",
    ],
  },
  aeu: {
    liste: "ae-aeu",
    name: "äu oder eu",
    regel: "Gibt es ein verwandtes Wort mit au, schreibt man äu. Sonst schreibt man eu.",
    kurz: [
      "Die {Bäume|Beume} sind hoch.",
      "Im Wald wohnen viele {Mäuse|Meuse}.",
      "Lina {läuft|leuft} schnell.",
      "Die {Häuser|Heuser} sind alt.",
      "Meine {Freunde|Fräunde} kommen heute.",
    ],
    lang: [
      "Am Morgen {räumt|reumt} mein Bruder sein Zimmer auf und macht dann seine Hausaufgaben.",
    ],
  },
  dehnung: {
    liste: "dehnungs-h",
    name: "Dehnungs-h",
    regel: "Manche lang gesprochenen Vokale bekommen ein h dahinter. Solche Wörter muss man sich merken.",
    kurz: [
      "Wir {fahren|faren} ans Meer.",
      "Der {Zahn|Zan} wackelt.",
      "Ich {wohne|wone} in Bern.",
      "Das {Huhn|Hun} legt ein Ei.",
      "Mein {Stuhl|Stul} wackelt.",
    ],
    lang: [
      "Im Winter {fahren|faren} wir mit der ganzen Familie zum Schlitteln in die Berge.",
    ],
  },
  nominal: {
    liste: "verben-als-nomen",
    name: "Verben als Nomen",
    regel: "Steht beim Verb ein Artikel (das, beim, zum), wird es zum Nomen und man schreibt es gross.",
    kurz: [
      "Beim {Essen|essen} sprechen wir leise.",
      "Das {Lesen|lesen} macht mir Spass.",
      "Zum {Malen|malen} brauche ich Farben.",
      "Beim {Schwimmen|schwimmen} trage ich eine Brille.",
    ],
    lang: [
      "Nach dem langen {Wandern|wandern} waren alle müde und freuten sich auf das Abendessen.",
    ],
  },
};

// Sätze ganz ohne Fehler: In der Königsstufe steht einer davor oder danach.
const FEHLERFREIE_SAETZE = [
  "Heute ist ein schöner Tag.",
  "Die Kinder spielen im Park.",
  "Am Abend lesen wir eine Geschichte.",
  "Unser Hund heisst Bello.",
  "Im Winter schneit es oft.",
  "Der Zug fährt um neun Uhr ab.",
  "Meine Schwester hat einen neuen Rucksack.",
  "Wir essen gerne Suppe.",
  "Nach der Schule mache ich meine Hausaufgaben.",
  "Der Himmel ist blau.",
];
