import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stories,authors,authorUrl } from '../public/data.js';
import { readingStats, readingLabel } from '../public/reading.js';
assert.deepEqual(readingStats('একটি গল্প। Another story!'),{words:4,minutes:1});
assert.equal(readingStats(Array(221).fill('word').join(' ')).minutes,2);
assert.equal(readingStats(Array(181).fill('গল্প').join(' ')).minutes,2);
for(const story of stories) {
  assert(story.reading.words > 0 && story.reading.minutes >= 1);
  const article=await readFile(`dist/stories/${story.slug}/index.html`,'utf8');
  assert(article.includes(`href="${authorUrl(story.authorId)}"`));
  assert(article.includes(readingLabel(story,true)));
  assert(!article.includes('মুদ্রিত লেখার সঙ্গে মিলিয়ে প্রস্তুত'));
}
for(const author of authors){
  const page=await readFile(`dist/${authorUrl(author.id)}index.html`,'utf8');
  const own=stories.filter(story=>story.authorId===author.id);
  for(const story of own)assert(page.includes(`href="stories/${story.slug}/"`));
  const cardLinks=[...page.matchAll(/class="story-card-link" href="([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(cardLinks,own.map(story=>`stories/${story.slug}/`));
}
const home=await readFile('dist/index.html','utf8');
assert(!home.includes('THE FIRST EDIT'));
assert(!home.includes('EST. 2026'));
assert(home.includes('TFP FILM CLUB · UNIVERSITY OF DHAKA'));
console.log(`Verified word-based reading estimates, all ${authors.length} author profiles, author/article links, and the requested copy removals.`);
