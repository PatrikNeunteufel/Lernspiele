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
Später (mit dem Meldungsserver im Netz, NS1): holen und senden.
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
            for s in v["inhalt"].get("setzen", []):
                haken[s] = {"am": jetzt[:10], "von": v["von"]}
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
