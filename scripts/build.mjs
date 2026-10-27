import { cp, mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { generateStoryPages } from './story-pages.mjs';
const root = path.resolve(import.meta.dirname, '..');
const destination = path.join(root, 'dist');
// The destination is fixed inside this repository.
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const entry of await readdir(path.join(root, 'public'))) {
  if (entry === 'stories') continue; // Generate fresh story HTML from the current content.
  await cp(path.join(root, 'public', entry), path.join(destination, entry), { recursive: true });
}
const fingerprint = content => createHash('sha256').update(content).digest('hex').slice(0, 12);
// Refresh all content-module imports together, including Bangla transcriptions.
const moduleFiles = (await readdir(destination)).filter(file => file.endsWith('.js')).sort();
const moduleSources = await Promise.all(moduleFiles.map(file => readFile(path.join(destination, file), 'utf8')));
const dataVersion = fingerprint(moduleSources.join('\n'));
for (let index = 0; index < moduleFiles.length; index++) {
  const source = moduleSources[index].replace(/from '(\.\/[^'?]+\.js)'/g, `from '$1?v=${dataVersion}'`);
  await writeFile(path.join(destination, moduleFiles[index]), source, 'utf8');
}
const appPath = path.join(destination, 'app.js');
const app = await readFile(appPath, 'utf8');
const versions = { appVersion: fingerprint(app), styleVersion: fingerprint(await readFile(path.join(destination, 'styles.css'))) };
for (const file of (await readdir(destination)).filter(file => file.endsWith('.html'))) {
  const filePath = path.join(destination, file);
  const html = (await readFile(filePath, 'utf8')).replaceAll('src="app.js"', `src="app.js?v=${versions.appVersion}"`).replaceAll('href="styles.css"', `href="styles.css?v=${versions.styleVersion}"`);
  await writeFile(filePath, html, 'utf8');
}
await generateStoryPages(destination, versions);
console.log('Built static website and 15 preview-ready article pages in dist/');
