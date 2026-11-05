# Notizen für den Eulenpfad — aus der Arbeit am Lernsteig

Stand: 2026-11-04 (LST_Session1)

Hier steht, was Patrik bei Entscheiden zum Lernsteig **für den Eulenpfad** mitbestimmt hat. Die Cloud-Sitzung ändert
`eulenpfad/**` und `docs/eulenpfad/**` nicht; Patrik trägt die Punkte im Lernspiele-Repo nach. Je Punkt: Herkunft,
Wunsch, was der Lernsteig dazu braucht, Status.

| Nr. | Punkt | Herkunft | Status |
|---|---|---|---|
| EP1 | Klassenaufstieg und Wechsel zum Lernsteig per Knopf der Aufsicht | SP1 a mit Zusatz | offen |
| EP2 | Klassenaufstieg als Erfolg (Abzeichen) | SP1 Zusatz, AB1 a | offen |
| EP3 | Geburtsdatum statt Alter im Profil, Datenschutz-Abschnitt in `CLAUDE.md` | SP1 Zusatz, GE1 b | offen |
| EP4 | `.gitignore`: auch `lernsteig-*.json` und `__pycache__/` ausschliessen | LST_Session1 | offen (Repo-Datei, nicht im Auftrag) |

## EP1 — Klassenaufstieg und Wechsel zur nächsten App

Wunsch Patrik (2026-11-04, zu SP1 a): Im Eulenpfad stösst die **Aufsicht** im Profil des Kindes per Knopf den
**Klassenaufstieg** an (Klasse +1) und, nach der 6. Klasse, den **Wechsel zum Lernsteig** — später ebenso vom Lernsteig
zur Gratwanderung. Im Konto des Kindes wird der Aufstieg angezeigt, und es kann zum neuen Konto wechseln; im Lernsteig
bekommt es mehr und andere Möglichkeiten, sich anzupassen.

Zusammen mit AU1 a: Beim Aufstieg erhält das Kind eine **Einladung zum Lernsteig**; sie kann schon vorausgefüllt sein
(Vorname, Klasse 7, Niveau, Kanton — und, falls es einen Server gibt, dessen Adresse und Verknüpfung). Im Lernsteig
legt der Jugendliche dann seine PIN an.

Entschieden (Patrik 2026-11-04):
- **EL1 a — Weg der Einladung:** Der Eulenpfad erzeugt einen Link `…/lernsteig/#einladung=<kodierte Angaben>`
  (Fragment, geht nicht an den Server) oder eine Datei `lernsteig-einladung.json`. Nur Stammdaten (Vorname,
  Geburtsdatum, Klasse, Niveau je Fach, Land/Kanton), kein Verlauf, keine PIN. Der Lernsteig füllt die Anmeldung vor
  und löscht das Fragment aus der Adresse. Das Format beschreibt der gemeinsame Kern (`docs/commons_bibliothek.md`);
  der Lernsteig legt es als Erster fest, der Eulenpfad übernimmt es.
- **DS1 a:** Server, E-Mail und „Passwort vergessen“ per Mail kommen nicht in den Prototyp, sondern in einen eigenen
  Ausbauschritt mit Datenschutzkonzept (Idee Patrik: Server für die Schule). Bis dahin trägt die Einladung keine
  Server-Verknüpfung.
- **GW1 a:** Pro-Gymi bleibt im Lernsteig; derselbe Aufstiegsknopf führt später mit dem Eintritt in die
  Sekundarstufe II zur Gratwanderung.

## EP2 — Klassenaufstieg als Erfolg

Wunsch Patrik: Klassenaufstiege werden mit einem Erfolg belohnt. Erster Vorschlag war ein Rang nach Schultyp (Real
Gold, Sek Platin, Pro-Gymi Diamant); entschieden ist **AB1 a**: Jeder Übertritt gibt denselben Erfolg im gleichen Rang,
unabhängig vom Niveau. Ein Abzeichen „Aufstiege“ zählt die geschafften Klassen (Stufen etwa 1, 3, 6, 7, 9 — Zahlen
Vorschlag), nicht das Niveau. Eine bestandene Aufnahmeprüfung liesse sich mit einem eigenen Erfolg würdigen (Idee, nicht
entschieden).

## EP3 — Geburtsdatum statt Alter

Wunsch Patrik: Im Lernsteig steht das **Geburtsdatum**, das Alter wird daraus berechnet. Im Eulenpfad steht heute nur das
Alter (Profilfeld, gesetzt von der Aufsicht, `docs/eulenpfad/rahmen.md` 18); auch dort soll die Aufsicht ein
Geburtsdatum hinterlegen können, damit das Alter von selbst mitgeht. Entschieden **GE1 b**: das ganze Datum
(`geboren: "2013-05-17"`); frühere Profile mit Alter bleiben gültig.

Dazu gehört eine Änderung im Datenschutz-Abschnitt von `CLAUDE.md` (die Cloud-Sitzung darf ihn nicht ändern) —
Vorschlag für den Wortlaut: „Profil (Name, Geburtsdatum oder Alter, Klasse, Fokus-Lernziele)“ statt „Profil (Name,
Alter, Klasse, Fokus-Lernziele)“; im Lernsteig zusätzlich „Land und Kanton, Niveau je Fach“ (KT1 a, NV1 a).

## EP4 — `.gitignore`

`.gitignore` schliesst gesicherte Spielerdaten `lernspiele-*.json` aus. Der Lernsteig sichert als `lernsteig-*.json`
(SP1 a); die Zeile `lernsteig-*.json` (und später `gratwanderung-*.json`) gehört dazu, bevor jemand eine Sicherung ins
Repo legt. Die Datei liegt ausserhalb dessen, was die Cloud-Sitzung ändern darf — Vorschlag an Patrik.
