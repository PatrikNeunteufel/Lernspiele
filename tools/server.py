"""Liefert das Repo auf http://localhost:8765/ aus, ohne dass der Browser Dateien zwischenspeichert.

Wie `python -m http.server 8765 --bind 127.0.0.1`, aber mit `Cache-Control: no-store`: Nach einer Änderung an
den Spielen zeigt ein gewöhnliches Neuladen gleich den neuen Stand (der einfache Server liess den Browser alte
Dateien behalten; LERN_Session8). Schreibt nichts. Für Prüfstand und Bemerkungen: tools/entwickler_server.py.
Die Wurzel leitet wie online (GitHub Pages) auf die Einstiegsseite portal/ (Entscheid SV1 a, LERN_Session17).

Aufruf (aus beliebigem Ordner):
    python tools/server.py            Port 8765
    python tools/server.py 8770       anderer Port
"""
import functools
import http.server
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent


EINSTIEG = "/portal/index.html"


def links(port):
    """Adressen für die Konsole: Einstieg wie online, dazu die Apps direkt."""
    basis = f"http://localhost:{port}"
    return (f"  Einstiegsseite:   {basis}{EINSTIEG}\n"
            f"  Eulenpfad:        {basis}/eulenpfad/\n"
            f"  Lernsteig:        {basis}/lernsteig/\n")


class OhneZwischenspeicher(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        if self.path.split("?")[0] in ("", "/"):  # Wurzel: zur Einstiegsseite statt Verzeichnisliste
            self.send_response(302)
            self.send_header("Location", EINSTIEG)
            return self.end_headers()
        return super().do_GET()


def main():
    port = int(next((a for a in sys.argv[1:] if a.isdigit()), 8765))
    handler = functools.partial(OhneZwischenspeicher, directory=str(WURZEL))
    with http.server.ThreadingHTTPServer(("127.0.0.1", port), handler) as server:
        print(f"Lernspiele laufen (nur ausliefern).\n\n{links(port)}\nBeenden: Strg+C oder Fenster schliessen.", flush=True)
        server.serve_forever()


if __name__ == "__main__":
    main()
