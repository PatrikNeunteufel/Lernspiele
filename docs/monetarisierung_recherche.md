# Eulenpfad — Einnahmen: Schulangebot mit Klassenmanagement

Recherche vom 2026-11-04 (alle Abrufe an diesem Tag), Ergänzung zu
[pilotversuch_recherche.md](pilotversuch_recherche.md).

**Ausgangslage (Vorgabe Patrik, 2026-11-04):**
- **Privat bleibt kostenlos**, getragen von freiwilligen Spenden
  ([anleitung_freiwillige_beitraege.md](anleitung_freiwillige_beitraege.md), Anbieter dort am 04.11.2026 nachgeprüft:
  GitHub Sponsors für die Schweiz belegt und ohne Gebühr, dazu QR-Rechnung; TWINT erst mit einem Verein); privat gibt
  es kein Klassenmanagement.
- **Der Pilot ist kostenlos.**
- **Bezahlen sollen Schulen** für das künftige **Klassenmanagement** ([konzept_gruppen.md](konzept_gruppen.md),
  entschieden G1–G11, nicht gebaut) und was dazukommt (z. B. Klassen- oder Schulserver für die Verwaltung).
- Gesucht sind **realistische Preise, die Schulen für den Nutzen gern zahlen** — CHF 1 je Kind ist zu wenig.

**Kein Steuer- oder Rechtsrat.** Hier steht, was die Stellen öffentlich sagen, und eine Durchrechnung. Steuerfragen
klärt das Kantonale Steueramt, AHV-Fragen die SVA St. Gallen.

## Wie belegt ist, was hier steht

- **„…“** = vom Abrufwerkzeug als Wortlaut der Seite ausgegeben (über ein kleines Modell wiedergegeben, nicht
  Zeichen für Zeichen gegen die Seite geprüft).
- **nicht bestätigt** = nur aus Suchergebnissen oder Seite nicht lesbar.
- **Annahme / Einschätzung** = eigene Rechengrösse oder Folgerung, nicht Aussage einer Seite.
- Euro-Preise sind nicht in Franken umgerechnet (Kurs nicht abgerufen).
- Reichweite: Abschnitt 9.

---

## 1. Was Schulen heute zahlen

### 1.1 Lernangebote mit Ansicht für Lehrpersonen

| Produkt (Anbieter) | Preis wie angegeben | Einheit | Was die Lehrperson bekommt | Quelle | Beleg |
|---|---|---|---|---|---|
| Lernlupe (Lehrmittelverlag SG, 3.–6. Kl.) | „Eine Schuljahreslizenz Lernlupe kostet CHF 29.95 pro Schülerin/Schüler.“ | je Kind, Schuljahr | Aufgabenpool, Orientierungstests, Standortbestimmung; „Die Lizenzen der Lehrpersonen und Supportleistungen sind integrierter Bestandteil des Pakets.“ | https://www.lernlupe.ch/lernlupe/ | gelesen |
| appolino 2.0 (LMV SG) | Schuljahreslizenz „CHF 7.00“, privat „CHF 9.00“ | je Kind, Schuljahr | Cockpit: Klassen verwalten, Lernstand, Missionen zuweisen, Klasse teilen; „das Lehrpersonen-Cockpit ist für Lehrpersonen kostenlos“ | https://www.appolino.ch | gelesen |
| Zahlenzorro (Westermann, D) | „19 € pro Kind und Jahr“, „49 € pro Klasse und Jahr“, „213 € pro Schule und Jahr“ | Kind / Klasse / Schule | Aufgaben an Klasse oder einzelne Kinder zuweisen, Übersicht, Auswertung | https://zahlenzorro.westermann.de | gelesen |
| ANTON Schullizenz (D) | Basis 250 € (bis 500 Kinder) / 400 €; Plus 450 € / 700 € je Jahr | je Schule | Schulverwaltung, CSV-Import, „individuell Aufgaben zuweisen“, „Reports: Sieh den Lernfortschritt auf einen Blick“ (Admin-Anleitung, Stand 08.02.2023) | Preise: Liste Stadt Wiesbaden und Drittseiten; Funktionen: Anleitungs-PDF moodle.lmz-bw.de | Funktionen gelesen, Preise **nicht bestätigt** |
| Classtime | CHF 975 (1–15 Lehrpersonen) bis CHF 9'100 (über 150) je Jahr | je Schule | — | Servicekatalog MBA Zürich (PDF nicht abrufbar) | **nicht bestätigt** |
| Mathletics (3P Learning) | „10-29 pupils: 21.00€“ … „Whole Schools: 9.00€“, „exclusive of VAT“ | je Kind, Jahr | „Reports“, „Teacher Console“ | https://www.3plearning.com/uk/renew-eu-schools | gelesen |
| Kahoot! | Bronze „$36 billed annually“ … One $228 | je Lehrperson, Jahr | — | https://kahoot.com/schools/plans | gelesen (Aktionspreise möglich) |
| LearningView (PH Schwyz) | „nichtkommerzielle Plattform“, „kostenlosen Kontos“ | gratis | Wochenpläne, Schulverwaltung; Server bei Hetzner, Falkenstein (D) | https://learningview.org/nutzungsbedingungen.php | gelesen |
| Schlaukopf (D) | „Der Schlaukopf Lehrerbereich ist kostenlos.“ | gratis | Gruppen, Arbeitsaufträge, Auswertungen | https://www.schlaukopf.de/lehrer | gelesen |

### 1.2 Schulverwaltung (zum Vergleich der Grössenordnung)

| Produkt | Angabe | Quelle | Beleg |
|---|---|---|---|
| LehrerOffice | Schulgemeinde Wetzikon „bisher pro Jahr rund 31'500 Franken“ | Protokoll Schulpflege Wetzikon, 12.04.2022 | gelesen |
| Escola (Ersatz in Wetzikon) | 47'180 Fr. je Jahr inkl. MWST; davon **Förderplanung 4'480** | gleiches Protokoll | gelesen |
| Klapp (Elternkommunikation) | „pro Jahr und Schulkind sechs Franken“ | SRF, 13.09.2019 | gelesen, **veraltet** |

### 1.3 Was daraus folgt

- **Die Ansicht für Lehrpersonen ist oft gratis** (appolino, Schlaukopf, LearningView): Bezahlt wird dort für
  die Inhalte der Kinder. Eulenpfad gibt die Inhalte gratis ab — also muss das Bezahlte **Arbeit der Lehrperson
  sparen oder Pflichten der Schule abnehmen**, nicht Spiele freischalten.
- **Preisbänder:** je Klasse rund 49 € (Zahlenzorro); je Kind CHF 7 bis 29.95 (appolino, Lernlupe) mit Inhalten;
  je Schule 213–700 € (Zahlenzorro, ANTON), Classtime ab CHF 975.
- Für ein **Modul Förderplanung** zahlt eine Zürcher Schulgemeinde mehrere Tausend Franken im Jahr (Escola).

## 2. Rahmen

| Thema | Was die Quelle sagt | Quelle | Folge |
|---|---|---|---|
| Beschaffung | „Neu können Lieferaufträge bis unter Fr. 150'000.– … freihändig vergeben werden.“ (gleich für Dienstleistungen) | sg.ch, PDF zum neuen Beschaffungsrecht via https://www.sg.ch/recht/beschaffungswesen/neues_beschaffungsrecht_2023/ | kein Ausschreibungsthema |
| Lehrmittelliste | „Dem Schulträger ist es aber erlaubt, weitere Lehrmittel, welche nicht auf der Liste aufgeführt sind, bei einem anderen Lieferanten zu beziehen.“ | SGV, „Ausführungen zum Lehrmittelbestellprozess“ (21.11.2023), https://www.sgv-sg.ch/lehrmittel/ | direkter Bezug bei Patrik zulässig |
| MWST-Pflicht | ab „mindestens 100'000 Franken Umsatz“ aus nicht ausgenommenen Leistungen | https://www.estv.admin.ch/de/mwst-steuerpflicht | siehe 5.2 |
| MWST Bildung | Bei reinen „PC-Programme usw.“: „Es handelt sich dabei nicht um von der Steuer ausgenommene Bildungsleistungen.“ | MWST-Branchen-Info 20, Ziff. 4.9.2 (ESTV, 05.12.2025) | Lizenzen zählen zum Umsatz |
| AHV | „beträgt das Jahreseinkommen maximal 2 500 Franken, werden Beiträge nur auf Ihren Wunsch erhoben.“ | Merkblatt 2.02, Stand 1.1.2026, https://www.ahv-iv.ch/p/2.02.d | mit der ersten Schullizenz überschritten (5.2) |
| AHV Anmeldung | „Jede selbständige Erwerbstätigkeit ist bei der AHV-Ausgleichskasse am Geschäftssitz anzumelden.“ | https://www.svasg.ch/produkte/ahv/versicherungsbeitraege/beitraege_der_selbstaendigerwerbenden.php | vor der ersten Rechnung |
| Gemeinnützigkeit | keine Befreiung, wenn „ein Entgelt fordert, wie es im Wirtschaftsleben üblicherweise bezahlt wird“ | Steuerbuch SG StB 80 Nr. 2 | Schullizenz zu Marktpreisen ⇒ kein steuerbefreiter Verein für diesen Teil |
| Spendenabzug | nur an steuerbefreite juristische Personen, ab „gesamthaft Fr. 100“ | https://www.sg.ch/steuern-finanzen/steuern/zuwendungen-an-gemeinnuetzige-organisationen0.html | private Spenden an Patrik nicht abziehbar |
| Impressum | „klare und vollständige Angaben über seine Identität und seine Kontaktadresse einschliesslich derjenigen der elektronischen Post“; „Ein blosses Kontaktformular reicht nicht aus.“ | UWG Art. 3 Abs. 1 lit. s; https://www.kmu.admin.ch/de/die-gesetze-der-schweiz-und-der-eu | bei Verkauf nötig |
| QR-Rechnung | Zahlteile „beziehen oder selber erstellen“ | https://www.six-group.com/de/products-services/banking-services/payment-standardization/downloads-faq/faq.html | Rechnung ohne Server machbar |
| Gehostete Daten (Cloud) | Cloud ist „Bearbeiten im Auftrag“, die Schule „bleibt für die Datenbearbeitung verantwortlich“; schriftlicher Vertrag mit Zweckbindung, Orten der Bearbeitung, Unterauftragnehmern nur mit Bewilligung, Schweizer Recht; besonders schützenswerte Daten nur so verschlüsselt, dass der Anbieter nicht zugreifen kann | privatim-Merkblatt „Cloud Computing im Schulbereich“ (PDF, Kanton Aargau) | gehosteter Klassenserver ⇒ Vertrag zur Auftragsbearbeitung; die Ende-zu-Ende-Verschlüsselung aus G4 erfüllt die Verschlüsselungsforderung |
| edulog (Anmeldung über die Schweizer Bildungs-Identität) | „Bei einem Beitritt zu Edulog entstehen keine wiederkehrenden Kosten“; Anbindung „einmalig Kosten von 1'450 Franken (exkl. MWST)“; Bearbeitung ausserhalb EU/EWR bzw. ohne angemessenes Schutzniveau „ist unzulässig“ | https://www.edulog.ch/de/beitritt/beitritt-dienstleistungsanbieter, Vertragsvorlage 17.02.2026 | nur sinnvoll, wenn Lehrpersonen sich an einem Dienst anmelden (siehe 4) |

## 3. Zahlen für die Durchrechnung

| Grösse | Wert | Quelle |
|---|---|---|
| Kinder Kindergarten + Primar SG, 2024/25 (ohne Sonderschulen) | 44'998 (≈ 45'000) | Fachstelle für Statistik SG, „Kopf und Zahl 2025“, S. 10, T1 (Tabelle als Bild abgelesen, Summe gerechnet), https://www.berichte.sg.ch/content/dam/publisg/kuz2025/SG_Kopf-und-Zahl_2025.pdf |
| Primar-Regelklasse SG, Durchschnitt | 18,6 Kinder | gleiche Quelle |
| Klassen KG + Primar SG | ≈ 2'420 (45'000 / 18,6; Kindergartenklassen sind anders gross — grobe Rechnung) | gerechnet |
| Schulträger mit Primarstufe | 80 | https://www.sg.ch/news/sgch_statistik/2025/12/fista_2024.html |
| Kinder je Primarschulträger | ≈ 560 (≈ 30 Klassen) | gerechnet |
| Kinder KG + Primar Schweiz | ≈ 743'000 | https://statistik.admin.ch/de/themen/bildung-wissenschaft/personen-ausbildung (gerechnet) |

## 4. Was gegen Geld angeboten werden kann

### 4.1 Wofür Schulen zahlen (Nutzen → Funktion)

Aus dem Konzept Gruppen (gebaut wird erst später) und den Vergleichsangeboten. Die Spalte *Belegt?* sagt, ob der
Nutzen bei einem Vergleichsangebot bezahlt wird.

| Nutzen für Lehrperson oder Schule | Funktion | Belegt? |
|---|---|---|
| Lernstand der Klasse auf einen Blick | Klassenstatistik je Lernziel (Konzept Gruppen 4) | ANTON „Reports“, Zahlenzorro „Auswertung“ — bei appolino gratis |
| Gezielt differenzieren | gemeinsame und individuelle Schwerpunkte, Spiele zuweisen | ANTON, Zahlenzorro, appolino |
| Zeit sparen bei Beurteilung und Elterngespräch | Bericht je Kind als PDF/Ausdruck (Lernziele Lehrplan 21, Verlauf) | nicht als eigener Preis gefunden (**Annahme**: hoher Nutzen) |
| Förderplanung (IF, SHP) | Förderziele je Kind, Verlauf, Export | Escola Förderplanung 4'480 Fr./Jahr für eine Schulgemeinde |
| Wirkung eigener Schwerpunkte prüfen | Selbstreflexion (Konzept Gruppen 4) | kein Vergleich gefunden |
| Mehrere Klassen, Fächer, Stellvertretung, Übergabe im Sommer | Schulfunktionen: Klassen zwischen Lehrpersonen übergeben, Schulleitung sieht Übersicht ohne Namen | ANTON Schulverwaltung |
| Abgleich ohne Schul-IT | **gehosteter Klassenserver** (Konzept Gruppen 5c, G11 b), Ende-zu-Ende verschlüsselt | LearningView hostet (gratis, in D) |
| Datenschutz abgeklärt | fertiges Datenschutz-Dossier, Vertrag zur Auftragsbearbeitung, Hosting in der Schweiz | Schulen müssen das sonst selbst prüfen (privatim, Abschnitt 2) |
| Verlässlichkeit | zugesicherter Support, Fehlerbehebung in Frist | Lernlupe: Support im Preis |
| Einführung | Teamweiterbildung (Halbtag) | Preis nicht recherchiert |
| Anmeldung mit Schulkonto | edulog | nötig erst bei einem Dienst mit Anmeldung |

### 4.2 Wie sich Bezahltes ohne Anmeldung freischalten lässt

Eulenpfad hat keine Anmeldung und schickt keine Daten an einen Server. Zwei saubere Wege, die das nicht brechen:

1. **Signierte Lizenzdatei:** Patrik stellt der Schule eine kleine Datei aus (Schule, Anzahl Klassen oder Kinder,
   gültig bis), mit seinem privaten Schlüssel signiert. Das Gerät der Lehrperson prüft die Signatur mit dem im Code
   hinterlegten öffentlichen Schlüssel (WebCrypto, im Browser eingebaut) — **offline, ohne Server, ohne Anmeldung**.
   Freigeschaltet werden nur **Funktionen der Lehrperson**; die Kinder spielen in der Klasse dieselben Spiele wie
   privat. Grenze: Wer den Code ändert, umgeht die Prüfung. Für öffentliche Schulen mit Rechnung und Vertrag ist
   das kein praktisches Problem (**Einschätzung**), und es wird nichts über Kinder übermittelt.
2. **Bezahlter Dienst:** Der gehostete Klassenserver, Support und Einführung sind Leistungen, die Patrik erbringt —
   sie lassen sich ohne Prüfung im Programm verrechnen.

Ein Abonnement mit Anmeldung der Lehrperson an einem Server wäre der dritte Weg; er brauchte edulog
(CHF 1'450 einmalig) und machte Patrik zum Auftragsbearbeiter für Konten der Lehrpersonen. Für das Klassenmanagement
nach Konzept Gruppen ist er nicht nötig.

## 5. Preisvorschlag und Durchrechnung

### 5.1 Vorschlag

| Angebot | Inhalt | Preis (Vorschlag) | Bezug zum Markt |
|---|---|---|---|
| **Privat** | alle Spiele, Familie, Abgleich im eigenen Ordner | **gratis**, freiwillige Spenden | — |
| **Pilot** | alles, auch Klassenmanagement | **gratis** im Pilotjahr | — |
| **Probe für Lehrpersonen** | Klassenmanagement für eine Klasse | **gratis bis Ende des Semesters**, in dem sie beginnt | appolino-Cockpit ist dauerhaft gratis — die Probe hält Eulenpfad vergleichbar |
| **Klassenlizenz** (einzelne Lehrperson) | Klassenstatistik, Schwerpunkte, Zuweisen, Berichte je Kind, Selbstreflexion; Abgleich über Ordner, Gruppendatei oder eigenen Klassenserver | **CHF 79 je Klasse und Jahr** (≈ CHF 4.25 je Kind) | Zahlenzorro 49 € je Klasse — Eulenpfad deckt KG bis 6. Kl. und hat Berichte |
| **Schullizenz** (Schulhaus oder Schulträger) | alles der Klassenlizenz für alle Klassen, dazu Übergabe zwischen Lehrpersonen, Übersicht für die Schulleitung (ohne Namen), Datenschutz-Dossier, Support per E-Mail mit Antwort in 2 Schultagen | **CHF 3 je Kind und Jahr, mindestens CHF 250** | appolino 7, Zahlenzorro 19 €, Lernlupe 29.95 je Kind — jeweils mit Inhalten; ANTON 250–700 € je Schule |
| **Zusatz: gehosteter Klassenserver** | Patrik betreibt die Ablage in der Schweiz, Ende-zu-Ende verschlüsselt, Vertrag zur Auftragsbearbeitung | **+ CHF 0.50 je Kind und Jahr, mindestens CHF 100** | Kosten des Servers **nicht recherchiert** — vor dem Festlegen rechnen |
| **Zusatz: Förderplanung** (wenn gebaut) | Förderziele je Kind, Verlauf, Export | **+ CHF 1 je Kind und Jahr** | Escola 4'480 Fr. je Schulgemeinde |
| **Einführung** | Halbtag im Team, vor Ort | **Annahme CHF 400** (Benchmark fehlt) | — |
| **Träger- oder Kantonslizenz** | Schullizenz für alle Schulen eines Trägers oder des Kantons, ein Vertrag | **CHF 2 je Kind und Jahr** | Muster bettermarks (Land zahlt), Mindsteps (Kantone, **nicht bestätigt**) |

**Stimmen die Stufen untereinander?** Bis 3 Klassen ist die Klassenlizenz günstiger (3 × 79 = 237 < 250), ab 4
Klassen die Schullizenz (4 × 18,6 × 3 = 223 → Mindestpreis 250 < 4 × 79 = 316). Ein durchschnittlicher Träger
(≈ 30 Klassen, 560 Kinder) zahlt CHF 1'680 statt 30 × 79 = 2'370 mit Klassenlizenzen.

### 5.2 Einnahmen je Reichweite (CHF je Jahr)

Reichweiten sind **Annahmen**, keine Prognose. Annahme für den Server: die Hälfte der Schulen nimmt ihn.

| Reichweite | Kinder | Schullizenz CHF 3 | + Server (½ der Schulen) | Summe | AHV > 2'500? | MWST > 100'000? |
|---|---|---|---|---|---|---|
| 1 Träger (Durchschnitt) | 560 | 1'680 | 140 | 1'820 | nein | nein |
| 5 % SG | 2'250 | 6'750 | 563 | 7'313 | ja | nein |
| 10 % SG | 4'500 | 13'500 | 1'125 | 14'625 | ja | nein |
| 30 % SG | 13'500 | 40'500 | 3'375 | 43'875 | ja | nein |
| Kantonslizenz SG (CHF 2, alle) | 45'000 | 90'000 | ⅓ der Schulen mit Server 7'500 | 97'500 | ja | **knapp darunter** — mit Einführungen und Zusätzen darüber |
| 10 % Schweiz (CHF 3) | 74'300 | 222'900 | 18'575 | 241'475 | ja | ja |

Zum Vergleich der **Klassenlizenz allein**: 10 % der Klassen in SG (≈ 242) × 79 = CHF 19'118 — mehr als die
Schullizenz bei gleicher Reichweite, weil der Preis je Kind höher ist; Schulen mit vielen Klassen wechseln dann
zur Schullizenz.

### 5.3 Weitere Zielgrössen

| Zielgrösse | Wert / Folge |
|---|---|
| Preis für eine Schule im Verhältnis zur Schulverwaltung | Träger mit 560 Kindern: CHF 1'680 ≈ 5 % dessen, was Wetzikon für LehrerOffice zahlte (31'500) — eine kleine Position im Budget |
| Preis je Kind gegenüber Lernlupe | CHF 3 = 10 % von CHF 29.95 |
| Aufwand Patrik je Schule und Jahr | **Annahme** 2 h (Rechnung, Lizenzdatei, Support) → bei 10 % SG (≈ 8 Träger) ≈ 16 h für CHF 14'625 |
| Pflichten ab der ersten Lizenz | AHV-Anmeldung als Selbständiger, Impressum mit Adresse, Rechnungen, Steuererklärung; mit Server zusätzlich Vertrag zur Auftragsbearbeitung und Datenschutzerklärung |
| Gemeinnützigkeit | für den Schulteil ausgeschlossen (Marktpreis); die privaten Spenden bleiben ohnehin nicht abziehbar, solange sie an Patrik gehen |
| Projektregeln | Kinder bekommen nichts gegen Geld; keine Anmeldung; Daten der Kinder nur verschlüsselt an einen Ort der Klasse (Konzept Gruppen 8) — bleibt alles wahr |
| Hürde für den Einstieg | Probe und Pilot gratis; danach Klassenlizenz CHF 79 — ob eine Lehrperson das aus ihrem Klassenbudget zahlen kann, ist je Gemeinde geregelt (**nicht bestätigt**) |
| Spielraum nach oben | Bei CHF 5 je Kind (Schullizenz mit Förderplanung und Server) läge ein Träger bei CHF 2'800 — immer noch unter appolino; vertretbar, sobald Berichte und Förderplanung gebaut und erprobt sind |

## 6. Offene Fragen vor dem Festlegen

1. **Kosten des gehosteten Servers** (Miete in der Schweiz, Betrieb, Sicherung) — nicht recherchiert; der Zusatzpreis
   CHF 0.50 ist darauf zu prüfen.
2. **Preise für Teamweiterbildung** (PH, freie Anbieter) — nicht recherchiert.
3. **Steueramt SG:** Einzelfirma im Nebenerwerb für den Schulteil, private Spenden daneben — wie getrennt zu
   deklarieren?
4. **SVA St. Gallen:** Anmeldung vor der ersten Rechnung.
5. **Lizenz des Codes:** Wenn der Code offen ist, kann man die Prüfung entfernen; für öffentliche Schulen
   unerheblich (**Einschätzung**). Festlegen, bevor die Lizenzdatei gebaut wird.
6. **Pilot fragen:** Welche Funktion würden die Pilotlehrpersonen bezahlen? (Rückmeldebogen um eine Frage
   ergänzen.)

## 7. Nicht weiterverfolgt

- **Pflichtlizenz für alle Schulen schon heute** (ohne Klassenmanagement): würde Spiele gegen Geld verkaufen, die
  privat gratis sind, und liesse sich ohne Anmeldung nicht prüfen.
- **Verkauf an einen Verlag:** keine öffentlichen Bedingungen gefunden; der Lehrmittelverlag SG hat mit Lernlupe
  und appolino eigene Produkte; Preis, Anmeldung und Daten lägen dann nicht mehr bei Patrik.
- **Förderbeiträge** (Hasler Stiftung, bis CHF 10'000): bleiben möglich, wiegen aber neben einer Schullizenz zu
  Marktpreisen weniger, weil Erlöse erwartet werden (**Einschätzung**).

## 8. Antworten in Kürze

- **CHF 1 je Kind?** Zu wenig für das Klassenmanagement; realistisch sind **CHF 3 je Kind** für eine Schullizenz
  (mindestens CHF 250) oder **CHF 79 je Klasse** für eine einzelne Lehrperson — beides deutlich unter appolino und
  Lernlupe, die allerdings Inhalte verkaufen.
- **Mehr?** Ja, wenn es mehr Nutzen bringt: Server **+ CHF 0.50**, Förderplanung **+ CHF 1**; bis gegen CHF 5 je
  Kind bleibt der Preis unter den Schweizer Verlagsangeboten.
- **Anders?** Eine **Träger- oder Kantonslizenz** (CHF 2 je Kind) ist ein Vertrag statt vieler Rechnungen und
  hebt jede Hürde für Lehrpersonen — realistisch erst nach Pilot und Erfahrung an mehreren Schulen.
- **Freiwillig?** Ja für privat (Spenden) und für den Pilot; nicht für das Klassenmanagement.

## 9. Reichweite

- Vier Recherche-Agenten: Preise der Lernangebote (18 Suchen, 13 Seiten, 3 PDFs), Rahmen (≈ 20 Suchen, ≈ 25
  Seiten/PDFs), Schülerzahlen (3 Quellen), Schulverwaltung, edulog und Hosting (≈ 17 Suchen, ≈ 25 Seiten/PDFs).
- **Nicht erreichbar:** dybuster.com, calcularis.ch, lehrmittelshop.so.ch, Fedlex, klapp.ch, mehrere Preisseiten
  (404: anton.app/de/schule und /plus, learningview.org/preise, cmi.ch/preise, pupil.ch/preise, Classtime).
- **Nicht gelesen:** Vereinbarung SGV–LMVSG (Scan), ilz-ISDS-Fragebogen (nicht gefunden), educa-Dossier
  „Datenschutzkonforme Schule“ (diesmal nicht abgerufen), Verlagsbedingungen, Spendenpraxis Steueramt SG,
  Mietpreise für Server, Preise für Weiterbildung.
- Die Wiesbadener Preisliste ist undatiert und gilt für deutsche Schulen; Kahoot zeigte Aktionspreise.
- Kein Treffer ist kein Beweis.

---

## 10. Offene Entscheide (für Patrik)

Stand 2026-11-04, **offen**. Beide hängen zusammen: E-2 legt fest, *wofür* bezahlt wird, E-3 *wie viel*. Eine
frühere Frage E-1 (Einnahmen schon heute für alle Schulen) ist durch die Vorgabe „privat und Pilot gratis, Schulen
zahlen fürs Klassenmanagement“ erledigt.

### E-2 — Wie wird das Bezahlte freigeschaltet?

**Ort:** dieses Dokument, Abschnitt 4.2; Grundsatz für privat in
[anleitung_freiwillige_beitraege.md](anleitung_freiwillige_beitraege.md), Abschnitt 1.

**Heutiger Wortlaut:** Abschnitt 4.2 nennt zwei Wege ohne Festlegung, „Signierte Lizenzdatei“ und „Bezahlter
Dienst“. Für privat gilt: „Nichts wird gegen Geld freigeschaltet; alle Spiele bleiben für alle gleich.“

**Problem:** Eulenpfad hat keine Anmeldung und keinen Server. Damit Schulen für das Klassenmanagement zahlen, muss
feststehen, woran das Programm erkennt, dass bezahlt ist — oder dass es gar nichts sperrt und nur Dienste
verrechnet werden.

**Optionen:**

- **a (Empfehlung):** „Die Funktionen der Lehrperson (Klassenmanagement, Berichte, Förderplanung) werden mit einer
  signierten Lizenzdatei freigeschaltet, die das Gerät offline prüft — ohne Server, ohne Anmeldung. Kinder bekommen
  nie etwas gegen Geld. Gehosteter Klassenserver, Support und Einführung werden zusätzlich als Dienst verrechnet.“
- **b:** „Das Klassenmanagement ist im Programm für alle frei. Bezahlt werden nur Dienste: gehosteter
  Klassenserver, Support mit Frist, Datenschutz-Dossier mit Vertrag, Einführung.“
- **c:** „Lehrpersonen melden sich an einem Server von Eulenpfad an (über edulog, einmalig CHF 1'450); dort wird
  die Lizenz geprüft.“

**Warum die Empfehlung:** Den Ausschlag gibt, dass a genau das bezahlt, was den Nutzen bringt (Abschnitt 4.1), ohne
ein Grundprinzip zu brechen: Die Prüfung ist lokal, es entsteht kein Konto, kein Kind wird erfasst, die Spiele
bleiben für alle gleich. Für b spricht, dass das Programm ganz ohne Sperre bleibt und der Grundsatz „nichts gegen
Geld“ auch für Lehrpersonen gälte. Aber bei b zahlen nur Schulen, die Server oder Support wollen; eine Lehrperson
mit eigener Klasse, die über den Ordner abgleicht, bekommt den ganzen Nutzen gratis — dem Schulteil fehlt die
Grundlage, und Eulenpfad steht dann gleich da wie das Gratis-Cockpit von appolino, das sich über Inhalte finanziert.
c prüft am sichersten, bringt aber Anmeldung und Konten auf einen Server — gegen die heutige Architektur
(Konzept Gruppen: Daten nur verschlüsselt an einen Ort der Klasse) — und macht Patrik zum Auftragsbearbeiter mit
Vertragspflichten nach privatim. Die Grenze von a: Wer den Code ändert, umgeht die Prüfung; bei öffentlichen
Schulen mit Rechnung und Vertrag ist das praktisch kein Problem (Einschätzung).

**Woran die Empfehlung kippt:** zu **b**, wenn der Pilot zeigt, dass Schulen vor allem für Server und Support
zahlen würden und die Funktionen allein keinen Preis tragen; zu **c**, wenn das Klassenmanagement ohnehin einen
zentralen Dienst bekommt (etwa Konten der Lehrpersonen über mehrere Geräte).

### E-3 — Preisstufen für Schulen

**Ort:** dieses Dokument, Abschnitt 5.1.

**Heutiger Wortlaut:** Vorschlag, nicht festgelegt: „Klassenlizenz CHF 79 je Klasse und Jahr“, „Schullizenz CHF 3
je Kind und Jahr, mindestens CHF 250“, Zusätze Server „+ CHF 0.50“ und Förderplanung „+ CHF 1“ je Kind,
„Träger- oder Kantonslizenz CHF 2 je Kind und Jahr“.

**Problem:** Die Preise sollen für den Nutzen gern gezahlt werden. Zu tief, und sie tragen die Pflichten nicht, die
mit der ersten Rechnung kommen (AHV, Impressum, Support, bei Server ein Vertrag). Zu hoch, und sie wirken neben
appolino (CHF 7 je Kind mit Inhalten, Cockpit gratis) unglaubwürdig.

**Optionen:**

- **a (Empfehlung):** „Klassenlizenz CHF 79 je Klasse und Jahr; Schullizenz CHF 3 je Kind und Jahr, mindestens
  CHF 250; Zusätze Server + CHF 0.50 und Förderplanung + CHF 1 je Kind; Träger- oder Kantonslizenz CHF 2 je Kind.
  Die Preise werden nach dem Pilot mit den Rückmeldungen und den gerechneten Serverkosten bestätigt.“
- **b:** „Nur eine Schullizenz: CHF 5 je Kind und Jahr, alles inbegriffen (Server, Förderplanung, Support),
  mindestens CHF 300.“
- **c:** „Nur eine Pauschale je Schulhaus: CHF 400 bis 150 Kinder, CHF 900 bis 400 Kinder, CHF 1'500 darüber.“

**Durchgerechnet** (Abschnitt 5; Durchschnittsträger 560 Kinder ≈ 30 Klassen; Schulhaus mit 150 bzw. 151 Kindern):

| Zielgrösse | a | b | c |
|---|---|---|---|
| Durchschnittsträger je Jahr | CHF 1'680 (mit Server + Förderplanung 2'520) | CHF 2'800 | je nach Schulhäusern, z. B. 2 × 900 = 1'800 |
| Einzelne Lehrperson, eine Klasse | CHF 79 | nicht möglich (Mindestpreis 300) | nicht möglich |
| Schulhaus 150 → 151 Kinder | 450 → 453 | 750 → 755 | 400 → 900 (Sprung) |
| Einnahmen bei 10 % SG (4'500 Kinder) | 13'500 (+ Zusätze) | 22'500 | ≈ 14'400 bei 16 Schulhäusern à 900 (Annahme) |
| AHV > 2'500 | ab ≈ 2 Trägern | ab 1 Träger | ab ≈ 3 Schulhäusern |
| MWST > 100'000 | ab ≈ 33'000 Kindern (74 % SG), ohne Zusätze | ab ≈ 20'000 Kindern (44 % SG) | ab ≈ 111 Schulhäusern à 900 (Zahl der Schulhäuser in SG nicht recherchiert) |
| Abstand zu appolino (CHF 7 mit Inhalten) | 43 % | 71 % | — |

**Warum die Empfehlung:** Den Ausschlag gibt, dass bei a jede Stufe für ihre Grösse die günstigste ist (bis 3
Klassen die Klassenlizenz, ab 4 die Schullizenz, Abschnitt 5.1) — eine einzelne Lehrperson kann beginnen, ohne dass
die Schule entscheiden muss, und die Schule übernimmt, wenn mehrere Klassen dabei sind. Bezahlt wird je Zusatz nur,
wer ihn nutzt. Ein Durchschnittsträger läge bei rund 5 % dessen, was eine Schulgemeinde für LehrerOffice ausgab.
Für b spricht ein einziger, einfacher Preis und höhere Einnahmen (22'500 statt 13'500 bei 10 % SG); es verlangt aber
auch von Schulen ohne Bedarf an Server und Förderplanung CHF 2 mehr je Kind, und einzelne Lehrpersonen kommen nicht
hinein. Für c sprechen planbare Beträge für das Budget; die Sprünge an den Grenzen (150 → 151 Kinder: CHF 400 →
900) sind aber nicht zu begründen.

**Woran die Empfehlung kippt:** zu **b**, wenn der Pilot zeigt, dass praktisch alle Schulen Server und
Förderplanung wollen; die Preise von **a** gehen nach oben, wenn die noch nicht gerechneten Serverkosten über
CHF 0.50 je Kind liegen oder wenn Berichte und Förderplanung im Pilot als Hauptnutzen bestätigt werden (Spielraum
bis gegen CHF 5 je Kind, Abschnitt 5.3).
