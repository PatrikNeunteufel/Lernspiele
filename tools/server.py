"""Liefert das Repo auf http://localhost:8765/ aus, ohne dass der Browser Dateien zwischenspeichert.

Wie `python -m http.server 8765 --bind 127.0.0.1`, aber mit `Cache-Control: no-store`: Nach einer Änderung an
den Spielen zeigt ein gewöhnliches Neuladen gleich den neuen Stand (der einfache Server liess den Browser alte
Dateien behalten; LERN_Session8). Schreibt nichts. Für Prüfstand und Bemerkungen: tools/entwickler_server.py.

Aufruf (aus beliebigem Ordner):
    python tools/server.py            Port 8765
    python tools/server.py 8770       anderer Port
"""
import functools
import http.server
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent


class OhneZwischenspeicher(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    port = int(next((a for a in sys.argv[1:] if a.isdigit()), 8765))
    handler = functools.partial(OhneZwischenspeicher, directory=str(WURZEL))
    with http.server.ThreadingHTTPServer(("127.0.0.1", port), handler) as server:
        print(f"Eulenpfad: http://localhost:{port}/eulenpfad/  (Beenden: Strg+C oder Fenster schliessen)")
        server.serve_forever()


if __name__ == "__main__":
    main()
