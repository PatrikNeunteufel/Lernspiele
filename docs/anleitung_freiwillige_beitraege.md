# Anleitung: Freiwillige Beiträge einrichten

Stand: 04.11.2026 (LERN_Session11, Wunsch Patrik; Anbieter in Abschnitt 2 am 04.11.2026 nachgeprüft) · Für Patrik. Ziel: Erwachsene können die Reihe Eulenpfad →
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

**Nachgeprüft am 04.11.2026** auf den Seiten der Anbieter (LERN_Session13, Nebensitzung Recherche). „…“ = vom
Abrufwerkzeug als Wortlaut ausgegeben; **nicht bestätigt** = nur aus Suchergebnissen oder Seite gesperrt. Bedingungen
ändern sich — vor dem Einrichten noch einmal auf der Seite des Anbieters nachsehen.

| Möglichkeit | Gebühren | einmalig / wiederkehrend | Schweiz | Hinweise | Quelle |
|---|---|---|---|---|---|
| **GitHub Sponsors** | „GitHub Sponsors does not charge any fees for sponsorships from personal accounts.“ (Organisationen „up to 6%“) | „choose between one-time or monthly payment amounts“ | „Switzerland“ in der Liste der unterstützten Regionen | Auszahlung über Stripe Connect; „your region of residence and the region of your bank account must match“; Steuerformular W-8BEN für Personen ohne Wohnsitz in den USA; Auszahlung „for any month that your balance reaches $100 USD“, erste Zahlung „60 days after the first sponsorship is initiated“. Link `github.com/sponsors/<name>` (Form **nicht bestätigt**) | https://docs.github.com/en/sponsors/getting-started-with-github-sponsors/about-github-sponsors ; …/setting-up-github-sponsors-for-your-personal-account ; https://docs.github.com/en/site-policy/github-terms/github-sponsors-additional-terms |
| **Ko-fi** | einmalig 0 %, monatlich 5 %; Ko-fi Gold für 0 % (Preis widersprüchlich) | beides | **nicht bestätigt** | Auszahlung über PayPal oder Stripe, deren Gebühren kommen dazu — alles **nicht bestätigt** (ko-fi.com und Hilfe lieferten HTTP 403) | help.ko-fi.com (nur Suche) |
| **Buy Me a Coffee** | „We only take 5%“ | beides | **nicht bestätigt** (Länderliste nicht gelesen) | Auszahlung „transferred to your Stripe account every Wednesday“ über Stripe Express | https://help.buymeacoffee.com/en/articles/10182730-what-is-buy-me-a-coffee-and-how-does-it-work |
| **Liberapay** | „Liberapay does not take a cut of payments“; Zahlungsdienste im Schnitt „3% for … Stripe and 5% for … PayPal“ | „One-time donations aren't properly supported yet.“ | unter den „Best supported territories“; „Swiss Franc (CHF) supported by PayPal“ | wenig bekannt bei Eltern | https://liberapay.com/about/faq ; https://liberapay.com/about/global |
| **PayPal** | Spenden gelten als gewerblich: „eine Spende an eine gemeinnützige Organisation senden oder empfangen“; Satz Inland „3,4% + Festgebühr“ (0,55 CHF) | einmalig | ja | „Freunde und Familie“ ist kostenlos, ob ein öffentlicher Spendenlink so laufen darf: **nicht bestätigt** (Nutzungsbedingungen nicht gelesen); Gebührenseite Stand 31.05.2021 | https://www.paypal.com/ch/digital-wallet/paypal-consumer-fees ; https://www.paypal.com/ch/business/paypal-business-fees |
| **TWINT** | Vereine: „einmalig und kostenlos“ registrieren, „beliebig viele QR-Codes und PayLinks, um Zahlungen und Spenden einzusammeln“, „ohne Fixkosten“ | einmalig | ja | **nur für Vereine/Organisationen** belegt; für Privatpersonen nur „Geld anfordern“ in der App (**nicht bestätigt** als Website-Link); der Händler-QR-Sticker „may not be used online“ | https://www.postfinance.ch/de/unternehmen/produkte/einkassieren/zahlungsloesungen/twint/twint-vereine.html ; https://www.twint.ch/en/business-customers/products/qr-code-sticker/ |
| **QR-Rechnung ohne Betrag** | Gebühren für den Empfänger: **nicht bestätigt** | einmalig | ja | „Ja, es können Belege ohne Betragsvorgabe und ohne Adresse des Zahlungspflichtigen verwendet werden. Für solche Belege ist die QR-Rechnung mit IBAN und ohne Referenz zu verwenden.“ Seit 22.11.2025 gelten neue Vorgaben von SIX. IBAN und Name werden öffentlich | FAQ der Basellandschaftlichen Kantonalbank (PDF, 09/2022); https://www.six-group.com/de/products-services/banking-services/payment-standardization/standards/qr-bill.html |

**Vorschlag (nach der Nachprüfung):** **GitHub Sponsors** als Hauptweg — für die Schweiz belegt, ohne Gebühr, einmalig
und monatlich, passt zum öffentlichen Repo; dazu die **QR-Rechnung** für alle ohne Zahlungsdienst. Den „Kaffee“-Link
nur, wenn das bestehende Konto auf seiner Seite die Auszahlung in die Schweiz bestätigt (Ko-fi gesperrt, Buy Me a
Coffee ohne Länderangabe). PayPal ist wegen 3,4 % + 0,55 CHF teurer. **TWINT erst mit einem Verein** — dann aber
kostenlos und mit Links für die Website.

Folgen von GitHub Sponsors, die vor dem Einrichten bekannt sein sollten: Konto bei Stripe mit Schweizer Bankkonto,
Formular W-8BEN, Auszahlung erst ab 100 $ im Monat (darunter bleibt das Guthaben stehen) und frühestens 60 Tage nach
der ersten Spende.

## 3. Vorher klären (nicht Teil dieser Anleitung)

- **Steuern:** Freiwillige Beiträge an eine Privatperson können Einkommen sein; mit dem Steueramt klären, wie sie zu
  deklarieren sind. Eine amtliche Aussage für St. Gallen wurde am 04.11.2026 nicht gefunden. Spenden an eine
  Privatperson sind für die Spender nicht abziehbar (abziehbar nur an steuerbefreite juristische Personen, ab
  „gesamthaft Fr. 100“; https://www.sg.ch/steuern-finanzen/steuern/zuwendungen-an-gemeinnuetzige-organisationen0.html).
  Einzelheiten und die geplante Schullizenz: [monetarisierung_recherche.md](monetarisierung_recherche.md).
- **Impressum:** Die Pflicht nach UWG Art. 3 Abs. 1 lit. s kennt laut einer Anwaltskanzlei „keine Beschränkung auf
  gewerbliche bzw. entgeltliche Angebote“ und greift, wer „Waren, Werke oder Leistungen im elektronischen
  Geschäftsverkehr anbietet“ (https://www.law.ch/lawinfo/ict-law-informations-und-kommunikationstechnologie/impressumspflicht-e-commerce/).
  Ob Spendenlinks darunterfallen, sagt die Quelle nicht — **nicht bestätigt**; vor dem Aktivieren klären. Spätestens
  mit der Schullizenz ist ein Impressum nötig.
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
