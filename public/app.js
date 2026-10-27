import { stories, professorFilms, foreignFilms, bengaliFilms, resources, activities, image, storyUrl, pageUrl, issue } from './data.js';
import { enhancedImages } from './image-enhancements.js';
import { renderProse, transcriptIntro } from './article-render.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const params = new URLSearchParams(location.search);
const currentPage = document.body.dataset.page;
const pad = number => String(number).padStart(2, '0');

if ($('#compact-header')) $('#compact-header').innerHTML = `<header class="compact-masthead wrap"><a class="compact-wordmark" href="index.html" aria-label="SUBTEXT home">SUBTEXT.</a><span class="eyebrow">A FILM MAGAZINE<br>BY FILM STUDENTS</span></header>`;
if ($('#navigation')) $('#navigation').innerHTML = `<div class="nav-shell"><nav class="main-nav wrap" aria-label="Main navigation"><a href="index.html" class="nav-brand" aria-label="SUBTEXT home">S.</a><button class="menu-toggle" aria-expanded="false" aria-controls="nav-links">Menu <span aria-hidden="true">＋</span></button><div class="nav-links" id="nav-links"><a href="index.html#stories">The magazine</a><a href="index.html?filter=Essays#stories">Essays &amp; criticism</a><a href="index.html?filter=Interviews#stories">Conversations</a><a href="index.html#watchlist">Watchlists</a><a href="about.html">About</a></div><a class="nav-read" href="issue.html">READ ISSUE 01 <span aria-hidden="true">↗</span></a><button class="nav-search" id="open-search" aria-label="Search the magazine"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span>Search</span><kbd>/</kbd></button></nav></div>`;
if ($('#footer')) $('#footer').innerHTML = `<footer class="site-footer"><div class="wrap"><div class="footer-top"><p>A film magazine by film students.<br>From Dhaka, with a wider lens.</p><nav class="footer-links" aria-label="Footer"><a href="issue.html">Current issue</a><a href="about.html">Our story</a><a href="archive.html">Image archive</a><a href="mailto:tfpfilm.du@gmail.com">Contribute ↗</a></nav></div><a href="index.html" class="footer-wordmark" aria-label="SUBTEXT home">SUBTEXT.</a><div class="footer-bottom"><span>© 2026 SUBTEXT · TFP Film Club · University of Dhaka</span><span>ISSN 3134-7878 <span aria-hidden="true"> / </span> <a href="editions/subtext-vol-01-issue-01.pdf" download>Download the inaugural issue ↓</a></span></div></div></footer>`;

$('.menu-toggle')?.addEventListener('click', event => {
  const toggle = event.currentTarget;
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  $('.main-nav').classList.toggle('menu-open', open);
  toggle.innerHTML = `Menu <span aria-hidden="true">${open ? '−' : '＋'}</span>`;
});

function storyCard(story) {
  const art = story.noImage
    ? `<div class="story-image type-art"><span>SUBTEXT / ISSUE 01</span><b>${story.slug === 'screen-teaches-screen' ? 'Watch.<br>Learn.<br>Repeat.' : 'The craft<br>of dialogue.'}</b><span>THINKING THROUGH CINEMA</span></div>`
    : `<div class="story-image ${story.portrait ? 'portrait' : ''} ${story.tone || ''}"><img src="${image(story.image)}" alt="${escape(imageDescriptions[story.image] || story.title)}" loading="lazy" width="640" height="400"><span class="image-page">P. ${pad(story.page)}</span></div>`;
  return `<article class="story-card"><a href="${storyUrl(story.slug)}">${art}<div class="story-meta"><span>${escape(story.category)}</span><span>${escape(story.language)}</span></div><h3${story.language === 'বাংলা' && /[\u0980-\u09ff]/.test(story.title) ? ' lang="bn"' : ''}>${escape(story.title)}</h3><p>${escape(story.excerpt)}</p><div class="story-byline"><span>${escape(story.author)}</span><span aria-hidden="true">↗</span></div></a></article>`;
}

const imageDescriptions = {
  'p01-01': 'TFP Film Club miniature mark', 'p01-02': 'SUBTEXT cover artwork',
  'p03-02': 'Editor’s signature', 'p03-03': 'Magazine QR code', 'p03-04': 'TFP Film Club logo',
  'p03-05': 'Department of Television, Film and Photography artwork', 'p03-06': 'University of Dhaka crest',
  'p04-01': 'Department anniversary artwork', 'p05-02': 'Haider Rizvi', 'p05-03': 'Zahidur Rahman Anjan',
  'p06-01': 'Dr. Abu Jafar Md. Shafiul Alam Bhuiyan', 'p07-02': 'Golden film reel illustration',
  'p07-03': 'Saiyeed Shahjada Al Kareem', 'p08-01': 'Takia Monaw-wara Katha',
  'p09-02': 'A still accompanying Dear Mother', 'p10-01': 'The War Room in Dr. Strangelove', 'p11-02': 'A still of the War Room in Dr. Strangelove',
  'p12-01': 'Costume details from Piku', 'p12-02': 'Everyday clothing in Piku',
  'p15-02': 'A still accompanying Underrated Jewels', 'p15-03': 'Typhoon Club artwork', 'p15-04': 'The Salt in Our Waters poster',
  'p15-05': 'Purple film strip illustration', 'p15-06': 'The Fall poster', 'p15-07': 'Film artwork from Underrated Jewels',
  'p16-08': 'Rezwan Shahriar Sumit', 'p18-01': 'Joya Ahsan in Guerrilla', 'p18-02': 'A scene from Guerrilla',
  'p19-02': 'Bonolota Express poster', 'p22-01': 'Tanim Noor', 'p26-01': 'Baker Bhai',
  'p27-02': 'The entrance of Monihar cinema hall in Jashore', 'p28-01': 'The interior of Monihar cinema hall',
  'p29-02': 'Master poster', 'p29-03': 'Coming soon artwork', 'p30-01': 'A film award at a festival',
  'p31-02': 'Jafar Panahi at a film festival', 'p33-02': 'Al Pacino and Keanu Reeves in The Devil’s Advocate',
  'p33-03': 'Sculptural imagery from The Devil’s Advocate', 'p34-01': 'TFP Creative Excellence Awards, 2024',
  'p34-02': 'Orientation of TFP’s 12th batch', 'p34-03': 'A special screening at TFP Film Club', 'p34-04': 'A guest presentation at TFP Film Club',
  'p34-05': 'Costume design workshop with Edila Farid Turin', 'p34-06': 'A screening with Kamar Ahmad Simon',
  'p35-02': 'Raven screening with Goethe-Institut Bangladesh', 'p35-03': 'TFP Film Club at a film societies conference',
  'p35-04': 'TFP Film Club event presentation', 'p35-05': 'A conversation with Rezwan Shahriar Sumit',
  'p35-06': 'The first panel of TFP Film Club', 'p35-07': 'A screening in collaboration with Cinemata',
  'p36-01': 'Second TFP Creative Excellence Awards 2025 artwork', 'p36-02': 'From Classroom to Cosmos artwork',
};
for (const film of professorFilms) imageDescriptions[film.image] = `${film.title} poster`;

function posterCard(film, index) {
  return `<a class="poster" href="archive.html?image=${film.image}" id="film-${film.image}"><div class="poster-image"><img src="${image(film.image)}" alt="${escape(film.title)} poster" loading="lazy" width="443" height="618"></div><span class="poster-number">${pad(index + 1)} / PROFESSOR’S PICK</span><h3>${escape(film.title)}</h3></a>`;
}

// Search is local to the published issue; no search queries leave the browser.
document.body.insertAdjacentHTML('beforeend', `<dialog id="search-dialog" class="search-dialog" aria-labelledby="search-title"><div class="dialog-heading"><h2 id="search-title">Look a little closer.</h2><button class="icon-button" id="close-search" aria-label="Close search">×</button></div><form class="search-field" role="search"><label class="sr-only" for="search-input">Search titles, authors, or topics</label><input id="search-input" type="search" placeholder="A film, a voice, an idea…" autocomplete="off"></form><p class="search-help">Search the inaugural issue · Titles, authors, and article text</p><div class="search-results" id="search-results" aria-live="polite"></div></dialog>`);
const searchDialog = $('#search-dialog');
function updateSearch() {
  const value = $('#search-input').value.trim().normalize('NFC').toLocaleLowerCase();
  const results = stories.filter(story => `${story.title} ${story.subtitle || ''} ${story.author} ${story.category} ${story.excerpt} ${story.language} ${(story.body || []).map(block => typeof block === 'string' ? block : block.heading).join(' ')}`.normalize('NFC').toLocaleLowerCase().includes(value));
  $('#search-results').innerHTML = results.length ? results.map(story => `<a href="${storyUrl(story.slug)}" class="search-result"><div><small>${escape(story.category)} / ${escape(story.author)}</small><h3>${escape(story.title)}</h3></div><span aria-hidden="true">↗</span></a>`).join('') : '<p class="search-empty">No stories found. Try a film title, “cinema,” or a contributor’s name.</p>';
}
function openSearch() { if (!searchDialog.open) { searchDialog.showModal(); updateSearch(); $('#search-input').focus(); } }
$('#open-search')?.addEventListener('click', openSearch);
$('#close-search').addEventListener('click', () => searchDialog.close());
$('.search-field').addEventListener('submit', event => event.preventDefault());
$('#search-input').addEventListener('input', updateSearch);
searchDialog.addEventListener('click', event => { if (event.target === searchDialog && (event.offsetX < 0 || event.offsetX > searchDialog.clientWidth || event.offsetY < 0 || event.offsetY > searchDialog.clientHeight)) searchDialog.close(); });
document.addEventListener('keydown', event => {
  if (event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.querySelector('dialog[open]')) { event.preventDefault(); openSearch(); }
});

if (currentPage === 'home') {
  let filter = ['All', 'Essays', 'Interviews', 'Watchlists', 'বাংলা'].includes(params.get('filter')) ? params.get('filter') : 'All';
  let showAll = filter !== 'All';
  function renderStories() {
    const filtered = stories.filter(story => filter === 'All' || (filter === 'বাংলা' ? story.language === 'বাংলা' : story.category === filter));
    $('#story-grid').innerHTML = (showAll ? filtered : filtered.slice(0, 6)).map(storyCard).join('');
    $('#story-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'story' : 'stories'}`;
    $('#more-stories').hidden = showAll || filtered.length <= 6;
    $$('.filter').forEach(button => { const active = button.dataset.filter === filter; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  }
  $$('.filter').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; showAll = filter !== 'All'; renderStories(); }));
  $('#more-stories').addEventListener('click', () => { showAll = true; renderStories(); });
  renderStories();
  $('#home-posters').innerHTML = [professorFilms[0], professorFilms[2], professorFilms[5], professorFilms[7], professorFilms[9], professorFilms[17]].map(posterCard).join('');
}

function originalPages(story) {
  const pages = Array.from({ length: story.end - story.page + 1 }, (_, index) => story.page + index);
  return `<section class="native-pages"><details${story.body ? '' : ' open'}><summary>${story.body ? 'See the original print layout' : `Read in the original layout · ${story.language}`}</summary>${pages.map(page => `<a class="print-page" href="${pageUrl(page)}"><img src="assets/pages/page-${pad(page)}.webp" alt="Original magazine page ${page}: ${escape(story.title)}" loading="lazy" width="1132" height="1600"><span class="eyebrow">PAGE ${pad(page)} · OPEN IN ISSUE READER ↗</span></a>`).join('')}</details></section>`;
}
function filmTable(title, films) {
  return `<section class="film-list-section"><h2>${title}</h2><table class="film-table"><thead><tr><th scope="col">NO.</th><th scope="col">FILM</th><th scope="col">YEAR</th><th scope="col">DIRECTOR</th></tr></thead><tbody>${films.map(([title, year, director], index) => `<tr><td>${pad(index + 1)}</td><td>${escape(title)}</td><td>${escape(year || '—')}</td><td>${escape(director || '—')}</td></tr>`).join('')}</tbody></table></section>`;
}

if (currentPage === 'article') {
  const story = stories.find(story => story.slug === (document.body.dataset.story || params.get('story')));
  if (!story) {
    document.title = 'Story Not Found — SUBTEXT';
    $('#main').innerHTML = '<div class="wrap section not-found"><p class="eyebrow">OUT OF FRAME</p><h1>We couldn’t find<br><em>that story.</em></h1><p>Explore the inaugural issue to find your next read.</p><a class="button button-red" href="index.html#stories">Back to the stories ↗</a></div>';
  } else if (!document.body.dataset.story) {
    // Keep previously published query links working, while sharing a page
    // whose initial HTML includes this story's social preview metadata.
    const permalink = new URL(storyUrl(story.slug), document.baseURI);
    permalink.hash = location.hash;
    location.replace(permalink.href);
  } else {
    document.title = `${story.title} — SUBTEXT`;
    $('meta[name="description"]').content = story.excerpt;
    const native = !story.body && !['professors-pick', 'underrated-jewels', 'screen-teaches-screen', 'club-at-a-glance'].includes(story.slug);
    const hero = story.noImage || story.slug === 'professors-pick' ? '' : `<img class="article-hero-image ${enhancedImages[story.image] ? 'enhanced' : ''} ${story.portrait ? 'portrait' : ''} ${story.tone || ''}" src="${image(story.image)}" alt="${escape(imageDescriptions[story.image] || story.title)}" width="1280" height="560"><p class="article-image-caption">${escape(imageDescriptions[story.image] || story.title)} · From SUBTEXT, Volume 1, Issue 1${enhancedImages[story.image] ? ` · AI-upscaled for web · <a href="${enhancedImages[story.image].original}" target="_blank" rel="noopener">Compare original ↗</a>` : ''}</p>`;
    const prose = renderProse(story, escape);
    $('#main').innerHTML = `<div class="wrap article-top"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">SUBTEXT</a><span>/</span><a href="index.html#stories">Issue 01</a><span>/</span><span>${escape(story.category)}</span></nav><header class="article-header"><span class="eyebrow">${escape(story.category.toUpperCase())} <span aria-hidden="true"> / </span> ${escape(story.language)} <span aria-hidden="true"> / </span> ISSUE 01</span><h1${story.language === 'বাংলা' && /[\u0980-\u09ff]/.test(story.title) ? ' lang="bn"' : ''}>${escape(story.title)}</h1>${story.subtitle ? `<p class="article-subtitle">${escape(story.subtitle)}</p>` : ''}<p class="article-deck">${escape(story.excerpt)}</p><div class="article-meta"><div><span${story.transcript ? ' lang="bn"' : ''}>${escape(story.author)}</span>${story.role ? `<small>${escape(story.role)}</small>` : ''}<small>January 2026 · ${story.page === story.end ? `Page ${story.page}` : `Pages ${story.page}–${story.end}`}</small></div><div class="article-actions"><button class="bookmark-button" id="save-story" aria-pressed="false">Save for later ＋</button><button class="bookmark-button" id="share-story">Copy link ↗</button><span class="sr-only" id="share-status" aria-live="polite"></span></div></div></header>${hero}<div class="article-body-layout"><aside class="article-margin"><span class="eyebrow">FROM THE<br>INAUGURAL ISSUE</span><p>Volume 01 / Issue 01<br>January 2026<br>TFP Film Club</p><p>${native ? 'Presented in the original print layout.' : 'Cinema, between the lines.'}</p></aside><div>${transcriptIntro(story, escape)}<div class="prose"${story.transcript ? ' lang="bn"' : ''}>${prose}${story.secondaryImage ? `<figure><img src="${image(story.secondaryImage)}" alt="${escape(imageDescriptions[story.secondaryImage])}" loading="lazy"><figcaption>From the original issue of SUBTEXT.</figcaption></figure>` : ''}</div>${native || story.body ? `<div class="print-callout"><span class="eyebrow">ON THE PAGE</span><p>${native ? 'Continue with the complete article in its original print layout below.' : 'Read this piece as it appeared in the inaugural issue.'}</p><a class="button button-outline" href="${pageUrl(story.page)}">Open the issue reader <span aria-hidden="true">↗</span></a>${story.note ? `<p class="print-note">${escape(story.note)}</p>` : ''}</div>` : ''}</div></div><div id="article-special"></div>${originalPages(story)}</div><section class="article-bottom"><div class="wrap"><span class="eyebrow">KEEP LOOKING</span><h2>Also in this issue<span class="red">.</span></h2><div class="related-grid">${stories.filter(item => item.slug !== story.slug && ['tanim-noor', 'piku', 'guerrilla', 'dr-strangelove'].includes(item.slug)).slice(0, 3).map(storyCard).join('')}</div></div></section>`;

    const special = $('#article-special');
    if (story.slug === 'professors-pick') {
      special.innerHTML = `<div class="film-toolbar"><p>25 films · Selected by Rezwan Shahriar Sumit</p><label class="sr-only" for="film-search">Find a film in the selection</label><input class="film-filter-input" id="film-search" type="search" placeholder="Find a film in this selection…"></div><div id="film-results-count" class="sr-only" aria-live="polite"></div><div class="film-grid" id="film-grid">${professorFilms.map(posterCard).join('')}</div><p class="watchlist-note">Select a poster to explore the original artwork. The selection is transcribed from the posters on pages 16–17.</p>`;
      $('#film-search').addEventListener('input', event => {
        const query = event.target.value.trim().toLocaleLowerCase();
        const films = professorFilms.filter(film => film.title.toLocaleLowerCase().includes(query));
        $('#film-grid').innerHTML = films.length ? films.map(posterCard).join('') : '<p class="search-empty">No films match that title.</p>';
        $('#film-results-count').textContent = `${films.length} films found`;
      });
    } else if (story.slug === 'underrated-jewels') special.innerHTML = filmTable('International films', foreignFilms) + filmTable('Bengali-language films', bengaliFilms) + '<p class="print-note">Titles and names have been copyedited for spelling and capitalization. The print list is preserved below; uncertain release information has been left out of the web list.</p>';
    else if (story.slug === 'screen-teaches-screen') special.innerHTML = `<div class="resource-grid">${resources.map(([title, category, url]) => `<a class="resource-item" href="${escape(url)}" target="_blank" rel="noopener noreferrer"><div><h3>${escape(title)}</h3><small>${escape(category)}</small></div><span aria-hidden="true">↗</span><span class="sr-only">(opens in a new tab)</span></a>`).join('')}</div>`;
    else if (story.slug === 'club-at-a-glance') special.innerHTML = `<div class="activity-grid">${activities.map(([id, title, caption]) => `<figure class="activity-card"><img src="${image(id)}" alt="${escape(imageDescriptions[id] || title)}" loading="lazy"><figcaption><h3>${escape(title)}</h3><p>${escape(caption)}</p></figcaption></figure>`).join('')}</div>`;

    const saveButton = $('#save-story');
    const storageKey = 'subtext-saved-stories';
    let saved = [];
    try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(value)) saved = value.filter(item => typeof item === 'string'); } catch { /* Private browsing can make storage unavailable. */ }
    function renderSaved() { const active = saved.includes(story.slug); saveButton.setAttribute('aria-pressed', String(active)); saveButton.textContent = active ? 'Saved to this browser ✓' : 'Save for later ＋'; }
    renderSaved();
    saveButton.addEventListener('click', () => {
      const next = saved.includes(story.slug) ? saved.filter(slug => slug !== story.slug) : [...saved, story.slug];
      try { localStorage.setItem(storageKey, JSON.stringify(next)); saved = next; renderSaved(); }
      catch { $('#share-status').textContent = 'This browser could not save the story. You can bookmark this page instead.'; saveButton.textContent = 'Use your browser bookmark'; }
    });
    $('#share-story').addEventListener('click', async event => {
      const button = event.currentTarget;
      try { await navigator.clipboard.writeText(articleUrl); button.textContent = 'Link copied ✓'; $('#share-status').textContent = 'Story link copied to clipboard.'; }
      catch { $('#share-status').textContent = 'Copy the address from your browser to share this story.'; button.textContent = 'Copy the browser address'; }
    });

    const articleUrl = new URL(storyUrl(story.slug), document.baseURI).href;
    const shareTitle = `${story.title} — SUBTEXT`;
    const encodedUrl = encodeURIComponent(articleUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const shareLinks = [
      ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`],
      ['WhatsApp', `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${articleUrl}`)}`],
      ['X', `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`],
      ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`],
      ['Telegram', `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`],
      ['Email', `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${shareTitle}\n\n${articleUrl}`)}`],
    ];
    $('#share-story').insertAdjacentHTML('afterend', '<button class="bookmark-button article-share-button" id="open-share" aria-haspopup="dialog" aria-controls="article-share-dialog">Share <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg></button>');
    document.body.insertAdjacentHTML('beforeend', `<dialog id="article-share-dialog" class="article-share-dialog" aria-labelledby="article-share-title" aria-describedby="article-share-story"><div class="dialog-heading"><h2 id="article-share-title">Share this story.</h2><button class="icon-button" id="close-article-share" aria-label="Close sharing options">×</button></div><p class="article-share-story" id="article-share-story">${escape(story.title)}</p><div class="article-share-links">${shareLinks.map(([label, url]) => `<a href="${escape(url)}"${label === 'Email' ? '' : ' target="_blank" rel="noopener noreferrer"'}><span>${label}</span><span aria-hidden="true">↗</span><span class="sr-only">${label === 'Email' ? ' (opens your email app)' : ' (opens in a new tab)'}</span></a>`).join('')}</div><button class="button button-outline article-share-native" id="native-share"${typeof navigator.share === 'function' ? '' : ' hidden'}>More sharing options <span aria-hidden="true">↗</span></button><p class="article-share-notice" id="native-share-status" aria-live="polite" hidden></p></dialog>`);
    const articleShareDialog = $('#article-share-dialog');
    $('#open-share').addEventListener('click', () => articleShareDialog.showModal());
    $('#close-article-share').addEventListener('click', () => articleShareDialog.close());
    articleShareDialog.addEventListener('click', event => {
      if (event.target !== articleShareDialog) return;
      const bounds = articleShareDialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) articleShareDialog.close();
    });
    $('#native-share').addEventListener('click', async () => {
      try { await navigator.share({ title: shareTitle, url: articleUrl }); articleShareDialog.close(); }
      catch (error) {
        if (error.name === 'AbortError') return;
        const notice = $('#native-share-status');
        notice.hidden = false;
        notice.textContent = 'Your browser could not open its sharing options. Choose a platform above instead.';
      }
    });
  }
}

if (currentPage === 'issue') {
  const extras = [{ title: 'Cover', page: 1 }, { title: 'Publication details', page: 2 }, { title: 'Editorial & masthead', page: 3 }, { title: 'In remembrance', page: 5 }, { title: 'Messages & contents', page: 6 }];
  $('#reader-contents').innerHTML = [...extras, ...stories.slice().sort((a, b) => a.page - b.page)].map(item => `<a href="${pageUrl(item.page)}" data-page="${item.page}"><span>${escape(item.title)}</span><span>${pad(item.page)}</span></a>`).join('');
  $('#page-select').innerHTML = Array.from({ length: issue.pages }, (_, index) => `<option value="${index + 1}">Page ${index + 1} of ${issue.pages}</option>`).join('');
  let page = 1;
  const initial = Number(params.get('page'));
  const defaultTitle = 'The Inaugural Issue — SUBTEXT';
  function turnPage(next, updateHistory = true) {
    const number = Number(next);
    page = Number.isFinite(number) ? Math.max(1, Math.min(issue.pages, Math.trunc(number))) : 1;
    $('#reader-page').src = `assets/pages/page-${pad(page)}.webp`;
    $('#reader-page').alt = `SUBTEXT, Volume 1, Issue 1. Original print page ${page} of ${issue.pages}. Open the PDF below for the original document.`;
    $('#page-select').value = page;
    $('#prev-page').disabled = page === 1;
    $('#next-page').disabled = page === issue.pages;
    $('#reader-status').textContent = `Page ${page} of ${issue.pages}. Use the arrow buttons or left and right arrow keys to turn pages.`;
    $('#page-stage').scrollTop = 0;
    $('#page-stage').scrollLeft = 0;
    const activeStory = stories.find(story => page >= story.page && page <= story.end);
    $$('#reader-contents a').forEach(link => {
      const active = Number(link.dataset.page) === (activeStory?.page || page);
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    document.title = `Page ${page} / ${defaultTitle}`;
    if (updateHistory) { const url = new URL(location.href); url.searchParams.set('page', page); history.replaceState(null, '', url); }
    for (const number of [page - 1, page + 1]) if (number >= 1 && number <= issue.pages) { const nextImage = new Image(); nextImage.src = `assets/pages/page-${pad(number)}.webp`; }
  }
  turnPage(initial >= 1 ? initial : 1, false);
  $('#prev-page').addEventListener('click', () => turnPage(page - 1));
  $('#next-page').addEventListener('click', () => turnPage(page + 1));
  $('#page-select').addEventListener('change', event => turnPage(event.target.value));
  $$('#reader-contents a').forEach(link => link.addEventListener('click', event => { event.preventDefault(); turnPage(Number(link.dataset.page)); $('.reader-controls').scrollIntoView({ block: 'start' }); }));
  $('#zoom-page').addEventListener('click', event => { const zoomed = $('#page-stage').classList.toggle('zoomed'); event.currentTarget.setAttribute('aria-pressed', String(zoomed)); event.currentTarget.innerHTML = `${zoomed ? 'Fit to width' : 'Enlarge page'} <span aria-hidden="true">${zoomed ? '−' : '＋'}</span>`; });
  document.addEventListener('keydown', event => { if (document.querySelector('dialog[open]') || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; if (event.key === 'ArrowLeft') { event.preventDefault(); turnPage(page - 1); } if (event.key === 'ArrowRight') { event.preventDefault(); turnPage(page + 1); } });
  if (matchMedia('(max-width: 800px)').matches) $('.reader-sidebar details').open = false;
}

if (currentPage === 'archive') {
  const grid = $('#archive-grid');
  try {
    const response = await fetch('assets/image-manifest.json');
    if (!response.ok) throw new Error('Archive unavailable');
    const images = await response.json();
    const professorIds = new Set(professorFilms.map(film => film.image));
    const posterIds = new Set([...professorIds, 'p15-03', 'p15-04', 'p15-06', 'p15-07', 'p19-02', 'p29-02']);
    function type(record) { const page = record.pages[0]; if (posterIds.has(record.id)) return 'posters'; if ([5, 6, 8, 34, 35].includes(page) || ['p07-03', 'p16-08', 'p22-01', 'p26-01', 'p30-01', 'p31-02'].includes(record.id)) return 'people'; if ([9, 10, 11, 12, 18, 27, 28, 33].includes(page) || record.id === 'p15-02') return 'film'; return 'design'; }
    function caption(record) { return imageDescriptions[record.id] || `Artwork from page ${record.pages[0]}`; }
    function openImage(record) {
      $('#lightbox-image').src = record.src;
      $('#lightbox-image').alt = caption(record);
      $('#lightbox-caption').textContent = `${caption(record)} · Page ${record.pages[0]}`;
      $('#lightbox-download').href = record.original;
      $('#lightbox-page').href = pageUrl(record.pages[0]);
      $('#image-dialog').showModal();
    }
    function renderArchive() {
      const selected = $('#archive-filter').value;
      const filtered = images.filter(record => selected === 'all' || type(record) === selected);
      grid.innerHTML = filtered.map(record => `<article class="archive-card"><button data-image="${record.id}" aria-label="Preview ${escape(caption(record))}"><img src="${record.src}" alt="${escape(caption(record))}" loading="lazy" width="${record.width}" height="${record.height}"></button><h2>${escape(caption(record))}</h2><p>PAGE ${record.pages.map(pad).join(', ')} <span aria-hidden="true"> / </span> ${record.width} × ${record.height}</p></article>`).join('');
      $('#archive-count').textContent = `${filtered.length} images`;
      $$('[data-image]', grid).forEach(button => button.addEventListener('click', () => openImage(images.find(record => record.id === button.dataset.image))));
    }
    $('#archive-filter').addEventListener('change', renderArchive);
    $('#close-image').addEventListener('click', () => $('#image-dialog').close());
    renderArchive();
    const requested = images.find(record => record.id === params.get('image'));
    if (requested) openImage(requested);
  } catch {
    grid.innerHTML = '<p>The archive could not load. Please refresh, or <a class="text-link" href="issue.html">explore the original issue ↗</a>.</p>';
    $('#archive-count').textContent = 'Unable to load';
  }
}

// Resolve in-page links after dynamically rendered content is available.
if (location.hash) requestAnimationFrame(() => {
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  target?.scrollIntoView({ block: 'start' });
});

