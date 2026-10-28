import { image, storyUrl, authorUrl } from './data.js';
import { readingLabel } from './reading.js';

export function renderStoryCard(story, escape, imageDescriptions = {}) {
  const art = story.noImage
    ? `<div class="story-image type-art"><span>SUBTEXT / ISSUE 01</span><b>${story.slug === 'screen-teaches-screen' ? 'Watch.<br>Learn.<br>Repeat.' : 'The craft<br>of dialogue.'}</b><span>THINKING THROUGH CINEMA</span></div>`
    : `<div class="story-image ${story.portrait ? 'portrait' : ''} ${story.tone || ''}"><img src="${image(story.image)}" alt="${escape(imageDescriptions[story.image] || story.title)}" loading="lazy" width="640" height="400"><span class="image-page">P. ${String(story.page).padStart(2, '0')}</span></div>`;
  const lang = story.language === 'বাংলা' && /[\u0980-\u09ff]/.test(story.title) ? ' lang="bn"' : '';
  return `<article class="story-card"><a class="story-card-link" href="${storyUrl(story.slug)}">${art}<div class="story-meta"><span>${escape(story.category)}</span><span>${escape(story.language)}</span></div><h3${lang}>${escape(story.title)}</h3><p>${escape(story.excerpt)}</p></a><div class="story-byline"><a class="author-link" href="${authorUrl(story.authorId)}"${/[\u0980-\u09ff]/.test(story.author) ? ' lang="bn"' : ''}>${escape(story.author)}</a><span class="card-reading-time"${story.language === 'বাংলা' ? ' lang="bn"' : ''}>${escape(readingLabel(story))}</span></div></article>`;
}
