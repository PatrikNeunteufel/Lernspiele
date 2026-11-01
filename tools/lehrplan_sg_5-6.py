"""Zieht aus stufen.json die Stufen der 5./6. Klasse: Stufen des 2. Zyklus nach dem OP.

Aufruf: python -I lehrplan_sg_5-6.py <stufen.json> > stufen_5-6.txt
Seiten ohne OP im 2. Zyklus: alle Stufen des 2. Zyklus, markiert mit [ohne OP].
"""
import json, sys

sys.stdout.reconfigure(encoding="utf-8")
alle = json.load(open(sys.argv[1], encoding="utf-8"))
gesamt = 0
for fach, seiten in alle.items():
    print(f"\n######## {fach}")
    for s in seiten:
        z2 = [st for st in s["stufen"] if st["zyklus"] == 2]
        if not z2:
            continue
        op = next((i for i, st in enumerate(z2) if st["op"]), None)
        rest = z2 if op is None else z2[op + 1:]
        if not rest:
            continue
        marke = " [ohne OP]" if op is None else ""
        print(f"\n## {s['code']} — {s['titel']}{marke}")
        if op is not None:
            print(f"   (OP: {z2[op]['code']})")
        for st in rest:
            gesamt += 1
            ga = " [GA]" if st["ga"] else ""
            print(f"- {st['code']}{ga}: " + " | ".join(st["text"]))
print(f"\n# {gesamt} Stufen", file=sys.stderr)
