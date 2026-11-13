"""Eingereichte Prüfvermerke zugelassener Aufsichten übernehmen (Plan C12, ES3 a, SR1 a; LERN_Session27).

Regeln: docs/richtlinie_freigaben.md. Zugelassene Aufsichten reichen Vermerke über den Entwickler-Server ein; sie liegen
in docs/<app>/pruefstand-eingang.json (gitignored). Dieses Werkzeug zeigt sie gruppiert je Freigabe mit den
einreichenden Personen und ihrer Stufe, markiert „übernahmereif“ oder „selbst ansehen“ und trägt angenommene Vermerke in
den Prüfstand der App ein (pruefstand.js, danach Commit und Push durch die Entwicklung). Übernommen wird nie von selbst.
Die Bewertung je Person liegt nur bei der Entwicklung, in .entwicklung/bewertung.json (gitignored).

Aufruf:
    python tools/entwicklung_abgleich.py uebernehmen [app]                 Eingang zeigen (Standard: alle Apps)
    python tools/entwicklung_abgleich.py uebernehmen app --reife           alle übernahmereifen annehmen
    python tools/entwicklung_abgleich.py uebernehmen app --annehmen 3,5    Vermerke Nr. 3 und 5 (mit ihrer Freigabe) annehmen
    python tools/entwicklung_abgleich.py uebernehmen app --ablehnen 4      Vermerk Nr. 4 (mit seiner Freigabe) ablehnen
    python tools/entwicklung_abgleich.py uebernehmen app --zuruecknehmen "Vorname Name"   alle angenommenen Vermerke
                                                                           der Person aus dem Prüfstand nehmen
    python tools/entwicklung_abgleich.py holen --server https://… [app]    Meldungen, Bemerkungen und Vermerke vom
                                                                           Meldungsserver im Netz holen (NS1 a)
    python tools/entwicklung_abgleich.py senden --server https://… [app]   Status, Antworten und Entscheide zurück
Vor holen und senden muss sich der Server mit der Unterschrift der Entwicklung ausweisen (NS2 a, SERVER_SCHLUESSEL in
kern/entwicklung.js); erst dann geht der Schlüssel der Entwicklung (entwickler.key) an ihn. Ein Server auf diesem Gerät
(localhost) darf ohne Unterschrift.
"""
import datetime
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import entwickler_server as ES  # noqa: E402

# Schwellen der Richtlinie (docs/richtlinie_freigaben.md, Abschnitt 6: nur mit Eintrag dort ändern)
BEWAEHRT_AB = 5        # angenommene Vermerke
OHNE_ABLEHNUNG_IN = 10  # unter den letzten so vielen entschiedenen keine Ablehnung
MIN_PERSONEN = 2       # verschiedene Personen je übernahmereifer Freigabe


# ----- Bewertung je Person (nur bei der Entwicklung) -----
def bewertung_datei() -> Path:
    return ES.ENTWICKLUNG_ORDNER / "bewertung.json"


def lies_bewertung() -> dict:
    p = bewertung_datei()
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}


def schreibe_bewertung(b: dict) -> None:
    ES.ENTWICKLUNG_ORDNER.mkdir(parents=True, exist_ok=True)
    bewertung_datei().write_bytes((json.dumps(b, ensure_ascii=False, indent=1) + "\n").encode("utf-8"))


def merke_entscheid(b: dict, app: str, name: str, nr: int, ergebnis: str) -> None:
    """ergebnis: angenommen, abgelehnt oder zurueckgenommen (zählt wie eine Ablehnung, Richtlinie 2)."""
    b.setdefault(app, {}).setdefault(name, []).append({"nr": nr, "am": datetime.date.today().isoformat(), "ergebnis": ergebnis})


def stufe(b: dict, app: str, name: str, gesperrt: set) -> dict:
    """{ stufe: neu | bewährt | gesperrt, angenommen, abgelehnt } nach Richtlinie 2."""
    e = b.get(app, {}).get(name, [])
    angenommen = sum(1 for x in e if x["ergebnis"] == "angenommen")
    abgelehnt = sum(1 for x in e if x["ergebnis"] != "angenommen")
    if name in gesperrt:
        s = "gesperrt"
    elif angenommen >= BEWAEHRT_AB and all(x["ergebnis"] == "angenommen" for x in e[-OHNE_ABLEHNUNG_IN:]):
        s = "bewährt"
    else:
        s = "neu"
    return {"stufe": s, "angenommen": angenommen, "abgelehnt": abgelehnt}


def gesperrte() -> set:
    return {z["name"] for z in ES.lies_zugelassen() if z.get("gesperrt")}


# ----- Freigaben aus dem Eingang -----
def ziel(v: dict) -> tuple:
    """Wofür ein Vermerk steht: (art, id, wert) — Spiel/Übung angesehen oder Liste geprüft, an oder aus."""
    i = v["inhalt"]
    if v["pfad"] == "pruefstand":
        return (i.get("art"), i.get("id"), bool(i.get("geprueft")))
    return ("listen", i.get("liste"), bool(i.get("komplett")))


def offene_meldung(app: str, art: str, id_: str) -> bool:
    """Liegt eine offene Bemerkung oder Meldung zum selben Spiel, zur selben Übung oder Liste vor (Richtlinie 3.3)?"""
    a = ES.APPS[app]
    for b in ES.lies_bemerkungen(a) if a["bemerkungen"].exists() else []:
        if b.get("status", "offen") != "offen":
            continue
        if art == "listen" and b.get("liste") == id_:
            return True
        if art != "listen" and id_ in (b.get("spiel"), b.get("inhalt")):
            return True
    return False


def freigaben(app: str) -> list:
    """Offene Vermerke gruppiert je Ziel: [{ ziel, vermerke, personen: [{name, stufe…}], reif, grund }]."""
    b, gesperrt = lies_bewertung(), gesperrte()
    gruppen: dict = {}
    for v in ES.lies_eingang(ES.APPS[app]):
        if v.get("status") == "offen":
            gruppen.setdefault(ziel(v), []).append(v)
    aus = []
    for z, vs in gruppen.items():
        namen = sorted({v["von"] for v in vs if v["von"] not in gesperrt})
        personen = [{"name": n, **stufe(b, app, n, gesperrt)} for n in namen]
        gruende = []
        if len(namen) < MIN_PERSONEN:
            gruende.append(f"erst {len(namen)} Person{'en' if len(namen) != 1 else ''}")
        if not any(p["stufe"] == "bewährt" for p in personen):
            gruende.append("niemand bewährt")
        if offene_meldung(app, z[0], z[1]):
            gruende.append("offene Meldung")
        aus.append({"ziel": z, "vermerke": vs, "personen": personen, "reif": not gruende, "grund": ", ".join(gruende)})
    return sorted(aus, key=lambda g: (not g["reif"], g["ziel"][0], g["ziel"][1] or ""))


# ----- Annehmen, ablehnen, zurücknehmen -----
def wende_an(app: str, vs: list, jetzt: str) -> None:
    """Die Vermerke einer Freigabe in pruefstand.js (und bei Listen die Haken je Eintrag) eintragen."""
    a = ES.APPS[app]
    stand = ES.lies_pruefstand(a)
    art, id_, an = ziel(vs[0])
    von = ", ".join(sorted({v["von"] for v in vs}))[:40]
    if art == "listen":
        haken_alle = ES.lies_eintraege(a)
        haken = haken_alle.setdefault(id_, {})
        for v in vs:
            inhalt = v["inhalt"].get("inhalt") if isinstance(v["inhalt"].get("inhalt"), dict) else {}
            for s in v["inhalt"].get("setzen", []):
                # mit den Fingerabdrücken von Zeile und Zellen, wie beim Server (ÜB1 a)
                haken[s] = {"am": jetzt[:10], "von": v["von"], **ES.inhalt_eines_hakens(inhalt.get(s))}
            for s in v["inhalt"].get("entfernen", []):
                haken.pop(s, None)
        if not haken:
            haken_alle.pop(id_, None)
        a["eintraege"].write_bytes((json.dumps(haken_alle, ensure_ascii=False, indent=1, sort_keys=True) + "\n").encode("utf-8"))
    if an:
        eintrag = {"am": jetzt[:10], "von": von}
        if art == "listen" and vs[-1]["inhalt"].get("hash"):
            eintrag["hash"] = str(vs[-1]["inhalt"]["hash"])[:20]
        stand.setdefault(art, {})[id_] = eintrag
    else:
        stand.get(art, {}).pop(id_, None)
    ES.schreibe_pruefstand(a, stand)


def entscheide(app: str, nummern: set, ergebnis: str) -> list:
    """Vermerke mit diesen Nummern samt den übrigen offenen ihrer Freigabe annehmen oder ablehnen; gibt die Ziele zurück."""
    a = ES.APPS[app]
    eingang = ES.lies_eingang(a)
    ziele = {ziel(v) for v in eingang if v["nr"] in nummern and v.get("status") == "offen"}
    jetzt = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
    b = lies_bewertung()
    for z in ziele:
        vs = [v for v in eingang if ziel(v) == z and v.get("status") == "offen"]
        if ergebnis == "angenommen":
            wende_an(app, vs, jetzt)
        for v in vs:
            v["status"] = ergebnis
            v["entschieden"] = jetzt
            merke_entscheid(b, app, v["von"], v["nr"], ergebnis)
    a["eingang"].write_bytes((json.dumps(eingang, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    schreibe_bewertung(b)
    return sorted(ziele, key=str)


def reife_annehmen(app: str) -> list:
    nummern = {v["nr"] for g in freigaben(app) if g["reif"] for v in g["vermerke"]}
    return entscheide(app, nummern, "angenommen") if nummern else []


def zuruecknehmen(app: str, name: str) -> list:
    """Alle angenommenen Vermerke der Person zurücknehmen: aus dem Prüfstand, zählt wie eine Ablehnung (Richtlinie 2)."""
    a = ES.APPS[app]
    eingang = ES.lies_eingang(a)
    stand = ES.lies_pruefstand(a)
    jetzt = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
    b = lies_bewertung()
    ziele = []
    for v in eingang:
        if v["von"] != name or v.get("status") != "angenommen":
            continue
        art, id_, an = ziel(v)
        if an:
            stand.get(art, {}).pop(id_, None)
        v["status"] = "zurueckgenommen"
        v["entschieden"] = jetzt
        merke_entscheid(b, app, name, v["nr"], "zurueckgenommen")
        ziele.append((art, id_, an))
    ES.schreibe_pruefstand(a, stand)
    a["eingang"].write_bytes((json.dumps(eingang, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    schreibe_bewertung(b)
    return ziele


# ----- holen und senden: Abgleich mit dem Meldungsserver im Netz (NS1 a, ES3 a) -----
# Vor jedem Abgleich weist sich der Server mit seiner Unterschrift aus (NS2 a): nur dann bekommt er den Schlüssel der
# Entwicklung. Ein Server auf diesem Gerät (localhost) darf ohne Unterschrift.
import re  # noqa: E402
import secrets  # noqa: E402
import subprocess  # noqa: E402
import tempfile  # noqa: E402
import urllib.parse  # noqa: E402
import urllib.request  # noqa: E402


def server_schluessel_aus_kern() -> str:
    t = (Path(ES.ENTWICKLUNG_JS)).read_text(encoding="utf-8")
    m = re.search(r'const SERVER_SCHLUESSEL = "([A-Za-z0-9+/=]*)";', t)
    return m.group(1) if m else ""


def roh_zu_der(roh: bytes) -> bytes:
    """r‖s (je 32 Byte) wieder als DER, für openssl dgst -verify."""
    def zahl(b: bytes) -> bytes:
        b = b.lstrip(b"\x00") or b"\x00"
        if b[0] & 0x80:
            b = b"\x00" + b
        return b"\x02" + bytes([len(b)]) + b
    inhalt = zahl(roh[:32]) + zahl(roh[32:])
    return b"\x30" + bytes([len(inhalt)]) + inhalt


def unterschrift_gueltig(st: dict, zufall: str, oeffentlich_b64: str) -> bool:
    import base64
    if not oeffentlich_b64 or not st.get("unterschrift") or not ES.openssl():
        return False
    pem = "-----BEGIN PUBLIC KEY-----\n" + "\n".join(oeffentlich_b64[i:i + 64] for i in range(0, len(oeffentlich_b64), 64)) + "\n-----END PUBLIC KEY-----\n"
    text = f"{ES.UNTERSCHRIFT_ZWECK}|{zufall}|{st.get('server', '')}".encode("utf-8")
    with tempfile.TemporaryDirectory() as t:
        (Path(t) / "oeff.pem").write_text(pem, encoding="ascii")
        (Path(t) / "u.der").write_bytes(roh_zu_der(base64.b64decode(st["unterschrift"])))
        r = subprocess.run([ES.openssl(), "dgst", "-sha256", "-verify", str(Path(t) / "oeff.pem"), "-signature", str(Path(t) / "u.der")],
                           input=text, capture_output=True, timeout=10)
    return r.returncode == 0


def auf_diesem_geraet(url: str) -> bool:
    return urllib.parse.urlparse(url).hostname in ("localhost", "127.0.0.1")


def frage(url: str, pfad: str, daten: dict | None = None) -> dict:
    roh = None if daten is None else json.dumps(daten).encode("utf-8")
    req = urllib.request.Request(url.rstrip("/") + pfad, data=roh, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read() or b"{}")


def pruefe_server(url: str, oeffentlich_b64: str) -> dict:
    """Status mit Zufallszahl; wirft, wenn der Server im Netz nicht mit dem Schlüssel der Entwicklung unterschreibt."""
    if not url.startswith("https://") and not auf_diesem_geraet(url):
        raise RuntimeError("Im Netz nur über https.")
    zufall = secrets.token_hex(16)
    st = frage(url, f"/entwicklung/status?zufall={zufall}")
    if not auf_diesem_geraet(url) and not unterschrift_gueltig(st, zufall, oeffentlich_b64):
        raise RuntimeError(f"{url} weist sich nicht als Server der Entwicklung aus — der Schlüssel der Entwicklung geht nicht dorthin.")
    return st


def schluessel_der_entwicklung() -> str:
    if not ES.SCHLUESSEL_DATEI.exists():
        raise RuntimeError("entwickler.key fehlt: python tools/entwickler_server.py --neuer-schluessel")
    return ES.SCHLUESSEL_DATEI.read_text(encoding="utf-8").strip()


def holen(url: str, app: str, schluessel: str, oeffentlich_b64: str, lokal: dict | None = None) -> dict:
    """Meldungen, Bemerkungen und eingereichte Vermerke vom Server in die lokalen Dateien (gitignored), nach Kennung
    vereinigt: eine Meldung nur einmal, sonst je Server und Nummer (quelle, server_nr). → { bemerkungen, eingang } neu.
    lokal: { bemerkungen, eingang } als Pfade (Standard: die der App im Repo)."""
    pruefe_server(url, oeffentlich_b64)
    a = lokal or ES.APPS[app]
    quelle = urllib.parse.urlparse(url).netloc
    d = frage(url, "/entwicklung/holen", {"schluessel": schluessel, "app": app, "protokoll": ES.PROTOKOLLE[1]})
    neu = {"bemerkungen": 0, "eingang": 0}
    lokal = ES.lies_bemerkungen(a) if a["bemerkungen"].exists() else []
    for b in d.get("bemerkungen", []):
        if b.get("meldung") and any(x.get("meldung") == b["meldung"] for x in lokal):
            continue
        if any(x.get("quelle") == quelle and x.get("server_nr") == b.get("nr") for x in lokal):
            continue
        lokal.append({**b, "nr": max((x["nr"] for x in lokal), default=0) + 1, "quelle": quelle, "server_nr": b.get("nr")})
        neu["bemerkungen"] += 1
    eingang = ES.lies_eingang(a)
    for v in d.get("eingang", []):
        if any(x.get("quelle") == quelle and x.get("server_nr") == v.get("nr") for x in eingang):
            continue
        eingang.append({**v, "nr": max((x["nr"] for x in eingang), default=0) + 1, "quelle": quelle, "server_nr": v.get("nr")})
        neu["eingang"] += 1
    for datei, inhalt in ((a["bemerkungen"], lokal), (a["eingang"], eingang)):
        datei.parent.mkdir(parents=True, exist_ok=True)
        datei.write_bytes((json.dumps(inhalt, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    return neu


def senden(url: str, app: str, schluessel: str, oeffentlich_b64: str, lokal: dict | None = None) -> dict:
    """Status und Antworten der Bemerkungen und die Entscheide über Vermerke zurück auf den Server, von dem sie kamen."""
    pruefe_server(url, oeffentlich_b64)
    a = lokal or ES.APPS[app]
    quelle = urllib.parse.urlparse(url).netloc
    bem = [{"nr": b["server_nr"], "status": b.get("status"), "antwort": b.get("antwort")}
           for b in (ES.lies_bemerkungen(a) if a["bemerkungen"].exists() else []) if b.get("quelle") == quelle]
    ein = [{"nr": v["server_nr"], "status": v["status"]} for v in ES.lies_eingang(a) if v.get("quelle") == quelle and v.get("status") != "offen"]
    frage(url, "/entwicklung/senden", {"schluessel": schluessel, "app": app, "protokoll": ES.PROTOKOLLE[1], "bemerkungen": bem, "eingang": ein})
    return {"bemerkungen": len(bem), "eingang": len(ein)}


# ----- Ausgabe -----
def zeige(app: str) -> None:
    gs = freigaben(app)
    print(f"\n{app}: {len(gs)} offene Freigabe{'n' if len(gs) != 1 else ''}"
          f" ({sum(g['reif'] for g in gs)} übernahmereif)")
    for g in gs:
        art, id_, an = g["ziel"]
        was = {"spiele": "Spiel", "uebungen": "Übung", "listen": "Liste"}.get(art, art)
        nummern = ",".join(str(v["nr"]) for v in g["vermerke"])
        personen = ", ".join(f"{p['name']} ({p['stufe']}, {p['angenommen']}/{p['abgelehnt']})" for p in g["personen"]) or "—"
        marke = "übernahmereif" if g["reif"] else f"selbst ansehen: {g['grund']}"
        print(f"  [{nummern}] {was} {id_} {'geprüft' if an else 'aufheben'} — {personen} — {marke}")


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    args = sys.argv[1:]
    if args and args[0] in ("holen", "senden"):
        url = args[args.index("--server") + 1] if "--server" in args and args.index("--server") + 1 < len(args) else None
        if not url:
            sys.exit(f"Aufruf: python tools/entwicklung_abgleich.py {args[0]} --server https://… [app]")
        try:
            for app in [a for a in args[1:] if a in ES.APPS] or list(ES.APPS):
                f = holen if args[0] == "holen" else senden
                n = f(url, app, schluessel_der_entwicklung(), server_schluessel_aus_kern())
                print(f"{app}: {args[0]} — {n['bemerkungen']} Bemerkung(en), {n['eingang']} Vermerk(e)")
        except (RuntimeError, OSError) as e:
            sys.exit(str(e))
        return 0
    if not args or args[0] != "uebernehmen":
        print(__doc__)
        return 2
    apps = [a for a in args[1:] if a in ES.APPS] or list(ES.APPS)
    wert = lambda schalter: args[args.index(schalter) + 1] if schalter in args and args.index(schalter) + 1 < len(args) else None
    handlung = next((s for s in ("--reife", "--annehmen", "--ablehnen", "--zuruecknehmen") if s in args), None)
    if handlung and len(apps) != 1:
        sys.exit("Für --reife, --annehmen, --ablehnen und --zuruecknehmen genau eine App nennen (eulenpfad oder lernsteig).")
    app = apps[0]
    if handlung == "--reife":
        z = reife_annehmen(app)
        print(f"Angenommen: {len(z)} Freigabe(n). Danach committen und pushen, dann gilt es für alle.")
    elif handlung in ("--annehmen", "--ablehnen"):
        nummern = {int(n) for n in (wert(handlung) or "").split(",") if n.strip().isdigit()}
        z = entscheide(app, nummern, "angenommen" if handlung == "--annehmen" else "abgelehnt")
        print(f"{'Angenommen' if handlung == '--annehmen' else 'Abgelehnt'}: {len(z)} Freigabe(n).")
    elif handlung == "--zuruecknehmen":
        name = wert("--zuruecknehmen") or ""
        z = zuruecknehmen(app, name)
        print(f"Zurückgenommen: {len(z)} Vermerk(e) von {name}. Sperren mit: python tools/entwickler_server.py --sperren \"{name}\"")
    for a in apps:
        zeige(a)
    return 0


if __name__ == "__main__":
    sys.exit(main())
