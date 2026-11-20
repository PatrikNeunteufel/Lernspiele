# Entscheidvorlage BZ1 — Aufrufe der veröffentlichten Seite zählen

Stand: 20.11.2026 (LERN_Session49, Frage Patrik: „gibt es eine Möglichkeit, dass die Aufrufe auf die publizierte Seite
gezählt werden?“). Offen, Entscheid Patrik.

**Woher die Angaben stammen:** Projektregeln aus `CLAUDE.md` und `portal/impressum.html` (gelesen am 20.11.2026).
GitHub-Seiten am 20.11.2026 abgefragt: `github.com/patrikneunteufel/Lernspiele/discussions` antwortet 404,
`github.com/sponsors/patrikneunteufel` leitet auf das Profil weiter (es gibt noch keine Sponsors-Seite). Angaben zu
Cloudflare und GoatCounter stammen **aus dem Wissen des Modells und sind nicht nachgeprüft**; sie sind mit (NP) markiert
und vor der Umsetzung auf den Seiten der Anbieter zu bestätigen. Frühere Entscheide dazu: keine gefunden (Suche nach
„analytics“, „Besucher“, „GoatCounter“, „Plausible“, „Cloudflare“, „Zählpixel“ in `docs/` und `CLAUDE.md`).

## Heute

- GitHub Pages zählt die Aufrufe der Seite nicht und zeigt keine Besucherstatistik. **Repo → Insights → Traffic** zählt
  nur Aufrufe des Repositorys auf github.com (14 Tage), nicht die der Pages-Seite.
- `CLAUDE.md`, Gestaltungsregeln, Entscheid LERN-5 b: „Nichts wird an einen Server geschickt“; Ausnahmen nur einzeln
  entschieden (Abgleich S1 a, Meldungen M1 a/NS1 a, Abzeichen L1 a, Einladung EL1 a).
- Entscheid PK1 a: kein Skript von aussen (`tools/pruefe_skripte.js` weist jede fremde `<script src>` ab).
- `portal/impressum.html`, Abschnitt Hosting: „Beim Aufruf protokolliert GitHub die IP-Adresse zu Sicherheitszwecken“.

## Problem

Die Entwicklung weiss nicht, ob und wie oft die Reihe online genutzt wird. Jede Zählung braucht entweder einen neuen
Datenfluss aus dem Browser (gegen LERN-5 b) oder einen Dienst zwischen Browser und GitHub.

## Zielgrössen und Optionen im Vergleich

| Zielgrösse | a Cloudflare vor eigener Domain | b Zählpixel eines Dienstes (GoatCounter) | c eigener Meldungsserver zählt |
|---|---|---|---|
| Neuer Datenfluss aus dem Browser | keiner — die Seite ändert sich nicht | ja: jede Seite ruft den Dienst auf (IP, Browser, Herkunft, Pfad) | ja: jede Seite ruft den eigenen Server auf |
| Regeln, die sich ändern | keine; Impressum: Cloudflare als zweiter Dienst neben GitHub | LERN-5 b (neue Ausnahme), Impressum; PK1 a bleibt mit Bild statt Skript (NP: GoatCounter zählt auch ohne Skript) | LERN-5 b, NS1 a („nimmt nur Meldungen an“), Impressum |
| Code in den Apps | keiner | eine Zeile je Seite (Portal, Startseiten, evtl. Spiele) | eine Zeile je Seite, dazu Zähler im Server |
| Was man sieht | Anfragen, Besucher geschätzt, Länder, Seiten (NP: in der Gratisstufe grob, ohne Seitenwege) | Aufrufe je Seite, Herkunft, Browser, Land (NP) | was man selbst baut |
| Offline und Kopien | nicht gezählt | nicht gezählt (Pixel lädt nicht) | nicht gezählt |
| Voraussetzungen | eigene Domain (NP: rund 10–20 Fr. im Jahr), DNS bei Cloudflare, Domain in Pages eintragen | Konto beim Dienst (NP: GoatCounter gratis für nicht kommerzielle Seiten) | Meldungsserver läuft dauernd im Netz |
| Schwer umkehrbare Folge | **Umzug der Herkunft:** Profile und Protokolle liegen im Browser je Herkunft (`patrikneunteufel.github.io`). Nach dem Wechsel auf die eigene Domain leitet GitHub dorthin weiter, und der Browser zeigt die alten Daten **nicht mehr**. Wer schon spielt, muss vorher sichern und danach einlesen | keine | keine |
| Passt zu | LERN-29 (Name und Domain vor der Veröffentlichung) | — | — |

## Optionen als fertiger Text

**a (Empfehlung) — Cloudflare vor einer eigenen Domain:** Die Reihe bekommt eine eigene Domain (mit LERN-29). Cloudflare
leitet sie an GitHub Pages weiter und zählt dabei die Anfragen bei sich. Die Seiten selbst schicken nichts Zusätzliches;
LERN-5 b und PK1 a bleiben unverändert. Das Impressum nennt Cloudflare neben GitHub. Vor dem Wechsel zeigt die alte
Adresse eine Zeit lang einen Hinweis „Bitte sichern, die Adresse wechselt“, die Startseite der neuen Adresse den Weg zum
Einlesen.

**b — Zählpixel eines Dienstes ohne Cookies:** Portal und Startseiten laden beim Öffnen ein Bild von GoatCounter, das
den Aufruf zählt. Neue Ausnahme zu LERN-5 b: „Beim Öffnen einer Seite erfährt GoatCounter IP-Adresse, Browser und
Seite, ohne Cookies und ohne Angaben über das Kind.“ Das Impressum nennt den Dienst.

**c — Der eigene Meldungsserver zählt:** Portal und Startseiten melden ihren Aufruf an den Meldungsserver der Entwicklung,
der nur eine Zahl je Seite und Tag speichert, ohne IP. NS1 a wird erweitert: „Der Meldungsserver nimmt Meldungen an und
zählt Aufrufe je Seite und Tag.“

### Warum die Empfehlung

Den Ausschlag gibt, dass a als einzige Option **keinen neuen Datenfluss aus dem Browser** braucht: Die Regel, auf die
sich die ganze Reihe stützt („Nichts wird an einen Server geschickt“), bleibt ohne neue Ausnahme wahr, und der Vertrag
der Apps ändert sich nicht. Cloudflare sieht nur, was GitHub heute schon sieht (die Anfrage). Ausserdem steht die eigene
Domain mit LERN-29 ohnehin an.

Für b spricht die genauere Statistik (Seiten, Herkunft) ohne Domain und ohne Umzug; es wiegt weniger, weil es eine
Ausnahme schafft, die bei jeder Seite gilt, auch wenn ein Kind spielt, und einen Dienst einbindet, dem die Eltern nicht
zugestimmt haben. Für c spricht die volle Kontrolle; es macht aber aus dem Meldungsserver einen Server, der bei jedem
Aufruf angefragt wird, und das Werkzeug gegen Missbrauch (Zufallszahl, Unterschrift) passt nicht auf blosse Aufrufe.

**Die Empfehlung kippt**, wenn (1) keine eigene Domain gewünscht ist — dann wäre c sauberer als b, weil die Daten bei
der Entwicklung bleiben —, oder (2) schon viele Familien auf `github.io` spielen und der Umzug der Daten mehr Schaden
anrichtet, als die Zählung nützt; dann erst zählen, wenn die Domain ohnehin wechselt, oder gar nicht. Wie viele es
sind, weiss heute niemand — das ist die Frage selbst. (3) Bestätigt sich (NP) nicht, dass Cloudflare in der Gratisstufe
Besucher zählt, verliert a den Zweck.
