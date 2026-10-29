import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'vite';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const dependencies = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });
const entries = Object.values(pkg.exports)
  .filter((value) => typeof value === 'object')
  .map((value) => resolve(value.development));
await build({
  configFile: false,
  esbuild: { jsx: 'automatic' },
  build: {
    emptyOutDir: true,
    minify: false,
    lib: { entry: entries, formats: ['es'] },
    rollupOptions: {
      external: (id) => id.startsWith('node:') || dependencies.some((dep) => id === dep || id.startsWith(dep + '/')),
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) return;
        warn(warning);
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: resolve('src'),
        entryFileNames: '[name].js',
        banner: pkg.name === '@darwinui/react' ? "'use client';" : undefined,
      },
    },
  },
});
