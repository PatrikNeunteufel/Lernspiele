#!/usr/bin/env python3
"""Stop-Hook (Entscheid HK1 a, LERN_Session23): Testzahlen in der Commit-Message gegen die gespeicherten Testläufe.

Anlass: zweimal stand in einer vorgeschlagenen Commit-Message eine abgeschriebene, falsche Testzahl (LERN_Session21
„17 statt 18“, LERN_Session22 „4 Hinweise“ statt „0“). Die Testskripte merken ihre Schlusszeile seit LERN_Session23
in .temp/pruefung/<skript>.json (tools/testausgabe.js).

Prüfung am Ende eines Zuges: Steht in Claudes Text ein Codeblock, der mit „LERN_Session“ beginnt (die Commit-Message),
muss jede Testzahl darin — „<n> Fälle, <m> Fehler“, „<n> Fehler, <m> Hinweise“, „Keine Fehler“ — in einer heute
gespeicherten Schlusszeile vorkommen. Sonst wird der Stopp abgelehnt („decision": "block") mit den abweichenden Angaben
und den gespeicherten Zeilen. Ausnahme: TESTZAHLEN_OK im Chattext (etwa für bewusst genannte alte Zahlen). Ein zweiter
Stopp nach einer Ablehnung (stop_hook_active) wird nie abgelehnt. Im Zweifel: durchlassen.
"""

import datetime
import glob
import json
import os
import re
import sys

OPT_OUT = "TESTZAHLEN_OK"
ZAUN = "`" * 3
CODEBLOCK = re.compile(ZAUN + r"[^\n]*\n(.*?)" + ZAUN, re.DOTALL)
MUSTER = [
    ("Fälle", re.compile(r"(\d+)\s+Fälle,?\s+(\d+)\s+Fehler")),
    ("Hinweise", re.compile(r"(\d+)\s+Fehler,?\s+(\d+)\s+Hinweise")),
]
KEINE = re.compile(r"Keine Fehler")


def ist_echte_nutzernachricht(eintrag):
    if eintrag.get("type") != "user" or eintrag.get("isMeta"):
        return False
    inhalt = (eintrag.get("message") or {}).get("content")
    if isinstance(inhalt, str):
        return bool(inhalt.strip())
    if isinstance(inhalt, list):
        hat_text = any(isinstance(x, dict) and x.get("type") == "text" for x in inhalt)
        hat_ergebnis = any(isinstance(x, dict) and x.get("type") == "tool_result" for x in inhalt)
        return hat_text and not hat_ergebnis
    return False


def chattext_des_zuges(pfad):
    eintraege = []
    with open(pfad, encoding="utf-8") as f:
        for zeile in f:
            try:
                eintraege.append(json.loads(zeile))
            except ValueError:
                continue
    start = 0
    for i in range(len(eintraege) - 1, -1, -1):
        if ist_echte_nutzernachricht(eintraege[i]):
            start = i + 1
            break
    texte = []
    for e in eintraege[start:]:
        if e.get("type") != "assistant":
            continue
        for block in (e.get("message") or {}).get("content") or []:
            if isinstance(block, dict) and block.get("type") == "text":
                texte.append(block.get("text") or "")
    return "\n".join(texte)


def angaben(text):
    """Testzahlen eines Texts als Menge von Tupeln: ("Fälle", n, m), ("Hinweise", n, m), ("Keine",)."""
    erg = set()
    for art, muster in MUSTER:
        for m in muster.finditer(text):
            erg.add((art, int(m.group(1)), int(m.group(2))))
    if KEINE.search(text):
        erg.add(("Keine",))
    return erg


def text_der_angabe(a):
    if a[0] == "Keine":
        return "Keine Fehler"
    if a[0] == "Fälle":
        return "%d Fälle, %d Fehler" % (a[1], a[2])
    return "%d Fehler, %d Hinweise" % (a[1], a[2])


def heutige_laeufe(projekt, heute):
    laeufe = []
    for datei in sorted(glob.glob(os.path.join(projekt, ".temp", "pruefung", "*.json"))):
        try:
            with open(datei, encoding="utf-8") as f:
                liste = json.load(f)
        except (OSError, ValueError):
            continue
        skript = os.path.splitext(os.path.basename(datei))[0]
        for l in liste if isinstance(liste, list) else []:
            if isinstance(l, dict) and l.get("tag") == heute:
                laeufe.append((skript, l))
    return laeufe


def pruefe(chattext, projekt, heute):
    """Grund zur Ablehnung oder None."""
    if OPT_OUT in chattext:
        return None
    messages = [b for b in CODEBLOCK.findall(chattext) if b.lstrip().startswith("LERN_Session")]
    if not messages:
        return None
    behauptet = set()
    for m in messages:
        behauptet |= angaben(m)
    if not behauptet:
        return None
    laeufe = heutige_laeufe(projekt, heute)
    belegt = set()
    for _, l in laeufe:
        belegt |= angaben(l.get("zeile") or "")
    fehlt = sorted(behauptet - belegt, key=text_der_angabe)
    if not fehlt:
        return None
    zeilen = ["  " + s + " (" + (l.get("aufruf") or "ohne Angaben") + ", " + (l.get("zeit") or "")[11:16] + " UTC): " + (l.get("zeile") or "")
              for s, l in laeufe[-12:]]
    return (
        "Testzahlen in der Commit-Message ohne Beleg in einem heutigen Testlauf (HK1 a): "
        + "; ".join("„" + text_der_angabe(a) + "“" for a in fehlt) + "."
        + "\nHeute gespeicherte Schlusszeilen (.temp/pruefung/):\n"
        + ("\n".join(zeilen) if zeilen else "  keine — die Tests sind heute noch nicht gelaufen.")
        + "\nDie Zahlen aus diesen Zeilen übernehmen (nicht abschreiben) oder den Test laufen lassen. Sind alte Zahlen "
        + "bewusst genannt: " + OPT_OUT + " in den Chattext schreiben. Das Abschlussfeld steht schon; nicht noch einmal setzen."
    )


def main():
    try:
        data = json.load(sys.stdin)
        if data.get("stop_hook_active"):
            return 0
        pfad = data.get("transcript_path") or ""
        if not pfad or not os.path.exists(pfad):
            return 0
        projekt = os.environ.get("CLAUDE_PROJECT_DIR") or data.get("cwd") or os.getcwd()
        grund = pruefe(chattext_des_zuges(pfad), projekt, datetime.date.today().isoformat())
        if grund:
            print(json.dumps({"decision": "block", "reason": grund}, ensure_ascii=False))
        return 0
    except Exception:
        return 0


if __name__ == "__main__":
    sys.exit(main())
