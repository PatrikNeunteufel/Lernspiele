"""Prüft den Entwickler-Server (tools/entwickler_server.py) im Prozess, mit einem leeren Ordner statt des Repos
(Plan C12: NS3 a Version und Protokoll, ES1 a bis ES5 a zugelassene Aufsichten, ES3 a Eingang; LERN_Session27).

Der Server läuft auf einem freien Port nur auf 127.0.0.1; Schlüssel, Geheimnis, Prüfstand, Bemerkungen und Eingang liegen
in einem Zwischenordner, das Repo bleibt unberührt. Aufruf: python tools/pruefe_server.py (läuft mit den kurzen
Prüfungen, node tools/pruefe.js). Ende mit Code 1 bei Fehlern; die Schlusszeile kommt nach .temp/pruefung (HK1 a).
"""
import datetime
import json
import sys
import tempfile
import threading
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import entwickler_server as ES  # noqa: E402

fehler: list = []
faelle = 0


def gleich(ist, soll, was: str) -> None:
    global faelle
    faelle += 1
    if ist != soll:
        fehler.append(f"{was}: {ist!r} statt {soll!r}")


def anfrage(basis: str, pfad: str, daten: dict | None = None, kopf: dict | None = None) -> tuple:
    """(Status, JSON) einer GET- oder POST-Anfrage; kopf: weitere Kopfzeilen (etwa X-Forwarded-For)."""
    roh = None if daten is None else json.dumps(daten).encode("utf-8")
    req = urllib.request.Request(basis + pfad, data=roh, headers={"Content-Type": "application/json", **(kopf or {})})
    lies = lambda roh: json.loads(roh or b"{}") if roh[:1] in (b"{", b"[", b"") else {"_kein_json": True}
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, lies(r.read())
    except urllib.error.HTTPError as e:
        return e.code, lies(e.read())


def richte_ein(ordner: Path) -> None:
    """Alle Pfade des Servers in den Zwischenordner legen, mit leerem Prüfstand je App."""
    ES.SCHLUESSEL_DATEI = ordner / "entwickler.key"
    ES.SCHLUESSEL_DATEI.write_text("schluessel-der-entwicklung\n", encoding="utf-8")
    ES.ENTWICKLUNG_ORDNER = ordner / ".entwicklung"
    for app, a in ES.APPS.items():
        for feld in ("pruefstand", "bemerkungen", "eintraege", "eingang"):
            a[feld] = ordner / app / Path(a[feld]).name
        a["pruefstand"].parent.mkdir(parents=True, exist_ok=True)
        ES.schreibe_pruefstand(a, {art: {} for art in a["arten"]})


def pruefe(basis: str) -> None:
    E = "schluessel-der-entwicklung"
    # Version und Protokoll (NS3 a)
    st, j = anfrage(basis, "/entwicklung/status")
    gleich((st, j.get("server"), j.get("protokoll")), (200, ES.SERVER_VERSION, list(ES.PROTOKOLLE)), "status: Version und Protokolle")
    st, j = anfrage(basis, "/entwicklung/bemerkung", {"protokoll": 99, "schluessel": E, "text": "x"})
    gleich(st, 409, "anderes Protokoll abgewiesen")

    # Schlüssel je Aufsicht (ES1 a): an Name, E-Mail und Geheimnis gebunden, wiederholbar, --neu ersetzt
    k1 = ES.zulassen("Anna Muster", "Anna@Schule.ch")
    gleich(ES.aufsicht_schluessel("Anna Muster", "anna@schule.ch", 1), k1, "Schlüssel: dieselben Angaben, E-Mail ohne Gross/klein")
    gleich(ES.aufsicht_schluessel("Anna Muster", "andere@schule.ch", 1) != k1, True, "Schlüssel: andere E-Mail, anderer Schlüssel")
    gleich(len(k1.replace("-", "")), 20, "Schlüssel: 20 Zeichen in Gruppen")
    try:
        ES.zulassen("Anna Muster", "anna@schule.ch")
        gleich("zugelassen", "abgewiesen", "zweimal zulassen ohne --neu")
    except ValueError:
        gleich(True, True, "zweimal zulassen ohne --neu abgewiesen")
    # Gespeichert: kein Schlüssel, keine E-Mail (ES2 a)
    roh = (ES.ENTWICKLUNG_ORDNER / "zugelassen.json").read_text(encoding="utf-8")
    gleich(("schule.ch" in roh.lower(), k1 in roh, sorted(json.loads(roh)[0])), (False, False, ["am", "gesperrt", "hash", "name", "zaehler"]),
           "zugelassen.json: ohne E-Mail und ohne Schlüssel")

    # Freischalten (Rolle, Name vom Server; klein und ohne Bindestriche getippt geht auch)
    gleich(anfrage(basis, "/entwicklung/freischalten", {"schluessel": E}), (200, {"ok": True, "rolle": "entwicklung", "name": ""}), "freischalten: Entwicklung")
    gleich(anfrage(basis, "/entwicklung/freischalten", {"schluessel": k1.replace("-", "").lower()}), (200, {"ok": True, "rolle": "aufsicht", "name": "Anna Muster"}),
           "freischalten: Aufsicht, klein ohne Bindestriche")
    gleich(anfrage(basis, "/entwicklung/freischalten", {"schluessel": "falsch"})[0], 403, "freischalten: falscher Schlüssel")

    # Prüfvermerk einer Aufsicht geht in den Eingang, nicht in pruefstand.js (ES3 a); Name vom Server, nicht von der Seite
    ep = ES.APPS["eulenpfad"]
    st, j = anfrage(basis, "/entwicklung/pruefstand", {"app": "eulenpfad", "schluessel": k1, "art": "spiele", "id": "zahlenhaus", "geprueft": True, "von": "Hacker"})
    gleich((st, j.get("eingereicht"), j.get("nr"), j.get("stand", {}).get("spiele")), (200, True, 1, {}), "Aufsicht: eingereicht, Prüfstand unverändert")
    gleich(ES.lies_pruefstand(ep)["spiele"], {}, "pruefstand.js nach dem Einreichen unverändert")
    eingang = ES.lies_eingang(ep)
    gleich([(v["von"], v["pfad"], v["inhalt"].get("id"), v["status"]) for v in eingang], [("Anna Muster", "pruefstand", "zahlenhaus", "offen")],
           "Eingang: Name der Zulassung, Inhalt, offen")
    st, j = anfrage(basis, "/entwicklung/pruefstand", {"app": "eulenpfad", "schluessel": k1, "art": "spiele", "id": "zahlenhaus", "geprueft": True})
    gleich((j.get("nr"), len(ES.lies_eingang(ep))), (1, 1), "derselbe Vermerk nur einmal im Eingang")
    st, j = anfrage(basis, "/entwicklung/eintraege", {"app": "eulenpfad", "schluessel": k1, "liste": "zahlenhaus/woerter", "setzen": ["a:1"], "komplett": True})
    gleich((st, j.get("eingereicht"), ES.lies_pruefstand(ep)["listen"]), (200, True, {}), "Aufsicht: Liste eingereicht, nicht geprüft")
    gleich(anfrage(basis, "/entwicklung/bemerkung-status", {"app": "eulenpfad", "schluessel": k1, "nr": 1, "status": "erledigt"})[0], 403,
           "Aufsicht setzt keinen Status einer Bemerkung")
    st, j = anfrage(basis, "/entwicklung/bemerkung", {"app": "eulenpfad", "schluessel": k1, "text": "Tippfehler", "von": "Hacker"})
    gleich((st, j.get("von")), (200, "Anna Muster"), "Aufsicht: Bemerkung unter ihrem Namen")

    # Die Entwicklung schreibt weiter direkt
    st, j = anfrage(basis, "/entwicklung/pruefstand", {"app": "eulenpfad", "schluessel": E, "art": "spiele", "id": "zahlenhaus", "geprueft": True, "von": "Patrik"})
    gleich((st, "eingereicht" in j, sorted(j.get("spiele", {}))), (200, False, ["zahlenhaus"]), "Entwicklung: Prüfstand direkt geschrieben")
    gleich(anfrage(basis, "/entwicklung/bemerkung-status", {"app": "eulenpfad", "schluessel": E, "nr": 1, "status": "erledigt"})[0], 200,
           "Entwicklung setzt den Status")

    # Gesperrt und ersetzt (--sperren, --neu)
    k2 = ES.zulassen("Anna Muster", "anna@schule.ch", neu=True)
    gleich((k2 != k1, anfrage(basis, "/entwicklung/freischalten", {"schluessel": k1})[0], anfrage(basis, "/entwicklung/freischalten", {"schluessel": k2})[0]),
           (True, 403, 200), "--neu: alter Schlüssel gilt nicht mehr, neuer schon")
    gleich(ES.sperre_aufsicht("Anna Muster"), True, "sperren")
    gleich(anfrage(basis, "/entwicklung/pruefstand", {"app": "eulenpfad", "schluessel": k2, "art": "spiele", "id": "x", "geprueft": True})[0], 403,
           "gesperrte Aufsicht reicht nichts mehr ein")


def pruefe_unterschrift(basis: str) -> None:
    """NS2 a, NS2-K a: Der Server unterschreibt mit openssl, der Kern prüft mit WebCrypto — dieselbe Prüfung wie im Browser."""
    import subprocess
    st, j = anfrage(basis, "/entwicklung/status?zufall=00112233445566778899aabbccddeeff")
    gleich("unterschrift" in j, False, "ohne Schlüsselpaar: keine Unterschrift")
    gleich(ES.openssl() is not None, True, "openssl gefunden")
    oeff = ES.neues_schluesselpaar(eintragen=None)
    gleich((ES.privat_datei().exists(), len(oeff) > 80), (True, True), "Schlüsselpaar erzeugt, öffentlicher Schlüssel als SPKI")
    kern = Path(__file__).resolve().parent.parent / "kern" / "entwicklung.js"
    pruefe_js = ("require(process.argv[1]);const st=JSON.parse(process.argv[2]);"
                 "globalThis.KERN.entwicklung.unterschriftEcht(st,process.argv[3],process.argv[4]).then(v=>console.log(v))")
    echt = lambda antwort, zufall, schluessel=oeff: subprocess.run(["node", "-e", pruefe_js, str(kern), json.dumps(antwort), zufall, schluessel],
                                                                     capture_output=True, text=True, timeout=30).stdout.strip()
    for n in range(5):  # mehrere Unterschriften: auch solche mit führender Null in r oder s (DER → r‖s)
        z = f"{n:02x}" * 16
        st, j = anfrage(basis, f"/entwicklung/status?zufall={z}")
        gleich(echt(j, z), "true", f"Unterschrift {n + 1} von openssl besteht die WebCrypto-Prüfung im Kern")
    z = "ab" * 16
    st, j = anfrage(basis, f"/entwicklung/status?zufall={z}")
    gleich(echt(j, "cd" * 16), "false", "Unterschrift einer anderen Zufallszahl: nicht echt")
    anderer = ES.neues_schluesselpaar(eintragen=None)  # ein fremder Server mit eigenem Paar unterschreibt jetzt
    st, j = anfrage(basis, f"/entwicklung/status?zufall={z}")
    gleich((anderer != oeff, echt(j, z, oeff), echt(j, z, anderer)), (True, "false", "true"),
           "fremdes Schlüsselpaar: gegen den Schlüssel der Entwicklung nicht echt, gegen seinen eigenen schon")
    st, j = anfrage(basis, "/entwicklung/status?zufall=nichthex")
    gleich("unterschrift" in j, False, "keine Zufallszahl aus Hex: nichts unterschrieben")
    ES.privat_datei().unlink()


def pruefe_netz(basis: str, ordner: Path) -> None:
    """NS1 a: Betrieb im Netz — kein Repo, Meldungen ohne Schlüssel mit Grenze, Vermerke ohne Stand, holen und senden."""
    import urllib.error as UE
    import entwicklung_abgleich as EA
    E = "schluessel-der-entwicklung"
    ES.NETZ = True
    try:
        gleich(anfrage(basis, "/eulenpfad/index.html")[0], 404, "im Netz: keine Dateien des Repos")
        gleich(anfrage(basis, "/entwicklung/bemerkungen?app=eulenpfad")[0], 404, "im Netz: Bemerkungen nicht ohne Schlüssel lesbar")
        m = {"app": "eulenpfad", "meldung": "M-mwaxyz12-ab12", "text": "3 H 4 Z ist 340", "spiel": "zahlenhaus", "stufe": "s3", "von": "Mia"}
        st, j = anfrage(basis, "/entwicklung/meldung", m)
        gleich((st, j.get("von"), j.get("meldung")), (200, "Meldung", "M-mwaxyz12-ab12"), "Meldung ohne Schlüssel angenommen, ohne Namen")
        gleich(anfrage(basis, "/entwicklung/meldung", m)[1].get("nr"), j.get("nr"), "dieselbe Meldung nur einmal")
        gleich(anfrage(basis, "/entwicklung/meldung", {**m, "meldung": "kaputt"})[0], 400, "Meldung ohne gültige Kennung abgewiesen")
        ES.MELDUNGEN_JE_STUNDE, alt = 2, ES.MELDUNGEN_JE_STUNDE
        ES._meldezeiten.clear()
        codes = [anfrage(basis, "/entwicklung/meldung", {**m, "meldung": f"M-grenze{n}-ab"})[0] for n in range(3)]
        gleich(codes, [200, 200, 429], "Grenze je Absender und Stunde")
        # Hinter dem eigenen Proxy (--hinter-proxy): je Absender aus der letzten Angabe von X-Forwarded-For gezählt;
        # eine vorn selbst mitgeschickte Angabe zählt nicht
        ES._meldezeiten.clear()
        ES.HINTER_PROXY = True
        xff = lambda kette: {"X-Forwarded-For": kette}
        a1 = [anfrage(basis, "/entwicklung/meldung", {**m, "meldung": f"M-proxya{n}-ab"}, xff(f"9.9.9.{n}, 203.0.113.1"))[0] for n in range(3)]
        a2 = anfrage(basis, "/entwicklung/meldung", {**m, "meldung": "M-proxyb0-ab"}, xff("203.0.113.2"))[0]
        ES.HINTER_PROXY = False
        gleich((a1, a2), ([200, 200, 429], 200), "hinter dem Proxy: je Absender gezählt, selbst mitgeschickte Angabe zählt nicht")
        ES.MELDUNGEN_JE_STUNDE = alt
        ES._meldezeiten.clear()
        k = ES.zulassen("Eva Netz", "eva@schule.ch")
        st, j = anfrage(basis, "/entwicklung/pruefstand", {"app": "eulenpfad", "schluessel": k, "art": "spiele", "id": "kiosk-kasse", "geprueft": True})
        gleich((st, j.get("eingereicht"), "stand" in j), (200, True, False), "im Netz: Vermerk eingereicht, ohne Prüfstand in der Antwort")
        gleich(anfrage(basis, "/entwicklung/holen", {"app": "eulenpfad", "schluessel": k})[0], 403, "holen nur mit dem Schlüssel der Entwicklung")
        # Unterschrift aus der Sicht des Werkzeugs (openssl verify), wie vor holen und senden
        oeff = ES.neues_schluesselpaar(eintragen=None)
        z = "ab" * 16
        st, j = anfrage(basis, f"/entwicklung/status?zufall={z}")
        anderer = ES.neues_schluesselpaar(eintragen=None)
        gleich((EA.unterschrift_gueltig(j, z, oeff), EA.unterschrift_gueltig(j, z, anderer), EA.unterschrift_gueltig(j, "cd" * 16, oeff)),
               (True, False, False), "Werkzeug prüft die Unterschrift mit openssl: richtig, fremder Schlüssel, andere Zufallszahl")
        try:
            EA.pruefe_server("http://meldungen.beispiel.ch", oeff)
            gleich("angenommen", "abgewiesen", "Werkzeug: http im Netz")
        except RuntimeError:
            gleich(True, True, "Werkzeug: http im Netz abgewiesen")
        # holen und senden mit eigener lokaler Ablage (wie bei der Entwicklung)
        lokal = {"bemerkungen": ordner / "lokal" / "bemerkungen.json", "eingang": ordner / "lokal" / "eingang.json"}
        n1 = EA.holen(basis, "eulenpfad", E, "", lokal)
        n2 = EA.holen(basis, "eulenpfad", E, "", lokal)
        b = json.loads(lokal["bemerkungen"].read_text(encoding="utf-8"))
        meld = next(x for x in b if x.get("meldung") == "M-mwaxyz12-ab12")
        gleich((n1["bemerkungen"] >= 3, n1["eingang"] >= 1, n2, meld.get("quelle", "").startswith("127.0.0.1")), (True, True, {"bemerkungen": 0, "eingang": 0}, True),
               "holen: neu, beim zweiten Mal nichts doppelt, mit Quelle")
        meld["status"], meld["antwort"] = "erledigt 10.11.2026", "Danke, behoben!"
        lokal["bemerkungen"].write_text(json.dumps(b), encoding="utf-8")
        e = json.loads(lokal["eingang"].read_text(encoding="utf-8"))
        ev = next(x for x in e if x.get("von") == "Eva Netz")
        ev["status"] = "angenommen"
        lokal["eingang"].write_text(json.dumps(e), encoding="utf-8")
        s = EA.senden(basis, "eulenpfad", E, "", lokal)
        srv_b = next(x for x in ES.lies_bemerkungen(ES.APPS["eulenpfad"]) if x.get("meldung") == "M-mwaxyz12-ab12")
        srv_e = next(x for x in ES.lies_eingang(ES.APPS["eulenpfad"]) if x.get("nr") == ev["server_nr"])
        gleich((s["eingang"], srv_b.get("status"), srv_b.get("antwort"), srv_e.get("status")), (1, "erledigt 10.11.2026", "Danke, behoben!", "angenommen"),
               "senden: Status, Antwort und Entscheid zurück auf den Server")
        try:
            EA.holen(basis, "eulenpfad", k, "", lokal)
            gleich("geholt", "abgewiesen", "holen mit Schlüssel einer Aufsicht")
        except UE.HTTPError as err:
            gleich(err.code, 403, "holen mit Schlüssel einer Aufsicht abgewiesen")
        ES.privat_datei().unlink()
    finally:
        ES.NETZ = False


def pruefe_uebernehmen() -> None:
    """tools/entwicklung_abgleich.py nach docs/richtlinie_freigaben.md (ES3 a, SR1 a), im Lernsteig mit leerem Eingang."""
    import entwicklung_abgleich as EA
    app, a = "lernsteig", ES.APPS["lernsteig"]
    jetzt = "2026-11-10T10:00:00+01:00"
    ein = lambda von, id_, an=True: ES.reiche_ein(a, von, "pruefstand", {"art": "uebungen", "id": id_, "geprueft": an}, jetzt)
    reif = lambda id_: next((g for g in EA.freigaben(app) if g["ziel"][1] == id_), None)
    # Zwei neue Personen: nicht reif (niemand bewährt)
    ein("Bea", "terme"), ein("Cem", "terme")
    g = reif("terme")
    gleich((g["reif"], g["grund"], [p["stufe"] for p in g["personen"]]), (False, "niemand bewährt", ["neu", "neu"]), "zwei neue Personen: selbst ansehen")
    # Bea bewährt (5 angenommen): mit Cem reif
    b = EA.lies_bewertung()
    for n in range(5):
        EA.merke_entscheid(b, app, "Bea", 100 + n, "angenommen")
    EA.schreibe_bewertung(b)
    gleich(reif("terme")["reif"], True, "zwei Personen, eine bewährt: übernahmereif")
    # Bea allein bei einer anderen Übung: nicht reif
    ein("Bea", "brueche")
    gleich(reif("brueche")["grund"], "erst 1 Person", "eine bewährte Person allein: selbst ansehen")
    # Offene Meldung zur Übung: nicht reif
    ein("Cem", "brueche")
    a["bemerkungen"].write_text(json.dumps([{"nr": 1, "status": "offen", "inhalt": "brueche", "text": "falsch gewertet"}]), encoding="utf-8")
    gleich(reif("brueche")["grund"], "offene Meldung", "offene Meldung: selbst ansehen")
    # --reife: nur terme in den Prüfstand, mit beiden Namen; Bewertung zählt mit
    gleich(EA.reife_annehmen(app), [("uebungen", "terme", True)], "--reife nimmt nur die übernahmereife an")
    stand = ES.lies_pruefstand(a)
    gleich((sorted(stand["uebungen"]), stand["uebungen"]["terme"]["von"]), (["terme"], "Bea, Cem"), "Prüfstand mit beiden Namen")
    gleich(EA.stufe(EA.lies_bewertung(), app, "Cem", set())["angenommen"], 1, "Bewertung: Cem 1 angenommen")
    # Ablehnen: Bea verliert „bewährt“ (Ablehnung unter den letzten 10)
    nr = next(v["nr"] for v in ES.lies_eingang(a) if v["von"] == "Bea" and v["inhalt"]["id"] == "brueche")
    EA.entscheide(app, {nr}, "abgelehnt")
    gleich((EA.stufe(EA.lies_bewertung(), app, "Bea", set())["stufe"], "brueche" in ES.lies_pruefstand(a)["uebungen"]), ("neu", False),
           "Ablehnung: nicht im Prüfstand, Bea nicht mehr bewährt")
    # Zurücknehmen: Cems angenommener Vermerk fällt aus dem Prüfstand
    gleich(EA.zuruecknehmen(app, "Cem"), [("uebungen", "terme", True)], "zurücknehmen nennt den Vermerk")
    gleich("terme" in ES.lies_pruefstand(a)["uebungen"], False, "zurückgenommen: nicht mehr im Prüfstand")
    # Gesperrte Person zählt nicht
    ES.zulassen("Dora", "dora@schule.ch")
    ES.sperre_aufsicht("Dora")
    ein("Dora", "zufall"), ein("Bea", "zufall")
    gleich([p["name"] for p in reif("zufall")["personen"]], ["Bea"], "gesperrte Person zählt nicht")
    # Liste: Haken je Eintrag und „geprüft“ nach dem Annehmen
    v = ES.reiche_ein(a, "Bea", "eintraege", {"liste": "zufall/woerter", "setzen": ["a:1", "b:2"], "komplett": True, "hash": "abc"}, jetzt)
    EA.entscheide(app, {v["nr"]}, "angenommen")
    gleich((ES.lies_pruefstand(a)["listen"].get("zufall/woerter", {}).get("hash"), sorted(ES.lies_eintraege(a).get("zufall/woerter", {}))),
           ("abc", ["a:1", "b:2"]), "Liste angenommen: geprüft mit Hash, Haken je Eintrag")


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    with tempfile.TemporaryDirectory() as t:
        richte_ein(Path(t))
        server = ES.Server(("127.0.0.1", 0), ES.Handler)
        ES.Handler.log_message = lambda *a, **k: None  # keine Zeile je Anfrage
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            pruefe(f"http://127.0.0.1:{server.server_address[1]}")
            pruefe_uebernehmen()
            pruefe_unterschrift(f"http://127.0.0.1:{server.server_address[1]}")
            pruefe_netz(f"http://127.0.0.1:{server.server_address[1]}", Path(t))
        except Exception as e:  # ein Absturz ist ein Fehler, kein Abbruch ohne Schlusszeile
            fehler.append(f"Abbruch: {type(e).__name__}: {e}")
        finally:
            server.shutdown()
            server.server_close()
    for f in fehler:
        print(f"    FEHLER  {f}")
    schluss = f"{faelle} Fälle, {len(fehler)} Fehler."
    print(schluss)
    merke(schluss)
    return 1 if fehler else 0


def merke(zeile: str) -> None:
    """Schlusszeile wie tools/testausgabe.js nach .temp/pruefung/pruefe_server.json (HK1 a); stört den Test nie."""
    try:
        ordner = Path(__file__).resolve().parent.parent / ".temp" / "pruefung"
        ordner.mkdir(parents=True, exist_ok=True)
        datei = ordner / "pruefe_server.json"
        laeufe = json.loads(datei.read_text(encoding="utf-8")) if datei.exists() else []
        jetzt = datetime.datetime.now()
        laeufe.append({"tag": jetzt.strftime("%Y-%m-%d"), "zeit": datetime.datetime.now(datetime.timezone.utc).isoformat(), "aufruf": " ".join(sys.argv[1:]),
                       "zeile": zeile})
        datei.write_text(json.dumps(laeufe[-50:], ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    except Exception:
        pass


if __name__ == "__main__":
    sys.exit(main())
