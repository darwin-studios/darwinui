import { readFileSync, writeFileSync, watch, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const files = {
  'agent-overview': 'packages/catalog/src/examples/agent-demo.tsx',
  approval: 'packages/react/src/components/approval-card.tsx',
  results: 'packages/react/src/components/results.tsx',
  threads: 'packages/react/src/layouts/index.tsx',
  'generative-thread': 'packages/catalog/src/examples/generative-thread.tsx',
};
function generate() {
  const sources = Object.fromEntries(Object.entries(files).map(([id, file]) => [id, { file, code: readFileSync(path.join(root, file), 'utf8') }]));
  const output = JSON.stringify(sources);
  for (const directory of ['src', 'dist']) {
    mkdirSync(path.join(root, 'packages/catalog', directory), { recursive: true });
    writeFileSync(path.join(root, 'packages/catalog', directory, 'source-snapshots.json'), output);
  }
}
generate();
if (process.argv.includes('--watch')) for (const file of Object.values(files)) watch(path.join(root, file), generate);
