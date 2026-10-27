import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const slugs = ['dear-mother', 'aaron-sorkin', 'shooting-memories', 'tanim-noor', 'monihar', 'jafar-panahi', 'presidents-message'];
export const transcriptionNotes = {
  'shooting-memories': 'মেকআপশিল্পীর নামটি মুদ্রণে স্পষ্ট নয়; অনুমান করে পূরণ করা হয়নি।',
  'jafar-panahi': 'পরিবেশক সংস্থার নামটি মুদ্রণে বিকৃত হরফে রয়েছে; অনুমান করে পূরণ করা হয়নি।',
};
const records = {};
const destination = path.join(root, 'public/text');
await mkdir(destination, { recursive: true });
for (const slug of slugs) {
  const source = (await readFile(path.join(root, `content/bangla/${slug}.txt`), 'utf8')).trim().normalize('NFC');
  const [heading, ...body] = source.split(/\r?\n\s*\r?\n/);
  const [title, author] = heading.split(/\r?\n/);
  if (!title || !author || body.length < 3 || source.includes('�')) throw new Error(`Invalid Bangla transcript: ${slug}`);
  records[slug] = { title, author, body, transcriptionNote: transcriptionNotes[slug] || '' };
  await writeFile(path.join(destination, `${slug}.txt`), `${source}\n\nপাঠ-সংস্করণ: SUBTEXT, Volume 01 / Issue 01, January 2026.\nস্পষ্ট বানান, মুদ্রণ ও OCR-ত্রুটি সংশোধিত; মূল বক্তব্য ও ভাষাভঙ্গি সংরক্ষিত।${transcriptionNotes[slug] ? `\n${transcriptionNotes[slug]}` : ''}\n`, 'utf8');
}
await writeFile(path.join(root, 'public/bangla-articles.js'), `// Generated from reviewed content/bangla/*.txt by scripts/prepare-bangla.mjs.\nexport const banglaArticles = ${JSON.stringify(records, null, 2)};\n`, 'utf8');
const escape = value => value.replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const message = records['presidents-message'];
const greeting = `<section class="wrap section presidents-message" id="presidents-message" lang="bn"><div class="letter-inner"><span class="eyebrow">FROM THE PRESIDENT / ISSUE 01</span><h2>${escape(message.title)}</h2><div class="prose" lang="bn">${message.body.map(text => `<p>${escape(text).replaceAll('\n','<br>')}</p>`).join('')}</div><p class="president-signature">${escape(message.author)}</p><a class="text-link" href="text/presidents-message.txt" download>লেখাটি ডাউনলোড করুন ↓</a> · <a class="text-link" href="issue.html?page=8">মূল মুদ্রণ দেখুন ↗</a></div></section>`;
const aboutPath = path.join(root, 'public/about.html');
const about = await readFile(aboutPath, 'utf8');
if (!about.includes('<!-- BEGIN PRESIDENTS MESSAGE -->')) throw new Error('Missing president message placeholder');
await writeFile(aboutPath, about.replace(/<!-- BEGIN PRESIDENTS MESSAGE -->[\s\S]*?<!-- END PRESIDENTS MESSAGE -->/, `<!-- BEGIN PRESIDENTS MESSAGE -->${greeting}<!-- END PRESIDENTS MESSAGE -->`), 'utf8');
console.log('Prepared six Bangla articles, the president’s message, and seven downloadable UTF-8 transcripts.');
