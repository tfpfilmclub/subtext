"""Extract the supplied issue without changing its photographs or illustrations.

Usage: python scripts/extract_magazine.py path/to/issue.pdf
Original image streams are retained; WebP copies preserve full source resolution.
"""
from pathlib import Path
from pypdf import PdfReader
from PIL import Image, ImageOps, ImageDraw
import hashlib
import io
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1])
ORIGINALS = ROOT / "public/assets/originals"
WEB = ROOT / "public/assets/images"
ORIGINALS.mkdir(parents=True, exist_ok=True)
WEB.mkdir(parents=True, exist_ok=True)
reader = PdfReader(SOURCE)
records, hashes = [], {}
for page_number, page in enumerate(reader.pages, 1):
    for index, embedded in enumerate(page.images, 1):
        digest = hashlib.sha256(embedded.data).hexdigest()
        if digest in hashes:
            record = records[hashes[digest]]
            record["pages"] = sorted(set(record["pages"] + [page_number]))
            continue
        name = f"p{page_number:02d}-{index:02d}"
        extension = Path(embedded.name).suffix or ".bin"
        original_path = ORIGINALS / (name + extension)
        original_path.write_bytes(embedded.data)
        with Image.open(io.BytesIO(embedded.data)) as source_image:
            # CMYK print images need an RGB web representation. No generated
            # details, upscaling, cropping, or destructive sharpening is applied.
            image = source_image.convert("RGBA" if "A" in source_image.getbands() else "RGB")
            width, height = image.size
            image.save(WEB / (name + ".webp"), "WEBP", quality=94, method=6)
        hashes[digest] = len(records)
        records.append({"id": name, "pages": [page_number], "width": width,
                        "height": height, "src": f"assets/images/{name}.webp",
                        "original": f"assets/originals/{name}{extension}",
                        "sha256": digest})
(ROOT / "content/image-manifest.json").write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
(ROOT / "public/assets/image-manifest.json").write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
# A numbered contact sheet for editorial selection, never served as site content.
cell_w, cell_h = 180, 165
sheet = Image.new("RGB", (cell_w * 8, cell_h * ((len(records) + 7) // 8)), "#e9e5db")
draw = ImageDraw.Draw(sheet)
for i, record in enumerate(records):
    with Image.open(ROOT / "public" / record["src"]) as original:
        thumb = ImageOps.contain(original.convert("RGBA"), (170, 135))
        x, y = (i % 8) * cell_w, (i // 8) * cell_h
        sheet.paste(thumb, (x + (cell_w - thumb.width) // 2, y + 22), thumb)
        draw.text((x + 6, y + 5), f"{record['id']} {record['width']}x{record['height']}", fill="black")
sheet.save(ROOT / "tmp/pdfs/images-contact.jpg")
print(f"Extracted {len(records)} unique images from {len(reader.pages)} pages.")
