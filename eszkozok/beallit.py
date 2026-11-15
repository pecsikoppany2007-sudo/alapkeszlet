# Új oldal beállítása az oldal.json alapján. Futtasd minden oldal.json-változás után:
#   python3 eszkozok/beallit.py
# Ezt csinálja: site/js/oldal.js (a JS beállítás), site/js/kit.js (a kit/ modulok egy fájlban),
# az index.html korai szkriptjében a kulcs és a nyelvek, a jogi.html újragenerálása.
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / 'site'
cfg = json.loads((ROOT / 'oldal.json').read_text())
rovid = re.sub(r'[^a-z0-9-]', '', cfg.get('rovid', 'oldal').lower()) or 'oldal'
langs = cfg.get('nyelvek', ['hu'])

js = {k: cfg[k] for k in ('nev', 'cim', 'telefon', 'nyelvek', 'nyitvatartas', 'intro', 'tablazat_csv') if k in cfg}
js['rovid'] = rovid
if not cfg.get('funkciok', {}).get('google_tablazat_menu'):
    js['tablazat_csv'] = ''
(SITE / 'js' / 'oldal.js').write_text('/* A beallit.py írja az oldal.json-ból, ne kézzel szerkeszd. */\nwindow.OLDAL = ' + json.dumps(js, ensure_ascii=False, indent=1) + ';\n')

mods = sorted((SITE / 'js' / 'kit').glob('*.js'))
(SITE / 'js' / 'kit.js').write_text('/* A beallit.py fűzi össze a js/kit/ modulokból, ne kézzel szerkeszd. */\n' + '\n'.join(m.read_text() for m in mods))

for page in SITE.glob('*.html'):
    s = page.read_text()
    s2 = re.sub(r"var h=document\.documentElement,r='[^']*',L=\[[^\]]*\]",
                f"var h=document.documentElement,r='{rovid}',L={json.dumps(langs)}", s)
    if not cfg.get('intro', {}).get('be', True):
        s2 = s2.replace("h.classList.add('intro-on')", "0")
    if s2 != s:
        page.write_text(s2)

subprocess.run([sys.executable, str(ROOT / 'eszkozok' / 'jogi.py')], check=True)
print('kész:', rovid, '|', ', '.join(langs), '|', len(mods), 'modul')
