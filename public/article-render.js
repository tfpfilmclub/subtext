export function renderProse(story, escape) {
  return (story.body || [story.intro]).map(block => {
    if (typeof block !== 'string') return `<h2 class="prose-heading">${escape(block.heading)}</h2>`;
    const speaker = story.transcript && block.match(/^(শুভ সেন|শুভ|তানিম নূর|ব্রুকস|সরকিন|জেরেমি ও\. হ্যারিস|জাফর পানাহি|হ্যারিস|পানাহি):\s*/);
    if (!speaker) return `<p>${escape(block)}</p>`;
    const question = /^(শুভ|ব্রুকস|জেরেমি|হ্যারিস)/.test(speaker[1]);
    return `<p class="${question ? 'interview-question' : 'interview-answer'}"><strong>${escape(speaker[1])}:</strong> ${escape(block.slice(speaker[0].length))}</p>`;
  }).join('\n');
}

export function transcriptIntro(story, escape) {
  if (!story.transcript) return '';
  return `<nav class="article-text-links" lang="bn" aria-label="লেখার অন্য সংস্করণ"><a href="${escape(story.transcript)}" download>লেখাটি ডাউনলোড করুন <span aria-hidden="true">↓</span></a><a href="issue.html?page=${story.page}">ম্যাগাজিনের পাতায় পড়ুন <span aria-hidden="true">↗</span></a></nav>`;
}
