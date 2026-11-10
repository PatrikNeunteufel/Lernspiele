/* Kontakt der Entwicklung — die eine Stelle, an der die Entwicklung ihre Adresse einträgt
   (Entscheid A1 a, LERN_Session9). Nur die Startseite lädt diese Datei; Doku: docs/eulenpfad/rahmen.md,
   Abschnitt 13 „Fehler melden“.

   meldungen: E-Mail-Adresse, an die eine Aufsicht bestätigte Fehlermeldungen schickt (aus ihrem eigenen
              Mailprogramm, ohne den Namen des Kindes). Die Seite ist öffentlich, die Adresse also für
              jeden lesbar (auch für Sammelprogramme). Seit LERN_Session27 die Adresse der Entwicklung (NS1 a,
              Plan C12); im Betreff stehen Lernprogramm, Thema und Kennung der Meldung.
              Leer (""): kein E-Mail-Knopf; die Aufsicht kann den Text der Meldung nur kopieren.
   server:    Adresse des Entwickler-Servers für Meldungen und Entwicklung (C11-3 a), nur http://localhost:<Port> oder
              http://127.0.0.1:<Port>. Leer (""): dieselbe Seite. Je Gerät abweichend unter Verwaltung → Einstellungen. */

const EULENPFAD_KONTAKT = Object.freeze({
  meldungen: "patrik.neunteufel@gmail.com",
  server: "",
});
