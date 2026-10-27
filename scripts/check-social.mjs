import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { stories, storyUrl, socialImage } from '../public/data.js';
import { canonicalStoryUrl, siteOrigin } from './story-pages.mjs';

const root = path.resolve(import.meta.dirname, '../dist');
const deployedBase = process.argv[2];
const crawlerHeaders = { 'User-Agent': 'facebookexternalhit/1.1 (+https://www.facebook.com/externalhit_uatext.php)', 'Cache-Control': 'no-cache' };
const decodeHtml = value => value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decodeHtml(value)]));
}
function jpegDimensions(buffer) {
  assert.equal(buffer.readUInt16BE(0), 0xffd8, 'Preview must be an actual JPEG');
  let offset = 2;
  while (offset < buffer.length) {
    assert.equal(buffer[offset], 0xff, 'Invalid JPEG marker');
    while (buffer[offset] === 0xff) offset++;
    const marker = buffer[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    const length = buffer.readUInt16BE(offset);
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3) };
    offset += length;
  }
  throw new Error('Preview JPEG dimensions are missing');
}

for (const story of stories) {
  const file = path.join(root, storyUrl(story.slug), 'index.html');
  let html = await readFile(file, 'utf8');
  if (deployedBase) {
    const response = await fetch(new URL(storyUrl(story.slug), deployedBase), { headers: crawlerHeaders, signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, `Story must be available to social crawlers: ${story.slug}`);
    assert(response.headers.get('content-type')?.includes('text/html'));
    html = await response.text();
  }
  const head = html.split('</head>')[0];
  const metaTags = [...head.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attributes(tag));
  const metadata = Object.fromEntries(metaTags.map(tag => [tag.property || tag.name, tag.content]));
  const canonical = canonicalStoryUrl(story);
  assert.equal(metadata['og:title'], story.title, `Wrong headline: ${story.slug}`);
  assert.equal(metadata['og:description'], story.excerpt);
  assert.equal(metadata['og:type'], 'article');
  assert.equal(metadata['og:url'], canonical);
  assert.equal(metadata['og:site_name'], 'SUBTEXT');
  assert.equal(metaTags.filter(tag => tag.property === 'og:title').length, 1);
  assert.equal(metadata['twitter:title'], story.title);
  assert.equal(metadata['twitter:card'], 'summary_large_image');
  assert.equal(metadata['twitter:image'], metadata['og:image']);
  assert.equal(metadata['og:image'], new URL(socialImage(story.slug), siteOrigin).href);
  assert.equal(metadata['og:image:type'], 'image/jpeg');
  assert.equal(metadata['og:image:width'], '1200');
  assert.equal(metadata['og:image:height'], '630');
  assert(metadata['og:image:alt']);
  const canonicalTag = [...head.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag)).find(tag => tag.rel === 'canonical');
  assert.equal(canonicalTag.href, canonical);
  assert(head.indexOf('<meta charset="utf-8">') < head.indexOf('<title>'));
  assert.equal(decodeHtml(/<title>([^<]+)<\/title>/.exec(head)[1]), `${story.title} — SUBTEXT`);
  assert.equal(decodeHtml(/<h1(?:\s[^>]*)?>([^<]+)<\/h1>/.exec(html)[1]), story.title, 'Initial HTML must contain the actual story headline without executing scripts');
  assert(html.includes(`data-story="${story.slug}"`));
  assert(!head.includes('Read — SUBTEXT'));

  const preview = await readFile(path.join(root, socialImage(story.slug)));
  assert.deepEqual(jpegDimensions(preview), { width: 1200, height: 630 });
  assert(preview.length < 5 * 1024 * 1024, 'Preview should stay below common social image size limits');
  if (deployedBase) {
    const response = await fetch(new URL(socialImage(story.slug), deployedBase), { headers: crawlerHeaders, signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, `Preview must be available to social crawlers: ${story.slug}`);
    assert(response.headers.get('content-type')?.includes('image/jpeg'));
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), preview, `Deployed preview differs: ${story.slug}`);
  }
  // All base-relative assets in the initial document must resolve within the
  // deployed /subtext/ directory, including cache-versioned scripts and CSS.
  const base = new URL(attributes(/<base\b[^>]*>/.exec(head)[0]).href, canonical);
  assert.equal(base.href, siteOrigin);
  for (const [, value] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = new URL(decodeHtml(value), base);
    if (!url.href.startsWith(siteOrigin)) continue;
    const relative = decodeURIComponent(url.pathname.slice(new URL(siteOrigin).pathname.length));
    const target = path.join(root, relative || 'index.html');
    const info = await stat(target);
    if (info.isDirectory()) await stat(path.join(target, 'index.html'));
  }
}
console.log(`Verified ${stories.length} ${deployedBase ? 'HTTP crawler responses' : 'initial-HTML social previews'}: unique headlines, canonical URLs, Open Graph and X cards, valid 1200 × 630 JPEGs, and working assets.`);
