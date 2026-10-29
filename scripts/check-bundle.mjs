import { readdir, stat } from 'node:fs/promises';

const dir = 'apps/playground/dist/assets';
let total = 0;
for (const name of await readdir(dir)) {
  if (name.endsWith('.js')) total += (await stat(`${dir}/${name}`)).size;
}
if (total > 400000) throw new Error(`Playground JavaScript budget exceeded: ${total}`);
console.log(`Playground JavaScript: ${total} / 400000 bytes`);
