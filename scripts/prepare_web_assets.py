from pathlib import Path
from PIL import Image
import re
import shutil
import urllib.request
import time

ROOT = Path(__file__).resolve().parents[1]
fonts = ROOT / 'public/assets/fonts'
fonts.mkdir(parents=True, exist_ok=True)
url = 'https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'}
def download(source):
    for attempt in range(3):
        try:
            return urllib.request.urlopen(urllib.request.Request(source, headers=headers), timeout=30).read()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(1)
css = download(url).decode()
for i, source in enumerate(dict.fromkeys(re.findall(r'https://[^)]+', css))):
    name = f'font-{i}.woff2'
    print('Downloading', name, flush=True)
    (fonts / name).write_bytes(download(source))
    css = css.replace(source, name)
(fonts / 'fonts.css').write_text(css, encoding='utf-8')
pages = ROOT / 'public/assets/pages'
pages.mkdir(parents=True, exist_ok=True)
for source in sorted((ROOT / 'tmp/pdfs').glob('reader-*.jpg')):
    image = Image.open(source)
    image.save(pages / (source.stem.replace('reader-', 'page-') + '.webp'), 'WEBP', quality=91, method=4)
editions = ROOT / 'public/editions'
editions.mkdir(parents=True, exist_ok=True)
shutil.copyfile(r'C:\Users\USER\Downloads\SUBTEXT_ISSN COPY_Final.pdf', editions / 'subtext-vol-01-issue-01.pdf')
print('Self-hosted fonts, 36 reader pages, and original issue are ready.')
