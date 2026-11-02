/* Verben für den Verben-Fächer — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG D.5.D.1.c (Grundanspruch 2. Zyklus): Verbenfächer; Präsens, Präteritum, Perfekt,
   Infinitiv, Personalform. Selbst geschriebene Sätze; Namen frei erfunden. Schweizer Schreibweise.

   Schreibweise je Eintrag: [Infinitiv, "Präsens|Präteritum|Perfekt", Beispielsatz]
     - Die Formen passen zur Person im Beispielsatz (Die Rosen blühen → blühen|blühten|haben geblüht).
     - Perfekt leer, wenn es in der Schweiz anders gebildet wird als in Deutschland (liegen: in der
       Schweiz „ist gelegen“, sonst „hat gelegen“) — dann fragt das Spiel das Perfekt nicht ab.
     - Im Beispielsatz steht jede Ergänzung in eckigen Klammern mit ihrer Frage, das Verb ohne Klammer
       an zweiter Stelle: [wer:Lea] gibt [wem:dem Hund] [wen:einen Knochen].
       Fragen: wer = Wer oder was?  wen = Wen oder was?  wem = Wem?  wo = Wo?  wohin = Wohin?
     - Nur Ergänzungen, die das Verb BRAUCHT (ohne sie ist der Satz unvollständig). Keine freien Angaben
       wie „heute“ oder „im Garten“ bei Verben, die ohne sie auskommen — sonst wäre der Fächer nicht
       eindeutig. Annahme zur Schulgrammatik: geben, schenken, zeigen, bringen … mit Wem? (dreiwertig,
       wie im Verbenfächer üblich); helfen, danken, gehören … mit Wem?.

   Inhaltsliste (Liste-Id = Schlüssel; Prüfstand im Katalog, Eintrag „verben-faecher“, Feld listen):
     verben  alle Verben; das Spiel ordnet sie über ihre Fragen den Stufen zu. */

const VERBEN_LISTEN = {
  verben: [
    // nur Wer oder was?
    ["lachen", "lacht|lachte|hat gelacht", "[wer:Das Baby] lacht."],
    ["schlafen", "schläft|schlief|hat geschlafen", "[wer:Der Hund] schläft."],
    ["bellen", "bellt|bellte|hat gebellt", "[wer:Der Dackel] bellt."],
    ["blühen", "blühen|blühten|haben geblüht", "[wer:Die Rosen] blühen."],
    ["weinen", "weint|weinte|hat geweint", "[wer:Das Kind] weint."],
    ["niesen", "niest|nieste|hat geniest", "[wer:Opa] niest."],
    ["gähnen", "gähnt|gähnte|hat gegähnt", "[wer:Lina] gähnt."],
    ["scheinen", "scheint|schien|hat geschienen", "[wer:Die Sonne] scheint."],
    ["schmelzen", "schmilzt|schmolz|ist geschmolzen", "[wer:Der Schnee] schmilzt."],
    ["klingeln", "klingelt|klingelte|hat geklingelt", "[wer:Der Wecker] klingelt."],
    ["husten", "hustet|hustete|hat gehustet", "[wer:Ben] hustet."],
    // Wer oder was? und Wen oder was?
    ["besuchen", "besucht|besuchte|hat besucht", "[wer:Lea] besucht [wen:ihre Grossmutter]."],
    ["fangen", "fängt|fing|hat gefangen", "[wer:Die Katze] fängt [wen:eine Maus]."],
    ["finden", "findet|fand|hat gefunden", "[wer:Tim] findet [wen:einen Fünfliber]."],
    ["suchen", "sucht|suchte|hat gesucht", "[wer:Mia] sucht [wen:ihren Turnsack]."],
    ["tragen", "trägt|trug|hat getragen", "[wer:Papa] trägt [wen:den schweren Koffer]."],
    ["brauchen", "brauchen|brauchten|haben gebraucht", "[wer:Wir] brauchen [wen:einen Regenschirm]."],
    ["füttern", "füttert|fütterte|hat gefüttert", "[wer:Noah] füttert [wen:die Kaninchen]."],
    ["flicken", "flickt|flickte|hat geflickt", "[wer:Die Velomechanikerin] flickt [wen:den Reifen]."],
    ["vermissen", "vermisst|vermisste|hat vermisst", "[wer:Elif] vermisst [wen:ihren Hund]."],
    ["öffnen", "öffnet|öffnete|hat geöffnet", "[wer:Der Hauswart] öffnet [wen:die Tür]."],
    // Wer oder was? und Wem?
    ["helfen", "hilft|half|hat geholfen", "[wer:Lea] hilft [wem:ihrem Bruder]."],
    ["danken", "dankt|dankte|hat gedankt", "[wer:Tim] dankt [wem:der Lehrerin]."],
    ["gehören", "gehört|gehörte|hat gehört", "[wer:Das Velo] gehört [wem:meiner Schwester]."],
    ["gefallen", "gefällt|gefiel|hat gefallen", "[wer:Das Lied] gefällt [wem:den Kindern]."],
    ["gratulieren", "gratulieren|gratulierten|haben gratuliert", "[wer:Wir] gratulieren [wem:dem Grossvater]."],
    ["vertrauen", "vertrauen|vertrauten|haben vertraut", "[wer:Die Kinder] vertrauen [wem:ihrer Lehrerin]."],
    ["folgen", "folgt|folgte|ist gefolgt", "[wer:Der Hund] folgt [wem:dem Jäger]."],
    ["begegnen", "begegnet|begegnete|ist begegnet", "[wer:Mia] begegnet [wem:einem Fuchs]."],
    // Wer oder was?, Wem? und Wen oder was?
    ["geben", "gibt|gab|hat gegeben", "[wer:Lea] gibt [wem:dem Hund] [wen:einen Knochen]."],
    ["schenken", "schenkt|schenkte|hat geschenkt", "[wer:Opa] schenkt [wem:seiner Enkelin] [wen:ein Buch]."],
    ["zeigen", "zeigt|zeigte|hat gezeigt", "[wer:Mia] zeigt [wem:ihrer Freundin] [wen:das neue Velo]."],
    ["bringen", "bringt|brachte|hat gebracht", "[wer:Der Pöstler] bringt [wem:dem Nachbarn] [wen:ein Paket]."],
    ["schicken", "schickt|schickte|hat geschickt", "[wer:Lina] schickt [wem:ihrer Tante] [wen:eine Karte]."],
    ["erzählen", "erzählt|erzählte|hat erzählt", "[wer:Grossmutter] erzählt [wem:den Kindern] [wen:eine Geschichte]."],
    ["leihen", "leiht|lieh|hat geliehen", "[wer:Ben] leiht [wem:seinem Freund] [wen:einen Bleistift]."],
    ["erklären", "erklärt|erklärte|hat erklärt", "[wer:Die Lehrerin] erklärt [wem:der Klasse] [wen:die Aufgabe]."],
    // Wer oder was? und Wo?
    ["wohnen", "wohnt|wohnte|hat gewohnt", "[wer:Meine Tante] wohnt [wo:in Luzern]."],
    ["liegen", "liegt|lag|", "[wer:Der Ball] liegt [wo:unter dem Bett]."],
    ["sitzen", "sitzt|sass|", "[wer:Die Katze] sitzt [wo:auf dem Dach]."],
    ["stehen", "steht|stand|", "[wer:Die Vase] steht [wo:auf dem Tisch]."],
    ["hängen", "hängt|hing|", "[wer:Das Bild] hängt [wo:an der Wand]."],
    // Wer oder was?, Wen oder was? und Wohin?
    ["legen", "legt|legte|hat gelegt", "[wer:Tim] legt [wen:das Buch] [wohin:auf den Tisch]."],
    ["stellen", "stellt|stellte|hat gestellt", "[wer:Mama] stellt [wen:die Milch] [wohin:in den Kühlschrank]."],
    ["setzen", "setzt|setzte|hat gesetzt", "[wer:Papa] setzt [wen:das Baby] [wohin:in den Kinderwagen]."],
    ["stecken", "steckt|steckte|hat gesteckt", "[wer:Lea] steckt [wen:den Brief] [wohin:in den Briefkasten]."],
  ],
};
