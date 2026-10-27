"""Make JPEG social thumbnails from the magazine's existing artwork.

Requires Pillow and Node.js. Optionally pass the absolute Node executable path.
Uses the selected web artwork, including separately retained upscale variants.
This script only formats the selected artwork; it does not generate new detail.
"""
from pathlib import Path
from PIL import Image, ImageOps
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
node = sys.argv[1] if len(sys.argv) > 1 else 'node'
script = "import { stories, image, socialImageSource } from './public/data.js'; process.stdout.write(JSON.stringify(stories.map(story => ({ slug: story.slug, source: image(socialImageSource(story)), portrait: story.portrait, tone: story.tone }))));"
stories = json.loads(subprocess.check_output([node, '--input-type=module', '-e', script], cwd=ROOT, encoding='utf-8'))
destination = ROOT / 'public/assets/social'
destination.mkdir(parents=True, exist_ok=True)
for story in stories:
    source = Image.open(ROOT / 'public' / story['source']).convert('RGBA')
    background = {'blue': '#9baec9', 'gold': '#d8bc6b'}.get(story.get('tone'), '#f5f1e8')
    canvas = Image.new('RGB', (1200, 630), background)
    # Preserve faces and poster composition. Landscape stills fill the card;
    # portraits and covers retain their full image against the magazine palette.
    if story.get('portrait') or source.height > source.width:
        picture = ImageOps.contain(source, (1120, 590), Image.Resampling.LANCZOS)
    else:
        picture = ImageOps.fit(source, (1200, 630), Image.Resampling.LANCZOS)
    canvas.paste(picture, ((1200 - picture.width) // 2, (630 - picture.height) // 2), picture)
    canvas.save(destination / f"{story['slug']}.jpg", 'JPEG', quality=90, optimize=True, progressive=True)
print(f'Prepared {len(stories)} story-specific JPEG previews at 1200 x 630.')
