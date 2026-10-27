import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const destination = path.join(root, 'dist');
// The destination is fixed inside this repository.
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const entry of await readdir(path.join(root, 'public'))) {
  await cp(path.join(root, 'public', entry), path.join(destination, entry), { recursive: true });
}
console.log('Built static website in dist/');
