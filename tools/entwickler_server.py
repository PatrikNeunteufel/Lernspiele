"""Entwickler-Server der Reihe (Entscheide E1 a, E2 a, LERN_Session6; für alle Apps seit LERN_Session16, Plan C6).

Liefert das Repo aus wie `python -m http.server` und nimmt zusätzlich Änderungen am Prüfstand und an den
Entwickler-Bemerkungen der App an, die die Anfrage nennt (`app`, Standard eulenpfad; Dateien in APPS).
Geschrieben wird nur mit dem Schlüssel aus `entwickler.key` (Repo-Wurzel, von Git ausgeschlossen); im Repo
steht nur sein Hash (kern/entwicklung.js, verteilt in die Kopien <app>/kern/kern.js).

Aufruf (aus beliebigem Ordner):
    python tools/entwickler_server.py              Server auf http://localhost:8765/ (Wurzel → portal/)
    python tools/entwickler_server.py 8770         anderer Port
    python tools/entwickler_server.py --oeffnen    zusätzlich die Einstiegsseite im Browser öffnen (SV1 a)
    python tools/entwickler_server.py --neuer-schluessel   Schlüssel neu erzeugen, Hash eintragen
    python tools/entwickler_server.py --herkunft https://beispiel.ch   eine weitere Seite darf anfragen (mehrfach möglich)
    python tools/entwickler_server.py --zulassen "Vorname Name" person@schule.ch [--neu]   Aufsicht zulassen, Schlüssel ausgeben
    python tools/entwickler_server.py --sperren "Vorname Name"     Schlüssel einer Aufsicht sperren
    python tools/entwickler_server.py --zugelassen                 zugelassene Aufsichten auflisten
    python tools/entwickler_server.py --neues-schluesselpaar       Schlüsselpaar für die Unterschrift des Servers (NS2 a)
    python tools/entwickler_server.py 8443 --netz [--host 0.0.0.0] [--zertifikat cert.pem --zertifikat-schluessel key.pem]
                                      Meldungsserver im Netz (NS1 a): keine Repo-Dateien, Ablage .entwicklung/daten/

Zugelassene Aufsichten (Plan C12, ES1 a bis ES5 a, LERN_Session27): Wer prüfen will, fordert per E-Mail an; die
Entwicklung lässt mit --zulassen zu und schickt den ausgegebenen Schlüssel an die anfragende Adresse. Mit ihm schaltet
die Aufsicht den Entwickler-Modus frei (/entwicklung/freischalten). Ihre Prüfvermerke gehen in
docs/<app>/pruefstand-eingang.json und wirken erst, wenn die Entwicklung sie übernimmt (docs/richtlinie_freigaben.md);
den Status von Bemerkungen setzt nur die Entwicklung. Geheimnis und Liste liegen in .entwicklung/ (gitignored).

Andere Seiten (C11-3 a, LERN_Session25): Eine App, die nicht von diesem Server kommt — etwa die veröffentlichte Seite oder
eine Vorschau auf einem anderen Port —, darf ihn für Meldungen und Entwicklung ansprechen (CORS), aber nur von einer
erlaubten Herkunft: localhost und 127.0.0.1 mit beliebigem Port, die veröffentlichte Seite (HERKUNFT_FEST) und was
--herkunft nennt. Der Server hört weiterhin nur auf 127.0.0.1; geschrieben wird nur mit dem Schlüssel.

Versionen (Plan C12, NS3 a, LERN_Session27): /entwicklung/status nennt SERVER_VERSION und die verstandenen Protokolle
(PROTOKOLLE, wie PROTOKOLL in kern/entwicklung.js). Eine Anfrage mit einem anderen Protokoll wird abgewiesen (409);
eine ohne Angabe (Seiten vor LERN_Session27) gilt als Protokoll 1. Bemerkungen merken die Fassung der Meldung und die
Versionen der sendenden Seite.
"""
import base64
import datetime
import hashlib
import hmac
import http.server
import mimetypes
import json
import re
import secrets
import shutil
import socket
import subprocess
import sys
import webbrowser

# Bilder der Anleitungen (WebP): Windows kennt den Typ nicht immer, sonst kommt application/octet-stream
mimetypes.add_type("image/webp", ".webp")
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
SCHLUESSEL_DATEI = WURZEL / "entwickler.key"
ENTWICKLUNG_JS = WURZEL / "kern" / "entwicklung.js"
SALZ = "eulenpfad-entwickler:"  # wie in kern/entwicklung.js (SALZ + ":")
SERVER_VERSION = "1.0.0"  # Regeln wie beim Kern: klein Fehler, mittel neu, gross Schnittstelle (NS3 a)
PROTOKOLLE = (1, 1)  # verstandene Protokolle von … bis (kern/entwicklung.js PROTOKOLL)

# Je App: Prüfstand (Datei, Name der Konstante, Kopf und Fuss beim Schreiben, Bereiche), Bemerkungen, Haken je Eintrag.
APPS = {
    "eulenpfad": {
        "pruefstand": WURZEL / "eulenpfad" / "spiele" / "gemeinsam" / "pruefstand.js",
        "name": "PRUEFSTAND",
        "kopf": ("/* Prüfstand (Entscheid E1 a, LERN_Session6): welche Spiele angesehen und welche Inhaltslisten geprüft\n"
                 "   sind, je { am, von }. Schlüssel: Spiel-Id bzw. \"<spiel>/<liste>\" der Quelle einer Liste.\n"
                 "   Geschrieben vom Entwickler-Server (tools/entwickler_server.py) — nicht von Hand ändern. */\n"),
        "fuss": "",
        "arten": ("spiele", "listen"),
        "bemerkungen": WURZEL / "docs" / "eulenpfad" / "bemerkungen.json",
        "eintraege": WURZEL / "eulenpfad" / "spiele" / "gemeinsam" / "pruefstand-eintraege.json",
        "eingang": WURZEL / "docs" / "eulenpfad" / "pruefstand-eingang.json",  # Vermerke zugelassener Aufsichten (ES3 a)
        "start": "eulenpfad/",
    },
    "lernsteig": {
        "pruefstand": WURZEL / "lernsteig" / "gemeinsam" / "pruefstand.js",
        "name": "LST_PRUEFSTAND",
        "kopf": ("/* Prüfstand des Lernsteigs (Entscheide FG1 a, A1 a, LERN_Session15): was im Repo angesehen bzw. geprüft ist.\n"
                 "   Eine Übung mit `neu` im Katalog ist gesperrt, bis sie hier unter `uebungen` steht (auf Desktop, Tablet und Handy\n"
                 "   durchgespielt); eine Übung mit Inhaltslisten braucht dazu mindestens eine geprüfte Liste unter `listen`\n"
                 "   (\"<übung>/<liste>\"). Einträge: { am: \"JJJJ-MM-TT\", von: \"<Name>\" }. Gleiches Prinzip wie im Eulenpfad\n"
                 "   (docs/eulenpfad/rahmen.md 6). Geschrieben vom Entwickler-Server (tools/entwickler_server.py) — nicht von Hand\n"
                 "   ändern. */\n\"use strict\";\n\n"),
        "fuss": "\nif (typeof module !== \"undefined\") module.exports = LST_PRUEFSTAND;\n",
        "arten": ("uebungen", "listen"),
        "bemerkungen": WURZEL / "docs" / "lernsteig" / "bemerkungen.json",
        "eintraege": WURZEL / "lernsteig" / "gemeinsam" / "pruefstand-eintraege.json",
        "eingang": WURZEL / "docs" / "lernsteig" / "pruefstand-eingang.json",
        "start": "lernsteig/",
    },
}


def schluessel_hash(schluessel: str) -> str:
    return hashlib.sha256((SALZ + schluessel).encode("utf-8")).hexdigest()


def neuer_schluessel() -> None:
    """Schlüssel erzeugen, in entwickler.key schreiben und den Hash in entwicklung.js eintragen."""
    schluessel = secrets.token_hex(16)
    SCHLUESSEL_DATEI.write_text(schluessel + "\n", encoding="utf-8")
    text = ENTWICKLUNG_JS.read_text(encoding="utf-8")
    neu, n = re.subn(r'const SCHLUESSEL_HASH = "[0-9a-f]*";', f'const SCHLUESSEL_HASH = "{schluessel_hash(schluessel)}";', text)
    if n != 1:
        sys.exit("SCHLUESSEL_HASH in entwicklung.js nicht genau einmal gefunden.")
    ENTWICKLUNG_JS.write_bytes(neu.encode("utf-8"))
    print(f"Neuer Schlüssel in {SCHLUESSEL_DATEI.name}, Hash in kern/entwicklung.js eingetragen.\n"
          "Jetzt die Version in kern/VERSION erhöhen und verteilen: python tools/kern_verteilen.py")


# ----- Zugelassene Aufsichten (Plan C12, ES1 a, ES2 a, LERN_Session27) -----
# Der Schlüssel einer Aufsicht ist HMAC-SHA-256 aus Name, E-Mail und einem Zähler mit dem Geheimnis des Servers: Wer Name
# und E-Mail kennt, kann ihn ohne das Geheimnis nicht ausrechnen; dieselben Angaben ergeben wieder denselben Schlüssel.
# Gespeichert werden nur Name, Hash des Schlüssels, Datum, Zähler und „gesperrt“ — keine E-Mail-Adresse (ES2 a).
ENTWICKLUNG_ORDNER = WURZEL / ".entwicklung"  # gitignored


def geheimnis() -> bytes:
    """Geheimnis des Servers (.entwicklung/geheimnis), beim ersten Gebrauch erzeugt. Geht es verloren, gelten alle
    Schlüssel der Aufsichten nicht mehr (neu ausgeben mit --zulassen … --neu)."""
    pfad = ENTWICKLUNG_ORDNER / "geheimnis"
    if not pfad.exists():
        pfad.parent.mkdir(parents=True, exist_ok=True)
        pfad.write_text(secrets.token_hex(32) + "\n", encoding="utf-8")
    return bytes.fromhex(pfad.read_text(encoding="utf-8").strip())


def normiere_schluessel(s) -> str:
    """Gross, ohne Leerzeichen und Bindestriche — so tippt man ihn auch klein oder ohne Gruppen ein."""
    return re.sub(r"[\s-]", "", str(s or "")).upper()


def aufsicht_schluessel(name: str, email: str, zaehler: int) -> str:
    roh = hmac.new(geheimnis(), f"{name.strip()}|{email.strip().lower()}|{zaehler}".encode("utf-8"), hashlib.sha256).digest()
    t = base64.b32encode(roh).decode("ascii")[:20]
    return "-".join(t[i:i + 5] for i in range(0, 20, 5))


def aufsicht_hash(schluessel: str) -> str:
    return hashlib.sha256(normiere_schluessel(schluessel).encode("utf-8")).hexdigest()


def lies_zugelassen() -> list:
    pfad = ENTWICKLUNG_ORDNER / "zugelassen.json"
    return json.loads(pfad.read_text(encoding="utf-8")) if pfad.exists() else []


def schreibe_zugelassen(liste: list) -> None:
    ENTWICKLUNG_ORDNER.mkdir(parents=True, exist_ok=True)
    (ENTWICKLUNG_ORDNER / "zugelassen.json").write_bytes((json.dumps(liste, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))


def zulassen(name: str, email: str, neu: bool = False) -> str:
    """Aufsicht zulassen und ihren Schlüssel zurückgeben; schon zugelassen nur mit neu (ersetzt den alten Schlüssel)."""
    name = name.strip()
    if not name or "@" not in email:
        raise ValueError("Name und E-Mail-Adresse angeben: --zulassen \"Vorname Name\" person@beispiel.ch")
    liste = lies_zugelassen()
    alt = next((z for z in liste if z["name"] == name), None)
    if alt and not neu:
        raise ValueError(f"{name} ist schon zugelassen. Einen neuen Schlüssel gibt --neu (der alte gilt dann nicht mehr).")
    zaehler = alt["zaehler"] + 1 if alt else 1
    schluessel = aufsicht_schluessel(name, email, zaehler)
    eintrag = {"name": name, "hash": aufsicht_hash(schluessel), "am": datetime.date.today().isoformat(), "zaehler": zaehler,
               "gesperrt": False}
    schreibe_zugelassen([z for z in liste if z["name"] != name] + [eintrag])
    return schluessel


def sperre_aufsicht(name: str) -> bool:
    liste = lies_zugelassen()
    z = next((z for z in liste if z["name"] == name.strip()), None)
    if not z:
        return False
    z["gesperrt"] = True
    schreibe_zugelassen(liste)
    return True


def wer(schluessel) -> tuple | None:
    """("entwicklung", None) für entwickler.key, ("aufsicht", Name) für eine zugelassene, nicht gesperrte Aufsicht."""
    s = str(schluessel or "").strip()
    if not s:
        return None
    if SCHLUESSEL_DATEI.exists() and hmac.compare_digest(s, SCHLUESSEL_DATEI.read_text(encoding="utf-8").strip()):
        return ("entwicklung", None)
    h = aufsicht_hash(s)
    z = next((z for z in lies_zugelassen() if hmac.compare_digest(z["hash"], h)), None)
    return ("aufsicht", z["name"]) if z and not z.get("gesperrt") else None


# ----- Unterschrift des Servers (Plan C12, NS2 a, NS2-K a, LERN_Session27) -----
# Die App schickt eine Zufallszahl (/entwicklung/status?zufall=…); der Server unterschreibt „lernspiele-entwicklung|<zufall>|
# <Version>“ mit seinem privaten ECDSA-P-256-Schlüssel (.entwicklung/server-privat.pem), die App prüft mit WebCrypto gegen
# SERVER_SCHLUESSEL in kern/entwicklung.js. Unterschrieben wird mit openssl (die Standardbibliothek hat kein ECDSA).
UNTERSCHRIFT_ZWECK = "lernspiele-entwicklung"
OPENSSL_ORTE = [r"C:\Program Files\Git\mingw64\bin\openssl.exe", r"C:\Program Files\Git\usr\bin\openssl.exe",
                "/usr/bin/openssl", "/usr/local/bin/openssl"]


def privat_datei() -> Path:
    return ENTWICKLUNG_ORDNER / "server-privat.pem"


def openssl() -> str | None:
    """Pfad zu openssl: im PATH, sonst an den üblichen Orten (Git for Windows, Linux)."""
    return shutil.which("openssl") or next((p for p in OPENSSL_ORTE if Path(p).exists()), None)


def unterschrift_text(zufall: str) -> bytes:
    return f"{UNTERSCHRIFT_ZWECK}|{zufall}|{SERVER_VERSION}".encode("utf-8")


def der_zu_roh(der: bytes) -> bytes:
    """ECDSA-Unterschrift von openssl (DER: SEQUENCE aus zwei INTEGER) in r‖s mit je 32 Byte, wie WebCrypto sie prüft."""
    if len(der) < 8 or der[0] != 0x30:
        raise ValueError("keine DER-Unterschrift")
    i = 2 if der[1] < 0x80 else 2 + (der[1] & 0x7F)
    teile = []
    for _ in range(2):
        if der[i] != 0x02:
            raise ValueError("DER: INTEGER erwartet")
        n = der[i + 1]
        zahl = der[i + 2:i + 2 + n].lstrip(b"\x00")
        if len(zahl) > 32:
            raise ValueError("DER: Zahl zu lang für P-256")
        teile.append(zahl.rjust(32, b"\x00"))
        i += 2 + n
    return teile[0] + teile[1]


def unterschreibe(zufall: str) -> str | None:
    """Base64 der Unterschrift (r‖s) oder None ohne Schlüsselpaar oder ohne openssl."""
    prog = openssl()
    if not prog or not privat_datei().exists():
        return None
    r = subprocess.run([prog, "dgst", "-sha256", "-sign", str(privat_datei())], input=unterschrift_text(zufall),
                       capture_output=True, timeout=10)
    if r.returncode != 0:
        return None
    return base64.b64encode(der_zu_roh(r.stdout)).decode("ascii")


def oeffentlich_b64() -> str:
    """Öffentlicher Schlüssel als SPKI (DER) in Base64 — so importiert ihn WebCrypto („spki“)."""
    r = subprocess.run([openssl(), "ec", "-in", str(privat_datei()), "-pubout", "-outform", "DER"], capture_output=True, timeout=10)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.decode("utf-8", "replace"))
    return base64.b64encode(r.stdout).decode("ascii")


def neues_schluesselpaar(eintragen: Path | None = ENTWICKLUNG_JS) -> str:
    """Schlüsselpaar erzeugen (.entwicklung/server-privat.pem, gitignored) und den öffentlichen Schlüssel in
    kern/entwicklung.js eintragen (eintragen=None: nur zurückgeben, für Tests). Ein neues Paar macht alte Apps blind
    für diesen Server, bis die neue Kern-Kopie verteilt und veröffentlicht ist."""
    prog = openssl()
    if not prog:
        raise RuntimeError("openssl nicht gefunden (Git for Windows bringt es mit; unter Linux: Paket openssl)")
    ENTWICKLUNG_ORDNER.mkdir(parents=True, exist_ok=True)
    r = subprocess.run([prog, "ecparam", "-name", "prime256v1", "-genkey", "-noout", "-out", str(privat_datei())],
                       capture_output=True, timeout=20)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.decode("utf-8", "replace"))
    oeff = oeffentlich_b64()
    if eintragen:
        text = eintragen.read_text(encoding="utf-8")
        neu, n = re.subn(r'const SERVER_SCHLUESSEL = "[A-Za-z0-9+/=]*";', f'const SERVER_SCHLUESSEL = "{oeff}";', text)
        if n != 1:
            raise RuntimeError("SERVER_SCHLUESSEL in kern/entwicklung.js nicht genau einmal gefunden.")
        eintragen.write_bytes(neu.encode("utf-8"))
    return oeff


# ----- Betrieb im Netz (Plan C12, NS1 a, LERN_Session27) -----
# Mit --netz liefert der Server kein Repo aus, schreibt keinen Prüfstand und keine Datei im Repo, sondern nur in
# .entwicklung/daten/<app>/ (Meldungen, Bemerkungen, eingereichte Vermerke); er protokolliert keine Anfragen (keine
# IP-Adressen). Meldungen nimmt er von allen an (ohne Schlüssel, mit Grenze je Absender), Vermerke nur von
# zugelassenen Aufsichten, holen und senden nur mit dem Schlüssel der Entwicklung (tools/entwicklung_abgleich.py).
NETZ = False
MELDUNGEN_JE_STUNDE = 20  # je Absender (IP-Adresse, nur im Arbeitsspeicher für diese Zählung, nie gespeichert)
_meldezeiten: dict = {}
MELDUNG_KENNUNG = re.compile(r"^M-[a-z0-9]{4,16}-[a-z0-9]{2,8}$")


def netz_pfade() -> None:
    """Ablagen im Netz-Betrieb: nichts im Repo, alles unter .entwicklung/daten/<app>/ (gitignored)."""
    for app, a in APPS.items():
        ordner = ENTWICKLUNG_ORDNER / "daten" / app
        for feld in ("bemerkungen", "eingang"):
            a[feld] = ordner / Path(a[feld]).name


def zu_viele_meldungen(absender: str) -> bool:
    """Grenze je Absender und Stunde; die Zeiten liegen nur im Arbeitsspeicher."""
    jetzt = datetime.datetime.now().timestamp()
    zeiten = [t for t in _meldezeiten.get(absender, []) if jetzt - t < 3600]
    if len(zeiten) >= MELDUNGEN_JE_STUNDE:
        _meldezeiten[absender] = zeiten
        return True
    _meldezeiten[absender] = zeiten + [jetzt]
    return False


def speichere_bemerkung(a: dict, daten: dict, jetzt: str) -> tuple:
    """Bemerkung oder Meldung in docs/<app>/bemerkungen.json (im Netz: .entwicklung/daten/<app>/); eine Meldung (Kennung
    „meldung“) nur einmal. → (Status, Antwort)."""
    text = str(daten.get("text", "")).strip()
    if not text:
        return 400, {"fehler": "Bemerkung ist leer"}
    liste = lies_bemerkungen(a)
    schon = next((b for b in liste if daten.get("meldung") and b.get("meldung") == daten.get("meldung")), None)
    if schon:
        return 200, schon
    eintrag = {"nr": max((b["nr"] for b in liste), default=0) + 1, "zeit": jetzt, "status": "offen", "text": text[:2000]}
    for feld in ("von", "spiel", "inhalt", "stufe", "liste", "eintrag", "schluessel", "aufgabe", "seite", "meldung", "fassung"):
        if daten.get(feld):
            eintrag[feld] = str(daten[feld])[:500]
    # Versionen der sendenden Seite (NS3 a); „fassung“ ist die der Meldung, als sie entstand
    v = daten.get("versionen")
    if isinstance(v, dict) and (v.get("app") or v.get("kern")):
        eintrag["gesendet_mit"] = {k: str(v[k])[:20] for k in ("app", "kern", "protokoll") if v.get(k) not in (None, "")}
    liste.append(eintrag)
    a["bemerkungen"].parent.mkdir(parents=True, exist_ok=True)
    a["bemerkungen"].write_bytes((json.dumps(liste, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    return 200, eintrag


def lies_eingang(a: dict) -> list:
    return json.loads(a["eingang"].read_text(encoding="utf-8")) if a["eingang"].exists() else []


def reiche_ein(a: dict, von: str, art: str, daten: dict, jetzt: str) -> dict:
    """Vermerk einer zugelassenen Aufsicht in docs/<app>/pruefstand-eingang.json (ES3 a); derselbe offene Vermerk nur
    einmal. Wirksam erst, wenn die Entwicklung ihn übernimmt (docs/richtlinie_freigaben.md)."""
    eingang = lies_eingang(a)
    inhalt = {k: daten[k] for k in ("art", "id", "geprueft", "liste", "setzen", "entfernen", "komplett", "hash") if k in daten}
    schon = next((v for v in eingang if v.get("von") == von and v.get("pfad") == art and v.get("inhalt") == inhalt
                  and v.get("status") == "offen"), None)
    if schon:
        return schon
    v = {"nr": max((x["nr"] for x in eingang), default=0) + 1, "zeit": jetzt, "von": von, "pfad": art, "inhalt": inhalt,
         "status": "offen"}
    a["eingang"].parent.mkdir(parents=True, exist_ok=True)
    a["eingang"].write_bytes((json.dumps(eingang + [v], ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    return v


def lies_pruefstand(a: dict) -> dict:
    """Prüfstand als JSON nach „const <name> = “ (der Server schreibt ihn so)."""
    text = a["pruefstand"].read_text(encoding="utf-8")
    marke = f"const {a['name']} = "
    stand, _ = json.JSONDecoder().raw_decode(text, text.index(marke) + len(marke))
    for art in a["arten"]:
        stand.setdefault(art, {})
    return stand


def schreibe_pruefstand(a: dict, stand: dict) -> None:
    inhalt = a["kopf"] + f"const {a['name']} = " + json.dumps(stand, ensure_ascii=False, indent=2, sort_keys=True) + ";\n" + a["fuss"]
    a["pruefstand"].write_bytes(inhalt.encode("utf-8"))


def lies_eintraege(a: dict) -> dict:
    return json.loads(a["eintraege"].read_text(encoding="utf-8")) if a["eintraege"].exists() else {}


def lies_bemerkungen(a: dict) -> list:
    return json.loads(a["bemerkungen"].read_text(encoding="utf-8")) if a["bemerkungen"].exists() else []


# Herkunft, die den Server ansprechen darf (CORS, C11-3 a): lokal jeder Port, dazu die veröffentlichte Seite.
HERKUNFT_LOKAL = re.compile(r"^https?://(localhost|127\.0\.0\.1)(:\d{1,5})?$")
HERKUNFT_FEST = {"https://patrikneunteufel.github.io"}
HERKUNFT_EXTRA: set = set()  # aus --herkunft


def herkunft_erlaubt(herkunft: str) -> bool:
    h = (herkunft or "").strip().rstrip("/")
    return bool(h) and (bool(HERKUNFT_LOKAL.match(h)) or h in HERKUNFT_FEST or h in HERKUNFT_EXTRA)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WURZEL), **kwargs)

    def end_headers(self):
        # Immer die Dateien von der Platte: kein veraltetes spiel.js oder pruefstand.js im Browser.
        self.send_header("Cache-Control", "no-store")
        herkunft = self.headers.get("Origin", "")
        if herkunft_erlaubt(herkunft):
            self.send_header("Access-Control-Allow-Origin", herkunft.rstrip("/"))
            self.send_header("Vary", "Origin")
        super().end_headers()

    def do_OPTIONS(self):
        """Vorabfrage des Browsers (POST mit JSON, Zugriff einer öffentlichen Seite auf localhost)."""
        if not herkunft_erlaubt(self.headers.get("Origin", "")):
            self.send_response(403)
            return self.end_headers()
        self.send_response(204)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "600")
        if self.headers.get("Access-Control-Request-Private-Network", "").lower() == "true":
            self.send_header("Access-Control-Allow-Private-Network", "true")
        self.end_headers()

    def log_message(self, format, *args):
        """Im Netz keine Zeile je Anfrage — sie enthielte die IP-Adresse (Datenschutzseite: der Server speichert keine)."""
        if not NETZ:
            super().log_message(format, *args)

    def antwort(self, status: int, daten) -> None:
        roh = json.dumps(daten, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(roh)))
        self.end_headers()
        self.wfile.write(roh)

    def do_GET(self):
        if self.path.split("?")[0] == "/entwicklung/status":
            st = {"ok": True, "schluessel": SCHLUESSEL_DATEI.exists(), "server": SERVER_VERSION, "protokoll": list(PROTOKOLLE)}
            # Unterschrift einer Zufallszahl der App (NS2 a): weist den Server als den der Entwicklung aus
            zufall = (re.search(r"[?&]zufall=([0-9a-f]{16,64})(?:&|$)", self.path) or [None, None])[1]
            if zufall:
                u = unterschreibe(zufall)
                if u:
                    st["unterschrift"] = u
            return self.antwort(200, st)
        if NETZ:  # im Netz: kein Repo, keine Liste der Bemerkungen ohne Schlüssel (die holt die Entwicklung mit POST)
            return self.antwort(404, {"fehler": "nicht vorhanden"})
        if self.path.split("?")[0] == "/entwicklung/bemerkungen":
            app = (re.search(r"[?&]app=([a-z]+)", self.path) or [None, "eulenpfad"])[1]
            if app not in APPS:
                return self.antwort(400, {"fehler": "app unbekannt"})
            return self.antwort(200, lies_bemerkungen(APPS[app]))
        pfad = self.path.split("?")[0].lstrip("/").lower()
        if not pfad:  # Wurzel: zur Einstiegsseite statt Verzeichnisliste
            self.send_response(302)
            self.send_header("Location", "/portal/index.html")
            return self.end_headers()
        # Den Schlüssel und das Git-Verzeichnis nie ausliefern.
        if pfad.startswith("entwickler.key") or pfad.startswith(".git"):
            return self.antwort(404, {"fehler": "nicht vorhanden"})
        return super().do_GET()

    def do_POST(self):
        try:
            laenge = int(self.headers.get("Content-Length", 0))
            daten = json.loads(self.rfile.read(laenge) or b"{}")
        except (ValueError, json.JSONDecodeError):
            return self.antwort(400, {"fehler": "Anfrage nicht lesbar"})
        protokoll = daten.get("protokoll", 1)  # ohne Angabe: Seite vor LERN_Session27, Protokoll 1
        if not isinstance(protokoll, int) or not PROTOKOLLE[0] <= protokoll <= PROTOKOLLE[1]:
            von, bis = PROTOKOLLE
            bereich = str(von) if von == bis else f"{von}–{bis}"
            return self.antwort(409, {"fehler": f"Protokoll {protokoll} passt nicht: der Server {SERVER_VERSION} versteht "
                                                f"{bereich}. App oder Server auf denselben Stand bringen."})
        # Meldungen gehen für alle, ohne Schlüssel (NS1 a), mit Grenze je Absender
        if self.path == "/entwicklung/meldung":
            a = APPS.get(str(daten.get("app") or ""))
            if not a:
                return self.antwort(400, {"fehler": "app unbekannt"})
            if not MELDUNG_KENNUNG.match(str(daten.get("meldung", ""))):
                return self.antwort(400, {"fehler": "Kennung der Meldung fehlt oder ist ungültig"})
            if zu_viele_meldungen(self.client_address[0]):
                return self.antwort(429, {"fehler": "Zu viele Meldungen in kurzer Zeit. Bitte später noch einmal."})
            daten["von"] = "Meldung"  # ohne Namen: wer meldet, bleibt beim Gerät
            jetzt = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
            return self.antwort(*speichere_bemerkung(a, daten, jetzt))
        # Wer schreibt? Die Entwicklung (entwickler.key) oder eine zugelassene Aufsicht (ES1 a, ES2 a)
        rolle = wer(daten.get("schluessel"))
        if self.path == "/entwicklung/freischalten":
            if not rolle:
                return self.antwort(403, {"ok": False, "fehler": "Schlüssel passt nicht"})
            return self.antwort(200, {"ok": True, "rolle": rolle[0], "name": rolle[1] or ""})
        if not rolle:
            if not SCHLUESSEL_DATEI.exists() and not lies_zugelassen():
                return self.antwort(403, {"fehler": "entwickler.key fehlt: python tools/entwickler_server.py --neuer-schluessel"})
            return self.antwort(403, {"fehler": "Schlüssel passt nicht"})
        aufsicht = rolle[1] if rolle[0] == "aufsicht" else None
        if aufsicht:
            daten["von"] = aufsicht  # der Name, unter dem die Aufsicht zugelassen ist, nicht was die Seite schickt
        jetzt = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
        # Ältere Seiten (vor LERN_Session16) schicken keine App: dann der Eulenpfad
        a = APPS.get(str(daten.get("app") or "eulenpfad"))
        if not a:
            return self.antwort(400, {"fehler": "app unbekannt"})
        # holen und senden (ES3 a, tools/entwicklung_abgleich.py): nur die Entwicklung
        if self.path in ("/entwicklung/holen", "/entwicklung/senden"):
            if aufsicht:
                return self.antwort(403, {"fehler": "Nur für die Entwicklung"})
            if self.path == "/entwicklung/holen":
                return self.antwort(200, {"bemerkungen": lies_bemerkungen(a), "eingang": lies_eingang(a)})
            bemerkungen, eingang = lies_bemerkungen(a), lies_eingang(a)
            for s in daten.get("bemerkungen", []):
                b = next((x for x in bemerkungen if x.get("nr") == s.get("nr")), None)
                if b:
                    for feld in ("status", "antwort"):
                        if s.get(feld) is not None:
                            b[feld] = str(s[feld])[:300]
            for s in daten.get("eingang", []):
                v = next((x for x in eingang if x.get("nr") == s.get("nr")), None)
                if v and s.get("status") in ("angenommen", "abgelehnt", "zurueckgenommen"):
                    v["status"] = s["status"]
            for datei, inhalt in ((a["bemerkungen"], bemerkungen), (a["eingang"], eingang)):
                datei.parent.mkdir(parents=True, exist_ok=True)
                datei.write_bytes((json.dumps(inhalt, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
            return self.antwort(200, {"ok": True})
        # Prüfvermerke einer Aufsicht gehen in den Eingang, nicht in pruefstand.js (ES3 a, docs/richtlinie_freigaben.md);
        # im Netz gibt es keinen Prüfstand: dort geht jeder Vermerk in den Eingang, die Antwort ohne Stand
        if (aufsicht or NETZ) and self.path in ("/entwicklung/pruefstand", "/entwicklung/eintraege"):
            if self.path == "/entwicklung/pruefstand" and (daten.get("art") not in a["arten"]
                                                         or not re.fullmatch(r"[a-z0-9-]+(/[a-z0-9-]+)?", str(daten.get("id", "")))):
                return self.antwort(400, {"fehler": "art oder id ungültig"})
            if self.path == "/entwicklung/eintraege" and not re.fullmatch(r"[a-z0-9-]+/[a-z0-9-]+", str(daten.get("liste", ""))):
                return self.antwort(400, {"fehler": "liste ungültig"})
            v = reiche_ein(a, aufsicht or "Entwicklung", self.path.rsplit("/", 1)[1], daten, jetzt)
            if NETZ:
                return self.antwort(200, {"eingereicht": True, "nr": v["nr"]})
            return self.antwort(200, {"eingereicht": True, "nr": v["nr"], "stand": lies_pruefstand(a)})
        if aufsicht and self.path == "/entwicklung/bemerkung-status":
            return self.antwort(403, {"fehler": "Den Status einer Bemerkung setzt nur die Entwicklung"})

        if self.path == "/entwicklung/pruefstand":
            art, schluessel = daten.get("art"), str(daten.get("id", ""))
            if art not in a["arten"] or not re.fullmatch(r"[a-z0-9-]+(/[a-z0-9-]+)?", schluessel):
                return self.antwort(400, {"fehler": "art oder id ungültig"})
            stand = lies_pruefstand(a)
            if daten.get("geprueft"):
                stand.setdefault(art, {})[schluessel] = {"am": jetzt[:10], "von": str(daten.get("von", ""))[:40]}
            else:
                stand.get(art, {}).pop(schluessel, None)
            schreibe_pruefstand(a, stand)
            return self.antwort(200, stand)

        if self.path == "/entwicklung/eintraege":
            # Haken je Eintrag einer Liste (Prüfansicht, LP2 a, LERN_Session11)
            liste = str(daten.get("liste", ""))
            if not re.fullmatch(r"[a-z0-9-]+/[a-z0-9-]+", liste):
                return self.antwort(400, {"fehler": "liste ungültig"})
            schluessel_ok = lambda s: isinstance(s, str) and re.fullmatch(r"[a-z0-9-]+:[a-z0-9]+", s)
            alle = lies_eintraege(a)
            haken = alle.setdefault(liste, {})
            von = str(daten.get("von", ""))[:40]
            for s in daten.get("setzen", []):
                if schluessel_ok(s):
                    haken[s] = {"am": jetzt[:10], "von": von}
            for s in daten.get("entfernen", []):
                if schluessel_ok(s):
                    haken.pop(s, None)
            if not haken:
                alle.pop(liste, None)
            a["eintraege"].write_bytes((json.dumps(alle, ensure_ascii=False, indent=1, sort_keys=True) + "\n").encode("utf-8"))
            stand = lies_pruefstand(a)
            if daten.get("komplett"):
                stand.setdefault("listen", {})[liste] = {"am": jetzt[:10], "von": von, "hash": str(daten.get("hash", ""))[:20]}
            else:
                stand.get("listen", {}).pop(liste, None)
            schreibe_pruefstand(a, stand)
            return self.antwort(200, stand)

        if self.path == "/entwicklung/bemerkung-status":
            liste = lies_bemerkungen(a)
            b = next((x for x in liste if x.get("nr") == daten.get("nr")), None)
            if not b:
                return self.antwort(404, {"fehler": "Bemerkung nicht gefunden"})
            b["status"] = str(daten.get("status", ""))[:300]
            a["bemerkungen"].write_bytes((json.dumps(liste, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
            return self.antwort(200, b)

        if self.path == "/entwicklung/bemerkung":
            # Fehlermeldung eines Kindes (Kennung „meldung“, LERN_Session9): nur einmal aufnehmen.
            return self.antwort(*speichere_bemerkung(a, daten, jetzt))

        return self.antwort(404, {"fehler": "unbekannt"})


class Server(http.server.ThreadingHTTPServer):
    """Belegt den Port allein: Unter Windows teilen sich Python-Server sonst still denselben Port, und
    Anfragen landen zufällig bei einem alten `python -m http.server` ohne Entwickler-Funktionen."""
    allow_reuse_address = False

    def server_bind(self):
        if hasattr(socket, "SO_EXCLUSIVEADDRUSE"):
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


def netz_starten(port: int, host: str, zertifikat: str | None, zertifikat_schluessel: str | None) -> None:
    """Betrieb im Netz (NS1 a): nur Meldungen, Vermerke, holen und senden; Ablage in .entwicklung/daten/. https entweder
    hier (--zertifikat, --zertifikat-schluessel) oder vor dem Server (Reverse-Proxy, docs/anleitung_entwickler_server.md)."""
    global NETZ
    import ssl
    NETZ = True
    netz_pfade()
    if not privat_datei().exists():
        print("Hinweis: kein Schlüsselpaar (.entwicklung/server-privat.pem) — die Apps nehmen diesen Server erst an, wenn er\n"
              "unterschreibt: python tools/entwickler_server.py --neues-schluesselpaar (dann verteilen und veröffentlichen).")
    if not openssl():
        print("Hinweis: openssl nicht gefunden — ohne openssl keine Unterschrift.")
    try:
        server = Server((host, port), Handler)
    except OSError as e:
        sys.exit(f"Port {port} auf {host} lässt sich nicht belegen: {e}")
    art = "http (https davor über einen Reverse-Proxy)"
    if zertifikat:
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        ctx.load_cert_chain(zertifikat, zertifikat_schluessel)
        server.socket = ctx.wrap_socket(server.socket, server_side=True)
        art = "https"
    print(f"Meldungsserver im Netz läuft auf {host}:{port} ({art}), Version {SERVER_VERSION}, Protokoll {PROTOKOLLE}.\n"
          f"Ablage: {ENTWICKLUNG_ORDNER / 'daten'}. Keine Auslieferung des Repos, kein Protokoll der Anfragen.\n"
          "Beenden mit Strg+C.", flush=True)
    server.serve_forever()


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    if "--neuer-schluessel" in sys.argv:
        return neuer_schluessel()
    if "--neues-schluesselpaar" in sys.argv:
        try:
            neues_schluesselpaar()
        except RuntimeError as e:
            sys.exit(str(e))
        return print(f"Neues Schlüsselpaar: privat in {privat_datei()} (gitignored, nie weitergeben; auf den Server im Netz\n"
                     "kopieren), öffentlich in kern/entwicklung.js (SERVER_SCHLUESSEL) eingetragen.\n"
                     "Jetzt die Version in kern/VERSION erhöhen und verteilen: python tools/kern_verteilen.py")
    # Zugelassene Aufsichten (ES1 a, ES2 a): --zulassen "Vorname Name" person@… [--neu], --sperren "Vorname Name", --zugelassen
    if "--zulassen" in sys.argv:
        i = sys.argv.index("--zulassen")
        if len(sys.argv) < i + 3:
            sys.exit('Aufruf: python tools/entwickler_server.py --zulassen "Vorname Name" person@beispiel.ch [--neu]')
        try:
            s = zulassen(sys.argv[i + 1], sys.argv[i + 2], neu="--neu" in sys.argv)
        except ValueError as e:
            sys.exit(str(e))
        return print(f"Zugelassen: {sys.argv[i + 1].strip()}\nSchlüssel: {s}\n\nNur an die Adresse schicken, von der die "
                     "Anforderung kam (ES5 a). Gespeichert sind Name und Hash, nicht die E-Mail-Adresse.")
    if "--sperren" in sys.argv:
        i = sys.argv.index("--sperren")
        name = sys.argv[i + 1] if len(sys.argv) > i + 1 else ""
        return print(f"Gesperrt: {name}" if sperre_aufsicht(name) else f"Nicht zugelassen: {name}")
    if "--zugelassen" in sys.argv:
        liste = lies_zugelassen()
        return print("\n".join(f"{z['name']:30} seit {z['am']}  Schlüssel Nr. {z['zaehler']}{'  GESPERRT' if z.get('gesperrt') else ''}"
                               for z in liste) or "Noch niemand zugelassen.")
    port = int(next((a for a in sys.argv[1:] if a.isdigit()), 8765))
    for i, a in enumerate(sys.argv):
        if a == "--herkunft" and i + 1 < len(sys.argv):
            HERKUNFT_EXTRA.add(sys.argv[i + 1].strip().rstrip("/"))
    if not SCHLUESSEL_DATEI.exists():
        print("Hinweis: entwickler.key fehlt — Schreiben geht erst nach: python tools/entwickler_server.py --neuer-schluessel")
    wert = lambda schalter: sys.argv[sys.argv.index(schalter) + 1] if schalter in sys.argv and sys.argv.index(schalter) + 1 < len(sys.argv) else None
    if "--netz" in sys.argv:
        return netz_starten(port, wert("--host") or "127.0.0.1", wert("--zertifikat"), wert("--zertifikat-schluessel"))
    try:
        server = Server(("127.0.0.1", port), Handler)
    except OSError:
        sys.exit(f"Port {port} ist schon belegt — läuft noch ein anderer Server (z. B. python -m http.server)?\n"
                 f"Den beenden oder einen anderen Port nehmen: python tools/entwickler_server.py 8770")
    basis = f"http://localhost:{port}"
    # Einstieg wie online (GitHub Pages) über die Einstiegsseite (Entscheid SV1 a, LERN_Session17)
    print(f"Entwickler-Server läuft (Repo {WURZEL}).\n\n"
          f"  Einstiegsseite:   {basis}/portal/index.html\n"
          f"  Eulenpfad:        {basis}/eulenpfad/\n"
          f"  Lernsteig:        {basis}/lernsteig/\n"
          f"  Entwicklung:      {basis}/eulenpfad/index.html#verwaltung/entwicklung (Eulenpfad), "
          f"{basis}/lernsteig/index.html#verwaltung (Lernsteig)\n\n"
          "Link mit Strg+Klick öffnen (Windows Terminal, VS Code). Beenden mit Strg+C.", flush=True)
    if "--oeffnen" in sys.argv:
        webbrowser.open(f"{basis}/portal/index.html")
    server.serve_forever()


if __name__ == "__main__":
    main()
