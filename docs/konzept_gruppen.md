# Konzept: Gruppen — Familie, Klasse, Lerngruppe

Stand: 03.11.2026 (LERN_Session11) · **Entschieden (G1–G10, Abschnitt 9), nicht gebaut** (Entscheid K1 a: erst
Konzept, dann bauen).
Gilt für die ganze Reihe (Eulenpfad → Lernsteig → Gratwanderung): dasselbe Prinzip in allen Apps.
Ersetzt nicht, sondern umfasst [konzept_klasseneinstellungen.md](eulenpfad/konzept_klasseneinstellungen.md)
(LERN-34, Fragen F1–F8): Die Klasseneinstellungen werden zu den Einstellungen einer Gruppe der Art Klasse.

## 1. Auslöser (Wunsch Patrik, LERN_Session11)

- Die Aufsicht soll sich als **Lehrperson** ausweisen können und dann ein **Klassenmanagement** bekommen:
  mehrere Klassen, Kinder zuweisen, **gemeinsame und individuelle Schwerpunkte und Lernziele** setzen,
  daraus eine **Klassenstatistik**, auch zur **Selbstreflexion** der Lehrperson.
- **Erfolge je Klasse**, die nur gemeinsam erreichbar sind.
- Zu Hause sind die Kinder in der Gruppe **Familie** (Aufsicht = Eltern).
- Später vielleicht **Lerngruppen**, die Kinder selbst bilden, mit eigenen Erfolgen — vielleicht erst ab Lernsteig.
- Das Prinzip bleibt in allen Fällen gleich. Daraus folgt: **jede Gruppe hat ihren eigenen Abgleich-Ort**
  (Cloud mit Verschlüsselungsschlüssel?) **und je Gruppe eine eigene Geräte-Kennung**.

## 2. Heute

- Rollen Kind und Aufsicht (rahmen.md Abschnitt 6), alles je Gerät im Browser (LERN-5 b).
- Abgleich (rahmen.md Abschnitt 10, S1 a): **ein** Ordner je Haushalt, je Gerät eine Datei
  `lernspiele-sync-<id>.json`, **unverschlüsselt**, mit allen Kindern, Runden, Rekorden, Profilen, Freigaben,
  Meldungen. Das ist heute schon die Gruppe Familie, nur ohne Namen.
- Fokus-Lernziele je Kind im Profil; Lernplan je Kind (rahmen.md 15); Einstellungen je Gerät.
- Gespeichert wird in `localStorage`. Die Grenze hängt vom Browser ab (Abschnitt 5a); gemessen ist sie erst im
  eingebauten Browser der Entwicklungsumgebung.

## 3. Was eine Gruppe ist

Eine Struktur für alle drei Arten:

```
Gruppe = {
  id,                 // zufällig, 128 Bit
  art,                // "familie" | "klasse" | "lerngruppe"
  name,               // frei, ohne Personen: „Familie“, „4b Mathe“, „Lerngruppe Brüche“
  leitung: [mitgliedId],          // Aufsicht, Lehrperson; bei Lerngruppen ein Kind (G6)
  mitglieder: [{ id, anzeige, rolle, fokus?, lernplan? }],   // anzeige = Vorname oder Kürzel, in der Gruppe vergeben
  ziele: { fokus: [{ code, von, bis }], lernplan?, spiele? },  // gemeinsam (für alle Mitglieder)
  einstellungen,      // Schreibweisen, Timer, Freigabe … (Klasseneinstellungen F1–F8)
  erfolge,            // welche Gruppen-Abzeichen gelten (Abschnitt 7)
  ort,                // Abgleich-Ort dieser Gruppe (Abschnitt 5)
  stand, geaendert
}
```

- Ein Kind kann in **mehreren Gruppen** sein (Familie, Klasse Mathe, Klasse Französisch — beantwortet F2 aus
  dem Konzept Klasseneinstellungen: je Fach eine Gruppe).
- Ein Gerät kennt jedes Mitglied **lokal** (sein Konto) und verknüpft es mit der Mitglieds-Id der Gruppe. Der
  Name im Konto darf anders sein als die Anzeige in der Gruppe (Spitzname zu Hause, Vorname in der Klasse).
- **Schwerpunkte:** gemeinsame `ziele.fokus` der Gruppe plus individuelle `mitglieder[].fokus`. Das Kind sieht
  beide („⭐ von deiner Lehrperson“, „⭐ für dich“); individuell **ergänzt**, ersetzt nicht. Der Fokus im Profil
  (heute) bleibt als eigener Fokus des Kindes bzw. der Familie.
- **Vorrang der Einstellungen** wie im Konzept Klasseneinstellungen Abschnitt 6: Kind → Gruppe (vorgeschlagen
  oder festgelegt) → Gerät → Standard; bei mehreren Gruppen gilt für eine Einstellung die Gruppe, die das Fach
  des Spiels trägt, sonst die Familie.

## 4. Rolle Lehrperson

- Eine Aufsicht setzt bei sich das Merkmal **„Ich bin Lehrperson“** (G2). Danach gibt es in der Verwaltung den
  Untertab **🏫 Klassen**: Klassen anlegen, Mitglieder eintragen (nur Vorname oder Kürzel), Ziele und
  Einstellungen setzen, Beitrittscodes ausgeben, Klassenstatistik.
- **Beitritt:** Je Kind erzeugt die Lehrperson einen **Beitrittscode** (Gruppen-Id, Mitglieds-Id, Schlüssel;
  als Text und QR). Die **Aufsicht der Familie** gibt ihn auf ihrem Gerät ein und wählt, welches Kind gemeint
  ist. Erst damit fliessen Daten (G3) — der Beitritt ist die Einwilligung der Familie, je Kind.
- **Ab wann** (G3 a mit Zusatz Patrik): Beim Beitritt wählt die Aufsicht der Familie das Startdatum — Vorgabe der
  Beitrittstag, auch früher möglich („rückwirkend ab …“, bis „alles“), damit die Lehrperson den Stand vor dem Beitritt
  sieht. Später zurücksetzen lässt es sich nur nach vorn (was geteilt ist, ist geteilt).
- **Austreten** (G3b a) kann die Familie jederzeit. Auf ihrem Gerät bleibt alles, wie es ist; es wird nur nichts mehr
  geteilt. Der Dialog fragt „Bisher Geteiltes bei der Klasse auch löschen?“ (vorgewählt: Ja). Bei Ja legt das Gerät
  einen Löschvermerk für dieses Mitglied an den Ort der Klasse (wie `lernspiele:geloescht` heute), und die Geräte der
  Klasse entfernen seine Runden beim nächsten Abgleich; bei Nein bleiben sie unter der Anzeige in der Klassenstatistik.
  Grenze, im Dialog genannt: Eine Kopie, die die Lehrperson als Datei gesichert hat, erreicht der Vermerk nicht.
- **Klassenstatistik:** dieselben Auswertungen wie heute (`auswertung.js`), über alle Mitglieder: je Lernziel
  Anteil auf Anhieb richtig, Verlauf, wer welche Stufe erreicht, Lernplan erfüllt, Meldungen.
- **Selbstreflexion** (regelbasiert wie das Fazit, ohne KI, jede Aussage mit Zahlen): Wirkung eines gesetzten
  Fokus („seit dem 3.11. Fokus Runden: auf Anhieb richtig 64 % → 78 % in 14 Tagen, 18 von 22 Kindern geübt“);
  Lernziele, die die Klasse kaum übt; Spannweite in der Klasse je Lernziel (wer braucht Hilfe, wer mehr Futter);
  Übungszeiten (Wochentag, Tageszeit) — Zusammenhänge mit „noch keine Ursache“.
- **Speicher:** Eine Klasse mit 24 Kindern und 5 Runden je Woche bringt in 38 Schulwochen
  24 × 5 × 38 = 4560 Runden; bei gemessenen **rund 810 Zeichen je Runde** (Eintrag mit 8 Aufgabenzeiten und
  einer Fehleraufgabe, LERN_Session11) sind das 3,7 Mio. Zeichen je Klasse und Jahr. Ob das in `localStorage`
  passt, hängt vom Browser ab (Abschnitt 5a): Bei einer Grenze von 5 MB, wie sie für verbreitete Browser
  angegeben wird, wären es drei Viertel für **eine** Klasse; im gemessenen Browser sind es 7 %. Gruppendaten
  kommen deshalb in IndexedDB (Abschnitt 5a) — nicht weil `localStorage` sicher zu klein ist, sondern weil es
  auf den Geräten der Kinder (iPad) nicht gemessen ist und ein voller Speicher Runden still verlöre.

## 5. Abgleich-Ort je Gruppe

- Jede Gruppe hat einen eigenen Ort; das Gerät schreibt dorthin **nur die Daten der Mitglieder dieser Gruppe**
  (Familie: alles wie heute; Klasse: Runden, Rekorde und Meldungen der verknüpften Kinder, ihre Anzeige, keine
  anderen Kinder, keine Freigabe des Hauses).
- **Verschlüsselt** (G4): AES-GCM mit 256-Bit-Schlüssel der Gruppe (WebCrypto, im Browser eingebaut, keine
  Abhängigkeit). Der Schlüssel reist nur im Beitrittscode, nie an den Ort. Wer den Ordner sieht (Cloud-Dienst,
  Schul-IT), sieht nur Gerätedateien mit Zufallsnamen.
- **Umstellung bestehender Orte** (G4 a mit Zusatz Patrik): Die neue Fassung liest unverschlüsselte Dateien
  weiterhin ein (abwärtskompatibel). Beim ersten Abgleich schreibt jedes Gerät seine eigene Datei verschlüsselt und
  löscht seine unverschlüsselte gleich danach. Fremde unverschlüsselte Dateien (ein Gerät, das noch die alte Fassung
  hat) liest es weiter und zeigt in der Verwaltung „Gerät … noch unverschlüsselt“; löschen tut sie das Gerät selbst
  beim eigenen Update, oder die Aufsicht von Hand (für ein Gerät, das es nicht mehr gibt). Ein Gerät löscht nie
  von sich aus die Datei eines anderen — es könnte sie gleich danach neu schreiben.
- **Geräte-Kennung je Gruppe** (G5 a): Für jede Gruppe zieht das Gerät eine eigene zufällige Kennung (128 Bit aus
  `crypto.getRandomValues`); der Dateiname am Ort ist `lernspiele-<gruppe>-<geraet>.json`. Zusatz Patrik: Vor dem
  ersten Schreiben prüft das Gerät, dass es die Kennung am Ort noch nicht gibt, sonst zieht es neu. Zufall statt Hash:
  Ein Hash aus Geräte- und Gruppen-Kennung wäre aus beiden nachrechenbar und verbände die Gruppen wieder; die
  Wahrscheinlichkeit, dass zwei Zufallskennungen gleich sind, liegt bei 30 Geräten unter 10⁻³⁵ — die Prüfung fängt nur
  Fehler im Zufallsgenerator. Zwei Gruppen können so nicht erkennen, dass dasselbe Gerät in beiden ist, und ein
  Austritt hinterlässt nur eine verwaiste Datei.
- **QR-Code** (Frage zu G7): für den **Beitrittscode** ja (Gruppe, Mitglied, Schlüssel; etwa 100 Zeichen, passt in
  einen kleinen QR-Code; die Kamera des Tablets liest ihn), samt **Adresse des Klassenservers**, falls die Klasse
  einen hat — ein Scan richtet dann Gruppe und Ort ein. Für einen **Ordnerpfad** nur als Text zum Lesen: Ein Browser
  öffnet einen Ordner nie über einen Pfad, sondern nur, wenn jemand ihn im Dialog selbst wählt (Schutzregel von File
  System Access); der QR kann zeigen, welchen Ordner man wählen soll, ihn aber nicht wählen. Für die **Daten** nein: Eine Woche einer Klasse sind rund
  100 000 Zeichen, ein QR-Code fasst höchstens rund 3 000. Den QR-Erzeuger baut das Projekt selbst (keine
  Abhängigkeit); lesen tut ihn die Kamera-App des Geräts, die den Link öffnet.
- **Transport** (G7): Ordner (File System Access, heute Chrome und Edge am Computer), sonst eine verschlüsselte
  **Gruppendatei** über den Teilen-Dialog des Geräts (E-Mail, Schulplattform, AirDrop — der Kanal ist egal, weil
  der Inhalt verschlüsselt ist; Intranet wie Internet). Die Lehrperson liest mehrere Dateien auf einmal ein.
- Zusammenführen wie heute (`LS.zusammenfuehren`), je Gruppe.
- Dritter Weg, wenn eine Lehrperson oder Aufsicht ihn einrichtet: ein **Klassenserver im Intranet** (G9, G10).

## 5a. Speicher im Browser

*Stand 2026-11-09 (LERN_Session26):* Speicherschicht vorgezogen (Plan D11) — Kern 1.34.0 (`KERN.speicher` mit grossen
Schlüsseln), Lernsteig und Eulenpfad gebaut (docs/lernsteig/rahmen.md 6, docs/eulenpfad/rahmen.md 23); offen ist das
Prüfen auf echten Geräten (Abschnitt 10, Schritt 2). Grenzen nach MDN in docs/kern/rahmen.md 4.3.

**Gemessen** am 03.11.2026 (LERN_Session11) im eingebauten Browser der Entwicklungsumgebung (Chromium 152):

| Speicher | Grenze | dauerhaft? |
|---|---|---|
| `localStorage` | rund 52 Mio. Zeichen, dann Fehler beim Schreiben | `navigator.storage.persisted()` = false |
| IndexedDB | Kontingent laut `navigator.storage.estimate()` 5,7 GB | ebenso |

**Nicht gemessen**, aus allgemeinem Wissen und vor dem Bau auf echten Geräten zu prüfen: Verbreitete Browser
begrenzen `localStorage` auf etwa 5 MB je Herkunft; „nicht dauerhaft“ heisst, der Browser darf die Daten bei
Speichermangel löschen; Safari soll Speicher von Websites löschen, die sieben Tage lang nicht geöffnet wurden,
ausser die Seite liegt auf dem Home-Bildschirm. Gerade die letzte Angabe betrifft iPads in Schulen.

**Grundprinzip unverändert:** IndexedDB ist kein Server, sondern ein zweiter Speicher im selben Browser, an
dieselbe Herkunft gebunden, offline, ohne Anmeldung und ohne Abhängigkeit. „Daten über das Kind nur lokal im
Browser“ (LERN-5 b) bleibt wörtlich wahr; es ändert sich nur, wo im Browser die Daten liegen.

**Aufbau:**
- **Schicht Arbeitsspeicher:** Beim Laden einer Seite liest der Rahmen Runden, Rekorde und Gruppendaten aus
  IndexedDB in den Arbeitsspeicher; `LS.protokoll()`, `LS.rekorde()` und die übrigen Lesefunktionen antworten
  weiter sofort, Spiele ändern sich nicht. Schreiben geht in den Arbeitsspeicher und gleich danach im Hintergrund
  nach IndexedDB. Die Seite zeichnet erst, wenn das Lesen fertig ist (heute schon so bei den Stimmen).
- **Was wohin:** gross und wachsend in IndexedDB (Runden, Rekorde, Meldungen, Gruppen, Löschvermerke); klein und
  sofort nötig in `localStorage` (angemeldete Person, PIN-Prüfwert, Filter, Gerät).
- **Umzug** beim ersten Start einmal aus `localStorage`, danach dort gelöscht; Sichern, Einlesen und Abgleich
  arbeiten unverändert über `LS.zusammenfuehren`.
- **Wachen:** In der Verwaltung eine Anzeige „Speicher: belegt / verfügbar“ (`navigator.storage.estimate()`),
  Warnung ab 80 %. Die Aufsicht und die Lehrperson bitten mit `navigator.storage.persist()` darum, dass der Browser
  nicht von selbst löscht. Scheitert ein Schreiben, sagt die Seite es sichtbar — heute ginge eine Runde still
  verloren.
- **Der Schutz bleibt der Abgleich:** Jede Gruppe mit Ort ist eine zweite Kopie. Ohne Ort erinnert die Seite die
  Aufsicht ans Sichern (etwa nach 14 Tagen ohne Sicherung).

## 5b. Was ein Gerät abgleicht

Abgeleitete Werte (Abzeichen, Wochensterne, Serie, Fazit, Bedarf) werden **nie** abgeglichen — jedes Gerät rechnet
sie aus den Runden selbst.

| Daten | Familie | Kind → Klasse | Klasse → Kind |
|---|---|---|---|
| Runden (rund 810 Zeichen je Runde) | ja | ja, ab dem Beitritt (G3) | — |
| Endlos-Rekorde | ja | ja | — |
| Meldungen | ja | ja | Status und Antwort |
| Profil: Klasse, Fokus, Lernplan | ja | nein (die Klasse kennt nur die Anzeige) | gemeinsame und eigene Ziele der Klasse |
| Profil: Timer, Reihenfolge, Vorlesen, Favoriten, Ansicht, gesehene Abzeichen, Fazit-Freigabe | ja | nein | Vorschläge der Klasse (Vorrang Abschnitt 3) |
| Freigabe | ja | nein | Freigabe der Klasse, falls gesetzt |
| Löschvermerke | ja | ja (eigene Runden) | — |
| Gruppe: Mitglieder, Ziele, Einstellungen | — | — | ja, nur von der Leitung |
| Nie | PIN, Gerätename, Ordnerzugriff, Entwickler-Schlüssel, Filter | ebenso, dazu keine anderen Kinder des Geräts | — |

## 5c. Klassenserver im Intranet

Eine Lehrperson oder Aufsicht kann die App auf einem eigenen Rechner im Schul- oder Heimnetz ausliefern
(`tools/server.py` tut das heute schon) und ihr eine kleine Ablage für Gruppendateien geben: Jedes Gerät legt
seine verschlüsselte Datei ab und holt die der anderen — wie der Ordner, aber auch auf iPads und ohne Teilen-Dialog.

Folgen, die vor einem Entscheid gerechnet sein müssen (alle **nicht gemessen**):
1. **Sicherer Kontext:** WebCrypto gibt es nur unter https und `localhost`. Unter `http://lehrer-pc:8765` fehlt sie,
   die Verschlüsselung (G4) ginge nicht. Nötig ist dann https mit einem Zertifikat, dem die Geräte vertrauen
   (auf iPads einmal installieren) — G10.
2. **Eigene Herkunft, eigener Speicher:** Die App vom Klassenserver und die App von GitHub Pages haben getrennte
   Speicher. Spielt ein Kind zu Hause online und in der Schule im Intranet, kommen die Runden nur über den
   Abgleich der Gruppe zusammen — der Klassenserver ist dann ein Ort der Klasse, und die Familie braucht ihren
   eigenen oder dieselbe Klasse auch zu Hause.
3. **Gemischte Inhalte:** Eine https-Seite (GitHub Pages) darf keinen `http://`-Server im Intranet ansprechen. Die
   Kinder öffnen die App deshalb direkt vom Klassenserver, oder der Klassenserver hat https.
4. **Datenschutz:** Ein Server, den die Aufsicht selbst betreibt, passt zum Sinn von S1 a („ein Ort, den die
   Aufsicht wählt“), ist aber eine neue Art Ort: Er sieht, wann welches Gerät abgleicht. Inhalte bleiben
   verschlüsselt (G4), der Server hat den Schlüssel nicht.

**Im Internet statt im Intranet** (Frage Patrik zu G7/G9): technisch derselbe Server mit öffentlicher Adresse und
einem Zertifikat einer öffentlichen Stelle (z. B. Let's Encrypt, braucht einen Domainnamen). Vorteile: Die App von
GitHub Pages darf ihn ansprechen (https zu https, mit CORS-Freigabe des Servers) — Punkte 2 und 3 entfallen, Kinder
gleichen zu Hause und in der Schule mit demselben Ort ab; auf den Geräten ist kein Zertifikat zu installieren.
Kosten: Der Rechner ist aus dem Internet erreichbar (Betrieb, Updates, Schutz vor Missbrauch der Ablage), und wer
ihn betreibt, sieht Zugriffszeiten und Adressen. Der Inhalt bleibt Ende-zu-Ende verschlüsselt, also gilt das
Grundprinzip weiter. Gebaut wird der Server so, dass er beides kann; ob und wo er im Internet läuft, entscheidet die
Aufsicht. **G11 (Patrik, 03.11.2026):** angeboten werden a (Gerät der Aufsicht, das immer läuft, mit DynDNS,
Portfreigabe und Let's Encrypt) und b (gemieteter Server); c (Tunnel-Dienst eines Dritten) wird der Vollständigkeit
halber beschrieben, mit Abraten. Die Lehrperson wählt nach der Vergleichsmatrix in
[anleitung_klassenserver_internet.md](anleitung_klassenserver_internet.md).

**Notiz Patrik (LERN_Session27, 2026-11-10), für später:** Ein Abgleich-Server für die Spieldaten der Kinder teilte die
Entscheide des Meldungsservers (Plan C12: NS1 a nur https, NS2 a Unterschrift einer Zufallszahl mit ECDSA P-256 und
Prüfung mit WebCrypto, NS2-K a mit `openssl`, NS3 a Versionen und Protokollnummer). Einstellen dürfte ihn nur eine
Aufsicht je Kind oder je Klasse. Der Schlüssel, mit dem sich der Server ausweist, wäre ein **zweiter Schlüssel**, den
die Aufsicht bestimmt, die den Abgleich-Server betreibt — nicht der Schlüssel der Entwicklung. Dazu käme wie bisher
die Ende-zu-Ende-Verschlüsselung des Inhalts (G4). Noch nicht entschieden und nicht gebaut; braucht einen eigenen
Entscheid mit Datenschutz-Ausnahme (CLAUDE.md).

## 6. Lerngruppen von Kindern

- Gleiche Struktur, Art `lerngruppe`; die Leitung ist ein Kind. Ein Kind lädt andere über einen Code ein.
- Im Eulenpfad (6–12 Jahre) braucht jeder Beitritt die Aufsicht des Kindes; ob es Lerngruppen dort überhaupt
  gibt, entscheidet G6.

## 7. Erfolge je Gruppe

- Aus denselben Daten wie die Abzeichen (rahmen.md 15), über alle Mitglieder gerechnet, **nur gemeinsam**
  (G8): „Wir haben 200 Runden geschafft“, „Alle haben diese Woche ihren Wochenstern“, „Jedes Lernziel der
  Klasse hat jemand gemeistert“, „Unsere Fehlerfinder: 5 behobene Meldungen“. Keine Rangliste der Kinder einer
  Klasse; keine Klasse gegen Klasse.
- Sichtbar im Tab Erfolge unter „🏫 Unsere Klasse“ / „🏠 Unsere Familie“; die Anzeige anderer Kinder nur als
  Zahl, nicht als Liste mit Namen (das Kind sieht „18 von 22 haben ihren Wochenstern“).

## 8. Datenschutz

Neu verlassen Daten das Gerät **in einen Ort, den die Leitung einer Gruppe gewählt hat**, verschlüsselt, nur für
verknüpfte Kinder und nur nach dem Beitritt durch ihre Aufsicht. Vorschlag für CLAUDE.md (nach G3, G4):

> Ausnahme Gruppen (Entscheide G1–G10, 2026-11-03, Konzept `docs/konzept_gruppen.md`): Ist ein Kind durch seine
> Aufsicht einer Gruppe (Familie, Klasse) beigetreten, gehen seine Runden, Rekorde, Meldungen und seine Anzeige in
> dieser Gruppe ab dem Datum, das die Aufsicht beim Beitritt wählt, verschlüsselt an den Abgleich-Ort der Gruppe
> (Ordner, Gruppendatei oder Klassenserver); den Schlüssel haben nur die Geräte der Gruppe. Austreten beendet das.
> Keine Daten anderer Kinder des Geräts.

Eingetragen wird der Text in CLAUDE.md mit dem Bau (Abschnitt 10, Schritt 10), nicht vorher — er beschreibt, was
die App dann tut.

## 9. Entscheidungen

**Entschieden** von Patrik am 03.11.2026 (LERN_Session11): alle nach Empfehlung, mit Zusätzen.

| Nr. | Entscheid | Zusatz Patrik |
|---|---|---|
| G1 | a — ein Modell `Gruppe` mit Art | — |
| G2 | a — „Ich bin Lehrperson“ selbst gesetzt | — |
| G3 | a — Runden, Rekorde, Meldungen nach dem Beitritt | auch rückwirkend datierbar (Abschnitt 4) |
| G4 | a — immer verschlüsseln | abwärtskompatibel einlesen, unverschlüsselte Datei gleich durch verschlüsselte ersetzen (Abschnitt 5) |
| G5 | a — Kennung je Gruppe | vor dem ersten Schreiben auf Eindeutigkeit am Ort prüfen (Abschnitt 5) |
| G6 | a — keine Lerngruppen von Kindern im Eulenpfad | — |
| G7 | a — Gruppendatei über den Teilen-Dialog | QR für den Beitrittscode; Intranet wie Internet (Abschnitt 5) |
| G8 | a — Gruppen-Erfolge nur gemeinsam | Challenges unter Kindern mit Zustimmung der Lehrperson (unten) |
| G9 | a — Klassenserver als zusätzlicher Ort | auch im Internet möglich, Betrieb dort als G11 vorzulegen (Abschnitt 5c) |
| G10 | a — Zertifikat der Schul-IT, sonst selbst erstellt | eigene Anleitung: [anleitung_zertifikat_klassenserver.md](anleitung_zertifikat_klassenserver.md) |
| G3b | a — beim Austritt fragen, Geteiltes bei der Klasse löschen (vorgewählt Ja) | Daten auf dem eigenen Gerät bleiben (Abschnitt 4) |
| G11 | a und b — Server im Internet auf einem Gerät der Aufsicht mit DynDNS oder gemietet; c (Tunnel-Dienst) nur beschrieben | Anleitung mit Vergleich: [anleitung_klassenserver_internet.md](anleitung_klassenserver_internet.md) |

### G1 — Ein Modell für Familie, Klasse und Lerngruppe?
**Ort:** Abschnitt 3; heute `konzept_klasseneinstellungen.md` Abschnitt 4 (eigene Struktur „Klasse“).
**Heutiger Wortlaut:** „Was eine Klasse ist: `{ id, name, stufe, lehrmittel, einstellungen, stand, von }`“; die
Familie ist der Abgleich-Ordner ohne eigene Struktur.
**Problem:** Familie, Klasse und Lerngruppe tun dasselbe (Mitglieder, Ziele, Ort, Erfolge). Getrennt gebaut,
gäbe es drei Abgleiche, drei Vorrangregeln und drei Erfolgsrechnungen.
- **a (Empfehlung):** Eine Struktur `Gruppe` mit `art`; die Klasse aus dem Konzept Klasseneinstellungen wird
  `art: "klasse"`, der heutige Abgleich wird die Gruppe `familie` (Übernahme beim ersten Start, Ordner bleibt).
- **b:** Klasse als eigene Struktur wie im Konzept Klasseneinstellungen, Familie bleibt der heutige Abgleich,
  Lerngruppen später eigens.

*Warum die Empfehlung:* Mit a gibt es einen Abgleich, eine Vorrangregel und eine Erfolgsrechnung; die Lerngruppe
im Lernsteig ist dann nur eine weitere Art. Für b spricht, dass der heutige Abgleich unverändert bliebe — aber er
müsste für die Verschlüsselung (G4) ohnehin angefasst werden. Kippt, wenn sich zeigt, dass Klassen Felder
brauchen, die mit Familie nicht vereinbar sind (dann Unterstruktur je Art, Modell bleibt eins).

### G2 — Wie wird jemand Lehrperson?
**Ort:** Abschnitt 4; F1 im Konzept Klasseneinstellungen.
**Heutiger Wortlaut:** „F1 Wer ist Lehrperson? Reicht eine eigene PIN auf dem Gerät der Lehrperson, oder braucht
die Klassendatei eine Unterschrift?“
**Problem:** Ohne Server kann niemand prüfen, ob jemand wirklich Lehrperson ist.
- **a (Empfehlung):** Merkmal „Ich bin Lehrperson“, von der Aufsicht selbst gesetzt. Es schaltet nur den Untertab
  Klassen frei; Macht über ein Kind bekommt eine Klasse erst, wenn dessen Familie den Beitrittscode eingibt.
- **b:** Freischaltung über einen Code der Entwicklung (wie der Entwickler-Schlüssel), nur an Lehrpersonen
  ausgegeben.

*Warum die Empfehlung:* Die Schutzgrenze ist der Beitritt durch die Familie, nicht die Rolle: Eine „falsche“
Lehrperson sieht nichts, solange keine Familie beitritt, und eine echte braucht keine Erlaubnis der Entwicklung.
b brächte eine Verwaltung von Codes und eine Abhängigkeit von der Entwicklung, ohne die Daten besser zu schützen,
denn der Code liesse sich weitergeben. Kippt, wenn Schulen eine Bestätigung verlangen (dann signierte
Klassendatei der Schule, nicht der Entwicklung).

### G3 — Was erreicht die Lehrperson von einem Kind?
**Ort:** Abschnitt 4 und 5; heute Konzept Klasseneinstellungen Abschnitt 7: „Die Lehrperson bekommt keine Daten
der Kinder zurück … Eine Klassenstatistik wäre ein eigenes Vorhaben mit eigenem Datenschutzentscheid.“
**Problem:** Ohne Daten keine Klassenstatistik; die Frage ist, welche und ab wann.
- **a (Empfehlung):** Nach dem Beitritt alle Runden, Rekorde und Meldungen des Kindes ab dem Beitrittstag, mit der
  Anzeige der Gruppe statt des Kontonamens; die Familie kann den Austausch je Kind pausieren oder austreten.
- **b:** Nur Runden in den Fächern der Klasse (Gruppe trägt Fächer).
- **c:** Nur Kennzahlen je Lernziel und Woche (keine einzelnen Runden).

*Warum die Empfehlung:* Gegen die Zielgrössen gerechnet: Die Klassenstatistik braucht je Lernziel Anteile,
Verlauf, Zeiten und Konzentration — c liefert die letzten zwei nicht, und Kennzahlen lassen sich zwischen Geräten
nicht entdoppeln (spielt ein Kind daheim und in der Schule, zählt c doppelt; Runden entdoppelt
`LS.zusammenfuehren`). b ist sauber, wenn ein Kind bei mehreren Lehrpersonen ist; bei einer Klassenlehrperson,
die alle Fächer unterrichtet, ist b gleich a. Empfohlen ist a mit **Fächern als Filter, wenn die Gruppe welche
trägt** — also b als Verfeinerung von a. Kippt, wenn Familien die Freizeit-Runden ausdrücklich nicht teilen wollen
(dann zusätzlich „nur in der Schule gespielt“ je Gerät).

### G4 — Daten am Abgleich-Ort verschlüsseln?
**Ort:** Abschnitt 5; heute rahmen.md 10 (unverschlüsselt).
**Heutiger Wortlaut:** „Je Gerät eine Datei `lernspiele-sync-<id>.json`“ im gewählten Ordner, Klartext.
**Problem:** Ein Klassenordner liegt fast immer bei einem Cloud-Dienst oder der Schul-IT; dort lägen Vornamen und
Lernstand von 24 Kindern lesbar.
- **a (Empfehlung):** Immer verschlüsseln, auch die Familie (AES-GCM, 256 Bit, WebCrypto); Schlüssel nur im
  Beitrittscode bzw. beim Einrichten der Familie als Code zum Abschreiben/QR auf das zweite Gerät.
- **b:** Nur Klassen und Lerngruppen verschlüsseln, Familie wie heute.

*Warum die Empfehlung:* Auch der Familienordner ist meist ein Cloud-Ordner; ein Verfahren statt zwei heisst weniger
Fehlerstellen. Kosten: ein Schlüssel, der verloren gehen kann — dann liest ein neues Gerät die alten Dateien
nicht; die Daten auf den bisherigen Geräten bleiben, und ein neuer Schlüssel stellt den Ort neu auf. **Zu prüfen
vor dem Bau:** WebCrypto (`crypto.subtle`) gibt es nur in sicheren Kontexten; `localhost` und https sind es, ob
`file://` (Doppelklick) in Chrome, Edge, Firefox und Safari es ist, ist noch nicht gemessen. Kippt die Prüfung,
braucht der Doppelklick-Betrieb einen eigenen Weg (oder gilt nur online).

### G5 — Geräte-Kennung je Gruppe?
**Ort:** Abschnitt 5; heute eine Kennung je Gerät in `lernspiele:geraet`.
**Problem:** Mit einer Kennung für alles könnte, wer zwei Gruppenordner sieht, dasselbe Gerät in beiden erkennen.
- **a (Empfehlung):** Je Gruppe eine eigene zufällige Kennung; der Gerätename („Tablet Küche“) bleibt lokal und
  wird je Gruppe freiwillig angegeben.
- **b:** Eine Kennung je Gerät für alle Gruppen.

*Warum die Empfehlung:* a verknüpft nichts über Gruppen hinweg und lässt Austritte sauber (eine Datei verwaist,
sonst nichts). b spart nur eine Zuordnungstabelle. Kippt nicht absehbar.

### G6 — Lerngruppen von Kindern im Eulenpfad?
**Ort:** Abschnitt 6.
**Problem:** Kinder von 6–12 Jahren, die selbst Gruppen gründen und Codes weitergeben, bringen Daten zu anderen
Familien; im Lernsteig (Jugendliche) ist das eher erwartet.
- **a (Empfehlung):** Im Eulenpfad keine Lerngruppen von Kindern; das Modell sieht sie vor, angeboten werden sie
  ab Lernsteig. Im Eulenpfad gründen nur Aufsicht oder Lehrperson Gruppen.
- **b:** Auch im Eulenpfad, jeder Beitritt mit Bestätigung der Aufsicht des Kindes.

*Warum die Empfehlung:* Familie und Klasse decken im Eulenpfad das gemeinsame Lernen ab; eine Gruppe, die ein Kind
gründet, braucht ohnehin zu jedem Beitritt eine Aufsicht und ist dann nicht mehr die Gruppe des Kindes. Für b
spricht die Freude an der eigenen Gruppe (Geschwister, Freunde). Kippt, wenn Lehrpersonen Untergruppen der Klasse
wollen — die gründet dann die Lehrperson.

### G7 — Wie kommen die Daten an den Ort, wenn es keinen Ordner gibt (iPad, Android)?
**Ort:** Abschnitt 5; heute „Ohne Ordner: dieselben Daten als Datei sichern und auf dem anderen Gerät einlesen“.
**Problem:** Schulgeräte sind oft iPads; dort gibt es keinen Ordnerzugriff aus dem Browser. Eine Klassenstatistik
lebt davon, dass die Daten ohne viel Zutun kommen.
- **a (Empfehlung):** Verschlüsselte Gruppendatei über den Teilen-Dialog (`navigator.share` mit Datei, wie das
  Teilen der Abzeichen) — Knopf „📤 An die Klasse senden“, mit Erinnerung nach dem Lernplan; die Lehrperson liest
  viele Dateien auf einmal ein. Wo ein Ordner geht, automatisch wie heute.
- **b:** Zusätzlich direkt in einen Cloud-Speicher über WebDAV (Schul-Nextcloud, SWITCHdrive) mit Zugangsdaten je
  Gerät.

*Warum die Empfehlung:* a geht auf allen Geräten, braucht keine Zugangsdaten im Browser und keinen bestimmten
Dienst. b wäre bequemer, ist aber **nicht nachgerechnet**: Ein Browser darf WebDAV eines anderen Dienstes nur
ansprechen, wenn dieser CORS erlaubt, und das ist bei Nextcloud und SWITCHdrive nicht gemessen; zudem lägen
Zugangsdaten im Browser des Kindes. Vor einem Entscheid über b wird das geprüft (Prüfauftrag, nicht Ablehnung).
Kippt zu b, wenn ein verbreiteter Schuldienst CORS erlaubt und App-Passwörter mit eng begrenztem Recht bietet.
Einen dritten Weg ohne fremden Dienst, den Klassenserver im Intranet, stellt G9.

### G8 — Gruppen-Erfolge nur gemeinsam?
**Ort:** Abschnitt 7.
**Problem:** Gruppen laden zu Vergleichen ein; die Gestaltungsregel lautet „Belohnung statt Punktedruck“.
- **a (Empfehlung):** Nur gemeinsame Ziele der Gruppe; andere Kinder erscheinen nur als Zahl. Bestehende
  Endlos-Ranglisten bleiben, wie sie sind (je Gerät bzw. Familie), in einer Klasse nur mit Zustimmung der Lehrperson.
- **b:** Zusätzlich Ranglisten der Klasse und Klasse gegen Klasse.

*Warum die Empfehlung:* Gemeinsame Ziele belohnen jedes Kind, das beiträgt, auch das schwächste; eine Rangliste
einer ganzen Klasse stellt die schwächsten bloss — genau die, für die die Klassenstatistik gedacht ist. Kippt
nicht für Kinder; im Lernsteig neu zu stellen.

**Zusatz Patrik (Challenges):** Mit Zustimmung der Lehrperson sind Challenges unter Kindern möglich — freiwillig für
beide Seiten: ein Kind fordert ein anderes heraus (z. B. Endlos-Rekord in einem Spiel und einer Stufe, oder wer diese
Woche zuerst sein Wochenziel schafft), das andere nimmt an oder lehnt ab, ohne dass jemand es sieht. Sichtbar ist das
Ergebnis nur den beiden; keine Rangliste der ganzen Klasse. Die Lehrperson schaltet Challenges je Klasse ein und sieht
in der Klassenstatistik nur, ob sie genutzt werden.

### G9 — Klassenserver im Intranet anbieten?
**Ort:** Abschnitt 5c; Werkzeug `tools/server.py` (liefert heute nur aus).
**Heutiger Wortlaut:** Abgleich nur über einen Ordner oder eine Datei (rahmen.md 10, S1 a).
**Problem:** Ohne Ordner (iPads) kommen Daten nur, wenn jemand „📤 An die Klasse senden“ tippt (G7 a). Wird das
vergessen, ist die Klassenstatistik lückenhaft, und eine lückenhafte Statistik führt die Lehrperson in die Irre.
- **a (Empfehlung):** Ja, als zusätzlicher Ort neben Ordner und Gruppendatei: ein kleiner Server nur mit der
  Python-Standardbibliothek (wie `tools/server.py`), der die App ausliefert und je Gruppe die verschlüsselten
  Gerätedateien ablegt und herausgibt. Schreiben nur mit einem Geheimnis aus dem Beitrittscode; der Server hat den
  Schlüssel zum Inhalt nicht. Fällt er aus, bleibt die Gruppendatei als Rückfall.
- **b:** Nein, nur Ordner und Gruppendatei.

*Warum die Empfehlung:* Gegen die Zielgrössen gerechnet: Vollständigkeit der Daten auf iPads — a von selbst bei
jedem Öffnen im WLAN, b nur auf Knopfdruck; keine Zugangsdaten im Browser — beide; kein fremder Dienst — beide;
Betrieb — a braucht einen laufenden Rechner und https (G10), b nichts. Für b spricht genau dieser Betrieb. Er wiegt
weniger, weil er bei der Lehrperson liegt, die die Statistik will, und weil b für die Statistik das schlechtere
Ergebnis liefert. Kippt zu b, wenn die Schule eigene Server im Netz nicht erlaubt oder G10 auf iPads keinen
gangbaren Weg hat.

### G10 — Wie bekommt der Klassenserver https?
**Ort:** Abschnitt 5c, Punkt 1. Nur nötig bei G9 a.
**Problem:** Ohne https keine WebCrypto, also keine Verschlüsselung (G4); ein Zertifikat, dem die Geräte nicht
vertrauen, zeigt Warnungen, die Kinder nicht wegklicken sollen.
- **a (Empfehlung):** Ein Zertifikat, dem die Geräte vertrauen: von der Schul-IT, wo es eines fürs interne Netz
  gibt; sonst beim Einrichten des Klassenservers selbst erzeugt (eigene kleine Zertifizierungsstelle) und auf
  jedem Gerät einmal installiert, mit Anleitung für iPad, Android, Windows.
- **b:** Ohne https, Verschlüsselung mit einem selbst geschriebenen AES in JavaScript.
- **c:** Ohne https und ohne Verschlüsselung, weil das Netz der Schule als vertrauenswürdig gilt.

*Warum die Empfehlung:* a nutzt die geprüfte Verschlüsselung des Browsers und lässt das Netz ohne Klartext. b wäre
ohne Installation auf den Geräten, aber selbst geschriebene Kryptografie ist eine bekannte Fehlerquelle, die
niemand hier prüfen kann. c gibt Vornamen und Lernstand jedem preis, der im Netz mitliest. **Nachgerechnet am
03.11.2026:** `openssl` 3.2.3 aus Git for Windows erzeugt eigene Zertifizierungsstelle und Serverzertifikat; ein
Server nur mit der Python-Standardbibliothek (`ssl`) liefert damit https aus, ein Client mit der eigenen CA nimmt
an, ohne sie lehnt er ab. `openssl` wird nur einmal beim Einrichten gebraucht, die App bleibt ohne Abhängigkeit. Kippt, wenn die Installation auf
verwalteten Schul-iPads nicht erlaubt ist (dann nur mit dem Zertifikat der Schul-IT, sonst G9 b).

## 10. Schritte, wenn es gebaut wird

1. Entscheide G1–G10, dann F1–F8 des Konzepts Klasseneinstellungen im Licht von G1 neu ordnen.
2. Prüfen auf echten Geräten (iPad, Android-Tablet, Windows mit Chrome, Edge, Firefox): Grenzen von `localStorage`
   und IndexedDB, `persist()`, die Sieben-Tage-Regel von Safari (Abschnitt 5a); WebCrypto unter `file://` (G4);
   CORS von WebDAV-Diensten (G7, nur wenn b gewünscht); Zertifikat auf verwalteten iPads (G10).
3. Speicherschicht (Abschnitt 5a): Arbeitsspeicher und IndexedDB, Umzug, Speicheranzeige, `persist()`, sichtbare
   Meldung bei vollem Speicher — unabhängig von den Gruppen nützlich, kann vorgezogen werden. Danach Übernahme des
   heutigen Abgleichs als Gruppe Familie.
4. Verschlüsselung und Geräte-Kennung je Gruppe im Abgleich; Testskript: zwei Gruppen, Austritt, Schlüsselwechsel.
5. Rolle Lehrperson, Untertab Klassen, Beitrittscode (Text und QR — QR-Erzeuger ohne Abhängigkeit selbst bauen).
6. Gemeinsame und individuelle Ziele; Startseite und Spiele lesen sie.
7. Klassenstatistik und Selbstreflexion (`auswertung.js` über Mitglieder).
8. Gruppen-Erfolge in `erfolge.js`.
9. Bei G9 a: Klassenserver (`tools/klassenserver.py`), Zertifikat nach G10, Anleitung für die Lehrperson.
10. CLAUDE.md: Datenschutz-Ausnahme Gruppen (Abschnitt 8); rahmen.md neuer Abschnitt.
