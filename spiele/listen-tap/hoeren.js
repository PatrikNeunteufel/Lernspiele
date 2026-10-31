/* Listen & Tap: eigene Hör-Inhalte — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS1E.1.A.1: vertraute Wörter und einfache Anleitungen verstehen, mit Bild.
   Britisches Englisch. Die Einzelwörter (Colours, Animals, Numbers, Food, Family/Body, School)
   kommen aus spiele/word-match/woerter.js (Verweis im Katalog, dort geprüft und freigegeben).

   Eigene Inhaltslisten (Entscheid L4 a), einzeln freizugeben; Prüfstand im Katalog
   (spiele/gemeinsam/katalog.js, Spiel „listen-tap“, Feld listen):
   - „anweisungen“: „Touch the red heart.“ — Farbe und Form; Bilder sind farbige Emoji
   - „wo-ist“:      „The cat is under the table.“ — Tier und Ort; das Bild wird gezeichnet

   ANWEISUNG_FARBEN: englische Farbe → Emoji für [circle, square, heart] (Reihenfolge wie ANWEISUNG_FORMEN).
   Weiss fehlt mit Absicht: weisse Emoji sind auf den weissen Knöpfen schlecht zu sehen.
   ANWEISUNG_VERBEN: Anfang der Anweisung; die ersten nur in den unteren Stufen.
   WO_TIERE: [englisch, Emoji]. WO_ORTE: [Ding, Präposition] — nur Lagen, die sich eindeutig zeichnen lassen. */

const HOER_LISTEN = ["anweisungen", "wo-ist"];

const ANWEISUNG_FORMEN = ["circle", "square", "heart"];
const ANWEISUNG_FARBEN = {
  red: ["🔴", "🟥", "❤️"], orange: ["🟠", "🟧", "🧡"], yellow: ["🟡", "🟨", "💛"], green: ["🟢", "🟩", "💚"],
  blue: ["🔵", "🟦", "💙"], purple: ["🟣", "🟪", "💜"], brown: ["🟤", "🟫", "🤎"], black: ["⚫", "⬛", "🖤"],
};
const ANWEISUNG_VERBEN = ["Touch the", "Point to the", "Find the"];

const WO_TIERE = [["cat", "🐱"], ["dog", "🐶"], ["mouse", "🐭"], ["frog", "🐸"], ["bird", "🐦"], ["duck", "🦆"]];
const WO_ORTE = [["table", "on"], ["table", "under"], ["table", "next to"], ["box", "in"], ["box", "on"], ["box", "next to"]];
