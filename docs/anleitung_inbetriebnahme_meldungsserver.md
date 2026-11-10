# Inbetriebnahme: Meldungsserver zu Hause

Stand: 10.11.2026 (LERN_Session27, Plan C12) · Schritt für Schritt zum Abhaken. Hintergrund und Einzelheiten:
[anleitung_entwickler_server.md](anleitung_entwickler_server.md).

**Nicht geprüft:** Router-Menüs, DynDNS-Dienste und Paketnamen beruhen auf allgemeinem Wissen, nicht auf einem Versuch
in diesem Projekt; sie heissen je nach Gerät und Anbieter anders. Wenn ein Schritt nicht passt: dort anhalten, nichts
erzwingen — die Apps schicken Meldungen bis dahin weiter per E-Mail.

**Rückfall jederzeit:** Steht in `kontakt.js` kein Server (`server: ""`), gehen Meldungen per E-Mail oder als Text. Nichts
geht verloren, wenn der Server einmal nicht läuft.

---

## Teil A — am Arbeitsrechner (Windows, im Repo)

- [ ] **A1 Schlüssel der Entwicklung vorhanden:** `entwickler.key` liegt in der Repo-Wurzel. Sonst:
  `python tools/entwickler_server.py --neuer-schluessel`, dann `kern/VERSION` erhöhen und `python tools/kern_verteilen.py`.
- [ ] **A2 Schlüsselpaar erzeugen:** `python tools/entwickler_server.py --neues-schluesselpaar`
  → schreibt `.entwicklung/server-privat.pem` und `SERVER_SCHLUESSEL` in `kern/entwicklung.js`.
- [ ] **A3 Verteilen und prüfen:** `kern/VERSION` mittlere Zahl erhöhen (z. B. 1.39.0 → 1.40.0),
  `python tools/kern_verteilen.py`, `node tools/pruefe.js`.
- [ ] **A4 Committen und pushen.** Erst die veröffentlichte Seite kennt den öffentlichen Schlüssel.
- [ ] **A5 Sichern:** `entwickler.key` und den Ordner `.entwicklung/` auf einen USB-Stick (oder in den Passwort-Manager).
  Nicht in eine Cloud-Sicherung des Repos.

## Teil B — Anschluss und Name klären (einmal)

- [ ] **B1 Eigene öffentliche Adresse?** In der Oberfläche des Routers die Internet-Adresse (WAN, IPv4) ablesen und mit der
  Adresse vergleichen, die eine Seite wie „Wie ist meine IP“ anzeigt. **Gleich** → weiter. **Verschieden** oder der Router
  nennt „DS-Lite“ / „CGNAT“ → zu Hause geht es nicht direkt; dann einen kleinen Mietserver nehmen
  ([anleitung_klassenserver_internet.md](anleitung_klassenserver_internet.md), Weg b) und ab Teil C dort weitermachen
  (ohne Teil B2–B4).
- [ ] **B2 Name im Internet:** Im Router unter „DynDNS“ einen Namen einrichten (manche Router-Hersteller bieten einen
  eigenen), oder bei einem DynDNS-Dienst. Ergebnis: ein Name wie `meldungen-xyz.<dienst>` oder mit eigener Domain
  `meldungen.<ihre-domain>.ch`. Diesen Namen unten überall statt `meldungen.beispiel.ch` einsetzen.
- [ ] **B3 Gerät mit fester Adresse im Heimnetz:** Im Router dem Server-Gerät immer dieselbe interne Adresse geben
  („feste IP“ / „DHCP-Reservierung“), z. B. `192.168.1.50`.
- [ ] **B4 Portfreigabe:** Im Router TCP **80** und **443** auf diese interne Adresse weiterleiten. (80 braucht Let's
  Encrypt zum Ausstellen des Zertifikats, 443 ist https.) Sonst keine Ports öffnen.

## Teil C — Server-Gerät einrichten

### Variante Linux (Raspberry Pi mit Raspberry Pi OS, oder ein Rechner mit Debian 12 / Ubuntu 24.04) — empfohlen

- [ ] **C1 Grundsystem aktuell:** `sudo apt update && sudo apt full-upgrade`
- [ ] **C2 Programme:** `sudo apt install python3 openssl git caddy`
  (fehlt `caddy` im Paketbestand: nach der Anleitung auf caddyserver.com installieren). `python3 --version` muss 3.10
  oder neuer zeigen.
- [ ] **C3 Benutzer und Repo:**
  ```bash
  sudo adduser --disabled-password lernspiele
  sudo -u lernspiele git clone https://github.com/patrikneunteufel/Lernspiele.git /home/lernspiele/Lernspiele
  ```
- [ ] **C4 Geheimnisse vom Arbeitsrechner hinüber** (in der Windows-Eingabeaufforderung im Repo; `scp` ist in Windows 10/11
  dabei). Vorher dem Benutzer `lernspiele` ein Passwort oder einen SSH-Schlüssel geben, oder die Dateien per USB-Stick
  bringen:
  ```bash
  scp entwickler.key .entwicklung/server-privat.pem .entwicklung/geheimnis .entwicklung/zugelassen.json lernspiele@192.168.1.50:
  ```
  `geheimnis` und `zugelassen.json` gibt es erst, wenn schon jemand zugelassen wurde — sonst weglassen.
- [ ] **C5 Einordnen und schützen** (auf dem Server als `lernspiele`):
  ```bash
  cd /home/lernspiele/Lernspiele && mkdir -p .entwicklung && mv ~/entwickler.key . && mv ~/server-privat.pem ~/geheimnis ~/zugelassen.json .entwicklung/ 2>/dev/null; chmod 600 entwickler.key .entwicklung/*
  ```
- [ ] **C6 Kurz von Hand starten und prüfen:**
  `python3 tools/entwickler_server.py 8443 --netz --hinter-proxy` → muss „Meldungsserver im Netz läuft auf
  127.0.0.1:8443 …“ zeigen, **ohne** den Hinweis „kein Schlüsselpaar“. In einem zweiten Fenster:
  `curl "http://127.0.0.1:8443/entwicklung/status?zufall=00112233445566778899aabbccddeeff"` → JSON mit `"server"`,
  `"protokoll"` und `"unterschrift"`. Dann mit Strg+C beenden.
- [ ] **C7 Caddy:** `/etc/caddy/Caddyfile` ersetzen durch
  ```
  meldungen.beispiel.ch {
  	reverse_proxy 127.0.0.1:8443
  }
  ```
  (ohne `log` — kein Zugriffsprotokoll), dann `sudo systemctl reload caddy`. `sudo journalctl -u caddy -n 50` zeigt, ob
  das Zertifikat geholt wurde.
- [ ] **C8 Als Dienst:** Datei `/etc/systemd/system/meldungsserver.service` mit dem Inhalt aus
  [anleitung_entwickler_server.md](anleitung_entwickler_server.md) Abschnitt 6.4, dann
  `sudo systemctl daemon-reload && sudo systemctl enable --now meldungsserver` und
  `systemctl status meldungsserver` → „active (running)“.
- [ ] **C9 Neustart überlebt?** `sudo reboot`, danach `systemctl status meldungsserver caddy`.

### Variante Windows-PC (nur, wenn kein Linux-Gerät da ist)

- Der PC muss immer laufen: Energiesparen und Ruhezustand ausschalten.
- Python 3.10+ und Git for Windows installieren (bringt `openssl`), Repo klonen, Geheimnisse wie in C4/C5 in die
  Repo-Wurzel und nach `.entwicklung\` legen.
- Caddy für Windows von caddyserver.com (eine `caddy.exe`), Caddyfile wie in C7 daneben.
- In der Windows-Firewall eingehend TCP 80 und 443 für `caddy.exe` erlauben, **nicht** für Python (der Server hört nur
  auf 127.0.0.1).
- Beide Programme in der Aufgabenplanung „beim Systemstart“ starten:
  `python tools\entwickler_server.py 8443 --netz --hinter-proxy` (Startverzeichnis: Repo) und
  `caddy run --config Caddyfile` (Startverzeichnis: Ordner von Caddy).

## Teil D — von aussen prüfen

- [ ] **D1 Vom Handy über Mobilfunk (WLAN aus):** `https://meldungen.beispiel.ch/entwicklung/status` öffnen → Text mit
  `"ok": true` und `"server": "1.0.0"`. Kein Zertifikatsfehler.
- [ ] **D2 Keine Repo-Dateien:** `https://meldungen.beispiel.ch/eulenpfad/index.html` → „nicht vorhanden“.

## Teil E — die Apps umstellen (am Arbeitsrechner)

- [ ] **E1 Adresse eintragen:** in `eulenpfad/kontakt.js` und `lernsteig/kontakt.js` bei `server`:
  `"https://meldungen.beispiel.ch"`.
- [ ] **E2 App-Versionen** in `eulenpfad/VERSION` und `lernsteig/VERSION` um die kleine Zahl erhöhen (z. B. 1.0.0 → 1.0.1),
  `python tools/kern_verteilen.py`, `node tools/pruefe.js`, committen, pushen.
- [ ] **E3 Auf der veröffentlichten Seite** (Eulenpfad und Lernsteig): Verwaltung → Einstellungen → „Meldungen an die
  Entwicklung“ → „Verbindung prüfen“ (Feld leer lassen = Vorgabe) → muss lauten:
  „✓ Entwickler-Server 1.0.0 erreichbar: https://meldungen.beispiel.ch, Protokoll 1, Unterschrift der Entwicklung
  geprüft.“ Steht dort „weist sich nicht … aus“: Teil A4 schon veröffentlicht? Seite mit Strg+F5 neu laden.

## Teil F — eine Meldung von Anfang bis Ende

- [ ] **F1 Melden:** Im Eulenpfad mit einem Test-Kind ein Spiel spielen, eine Aufgabe melden. Als Aufsicht unter
  Verwaltung → Meldungen bestätigen und weiterleiten → Vermerk „Bemerkung Nr. …“ (nicht „per E-Mail“).
- [ ] **F2 Holen:** am Arbeitsrechner
  `python tools/entwicklung_abgleich.py holen --server https://meldungen.beispiel.ch` → „eulenpfad: holen — 1
  Bemerkung(en) …“. Die Meldung steht in `docs/eulenpfad/bemerkungen.json` (mit `quelle` und `server_nr`).
- [ ] **F3 Antworten:** dort `"status": "erledigt 10.11.2026"` und `"antwort": "Danke, das war ein Test."` setzen,
  `python tools/meldungen_stand.py`, dann
  `python tools/entwicklung_abgleich.py senden --server https://meldungen.beispiel.ch`, committen, pushen.
- [ ] **F4 Antwort ankommen lassen:** in der App unter Verwaltung → Meldungen „Antworten abfragen“ → die Antwort erscheint.
- [ ] **F5 Aufräumen:** die Testmeldung in `docs/eulenpfad/bemerkungen.json` und auf dem Server in
  `.entwicklung/daten/eulenpfad/bemerkungen.json` löschen, Test-Kind in der App löschen, `meldungen_stand.py`, pushen.

## Teil G — im Betrieb

- **Wöchentlich:** `holen`, bearbeiten, `uebernehmen`, `meldungen_stand.py`, `senden`, pushen
  ([anleitung_entwickler_server.md](anleitung_entwickler_server.md) 6.6).
- **Monatlich:** auf dem Server `sudo apt update && sudo apt full-upgrade`; `cd ~/Lernspiele && git pull && sudo
  systemctl restart meldungsserver`.
- **Sichern:** `.entwicklung/` des Servers (vor allem `daten/`, `geheimnis`, `zugelassen.json`) gelegentlich holen.
- **Neue Aufsicht zulassen:** jetzt **auf dem Server**:
  `python3 tools/entwickler_server.py --zulassen "Vorname Name" person@schule.ch`.
- **Etwas stimmt nicht:** Fehlersuche in [anleitung_entwickler_server.md](anleitung_entwickler_server.md) Abschnitt 7;
  im Notfall `server: ""` in `kontakt.js` und pushen — dann gehen Meldungen wieder per E-Mail.
