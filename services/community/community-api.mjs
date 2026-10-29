const STORIES = new Set(['tanim-noor','piku','guerrilla','dr-strangelove','dear-mother','aaron-sorkin','underrated-jewels','professors-pick','shooting-memories','screen-teaches-screen','baker-street','monihar','jafar-panahi','devils-advocate','club-at-a-glance']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const encode = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
const decode = text => Uint8Array.from(atob(text.replaceAll('-','+').replaceAll('_','/')), char => char.charCodeAt(0));
const utf8 = new TextEncoder();
async function key(secret) { return crypto.subtle.importKey('raw', utf8.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign','verify']); }
async function sign(secret, value) { return encode(await crypto.subtle.sign('HMAC', await key(secret), utf8.encode(value))); }
async function session(secret, token) {
  try {
    const [body, signature, extra] = token.split('.');
    if (!body || !signature || extra || token.length > 512) return null;
    if (!await crypto.subtle.verify('HMAC', await key(secret), decode(signature), utf8.encode(body))) return null;
    const data = JSON.parse(new TextDecoder().decode(decode(body)));
    return UUID.test(data.sub) && data.exp > Date.now() / 1000 ? data.sub : null;
  } catch { return null; }
}
function fail(status, message) { throw Object.assign(new Error(message), {status}); }
async function payload(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) fail(415,'JSON required.');
  const reader = request.body?.getReader();
  if (!reader) fail(400,'Request body required.');
  const chunks=[]; let size=0;
  while (true) {
    const {done,value}=await reader.read();
    if(done)break;
    size+=value.byteLength;
    if(size>10000){await reader.cancel();fail(413,'Request too large.');}
    chunks.push(value);
  }
  const bytes=new Uint8Array(size);let offset=0;
  for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  const raw=new TextDecoder().decode(bytes);
  try { return JSON.parse(raw); } catch { fail(400,'Invalid request.'); }
}

export async function handleCommunity(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const allowed = new Set(['https://tfpfilmclub.github.io',url.origin,...(env.PREVIEW_ORIGINS || '').split(',').filter(Boolean)]);
  const headers = {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};
  if (origin && allowed.has(origin)) Object.assign(headers, {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Max-Age':'600'});
  const reply = (value, status=200) => new Response(JSON.stringify(value), {status, headers});
  const admin = !!env.OWNER_ID && request.headers.get('oai-authenticated-user-id') === env.OWNER_ID;
  try {
    if (origin && !allowed.has(origin)) fail(403,'Origin not allowed.');
    if (request.method === 'OPTIONS') return new Response(null,{status:204,headers});
    if (!env.DB || !env.SESSION_SECRET) fail(503,'Community is temporarily unavailable.');
    const db = env.DB;
    const visitor = await session(env.SESSION_SECRET, (request.headers.get('Authorization') || '').replace(/^Bearer /,''));
    async function rateLimit(action, maximum) {
      const address = request.headers.get('cf-connecting-ip') || 'unknown';
      const bucket = await sign(env.SESSION_SECRET, `${action}:${address}`);
      const hour = Math.floor(Date.now()/3600000);
      const result = await db.prepare('INSERT INTO rate_limits (bucket, hour, count) VALUES (?, ?, 1) ON CONFLICT(bucket, hour) DO UPDATE SET count = count + 1 RETURNING count').bind(bucket,hour).first();
      if (result.count > maximum) fail(429,'Please wait before trying again.');
      await db.prepare('DELETE FROM rate_limits WHERE hour < ?').bind(hour-48).run();
    }
    if (url.pathname === '/api/session' && request.method === 'POST') {
      if (!origin) fail(403,'Open this from SUBTEXT.');
      await rateLimit('session',20);
      const body = encode(utf8.encode(JSON.stringify({sub:crypto.randomUUID(),exp:Math.floor(Date.now()/1000)+180*86400})));
      return reply({token:`${body}.${await sign(env.SESSION_SECRET,body)}`});
    }
    const viewsRoute = /^\/api\/articles\/([a-z0-9-]+)\/views$/.exec(url.pathname);
    if (viewsRoute) {
      const slug = viewsRoute[1];
      if (!STORIES.has(slug)) fail(404,'Article not found.');
      if (request.method === 'POST') {
        if (!visitor || !origin) fail(401,'Refresh the page and try again.');
        await payload(request);
        await rateLimit('view',180);
        const now = Date.now(), cutoff = now - 30*60*1000;
        // D1 batches are atomic: concurrent refreshes cannot increment the
        // aggregate without also recording the browser's counting window.
        await db.batch([
          db.prepare('INSERT INTO article_views (story, count) SELECT ?, 1 WHERE NOT EXISTS (SELECT 1 FROM view_sessions WHERE story = ? AND visitor = ? AND last_counted_at > ?) ON CONFLICT(story) DO UPDATE SET count = count + 1').bind(slug,slug,visitor,cutoff),
          db.prepare('INSERT INTO view_sessions (story, visitor, last_counted_at) VALUES (?, ?, ?) ON CONFLICT(story, visitor) DO UPDATE SET last_counted_at = excluded.last_counted_at WHERE last_counted_at <= ?').bind(slug,visitor,now,cutoff),
          db.prepare('DELETE FROM view_sessions WHERE last_counted_at < ?').bind(now - 86400000),
        ]);
      } else if (request.method !== 'GET') fail(405,'Method not allowed.');
      const total = await db.prepare('SELECT count FROM article_views WHERE story = ?').bind(slug).first();
      return reply({views:total?.count || 0});
    }
    const storyRoute = /^\/api\/articles\/([a-z0-9-]+)$/.exec(url.pathname);
    if (storyRoute) {
      const slug = storyRoute[1];
      if (!STORIES.has(slug)) fail(404,'Article not found.');
      if (request.method === 'POST') {
        if (!visitor || !origin) fail(401,'Refresh the page and try again.');
        await rateLimit('reaction',180);
        const data = await payload(request);
        if (!['like','love',null].includes(data.reaction)) fail(400,'Invalid reaction.');
        if (data.reaction === null) await db.prepare('DELETE FROM reactions WHERE story = ? AND visitor = ?').bind(slug,visitor).run();
        else await db.prepare('INSERT INTO reactions (story, visitor, reaction) VALUES (?, ?, ?) ON CONFLICT(story, visitor) DO UPDATE SET reaction = excluded.reaction').bind(slug,visitor,data.reaction).run();
      } else if (request.method !== 'GET') fail(405,'Method not allowed.');
      const counts = await db.prepare('SELECT reaction, COUNT(*) AS count FROM reactions WHERE story = ? GROUP BY reaction').bind(slug).all();
      const reactions = {like:0,love:0};
      for (const row of counts.results) reactions[row.reaction] = row.count;
      const mine = visitor ? await db.prepare('SELECT reaction FROM reactions WHERE story = ? AND visitor = ?').bind(slug,visitor).first() : null;
      const page = Number(url.searchParams.get('page') || 0);
      if (!Number.isInteger(page) || page < 0 || page > 1000) fail(400,'Invalid page.');
      const comments = await db.prepare("SELECT id, name, text, created_at, visitor FROM comments WHERE story = ? AND status = 'published' ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET ?").bind(slug,page*20).all();
      const total = await db.prepare("SELECT COUNT(*) AS count FROM comments WHERE story = ? AND status = 'published'").bind(slug).first();
      return reply({reactions,myReaction:mine?.reaction || null,comments:comments.results.map(({visitor:writer,...comment})=>({...comment,canDelete:!!visitor && writer===visitor})),totalComments:total.count,page,hasMore:(page+1)*20<total.count});
    }
    if (url.pathname === '/api/comments' && request.method === 'POST') {
      if (!visitor || !origin) fail(401,'Refresh the page and try again.');
      const data = await payload(request);
      const name = typeof data.name === 'string' ? data.name.trim().normalize('NFC') : '';
      const text = typeof data.text === 'string' ? data.text.trim().normalize('NFC') : '';
      if (!STORIES.has(data.story) || !name || name.length > 60 || text.length < 3 || text.length > 2000 || data.website) fail(400,'Check the name and comment.');
      await rateLimit('comment',6);
      const id = crypto.randomUUID();
      await db.prepare('INSERT INTO comments (id, story, visitor, name, text, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id,data.story,visitor,name,text,new Date().toISOString(),'published').run();
      return reply({id},201);
    }
    const commentRoute = /^\/api\/comments\/([a-f0-9-]+)\/(delete|report)$/.exec(url.pathname);
    if (commentRoute && request.method === 'POST') {
      if ((!visitor && !admin) || !origin) fail(401,'Refresh the page and try again.');
      const [,id,action] = commentRoute;
      if (!UUID.test(id)) fail(404,'Comment not found.');
      const comment = await db.prepare('SELECT visitor FROM comments WHERE id = ?').bind(id).first();
      if (!comment) fail(404,'Comment not found.');
      if (action === 'delete') {
        if (!admin && comment.visitor !== visitor) fail(403,'This is not your comment.');
        await db.prepare("UPDATE comments SET status = 'deleted', text = '', name = '' WHERE id = ?").bind(id).run();
      } else {
        if (!visitor) fail(401,'Refresh the page and try again.');
        await rateLimit('report',15);
        await db.prepare('INSERT OR IGNORE INTO reports (comment_id, visitor) VALUES (?, ?)').bind(id,visitor).run();
        const reports = await db.prepare('SELECT COUNT(*) AS count FROM reports WHERE comment_id = ?').bind(id).first();
        if (reports.count >= 3) await db.prepare("UPDATE comments SET status = 'hidden' WHERE id = ? AND status = 'published'").bind(id).run();
      }
      return reply({ok:true});
    }
    if (url.pathname === '/api/moderation' && request.method === 'GET') {
      if (!admin) fail(403,'Owner access required.');
      const rows = await db.prepare("SELECT c.id, c.story, c.name, c.text, c.created_at, c.status, (SELECT COUNT(*) FROM reports r WHERE r.comment_id = c.id) AS reports FROM comments c WHERE c.status != 'deleted' ORDER BY c.created_at DESC LIMIT 100").all();
      return reply({comments:rows.results});
    }
    fail(404,'Not found.');
  } catch (error) {
    return reply({error: error.status ? error.message : 'Please try again in a moment.'},error.status || 500);
  }
}
