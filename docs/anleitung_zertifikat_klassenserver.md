# Anleitung: Zertifikat für den Klassenserver

Stand: 03.11.2026 (LERN_Session11, Entscheid G10 a) · Für Lehrpersonen und Aufsichten, die einen Klassenserver im
eigenen Netz betreiben ([konzept_gruppen.md](konzept_gruppen.md), Abschnitt 5c). **Der Klassenserver selbst ist noch
nicht gebaut**; diese Anleitung beschreibt den Teil, der davon unabhängig ist.

**Geprüft** am 03.11.2026 unter Windows 11 mit `openssl` 3.2.3 (aus Git for Windows): alle Befehle in Schritt 2 und 3
laufen, `openssl verify` meldet „OK“, ein Server nur mit der Python-Standardbibliothek liefert damit https aus, ein
Client mit der eigenen Zertifizierungsstelle nimmt an, ohne sie lehnt er ab. **Nicht geprüft** sind die Wege in
Schritt 4 auf echten Geräten (iPad, Android, Mac); sie folgen den üblichen Menüs der Hersteller und können je nach
Version anders heissen.

## Worum es geht

Die Verschlüsselung der Gruppendaten braucht im Browser einen sicheren Kontext, also `https://`. Ein Rechner im
Schulnetz hat kein Zertifikat einer öffentlichen Stelle. Deshalb erstellen Sie einmal:

1. eine eigene kleine **Zertifizierungsstelle** (CA) — eine Datei, der die Geräte der Klasse vertrauen, und
2. damit ein **Serverzertifikat** für Ihren Rechner.

Die CA installieren Sie einmal auf jedem Gerät. Danach zeigt der Browser beim Klassenserver kein Warnschild.

> **Zuerst fragen:** Hat die Schul-IT schon ein Zertifikat für das interne Netz (oft bei verwalteten iPads)? Dann
> nehmen Sie das und überspringen diese Anleitung bis auf Schritt 5.

## 1. Vorbereiten

- **openssl:** Unter Windows mit Git for Windows schon da: `C:\Program Files\Git\usr\bin\openssl.exe` (in der „Git
  Bash“ einfach `openssl`). Mac und Linux haben es meist vorinstalliert. Prüfen mit `openssl version`.
- **Feste Adresse des Rechners:** Das Zertifikat nennt den Namen und die IP-Adresse des Servers. Lassen Sie im Router
  bzw. von der Schul-IT eine feste Adresse vergeben (DHCP-Reservierung), sonst passt das Zertifikat nach einem
  Neustart nicht mehr. Die Adresse zeigt unter Windows `ipconfig` (IPv4-Adresse), der Name steht unter
  Einstellungen → System → Info → Gerätename.
- **Ordner:** Legen Sie einen eigenen Ordner an, z. B. `C:\Klassenserver\zertifikat`, und arbeiten Sie darin.

Im Folgenden steht `lehrer-pc` für den Namen und `192.168.1.20` für die Adresse Ihres Rechners — ersetzen Sie beides.

## 2. Eigene Zertifizierungsstelle (einmal, gilt 5 Jahre)

In der Git Bash im Ordner des Zertifikats:

```bash
MSYS_NO_PATHCONV=1 openssl req -x509 -new -nodes -newkey rsa:2048 -keyout eulenpfad-ca.key -sha256 -days 1825 -out eulenpfad-ca.crt -subj "/CN=Eulenpfad Klassen-CA" -addext "basicConstraints=critical,CA:TRUE" -addext "keyUsage=critical,keyCertSign,cRLSign"
```

(`MSYS_NO_PATHCONV=1` verhindert, dass die Git Bash `/CN=…` für einen Pfad hält; unter Mac und Linux weglassen.)

Es entstehen zwei Dateien:

| Datei | was | wohin |
|---|---|---|
| `eulenpfad-ca.crt` | öffentlicher Teil der CA | auf alle Geräte der Klasse (Schritt 4) |
| `eulenpfad-ca.key` | **geheimer Schlüssel** der CA | nur auf Ihrem Rechner, am besten danach auf einen USB-Stick und vom Rechner löschen |

> Wer `eulenpfad-ca.key` hat, kann für jede Website ein Zertifikat ausstellen, dem die Geräte der Klasse vertrauen.
> Geben Sie diese Datei nie weiter, nicht per E-Mail, nicht in einen Cloud-Ordner.

## 3. Serverzertifikat (gilt gut ein Jahr)

Datei `server.ext` im selben Ordner anlegen (Editor, als reiner Text):

```
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = DNS:lehrer-pc, DNS:localhost, IP:192.168.1.20, IP:127.0.0.1
```

Dann:

```bash
MSYS_NO_PATHCONV=1 openssl req -new -nodes -newkey rsa:2048 -keyout server.key -out server.csr -subj "/CN=lehrer-pc"
```

```bash
openssl x509 -req -in server.csr -CA eulenpfad-ca.crt -CAkey eulenpfad-ca.key -CAcreateserial -out server.crt -days 397 -sha256 -extfile server.ext
```

Prüfen:

```bash
openssl verify -CAfile eulenpfad-ca.crt server.crt
```

Erwartet: `server.crt: OK`. Der Klassenserver braucht `server.crt` und `server.key`.

- **397 Tage** und keine längere Gültigkeit: Apple-Geräte nehmen Serverzertifikate mit langer Laufzeit nicht an
  (nach Angabe von Apple höchstens 825 Tage; hier nicht auf einem Gerät geprüft). Erneuern Sie jedes Jahr mit Schritt 3
  — die CA aus Schritt 2 bleibt, auf den Geräten ist nichts neu zu installieren.
- Ändert sich Name oder Adresse des Rechners, `server.ext` anpassen und Schritt 3 wiederholen.

## 4. CA auf den Geräten installieren (einmal je Gerät)

Bringen Sie `eulenpfad-ca.crt` auf das Gerät (E-Mail an die Aufsicht, AirDrop, USB-Stick, Schulplattform — die Datei
ist nicht geheim). **Nicht** `eulenpfad-ca.key`.

**iPad und iPhone** (nicht auf einem Gerät geprüft):
1. Datei antippen → „Profil geladen“.
2. Einstellungen → „Profil geladen“ (oben) → Installieren, Code des Geräts eingeben.
3. Einstellungen → Allgemein → Info → ganz unten **Zertifikatsvertrauenseinstellungen** → „Eulenpfad Klassen-CA“
   einschalten. Ohne diesen Schritt vertraut Safari ihr nicht.
4. Verwaltete Schul-iPads: Die Installation ist oft gesperrt; dann muss die Schul-IT die CA über ihre
   Geräteverwaltung (MDM) verteilen.

**Android** (Menünamen je Hersteller verschieden, nicht geprüft):
Einstellungen → Sicherheit (oder „Sicherheit und Datenschutz“) → Weitere Einstellungen → Verschlüsselung und
Anmeldedaten → Zertifikat installieren → **CA-Zertifikat** → Warnung bestätigen → Datei wählen. Ob Chrome auf Android
einer selbst installierten CA vertraut, ist vor dem ersten Einsatz auf einem Gerät zu prüfen.

**Windows** (Chrome, Edge):
Doppelklick auf `eulenpfad-ca.crt` → Zertifikat installieren → „Lokaler Computer“ → „Alle Zertifikate in folgendem
Speicher speichern“ → Durchsuchen → **Vertrauenswürdige Stammzertifizierungsstellen** → Fertig stellen. Browser neu
starten.

**Firefox** (eigener Speicher, auf jedem Betriebssystem): Einstellungen → Datenschutz & Sicherheit → Zertifikate →
Zertifikate anzeigen → Zertifizierungsstellen → Importieren → „Dieser CA vertrauen, um Websites zu identifizieren“.

**Mac:** Doppelklick → Schlüsselbundverwaltung → Schlüsselbund „System“ → Zertifikat doppelklicken → Vertrauen →
„Immer vertrauen“.

## 5. Prüfen

Mit laufendem Klassenserver auf einem Gerät der Klasse `https://lehrer-pc:<Port>` bzw. `https://192.168.1.20:<Port>`
öffnen: Es darf keine Warnung erscheinen, und das Schloss in der Adresszeile zeigt „Eulenpfad Klassen-CA“ als
Aussteller. Erscheint eine Warnung, fehlt auf dem Gerät Schritt 4 (beim iPad meist Punkt 3) oder Name/Adresse passen
nicht zu `server.ext`.

## 6. Später

- **Jährlich:** Schritt 3 wiederholen (Erinnerung im Kalender, etwa einen Monat vor Ablauf; `openssl x509 -in
  server.crt -noout -enddate` zeigt das Datum).
- **Gerät verloren oder Schlüssel weitergegeben:** neue CA (Schritt 2) und alles neu installieren; die alte CA auf
  den Geräten löschen (dieselben Menüs wie in Schritt 4).
- **Im Internet** statt im Schulnetz (G11, noch nicht entschieden): Dort nimmt man ein Zertifikat einer öffentlichen
  Stelle (z. B. Let's Encrypt) — dann entfällt Schritt 4 auf allen Geräten.
