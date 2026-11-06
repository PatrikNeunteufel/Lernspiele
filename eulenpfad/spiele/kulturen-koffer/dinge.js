/* Kulturen, Dinge und Fakten für den Kulturen-Koffer — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG NMG.9.3 (Wortlaut sg.lehrplan.ch, gelesen 2026-11-03):
     b „aus Ruinen oder Bauten Vorstellungen entwickeln, wie diese in der Vergangenheit ausgesehen haben“;
     c (GA 1. Zyklus) „aus Funden und alten Gegenständen Vorstellungen über das Leben einer früheren
       Gesellschaft gewinnen (z.B. Steinzeit, Römer, Spätmittelalter)“;
     d (2. Zyklus) „sich aus Geschichten, Erzählungen, Bildern ein Bild über eine vergangene Kultur machen
       (z.B. China, Altes Ägypten, Römisches Imperium)“;
     e (GA/OP) „aus Sachtexten, Karten, Quellen ein differenziertes Bild einer historischen Epoche erarbeiten“.
   Alles selbst geschrieben, Schweizer Schreibweise (ss). Nur allgemein bekannte Fakten, stark vereinfacht;
   keine Jahreszahlen ausser grob („vor über 2000 Jahren“). Einzelne Orte nur Augusta Raurica und Aventicum
   als Römerstädte in der Schweiz. Jede Angabe ist ZU PRÜFEN — Anmerkungen mit „ZU PRÜFEN:“ stehen bei den
   unsichersten Einträgen.

   Inhaltsliste: eine Liste „dinge“; der Prüfstand steht im Katalog (spiele/gemeinsam/katalog.js, Eintrag
   kulturen-koffer, Feld listen). Alle Listen dieser Datei gehören zu ihr: Kulturen, Dinge, Heute-Dinge,
   Erzählsätze, Aussagen, „Gab es das schon?“, Quellen und Rätsel.

   Schreibweise je Eintrag:
   - Kultur: { id, name, bild, kurz, bei, leute, schweiz, farbe }
       kurz: ein Halbsatz „Die … kurz“ ohne die Namen anderer Kulturen (dient als Tipp und Hinweis)
       bei: Ortsangabe für Fragen („bei den Römern“, „im Alten Ägypten“); leute: wer das war („Die alten Ägypter“)
       schweiz: true = diese Kultur lebte in der Schweiz
   - Ding: { bild, name, kultur, art, ab, alt, auch, umschreibung }
       art: ding (Gegenstand), bau (Bauwerk, Ort), beruf, wort (Begriff ohne Bild)
       ab: ab welcher Stufe (1–6) das Ding zum Zuordnen kommt; in Stufe 1 und 2 nur Dinge mit Bild
       alt: true = eindeutig „von früher“, für Stufe 1 (Früher oder heute?); braucht ein Bild
       auch: Kulturen, zu denen das Ding ebenfalls passt (sie stehen dann nie als Korb daneben)
       umschreibung: Tipp ohne den Namen des Dings und ohne den Namen der Kultur
   - Heute-Ding (Stufe 1): { bild, name, umschreibung } — braucht Strom oder einen Motor
   - Erzählsatz (Stufe 3): { satz, kultur } — Ich-Satz ohne den Namen der Kultur
   - Aussage (Stufe 4): { text, wahr, kultur, grund } — nur eindeutige Fälle; grund erklärt die Lösung
   - Gab es das schon? (Stufe 4): { ding, bild, kultur, ja, grund } — nur eindeutige Fälle
   - Quelle (Stufe 5): { text, bild, art, kultur } mit art fund (Fundstück), bau (Bauwerk), bild (Bild), text (Text);
       der Text nennt die Quellenart nicht beim Namen
   - Rätsel (Stufe 6): { kultur, hinweise: [drei Sätze] } — ohne den Namen der Kultur, vom Allgemeinen zum Konkreten
   Kulturen China und Griechen kommen erst ab Stufe 5 (Aussagen, Fragen und Quellen zu ihnen ebenso). */

const KK_KULTUREN = [
  { id: "pfahlbauer", name: "Pfahlbauer", bild: "svg:pfahlbau", bei: "bei den Pfahlbauern", leute: "Die Pfahlbauer", schweiz: true, farbe: "var(--deko-5)",
    kurz: "lebten vor mehreren tausend Jahren an Seen in der Schweiz, in Häusern auf Pfählen" },
  { id: "roemer", name: "Römer", bild: "🛡️", bei: "bei den Römern", leute: "Die Römer", schweiz: true, farbe: "var(--deko-3)",
    kurz: "kamen vor über 2000 Jahren in die Schweiz und bauten Städte, Strassen und warme Bäder" },
  { id: "aegypten", name: "Altes Ägypten", bild: "svg:pyramiden", bei: "im Alten Ägypten", leute: "Die alten Ägypter", schweiz: false, farbe: "var(--deko-6)",
    kurz: "lebten vor mehreren tausend Jahren am Fluss Nil, bauten Pyramiden und hatten einen Pharao als König" },
  { id: "china", name: "Altes China", bild: "🐉", bei: "im Alten China", leute: "Die Menschen im Alten China", schweiz: false, farbe: "var(--deko-1)",
    kurz: "lebten vor über 2000 Jahren weit im Osten, bauten eine riesige Mauer und erfanden Papier und Kompass" },
  { id: "griechen", name: "Alte Griechen", bild: "svg:tempel", bei: "bei den alten Griechen", leute: "Die alten Griechen", schweiz: false, farbe: "var(--deko-2)",
    kurz: "lebten vor über 2000 Jahren am Meer, bauten Tempel mit Säulen und erfanden die Olympischen Spiele" },
];

const KK_DINGE = [
  // ---------- Pfahlbauer (Jungsteinzeit und Bronzezeit, Schweiz) ----------
  { bild: "svg:pfahlbau", name: "Haus auf Pfählen", kultur: "pfahlbauer", art: "bau", ab: 1, alt: true,
    umschreibung: "ein Haus aus Holz, das auf langen Stangen über dem Wasser oder dem feuchten Ufer steht" },
  { bild: "🛶", name: "Einbaum", kultur: "pfahlbauer", art: "ding", ab: 1, alt: true,
    umschreibung: "ein Boot, das aus einem einzigen Baumstamm ausgehöhlt wurde" },
  { bild: "🪓", name: "Steinbeil", kultur: "pfahlbauer", art: "ding", ab: 1, alt: true,
    umschreibung: "ein Werkzeug zum Holzhacken mit einer geschliffenen Klinge aus Stein" },
  { bild: "🪵", name: "Holzpfahl", kultur: "pfahlbauer", art: "ding", ab: 2,
    umschreibung: "ein langer Stamm, der in den Seeboden geschlagen wurde und ein Haus trägt" },
  { bild: "🧺", name: "Wand aus Flechtwerk", kultur: "pfahlbauer", art: "bau", ab: 2, alt: true,
    umschreibung: "eine Hauswand aus geflochtenen Ästen, mit Lehm verschmiert" }, // ZU PRÜFEN: Flechtwerkwände mit Lehm
  { bild: "🏞️", name: "Dorf am Seeufer", kultur: "pfahlbauer", art: "bau", ab: 2,
    umschreibung: "ein Dorf aus Holzhäusern, das direkt am Ufer eines Sees stand" },
  { bild: "svg:webgewicht", name: "Webgewicht", kultur: "pfahlbauer", art: "ding", ab: 3,
    umschreibung: "ein Stück Ton mit einem Loch, das am Webstuhl die Fäden spannt" },
  { bild: "svg:tonkrug", name: "Tonkrug", kultur: "pfahlbauer", art: "ding", ab: 3, auch: ["aegypten", "roemer", "griechen", "china"],
    umschreibung: "ein Gefäss aus gebranntem Ton für Körner und Wasser" },
  { bild: "🪨", name: "Steinzeit", kultur: "pfahlbauer", art: "wort", ab: 3,
    umschreibung: "die Zeit, in der Werkzeuge aus Stein gemacht wurden, lange bevor es Metall gab" },
  { bild: "svg:bronzebeil", name: "Bronzezeit", kultur: "pfahlbauer", art: "wort", ab: 4,
    umschreibung: "die Zeit, in der Beile und Schmuck aus dem Metall Bronze gegossen wurden" }, // ZU PRÜFEN: Pfahlbauer lebten auch in der Bronzezeit
  { bild: "svg:mahlstein", name: "Mahlstein", kultur: "pfahlbauer", art: "ding", ab: 4, auch: ["aegypten", "roemer"],
    umschreibung: "ein flacher Stein, auf dem Körner mit einem zweiten Stein zu Mehl zerrieben wurden" },

  // ---------- Römer (in der Schweiz: Augusta Raurica, Aventicum) ----------
  { bild: "🏺", name: "Amphore", kultur: "roemer", art: "ding", ab: 1, alt: true, auch: ["griechen"],
    umschreibung: "ein grosser Tonkrug mit zwei Henkeln und spitzem Boden für Wein und Öl" },
  { bild: "🧩", name: "Mosaik", kultur: "roemer", art: "ding", ab: 2, auch: ["griechen"],
    umschreibung: "ein Bild auf dem Boden, aus tausenden kleinen Steinchen gelegt" },
  { bild: "🌉", name: "Aquädukt", kultur: "roemer", art: "bau", ab: 1, alt: true,
    umschreibung: "eine Wasserleitung auf hohen Bögen, die frisches Wasser in die Stadt bringt" },
  { bild: "svg:roemerstrasse", name: "Gepflasterte Strasse", kultur: "roemer", art: "bau", ab: 2,
    umschreibung: "ein breiter Weg aus Steinplatten, schnurgerade durch das ganze Land" },
  { bild: "⚔️", name: "Legionär", kultur: "roemer", art: "beruf", ab: 1, alt: true,
    umschreibung: "ein Soldat mit Helm, Schild und kurzem Schwert, der in einer Legion marschiert" },
  { bild: "🛁", name: "Thermen", kultur: "roemer", art: "bau", ab: 2,
    umschreibung: "ein grosses Badehaus mit warmen und kalten Becken für alle Leute der Stadt" },
  { bild: "svg:latein", name: "Latein", kultur: "roemer", art: "wort", ab: 3,
    umschreibung: "die Sprache, aus der Wörter wie „Villa“ und „Fenster“ zu uns gekommen sind" }, // ZU PRÜFEN: Fenster von lat. fenestra
  { bild: "🪙", name: "Münze mit Kaiserkopf", kultur: "roemer", art: "ding", ab: 2, auch: ["griechen", "china"],
    umschreibung: "Geld aus Metall mit dem Kopf des Herrschers darauf" },
  { bild: "🏛️", name: "Augusta Raurica", kultur: "roemer", art: "bau", ab: 3, alt: true,
    umschreibung: "eine alte Stadt in der Schweiz mit Theater und Tempelresten, die Soldaten und Händler gründeten" },
  { bild: "svg:aventicum", name: "Aventicum", kultur: "roemer", art: "bau", ab: 4,
    umschreibung: "eine alte Stadt in der Westschweiz; heute heisst der Ort Avenches" }, // ZU PRÜFEN
  { bild: "🔢", name: "Zahlen I, V, X", kultur: "roemer", art: "wort", ab: 3,
    umschreibung: "Zahlen, die mit Buchstaben geschrieben werden — heute noch auf manchen Uhren" },
  { bild: "♨️", name: "Bodenheizung", kultur: "roemer", art: "bau", ab: 3,
    umschreibung: "warme Luft von einem Feuer strömt unter dem Boden durch und heizt das Haus" }, // ZU PRÜFEN: Hypokaust
  { bild: "🪖", name: "Soldatenhelm", kultur: "roemer", art: "ding", ab: 2, auch: ["griechen"],
    umschreibung: "ein Schutz aus Metall für den Kopf eines Soldaten" },
  { bild: "svg:wachstafel", name: "Wachstafel", kultur: "roemer", art: "ding", ab: 4, auch: ["griechen"],
    umschreibung: "ein Brettchen mit Wachs, in das man mit einem Griffel schreibt und das Geschriebene wieder glattstreicht" },
  { bild: "svg:kaiser", name: "Kaiser", kultur: "roemer", art: "beruf", ab: 3, auch: ["china"],
    umschreibung: "der Herrscher über ein riesiges Reich; sein Kopf war auf den Münzen" },

  // ---------- Altes Ägypten ----------
  { bild: "svg:pyramiden", name: "Pyramide", kultur: "aegypten", art: "bau", ab: 1, alt: true,
    umschreibung: "ein riesiges Grab aus Stein mit vier schrägen Seiten und einer Spitze" },
  { bild: "👑", name: "Pharao", kultur: "aegypten", art: "beruf", ab: 1, alt: true,
    umschreibung: "der König, der wie ein Gott verehrt wurde und für den ein riesiges Grab gebaut wurde" },
  { bild: "svg:hieroglyphen", name: "Hieroglyphen", kultur: "aegypten", art: "wort", ab: 3,
    umschreibung: "eine Schrift aus kleinen Bildern: Vögel, Augen, Wellen" },
  { bild: "📜", name: "Papyrus", kultur: "aegypten", art: "ding", ab: 1, alt: true,
    umschreibung: "ein Blatt zum Schreiben, aus den Stängeln einer Pflanze am Fluss gemacht" },
  { bild: "🌊", name: "Der Nil", kultur: "aegypten", art: "wort", ab: 2,
    umschreibung: "ein sehr langer Fluss, der jedes Jahr über die Ufer trat und die Felder fruchtbar machte" },
  { bild: "svg:mumie", name: "Mumie", kultur: "aegypten", art: "ding", ab: 3,
    umschreibung: "ein toter Mensch, der in Tücher gewickelt wurde, damit er nicht verwest" },
  { bild: "🦁", name: "Sphinx", kultur: "aegypten", art: "bau", ab: 1, alt: true,
    umschreibung: "eine riesige Statue: ein Löwe mit dem Kopf eines Menschen" },
  { bild: "🪲", name: "Skarabäus", kultur: "aegypten", art: "ding", ab: 2, alt: true,
    umschreibung: "ein Glücksbringer in der Form eines Käfers" },
  { bild: "✍️", name: "Schreiber", kultur: "aegypten", art: "beruf", ab: 3, auch: ["roemer", "china"],
    umschreibung: "ein Mann, der lesen und schreiben konnte und alles aufschrieb, was der König wollte" },
  { bild: "🐈", name: "Heilige Katze", kultur: "aegypten", art: "wort", ab: 3,
    umschreibung: "ein Haustier, das verehrt wurde und dem niemand etwas tun durfte" }, // ZU PRÜFEN: Katzen als heilige Tiere
  { bild: "⛵", name: "Segelboot auf dem Fluss", kultur: "aegypten", art: "ding", ab: 3, auch: ["roemer", "griechen"],
    umschreibung: "ein Boot mit Segel, das Steine und Getreide über den grossen Fluss brachte" },

  // ---------- Altes China (ab Stufe 5) ----------
  { bild: "🧱", name: "Grosse Mauer", kultur: "china", art: "bau", ab: 5,
    umschreibung: "eine Mauer, die tausende Kilometer lang über Berge läuft" },
  { bild: "🧵", name: "Seide", kultur: "china", art: "ding", ab: 5,
    umschreibung: "ein glänzender, weicher Stoff aus den Fäden von Raupen" },
  { bild: "📄", name: "Papier", kultur: "china", art: "ding", ab: 5,
    umschreibung: "ein dünnes Blatt zum Schreiben, aus zerstampften Pflanzenfasern gemacht — eine Erfindung aus dem Osten" },
  { bild: "🧭", name: "Kompass", kultur: "china", art: "ding", ab: 5,
    umschreibung: "ein Gerät mit einer Nadel, die immer nach Norden zeigt" },
  { bild: "🍵", name: "Tee", kultur: "china", art: "ding", ab: 5,
    umschreibung: "ein heisses Getränk aus getrockneten Blättern" }, // ZU PRÜFEN: Tee schon im alten China
  { bild: "🍚", name: "Reis", kultur: "china", art: "ding", ab: 5,
    umschreibung: "kleine weisse Körner, die in überschwemmten Feldern wachsen" },
  { bild: "svg:schriftzeichen", name: "Schriftzeichen", kultur: "china", art: "wort", ab: 5,
    umschreibung: "eine Schrift mit tausenden verschiedenen Zeichen, jedes für ein ganzes Wort" },

  // ---------- Alte Griechen (ab Stufe 5) ----------
  { bild: "🏛️", name: "Tempel mit Säulen", kultur: "griechen", art: "bau", ab: 5, auch: ["roemer", "aegypten"],
    umschreibung: "ein Haus für einen Gott, mit vielen hohen Säulen rundherum" },
  { bild: "🏅", name: "Olympische Spiele", kultur: "griechen", art: "wort", ab: 5,
    umschreibung: "Wettkämpfe im Laufen, Werfen und Ringen, die alle vier Jahre stattfanden" },
  { bild: "🎭", name: "Theater unter freiem Himmel", kultur: "griechen", art: "bau", ab: 5, auch: ["roemer"],
    umschreibung: "Sitzreihen im Halbkreis an einem Hang, unten spielen Schauspieler mit Masken" },
  { bild: "🧔", name: "Philosoph", kultur: "griechen", art: "beruf", ab: 5,
    umschreibung: "ein Denker, der mit seinen Schülern über das Leben und die Welt nachdachte" },
  { bild: "🔤", name: "Buchstaben Alpha, Beta", kultur: "griechen", art: "wort", ab: 5,
    umschreibung: "ein Alphabet, dessen erste zwei Buchstaben dem Wort „Alphabet“ den Namen gaben" },
  { bild: "⚡", name: "Göttervater Zeus", kultur: "griechen", art: "wort", ab: 5,
    umschreibung: "der oberste Gott in alten Geschichten, der Blitze schleudert" },
  { bild: "🏟️", name: "Stadion", kultur: "griechen", art: "bau", ab: 5, auch: ["roemer"],
    umschreibung: "eine lange Laufbahn mit Rängen für die Zuschauer der Wettkämpfe" },
];

/** Dinge von heute — für Stufe 1 (Früher oder heute?). Alle brauchen Strom oder einen Motor. */
const KK_HEUTE = [
  { bild: "📱", name: "Handy", umschreibung: "damit telefoniert man und schickt Nachrichten" },
  { bild: "💻", name: "Computer", umschreibung: "damit schreibt, rechnet und spielt man am Bildschirm" },
  { bild: "🚗", name: "Auto", umschreibung: "ein Wagen mit Motor und vier Rädern" },
  { bild: "✈️", name: "Flugzeug", umschreibung: "damit fliegt man über die Wolken in andere Länder" },
  { bild: "📺", name: "Fernseher", umschreibung: "ein Bildschirm, auf dem Filme laufen" },
  { bild: "🚆", name: "Zug", umschreibung: "er fährt auf Schienen von Stadt zu Stadt" },
  { bild: "💡", name: "Glühlampe", umschreibung: "sie macht Licht, sobald man den Schalter drückt" },
  { bild: "🎧", name: "Kopfhörer", umschreibung: "damit hört man Musik, ohne dass andere sie hören" },
  { bild: "📷", name: "Fotoapparat", umschreibung: "damit macht man Fotos" },
  { bild: "🚌", name: "Bus", umschreibung: "ein grosser Wagen mit Motor, in dem viele Leute mitfahren" },
  { bild: "🧊", name: "Kühlschrank", umschreibung: "ein Schrank, der das Essen kalt hält" },
  { bild: "🎮", name: "Spielkonsole", umschreibung: "damit spielt man Spiele am Bildschirm" },
  { bild: "🚀", name: "Rakete", umschreibung: "sie fliegt mit Feuer und Donner bis ins Weltall" },
  { bild: "🤖", name: "Roboter", umschreibung: "eine Maschine, die sich von selbst bewegt und arbeitet" },
];

/** Erzählsätze (Stufe 3): Wer erzählt hier? Ohne den Namen der Kultur. */
const KK_SAETZE = [
  { satz: "Ich wohne in einem Haus auf Pfählen am See.", kultur: "pfahlbauer" },
  { satz: "Mein Vater hackt Holz mit einem Beil aus Stein.", kultur: "pfahlbauer" },
  { satz: "Wir fahren mit dem Einbaum über den See zum Fischen.", kultur: "pfahlbauer" },
  { satz: "Meine Mutter webt Stoff. Die Fäden spannt sie mit Gewichten aus Ton.", kultur: "pfahlbauer" },
  { satz: "Unter unserem Dorf schwappt das Wasser des Sees.", kultur: "pfahlbauer" },
  { satz: "Ich bin Soldat in einer Legion und marschiere auf einer gepflasterten Strasse.", kultur: "roemer" },
  { satz: "Am Nachmittag gehe ich in die Thermen und bade im warmen Wasser.", kultur: "roemer" },
  { satz: "Wir sprechen Latein. Ich lerne die Zahlen I, V und X.", kultur: "roemer" },
  { satz: "Das Wasser für unsere Stadt fliesst über ein Aquädukt aus den Bergen.", kultur: "roemer" },
  { satz: "Ich bezahle den Wein mit einer Münze. Darauf ist der Kopf des Kaisers.", kultur: "roemer" },
  { satz: "Der Boden in unserem Haus ist ein Mosaik aus tausend kleinen Steinchen.", kultur: "roemer" },
  { satz: "Ich lebe am Nil. Jedes Jahr tritt der Fluss über die Ufer.", kultur: "aegypten" },
  { satz: "Mein Onkel ist Schreiber. Er malt Hieroglyphen auf Papyrus.", kultur: "aegypten" },
  { satz: "Unser König heisst Pharao. Für ihn wird eine Pyramide gebaut.", kultur: "aegypten" },
  { satz: "Neben der Pyramide liegt die Sphinx, ein Löwe mit Menschenkopf.", kultur: "aegypten" },
  { satz: "Unsere Katze ist heilig. Niemand darf ihr etwas tun.", kultur: "aegypten" },
];

/** Aussagen (Stufe 4): stimmt oder stimmt nicht — nur eindeutige Fälle. grund erklärt die Lösung. */
const KK_AUSSAGEN = [
  { text: "Die Pfahlbauer hatten Handys.", wahr: false, kultur: "pfahlbauer", grund: "Handys gibt es erst seit kurzer Zeit. Die Pfahlbauer hatten keinen Strom." },
  { text: "Die Pfahlbauer wohnten in Häusern auf Pfählen am See.", wahr: true, kultur: "pfahlbauer", grund: "Ihre Holzhäuser standen auf Pfählen am Ufer von Seen." },
  { text: "Die Pfahlbauer fuhren mit dem Auto zur Arbeit.", wahr: false, kultur: "pfahlbauer", grund: "Autos gibt es erst seit etwa 150 Jahren. Die Pfahlbauer gingen zu Fuss oder fuhren mit dem Einbaum." },
  { text: "Die Pfahlbauer benutzten Beile aus Stein.", wahr: true, kultur: "pfahlbauer", grund: "Ihre Beile hatten eine geschliffene Klinge aus Stein." },
  { text: "Die Pfahlbauer hatten Strom in ihren Häusern.", wahr: false, kultur: "pfahlbauer", grund: "Strom aus der Steckdose gibt es erst seit gut 100 Jahren." },
  { text: "Die Pfahlbauer fuhren mit Einbäumen über den See.", wahr: true, kultur: "pfahlbauer", grund: "Ein Einbaum ist ein Boot aus einem einzigen Baumstamm." },
  { text: "Die Pfahlbauer lebten in der Schweiz, lange bevor die Römer kamen.", wahr: true, kultur: "pfahlbauer", grund: "Die Pfahlbauer lebten mehrere tausend Jahre vor den Römern an unseren Seen." }, // ZU PRÜFEN
  { text: "Die Pfahlbauer pflanzten Getreide an.", wahr: true, kultur: "pfahlbauer", grund: "Sie waren Bauern: Sie säten Getreide und hielten Tiere." }, // ZU PRÜFEN
  { text: "Die Pfahlbauer bauten Pyramiden.", wahr: false, kultur: "pfahlbauer", grund: "Pyramiden stehen in Ägypten. Die Pfahlbauer bauten Holzhäuser am See." },
  { text: "Die Römer bauten Strassen durch die Schweiz.", wahr: true, kultur: "roemer", grund: "Römerstrassen führten schnurgerade durch das Land und über die Pässe." },
  { text: "Die Römer badeten in grossen Badehäusern, den Thermen.", wahr: true, kultur: "roemer", grund: "In den Thermen gab es warme und kalte Becken." },
  { text: "Die Römer sprachen Latein.", wahr: true, kultur: "roemer", grund: "Latein war die Sprache der Römer." },
  { text: "Die Römer flogen mit dem Flugzeug nach Rom.", wahr: false, kultur: "roemer", grund: "Flugzeuge gibt es erst seit gut 100 Jahren. Die Römer gingen zu Fuss, ritten oder fuhren mit Wagen und Schiffen." },
  { text: "Die Römer bauten Wasserleitungen, die Aquädukte.", wahr: true, kultur: "roemer", grund: "Aquädukte brachten frisches Wasser über Bögen in die Städte." },
  { text: "Die Römer hatten Städte in der Schweiz, zum Beispiel Augusta Raurica.", wahr: true, kultur: "roemer", grund: "Augusta Raurica und Aventicum waren Römerstädte in der Schweiz." },
  { text: "Die Römer bezahlten mit Münzen.", wahr: true, kultur: "roemer", grund: "Römische Münzen aus Metall findet man bis heute in der Erde." },
  { text: "Die Römer schauten die Olympischen Spiele im Fernsehen.", wahr: false, kultur: "roemer", grund: "Fernseher gibt es erst seit etwa 100 Jahren." },
  { text: "Die Römer hatten Handys.", wahr: false, kultur: "roemer", grund: "Handys gibt es erst seit kurzer Zeit. Die Römer schickten Boten." },
  { text: "Die Römer legten Mosaike aus kleinen Steinchen.", wahr: true, kultur: "roemer", grund: "Mosaikböden aus tausenden Steinchen schmückten ihre Häuser." },
  { text: "Im Alten Ägypten bauten die Menschen Pyramiden.", wahr: true, kultur: "aegypten", grund: "Die Pyramiden waren riesige Gräber für die Pharaonen." },
  { text: "Im Alten Ägypten schrieb man auf Papyrus.", wahr: true, kultur: "aegypten", grund: "Papyrus wurde aus einer Pflanze am Nil gemacht." },
  { text: "Die alten Ägypter hatten Fernseher.", wahr: false, kultur: "aegypten", grund: "Fernseher gibt es erst seit etwa 100 Jahren." },
  { text: "Im Alten Ägypten regierte ein Pharao.", wahr: true, kultur: "aegypten", grund: "Der Pharao war der König und wurde wie ein Gott verehrt." },
  { text: "Die alten Ägypter schrieben mit dem Computer.", wahr: false, kultur: "aegypten", grund: "Computer gibt es erst seit kurzer Zeit. Die Ägypter schrieben Hieroglyphen auf Papyrus." },
  { text: "Die alten Ägypter lebten am Fluss Nil.", wahr: true, kultur: "aegypten", grund: "Der Nil machte die Felder in der Wüste fruchtbar." },
  { text: "Im Alten Ägypten gab es Pyramiden aus Glas.", wahr: false, kultur: "aegypten", grund: "Die Pyramiden sind aus riesigen Steinblöcken gebaut." },
  { text: "Die alten Ägypter fuhren mit dem Zug.", wahr: false, kultur: "aegypten", grund: "Züge gibt es erst seit etwa 200 Jahren. Die Ägypter fuhren mit Booten auf dem Nil." },
  { text: "Die alten Ägypter schrieben mit Bildzeichen, den Hieroglyphen.", wahr: true, kultur: "aegypten", grund: "Hieroglyphen sind kleine Bilder: Vögel, Augen, Wellen." },
  // ab Stufe 5
  { text: "Im Alten China wurde das Papier erfunden.", wahr: true, kultur: "china", grund: "Papier aus Pflanzenfasern ist eine Erfindung aus China." }, // ZU PRÜFEN
  { text: "Die Grosse Mauer in China ist aus Glas.", wahr: false, kultur: "china", grund: "Die Grosse Mauer ist aus Stein und Erde gebaut." },
  { text: "Im Alten China gab es Fernseher.", wahr: false, kultur: "china", grund: "Fernseher gibt es erst seit etwa 100 Jahren." },
  { text: "Die alten Griechen erfanden die Olympischen Spiele.", wahr: true, kultur: "griechen", grund: "Die Wettkämpfe fanden alle vier Jahre in Olympia statt." },
  { text: "Die alten Griechen fuhren mit dem Auto zum Theater.", wahr: false, kultur: "griechen", grund: "Autos gibt es erst seit etwa 150 Jahren." },
  { text: "Die alten Griechen bauten Tempel mit vielen Säulen.", wahr: true, kultur: "griechen", grund: "Ihre Tempel hatten rundherum hohe Säulen aus Stein." },
];

/** Gab es das damals schon? (Stufe 4) — nur eindeutige Fälle. grund erklärt die Lösung. */
const KK_GAB = [
  { ding: "Rad", bild: "🛞", kultur: "roemer", ja: true, grund: "Die Römer fuhren mit Wagen auf ihren Strassen." },
  { ding: "Schrift", bild: "✍️", kultur: "roemer", ja: true, grund: "Die Römer schrieben Latein, auf Wachstafeln und auf Stein." },
  { ding: "Glas", bild: "🥛", kultur: "roemer", ja: true, grund: "Die Römer stellten Gläser, Flaschen und Fensterglas her." }, // ZU PRÜFEN
  { ding: "Strom", bild: "⚡", kultur: "roemer", ja: false, grund: "Strom aus der Steckdose gibt es erst seit gut 100 Jahren." },
  { ding: "Münzen", bild: "🪙", kultur: "roemer", ja: true, grund: "Römische Münzen findet man bis heute in der Erde." },
  { ding: "Handy", bild: "📱", kultur: "roemer", ja: false, grund: "Handys gibt es erst seit kurzer Zeit." },
  { ding: "Pferde", bild: "🐎", kultur: "roemer", ja: true, grund: "Die Römer ritten und spannten Pferde vor ihre Wagen." },
  { ding: "Warmes Bad", bild: "🛁", kultur: "roemer", ja: true, grund: "In den Thermen gab es warme Becken mit Bodenheizung." },
  { ding: "Flugzeug", bild: "✈️", kultur: "roemer", ja: false, grund: "Flugzeuge gibt es erst seit gut 100 Jahren." },
  { ding: "Fernseher", bild: "📺", kultur: "roemer", ja: false, grund: "Fernseher gibt es erst seit etwa 100 Jahren." },
  { ding: "Schrift", bild: "✍️", kultur: "pfahlbauer", ja: false, grund: "Die Pfahlbauer hatten noch keine Schrift. Wir kennen sie nur durch Funde." },
  { ding: "Strom", bild: "⚡", kultur: "pfahlbauer", ja: false, grund: "Strom aus der Steckdose gibt es erst seit gut 100 Jahren." },
  { ding: "Münzen", bild: "🪙", kultur: "pfahlbauer", ja: false, grund: "Die Pfahlbauer kannten kein Geld. Sie tauschten Sachen." }, // ZU PRÜFEN
  { ding: "Auto", bild: "🚗", kultur: "pfahlbauer", ja: false, grund: "Autos gibt es erst seit etwa 150 Jahren." },
  { ding: "Steinbeil", bild: "🪓", kultur: "pfahlbauer", ja: true, grund: "Beile mit Klingen aus geschliffenem Stein waren ihre wichtigsten Werkzeuge." },
  { ding: "Boot", bild: "🛶", kultur: "pfahlbauer", ja: true, grund: "Ihre Boote waren Einbäume aus einem Baumstamm." },
  { ding: "Holzhaus", bild: "🛖", kultur: "pfahlbauer", ja: true, grund: "Ihre Häuser aus Holz standen auf Pfählen." },
  { ding: "Töpfe aus Ton", bild: "🍲", kultur: "pfahlbauer", ja: true, grund: "Tonkrüge und Töpfe aus gebranntem Ton wurden in vielen Pfahlbau-Dörfern gefunden." }, // ZU PRÜFEN
  { ding: "Getreide", bild: "🌾", kultur: "pfahlbauer", ja: true, grund: "Die Pfahlbauer waren Bauern und bauten Getreide an." }, // ZU PRÜFEN
  { ding: "Glühlampe", bild: "💡", kultur: "pfahlbauer", ja: false, grund: "Glühlampen gibt es erst seit etwa 150 Jahren. Licht gab nur das Feuer." },
  { ding: "Schrift", bild: "✍️", kultur: "aegypten", ja: true, grund: "Die Ägypter schrieben mit Hieroglyphen, kleinen Bildzeichen." },
  { ding: "Strom", bild: "⚡", kultur: "aegypten", ja: false, grund: "Strom aus der Steckdose gibt es erst seit gut 100 Jahren." },
  { ding: "Pyramiden", bild: "svg:pyramiden", kultur: "aegypten", ja: true, grund: "Die Pyramiden sind riesige Gräber aus Stein für die Pharaonen." },
  { ding: "Computer", bild: "💻", kultur: "aegypten", ja: false, grund: "Computer gibt es erst seit kurzer Zeit." },
  { ding: "Boote", bild: "⛵", kultur: "aegypten", ja: true, grund: "Auf dem Nil fuhren Segelboote mit Steinen und Getreide." },
  { ding: "Katzen", bild: "🐈", kultur: "aegypten", ja: true, grund: "Katzen waren im Alten Ägypten heilige Tiere." }, // ZU PRÜFEN
  { ding: "Zug", bild: "🚆", kultur: "aegypten", ja: false, grund: "Züge gibt es erst seit etwa 200 Jahren." },
  // ab Stufe 5
  { ding: "Papier", bild: "📄", kultur: "china", ja: true, grund: "Das Papier wurde im Alten China erfunden." }, // ZU PRÜFEN
  { ding: "Kompass", bild: "🧭", kultur: "china", ja: true, grund: "Der Kompass ist eine Erfindung aus China." }, // ZU PRÜFEN
  { ding: "Seide", bild: "🧵", kultur: "china", ja: true, grund: "Seide aus den Fäden von Raupen kommt aus China." },
  { ding: "Fernseher", bild: "📺", kultur: "china", ja: false, grund: "Fernseher gibt es erst seit etwa 100 Jahren." },
  { ding: "Theater", bild: "🎭", kultur: "griechen", ja: true, grund: "Die Griechen spielten Theaterstücke mit Masken unter freiem Himmel." },
  { ding: "Wettkämpfe", bild: "🏅", kultur: "griechen", ja: true, grund: "Die Olympischen Spiele sind eine Erfindung der alten Griechen." },
  { ding: "Flugzeug", bild: "✈️", kultur: "griechen", ja: false, grund: "Flugzeuge gibt es erst seit gut 100 Jahren." },
];

/** Quellenarten (Stufe 5): Woher wissen wir das? */
const KK_QUELLENARTEN = {
  fund: { name: "Fundstück", bild: "🏺", erklaerung: "ein Gegenstand, den jemand ausgegraben hat" },
  bau: { name: "Bauwerk", bild: "🏛️", erklaerung: "ein Gebäude oder seine Reste, die noch stehen" },
  bild: { name: "Bild", bild: "🖼️", erklaerung: "etwas Gemaltes oder Gezeichnetes aus jener Zeit" },
  text: { name: "Text", bild: "📜", erklaerung: "etwas Geschriebenes aus jener Zeit" },
};

/** Quellen (Stufe 5): Beispiel → Quellenart. Der Text nennt die Art nicht beim Namen. */
const KK_QUELLEN = [
  { text: "Ein Steinbeil aus dem Schlamm am Grund eines Sees.", bild: "🪓", art: "fund", kultur: "pfahlbauer" },
  { text: "Ein Webgewicht aus Ton, das Taucher im See gefunden haben.", bild: "🧵", art: "fund", kultur: "pfahlbauer" },
  { text: "Ein Tonkrug mit Resten von Körnern darin.", bild: "🌾", art: "fund", kultur: "pfahlbauer" },
  { text: "Die Reste eines Aquädukts, die noch auf einer Wiese stehen.", bild: "🌉", art: "bau", kultur: "roemer" },
  { text: "Die Ruinen des Theaters von Augusta Raurica.", bild: "🏛️", art: "bau", kultur: "roemer" },
  { text: "Ein Helm eines Legionärs, der beim Pflügen aus der Erde kam.", bild: "🪖", art: "fund", kultur: "roemer" },
  { text: "Eine Münze mit dem Kopf eines Kaisers.", bild: "🪙", art: "fund", kultur: "roemer" },
  { text: "Der Bericht des Feldherrn Cäsar über die Menschen in der Schweiz.", bild: "📜", art: "text", kultur: "roemer" }, // ZU PRÜFEN: Cäsar schrieb über die Helvetier
  { text: "Eine Malerei an einer Hauswand: ein Festmahl mit Wein.", bild: "🎨", art: "bild", kultur: "roemer" },
  { text: "Ein Brief auf Papyrus, mit Tinte geschrieben.", bild: "📜", art: "text", kultur: "aegypten" },
  { text: "Eine Pyramide in der Wüste, die noch heute steht.", bild: "🔺", art: "bau", kultur: "aegypten" },
  { text: "Eine Malerei an der Wand eines Grabes: Bauern bei der Ernte.", bild: "🎨", art: "bild", kultur: "aegypten" },
  { text: "Eine Geschichte, in Hieroglyphen aufgeschrieben.", bild: "✍️", art: "text", kultur: "aegypten" },
  { text: "Ein Glücksbringer in Käferform aus einem Grab.", bild: "🪲", art: "fund", kultur: "aegypten" },
  { text: "Die Sphinx, ein Löwe mit Menschenkopf aus Stein.", bild: "🦁", art: "bau", kultur: "aegypten" },
  { text: "Eine Zeichnung eines Pharaos auf seinem Wagen.", bild: "👑", art: "bild", kultur: "aegypten" },
  // ab Stufe 5 (China und Griechen)
  { text: "Ein Stück der Grossen Mauer, das über die Berge läuft.", bild: "🧱", art: "bau", kultur: "china" },
  { text: "Ein Stück Seidenstoff aus einem alten Grab.", bild: "🧵", art: "fund", kultur: "china" },
  { text: "Schriftzeichen auf dünnen Streifen aus Bambus.", bild: "🎋", art: "text", kultur: "china" }, // ZU PRÜFEN: Bambusstreifen als Schriftträger
  { text: "Eine Malerei auf Seide: ein Kaiser mit seinen Dienern.", bild: "🎨", art: "bild", kultur: "china" },
  { text: "Die Säulen eines Tempels, die noch auf einem Hügel stehen.", bild: "🏛️", art: "bau", kultur: "griechen" },
  { text: "Eine Zeichnung auf einer Vase: Läufer bei den Wettkämpfen.", bild: "🏃", art: "bild", kultur: "griechen" },
  { text: "Ein Theaterstück, das vor über 2000 Jahren aufgeschrieben wurde und das wir heute noch lesen.", bild: "📜", art: "text", kultur: "griechen" },
  { text: "Ein Helm aus Bronze, den ein Taucher im Meer gefunden hat.", bild: "🪖", art: "fund", kultur: "griechen" },
];

/** Rätsel (Stufe 6): Welche Kultur bin ich? Drei Hinweise, vom Allgemeinen zum Konkreten, ohne den Namen. */
const KK_RAETSEL = [
  { kultur: "pfahlbauer", hinweise: ["Wir lebten vor mehreren tausend Jahren in der Schweiz.", "Unsere Häuser standen auf langen Stangen über dem Wasser.", "Unsere Beile waren aus Stein, unsere Boote aus einem einzigen Baumstamm."] },
  { kultur: "pfahlbauer", hinweise: ["Unsere Dörfer lagen direkt am Ufer eines Sees.", "Wir hatten noch keine Schrift.", "Forscher finden unsere Holzstangen noch heute im Seeboden."] },
  { kultur: "roemer", hinweise: ["Wir kamen vor über 2000 Jahren in die Schweiz.", "Wir bauten schnurgerade Strassen, Wasserleitungen und warme Bäder.", "Unsere Sprache war Latein."] },
  { kultur: "roemer", hinweise: ["Unsere Soldaten hiessen Legionäre.", "Wir gründeten Städte in der Schweiz, zum Beispiel Augusta Raurica.", "Unsere Böden schmückten wir mit Mosaiken aus kleinen Steinchen."] },
  { kultur: "aegypten", hinweise: ["Wir lebten an einem langen Fluss mitten in der Wüste.", "Unser König hiess Pharao.", "Wir bauten riesige Gräber aus Stein mit einer Spitze oben."] },
  { kultur: "aegypten", hinweise: ["Wir schrieben mit kleinen Bildzeichen auf Papyrus.", "Unsere Toten wickelten wir in Tücher, damit sie nicht verwesen.", "Eine unserer Statuen ist ein Löwe mit Menschenkopf."] },
  { kultur: "china", hinweise: ["Wir lebten weit weg im Osten.", "Wir erfanden das Papier und den Kompass.", "Unsere Mauer ist tausende Kilometer lang."] },
  { kultur: "china", hinweise: ["Wir machten einen glänzenden Stoff aus den Fäden von Raupen.", "Unser Glückszeichen ist der Drache.", "Wir schrieben mit tausenden verschiedenen Schriftzeichen."] },
  { kultur: "griechen", hinweise: ["Wir lebten vor über 2000 Jahren am Meer, in vielen kleinen Städten.", "Wir erfanden Wettkämpfe, die es heute noch alle vier Jahre gibt.", "Unsere Tempel hatten viele Säulen, unsere Theater waren unter freiem Himmel."] },
  { kultur: "griechen", hinweise: ["Unsere Buchstaben heissen Alpha, Beta, Gamma.", "Wir erzählten Geschichten über Götter wie Zeus.", "Unsere Schauspieler trugen Masken."] },
];
