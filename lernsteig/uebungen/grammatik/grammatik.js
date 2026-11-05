/* Inhaltsliste „Grammatik: Fälle, Wortarten, Formen“ (D.5.D.1) — zum Durchsehen ohne Code.
   UNGEPRÜFT (LST_Session1), bis Patrik sie durchgesehen hat. Anders als in Mathematik lässt sich die Richtigkeit nicht
   maschinell nachrechnen; das Testskript prüft nur die Form (markiertes Wort kommt genau einmal vor, Lösung gehört zur
   Frage).
   Je Eintrag: satz, wort (das markierte Wort oder die Wortgruppe), frage (fall | wortart | zeitform | genus | modus |
   satzglied) und loesung.
   Annahmen (Schweizer Schulgrammatik nach dem Lehrplan: fünf Wortarten Nomen, Verb, Adjektiv, Pronomen, Partikel):
   Artikel gelten als Pronomen; Präpositionen, Konjunktionen und Adverbien als Partikel; „Futur“ meint Futur I. */
"use strict";

const GRAMMATIK = {
  // e: vier Fälle in typischen Fällen mit der Ersatzprobe
  e: [
    { satz: "Ich schenke meinem Bruder ein Buch.", wort: "meinem Bruder", frage: "fall", loesung: "Dativ" },
    { satz: "Ich schenke meinem Bruder ein Buch.", wort: "ein Buch", frage: "fall", loesung: "Akkusativ" },
    { satz: "Der Hund bellt laut.", wort: "Der Hund", frage: "fall", loesung: "Nominativ" },
    { satz: "Das Velo meiner Schwester ist neu.", wort: "meiner Schwester", frage: "fall", loesung: "Genitiv" },
    { satz: "Wir warten auf den Bus.", wort: "den Bus", frage: "fall", loesung: "Akkusativ" },
    { satz: "Sie wohnt bei ihrer Tante.", wort: "ihrer Tante", frage: "fall", loesung: "Dativ" },
    { satz: "Trotz des Regens gehen wir hinaus.", wort: "des Regens", frage: "fall", loesung: "Genitiv" },
    { satz: "Er hilft dem Lehrer.", wort: "dem Lehrer", frage: "fall", loesung: "Dativ" },
    { satz: "Die Kinder spielen im Park.", wort: "Die Kinder", frage: "fall", loesung: "Nominativ" },
    { satz: "Ich sehe den Berg.", wort: "den Berg", frage: "fall", loesung: "Akkusativ" },
    { satz: "Wir fahren mit dem Zug nach Bern.", wort: "dem Zug", frage: "fall", loesung: "Dativ" },
    { satz: "Das ist das Haus meines Onkels.", wort: "meines Onkels", frage: "fall", loesung: "Genitiv" },
    { satz: "Der Ball liegt unter dem Tisch.", wort: "dem Tisch", frage: "fall", loesung: "Dativ" },
    { satz: "Er legt den Ball unter den Tisch.", wort: "den Tisch", frage: "fall", loesung: "Akkusativ" },
    { satz: "Mein Freund kommt morgen.", wort: "Mein Freund", frage: "fall", loesung: "Nominativ" },
    { satz: "Wegen des Sturms fällt das Spiel aus.", wort: "des Sturms", frage: "fall", loesung: "Genitiv" },
    { satz: "Ich danke dir für die Hilfe.", wort: "dir", frage: "fall", loesung: "Dativ" },
    { satz: "Sie kauft einen Apfel.", wort: "einen Apfel", frage: "fall", loesung: "Akkusativ" },
    { satz: "Die Lehrerin erklärt den Schülern die Aufgabe.", wort: "den Schülern", frage: "fall", loesung: "Dativ" },
    { satz: "Die Lehrerin erklärt den Schülern die Aufgabe.", wort: "die Aufgabe", frage: "fall", loesung: "Akkusativ" },
  ],
  // f: Wortarten (fünf Wortarten), Zeitformen
  f: [
    { satz: "Die Katze schläft auf dem Sofa.", wort: "schläft", frage: "wortart", loesung: "Verb" },
    { satz: "Die Katze schläft auf dem Sofa.", wort: "Katze", frage: "wortart", loesung: "Nomen" },
    { satz: "Die Katze schläft auf dem Sofa.", wort: "auf", frage: "wortart", loesung: "Partikel" },
    { satz: "Das Wasser ist kalt.", wort: "kalt", frage: "wortart", loesung: "Adjektiv" },
    { satz: "Wir gehen heute ins Kino.", wort: "Wir", frage: "wortart", loesung: "Pronomen" },
    { satz: "Wir gehen heute ins Kino.", wort: "heute", frage: "wortart", loesung: "Partikel" },
    { satz: "Der Zug fährt pünktlich ab.", wort: "Der", frage: "wortart", loesung: "Pronomen" },
    { satz: "Der Zug fährt pünktlich ab.", wort: "pünktlich", frage: "wortart", loesung: "Adjektiv" },
    { satz: "Er bleibt drinnen, weil es regnet.", wort: "weil", frage: "wortart", loesung: "Partikel" },
    { satz: "Dieses Buch gefällt mir.", wort: "Dieses", frage: "wortart", loesung: "Pronomen" },
    { satz: "Das Lesen macht mir Spass.", wort: "Lesen", frage: "wortart", loesung: "Nomen" },
    { satz: "Wir haben das Spiel gewonnen.", wort: "haben", frage: "wortart", loesung: "Verb" },
    { satz: "Das Lied ist sehr schön.", wort: "sehr", frage: "wortart", loesung: "Partikel" },
    { satz: "Das Lied ist sehr schön.", wort: "schön", frage: "wortart", loesung: "Adjektiv" },
    { satz: "Das ist mein Rucksack.", wort: "mein", frage: "wortart", loesung: "Pronomen" },
    { satz: "Wir spielen Fussball.", wort: "spielen", frage: "zeitform", loesung: "Präsens" },
    { satz: "Wir spielten Fussball.", wort: "spielten", frage: "zeitform", loesung: "Präteritum" },
    { satz: "Wir haben Fussball gespielt.", wort: "haben Fussball gespielt", frage: "zeitform", loesung: "Perfekt" },
    { satz: "Wir hatten Fussball gespielt.", wort: "hatten Fussball gespielt", frage: "zeitform", loesung: "Plusquamperfekt" },
    { satz: "Wir werden Fussball spielen.", wort: "werden Fussball spielen", frage: "zeitform", loesung: "Futur" },
    { satz: "Sie ging nach Hause.", wort: "ging", frage: "zeitform", loesung: "Präteritum" },
    { satz: "Sie ist nach Hause gegangen.", wort: "ist nach Hause gegangen", frage: "zeitform", loesung: "Perfekt" },
    { satz: "Sie war nach Hause gegangen.", wort: "war nach Hause gegangen", frage: "zeitform", loesung: "Plusquamperfekt" },
    { satz: "Er schreibt einen Brief.", wort: "schreibt", frage: "zeitform", loesung: "Präsens" },
    { satz: "Er wird einen Brief schreiben.", wort: "wird einen Brief schreiben", frage: "zeitform", loesung: "Futur" },
  ],
  // g: Aktiv und Passiv; Indikativ, Imperativ, Konjunktiv I und II; Subjekt und Objekt
  g: [
    { satz: "Der Brief wird geschrieben.", wort: "wird geschrieben", frage: "genus", loesung: "Passiv" },
    { satz: "Lena schreibt den Brief.", wort: "schreibt", frage: "genus", loesung: "Aktiv" },
    { satz: "Das Haus wurde 1900 gebaut.", wort: "wurde gebaut", frage: "genus", loesung: "Passiv", wortImSatz: "wurde 1900 gebaut" },
    { satz: "Wir bauen ein Baumhaus.", wort: "bauen", frage: "genus", loesung: "Aktiv" },
    { satz: "Der Hund wird jeden Morgen gefüttert.", wort: "wird jeden Morgen gefüttert", frage: "genus", loesung: "Passiv" },
    { satz: "Komm sofort her!", wort: "Komm", frage: "modus", loesung: "Imperativ" },
    { satz: "Bring mir bitte das Heft!", wort: "Bring", frage: "modus", loesung: "Imperativ" },
    { satz: "Er sagt, er sei krank.", wort: "sei", frage: "modus", loesung: "Konjunktiv I" },
    { satz: "Sie behauptet, sie habe keine Zeit.", wort: "habe", frage: "modus", loesung: "Konjunktiv I" },
    { satz: "Wenn ich Zeit hätte, käme ich mit.", wort: "hätte", frage: "modus", loesung: "Konjunktiv II" },
    { satz: "Ich würde gern mitkommen.", wort: "würde", frage: "modus", loesung: "Konjunktiv II" },
    { satz: "Sie liest ein Buch.", wort: "liest", frage: "modus", loesung: "Indikativ" },
    { satz: "Er ist zu Hause.", wort: "ist", frage: "modus", loesung: "Indikativ" },
    { satz: "Tim wirft den Ball.", wort: "Tim", frage: "satzglied", loesung: "Subjekt" },
    { satz: "Tim wirft den Ball.", wort: "den Ball", frage: "satzglied", loesung: "Akkusativobjekt" },
    { satz: "Den Ball wirft Tim.", wort: "Tim", frage: "satzglied", loesung: "Subjekt" },
    { satz: "Tim gibt seiner Schwester den Ball.", wort: "seiner Schwester", frage: "satzglied", loesung: "Dativobjekt" },
    { satz: "Wir gedenken der Opfer.", wort: "der Opfer", frage: "satzglied", loesung: "Genitivobjekt" },
    { satz: "Am Morgen trinkt meine Mutter Kaffee.", wort: "meine Mutter", frage: "satzglied", loesung: "Subjekt" },
    { satz: "Am Morgen trinkt meine Mutter Kaffee.", wort: "Kaffee", frage: "satzglied", loesung: "Akkusativobjekt" },
  ],
};

if (typeof module !== "undefined") module.exports = GRAMMATIK;
