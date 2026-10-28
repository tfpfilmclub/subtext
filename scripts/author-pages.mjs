import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { stories, authors, authorUrl } from '../public/data.js';
import { renderStoryCard } from '../public/story-card.js';
import { siteOrigin } from './story-pages.mjs';
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));

export async function generateAuthorPages(destination, { appVersion = '', styleVersion = '' } = {}) {
  for (const author of authors) {
    const articles = stories.filter(story => story.authorId === author.id);
    const bangla = author.language === 'bn';
    const title = `${author.name} — SUBTEXT`;
    const description = bangla ? `${author.name}-এর প্রকাশিত লেখা পড়ুন SUBTEXT-এ।` : `Read ${author.name} in SUBTEXT.`;
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><base href="../../"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${new URL(authorUrl(author.id), siteOrigin).href}"><meta name="theme-color" content="#a50927"><link rel="icon" href="assets/favicon.svg"><link rel="stylesheet" href="assets/fonts/fonts.css"><link rel="stylesheet" href="styles.css${styleVersion ? `?v=${styleVersion}` : ''}"><script type="module" src="app.js${appVersion ? `?v=${appVersion}` : ''}"></script></head><body data-page="author" data-author="${author.id}"><a class="skip-link" href="${authorUrl(author.id)}#main">Skip to content</a><div id="compact-header"></div><div id="navigation"></div><main id="main" class="wrap author-page"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">SUBTEXT</a><span>/</span><span>Contributors</span></nav><header class="author-profile"><span class="eyebrow">${bangla ? 'লেখক' : 'CONTRIBUTOR'}</span><h1 lang="${author.language}">${escape(author.name)}</h1>${author.role ? `<p class="author-role">${escape(author.role)}</p>` : ''}<p class="author-article-count" lang="${author.language}">${bangla ? `${new Intl.NumberFormat('bn-BD').format(articles.length)}টি লেখা` : `${articles.length} ${articles.length === 1 ? 'article' : 'articles'}`}</p></header><section aria-labelledby="author-stories-title"><div class="section-heading"><h2 id="author-stories-title" lang="${author.language}">${bangla ? 'প্রকাশিত লেখা' : 'Published stories'}<span class="red">.</span></h2></div><div class="story-grid">${articles.map(story => renderStoryCard(story, escape)).join('')}</div></section></main><div id="footer"></div></body></html>`;
    const directory = path.join(destination, 'authors', author.id);
    await mkdir(directory, {recursive:true});
    await writeFile(path.join(directory, 'index.html'), html, 'utf8');
  }
}
