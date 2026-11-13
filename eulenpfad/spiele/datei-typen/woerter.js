/* Dateiendungen für die Datei-Typen — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG MI.2.1.d/e (Medien und Informatik, 2. Zyklus): Dateitypen (Text, Bild, Ton, Video)
   und ihre Endungen; MI.2.3.f: Grösseneinheiten.

   Schreibweise: Endungen klein und ohne Punkt („jpg“), Dateinamen klein, ohne Umlaute und ohne
   Leerzeichen, wie man sie auf dem Computer oft sieht („klassenfoto“). Schweizer Schreibweise.
   Selbst gewählte Wörter, keine Namen von Kindern.

   Inhaltsliste (Entscheid L4 a): Liste-Id „endungen“ (Katalog-Eintrag „datei-typen“, Feld listen:
   „Dateiendungen und ihre Art“). Zur Liste gehören alle vier Konstanten dieser Datei. */

/** Programme, mit denen man eine Datei typischerweise öffnet. */
const DATEI_PROGRAMME = {
  texteditor:       { name: "Texteditor", bild: "🗒️", beispiel: "zum Beispiel Editor" },
  textverarbeitung: { name: "Textverarbeitung", bild: "📝", beispiel: "zum Beispiel Word" },
  pdf:              { name: "PDF-Leser", bild: "📕", beispiel: "zum Beispiel Acrobat Reader" },
  bildbetrachter:   { name: "Bildbetrachter", bild: "🖼️", beispiel: "zum Beispiel die Fotos-App" },
  musik:            { name: "Musikplayer", bild: "🎧", beispiel: "spielt Lieder ab" },
  video:            { name: "Videoplayer", bild: "📺", beispiel: "spielt Filme ab" },
  praesentation:    { name: "Präsentationsprogramm", bild: "📽️", beispiel: "zum Beispiel PowerPoint" },
  tabelle:          { name: "Tabellenkalkulation", bild: "📊", beispiel: "zum Beispiel Excel" },
  entpacken:        { name: "Entpackprogramm", bild: "📦", beispiel: "packt Dateien aus" },
  browser:          { name: "Webbrowser", bild: "🌐", beispiel: "zeigt Webseiten" },
};

/**
 * Endungen. art: text, bild, ton, video (die vier Körbe) oder praesentation, tabelle, archiv, webseite
 * (nur in der Frage nach dem Programm). haeufig: kommt schon in Stufe 2 vor. namen: Dateinamen, die
 * zur Art passen (ohne Endung). nieNeben: Arten, mit denen ein Kind die Endung verwechseln kann (.gif zeigt auch
 * bewegte Bilder) — die Endung steht nie als falsche Antwort neben der gesuchten Datei dieser Art, und ihre Namen
 * dienen bei Dateien dieser Art nicht als Falle.
 */
const DATEI_ENDUNGEN = [
  { endung: "txt",  art: "text", haeufig: true, programm: "texteditor", wozu: "nur Text, ohne Schriftarten und Farben", namen: ["notizen", "einkaufsliste", "ideen"] },
  { endung: "docx", art: "text", haeufig: true, programm: "textverarbeitung", wozu: "Text mit Schriften, Farben und Bildern", namen: ["aufsatz", "brief", "geschichte"] },
  { endung: "pdf",  art: "text", programm: "pdf", wozu: "fertiges Dokument, sieht überall gleich aus", namen: ["anleitung", "einladung", "arbeitsblatt"] },
  { endung: "jpg",  art: "bild", haeufig: true, programm: "bildbetrachter", wozu: "Fotos", namen: ["ferienfoto", "klassenfoto", "selfie"] },
  { endung: "jpeg", art: "bild", programm: "bildbetrachter", wozu: "Fotos (gleich wie .jpg)", namen: ["foto", "bergfoto", "geburtstagsfoto"] },
  { endung: "png",  art: "bild", haeufig: true, programm: "bildbetrachter", wozu: "Grafiken und Bildschirmfotos", namen: ["zeichnung", "logo", "bildschirmfoto"] },
  { endung: "gif",  art: "bild", programm: "bildbetrachter", wozu: "kleine Bilder, auch bewegte", namen: ["lachkatze", "animation", "smiley"], nieNeben: ["video"] },
  { endung: "bmp",  art: "bild", programm: "bildbetrachter", wozu: "Bilder, nicht zusammengepresst, darum gross", namen: ["malbild", "skizze", "zeichnung"] },
  { endung: "mp3",  art: "ton", haeufig: true, programm: "musik", wozu: "Lieder und Hörspiele", namen: ["lied", "lieblingssong", "hoerspiel"] },
  { endung: "wav",  art: "ton", programm: "musik", wozu: "Töne, nicht zusammengepresst, darum gross", namen: ["trommelwirbel", "klingelton", "vogelstimme"] },
  { endung: "m4a",  art: "ton", programm: "musik", wozu: "Tonaufnahmen, zum Beispiel vom Handy", namen: ["sprachnachricht", "sprachmemo", "musik"] },
  { endung: "mp4",  art: "video", haeufig: true, programm: "video", wozu: "Videos und Filme", namen: ["ferienvideo", "trickfilm", "film"] },
  { endung: "mov",  art: "video", programm: "video", wozu: "Videos, oft von Apple-Geräten", namen: ["video", "clip", "skateboardvideo"] },
  { endung: "avi",  art: "video", programm: "video", wozu: "Videos", namen: ["kinofilm", "filmclip", "zeitlupenvideo"] },
  { endung: "pptx", art: "praesentation", programm: "praesentation", wozu: "Folien für einen Vortrag", namen: ["vortrag", "praesentation", "referat"] },
  { endung: "xlsx", art: "tabelle", programm: "tabelle", wozu: "Tabellen, die rechnen können", namen: ["tabelle", "klassenkasse", "punkteliste"] },
  { endung: "zip",  art: "archiv", programm: "entpacken", wozu: "mehrere Dateien zusammengepackt", namen: ["paket", "schulprojekt", "sammlung"] },
  { endung: "html", art: "webseite", programm: "browser", wozu: "Webseiten", namen: ["startseite", "index", "homepage"] },
];

/** Stufe 1: Dinge, die man auf dem Computer speichern kann — welche Art Datei wird es? */
const DATEI_DINGE = [
  { bild: "✉️", name: "ein Brief", art: "text" },
  { bild: "📝", name: "ein Aufsatz", art: "text" },
  { bild: "🛒", name: "eine Einkaufsliste", art: "text" },
  { bild: "📖", name: "eine Geschichte zum Lesen", art: "text" },
  { bild: "📷", name: "ein Ferienfoto", art: "bild" },
  { bild: "🎨", name: "eine Zeichnung", art: "bild" },
  { bild: "🤳", name: "ein Selfie", art: "bild" },
  { bild: "🗺️", name: "eine Landkarte", art: "bild" },
  { bild: "🎵", name: "ein Lied", art: "ton" },
  { bild: "🎤", name: "eine Sprachnachricht", art: "ton" },
  { bild: "🎧", name: "ein Hörspiel", art: "ton" },
  { bild: "🔔", name: "ein Klingelton", art: "ton" },
  { bild: "🥁", name: "ein Trommelwirbel", art: "ton" },
];

/** Neutrale Namen: Hier entscheidet nur die Endung („ferien.mp3“ ist Ton, „ferien.jpg“ ein Bild). */
const DATEI_NEUTRAL = ["ferien", "geburtstag", "schulreise", "zoo", "klassenlager", "sporttag", "fasnacht", "skilager"];
