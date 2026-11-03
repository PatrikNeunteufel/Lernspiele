# Anleitung: Klassenserver im Internet

Stand: 03.11.2026 (LERN_Session11, Entscheid G11) · Für Lehrpersonen und Aufsichten. **Der Klassenserver selbst ist
noch nicht gebaut** ([konzept_gruppen.md](konzept_gruppen.md), Abschnitt 5c); diese Anleitung hilft, den Weg zu
wählen und vorzubereiten. Für den Betrieb nur im Schulnetz gilt
[anleitung_zertifikat_klassenserver.md](anleitung_zertifikat_klassenserver.md).

**Nicht geprüft:** Alles in dieser Anleitung beruht auf allgemeinem Wissen über Router, DynDNS, Let's Encrypt und
Mietserver, nicht auf einem Versuch in diesem Projekt. Menünamen und Preise ändern sich; vor dem Einsatz an einem
echten Anschluss ausprobieren.

## Worum es geht

Im Schulnetz erreichen nur Geräte im selben Netz den Klassenserver. Läuft er im Internet, gleichen die Kinder zu
Hause und in der Schule mit demselben Ort ab, und auch die App auf GitHub Pages darf ihn ansprechen. Was gleich
bleibt, egal welcher Weg:

- Der Server speichert nur **verschlüsselte** Gruppendateien. Den Schlüssel haben nur die Geräte der Gruppe
  (Beitrittscode). Wer den Server betreibt oder hostet, sieht keine Namen und keinen Lernstand.
- Er sieht aber **wann** welches Gerät abgleicht und von welcher Internet-Adresse aus.
- Er braucht ein Zertifikat einer öffentlichen Stelle (Let's Encrypt, kostenlos). Auf den Geräten der Kinder ist dann
  nichts zu installieren.

## Die drei Wege im Vergleich

| | **a — eigenes Gerät mit DynDNS** | **b — gemieteter Server** | **c — Tunnel-Dienst** (nicht empfohlen) |
|---|---|---|---|
| Wo läuft der Server | bei Ihnen: NAS, Raspberry Pi oder ein Rechner, der immer läuft | im Rechenzentrum eines Anbieters (VPS) | bei Ihnen, erreichbar über einen Dienst, der den Verkehr weiterleitet |
| Wer sieht Zugriffszeiten und Adressen | nur Sie | Sie und der Anbieter | Sie und der Tunnel-Dienst |
| Wer leitet den Verkehr | niemand dazwischen | niemand dazwischen | der Tunnel-Dienst (sieht den Verkehr, Inhalte bleiben verschlüsselt) |
| Name im Internet | DynDNS-Name, z. B. vom Router-Hersteller oder einem DynDNS-Dienst | eigene Domain (einige Franken im Jahr) oder Name des Anbieters | Name des Tunnel-Dienstes oder eigene Domain |
| Geht trotz DS-Lite / CGNAT (keine eigene IPv4-Adresse) | **nein** | ja | ja |
| Portfreigabe im Router | ja (443, für Let's Encrypt meist auch 80) | nein | nein |
| Öffnet Ihr Heimnetz | ja, einen Port | nein | nein |
| Immer erreichbar | solange das Gerät läuft und der Anschluss steht | ja | solange Ihr Gerät läuft |
| Laufende Kosten | Strom | einige Franken im Monat | meist keine |
| Pflege | Updates von Gerät und Router | Updates des Servers | Updates von Gerät und Tunnel-Programm |
| Passt zu „ein Ort, den die Aufsicht wählt“ | am genauesten | ja, mit Anbieter in der Schweiz am besten | nur mit Vorbehalt: ein Dritter leitet alles |

**Empfehlung:** a, wenn Ihr Anschluss eine eigene öffentliche Adresse hat und ein Gerät immer läuft; sonst b.
c nur, wenn a und b nicht gehen und Sie dem Tunnel-Dienst vertrauen.

## Vorab: Hat mein Anschluss eine eigene öffentliche Adresse?

1. Im Router die Internet-Adresse (WAN-IPv4) nachsehen.
2. Auf einer Seite wie „Wie ist meine IP?“ die Adresse ansehen, unter der Sie im Internet erscheinen.
3. Sind beide gleich: eigene öffentliche Adresse, Weg a geht. Beginnt die Router-Adresse mit `100.64.` bis `100.127.`,
   `10.`, `192.168.` oder `172.16.`–`172.31.`, oder sind beide verschieden: geteilte Adresse (CGNAT/DS-Lite), Weg a
   geht über IPv4 nicht. Manche Anbieter schalten auf Nachfrage eine eigene Adresse frei.

## Weg a — eigenes Gerät mit DynDNS

1. **Gerät wählen**, das immer läuft: NAS mit Python, Raspberry Pi, alter Rechner. Ein Laptop, der abends zu ist,
   reicht nicht — die Kinder gleichen zu beliebigen Zeiten ab.
2. **Feste Adresse im Heimnetz** für dieses Gerät (DHCP-Reservierung im Router).
3. **DynDNS-Namen einrichten:** Viele Router haben das eingebaut (Menü „DynDNS“ oder „Fernzugang“); sonst ein
   DynDNS-Dienst mit kleinem Programm auf dem Gerät. Ergebnis: ein Name wie `klasse4b.beispiel-dyndns.net`, der
   immer auf Ihren Anschluss zeigt.
4. **Portfreigabe:** im Router Port 443 (und für die Zertifikatsprüfung meist 80) auf das Gerät weiterleiten — nur
   diese Ports, sonst nichts.
5. **Zertifikat von Let's Encrypt** für den DynDNS-Namen, mit einem ACME-Programm (z. B. certbot) auf dem Gerät; es
   erneuert sich alle 90 Tage selbst, wenn es so eingerichtet ist.
6. **Klassenserver starten** mit diesem Zertifikat (sobald er gebaut ist; Startbefehl folgt mit dem Bau).
7. **Prüfen:** Von einem Handy **ohne** WLAN (mobile Daten) `https://<Ihr Name>` öffnen — kein Warnschild.

## Weg b — gemieteter Server

1. **Anbieter wählen**, am besten mit Rechenzentrum in der Schweiz; ein kleiner VPS mit Linux genügt.
2. **Name:** eine eigene Domain kaufen und auf die Adresse des Servers zeigen lassen, oder den Namen nehmen, den der
   Anbieter vergibt.
3. **Server absichern:** Updates einschalten, Anmeldung nur mit Schlüssel, Firewall nur für 443 (und 80 für Let's
   Encrypt) und SSH.
4. **Python** ist auf Linux meist schon da; der Klassenserver braucht nur die Standardbibliothek.
5. **Zertifikat** von Let's Encrypt wie in Weg a, Schritt 5.
6. **Klassenserver starten** und wie in Weg a, Schritt 7, prüfen.

## Weg c — Tunnel-Dienst (der Vollständigkeit halber)

Ein Programm auf Ihrem Gerät baut eine Verbindung **nach aussen** zum Tunnel-Dienst auf; der Dienst nimmt die Anfragen
aus dem Internet an und reicht sie durch. So braucht es weder eigene Adresse noch Portfreigabe. Dafür läuft der
ganze Verkehr über einen Dritten: Er sieht, wer wann abgleicht, und könnte den Dienst jederzeit ändern oder einstellen.
Die Inhalte bleiben verschlüsselt (der Schlüssel liegt nur in den Geräten der Gruppe). **Abgeraten**, weil gerade
diese Art Beteiligter vermieden werden soll; nur, wenn a und b nicht gehen.

Ablauf grob: Konto beim Dienst, Tunnel-Programm auf dem Gerät installieren, Tunnel auf den lokalen Port des
Klassenservers zeigen lassen, den Namen des Tunnels in der Klasse eintragen.

## Für alle Wege

- **Nur die Ablage:** Der Klassenserver liefert die verschlüsselten Gruppendateien und, wenn gewünscht, die App selbst
  aus — keine anderen Dienste auf demselben Gerät freigeben.
- **Schreiben nur mit Gruppengeheimnis:** Der Server nimmt eine Datei nur an, wenn sie das Geheimnis aus dem
  Beitrittscode trägt (Entscheid G9 a); wer die Adresse kennt, kann sonst nichts ablegen.
- **Adresse in der Klasse:** Die Lehrperson trägt die Adresse in der Gruppe ein; sie reist im QR-Code des
  Beitrittscodes mit.
- **Sichern:** Die Lehrperson sichert die Klasse weiterhin als Datei; der Server ist Ort zum Abgleichen, kein Archiv.
