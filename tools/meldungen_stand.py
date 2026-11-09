"""Veröffentlicht die Antworten der Entwicklung auf Fehlermeldungen (LERN_Session9; je App seit LERN_Session25, Plan C11).

Liest docs/<app>/bemerkungen.json und schreibt <app>/meldungen-stand.json: je Kennung einer Meldung (Feld „meldung“
der Bemerkung) Status und Antwort — sonst nichts, keine Daten über die Person. Die App liest die Datei mit „Antworten
abfragen“ (KERN.meldungen.abfragen) und gibt die Antwort weiter.

Status der Bemerkung → Status der Meldung (wie KERN.meldungen.statusAusBemerkung):
    „erledigt …“            → behoben
    „kein Fehler …“         → kein-fehler
    „geplant …“, „in Arbeit …“ → geplant
    sonst (offen)           → nicht aufgenommen
Die Antwort steht im Feld „antwort“ der Bemerkung (von Hand, ohne Namen; im Eulenpfad kindgerecht).

Aufruf: python tools/meldungen_stand.py [app …]   (ohne Angabe alle Apps mit Meldungen; danach mit committen, Pages
veröffentlicht die Dateien)
"""
import json
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
APPS = ("eulenpfad", "lernsteig")


def status_aus(text: str):
    t = (text or "").strip().lower()
    if t.startswith("erledigt"):
        return "behoben"
    if t.startswith("kein fehler"):
        return "kein-fehler"
    if t.startswith("geplant") or t.startswith("in arbeit"):
        return "geplant"
    return None


def stand_von(bemerkungen: list) -> dict:
    stand = {}
    for b in bemerkungen:
        kennung, status = b.get("meldung"), status_aus(b.get("status", ""))
        if not kennung or not status:
            continue
        stand[kennung] = {"status": status, **({"antwort": b["antwort"]} if b.get("antwort") else {})}
    return stand


def schreibe(app: str) -> None:
    quelle = WURZEL / "docs" / app / "bemerkungen.json"
    ziel = WURZEL / app / "meldungen-stand.json"
    liste = json.loads(quelle.read_text(encoding="utf-8")) if quelle.exists() else []
    stand = stand_von(liste)
    ziel.write_bytes((json.dumps(stand, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8"))
    print(f"{app}: {len(stand)} Antwort(en) nach {ziel.relative_to(WURZEL).as_posix()} geschrieben.")


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    apps = sys.argv[1:] or list(APPS)
    for app in apps:
        if app not in APPS:
            sys.exit(f"Unbekannte App {app!r} — erlaubt: {', '.join(APPS)}")
        schreibe(app)


if __name__ == "__main__":
    main()
