# Richtlinie: Freigaben von Spielen, Übungen und Inhaltslisten übernehmen

Gilt für alle Apps der Reihe (Eulenpfad, Lernsteig, Gratwanderung). Entschieden von Patrik am 10.11.2026
(LERN_Session27, Plan C12: ES1 a bis ES5 a, ES5-S a, SR1 a). Umgesetzt in `tools/entwicklung_abgleich.py uebernehmen`
(ES3 a); `holen` und `senden` kommen mit dem Meldungsserver im Netz (NS1).

## 1. Worum es geht

Eine Freigabe ändert keinen Inhalt. Sie schaltet sichtbar, was im Repo schon steht (`pruefstand.js` der App:
angesehene Spiele und Übungen, geprüfte Inhaltslisten). Zugelassene Aufsichten (ES1 a, ES2 a) können Prüfvermerke
einreichen; wirksam wird ein Vermerk erst, wenn die Entwicklung ihn übernimmt und `pruefstand.js` veröffentlicht.

**Die Entwicklung selbst** gibt weiterhin direkt frei — über den lokalen Entwickler-Server wie bisher, ohne diese
Richtlinie. Die Richtlinie regelt nur, was **andere** einreichen, und spart der Entwicklung Zeit: Übernahmereifes lässt
sich in einem Schritt annehmen. Übernommen wird nie von selbst — immer nur auf Befehl der Entwicklung, die damit weiss,
was veröffentlicht wird.

## 2. Stufe je Person

Gezählt aus den Entscheiden der Entwicklung über die Vermerke der Person (je App getrennt):

| Stufe | Bedingung |
|---|---|
| **neu** | weniger als 5 angenommene Vermerke |
| **bewährt** | mindestens 5 angenommene Vermerke und unter den letzten 10 entschiedenen keine Ablehnung |
| **gesperrt** | gesperrt mit `python tools/entwickler_server.py --sperren "Vorname Name"`; Vermerke zählen nicht |

Eine **Ablehnung** ist ein Vermerk, den die Entwicklung nicht übernimmt, weil das Spiel oder die Liste nicht in Ordnung
war — oder ein angenommener Vermerk, der später wegen einer berechtigten Meldung zurückgenommen wird. Liegen lassen ist
keine Ablehnung.

## 3. Übernahmereif

Eine Freigabe (ein Spiel, eine Übung oder eine Liste) ist **übernahmereif**, wenn alle drei Bedingungen gelten:

1. mindestens **zwei verschiedene** zugelassene Personen haben sie eingereicht,
2. mindestens **eine** davon ist **bewährt**,
3. zum selben Spiel, zur selben Übung oder Liste liegt **keine offene Meldung** vor.

Sonst heisst sie **selbst ansehen**.

## 4. Anzeige und Befehle

- `uebernehmen` zeigt je Freigabe die einreichenden Personen mit Stufe und Zählung, etwa
  „Anna M. (bewährt, 12 angenommen, 0 abgelehnt), Ben K. (neu, 2/0)“, und die Markierung „übernahmereif“ oder
  „selbst ansehen“.
- `python tools/entwicklung_abgleich.py uebernehmen [app]` zeigt den Eingang; je Freigabe stehen die Nummern der
  Vermerke in eckigen Klammern.
- `uebernehmen <app> --reife` nimmt alle übernahmereifen in einem Schritt an.
- Alles andere entscheidet die Entwicklung einzeln: `--annehmen 3,5`, `--ablehnen 4` (je mit den übrigen offenen
  Vermerken derselben Freigabe) oder liegen lassen.
- `uebernehmen <app> --zuruecknehmen "Vorname Name"` nimmt alle angenommenen Vermerke einer Person aus `pruefstand.js`
  (bei Missbrauch, zusammen mit `python tools/entwickler_server.py --sperren`).
- Die Schwellen stehen als `BEWAEHRT_AB`, `OHNE_ABLEHNUNG_IN`, `MIN_PERSONEN` im Werkzeug; geprüft in
  `tools/pruefe_server.py`.
- Danach: Commit und Push durch die Entwicklung; erst dann ist die Freigabe auf der veröffentlichten Seite.

## 5. Wo die Bewertung liegt

Nur bei der Entwicklung, in `.entwicklung/bewertung.json` (gitignored). Der Server kennt sie nicht, die Person sieht sie
nicht. Die Bewertung ist eine Angabe über eine Person: Die Datenschutzseite (`portal/impressum.html`) und die Antwort auf
eine Anforderung des Entwicklermodus sagen in einem Satz, dass die Entwicklung je Person zählt, wie viele Vermerke
angenommen und abgelehnt wurden — nachgetragen, sobald das Werkzeug gebaut ist.

## 6. Schwellen ändern

Die Zahlen (5 angenommene, letzte 10, zwei Personen) ändern sich nur mit einem Eintrag hier, mit Datum und Grund. So
bleibt nachvollziehbar, nach welcher Regel eine Freigabe übernommen wurde.

| Datum | Änderung | Grund |
|---|---|---|
| 10.11.2026 | Erste Fassung | SR1 a, LERN_Session27 |
