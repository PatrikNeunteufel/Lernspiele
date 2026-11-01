"""Liest die Kompetenzseiten von sg.lehrplan.ch und zieht die Stufen je Zyklus, GA und OP heraus.

Aufruf: python -I lehrplan_sg_lesen.py <zielordner>
Schreibt <zielordner>/stufen.json und speichert jede Seite als HTML (UTF-8, wie geliefert).
"""
import html, json, os, re, subprocess, sys, time

BASIS = "https://sg.lehrplan.ch/index.php?code="
FAECHER = {
    "D": "b|1|11", "FS1E": "b|1|21", "FS2F": "b|1|32", "MA": "b|5|0&la=yes",
    "NMG": "b|6|1", "BG": "b|7|1", "TTG": "b|7|2", "MU": "b|8|0&la=yes",
    "BS": "b|9|0&la=yes", "MI": "b|10|0&la=yes",
}


def hole(code, ziel):
    datei = os.path.join(ziel, re.sub(r"[^0-9a-z]+", "_", code) + ".html")
    if not os.path.exists(datei):
        subprocess.run(["curl", "-s", "-f", "-o", datei, BASIS + code], check=True, timeout=60)
        time.sleep(0.5)
    return open(datei, encoding="utf-8").read()


def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def lies_seite(h):
    code = re.search(r'class="tooltip font_ganzercode">([^<]+)<', h)
    titel = re.search(r'class="komptitelnr">\d+</p><p>(.*?)</p>', h, re.S)
    stufen = []
    # Jede Stufe beginnt mit komp_row; der OP-Marker steht am Ende derselben Zeile.
    teile = re.split(r'<div class="twelve columns komp_row', h)[1:]
    for t in teile:
        lit = re.search(r'kompetenz_lit" title="([^"]+)"', t)
        if not lit:
            continue
        zyk = re.search(r'title="Auftrag (\d)\. Zyklus"', t)
        punkte = [text(li) for li in re.findall(r"<li>(.*?)</li>", t, re.S)]
        stufen.append({
            "code": lit.group(1),
            "zyklus": int(zyk.group(1)) if zyk else None,
            "ga": t.lstrip().startswith(" mindestanspruch") or "mindestanspruch" in t[:60],
            "op": "marker_z2_op" in t,
            "op3": "marker_z3_op" in t,
            # Die letzte Stufe einer Seite schliesst ihre Liste nicht; die Fusszeile hängt dann mit dran.
            "text": punkte[:punkte.index("Impressum")] if "Impressum" in punkte else punkte,
        })
    return {"code": code.group(1).strip() if code else None,
            "titel": text(titel.group(1)) if titel else None, "stufen": stufen}


def main():
    ziel = sys.argv[1]
    os.makedirs(ziel, exist_ok=True)
    alle = {}
    for fach, code in FAECHER.items():
        uebersicht = hole(code, ziel)
        links = sorted(set(re.findall(r"code=(a\|[0-9|]+)", uebersicht)),
                       key=lambda c: [int(x) for x in c.split("|")[1:]])
        alle[fach] = []
        for l in links:
            seite = lies_seite(hole(l, ziel))
            seite["url"] = BASIS + l
            alle[fach].append(seite)
        print(fach, len(links), "Seiten")
    json.dump(alle, open(os.path.join(ziel, "stufen.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)


main()
