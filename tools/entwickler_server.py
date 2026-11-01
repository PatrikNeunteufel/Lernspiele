"""Entwickler-Server für Eulenpfad (Entscheide E1 a, E2 a, LERN_Session6).

Liefert das Repo aus wie `python -m http.server` und nimmt zusätzlich genau zwei Änderungen an:
den Prüfstand (eulenpfad/spiele/gemeinsam/pruefstand.js) und Entwickler-Bemerkungen
(docs/eulenpfad/bemerkungen.json). Geschrieben wird nur mit dem Schlüssel aus `entwickler.key`
(Repo-Wurzel, von Git ausgeschlossen); im Repo steht nur sein Hash (entwicklung.js).

Aufruf (aus beliebigem Ordner):
    python tools/entwickler_server.py              Server auf http://localhost:8765/eulenpfad/
    python tools/entwickler_server.py 8770         anderer Port
    python tools/entwickler_server.py --oeffnen    zusätzlich Eulenpfad im Browser öffnen
    python tools/entwickler_server.py --neuer-schluessel   Schlüssel neu erzeugen, Hash eintragen
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
PRUEFSTAND = WURZEL / "eulenpfad" / "spiele" / "gemeinsam" / "pruefstand.js"
ENTWICKLUNG_JS = WURZEL / "eulenpfad" / "spiele" / "gemeinsam" / "entwicklung.js"
BEMERKUNGEN = WURZEL / "docs" / "eulenpfad" / "bemerkungen.json"
SALZ = "eulenpfad-entwickler:"  # wie in entwicklung.js

PRUEFSTAND_KOPF = (
    "/* Prüfstand (Entscheid E1 a, LERN_Session6): welche Spiele angesehen und welche Inhaltslisten geprüft\n"
    "   sind, je { am, von }. Schlüssel: Spiel-Id bzw. \"<spiel>/<liste>\" der Quelle einer Liste.\n"
    "   Geschrieben vom Entwickler-Server (tools/entwickler_server.py) — nicht von Hand ändern. */\n"
    "const PRUEFSTAND = "
)


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
    print(f"Neuer Schlüssel in {SCHLUESSEL_DATEI.name}, Hash in entwicklung.js eingetragen.")


def lies_pruefstand() -> dict:
    text = PRUEFSTAND.read_text(encoding="utf-8")
    return json.loads(text[text.index("const PRUEFSTAND = ") + len("const PRUEFSTAND = "):].rstrip().rstrip(";"))


def schreibe_pruefstand(stand: dict) -> None:
    inhalt = PRUEFSTAND_KOPF + json.dumps(stand, ensure_ascii=False, indent=2, sort_keys=True) + ";\n"
    PRUEFSTAND.write_bytes(inhalt.encode("utf-8"))


def lies_bemerkungen() -> list:
    return json.loads(BEMERKUNGEN.read_text(encoding="utf-8")) if BEMERKUNGEN.exists() else []


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WURZEL), **kwargs)

    def end_headers(self):
        # Immer die Dateien von der Platte: kein veraltetes spiel.js oder pruefstand.js im Browser.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def antwort(self, status: int, daten) -> None:
        roh = json.dumps(daten, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(roh)))
        self.end_headers()
        self.wfile.write(roh)

    def do_GET(self):
        if self.path == "/entwicklung/status":
            return self.antwort(200, {"ok": True, "schluessel": SCHLUESSEL_DATEI.exists()})
        if self.path == "/entwicklung/bemerkungen":
            return self.antwort(200, lies_bemerkungen())
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
        if not SCHLUESSEL_DATEI.exists():
            return self.antwort(403, {"fehler": "entwickler.key fehlt: python tools/entwickler_server.py --neuer-schluessel"})
        richtig = SCHLUESSEL_DATEI.read_text(encoding="utf-8").strip()
        if not hmac.compare_digest(str(daten.get("schluessel", "")), richtig):
            return self.antwort(403, {"fehler": "Schlüssel passt nicht"})
        jetzt = datetime.datetime.now().astimezone().isoformat(timespec="seconds")

        if self.path == "/entwicklung/pruefstand":
            art, schluessel = daten.get("art"), str(daten.get("id", ""))
            if art not in ("spiele", "listen") or not re.fullmatch(r"[a-z0-9-]+(/[a-z0-9-]+)?", schluessel):
                return self.antwort(400, {"fehler": "art oder id ungültig"})
            stand = lies_pruefstand()
            if daten.get("geprueft"):
                stand.setdefault(art, {})[schluessel] = {"am": jetzt[:10], "von": str(daten.get("von", ""))[:40]}
            else:
                stand.get(art, {}).pop(schluessel, None)
            schreibe_pruefstand(stand)
            return self.antwort(200, stand)

        if self.path == "/entwicklung/bemerkung":
            text = str(daten.get("text", "")).strip()
            if not text:
                return self.antwort(400, {"fehler": "Bemerkung ist leer"})
            liste = lies_bemerkungen()
            eintrag = {"nr": max((b["nr"] for b in liste), default=0) + 1, "zeit": jetzt, "status": "offen", "text": text[:2000]}
            for feld in ("von", "spiel", "stufe", "liste", "eintrag", "aufgabe", "seite"):
                if daten.get(feld):
                    eintrag[feld] = str(daten[feld])[:500]
            liste.append(eintrag)
            BEMERKUNGEN.write_bytes((json.dumps(liste, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
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
    if not SCHLUESSEL_DATEI.exists():
        print("Hinweis: entwickler.key fehlt — Schreiben geht erst nach: python tools/entwickler_server.py --neuer-schluessel")
    try:
        server = Server(("127.0.0.1", port), Handler)
    except OSError:
        sys.exit(f"Port {port} ist schon belegt — läuft noch ein anderer Server (z. B. python -m http.server)?\n"
                 f"Den beenden oder einen anderen Port nehmen: python tools/entwickler_server.py 8770")
    eulenpfad = f"http://localhost:{port}/eulenpfad/"
    print(f"Entwickler-Server läuft (Repo {WURZEL}).\n\n"
          f"  Eulenpfad:        {eulenpfad}\n"
          f"  Einstiegsseite:   http://localhost:{port}/portal/index.html\n"
          f"  Entwicklung:      {eulenpfad}index.html#verwaltung/entwicklung\n\n"
          "Link mit Strg+Klick öffnen (Windows Terminal, VS Code). Beenden mit Strg+C.", flush=True)
    if "--oeffnen" in sys.argv:
        webbrowser.open(eulenpfad)
    server.serve_forever()


if __name__ == "__main__":
    main()
