/* Freiwillige Beiträge für die Reihe Eulenpfad → Lernsteig → Gratwanderung — die eine Stelle, an der die
   Entwicklung die Links einträgt (Wunsch Patrik, LERN_Session11, LERN-50; Anleitung docs/anleitung_freiwillige_beitraege.md).

   url leer (""): die Möglichkeit ist unsichtbar. Ist keine eingetragen, zeigt keine Seite einen Hinweis.
   Aktivieren: url eintragen, committen, pushen — sonst nichts.
   Nur für Erwachsene: Portal, Anleitung für Erwachsene, Verwaltung. Nie in Spielen oder Tabs der Kinder
   (das Testskript prüft es). Nur schlichte Links, keine Knöpfe oder Skripte der Anbieter.

   qr: url ist der Pfad zu einem Bild der Schweizer QR-Rechnung ohne Betrag, relativ zu portal/ (z. B. "qr-rechnung.png"). */

const UNTERSTUETZEN = Object.freeze([
  { id: "kaffee", bild: "☕", name: "Einen Kaffee spendieren", text: "Einmalig oder regelmässig, über die Seite des Anbieters.", url: "" },
  { id: "github", bild: "💜", name: "GitHub Sponsors", text: "Für alle mit einem GitHub-Konto.", url: "" },
  { id: "qr", bild: "🏦", name: "Banküberweisung", text: "QR-Rechnung zum Scannen mit der Banking-App, ohne Zahlungsdienst.", url: "", qr: true },
]);

/** Die eingerichteten Möglichkeiten (url gesetzt). */
const unterstuetzenAktiv = () => UNTERSTUETZEN.filter(u => u.url);
