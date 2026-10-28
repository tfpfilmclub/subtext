import { cp, mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const source=path.join(root,'services/community'),site=path.join(root,'tmp/community-site');
const files = {'community-api.mjs':'lib/community-api.mjs','schema.ts':'db/schema.ts','route.ts':'app/api/[[...path]]/route.ts','moderation-page.tsx':'app/moderation/page.tsx','moderation-client.tsx':'app/moderation/moderation-client.tsx','home-page.tsx':'app/page.tsx','layout.tsx':'app/layout.tsx','.openai/hosting.json':'.openai/hosting.json'};
for(const [input,output] of Object.entries(files)){await mkdir(path.dirname(path.join(site,output)),{recursive:true});await cp(path.join(source,input),path.join(site,output));}
await cp(path.join(root,'public/assets/favicon.svg'),path.join(site,'public/favicon.svg'));
console.log('Synced community service source into its isolated Sites checkout.');
