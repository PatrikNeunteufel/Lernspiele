"""Schrift der Startseite zuschneiden (Entscheid GS3 a, LERN_Session32; docs/eulenpfad/konzept_gestaltung.md).

Aus tools/schriften/Nunito[wght].ttf (Original aus github.com/google/fonts, ofl/nunito, SIL OFL 1.1 ohne reservierten
Namen) wird eulenpfad/schriften/Nunito.woff2: variabel (alle Stärken 200–1000), nur mit den Zeichen, die der Eulenpfad
zeigt, dazu ganz Latin-1 und Latin Extended-A (Vornamen, die Kinder eintippen: é, ç, ł, ő …). Die Lizenz kommt als
eulenpfad/schriften/OFL.txt daneben. Emoji und Bildzeichen gehören nicht hinein: die zeichnet die Emoji-Schrift des
Geräts. Was die Schrift nicht hat (etwa U+202F), nimmt der Browser aus der nächsten Schrift in --schrift.

Aufruf:
  python tools/schrift_zuschneiden.py            schreibt die Datei neu
  python tools/schrift_zuschneiden.py --pruefe   meldet, ob die Datei fehlt, veraltet ist oder Zeichen des Eulenpfads
                                                 fehlen, die das Original hat (Ende mit Code 1); braucht fontTools und brotli
"""
import glob
import hashlib
import io
import os
import shutil
import sys
import unicodedata

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGINAL = os.path.join(WURZEL, 'tools', 'schriften', 'Nunito[wght].ttf')
LIZENZ = os.path.join(WURZEL, 'tools', 'schriften', 'OFL.txt')
ZIEL = os.path.join(WURZEL, 'eulenpfad', 'schriften', 'Nunito.woff2')
ZIEL_LIZENZ = os.path.join(WURZEL, 'eulenpfad', 'schriften', 'OFL.txt')


def zeichen_der_app():
    """Alle Zeichen in Code und Inhalten des Eulenpfads ohne Emoji, Bildzeichen und Steuerzeichen, dazu Latin-1 und
    Latin Extended-A ganz."""
    z = {chr(c) for c in range(0x20, 0x7F)} | {chr(c) for c in range(0xA0, 0x180)}
    for f in glob.glob(os.path.join(WURZEL, 'eulenpfad', '**', '*.*'), recursive=True):
        if not f.endswith(('.js', '.html', '.css')):
            continue
        for c in open(f, encoding='utf-8', errors='ignore').read():
            o = ord(c)
            if o < 0x20 or o >= 0x1F000 or 0x2600 <= o < 0x2800 or 0xFE00 <= o <= 0xFE0F or o == 0x200D:
                continue
            if unicodedata.category(c) in ('So', 'Cs', 'Co', 'Cn', 'Cc'):
                continue
            z.add(c)
    return z


def schneide():
    """Zugeschnittene Schrift als Bytes (gleiche Eingabe → gleiche Bytes)."""
    from fontTools import subset
    from fontTools.ttLib import TTFont
    opt = subset.Options()
    opt.flavor = 'woff2'
    opt.layout_features = ['*']
    opt.name_IDs = ['*']
    opt.notdef_outline = True
    opt.timing = False
    font = TTFont(ORIGINAL, recalcTimestamp=False)
    s = subset.Subsetter(opt)
    s.populate(unicodes=[ord(c) for c in zeichen_der_app()])
    s.subset(font)
    puffer = io.BytesIO()
    font.flavor = 'woff2'
    font.save(puffer)
    return puffer.getvalue()


def merke(zeile):
    """Schlusszeile wie tools/testausgabe.js nach .temp/pruefung/schrift_zuschneiden.json (HK1 a); stört nie."""
    import datetime
    import json
    try:
        ordner = os.path.join(WURZEL, '.temp', 'pruefung')
        os.makedirs(ordner, exist_ok=True)
        datei = os.path.join(ordner, 'schrift_zuschneiden.json')
        laeufe = json.load(open(datei, encoding='utf-8')) if os.path.exists(datei) else []
        laeufe.append({'tag': datetime.datetime.now().strftime('%Y-%m-%d'), 'zeit': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                       'aufruf': ' '.join(sys.argv[1:]), 'zeile': zeile})
        open(datei, 'w', encoding='utf-8').write(json.dumps(laeufe[-50:], ensure_ascii=False, indent=1) + '\n')
    except Exception:
        pass


def main():
    import logging
    logging.disable(logging.WARNING)  # fontTools meldet Tabellen, die es nicht zuschneiden kann
    neu = schneide()
    if '--pruefe' in sys.argv:
        fehler = []
        if not os.path.exists(ZIEL):
            fehler.append(f'{os.path.relpath(ZIEL, WURZEL)} fehlt')
        elif hashlib.sha256(open(ZIEL, 'rb').read()).digest() != hashlib.sha256(neu).digest():
            fehler.append(f'{os.path.relpath(ZIEL, WURZEL)} veraltet (neue Zeichen im Eulenpfad?): python tools/schrift_zuschneiden.py')
        if not os.path.exists(ZIEL_LIZENZ):
            fehler.append(f'{os.path.relpath(ZIEL_LIZENZ, WURZEL)} fehlt (SIL OFL verlangt die Lizenz bei der Schrift)')
        for f in fehler:
            print(f'    FEHLER  {f}')
        schluss = 'Keine Fehler.' if not fehler else f'{len(fehler)} Fehler.'
        print(schluss)
        merke(schluss)
        sys.exit(1 if fehler else 0)
    os.makedirs(os.path.dirname(ZIEL), exist_ok=True)
    open(ZIEL, 'wb').write(neu)
    shutil.copyfile(LIZENZ, ZIEL_LIZENZ)
    print(f'{os.path.relpath(ZIEL, WURZEL)}: {len(neu) / 1024:.1f} KB, {len(zeichen_der_app())} Zeichen gewünscht')


if __name__ == '__main__':
    main()
