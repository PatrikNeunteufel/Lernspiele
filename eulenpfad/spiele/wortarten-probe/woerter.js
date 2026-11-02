/* Sätze für die Wortarten-Probe — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan D.5.D.1: b (Orientierungspunkt 2. Zyklus) Nomen, Verb, Adjektiv mit inhaltlichen Proben;
   c (Grundanspruch Ende 6. Klasse) Nomen, Verb und Adjektiv mithilfe formaler Proben bestimmen;
   d (3. Zyklus) Pronomen in einer Liste nachschlagen, Begriff Partikel; e Präpositionen mit einer
   reduzierten Liste benennen; f Pronomen mit der Pronomenliste bestimmen, den Rest als Partikel
   benennen, Präposition und Konjunktion in typischen Fällen bestimmen.
   Nach Schweizer Schulgrammatik: Adjektive, die beim Verb stehen („singt laut“), sind Adjektive;
   Präpositionen, Konjunktionen und alle unveränderlichen Wörter sind Partikeln. Artikel (der, die,
   das, ein) werden nie abgefragt. Alle Sätze selbst geschrieben. Schweizer Schreibweise (ss).

   Schreibweise je Eintrag: [Gruppe, Satz, Wortart, Beleg]
   - Im Satz steht das abgefragte Wort in eckigen Klammern: „Das [Lachen] tut gut.“ Genau eines.
   - Wortart: N Nomen, V Verb, A Adjektiv, PRO Pronomen, PRAEP Präposition, KONJ Konjunktion,
     PART andere Partikel. Ein „!“ davor heisst Falle (das Wort gibt es auch als andere Wortart,
     oder der Satz lockt zu einer falschen Probe); dann nennt der Hinweis die Falle.
   - Beleg: was die richtige Probe zeigt — Nomen mit Begleiter („das Lachen“), Verb mit ich/du
     („ich lache, du lachst“), Adjektiv gesteigert („lauter, am lautesten“). Pronomen und Partikeln
     brauchen keinen Beleg (Pronomenliste, unveränderlich).
   Gruppe, geprüft vom Spiel (pruefeAufgabe):
     1  Stufe 1: typische Nomen, Verben, Adjektive in einfachen Sätzen
     2  Stufe 2: veränderte Formen (Mehrzahl, Präteritum, Vergleichsform)
     3  Stufe 3: Fallen — nominalisierte Verben und Adjektive, Adjektiv vor dem Nomen, Infinitiv
     4  Stufe 4: dasselbe Wort als zwei Wortarten (die Fliegen — sie fliegen)
     5  Stufe 5: dazu Pronomen und Partikeln (Präposition, Konjunktion, andere)
     6  Stufe 6 (mit 4 und 5): Doppelgänger mit Pronomen und Partikeln (sein Velo — muss sein)

   Inhaltsliste (Entscheid L4 a): eine Liste „woerter“; der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag wortarten-probe, Feld listen). */

/** Pronomenliste (reduziert, wie im Lehrplan D.5.D.1.d/f „in einer Liste nachschlagen“). */
const PROBE_PRONOMEN = ["ich", "du", "er", "sie", "es", "wir", "ihr", "mich", "dich", "ihn", "uns", "euch",
  "mir", "dir", "ihm", "ihnen", "mein", "dein", "sein", "unser", "euer", "dieser", "jener", "jemand", "niemand"];

const PROBE_SAETZE = [
  // ---------- Gruppe 1: typische Wörter ----------
  [1, "Der [Hund] wartet vor der Tür.", "N", "der Hund"],
  [1, "Die [Lehrerin] erklärt die Aufgabe.", "N", "die Lehrerin"],
  [1, "Das [Fenster] steht offen.", "N", "das Fenster"],
  [1, "Der [Apfel] liegt auf dem Tisch.", "N", "der Apfel"],
  [1, "Sein [Velo] ist ganz neu.", "N", "das Velo"],
  [1, "Wir gehen über die [Brücke].", "N", "die Brücke"],
  [1, "Am Himmel zieht eine [Wolke] vorbei.", "N", "die Wolke"],
  [1, "Ich finde meinen [Schlüssel] nicht.", "N", "der Schlüssel"],
  [1, "Mein Bruder [spielt] Gitarre.", "V", "ich spiele, du spielst"],
  [1, "Wir [lesen] jeden Abend.", "V", "ich lese, du liest"],
  [1, "Lena [schreibt] einen Brief.", "V", "ich schreibe, du schreibst"],
  [1, "Papa [kocht] heute Spaghetti.", "V", "ich koche, du kochst"],
  [1, "Wir [wohnen] im dritten Stock.", "V", "ich wohne, du wohnst"],
  [1, "Das Baby [lacht].", "V", "ich lache, du lachst"],
  [1, "Tim [baut] eine Hütte.", "V", "ich baue, du baust"],
  [1, "Die Katze [trinkt] Wasser.", "V", "ich trinke, du trinkst"],
  [1, "Der Tee ist [heiss].", "A", "heisser, am heissesten"],
  [1, "Die Nacht ist [kalt].", "A", "kälter, am kältesten"],
  [1, "Der Koffer ist [schwer].", "A", "schwerer, am schwersten"],
  [1, "Das Kissen ist [weich].", "A", "weicher, am weichsten"],
  [1, "Mein Bruder ist [gross].", "A", "grösser, am grössten"],
  [1, "Die Musik ist [laut].", "A", "lauter, am lautesten"],
  [1, "Der Weg ist [kurz].", "A", "kürzer, am kürzesten"],
  [1, "Die Suppe ist [warm].", "A", "wärmer, am wärmsten"],

  // ---------- Gruppe 2: veränderte Formen ----------
  [2, "Im Garten stehen drei [Bäume].", "N", "der Baum, die Bäume"],
  [2, "Die [Kinder] spielen draussen.", "N", "das Kind, die Kinder"],
  [2, "Wir füttern die [Enten].", "N", "die Ente, die Enten"],
  [2, "Ich höre die [Vögel].", "N", "der Vogel, die Vögel"],
  [2, "Auf dem Tisch liegen zwei [Bücher].", "N", "das Buch, die Bücher"],
  [2, "Mit den [Freunden] macht es Spass.", "N", "der Freund, die Freunde"],
  [2, "Sie trägt neue [Schuhe].", "N", "der Schuh, die Schuhe"],
  [2, "Wir pflücken [Blumen].", "N", "die Blume, die Blumen"],
  [2, "Gestern [sprang] die Katze auf das Dach.", "V", "ich sprang, du sprangst"],
  [2, "Der Zug [fuhr] pünktlich ab.", "V", "ich fuhr, du fuhrst"],
  [2, "Du [rennst] sehr schnell.", "V", "ich renne, du rennst"],
  [2, "Am Abend [assen] wir Pizza.", "V", "ich ass, wir assen"],
  [2, "Ihr [singt] sehr schön.", "V", "ich singe, du singst"],
  [2, "Die Kinder [lachten] lange.", "V", "ich lachte, du lachtest"],
  [2, "Er [las] ein spannendes Buch.", "V", "ich las, wir lasen"],
  [2, "Sie [kam] zu spät.", "V", "ich kam, wir kamen"],
  [2, "Heute ist es [kälter] als gestern.", "A", "kalt, kälter, am kältesten"],
  [2, "Lea rennt [schneller] als Tim.", "A", "schnell, schneller, am schnellsten"],
  [2, "Dieser Weg ist [länger].", "A", "lang, länger, am längsten"],
  [2, "Sie spricht [leiser] als ich.", "A", "leise, leiser, am leisesten"],
  [2, "Der Rucksack wird immer [schwerer].", "A", "schwer, schwerer, am schwersten"],
  [2, "Opa erzählt [lustiger] als Oma.", "A", "lustig, lustiger, am lustigsten"],
  [2, "Mein Turm ist [höher] als deiner.", "A", "hoch, höher, am höchsten"],
  [2, "Nach dem Training bin ich [müder] als sonst.", "A", "müde, müder, am müdesten"],

  // ---------- Gruppe 3: Fallen ----------
  [3, "Das [Lachen] tut gut.", "!N", "das Lachen"],
  [3, "Beim [Essen] spricht man nicht mit vollem Mund.", "!N", "das Essen (beim = bei dem)"],
  [3, "Zum [Lesen] brauche ich Ruhe.", "!N", "das Lesen (zum = zu dem)"],
  [3, "Das [Warten] dauert lange.", "!N", "das Warten"],
  [3, "Ich freue mich aufs [Schwimmen].", "!N", "das Schwimmen (aufs = auf das)"],
  [3, "Das [Malen] macht mir Spass.", "!N", "das Malen"],
  [3, "Nach dem [Turnen] duschen wir.", "!N", "das Turnen"],
  [3, "Das [Gute] daran: Wir haben frei.", "!N", "das Gute"],
  [3, "Der [Kleine] schläft schon.", "!N", "der Kleine"],
  [3, "Das [Blau] des Himmels ist schön.", "!N", "das Blau"],
  [3, "Die [Alten] erzählen von früher.", "!N", "die Alten"],
  [3, "Das [Schönste] war das Feuer.", "!N", "das Schönste"],
  [3, "Der [kleine] Hund bellt.", "!A", "klein, kleiner, am kleinsten"],
  [3, "Wir wohnen in einem [alten] Haus.", "!A", "alt, älter, am ältesten"],
  [3, "Die [müden] Kinder schlafen.", "!A", "müde, müder, am müdesten"],
  [3, "Das [warme] Wasser tut gut.", "!A", "warm, wärmer, am wärmsten"],
  [3, "Der Vogel singt [laut].", "A", "lauter, am lautesten"],
  [3, "Sie rechnet [schnell].", "A", "schneller, am schnellsten"],
  [3, "Morgen wollen wir [baden].", "!V", "ich bade, du badest"],
  [3, "Kannst du mir [helfen]?", "!V", "ich helfe, du hilfst"],
  [3, "Ich lerne [schwimmen].", "!V", "ich schwimme, du schwimmst"],
  [3, "Wir [essen] um sechs Uhr.", "V", "ich esse, du isst"],
  [3, "Leise [schleicht] die Katze.", "V", "ich schleiche, du schleichst"],
  [3, "Wir möchten draussen [spielen].", "!V", "ich spiele, du spielst"],

  // ---------- Gruppe 4: dasselbe Wort, zwei Wortarten ----------
  [4, "Die [Fliegen] summen am Fenster.", "!N", "die Fliege, die Fliegen"],
  [4, "Die Vögel [fliegen] nach Süden.", "!V", "ich fliege, du fliegst"],
  [4, "Mein [Arm] tut weh.", "!N", "der Arm"],
  [4, "Die Familie war früher [arm].", "!A", "ärmer, am ärmsten"],
  [4, "Das [Essen] ist fertig.", "!N", "das Essen"],
  [4, "Heute [essen] wir im Garten.", "!V", "ich esse, du isst"],
  [4, "Das [Leben] im Meer ist bunt.", "!N", "das Leben"],
  [4, "Fische [leben] im Wasser.", "!V", "ich lebe, du lebst"],
  [4, "Die [Kosten] für das Lager sind gering.", "!N", "die Kosten"],
  [4, "Die Äpfel [kosten] zwei Franken.", "!V", "es kostet, sie kosten"],
  [4, "Wir hören laute [Stimmen].", "!N", "die Stimme, die Stimmen"],
  [4, "Die Zahlen [stimmen].", "!V", "es stimmt, sie stimmen"],
  [4, "Die [Reisen] waren spannend.", "!N", "die Reise, die Reisen"],
  [4, "Wir [reisen] nach Italien.", "!V", "ich reise, du reist"],
  [4, "Das [Laufen] macht mich fit.", "!N", "das Laufen"],
  [4, "Die Kinder [laufen] zur Schule.", "!V", "ich laufe, du läufst"],
  [4, "Das [Schwimmen] ist gesund.", "!N", "das Schwimmen"],
  [4, "Enten [schwimmen] auf dem See.", "!V", "ich schwimme, du schwimmst"],
  [4, "Ein [Kranker] liegt im Bett.", "!N", "der Kranke, ein Kranker"],
  [4, "Meine Schwester ist [krank].", "!A", "kränker, am kränksten"],
  [4, "Der [Fremde] fragt nach dem Weg.", "!N", "der Fremde"],
  [4, "Die Stadt ist mir noch [fremd].", "!A", "fremder, am fremdesten"],
  [4, "Wir sammeln [Spenden].", "!N", "die Spende, die Spenden"],
  [4, "Viele Leute [spenden] Geld.", "!V", "ich spende, du spendest"],
  [4, "Die [Wetten] gingen hin und her.", "!N", "die Wette, die Wetten"],
  [4, "Wir [wetten] um ein Glace.", "!V", "ich wette, du wettest"],

  // ---------- Gruppe 5: Pronomen und Partikeln ----------
  [5, "[Sie] kommt am Sonntag zu Besuch.", "PRO"],
  [5, "Gib [mir] bitte das Salz.", "PRO"],
  [5, "Das ist [unser] Haus.", "PRO"],
  [5, "Kennst du [ihn]?", "PRO"],
  [5, "[Wir] gehen ins Kino.", "PRO"],
  [5, "[Dieser] Rucksack gehört Lea.", "PRO"],
  [5, "Hat [jemand] meine Mütze gesehen?", "PRO"],
  [5, "Ich habe [euch] überall gesucht.", "PRO"],
  [5, "Ist das [dein] Velo?", "PRO"],
  [5, "Die Katze sitzt [auf] dem Dach.", "PRAEP"],
  [5, "Wir fahren [mit] dem Bus.", "PRAEP"],
  [5, "Das Geschenk ist [für] dich.", "PRAEP"],
  [5, "Er wartet [vor] der Schule.", "PRAEP"],
  [5, "[Nach] der Schule gehe ich heim.", "PRAEP"],
  [5, "Der Ball rollt [unter] das Auto.", "PRAEP"],
  [5, "Ich bleibe zu Hause, [weil] ich krank bin.", "KONJ"],
  [5, "Lea [und] Tim spielen Karten.", "KONJ"],
  [5, "Wir gehen hinaus, [wenn] es nicht regnet.", "KONJ"],
  [5, "Ich weiss, [dass] du es kannst.", "KONJ"],
  [5, "Er ist müde, [aber] er spielt weiter.", "KONJ"],
  [5, "[Heute] scheint die Sonne.", "PART"],
  [5, "Wir wohnen [hier].", "PART"],
  [5, "Ich habe [leider] keine Zeit.", "PART"],
  [5, "Er kommt [nie] zu spät.", "PART"],
  [5, "Meine [Freundin] ruft an.", "N", "die Freundin"],
  [5, "Wir [suchen] den Weg.", "V", "ich suche, du suchst"],
  [5, "Das Wasser im Bach ist [klar].", "A", "klarer, am klarsten"],

  // ---------- Gruppe 6: Doppelgänger mit Pronomen und Partikeln ----------
  [6, "Er putzt [sein] Velo.", "!PRO"],
  [6, "Das muss nicht [sein].", "!V", "ich bin, du bist"],
  [6, "Am [Morgen] ist es noch kühl.", "!N", "der Morgen (am = an dem)"],
  [6, "Wir sehen uns [morgen].", "!PART"],
  [6, "[Laut] Wetterbericht wird es warm.", "!PRAEP"],
  [6, "Die Musik ist viel zu [laut].", "!A", "lauter, am lautesten"],
  [6, "[Während] des Essens redet niemand.", "!PRAEP"],
  [6, "[Während] ich lese, ist es still.", "!KONJ"],
  [6, "[Seit] Montag regnet es.", "!PRAEP"],
  [6, "[Seit] ich hier wohne, gehe ich zu Fuss.", "!KONJ"],
  [6, "Aus [Trotz] blieb er sitzen.", "!N", "der Trotz"],
  [6, "[Trotz] des Regens spielen wir draussen.", "!PRAEP"],
  [6, "Vielen [Dank] für das Geschenk!", "!N", "der Dank"],
  [6, "[Dank] deiner Hilfe sind wir fertig.", "!PRAEP"],
  [6, "Wir warten, [bis] der Bus kommt.", "!KONJ"],
  [6, "Ich bleibe [bis] Freitag.", "!PRAEP"],
];
