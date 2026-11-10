#!/usr/bin/env python3
"""git-Hook commit-msg (Entscheid HK2 a, LERN_Session23): Message gegen die geänderten Übungen und Spiele.

Anlass (LERN_Session22): Der Commit von franzoesisch-grammatik trug zuerst die Message von englisch-grammatik — beim
Einfügen war der Codeblock der Antwort davor kopiert worden. Aufgefallen erst beim nächsten Schritt.

Regel: Ändert der Commit Dateien einer Übung oder eines Spiels (lernsteig/uebungen/<id>/, eulenpfad/spiele/<id>/,
ohne gemeinsam/), muss mindestens eine dieser Ids in der Message stehen — als Id oder im Anzeigenamen („Steine
fangen“, „Würfel-Zähler“); sonst bricht der Commit mit einem Satz ab, der die Ids nennt. Sammel-Commits über mehr als
SAMMEL Übungen und Spiele bleiben ungeprüft. Gemeinsame Dateien (Kern, Doku, gemeinsam/) prüft der Hook nicht — dort gibt es keinen sicheren
Namen. Merge-, Revert-, fixup!- und squash!-Messages bleiben ungeprüft. Ein Commit nur mit neuer Message (amend ohne
Änderungen) hat keine Dateien und wird durchgelassen.

Eingeschaltet einmal je Klon (macht Patrik): git config core.hooksPath tools/git-hooks
Prüfen ohne Commit: python tools/git-hooks/commit_msg.py --verlauf [anzahl]  (jeder Commit des Verlaufs gegen seine Dateien)
"""

import re
import subprocess
import sys

ORDNER = [re.compile(r"^lernsteig/uebungen/([^/]+)/"), re.compile(r"^eulenpfad/spiele/([^/]+)/")]
AUSGENOMMEN = {"gemeinsam"}
# Sammel-Commits (eine Änderung über viele Spiele, etwa der Umzug auf den Kern) nennen eine Gruppe statt Ids; gemessen
# am Verlauf bis LERN_Session23: Fehlalarme nur ab 27 Ids, der Fall aus LERN_Session22 hatte eine. Darüber kein Abgleich.
SAMMEL = 10
UNGEPRUEFT = re.compile(r"^(Merge |Revert |fixup! |squash! )")


def ids_der_pfade(pfade):
    ids = []
    for p in pfade:
        p = p.replace("\\", "/")
        for m in (o.match(p) for o in ORDNER):
            if m and m.group(1) not in AUSGENOMMEN and m.group(1) not in ids:
                ids.append(m.group(1))
    return ids


UMLAUTE = str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "é": "e", "è": "e", "à": "a", "ç": "c"})


def genannt(id_, message):
    """Die Id als ganzes Wort (nicht als Teil einer längeren Id wie grammatik in englisch-grammatik), auch im
    Anzeigenamen: klein, Umlaute ausgeschrieben, Bindestrich der Id auch als Leerzeichen („Auge-Entdecker“,
    „Steine fangen“, „Würfel-Zähler“)."""
    teile = [re.escape(t) for t in id_.split("-")]
    muster = re.compile(r"(?<![\w-])" + r"[-\s]+".join(teile) + r"(?![\w-])")
    return muster.search(message.lower().translate(UMLAUTE)) is not None


def pruefe(message, pfade):
    """Fehlermeldung oder None."""
    text = "\n".join(z for z in message.splitlines() if not z.startswith("#")).strip()
    if not text or UNGEPRUEFT.match(text):
        return None
    ids = ids_der_pfade(pfade)
    if not ids or len(ids) > SAMMEL or any(genannt(i, text) for i in ids):
        return None
    return ("commit-msg (HK2 a): Der Commit ändert " + ", ".join(ids) + ", die Message nennt "
            + ("keine davon" if len(ids) > 1 else "sie nicht") + ".\n"
            + "Erste Zeile der Message: " + text.splitlines()[0][:120] + "\n"
            + "Ist es die Message eines anderen Schritts? Sonst die Id in die Message schreiben.")


def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True, encoding="utf-8").stdout


def verlauf(anzahl):
    """Jeden Commit des Verlaufs gegen seine eigenen Dateien prüfen (Messung der Fehlalarme)."""
    hashes = git("log", "--no-merges", "--format=%h", "-n", str(anzahl)).split()
    gemeldet = 0
    for h in hashes:
        grund = pruefe(git("log", "-1", "--format=%B", h), git("show", "--name-only", "--format=", h).splitlines())
        if grund:
            gemeldet += 1
            print(h + ": " + grund.splitlines()[0])
    print("%d Commits geprüft, %d gemeldet." % (len(hashes), gemeldet))
    return 1 if gemeldet else 0


def main(argv):
    if len(argv) > 1 and argv[1] == "--verlauf":
        return verlauf(int(argv[2]) if len(argv) > 2 else 200)
    with open(argv[1], encoding="utf-8") as f:
        message = f.read()
    grund = pruefe(message, git("diff", "--cached", "--name-only").splitlines())
    if grund:
        # als UTF-8 schreiben: Python nimmt unter Windows sonst cp1252, und Visual Studio zeigt statt der Meldung nur
        # „Die Bytes [E4] … können nicht … übersetzt werden“ (das ä in „ändert“; LERN_Session27)
        sys.stderr.buffer.write((grund + "\n").encode("utf-8"))
        sys.stderr.flush()
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
