"""Veröffentlicht die Antworten der Entwicklung auf Fehlermeldungen von Kindern (LERN_Session9).

Liest docs/eulenpfad/bemerkungen.json und schreibt eulenpfad/meldungen-stand.json: je Kennung einer Meldung
(Feld „meldung“ der Bemerkung) Status und Antwort — sonst nichts, keine Daten über das Kind. Die App liest
die Datei, wenn die Aufsicht „Antworten abfragen“ tippt, und gibt die Antwort ans Kind weiter.

Status der Bemerkung → Status der Meldung (wie LS.meldungStatusAusBemerkung):
    „erledigt …“            → behoben
    „kein Fehler …“         → kein-fehler
    „geplant …“, „in Arbeit …“ → geplant
    sonst (offen)           → nicht aufgenommen
Die Antwort fürs Kind steht im Feld „antwort“ der Bemerkung (von Hand, kindgerecht, ohne Namen).

Aufruf: python tools/meldungen_stand.py   (danach mit committen; Pages veröffentlicht die Datei)
"""
import json
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
BEMERKUNGEN = WURZEL / "docs" / "eulenpfad" / "bemerkungen.json"
ZIEL = WURZEL / "eulenpfad" / "meldungen-stand.json"


def status_aus(text: str):
    t = (text or "").strip().lower()
    if t.startswith("erledigt"):
        return "behoben"
    if t.startswith("kein fehler"):
        return "kein-fehler"
    if t.startswith("geplant") or t.startswith("in arbeit"):
        return "geplant"
    return None


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    liste = json.loads(BEMERKUNGEN.read_text(encoding="utf-8")) if BEMERKUNGEN.exists() else []
    stand = {}
    for b in liste:
        kennung, status = b.get("meldung"), status_aus(b.get("status", ""))
        if not kennung or not status:
            continue
        stand[kennung] = {"status": status, **({"antwort": b["antwort"]} if b.get("antwort") else {})}
    ZIEL.write_bytes((json.dumps(stand, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8"))
    print(f"{len(stand)} Antwort(en) nach {ZIEL.relative_to(WURZEL)} geschrieben.")


if __name__ == "__main__":
    main()
