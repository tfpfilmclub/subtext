import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { stories, image, socialImage, storyUrl } from '../public/data.js';
import { renderProse, transcriptIntro } from '../public/article-render.js';
import { enhancedImages } from '../public/image-enhancements.js';

export const siteOrigin = 'https://tfpfilmclub.github.io/subtext/';
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
export const canonicalStoryUrl = story => new URL(storyUrl(story.slug), siteOrigin).href;

export function renderStoryPage(story, { appVersion = '', styleVersion = '' } = {}) {
  const title = escapeHtml(story.title);
  const description = escapeHtml(story.excerpt);
  const canonical = canonicalStoryUrl(story);
  const preview = new URL(socialImage(story.slug), siteOrigin).href;
  const imageAlt = escapeHtml(`${story.title} — artwork from SUBTEXT Issue 01`);
  const appScript = `app.js${appVersion ? `?v=${appVersion}` : ''}`;
  const stylesheet = `styles.css${styleVersion ? `?v=${styleVersion}` : ''}`;
  const prose = renderProse(story, escapeHtml);
  // This initial content is readable without JavaScript. The existing app
  // enhances the same page with saving, sharing, and the rest of the issue.
  const fallback = `<div class="wrap article-top"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">SUBTEXT</a><span>/</span><a href="index.html#stories">Issue 01</a></nav><header class="article-header"><span class="eyebrow">${escapeHtml(story.category)} / ${escapeHtml(story.language)} / ISSUE 01</span><h1${story.language === 'বাংলা' && /[\u0980-\u09ff]/.test(story.title) ? ' lang="bn"' : ''}>${title}</h1>${story.subtitle ? `<p class="article-subtitle">${escapeHtml(story.subtitle)}</p>` : ''}<p class="article-deck">${description}</p><div class="article-meta"><span${story.transcript ? ' lang="bn"' : ''}>${escapeHtml(story.author)}</span> · January 2026</div></header>${story.noImage ? '' : `<img class="article-hero-image ${enhancedImages[story.image] ? 'enhanced' : ''} ${story.portrait ? 'portrait' : ''} ${story.tone || ''}" src="${image(story.image)}" alt="${imageAlt}" width="1280" height="560">${enhancedImages[story.image] ? `<p class="article-image-caption">AI-upscaled for web · <a href="${enhancedImages[story.image].original}" target="_blank" rel="noopener">Compare original ↗</a></p>` : ''}`}<div class="article-body-layout"><aside class="article-margin">FROM THE INAUGURAL ISSUE<br>Volume 01 / Issue 01</aside><div>${transcriptIntro(story, escapeHtml)}<div class="prose"${story.transcript ? ' lang="bn"' : ''}>${prose}<p><a href="issue.html?page=${story.page}">Read the original print layout, starting on page ${story.page}.</a></p></div></div></div></div>`;

  return `<!doctype html>
<html lang="en" prefix="og: https://ogp.me/ns# article: https://ogp.me/ns/article#">
<head>
  <meta charset="utf-8">
  <base href="../../">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} — SUBTEXT</title>
  <meta name="description" content="${description}">
  <meta name="author" content="${escapeHtml(story.author)}">
  <meta name="theme-color" content="#a50927">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="SUBTEXT">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${preview}">
  <meta property="og:image:secure_url" content="${preview}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${imageAlt}">
  <meta property="article:section" content="${escapeHtml(story.category)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${preview}">
  <meta name="twitter:image:alt" content="${imageAlt}">
  <link rel="icon" href="assets/favicon.svg">
  <link rel="stylesheet" href="assets/fonts/fonts.css">
  <link rel="stylesheet" href="${stylesheet}">
  <script type="module" src="${appScript}"></script>
</head>
<body data-page="article" data-story="${escapeHtml(story.slug)}">
  <a class="skip-link" href="${storyUrl(story.slug)}#main">Skip to content</a>
  <div id="compact-header"></div><div id="navigation"></div>
  <main id="main" class="article-main">${fallback}</main>
  <div id="footer"></div>
  <noscript><p class="wrap"><a href="editions/subtext-vol-01-issue-01.pdf">Download the complete magazine as a PDF.</a></p></noscript>
</body>
</html>
`;
}

export async function generateStoryPages(destination, versions = {}) {
  const root = path.resolve(destination);
  for (const story of stories) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(story.slug)) throw new Error(`Invalid story slug: ${story.slug}`);
    const directory = path.join(root, 'stories', story.slug);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), renderStoryPage(story, versions), 'utf8');
  }
}
