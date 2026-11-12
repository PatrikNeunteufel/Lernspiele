"""Verteilt den gemeinsamen Kern in die Apps (Entscheid KB1 a; Plan docs/plan_angleich_reihe.md B1).

kern/ ist die einzige Quelle. Dieses Werkzeug bündelt die Teile aus kern/TEILE je App in zwei Dateien mit Version und
Prüfsumme im Kopf: die .js-Teile in <app>/kern/kern.js, die .css-Teile (Farben, Entscheid DM1 a) in <app>/kern/kern.css,
die .kopf.js-Teile (laufen im <head> vor dem ersten Bild, DM1 a) in <app>/kern/kern-kopf.js.
Die Kopien sind Ergebnisse, nie eine zweite Quelle: Wer etwas am Kern ändert, ändert es in kern/ und verteilt neu. Am
Ende von kern.js steht `KERN.version`; kern.css trägt dieselbe Version im Kopf.

Dazu schreibt es je App <app>/version.js aus <app>/VERSION (Plan C12, NS3 a): `APP_VERSION = { app, version }`. Jede
Seite, die den Kern lädt, lädt version.js davor (tools/pruefe_skripte.js prüft das). Eine neue App-Version: Zahl in
<app>/VERSION ändern, dieses Werkzeug laufen lassen. Regeln wie beim Kern (klein Fehler, mittel neu, gross Schnittstelle).

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
ARTEN = (".js", ".css", ".kopf.js")  # je Art eine Datei (DATEI)
DATEI = {".js": "kern.js", ".css": "kern.css", ".kopf.js": "kern-kopf.js"}


def art_von(name: str) -> str:
    """Art eines Teils: .kopf.js vor .js (die Endung .js trägt auch der Kopf)."""
    for art in (".kopf.js", ".css", ".js"):
        if name.endswith(art):
            return art
    raise SystemExit(f"kern/TEILE nennt {name} — nur .js-, .css- und .kopf.js-Teile")


def lies_text(pfad: Path) -> str:
    """Text mit LF (die Prüfsumme hängt nicht vom Zeilenende der Arbeitskopie ab)."""
    return pfad.read_text(encoding="utf-8").replace("\r\n", "\n")


def teile() -> list[str]:
    zeilen = lies_text(KERN / "TEILE").splitlines()
    return [z.strip() for z in zeilen if z.strip() and not z.lstrip().startswith("#")]


def rumpf(art: str = ".js") -> str:
    """Die Teile einer Art (.js oder .css) in der Reihenfolge von kern/TEILE."""
    stuecke = []
    for name in teile():
        if art_von(name) != art:
            continue
        quelle = KERN / name
        if not quelle.is_file():
            raise SystemExit(f"kern/TEILE nennt {name}, die Datei fehlt")
        stuecke.append(f"/* ---- kern/{name} ---- */\n" + lies_text(quelle).rstrip("\n") + "\n")
    return "\n".join(stuecke)


def pruefsumme(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def buendel(art: str = ".js") -> tuple[str, str]:
    version = lies_text(KERN / "VERSION").strip()
    r = rumpf(art)
    if art == ".js":
        r += f'\n/* ---- erzeugt: Version des Kerns (kern/VERSION) ---- */\nglobalThis.KERN.version = "{version}";\n'
    kopf = (f"/* kern {version} · Prüfsumme sha256:{pruefsumme(r)} · erzeugt von tools/kern_verteilen.py aus kern/ — "
            f"nicht von Hand ändern, sondern kern/ ändern und neu verteilen. */\n")
    return version, kopf + r


def ziel(app: str, art: str = ".js") -> Path:
    return WURZEL / app / "kern" / DATEI[art]


def pruefe_app(app: str, version: str, soll: str, art: str = ".js") -> tuple[int, str]:
    """(0 gleich | 1 Hinweis | 2 Fehler, Text)."""
    pfad = ziel(app, art)
    datei = f"kern/{DATEI[art]}"
    if not pfad.is_file():
        return 2, f"{app}: {datei} fehlt"
    ist = lies_text(pfad)
    if ist == soll:
        return 0, f"{app}: {datei} {version}, gleich"
    kopf, _, r = ist.partition("\n")
    m = KOPF.match(kopf)
    if not m or pruefsumme(r) != m.group(2):
        return 2, f"{app}: {datei} von Hand geändert (Prüfsumme stimmt nicht) — kern/ ändern und neu verteilen"
    if m.group(1) == version:
        return 2, f"{app}: {datei} {version} weicht vom Kern ab — Version in kern/VERSION erhöhen oder neu verteilen"
    return 1, f"{app}: {datei} liegt zurück (kern {m.group(1)} statt {version})"


VERSION_MUSTER = re.compile(r"^\d+\.\d+\.\d+$")


def version_ziel(app: str) -> Path:
    return WURZEL / app / "version.js"


def version_soll(app: str) -> str:
    """Inhalt von <app>/version.js aus <app>/VERSION (NS3 a)."""
    quelle = WURZEL / app / "VERSION"
    if not quelle.is_file():
        raise SystemExit(f"{app}/VERSION fehlt")
    v = lies_text(quelle).strip()
    if not VERSION_MUSTER.match(v):
        raise SystemExit(f"{app}/VERSION: „{v}“ ist keine Version der Form 1.2.3")
    return (f"/* {app} {v} · erzeugt von tools/kern_verteilen.py aus {app}/VERSION — nicht von Hand ändern, sondern "
            f"{app}/VERSION ändern und neu verteilen (Plan C12, NS3 a). */\n"
            f'var APP_VERSION = Object.freeze({{ app: "{app}", version: "{v}" }});\n')


def pruefe_version(app: str) -> tuple[int, str]:
    pfad = version_ziel(app)
    if not pfad.is_file():
        return 2, f"{app}: version.js fehlt — python tools/kern_verteilen.py"
    if lies_text(pfad) != version_soll(app):
        return 2, f"{app}: version.js passt nicht zu {app}/VERSION — python tools/kern_verteilen.py"
    return 0, f"{app}: version.js gleich"


def main() -> int:
    # Ausgabe immer UTF-8, auch in der Windows-Konsole und wenn ein Testskript sie liest (sonst „ge�ndert“).
    sys.stdout.reconfigure(encoding="utf-8")
    args = sys.argv[1:]
    nur_pruefen = "--pruefe" in args
    apps = [a for a in args if not a.startswith("--")] or APPS
    for a in apps:
        if a not in APPS:
            raise SystemExit(f"unbekannte App {a} (bekannt: {', '.join(APPS)})")
    buendel_je_art = {art: buendel(art) for art in ARTEN}
    version = buendel_je_art[".js"][0]
    schlimmste = 0
    for app in apps:
        if nur_pruefen:
            for stufe, text in (*(pruefe_app(app, version, soll, art) for art, (_, soll) in buendel_je_art.items()),
                                pruefe_version(app)):
                schlimmste = max(schlimmste, stufe)
                print(("    " if stufe == 0 else "    HINWEIS " if stufe == 1 else "    FEHLER  ") + text)
        else:
            for art, (_, soll) in buendel_je_art.items():
                pfad = ziel(app, art)
                pfad.parent.mkdir(parents=True, exist_ok=True)
                pfad.write_text(soll, encoding="utf-8", newline="\n")
                print(f"{app}: kern {version} nach {pfad.relative_to(WURZEL).as_posix()}")
            version_ziel(app).write_text(version_soll(app), encoding="utf-8", newline="\n")
            print(f"{app}: version.js aus {app}/VERSION ({lies_text(WURZEL / app / 'VERSION').strip()})")
    return 1 if schlimmste == 2 else 0


if __name__ == "__main__":
    sys.exit(main())
