// Reading estimates use only the article's text, never navigation or captions.
export function readingStats(text) {
  let banglaWords = 0, otherWords = 0;
  for (const part of new Intl.Segmenter('bn', { granularity: 'word' }).segment(text.normalize('NFC'))) {
    if (!part.isWordLike) continue;
    if (/[\u0980-\u09ff]/.test(part.segment)) banglaWords++;
    else otherWords++;
  }
  return { words: banglaWords + otherWords, minutes: Math.max(1, Math.ceil(banglaWords / 180 + otherWords / 220)) };
}

export function readingLabel(story, includeWords = false) {
  const { minutes, words } = story.reading;
  if (story.language === 'বাংলা') {
    const number = new Intl.NumberFormat('bn-BD');
    return `${number.format(minutes)} মিনিটের পাঠ${includeWords ? ` · ${number.format(words)} শব্দ` : ''}`;
  }
  return `${minutes} min read${includeWords ? ` · ${words.toLocaleString('en')} words` : ''}`;
}
