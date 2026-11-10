# Anleitung: Entwickler-Server und Meldungsserver

Stand: 10.11.2026 (LERN_Session27, Plan C12: NS1 a bis NS3 a, ES1 a bis ES5 a, SR1 a, IM2 c) · Für die Entwicklung.
Ein Werkzeug, zwei Betriebsarten: `tools/entwickler_server.py` läuft **lokal** als Entwickler-Server im Repo oder
**im Netz** als Meldungsserver (`--netz`). Dazu `tools/entwicklung_abgleich.py` für den Abgleich und das Übernehmen.

**Geprüft** ist alles, was `tools/pruefe_server.py` abdeckt (Server im Prozess, 59 Fälle: Schlüssel, Rollen, Eingang,
Übernehmen, Unterschrift mit openssl gegen WebCrypto, Betrieb im Netz, holen und senden) und der lokale Betrieb im
Browser. **Nicht geprüft** ist der Betrieb auf einem echten Rechner im Internet (Abschnitt 6): Er beruht auf allgemeinem
Wissen über Caddy, Let's Encrypt und systemd. Vor dem Einsatz Schritt für Schritt ausprobieren.

## 1. Wer was darf

| Wer | Womit | Darf |
|---|---|---|
| **Alle** (Aufsicht im Eulenpfad, Jugendliche im Lernsteig) | nichts | eine bestätigte Meldung schicken — ohne Namen, höchstens 20 je Absender und Stunde |
| **Zugelassene Aufsicht** | persönlicher Schlüssel (`--zulassen`) | Entwickler-Modus freischalten, Prüfvermerke **einreichen**, Bemerkungen schreiben |
| **Entwicklung** | `entwickler.key` | alles: Prüfstand direkt schreiben (lokal), Status von Bemerkungen setzen, `holen`, `senden` |

Eingereichte Vermerke wirken erst, wenn die Entwicklung sie übernimmt ([richtlinie_freigaben.md](richtlinie_freigaben.md)).

## 2. Was wo liegt

| Datei | Inhalt | Ins Repo? |
|---|---|---|
| `entwickler.key` | Schlüssel der Entwicklung (Klartext) | **nie** (gitignored); im Kern nur sein Hash |
| `.entwicklung/geheimnis` | Geheimnis für die Schlüssel der Aufsichten (HMAC) | **nie** |
| `.entwicklung/zugelassen.json` | zugelassene Aufsichten: Name, Hash des Schlüssels, Datum, Zähler, gesperrt — **keine E-Mail** | **nie** |
| `.entwicklung/server-privat.pem` | privater Schlüssel für die Unterschrift des Servers | **nie** |
| `.entwicklung/bewertung.json` | Zählung angenommener und abgelehnter Vermerke je Person | **nie** |
| `.entwicklung/daten/<app>/` | nur im Netz: Meldungen, Bemerkungen, eingereichte Vermerke | **nie** |
| `docs/<app>/bemerkungen.json` | Bemerkungen und Meldungen bei der Entwicklung | **nie** (IM2 c) |
| `docs/<app>/pruefstand-eingang.json` | eingereichte Vermerke bei der Entwicklung | **nie** |
| `<app>/…/pruefstand.js` | was angesehen und geprüft ist — die Freigabe | ja (wird veröffentlicht) |
| `<app>/meldungen-stand.json` | Status und Antwort je Meldungskennung, ohne Text | ja (die Apps holen die Antworten dort) |
| `kern/entwicklung.js` | Hash von `entwickler.key`, öffentlicher Schlüssel `SERVER_SCHLUESSEL` | ja |

**Sichern:** `entwickler.key` und `.entwicklung/` gehören in eine eigene Sicherung (verschlüsselter Stick, Passwort-
Manager), nicht in die Cloud-Sicherung des Repos. Geht `.entwicklung/geheimnis` verloren, gelten alle Schlüssel der
Aufsichten nicht mehr; geht `server-privat.pem` verloren, braucht es ein neues Paar (Abschnitt 5).

## 3. Lokal: Entwickler-Server im Repo

Voraussetzung: Python ab 3.10 (die Werkzeuge nutzen `str | None`), unter Windows Git for Windows (bringt `openssl`).

1. Einmal: `python tools/entwickler_server.py --neuer-schluessel` — schreibt `entwickler.key` und den Hash in
   `kern/entwicklung.js`; danach `kern/VERSION` erhöhen und `python tools/kern_verteilen.py`.
2. Starten: `python tools/entwickler_server.py` (Port 8765; anderer Port als Zahl, `--oeffnen` öffnet den Browser).
3. Im Browser `http://localhost:8765/eulenpfad/` → Verwaltung → 🛠 Entwicklung → Schlüssel aus `entwickler.key`
   eingeben → Freischalten. Im Lernsteig: Verwaltung → 🛠 Entwicklung.
4. Prüfen: In den Spielen und Übungen erscheint die Leiste („angesehen“, „Bemerkung“), in der Freigabe „geprüft“ je
   Liste. Der Server schreibt `pruefstand.js` direkt; danach committen und pushen.
5. Antworten veröffentlichen: Status in `docs/<app>/bemerkungen.json` setzen („erledigt …“, „kein Fehler …“, „geplant …“,
   Feld `antwort` für die Antwort), dann `python tools/meldungen_stand.py`, committen, pushen.

**Verbindung prüfen** (Verwaltung → Einstellungen → Meldungen an die Entwicklung) prüft die Adresse im Feld und sagt,
welche Version und welches Protokoll antworten und ob der Server unterschreibt.

## 4. Zugelassene Aufsichten

1. **Anforderung:** Die Person tippt in der App „✉️ Entwicklermodus anfordern“; es kommt eine E-Mail mit Betreff
   „Anforderung Entwicklermodus“ und den Angaben Name, Rolle, Schule oder Organisation (Pflicht), was sie prüfen will,
   App und Version.
2. **Prüfen, wer es ist** (ES5 a): kein Ausweis. Der Schlüssel geht nur an die Absenderadresse; das Vertrauen
   beurteilen Sie: Schuladresse, Bekanntschaft, sonst eine kurze Rückfrage.
3. **Zulassen:** `python tools/entwickler_server.py --zulassen "Vorname Name" person@schule.ch` — gibt den Schlüssel aus
   (20 Zeichen in Gruppen; klein und ohne Bindestriche getippt geht auch). Den Namen genau so schreiben, wie er in den
   Vermerken stehen soll.
4. **Antworten** (Vorlage):

   ```
   Guten Tag

   Danke für Ihr Interesse. Ihr persönlicher Schlüssel für den Entwicklermodus:

       <SCHLÜSSEL>

   In der App unter Verwaltung → Entwicklung eingeben und „Freischalten“ tippen. Was Sie als geprüft markieren, wird
   eingereicht und wirkt, sobald ich es übernommen habe. Der Server kennt nur Ihren Namen und einen Prüfwert des
   Schlüssels, nicht Ihre E-Mail-Adresse. Ich zähle je Person, wie viele Vermerke ich übernommen oder abgelehnt habe
   (nur bei mir, nicht öffentlich). Bitte den Schlüssel nicht weitergeben.

   Freundliche Grüsse
   Patrik Neunteufel
   ```
5. **Ersetzen:** `--zulassen "Vorname Name" person@schule.ch --neu` (der alte gilt nicht mehr). **Sperren:**
   `--sperren "Vorname Name"`. **Liste:** `--zugelassen`.
6. **Übernehmen:** `python tools/entwicklung_abgleich.py uebernehmen` zeigt den Eingang; `uebernehmen <app> --reife`,
   `--annehmen 3,5`, `--ablehnen 4`, `--zuruecknehmen "Name"` — Regeln in der Richtlinie. Danach committen und pushen.

Läuft der Meldungsserver im Netz, liegen `geheimnis` und `zugelassen.json` **dort**; `--zulassen` dann auf dem Server
ausführen (oder die beiden Dateien nach jeder Änderung hinüberkopieren).

## 5. Schlüsselpaar für die Unterschrift (NS2 a)

Damit die Apps einen Server im Netz annehmen, unterschreibt er eine Zufallszahl, die die App schickt; die App prüft gegen
den öffentlichen Schlüssel im Kern. Ein fremder Server — auch einer unter einer eingetippten oder umgeleiteten Adresse —
kann das nicht.

1. `python tools/entwickler_server.py --neues-schluesselpaar` — erzeugt `.entwicklung/server-privat.pem` und trägt
   `SERVER_SCHLUESSEL` in `kern/entwicklung.js` ein.
2. `kern/VERSION` erhöhen (mittlere Zahl), `python tools/kern_verteilen.py`, Tests, committen, pushen. Erst die
   veröffentlichte Fassung kennt den Schlüssel.
3. `server-privat.pem` auf den Server kopieren (Abschnitt 6.2) und sichern (Abschnitt 2).
4. **Bei Verlust oder Verdacht auf Weitergabe:** neues Paar wie oben. Geräte mit der alten App nehmen den Server erst
   wieder an, wenn sie die neue Fassung geladen haben (Seite neu laden).

## 6. Meldungsserver im Netz (NS1 a) — nicht geprüft

### 6.1 Wo er läuft

Ein Rechner, der immer läuft und unter einem Namen über https erreichbar ist. Die Wege (eigenes Gerät mit DynDNS oder
gemieteter kleiner Server) vergleicht [anleitung_klassenserver_internet.md](anleitung_klassenserver_internet.md); für den
Meldungsserver passt meist ein **gemieteter kleiner Linux-Server** (eine eigene Domain, etwa `meldungen.beispiel.ch`).

### 6.2 Einrichten (Debian 12 oder Ubuntu 24.04)

```bash
sudo apt install python3 openssl git
sudo adduser --disabled-password lernspiele
sudo -u lernspiele git clone https://github.com/patrikneunteufel/Lernspiele.git /home/lernspiele/Lernspiele
```

Vom eigenen Rechner die Geheimnisse hinüber (nur diese Dateien, nicht das ganze `.entwicklung/`):

```bash
scp entwickler.key .entwicklung/server-privat.pem .entwicklung/geheimnis .entwicklung/zugelassen.json lernspiele@meldungen.beispiel.ch:
```

Auf dem Server einordnen und nur für den Benutzer lesbar machen:

```bash
cd /home/lernspiele/Lernspiele && mkdir -p .entwicklung && mv ~/entwickler.key . && mv ~/server-privat.pem ~/geheimnis ~/zugelassen.json .entwicklung/ && chmod 600 entwickler.key .entwicklung/*
```

### 6.3 https mit Caddy davor (empfohlen)

Caddy holt das Zertifikat von Let's Encrypt selbst und erneuert es. Der Meldungsserver läuft dahinter nur auf
`127.0.0.1`. Voraussetzung: Der Name zeigt auf den Server, Port 80 und 443 sind offen.

Caddy installieren (in Debian 12 und Ubuntu 24.04 als Paket `caddy`, sonst nach caddyserver.com), dann
`/etc/caddy/Caddyfile`:

```
meldungen.beispiel.ch {
	reverse_proxy 127.0.0.1:8443
}
```

Kein `log`-Eintrag: So schreibt auch Caddy kein Zugriffsprotokoll (auf der Datenschutzseite steht, dass der
Meldungsserver keine IP-Adressen speichert). `sudo systemctl reload caddy`.

### 6.4 Als Dienst starten

`/etc/systemd/system/meldungsserver.service`:

```
[Unit]
Description=Meldungsserver Eulenpfad, Lernsteig, Gratwanderung
After=network-online.target

[Service]
User=lernspiele
WorkingDirectory=/home/lernspiele/Lernspiele
ExecStart=/usr/bin/python3 tools/entwickler_server.py 8443 --netz --hinter-proxy
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now meldungsserver
```

`--hinter-proxy` ist hinter Caddy nötig: Sonst kämen alle Meldungen scheinbar von `127.0.0.1`, und die Grenze von 20 je
Stunde gälte für alle zusammen.

**Ohne Caddy** (nur wenn es nicht anders geht): mit einem Zertifikat, etwa von certbot,
`python3 tools/entwickler_server.py 443 --netz --host 0.0.0.0 --zertifikat <fullchain.pem> --zertifikat-schluessel <privkey.pem>`
— braucht Rechte für Port 443 und das Erneuern des Zertifikats von Hand.

### 6.5 Die Apps auf den Server zeigen lassen

1. In `eulenpfad/kontakt.js` und `lernsteig/kontakt.js` bei `server` die Adresse eintragen: `"https://meldungen.beispiel.ch"`.
2. Committen und pushen. Auf der veröffentlichten Seite: Verwaltung → Einstellungen → „Verbindung prüfen“ muss sagen
   „✓ Entwickler-Server 1.0.0 erreichbar: https://meldungen.beispiel.ch, Protokoll 1, Unterschrift der Entwicklung
   geprüft.“
3. Eine Testmeldung schicken und mit `holen` abholen (Abschnitt 6.6).

Einzelne Geräte können unter Einstellungen eine andere Adresse eintragen; angenommen wird nur ein Server, der mit dem
Schlüssel der Entwicklung unterschreibt.

### 6.6 Abgleich (etwa wöchentlich)

```bash
python tools/entwicklung_abgleich.py holen --server https://meldungen.beispiel.ch
```

holt Meldungen, Bemerkungen und eingereichte Vermerke in die lokalen Dateien — erst nachdem der Server seine Unterschrift
gezeigt hat (sonst geht `entwickler.key` nicht hin). Dann:

1. Meldungen bearbeiten: Status und Antwort in `docs/<app>/bemerkungen.json`, `python tools/meldungen_stand.py`.
2. Vermerke übernehmen: `python tools/entwicklung_abgleich.py uebernehmen <app> --reife` und einzeln.
3. Zurück auf den Server: `python tools/entwicklung_abgleich.py senden --server https://meldungen.beispiel.ch`.
4. Committen und pushen (Prüfstand und `meldungen-stand.json` werden veröffentlicht).

### 6.7 Aktualisieren

Server und Apps müssen dieselbe **Protokollnummer** verstehen (`PROTOKOLLE` im Server, `PROTOKOLL` im Kern). Ändert
sich der Austausch, steigt die Nummer; dann zuerst den Server aktualisieren (er darf mehrere verstehen,
`PROTOKOLLE = (1, 2)`), danach die Apps veröffentlichen. Auf dem Server:
`cd /home/lernspiele/Lernspiele && git pull && sudo systemctl restart meldungsserver`. `SERVER_VERSION` folgt den Regeln
des Kerns (klein Fehler, mittel neu, gross Schnittstelle).

### 6.8 Was der Server speichert

Nur in `.entwicklung/daten/<app>/`: die Meldungen (ohne Namen: Klasse, Spiel oder Übung, Stufe, Aufgabe, Eingaben,
Begründung, Versionen), Bemerkungen und eingereichten Vermerke zugelassener Aufsichten (mit deren Namen). Keine
IP-Adressen (kein Protokoll; die Zählung je Absender liegt nur im Arbeitsspeicher und verfällt nach einer Stunde).
Wünscht jemand die Löschung einer Meldung: nach der Kennung (M-…) in der Datei auf dem Server und in
`docs/<app>/bemerkungen.json` suchen und den Eintrag entfernen.

## 7. Fehlersuche

| Meldung in der App oder im Werkzeug | Ursache | Abhilfe |
|---|---|---|
| „Entwickler-Server nicht gefunden … nur im lokalen Repo“ | lokal läuft kein Server | `python tools/entwickler_server.py` |
| „Hier antwortet ein anderer Server ohne Entwickler-Funktionen“ | auf dem Port läuft z. B. `python -m http.server` | den beenden, Entwickler-Server starten, Strg+F5 |
| „Meldungsserver … nicht erreichbar“ | Adresse falsch, Server aus, kein Internet | Adresse prüfen, `systemctl status meldungsserver`, `systemctl status caddy` |
| „weist sich nicht als Server der Entwicklung aus (keine Unterschrift)“ | Server ohne `server-privat.pem` oder ohne openssl | Abschnitt 5 und 6.2 |
| „… (Unterschrift passt nicht)“ | anderes Schlüsselpaar als im Kern, oder alte App | neues Paar verteilt? Seite neu laden |
| „versteht Protokoll …, diese Seite spricht Protokoll …“ | Server und App auf verschiedenem Stand | Abschnitt 6.7 |
| „Ohne Entwickler-Server lässt sich ein persönlicher Schlüssel nicht prüfen“ | Freischalten mit Schlüssel einer Aufsicht, kein Server erreichbar | Server starten oder Adresse eintragen |
| „Zu viele Meldungen in kurzer Zeit“ (429) | mehr als 20 je Stunde vom selben Absender | warten; hinter Caddy ohne `--hinter-proxy` gilt die Grenze für alle |
| Werkzeug: „Im Netz nur über https.“ | `holen --server http://…` im Netz | https-Adresse nehmen |
| Werkzeug: „… weist sich nicht als Server der Entwicklung aus“ | Unterschrift fehlt oder passt nicht | wie oben; `entwickler.key` wurde nicht gesendet |
| „Dieser Schlüssel passt nicht.“ (Eulenpfad) / „Der Schlüssel stimmt nicht.“ (Lernsteig) | Tippfehler, gesperrt, ersetzt (`--neu`) | `--zugelassen` ansehen, neu ausgeben |
