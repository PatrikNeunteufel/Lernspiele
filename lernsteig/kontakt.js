/* Kontakt der Entwicklung für den Lernsteig — die eine Stelle, an der die Entwicklung ihre Adresse einträgt (wie
   eulenpfad/kontakt.js, Entscheid A1 a; Plan C11, C11-3 a). Nur die Startseite lädt diese Datei; Doku:
   docs/lernsteig/rahmen.md, Abschnitt „Fehler melden“.

   meldungen: E-Mail-Adresse, an die Jugendliche oder eine verbundene Aufsicht Fehlermeldungen schicken (aus dem eigenen
              Mailprogramm, ohne Namen). Die Seite ist öffentlich, die Adresse also für jeden lesbar. Seit LERN_Session27 die
              Adresse der Entwicklung (NS1 a, Plan C12); im Betreff Lernprogramm, Thema und Kennung der Meldung. Leer (""): kein E-Mail-Weg; die Meldung lässt sich dann nur als Text kopieren.
   server:    Adresse des Servers für Meldungen und Entwicklung: http://localhost:<Port> oder http://127.0.0.1:<Port>
              (C11-3 a) oder der Meldungsserver im Netz über https (Plan C12, NS1 a; angenommen nur mit der Unterschrift
              der Entwicklung, NS2 a). Leer (""): dieselbe Seite. Je Gerät abweichend unter Verwaltung → Einstellungen. */

const LERNSTEIG_KONTAKT = Object.freeze({
  meldungen: "patrik.neunteufel@gmail.com",
  server: "",
});
