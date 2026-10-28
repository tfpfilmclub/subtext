import { communityOrigin } from './community-config.js';
const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
const thumb = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10v11H3V10h4Zm0 0 5-8c3 0 3 3 2 7h5a2 2 0 0 1 2 2l-2 8a2 2 0 0 1-2 2H7"/></svg>';

export async function mountCommunity(container, story) {
  if (!container || !communityOrigin) return;
  const bn = story.language === 'বাংলা';
  const copy = bn ? {prompt:'লেখাটি ভালো লেগেছে?',like:'লাইক',love:'ভালোবাসা',title:'পাঠকের কথা',name:'আপনার নাম',comment:'আপনার মন্তব্য',send:'মন্তব্য প্রকাশ করুন',sending:'পাঠানো হচ্ছে…',empty:'এখনও কোনো মন্তব্য নেই।',load:'আরও মন্তব্য',error:'এই মুহূর্তে সংযোগ হচ্ছে না। একটু পরে আবার চেষ্টা করুন।',retry:'আবার চেষ্টা করুন',public:'আপনার নাম ও মন্তব্য সবার কাছে দেখা যাবে।',remove:'মুছুন',report:'রিপোর্ট করুন',reported:'রিপোর্ট পাঠানো হয়েছে।',published:'আপনার মন্তব্য প্রকাশিত হয়েছে।',guest:'পাঠক'} : {prompt:'Did you enjoy this story?',like:'Like',love:'Love',title:'Comments',name:'Your name',comment:'Your comment',send:'Post comment',sending:'Posting…',empty:'No comments yet.',load:'More comments',error:'We couldn’t connect just now. Please try again.',retry:'Try again',public:'Your name and comment will be visible to everyone.',remove:'Delete',report:'Report',reported:'Report received.',published:'Your comment has been posted.',guest:'Reader'};
  container.innerHTML = `<section class="reader-community" aria-labelledby="comments-title"${bn?' lang="bn"':''}><div class="reader-reactions"><p>${copy.prompt}</p><div class="reaction-buttons"><button type="button" data-reaction="like" aria-pressed="false" disabled>${thumb}<span>${copy.like}</span><span data-count="like">—</span></button><button type="button" data-reaction="love" aria-pressed="false" disabled>${heart}<span>${copy.love}</span><span data-count="love">—</span></button></div></div><div class="comments-heading"><h2 id="comments-title">${copy.title}</h2><span class="comment-total"></span></div><p class="community-status" role="status" aria-live="polite"></p><button class="community-retry" type="button" hidden>${copy.retry}</button><form class="comment-form"><label>${copy.name}<input name="name" autocomplete="name" required maxlength="60"></label><label>${copy.comment}<textarea name="comment" required minlength="3" maxlength="2000" rows="4"></textarea></label><label class="comment-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><div class="comment-form-bottom"><p>${copy.public}</p><button type="submit" class="button button-red" disabled>${copy.send}</button></div></form><div class="comment-list"></div><button type="button" class="community-more" hidden>${copy.load} ↓</button></section>`;
  const $ = selector => container.querySelector(selector);
  const status = $('.community-status');
  const form = $('.comment-form');
  let token, sessionPromise, state, page=0, working=false;
  try { token = localStorage.getItem('subtext-reader-session'); } catch {}
  async function getSession() {
    if (token) return token;
    if (!sessionPromise) sessionPromise = fetch(`${communityOrigin}/api/session`, {method:'POST',headers:{'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(15000)}).then(async response => {if(!response.ok)throw new Error('Session failed');const data=await response.json();token=data.token;try{localStorage.setItem('subtext-reader-session',token);}catch{}return token;}).finally(()=>{sessionPromise=null;});
    return sessionPromise;
  }
  async function request(route, options={}, retry=true) {
    const response = await fetch(`${communityOrigin}${route}`, {...options,signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json','Authorization':`Bearer ${await getSession()}`,...options.headers}});
    if (response.status===401 && retry) {token=null;try{localStorage.removeItem('subtext-reader-session');}catch{}return request(route,options,false);}
    if (!response.ok) throw new Error(`Community request failed: ${response.status}`);
    return response.json();
  }
  function failed() {status.textContent=copy.error;$('.community-retry').hidden=false;}
  function render(next, append=false) {
    state=next;
    for(const reaction of ['like','love']) {const button=$(`[data-reaction="${reaction}"]`);button.setAttribute('aria-pressed',String(next.myReaction===reaction));button.querySelector('[data-count]').textContent=new Intl.NumberFormat(bn?'bn-BD':'en').format(next.reactions[reaction]);button.disabled=false;}
    $('.comment-total').textContent=new Intl.NumberFormat(bn?'bn-BD':'en').format(next.totalComments);
    const comments = next.comments.map(comment => {
      const date=new Date(comment.created_at);
      const when=new Intl.DateTimeFormat(bn?'bn-BD':'en',{dateStyle:'medium'}).format(date);
      return `<article class="reader-comment"><header><strong>${escape(comment.name)}</strong><span>${copy.guest} · <time datetime="${escape(comment.created_at)}">${escape(when)}</time></span></header><p>${escape(comment.text)}</p><button type="button" data-comment-id="${escape(comment.id)}" data-comment-action="${comment.canDelete?'delete':'report'}">${comment.canDelete?copy.remove:copy.report}</button></article>`;
    }).join('');
    if(append) $('.comment-list').insertAdjacentHTML('beforeend',comments);
    else $('.comment-list').innerHTML=comments || `<p class="comments-empty">${copy.empty}</p>`;
    $('.community-more').hidden=!next.hasMore;
    form.querySelector('[type="submit"]').disabled=false;
    $('.community-retry').hidden=true;
  }
  async function refresh() {page=0;render(await request(`/api/articles/${story.slug}`));}
  $('.community-retry').addEventListener('click',async()=>{try{await refresh();status.textContent='';}catch{failed();}});
  for (const button of container.querySelectorAll('[data-reaction]')) button.addEventListener('click',async()=>{
    if(working)return;working=true;
    const reaction=state.myReaction===button.dataset.reaction?null:button.dataset.reaction;
    try{for(const item of container.querySelectorAll('[data-reaction]'))item.disabled=true;render(await request(`/api/articles/${story.slug}`,{method:'POST',body:JSON.stringify({reaction})}));page=0;status.textContent='';}
    catch{for(const item of container.querySelectorAll('[data-reaction]'))item.disabled=false;failed();}finally{working=false;}
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(working || !form.reportValidity())return;working=true;
    const submit=form.querySelector('[type="submit"]');submit.disabled=true;submit.textContent=copy.sending;
    try{await request('/api/comments',{method:'POST',body:JSON.stringify({story:story.slug,name:form.elements.name.value,text:form.elements.comment.value,website:form.elements.website.value})});form.elements.comment.value='';await refresh();status.textContent=copy.published;}
    catch{failed();}finally{working=false;submit.disabled=false;submit.textContent=copy.send;}
  });
  $('.comment-list').addEventListener('click',async event=>{
    const button=event.target.closest('[data-comment-action]');if(!button || working)return;working=true;button.disabled=true;
    try{await request(`/api/comments/${button.dataset.commentId}/${button.dataset.commentAction}`,{method:'POST',body:'{}'});if(button.dataset.commentAction==='delete'){await refresh();status.textContent='';}else{status.textContent=copy.reported;button.hidden=true;}}
    catch{failed();button.disabled=false;}finally{working=false;}
  });
  $('.community-more').addEventListener('click',async()=>{try{const next=await request(`/api/articles/${story.slug}?page=${page+1}`);page++;render(next,true);}catch{failed();}});
  try{await refresh();}catch{failed();}
}
