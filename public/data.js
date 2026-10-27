import { articleText } from './article-text.js';

export const issue = {
  title: 'The Inaugural Issue', volume: 1, number: 1, date: 'January 2026',
  pages: 36, issn: '3134-7878', pdf: 'editions/subtext-vol-01-issue-01.pdf',
};

export const stories = [
  { slug: 'tanim-noor', title: 'In Conversation with Tanim Noor', category: 'Interviews', language: 'বাংলা', author: 'Shuvo Sen', page: 22, end: 25, image: 'p22-01', tone: 'blue', portrait: true,
    excerpt: 'On finding a voice, the realities of filmmaking, and following the impulse to make a film. A conversation with the director of Utshob.',
    intro: 'Shuvo Sen sits down with filmmaker Tanim Noor for the inaugural issue of SUBTEXT. Their conversation moves from his early encounters with cinema to the challenges of working in Bangladesh’s film industry.' },
  { slug: 'piku', title: 'The Semiotics of Female Independence', subtitle: 'A Feminist Reading of Piku’s Costume', category: 'Essays', language: 'English', author: 'Nur Hossain Nafish', page: 12, end: 12, image: 'p12-01',
    excerpt: 'In Piku, everyday clothing becomes a quiet language of independence, autonomy, and resistance.',
    body: [
      'In cinema, costume is never just about clothing—it is a visual language that communicates character, ideology, and social meaning. In Piku (2015), the costume of the protagonist plays a crucial role in expressing female independence through subtle yet powerful signs. By reading Piku’s clothing through the lens of semiotics and feminist film theory, we can understand how her everyday appearance becomes a symbol of modern womanhood.',
      'From a semiotic perspective, Piku’s costume functions as a sign. The signifiers—simple cotton sarees, loose kurtas, muted colors, minimal makeup, and flat footwear—are carefully chosen visual elements. What they signify is far more meaningful: comfort, practicality, self-confidence, and emotional independence. Unlike conventional female protagonists in mainstream cinema, Piku is not styled to attract attention or conform to traditional beauty standards.',
      'A feminist reading of these visual signs reveals a clear resistance to the male gaze. Piku does not dress to please men or to appear glamorous on screen. Instead, her clothing reflects her priorities—her job, her personal space, and her autonomy. This choice positions her not as an object to be looked at, but as a subject with agency. Her body is not sexualized; it is normalized.',
      'Piku’s costume also challenges stereotypical ideas of femininity. In many films, female characters are visually coded through excessive makeup, fashionable outfits, and ornamental styling. Piku’s understated clothing disrupts this norm. Semiotically, it sends a message that femininity does not need validation through appearance. Independence here is communicated not through rebellion or dramatic transformation, but through everyday choices.',
      'Moreover, the repetition of similar clothing styles throughout the film reinforces consistency in her identity. This visual continuity suggests stability and self-assurance. Her costume becomes a quiet but constant reminder of a woman who is comfortable being herself, even when society expects her to be different.',
    ],
    note: 'The print article ends mid-sentence. This web edition presents its complete paragraphs; the original page is available below.' },
  { slug: 'guerrilla', title: 'The Enduring Echo of Guerrilla', category: 'Essays', language: 'English', author: 'Maimuna Najnin', page: 18, end: 18, image: 'p18-01',
    excerpt: 'A reflection on memory, resistance, and the women whose courage makes history feel personal.',
    body: [
      'Guerrilla (2011) is a film that refuses to let history remain distant. Directed by Nasiruddin Yousuff, it revisits the Bangladesh Liberation War of 1971 not through grand battlefield spectacles, but through the quiet, dangerous lives of urban guerrilla fighters. Watching Guerrilla feels less like entertainment and more like an act of remembrance.',
      'The impression it left on my mind was one of deep emotional weight. The film’s restrained storytelling makes its violence and loss more powerful. Instead of glorifying heroism, Guerrilla exposes fear, moral conflict, and sacrifice with unsettling honesty. Joya Ahsan’s portrayal of Bilkis Banu is particularly striking. Her journey from an ordinary woman to a determined freedom fighter unfolds gradually, making her courage feel earned rather than exaggerated. The film’s attention to detail—the tension of secret meetings, the constant threat of betrayal, the unbearable cost of resistance—creates an atmosphere of quiet terror that stays with the viewer.',
      'What truly changed my life after watching Guerrilla was my perception of freedom and responsibility. The film forced me to confront how casually we often treat independence, forgetting the individuals who paid for it with their lives, families, and futures. It made history feel personal, not abstract. I began to see freedom as something fragile, sustained not by slogans but by courage and ethical choices made under extreme pressure.',
      'Guerrilla also reshaped my understanding of women’s roles in history. By centering female fighters and supporters, the film challenges traditional narratives and demands recognition for their often-erased contributions. Long after the credits rolled, Guerrilla left me more aware, more grateful, and more committed to remembering that freedom is not inherited—it is earned, defended, and remembered through stories like these.'
    ], secondaryImage: 'p18-02' },
  { slug: 'dr-strangelove', title: 'The Role of Scenic Design in Dr. Strangelove', category: 'Essays', language: 'English', author: 'Bikromaditto', role: 'Former Organizing Secretary, TFP Film Club', page: 10, end: 11, image: 'p11-02',
    excerpt: 'Inside Kubrick’s war room: how sets, props, and scale give a black comedy its unsettling power.',
    intro: 'Bikromaditto considers the three major settings of Stanley Kubrick’s Dr. Strangelove: Burpelson Air Force Base, the B-52 bomber, and the War Room. The essay reads their sets and props as a visual language of power, absurdity, and nuclear anxiety.' },
  { slug: 'dear-mother', title: 'Community, Cinema & Dear Mother', category: 'Essays', language: 'বাংলা', author: 'S.K. Shuvo Sadique', page: 9, end: 9, image: 'p09-02',
    excerpt: 'On making the first Mro-language film and imagining a cinema rooted in community.',
    intro: 'S.K. Shuvo Sadique writes about cinema, collective filmmaking, and his first Mro-language film, Dear Mother. Read the original Bangla essay in its printed form.' },
  { slug: 'aaron-sorkin', title: 'আরন সরকিন: সংলাপ এবং চরিত্র নির্মাণ', category: 'Interviews', language: 'বাংলা', author: 'মোঃ রিয়াজুল হোসেন', role: 'Bangla translation', page: 13, end: 14, image: 'p10-01', noImage: true,
    excerpt: 'A translated conversation with Aaron Sorkin about intention, obstacles, and the craft of dialogue.',
    intro: 'Aaron Sorkin discusses dialogue and characterization in a conversation with David Brooks. Read the selected interview in its original Bangla magazine layout.' },
  { slug: 'underrated-jewels', title: 'Underrated Jewels', category: 'Watchlists', language: 'English', author: 'The SUBTEXT edit', page: 15, end: 15, image: 'p15-02',
    excerpt: 'From Wings of Desire to The Salt in Our Waters: a watchlist for the endlessly curious.',
    intro: 'A selection from the inaugural issue: international discoveries alongside a collection of Bengali-language films.' },
  { slug: 'professors-pick', title: 'Professor’s Pick', category: 'Watchlists', language: 'English', author: 'Rezwan Shahriar Sumit', page: 16, end: 17, image: 'p16-01',
    excerpt: 'Films to watch closely, return to, and carry into your own practice. Curated by Rezwan Shahriar Sumit.',
    intro: '“I’ve curated this list of films because each one profoundly impacted me upon my first viewing. These are career-launching titles (either the director’s or the actor’s) you may or may not have encountered yet. Regardless, I urge you to watch them, or rewatch them, with a keen eye.”' },
  { slug: 'shooting-memories', title: 'শুটিং, স্মৃতিচারণ এবং অন্যান্য', category: 'Essays', language: 'বাংলা', author: 'সিফাত রহমান', page: 19, end: 20, image: 'p19-02',
    excerpt: 'Reflections from the set, memories of filmmaking, and the stories that stay with us.',
    intro: 'Read this reflection on shooting and filmmaking in its original Bangla print layout.' },
  { slug: 'screen-teaches-screen', title: 'When Screen Teaches the Screen', category: 'Resources', language: 'English', author: 'The SUBTEXT edit', page: 21, end: 21, image: 'p15-05', noImage: true,
    excerpt: 'A film student’s shelf of useful resources, from criticism and craft to editing and lighting.',
    intro: 'The magazine’s resource directory brings together places to learn, watch, and think about filmmaking.' },
  { slug: 'baker-street', title: '221B Baker-ভাই Street', category: 'Essays', language: 'English', author: 'Towsif Ahmed (Jeetu)', page: 26, end: 26, image: 'p26-01', portrait: true, tone: 'gold',
    excerpt: 'A cross-cultural reading of a familiar detective and an enduring television character.',
    intro: 'Read the complete essay in its original layout, from page 26 of the inaugural issue.' },
  { slug: 'monihar', title: 'মণিহারের ‘মণি’ ফুরিয়ে সময়ের কাছে ‘হার’!', category: 'Essays', language: 'বাংলা', author: 'মল্লিকা আফরোজ', page: 27, end: 28, image: 'p27-02',
    excerpt: 'The changing fortunes of Monihar cinema hall, and the memories of a city shaped by its screen.',
    intro: 'Mallika Afroze reflects on Monihar cinema hall in Jashore: its history, its place in the city’s cultural life, and its changing fortunes. Read the original Bangla essay below.' },
  { slug: 'jafar-panahi', title: 'Jafar Panahi on Cinema & Authoritarianism', category: 'Interviews', language: 'বাংলা', author: 'মাঈশা মাহবুব এশা', role: 'Bangla translation', page: 30, end: 31, image: 'p31-02',
    excerpt: 'The filmmaker reflects on making cinema in the face of authoritarian power.',
    intro: 'A Bangla interview feature on director Jafar Panahi, reproduced in the original magazine layout.' },
  { slug: 'devils-advocate', title: 'The Lens of the Devil’s Advocate', category: 'Essays', language: 'English', author: 'Sakib Ahmed', role: 'Former President, TFP Film Club', page: 32, end: 33, image: 'p33-02',
    excerpt: 'Ambition, conscience, and the seductive architecture of power in Taylor Hackford’s film.',
    intro: 'Sakib Ahmed reads The Devil’s Advocate through the relationship between ambition and conscience, drawing parallels with the sociopolitical landscape of Bangladesh.' },
  { slug: 'club-at-a-glance', title: 'TFP Film Club at a Glance', category: 'Community', language: 'English', author: 'TFP Film Club', page: 34, end: 35, image: 'p34-01',
    excerpt: 'The screenings, conversations, workshops, and people behind the magazine.',
    intro: 'A record of the club’s creative life: screenings, workshops, and conversations that bring film students and filmmakers together.' },
];

for (const story of stories) if (articleText[story.slug]) story.body = articleText[story.slug];

export const professorFilms = [
  ['Aftersun', 'p16-01'], ['Winter’s Bone', 'p16-02'], ['Whiplash', 'p16-03'], ['The Savages', 'p16-04'],
  ['Happy as Lazzaro', 'p16-05'], ['Good Time', 'p16-06'], ['Ed Wood', 'p16-07'], ['A Prophet', 'p17-02'],
  ['Martin Eden', 'p17-03'], ['Fantastic Planet', 'p17-04'], ['Embrace of the Serpent', 'p17-05'], ['Nightcrawler', 'p17-06'],
  ['Little Miss Sunshine', 'p17-07'], ['The Great Beauty', 'p17-08'], ['The Place Beyond the Pines', 'p17-09'],
  ['Burning', 'p17-10'], ['An Education', 'p17-11'], ['Mommy', 'p17-12'], ['The Act of Killing', 'p17-13'],
  ['Fish Tank', 'p17-14'], ['The Lives of Others', 'p17-15'], ['About Elly', 'p17-16'], ['Tár', 'p17-17'],
  ['Pan’s Labyrinth', 'p17-18'], ['District 9', 'p17-19'],
].map(([title, image]) => ({ title, image }));

export const foreignFilms = [
  ['The Fall', '2006', 'Tarsem Singh'], ['The Vanishing', '1988', 'George Sluizer'], ['Tell No One', '2006', 'Guillaume Canet'],
  ['Wings of Desire', '1987', 'Wim Wenders'], ['Stand by Me', '1986', 'Rob Reiner'], ['In the Heat of the Sun', '1994', 'Jiang Wen'],
  ['Our Little Sister', '2015', 'Hirokazu Kore-eda'], ['Kikujiro', '1999', 'Takeshi Kitano'], ['Psychokinesis', '2018', 'Yeon Sang-ho'],
  ['Tigers Are Not Afraid', '2017', 'Issa López'], ['Salaam Bombay!', '1988', 'Mira Nair'], ['Peepli Live', '2010', 'Anusha Rizvi'],
  ['No One Knows About Persian Cats', '2009', 'Bahman Ghobadi'], ['Theeb', '2014', 'Naji Abu Nowar'],
  ['Beauty and the Dogs', '2017', 'Kaouther Ben Hania'], ['Synecdoche, New York', '2008', 'Charlie Kaufman'],
  ['Marketa Lazarová', '1967', 'František Vláčil'], ['Typhoon Club', '1985', 'Shinji Sōmai'], ['The Cow', '1969', 'Dariush Mehrjui'],
  ['Le Samouraï', '1967', 'Jean-Pierre Melville'],
];
// The print issue groups these under “Bangla (Bangladeshi) Films”; the web
// heading is “Bengali-language films”, since the list also includes an Indian film.
export const bengaliFilms = [
  ['Lathial', '1975', 'Narayan Ghosh Mita'], ['Ontorjatra', '', 'Tareque Masud & Catherine Masud'],
  ['Made in Bangladesh', '2019', 'Rubaiyat Hossain'], ['Meghe Dhaka Tara', '1960', 'Ritwik Ghatak'],
  ['Shyamol Chhaya', '2004', 'Humayun Ahmed'], ['The Salt in Our Waters', '2020', 'Rezwan Shahriar Sumit'],
  ['Pleasure Boy Komola', '2012', 'Humayun Ahmed'], ['Chhutir Ghonta', '1980', 'Azizul Rahman'],
  ['Under Construction', '2015', 'Rubaiyat Hossain'], ['Are You Listening!', '2012', ''],
  ['Joyjatra', '2004', 'Touqir Ahmed'], ['Jalal’s Story', '2014', 'Abu Shahed Emon'],
];

export const resources = [
  ['British Film Institute', 'Film education & teaching', 'https://www.bfi.org.uk/resources-events-teachers/resources-teachers'],
  ['FilmCare', 'Film preservation', 'https://filmcare.org'], ['Another Gaze', 'Film criticism', 'https://www.anothergaze.com'],
  ['No Film School', 'Filmmaking & industry', 'https://nofilmschool.com/'], ['Filmmaker IQ', 'Film craft', 'https://filmmakeriq.com/'],
  ['RJ Film School', 'Film education', 'https://www.youtube.com/@RJFilmSchool'], ['This Guy Edits', 'Editing', 'https://www.youtube.com/@ThisGuyEdits'],
  ['Aputure', 'Lighting', 'https://www.youtube.com/@aputurelighting'], ['StudioBinder', 'Visual storytelling', 'https://www.studiobinder.com/'],
  ['Kotha Hok Ohetuk', 'Film conversations', 'https://www.youtube.com/@KothaHokOhetuk'], ['In Depth Cine', 'Cinematography', 'https://www.youtube.com/c/indepthcine'],
  ['Filmmakers Academy', 'Film craft', 'https://www.filmmakersacademy.com/'], ['Filmatic', 'Film culture', 'https://www.instagram.com/filmatic/'],
  ['Le Cinema World', 'Film culture', 'https://www.facebook.com/LeCinemaWorld'], ['Asian Cinema Archive', 'Asian cinema', 'https://www.instagram.com/asiancinemaarchive/'],
  ['Film Independent', 'Independent cinema', 'https://www.instagram.com/filmindependent/'], ['The Good Films', 'Film discovery', 'https://www.instagram.com/the_goodfilms/'],
  ['Filmthusiast', 'Film discovery', 'https://www.instagram.com/filmthusiast/'],
];

export const activities = [
  ['p34-01', 'TFP Creative Excellence Awards, 2024', 'A celebration of student creativity.'],
  ['p34-02', 'The next generation', 'Orientation of the newly enrolled 12th batch of TFP.'],
  ['p34-03', 'A Doll Made Up of Clay', 'A special screening and conversation with editor Mahmud Abu Naser.'],
  ['p34-05', 'The craft behind the character', 'A costume design workshop with Edila Farid Turin.'],
  ['p34-06', 'In conversation with Kamar Ahmad Simon', 'A special screening and meet-the-personality session.'],
  ['p35-02', 'Raven, on screen', 'A special screening in collaboration with Goethe-Institut Bangladesh.'],
  ['p35-05', 'The Salt in Our Waters', 'A screening and conversation with Rezwan Shahriar Sumit.'],
];

export const image = id => `assets/images/${id}.webp`;
export const storyUrl = slug => `stories/${encodeURIComponent(slug)}/`;
export const socialImage = slug => `assets/social/${encodeURIComponent(slug)}.jpg`;
export const socialImageSource = story => story.slug === 'aaron-sorkin' ? 'p01-02' : story.image;
export const pageUrl = page => `issue.html?page=${page}`;
