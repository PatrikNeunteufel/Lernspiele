"""Verteilt den gemeinsamen Kern in die Apps (Entscheid KB1 a; Plan docs/plan_angleich_reihe.md B1).

kern/ ist die einzige Quelle. Dieses Werkzeug bündelt die Teile aus kern/TEILE in eine Datei je App,
<app>/kern/kern.js, mit Version und Prüfsumme im Kopf. Die Kopie ist ein Ergebnis, nie eine zweite Quelle:
Wer etwas am Kern ändert, ändert es in kern/ und verteilt neu.

Aufruf:
    python tools/kern_verteilen.py                 alle Apps neu schreiben
    python tools/kern_verteilen.py lernsteig       nur diese App(s)
    python tools/kern_verteilen.py --pruefe        nichts schreiben; Ende mit Code 1, wenn eine Kopie von Hand
                                                   geändert ist oder bei gleicher Version vom Kern abweicht
Eine App darf hinter dem Kern zurückliegen (ältere Version in ihrer Kopie); --pruefe meldet das als Hinweis.
"""
import hashlib
import re
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
KERN = WURZEL / "kern"
APPS = ["eulenpfad", "lernsteig", "gratwanderung"]
KOPF = re.compile(r"^/\* kern (\S+) · Prüfsumme sha256:([0-9a-f]{64}) ·")


def lies_text(pfad: Path) -> str:
    """Text mit LF (die Prüfsumme hängt nicht vom Zeilenende der Arbeitskopie ab)."""
    return pfad.read_text(encoding="utf-8").replace("\r\n", "\n")


def teile() -> list[str]:
    zeilen = lies_text(KERN / "TEILE").splitlines()
    return [z.strip() for z in zeilen if z.strip() and not z.lstrip().startswith("#")]


def rumpf() -> str:
    stuecke = []
    for name in teile():
        quelle = KERN / name
        if not quelle.is_file():
            raise SystemExit(f"kern/TEILE nennt {name}, die Datei fehlt")
        stuecke.append(f"/* ---- kern/{name} ---- */\n" + lies_text(quelle).rstrip("\n") + "\n")
    return "\n".join(stuecke)


def pruefsumme(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def buendel() -> tuple[str, str]:
    version = lies_text(KERN / "VERSION").strip()
    r = rumpf()
    kopf = (f"/* kern {version} · Prüfsumme sha256:{pruefsumme(r)} · erzeugt von tools/kern_verteilen.py aus kern/ — "
            f"nicht von Hand ändern, sondern kern/ ändern und neu verteilen. */\n")
    return version, kopf + r


def ziel(app: str) -> Path:
    return WURZEL / app / "kern" / "kern.js"


def pruefe_app(app: str, version: str, soll: str) -> tuple[int, str]:
    """(0 gleich | 1 Hinweis | 2 Fehler, Text)."""
    pfad = ziel(app)
    if not pfad.is_file():
        return 2, f"{app}: kern/kern.js fehlt"
    ist = lies_text(pfad)
    if ist == soll:
        return 0, f"{app}: kern {version}, gleich"
    kopf, _, r = ist.partition("\n")
    m = KOPF.match(kopf)
    if not m or pruefsumme(r) != m.group(2):
        return 2, f"{app}: kern/kern.js von Hand geändert (Prüfsumme stimmt nicht) — kern/ ändern und neu verteilen"
    if m.group(1) == version:
        return 2, f"{app}: kern {version} weicht vom Kern ab — Version in kern/VERSION erhöhen oder neu verteilen"
    return 1, f"{app}: liegt zurück (kern {m.group(1)} statt {version})"


def main() -> int:
    # Ausgabe immer UTF-8, auch in der Windows-Konsole und wenn ein Testskript sie liest (sonst „ge�ndert“).
    sys.stdout.reconfigure(encoding="utf-8")
    args = sys.argv[1:]
    nur_pruefen = "--pruefe" in args
    apps = [a for a in args if not a.startswith("--")] or APPS
    for a in apps:
        if a not in APPS:
            raise SystemExit(f"unbekannte App {a} (bekannt: {', '.join(APPS)})")
    version, soll = buendel()
    schlimmste = 0
    for app in apps:
        if nur_pruefen:
            stufe, text = pruefe_app(app, version, soll)
            schlimmste = max(schlimmste, stufe)
            print(("    " if stufe == 0 else "    HINWEIS " if stufe == 1 else "    FEHLER  ") + text)
        else:
            pfad = ziel(app)
            pfad.parent.mkdir(parents=True, exist_ok=True)
            pfad.write_text(soll, encoding="utf-8", newline="\n")
            print(f"{app}: kern {version} nach {pfad.relative_to(WURZEL).as_posix()}")
    return 1 if schlimmste == 2 else 0


if __name__ == "__main__":
    sys.exit(main())
