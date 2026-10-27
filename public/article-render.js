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
  return `<section class="transcript-note" lang="bn" aria-label="পাঠ-সংস্করণ সম্পর্কে"><span class="eyebrow">বাংলা পাঠ-সংস্করণ</span><p>মুদ্রিত লেখার সঙ্গে মিলিয়ে প্রস্তুত। নিশ্চিত বানান ও মুদ্রণপ্রমাদ সংশোধিত; মূল বক্তব্য ও ভাষাভঙ্গি সংরক্ষিত।</p>${story.transcriptionNote ? `<p class="transcription-uncertainty">${escape(story.transcriptionNote)}</p>` : ''}<a href="${escape(story.transcript)}" download>লেখাটি ডাউনলোড করুন <span aria-hidden="true">↓</span></a><a href="issue.html?page=${story.page}">মূল মুদ্রণ দেখুন <span aria-hidden="true">↗</span></a></section>`;
}
