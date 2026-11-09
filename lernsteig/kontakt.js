/* Kontakt der Entwicklung für den Lernsteig — die eine Stelle, an der die Entwicklung ihre Adresse einträgt (wie
   eulenpfad/kontakt.js, Entscheid A1 a; Plan C11, C11-3 a). Nur die Startseite lädt diese Datei; Doku:
   docs/lernsteig/rahmen.md, Abschnitt „Fehler melden“.

   meldungen: E-Mail-Adresse, an die Jugendliche oder eine verbundene Aufsicht Fehlermeldungen schicken (aus dem eigenen
              Mailprogramm, ohne Namen). Die Seite ist öffentlich — darum ein eigenes Postfach nur für Meldungen, keine
              private Adresse. Leer (""): kein E-Mail-Weg; die Meldung lässt sich dann nur als Text kopieren.
   server:    Adresse des Entwickler-Servers für Meldungen und Entwicklung (C11-3 a), nur http://localhost:<Port> oder
              http://127.0.0.1:<Port>. Leer (""): dieselbe Seite. Je Gerät abweichend unter Verwaltung → Einstellungen. */

const LERNSTEIG_KONTAKT = Object.freeze({
  meldungen: "",
  server: "",
});
