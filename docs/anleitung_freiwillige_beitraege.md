# Anleitung: Freiwillige Beiträge einrichten

Stand: 03.11.2026 (LERN_Session11, Wunsch Patrik) · Für Patrik. Ziel: Erwachsene können die Reihe Eulenpfad →
Lernsteig → Gratwanderung freiwillig unterstützen; die Links werden vorbereitet und erst aktiv, wenn eine Adresse
eingetragen ist. **Vorbereitung gebaut** (Abschnitt 4); aktiv wird erst, was in `portal/unterstuetzen.js` eine `url` hat.

Eine frühere Besprechung dazu fand ich in den Sitzungen nicht (gesucht am 03.11.2026 in allen Sitzungen, auch
archivierten, nach Spende, buymeacoffee, Ko-fi, Twint, „freiwillige Zahlung“, GitHub Sponsors, donation, Gönner,
Bezahl, Unterstützen). Falls es Notizen gibt (Patrik: „schon irgendwo coffee“), diese Anleitung damit abgleichen.

## 1. Grundsätze

- **Nur für Erwachsene sichtbar:** im Portal (Fusszeile), in der Anleitung für Erwachsene und in der Verwaltung —
  **nie** in einem Spiel, auf der Startseite der Kinder oder im Tab Erfolge. Kinder sollen nicht um Geld gebeten werden.
- **Freiwillig und ohne Gegenleistung:** Nichts wird gegen Geld freigeschaltet; alle Spiele bleiben für alle gleich.
  Der Satz „Keine Anmeldung, keine Werbung“ im Portal bleibt wahr.
- **Nur schlichte Links**, keine eingebetteten Knöpfe oder Skripte der Anbieter: kein Nachladen fremder Inhalte, kein
  Verfolgen der Besucher, die Seite läuft offline weiter (Steckbrief: ohne externe Abhängigkeiten). Wer auf den Link
  tippt, verlässt Eulenpfad — das steht beim Link dabei.
- **Keine Daten über Kinder** auf der Seite des Anbieters (keine Fotos, keine Namen, keine Lernstände).

## 2. Möglichkeiten im Vergleich

**Nicht nachgeprüft:** Die Angaben zu Gebühren und Bedingungen stammen aus allgemeinem Wissen, nicht aus einem Abruf
der Anbieterseiten; sie ändern sich. Vor dem Einrichten auf der Seite des Anbieters nachlesen und hier nachtragen
(mit Datum und Quelle).

| Möglichkeit | wie | Gebühren (ungeprüft) | wiederkehrend | Hinweise |
|---|---|---|---|---|
| **Buy Me a Coffee** | Seite beim Anbieter, „einen Kaffee spendieren“ | Anteil des Anbieters plus Zahlungsgebühr | ja | bekanntes Bild „Kaffee“, Auszahlung über Zahlungsdienst |
| **Ko-fi** | ähnlich, „Kaffee“-Seite | bei einmaligen Beiträgen meist ohne Anteil des Anbieters, Zahlungsgebühr bleibt | ja | Auszahlung über PayPal oder Stripe |
| **GitHub Sponsors** | Knopf „Sponsor“ am GitHub-Konto bzw. Repo | für persönliche Konten meist ohne Anteil von GitHub | ja | passt zum Repo auf GitHub; Land und Bankkonto müssen unterstützt sein |
| **Liberapay** | gemeinnützige Plattform für wiederkehrende Beiträge | kein Anteil der Plattform, Zahlungsgebühr bleibt | nur wiederkehrend | wenig bekannt bei Eltern |
| **PayPal.me** | persönlicher Zahlungslink | Gebühr je nach Art der Zahlung | nein | viele haben PayPal |
| **Banküberweisung mit QR-Rechnung** | Schweizer QR-Rechnung als Bild/PDF mit IBAN, ohne Betrag | keine (bei Schweizer Banken üblich) | nein | kein Dritter ausser der Bank; mit jeder Banking-App scanbar; IBAN und Name werden öffentlich |
| **TWINT** | — | — | — | für Privatpersonen auf einer Website nach meinem Wissen nur über einen Geschäfts- oder Spendenanbieter; vor einer Wahl prüfen |

**Vorschlag:** ein „Kaffee“-Link (das Konto, das Patrik schon hat) und dazu die **QR-Rechnung** für alle, die keinen
Zahlungsdienst wollen. GitHub Sponsors zusätzlich, wenn das Repo öffentlich auf GitHub liegt (tut es für Pages).

## 3. Vorher klären (nicht Teil dieser Anleitung)

- **Steuern:** Freiwillige Beiträge an eine Privatperson können Einkommen sein; mit dem Steueramt klären, wie sie zu
  deklarieren sind.
- **Impressum:** Ob die Seite mit einem Beitrags-Link ein Impressum braucht, ist nicht geprüft; vor dem Aktivieren
  klären (Schweizer Recht; GitHub Pages ist öffentlich).
- **Name des Kontos:** Öffentlich sichtbar wird, was beim Anbieter steht (Name, bei der QR-Rechnung auch IBAN). Wenn
  nicht der eigene Name erscheinen soll: Konto auf den Namen der Reihe, soweit der Anbieter das erlaubt.

## 4. Was im Projekt vorbereitet ist (gebaut LERN_Session11)

Geprüft am 03.11.2026 im Browser: mit leeren Links nirgends sichtbar; mit einem Probe-Link (danach wieder entfernt)
in Portal-Fusszeile, Beitragsseite (Link öffnet neuen Tab), Anleitung für Erwachsene und Verwaltung → Einstellungen
sichtbar, als Kind in keinem Tab. Das Testskript meldet einen Fehler, sobald eine andere Datei im App-Ordner die
Beitragsseite verlinkt (Gegenprobe mit einer Probedatei, danach gelöscht).

- **Eine Datei** `portal/unterstuetzen.js` für die ganze Reihe, wie `eulenpfad/kontakt.js` für Meldungen:

  Einträge `kaffee`, `github`, `qr` mit `bild`, `name`, `text`, `url`; bei `qr` ist `url` der Pfad zum Bild der
  QR-Rechnung relativ zu `portal/` (die Seite zeigt das Bild zum Scannen).

  **Leer = unsichtbar.** Aktivieren heisst: `url` eintragen, committen, pushen — sonst nichts.
- **Wo es erscheint:** im Portal eine kleine Zeile in der Fusszeile „☕ Eulenpfad unterstützen“ (öffnet die kurze
  Seite `portal/unterstuetzen.html` mit den aktiven Möglichkeiten, dem Satz „freiwillig, alle Spiele bleiben für alle
  gleich“ und dem Hinweis, dass die Links zu fremden Seiten führen); in der Anleitung für Erwachsene ein Abschnitt vor
  den häufigen Fragen; in der Verwaltung unter Einstellungen (nur Aufsicht) ein Verweis. Nirgends für Kinder.
- **Prüfung im Testskript** (`tools/pruefe_spiele.js`): Im App-Ordner dürfen nur `start/verwaltung.js` und
  `anleitung/aufsicht.html` auf `unterstuetzen.html` verweisen.

## 5. Einrichten, Schritt für Schritt

1. Anbieter wählen (Abschnitt 2), Bedingungen und Gebühren auf seiner Seite nachlesen und hier nachtragen.
2. Konto anlegen bzw. das bestehende „Kaffee“-Konto heraussuchen. Seite schlicht halten: was die Reihe ist, dass alles
   kostenlos und werbefrei bleibt, kein Bild von Kindern.
3. Link der Seite kopieren (bei der QR-Rechnung: QR-Rechnung ohne Betrag in der Banking-App oder mit dem Generator der
   Bank erstellen, als PNG oder PDF unter `portal/` ablegen).
4. Link bzw. Pfad in `portal/unterstuetzen.js` bei `url` eintragen.
5. Lokal prüfen (Portal öffnen, Link sichtbar, führt zur richtigen Seite), dann committen und pushen — GitHub Pages
   veröffentlicht von selbst.
