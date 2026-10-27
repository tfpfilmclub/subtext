# SUBTEXT

A custom editorial website for **SUBTEXT**, the semiannual film magazine by TFP Film Club, University of Dhaka. The inaugural issue is Volume 1, Issue 1, January 2026 (ISSN 3134-7878).

The design takes its crimson, gold, condensed masthead, and print sensibility from the magazine, pairing them with a warm paper background and readable serif typography.

## Run locally

Requires Node.js 20.11 or later. There are no application dependencies to install.

```sh
npm run dev
```

Open the Local URL printed by the server, normally `http://127.0.0.1:4173`.

```sh
npm run check
npm run build
npm run check:social
```

The build copies the ready-to-serve website into `dist/`. All URLs are relative, so the website also works below GitHub Pages’ `/subtext/` path.

## What is included

- An editorial homepage with story categories, English/Bangla filtering, and local search.
- Fifteen story entries, with copyedited web text where available and the complete original print layouts.
- A 36-page issue reader with a contents index, page selection, keyboard navigation, zoom, and PDF download.
- Professor’s Pick: all 25 posters, with film-title filtering.
- Underrated Jewels: the issue’s international and Bengali-language watchlists.
- A filmmaker resource directory, club photographs, editorial letter, masthead, and remembrance section.
- An image archive exposing all 78 unique extracted images, with previews, original downloads, and links to their source pages.
- Browser-local story saving and copyable article links.
- Responsive layouts, keyboard controls, visible focus, reduced-motion support, and native dialogs.

## Content and assets

- `public/data.js`: story metadata, web text, film selections, resources, and activity captions.
- `public/app.js`: navigation and interactive behavior.
- `public/styles.css`: the visual system and responsive layouts.
- `public/assets/originals/`: all 78 extracted image originals.
- `public/assets/images/`: full-resolution, high-quality WebP web copies.
- `public/assets/pages/`: all 36 original magazine pages rendered at 1600 pixels on the long edge.
- `content/image-manifest.json`: source-page mapping, dimensions, and SHA-256 checksums for the originals.
- `public/editions/`: the original, unchanged PDF.
- `public/assets/fonts/`: self-hosted Anton, DM Sans, and Newsreader typefaces.
- `public/assets/social/`: story-specific 1200 × 630 JPEGs for social previews.
- `scripts/story-pages.mjs`: generates each story’s HTML with its headline, description, canonical URL, and Open Graph/X image metadata available before JavaScript runs.

Articles use dedicated URLs such as `stories/piku/`. Copy link, social share links, search results, and story cards use these permalinks. Previously published `article.html?story=...` links continue to open the matching story. `npm run dev` prepares the article pages for local use; `npm run build` writes fresh pages to `dist/stories/` and versions the scripts to avoid stale navigation code after publishing.

After changing a story’s artwork, regenerate its social JPEG with Pillow and Node.js, then build and validate:

```sh
python scripts/prepare_social_images.py
npm run build
npm run check:social
```

The image preparation command accepts an optional absolute Node executable path. Landscape stills fill the preview; portraits and posters preserve their full composition. The Aaron Sorkin interview, which has no separate story photograph, uses the magazine cover.

English copy is lightly edited for spelling, capitalization, and extraction artifacts. All six Bangla articles have typed reading editions, visually checked against their 13 source pages; the president’s Bangla message is also typed on the About page. Only clear spelling, OCR, spacing and punctuation errors are corrected. Two unclear names are explicitly marked rather than guessed. Original print pages remain available. Reviewed UTF-8 sources are in `content/bangla/`, with an editorial record in `content/bangla/PROOFREADING.md`. `npm run build` regenerates `public/bangla-articles.js` and seven downloadable text files. The Piku article’s complete paragraphs are reproduced; its unfinished final print sentence is preserved only in the original layout.

All 78 extracted originals and their initial WebP copies are retained unchanged. Four low-resolution story images have separate AI-upscaled variants in `public/assets/enhanced/`; article captions identify these and link to the source image for comparison. Upscaling estimates detail rather than recovering new source information. The prompt and provenance notes are recorded in `content/bangla/PROOFREADING.md`, and `public/image-enhancements.js` maps the selected variants. Sharing JPEGs use the selected web artwork. Bangla reading uses self-hosted Noto Serif Bengali under its included SIL Open Font License.

For extraction, install Python’s `pypdf` and `Pillow`. Poppler is required to render the pages:

```sh
python scripts/extract_magazine.py path/to/issue.pdf
python scripts/prepare_web_assets.py path/to/issue.pdf
```

The second command downloads open-source fonts and their licenses, renders the issue pages using `pdftoppm`, creates WebP page images, and copies the unchanged PDF. Font downloads require internet access. The website itself serves its fonts locally.

## Publication

The GitHub Actions workflow in `.github/workflows/pages.yml` verifies content, builds the site, and deploys `dist/` to GitHub Pages on a push to `main`. In repository **Settings → Pages**, the source should be **GitHub Actions**. The workflow uses the automatically issued GitHub Actions token; no personal access token is stored in the site or repository.

For another static host, publish the contents of `dist/`. No server, database, or paid service is required.

Magazine text and imagery belong to their respective creators and rights holders. Their inclusion here follows the supplied magazine; this repository does not grant a new license to the magazine or the third-party film artwork. Print design credits are retained on the About page.

Run `npm run check:bangla` after building to verify complete typed content in initial HTML, text downloads, disclosed uncertainties, font files, and upscale variants. Local search includes article bodies and normalizes Bengali Unicode.
