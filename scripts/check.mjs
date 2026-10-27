import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { stories, professorFilms, resources, image, issue } from '../public/data.js';
const root = path.resolve(import.meta.dirname, '../public');
const exists = async relative => { const file = path.resolve(root, relative); assert(file.startsWith(root + path.sep), `Path escapes public/: ${relative}`); assert((await stat(file)).size > 0, `Empty file: ${relative}`); };
const images = JSON.parse(await readFile(path.join(root, 'assets/image-manifest.json'), 'utf8'));
assert.equal(images.length, 78, 'All unique images must be present');
assert.equal(stories.length, 15, 'The complete issue index must be present');
assert.equal(new Set(stories.map(story => story.slug)).size, stories.length);
assert.equal(professorFilms.length, 25);
for (const record of images) {
  await exists(record.src); await exists(record.original);
  const original = await readFile(path.join(root, record.original));
  assert.equal(createHash('sha256').update(original).digest('hex'), record.sha256, `Changed original: ${record.id}`);
  assert(record.width > 0 && record.height > 0);
}
for (let number = 1; number <= issue.pages; number++) await exists(`assets/pages/page-${String(number).padStart(2, '0')}.webp`);
await exists(issue.pdf);
for (const story of stories) {
  assert(story.page >= 1 && story.end <= issue.pages && story.end >= story.page);
  await exists(image(story.image));
  assert(!JSON.stringify(story).includes('�'), `Invalid text in ${story.slug}`);
}
for (const film of professorFilms) await exists(image(film.image));
for (const [, , url] of resources) assert.equal(new URL(url).protocol, 'https:');
for (const file of (await readdir(root)).filter(file => /\.(html|js|css)$/.test(file))) {
  const source = await readFile(path.join(root, file), 'utf8');
  assert(!/github_pat_[A-Za-z0-9_]{20,}|ghp_[A-Za-z0-9]{30,}/.test(source), `Credential found in ${file}`);
  assert(!source.includes('�'), `Replacement character in ${file}`);
  if (file.endsWith('.html')) {
    assert(source.includes('name="viewport"'), `Missing responsive viewport in ${file}`);
    assert(/<title>[^<]+<\/title>/.test(source), `Missing title in ${file}`);
    for (const match of source.matchAll(/(?:src|href)="([^"#]+)"/g)) {
      const destination = match[1];
      if (/^(?:https?:|mailto:|data:)/.test(destination)) continue;
      await exists(destination.split(/[?#]/)[0]);
    }
  }
}
const fontCss = await readFile(path.join(root, 'assets/fonts/fonts.css'), 'utf8');
for (const match of fontCss.matchAll(/url\(([^)]+)\)/g)) await exists(`assets/fonts/${match[1]}`);
console.log('Verified: 15 stories, 78 losslessly retained image originals, 78 WebP copies, 36 reader pages, 25 film posters, all static links and font files, no credentials or broken text.');
