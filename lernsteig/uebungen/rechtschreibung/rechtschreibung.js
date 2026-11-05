/* Inhaltsliste „Rechtschreibung“ (D.5.E.1) — zum Durchsehen ohne Code. UNGEPRÜFT (LST_Session1), bis Patrik sie
   durchgesehen hat. Schweizer Rechtschreibung: kein ß.
   Je Eintrag: satz (mit „___“ für die Lücke) und optionen mit der richtigen zuerst, oder art "satz" mit ganzen Sätzen
   (richtiger zuerst); regel benennt die Regel (für Hinweis und Lösungsweg). Die Reihenfolge mischt das Programm.
   Das Testskript prüft nur die Form: genau eine Lücke, keine doppelten Antworten, kein ß; Varianten zur Gross- und
   Kleinschreibung unterscheiden sich nur darin, Komma-Varianten nur in den Kommas. */
"use strict";

const RECHTSCHREIBUNG = {
  // d: ie-Regel, f/v, e/ä (Stammregel), ck und tz, Grossschreibung, Komma bei Aufzählungen
  d: [
    { satz: "Im Winter ___ der See zu.", optionen: ["friert", "frirt"], regel: "ie" },
    { satz: "Die ___ grasen auf der Weide.", optionen: ["Tiere", "Tire"], regel: "ie" },
    { satz: "Wir ___ heute ein Lied.", optionen: ["spielen", "spilen"], regel: "ie" },
    { satz: "Der ___ fliegt über das Feld.", optionen: ["Vogel", "Fogel"], regel: "fv" },
    { satz: "Das Glas ist ___.", optionen: ["voll", "foll"], regel: "fv" },
    { satz: "Wir ___ morgen nach Bern.", optionen: ["fahren", "vahren"], regel: "fv" },
    { satz: "Im Herbst fallen die ___.", optionen: ["Blätter", "Bletter"], regel: "eae" },
    { satz: "Meine ___ sind kalt.", optionen: ["Hände", "Hende"], regel: "eae" },
    { satz: "Er ___ mit dem Velo zur Schule.", optionen: ["fährt", "fehrt"], regel: "eae" },
    { satz: "Das ___ steht offen.", optionen: ["Fenster", "Fänster"], regel: "eae" },
    { satz: "Die ___ schläft auf dem Sofa.", optionen: ["Katze", "Kaze"], regel: "cktz" },
    { satz: "Der ___ ist voll.", optionen: ["Sack", "Sak"], regel: "cktz" },
    { satz: "Im Wald wächst ein ___.", optionen: ["Pilz", "Piltz"], regel: "cktz" },
    { satz: "Die ___ hält warm.", optionen: ["Mütze", "Müze"], regel: "cktz" },
    { satz: "Sie ___ mir einen Brief.", optionen: ["schickt", "schikt"], regel: "cktz" },
    { satz: "Wir hatten viel ___.", optionen: ["Glück", "glück"], regel: "gross" },
    { satz: "Die ___ war gross.", optionen: ["Freude", "freude"], regel: "gross" },
    { satz: "Er hat ___ vor dem Hund.", optionen: ["Angst", "angst"], regel: "gross" },
    { art: "satz", optionen: ["Ich kaufe Äpfel, Birnen und Bananen.", "Ich kaufe Äpfel, Birnen, und Bananen.", "Ich kaufe Äpfel Birnen und Bananen."], regel: "komma-aufzaehlung" },
    { art: "satz", optionen: ["Wir singen, tanzen und lachen.", "Wir singen tanzen und lachen.", "Wir singen, tanzen, und lachen."], regel: "komma-aufzaehlung" },
  ],
  // e: Nachmorpheme für die Gross- und Kleinschreibung (Frei-heit, Entdeck-ung)
  e: [
    { satz: "Die ___ ist ein hohes Gut.", optionen: ["Freiheit", "freiheit"], regel: "nachmorphem-gross" },
    { satz: "Die ___ des Feuers war ein grosser Schritt.", optionen: ["Entdeckung", "entdeckung"], regel: "nachmorphem-gross" },
    { satz: "Die ___ in der Klasse ist gut.", optionen: ["Gemeinschaft", "gemeinschaft"], regel: "nachmorphem-gross" },
    { satz: "Das war ein schönes ___.", optionen: ["Erlebnis", "erlebnis"], regel: "nachmorphem-gross" },
    { satz: "Ihre ___ freut uns.", optionen: ["Freundlichkeit", "freundlichkeit"], regel: "nachmorphem-gross" },
    { satz: "Die ___ beginnt um acht Uhr.", optionen: ["Prüfung", "prüfung"], regel: "nachmorphem-gross" },
    { satz: "Die ___ der Aufgabe hat uns überrascht.", optionen: ["Schwierigkeit", "schwierigkeit"], regel: "nachmorphem-gross" },
    { satz: "Er hat die ___ gesagt.", optionen: ["Wahrheit", "wahrheit"], regel: "nachmorphem-gross" },
    { satz: "Wir warten auf die ___.", optionen: ["Erlaubnis", "erlaubnis"], regel: "nachmorphem-gross" },
    { satz: "Das Wasser ist ___.", optionen: ["eisig", "Eisig"], regel: "nachmorphem-klein" },
    { satz: "Der Verkäufer war sehr ___.", optionen: ["freundlich", "Freundlich"], regel: "nachmorphem-klein" },
    { satz: "Der Weg ist ___.", optionen: ["gefährlich", "Gefährlich"], regel: "nachmorphem-klein" },
    { satz: "Die Antwort war ___.", optionen: ["richtig", "Richtig"], regel: "nachmorphem-klein" },
    { satz: "Das Kleid ist ___.", optionen: ["farbig", "Farbig"], regel: "nachmorphem-klein" },
  ],
  // f: nominalisierte Verben nach Präposition + Artikel (beim Essen); Höflichkeitspronomen „Sie“ in Briefen
  f: [
    { satz: "Beim ___ wird nicht gesprochen.", optionen: ["Essen", "essen"], regel: "verb-nominalisiert" },
    { satz: "Zum ___ brauchst du einen Stift.", optionen: ["Schreiben", "schreiben"], regel: "verb-nominalisiert" },
    { satz: "Ich freue mich aufs ___.", optionen: ["Schwimmen", "schwimmen"], regel: "verb-nominalisiert" },
    { satz: "Sie hilft beim ___.", optionen: ["Aufräumen", "aufräumen"], regel: "verb-nominalisiert" },
    { satz: "Vom vielen ___ bin ich müde.", optionen: ["Laufen", "laufen"], regel: "verb-nominalisiert" },
    { satz: "Wir gehen heute ___.", optionen: ["schwimmen", "Schwimmen"], regel: "verb-klein" },
    { satz: "Ich will am Abend ___.", optionen: ["lesen", "Lesen"], regel: "verb-klein" },
    { satz: "Sie können gut ___.", optionen: ["zeichnen", "Zeichnen"], regel: "verb-klein" },
    { satz: "Sehr geehrte Frau Meier, ich danke ___ für Ihren Brief.", optionen: ["Ihnen", "ihnen"], regel: "hoeflich" },
    { satz: "Sehr geehrter Herr Keller, können ___ mir bitte helfen?", optionen: ["Sie", "sie"], regel: "hoeflich" },
    { satz: "Sehr geehrte Frau Huber, ich freue mich auf ___ Antwort.", optionen: ["Ihre", "ihre"], regel: "hoeflich" },
    { satz: "Die Kinder sagen, ___ kommen später.", optionen: ["sie", "Sie"], regel: "nicht-hoeflich" },
    { satz: "Anna ruft an, weil ___ krank ist.", optionen: ["sie", "Sie"], regel: "nicht-hoeflich" },
  ],
  // g: nominalisierte Adjektive nach Pronomen (alles Gute); Komma bei Infinitivgruppen, Einschüben, Relativsätzen
  g: [
    { satz: "Ich wünsche dir alles ___.", optionen: ["Gute", "gute"], regel: "adjektiv-nominalisiert" },
    { satz: "Wir haben etwas ___ gesehen.", optionen: ["Schönes", "schönes"], regel: "adjektiv-nominalisiert" },
    { satz: "Es gibt nichts ___ zu berichten.", optionen: ["Neues", "neues"], regel: "adjektiv-nominalisiert" },
    { satz: "Sie erzählt viel ___.", optionen: ["Spannendes", "spannendes"], regel: "adjektiv-nominalisiert" },
    { satz: "Das ist das ___, was ich kenne.", optionen: ["Beste", "beste"], regel: "adjektiv-nominalisiert" },
    { art: "satz", optionen: ["Der Junge, der dort steht, ist mein Bruder.", "Der Junge der dort steht, ist mein Bruder.", "Der Junge, der dort steht ist mein Bruder."], regel: "komma-relativ" },
    { art: "satz", optionen: ["Das Buch, das ich lese, ist spannend.", "Das Buch das ich lese, ist spannend.", "Das Buch, das ich lese ist spannend."], regel: "komma-relativ" },
    { art: "satz", optionen: ["Herr Keller, unser Lehrer, ist heute krank.", "Herr Keller unser Lehrer, ist heute krank.", "Herr Keller, unser Lehrer ist heute krank."], regel: "komma-einschub" },
    { art: "satz", optionen: ["Er spart, um ein Velo zu kaufen.", "Er spart um ein Velo zu kaufen.", "Er spart um, ein Velo zu kaufen."], regel: "komma-infinitiv" },
    { art: "satz", optionen: ["Sie ging weg, ohne etwas zu sagen.", "Sie ging weg ohne etwas zu sagen.", "Sie ging weg ohne, etwas zu sagen."], regel: "komma-infinitiv" },
    { art: "satz", optionen: ["Anstatt zu lernen, spielt er.", "Anstatt zu lernen spielt er.", "Anstatt, zu lernen spielt er."], regel: "komma-infinitiv" },
  ],
};

if (typeof module !== "undefined") module.exports = RECHTSCHREIBUNG;
