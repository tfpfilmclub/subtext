import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { stories, image } from '../public/data.js';
import { banglaArticles } from '../public/bangla-articles.js';
import { enhancedImages } from '../public/image-enhancements.js';

const articles = stories.filter(story => story.language === 'বাংলা');
assert.equal(articles.length, 6);
for (const story of articles) {
  const source = (await readFile(`content/bangla/${story.slug}.txt`, 'utf8')).trim().normalize('NFC');
  const [heading, ...paragraphs] = source.split(/\r?\n\s*\r?\n/);
  assert.deepEqual(story.body, paragraphs, `Published text differs from reviewed source: ${story.slug}`);
  assert.equal(story.title, heading.split(/\r?\n/)[0]);
  assert(source.length > 3000, `Incomplete transcript: ${story.slug}`);
  assert(!/�|TFP FILM CLUB|SUBTEXT\s*\d+/.test(story.body.join(' ')), `OCR debris: ${story.slug}`);
  const download = await readFile(`public/${story.transcript}`, 'utf8');
  assert(download.startsWith(source));
  const html = await readFile(`dist/stories/${story.slug}/index.html`, 'utf8');
  assert(html.includes('class="prose" lang="bn"'), `Missing Bangla reading language: ${story.slug}`);
  assert(html.includes(`href="${story.transcript}" download`), `Missing text download: ${story.slug}`);
  assert(html.includes(`href="issue.html?page=${story.page}"`));
  const readable = html.replace(/<[^>]*>/g, ' ').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replace(/\s+/g, ' ');
  for (const paragraph of story.body) assert(readable.includes(paragraph.replace(/\s+/g, ' ')), `Missing reviewed paragraph in initial HTML: ${story.slug}`);
}
const notes = articles.filter(story => story.transcriptionNote);
assert.equal(notes.length, 1, 'The unresolved distributor name must remain marked');
for (const story of notes) assert(story.body.some(text => text.includes('[নামটি অস্পষ্ট]') || text.includes('[মূল মুদ্রণে নামটি অস্পষ্ট]')));
assert(stories.find(story=>story.slug==='shooting-memories').body.some(text=>text.includes('মেকআপের বিন্তু আপু')));
assert(!stories.find(story=>story.slug==='shooting-memories').body.join(' ').includes('[নামটি অস্পষ্ট]'));
assert.equal(Object.keys(banglaArticles).length, 7);
const about = await readFile('dist/about.html', 'utf8');
assert(about.includes(banglaArticles['presidents-message'].title));
assert(about.includes('text/presidents-message.txt'));
for (const [id, variant] of Object.entries(enhancedImages)) {
  assert.equal(image(id), variant.src);
  assert(variant.width >= 1100 && variant.height >= 750);
  assert((await stat(`public/${variant.src}`)).size > 10000);
  assert((await stat(`public/${variant.original}`)).size > 0);
}
const css = await readFile('public/assets/fonts/bengali.css', 'utf8');
for (const match of css.matchAll(/url\(([^)]+)\)/g)) assert((await stat(`public/assets/fonts/${match[1]}`)).size > 0);
console.log('Verified six Bangla reading editions, seven text downloads, confirmed makeup artist name, unresolved distributor marker, font files, and image variants.');
