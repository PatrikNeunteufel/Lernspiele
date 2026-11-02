/* Texte für den Korrektur-Stift — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan 21 D.4.F.1 (Text in Bezug auf Rechtschreibung überarbeiten): c (OP Ende 4. Klasse)
   ie, e/ä, Komma bei Aufzählungen; d (GA Ende 6. Klasse) die meisten Unkorrektheiten finden,
   Punkt für Punkt: Wortstamm, Doppelkonsonant, Grossschreibung typischer abstrakter Nomen (Glück),
   Komma zwischen leicht erkennbaren Verbgruppen; e (3. Zyklus) Grossschreibung abgeleiteter Nomen
   (Frei-heit, Entdeck-ung). D.5.E.1.d Regeln mit Ausnahmen, D.5.E.1.f (3. Zyklus) Nomen aus Verben
   nach Präposition und Artikel (beim Essen).
   das/dass kommt nicht vor: Der Lehrplan nennt es in D.4.F.1 und D.5.E.1 bis zum 3. Zyklus nicht.

   Schreibweise: Jede MÖGLICHE Fehlerstelle steht in geschweiften Klammern, die richtige Form zuerst:
     {richtig|falsch}            zum Beispiel {Wald|wald}, {Käse,|Käse} (Komma fehlt), {Igel.|Igel}
     {richtig|falsch|#verbnomen} Nomen aus einem Verb (beim Schwimmen) — diese Art wird angegeben
   Ein Satzzeichen direkt nach der Klammer gehört zum Wort, aber nicht zur Fehlerstelle: {Hund|Hunt},
   Das Spiel wählt je Aufgabe einige Stellen aus (so viele, wie die Stufe verlangt) und zeigt nur dort
   die falsche Form; alle anderen Stellen stehen richtig da. Der Text mit lauter richtigen Formen muss
   vollständig richtig sein. Jede falsche Form hat genau eine richtige Verbesserung.
   Die Art eines Fehlers erkennt das Spiel selbst (Gross/Klein, ie, ä/äu, Doppelkonsonant, ck/tz,
   Endung d/t, g/k, -ig/-lich, f/v, Komma, Satzende) und meldet Stellen, die zu keiner Art passen.
   Komma fehlt oder steht zu viel nur bei Aufzählungen und zwischen Verbgruppen; ein Satzzeichen am
   Satzende fehlt nur am Schluss des Texts (sonst wäre unklar, ob ein Punkt fehlt oder ein Wort klein
   gehört).

   laenge: kurz (3–4 Sätze, Stufe 1–2) · mittel (4–6 Sätze, Stufe 3–4) · lang (6–7 Sätze, Stufe 5–6).
   Schweizer Schreibweise (ss statt ß). Eine Liste: „texte“ (Katalog, Eintrag korrektur-stift). */

const KORREKTUR_TEXTE = [
  // ---------- kurz ----------
  { id: "waldtag", laenge: "kurz",
    text: "Am Samstag gehen wir in den {Wald|wald}. Wir nehmen Brot, {Käse,|Käse} Äpfel und {Wasser|Waser} mit. Im Wald {suchen|Suchen} wir {Spuren|spuren} von {Tieren|Tiren}. Am Abend sind wir müde und {glücklich|glücklig}." },
  { id: "pause", laenge: "kurz",
    text: "In der Pause {spielen|Spielen} wir auf dem Platz. Ein paar Kinder {rennen|renen} um die Wette. Andere sitzen auf der {Bank|bank} und essen ihr {Znüni|znüni}: Brot, {Nüsse,|Nüsse} {Äpfel|Epfel} oder {Käse.|Käse}" },
  { id: "katze", laenge: "kurz",
    text: "Unsere {Katze|Kaze} heisst Mimi. Sie {schläft|schleft} gern auf dem {Sofa|sofa}. Am Morgen {bekommt|bekomt} sie {Futter|futter} und frisches Wasser. Wenn sie {Hunger|hunger} hat, miaut sie {laut|Laut}." },
  { id: "markt", laenge: "kurz",
    text: "Heute gehen wir auf den {Markt|markt}. Wir {kaufen|Kaufen} Tomaten, {Gurken,|Gurken} Zwiebeln und {Kartoffeln|Kartofeln}. Ein Bauer verkauft {frischen|frieschen} Käse. Er schenkt mir einen roten {Apfel.|Apfel}" },
  { id: "badi", laenge: "kurz",
    text: "Im {Sommer|Somer} gehen wir oft in die Badi. Am Morgen ist das Wasser noch {kalt|kald}. Mein {Bruder|bruder} springt vom {Sprungbrett|Sprungbret}. Danach {essen|Essen} wir ein {Glace.|Glace}" },
  { id: "herbst", laenge: "kurz",
    text: "Im Herbst werden die {Blätter|Bletter} bunt. Sie {fallen|falen} von den {Bäumen|Beumen}. Wir sammeln {Kastanien,|Kastanien} Eicheln und bunte Blätter. Daraus {basteln|Basteln} wir einen {Igel.|Igel}" },
  { id: "velo", laenge: "kurz",
    text: "Mein {Velo|velo} steht im Keller. Heute {pumpe|Pumpe} ich die Reifen auf und {putze|puze} die {Kette|Kete}. Auch {Bremsen,|Bremsen} Licht und {Klingel|klingel} prüfe ich. Jetzt kann ich wieder {losfahren.|losfahren}" },
  { id: "regentag", laenge: "kurz",
    text: "Draussen {regnet|Regnet} es schon den ganzen Tag. Wir bleiben in der {Stube|stube} und {spielen|spilen} ein {Spiel|Spil}. Meine Schwester {gewinnt|gewint} zweimal. Zum Zvieri gibt es Tee und {Kuchen.|Kuchen}" },

  // ---------- mittel ----------
  { id: "ausflug", laenge: "mittel",
    text: "Letzte Woche hat unsere Klasse einen Ausflug auf den {Berg|berg} gemacht. Wir sind früh {losgegangen,|losgegangen} weil der Weg lang war. Unterwegs haben wir {Gämsen,|Gämsen} Murmeltiere und einen Adler gesehen. Oben hatten alle grossen {Hunger|hunger} und {assen|asen} ihr Picknick. Am Abend {waren|Waren} wir müde, aber {glücklich|glücklig}." },
  { id: "match", laenge: "mittel",
    text: "Am Mittwoch hatte unser Team ein wichtiges {Spiel|Spil}. Vor dem Anpfiff hatte ich ein bisschen {Angst|angst}. Nach zehn Minuten {schoss|schos} Mia das erste {Tor|tor}. Wir {kämpften|kempften} bis zum Schluss. Als der Schiedsrichter {abpfiff,|abpfiff} stand es zwei zu eins für uns. Die {Freude|freude} war riesig." },
  { id: "zahnarzt", laenge: "mittel",
    text: "Heute musste ich zum {Zahnarzt|Zahnartzt}. Im Wartezimmer {wartete|Wartete} ich mit meiner {Mutter|Muter}. Ich war {nervös,|nervös} weil ich ein {Loch|loch} im Zahn hatte. Doch die {Zahnärztin|Zahnerztin} war sehr {nett|net}. Sie {flickte|flikte} den Zahn schnell und ohne {Schmerzen|schmerzen}." },
  { id: "geburtstag", laenge: "mittel",
    text: "Am Sonntag feierte mein {Grossvater|grossvater} seinen 70. Geburtstag. Die ganze {Familie|Famielie} kam zu Besuch. Es gab {Kuchen,|Kuchen} Früchte und Tee. Grossvater erzählte {lustige|lustiche} Geschichten aus seiner {Kindheit|kindheit}. Vor {Freude|freude} lachte er laut, als wir ein Lied {sangen.|sangen}" },
  { id: "bibliothek", laenge: "mittel",
    text: "Jeden Dienstag gehe ich in die {Bibliothek|bibliothek}. Dort {leihe|Leihe} ich Bücher aus. Ich lese am liebsten {Krimis,|Krimis} Comics und Sachbücher. Wenn ein Buch spannend {ist,|ist} kann ich kaum aufhören. Mein Lieblingsbuch handelt von einem {Hund|Hunt}, der {zaubern|Zaubern} {kann.|kann}" },
  { id: "gewitter", laenge: "mittel",
    text: "Gestern Abend gab es ein starkes {Gewitter|gewitter}. Es {blitzte|blizte} und donnerte laut. Mein kleiner Bruder hatte {Angst|angst} und kam zu mir ins {Bett|Bet}. Ich erklärte {ihm,|ihm} dass wir im Haus sicher sind. Bald {schlief|schlif} er wieder {ein.|ein}" },
  { id: "suppe", laenge: "mittel",
    text: "Am Samstag {koche|Koche} ich mit meinem Vater. Wir machen eine {Suppe|Supe} mit {Rüebli,|Rüebli} Lauch und Kartoffeln. Zuerst waschen wir das {Gemüse|gemüse}. Dann schneiden wir alles in kleine {Stücke|Stüke}. Während die Suppe {kocht,|kocht} decke ich den {Tisch.|Tisch}" },
  { id: "balu", laenge: "mittel",
    text: "Unsere Nachbarin hat einen jungen {Hund|hund} aus dem Tierheim geholt. Er heisst Balu und ist sehr {verspielt|ferspielt}. Wenn er einen Ball {sieht,|sieht} rennt er sofort los. Vor grossen Hunden hat er keine {Angst|angst}. Ich darf ihn manchmal {spazieren|spatzieren} {führen.|führen}" },

  // ---------- lang ----------
  { id: "lager", laenge: "lang",
    text: "Im Mai fuhr unsere Klasse ins {Klassenlager|Klasenlager} nach Graubünden. Schon beim {Einsteigen|einsteigen|#verbnomen} in den Zug war die {Freude|freude} gross. Im Lagerhaus {teilten|Teilten} wir zuerst die Zimmer auf. Jeden Tag gab es eine neue {Überraschung|überraschung}. Wir {wanderten,|wanderten} spielten und bastelten zusammen. Am letzten Abend gab es ein {Fest,|Fest} weil alle so gut mitgeholfen {hatten.|hatten}" },
  { id: "museum", laenge: "lang",
    text: "Letzte Woche besuchten wir ein {Museum|Musseum} über die {Eisenbahn|eisenbahn}. Wir kamen aus dem {Staunen|staunen|#verbnomen} kaum heraus. Mitten in der Halle stand eine alte {Dampflok|dampflok}. Eine Frau erklärte uns die {Bedeutung|bedeutung} der Bahn. Früher {brauchte|Brauchte} man für eine Reise viel mehr {Zeit,|Zeit} weil die Züge langsamer waren. Zum Schluss durften wir selbst einen {Fahrschein|fahrschein} {drucken.|drucken}" },
  { id: "waldputz", laenge: "lang",
    text: "Unsere Klasse hat einen Tag lang den Wald {sauber|Sauber} gemacht. Wir fanden {Flaschen,|Flaschen} Dosen und viel {Papier|Pappier}. Die {Sauberkeit|sauberkeit} des Waldes ist wichtig für die Tiere. Beim {Sammeln|sammeln|#verbnomen} trugen alle {Handschuhe|handschuhe}. Am Ende waren drei {Säcke|Secke} voll. Wir {hoffen,|hoffen} dass alle ihren {Abfall|Abfal} wieder {mitnehmen.|mitnehmen}" },
  { id: "nachbarn", laenge: "lang",
    text: "Seit dem Sommer wohnt eine neue Familie in unserem {Haus|haus}. Die Kinder heissen Noah und Lara und {kommen|komen} aus Portugal. Am Anfang war die {Verständigung|verständigung} nicht einfach. Inzwischen spielen wir oft {zusammen,|zusammen} weil wir dieselben {Spiele|Spile} mögen. Beim {Fussballspielen|fussballspielen|#verbnomen} ist Lara die Beste. Unsere {Freundschaft|freundschaft} ist ein grosses {Glück|glück}." },
  { id: "meer", laenge: "lang",
    text: "In den Ferien fuhren wir mit dem Zug ans {Meer|meer}. Die Reise dauerte fast einen ganzen {Tag|Tak}. Am Strand {bauten|Bauten} wir eine grosse {Sandburg|Sandburk}. Beim {Schwimmen|schwimmen|#verbnomen} sahen wir kleine {Fische|Fiesche}. Abends {assen|asen} wir {Pizza,|Pizza} Pasta oder Fisch. Die {Freiheit|freiheit} am Meer hat mir sehr {gefallen.|gefallen}" },
  { id: "bohnen", laenge: "lang",
    text: "Für ein Experiment haben wir {Bohnen|bohnen} in zwei Töpfe gepflanzt. Den einen Topf stellten wir ans Fenster, den anderen in einen dunklen {Schrank|Schranck}. Jeden Tag {gaben|Gaben} wir beiden Töpfen gleich viel {Wasser|Waser}. Nach einer Woche war die {Überraschung|überraschung} gross. Die Pflanze im Dunkeln war lang und {bleich|Bleich} geworden. Daraus schlossen {wir,|wir} dass Pflanzen zum {Wachsen|wachsen|#verbnomen} Licht {brauchen.|brauchen}" },
  { id: "schulweg", laenge: "lang",
    text: "Auf dem Schulweg muss man {vorsichtig|forsichtig} sein. Vor dem {Überqueren|überqueren|#verbnomen} der Strasse schaut man nach links und rechts. Am {Fussgängerstreifen|fussgängerstreifen} wartet {man,|man} bis die Autos stehen. Im Winter ist eine {Leuchtweste|leuchtweste} wichtig, weil es früh dunkel wird. Mit dem {Velo|Felo} {fährt|fehrt} man rechts und gibt Handzeichen. Die {Sicherheit|sicherheit} ist das {Wichtigste.|Wichtigste}" },
  { id: "theater", laenge: "lang",
    text: "Am Ende des Schuljahres spielte unsere Klasse {Theater|theater}. Wochenlang übten wir unsere {Rollen|Rolen}. Vor der {Aufführung|aufführung} hatte ich {Herzklopfen|herzklopfen}. Beim {Warten|warten|#verbnomen} hinter dem Vorhang zitterten meine {Knie|Kni}. Doch als das Spiel {begann,|begann} war die {Nervosität|nervosität} weg. Das {Publikum|Publickum} klatschte lange. Am Schluss {verbeugten|Verbeugten} wir uns {stolz|Stolz}." },
];
