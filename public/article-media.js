import { image, authorUrl } from './data.js';
import { enhancedImages } from './image-enhancements.js';
import { suppliedImages } from './supplied-images.js';

// Shared by the initial document and the interactive reader.
export function renderArticleMedia(story, escape, description = story.title) {
  if (story.slug === 'professors-pick') {
    return `<aside class="article-curator" aria-label="About the curator"><img src="${image(story.image)}" alt="Rezwan Shahriar Sumit" width="502" height="595"><div><span class="eyebrow">CURATED BY</span><a class="author-link" href="${authorUrl(story.authorId)}">Rezwan Shahriar Sumit</a><p>From the inaugural issue of SUBTEXT</p></div></aside>`;
  }
  if (story.noImage) return '';
  const supplied = suppliedImages[story.image];
  const alt = supplied?.alt || description;
  const enhanced = enhancedImages[story.image];
  return `<img class="article-hero-image ${enhanced ? 'enhanced' : ''} ${story.portrait ? 'portrait' : ''} ${story.fit === 'contain' ? 'uncropped' : ''} ${story.tone || ''}" src="${image(story.image)}" alt="${escape(alt)}" width="1280" height="560"><p class="article-image-caption">${escape(alt)}${supplied ? '' : ' · From SUBTEXT, Volume 1, Issue 1'}${enhanced ? ` · AI-upscaled for web · <a href="${enhanced.original}" target="_blank" rel="noopener">Compare original ↗</a>` : ''}</p>`;
}
