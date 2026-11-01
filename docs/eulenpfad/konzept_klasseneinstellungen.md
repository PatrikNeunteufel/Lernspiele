# Konzept: Klasseneinstellungen durch Lehrpersonen

Stand: 01.11.2026 (LERN_Session7) · **Entwurf, nicht umgesetzt** (Wunsch Patrik: genau beschreiben,
noch nicht bauen; offene Fragen in Abschnitt 8). Heute gibt es nur die Vorstufe: Einstellungen der
Aufsicht je Gerät (Abschnitt 2).

## 1. Ziel

Eine Lehrperson soll für ihre Klasse festlegen können, wie die Spiele zu ihrem Unterricht passen:
welche Schreibweisen gelten, welche Spiele und Stufen im Vordergrund stehen, was die Kinder sehen.
Auslöser war das Dezimalzeichen: Je nach Lehrmittel und Lehrperson schreiben Kinder in der
Mittelstufe „4.5“ oder „4,5“ (der Lehrplan schreibt den Punkt, ältere Ausgaben des Schweizer
Zahlenbuchs das Komma; [lehrplan_sg_5-6.md](spielideen/lehrplan_sg_5-6.md), Abschnitt 9). Ein Spiel,
das anders schreibt als das Heft, verunsichert.

Grundsätze bleiben: offline, keine Anmeldung bei einem Dienst, Daten über Kinder nur im Browser
(Entscheid LERN-5 b), Daten verlassen den Browser nur in einen gewählten Ordner (Entscheid S1 a).

## 2. Heute: Einstellungen der Aufsicht je Gerät (gebaut in LERN_Session7)

- Verwaltung → Untertab **⚙️ Einstellungen**, nur für die Aufsicht.
- Gilt für alle Kinder auf diesem Gerät, **global und je Spiel** („wie global“, Punkt, Komma; nur
  Spiele mit `einstellungen` im Katalog). Gespeichert in `lernspiele:einstellungen`, nur Abweichungen
  vom Standard; **„↺ Alles auf Standard“** löscht alle, auch die je Spiel.
- Geldbeträge folgen der Klasse der Stufe (`LS.geldText`, Entscheid C1 a): bis 3. Klasse Fr. und Rp.,
  ab 4. Klasse mit dem Dezimalzeichen.
- Beschrieben in `LS.EINSTELLUNGEN` (`spiele/gemeinsam/spiel.js`): je Einstellung Titel, Werte,
  Standard, Erklärung. Lesen mit `LS.einstellung(name)`, setzen mit `LS.setzeEinstellung(name, wert)`.
- Bisher eine Einstellung: **Dezimalzeichen** (`punkt` Standard, `komma`). `LS.dezimalText(x)`
  schreibt Dezimalzahlen damit; erstes Spiel, das sie nutzt: Velo-Tabelle.
- Nicht im Abgleich zwischen Geräten (Abschnitt 8, F6).

Der Aufbau ist so gewählt, dass die Klasseneinstellungen ihn übernehmen können: Dieselbe Liste
`LS.EINSTELLUNGEN` bekommt eine weitere Ebene, die Spiele lesen weiter nur `LS.einstellung(name)`.

## 3. Rollen

| Rolle | heute | neu |
|---|---|---|
| Kind | spielt, eigenes Profil | unverändert; gehört zu einer Klasse (Profil-Feld `klasseId`) |
| Aufsicht (Eltern, Betreuung) | Konten, Freigabe, Einstellungen je Gerät | unverändert; kann Klasseneinstellungen nicht ändern, nur sehen |
| **Lehrperson** | — | legt Klassen an, setzt Klasseneinstellungen, verteilt sie als Datei |

Eine Lehrperson ist eine Aufsicht mit dem Zusatz `lehrperson: true` und einer eigenen PIN.

## 4. Was eine Klasse ist

`{ id, name ("4b Schulhaus …" — frei, ohne Personen), stufe (Schulklasse 1–6), lehrmittel, einstellungen, stand, von }`

- `stufe` ersetzt die Klasse im Profil der Kinder nicht, schlägt sie aber vor.
- Kinder einer Klasse werden **nicht** in der Klassendatei aufgeführt (keine Namensliste, die
  herumgereicht wird); das Kind wählt auf seinem Gerät „meine Klasse“ beim Einlesen der Datei.

## 5. Einstellungen einer Klasse (Kandidaten)

| Gruppe | Einstellung | Werte | Wirkt auf |
|---|---|---|---|
| Schreibweisen | Dezimalzeichen | Punkt / Komma | `LS.dezimalText`, alle Spiele mit Dezimalzahlen |
| | Geldbeträge | „25 Fr. 60 Rp.“ / „25.60 Fr.“ / „Fr. 25.60“ | Kiosk-Kasse, Preis-Tabelle, weitere |
| | Tausendertrennung | schmales Leerzeichen / Apostroph „30'400“ | `LS.zahlText` (Lernzielblatt vs. Lehrplan, LERN-6) |
| | Mal-Zeichen | „·“ / „×“ | Rechenspiele |
| Lehrmittel | Mathematik | Zahlenbuch / Mathematik (LMVZ) / mathwelt | Basisklasse-Hinweise, Reihenfolge der Themen |
| | Französisch | dis donc! / … | Wortlisten von Mots-Match |
| Auswahl | bevorzugte Spiele je Thema | Liste von Spiel-Ids | Startseite zeigt sie zuerst („von deiner Lehrperson“) |
| | Fokus-Lernziele | Liste von Lernziel-Codes, mit Zeitraum | wie heute der Fokus im Profil, aber für alle |
| | Stufenvorschlag | je Spiel eine Stufe | `LS.empfohleneStufe` |
| Ablauf | Timer | aus / an, Faktor | wie heute im Profil |
| | Reihenfolge der Teile | nach Stufe / geordnet / gemischt | `ctx.geordnet` |
| | Endlos und Ranglisten | erlaubt / nicht erlaubt | Startseite, Spiel |
| Freigabe | Spiele und Inhaltslisten | frei / gesperrt | wie die Freigabe der Aufsicht |

Jede Einstellung braucht im Rahmen eine **Wirkstelle**: eine Funktion, die alle Spiele benutzen.
Eine Einstellung ohne Wirkstelle wird nicht angeboten.

## 6. Vorrang

Von oben nach unten, die erste gesetzte gilt:

1. **Einstellung des Kindes** — nur wo das Kind heute schon wählt (Timer, Reihenfolge, Meine Klasse),
   und nur, wenn die Klasse sie nicht „festgelegt“ hat.
2. **Klasse** — Wert der Lehrperson; je Einstellung „vorgeschlagen“ (Kind darf ändern) oder
   „festgelegt“.
3. **Gerät** — Einstellung der Aufsicht (heute).
4. **Standard** — `LS.EINSTELLUNGEN[name].standard`.

Schreibweisen (Gruppe 1 in Abschnitt 5) wählt das Kind nie selbst.

## 7. Verteilen ohne Server

- Die Lehrperson sichert die Klasse als Datei `lernspiele-klasse-<name>.json` (wie das Sichern in
  der Statistik), oder legt sie in den Abgleich-Ordner (Entscheid S1 a).
- Auf dem Gerät des Kindes liest die Aufsicht die Datei ein; danach gilt die Klasse für die Kinder,
  die die Aufsicht ihr zuordnet. Eine neuere Datei derselben Klasse (`stand`) ersetzt die alte.
- Die Datei enthält keine Daten über Kinder; sie darf deshalb auch per E-Mail oder Schulplattform
  verteilt werden.
- Die Lehrperson bekommt **keine** Daten der Kinder zurück, ausser die Familie sichert sie und gibt
  sie ihr (wie heute). Eine Klassenstatistik wäre ein eigenes Vorhaben mit eigenem Datenschutzentscheid.

## 8. Offene Fragen

- **F1 Wer ist Lehrperson?** Reicht eine eigene PIN auf dem Gerät der Lehrperson, oder braucht die
  Klassendatei eine Unterschrift, damit nicht jede Aufsicht eine „Klasse“ erfinden kann?
- **F2 Mehrere Klassen je Kind:** Mathe bei der einen, Französisch bei einer anderen Lehrperson —
  Einstellungen je Fach?
- **F3 Festlegen gegen Familie:** Darf eine Klasse etwas festlegen, das die Aufsicht zu Hause anders
  will (Timer, Freigabe)? Vorschlag: Schreibweisen ja, alles andere nur vorschlagen.
- **F4 Protokoll:** Soll jede Runde die geltenden Schreibweisen vermerken, damit die Statistik
  Runden mit Komma und mit Punkt unterscheiden kann?
- **F5 Eingabe:** Kinder tippen heute nur ganze Zahlen (Zifferntastatur). Dezimalzahlen eintippen
  braucht eine Taste „.“ bzw. „,“ — nach der Einstellung beschriftet.
- **F6 Abgleich:** Sollen Einstellungen je Gerät mit abgeglichen werden (heute nicht), und wie
  werden Widersprüche zwischen Geräten gelöst?
- **F7 Lehrmittel als Einstellung:** Reicht ein Feld, oder braucht jedes Lehrmittel eine eigene
  Zuordnung Thema → Klasse (Basisklasse)? Heute ist die Basisklasse fest im Katalog.
- **F8 Name der Rolle** in der Oberfläche: „Lehrperson“ oder „Klasse einrichten“?

## 9. Schritte, wenn es gebaut wird

1. Entscheide F1–F8.
2. `LS.einstellung(name)` um die Ebenen Kind und Klasse erweitern (Abschnitt 6); Tests im Testskript
   für den Vorrang.
3. Weitere Wirkstellen im Rahmen: Geld, Tausendertrennung, Mal-Zeichen; Dezimaltaste der Tastatur.
4. Klassendatei sichern und einlesen, Zuordnung Kind → Klasse in der Verwaltung.
5. Startseite: bevorzugte Spiele und Fokus der Klasse.
