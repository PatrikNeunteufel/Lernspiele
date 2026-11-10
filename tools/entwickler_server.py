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

Andere Seiten (C11-3 a, LERN_Session25): Eine App, die nicht von diesem Server kommt — etwa die veröffentlichte Seite oder
eine Vorschau auf einem anderen Port —, darf ihn für Meldungen und Entwicklung ansprechen (CORS), aber nur von einer
erlaubten Herkunft: localhost und 127.0.0.1 mit beliebigem Port, die veröffentlichte Seite (HERKUNFT_FEST) und was
--herkunft nennt. Der Server hört weiterhin nur auf 127.0.0.1; geschrieben wird nur mit dem Schlüssel.

Versionen (Plan C12, NS3 a, LERN_Session27): /entwicklung/status nennt SERVER_VERSION und die verstandenen Protokolle
(PROTOKOLLE, wie PROTOKOLL in kern/entwicklung.js). Eine Anfrage mit einem anderen Protokoll wird abgewiesen (409);
eine ohne Angabe (Seiten vor LERN_Session27) gilt als Protokoll 1. Bemerkungen merken die Fassung der Meldung und die
Versionen der sendenden Seite.
"""
import datetime
import hashlib
import hmac
import http.server
import mimetypes
import json
import re
import secrets
import socket
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

    def antwort(self, status: int, daten) -> None:
        roh = json.dumps(daten, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(roh)))
        self.end_headers()
        self.wfile.write(roh)

    def do_GET(self):
        if self.path == "/entwicklung/status":
            return self.antwort(200, {"ok": True, "schluessel": SCHLUESSEL_DATEI.exists(), "server": SERVER_VERSION,
                                      "protokoll": list(PROTOKOLLE)})
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
        if not SCHLUESSEL_DATEI.exists():
            return self.antwort(403, {"fehler": "entwickler.key fehlt: python tools/entwickler_server.py --neuer-schluessel"})
        richtig = SCHLUESSEL_DATEI.read_text(encoding="utf-8").strip()
        if not hmac.compare_digest(str(daten.get("schluessel", "")), richtig):
            return self.antwort(403, {"fehler": "Schlüssel passt nicht"})
        jetzt = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
        # Ältere Seiten (vor LERN_Session16) schicken keine App: dann der Eulenpfad
        a = APPS.get(str(daten.get("app") or "eulenpfad"))
        if not a:
            return self.antwort(400, {"fehler": "app unbekannt"})

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
            text = str(daten.get("text", "")).strip()
            if not text:
                return self.antwort(400, {"fehler": "Bemerkung ist leer"})
            liste = lies_bemerkungen(a)
            # Fehlermeldung eines Kindes (Kennung „meldung“, LERN_Session9): nur einmal aufnehmen.
            schon = next((b for b in liste if daten.get("meldung") and b.get("meldung") == daten.get("meldung")), None)
            if schon:
                return self.antwort(200, schon)
            eintrag = {"nr": max((b["nr"] for b in liste), default=0) + 1, "zeit": jetzt, "status": "offen", "text": text[:2000]}
            for feld in ("von", "spiel", "inhalt", "stufe", "liste", "eintrag", "schluessel", "aufgabe", "seite", "meldung",
                         "fassung"):
                if daten.get(feld):
                    eintrag[feld] = str(daten[feld])[:500]
            # Versionen der sendenden Seite (NS3 a); „fassung“ ist die der Meldung, als sie entstand
            v = daten.get("versionen")
            if isinstance(v, dict) and (v.get("app") or v.get("kern")):
                eintrag["gesendet_mit"] = {k: str(v[k])[:20] for k in ("app", "kern", "protokoll") if v.get(k) not in (None, "")}
            liste.append(eintrag)
            a["bemerkungen"].parent.mkdir(parents=True, exist_ok=True)
            a["bemerkungen"].write_bytes((json.dumps(liste, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
            return self.antwort(200, eintrag)

        return self.antwort(404, {"fehler": "unbekannt"})


class Server(http.server.ThreadingHTTPServer):
    """Belegt den Port allein: Unter Windows teilen sich Python-Server sonst still denselben Port, und
    Anfragen landen zufällig bei einem alten `python -m http.server` ohne Entwickler-Funktionen."""
    allow_reuse_address = False

    def server_bind(self):
        if hasattr(socket, "SO_EXCLUSIVEADDRUSE"):
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    if "--neuer-schluessel" in sys.argv:
        return neuer_schluessel()
    port = int(next((a for a in sys.argv[1:] if a.isdigit()), 8765))
    for i, a in enumerate(sys.argv):
        if a == "--herkunft" and i + 1 < len(sys.argv):
            HERKUNFT_EXTRA.add(sys.argv[i + 1].strip().rstrip("/"))
    if not SCHLUESSEL_DATEI.exists():
        print("Hinweis: entwickler.key fehlt — Schreiben geht erst nach: python tools/entwickler_server.py --neuer-schluessel")
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
