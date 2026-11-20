/* Freiwillige Beiträge für die Reihe Eulenpfad → Lernsteig → Gratwanderung — die eine Stelle, an der die
   Entwicklung die Links einträgt (Wunsch Patrik, LERN_Session11, LERN-50; Anleitung docs/anleitung_freiwillige_beitraege.md).

   url leer (""): die Möglichkeit ist unsichtbar. Ist keine eingetragen, zeigt keine Seite einen Hinweis.
   Aktivieren: url eintragen, committen, pushen — sonst nichts.
   Nur für Erwachsene: Portal, Anleitung für Erwachsene, Verwaltung. Nie in Spielen oder Tabs der Kinder
   (das Testskript prüft es). Nur schlichte Links, keine Knöpfe oder Skripte der Anbieter.

   qr: url ist der Pfad zu einem Bild der Schweizer QR-Rechnung ohne Betrag, relativ zu portal/ (z. B. "qr-rechnung.png"). */

const UNTERSTUETZEN = Object.freeze([
  { id: "kaffee", bild: "☕", name: "Einen Kaffee spendieren", text: "Einmalig oder regelmässig, über Ko-fi.", url: "https://ko-fi.com/prunecopy" },
  // Ausgeblendet bis zur Freigabe des Profils durch GitHub (eingereicht 2026-11-20); danach bei url eintragen:
  // "https://github.com/sponsors/patrikneunteufel" — und in .github/FUNDING.yml das # vor github: entfernen
  { id: "github", bild: "💜", name: "GitHub Sponsors", text: "Einmalig oder monatlich, für alle mit einem GitHub-Konto.", url: "" },
  { id: "patreon", bild: "🧡", name: "Patreon", text: "Monatlich, über Patreon.", url: "https://www.patreon.com/PruneCopy" },
  { id: "qr", bild: "🏦", name: "Banküberweisung", text: "QR-Rechnung zum Scannen mit der Banking-App, ohne Zahlungsdienst.", url: "", qr: true },
]);

/* Rückmeldung (Wunsch Patrik, LERN_Session49): Aufsicht und Erwachsene sollen sagen können, ob ihnen die Reihe gefällt —
   öffentlich auf GitHub, nur für Erwachsene verlinkt wie die Beiträge (Verwaltung, Anleitung für Erwachsene, Portal).
   Fehler in einer Aufgabe gehen weiter über „🙋 Melden“ (M1 a), nicht hierhin. url leer: kein Hinweis.
   Ziel GitHub Discussions statt Issues (Entscheid RM1 a, 2026-11-20): Issues bleiben die Arbeitsliste der Entwicklung. */
const RUECKMELDUNG = Object.freeze({
  url: "https://github.com/patrikneunteufel/Lernspiele/discussions",
  titel: "💬 Gefällt Ihnen Eulenpfad?",
  text: "Hinterlassen Sie eine Rückmeldung auf GitHub — das hilft, die Spiele besser zu machen. Bitte keine Namen von Kindern; Fehler in einer Aufgabe melden Sie besser mit „🙋 Melden“ im Spiel.",
});

/** Die eingerichteten Möglichkeiten (url gesetzt). */
const unterstuetzenAktiv = () => UNTERSTUETZEN.filter(u => u.url);
