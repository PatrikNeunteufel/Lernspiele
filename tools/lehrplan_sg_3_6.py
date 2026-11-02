"""Stufen der 3. und der 6. Klasse aus stufen.json (Lehrplan SG), abgeglichen mit den Lernzielen im Katalog.

3. Klasse (geschätzt): Stufen des 2. Zyklus vor dem OP (der OP gilt am Ende der 4. Klasse).
6. Klasse: Stufen des 2. Zyklus ab der GA-Stufe (GA gilt spätestens Ende 6. Klasse), sofern die GA-Stufe
nach dem OP liegt; liegt sie davor oder fehlt der OP, die letzte Stufe des 2. Zyklus.
Aufruf: python -I klassen_3_6.py <stufen.json> <katalog.js>
"""
import json
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
alle = json.load(open(sys.argv[1], encoding="utf-8"))
katalog = open(sys.argv[2], encoding="utf-8").read()
# Lernziel-Codes im Katalog: Stufencodes (MA.1.A.3.f) und Kompetenzen (MA.1.A.3)
codes = set(re.findall(r'"((?:MA|D|NMG|FS1E|FS2F|MU|MI|BG|TTG|BS)\.[0-9A-Z.]+[a-z]?(?:/[a-z])*)', katalog))
stufen_im_katalog, kompetenzen_im_katalog = set(), set()
for c in codes:
    m = re.match(r"^(.*?\.\d+)\.([a-z](?:/[a-z])*)$", c)
    if m:
        kompetenzen_im_katalog.add(m.group(1))
        for b in m.group(2).split("/"):
            stufen_im_katalog.add(f"{m.group(1)}.{b}")
    else:
        kompetenzen_im_katalog.add(c)


def marke(code):
    kompetenz = code.rsplit(".", 1)[0]
    if code in stufen_im_katalog:
        return "[Stufe im Katalog]"
    if kompetenz in kompetenzen_im_katalog:
        return "[Kompetenz im Katalog]"
    return "[neu]"


zaehler = {3: {}, 6: {}}
ausgabe = {3: [], 6: []}
for fach, seiten in alle.items():
    for s in seiten:
        z2 = [st for st in s["stufen"] if st["zyklus"] == 2]
        if not z2:
            continue
        op = next((i for i, st in enumerate(z2) if st["op"]), None)
        ga = next((i for i, st in enumerate(z2) if st["ga"]), None)
        drei = z2[:op] if op is not None else []
        if op is not None and ga is not None and ga > op:
            sechs = z2[ga:]
        elif op is not None and op + 1 < len(z2):
            sechs = z2[-1:]
        else:
            sechs = z2[-1:] if op is None else []
        for k, liste in ((3, drei), (6, sechs)):
            for st in liste:
                m = marke(st["code"])
                zaehler[k][m] = zaehler[k].get(m, 0) + 1
                ga_text = " [GA]" if st["ga"] else ""
                ohne = " [ohne OP]" if op is None else ""
                ausgabe[k].append(f"- {st['code']}{ga_text}{ohne} {m} ({s['titel']}): " + " | ".join(st["text"])[:400])
for k in (3, 6):
    print(f"\n######## {k}. Klasse — {sum(zaehler[k].values())} Stufen: {zaehler[k]}")
    print("\n".join(ausgabe[k]))
