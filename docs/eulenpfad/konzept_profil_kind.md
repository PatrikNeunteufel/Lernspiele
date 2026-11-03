# Konzept: Profil und Statistik für Kinder, Avatar

Stand: 03.11.2026 (LERN_Session12) · AV1–AV6, ST1, ST2, ZG1, RF1, VR1 gebaut (rahmen.md 18); VR2, VR3 und die Ziele der Klasse kommen mit den Gruppen (LERN-48).

## Auslöser (Hinweis Patrik, LERN_Session12)

Die Einstellungen unter Profil sind für Kinder, zumindest in den unteren Klassen, viel zu kompliziert: Ein Kind sah
Alter, Klasse, Vorlesen, 96 Kästchen Fokus mit Lernziel-Kürzeln, Reihenfolge der Teile und die Timer-Tabelle (bis
168 Spiele × 6 Stufen). Kinder sollen stattdessen einen Avatar wählen, der in Ranglisten, Klassenliste usw. erscheint.
Auch die Statistik zeigt einem Kind zu viel; einiges soll bleiben, damit es Eigenverantwortung lernt. Es fehlt ein Ort
für die zuletzt gespielten Spiele.

## Entscheide

| Nr. | Entscheid | Zusatz |
|---|---|---|
| AV1 | a — Ein Kind sieht im Profil nur „Mein Bild“ (Avatar). Alter, Klasse, Vorlesen, Fokus, Reihenfolge und Timer stellt nur die Aufsicht ein (derselbe Tab, wenn sie angemeldet ist). Timer, Vorlesen und Reihenfolge bleiben im Spiel bzw. auf der Stufenwahl für das Kind umschaltbar. | — |
| AV2 | a — Eigener Satz gezeichneter Figuren als SVG (Tiere in Farben), im Rahmen abgelegt (`spiele/gemeinsam/avatare.js`); gespeichert wird nur die Kennung. Keine Fotos, kein Hochladen. | eventuell einige Bilder aus den Spielen |
| AV3 | a — Der Avatar steht überall vor dem Namen (Anmeldung als grosse Kachel). Wo andere Kinder hinschauen, steht der Anzeigename der Gruppe daneben; die Lehrperson sieht Avatar und Anzeigename. | Ranglisten der Klasse bleiben nach G8 a ausgeschlossen (konzept_gruppen.md) |
| ST2 | a — Tab 🏅 Erfolge, Karte „🏆 Meine Podestplätze“: je Spiel und Stufe Platz 1–3 der Endlos-Rangliste (Familie; Klasse nur mit Zustimmung der Lehrperson, G8 a) mit Rekord; ab Platz 4 nichts. Ganze Rangliste bleibt im Startblatt. | — |
| RF1 | a (Satz B) — vierter Schalter auf der Karte der Spiele mit `reihenfolge: true`, schaltet weiter: nach Stufe = drei absteigende Balken grau, geordnet = dieselben gold, gemischt = goldener Mischpfeil; Wahl des Kindes (VR1 a), 🔒 wenn festgelegt. | Test auf 375 px: vier Schalter |
| AV4 | a — Drei weitere Sätze, gezeichnet wie die Tiere: Weltall und Technik, Fantasie, aus den Spielen (je 6); im Profil als Reiter. | — |
| AV5 | a — Jedes der 19 Abzeichen hat ein gezeichnetes Symbol (`abz-<id>` in avatare.js); ab Gold des Abzeichens als Bild wählbar. Das Symbol ersetzt das Emoji auch im Tab Erfolge und im geteilten Bild. | — |
| AV6 | a — Rahmen Gold, Platin, Diamant ab dem ersten Abzeichen in diesem Rang; das Kind wählt selbst, welchen es trägt (auch den einfachen). Kennung `<motiv>-<farbe>[-<rahmen>]`. | Hinweis „neu freigeschaltet“ (unten) |
| VR3 | a — Reihenfolge ist Schulsache: die Klasse schlägt je Spiel vor oder legt fest (geht vor der Familie, Meldung mit Grund); ohne Festlegung gilt die Vorgabe der Familie; das Kind darf umstellen, solange niemand festgelegt hat. | — |
| ST1 | a — Ein Kind sieht in der Statistik vier Karten: „Das übe ich als Nächstes“ (Empfehlungen mit Knopf, Fazit wenn freigegeben), „Meine Woche“, „Meine Runden“ (falsch gelöste Aufgaben aufklappbar), „Meine Meldungen“ (nur wenn vorhanden). Wann wird gelernt, Konzentration, Vorgehen, Lernziele-Tabelle, Beste Sterne und Daten sichern nur für die Aufsicht. | Endlos-Rekorde und Platzierungen: ST2 |
| ZG1 | a — Tab Spiele zuoberst „▶️ Weiterspielen“: die letzten 3–5 Spiele als Karten, Antippen startet die zuletzt gespielte Stufe; vor den Favoriten. „Meine Runden“ bleibt als Rückblick. | — |
| VR1 | a — Zwei Ebenen: Vorgabe der Aufsicht im Profil, je Einstellung „Kind darf ändern“ (Standard) oder „fest“ (🔒 auf Stufenwahl und Karte). Die Wahl des Kindes wird eigens gespeichert und gilt vor der Vorgabe; „Auf Vorgabe zurück“ löscht sie. | behebt: heute schreiben Kind und Aufsicht dasselbe Profilfeld |
| VR2 | a (= F3 in konzept_klasseneinstellungen.md) — nach Art der Einstellung: Schulsachen (Schreibweisen, Lehrmittel) legt die Klasse fest; Persönliches (Timer, Vorlesen, Wochenziel) bestimmt die Familie, die Klasse schlägt vor; Fokus beider Seiten gilt nebeneinander; die strengere Sperre gewinnt. | Zusätze Patrik unten; Reihenfolge: VR3 |

### Zusatz Patrik zu AV5/AV6 (LERN_Session12)

- Wie bei einem neuen Abzeichen erscheint im Tab Spiele „Freigeschaltet — neues Bild … · neuer Rahmen …“, bis das
  Kind die Bildwahl im Profil öffnet; dort tragen die neuen Bilder und Rahmen 🆕 (Profilfeld `freiGesehen`).

### Zusätze Patrik zu VR2 (LERN_Session12)

- **Ein Gerät oder synchron:** Zu Hause und in der Schule wird in der Regel dasselbe Gerät benutzt; sind es mehrere,
  sollen sie synchron sein (Abgleich je Gruppe, konzept_gruppen.md). Die Rangfolge gilt also auf einem Gerät mit
  beiden Erwachsenen.
- **Vorrang der Lehrperson wird gemeldet:** Legt die Lehrperson eine Einstellung mit Vorrang fest (etwa weil sie zum
  Lehrkonzept gehört), sieht die Aufsicht der Familie das in ihrem Konto als Meldung, mit dem Grund.
- **Mehrere Ziele:** Der Lernplan kennt mehr als „x Tage à y Minuten“; Ziele setzen Familie und Klasse, Ziele der
  Klasse bringen zusätzliche Erfolge. Welche Arten von Zielen: noch vorzulegen.

## Orte heute

- **Reihenfolge der Teile:** im Profil (für alle Spiele und je Spiel) und auf der Stufenwahl der zwei Spiele mit
  `reihenfolge: true` (Zahlen-Baukasten, Zahlenrätsel-Tresor). Nach AV1 a im Profil nur noch für die Aufsicht.
- **Zuletzt gespielt:** nur in der Statistik als Karte „Letzte Runden“ (30 Runden, Text), ohne Knopf zum Weiterspielen.
- **Gruppen, Lehrperson, Klassen:** nur als Konzept (`docs/konzept_gruppen.md`, G1–G11 entschieden, LERN-48 Bau
  offen). Im Code gibt es die Rollen Kind und Aufsicht, keinen Tab für Lehrperson oder Klasse.
