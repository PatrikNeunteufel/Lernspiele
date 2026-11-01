"""Karte der Schweiz für die Schweiz-Karten-Suche (Entscheid K3 a, LERN_Session6).

Liest swissBOUNDARIES3D von swisstopo (GeoPackage, Koordinaten LV95) und schreibt vereinfachte
SVG-Pfade nach eulenpfad/spiele/schweiz-karte/karte.js: Landesgrenze, 26 Kantone, die Wahlkreise des
Kantons St. Gallen und Orte als Punkte (Kantonshauptorte, Gemeinden ab 15 000 Einwohnern, im Kanton
St. Gallen ab 8000). Nur Standardbibliothek: die Geometrie (GeoPackage-Kopf + WKB) wird selbst gelesen
und mit Douglas-Peucker vereinfacht.

Aufruf:
    python tools/karte_schweiz.py <pfad/zu/swissBOUNDARIES3D.gpkg>
"""
import json
import sqlite3
import struct
import sys
from pathlib import Path

ZIEL = Path(__file__).resolve().parent.parent / "eulenpfad" / "spiele" / "schweiz-karte" / "karte.js"
TOLERANZ = 250            # m: Douglas-Peucker; feiner sieht man auf dem Tablet nicht
MIN_FLAECHE = 0.3e6       # m²: kleinere Inseln und Exklaven-Splitter weglassen
X0, Y0 = 2480000, 1300000 # oben links (LV95), Karte in km
BREITE, HOEHE = 360, 230  # km
EINWOHNER_MIN, EINWOHNER_MIN_SG = 15000, 8000
SG = 17
# Kantonshauptorte, Gemeindenamen wie in swissBOUNDARIES3D (Kantonsnummer → Name)
HAUPTORTE = {1: "Zürich", 2: "Bern", 3: "Luzern", 4: "Altdorf (UR)", 5: "Schwyz", 6: "Sarnen", 7: "Stans", 8: "Glarus",
             9: "Zug", 10: "Fribourg", 11: "Solothurn", 12: "Basel", 13: "Liestal", 14: "Schaffhausen", 15: "Herisau",
             16: "Appenzell", 17: "St. Gallen", 18: "Chur", 19: "Aarau", 20: "Frauenfeld", 21: "Bellinzona",
             22: "Lausanne", 23: "Sion", 24: "Neuchâtel", 25: "Genève", 26: "Delémont"}


def polygone(blob: bytes) -> list:
    """GeoPackage-Geometrie → Liste von Polygonen, je eine Liste von Ringen [(x, y), …]."""
    flags = blob[3]
    umfang = {0: 0, 1: 32, 2: 48, 3: 48, 4: 64}[(flags >> 1) & 7]
    erg, _ = wkb(blob, 8 + umfang)
    return erg


def wkb(b: bytes, i: int):
    order = "<" if b[i] == 1 else ">"
    typ = struct.unpack_from(order + "I", b, i + 1)[0]
    i += 5
    z = bool(typ & 0x80000000) or (typ & 0xFFFF) // 1000 in (1, 3)
    m = bool(typ & 0x40000000) or (typ & 0xFFFF) // 1000 in (2, 3)
    dim = 2 + z + m
    basis = (typ & 0xFFFF) % 1000
    if basis == 3:  # Polygon
        n = struct.unpack_from(order + "I", b, i)[0]; i += 4
        ringe = []
        for _ in range(n):
            k = struct.unpack_from(order + "I", b, i)[0]; i += 4
            pts = []
            for _ in range(k):
                x, y = struct.unpack_from(order + "dd", b, i); i += 8 * dim
                pts.append((x, y))
            ringe.append(pts)
        return [ringe], i
    if basis == 6:  # MultiPolygon
        n = struct.unpack_from(order + "I", b, i)[0]; i += 4
        alle = []
        for _ in range(n):
            teil, i = wkb(b, i)
            alle += teil
        return alle, i
    raise ValueError(f"Geometrietyp {typ} nicht unterstützt")


def vereinfache(pts: list, tol: float) -> list:
    """Douglas-Peucker (ohne Rekursion), Endpunkte bleiben."""
    if len(pts) < 4:
        return pts
    behalten = [False] * len(pts)
    behalten[0] = behalten[-1] = True
    stapel = [(0, len(pts) - 1)]
    while stapel:
        a, e = stapel.pop()
        (ax, ay), (ex, ey) = pts[a], pts[e]
        dx, dy = ex - ax, ey - ay
        laenge = (dx * dx + dy * dy) ** 0.5 or 1e-9
        best, wo = -1.0, -1
        for k in range(a + 1, e):
            px, py = pts[k]
            d = abs(dy * px - dx * py + ex * ay - ey * ax) / laenge if (dx or dy) else ((px - ax) ** 2 + (py - ay) ** 2) ** 0.5
            if d > best:
                best, wo = d, k
        if best > tol:
            behalten[wo] = True
            stapel += [(a, wo), (wo, e)]
    return [p for p, ja in zip(pts, behalten) if ja]


def flaeche(ring: list) -> float:
    return abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]))) / 2


def schwerpunkt(ring: list) -> tuple:
    a = cx = cy = 0.0
    for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
        f = x1 * y2 - x2 * y1
        a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f
    return (cx / (3 * a), cy / (3 * a)) if a else ring[0]


def km(x: float, y: float) -> tuple:
    return round((x - X0) / 1000, 1), round((Y0 - y) / 1000, 1)


def pfad(polys: list) -> str:
    """SVG-Pfad aller Ringe (Löcher mit fill-rule evenodd); kleine Teile fallen weg."""
    teile = []
    for ringe in polys:
        if flaeche(ringe[0]) < MIN_FLAECHE:
            continue
        for ring in ringe:
            r = vereinfache(ring, TOLERANZ)
            if len(r) < 4:
                continue
            punkte = [km(x, y) for x, y in r[:-1]]
            teile.append("M" + "L".join(f"{x:g} {y:g}" for x, y in punkte) + "Z")
    return "".join(teile)


def mitte(polys: list) -> list:
    groesster = max((r[0] for r in polys), key=flaeche)
    return list(km(*schwerpunkt(groesster)))


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    db = sqlite3.connect(sys.argv[1])
    land = db.execute("select geom from tlm_landesgebiet where name='Schweiz'").fetchone()[0]
    kantone = [{"nr": nr, "name": name, "d": pfad(polygone(g)), "mitte": mitte(polygone(g))}
               for nr, name, g in db.execute("select kantonsnummer, name, geom from tlm_kantonsgebiet order by kantonsnummer")]
    wahlkreise = [{"name": name, "d": pfad(polygone(g)), "mitte": mitte(polygone(g))}
                  for name, g in db.execute("select name, geom from tlm_bezirksgebiet where kantonsnummer=? order by name", (SG,))]
    orte = []
    for name, nr, ew, g in db.execute("select name, kantonsnummer, einwohnerzahl, geom from tlm_hoheitsgebiet where objektart='Gemeindegebiet'"):
        hauptort = HAUPTORTE.get(nr) == name
        if not (hauptort or (ew or 0) >= EINWOHNER_MIN or (nr == SG and (ew or 0) >= EINWOHNER_MIN_SG)):
            continue
        x, y = mitte(polygone(g))
        orte.append({"name": name, "kanton": nr, "x": x, "y": y, "einwohner": ew, **({"hauptort": True} if hauptort else {})})
    fehlt = [n for nr, n in HAUPTORTE.items() if not any(o["name"] == n and o["kanton"] == nr for o in orte)]
    if fehlt:
        sys.exit(f"Hauptorte nicht gefunden: {fehlt}")
    orte.sort(key=lambda o: -o["einwohner"])
    daten = {"breite": BREITE, "hoehe": HOEHE, "land": pfad(polygone(land)), "kantone": kantone,
             "wahlkreise": wahlkreise, "orte": orte}
    kopf = ("/* Karte der Schweiz für die Schweiz-Karten-Suche — erzeugt mit tools/karte_schweiz.py, nicht von Hand ändern.\n"
            "   Quelle: Bundesamt für Landestopografie swisstopo, swissBOUNDARIES3D (Stand 2026), vereinfacht\n"
            f"   (Toleranz {TOLERANZ} m). Koordinaten in km, Ursprung oben links (LV95 E {X0}, N {Y0}).\n"
            "   Orte: Mittelpunkt der Gemeindefläche (nicht der Ortskern). */\n")
    ZIEL.parent.mkdir(parents=True, exist_ok=True)
    ZIEL.write_bytes((kopf + "const KARTE = " + json.dumps(daten, ensure_ascii=False, separators=(",", ":")) + ";\n").encode("utf-8"))
    print(f"{ZIEL.name}: {ZIEL.stat().st_size // 1024} KB, {len(kantone)} Kantone, {len(wahlkreise)} Wahlkreise, {len(orte)} Orte")


if __name__ == "__main__":
    main()
