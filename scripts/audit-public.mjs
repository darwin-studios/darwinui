import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const skip = new Set(['node_modules', 'dist', '.next', 'coverage', 'test-results', 'playwright-report', '.git']);
let count = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    if ((entry.name.startsWith('.env') && entry.name !== '.env.example') || /\.(pem|key)$/.test(entry.name))
      throw new Error(`Private configuration is not exportable: ${entry.name}`);
    const path = resolve(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${path}`);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!/\.(tsx?|m?js|json|css|ya?ml)$/.test(path)) continue;
    const text = await readFile(path, 'utf8');
    if (/(?:from\s*|import\s*\(|require\s*\()\s*['"](?:@repo\/|@\/)/.test(text))
      throw new Error(`Private import: ${path}`);
    if (/(?:sk_live_|ghp_)[A-Za-z0-9]{16,}/.test(text)) throw new Error(`Credential-like value: ${path}`);
    count++;
  }
}
await walk(process.cwd());
for (const name of ['core', 'react', 'mcp']) {
  const pkg = JSON.parse(await readFile(`packages/${name}/package.json`));
  for (const dep of Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })) {
    if (dep.startsWith('@repo/')) throw new Error(`Private dependency: ${dep}`);
  }
}
console.log(`Public-source audit passed (${count} files). Manual asset and secret review remains required.`);
