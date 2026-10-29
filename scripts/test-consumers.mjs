import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd(),
  temp = await mkdtemp(join(tmpdir(), 'darwinui-consumers-'));
const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: 'inherit', env: { ...process.env, CI: 'true', NEXT_TELEMETRY_DISABLED: '1' } });
try {
  const packs = join(temp, 'packs');
  await mkdir(packs);
  for (const name of ['core', 'react', 'mcp'])
    run('pnpm', ['pack', '--pack-destination', packs], resolve(root, 'packages', name));
  const files = await readdir(packs);
  const dependencies = Object.fromEntries(
    ['core', 'react', 'mcp'].map((name) => [
      `@darwinui/${name}`,
      `file:${join(
        packs,
        files.find((file) => file.startsWith('darwinui-' + name + '-')),
      )}`,
    ]),
  );
  for (const kind of ['vite', 'next']) {
    const dir = join(temp, kind);
    await mkdir(dir);
    await writeFile(
      join(dir, 'package.json'),
      JSON.stringify({
        name: 'darwinui-consumer-' + kind,
        private: true,
        type: 'module',
        dependencies: {
          ...dependencies,
          react: '19.2.0',
          'react-dom': '19.2.0',
          ...(kind === 'vite' ? { vite: '6.3.5' } : { next: '16.1.5' }),
        },
        pnpm: { overrides: dependencies },
      }),
    );
    const component = `'use client';\nimport React from 'react';import {DarwinUIProvider,AgentIdentity} from '@darwinui/react';import '@darwinui/react/styles.css';export default function Demo(){return <DarwinUIProvider><AgentIdentity agent={{id:'test',name:'Consumer test'}}/></DarwinUIProvider>}`;
    if (kind === 'vite') {
      await writeFile(join(dir, 'index.html'), '<div id="root"></div><script type="module" src="/main.jsx"></script>');
      await writeFile(join(dir, 'demo.jsx'), component);
      await writeFile(
        join(dir, 'main.jsx'),
        "import React from 'react';import {createRoot} from 'react-dom/client';import Demo from './demo.jsx';createRoot(document.getElementById('root')).render(<Demo/>);",
      );
    } else {
      await mkdir(join(dir, 'app'));
      await writeFile(join(dir, 'app/page.jsx'), component);
      await writeFile(
        join(dir, 'app/layout.jsx'),
        "export default function Layout({children}){return <html lang='en'><body>{children}</body></html>}",
      );
      await writeFile(join(dir, 'next.config.mjs'), 'export default { experimental: { cpus: 2 } };');
    }
    run('pnpm', ['install', '--ignore-scripts'], dir);
    run('pnpm', ['exec', kind, 'build'], dir);
    run(
      'node',
      [
        '--input-type=module',
        '-e',
        "import React from 'react';import {createRequire} from 'node:module';const require=createRequire(import.meta.url);const libRequire=createRequire(require.resolve('@darwinui/react'));if(libRequire('react')!==React)throw new Error('Duplicate React');",
      ],
      dir,
    );
  }
  console.log('Packed Vite and Next consumers passed.');
} finally {
  await rm(temp, { recursive: true, force: true });
}
